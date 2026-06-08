import { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header/Header';
import { Tabs } from './components/Tabs/Tabs';
import { ScoreItem } from './components/ScoreItem/ScoreItem';
import { CommentBox } from './components/CommentBox/CommentBox';
import { Summary } from './components/Summary/Summary';
import { ConfirmDialog } from './components/ConfirmDialog/ConfirmDialog';
import { Chevron } from './components/icons';
import { useToast } from './components/Toast/Toast';
import { rubric } from './rubric/rubric';
import { grandMax, grandTotal, overallCompletion, tabCompletion } from './rubric/selectors';
import type { RubricSection, RubricTab, TabId } from './rubric/types';
import { useGrading } from './state/useGrading';
import { downloadExport, parseImport } from './lib/exportImport';
import { downloadExcel } from './lib/exportExcel';
import styles from './App.module.css';

const FOCUS_KEY = 'demo-grading-focus-ungraded';

export default function App() {
  const grading = useGrading();
  const { notify } = useToast();
  const [activeTab, setActiveTab] = useState<TabId>('Deployment');
  const [confirmClear, setConfirmClear] = useState(false);

  // Focus on outstanding items: a global "show only ungraded" filter,
  // per-section collapse overrides, and a stable snapshot of which items to keep
  // visible while grading (so a freshly-graded item doesn't vanish mid-edit).
  const [focusUngraded, setFocusUngraded] = useState<boolean>(() => {
    try {
      return localStorage.getItem(FOCUS_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [snapshot, setSnapshot] = useState<Set<string> | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(FOCUS_KEY, focusUngraded ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, [focusUngraded]);

  const tab = useMemo<RubricTab>(
    () => rubric.tabs.find((t) => t.id === activeTab) ?? rubric.tabs[0]!,
    [activeTab],
  );

  const total = grandTotal(rubric, grading.grades);
  const max = grandMax(rubric);
  const completion = overallCompletion(rubric, grading.grades);

  const isGraded = (key: string) => key in grading.grades;
  const computeUngraded = () =>
    new Set(Object.values(rubric.items).filter((i) => !isGraded(i.key)).map((i) => i.key));

  const selectTab = (id: TabId) => {
    if (id === 'Outstanding') setSnapshot(computeUngraded());
    setActiveTab(id);
  };

  const toggleFocus = () => {
    setFocusUngraded((prev) => {
      const next = !prev;
      if (next) setSnapshot(computeUngraded());
      return next;
    });
  };

  const refreshSnapshot = () => setSnapshot(computeUngraded());

  const renderItem = (key: string) => {
    const item = rubric.items[key];
    if (!item) return null;
    return (
      <div key={key}>
        <ScoreItem
          item={item}
          value={grading.grades[key]}
          onChange={(v) => grading.setGrade(key, v)}
        />
        {item.hasComment !== false && (
          <CommentBox
            value={grading.comments[key] ?? ''}
            placeholder={item.commentPlaceholder}
            onCommit={(v) => grading.setComment(key, v)}
          />
        )}
      </div>
    );
  };

  /** Render one scored section with collapse + ungraded-focus handling. */
  const renderSection = (section: RubricSection, idx: number) => {
    const allKeys = section.items.filter((k) => rubric.items[k]);
    const totalItems = allKeys.length;
    const doneItems = allKeys.filter(isGraded).length;

    const visibleKeys =
      focusUngraded && snapshot ? allKeys.filter((k) => snapshot.has(k)) : allKeys;
    if (focusUngraded && visibleKeys.length === 0) return null;

    const key = `${tab.id}::${section.title ?? idx}`;
    const autoCollapsed = totalItems > 0 && doneItems === totalItems;
    const isCollapsed = focusUngraded ? false : (collapsed[key] ?? autoCollapsed);
    const complete = totalItems > 0 && doneItems === totalItems;

    const count = section.title && (
      <span className={`${styles.sectionCount} ${complete ? styles.sectionCountDone : ''}`}>
        {doneItems}/{totalItems}
      </span>
    );

    return (
      <div key={key} className={styles.section}>
        {section.title &&
          (focusUngraded ? (
            <h3 className={styles.sectionTitle}>
              {section.title} {count}
            </h3>
          ) : (
            <button
              type="button"
              className={styles.sectionHeader}
              aria-expanded={!isCollapsed}
              onClick={() => setCollapsed((c) => ({ ...c, [key]: !isCollapsed }))}
            >
              <span className={`${styles.chevron} ${isCollapsed ? styles.chevronCollapsed : ''}`}>
                <Chevron size={16} />
              </span>
              <span className={styles.sectionHeaderTitle}>{section.title}</span>
              {count}
            </button>
          ))}
        {!isCollapsed && (
          <>
            {section.alert && (
              <div className={`${styles.alert} ${styles[section.alert.tone]}`}>
                {section.alert.text}
              </div>
            )}
            {section.intro && <div className={styles.intro}>{section.intro}</div>}
            {visibleKeys.map(renderItem)}
          </>
        )}
      </div>
    );
  };

  /** The "Outstanding" tab: every item that was ungraded when the tab was opened,
   *  grouped by its owning tab/section. Items stay listed (greyed once graded)
   *  until "Refresh list" so grading them doesn't reflow the page mid-edit. */
  const renderOutstanding = () => {
    const snap = snapshot ?? computeUngraded();
    const remaining = [...snap].filter((k) => !isGraded(k)).length;

    return (
      <>
        <h2 className={styles.panelTitle}>Outstanding items</h2>
        <p className={styles.panelIlos}>Items that still need a grade, gathered from every tab.</p>

        <div className={styles.filterBar}>
          <span className={styles.filterStat}>
            {remaining} of {snap.size} captured item{snap.size === 1 ? '' : 's'} still ungraded
          </span>
          <button type="button" className={styles.refreshBtn} onClick={refreshSnapshot}>
            Refresh list
          </button>
        </div>

        {snap.size === 0 ? (
          <div className={styles.allDone}>🎉 Everything is graded — nothing outstanding.</div>
        ) : (
          <>
            {remaining === 0 && (
              <div className={styles.allDone}>
                ✓ All captured items graded — Refresh to clear the list.
              </div>
            )}
            {rubric.tabs
              .filter((t) => t.scored)
              .map((t) => {
                const groups = t.sections
                  .map((s) => ({
                    s,
                    keys: s.items.filter((k) => snap.has(k) && rubric.items[k]),
                  }))
                  .filter((g) => g.keys.length > 0);
                if (groups.length === 0) return null;
                return (
                  <div key={t.id} className={styles.outGroup}>
                    <h3 className={styles.outTabName}>{t.name}</h3>
                    {groups.map((g, i) => (
                      <div key={i} className={styles.outSection}>
                        {g.s.title && <div className={styles.outSectionTitle}>{g.s.title}</div>}
                        {g.keys.map(renderItem)}
                      </div>
                    ))}
                  </div>
                );
              })}
          </>
        )}
      </>
    );
  };

  const handleExport = () => {
    if (!grading.groupName.trim()) {
      notify('Enter a group name before exporting.', 'error');
      return;
    }
    try {
      const filename = downloadExport({
        groupName: grading.groupName,
        grades: grading.grades,
        comments: grading.comments,
      });
      grading.markExported();
      notify(`Exported ${filename}`, 'success');
    } catch (err) {
      console.error(err);
      notify('Export failed. Please try again.', 'error');
    }
  };

  const handleExportExcel = async () => {
    if (!grading.groupName.trim()) {
      notify('Enter a group name before exporting.', 'error');
      return;
    }
    try {
      const filename = await downloadExcel({
        groupName: grading.groupName,
        grades: grading.grades,
        comments: grading.comments,
      });
      notify(`Exported ${filename}`, 'success');
    } catch (err) {
      console.error(err);
      notify('Excel export failed. Please try again.', 'error');
    }
  };

  const handleImportFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = parseImport(String(reader.result));
        grading.importData({
          groupName: parsed.groupName,
          grades: parsed.grades,
          comments: parsed.comments,
        });
        notify(`Imported ${parsed.count} graded item${parsed.count === 1 ? '' : 's'}.`, 'success');
      } catch (err) {
        console.error(err);
        notify('Could not read that file — is it a valid grading export?', 'error');
      }
    };
    reader.onerror = () => notify('Failed to read the file.', 'error');
    reader.readAsText(file);
  };

  const handleClear = () => {
    grading.clearAll();
    setConfirmClear(false);
    notify('All grading data cleared.', 'success');
  };

  return (
    <div className={styles.app}>
      <Header
        groupName={grading.groupName}
        total={total}
        max={max}
        completionDone={completion.done}
        completionTotal={completion.total}
        lastSaved={grading.lastSaved}
        dirtySinceExport={grading.dirtySinceExport}
        onGroupNameChange={grading.setGroupName}
        onExport={handleExport}
        onExportExcel={handleExportExcel}
        onImportFile={handleImportFile}
        onClear={() => setConfirmClear(true)}
      />

      <main className={styles.main}>
        <Tabs active={activeTab} grades={grading.grades} onSelect={selectTab} />

        <div className={styles.panel}>
          {activeTab === 'Outstanding'
            ? renderOutstanding()
            : (
                <>
                  <h2 className={styles.panelTitle}>{tab.name}</h2>
                  <p className={styles.panelIlos}>Covers: {tab.ilosLabel}</p>

                  {tab.scored && (
                    <div className={styles.filterBar}>
                      <button
                        type="button"
                        className={`${styles.filterToggle} ${
                          focusUngraded ? styles.filterToggleOn : ''
                        }`}
                        aria-pressed={focusUngraded}
                        onClick={toggleFocus}
                      >
                        {focusUngraded ? '✓ Showing only ungraded' : 'Show only ungraded'}
                      </button>
                      {(() => {
                        const c = tabCompletion(rubric, grading.grades, tab.id);
                        return (
                          <span className={styles.filterStat}>
                            {c.done}/{c.total} graded in this tab
                          </span>
                        );
                      })()}
                      {focusUngraded && (
                        <button
                          type="button"
                          className={styles.refreshBtn}
                          onClick={refreshSnapshot}
                        >
                          Refresh list
                        </button>
                      )}
                    </div>
                  )}

                  {/* Scored sections */}
                  {tab.sections.map((section, idx) => renderSection(section, idx))}

                  {/* Comment-only tab (Other ILOs) */}
                  {tab.commentOnly?.map((field) => (
                    <div key={field.key} className={styles.section}>
                      <div className={`${styles.alert} ${styles[field.alert.tone]}`}>
                        {field.alert.text}
                      </div>
                      <CommentBox
                        value={grading.comments[field.key] ?? ''}
                        placeholder={field.placeholder}
                        onCommit={(v) => grading.setComment(field.key, v)}
                      />
                    </div>
                  ))}

                  {/* Overall comment */}
                  {tab.overallCommentKey && (
                    <CommentBox
                      label="Overall comments"
                      value={grading.comments[tab.overallCommentKey] ?? ''}
                      placeholder={tab.overallCommentPlaceholder}
                      onCommit={(v) => grading.setComment(tab.overallCommentKey!, v)}
                    />
                  )}
                </>
              )}

          <Summary grades={grading.grades} />
        </div>
      </main>

      <ConfirmDialog
        open={confirmClear}
        title="Clear all grading data?"
        message="This permanently removes the group name, all scores, and all comments from this device. This cannot be undone. Export first if you want to keep a copy."
        confirmLabel="Clear everything"
        cancelLabel="Cancel"
        destructive
        onConfirm={handleClear}
        onCancel={() => setConfirmClear(false)}
      />
    </div>
  );
}

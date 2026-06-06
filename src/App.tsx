import { useMemo, useState } from 'react';
import { Header } from './components/Header/Header';
import { Tabs } from './components/Tabs/Tabs';
import { ScoreItem } from './components/ScoreItem/ScoreItem';
import { CommentBox } from './components/CommentBox/CommentBox';
import { Summary } from './components/Summary/Summary';
import { ConfirmDialog } from './components/ConfirmDialog/ConfirmDialog';
import { useToast } from './components/Toast/Toast';
import { rubric } from './rubric/rubric';
import { grandMax, grandTotal, overallCompletion } from './rubric/selectors';
import type { RubricTab, TabId } from './rubric/types';
import { useGrading } from './state/useGrading';
import { downloadExport, parseImport } from './lib/exportImport';
import styles from './App.module.css';

export default function App() {
  const grading = useGrading();
  const { notify } = useToast();
  const [activeTab, setActiveTab] = useState<TabId>('Deployment');
  const [confirmClear, setConfirmClear] = useState(false);

  const tab = useMemo<RubricTab>(
    () => rubric.tabs.find((t) => t.id === activeTab) ?? rubric.tabs[0]!,
    [activeTab],
  );

  const total = grandTotal(rubric, grading.grades);
  const max = grandMax(rubric);
  const completion = overallCompletion(rubric, grading.grades);

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
        onImportFile={handleImportFile}
        onClear={() => setConfirmClear(true)}
      />

      <main className={styles.main}>
        <Tabs active={activeTab} grades={grading.grades} onSelect={setActiveTab} />

        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>{tab.name}</h2>
          <p className={styles.panelIlos}>Covers: {tab.ilosLabel}</p>

          {/* Scored sections */}
          {tab.sections.map((section) => (
            <div key={section.title ?? section.items.join()} className={styles.section}>
              {section.title && <h3 className={styles.sectionTitle}>{section.title}</h3>}
              {section.alert && (
                <div className={`${styles.alert} ${styles[section.alert.tone]}`}>
                  {section.alert.text}
                </div>
              )}
              {section.intro && <div className={styles.intro}>{section.intro}</div>}
              {section.items.map((key) => {
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
              })}
            </div>
          ))}

          {/* Comment-only tab (Other ILOs) */}
          {tab.commentOnly?.map((field) => (
            <div key={field.key} className={styles.section}>
              <div className={`${styles.alert} ${styles[field.alert.tone]}`}>{field.alert.text}</div>
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

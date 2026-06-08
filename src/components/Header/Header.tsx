import { useRef } from 'react';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { Download, Trash, Upload } from '../icons';
import styles from './Header.module.css';

interface HeaderProps {
  groupName: string;
  total: number;
  max: number;
  completionDone: number;
  completionTotal: number;
  lastSaved: Date | null;
  dirtySinceExport: boolean;
  onGroupNameChange: (name: string) => void;
  onExport: () => void;
  onExportExcel: () => void;
  onImportFile: (file: File) => void;
  onClear: () => void;
}

export function Header({
  groupName,
  total,
  max,
  completionDone,
  completionTotal,
  lastSaved,
  dirtySinceExport,
  onGroupNameChange,
  onExport,
  onExportExcel,
  onImportFile,
  onClear,
}: HeaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <h1 className={styles.title}>Demo Day Grading System</h1>
        <ThemeToggle />
      </div>

      <div className={styles.groupRow}>
        <label className={styles.groupLabel} htmlFor="group-name">
          Group
        </label>
        <input
          id="group-name"
          type="text"
          className={styles.groupInput}
          value={groupName}
          placeholder="Enter group name…"
          onChange={(e) => onGroupNameChange(e.target.value)}
        />
      </div>

      <div className={styles.statsRow}>
        <div className={styles.totalBlock}>
          <span className={styles.totalValue}>
            {total}
            <span className={styles.totalMax}>/{max}</span>
          </span>
          <span className={styles.totalLabel}>total points</span>
        </div>
        <div className={styles.progressBlock}>
          <ProgressBar
            value={total}
            max={max}
            label="Overall"
            valueText={`${completionDone}/${completionTotal} items graded`}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.btn} ${styles.export}`}
          onClick={onExport}
          disabled={!groupName.trim()}
          title={!groupName.trim() ? 'Enter a group name first' : 'Export grading as JSON'}
        >
          <Download size={16} />
          <span>Export JSON</span>
        </button>

        <button
          type="button"
          className={`${styles.btn} ${styles.excel}`}
          onClick={onExportExcel}
          disabled={!groupName.trim()}
          title={
            !groupName.trim()
              ? 'Enter a group name first'
              : 'Export as the official Y2D 2026 rubric (.xlsx)'
          }
        >
          <Download size={16} />
          <span>Export Excel</span>
        </button>

        <button
          type="button"
          className={`${styles.btn} ${styles.import}`}
          onClick={() => fileRef.current?.click()}
        >
          <Upload size={16} />
          <span>Import</span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className={styles.hiddenFile}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImportFile(file);
            e.target.value = '';
          }}
        />

        <button type="button" className={`${styles.btn} ${styles.clear}`} onClick={onClear}>
          <Trash size={16} />
          <span>Clear All</span>
        </button>

        <span className={styles.saveStatus}>
          {dirtySinceExport && <span className={styles.dot} title="Unexported changes" />}
          {lastSaved ? `Saved · ${lastSaved.toLocaleTimeString()}` : 'Not saved yet'}
        </span>
      </div>
    </header>
  );
}

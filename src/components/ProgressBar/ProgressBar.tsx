import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  value: number;
  max: number;
  /** Optional label shown above the bar. */
  label?: string;
  /** Optional value text shown on the right of the label. */
  valueText?: string;
}

export function ProgressBar({ value, max, label, valueText }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className={styles.wrap}>
      {(label || valueText) && (
        <div className={styles.head}>
          {label && <span className={styles.label}>{label}</span>}
          {valueText && <span className={styles.value}>{valueText}</span>}
        </div>
      )}
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

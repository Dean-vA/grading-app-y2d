import { clamp, nominalMax } from '../../rubric/selectors';
import type { RubricItem } from '../../rubric/types';
import styles from './ScoreItem.module.css';

interface ScoreItemProps {
  item: RubricItem;
  /** Current value, or undefined if the item hasn't been graded yet. */
  value: number | undefined;
  onChange: (value: number | null) => void;
}

export function ScoreItem({ item, value, onChange }: ScoreItemProps) {
  const displayMax = nominalMax(item);
  const graded = value !== undefined;

  return (
    <div className={`${styles.card} ${graded ? styles.graded : ''}`}>
      <div className={styles.header}>
        <div className={styles.labelCol}>
          <span className={styles.label}>{item.label}</span>
          <span className={styles.ilo}>ILO {item.ilo}</span>
        </div>

        {item.input !== 'checkbox' && (
          <div className={styles.points}>
            <span className={styles.pointsLabel}>Points</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={item.maxPoints}
              className={styles.numberInput}
              value={value ?? ''}
              placeholder="0"
              aria-label={`Points for ${item.label}`}
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === '') return onChange(null);
                const parsed = parseInt(raw, 10);
                if (Number.isNaN(parsed)) return onChange(null);
                onChange(clamp(parsed, 0, item.maxPoints));
              }}
            />
            <span className={styles.pointsLabel}>/ {displayMax}</span>
          </div>
        )}
      </div>

      {item.criteriaNote && item.input !== 'checkbox' && (
        <p className={styles.note}>{item.criteriaNote}</p>
      )}

      {item.requirement && <pre className={styles.requirement}>{item.requirement}</pre>}

      {item.input === 'radio' && item.options && (
        <fieldset className={styles.criteria}>
          <legend className={styles.criteriaTitle}>Scoring criteria</legend>
          {item.options.map((opt) => (
            <label key={opt.points} className={styles.option}>
              <input
                type="radio"
                name={item.key}
                className={styles.radio}
                checked={value === opt.points}
                onChange={() => onChange(opt.points)}
              />
              <span className={`${styles.optLabel} ${styles[opt.tone]}`}>{opt.label}</span>
              <span className={styles.optDesc}>{opt.description}</span>
            </label>
          ))}
        </fieldset>
      )}

      {item.input === 'checkbox' && (
        <label className={styles.checkRow}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={value === 1}
            onChange={(e) => onChange(e.target.checked ? 1 : 0)}
          />
          <span>{item.criteriaNote ?? item.label}</span>
        </label>
      )}

      {item.input === 'number' && item.criteriaLines && (
        <div className={styles.criteria}>
          <div className={styles.criteriaTitle}>Scoring criteria</div>
          {item.criteriaLines.map((line, i) => (
            <div key={i} className={styles.criteriaLine}>
              <span className={`${styles.optLabel} ${styles[line.tone]}`}>{line.label}</span>
              <span className={styles.optDesc}>{line.description}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

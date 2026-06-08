import { rubric } from '../../rubric/rubric';
import { overallCompletion, tabCompletion, tabMax, tabTotal } from '../../rubric/selectors';
import type { Grades, TabId } from '../../rubric/types';
import styles from './Tabs.module.css';

interface TabsProps {
  active: TabId;
  grades: Grades;
  onSelect: (id: TabId) => void;
}

export function Tabs({ active, grades, onSelect }: TabsProps) {
  const overall = overallCompletion(rubric, grades);
  const ungraded = overall.total - overall.done;

  return (
    <nav className={styles.nav} aria-label="Rubric sections">
      {rubric.tabs.map((tab) => {
        const isActive = tab.id === active;
        const completion = tabCompletion(rubric, grades, tab.id);
        const complete = tab.scored && completion.total > 0 && completion.done === completion.total;
        return (
          <button
            key={tab.id}
            type="button"
            className={`${styles.tab} ${isActive ? styles.active : ''}`}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onSelect(tab.id)}
          >
            <span className={styles.name}>{tab.name}</span>
            {tab.scored ? (
              <span className={`${styles.badge} ${complete ? styles.badgeDone : ''}`}>
                {tabTotal(rubric, grades, tab.id)}/{tabMax(rubric, tab.id)}
              </span>
            ) : (
              <span className={styles.badge}>—</span>
            )}
          </button>
        );
      })}

      <button
        type="button"
        className={`${styles.tab} ${styles.outstandingTab} ${
          active === 'Outstanding' ? styles.active : ''
        }`}
        aria-current={active === 'Outstanding' ? 'page' : undefined}
        onClick={() => onSelect('Outstanding')}
      >
        <span className={styles.name}>★ Outstanding</span>
        <span
          className={`${styles.badge} ${ungraded === 0 ? styles.badgeDone : styles.badgeOutstanding}`}
        >
          {ungraded}
        </span>
      </button>
    </nav>
  );
}

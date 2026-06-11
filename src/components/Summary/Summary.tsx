import { rubric } from '../../rubric/rubric';
import {
  grandMax,
  grandTotal,
  iloMax,
  iloTotal,
  mustPassStatuses,
  tabMax,
  tabTotal,
} from '../../rubric/selectors';
import type { Grades } from '../../rubric/types';
import styles from './Summary.module.css';

interface SummaryProps {
  grades: Grades;
}

export function Summary({ grades }: SummaryProps) {
  const g = (key: string) => grades[key] ?? 0;
  const scoredTabs = rubric.tabs.filter((t) => t.scored);
  const mustPass = mustPassStatuses(rubric, grades);
  const anyAtRisk = mustPass.some((m) => !m.pass);

  const iloCards: { title: string; lines: string[] }[] = [
    {
      title: `ILO 4 (${iloTotal(rubric, grades, '4')}/${iloMax(rubric, '4')})`,
      lines: [
        `A: Architecture Diagrams & Plans (${g('ILO4_A')}/5)`,
        `B: Cost Analysis (${g('ILO4_B')}/4)`,
        `C: GPU Usage (${g('ILO4_C_GPU')}/1) — assessed in Azure ML tab`,
      ],
    },
    {
      title: `ILO 8 (${iloTotal(rubric, grades, '8')}/${iloMax(rubric, '8')})`,
      lines: [
        `A: Training Job (${g('ILO8_A_training') + g('ILO8_A_model')}/4)`,
        `• Training Success (${g('ILO8_A_training')}/3)`,
        `• Model Registration (${g('ILO8_A_model')}/1)`,
        `B: Advanced Features (${
          g('ILO8_B_pipeline') + g('ILO8_B_mlflow') + g('ILO8_B_scheduled') + g('ILO8_B_conditional')
        }/6)`,
        `• Pipeline/Tuning (${g('ILO8_B_pipeline')}/3)`,
        `• Experiment Tracking (${g('ILO8_B_mlflow')}/1)`,
        `• Scheduling/Trigger (${g('ILO8_B_scheduled')}/1)`,
        `• Conditional Registration (${g('ILO8_B_conditional')}/1)`,
      ],
    },
    {
      title: `ILO 9.3 (${iloTotal(rubric, grades, '9.3')}/${iloMax(rubric, '9.3')})`,
      lines: [
        `A: Code Quality (${g('ILO9_3_A')}/5)`,
        `B: Documentation (${g('ILO9_3_B_docs') + g('ILO9_3_B_readme')}/5)`,
        `• Published Docs (${g('ILO9_3_B_docs')}/4)`,
        `• README (${g('ILO9_3_B_readme')}/1, bonus 2)`,
        `C: Testing (${g('ILO9_3_C')}/5)`,
      ],
    },
    {
      title: `ILO 9.4 (${iloTotal(rubric, grades, '9.4')}/${iloMax(rubric, '9.4')})`,
      lines: [
        `A: Data Storage (${g('ILO9_4_A_raw') + g('ILO9_4_A_processed')}/5)`,
        `• Raw Data (${g('ILO9_4_A_raw')}/2)`,
        `• Processed Data (${g('ILO9_4_A_processed')}/3)`,
        `B: Pipeline (${g('ILO9_4_B_onprem') + g('ILO9_4_B_cloud') + g('ILO9_4_B_scheduled')}/10)`,
        `• On-prem Pipeline / Airflow (${g('ILO9_4_B_onprem')}/4)`,
        `• Cloud Pipeline (${g('ILO9_4_B_cloud')}/4)`,
        `• Scheduling/Trigger (${g('ILO9_4_B_scheduled')}/2)`,
      ],
    },
    {
      title: `ILO 9.5 (${iloTotal(rubric, grades, '9.5')}/${iloMax(rubric, '9.5')})`,
      lines: [
        `A: On-Premise Deployment (${g('ILO9_5_A')}/5)`,
        `B: GitHub & DevOps (${
          g('ILO9_5_B_branching') + g('ILO9_5_B_cicd_testing') + g('ILO9_5_B_cicd_build')
        }/5)`,
        `• Branching (${g('ILO9_5_B_branching')}/1)`,
        `• CI/CD Testing (${g('ILO9_5_B_cicd_testing')}/2)`,
        `• CI/CD Build + On-prem Deploy (${g('ILO9_5_B_cicd_build')}/2)`,
        `C: Cloud Deployment & Versioning (${
          g('ILO9_5_C_cloud') + g('ILO9_5_C') + g('ILO9_5_C_cd') + g('ILO9_5_D_bluegreen')
        }/5)`,
        `• Cloud Deploy (${g('ILO9_5_C_cloud')}/2)`,
        `• Model Store & Versioning (${g('ILO9_5_C')}/1)`,
        `• Cloud CD (${g('ILO9_5_C_cd')}/1)`,
        `• Blue-Green (${g('ILO9_5_D_bluegreen')}/1) — assessed in Azure ML tab`,
        `D: Retraining & Monitoring (${
          g('ILO9_5_D_feedback') +
          g('ILO9_5_D_data') +
          g('ILO9_5_D_trigger') +
          g('ILO9_5_D_deploy') +
          g('ILO9_5_D_monitoring')
        }/5)`,
        `• Retraining (${
          g('ILO9_5_D_feedback') + g('ILO9_5_D_data') + g('ILO9_5_D_trigger') + g('ILO9_5_D_deploy')
        }/4)`,
        `• Monitoring Solution (${g('ILO9_5_D_monitoring')}/1)`,
      ],
    },
    {
      title: `ILO 10 (${iloTotal(rubric, grades, '10')}/${iloMax(rubric, '10')})`,
      lines: [
        `A: Monitoring Dashboard (${g('ILO10_A_latency') + g('ILO10_A_confidence')}/4)`,
        `• Request Latency (${g('ILO10_A_latency')}/2)`,
        `• Model Confidence (${g('ILO10_A_confidence')}/2)`,
        `B: Frontend Quality (${g('ILO10_B')}/6)`,
      ],
    },
    {
      title: 'Other ILOs (TBD)',
      lines: ['ILO 1: Post-demo assessment', 'ILO 2: Post-demo + demeanor'],
    },
  ];

  return (
    <section className={styles.summary}>
      <h3 className={styles.heading}>Grading Summary</h3>

      <div className={styles.artifactGrid}>
        {scoredTabs.map((tab) => (
          <div key={tab.id} className={styles.artifact}>
            <div className={styles.artifactName}>{tab.name}</div>
            <div className={styles.artifactScore}>
              {tabTotal(rubric, grades, tab.id)}/{tabMax(rubric, tab.id)}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.totalRow}>
        Total: {grandTotal(rubric, grades)} / {grandMax(rubric)} points
      </div>

      <div className={`${styles.mustPass} ${anyAtRisk ? styles.mustPassWarn : ''}`}>
        <div className={styles.mustPassHeading}>
          Must-pass requirements (≥55% each — fail any and the block is not passed)
        </div>
        <div className={styles.mustPassGrid}>
          {mustPass.map((m) => (
            <div key={m.ilo} className={styles.mustPassRow}>
              <span className={styles.mustPassIlo}>ILO {m.ilo}</span>
              <span className={styles.mustPassScore}>
                {m.total}/{m.max} ({Math.round(m.pct * 100)}%)
              </span>
              <span className={`${styles.mustPassBadge} ${m.pass ? styles.pass : styles.fail}`}>
                {m.pass ? 'PASS' : 'AT RISK'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.breakdown}>
        <h4 className={styles.breakdownHeading}>ILO Breakdown</h4>
        <div className={styles.breakdownGrid}>
          {iloCards.map((card) => (
            <div key={card.title} className={styles.iloCard}>
              <div className={styles.iloTitle}>{card.title}</div>
              <div className={styles.iloLines}>
                {card.lines.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

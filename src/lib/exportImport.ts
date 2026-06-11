import { rubric } from '../rubric/rubric';
import {
  clamp,
  grandTotal,
  iloMax,
  iloTotal,
  mustPassStatuses,
  tabTotal,
} from '../rubric/selectors';
import type { Comments, Grades } from '../rubric/types';

const g = (grades: Grades, key: string) => grades[key] ?? 0;
const c = (comments: Comments, key: string) => comments[key] ?? '';

export interface ExportPayload {
  groupName: string;
  grades: Grades;
  comments: Comments;
}

/** Build the export object — schema-compatible with the original app. */
export function buildExport({ groupName, grades, comments }: ExportPayload) {
  const iloTotalStr = (ilo: Parameters<typeof iloTotal>[2]) =>
    `${iloTotal(rubric, grades, ilo)}/${iloMax(rubric, ilo)}`;

  const artifactSummary: Record<string, number> = {};
  for (const tab of rubric.tabs) {
    if (tab.scored) artifactSummary[tab.name] = tabTotal(rubric, grades, tab.id);
  }

  const mustPass: Record<string, { score: string; percent: number; pass: boolean }> = {};
  for (const m of mustPassStatuses(rubric, grades)) {
    mustPass[`ILO ${m.ilo}`] = {
      score: `${m.total}/${m.max}`,
      percent: Math.round(m.pct * 100),
      pass: m.pass,
    };
  }

  return {
    groupName: groupName.trim(),
    exportDate: new Date().toISOString(),
    totalPoints: grandTotal(rubric, grades),

    mustPass,

    artifactSummary,

    iloBreakdown: {
      'ILO 4': {
        total: iloTotalStr('4'),
        sections: {
          'A: Architecture Diagrams & Plans': `${g(grades, 'ILO4_A')}/5`,
          'B: Cost Analysis': `${g(grades, 'ILO4_B')}/4`,
          'C: GPU Usage': `${g(grades, 'ILO4_C_GPU')}/1`,
        },
        comments: {
          'Architecture Diagrams': c(comments, 'ILO4_A'),
          'Cost Analysis': c(comments, 'ILO4_B'),
          'GPU Usage': c(comments, 'ILO4_C_GPU'),
          Overall: c(comments, 'Diagrams_Overall'),
        },
      },
      'ILO 8': {
        total: iloTotalStr('8'),
        sections: {
          'A: Training Job': `${g(grades, 'ILO8_A_training') + g(grades, 'ILO8_A_model')}/4`,
          'B: Advanced Features': `${
            g(grades, 'ILO8_B_pipeline') +
            g(grades, 'ILO8_B_mlflow') +
            g(grades, 'ILO8_B_scheduled') +
            g(grades, 'ILO8_B_conditional')
          }/6`,
        },
        comments: {
          'Training Job': c(comments, 'ILO8_A_training'),
          'Model Registration': c(comments, 'ILO8_A_model'),
          Overall: c(comments, 'AzureML_Overall'),
        },
      },
      'ILO 9.3': {
        total: iloTotalStr('9.3'),
        sections: {
          'A: Code Quality': `${g(grades, 'ILO9_3_A')}/5`,
          'B: Documentation': `${g(grades, 'ILO9_3_B_docs') + g(grades, 'ILO9_3_B_readme')}/5`,
          'C: Testing': `${g(grades, 'ILO9_3_C')}/5`,
        },
        comments: {
          'Code Quality': c(comments, 'ILO9_3_A'),
          Documentation: c(comments, 'ILO9_3_B_docs'),
          Testing: c(comments, 'ILO9_3_C'),
          Overall: c(comments, 'Code_Overall'),
        },
      },
      'ILO 9.4': {
        total: iloTotalStr('9.4'),
        sections: {
          'A: Data Storage': `${g(grades, 'ILO9_4_A_raw') + g(grades, 'ILO9_4_A_processed')}/5`,
          'B: Pipeline': `${
            g(grades, 'ILO9_4_B_onprem') + g(grades, 'ILO9_4_B_cloud') + g(grades, 'ILO9_4_B_scheduled')
          }/10`,
          'B: On-prem Pipeline (Airflow)': `${g(grades, 'ILO9_4_B_onprem')}/4`,
          'B: Cloud Pipeline': `${g(grades, 'ILO9_4_B_cloud')}/4`,
          'B: Scheduling/Trigger': `${g(grades, 'ILO9_4_B_scheduled')}/2`,
        },
        comments: {
          'Data Storage': c(comments, 'ILO9_4_A_raw'),
          'On-prem Pipeline': c(comments, 'ILO9_4_B_onprem'),
          'Cloud Pipeline': c(comments, 'ILO9_4_B_cloud'),
          Overall: c(comments, 'Pipeline_Overall'),
        },
      },
      'ILO 9.5': {
        total: iloTotalStr('9.5'),
        sections: {
          'A: On-Premise Deployment': `${g(grades, 'ILO9_5_A')}/5`,
          'B: GitHub & DevOps': `${
            g(grades, 'ILO9_5_B_branching') +
            g(grades, 'ILO9_5_B_cicd_testing') +
            g(grades, 'ILO9_5_B_cicd_build')
          }/5`,
          'C: Cloud Deployment & Versioning': `${
            g(grades, 'ILO9_5_C_cloud') +
            g(grades, 'ILO9_5_C') +
            g(grades, 'ILO9_5_C_cd') +
            g(grades, 'ILO9_5_D_bluegreen')
          }/5`,
          'D: Retraining & Monitoring': `${
            g(grades, 'ILO9_5_D_feedback') +
            g(grades, 'ILO9_5_D_data') +
            g(grades, 'ILO9_5_D_trigger') +
            g(grades, 'ILO9_5_D_deploy') +
            g(grades, 'ILO9_5_D_monitoring')
          }/5`,
        },
        comments: {
          'On-prem Deployment': c(comments, 'ILO9_5_A'),
          DevOps: c(comments, 'ILO9_5_B_branching'),
          'Cloud Deployment': c(comments, 'ILO9_5_C_cloud'),
          'Model Versioning': c(comments, 'ILO9_5_C'),
          'Cloud CD': c(comments, 'ILO9_5_C_cd'),
          'Blue-Green': c(comments, 'ILO9_5_D_bluegreen'),
          Retraining: c(comments, 'ILO9_5_D_feedback'),
          Monitoring: c(comments, 'ILO9_5_D_monitoring'),
          Overall: c(comments, 'Deployment_Overall'),
        },
      },
      'ILO 10': {
        total: iloTotalStr('10'),
        sections: {
          'A: Monitoring Dashboard': `${
            g(grades, 'ILO10_A_latency') + g(grades, 'ILO10_A_confidence')
          }/4`,
          'B: Frontend Quality': `${g(grades, 'ILO10_B')}/6`,
        },
        comments: {
          Monitoring: c(comments, 'ILO10_A_latency'),
          Frontend: c(comments, 'ILO10_B'),
          Overall: c(comments, 'Frontend_Overall'),
        },
      },
    },

    rawData: { grades, comments },
  };
}

/** Trigger a browser download of the export JSON. Returns the filename used. */
export function downloadExport(payload: ExportPayload): string {
  const data = buildExport(payload);
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const safeName = payload.groupName.trim().replace(/[^a-zA-Z0-9-_]/g, '_');
  const filename = `${safeName}-grading-${new Date().toISOString().split('T')[0]}.json`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return filename;
}

export interface ParsedImport {
  groupName: string;
  grades: Grades;
  comments: Comments;
  count: number;
}

/**
 * Parse a previously exported file OR a raw localStorage-shaped object.
 * Coerces/validates types and clamps known grades to their item maxima.
 * Unknown keys are preserved (lossless round-trip) but never affect totals.
 */
export function parseImport(raw: string): ParsedImport {
  const obj = JSON.parse(raw);
  if (typeof obj !== 'object' || obj === null) {
    throw new Error('File is not a valid grading object.');
  }

  // An export file nests grades/comments under rawData; localStorage keeps them top-level.
  const source = isObject(obj.rawData) ? obj.rawData : obj;
  const rawGrades = isObject(source.grades) ? source.grades : {};
  const rawComments = isObject(source.comments) ? source.comments : {};
  const groupName = typeof obj.groupName === 'string' ? obj.groupName : '';

  const grades: Grades = {};
  for (const [key, value] of Object.entries(rawGrades)) {
    const num = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(num)) continue;
    const item = rubric.items[key];
    grades[key] = item ? clamp(Math.round(num), 0, item.maxPoints) : Math.round(num);
  }

  const comments: Comments = {};
  for (const [key, value] of Object.entries(rawComments)) {
    if (typeof value === 'string') comments[key] = value;
  }

  return {
    groupName,
    grades,
    comments,
    count: Object.keys(grades).length,
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

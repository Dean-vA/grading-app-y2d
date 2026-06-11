/**
 * Export the current grading by filling the OFFICIAL "Graded Assessment Rubric" template
 * (bundled as an asset). The template is formula-driven: the per-ILO Score, Must-pass cells,
 * Final grade, Block pass/fail and Project total are Excel FORMULAS, and the PASS/FAIL colours
 * come from conditional formatting. So the app only writes the per-component "select points"
 * and the per-subcategory grader comments — Excel computes and colours everything else on open.
 */
import type { Comments, Grades } from '../rubric/types';
import templateUrl from '../assets/rubric-template.xlsx?url';
import { OFFICIAL_RUBRIC } from './officialRubric';

/**
 * Cell map for the template's "2D" sheet, keyed by Dublin descriptor code.
 * `selects` and `comments` are aligned with OFFICIAL_RUBRIC's component order (A/B/C/D):
 * each entry is the anchor cell for that component's select-points / comment box.
 */
const CELL_MAP: Record<string, { selects: string[]; comments: string[] }> = {
  '1.8': { selects: ['F17'], comments: ['F18'] },
  '2.8': { selects: ['F22', 'G22', 'H22'], comments: ['F23', 'G23', 'H23'] },
  '4.4': { selects: ['F27', 'H27'], comments: ['F28', 'H28'] },
  '8.9': { selects: ['F32', 'H32'], comments: ['F33', 'H33'] },
  '9.3': { selects: ['F37', 'G37', 'H37'], comments: ['F39', 'G39', 'H39'] },
  '9.4': { selects: ['F42', 'H42'], comments: ['F44', 'H44'] },
  '9.5': { selects: ['F47', 'G47', 'H47', 'I47'], comments: ['F49', 'G49', 'H49', 'I49'] },
  '10.3': { selects: ['F53', 'H53'], comments: ['F54', 'H54'] },
};

/**
 * App comment keys grouped per official component (subcategory), aligned with the component
 * order. Each component's box collects the comments from the app sub-items that roll up into it;
 * the relevant tab-overall note is folded into component A so nothing is lost.
 */
export const COMPONENT_COMMENTS: Record<string, string[][]> = {
  '1.8': [['ILO1']],
  '2.8': [['ILO2'], [], []],
  '4.4': [['ILO4_A', 'Diagrams_Overall'], ['ILO4_B', 'ILO4_C_GPU']],
  '8.9': [
    ['ILO8_A_training', 'ILO8_A_model', 'AzureML_Overall'],
    ['ILO8_B_pipeline', 'ILO8_B_mlflow', 'ILO8_B_scheduled', 'ILO8_B_conditional'],
  ],
  '9.3': [['ILO9_3_A', 'Code_Overall'], ['ILO9_3_B_docs', 'ILO9_3_B_readme'], ['ILO9_3_C']],
  '9.4': [
    ['ILO9_4_A_raw', 'ILO9_4_A_processed', 'Pipeline_Overall'],
    ['ILO9_4_B_onprem', 'ILO9_4_B_cloud', 'ILO9_4_B_scheduled'],
  ],
  '9.5': [
    ['ILO9_5_A', 'Deployment_Overall'],
    ['ILO9_5_B_branching', 'ILO9_5_B_cicd_testing', 'ILO9_5_B_cicd_build'],
    ['ILO9_5_C_cloud', 'ILO9_5_C', 'ILO9_5_C_cd', 'ILO9_5_D_bluegreen'],
    ['ILO9_5_D_feedback', 'ILO9_5_D_data', 'ILO9_5_D_trigger', 'ILO9_5_D_deploy', 'ILO9_5_D_monitoring'],
  ],
  '10.3': [['ILO10_A_latency', 'ILO10_A_confidence', 'Frontend_Overall'], ['ILO10_B']],
};

const SHEET_NAME = '2D';

function gatherComment(commentKeys: string[], comments: Comments): string {
  return commentKeys
    .map((k) => comments[k]?.trim())
    .filter((v): v is string => !!v)
    .join('\n\n');
}

export interface ExcelExportPayload {
  groupName: string;
  grades: Grades;
  comments: Comments;
}

/** Load the official template, fill in select-points + per-subcategory comments, return its bytes. */
export async function buildExcelBuffer({ grades, comments }: ExcelExportPayload): Promise<ArrayBuffer> {
  const ExcelJS = (await import('exceljs')).default;
  const templateBytes = await fetch(templateUrl).then((r) => r.arrayBuffer());

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(templateBytes);
  const ws = wb.getWorksheet(SHEET_NAME);
  if (!ws) throw new Error(`Template is missing the "${SHEET_NAME}" worksheet`);

  for (const ilo of OFFICIAL_RUBRIC) {
    for (const d of ilo.descriptors) {
      const map = CELL_MAP[d.code];
      const commentGroups = COMPONENT_COMMENTS[d.code];
      if (!map) continue;

      d.components.forEach((comp, i) => {
        // Per-component score into the "select points:" cell (the Score formula sums them).
        const sel = map.selects[i];
        if (sel) ws.getCell(sel).value = Math.min(comp.score(grades), comp.max);

        // Per-component (subcategory) comment into its own comment box.
        const cell = map.comments[i];
        const keys = commentGroups?.[i];
        if (cell && keys) {
          const text = gatherComment(keys, comments);
          if (text) ws.getCell(cell).value = text;
        }
      });
    }
  }

  return wb.xlsx.writeBuffer();
}

/** Build the filled template and trigger a browser download. Returns the filename used. */
export async function downloadExcel(payload: ExcelExportPayload): Promise<string> {
  const { groupName } = payload;
  const buffer = await buildExcelBuffer(payload);
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const safeName = groupName.trim().replace(/[^a-zA-Z0-9-_]/g, '_') || 'grading';
  const filename = `${safeName}-rubric-${new Date().toISOString().split('T')[0]}.xlsx`;

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

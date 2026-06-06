import type { Rubric, RubricItem, RubricTab } from './types';

/**
 * Full rubric, transcribed verbatim from the original single-file app.
 * Items are the single source of truth; tab/section structure references them by key.
 * Each item owns its `ilo` independently of the `tab` it renders in — this is how the
 * two cross-tab items (GPU → ILO 4, Blue-Green → ILO 9.5) are handled without special cases.
 */

const ITEMS: RubricItem[] = [
  /* ---------------------------- Deployment & DevOps (ILO 9.5) ---------------------------- */
  {
    key: 'ILO9_5_A',
    label: 'Application Deployment (On-prem [portainer] and cloud)',
    maxPoints: 5,
    input: 'radio',
    ilo: '9.5',
    tab: 'Deployment',
    section: 'A: Deployed Application (5 Points)',
    options: [
      {
        points: 5,
        label: '5 points:',
        description:
          'Backend and frontend running on portainer (2pts) + Backend and frontend running on Azure (3pts)',
        tone: 'good',
      },
      {
        points: 3,
        label: '3 points:',
        description: 'Backend and frontend running on Azure and inference works',
        tone: 'warn',
      },
      {
        points: 2,
        label: '2 points:',
        description:
          'Backend and frontend running on portainer and inference works OR Backend running on Azure with FastAPI docs and inference works',
        tone: 'warn',
      },
      {
        points: 1,
        label: '1 point:',
        description:
          'Backend running on portainer with FastAPI docs and inference works OR Only running locally (max 1 point)',
        tone: 'bad',
      },
      { points: 0, label: '0 points:', description: 'No working deployment', tone: 'neutral' },
    ],
    commentPlaceholder: 'Comments on application deployment...',
  },
  {
    key: 'ILO9_5_B_branching',
    label: 'Branching Strategy (Main protected, merge by pull requests)',
    maxPoints: 2,
    input: 'number',
    ilo: '9.5',
    tab: 'Deployment',
    section: 'B: GitHub Repository & DevOps (5 Points)',
    commentPlaceholder: 'Comments on branching strategy and pull request workflow...',
  },
  {
    key: 'ILO9_5_B_cicd_testing',
    label: 'CI/CD - Automated linting and unit testing',
    maxPoints: 2,
    input: 'number',
    ilo: '9.5',
    tab: 'Deployment',
    section: 'B: GitHub Repository & DevOps (5 Points)',
    commentPlaceholder: 'Comments on automated testing in CI/CD...',
  },
  {
    key: 'ILO9_5_B_cicd_build',
    label: 'CI/CD - Automated container build and push',
    maxPoints: 1,
    input: 'number',
    ilo: '9.5',
    tab: 'Deployment',
    section: 'B: GitHub Repository & DevOps (5 Points)',
    commentPlaceholder: 'Comments on automated container builds...',
  },
  {
    key: 'ILO9_5_C',
    label: 'Model Store Integration',
    maxPoints: 3,
    input: 'radio',
    ilo: '9.5',
    tab: 'Deployment',
    section: 'C: Model Integration (5 Points)',
    options: [
      {
        points: 3,
        label: '3 points:',
        description:
          'Models properly registered in model store from training pipeline AND successfully downloaded/loaded in application',
        tone: 'good',
      },
      {
        points: 1,
        label: '1 point:',
        description: 'Either registration OR downloading works, but not the complete flow',
        tone: 'warn',
      },
      { points: 0, label: '0 points:', description: 'No model store integration', tone: 'neutral' },
    ],
    commentPlaceholder:
      'Comments on model store integration (registration from training + loading in application)...',
  },
  {
    key: 'ILO9_5_C_pipeline',
    label: 'Training Pipeline Integration',
    maxPoints: 2,
    input: 'radio',
    ilo: '9.5',
    tab: 'Deployment',
    section: 'C: Model Integration (5 Points)',
    options: [
      {
        points: 2,
        label: '2 points:',
        description:
          'Clear integration between training pipeline outputs and application deployment (automated or well-documented process)',
        tone: 'good',
      },
      {
        points: 1,
        label: '1 point:',
        description: 'Manual process exists but requires significant intervention',
        tone: 'warn',
      },
      {
        points: 0,
        label: '0 points:',
        description: 'No clear integration between training and deployment',
        tone: 'neutral',
      },
    ],
    commentPlaceholder: 'Comments on training pipeline to deployment integration process...',
  },
  {
    key: 'ILO9_5_D_feedback',
    label: 'User feedback on predictions in place',
    maxPoints: 1,
    input: 'number',
    ilo: '9.5',
    tab: 'Deployment',
    section: 'D: Retraining Pipeline (4 Points)',
    commentPlaceholder: 'Comments on user feedback collection system...',
  },
  {
    key: 'ILO9_5_D_data',
    label: 'Data stored in data store and processed with data pipeline',
    maxPoints: 1,
    input: 'number',
    ilo: '9.5',
    tab: 'Deployment',
    section: 'D: Retraining Pipeline (4 Points)',
    commentPlaceholder: 'Comments on data storage and pipeline integration...',
  },
  {
    key: 'ILO9_5_D_trigger',
    label: 'New training jobs triggered to retrain on new data',
    maxPoints: 1,
    input: 'number',
    ilo: '9.5',
    tab: 'Deployment',
    section: 'D: Retraining Pipeline (4 Points)',
    commentPlaceholder: 'Comments on automatic training job triggers...',
  },
  {
    key: 'ILO9_5_D_deploy',
    label: 'New models automatically deployed',
    maxPoints: 1,
    input: 'number',
    ilo: '9.5',
    tab: 'Deployment',
    section: 'D: Retraining Pipeline (4 Points)',
    commentPlaceholder: 'Comments on automatic model deployment...',
  },

  /* ---------------------------- Frontend & Monitoring (ILO 10) ---------------------------- */
  {
    key: 'ILO10_A_latency',
    label: 'Operational metrics: Request latency over time, or other relevant metrics',
    maxPoints: 2,
    input: 'number',
    ilo: '10',
    tab: 'Frontend',
    section: 'Monitoring Dashboard (4 Points)',
    commentPlaceholder: 'Comments on request latency monitoring...',
  },
  {
    key: 'ILO10_A_confidence',
    label: 'Model performance metrics: Model confidence, or other relevant metrics',
    maxPoints: 2,
    input: 'number',
    ilo: '10',
    tab: 'Frontend',
    section: 'Monitoring Dashboard (4 Points)',
    commentPlaceholder: 'Comments on model confidence monitoring...',
  },
  {
    key: 'ILO10_B',
    label: 'Frontend Assessment (Style, Functionality, Features, Visualizations)',
    maxPoints: 6,
    input: 'number',
    ilo: '10',
    tab: 'Frontend',
    section: 'Frontend Quality (6 Points)',
    commentPlaceholder: 'Comments on frontend quality and features...',
  },

  /* ---------------------- Azure ML & Training (ILO 4 GPU, 8, 9.4, 9.5 BG) ---------------------- */
  {
    key: 'ILO9_4_A_raw',
    label: 'Raw data in blob store uploaded using code',
    maxPoints: 2,
    input: 'number',
    ilo: '9.4',
    tab: 'AzureML',
    section: 'Data Storage (5 Points)',
    commentPlaceholder: 'Comments on raw data storage...',
  },
  {
    key: 'ILO9_4_A_processed',
    label: 'Processed data stored as data assets with versions (train/test/validation)',
    maxPoints: 3,
    input: 'number',
    ilo: '9.4',
    tab: 'AzureML',
    section: 'Data Storage (5 Points)',
    commentPlaceholder: 'Comments on processed data assets...',
  },
  {
    key: 'ILO8_A_training',
    label: 'Training job successfully run',
    maxPoints: 3,
    input: 'radio',
    ilo: '8',
    tab: 'AzureML',
    section: 'Training Job (4 Points)',
    options: [
      {
        points: 3,
        label: '3 points:',
        description: 'Logs make sense, metrics are good, and MLFlow metrics are present',
        tone: 'good',
      },
      {
        points: 2,
        label: '2 points:',
        description:
          'Performance metrics not very good, no MLFlow metrics, but everything runs successfully',
        tone: 'warn',
      },
      {
        points: 1,
        label: '1 point:',
        description: 'Some evidence of successful local training with good performance metrics',
        tone: 'bad',
      },
      { points: 0, label: '0 points:', description: 'No evidence of successful training', tone: 'neutral' },
    ],
    commentPlaceholder: 'Comments on training job implementation...',
  },
  {
    key: 'ILO8_A_model',
    label: 'Model registered in model store',
    maxPoints: 1,
    input: 'checkbox',
    ilo: '8',
    tab: 'AzureML',
    section: 'Training Job (4 Points)',
    criteriaNote: 'Model is registered in model store',
    commentPlaceholder: 'Comments on model registration...',
  },
  {
    key: 'ILO8_B_pipeline',
    label:
      'Training pipelines with multiple components hyperparameter tuning, multiple models/model architectures',
    maxPoints: 3,
    input: 'number',
    ilo: '8',
    tab: 'AzureML',
    section: 'Advanced Features (6 Points)',
    commentPlaceholder: 'Comments on training pipelines...',
  },
  {
    key: 'ILO8_B_mlflow',
    label: 'ML Flow metrics with graphs',
    maxPoints: 1,
    input: 'number',
    ilo: '8',
    tab: 'AzureML',
    section: 'Advanced Features (6 Points)',
    commentPlaceholder: 'Comments on MLFlow implementation...',
  },
  {
    key: 'ILO8_B_scheduled',
    label: 'Pipeline is scheduled with Airflow or AML',
    maxPoints: 1,
    input: 'number',
    ilo: '8',
    tab: 'AzureML',
    section: 'Advanced Features (6 Points)',
    commentPlaceholder: 'Comments on pipeline scheduling...',
  },
  {
    key: 'ILO8_B_retraining',
    label: 'Automated retraining implemented',
    maxPoints: 1,
    input: 'number',
    ilo: '8',
    tab: 'AzureML',
    section: 'Advanced Features (6 Points)',
    commentPlaceholder: 'Comments on automated retraining...',
  },
  {
    key: 'ILO4_C_GPU',
    label: 'Training/inference running on GPU (from ILO 4)',
    maxPoints: 1,
    input: 'number',
    ilo: '4',
    tab: 'AzureML',
    section: 'GPU Usage Assessment (1 Point)',
    commentPlaceholder: 'Comments on GPU usage for training/inference...',
  },
  {
    key: 'ILO9_5_D_bluegreen',
    label: 'Blue-green deployment implemented (from ILO 9.5 Section D)',
    maxPoints: 1,
    input: 'number',
    ilo: '9.5',
    tab: 'AzureML',
    section: 'Blue-Green Deployment Assessment (1 Point)',
    commentPlaceholder: 'Comments on blue-green deployment implementation...',
  },

  /* ---------------------------- Architecture & Cost Analysis (ILO 4) ---------------------------- */
  {
    key: 'ILO4_A',
    label: 'Architecture Diagrams and Plans (Package Plan, Cloud/On-Prem Diagrams, Roadmap)',
    maxPoints: 5,
    input: 'number',
    ilo: '4',
    tab: 'Diagrams',
    section: 'A: Architecture Diagrams and Plans (5 Points)',
    requirement:
      'Required Components:\n• Package Plan\n• Cloud and On-Prem Architecture Diagrams\n• Roadmap and High-level plan\n\nAssessment: 1-5 points based on completeness and quality of all components',
    commentPlaceholder:
      'Comments on architecture diagrams, package plan, and roadmap completeness and quality...',
  },
  {
    key: 'ILO4_B',
    label: 'Cost Analysis Document (Check if present, better to check next week)',
    maxPoints: 4,
    input: 'number',
    ilo: '4',
    tab: 'Diagrams',
    section: 'B: Cost Analysis (4 Points)',
    requirement:
      'Note: GPU usage assessment (1 point) should be checked with Azure ML workspace artifacts, not here.\nCost analysis document assessment only.',
    commentPlaceholder: 'Comments on cost analysis document...',
  },

  /* ---------------------------- Code Quality & Documentation (ILO 9.3) ---------------------------- */
  {
    key: 'ILO9_3_A',
    label: 'Code Quality Assessment',
    maxPoints: 5,
    input: 'number',
    ilo: '9.3',
    tab: 'Code',
    section: 'Code Quality (5 Points)',
    requirement:
      'Check codebase for: Best practice, Modularity, Logging, Doc strings, PEP8 compliance, Pre-commits set up',
    commentPlaceholder: 'Comments on code quality assessment...',
  },
  {
    key: 'ILO9_3_B_docs',
    label: 'Documentation published',
    maxPoints: 4,
    input: 'number',
    ilo: '9.3',
    tab: 'Code',
    section: 'Documentation (5 Points)',
    requirement:
      'Documentation requirements:\n• Clear and professional\n• Docs for all key functions\n• Usage and installation instructions with examples',
    criteriaLines: [
      {
        label: '4 points:',
        description: 'Documentation published on GitHub Pages (or other websites - not localhost)',
        tone: 'good',
      },
      { label: 'Max 1 point:', description: 'Documentation shown locally (localhost)', tone: 'warn' },
      {
        label: '0 points:',
        description: 'No documentation or inadequate documentation',
        tone: 'neutral',
      },
    ],
    commentPlaceholder: 'Comments on documentation quality and accessibility...',
  },
  {
    key: 'ILO9_3_B_readme',
    label: 'README.md in GitHub repo (clear, professional, with usage instructions)',
    maxPoints: 2,
    nominalMax: 1,
    input: 'number',
    ilo: '9.3',
    tab: 'Code',
    section: 'Documentation (5 Points)',
    criteriaNote: 'Standard: 1 point. Bonus: enter 2 if main docs are lacking but the README is really good.',
    commentPlaceholder: 'Comments on README quality...',
  },
  {
    key: 'ILO9_3_C',
    label: 'Unit Tests & Coverage Report',
    maxPoints: 5,
    input: 'radio',
    ilo: '9.3',
    tab: 'Code',
    section: 'Testing (5 Points)',
    options: [
      {
        points: 5,
        label: '5 points:',
        description: 'Coverage report with 85% coverage or higher',
        tone: 'good',
      },
      { points: 3, label: '3 points:', description: 'Coverage of 65% or higher', tone: 'warn' },
      { points: 1, label: '1 point:', description: 'Less than 50% coverage', tone: 'bad' },
      { points: 0, label: '0 points:', description: 'No working tests', tone: 'neutral' },
    ],
    commentPlaceholder: 'Comments on testing coverage and quality...',
  },

  /* ---------------------------- Data Pipelines (ILO 9.4) ---------------------------- */
  {
    key: 'ILO9_4_B_pipeline',
    label: 'Working Airflow/AML pipeline',
    maxPoints: 7,
    input: 'radio',
    ilo: '9.4',
    tab: 'Pipeline',
    section: 'Data Pipeline (10 Points)',
    hasComment: false,
    requirement:
      'Pipeline requirements:\n• Look at Airflow DAGs (all dark green)\n• Check data assets that they should create\n• Functioning data pipeline that processes raw data and registers data assets\n• Students should explain data flow, processing, and final data format',
    options: [
      {
        points: 7,
        label: '7 points:',
        description: 'Working Airflow pipeline that downloads data and registers assets',
        tone: 'good',
      },
      {
        points: 4,
        label: 'Max 4 points:',
        description: 'No Airflow but working AML pipeline',
        tone: 'warn',
      },
      { points: 0, label: '0 points:', description: 'No working pipeline', tone: 'neutral' },
    ],
  },
  {
    key: 'ILO9_4_B_scheduled',
    label: 'Pipeline scheduled based on reasonable criteria',
    maxPoints: 3,
    input: 'number',
    ilo: '9.4',
    tab: 'Pipeline',
    section: 'Data Pipeline (10 Points)',
    hasComment: false,
  },
];

const TABS: RubricTab[] = [
  {
    id: 'Deployment',
    name: 'Deployment & DevOps',
    ilosLabel: 'ILO 9.5',
    scored: true,
    overallCommentKey: 'Deployment_Overall',
    overallCommentPlaceholder: 'Overall comments on deployment and DevOps implementation...',
    sections: [
      { title: 'A: Deployed Application (5 Points)', items: ['ILO9_5_A'] },
      {
        title: 'B: GitHub Repository & DevOps (5 Points)',
        items: ['ILO9_5_B_branching', 'ILO9_5_B_cicd_testing', 'ILO9_5_B_cicd_build'],
      },
      { title: 'C: Model Integration (5 Points)', items: ['ILO9_5_C', 'ILO9_5_C_pipeline'] },
      {
        title: 'D: Retraining Pipeline (4 Points)',
        items: ['ILO9_5_D_feedback', 'ILO9_5_D_data', 'ILO9_5_D_trigger', 'ILO9_5_D_deploy'],
      },
    ],
  },
  {
    id: 'Frontend',
    name: 'Frontend & Monitoring',
    ilosLabel: 'ILO 10',
    scored: true,
    overallCommentKey: 'Frontend_Overall',
    overallCommentPlaceholder: 'Overall comments on monitoring dashboard and frontend...',
    sections: [
      { title: 'Monitoring Dashboard (4 Points)', items: ['ILO10_A_latency', 'ILO10_A_confidence'] },
      {
        title: 'Frontend Quality (6 Points)',
        intro: 'Assess: Style, Functionality, Features, Visualizations (max 4pts if no visualizations)',
        items: ['ILO10_B'],
      },
    ],
  },
  {
    id: 'AzureML',
    name: 'Azure ML & Training',
    ilosLabel: 'ILO 4 (GPU), 8, 9.4, 9.5 (Blue-Green)',
    scored: true,
    overallCommentKey: 'AzureML_Overall',
    overallCommentPlaceholder: 'Overall comments on Azure ML implementation...',
    sections: [
      { title: 'Data Storage (5 Points)', items: ['ILO9_4_A_raw', 'ILO9_4_A_processed'] },
      { title: 'Training Job (4 Points)', items: ['ILO8_A_training', 'ILO8_A_model'] },
      {
        title: 'Advanced Features (6 Points)',
        items: ['ILO8_B_pipeline', 'ILO8_B_mlflow', 'ILO8_B_scheduled', 'ILO8_B_retraining'],
      },
      {
        title: 'GPU Usage Assessment (1 Point)',
        alert: {
          tone: 'info',
          text: 'Note: This point is part of ILO 4 but should be assessed here with Azure ML artifacts.',
        },
        items: ['ILO4_C_GPU'],
      },
      {
        title: 'Blue-Green Deployment Assessment (1 Point)',
        alert: {
          tone: 'info',
          text: 'Note: This point is part of ILO 9.5 Section D but should be assessed with Azure ML workspace artifacts.',
        },
        items: ['ILO9_5_D_bluegreen'],
      },
    ],
  },
  {
    id: 'Diagrams',
    name: 'Architecture & Cost Analysis',
    ilosLabel: 'ILO 4',
    scored: true,
    overallCommentKey: 'Diagrams_Overall',
    overallCommentPlaceholder: 'Overall comments on architecture diagrams, plans, and cost analysis...',
    sections: [
      { title: 'A: Architecture Diagrams and Plans (5 Points)', items: ['ILO4_A'] },
      { title: 'B: Cost Analysis (4 Points)', items: ['ILO4_B'] },
    ],
  },
  {
    id: 'Code',
    name: 'Code Quality & Documentation',
    ilosLabel: 'ILO 9.3',
    scored: true,
    overallCommentKey: 'Code_Overall',
    overallCommentPlaceholder: 'Overall comments on code quality, documentation, and testing...',
    sections: [
      { title: 'Code Quality (5 Points)', items: ['ILO9_3_A'] },
      { title: 'Documentation (5 Points)', items: ['ILO9_3_B_docs', 'ILO9_3_B_readme'] },
      { title: 'Testing (5 Points)', items: ['ILO9_3_C'] },
    ],
  },
  {
    id: 'Pipeline',
    name: 'Data Pipelines',
    ilosLabel: 'ILO 9.4',
    scored: true,
    overallCommentKey: 'Pipeline_Overall',
    overallCommentPlaceholder: 'Comments on data pipelines and processing...',
    sections: [
      {
        title: 'Data Pipeline (10 Points)',
        alert: {
          tone: 'info',
          text: 'Note: Should be on server, but running locally is acceptable due to some issues.',
        },
        items: ['ILO9_4_B_pipeline', 'ILO9_4_B_scheduled'],
      },
    ],
  },
  {
    id: 'Other',
    name: 'Other ILOs',
    ilosLabel: 'ILO 1, 2',
    scored: false,
    sections: [],
    commentOnly: [
      {
        key: 'ILO1',
        alert: { tone: 'warn', text: 'ILO 1: Needs to be checked after demo day' },
        placeholder: 'Notes about ILO 1 assessment...',
      },
      {
        key: 'ILO2',
        alert: {
          tone: 'info',
          text: 'ILO 2: Checked after demo day but emotional demeanour on demo day can be taken into account',
        },
        placeholder: 'Notes about emotional demeanour and overall ILO 2 assessment...',
      },
    ],
  },
];

const itemsRecord: Record<string, RubricItem> = {};
for (const item of ITEMS) {
  itemsRecord[item.key] = item;
}

export const rubric: Rubric = {
  tabs: TABS,
  items: itemsRecord,
};

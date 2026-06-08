/**
 * Static content + grade mapping for the official "Assessment Rubric Y2D 2026".
 *
 * The grading app decomposes each official A/B/C/D component into granular sub-items; this module
 * aggregates those sub-item grades back into the official component scores so the Excel export
 * matches the institutional rubric exactly. Descriptor text is transcribed verbatim from the
 * official workbook.
 */
import type { Grades } from '../rubric/types';

const g = (grades: Grades, key: string) => grades[key] ?? 0;

export interface OfficialComponent {
  /** Column header, e.g. "A: 5 points". */
  header: string;
  /** Descriptor text shown in the component cell. */
  text: string;
  max: number;
  /** Aggregated app score for this component (clamped to max). */
  score: (grades: Grades) => number;
}

export interface OfficialDescriptor {
  /** Dublin descriptor code, e.g. "9.3". */
  code: string;
  /** Full descriptor sentence (shown in the left descriptor cell). */
  descriptor: string;
  /** Pre-requisite cell text. */
  prerequisite: string;
  components: OfficialComponent[];
  total: number;
  mustPass?: boolean;
  /** App comment keys gathered into a note on the Score cell. */
  commentKeys: string[];
}

export interface OfficialIlo {
  label: string;
  /** Grey band text describing the competency. */
  title: string;
  descriptors: OfficialDescriptor[];
}

const PREREQ_FULL =
  'The student submits a complete learning log, work log, and self-assessment rubric. The student exhibits professional behaviour during DataLab sessions. The student meets all requirements for end of block challenges.';
const PREREQ_BASE =
  'The student submits a complete learning log, work log, and self-assessment rubric. The student exhibits professional behaviour during DataLab sessions.';
const PREREQ_93 =
  'The student submits a complete learning log, work log, and self-assessment rubric. The student exhibits professional behaviour during DataLab sessions. Clear individual contribution to this ILO is documented.';

/** Clamp helper for the README documentation bonus (B caps at its official max). */
const capped = (value: number, max: number) => Math.min(value, max);

export const OFFICIAL_RUBRIC: OfficialIlo[] = [
  {
    label: 'ILO 1',
    title:
      'Professional practice. The student can collaborate (internationally) in multidisciplinary teams with different levels of knowledge in the field of data use and applications. They can set up and execute projects in collaboration with stakeholders and team members. They can act as a sounding board in discussions with team members, customers, users and experts. They strive for a good balance between input of their own vision and additional expertise of others. They are able to lead a team.',
    descriptors: [
      {
        code: '1.8',
        descriptor: '1.8 The student submits work to a professional standard.',
        prerequisite: PREREQ_FULL,
        total: 10,
        commentKeys: ['ILO1'],
        components: [
          {
            header: 'A: 10 points',
            text:
              'The student is able to produce and submit work that meets professional standards across all formats including code, reports, presentations, and peer reviews. All deliverables demonstrate a consistent level of polish, audience-awareness, and attention to detail. Reports are structured, formal, and free from casual language. Presentations are thoughtfully designed, visually appealing, and tailored to the intended audience. Code repositories are well-organised with clear README files, installation instructions, and usage examples. Project documentation is comprehensive, accessible, and appropriate for the intended audience. Peer reviews are conducted respectfully and constructively. Worklogs and learning logs are consistently maintained, detailed, and reflective, effectively capturing daily progress, key actions, and critical insights.',
            max: 10,
            // Assessed after demo day — not scored numerically in the app.
            score: () => 0,
          },
        ],
      },
    ],
  },
  {
    label: 'ILO 2',
    title:
      'Personal Development & Academic Practice. The student applies relevant (research) methods and techniques in combination with relevant and adequate argumentation. They can reflect on (business) processes and their role in them, both theoretically and practically, by constantly evaluating their own actions and adapting them with input from others. They can translate the result of the reflection into concrete personal learning objectives.',
    descriptors: [
      {
        code: '2.8',
        descriptor:
          '2.8 The student is able to recognize, understand, and manage their own emotions, as well as their ability to recognize, understand, and influence the emotions of others leading to considerate goal-setting and decision making and stress-management.',
        prerequisite: PREREQ_FULL,
        total: 10,
        commentKeys: ['ILO2'],
        components: [
          {
            header: 'A: 3 points',
            text:
              'The student is able to recognize, understand and manage their own emotions as evidenced by their peer review. The student is able on their capacity to self-monitor their emotions, such as stress, and create concrete action points which they actively pursue.',
            max: 3,
            score: () => 0,
          },
          {
            header: 'B: 3 points',
            text:
              'The student is able to recognize, understand and manage the emtions of others as evidenced by their peer review. The student is able to empathically reflect on the emtional conduct of others and provide constructive action points and support to improve the emotional conduct of other such as stress reduction.',
            max: 3,
            score: () => 0,
          },
          {
            header: 'C: 4 points',
            text:
              'The student is able to make appropriate decisions to further the progress of their own goals and those of others. The decisions of the student further the progress of the project and improve the quality of the team dynamics while keeping the needs and emotions of themselves and others in consideration leading to better individual, team & project outcomes.',
            max: 4,
            score: () => 0,
          },
        ],
      },
    ],
  },
  {
    label: 'ILO 4',
    title:
      'Problem Analysis. The student can analyze a problem by describing the context, trade-offs and formulation of the final demand (as a result of a process of demand articulation). In doing so, they identify the possible solutions. As a result, they can formulate an approach for a data trajectory considering relevant actors and interests, involving relevant theories and (technical) possibilities.',
    descriptors: [
      {
        code: '4.4',
        descriptor:
          '4.4 The student is able to propose a design and plan for a ML application architecture and data pipeline and evaluating the financial costs of the application.',
        prerequisite: PREREQ_BASE,
        total: 10,
        commentKeys: ['ILO4_A', 'ILO4_B', 'ILO4_C_GPU', 'Diagrams_Overall'],
        components: [
          {
            header: 'A: 5 points',
            text:
              'The student demonstrates the ability to design and plan a cloud-based ML application architecture and data pipeline that addresses the creative brief requirements.',
            max: 5,
            score: (gr) => g(gr, 'ILO4_A'),
          },
          {
            header: 'B: 5 points',
            text:
              'The student demonstrates the ability to evaluate the financial costs of the proposed cloud-based ML applications, employing cost-effective resource management and monitoring strategies to balance performance and budget constraints.',
            max: 5,
            score: (gr) => g(gr, 'ILO4_B') + g(gr, 'ILO4_C_GPU'),
          },
        ],
      },
    ],
  },
  {
    label: 'ILO 8',
    title:
      'Modelling. The student can apply modelling techniques including Machine Learning and AI to create value for individuals, organizations and domains.',
    descriptors: [
      {
        code: '8.9',
        descriptor:
          '8.9 The student demonstrates the ability to train machine learning models on multiple platforms both locally and in the cloud making use of appropriate resources, platforms and automation tools.',
        prerequisite: PREREQ_BASE,
        total: 10,
        commentKeys: [
          'ILO8_A_training',
          'ILO8_A_model',
          'ILO8_B_pipeline',
          'ILO8_B_mlflow',
          'ILO8_B_scheduled',
          'ILO8_B_retraining',
          'AzureML_Overall',
        ],
        components: [
          {
            header: 'A: 4 points',
            text:
              'The student demonstrates the ability to train models both locally and on an appropriate cloud platform using industry standard libararies to track key training and evaluation metrics. The student demonstrates the ability to use version control techniques and tools in the context of ML Models.',
            max: 4,
            score: (gr) => g(gr, 'ILO8_A_training') + g(gr, 'ILO8_A_model'),
          },
          {
            header: 'B: 6 points',
            text:
              'The student trains and evaluates multiple model architectures including custom and existing open-source models on cloud ML platforms. The student builds training and evaluation pipelines incorporating automated hyperparameter tuning and conditional model registration. Experiment tracking with advanced automated metric logging and visualisation is used to log key training and evaluation metrics, including learning curves and example outputs. The student demonstrates the ability to schedule or trigger pipelines based on appropriate criteria.',
            max: 6,
            score: (gr) =>
              g(gr, 'ILO8_B_pipeline') +
              g(gr, 'ILO8_B_mlflow') +
              g(gr, 'ILO8_B_scheduled') +
              g(gr, 'ILO8_B_retraining'),
          },
        ],
      },
    ],
  },
  {
    label: 'ILO 9',
    title:
      'Design, Prototyping and Implementation. The student can develop a prototype using an iterative cycle, explicitly involving stakeholders, and implement applications within an (existing) architecture.',
    descriptors: [
      {
        code: '9.3',
        descriptor:
          '9.3 The student demonstrates the ability to produce high quality code that adheres to industry standards. The code is packaged in such a way that it can be used by stakeholders outside of the development environment.',
        prerequisite: PREREQ_93,
        total: 15,
        mustPass: true,
        commentKeys: ['ILO9_3_A', 'ILO9_3_B_docs', 'ILO9_3_B_readme', 'ILO9_3_C', 'Code_Overall'],
        components: [
          {
            header: 'A: 5 points',
            text:
              'The student demonstrates the ability to write production ready code that adheres to industry technical standards for readability, logging, and error handling. Code must have function-specific docstrings that enhance clarity and usability. Code conforms to industry standard style guidelines and passes applicable linting and/or formatting checks.',
            max: 5,
            score: (gr) => g(gr, 'ILO9_3_A'),
          },
          {
            header: 'B: 5 points',
            text:
              'The student is able to document their code in a clear and professional manner. The documentation must include detailed usage instructions, installation instructions and examples.',
            max: 5,
            score: (gr) => capped(g(gr, 'ILO9_3_B_docs') + g(gr, 'ILO9_3_B_readme'), 5),
          },
          {
            header: 'C: 5 points',
            text:
              'The student is able to create comprehensive unit tests designed to achieve coverage levels that meet client requirements and ensure code reliability. Tests are written for all key functions and modules.',
            max: 5,
            score: (gr) => g(gr, 'ILO9_3_C'),
          },
        ],
      },
      {
        code: '9.4',
        descriptor:
          '9.4 The student demonstrates the ability to design and manage data solutions, including the secure storage and version control of data and implement data pipelines using industry standard tools and practices.',
        prerequisite: PREREQ_BASE,
        total: 15,
        mustPass: true,
        commentKeys: [
          'ILO9_4_A_raw',
          'ILO9_4_A_processed',
          'ILO9_4_B_pipeline',
          'ILO9_4_B_scheduled',
          'Pipeline_Overall',
        ],
        components: [
          {
            header: 'A: 5 points',
            text:
              'The student demonstrates the ability to store data in the cloud and manage data through code. The student applies version control to data assets.',
            max: 5,
            score: (gr) => g(gr, 'ILO9_4_A_raw') + g(gr, 'ILO9_4_A_processed'),
          },
          {
            header: 'B: 10 points',
            text:
              'The student is able to convert data preprocessing/processing code into a data pipeline. The group is able to perform all required data preprocessing and processing steps in data pipelines using industry standard tools. The data pipelines are run on a schedule or triggered automatically based on appropriate criteria.',
            max: 10,
            score: (gr) => g(gr, 'ILO9_4_B_pipeline') + g(gr, 'ILO9_4_B_scheduled'),
          },
        ],
      },
      {
        code: '9.5',
        descriptor:
          '9.5 The student demonstrates the ability to deploy and maintain machine learning solutions using industry-standard tools, integrating version control, continuous integration, automated pipelines, and monitoring practices for both local and cloud environments.',
        prerequisite: PREREQ_BASE,
        total: 20,
        mustPass: true,
        commentKeys: [
          'ILO9_5_A',
          'ILO9_5_B_branching',
          'ILO9_5_B_cicd_testing',
          'ILO9_5_B_cicd_build',
          'ILO9_5_C_cloud',
          'ILO9_5_C',
          'ILO9_5_C_cd',
          'ILO9_5_D_bluegreen',
          'ILO9_5_D_feedback',
          'ILO9_5_D_data',
          'ILO9_5_D_trigger',
          'ILO9_5_D_deploy',
          'ILO9_5_D_monitoring',
          'Deployment_Overall',
        ],
        components: [
          {
            header: 'A: 5 points',
            text:
              'The student is able to deploy an inference pipeline using industry standard tools. The student is able to interact with a deployed model locally and on on-premise infrastructure.',
            max: 5,
            score: (gr) => g(gr, 'ILO9_5_A'),
          },
          {
            header: 'B: 5 points',
            text:
              'The student is able to implement a GitHub branching strategy and automate both linting and unit tests. The deployment of the application is automated. The student is able to merge their code and ensure the tests pass.',
            max: 5,
            score: (gr) =>
              g(gr, 'ILO9_5_B_branching') +
              g(gr, 'ILO9_5_B_cicd_testing') +
              g(gr, 'ILO9_5_B_cicd_build'),
          },
          {
            header: 'C: 5 points',
            text:
              'The student is able to deploy registered models as endpoints and integrate them into the application. The student applies version control to models and is able to select model versions for use in the inference pipeline. The deployment process is automated and well-documented. The student deploys new model versions using appropriate deployment strategies.',
            max: 5,
            score: (gr) =>
              g(gr, 'ILO9_5_C_cloud') +
              g(gr, 'ILO9_5_C') +
              g(gr, 'ILO9_5_C_cd') +
              g(gr, 'ILO9_5_D_bluegreen'),
          },
          {
            header: 'D: 5 points',
            text:
              'The student can implement an automated machine learning retraining pipeline including automated model evaluation and deployment. Implement an appropiate monitoring solution, taking into account technical and business metrics, on the training process and the deployed models.',
            max: 5,
            score: (gr) =>
              g(gr, 'ILO9_5_D_feedback') +
              g(gr, 'ILO9_5_D_data') +
              g(gr, 'ILO9_5_D_trigger') +
              g(gr, 'ILO9_5_D_deploy') +
              g(gr, 'ILO9_5_D_monitoring'),
          },
        ],
      },
    ],
  },
  {
    label: 'ILO 10',
    title:
      'Visualization. The student can apply visualization and storytelling techniques and skills to effectively and accurately inform stakeholders about (interim) results of AI and DS approaches.',
    descriptors: [
      {
        code: '10.3',
        descriptor:
          '10.3 The student demonstrates the ability to vizualise the project outcomes in a deployed application.',
        prerequisite: PREREQ_BASE,
        total: 10,
        commentKeys: ['ILO10_A_latency', 'ILO10_A_confidence', 'ILO10_B', 'Frontend_Overall'],
        components: [
          {
            header: 'A: 4 points',
            text:
              'The student demonstrates the ability to connect the deployed application to a monitoring dashboard allowing for operational and performance metrics to be monitored. Tracing is implemented to identify bottlenecks in the deployment.',
            max: 4,
            score: (gr) => g(gr, 'ILO10_A_latency') + g(gr, 'ILO10_A_confidence'),
          },
          {
            header: 'B: 6 points',
            text:
              'The student demonstrates the ability to connect the deployed application to a user-friendly frontend in order to showcase the functionality to relevant stakeholders. Appropriate visualisations are integrated to convey business insights.',
            max: 6,
            score: (gr) => g(gr, 'ILO10_B'),
          },
        ],
      },
    ],
  },
];

/** Sum of a descriptor's component scores, clamped to its total. */
export function descriptorScore(d: OfficialDescriptor, grades: Grades): number {
  return Math.min(
    d.components.reduce((sum, comp) => sum + comp.score(grades), 0),
    d.total,
  );
}

/** Grand total across every descriptor (out of 100). */
export function officialGrandTotal(grades: Grades): number {
  return OFFICIAL_RUBRIC.flatMap((ilo) => ilo.descriptors).reduce(
    (sum, d) => sum + descriptorScore(d, grades),
    0,
  );
}

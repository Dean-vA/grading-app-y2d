export type TabId =
  | 'Deployment'
  | 'Frontend'
  | 'AzureML'
  | 'Diagrams'
  | 'Code'
  | 'Pipeline'
  | 'Other';

export type IloId = '1' | '2' | '4' | '8' | '9.3' | '9.4' | '9.5' | '10';

export type Tone = 'good' | 'warn' | 'bad' | 'neutral';

export type InputType = 'number' | 'radio' | 'checkbox';

/** A selectable scoring tier for `radio` items (exact point value). */
export interface RadioOption {
  points: number;
  label: string; // e.g. "5 points:" / "Max 4 points:"
  description: string; // sentence shown after the label
  tone: Tone;
}

/** A non-selectable scoring tier shown purely as guidance (e.g. the docs item). */
export interface CriteriaLine {
  label: string;
  description: string;
  tone: Tone;
}

export interface RubricItem {
  /** EXACT original grade key — preserved for localStorage/export compatibility. */
  key: string;
  label: string;
  maxPoints: number;
  /** Contribution to denominators; defaults to maxPoints. Used for the README bonus. */
  nominalMax?: number;
  input: InputType;
  /** Owning ILO for the breakdown — independent of which tab renders the item. */
  ilo: IloId;
  /** Tab that renders the item. */
  tab: TabId;
  /** Section heading the item lives under. */
  section: string;
  /** Required when input === 'radio'. */
  options?: RadioOption[];
  /** Multiline descriptive requirement block (rendered above the criteria). */
  requirement?: string;
  /** Short note shown under the label. */
  criteriaNote?: string;
  /** Read-only scoring guidance (e.g. docs/README items that use a number input). */
  criteriaLines?: CriteriaLine[];
  /** Whether a per-item comment box renders. Defaults to true. */
  hasComment?: boolean;
  /** Placeholder for the per-item comment box. */
  commentPlaceholder?: string;
}

export interface AlertNote {
  text: string;
  tone: 'info' | 'warn';
}

export interface RubricSection {
  title?: string;
  /** Descriptive box shown at the top of the section. */
  intro?: string;
  /** Alert banner shown in the section. */
  alert?: AlertNote;
  /** Item keys rendered in order. */
  items: string[];
}

/** Comment-only field (used by the 'Other' tab for ILO 1 / ILO 2). */
export interface CommentOnlyField {
  key: string;
  alert: AlertNote;
  placeholder: string;
}

export interface RubricTab {
  id: TabId;
  name: string;
  ilosLabel: string;
  /** Whether this tab contributes scored items (false for 'Other'). */
  scored: boolean;
  sections: RubricSection[];
  overallCommentKey?: string;
  overallCommentPlaceholder?: string;
  commentOnly?: CommentOnlyField[];
}

export interface Rubric {
  tabs: RubricTab[];
  /** All scored items, keyed by item.key. */
  items: Record<string, RubricItem>;
}

export type Grades = Record<string, number>;
export type Comments = Record<string, string>;

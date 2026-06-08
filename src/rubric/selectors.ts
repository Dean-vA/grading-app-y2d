import { MUST_PASS_ILOS } from './rubric';
import type { Grades, IloId, Rubric, RubricItem, TabId } from './types';

export function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

/** Nominal contribution to denominators (README bonus counts as 1, not 2). */
export function nominalMax(item: RubricItem): number {
  return item.nominalMax ?? item.maxPoints;
}

export function itemValue(grades: Grades, key: string): number {
  return grades[key] ?? 0;
}

function itemsForTab(rubric: Rubric, tab: TabId): RubricItem[] {
  return Object.values(rubric.items).filter((i) => i.tab === tab);
}

function itemsForIlo(rubric: Rubric, ilo: IloId): RubricItem[] {
  return Object.values(rubric.items).filter((i) => i.ilo === ilo);
}

export function tabTotal(rubric: Rubric, grades: Grades, tab: TabId): number {
  return itemsForTab(rubric, tab).reduce(
    (sum, i) => sum + clamp(itemValue(grades, i.key), 0, i.maxPoints),
    0,
  );
}

export function tabMax(rubric: Rubric, tab: TabId): number {
  return itemsForTab(rubric, tab).reduce((sum, i) => sum + nominalMax(i), 0);
}

export function iloTotal(rubric: Rubric, grades: Grades, ilo: IloId): number {
  return itemsForIlo(rubric, ilo).reduce(
    (sum, i) => sum + clamp(itemValue(grades, i.key), 0, i.maxPoints),
    0,
  );
}

export function iloMax(rubric: Rubric, ilo: IloId): number {
  return itemsForIlo(rubric, ilo).reduce((sum, i) => sum + nominalMax(i), 0);
}

export function grandTotal(rubric: Rubric, grades: Grades): number {
  return Object.values(rubric.items).reduce(
    (sum, i) => sum + clamp(itemValue(grades, i.key), 0, i.maxPoints),
    0,
  );
}

/** Nominal grand max — should equal 80. */
export function grandMax(rubric: Rubric): number {
  return Object.values(rubric.items).reduce((sum, i) => sum + nominalMax(i), 0);
}

export interface Completion {
  done: number;
  total: number;
}

/** A number/radio/checkbox item counts as "graded" once its key exists in grades. */
export function tabCompletion(rubric: Rubric, grades: Grades, tab: TabId): Completion {
  const items = itemsForTab(rubric, tab);
  return { done: items.filter((i) => i.key in grades).length, total: items.length };
}

export function overallCompletion(rubric: Rubric, grades: Grades): Completion {
  const items = Object.values(rubric.items);
  return { done: items.filter((i) => i.key in grades).length, total: items.length };
}

export interface MustPassStatus {
  ilo: IloId;
  total: number;
  max: number;
  /** Fraction of the ILO's points achieved (0–1). */
  pct: number;
  /** True once the must-pass threshold is met (>= threshold). */
  pass: boolean;
}

/** Per-ILO must-pass status for the must-pass ILOs (9.3 / 9.4 / 9.5). */
export function mustPassStatuses(rubric: Rubric, grades: Grades): MustPassStatus[] {
  return MUST_PASS_ILOS.map(({ ilo, threshold }) => {
    const total = iloTotal(rubric, grades, ilo);
    const max = iloMax(rubric, ilo);
    const pct = max > 0 ? total / max : 0;
    return { ilo, total, max, pct, pass: pct >= threshold };
  });
}

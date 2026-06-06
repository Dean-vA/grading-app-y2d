import type { Comments, Grades } from '../rubric/types';

export const STORAGE_KEY = 'demo-grading-data';

export interface SavedData {
  groupName: string;
  grades: Grades;
  comments: Comments;
  timestamp?: string;
}

export function loadSaved(): SavedData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      groupName: typeof parsed.groupName === 'string' ? parsed.groupName : '',
      grades: isObject(parsed.grades) ? (parsed.grades as Grades) : {},
      comments: isObject(parsed.comments) ? (parsed.comments as Comments) : {},
      timestamp: parsed.timestamp,
    };
  } catch (error) {
    console.error('Error loading saved data:', error);
    return null;
  }
}

export function persist(data: SavedData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

export function clearSaved(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

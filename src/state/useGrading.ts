import { useCallback, useEffect, useRef, useState } from 'react';
import type { Comments, Grades } from '../rubric/types';
import { rubric } from '../rubric/rubric';
import { clamp } from '../rubric/selectors';
import { clearSaved, loadSaved, persist } from '../lib/storage';

export interface GradingState {
  groupName: string;
  grades: Grades;
  comments: Comments;
  lastSaved: Date | null;
  /** True once the user has made changes that aren't reflected in an exported file. */
  dirtySinceExport: boolean;
  setGroupName: (name: string) => void;
  setGrade: (key: string, value: number | null) => void;
  setComment: (key: string, value: string) => void;
  clearAll: () => void;
  importData: (data: { groupName: string; grades: Grades; comments: Comments }) => void;
  markExported: () => void;
}

export function useGrading(): GradingState {
  const [groupName, setGroupNameState] = useState('');
  const [grades, setGrades] = useState<Grades>({});
  const [comments, setComments] = useState<Comments>({});
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [dirtySinceExport, setDirtySinceExport] = useState(false);

  // Skip autosave on the very first render (initial load) so we don't re-stamp immediately.
  const hydrated = useRef(false);

  // Load saved data once on mount.
  useEffect(() => {
    const saved = loadSaved();
    if (saved) {
      setGroupNameState(saved.groupName);
      setGrades(saved.grades);
      setComments(saved.comments);
      setLastSaved(new Date());
    }
    hydrated.current = true;
  }, []);

  // Debounced autosave to localStorage.
  useEffect(() => {
    if (!hydrated.current) return;
    const hasContent =
      groupName.length > 0 ||
      Object.keys(grades).length > 0 ||
      Object.keys(comments).length > 0;
    if (!hasContent) return;

    const id = setTimeout(() => {
      persist({ groupName, grades, comments, timestamp: new Date().toISOString() });
      setLastSaved(new Date());
    }, 500);
    return () => clearTimeout(id);
  }, [groupName, grades, comments]);

  const setGroupName = useCallback((name: string) => {
    setGroupNameState(name);
    setDirtySinceExport(true);
  }, []);

  const setGrade = useCallback((key: string, value: number | null) => {
    setDirtySinceExport(true);
    setGrades((prev) => {
      // null / empty clears the key so completion tracking stays accurate.
      if (value === null) {
        if (!(key in prev)) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      }
      const item = rubric.items[key];
      const clamped = item ? clamp(value, 0, item.maxPoints) : value;
      return { ...prev, [key]: clamped };
    });
  }, []);

  const setComment = useCallback((key: string, value: string) => {
    setDirtySinceExport(true);
    setComments((prev) => {
      if ((prev[key] ?? '') === value) return prev;
      return { ...prev, [key]: value };
    });
  }, []);

  const clearAll = useCallback(() => {
    setGroupNameState('');
    setGrades({});
    setComments({});
    clearSaved();
    setLastSaved(null);
    setDirtySinceExport(false);
  }, []);

  const importData = useCallback(
    (data: { groupName: string; grades: Grades; comments: Comments }) => {
      setGroupNameState(data.groupName);
      setGrades(data.grades);
      setComments(data.comments);
      setDirtySinceExport(true);
    },
    [],
  );

  const markExported = useCallback(() => setDirtySinceExport(false), []);

  return {
    groupName,
    grades,
    comments,
    lastSaved,
    dirtySinceExport,
    setGroupName,
    setGrade,
    setComment,
    clearAll,
    importData,
    markExported,
  };
}

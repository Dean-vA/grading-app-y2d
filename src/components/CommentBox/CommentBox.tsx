import { useEffect, useRef, useState } from 'react';
import styles from './CommentBox.module.css';

interface CommentBoxProps {
  value: string;
  placeholder?: string;
  label?: string;
  onCommit: (value: string) => void;
}

/**
 * Top-level (stable identity) comment field. Types into local state for smoothness, then
 * commits to central state on a short debounce AND flushes any pending value on unmount /
 * tab-switch — so the last keystrokes are never lost on export (the original on-blur bug).
 */
export function CommentBox({ value, placeholder, label = 'Comments & Notes', onCommit }: CommentBoxProps) {
  const [local, setLocal] = useState(value);
  const focused = useRef(false);
  const pending = useRef(value);
  const onCommitRef = useRef(onCommit);
  onCommitRef.current = onCommit;

  // Sync external changes in (e.g. import / clear) only while not actively typing.
  useEffect(() => {
    if (!focused.current) {
      setLocal(value);
      pending.current = value;
    }
  }, [value]);

  // Debounced commit of the latest local value.
  useEffect(() => {
    pending.current = local;
    const id = setTimeout(() => {
      if (local !== value) onCommitRef.current(local);
    }, 200);
    return () => clearTimeout(id);
  }, [local, value]);

  // Flush on unmount so switching tabs / exporting keeps the latest text.
  useEffect(() => {
    return () => {
      if (pending.current !== value) onCommitRef.current(pending.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.box}>
      <label className={styles.label}>{label}</label>
      <textarea
        className={styles.textarea}
        value={local}
        placeholder={placeholder}
        onFocus={() => {
          focused.current = true;
        }}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={() => {
          focused.current = false;
          if (local !== value) onCommit(local);
        }}
      />
    </div>
  );
}

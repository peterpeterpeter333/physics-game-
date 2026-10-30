import { useEffect, useState } from 'react';
import {restoredPage} from './study-progress';

/** Storage failure (private mode or full storage) must not prevent learning. */
export function useLessonPosition(id: string, count: number) {
  const key = `physics-quest:lesson-position:${id}`;
  const [page, setPage] = useState(() => {
    try {
      return restoredPage(localStorage.getItem(key),count);
    } catch { return 0; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, String(page)); } catch { /* Nonessential storage. */ }
  }, [key, page]);
  return [page, setPage] as const;
}

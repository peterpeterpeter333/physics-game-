// 進行状況。サーバー不要、すべて localStorage に保存する。

export type Progress = {
  xp: number;
  clearedStages: string[];
  finishedLessons: string[];
  starred: string[]; // あとで復習したい問題ID
  bestCombo: number;
  totalCorrect: number;
  totalAnswered: number;
};

const KEY = "physics-quest-progress-v1";

export const emptyProgress: Progress = {
  xp: 0,
  clearedStages: [],
  finishedLessons: [],
  starred: [],
  bestCombo: 0,
  totalCorrect: 0,
  totalAnswered: 0,
};

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...emptyProgress };
    return { ...emptyProgress, ...JSON.parse(raw) };
  } catch {
    return { ...emptyProgress };
  }
}

export function saveProgress(p: Progress) {
  localStorage.setItem(KEY, JSON.stringify(p));
}

// レベル曲線: level n に必要な累計XP = 60 * (n-1)^2
export function levelFromXp(xp: number): number {
  return Math.floor(Math.sqrt(xp / 60)) + 1;
}

export function xpForLevel(level: number): number {
  return 60 * (level - 1) * (level - 1);
}

export function levelProgress(xp: number): { level: number; ratio: number; into: number; needed: number } {
  const level = levelFromXp(xp);
  const base = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const into = xp - base;
  const needed = next - base;
  return { level, ratio: Math.min(1, into / needed), into, needed };
}

// APIキー (AIチャット用・端末内にのみ保存)
const API_KEY_KEY = "physics-quest-api-key";
export function loadApiKey(): string {
  return localStorage.getItem(API_KEY_KEY) ?? "";
}
export function saveApiKey(key: string) {
  if (key) localStorage.setItem(API_KEY_KEY, key);
  else localStorage.removeItem(API_KEY_KEY);
}

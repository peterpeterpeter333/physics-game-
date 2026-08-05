// コンテンツのデータ型。数式は文字列中に $...$ (インライン) / $$...$$ (ブロック) で埋め込む。

export type LessonStep = {
  heading: string;
  body: string;
  /** アニメーション図解のID (src/components/figures 参照) */
  figure?: string;
  /** 強調表示する公式 (KaTeX、$は不要) */
  formula?: string;
  /** 公式の意味の一言メモ */
  formulaNote?: string;
};

export type Lesson = {
  id: string;
  title: string;
  intro: string;
  steps: LessonStep[];
  /** レッスンの締め: 何が理解できたか */
  outro: string;
};

export type Problem = {
  id: string;
  difficulty: 1 | 2 | 3;
  question: string;
  choices: string[];
  answerIndex: number;
  /** 理解重視: 解法の筋道の解説 */
  explanation: string;
  hint: string;
};

export type Stage = {
  id: string;
  title: string;
  subtitle: string;
  lesson: Lesson;
  problems: Problem[];
  enemy: {
    name: string;
    emoji: string;
    maxHp: number;
  };
};

export type Chapter = {
  id: string;
  title: string;
  subtitle: string;
  stages: Stage[];
};

export type Formula = {
  id: string;
  name: string;
  tex: string;
  meaning: string;
  /** 分野名 (公式集のグループ表示に使う) */
  category: string;
  /** 導出があるレッスンのステージID */
  stageId?: string;
};

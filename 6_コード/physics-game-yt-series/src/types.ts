// コンテンツのデータ型。数式は文字列中に $...$ (インライン) / $$...$$ (ブロック) で埋め込む。

export type LessonStep = {
  /** Stable provenance: filtering/reordering must never change which summary is shown. */
  sourceStageId?: string;
  sourceSlideIndex?: number;
  summary?: string;
  /** A synchronized, learner-controlled visual explanation. */
  story?: {
    scene: string;
    goal?: string;
    basis?: string;
    result?: string;
    goalTex?: string;
    notes?: { title:string; text:string; tex:string }[];
    beats: { action: string; text: string; focus: string; tex?: string }[];
    check?: { question: string; choices: { text: string; feedback: string }[]; answer: number };
  };
  /** University prerequisites, explained in place instead of requiring an earlier stage. */
  review?: boolean;
  /** 初級・中級の一段を構成する四拍子。画面に札として出す。 */
  beat?: '基本事項' | '疑問' | '解決' | '新しい基本事項';
  /** この1枚が担う役割。1枚につき1つだけ。 */
  role?: '観察' | '問い' | '操作' | '解釈' | '固定';
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
  /** Material relocated from advanced lessons; optional, not repeated in the main flow. */
  supplements?: LessonStep[];
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

/** Paper-first electromagnetic exercise with its own silent worked animation. */
export type PaperProblem = {
  id: string;
  scene: 'field'|'path'|'surface';
  labels: [string,string,string?];
  question: string;
  steps: [string,string,string];
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

/** 大学編は同じ主題を初級・中級・上級の三段階で扱う。既存章は level を持たず上級として表示する。 */
export type ChapterLevel = 'intro' | 'middle' | 'advanced';

export type Chapter = {
  id: string;
  title: string;
  subtitle: string;
  stages: Stage[];
  /** 大学編の三段階。省略した既存章は上級として扱う。 */
  level?: ChapterLevel;
  /** 同じ主題の初級・中級・上級を束ねる識別子。 */
  familyId?: string;
  /** 先に見ておくと楽な章（ロックはしない）。 */
  recommendedPrevious?: string[];
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

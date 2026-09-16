import type { Chapter, LessonStep, Problem, Stage } from '../../types';
import type { LearningUnit } from '../learning-paths';
import type { LessonOrientation } from '../lesson-orientation';
import type { CalculationRule } from '../calculations/schema';
import type { Foundation } from '../chapter-foundations';

/** 初級・中級ステージの執筆形式。
 * 既存の上級編（univ-math / univ-mechanics / univ-em）は一切変更しない。
 * ここで書いたものは builder が Stage・学習経路・記号表・計算行へ展開する。 */

export const r = String.raw;

/** 一段の四拍子。画面に札として出るので、必ずこの順で並べる。 */
export type Beat = '基本事項' | '疑問' | '解決' | '新しい基本事項';

/** 1枚のスライドが担う役割。1枚に1つだけ持たせる。
 * 観察=図が主役 / 問い=具体的な疑問を一文 / 操作=式変形を一手 / 解釈=式と図を対応づける / 固定=新しい基本事項を言い切る */
export type SlideRole = '観察' | '問い' | '操作' | '解釈' | '固定';

export type LevelSlide = {
  /** 疑問形を基本とする見出し。計算行の対応キーにもなるので全教材で一意にする。 */
  heading: string;
  /** 画面前面の説明。150字以内（audit-study-flow が上限を検査する）。 */
  body: string;
  /** REGISTRY に登録した図解ID。全スライド必須。 */
  figure: string;
  beat: Beat;
  /** この1枚の役割。本文は最大5行、式変形は一手まで。 */
  role?: SlideRole;
  /** 強調表示する式（KaTeX、$ は不要）。 */
  formula?: string;
  formulaNote?: string;
  /** 「式を一段ずつ追う」に出す変形。note に変形の理由を書く。 */
  calculation?: { note: string; tex: string }[];
};

/** 上級編の到達点を予告するカード。分からなくてよい、で終わらせないための対応表。 */
export type AdvancedPreview = {
  /** 上級編での到達点（KaTeX、$ は不要）。 */
  goal: string;
  /** 今できればよいこと。 */
  now: string;
  /** 後で増えるもの。 */
  later: string;
};

export type LevelStage = {
  id: string;
  title: string;
  subtitle: string;
  enemy: { name: string; emoji: string; maxHp: number };
  /** 章のテーマ（LessonOrientation の theme）。 */
  theme: string;
  /** 目標の式・性質（LessonOrientation の goal）。26字以上。 */
  goal: string;
  intro: string;
  outro: string;
  /** 学習の段。end は排他的で、最後の end はスライド総数に一致させる。1段は2枚以上。 */
  units: LearningUnit[];
  /** 出発点・使える条件・数値例。「基本事項」を畳んで置く欄。 */
  foundation: Foundation;
  /** この章での記号の意味。base 分と合わせて8件以上になるようにする。 */
  glossary: Record<string, string>;
  slides: LevelSlide[];
  problems: Problem[];
  preview?: AdvancedPreview;
  /** 対応する上級ステージID。上級の入口に復習リンクとして出る。 */
  leadsTo?: string[];
};

export type LevelChapter = {
  id: string;
  title: string;
  subtitle: string;
  familyId: 'umath' | 'umech' | 'uem';
  level: 'intro' | 'middle';
  stages: LevelStage[];
};

export type BuiltLevelChapter = {
  chapter: Chapter;
  orientations: Record<string, LessonOrientation>;
  paths: Record<string, LearningUnit[]>;
  glossaries: Record<string, Record<string, string>>;
  foundations: Record<string, Foundation>;
  calculations: CalculationRule[];
  previews: Record<string, AdvancedPreview>;
};

function toStep(slide: LevelSlide): LessonStep {
  return {
    heading: slide.heading,
    body: slide.body,
    figure: slide.figure,
    beat: slide.beat,
    ...(slide.role ? { role: slide.role } : {}),
    ...(slide.formula ? { formula: slide.formula } : {}),
    ...(slide.formulaNote ? { formulaNote: slide.formulaNote } : {}),
  };
}

function toStage(stage: LevelStage): Stage {
  return {
    id: stage.id,
    title: stage.title,
    subtitle: stage.subtitle,
    enemy: stage.enemy,
    lesson: {
      id: `lesson-${stage.id}`,
      title: stage.theme,
      intro: stage.intro,
      outro: stage.outro,
      steps: stage.slides.map(toStep),
    },
    problems: stage.problems,
  };
}

/** 執筆形式を、アプリ側の各レジストリが読める形へ展開する。 */
export function buildLevelChapter(source: LevelChapter): BuiltLevelChapter {
  const orientations: Record<string, LessonOrientation> = {};
  const paths: Record<string, LearningUnit[]> = {};
  const glossaries: Record<string, Record<string, string>> = {};
  const foundations: Record<string, Foundation> = {};
  const previews: Record<string, AdvancedPreview> = {};
  const calculations: CalculationRule[] = [];
  for (const stage of source.stages) {
    orientations[stage.id] = { theme: stage.theme, goal: stage.goal };
    paths[stage.id] = stage.units;
    glossaries[stage.id] = stage.glossary;
    foundations[stage.id] = stage.foundation;
    if (stage.preview) previews[stage.id] = stage.preview;
    for (const slide of stage.slides) {
      if (!slide.calculation?.length) continue;
      calculations.push({
        headings: [slide.heading],
        calculation: { title: '式を一段ずつ追う', lines: slide.calculation },
      });
    }
  }
  return {
    chapter: {
      id: source.id,
      title: source.title,
      subtitle: source.subtitle,
      familyId: source.familyId,
      level: source.level,
      stages: source.stages.map(toStage),
    },
    orientations,
    paths,
    glossaries,
    foundations,
    calculations,
    previews,
  };
}

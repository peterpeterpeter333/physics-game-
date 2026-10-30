import type { Chapter } from '../types';
import { buildLevelChapter, type AdvancedPreview, type BuiltLevelChapter } from './levels/schema';
import { ui_math } from './levels/intro-math';
import { um_math } from './levels/middle-math';
import { ui_mech } from './levels/intro-mechanics';
import { um_mech } from './levels/middle-mechanics';
import { ui_em } from './levels/intro-em';
import { um_em } from './levels/middle-em';
import { completeUniversityLevels } from './levels/completion';
import { universityCurriculum } from './university-curriculum';

/** 大学編の三段階。既存の三章は上級として保存し、初級・中級を足す。
 * 上級をロックする仕組みは作らない。初級を終えていなくても上級を開ける。 */

export type LevelKey = 'intro' | 'middle' | 'advanced';

export const levelLabels: Record<LevelKey, string> = {
  intro: '初級',
  middle: '中級',
  advanced: '上級',
};

export type UniversityFamily = {
  id: 'umath' | 'umech' | 'uem';
  title: string;
  icon: string;
  /** 三段階それぞれの章IDと、一行の案内。 */
  levels: { level: LevelKey; chapterId: string; tagline: string }[];
};

export const universityFamilies: UniversityFamily[] = [
  {
    id: 'umath',
    title: '数学の武器庫',
    icon: '📐',
    levels: [
      { level: 'intro', chapterId: 'ui-math', tagline: '図と小さな計算で、変化を読む' },
      { level: 'middle', chapterId: 'um-math', tagline: '記号とグラフで、変化を式にする' },
      { level: 'advanced', chapterId: 'umath', tagline: '微分・積分・ベクトル・微分方程式' },
    ],
  },
  {
    id: 'umech',
    title: '力学',
    icon: '🚀',
    levels: [
      { level: 'intro', chapterId: 'ui-mech', tagline: '動き・力・仕事を小さく追う' },
      { level: 'middle', chapterId: 'um-mech', tagline: '変化する運動を式で追う' },
      { level: 'advanced', chapterId: 'umech', tagline: '運動方程式から回転・振動へ' },
    ],
  },
  {
    id: 'uem',
    title: '電磁気学',
    icon: '🧲',
    levels: [
      { level: 'intro', chapterId: 'ui-em', tagline: '矢印の地図と、道・面の小片' },
      { level: 'middle', chapterId: 'um-em', tagline: '電場・磁場を足し合わせる' },
      { level: 'advanced', chapterId: 'uem', tagline: '線積分・面積分からマクスウェル方程式へ' },
    ],
  },
];

/** 既存の上級章ID → 所属する系列。既存データは書き換えず、表示だけを束ねる。 */
export const advancedFamilyOf: Record<string, UniversityFamily['id']> = {
  umath: 'umath',
  umech: 'umech',
  uem: 'uem',
};

const built: BuiltLevelChapter[] = completeUniversityLevels([ui_math, um_math, ui_mech, um_mech, ui_em, um_em]
  .filter(source => source.stages.length > 0)
  .map(buildLevelChapter));

const merge = <T,>(pick: (b: BuiltLevelChapter) => Record<string, T>): Record<string, T> =>
  Object.assign({}, ...built.map(pick));

/** 初級・中級の章。既存 chapters の後ろに連結する。 */
export const levelChapters: Chapter[] = built.map(b => b.chapter);
export const levelOrientations = merge(b => b.orientations);
export const levelPaths = merge(b => b.paths);
export const levelGlossaries = merge(b => b.glossaries);
export const levelFoundations = merge(b => b.foundations);
export const levelPreviews: Record<string, AdvancedPreview> = merge(b => b.previews);
export const levelCalculations = built.flatMap(b => b.calculations);

/** 初級・中級ステージID → 所属系列。記号表の基本セットを選ぶのに使う。 */
export const levelFamilyOfStage: Record<string, UniversityFamily['id']> = {};
for (const source of levelChapters) {
  for (const stage of source.stages) levelFamilyOfStage[stage.id] = source.familyId as UniversityFamily['id'];
}

/** 初級・中級ステージのID集合。監査スクリプトが既存56ステージと区別するために使う。 */
export const levelStageIds = new Set(levelChapters.flatMap(c => c.stages.map(s => s.id)));

/** 上級ステージ → その準備になる初級・中級ステージ。上級の入口に復習リンクとして出す。 */
export const preparationFor: Record<string, { id: string; title: string; level: LevelKey }[]> = {};
for(const topic of universityCurriculum){
 preparationFor[topic.id]=(['intro','middle'] as const).map(level=>{
  const stage=levelChapters.flatMap(c=>c.stages).find(s=>s.id===topic[level].id)!;
  return {id:stage.id,title:stage.title,level};
 });
}
for (const source of [ui_math, um_math, ui_mech, um_mech, ui_em, um_em]) {
  for (const stage of source.stages) {
    for (const advanced of stage.leadsTo ?? []) {
      if(!preparationFor[advanced]?.some(s=>s.id===stage.id))
       (preparationFor[advanced] ??= []).push({ id: stage.id, title: stage.title, level: source.level });
    }
  }
}

/** 上級の入口に置く共通の部品リスト。初級・中級で身につけた読み方を一枚にまとめたもの。 */
export const advancedToolkit = [
  '変わる量は、小さい区間の「値×幅」を足す',
  '内積は、進む向き／面を貫く向きの成分だけを取る',
  'Σは有限個の和、∫は分割を限りなく細かくした極限',
  '式を使う前に、対象・座標・向き・初期条件・適用範囲を決める',
];

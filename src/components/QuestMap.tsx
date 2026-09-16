import { useState } from "react";
import type { Chapter } from "../types";
import { levelProgress, type Progress } from "../game/state";
import { advancedFamilyOf, levelLabels, universityFamilies, type LevelKey, type UniversityFamily } from "../content/university-levels";

const CHAPTER_ICONS: Record<string, string> = {
  mechanics: "🏃",
  thermo: "🔥",
  waves: "🌊",
  em: "⚡",
  atomic: "⚛️",
  umath: "📐",
  umech: "🚀",
  uem: "🧲",
};

type Block =
  | { kind: "chapter"; chapter: Chapter }
  | { kind: "family"; family: UniversityFamily; levels: { level: LevelKey; tagline: string; chapter: Chapter }[] };

/** 大学編の三章は、同じ主題の初級・中級・上級を一つのカードに束ねて表示する。
 * 段階は自由に選べる。初級・中級を終えていなくても上級を開ける。 */
function toBlocks(chapters: Chapter[]): Block[] {
  const byId = new Map(chapters.map(c => [c.id, c]));
  const claimed = new Set<string>();
  for (const family of universityFamilies) {
    for (const entry of family.levels) if (byId.has(entry.chapterId)) claimed.add(entry.chapterId);
  }
  const emitted = new Set<string>();
  const blocks: Block[] = [];
  for (const chapter of chapters) {
    if (!claimed.has(chapter.id)) { blocks.push({ kind: "chapter", chapter }); continue; }
    const familyId = chapter.familyId ?? advancedFamilyOf[chapter.id];
    if (!familyId || emitted.has(familyId)) continue;
    emitted.add(familyId);
    const family = universityFamilies.find(f => f.id === familyId)!;
    const levels = family.levels
      .map(entry => ({ level: entry.level, tagline: entry.tagline, chapter: byId.get(entry.chapterId) }))
      .filter((entry): entry is { level: LevelKey; tagline: string; chapter: Chapter } => !!entry.chapter);
    blocks.push({ kind: "family", family, levels });
  }
  return blocks;
}

export function QuestMap({
  chapters,
  progress,
  onOpenLesson,
  onOpenBattle,
}: {
  chapters: Chapter[];
  progress: Progress;
  onOpenLesson: (stageId: string) => void;
  onOpenBattle: (stageId: string) => void;
}) {
  const lp = levelProgress(progress.xp);
  const accuracy =
    progress.totalAnswered > 0
      ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
      : null;
  const blocks = toBlocks(chapters);
  // 未クリアの分野があれば最初のそれを開いておく
  const [openId, setOpenId] = useState<string>(() => {
    const firstUnfinished = chapters.find((c) =>
      c.stages.some((s) => !progress.clearedStages.includes(s.id))
    );
    const target = (firstUnfinished ?? chapters[0]).id;
    return advancedFamilyOf[target] ?? (firstUnfinished?.familyId ?? target);
  });
  // 系列ごとに、いま見ている段階。進めた段階があればそこを開く。
  const [levelOf, setLevelOf] = useState<Record<string, LevelKey>>(() => {
    const initial: Record<string, LevelKey> = {};
    for (const block of blocks) {
      if (block.kind !== "family") continue;
      const started = block.levels.find(entry => entry.chapter.stages.some(s => progress.clearedStages.includes(s.id)));
      initial[block.family.id] = (started ?? block.levels[0])?.level ?? "intro";
    }
    return initial;
  });

  const stageList = (chapter: Chapter) => (
    <div className="stage-path pop-in">
      {chapter.stages.map((stage, i) => {
        const cleared = progress.clearedStages.includes(stage.id);
        const lessonDone = progress.finishedLessons.includes(stage.lesson.id);
        return (
          <div key={stage.id} className={`stage-node ${cleared ? "cleared" : ""}`}>
            {i > 0 && <div className="stage-connector" />}
            <div className="stage-card">
              <div className="stage-enemy">{stage.enemy.emoji}</div>
              <div className="stage-info">
                <div className="stage-title">
                  {stage.title}
                  {cleared && <span className="stage-star">⭐</span>}
                </div>
                <div className="stage-subtitle">{stage.subtitle}</div>
                <div className="stage-actions">
                  <button className="btn btn-ghost" onClick={() => onOpenLesson(stage.id)}>
                    📖 {lessonDone ? "レッスンを見返す" : "レッスンで学ぶ"}
                  </button>
                  <button className="btn btn-primary" onClick={() => onOpenBattle(stage.id)}>
                    ⚔️ バトルに挑む
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const progressBar = (chapter: Chapter) => {
    const done = chapter.stages.filter(s => progress.clearedStages.includes(s.id)).length;
    return (
      <span className="chapter-progress">
        <span className="chapter-progress-bar">
          <span className="chapter-progress-fill" style={{ width: `${(done / chapter.stages.length) * 100}%` }} />
        </span>
        <span className="chapter-progress-label">{done}/{chapter.stages.length}</span>
      </span>
    );
  };

  return (
    <div className="screen quest-map">
      <header className="hud">
        <div className="hud-level">
          <div className="level-badge">
            Lv.<span>{lp.level}</span>
          </div>
          <div className="level-bar-wrap">
            <div className="level-bar">
              <div className="level-bar-fill" style={{ width: `${lp.ratio * 100}%` }} />
            </div>
            <div className="level-bar-label">
              XP {lp.into} / {lp.needed}
            </div>
          </div>
        </div>
        <div className="hud-stats">
          {accuracy !== null && <span className="hud-stat">正答率 {accuracy}%</span>}
          {progress.bestCombo > 1 && <span className="hud-stat">最大コンボ {progress.bestCombo}</span>}
          <span className="hud-stat">
            ⭐ {progress.clearedStages.length} / {chapters.reduce((n, c) => n + c.stages.length, 0)}
          </span>
        </div>
      </header>

      <div className="chapter-list">
        {blocks.map((block) => {
          if (block.kind === "chapter") {
            const chapter = block.chapter;
            const clearedCount = chapter.stages.filter((s) => progress.clearedStages.includes(s.id)).length;
            const isOpen = openId === chapter.id;
            const complete = clearedCount === chapter.stages.length;
            return (
              <div key={chapter.id} className={`chapter-block ${complete ? "complete" : ""}`}>
                <button className="chapter-card chapter-toggle" onClick={() => setOpenId(isOpen ? "" : chapter.id)}>
                  <span className="chapter-icon">{CHAPTER_ICONS[chapter.id] ?? "📘"}</span>
                  <span className="chapter-toggle-info">
                    <span className="chapter-toggle-title">
                      {chapter.title}
                      {complete && " 👑"}
                    </span>
                    <span className="chapter-toggle-sub">{chapter.subtitle}</span>
                    {progressBar(chapter)}
                  </span>
                  <span className={`chapter-chevron ${isOpen ? "open" : ""}`}>▾</span>
                </button>
                {isOpen && stageList(chapter)}
              </div>
            );
          }

          const family = block.family;
          const active = block.levels.find(entry => entry.level === levelOf[family.id]) ?? block.levels[0];
          const isOpen = openId === family.id;
          const total = block.levels.reduce((n, entry) => n + entry.chapter.stages.length, 0);
          const done = block.levels.reduce(
            (n, entry) => n + entry.chapter.stages.filter(s => progress.clearedStages.includes(s.id)).length, 0);
          return (
            <div key={family.id} className={`chapter-block ${done === total ? "complete" : ""}`}>
              <button className="chapter-card chapter-toggle" onClick={() => setOpenId(isOpen ? "" : family.id)}>
                <span className="chapter-icon">{family.icon}</span>
                <span className="chapter-toggle-info">
                  <span className="chapter-toggle-title">
                    大学編 · {family.title}
                    {done === total && " 👑"}
                  </span>
                  <span className="chapter-toggle-sub">
                    {block.levels.map(entry => levelLabels[entry.level]).join(" / ")} — どの段階からでも開けます
                  </span>
                  <span className="chapter-progress">
                    <span className="chapter-progress-bar">
                      <span className="chapter-progress-fill" style={{ width: `${(done / total) * 100}%` }} />
                    </span>
                    <span className="chapter-progress-label">{done}/{total}</span>
                  </span>
                </span>
                <span className={`chapter-chevron ${isOpen ? "open" : ""}`}>▾</span>
              </button>
              {isOpen && (
                <div className="level-picker pop-in">
                  <div className="level-tabs" role="tablist" aria-label={`${family.title}の段階`}>
                    {block.levels.map(entry => (
                      <button
                        key={entry.level}
                        role="tab"
                        aria-selected={entry.level === active.level}
                        className={`level-tab ${entry.level === active.level ? "current" : ""}`}
                        onClick={() => setLevelOf(state => ({ ...state, [family.id]: entry.level }))}
                      >
                        <span className="level-tab-name">{levelLabels[entry.level]}</span>
                        <span className="level-tab-count">
                          {entry.chapter.stages.filter(s => progress.clearedStages.includes(s.id)).length}
                          /{entry.chapter.stages.length}
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="level-tagline">{active.tagline}</p>
                  {stageList(active.chapter)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

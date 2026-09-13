import { useState } from "react";
import type { Chapter } from "../types";
import { levelProgress, type Progress } from "../game/state";

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
  // 未クリアの分野があれば最初のそれを開いておく
  const [openId, setOpenId] = useState<string>(() => {
    const firstUncleared = chapters.find((c) =>
      c.stages.some((s) => !progress.clearedStages.includes(s.id))
    );
    return (firstUncleared ?? chapters[0]).id;
  });

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
        {chapters.map((chapter) => {
          const clearedCount = chapter.stages.filter((s) =>
            progress.clearedStages.includes(s.id)
          ).length;
          const isOpen = openId === chapter.id;
          const complete = clearedCount === chapter.stages.length;

          return (
            <div key={chapter.id} className={`chapter-block ${complete ? "complete" : ""}`}>
              <button
                className="chapter-card chapter-toggle"
                onClick={() => setOpenId(isOpen ? "" : chapter.id)}
              >
                <span className="chapter-icon">{CHAPTER_ICONS[chapter.id] ?? "📘"}</span>
                <span className="chapter-toggle-info">
                  <span className="chapter-toggle-title">
                    {chapter.title}
                    {complete && " 👑"}
                  </span>
                  <span className="chapter-toggle-sub">{chapter.subtitle}</span>
                  <span className="chapter-progress">
                    <span className="chapter-progress-bar">
                      <span
                        className="chapter-progress-fill"
                        style={{ width: `${(clearedCount / chapter.stages.length) * 100}%` }}
                      />
                    </span>
                    <span className="chapter-progress-label">
                      {clearedCount}/{chapter.stages.length}
                    </span>
                  </span>
                </span>
                <span className={`chapter-chevron ${isOpen ? "open" : ""}`}>▾</span>
              </button>

              {isOpen && (
                <div className="stage-path pop-in">
                  {chapter.stages.map((stage, i) => {
                    const prevCleared =
                      i === 0 || progress.clearedStages.includes(chapter.stages[i - 1].id);
                    const cleared = progress.clearedStages.includes(stage.id);
                    const lessonDone = progress.finishedLessons.includes(stage.lesson.id);
                    const locked = !prevCleared;

                    return (
                      <div
                        key={stage.id}
                        className={`stage-node ${locked ? "locked" : ""} ${cleared ? "cleared" : ""}`}
                      >
                        {i > 0 && <div className="stage-connector" />}
                        <div className="stage-card">
                          <div className="stage-enemy">{locked ? "🔒" : stage.enemy.emoji}</div>
                          <div className="stage-info">
                            <div className="stage-title">
                              {stage.title}
                              {cleared && <span className="stage-star">⭐</span>}
                            </div>
                            <div className="stage-subtitle">{stage.subtitle}</div>
                            {!locked && (
                              <div className="stage-actions">
                                <button className="btn btn-ghost" onClick={() => onOpenLesson(stage.id)}>
                                  📖 {lessonDone ? "レッスンを見返す" : "レッスンで学ぶ"}
                                </button>
                                <button
                                  className="btn btn-primary"
                                  disabled={!lessonDone}
                                  title={lessonDone ? "" : "先にレッスンで理解してから挑戦!"}
                                  onClick={() => onOpenBattle(stage.id)}
                                >
                                  ⚔️ バトルに挑む
                                </button>
                              </div>
                            )}
                            {locked && <div className="stage-locked-note">前のステージをクリアで解放</div>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

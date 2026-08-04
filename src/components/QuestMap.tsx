import type { Chapter } from "../types";
import { levelProgress, type Progress } from "../game/state";

export function QuestMap({
  chapter,
  progress,
  onOpenLesson,
  onOpenBattle,
}: {
  chapter: Chapter;
  progress: Progress;
  onOpenLesson: (stageId: string) => void;
  onOpenBattle: (stageId: string) => void;
}) {
  const lp = levelProgress(progress.xp);
  const accuracy =
    progress.totalAnswered > 0
      ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
      : null;

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
        </div>
      </header>

      <div className="chapter-card">
        <div className="chapter-tag">物理基礎 ─ 力学</div>
        <h1>{chapter.title}</h1>
        <p>{chapter.subtitle}</p>
      </div>

      <div className="stage-path">
        {chapter.stages.map((stage, i) => {
          const prevCleared =
            i === 0 || progress.clearedStages.includes(chapter.stages[i - 1].id);
          const cleared = progress.clearedStages.includes(stage.id);
          const lessonDone = progress.finishedLessons.includes(stage.lesson.id);
          const locked = !prevCleared;

          return (
            <div key={stage.id} className={`stage-node ${locked ? "locked" : ""} ${cleared ? "cleared" : ""}`}>
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
        <div className="coming-soon">
          <div className="coming-soon-inner">🚧 次章「落体の運動」制作中…</div>
        </div>
      </div>
    </div>
  );
}

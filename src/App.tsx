import { useCallback, useEffect, useMemo, useState } from "react";
import { chapters } from "./content";
import { formulas } from "./content/formulas";
import type { Stage } from "./types";
import {
  loadProgress,
  saveProgress,
  type Progress,
} from "./game/state";
import { QuestMap } from "./components/QuestMap";
import { LessonView } from "./components/LessonView";
import { BattleView } from "./components/BattleView";
import { FormulaBook } from "./components/FormulaBook";
import { ReviewView } from "./components/ReviewView";
import { SettingsView } from "./components/SettingsView";
import { AIChat } from "./components/AIChat";

type View =
  | { type: "map" }
  | { type: "lesson"; stageId: string }
  | { type: "battle"; stageId: string }
  | { type: "formulas" }
  | { type: "review" }
  | { type: "settings" };

function findStage(stageId: string): Stage {
  for (const c of chapters) {
    const s = c.stages.find((s) => s.id === stageId);
    if (s) return s;
  }
  throw new Error(`unknown stage: ${stageId}`);
}

export default function App() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const [view, setView] = useState<View>({ type: "map" });
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => saveProgress(progress), [progress]);

  const update = useCallback((fn: (p: Progress) => Progress) => {
    setProgress((p) => fn(p));
  }, []);

  const chatContext = useMemo(() => {
    if (view.type === "lesson") {
      const s = findStage(view.stageId);
      return `レッスン「${s.lesson.title}」(${s.title})を学習中。レッスン内容の要約: ${s.lesson.intro}`;
    }
    if (view.type === "battle") {
      const s = findStage(view.stageId);
      return `ステージ「${s.title}」の問題演習中。出題範囲: ${s.subtitle}`;
    }
    if (view.type === "formulas") return "公式集を閲覧中。";
    return "クエストマップ(単元選択画面)を閲覧中。";
  }, [view]);

  return (
    <div className="app">
      <div className="app-inner">
        {view.type === "map" && (
          <QuestMap
            chapters={chapters}
            progress={progress}
            onOpenLesson={(id) => setView({ type: "lesson", stageId: id })}
            onOpenBattle={(id) => setView({ type: "battle", stageId: id })}
          />
        )}
        {view.type === "lesson" && (
          <LessonView
            stage={findStage(view.stageId)}
            onExit={() => setView({ type: "map" })}
            onComplete={(firstTime) => {
              const stage = findStage(view.stageId);
              update((p) => ({
                ...p,
                xp: p.xp + (firstTime ? 20 : 0),
                finishedLessons: p.finishedLessons.includes(stage.lesson.id)
                  ? p.finishedLessons
                  : [...p.finishedLessons, stage.lesson.id],
              }));
              setView({ type: "battle", stageId: view.stageId });
            }}
            alreadyFinished={progress.finishedLessons.includes(findStage(view.stageId).lesson.id)}
          />
        )}
        {view.type === "battle" && (
          <BattleView
            stage={findStage(view.stageId)}
            starred={progress.starred}
            onToggleStar={(pid) =>
              update((p) => ({
                ...p,
                starred: p.starred.includes(pid)
                  ? p.starred.filter((x) => x !== pid)
                  : [...p.starred, pid],
              }))
            }
            onAnswer={(correct) =>
              update((p) => ({
                ...p,
                totalAnswered: p.totalAnswered + 1,
                totalCorrect: p.totalCorrect + (correct ? 1 : 0),
              }))
            }
            firstClear={!progress.clearedStages.includes(view.stageId)}
            onFinish={(xp, cleared, bestCombo) => {
              update((p) => ({
                ...p,
                xp: p.xp + xp,
                bestCombo: Math.max(p.bestCombo, bestCombo),
                clearedStages:
                  cleared && !p.clearedStages.includes(view.stageId)
                    ? [...p.clearedStages, view.stageId]
                    : p.clearedStages,
              }));
              setView({ type: "map" });
            }}
            onExit={() => setView({ type: "map" })}
          />
        )}
        {view.type === "formulas" && (
          <FormulaBook
            formulas={formulas}
            onOpenLesson={(stageId) => setView({ type: "lesson", stageId })}
          />
        )}
        {view.type === "review" && (
          <ReviewView
            chapters={chapters}
            starred={progress.starred}
            onToggleStar={(pid) =>
              update((p) => ({
                ...p,
                starred: p.starred.filter((x) => x !== pid),
              }))
            }
          />
        )}
        {view.type === "settings" && (
          <SettingsView
            onResetProgress={() => {
              if (confirm("学習の進行状況をすべてリセットします。よろしいですか?")) {
                localStorage.removeItem("physics-quest-progress-v1");
                setProgress(loadProgress());
              }
            }}
          />
        )}
      </div>

      {view.type !== "battle" && (
        <nav className="bottom-nav">
          <button
            className={view.type === "map" ? "active" : ""}
            onClick={() => setView({ type: "map" })}
          >
            <span className="nav-icon">🗺️</span>クエスト
          </button>
          <button
            className={view.type === "formulas" ? "active" : ""}
            onClick={() => setView({ type: "formulas" })}
          >
            <span className="nav-icon">📖</span>公式集
          </button>
          <button
            className={view.type === "review" ? "active" : ""}
            onClick={() => setView({ type: "review" })}
          >
            <span className="nav-icon">⭐</span>復習
          </button>
          <button
            className={view.type === "settings" ? "active" : ""}
            onClick={() => setView({ type: "settings" })}
          >
            <span className="nav-icon">⚙️</span>設定
          </button>
        </nav>
      )}

      <button className="chat-fab" onClick={() => setChatOpen(true)} title="AI先生に質問">
        🤖
      </button>
      {chatOpen && <AIChat context={chatContext} onClose={() => setChatOpen(false)} />}
    </div>
  );
}

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
import { FigureGallery } from "./components/figures";
import { analytics } from "./analytics";
import { SHOW_AI_CHAT } from "./config";

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
function nextStage(stageId:string){
 const chapter=chapters.find(c=>c.stages.some(s=>s.id===stageId));
 if(!chapter)return undefined;
 return chapter.stages[chapter.stages.findIndex(s=>s.id===stageId)+1];
}

export default function App() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const isGallery = typeof window !== "undefined" && window.location.hash.startsWith("#figs");
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

  if (isGallery) {
    return (
      <div className="app">
        <div className="app-inner">
          <FigureGallery />
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app-inner">
        {view.type === "map" && (
          <QuestMap
            chapters={chapters}
            progress={progress}
            onOpenLesson={(id) => {
              analytics.lessonStart(id);
              setView({ type: "lesson", stageId: id });
            }}
            onOpenBattle={(id) => {
              analytics.battleStart(id);
              setView({ type: "battle", stageId: id });
            }}
          />
        )}
        {view.type === "lesson" && (
          <LessonView
            key={view.stageId}
            stage={findStage(view.stageId)}
            onOpenStage={(id) => setView({ type: "lesson", stageId: id })}
            onExit={() => setView({ type: "map" })}
            onComplete={(firstTime) => {
              const stage = findStage(view.stageId);
              analytics.lessonComplete(view.stageId);
              analytics.battleStart(view.stageId);
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
            key={view.stageId}
            nextStageTitle={nextStage(view.stageId)?.title}
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
            onFinish={(xp, cleared, bestCombo, continueNext) => {
              if (cleared) analytics.battleVictory(view.stageId);
              else analytics.battleDefeat(view.stageId);
              update((p) => ({
                ...p,
                xp: p.xp + xp,
                bestCombo: Math.max(p.bestCombo, bestCombo),
                clearedStages:
                  cleared && !p.clearedStages.includes(view.stageId)
                    ? [...p.clearedStages, view.stageId]
                    : p.clearedStages,
              }));
              const next=continueNext&&cleared?nextStage(view.stageId):undefined;
              setView(next?{type:'lesson',stageId:next.id}:{ type: "map" });
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
            onClick={() => {
              analytics.formulaBookOpen();
              setView({ type: "formulas" });
            }}
          >
            <span className="nav-icon">📖</span>公式集
          </button>
          <button
            className={view.type === "review" ? "active" : ""}
            onClick={() => {
              analytics.reviewOpen();
              setView({ type: "review" });
            }}
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

      {SHOW_AI_CHAT && (
        <button
          className="chat-fab"
          onClick={() => {
            analytics.chatOpen();
            setChatOpen(true);
          }}
          title="AI先生に質問"
        >
          🤖
        </button>
      )}
      {SHOW_AI_CHAT && chatOpen && (
        <AIChat context={chatContext} onClose={() => setChatOpen(false)} />
      )}
    </div>
  );
}

import { useState } from "react";
import type { Stage } from "../types";
import { MathText, MathBlock } from "./MathText";
import { Figure } from "./figures";

export function LessonView({
  stage,
  alreadyFinished,
  onComplete,
  onExit,
}: {
  stage: Stage;
  alreadyFinished: boolean;
  onComplete: (firstTime: boolean) => void;
  onExit: () => void;
}) {
  const lesson = stage.lesson;
  // 表示済みステップ数 (0 = イントロのみ)
  const [revealed, setRevealed] = useState(0);
  const allRevealed = revealed >= lesson.steps.length;

  return (
    <div className="screen lesson" data-stage-id={stage.id}>
      <header className="screen-header">
        <button className="btn-back" onClick={onExit}>
          ←
        </button>
        <div>
          <div className="screen-header-tag">📖 レッスン ─ {stage.title}</div>
          <h1>{lesson.title}</h1>
        </div>
      </header>

      <p className="lesson-intro">
        <MathText text={lesson.intro} />
      </p>

      <div className="lesson-steps">
        {lesson.steps.slice(0, revealed).map((step, i) => (
          <div className="lesson-step pop-in" key={i}>
            <h2>{step.heading}</h2>
            <p>
              <MathText text={step.body} />
            </p>
            {step.figure && <Figure id={step.figure} />}
            {step.formula && (
              <div className="formula-card">
                <MathBlock tex={step.formula} />
                {step.formulaNote && <div className="formula-note">💡 {step.formulaNote}</div>}
              </div>
            )}
          </div>
        ))}
      </div>

      {allRevealed && (
        <div className="lesson-outro pop-in">
          <p>
            <MathText text={lesson.outro} />
          </p>
        </div>
      )}

      <div className="lesson-controls">
        <div className="step-dots">
          {lesson.steps.map((_, i) => (
            <span key={i} className={`dot ${i < revealed ? "on" : ""}`} />
          ))}
        </div>
        {!allRevealed ? (
          <button className="btn btn-primary btn-big" onClick={() => setRevealed((r) => r + 1)}>
            {revealed === 0 ? "レッスンを始める" : "次へ →"}
          </button>
        ) : (
          <button className="btn btn-battle btn-big glow-pulse" onClick={() => onComplete(!alreadyFinished)}>
            ⚔️ {stage.enemy.name}に挑む!
            {!alreadyFinished && <span className="xp-tag">+20 XP</span>}
          </button>
        )}
      </div>
    </div>
  );
}

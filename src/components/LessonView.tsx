import { useEffect, useRef, useState } from "react";
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
  const slides = lesson.steps;
  const [page, setPage] = useState(0);
  const allRevealed = page === slides.length - 1;
  const step = slides[page];
  const card = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (page === 0) window.scrollTo({top:0});
    else card.current?.scrollIntoView({block:'start'});
  }, [page]);

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
          <div className="lesson-step pop-in" key={page} ref={card}>
            <div className="lesson-card-count" aria-live="polite">{page + 1} / {slides.length}</div>
            <h2>{step.heading}</h2>
            <p>
              <MathText text={step.body} />
            </p>
            {step.figure && <Figure id={step.figure} />}
            {step.formula && (
              <div className="formula-card">
                <MathBlock tex={step.formula} />
                {step.formulaNote && <div className="formula-note">💡 <MathText text={step.formulaNote} /></div>}
              </div>
            )}
          </div>
      </div>

      {allRevealed && (
        <div className="lesson-outro pop-in">
          <p>
            <MathText text={lesson.outro} />
          </p>
        </div>
      )}

      <div className="lesson-controls">
        <div className="lesson-navigation">
          <button className="btn btn-ghost" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← 前へ</button>
          <label>スライド
            <select aria-label="スライドを選ぶ" value={page} onChange={e => setPage(Number(e.target.value))}>
              {slides.map((s, i) => <option key={i} value={i}>{i + 1}. {s.heading}</option>)}
            </select>
          </label>
        </div>
        {!allRevealed ? (
          <button className="btn btn-primary btn-big" onClick={() => setPage(p => p + 1)}>
            次へ →
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

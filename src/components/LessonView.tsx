import { useEffect, useRef, useState } from "react";
import type { Stage } from "../types";
import { MathText } from "./MathText";
import { Figure } from "./figures";
import { CalculationBoard, EquationImage } from './CalculationBoard';
import { getCalculation } from '../content/calculations';
import { UniqueFigure, getUniqueShot } from './figures/unique';
import { LessonOrientation } from './LessonOrientation';
import { GuidedLesson } from './GuidedLesson';

export function LessonView(props: {stage:Stage;alreadyFinished:boolean;onComplete:(firstTime:boolean)=>void;onExit:()=>void}) {
  return props.stage.lesson.steps[0]?.story ? <GuidedLesson {...props}/> : <StandardLessonView {...props}/>;
}
function StandardLessonView({
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
  const calculation = getCalculation(step);
  const shot = getUniqueShot(stage.id, step);
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
            <LessonOrientation stageId={stage.id} heading={step.heading} page={page} total={slides.length} review={step.review} />
            {step.body.split(/\n\s*\n/).map((paragraph, index) => (
              <p key={index}><MathText text={paragraph} /></p>
            ))}
            {shot ? <UniqueFigure shot={shot} id={`${stage.id}/${page}`} /> : step.figure && <Figure id={step.figure} />}
            {calculation && <CalculationBoard calculation={calculation} />}
            {step.formula && !calculation?.lines.some(line => line.tex === step.formula) && <div className="formula-card"><EquationImage tex={step.formula}/></div>}
            {step.formulaNote && <div className="formula-note">💡 <MathText text={step.formulaNote} /></div>}
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
          <nav className="lesson-dots" aria-label="スライドを選ぶ">
            {slides.map((s, i) => <button key={i} className={`lesson-dot ${i === page ? 'active' : ''}`}
              aria-label={`スライド ${i + 1}: ${s.heading}`} aria-current={i === page ? 'step' : undefined}
              title={`${i + 1}. ${s.heading}`} onClick={() => setPage(i)}><span /></button>)}
          </nav>
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

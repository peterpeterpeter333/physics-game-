import { useEffect, useRef, useState } from "react";
import type { Stage } from "../types";
import { MathText } from "./MathText";
import { Figure } from "./figures";
import { CalculationBoard, EquationImage } from './CalculationBoard';
import { getCalculation } from '../content/calculations';
import { UniqueFigure, getUniqueShot } from './figures/unique';
import { LessonOrientation } from './LessonOrientation';
import { GuidedLesson } from './GuidedLesson';
import { learningPaths, unitAt, phaseLabel } from '../content/learning-paths';
import { slideSummaries } from '../content/slide-summaries';
import { QuantityGlossary } from './QuantityGlossary';
import { ChapterFoundation } from './ChapterFoundation';
import { AdvancedEntry, AdvancedPreviewCard, LevelSlideHeader } from './LevelBridge';
import { levelStageIds } from '../content/university-levels';
import { clarityRevisions } from '../content/clarity-revisions';
import './spiral-lesson.css';
import './study-flow.css';

export function LessonView(props: {stage:Stage;alreadyFinished:boolean;onComplete:(firstTime:boolean)=>void;onExit:()=>void;onOpenStage?:(id:string)=>void}) {
  return props.stage.lesson.steps[0]?.story ? <GuidedLesson {...props}/> : <StandardLessonView {...props}/>;
}
function StandardLessonView({
  stage,
  alreadyFinished,
  onComplete,
  onExit,
  onOpenStage,
}: {
  stage: Stage;
  alreadyFinished: boolean;
  onComplete: (firstTime: boolean) => void;
  onExit: () => void;
  onOpenStage?: (id: string) => void;
}) {
  const lesson = stage.lesson;
  const slides = lesson.steps;
  const [page, setPage] = useState(0);
  const allRevealed = page === slides.length - 1;
  const step = slides[page];
  const calculation = getCalculation(step);
  const shot = getUniqueShot(stage.id, step);
  const units=learningPaths[stage.id];
  const {unit,index:unitIndex,start,offset,count}=unitAt(units,page);
  const summary=clarityRevisions[stage.id]?.[step.heading]?.body??slideSummaries[stage.id]?.[page]??step.body;
  const expressions=[...(calculation?.lines.map(line=>line.tex)??[]),...(step.formula?[step.formula]:[]),...Array.from(step.body.matchAll(/\$([^$]+)\$/g),m=>m[1])];
  const isLevel = levelStageIds.has(stage.id);
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

      <details className="study-overview"><summary>この章の出発点と学習のつながり</summary><p><MathText text={lesson.intro}/></p>
       <ol>{units.map((item,i)=><li key={item.end}><button onClick={()=>setPage(i===0?0:units[i-1].end)} aria-current={i===unitIndex?'step':undefined}>{item.goal}</button></li>)}</ol>
      </details>

      <ChapterFoundation stageId={stage.id}/>
      <AdvancedEntry stageId={stage.id} onOpenStage={onOpenStage}/>

      <div className="lesson-steps">
          <div className="lesson-step pop-in" key={page} ref={card}>
            {isLevel
              ? <LevelSlideHeader page={page} total={slides.length} heading={step.heading} beat={step.beat} role={step.role} />
              : <LessonOrientation stageId={stage.id} heading={step.heading} page={page} total={slides.length} review={step.review} />}
            {!isLevel&&step.beat&&<p className="lesson-beat"><span className={`lesson-beat-tag beat-${['基本事項','疑問','解決','新しい基本事項'].indexOf(step.beat)}`}>{step.beat}</span></p>}
            {!isLevel&&<section className="spiral-context" aria-label="今の段で求めること">
             <p className="spiral-goal">第{unitIndex+1}段：{unit.goal}</p>
             {unitIndex>0&&<details><summary>前の段から使うこと</summary><p>{units[unitIndex-1].gain}</p></details>}
             <nav aria-label="この段の学び方">{Array.from({length:count},(_,i)=><button key={i} aria-current={offset===i?'step':undefined} onClick={()=>setPage(start+i)}>{phaseLabel(i,count)}</button>)}</nav>
            </section>}
            {summary.split(/\n\s*\n/).map((paragraph, index) => (
              <p key={index}><MathText text={paragraph} /></p>
            ))}
            {summary!==step.body&&<details className="study-original"><summary>補足・元の詳しい説明</summary>{step.body.split(/\n\s*\n/).map((p,i)=><p key={i}><MathText text={p}/></p>)}</details>}
            {shot ? <UniqueFigure shot={shot} id={`${stage.id}/${page}`} /> : step.figure && <Figure id={step.figure} />}
            {expressions.length>0&&(isLevel
              ? <details className="level-symbols"><summary>この式の記号を確認</summary><QuantityGlossary key={`symbols-${page}`} stageId={stage.id} expressions={expressions}/></details>
              : <QuantityGlossary key={`symbols-${page}`} stageId={stage.id} expressions={expressions}/>)}
            {calculation && <CalculationBoard key={`calculation-${page}`} calculation={calculation} purpose={step.heading==='微小移動なら掛け算1回に戻る'?'静電場の電位分布Vから、観測点の電場成分Eₓを求める':unit.goal} />}
            {step.formula && !calculation?.lines.some(line => line.tex === step.formula) && <div className="formula-card"><EquationImage tex={step.formula}/></div>}
            {step.formulaNote && <div className="formula-note">💡 <MathText text={step.formulaNote} /></div>}
            {allRevealed&&<AdvancedPreviewCard stageId={stage.id}/>}
            {offset===count-1&&<p className={isLevel?"spiral-gain level-gain":"spiral-gain"}>つながったこと：{unit.gain}</p>}
            {offset===count-1&&unitIndex<units.length-1&&<p className="study-next">次は：{units[unitIndex+1].goal}</p>}
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
            {offset===count-1?'次の基本事項へ →':`${phaseLabel(offset+1,count)}へ →`}
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

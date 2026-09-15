import { useEffect, useRef, useState } from 'react';
import type { LessonStep, Stage } from '../types';
import { MathText } from './MathText';
import { EquationImage } from './CalculationBoard';
import { GuidedScene } from './GuidedScene';
import './guided-lesson.css';

function Story({step,onNext,last}:{step:LessonStep;onNext:()=>void;last:boolean}) {
 const story=step.story!;
 const [beat,setBeat]=useState(0),[choice,setChoice]=useState<number|null>(null),[yaw,setYaw]=useState(.55);
 const focus=useRef<HTMLDivElement>(null);
 const initial=useRef(true);
 useEffect(()=>{if(initial.current){initial.current=false;return;}focus.current?.scrollIntoView({block:'start',behavior:'auto'});},[beat]);
 const current=story.beats[beat];
 return <>
  {!story.goal&&<p className="guided-context"><MathText text={step.body}/></p>}
  <div className="guided-board" ref={focus}>
   <p className="guided-current-question">{step.heading}</p>
   {story.goal&&<div className="rigorous-purpose"><strong>今回、何を求めるか</strong><p>{story.goal}</p>{story.goalTex&&<div className="guided-equation"><EquationImage tex={story.goalTex}/></div>}<p className="rigorous-basis"><strong>出発点・使う前提</strong>{story.basis}</p></div>}
   <div className="guided-beat-head"><span>図と一緒に考える</span><span>{beat+1} / {story.beats.length}</span></div>
   <h3>{current.action}</h3>
   <GuidedScene scene={story.scene} beat={beat} yaw={yaw}/>
   <p className="guided-look"><span>見るところ</span><MathText text={current.focus}/></p>
   {story.scene==='tilt'&&<label className="guided-camera">視点を変える（面の角度・磁束は変わりません）<input aria-label="面を見る視点" type="range" min="-1.3" max="1.3" step=".05" value={yaw} onChange={e=>setYaw(Number(e.target.value))}/></label>}
   <div className="guided-explanation" aria-live="polite" aria-atomic="true" key={beat}>
    <p><MathText text={current.text}/></p>
    {current.tex&&<div className="guided-equation"><EquationImage tex={current.tex}/></div>}
   </div>
   <div className="guided-beat-actions">
    <button className="btn btn-ghost" disabled={beat===0} onClick={()=>setBeat(n=>n-1)} aria-label="図の説明を一段戻る">← 戻る</button>
    {beat<story.beats.length-1?<button className="btn btn-primary" onClick={()=>setBeat(n=>n+1)}>{story.beats[beat+1].action} →</button>:<span className="guided-complete">この問いの説明はここまで</span>}
   </div>
   {beat===story.beats.length-1&&story.result&&<section className="rigorous-result" aria-label="ここまでで分かったこと"><strong>ここまでで分かったこと</strong><p>{story.result}</p></section>}
   <details className="guided-recap"><summary>この問いの導出をまとめて見返す</summary><ol>{story.beats.map((s,i)=><li key={s.action}><button onClick={()=>setBeat(i)}>{s.action}の図へ戻る</button><p>{s.text}</p>{s.tex&&<EquationImage tex={s.tex}/>}</li>)}</ol></details>
   {story.notes&&<details className="guided-recap rigorous-notes"><summary>補足：ここで使った数学の根拠</summary>{story.notes.map(n=><section key={n.title}><h4>{n.title}</h4><p>{n.text}</p><EquationImage tex={n.tex}/></section>)}</details>}
  </div>
  {story.check&&<section className="guided-check" aria-label="小さな確認">
   <span className="guided-eyebrow">小さな確認 · 答えずに進んでもOK</span><h3>{story.check.question}</h3>
   <div className="guided-choices">{story.check.choices.map((option,i)=><button key={i} aria-pressed={choice===i} onClick={()=>setChoice(i)}><MathText text={option.text}/></button>)}</div>
   {choice!==null&&<p className="guided-feedback" role="status"><strong>{choice===story.check.answer?'そうです。':'図で確かめましょう。'}</strong><MathText text={story.check.choices[choice].feedback}/></p>}
  </section>}
  <button className="btn btn-primary btn-big guided-next" onClick={onNext}>{last?'⚔️ 理解をバトルで確かめる':'次の問いへ →'}</button>
 </>;
}

export function GuidedLesson({stage,alreadyFinished,onComplete,onExit}:{stage:Stage;alreadyFinished:boolean;onComplete:(firstTime:boolean)=>void;onExit:()=>void}) {
 const [page,setPage]=useState(0);
 const top=useRef<HTMLElement>(null);
 const first=useRef(true);
 const steps=stage.lesson.steps,step=steps[page];
 useEffect(()=>{if(first.current){first.current=false;window.scrollTo({top:0});}else top.current?.scrollIntoView({block:'start'});},[page]);
 const destination=stage.id==='ue-integrals'?'ベクトル場と曲線から電子の仕事を積分し、面の座標から電気束の二重積分を組み立てて計算する。':'クーロンの法則と重ね合わせから、偏心球・任意の閉曲面のガウスの法則を証明し、証明と応用を区別する。';
 const next=()=>page===steps.length-1?onComplete(!alreadyFinished):setPage(n=>n+1);
 return <div className="screen lesson guided-lesson" data-stage-id={stage.id} data-guided-lesson>
  <header className="screen-header"><button className="btn-back" onClick={onExit} aria-label="章一覧へ戻る">←</button><div><div className="screen-header-tag">大学電磁気 · {stage.title}</div><h1>{stage.lesson.title}</h1></div></header>
  <p className="guided-intro">{stage.lesson.intro}</p>
  <section className="guided-destination" ref={top} aria-label="この章と今の問い"><span className="guided-eyebrow">この章の到達点</span><p>{destination}</p><div className="guided-topic-count">今の問い · {page+1} / {steps.length}</div><h2>{step.heading}</h2></section>
  <Story key={step.story!.scene} step={step} onNext={next} last={page===steps.length-1}/>
  <div className="guided-page-navigation"><button className="btn btn-ghost" disabled={page===0} onClick={()=>setPage(n=>n-1)}>← 前の問い</button><nav className="lesson-dots" aria-label="問いを選ぶ">{steps.map((s,i)=><button key={s.heading} className={`lesson-dot ${i===page?'active':''}`} title={`${i+1}. ${s.heading}`} aria-label={`問い ${i+1}: ${s.heading}`} aria-current={i===page?'step':undefined} onClick={()=>setPage(i)}><span/></button>)}</nav></div>
  <details className="guided-contents"><summary>問いの一覧から選ぶ</summary><ol>{steps.map((s,i)=><li key={s.heading}><button onClick={()=>setPage(i)} aria-current={page===i?'step':undefined}>{s.heading}</button></li>)}</ol></details>
  {page===steps.length-1&&<p className="guided-outro">{stage.lesson.outro}</p>}
 </div>;
}

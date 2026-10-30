import {useEffect,useRef,useState} from 'react';
import type {Stage} from '../types';
import {emQuestions} from '../content/em-questions';
import {Figure} from './figures';
import {GuidedScene} from './GuidedScene';
import {EquationImage} from './CalculationBoard';
import './question-lesson.css';

export function QuestionLesson({stage,alreadyFinished,onComplete,onExit}:{stage:Stage;alreadyFinished:boolean;onComplete:(firstTime:boolean)=>void;onExit:()=>void}){
 const [page,setPage]=useState(0),[diagram,setDiagram]=useState(2);
 const anchor=useRef<HTMLDivElement>(null),questions=emQuestions[stage.id],current=questions[page];
 const step=stage.lesson.steps.find(s=>s.story?.scene===current.scene)!,story=step.story!;
 const extra=current.scene==='r-path'?['r-work']:current.scene==='r-calculate'?['r-power']:current.scene==='g-substitution'?['g-antiderivative']:[];
 const supplements=[step,...stage.lesson.steps.filter(s=>extra.includes(s.story!.scene))];
 useEffect(()=>{setDiagram(2);anchor.current?.scrollIntoView({block:'start'});},[page]);
 return <div className="screen lesson guided-lesson question-lesson" ref={anchor} data-stage-id={stage.id} data-question-lesson>
  <header className="screen-header"><button className="btn-back" onClick={onExit} aria-label="章一覧へ戻る">←</button><div><div className="screen-header-tag">大学電磁気 · {stage.title}</div><h1>{current.question}</h1></div></header>
  <p className="question-progress">{page+1} / {questions.length} · 一つの疑問を解く</p>
  <p className="question-answer">{current.answer}</p>
  <section className="question-picture" aria-label="この疑問の図" key={current.scene}>
   {current.figure?<Figure id={current.figure}/>:<><GuidedScene scene={current.scene} beat={Math.min(diagram,story.beats.length-1)}/>{!['r-path','r-calculate','r-compare'].includes(current.scene)&&<label className="guided-camera">図の段階を比較<input type="range" min="0" max={story.beats.length-1} value={diagram} onChange={e=>setDiagram(Number(e.target.value))} aria-label="図の段階を比較"/></label>}</>}
  </section>
  {story.goalTex&&!current.figure&&<div className="guided-equation"><EquationImage tex={story.goalTex}/></div>}
  <details className="question-detail" key={`detail-${page}`}><summary>根拠・途中式を詳しく見る</summary>{supplements.map(s=><section key={s.heading}><h2>{s.heading}</h2><p className="question-assumption">前提：{s.story!.basis}</p>{s.story!.beats.map(b=><div key={b.action}><h3>{b.action}</h3><p>{b.text}</p>{b.tex&&<EquationImage tex={b.tex}/>}</div>)}{s.story!.notes?.map(n=><div key={n.title}><h3>{n.title}</h3><p>{n.text}</p><EquationImage tex={n.tex}/></div>)}</section>)}</details>
  <nav className="question-navigation" aria-label="スライドを移動"><button className="btn btn-ghost" disabled={page===0} onClick={()=>setPage(p=>p-1)}>← 前へ</button><button className="btn btn-primary" onClick={()=>page===questions.length-1?onComplete(!alreadyFinished):setPage(p=>p+1)}>{page===questions.length-1?'バトルへ':'次の疑問へ →'}</button></nav>
  <nav className="lesson-dots" aria-label="疑問を選ぶ">{questions.map((q,i)=><button className={`lesson-dot ${i===page?'active':''}`} key={q.scene} aria-label={`${i+1}. ${q.question}`} aria-current={i===page?'step':undefined} onClick={()=>setPage(i)}><span/></button>)}</nav>
  <details className="question-detail"><summary>疑問の一覧</summary>{questions.map((q,i)=><button className="question-index" key={q.scene} onClick={()=>setPage(i)}>{i+1}. {q.question}</button>)}</details>
 </div>;
}

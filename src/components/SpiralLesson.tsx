import {useEffect,useRef,useState} from 'react';
import type {Stage} from '../types';
import {spiralLessons} from '../content/em-spiral';
import {Figure} from './figures';
import {GuidedScene} from './GuidedScene';
import {EquationImage} from './CalculationBoard';
import {PathMeaning} from './PathMeaning';
import {EquationMeaning} from './EquationMeaning';
import {integralEquationGuides} from '../content/em-equation-guides';
import './question-lesson.css';
import './spiral-lesson.css';

export function workSum(kind:'constant'|'linear',n:number,L:number){return kind==='constant'?2*L:L*L*(n-1)/n;}
function WorkPlot({kind,phase}:{kind:'constant'|'linear';phase:number}){
 const [n,setN]=useState(4),[L,setL]=useState(3),[selected,setSelected]=useState(1);
 const i=Math.min(selected,n-1),width=L/n,pos=i*width,force=kind==='constant'?2:2*pos;
 const x=(v:number)=>55+95*v,y=(f:number)=>225-27*f;
 const sum=workSum(kind,n,L),exact=kind==='constant'?2*L:L*L;
 return <div className="work-plot"><svg viewBox="0 0 390 290" role="img" aria-label={kind==='constant'?'一定の力の長方形を分割する図':'直線的に増える力の仕事を近似する図'}>
  <line x1="55" y1="225" x2="355" y2="225" stroke="#9eadc9"/><line x1="55" y1="30" x2="55" y2="225" stroke="#9eadc9"/>
  {Array.from({length:n},(_,j)=>{const a=j*L/n,F=kind==='constant'?2:2*a;return <rect key={j} x={x(a)} y={y(F)} width={95*L/n} height={225-y(F)} fill={j===i?'#ffd36a80':'#57dff835'} stroke={j===i?'#ffd36a':'#57dff8'}/>;})}
  <line x1="55" y1={y(kind==='constant'?2:0)} x2={x(L)} y2={y(kind==='constant'?2:2*L)} stroke="#ffd36a" strokeWidth="3"/>
  <text x="70" y="24" fill="#eef4ff" fontSize="15">{kind==='constant'?'F = 2 N':'F = kx、k = 2 N/m'}</text>
  <text x="16" y="65" fill="#b4c5df" fontSize="13">力[N]</text><text x="280" y="251" fill="#b4c5df" fontSize="13">距離 x [m]</text>
  <text x="55" y="245" fill="#b4c5df" fontSize="13">0</text><text x={x(L)} y="242" fill="#ffd36a" fontSize="13">{L.toFixed(1)}</text>
  <text x="195" y="280" textAnchor="middle" fill="#92e5bd" fontSize="16">{phase===2?`小区間の和 ${sum.toFixed(3)} J ／ 積分 ${exact.toFixed(3)} J`:`小区間の仕事の和：${sum.toFixed(3)} J`}</text>
 </svg><label>分割数 N = {n}<input aria-label="仕事の分割数" type="range" min="1" max="40" step="1" value={n} onChange={e=>setN(Number(e.target.value))}/></label><label>移動距離 L = {L.toFixed(1)} m<input aria-label="仕事の移動距離" type="range" min=".5" max="3" step=".5" value={L} onChange={e=>setL(Number(e.target.value))}/></label>
 {kind==='linear'&&phase===0&&<div className="meaning-panel"><label>見る区間 i = {i}<input aria-label="見る区間" type="range" min="0" max={n-1} value={i} onChange={e=>setSelected(Number(e.target.value))}/></label><p className="meaning-caption">金色の長方形一つを見る（番号は0から）。</p><div className="meaning-values"><span>幅 L/N<br/>{width.toFixed(3)} m</span><span>左端 iL/N<br/>{pos.toFixed(3)} m</span><span>高さ k×左端<br/>{force.toFixed(3)} N</span></div><p className="meaning-caption">一つの仕事 ≈ 高さ×幅 = {(force*width).toFixed(3)} J</p><p className="meaning-caption">Σは全区間を足す記号。WₙはN分割での近似値。kは力の増え方（図では2 N/m）。</p></div>}
 </div>;
}
const phases=['基本事項','よくある疑問','つながったこと'];
export function SpiralLesson({stage,alreadyFinished,onComplete,onExit}:{stage:Stage;alreadyFinished:boolean;onComplete:(firstTime:boolean)=>void;onExit:()=>void}){
 const [page,setPage]=useState(0),[diagram,setDiagram]=useState(0);
 const cycles=spiralLessons[stage.id],level=Math.floor(page/3),phase=page%3,cycle=cycles[level],card=cycle.cards[phase];
 const equationGuide=stage.id==='ue-integrals'?integralEquationGuides[cycle.id]?.[phase]:undefined;
 const anchor=useRef<HTMLDivElement>(null),total=cycles.length*3;
 const source=stage.lesson.steps.find(s=>s.story?.scene===card.scene)?.story;
 useEffect(()=>{setDiagram(card.beat??phase);anchor.current?.scrollIntoView({block:'start'});},[page,card]);
 return <div className="screen lesson guided-lesson question-lesson spiral-lesson" ref={anchor} data-spiral-lesson data-stage-id={stage.id}>
  <header className="screen-header"><button className="btn-back" aria-label="章一覧へ戻る" onClick={onExit}>←</button><div><div className="screen-header-tag">{stage.title} · {cycle.title}</div><h1>{card.title}</h1></div></header>
  <div className="spiral-context"><span>{cycle.uses}</span><nav aria-label="この段の学び方">{phases.map((p,i)=><button key={p} aria-current={phase===i?'step':undefined} onClick={()=>setPage(level*3+i)}>{p}</button>)}</nav></div>
  <p className="question-progress">第{level+1}段 / {cycles.length} · {page+1}/{total}</p>
  <p className="question-answer">{card.text}</p>
  <section className="question-picture" aria-label="図で確かめる" key={`${cycle.id}/${phase}`}>
   {stage.id==='ue-integrals'&&cycle.id==='path'&&phase===1?<PathMeaning/>:card.lab?<WorkPlot kind={card.lab} phase={phase}/>:card.figure?<Figure id={card.figure}/>:card.scene?<><GuidedScene scene={card.scene} beat={Math.min(diagram,(source?.beats.length??3)-1)}/>{!['r-path','r-calculate','r-compare'].includes(card.scene)&&<label className="guided-camera">図を比較<input aria-label="図の段階を比較" type="range" min="0" max={(source?.beats.length??3)-1} step="1" value={diagram} onChange={e=>setDiagram(Number(e.target.value))}/></label>}</>:null}
  </section>
  {equationGuide?<EquationMeaning key={page} guide={equationGuide} tex={card.tex}/>:card.tex&&<div className="guided-equation"><EquationImage tex={card.tex}/></div>}
  {phase===2&&<p className="spiral-gain">次に使えること：{cycle.gain}</p>}
  <nav className="question-navigation" aria-label="スライドを移動"><button className="btn btn-ghost" disabled={page===0} onClick={()=>setPage(p=>p-1)}>← 前へ</button><button className="btn btn-primary" onClick={()=>page===total-1?onComplete(!alreadyFinished):setPage(p=>p+1)}>{page===total-1?'バトルへ':phase===2?'次の基本事項へ →':phase===0?'疑問を確かめる →':'つながりを見る →'}</button></nav>
  <nav className="lesson-dots" aria-label="学びの段を選ぶ">{cycles.map((s,i)=><button className={`lesson-dot ${level===i?'active':''}`} key={s.id} aria-label={`${i+1}. ${s.title}`} aria-current={level===i?'step':undefined} onClick={()=>setPage(i*3)}><span/></button>)}</nav>
  <details className="question-detail" key={`detail-${page}`}><summary>計算の詳細・前提を確認する</summary>{stage.lesson.steps.filter(s=>cycle.references.includes(s.story!.scene)).map(s=><section key={s.heading}><h2>{s.heading}</h2><p>前提：{s.story!.basis}</p>{s.story!.beats.map(b=><div key={b.action}><h3>{b.action}</h3><p>{b.text}</p>{b.tex&&<EquationImage tex={b.tex}/>}</div>)}{s.story!.notes?.map(n=><div key={n.title}><h3>{n.title}</h3><p>{n.text}</p><EquationImage tex={n.tex}/></div>)}</section>)}</details>
  <details className="question-detail"><summary>学習のつながり</summary>{cycles.map((s,i)=><button className="question-index" key={s.id} onClick={()=>setPage(i*3)}>{i+1}. {s.title} → {s.gain}</button>)}</details>
 </div>;
}

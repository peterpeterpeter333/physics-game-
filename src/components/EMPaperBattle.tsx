import {useEffect,useState} from 'react';
import type {PaperProblem,Stage} from '../types';
import {MathText} from './MathText';
import './em-paper-battle.css';

export function EMPaperBattle({stage,problems,onExit,onFinish,nextStageTitle}:{stage:Stage;problems:PaperProblem[];onExit:()=>void;onFinish:(continueNext:boolean)=>void;nextStageTitle?:string}){
 const [index,setIndex]=useState(0);
 const [showSolution,setShowSolution]=useState(false);
 const [frame,setFrame]=useState(0);
 const [playing,setPlaying]=useState(false);
 const problem=problems[index];
 useEffect(()=>{
  if(!showSolution||!playing||frame>=problem.steps.length-1)return;
  const timer=window.setTimeout(()=>setFrame(n=>n+1),6500);
  return()=>window.clearTimeout(timer);
 },[showSolution,playing,frame,problem]);
 const advance=()=>{
  if(index===problems.length-1){onFinish(false);return;}
  setIndex(index+1);setShowSolution(false);setFrame(0);setPlaying(false);
  window.scrollTo({top:0,behavior:'smooth'});
 };
 return <div className="screen em-paper-screen">
  <header className="screen-header"><button className="btn-back" aria-label="単元一覧へ戻る" onClick={onExit}>←</button><h1>{stage.title}</h1></header>
  <div className="em-paper-progress" aria-label={`問題 ${index+1} / ${problems.length}`}>
   <span>{stage.enemy.emoji} {stage.enemy.name}</span><span>問題 {index+1} / {problems.length}</span>
  </div>
  <section className="em-paper-problem" aria-label={`問題 ${index+1}`}>
   <PaperDiagram problem={problem} explaining={showSolution} frame={frame}/>
   <div className="em-paper-labels">{problem.labels.map((label,i)=><span key={i}>{label}</span>)}</div>
   {!showSolution?<><h2>紙に図と式を書いて解こう</h2><div className="em-paper-question"><MathText text={problem.question}/></div><button className="btn btn-primary" onClick={()=>{setShowSolution(true);setFrame(0);setPlaying(true);window.scrollTo({top:0,behavior:'smooth'});}}>解き終わったので解説を見る</button></>:
    <section className="em-paper-explainer" aria-label={`${index+1}問目の無音の解説アニメーション`}>
     <div className="em-paper-explainer-head"><strong>解説アニメーション</strong><span>声なし · {frame+1} / {problem.steps.length}</span></div>
     <div className="em-paper-frame" key={`${problem.id}-${frame}`} aria-live="polite"><MathText text={problem.steps[frame]}/></div>
     <div className="em-paper-controls">
      <button className="btn btn-ghost" disabled={frame===0} onClick={()=>{setFrame(n=>n-1);setPlaying(false);}}>← 前の手順</button>
      <button className="btn btn-ghost" onClick={()=>{if(frame===problem.steps.length-1){setFrame(0);setPlaying(true);}else setPlaying(p=>!p);}}>{frame===problem.steps.length-1?'最初から再生':playing?'一時停止':'再生'}</button>
      <button className="btn btn-ghost" disabled={frame===problem.steps.length-1} onClick={()=>{setFrame(n=>n+1);setPlaying(false);}}>次の手順 →</button>
     </div>
     <button className="btn btn-ghost" onClick={()=>{setShowSolution(false);setPlaying(false);}}>問題文を見返す</button>
     <button className="btn btn-primary" onClick={advance}>{index===problems.length-1?'⚔️ この単元を終える':'⚔️ 次の問題へ'}</button>
    </section>}
  </section>
  {showSolution&&index===problems.length-1&&nextStageTitle&&<p className="em-paper-next">次は「{nextStageTitle}」です。単元一覧から進めます。</p>}
 </div>;
}

function PaperDiagram({problem,explaining,frame}:{problem:PaperProblem;explaining:boolean;frame:number}){
 const p=problem.id;
 const line=(x1:number,y1:number,x2:number,y2:number,accent=false,label?:string)=><g><line x1={x1} y1={y1} x2={x2} y2={y2} className={accent?'paper-arrow-accent':'paper-arrow'}/>{label&&<text x={(x1+x2)/2} y={(y1+y2)/2-7} textAnchor="middle">{label}</text>}</g>;
 const point=(x:number,y:number,label:string)=><g><circle cx={x} cy={y} r="7" className="paper-point"/><text x={x} y={y+25} textAnchor="middle">{label}</text></g>;
 let figure;
 switch(p){
  case 'paper-ui-field-1': figure=<>{[0,1,2].map(i=><g key={i}>{line(55+i*105,83,120+i*105,83,false,'E')}</g>)}<circle cx="210" cy="83" r="17" className="paper-charge"/><text x="210" y="88" textAnchor="middle">−</text>{explaining&&frame===2&&line(206,114,130,114,true,'F')}</>;break;
  case 'paper-ui-field-2': figure=<>{point(105,105,'A')}{point(300,105,'B')}{line(118,93,190,93,false,'Eₐ')}{line(300,92,300,25,false,'Eᵦ')}{explaining&&frame>0&&line(118,70,188,70,true,'Fₐ')}{explaining&&frame===2&&line(330,92,330,25,true,'Fᵦ')}</>;break;
  case 'paper-ui-field-3': figure=<>{point(210,90,'+Q')}{point(65,90,'L')}{point(355,90,'R')}{line(180,74,112,74,false,'E')}{line(240,74,308,74,false,'E')}{explaining&&frame===2&&line(110,113,178,113,true,'F')}{explaining&&frame===2&&line(308,113,240,113,true,'F')}</>;break;
  case 'paper-um-line-1': figure=<>{point(180,113,'出発点')}{line(180,113,282,61,false,'F')}{line(180,113,302,142,true,'Δr')}</>;break;
  case 'paper-um-line-2': figure=<>{point(195,135,'出発点')}{line(195,135,195,55,true,'① 上へ')}{line(195,55,105,55,true,'② 左へ')}{line(195,135,310,135,false,'F 右へ')}</>;break;
  case 'paper-um-line-3': figure=<>{point(132,125,'代表点')}{line(132,125,235,48,false,'E')}{line(132,125,320,85,true,'Δr')}</>;break;
  case 'paper-ue-integrals-1': figure=<><path d="M58 135 Q210 155 355 36" className="paper-curve"/>{point(58,135,'u=0')}{point(355,36,'u=1')}{line(190,110,243,84,true,'dr')}</>;break;
  case 'paper-ue-integrals-2': figure=<><polygon points="130,53 180,83 180,165 130,137" className="paper-cube-face-muted"/><polygon points="265,53 315,83 315,165 265,137" className="paper-cube-face"/><path d="M130 53L265 53L315 83L180 83Z M130 53L130 137L180 165L180 83 M180 165L315 165L315 83 M265 53L265 137L315 165" className="paper-cube"/><text x="139" y="105">x=0</text><text x="270" y="103">x=1</text>{line(267,117,355,117,false,'E')}{explaining&&line(315,141,390,141,true,'外向き')}</>;break;
  default: figure=<><line x1="46" y1="134" x2="386" y2="134" className="paper-axis"/>{point(60,134,'A: x=0')}{point(355,134,'B: x=2')}{[0,1,2,3].map(i=><g key={i}>{line(125+i*70,126,125+i*70,112-i*i*8,false,'E')}</g>)}</>;
 }
 return <div className={`em-paper-figure ${explaining?'is-explaining':''}`} role="img" aria-label={problem.labels.join('、')}>
  <svg viewBox="0 0 420 180" preserveAspectRatio="xMidYMid meet"><defs><marker id="paper-tip" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0 0L0 6L8 3Z" fill="var(--cyan)"/></marker><marker id="paper-tip-accent" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0 0L0 6L8 3Z" fill="var(--gold)"/></marker></defs>{figure}</svg>
 </div>;
}

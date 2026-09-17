import {useEffect,useRef,useState} from 'react';
import type {Stage} from '../types';
import catalog from '../content/em-video-catalog.generated.json';
import {claimNarration} from '../game/narration';
import {useLessonPosition} from '../game/useLessonPosition';
import {EquationImage} from './CalculationBoard';
import {QuantityGlossary} from './QuantityGlossary';
import type {EquationGuide} from '../content/em-equation-guides';
import {spiralLessons} from '../content/em-spiral';
import {movedCycles} from '../content/university-curriculum';
import {Figure} from './figures';
import {UniqueFigure,getUniqueShot} from './figures/unique';
import {EMScene3D} from './EMScene3D';
import {scene3DFor} from './em3d-model';
import {PathMeaning} from './PathMeaning';
import {GuidedScene} from './GuidedScene';
import {TopicRoute} from './TopicRoute';
import './em-video-lesson.css';

type MovieScene={index:number;heading:string;narration:string;equations:string[];guide?:EquationGuide;start:number;end:number;captions:{start:number;end:number;text:string}[]};
type Movie={id:string;stageId:string;stageTitle:string;level:string;title:string;duration:number;sourceIndices:number[];scenes:MovieScene[]};
const movies=catalog as unknown as Movie[];
export function hasEMMovies(stage:Stage){
 const count=spiralLessons[stage.id]?.filter(c=>!movedCycles[stage.id]?.[c.id]).reduce((n,c)=>n+c.cards.length,0)??stage.lesson.steps.length;
 const indices=movies.filter(m=>m.stageId===stage.id).flatMap(m=>m.sourceIndices);
 return indices.length===count&&new Set(indices).size===count&&indices.every(i=>i>=0&&i<count);
}
function InteractiveDiagram({stage,index}:{stage:Stage;index:number}){
 const cards=spiralLessons[stage.id]?.filter(c=>!movedCycles[stage.id]?.[c.id]).flatMap(cycle=>cycle.cards.map((card,phase)=>({cycle,card,phase})));
 if(cards){const {cycle,card,phase}=cards[index],scene=scene3DFor(cycle.id,phase);
  if(scene)return <EMScene3D scene={scene} phase={phase}/>;
  if(card.pathPart!==undefined)return <PathMeaning initialPart={card.pathPart}/>;
  if(card.figure)return <Figure id={card.figure}/>;
  if(card.scene)return <GuidedScene scene={card.scene} beat={card.beat??Math.min(phase,2)}/>;
 }
 const step=stage.lesson.steps[index];if(!step)return null;
 const shot=getUniqueShot(stage.id,step);
 return shot?<UniqueFigure shot={shot} id={`film-${stage.id}-${index}`}/>:step.figure?<Figure id={step.figure}/>:null;
}
export function EMVideoLesson({stage,alreadyFinished,onComplete,onExit,onOpenStage,onOriginal}:{stage:Stage;alreadyFinished:boolean;onComplete:(firstTime:boolean)=>void;onExit:()=>void;onOpenStage?:(id:string)=>void;onOriginal:()=>void}){
 const list=movies.filter(m=>m.stageId===stage.id);
 const [page,setPage]=useLessonPosition(`${stage.id}:nemo-movies-v1`,list.length);
 const movie=list[Math.min(page,list.length-1)];
 const player=useRef<HTMLVideoElement>(null),release=useRef<()=>void>(),top=useRef<HTMLDivElement>(null);
 const [failed,setFailed]=useState(false),[active,setActive]=useState(0);
 const base=`${import.meta.env.BASE_URL}media/em/${movie.id}`;
 const scene=movie.scenes[active]??movie.scenes[0];
 useEffect(()=>{setFailed(false);setActive(0);top.current?.scrollIntoView({block:'start'});return()=>{release.current?.();};},[movie.id]);
 function jump(index:number){const video=player.current;if(video)video.currentTime=movie.scenes[index].start;setActive(index);}
 return <div ref={top} className="screen lesson em-movie-lesson" data-stage-id={stage.id}>
  <header className="screen-header"><button className="btn-back" aria-label="章一覧へ戻る" onClick={onExit}>←</button><div><div className="screen-header-tag">大学電磁気・{{intro:'初級',middle:'中級',advanced:'上級'}[movie.level]} ／ 動画 {page+1} / {list.length}</div><h1>{stage.title}</h1></div></header>
  <TopicRoute stageId={stage.id} onOpenStage={onOpenStage}/>
  <section className="em-movie-main" aria-label="図と音声で学ぶ">
   <h2>この動画が求めること：{movie.title}</h2>
   <video key={movie.id} ref={player} controls playsInline preload="metadata" poster={`${base}.jpg`} aria-label={`${movie.title}の音声・字幕付き動画`}
    onError={()=>setFailed(true)} onPlay={()=>{release.current?.();release.current=claimNarration(()=>player.current?.pause());}}
    onTimeUpdate={()=>{const t=player.current?.currentTime??0;const i=movie.scenes.findIndex(s=>t>=s.start&&t<s.end);if(i>=0)setActive(i);}}>
    <source src={`${base}.mp4`} type="video/mp4" onError={()=>setFailed(true)}/>
   </video>
   {failed&&<p role="alert">この端末では動画を読み込めませんでした。<a href={`${base}.mp4`} target="_blank" rel="noreferrer">動画を直接開く</a>か、<button onClick={onOriginal}>元の図と解説を開く</button>をお試しください。</p>}
   <div className="em-movie-meta"><span>約{Math.round(movie.duration)}秒・音声：VOICEVOX Nemo 男声1</span><a href={`${base}.mp4`} target="_blank" rel="noreferrer">動画だけを開く</a><span>図と式は、動画の全画面ボタンと端末の横向き表示で大きく確認できます。</span></div>
   <nav className="em-movie-scenes" aria-label="動画の説明位置へ移動">{movie.scenes.map((s,i)=><button key={s.index} aria-current={active===i?'step':undefined} onClick={()=>jump(i)}>{i+1}. {s.heading}</button>)}</nav>
  </section>
  <section className="em-movie-notes" aria-label="今の場面の補足">
   <h3>この場面でつながること</h3><p>{scene.narration.split('。').filter(Boolean).slice(-1)[0]}。</p>
   <details key={`${movie.id}-${active}`} onToggle={e=>{if(e.currentTarget.open)player.current?.pause();}}><summary>この場面の式・記号・図を自分のペースで確認する</summary>
    <p>この場面の説明：{scene.narration}</p>
    {scene.guide&&<dl className="equation-symbols">{scene.guide.symbols.map(([symbol,meaning])=><div key={symbol}><dt>{symbol}</dt><dd>{meaning}</dd></div>)}</dl>}
    {scene.equations.length>0&&<><p>この計算が確認する内容：{scene.heading}</p>{scene.equations.map((tex,i)=><div key={tex} className="em-movie-equation"><span>式 {i+1}</span><EquationImage tex={tex}/></div>)}{!scene.guide&&<QuantityGlossary stageId={stage.id} expressions={scene.equations}/>}</>}
    <InteractiveDiagram key={`${stage.id}-${scene.index}`} stage={stage} index={scene.index}/>
   </details>
   <details><summary>動画全体の文章を読む</summary>{movie.scenes.map((s,i)=><section key={s.index}><h4>{i+1}. {s.heading}</h4><p>{s.narration}</p></section>)}</details>
  </section>
  <div className="lesson-controls"><div className="lesson-navigation"><button className="btn btn-ghost" disabled={page===0} onClick={()=>setPage(p=>p-1)}>← 前へ</button><nav className="lesson-dots" aria-label="解説動画を選ぶ">{list.map((m,i)=><button key={m.id} className={`lesson-dot ${i===page?'active':''}`} aria-label={`動画${i+1}: ${m.title}`} aria-current={page===i?'step':undefined} onClick={()=>setPage(i)}><span/></button>)}</nav></div>{page<list.length-1&&<button className="btn btn-primary" onClick={()=>setPage(p=>p+1)}>次へ →</button>}<button className="btn btn-battle" onClick={()=>onComplete(!alreadyFinished)}>⚔️ {stage.enemy.name}に挑む</button></div>
  <button className="btn btn-ghost" onClick={onOriginal}>元のスライドで詳しく確認する</button>
 </div>;
}

import {useEffect,useRef,useState} from 'react';
import type {Stage} from '../types';
import catalog from '../content/em-video-catalog.generated.json';
import {claimNarration} from '../game/narration';
import {useLessonPosition} from '../game/useLessonPosition';
import {spiralLessons} from '../content/em-spiral';
import {movedCycles} from '../content/university-curriculum';
import './em-video-lesson.css';

type MovieScene={index:number;heading:string;narration:string;start:number;end:number;captions:{start:number;end:number;text:string}[]};
type Movie={id:string;stageId:string;stageTitle:string;level:string;title:string;duration:number;sourceIndices:number[];scenes:MovieScene[]};
const movies=catalog as unknown as Movie[];
export function hasEMMovies(stage:Stage){
 const count=spiralLessons[stage.id]?.filter(c=>!movedCycles[stage.id]?.[c.id]).reduce((n,c)=>n+c.cards.length,0)??stage.lesson.steps.length;
 const indices=movies.filter(m=>m.stageId===stage.id).flatMap(m=>m.sourceIndices);
 return indices.length===count&&new Set(indices).size===count&&indices.every(i=>i>=0&&i<count);
}
function threadText(list:Movie[],page:number,scene:MovieScene){
 const current=list[page];
 const scenePosition=current.scenes.findIndex(candidate=>candidate.index===scene.index);
 const previousMovie=list[page-1];
 const previous=current.scenes[scenePosition-1]??previousMovie?.scenes[previousMovie.scenes.length-1];
 const next=current.scenes[scenePosition+1]??list[page+1]?.scenes[0];
 if(previous&&next)return `前の「${previous.heading}」を使って、今回は「${scene.heading}」を考えます。次は「${next.heading}」へ進みます。`;
 if(previous)return `前の「${previous.heading}」を使って、今回は「${scene.heading}」を考えます。`;
 if(next)return `この章では、まず「${scene.heading}」から始めます。次は「${next.heading}」へ進みます。`;
 return `この動画では「${scene.heading}」を考えます。`;
}
export function EMVideoLesson({stage,alreadyFinished,onComplete,onExit}:{stage:Stage;alreadyFinished:boolean;onComplete:(firstTime:boolean)=>void;onExit:()=>void}){
 const list=movies.filter(m=>m.stageId===stage.id);
 const [page,setPage]=useLessonPosition(`${stage.id}:nemo-movies-v1`,list.length);
 const movie=list[Math.min(page,list.length-1)];
 const player=useRef<HTMLVideoElement>(null),release=useRef<()=>void>(),top=useRef<HTMLDivElement>(null);
 const [failed,setFailed]=useState(false),[active,setActive]=useState(0);
 const base=`${import.meta.env.BASE_URL}media/em/${movie.id}`;
 const scene=movie.scenes[active]??movie.scenes[0];
 useEffect(()=>{setFailed(false);setActive(0);top.current?.scrollIntoView({block:'start'});return()=>{release.current?.();};},[movie.id]);
 return <div ref={top} className="screen lesson em-movie-lesson" data-stage-id={stage.id}>
  <header className="screen-header"><button className="btn-back" aria-label="章一覧へ戻る" onClick={onExit}>←</button><div><div className="screen-header-tag">動画 {page+1} / {list.length}</div><h1>{stage.title}</h1></div></header>
  <section className="em-movie-main" aria-label="図と音声で学ぶ">
   <h2>{movie.title}</h2>
   <video key={movie.id} ref={player} controls playsInline preload="metadata" poster={`${base}.jpg`} aria-label={`${movie.title}の音声・字幕付き動画`}
    onError={()=>setFailed(true)} onPlay={()=>{release.current?.();release.current=claimNarration(()=>player.current?.pause());}}
    onTimeUpdate={()=>{const t=player.current?.currentTime??0;const i=movie.scenes.findIndex(s=>t>=s.start&&t<s.end);if(i>=0)setActive(i);}}>
    <source src={`${base}.mp4`} type="video/mp4" onError={()=>setFailed(true)}/>
   </video>
   {failed&&<p className="em-movie-error" role="alert">この端末では動画を読み込めませんでした。通信状態を確認して、もう一度開いてください。</p>}
  </section>
  <section className="em-movie-note" aria-label="動画の短い補足">
   <p><strong>いまの問い</strong> {scene.heading}</p>
   <p>{threadText(list,page,scene)}</p>
  </section>
  <div className="lesson-controls em-movie-controls"><button className="btn btn-ghost" disabled={page===0} onClick={()=>setPage(p=>p-1)}>← 前へ</button><nav className="lesson-dots" aria-label="動画を選ぶ">{list.map((m,i)=><button key={m.id} className={`lesson-dot ${i===page?'active':''}`} aria-label={`動画${i+1}: ${m.title}`} aria-current={page===i?'step':undefined} onClick={()=>setPage(i)}><span/></button>)}</nav><button className="btn btn-primary" disabled={page===list.length-1} onClick={()=>setPage(p=>p+1)}>次へ →</button></div>
  <button className="btn btn-battle em-movie-battle" onClick={()=>onComplete(!alreadyFinished)}>⚔️ {stage.enemy.name}に挑む</button>
 </div>;
}

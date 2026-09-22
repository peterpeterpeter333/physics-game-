import {useEffect,useRef,useState} from 'react';
import type {Stage} from '../types';
import catalog from '../content/em-video-catalog.generated.json';
import lessonCatalog from '../content/lesson-video-catalog.generated.json';
import prerequisiteCatalog from '../content/prerequisite-video-catalog.generated.json';
import {prerequisitePlaylist} from '../game/prerequisite-playlist';
import {claimNarration} from '../game/narration';
import {useLessonPosition} from '../game/useLessonPosition';
import {spiralLessons} from '../content/em-spiral';
import {movedCycles} from '../content/university-curriculum';
import './em-video-lesson.css';

type MovieScene={index:number;heading:string;narration:string;start:number;end:number;captions:{start:number;end:number;text:string}[]};
type Movie={id:string;stageId:string;stageTitle:string;level:string;title:string;duration:number;sourceIndices?:number[];mediaDirectory?:string;renderKey?:string;scenes:MovieScene[]};
const movies=[...catalog,...lessonCatalog] as unknown as Movie[];
export function hasEMMovies(stage:Stage){
 if(lessonCatalog.some((m:{stageId:string})=>m.stageId===stage.id))return true;
 const count=spiralLessons[stage.id]?.filter(c=>!movedCycles[stage.id]?.[c.id]).reduce((n,c)=>n+c.cards.length,0)??stage.lesson.steps.length;
 const indices=movies.filter(m=>m.stageId===stage.id).flatMap(m=>m.sourceIndices??[]);
 return indices.length===count&&new Set(indices).size===count&&indices.every(i=>i>=0&&i<count);
}
export function EMVideoLesson({stage,alreadyFinished,onComplete,onExit}:{stage:Stage;alreadyFinished:boolean;onComplete:(firstTime:boolean)=>void;onExit:()=>void}){
 const all=movies.filter(m=>m.stageId===stage.id);
 const levels=['intro','middle','advanced'].filter(level=>all.some(m=>m.level===level));
 const [level,setLevel]=useState(()=>{try{const saved=localStorage.getItem(`physics-quest:video-level:${stage.id}`);return saved&&levels.includes(saved)?saved:levels[0];}catch{return levels[0];}});
 useEffect(()=>{try{localStorage.setItem(`physics-quest:video-level:${stage.id}`,level);}catch{/* Playback does not require storage. */}},[stage.id,level]);
 return <div className="video-lesson-shell">
 {levels.length>1&&<nav className="video-levels" aria-label="動画の難易度">{levels.map(value=><button key={value} type="button" aria-pressed={level===value} onClick={()=>setLevel(value)}>{{intro:'初級',middle:'中級',advanced:'上級'}[value]}</button>)}</nav>}
 <VideoPlayer key={`${stage.id}:${level}`} stage={stage} alreadyFinished={alreadyFinished} onComplete={onComplete} onExit={onExit} list={prerequisitePlaylist(all.filter(m=>m.level===level),prerequisiteCatalog as unknown as (Movie & {before:string[]})[])} level={level}/>
 </div>;
}
function VideoPlayer({stage,alreadyFinished,onComplete,onExit,list,level}:{stage:Stage;alreadyFinished:boolean;onComplete:(firstTime:boolean)=>void;onExit:()=>void;list:Movie[];level:string}){
 // Previously saved numeric positions must not skip newly inserted prerequisites.
 const sequenceVersion=list.some(m=>m.id.startsWith('prep-'))?'nemo-prerequisites-v1':'nemo-movies-v2';
 const [page,setPage]=useLessonPosition(`${stage.id}:${level}:${sequenceVersion}`,list.length);
 const movie=list[Math.min(page,list.length-1)];
 const player=useRef<HTMLVideoElement>(null),release=useRef<()=>void>(),top=useRef<HTMLDivElement>(null);
 const [failed,setFailed]=useState(false),[active,setActive]=useState(0);
 const base=`${import.meta.env.BASE_URL}media/${movie.mediaDirectory??'em'}/${movie.id}`;
 // Replaced media retains its filename; identify its actual content to browser caches.
 const revision=movie.renderKey?`?v=${movie.renderKey.slice(0,16)}`:'';
 const scene=movie.scenes[active]??movie.scenes[0];
 const sentences=scene.narration.split('。').filter(Boolean);
 useEffect(()=>{
  setFailed(false);setActive(0);
  // Include the difficulty selector above the player when opening or switching videos.
  const lessonTop=top.current?.closest('.video-lesson-shell')??top.current;
  lessonTop?.scrollIntoView({block:'start'});
  return()=>{release.current?.();};
 },[movie.id]);
 return <div ref={top} className="screen lesson em-movie-lesson" data-stage-id={stage.id}>
  <header className="screen-header"><button className="btn-back" aria-label="章一覧へ戻る" onClick={onExit}>←</button><h1>{stage.title}</h1></header>
  <section className="em-movie-main" aria-label="図と音声で学ぶ">
   <h2>{movie.title}</h2>
   <video key={movie.id} ref={player} controls playsInline preload="metadata" poster={`${base}.jpg${revision}`} aria-label={`${movie.title}の音声・字幕付き動画`}
    onError={()=>setFailed(true)} onPlay={()=>{release.current?.();release.current=claimNarration(()=>player.current?.pause());}}
    onTimeUpdate={()=>{const t=player.current?.currentTime??0;const i=movie.scenes.findIndex(s=>t>=s.start&&t<s.end);if(i>=0)setActive(i);}}>
    <source src={`${base}.mp4${revision}`} type="video/mp4" onError={()=>setFailed(true)}/>
   </video>
   {failed&&<p className="em-movie-error" role="alert">この端末では動画を読み込めませんでした。通信状態を確認して、もう一度開いてください。</p>}
  </section>
  <section className="em-movie-note" aria-label="動画の短い補足">
   <p>{movie.mediaDirectory==='lessons'?(sentences[sentences.length-1]+'。'):scene.heading}</p>
  </section>
  {list.length>1&&<div className="lesson-controls em-movie-controls"><button className="btn btn-ghost" disabled={page===0} onClick={()=>setPage(p=>p-1)}>← 前へ</button><nav className="lesson-dots" aria-label="動画を選ぶ">{list.map((m,i)=><button key={m.id} className={`lesson-dot ${i===page?'active':''}`} aria-label={`動画${i+1}: ${m.title}`} aria-current={page===i?'step':undefined} onClick={()=>setPage(i)}><span/></button>)}</nav><button className="btn btn-primary" disabled={page===list.length-1} onClick={()=>setPage(p=>p+1)}>次へ →</button></div>}
  <button className="btn btn-battle em-movie-battle" onClick={()=>onComplete(!alreadyFinished)}>⚔️ {stage.enemy.name}に挑む</button>
 </div>;
}

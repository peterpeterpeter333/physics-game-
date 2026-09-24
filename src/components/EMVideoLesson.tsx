import {useEffect,useRef,useState} from 'react';
import type {Stage} from '../types';
import catalog from '../content/em-video-catalog.generated.json';
import lessonCatalog from '../content/lesson-video-catalog.generated.json';
import prerequisiteCatalog from '../content/prerequisite-video-catalog.generated.json';
import insertCatalog from '../content/insert-video-catalog.generated.json';
import insertRoutes from '../content/insert-routes.generated.json';
import revisedCatalog from '../content/revised-video-catalog.generated.json';
import type {InsertRoute,VideoMode} from '../game/video-inserts';
import {SegmentedLessonVideo} from './SegmentedLessonVideo';
import {prerequisitePlaylist,prerequisiteReview,thoroughPrerequisitePlaylist,prerequisiteSelectionParent} from '../game/prerequisite-playlist';
import {restoredVideoId,legacyVideoId} from '../game/video-progress';
import {manualVideoPlaylist} from '../game/manual-video-playlist';
import {spiralLessons} from '../content/em-spiral';
import {movedCycles} from '../content/university-curriculum';
import './em-video-lesson.css';

type MovieScene={index:number;heading:string;narration:string;start:number;end:number;captions:{start:number;end:number;text:string}[]};
type Movie={id:string;stageId:string;stageTitle:string;level:string;title:string;duration:number;sourceIndices?:number[];mediaDirectory?:string;renderKey?:string;scenes:MovieScene[]};
const movies=([...catalog,...lessonCatalog] as unknown as Movie[]).map(m=>(revisedCatalog as Movie[]).find(r=>r.id===m.id)??m);
const prerequisiteMovies=prerequisiteCatalog.map(m=>(revisedCatalog as unknown as typeof prerequisiteCatalog).find(r=>r.id===m.id)??m);
export function hasEMMovies(stage:Stage){
 if(lessonCatalog.some((m:{stageId:string})=>m.stageId===stage.id))return true;
 const count=spiralLessons[stage.id]?.filter(c=>!movedCycles[stage.id]?.[c.id]).reduce((n,c)=>n+c.cards.length,0)??stage.lesson.steps.length;
 const indices=movies.filter(m=>m.stageId===stage.id).flatMap(m=>m.sourceIndices??[]);
 return indices.length===count&&new Set(indices).size===count&&indices.every(i=>i>=0&&i<count);
}
export function EMVideoLesson({stage,alreadyFinished,onComplete,onExit,onReadSlides}:{stage:Stage;alreadyFinished:boolean;onComplete:(firstTime:boolean)=>void;onExit:()=>void;onReadSlides:()=>void}){
 const all=movies.filter(m=>m.stageId===stage.id);
 const levels=['intro','middle','advanced'].filter(level=>all.some(m=>m.level===level));
 const [level,setLevel]=useState(()=>{try{const saved=localStorage.getItem(`physics-quest:video-level:${stage.id}`);return saved&&levels.includes(saved)?saved:levels[0];}catch{return levels[0];}});
 const [mode,setMode]=useState<VideoMode>(()=>{try{return localStorage.getItem(`physics-quest:video-mode:${stage.id}`)==='thorough'?'thorough':'quick';}catch{return 'quick';}});
 const basePlaylist=prerequisitePlaylist(all.filter(m=>m.level===level),prerequisiteMovies as unknown as Movie[]);
 const detailedPlaylist=thoroughPrerequisitePlaylist(basePlaylist,prerequisiteMovies as unknown as Movie[],'thorough');
 const hasThorough=detailedPlaylist.length>basePlaylist.length||detailedPlaylist.some(m=>(insertRoutes as Record<string,InsertRoute[]>)[m.id]?.length);
 useEffect(()=>{try{localStorage.setItem(`physics-quest:video-mode:${stage.id}`,mode);}catch{/* Storage is optional. */}},[stage.id,mode]);
 useEffect(()=>{try{localStorage.setItem(`physics-quest:video-level:${stage.id}`,level);}catch{/* Playback does not require storage. */}},[stage.id,level]);
 return <div className="video-lesson-shell">
 {levels.length>1&&<nav className="video-levels" aria-label="動画の難易度">{levels.map(value=><button key={value} type="button" aria-pressed={level===value} onClick={()=>setLevel(value)}>{{intro:'初級',middle:'中級',advanced:'上級'}[value]}</button>)}</nav>}
 <nav className="video-levels" aria-label="学び方">{(['quick','thorough'] as const).map(value=><button key={value} type="button" aria-pressed={mode===value} onClick={()=>setMode(value)}>{value==='quick'?'さっと学ぶ':'とことん学ぶ'}</button>)}</nav>
 {mode==='thorough'&&!hasThorough&&<p className="video-mode-pending">この単元の補足動画は準備中です。現在は共通の本編を再生します。</p>}
 <VideoPlayer key={`${stage.id}:${level}`} stage={stage} alreadyFinished={alreadyFinished} onComplete={onComplete} onExit={onExit} onReadSlides={onReadSlides} original={all.filter(m=>m.level===level)} level={level} mode={mode}/>
 </div>;
}
function VideoPlayer({stage,alreadyFinished,onComplete,onExit,onReadSlides,original,level,mode}:{stage:Stage;alreadyFinished:boolean;onComplete:(firstTime:boolean)=>void;onExit:()=>void;onReadSlides:()=>void;original:Movie[];level:string;mode:VideoMode}){
 // The unit's assigned videos do not depend on completion in other units.
 const [assigned]=useState(()=>prerequisitePlaylist(original,prerequisiteMovies as unknown as Movie[]));
 const activeAssigned=thoroughPrerequisitePlaylist(assigned,prerequisiteMovies as unknown as Movie[],mode);
 const list=manualVideoPlaylist(activeAssigned,mode,insertRoutes as Record<string,InsertRoute[]>,insertCatalog as Movie[]);
 const review=thoroughPrerequisitePlaylist(prerequisiteReview(original,prerequisiteMovies as unknown as Movie[]),prerequisiteMovies as unknown as Movie[],mode);
 const positionKey=`physics-quest:video-position:v3:${stage.id}:${level}`;
 const [selectedId,setSelectedId]=useState(()=>{
  try{
   const hadPrep=prerequisiteCatalog.some(p=>original.some(c=>p.before.includes(c.id)));
   const legacyKey=`physics-quest:lesson-position:${stage.id}:${level}:${hadPrep?'nemo-prerequisites-v1':'nemo-movies-v2'}`;
   const saved=localStorage.getItem(positionKey)??legacyVideoId(localStorage.getItem(legacyKey),original,prerequisiteCatalog);
   return restoredVideoId(saved,list,original,prerequisiteCatalog);
  }catch{return list[0].id;}
 });
 const [reviewId,setReviewId]=useState<string|null>(null);
 const parentId=prerequisiteSelectionParent(selectedId,activeAssigned);
 const selectedPage=list.findIndex(m=>m.id===selectedId);
 const page=selectedPage>=0?selectedPage:Math.max(0,list.findIndex(m=>m.parentId===parentId));
 const reviewing=review.find(m=>m.id===reviewId);
 const current=list[page];
 const movie=reviewing??current.media;
 const selectPage=(index:number)=>{if(!list[index])return;setSelectedId(list[index].id);setReviewId(null);};
 useEffect(()=>{try{localStorage.setItem(positionKey,selectedId);}catch{/* Optional resume state. */}},[positionKey,selectedId]);
 const top=useRef<HTMLDivElement>(null);
 const [failed,setFailed]=useState(false);
 useEffect(()=>{
  setFailed(false);
  // Include the difficulty selector above the player when opening or switching videos.
  const lessonTop=top.current?.closest('.video-lesson-shell')??top.current;
  lessonTop?.scrollIntoView({block:'start'});
 },[movie.id,current.id,mode]);
 return <div ref={top} className="screen lesson em-movie-lesson" data-stage-id={stage.id}>
  <header className="screen-header"><button className="btn-back" aria-label="章一覧へ戻る" onClick={onExit}>←</button><h1>{stage.title}</h1></header>
  <section className="em-movie-main" aria-label="図と音声で学ぶ">
   <h2>{reviewing?movie.title:current.title}</h2>
   <SegmentedLessonVideo key={reviewing?movie.id:mode+current.id} main={movie} start={reviewing?0:current.start} end={reviewing?movie.duration:current.end} onError={()=>setFailed(true)}/>
   {failed&&<div className="em-movie-error" role="alert"><p>この端末では動画を再生できませんでした。文字とスライドで読めます。</p><button className="btn btn-ghost" onClick={onReadSlides}>文字とスライドで読む</button></div>}
  </section>
  {reviewing?<button className="btn btn-ghost" onClick={()=>setReviewId(null)}>学習に戻る</button>:<>
   {movie.id.startsWith('prep-')&&<button className="btn btn-ghost" onClick={()=>selectPage(list.findIndex((m,i)=>i>page&&!m.id.startsWith('prep-')))}>本編へ</button>}
   {list.length>1&&<div className="lesson-controls em-movie-controls"><button className="btn btn-ghost" disabled={page===0} onClick={()=>selectPage(page-1)}>← 前へ</button><nav className="lesson-dots" aria-label="動画を選ぶ">{list.map((m,i)=><button key={m.id} className={`lesson-dot ${i===page?'active':''}`} aria-label={`動画${i+1}: ${m.title}`} aria-current={page===i?'step':undefined} onClick={()=>selectPage(i)}><span/></button>)}</nav><button className="btn btn-primary" disabled={page===list.length-1} onClick={()=>selectPage(page+1)}>次へ →</button></div>}
  </>}
  {review.length>0&&<details className="em-movie-review"><summary>必要なときだけ復習</summary><div>{review.map(m=><button type="button" key={m.id} className="btn btn-ghost" aria-pressed={reviewId===m.id} onClick={()=>setReviewId(m.id)}>{m.title}</button>)}</div></details>}
  <button className="btn btn-battle em-movie-battle" onClick={()=>onComplete(!alreadyFinished)}>⚔️ {stage.enemy.name}に挑む</button>
 </div>;
}

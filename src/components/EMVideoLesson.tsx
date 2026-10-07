import {useEffect,useRef,useState} from 'react';
import type {Stage} from '../types';
import catalog from '../content/em-video-catalog.generated.json';
import lessonCatalog from '../content/lesson-video-catalog.generated.json';
import prerequisiteCatalog from '../content/prerequisite-video-catalog.generated.json';
import insertCatalog from '../content/insert-video-catalog.generated.json';
import insertRoutes from '../content/insert-routes.generated.json';
import revisedCatalog from '../content/revised-video-catalog.generated.json';
import b2SeriesCatalog from '../content/b2-series.generated.json';
import highSchoolSeriesCatalog from '../content/high-school-series.generated.json';
import type {InsertRoute,VideoMode} from '../game/video-inserts';
import {SegmentedLessonVideo} from './SegmentedLessonVideo';
import {prerequisitePlaylist,prerequisiteReview,thoroughPrerequisitePlaylist,prerequisiteSelectionParent} from '../game/prerequisite-playlist';
import {restoredVideoId,legacyVideoId} from '../game/video-progress';
import {manualVideoPlaylist} from '../game/manual-video-playlist';
import {spiralLessons} from '../content/em-spiral';
import {movedCycles} from '../content/university-curriculum';
import {b2SeriesEnabled,youtubeIdFor} from '../game/video-delivery';
import './em-video-lesson.css';

type MovieScene={index:number;heading:string;narration:string;start:number;end:number;captions:{start:number;end:number;text:string}[]};
type Movie={id:string;stageId:string;stageTitle:string;level:string;title:string;duration:number;sourceIndices?:number[];mediaDirectory?:string;renderKey?:string;objectKey?:string;part?:number;scenes:MovieScene[]};
const movies=([...catalog,...lessonCatalog] as unknown as Movie[]).map(m=>(revisedCatalog as Movie[]).find(r=>r.id===m.id)??m);
const prerequisiteMovies=prerequisiteCatalog.map(m=>(revisedCatalog as unknown as typeof prerequisiteCatalog).find(r=>r.id===m.id)??m);
export function hasEMMovies(stage:Stage){
 if(b2SeriesCatalog.some(m=>m.stageId===stage.id&&(b2SeriesEnabled()||youtubeIdFor(`b2-series/${m.id}`))))return true;
 if(highSchoolSeriesCatalog.some(m=>m.stageId===stage.id&&youtubeIdFor(`hs-series/${m.id}`)))return true;
 if(lessonCatalog.some((m:{stageId:string})=>m.stageId===stage.id))return true;
 const count=spiralLessons[stage.id]?.filter(c=>!movedCycles[stage.id]?.[c.id]).reduce((n,c)=>n+c.cards.length,0)??stage.lesson.steps.length;
 const indices=movies.filter(m=>m.stageId===stage.id).flatMap(m=>m.sourceIndices??[]);
 return indices.length===count&&new Set(indices).size===count&&indices.every(i=>i>=0&&i<count);
}
export function EMVideoLesson({stage,alreadyFinished,onComplete,onExit,onReadSlides}:{stage:Stage;alreadyFinished:boolean;onComplete:(firstTime:boolean)=>void;onExit:()=>void;onReadSlides:()=>void}){
 const universitySeries=b2SeriesCatalog.filter(m=>m.stageId===stage.id&&(b2SeriesEnabled()||youtubeIdFor(`b2-series/${m.id}`))).map(m=>({...m,stageTitle:stage.title,mediaDirectory:'b2-series',scenes:[]} as Movie));
 const highSchoolEntries=highSchoolSeriesCatalog.filter(m=>m.stageId===stage.id);
 const isHighSchoolStage=highSchoolEntries.length>0;
 const deepCount=highSchoolEntries.filter(m=>m.kind==='deep').length;
 const middleCount=Math.floor(deepCount/2);
 const highSchoolSeries=highSchoolEntries.sort((a,b)=>a.kind===b.kind?a.part-b.part:a.kind==='summary'?-1:1).flatMap((m,index):Movie[]=>{
  if(youtubeIdFor(`hs-series/${m.id}`))return [{...m,level:'intro',part:index+1,stageTitle:stage.title,mediaDirectory:'hs-series',scenes:[]} as Movie];
  // YouTube's checks can take longer than the upload. Keep a relevant local
  // lesson in the same slot until this exact new video can be published.
  const fallbackLevel=m.kind==='summary'?'intro':m.part<=middleCount?'middle':'advanced';
  const fallback=movies.find(candidate=>candidate.stageId===stage.id&&candidate.level===fallbackLevel);
  return fallback?[{...fallback,level:'intro',part:index+1}]:[];
 });
 const series=isHighSchoolStage?highSchoolSeries:universitySeries;
 // University levels retain their own hosted/local replacement behavior.
 const all=isHighSchoolStage?highSchoolSeries:[...series,...movies.filter(m=>m.stageId===stage.id&&!series.some(s=>s.level===m.level))];
 const levels=isHighSchoolStage?['intro']:['intro','middle','advanced'].filter(level=>all.some(m=>m.level===level));
 const [level,setLevel]=useState(()=>{try{const saved=localStorage.getItem(`physics-quest:video-level:${stage.id}`);return saved&&levels.includes(saved)?saved:levels[0];}catch{return levels[0];}});
 const [mode,setMode]=useState<VideoMode>(()=>{try{return localStorage.getItem(`physics-quest:video-mode:${stage.id}`)==='thorough'?'thorough':'quick';}catch{return 'quick';}});
 const activeLevel=isHighSchoolStage?'intro':level;
 const selectedSeries=series.filter(m=>m.level===activeLevel);
 const basePlaylist=prerequisitePlaylist(all.filter(m=>m.level===activeLevel),prerequisiteMovies as unknown as Movie[]);
 const detailedPlaylist=thoroughPrerequisitePlaylist(basePlaylist,prerequisiteMovies as unknown as Movie[],'thorough');
 const hasThorough=selectedSeries.length>0?selectedSeries.length>1:detailedPlaylist.length>basePlaylist.length||detailedPlaylist.some(m=>(insertRoutes as Record<string,InsertRoute[]>)[m.id]?.length);
 useEffect(()=>{try{localStorage.setItem(`physics-quest:video-mode:${stage.id}`,mode);}catch{/* Storage is optional. */}},[stage.id,mode]);
 useEffect(()=>{try{localStorage.setItem(`physics-quest:video-level:${stage.id}`,level);}catch{/* Playback does not require storage. */}},[stage.id,level]);
 return <div className="video-lesson-shell">
 {!isHighSchoolStage&&levels.length>1&&<nav className="video-levels" aria-label="動画の難易度">{levels.map(value=><button key={value} type="button" aria-pressed={level===value} onClick={()=>setLevel(value)}>{{intro:'初級',middle:'中級',advanced:'上級'}[value]}</button>)}</nav>}
 <nav className="video-levels" aria-label="学び方">{(['quick','thorough'] as const).map(value=><button key={value} type="button" aria-pressed={mode===value} onClick={()=>setMode(value)}>{value==='quick'?'さっと学ぶ':'とことん学ぶ'}</button>)}</nav>
 {isHighSchoolStage&&<p className="video-mode-pending">さっと学ぶ：要点のみ。とことん学ぶ：要点から深く学ぶ動画まで。</p>}
 {!isHighSchoolStage&&selectedSeries.length>1&&<p className="video-mode-pending">さっと学ぶ：この難易度の最初の1本。とことん学ぶ：{selectedSeries.length}本を順番に見ます。</p>}
 {mode==='thorough'&&!hasThorough&&selectedSeries.length===0&&<p className="video-mode-pending">この単元の補足動画は準備中です。現在は共通の本編を再生します。</p>}
 <VideoPlayer key={`${stage.id}:${activeLevel}${isHighSchoolStage?`:${mode}`:''}`} stage={stage} alreadyFinished={alreadyFinished} onComplete={onComplete} onExit={onExit} onReadSlides={onReadSlides} original={all.filter(m=>m.level===activeLevel&&(selectedSeries.length===0||mode==='thorough'||m.part===1))} level={activeLevel} mode={mode} simplePlaylist={isHighSchoolStage}/>
 </div>;
}
function VideoPlayer({stage,alreadyFinished,onComplete,onExit,onReadSlides,original,level,mode,simplePlaylist}:{stage:Stage;alreadyFinished:boolean;onComplete:(firstTime:boolean)=>void;onExit:()=>void;onReadSlides:()=>void;original:Movie[];level:string;mode:VideoMode;simplePlaylist:boolean}){
 // The unit's assigned videos do not depend on completion in other units.
 const assigned=simplePlaylist?original:prerequisitePlaylist(original,prerequisiteMovies as unknown as Movie[]);
 const activeAssigned=simplePlaylist?assigned:thoroughPrerequisitePlaylist(assigned,prerequisiteMovies as unknown as Movie[],mode);
 const list=simplePlaylist?activeAssigned.map(m=>({id:m.id,parentId:m.id,title:m.title,media:m,start:0,end:m.duration})):manualVideoPlaylist(activeAssigned,mode,insertRoutes as Record<string,InsertRoute[]>,insertCatalog as Movie[]);
 const review=simplePlaylist?[]:thoroughPrerequisitePlaylist(prerequisiteReview(original,prerequisiteMovies as unknown as Movie[]),prerequisiteMovies as unknown as Movie[],mode);
 const positionKey=simplePlaylist?`physics-quest:video-position:v4:${stage.id}:${mode}`:`physics-quest:video-position:v3:${stage.id}:${level}`;
 const [selectedId,setSelectedId]=useState(()=>{
  try{
   if(simplePlaylist)return restoredVideoId(localStorage.getItem(positionKey),list,original);
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
 const [retryMedia,setRetryMedia]=useState(0);
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
   <SegmentedLessonVideo key={`${reviewing?movie.id:mode+current.id}:${retryMedia}`} main={movie} start={reviewing?0:current.start} end={reviewing?movie.duration:current.end} onError={()=>setFailed(true)}/>
   {failed&&<div className="em-movie-error" role="alert"><p>動画を読み込めませんでした。通信状態を確かめるか、文字とスライドで学んでください。</p><button className="btn btn-ghost" onClick={()=>{setFailed(false);setRetryMedia(value=>value+1);}}>動画を再読み込み</button><button className="btn btn-ghost" onClick={onReadSlides}>文字とスライドで読む</button></div>}
  </section>
  {reviewing?<button className="btn btn-ghost" onClick={()=>setReviewId(null)}>学習に戻る</button>:<>
   {movie.id.startsWith('prep-')&&<button className="btn btn-ghost" onClick={()=>selectPage(list.findIndex((m,i)=>i>page&&!m.id.startsWith('prep-')))}>本編へ</button>}
   {list.length>1&&<div className="lesson-controls em-movie-controls"><button className="btn btn-ghost" disabled={page===0} onClick={()=>selectPage(page-1)}>← 前へ</button><nav className="lesson-dots" aria-label="動画を選ぶ">{list.map((m,i)=><button key={m.id} className={`lesson-dot ${i===page?'active':''}`} aria-label={`動画${i+1}: ${m.title}`} aria-current={page===i?'step':undefined} onClick={()=>selectPage(i)}><span/></button>)}</nav><button className="btn btn-primary" disabled={page===list.length-1} onClick={()=>selectPage(page+1)}>次へ →</button></div>}
  </>}
  {review.length>0&&<details className="em-movie-review"><summary>必要なときだけ復習</summary><div>{review.map(m=><button type="button" key={m.id} className="btn btn-ghost" aria-pressed={reviewId===m.id} onClick={()=>setReviewId(m.id)}>{m.title}</button>)}</div></details>}
  <button className="btn btn-battle em-movie-battle" onClick={()=>onComplete(!alreadyFinished)}>⚔️ {stage.enemy.name}に挑む</button>
 </div>;
}

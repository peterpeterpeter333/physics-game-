import {useEffect,useMemo,useRef,useState} from 'react';
import {claimNarration} from '../game/narration';
import {resumeSegment,videoSegments,type InsertRoute,type TimedMovie,type VideoMode} from '../game/video-inserts';
type Media=TimedMovie&{title:string;mediaDirectory?:string;renderKey?:string};
export function SegmentedLessonVideo({main,mode,routes,inserts,onError,onMainTime}:{main:Media;mode:VideoMode;routes:InsertRoute[];inserts:Media[];onError:()=>void;onMainTime:(time:number)=>void}){
 const [cursor,setCursor]=useState({index:0,time:0,playing:false,generation:0,mode});
 const segments=useMemo(()=>videoSegments(main,cursor.mode,routes,inserts),[main,cursor.mode,routes,inserts]);
 const player=useRef<HTMLVideoElement>(null),release=useRef<()=>void>();
 const mainClock=useRef(0),wasPlaying=useRef(false),transitioning=useRef(false);
 const mainStarted=useRef(false);
 const segment=segments[Math.min(cursor.index,segments.length-1)];
 const media=segment.insert?inserts.find(m=>m.id===segment.movieId)!:main;
 const base=`${import.meta.env.BASE_URL}media/${media.mediaDirectory??'em'}/${media.id}`;
 const revision=media.renderKey?`?v=${media.renderKey.slice(0,16)}`:'';
 useEffect(()=>()=>release.current?.(),[]);
 useEffect(()=>{
  if(cursor.mode===mode)return;
  mainClock.current=segment.insert?segment.mainTime:(player.current?.currentTime??mainClock.current);
  const nextSegments=videoSegments(main,mode,routes,inserts);transitioning.current=true;
  // WebKit may report a tiny positive seek position for the first decoded frame.
  const index=!mainStarted.current||mainClock.current<0.1?0:resumeSegment(nextSegments,mainClock.current);
  setCursor(c=>({index,time:nextSegments[index].insert?0:mainClock.current,playing:wasPlaying.current,generation:c.generation+1,mode}));
 },[mode,cursor.mode,main,routes,inserts]);
 function advance(){
  if(transitioning.current||cursor.index>=segments.length-1)return;
  transitioning.current=true;const next=segments[cursor.index+1];
  mainClock.current=next.mainTime;
  setCursor(c=>({...c,index:c.index+1,time:next.start,playing:wasPlaying.current,generation:c.generation+1}));
 }
 return <>
  {segment.insert&&<p className="em-movie-insert-label">とことん学ぶ：{media.title}</p>}
  <video key={`${segment.key}:${cursor.generation}`} data-learning-mode={cursor.mode} data-main-time={mainClock.current} data-segment-index={cursor.index} ref={player} controls playsInline preload="metadata" poster={`${base}.jpg${revision}`} aria-label={`${media.title}の音声・字幕付き動画`}
   onError={onError}
   onLoadedMetadata={()=>{const video=player.current;if(!video)return;video.currentTime=Math.max(segment.start,Math.min(cursor.time,segment.end));transitioning.current=false;if(cursor.playing)void video.play().catch(()=>{wasPlaying.current=false;});}}
   onPlay={()=>{wasPlaying.current=true;if(!segment.insert)mainStarted.current=true;release.current?.();release.current=claimNarration(()=>player.current?.pause());}}
   onSeeking={event=>{if(!segment.insert&&!transitioning.current&&event.currentTarget.currentTime>.1)mainStarted.current=true;}}
   onPause={()=>{if(!transitioning.current&&player.current&&!player.current.ended)wasPlaying.current=false;}}
   onTimeUpdate={event=>{const video=event.currentTarget;if(video!==player.current||transitioning.current)return;if(!segment.insert){mainClock.current=Math.min(video.currentTime,segment.end);onMainTime(mainClock.current);}if(video.currentTime>=segment.end)advance();}}
   onEnded={advance}>
   <source src={`${base}.mp4${revision}`} type="video/mp4" onError={onError}/>
  </video>
 </>;
}

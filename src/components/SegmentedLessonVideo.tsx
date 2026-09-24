import {useEffect,useRef,useState} from 'react';
import {claimNarration} from '../game/narration';
import {VideoPlaybackSpeed} from './VideoPlaybackSpeed';
import type {TimedMovie} from '../game/video-inserts';
type Media=TimedMovie&{title:string;mediaDirectory?:string;renderKey?:string};
const clock=(s:number)=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
/** One user-selected page. Playback events can never select another video. */
export function SegmentedLessonVideo({main,start=0,end=main.duration,onError}:{main:Media;start?:number;end?:number;onError:()=>void}){
 const player=useRef<HTMLVideoElement>(null),release=useRef<()=>void>();
 const [playing,setPlaying]=useState(false),[time,setTime]=useState(start);
 const [ready,setReady]=useState(false);
 const clipped=start>0||end<main.duration;
 const base=`${import.meta.env.BASE_URL}media/${main.mediaDirectory??'em'}/${main.id}`;
 const revision=main.renderKey?`?v=${main.renderKey.slice(0,16)}`:'';
 useEffect(()=>()=>release.current?.(),[]);
 useEffect(()=>{
  const video=player.current;if(!video||!clipped)return;
  let frame=0;
  const check=()=>{if(!video.paused&&video.currentTime>=end){video.pause();}frame=requestAnimationFrame(check);};
  frame=requestAnimationFrame(check);return()=>cancelAnimationFrame(frame);
 },[start,end,clipped]);
 return <>
  <video src={`${base}.mp4${revision}`} ref={player} controls={!clipped} playsInline preload="metadata" poster={start===0?`${base}.jpg${revision}`:undefined} aria-label={`${main.title}の音声・字幕付き動画`}
   onError={onError}
   onLoadedMetadata={event=>{event.currentTarget.currentTime=start;setTime(start);setReady(true);}}
   onPlay={()=>{setPlaying(true);release.current?.();release.current=claimNarration(()=>player.current?.pause());}}
   onPause={()=>setPlaying(false)}
   onSeeking={event=>{const v=event.currentTarget;if(clipped&&(v.currentTime<start-.05||v.currentTime>end+.05))v.currentTime=Math.max(start,Math.min(end,v.currentTime));}}
   onTimeUpdate={event=>{const v=event.currentTarget;setTime(Math.max(start,Math.min(end,v.currentTime)));if(clipped&&v.currentTime>=end)v.pause();}}
   onEnded={()=>setPlaying(false)}/>
  {clipped&&<div className="video-clip-controls">
   <button type="button" className="btn btn-ghost" disabled={!ready} onClick={()=>{const v=player.current;if(!v)return;if(!v.paused){v.pause();return;}if(v.currentTime>=end-.05)v.currentTime=start;void v.play().catch(onError);}}>{playing?'一時停止':time>=end-.05?'もう一度再生':'再生'}</button>
   <input type="range" aria-label="この動画の再生位置" min={0} max={end-start} step={.01} value={time-start} disabled={!ready} onChange={event=>{const v=player.current;if(v){v.currentTime=start+Number(event.target.value);setTime(v.currentTime);}}}/>
   <span>{clock(time-start)} / {clock(end-start)}</span>
  </div>}
  <VideoPlaybackSpeed player={player} mediaKey={base+revision}/>
 </>;
}

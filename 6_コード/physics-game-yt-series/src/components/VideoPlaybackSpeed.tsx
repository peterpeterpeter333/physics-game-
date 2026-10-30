import {useEffect,useState,type RefObject} from 'react';
import './video-playback-speed.css';
import {VIDEO_RATES,VIDEO_RATE_KEY,applyVideoRate,savedVideoRate} from '../game/video-playback';
export function VideoPlaybackSpeed({player,mediaKey}:{player:RefObject<HTMLVideoElement>;mediaKey:string}){
 const [rate,setRate]=useState(()=>{try{return savedVideoRate(localStorage);}catch{return 0.9;}});
 useEffect(()=>{
  const video=player.current;if(!video)return;
  const apply=()=>applyVideoRate(video,rate);
  const changed=()=>{if(video.readyState>0&&VIDEO_RATES.includes(video.playbackRate))setRate(video.playbackRate);};
  apply();video.addEventListener('loadedmetadata',apply);video.addEventListener('ratechange',changed);
  try{localStorage.setItem(VIDEO_RATE_KEY,String(rate));}catch{/* Playback works without storage. */}
  return()=>{video.removeEventListener('loadedmetadata',apply);video.removeEventListener('ratechange',changed);};
 },[player,mediaKey,rate]);
 return <label className="video-playback-speed">再生速度 <select aria-label="動画と音声の再生速度" value={rate} onChange={e=>setRate(Number(e.target.value))}>{VIDEO_RATES.map(n=><option key={n} value={n}>{n}倍{n===0.9?'（標準）':''}</option>)}</select></label>;
}

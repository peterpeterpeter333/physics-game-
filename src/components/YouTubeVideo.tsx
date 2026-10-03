import {forwardRef,useEffect,useImperativeHandle,useRef,useState} from 'react';
import {claimNarration} from '../game/narration';
import {VIDEO_RATE_KEY,savedVideoRate} from '../game/video-playback';
import './youtube-video.css';

type YouTubePlayer = {
  destroy():void;
  pauseVideo():void;
  seekTo(seconds:number,allowSeekAhead:boolean):void;
  getCurrentTime():number;
  getAvailablePlaybackRates():number[];
  getPlaybackRate():number;
  setPlaybackRate(rate:number):void;
};
type PlayerEvent={target:YouTubePlayer;data:number};
type YouTubeApi={Player:new (element:HTMLElement,options:{videoId:string;width:string;height:string;playerVars:Record<string,number|string>;events:{onReady:(event:PlayerEvent)=>void;onStateChange:(event:PlayerEvent)=>void;onPlaybackRateChange:(event:PlayerEvent)=>void;onError:(event:PlayerEvent)=>void}})=>YouTubePlayer};
declare global {interface Window {YT?:YouTubeApi;onYouTubeIframeAPIReady?:()=>void}}

let apiPromise:Promise<YouTubeApi>|undefined;
function loadApi():Promise<YouTubeApi>{
 if(window.YT?.Player)return Promise.resolve(window.YT);
 if(apiPromise)return apiPromise;
 const pending=new Promise<YouTubeApi>((resolve,reject)=>{
  const previous=window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady=()=>{previous?.();if(window.YT?.Player)resolve(window.YT);else reject(new Error('YouTube API unavailable'));};
  const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.async=true;
  script.onerror=()=>reject(new Error('YouTube API could not load'));
  document.head.append(script);
 }).catch(error=>{apiPromise=undefined;throw error;});
 apiPromise=pending;
 return pending;
}

export type YouTubeVideoHandle={pause:()=>void};
export const YouTubeVideo=forwardRef<YouTubeVideoHandle,{youtubeId:string;mediaId:string;title:string;start:number;end:number;onError:()=>void}>(function YouTubeVideo({youtubeId,mediaId,title,start,end,onError},ref){
 const slot=useRef<HTMLDivElement>(null),player=useRef<YouTubePlayer|null>(null),release=useRef<()=>void>();
 const onErrorRef=useRef(onError);
 onErrorRef.current=onError;
 const [available,setAvailable]=useState<number[]>([1]),[rate,setRate]=useState(1),[ready,setReady]=useState(false);
 useImperativeHandle(ref,()=>({pause:()=>player.current?.pauseVideo()}),[]);
 useEffect(()=>{
  let live=true,timer=0;
  const element=slot.current;
  if(!element)return;
  loadApi().then(YT=>{
   if(!live)return;
   const saved=readPosition(mediaId,start,end);
   player.current=new YT.Player(element,{videoId:youtubeId,width:'100%',height:'100%',playerVars:{controls:1,playsinline:1,autoplay:0,start:Math.floor(saved),end:Math.ceil(end),origin:window.location.origin,rel:0},events:{
    onReady:event=>{
     if(!live)return;
     setReady(true);
     const rates=event.target.getAvailablePlaybackRates();setAvailable(rates.length?rates:[1]);
     // YouTube may not offer 0.9x. The actual rate is displayed, never mislabelled.
     const wanted=savedRate();if(rates.includes(wanted))event.target.setPlaybackRate(wanted);
     setRate(event.target.getPlaybackRate());
    },
    onStateChange:event=>{
     if(!live)return;
     if(event.data===1){release.current?.();release.current=claimNarration(()=>event.target.pauseVideo());}
     if(event.data===2||event.data===0){savePosition(mediaId,event.target.getCurrentTime(),start,end);release.current?.();release.current=undefined;}
    },
    onPlaybackRateChange:event=>{if(live)setRate(event.target.getPlaybackRate());},
    onError:()=>{if(live)onErrorRef.current();},
   }});
   timer=window.setInterval(()=>{
    const p=player.current;if(!p)return;
    const t=p.getCurrentTime();
    if(t>0&&t<start-.25)p.seekTo(start,false);
    if(t>=end-.15){p.pauseVideo();savePosition(mediaId,end,start,end);}
    else if(t>=start)savePosition(mediaId,t,start,end);
   },1000);
  }).catch(()=>{if(live)onErrorRef.current();});
  return()=>{live=false;window.clearInterval(timer);release.current?.();release.current=undefined;player.current?.destroy();player.current=null;};
 },[youtubeId,mediaId,start,end]);
 const changeRate=(next:number)=>{
  if(!available.includes(next))return;
  player.current?.setPlaybackRate(next);
  setRate(player.current?.getPlaybackRate()??next);
  try{localStorage.setItem(VIDEO_RATE_KEY,String(next));}catch{/* Optional storage. */}
 };
 return <div className="youtube-video">
  <div className="youtube-video-frame" ref={slot} aria-label={`${title}のYouTube動画`}/>
  <div className="youtube-video-meta"><span>オンライン再生 · 通信が必要です</span>{ready&&<label>再生速度 <select aria-label="YouTube動画の再生速度" value={rate} onChange={event=>changeRate(Number(event.target.value))}>{available.map(value=><option key={value} value={value}>{value}倍</option>)}</select></label>}</div>
  {ready&&!available.includes(0.9)&&<p className="youtube-video-rate-note">YouTubeはこの動画の0.9倍速に対応していません。動画と音声が同期する速度を表示しています。</p>}
 </div>;
});

function savedRate(){try{return savedVideoRate(localStorage);}catch{return .9;}}
function positionKey(id:string){return `physics-quest:youtube-position:v1:${id}`;}
function readPosition(id:string,start:number,end:number){
 try{const saved=Number(localStorage.getItem(positionKey(id)));return Number.isFinite(saved)&&saved>=start&&saved<end-2?saved:start;}catch{return start;}
}
function savePosition(id:string,time:number,start:number,end:number){
 try{localStorage.setItem(positionKey(id),String(time>=end-1?start:Math.max(start,time)));}catch{/* Optional storage. */}
}

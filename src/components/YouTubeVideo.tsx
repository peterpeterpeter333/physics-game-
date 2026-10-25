import {forwardRef,useEffect,useImperativeHandle,useRef,useState,useSyncExternalStore} from 'react';
import {Capacitor} from '@capacitor/core';
import {claimNarration} from '../game/narration';
import {VIDEO_RATE_KEY,savedVideoRate} from '../game/video-playback';
import {hasYouTubeConsent,setYouTubeConsent,subscribeYouTubeConsent} from '../game/youtube-consent';
import './youtube-video.css';

export type YouTubeVideoHandle={pause:()=>void};
type Props={youtubeId:string;mediaId:string;title:string;start:number;end:number;onError:()=>void};
const publicPlayer='https://peterpeterpeter333.github.io/physics-game-/youtube-player.html';

/** Real HTTPS document supplies the Referer in Capacitor/WKWebView.
 * Google is not contacted before the user's device-level loading consent.
 * Messages are scoped to the frame, exact origin and per-mount channel.
 */
export const YouTubeVideo=forwardRef<YouTubeVideoHandle,Props>(function YouTubeVideo({youtubeId,mediaId,title,start,end,onError},ref){
 const loaded=useSyncExternalStore(subscribeYouTubeConsent,hasYouTubeConsent,()=>false);
 return <div className="youtube-video">
  {loaded?<YouTubeVideoSession key={`${youtubeId}:${mediaId}:${start}:${end}`} ref={ref} youtubeId={youtubeId} mediaId={mediaId} title={title} start={start} end={end} onError={onError}/>:
   <div className="youtube-video-consent">
    <p>動画を読み込むと、再生・広告表示などのため、IPアドレス・端末情報・視聴操作の情報がGoogle／YouTubeへ送信されます。</p>
    <p>プライバシー強化モードで再生します。広告や通信料金が発生する場合があります。</p>
    <p><a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Googleのプライバシーポリシー</a> · <a href="https://www.youtube.com/t/terms" target="_blank" rel="noreferrer">YouTubeの利用規約</a></p>
    <p>同意はこの端末に保存し、次の動画では確認を省きます。設定からいつでも解除できます。端末への保存が使えない場合は、アプリを開いている間だけ保持します。</p>
    <button type="button" className="btn btn-primary" onClick={()=>setYouTubeConsent(true)}>同意して動画を読み込む</button>
   </div>}
 </div>;
});

// A new video or segment gets its own iframe/channel; position updates and
// consent changes never accidentally reuse a different lesson's player.
const YouTubeVideoSession=forwardRef<YouTubeVideoHandle,Props>(function YouTubeVideoSession({youtubeId,mediaId,title,start,end,onError},ref){
 const frame=useRef<HTMLIFrameElement>(null),release=useRef<()=>void>();
 const errorRef=useRef(onError);errorRef.current=onError;
 const [initialPosition]=useState(()=>readPosition(mediaId,start,end));
 const [ready,setReady]=useState(false),[time,setTime]=useState(initialPosition),[limit,setLimit]=useState(end);
 const [available,setAvailable]=useState<number[]>([1]),[rate,setRate]=useState(1);
 const [channel]=useState(()=>Array.from(crypto.getRandomValues(new Uint8Array(16)),n=>n.toString(16).padStart(2,'0')).join(''));
 const base=Capacitor.isNativePlatform()?publicPlayer:new URL(`${import.meta.env.BASE_URL}youtube-player.html`,window.location.href).href;
 const url=new URL(base);
 url.search=new URLSearchParams({v:youtubeId,start:String(initialPosition),segmentStart:String(start),end:String(end),rate:String(savedRate()),channel,revision:'20261025-1'}).toString();
 const origin=url.origin;
 // Do not recreate the iframe as playback updates the saved position.
 const source=useRef(url.href);
 const command=(type:string,value?:number)=>frame.current?.contentWindow?.postMessage({app:'physics-quest-player',channel,type,value},origin);
 useImperativeHandle(ref,()=>({pause:()=>command('pause')}));
 useEffect(()=>{
  const receive=(event:MessageEvent)=>{
   if(event.source!==frame.current?.contentWindow||event.origin!==origin)return;
   const data=event.data;
   if(!data||data.app!=='physics-quest-player'||data.channel!==channel)return;
   if(data.type==='ready'){
    const rates=Array.isArray(data.rates)?data.rates.filter((n:unknown)=>typeof n==='number'&&Number.isFinite(n)&&n>0&&n<=4):[];
    setAvailable(rates.length?rates:[1]);setReady(true);
   }
   if(typeof data.rate==='number'&&Number.isFinite(data.rate)&&data.rate>0&&data.rate<=4)setRate(data.rate);
   const effectiveEnd=typeof data.end==='number'&&Number.isFinite(data.end)&&data.end>start?Math.min(end,data.end):end;
   setLimit(effectiveEnd);
   // API startup/buffering messages are not a new saved position. In
   // particular getCurrentTime() may still be zero before a resumed video loads.
   if(typeof data.time==='number'&&Number.isFinite(data.time)&&(data.state===1||data.state===2||data.type==='seeked'||data.type==='ended')){
    setTime(Math.max(start,Math.min(effectiveEnd,data.time)));
    savePosition(mediaId,data.time,start,effectiveEnd);
   }
   if(data.type==='playing'){release.current?.();release.current=claimNarration(()=>command('pause'));}
   if(data.type==='paused'||data.type==='ended'){release.current?.();release.current=undefined;}
   if(data.type==='error')errorRef.current();
  };
  window.addEventListener('message',receive);
  return()=>{window.removeEventListener('message',receive);release.current?.();release.current=undefined;};
 },[channel,origin,mediaId,start,end]);
 const changeRate=(next:number)=>{
  if(!available.includes(next))return;
  command('rate',next);
  try{localStorage.setItem(VIDEO_RATE_KEY,String(next));}catch{/* Optional storage. */}
 };
 return <>
  <iframe ref={frame} className="youtube-video-frame" src={source.current} title={`${title}のYouTube動画`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" onError={()=>errorRef.current()}/>
  <div className="youtube-video-seek" role="group" aria-label="動画の再生位置">
   <button type="button" className="btn btn-ghost" disabled={!ready||time<=start} onClick={()=>command('seekBy',-5)}>5秒戻る</button>
   <button type="button" className="btn btn-ghost" disabled={!ready||time>=limit-1/30} onClick={()=>command('seekBy',5)}>5秒進む</button>
   <button type="button" className="btn btn-ghost" disabled={!ready} onClick={()=>command('replay')}>最初から</button>
  </div>
  <div className="youtube-video-meta"><span>オンライン再生 · 通信が必要です</span>{ready&&<label>再生速度 <select aria-label="YouTube動画の再生速度" value={rate} onChange={event=>changeRate(Number(event.target.value))}>{available.map(value=><option key={value} value={value}>{value}倍</option>)}</select></label>}</div>
  {ready&&!available.includes(0.9)&&<p className="youtube-video-rate-note">YouTubeはこの動画の0.9倍速に対応していません。動画と音声が同期する速度を表示しています。</p>}
 </>;
});

function savedRate(){try{return savedVideoRate(localStorage);}catch{return .9;}}
function positionKey(id:string){return `physics-quest:youtube-position:v1:${id}`;}
function readPosition(id:string,start:number,end:number){
 try{const saved=Number(localStorage.getItem(positionKey(id)));return Number.isFinite(saved)&&saved>=start&&saved<end-2?saved:start;}catch{return start;}
}
function savePosition(id:string,time:number,start:number,end:number){
 try{localStorage.setItem(positionKey(id),String(time>=end-1?start:Math.max(start,time)));}catch{/* Optional storage. */}
}

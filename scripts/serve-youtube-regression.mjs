// Local, no-Google React integration fixture. Uses the real player bridge with
// a deterministic YT API substitute; this is not a live YouTube playback test.
import {createServer} from 'node:http';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
const live=process.argv.includes('--live');
const entry=`import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {YouTubeVideo} from './src/components/YouTubeVideo';
import {SettingsView} from './src/components/SettingsView';
function Fixture(){
 const [id,setId]=useState('first'),[start,setStart]=useState(10),[message,setMessage]=useState('未読み込み');
 useEffect(()=>{const listener=e=>{if(e.data?.app==='physics-quest-player')setMessage(JSON.stringify(e.data));};window.addEventListener('message',listener);return()=>window.removeEventListener('message',listener);},[]);
 return <><h1>YouTubeプレーヤー回帰確認</h1><p>{${JSON.stringify(live?'実際のYouTube APIへの接続確認です。同意後にGoogleへ通信します。':'外部通信のない模擬APIです。実際のYouTube・iPhoneの再生試験ではありません。')}}</p>
 <button onClick={()=>{localStorage.setItem('physics-quest:youtube-position:v1:'+id,'60');setId(id==='first'?'second':'first');}}>別の動画へ</button>
 <button onClick={()=>setStart(start===10?20:10)}>区間を切り替える</button>
 <p>現在の動画: {id} / 区間の先頭: {start}秒</p>
 <YouTubeVideo youtubeId={id==='first'?'qW8fh2y4vXE':'58BBxImCvHA'} mediaId={id} title={'確認動画 '+id} start={start} end={100} onError={()=>setMessage('ERROR')}/>
 <output aria-label="プレーヤー通知">{message}</output><SettingsView onResetProgress={()=>{}}/></>;
}
if(localStorage.getItem('physics-quest:youtube-position:v1:first')===null)localStorage.setItem('physics-quest:youtube-position:v1:first','60');
createRoot(document.getElementById('root')).render(<React.StrictMode><Fixture/></React.StrictMode>);`;
const bundle=await build({stdin:{contents:entry,loader:'tsx',resolveDir:process.cwd()},bundle:true,write:false,outfile:'/private/tmp/youtube-regression-fixture.js',jsx:'automatic',define:{'import.meta.env.BASE_URL':'"/"','process.env.NODE_ENV':'"development"'}});
const js=bundle.outputFiles.find(f=>f.path.endsWith('.js')).text,css=bundle.outputFiles.find(f=>f.path.endsWith('.css'))?.text??'';
const actualWrapper=readFileSync('public/youtube-player.html','utf8');
const wrapper=live?actualWrapper:actualWrapper
 .replace('https://www.youtube.com/iframe_api','/mock-youtube-api.js')
 .replace('https://www.youtube-nocookie.com/embed/','/mock-embed/');
const mock=`window.YT={Player:function(el,options){
 let time=Number(new URL(el.src).searchParams.get('start')),rate=1,state=2;
 const paint=()=>el.contentWindow?.postMessage({mockTime:time,state},location.origin);
 const notify=()=>{paint();options.events.onStateChange({data:state});};
 const api={getCurrentTime:()=>time,getDuration:()=>100,getPlayerState:()=>state,getPlaybackRate:()=>rate,getAvailablePlaybackRates:()=>[.5,1,1.5,2],
  setPlaybackRate:r=>{rate=r;options.events.onPlaybackRateChange();},seekTo:t=>setTimeout(()=>{time=t;paint();},40),
  pauseVideo:()=>{state=2;notify();},playVideo:()=>{state=1;notify();}};
 setTimeout(()=>{options.events.onReady({target:api});paint();},80);
 return api;
}};window.onYouTubeIframeAPIReady();`;
const server=createServer((req,res)=>{
 const p=new URL(req.url,'http://localhost').pathname;
 const reply=(type,body)=>{res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store'});res.end(body);};
 if(p==='/')return reply('text/html; charset=utf-8',`<!doctype html><html lang="ja"><meta name="viewport" content="width=device-width"><title>動画プレーヤー回帰確認</title><style>body{background:#0b1122;color:#edf4ff;font:16px sans-serif;max-width:720px;margin:auto;padding:16px}button{font:inherit;padding:10px;margin:4px}a{color:#8ae4ff}output{display:block;font-size:13px;overflow-wrap:anywhere}.settings-section{border-top:1px solid #52617c;margin-top:20px}${css}</style><div id="root"></div><script src="/fixture.js"></script></html>`);
 if(p==='/fixture.js')return reply('text/javascript; charset=utf-8',js);
 if(p==='/youtube-player.html')return reply('text/html; charset=utf-8',wrapper);
 if(p==='/mock-youtube-api.js')return reply('text/javascript; charset=utf-8',mock);
 if(p.startsWith('/mock-embed/'))return reply('text/html; charset=utf-8',`<html lang="ja"><style>body{background:#17263d;color:white;font:24px sans-serif;display:grid;place-content:center;text-align:center;height:90vh}p{margin:10px}</style><p>模擬YouTube API</p><p id="time">読込中</p><p id="state"></p><script>addEventListener('message',e=>{if(e.source===parent&&e.data.mockTime!==undefined){document.getElementById('time').textContent=e.data.mockTime.toFixed(2)+' 秒';document.getElementById('state').textContent=e.data.state===1?'再生中':'一時停止';}});</script></html>`);
 res.writeHead(404);res.end();
});
server.listen(0,'127.0.0.1',()=>console.log('Fixture: http://127.0.0.1:'+server.address().port));
process.on('SIGINT',()=>server.close(()=>process.exit(0)));

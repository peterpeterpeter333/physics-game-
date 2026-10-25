import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const html=readFileSync('public/youtube-player.html','utf8');
const source=html.match(/<script>([\s\S]*?)<\/script>/)[1];
function setup(search='?v=qW8fh2y4vXE&start=10&end=20&rate=0.5&channel=test'){
 const events={},sent=[],elements=[],parent={postMessage:m=>sent.push(m)};
 let player,interval;
 const error={hidden:true},slot={replaceWith:e=>elements.push(e)};
 const context={URLSearchParams,location:{search,origin:'https://peterpeterpeter333.github.io'},parent,
  document:{getElementById:id=>id==='error'?error:slot,createElement:tag=>({tag}),head:{append:e=>elements.push(e)}},
  window:{addEventListener:(name,fn)=>events[name]=fn},setInterval:fn=>(interval=fn,1),clearInterval:()=>{},
  YT:{Player:function(el,options){player={time:10,rate:1,state:1,pauses:0,seekTo:t=>player.time=t,pauseVideo:()=>{player.pauses++;player.state=2;},playVideo:()=>{player.state=1;},getPlayerState:()=>player.state,getDuration:()=>120,getCurrentTime:()=>player.time,getPlaybackRate:()=>player.rate,getAvailablePlaybackRates:()=>[.5,1,1.5],setPlaybackRate:r=>player.rate=r,options,el};return player;}}};
 vm.runInNewContext(source,context);
 return {context,events,sent,elements,error,get player(){return player},tick:()=>interval()};
}
const h=setup();
assert.equal(h.elements.length,1);assert.equal(h.elements[0].src,'https://www.youtube.com/iframe_api');
h.context.window.onYouTubeIframeAPIReady();
assert.match(h.player.el.src,/^https:\/\/www\.youtube-nocookie\.com\/embed\/qW8fh2y4vXE\?/);
assert.equal(new URL(h.player.el.src).searchParams.get('origin'),'https://peterpeterpeter333.github.io');
assert.equal(new URL(h.player.el.src).searchParams.get('controls'),'1');
assert.equal(new URL(h.player.el.src).searchParams.get('autoplay'),'0');
assert.equal(h.player.el.referrerPolicy,'strict-origin-when-cross-origin');
h.player.options.events.onReady({target:h.player});assert.equal(h.player.rate,.5);
h.events.message({source:{},data:{app:'physics-quest-player',channel:'test',type:'pause'}});assert.equal(h.player.pauses,0);
h.events.message({source:h.context.parent,data:{app:'physics-quest-player',channel:'wrong',type:'pause'}});assert.equal(h.player.pauses,0);
h.events.message({source:h.context.parent,data:{app:'physics-quest-player',channel:'test',type:'rate',value:2}});assert.equal(h.player.rate,.5);
h.player.time=21;h.tick();assert.equal(h.player.pauses,1);
assert.ok(h.sent.every(m=>m.channel==='test'));
h.player.options.events.onError({data:153});assert.equal(h.error.hidden,false);assert.equal(h.sent.at(-1).code,153);
const bad=setup('?v=bad&start=0&end=20&channel=test');assert.equal(bad.error.hidden,false);assert.equal(bad.elements.length,0);
const component=readFileSync('src/components/YouTubeVideo.tsx','utf8');
assert.match(component,/loaded\?<YouTubeVideoSession/);assert.match(component,/event\.source!==frame\.current\?\.contentWindow\|\|event\.origin!==origin/);
assert.match(component,/data\.channel!==channel/);assert.match(component,/Capacitor\.isNativePlatform\(\)\?publicPlayer/);
console.log('PASS: HTTPS Referer document, privacy-enhanced embed, remembered-consent load gate, message source/origin/channel isolation, playback rate and end boundary, invalid-input rejection.');

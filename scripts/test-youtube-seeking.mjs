// Public-behavior VM regression tests; no network, browser, disk writes or YT account.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const html=readFileSync('public/youtube-player.html','utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert(script,'Inline player runtime is present');
const baseQuery='?v=qW8fh2y4vXE&start=60&segmentStart=10&end=100&rate=1&channel=test';
let checks=0;
function test(name,fn){fn();checks++;console.log('PASS:',name);}
function setup({query=baseQuery,state=2,duration=120,ready=true}={}){
 const events=new Map(),sent=[],elements=[],intervals=new Map();
 let now=10000,nextTimer=0,player;
 const parent={postMessage:value=>sent.push(value)},error={hidden:true};
 const slot={replaceWith:element=>elements.push(element)};
 class FakeDate extends Date{static now(){return now;}}
 const context={URLSearchParams,Date:FakeDate,location:{search:query,origin:'https://test.physics.example'},parent,
  document:{getElementById:id=>id==='error'?error:slot,createElement:tag=>({tag}),head:{append:element=>elements.push(element)}},
  window:{addEventListener:(name,fn)=>{const all=events.get(name)??[];all.push(fn);events.set(name,all);}},
  setInterval:(fn,ms)=>{const id=++nextTimer;intervals.set(id,{fn,ms});return id;},clearInterval:id=>intervals.delete(id),
  YT:{Player:function(element,options){
   player={element,options,currentTime:Number(new URL(element.src).searchParams.get('start')),state,duration,rate:1,
    seeks:[],pauses:0,plays:0,getCurrentTime:()=>player.currentTime,getPlayerState:()=>player.state,
    getDuration:()=>player.duration,getPlaybackRate:()=>player.rate,getAvailablePlaybackRates:()=>[.5,1,1.5],
    setPlaybackRate:rate=>{player.rate=rate;},pauseVideo:()=>{player.pauses++;player.state=2;},
    playVideo:()=>{player.plays++;player.state=1;},
    seekTo:(target,allowSeekAhead)=>{
     player.seeks.push({target,allowSeekAhead});
     // The real iframe API is asynchronous: its current-time report can lag.
     // seekTo also starts non-paused states, per the public YouTube contract.
     if(player.state!==2)player.state=1;
    }};
   return player;
  }}};
 vm.runInNewContext(script,context,{filename:'public/youtube-player.html'});
 assert.equal(error.hidden,true,'Fixture query is accepted');
 context.window.onYouTubeIframeAPIReady();
 const initialize=()=>player.options.events.onReady({target:player});
 if(ready)initialize();
 const message=(data,source=parent)=>{
  for(const fn of events.get('message')??[])fn({source,data:{app:'physics-quest-player',channel:'test',...data}});
 };
 const tick=(ms=250)=>{now+=ms;for(const {fn}of [...intervals.values()])fn();};
 const emitState=state=>{player.state=state;player.options.events.onStateChange({data:state});};
 return {player,sent,elements,error,initialize,message,tick,emitState,advance:ms=>{now+=ms;},
  settle:()=>{assert(player.seeks.length);player.currentTime=player.seeks.at(-1).target;tick(0);}};
}
const lastTarget=h=>{assert(h.player.seeks.length,'A public seek request was issued');return h.player.seeks.at(-1).target;};
const close=(actual,expected)=>assert(Math.abs(actual-expected)<1e-8,`${actual} != ${expected}`);

test('resume60 remains initial position, not the segment10 rewind floor',()=>{
 const h=setup({state:1});
 assert.equal(new URL(h.player.element.src).searchParams.get('start'),'60');
 h.player.currentTime=55;h.tick();
 assert.equal(h.player.currentTime,55);assert.equal(h.player.seeks.length,0);
 h.message({type:'seekBy',value:-5});close(lastTarget(h),50);
});
test('ready API startup zero uses resume60 for relative seeks in unstarted/cued states',()=>{
 for(const state of [-1,5])for(const delta of [-5,5]){
  const h=setup({state});h.player.currentTime=0;
  h.message({type:'seekBy',value:delta});close(lastTarget(h),60+delta);
  assert.equal(h.player.state,2,'A pre-playback position button must remain paused');
  assert.equal(h.player.plays,0);
 }
});
test('an actual initial zero is not replaced by another resume fallback',()=>{
 for(const state of [-1,5]){
  const h=setup({query:'?v=qW8fh2y4vXE&start=0&segmentStart=0&end=100&channel=test',state});
  h.player.currentTime=0;h.message({type:'seekBy',value:5});close(lastTarget(h),5);
  assert.equal(h.player.state,2);
 }
});
test('explicit seekTo zero stays zero instead of restoring initial60',()=>{
 const h=setup({query:'?v=qW8fh2y4vXE&start=60&segmentStart=0&end=100&channel=test',state:5});
 h.player.currentTime=0;h.message({type:'seekTo',value:0});close(lastTarget(h),0);
 h.settle();assert.equal(h.player.currentTime,0);
 h.message({type:'seekBy',value:5});close(lastTarget(h),5);assert.equal(h.player.state,2);
});
test('after observed60, a native seek to zero stays zero',()=>{
 const h=setup({query:'?v=qW8fh2y4vXE&start=60&segmentStart=0&end=100&channel=test',state:1});
 h.tick(0); // A genuine current position has been reported before native scrubbing.
 h.player.currentTime=0;h.tick(0);assert.equal(h.player.seeks.length,0);
 h.message({type:'seekBy',value:5});close(lastTarget(h),5);
});
test('legacy start60 without segmentStart permits native rewind to zero',()=>{
 const h=setup({query:'?v=qW8fh2y4vXE&start=60&end=100&channel=test',state:1});
 h.player.currentTime=0;h.tick();assert.equal(h.player.seeks.length,0);
 h.player.currentTime=3;h.message({type:'seekBy',value:-5});close(lastTarget(h),0);
});
test('explicit segmentStart0 is enforced independently of initial60',()=>{
 const h=setup({query:'?v=qW8fh2y4vXE&start=60&segmentStart=0&end=100&channel=test',state:1});
 h.player.currentTime=2;h.message({type:'seekBy',value:-5});close(lastTarget(h),0);
 h.settle();assert.equal(h.player.currentTime,0);
});
test('seekBy accepts numeric +5/-5 only and requests unbuffered targets',()=>{
 for(const value of [5,-5]){
  const h=setup({state:1});h.message({type:'seekBy',value});close(lastTarget(h),60+value);
  assert.equal(h.player.seeks.at(-1).allowSeekAhead,true);
 }
 for(const value of [NaN,Infinity,-Infinity,0,1,-1,10,-10,'5','-5',null,undefined,{},[]]){
  const h=setup();h.message({type:'seekBy',value});assert.equal(h.player.seeks.length,0,String(value));
 }
});
test('relative clicks accumulate before asynchronous currentTime catches up',()=>{
 const h=setup({state:1});h.message({type:'seekBy',value:-5});h.message({type:'seekBy',value:-5});
 assert.equal(h.player.currentTime,60);close(lastTarget(h),50);
 h.message({type:'seekBy',value:5});close(lastTarget(h),55);
 h.settle();h.message({type:'seekBy',value:5});close(lastTarget(h),60);
});
test('an old pending seek cannot override a later observed native position',()=>{
 const h=setup({state:1});h.message({type:'seekBy',value:5});close(lastTarget(h),65);
 h.advance(10000);h.player.currentTime=30;h.tick(0);h.message({type:'seekBy',value:5});close(lastTarget(h),35);
});
test('paused, ended, unstarted and cued seek intent stays non-playing',()=>{
 for(const state of [2,0,-1,5]){
  const h=setup({state});h.message({type:'seekBy',value:-5});close(lastTarget(h),55);
  assert.equal(h.player.state,2,`state${state} must not start playback`);assert.equal(h.player.plays,0);
 }
});
test('playing and buffering seeks do not force a pause',()=>{
 for(const state of [1,3]){
  const h=setup({state});h.message({type:'seekBy',value:-5});close(lastTarget(h),55);
  assert.equal(h.player.pauses,0,`state${state} must retain playing intent`);
 }
});
test('replay seeks true segment start and explicitly plays',()=>{
 for(const state of [2,0,-1]){
  const h=setup({state});h.player.currentTime=99;h.message({type:'replay'});
  close(lastTarget(h),10);assert.equal(h.player.plays,1);assert.equal(h.player.state,1);
 }
 const legacy=setup({query:'?v=qW8fh2y4vXE&start=60&end=100&channel=test'});
 legacy.message({type:'replay'});close(lastTarget(legacy),0);assert.equal(legacy.player.plays,1);
});
test('native seek to zero is clamped to a nonzero true segment start',()=>{
 const h=setup({state:1});h.tick(0); // Observe playback before a deliberate native seek to zero.
 h.player.currentTime=0;h.tick();close(lastTarget(h),10);
 assert.equal(h.player.plays,0,'Boundary correction must not issue another play command');
});
test('lower-bound relative seek clamps without selecting another page',()=>{
 const h=setup({state:1});h.player.currentTime=12;h.message({type:'seekBy',value:-5});close(lastTarget(h),10);
 assert.equal(h.player.pauses,0);assert.equal(h.player.plays,0);
 assert.equal(h.elements.filter(x=>x.tag==='iframe').length,1,'Same video iframe remains mounted');
});
test('native end overshoot holds the last in-segment frame and pauses',()=>{
 const h=setup({state:1});h.player.currentTime=101;h.tick();close(lastTarget(h),100-1/30);
 assert.equal(h.player.state,2);assert(h.player.pauses>0);
});
test('forward5 crossing end immediately holds the final frame and pauses',()=>{
 const h=setup({state:1});h.player.currentTime=98;h.message({type:'seekBy',value:5});close(lastTarget(h),100-1/30);
 assert.equal(h.player.state,2);assert(h.player.pauses>0,'An end-crossing button must not continue playing');
});
test('a legal pre-end native position is not prematurely stopped',()=>{
 const h=setup({state:1});h.player.currentTime=99.9;h.tick();assert.equal(h.player.pauses,0);assert.equal(h.player.seeks.length,0);
});
test('actual YouTube duration bounds a sentinel end',()=>{
 const h=setup({query:'?v=qW8fh2y4vXE&start=0&segmentStart=0&end=999999&channel=test',duration:80,state:2});
 h.player.currentTime=78;h.message({type:'seekBy',value:5});close(lastTarget(h),80-1/30);assert.equal(h.player.state,2);
});
test('messages require parent, application marker and matching channel',()=>{
 const h=setup();
 h.message({type:'seekBy',value:-5},{});h.message({type:'seekBy',value:-5,channel:'other'});
 h.message({type:'seekBy',value:-5,app:'unrelated'});assert.equal(h.player.seeks.length,0);
 h.message({type:'seekBy',value:-5});close(lastTarget(h),55);
 assert(h.sent.every(x=>x.app==='physics-quest-player'&&x.channel==='test'));
});
test('pre-ready commands are ignored, ready commands work',()=>{
 const h=setup({ready:false});h.message({type:'seekBy',value:-5});assert.equal(h.player.seeks.length,0);
 h.initialize();h.message({type:'seekBy',value:-5});close(lastTarget(h),55);
});
test('buffering has its own public state rather than pretending to pause',()=>{
 const h=setup();h.emitState(3);assert.equal(h.sent.at(-1).type,'buffering');
 h.emitState(2);assert.equal(h.sent.at(-1).type,'paused');
 h.emitState(1);assert.equal(h.sent.at(-1).type,'playing');
 h.emitState(0);assert.equal(h.sent.at(-1).type,'ended');
});
test('finite seekTo, when supported, clamps and rejects nonnumeric targets',()=>{
 const h=setup({state:2});h.message({type:'seekTo',value:25});
 if(!h.player.seeks.length){console.log('SKIP optional seekTo: public runtime does not expose it');return;}
 close(lastTarget(h),25);assert.equal(h.player.state,2);
 h.message({type:'seekTo',value:-50});close(lastTarget(h),10);
 h.message({type:'seekTo',value:150});close(lastTarget(h),100-1/30);
 const count=h.player.seeks.length;
 for(const value of [NaN,Infinity,-Infinity,'25',null,undefined])h.message({type:'seekTo',value});
 assert.equal(h.player.seeks.length,count);
});
console.log(`PASS: ${checks} YouTube seeking public-behavior regressions; asynchronous API stub only, not live YouTube/mobile certification.`);

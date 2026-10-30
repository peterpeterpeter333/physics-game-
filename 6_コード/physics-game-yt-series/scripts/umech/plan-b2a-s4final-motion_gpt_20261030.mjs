// Frozen speech-aligned bounded continuity trials, not an alternate screenplay.
import fs from 'node:fs';
import path from 'node:path';
import {loadInputs,CACHE,KEY,FPS} from './desk-b2a-s4final-stage_gpt_20261030.mjs';
import {voiceMap,normKana} from './yt1-chain-00bx-common.mjs';
const inputs=loadInputs(),rows=Object.fromEntries(inputs.rows.map(r=>[r.row,r]));
function word(row,kana){
 const needle=normKana(kana);
 for(const q of inputs.cues.filter(q=>q.row===row)){
  const vm=voiceMap({cue:q,t:0,dur:q.end-q.start}),at=vm.s.indexOf(needle);
  if(at>=0)return q.start+vm.t[at];
 }
 throw Error('No exact frozen word '+row+'/'+kana);
}
const windows=[];
function add(id,a,b,events=[]){
 const fromFrame=Math.max(0,Math.floor(a*FPS)),toFrameExclusive=Math.min(inputs.frames,Math.ceil(b*FPS));
 const critical=new Set([fromFrame,toFrameExclusive-1]);
 for(let j=fromFrame;j<toFrameExclusive;j+=15)critical.add(j);
 for(const at of events){for(let j=Math.floor((at-.1)*FPS);j<=Math.ceil((at+.6)*FPS);j++)if(j>=fromFrame&&j<toFrameExclusive)critical.add(j);}
 windows.push({id,fromFrame,toFrameExclusive,criticalFrames:[...critical].sort((a,b)=>a-b),absoluteSeconds:[fromFrame/FPS,toFrameExclusive/FPS]});
}
add('r01-cloth-kick',0,1.15,[.45]);
const rotate=word(4,'チキュウノキタ')-.30;add('r04-half-turn',rotate-.3,rotate+1.85,[rotate,rotate+1.5]);
add('r10-hands',word(10,'シンチュウ')-.7,word(10,'テツノボー')+1.4);
add('r10-contact-kick',word(10,'フレアワセル')-.3,word(10,'ピクット')+.65,[word(10,'ピクット')]);
add('r11-release-kick',word(11,'ハナスト')-.3,word(11,'マタウゴキマス')+.65,[word(11,'マタウゴキマス')]);
for(const [i,k]of ['アシワウゴク','ピクットシタ'].entries())add('r20-kick-'+i,word(20,k)-.3,word(20,k)+.65,[word(20,k)]);
add('r25-weak-then-strong',word(25,'ヨワクナリマス')-.3,word(25,'ツヨクウゴイタ')+.65,[word(25,'ヨワクナリマス'),word(25,'ツヨクウゴイタ')]);
add('r33-connect-open',word(33,'デンタイノハシニツナグ')-.3,word(33,'ハガヒライタ')+.9,[word(33,'ハガヒライタ')]);
add('r36-nerve-packets',word(36,'チイサナデンキ'),word(36,'チイサナデンキ')+6.2);
add('r39-single-spark',word(39,'パチッ')-.3,word(39,'パチッ')+.8,[word(39,'パチッ')]);
add('r42-paper-replacement',word(42,'カワイタアツガミ')-.4,word(42,'カワイタアツガミ')+3.5);
add('r43-uncover',rows[43].start,rows[43].start+1.15);
add('r43-first-kick',rows[43].start+1,word(43,'ピクットサセタ')+.65,[word(43,'ピクットサセタ')]);
add('r43-final-hand-kick',inputs.duration-2,inputs.duration-.1,[inputs.duration-1.15]);
const result={key:KEY,fps:FPS,windows,totalFrames:windows.reduce((n,w)=>n+w.toFrameExclusive-w.fromFrame,0),scriptVoiceCaptionsBgmUnchanged:true};
const target=path.join(CACHE,'blender/motion-trial-plan.json');
fs.writeFileSync(target,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({target,windows:windows.length,totalFrames:result.totalFrames}));

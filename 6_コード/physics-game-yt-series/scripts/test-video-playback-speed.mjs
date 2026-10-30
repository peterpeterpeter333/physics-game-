import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {readFileSync} from 'node:fs';
const b=await build({entryPoints:['src/game/video-playback.ts'],bundle:true,write:false,platform:'node',format:'esm'});
const {VIDEO_RATES,savedVideoRate,applyVideoRate}=await import('data:text/javascript;base64,'+Buffer.from(b.outputFiles[0].text).toString('base64'));
for(const value of [null,'','NaN','99','-1','broken'])assert.equal(savedVideoRate({getItem:()=>value}),.9);
assert.equal(savedVideoRate({getItem:()=>{throw Error('blocked');}}),.9);
for(const rate of VIDEO_RATES){
 assert.equal(savedVideoRate({getItem:()=>String(rate)}),rate);
 const v={playbackRate:1,defaultPlaybackRate:1,preservesPitch:false,webkitPreservesPitch:false};
 applyVideoRate(v,rate);assert.equal(v.playbackRate,rate);assert.equal(v.defaultPlaybackRate,rate);assert.equal(v.preservesPitch,true);assert.equal(v.webkitPreservesPitch,true);
 v.playbackRate=1;applyVideoRate(v,rate);assert.equal(v.playbackRate,rate,'Restore after metadata/source change');
}
const invalid={};applyVideoRate(invalid,NaN);assert.equal(invalid.playbackRate,.9);
for(const name of ['SegmentedLessonVideo','EMPaperBattle','EMVideoPilot'])assert.match(readFileSync(`src/components/${name}.tsx`,'utf8'),/<VideoPlaybackSpeed player=\{player\} mediaKey=/);
console.log('PASS: default 0.9, seven rates, persistence validation, pitch preservation, metadata restore, all three players');

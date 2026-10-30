// 既存の検査を変えず、C-1の全cue・6時刻の札と語の参照を先に確かめる。
import fs from 'node:fs';
import sharp from 'sharp';
import {overlayC1v1} from './desk-c1v1-overlay.mjs';
const cache=process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-c1v1',base=JSON.parse(fs.readFileSync(cache+'/plan.json'))[0],timed=JSON.parse(fs.readFileSync(cache+'/ys-chain-c1v1.json'));
const clip={...base,duration:timed.duration,scenes:base.scenes.map((s,i)=>({...s,...{start:timed.scenes[i].start,end:timed.scenes[i].end,captions:timed.scenes[i].captions}}))};
let count=0;
for(const scene of clip.scenes)for(let i=0;i<scene.cues.length;i++)for(const ratio of [.03,.20,.40,.60,.80,.97]){
 const cue=scene.cues[i],cap=scene.captions[i],t=cap.start+(cap.end-cap.start)*ratio;
 const body=overlayC1v1({clip,scene,cue,cap,k:i,t,anchor:name=>name.includes('digit.')?[160+Number(name.at(-1))*175,950,1]:[700,900,1]});
 if(/undefined|NaN|Infinity/.test(body))throw Error(cue.diagram+' invalid SVG');
 await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920">${body}</svg>`)).png().toBuffer();count++;
}
console.log(`C-1 overlay: ${count} moments / 53 cues PASS`);

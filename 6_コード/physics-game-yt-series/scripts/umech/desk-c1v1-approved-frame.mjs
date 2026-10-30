// Explicitly approved C-1 row34 exception. Supplied plan, voice, captions,
// shared face renderer and all other scenes/episodes remain untouched.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {vertFrame as axesVertFrame} from './desk-axes-frame.mjs';
export * from './desk-axes-frame.mjs';
const cache=process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-c1v1';
const cue=JSON.parse(fs.readFileSync(cache+'/blender/data.json')).cues.find(c=>c.key==='arm:domino');
assert(cue&&cue.voiceEnd>cue.start+.8+.81&&cue.end>cue.voiceEnd+1);
export const C1_DOMINO_APPROVAL=Object.freeze({key:'cc1v1-arm:domino',cameraMove:.8,fallInterval:.08,fallDuration:.25,firstFall:cue.start+.8,lastFallEnd:cue.start+.8+.08*7+.25,faceStart:cue.voiceEnd,faceEnd:cue.end,faceSeconds:cue.end-cue.voiceEnd,planFaceUnchanged:true});
export function vertFrame(c,s,t){
 if(c.id!=='ys-chain-c1v1'||s.deskFrame!=='c1v1')return axesVertFrame(c,s,t);
 const k=Math.max(0,s.captions.findLastIndex(cap=>cap.start<=t)),q=s.cues[k];
 if(q?.diagram!==C1_DOMINO_APPROVAL.key)return axesVertFrame(c,s,t);
 const cap=s.captions[k];assert(Math.abs(cap.start-cue.start)<1e-8&&Math.abs(cap.end-cue.end)<1e-8);
 assert.deepEqual(q.face,{who:'mio',ex:'kirakira',a:0,b:1});
 const a=(cue.voiceEnd-cap.start)/(cap.end-cap.start);
 const scene={...s,cues:s.cues.map((x,i)=>i===k?{...x,face:{...x.face,a,b:1}}:x)};
 const clip={...c,scenes:c.scenes.map(x=>x===s?scene:x)};
 return axesVertFrame(clip,scene,t);
}

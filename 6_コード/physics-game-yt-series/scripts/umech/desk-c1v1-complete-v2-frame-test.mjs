// Independent unit evidence. No accepted new 3D drawing is implied by this test.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {fileURLToPath} from 'node:url';
const root=process.env.C1_FINAL_CACHE??'/private/tmp/ys/ys-chain-c1v1-camera-semantic-final-r17';process.env.EM_FILM_CACHE=root;
const read=p=>JSON.parse(fs.readFileSync(p)),hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),out=root+'/c1-complete-v2-frame-unit.json';assert(!fs.existsSync(out));
const inputs=Object.fromEntries(['plan.json','ys-chain-c1v1.json','phrase-times.json','ys-chain-c1v1.voice.wav','blender/data.json'].map(f=>[root+'/'+f,hash(root+'/'+f)]));
const {vertFrame:next,C1_FINAL_ACTION_REPAIRS:repair}=await import('./desk-c1v1-complete-frame-v2.mjs'),{vertFrame:old}=await import('./desk-c1v1-final-frame.mjs');
const plan=read(root+'/plan.json')[0],timed=read(root+'/ys-chain-c1v1.json'),clip={...plan,duration:timed.duration,scenes:plan.scenes.map((s,i)=>({...s,...timed.scenes[i],cues:s.cues}))};
old(clip,clip.scenes[0],0);const before=JSON.stringify(clip);const frames=new Set([...Array.from({length:721},(_,i)=>i*15),...Array.from({length:150},(_,i)=>1375+i),...Array.from({length:330},(_,i)=>9210+i)]);let unchanged=0,changed=0;const rows=[];
for(const j of [...frames].sort((a,b)=>a-b)){
 const t=j/30,s=clip.scenes.find(s=>t>=s.start&&t<s.end)??clip.scenes.at(-1),a=old(clip,s,t),b=next(clip,s,t);assert(!/NaN|Infinity|undefined/.test(b));
 const k=Math.max(0,s.captions.findLastIndex(cap=>cap.start<=t)),key=s.cues[k]?.diagram;
 const allowed=key==='cc1v1-hand:ex'||t>=repair.row38.oldPoint-.15&&t<repair.row38.oldPoint+3.3||t>=repair.row38.hudFirstVisible&&t<repair.row38.hudEnd;
 if(!allowed)assert.equal(b,a,'Out-of-scope SVG byte equality '+j);
 if(a===b)unchanged++;else changed++;
 if(t>=repair.row38.oldPoint&&t<repair.row38.point)assert(!b.includes('>人の手 1 − 2 機械</text>'),'No premature human point HUD');
 if(t>=repair.row38.hudFirstVisible+.2&&t<repair.row38.hudEnd-.3)assert(b.includes('>人の手 1 − 2 機械</text>'),'Same final score returns after unchanged face');
 rows.push({frame:j,time:t,changed:a!==b,allowedScope:allowed,row7PartialClip:b.includes('c1write'),pointHud:b.includes('>人の手 1 − 2 機械</text>')});
}
const foreign=[];for(const id of ['ys-chain-b1v1','ys-chain-d1v1','ys-chain-e1v1','ys-chain-1-1v6','ys-chain-1-2v2']){const c={...clip,id};for(const t of [47,308,314]){const s=c.scenes.find(s=>t>=s.start&&t<s.end);assert.equal(next(c,s,t),old(c,s,t));}foreign.push(id);}
assert.equal(JSON.stringify(clip),before);for(const [p,h]of Object.entries(inputs))assert.equal(hash(p),h,p);
fs.writeFileSync(out,JSON.stringify({date:new Date().toISOString(),unitOnly:true,notNew3dOrMp4Acceptance:true,repairs:repair,immutableInputSha256:inputs,originalPlanAndFaceObjectUnchanged:true,foreignIdsByteEqual:foreign,svgByteEqualFrames:unchanged,changedInExplicitScopeFrames:changed,rows,sourceSha256:hash(fileURLToPath(new URL('./desk-c1v1-complete-frame-v2.mjs',import.meta.url)))},null,1));console.log(JSON.stringify({out,unchanged,changed,foreign:foreign.length}));

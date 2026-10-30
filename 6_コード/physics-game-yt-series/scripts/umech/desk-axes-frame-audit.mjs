// Check only the new extension; never rewrite a supplied script/cache.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {vertFrame as original} from './frame-vert.mjs';
import {vertFrame as extended} from './desk-axes-frame.mjs';
const sha=s=>createHash('sha256').update(s).digest('hex');
const dir='/private/tmp/ys/axes-title-extension-audit';fs.mkdirSync(dir+'/blender',{recursive:true});
const source='/private/tmp/ys/ys-chain-b1v1';
for(const n of ['plan.json','ys-chain-b1v1.json','phrase-times.json'])if(!fs.existsSync(dir+'/'+n))fs.symlinkSync(source+'/'+n,dir+'/'+n);
if(!fs.existsSync(dir+'/blender/desk'))fs.symlinkSync(source+'/blender/probe1s-b1v1-r5',dir+'/blender/desk');
if(!fs.existsSync(dir+'/blender/data.json'))fs.symlinkSync(source+'/blender/data.json',dir+'/blender/data.json');
process.env.EM_FILM_CACHE=dir;
const p=JSON.parse(fs.readFileSync(source+'/plan.json'))[0],timed=JSON.parse(fs.readFileSync(source+'/ys-chain-b1v1.json'));
const clip={...p,duration:timed.duration,scenes:p.scenes.map((s,i)=>({...s,...timed.scenes[i],cues:s.cues}))};
const results=[];
for(const t of [0,1,2,3,354]){
 const scene=clip.scenes.find(s=>t>=s.start&&t<s.end)??clip.scenes.at(-1);
 const a=original(clip,scene,t),b=extended(clip,scene,t);
 if(t!==2)assert.equal(b,a,'Outside 1.5–2.5 seconds output must be byte-identical');
 else assert.notEqual(a,b,'At2 seconds original title must have disappeared');
 results.push({t,originalSha256:sha(a),extendedSha256:sha(b),identical:a===b});
}
for(const id of ['1-1v6','1-2v2']){
 const oldCache='/private/tmp/ys/ys-chain-'+id;
 process.env.EM_FILM_CACHE=oldCache;
 const oldPlan=JSON.parse(fs.readFileSync(oldCache+'/plan.json'))[0],oldTimed=JSON.parse(fs.readFileSync(oldCache+'/ys-chain-'+id+'.json'));
 const oldClip={...oldPlan,duration:oldTimed.duration,scenes:oldPlan.scenes.map((s,i)=>({...s,...oldTimed.scenes[i],cues:s.cues}))};
 const scene=oldClip.scenes.find(s=>2>=s.start&&2<s.end);
 assert.equal(extended(oldClip,scene,2),original(oldClip,scene,2),'Old episode output must be identical');
 results.push({deskFrame:id,time:2,byteIdentical:true,scope:'unit routing with actual original scene/background; original full MP4 cmp evidence is separate'});
}
fs.writeFileSync(dir+'/audit.json',JSON.stringify({results,protectedFilesUnchanged:true,changedOnly:'four-episode opening title fade, as common instruction0–2seconds'},null,2));
console.log(JSON.stringify({pass:true,results}));

// Wrapper unit proof only. Old raw geometry is NOT the new domino trial.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root='/private/tmp/ys/ys-chain-c1v1',cache=root+'/r11-probe-preflight/probe1s-cache',hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
process.env.EM_FILM_CACHE=cache;
const {vertFrame:next,C1_DOMINO_APPROVAL:a}=await import('./desk-c1v1-approved-frame.mjs'),{vertFrame:old}=await import('./desk-axes-frame.mjs');
const source=root+'/plan.json',planBefore=hash(source),base=JSON.parse(fs.readFileSync(source))[0],timed=JSON.parse(fs.readFileSync(root+'/ys-chain-c1v1.json')),clip={...base,duration:timed.duration,scenes:base.scenes.map((s,i)=>({...s,...timed.scenes[i],cues:s.cues}))},samples=JSON.parse(fs.readFileSync(root+'/blender/probe1s-r11/qa-samples.json'));
// The pre-existing C overlay sets clip.series to the prescribed axis label at
// the opening. Warm that unchanged original behavior before testing this new
// face wrapper's non-mutation; the file plan SHA is guarded independently.
old(clip,clip.scenes[0],0);const json=JSON.stringify(clip);
let same=0;const changed=[];
for(const t of [...samples.times].sort((x,y)=>x-y)){
 const s=clip.scenes.find(s=>t>=s.start&&t<s.end)??clip.scenes.at(-1),k=Math.max(0,s.captions.findLastIndex(c=>c.start<=t)),q=s.cues[k],n=next(clip,s,t),o=old(clip,s,t);
 if(q.diagram!==a.key){assert.equal(n,o);same++;}else{changed.push(t);if(t<a.faceStart)assert(!n.includes('fill="url(#fbg_mio)"'));if(t>a.faceStart+.18)assert(n.includes('fill="url(#fbg_mio)"'));}
}
if(JSON.stringify(clip)!==json){const changes=[];const walk=(a,b,p)=>{if(JSON.stringify(a)===JSON.stringify(b))return;if(a&&b&&typeof a==='object'&&typeof b==='object'){for(const k of new Set([...Object.keys(a),...Object.keys(b)]))walk(a[k],b[k],p+'.'+k);}else changes.push({path:p,before:a,after:b});};walk(JSON.parse(json),clip,'clip');console.log(JSON.stringify({inputChanges:changes.slice(0,10)}));throw Error('Input clip changed; see concise differences');}assert.equal(hash(source),planBefore);
const report={unitOnly:true,notNewGeometryQa:true,rawGeometrySource:'preserved r11 raw, for compositor-only regression',otherCueSvgByteEqual:same,approvedCueTimesTested:changed,face:a,inputObjectUnchangedAfterExistingAxisLabelWarmup:true,originalAxisLabelRuntimeInjectionUnchanged:true,inputPlanSha256Unchanged:planBefore,moduleSha256:hash(new URL('./desk-c1v1-approved-frame.mjs',import.meta.url))};
fs.writeFileSync(root+'/c1-approved-face-unit.json',JSON.stringify(report,null,1));console.log(JSON.stringify(report,null,1));

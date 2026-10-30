// Regression evidence for the C-only Pascal card translation; no source edits.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root=process.env.C1_FINAL_CACHE;assert(root);process.env.EM_FILM_CACHE=root;
const read=p=>JSON.parse(fs.readFileSync(p)),hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),out=root+'/c1-final-frame-unit.json';assert(!fs.existsSync(out));
const paths=[root+'/plan.json',root+'/ys-chain-c1v1.json',root+'/phrase-times.json',root+'/ys-chain-c1v1.voice.wav'],beforeSha=Object.fromEntries(paths.map(p=>[p,hash(p)]));
const {vertFrame:next,C1_NAME_CARD_REPAIR:r}=await import('./desk-c1v1-final-frame.mjs'),{vertFrame:old}=await import('./desk-c1v1-approved-frame.mjs');
const base=read(root+'/plan.json')[0],timed=read(root+'/ys-chain-c1v1.json'),clip={...base,duration:timed.duration,scenes:base.scenes.map((s,i)=>({...s,...timed.scenes[i],cues:s.cues}))};
old(clip,clip.scenes[0],0);const before=JSON.stringify(clip),data=read(root+'/blender/data.json'),c=data.cues.find(c=>c.key==='son:idea');
const frames=new Set([...Array.from({length:721},(_,i)=>i*15),...data.cues.map(c=>Math.floor((c.end-.000001)*30)),...Array.from({length:Math.ceil(c.end*30)-Math.ceil(c.start*30)},(_,i)=>Math.ceil(c.start*30)+i),...Array.from({length:88},(_,i)=>8481+i)]);
let outside=0,changed=0;const rows=[];
for(const j of [...frames].sort((a,b)=>a-b)){
 const t=j/30,s=clip.scenes.find(s=>t>=s.start&&t<s.end)??clip.scenes.at(-1),a=old(clip,s,t),b=next(clip,s,t);
 const k=Math.max(0,s.captions.findLastIndex(cap=>cap.start<=t));
 if(s.cues[k]?.diagram!==r.diagram){assert.equal(b,a);outside++;}
 else {const at=a.indexOf('>'+r.text+'</text>'),begin=a.lastIndexOf('<g ',at),end=a.indexOf('</g>',at)+4;assert(at>=0&&begin>=0);assert.equal(b,a.slice(0,begin)+'<g transform="translate(0 90)">'+a.slice(begin,end)+'</g>'+a.slice(end));changed++;}
 rows.push({frame:j,nameCardOnlyChanged:a!==b});
}
const foreign=[];for(const id of ['ys-chain-b1v1','ys-chain-d1v1','ys-chain-e1v1','ys-chain-1-1v6','ys-chain-1-2v2']){const cc={...clip,id},t=34,s=cc.scenes.find(s=>t>=s.start&&t<s.end);assert.equal(next(cc,s,t),old(cc,s,t));foreign.push(id);}
assert.equal(JSON.stringify(clip),before);for(const [p,h]of Object.entries(beforeSha))assert.equal(hash(p),h,p);
const report={date:new Date().toISOString(),unitOnly:true,notFinalMp4Acceptance:true,repair:r,originalWordsAndTimingsUnchanged:true,inputObjectUnchangedAfterExistingAxisLabelWarmup:true,immutableInputSha256:beforeSha,originalSvgOutsideNameCardByteEqual:outside,exactNameCardTransformFrames:changed,foreignIdsByteEqual:foreign,rows,finalFrameSha256:hash(new URL('./desk-c1v1-final-frame.mjs',import.meta.url)),approvedFaceWrapperSha256:hash(new URL('./desk-c1v1-approved-frame.mjs',import.meta.url))};
fs.writeFileSync(out,JSON.stringify(report,null,1));console.log(JSON.stringify({out,outside,changed,foreign:foreign.length}));

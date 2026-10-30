// R12 changes only four original frames. Preserve all r11 files and retain
// exact per-frame provenance; do not relabel old raw images as new renders.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import sharp from 'sharp';
const root='/private/tmp/ys/ys-chain-c1v1',cache=root+'/r12-probe-preflight',trial=root+'/blender/trial-r12',previous=root+'/blender/probe1s-r11',oldReview=root+'/r11-probe-preflight/probe1s-review-c1v1',id='ys-chain-c1v1';
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const old=JSON.parse(fs.readFileSync(previous+'/qa-samples.json')),fix=JSON.parse(fs.readFileSync(trial+'/qa-samples.json')),oldMeta=JSON.parse(fs.readFileSync(root+'/r11-probe-preflight/c1-probe1s-metadata.json'));
if(fs.existsSync(cache))throw Error('Keep prior QA outputs; refusing overwrite '+cache);
if(!fix.original437ShaUnchanged||fix.unchangedCameraFocusQuillHandSignatures!==433||!fix.faceUnchanged||fix.actualFiles.length!==12)throw Error('Incomplete safe-fix assertions');
for(const [p,h] of Object.entries(fix.sourceSha256))if(hash(p)!==h)throw Error('Frozen r12 3D source changed '+p);
for(const [p,h] of Object.entries(fix.original437Sha256))if(hash(p)!==h)throw Error('Original r11 raw changed '+p);
for(const f of fix.actualFiles)if(hash(f.file)!==f.sha256)throw Error('Trial image changed '+f.file);
for(const [p,h] of Object.entries(oldMeta.rendererSha256))if(hash(p)!==h)throw Error('Cached original renderer changed '+p);
fs.mkdirSync(cache+'/blender',{recursive:true});
const link=(s,t)=>fs.symlinkSync(s,t);
for(const f of ['plan.json',id+'.json','phrase-times.json'])link(root+'/'+f,cache+'/'+f);
link(root+'/blender/data.json',cache+'/blender/data.json');link(trial,cache+'/blender/desk');
const raw=cache+'/blender/probe1s',review=cache+'/probe1s-review-c1v1',detail=cache+'/trial-review';
for(const dir of [raw,review,detail])fs.mkdirSync(dir);
process.env.EM_FILM_CACHE=cache;
const {vertFrame}=await import('./desk-axes-frame.mjs');
const base=JSON.parse(fs.readFileSync(cache+'/plan.json'))[0],timed=JSON.parse(fs.readFileSync(cache+'/'+id+'.json')),clip={...base,duration:timed.duration,scenes:base.scenes.map((s,i)=>({...s,start:timed.scenes[i].start,end:timed.scenes[i].end,captions:timed.scenes[i].captions}))};
const name=j=>j%30===0?String(j/30).padStart(3,'0')+'.jpg':'frame-'+String(j).padStart(5,'0')+'.jpg';
let cards=[];
for(const j of fix.frames){
  const t=j/30,s=clip.scenes.find(s=>t>=s.start&&t<s.end)??clip.scenes.at(-1),svg=vertFrame(clip,s,t);
  if(/NaN|Infinity|undefined/.test(svg))throw Error('Invalid actual SVG '+t);
  const jpg=await sharp(Buffer.from(svg)).jpeg({quality:93}).toBuffer();fs.writeFileSync(detail+'/'+name(j),jpg);
  const oldFile=oldReview+'/'+name(j),before=fs.existsSync(oldFile)?await sharp(oldFile).resize(216,384).toBuffer():await sharp(root+'/r11-probe-preflight/probe1s-review-c1v1/reference1s/'+String(Math.floor(t)).padStart(5,'0')+'.jpg').toBuffer();
  const pair=await sharp({create:{width:432,height:406,channels:3,background:'#f4e8cc'}}).composite([{input:await sharp(jpg).resize(216,384).toBuffer(),left:0,top:22},{input:before,left:216,top:22},{input:Buffer.from(`<svg width="432" height="22"><text x="5" y="16" font-family="Arial" font-size="14">C1 r12 ${t.toFixed(3)} s | ${fs.existsSync(oldFile)?'r11 same frame':'reference '+Math.floor(t)+' s'}</text></svg>`),left:0,top:0}]).jpeg({quality:94}).toBuffer();cards.push(pair);
}
for(let k=0;k<cards.length;k+=6)await sharp({create:{width:1296,height:812,channels:3,background:'#f4e8cc'}}).composite(cards.slice(k,k+6).map((input,i)=>({input,left:(i%3)*432,top:Math.floor(i/3)*406}))).jpeg({quality:94}).toFile(detail+'/sheet-'+String(1+k/6).padStart(2,'0')+'.jpg');
const changed=new Set(fix.changedOriginalFrames),originalSet=new Set(old.frames),all=[...new Set([...old.frames,...fix.frames])].sort((a,b)=>a-b),provenance=[];
for(const j of all){
  const updated=changed.has(j)||!originalSet.has(j),src=(updated?trial:previous)+'/'+String(j).padStart(5,'0')+'.jpg',composite=(updated?detail:oldReview)+'/'+name(j);
  link(src,raw+'/'+String(j).padStart(5,'0')+'.jpg');link(composite,review+'/'+name(j));
  provenance.push({frame:j,time:j/30,raw:src,rawSha256:hash(src),composite,compositeSha256:hash(composite),revision:updated?'r12-writing-hold':'r11-context-fix'});
}
if(all.length!==443||changed.size!==4||provenance.filter(x=>x.revision==='r11-context-fix').length!==433)throw Error('Incorrect per-frame reuse');
const meta={...oldMeta,raw,review,qaTimes:all.map(j=>j/30),qaFrames:all.map(j=>({time:j/30,frame:j,reviewFile:name(j)})),sheets:2,wholeR11VisualSheets:oldReview,perFrameProvenance:provenance,sourceRevisions:{r11:old.sourceSha256,r12:fix.sourceSha256},reuse433ExactComposites:true,notFull30fps:true};
fs.writeFileSync(cache+'/c1-probe1s-metadata.json',JSON.stringify(meta,null,1));
fs.writeFileSync(cache+'/r12-per-frame-provenance.json',JSON.stringify({allFrames:443,originalFrames:437,changedOriginalFrames:[...changed],extraDiagnosticFrames:6,rawAndComposite:provenance},null,1));
const result=spawnSync('/Users/ken/Library/Application Support/physics-quest-tools/pyenv/bin/python',['scripts/umech/audit-c1v1-probe1s.py'],{env:{...process.env,EM_FILM_CACHE:cache},stdio:'inherit'});
for(const [p,h] of Object.entries(fix.sourceSha256))if(hash(p)!==h)throw Error('r12 source changed during QA '+p);
for(const [p,h] of Object.entries(fix.original437Sha256))if(hash(p)!==h)throw Error('Original r11 raw changed during QA '+p);
const stage={date:new Date().toISOString(),notFull30fps:true,original437Preserved:true,changedOriginalFrames:[...changed],reuse433ExactComposites:true,allDiagnosticFrames:443,trialActualFrames:12,originalFeaturesExit:result.status,sourceSha256:fix.sourceSha256,sourceRevisions:{r11:old.sourceSha256,r12:fix.sourceSha256},faceUnchanged:true,review:detail,wholeReview:oldReview,allOriginalCueEndsReviewed:true};
fs.writeFileSync(cache+'/preflight-r12-stage.json',JSON.stringify(stage,null,1));console.log(JSON.stringify(stage,null,1));
process.exit(result.status??1);

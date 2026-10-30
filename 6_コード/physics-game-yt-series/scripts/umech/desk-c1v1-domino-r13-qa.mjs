// Actual full-30fps row34 review; all old files remain preserved.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import sharp from 'sharp';
const root='/private/tmp/ys/ys-chain-c1v1',raw=root+'/blender/trial-r13',out=root+'/r13-domino-review',cache=out+'/cache',id='ys-chain-c1v1',W=fileURLToPath(new URL('../../',import.meta.url));
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const trial=JSON.parse(fs.readFileSync(raw+'/qa-samples.json'));
assert.equal(trial.actualJpegCount,88);assert(trial.allImmutableInputsUnchanged&&trial.originalPlanFaceUnchanged&&trial.otherSceneOutputsMtimeShaUnchanged);
for(const [p,h] of Object.entries({...trial.sourceSha256,...trial.immutableInputSha256}))assert.equal(hash(p),h,p);
assert(!fs.existsSync(out),'Preserve existing r13 actual review');
fs.mkdirSync(cache+'/blender/desk',{recursive:true});fs.mkdirSync(out+'/frames');fs.mkdirSync(out+'/sheets');
for(const f of ['plan.json',id+'.json','phrase-times.json'])fs.symlinkSync(root+'/'+f,cache+'/'+f);
fs.symlinkSync(root+'/blender/data.json',cache+'/blender/data.json');
const oldRaw=root+'/r12-probe-preflight/blender/probe1s',frames=new Set(trial.frames);
for(const f of fs.readdirSync(oldRaw).filter(x=>/^\d{5}\.jpg$/.test(x)))if(!frames.has(Number(f.slice(0,5))))fs.symlinkSync(oldRaw+'/'+f,cache+'/blender/desk/'+f);
for(const f of trial.actualFiles){assert.equal(hash(f.file),f.sha256);fs.symlinkSync(f.file,cache+'/blender/desk/'+String(f.frame).padStart(5,'0')+'.jpg');}
let anchors=JSON.parse(fs.readFileSync(root+'/blender/probe1s-r11/anchors.json'));
for(const [folder,js]of[[root+'/blender/trial-r12',JSON.parse(fs.readFileSync(root+'/blender/trial-r12/qa-samples.json')).frames],[raw,trial.frames]]){
 const other=JSON.parse(fs.readFileSync(folder+'/anchors.json'));
 for(const [k,v]of Object.entries(other.anchors)){anchors.anchors[k]??=Array.from({length:anchors.frames},()=>[0,0,0]);for(const j of js)anchors.anchors[k][j]=v[j];}
}
fs.writeFileSync(cache+'/blender/desk/anchors.json',JSON.stringify(anchors));process.env.EM_FILM_CACHE=cache;
const {vertFrame,C1_DOMINO_APPROVAL}=await import('./desk-c1v1-approved-frame.mjs'),{vertFrame:oldVertFrame}=await import('./desk-axes-frame.mjs');
const base=JSON.parse(fs.readFileSync(root+'/plan.json'))[0],timed=JSON.parse(fs.readFileSync(root+'/'+id+'.json')),clip={...base,duration:timed.duration,scenes:base.scenes.map((s,i)=>({...s,...timed.scenes[i],cues:s.cues}))};
// Existing overlay's opening-only axis label is a runtime series assignment,
// not a file edit. Warm it before testing this new face wrapper for mutation.
oldVertFrame(clip,clip.scenes[0],0);const clipBefore=JSON.stringify(clip);
const src=fs.readFileSync(W+'scripts/umech/desk-quality-gate.mjs','utf8'),defs=src.slice(src.indexOf('const AFF='),src.indexOf('async function checkSvg()')).replace('export function svgItems','function svgItems');
const {refine,svgItems}=new Function('createRequire','ROOT','path',defs+'\nreturn {refine,svgItems};')(createRequire,W,path);
const errors=[],cards=[],items=[],sources={};
for(const f of ['./desk-c1v1-approved-frame.mjs','./desk-axes-frame.mjs','./desk-c1v1-overlay.mjs','./desk-c1v1-domino-r13-qa.mjs']){const p=fileURLToPath(new URL(f,import.meta.url));sources[p]=hash(p);}
for(const j of trial.frames){
 const t=j/30,scene=clip.scenes.find(s=>t>=s.start&&t<s.end)??clip.scenes.at(-1),svg=vertFrame(clip,scene,t);assert(!/NaN|Infinity|undefined/.test(svg));
 for(const it of await refine(svgItems(svg))){if(it.op<.05)continue;const [x0,y0,x1,y1]=it.box,tol=it.kind==='rect'?16:6;
  if(x0<40-tol||x1>1040+tol||y0<110-tol||y1>1600+tol)errors.push({t,kind:'outside',text:it.s??'rect',box:it.box});
  if(it.kind==='text'&&it.size<35.99&&!/^[\s、。，．・→←↑↓⇒\-–—…:：|｜\/／]+$/.test(it.s))errors.push({t,kind:'small',text:it.s,size:it.size});
  if(it.card&&Math.max(it.card[0]-x0,x1-it.card[2])>2)errors.push({t,kind:'card',text:it.s,box:it.box,card:it.card});
 }
 const image=await sharp(Buffer.from(svg)).png().toBuffer(),file=out+'/frames/'+String(j).padStart(5,'0')+'.png';fs.writeFileSync(file,image);
 const beforeFace=t<C1_DOMINO_APPROVAL.faceStart&&t>=trial.timing.cueStart;if(beforeFace)assert(!svg.includes('fill="url(#fbg_mio)"'),'Face covers actual falls before approved voice end');
 const label=Buffer.from(`<svg width="360" height="30"><rect width="360" height="30" fill="white"/><text x="8" y="22" font-family="Arial" font-size="18">C1 ${t.toFixed(3)} s / ${j}</text></svg>`);
 cards.push(await sharp({create:{width:360,height:670,channels:3,background:'#fff'}}).composite([{input:await sharp(image).resize(360,640).toBuffer(),left:0,top:30},{input:label,left:0,top:0}]).jpeg({quality:93}).toBuffer());
 items.push({frame:j,time:t,file,sha256:hash(file),faceBeginsAt:C1_DOMINO_APPROVAL.faceStart});
}
for(let i=0;i<cards.length;i+=9)await sharp({create:{width:1080,height:2010,channels:3,background:'#fff'}}).composite(cards.slice(i,i+9).map((input,k)=>({input,left:k%3*360,top:Math.floor(k/3)*670}))).jpeg({quality:93}).toFile(out+'/sheets/sheet-'+String(i/9+1).padStart(2,'0')+'.jpg');
const prior=JSON.parse(fs.readFileSync(root+'/r12-probe-preflight/r12-per-frame-provenance.json'));let svgSame=0;
for(const f of prior.rawAndComposite){const t=f.time;if(trial.timing.cueStart<=t&&t<trial.timing.faceEnds)continue;const scene=clip.scenes.find(s=>t>=s.start&&t<s.end)??clip.scenes.at(-1);assert.equal(vertFrame(clip,scene,t),oldVertFrame(clip,scene,t),'SVG outside approved cue changed '+t);svgSame++;}
assert.equal(JSON.stringify(clip),clipBefore,'Input clip was mutated');
const ff='/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1',preview=out+'/C1_row34_承認演出試写.mp4';
const enc=spawnSync(ff,['-v','error','-framerate','30','-start_number',String(trial.frames[0]),'-i',out+'/frames/%05d.png','-ss',String(trial.frames[0]/30),'-i',root+'/'+id+'.voice.wav','-t',String(trial.frames.length/30),'-map','0:v:0','-map','1:a:0','-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-movflags','+faststart',preview],{encoding:'utf8'});assert.equal(enc.status,0,enc.stderr);
for(const [p,h] of Object.entries({...trial.sourceSha256,...trial.immutableInputSha256,...sources}))assert.equal(hash(p),h,p);
const report={notFinalVideo:true,actualFrames:88,actualFramesPerSecond:30,scope:'all actual row34 frames plus preceding/following cue; original font/refine algorithm unchanged',approval:C1_DOMINO_APPROVAL,allInputPlanVoiceCaptionHashesUnchanged:true,inputClipObjectUnchangedAfterExistingAxisLabelWarmup:true,originalAxisLabelRuntimeInjectionUnchanged:true,otherCueSvgByteEqual:svgSame,originalSvgAlgorithmSha256:hash(W+'scripts/umech/desk-quality-gate.mjs'),errors,frames:items,sheets:Math.ceil(cards.length/9),preview,previewAudio:'unaltered supplied voice excerpt only; not the final music/SFX mix',sourceSha256:sources,trialSourceSha256:trial.sourceSha256};
fs.writeFileSync(out+'/actual-r13-qa.json',JSON.stringify(report,null,1));console.log(JSON.stringify({...report,frames:items.length},null,1));if(errors.length)process.exitCode=1;

// Root-authorized NEW delivery cache. Frozen E r9 raw and earlier candidates
// are read-only. Only actual camera-patch JPEGs/anchors replace their exact
// output frame references. Japanese/cue times/canonical voice never change.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';

assert(process.argv.includes('--authorized'),'Root must authorize CPU assembly/encoding');
const source='/private/tmp/ys/ys-chain-e1v1';
const correction=process.env.E1_CAMERA_PATCH??'/private/tmp/ys/ys-chain-e1v1-camera-final-20261024';
const cache=process.env.E1_FINAL_CACHE??'/private/tmp/ys/ys-chain-e1v1-final-20261024';
for(const [p,prefix]of[[correction,'ys-chain-e1v1-camera-final-20261024'],[cache,'ys-chain-e1v1-final-20261024']]){
 assert.equal(path.dirname(p),'/private/tmp/ys');assert(path.basename(p).startsWith(prefix));
}
const id='ys-chain-e1v1',desk=cache+'/blender/desk',out=cache+'/out';
const read=p=>JSON.parse(fs.readFileSync(p));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const completed=read(source+'/e1v1-production-r9/completed.json');
assert.equal(completed.status,'render_complete_pending_final_QA');
assert.equal(completed.frames,11606);
const cp=read(correction+'/camera-patch.json');
assert(cp.allPatchFramesActuallyRendered&&cp.originalInputsUnchanged&&cp.allOriginal11606RawSizeAndMtimeUnchanged);
assert(cp.otherSceneSavePathsAndImagesUnchanged&&cp.allOriginalFunctionsRetained&&cp.noModelRebuild);
assert.equal(cp.physicalViolations.length,0);assert.equal(cp.auxiliaryFullFrameClips.length,0);
assert.equal(sha('scripts/blender/desk_axes_e1_camera_patch_20261024.py'),cp.helperSha256);
for(const [p,h]of Object.entries(cp.protectedInputSha256))assert.equal(sha(p),h,p);
for(const [p,h]of Object.entries(cp.protectedOriginalRawSampleSha256))assert.equal(sha(p),h,p);
const freeze=read(source+'/e1v1-r9-source-freeze.json');
for(const [p,h]of Object.entries(freeze.files))assert.equal(sha(p),h,p);
assert.equal(sha(source+'/'+id+'.wav'),freeze.canonicalVoiceSHA256);
assert(!fs.existsSync(cache),'Preserve any earlier corrected delivery cache');
const inventory=cp.originalRawInventoryBefore;
for(let j=0;j<11606;j++){
 const name=String(j).padStart(5,'0')+'.jpg',p=source+'/blender/desk/'+name,s=fs.statSync(p,{bigint:true});
 assert(!fs.lstatSync(p).isSymbolicLink());
 assert.equal(Number(s.size),inventory[name][0]);assert.equal(s.mtimeNs.toString(),inventory[name][1]);
}
fs.mkdirSync(desk,{recursive:true});fs.mkdirSync(out);
const link=(a,b)=>{assert(fs.statSync(a).isFile());assert(!fs.existsSync(b));fs.symlinkSync(a,b);};
// The series-title correction belongs only to the drawing plan copy.
const plan=structuredClone(read(source+'/plan.json'));plan[0].series='E 時間と位置 1';
fs.writeFileSync(cache+'/plan.json',JSON.stringify(plan),{flag:'wx'});
for(const name of [id+'.json','phrase-times.json','timed-selection.json'])link(source+'/'+name,cache+'/'+name);
link(source+'/'+id+'.wav',cache+'/'+id+'.voice.wav');
link(source+'/'+id+'.mix.wav',cache+'/'+id+'.wav');
for(const name of [id+'.mix.json',id+'.levels.json'])if(fs.existsSync(source+'/'+name))link(source+'/'+name,cache+'/'+name);
link(source+'/blender/data.json',cache+'/blender/data.json');
fs.symlinkSync(source+'/blender/tex',cache+'/blender/tex');
link(source+'/blender/desk/meta.json',desk+'/meta.json');
link(correction+'/blender/camera-motion.json',cache+'/blender/camera-motion.json');
const base=read(source+'/blender/desk/anchors.json'),patched=read(cp.anchors);
const anchors=structuredClone(base),names=Object.keys(base.anchors).sort();
assert.deepEqual(Object.keys(patched.anchors).sort(),names);
assert(names.every(name=>base.anchors[name].length===11606&&patched.anchors[name].length===11606));
const physical=new Map(cp.physical.map(row=>[row.frame,row])),records=[];
for(let j=0;j<11606;j++){
 const k=cp.replacementFrameToActualPatchFrame[j],name=String(j).padStart(5,'0')+'.jpg';
 let file,kind,objectSource;
 if(k!==undefined){
  assert(Number.isInteger(k)&&physical.has(k));
  const evidence=physical.get(k);assert(evidence.within40to70&&!evidence.clipped&&!evidence.outsidePrincipalSafeArea);
  file=cp.raw+'/'+String(k).padStart(5,'0')+'.jpg';kind='actual-camera-only-correction';
  objectSource=cp.patchFrameToUnchangedObjectSourceFrame[k];
  for(const name of names){assert.equal(patched.anchors[name][k].length,3);anchors.anchors[name][j]=patched.anchors[name][k];}
 }else{file=source+'/blender/desk/'+name;kind='unchanged-frozen-r9-production';objectSource=null;}
 assert(fs.statSync(file).size>1000);link(file,desk+'/'+name);
 records.push({frame:j,cameraPatchFrame:k??null,depictedOriginalObjectFrame:objectSource,source:file,kind,sha256:sha(file)});
}
assert.equal(records.filter(r=>r.cameraPatchFrame!==null).length,Object.keys(cp.replacementFrameToActualPatchFrame).length);
fs.writeFileSync(desk+'/anchors.json',JSON.stringify(anchors),{flag:'wx'});
const owner={id,frames:11606,fps:30,cache,source,correction,sourceFreezeSha256:sha(source+'/e1v1-r9-source-freeze.json'),cameraPatchSha256:sha(correction+'/camera-patch.json'),allRawAndAnchorsUseExactActualFrame:true,originalInputsAndOriginalNGPreserved:true,actualMp4EyeReviewPending:true};
fs.writeFileSync(cache+'/composite-provenance.json',JSON.stringify({...owner,records},null,1),{flag:'wx'});
const protectedFiles=[...Object.keys(cp.protectedInputSha256),source+'/'+id+'.mix.wav',
 'scripts/umech/desk-axes-render-entry.mjs','scripts/umech/render-all-films-gptv2.mjs',
 'scripts/umech/desk-axes-frame.mjs','scripts/umech/desk-frame.mjs',
 'scripts/umech/desk-e1v1-overlay.mjs','scripts/umech/desk-e1v1-camera-final-export-20261024.mjs'];
const hashes=Object.fromEntries(protectedFiles.map(p=>[path.resolve(p),sha(p)]));
if(process.argv.includes('--no-encode')){
 fs.writeFileSync(cache+'/prepared.json',JSON.stringify({...owner,protectedInputSha256:hashes,encoded:false},null,1),{flag:'wx'});
 console.log(cache);process.exit(0);
}
const started=Date.now(),r=spawnSync(process.execPath,['scripts/umech/desk-axes-render-entry.mjs',id],{
 env:{...process.env,EM_FILM_CACHE:cache,FILM_OUTPUT:out,
 FFMPEG:process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1'},stdio:'inherit'});
assert.equal(r.status,0,'Corrected E encoding failed; outputs preserved');
for(const [p,h]of Object.entries(hashes))assert.equal(sha(p),h,p);
const video=out+'/'+id+'.mp4';assert(fs.statSync(video).size>1e6);
fs.writeFileSync(cache+'/export.json',JSON.stringify({...owner,video,sha256:sha(video),seconds:(Date.now()-started)/1000,
 encoder:'Unchanged render-all-films-gptv2.mjs CRF18 via new private axes entry',
 protectedInputSha256:hashes,actualFinalGatesPending:true,actualFinalEyeReviewPending:true,finalPassed:false},null,1),{flag:'wx'});
console.log(video);

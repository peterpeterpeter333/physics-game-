// Complete a NEW private composition cache for the unchanged quality checker.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const [cache,reportPath,mp4]=process.argv.slice(2);
const source='/private/tmp/ys/ys-chain-d1v1-final-camera-pier-layout-20261025';
const read=p=>JSON.parse(fs.readFileSync(p));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
assert(cache&&reportPath&&mp4&&cache.startsWith('/private/tmp/ys/')&&cache!==source);
assert(!fs.existsSync(cache+'/complete-cache-receipt.json'));
const report=read(reportPath),composition=read(cache+'/composition-receipt.json');
assert(report.mode==='render'&&report.renders===149&&report.rows.length===149&&report.allAffectedAndBoundaryPhysicalPass);
assert(!report.error&&!report.cleanupError&&Object.values(report.protectionChecks).every(Boolean));
assert(composition.frames.length===149&&composition.sourceCache===source);
const rows=read(source+'/blender/delivered-provenance.json');
const map=new Map(report.rows.map(r=>[r.frame,r]));
for(let j=0;j<12163;j++){
 const p=cache+'/blender/desk/'+String(j).padStart(5,'0')+'.jpg';
 if(!fs.existsSync(p)){assert(!map.has(j));fs.symlinkSync(source+'/blender/desk/'+String(j).padStart(5,'0')+'.jpg',p);}
 if(map.has(j)){
  const r=map.get(j);
  assert.equal(fs.realpathSync(p),fs.realpathSync(r.image));
  assert.equal(sha(p),r.imageSha256);
  assert.deepEqual(rows.frames[j],r.sourceDeliveredRow);
  rows.frames[j]={...rows.frames[j],layer:'new-fixed-width-camera-20261025',raw:r.image,pose:r.camera.pose,actualFrame:j,originalDeliveredRow:r.sourceDeliveredRow};
 }
}
for(const f of ['ys-chain-d1v1.voice.wav','ys-chain-d1v1.wav','ys-chain-d1v1.mix.json'])fs.symlinkSync(source+'/'+f,cache+'/'+f);
for(const [relative,value]of [
 ['blender/delivered-provenance.json',rows],
 ['blender/delivered-camera-poses.json',report.candidateDeliveredCameraPoses],
 ['blender/camera-motion.json',{frames:12163,moving_frames:report.candidateCameraMotion.movingFrames,moving_ratio:report.candidateCameraMotion.movingRatio,top_ratio:report.candidateCameraMotion.topRatio,moving_spans:report.candidateCameraMotion.moving_spans}],
 ['blender/desk/meta.json',{...read(source+'/blender/desk/meta.json'),privateDerivative:'five-width-camera-20261025',sourceMetaSha256:sha(source+'/blender/desk/meta.json')}]
]){const p=cache+'/'+relative;assert(!fs.existsSync(p));fs.writeFileSync(p,JSON.stringify(value),{flag:'wx'});}
fs.mkdirSync(cache+'/out');fs.symlinkSync(path.resolve(mp4),cache+'/out/ys-chain-d1v1.mp4');
fs.writeFileSync(cache+'/complete-cache-receipt.json',JSON.stringify({source,cache,mp4,mp4Sha256:sha(mp4),sourceReport:reportPath,sourceReportSha256:sha(reportPath),compositionSha256:sha(cache+'/composition-receipt.json'),frames:12163,encodedFrames:12162,newRawFrames:149,originalUnchangedRawFrames:12014,audioCopiedUnchanged:true},null,1),{flag:'wx'});
console.log(JSON.stringify({cache,frames:12163,changed:149}));

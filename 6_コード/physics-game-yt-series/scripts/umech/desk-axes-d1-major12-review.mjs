// Twelve actual encoded D1 frames beside full-resolution encoded reference
// frames. Requires the completed extraction manifest, not SVG reconstruction.
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const cache=process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-d1v1-production-r15';
const review=process.env.D1_REVIEW_OUT??cache+'/review-1sec-d1v1';
const out=process.env.D1_MAJOR12_OUT??cache+'/major12-actual-d1v1-r15';
const ff=process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
const data=JSON.parse(fs.readFileSync(cache+'/blender/data.json'));
const manifestPath=review+'/d1v1-review-manifest.json',manifest=JSON.parse(fs.readFileSync(manifestPath));
if(manifest.episode!=='D-1'||manifest.integerSeconds!==406||manifest.cueEnds!==57)throw Error('Actual complete D1 extraction manifest required');
if(fs.existsSync(out))throw Error('Existing D1 major12 actual evidence preserved');
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
if(sha(manifest.mp4)!==manifest.mp4Sha256||sha(manifest.reference)!==manifest.referenceSha256)throw Error('Encoded source changed since extraction');
const match=[7,13,25,268,20,94,95,337,418,364,431,488];
if(data.landmarks.length!==12)throw Error('Exactly 12 approved D1 landmarks required');
const rows=data.landmarks.map((time,i)=>{
 const frameIndex=Math.round(time*30),frame=manifest.frames.find(f=>f.frameIndex===frameIndex);
 if(!frame||!frame.reasons.includes('main12')||frame.referenceTime!==match[i])throw Error('Wrong landmark/reference correspondence '+i);
 const file=review+'/frames-d1v1/'+frame.file;
 if(sha(file)!==frame.fileSha256)throw Error('Extracted D1 frame changed');
 return {number:i+1,requestedTime:time,time:frame.time,frameIndex,cue:frame.cue,row:frame.row,subtitle:frame.subtitle,file,fileSha256:frame.fileSha256,referenceTime:match[i],referenceFrameIndex:match[i]*30};
});
fs.mkdirSync(out,{recursive:true});fs.mkdirSync(out+'/reference-full');
const indices=[...new Set(rows.map(r=>r.referenceFrameIndex))].sort((a,b)=>a-b);
const start=Date.now();
const r=spawnSync(ff,['-v','error','-i',manifest.reference,'-vf','select='+indices.map(j=>`eq(n\\,${j})`).join('+'),'-fps_mode','passthrough','-q:v','2',out+'/reference-full/ref-%02d.jpg'],{encoding:'utf8',maxBuffer:1e7});
fs.writeFileSync(out+'/reference-extraction.log',(r.stdout??'')+(r.stderr??''));
if(r.status!==0)throw Error('Encoded reference extraction failed');
const refFiles=fs.readdirSync(out+'/reference-full').filter(f=>f.endsWith('.jpg')).sort();
if(refFiles.length!==indices.length)throw Error('Incomplete full-resolution reference frames');
const label=s=>Buffer.from(`<svg width="1080" height="64"><rect width="1080" height="64" fill="#fff7e6"/><text x="24" y="46" font-family="Hiragino Sans" font-size="36" fill="#241c15">${s}</text></svg>`);
for(const row of rows){
 const reference=out+'/reference-full/'+refFiles[indices.indexOf(row.referenceFrameIndex)];
 const ownMeta=await sharp(row.file).metadata(),refMeta=await sharp(reference).metadata();
 if(ownMeta.width!==1080||ownMeta.height!==1920||refMeta.width!==1080||refMeta.height!==1920)throw Error('Both actual source frames must be full 1080 x 1920');
 const file=out+'/d1v1-major-'+String(row.number).padStart(2,'0')+'.jpg';
 await sharp({create:{width:2160,height:1984,channels:3,background:'#fff7e6'}}).composite([{input:label(`D-1 ${row.time.toFixed(3)}秒　${row.cue}`),left:0,top:0},{input:fs.readFileSync(row.file),left:0,top:64},{input:label(`見本1-1 第6版 ${row.referenceTime}秒`),left:1080,top:0},{input:fs.readFileSync(reference),left:1080,top:64}]).jpeg({quality:95}).toFile(file);
 Object.assign(row,{referenceFile:reference,referenceFileSha256:sha(reference),comparison:file,comparisonSha256:sha(file),actuallyViewed:false});
}
const record={episode:'D-1',status:'Twelve actual encoded comparisons extracted only; actual visual review pending',sourceManifest:manifestPath,sourceManifestSha256:sha(manifestPath),mp4:manifest.mp4,mp4Sha256:manifest.mp4Sha256,reference:manifest.reference,referenceSha256:manifest.referenceSha256,rows,frames:12,allActuallyViewed:false,originalInspectorModified:false,seconds:(Date.now()-start)/1000};
fs.writeFileSync(out+'/d1-major12-manifest.json',JSON.stringify(record,null,1));
console.log(JSON.stringify({out,frames:12,status:record.status,seconds:record.seconds},null,1));

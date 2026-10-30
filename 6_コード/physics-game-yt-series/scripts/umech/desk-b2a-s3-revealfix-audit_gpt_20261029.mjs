// Compare the old and reveal-fixed encoded S3 MP4s without saving frame-hash tables.
// Extract only actual MP4 pixels. No Blender/source/old-report writes.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import sharp from 'sharp';
const W=path.resolve(import.meta.dirname,'../..'),C='/private/tmp/ys/ys-chain-b2a_s3_gpt_20261029';
const OLD=path.join(C,'draft/ys-chain-b2a_gpt_20261029_s3_draft.mp4');
const NEW=process.argv[2]||path.join(C,'draft/ys-chain-b2a_gpt_20261029_s3_draft_revealfix.mp4');
const OUT=process.argv[3]||path.join(W,'outputs/ys-chain-b2a-backup/S3_20261029/実MP4局所修正版確認');
const ff='/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const exp=p=>p.replace(/\.mp4$/,'.export.json');const oldEx=read(exp(OLD)),newEx=read(exp(NEW));
assert.equal(oldEx.videoSha256,sha(OLD));assert.equal(newEx.videoSha256,sha(NEW));assert.equal(newEx.allFrameDecode,true);assert.equal(newEx.fps,30);
const NF=newEx.encodedFrames??newEx.inputFrames??newEx.frames;assert.equal(NF,14846);
assert.ok(!fs.existsSync(OUT));fs.mkdirSync(OUT,{recursive:true});
function hashes(file){
 const r=spawnSync(ff,['-hide_banner','-loglevel','error','-i',file,'-map','0:v:0','-an','-f','framemd5','-'],{encoding:'utf8',maxBuffer:32*1024*1024});assert.equal(r.status,0);
 const rows=r.stdout.split(/\r?\n/).filter(s=>s&&!s.startsWith('#')).map(s=>s.split(',').map(x=>x.trim()));assert.equal(rows.length,NF);
 return rows.map((a,j)=>{assert.equal(+a[1],j);assert.equal(+a[2],j);return a.at(-1);});
}
console.log('Comparing decoded video pixels (two full MP4 decodes; no frame hash table files).');
const oldH=hashes(OLD),newH=hashes(NEW),prefixEnd=14541;
const agg=(a,from,to)=>createHash('sha256').update(a.slice(from,to+1).join('\n')+'\n').digest('hex');
const prefixA=agg(oldH,0,prefixEnd),prefixB=agg(newH,0,prefixEnd),diff=[];
for(let j=0;j<NF;j++)if(oldH[j]!==newH[j])diff.push(j);
const ranges=[];for(const j of diff){const last=ranges.at(-1);if(last&&j===last.last+1){last.last=j;last.frames++;}else ranges.push({first:j,last:j,frames:1});}
function decodedAudioSha(file){const r=spawnSync(ff,['-hide_banner','-loglevel','error','-i',file,'-map','0:a:0','-vn','-acodec','pcm_s16le','-f','hash','-hash','sha256','-'],{encoding:'utf8',maxBuffer:4096});assert.equal(r.status,0);return r.stdout.trim();}
const oldAudio=decodedAudioSha(OLD),newAudio=decodedAudioSha(NEW);
const groups=[{id:'reveal-27-contiguous',indices:Array.from({length:27},(_,i)=>14542+i)},{id:'last-ten-seconds-one-hz',indices:[...Array.from({length:11},(_,i)=>(484+i)*30),NF-1]}];
const indices=[...new Set(groups.flatMap(g=>g.indices))].sort((a,b)=>a-b),native=path.join(OUT,'decoded-actual-png');fs.mkdirSync(native);
const select=indices.map(j=>`eq(n\\,${j})`).join('+');
const r=spawnSync(ff,['-n','-hide_banner','-loglevel','info','-i',NEW,'-an','-vf',`select=${select},showinfo`,'-fps_mode','passthrough','-start_number','0',path.join(native,'seq-%05d.png')],{encoding:'utf8',maxBuffer:32*1024*1024});
fs.writeFileSync(path.join(OUT,'exact-decode.log'),r.stderr,{flag:'wx'});assert.equal(r.status,0);
const tb=/config in time_base:\s*(\d+)\/(\d+)/.exec(r.stderr),times=[...r.stderr.matchAll(/\bn:\s*(\d+)\s+pts:\s*(-?\d+)/g)];assert.equal(times.length,indices.length);
for(let i=0;i<indices.length;i++){assert.equal(+times[i][2]*(+tb[1])*30,indices[i]*(+tb[2]));fs.renameSync(path.join(native,`seq-${String(i).padStart(5,'0')}.png`),path.join(native,`${String(indices[i]).padStart(5,'0')}.png`));}
for(const g of groups){
 const dir=path.join(OUT,g.id);fs.mkdirSync(dir);g.pages=[];
 for(let from=0;from<g.indices.length;from+=15){
  const list=g.indices.slice(from,from+15),layers=[];
  layers.push({input:Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1152" height="38"><rect width="100%" height="100%" fill="#17202e"/><text x="12" y="26" font-family="Arial" font-size="18" fill="white">${g.id} | actual fixed MP4 | ${from+1}-${from+list.length}</text></svg>`),left:0,top:0});
  for(let k=0;k<list.length;k++){
   const j=list[k],x=12+(k%5)*228,y=50+Math.floor(k/5)*431;
   layers.push({input:Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="216" height="35"><rect width="100%" height="100%" fill="#f8f6f0"/><text x="7" y="24" font-family="Arial" font-size="17">${(j/30).toFixed(3)} s | #${j}</text></svg>`),left:x,top:y},{input:await sharp(path.join(native,`${String(j).padStart(5,'0')}.png`)).resize(216,384).png().toBuffer(),left:x,top:y+35});
  }
  const f=path.join(dir,`page-${String(g.pages.length+1).padStart(3,'0')}.jpg`);await sharp({create:{width:1152,height:1343,channels:3,background:'#ded8ce'}}).composite(layers).jpeg({quality:94,chromaSubsampling:'4:4:4'}).toFile(f);g.pages.push({image:f,frames:list,viewed:false});
 }
}
assert.equal(oldEx.videoSha256,sha(OLD));assert.equal(newEx.videoSha256,sha(NEW));
const report={sourceOld:OLD,sourceNew:NEW,oldSha256:oldEx.videoSha256,newSha256:newEx.videoSha256,comparedDecodedFrames:NF,prefix:{first:0,last:prefixEnd,frames:prefixEnd+1,oldAggregateSha256:prefixA,newAggregateSha256:prefixB,equal:prefixA===prefixB},allFrameDifferences:{count:diff.length,ranges},outsideIntended27Frames:diff.filter(j=>j<14542||j>14568).length,decodedAudio:{old:oldAudio,new:newAudio,equal:oldAudio===newAudio},hashTablesSaved:false,selectedActualVideoFrames:indices.length,exactGlobalPTSValidated:true,groups,visualReviewPerformed:false,audioEarReviewPerformed:false};
fs.writeFileSync(path.join(OUT,'revealfix-audit-manifest.json'),JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(report,null,2));

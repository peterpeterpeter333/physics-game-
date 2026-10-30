// NEW CPU-only contact sheets of the existing exact final decoded JPEGs.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import{createHash}from'node:crypto';import{fileURLToPath}from'node:url';import sharp from'sharp';
assert.deepEqual(process.argv.slice(2),['--authorized']);sharp.concurrency(1);sharp.cache({memory:32,files:10,items:30});
const source='/private/tmp/ys/ys-chain-e1v1-final-20261024/actual-mp4-review-eof-20261025';
const out='/private/tmp/ys/ys-chain-e1v1-final-nonhalf-contact-20261025';
const manifestFile=source+'/manifest.json',expectedManifest='70e6a737a28eb13f9d94db8173b89f3517f181572750097e3d55934a681e3a58';
const videoSha='7f882409832ca427cf6ce8276d3ff14f2121baaa92ad48633d616861e6dac1bd';
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
assert(!fs.existsSync(out));assert.equal(sha(manifestFile),expectedManifest);
const m=JSON.parse(fs.readFileSync(manifestFile));assert.equal(m.videoSha256,videoSha);assert.equal(sha(m.video),videoSha);
assert.equal(m.uniqueExtracted,1200);assert.equal(m.expectedFrames,11606);
const union=new Map(),groups=new Map();
for(const[k,v]of Object.entries(m))if(Array.isArray(v?.frames))for(const r of v.frames){
 assert(Number.isInteger(r.frame)&&r.frame>=0&&r.frame<11605&&r.time===r.frame/30);
 assert.equal(path.dirname(r.file),source+'/frames');const old=union.get(r.frame);
 if(old)assert(old.file===r.file&&old.sha256===r.sha256&&old.cue===r.cue&&old.row===r.row);else union.set(r.frame,r);
 const g=groups.get(r.frame)??[];g.push(k);groups.set(r.frame,g);
}
assert.equal(union.size,1200);const all=[...union.values()].sort((a,b)=>a.frame-b.frame);
assert.deepEqual(m.halfSeconds.frames.map(r=>r.frame),Array.from({length:774},(_,i)=>i*15));
const half=new Set(m.halfSeconds.frames.map(r=>r.frame)),extra=all.filter(r=>!half.has(r.frame));assert.equal(extra.length,426);
for(const r of all)assert.equal(sha(r.file),r.sha256);
fs.mkdirSync(out);const pages=[],frames=[];
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
for(let offset=0;offset<extra.length;offset+=10){
 const rows=extra.slice(offset,offset+10),layers=[],page=pages.length+1;
 for(const[i,r]of rows.entries()){
  const label=`${r.time.toFixed(3)}s f${r.frame} row${r.row} ${r.cue}`;
  layers.push({input:Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="360" height="28"><rect width="360" height="28" fill="white"/><text x="5" y="20" font-family="Hiragino Sans" font-size="15">${esc(label)}</text></svg>`),left:i%5*360,top:Math.floor(i/5)*668});
  layers.push({input:await sharp(r.file).resize(360,640).toBuffer(),left:i%5*360,top:Math.floor(i/5)*668+28});
 }
 const file=out+'/nonhalf-'+String(page).padStart(2,'0')+'.jpg',height=Math.ceil(rows.length/5)*668;
 await sharp({create:{width:1800,height,channels:3,background:'#fff'}}).composite(layers).jpeg({quality:94}).toFile(file);
 const h=sha(file);pages.push({page,file,sha256:h,width:1800,height,cells:rows.length,frames:rows.map(r=>r.frame),actuallyViewed:false});
 rows.forEach((r,i)=>frames.push({...r,sourceManifestGroups:groups.get(r.frame),contactPage:file,contactPageNumber:page,contactCellIndex:i,contactPageSha256:h,actuallyViewed:false}));
}
assert.equal(pages.length,43);assert.equal(frames.length,426);
assert.equal(sha(manifestFile),expectedManifest);assert.equal(sha(m.video),videoSha);for(const r of all)assert.equal(sha(r.file),r.sha256);
const result={id:m.id,sourceManifest:manifestFile,sourceManifestSha256:expectedManifest,video:m.video,videoSha256:videoSha,
 scope:'Exact426-frame disjoint complement of774 half-second actual decoded frames; no new video decode or frame substitution',
 allDecoded1200:all.map(r=>[r.frame,r.sha256]),halfGrid774:m.halfSeconds.frames.map(r=>r.frame),pages,frames,
 exactDisjointComplement:true,allOriginalJpegShaPreserved:true,originalsUnchanged:true,noGPU:true,noNewVideoDecodeOrEncode:true,
 allActuallyViewed:false,earListeningPerformed:false,finalAcceptance:false,generator:fileURLToPath(import.meta.url),generatorSha256:sha(fileURLToPath(import.meta.url))};
fs.writeFileSync(out+'/manifest.json',JSON.stringify(result,null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({out,pages:pages.length,frames:frames.length,manifestSha256:sha(out+'/manifest.json'),actuallyViewed:false}));

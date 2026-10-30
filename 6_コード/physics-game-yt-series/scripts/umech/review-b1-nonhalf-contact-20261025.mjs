// NEW task-private contact sheets from existing exact decoded JPEGs only.
// No MP4 extraction/decode, encode, Blender, original edits or automatic eyes.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import{createHash}from'node:crypto';import{fileURLToPath}from'node:url';import sharp from'sharp';
assert.deepEqual(process.argv.slice(2),['--authorized']);
sharp.concurrency(1);sharp.cache({memory:32,files:10,items:30});
const source='/private/tmp/ys/ys-chain-b1v1-final4-owned-resume-v2-20261025/actual-mp4-review';
const out='/private/tmp/ys/ys-chain-b1v1-final4-nonhalf-contact-20261025';
const manifestFile=source+'/manifest.json',MANIFEST_SHA='e96b832def9cfccc5cb5c67826cdfcd0438d55824289a0adc474b8783af40486';
const VIDEO_SHA='bb88f94903c1191a712c1d81df93fa6e6cd82fdda44b570f5326b3d76db38db9';
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const digest=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n',{flag:'wx'});
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const exists=p=>{try{fs.lstatSync(p);return true;}catch(e){if(e.code==='ENOENT')return false;throw e;}};
assert(!exists(out),'Preserve every previous contact set');assert.equal(sha(manifestFile),MANIFEST_SHA);
const m=JSON.parse(fs.readFileSync(manifestFile));assert.equal(m.videoSha256,VIDEO_SHA);assert.equal(sha(m.video),VIDEO_SHA);
assert.equal(m.uniqueExtracted,1162);assert.equal(m.expectedFrames,10700);assert.equal(m.fps,30);
const union=new Map(),memberships=new Map();
for(const[group,value]of Object.entries(m))if(Array.isArray(value?.frames))for(const r of value.frames){
 assert(Number.isInteger(r.frame)&&r.frame>=0&&r.frame<10700&&r.time===r.frame/30&&/^[a-f0-9]{64}$/.test(r.sha256));
 assert(path.dirname(r.file)===source+'/frames');
 const old=union.get(r.frame);if(old)assert(old.file===r.file&&old.sha256===r.sha256&&old.row===r.row&&old.cue===r.cue,'Same frame must mean same actual decoded JPEG');
 else union.set(r.frame,r);
 const groups=memberships.get(r.frame)??[];groups.push(group);memberships.set(r.frame,groups);
}
assert.equal(union.size,1162);const all=[...union.values()].sort((a,b)=>a.frame-b.frame);
const half=m.halfSeconds.frames;assert.equal(half.length,714);assert.deepEqual(half.map(r=>r.frame),Array.from({length:714},(_,i)=>i*15));
const halfSet=new Set(half.map(r=>r.frame)),nonhalf=all.filter(r=>!halfSet.has(r.frame));assert.equal(nonhalf.length,448);
assert.equal(new Set([...half.map(r=>r.frame),...nonhalf.map(r=>r.frame)]).size,1162);assert(nonhalf.every(r=>r.frame%15!==0));
const actualFiles=fs.readdirSync(source+'/frames').filter(n=>/^shot-\d+\.jpg$/.test(n)).sort();
assert.deepEqual([...new Set(all.map(r=>path.basename(r.file)))].sort(),actualFiles);
const protection={};for(const r of all){
 const s=fs.statSync(r.file,{bigint:true});assert(s.isFile()&&s.size>1000n);assert.equal(sha(r.file),r.sha256);
 protection[r.file]={sha256:r.sha256,size:s.size.toString(),mtimeNs:s.mtimeNs.toString(),realpath:fs.realpathSync(r.file)};
}
fs.mkdirSync(out);const pages=[];const frameRows=[];
for(let offset=0;offset<nonhalf.length;offset+=10){
 const members=nonhalf.slice(offset,offset+10),layers=[],page=pages.length+1;
 for(const[i,r]of members.entries()){
  const label=`${r.time.toFixed(3)}s f${r.frame} row${r.row} ${r.cue}`;
  layers.push({input:Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="360" height="28"><rect width="360" height="28" fill="white"/><text x="5" y="20" font-family="Hiragino Sans" font-size="15">${esc(label)}</text></svg>`),left:i%5*360,top:Math.floor(i/5)*668});
  layers.push({input:await sharp(r.file).resize(360,640).toBuffer(),left:i%5*360,top:Math.floor(i/5)*668+28});
 }
 const file=out+'/nonhalf-'+String(page).padStart(2,'0')+'.jpg',height=Math.ceil(members.length/5)*668;
 await sharp({create:{width:1800,height,channels:3,background:'#fff'}}).composite(layers).jpeg({quality:94}).toFile(file);
 const meta=await sharp(file).metadata();assert(meta.width===1800&&meta.height===height&&height<=1336);
 const pageSHA=sha(file);pages.push({page,file,sha256:pageSHA,width:1800,height,cells:members.length,frames:members.map(r=>r.frame),actuallyViewed:false});
 for(const[i,r]of members.entries())frameRows.push({...r,actuallyViewed:false,sourceManifestGroups:memberships.get(r.frame),contactPage:file,contactPageNumber:page,contactCellIndex:i,contactPageSha256:pageSHA});
 console.log('B1 exact nonhalf contact page',page,members.length,flushCompat());
}
function flushCompat(){return '';}
assert.equal(pages.length,45);assert.equal(frameRows.length,448);
assert.equal(sha(manifestFile),MANIFEST_SHA);assert.equal(sha(m.video),VIDEO_SHA);
for(const[file,before]of Object.entries(protection)){
 const s=fs.statSync(file,{bigint:true});assert.equal(s.size.toString(),before.size);assert.equal(s.mtimeNs.toString(),before.mtimeNs);assert.equal(fs.realpathSync(file),before.realpath);assert.equal(sha(file),before.sha256);
}
const result={id:m.id,scope:'All448 actual decoded unique frames excluded from original714 half-second grid; no new MP4 decoding or synthetic frame substitution',
 createdAt:new Date().toISOString(),sourceManifest:manifestFile,sourceManifestSha256:MANIFEST_SHA,video:m.video,videoSha256:VIDEO_SHA,
 provenanceSha256:m.provenanceSha256,preparedSha256:m.preparedSha256,
 setProof:{allDecodedUnique:1162,halfGrid714:half.map(r=>r.frame),nonHalf448:nonhalf.map(r=>r.frame),
  allOrderedFrameAndJpegSha256Digest:digest(all.map(r=>[r.frame,r.sha256])),halfOrderedFrameAndJpegSha256Digest:digest(half.map(r=>[r.frame,r.sha256])),nonhalfOrderedFrameAndJpegSha256Digest:digest(nonhalf.map(r=>[r.frame,r.sha256])),
  exactDisjointComplement:true,originalFrameFolderExactlyMatches1162UniqueManifestEntries:true,all1162OriginalJpegShaAndStatPreserved:true},
 pages,frames:frameRows,maximumPageDimensions:[1800,1336],tenCellsPerFullPage:true,
 noOriginalFilesModified:true,noNewVideoDecodeOrEncode:true,noGPU:true,allActuallyViewed:false,earListeningPerformed:false,finalAcceptance:false,
 reusePolicy:'Review may be reused for final5 only for byte-exact decoded JPEG SHA matches, not merely unchanged raw sources.',
 generator:fileURLToPath(import.meta.url),generatorSha256:sha(fileURLToPath(import.meta.url))};
write(out+'/manifest.json',result);
console.log(JSON.stringify({out,manifest:out+'/manifest.json',manifestSha256:sha(out+'/manifest.json'),pages:45,cells:448,first15Cells:150,remainingCells:298,allActuallyViewed:false}));

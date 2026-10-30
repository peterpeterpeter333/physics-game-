// CPU-only NEW 30-raw preview using the exact approved c22 layout/compositor.
// Never an encode, render, final delivery, visual approval or DOF-repair claim.
import fs from'node:fs';import path from'node:path';import assert from'node:assert/strict';
import{createHash}from'node:crypto';import{fileURLToPath}from'node:url';import sharp from'sharp';
const W=fileURLToPath(new URL('../../',import.meta.url));
const source='/private/tmp/ys/ys-chain-d1v1-final-complete-v4-resumed-20261025';
const reportFile='/private/tmp/ys/ys-chain-d1v1-four-cue-camera-v8-20261025/probe/report.json';
const out='/private/tmp/ys/ys-chain-d1v1-v8-overlay-preview-20261025',cache=out+'/composition-cache-d1v1';
const read=p=>JSON.parse(fs.readFileSync(p)),sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),hash=s=>createHash('sha256').update(s).digest('hex');
const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,1),{flag:'wx'}),jpg=j=>String(j).padStart(5,'0')+'.jpg';
const exists=p=>{try{fs.lstatSync(p);return true;}catch(e){if(e.code==='ENOENT')return false;throw e;}};
assert(!exists(out),'Never overwrite any preview or earlier QA output');
const pins={
 [reportFile]:'d24e88a38a5164a6c2a7296431161612040b112db8640f68766142dcf5794290',
 [W+'scripts/umech/desk-d1v1-final-layout-frame-20261025.mjs']:'c22ac5086b713141b13a1c9c53c8d412727d8711f32b9556bfe55baeec9012d3',
 [W+'scripts/umech/desk-d1v1-overlay.mjs']:'9e1105b7a0c4a077b9f4a9067a31760882398304460132ecb22b78ab50ad4a2f',
 [W+'scripts/umech/desk-d1v1-review.mjs']:'64a90c763c7ab2afbd621c930aa16378648cbaea04428dacc22e715184cda6b9',
 [W+'scripts/blender/desk_axes_d1_camera_solver_v8_20261025.py']:'85420b61e740d63102703ebf04032c51de46f98022a1660d7c70467845446e11'
};
const verify=()=>{for(const[p,h]of Object.entries(pins))assert.equal(sha(p),h,p);};verify();
const r=read(reportFile);assert.equal(r.mode,'probe');assert.equal(r.actualImages.length,30);
assert(r.allReplacementPhysicalPass===true&&r.allRequestedActuallyRendered===true&&Object.values(r.protectionChecks).every(x=>x===true));
assert.equal(sha(r.anchors),r.anchorsSha256);pins[r.anchors]=r.anchorsSha256;
const anchors=read(r.anchors);assert.equal(anchors.fps,30);assert(Object.values(anchors.anchors).every(a=>a.length===12163));
const canonicalFiles=['plan.json','ys-chain-d1v1.json','phrase-times.json','blender/data.json'];
for(const f of canonicalFiles)pins[source+'/'+f]=sha(source+'/'+f);
for(const f of ['scripts/umech/desk-axes-frame.mjs','scripts/umech/frame-vert.mjs','scripts/umech/desk-frame.mjs','scripts/umech/desk-faces.mjs','scripts/umech/desk-overlay-lib.mjs','scripts/umech/yt1-chain-00bx-common.mjs','docs/video-revision-20260924/ytseries/chain-d-1.mjs'])pins[path.join(W,f)]=sha(path.join(W,f));
for(const im of r.actualImages){assert.equal(sha(im.path),im.sha256);assert.equal(path.basename(im.path),jpg(im.frame));pins[im.path]=im.sha256;}
const self=fileURLToPath(import.meta.url);pins[self]=sha(self);
fs.mkdirSync(cache+'/blender/desk',{recursive:true});fs.mkdirSync(out+'/frames');fs.mkdirSync(out+'/contacts');
const link=(s,d)=>{assert(!exists(d));fs.symlinkSync(path.resolve(s),d);assert.equal(fs.realpathSync(d),fs.realpathSync(s));};
for(const f of canonicalFiles)link(source+'/'+f,cache+'/'+f);
link(r.anchors,cache+'/blender/desk/anchors.json');
for(const im of r.actualImages)link(im.path,cache+'/blender/desk/'+jpg(im.frame));
process.env.EM_FILM_CACHE=cache;delete process.env.DESK_ALLOW_MISSING;
// Import only after the NEW isolated cache prefix is selected. These original
// modules keep anchors/phrase times in process-local caches.
const{vertFrame:original}=await import('./desk-axes-frame.mjs');
const{applyD1FinalLayout,d1LayoutOperations}=await import('./desk-d1v1-final-layout-frame-20261025.mjs');
const base=read(cache+'/plan.json')[0],timed=read(cache+'/ys-chain-d1v1.json');
const clip={...base,duration:timed.duration,scenes:base.scenes.map((s,i)=>({...s,start:timed.scenes[i].start,end:timed.scenes[i].end,captions:timed.scenes[i].captions}))};
assert.equal(clip.id,'ys-chain-d1v1');const clipBefore=JSON.stringify(clip),rows=[];
for(const im of r.actualImages){
 const j=im.frame,t=j/30,s=clip.scenes.find(s=>t>=s.start&&t<s.end)??clip.scenes.at(-1);
 const a=original(clip,s,t),operations=d1LayoutOperations(a,clip,s,t),b=applyD1FinalLayout(a,clip,s,t);
 let inverse=b;for(const op of [...operations].reverse()){assert.equal(inverse.split(op.after).length,2);inverse=inverse.replace(op.after,op.before);}assert.equal(inverse,a);
 const imageTags=svg=>[...svg.matchAll(/<image\b[^>]*\/>/g)].map(m=>m[0]);assert.deepEqual(imageTags(a),imageTags(b));
 const k=Math.max(0,s.captions.findLastIndex(c=>c.start<=t)),q=s.cues[k];
 const file=out+'/frames/'+String(j).padStart(5,'0')+'.png';await sharp(Buffer.from(b)).png().toFile(file);
 rows.push({frame:j,time:t,cue:q.diagram,subtitle:q.subtitle,raw:im.path,rawSha256:im.sha256,pose:im.pose,
  sourceAnchors:r.anchors,sourceAnchorsSha256:r.anchorsSha256,file,sha256:sha(file),sourceSvgSha256:hash(a),layoutSvgSha256:hash(b),
  exactInverseLayout:true,unchangedActualRawImageLayer:true,layoutOperations:operations.map(x=>x.key),
  source:'Actual135 v8 raw plus exact c22 unchanged 2D layout; not an encoded MP4 frame',actuallyViewed:false});
}
const pages=[];
for(let begin=0;begin<rows.length;begin+=6){
 const selected=rows.slice(begin,begin+6),layers=[];
 for(let i=0;i<selected.length;i++){
  const cell=selected[i],x=i%3*360,y=Math.floor(i/3)*668;
  const title=`${cell.frame} | ${cell.time.toFixed(3)}s | ${cell.cue.replace('cd1v1-','')}`;
  const label=Buffer.from(`<svg width="360" height="28" xmlns="http://www.w3.org/2000/svg"><rect width="360" height="28" fill="#111827"/><text x="8" y="19" font-family="monospace" font-size="13" fill="#fff">${title}</text></svg>`);
  layers.push({input:label,left:x,top:y},{input:await sharp(cell.file).resize(360,640).toBuffer(),left:x,top:y+28});
 }
 const file=out+'/contacts/contact-'+String(pages.length+1).padStart(2,'0')+'.jpg';
 await sharp({create:{width:1080,height:1336,channels:3,background:'#111827'}}).composite(layers).jpeg({quality:92}).toFile(file);
 pages.push({file,sha256:sha(file),width:1080,height:1336,frames:selected.map(x=>x.frame),actuallyViewed:false});
}
assert.equal(JSON.stringify(clip),clipBefore);verify();assert.equal(rows.length,30);assert.equal(pages.length,5);
const receipt={episode:'D-1',kind:'Actual v8 raw30 plus original final-layout preview only',helper:self,helperSha256:sha(self),
 sourceReport:reportFile,sourceReportSha256:pins[reportFile],sourceCache:source,privateCompositionCache:cache,
 inputSha256:pins,canonicalClipObjectUnchanged:true,rawJpegsAndAnchorsAreExactSourceSymlinks:true,nearestFrameFallbackDisabled:true,
 originalSharedSourcesNeverEdited:true,sourceAudioAndCaptionsNeverEdited:true,rows,pages,
 knownLimitation:'v8 depth-of-field blur remains visible; v9 camera DOF repair is pending. Layout position/timing is not altered by this preview.',
 noGpu:true,noEncode:true,noVideoDecode:true,allImagesPersonallyViewed:false,earsVerified:false,finalAcceptance:false};
write(out+'/preview-manifest.json',receipt);verify();
console.log(JSON.stringify({out,manifest:out+'/preview-manifest.json',manifestSha256:sha(out+'/preview-manifest.json'),actualRawCompositeCount:rows.length,contactPages:pages.length,noGpu:true,noEncode:true,finalAcceptance:false}));

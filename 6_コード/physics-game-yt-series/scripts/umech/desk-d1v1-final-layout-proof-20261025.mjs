// All planned SVGs are compared; only a few full-size actual-raw composites are
// previewed. This is not a new MP4, final QA receipt, or original-inspector waiver.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const c='/private/tmp/ys/ys-chain-d1v1-final-complete-v4-resumed-20261025';process.env.EM_FILM_CACHE=c;delete process.env.DESK_ALLOW_MISSING;
const out=c+'/final-layout-preview-20261025',read=p=>JSON.parse(fs.readFileSync(p)),hash=v=>createHash('sha256').update(v).digest('hex'),sha=p=>hash(fs.readFileSync(p));
assert(!fs.existsSync(out));
const pins={'scripts/umech/desk-d1v1-overlay.mjs':'9e1105b7a0c4a077b9f4a9067a31760882398304460132ecb22b78ab50ad4a2f','scripts/umech/desk-d1v1-review.mjs':'64a90c763c7ab2afbd621c930aa16378648cbaea04428dacc22e715184cda6b9'};
for(const[p,h]of Object.entries(pins))assert.equal(sha(p),h);
const sources=['scripts/umech/desk-axes-frame.mjs','scripts/umech/frame-vert.mjs','scripts/umech/desk-frame.mjs','scripts/umech/desk-faces.mjs','scripts/umech/desk-overlay-lib.mjs','scripts/umech/desk-d1v1-final-layout-frame-20261025.mjs','scripts/umech/yt1-chain-00bx-common.mjs'];
const inputs={...pins};for(const p of [...sources,c+'/d1-complete-merge.json',c+'/plan.json',c+'/ys-chain-d1v1.json',c+'/phrase-times.json',c+'/blender/data.json',c+'/blender/desk/anchors.json',c+'/blender/desk/meta.json',c+'/blender/delivered-provenance.json',c+'/blender/delivered-camera-poses.json',c+'/ys-chain-d1v1.voice.wav',c+'/ys-chain-d1v1.wav',c+'/out-final-d1v1/ys-chain-d1v1.mp4'])inputs[p]=sha(p);
const {vertFrame:original}=await import('./desk-axes-frame.mjs');
const {applyD1FinalLayout,d1LayoutOperations,D1_FINAL_LAYOUT_REPAIRS:repairs}=await import('./desk-d1v1-final-layout-frame-20261025.mjs');
const base=read(c+'/plan.json')[0],timed=read(c+'/ys-chain-d1v1.json'),clip={...base,duration:timed.duration,scenes:base.scenes.map((s,i)=>({...s,start:timed.scenes[i].start,end:timed.scenes[i].end,captions:timed.scenes[i].captions}))};
const clipBefore=JSON.stringify(clip),nf=Math.ceil(clip.duration*30);assert.equal(nf,12163);
const frames=[],changed=[],bounds=[],previews=[],times=[50.9,54,55.4,84.3,91,93.56666666666666,162,166,167.9],selected=new Set(times.map(t=>Math.round(t*30)));
fs.mkdirSync(out);fs.mkdirSync(out+'/frames');const started=Date.now();
const texts=s=>[...s.matchAll(/<text\b[^>]*>[^<]*<\/text>/g)].map(m=>m[0]);
const images=s=>[...s.matchAll(/<image\b[^>]*\/>/g)].map(m=>m[0]);
for(let j=0;j<nf;j++){
 const t=j/30,s=clip.scenes.find(s=>t>=s.start&&t<s.end)??clip.scenes.at(-1),a=original(clip,s,t),ops=d1LayoutOperations(a,clip,s,t),b=applyD1FinalLayout(a,clip,s,t);
 let restored=b;for(const op of [...ops].reverse()){assert.equal(restored.split(op.after).length,2);restored=restored.replace(op.after,op.before);}assert.equal(restored,a,'Exact inverse SVG bytes '+j);
 assert.deepEqual(texts(b),texts(a),'All glyph layers, captions, font, positions and opacity stay byte-identical '+j);assert.deepEqual(images(b),images(a),'Original actual raw image remains byte-identical '+j);
 if(!ops.length)assert.equal(b,a);else{
  assert.notEqual(b,a);changed.push(j);
  for(const op of ops.filter(op=>op.key!=='piston-leader-start')){
   const rs=[...op.before.matchAll(/<rect\b[^>]*x="([\d.-]+)" y="([\d.-]+)" width="([\d.-]+)" height="([\d.-]+)"/g)].map(m=>[+m[1]+op.repair.translate[0],+m[2]+op.repair.translate[1],+m[1]+op.repair.translate[0]+ +m[3],+m[2]+op.repair.translate[1]+ +m[4]]);
   assert.equal(rs.length,2);assert(rs.every(r=>r[0]>=40&&r[1]>=110&&r[2]<=1044&&r[3]<=1600),'Original safe region for shifted papers '+j);
   if(op.key==='fact-card')assert(rs.every(r=>r[3]<252),'Must clear maximum original small-face top252');
   bounds.push({frame:j,key:op.key,rectangles:rs,font:op.repair.font});assert(op.repair.font>=36);
  }
 }
 frames.push({frame:j,originalSha256:hash(a),derivedSha256:hash(b),changed:!!ops.length,operations:ops.map(o=>o.key)});
 if(selected.has(j)){
  const file=out+'/frames/'+String(j).padStart(5,'0')+'.png';await sharp(Buffer.from(b)).png().toFile(file);
  const raw=c+'/blender/desk/'+String(j).padStart(5,'0')+'.jpg';previews.push({frame:j,time:t,file,sha256:sha(file),raw,rawSha256:sha(raw),operations:ops.map(o=>o.key),source:'Unchanged actually rendered source JPEG + new labels; not decoded from a new MP4',personallyViewed:false});
 }
}
assert.equal(JSON.stringify(clip),clipBefore);assert(previews.length===selected.size);
for(const id of ['ys-chain-b1v1','ys-chain-c1v1','ys-chain-e1v1','ys-chain-1-1v6','ys-chain-1-2v2'])for(const t of [54,91,162,166]){const other={...clip,id},s=clip.scenes.find(s=>t>=s.start&&t<s.end),a=original(other,s,t);assert.equal(applyD1FinalLayout(a,other,s,t),a);}
for(const[p,h]of Object.entries(inputs))assert.equal(sha(p),h,p);
const write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,1),{flag:'wx'});write(out+'/all12163-svg-sha.json',frames);
write(out+'/layout-proof.json',{episode:'D-1',helperSha256:sha(new URL(import.meta.url)),adapterSha256:sha('scripts/umech/desk-d1v1-final-layout-frame-20261025.mjs'),repairs,inputsSha256:inputs,allPlannedSourceFramesCompared:nf,actualEncodedFrames:12162,changedFrames:changed,outsideScopesByteIdenticalFrames:nf-changed.length,exactInverseSourceSvgBytes:true,allTextGlyphLayersByteIdentical:true,allActualImageLayersByteIdentical:true,originalCaptionFaceTimingAndPlanObjectsUnchanged:true,onlyFourPaperTranslationsAndOnePistonLeaderStart:true,otherEpisodeIdsUnchanged:true,allFrameHashFile:out+'/all12163-svg-sha.json',allFrameHashFileSha256:sha(out+'/all12163-svg-sha.json'),geometry:bounds,previews,bottomParticlesBehindUnchangedCaptionDisclosed:true,seconds:(Date.now()-started)/1000,noEncode:true,noGpu:true,allNewCompositesPersonallyViewed:false,finalAcceptance:false,earsVerified:false});
console.log(JSON.stringify({out,all12163Compared:nf,changed:changed.length,previews:previews.length,proofSha256:sha(out+'/layout-proof.json'),noEncode:true,finalAcceptance:false}));

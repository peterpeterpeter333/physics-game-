// CPU-only, read-only companion. Calls ORIGINAL voiceMap/normKana/faceLayer.
// Writes JSON to stdout only; no background frame, picture, audio or file output.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

const W=fileURLToPath(new URL('../../',import.meta.url));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const hash=s=>createHash('sha256').update(s).digest('hex');
const pins={
 'scripts/umech/desk-frame.mjs':'1174d49f123e2dcf614143f617c2483d3086be4b38ff51bfe8d0be721447022f',
 'scripts/umech/yt1-chain-00bx-common.mjs':'0bb9b91aeb294edb19f3ef4ffc686186a4df2768be0090e1dd4713c630aaeb4d',
 'scripts/umech/desk-faces.mjs':'b6fadf280e72c5d2f2aeb77d2285a08d9bdd0cd4554a13a2a9a1a55114eefd3f',
};
function rootOpacities(svg){
 let depth=0;const answer=[];
 for(const m of svg.matchAll(/<\/?g\b[^>]*>/g)){
  if(m[0].startsWith('</')){assert(depth>0,'Unbalanced original face groups');depth--;continue;}
  if(depth===0){const op=/\bopacity="([\d.]+)"/.exec(m[0]);assert(op,'Original face root must declare opacity');answer.push(Number(op[1]));}
  if(!m[0].endsWith('/>'))depth++;
 }
 assert.equal(depth,0,'Unbalanced original face groups');return answer;
}
if(process.argv.includes('--self-test')){
 assert.deepEqual(rootOpacities(''),[]);
 assert.deepEqual(rootOpacities('<g opacity="0.7"><g opacity="0.1"></g></g><g opacity="1"></g>'),[.7,1]);
 console.log(JSON.stringify({selfTest:'PASS',syntheticOnly:true,productionRead:false,imagesViewed:false}));
}else{
 const args=process.argv.slice(2);assert.equal(args.length,2);assert.equal(args[0],'--cache');
 const cache=path.resolve(args[1]);assert.equal(cache,'/private/tmp/ys/ys-chain-e1v1-final-20261024');
 const requested=JSON.parse(fs.readFileSync(0,'utf8'));
 assert(Array.isArray(requested)&&requested.every(j=>Number.isInteger(j)&&j>=0&&j<11606));
 assert.equal(new Set(requested).size,requested.length);
 for(const [p,h]of Object.entries(pins))assert.equal(sha(path.join(W,p)),h,p);
 process.env.EM_FILM_CACHE=cache;
 const {voiceMap,normKana}=await import('./yt1-chain-00bx-common.mjs');
 const {faceLayer}=await import('./desk-frame.mjs');
 const read=p=>JSON.parse(fs.readFileSync(p));
 const plan=read(cache+'/plan.json')[0],audio=read(cache+'/ys-chain-e1v1.json');
 const pt=read(cache+'/phrase-times.json'),data=read(cache+'/blender/data.json');
 const cues=plan.scenes.flatMap((s,i)=>s.cues.map((q,k)=>({q,cap:audio.scenes[i].captions[k]})));
 assert.equal(cues.length,54);assert.equal(data.cues.length,54);
 cues.forEach(({q,cap},i)=>{
  assert.equal(q.diagram,'ce1v1-'+data.cues[i].key);
  assert.equal(cap.start,data.cues[i].start);assert.equal(cap.end,data.cues[i].end);
  assert.deepEqual(q.face??null,data.cues[i].face??null);
  assert(pt[q.subtitle]&&pt[q.subtitle].kana===(q.kana??null),'Exact phrase-times required; no estimated voiceMap fallback');
 });
 const evidence=requested.map(j=>{
  const t=j/30,{q,cap}=cues.findLast(c=>c.cap.start<=t)??cues[0];
  const fc=q.face?{...q.face}:null;
  let wordTiming=null;
  if(fc?.at){
   const m=voiceMap({cue:q,t:0,dur:cap.end-cap.start}),canonical=pt[q.subtitle];
   assert.deepEqual(m,canonical,'voiceMap must return the supplied exact phrase-times object');
   const nk=normKana(fc.at),i=m.s.indexOf(nk);assert(i>=0,'Original face.at word absent');
   assert(Number.isFinite(m.t[i]));fc.atT=m.t[i];
   wordTiming={word:fc.at,normalizedWord:nk,index:i,cueRelativeTime:fc.atT,absoluteTime:cap.start+fc.atT,
    phraseTimesLookup:q.subtitle,exactOriginalVoiceMap:true,estimatedFallbackUsed:false};
  }
  const svg=faceLayer(fc,t,cap.start,cap.end,q),opacities=rootOpacities(svg);
  const fullFace=!!fc&&!fc.small;
  return{frame:j,time:t,cue:q.diagram.slice('ce1v1-'.length),canonicalFace:q.face??null,
   wordTiming,exactOriginalFaceLayer:true,originalFaceSvgSha256:hash(svg),rootGroupOpacities:opacities,
   anyVisibleFullScreenFace:fullFace&&opacities.some(v=>v>0),
   fullyOpaqueFullScreenFace:fullFace&&opacities.some(v=>v===1),
   anyVisibleSmallFace:!!fc?.small&&opacities.some(v=>v>0),
   underlying3DVisibilityCertified:false,actualCompositeEyeReviewRequired:true,actuallyViewed:false};
 });
 for(const[p,h]of Object.entries(pins))assert.equal(sha(path.join(W,p)),h,p);
 console.log(JSON.stringify({id:'ys-chain-e1v1',method:'Original exact phrase-times voiceMap/normKana and original faceLayer SVG root opacities; not an image or occlusion audit',
  helperSha256:sha(fileURLToPath(import.meta.url)),originalSourceSha256:pins,
  phraseTimesSha256:sha(cache+'/phrase-times.json'),samples:evidence,
  sourceUnchanged:true,imagesRendered:0,imagesViewed:0,finalAcceptance:false}));
}

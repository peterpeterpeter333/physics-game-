// Root-only actual final5 MP4 review. Original B reviewer/inspectors unchanged.
// Only cache and seven exact carry checkpoints differ; no endpoint fallback.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import{createHash}from'node:crypto';import{fileURLToPath}from'node:url';import{registerHooks}from'node:module';
const cache='/private/tmp/ys/ys-chain-b1v1-final5-carry-20261025',nf=10700,fps=30;
const args=process.argv.slice(2),plain=args.filter(a=>!a.startsWith('--'));
assert(args.includes('--authorized')&&plain.length===2&&args.every(a=>!a.startsWith('--')||['--authorized','--all-patch-sources'].includes(a)));
const [video,out]=plain.map(p=>path.resolve(p));assert.equal(path.dirname(out),cache);assert(!fs.existsSync(out));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),hash=s=>createHash('sha256').update(s).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
const original=new URL('./review-desk-b1v1-delivery-b6-20261024.mjs',import.meta.url),originalPin='20f2056524b1c80e61e6372fcc42308f3c53eb04a1e411a45d286c16dd127f5b';
assert.equal(sha(original),originalPin);const source=fs.readFileSync(original,'utf8');
const pp=read(cache+'/prepared.json'),exp=read(cache+'/export.json'),provenance=read(cache+'/composite-provenance.json');
assert.equal(exp.video,video);assert.equal(sha(video),exp.sha256);assert.equal(exp.preparedSha256,sha(cache+'/prepared.json'));assert.equal(exp.frames,nf);assert.equal(pp.frames,nf);assert.equal(provenance.records.length,nf);
for(const[p,h]of Object.entries(pp.protectedInputSha256))assert.equal(sha(p),h,p);
for(const[n,h]of Object.entries(pp.outputHashes))assert.equal(sha(cache+'/'+n),h,n);
const inputs=Object.fromEntries([fileURLToPath(original),fileURLToPath(import.meta.url),video,...['prepared.json','export.json','composite-provenance.json','final-held-dimensions.json','blender/data.json','blender/delivered-camera-poses.json'].map(n=>cache+'/'+n)].map(p=>[p,sha(p)]));
const verify=()=>{for(const[p,h]of Object.entries(inputs))assert.equal(sha(p),h,p);};
// Exact actual video-track sample count is mandatory. Never clamp or substitute
// a missing source/end frame; the original reviewer also extracts actual10699.
const bytes=fs.readFileSync(video);
function boxes(a,b){const r=[];while(a<b){assert(a+8<=b);let n=bytes.readUInt32BE(a),h=8;const type=bytes.toString('ascii',a+4,a+8);if(n===1){assert(a+16<=b);const big=bytes.readBigUInt64BE(a+8);assert(big<=BigInt(Number.MAX_SAFE_INTEGER));n=Number(big);h=16;}if(n===0)n=b-a;assert(n>=h&&a+n<=b);r.push({type,payload:a+h,end:a+n});a+=n;}assert.equal(a,b);return r;}
const child=(b,n)=>{const a=boxes(b.payload,b.end).filter(x=>x.type===n);assert.equal(a.length,1);return a[0];};
const moov=boxes(0,bytes.length).filter(x=>x.type==='moov');assert.equal(moov.length,1);
const track=boxes(moov[0].payload,moov[0].end).filter(x=>x.type==='trak').filter(x=>{const h=child(child(x,'mdia'),'hdlr');return bytes.toString('ascii',h.payload+8,h.payload+12)==='vide';});assert.equal(track.length,1);
const mdia=child(track[0],'mdia'),stbl=child(child(mdia,'minf'),'stbl'),stsz=child(stbl,'stsz'),stts=child(stbl,'stts'),mdhd=child(mdia,'mdhd');
assert.equal(bytes.readUInt32BE(stsz.payload+8),nf,'Exact10700 actual frames required; no fallback');
const version=bytes[mdhd.payload];assert([0,1].includes(version));const timescale=bytes.readUInt32BE(mdhd.payload+(version===1?20:12));assert(timescale>0);
const count=bytes.readUInt32BE(stts.payload+4);assert(stts.payload+8+count*8<=stts.end);let timed=0;
for(let i=0;i<count;i++){const p=stts.payload+8+i*8,n=bytes.readUInt32BE(p),delta=bytes.readUInt32BE(p+4);assert(n>0&&delta>0&&BigInt(delta)*30n===BigInt(timescale));timed+=n;}assert.equal(timed,nf);
const cacheBefore="const cache='/private/tmp/ys/ys-chain-b1v1-final4-20261024',fps=30,nf=10700;",cacheAfter=`const cache='${cache}',fps=30,nf=10700;`;
const correctedBefore='const corrected=[1.5,5,46.5',extraFrames=[4123,4124,4125,4128,4134,4140,4141];
const correctedAfter='const corrected=['+extraFrames.map(j=>String(j/fps)).join(',')+',1.5,5,46.5';
const targetsBefore='const targets=unique([...half,...seconds,...ends,...major,...bookends,...moves,...corrected,...(allPatch?added:[])]);';
const guardKey='physics-quest-B1-final5-review-20261025',targetsAfter=targetsBefore+`\nglobalThis[Symbol.for('${guardKey}')]({half,seconds,ends,major,bookends,moves,corrected,targets,allPatch,added});`;
for(const needle of[cacheBefore,correctedBefore,targetsBefore])assert.equal(source.split(needle).length,2);
const adapted=source.replace(cacheBefore,cacheAfter).replace(correctedBefore,correctedAfter).replace(targetsBefore,targetsAfter);
assert.equal(adapted.replace(cacheAfter,cacheBefore).replace(correctedAfter,correctedBefore).replace(targetsAfter,targetsBefore),source);
const unique=a=>[...new Set(a)].sort((a,b)=>a-b),live=read('/private/tmp/ys/ys-chain-b1v1-retained-plan-20261024.json');assert.equal(live.CUES.length,50);
let selection=null;assert(!Object.hasOwn(globalThis,Symbol.for(guardKey)));
globalThis[Symbol.for(guardKey)]=s=>{
 assert.equal(selection,null);assert.deepEqual(s.half,Array.from({length:714},(_,i)=>i*15));assert.deepEqual(s.seconds,Array.from({length:357},(_,i)=>i*30));
 assert.deepEqual(s.ends,live.CUES.map(c=>Math.min(nf-1,Math.ceil(c.end*fps-1e-7)-1)));assert.equal(s.ends.length,50);assert.equal(s.major.length,12);
 assert(extraFrames.every(j=>s.corrected.includes(j)));assert.deepEqual(s.targets,unique([...s.half,...s.seconds,...s.ends,...s.major,...s.bookends,...s.moves,...s.corrected,...(s.allPatch?s.added:[])]));
 assert(s.targets.every(j=>Number.isInteger(j)&&j>=0&&j<nf));selection=s;
};
registerHooks({load(url,context,nextLoad){if(url!==original.href)return nextLoad(url,context);assert.equal(sha(original),originalPin);return{format:'module',source:adapted,shortCircuit:true};}});
try{await import(original.href);}finally{delete globalThis[Symbol.for(guardKey)];}
assert(selection);verify();const manifestFile=out+'/manifest.json',m=read(manifestFile),indices=new Set(selection.targets);
assert.equal(m.videoSha256,exp.sha256);assert.equal(m.expectedFrames,nf);assert.equal(m.uniqueExtracted,indices.size);assert.equal(m.halfSeconds.frames.length,714);assert.equal(m.cueEnds.frames.length,50);assert.equal(m.major.frames.length,12);assert.equal(m.major.comparisons.length,12);
assert.deepEqual(m.halfSeconds.frames.map(r=>r.frame),selection.half);assert.deepEqual(m.cueEnds.frames.map(r=>r.frame),selection.ends);
assert(extraFrames.every(j=>m.cameraAndVisualCorrections.frames.some(r=>r.frame===j)));assert(m.bookends.frames.some(r=>r.frame===10699));
assert.equal(m.allActuallyViewed,false);assert.equal(m.earListeningPerformed,false);assert.equal(m.finalPassed,false);
fs.writeFileSync(out+'/final5-carry-review-provenance.json',JSON.stringify({id:'ys-chain-b1v1',cache,video,videoSha256:exp.sha256,actualVideoFrames:nf,actualStszAndSttsCountsAgree:true,exact30fps:true,
 originalReviewer:fileURLToPath(original),originalReviewerSha256:originalPin,privateWrapper:fileURLToPath(import.meta.url),privateWrapperSha256:sha(new URL(import.meta.url)),
 inMemorySourceSha256:hash(adapted),inverseIsByteExactOriginal:true,onlyDeclaredChanges:['Fresh final5 cache path','Seven exactcarry checkpoints','Assertion-only scope guard'],
 importantCarryFrames:extraFrames,importantCarryTimes:extraFrames.map(j=>j/fps),original714HalfSecondsAnd50CueEndsAnd12ReferencesPreserved:true,
 endpointRemapped:false,rawImageSubstitution:false,reencodePerformed:false,originalGenericScopeLabelIsInheritedMetadata:true,
 manifest:manifestFile,manifestSha256:sha(manifestFile),protectedInputsSha256:inputs,allActuallyViewed:false,earsVerified:false,originalGateNGPreserved:true,finalAcceptance:false},null,1)+'\n',{flag:'wx'});

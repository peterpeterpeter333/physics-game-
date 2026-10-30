// D-1 final-encoded review: every integer second, no substituted backgrounds.
import {readFileSync,readdirSync,existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const cache=process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-d1v1-render';
const out=process.env.D1_REVIEW_OUT??cache+'/review-1sec-d1v1',frames=out+'/frames-d1v1',refs=out+'/reference-frames-d1v1';
const ff=process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
const mp4=process.env.D1_REVIEW_MP4??cache+'/out-final-d1v1/ys-chain-d1v1.mp4',ref='/private/tmp/ys/ys-chain-1-1v6/out/ys-chain-1-1v6.mp4';
if(!existsSync(mp4))throw Error('Final D1 MP4 missing');
const d=JSON.parse(readFileSync(cache+'/blender/data.json'));
if(existsSync(out))throw Error('Existing D1 final review preserved; choose a fresh D1_REVIEW_OUT');
for(const dir of [out,frames,refs])mkdirSync(dir,{recursive:true});
const requested=new Map(),nf=Math.ceil(d.duration*30);
const add=(t,reason)=>{const j=Math.max(0,Math.min(nf-1,Math.round(t*30)));if(!requested.has(j))requested.set(j,[]);requested.get(j).push(reason);};
for(let t=0;t<Math.ceil(d.duration);t++)add(t,'integer-second');
for(const c of d.cues)add(c.end-.06,'cue-end:'+c.key);
for(const t of d.landmarks)add(t,'main12');
const motion=JSON.parse(readFileSync(cache+'/blender/camera-motion.json'));
for(const [a,b]of motion.moving_spans)add((a+b)/2,'camera-move-middle');
const audit=process.env.D1_FINAL_AUDIT??cache+'/d1-source-audit-r8-finalfreeze.json';
if(existsSync(audit))for(const t of JSON.parse(readFileSync(audit)).trialSeconds)add(t,'r6-semantic-fix');
for(const t of [34.216667,35.24,118.8,121.483667,122.583667,124.3,125.975667,126.084,126.17,133.287333,133.570667,133.870667,134.462667,140.5,169.8,172.3,333.2,339.7])add(t,'final-r15-important-state');
const supplement=process.env.D1_SUPPLEMENT_REQUEST;
if(supplement){const request=JSON.parse(readFileSync(supplement));if(request.episode!=='D-1'||request.automaticApproval!==false)throw Error('D1 evidence requests only');for(const r of request.requests)add(r.time,'supplement-candidate:'+r.reasons.join('/'));}
const indices=[...requested.keys()].sort((a,b)=>a-b);
const own=spawnSync(ff,['-v','error','-i',mp4,'-vf','select='+indices.map(j=>`eq(n\\,${j})`).join('+'),'-fps_mode','passthrough','-q:v','2',frames+'/d1v1-frame-%04d.jpg'],{encoding:'utf8',maxBuffer:1e7});if(own.status)throw Error(own.stderr);
const reference=spawnSync(ff,['-v','error','-i',ref,'-vf','select=not(mod(n\\,30)),scale=360:640','-fps_mode','passthrough','-q:v','2',refs+'/d1v1-frame-%04d.jpg'],{encoding:'utf8',maxBuffer:1e7});if(reference.status)throw Error(reference.stderr);
const files=readdirSync(frames).filter(f=>f.endsWith('.jpg')).sort(),rf=readdirSync(refs).filter(f=>f.endsWith('.jpg')).sort();
if(files.length!==indices.length||!rf.length)throw Error('Incomplete final D1 review');
const manifest=[],pages=[];
const header=(s)=>Buffer.from(`<svg width="360" height="22"><rect width="360" height="22" fill="white"/><text x="8" y="17" font-family="Hiragino Sans" font-size="15" fill="#241c15">${s}</text></svg>`);
for(let start=0;start<files.length;start+=10){
 const own=[],compare=[];
 for(let offset=0;offset<10&&start+offset<files.length;offset++){
  const j=start+offset,t=indices[j]/30,c=d.cues.find(c=>c.start<=t&&t<c.end)??d.cues.findLast(c=>c.start<=t)??d.cues[0];
  const landmark=d.landmarks.findIndex(v=>Math.round(v*30)===indices[j]);
  const matchedReference=[7,13,25,268,20,94,95,337,418,364,431,488][landmark];
  const rj=Math.min(rf.length-1,matchedReference??Math.round(t/d.duration*(rf.length-1)));
  const here=await sharp({create:{width:360,height:662,channels:3,background:'#fff'}}).composite([{input:header(`D-1 ${t.toFixed(2)}秒　${c.key}`),left:0,top:0},{input:await sharp(frames+'/'+files[j]).resize(360,640).toBuffer(),left:0,top:22}]).jpeg({quality:92}).toBuffer();
  const there=await sharp({create:{width:360,height:662,channels:3,background:'#fff'}}).composite([{input:header(`見本1-1 第6版 ${rj}秒`),left:0,top:0},{input:await sharp(refs+'/'+rf[rj]).toBuffer(),left:0,top:22}]).jpeg({quality:92}).toBuffer();
  own.push({input:here,left:offset%5*360,top:Math.floor(offset/5)*662});compare.push({input:there,left:offset%5*360+1800,top:Math.floor(offset/5)*662});
  manifest.push({time:t,frameIndex:indices[j],reasons:requested.get(indices[j]),cue:c.key,row:c.row,subtitle:c.subtitle,referenceTime:rj,file:files[j],fileSha256:createHash('sha256').update(readFileSync(frames+'/'+files[j])).digest('hex'),raw3D:cache+'/blender/desk/'+String(indices[j]).padStart(5,'0')+'.jpg'});
 }
 const name='d1v1-sheet-'+String(Math.floor(start/10)+1).padStart(2,'0')+'.jpg';
 await sharp({create:{width:1800,height:1324,channels:3,background:'#fff'}}).composite(own).jpeg({quality:92}).toFile(out+'/'+name);
 await sharp({create:{width:3600,height:1324,channels:3,background:'#fff'}}).composite([...own,...compare]).jpeg({quality:92}).toFile(out+'/compare-'+name);pages.push(name);
}
const sha=f=>createHash('sha256').update(readFileSync(f)).digest('hex');
const record={episode:'D-1',mp4,mp4Sha256:sha(mp4),reference:ref,referenceSha256:sha(ref),status:'extracted only; actual visual review pending; supplementary candidates are not approved automatically',integerSeconds:manifest.filter(f=>f.reasons.includes('integer-second')).length,cueEnds:manifest.filter(f=>f.reasons.some(r=>r.startsWith('cue-end:'))).length,supplementRequests:supplement??null,supplementCandidates:manifest.filter(f=>f.reasons.some(r=>r.startsWith('supplement-candidate:'))).length,selectedFrames:files.length,pages,pageSha256:Object.fromEntries(pages.map(p=>[p,sha(out+'/'+p)])),frames:manifest};
if(record.integerSeconds!==Math.ceil(d.duration)||record.cueEnds!==d.cues.length)throw Error('Final D1 one-second or cue-end coverage incomplete');
writeFileSync(out+'/d1v1-review-manifest.json',JSON.stringify(record,null,1));
console.log(JSON.stringify({out,integerSeconds:record.integerSeconds,cueEnds:record.cueEnds,selectedFrames:files.length,pages:pages.length,source:mp4,review:record.status},null,1));

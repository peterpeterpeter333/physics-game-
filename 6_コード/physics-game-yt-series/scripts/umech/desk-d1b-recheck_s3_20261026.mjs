// S3 recheck stills only. Does not render Blender, change sources, or start a movie.
// --prepare: create the exact-frame union; --compare: use already-composed images.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import sharp from 'sharp';

const W=path.resolve(new URL('../..',import.meta.url).pathname);
const CACHE='/private/tmp/ys/ys-chain-d1b_s3_gpt_20261026';
const ROOT=path.join(CACHE,'s2review');
const args=process.argv.slice(2),vi=args.indexOf('--version'),V=vi<0?'2':args[vi+1];
assert.ok(/^\d+$/.test(V));
const oldFile=path.join(W,'outputs/ys-chain-d1b-backup/S2_20261026/D-1後編_S2_全104枚の対照表_20261026.json');
const correctionFile=path.join(W,'outputs/ys-chain-d1b-backup/S3_20261026/claude-correction-checklist.json');
const planFile=path.join(ROOT,V==='2'?'recheck-plan.json':`recheck-plan${V}.json`);
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const old=JSON.parse(fs.readFileSync(oldFile,'utf8'));
const correction=JSON.parse(fs.readFileSync(correctionFile,'utf8'));
assert.equal(process.env.EM_FILM_CACHE??CACHE,CACHE,'S3 cache only');
assert.equal(old.frames.length,104);
assert.equal(correction.correctionActions.length,56);

function prepare(){
 assert.equal(fs.existsSync(planFile),false,'Preserve the previous plan');
 const by=new Map(),selectedKinds=new Set(['標準0.8秒後','指定カメラ到着','動作完了後の予定確認','0.8秒到着','光った後/戻り前の予算確認','最後の全景']);
 function add(frame,ref){
  assert.ok(Number.isInteger(frame)&&frame>=0&&frame<14813);
  if(!by.has(frame))by.set(frame,{frame,time:frame/30,image:path.join(ROOT,`recheck${V}`,String(frame).padStart(5,'0')+'.jpg'),composedImage:path.join(ROOT,`composite${V}`,String(frame).padStart(5,'0')+'.jpg'),references:[]});
  by.get(frame).references.push(ref);
 }
 for(const f of old.frames){
  assert.equal(f.frame,Math.round(f.time*30),'Original S2 frame/time mismatch');
  assert.ok(fs.existsSync(f.composedImage),'Missing original S2 composite: '+f.composedImage);
  add(f.frame,{kind:'originalS2',sampleid:f.sampleid,row:f.row,cue:f.cue,oldComposedImage:f.composedImage});
 }
 const actions=[];
 for(const a of correction.correctionActions){
  const samples=a.sampling.filter(s=>selectedKinds.has(s.kind));
  assert.ok(samples.length>0,'No settle/completion sample: '+a.id);
  actions.push({id:a.id,row:a.row,cue:a.cue,selectedSamples:samples.length});
  for(const s of samples){
   assert.equal(s.frame,Math.round(s.secondsAt30fps*30),'Provided correction sample is not on its frame');
   add(s.frame,{kind:'correction',id:a.id,row:a.row,cue:a.cue,probe:s.kind,word:a.word??null,triggerSeconds:a.triggerSeconds,plannedSeconds:s.plannedSeconds??s.secondsAt30fps,withinCue:s.withinCue??null,completionIsOnlyPlannedProbe:/完了|予算/.test(s.kind)});
  }
 }
 for(const g of correction.goodShotsToCompareWithoutRebuilding){
  assert.equal(g.samples.length,g.sampleids.length);
  for(let i=0;i<g.samples.length;i++)add(Math.round(g.samples[i]*30),{kind:'goodShot',sampleid:g.sampleids[i],rows:g.rows,cues:g.cues,keep:g.keep});
 }
 for(const t of [0,.4,.8,247.9])add(Math.round(t*30),{kind:'explicit',requestedSeconds:t});
 const samples=[...by.values()].sort((a,b)=>a.frame-b.frame);
 const plan={schema:'d1b-s3-recheck-1',stage:'S3 candidate still recheck, not approved',fps:30,resolution:[540,960],sourceFiles:{oldFile,correctionFile},paths:{raw:path.join(ROOT,`recheck${V}`),composite:path.join(ROOT,`composite${V}`),comparisons:path.join(ROOT,`comparison${V}`)},old104:old.frames.map(f=>({sampleid:f.sampleid,row:f.row,cue:f.cue,time:f.time,frame:f.frame,oldComposedImage:f.composedImage,newComposedImage:path.join(ROOT,`composite${V}`,String(f.frame).padStart(5,'0')+'.jpg')})),correctionActions:actions,selectionPolicy:'All104 original frame numbers unchanged; correction0.8s/arrival/planned-completion probes including final light/full-view; goodShots;0/.4/.8/247.9. Deduplicate by exact30fps frame.',limitations:['Planned completion samples do not prove actual action completion. If unfinished, add a later actual-completion probe separately.','No Blender rendering, composites, visual review, or approval is performed by prepare.'],samples,times:samples.map(s=>s.time).join(',')};
 fs.mkdirSync(ROOT,{recursive:true});
 fs.writeFileSync(planFile,JSON.stringify(plan,null,1)+'\n',{flag:'wx'});
 console.log(JSON.stringify({plan:planFile,uniqueFrames:samples.length,originalPairs:104,correctionActions:actions.length,raw:plan.paths.raw,composite:plan.paths.composite,times:plan.times}));
}

async function compare(){
 const p=JSON.parse(fs.readFileSync(planFile,'utf8'));
 assert.equal(p.old104.length,104);assert.equal(p.fps,30);
 const out=p.paths.comparisons,report=path.join(out,'comparisons.json');
 assert.equal(fs.existsSync(out),false,'Preserve previous comparison artifacts');
 // Check every input before creating any page. No neighbouring-frame fallback.
 for(const f of p.old104){
  assert.equal(f.newComposedImage,path.join(p.paths.composite,String(f.frame).padStart(5,'0')+'.jpg'));
  for(const file of [f.oldComposedImage,f.newComposedImage]){assert.ok(fs.existsSync(file),'Missing exact composite: '+file);const m=await sharp(file).metadata();assert.equal(m.width,540,file);assert.equal(m.height,960,file);}
 }
 fs.mkdirSync(out,{recursive:true});
 const pairs=[],pages=[],rowH=1014,pageHead=58;
 for(let i=0;i<p.old104.length;i++){
  const f=p.old104[i],label=`${String(i+1).padStart(3,'0')}/104  行${f.row}  ${f.cue}  ${f.time.toFixed(3)}秒 / frame ${f.frame}  ${f.sampleid}`;
  const title=Buffer.from(`<svg width="1080" height="54" xmlns="http://www.w3.org/2000/svg"><rect width="1080" height="54" fill="#131c2d"/><g font-family="sans-serif" fill="#ffffff" font-size="20"><text x="12" y="23">${esc(label)}</text><text x="200" y="47">旧S2（同じ時刻）</text><text x="735" y="47">新S3候補（同じ時刻）</text></g></svg>`);
  const image=path.join(out,`pair-${String(i+1).padStart(3,'0')}.jpg`);
  await sharp({create:{width:1080,height:rowH,channels:3,background:'#0b1122'}}).composite([{input:title,left:0,top:0},{input:f.oldComposedImage,left:0,top:54},{input:f.newComposedImage,left:540,top:54}]).jpeg({quality:94}).toFile(image);
  pairs.push({...f,image});
 }
 for(let i=0;i<pairs.length;i+=5){
  const subset=pairs.slice(i,i+5),index=pages.length+1,h=pageHead+subset.length*rowH;
  const header=Buffer.from(`<svg width="1080" height="58" xmlns="http://www.w3.org/2000/svg"><rect width="1080" height="58" fill="#20314b"/><text x="15" y="36" font-family="sans-serif" font-size="26" fill="white">D-1 後編 S2 → S3 同時刻比較　${index}/21</text></svg>`);
  const image=path.join(out,`page-${String(index).padStart(2,'0')}.jpg`);
  await sharp({create:{width:1080,height:h,channels:3,background:'#0b1122'}}).composite([{input:header,left:0,top:0},...subset.map((f,k)=>({input:f.image,left:0,top:pageHead+k*rowH}))]).jpeg({quality:94}).toFile(image);
  pages.push({image,pairs:subset.map(f=>f.sampleid),size:[1080,h]});
 }
 const result={stage:'Exact-frame before/after comparisons only',plan:planFile,pairs,pages,visualReviewPerformed:false,movieStarted:false};
 fs.writeFileSync(report,JSON.stringify(result,null,1)+'\n',{flag:'wx'});
 console.log(JSON.stringify({report,pairs:pairs.length,pages:pages.length,width:1080,visualReviewPerformed:false}));
}
assert.ok(args.length===(vi<0?1:3),'Use --prepare or --compare [--version N]');
if(args[0]==='--prepare')prepare();else if(args[0]==='--compare')await compare();else throw Error('Use --prepare or --compare');

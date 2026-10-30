// S2 only (syntax checked): current B composition, half-size clean stills, no movie export.
// node THIS --manifest <parent-runner manifest.json> [--output <new storyboard dir>]
// Manifest: {episode:'d1b',cache:...,resolution:[540,960],samples:4,
// frames:[{sampleid,row,cue,time,frame,image,sourceWordTime?}]}.
// time is the actual 30fps frame/30; anchors.json uses logical1080x1920 pixels.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import sharp from 'sharp';

const W=path.resolve(new URL('../..',import.meta.url).pathname);
const CACHE='/private/tmp/ys/ys-chain-d1b_s2_gpt_20261026',ID='ys-chain-d1b';
const args=process.argv.slice(2),opt=k=>{const i=args.indexOf(k);return i<0?undefined:args[i+1];};
const manifestArg=opt('--manifest');assert.ok(manifestArg,'--manifest <runner manifest.json> is required');
const manifestPath=path.resolve(manifestArg),manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
assert.equal(manifest.episode,'d1b');assert.equal(path.resolve(manifest.cache),CACHE);
assert.deepEqual(manifest.resolution,[540,960]);assert.equal(manifest.samples,4);
assert.ok(Array.isArray(manifest.frames)&&manifest.frames.length>0);
assert.notEqual(process.env.DESK_ALLOW_MISSING,'1','Nearby raw fallback is forbidden even for S2');
const realCache=fs.realpathSync(CACHE),rawDir=path.join(realCache,'blender/desk');
assert.equal(fs.lstatSync(CACHE).isSymbolicLink(),false,'The new S2 cache must not alias a production cache');
const out=path.resolve(opt('--output')??path.join(CACHE,'storyboard'));
assert.ok(out===path.join(CACHE,'storyboard')||out.startsWith(path.join(CACHE,'storyboard')+path.sep),'Output must remain inside this S2 storyboard directory');
for(let dir=out;dir!==CACHE;dir=path.dirname(dir))if(fs.existsSync(dir))assert.equal(fs.lstatSync(dir).isSymbolicLink(),false,'Do not write storyboard output through a symlink');
function readInput(name){const file=path.join(CACHE,name);assert.equal(fs.lstatSync(file).isSymbolicLink(),false,'S2 inputs must be real copies, not production-cache links: '+name);return JSON.parse(fs.readFileSync(file,'utf8'));}
const plan=readInput('plan.json'),timed=readInput(ID+'.json'),data=readInput('blender/data.json');readInput('phrase-times.json');
const anchors=readInput('blender/desk/anchors.json'),nf=Math.ceil(timed.duration*30);
assert.equal(timed.id,ID);assert.equal(data.episode,'d1b');assert.equal(anchors.fps,30);assert.equal(anchors.frames,nf);assert.ok(Object.keys(anchors.anchors??{}).length>0);
for(const values of Object.values(anchors.anchors))assert.equal(values.length,nf,'S2 anchors must retain full frame-index address space');
const entry=plan.find(p=>p.id===ID);assert.ok(entry);
const clip={...timed,...entry,duration:timed.duration,scenes:entry.scenes.map((s,j)=>({...s,start:timed.scenes[j].start,end:timed.scenes[j].end,captions:timed.scenes[j].captions})),animationFPS:30,mediaDirectory:entry.mediaDirectory??'lessons'};
const suppliedCues=clip.scenes.flatMap(s=>s.cues.map(q=>q.diagram.replace(/^cd1b-/,'')));
assert.equal(suppliedCues.length,63);
const ids=new Set(),frameTimes=new Map(),targets=[];
for(const sample of manifest.frames){
 const {sampleid,row,time,frame}=sample,cue=String(sample.cue).replace(/^cd1b-/,'');
 assert.ok(typeof sampleid==='string'&&/^[A-Za-z0-9][A-Za-z0-9_.-]*$/.test(sampleid),'sampleid must be a safe unique filename stem');assert.ok(!ids.has(sampleid),'Duplicate sampleid: '+sampleid);ids.add(sampleid);
 assert.ok(Number.isInteger(row)&&row>=1&&row<=48);assert.ok(Number.isInteger(frame)&&frame>=0&&frame<nf);
 assert.ok(Number.isFinite(time)&&Math.abs(time-frame/30)<1e-7,'S2 sample.time must equal the actual rendered frame/30');
 assert.ok(suppliedCues.includes(cue),'Unknown supplied cue: '+cue);
 assert.equal(data.cues.find(c=>c.key===cue)?.row,row,'Declared row does not match supplied cue data');
 const raw=path.resolve(sample.image),expected=path.join(rawDir,String(frame).padStart(5,'0')+'.jpg');
 assert.equal(fs.realpathSync(raw),expected,'Only the exact new S2 raw frame may be used');assert.equal(fs.lstatSync(raw).isSymbolicLink(),false,'S2 raw must not be a production-cache link');
 const meta=await sharp(raw).metadata();assert.equal(meta.width,540);assert.equal(meta.height,960);
 if(frameTimes.has(frame))assert.equal(frameTimes.get(frame),time,'One raw filename cannot represent two different render times');frameTimes.set(frame,time);
 for(const values of Object.values(anchors.anchors)){const p=values[frame];assert.ok(Array.isArray(p)&&p.length===3&&p.every(v=>typeof v==='boolean'||(typeof v==='number'&&Number.isFinite(v))),'Missing/invalid logical anchor at frame '+frame);}
 const scene=clip.scenes.find(s=>time>=s.start&&time<s.end)??clip.scenes.at(-1),k=Math.max(0,scene.captions.findLastIndex(c=>c.start<=time));
 assert.equal(scene.cues[k].diagram,'cd1b-'+cue,'Actual displayed cue differs from the manifest');
 targets.push({sampleid,row,cue,time,frame,raw,sourceWordTime:sample.sourceWordTime??null,image:path.join(out,'frames',sampleid+'.jpg')});
}
assert.deepEqual([...new Set(targets.map(t=>t.cue))].sort(),[...new Set(suppliedCues)].sort(),'S2 must include all63 cues, including full-screen faces');
const pages=Math.ceil(targets.length/10),pageFiles=Array.from({length:pages},(_,i)=>path.join(out,'page-'+String(i+1).padStart(2,'0')+'.jpg'));
const metadataFile=path.join(out,'storyboard_gpt_20261026.json');
for(const file of [...targets.map(t=>t.image),...pageFiles,metadataFile])assert.equal(fs.existsSync(file),false,'Preserve existing S2 output; choose a fresh --output directory: '+file);
fs.mkdirSync(path.join(out,'frames'),{recursive:true});
process.env.EM_FILM_CACHE=CACHE;delete process.env.DESK_ALLOW_MISSING;
await import(pathToFileURL(path.join(W,'scripts/umech/desk-d1b-hooks_gpt_20261026.mjs')));
const {vertFrame}=await import(pathToFileURL(path.join(W,'scripts/umech/frame-vert.mjs')));
for(const t of targets){
 const scene=clip.scenes.find(s=>t.time>=s.start&&t.time<s.end)??clip.scenes.at(-1),svg=vertFrame(clip,scene,t.time);
 assert.ok(svg&&!/NaN|undefined|Infinity/.test(svg),'Invalid current production SVG at '+t.sampleid);
 await sharp(Buffer.from(svg)).flatten({background:'#0b1122'}).resize(540,960,{fit:'fill'}).jpeg({quality:93}).toFile(t.image);
}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const pageRecords=[],tw=270,th=480,headerHeight=44,cols=5;
for(let start=0;start<targets.length;start+=10){
 const list=targets.slice(start,start+10),layers=[];
 for(let i=0;i<list.length;i++){
  const t=list[i],left=i%cols*tw,top=Math.floor(i/cols)*(th+headerHeight);
  const header=Buffer.from(`<svg width="${tw}" height="${headerHeight}"><rect width="100%" height="100%" fill="white"/><text x="5" y="18" font-family="Hiragino Sans,Arial,sans-serif" font-size="16" fill="black">行 ${t.row} / ${esc(t.cue)}</text><text x="5" y="37" font-family="Hiragino Sans,Arial,sans-serif" font-size="16" fill="black">${t.time.toFixed(3)} 秒 / ${esc(t.sampleid)}</text></svg>`);
  layers.push({input:header,left,top},{input:await sharp(t.image).resize(tw,th).jpeg({quality:93}).toBuffer(),left,top:top+headerHeight});
 }
 const file=pageFiles[pageRecords.length];
 await sharp({create:{width:tw*cols,height:(th+headerHeight)*2,channels:3,background:'#eee'}}).composite(layers).jpeg({quality:93}).toFile(file);
 pageRecords.push({image:file,sampleids:list.map(t=>t.sampleid)});
}
const result={stage:'S2',episode:'d1b',sourceManifest:manifestPath,cache:CACHE,output:out,resolution:[540,960],runnerDeclaredEEVEESamples:4,logicalOverlayAndAnchorResolution:[1080,1920],cueCount:63,sampleCount:targets.length,frames:targets,pages:pageRecords,method:'Current B hooks + unchanged vertFrame1080x1920 SVG, resized to540x960. Exact S2 raw frames; supplied captions/labels/faces unchanged.',bboxOverlayDrawn:false,annotationProduced:false,automaticGateRun:false,visualReviewComplete:false,minWidthComplianceNotCertified:true,next:'Compare every sample with the filming table, disclose undersized/missing subjects, report S2, then STOP for Claude instructions. No S3/S4/movie production is started.'};
fs.writeFileSync(metadataFile,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({stage:'S2',metadata:metadataFile,samples:targets.length,cues:63,pages:pageFiles,automaticMovieStarted:false,claudeReviewRequired:true},null,2));

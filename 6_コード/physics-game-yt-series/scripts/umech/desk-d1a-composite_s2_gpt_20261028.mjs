// S2 STILL COMPOSITION ONLY. No Blender calls, movie export, or S3/S4 start.
// node THIS --specs <R/s2-specs.json> [--out <new child of CACHE/storyboard>]
//   [--raw-dir <storyboard/raw-pass2>] [--anchors <storyboard/anchors-pass2.json>]
//   [--validate-only] (read inputs only; no output or frame module imports)
// specs: {specs:[{name,frame,time,row,cue,primary,minWidth,minHeight?,word,phase}]}
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import sharp from 'sharp';

const W=path.resolve(new URL('../..',import.meta.url).pathname);
const CACHE='/private/tmp/ys/ys-chain-d1a_s2_gpt_20261028',ID='ys-chain-d1a',FPS=30;
const argv=process.argv.slice(2),opt=k=>{const i=argv.indexOf(k);return i<0?undefined:argv[i+1];},validateOnly=argv.includes('--validate-only');
const specArg=opt('--specs');assert.ok(specArg,'--specs <s2-specs.json> is required');
const specsPath=path.resolve(specArg),source=JSON.parse(fs.readFileSync(specsPath,'utf8'));
assert.ok(Array.isArray(source.specs)&&source.specs.length,'A nonempty specs array is required');
assert.notEqual(process.env.DESK_ALLOW_MISSING,'1','Exact raw only: never substitute a nearby frame');
assert.equal(fs.realpathSync(CACHE),CACHE,'The A S2 cache must be a real directory');
const storyboard=path.join(CACHE,'storyboard');
const rawDir=path.resolve(opt('--raw-dir')??path.join(storyboard,'raw')),anchorFile=path.resolve(opt('--anchors')??path.join(storyboard,'anchors-partial.json'));
for(const file of [rawDir,anchorFile]){
 assert.ok(file.startsWith(storyboard+path.sep),'Raw/anchors must remain inside the new A S2 storyboard directory');
 assert.equal(fs.realpathSync(file),file,'No symlinked S2 raw/anchor inputs');
 for(let p=file;p!==CACHE;p=path.dirname(p))assert.equal(fs.lstatSync(p).isSymbolicLink(),false,'No symlink in S2 input path');
}
assert.ok(fs.statSync(rawDir).isDirectory(),'--raw-dir must be a directory');assert.ok(fs.statSync(anchorFile).isFile(),'--anchors must be a JSON file');
const out=path.resolve(opt('--out')??path.join(storyboard,'composite'));
assert.ok(out.startsWith(storyboard+path.sep)&&!out.startsWith(rawDir+path.sep)&&out!==rawDir,'Use a fresh storyboard output child, never raw');
if(!validateOnly)assert.equal(fs.existsSync(out),false,'Preserve existing S2 output; select a new --out');
for(let p=path.dirname(out);p!==CACHE;p=path.dirname(p))if(fs.existsSync(p))assert.equal(fs.lstatSync(p).isSymbolicLink(),false,'No output through symlinks');
function readReal(rel){const p=path.join(CACHE,rel);assert.equal(fs.lstatSync(p).isSymbolicLink(),false,'Inputs must be real copies: '+rel);return JSON.parse(fs.readFileSync(p,'utf8'));}
const plan=readReal('plan.json'),timed=readReal(ID+'.json'),data=readReal('blender/data.json');readReal('phrase-times.json');
assert.equal(data.episode,'d1a');assert.equal(data.cues.length,54);assert.equal(new Set(data.cues.map(c=>c.row)).size,40);
assert.equal(timed.id,ID);const entry=plan.find(p=>p.id===ID);assert.ok(entry,'Supplied A plan entry is missing');
const clip={...timed,...entry,duration:timed.duration,scenes:entry.scenes.map((s,i)=>({...s,start:timed.scenes[i].start,end:timed.scenes[i].end,captions:timed.scenes[i].captions})),animationFPS:FPS,mediaDirectory:entry.mediaDirectory??'lessons'};
const nf=Math.ceil(clip.duration*FPS),anchors=JSON.parse(fs.readFileSync(anchorFile,'utf8'));
const cues=clip.scenes.flatMap(s=>s.cues.map(q=>q.diagram.replace(/^cd1a-/,''))),names=new Set(),targets=[];
for(const spec of source.specs){
 const {name,frame,time,row}=spec,cue=String(spec.cue).replace(/^cd1a-/,'');
 assert.ok(typeof name==='string'&&/^[A-Za-z0-9][A-Za-z0-9_.-]*$/.test(name)&&!names.has(name),'Safe unique spec.name required: '+name);names.add(name);
 assert.ok(Number.isInteger(frame)&&frame>=0&&frame<nf);assert.ok(Number.isFinite(time)&&Math.abs(time-frame/FPS)<1e-7,'Time must equal the actual integer frame/30');
 assert.ok(Number.isInteger(row)&&row>=1&&row<=40);assert.equal(data.cues.find(c=>c.key===cue)?.row,row,'Cue/row differs from supplied data');
 const scene=clip.scenes.find(s=>time>=s.start&&time<s.end)??clip.scenes.at(-1),index=Math.max(0,scene.captions.findLastIndex(c=>c.start<=time));
 assert.equal(scene.cues[index]?.diagram,'cd1a-'+cue,'The displayed cue differs from the spec');
 const raw=path.join(rawDir,String(frame).padStart(5,'0')+'.jpg');
 assert.equal(fs.lstatSync(raw).isSymbolicLink(),false,'No linked raw frames');assert.equal(fs.realpathSync(raw),raw,'Exact new S2 frame only');
 const meta=await sharp(raw).metadata();assert.equal(meta.width,540);assert.equal(meta.height,960);
 const points=anchors[String(frame)];assert.ok(points&&typeof points==='object','Missing exact sparse anchors: '+frame);
 for(const p of Object.values(points))assert.ok(Array.isArray(p)&&p.length===3&&p.every(v=>typeof v==='boolean'||(typeof v==='number'&&Number.isFinite(v))),'Invalid logical1080px anchor at '+frame);
 targets.push({...spec,cue,raw,image:path.join(out,'frames',name+'.jpg')});
}
assert.deepEqual([...new Set(targets.map(s=>s.cue))].sort(),[...new Set(cues)].sort(),'S2 must cover every one of the supplied54 cues');
if(validateOnly){console.log(JSON.stringify({stage:'S2 input validation only',specs:specsPath,rawDir,anchors:anchorFile,samples:targets.length,cues:54,rows:40,resolution:[540,960],exactRawOnly:true,writesPerformed:false,compositionPerformed:false},null,2));process.exit(0);}
process.env.EM_FILM_CACHE=CACHE;process.env.D1A_S2_RAW_DIR=rawDir;process.env.D1A_S2_ANCHORS_FILE=anchorFile;delete process.env.DESK_ALLOW_MISSING;
await import(pathToFileURL(path.join(W,'scripts/umech/desk-d1a-hooks_s2_gpt_20261028.mjs')));
const {vertFrame}=await import(pathToFileURL(path.join(W,'scripts/umech/frame-vert.mjs')));
fs.mkdirSync(path.join(out,'frames'),{recursive:true});
for(const spec of targets){
 const scene=clip.scenes.find(s=>spec.time>=s.start&&spec.time<s.end)??clip.scenes.at(-1),svg=vertFrame(clip,scene,spec.time);
 assert.ok(svg&&!/NaN|undefined|Infinity/.test(svg),'Invalid exact composite SVG: '+spec.name);
 await sharp(Buffer.from(svg)).flatten({background:'#0b1122'}).resize(540,960,{fit:'fill'}).jpeg({quality:93}).toFile(spec.image);
}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const pages=[],tw=270,th=480,hh=46,cols=2,rows=5;
for(let start=0;start<targets.length;start+=10){
 const list=targets.slice(start,start+10),layers=[];
 for(let i=0;i<list.length;i++){
  const spec=list[i],left=i%cols*tw,top=Math.floor(i/cols)*(th+hh);
  const label=Buffer.from(`<svg width="${tw}" height="${hh}"><rect width="100%" height="100%" fill="white"/><text x="5" y="18" font-family="Hiragino Sans,Arial,sans-serif" font-size="16">行 ${spec.row} / ${esc(spec.cue)}</text><text x="5" y="38" font-family="Hiragino Sans,Arial,sans-serif" font-size="16">${spec.time.toFixed(3)}秒 / ${esc(spec.name)}</text></svg>`);
  layers.push({input:label,left,top},{input:await sharp(spec.image).resize(tw,th).jpeg({quality:93}).toBuffer(),left,top:top+hh});
 }
 const image=path.join(out,'page-'+String(pages.length+1).padStart(3,'0')+'.jpg');
 await sharp({create:{width:tw*cols,height:(th+hh)*rows,channels:3,background:'#eee'}}).composite(layers).jpeg({quality:93}).toFile(image);
 pages.push({image,names:list.map(s=>s.name)});
}
const receipt=path.join(out,'storyboard_s2_gpt_20261028.json');
fs.writeFileSync(receipt,JSON.stringify({stage:'S2',episode:'d1a',sourceSpecs:specsPath,sourceKey:source.sourceKey??null,cache:CACHE,rawDir,anchorFile,resolution:[540,960],logicalOverlayAndAnchors:[1080,1920],expectedEEVEESamples:4,frameCount:targets.length,cueCount:54,rowCount:40,frames:targets,pages,exactRawOnly:true,rawModified:false,scriptVoiceCaptionModified:false,automaticGateRun:false,visualReviewComplete:false,wholeMoviePass:false,next:'Compare all stills with the supplied filming table, report S2, then STOP for Claude. No S3/S4/movie export.'},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({stage:'S2',receipt,samples:targets.length,pages:pages.map(p=>p.image),claudeReviewRequired:true,movieStarted:false},null,2));

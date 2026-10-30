// Composite existing exact S4 preview frames and readable contacts; never invokes Blender.
// node THIS --raw-dir <new-preview-directory> --out <fresh-output-directory>
//           [--times <seconds,...>] [--anchors-file <file>] [--raw-ext jpg|png]
// Without --times, use every numbered image in --raw-dir. No nearby fallback.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {CACHE,inputs,exactFrame} from './desk-d1b-stage_s4_gpt_20261027.mjs';
const args=process.argv.slice(2),opt=k=>{const i=args.indexOf(k);return i<0?undefined:args[i+1];};
const rawArg=opt('--raw-dir'),outArg=opt('--out');assert.ok(rawArg&&outArg,'Pass --raw-dir and --out');
const raw=fs.realpathSync(rawArg),out=path.resolve(outArg),ext=opt('--raw-ext')??'jpg';
assert.ok(out.startsWith(CACHE+path.sep)&&raw.startsWith(CACHE+path.sep),'New S4 cache only');
assert.equal(fs.existsSync(out),false,'Preserve the existing preview/contact directory');
assert.ok(['jpg','png'].includes(ext));
const stage=inputs({rawDir:raw,anchorsFile:opt('--anchors-file'),rawExt:ext});
const list=opt('--times'),indices=list?list.split(',').map(Number).map(t=>{assert.ok(Number.isFinite(t)&&t>=0&&t<stage.clip.duration);return Math.round(t*30);}):fs.readdirSync(raw).filter(n=>new RegExp('^\\d{5}\\.'+ext+'$').test(n)).map(n=>+n.slice(0,5));
const frames=[...new Set(indices)].sort((a,b)=>a-b).map(j=>({frame:j,time:j/30,raw:exactFrame(stage,j)}));assert.ok(frames.length,'No exact preview frames');
const previewMeta=path.join(raw,'preview-meta.json'),meta=fs.existsSync(previewMeta)?JSON.parse(fs.readFileSync(previewMeta)):null;
if(meta)assert.equal(typeof meta.sourceKey,'string');
// Validate all inputs before creating any output. Existing files remain read-only.
for(const f of frames){const m=await sharp(f.raw).metadata();assert.ok((m.width===540&&m.height===960)||(m.width===1080&&m.height===1920),'Unexpected preview raw dimensions at '+f.frame);}
await import('./desk-d1b-hooks_s4_gpt_20261027.mjs');
const {vertFrame}=await import('./frame-vert.mjs');
const imageDir=path.join(out,'frames'),sheetDir=path.join(out,'sheets');fs.mkdirSync(imageDir,{recursive:true});fs.mkdirSync(sheetDir,{recursive:true});
for(const f of frames){
 const scene=stage.clip.scenes.find(s=>f.time>=s.start&&f.time<s.end)??stage.clip.scenes.at(-1),svg=vertFrame(stage.clip,scene,f.time);
 assert.ok(svg&&!/NaN|undefined|Infinity/.test(svg),'Invalid final S4 overlay at '+f.frame);
 const cue=stage.data.cues.filter(c=>f.time>=c.start-1e-9).at(-1)??stage.data.cues[0];
 f.row=cue.row;f.cue=cue.key;f.image=path.join(imageDir,String(f.frame).padStart(5,'0')+'.jpg');
 // Native logical canvas makes subtitle/label typography identical to final;
 // the underlying540px trial raw is NOT represented as native-quality evidence.
 await sharp(Buffer.from(svg)).flatten({background:'#0b1122'}).resize(1080,1920,{fit:'fill'}).jpeg({quality:93}).toFile(f.image);
}
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const pages=[],tw=360,th=640,hh=44,cols=3,per=6;
for(let i=0;i<frames.length;i+=per){
 const part=frames.slice(i,i+per),layers=[];
 for(const [k,f] of part.entries()){
  const x=(k%cols)*tw,y=Math.floor(k/cols)*(th+hh);
  const header=`row ${f.row} / ${f.time.toFixed(3)}s / f${f.frame}`;
  layers.push({input:Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${tw}" height="${hh}"><rect width="${tw}" height="${hh}" fill="#142239"/><text x="8" y="18" font-family="sans-serif" font-size="15" fill="#fff">${esc(header)}</text><text x="8" y="37" font-family="sans-serif" font-size="15" fill="#fff">${esc(f.cue)}</text></svg>`),left:x,top:y});
  layers.push({input:await sharp(f.image).resize(tw,th).toBuffer(),left:x,top:y+hh});
 }
 const file=path.join(sheetDir,'page-'+String(pages.length+1).padStart(3,'0')+'.jpg');
 await sharp({create:{width:tw*cols,height:(th+hh)*Math.ceil(part.length/cols),channels:3,background:'#0b1122'}}).composite(layers).jpeg({quality:92}).toFile(file);
 pages.push({image:file,frames:part.map(f=>f.frame)});
}
const result={stage:'S4 revised-section still review',sourceKey:meta?.sourceKey??null,cache:CACHE,rawDirectory:raw,images:frames,pages,compositeCanvas:[1080,1920],contactTile:[tw,th],usesProductionS4CaptionsAndLabels:true,nearbyFallback:false,BlenderInvoked:false,movieRendered:false,underlyingPreviewQualityMayBe540:true,visuallyReviewed:false};
const manifest=path.join(out,'manifest.json');fs.writeFileSync(manifest,JSON.stringify(result,null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({manifest,frames:frames.length,pages:pages.length,firstPage:pages[0]?.image,sourceKey:result.sourceKey}));

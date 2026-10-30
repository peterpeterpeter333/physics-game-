// Compose exact A S3 trial raw with final supplied captions/labels. No Blender.
// --raw-dir DIR --anchors-file FILE --out FRESH_DIR
// [--storyboard specs.json] [--times seconds,...] [--raw-ext jpg|png]
// [--before S2/storyboard_s2_gpt_20261028.json] [--validate-only]
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {CACHE,inputs,exactFrame} from './desk-d1a-stage_s3_gpt_20261028.mjs';
const args=process.argv.slice(2),opt=k=>{const i=args.indexOf(k);return i<0?undefined:args[i+1];};
const raw=opt('--raw-dir'),af=opt('--anchors-file'),outArg=opt('--out'),specArg=opt('--storyboard'),times=opt('--times');
assert.ok(raw&&af&&outArg,'Pass --raw-dir, --anchors-file and --out');assert.ok(!(specArg&&times),'Choose --storyboard or --times, not both');
const out=path.resolve(outArg),ext=opt('--raw-ext')??'jpg',validate=args.includes('--validate-only');
assert.ok(out.startsWith(CACHE+path.sep)&&out!==path.resolve(raw)&&!out.startsWith(path.resolve(raw)+path.sep));assert.equal(fs.existsSync(out),false,'Preserve existing review outputs');
for(let p=path.dirname(out);p!==CACHE;p=path.dirname(p))if(fs.existsSync(p))assert.equal(fs.lstatSync(p).isSymbolicLink(),false);
const source=specArg?JSON.parse(fs.readFileSync(specArg,'utf8')):null;
const stage=inputs({rawDir:raw,anchorsFile:af,rawExt:ext,sparse:!!specArg||args.includes('--sparse-anchors')});
const specs=source?(source.specs??source.frames):times?times.split(',').map(Number).map(t=>({frame:Math.round(t*30),time:Math.round(t*30)/30})):fs.readdirSync(raw).filter(n=>new RegExp('^\\d{5}\\.'+ext+'$').test(n)).map(n=>({frame:+n.slice(0,5),time:+n.slice(0,5)/30}));
assert.ok(Array.isArray(specs)&&specs.length);const names=new Set(),frames=[];
for(const spec of specs){
 const j=spec.frame;assert.ok(Number.isInteger(j)&&j>=0&&j<stage.nf);assert.ok(spec.time===undefined||Math.abs(spec.time-j/30)<1e-7,'Use the actual integer frame time, not a nearby/word time');
 const time=j/30,scene=stage.clip.scenes.find(s=>time>=s.start&&time<s.end)??stage.clip.scenes.at(-1),ci=Math.max(0,scene.captions.findLastIndex(c=>c.start<=time)),cue=scene.cues[ci]?.diagram.replace(/^cd1a-/,''),row=stage.data.cues.find(c=>c.key===cue)?.row;
 if(spec.cue!==undefined)assert.equal(String(spec.cue).replace(/^cd1a-/,''),cue,'Spec cue differs from the actual displayed cue');if(spec.row!==undefined)assert.equal(spec.row,row);
 const name=spec.name??spec.sampleid??String(j).padStart(5,'0');assert.ok(/^[A-Za-z0-9][A-Za-z0-9_.-]*$/.test(name)&&!names.has(name),'Safe unique sample name required');names.add(name);
 const file=exactFrame(stage,j),m=await sharp(file).metadata();assert.ok((m.width===540&&m.height===960)||(m.width===1080&&m.height===1920),'Unexpected actual raw dimensions');
 frames.push({...spec,name,frame:j,time,row,cue,raw:file,rawResolution:[m.width,m.height],image:path.join(out,'frames',name+'.jpg')});
}
if(specArg)assert.deepEqual([...new Set(frames.map(f=>f.cue))].sort(),stage.data.cues.map(c=>c.key).sort(),'Storyboard mode must include every supplied54 cue');
const beforeFile=opt('--before'),before=beforeFile?JSON.parse(fs.readFileSync(beforeFile,'utf8')):null;
const oldFrames=before?.frames??before?.images??[],paired=[],beforeUnmatchedFrames=[];
if(before)for(const f of frames){
 const b=oldFrames.find(b=>(b.name===f.name||b.sampleid===f.name)&&b.frame===f.frame);
 const image=b?.image??b?.composedImage;
 if(image){assert.equal(fs.realpathSync(image),path.resolve(image),'No linked before images');assert.ok(image.startsWith('/private/tmp/ys/ys-chain-d1a_s2_gpt_20261028/storyboard/'),'Before comparison must use preserved A S2 composites');paired.push({frame:f.frame,name:f.name,before:image,after:f.image,row:f.row,cue:f.cue,time:f.time});}
 else beforeUnmatchedFrames.push({name:f.name,frame:f.frame,time:f.time,row:f.row,cue:f.cue,reason:'No preserved S2 composite with both the same sample name and exact frame; no substitute made'});
}
if(validate){console.log(JSON.stringify({stage:'A S3 trial input validation only',frames:frames.length,cues:new Set(frames.map(f=>f.cue)).size,rows:new Set(frames.map(f=>f.row)).size,exactRawOnly:true,paired:paired.length,beforeUnmatched:before?frames.length-paired.length:0,writesPerformed:false}));process.exit(0);}
await import('./desk-d1a-hooks_s3_gpt_20261028.mjs');const {vertFrame}=await import('./frame-vert.mjs');
fs.mkdirSync(path.join(out,'frames'),{recursive:true});
for(const f of frames){const scene=stage.clip.scenes.find(s=>f.time>=s.start&&f.time<s.end)??stage.clip.scenes.at(-1),svg=vertFrame(stage.clip,scene,f.time);assert.ok(svg&&!/NaN|undefined|Infinity/.test(svg),'Invalid composite SVG '+f.name);await sharp(Buffer.from(svg)).flatten({background:'#0b1122'}).resize(540,960,{fit:'fill'}).jpeg({quality:93}).toFile(f.image);}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
async function sheets(items,dir,isPair){
 fs.mkdirSync(dir,{recursive:true});const pages=[],tw=270,th=480,hh=46,per=isPair?5:10;
 for(let start=0;start<items.length;start+=per){const list=items.slice(start,start+per),layers=[];
  for(let i=0;i<list.length;i++){const f=list[i],imgs=isPair?[f.before,f.after]:[f.image];for(let k=0;k<imgs.length;k++){
   const x=isPair?k*tw:i%2*tw,y=(isPair?i:Math.floor(i/2))*(th+hh),label=(isPair?(k?'S3 / ':'S2 / '):'')+'行 '+f.row+' / '+f.cue;
   layers.push({input:Buffer.from(`<svg width="${tw}" height="${hh}"><rect width="100%" height="100%" fill="white"/><text x="5" y="18" font-family="Hiragino Sans,Arial,sans-serif" font-size="16">${esc(label)}</text><text x="5" y="38" font-family="Hiragino Sans,Arial,sans-serif" font-size="16">${f.time.toFixed(3)}秒 / ${esc(f.name)}</text></svg>`),left:x,top:y},{input:await sharp(imgs[k]).resize(tw,th).jpeg({quality:93}).toBuffer(),left:x,top:y+hh});
  }}
  const image=path.join(dir,'page-'+String(pages.length+1).padStart(3,'0')+'.jpg');await sharp({create:{width:540,height:5*(th+hh),channels:3,background:'#eee'}}).composite(layers).jpeg({quality:93}).toFile(image);pages.push({image,names:list.map(f=>f.name)});
 }return pages;
}
const pages=await sheets(frames,out,false),pairedPages=paired.length?await sheets(paired,path.join(out,'before-after'),true):[];
const result={stage:'S3 trial stills only',cache:CACHE,specs:specArg??null,rawDirectory:stage.rawDir,anchorsFile:stage.anchorsFile,sparseAnchors:stage.sparse,sourceKey:source?.sourceKey??null,frames,pages,beforeFile:beforeFile??null,pairedPages,beforeUnmatched:before?frames.length-paired.length:0,beforeUnmatchedFrames,outputResolution:[540,960],logicalCanvas:[1080,1920],productionCaptionsAndLabels:true,rawModified:false,nearbyFallback:false,movieRendered:false,visualReviewComplete:false,wholeMoviePass:false};
const receipt=path.join(out,'storyboard_s3_gpt_20261028.json');fs.writeFileSync(receipt,JSON.stringify(result,null,1)+'\n',{flag:'wx'});console.log(JSON.stringify({receipt,frames:frames.length,pages:pages.map(p=>p.image),pairedPages:pairedPages.map(p=>p.image),beforeUnmatched:result.beforeUnmatched}));

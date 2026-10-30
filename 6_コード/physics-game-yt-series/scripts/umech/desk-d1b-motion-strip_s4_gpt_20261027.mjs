// Existing exact S4 trial raw only; never renders or substitutes a neighboring frame.
// node THIS --run [--plan file] [--raw-dir file] [--out fresh-dir]
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import sharp from 'sharp';
import {CACHE,inputs,exactFrame} from './desk-d1b-stage_s4_gpt_20261027.mjs';
const W=path.resolve(new URL('../..',import.meta.url).pathname),args=process.argv.slice(2),opt=k=>{const i=args.indexOf(k);return i<0?undefined:args[i+1];};
assert.ok(args.includes('--run'),'Explicit --run after the parent confirms missing-frame completion');
const planFile=path.resolve(opt('--plan')??path.join(W,'outputs/ys-chain-d1b-backup/S4_20261027/independent-probe-plan_20261027.json'));
const raw=fs.realpathSync(opt('--raw-dir')??path.join(CACHE,'review/motion-final')),out=path.resolve(opt('--out')??path.join(CACHE,'review/motion-contact'));
assert.ok(raw.startsWith(CACHE+path.sep)&&out.startsWith(CACHE+path.sep));assert.equal(fs.existsSync(out),false,'Preserve previous review');
const plan=JSON.parse(fs.readFileSync(planFile)),meta=JSON.parse(fs.readFileSync(path.join(raw,'preview-meta.json')));
assert.equal(meta.episode,'d1b');assert.equal(meta.fps,30);assert.equal(meta.previewOnly,true);
function currentKey(){
 const py="import hashlib,json,sys;from pathlib import Path;w=Path(sys.argv[1]);c=Path(sys.argv[2]);files=['desk_d1b_s4_gpt_20261027.py','desk_lib_d1b_s4_gpt_20261027.py','desk_lib_d1.py','desk_d1b_s4_qa_gpt_20261027.py'];src=b''.join((w/'scripts/blender'/f).read_bytes() for f in files);print(hashlib.sha256(src+json.dumps(json.loads((c/'blender/data.json').read_text()),sort_keys=True).encode()).hexdigest()[:20])";
 const p=spawnSync('python3',['-c',py,W,CACHE],{encoding:'utf8',env:{...process.env,PYTHONDONTWRITEBYTECODE:'1'}});assert.equal(p.status,0,p.stderr);return p.stdout.trim();
}
assert.equal(meta.sourceKey,currentKey(),'Preview was not rendered from the current frozen S4 sources');
const stage=inputs({rawDir:raw}),by=new Map(stage.data.cues.map(c=>[c.key,c]));assert.equal(plan.windows.length,9);
const targets={
 'piston-opening-word':[['pump:down','開きます']],
 'piston-close-boundary-and-phrase':[['pump:up','上の水の重さ'],['pump:up','閉じます']],
 'foot-context-to-macro':[['pump:refill','底の弁が開き']],
 'drain-closed-three-arrows':[['drain:pipe','外から押して'],['drain:pipe','閉じる']],
 'drain-pressure-and-opening':[['drain:steam','少しだけ強く'],['drain:out','弁を押し開けて']],
 'final-small-valve-hold':[['last:valve','小さな弁']],
 'coal-highlight-and-disappear':[['next:waste','温め直す']],
 'fuji-not-static-eight-seconds':[['quiz:weak','弱くなります'],['quiz:fuji','上に積もった空気が少ない']],
 'pump-intro-not-static-eight-seconds':[['pump:inside','立てた筒']],
};
const windows=plan.windows.map(w=>{
 assert.ok(/^[a-z0-9-]+$/.test(w.id));assert.ok(Number.isInteger(30/w.fps)&&30/w.fps>=1);
 assert.ok(Number.isInteger(w.firstFrame)&&Number.isInteger(w.lastFrame)&&w.lastFrame>=w.firstFrame);
 const frames=[];for(let j=w.firstFrame;j<=w.lastFrame;j+=30/w.fps)frames.push({frame:j,time:j/30,raw:exactFrame(stage,j)});
 const wordEvents=(targets[w.id]??[]).map(([key,word])=>{const events=by.get(key)?.wordEvents.filter(x=>x.word===word);assert.equal(events?.length,1,'Missing exact word '+key+' '+word);return {cue:key,word,time:events[0].time};});
 return {...w,frames,wordEvents};
});
const indices=[...new Set(windows.flatMap(w=>w.frames.map(f=>f.frame)))].sort((a,b)=>a-b);
for(const j of indices){const m=await sharp(exactFrame(stage,j)).metadata();assert.ok((m.width===540&&m.height===960)||(m.width===1080&&m.height===1920));}
await import('./desk-d1b-hooks_s4_gpt_20261027.mjs');const {vertFrame}=await import('./frame-vert.mjs');
fs.mkdirSync(out,{recursive:true});const thumbs=new Map();
for(const j of indices){const t=j/30,s=stage.clip.scenes.find(s=>t>=s.start&&t<s.end)??stage.clip.scenes.at(-1),svg=vertFrame(stage.clip,s,t);assert.ok(svg&&!/NaN|undefined|Infinity/.test(svg));thumbs.set(j,await sharp(Buffer.from(svg)).flatten({background:'#0b1122'}).resize(180,320,{fit:'fill'}).jpeg({quality:88}).toBuffer());}
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const cols=6,per=36,tw=180,th=320,hh=84,lh=22;
for(const w of windows){
 const dir=path.join(out,w.id);fs.mkdirSync(dir);w.pages=[];
 for(let i=0;i<w.frames.length;i+=per){
  const part=w.frames.slice(i,i+per),layers=[];
  const title=`${w.id} / row ${w.row} / ${w.fps}fps exact samples`;
  const words=w.wordEvents.map(x=>`${x.word} ${x.time.toFixed(3)}s`).join(' | ');
  const header=`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="${hh}"><rect width="1080" height="${hh}" fill="#142239"/><text x="10" y="26" font-family="sans-serif" font-size="21" fill="#fff">${esc(title)}</text><text x="10" y="54" font-family="Hiragino Sans,sans-serif" font-size="21" fill="#fff">${esc(words)}</text><text x="10" y="76" font-family="sans-serif" font-size="16" fill="#fff">${w.frames[0].time.toFixed(3)}–${w.frames.at(-1).time.toFixed(3)}s; page ${w.pages.length+1}; source ${meta.sourceKey}</text></svg>`;
  layers.push({input:Buffer.from(header),left:0,top:0});
  for(const [k,f] of part.entries()){const x=(k%cols)*tw,y=hh+Math.floor(k/cols)*(th+lh);layers.push({input:Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="180" height="22"><rect width="180" height="22" fill="#142239"/><text x="5" y="16" font-family="sans-serif" font-size="13" fill="#fff">${f.time.toFixed(3)}s / f${f.frame}</text></svg>`),left:x,top:y});layers.push({input:thumbs.get(f.frame),left:x,top:y+lh});}
  const file=path.join(dir,'page-'+String(w.pages.length+1).padStart(3,'0')+'.jpg');
  await sharp({create:{width:1080,height:hh+Math.ceil(part.length/cols)*(th+lh),channels:3,background:'#0b1122'}}).composite(layers).jpeg({quality:91}).toFile(file);
  w.pages.push({image:file,frames:part.map(f=>f.frame)});
 }
}
assert.equal(meta.sourceKey,currentKey(),'Source changed during strip generation');
const result={sourceKey:meta.sourceKey,plan:planFile,rawDirectory:raw,windows,uniqueFrames:indices.length,tile:[180,320],columns:6,maxFramesPerPage:36,productionS4CaptionsAndLabels:true,exactIntegerFrameSteps:true,neighborFallback:false,BlenderInvoked:false,rawWritten:false,visuallyReviewed:false};
const manifest=path.join(out,'manifest.json');fs.writeFileSync(manifest,JSON.stringify(result,null,1)+'\n',{flag:'wx'});console.log(JSON.stringify({manifest,sourceKey:meta.sourceKey,windows:windows.map(w=>({id:w.id,fps:w.fps,frames:w.frames.length,pages:w.pages.map(p=>p.image)})),uniqueFrames:indices.length}));

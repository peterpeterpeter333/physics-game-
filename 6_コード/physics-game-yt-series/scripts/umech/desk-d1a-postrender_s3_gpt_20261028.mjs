// Completed A S3 MP4 review extraction and optional real-copy backup only.
// node THIS --source-key <actual key> --run [--backup]
// Never starts Blender/export/checkers, never overwrites review/trial directories.
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const W=path.resolve(new URL('../..',import.meta.url).pathname),C='/private/tmp/ys/ys-chain-d1a_s3_gpt_20261028',ID='ys-chain-d1a',NF=11618,FPS=30;
const args=process.argv.slice(2),opt=k=>{const i=args.indexOf(k);return i<0?null:args[i+1];},key=opt('--source-key');
assert.ok(args.includes('--run')&&key&&/^[a-f0-9]{20,64}$/.test(key),'Explicit --run and reviewed --source-key required');assert.equal(fs.realpathSync(C),C);
const read=p=>JSON.parse(fs.readFileSync(path.join(C,p),'utf8')),movie=path.join(C,'draft',ID+'_draft.mp4'),out=path.join(C,'S3-review'),DEST=path.join(W,'outputs/ys-chain-d1a-backup/S3_20261028/cache');
const exportResult=read('draft/s3-export_20261028.json'),meta=read('blender/desk/meta.json'),timed=read(ID+'.json'),data=read('blender/data.json'),words=read('word-events-actual_s3_20261028.json');
assert.equal(exportResult.sourceKey,key);assert.equal(meta.key,key);assert.equal(meta.stage,'S3');assert.equal(exportResult.encodedFrames,NF);assert.equal(meta.frames,NF);assert.equal(exportResult.fps,FPS);assert.equal(Math.ceil(timed.duration*FPS),NF);assert.deepEqual(exportResult.resolution,[540,960]);assert.equal(exportResult.actualNativeDecode,true);assert.equal(exportResult.native,true);assert.equal(exportResult.video,movie);
assert.ok(typeof meta.finished==='string'&&Number.isFinite(Date.parse(meta.finished))&&!meta.previewOnly&&!meta.sampleOnly);
assert.equal(fs.existsSync(out),false,'Preserve existing S3-review outputs');if(args.includes('--backup'))assert.equal(fs.existsSync(DEST),false,'Preserve previous persistent backup');
const reportDir=path.join(W,'outputs/ys-chain-d1a-backup/S3_20261028','postrender_'+new Date().toISOString().replaceAll(':','-').replaceAll('.','-'));fs.mkdirSync(reportDir,{recursive:true});
const report={stage:'S3 actual-native MP4 review extraction',sourceKey:key,movie,resolution:[540,960],frames:NF,fps:30,startedAt:new Date().toISOString(),steps:[],allMoviePass:false,earsPerformed:false,BlenderStarted:false,exportStarted:false};
const receipt=path.join(reportDir,'receipt.json'),save=()=>fs.writeFileSync(receipt,JSON.stringify(report,null,1)+'\n');
const stop=()=>{assert.equal(fs.existsSync(path.join(C,'STOP_S3_POSTRENDER')),false,'STOP_S3_POSTRENDER present; no marker was removed');};
const ff=process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
function run(name,a){stop();const start=Date.now(),r=spawnSync(ff,a,{encoding:'utf8',maxBuffer:8<<20});fs.writeFileSync(path.join(reportDir,name+'.stdout.log'),r.stdout??'',{flag:'wx'});fs.writeFileSync(path.join(reportDir,name+'.stderr.log'),r.stderr??'',{flag:'wx'});report.steps.push({name,command:[ff,...a],exitCode:r.status,signal:r.signal,elapsedSeconds:(Date.now()-start)/1000});save();assert.equal(r.status,0,name+' failed');}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
async function sheets(frames,dir,{tw=270,th=480,cols=5,per=10}={}){
 await fsp.mkdir(dir,{recursive:true});const pages=[];
 for(let start=0;start<frames.length;start+=per){stop();const list=frames.slice(start,start+per),comp=[];
  for(let k=0;k<list.length;k++){const f=list[k],x=k%cols*tw,y=Math.floor(k/cols)*(th+42);comp.push({input:Buffer.from(`<svg width="${tw}" height="42"><rect width="100%" height="100%" fill="white"/><text x="5" y="18" font-family="sans-serif" font-size="15">${f.time.toFixed(3)}s / f${f.frame}</text><text x="5" y="36" font-family="sans-serif" font-size="15">${esc(f.cue??'')}</text></svg>`),left:x,top:y},{input:await sharp(f.image).resize(tw,th).toBuffer(),left:x,top:y+42});}
  const image=path.join(dir,'page-'+String(pages.length+1).padStart(3,'0')+'.jpg');await sharp({create:{width:tw*cols,height:Math.ceil(list.length/cols)*(th+42),channels:3,background:'#eee'}}).composite(comp).jpeg({quality:92}).toFile(image);pages.push({image,frames:list.map(f=>f.frame)});
 }return pages;
}
const cueAt=t=>data.cues.find(c=>t>=c.start&&t<c.end)?.key??null;
async function oneHz(){
 const root=path.join(out,'one-hz'),dir=path.join(root,'frames');await fsp.mkdir(dir,{recursive:true});
 run('one-hz-extract',['-n','-v','error','-i',movie,'-vf','select=not(mod(n\\,30))','-fps_mode','passthrough','-q:v','2',path.join(dir,'f-%04d.jpg')]);
 const files=fs.readdirSync(dir).filter(f=>/^f-\d+\.jpg$/.test(f)).sort();assert.equal(files.length,Math.ceil(NF/30));
 const frames=files.map((f,i)=>({frame:i*30,time:i,cue:cueAt(i),image:path.join(dir,f)}));
 for(const f of frames){const m=await sharp(f.image).metadata();assert.deepEqual([m.width,m.height],[540,960]);}
 const pages=await sheets(frames,path.join(root,'sheets'));fs.writeFileSync(path.join(root,'manifest.json'),JSON.stringify({method:'Actual MP4 frame indices divisible by30, exact0/1/2...seconds; not fps-filter approximate seek',frames,pages,viewed:false},null,1)+'\n',{flag:'wx'});return {root,frames:frames.length,pages:pages.length};
}
async function motion(){
 const specs=[['drum-winding','gin:drum','巻き取られて',.35,2.5],['two-buckets','gin:drum','一方の桶',.35,3.5],['can-hand-flip-and-lower','can:flip','逆さに',.35,2.65],['can-crush','can:crush','ぐしゃっと',.35,1.2],['can-mouth-water','can:seal','口を水でふさいで',.35,1.6],['steam-condensation','why:steam','蒸気を使う',.35,1.5],['pump-pull-handle','guericke:pull','取っ手を引く',.35,2.35],['pump-inlet-open','guericke:pull','押し開けて',.4,1.4],['pump-inlet-close','guericke:push','入口の弁は閉じ',.4,1.4],['pump-outlet-open','guericke:push','出口の弁',.4,1.5]];
 const root=path.join(out,'motion-30fps'),dir=path.join(root,'frames');await fsp.mkdir(dir,{recursive:true});
 const windows=specs.map(([name,cue,word,before,after])=>{const c=data.cues.find(c=>c.key===cue),e=words[cue]?.[word];assert.ok(c&&e&&Number.isFinite(e.time),'Missing actual word '+cue+' '+word);return {name,cue,word,triggerSeconds:e.time,source:'derived actual phoneme boundary map',from:Math.max(0,Math.ceil(c.start*30-1e-8),Math.floor((e.time-before)*30)),to:Math.min(NF-1,Math.ceil(c.end*30-1e-8)-1,Math.ceil((e.time+after)*30))};});
 const indices=[...new Set(windows.flatMap(w=>Array.from({length:w.to-w.from+1},(_,i)=>w.from+i)))].sort((a,b)=>a-b),select=windows.map(w=>`between(n\\,${w.from}\\,${w.to})`).join('+');
 run('motion-extract',['-n','-v','error','-i',movie,'-vf','select='+select,'-fps_mode','passthrough','-q:v','2',path.join(dir,'seq-%05d.jpg')]);
 const files=fs.readdirSync(dir).filter(f=>/^seq-\d+\.jpg$/.test(f)).sort();assert.equal(files.length,indices.length);const frames=[];
 for(let i=0;i<indices.length;i++){const frame=indices[i],image=path.join(dir,String(frame).padStart(5,'0')+'.jpg');await fsp.rename(path.join(dir,files[i]),image);frames.push({frame,time:frame/30,cue:cueAt(frame/30),image});}
 for(const w of windows){const selected=frames.filter(f=>f.frame>=w.from&&f.frame<=w.to);w.frames=selected.length;w.pages=await sheets(selected,path.join(root,w.name),{tw:180,th:320,cols:6,per:36});}
 fs.writeFileSync(path.join(root,'manifest.json'),JSON.stringify({method:'Actual consecutive encoded30fps integer frames, no nearest frame substitution',windows,frames,viewed:false},null,1)+'\n',{flag:'wx'});return {root,windows:windows.length,uniqueFrames:frames.length,pages:windows.reduce((n,w)=>n+w.pages.length,0)};
}
function inventory(root){const a=[];function walk(dir){for(const n of fs.readdirSync(dir).sort()){const p=path.join(dir,n),s=fs.lstatSync(p);assert.equal(s.isSymbolicLink(),false,'Real-copy backup only: '+p);if(s.isDirectory())walk(p);else{assert.ok(s.isFile());a.push({relative:path.relative(root,p),size:s.size});}}}walk(root);return a;}
async function digest(p){const h=createHash('sha256');for await(const b of fs.createReadStream(p)){stop();h.update(b);}return h.digest('hex');}
async function backup(){
 stop();assert.equal(fs.existsSync(DEST),false);const list=inventory(C);await fsp.mkdir(DEST,{recursive:true});let bytes=0;
 for(const f of list){stop();const target=path.join(DEST,f.relative);await fsp.mkdir(path.dirname(target),{recursive:true});await fsp.copyFile(path.join(C,f.relative),target,fs.constants.COPYFILE_EXCL);bytes+=f.size;}
 assert.deepEqual(inventory(DEST),list);assert.deepEqual(inventory(C),list,'Source cache changed during backup');
 const keyFiles=['plan.json',ID+'.json','phrase-times.json',ID+'.voice.wav','blender/data.json','word-events-actual_s3_20261028.json','shot-plan.json','blender/desk/meta.json','blender/primary.json','blender/primary-metadata.json',ID+'.s3c.mixed.wav',ID+'.s3c.bgm.wav',ID+'.s3c.mix.json','draft/'+ID+'_draft.mp4','quality-gate.json','verify/report.txt'],keyHashes=[];
 for(const rel of keyFiles)if(fs.existsSync(path.join(C,rel))){const sha256=await digest(path.join(C,rel));assert.equal(await digest(path.join(DEST,rel)),sha256);keyHashes.push({path:rel,sha256});}
 return {path:DEST,files:list.length,bytes,symlinks:0,filesAreRealCopies:true,fileSizesCompared:list.length,keyHashes,allRawHashesGenerated:false};
}
save();
try{stop();report.oneHz=await oneHz();save();report.motion=await motion();save();if(args.includes('--backup'))report.backup=await backup();report.state='Review contacts prepared; actual viewing and honest S3 report still required';report.endedAt=new Date().toISOString();save();console.log(JSON.stringify({receipt,...report.oneHz,motion:report.motion,backup:report.backup?.path??null,allMoviePass:false}));}
catch(error){report.state='failed';report.error=String(error);save();throw error;}

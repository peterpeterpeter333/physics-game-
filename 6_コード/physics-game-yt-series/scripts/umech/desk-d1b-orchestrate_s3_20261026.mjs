// Explicit start only. Watches NEW S3 output; never starts Blender or S4.
// node THIS --source-key 415c661cee69727ff8ef --run
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawn,spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import sharp from 'sharp';

const W=path.resolve(new URL('../..',import.meta.url).pathname);
const CACHE='/private/tmp/ys/ys-chain-d1b_s3_gpt_20261026',ID='ys-chain-d1b',NF=14813,FPS=30;
const args=process.argv.slice(2),opt=k=>{const i=args.indexOf(k);return i<0?null:args[i+1];};
const KEY=opt('--source-key');assert.ok(KEY&&/^[a-f0-9]{20}$/.test(KEY),'Supply the approved actual source key');
assert.ok(args.includes('--run'),'Not started: explicit --run is required');
assert.equal(process.env.EM_FILM_CACHE??CACHE,CACHE,'New S3 cache only');
assert.equal(fs.realpathSync(CACHE),CACHE,'No symlink cache');
const STOP=path.join(CACHE,'STOP_S3_ORCHESTRATOR');
const DEST=path.join(W,'outputs/ys-chain-d1b-backup/S3_20261026/cache');
const runDir=path.join(W,'outputs/ys-chain-d1b-backup/S3_20261026','orchestration_'+new Date().toISOString().replaceAll(':','-').replaceAll('.','-'));
assert.equal(fs.existsSync(DEST),false,'Preserve the existing S3 backup');
fs.mkdirSync(runDir,{recursive:true});
const receipt=path.join(runDir,'receipt.json');
const report={stage:'S3 export/check/contact/backup orchestration',sourceKey:KEY,cache:CACHE,frames:NF,fps:FPS,startedAt:new Date().toISOString(),steps:[],state:'waiting',allMoviePass:false,earsPerformed:false,S4Started:false,BlenderStarted:false};
const save=()=>fs.writeFileSync(receipt,JSON.stringify(report,null,1)+'\n');
const stopped=()=>fs.existsSync(STOP);
function stopCheck(){if(stopped()){const e=Error('STOP_S3_ORCHESTRATOR is present; no marker was removed');e.stopped=true;throw e;}}
const env={...process.env,EM_FILM_CACHE:CACHE,NEMO_URL:'http://127.0.0.1:50123',PYTHONDONTWRITEBYTECODE:'1'};
for(const name of ['D1B_S3_RAW_DIR','D1B_S3_ANCHORS_FILE','D1B_S3_RAW_EXT','GATE_NPZ'])delete env[name];
const FF=process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
const DRAFT=path.join(CACHE,'draft',ID+'_draft.mp4'),QA=path.join(CACHE,'draft',ID+'_draft_qa1080.mp4');
const md=path.join(W,'docs/video-revision-20260924/deep/技術の疑問の鎖_D-1後編_ナレーション.md');
const script=path.join(W,'docs/video-revision-20260924/ytseries/chain-d-1b.mjs');
const timed=JSON.parse(fs.readFileSync(path.join(CACHE,ID+'.json'))),DATA=JSON.parse(fs.readFileSync(path.join(CACHE,'blender/data.json')));
assert.equal(Math.ceil(timed.duration*30),NF);assert.equal(DATA.cues.length,63);
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const sha=async file=>{const h=createHash('sha256');for await(const chunk of fs.createReadStream(file)){stopCheck();h.update(chunk);}return h.digest('hex');};
function sourceKey(){
 const py="import hashlib,json,sys;from pathlib import Path;w=Path(sys.argv[1]);c=Path(sys.argv[2]);files=['desk_d1b_s3_20261026.py','desk_lib_d1b_s3_20261026.py','desk_lib_d1.py','desk_d1b_s3_qa_20261026.py'];s=b''.join((w/'scripts/blender'/p).read_bytes() for p in files);print(hashlib.sha256(s+json.dumps(json.loads((c/'blender/data.json').read_text()),sort_keys=True).encode()).hexdigest()[:20])";
 const p=spawnSync('python3',['-c',py,W,CACHE],{env,encoding:'utf8'});assert.equal(p.status,0,p.stderr);return p.stdout.trim();
}
async function run(name,cmd,argv){
 stopCheck();const began=Date.now(),stdout=path.join(runDir,name+'.stdout.log'),stderr=path.join(runDir,name+'.stderr.log');
 const a=fs.createWriteStream(stdout,{flags:'wx'}),b=fs.createWriteStream(stderr,{flags:'wx'});
 const item={name,command:[cmd,...argv],startedAt:new Date().toISOString(),stdout,stderr};report.steps.push(item);report.state=name;save();
 console.log('S3 stage:',name);
 return await new Promise((resolve,reject)=>{
  const child=spawn(cmd,argv,{cwd:W,env,detached:true,stdio:['ignore','pipe','pipe']});let stopRequested=false,spawnError=null;
  child.stdout.pipe(a);child.stderr.pipe(b);child.on('error',e=>{spawnError=String(e);});
  const poll=setInterval(()=>{if(stopped()){stopRequested=true;try{process.kill(-child.pid,'SIGTERM');}catch{child.kill('SIGTERM');}}},1000);
  child.on('close',(code,signal)=>{
   clearInterval(poll);a.end();b.end();Object.assign(item,{exitCode:code,signal,elapsedSeconds:(Date.now()-began)/1000,endedAt:new Date().toISOString(),spawnError});save();
   if(stopRequested){const e=Error('Stopped during '+name);e.stopped=true;reject(e);}else resolve(item);
  });
 });
}
async function waitForFinished(){
 const metaFile=path.join(CACHE,'blender/desk/meta.json');let lastProgress=null;
 for(;;){
  stopCheck();assert.equal(sourceKey(),KEY,'On-disk source changed while waiting; do not export a different build');
  let m=null;try{if(fs.existsSync(metaFile))m=JSON.parse(fs.readFileSync(metaFile));}catch{} // an in-flight checkpoint is not completion
  if(m){
   assert.equal(m.key,KEY,'New S3 cache contains another render key');assert.equal(m.frames,NF);assert.equal(m.fps,FPS);
   const done=Array.isArray(m.done)?m.done.length:null;
   if(done!==lastProgress){lastProgress=done;console.log('S3 raw checkpoint:',done);}
   // Actual scene/exporter use a completion DATETIME string, never boolean true.
   if(typeof m.finished==='string'&&Number.isFinite(Date.parse(m.finished))){
    assert.ok(!m.previewOnly&&!m.sampleOnly);assert.equal(m.stage,'S3');
    const approval=JSON.parse(fs.readFileSync(path.join(CACHE,'S2_SELF_REVIEW_APPROVED.json')));
    assert.equal(approval.approved,true);assert.equal(approval.sourceKey,KEY);assert.equal(approval.episode,'d1b');
    // The scene writes the final meta just before camera/primary JSONs.
    // Wait for those files too, rather than racing their first write.
    let anchors=null,primary=null,pm=null,camera=null;
    try{
     anchors=JSON.parse(fs.readFileSync(path.join(CACHE,'blender/desk/anchors.json')));
     primary=JSON.parse(fs.readFileSync(path.join(CACHE,'blender/primary.json')));
     pm=JSON.parse(fs.readFileSync(path.join(CACHE,'blender/primary-metadata.json')));
     camera=JSON.parse(fs.readFileSync(path.join(CACHE,'blender/camera-motion.json')));
    }catch{}
    if(anchors&&primary&&pm&&camera&&pm.sourceKey===KEY&&Object.keys(pm.frames??{}).length===NF){
     assert.equal(anchors.key,KEY);assert.equal(anchors.frames,NF);assert.equal(camera.frames,NF);
     assert.ok(Number.isInteger(pm.coverage?.missingOrInvalid),'Missing explicit primary coverage result');
     // A draft with measured NGs still needs to be encoded and reported.
     // Never turn a geometric defect into an endless wait or a false PASS.
     report.rawCompletion={meta:metaFile,finished:m.finished,key:m.key,frames:m.frames,fps:m.fps,primaryCoverage:m.primaryCoverage,perFrameMeasurementRecords:Object.keys(pm.frames).length,primaryMissingOrInvalid:pm.coverage.missingOrInvalid};save();return;
    }
   }else assert.ok(m.finished===false||m.finished==null,'Unexpected finished schema; actual exporter requires a datetime string');
  }
  for(let i=0;i<55;i++){stopCheck();await new Promise(r=>setTimeout(r,1000));}
 }
}
function header(text,w,h=32){return Buffer.from(`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><rect width="${w}" height="${h}" fill="#142239"/><text x="8" y="23" font-family="sans-serif" font-size="19" fill="white">${escape(text)}</text></svg>`);}
async function sheets(frames,out,{width=270,height=480,cols=5,per=10}={}){
 await fsp.mkdir(out,{recursive:true});const pages=[];
 for(let i=0;i<frames.length;i+=per){
  stopCheck();const subset=frames.slice(i,i+per),comp=[];
  for(let k=0;k<subset.length;k++){
   const f=subset[k],x=(k%cols)*width,y=Math.floor(k/cols)*(height+32);
   comp.push({input:header(`${f.time.toFixed(3)}s / f${f.frame}`,width),left:x,top:y});
   comp.push({input:await sharp(f.image).resize(width,height).toBuffer(),left:x,top:y+32});
  }
  const image=path.join(out,'page-'+String(pages.length+1).padStart(3,'0')+'.jpg');
  await sharp({create:{width:width*cols,height:Math.ceil(subset.length/cols)*(height+32),channels:3,background:'#0b1122'}}).composite(comp).jpeg({quality:91}).toFile(image);
  pages.push({image,frames:subset.map(f=>f.frame)});
 }
 return pages;
}
async function oneHz(){
 const out=path.join(CACHE,'S3-review/one-hz'),dir=path.join(out,'frames');assert.equal(fs.existsSync(out),false);await fsp.mkdir(dir,{recursive:true});
 const p=await run('06-one-hz-extract',FF,['-n','-v','error','-i',DRAFT,'-vf','select=not(mod(n\\,30))','-fps_mode','passthrough','-q:v','2',path.join(dir,'f-%04d.jpg')]);
 assert.equal(p.exitCode,0,'One-Hz extraction failed');
 const files=fs.readdirSync(dir).filter(n=>/^f-\d+\.jpg$/.test(n)).sort();assert.equal(files.length,Math.ceil(NF/30));
 const frames=files.map((f,i)=>({frame:i*30,time:i,image:path.join(dir,f),cue:DATA.cues.find(c=>i>=c.start&&i<c.end)?.key??null}));
 const pages=await sheets(frames,path.join(out,'sheets'));const result={method:'Actual native MP4 encoded frame indices divisible by30; no approximate seek or nearby fallback',frames,pages,viewed:false};
 fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(result,null,1)+'\n',{flag:'wx'});return {path:out,frames:frames.length,pages:pages.length};
}
async function motion(){
 const specs=[['red-open','run:steam','蒸気の弁を開けて'],['red-close','run:shut','閉じます'],['blue-open','run:spray','開けます'],['piston-contact','arm:mio','持ち上げる'],['lid-open','pump:down','開きます'],['lid-close','pump:up','閉じます'],['water-lift','pump:up','持ち上げます'],['foot-open','pump:refill','底の弁が開き'],['drain-open','drain:out','弁を押し開けて'],['tank-water','tank:self','水槽へ上げる'],['hand-valve-contact','lever:hand','手で開け閉め'],['tappet-contact','lever:tappet','レバーを下から押し'],['tappet-contact-return','lever:tappet','レバーを上から押します']];
 const out=path.join(CACHE,'S3-review/motion-30fps'),dir=path.join(out,'frames');assert.equal(fs.existsSync(out),false);await fsp.mkdir(dir,{recursive:true});
 const windows=specs.map(([name,key,word])=>{
  const c=DATA.cues.find(c=>c.key===key),event=c?.wordEvents.find(w=>w.word===word);assert.ok(event,'Missing exact supplied word: '+key+' '+word);
  return {name,cue:key,word,triggerSeconds:event.time,from:Math.max(Math.ceil(c.start*30-1e-8),Math.floor((event.time-.4)*30)),to:Math.min(Math.ceil(c.end*30-1e-8)-1,Math.ceil((event.time+1.4)*30))};
 });
 const indices=[...new Set(windows.flatMap(w=>Array.from({length:w.to-w.from+1},(_,i)=>w.from+i)))].sort((a,b)=>a-b);
 const select=windows.map(w=>`between(n\\,${w.from}\\,${w.to})`).join('+');
 const p=await run('07-motion-extract',FF,['-n','-v','error','-i',DRAFT,'-vf','select='+select,'-fps_mode','passthrough','-q:v','2',path.join(dir,'seq-%05d.jpg')]);assert.equal(p.exitCode,0,'Motion extraction failed');
 const files=fs.readdirSync(dir).filter(n=>/^seq-\d+\.jpg$/.test(n)).sort();assert.equal(files.length,indices.length);
 const frames=[];
 for(let i=0;i<indices.length;i++){stopCheck();const frame=indices[i],image=path.join(dir,String(frame).padStart(5,'0')+'.jpg');await fsp.rename(path.join(dir,files[i]),image);frames.push({frame,time:frame/30,image});}
 for(const w of windows){const f=frames.filter(f=>f.frame>=w.from&&f.frame<=w.to);w.pages=await sheets(f,path.join(out,w.name),{width:216,height:384,cols:5,per:15});w.frameCount=f.length;}
 fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify({method:'Consecutive actual encoded30fps frames; -0.4 to+1.4s around exact supplied words, bounded to each cue',windows,frames,viewed:false},null,1)+'\n',{flag:'wx'});
 return {path:out,windows:windows.length,uniqueFrames:frames.length,pages:windows.reduce((s,w)=>s+w.pages.length,0)};
}
function filesUnder(root){
 const out=[];function walk(dir){for(const n of fs.readdirSync(dir).sort()){const p=path.join(dir,n),s=fs.lstatSync(p);assert.equal(s.isSymbolicLink(),false,'Backup must contain no symlinks: '+p);if(s.isDirectory())walk(p);else if(s.isFile())out.push({path:p,relative:path.relative(root,p),size:s.size,mode:s.mode,mtime:s.mtime,atime:s.atime});else throw Error('Unsupported backup object: '+p);}}walk(root);return out;
}
async function backup(){
 stopCheck();assert.equal(fs.existsSync(DEST),false);const files=filesUnder(CACHE);await fsp.mkdir(DEST,{recursive:true});let bytes=0;
 for(const f of files){stopCheck();const dest=path.join(DEST,f.relative);await fsp.mkdir(path.dirname(dest),{recursive:true});await fsp.copyFile(f.path,dest,fs.constants.COPYFILE_EXCL);await fsp.chmod(dest,f.mode);await fsp.utimes(dest,f.atime,f.mtime);bytes+=f.size;}
 const copied=filesUnder(DEST);assert.equal(copied.length,files.length);let verified=0;
 for(const f of files){stopCheck();const dest=path.join(DEST,f.relative);assert.equal(fs.statSync(dest).size,f.size);assert.equal(await sha(f.path),await sha(dest),'Backup content mismatch: '+f.relative);verified++;}
 const after=filesUnder(CACHE);assert.deepEqual(after.map(f=>[f.relative,f.size]),files.map(f=>[f.relative,f.size]),'Cache changed during backup');
 return {path:DEST,files:files.length,bytes,allFilesSha256Compared:verified,symlinks:0,filesAreRealCopies:true};
}
async function nonfatal(name,fn){
 try{return await fn();}catch(e){if(e.stopped)throw e;const item={name,failed:true,error:String(e)};report.steps.push(item);save();console.error(name,e);return item;}
}
save();
try{
 stopCheck();assert.equal(sourceKey(),KEY,'Current source is not the requested candidate');await waitForFinished();
 for(const p of [DRAFT,QA,path.join(CACHE,'verify'),path.join(CACHE,'review'),path.join(CACHE,'gate'),path.join(CACHE,'quality-gate.json'),path.join(CACHE,'S3-review')])assert.equal(fs.existsSync(p),false,'Preserve previous result; review manually before rerun: '+p);
 const exported=await run('01-export',process.execPath,['scripts/umech/desk-d1b-export_s3_20261026.mjs','--source-key',KEY,'--adopt-2d-primary','--qa-copy']);
 assert.equal(exported.exitCode,0,'Export failed; no later checks/backup will be started');assert.ok(fs.existsSync(DRAFT)&&fs.existsSync(QA));
 assert.equal(sourceKey(),KEY,'Source changed during export');
 await run('02-qx-real-native',process.execPath,['scripts/umech/qx-verify.mjs',ID,DRAFT]);
 await run('02-quality-gate',process.execPath,['--import','./scripts/umech/desk-d1b-hooks_s3_20261026.mjs','--import','./scripts/umech/desk-d1b-caption165-loader_s3_20261026.mjs','scripts/umech/desk-quality-gate.mjs',ID,'--cache',CACHE,'--mp4',QA,'--ref','ys-chain-1-1v6','--require-primary','--md',md,'--script',script]);
 report.gateResult=await nonfatal('qualityGateReportParsing',async()=>{if(!fs.existsSync(path.join(CACHE,'quality-gate.json')))return {missingReport:true};const g=JSON.parse(fs.readFileSync(path.join(CACHE,'quality-gate.json')));return {path:path.join(CACHE,'quality-gate.json'),NG:g.results.filter(r=>r.status==='NG').map(r=>r.no),primary:g.results.filter(r=>['7c','7d'].includes(String(r.no)))};});save();
 await run('03-cue-review',process.execPath,['--import','./scripts/umech/desk-d1b-hooks_s3_20261026.mjs','scripts/umech/mxr-review.mjs']);
 report.oneHz=await nonfatal('oneHzContactGeneration',oneHz);save();
 report.motion=await nonfatal('motionContactGeneration',motion);save();
 report.backup=await backup();report.state='S3 artifacts and mechanical results saved; awaiting human/Claude review';report.endedAt=new Date().toISOString();save();
 console.log(JSON.stringify({receipt,backup:DEST,oneHz:report.oneHz,motion:report.motion,qualityGateNG:report.gateResult?.NG??null,allMoviePass:false,S4Started:false}));
}catch(e){
 report.state=e.stopped?'stopped':'failed';report.error=String(e);report.endedAt=new Date().toISOString();save();console.error(e);process.exitCode=e.stopped?2:1;
}

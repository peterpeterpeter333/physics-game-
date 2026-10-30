// Read-only inspection of the FINISHED encoded B-2a S3 MP4, never Blender/raw.
// Default/--plan: print exact spoken triggers only; no media extraction or writes.
// --run --mp4 FILE --export RECORD --out NEW_DIRECTORY: decode actual video
// frames, validate global-frame PTS, and create all-episode/critical sheets.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
import {normKana} from './yt1-chain-00bx-common.mjs';

const W=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const C='/private/tmp/ys/ys-chain-b2a_s3_gpt_20261029';
const ID='ys-chain-b2a_gpt_20261029',FPS=30;
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const argv=process.argv.slice(2),opt=(name,fallback=null)=>{const i=argv.indexOf(name);return i<0?fallback:argv[i+1];};
const DATA_FILE=path.join(C,'blender/b2a-scene-data.json'),PHRASE_FILE=path.join(C,'phrase-times.json');
const DATA=read(DATA_FILE),PT=read(PHRASE_FILE),NF=DATA.frames;
assert.equal(DATA.id,ID);assert.equal(DATA.fps,FPS);assert.equal(NF,Math.ceil(DATA.duration*FPS));
const inputHashes={[DATA_FILE]:sha(DATA_FILE),[PHRASE_FILE]:sha(PHRASE_FILE)};
const regex=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');

function exactWord(row,word,occ=0){
 const needle=normKana(word),pattern=new RegExp(regex(needle).replace(/[ウオ]/g,'[ウオ]'),'g'),hits=[];
 for(const q of DATA.cues.filter(q=>q.row===row)){
  const marks=PT[q.subtitle];assert.ok(marks&&marks.kana===(q.kana??null),'Missing original Nemo timing '+q.key);
  for(const match of marks.s.matchAll(pattern)){
   const rel=marks.t[match.index];assert.ok(Number.isFinite(rel));
   hits.push({row,cue:q.key,cueKey:q.cueKey,word,occ,time:q.start+rel,phoneticMatch:match[0],source:'Frozen actual Nemo character timing, not proportional/fallback timing'});
  }
 }
 assert.ok(hits.length>occ,'Missing exact original spoken trigger '+row+'/'+word+'/'+occ);
 return hits[occ];
}

function windows(){
 const specs=[
  ['01-intro-cloth',1,null,.45,.30,.85,'Cloth rises once; no spoken caption during the first two seconds.'],
  ['02-metal-join',10,'フレアワセル',null,.20,1.25,'Rod-contact macro lasts about one second; return to the complete loop.'],
  ['03-first-kick',10,'ピクット',null,.22,.88,'No anticipation before word minus 0.1 s; 0.15 s rise, 0.4 s recovery.'],
  ['04-release-still',11,'ハナスト',null,.15,.85,'Opening the metal contact must not trigger another kick.'],
  ['05-rejoin',11,'フレアワセル',null,.20,1.20,'Both tips approach, meet, and the complete loop returns.'],
  ['06-second-kick',11,'マタウゴキマス',null,.20,.85,'The second contact causes a visible second kick.'],
  ['07-static-spark',13,'ヒバナ',null,.25,.65,'White spark for 0.2 s; positive marks disappear with it.'],
  ['08-scalpel-contact',19,'メスガフレテイル',null,.20,1.0,'Knife blade touches the nerve; the hand must hold the handle.'],
  ['09-scalpel-kick',19,'ピクットケッタ',null,.20,.85,'Return from nerve contact to the full foot for the kick.'],
  ['10-same-metal-weak',25,'ヨワクナリマス',null,.20,.85,'Left foot moves weakly, about five degrees.'],
  ['11-different-metal-strong',25,'ツヨクウゴイタ',null,.20,.85,'Right foot rises about thirty degrees, with labels above each foot.'],
  ['12-salty-cutaway',29,'カエルノカラダノナカ',null,.20,1.25,'Foot cross-section and blue water drops must be present within the camera.'],
  ['13-stacked-units',31,'ナンジュックミモカサネマシタ',null,.15,3.35,'Zn/wet-paper/Cu units stack, not single same-color discs.'],
  ['14-finger-loop',32,'ビリット',null,.20,1.0,'Both ends are contacted and the yellow loop crosses all units and the body.'],
  ['15-gold-leaf-opens',33,'ハガヒライタ',null,.25,1.0,'The leaf pair opens during 0.6 s; the result remains visible.'],
  ['16-static-comparison',39,'パチッ',null,.20,.65,'Left glass rod flashes once and loses its positive marks.'],
  ['17-continuous-contact',39,'サワッテイルアイダ',null,.25,1.6,'Right-side contact continues; do-not-imitate label remains visible.'],
  ['18-dry-paper',42,'カワイタアツガミ',null,.20,1.8,'Wet-paper layers become visibly white/dry; no answer is prematurely added.'],
  ['19-final-reveal',43,null,DATA.rows.find(r=>r.row===43).start,.0,1.2,'Cloth is removed before nerve/brass/iron tags appear.'],
  ['20-final-kick',43,null,DATA.duration-1.15,.25,.9,'Last contact and kick repeat the opening camera; hand comes from the handle side.']
 ];
 return specs.map(([id,row,word,fixed,before,after,purpose])=>{
  const event=word?exactWord(row,word):{row,word:null,cue:null,time:fixed,source:'Explicit storyboard action, not a spoken-word estimate'};
  const rowData=DATA.rows.find(r=>r.row===row),start=Math.max(rowData.start,event.time-before),end=Math.min(rowData.end-1/FPS,event.time+after);
  const first=Math.max(0,Math.ceil(start*FPS-1e-8)),last=Math.min(NF-1,Math.floor(end*FPS+1e-8));
  assert.ok(first<=last);
  return {id,...event,purpose,reviewStart:first/FPS,reviewEnd:last/FPS,first,last,frameCount:last-first+1,requestedBefore:before,requestedAfter:after};
 });
}

const WINDOWS=windows();
const defaultMovie=path.join(C,'draft',ID+'_s3_draft.mp4');
const MP4=path.resolve(opt('--mp4',defaultMovie));
const EXPORT=path.resolve(opt('--export',MP4.replace(/\.mp4$/,'')+'.export.json'));
const OUT=path.resolve(opt('--out',path.join(W,'outputs/ys-chain-b2a-backup/S3_20261029/actual-video-review')));
if(!argv.includes('--run')){
 console.log(JSON.stringify({preparedOnly:true,writes:0,sourceRawOrAnchorsRead:false,mp4:MP4,exportRecord:EXPORT,output:OUT,fps:FPS,frames:NF,duration:DATA.duration,oneHzFrames:Math.ceil(NF/FPS),windows:WINDOWS},null,2));
}else{
 assert.ok(fs.existsSync(MP4)&&fs.existsSync(EXPORT),'Wait for the finished encoded MP4 AND final export record.');
 const ex=read(EXPORT),mp4Sha=sha(MP4),exportSha=sha(EXPORT);
 assert.equal(ex.stage,'S3');assert.equal(path.resolve(ex.video),MP4);assert.equal(ex.fps,FPS);
 assert.deepEqual(ex.resolution,[540,960]);assert.equal(ex.encodedFrames??ex.inputFrames??ex.frames,NF);
 assert.equal(ex.suppliedVoiceUnchanged,true);assert.equal(ex.allFrameDecode,true,'Export must decode every encoded frame first');
 assert.equal(ex.videoSha256,mp4Sha,'MP4 differs from the completed export record.');
 assert.ok(!fs.existsSync(OUT),'Preserve earlier audits; choose a fresh --out directory.');
 assert.ok(!OUT.startsWith(C+path.sep),'Review files must not modify the live rendering cache.');
 const ff=process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
 assert.ok(fs.existsSync(ff));fs.mkdirSync(OUT,{recursive:true});
 const decodedDir=path.join(OUT,'decoded-actual-png');fs.mkdirSync(decodedDir);
 const oneHz=Array.from({length:Math.ceil(NF/FPS)},(_,i)=>i*FPS),critical=WINDOWS.flatMap(w=>Array.from({length:w.last-w.first+1},(_,i)=>w.first+i));
 const indices=[...new Set([...oneHz,...critical,NF-1])].sort((a,b)=>a-b);
 const select=['not(mod(n\\,30))',...WINDOWS.map(w=>`between(n\\,${w.first}\\,${w.last})`),`eq(n\\,${NF-1})`].join('+');
 const args=['-n','-hide_banner','-loglevel','info','-i',MP4,'-an','-vf',`select=${select},showinfo`,'-fps_mode','passthrough','-start_number','0',path.join(decodedDir,'seq-%05d.png')];
 console.log('Decoding finished MP4 only:',indices.length,'exact selected frames');
 const decoded=spawnSync(ff,args,{encoding:'utf8',maxBuffer:32*1024*1024});
 fs.writeFileSync(path.join(OUT,'ffmpeg-exact-png-decode.log'),decoded.stderr??'',{flag:'wx'});
 assert.equal(decoded.status,0,'Exact video decoding failed; partial review is preserved.');
 const timeBase=/config in time_base:\s*(\d+)\/(\d+)/.exec(decoded.stderr);assert.ok(timeBase,'No encoded PTS time base.');
 const num=+timeBase[1],den=+timeBase[2],selected=[...(decoded.stderr??'').matchAll(/\bn:\s*(\d+)\s+pts:\s*(-?\d+)/g)].map(m=>({n:+m[1],pts:+m[2]}));
 assert.equal(selected.length,indices.length,'Every selected global frame must exist exactly once.');
 assert.equal(fs.readdirSync(decodedDir).filter(x=>/^seq-\d+\.png$/.test(x)).length,indices.length);
 const frames=[];
 for(let i=0;i<indices.length;i++){
  const j=indices[i],src=path.join(decodedDir,'seq-'+String(i).padStart(5,'0')+'.png'),file=path.join(decodedDir,String(j).padStart(5,'0')+'.png');
  assert.equal(selected[i].n,i);assert.equal(selected[i].pts*num*FPS,j*den,'PTS is not the exact global frame '+j);
  assert.ok(!fs.existsSync(file));fs.renameSync(src,file);
  const m=await sharp(file).metadata();assert.equal(m.width,540);assert.equal(m.height,960);
  const row=DATA.rows.findLast(r=>j/FPS>=r.start);
  frames.push({frame:j,time:j/FPS,pts:selected[i].pts,image:file,pngSha256:sha(file),masterRow:row?.row,fromActualEncodedVideo:true,viewed:false});
 }
 const frameMap=new Map(frames.map(f=>[f.frame,f]));
 const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
 async function sheets(list,dir,title,{per=10,cols=5,tw=260,th=462}={}){
  fs.mkdirSync(dir);const pages=[],labelH=35,head=38,pad=12;
  for(let from=0;from<list.length;from+=per){
   const group=list.slice(from,from+per),width=cols*(tw+pad)+pad,height=head+Math.ceil(per/cols)*(th+labelH+pad)+pad,layers=[];
   const header=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${head}"><rect width="100%" height="100%" fill="#17202e"/><text x="12" y="26" font-family="Arial" font-size="18" fill="white">${escape(title)} | ${from+1}-${from+group.length}</text></svg>`);
   layers.push({input:header,left:0,top:0});
   for(let k=0;k<group.length;k++){
    const f=group[k],x=pad+(k%cols)*(tw+pad),y=head+pad+Math.floor(k/cols)*(th+labelH+pad);
    const label=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${tw}" height="${labelH}"><rect width="100%" height="100%" fill="#f8f6f0"/><text x="7" y="24" font-family="Arial" font-size="17" fill="#111">row ${f.masterRow} | ${f.time.toFixed(3)} s | #${f.frame}</text></svg>`);
    layers.push({input:label,left:x,top:y},{input:await sharp(f.image).resize(tw,th).png().toBuffer(),left:x,top:y+labelH});
   }
   const file=path.join(dir,'page-'+String(pages.length+1).padStart(3,'0')+'.jpg');
   await sharp({create:{width,height,channels:3,background:'#ded8ce'}}).composite(layers).jpeg({quality:94,chromaSubsampling:'4:4:4'}).toFile(file);
   pages.push({image:file,frames:group.map(f=>f.frame),viewed:false});
  }
  return pages;
 }
 const sampled=oneHz.map(j=>frameMap.get(j)),oneHzPages=await sheets(sampled,path.join(OUT,'one-hz'),'B-2a S3 | actual encoded MP4 | 1 Hz, exact frame numbers');
 const inspectedWindows=[];
 for(const w of WINDOWS){
  const list=Array.from({length:w.frameCount},(_,i)=>frameMap.get(w.first+i));
  const pages=await sheets(list,path.join(OUT,w.id),`${w.id} | cue ${w.cue??'-'} | trigger ${w.time.toFixed(6)} s`,{per:15,cols:5,tw:216,th:384});
  const picks=[w.first,Math.min(w.last,Math.max(w.first,Math.round(w.time*FPS))),Math.min(w.last,Math.max(w.first,Math.round((w.time+.15)*FPS))),w.last];
  inspectedWindows.push({...w,pages,frames:list,selectedNative:[...new Set(picks)].map(j=>frameMap.get(j)),visualReviewPerformed:false});
 }
 assert.equal(sha(MP4),mp4Sha,'MP4 changed during audit.');assert.equal(sha(EXPORT),exportSha);
 for(const [file,hash]of Object.entries(inputHashes))assert.equal(sha(file),hash,'Frozen timing input changed.');
 const manifest={kind:'B-2a S3 actual-encoded-video review',source:MP4,sourceSha256:mp4Sha,exportRecord:EXPORT,exportRecordSha256:exportSha,id:ID,fps:FPS,encodedFrames:NF,resolution:[540,960],duration:DATA.duration,decodedFrames:indices.length,decodeMethod:'Full sequential MP4 decode with select on integer global n, no seek, no nearest-frame fallback',nativeExtractFormat:'Lossless PNG from the actual decoded MP4; contact sheets only are JPEG',encodedTimeBase:[num,den],exactPTSValidated:true,neighborFallback:false,sourceRawOrAnchorsRead:false,sourceOrCacheWritten:false,frozenTimingHashes:inputHashes,oneHz:{frames:sampled,pages:oneHzPages,viewed:false},lastEncodedFrame:frameMap.get(NF-1),windows:inspectedWindows,allVisualsReviewed:false,audioEarReviewPerformed:false,scope:'Extracted images exist and exact PTS/counts were checked; neither extraction nor automatic success means a human/model actually viewed the images or heard the audio.'};
 fs.writeFileSync(path.join(OUT,'actual-video-review-manifest.json'),JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({output:OUT,oneHzFrames:sampled.length,oneHzPages:oneHzPages.length,criticalWindows:inspectedWindows.length,criticalPages:inspectedWindows.reduce((n,w)=>n+w.pages.length,0),uniqueDecodedFrames:indices.length,exactPTSValidated:true,allVisualsReviewed:false,audioEarReviewPerformed:false},null,2));
}

// Read-only extraction from the FINISHED encoded S3 MP4. No CACHE/source writes.
// Run: node THIS --run. Refuses to start until MP4 + export record both exist.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import sharp from 'sharp';

const W=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const CACHE='/private/tmp/ys/ys-chain-d1b_s3_gpt_20261026';
const DRAFT=path.join(CACHE,'draft/ys-chain-d1b_draft.mp4');
const EXPORT=path.join(CACHE,'draft/s3-export_20261026.json');
const OUT=path.join(W,'outputs/ys-chain-d1b-backup/S3_20261026/extra-motion-review');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const data=read(path.join(CACHE,'blender/data.json'));
const phrases=read(path.join(CACHE,'phrase-times.json'));
const cue=k=>{const q=data.cues.find(c=>c.key===k);assert.ok(q,k);return q;};
const word=(k,text)=>{const hits=cue(k).wordEvents.filter(w=>w.word===text);assert.equal(hits.length,1,text);return hits[0].time;};
const phrase=(k,text)=>{const c=cue(k),p=phrases[c.subtitle],i=p.s.indexOf(text);assert.ok(i>=0);assert.equal(p.s.indexOf(text,i+1),-1);return c.start+p.t[i];};
const weak=word('quiz:weak','弱くなります');
const opening=word('parts:likecan','中まで開けて');
const tap=word('valve:tap','水道の蛇口');
const last=phrase('last:valve','ベンデシタ');
const windows=[
 {id:'01-opening-hand',cue:'open:machine',word:'cue start',wordTime:cue('open:machine').start,start:0,end:1.2},
 {id:'02-fuji-wordflash',cue:'quiz:weak',word:'弱くなります',wordTime:weak,start:weak,end:weak+1.65},
 {id:'03-hinged-covers',cue:'parts:likecan',word:'中まで開けて',wordTime:opening,start:opening-.20,end:opening+2.05,
  reason:'Actual trigger is64.95, earlier than the approximate65.3; include pre-open and the full0.8s swing.'},
 {id:'04-tap-water',cue:'valve:tap',word:'水道の蛇口',wordTime:tap,start:tap+.60,end:tap+1.90},
 {id:'05-final-valve-return',cue:'last:valve',word:'PHRASE ベンデシタ',wordTime:last,start:last,end:Math.min(cue('last:valve').end-.30,last+2.30),
  wideReturnStart:cue('last:valve').end-1.7,wideReturnComplete:cue('last:valve').end-1.1},
].map(w=>({...w,first:Math.ceil(w.start*30-1e-8),last:Math.floor(w.end*30+1e-8)}));

assert.ok(process.argv.includes('--run'),'Prepared only. Pass --run after final DRAFT and export record exist.');
assert.ok(fs.existsSync(DRAFT)&&fs.existsSync(EXPORT),'Wait for completed MP4 AND export record.');
const exported=read(EXPORT);
assert.equal(exported.stage,'S3');assert.deepEqual(exported.resolution,[540,960]);assert.equal(exported.fps,30);
assert.equal(path.resolve(exported.video),DRAFT);assert.equal(exported.suppliedVoiceUnchanged,true);
assert.ok(exported.sourceKey);assert.ok(exported.frames>14700);
assert.equal(fs.existsSync(OUT),false,'Never overwrite an earlier motion review.');
assert.ok(!OUT.startsWith(CACHE+path.sep),'Review outputs must be outside CACHE.');
const ff=process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
assert.ok(fs.existsSync(ff));
const expected=windows.flatMap(w=>Array.from({length:w.last-w.first+1},(_,i)=>w.first+i));
assert.equal(new Set(expected).size,expected.length,'Windows must not overlap.');
assert.ok(expected.every(j=>j>=0&&j<exported.frames));
fs.mkdirSync(OUT);const tmp=path.join(OUT,'decoded-exact');fs.mkdirSync(tmp);
const select=windows.map(w=>`between(n\\,${w.first}\\,${w.last})`).join('+');
const args=['-n','-hide_banner','-loglevel','info','-i',DRAFT,'-an','-vf',`select=${select},showinfo`,
 '-vsync','0','-frames:v',String(expected.length),'-start_number','0',path.join(tmp,'%05d.png')];
const decoded=spawnSync(ff,args,{encoding:'utf8',maxBuffer:16*1024*1024});
fs.writeFileSync(path.join(OUT,'ffmpeg-selected-frames.log'),decoded.stderr??'',{flag:'wx'});
assert.equal(decoded.status,0,'Exact encoded-frame decoding failed; preserve partial review.');
const tb=/config in time_base:\s*(\d+)\/(\d+)/.exec(decoded.stderr);assert.ok(tb,'Missing encoded PTS time base.');
const num=Number(tb[1]),den=Number(tb[2]);
const selected=[...decoded.stderr.matchAll(/\bn:\s*(\d+)\s+pts:\s*(-?\d+)/g)].map(m=>({n:Number(m[1]),pts:Number(m[2])}));
assert.equal(selected.length,expected.length,'No missing/extra/neighbor frames are permitted.');
for(let i=0;i<expected.length;i++){
 assert.equal(selected[i].n,i);
 assert.equal(selected[i].pts*num*30,expected[i]*den,'PTS must equal the exact original global frame/30.');
}
assert.equal(fs.readdirSync(tmp).filter(f=>f.endsWith('.png')).length,expected.length);
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
let cursor=0;const results=[];
for(const window of windows){
 const dir=path.join(OUT,window.id);fs.mkdirSync(dir);const frames=[];
 for(let j=window.first;j<=window.last;j++){
  const src=path.join(tmp,String(cursor).padStart(5,'0')+'.png'),dest=path.join(dir,String(j).padStart(5,'0')+'.png');
  assert.equal(fs.existsSync(dest),false);fs.renameSync(src,dest);
  const meta=await sharp(dest).metadata();assert.equal(meta.width,540);assert.equal(meta.height,960);
  frames.push({frame:j,time:j/30,pts:selected[cursor].pts,path:dest});cursor++;
 }
 const cols=8,tw=135,th=240,label=24,header=48,rows=Math.ceil(frames.length/cols),layers=[];
 const title=`${window.id} | word ${window.wordTime.toFixed(6)} s | 30fps CONSECUTIVE encoded frames`;
 layers.push({input:Buffer.from(`<svg width="1080" height="48"><rect width="1080" height="48" fill="#182335"/><text x="12" y="30" font-family="Arial" font-size="19" fill="white">${esc(title)}</text></svg>`),left:0,top:0});
 for(let i=0;i<frames.length;i++){
  const f=frames[i],x=(i%cols)*tw,y=header+Math.floor(i/cols)*(th+label);
  layers.push({input:await sharp(f.path).resize(tw,th).toBuffer(),left:x,top:y+label});
  layers.push({input:Buffer.from(`<svg width="135" height="24"><rect width="135" height="24" fill="#182335"/><text x="4" y="17" font-family="Arial" font-size="13" fill="white">${f.time.toFixed(3)} #${f.frame}</text></svg>`),left:x,top:y});
 }
 const page=path.join(OUT,window.id+'-all-consecutive.jpg');
 await sharp({create:{width:cols*tw,height:header+rows*(th+label),channels:3,background:'#182335'}}).composite(layers).jpeg({quality:95}).toFile(page);
 const picks=[0,Math.floor((frames.length-1)/2),frames.length-1];
 results.push({...window,actualStart:frames[0].time,actualEnd:frames.at(-1).time,frameCount:frames.length,page,
  selectedNative:picks.map(i=>frames[i]),frames});
 console.log(page);
}
const sha=createHash('sha256');for await(const part of fs.createReadStream(DRAFT))sha.update(part);
const manifest={kind:'additional-encoded-mp4-motion-review',source:DRAFT,exportRecord:EXPORT,sourceKey:exported.sourceKey,
 sourceSha256:sha.digest('hex'),nativeResolution:[540,960],fps:30,decodedFrames:expected.length,
 exactPTSValidated:true,neighborFallback:false,sourceOrCacheWritten:false,audioEarReviewPerformed:false,
 windows:results,visualReviewPerformed:false};
fs.writeFileSync(path.join(OUT,'motion-review-manifest.json'),JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({output:OUT,decodedFrames:expected.length,pages:results.map(w=>w.page),visualReviewPerformed:false}));

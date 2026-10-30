// Additive, read-only actual-MP4 review aid. Root alone authorizes --go.
// No Blender, render queue, audio/caption generation, old-result overwrite,
// gate changes, or duplicate every-second extraction.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const W=path.resolve(fileURLToPath(new URL('../..',import.meta.url)));
const C7='/private/tmp/ys/ys-chain-b2a_s4r03_gpt_20261030';
const C6='/private/tmp/ys/ys-chain-b2a_s4earth_gpt_20261030';
const R7=path.join(W,'outputs/ys-chain-b2a-backup/S4修正03_20261030');
const ROOT=path.join(R7,'実MP4確認');
const ID='ys-chain-b2a_gpt_20261029_s4_final';
const OLD=path.join(C6,'out',ID+'.mp4'),NEW=path.join(C7,'out',ID+'.mp4');
const FF='/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
const MANIFEST=path.join(R7,'連続試写_manifest.json');
const S3=path.join(R7,'S3連続試写_03/字幕札つき確認/composition-audit.json');
const DATA=path.join(C7,'blender/b2a-scene-data.json');
const FPS=30,NF=14846,STRIDE=3,HALO=6;
const ROWS=[9,13,19,21,22,23,27,36];
const arg=(flag,fallback)=>{const i=process.argv.indexOf(flag);return i<0?fallback:process.argv[i+1];};
const output=path.resolve(arg('--out',path.join(ROOT,'差分と重要動作_01')));
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const save=(p,obj)=>fs.writeFileSync(p,JSON.stringify(obj,null,2)+'\n',{flag:'wx'});
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
async function hash(file){
 const stat=fs.lstatSync(file);assert.ok(stat.isFile()&&!stat.isSymbolicLink(),'Real input required: '+file);
 const h=createHash('sha256');for await(const chunk of fs.createReadStream(file))h.update(chunk);return h.digest('hex');
}
function rowFor(j,rows){
 const seconds=j/FPS;
 return [...rows].reverse().find(r=>seconds>=r.start)??rows[0];
}
function planning(){
 const data=read(DATA),manifest=read(MANIFEST),s3=read(S3);
 assert.equal(data.frames,NF);assert.equal(manifest.fps,FPS);
 assert.equal(manifest.windows.length,5);
 const events=[];
 for(const window of manifest.windows){
  for(const item of window.criticalFrames){
   const j=typeof item==='number'?item:item.j;
   assert.ok(Number.isInteger(j)&&j>=window.fromFrame&&j<window.toFrameExclusive);
   events.push({window:window.id,j,label:typeof item==='number'?'critical':item.label,
                row:rowFor(j,data.rows).row,first:Math.max(0,j-HALO),last:Math.min(NF-1,j+HALO)});
  }
 }
 assert.equal(events.length,24);
 const prefer={13:'spark',19:'kick-peak',21:'hypothesis-mark',
               22:'one-loop-middle',27:'smoke-lamp-waves-foot',
               36:'glyph-and-label-strike'};
 const pairs=[];
 for(const row of ROWS){
  const r=data.rows.find(r=>r.row===row);assert.ok(r);
  const critical=prefer[row]
   ? events.find(e=>e.row===row&&e.label===prefer[row])
   : s3.records.find(e=>e.row===row&&e.name===(row===9?'09_name':'23_face'));
  assert.ok(critical,'Missing explicit S3 critical sample for row '+row);
  const selected=[{reason:'start',j:Math.ceil(r.start*FPS)},
   {reason:'middle',j:Math.floor((r.start+r.end)*FPS/2)},
   {reason:'critical: '+(critical.label??critical.name),j:critical.j},
   {reason:'end',j:Math.ceil(r.end*FPS)-1}];
  for(const sample of selected){
   assert.equal(rowFor(sample.j,data.rows).row,row);
   pairs.push({row,...sample,seconds:sample.j/FPS,absoluteIndex:true});
  }
 }
 // Each source event receives its exact first/center/last j plus stride<=3
 // across that whole +/-0.2sec window. Overlap is deduplicated, never dropped.
 const byJ=new Map();
 for(const e of events){
  const indices=new Set([e.first,e.j,e.last]);
  for(let j=e.first;j<=e.last;j+=STRIDE)indices.add(j);
  e.sampledIndices=[...indices].sort((a,b)=>a-b);
  assert.equal(e.sampledIndices[0],e.first);
  assert.equal(e.sampledIndices.at(-1),e.last);
  assert.ok(e.sampledIndices.includes(e.j));
  assert.ok(e.sampledIndices.every((j,i,a)=>!i||j-a[i-1]<=3));
  for(const j of e.sampledIndices){
   if(!byJ.has(j))byJ.set(j,{j,seconds:j/FPS,row:rowFor(j,data.rows).row,events:[]});
   byJ.get(j).events.push({window:e.window,criticalJ:e.j,label:e.label,
                           offsetFrames:j-e.j,endpoint:j===e.first||j===e.last,
                           exactCritical:j===e.j});
  }
 }
 const motion=[...byJ.values()].sort((a,b)=>a.j-b.j);
 const comparisons=[...new Set(pairs.map(p=>p.j))].sort((a,b)=>a-b);
 const after=[...new Set([...comparisons,...motion.map(s=>s.j)])].sort((a,b)=>a-b);
 return {data,events,pairs,motion,comparisons,after,
  plannedPages:{comparison:Math.ceil(pairs.length/16),motion:Math.ceil(motion.length/16)}};
}
function runFF(args){
 const p=spawnSync(FF,args,{encoding:'utf8',maxBuffer:12*1024*1024});
 assert.equal(p.status,0,p.stderr||p.error?.message||'ffmpeg failed');return p;
}
function extract(movie,indices,folder){
 assert.ok(!fs.existsSync(folder));fs.mkdirSync(folder);
 const select=indices.map(j=>'eq(n\\,'+j+')').join('+');
 runFF(['-hide_banner','-loglevel','error','-nostdin','-n','-i',movie,'-an',
        '-vf','select='+select+',scale=540:960:flags=lanczos',
        '-fps_mode','vfr','-q:v','2','-start_number','0',path.join(folder,'%04d.jpg')]);
 const names=fs.readdirSync(folder).filter(n=>/^\d{4}\.jpg$/.test(n)).sort();
 assert.equal(names.length,indices.length,'Exact decoded selected-frame count differs');
 return new Map(indices.map((j,i)=>[j,path.join(folder,names[i])]));
}
async function header(text,width,height=48){
 const lines=Array.isArray(text)?text:[text];
 return Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'">'+
  '<rect width="100%" height="100%" fill="#eef2f0"/>'+
  lines.map((s,i)=>'<text x="6" y="'+(18+i*18)+'" font-size="13" font-family="sans-serif">'+esc(s)+'</text>').join('')+'</svg>');
}
async function comparePages(plan,before,after){
 const pages=[];
 for(let start=0;start<plan.pairs.length;start+=16){
  const group=plan.pairs.slice(start,start+16),layers=[];
  for(let i=0;i<group.length;i++){
   const p=group[i],x=(i%4)*548,y=Math.floor(i/4)*536;
   const old=await sharp(before.get(p.j)).resize(264,469).toBuffer();
   const now=await sharp(after.get(p.j)).resize(264,469).toBuffer();
   layers.push({input:await header(['row'+p.row+' '+p.reason,
                 'SAME j='+p.j+' | '+p.seconds.toFixed(3)+'s | OLD / NEW'],536,56),left:x+4,top:y+4},
               {input:old,left:x+4,top:y+60},{input:now,left:x+272,top:y+60});
  }
  const file=path.join(output,'before-after-'+String(pages.length+1).padStart(2,'0')+'.jpg');
  assert.ok(!fs.existsSync(file));
  await sharp({create:{width:2192,height:2144,channels:3,background:'#d3d7d4'}})
   .composite(layers).jpeg({quality:95,chromaSubsampling:'4:4:4'}).toFile(file);
  pages.push({file,tileType:'one matched old/new pair per tile',pairs:group.map(p=>({...p,
              oldImage:before.get(p.j),newImage:after.get(p.j)}))});
 }
 return pages;
}
async function motionPages(plan,images){
 const pages=[];
 for(let start=0;start<plan.motion.length;start+=16){
  const group=plan.motion.slice(start,start+16),layers=[];
  for(let i=0;i<group.length;i++){
   const s=group[i],x=(i%4)*278,y=Math.floor(i/4)*536;
   const thumb=await sharp(images.get(s.j)).resize(270,480).toBuffer();
   const label=s.events.map(e=>e.label).join(' / ');
   layers.push({input:await header(['row'+s.row+' '+label,
                 'j='+s.j+' | '+s.seconds.toFixed(3)+'s'],270),left:x+4,top:y+4},
               {input:thumb,left:x+4,top:y+52});
  }
  const file=path.join(output,'critical-motion-'+String(pages.length+1).padStart(2,'0')+'.jpg');
  assert.ok(!fs.existsSync(file));
  await sharp({create:{width:1112,height:2144,channels:3,background:'#d3d7d4'}})
   .composite(layers).jpeg({quality:95,chromaSubsampling:'4:4:4'}).toFile(file);
  pages.push({file,samples:group.map(s=>({...s,image:images.get(s.j)}))});
 }
 return pages;
}
async function main(){
 const plan=planning();
 if(!process.argv.includes('--go')){
  assert.ok(process.argv.includes('--plan'),'Root GO required. Use --plan for read-only planning or --go for actual extraction.');
  console.log(JSON.stringify({readyForRootGO:true,inputs:{old:OLD,new:NEW},output,
   pairs:plan.pairs.length,criticalEvents:plan.events.length,motionFrames:plan.motion.length,
   uniqueNewFrames:plan.after.length,plannedPages:plan.plannedPages,
   totalPages:plan.plannedPages.comparison+plan.plannedPages.motion,extractsOrFilesWritten:0},null,2));
  return;
 }
 assert.ok(output.startsWith(ROOT+path.sep)&&!fs.existsSync(output),'Fresh child directory under R7/実MP4確認 required');
 const ffversion=runFF(['-version']).stdout;assert.match(ffversion,/ffmpeg version 7\.1/);
 const records=[];
 for(const [cache,movie] of [[C6,OLD],[C7,NEW]]){
  const meta=read(path.join(cache,'blender/desk/meta.json'));
  const exported=read(movie.replace(/\.mp4$/,'.export.json'));
  assert.equal(meta.frames,NF);assert.ok(meta.finished);
  assert.deepEqual(meta.resolution,[1080,1920]);assert.equal(meta.samples,16);
  assert.equal(exported.inputFrames,NF);assert.equal(exported.encodedFrames,NF);
  assert.equal(exported.allFrameDecode,true);assert.equal(exported.nativeCoverageComplete,true);
  assert.deepEqual(exported.resolution,[1080,1920]);
  const sha256=await hash(movie);assert.equal(sha256,exported.videoSha256);
  records.push({cache,movie,sha256,bytes:fs.statSync(movie).size,exportRecord:movie.replace(/\.mp4$/,'.export.json')});
 }
 const sourceHashes={manifest:await hash(MANIFEST),s3:await hash(S3),data:await hash(DATA)};
 fs.mkdirSync(ROOT,{recursive:true});fs.mkdirSync(output);
 const before=extract(OLD,plan.comparisons,path.join(output,'旧C6同一j'));
 const after=extract(NEW,plan.after,path.join(output,'新C7同一jと重要動作'));
 const comparisons=await comparePages(plan,before,after);
 const motion=await motionPages(plan,after);
 for(const r of records)assert.equal(await hash(r.movie),r.sha256,'Movie changed during review extraction');
 assert.equal(await hash(MANIFEST),sourceHashes.manifest);assert.equal(await hash(S3),sourceHashes.s3);
 assert.equal(await hash(DATA),sourceHashes.data);
 const qx=path.join(C7,'verify');
 const record={purpose:'Comparison and critical-motion aids from ACTUAL completed encoded MP4 files, not native raw or S3 trial images',
   generatedUtc:new Date().toISOString(),movies:{old:records[0],new:records[1]},
   sources:{manifest:MANIFEST,s3:S3,data:DATA,sha256:sourceHashes},
   nativeResolution:[1080,1920],reviewResolution:[540,960],fps:FPS,
   exactIndexExtraction:'ffmpeg7.1 decoded frame n == absolute j; no approximate -ss seeking',
   originalCaptionAndAudioEdited:false,oldFilesOverwritten:false,
   comparison:{rows:ROWS,pairs:plan.pairs.length,uniqueOldFrames:plan.comparisons.length,pages:comparisons},
   criticalMotion:{allManifestEvents:plan.events,uniqueFrames:plan.motion.length,
     strideFrames:STRIDE,maximumTemporalGapSeconds:STRIDE/FPS,
     eachEventFirstExactCriticalLastIncluded:true,haloSeconds:HALO/FPS,pages:motion},
   newlyExtractedUniqueFrames:plan.after.length,
   wholeVideoEverySecond:{generatedHere:false,directory:qx,expectedFrames:495,
     explanation:'Existing qx verifier produces the full495-frame /50-sheet inspection; not duplicated here'},
   claimedVisualReviewPerformed:false,earsPerformed:false,
   limitations:'10fps important-event samples with exact endpoints and critical j, not full30fps/equal-speed viewing; five continuous S3 trials exist separately'};
 save(path.join(output,'actual-mp4-review-manifest.json'),record);
 console.log(JSON.stringify({output,pairs:plan.pairs.length,criticalEvents:plan.events.length,
   newFrames:plan.after.length,motionFrames:plan.motion.length,
   pages:comparisons.length+motion.length,visualReviewStillRequired:true},null,2));
}
await main();


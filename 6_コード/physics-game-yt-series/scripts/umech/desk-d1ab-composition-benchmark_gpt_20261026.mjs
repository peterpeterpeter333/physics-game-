// Isolated, read-only-input RGB benchmark. Does not launch Blender or ffmpeg.
// Smoke: --episode d1b --smoke (10 archived preflight frames, not final QA).
// Full: --episode d1b --full (finished production cache: 50 times + every subtitle boundary).
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {performance} from 'node:perf_hooks';
import sharp from 'sharp';

const args=process.argv.slice(2),get=(key,fallback)=>{const i=args.indexOf(key);return i<0?fallback:args[i+1];};
const ep=get('--episode','d1b'),full=args.includes('--full');
assert.ok(['d1a','d1b'].includes(ep));
assert.notEqual(process.env.DESK_ALLOW_MISSING,'1','No nearby raw substitution is allowed.');
const id='ys-chain-'+ep,W=path.resolve(new URL('../..',import.meta.url).pathname);
const source=get('--source','/private/tmp/ys/'+id+'_gpt_20261026');
const archive=get('--raw-dir',full?source+'/blender/desk':source+'/blender/desk-preflight_gpt_20261026_1514');
const stamp=p=>({path:p,bytes:fs.statSync(p).size,sha256:crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')});
const reportRoot=path.join(W,'outputs/d1ab-gpt-20261026/qa');fs.mkdirSync(reportRoot,{recursive:true});
const isolated=fs.mkdtempSync(path.join(os.tmpdir(),'d1ab-compose-benchmark_gpt_20261026-'));
fs.mkdirSync(isolated+'/blender/desk',{recursive:true});
const inputs=[];
// The original renderer hashes this whole directory. Keep the same complete
// source inventory so an overlay/hook change after proof cannot go unnoticed.
const sourceInventory=fs.readdirSync(path.join(W,'scripts/umech')).filter(f=>f.endsWith('.mjs')).sort().map(f=>stamp(path.join(W,'scripts/umech',f)));
for(const f of ['plan.json',id+'.json','phrase-times.json','blender/data.json']){
 const src=path.join(source,f),dst=path.join(isolated,f);inputs.push(stamp(src));fs.copyFileSync(src,dst,fs.constants.COPYFILE_EXCL);
}
const anchorPath=path.join(archive,'anchors.json');inputs.push(stamp(anchorPath));fs.copyFileSync(anchorPath,isolated+'/blender/desk/anchors.json',fs.constants.COPYFILE_EXCL);
const anchors=JSON.parse(fs.readFileSync(anchorPath));assert.equal(anchors.fps,30);
if(full){const meta=JSON.parse(fs.readFileSync(path.join(archive,'meta.json')));assert.ok(typeof meta.finished==='string'&&/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(meta.finished),'Full equivalence requires the production finish() timestamp.');assert.notEqual(anchors.previewOnly,true);assert.equal(meta.key,anchors.key);}
process.env.EM_FILM_CACHE=isolated;delete process.env.DESK_ALLOW_MISSING;
await import(pathToFileURL(path.join(W,'scripts/umech/desk-'+ep+'-hooks_gpt_20261026.mjs')));
const {vertFrame}=await import(pathToFileURL(path.join(W,'scripts/umech/frame-vert.mjs')));
const {chunkTimes}=await import(pathToFileURL(path.join(W,'scripts/umech/desk-'+ep+'-deskframe_gpt_20261026.mjs')));
const entry=JSON.parse(fs.readFileSync(isolated+'/plan.json')).find(x=>x.id===id);
let clip=JSON.parse(fs.readFileSync(isolated+'/'+id+'.json'));
clip={...clip,...entry,duration:clip.duration,scenes:entry.scenes.map((s,j)=>({...s,start:clip.scenes[j].start,end:clip.scenes[j].end,captions:clip.scenes[j].captions}))};
clip.mediaDirectory=entry.mediaDirectory??'lessons';clip.animationFPS=30;
const nf=Math.ceil(clip.duration*30),reasons=new Map();
function add(j,why){j=Math.max(0,Math.min(nf-1,j));if(!reasons.has(j))reasons.set(j,[]);reasons.get(j).push(why);}
let subtitleBoundaries=[];
if(full){
 for(let i=0;i<50;i++)add(Math.round((nf-1)*i/49),'representative-50:'+i);
 for(const s of clip.scenes)for(let k=0;k<s.captions.length;k++){
  const cap=s.captions[k],q=s.cues[k];
  const bounds=[cap.start,...chunkTimes(q,cap).starts.slice(1),cap.end];
  for(let bi=0;bi<bounds.length;bi++){
   const t=bounds[bi],first=Math.ceil(t*30-1e-8);subtitleBoundaries.push({scene:s.index,cue:k,boundary:bi,time:t,before:Math.max(0,first-1),at:Math.min(nf-1,first)});
   add(first-1,'subtitle-before:'+s.index+':'+k+':'+bi);add(first,'subtitle-at:'+s.index+':'+k+':'+bi);
  }
 }
}else{
 const available=fs.readdirSync(archive).filter(x=>/^\d{5}\.jpg$/.test(x)).sort();assert.ok(available.length>=10);
 for(let i=0;i<10;i++)add(Number.parseInt(available[Math.floor((available.length-1)*i/9)]),'archived-smoke:'+i);
}
const frames=[...reasons.keys()].sort((a,b)=>a-b),rawInputs=[];
for(const j of frames){
 const name=String(j).padStart(5,'0')+'.jpg',src=path.join(archive,name),dst=path.join(isolated,'blender/desk',name);
 const before=stamp(src);fs.copyFileSync(src,dst,fs.constants.COPYFILE_EXCL);assert.equal(stamp(dst).sha256,before.sha256);assert.equal(stamp(src).sha256,before.sha256,'Raw changed while snapshotting.');rawInputs.push({...before,frame:j});
}
const sceneFor=t=>clip.scenes.find(s=>t>=s.start&&t<s.end)??clip.scenes.at(-1);
const svgFor=j=>{const t=j/30,svg=vertFrame(clip,sceneFor(t),t);assert.ok(svg&&!/NaN|undefined|Infinity/.test(svg));return svg;};
const rgb=svg=>sharp(Buffer.from(svg)).flatten({background:'#0b1122'}).removeAlpha().raw().toBuffer();
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
// Execute the actual two renderer loops, not a hand-retyped approximation.
// Their frame() function bodies and every byte outside the loop must match.
const rendererOriginal=path.join(W,'scripts/render-all-films-gptv2.mjs'),rendererCandidate=path.join(W,'scripts/render-all-films-d1ab-parallel_gpt_20261026.mjs');
const originalText=fs.readFileSync(rendererOriginal,'utf8'),candidateText=fs.readFileSync(rendererCandidate,'utf8');
const tail='\n child.stdin.end();const [code]=await finished;';
const oldStart=originalText.indexOf(' for(let j=0;j<Math.ceil(clip.duration*fps);j++){');
const newStart=candidateText.indexOf(' // D-1 isolated export candidate: only rasterization is prefetched.');
const oldEnd=originalText.indexOf(tail,oldStart),newEnd=candidateText.indexOf(tail,newStart);
assert.ok(oldStart>0&&newStart>0&&oldEnd>oldStart&&newEnd>newStart);
assert.equal(originalText.slice(0,oldStart),candidateText.slice(0,newStart),'Change outside final frame loop.');
assert.equal(originalText.slice(oldEnd),candidateText.slice(newEnd),'Change after final frame loop.');
const originalLoop=originalText.slice(oldStart,oldEnd),candidateLoop=candidateText.slice(newStart,newEnd);
const frameStart=originalText.indexOf('function frame(c,s,t){'),frameEnd=originalText.indexOf('\nfor(const [i,entry]',frameStart);
assert.ok(frameStart>0&&frameEnd>frameStart);
const productionFrame=new Function('vertFrame',originalText.slice(frameStart,frameEnd)+'\nreturn frame;')(vertFrame);
const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
const loopFn=body=>new AsyncFunction('clip','fps','frame','sharp','out','FW','FH','child','once','process',body);
const compiledSerial=loopFn(originalLoop),compiledParallel=loopFn(candidateLoop);
inputs.push(stamp(rendererOriginal),stamp(rendererCandidate));
// Warm the same production font path once. It is excluded from the timing.
await rgb(svgFor(frames[0]));
async function run(depth){
 const started=performance.now(),results=[],svgs=[],count=frames.length;
 const harnessClip={id,duration:count/30,scenes:[{start:0,end:count/30}]};
 const exactFrame=(_c,_s,t)=>{
  const i=Math.round(t*30),actualTime=frames[i]/30,svg=productionFrame(clip,sceneFor(actualTime),actualTime);
  assert.ok(svg&&!/NaN|undefined|Infinity/.test(svg));svgs[i]=hash(svg);return svg;
 };
 const child={stdin:{write(raw){const i=results.length;assert.equal(raw.length,1080*1920*3);results.push({frame:frames[i],rgbSha256:hash(raw),svgSha256:svgs[i]});return true;}}};
 const out=path.join(isolated,'loop-output-'+depth);fs.mkdirSync(out);
 await (depth===1?compiledSerial:compiledParallel)(harnessClip,30,exactFrame,sharp,out,1080,1920,child,()=>{throw Error('Unexpected mock backpressure');},{env:{D1AB_FRAME_LOOKAHEAD:String(depth)}});
 assert.equal(results.length,count);
 return {depth,seconds:(performance.now()-started)/1000,frames:results.length,results};
}
const serial=await run(1),parallel=await run(2);
assert.deepEqual(parallel.results,serial.results,'Ordered parallel RGB must be byte-identical.');
for(const p of [...inputs,...sourceInventory])assert.equal(stamp(p.path).sha256,p.sha256,'Input changed during benchmark: '+p.path);
assert.deepEqual(fs.readdirSync(path.join(W,'scripts/umech')).filter(f=>f.endsWith('.mjs')).sort(),sourceInventory.map(p=>path.basename(p.path)),'Composition source inventory changed during benchmark.');
const report={createdAt:new Date().toISOString(),episode:ep,mode:full?'final-input-equivalence':'archived-ten-frame-smoke',source,archive,isolated,inputs,sourceInventory,rawInputs,frames:frames.map(frame=>({frame,time:frame/30,reasons:reasons.get(frame)})),subtitleBoundaries,representativeTimes:full?50:10,subtitleBoundaryCoveragePerformed:full,actualRendererLoopExecuted:true,outsideLoopBytesUnchanged:true,productionFrameFunctionUnchanged:true,ffmpegBackpressureBenchmarked:false,allRgbBytesEqual:true,serial,parallel,speedup:serial.seconds/parallel.seconds,secondsPerFrame:{serial:serial.seconds/frames.length,parallel:parallel.seconds/frames.length},estimated493secondFilmMinutes:{serial:serial.seconds/frames.length*14813/60,parallel:parallel.seconds/frames.length*14813/60},ffmpegNotLaunched:true,blenderNotLaunched:true,notFinalMovieQa:true};
const dest=path.join(reportRoot,'composition-benchmark-'+ep+'_'+(full?'full':'smoke')+'_gpt_20261026-'+new Date().toISOString().replace(/[:.]/g,'-')+'.json');
fs.writeFileSync(dest,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({report:dest,frames:frames.length,serial:serial.seconds,parallel:parallel.seconds,speedup:report.speedup,allRgbBytesEqual:true,fullSubtitleBoundaryCoverage:full,isolated},null,2));

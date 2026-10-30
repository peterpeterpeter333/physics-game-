// Read-only execution of the existing data builders' assertion prefix in a VM.
// Existing builders are NOT imported/run: their CLI writes old cache data/maps.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
const W=path.resolve(new URL('../..',import.meta.url).pathname),S3='/private/tmp/ys/ys-chain-d1b_s3_gpt_20261026';
const OUT=path.join(S3,'qa/numerical-assert-motion-check_s3_20261026.json');
assert.equal(fs.existsSync(OUT),false,'Preserve prior audit');
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const protectedFiles=[path.join(S3,'blender/data.json'),path.join(W,'scripts/blender/desk_d1b_s3_20261026.py'),path.join(W,'scripts/blender/desk_lib_d1b_s3_20261026.py'),path.join(W,'scripts/blender/desk_d1b_s3_qa_20261026.py')];
const before=protectedFiles.map(p=>({path:p,sha256:hash(p)}));
const builds=[];
for(const id of ['d1a','d1b']){
 const sourcePath=path.join(W,'scripts/umech',`desk-${id}-data_gpt_20261026.mjs`),source=fs.readFileSync(sourcePath,'utf8');
 const cut=source.indexOf("writeFileSync(root+'/data.json'");assert.ok(cut>0);
 let prefix=source.slice(0,cut).replace(/^import .*;\n/gm,'');
 const marker="const W=fileURLToPath(new URL('../../',import.meta.url));";assert.equal(prefix.split(marker).length,2);prefix=prefix.replace(marker,`const W=${JSON.stringify(W+'/')};`);
 assert.ok(!/writeFileSync|await sharp|\.toFile\(/.test(prefix),'Must stop before all writes/image exports');
 let assertions=0;const reads=[],blockedMkdir=[];
 const checked=new Proxy(assert,{get(target,key){const f=target[key];return typeof f==='function'?function(...a){const result=f(...a);assertions++;return result;}:f;}});
 const context={assert:checked,process:{env:{EM_FILM_CACHE:`/private/tmp/ys/ys-chain-${id}_gpt_20261026`}},readFileSync(p,...a){reads.push(String(p));return fs.readFileSync(p,...a);},mkdirSync(p){blockedMkdir.push(String(p));},result:null};
 let error=null;try{vm.runInNewContext(prefix+'\nresult=data;',context,{filename:sourcePath+'#read-only-assertion-prefix',timeout:3000});}catch(e){error=String(e);}
 const currentPath=id==='d1b'?path.join(S3,'blender/data.json'):`/private/tmp/ys/ys-chain-${id}_gpt_20261026/blender/data.json`;
 const current=JSON.parse(fs.readFileSync(currentPath)),data=context.result;
 const numbersMatch=!!data&&JSON.stringify(data.numbers)===JSON.stringify(current.numbers),layersMatch=!!data&&JSON.stringify(data.layerCounts)===JSON.stringify(current.layerCounts)&&JSON.stringify(data.fujiCounts)===JSON.stringify(current.fujiCounts);
 const ratio=data?data.fujiCounts.reduce((a,b)=>a+b,0)/data.layerCounts.reduce((a,b)=>a+b,0):null;
 builds.push({episode:id,originalBuilder:sourcePath,sourceSha256:hash(sourcePath),originalBuilderHasExportedAssertionFunction:/export\s+(?:function|const).*assert/.test(source),originalCLIExecuted:false,whyOriginalCLINotRun:'Top-level CLI asserts a fixed old GPT cache and writes data.json, problem.json and map PNG there.',execution:'Original assertion/cue-building prefix before first write, with only ES imports/W URL adapted in RAM. mkdirSync intercepted without filesystem access.',assertCallsPassed:assertions,error,pass:!error&&numbersMatch&&layersMatch,reads,blockedMkdir,numbers:data?.numbers??null,palmPositionCount:data?.palmPositions?.length??null,fujiParticleRatio:ratio,currentDataPath:currentPath,numbersMatchCurrentData:numbersMatch,layerCountsMatchCurrentData:layersMatch});
}
const orchestrator=path.join(W,'scripts/umech/desk-d1b-orchestrate_s3_20261026.mjs'),text=fs.readFileSync(orchestrator,'utf8'),match=/const specs=(\[\[.*?\]\]);/s.exec(text);assert.ok(match,'Locate exact current13-window specification');
const specs=vm.runInNewContext(match[1],{}, {timeout:100});assert.equal(specs.length,13);
const data=JSON.parse(fs.readFileSync(path.join(S3,'blender/data.json'))),windows=specs.map(([name,key,word])=>{
 const c=data.cues.find(c=>c.key===key),matches=c?.wordEvents.filter(w=>w.word===word)??[],event=matches[0];
 const from=event?Math.max(Math.ceil(c.start*30-1e-8),Math.floor((event.time-.4)*30)):null,to=event?Math.min(Math.ceil(c.end*30-1e-8)-1,Math.ceil((event.time+1.4)*30)):null;
 return {name,cue:key,word,exactWordMatches:matches.length,triggerSeconds:event?.time??null,from,to,frameCount:from===null?0:to-from+1,withinCue:!!event&&event.time>=c.start&&event.time<c.end,pass:matches.length===1&&event.time>=c.start&&event.time<c.end&&Number.isInteger(from)&&Number.isInteger(to)&&from>=0&&to<14813&&to>=from};
});
const after=protectedFiles.map(p=>({path:p,sha256:hash(p)}));assert.deepEqual(after,before,'Production data/source changed during read-only audit');
const report={stage:'Numerical assertions and orchestrator event availability; not a physics/visual approval',commonChapter10:'The per-episode split instruction ends at chapter7 and has no chapter10. Numerical values are in the canonical narration/script calculation notes; those are what existing data builders encode.',builders:builds,motion:{orchestrator,sourceSha256:hash(orchestrator),windows,all13ExactWordsPresent:windows.every(w=>w.pass),uniqueEncodedFrames:[...new Set(windows.flatMap(w=>w.pass?Array.from({length:w.frameCount},(_,i)=>w.from+i):[]))].length,actualMotionRenderedOrReviewed:false},protectedFilesBefore:before,protectedFilesAfter:after,canonicalDataWritten:false,originalFilesEdited:false,BlenderOrGUIInvoked:false,limitations:['Assertions verify arithmetic/constants/counts, not their physical assumptions, historical reliability, units, painted numbers or animation state.','No original builder CLI or texture export was run; its assertion prefix was evaluated read-only.','d1a numerical data may be checked, but A S3/S4 production remains prohibited until B is completed.','Exact word availability prevents a missing-event lookup failure; it does not prove visual synchronization or contact/water-surface correctness.'],allMoviePass:false};
fs.mkdirSync(path.dirname(OUT),{recursive:true});fs.writeFileSync(OUT,JSON.stringify(report,null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({report:OUT,assertions:builds.map(x=>({episode:x.episode,passed:x.assertCallsPassed,pass:x.pass,error:x.error,numbersMatch:x.numbersMatchCurrentData})),motionWindows:windows.length,motionWordsAllPresent:windows.every(x=>x.pass),motionUniqueFrames:report.motion.uniqueEncodedFrames,productionSourcesAndDataUnchanged:true}));
process.exitCode=builds.every(x=>x.pass)&&windows.every(x=>x.pass)?0:1;

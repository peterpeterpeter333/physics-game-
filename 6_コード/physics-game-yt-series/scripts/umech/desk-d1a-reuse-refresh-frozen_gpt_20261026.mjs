// Refresh a19-cue receipt for the explicitly frozen source. No image rendering
// or production-cache writes. Re-evaluate all183 production SVGs byte-for-byte.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
const W=path.resolve(new URL('../..',import.meta.url).pathname),qa=path.join(W,'outputs/d1ab-gpt-20261026/qa');
const oldPath=path.resolve(process.argv[2]??'');assert.ok(oldPath.startsWith(qa+path.sep));
const old=JSON.parse(fs.readFileSync(oldPath)),hash=b=>crypto.createHash('sha256').update(b).digest('hex'),stamp=p=>({path:p,bytes:fs.statSync(p).size,sha256:hash(fs.readFileSync(p))});
const FROZEN='9bf344c99ad1f5ae11492abf877063967d1f92ce85eb2cb6196c08418723a963';
assert.equal(old.adoptionOnly,true);assert.equal(old.actualReuseCueCount,19);assert.equal(old.fullres.length,183);
const sourcePath=old.sourceSnapshot.path,source=fs.readFileSync(sourcePath,'utf8');assert.equal(hash(source),FROZEN,'Use only the parent-approved frozen A source.');
for(const p of old.inputStamps)assert.equal(stamp(p.path).sha256,p.sha256,'Immutable preflight input changed: '+p.path);
const differences=old.sourceInventory.flatMap(p=>{const now=stamp(p.path);return now.sha256===p.sha256?[]:[{before:p,after:now}];});
assert.equal(differences.length,1,'Only the explicitly identified benchmark precondition correction may differ.');
const change=differences[0],benchmark=path.join(W,'scripts/umech/desk-d1ab-composition-benchmark_gpt_20261026.mjs');assert.equal(change.before.path,benchmark);
const currentGuard="assert.ok(typeof meta.finished==='string'&&/^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}$/.test(meta.finished),'Full equivalence requires the production finish() timestamp.');";
const formerGuard="assert.equal(meta.finished,true,'Full equivalence requires finished production.');";
const benchmarkText=fs.readFileSync(benchmark,'utf8');assert.equal(benchmarkText.split(currentGuard).length,2,'The known corrected guard must occur exactly once.');
assert.equal(hash(benchmarkText.replace(currentGuard,formerGuard)),change.before.sha256,'Benchmark has changes beyond the known finished-timestamp precondition correction.');
const sourceInventory=fs.readdirSync(path.join(W,'scripts/umech')).filter(f=>f.endsWith('.mjs')).sort().map(f=>stamp(path.join(W,'scripts/umech',f)));
// Verify the same source-side actual reuse logic, including mandatory redraw.
const py=String.raw`import ast,json,sys,hashlib
p=json.load(sys.stdin); src=p['source']; t=ast.parse(src); f=p['fingerprint']
def assigned(name): return ast.literal_eval(next(n.value for n in t.body if isinstance(n,ast.Assign) and any(isinstance(a,ast.Name) and a.id==name for a in n.targets)))
assert sorted(assigned('REUSE_ALLOWED'))==f['allowed']; assert sorted(assigned('REQUIRED_REDRAW'))==f['redraw']
assert {k:ast.get_source_segment(src,next(n for n in t.body if isinstance(n,ast.FunctionDef) and n.name==k)) for k in f['functions']}==f['functions']
print(hashlib.sha256(json.dumps(f,sort_keys=True).encode()).hexdigest())
`;
const inspected=spawnSync('python3',['-c',py],{input:JSON.stringify({source,fingerprint:old.sourceSnapshot.fingerprint}),encoding:'utf8'});assert.equal(inspected.status,0,inspected.stderr);assert.equal(inspected.stdout.trim(),old.sourceSnapshot.mappingSha256);
const oldFullReceipt=JSON.parse(fs.readFileSync(old.oldPreflight.path)),cache=oldFullReceipt.cache;
assert.ok(cache.startsWith(qa+path.sep),'Only the isolated old QA cache may be used.');
assert.equal(stamp(old.oldPreflight.path).sha256,old.oldPreflight.sha256);
const cacheInputStamps=['plan.json','ys-chain-d1a.json','phrase-times.json','blender/data.json','blender/desk/anchors.json'].map(f=>stamp(path.join(cache,f)));
for(const f of ['plan.json','ys-chain-d1a.json','phrase-times.json','blender/data.json']){
 const canonical=old.inputStamps.find(p=>p.path.endsWith('/'+f));assert.ok(canonical);assert.equal(stamp(path.join(cache,f)).sha256,canonical.sha256);
}
const anchors=JSON.parse(fs.readFileSync(cache+'/blender/desk/anchors.json'));
const oldCanonical=JSON.parse(fs.readFileSync(oldFullReceipt.oldRawReadOnly+'/anchors.json'));
for(const f of old.fullres){
 assert.equal(stamp(f.raw.path).sha256,f.raw.sha256);assert.equal(stamp(f.raw.isolatedPath).sha256,f.raw.sha256);assert.equal(stamp(f.image).sha256,f.sha256);
 for(const [nm,v] of Object.entries(f.anchors)){
  assert.deepEqual(anchors.anchors[nm][f.frame],v,'Isolated anchor mismatch.');
  const expected=oldCanonical.anchors[nm]?.[Math.min(f.oldFrame,(oldCanonical.anchors[nm]?.length??1)-1)]??[0,0,false];assert.deepEqual(expected,v,'Old-frame anchor provenance mismatch.');
 }
}
process.env.EM_FILM_CACHE=cache;delete process.env.DESK_ALLOW_MISSING;
await import(pathToFileURL(path.join(W,'scripts/umech/desk-d1a-hooks_gpt_20261026.mjs')));
const {vertFrame}=await import(pathToFileURL(path.join(W,'scripts/umech/frame-vert.mjs')));
const timed=JSON.parse(fs.readFileSync(cache+'/ys-chain-d1a.json')),entry=JSON.parse(fs.readFileSync(cache+'/plan.json')).find(x=>x.id==='ys-chain-d1a');
const clip={...timed,...entry,duration:timed.duration,scenes:entry.scenes.map((s,j)=>({...s,start:timed.scenes[j].start,end:timed.scenes[j].end,captions:timed.scenes[j].captions})),animationFPS:30,mediaDirectory:entry.mediaDirectory??'lessons'};
const svgProof=[];
for(const f of old.fullres){
 const s=clip.scenes.find(s=>f.time>=s.start&&f.time<s.end)??clip.scenes.at(-1),k=Math.max(0,s.captions.findLastIndex(c=>c.start<=f.time));assert.equal(s.cues[k].diagram,'cd1a-'+f.key);
 const svg=vertFrame(clip,s,f.time);assert.ok(svg&&!/NaN|undefined|Infinity/.test(svg));assert.equal(hash(svg),f.svgSha256,'Current production SVG differs from reviewed original: '+f.frame);
 svgProof.push({frame:f.frame,key:f.key,time:f.time,svgSha256:hash(svg),reviewedNativeSha256:f.sha256});
}
const auditPath=old.oldPreflight.qa.path,audit=JSON.parse(fs.readFileSync(auditPath));assert.equal(stamp(auditPath).sha256,old.oldPreflight.qa.sha256);
assert.deepEqual([...audit.acceptedReuseCandidates].sort(),old.targetCues.map(c=>c.key).sort());
const viewed=new Map(audit.cues.flatMap(c=>c.samples.map(f=>[f.frame,{...f,key:c.key}])));
for(const f of old.fullres){const v=viewed.get(f.frame);assert.ok(v);assert.equal(v.key,f.key);assert.equal(v.sha256,f.sha256);assert.equal(v.review,'ACTUALLY_VIEWED_IN_CONTACT_TILE');}
for(const p of [...old.inputStamps,...sourceInventory,...cacheInputStamps])assert.equal(stamp(p.path).sha256,p.sha256,'Input/source changed during SVG proof: '+p.path);
assert.deepEqual(fs.readdirSync(path.join(W,'scripts/umech')).filter(f=>f.endsWith('.mjs')).sort(),sourceInventory.map(p=>path.basename(p.path)));
assert.equal(stamp(sourcePath).sha256,FROZEN,'Frozen A source changed during refresh.');
const out=path.join(qa,'a-reuse-frozen19_gpt_20261026-'+new Date().toISOString().replace(/[:.]/g,'-'));assert.ok(!fs.existsSync(out));fs.mkdirSync(out);
fs.writeFileSync(out+'/source-snapshot_gpt_20261026.py',source,{flag:'wx'});
const result={...old,createdAt:new Date().toISOString(),output:out,refreshedFrom:stamp(oldPath),refreshReason:'One unrelated composition-benchmark finished-timestamp precondition was corrected; all183 actual production SVGs were re-evaluated and matched reviewed SHA exactly.',sourceSnapshot:{...old.sourceSnapshot,sha256:FROZEN,snapshot:out+'/source-snapshot_gpt_20261026.py'},sourceInventory,isolatedCacheInputStamps:cacheInputStamps,knownInventoryChange:{...change,onlyExpectedTextChangeProvedByReverseHash:true,productionSvgStillIdentical:true},currentProductionSvgProof:svgProof,all183CurrentSvgShaEqualReviewed:true,all183RawAnchorCaptionInputAndNativeShaEqual:true,newNativeComposites:0,productionCacheWritten:false,blenderLaunched:false,allMoviePass:false};
const dest=out+'/reuse-frozen19-receipt_gpt_20261026.json';fs.writeFileSync(dest,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({receipt:dest,actualReuseCues:19,samples:183,frozenSourceSha256:FROZEN,allCurrentProductionSvgEqual:true,knownOnlyUnrelatedBenchmarkGuardChange:true,imagesRerendered:0,oldReceiptAndQaPreserved:true},null,2));

// Keep the original 21-cue/198-frame QA intact, and adopt only the subset still
// permitted by CURRENT REQUIRED_REDRAW. No Blender or image rerendering.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
const W=path.resolve(new URL('../..',import.meta.url).pathname),qa=path.join(W,'outputs/d1ab-gpt-20261026/qa');
const args=process.argv.slice(2),get=(k,d)=>{const i=args.indexOf(k);return i<0?d:args[i+1];};
const oldPath=path.resolve(get('--from','')),auditPath=get('--qa',null),expected=Number(get('--expect','19'));
assert.ok(oldPath.startsWith(qa+path.sep));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),stamp=p=>({path:p,bytes:fs.statSync(p).size,sha256:hash(fs.readFileSync(p))});
const old=JSON.parse(fs.readFileSync(oldPath)),sourcePath=old.sourceSnapshot.path,source=fs.readFileSync(sourcePath,'utf8');
assert.equal(old.targetCues.length,21);assert.equal(old.fullres.length,198,'Only the reviewed original receipt is accepted.');
for(const p of [...old.inputStamps,...old.sourceInventory])assert.equal(stamp(p.path).sha256,p.sha256,'Original preflight dependency changed: '+p.path);
const python=String.raw`import ast,json,sys,hashlib
p=json.load(sys.stdin); src=p['source']; tree=ast.parse(src); previous=p['previous']
def assigned(name):
    return ast.literal_eval(next(n.value for n in tree.body if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id==name for t in n.targets)))
allowed=assigned('REUSE_ALLOWED'); redraw=assigned('REQUIRED_REDRAW')
assert {'can:crush','can:mio','air:inside'}<=redraw
assert {'why:air','why:steam'}<=redraw
functions={k:ast.get_source_segment(src,next(n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name==k)) for k in ['cue_at','reuse_frame','old_points']}
assert sorted(allowed)==previous['allowed']; assert functions==previous['functions'], 'Actual frame/anchor mapping code changed: fresh composites are required.'
keys=sorted(set(previous['keys'])-redraw)
f={'allowed':sorted(allowed),'redraw':sorted(redraw),'functions':functions,'anchorNames':previous['anchorNames'],'keys':keys,'mappings':{k:previous['mappings'][k] for k in keys}}
print(json.dumps({'fingerprint':f,'keys':keys,'excluded':sorted(redraw),'mappingSha256':hashlib.sha256(json.dumps(f,sort_keys=True).encode()).hexdigest()}))
`;
const checked=spawnSync('python3',['-c',python],{input:JSON.stringify({source,previous:old.sourceSnapshot.fingerprint}),encoding:'utf8'});assert.equal(checked.status,0,checked.stderr);
const current=JSON.parse(checked.stdout);assert.equal(current.keys.length,expected,'Current source target count differs from requested adoption.');
const keySet=new Set(current.keys),targetCues=old.targetCues.filter(c=>keySet.has(c.key)),fullres=old.fullres.filter(f=>keySet.has(f.key)),removed=old.fullres.filter(f=>!keySet.has(f.key));
assert.equal(targetCues.length,expected);assert.equal(new Set(fullres.map(f=>f.key)).size,expected);
assert.ok(fullres.every(f=>!current.excluded.includes(f.key)));
for(const f of old.fullres){assert.equal(stamp(f.raw.path).sha256,f.raw.sha256);assert.equal(stamp(f.raw.isolatedPath).sha256,f.raw.sha256);assert.equal(stamp(f.image).sha256,f.sha256);}
const endCount=fullres.filter(f=>f.reasons.includes('cue-last-visible')).length;assert.equal(endCount,expected);
const subsetFrames=new Set(fullres.map(f=>f.frame));
const contacts=old.allPages.map(p=>({...p,retainedFrames:p.frames.filter(j=>subsetFrames.has(j)),excludedFrames:p.frames.filter(j=>!subsetFrames.has(j))})).filter(p=>p.retainedFrames.length);
const out=path.join(qa,'a-reuse-current-'+expected+'_gpt_20261026-'+new Date().toISOString().replace(/[:.]/g,'-'));assert.ok(!fs.existsSync(out));fs.mkdirSync(out);
fs.writeFileSync(out+'/source-snapshot_gpt_20261026.py',source,{flag:'wx'});
const sourceInventory=fs.readdirSync(path.join(W,'scripts/umech')).filter(f=>f.endsWith('.mjs')).sort().map(f=>stamp(path.join(W,'scripts/umech',f)));
const priorAudit=auditPath?stamp(path.resolve(auditPath)):null;
let visualEvidence=null;
if(priorAudit){
 const audit=JSON.parse(fs.readFileSync(priorAudit.path));assert.equal(audit.sourceReceipt.sha256,stamp(oldPath).sha256);
 assert.deepEqual([...audit.acceptedReuseCandidates].sort(),[...current.keys].sort(),'Independent QA adoption list must equal current source subset.');
 const reviewed=new Map(audit.cues.flatMap(c=>c.samples.map(s=>[s.frame,{...s,key:c.key}])));
 for(const f of fullres){const a=reviewed.get(f.frame);assert.ok(a);assert.equal(a.key,f.key);assert.equal(a.sha256,f.sha256);assert.equal(a.image,f.image);assert.equal(a.review,'ACTUALLY_VIEWED_IN_CONTACT_TILE');}
 visualEvidence={audit:priorAudit,exactRetainedImageShaMatches:fullres.length,reviewer:audit.reviewer,reviewMethod:'Already personally viewed exact original composite hashes, inherited without rerender.',additionalRedrawCues:audit.additionalRedrawCues};
}
const adopted={createdAt:new Date().toISOString(),episode:'D-1前編',purpose:'Adopt an unchanged pixel/anchor/subtitle subset of the existing independent 198-frame preflight; retain the original P1 findings and original QA.',output:out,adoptionOnly:true,newNativeComposites:0,oldPreflight:{...stamp(oldPath),originalCueCount:old.targetCues.length,originalSampleCount:old.fullres.length,originalContacts:old.allPages,originalCueEnds:old.cueEndPages,qa:priorAudit,originalP1NotErased:['why:air','why:steam']},sourceSnapshot:{path:sourcePath,sha256:hash(source),snapshot:out+'/source-snapshot_gpt_20261026.py',fingerprint:current.fingerprint,mappingSha256:current.mappingSha256},inputStamps:old.inputStamps,sourceInventory,targetCues,excludedMandatoryRedraw:current.excluded,matchingVoiceCues:24,actualReuseCueCount:expected,sampleCount:fullres.length,fullres,removedFrames:removed.map(f=>({key:f.key,frame:f.frame,time:f.time,image:f.image,sha256:f.sha256,reason:'Mandatory fresh 3D after independent P1 condensation/water finding.'})),contactReferences:contacts,allCueEndsCovered:true,cueEndCount:endCount,pixelsAndCaptionsAndAnchorMappingUnchanged:true,currentProductionHooksUnchanged:true,reuseFrameFunctionsUnchanged:true,nearbyFallback:false,productionCacheWritten:false,blenderLaunched:false,oldQaMayBeInheritedForExactSubset:visualEvidence!==null,inheritedIndependentVisualEvidence:visualEvidence,newSubsetVisualReviewPerformed:false,newlyRedrawnCuesReviewed:false,allMoviePass:false};
assert.equal(stamp(sourcePath).sha256,hash(source),'A source changed during the short adoption. Re-run for a stable snapshot.');
const dest=out+'/reuse-adopted-subset-receipt_gpt_20261026.json';fs.writeFileSync(dest,JSON.stringify(adopted,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({receipt:dest,actualReuseCues:expected,samples:fullres.length,removedSamples:removed.length,excludedMandatoryRedraw:current.excluded,noRerender:true,old198QaPreserved:true,priorAudit:priorAudit?.path??null},null,2));

// Recheck an existing A reuse preflight after unrelated new 3D source edits.
// Does not render, change media, import Blender, or write the production cache.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
const W=path.resolve(new URL('../..',import.meta.url).pathname),qa=path.join(W,'outputs/d1ab-gpt-20261026/qa');
const receiptPath=path.resolve(process.argv[2]??'');assert.ok(receiptPath.startsWith(qa+path.sep),'Provide the isolated preflight receipt.');
const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const receipt=JSON.parse(fs.readFileSync(receiptPath)),source=fs.readFileSync(receipt.sourceSnapshot.path,'utf8');
assert.equal(receipt.targetCues.length,21);assert.deepEqual(new Set(receipt.excludedMandatoryRedraw),new Set(['can:crush','can:mio','air:inside']));
for(const p of [...receipt.inputStamps,...receipt.sourceInventory])assert.equal(sha(p.path),p.sha256,'Preflight input/composition source changed: '+p.path);
const python=String.raw`import ast,json,sys,hashlib
p=json.load(sys.stdin); tree=ast.parse(p['source']); src=p['source']; f=p['fingerprint']
def assigned(name):
    return ast.literal_eval(next(n.value for n in tree.body if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id==name for t in n.targets)))
allowed=assigned('REUSE_ALLOWED'); redraw=assigned('REQUIRED_REDRAW')
assert redraw=={'can:crush','can:mio','air:inside'}
functions={k:ast.get_source_segment(src,next(n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name==k)) for k in ['cue_at','reuse_frame','old_points']}
assert sorted(allowed)==f['allowed']; assert sorted(redraw)==f['redraw']; assert functions==f['functions']
assert sorted(set(f['mappings'])-redraw)==f['keys']
print(json.dumps({'mappingSha256':hashlib.sha256(json.dumps(f,sort_keys=True).encode()).hexdigest(),'targetKeys':f['keys']}))
`;
const p=spawnSync('python3',['-c',python],{input:JSON.stringify({source,fingerprint:receipt.sourceSnapshot.fingerprint}),encoding:'utf8'});assert.equal(p.status,0,p.stderr);
const checked=JSON.parse(p.stdout);assert.equal(checked.mappingSha256,receipt.sourceSnapshot.mappingSha256);
for(const f of receipt.fullres){assert.equal(sha(f.raw.path),f.raw.sha256,'Canonical old raw changed.');assert.equal(sha(f.raw.isolatedPath),f.raw.sha256,'Isolated raw changed.');assert.equal(sha(f.image),f.sha256,'Composite changed.');}
const result={createdAt:new Date().toISOString(),receipt:receiptPath,receiptSha256:sha(receiptPath),source:receipt.sourceSnapshot.path,snapshotSourceSha256:receipt.sourceSnapshot.sha256,currentSourceSha256:sha(receipt.sourceSnapshot.path),all21TargetMappingsUnchanged:true,mappingSha256:checked.mappingSha256,sourceAndRawAndCompositeShaChecks:true,preflightOnly:true,notAProductionApproval:true};
const out=path.join(qa,'a-reuse-preflight-recheck_gpt_20261026-'+new Date().toISOString().replace(/[:.]/g,'-')+'.json');fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({report:out,...result},null,2));

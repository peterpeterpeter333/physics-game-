// Generic recheck for a CURRENT reuse adoption receipt (count is not hardcoded).
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
const W=path.resolve(new URL('../..',import.meta.url).pathname),qa=path.join(W,'outputs/d1ab-gpt-20261026/qa'),receiptPath=path.resolve(process.argv[2]??'');
assert.ok(receiptPath.startsWith(qa+path.sep));const receipt=JSON.parse(fs.readFileSync(receiptPath));assert.equal(receipt.adoptionOnly,true);
const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
for(const p of [...receipt.inputStamps,...receipt.sourceInventory])assert.equal(sha(p.path),p.sha256,'Preflight source/input changed: '+p.path);
const source=fs.readFileSync(receipt.sourceSnapshot.path,'utf8');
const py=String.raw`import ast,json,sys,hashlib
p=json.load(sys.stdin); src=p['source']; t=ast.parse(src); f=p['fingerprint']
def assigned(name): return ast.literal_eval(next(n.value for n in t.body if isinstance(n,ast.Assign) and any(isinstance(a,ast.Name) and a.id==name for a in n.targets)))
assert sorted(assigned('REUSE_ALLOWED'))==f['allowed']; assert sorted(assigned('REQUIRED_REDRAW'))==f['redraw']
assert {k:ast.get_source_segment(src,next(n for n in t.body if isinstance(n,ast.FunctionDef) and n.name==k)) for k in f['functions']}==f['functions']
print(hashlib.sha256(json.dumps(f,sort_keys=True).encode()).hexdigest())
`;
const p=spawnSync('python3',['-c',py],{input:JSON.stringify({source,fingerprint:receipt.sourceSnapshot.fingerprint}),encoding:'utf8'});assert.equal(p.status,0,p.stderr);assert.equal(p.stdout.trim(),receipt.sourceSnapshot.mappingSha256);
for(const f of receipt.fullres){assert.equal(sha(f.raw.path),f.raw.sha256);assert.equal(sha(f.raw.isolatedPath),f.raw.sha256);assert.equal(sha(f.image),f.sha256);}
const result={createdAt:new Date().toISOString(),receipt:receiptPath,receiptSha256:sha(receiptPath),source:receipt.sourceSnapshot.path,currentSourceSha256:sha(receipt.sourceSnapshot.path),targetCues:receipt.targetCues.length,samples:receipt.fullres.length,targetMappingsAndRawAndPixelsUnchanged:true,old198QaPreserved:true,notAProductionApproval:true};
const out=path.join(qa,'a-reuse-current-recheck_gpt_20261026-'+new Date().toISOString().replace(/[:.]/g,'-')+'.json');fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({report:out,...result},null,2));

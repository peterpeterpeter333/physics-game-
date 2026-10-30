// Read-only current snapshot. Historical baseline remains unchanged.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const W=path.resolve(new URL('../..',import.meta.url).pathname),CACHE='/private/tmp/ys/ys-chain-d1b_s3_gpt_20261026';
const baselinePath=path.join(W,'outputs/d1ab-gpt-20261026/qa/immutable-input-sha256-before.json');
const baseline=JSON.parse(fs.readFileSync(baselinePath));assert.equal(baseline.files.length,2037);
const out=path.join(W,'outputs/d1ab-gpt-20261026/qa/current-S3-start-snapshot_f5ba1d1d58feed1b0c58_20261026.json');
assert.equal(fs.existsSync(out),false,'Preserve previous snapshot');
const startedAt=new Date().toISOString(),records=new Map();
async function capture(p){
 if(records.has(p))return records.get(p);
 const a=fs.lstatSync(p);assert.ok(a.isFile()&&!a.isSymbolicLink(),'Regular real file required: '+p);
 const h=createHash('sha256');for await(const b of fs.createReadStream(p))h.update(b);
 const z=fs.statSync(p);assert.equal(a.size,z.size,'File changed while hashing: '+p);assert.equal(a.mtimeMs,z.mtimeMs,'File changed while hashing: '+p);
 const r={path:p,bytes:z.size,sha256:h.digest('hex'),mtime:z.mtime.toISOString(),mtimeMs:z.mtimeMs};records.set(p,r);return r;
}
const baselineCurrent=[],historicalDifferences=[];
for(const before of baseline.files){
 const current=await capture(before.path);baselineCurrent.push(current);
 if(before.sha256!==current.sha256)historicalDifferences.push({path:before.path,historicalSha256:before.sha256,currentSha256:current.sha256,currentMtime:current.mtime,editorNotInferred:true});
}
const originalCore=[];
for(const dir of ['scripts/umech','scripts/blender'])for(const name of fs.readdirSync(path.join(W,dir)).sort()){
 if(!/\.(mjs|py|json)$/.test(name)||/_(?:gpt|s3)_20261026/.test(name))continue;
 const p=path.join(W,dir,name);if(fs.lstatSync(p).isFile())originalCore.push(await capture(p));
}
for(const name of ['narration_pronunciation.py','narration-pronunciation.json','narration_fluency.py','desk_audio_lib.py']){
 const p=path.join(W,'scripts',name);if(fs.existsSync(p))originalCore.push(await capture(p));
}
const newS3Pipeline=[];
for(const dir of ['scripts/umech','scripts/blender'])for(const name of fs.readdirSync(path.join(W,dir)).sort()){
 if(!/_(?:s3|s3_gui)_20261026\.(?:mjs|py|svg)$/.test(name))continue;
 newS3Pipeline.push(await capture(path.join(W,dir,name)));
}
const inputCopies=[];
for(const name of ['plan.json', 'ys-chain-d1b.json', 'phrase-times.json', 'ys-chain-d1b.voice.wav', 'ys-chain-d1b.wav', 'ys-chain-d1b.mix.json', 'shot-plan.json', 'blender/data.json'])inputCopies.push(await capture(path.join(CACHE,name)));
const renderSources=['desk_d1b_s3_20261026.py','desk_lib_d1b_s3_20261026.py','desk_lib_d1.py','desk_d1b_s3_qa_20261026.py'];
const frozenRenderFiles=[];for(const name of renderSources)frozenRenderFiles.push(await capture(path.join(W,'scripts/blender',name)));
const py="import hashlib,json,sys;from pathlib import Path;w=Path(sys.argv[1]);c=Path(sys.argv[2]);files=json.loads(sys.argv[3]);s=b''.join((w/'scripts/blender'/p).read_bytes() for p in files);print(hashlib.sha256(s+json.dumps(json.loads((c/'blender/data.json').read_text()),sort_keys=True).encode()).hexdigest()[:20])";
const r=spawnSync('python3',['-c',py,W,CACHE,JSON.stringify(renderSources)],{encoding:'utf8',env:{...process.env,PYTHONDONTWRITEBYTECODE:'1'}});assert.equal(r.status,0,r.stderr);
const actualKey=r.stdout.trim();assert.equal(actualKey,'f5ba1d1d58feed1b0c58','Snapshot must describe the running frozen S3 candidate');
const gate=await capture(path.join(W,'scripts/umech/desk-quality-gate.mjs'));
const result={purpose:'Current immutable-source checkpoint during S3 production; compare final state to THIS snapshot separately from the historical baseline.',startedAt,finishedAt:new Date().toISOString(),historicalBaseline:baselinePath,historicalBaselineCreatedAt:baseline.createdAt,historicalBaselinePathsChecked:2037,historicalUnchanged:2037-historicalDifferences.length,historicalDifferences,allHistoricalFilesUnchanged:historicalDifferences.length===0,baselineCurrent,originalCore,newS3Pipeline,newCacheInputCopies:inputCopies,frozenS3:{sourceKey:actualKey,files:frozenRenderFiles},deskQualityGate:gate,notes:['The four historical differences predate this snapshot. Their author is not inferred.','This snapshot does not reset or replace the historical baseline.','Mutable rendered frames, progress metadata and new movies are not modified or hashed here.','A later comparison must report changes from this snapshot separately from the four historical differences.'],sourceOrMovieEdited:false,GUIInvoked:false};
fs.writeFileSync(out,JSON.stringify(result,null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({snapshot:out,baselinePaths:baselineCurrent.length,historicalDifferences:historicalDifferences.length,originalCore:originalCore.length,newS3Pipeline:newS3Pipeline.length,newInputs:inputCopies.length,frozenSourceKey:actualKey,gateSha256:gate.sha256,gateMtime:gate.mtime}));

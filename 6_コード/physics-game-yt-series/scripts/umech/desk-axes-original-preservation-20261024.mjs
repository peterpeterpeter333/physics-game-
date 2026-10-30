// Current byte-level protection compared with recorded historical baselines.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const W=process.cwd(),base=W+'/outputs/axes-20261023/';
assert(W.endsWith('/work/physics-game-yt-series'));
const out=path.resolve(process.argv[2]??base+'original-preservation-current-20261024.json');
assert(out.startsWith(base)&&!fs.existsSync(out));
const read=p=>JSON.parse(fs.readFileSync(p));
async function hash(p){const h=crypto.createHash('sha256');for await(const b of fs.createReadStream(p))h.update(b);return h.digest('hex');}
const checked=[];
async function check(p,expected,baseline){const actual=await hash(p);assert.equal(actual,expected,p);checked.push({path:p,expectedSha256:expected,currentSha256:actual,baseline,unchanged:true});}
const oldInputs=base+'immutable-inputs-and-regression.json',original=read(oldInputs);
for(const ep of original.episodes){
 for(const f of ep.files){await check(f.cache,f.sha256,oldInputs);await check(f.backup,f.backupSha256,oldInputs);}
 await check(ep.script.path,ep.script.sha256,oldInputs);
}
const gateHistory=base+'checkpoint/c1/caption-audit-allaxes/ys-chain-b1v1-gate8.json';
const gate=read(gateHistory).source;
await check(gate.gate.path,gate.gate.sha256,gateHistory);
await check(gate.deskFrame.path,gate.deskFrame.sha256,gateHistory);
const framesHistory=base+'B-1_実際の球の幅と元検査の差.json';
const frames=read(framesHistory).originalHeuristic;
await check(W+'/'+frames.source,frames.sourceSha256,framesHistory);
const regressions=[];
for(const r of original.regression){
 const q=read(r.mp4Report);assert(q.cmpOriginal&&q.originalUnchanged);
 await check(q.original,q.originalSha256,r.mp4Report);
 await check(q.video,q.renderSha256,r.mp4Report);
 assert.equal(q.originalSha256,q.renderSha256);
 regressions.push({id:r.id,original:q.original,matchingHistoricalReencode:q.video,report:r.mp4Report,bothCurrentHashesMatch:true,historicalCmpOriginal:true,newReencodePerformedByThisScript:false});
}
fs.writeFileSync(out,JSON.stringify({date:new Date().toISOString(),checked:checked.length,allUnchanged:true,checkedFiles:checked,oldEpisodeRegressions:regressions,sourceOrVideoWrites:false,finalNewFilmAcceptance:false},null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({out,checked:checked.length,allUnchanged:true,historicalMp4ComparisonsStillMatch:true}));

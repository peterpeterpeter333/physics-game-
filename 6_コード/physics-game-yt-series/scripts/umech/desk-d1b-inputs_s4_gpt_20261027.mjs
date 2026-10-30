// Explicit preparation only. Real-copy immutable S3 inputs; never synthesize speech.
// node THIS --copy
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const W=path.resolve(new URL('../..',import.meta.url).pathname),FROM='/private/tmp/ys/ys-chain-d1b_s3_gpt_20261026',TO='/private/tmp/ys/ys-chain-d1b_s4_gpt_20261027',ID='ys-chain-d1b';
assert.ok(process.argv.includes('--copy'),'Preparation is not automatic; pass --copy after review');
assert.equal(process.env.EM_FILM_CACHE??TO,TO);
const sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const names=['plan.json',ID+'.json','phrase-times.json',ID+'.voice.wav',ID+'.wav',ID+'.mix.json',ID+'.levels.json','blender/data.json','blender/tex/d1-europe.png','blender/tex/d1-europe-s3.png'];
for(const rel of names){const a=path.join(FROM,rel),b=path.join(TO,rel);assert.ok(fs.statSync(a).isFile());assert.equal(fs.lstatSync(a).isSymbolicLink(),false);assert.equal(fs.existsSync(b),false,'Preserve existing S4 input: '+b);}
const assets=path.join(W,'scripts/blender/desk_assets/d1b');
for(const f of ['plan.json',ID+'.json','phrase-times.json'])assert.equal(sha(path.join(FROM,f)),sha(path.join(assets,f)),'Supplied text/timing changed: '+f);
assert.equal(sha(path.join(FROM,ID+'.voice.wav')),sha(path.join(assets,ID+'.wav')),'Supplied voice changed');
const mix=JSON.parse(fs.readFileSync(path.join(FROM,ID+'.mix.json')));assert.equal(mix.voiceSha256,sha(path.join(FROM,ID+'.voice.wav')));assert.equal(mix.mixSha256,sha(path.join(FROM,ID+'.wav')));
const master=path.join(W,'docs/video-revision-20260924/deep/技術の疑問の鎖_D-1後編_ナレーション.md'),script=path.join(W,'docs/video-revision-20260924/ytseries/chain-d-1b.mjs');
const problem=path.join(TO,'problem/problem.json'),record=path.join(TO,'s4-inputs_20261027.json');
for(const f of [problem,record])assert.equal(fs.existsSync(f),false,'Preserve existing S4 preparation');
const text=fs.readFileSync(master,'utf8'),at=text.indexOf('## 問題編への接続');assert.ok(at>=0,'Master problem section not found');
fs.mkdirSync(TO,{recursive:true});assert.equal(fs.realpathSync(TO),TO,'No symlink cache');
const copied=[];
for(const rel of names){const a=path.join(FROM,rel),b=path.join(TO,rel);fs.mkdirSync(path.dirname(b),{recursive:true});fs.copyFileSync(a,b,fs.constants.COPYFILE_EXCL);assert.equal(sha(a),sha(b));copied.push({path:rel,sha256:sha(b)});}
fs.mkdirSync(path.dirname(problem),{recursive:true});
fs.writeFileSync(problem,JSON.stringify({episode:'d1b',source:master,sourceSectionVerbatim:text.slice(at),components:['排水の弁','筒','ピストン','重い棒','底のポンプ'],images:{challenge:'挑戦.png',answer:'答え.png'},resolution:[1080,1920]},null,1)+'\n',{flag:'wx'});
fs.writeFileSync(record,JSON.stringify({stage:'S4',copied,masterSha256:sha(master),scriptSha256:sha(script),sharedGateSha256:sha(path.join(W,'scripts/umech/desk-quality-gate.mjs')),audioGeneration:false,NemoRequests:false,voiceAndCaptionsUnchanged:true,shotPlan:'Generate separately from the final S4 semantic selector; do not adopt an S3 plan blindly'},null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({cache:TO,record,problem,realCopies:copied.length,productionStarted:false}));

// Dedicated new B-2a S0 orchestration; original renderers/checkers are unchanged.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {spawnSync,spawn} from 'node:child_process';
const OUT=path.dirname(fileURLToPath(import.meta.url));
const W=path.resolve(OUT,'../../..');
const CACHE='/private/tmp/ys/ys-chain-b2a_gpt_20261029';
const ID='ys-chain-b2a_gpt_20261029';
const SCRIPT=path.join(W,'docs/video-revision-20260924/ytseries/chain-b-2a_gpt_20261029.mjs');
const MASTER=path.join(W,'docs/video-revision-20260924/deep/技術の疑問の鎖_B-2_前編_第1版_ナレーション.md');
const PY='/Users/ken/Library/Application Support/physics-quest-tools/pyenv/bin/python';
const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const env={...process.env,EM_FILM_CACHE:CACHE,NEMO_URL:'http://127.0.0.1:50123'};
const result={started:new Date().toISOString(),id:ID,masterSha256:sha(MASTER),scriptSha256:sha(SCRIPT),phases:[],scope:'S0 speech and caption timing only; no ear listening or video quality claim'};
const save=()=>fs.writeFileSync(path.join(OUT,'audio-s0-result.json'),JSON.stringify(result,null,2));
async function run(name,exe,args){
  const log=path.join(OUT,name+'.log');
  const fd=fs.openSync(log,'wx');
  const start=Date.now();
  const code=await new Promise((resolve,reject)=>{const p=spawn(exe,args,{cwd:W,env,stdio:['ignore',fd,fd]});p.on('error',reject);p.on('close',resolve);});
  fs.closeSync(fd);result.phases.push({name,exitCode:code,elapsedSeconds:(Date.now()-start)/1000,log});save();
  if(code!==0)throw Error(name+' failed; inspect '+log);
  console.log(name+' PASS',flush);
}
const flush=undefined;
const {clips}=await import(pathToFileURL(SCRIPT));const c=clips[0];
const lines=fs.readFileSync(MASTER,'utf8').split('\n');
const masterRows=lines.filter(l=>/^\|\s*\d+\s*\|/.test(l)).map(l=>l.split('|').map(x=>x.trim()));
if(masterRows.length!==43||masterRows[0][4]!=='（なし。2秒）'||c.silentIntroSeconds!==2)throw Error('silent intro mismatch');
const qs=c.scenes.flatMap(s=>s.cues);
for(const r of masterRows.slice(1)){const q=qs.filter(q=>q.masterRow===+r[1]);if(q.map(x=>x.subtitle).join('')!==r[4])throw Error('Master row mismatch '+r[1]);}
if(qs.some(q=>q.masterRow<2||q.masterRow>43))throw Error('Unexpected cue');
const derived=path.join(OUT,'master-audio-rows-derived-for-original-lint.md');
if(fs.existsSync(derived))throw Error('Refuse overwrite '+derived);
fs.writeFileSync(derived,lines.filter(l=>!/^\|\s*1\s*\|/.test(l)).join('\n'));
result.structuredMasterCheck={originalRows:43,silentRows:1,voicedRows:42,voicedCues:qs.length,allOriginalVoicedTextUnchanged:true,originalSilentIntroSeconds:2,originalCheckerLimitation:'Original lint rejects silent narration rows; original checker is run on a documented derived audio-only view, alongside this strict 43-row check.',derived};save();
await run('01-original-lint-before-voice',process.execPath,['scripts/umech/chain-desk-lint.mjs',SCRIPT,ID,derived]);
await run('02-original-check-readings',PY,['scripts/umech/check-readings.py',CACHE+'/plan.json','--diff']);
await run('03-original-prosody',PY,['scripts/umech/prosody.py',CACHE+'/plan.json']);
await run('04-original-prosody-speaker',PY,['scripts/umech/prosody-speaker.py',CACHE+'/plan.json']);
await run('05-original-render-dialogue',PY,['scripts/render-dialogue-audio.py',ID]);
await run('06-original-phrase-times',PY,['scripts/umech/chain-dlg-phrase-times-1-1v5.py',CACHE,ID]);
await run('07-add-two-second-intro',PY,[path.join(OUT,'finalize-silent-intro_gpt_20261029.py')]);
await run('08-original-lint-after-voice',process.execPath,['scripts/umech/chain-desk-lint.mjs',SCRIPT,ID,derived]);
result.completed=new Date().toISOString();result.masterUnchanged=sha(MASTER)===result.masterSha256;result.scriptUnchanged=sha(SCRIPT)===result.scriptSha256;save();
if(!result.masterUnchanged||!result.scriptUnchanged)throw Error('Original/script changed during synthesis');

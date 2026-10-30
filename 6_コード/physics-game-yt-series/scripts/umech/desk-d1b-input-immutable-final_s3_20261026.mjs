// Independent final supplied-input proof; no rendering, network, or audio edits.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const W=path.resolve(new URL('../..',import.meta.url).pathname),CACHE='/private/tmp/ys/ys-chain-d1b_s3_gpt_20261026';
const argv=process.argv.slice(2),i=argv.indexOf('--out');
const out=path.resolve(i<0?path.join(CACHE,'qa/immutable-final-preexport_s3_20261026.json'):argv[i+1]);
assert.ok(out.startsWith(CACHE+path.sep));assert.equal(fs.existsSync(out),false,'Preserve previous proof');
const baselinePath=path.join(W,'outputs/d1ab-gpt-20261026/qa/immutable-input-sha256-before.json');
const baseline=JSON.parse(fs.readFileSync(baselinePath));
const sha=async p=>{const h=createHash('sha256');for await(const b of fs.createReadStream(p))h.update(b);return h.digest('hex');};
const selected=baseline.files.filter(r=>/\/scripts\/blender\/desk_assets\/d1[ab]\//.test(r.path)||/\/chain-d-1[ab]\.mjs$/.test(r.path)||/\/(?:技術の疑問の鎖_D-1(?:前編|後編)_ナレーション|D-1(?:前編|後編)_cue時刻一覧)\.md$/.test(r.path));
const changed=[],counts={};
for(const r of selected){const a=/\/desk_assets\/(d1[ab])\//.exec(r.path)?.[1]??'master-script-timing';counts[a]=(counts[a]??0)+1;const actual=fs.existsSync(r.path)?await sha(r.path):null;if(actual!==r.sha256)changed.push({path:r.path,before:r.sha256,actual});}
const assets=path.join(W,'scripts/blender/desk_assets/d1b'),copies=[];
for(const name of ['plan.json','ys-chain-d1b.json','phrase-times.json','ys-chain-d1b.voice.wav']){
 const source=path.join(assets,name),copy=path.join(CACHE,name),actual=await sha(copy);copies.push({name,source,copy,sha256:actual,unchanged:actual===await sha(source),realCopy:!fs.lstatSync(copy).isSymbolicLink()});
}
const plan=JSON.parse(fs.readFileSync(path.join(CACHE,'plan.json')))[0],timed=JSON.parse(fs.readFileSync(path.join(CACHE,'ys-chain-d1b.json')));
const cues=plan.scenes.flatMap(s=>s.cues),utterances=plan.scenes.flatMap(s=>s.utterances),captions=timed.scenes.flatMap(s=>s.captions),subtitleProblems=[];let chunks=0;const speakers={};
assert.equal(cues.length,63);assert.equal(utterances.length,63);assert.equal(captions.length,63);
for(let n=0;n<cues.length;n++){
 const q=cues[n],u=utterances[n];chunks+=q.cap.length;speakers[u.speaker]=(speakers[u.speaker]??0)+1;
 for(const [test,ok] of Object.entries({cueEqualsUtterance:q.subtitle===u.subtitle,cueEqualsTimedCaption:q.subtitle===captions[n].text,capJoinsToSubtitle:q.cap.flat().join('')===q.subtitle,capReadingJoinsToReading:q.capReading.join('')===q.reading,readingEqualsUtterance:q.reading===u.reading,kanaEqualsUtterance:q.kana===u.kana}))if(!ok)subtitleProblems.push({cue:n+1,id:q.diagram,test});
}
const provenance=JSON.parse(fs.readFileSync(path.join(CACHE,'ys-chain-d1b.mix.json')));
const audio={suppliedVoiceSha256:await sha(path.join(assets,'ys-chain-d1b.voice.wav')),currentVoiceSha256:await sha(path.join(CACHE,'ys-chain-d1b.voice.wav')),currentMixSha256:await sha(path.join(CACHE,'ys-chain-d1b.wav'))};
audio.mixRetainsProvidedVoice=audio.currentVoiceSha256===provenance.voiceSha256&&audio.currentVoiceSha256===audio.suppliedVoiceSha256;audio.mixMatchesProvenance=audio.currentMixSha256===provenance.mixSha256;
const result={stage:'Final pre-export immutable inputs only',baseline:baselinePath,checkedAt:new Date().toISOString(),originalFilesChecked:selected.length,groups:counts,changed,unchanged:changed.length===0,S3RealCopies:copies,subtitles:{cues:63,chunks,speakers,problems:subtitleProblems,charactersAndCapGroupingChanged:false},audio,earsPerformed:false,networkPerformed:false,voiceRegenerated:false,finalMP4Checked:false,allMoviePass:false};
result.immutableInputPass=result.unchanged&&copies.every(c=>c.unchanged&&c.realCopy)&&!subtitleProblems.length&&audio.mixRetainsProvidedVoice&&audio.mixMatchesProvenance;
fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(result,null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({report:out,originalFilesChecked:selected.length,changed:changed.length,S3CopiesUnchanged:copies.every(c=>c.unchanged&&c.realCopy),subtitleProblems:subtitleProblems.length,cues:63,chunks,voiceUnchanged:audio.mixRetainsProvidedVoice,immutableInputPass:result.immutableInputPass}));
process.exitCode=result.immutableInputPass?0:1;

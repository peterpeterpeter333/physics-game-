// Optional isolated exporter. Never replaces either original episode exporter.
// Parent must review the renderer diff and explicitly approve using this file.
// Requires a FINAL full RGB equivalence report for the current source set.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';

const args=process.argv.slice(2),get=(k,d)=>{const i=args.indexOf(k);return i<0?d:args[i+1];};
const ep=get('--episode','d1b'),proofPath=get('--proof',process.env.D1AB_RGB_EQUIVALENCE);
assert.ok(['d1a','d1b'].includes(ep));
assert.equal(process.env.D1AB_PARALLEL_APPROVED,'1','Parent diff review and explicit D1AB_PARALLEL_APPROVED=1 are required.');
assert.ok(proofPath,'Use --proof <full RGB equivalence report.json>. A ten-frame smoke report is not sufficient.');
const id='ys-chain-'+ep,source=process.env.EM_FILM_CACHE??'/private/tmp/ys/'+id+'_gpt_20261026';
const out=process.env.D1AB_EXPORT_OUT??source+'/out-parallel_gpt_20261026',cache=source+'/export-cache-parallel_gpt_20261026';
const sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex'),proof=JSON.parse(fs.readFileSync(proofPath));
assert.equal(proof.episode,ep);assert.equal(proof.mode,'final-input-equivalence');
for(const key of ['subtitleBoundaryCoveragePerformed','actualRendererLoopExecuted','outsideLoopBytesUnchanged','productionFrameFunctionUnchanged','allRgbBytesEqual'])assert.equal(proof[key],true,'Missing equivalence condition: '+key);
assert.equal(proof.representativeTimes,50);assert.equal(proof.parallel.depth,2);assert.ok(proof.speedup>=1.10,'Parallel composition was not at least 10% faster. Use the original exporter.');
assert.equal(fs.realpathSync(proof.source),fs.realpathSync(source));
assert.equal(fs.realpathSync(proof.archive),fs.realpathSync(source+'/blender/desk'),'Archived smoke frames cannot authorize production.');
assert.ok(proof.subtitleBoundaries.length>0);assert.ok(proof.sourceInventory.length>0);
for(const p of [...proof.inputs,...proof.sourceInventory,...proof.rawInputs])assert.equal(sha(p.path),p.sha256,'Equivalence input/source changed: '+p.path);
assert.deepEqual(fs.readdirSync('scripts/umech').filter(f=>f.endsWith('.mjs')).sort(),proof.sourceInventory.map(p=>path.basename(p.path)),'New composition source added after equivalence proof.');
// This independent new checker requires finished/current 3D, all JPEG headers,
// complete anchors, immutable voice, current projection + camera QA. It does
// not claim full raw entropy decoding or actual-MP4 decoding/listening.
const preflight=spawnSync('python3',['scripts/umech/desk-d1ab-preexport_gpt_20261026.py','--episode',ep,'--projection','latest'],{env:{...process.env,EM_FILM_CACHE:source},stdio:'inherit'});
if(preflight.status!==0)process.exit(preflight.status??1);
const supplied=new URL('../blender/desk_assets/'+ep+'/'+id+'.wav',import.meta.url),voice=source+'/'+id+'.voice.wav',mix=source+'/'+id+'.wav';
const provenance=JSON.parse(fs.readFileSync(source+'/'+id+'.mix.json'));
assert.equal(sha(voice),sha(supplied));assert.equal(sha(voice),provenance.voiceSha256);assert.equal(sha(mix),provenance.mixSha256);
const timed=JSON.parse(fs.readFileSync(source+'/'+id+'.json')),nf=Math.ceil(timed.duration*30),meta=JSON.parse(fs.readFileSync(source+'/blender/desk/meta.json'));
assert.ok(!fs.existsSync(out+'/'+id+'.mp4'),'Existing MP4 is preserved; select a new D1AB_EXPORT_OUT.');
fs.mkdirSync(cache,{recursive:true});fs.mkdirSync(out,{recursive:true});
function link(src,dst){if(!fs.existsSync(dst))fs.symlinkSync(src,dst);else assert.equal(fs.realpathSync(dst),fs.realpathSync(src),'Unexpected export input: '+dst);}
for(const f of ['plan.json',id+'.json','phrase-times.json',id+'.voice.wav',id+'.wav'])link(source+'/'+f,cache+'/'+f);
link(source+'/blender',cache+'/blender');
const env={...process.env,EM_FILM_CACHE:cache,FILM_OUTPUT:out,D1AB_FRAME_LOOKAHEAD:'2',FFMPEG:process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1'};
delete env.DESK_ALLOW_MISSING;
const hooks=new URL('./desk-'+ep+'-hooks_gpt_20261026.mjs',import.meta.url).pathname,renderer='scripts/render-all-films-d1ab-parallel_gpt_20261026.mjs';
const started=Date.now(),rendered=spawnSync(process.execPath,['--import',hooks,renderer,id],{env,stdio:'inherit'});
if(rendered.status!==0)process.exit(rendered.status??1);
// A later file edit cannot silently inherit this proof or final receipt.
for(const p of [...proof.inputs,...proof.sourceInventory])assert.equal(sha(p.path),p.sha256,'Source changed while exporting: '+p.path);
const receipt={createdAt:new Date().toISOString(),episode:ep,video:out+'/'+id+'.mp4',frames:nf,fps:30,duration:timed.duration,seconds:(Date.now()-started)/1000,renderKey:meta.key,voiceSha256:sha(voice),mixSha256:sha(mix),videoSha256:sha(out+'/'+id+'.mp4'),suppliedVoiceUnchanged:true,renderer,rendererSha256:sha(renderer),lookahead:2,equivalenceReport:proofPath,equivalenceSha256:sha(proofPath),actualExportDecodePerformed:false,earsPerformed:false,notFinalMovieQa:true};
fs.writeFileSync(out+'/'+ep+'-export-parallel_gpt_20261026.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(receipt,null,2));

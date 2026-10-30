// Historical 1-2 used the already-existing CRF18 exporter, not the generic CRF24 exporter.
// Reproduce that exact build without modifying its source, media, or input cache.
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const id='ys-chain-1-2v2',source='/private/tmp/ys/'+id,root='/private/tmp/ys/axes-regression/'+id+'/mp4-after-matching-encoder';
const cache=root+'/cache',out=root+'/out',encoder='scripts/render-all-films-gptv2.mjs';
const sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
fs.mkdirSync(cache,{recursive:true});fs.mkdirSync(out,{recursive:true});
for(const name of ['plan.json',id+'.json','phrase-times.json',id+'.wav','blender']){
 const a=source+'/'+name,b=cache+'/'+name;
 if(fs.existsSync(b))assert.equal(fs.realpathSync(b),fs.realpathSync(a));else fs.symlinkSync(a,b);
}
assert(!fs.existsSync(out+'/'+id+'.mp4'),'Do not overwrite an existing regression output');
const original=source+'/out/'+id+'.mp4',inputHash=sha(original),encoderHash=sha(encoder),started=Date.now();
const r=spawnSync(process.execPath,[encoder,id],{stdio:'inherit',env:{...process.env,EM_FILM_CACHE:cache,FILM_OUTPUT:out,FFMPEG:process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1'}});
if(r.status)process.exit(r.status);
const video=out+'/'+id+'.mp4';assert.equal(sha(original),inputHash);assert.equal(sha(encoder),encoderHash);
const report={id,encoder,encoderSha256:encoderHash,seconds:(Date.now()-started)/1000,original,video,originalSha256:inputHash,renderSha256:sha(video),cmpOriginal:fs.readFileSync(original).equals(fs.readFileSync(video)),originalUnchanged:true};
fs.writeFileSync(root+'/cmp-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));

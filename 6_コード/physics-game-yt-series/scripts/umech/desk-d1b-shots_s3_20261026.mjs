// Exact-frame S3 preview. node THIS <new-out-dir> <seconds,...> [--raw-dir <GUI-out>] [--anchors-file <file>] [--raw-ext jpg|png]
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {inputs,exactFrame} from './desk-d1b-stage_s3_20261026.mjs';
const args=process.argv.slice(2),[out,list]=args,opt=k=>{const i=args.indexOf(k);return i<0?undefined:args[i+1];};assert.ok(out&&list);
const stage=inputs({rawDir:opt('--raw-dir'),anchorsFile:opt('--anchors-file'),rawExt:opt('--raw-ext')});
await import('./desk-d1b-hooks_s3_20261026.mjs');
const {vertFrame}=await import('./frame-vert.mjs');
const jobs=list.split(',').map(Number).map(t=>{assert.ok(Number.isFinite(t));const j=Math.round(t*30);return {j,t:j/30,file:path.resolve(out,String(j).padStart(5,'0')+'.jpg')};});
for(const p of jobs){assert.equal(fs.existsSync(p.file),false,'Preserve existing preview');const meta=await sharp(exactFrame(stage,p.j)).metadata();assert.equal(meta.width,540);assert.equal(meta.height,960);}
fs.mkdirSync(out,{recursive:true});
for(const p of jobs){
 const scene=stage.clip.scenes.find(s=>p.t>=s.start&&p.t<s.end)??stage.clip.scenes.at(-1),svg=vertFrame(stage.clip,scene,p.t);
 assert.ok(svg&&!/NaN|undefined|Infinity/.test(svg));
 await sharp(Buffer.from(svg)).flatten({background:'#0b1122'}).resize(540,960,{fit:'fill'}).jpeg({quality:93}).toFile(p.file);
}
console.log(JSON.stringify({stage:'S3 exact still preview',count:jobs.length,output:path.resolve(out),resolution:[540,960],movieStarted:false}));

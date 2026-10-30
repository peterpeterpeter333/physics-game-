// Exact native-size Gate C composites; common frame/QA programs stay unchanged.
// EM_FILM_CACHE=A cache node --import ./scripts/umech/desk-d1a-hooks_gpt_20261026.mjs THIS
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {vertFrame} from './frame-vert.mjs';
const cache='/private/tmp/ys/ys-chain-d1a_gpt_20261026';
assert.equal(process.env.EM_FILM_CACHE,cache);
assert.notEqual(process.env.DESK_ALLOW_MISSING,'1','No nearest-frame substitution in Gate C');
const read=f=>JSON.parse(fs.readFileSync(f));
const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const manifestPath=process.argv[2]??cache+'/gate12-front_gpt_20261026.json',manifest=read(manifestPath),clip=read(cache+'/ys-chain-d1a.json');
assert.equal(manifest.episode,'d1a');assert.equal(manifest.gate_count,12);assert.deepEqual(manifest.resolution,[1080,1920]);
assert.equal(clip.id,'ys-chain-d1a');assert.equal(manifest.frames.length,12+manifest.supplement_count);
const anchorPath=cache+'/blender/desk/anchors.json',anchors=read(anchorPath);
assert.equal(anchors.fps,30);assert.equal(anchors.frames,Math.ceil(clip.duration*30));
for(const f of manifest.frames){
 assert.equal(Math.round(f.time*30),f.frame);assert.ok(Math.abs(f.time-f.frame/30)<1e-7);
 assert.equal(hash(f.image),f.sha256,'Raw image changed since geometric gate '+f.frame);
 const m=await sharp(f.image).metadata();assert.equal(m.width,1080);assert.equal(m.height,1920);
}
const out=cache+'/gate12-complete_gpt_20261026-'+new Date().toISOString().replace(/[:.]/g,'-');
assert.ok(!fs.existsSync(out));fs.mkdirSync(out+'/fullres',{recursive:true});const records=[];
for(const f of manifest.frames){
 const s=clip.scenes.find(s=>f.time>=s.start&&f.time<s.end)??clip.scenes.at(-1);
 const svg=vertFrame(clip,s,f.time);assert.ok(svg&&!/NaN|Infinity|undefined/.test(svg));
 const file=out+'/fullres/'+String(f.frame).padStart(5,'0')+'.jpg';
 await sharp(Buffer.from(svg)).flatten({background:'#0b1122'}).jpeg({quality:93}).toFile(file);
 const metadata=await sharp(file).metadata();assert.equal(metadata.width,1080);assert.equal(metadata.height,1920);
 records.push({...f,raw:f.image,rawSha256:f.sha256,image:file,sha256:hash(file),svgSha256:crypto.createHash('sha256').update(svg).digest('hex'),personallyViewed:false});
}
const layers=[],tw=270,th=480,lh=26,cols=4;
for(const [i,f]of records.entries()){
 const left=i%cols*tw,top=Math.floor(i/cols)*(th+lh);
 const title=Buffer.from(`<svg width="${tw}" height="${lh}"><rect width="100%" height="100%" fill="white"/><text x="5" y="20" font-family="Arial" font-size="16">row ${f.row} / ${f.time.toFixed(3)}s / f${f.frame}</text></svg>`);
 layers.push({input:title,left,top},{input:await sharp(f.image).resize(tw,th).jpeg({quality:94}).toBuffer(),left,top:top+lh});
}
const sheet=out+'/gate-contact-sheet.jpg';
await sharp({create:{width:cols*tw,height:Math.ceil(records.length/cols)*(th+lh),channels:3,background:'#eee'}}).composite(layers).jpeg({quality:93}).toFile(sheet);
const result={episode:'d1a',sourceManifest:manifestPath,manifestSha256:hash(manifestPath),anchorSha256:hash(anchorPath),
 method:'Untouched production vertFrame through A hooks; exact recorded raw frame; native 1080x1920; no image substitution or cropping.',
 fullres:records,sheet:{image:sheet,sha256:hash(sheet),personallyViewed:false},actualVisualApproval:false,audioReview:false};
fs.writeFileSync(out+'/composition-receipt_gpt_20261026.json',JSON.stringify(result,null,2),{flag:'wx'});
console.log(JSON.stringify({output:out,fullres:records.length,sheet,visualApproval:false},null,2));

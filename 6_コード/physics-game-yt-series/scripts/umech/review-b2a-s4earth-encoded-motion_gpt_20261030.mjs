// Read-only inspection of the actual completed S4 MP4. No producer or QA edits.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const W=path.resolve(fileURLToPath(new URL('../..',import.meta.url)));
const C='/private/tmp/ys/ys-chain-b2a_s4earth_gpt_20261030';
const R=path.join(W,'outputs/ys-chain-b2a-backup/S4修正02_20261030');
const movie=path.join(C,'out/ys-chain-b2a_gpt_20261029_s4_final.mp4');
const FF='/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
const output=path.join(R,'完成MP4から直接抽出_連続動作確認_地表幅修正');
const json=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const hash=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const esc=t=>String(t).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const meta=json(path.join(C,'blender/desk/meta.json'));
assert.equal(meta.frames,14846);assert.equal(meta.samples,16);
assert.deepEqual(meta.resolution,[1080,1920]);assert.ok(meta.finished);
const exportRecord=json(movie.replace(/\.mp4$/,'.export.json'));
assert.equal(exportRecord.inputFrames,14846);assert.equal(exportRecord.encodedFrames,14846);
assert.equal(exportRecord.allFrameDecode,true);assert.equal(exportRecord.nativeCoverageComplete,true);
assert.deepEqual(exportRecord.resolution,[1080,1920]);assert.equal(exportRecord.samples,16);
assert.ok(fs.statSync(movie).size>1000000);
assert.ok(!fs.existsSync(output),'Preserve earlier inspections; choose a fresh helper version if rerun');
const sourceManifest=path.join(R,'連続試写_全16区間/motion-export.json');
const source=json(sourceManifest);
assert.equal(source.contactSamples.length,380);
const samples=source.contactSamples.map(s=>({id:s.id,j:s.j,critical:!!s.critical,label:s.label}));
const indices=[...new Set(samples.map(s=>s.j))].sort((a,b)=>a-b);
for(const w of source.windows)for(const j of w.criticalFrames)assert.ok(indices.includes(j),'Missing declared critical frame '+j);
assert.ok(indices.every(j=>Number.isInteger(j)&&j>=0&&j<14846));
const movieHash=hash(movie),sourceHash=hash(sourceManifest);
assert.equal(movieHash,exportRecord.videoSha256,'Actual encoded MP4 differs from the completed export record');
fs.mkdirSync(output);const frameDir=path.join(output,'frames');fs.mkdirSync(frameDir);
const select=indices.map(j=>`eq(n\\,${j})`).join('+');
const extraction=spawnSync(FF,['-hide_banner','-loglevel','error','-nostdin','-i',movie,'-an','-vf',`select=${select},scale=540:960:flags=lanczos`,'-fps_mode','vfr','-q:v','2','-start_number','0',path.join(frameDir,'%04d.jpg')],{encoding:'utf8',maxBuffer:8*1024*1024});
assert.equal(extraction.status,0,extraction.stderr);
const files=fs.readdirSync(frameDir).filter(n=>/^\d{4}\.jpg$/.test(n)).sort();assert.equal(files.length,indices.length);
const byJ=new Map(indices.map((j,i)=>[j,path.join(frameDir,files[i])]));
const pages=[];
for(let first=0;first<samples.length;first+=8){
 const group=samples.slice(first,first+8),composite=[];
 for(let i=0;i<group.length;i++){
  const s=group[i],x=(i%4)*278,y=Math.floor(i/4)*536;
  const thumb=await sharp(byJ.get(s.j)).resize(270,480).jpeg({quality:95,chromaSubsampling:'4:4:4'}).toBuffer();
  const text=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="270" height="48"><rect width="270" height="48" fill="#eef2f0"/><text x="5" y="18" font-size="13" font-family="sans-serif">${esc(s.id)}</text><text x="5" y="38" font-size="13" font-family="sans-serif">j=${s.j} | ${(s.j/30).toFixed(3)}s | ${s.critical?'critical':'sample'}</text></svg>`);
  composite.push({input:text,left:x+4,top:y+4},{input:thumb,left:x+4,top:y+52});
 }
 const page=path.join(output,`encoded-motion-${String(pages.length+1).padStart(2,'0')}.jpg`);
 await sharp({create:{width:1112,height:1072,channels:3,background:'#d3d7d4'}}).composite(composite).jpeg({quality:95,chromaSubsampling:'4:4:4'}).toFile(page);
 pages.push({page,firstSample:first,lastSample:first+group.length-1,samples:group.map(s=>({...s,image:byJ.get(s.j)}))});
}
assert.equal(hash(movie),movieHash);assert.equal(hash(sourceManifest),sourceHash);
const record={purpose:'Dense event inspection from the actual native S4 encoded MP4, not the earlier preflight movie',movie,movieSha256:movieHash,sourceManifest,sourceManifestSha256:sourceHash,nativeResolution:[1080,1920],reviewResolution:[540,960],fps:30,uniqueExtractedFrames:indices.length,contactSamples:samples.length,pages,allDeclaredCriticalFramesCovered:true,allVisualsReviewed:false,earsPerformed:false,scope:'Exact decoded frame indices; this is a contact-sheet inspection aid, not real-time or every-frame viewing.'};
fs.writeFileSync(path.join(output,'encoded-motion-manifest.json'),JSON.stringify(record,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({output,pages:pages.length,uniqueExtractedFrames:indices.length}));

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import sharp from 'sharp';

// NEW contact sheets from already-decoded current-final JPEGs. No video decode,
// source changes, old receipt edits, or viewing/approval claims are performed.
const INDEX='/private/tmp/ys/ys-chain-c1v1-complete-final-r20-v4/actual-final-review/actual-final-index.json';
const INDEX_SHA='41a543f27141e79e38d9a8a46ca67a6840d1bd90683fa55e9ffc811bdfcb1df5';
const OLD='/private/tmp/ys/ys-chain-c1v1-complete-final-r20-v3/actual-final-required-review-v3/required-final-index.json';
const OLD_SHA='2370e2c1e3f0f5539e41ae0bef1c9bcc1089916e6013be14ed8eb4349b06e373';
const VIDEO_SHA='1a8269cd3f62ea516deeffed145a3df9e1d818ab7ee4bfd9f7e12d1ff4369d74';
const OUT='/private/tmp/ys/ys-chain-c1v1-final-v4-middle019-036-personal-contacts-20261025';
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
assert.equal(sha(INDEX),INDEX_SHA);assert.equal(sha(OLD),OLD_SHA);
const c=read(INDEX),o=read(OLD);assert.equal(c.mp4Sha256,VIDEO_SHA);assert.equal(sha(c.mp4),VIDEO_SHA);
assert(!fs.existsSync(OUT),'Fresh output only');fs.mkdirSync(OUT,{recursive:false});
const cm=new Map(c.frames.map(x=>[x.frame,x])),om=new Map(o.frames.map(x=>[x.frame,x]));
const sheets=o.sheets.filter(x=>x.page>=19&&x.page<=36);assert.equal(sheets.length,18);
const all=[],pages=[];
for(const s of sheets){
 assert.equal(s.frames.length,9);assert.equal(sha(s.file),s.sha256);
 const cells=[],layers=[];
 for(const [i,j] of s.frames.entries()){
  const a=cm.get(j),b=om.get(j);assert(a&&b);assert.equal(sha(a.file),a.sha256);assert.equal(sha(b.file),b.sha256);
  const m=await sharp(a.file).metadata();assert.equal(m.width,1080);assert.equal(m.height,1920);
  const same=a.sha256===b.sha256;
  const row={frame:j,time:j/30,file:a.file,fileSha256:a.sha256,oldFile:b.file,oldFileSha256:b.sha256,
   currentJpegByteIdenticalToOld:same,oldPage:s.page,oldCell:i+1,currentIndexRequiresNewEyes:a.requiresNewEyes,
   thisHelperPerformsActualViewing:false};
  const left=(i%5)*360,top=Math.floor(i/5)*668;
  const label=`old p${String(s.page).padStart(3,'0')} c${i+1} | f${j} ${(j/30).toFixed(3)}s | ${same?'SAME':'CHANGED'}`;
  const svg=Buffer.from(`<svg width="360" height="28"><rect width="360" height="28" fill="${same?'#e8edf2':'#ffdca8'}"/><text x="7" y="19" font-family="Arial" font-size="13" fill="#17202a">${label}</text></svg>`);
  layers.push({input:await sharp(a.file).resize(360,640,{fit:'fill'}).toBuffer(),left,top},{input:svg,left,top:top+640});
  cells.push(row);all.push(row);
 }
 const dest=path.join(OUT,`current-v4-oldpage-${String(s.page).padStart(3,'0')}.jpg`);
 await sharp({create:{width:1800,height:1336,channels:3,background:'#ffffff'}}).composite(layers).jpeg({quality:94}).toFile(dest);
 pages.push({oldPage:s.page,oldSheet:s.file,oldSheetSha256:s.sha256,file:dest,fileSha256:sha(dest),cells});
}
assert.equal(all.length,162);assert.equal(new Set(all.map(x=>x.frame)).size,162);
assert.equal(all.filter(x=>x.currentJpegByteIdenticalToOld).length,157);
assert.deepEqual(all.filter(x=>!x.currentJpegByteIdenticalToOld).map(x=>x.frame),[4710,4727,4740,4770,4800]);
const manifest={sourceHelper:path.resolve(new URL(import.meta.url).pathname),sourceHelperSha256:sha(new URL(import.meta.url)),
 currentIndex:INDEX,currentIndexSha256:INDEX_SHA,oldRequiredIndex:OLD,oldRequiredIndexSha256:OLD_SHA,
 mp4:c.mp4,mp4Sha256:VIDEO_SHA,scope:'Old required-review pages019–036, displayed using current-final-v4 actual decoded JPEGs',
 pageCount:18,actualCellCount:162,sameOldJpegCount:157,changedOldJpegCount:5,pages,
 imageGenerationOnly:true,actualViewingPerformed:false,earsVerified:false,continuousViewingPerformed:false,
 noVideoDecode:true,noGpu:true,noEncode:true,existingFilesEdited:false};
const mp=path.join(OUT,'manifest.json');fs.writeFileSync(mp,JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({manifest:mp,sha256:sha(mp),pages:18,cells:162,same:157,changed:5}));

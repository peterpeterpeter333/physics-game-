// Compact human-review sheets from already decoded final MP4 frames only.
// No Blender, SVG recomposition, video encode or edits to the full actual index.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const root=process.env.C1_FINAL_CACHE??'/private/tmp/ys/ys-chain-c1v1-complete-final-r20-v3';
assert(root.startsWith('/private/tmp/ys/ys-chain-c1v1-')&&root.endsWith('-v3'));
const read=p=>JSON.parse(fs.readFileSync(p)),sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const indexPath=root+'/actual-final-review/actual-final-index.json',indexSha=sha(indexPath),index=read(indexPath),exportPath=root+'/c1-final-export.json',exported=read(exportPath);
assert.equal(index.mp4,exported.video);assert.equal(index.mp4Sha256,exported.videoSha256);assert.equal(sha(index.mp4),index.mp4Sha256);
const qa=read(root+'/actual-patch-human-qa-v3.json');assert.deepEqual(qa.v3ChangedFrames,[9226,9227,9228,9229]);
const boundaries=new Set([...(index.requiredWritingAndPointFrames??[]),...qa.v3ChangedFrames]);
const frames=index.frames.filter(f=>f.integerSecond||f.cueEnds.length||f.major12||f.critical||f.row7OrDelayedPointBoundary||f.moveMidpoints.length||boundaries.has(f.frame));
assert.equal(new Set(frames.map(f=>f.frame)).size,frames.length);
assert.equal(frames.filter(f=>f.integerSecond).length,361);assert.equal(frames.reduce((n,f)=>n+f.cueEnds.length,0),53);
assert.equal(frames.filter(f=>f.major12).length,12);assert.equal(frames.filter(f=>f.critical).length,27);
assert.equal(frames.reduce((n,f)=>n+f.moveMidpoints.length,0),index.moveMidpointCount);
for(const j of boundaries)assert(frames.some(f=>f.frame===j),'Missing writing/point/HUD boundary '+j);
for(const f of frames)assert.equal(sha(f.file),f.sha256,'Decoded MP4 frame changed: '+f.frame);
const out=root+'/actual-final-required-review-v3';assert(!fs.existsSync(out),'Preserve previous review subset');
fs.mkdirSync(out);fs.mkdirSync(out+'/sheets');
const sheets=[];
for(let i=0;i<frames.length;i+=9){
 const group=frames.slice(i,i+9),cards=[];
 for(const f of group){
  const label=Buffer.from(`<svg width="360" height="30"><rect width="360" height="30" fill="white"/><text x="6" y="22" font-family="Arial" font-size="17">C20v3 MP4 ${f.time.toFixed(3)}s / ${f.frame}</text></svg>`);
  cards.push(await sharp({create:{width:360,height:670,channels:3,background:'white'}}).composite([{input:await sharp(f.file).resize(360,640).toBuffer(),left:0,top:30},{input:label,left:0,top:0}]).jpeg({quality:94}).toBuffer());
 }
 const page=sheets.length+1,file=out+'/sheets/sheet-'+String(page).padStart(3,'0')+'.jpg';
 await sharp({create:{width:1080,height:2010,channels:3,background:'white'}}).composite(cards.map((input,k)=>({input,left:k%3*360,top:Math.floor(k/3)*670}))).jpeg({quality:94}).toFile(file);
 sheets.push({page,file,sha256:sha(file),frames:group.map(f=>f.frame)});
}
const third=Math.ceil(sheets.length/3),assignments=[{reviewer:'root',pages:[1,third]},{reviewer:'c1_final_export',pages:[third+1,Math.min(third*2,sheets.length)]},{reviewer:'episode_e1_or_d1',pages:[third*2+1,sheets.length]}];
for(const f of frames)assert.equal(sha(f.file),f.sha256);assert.equal(sha(indexPath),indexSha);assert.equal(sha(index.mp4),index.mp4Sha256);
const report={date:new Date().toISOString(),source:'Subset of actual decoded final MP4 frames; original full index preserved',mp4:index.mp4,mp4Sha256:index.mp4Sha256,fullActualIndex:indexPath,fullActualIndexSha256:indexSha,exportReceipt:exportPath,exportReceiptSha256:sha(exportPath),selection:'Union of every integer second, cue end, major12, critical, required writing/point frames, move midpoint and the four corrected v3 HUD boundary frames. Every1725 patch composite was separately reviewed before encode; this subset is the required full-film encoded review.',frames,frameSha256:Object.fromEntries(frames.map(f=>[f.frame,f.sha256])),sheets,counts:{uniqueFrames:frames.length,integerSeconds:361,cueEnds:53,major12:12,critical:27,moveMidpoints:index.moveMidpointCount,writingPointAndHudBoundaries:boundaries.size},proposedAssignments:assignments,allFramesViewed:false,earsVerified:false,finalAcceptance:false};
const target=out+'/required-final-index.json';fs.writeFileSync(target,JSON.stringify(report,null,1),{flag:'wx'});
console.log(JSON.stringify({out,index:target,indexSha256:sha(target),counts:report.counts,sheets:sheets.length,proposedAssignments:assignments,notEncoded:true}));

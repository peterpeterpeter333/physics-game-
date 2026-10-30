// Run only AFTER the full native render has completed. No Blender/UI/rendering.
// Old R4 images/audits and all producer/QA sources are strictly read-only.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const W=path.resolve(fileURLToPath(new URL('../..',import.meta.url)));
const C5='/private/tmp/ys/ys-chain-b2a_s4final_gpt_20261030',KEY='b2a_s4final_gpt_20261030',ID='ys-chain-b2a_gpt_20261029',FPS=30,NF=14846;
const R5=path.join(W,'outputs/ys-chain-b2a-backup/S4修正02_20261030');
const BEFORE_AUDIT=path.join(W,'outputs/ys-chain-b2a-backup/S4_20261030/全修正試写02/composition-audit.json');
const sha=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const absolute=file=>path.isAbsolute(file)?file:path.resolve(W,file);
const real=file=>{assert.equal(fs.realpathSync(file),path.resolve(file),'Comparison input must be a real file');return file;};
const escape=text=>String(text).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const writeNew=(file,data)=>fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n',{flag:'wx'});

const suffixAt=process.argv.indexOf('--suffix'),suffix=suffixAt<0?'':process.argv[suffixAt+1];
assert.ok(suffix===''||/^[A-Za-z0-9_-]+$/.test(suffix),'Optional --suffix must be a safe fresh attempt label');
const tag=suffix?'_'+suffix:'';
const manifestFile=path.join(R5,'本番修正後70場面_manifest'+tag+'.json');
const afterDir=path.join(R5,'本番修正後70場面'+tag);
const compareDir=path.join(R5,'本番修正前後比較70場面'+tag);
for(const target of [manifestFile,afterDir,compareDir])assert.ok(!fs.existsSync(target),'Preserve prior result; use another --suffix: '+target);

// An unfinished preflight must fail before any output directory/file is made.
const metaFile=real(path.join(C5,'blender/desk/meta.json')),metaSha256=sha(metaFile),meta=read(metaFile);
assert.equal(meta.key,KEY);assert.equal(meta.fps,FPS);assert.equal(meta.frames,NF);assert.equal(meta.samples,16);assert.deepEqual(meta.resolution,[1080,1920]);
assert.equal(meta.previewOnly,false);assert.equal(meta.sampleOnly,false);assert.ok(typeof meta.finished==='string'&&Number.isFinite(Date.parse(meta.finished)),'Native production has not completed');
const nativeNames=new Set(fs.readdirSync(path.join(C5,'blender/desk')).filter(name=>/^\d{5}\.jpg$/.test(name)));
assert.equal(nativeNames.size,NF,'Incomplete full native cache');
for(let j=0;j<NF;j++)assert.ok(nativeNames.has(String(j).padStart(5,'0')+'.jpg'),'Missing exact native frame '+j);

const beforeAuditSha256=sha(real(BEFORE_AUDIT)),before=read(BEFORE_AUDIT);
assert.equal(before.id,ID);assert.equal(before.frameCount,70);assert.equal(before.frames.length,70);
const records=before.frames.map((record,index)=>{
 const j=record.j??record.frame;assert.ok(Number.isInteger(j)&&j>=0&&j<NF);
 const beforeFile=real(absolute(record.output));assert.equal(sha(beforeFile),record.outputSha256,'Old composed image changed: '+beforeFile);
 const exactNative=real(path.join(C5,'blender/desk',String(j).padStart(5,'0')+'.jpg'));
 return {j,row:record.row,seconds:j/FPS,beforeIndex:index,beforeFile,exactNative};
});
assert.equal(new Set(records.map(record=>record.j)).size,70,'Old audit has duplicate exact j');
records.sort((a,b)=>a.j-b.j);
for(const record of records){
 const metadata=await sharp(record.exactNative).metadata();assert.equal(metadata.width,1080);assert.equal(metadata.height,1920);
}
if(process.env.EM_FILM_CACHE)assert.equal(process.env.EM_FILM_CACHE,C5);else process.env.EM_FILM_CACHE=C5;

// Import after all completion and fresh-output guards. compose remains the
// unmodified exact-j producer; it creates 540px review copies from native1080.
const {compose}=await import('./desk-b2a-s4final-stage_gpt_20261030.mjs');
const manifest={episode:'b2a',id:ID,renderKey:KEY,fps:FPS,nativeResolution:[1080,1920],
 sourceBeforeAudit:BEFORE_AUDIT,sourceBeforeAuditSha256:beforeAuditSha256,
 purpose:'All 70 before/after pairs use the identical absolute native j. Review thumbnails are not final-resolution delivery media.',
 frames:records.map(record=>({j:record.j,row:record.row,seconds:record.seconds,where:'same exact j as old R4 audit'}))};
writeNew(manifestFile,manifest);
const after=await compose({manifestFile,output:afterDir});
assert.equal(after.frameCount,70);assert.equal(after.frames.length,70);
const afterByJ=new Map(after.frames.map(record=>[record.j,record]));assert.equal(afterByJ.size,70);
fs.mkdirSync(compareDir,{recursive:false});
const pairs=records.map((record,index)=>{
 const match=afterByJ.get(record.j);assert.ok(match,'New composition is missing old exact j '+record.j);
 assert.deepEqual(match.nativeResolution,[1080,1920]);assert.equal(match.row,record.row);
 return {pair:index+1,row:record.row,j:record.j,absoluteSeconds:record.seconds,before:record.beforeFile,after:real(absolute(match.output)),nativeAfterSource:record.exactNative,
  beforeAuditFrameIndex:record.beforeIndex,afterAuditFrameIndex:after.frames.indexOf(match),comparisonPage:Math.floor(index/6)+1,slot:index%6+1};
});
const pages=[];
for(let start=0;start<pairs.length;start+=6){
 const group=pairs.slice(start,start+6),layers=[];
 for(let index=0;index<group.length;index++){
  const pair=group[index],x=16+(index%3)*468,y=16+Math.floor(index/3)*468;
  const oldThumb=await sharp(pair.before).resize(216,384).jpeg({quality:94,chromaSubsampling:'4:4:4'}).toBuffer();
  const newThumb=await sharp(pair.after).resize(216,384).jpeg({quality:94,chromaSubsampling:'4:4:4'}).toBuffer();
  const label=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="444" height="25"><rect width="216" height="25" fill="#eee3cf"/><rect x="228" width="216" height="25" fill="#d9efda"/><text x="7" y="18" font-family="sans-serif" font-size="15">BEFORE</text><text x="235" y="18" font-family="sans-serif" font-size="15">AFTER native S4</text></svg>`);
  const info=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="444" height="35"><rect width="444" height="35" fill="#fffaf1"/><text x="7" y="22" font-family="sans-serif" font-size="16">${escape('pair '+pair.pair+' | row '+pair.row+' | j '+pair.j+' | '+pair.absoluteSeconds.toFixed(3)+' s')}</text></svg>`);
  layers.push({input:label,left:x,top:y},{input:oldThumb,left:x,top:y+27},{input:newThumb,left:x+228,top:y+27},{input:info,left:x,top:y+413});
 }
 const file=path.join(compareDir,'before-after-'+String(pages.length+1).padStart(2,'0')+'.jpg');
 await sharp({create:{width:1420,height:952,channels:3,background:'#d8d3c9'}}).composite(layers).jpeg({quality:94,chromaSubsampling:'4:4:4'}).toFile(file);pages.push(file);
}
assert.equal(pairs.length,70);assert.equal(pages.length,12);assert.equal(sha(BEFORE_AUDIT),beforeAuditSha256);assert.equal(sha(metaFile),metaSha256);
// Revalidate old before images without writing another per-image SHA table.
for(const record of records)assert.equal(sha(record.beforeFile),before.frames[record.beforeIndex].outputSha256,'Old image changed during comparison');
const pairing={id:ID,renderKey:KEY,scope:'70 exact-j source comparisons only. Page production does not mean visual review/ear listening or final MP4 gate completion.',
 sourceBeforeAudit:BEFORE_AUDIT,sourceBeforeAuditSha256:beforeAuditSha256,sourceAfterAudit:path.join(afterDir,'composition-audit.json'),
 nativeCompletionMeta:metaFile,nativeCompletionMetaSha256:metaSha256,nativeResolution:[1080,1920],reviewResolution:[540,960],thumbnailResolution:[216,384],fps:FPS,
 exactPairCount:70,pages,pairs,allPairsUseSameAbsoluteJ:true,noNearestFrameSubstitution:true,oldFilesUnchanged:true,personallyViewed:false,earsPerformed:false};
writeNew(path.join(compareDir,'pairing.json'),pairing);
console.log(JSON.stringify({manifestFile,afterDir,comparisonDir:compareDir,pairing:path.join(compareDir,'pairing.json'),pairs:pairs.length,pages:pages.length,allExactJ:true,personallyViewed:false},null,2));

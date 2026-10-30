// Exactly the newly found obsolete0–1 HUD fade. No Blender, full encode or old rewrite.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createRequire} from 'node:module';import {fileURLToPath} from 'node:url';import sharp from 'sharp';
const R='/private/tmp/ys/ys-chain-c1v1-camera-semantic-final-r20',W=fileURLToPath(new URL('../../',import.meta.url)),id='ys-chain-c1v1',out=R+'/actual-patch-review-v3';
const read=p=>JSON.parse(fs.readFileSync(p)),sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,1),{flag:'wx'});
assert(!fs.existsSync(out));const oldPath=R+'/actual-patch-review/actual-patch-index.json',old=read(oldPath),proof=read(R+'/camera-patch.json');
assert.equal(sha(oldPath),'6100f4815e4678e8a979ae55632a8fdcfb50443a9eeaa9cf1070f9298f2d39d0');assert.equal(old.actualFrames,1725);assert.equal(old.errors.length,0);
const pins={...proof.patchDependencySha256,[oldPath]:sha(oldPath),[R+'/camera-patch.json']:sha(R+'/camera-patch.json'),[fileURLToPath(new URL('./desk-c1v1-complete-frame-v2.mjs',import.meta.url))]:'75e04506a4d7c30e4e6c76d14ab8cbdd03aff033b104989eeb2af3e854fa2aa0',[fileURLToPath(new URL('./desk-c1v1-complete-frame-v3.mjs',import.meta.url))]:'111b2bbb099fe82f3fbca2af9b1e586b1f1738f2aeecab9219f28e2790371341'};
for(const[p,h]of Object.entries(pins))assert.equal(sha(p),h,p);
process.env.EM_FILM_CACHE=R;const {vertFrame:before,C1_FINAL_ACTION_REPAIRS}=await import('./desk-c1v1-complete-frame-v2.mjs'),{vertFrame:after}=await import('./desk-c1v1-complete-frame-v3.mjs');
const base=read(R+'/plan.json')[0],timed=read(R+'/'+id+'.json'),clip={...base,duration:timed.duration,scenes:base.scenes.map((s,i)=>({...s,...timed.scenes[i],cues:s.cues}))},p=C1_FINAL_ACTION_REPAIRS.row38.oldPoint;
const gate=W+'scripts/umech/desk-quality-gate.mjs',src=fs.readFileSync(gate,'utf8'),defs=src.slice(src.indexOf('const AFF='),src.indexOf('async function checkSvg()')).replace('export function svgItems','function svgItems'),{refine,svgItems}=new Function('createRequire','ROOT','path',defs+'\nreturn {refine,svgItems};')(createRequire,W,path);
for(const d of[out,out+'/frames',out+'/sheets'])fs.mkdirSync(d);
const changed=[],errors=[],by=new Map(old.frames.map(x=>[x.frame,x])),unchanged={};
// Exhaust every30fps output within the entire guarded time window, not just a sample.
for(let j=Math.ceil((p-.15)*30);j/30<p+3.3;j++){
 const t=j/30,s=clip.scenes.find(s=>t>=s.start&&t<s.end)??clip.scenes.at(-1),a=before(clip,s,t),b=after(clip,s,t);
 if(a===b)continue;
 assert(by.has(j),'Every changed output needs an actualC20 composite source');assert(!b.includes('>人の手 0 − 1 機械</text>'));
 const needle='>人の手 0 − 1 機械</text>',at=a.indexOf(needle),begin=a.lastIndexOf('<g ',at),end=a.indexOf('</g>',at)+4;assert.equal(b,a.slice(0,begin)+a.slice(end),'Only the isolated obsolete score card may change');
 for(const it of await refine(svgItems(b))){if(it.op<.05||(it.kind==='rect'&&it.w>=1080*.9&&it.h>=1920*.5)||(it.kind==='text'&&!it.s.trim()))continue;const[x0,y0,x1,y1]=it.box,tol=it.kind==='rect'?16:6;if(x0<40-tol||x1>1040+tol||y0<110-tol||y1>1600+tol)errors.push({j,kind:'outside',box:it.box});if(it.kind==='text'&&it.size<35.99&&!/^[\s、。，．・→←↑↓⇒\-–—…:：|｜\/／]+$/.test(it.s))errors.push({j,kind:'small',text:it.s});if(it.card&&Math.max(it.card[0]-x0,x1-it.card[2])>2)errors.push({j,kind:'card',text:it.s});}
 const file=out+'/frames/'+String(j).padStart(5,'0')+'.png';await sharp(Buffer.from(b)).png().toFile(file);changed.push({frame:j,time:t,file,sha256:sha(file),previousFile:by.get(j).file,previousSha256:by.get(j).sha256,removedSvgGroup:a.slice(begin,end)});
}
assert.deepEqual(changed.map(x=>x.frame),[9226,9227,9228,9229]);assert.equal(errors.length,0);
const changes=new Map(changed.map(x=>[x.frame,x])),frames=old.frames.map(x=>{
 assert.equal(sha(x.file),x.sha256);assert.equal(sha(x.actualRaw),x.actualRawSha256);
 const c=changes.get(x.frame),file=out+'/frames/'+String(x.frame).padStart(5,'0')+'.png';if(!c){fs.symlinkSync(x.file,file);unchanged[x.frame]=x.sha256;}
 return {...x,file,sha256:sha(file),v3OldHudFadeRemoved:!!c,previousV2Composite:x.file,previousV2CompositeSha256:x.sha256};
});
const sheets=[];
for(const oldSheet of old.sheets){const file=out+'/sheets/'+path.basename(oldSheet.file),cells=frames.filter(x=>oldSheet.frames.includes(x.frame));
 if(!oldSheet.frames.some(j=>changes.has(j))){fs.symlinkSync(oldSheet.file,file);assert.equal(sha(file),oldSheet.sha256);}
 else{const cards=[];for(const x of cells){const label=Buffer.from(`<svg width="360" height="30"><rect width="360" height="30" fill="white"/><text x="8" y="22" font-family="Arial" font-size="17">C20 ${x.time.toFixed(3)}s / ${x.frame}</text></svg>`);cards.push(await sharp({create:{width:360,height:670,channels:3,background:'white'}}).composite([{input:await sharp(x.file).resize(360,640).toBuffer(),left:0,top:30},{input:label,left:0,top:0}]).jpeg({quality:94}).toBuffer());}await sharp({create:{width:1080,height:2010,channels:3,background:'white'}}).composite(cards.map((input,k)=>({input,left:k%3*360,top:Math.floor(k/3)*670}))).jpeg({quality:94}).toFile(file);}
 sheets.push({...oldSheet,file,sha256:sha(file),v3ChangedCells:oldSheet.frames.filter(j=>changes.has(j))});
}
for(const[p,h]of Object.entries(pins))assert.equal(sha(p),h,p);
const report={...old,source:'Exact C20 actual JPEGs plus v3; originalv2 all1725/192 preserved. Only4 oldHUDfade composites are changed.',frames,sheets,errors,previousV2Index:oldPath,previousV2IndexSha256:sha(oldPath),v3ChangedFrames:changed.map(x=>x.frame),v3ActuallyViewed:false,allImagesViewed:false,finalFrameSha256:sha(fileURLToPath(new URL('./desk-c1v1-complete-frame-v3.mjs',import.meta.url)))};
write(out+'/actual-patch-index.json',report);write(out+'/v3-diff-proof.json',{inputsSha256:pins,changedFrames:changed,unchangedPngSha256:unchanged,unchangedPngCount:Object.keys(unchanged).length,changedSheets:sheets.filter(x=>x.v3ChangedCells.length),checkedEveryFrameInEntireGuardedWindow:true,outsideWindowAndForeignClipsReturnOriginalSvgByConstruction:true,allPrevious1725PngAndRawShaVerified:true,originalSvgAlgorithmSha256:sha(gate),errors,oldSourceAndEvidenceUnchanged:true,actualEyeReviewPending:true,finalMp4Acceptance:false});
console.log(JSON.stringify({out,changed:changed.map(x=>x.frame),unchangedPng:Object.keys(unchanged).length,changedSheets:sheets.filter(x=>x.v3ChangedCells.length).map(x=>x.page),errors:errors.length}));

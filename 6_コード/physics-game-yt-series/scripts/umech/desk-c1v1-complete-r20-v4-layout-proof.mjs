// Exhaustive SVG comparison plus all 31 changed actual-raw composites.
// This proves a bounded source difference; it never claims human or final-MP4 acceptance.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
const root=process.env.C1_FINAL_CACHE??'/private/tmp/ys/ys-chain-c1v1-complete-final-r20-v4';process.env.EM_FILM_CACHE=root;
const W=fileURLToPath(new URL('../../',import.meta.url)),read=p=>JSON.parse(fs.readFileSync(p)),sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const cache=read(root+'/complete-cache.json'),out=root+'/v4-layout-preview';assert(!fs.existsSync(out));
for(const[p,h]of Object.entries(cache.frozen))assert.equal(sha(p),h,p);
const inputsSha256={...cache.frozen};for(const f of ['plan.json','ys-chain-c1v1.json','phrase-times.json','blender/data.json','blender/desk/anchors.json','blender/desk/meta.json','ys-chain-c1v1.voice.wav','ys-chain-c1v1.wav'])inputsSha256[root+'/'+f]=sha(root+'/'+f);
const {vertFrame:old}=await import('./desk-c1v1-complete-frame-v3.mjs'),{vertFrame:next,c1FirstCarryOrderCaptionSlice,C1_V4_LAYOUT_REPAIR:repair}=await import('./desk-c1v1-complete-frame-v4.mjs');
const base=read(root+'/plan.json')[0],timed=read(root+'/ys-chain-c1v1.json'),clip={...base,duration:timed.duration,scenes:base.scenes.map((s,i)=>({...s,...timed.scenes[i],cues:s.cues}))};
const gate=W+'scripts/umech/desk-quality-gate.mjs',source=fs.readFileSync(gate,'utf8'),defs=source.slice(source.indexOf('const AFF='),source.indexOf('async function checkSvg()')).replace('export function svgItems','function svgItems');
const {refine,svgItems}=new Function('createRequire','ROOT','path',defs+'\nreturn {refine,svgItems};')(createRequire,W,path);
fs.mkdirSync(out);fs.mkdirSync(out+'/frames');fs.mkdirSync(out+'/sheets');
old(clip,clip.scenes[0],0);const originalPlan=JSON.stringify(clip),changedFrames=[],previews=[],cards=[],sheets=[],geometry=[];let outsideScopeSvgByteEqualFrames=0,minGlyphGap=Infinity,minUnderlineGap=Infinity,minFont=Infinity;
const started=Date.now(),nf=Math.ceil(timed.duration*30);assert.equal(nf,10814);
for(let j=0;j<nf;j++){
 const t=j/30,s=clip.scenes.find(s=>t>=s.start&&t<s.end)??clip.scenes.at(-1),a=old(clip,s,t),b=next(clip,s,t),allowed=j>=4712&&j<=4742;
 if(!allowed){assert.equal(b,a,'Out-of-scope SVG bytes '+j);outsideScopeSvgByteEqualFrames++;continue;}
 assert.notEqual(b,a);const {begin,end,layer}=c1FirstCarryOrderCaptionSlice(a);
 assert.equal(b,a.slice(0,begin)+'<g transform="translate(-240 0)">'+layer+'</g>'+a.slice(end),'Only the exact unchanged caption/speaker suffix moves');
 assert(!/NaN|Infinity|undefined/.test(b));changedFrames.push(j);
 const its=await refine(svgItems(b)),paper=its.filter(it=>it.kind==='text'&&['27','＋18','45','1'].includes(it.s)),caption=its.filter(it=>it.kind==='text'&&it.size===66),badge=its.filter(it=>it.kind==='rect'&&it.w===140&&it.h===52);
 assert.equal(paper.length,4);assert.equal(caption.length,2);assert.equal(badge.length,1);
 const glyphGap=Math.min(...paper.map(it=>it.box[0]))-Math.max(...caption.map(it=>it.box[2])),underlineGap=450-Math.max(...caption.map(it=>it.box[2]));
 minGlyphGap=Math.min(minGlyphGap,glyphGap);minUnderlineGap=Math.min(minUnderlineGap,underlineGap);assert(glyphGap>=61&&underlineGap>=24);
 for(const it of its){if(it.op<.05)continue;if(it.kind==='rect'&&it.w>=1080*.9&&it.h>=1920*.5)continue;if(it.kind==='text'&&!it.s.trim())continue;const[x0,y0,x1,y1]=it.box,tol=it.kind==='rect'?16:6;assert(x0>=40-tol&&x1<=1040+tol&&y0>=110-tol&&y1<=1600+tol,'Original safe-area criterion '+j);if(it.kind==='text'){minFont=Math.min(minFont,it.size);assert(it.size>=36);}if(it.card)assert(Math.max(it.card[0]-x0,x1-it.card[2])<=2);}
 geometry.push({frame:j,time:t,paper:paper.map(it=>({text:it.s,box:it.box})),caption:caption.map(it=>({text:it.s,box:it.box})),badge:badge[0].box,glyphGap,underlineGap});
 const file=out+'/frames/'+String(j).padStart(5,'0')+'.png';await sharp(Buffer.from(b)).png().toFile(file);
 const actualRaw=root+'/blender/desk/'+String(j).padStart(5,'0')+'.jpg';previews.push({frame:j,time:t,file,sha256:sha(file),actualRaw,actualRawSha256:sha(actualRaw),source:'Frozen actual rendered raw JPEG + v4 source composite; not decoded final v4 MP4'});
 const label=Buffer.from(`<svg width="360" height="30"><rect width="360" height="30" fill="white"/><text x="8" y="22" font-family="Arial" font-size="17">${t.toFixed(3)}s / ${j} - v4 layout</text></svg>`);
 cards.push(await sharp({create:{width:360,height:670,channels:3,background:'white'}}).composite([{input:await sharp(file).resize(360,640).toBuffer(),left:0,top:30},{input:label,left:0,top:0}]).jpeg({quality:94}).toBuffer());
 if(j===4742)console.log(JSON.stringify({changedComposites:previews.length,remainingSvgComparison:nf-j-1}));
}
assert.equal(JSON.stringify(clip),originalPlan);assert.deepEqual(changedFrames,Array.from({length:31},(_,i)=>4712+i));assert.equal(outsideScopeSvgByteEqualFrames,10783);
for(const id of ['ys-chain-b1v1','ys-chain-d1v1','ys-chain-e1v1','ys-chain-1-1v6','ys-chain-1-2v2'])for(const f of [4712,4727,4742]){const c={...clip,id},s=c.scenes.find(s=>f/30>=s.start&&f/30<s.end);assert.equal(next(c,s,f/30),old(c,s,f/30));}
for(let i=0;i<cards.length;i+=9){const file=out+'/sheets/sheet-'+String(i/9+1).padStart(2,'0')+'.jpg';await sharp({create:{width:1080,height:2010,channels:3,background:'white'}}).composite(cards.slice(i,i+9).map((input,k)=>({input,left:k%3*360,top:Math.floor(k/3)*670}))).jpeg({quality:94}).toFile(file);sheets.push({file,sha256:sha(file),frames:changedFrames.slice(i,i+9)});}
for(const[p,h]of Object.entries(inputsSha256))assert.equal(sha(p),h,p);
const report={date:new Date().toISOString(),scope:'C-only source layout derivative; all old v3 evidence and its confirmed collision remain intact',repair,canonicalChunkInterval:[157.05199999999996,158.08799999999997],allOutputFramesCompared:nf,outsideScopeSvgByteEqualFrames,changedFrames,onlyExactOriginalCaptionLayerTranslated:true,originalPlanAndCaptionObjectsUnchanged:true,minimumNumeralGlyphGap:minGlyphGap,minimumUnderlineGap:minUnderlineGap,minimumFont:minFont,insideOriginalSafeArea:true,otherEpisodeIdsByteEqual:true,originalGateGeometryAlgorithmSha256:sha(gate),inputsSha256,geometry,previews,sheets,seconds:(Date.now()-started)/1000,noGpu:true,noEncode:true,allNewCompositesPersonallyViewed:false,finalMp4Acceptance:false,earsVerified:false};
fs.writeFileSync(out+'/layout-diff-proof.json',JSON.stringify(report,null,1),{flag:'wx'});console.log(JSON.stringify({out,allOutputFramesCompared:nf,outsideScopeSvgByteEqualFrames,changedFrames:changedFrames.length,minGlyphGap,minUnderlineGap,minFont,sheets:sheets.length,noEncode:true}));

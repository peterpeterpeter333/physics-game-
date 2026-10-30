// Actual C17 probe/final local images, exact final compositor, original glyph audit.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';import {createRequire} from 'node:module';import {fileURLToPath} from 'node:url';import sharp from 'sharp';
const trial=process.argv.includes('--trial'),R16='/private/tmp/ys/ys-chain-c1v1-camera-semantic-final-r16',root=trial?'/private/tmp/ys/ys-chain-c1v1-crowd-r17-trial':process.env.C1_FINAL_CACHE;
assert(root&&root.includes('ys-chain-c1v1-'));
const W=fileURLToPath(new URL('../../',import.meta.url)),hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p)),id='ys-chain-c1v1';
const out=root+(trial?'/composite-review':'/actual-patch-review');assert(!fs.existsSync(out));fs.mkdirSync(out);fs.mkdirSync(out+'/frames');fs.mkdirSync(out+'/sheets');
const proof=read(root+(trial?'/trial.json':'/camera-patch.json')),baseProof=read(R16+'/camera-patch.json');
const guard={...baseProof.originalSourceSha256,...baseProof.immutableInputSha256,...baseProof.patchDependencySha256,...(trial?proof.dependencySha256:proof.patchDependencySha256)};
for(const [p,h]of Object.entries(guard))assert.equal(hash(p),h,p);
let cache=root,frames,rawFor;
if(trial){
 cache=out+'/cache';fs.mkdirSync(cache);fs.mkdirSync(cache+'/blender');fs.mkdirSync(cache+'/blender/desk');
 for(const f of ['plan.json',id+'.json','phrase-times.json'])fs.symlinkSync(R16+'/'+f,cache+'/'+f);
 fs.symlinkSync(R16+'/blender/data.json',cache+'/blender/data.json');
 const a=read(R16+'/blender/desk/anchors.json');for(const [key,points]of Object.entries(proof.anchors))for(const [j,p]of Object.entries(points))a.anchors[key][Number(j)]=p;
 fs.writeFileSync(cache+'/blender/desk/anchors.json',JSON.stringify(a));
 frames=[...new Set([...proof.frames,...Array.from({length:30},(_,i)=>1014+i)])].sort((a,b)=>a-b);
 rawFor=j=>proof.frames.includes(j)?root+'/raw/'+String(j).padStart(5,'0')+'.jpg':R16+'/blender/desk/'+String(j).padStart(5,'0')+'.jpg';
 for(const j of frames)fs.symlinkSync(rawFor(j),cache+'/blender/desk/'+String(j).padStart(5,'0')+'.jpg');
}else{
 assert(proof.root===root&&proof.allPatchJpegsActuallyRendered&&proof.allMeasuredPatchGeometryWithinFrame&&proof.allFrozenInputsUnchanged&&proof.otherSceneOutputsUnchanged);
 frames=[...new Set(proof.patchFrames)].sort((a,b)=>a-b);rawFor=j=>proof.raw+'/'+String(j).padStart(5,'0')+'.jpg';
}
process.env.EM_FILM_CACHE=cache;
const {vertFrame}=await import('./desk-c1v1-final-frame.mjs'),{vertFrame:previous}=await import('./desk-c1v1-approved-frame.mjs');
const base=read(cache+'/plan.json')[0],timed=read(cache+'/'+id+'.json'),clip={...base,duration:timed.duration,scenes:base.scenes.map((s,i)=>({...s,...timed.scenes[i],cues:s.cues}))};
// Do not evaluate t0 in four-probe cache: its actual raw is intentionally absent.
const before=JSON.stringify(clip),gate=W+'scripts/umech/desk-quality-gate.mjs',src=fs.readFileSync(gate,'utf8'),defs=src.slice(src.indexOf('const AFF='),src.indexOf('async function checkSvg()')).replace('export function svgItems','function svgItems');
const {refine,svgItems}=new Function('createRequire','ROOT','path',defs+'\nreturn {refine,svgItems};')(createRequire,W,path),errors=[],items=[],cards=[],sheets=[];
const priorIndex=trial?null:read(R16+'/actual-patch-review/actual-patch-index.json'),priorQa=trial?null:read(R16+'/actual-patch-human-qa.json'),priorItems=new Map((priorIndex?.frames??[]).map(x=>[x.frame,x]));
if(!trial)assert(priorQa.allActualPatchFramesViewed&&priorQa.actualPatchFrames===526);
for(const j of frames){
 const raw=rawFor(j);assert(fs.statSync(raw).size>1024);assert.equal(fs.realpathSync(cache+'/blender/desk/'+String(j).padStart(5,'0')+'.jpg'),fs.realpathSync(raw));
 const t=j/30,s=clip.scenes.find(s=>t>=s.start&&t<s.end)??clip.scenes.at(-1),svg=vertFrame(clip,s,t);assert(!/NaN|Infinity|undefined/.test(svg));
 for(const it of await refine(svgItems(svg))){if(it.op<.05)continue;const [x0,y0,x1,y1]=it.box,tol=it.kind==='rect'?16:6;
  if(x0<40-tol||x1>1040+tol||y0<110-tol||y1>1600+tol)errors.push({frame:j,kind:'outside',text:it.s??'rect',box:it.box});
  if(it.kind==='text'&&it.size<35.99&&!/^[\s、。，．・→←↑↓⇒\-–—…:：|｜\/／]+$/.test(it.s))errors.push({frame:j,kind:'small',text:it.s,size:it.size});
  if(it.card&&Math.max(it.card[0]-x0,x1-it.card[2])>2)errors.push({frame:j,kind:'card',text:it.s,box:it.box,card:it.card});
 }
 const old=previous(clip,s,t);if(t<33.786||t>=41.47666666666666)assert.equal(svg,old,'Non-Pascal SVG remains byte identical');
 else {const at=old.indexOf('>1642年ごろ ブレーズ・パスカル</text>'),b=old.lastIndexOf('<g ',at),e=old.indexOf('</g>',at)+4;assert(b>=0&&e>at);assert.equal(svg,old.slice(0,b)+'<g transform="translate(0 90)">'+old.slice(b,e)+'</g>'+old.slice(e),'Only isolated card transform may differ');}
 const file=out+'/frames/'+String(j).padStart(5,'0')+'.png',png=await sharp(Buffer.from(svg)).png().toBuffer();fs.writeFileSync(file,png);
 const label=Buffer.from(`<svg width="360" height="30"><rect width="360" height="30" fill="white"/><text x="8" y="22" font-family="Arial" font-size="18">C1 ${t.toFixed(3)} s / ${j}</text></svg>`);
 cards.push(await sharp({create:{width:360,height:670,channels:3,background:'white'}}).composite([{input:await sharp(png).resize(360,640).toBuffer(),left:0,top:30},{input:label,left:0,top:0}]).jpeg({quality:94}).toBuffer());
 const prior=priorItems.get(j),same=!!prior&&svg===old&&hash(raw)===prior.actualRawSha256;
 if(same)assert.equal(hash(file),prior.sha256,'Unchanged actual composite remains byte-identical to personally reviewed r16 image');
 items.push({frame:j,time:t,file,sha256:hash(file),actualRaw:raw,actualRawSha256:hash(raw),onlyNameCardTransformChanged:svg!==old,previousPersonallyViewedCompositeByteEqual:same,previousComposite:same?prior.file:null});
}
for(let i=0;i<cards.length;i+=9){const p=out+'/sheets/sheet-'+String(i/9+1).padStart(3,'0')+'.jpg';await sharp({create:{width:1080,height:2010,channels:3,background:'white'}}).composite(cards.slice(i,i+9).map((input,k)=>({input,left:k%3*360,top:Math.floor(k/3)*670}))).jpeg({quality:94}).toFile(p);sheets.push(p);}
assert.equal(JSON.stringify(clip),before);for(const [p,h]of Object.entries(guard))assert.equal(hash(p),h,p);
const report={date:new Date().toISOString(),root,cache,source:'Actually rendered JPEGs through exact final C compositor; no final MP4 yet',proofSha256:hash(root+(trial?'/trial.json':'/camera-patch.json')),actualFrames:items.length,frames:items,sheets,errors,allImagesViewed:false,earsVerified:false,allFrozenInputsUnchanged:true,previousPersonallyViewedByteEqualImages:items.filter(x=>x.previousPersonallyViewedCompositeByteEqual).length,newActualCompositeImagesRequiringVisualReview:items.filter(x=>!x.previousPersonallyViewedCompositeByteEqual).map(x=>x.frame),previousPersonalReviewSha256:trial?null:hash(R16+'/actual-patch-human-qa.json'),previousActualIndexSha256:trial?null:hash(R16+'/actual-patch-review/actual-patch-index.json'),finalFrameSha256:hash(fileURLToPath(new URL('./desk-c1v1-final-frame.mjs',import.meta.url))),originalSvgFontAlgorithmSha256:hash(gate)};
fs.writeFileSync(out+'/actual-patch-index.json',JSON.stringify(report,null,1));console.log(JSON.stringify({out,actualFrames:items.length,sheets:sheets.length,errors:errors.length}));if(errors.length)process.exitCode=1;

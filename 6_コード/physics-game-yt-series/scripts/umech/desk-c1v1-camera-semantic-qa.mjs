// Review every newly rendered C correction with the exact final compositor.
// This does not render Blender, encode a final film, or mark images viewed.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
const root=process.env.C1_FINAL_CACHE;assert(root&&root.includes('ys-chain-c1v1-'));
const id='ys-chain-c1v1',W=fileURLToPath(new URL('../../',import.meta.url)),out=root+'/actual-patch-review';
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
const proof=read(root+'/camera-patch.json');
assert(proof.root===root&&proof.frames===10814&&proof.allPatchJpegsActuallyRendered&&proof.allMeasuredPatchGeometryWithinFrame&&proof.allFrozenInputsUnchanged&&proof.otherSceneOutputsUnchanged);
assert(proof.cameraOnly||proof.cameraAndConfirmedSemanticHoldCorrectionOnly);
const guard={...proof.originalSourceSha256,...proof.immutableInputSha256,...proof.patchDependencySha256};
for(const [p,h]of Object.entries(guard))assert.equal(hash(p),h,p);
assert(!fs.existsSync(out),'Preserve earlier actual patch QA');fs.mkdirSync(out);fs.mkdirSync(out+'/frames');fs.mkdirSync(out+'/sheets');
process.env.EM_FILM_CACHE=root;
const {vertFrame}=await import('./desk-c1v1-approved-frame.mjs');
const base=read(root+'/plan.json')[0],timed=read(root+'/'+id+'.json'),clip={...base,duration:timed.duration,scenes:base.scenes.map((s,i)=>({...s,...timed.scenes[i],cues:s.cues}))};
vertFrame(clip,clip.scenes[0],0);const before=JSON.stringify(clip);
const gate=W+'scripts/umech/desk-quality-gate.mjs',src=fs.readFileSync(gate,'utf8'),defs=src.slice(src.indexOf('const AFF='),src.indexOf('async function checkSvg()')).replace('export function svgItems','function svgItems');
const {refine,svgItems}=new Function('createRequire','ROOT','path',defs+'\nreturn {refine,svgItems};')(createRequire,W,path);
const frames=[...new Set(proof.patchFrames)].sort((a,b)=>a-b),items=[],sheets=[],cards=[],errors=[];
for(const j of frames){
 const raw=proof.raw+'/'+String(j).padStart(5,'0')+'.jpg';assert(fs.existsSync(raw));
 assert.equal(fs.realpathSync(root+'/blender/desk/'+String(j).padStart(5,'0')+'.jpg'),fs.realpathSync(raw));
 const t=j/30,scene=clip.scenes.find(s=>t>=s.start&&t<s.end)??clip.scenes.at(-1),svg=vertFrame(clip,scene,t);assert(!/NaN|Infinity|undefined/.test(svg));
 for(const it of await refine(svgItems(svg))){if(it.op<.05)continue;const [x0,y0,x1,y1]=it.box,tol=it.kind==='rect'?16:6;
  if(x0<40-tol||x1>1040+tol||y0<110-tol||y1>1600+tol)errors.push({t,kind:'outside',text:it.s??'rect',box:it.box});
  if(it.kind==='text'&&it.size<35.99&&!/^[\s、。，．・→←↑↓⇒\-–—…:：|｜\/／]+$/.test(it.s))errors.push({t,kind:'small',text:it.s,size:it.size});
  if(it.card&&Math.max(it.card[0]-x0,x1-it.card[2])>2)errors.push({t,kind:'card',text:it.s,box:it.box,card:it.card});
 }
 const file=out+'/frames/'+String(j).padStart(5,'0')+'.png',image=await sharp(Buffer.from(svg)).png().toBuffer();fs.writeFileSync(file,image);
 const label=Buffer.from(`<svg width="360" height="30"><rect width="360" height="30" fill="white"/><text x="8" y="22" font-family="Arial" font-size="18">C1 actual ${t.toFixed(3)} s / ${j}</text></svg>`);
 cards.push(await sharp({create:{width:360,height:670,channels:3,background:'white'}}).composite([{input:await sharp(image).resize(360,640).toBuffer(),left:0,top:30},{input:label,left:0,top:0}]).jpeg({quality:94}).toBuffer());
 items.push({frame:j,time:t,file,sha256:hash(file),actualRaw:raw,actualRawSha256:hash(raw),semanticCorrection:(proof.semanticCorrections??[]).filter(r=>r.newSemanticFrame===j)});
}
for(let i=0;i<cards.length;i+=9){const p=out+'/sheets/sheet-'+String(i/9+1).padStart(3,'0')+'.jpg';await sharp({create:{width:1080,height:2010,channels:3,background:'white'}}).composite(cards.slice(i,i+9).map((input,k)=>({input,left:k%3*360,top:Math.floor(k/3)*670}))).jpeg({quality:94}).toFile(p);sheets.push(p);}
assert.equal(JSON.stringify(clip),before);for(const [p,h]of Object.entries(guard))assert.equal(hash(p),h,p);
const report={date:new Date().toISOString(),source:'Each actually rendered correction JPEG through the frozen approved final compositor; not an encoded final MP4',root,proof:root+'/camera-patch.json',proofSha256:hash(root+'/camera-patch.json'),actualFrames:items.length,frames:items,sheets,originalSvgFontAlgorithmSha256:hash(gate),errors,allImagesViewed:false,earsVerified:false,originalNumerical7bNotWaived:true,allFrozenInputsUnchanged:true};
fs.writeFileSync(out+'/actual-patch-index.json',JSON.stringify(report,null,1));console.log(JSON.stringify({out,actualFrames:items.length,sheets:sheets.length,fontAndCardErrors:errors.length}));if(errors.length)process.exitCode=1;

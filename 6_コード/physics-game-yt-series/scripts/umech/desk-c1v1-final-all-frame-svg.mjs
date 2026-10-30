// Exhaustive final-frame SVG diagnostic with the original measured-glyph code.
// Original quality tests and thresholds stay unchanged; this is extra evidence.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createRequire} from 'node:module';import {fileURLToPath} from 'node:url';
const root=process.env.C1_FINAL_CACHE;assert(root);process.env.EM_FILM_CACHE=root;
const W=fileURLToPath(new URL('../../',import.meta.url)),id='ys-chain-c1v1',read=p=>JSON.parse(fs.readFileSync(p)),hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),out=root+'/all-frame-svg-audit.json';assert(!fs.existsSync(out));
const exported=read(root+'/c1-final-export.json');assert.equal(hash(exported.video),exported.videoSha256);
const base=read(root+'/plan.json')[0],timed=read(root+'/'+id+'.json'),clip={...base,duration:timed.duration,scenes:base.scenes.map((s,i)=>({...s,...timed.scenes[i],cues:s.cues}))};
const gate=W+'scripts/umech/desk-quality-gate.mjs',src=fs.readFileSync(gate,'utf8'),defs=src.slice(src.indexOf('const AFF='),src.indexOf('async function checkSvg()')).replace('export function svgItems','function svgItems');
const {refine,svgItems}=new Function('createRequire','ROOT','path',defs+'\nreturn {refine,svgItems};')(createRequire,W,path),{vertFrame}=await import('./desk-c1v1-final-frame.mjs');
const errors=[],hashes=[],nf=Math.ceil(timed.duration*30),started=Date.now();assert.equal(nf,10814);let checked=0;
for(let j=0;j<nf;j++){
 const t=j/30,s=clip.scenes.find(s=>t>=s.start&&t<s.end)??clip.scenes.at(-1),svg=vertFrame(clip,s,t);assert(!/NaN|Infinity|undefined/.test(svg));hashes.push(createHash('sha256').update(svg).digest('hex'));
 for(const it of await refine(svgItems(svg))){if(it.op<.05)continue;if(it.kind==='rect'&&it.w>=1080*.9&&it.h>=1920*.5)continue;if(it.kind==='text'&&!it.s.trim())continue;
  const [x0,y0,x1,y1]=it.box,tol=it.kind==='rect'?16:6;checked++;
  if(x0<40-tol||x1>1040+tol||y0<110-tol||y1>1600+tol)errors.push({frame:j,time:t,kind:'outside',text:it.s??'rect',box:it.box});
  if(it.kind==='text'&&it.size<35.99&&!/^[\s、。，．・→←↑↓⇒\-–—…:：|｜\/／]+$/.test(it.s))errors.push({frame:j,time:t,kind:'small',text:it.s,size:it.size});
  if(it.card&&Math.max(it.card[0]-x0,x1-it.card[2])>2)errors.push({frame:j,time:t,kind:'card',text:it.s,box:it.box,card:it.card});
 }
 if(j&&j%1800===0)console.log(JSON.stringify({frame:j,of:nf,errors:errors.length,seconds:(Date.now()-started)/1000}));
}
assert.equal(hash(exported.video),exported.videoSha256);
fs.writeFileSync(out,JSON.stringify({date:new Date().toISOString(),source:'Every exact final 30fps compositor SVG; original svgItems/refine measured glyphs; not a replacement for actual MP4 review',frames:nf,measuredItems:checked,seconds:(Date.now()-started)/1000,mp4Sha256:exported.videoSha256,originalSvgAlgorithmSha256:hash(gate),sourceSha256:hash(fileURLToPath(import.meta.url)),svgSha256:hashes,errors,allActualVideoFramesPersonallyViewed:false,earsVerified:false},null,1));console.log(JSON.stringify({out,frames:nf,measuredItems:checked,errors:errors.length,seconds:(Date.now()-started)/1000}));if(errors.length)process.exitCode=1;

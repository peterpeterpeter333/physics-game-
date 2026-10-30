// Pre-render E-1 typography audit, reusing the read-only quality gate's ink logic.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {overlayE1v1} from './desk-e1v1-overlay.mjs';
const ROOT=fileURLToPath(new URL('../../',import.meta.url));
const CACHE=process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-e1v1';
const src=fs.readFileSync(path.join(ROOT,'scripts/umech/desk-quality-gate.mjs'),'utf8');
const defs=src.slice(src.indexOf('const AFF='),src.indexOf('async function checkSvg()')).replace('export function svgItems','function svgItems');
const {refine,svgItems}=new Function('createRequire','ROOT','path',defs+'\nreturn {refine,svgItems};')(createRequire,ROOT,path);
const base=JSON.parse(fs.readFileSync(CACHE+'/plan.json'))[0],timed=JSON.parse(fs.readFileSync(CACHE+'/ys-chain-e1v1.json'));
const errors=[],cards=[],small=[];let frames=0;
for(const [si,s] of base.scenes.entries())for(const [qi,q] of s.cues.entries()){
 const cap=timed.scenes[si].captions[qi];
 for(const fraction of [.03,.2,.4,.6,.8,.97]){
  const t=cap.start+(cap.end-cap.start)*fraction;
  const anchor=name=>name==='thought'?[350,1000,1]:name==='real'?[700,800,1]:name==='scilly'?[750,760,1]:name==='tokyo'?[300,950,1]:name==='london'?[790,950,1]:[540,950,1];
  const svg=overlayE1v1({t,cue:q,cap,anchor});frames++;
  if(/NaN|undefined/.test(svg))throw Error('Invalid SVG '+t);
  for(const it of await refine(svgItems(svg))){
   if(it.op<.05)continue;
   const [x0,y0,x1,y1]=it.box,tol=it.kind==='rect'?16:6;
   if(x0<40-tol||x1>1040+tol||y0<110-tol||y1>1600+tol)errors.push({t,key:q.diagram,text:it.s??'rect',box:it.box});
   if(it.kind==='text'&&it.size<35.99&&!/^[\s、。，．・→←↑↓⇒\-–—…:：|｜\/／]+$/.test(it.s))small.push({t,text:it.s,size:it.size});
   if(it.card){const overflow=Math.max(it.card[0]-x0,x1-it.card[2]);if(overflow>2)cards.push({t,text:it.s,overflow});}
  }
 }
}
const result={frames,scope:'E1 overlay only; representative anchors, not final camera anchors',outside:errors,small,cards};
fs.writeFileSync(CACHE+'/overlay-preflight-e1v1.json',JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
if(errors.length||small.length||cards.length)process.exitCode=1;

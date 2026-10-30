// Buffer-level preflight only; no native or encoded media are changed.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {loadInputs,CACHE,FPS} from './desk-b2a-s4final-stage-cacheexact_gpt_20261030.mjs';
import {deskFrame} from './desk-b2a-s4final-overlay_gpt_20261030.mjs';
const inputs=loadInputs(),results=[];
const svgAt=j=>{const t=j/FPS,scene=inputs.clip.scenes.findLast(s=>s.start<=t)??inputs.clip.scenes[0];return deskFrame(inputs.clip,scene,t);};
const rgb=svg=>sharp(Buffer.from(svg)).flatten({background:'#2a2018'}).resize(1080,1920,{fit:'fill'}).removeAlpha().raw().toBuffer();
for(const [a,b] of [[450,451],[540,541],[600,601]]){
 const svgA=svgAt(a),svgB=svgAt(b),same=svgA===svgB;
 if(same){
  const [first,again]=await Promise.all([rgb(svgA),rgb(svgB)]);assert(first.equals(again));
  const modified=svgA.replace('</svg>','<rect x="0" y="0" width="2" height="2" fill="#ff00ff"/></svg>');
  assert.notEqual(modified,svgA);assert(!first.equals(await rgb(modified)));
 }
 results.push({a,b,entireSvgIdentical:same,exactRgbProof:same?'PASS':'not applicable; cache miss',changedVisibleSvgNegativeProof:same?'PASS':'not applicable'});
}
assert(results.some(x=>x.entireSvgIdentical),'No identical actual SVG pair found; caching remains safe but no gain is proven');
const report={source:CACHE,resolution:[1080,1920],fps:FPS,scope:'Actual complete SVG equality, full RGB identity, and changed-visible-SVG negative proof; no media modifications',results,pass:true};
const out=path.resolve('outputs/ys-chain-b2a-backup/S4修正02_20261030/S4合成_完全一致SVGキャッシュ_事前確認_20261030.json');
fs.writeFileSync(out,JSON.stringify(report,null,2),{flag:'wx'});console.log(JSON.stringify(report,null,2));

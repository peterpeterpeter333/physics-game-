// Correct the concrete first-pixel delay caused by the earlier clip's left margin.
// Frozen v1, glyphs, word times, .6s duration, completed SVG, score and face stay fixed.
import assert from 'node:assert/strict';import sharp from 'sharp';
import {vertFrame as previous,C1_FINAL_ACTION_REPAIRS as priorRepairs} from './desk-c1v1-complete-frame.mjs';
import {wt} from './yt1-chain-00bx-common.mjs';
export * from './desk-c1v1-complete-frame.mjs';
const FONT='font-family="Hiragino Sans, Hiragino Kaku Gothic ProN, sans-serif"';
const bounds=Object.fromEntries(await Promise.all([['c1write27','27',570],['c1write18','＋18',540]].map(async([id,text,x])=>{
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="180"><rect width="1080" height="180" fill="#ffffff"/><text x="${x}" y="100" ${FONT} font-size="76" text-anchor="middle" fill="#3b2412">${text}</text></svg>`;
 const{info}=await sharp(Buffer.from(svg)).trim({background:'#ffffff',threshold:40}).toBuffer({resolveWithObject:true});
 const left=-(info.trimOffsetLeft??0),right=left+info.width;assert(left>400&&right<690&&right>left);return[id,{left,right,measuredPixels:info.width}];
})));
export const C1_FINAL_ACTION_REPAIRS=Object.freeze({...priorRepairs,row7:{...priorRepairs.row7,clipAlignedToOriginalGlyphInk:true,inkBounds:bounds}});
export function vertFrame(c,s,t){
 let svg=previous(c,s,t);if(c.id!=='ys-chain-c1v1'||s.deskFrame!=='c1v1')return svg;
 const k=Math.max(0,s.captions.findLastIndex(cap=>cap.start<=t)),q=s.cues[k];if(q?.diagram!=='cc1v1-hand:ex')return svg;
 for(const[id,word]of[['c1write27','ニジュウナナ'],['c1write18','ジュウハチ']]){
  if(!svg.includes(`<clipPath id="${id}">`))continue;
  const cap=s.captions[k],at=cap.start+wt({cue:q,t:0,dur:cap.end-cap.start},word),u=Math.max(0,Math.min(1,(t-at)/.6)),b=bounds[id];
  const re=new RegExp(`(<clipPath id="${id}"><rect )x="[^"]+"( y="[^"]+" )width="[^"]+"`);assert(re.test(svg));
  svg=svg.replace(re,`$1x="${b.left}"$2width="${((b.right-b.left)*u).toFixed(3)}"`);
 }
 return svg;
}

// Final C-only mandatory-action derivatives. Frozen plan, captions and face stay fixed.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {vertFrame as priorVertFrame} from './desk-c1v1-final-frame.mjs';
import {wt} from './yt1-chain-00bx-common.mjs';
export * from './desk-c1v1-final-frame.mjs';
const cache=process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-c1v1';
const data=JSON.parse(fs.readFileSync(cache+'/blender/data.json'));
const price=data.cues.find(c=>c.key==='dad:price'),shown=data.cues.find(c=>c.key==='dad:shown'),ex=data.cues.find(c=>c.key==='hand:ex');
assert(price&&shown&&ex&&price.face.at==='アリマセンデシタ');
const sm=u=>{u=Math.max(0,Math.min(1,u));return u*u*(3-2*u);};
const n=v=>Math.round(v*10)/10;
export const C1_FINAL_ACTION_REPAIRS=Object.freeze({
 row38:{oldPoint:data.effects.price,point:price.voiceEnd+.15,voiceEnd:price.voiceEnd,faceUnchanged:true,hudFirstVisible:shown.start,hudEnd:shown.start+3.3,unchangedText:'人の手 1 − 2 機械'},
 row7:{duration:.6,firstAppearancesUnchanged:true,completedSvgByteIdentical:true},
});
function isolatedScore(svg){
 const needles=['>人の手 1 − 2 機械</text>','>人の手 0 − 2 機械</text>'];
 for(const needle of needles){const at=svg.indexOf(needle);if(at<0)continue;
  assert.equal(svg.indexOf(needle,at+needle.length),-1,'Only one score HUD');
  const b=svg.lastIndexOf('<g ',at),e=svg.indexOf('</g>',at)+4,g=svg.slice(b,e);
  assert(b>=0&&e>at&&(g.match(/<g\b/g)??[]).length===1,'Isolated score card only');return {b,e,g};
 }return null;
}
function reveal(svg,label,at,t,id,left,right,top,bottom){
 if(t<at||t>=at+.6)return svg;
 const re=new RegExp('<text\\b[^>]*>'+label+'</text>','g'),matches=[...svg.matchAll(re)];
 assert.equal(matches.length,1,'Exactly one original arithmetic numeral '+label);
 const text=matches[0][0],w=(right-left)*Math.max(0,Math.min(1,(t-at)/.6));
 // The original glyphs, font and completed value remain unchanged. Clipping
 // exists only during the explicit .6-second writing interval.
 const masked=`<clipPath id="${id}"><rect x="${left}" y="${top}" width="${n(w)}" height="${bottom-top}"/></clipPath><g clip-path="url(#${id})">${text}</g>`;
 return svg.replace(text,masked);
}
export function vertFrame(c,s,t){
 let svg=priorVertFrame(c,s,t);
 if(c.id!=='ys-chain-c1v1'||s.deskFrame!=='c1v1')return svg;
 const k=Math.max(0,s.captions.findLastIndex(cap=>cap.start<=t)),q=s.cues[k];
 if(q?.diagram==='cc1v1-hand:ex'){
  const cap=s.captions[k],time=needle=>cap.start+wt({cue:q,t:0,dur:cap.end-cap.start},needle);
  svg=reveal(svg,'27',time('ニジュウナナ'),t,'c1write27',490,650,710,830);
  svg=reveal(svg,'＋18',time('ジュウハチ'),t,'c1write18',405,675,830,940);
 }
 const r=C1_FINAL_ACTION_REPAIRS.row38;
 if(t>=r.oldPoint-.15&&t<r.oldPoint+3.3){const old=isolatedScore(svg);if(old)svg=svg.slice(0,old.b)+svg.slice(old.e);}
 if(t>=r.hudFirstVisible&&t<r.hudEnd){
  const oldScene=c.scenes.find(sc=>r.oldPoint+.3>=sc.start&&r.oldPoint+.3<sc.end);assert(oldScene);
  const template=isolatedScore(priorVertFrame(c,oldScene,r.oldPoint+.3));assert(template&&template.g.includes('>人の手 1 − 2 機械</text>'));
  const opacity=sm((t-r.hudFirstVisible)/.2)*(1-sm((t-r.hudEnd+.3)/.3));
  const hud=template.g.replace(/^<g opacity="[^"]+">/,`<g opacity="${n(opacity)}">`);
  svg=svg.replace('</svg>',hud+'</svg>');
 }
 return svg;
}

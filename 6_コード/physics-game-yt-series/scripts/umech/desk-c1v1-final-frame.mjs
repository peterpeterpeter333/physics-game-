// Local C-only readability repair found in actual r16 composites.
// Preserve the approved row34 face wrapper and every supplied word/timestamp.
import assert from 'node:assert/strict';
import {vertFrame as approvedVertFrame} from './desk-c1v1-approved-frame.mjs';
export * from './desk-c1v1-approved-frame.mjs';
export const C1_NAME_CARD_REPAIR=Object.freeze({diagram:'cc1v1-son:idea',text:'1642年ごろ ブレーズ・パスカル',translateY:90,oldCenterY:140,newCenterY:230});
export function vertFrame(c,s,t){
 const svg=approvedVertFrame(c,s,t);
 if(c.id!=='ys-chain-c1v1'||s.deskFrame!=='c1v1')return svg;
 const k=Math.max(0,s.captions.findLastIndex(cap=>cap.start<=t));
 if(s.cues[k]?.diagram!==C1_NAME_CARD_REPAIR.diagram)return svg;
 const needle='>'+C1_NAME_CARD_REPAIR.text+'</text>',at=svg.indexOf(needle);
 assert(at>=0&&svg.indexOf(needle,at+needle.length)===-1,'Exactly one unchanged Pascal card');
 const begin=svg.lastIndexOf('<g ',at),end=svg.indexOf('</g>',at)+4;
 assert(begin>=0&&end>at);
 const group=svg.slice(begin,end);
 assert.equal((group.match(/<g\b/g)??[]).length,1,'Only the isolated card group moves');
 assert(group.includes('y="106"')&&group.includes('y="153.7"'),'Original 38px card at y140');
 return svg.slice(0,begin)+'<g transform="translate(0 90)">'+group+'</g>'+svg.slice(end);
}

// Only remove the proven old0–1 HUD fade that survived the frozen v2 row38 repair.
// All supplied words, cue/voice/face/score times and all other SVG bytes stay fixed.
import assert from 'node:assert/strict';
import {vertFrame as previous,C1_FINAL_ACTION_REPAIRS} from './desk-c1v1-complete-frame-v2.mjs';
export * from './desk-c1v1-complete-frame-v2.mjs';
export const C1_V3_HUD_FADE_FIX=Object.freeze({oldPoint:C1_FINAL_ACTION_REPAIRS.row38.oldPoint,removedUnchangedText:'人の手 0 − 1 機械',scope:'Only the obsolete row38 pre-point fade; no replacement score is invented'});
export function vertFrame(c,s,t){
 const svg=previous(c,s,t),p=C1_V3_HUD_FADE_FIX.oldPoint;
 if(c.id!=='ys-chain-c1v1'||s.deskFrame!=='c1v1'||t<p-.15||t>=p+3.3)return svg;
 const needle='>'+C1_V3_HUD_FADE_FIX.removedUnchangedText+'</text>',at=svg.indexOf(needle);
 if(at<0)return svg;
 assert.equal(svg.indexOf(needle,at+needle.length),-1,'Only one obsolete score HUD');
 const begin=svg.lastIndexOf('<g ',at),end=svg.indexOf('</g>',at)+4,group=svg.slice(begin,end);
 assert(begin>=0&&end>at&&(group.match(/<g\b/g)??[]).length===1,'Only the isolated old score card may be removed');
 return svg.slice(0,begin)+svg.slice(end);
}

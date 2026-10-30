// Narrow B-only visual review patch. Original overlay/text/times stay on disk.
import assert from 'node:assert/strict';
import {overlayB1v1 as originalOverlay} from './desk-b1v1-overlay.mjs';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),sm=x=>{x=clamp(x,0,1);return x*x*(3-2*x);},n=x=>Math.round(x*10)/10;
export const B1_REVIEW_PATCH=Object.freeze({hudOriginal:'言い伝え 0 − 0 実験',hudHoldUntil:18.74,hudOriginalFadeStart:15.62,challengeAnchorOffset:[180,230],challengeAnchorXClamp:[95,880],poleOriginalTimes:{N:166.91,S:170.13},scope:['open:who','lines:iron','lines:follow','lines:dip','ch:q','ch:next']});
export function topGroups(fragment){
 const groups=[];let depth=0,start=-1;
 for(const m of fragment.matchAll(/<g(?=[\s>])[^>]*>|<\/g>/g)){
  if(m[0].startsWith('</')){assert(depth>0);if(--depth===0)groups.push(fragment.slice(start,m.index+m[0].length));}
  else{if(depth++===0)start=m.index;}
 }
 assert.equal(depth,0);return groups;
}
const hud=g=>g.includes('言い伝え')&&g.includes('実験');
const label=(fragment,s)=>{const found=topGroups(fragment).filter(g=>new RegExp('>'+s+'</text>').test(g));assert.equal(found.length,1,'Exact original '+s+' label');return found[0];};
function polePlacement(ctx){
 const N=ctx.anchor('poleN'),S=ctx.anchor('poleS');if(!N?.[2]||!S?.[2])return null;
 const x=clamp((N[0]+S[0])/2-440,95,985);
 return {N:{source:N,center:[x,clamp(N[1],620,1100)]},S:{source:S,center:[x,clamp(S[1],620,1100)]}};
}
export function overlayB1v1Review(ctx){
 const key=ctx.cue.diagram.replace('cb1v1-',''),poleScope=['lines:iron','lines:follow','lines:dip'].includes(key),challenge=['ch:q','ch:next'].includes(key),poles=poleScope?polePlacement(ctx):null;
 const shifted={...ctx,anchor:name=>{
  const p=ctx.anchor(name);if(!p?.[2])return p;
  if(challenge&&name==='challengeNeedle'){
   const center=ctx.anchor('terrella'),direction=!center?.[2]||p[0]>=center[0]?1:-1;
   return [clamp(p[0]+direction*180,95,880),p[1]+230,p[2]];
  }
  if(poles&&(name==='poleN'||name==='poleS')){const k=name==='poleN'?'N':'S',v=poles[k];return [v.center[0],v.center[1]+(k==='N'?-35:75),p[2]];}
  return p;
 }};
 let result=originalOverlay(shifted);
 if(key==='open:who'&&ctx.t>=B1_REVIEW_PATCH.hudOriginalFadeStart&&ctx.t<B1_REVIEW_PATCH.hudHoldUntil){
  // Reuse the original card itself at its full-opacity plateau. Only its
  // disappearance is extended; its first appearance and all text are untouched.
  for(const group of topGroups(result).filter(hud))result=result.replace(group,'');
  const prototype=topGroups(originalOverlay({...ctx,t:14})).filter(hud);assert.equal(prototype.length,1);result+=prototype[0];
 }
 if(poles){
  if(key!=='lines:iron'){
   const prototype=originalOverlay({...shifted,cue:{...ctx.cue,diagram:'cb1v1-lines:iron'}});
   result+=label(prototype,'N')+label(prototype,'S');
  }
  let leaders='';
  for(const [k,a,color]of[['N',166.91,'#b32d25'],['S',170.13,'#245fbe']]){
   if(ctx.t<a)continue;const p=poles[k],op=n(sm((ctx.t-a)/.22));
   leaders+=`<path d="M${n(p.center[0]+44)} ${n(p.center[1])} L${n(p.source[0])} ${n(p.source[1])}" fill="none" stroke="${color}" stroke-width="3" opacity="${op}"/>`;
  }
  result=leaders+result;
 }
 return result;
}

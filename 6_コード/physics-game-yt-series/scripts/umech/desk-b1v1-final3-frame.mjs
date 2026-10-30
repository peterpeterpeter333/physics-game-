// Retain the approved B2 frame. Tiny pole-position dots are explicit 2D
// annotations, not a claim that a back-facing physical 3D cap is visible.
import assert from 'node:assert/strict';
import {vertFrame as previous} from './desk-b1v1-review-frame.mjs';
import {anchor} from './desk-frame.mjs';
export * from './desk-b1v1-review-frame.mjs';
export function vertFrame(c,s,t){
 const svg=previous(c,s,t);
 if(!svg||c.id!=='ys-chain-b1v1'||s.deskFrame!=='b1v1')return svg;
 const k=Math.max(0,s.captions.findLastIndex(x=>x.start<=t));
 const key=s.cues[k].diagram.replace('cb1v1-','');
 if(!['lines:iron','lines:follow','lines:dip'].includes(key))return svg;
 let dots='';
 for(const[name,start,color]of[['poleN',166.91,'#d6453d'],['poleS',170.13,'#3a6fd8']]){
  if(t<start)continue;const p=anchor(name,t);if(!p?.[2])continue;
  assert(p[0]>=10&&p[0]<=1070&&p[1]>=10&&p[1]<=1910,'Pole marker outside screen');
  const u=Math.max(0,Math.min(1,(t-start)/.22)),op=u*u*(3-2*u);
  dots+=`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="8" fill="${color}" stroke="#372f2a" stroke-width="1.4" opacity="${op.toFixed(3)}"/>`;
 }
 if(!dots)return svg;
 const image=/<image x="0" y="0" width="1080" height="1920" preserveAspectRatio="none" href="data:image\/jpeg;base64,[^"]*"\/>/g;
 const m=[...svg.matchAll(image)];assert.equal(m.length,1);
 return svg.replace(m[0][0],m[0][0]+dots);
}

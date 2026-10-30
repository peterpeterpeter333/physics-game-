// Private B-only replacement of the exact generated overlay fragment.
import assert from 'node:assert/strict';
import {vertFrame as originalFrame} from './desk-axes-frame.mjs';
import {anchor} from './desk-frame.mjs';
import {overlayB1v1 as originalOverlay} from './desk-b1v1-overlay.mjs';
import {overlayB1v1Review,B1_REVIEW_PATCH} from './desk-b1v1-review-overlay.mjs';
export * from './desk-axes-frame.mjs';
export {B1_REVIEW_PATCH};
export function vertFrame(c,s,t){
 const svg=originalFrame(c,s,t);if(!svg||c.id!=='ys-chain-b1v1'||s.deskFrame!=='b1v1')return svg;
 const k=Math.max(0,s.captions.findLastIndex(cap=>cap.start<=t)),q=s.cues[k],key=q.diagram.replace('cb1v1-','');
 if(!B1_REVIEW_PATCH.scope.includes(key))return svg;
 const ctx={t,clip:c,scene:s,cue:q,cap:s.captions[k],k,anchor:name=>anchor(name,t)},before=originalOverlay(ctx),after=overlayB1v1Review(ctx);
 if(before===after)return svg;
 if(!before){
  assert(!q.face,'Do not place a new overlay over a face');
  const image=/<image x="0" y="0" width="1080" height="1920" preserveAspectRatio="none" href="data:image\/jpeg;base64,[^"]*"\/>/g,matches=[...svg.matchAll(image)];
  assert.equal(matches.length,1,'Exact original raw background must occur once');
  return svg.replace(matches[0][0],matches[0][0]+after);
 }
 assert.equal(svg.split(before).length,2,'Exact original B overlay must occur once');
 return svg.replace(before,after);
}

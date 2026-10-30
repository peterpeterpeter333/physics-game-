// C-only layout repair for the confirmed paper/caption sweep in the final v3 MP4.
// The existing first caption chunk and speaker layer move together; their SVG,
// words, fonts, opacity, chunk boundaries, supplied voice and all other frames stay fixed.
import assert from 'node:assert/strict';
import {vertFrame as previous} from './desk-c1v1-complete-frame-v3.mjs';
import {chunkTimes} from './desk-frame.mjs';
export * from './desk-c1v1-complete-frame-v3.mjs';
export const C1_V4_LAYOUT_REPAIR=Object.freeze({diagram:'cc1v1-carry:order',chunk:0,translateX:-240,translateY:0,unchangedCaption:'筆算では、',scope:'Only the existing first carry:order caption chunk and its speaker badge; unchanged canonical chunk boundary'});
export function c1FirstCarryOrderCaptionSlice(svg){
 const matches=[...svg.matchAll(/<text\b[^>]*>筆算では、<\/text>/g)];
 assert.equal(matches.length,2,'The original shadow and foreground caption each occur once');
 assert(svg.endsWith('</svg>'));
 const begin=matches[0].index,end=svg.length-6,layer=svg.slice(begin,end);
 assert.equal((layer.match(/<text\b/g)??[]).length,3,'Only two original caption glyph layers and one speaker name');
 assert.equal((layer.match(/<rect\b/g)??[]).length,1,'Only the original speaker badge');
 assert.equal((layer.match(/<circle\b/g)??[]).length,1,'Only the original speaker dot');
 assert(layer.includes('<rect x="470" y="1182" width="140" height="52"')&&layer.endsWith('>カイ</text>'));
 assert(!/<image\b|<path\b|<g\b/.test(layer),'No paper arithmetic, face, score or other overlay enters the translation');
 return {begin,end,layer};
}
export function vertFrame(c,s,t){
 const svg=previous(c,s,t);
 if(c.id!=='ys-chain-c1v1'||s.deskFrame!=='c1v1')return svg;
 const k=Math.max(0,s.captions.findLastIndex(cap=>cap.start<=t)),q=s.cues[k],cap=s.captions[k];
 if(q?.diagram!==C1_V4_LAYOUT_REPAIR.diagram)return svg;
 assert.deepEqual(q.cap[0],[C1_V4_LAYOUT_REPAIR.unchangedCaption]);
 const {starts,exact}=chunkTimes(q,cap);assert(exact&&starts.length>1);
 if(t<starts[0]||t>=starts[1])return svg;
 const {begin,end,layer}=c1FirstCarryOrderCaptionSlice(svg);
 return svg.slice(0,begin)+'<g transform="translate(-240 0)">'+layer+'</g>'+svg.slice(end);
}

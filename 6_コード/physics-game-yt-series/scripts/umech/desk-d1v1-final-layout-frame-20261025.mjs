// D-only paper-label layout derivative. Original Japanese, opacity, timing,
// faces, captions, camera/source images and shared compositor stay unchanged.
import assert from 'node:assert/strict';
import {vertFrame as previous} from './desk-axes-frame.mjs';
export * from './desk-axes-frame.mjs';
export const D1_FINAL_LAYOUT_REPAIRS=Object.freeze([
 {key:'piston-card',diagrams:['cd1v1-nc:piston'],markers:['ピストン','（上下に 動く ふた）'],from:[40,680],to:[580,270],translate:[540,-410],font:40,leaderFrom:[140,710],leaderTo:[680,300]},
 {key:'fact-card',diagrams:['cd1v1-myth:fact','cd1v1-myth:judge'],markers:['事実：毎回 冷たい','水で 冷やす'],from:[560,430],to:[560,176],translate:[0,-254],font:40},
 {key:'air-weight-card',diagrams:['cd1v1-air:weight'],markers:['積もった 空気の 重さ'],from:[40,350],to:[40,152],translate:[0,-198],font:42},
 {key:'air-thin-card',diagrams:['cd1v1-air:weight'],markers:['上ほど うすい'],from:[40,450],to:[600,152],translate:[560,-298],font:42}
]);
const cardPattern=/<g opacity="[^"]+"><rect\b[^>]*\/><rect\b[^>]*\/>(?:<text\b[^>]*>[^<]*<\/text>)+<\/g>/g;
export function d1LayoutOperations(svg,c,s,t){
 if(c.id!=='ys-chain-d1v1'||s.deskFrame!=='d1v1')return [];
 const k=Math.max(0,s.captions.findLastIndex(cap=>cap.start<=t)),q=s.cues[k],ops=[];
 for(const repair of D1_FINAL_LAYOUT_REPAIRS){
  if(!repair.diagrams.includes(q.diagram))continue;
  const matches=[...svg.matchAll(cardPattern)].filter(m=>repair.markers.every(text=>m[0].includes('>'+text+'</text>')));
  assert(matches.length<=1,'One exact original explanatory card '+repair.key);
  if(!matches.length)continue; // The unchanged original word-time/opacity has not revealed it.
  const before=matches[0][0],after=`<g data-d1-layout="${repair.key}" transform="translate(${repair.translate.join(' ')})">${before}</g>`;
  assert(!before.includes('<image')&&!before.includes('<circle')&&!before.includes('<path'),'No caption, image, face or leader enters a paper translation');
  ops.push({key:repair.key,before,after,repair});
  if(repair.leaderFrom){
   const leaders=[...svg.matchAll(/<path d="M140 710 L[^"]+" stroke="#b8925a" stroke-width="4" fill="none"\/>/g)];
   assert.equal(leaders.length,1,'Only the original piston leader start moves');
   ops.push({key:'piston-leader-start',before:leaders[0][0],after:leaders[0][0].replace('M140 710 L','M680 300 L'),repair});
  }
 }
 return ops;
}
export function applyD1FinalLayout(svg,c,s,t){
 for(const op of d1LayoutOperations(svg,c,s,t)){assert.equal(svg.split(op.before).length,2);svg=svg.replace(op.before,op.after);}
 return svg;
}
export function vertFrame(c,s,t){return applyD1FinalLayout(previous(c,s,t),c,s,t);}

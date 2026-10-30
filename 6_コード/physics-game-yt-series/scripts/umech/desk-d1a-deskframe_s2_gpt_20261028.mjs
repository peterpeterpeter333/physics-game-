// A S2 wrapper copied from the prepared A wrapper; title/captions stay unchanged.
import assert from 'node:assert/strict';
import * as real from './desk-frame.mjs?d1a-s2-real';
import {FONT,measureLabels,wrapText} from './desk-d1ab-typeset_gpt_20261026.mjs';
import {esc} from './anim.mjs';
export * from './desk-frame.mjs?d1a-s2-real';
const sm=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
const n=x=>Number(x.toFixed(1));
await measureLabels(['D 熱と動力 1','炭鉱の水を、蒸気はどうやってくみ出した？（前編）空気の力']);
function opening(c,t){
 const op=n(1-sm((t-1.5)/.5));if(op<=0)return '';
 const rows=wrapText(c.title,36,920),lines=['D 熱と動力 1',...rows],h=lines.length*49+24;
 return `<g opacity="${op}"><rect x="40" y="110" width="1000" height="${h}" rx="12" fill="#141a2b" fill-opacity=".8"/>${lines.map((l,i)=>`<text x="64" y="${154+i*49}" ${FONT} font-size="36" font-weight="800" fill="#fff">${esc(l)}</text>`).join('')}</g>`;
}
export function deskFrame(c,s,t){
 if(s.deskFrame!=='d1a')return real.deskFrame(c,s,t);
 assert.equal(c.id,'ys-chain-d1a');
 const svg=real.deskFrame(c,{...s,deskFrame:'d1v1'},t);
 if(t>=2.5)return svg;
 const content=real.pill(c.series??'',48,150,{size:36,color:'#e9edf7'})+real.pill(c.title,48,222,{size:44,color:'#ffffff'});
 const old=`<g opacity="${n(1-sm((t-2)/.5))}">${content}</g>`;
 assert.equal(svg.split(old).length,2,'opening title must occur once');
 return svg.replace(old,opening(c,t));
}

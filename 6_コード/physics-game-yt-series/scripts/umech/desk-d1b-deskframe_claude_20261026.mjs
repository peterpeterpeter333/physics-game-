// D-1 後編の包み（Claude 2026-10-26）。本物の desk-frame.mjs をそのまま使い、deskFrame 'd1b' だけ、札の関数の名前 'd1v1' を借りて振り分ける。
// 最初の題は、ほかの4本（desk-axes-frame.mjs）と同じく 1.5〜2.0 秒で消す。
import assert from 'node:assert/strict';
import * as real from './desk-frame.mjs?d1b-real';
export * from './desk-frame.mjs?d1b-real';
const sm=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
const n=x=>Number(x.toFixed(1));
export function deskFrame(c,s,t){
 if(s.deskFrame!=='d1b')return real.deskFrame(c,s,t);
 assert.equal(c.id,'ys-chain-d1b');
 const svg=real.deskFrame(c,{...s,deskFrame:'d1v1'},t);
 if(t<1.5||t>=2.5)return svg;
 const content=real.pill(c.series??'',48,150,{size:36,color:'#e9edf7'})+real.pill(c.title,48,222,{size:44,color:'#ffffff'});
 const old=`<g opacity="${n(1-sm((t-2)/.5))}">${content}</g>`;
 assert.equal(svg.split(old).length,2,'opening title must occur once');
 const op=n(1-sm((t-1.5)/.5));
 return svg.replace(old,op>0?`<g opacity="${op}">${content}</g>`:'');
}

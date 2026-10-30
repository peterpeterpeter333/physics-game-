// Private four-episode extension. Original shared compositor remains unchanged.
// Common instruction §6.3 says opening titles last 0–2 seconds: fade 1.5–2.0.
import assert from 'node:assert/strict';
import {vertFrame as originalVertFrame} from './frame-vert.mjs';
import {pill} from './desk-frame.mjs';
export * from './frame-vert.mjs';
const ids=new Set(['b1v1','c1v1','d1v1','e1v1']);
const sm=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
const n=x=>Number(x.toFixed(1));
export function vertFrame(c,s,t){
 const svg=originalVertFrame(c,s,t);
 if(!svg||!ids.has(s.deskFrame)||t<1.5||t>=2.5)return svg;
 const content=pill(c.series??'',48,150,{size:36,color:'#e9edf7'})+pill(c.title,48,222,{size:44,color:'#ffffff'});
 const old=`<g opacity="${n(1-sm((t-2)/.5))}">${content}</g>`;
 assert.equal(svg.split(old).length,2,'Exact original opening title must occur once');
 const opacity=n(1-sm((t-1.5)/.5));
 return svg.replace(old,opacity>0?`<g opacity="${opacity}">${content}</g>`:'');
}

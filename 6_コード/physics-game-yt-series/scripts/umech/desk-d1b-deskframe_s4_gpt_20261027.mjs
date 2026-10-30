// Isolated S4 helper (2026-10-27); original S3 files remain unchanged.
// S4 wrapper; inherit the unchanged original frame and opening-title timing.
// D-1 後編の包み（Claude 2026-10-26）。本物の desk-frame.mjs をそのまま使い、deskFrame 'd1b' だけ、札の関数の名前 'd1v1' を借りて振り分ける。
// 最初の題は、ほかの4本（desk-axes-frame.mjs）と同じく 1.5〜2.0 秒で消す。
import assert from 'node:assert/strict';
import * as real from './desk-frame.mjs?d1b-s4-real';
import {FONT,measureLabels,wrapText} from './desk-d1ab-typeset_gpt_20261026.mjs';
import {esc} from './anim.mjs';
export * from './desk-frame.mjs?d1b-s4-real';
const sm=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
const n=x=>Number(x.toFixed(1));
await measureLabels(['D 熱と動力 2','炭鉱の水を、蒸気はどうやってくみ出した？（後編）機械の中を開ける']);
function opening(c,t){
 const op=n(1-sm((t-1.5)/.5));if(op<=0)return '';
 const rows=wrapText(c.title,36,920),lines=['D 熱と動力 2',...rows],h=lines.length*49+24;
 return `<g opacity="${op}"><rect x="40" y="110" width="1000" height="${h}" rx="12" fill="#141a2b" fill-opacity=".8"/>${lines.map((l,i)=>`<text x="64" y="${154+i*49}" ${FONT} font-size="36" font-weight="800" fill="#fff">${esc(l)}</text>`).join('')}</g>`;
}
export function deskFrame(c,s,t){
 if(s.deskFrame!=='d1b')return real.deskFrame(c,s,t);
 assert.equal(c.id,'ys-chain-d1b');
 let svg=real.deskFrame(c,{...s,deskFrame:'d1v1'},t);
 const ci=Math.max(0,s.captions.findLastIndex(cap=>cap.start<=t));
 if(s.cues[ci]?.diagram==='cd1b-pump:same'){
  // Same caption bytes/timing/line breaks. Move this one caption block above
  // the newly required y1300-1580 picture cards instead of covering them.
  const starts=['<text x="540" y="1254"','<text x="540" y="1296"'].map(marker=>svg.lastIndexOf(marker)),at=Math.max(...starts);
  assert.ok(at>=0&&svg.endsWith('</svg>'),'Cannot locate unchanged row28 caption block');
  svg=svg.slice(0,at)+'<g transform="translate(0 -120)">'+svg.slice(at,-6)+'</g></svg>';
 }
 if(t>=2.5)return svg;
 const content=real.pill(c.series??'',48,150,{size:36,color:'#e9edf7'})+real.pill(c.title,48,222,{size:44,color:'#ffffff'});
 const old=`<g opacity="${n(1-sm((t-2)/.5))}">${content}</g>`;
 assert.equal(svg.split(old).length,2,'opening title must occur once');
 return svg.replace(old,opening(c,t));
}




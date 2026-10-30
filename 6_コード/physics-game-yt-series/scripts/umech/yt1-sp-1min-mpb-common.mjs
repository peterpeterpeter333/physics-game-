// 特別編「1分の疑問」10 mirror・11 plane・12 bicycle で使う小さな描画の部品（札・✕・✓・カード）。
// 形（Q カード・カウンター・疑問カード・橋・最後の問い）は yt1-sp-1min-common.mjs を使う。
// ファイル名が -diagrams で終わらないので自動読み込みされない。
import {C,fade,label,rect} from './anim.mjs';
import {vseg} from './yt1-sp-1min-common.mjs';

export const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
export function tag(s,x,y,{color=C.hi,g=1,size=24}={}){
 const w=[...s].length*size+30;
 return fade(g,rect(x-w/2,y-size*.85-8,w,size+18,{fill:color,fo:.14,stroke:color,sw:2,rx:16})+label(s,x,y+2,{size,color,anchor:'middle',weight:700}));
}
export const cross=(x,y,r=22,g=1,color=C.a)=>fade(g,`<line x1="${x-r}" y1="${y-r}" x2="${x+r}" y2="${y+r}" stroke="${color}" stroke-width="7" stroke-linecap="round"/><line x1="${x-r}" y1="${y+r}" x2="${x+r}" y2="${y-r}" stroke="${color}" stroke-width="7" stroke-linecap="round"/>`);
export const okMark=(x,y,g=1,color=C.F)=>fade(g,`<polyline points="${x-20},${y} ${x-5},${y+16} ${x+22},${y-18}" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`);
// 声の割合で進む窓：V(a,b) = vseg(ctx,p,a,b)、VL は直線（0〜1）
export const vfn=(p,ctx)=>{const V=(a,b)=>vseg(ctx,p,a,b);const VL=(a,b)=>{const ve=Math.max(.5,(ctx&&ctx.dur?ctx.dur:8)-.12-((ctx&&ctx.cue&&ctx.cue.pause)||0)),t=ctx&&typeof ctx.t==='number'?ctx.t:p*8;return Math.max(0,Math.min(1,(t/ve-a)/(b-a)));};return [V,VL];};

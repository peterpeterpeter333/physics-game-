// 「1分の疑問」06〜09（sqrt2・moon・night・microwave）で使う小さな部品（カード・札・印）。図のキーは持たない。
// 形（カウンター・Q カード・疑問カード・黄色の枠の問い）は 01 の yt1-sp-1min-common.mjs を import して使う。
import {C,fade,label,rect} from './anim.mjs';

export const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
export function tag(s,x,y,{color=C.hi,g=1,size=24}={}){
 const w=[...s].length*size+30;
 return fade(g,rect(x-w/2,y-size*.85-8,w,size+18,{fill:color,fo:.14,stroke:color,sw:2,rx:16})+label(s,x,y+2,{size,color,anchor:'middle',weight:700}));
}
export const cross=(x,y,r=22,g=1,color=C.a)=>fade(g,`<line x1="${x-r}" y1="${y-r}" x2="${x+r}" y2="${y+r}" stroke="${color}" stroke-width="6" stroke-linecap="round"/><line x1="${x-r}" y1="${y+r}" x2="${x+r}" y2="${y-r}" stroke="${color}" stroke-width="6" stroke-linecap="round"/>`);
export const okMark=(x,y,g=1,color=C.F)=>fade(g,`<polyline points="${x-18},${y} ${x-4},${y+14} ${x+20},${y-16}" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`);
// note tag such as「伝説」「もし」
export const note=(s,x,y,g=1,color=C.dim)=>fade(g,rect(x-8,y-26,[...s].length*24+16,36,{fill:'#0e1830',fo:.9,stroke:color,sw:1.5,rx:8})+label(s,x,y,{size:24,color}));

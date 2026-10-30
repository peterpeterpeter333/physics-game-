// 技術の疑問の鎖の得点板「作る側 ○ − ○ 破る側」。シリーズで使い回す部品（図のキーは持たない。-diagrams で終わらないので自動読み込みされない）。
// 舞台（1000×920）の右上 y 4–56 に置く。年と人物の札（左上）とは重ならない（x 620 より右）。
// 使い方：
//   import {scoreBoard,SCORE_H} from './chain-score.mjs';
//   scoreBoard({make:0,brk:1,bump:u,side:'brk',g})   // u＝点が入る動き（0→1、約0.7秒）。side の数字が ふくらんで戻り、「＋1」が浮かんで消える
//   見方の札など、右上の他の札は y ≥ SCORE_H に置く。
// 色：作る側＝水色、破る側＝橙（序章2-1 の「見方：破る側から」と同じ橙）。
import {C,label,rect,fade,clamp} from './anim.mjs';

export const SCORE_COL={make:'#6adfff',brk:'#ff8f6b'};
export const SCORE_H=62;
const n2=v=>Number(v.toFixed(2));
// 点が入るときの ふくらみ：0→1 で 1 → 1.55 → 1
const pop=u=>u<=0||u>=1?1:1+.55*Math.sin(Math.PI*clamp(u));
export function scoreBoard({make=0,brk=0,bump=0,side='brk',g=1,right=996,y=4}={}){
 if(g<=0)return '';
 const h=52,ns=44,ls=36;
 // 幅：作る側（3字）＋ 数 ＋ − ＋ 数 ＋ 破る側（3字）
 const wL=3*ls,wN=40,wD=40,pad=20,w=pad+wL+16+wN+wD+wN+16+wL+pad,x0=right-w,cy=y+h/2;
 let s=rect(x0,y,w,h,{fill:'#0f1a30',fo:.96,stroke:C.faint,sw:2,rx:26});
 let x=x0+pad;
 s+=label('作る側',x,cy+13,{size:ls,color:SCORE_COL.make,weight:700});x+=wL+16;
 const num=(v,k,xc)=>{const sc=side===k?pop(bump):1,col=side===k&&bump>0&&bump<1?C.hi:SCORE_COL[k];
  return `<g transform="translate(${n2(xc)} ${n2(cy)}) scale(${n2(sc)})">`+label(String(v),0,ns*.36,{size:ns,color:col,anchor:'middle',weight:700})+'</g>';};
 s+=num(make,'make',x+wN/2);x+=wN;
 s+=label('−',x+wD/2,cy+14,{size:40,color:C.dim,anchor:'middle',weight:700});x+=wD;
 s+=num(brk,'brk',x+wN/2);const xb=x+wN/2;x+=wN+16;
 s+=label('破る側',x,cy+13,{size:ls,color:SCORE_COL.brk,weight:700});
 // ＋1 が浮かんで消える
 if(bump>0&&bump<1){const xs=side==='make'?x0+pad+wL+16+wN/2:xb;s+=fade(Math.sin(Math.PI*bump),label('＋1',xs,y+h+40-24*bump,{size:36,color:SCORE_COL[side],anchor:'middle',weight:700}));}
 return fade(g,s);
}

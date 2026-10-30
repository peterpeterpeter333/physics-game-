// 大学編「ローレンツ力・初級・要点」(ys-ui-magnetic-force-summary) — 図。Stage 1200×515.
// 詳しい動画 ui-magnetic-force-1 の図をそのまま呼び出す（同じ数値・同じ色）。結論の表と締めのカードだけ ここで描く。
// 色（詳しい動画と同じ）：𝐯 紫、𝐁 橙、𝐅 緑、電荷 q 桃。
import {C,seg,fade,label,rect,tex} from './anim.mjs';
import {ytUiMagneticForce1Diagrams as M} from './yt1-ui-magnetic-force-1-diagrams.mjs';

const K='ui-magnetic-force-summary:';
const u=k=>{const f=M['ui-magnetic-force-1:'+k];if(!f)throw new Error('missing ui-magnetic-force-1:'+k);return f;};
const CV=C.v,CB=C.E,CF=C.F,CQ=C.p,CI=C.hi;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});
const vV=cs(CV,'\\mathbf{v}'),vB=cs(CB,'\\mathbf{B}'),vF=cs(CF,'\\mathbf{F}'),qq=cs(CQ,'q');
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);

const ROWS=[
 ['磁場 𝐁',y=>label('向き：方位磁針の N 極',300,y+70,{size:28,color:C.ink})+T(`B=\\dfrac{F}{${qq}\\,v}\\ \\ [\\mathrm{T}]`,880,y+64,{size:36,color:CB})],
 ['力の向き',y=>T(`${vF}=${qq}\\,${vV}\\times${vB}`,420,y+56,{size:46})+label('𝐯 → 𝐁 の右ねじ，負なら逆',700,y+68,{size:28,color:C.ink})],
 ['仕事',y=>T(`P=${vF}\\cdot${vV}=0`,420,y+56,{size:44})+label('速さ一定，向きだけ曲がる',700,y+68,{size:28,color:CI,weight:700})],
];
function results(p,n,{title='結論',fresh=true}={}){
 let s=label(title,600,55,{size:28,color:C.dim,anchor:'middle'});
 ROWS.forEach(([h,f],i)=>{
  if(i>=n)return;
  const y=80+i*135,last=fresh&&i===n-1,g=last?seg(p,.03,.2):1;
  s+=card(60,y,1080,115,label(['①','②','③'][i],105,y+70,{size:36,color:CI,anchor:'middle',weight:700})+label(h,150,y+68,{size:28,color:C.dim})+f(y),g,last?CI:C.faint);
 });
 return s;
}

export const ytUiMagneticForceSummaryDiagrams={
 [K+'intro']:(p)=>results(p,0)+fade(seg(p,.1,.3),label('磁場の中を動く電荷：どんな力？　どう動く？',600,280,{size:36,color:C.ink,anchor:'middle',weight:700})),
 [K+'c1']:(p)=>results(p,1),
 [K+'c2']:(p)=>results(p,2),
 [K+'c3']:(p)=>results(p,3),
 [K+'r1']:u('turn2'),
 [K+'r2']:u('work0'),
 [K+'r3']:u('power'),
 [K+'r4']:u('const'),
 [K+'r5']:u('electron'),
 [K+'ex1']:u('example'),
 [K+'ex2']:u('unit'),
 [K+'ex3']:u('unit2'),
 [K+'ex4']:u('size30'),
 [K+'ex5']:u('screw2'),
 [K+'m1']:u('notforce'),
 // 3本を 𝐯 を軸に回す（tilt の後半 0°→45°）→ tilt2（45°→90°、𝐁 奥・𝐅 上）。
 [K+'m2']:(p,ctx)=>p<.35?u('tilt')(.35+.65*p/.35,ctx):u('tilt2')((p-.35)/.65,ctx),
 [K+'m3']:u('notzero'),
 [K+'sum']:(p)=>results(p,3,{title:'まとめ',fresh:false}),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:CI,anchor:'middle',weight:700}),seg(p,.05,.25),CI),
};

// 大学編「電流・初級・要点」(ys-ui-conduction-summary) — 図。Stage 1200×515.
// 詳しい動画 ui-conduction-1 の図をそのまま呼び出す（同じ数値・同じ色・同じ向き）。結論の表と締めのカードだけ ここで描く。
// 色（詳しい動画と同じ）：電荷 Q 桃、時間 t 金、電流 I 緑、電圧 V 紫、電子 青、正電荷 赤、電場 𝐄 水色、電子の速度 𝐯 紫。
import {C,seg,fade,label,rect,tex} from './anim.mjs';
import {ytUiConduction1Diagrams as B1} from './yt1-ui-conduction-1-diagrams.mjs';

const K='ui-conduction-summary:';
const u1=k=>{const f=B1['ui-conduction-1:'+k];if(!f)throw new Error('missing ui-conduction-1:'+k);return f;};
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const QC=C.p,TC=C.t,IC=C.F,VC=C.v,POS=C.a,NEG='#7fb3ff';
const T=(s,x,o={})=>tex(s,x,14,{auto:false,size:40,...o});
const L=(s,x,o={})=>label(s,x,12,{size:30,color:C.ink,anchor:'start',weight:700,...o});

const ROWS=[
 [()=>T(`${cs(IC,'\\bar I')}=\\dfrac{${cs(QC,'\\Delta Q')}}{${cs(TC,'\\Delta t')}}`,270,{size:38})+L('1秒あたりに 断面を通る電荷',400,{color:C.ink}),'定義（A＝C/s）'],
 [()=>L('電流の向き ＝ 正の電荷が動く向き',170,{color:IC})+L('（電子とは逆）',690,{color:NEG,size:28}),'約束'],
 [()=>T(`${cs(VC,'V')}=R${cs(IC,'I')}`,250)+L('抵抗の両端の電圧と電流が 比例',400),'実験の法則'],
];
function results(p,n,{title='結論',fresh=true}={}){
 let s=label(title,600,55,{size:28,color:C.dim,anchor:'middle'});
 ROWS.forEach(([f,note],i)=>{
  if(i>=n)return;
  const y=80+i*135,g=fresh&&i===n-1?seg(p,.03,.2):1;
  s+=card(60,y,1080,115,label(['①','②','③'][i],110,y+70,{size:36,color:C.hi,anchor:'middle',weight:700})
   +`<g transform="translate(0 ${y+58})">${f()}</g>`+label(note,1040,y+70,{size:24,color:C.dim,anchor:'middle'}),g,fresh&&i===n-1?C.hi:C.faint);
 });
 return s;
}

export const ytUiConductionSummaryDiagrams={
 [K+'intro']:(p)=>results(p,0)+fade(seg(p,.1,.3),label('導線を流れる電荷の「流れの量」',600,250,{size:34,color:C.ink,anchor:'middle',weight:700})
  +label('どう測り、どちら向きに数える？',600,320,{size:34,color:C.hi,anchor:'middle',weight:700})),
 [K+'c1']:(p)=>results(p,1),
 [K+'c2']:(p)=>results(p,2),
 [K+'c3']:(p)=>results(p,3),
 [K+'r1']:u1('rates'),
 [K+'r2']:u1('speed'),
 [K+'r3']:u1('change'),
 [K+'r4']:u1('samechange'),
 [K+'ex1']:u1('count'),
 [K+'ex2']:u1('unit'),
 [K+'ex3']:u1('exans'),
 [K+'ex4']:u1('back'),
 // 電流の矢印と「→ 電流は右向き」が出る前（p＜0.5）で止める：間違いの提示だけ。
 [K+'m1']:(p,ctx)=>u1('elecleft')(Math.min(p,.45),ctx),
 [K+'m2']:u1('arrows'),
 [K+'m3']:u1('arrows2'),
 [K+'m4']:u1('capans'),
 [K+'sum']:u1('summary'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

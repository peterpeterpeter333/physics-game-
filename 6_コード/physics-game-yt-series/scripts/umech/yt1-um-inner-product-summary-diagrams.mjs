// 大学編「内積・中級・要点」(ys-um-inner-product-summary) — 図。Stage 1200×515.
// 詳しい動画（um-inner-product-1 / -2）の図を関数として再利用し、結論の表と締めのカードだけをここで描く。
// 色（詳しい動画と同じ）：𝐀・力 𝐅 緑、𝐁・移動 Δ𝐫 水色、基本の向き x̂・ŷ 紫、消える項・負 赤、強調 黄。ベクトルは太字。
import {C,seg,fade,label,rect,tex,texWidth} from './anim.mjs';
import {ytUmInnerProduct1Diagrams as I1} from './yt1-um-inner-product-1-diagrams.mjs';
import {ytUmInnerProduct2Diagrams as I2} from './yt1-um-inner-product-2-diagrams.mjs';

const K='um-inner-product-summary:';
const i1=k=>I1['um-inner-product-1:'+k],i2=k=>I2['um-inner-product-2:'+k];
const two=(f,g,s)=>p=>p<s?f(p/s):g((p-s)/(1-s));
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const bf=(c,s)=>`{\\color{${c}}{\\mathbf{${s}}}}`;
const TF=(s,x,maxW,size)=>{const w=texWidth(s,size,false);return tex(s,x,0,{size:w>maxW?size*maxW/w:size,auto:false});};

const ROWS=[
 [()=>TF(`${bf(C.F,'A')}\\cdot${bf(C.x,'B')}=AB\\cos\\theta=A_xB_x+A_yB_y`,500,640,42),'2通りの書き方'],
 [()=>label('正 → 90°より小 ／ 0 → 直角 ／ 負 → 90°より大',545,12,{size:28,color:C.ink,anchor:'middle',weight:700}),'符号で読む'],
 [()=>tex(`${bf(C.F,'A')}\\cdot${bf(C.F,'A')}=A^2`,500,0,{size:44,auto:false}),'長さの2乗'],
];
function results(p,n,{title='結論',fresh=true}={}){
 let s=label(title,600,55,{size:28,color:C.dim,anchor:'middle'});
 ROWS.forEach(([f,note],i)=>{
  if(i>=n)return;
  const y=80+i*135,g=fresh&&i===n-1?seg(p,.03,.2):1;
  s+=card(80,y,1040,115,label(['①','②','③'][i],130,y+70,{size:36,color:C.hi,anchor:'middle',weight:700})
   +`<g transform="translate(0 ${y+58})">${f()}</g>`+label(note,1000,y+70,{size:26,color:C.dim,anchor:'middle'}),g,fresh&&i===n-1?C.hi:C.faint);
 });
 return s;
}

export const ytUmInnerProductSummaryDiagrams={
 [K+'intro']:(p)=>results(p,0)+fade(seg(p,.1,.3),label('角度を測らずに、成分だけで内積を計算する',600,280,{size:34,color:C.ink,anchor:'middle',weight:700})),
 [K+'c1']:(p)=>results(p,1),
 [K+'c2']:(p)=>results(p,2),
 [K+'c3']:(p)=>results(p,3),
 [K+'r1']:i1('xy'),
 [K+'r2']:i1('table'),
 [K+'r3']:two(i1('yy'),i1('xy'),.5),
 [K+'r4']:i1('result'),
 [K+'ex1']:i1('example'),
 [K+'ex2']:i1('comp'),
 [K+'ex3']:two(i1('cos'),i1('both'),.45),
 [K+'ex4']:i2('hiddencalc'),
 [K+'ex5']:i2('hiddenmean'),
 [K+'ex6']:i2('selfcalc'),
 [K+'m1']:i2('trap'),
 [K+'m2']:i2('trapwrong'),
 [K+'m3']:i2('trapwhen'),
 [K+'m4']:i2('trapmax'),
 [K+'sum']:(p)=>results(p,3,{title:'まとめ',fresh:false}),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

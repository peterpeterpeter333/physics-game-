// YouTube シリーズ「マクスウェル方程式・上級 3/4」(ys-ue-maxwell-3) — 図。Stage 1200×515.
// 色：𝐄・E_y 水色、𝐁・B_z 橙、t 金、x 水色（位置）、c 紫、強調 黄、誤り 赤。
// 式の番号：① ∂E_y/∂x＝−∂B_z/∂t、② −∂B_z/∂x＝μ₀ε₀∂E_y/∂t、③ ① を x で偏微分、④ ② を t で偏微分。
// 混合微分の書き方：∂²B_z/∂x∂t＝∂/∂x(∂B_z/∂t)（先に t、次に x）。∂²B_z/∂t∂x＝∂/∂t(∂B_z/∂x)（先に x、次に t）。
// 部品は export して 4/4 でも使う（関数・文字列の export は図の登録に入らない）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,texWidth,highlight} from './anim.mjs';
import {card,T,cs,head} from './yt1-um-current-field-1-diagrams.mjs';
import {L,TF} from './yt1-ue-potential-1-diagrams.mjs';

const K='ue-maxwell-3:';
export const EC=C.x,BC=C.E,TC=C.t,XC=C.x,VC=C.v,HI=C.hi,BAD=C.a,INK=C.ink,DIM=C.dim,CI=C.F,QC=C.p;
export {card,T,cs,head,L,TF};
// ---- TeX pieces -----------------------------------------------------------------------------------
export const Ey=cs(EC,'E_y'),Bz=cs(BC,'B_z'),xx=cs(XC,'x'),tt=cs(TC,'t'),cc=cs(VC,'c'),ME='\\mu_0\\varepsilon_0';
export const d1=(f,v)=>`\\frac{\\partial ${f}}{\\partial ${v}}`;
export const d2=(f,v)=>`\\frac{\\partial^2 ${f}}{\\partial ${v}^2}`;
export const dm=(f,a,b)=>`\\frac{\\partial^2 ${f}}{\\partial ${a}\\,\\partial ${b}}`;
export const ARG=`k${xx}-\\omega ${tt}`;
export const EQ1=`${d1(Ey,xx)}=-${d1(Bz,tt)}`;
export const EQ2=`-${d1(Bz,xx)}=${ME}\\,${d1(Ey,tt)}`;
export const WAVE=`${d2(Ey,xx)}=${ME}\\,${d2(Ey,tt)}`;
const EQ3=`${d2(Ey,xx)}=-${dm(Bz,xx,tt)}`;
const EQ4=`-${dm(Bz,tt,xx)}=${ME}\\,${d2(Ey,tt)}`;
export const CVAL=`${cc}=\\dfrac{1}{\\sqrt{${ME}}}`;
const U=s=>`\\,\\mathrm{${s}}`;

// A row of TeX pieces laid side by side, centred at cx. Returns svg and the x-span of each piece.
export function row(parts,cx,y,{size=44,gap=18,g=[]}={}){
 const ws=parts.map(q=>texWidth(q,size,false));const tot=ws.reduce((a,b)=>a+b,0)+gap*(parts.length-1);
 let x=cx-tot/2,svg='';const spans=[];
 parts.forEach((q,i)=>{spans.push([x,ws[i]]);svg+=fade(g[i]??1,T(q,x+ws[i]/2,y,{size}));x+=ws[i]+gap;});
 return {svg,spans};
}
// highlight box around a fraction-height TeX piece
export const fbox=(span,y,size,gg=1,col=HI)=>highlight(span[0]-12,y-size*1.75,span[1]+24,size*2.7,gg,col);
// small equation cards at the top (the "board")
export function board(left,right,{gl=1,gr=1,hl=-1}={}){
 const one=([lab,src],x,gg,on)=>card(x,12,540,112,label(lab,x+18,44,{size:22,color:on?HI:DIM})+T(src,x+300,88,{size:Math.min(32,32*470/Math.max(1,texWidth(src,32,false)))}),gg,on?HI:C.faint);
 return (left?one(left,40,gl,hl===0):'')+(right?one(right,620,gr,hl===1):'');
}
const B12=[['①',EQ1],['②',EQ2]],B3=['③',EQ3],B4=['④',EQ4];
// ---- wave graph (S3) --------------------------------------------------------------------------------
const GX0=70,GX1=640,GY=330,GS=58;// screen x of u=0 at GX0+? ; 1 unit = GS px
const bump=u=>Math.exp(-u*u/1.1);
export function waveAxes(g=1){
 return fade(g,arrow(GX0-10,GY,GX1+20,GY,{color:DIM,w:2.5,head:14})+label('x',GX1+28,GY+8,{size:26,color:XC,weight:700})
  +arrow(GX0,GY+40,GX0,140,{color:DIM,w:2.5,head:14})+T(Ey,GX0+30,148,{size:30}));
}
export function bumpCurve(shift,{color=EC,w=5,dash='',g=1,x0=2.2}={}){// crest at u=x0+shift (graph units from GX0)
 const pts=[];for(let i=0;i<=200;i++){const u=i/200*((GX1-GX0)/GS);pts.push([GX0+u*GS,GY-150*bump(u-x0-shift)]);}
 return fade(g,draw(pts,1,{color,w,dash}));
}
const cardR=(inner,g=1,stroke=C.faint)=>card(700,150,460,330,inner,g,stroke);
// mixed-derivative check with sin(kx−ωt): row 0 = x then t, row 1 = t then x
const AX=s=>`\\xrightarrow{\\ \\partial/\\partial ${s}\\ }`;
function chkFig(p,k){
 const a=`\\sin(${ARG})`,b=`k\\cos(${ARG})`,c=`k\\omega\\sin(${ARG})`,b2=`-\\omega\\cos(${ARG})`;
 let s=L('確かめ：sin(kx − ωt)',600,60,{size:28,color:DIM});
 s+=card(40,95,1120,170,L('x → t の 順',150,135,{size:24,color:XC,weight:700}),1);
 const g1=k?[1,1,1,1,1]:[1,seg(p,.1,.25),seg(p,.1,.25),seg(p,.5,.65),seg(p,.5,.65)];
 const r1=row([a,AX(xx),b,AX(tt),c],600,210,{size:34,gap:8,g:g1});s+=r1.svg;
 if(!k)s+=fade(seg(p,.25,.4),L('中身の 倍率 k',r1.spans[2][0]+r1.spans[2][1]/2,252,{size:22,color:HI}))+fade(seg(p,.65,.8),L('−sin と −ω',r1.spans[4][0]+r1.spans[4][1]/2,252,{size:22,color:HI}));
 if(k){
  s+=card(40,290,1120,170,L('t → x の 順',150,330,{size:24,color:TC,weight:700}),seg(p,.05,.2));
  const r2=row([a,AX(tt),b2,AX(xx),c],600,405,{size:34,gap:8,g:[seg(p,.1,.3),seg(p,.1,.3),seg(p,.1,.3),seg(p,.4,.6),seg(p,.4,.6)]});s+=r2.svg;
  const g=seg(p,.7,.85);s+=fade(g,highlight(r1.spans[4][0]-10,160,r1.spans[4][1]+20,80,1)+highlight(r2.spans[4][0]-10,355,r2.spans[4][1]+20,80,1)+L('同じ',r2.spans[4][0]+r2.spans[4][1]/2,290,{size:28,color:HI,weight:700}));
 }
 return s;
}


export const ytUeMaxwell3Diagrams={
 // ===== S1 前回の問い =====
 [K+'prev']:(p)=>{
  // small rectangle in the xy plane: left side at x, right side at x+dx; E_y arrows of different length
  const x0=170,x1=420,yb=380,yt=170;
  let s=draw([[x0,yb],[x1,yb],[x1,yt],[x0,yt],[x0,yb]],1,{color:INK,w:3});
  s+=fade(seg(p,.15,.35),arrow(x0,yb-40,x0,yb-40-110,{color:EC,w:6,head:16})+arrow(x1,yb-40,x1,yb-40-160,{color:EC,w:6,head:16}));
  s+=fade(seg(p,.15,.35),T(`${Ey}(${xx})`,x0-60,yb-120,{size:28})+T(`${Ey}(${xx}+d${xx})`,x1+95,yb-150,{size:28}));
  s+=label('x',x0,yb+36,{size:26,color:XC,anchor:'middle',weight:700})+label('x＋dx',x1,yb+36,{size:26,color:XC,anchor:'middle',weight:700});
  s+=fade(seg(p,.35,.5),ring(295,275,18,{color:BC,w:4,fill:'#101a30'})+dot(295,275,5.4,BC)+T(Bz,330,282,{size:28,anchor:'start'}));
  s+=cardR(L('前回：小さな 長方形の 一周',930,200,{size:26,color:DIM})+fade(seg(p,.5,.7),L('場の 差 ÷ 幅',930,280,{size:30,color:INK,weight:700})+L('→ 偏微分',930,350,{size:32,color:HI,weight:700})),1);
  return s;
 },
 [K+'eq12']:(p)=>{
  let s=board(...B12,{hl:-1});
  const r1=row([d1(Ey,xx),'=',`-${d1(Bz,tt)}`],640,235,{size:46}),r2=row([`-${d1(Bz,xx)}`,'=',`${ME}\\,${d1(Ey,tt)}`],640,400,{size:46,g:[seg(p,.3,.45),seg(p,.3,.45),seg(p,.3,.45)]});
  s+=label('① ファラデー',r1.spans[0][0]-40,245,{size:26,color:DIM,anchor:'end'})+r1.svg;
  s+=fade(seg(p,.3,.45),label('② アンペール・マクスウェル',r2.spans[0][0]-40,410,{size:26,color:DIM,anchor:'end'}))+r2.svg;
  return s;
 },
 [K+'eq1']:(p)=>{
  let s=board(...B12,{hl:0,gr:.45});
  const r=row([d1(Ey,xx),'=',`-${d1(Bz,tt)}`],600,290,{size:58});
  s+=r.svg+fade(seg(p,.25,.45),L('E の y 成分の x 偏微分',300,450,{size:26,color:EC})+line(r.spans[0][0]+r.spans[0][1]/2,370,300,420,{color:EC,w:2}))
   +fade(seg(p,.5,.7),L('B の z 成分の t 偏微分 × (−1)',900,450,{size:26,color:BC})+line(r.spans[2][0]+r.spans[2][1]/2,370,900,420,{color:BC,w:2}));
  s+=L('① ファラデーの 法則から',600,175,{size:26,color:DIM});
  return s;
 },
 [K+'eq2']:(p)=>{
  let s=board(...B12,{hl:1});
  const r=row([`-${d1(Bz,xx)}`,'=',`${ME}\\,${d1(Ey,tt)}`],600,290,{size:58});
  s+=r.svg+fade(seg(p,.3,.5),L('B の z 成分の x 偏微分 × (−1)',300,450,{size:26,color:BC})+line(r.spans[0][0]+r.spans[0][1]/2,370,300,420,{color:BC,w:2}))
   +fade(seg(p,.55,.75),L('E の y 成分の t 偏微分 × μ₀ε₀',900,450,{size:26,color:EC})+line(r.spans[2][0]+r.spans[2][1]/2,370,900,420,{color:EC,w:2}));
  s+=L('② アンペール・マクスウェルの 法則から',600,175,{size:26,color:DIM});
  return s;
 },
 [K+'partial']:(p)=>{
  let s=board(...B12);
  s+=card(80,165,480,300,T(`\\frac{\\partial}{\\partial ${xx}}`,320,260,{size:56})+L('x で 偏微分',320,350,{size:28,color:XC,weight:700})+L('t を 止める',320,410,{size:28,color:TC}),1);
  s+=card(640,165,480,300,T(`\\frac{\\partial}{\\partial ${tt}}`,880,260,{size:56})+L('t で 偏微分',880,350,{size:28,color:TC,weight:700})+L('x を 止める',880,410,{size:28,color:XC}),seg(p,.35,.5));
  return s;
 },
 [K+'ask']:(p)=>{
  let s=board(...B12);
  s+=card(200,165,800,320,L('前回の 最後の 問い',600,215,{size:24,color:DIM})+L('2本から B を 消すと',600,290,{size:32,color:BC,weight:700})
   +L('E だけの 式は？',600,360,{size:34,color:EC,weight:700})+L('どんな 速さの 波？',600,430,{size:34,color:VC,weight:700}),seg(p,.05,.2),HI);
  return s;
 },
 [K+'promise']:(p)=>{
  let s=card(80,70,500,360,L('初級 29 の 2本目',330,125,{size:24,color:DIM})+L('光の 速さを',330,210,{size:30,color:INK})+L('電場と 磁場の 法則から',330,265,{size:30,color:INK})+L('導くのは 上級',330,320,{size:32,color:HI,weight:700}),1);
  s+=fade(seg(p,.5,.65),arrow(600,250,700,250,{color:HI,w:5,head:16}));
  s+=card(720,70,400,360,L('今回',920,125,{size:26,color:DIM})+T(`${cc}=\\ ?`,920,260,{size:64}),seg(p,.55,.7),HI);
  return s;
 },
 // ===== S2 B を消す =====
 [K+'plan']:(p)=>{
  const r1=row([d1(Ey,xx),'=',`-${d1(Bz,tt)}`],600,140,{size:46}),r2=row([`-${d1(Bz,xx)}`,'=',`${ME}\\,${d1(Ey,tt)}`],600,300,{size:46});
  let s=label('①',r1.spans[0][0]-80,150,{size:30,color:DIM})+label('②',r2.spans[0][0]-80,310,{size:30,color:DIM})+r1.svg+r2.svg;
  s+=fbox(r1.spans[2],140,46,seg(p,.15,.3))+fbox(r2.spans[0],300,46,seg(p,.15,.3));
  s+=fade(seg(p,.5,.7),L('B の 項を 同じ 形に そろえる → 置き換えて 消す',600,450,{size:30,color:HI,weight:700}));
  return s;
 },
 [K+'dx1']:(p)=>{
  let s=board(...B12,{hl:0,gr:.45});
  s+=L('① の 両辺を x で 偏微分',600,175,{size:26,color:XC});
  s+=T(`\\frac{\\partial}{\\partial ${xx}}\\!\\left(${d1(Ey,xx)}\\right)=-\\frac{\\partial}{\\partial ${xx}}\\!\\left(${d1(Bz,tt)}\\right)`,600,265,{size:44});
  const r=row([d2(Ey,xx),'=',`-\\frac{\\partial}{\\partial ${xx}}\\!\\left(${d1(Bz,tt)}\\right)`],600,420,{size:44,g:[seg(p,.4,.6),seg(p,.4,.6),seg(p,.4,.6)]});
  s+=r.svg+fbox(r.spans[0],420,44,seg(p,.55,.7));
  return s;
 },
 [K+'dx1r']:(p)=>{
  let s=board(...B12,{hl:0,gr:.45});
  s+=L('① の 両辺を x で 偏微分',600,175,{size:26,color:XC});
  s+=fade(.45,T(`\\frac{\\partial}{\\partial ${xx}}\\!\\left(${d1(Ey,xx)}\\right)=-\\frac{\\partial}{\\partial ${xx}}\\!\\left(${d1(Bz,tt)}\\right)`,600,265,{size:44}));
  const r=row([d2(Ey,xx),'=',`-${dm(Bz,xx,tt)}`],600,400,{size:48});
  s+=label('③',r.spans[0][0]-70,410,{size:32,color:HI,weight:700})+r.svg+fbox(r.spans[2],400,48,seg(p,.1,.25));
  s+=fade(seg(p,.2,.4),L('先に t、次に x',r.spans[2][0]+r.spans[2][1]/2,490,{size:24,color:HI}));
  s+=fade(seg(p,.6,.75),L('混合微分',r.spans[2][0]+r.spans[2][1]+90,410,{size:28,color:HI,weight:700}));
  return s;
 },
 [K+'dt2']:(p)=>{
  let s=board(B3,B12[1],{hl:1});
  s+=L('② の 両辺を t で 偏微分',600,175,{size:26,color:TC});
  s+=T(`-\\frac{\\partial}{\\partial ${tt}}\\!\\left(${d1(Bz,xx)}\\right)=${ME}\\,\\frac{\\partial}{\\partial ${tt}}\\!\\left(${d1(Ey,tt)}\\right)`,600,265,{size:42});
  const r=row([`-\\frac{\\partial}{\\partial ${tt}}\\!\\left(${d1(Bz,xx)}\\right)`,'=',`${ME}\\,${d2(Ey,tt)}`],600,420,{size:42,g:[seg(p,.4,.6),seg(p,.4,.6),seg(p,.4,.6)]});
  s+=r.svg+fbox(r.spans[2],420,42,seg(p,.55,.7));
  return s;
 },
 [K+'dt2l']:(p)=>{
  let s=board(B3,B12[1],{hl:1});
  s+=L('② の 両辺を t で 偏微分',600,175,{size:26,color:TC});
  s+=fade(.45,T(`-\\frac{\\partial}{\\partial ${tt}}\\!\\left(${d1(Bz,xx)}\\right)=${ME}\\,\\frac{\\partial}{\\partial ${tt}}\\!\\left(${d1(Ey,tt)}\\right)`,600,265,{size:42}));
  const r=row([`-${dm(Bz,tt,xx)}`,'=',`${ME}\\,${d2(Ey,tt)}`],600,400,{size:48});
  s+=label('④',r.spans[0][0]-70,410,{size:32,color:HI,weight:700})+r.svg+fbox(r.spans[0],400,48,seg(p,.1,.25));
  s+=fade(seg(p,.2,.4),L('先に x、次に t',r.spans[0][0]+r.spans[0][1]/2,490,{size:24,color:HI}));
  return s;
 },
 [K+'order']:(p)=>{
  let s=board(B3,B4);
  const r=row([dm(Bz,xx,tt),'=',dm(Bz,tt,xx)],600,290,{size:56,g:[1,seg(p,.3,.45),1]});
  s+=r.svg;
  s+=L('先に t、次に x',r.spans[0][0]+r.spans[0][1]/2,180,{size:24,color:DIM})+L('先に x、次に t',r.spans[2][0]+r.spans[2][1]/2,180,{size:24,color:DIM});
  s+=fade(seg(p,.5,.7),card(300,385,600,100,L('場が なめらか なら 等しい（前提）',600,448,{size:30,color:HI,weight:700}),1,HI));
  return s;
 },
 [K+'chk1']:(p)=>chkFig(p,0),
 [K+'chk2']:(p)=>chkFig(p,1),
 [K+'sub1']:(p)=>{
  const r3=row([d2(Ey,xx),'=',`-${dm(Bz,xx,tt)}`],600,140,{size:46}),r4=row([`-${dm(Bz,tt,xx)}`,'=',`${ME}\\,${d2(Ey,tt)}`],600,370,{size:46});
  let s=label('③',r3.spans[0][0]-70,150,{size:30,color:DIM})+label('④',r4.spans[0][0]-70,380,{size:30,color:DIM})+r3.svg+r4.svg;
  s+=fbox(r3.spans[2],140,46,seg(p,.1,.25))+fbox(r4.spans[0],370,46,seg(p,.3,.45));
  const xa=r3.spans[2][0]+r3.spans[2][1]/2,xb=r4.spans[0][0]+r4.spans[0][1]/2;
  s+=fade(seg(p,.5,.65),line(xa,210,xb,295,{color:HI,w:3,dash:'8 6'})+L('マイナスも 含めて 同じ',Math.max(xa,xb)+230,262,{size:26,color:HI,weight:700}));
  return s;
 },
 [K+'sub2']:(p)=>{
  const u=seg(p,.35,.6);
  const r4=row([`-${dm(Bz,tt,xx)}`,'=',`${ME}\\,${d2(Ey,tt)}`],600,370,{size:46});
  let s=label('④',r4.spans[0][0]-70,380,{size:30,color:DIM})+r4.svg+fbox(r4.spans[2],370,46,seg(p,.05,.2));
  const lw=texWidth(`${d2(Ey,xx)}=`,46,false),w1=texWidth(`-${dm(Bz,xx,tt)}`,46,false),w2=texWidth(`${ME}\\,${d2(Ey,tt)}`,46,false);
  const W=lw+10+mix(w1,w2,u),x0=600-W/2;
  s+=label('③',x0-70,150,{size:30,color:DIM})+T(`${d2(Ey,xx)}=`,x0+lw/2,140,{size:46});
  s+=fade(1-u,T(`-${dm(Bz,xx,tt)}`,x0+lw+10+w1/2,140,{size:46}))+fade(u,T(`${ME}\\,${d2(Ey,tt)}`,x0+lw+10+w2/2,140,{size:46}));
  s+=highlight(x0+lw,140-46*1.75,mix(w1,w2,u)+24,46*2.7,1);
  const xb=r4.spans[2][0]+r4.spans[2][1]/2;
  s+=fade(seg(p,.1,.3),arrow(xb,290,x0+lw+10+mix(w1,w2,u)/2,225,{color:HI,w:4,head:15}));
  s+=fade(seg(p,.2,.35),L('置き換える',xb+120,265,{size:26,color:HI,weight:700}));
  return s;
 },
 [K+'result']:(p)=>{
  let s=TF(WAVE,600,250,{size:66,box:true,frac:true});
  s+=fade(seg(p,.3,.5),L('B が 消えた：E の y 成分 だけの 式',600,440,{size:30,color:HI,weight:700}));
  return s;
 },
 [K+'name']:(p)=>{
  const r=row([d2(Ey,xx),'=',`${ME}\\,${d2(Ey,tt)}`],600,220,{size:58});
  let s=L('波動方程式',600,90,{size:34,color:HI,weight:700})+r.svg;
  const xl=r.spans[0][0]+r.spans[0][1]/2,xr=r.spans[2][0]+r.spans[2][1]*.62;
  s+=fade(seg(p,.3,.45),card(70,330,470,130,L('ある 瞬間の',305,380,{size:26,color:DIM})+L('形の 曲がり具合',305,430,{size:30,color:XC,weight:700}),1)+line(xl,300,305,330,{color:XC,w:2.5}));
  s+=fade(seg(p,.6,.75),card(660,330,470,130,L('ある 場所での 値の',895,380,{size:26,color:DIM})+L('変わり方の 変わり方',895,430,{size:30,color:TC,weight:700}),1)+line(xr,300,895,330,{color:TC,w:2.5}));
  return s;
 },
 [K+'units']:(p)=>{
  const r=row([d2(Ey,xx),'=',`${ME}\\,${d2(Ey,tt)}`],600,130,{size:48});
  let s=r.svg;
  const xl=r.spans[0][0]+r.spans[0][1]/2,xr=r.spans[2][0]+r.spans[2][1]*.68;
  s+=fade(seg(p,.1,.25),T(`\\frac{\\mathrm{V/m}}{\\mathrm{m^2}}`,xl,275,{size:40}));
  s+=fade(seg(p,.3,.45),T(`\\frac{\\mathrm{V/m}}{\\mathrm{s^2}}`,xr,275,{size:40}));
  s+=fade(seg(p,.1,.25),label('単位',xl-110,282,{size:24,color:DIM,anchor:'end'}));
  s+=fade(seg(p,.55,.7),T(`[${ME}]=\\frac{\\mathrm{s^2}}{\\mathrm{m^2}}`,470,425,{size:44})+L('＝ 1 /（速さ）² の 単位？',870,435,{size:30,color:VC,weight:700}));
  return s;
 },
 // ===== S3 進む波 =====
 [K+'wave']:(p)=>{
  let s=waveAxes()+bumpCurve(0,{g:seg(p,.05,.25)});
  s+=fade(seg(p,.05,.25),L('t ＝ 0',GX0+2.2*GS,150,{size:24,color:TC}));
  s+=cardR(L('形 f の まま 右へ 進む 波',930,200,{size:26,color:DIM})+T(`${Ey}=f(${xx}-${cc}${tt})`,930,300,{size:46})+fade(seg(p,.5,.7),L('c：波の 速さ',930,400,{size:28,color:VC,weight:700})),1);
  return s;
 },
 [K+'shift']:(p)=>{
  const sh=2.6*seg(p,.15,.6);
  let s=waveAxes()+bumpCurve(0,{color:DIM,w:3,dash:'8 7'})+label('t ＝ 0',GX0+2.2*GS,150,{size:24,color:DIM,anchor:'middle'});
  s+=bumpCurve(sh);
  s+=fade(seg(p,.55,.7),arrow(GX0+2.2*GS,GY+30,GX0+4.8*GS,GY+30,{color:VC,w:5,head:15})+T(`${cc}\\times1\\,\\mathrm{s}`,GX0+3.5*GS,GY+72,{size:28})+label('1 s 後',GX0+4.8*GS,150,{size:24,color:TC,anchor:'middle'}));
  s+=cardR(L('同じ 高さ ＝ 同じ 中身',930,200,{size:26,color:DIM})+T(`${xx}-${cc}${tt}`,870,290,{size:40})+L('＝ 一定',1010,300,{size:30,color:INK,weight:700})+fade(seg(p,.6,.75),L('→ x は 1秒に c 増える',930,390,{size:28,color:VC,weight:700})),1);
  return s;
 },
 [K+'initial']:(p)=>{
  let s=waveAxes()+bumpCurve(0,{color:DIM,w:3,dash:'8 7'})+bumpCurve(2.6)+arrow(GX0+2.2*GS,GY+30,GX0+4.8*GS,GY+30,{color:VC,w:5,head:15});
  s+=cardR(L('初級：山は',930,200,{size:26,color:DIM})+T(`\\lambda/T`,930,265,{size:40})+L('の 速さで 進む',930,320,{size:26,color:DIM})+fade(seg(p,.4,.6),L('c は まだ 分からない',930,400,{size:28,color:VC,weight:700})),1);
  return s;
 },
 [K+'dx']:(p)=>{
  let s=T(`u=${xx}-${cc}${tt}`,600,60,{size:40});
  s+=fade(seg(p,.2,.35),L('x の 倍率：1',440,125,{size:26,color:XC,weight:700}));
  s+=card(40,155,540,330,L('x で 偏微分',310,195,{size:24,color:XC}),1)+card(620,155,540,330,L('t で 偏微分',890,195,{size:24,color:TC}),.35);
  s+=fade(seg(p,.35,.55),T(`${d1(Ey,xx)}=f'(u)\\times1=f'`,310,280,{size:38}));
  return s;
 },
 [K+'dx2']:(p)=>{
  let s=T(`u=${xx}-${cc}${tt}`,600,60,{size:40})+L('x の 倍率：1',440,125,{size:26,color:XC,weight:700});
  s+=card(40,155,540,330,L('x で 偏微分',310,195,{size:24,color:XC}),1)+card(620,155,540,330,L('t で 偏微分',890,195,{size:24,color:TC}),.35);
  s+=T(`${d1(Ey,xx)}=f'`,310,280,{size:38});
  s+=fade(seg(p,.15,.35),T(`${d2(Ey,xx)}=f''`,310,400,{size:42}));
  return s;
 },
 [K+'dt']:(p)=>{
  let s=T(`u=${xx}-${cc}${tt}`,600,60,{size:40})+L('x の 倍率：1',440,125,{size:26,color:XC,weight:700});
  s+=fade(seg(p,.2,.35),L('t の 倍率：−c',780,125,{size:26,color:TC,weight:700}));
  s+=card(40,155,540,330,L('x で 偏微分',310,195,{size:24,color:XC}),1)+card(620,155,540,330,L('t で 偏微分',890,195,{size:24,color:TC}),1);
  s+=T(`${d1(Ey,xx)}=f'`,310,280,{size:38})+T(`${d2(Ey,xx)}=f''`,310,400,{size:42});
  s+=fade(seg(p,.45,.65),T(`${d1(Ey,tt)}=f'(u)\\times(-${cc})=-${cc}f'`,890,280,{size:34}));
  return s;
 },
 [K+'dt2b']:(p)=>{
  let s=T(`u=${xx}-${cc}${tt}`,600,60,{size:40})+L('x の 倍率：1',440,125,{size:26,color:XC,weight:700})+L('t の 倍率：−c',780,125,{size:26,color:TC,weight:700});
  s+=card(40,155,540,330,L('x で 偏微分',310,195,{size:24,color:XC}),1)+card(620,155,540,330,L('t で 偏微分',890,195,{size:24,color:TC}),1);
  s+=T(`${d1(Ey,xx)}=f'`,310,280,{size:38})+T(`${d2(Ey,xx)}=f''`,310,400,{size:42});
  s+=T(`${d1(Ey,tt)}=-${cc}f'`,890,280,{size:38});
  s+=fade(seg(p,.2,.4),T(`${d2(Ey,tt)}=(-${cc})^2f''`,890,400,{size:38}));
  s+=fade(seg(p,.6,.8),T(`=${cc}^2f''`,1020,460,{size:36}));
  return s;
 },
 [K+'plug']:(p)=>{
  const r=row([d2(Ey,xx),'=',`${ME}\\,${d2(Ey,tt)}`],600,120,{size:46});
  let s=r.svg;
  const r2=row([`f''`,'=',`${ME}\\,${cc}^2f''`],600,360,{size:64,g:[seg(p,.15,.35),seg(p,.15,.35),seg(p,.45,.65)]});
  s+=r2.svg;
  s+=fade(seg(p,.1,.3),arrow(r.spans[0][0]+r.spans[0][1]/2,200,r2.spans[0][0]+r2.spans[0][1]/2,290,{color:XC,w:4,head:14}));
  s+=fade(seg(p,.4,.6),arrow(r.spans[2][0]+r.spans[2][1]*.7,200,r2.spans[2][0]+r2.spans[2][1]*.6,290,{color:TC,w:4,head:14}));
  return s;
 },
 [K+'divide']:(p)=>{
  const g=seg(p,.3,.45)>.5;
  let s=T(`${g?"\\cancel{f''}":"f''"}=${ME}\\,${cc}^2${g?"\\cancel{f''}":"f''"}`,600,140,{size:56});
  s+=fade(seg(p,.05,.25),L('形が 曲がった 所：f″ ≠ 0 → f″ で 割る',600,250,{size:28,color:DIM}));
  s+=TF(`1=${ME}\\,${cc}^2`,600,390,{size:70,box:true,g:seg(p,.55,.75)});
  return s;
 },
 [K+'c']:(p)=>{
  let s=T(`1=${ME}\\,${cc}^2`,600,90,{size:44});
  s+=TF(CVAL,600,280,{size:72,box:true,frac:true,g:seg(p,.15,.35)});
  s+=fade(seg(p,.6,.75),L('速さは 正 → 正の 平方根',600,465,{size:28,color:VC,weight:700}));
  return s;
 },
 // ===== S4 数で確かめる =====
 [K+'mu']:(p)=>{
  // two parallel wires with currents and attractive forces
  let s='';for(const x of [170,330]){s+=line(x,80,x,440,{color:CI,w:5})+arrow(x,300,x,190,{color:CI,w:5,head:16});}
  s+=label('I',150,200,{size:28,color:CI,weight:700})+label('I',345,200,{size:28,color:CI,weight:700});
  s+=fade(seg(p,.15,.3),arrow(175,370,235,370,{color:C.F,w:5,head:14})+arrow(325,370,265,370,{color:C.F,w:5,head:14})+label('力',250,415,{size:26,color:INK,anchor:'middle'}));
  s+=card(480,90,680,330,L('電流どうしの 力で 決まる 磁気の 定数',820,150,{size:26,color:DIM})+T(`\\mu_0=4\\pi\\times10^{-7}${U('N/A^2')}`,820,270,{size:48}),1);
  return s;
 },
 [K+'eps']:(p)=>{
  const ch=(x,y,c)=>ring(x,y,22,{color:c,w:3,fill:'#2a1d3a'})+label('＋',x,y+8,{size:24,color:c,anchor:'middle',weight:700});
  let s=ch(150,260,QC)+ch(370,260,QC)+arrow(128,260,60,260,{color:C.F,w:5,head:14})+arrow(392,260,460,260,{color:C.F,w:5,head:14});
  s+=label('k：力を 測って 決まる',260,350,{size:24,color:DIM,anchor:'middle'});
  s+=card(500,70,660,380,L('定義',830,120,{size:26,color:DIM})+T(`\\varepsilon_0=\\dfrac{1}{4\\pi k}`,830,215,{size:50})
   +fade(seg(p,.5,.7),T(`\\varepsilon_0=8.854\\times10^{-12}${U('C^2/(N\\,m^2)')}`,830,355,{size:40})),1);
  return s;
 },
 [K+'mult']:(p)=>{
  let s=T(`${ME}=4\\pi\\times10^{-7}\\times8.854\\times10^{-12}`,600,170,{size:50});
  s+=TF(`${ME}\\approx1.113\\times10^{-17}`,600,350,{size:56,box:true,g:seg(p,.3,.5)});
  return s;
 },
 [K+'unit']:(p)=>{
  const g=seg(p,.15,.3)>.5;
  let s=T(`\\frac{${g?'\\cancel{\\mathrm N}':'\\mathrm N'}}{\\mathrm{A^2}}\\times\\frac{\\mathrm{C^2}}{${g?'\\cancel{\\mathrm N}':'\\mathrm N'}\\,\\mathrm{m^2}}=\\frac{\\mathrm{C^2}}{\\mathrm{A^2\\,m^2}}`,600,150,{size:52});
  s+=fade(seg(p,.35,.5),L('A ＝ C/s',330,390,{size:30,color:CI,weight:700}));
  s+=fade(seg(p,.45,.6),TF(`=\\frac{\\mathrm{s^2}}{\\mathrm{m^2}}`,600,380,{size:56,box:true,frac:true}));
  s+=fade(seg(p,.7,.85),L('＝ 1 /（速さ）²',900,395,{size:30,color:VC,weight:700}));
  return s;
 },
 [K+'sqrt']:(p)=>{
  let s=T(`\\sqrt{${ME}}\\approx3.336\\times10^{-9}${U('s/m')}`,600,120,{size:48});
  s+=TF(`${cc}=\\dfrac{1}{\\sqrt{${ME}}}\\approx3.00\\times10^{8}${U('m/s')}`,600,330,{size:58,box:true,frac:true,g:seg(p,.35,.55)});
  return s;
 },
 [K+'light']:(p)=>{
  let s=card(60,90,480,320,L('電気と 磁気の 定数から',300,150,{size:26,color:DIM})+T(`${cc}\\approx3.00\\times10^{8}${U('m/s')}`,300,260,{size:38}),1);
  s+=fade(seg(p,.3,.45),label('＝',600,265,{size:60,color:HI,anchor:'middle',weight:700}));
  s+=card(660,90,480,320,L('光の 速さの 測定',900,150,{size:26,color:DIM})+L('秒速 約 30万 km',900,265,{size:38,color:INK,weight:700}),seg(p,.3,.45));
  return s;
 },
 [K+'history']:(p)=>{
  let s=line(100,300,1100,300,{color:DIM,w:3});
  s+=dot(330,300,10,HI)+label('1865年ごろ',330,350,{size:26,color:HI,anchor:'middle',weight:700});
  s+=card(150,90,360,150,L('マクスウェル',330,140,{size:28,color:INK,weight:700})+L('光は 電磁波',330,200,{size:30,color:HI,weight:700}),seg(p,.4,.55));
  s+=fade(seg(p,.05,.25),L('実験で 決まる 定数 → 光の 速さ',600,440,{size:28,color:DIM}));
  return s;
 },
 [K+'hertz']:(p)=>{
  let s=line(100,300,1100,300,{color:DIM,w:3});
  s+=dot(330,300,10,HI)+label('1865年ごろ',330,350,{size:26,color:HI,anchor:'middle',weight:700});
  s+=card(150,90,360,150,L('マクスウェル',330,140,{size:28,color:INK,weight:700})+L('光は 電磁波',330,200,{size:30,color:HI,weight:700}),1);
  s+=fade(seg(p,.3,.45),dot(830,300,10,HI)+label('1888年ごろ',830,350,{size:26,color:HI,anchor:'middle',weight:700})
   +card(620,90,420,150,L('ヘルツ',830,140,{size:28,color:INK,weight:700})+L('電磁波を 作り 反射を 確かめる',830,200,{size:24,color:HI,weight:700}),1));
  s+=fade(seg(p,.05,.2),L('一致 ＝ 実験との 比較（計算だけの 結論 ではない）',600,440,{size:28,color:INK,weight:700}));
  return s;
 },
 [K+'si']:(p)=>{
  let s=card(160,60,880,400,L('今の 単位の 約束',600,115,{size:26,color:DIM})+T(`${cc}=299\\,792\\,458${U('m/s')}`,600,210,{size:46})+L('（決めた 値）',600,265,{size:24,color:DIM})
   +fade(seg(p,.4,.6),T(`\\varepsilon_0=\\dfrac{1}{\\mu_0${cc}^2}`,600,375,{size:48})),1);
  return s;
 },
 // ===== S5 まとめ =====
 [K+'sum1']:(p)=>{
  const bx=(x,w,inner,gg)=>card(x,60,w,150,inner,gg);
  let s=bx(40,330,L('① ②',205,125,{size:30,color:INK,weight:700})+L('場の 差の 式 2本',205,175,{size:26,color:DIM}),1);
  s+=fade(seg(p,.15,.3),arrow(380,135,430,135,{color:HI,w:4,head:14}))+bx(440,300,L('x・t で 偏微分',590,125,{size:28,color:INK,weight:700})+L('③ ④',590,175,{size:26,color:DIM}),seg(p,.15,.3));
  s+=fade(seg(p,.35,.5),arrow(750,135,800,135,{color:HI,w:4,head:14}))+bx(810,350,L('混合微分を 置き換え',985,125,{size:28,color:INK,weight:700})+L('B が 消える',985,175,{size:26,color:BC}),seg(p,.35,.5));
  s+=TF(WAVE,600,380,{size:52,box:true,frac:true,g:seg(p,.55,.75)});
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=T(WAVE,600,85,{size:38});
  s+=fade(seg(p,.1,.25),T(`${Ey}=f(${xx}-${cc}${tt})`,600,190,{size:38}));
  s+=fade(seg(p,.3,.45),T(`1=${ME}\\,${cc}^2`,600,280,{size:42}));
  s+=TF(`${cc}=\\dfrac{1}{\\sqrt{${ME}}}\\approx3.00\\times10^{8}${U('m/s')}`,600,410,{size:48,box:true,frac:true,g:seg(p,.5,.7)});
  return s;
 },
 [K+'next1']:(p)=>{
  // E up (cyan), B out of the screen drawn obliquely (orange), travel direction (purple)
  const ox=330,oy=320;
  let s=arrow(ox,oy,ox+330,oy,{color:VC,w:5,head:18})+label('進む 向き x',ox+340,oy+8,{size:26,color:VC});
  s+=fade(seg(p,.15,.3),arrow(ox,oy,ox,oy-200,{color:EC,w:7,head:18})+T(cs(EC,'\\mathbf{E}'),ox-36,oy-170,{size:36}));
  s+=fade(seg(p,.3,.45),arrow(ox,oy,ox-120,oy+90,{color:BC,w:7,head:18})+T(cs(BC,'\\mathbf{B}'),ox-150,oy+70,{size:36}));
  s+=fade(seg(p,.55,.7),L('大きさは？　向きは？',880,200,{size:34,color:HI,weight:700}));
  return s;
 },
 [K+'next2']:(p)=>{
  let s=card(200,80,800,340,L('次の 問い',600,135,{size:26,color:DIM})+L('𝐄 と 𝐁 は どんな 関係で 進む？',600,225,{size:34,color:INK,weight:700})
   +L('このシリーズで 何が',600,305,{size:32,color:INK})+L('できる ように なった？',600,365,{size:36,color:HI,weight:700}),seg(p,.05,.2),HI);
  return s;
 },
};

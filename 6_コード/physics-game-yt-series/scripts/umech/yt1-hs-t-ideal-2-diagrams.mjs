// 高校編「状態方程式・深く学ぶ 2/3」(ys-hs-t-ideal-2) — 図。Stage 1200×515.
// 色：圧力 P 緑、体積 V 水色、速度 v 紫（成分 vₓ も紫）、運動量 p 桃、力 F 緑、時間 t 金、強調 黄。
// 式は auto:false で色を手で付ける（v_x の x を位置の水色にしないため）。「v² の平均」は上線 \overline{v^2}（構成表の案）。
import {C,seg,fade,label,line,rect,dot,ring,arrow,tex,texWidth,clamp,mix,draw,poly} from './anim.mjs';
import {card,tag,T2,FA,TC,sceneT,gasBox,step,PC,VC,Pt,Vt,MOL,Q2,IDEAL} from './yt1-hs-t-ideal-1-diagrams.mjs';
export {card,tag,T2,FA,TC,sceneT,gasBox,step,PC,VC,Pt,Vt,MOL,Q2,IDEAL};

const K='hs-t-ideal-2:';
const MC=C.p;
export const T3=(src,x,y,o={})=>tex(src,x,y,{size:46,auto:false,...o});
export const VX=`{\\color{${C.v}}v_x}`, VY=`{\\color{${C.v}}v_y}`, VZ=`{\\color{${C.v}}v_z}`, VV=`{\\color{${C.v}}v}`;
export const VX2=`{\\color{${C.v}}v_x}^2`;
export const AVX=`\\overline{{\\color{${C.v}}v_x}^{2}}`, AV2=`\\overline{{\\color{${C.v}}v}^{2}}`;
export const PVK=`${Pt}${Vt}=\\dfrac{1}{3}Nm${AV2}`;
export const FAVG=`\\dfrac{m${VX2}}{L}`;
const MVX=`m${VX}`;
// equation step (manual colours): previous line small, operation, new line in a card with room for fractions
export function stepX(p,prev,next,op,{size=54,col=C.hi,y0=80}={}){
 let s=fade(.6,T3(prev,600,y0,{size:34}));
 s+=fade(seg(p,.05,.2),label(op,600,y0+90,{size:28,color:col,anchor:'middle',weight:700})+arrow(600,y0+105,600,y0+150,{color:col,w:4,head:14}));
 s+=card(150,y0+170,900,170,T3(next,600,y0+268,{size}),seg(p,.3,.5),col);
 return s;
}
const lt=(p,ctx)=>ctx&&typeof ctx.t==='number'?ctx.t:p*8;
// ---- cube (oblique) with one molecule; right wall highlighted ------------------------------------
export function cube3(x,y,s,{g=1,wall=0,lab=1,mol=1,vx=0,comp=0}={}){
 const o=s*.42,R=C.dim;
 let q=`<polygon points="${x},${y} ${x+s},${y} ${x+s+o},${y-o} ${x+o},${y-o}" fill="#0f1a30" fill-opacity=".9" stroke="${R}" stroke-width="2"/>`;
 q+=rect(x,y,s,s,{fill:'#0f1a30',fo:.9,stroke:R,sw:2,rx:0});
 q+=`<polygon points="${x+s},${y} ${x+s+o},${y-o} ${x+s+o},${y+s-o} ${x+s},${y+s}" fill="${C.hi}" fill-opacity="${.04+.2*wall}" stroke="${wall?C.hi:R}" stroke-width="${2+2*wall}"/>`;
 if(lab)q+=label('L',x+s/2,y+s+36,{size:28,color:C.ink,anchor:'middle',weight:700})+label('L',x-24,y+s/2+8,{size:28,color:C.ink,anchor:'middle',weight:700})+label('L',x+s+o/2+22,y+s-o/2+18,{size:28,color:C.ink,weight:700});
 if(mol){const mx=x+s*.42,my=y+s*.5;
  q+=dot(mx,my,11,MOL);
  if(vx)q+=fade(vx,arrow(mx,my,mx+130,my-60,{color:C.v,w:5,head:16}));
  if(comp)q+=fade(comp,arrow(mx,my,mx+130,my,{color:C.v,w:4,head:14})+line(mx+130,my,mx+130,my-60,{color:C.v,w:2,dash:'6 6'})+tex(VX,mx+70,my+38,{size:34,auto:false}));
 }
 return fade(g,q);
}
// ---- 1-D box: ball bouncing between x0 and x1; period returns to right wall each Tr seconds -------
export const BB={x0:150,x1:750,y:200,h:140};
export function ballX(t,{x0=BB.x0,x1=BB.x1,r=26,Tr=1}={}){ // ball centre; at right wall at t = Tr/2 + k·Tr
 const W=x1-x0-2*r,ph=((t/Tr)%1+1)%1,z=ph<.5?ph*2:2-ph*2;return x0+r+W*z;
}
export function ballBox(t,{g=1,hit=1,showV=1,x0=BB.x0,x1=BB.x1,y=BB.y,h=BB.h,text='0.10 kg',mol=0,len='1.0 m'}={}){
 const r=mol?14:26,bx=ballX(t,{x0,x1,r}),cy=y+h/2,ph=((t%1)+1)%1,dir=ph<.5?1:-1;
 let s=rect(x0,y,x1-x0,h,{fill:'#0f1a30',fo:.9,stroke:C.faint,sw:2,rx:6})+line(x0,y,x0,y+h,{color:C.dim,w:5})+line(x1,y,x1,y+h,{color:C.dim,w:5});
 s+=dot(bx,cy,r,mol?MOL:'#c9d2e3');
 if(showV)s+=arrow(bx,cy-r-18,bx+dir*90,cy-r-18,{color:C.v,w:4,head:14});
 const d=Math.abs(ph-.5);if(hit&&d<.06)s+=`<path d="M${x1+6} ${cy-30} q16 30 0 60" fill="none" stroke="${C.hi}" stroke-width="5" opacity="${(1-d/.06).toFixed(2)}"/>`;
 if(len)s+=line(x0,y+h+26,x1,y+h+26,{color:C.dim,w:2})+line(x0,y+h+16,x0,y+h+36,{color:C.dim,w:2})+line(x1,y+h+16,x1,y+h+36,{color:C.dim,w:2})+label(len,(x0+x1)/2,y+h+60,{size:26,color:C.ink,anchor:'middle',weight:700});
 return fade(g,s);
}
// ---- F–t graph: thin spikes every 1.0 s (at 0.5, 1.5, …) and the averaged rectangle -------------------
export const FG={x:150,y:430,w:880,h:300,tmax:4.4,fmax:2.0};
const gX=t=>FG.x+FG.w*t/FG.tmax, gY=f=>FG.y-FG.h*f/FG.fmax;
export function ftGraph(p,{upto=4.4,avg=0,area=0,g=1}={}){
 let s=arrow(FG.x-10,FG.y,FG.x+FG.w+30,FG.y,{color:C.dim,w:2.5,head:14})+arrow(FG.x,FG.y+10,FG.x,FG.y-FG.h-24,{color:C.dim,w:2.5,head:14});
 s+=label('時間 [s]',FG.x+FG.w+20,FG.y+44,{size:24,color:C.t,anchor:'middle',weight:700})+label('壁が 受ける 力 [N]',FG.x+20,FG.y-FG.h-36,{size:24,color:C.F,anchor:'middle',weight:700});
 for(const k of [1,2,3,4])s+=line(gX(k),FG.y-6,gX(k),FG.y+6,{color:C.dim})+label(`${k}.0`,gX(k),FG.y+30,{size:22,color:C.t,anchor:'middle'});
 s+=line(FG.x-6,gY(.4),FG.x+6,gY(.4),{color:C.dim})+label('0.40',FG.x-12,gY(.4)+8,{size:22,color:C.F,anchor:'end'});
 for(const c of [.5,1.5,2.5,3.5])if(c<=upto){const w=.04;s+=poly([[gX(c-w),FG.y],[gX(c),gY(1.55)],[gX(c+w),FG.y]],{fill:C.F,fo:.8,stroke:C.F,sw:1.5});}
 if(area)s+=fade(area,label('面積 0.40 N·s',gX(.5)+18,gY(1.45),{size:24,color:C.hi,weight:700}));
 if(avg)s+=fade(avg,rect(gX(0),gY(.4),gX(4)-gX(0),FG.y-gY(.4),{fill:C.hi,fo:.16,stroke:C.hi,sw:2.5,rx:0})+line(gX(1),gY(.4),gX(1),FG.y,{color:C.hi,w:1.5,dash:'5 5'})+line(gX(2),gY(.4),gX(2),FG.y,{color:C.hi,w:1.5,dash:'5 5'})+line(gX(3),gY(.4),gX(3),FG.y,{color:C.hi,w:1.5,dash:'5 5'}));
 return fade(g,s);
}
// momentum arrow (pink) with label
const PAr=(x,y,X,{text='',g=1}={})=>fade(g,arrow(x,y,X,y,{color:MC,w:7,head:20})+(text?label(text,(x+X)/2,y-18,{size:26,color:MC,anchor:'middle',weight:700}):''));
// rectangular box 2×3×6 (oblique) with floor diagonal and space diagonal
function pbox(p,{x=170,y=400,k=50}={}){
 const a=2*k,b=3*k*.55,c=6*k*.62; // x along right, y into page (oblique), z up
 const P=(i,j,l)=>[x+i*a+j*b*.8,y-l*c-j*b*.6];
 const E=[[[0,0,0],[1,0,0]],[[0,0,0],[0,1,0]],[[1,0,0],[1,1,0]],[[0,1,0],[1,1,0]],[[0,0,1],[1,0,1]],[[0,0,1],[0,1,1]],[[1,0,1],[1,1,1]],[[0,1,1],[1,1,1]],[[0,0,0],[0,0,1]],[[1,0,0],[1,0,1]],[[0,1,0],[0,1,1]],[[1,1,0],[1,1,1]]];
 let s=E.map(([u,v])=>{const [x1,y1]=P(...u),[x2,y2]=P(...v);return line(x1,y1,x2,y2,{color:C.faint,w:2});}).join('');
 const O=P(0,0,0),A=P(1,0,0),B=P(1,1,0),T=P(1,1,1);
 s+=fade(seg(p,.05,.2),line(O[0],O[1],A[0],A[1],{color:C.v,w:5})+label('2',(O[0]+A[0])/2,O[1]+32,{size:26,color:C.v,anchor:'middle',weight:700}));
 s+=fade(seg(p,.1,.25),line(A[0],A[1],B[0],B[1],{color:C.v,w:5})+label('3',(A[0]+B[0])/2+18,(A[1]+B[1])/2+22,{size:26,color:C.v,weight:700}));
 s+=fade(seg(p,.15,.3),line(B[0],B[1],T[0],T[1],{color:C.v,w:5})+label('6',B[0]+16,(B[1]+T[1])/2,{size:26,color:C.v,weight:700}));
 s+=fade(seg(p,.35,.5),line(O[0],O[1],B[0],B[1],{color:C.hi,w:3,dash:'8 6'}));
 s+=fade(seg(p,.55,.7),arrow(O[0],O[1],T[0],T[1],{color:C.v,w:6,head:18})+label('7',(O[0]+T[0])/2-24,(O[1]+T[1])/2,{size:30,color:C.hi,anchor:'end',weight:700}));
 return s;
}

export const hsTIdeal2Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=gasBox({x:330,y:50,w:540,h:300,n:18,dist:220*t,seed:2,hit:1,wallR:C.dim});
  s+=card(250,380,700,100,label('分子が 壁を 叩く → 圧力',600,442,{size:34,color:PC,anchor:'middle',weight:700}),seg(p,.2,.4),PC);
  return s;
 },
 [K+'q2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.3,gasBox({x:330,y:50,w:540,h:300,n:18,dist:220*t,seed:2,hit:1}));
  s+=Q2('分子 1個の 質量と 速さから','圧力を 計算 できる？',{g:seg(p,.05,.25)});
  return s;
 },
 [K+'plan']:(p)=>{
  const items=[['衝突 1回','運動量と 力積'],['分子 1個の 平均の 力','時間で 割る'],['圧力','面積で 割る・N 個 足す']];
  let s='';items.forEach(([a,b],i)=>{const y=70+i*140,g=seg(p,.05+.2*i,.2+.2*i);
   s+=card(260,y,420,100,label(a,470,y+62,{size:32,color:i===2?PC:C.ink,anchor:'middle',weight:700}),g,i===2?PC:C.dim);
   s+=fade(g,label(b,720,y+62,{size:28,color:C.hi,weight:700}));
   if(i<2)s+=fade(seg(p,.15+.2*i,.25+.2*i),arrow(470,y+104,470,y+136,{color:C.hi,w:4,head:12}));});
  return s;
 },
 // ================= S2 モデル =================
 [K+'box']:(p)=>{
  let s=cube3(300,170,260,{mol:1});
  s+=fade(seg(p,.3,.5),label('質量 m の 分子が N 個',920,200,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.05,.2),label('一辺 L の 立方体',920,140,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'a1']:(p)=>{
  let s=fade(.5,cube3(120,200,220,{}));
  s+=card(520,60,620,110,tag('仮定 1',620,125,{color:C.hi,size:26})+label('分子は 大きさの ない 点',880,128,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.25,.4),C.hi);
  return s;
 },
 [K+'a2']:(p)=>{
  let s=fade(.5,cube3(120,200,220,{}));
  s+=card(520,60,620,110,tag('仮定 1',620,125,{color:C.hi,size:26})+label('分子は 大きさの ない 点',880,128,{size:30,color:C.ink,anchor:'middle',weight:700}),1,C.hi);
  s+=card(520,190,620,110,tag('仮定 2',620,255,{color:C.hi,size:26})+label('壁で 速さを 変えずに はね返る',910,258,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=card(520,320,620,110,tag('仮定 3',620,385,{color:C.hi,size:26})+label('分子どうしの 衝突は 無視',880,388,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'model']:(p)=>{
  let s=fade(.35,cube3(120,200,220,{}));
  s+=card(450,110,680,250,label('理想気体の モデル',790,180,{size:36,color:C.hi,anchor:'middle',weight:700})+fade(seg(p,.4,.55),label('前回：大きさ・引き合う 力を 無視',790,260,{size:28,color:C.ink,anchor:'middle',weight:700})+label('と 同じ 考え',790,310,{size:28,color:C.ink,anchor:'middle',weight:700})),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'focus']:(p)=>{
  let s=cube3(250,190,260,{wall:seg(p,.05,.25),vx:seg(p,.3,.45),comp:seg(p,.55,.75)});
  s+=fade(seg(p,.1,.25),label('右の 壁',740,120,{size:30,color:C.hi,weight:700}));
  s+=fade(seg(p,.6,.75),label('壁に 垂直な 成分',820,330,{size:28,color:C.v,anchor:'middle',weight:700})+T3(`${VX}`,820,385,{size:44}));
  return s;
 },
 [K+'comp']:(p)=>{
  const k=seg(p,.2,.6),x0=520,y0=260;
  let s=line(700,90,700,430,{color:C.hi,w:6})+label('右の 壁',700,470,{size:28,color:C.hi,anchor:'middle',weight:700});
  // before (approaching) and after (leaving)
  s+=fade(1-k*.6,dot(x0,y0+60,14,MOL)+arrow(x0,y0+60,x0+150,y0-20,{color:C.v,w:5,head:16}));
  s+=fade(k,dot(x0+170,y0-30,14,MOL)+arrow(x0+170,y0-30,x0+20,y0-110,{color:C.v,w:5,head:16}));
  s+=card(780,110,380,280,label('x 成分：向きが 逆',970,180,{size:28,color:C.v,anchor:'middle',weight:700})+T3(`${VX}\\ \\to\\ -${VX}`,970,240,{size:40})+fade(seg(p,.5,.65),label('y・z 成分：そのまま',970,320,{size:28,color:C.ink,anchor:'middle',weight:700})),seg(p,.05,.2),C.v);
  return s;
 },
 // ================= S3 大きな球で練習 =================
 [K+'ball']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=ballBox(t,{g:1});
  s+=card(820,140,320,170,label('0.10 kg',980,200,{size:32,color:C.ink,anchor:'middle',weight:700})+label('2.0 m/s',980,265,{size:32,color:C.v,anchor:'middle',weight:700}),seg(p,.2,.4),C.dim);
  return s;
 },
 [K+'pbefore']:(p)=>{
  let s=ballBox(0.4,{showV:0,hit:0,len:''});
  s+=FA(820,110,930,110,{color:C.hi,w:4,head:14,g:seg(p,.05,.2)})+fade(seg(p,.05,.2),label('＋',800,118,{size:30,color:C.hi,anchor:'end',weight:700}));
  s+=PAr(ballX(.4)-30,120,ballX(.4)+120,{text:'',g:seg(p,.3,.45)});
  s+=card(780,170,380,150,label('当たる 前',970,220,{size:28,color:C.ink,anchor:'middle',weight:700})+T3('0.10\\times2.0=+0.20',970,280,{size:34}),seg(p,.3,.5),MC);
  s+=fade(seg(p,.55,.7),label('kg·m/s',970,360,{size:26,color:MC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'pafter']:(p)=>{
  let s=ballBox(0.6,{showV:0,hit:0,len:''});
  s+=PAr(ballX(.6)+30,120,ballX(.6)-120,{g:seg(p,.05,.2)});
  s+=card(780,70,380,110,label('はね返った 後',970,110,{size:26,color:C.ink,anchor:'middle',weight:700})+T3('-0.20',970,158,{size:36,color:MC}),seg(p,.05,.2),MC);
  s+=card(150,370,620,130,label('運動量の 変化（後 − 前）',460,410,{size:26,color:C.ink,anchor:'middle',weight:700})+T3('-0.20-0.20=-0.40',460,470,{size:40}),seg(p,.4,.6),C.hi);
  s+=fade(seg(p,.7,.85),label('kg·m/s',870,450,{size:26,color:MC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'wall']:(p)=>{
  let s=ballBox(0.5,{showV:0,hit:1,len:''});
  s+=FA(ballX(.5)+10,130,ballX(.5)-110,130,{color:C.F,w:7,head:20,g:seg(p,.05,.2)})+fade(seg(p,.05,.2),label('−0.40 N·s',ballX(.5)-60,110,{size:26,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),FA(BB.x1+4,130,BB.x1+124,130,{color:C.F,w:7,head:20})+label('＋0.40 N·s',BB.x1+70,110,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=card(820,200,340,150,label('球 → 壁',990,250,{size:28,color:C.ink,anchor:'middle',weight:700})+label('作用・反作用',990,310,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'time']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=ballBox(t,{len:'1.0 m'});
  s+=fade(seg(p,.05,.2),label('往復 2.0 m',450,140,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=card(820,120,340,200,T3('\\dfrac{2.0}{2.0}=1.0\\ \\mathrm{s}',990,215,{size:44,color:C.t}),seg(p,.4,.6),C.t);
  s+=fade(seg(p,.65,.8),label('1.0 秒 ごとに 当たる',990,370,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'spikes']:(p)=>{
  let s=ftGraph(p,{upto:4.4*seg(p,.05,.5)+.1,area:seg(p,.55,.7)});
  return s;
 },
 [K+'avg']:(p)=>{
  let s=ftGraph(p,{upto:5,area:1,avg:seg(p,.1,.35)});
  s+=card(720,30,420,130,T3('\\dfrac{0.40}{1.0}=0.40\\ \\mathrm{N}',930,105,{size:40,color:C.F}),seg(p,.55,.75),C.F);
  return s;
 },
 // ================= S4 分子1個の力 =================
 [K+'mol']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=ballBox(t,{mol:1,len:'L'});
  s+=card(820,140,320,170,T3('m',980,200,{size:40})+T3(VX,980,265,{size:40}),seg(p,.2,.4),C.dim);
  s+=fade(seg(p,.05,.2),label('球 → 分子',450,140,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'dp']:(p)=>{
  let s=card(120,60,440,110,label('前',200,128,{size:28,color:C.ink,anchor:'middle',weight:700})+T3(`+${MVX}`,400,118,{size:44,color:MC}),seg(p,.02,.15),MC);
  s+=card(640,60,440,110,label('後',720,128,{size:28,color:C.ink,anchor:'middle',weight:700})+T3(`-${MVX}`,920,118,{size:44,color:MC}),seg(p,.25,.4),MC);
  s+=card(200,230,800,150,label('変化',300,318,{size:28,color:C.ink,anchor:'middle',weight:700})+T3(`(-${MVX})-(+${MVX})=-2${MVX}`,640,305,{size:46}),seg(p,.55,.75),C.hi);
  return s;
 },
 [K+'imp']:(p)=>{
  let s=card(250,60,700,140,label('壁が 受ける 力積',600,105,{size:28,color:C.ink,anchor:'middle',weight:700})+T3(`+2${MVX}`,600,165,{size:52,color:C.F}),seg(p,.02,.2),C.F);
  s+=card(250,260,700,140,T3(`\\cancel{${MVX}}`,420,330,{size:46})+label('はね返る ので 2倍',720,343,{size:32,color:C.a,anchor:'middle',weight:700}),seg(p,.45,.65),C.a);
  return s;
 },
 [K+'t']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=ballBox(t,{mol:1,len:'L'});
  s+=fade(seg(p,.05,.2),label('往復 2L',450,140,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=card(820,120,340,200,T3(`\\dfrac{2L}{${VX}}`,990,215,{size:56,color:C.t}),seg(p,.35,.55),C.t);
  s+=fade(seg(p,.6,.75),label('距離 ÷ 速さ',990,370,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'f1']:(p)=>{
  let s=fade(seg(p,.02,.15),label('平均の 力 ＝ 力積 ÷ 時間',600,80,{size:32,color:C.hi,anchor:'middle',weight:700}));
  s+=card(250,150,700,200,T3(`\\overline{F}=2${MVX}\\div\\dfrac{2L}{${VX}}`,600,255,{size:56}),seg(p,.3,.5),C.F);
  s+=fade(seg(p,.6,.75),label('F の 上の 線：時間で ならした 平均',600,420,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'f2']:(p)=>stepX(p,`\\overline{F}=2${MVX}\\div\\dfrac{2L}{${VX}}`,`\\overline{F}=2${MVX}\\times\\dfrac{${VX}}{2L}`,'÷ 分数 ＝ × 逆数',{size:56}),
 [K+'f3']:(p)=>{
  const k=seg(p,.05,.3);
  let s=fade(.6,T3(`\\overline{F}=2${MVX}\\times\\dfrac{${VX}}{2L}`,600,90,{size:40}));
  s+=card(250,150,700,175,fade(1-k,T3(`\\overline{F}=\\dfrac{2m${VX}${VX}}{2L}`,600,250,{size:52}))+fade(k,T3(`\\overline{F}=\\dfrac{{\\color{#ff8f9b}\\cancel{\\color{#edf4ff}2}}m${VX}${VX}}{{\\color{#ff8f9b}\\cancel{\\color{#edf4ff}2}}L}`,600,250,{size:52})),seg(p,.02,.15),C.dim);
  s+=card(350,350,500,150,T3(`\\overline{F}=${FAVG}`,600,432,{size:54}),seg(p,.55,.75),C.F);
  return s;
 },
 [K+'chk']:(p)=>{
  let s=fade(.6,T3(`\\overline{F}=${FAVG}`,600,85,{size:44}));
  s+=card(200,170,800,150,T3('\\dfrac{0.10\\times2.0^2}{1.0}=0.40\\ \\mathrm{N}',600,250,{size:50}),seg(p,.1,.3),C.F);
  s+=fade(seg(p,.6,.75),label('力積 ÷ 時間 の 0.40 N と 一致',600,410,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'map']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=card(80,60,500,170,label('対応する',330,110,{size:28,color:C.F,anchor:'middle',weight:700})+label('球 ＝ 分子 1個の 衝突',330,180,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.02,.15),C.F);
  s+=card(620,60,500,170,label('違う',870,110,{size:28,color:C.a,anchor:'middle',weight:700})+label('分子は けた違いに 多い',870,180,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.45,.6),C.a);
  s+=fade(seg(p,.5,.65),gasBox({x:620,y:260,w:500,h:220,n:60,dist:200*t,seed:5,r:5,hit:1}));
  return s;
 },
 [K+'map2']:(p)=>{
  let s=ftGraph(1,{upto:5});
  const x0=FG.x,y0=FG.y;let q='';
  for(let i=0;i<160;i++){const tt=(i+.5)*4.4/160*1.0;const h=60+50*((i*37)%11)/11;q+=line(x0+FG.w*tt/4.4,y0,x0+FG.w*tt/4.4,y0-h,{color:C.F,w:2.5,opacity:.8});}
  s=fade(1-seg(p,.05,.3),s)+fade(seg(p,.05,.3),ftAxesOnly()+q);
  s+=fade(seg(p,.45,.6),line(FG.x,FG.y-85,FG.x+FG.w,FG.y-85,{color:C.hi,w:5})+label('ほぼ 一定の 力',FG.x+FG.w-10,FG.y-110,{size:28,color:C.hi,anchor:'end',weight:700}));
  return s;
 },
 // ================= S5 全分子と3方向 =================
 [K+'area']:(p)=>{
  let s=cube3(150,190,220,{wall:1,lab:1,mol:0});
  s+=fade(seg(p,.05,.2),label('面積 L²',520,140,{size:28,color:C.hi,weight:700}));
  s+=card(600,150,560,215,T3(`\\dfrac{${FAVG}}{L^2}=\\dfrac{m${VX2}}{L^3}`,880,268,{size:46}),seg(p,.3,.5),PC);
  s+=fade(seg(p,.6,.75),label('圧力 ＝ 力 ÷ 面積',880,410,{size:28,color:PC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'vol']:(p)=>{
  let s=fade(.6,T3(`\\dfrac{m${VX2}}{L^3}`,600,90,{size:44}));
  s+=fade(seg(p,.05,.2),label('L³ ＝ 体積 V',600,190,{size:32,color:VC,anchor:'middle',weight:700}));
  s+=card(300,230,600,190,T3(`\\dfrac{m${VX2}}{${Vt}}`,600,340,{size:58}),seg(p,.3,.5),PC);
  s+=fade(seg(p,.6,.75),label('分子 1個 ぶんの 圧力',600,460,{size:28,color:PC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sum']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=gasBox({x:80,y:60,w:420,h:300,n:16,dist:200*t,seed:7,hit:1});
  s+=fade(seg(p,.05,.2),label('vₓ は 分子ごとに 違う',290,410,{size:28,color:C.v,anchor:'middle',weight:700}));
  s+=card(560,80,580,140,T3(`{v_{x1}}^2+{v_{x2}}^2+\\cdots`,850,150,{size:42,color:C.v}),seg(p,.25,.4),C.v);
  s+=card(560,260,580,140,T3(`=N\\times${AVX}`,850,330,{size:50}),seg(p,.55,.75),C.hi);
  s+=fade(seg(p,.75,.9),label('合計 ＝ 個数 × 平均',850,450,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sumf']:(p)=>{
  let s=fade(.6,T3(`\\dfrac{m${VX2}}{${Vt}}`,600,80,{size:40}));
  s+=fade(seg(p,.05,.2),label('N 個 ぶんを 足す',600,170,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=card(250,210,700,200,T3(`${Pt}=\\dfrac{Nm${AVX}}{${Vt}}`,600,325,{size:58}),seg(p,.25,.45),PC);
  s+=fade(seg(p,.6,.75),label('上の 線：平均',600,450,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'avgdiff']:(p)=>{
  let s=card(100,90,460,190,label('v² の 平均',330,150,{size:32,color:C.ink,anchor:'middle',weight:700})+T3(AV2,330,225,{size:56}),seg(p,.05,.2),C.hi);
  s+=card(640,90,460,190,label('平均の 速さの 2乗',870,150,{size:32,color:C.ink,anchor:'middle',weight:700})+T3(`(\\overline{${VV}})^2`,870,225,{size:56}),seg(p,.3,.45),C.dim);
  s+=fade(seg(p,.55,.7),label('≠',600,200,{size:60,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'avgex']:(p)=>{
  let s=fade(seg(p,.02,.15),dot(200,120,14,MOL)+label('速さ 1',260,128,{size:28,color:C.v,weight:700})+dot(200,190,14,MOL)+label('速さ 3',260,198,{size:28,color:C.v,weight:700}));
  s+=card(420,70,700,130,label('2乗の 平均',540,145,{size:28,color:C.ink,anchor:'middle',weight:700})+T3('(1+9)\\div2=5',850,135,{size:44}),seg(p,.15,.35),C.hi);
  s+=card(420,240,700,130,label('平均の 2乗',540,315,{size:28,color:C.ink,anchor:'middle',weight:700})+T3('2^2=4',850,305,{size:44}),seg(p,.55,.75),C.dim);
  s+=fade(seg(p,.8,.9),label('別の 数',770,430,{size:32,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'pyth']:(p)=>{
  let s=pbox(seg(p,0,1)>.0?Math.max(seg(p,.0,.6),.0):0,{});
  s+=card(640,150,520,170,T3(`${VV}^2=${VX}^2+${VY}^2+${VZ}^2`,900,235,{size:42}),seg(p,.6,.8),C.v);
  s+=fade(seg(p,.25,.4),label('三平方を 2回',900,380,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ex']:(p)=>{
  let s=pbox(1,{});
  s+=card(640,90,520,280,T3(`${VV}^2=2^2+3^2+6^2`,900,160,{size:40})+fade(seg(p,.25,.4),T3('=4+9+36=49',900,230,{size:40}))+fade(seg(p,.55,.7),T3(`${VV}=7\\ \\mathrm{m/s}`,900,305,{size:44})),seg(p,.05,.2),C.v);
  return s;
 },
 [K+'iso']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.5,gasBox({x:80,y:60,w:420,h:330,n:20,dist:200*t,seed:8}));
  s+=card(560,80,580,300,label('どの 向きも 同じ ように 飛ぶ',850,140,{size:30,color:C.ink,anchor:'middle',weight:700})+fade(seg(p,.4,.6),T3(`${AVX}=\\overline{${VY}^2}=\\overline{${VZ}^2}`,850,250,{size:46})),seg(p,.05,.2),C.hi);
  s+=tag('仮定',850,345,{color:C.hi,g:seg(p,.05,.2),size:26});
  return s;
 },
 [K+'third']:(p)=>{
  let s=fade(.6,T3(`${AV2}=${AVX}+\\overline{${VY}^2}+\\overline{${VZ}^2}`,600,90,{size:40}));
  s+=fade(seg(p,.05,.2),label('3つが 等しい → 3等分',600,180,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=card(300,230,600,170,T3(`${AVX}=\\dfrac{1}{3}${AV2}`,600,315,{size:60}),seg(p,.3,.5),C.v);
  return s;
 },
 [K+'subst']:(p)=>{
  let s=fade(.6,T3(`${AVX}=\\dfrac{1}{3}${AV2}`,850,80,{size:36}));
  s+=fade(.6,T3(`${Pt}=\\dfrac{Nm${AVX}}{${Vt}}`,350,80,{size:36}));
  s+=fade(seg(p,.1,.25),arrow(600,150,600,200,{color:C.hi,w:4,head:14})+label('代入',650,185,{size:28,color:C.hi,weight:700}));
  s+=card(250,220,700,200,T3(`${Pt}=\\dfrac{\\frac{1}{3}Nm${AV2}}{${Vt}}`,600,335,{size:54}),seg(p,.3,.5),PC);
  return s;
 },
 [K+'mulV']:(p)=>{
  let s=stepX(p,`${Pt}=\\dfrac{\\frac{1}{3}Nm${AV2}}{${Vt}}`,PVK,'両辺 × V',{size:58,col:VC});
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p)=>{
  let s=card(200,60,800,200,T3(PVK,600,182,{size:62}),seg(p,.02,.2),C.hi);
  s+=fade(seg(p,.4,.55),label('m：分子 1個の 質量',380,330,{size:30,color:C.ink,anchor:'middle',weight:700})+label('v² の 平均：速さの 2乗の 平均',800,330,{size:30,color:C.v,anchor:'middle',weight:700}));
  s+=tag('モデルから 導いた 結果',600,430,{g:seg(p,.6,.75),size:28});
  return s;
 },
 [K+'mean']:(p)=>{
  let s=card(200,60,800,200,T3(PVK,600,182,{size:62}),1,C.hi);
  const items=['分子が 多い','重い','速い'];
  items.forEach((a,i)=>{s+=fade(seg(p,.1+.15*i,.25+.15*i),label(a,300+i*300,340,{size:34,color:C.ink,anchor:'middle',weight:700}));});
  s+=fade(seg(p,.6,.75),label('→ PV が 大きい',600,440,{size:36,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next']:(p)=>{
  let s=card(200,40,800,170,T3(PVK,600,138,{size:54}),seg(p,.02,.2),C.dim);
  s+=card(200,240,800,150,T2(IDEAL,600,325,{size:54}),seg(p,.3,.5),C.dim);
  const w1=texWidth(PVK,54,false),w2=texWidth(IDEAL,54,false),wp=texWidth(`${Pt}${Vt}`,54,false);
  s+=fade(seg(p,.6,.8),rect(600-w1/2-8,70,wp+12,100,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:10})+rect(600-w2/2-8,270,wp+12,95,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:10})+label('同じ PV',1090,230,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next2']:(p)=>{
  let s=fade(.3,card(200,40,800,170,T3(PVK,600,138,{size:54}),1,C.dim)+card(200,240,800,150,T2(IDEAL,600,325,{size:54}),1,C.dim));
  s+=card(250,150,700,170,label('並べると、温度 T の 正体が',600,215,{size:32,color:C.ink,anchor:'middle',weight:700})+label('分かる？',600,285,{size:42,color:TC,anchor:'middle',weight:700}),seg(p,.05,.25),TC);
  return s;
 },
 [K+'bye']:(p)=>card(200,170,800,150,label('次の 動画：温度は 分子 1個の 何を 表す？',600,260,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
// axes only (for the dense-spike picture)
function ftAxesOnly(){
 let s=arrow(FG.x-10,FG.y,FG.x+FG.w+30,FG.y,{color:C.dim,w:2.5,head:14})+arrow(FG.x,FG.y+10,FG.x,FG.y-FG.h-24,{color:C.dim,w:2.5,head:14});
 s+=label('時間',FG.x+FG.w+20,FG.y+44,{size:24,color:C.t,anchor:'middle',weight:700})+label('壁が 受ける 力',FG.x+20,FG.y-FG.h-36,{size:24,color:C.F,anchor:'middle',weight:700});
 return s;
}

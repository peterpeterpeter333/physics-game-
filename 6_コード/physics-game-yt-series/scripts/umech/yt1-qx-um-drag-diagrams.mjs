// 問題編 解説「終端速度との差は、何秒で縮む？」（q-um-drag、大学編 11 空気抵抗・中級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/11_空気抵抗.md の q-um-drag（解説 20 行）。
// 色：速度 v 紫、加速度 a 赤、力 緑、時間 t・τ 金、終端速度の線・強調 黄、差 w は薄い黄の塗り（正本の指定）。札は yt1-qx-common.mjs。
// 数値：v＝30(1−e^(−t/3))、w＝30e^(−t/3)。一歩の式 w_n＝30(1−Δt/3)^n。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,poly} from './anim.mjs';
import {QC,card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,cueT,sentWin} from './yt1-qx-common.mjs';

const K='qx-um-drag:';
const CF=QC.F,CV=QC.v,CA=QC.a,CT=QC.t,CH=QC.hi,CW='#f2e29b',CD='#ff6b6b';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const G1='w が満たす式',G2='t＝3.0 s の速度 v',G3='一歩ごとの倍率';
const ANS1=g=>answerTag(1,'C',{tex:'dw/dt=-w/3'},{g}),ANS2=g=>answerTag(2,'C','約 19 m/s',{g}),ANS3=g=>answerTag(3,'A','0.9 倍',{g});
const WOPT={size:26,whySize:24};
const vex=t=>30*(1-Math.exp(-t/3)),wex=t=>30*Math.exp(-t/3);
const wc=s=>`{\\color{${CW}}${s}}`,vc=s=>`{\\color{${CV}}${s}}`,tc=s=>`{\\color{${CT}}${s}}`;
const W=wc('w'),TAU=tc('\\tau');
const EOM='m\\dfrac{dv}{dt}=mg-kv';

// ---- 球と矢印（重力 6 N を 100 px） ----
function ball({x=170,y=300,g=1}={}){
 let s=ring(x,y,34,{color:C.dim,w:3,fill:'#2b3d63'});
 s+=arrow(x,y+34,x,y+134,{color:CF,w:6,head:16})+label('mg',x+16,y+128,{size:26,color:CF,weight:700});
 s+=arrow(x,y-34,x,y-84,{color:CF,w:6,head:16})+label('kv',x+16,y-62,{size:26,color:CF,weight:700});
 s+=label('m ＝ 0.6 kg',x+50,y+8,{size:24,color:C.ink,weight:700});
 return fade(g,s);
}
const plusDown=(g=1)=>fade(g,arrow(55,110,55,200,{color:CH,w:4,head:14})+label('＋',72,170,{size:28,color:CH,weight:700})+label('下向きが正',55,232,{size:22,color:CH,anchor:'middle',weight:700}));
const givens=(g=1)=>fade(g,label('g ＝ 10 m/s²、k ＝ 0.2 kg/s',20,470,{size:24,color:C.ink,weight:700})+label('e の −1 乗 ＝ 0.37',20,505,{size:24,color:C.ink,weight:700}));
const eqCard=(g1=1,g2=1)=>card(400,90,420,270,fade(g1,kindTag('前提（モデル）',610,124,{color:C.dim,size:22})+T(EOM,610,200,34))
 +fade(g2,kindTag('定義',610,268,{size:22})+T(`${W}=v_\\infty-v`,610,322,34)),Math.max(g1,g2>0?1:0));
// v–t / w–t グラフ（目盛りの文字は 22px）
function gr({x=850,y=450,w=260,h=310,xmax=9,ymax=35,xt=[3,6,9],yt=[10,20,30],g=1,yl='v [m/s]',ycol=CV}={}){
 const X=u=>x+w*u/xmax,Y=v=>y-h*v/ymax;
 let s=arrow(x-8,y,x+w+22,y,{color:C.dim,w:2.5,head:14})+arrow(x,y+8,x,y-h-22,{color:C.dim,w:2.5,head:14});
 for(const u of xt)s+=line(X(u),y-6,X(u),y+6,{color:C.dim})+label(String(u),X(u),y+32,{size:22,color:C.dim,anchor:'middle'});
 for(const v of yt)s+=line(x-6,Y(v),x+6,Y(v),{color:C.dim})+label(String(v),x-12,Y(v)+8,{size:22,color:C.dim,anchor:'end'});
 s+=label('t [s]',x+w+26,y+8,{size:24,color:CT})+label(yl,x,y-h-32,{size:24,color:ycol,anchor:'middle'});
 const plot=(fn,{from=0,to=xmax,p=1,color=CV,w:ww=4,dash=''}={})=>draw(Array.from({length:121},(_,i)=>{const u=from+(to-from)*i/120;return [X(u),Y(fn(u))];}),p,{color,w:ww,dash});
 return {svg:fade(g,s),X,Y,plot};
}
const vline=(A,g=1,to=9,txt='v∞ ＝ 30')=>fade(g,line(A.X(0),A.Y(30),A.X(to),A.Y(30),{color:CH,w:3,dash:'10 7'})+(txt?label(txt,A.X(to),A.Y(30)-12,{size:24,color:CH,anchor:'end',weight:700}):''));
function gapFill(A,to=9,g=1){const n=60,top=[],bot=[];for(let i=0;i<=n;i++){const t=to*i/n;top.push([A.X(t),A.Y(30)]);bot.push([A.X(t),A.Y(vex(t))]);}return fade(g,poly([...top,...bot.reverse()],{fill:CW,fo:.28}));}
// 小問2 の大きいグラフ
const BIG={x:110,y:450,w:600,h:330};
// 小問3 の棒（w の高さ。1 m/s ＝ 10 px）
function wbars({n=3,dt=.3,x0=170,gap=200,base=455,shrink=[0,0,0],lab=1,g=1,k=10}={}){
 let s='';const r=1-dt/3;
 for(let i=0;i<n;i++){const x=x0+i*gap,h=30*Math.pow(r,i),H=h*k;
  if(i>0){const hp=30*Math.pow(r,i-1)*k;s+=fade(shrink[i],rect(x-35,base-hp,70,hp-H,{fill:CD,fo:.45,stroke:CD,sw:2,rx:3}));}
  s+=rect(x-35,base-H,70,H,{fill:CW,fo:.35,stroke:CW,sw:2.5,rx:3});
  if(lab){s+=label(String(Math.round(h*10)/10),x,base-H-12,{size:26,color:CW,anchor:'middle',weight:700})+label(`${(i*dt).toFixed(1)} s`,x,base+30,{size:22,color:CT,anchor:'middle'});}
  if(i>0&&lab)s+=fade(shrink[i],label('× 0.9',x-gap/2,base-H-60,{size:26,color:CH,anchor:'middle',weight:700}));
 }
 return fade(g,line(x0-70,base,x0+(n-1)*gap+70,base,{color:C.dim,w:2})+s);
}

export const ytQxUmDragDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（約5秒）：0〜2 s 小球に重力と抵抗 kv（短め）の矢印、隅に g・k・e の −1 乗。2〜4 s 運動方程式（前提（モデル））と w の定義（定義）。4〜5 s 目盛りだけの v–t グラフ。静止。
 [K+'q1']:(p)=>plusDown(seg(p,0,.15))+ball({g:seg(p,.03,.25)})+givens(seg(p,.15,.35))+eqCard(seg(p,.4,.55),seg(p,.58,.75))+gr({g:seg(p,.8,.95)}).svg,

 // ===================== 小問1 =====================
 // 1. 出題中の図と式。札「求めるもの：w が満たす式」
 [K+'goal1']:(p)=>plusDown()+ball()+givens()+eqCard()+gr().svg+goalTag(G1,{g:seg(p,.03,.15)}),
 // 2. 右の辺 mg−kv を黄で囲み「＝0」。v∞＝mg/k＝6÷0.2＝30。v–t グラフに v∞＝30 の水平線
 [K+'vinf']:(p)=>{
  const sz=44,wL=texWidth('m\\dfrac{dv}{dt}=',sz,false),wR=texWidth('mg-kv',sz,false),wA=wL+wR,x0=330-wA/2;
  let s=card(30,90,600,410,'',1);
  s+=T(EOM,330,180,sz)+highlight(x0+wL-6,142,wR+12,70,seg(p,.08,.18));
  s+=fade(seg(p,.15,.25),label('＝ 0',x0+wA+16,192,{size:34,color:CH,weight:700}));
  s+=fade(seg(p,.3,.4),T('v_\\infty=\\dfrac{mg}{k}',330,290,40));
  s+=fade(seg(p,.45,.55),T('=6\\div0.2=30\\ \\mathrm{m/s}',330,400,40,{color:CH}));
  const A=gr({x:760,w:360});
  s+=A.svg+vline(A,seg(p,.6,.7),9,'v∞ ＝ 30 m/s');
  return s+goalTag(G1);
 },
 // 3. 札「τ＝m/k＝3 s」（金）。単位の kg が約分で消え s が残る
 [K+'tau']:(p,ctx)=>{
  const W2=sentWin(ctx),b=W2[1]?W2[1][0]:.4,cn=seg(p,b+.15,b+.25);
  let s=card(330,92,540,110,T(`${TAU}=\\dfrac{m}{k}`,520,147,40)+fade(seg(p,b+.45,b+.55),T('=3\\ \\mathrm{s}',720,147,40,{color:CT})),1,CT);
  s+=fade(seg(p,b,b+.08),label('単位',300,330,{size:26,color:C.dim,anchor:'middle'}));
  const KG=cn>.5?`{\\color{${CA}}\\cancel{\\color{${C.ink}}\\mathrm{kg}}}`:'\\mathrm{kg}';
  s+=fade(seg(p,b,b+.08),T(`\\dfrac{${KG}}{${KG}/\\mathrm{s}}`,520,330,48));
  s+=fade(seg(p,b+.25,b+.32),T('=\\mathrm{s}',720,330,48,{color:CT}));
  s+=fade(seg(p,b+.4,b+.5),T('0.6\\div0.2=3',600,450,40));
  return s+goalTag(G1);
 },
 // 4. 両辺を m で割る → dv/dt＝g−(k/m)v。文2で g を光らせ (k/m)v∞ に置きかえる
 [K+'divide']:(p,ctx)=>{
  const W2=sentWin(ctx),b=W2[1]?W2[1][0]:.45,sz=40;
  let s=T(EOM,600,130,36,{opacity:.7});
  s+=fade(seg(p,.05,.15),label('両辺を m で 割る',880,212,{size:24,color:C.dim})+arrow(600,165,600,200,{color:C.dim,w:3,head:12}));
  const e2='\\dfrac{dv}{dt}=g-\\dfrac{k}{m}v',wA=texWidth(e2,sz,false),wg=texWidth('\\dfrac{dv}{dt}=',sz,false),wG=texWidth('g',sz,false),x0=600-wA/2;
  s+=fade(seg(p,.12,.25),T(e2,600,260,sz));
  s+=highlight(x0+wg-6,232,wG+12,56,seg(p,b,b+.08));
  s+=fade(seg(p,b+.05,b+.15),card(40,320,520,185,T('v_\\infty=\\dfrac{mg}{k}',300,368,32)+T('\\to\\ g=\\dfrac{k}{m}\\,v_\\infty',300,455,32,{color:CH}),1,CH));
  s+=fade(seg(p,b+.3,b+.4),T('\\dfrac{dv}{dt}={\\color{'+CH+'}\\dfrac{k}{m}v_\\infty}-\\dfrac{k}{m}v',880,410,sz));
  return s+goalTag(G1);
 },
 // 5. k/m をくくり出す → (k/m)(v∞−v)＝w/3。かっこの中を w の色で囲む。k/m＝1/3
 [K+'factor']:(p,ctx)=>{
  const W2=sentWin(ctx),b=W2[1]?W2[1][0]:.6,sz=42;
  let s=T('\\dfrac{dv}{dt}=\\dfrac{k}{m}v_\\infty-\\dfrac{k}{m}v',600,130,36,{opacity:.7});
  const e='\\dfrac{dv}{dt}=\\dfrac{k}{m}\\left(v_\\infty-v\\right)',wA=texWidth(e,sz,false),wP=texWidth('\\left(v_\\infty-v\\right)',sz,false),x0=600-wA/2;
  s+=fade(seg(p,.08,.2),T(e,600,250,sz));
  s+=fade(seg(p,.25,.33),rect(x0+wA-wP-4,212,wP+8,76,{fill:CW,fo:.22,stroke:CW,sw:2.5,rx:8})+label('＝ w',x0+wA-wP/2,322,{size:28,color:CW,anchor:'middle',weight:700}));
  s+=fade(seg(p,.38,.48),label('k/m ＝ 1/3',260,410,{size:30,color:C.ink,weight:700,anchor:'middle'}));
  s+=fade(seg(p,.42,.52),T(`=\\dfrac{${W}}{3}`,x0+wA+80,250,sz));
  s+=fade(seg(p,b,b+.08),card(560,370,560,80,label('加速度は 残りの差に 比例',840,420,{size:30,color:CH,anchor:'middle',weight:700}),1,CH));
  return s+goalTag(G1);
 },
 // 6. v の棒（紫）と w の棒（薄い黄）を縦に積み、合計 30 のまま v が伸びると w が同じだけ縮む。符号が変わる所を黄で。答えの札 C
 [K+'ans1']:(p,ctx)=>{
  const W2=sentWin(ctx),b=W2[1]?W2[1][0]:.5,v=mix(6,24,seg(p,.05,.45)),k=11,base=470,x=150;
  let s=rect(x,base-v*k,90,v*k,{fill:CV,fo:.7,stroke:CV,sw:2,rx:3})+rect(x,base-30*k,90,(30-v)*k,{fill:CW,fo:.3,stroke:CW,sw:2,rx:3});
  s+=label('v',x+45,base-v*k/2+10,{size:30,color:C.ink,anchor:'middle',weight:700})+label('w',x+45,base-30*k+(30-v)*k/2+10,{size:30,color:'#0b1122',anchor:'middle',weight:700});
  s+=line(x-20,base-30*k,x+110,base-30*k,{color:CH,w:3,dash:'8 6'})+label('30',x-28,base-30*k+8,{size:24,color:CH,anchor:'end',weight:700});
  s+=label('合計 30 のまま',x+45,base+34,{size:24,color:CH,anchor:'middle',weight:700});
  s+=card(330,92,830,400,'',1);
  s+=T(`\\dfrac{d${W}}{dt}=-\\dfrac{dv}{dt}`,745,180,44);
  const e2=`\\dfrac{d${W}}{dt}={\\color{${CH}}-}\\dfrac{${W}}{3}`;
  s+=fade(seg(p,b,b+.1),label('だから',470,320,{size:26,color:C.dim})+T(e2,745,320,52));
  s+=fade(seg(p,b+.12,b+.2),label('符号が 変わる',745,430,{size:26,color:CH,anchor:'middle',weight:700}));
  const ia=b+(1-b)*.6;
  return s+goalTag(G1)+ANS1(seg(p,ia,ia+.06));
 },
 // 7. 誤答 A（文1）→ B・D（文2を半分ずつ）。A の横に、上へ離れていく点線の曲線と×
 [K+'wrong1']:(p,ctx)=>{
  const W2=sentWin(ctx),e=W2[0][1],s2=W2[1]?W2[1][0]:e,m=s2+(1-s2)*.45,win=[[0,e],[s2,m],[m,1]];
  const inA=seg(p,.01,.05)*(1-seg(p,e-.04,e));
  let s=card(330,90,540,100,T(`\\dfrac{d${W}}{dt}=-\\dfrac{${W}}{3}`,600,140,38),1,CH);
  const A=gr({x:840,y:470,w:280,h:230,xmax:9,ymax:60,xt:[3,6,9],yt:[30],yl:'w',ycol:CW});
  s+=fade(inA,A.svg+A.plot(t=>30*Math.exp(t/3),{to:4.5,color:C.dim,w:3,dash:'6 6'})+A.plot(wex,{color:CW,w:4})
   +label('×',A.X(4.5)+18,A.Y(30*Math.exp(1.5))+10,{size:34,color:CD,weight:700})+label('差が 増え続ける',A.X(4.5),A.Y(55)+70,{size:22,color:C.dim,anchor:'middle'}));
  s+=wrongSeq(p,ctx,[['A','＋w/3','dw/dt＝−dv/dt の負号を落とした'],['B','−3w','τ を 1/3 s と逆にした'],['D','10−w/3','g を (k/m)v∞ にまとめていない']],{win,opts:{...WOPT,x:40,w:760,y:230}});
  return s+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 // 8. v–t グラフの t＝3 に縦の点線（金）
 [K+'goal2']:(p)=>{
  const A=gr(BIG);
  return A.svg+vline(A)+fade(seg(p,.2,.35),line(A.X(3),A.Y(0),A.X(3),A.Y(34),{color:CT,w:3,dash:'6 6'})+label('t ＝ 3.0 s',A.X(3),A.Y(34)-10,{size:24,color:CT,anchor:'middle',weight:700}))+goalTag(G2,{g:seg(p,.03,.15)});
 },
 // 9. 下から 30 へ近づく速度の曲線、すき間 w を薄い黄で塗る。式 w＝30e^(−t/3)
 [K+'sol']:(p,ctx)=>{
  const W2=sentWin(ctx),b=W2[1]?W2[1][0]:.5,A=gr(BIG);
  let s=A.svg+vline(A)+line(A.X(3),A.Y(0),A.X(3),A.Y(34),{color:CT,w:3,dash:'6 6'});
  s+=A.plot(vex,{p:seg(p,.05,.35),color:CV,w:5})+gapFill(A,9,seg(p,.3,.4));
  s+=fade(seg(p,.32,.42),label('w',A.X(1.2),A.Y(26),{size:30,color:CW,weight:700}));
  s+=card(790,92,390,210,fade(seg(p,.2,.3),label('差は 指数関数で 減る',985,140,{size:26,color:C.ink,anchor:'middle',weight:700}))
   +fade(seg(p,b,b+.08),T(`${W}(0)=30`,985,200,34))+fade(seg(p,b+.2,b+.3),T(`${W}=30\\,e^{-t/3}`,985,265,38)),1,CW);
  return s+goalTag(G2);
 },
 // 10a. t＝3.0 s は t＝τ
 [K+'attau']:(p)=>{
  const A=gr(BIG);
  let s=A.svg+vline(A)+A.plot(vex,{color:CV,w:5})+gapFill(A);
  s+=line(A.X(3),A.Y(0),A.X(3),A.Y(34),{color:CT,w:4,dash:'6 6'})+fade(seg(p,.2,.4),label('t ＝ τ',A.X(3)+12,A.Y(5),{size:28,color:CT,weight:700}));
  s+=card(790,92,390,210,T(`${W}=30\\,e^{-t/3}`,985,170,38)+fade(seg(p,.2,.4),T(`t=${TAU}=3`,985,250,36)),1,CW);
  return s+goalTag(G2);
 },
 // 10b. すき間を光らせ「w≈11」
 [K+'attau2']:(p)=>{
  const A=gr(BIG),vt=vex(3);
  let s=A.svg+vline(A)+A.plot(vex,{color:CV,w:5})+gapFill(A);
  s+=line(A.X(3),A.Y(0),A.X(3),A.Y(34),{color:CT,w:4,dash:'6 6'});
  s+=fade(seg(p,.3,.4),line(A.X(3),A.Y(vt),A.X(3),A.Y(30),{color:CW,w:9})+label('w ≈ 11',A.X(3)+16,A.Y(25)+8,{size:28,color:CW,weight:700}));
  s+=card(790,92,390,210,T(`${W}=30\\,e^{-1}`,985,150,36)+fade(seg(p,.2,.3),T('=30\\times0.37',985,210,34))+fade(seg(p,.35,.45),T('\\approx11\\ \\mathrm{m/s}',985,270,34,{color:CW})),1,CW);
  return s+goalTag(G2);
 },
 // 11. 縦線の上で v の高さに「19」（紫）、すき間に「11」。答えの札 C
 [K+'ans2']:(p,ctx)=>{
  const W2=sentWin(ctx),b=W2[1]?W2[1][0]:.6,A=gr(BIG),vt=vex(3);
  let s=A.svg+vline(A)+A.plot(vex,{color:CV,w:5})+gapFill(A);
  s+=line(A.X(3),A.Y(0),A.X(3),A.Y(34),{color:CT,w:4,dash:'6 6'})+line(A.X(3),A.Y(vt),A.X(3),A.Y(30),{color:CW,w:9})+label('11',A.X(3)+16,A.Y(25)+8,{size:28,color:CW,weight:700});
  s+=fade(seg(p,.1,.25),line(A.X(3),A.Y(0),A.X(3),A.Y(vt),{color:CV,w:9})+label('19',A.X(3)-16,A.Y(10),{size:30,color:CV,anchor:'end',weight:700}));
  s+=card(790,92,390,210,T(`v=v_\\infty-${W}`,985,150,36)+fade(seg(p,.1,.2),T('=30-11',985,210,34))+fade(seg(p,.25,.35),T('\\approx19\\ \\mathrm{m/s}',985,270,34,{color:CV})),1,CV);
  return s+goalTag(G2)+ANS2(seg(p,b+.02,b+.1));
 },
 // 12. 誤答 B（文1）→ D（文2）。15 の高さに灰色の点線、約63%
 [K+'wrong2']:(p,ctx)=>{
  const W2=sentWin(ctx),b=W2[1]?W2[1][0]:.5,inD=seg(p,b+.01,b+.05),A=gr(BIG),vt=vex(3);
  let s=A.svg+vline(A)+A.plot(vex,{color:CV,w:5})+gapFill(A);
  s+=line(A.X(3),A.Y(0),A.X(3),A.Y(34),{color:CT,w:4,dash:'6 6'})+line(A.X(3),A.Y(0),A.X(3),A.Y(vt),{color:CV,w:9})+line(A.X(3),A.Y(vt),A.X(3),A.Y(30),{color:CW,w:9});
  s+=label('19',A.X(3)-16,A.Y(10),{size:30,color:CV,anchor:'end',weight:700})+label('11',A.X(3)+16,A.Y(25)+8,{size:28,color:CW,weight:700});
  s+=fade(inD,line(A.X(0),A.Y(15),A.X(9),A.Y(15),{color:C.dim,w:3,dash:'5 7'})+label('15（半分）',A.X(9),A.Y(15)+30,{size:24,color:C.dim,anchor:'end'})+label('約63%',A.X(3)-16,A.Y(21),{size:26,color:CV,anchor:'end',weight:700}));
  s+=wrongSeq(p,ctx,[['B','約 11 m/s','それは残りの差 w'],['D','15 m/s',['t＝τ で半分、ではない','（約63％）']]],{opts:{...WOPT,x:790,w:390,y:120}});
  return s+goalTag(G2)+ANS2(1);
 },
 // 13. 誤答 A
 [K+'wrong2a']:(p)=>{
  const A=gr(BIG),vt=vex(3);
  let s=A.svg+vline(A)+A.plot(vex,{color:CV,w:5})+gapFill(A)+line(A.X(3),A.Y(0),A.X(3),A.Y(34),{color:CT,w:4,dash:'6 6'})+line(A.X(3),A.Y(0),A.X(3),A.Y(vt),{color:CV,w:9});
  s+=wrongCard('A','30 m/s','抵抗なしの gt／τ で届くとした',{...WOPT,x:740,w:450,y:120,g:seg(p,.02,.08)});
  return s+goalTag(G2)+ANS2(1);
 },
 // 14. 出だしの接線（傾き 10、黄の点線）が t＝3 で 30 の線に届く。実際の曲線はその下
 [K+'slope']:(p,ctx)=>{
  const W2=sentWin(ctx),b=W2[1]?W2[1][0]:.45,A=gr(BIG);
  let s=A.svg+vline(A)+A.plot(vex,{color:CV,w:5})+line(A.X(3),A.Y(0),A.X(3),A.Y(34),{color:CT,w:3,dash:'6 6'});
  s+=A.plot(t=>10*t,{to:3,p:seg(p,b,b+.25),color:CH,w:4,dash:'8 6'});
  s+=fade(seg(p,.1,.2),label('傾き 10 ＝ g',A.X(3.5),A.Y(5),{size:26,color:CH,weight:700}));
  s+=fade(seg(p,b+.25,b+.32),dot(A.X(3),A.Y(30),8,CH));
  s+=card(790,92,390,210,T('\\dfrac{v_\\infty}{'+TAU+'}=\\dfrac{30}{3}=10',985,160,34)+fade(seg(p,.2,.3),label('＝ g と同じ',985,250,{size:28,color:CH,anchor:'middle',weight:700})),1,CH);
  s+=fade(seg(p,b+.35,b+.45),label('抵抗で 加速が 弱まる',985,360,{size:26,color:CV,anchor:'middle',weight:700}));
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 // 15. 札「求めるもの：一歩ごとの倍率」。差 w＝30 の棒と、刻み Δt＝0.3 s
 [K+'goal3']:(p)=>{
  let s=wbars({n:1,lab:1});
  s+=card(470,150,640,150,label('Δt ＝ 0.3 s ごとに 一歩ずつ',790,210,{size:30,color:CT,anchor:'middle',weight:700})+label('差 w は 何倍に なる？',790,262,{size:30,color:CW,anchor:'middle',weight:700}),seg(p,.15,.3));
  return s+goalTag(G3,{g:seg(p,.03,.15)});
 },
 // 16. 「近似」タグ。wᵢ₊₁≈wᵢ−(wᵢ/τ)Δt → wᵢ(1−Δt/τ)。≈ を黄で
 [K+'step']:(p)=>{
  let s=kindTag('近似',600,120,{g:seg(p,.03,.12)});
  s+=fade(seg(p,.05,.15),label('一歩の 間、変化率を −w/τ のまま とみなす',600,185,{size:26,color:C.dim,anchor:'middle'}));
  const Wi=wc('w_i'),Wi1=wc('w_{i+1}'),AP=`{\\color{${CH}}\\approx}`;
  s+=fade(seg(p,.15,.3),T(`${Wi1}${AP}${Wi}-\\dfrac{${Wi}}{${TAU}}\\,\\Delta t`,600,280,44));
  s+=fade(seg(p,.5,.62),T(`${AP}${Wi}\\left(1-\\dfrac{\\Delta t}{${TAU}}\\right)`,690,410,46));
  s+=fade(seg(p,.4,.5),T(Wi,930,342,30)+label('を くくり出す',950,350,{size:24,color:C.dim}));
  return s+goalTag(G3);
 },
 // 17. w の棒を 0.3 s ごとに 30、27、24.3。縮む 0.1 を赤、残る 0.9 を薄い黄。答えの札 A
 [K+'ans3']:(p,ctx)=>{
  const W2=sentWin(ctx),b=W2[1]?W2[1][0]:.7;
  let s=card(700,92,480,160,T('\\dfrac{\\Delta t}{'+TAU+'}=\\dfrac{0.3}{3}=0.1',940,145,32)+fade(seg(p,.2,.3),T('1-0.1=0.9',940,215,34,{color:CH})),1,CH);
  s+=wbars({n:3,shrink:[0,seg(p,.35,.45),seg(p,.5,.6)]});
  s+=fade(seg(p,.4,.5),label('縮む 0.1',820,330,{size:26,color:CD,weight:700})+label('残る 0.9',820,375,{size:26,color:CW,weight:700}));
  return s+goalTag(G3)+ANS3(seg(p,b+.02,b+.1));
 },
 // 18. 誤答 B（文1）→ C・D（文2を半分ずつ）
 [K+'wrong3']:(p,ctx)=>{
  const W2=sentWin(ctx),e=W2[0][1],s2=W2[1]?W2[1][0]:e,m=s2+(1-s2)*.5;
  let s=wbars({n:3,shrink:[0,1,1],x0:120,gap:150,k:9});
  s+=wrongSeq(p,ctx,[['B','0.1 倍','縮む割合と残る割合を取り違えた'],['C','0.7 倍','τ で割っていない（1−0.3）'],['D','1.1 倍','負号を落とし、差が増えるとした']],{win:[[0,e],[s2,m],[m,1]],opts:{...WOPT,x:520,w:660,y:150}});
  return s+goalTag(G3)+ANS3(1);
 },
 // 19. 刻みを 0.3 s → 0.1 s と細かくし、棒の先を結ぶ線が減衰曲線 30e^(−t/3) に重なる
 [K+'refine']:(p)=>{
  const A=gr({x:110,y:450,w:640,h:330,xmax:9,ymax:35,yl:'w [m/s]',ycol:CW}),u=seg(p,.45,.6);
  let s=A.svg+A.plot(wex,{color:C.dim,w:3,dash:'8 6'});
  const bars=(dt,g)=>{let q='',pts=[];for(let i=0;i*dt<=9+1e-9;i++){const t=i*dt,w=30*Math.pow(1-dt/3,i);pts.push([A.X(t),A.Y(w)]);
   q+=rect(A.X(t)-Math.max(1.5,dt*30)/2,A.Y(w),Math.max(3,dt*30),A.Y(0)-A.Y(w),{fill:CW,fo:.3,stroke:'none',rx:1});}
   return fade(g,q+draw(pts,1,{color:CW,w:3}));};
  s+=bars(.3,seg(p,.05,.15)*(1-u))+bars(.1,u);
  s+=card(800,110,370,200,label('刻み',985,160,{size:26,color:C.dim,anchor:'middle'})+fade(1-u,label('0.3 s',985,230,{size:40,color:CT,anchor:'middle',weight:700}))+fade(u,label('0.1 s',985,230,{size:40,color:CT,anchor:'middle',weight:700})),1,CT);
  s+=fade(seg(p,.65,.75),label('点線 ＝ 30 e の −t/3 乗',985,370,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },

 // ===================== まとめ =====================
 // 20. dw/dt＝−w/τ と、縮む棒を並べる。答えの札3枚
 [K+'sum']:(p)=>{
  let s=card(40,110,440,170,T(`\\dfrac{d${W}}{dt}=-\\dfrac{${W}}{${TAU}}`,260,195,48),seg(p,.03,.12),CH);
  s+=fade(seg(p,.15,.3),wbars({n:3,x0:620,gap:200,base:455,shrink:[0,1,1]}));
  s+=fade(seg(p,.3,.4),label('同じ 割合で 縮む',260,360,{size:30,color:CW,anchor:'middle',weight:700}));
  return s+answerRow([[1,'C',''],[2,'C','約 19 m/s'],[3,'A','0.9 倍']],{g:seg(p,.6,.7)});
 },
};

// 問題編 解説「押す力が弱まり、やがて引き戻す台車」（q-um-integral、大学編 02 積分・上級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/02_積分.md の q-um-integral（解説 20 行）。
// 配置：上に線路と台車（y≈90〜122）、その下に a・v・x の3段のグラフ（左 x≈20〜600）、右に式と札の枠（x 640〜1190）。札の帯（y＜78）には図を描かない。
// 色：加速度 a 赤、速度 v 紫、位置 x 水色、時刻 t 金、面積 紫の薄い塗り（負は薄い赤）、強調 黄、✓ 緑。
// 行18 の「下の面積を上へ折り返す」は、v の段の上に折り返すと段からはみ出すので、右の枠の面積の棒（32 と −32）で折り返して見せる。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,arrow,highlight,poly,draw,tex,texWidth} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,sentWin,cueT,tAt,isProblem} from './yt1-qx-common.mjs';

const K='qx-um-integral:';
const RED='#ff6b6b',DRED='#c0392b';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:true,...o});
const TN=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const cH=s=>`{\\color{${C.hi}}${s}}`,cX=s=>`{\\color{${C.x}}${s}}`;
// ---- 配置 ----
const PX=640,PW=550,PC=PX+PW/2;
const WOPT={x:PX,w:PW,size:26,whySize:22};
const GX=90,ST=76,X=t=>GX+ST*t;
const ROW={a:{top:134,h:96,lo:-24,hi:12,col:C.a,name:'a',unit:'m/s²',ticks:[12,-24]},
 v:{top:250,h:104,lo:-36,hi:12,col:C.v,name:'v',unit:'m/s',ticks:[12,-36]},
 x:{top:374,h:104,lo:0,hi:34,col:C.x,name:'x',unit:'m',ticks:[16,32]}};
const Yr=(r,val)=>{const R=ROW[r];return R.top+R.h*(R.hi-val)/(R.hi-R.lo);};
const fa=t=>12-6*t,fv=t=>12*t-3*t*t,fx=t=>6*t*t-t*t*t;
const FN={a:fa,v:fv,x:fx};
// 線路と台車
const RY=108,RX=m=>GX+13.5*m;
const G1='t＝2 s の位置 x',G2='小問1 の正しい求め方',G3='0〜6 s の変位と道のり';
const ANS1=g=>answerTag(1,'B','16 m',{g}),ANS2=g=>answerTag(2,'D','',{g}),ANS3=g=>answerTag(3,'A','変位 0 m、道のり 64 m',{g});

// ---- 部品 ----
function rowAxes(r,{g=1}={}){
 const R=ROW[r],z=Yr(r,0);
 let s=line(X(0),R.top-4,X(0),R.top+R.h+4,{color:C.dim,w:2.5})+arrow(X(0)-6,z,X(6.45),z,{color:C.dim,w:2.5,head:12});
 for(const t of [1,2,3,4,5,6])s+=line(X(t),R.top,X(t),R.top+R.h,{color:C.grid,w:1.2})+line(X(t),z-5,X(t),z+5,{color:C.t,w:2});
 for(const v of R.ticks)s+=line(X(0)-5,Yr(r,v),X(0)+5,Yr(r,v),{color:R.col,w:2})+line(X(0),Yr(r,v),X(6.2),Yr(r,v),{color:C.grid,w:1.2})+label(v<0?'−'+(-v):String(v),X(0)-10,Yr(r,v)+7,{size:20,color:R.col,anchor:'end'});
 s+=label(R.name,22,R.top+R.h/2+4,{size:34,color:R.col,weight:700})+label(`[${R.unit}]`,8,R.top+R.h/2+30,{size:18,color:R.col});
 return fade(g,s);
}
function axes3({g=1}={}){
 let s=rowAxes('a',{g})+rowAxes('v',{g})+rowAxes('x',{g});
 s+=fade(g,[1,2,3,4,5,6].map(t=>label(String(t),X(t),506,{size:20,color:C.t,anchor:'middle'})).join('')+label('t [s]',X(6.45)+4,506,{size:22,color:C.t,weight:700}));
 return s;
}
const curve=(r,t0,t1,{p=1,color,w=4.5,dash=''}={})=>t1<=t0?'':draw(Array.from({length:61},(_,i)=>{const t=t0+(t1-t0)*i/60;return [X(t),Yr(r,FN[r](t))];}),p,{color:color??ROW[r].col,w,dash});
function rail({g=1}={}){
 let s=line(RX(-1),RY,RX(36),RY,{color:C.dim,w:3});
 for(let m=0;m<=34;m+=2)s+=line(RX(m),RY,RX(m),RY+5,{color:C.faint,w:1.5});
 s+=label('x＝0',RX(0)-22,RY+7,{size:20,color:C.x,anchor:'end'})+line(RX(0),RY-4,RX(0),RY+8,{color:C.x,w:3});
 s+=arrow(RX(33),RY-26,RX(36),RY-26,{color:C.hi,w:3,head:10})+label('＋',RX(36)+10,RY-20,{size:22,color:C.hi,weight:700});
 return fade(g,s);
}
function cart(m,{g=1}={}){
 const x=RX(m);
 return fade(g,rect(x-17,RY-24,34,16,{fill:C.x,fo:.3,stroke:C.x,sw:2,rx:4})+ring(x-10,RY-5,4.5,{color:C.dim,w:2,fill:C.bg})+ring(x+10,RY-5,4.5,{color:C.dim,w:2,fill:C.bg}));
}
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
// 扉（積分定数）：close 0→1 で閉じる
function door(x,y,name,{close=0,g=1,zero=1,color=C.hi}={}){
 const w=40,h=52,k=mix(.35,1,close),d=10*(1-close);
 let s=rect(x,y,w,h,{fill:'none',fo:0,stroke:C.dim,sw:2,rx:3});
 s+=poly([[x,y],[x+w*k,y+d],[x+w*k,y+h-d],[x,y+h]],{fill:color,fo:.18+.2*close,stroke:color,sw:2});
 s+=TN(name,x+w/2,y+h/2+8,26,{color:C.ink});
 if(close>.95&&zero)s+=TN('=0',x+w+30,y+h/2+8,28,{color:C.F});
 return fade(g,s);
}
// a の段の t>2 を濃い赤に
const aNeg=(g=1)=>fade(g,curve('a',2,6,{color:DRED,w:7})+curve('a',2,6,{color:C.a,w:3}));
// 基本の画面
function base({cartM=0,aG=1,vT=0,xT=0,a2=0}={}){
 let s=rail()+cart(cartM)+axes3();
 if(aG)s+=curve('a',0,6,{p:aG});
 if(a2)s+=aNeg(a2);
 if(vT>0)s+=curve('v',0,vT);
 if(xT>0)s+=curve('x',0,xT);
 return s;
}
// 斜線（a の段：12 の水平線と直線の間、0〜2 s）
function hatchA(g=1){
 if(g<=.001)return '';
 let h='';for(let k=-120;k<200;k+=12)h+=line(X(0)+k,Yr('a',0),X(0)+k+70,Yr('a',12),{color:RED,w:2});
 const clip=`<clipPath id="hA"><polygon points="${X(0)},${Yr('a',12)} ${X(2)},${Yr('a',12)} ${X(2)},${Yr('a',0)}"/></clipPath>`;
 return fade(g,`<defs>${clip}</defs><g clip-path="url(#hA)">${h}</g>`+line(X(0),Yr('a',12),X(2),Yr('a',12),{color:RED,w:3,dash:'8 6'})+label('12',X(2)+8,Yr('a',12)+8,{size:22,color:RED,weight:700}));
}
// v の段の面積（0〜4 紫、4〜6 薄い赤）
function vArea(t0,t1,{g=1,col=C.v,fo=.3}={}){
 if(g<=.001)return '';
 const pts=[[X(t0),Yr('v',0)],...Array.from({length:41},(_,i)=>{const t=t0+(t1-t0)*i/40;return [X(t),Yr('v',fv(t))];}),[X(t1),Yr('v',0)]];
 return fade(g,poly(pts,{fill:col,fo,stroke:'none'}));
}
// 段の図（積分の階段）：a →(積分)→ v →(積分)→ x
function stairs(x0,y0,{g=1,s1=1,s2=1,d1=0,d2=0,doors=1,lab1='積分',lab2='積分'}={}){
 const bx=(x,y,t,col)=>rect(x,y,80,56,{fill:col,fo:.15,stroke:col,sw:2.5,rx:10})+TN(`{\\color{${col}}${t}}`,x+40,y+38,34);
 let s=bx(x0,y0,'a',C.a);
 s+=fade(s1,arrow(x0+86,y0+28,x0+176,y0+28,{color:C.dim,w:3,head:12})+label(lab1,x0+131,y0+16,{size:20,color:C.dim,anchor:'middle'})+bx(x0+182,y0,'v',C.v));
 s+=fade(s2,arrow(x0+268,y0+28,x0+358,y0+28,{color:C.dim,w:3,head:12})+label(lab2,x0+313,y0+16,{size:20,color:C.dim,anchor:'middle'})+bx(x0+364,y0,'x',C.x));
 if(doors){s+=fade(s1,door(x0+202,y0+66,'C_1',{close:d1}));s+=fade(s2,door(x0+384,y0+66,'C_2',{close:d2,zero:1}));}
 return fade(g,s);
}

export const ytQxUmIntegralDiagrams={
 // ===================== 問題アニメ（出題中の図、約4秒）=====================
 // a・v・x の3段の座標、a の段だけに a＝12−6t を左から描く。線路と x＝0 に止まった台車。台車は動かさない。
 [K+'q0']:(p)=>{
  let s=rail({g:seg(p,0,.15)})+cart(0,{g:seg(p,0,.15)})+axes3({g:seg(p,.05,.3)});
  s+=curve('a',0,6,{p:seg(p,.35,.95)});
  s+=fade(seg(p,.85,.98),label('a ＝ 12 − 6t',X(3.3),Yr('a',3),{size:24,color:C.a,weight:700}));
  return s;
 },

 // ===================== 問題の設定 =====================
 // 1. a の直線を左から右へ光らせ、t＝2 の交点に黄色の点、2 s より右を濃い赤に
 [K+'setup']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,sw=seg(p,.1,b-.05);
  let s=base({a2:seg(p,b+.05,b+.15)});
  if(sw>0&&sw<1)s+=curve('a',Math.max(0,6*sw-.8),6*sw,{color:C.hi,w:9});
  s+=fade(seg(p,b,b+.06),ring(X(2),Yr('a',0),12,{color:C.hi,w:3})+dot(X(2),Yr('a',0),6,C.hi)+label('2 s から 負',X(2)+16,Yr('a',0)-12,{size:22,color:C.hi,weight:700}));
  s+=panel(86,240,T('a=12-6t',PC,150,44)+label('（a は m/s²、t は 秒の 数値）',PC,200,{size:22,color:C.dim,anchor:'middle'})
   +label('t ＝ 0 で x ＝ 0 に 静止',PC,265,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,0,.08));
  return s;
 },

 // ===================== 小問1 =====================
 // 2. x＝½at² を書き、灰色の枠「a が一定のときだけ」
 [K+'goal1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=base({a2:1});
  s+=panel(86,250,label('一定加速度の 公式',PC,135,{size:24,color:C.dim,anchor:'middle'})+fade(seg(p,b,b+.1),T('x=\\tfrac12 at^2',PC,200,46)
   +rect(PX+90,240,PW-180,52,{fill:C.dim,fo:.12,stroke:C.dim,sw:2.5,rx:10})+label('a が 一定の ときだけ',PC,275,{size:26,color:C.dim,anchor:'middle',weight:700})),seg(p,b-.02,b+.06));
  s+=fade(seg(p,b+.2,b+.3),label('ここでは a が 変わる → 使えない',PC,370,{size:26,color:RED,anchor:'middle',weight:700}));
  s+=goalTag(G1,{g:seg(p,.02,.1)});
  return s;
 },
 // 3. v＝∫a dt。12 → 12t、−6t → −6t²/2＝−3t²（肩を1つ上げて、その数で割る矢印、黄）
 [K+'intv']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=base({a2:1});
  let pn=T('v=\\int a\\,dt',PC,140,40);
  pn+=fade(seg(p,b,b+.1),TN('12\\ \\longrightarrow\\ 12t',PC,215,36));
  pn+=fade(seg(p,b+.25,b+.38),TN('-6t\\ \\longrightarrow\\ -\\dfrac{6t^2}{2}=-3t^2',PC,300,36));
  pn+=fade(seg(p,b+.32,b+.45),label('肩を 1つ 上げて、その数で 割る',PC,375,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=panel(86,320,pn,seg(p,0,.08));
  s+=goalTag(G1);
  return s;
 },
 // 4. v＝12t−3t²＋C₁。C₁ に扉。「静止」で v(0)＝0、扉が閉じて C₁＝0。v の段に 0〜2 s の曲線
 [K+'c1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,cl=seg(p,b+.25,b+.4);
  let s=base({a2:1,vT:2*seg(p,b+.4,b+.6)});
  let pn=T('v=12t-3t^2+C_1',PC-40,150,40)+door(PC+180,120,'C_1',{close:cl,zero:0});
  pn+=fade(seg(p,b,b+.1),label('静止：',PC-150,235,{size:26,color:C.ink,weight:700})+T('v(0)=0',PC+20,228,36));
  pn+=fade(seg(p,b+.35,b+.45),TN('C_1=0',PC,300,40,{color:C.F}));
  s+=panel(86,250,pn,1);
  s+=goalTag(G1);
  return s;
 },
 // 5. x＝∫v dt。12t → 12t²/2＝6t²、−3t² → −3t³/3＝−t³
 [K+'intx']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=base({a2:1,vT:2});
  let pn=T('x=\\int v\\,dt',PC,140,40);
  pn+=fade(seg(p,b,b+.12),TN('12t\\ \\longrightarrow\\ \\dfrac{12t^2}{2}=6t^2',PC,220,34));
  pn+=fade(seg(p,b+.28,b+.4),TN('-3t^2\\ \\longrightarrow\\ -\\dfrac{3t^3}{3}=-t^3',PC,310,34));
  s+=panel(86,280,pn,1);
  s+=goalTag(G1);
  return s;
 },
 // 6. x＝6t²−t³＋C₂。C₂ の扉が x(0)＝0 で閉じる。x の段に 0〜2 s の曲線
 [K+'c2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,cl=seg(p,b+.25,b+.4);
  let s=base({a2:1,vT:2,xT:2*seg(p,b+.4,b+.6)});
  let pn=T('x=6t^2-t^3+C_2',PC-40,150,40)+door(PC+180,120,'C_2',{close:cl,zero:0});
  pn+=fade(seg(p,b,b+.1),T('x(0)=0',PC,228,36));
  pn+=fade(seg(p,b+.35,b+.45),TN('C_2=0',PC,300,40,{color:C.F}));
  s+=panel(86,250,pn,1);
  s+=goalTag(G1);
  return s;
 },
 // 7. x(2)＝6×4−8＝24−8＝16 m。x の段の t＝2 に点と「16」。台車が 16 m へ。答えの札 B（16 m）
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55;
  let s=base({a2:1,vT:2,xT:2,cartM:16*seg(p,.15,.45)});
  s+=fade(seg(p,.1,.2),dot(X(2),Yr('x',16),8,C.hi)+label('16',X(2)+12,Yr('x',16)-8,{size:24,color:C.hi,weight:700}));
  s+=fade(seg(p,.4,.5),label('16 m',RX(16)+24,RY-6,{size:22,color:C.x,weight:700}));
  s+=panel(86,200,T('x=6t^2-t^3',PC,140,36)+fade(seg(p,.03,.15),T(`x(2)=6\\times4-8=24-8=${cX('16\\ \\mathrm{m}')}`,PC,220,36)),1);
  s+=goalTag(G1)+ANS1(seg(p,b,b+.08));
  return s;
 },
 // 8. 誤答 A：a の段に 12 の水平線（赤の点線）、点線と直線の間を赤の斜線
 [K+'wrongA']:(p)=>{
  let s=base({a2:1,vT:2,xT:2,cartM:16})+label('16 m',RX(16)+24,RY-6,{size:22,color:C.x,weight:700});
  s+=hatchA(seg(p,.05,.18));
  s+=panel(86,200,T('x=6t^2-t^3',PC,140,36)+T(`x(2)=${cX('16\\ \\mathrm{m}')}`,PC,220,36),1);
  s+=wrongCard('A','24 m',['a ＝ 12 が ずっと 続く と した（a が 一定 と した）'],{...WOPT,y:300,mid:'\\tfrac12\\times12\\times2^2=24',g:seg(p,.03,.1)});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },
 // 9. 誤答 C → D を1枚ずつ。D のとき v の段の t＝2 に「12」
 [K+'wrongCD']:(p,ctx)=>{
  const W=sentWin(ctx),wC=[0,W[0][1]],wD=[W[1]?W[1][0]:.5,1],inD=seg(p,wD[0]+.01,wD[0]+.06);
  let s=base({a2:1,vT:2,xT:2,cartM:16})+label('16 m',RX(16)+24,RY-6,{size:22,color:C.x,weight:700});
  s+=fade(inD,ring(X(2),Yr('v',12),14,{color:C.hi,w:3})+label('12',X(2)+18,Yr('v',12)-4,{size:24,color:C.hi,weight:700}));
  s+=panel(86,200,T('x=6t^2-t^3',PC,140,36)+T(`x(2)=${cX('16\\ \\mathrm{m}')}`,PC,220,36),1);
  s+=wrongSeq(p,ctx,[['C','40 m',['12t の 原始関数を 12t² と した（2 で 割り忘れ）'],{mid:'12\\times4-8=40'}],['D','12 m',['v(2) ＝ 12 m/s を 位置 と した'],{mid:'v(2)=24-12=12'}]],{win:[wC,wD],opts:{...WOPT,y:300}});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },

 // ===================== 小問2 =====================
 // 10. a →（積分）→ v →（積分）→ x の2段の階段を右に描く
 [K+'goal2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=base({a2:1,vT:2,xT:2,cartM:16});
  s+=panel(86,330,label('今の 手順',PC,135,{size:26,color:C.dim,anchor:'middle'})+stairs(PX+45,170,{s1:seg(p,b+.1,b+.3),s2:seg(p,b+.4,b+.6),doors:0}),seg(p,b-.02,b+.08));
  s+=fade(seg(p,.05,.15)*(1-seg(p,b-.05,b)),panel(86,200,label('小問1 の 求め方は？',PC,190,{size:32,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
  s+=goalTag(G2,{g:seg(p,.02,.1)});
  return s;
 },
 // 11. 階段の各段に C₁、C₂ の扉。「t＝0 の速度」で C₁、「位置」で C₂ が閉じる。答えの札 D
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=base({a2:1,vT:2,xT:2,cartM:16});
  s+=panel(86,330,label('定数は t ＝ 0 で 決める',PC,135,{size:26,color:C.dim,anchor:'middle'})+stairs(PX+45,170,{d1:seg(p,b*.35,b*.5),d2:seg(p,b*.6,b*.75)})
   +fade(seg(p,b*.35,b*.5),label('v(0) ＝ 0',PX+265,330,{size:24,color:C.v,anchor:'middle',weight:700}))
   +fade(seg(p,b*.6,b*.75),label('x(0) ＝ 0',PX+447,330,{size:24,color:C.x,anchor:'middle',weight:700})),1);
  s+=goalTag(G2)+ANS2(seg(p,b,b+.08));
  return s;
 },
 // 12. 誤答 A（平均 6 で ½at²）→ 誤答 B（12t−3t²）
 [K+'wrongAB']:(p,ctx)=>{
  const W=sentWin(ctx),wA=[0,W[0][1]],wB=[W[1]?W[1][0]:.5,1];
  let s=base({a2:1,vT:2,xT:2,cartM:16});
  s+=panel(86,200,label('正しい 手順',PC,125,{size:24,color:C.dim,anchor:'middle'})+stairs(PX+45,145,{d1:1,d2:1,doors:0}),1);
  s+=wrongSeq(p,ctx,[['A','平均 6 で ½at²',['16 m に ならない'],{mid:'\\tfrac12\\times6\\times4=12\\ \\mathrm{m}'}],['B','12t−3t²',['a を 1回 積分した もの は 速度']]],{win:[wA,wB],opts:{...WOPT,y:300}});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },
 // 13. 誤答 C（初期条件を使わない）。x＝6t²−t³＋C₂ の C₂ を黄色で光らせ、「x(0) が要る（ここではたまたま 0）」
 [K+'wrongC']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,gl=seg(p,b,b+.08);
  let s=base({a2:1,vT:2,xT:2,cartM:16});
  const e=`x=6t^2-t^3+{\\color{${gl>.5?C.hi:C.ink}}C_2}`;
  s+=panel(86,200,T(e,PC,145,40)+fade(gl,highlight(PC+texWidth(e,40)/2-texWidth('C_2',40)-10,110,texWidth('C_2',40)+20,62,1)+label('x(0) が 要る（ここでは たまたま 0）',PC,230,{size:26,color:C.hi,anchor:'middle',weight:700})),1);
  s+=wrongCard('C','初期条件を 使わない',['差で 消えるのは 定積分の とき'],{...WOPT,y:300,g:seg(p,.03,.1)});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },

 // ===================== 小問3 =====================
 // 14. v の段を 0〜6 s まで描き、t＝4 で横軸を横切る所に黄の点。4 s より右に「戻る」
 [K+'goal3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=base({a2:1,vT:2+4*seg(p,b,b+.35),xT:2});
  s+=fade(seg(p,b+.35,b+.42),ring(X(4),Yr('v',0),12,{color:C.hi,w:3})+dot(X(4),Yr('v',0),6,C.hi)+label('4 s',X(4)-6,Yr('v',0)-14,{size:22,color:C.hi,anchor:'end',weight:700}));
  s+=fade(seg(p,b+.45,b+.55),label('戻る',X(5),Yr('v',-12),{size:24,color:RED,anchor:'middle',weight:700}));
  s+=panel(86,250,label('0〜6 s の 変位 と 道のり',PC,150,{size:28,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,b,b+.1),T('v=3t(4-t)',PC,225,40)+label('4 s で 0、その後は 負',PC,290,{size:24,color:C.ink,anchor:'middle'})),seg(p,.03,.12),C.hi);
  s+=goalTag(G3,{g:seg(p,.02,.1)});
  return s;
 },
 // 15. x(6)＝6×36−216＝216−216＝0。x の段を 0〜6 s まで（t＝4 で山 32、t＝6 で 0）
 [K+'disp']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=base({a2:1,vT:6,xT:2+4*seg(p,.1,.45)});
  s+=fade(seg(p,.4,.5),dot(X(4),Yr('x',32),7,C.x)+label('32',X(4),Yr('x',32)-8,{size:22,color:C.x,anchor:'middle',weight:700})+dot(X(6),Yr('x',0),8,C.hi)+label('0',X(6)+12,Yr('x',0)-8,{size:22,color:C.hi,weight:700}));
  s+=panel(86,250,label('変位',PC,135,{size:28,color:C.x,anchor:'middle',weight:700})+T('x(6)-x(0)',PC,195,38)
   +fade(seg(p,b,b+.12),T(`=6\\times36-216=216-216=${cX('0')}`,PC,270,34)),1,C.x);
  s+=goalTag(G3);
  return s;
 },
 // 16. 台車が右へ 32 m 進んで止まり、左へ戻って出発点に着く。変位の矢印は長さ0（点に「変位 0」）
 [K+'trip']:(p,ctx)=>{
  const t=6*seg(p,.05,.85),m=fx(t);
  let s=base({a2:1,vT:6,xT:6,cartM:m});
  s+=line(X(t),Yr('a',12)-6,X(t),Yr('x',0)+4,{color:C.hi,w:2,dash:'5 5'});
  s+=fade(seg(p,.85,.95),label('変位 0',RX(0)+26,RY-6,{size:22,color:C.x,weight:700}));
  s+=panel(86,250,label('変位 0 ≠ 動かなかった',PC,150,{size:28,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.2,.3),label('右へ 32 m',PC,215,{size:28,color:C.ink,anchor:'middle'}))+fade(seg(p,.55,.65),label('→ 左へ 32 m 戻った',PC,265,{size:28,color:C.ink,anchor:'middle'})),1);
  s+=goalTag(G3);
  return s;
 },
 // 17. v の段の 0〜4 s の上の面積に「32」、4〜6 s の下の面積に「−32」。x(4)−x(0)＝32、x(6)−x(4)＝−32
 [K+'split']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=base({a2:1,vT:6,xT:6});
  s+=line(X(4),Yr('v',12),X(4),Yr('v',-36),{color:C.hi,w:2.5,dash:'7 6'})+fade(seg(p,.03,.12),label('4 s で 分ける',X(4)+8,Yr('v',12)+4,{size:20,color:C.hi,weight:700}));
  s+=vArea(0,4,{g:seg(p,b,b+.1)})+fade(seg(p,b+.05,b+.15),label('32',X(2),Yr('v',4),{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=vArea(4,6,{g:seg(p,b+.3,b+.4),col:RED,fo:.25})+fade(seg(p,b+.35,b+.45),label('−32',X(5.3),Yr('v',-14),{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=panel(86,250,label('道のりは 向きが 変わる 4 s で 分ける',PC,135,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,b+.05,b+.15),T(`x(4)-x(0)=${cX('32')}`,PC,200,36))+fade(seg(p,b+.35,b+.45),T(`x(6)-x(4)=${`{\\color{${RED}}-32}`}`,PC,270,36)),1);
  s+=goalTag(G3);
  return s;
 },
 // 18. 面積の棒で、下の −32 を上へ折り返し、32＋32＝64 m。答えの札 A
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55,f=seg(p,.05,.3);
  let s=base({a2:1,vT:6,xT:6})+vArea(0,4)+vArea(4,6,{col:RED,fo:.25})+label('32',X(2),Yr('v',4),{size:28,color:C.ink,anchor:'middle',weight:700})+label('−32',X(5.3),Yr('v',-14),{size:26,color:C.ink,anchor:'middle',weight:700});
  // 面積の棒：0 の線の上に 32（紫）、下に −32 → 上へ折り返して 32（黄）を継ぎ足す
  const bx=PX+60,bz=300,k=2.4,bw=90;
  let pn=label('面積の 大きさ',PC,125,{size:24,color:C.dim,anchor:'middle'})+line(bx-20,bz,bx+PW-120,bz,{color:C.dim,w:2.5});
  pn+=rect(bx,bz-32*k,bw,32*k,{fill:C.v,fo:.3,stroke:C.v,sw:2,rx:2})+label('32',bx+bw/2,bz-16*k+10,{size:26,color:C.ink,anchor:'middle',weight:700});
  const h=32*k*mix(1,-1,f),x2=mix(bx+bw+40,bx,f),y2=bz-32*k*f;
  const col=f<.5?RED:C.hi;
  pn+=rect(x2,Math.min(y2,y2+h),bw,Math.abs(h),{fill:col,fo:.28,stroke:col,sw:2.5,rx:2});
  if(f<.05)pn+=label('−32',x2+bw/2,bz+16*k+10,{size:26,color:C.ink,anchor:'middle',weight:700});
  // 折り返した後は 32 の上に積む
  pn+=fade(seg(p,.28,.32),label('32',x2+bw/2,Math.min(y2,y2+h)+16*k+10,{size:26,color:C.ink,anchor:'middle',weight:700}));
  pn+=fade(seg(p,.32,.42),TN(`32+32=${cH('64\\ \\mathrm{m}')}`,bx+bw+200,bz-120,40));
  s+=panel(86,300,pn,1,C.hi);
  s+=goalTag(G3)+ANS3(seg(p,b,b+.08));
  return s;
 },
 // 19. 誤答 B → C → D を1枚ずつ
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),s1=W[1]?W[1][0]:.3,mid=s1+(1-s1)*.45;
  let s=base({a2:1,vT:6,xT:6})+vArea(0,4)+vArea(4,6,{col:RED,fo:.25})+label('32',X(2),Yr('v',4),{size:28,color:C.ink,anchor:'middle',weight:700})+label('−32',X(5.3),Yr('v',-14),{size:26,color:C.ink,anchor:'middle',weight:700});
  s+=panel(86,200,label('変位 ＝ 32 − 32 ＝ 0 m',PC,150,{size:28,color:C.x,anchor:'middle',weight:700})+label('道のり ＝ 32 ＋ 32 ＝ 64 m',PC,230,{size:28,color:C.hi,anchor:'middle',weight:700}),1);
  s+=wrongSeq(p,ctx,[['B','道のり 0 m',['戻った 分も 足す']],['C','32 m、32 m',['4 s まで しか 見ていない（4〜6 s に 32 m 戻る）']],['D','64 m、64 m',['−32 を ＋32 と して 変位に 足した']]],{win:[[0,s1],[s1,mid],[mid,1]],opts:{...WOPT,y:300}});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },

 // ===================== まとめ =====================
 // 20. a →（積分・C₁＝0）→ v →（積分・C₂＝0）→ x。x(2)＝16。v の段の 32 と −32 から 変位 0 m と 道のり 64 m へ線
 [K+'sum']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  const g1=seg(p,.02,.12),g2=seg(p,b,b+.08);
  let s=base({a2:1,vT:6,xT:6})+vArea(0,4,{g:g2})+vArea(4,6,{col:RED,fo:.25,g:g2});
  s+=fade(g1,dot(X(2),Yr('x',16),8,C.hi)+label('x(2) ＝ 16',X(2)+12,Yr('x',16)-8,{size:22,color:C.hi,weight:700}));
  s+=panel(86,180,stairs(PX+45,100,{lab1:'積分',lab2:'積分',d1:1,d2:1}),g1);
  s+=panel(280,100,label('符号付き：32 − 32',PC-90,320,{size:24,color:C.x,anchor:'middle',weight:700})+label('変位 0 m',PC+170,322,{size:30,color:C.x,anchor:'middle',weight:700})+label('（向きの 変わる 4 s で 分ける）',PC,360,{size:20,color:C.dim,anchor:'middle'}),g2,C.x);
  s+=panel(396,100,label('大きさで 足す：32 ＋ 32',PC-80,438,{size:24,color:C.hi,anchor:'middle',weight:700})+label('道のり 64 m',PC+175,440,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,b+.3,b+.38),C.hi);
  s+=fade(g2,line(X(2.6),Yr('v',6),PX,330,{color:C.x,w:2.5,dash:'6 6'}));
  s+=fade(seg(p,b+.3,b+.38),line(X(5.4),Yr('v',-20),PX,446,{color:C.hi,w:2.5,dash:'6 6'}));
  s+=answerRow([[1,'B','16 m'],[2,'D',''],[3,'A','変位 0 m、道のり 64 m']],{g:seg(p,.9,.97)});
  return s;
 },
};

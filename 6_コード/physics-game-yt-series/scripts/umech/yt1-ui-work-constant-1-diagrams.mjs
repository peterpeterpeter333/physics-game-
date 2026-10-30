// YouTube シリーズ「仕事・初級 1/2」(ys-ui-work-constant-1) — 図。Stage 1200×515.
// 色：力 F 緑、位置・距離 水色、仕事・エネルギー 橙（面積も橙）、速さ v 紫、時間 t 金、強調 黄、誤り 赤。
// 共通の部品（F–x グラフ・長方形・押す場面）は export して 2/2 でも使う（関数の export は図の登録に入らない）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,ground,wall,tex,texWidth} from './anim.mjs';
import {box,force,card,cross,check} from './yt1-ui-effective-component-1-diagrams.mjs';
import {vt,bar} from './yt1-ui-area-is-distance-1-diagrams.mjs';
import {axes} from './anim.mjs';

const K='ui-work-constant-1:';
export const cF=s=>`{\\color{${C.F}}{${s}}}`,cL=s=>`{\\color{${C.x}}{${s}}}`,cW=s=>`{\\color{${C.E}}{${s}}}`,cI=s=>`{\\color{${C.ink}}{${s}}}`;
export {card,cross,check};

// ---- F–x graph --------------------------------------------------------------------------
export function fx({x=120,y=430,w=500,h=300,xmax=3.6,ymax=3,ymin=0,xticks=[1,2,3],yticks=[1,2],g=1}={}){
 return axes({x,y,w,h,xmax,ymax,ymin,xticks,yticks,grid:true,g,xlabel:'位置 x [m]',ylabel:'力 F [N]',xcolor:C.x,ycolor:C.F});
}
// rectangle between the x axis and height F from x0 to x1, growing rightwards with g
export function area(A,x0,x1,F,{g=1,color=C.E,fo=.32,sw=2,dash=''}={}){
 if(g<=0.001)return '';
 const X0=A.X(x0),W=(A.X(x1)-X0)*clamp(g),y0=A.Y(0),y1=A.Y(F);
 const r=rect(X0,Math.min(y0,y1),W,Math.abs(y1-y0),{fill:color,fo,stroke:color,sw,rx:2});
 return dash?r.replace('/>',` stroke-dasharray="${dash}"/>`):r;
}
export function fline(A,x0,x1,F,{p=1,color=C.F,w=5}={}){return draw([[A.X(x0),A.Y(F)],[A.X(x1),A.Y(F)]],p,{color,w});}
// labels on a rectangle: height (green, left of the y axis side), width (cyan, below), area (orange, centre)
export function rectLabels(A,x0,x1,F,{gh=1,gw=1,ga=1,h='',w='',a='',asize=34}={}){
 let s='';const X0=A.X(x0),X1=A.X(x1),Y0=A.Y(0),Y1=A.Y(F);
 if(h)s+=fade(gh,line(X1+14,Y0,X1+14,Y1,{color:C.F,w:4})+label(h,X1+24,(Y0+Y1)/2+9,{size:26,color:C.F,weight:700}));
 if(w)s+=fade(gw,label(w,(X0+X1)/2,Y0+(F<0?-18:64),{size:26,color:C.x,anchor:'middle',weight:700}));
 if(a)s+=fade(ga,label(a,(X0+X1)/2,(Y0+Y1)/2+12,{size:asize,color:C.E,anchor:'middle',weight:700}));
 return s;
}

// ---- the push scene: box on a slick floor, pushed right ---------------------------------
export const FY=400,M=170,X0=250;          // floor y, px per metre, box right face at x = 0 m
export function floorM(mmax=3,{g=1,x1=60,x2=1000,ticks=true,x0=X0,m=M}={}){
 let s=ground(x1,x2,FY);
 if(ticks)for(let i=0;i<=mmax;i++)s+=fade(g,line(x0+m*i,FY-8,x0+m*i,FY+8,{color:C.x,w:3})+label(`${i} m`,x0+m*i,FY+74,{size:22,color:C.x,anchor:'middle'}));
 return s;
}
// box whose right face is at pos metres; push arrow (N newtons) touching its left face
export function pushed(pos,N,{g=1,x0=X0,m=M,sc=40,text=`${N} N`,bw=110,bh=90}={}){
 const bx=x0+m*pos,ty=FY-bh/2,L=N*sc;
 return box(bx,FY,{w:bw,h:bh})+arrow(bx-bw-L-6,ty,bx-bw-6,ty,{color:C.F,w:7,head:20,g,text,tsize:26,tdx:-L/2-20,tdy:-24});
}
export function distArrow(a,b,{g=1,x0=X0,m=M,text=''}={}){
 const x1=x0+m*a,x2=x0+m*b,y=FY+34;
 return fade(g,arrow(x1,y,x2,y,{color:C.x,w:4,head:14})+(text?label(text,(x1+x2)/2,FY-120,{size:28,color:C.x,anchor:'middle',weight:700}):''));
}
function stick(x,fy,{reach=70}={}){ // simple person facing right, hands at x+reach
 const hy=fy-150;
 return ring(x,fy-200,22,{color:C.ink,w:4})+line(x,fy-178,x-10,fy-90,{color:C.ink,w:5})
  +line(x-4,fy-150,x+reach,hy,{color:C.ink,w:5})+line(x-4,fy-140,x+reach,hy+14,{color:C.ink,w:5})
  +line(x-10,fy-90,x-50,fy,{color:C.ink,w:5})+line(x-10,fy-90,x+14,fy,{color:C.ink,w:5});
}
const fxMain=(o={})=>fx({x:120,y:430,w:500,h:300,xmax:3.6,ymax:3,xticks:[1,2,3],yticks:[1,2],...o});
const R=790; // right panel

export const ytUiWork1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  const u=seg(p,.1,.6);
  let s=floorM(0,{ticks:false,x1:60,x2:700})+pushed(mix(.2,1.6,u),2,{text:'力'});
  const bx=X0+M*1.6-55;
  s+=fade(seg(p,.45,.65),arrow(bx-40,140,bx-4,FY-100,{color:C.E,w:5,head:16})+label('エネルギーを 渡す',bx-60,125,{size:28,color:C.E,anchor:'middle',weight:700}));
  s+=card(760,110,400,250,label('その量 ＝ 仕事',960,175,{size:32,color:C.E,anchor:'middle',weight:700})
   +label('どう測る？',960,250,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'inner']:(p)=>{
  let s=label('内積の回',60,60,{size:24,color:C.dim});
  s+=ground(80,620,380)+box(300,380,{w:110,h:90})+arrow(300,335,470,335,{color:C.F,w:7,head:20,text:'10 N',tsize:26,tdx:-80,tdy:-24});
  s+=fade(seg(p,.05,.25),arrow(190,420,390,420,{color:C.x,w:4,head:14})+label('2 m',290,462,{size:26,color:C.x,anchor:'middle',weight:700}));
  s+=card(690,90,470,320,
   label('力と進む向きが そろうとき',925,145,{size:26,color:C.dim,anchor:'middle'})
   +tex(cW('W')+'='+cF('F')+cL('L'),925,225,{size:64,auto:false})
   +fade(seg(p,.45,.6),label('F：力の大きさ [N]',760,290,{size:26,color:C.F})+label('L：進んだ距離 [m]',760,335,{size:26,color:C.x}))
   +fade(seg(p,.7,.85),tex('10\\times2='+cW('20\\,\\mathrm{J}'),925,390,{size:34,auto:false})),seg(p,.1,.3));
  return s;
 },
 [K+'plan']:(p)=>{
  const items=[['①','グラフでは どこに見える？',C.E],['②','動かないと どうなる？',C.a],['③','力を倍？ 距離を倍？',C.F]];
  let s=label('今回 確かめること',600,90,{size:32,color:C.ink,anchor:'middle',weight:700})+tex(cW('W')+'='+cF('F')+cL('L'),600,160,{size:44,auto:false});
  items.forEach(([n,t,c],i)=>{const g=seg(p,.1+i*.22,.25+i*.22);s+=card(60+i*365,220,350,190,label(n,235+i*365,280,{size:34,color:c,anchor:'middle',weight:700})+label(t,235+i*365,350,{size:25,color:C.ink,anchor:'middle'}),g,c);});
  return s;
 },
 // ===== S2 2 N で 3 m =====
 [K+'push']:(p)=>{
  const u=seg(p,.3,.85);
  let s=floorM(3)+(u>0?fade(.3,box(X0,FY,{w:110,h:90})):'')+pushed(3*u,2,{g:seg(p,.05,.2)});
  s+=fade(seg(p,0,.15),label('つるつる（摩擦なし）',1000,FY+110,{size:22,color:C.dim,anchor:'end'}));
  s+=distArrow(0,3*u,{g:seg(p,.3,.4)});
  s+=card(820,70,340,170,label('F ＝ 2 N（一定）',990,130,{size:30,color:C.F,anchor:'middle',weight:700})+fade(seg(p,.8,.92),label('L ＝ 3 m',990,195,{size:30,color:C.x,anchor:'middle',weight:700})),seg(p,.1,.25));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=floorM(3)+fade(.3,box(X0,FY,{w:110,h:90}))+pushed(3,2)+distArrow(0,3);
  s+=card(820,70,340,170,label('F ＝ 2 N（一定）',990,130,{size:30,color:C.F,anchor:'middle',weight:700})+label('L ＝ 3 m',990,195,{size:30,color:C.x,anchor:'middle',weight:700}));
  s+=card(340,70,420,150,label('仕事 W は？',550,130,{size:34,color:C.E,anchor:'middle',weight:700})+label('予想してみよう',550,190,{size:26,color:C.hi,anchor:'middle'}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'calc']:(p)=>{
  let s=tex(cW('W')+'='+cF('F')+'\\times'+cL('L'),330,120,{size:60,auto:false,anchor:'start'});
  s+=fade(seg(p,.1,.3),tex('='+cF('2\\,\\mathrm{N}')+'\\times'+cL('3\\,\\mathrm{m}'),400,230,{size:56,auto:false,anchor:'start'}));
  s+=fade(seg(p,.1,.3),label('F ＝ 2 N を入れる',120,300,{size:24,color:C.F})+label('L ＝ 3 m を入れる',120,340,{size:24,color:C.x}));
  s+=fade(seg(p,.55,.75),tex('=\\;'+cW('6')+'\\;\\;?',400,340,{size:56,auto:false,anchor:'start'})+label('数：2 × 3 ＝ 6',760,345,{size:28,color:C.ink}));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=tex(cW('W')+'='+cF('2\\,\\mathrm{N}')+'\\times'+cL('3\\,\\mathrm{m}'),330,120,{size:56,auto:false,anchor:'start'});
  s+=fade(seg(p,.02,.25),tex('='+cW('6')+'\\,'+cF('\\mathrm{N}')+'\\cdot'+cL('\\mathrm{m}'),400,230,{size:56,auto:false,anchor:'start'})+label('単位も 掛ける：N × m ＝ N·m',760,238,{size:26,color:C.ink}));
  s+=card(250,300,700,150,tex('1\\,\\mathrm{N\\cdot m}=1\\,\\mathrm{J}',600,370,{size:52,auto:false,color:C.E})+label('ジュール（N·m に付けた名前）',600,425,{size:26,color:C.dim,anchor:'middle'}),seg(p,.5,.7),C.E);
  return s;
 },
 [K+'unit2']:(p)=>{
  let s=tex(cW('W')+'='+cF('2\\,\\mathrm{N}')+'\\times'+cL('3\\,\\mathrm{m}'),330,120,{size:56,auto:false,anchor:'start'});
  s+=tex('='+cW('6')+'\\,'+cF('\\mathrm{N}')+'\\cdot'+cL('\\mathrm{m}'),400,230,{size:56,auto:false,anchor:'start'});
  s+=fade(seg(p,.05,.25),tex('='+cW('6\\,\\mathrm{J}'),400,340,{size:64,auto:false,anchor:'start'})+highlight(385,295,texWidth('=6\\,\\mathrm{J}',64,false)+40,82,1,C.E));
  s+=fade(seg(p,.5,.7),label('単位を見れば',760,215,{size:26,color:C.dim})+label('力 × 距離 と分かる',760,258,{size:28,color:C.ink,weight:700}));
  return s;
 },
 [K+'tally']:(p)=>{
  const u=3*seg(p,.1,.85),k=Math.floor(u+1e-6);
  let s=floorM(3,{x2:840})+fade(.3,box(X0,FY,{w:110,h:90}))+pushed(u,2);
  for(let i=1;i<=3;i++){const g=clamp((u-i+1)*3);if(g<=0)continue;
   const x1=X0+M*(i-1),x2=X0+M*i;
   s+=fade(g,line(x1+6,FY+34,x2-6,FY+34,{color:C.x,w:4})+label(`＋2 J`,(x1+x2)/2,FY+74,{size:24,color:C.E,anchor:'middle'}));
  }
  // energy meter on the right
  const mx=900,my=380,hh=100;
  s+=rect(mx,my-3*hh,110,3*hh,{fill:'none',fo:0,stroke:C.faint,sw:2,rx:6})+label('仕事',mx+55,my+40,{size:24,color:C.E,anchor:'middle'});
  for(let i=1;i<=3;i++){const g=clamp(u-i+1);if(g<=0)continue;s+=rect(mx+6,my-(i-1)*hh-hh*g,98,hh*g-4,{fill:C.E,fo:.45,stroke:C.E,rx:4});
   if(g>.9)s+=label(`${2*i} J`,mx+130,my-(i-1)*hh-hh/2+10,{size:28,color:C.E,weight:700});}
  s+=fade(seg(p,.05,.15),label('1 m ごとに 2 J',mx-40,40+10,{size:26,color:C.ink}));
  return s;
 },
 [K+'energy']:(p)=>{
  let s=floorM(3,{ticks:false})+fade(.3,box(X0,FY,{w:110,h:90}))+pushed(3,2);
  const bx=X0+3*M-55,by=FY-45;
  s+=fade(seg(p,.05,.25),arrow(bx,120,bx,by-60,{color:C.E,w:6,head:18})+label('6 J のエネルギーが 箱へ',bx,100,{size:28,color:C.E,anchor:'middle',weight:700}));
  s+=card(130,110,390,150,label('仕事 ＝ 渡したエネルギー',325,170,{size:28,color:C.E,anchor:'middle',weight:700})+label('（こう考える）',325,220,{size:24,color:C.dim,anchor:'middle'}),seg(p,.15,.3));
  s+=card(830,110,330,150,label('理由は 中級で',995,170,{size:26,color:C.ink,anchor:'middle'})+label('運動方程式から',995,220,{size:26,color:C.hi,anchor:'middle'}),seg(p,.6,.75),C.hi);
  return s;
 },
 // ===== S3 グラフの長方形 =====
 [K+'axes']:(p)=>{
  const A=fxMain({g:seg(p,.05,.3)});
  let s=A.svg;
  s+=fade(seg(p,.3,.45),label('横軸：箱の位置 x',R,200,{size:30,color:C.x,weight:700}));
  s+=fade(seg(p,.6,.75),label('縦軸：押す力 F',R,270,{size:30,color:C.F,weight:700}));
  return s;
 },
 [K+'line']:(p)=>{
  const A=fxMain();
  let s=A.svg+fline(A,0,3,2,{p:seg(p,.1,.7)});
  s+=label('横軸：箱の位置 x',R,200,{size:30,color:C.x,weight:700})+label('縦軸：押す力 F',R,270,{size:30,color:C.F,weight:700});
  s+=fade(seg(p,.4,.6),label('どこでも 2 N',A.X(1.5),A.Y(2)-22,{size:26,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('高さ 2 の 水平な線',R,350,{size:30,color:C.ink}));
  return s;
 },
 [K+'rect']:(p)=>{
  const A=fxMain();
  let s=A.svg+area(A,0,3,2,{g:seg(p,.05,.35)})+fline(A,0,3,2);
  s+=rectLabels(A,0,3,2,{gh:seg(p,.3,.42),gw:seg(p,.38,.5),ga:seg(p,.55,.7),h:'縦 2 N',w:'横 3 m',a:'面積 6'});
  s+=card(R,110,380,200,label('縦 × 横',R+190,165,{size:28,color:C.dim,anchor:'middle'})+tex(cF('2')+'\\times'+cL('3')+'='+cW('6'),R+190,240,{size:52,auto:false}),seg(p,.55,.7));
  s+=fade(seg(p,.78,.9),label('＝ 仕事 6 J と同じ掛け算',R+190,370,{size:28,color:C.E,anchor:'middle',weight:700}));
  return s;
 },
 [K+'rectunit']:(p)=>{
  const A=fxMain();
  let s=A.svg+area(A,0,3,2)+fline(A,0,3,2)+rectLabels(A,0,3,2,{h:'縦 2 N',w:'横 3 m',a:'面積 6'});
  s+=card(R,110,380,260,label('面積の単位',R+190,160,{size:26,color:C.dim,anchor:'middle'})
   +tex(cF('\\mathrm{N}')+'\\times'+cL('\\mathrm{m}')+'=\\mathrm{N\\cdot m}',R+190,235,{size:44,auto:false})
   +fade(seg(p,.4,.6),tex('=\\,'+cW('\\mathrm{J}'),R+190,320,{size:52,auto:false})),seg(p,.02,.2));
  return s;
 },
 [K+'compare']:(p)=>{
  const B=vt({x:90,y:420,w:330,h:230,xmax:4.6,ymax:4.2,xticks:[1,2,3,4],yticks:[1,2,3],g:1});
  let s=B.svg+bar(B,0,4,3,{g:seg(p,.1,.4),color:C.x})+line(B.X(0),B.Y(3),B.X(4),B.Y(3),{color:C.v,w:5});
  s+=label('積分の回',90,70,{size:24,color:C.dim});
  s+=fade(seg(p,.35,.55),label('3 m/s',B.X(4)+12,B.Y(1.5)+8,{size:24,color:C.v,weight:700})+label('4 s',B.X(2),B.Y(0)+62,{size:24,color:C.t,anchor:'middle',weight:700})+label('12 m',B.X(2),B.Y(1.5)+12,{size:34,color:C.x,anchor:'middle',weight:700}));
  const A=fx({x:720,y:420,w:300,h:230,xmax:3.6,ymax:3,xticks:[1,2,3],yticks:[1,2],g:seg(p,.45,.6)});
  s+=A.svg+area(A,0,3,2,{g:seg(p,.55,.75)})+fade(seg(p,.5,.6),fline(A,0,3,2));
  s+=fade(seg(p,.7,.85),label('2 N',A.X(3)+12,A.Y(1)+8,{size:24,color:C.F,weight:700})+label('3 m',A.X(1.5),A.Y(0)+62,{size:24,color:C.x,anchor:'middle',weight:700})+label('6 J',A.X(1.5),A.Y(1)+12,{size:34,color:C.E,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),label('今回',720,70,{size:24,color:C.dim}));
  return s;
 },
 [K+'compare2']:(p)=>{
  const B=vt({x:90,y:420,w:330,h:230,xmax:4.6,ymax:4.2,xticks:[1,2,3,4],yticks:[1,2,3]});
  let s=B.svg+bar(B,0,4,3,{color:C.x})+line(B.X(0),B.Y(3),B.X(4),B.Y(3),{color:C.v,w:5});
  s+=label('積分の回',90,70,{size:24,color:C.dim})+label('3 m/s',B.X(4)+12,B.Y(1.5)+8,{size:24,color:C.v,weight:700})+label('4 s',B.X(2),B.Y(0)+62,{size:24,color:C.t,anchor:'middle',weight:700})+label('12 m',B.X(2),B.Y(1.5)+12,{size:34,color:C.x,anchor:'middle',weight:700});
  const A=fx({x:720,y:420,w:300,h:230,xmax:3.6,ymax:3,xticks:[1,2,3],yticks:[1,2]});
  s+=A.svg+area(A,0,3,2)+fline(A,0,3,2)+label('今回',720,70,{size:24,color:C.dim})
   +label('2 N',A.X(3)+12,A.Y(1)+8,{size:24,color:C.F,weight:700})+label('3 m',A.X(1.5),A.Y(0)+62,{size:24,color:C.x,anchor:'middle',weight:700})+label('6 J',A.X(1.5),A.Y(1)+12,{size:34,color:C.E,anchor:'middle',weight:700});
  s+=card(470,190,200,110,label('同じ 長方形',570,235,{size:26,color:C.ink,anchor:'middle',weight:700})+label('違う 意味',570,280,{size:26,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.4,.55),label('速さ × 時間 ＝ 距離',330,72,{size:26,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('力 × 位置の変化 ＝ 仕事',930,72,{size:26,color:C.E,anchor:'middle',weight:700}));
  return s;
 },
 [K+'notime']:(p)=>{
  const A=fxMain();
  let s=A.svg+area(A,0,3,2)+fline(A,0,3,2)+rectLabels(A,0,3,2,{a:'6 J'});
  s+=fade(seg(p,.02,.2),highlight(648,A.Y(0)-22,140,46,1,C.x));
  s+=card(R,110,380,300,
   check(R+40,175)+label('力 × 位置の変化',R+80,185,{size:28,color:C.ink})+label('＝ 仕事',R+80,230,{size:28,color:C.E,weight:700})
   +fade(seg(p,.5,.65),cross(R+40,300)+label('力 × 時間',R+80,310,{size:28,color:C.ink})+label('仕事ではない',R+80,355,{size:28,color:C.a,weight:700})),seg(p,.1,.3));
  return s;
 },
 [K+'quiz']:(p)=>{
  const A=fx({x:120,y:440,w:500,h:320,xmax:3.6,ymax:6,xticks:[1,2,3],yticks:[1,2,3,4,5]});
  let s=A.svg;
  s+=card(R-40,110,420,200,label('確かめ',R+170,160,{size:26,color:C.hi,anchor:'middle'})+label('5 N で 2 m',R+170,225,{size:34,color:C.ink,anchor:'middle',weight:700})+label('長方形は？ 仕事は？',R+170,280,{size:28,color:C.E,anchor:'middle'}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'quizans']:(p)=>{
  const A=fx({x:120,y:440,w:500,h:320,xmax:3.6,ymax:6,xticks:[1,2,3],yticks:[1,2,3,4,5]});
  let s=A.svg+area(A,0,2,5,{g:seg(p,.05,.35)})+fline(A,0,2,5,{p:seg(p,0,.2)});
  s+=rectLabels(A,0,2,5,{gh:seg(p,.1,.25),gw:seg(p,.2,.35),ga:seg(p,.45,.6),h:'縦 5',w:'横 2',a:'10 J'});
  s+=card(R-40,110,420,200,label('5 N で 2 m',R+170,165,{size:30,color:C.ink,anchor:'middle'})+fade(seg(p,.45,.6),tex(cF('5')+'\\times'+cL('2')+'='+cW('10\\,\\mathrm{J}'),R+170,250,{size:48,auto:false})));
  return s;
 },
 // ===== S4 動かなければ =====
 [K+'wall']:(p)=>{
  let s=ground(60,1000,FY)+wall(700,110,FY)+stick(560,FY,{reach:136});
  s+=fade(seg(p,.2,.4),arrow(590,FY-150,696,FY-150,{color:C.F,w:8,head:22})+label('200 N',610,FY-240,{size:30,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.8),label('びくともしない',850,250,{size:30,color:C.ink,weight:700})+label('（動いた距離 0 m）',850,300,{size:26,color:C.x}));
  return s;
 },
 [K+'wallq']:(p)=>{
  let s=ground(60,1000,FY)+wall(700,110,FY)+stick(560,FY,{reach:136})+arrow(590,FY-150,696,FY-150,{color:C.F,w:8,head:22})+label('200 N',610,FY-240,{size:30,color:C.F,anchor:'middle',weight:700});
  s+=card(760,110,400,190,label('2 N の 100 倍',960,165,{size:28,color:C.F,anchor:'middle'})+label('仕事は？',960,240,{size:36,color:C.E,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'wall0']:(p)=>{
  let s=ground(60,660,FY)+wall(500,110,FY)+stick(360,FY,{reach:136})+arrow(390,FY-150,496,FY-150,{color:C.F,w:8,head:22})+label('200 N',410,FY-240,{size:30,color:C.F,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.2),label('L ＝ 0 m',500,FY+50,{size:28,color:C.x,anchor:'middle',weight:700}));
  s+=card(640,110,520,300,
   tex(cW('W')+'='+cF('200\\,\\mathrm{N}')+'\\times'+cL('0\\,\\mathrm{m}'),900,190,{size:44,auto:false})
   +fade(seg(p,.25,.4),tex('='+cW('0\\,\\mathrm{J}'),900,280,{size:56,auto:false}))
   +fade(seg(p,.6,.75),label('力が大きくても 仕事は 0',900,370,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'wallgraph']:(p)=>{
  const A=fx({x:120,y:440,w:500,h:320,xmax:3.6,ymax:240,xticks:[1,2,3],yticks:[100,200]});
  let s=A.svg;
  s+=fade(seg(p,.05,.2),dot(A.X(0),A.Y(200),10,C.F)+line(A.X(0),A.Y(0),A.X(0),A.Y(200),{color:C.F,w:4,dash:'8 6'})+label('200 N',A.X(0)+18,A.Y(200)-14,{size:26,color:C.F,weight:700}));
  s+=fade(seg(p,.3,.45),area(A,0,1,200,{color:C.faint,fo:.12,dash:'8 6'})+cross(A.X(.5),A.Y(100),22,C.a));
  s+=fade(seg(p,.35,.5),label('横の長さ 0 m',A.X(0)+10,A.Y(0)+66,{size:26,color:C.x,weight:700}));
  s+=card(R-40,120,420,200,label('長方形が つぶれる',R+170,180,{size:30,color:C.ink,anchor:'middle',weight:700})+label('面積 0 ＝ 仕事 0 J',R+170,250,{size:32,color:C.E,anchor:'middle',weight:700}),seg(p,.6,.75));
  return s;
 },
 [K+'tired']:(p)=>{
  let s=ground(60,900,FY)+wall(620,110,FY)+stick(480,FY,{reach:136})+arrow(510,FY-150,616,FY-150,{color:C.F,w:8,head:22});
  const g=seg(p,.35,.55);
  s+=fade(g,ring(475,FY-130,70,{color:C.E,w:3,dash:'6 6'})+label('筋肉が エネルギーを使う',210,90,{size:28,color:C.E,anchor:'middle',weight:700}));
  for(let i=0;i<3;i++){const x=400+i*40,ph=p*12+i;s+=fade(seg(p,.6,.8),draw(Array.from({length:12},(_,k)=>[x+8*Math.sin(ph+k*.8),FY-230-k*8]),1,{color:C.a,w:3}));}
  s+=fade(seg(p,.65,.8),label('熱',520,FY-300,{size:30,color:C.a,weight:700}));
  s+=label('疲れる…',300,FY+60,{size:28,color:C.dim,anchor:'middle'});
  return s;
 },
 [K+'tired2']:(p)=>{
  let s=ground(60,900,FY)+wall(620,110,FY)+stick(480,FY,{reach:136})+arrow(510,FY-150,616,FY-150,{color:C.F,w:8,head:22});
  s+=ring(475,FY-130,70,{color:C.E,w:3,dash:'6 6'})+label('筋肉が エネルギーを使う',210,90,{size:28,color:C.E,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.2),label('壁へ 0 J',680,FY-240,{size:30,color:C.E,weight:700})+cross(660,FY-160,18,C.a));
  s+=card(760,200,400,190,label('仕事が数えるのは',960,250,{size:26,color:C.dim,anchor:'middle'})+label('物体に 渡した',960,305,{size:30,color:C.E,anchor:'middle',weight:700})+label('エネルギー',960,350,{size:30,color:C.E,anchor:'middle',weight:700}),seg(p,.45,.6),C.E);
  return s;
 },
 [K+'contrast']:(p)=>{
  let s=card(80,90,500,340,label('200 N・0 m',330,150,{size:30,color:C.F,anchor:'middle',weight:700})
   +ground(160,500,330)+wall(420,200,330)+arrow(300,280,414,280,{color:C.F,w:8,head:22})
   +label('仕事 0 J',330,400,{size:34,color:C.E,anchor:'middle',weight:700}),1);
  s+=card(620,90,500,340,label('2 N・3 m',870,150,{size:30,color:C.F,anchor:'middle',weight:700})
   +ground(660,1080,330)+fade(.3,box(760,330,{w:80,h:60}))+box(1010,330,{w:80,h:60})+arrow(870,300,926,300,{color:C.F,w:6,head:16})+arrow(760,350,1010,350,{color:C.x,w:4,head:12})
   +label('仕事 6 J',870,400,{size:34,color:C.E,anchor:'middle',weight:700}),seg(p,.05,.2));
  s+=fade(seg(p,.55,.7),label('力の大きさ だけでは 決まらない',600,480,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S5 力を倍か、距離を倍か =====
 [K+'double']:(p)=>{
  const A=fx({x:120,y:440,w:560,h:320,xmax:6.6,ymax:4.6,xticks:[1,2,3,4,5,6],yticks:[1,2,3,4]});
  let s=A.svg+area(A,0,3,2)+fline(A,0,3,2)+rectLabels(A,0,3,2,{a:'6 J',asize:30});
  s+=card(R+40,110,340,200,label('2 N・3 m ＝ 6 J',R+210,165,{size:28,color:C.ink,anchor:'middle'})+label('12 J にするには？',R+210,245,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'doubleF']:(p)=>{
  const A=fx({x:120,y:440,w:560,h:320,xmax:6.6,ymax:4.6,xticks:[1,2,3,4,5,6],yticks:[1,2,3,4]});
  const u=seg(p,.05,.4),F=mix(2,4,u);
  let s=A.svg+area(A,0,3,F)+fline(A,0,3,F)+fade(u,area(A,0,3,2,{fo:0,color:C.dim,dash:'6 6'}));
  s+=fade(seg(p,.4,.55),rectLabels(A,0,3,4,{h:'4 N',a:'12 J',asize:32}));
  s+=card(R+40,110,340,200,label('力を 2 倍',R+210,165,{size:30,color:C.F,anchor:'middle',weight:700})+fade(seg(p,.45,.6),tex(cF('4')+'\\times'+cL('3')+'='+cW('12'),R+210,250,{size:46,auto:false})),seg(p,0,.15));
  return s;
 },
 [K+'doubleL']:(p)=>{
  const A=fx({x:120,y:440,w:560,h:320,xmax:6.6,ymax:4.6,xticks:[1,2,3,4,5,6],yticks:[1,2,3,4]});
  const u=seg(p,.05,.4),L=mix(3,6,u);
  let s=A.svg+area(A,0,L,2)+fline(A,0,L,2)+fade(u,area(A,0,3,2,{fo:0,color:C.dim,dash:'6 6'}));
  s+=fade(seg(p,.4,.55),rectLabels(A,0,6,2,{w:'6 m',a:'12 J',asize:32}));
  s+=card(R+40,110,340,200,label('距離を 2 倍',R+210,165,{size:30,color:C.x,anchor:'middle',weight:700})+fade(seg(p,.45,.6),tex(cF('2')+'\\times'+cL('6')+'='+cW('12'),R+210,250,{size:46,auto:false})),seg(p,0,.15));
  return s;
 },
 [K+'side']:(p)=>{
  const o={y:430,w:330,h:250,xmax:6.6,ymax:4.6,xticks:[3,6],yticks:[2,4]};
  const A=fx({...o,x:110}),B=fx({...o,x:670});
  let s=A.svg+B.svg;
  s+=area(A,0,3,4)+fline(A,0,3,4)+area(A,0,3,2,{fo:0,color:C.dim,dash:'6 6'})+area(B,0,6,2)+fline(B,0,6,2)+area(B,0,3,2,{fo:0,color:C.dim,dash:'6 6'});
  s+=label('縦に 2 倍：4 N × 3 m',A.X(3.3),70,{size:26,color:C.F,anchor:'middle',weight:700})+label('横に 2 倍：2 N × 6 m',B.X(3.3),70,{size:26,color:C.x,anchor:'middle',weight:700});
  s+=fade(seg(p,.4,.6),label('12',A.X(1.5),A.Y(2)+14,{size:40,color:C.E,anchor:'middle',weight:700})+label('12',B.X(3),B.Y(1)+14,{size:40,color:C.E,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('＝',600,280,{size:48,color:C.E,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.25),label('点線：元の 6 J',600,505,{size:22,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'thin']:(p)=>{
  const A=fx({x:110,y:440,w:760,h:320,xmax:13,ymax:4.6,xticks:[3,6,9,12],yticks:[1,2,3,4]});
  let s=A.svg+area(A,0,3,4,{fo:0,color:C.dim,dash:'6 6'})+area(A,0,6,2,{fo:0,color:C.dim,dash:'6 6'});
  s+=area(A,0,12,1,{g:seg(p,.05,.4)})+fline(A,0,12,1,{p:seg(p,.05,.4)});
  s+=fade(seg(p,.4,.55),label('1 N × 12 m',A.X(6),A.Y(1)-16,{size:26,color:C.F,anchor:'middle',weight:700})+label('12 J',A.X(6),A.Y(.5)+11,{size:30,color:C.E,anchor:'middle',weight:700}));
  s+=fade(seg(p,.05,.2),label('点線：4 × 3、2 × 6',A.X(4.5),A.Y(3.5),{size:22,color:C.dim}));
  return s;
 },
 [K+'prop']:(p)=>{
  let s=tex(cW('W')+'='+cF('F')+cL('L'),600,110,{size:64,auto:false});
  s+=card(170,190,390,190,label('力を 2 倍',365,250,{size:32,color:C.F,anchor:'middle',weight:700})+label('→ 仕事 2 倍',365,320,{size:32,color:C.E,anchor:'middle',weight:700}),seg(p,.05,.2));
  s+=card(640,190,390,190,label('距離を 2 倍',835,250,{size:32,color:C.x,anchor:'middle',weight:700})+label('→ 仕事 2 倍',835,320,{size:32,color:C.E,anchor:'middle',weight:700}),seg(p,.2,.35));
  s+=fade(seg(p,.6,.75),label('両方に 比例する形 ＝ 掛け算',600,450,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'quiz2']:(p)=>{
  const A=fx({x:120,y:440,w:500,h:320,xmax:3.6,ymax:6.6,xticks:[1,2,3],yticks:[2,4,6]});
  let s=A.svg+area(A,0,3,2,{fo:.15})+fline(A,0,3,2)+rectLabels(A,0,3,2,{a:'6 J',asize:28});
  s+=card(R-40,110,420,230,label('問題',R+170,160,{size:26,color:C.hi,anchor:'middle'})+label('力を 3 倍（6 N）',R+170,220,{size:30,color:C.F,anchor:'middle',weight:700})+label('距離を 半分（1.5 m）',R+170,270,{size:30,color:C.x,anchor:'middle',weight:700})+label('仕事は？',R+170,320,{size:28,color:C.E,anchor:'middle'}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'quiz2ans']:(p)=>{
  const A=fx({x:120,y:440,w:500,h:320,xmax:3.6,ymax:6.6,xticks:[1,2,3],yticks:[2,4,6]});
  let s=A.svg+area(A,0,3,2,{fo:0,color:C.dim,dash:'6 6'})+area(A,0,1.5,6,{g:seg(p,.05,.3)})+fline(A,0,1.5,6,{p:seg(p,0,.2)});
  s+=rectLabels(A,0,1.5,6,{ga:seg(p,.3,.45),a:'9 J',asize:36});
  s+=card(R-40,110,420,230,tex(cF('6')+'\\times'+cL('1.5')+'='+cW('9\\,\\mathrm{J}'),R+170,190,{size:48,auto:false})
   +fade(seg(p,.5,.65),label('元の 6 J の',R+170,260,{size:26,color:C.dim,anchor:'middle'})+label('3 倍 × 半分 ＝ 1.5 倍',R+170,305,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'sum']:(p)=>{
  let s=card(90,90,1020,150,tex(cW('W')+'='+cF('F')+cL('L'),330,170,{size:60,auto:false})+label('力と進む向きが そろうとき',700,150,{size:28,color:C.dim})+tex('\\mathrm{N\\cdot m}='+cW('\\mathrm{J}'),800,205,{size:40,auto:false}),seg(p,0,.2));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(90,90,1020,150,tex(cW('W')+'='+cF('F')+cL('L'),330,170,{size:60,auto:false})+label('力と進む向きが そろうとき',700,150,{size:28,color:C.dim})+tex('\\mathrm{N\\cdot m}='+cW('\\mathrm{J}'),800,205,{size:40,auto:false}));
  const items=[['長方形の 面積',C.E],['動かなければ 0',C.a],['F か L を 2 倍 → 2 倍',C.F]];
  items.forEach(([t,c],i)=>{s+=card(60+i*365,280,350,130,label(t,235+i*365,355,{size:26,color:c,anchor:'middle',weight:700}),seg(p,.05+i*.25,.2+i*.25),c);});
  return s;
 },
 [K+'next']:(p)=>{
  let s=ground(60,1000,FY)+box(430,FY,{w:110,h:90})+arrow(430,FY+34,640,FY+34,{color:C.x,w:4,head:14})+label('進む向き',535,FY+80,{size:24,color:C.x,anchor:'middle'});
  s+=fade(seg(p,.35,.55),arrow(320,FY-45,200,FY-45,{color:C.a,w:7,head:20})+label('逆向きの力',310,FY-105,{size:26,color:C.a,weight:700,anchor:'end'}));
  s+=card(740,100,400,170,label('仕事は どうなる？',940,170,{size:32,color:C.hi,anchor:'middle',weight:700})+label('長方形は どこに？',940,230,{size:28,color:C.E,anchor:'middle'}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'next2']:(p)=>{
  let s=ground(60,1000,FY)+box(430,FY,{w:110,h:90})+arrow(430,FY+34,640,FY+34,{color:C.x,w:4,head:14})+label('進む向き',535,FY+80,{size:24,color:C.x,anchor:'middle'});
  s+=arrow(320,FY-45,200,FY-45,{color:C.a,w:7,head:20})+label('逆向きの力',310,FY-105,{size:26,color:C.a,weight:700,anchor:'end'});
  s+=fade(seg(p,.05,.25),force(430,FY-45,30,4,40,{text:'斜めの力',tdx:10,tdy:-10}));
  s+=card(740,100,400,170,label('仕事は どうなる？',940,170,{size:32,color:C.hi,anchor:'middle',weight:700})+label('長方形は どこに？',940,230,{size:28,color:C.E,anchor:'middle'}),1,C.hi);
  return s;
 },
};

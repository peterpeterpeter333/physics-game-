// YouTube シリーズ「仕事・初級 2/2」(ys-ui-work-constant-2) — 図。Stage 1200×515.
// 色：力 F 緑、位置・距離 水色、正の仕事・エネルギー 橙、負の仕事 赤、影（進む向きの成分）黄、直角な成分 桃、速さ v 紫、時間 t 金。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,ground,tex,texWidth} from './anim.mjs';
import {box,shadow,lamp} from './yt1-ui-effective-component-1-diagrams.mjs';
import {vt,bar,steps} from './yt1-ui-area-is-distance-1-diagrams.mjs';
import {fx,area,fline,rectLabels,cF,cL,cW,card,cross,check} from './yt1-ui-work-constant-1-diagrams.mjs';

const K='ui-work-constant-2:';
const NEG=C.a,PP=C.p,AL=C.hi;
const cN=s=>`{\\color{${NEG}}{${s}}}`,cA=s=>`{\\color{${AL}}{${s}}}`,cP=s=>`{\\color{${PP}}{${s}}}`,cV=s=>`{\\color{${C.v}}{${s}}}`;
const rad=d=>d*Math.PI/180;
const FY=400,M=170,X0=250;
function floorTicks(mmax,{x1=60,x2=1000,g=1}={}){
 let s=ground(x1,x2,FY);
 for(let i=0;i<=mmax;i++)s+=fade(g,line(X0+M*i,FY-8,X0+M*i,FY+8,{color:C.x,w:3})+label(`${i} m`,X0+M*i,FY+74,{size:22,color:C.x,anchor:'middle'}));
 return s;
}
const bx=pos=>X0+M*pos; // right face of the box
// friction arrow on the bottom of the box, pointing left (1 N = 60 px)
function friction(pos,{g=1,N=1,text='摩擦 1 N'}={}){const x=bx(pos)-110,y=FY-12;return arrow(x,y,x-N*60,y,{color:C.F,w:6,head:18,g})+fade(g,label(text,x-N*60-8,y-6,{size:24,color:C.F,anchor:'end'}));}
function pushArrow(pos,N,{g=1,text=`${N} N`}={}){const x=bx(pos)-110-6,y=FY-60,L=N*40;return arrow(x-L,y,x,y,{color:C.F,w:7,head:20,g,text,tsize:26,tdx:-L/2-20,tdy:-24});}
const distA=(a,b,g=1)=>fade(g,arrow(bx(a),FY+34,bx(b),FY+34,{color:C.x,w:4,head:14}));
const fxs=(o={})=>fx({x:120,y:300,w:500,h:220,xmax:3.6,ymax:3.2,ymin:-2.2,xticks:[1,2,3],yticks:[-2,-1,1,2,3],...o});
const R=790;

export const ytUiWork2Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  const A=fx({x:120,y:430,w:500,h:300,xmax:3.6,ymax:3,xticks:[1,2,3],yticks:[1,2]});
  let s=A.svg+area(A,0,3,2,{g:seg(p,.05,.3)})+fline(A,0,3,2)+rectLabels(A,0,3,2,{h:'2 N',w:'3 m',a:'6 J',ga:seg(p,.25,.4)});
  s+=card(R,120,370,180,label('前回',R+185,165,{size:24,color:C.dim,anchor:'middle'})+tex(cW('W')+'='+cF('F')+cL('L'),R+185,245,{size:56,auto:false}),seg(p,.4,.55));
  s+=fade(seg(p,.6,.75),label('向きが そろった場合',R+185,350,{size:26,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'question']:(p)=>{
  let s='';
  s+=fade(seg(p,.1,.3),ground(80,520,360)+box(320,360,{w:100,h:80})+arrow(320,395,460,395,{color:C.x,w:4,head:14})+arrow(210,320,110,320,{color:NEG,w:7,head:20})+label('逆向きの力',150,290,{size:26,color:NEG,weight:700,anchor:'middle'}));
  s+=fade(seg(p,.4,.6),ground(660,1120,360)+box(860,360,{w:100,h:80})+arrow(860,395,1000,395,{color:C.x,w:4,head:14})+arrow(860,320,860+104,320-60,{color:C.F,w:7,head:20})+label('斜めの力',980,250,{size:26,color:C.F,weight:700}));
  s+=fade(seg(p,.1,.3),label('進む向き',390,440,{size:22,color:C.x,anchor:'middle'}))+fade(seg(p,.4,.6),label('進む向き',930,440,{size:22,color:C.x,anchor:'middle'}));
  s+=fade(seg(p,.7,.85),label('仕事は どうなる？',600,110,{size:36,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'plan']:(p)=>{
  let s=card(90,90,480,300,label('内積の回',330,145,{size:26,color:C.dim,anchor:'middle'})
   +label('逆向きの摩擦 3 N・2 m',330,215,{size:28,color:C.ink,anchor:'middle'})
   +tex('3\\times2\\times(-1)='+cN('-6\\,\\mathrm{J}'),330,300,{size:40,auto:false}),seg(p,0,.15));
  s+=card(630,90,480,300,label('今回',870,145,{size:26,color:C.hi,anchor:'middle'})
   +label('マイナスの 意味を',870,215,{size:30,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.55,.7),label('グラフ と エネルギー で',870,290,{size:30,color:C.E,anchor:'middle',weight:700})),seg(p,.4,.55),C.hi);
  return s;
 },
 // ===== S2 逆向きの力 =====
 [K+'fric']:(p)=>{
  const u=seg(p,.25,.85),pos=2*u;
  let s=floorTicks(2)+(u>0?fade(.3,box(bx(0),FY,{w:110,h:90})):'')+box(bx(pos),FY,{w:110,h:90});
  s+=arrow(bx(pos)-55,FY-120,bx(pos)+60,FY-120,{color:C.v,w:5,head:16,g:seg(p,0,.15)})+fade(seg(p,0,.15),label('右へ すべる',bx(pos)-55,FY-140,{size:24,color:C.v,anchor:'middle'}));
  s+=friction(pos,{g:seg(p,.1,.25)});
  s+=distA(0,pos,seg(p,.25,.35));
  s+=card(820,90,340,170,label('摩擦 左向き 1 N',990,150,{size:28,color:C.F,anchor:'middle',weight:700})+fade(seg(p,.8,.92),label('右へ 2 m',990,215,{size:28,color:C.x,anchor:'middle',weight:700})),seg(p,.15,.3));
  return s;
 },
 [K+'sign']:(p)=>{
  let s=floorTicks(2)+fade(.3,box(bx(0),FY,{w:110,h:90}))+box(bx(2),FY,{w:110,h:90})+friction(2)+distA(0,2);
  s+=fade(seg(p,.05,.25),arrow(620,110,820,110,{color:C.ink,w:4,head:16})+label('右向き ＝ 正（＋）',720,80,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=card(840,160,320,150,tex(cF('F')+'='+cN('-1\\,\\mathrm{N}'),1000,225,{size:48,auto:false})+label('左向き → 負',1000,285,{size:24,color:C.dim,anchor:'middle'}),seg(p,.5,.65));
  return s;
 },
 [K+'fricW']:(p)=>{
  let s=tex(cW('W')+'='+cF('F')+'\\times'+cL('L'),380,130,{size:56,auto:false,anchor:'start'});
  s+=fade(seg(p,.05,.3),tex('=('+cN('-1\\,\\mathrm{N}')+')\\times'+cL('2\\,\\mathrm{m}'),450,240,{size:52,auto:false,anchor:'start'}));
  s+=fade(seg(p,.4,.6),tex('='+cN('-2\\,\\mathrm{J}'),450,350,{size:60,auto:false,anchor:'start'})+highlight(435,305,texWidth('=-2\\,\\mathrm{J}',60,false)+40,80,1,NEG));
  return s;
 },
 [K+'fricgraph']:(p)=>{
  const A=fx({x:120,y:320,w:500,h:240,xmax:3.6,ymax:2,ymin:-1.8,xticks:[1,2,3],yticks:[-1,1]});
  let s=A.svg+fline(A,0,2,-1,{p:seg(p,.05,.3)});
  s+=fade(seg(p,.2,.35),label('F ＝ −1 N',A.X(2)+16,A.Y(-1)+8,{size:26,color:C.F,weight:700}));
  s+=area(A,0,2,-1,{g:seg(p,.45,.7),color:NEG,fo:.35});
  s+=fade(seg(p,.7,.85),label('−2 J',A.X(1),A.Y(-.5)+12,{size:34,color:NEG,anchor:'middle',weight:700}));
  s+=card(R,120,380,220,label('横軸の 下の 長方形',R+190,180,{size:28,color:C.ink,anchor:'middle'})+fade(seg(p,.7,.85),label('面積を 負と 数える',R+190,250,{size:30,color:NEG,anchor:'middle',weight:700})),seg(p,.45,.6));
  return s;
 },
 [K+'fricgraph2']:(p)=>{
  const B=vt({x:100,y:300,w:330,h:200,xmax:3.6,ymax:3.6,ymin:-2.6,xticks:[1,2,3],yticks:[-2,3]});
  let s=B.svg.replace('速さ v','速度 v')+bar(B,0,2,3,{color:C.x})+bar(B,2,3,-2,{color:NEG,fo:.35})+steps(B,[[0,2,3],[2,3,-2]],{color:C.v});
  s+=label('積分の回',260,40,{size:24,color:C.dim})+label('左へ 戻る',B.X(2.5),B.Y(-2)+36,{size:22,color:NEG,anchor:'middle'});
  const A=fx({x:720,y:300,w:300,h:200,xmax:3.6,ymax:2,ymin:-1.8,xticks:[1,2,3],yticks:[-1,1],g:seg(p,.3,.45)});
  s+=A.svg+fade(seg(p,.3,.45),fline(A,0,2,-1)+area(A,0,2,-1,{color:NEG,fo:.35})+label('−2 J',A.X(1),A.Y(-.5)+12,{size:28,color:NEG,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.45),label('今回',860,40,{size:24,color:C.dim}));
  s+=fade(seg(p,.6,.75),label('どちらも 横軸の下 ＝ 負',600,500,{size:28,color:NEG,anchor:'middle',weight:700}));
  return s;
 },
 [K+'meaning']:(p)=>{
  let s='';
  const b=(x,y)=>rect(x-60,y-50,120,100,{fill:'#7a5a3c',fo:.55,stroke:'#c9a27a',sw:3,rx:6})+label('物体',x,y+10,{size:26,color:C.ink,anchor:'middle'});
  s+=fade(seg(p,.02,.2),b(300,300)+arrow(90,300,230,300,{color:C.E,w:8,head:24})+label('＋ の仕事',160,200,{size:32,color:C.E,anchor:'middle',weight:700})+label('渡す',160,260,{size:28,color:C.E,anchor:'middle'}));
  s+=fade(seg(p,.5,.7),b(860,300)+arrow(930,300,1100,300,{color:NEG,w:8,head:24})+label('− の仕事',1020,200,{size:32,color:NEG,anchor:'middle',weight:700})+label('取り出す',1020,260,{size:28,color:NEG,anchor:'middle'}));
  s+=fade(seg(p,.02,.2),label('エネルギーが 入る',300,420,{size:26,color:C.E,anchor:'middle'}))+fade(seg(p,.5,.7),label('エネルギーが 出る',860,420,{size:26,color:NEG,anchor:'middle'}));
  return s;
 },
 [K+'meaning2']:(p)=>{
  const u=seg(p,.05,.7),pos=2*Math.sin(u*Math.PI/2),v=mix(1,.35,u);
  let s=floorTicks(2)+box(bx(pos),FY,{w:110,h:90})+friction(pos);
  s+=arrow(bx(pos)-55,FY-120,bx(pos)-55+115*v,FY-120,{color:C.v,w:5,head:16})+label('速さ',bx(pos)-55,FY-140,{size:24,color:C.v,anchor:'middle'});
  s+=fade(seg(p,.3,.5),label('遅くなる',bx(pos)+80,FY-140,{size:26,color:C.v,weight:700}));
  for(let i=0;i<3;i++){const x=bx(pos)+14+i*24,ph=p*14+i;s+=fade(seg(p,.55,.75),draw(Array.from({length:8},(_,k)=>[x+6*Math.sin(ph+k*.9),FY-4-k*7]),1,{color:NEG,w:3}));}
  s+=fade(seg(p,.6,.75),label('床と箱が 温まる',bx(pos)+60,FY-190,{size:26,color:NEG,anchor:'middle',weight:700}));
  s+=card(820,90,340,150,label('摩擦が 箱から',990,145,{size:26,color:C.ink,anchor:'middle'})+label('2 J 取り出す',990,200,{size:32,color:NEG,anchor:'middle',weight:700}),seg(p,0,.15),NEG);
  return s;
 },
 [K+'wrong']:(p)=>{
  let s=card(200,90,800,140,tex('1\\times2=+2\\,\\mathrm{J}',520,165,{size:52,auto:false})+cross(820,160,22),seg(p,0,.15),NEG);
  s+=fade(seg(p,.3,.5),label('渡した？ 取り出した？',600,300,{size:34,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.75),label('向きの 情報が 消える',600,380,{size:32,color:NEG,anchor:'middle',weight:700}));
  s+=fade(seg(p,.8,.95),label('正しくは −2 J',600,460,{size:30,color:C.F,anchor:'middle'}));
  return s;
 },
 [K+'both']:(p)=>{
  let s=floorTicks(2)+fade(.3,box(bx(0),FY,{w:110,h:90}))+box(bx(2),FY,{w:110,h:90})+pushArrow(2,3,{text:'押す 3 N',g:seg(p,.05,.2)})+friction(2,{g:seg(p,.15,.3)})+distA(0,2);
  s+=card(760,90,400,190,label('箱が 受け取る',960,145,{size:28,color:C.ink,anchor:'middle'})+label('エネルギーは？',960,200,{size:32,color:C.E,anchor:'middle',weight:700})+label('（合わせて）',960,250,{size:24,color:C.dim,anchor:'middle'}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'bothans']:(p)=>{
  const A=fx({x:120,y:390,w:440,h:290,xmax:3.2,ymax:3.6,ymin:-1.6,xticks:[1,2],yticks:[-1,1,2,3]});
  let s=A.svg+area(A,0,2,3,{g:seg(p,.02,.25)})+fline(A,0,2,3)+area(A,0,2,-1,{g:seg(p,.25,.45),color:NEG,fo:.35})+fline(A,0,2,-1,{p:seg(p,.25,.45)});
  s+=fade(seg(p,.1,.25),label('押す ＋6 J',A.X(1),A.Y(1.5)+12,{size:30,color:C.E,anchor:'middle',weight:700}));
  s+=fade(seg(p,.35,.45),label('摩擦 −2 J',A.X(1),A.Y(-.5)+12,{size:26,color:NEG,anchor:'middle',weight:700}));
  s+=card(R-60,110,440,240,label('符号を つけたまま 足す',R+160,165,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.5,.65),tex(cW('6')+'+('+cN('-2')+')='+cW('4\\,\\mathrm{J}'),R+160,250,{size:48,auto:false}))
   +fade(seg(p,.7,.85),label('差し引き 4 J',R+160,320,{size:30,color:C.E,anchor:'middle',weight:700})),seg(p,.45,.55));
  return s;
 },
 // ===== S3 斜めの力 =====
 [K+'slant']:(p)=>{
  const u=seg(p,.35,.85),pos=2*u,sc=60,[dx,dy]=[Math.cos(rad(30))*2*sc,Math.sin(rad(30))*2*sc];
  let s=floorTicks(2)+(u>0?fade(.3,box(bx(0),FY,{w:110,h:90})):'')+box(bx(pos),FY,{w:110,h:90});
  const tx=bx(pos),ty=FY-45;
  s+=arrow(tx,ty,tx+dx,ty-dy,{color:C.F,w:7,head:20,g:seg(p,.05,.25),text:'2 N',tsize:26,tdx:10,tdy:-6});
  s+=fade(seg(p,.15,.3),draw(Array.from({length:16},(_,i)=>{const a=rad(30*i/15);return [tx+50*Math.cos(a),ty-50*Math.sin(a)];}),1,{color:C.ink,w:3})+line(tx,ty,tx+150,ty,{color:C.dim,w:2,dash:'6 6'})+label('30°',tx+62,ty-8,{size:24,color:C.ink,weight:700}));
  s+=distA(0,pos,seg(p,.35,.45));
  s+=card(820,90,340,150,label('右から 30° 上へ 2 N',990,145,{size:26,color:C.F,anchor:'middle',weight:700})+fade(seg(p,.8,.92),label('右へ 2 m',990,205,{size:28,color:C.x,anchor:'middle',weight:700})),seg(p,.1,.25));
  return s;
 },
 [K+'shadow']:(p)=>{
  const sc=60,tx=bx(2),ty=FY-45,[dx,dy]=[Math.cos(rad(30))*2*sc,Math.sin(rad(30))*2*sc];
  let s=floorTicks(2)+box(bx(2),FY,{w:110,h:90})+arrow(tx,ty,tx+dx,ty-dy,{color:C.F,w:7,head:20,text:'2 N',tsize:26,tdx:10,tdy:-6});
  s+=lamp(tx-20,tx+120,60,{g:seg(p,.05,.25),text:''})+shadow(tx,ty,30,2,sc,FY,{gl:seg(p,.2,.4),gs:seg(p,.4,.6),text:''});
  s+=fade(seg(p,.45,.6),label('影',tx+dx/2,FY-14,{size:26,color:AL,anchor:'middle',weight:700}));
  s+=card(820,120,340,200,label('真上から 光',990,175,{size:28,color:C.hi,anchor:'middle'})+fade(seg(p,.55,.7),label('影 ＝ 右向き成分',990,240,{size:30,color:AL,anchor:'middle',weight:700})+label('これだけが 効く',990,290,{size:26,color:C.ink,anchor:'middle'})),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'tri']:(p)=>{
  // big triangle: tail T, tip P (30° up, length 2), mirror Q (30° down)
  const T=[200,300],L=260,P=[T[0]+L*Math.cos(rad(30)),T[1]-L*Math.sin(rad(30))],Q=[P[0],T[1]+L*Math.sin(rad(30))],Fp=[P[0],T[1]];
  let s=arrow(T[0],T[1],P[0],P[1],{color:C.F,w:7,head:22})+label('2',(T[0]+P[0])/2-20,(T[1]+P[1])/2-14,{size:30,color:C.F,weight:700});
  s+=line(T[0],T[1],Fp[0],Fp[1],{color:AL,w:6})+line(P[0],P[1],Fp[0],Fp[1],{color:PP,w:6})+rect(Fp[0]-20,Fp[1]-20,20,20,{fill:'none',fo:0,stroke:C.dim,sw:2,rx:0});
  s+=label('30°',T[0]+62,T[1]-10,{size:24,color:C.ink,weight:700});
  const g=seg(p,.35,.65);
  s+=fade(g,line(T[0],T[1],Q[0],Q[1],{color:C.F,w:4,dash:'10 8'})+line(Fp[0],Fp[1],Q[0],Q[1],{color:PP,w:4,dash:'10 8'})+label('2',(T[0]+Q[0])/2-20,(T[1]+Q[1])/2+34,{size:30,color:C.F,weight:700})+label('30°',T[0]+62,T[1]+30,{size:24,color:C.ink,weight:700}));
  s+=fade(seg(p,.6,.8),line(P[0]+30,P[1],P[0]+30,Q[1],{color:C.hi,w:3})+label('2',P[0]+44,T[1]+10,{size:30,color:C.hi,weight:700}));
  s+=card(R,110,370,190,label('上下に 二つ 合わせると',R+185,165,{size:26,color:C.ink,anchor:'middle'})+label('1辺 2 の 正三角形',R+185,230,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'tri2']:(p)=>{
  const T=[200,300],L=260,P=[T[0]+L*Math.cos(rad(30)),T[1]-L*Math.sin(rad(30))],Q=[P[0],T[1]+L*Math.sin(rad(30))],Fp=[P[0],T[1]];
  let s=arrow(T[0],T[1],P[0],P[1],{color:C.F,w:7,head:22})+label('2',(T[0]+P[0])/2-20,(T[1]+P[1])/2-14,{size:30,color:C.F,weight:700});
  s+=line(T[0],T[1],Fp[0],Fp[1],{color:AL,w:6})+line(P[0],P[1],Fp[0],Fp[1],{color:PP,w:7})+rect(Fp[0]-20,Fp[1]-20,20,20,{fill:'none',fo:0,stroke:C.dim,sw:2,rx:0});
  s+=line(T[0],T[1],Q[0],Q[1],{color:C.F,w:4,dash:'10 8'})+line(Fp[0],Fp[1],Q[0],Q[1],{color:PP,w:4,dash:'10 8'})+label('30°',T[0]+62,T[1]-10,{size:24,color:C.ink,weight:700});
  s+=line(P[0]+30,P[1],P[0]+30,Q[1],{color:C.hi,w:3})+label('2',P[0]+44,T[1]+10,{size:30,color:C.hi,weight:700});
  s+=fade(seg(p,.25,.45),label('半分 ＝ 1',P[0]+50,(P[1]+Fp[1])/2+10,{size:28,color:PP,weight:700}));
  s+=card(R,110,370,190,label('上向き成分',R+185,165,{size:28,color:PP,anchor:'middle'})+fade(seg(p,.55,.7),label('1 N',R+185,235,{size:44,color:PP,anchor:'middle',weight:700})),seg(p,.4,.55),PP);
  return s;
 },
 [K+'pyth']:(p)=>{
  const T=[140,340],L=260,P=[T[0]+L*Math.cos(rad(30)),T[1]-L*Math.sin(rad(30))],Fp=[P[0],T[1]];
  let s=arrow(T[0],T[1],P[0],P[1],{color:C.F,w:7,head:22})+label('2',(T[0]+P[0])/2-20,(T[1]+P[1])/2-14,{size:30,color:C.F,weight:700});
  s+=line(T[0],T[1],Fp[0],Fp[1],{color:AL,w:7})+line(P[0],P[1],Fp[0],Fp[1],{color:PP,w:6})+label('1',P[0]+14,(P[1]+Fp[1])/2+10,{size:28,color:PP,weight:700});
  s+=label('影 ？',(T[0]+Fp[0])/2,T[1]+44,{size:28,color:AL,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.3),label('影²',560,140,{size:40,color:AL,weight:700})+tex('=2^2-'+cP('1')+'^2',700,130,{size:44,auto:false,anchor:'start'}));
  s+=fade(seg(p,.3,.5),tex('=4-1=3',700,215,{size:44,auto:false,anchor:'start'}));
  s+=fade(seg(p,.6,.8),label('影',540,330,{size:40,color:AL,weight:700})+tex('=\\sqrt{3}\\approx'+cA('1.73\\,\\mathrm{N}'),590,320,{size:48,auto:false,anchor:'start'}));
  return s;
 },
 [K+'slantW']:(p)=>{
  let s=tex(cA('2\\cos30^\\circ')+'=\\sqrt{3}\\approx'+cA('1.73\\,\\mathrm{N}'),600,110,{size:48,auto:false});
  s+=fade(seg(p,.05,.2),label('（cos30° ≈ 0.87）',600,175,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.35,.6),tex(cW('W')+'\\approx'+cA('1.73')+'\\times'+cL('2')+'\\approx'+cW('3.5\\,\\mathrm{J}'),600,300,{size:56,auto:false}));
  s+=fade(seg(p,.6,.75),highlight(600-texWidth('W\\approx1.73\\times2\\approx3.5\\,\\mathrm{J}',56,false)/2-20,255,texWidth('W\\approx1.73\\times2\\approx3.5\\,\\mathrm{J}',56,false)+40,82,1,C.E));
  return s;
 },
 [K+'slantWrong']:(p)=>{
  let s=card(90,90,470,300,label('上向き 1 N',325,150,{size:30,color:PP,anchor:'middle',weight:700})+label('進む向きと 直角',325,210,{size:28,color:C.ink,anchor:'middle'})+label('→ 仕事 0',325,280,{size:32,color:C.E,anchor:'middle',weight:700}),seg(p,0,.15),PP);
  s+=card(640,90,470,300,tex('2\\times2=4\\,\\mathrm{J}',875,170,{size:48,auto:false})+cross(1040,165,18)
   +label('影でない 部分まで',875,260,{size:28,color:NEG,anchor:'middle'})+label('数えている',875,305,{size:28,color:NEG,anchor:'middle'}),seg(p,.45,.6),NEG);
  return s;
 },
 // ===== S4 分けて足しても同じ =====
 [K+'split']:(p)=>{
  const A=fx({x:120,y:430,w:500,h:300,xmax:3.6,ymax:3,xticks:[1,2,3],yticks:[1,2]});
  let s=A.svg+area(A,0,3,2)+fline(A,0,3,2)+rectLabels(A,0,3,2,{h:'2 N',w:'3 m',a:'6 J'});
  s+=card(R,120,370,180,label('区間に 分けて',R+185,180,{size:30,color:C.ink,anchor:'middle'})+label('数えてみる',R+185,240,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'split3']:(p)=>{
  const A=fx({x:120,y:430,w:500,h:300,xmax:3.6,ymax:3,xticks:[1,2,3],yticks:[1,2]});
  let s=A.svg+fline(A,0,3,2);
  [0,1,2].forEach(i=>{const g=seg(p,.05+i*.12,.15+i*.12);s+=area(A,i,i+1,2,{g})+fade(g,label('2 J',A.X(i+.5),A.Y(1)+12,{size:30,color:C.E,anchor:'middle',weight:700}));});
  s+=fade(seg(p,.05,.4),line(A.X(1),A.Y(0),A.X(1),A.Y(2.2),{color:C.ink,w:3,dash:'6 5'})+line(A.X(2),A.Y(0),A.X(2),A.Y(2.2),{color:C.ink,w:3,dash:'6 5'}));
  s+=card(R,120,370,220,label('1 m ずつ 3 つ',R+185,175,{size:28,color:C.x,anchor:'middle'})+fade(seg(p,.55,.7),tex(cW('2')+'+'+cW('2')+'+'+cW('2')+'='+cW('6\\,\\mathrm{J}'),R+185,265,{size:46,auto:false})),seg(p,0,.15));
  return s;
 },
 [K+'split2']:(p)=>{
  const A=fx({x:120,y:430,w:500,h:300,xmax:3.6,ymax:3,xticks:[1,1.5,2,3],yticks:[1,2]});
  let s=A.svg+fline(A,0,3,2);
  [0,1].forEach(i=>{const g=seg(p,.05+i*.15,.18+i*.15);s+=area(A,i*1.5,i*1.5+1.5,2,{g})+fade(g,label('3 J',A.X(i*1.5+.75),A.Y(1)+12,{size:30,color:C.E,anchor:'middle',weight:700}));});
  s+=fade(seg(p,.05,.3),line(A.X(1.5),A.Y(0),A.X(1.5),A.Y(2.2),{color:C.ink,w:3,dash:'6 5'}));
  s+=card(R,120,370,220,label('1.5 m ずつ 2 つ',R+185,175,{size:28,color:C.x,anchor:'middle'})+fade(seg(p,.55,.7),tex(cW('3')+'+'+cW('3')+'='+cW('6\\,\\mathrm{J}'),R+185,265,{size:46,auto:false})),seg(p,0,.15));
  return s;
 },
 [K+'splitsame']:(p)=>{
  const o={y:380,w:330,h:230,xmax:3.6,ymax:3,xticks:[1,2,3],yticks:[2]};
  const A=fx({...o,x:110}),B=fx({...o,x:680});
  let s=A.svg+B.svg+fline(A,0,3,2)+fline(B,0,3,2);
  [0,1,2].forEach(i=>{s+=area(A,i,i+1,2)+label('2',A.X(i+.5),A.Y(1)+12,{size:30,color:C.E,anchor:'middle',weight:700});});
  [0,1].forEach(i=>{s+=area(B,i*1.5,i*1.5+1.5,2)+label('3',B.X(i*1.5+.75),B.Y(1)+12,{size:30,color:C.E,anchor:'middle',weight:700});});
  s+=label('2 ＋ 2 ＋ 2 ＝ 6 J',A.X(1.5),480,{size:30,color:C.E,anchor:'middle',weight:700})+label('3 ＋ 3 ＝ 6 J',B.X(1.5),480,{size:30,color:C.E,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.2),label('＝',600,290,{size:48,color:C.E,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('切り分けても 全体の面積は 同じ',600,60,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'why']:(p)=>{
  const A=fx({x:120,y:430,w:500,h:300,xmax:3.6,ymax:4.6,xticks:[1,2,3],yticks:[1,2,3,4]});
  let s=A.svg+fline(A,0,3,2,{color:C.F});
  s+=fade(seg(p,.5,.7),draw([[A.X(0),A.Y(2)],[A.X(1),A.Y(2)],[A.X(1),A.Y(3)],[A.X(2),A.Y(3)],[A.X(2),A.Y(4)],[A.X(3),A.Y(4)]],1,{color:C.F,w:5,dash:'10 8'}));
  s+=card(R,120,370,200,label('なぜ 分ける？',R+185,180,{size:32,color:C.hi,anchor:'middle',weight:700})+fade(seg(p,.5,.65),label('力が 途中で 変わるとき',R+185,245,{size:28,color:C.F,anchor:'middle'})),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'stairs']:(p)=>{
  const A=fx({x:120,y:430,w:500,h:300,xmax:3.6,ymax:4.6,xticks:[1,2,3],yticks:[1,2,3,4]});
  const P=[[0,1,2],[1,2,3],[2,3,4]];
  let s=A.svg;
  P.forEach(([a,b,F],i)=>{const g=seg(p,.1+i*.15,.22+i*.15);s+=area(A,a,b,F,{g})+fline(A,a,b,F,{p:g})+fade(g,label(`${F} J`,A.X(a+.5),A.Y(F/2)+12,{size:28,color:C.E,anchor:'middle',weight:700}));});
  s+=card(R,120,370,220,label('1 m ごとに 2, 3, 4 N',R+185,175,{size:28,color:C.F,anchor:'middle'})+fade(seg(p,.65,.8),tex(cW('2')+'+'+cW('3')+'+'+cW('4')+'='+cW('9\\,\\mathrm{J}'),R+185,265,{size:46,auto:false})),seg(p,.02,.15));
  return s;
 },
 [K+'stairs2']:(p)=>{
  const B=vt({x:100,y:300,w:300,h:200,xmax:3.6,ymax:4.6,xticks:[1,2,3],yticks:[2,4]});
  const P=[[0,1,2],[1,2,3],[2,3,4]];
  let s=B.svg+label('積分の回',250,40,{size:24,color:C.dim});
  P.forEach(([a,b,v])=>{s+=bar(B,a,b,v,{color:C.x});});s+=steps(B,P,{color:C.v});
  s+=label('9 m',B.X(1.5),B.Y(1.2)+10,{size:30,color:C.x,anchor:'middle',weight:700});
  const A=fx({x:700,y:300,w:300,h:200,xmax:3.6,ymax:4.6,xticks:[1,2,3],yticks:[2,4]});
  s+=A.svg+label('今回',850,40,{size:24,color:C.dim});
  P.forEach(([a,b,F])=>{s+=area(A,a,b,F)+fline(A,a,b,F);});
  s+=label('9 J',A.X(1.5),A.Y(1.2)+10,{size:30,color:C.E,anchor:'middle',weight:700});
  s+=fade(seg(p,.1,.25),label('同じ 形の 足し算',560,200,{size:28,color:C.hi,anchor:'middle',weight:700}));
  // finer slices under a smooth curve
  const g=seg(p,.5,.7);
  if(g>0){const Cc=fx({x:420,y:500,w:240,h:120,xmax:3.4,ymax:4.6,xticks:[],yticks:[],g});
   let t='';const f=x=>2+x*.7;for(let i=0;i<12;i++){const a=i*.25;t+=area(Cc,a,a+.25,f(a+.125),{fo:.35,sw:1});}
   s+=fade(g,Cc.svg.replace(/位置 x \[m\]|力 F \[N\]/g,'')+t+Cc.plot(f,{from:0,to:3,color:C.F,w:4})+label('細かく 分ける',545,370,{size:24,color:C.ink,anchor:'middle'}));}
  return s;
 },
 // ===== S5 仕事とエネルギー =====
 [K+'where']:(p)=>{
  let s=ground(60,1000,FY)+box(560,FY,{w:130,h:100});
  s+=arrow(495,120,495,FY-120,{color:C.E,w:7,head:20,g:seg(p,.05,.3)})+fade(seg(p,.05,.3),label('仕事で 渡された エネルギー',495,100,{size:28,color:C.E,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.7),label('どこに 現れる？',760,300,{size:36,color:C.hi,weight:700}));
  return s;
 },
 [K+'ke']:(p)=>{
  let s=card(90,90,1020,160,label('運動エネルギー',230,150,{size:30,color:C.E,weight:700,anchor:'middle'})+label('動いている物体が 持つ',230,205,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.45,.6),tex(cW('K')+'=\\dfrac{1}{2}m'+cV('v')+'^2',650,170,{size:60,auto:false})+label('高校の式（紹介）',1080,225,{size:22,color:C.dim,anchor:'end'})),seg(p,0,.15),C.E);
  s+=fade(seg(p,.5,.65),label('m：質量 [kg]',300,330,{size:30,color:C.ink})+label('v：速さ [m/s]',300,390,{size:30,color:C.v})+label('K：[J]',700,330,{size:30,color:C.E}));
  return s;
 },
 [K+'ke2']:(p)=>{
  let s=tex(cW('K')+'=\\dfrac{1}{2}m'+cV('v')+'^2',600,80,{size:44,auto:false});
  const row=(y,v,K,g)=>fade(g,ground(80,560,y)+box(260,y,{w:100,h:70})+arrow(265,y-35,265+v*90,y-35,{color:C.v,w:6,head:18,text:`${v} m/s`,tsize:24,tdx:10,tdy:8})
   +label('2 kg',210,y-28,{size:22,color:C.ink,anchor:'middle'})
   +rect(640,y-55,K*90,50,{fill:C.E,fo:.45,stroke:C.E,rx:4})+label(`K ＝ ${K} J`,650+Math.max(K*90,0)+10,y-20,{size:30,color:C.E,weight:700}));
  s+=row(250,1,1,seg(p,.05,.25))+row(430,2,4,seg(p,.3,.5));
  s+=fade(seg(p,.1,.25),label('½ × 2 × 1² ＝ 1',640,150,{size:24,color:C.dim}))+fade(seg(p,.35,.5),label('½ × 2 × 2² ＝ 4',640,330,{size:24,color:C.dim}));
  s+=fade(seg(p,.7,.85),label('速さ 2 倍 → 4 倍',1150,490,{size:30,color:C.hi,anchor:'end',weight:700}));
  return s;
 },
 [K+'ke3']:(p)=>{
  let s=label('つるつるの床・止まっていた箱',60,60,{size:24,color:C.dim});
  s+=card(60,110,310,200,label('押す力の 仕事',215,165,{size:26,color:C.ink,anchor:'middle'})+label('＋6 J',215,240,{size:44,color:C.E,anchor:'middle',weight:700}),seg(p,.02,.15),C.E);
  s+=fade(seg(p,.15,.3),arrow(385,210,460,210,{color:C.E,w:6,head:18}));
  s+=card(475,110,310,200,label('運動エネルギー',630,165,{size:26,color:C.ink,anchor:'middle'})+label('K ＝ 6 J',630,240,{size:44,color:C.E,anchor:'middle',weight:700}),seg(p,.2,.35),C.E);
  s+=card(870,110,290,200,label('摩擦の 仕事（負）',1015,165,{size:26,color:C.ink,anchor:'middle'})+label('K を 減らす',1015,240,{size:32,color:NEG,anchor:'middle',weight:700}),seg(p,.6,.75),NEG);
  s+=fade(seg(p,.6,.75),arrow(862,210,795,210,{color:NEG,w:5,head:14}));
  return s;
 },
 [K+'ke4']:(p)=>{
  let s=card(200,110,800,260,label('仕事 → 運動エネルギー の関係',600,180,{size:30,color:C.E,anchor:'middle',weight:700})
   +tex('\\dfrac{1}{2}m'+cV('v')+'^2',600,260,{size:44,auto:false})+label('なぜ この形？',820,265,{size:26,color:C.dim})
   +fade(seg(p,.3,.5),label('→ 中級で 運動方程式から 導く',600,340,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15),C.hi);
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'sum']:(p)=>{
  const it=[['逆向きの力','仕事は 負（取り出す）',NEG],['斜めの力','進む向きの 成分だけ',AL]];
  let s='';it.forEach(([a,b,c],i)=>{s+=card(90+i*530,110,490,200,label(a,335+i*530,170,{size:30,color:C.ink,anchor:'middle'})+label(b,335+i*530,240,{size:32,color:c,anchor:'middle',weight:700}),seg(p,.02+i*.4,.15+i*.4),c);});
  return s;
 },
 [K+'sum2']:(p)=>{
  const it=[['逆向きの力','仕事は 負（取り出す）',NEG],['斜めの力','進む向きの 成分だけ',AL]];
  let s='';it.forEach(([a,b,c],i)=>{s+=card(90+i*530,70,490,170,label(a,335+i*530,125,{size:28,color:C.ink,anchor:'middle'})+label(b,335+i*530,190,{size:30,color:c,anchor:'middle',weight:700}),1,c);});
  s+=card(90,280,1020,170,label('分けて 足しても 合計は 同じ',600,345,{size:32,color:C.E,anchor:'middle',weight:700})+label('→ 力が 変わる場合の 武器',600,405,{size:28,color:C.hi,anchor:'middle'}),seg(p,.02,.15),C.E);
  return s;
 },
 [K+'lift']:(p)=>{
  const u=seg(p,.2,.9),y=mix(340,200,u);
  let s=ground(60,700,460);
  s+=rect(310,y-70,100,70,{fill:C.dim,fo:.35,stroke:C.dim,rx:8})+label('重い物',360,y-26,{size:24,color:C.ink,anchor:'middle'});
  s+=arrow(360,y,360,y+85,{color:C.F,w:6,head:18,g:seg(p,.05,.2)})+fade(seg(p,.05,.2),label('重力',375,y+75,{size:24,color:C.F}));
  s+=arrow(360,y-70,360,y-155,{color:C.F,w:6,head:18,g:seg(p,.1,.25)})+fade(seg(p,.1,.25),label('手の力',345,y-130,{size:26,color:C.F,anchor:'end',weight:700}));
  s+=fade(seg(p,.4,.55),arrow(470,340,470,200,{color:C.x,w:4,head:14})+label('上へ 動く',490,280,{size:26,color:C.x}));
  s+=card(760,110,400,200,label('ゆっくり 持ち上げる',960,170,{size:28,color:C.ink,anchor:'middle'})+fade(seg(p,.7,.85),label('手の力の 仕事 ＞ 0',960,245,{size:32,color:C.E,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'lift2']:(p)=>{
  const y=200;
  let s=ground(60,700,460)+rect(310,y-70,100,70,{fill:C.dim,fo:.35,stroke:C.dim,rx:8})+label('重い物',360,y-26,{size:24,color:C.ink,anchor:'middle'});
  s+=arrow(360,y,360,y+85,{color:C.F,w:6,head:18})+label('重力',375,y+75,{size:24,color:C.F})+arrow(360,y-70,360,y-155,{color:C.F,w:6,head:18})+label('手の力',345,y-130,{size:26,color:C.F,anchor:'end',weight:700});
  s+=fade(seg(p,.05,.2),arrow(450,y-20,450,y-60,{color:C.v,w:5,head:14})+label('速さ 小さく 一定',470,y-30,{size:24,color:C.v}));
  s+=card(760,90,400,150,label('運動エネルギー',960,145,{size:26,color:C.ink,anchor:'middle'})+label('増えていない',960,200,{size:30,color:C.v,anchor:'middle',weight:700}),seg(p,.15,.3));
  s+=card(760,280,400,170,label('手がした 仕事は',960,340,{size:28,color:C.E,anchor:'middle'})+label('どこへ 行った？',960,400,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
};

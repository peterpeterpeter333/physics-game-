// 高校編「速度・深く学ぶ 1/2」(ys-hs-m1-velocity-1) — 図。Stage 1200×515.
// 色（anim.mjs C）：位置 x 水色、速さ・速度 v 紫、時間 t 金、強調 黄。人物 A＝薄い水色、B＝橙（物理量ではない）。
// ほかの回（2/2・要点）でも使う部品は export する（diagrams.mjs は object だけを読み込む）。
import {C,mix,seg,fmt,fade,label,line,rect,dot,ring,draw,arrow,brace as brace0,axes,tex,poly} from './anim.mjs';
// brace whose text sits clear of the tip
export function brace(x1,x2,y,{dir=1,color=C.dim,text='',size=24,g=1}={}){return brace0(x1,x2,y,{dir,color,g})+(text?fade(g,label(text,(x1+x2)/2,dir>0?y+30+size:y-36,{size,color,anchor:'middle'})):'');}

const K='hs-m1-velocity-1:';
export const PA='#8fd3ff',PB=C.E;
export const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);

// ---- number line (位置 x の目盛り) ----------------------------------------------------------
// m from −4 to 10 → x 160..1112
export const NL={X:m=>130+(m+4)*66,y:300};
export function numberLine({y=NL.y,g=1,ticks=1,zero=1,pos=1,X=NL.X,lo=-4,hi=10}={}){
 let s=fade(g,line(X(lo)-30,y,X(hi)+20,y,{color:C.dim,w:3})+arrow(X(hi)+10,y,X(hi)+44,y,{color:C.dim,w:3,head:14}));
 for(let m=lo;m<=hi;m++){const k=(m-lo)/(hi-lo),a=seg(ticks,k*.8,k*.8+.2);
  s+=fade(a,line(X(m),y-(m%2?6:10),X(m),y+(m%2?6:10),{color:C.dim,w:2})+(m%2===0?label(m<0?`−${-m}`:String(m),X(m),y+38,{size:22,color:m===0?C.ink:C.dim,anchor:'middle'}):''));}
 s+=fade(Math.min(g,ticks),label('x [m]',X(hi)+52,y+8,{size:24,color:C.x}));
 s+=fade(zero,dot(X(0),y,7,C.ink)+label('基準点',X(0),y-26,{size:22,color:C.ink,anchor:'middle'}));
 s+=fade(pos,arrow(X(hi)-170,y-62,X(hi)-30,y-62,{color:C.x,w:4,head:14})+label('正の向き',X(hi)-100,y-80,{size:22,color:C.x,anchor:'middle'}));
 return s;
}
// the object on the line
export const thing=(m,y=NL.y,X=NL.X,color=C.hi)=>rect(X(m)-18,y-46,36,32,{fill:color,fo:.85,stroke:color,rx:6})+line(X(m),y-14,X(m),y,{color,w:3});
const xlab=(m,y=NL.y,X=NL.X,g=1)=>fade(g,label(`x ＝ ${m<0?'−'+(-m):m} m`,X(m),y-64,{size:30,color:C.x,anchor:'middle',weight:700}));

// ---- lanes for A (100 m / 20 s) and B (60 m / 10 s) ---------------------------------------
const LX0=210,LX1=1010,LM=m=>mix(LX0,LX1,m/100);
function lane(y,m,col,name,goal,g=1){
 return fade(g,rect(LX0-8,y-16,LX1-LX0+16,32,{fill:'#1a2540',fo:1,stroke:C.faint,rx:8})
  +line(LM(goal),y-28,LM(goal),y+28,{color:C.ink,w:3})+label(name,LX0-24,y+9,{size:26,color:col,anchor:'end',weight:700})
  +dot(LM(m),y,13,col));
}
function lanes(t,{g=1,clock=1}={}){
 const a=Math.min(100,5*t),b=Math.min(60,6*t);
 let s=lane(150,a,PA,'Aさん',100,g)+lane(300,b,PB,'Bさん',60,g);
 s+=fade(g,label('0 m',LX0,350+0,{size:22,color:C.dim,anchor:'middle'})+label('60 m',LM(60),350,{size:22,color:C.dim,anchor:'middle'})+label('100 m',LM(100),200,{size:22,color:C.dim,anchor:'middle'}));
 s+=fade(clock*g,label(`t ＝ ${fmt(t,0)} s`,600,70,{size:32,color:C.t,anchor:'middle',weight:700}));
 return s;
}

// ---- strips: a road of length m metres cut into n pieces (1 m = 9 px) -----------------------
export const SX0=150,SM=m=>SX0+9*m;
export function strip(y,metres,{n=0,cuts=null,color=C.x,hl=-1,g=1,h=34,hlColor=C.hi}={}){
 let s=rect(SX0,y-h/2,9*metres,h,{fill:color,fo:.22,stroke:color,sw:2,rx:4});
 const pts=cuts??Array.from({length:n+1},(_,i)=>metres*i/Math.max(1,n));
 if(hl>=0&&hl<pts.length-1)s+=rect(SM(pts[hl]),y-h/2,9*(pts[hl+1]-pts[hl]),h,{fill:hlColor,fo:.6,stroke:hlColor,sw:2,rx:3});
 for(let i=1;i<pts.length-1;i++)s+=line(SM(pts[i]),y-h/2,SM(pts[i]),y+h/2,{color:C.ink,w:2,opacity:.8});
 return fade(g,s);
}
const evenCuts=(m,n,k)=>Array.from({length:k+1},(_,i)=>m*i/n).concat(k<n?[m]:[]);

// ---- x–t style bar chart for the round trip (時間 → 速さ) ---------------------------------
const tripAxes=(g=1)=>axes({x:150,y:395,w:560,h:290,xmax:5.4,ymax:72,xlabel:'時間 [h]',ylabel:'速さ [km/h]',xticks:[1,2,3,4,5],yticks:[20,40,60],grid:true,g,xcolor:C.t,ycolor:C.v});
function tripBars(A,{g=1,avg=0,cells=0}={}){
 let s='';
 const bar=(t0,t1,v,col)=>rect(A.X(t0),A.Y(v),A.X(t1)-A.X(t0),A.Y(0)-A.Y(v),{fill:col,fo:.35,stroke:col,sw:2,rx:2});
 s+=fade(g,bar(0,2,60,C.v)+bar(2,5,40,'#7f8fd8')+label('行き 60',A.X(1),A.Y(60)+34,{size:24,color:C.ink,anchor:'middle'})+label('帰り 40',A.X(3.5),A.Y(40)+34,{size:24,color:'#a9b6f0',anchor:'middle'}));
 s+=fade(cells,[1,2,3,4].map(h=>line(A.X(h),A.Y(0),A.X(h),A.Y(h<=2?60:40),{color:C.ink,w:2,dash:'5 5'})).join(''));
 s+=fade(avg,line(A.X(0),A.Y(48),A.X(5),A.Y(48),{color:C.hi,w:4,dash:'12 8'})+label('48',A.X(5)+14,A.Y(48)+8,{size:28,color:C.hi,weight:700}));
 return s;
}

// ---- lightning and listener ----------------------------------------------------------------
function bolt(x,y,g=1){return fade(g,poly([[x,y],[x-40,y+90],[x-8,y+90],[x-30,y+180],[x+40,y+60],[x+6,y+60],[x+30,y]],{fill:C.hi,fo:.85,stroke:C.hi}));}
function person(x,y){return ring(x,y-120,18,{color:C.ink,w:3})+line(x,y-100,x,y-40,{color:C.ink,w:3})+line(x,y-40,x-18,y,{color:C.ink,w:3})+line(x,y-40,x+18,y,{color:C.ink,w:3})+line(x-22,y-80,x+22,y-80,{color:C.ink,w:3});}

// ---- the closing question: right 3 m, left 3 m from x = 2 ---------------------------------
export function backForth(p,{y=NL.y,g1=1,g2=1,ask=0}={}){
 let s=numberLine({y,pos:0});
 const m=p<.5?2+3*seg(p,.05,.45):5-3*seg(p,.55,.95);
 s+=arrow(NL.X(2),y-90,NL.X(5),y-90,{color:C.hi,w:5,g:g1,head:16})+fade(g1,label('右へ 3 m',NL.X(3.5),y-108,{size:24,color:C.hi,anchor:'middle'}));
 s+=arrow(NL.X(5),y-165,NL.X(2),y-165,{color:C.hi,w:5,g:g2,head:16})+fade(g2,label('左へ 3 m',NL.X(3.5),y-183,{size:24,color:C.hi,anchor:'middle'}));
 s+=thing(m,y);
 return s;
}

export const hsVelocity1Diagrams={
 // ================= S1 どちらが速い？ =================
 [K+'race']:(p)=>{
  const t=20*seg(p,.08,.7);
  let s=lanes(t);
  s+=fade(seg(p,.2,.35),label('100 m を 20 s',LM(100),110,{size:24,color:PA,anchor:'end'})+label('60 m を 10 s',LM(60),260,{size:24,color:PB,anchor:'end'}));
  s+=fade(seg(p,.75,.9),label('どちらが 速い？',600,460,{size:36,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'differ']:(p)=>{
  let s=lanes(20,{clock:0});
  s+=fade(seg(p,.05,.2),label('距離 100 m',LM(50),110,{size:26,color:C.x,anchor:'middle'})+label('距離 60 m',LM(30),260,{size:26,color:C.x,anchor:'middle'}));
  s+=fade(seg(p,.05,.2),label('20 s',LX1+40,159,{size:28,color:C.t})+label('10 s',LM(60)+40,309,{size:28,color:C.t}));
  s+=fade(seg(p,.1,.3),label('距離：A が長い',330,450,{size:30,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),label('時間：B が短い',870,450,{size:30,color:C.t,anchor:'middle',weight:700}));
  s+=fade(seg(p,.75,.9),label('→ すぐには 決められない',600,500,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'plan']:(p)=>{
  let s=card(110,150,430,190,label('違う記録を',325,225,{size:32,color:C.ink,anchor:'middle'})+label('そろえて 比べる',325,280,{size:32,color:C.ink,anchor:'middle'}),seg(p,.05,.2));
  s+=arrow(570,245,680,245,{color:C.dim,w:4,g:seg(p,.45,.6)});
  s+=card(710,150,380,190,label('速さ',900,265,{size:56,color:C.v,anchor:'middle',weight:700}),seg(p,.55,.7),C.v);
  return s;
 },
 [K+'series']:(p)=>{
  const items=[['1','速さ','1秒あたりに そろえる'],['2','速度','向きを 持つ 速さ']];
  let s=fade(seg(p,0,.12),label('速度の単元 2回',600,80,{size:34,color:C.ink,anchor:'middle',weight:700}));
  items.forEach(([n,a,b],i)=>{const x=150+i*480,g=seg(p,.1+i*.3,.28+i*.3),on=i===0&&p>.3;
   s+=card(x,140,420,240,label(n,x+210,210,{size:50,color:C.hi,anchor:'middle',weight:700})+label(a,x+210,285,{size:38,color:C.v,anchor:'middle',weight:700})+label(b,x+210,340,{size:26,color:C.ink,anchor:'middle'}),g,on?C.hi:C.faint);
   if(i===0)s+=arrow(x+430,260,x+470,260,{color:C.dim,w:3,head:12,g:seg(p,.42,.5)});});
  s+=fade(seg(p,.2,.35),label('今回',360,128,{size:24,color:C.hi,anchor:'middle'}));
  return s;
 },
 // ================= S2 位置を決める =================
 [K+'ruler']:(p)=>numberLine({g:seg(p,0,.15),ticks:seg(p,.1,.55),zero:seg(p,.5,.65),pos:seg(p,.75,.9)}),
 [K+'posx']:(p)=>{
  const m=6*seg(p,.05,.4);
  let s=numberLine()+thing(m);
  s+=fade(seg(p,.4,.55),label('x ＝ 6 m',NL.X(6),NL.y+90,{size:30,color:C.x,anchor:'middle',weight:700}));
  s+=card(150,410,600,80,label('位置 x ＝ その所の 目盛りの値',450,460,{size:30,color:C.x,anchor:'middle',weight:700}),seg(p,.6,.75),C.x);
  return s;
 },
 [K+'negx']:(p)=>{
  const m=mix(6,-2,seg(p,.05,.4));
  let s=numberLine()+thing(m);
  s+=fade(seg(p,.4,.55),label('x ＝ −2 m',NL.X(-2),NL.y+90,{size:30,color:C.x,anchor:'middle',weight:700}));
  s+=card(560,400,560,90,label('基準点より 左 → マイナス',840,455,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.2,.35));
  return s;
 },
 [K+'path']:(p)=>{
  const u=seg(p,.35,.75),m=mix(-2,6,u);
  let s=numberLine({pos:0});
  s+=draw([[NL.X(-2),NL.y-90],[NL.X(m),NL.y-90]],u>0?1:0,{color:C.hi,w:5})+thing(m);
  s+=fade(seg(p,.1,.25),label('x ＝ −2 m',NL.X(-2),NL.y+90,{size:26,color:C.x,anchor:'middle'}));
  s+=fade(seg(p,.75,.85),label('x ＝ 6 m',NL.X(6),NL.y+90,{size:26,color:C.x,anchor:'middle'}));
  s+=fade(seg(p,.8,.95),brace(NL.X(-2),NL.X(6),NL.y-108,{dir:-1,text:'道のり 8 m',color:C.hi,size:28}));
  return s;
 },
 [K+'pathsum']:(p)=>{
  let s=numberLine({pos:0})+draw([[NL.X(-2),NL.y-90],[NL.X(6),NL.y-90]],1,{color:C.hi,w:5})+thing(6);
  s+=brace(NL.X(-2),NL.X(6),NL.y-108,{dir:-1,text:'道のり 8 m',color:C.hi,size:28});
  s+=label('x ＝ 6 m',NL.X(6),NL.y+90,{size:26,color:C.x,anchor:'middle'});
  s+=card(100,400,480,90,label('位置 x：どこに いるか',340,455,{size:30,color:C.x,anchor:'middle',weight:700}),seg(p,.05,.2),C.x);
  s+=card(620,400,480,90,label('道のり：どれだけ 通ったか',860,455,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 // ================= S3 1秒あたりにそろえる =================
 [K+'sametime']:(p)=>{
  let s=strip(170,100,{g:seg(p,.05,.2)})+strip(320,80,{g:seg(p,.25,.4)});
  s+=fade(seg(p,.05,.2),label('100 m',SM(100)+16,178,{size:26,color:C.x})+label('20 s',SM(50),130,{size:26,color:C.t,anchor:'middle'}));
  s+=fade(seg(p,.25,.4),label('80 m',SM(80)+16,328,{size:26,color:C.x})+label('20 s',SM(40),280,{size:26,color:C.t,anchor:'middle'}));
  s+=fade(seg(p,.55,.7),label('時間が 同じ → 長いほうが 速い',600,450,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'difftime']:(p)=>{
  let s=strip(170,100,{color:PA})+strip(320,60,{color:PB});
  s+=label('Aさん',SX0,130,{size:26,color:PA,weight:700})+label('Bさん',SX0,280,{size:26,color:PB,weight:700});
  s+=label('100 m',SM(100)+16,178,{size:26,color:C.x})+label('60 m',SM(60)+16,328,{size:26,color:C.x});
  s+=fade(seg(p,.3,.45),label('20 s',SM(100)-10,130,{size:30,color:C.t,anchor:'end',weight:700})+label('10 s',SM(60)-10,280,{size:30,color:C.t,anchor:'end',weight:700}));
  s+=fade(seg(p,.55,.7),label('時間が 違う → そのままでは 比べられない',600,450,{size:30,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'idea']:(p)=>card(250,120,700,260,label('もし 1 s だったら',600,215,{size:40,color:C.t,anchor:'middle',weight:700})+label('何 m 進む？',600,300,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
 [K+'split20']:(p)=>{
  const k=Math.round(20*seg(p,.15,.75));
  let s=label('Aさん',SX0,110,{size:26,color:PA,weight:700})+label('100 m を 20 s',SM(100),110,{size:26,color:C.x,anchor:'end'});
  s+=strip(200,100,{cuts:evenCuts(100,20,k),color:PA});
  s+=fade(seg(p,.75,.9),brace(SM(0),SM(100),240,{color:C.t})+label('20 区間 ＝ 20 s ぶん',SM(50),320,{size:28,color:C.t,anchor:'middle'}));
  return s;
 },
 [K+'oneA']:(p)=>{
  let s=label('Aさん',SX0,110,{size:26,color:PA,weight:700})+label('100 m を 20 s',SM(100),110,{size:26,color:C.x,anchor:'end'});
  s+=strip(200,100,{n:20,color:PA,hl:seg(p,.05,.15)>.5?0:-1});
  s+=fade(seg(p,.1,.25),arrow(SM(2.5),250,SM(2.5)+60,320,{color:C.hi,w:3,head:12})+label('1 区間 ＝ 1 s ぶん',SM(2.5)+70,345,{size:26,color:C.hi}));
  s+=fade(seg(p,.3,.45),tex('100\\div 20=5',760,340,{size:52,auto:false}));
  s+=fade(seg(p,.5,.65),label('1 s あたり 5 m',760,430,{size:32,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('20 s ぶん → 1 s ぶん に直す',760,485,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'oneB']:(p)=>{
  let s=fade(.5,label('Aさん',SX0,80,{size:24,color:PA,weight:700})+strip(120,100,{n:20,color:PA,hl:0}));
  s+=label('Bさん',SX0,215,{size:26,color:PB,weight:700})+label('60 m を 10 s',SM(60),215,{size:26,color:C.x,anchor:'end'});
  const k=Math.round(10*seg(p,.05,.4));
  s+=strip(270,60,{cuts:evenCuts(60,10,k),color:PB,hl:seg(p,.45,.55)>.5?0:-1});
  s+=fade(seg(p,.5,.65),tex('60\\div 10=6',SM(60)+230,280,{size:52,auto:false}));
  s+=fade(seg(p,.7,.85),label('1 区間 ＝ 6 m',SM(3),360,{size:30,color:C.hi}));
  return s;
 },
 [K+'compare']:(p)=>{
  const Z=50,x0=300;
  let s=label('1 s あたりに 進む道のり',600,80,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=label('Aさん',x0-24,190,{size:28,color:PA,anchor:'end',weight:700})+rect(x0,165,5*Z*seg(p,.05,.25),40,{fill:C.hi,fo:.6,stroke:C.hi,rx:3})+fade(seg(p,.2,.3),label('5 m',x0+5*Z+16,196,{size:30,color:C.ink}));
  s+=label('Bさん',x0-24,300,{size:28,color:PB,anchor:'end',weight:700})+rect(x0,275,6*Z*seg(p,.3,.5),40,{fill:C.hi,fo:.6,stroke:C.hi,rx:3})+fade(seg(p,.45,.55),label('6 m',x0+6*Z+16,306,{size:30,color:C.ink}));
  s+=fade(seg(p,.55,.7),line(x0+5*Z,140,x0+5*Z,340,{color:C.dim,w:2,dash:'6 6'}));
  s+=fade(seg(p,.65,.8),label('B のほうが 速い',820,250,{size:40,color:C.hi,weight:700}));
  return s;
 },
 [K+'define']:(p)=>{
  let s=card(160,90,880,230,label('速さ ＝ 道のり ÷ かかった時間',600,190,{size:44,color:C.v,anchor:'middle',weight:700})
   +fade(seg(p,.4,.6),label('＝ 1 s あたりに 進む道のり',600,265,{size:30,color:C.ink,anchor:'middle'})),seg(p,.05,.25),C.v);
  s+=fade(seg(p,.6,.75),label('例：100 m ÷ 20 s ＝ 5 m/s（秒速 5 m）',600,400,{size:30,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'definition']:(p)=>{
  let s=card(160,60,880,150,label('速さ ＝ 道のり ÷ かかった時間',600,150,{size:40,color:C.v,anchor:'middle',weight:700}),1,C.v);
  s+=card(160,260,420,170,label('定義',370,330,{size:40,color:C.hi,anchor:'middle',weight:700})+label('言葉の 決め方',370,390,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.hi);
  s+=fade(.25+.75*(1-seg(p,.3,.5)),card(620,260,420,170,label('法則',830,330,{size:40,color:C.dim,anchor:'middle',weight:700})+label('実験で 確かめた 原理',830,390,{size:28,color:C.dim,anchor:'middle'})));
  s+=fade(seg(p,.35,.5),line(650,345,1010,345,{color:C.a,w:4}));
  return s;
 },
 // ================= S4 平均の速さと単位 =================
 [K+'average']:(p)=>{
  let s=label('Aさん',SX0,110,{size:26,color:PA,weight:700})+label('100 m を 20 s',SM(100),110,{size:26,color:C.x,anchor:'end'});
  s+=strip(170,100,{n:20,color:PA});
  s+=fade(seg(p,.1,.3),brace(SM(0),SM(100),210,{text:'20 s 全体を ならすと 1 s あたり 5 m',color:C.v,size:28}));
  s+=card(250,330,700,110,label('平均の速さ ＝ 5 m/s',600,400,{size:40,color:C.v,anchor:'middle',weight:700}),seg(p,.55,.75),C.v);
  return s;
 },
 [K+'uneven']:(p)=>{
  let s=fade(.6,label('ずっと同じ',SX0,110,{size:24,color:C.dim})+strip(150,100,{n:20,color:PA}));
  const cuts=[...Array.from({length:11},(_,i)=>3*i),...Array.from({length:10},(_,i)=>30+7*(i+1))];
  s+=fade(seg(p,.05,.25),label('最初の 10 s で 30 m',SX0,250,{size:26,color:C.x})+strip(300,30,{cuts:cuts.filter(c=>c<=30),color:C.E}));
  s+=fade(seg(p,.35,.55),label('残りの 10 s で 70 m',SM(65),250,{size:26,color:C.x,anchor:'middle'})+strip(300,100,{cuts,color:C.E}));
  s+=fade(seg(p,.7,.85),label('合計 100 m を 20 s',600,410,{size:32,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'same5']:(p)=>{
  const cuts=[...Array.from({length:11},(_,i)=>3*i),...Array.from({length:10},(_,i)=>30+7*(i+1))];
  let s=label('ずっと同じ',SX0,110,{size:24,color:C.dim})+strip(150,100,{n:20,color:PA});
  s+=label('途中で 変わる',SX0,250,{size:24,color:C.dim})+strip(300,100,{cuts,color:C.E});
  s+=fade(seg(p,.4,.55),label('1 s に 3 m',SM(15),350,{size:24,color:C.E,anchor:'middle'})+label('1 s に 7 m',SM(65),350,{size:24,color:C.E,anchor:'middle'}));
  s+=card(200,390,800,90,label('どちらも 100 ÷ 20 ＝ 5 m/s',600,447,{size:34,color:C.v,anchor:'middle',weight:700}),seg(p,.05,.25),C.v);
  return s;
 },
 [K+'unit']:(p)=>{
  let s=fade(seg(p,.05,.2),tex('5\\,\\mathrm{m/s}',330,230,{size:72,auto:false,color:C.v})+label('メートル毎秒',330,330,{size:28,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.4,.55),tex('=\\;5\\,\\dfrac{\\mathrm{m}}{\\mathrm{s}}',650,230,{size:72,auto:false,color:C.v}));
  s+=fade(seg(p,.6,.75),label('← 道のり（m）',800,205,{size:28,color:C.x})+label('← 時間（s）',800,285,{size:28,color:C.t}));
  s+=fade(seg(p,.8,.92),label('単位も 分数の形',600,440,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'kmh']:(p)=>{
  let s=fade(seg(p,.05,.2),label('時速 72 km',600,150,{size:40,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.35,.55),tex('72\\,\\mathrm{km/h}=\\dfrac{72\\,\\mathrm{km}}{1\\,\\mathrm{h}}',600,300,{size:60,auto:false}));
  s+=fade(seg(p,.6,.75),label('→ m と s に 付け替える',600,440,{size:30,color:C.hi,anchor:'middle'}));
  return s;
 },
 [K+'kmh2']:(p)=>{
  let s=tex('\\dfrac{72\\,\\mathrm{km}}{1\\,\\mathrm{h}}',260,230,{size:60,auto:false});
  s+=fade(seg(p,.15,.35),label('1 km ＝ 1000 m',260,370,{size:26,color:C.x,anchor:'middle'}));
  s+=fade(seg(p,.5,.7),label('1 h ＝ 3600 s',260,420,{size:26,color:C.t,anchor:'middle'}));
  s+=fade(seg(p,.25,.45),tex('=\\dfrac{72000\\,\\mathrm{m}}{\\phantom{3600\\,\\mathrm{s}}}',620,230,{size:60,auto:false}));
  s+=fade(seg(p,.6,.8),tex('\\phantom{=}\\dfrac{\\phantom{72000\\,\\mathrm{m}}}{3600\\,\\mathrm{s}}',620,230,{size:60,auto:false}));
  return s;
 },
 [K+'kmh3']:(p)=>{
  let s=tex('\\dfrac{72\\,\\mathrm{km}}{1\\,\\mathrm{h}}=\\dfrac{72000\\,\\mathrm{m}}{3600\\,\\mathrm{s}}',440,230,{size:60,auto:false});
  s+=fade(seg(p,.2,.4),tex('=20\\,\\mathrm{m/s}',900,230,{size:60,auto:false,color:C.v}));
  s+=fade(seg(p,.55,.75),label('1 s に 20 m 進む',900,350,{size:30,color:C.v,anchor:'middle',weight:700}));
  return s;
 },
 [K+'kmh36']:(p)=>{
  let s=label('「時速 ÷ 3.6」の 正体',600,80,{size:32,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.1,.3),tex('72\\times\\dfrac{1000}{3600}',380,240,{size:56,auto:false}));
  s+=fade(seg(p,.3,.4),label('km → m',300,370,{size:24,color:C.x,anchor:'middle'})+label('h → s',460,370,{size:24,color:C.t,anchor:'middle'}));
  s+=fade(seg(p,.5,.65),tex('=72\\div 3.6',720,240,{size:56,auto:false}));
  s+=fade(seg(p,.7,.85),tex('=20',940,240,{size:56,auto:false,color:C.v}));
  s+=fade(seg(p,.55,.7),label('1000 ÷ 3600 ＝ 1 ÷ 3.6',720,370,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 // ================= S5 往復の平均の速さ =================
 ...Object.fromEntries([['trip',0],['guess',1]].map(([k,q])=>[K+k,(p)=>{
  const g=q?1:seg(p,.05,.2);
  let s=fade(g,rect(200,190,800,30,{fill:'#1a2540',fo:1,stroke:C.faint,rx:8})+dot(200,205,14,C.ink)+dot(1000,205,14,C.ink)+label('出発地',200,265,{size:24,color:C.dim,anchor:'middle'})+label('目的地',1000,265,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(g,brace(200,1000,290,{text:'片道 120 km',color:C.x,size:28}));
  s+=arrow(260,150,940,150,{color:C.v,w:5,g:q?1:seg(p,.3,.5)})+fade(q?1:seg(p,.4,.5),label('行き 60 km/h',600,130,{size:28,color:C.v,anchor:'middle',weight:700}));
  s+=arrow(940,395,260,395,{color:'#a9b6f0',w:5,g:q?1:seg(p,.6,.8)})+fade(q?1:seg(p,.7,.8),label('帰り 40 km/h',600,440,{size:28,color:'#a9b6f0',anchor:'middle',weight:700}));
  if(q)s=fade(.35,s)+card(300,170,600,140,label('平均の速さ ＝ 50 km/h？',600,255,{size:42,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 }])),
 [K+'back']:(p)=>card(120,140,960,170,label('平均の速さ',600,205,{size:30,color:C.v,anchor:'middle'})+label('＝ 全体の道のり ÷ 全体の時間',600,270,{size:40,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.25),C.v),
 [K+'times']:(p)=>{
  let s=card(120,30,960,90,label('平均の速さ ＝ 全体の道のり ÷ 全体の時間',600,88,{size:30,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.05,.25),label('行き',230,215,{size:30,color:C.v,weight:700})+label('120 ÷ 60 ＝ 2 時間',350,215,{size:36,color:C.ink}));
  s+=fade(seg(p,.5,.7),label('帰り',230,315,{size:30,color:'#a9b6f0',weight:700})+label('120 ÷ 40 ＝ 3 時間',350,315,{size:36,color:C.ink}));
  return s;
 },
 [K+'calc']:(p)=>{
  let s=card(120,30,960,90,label('平均の速さ ＝ 全体の道のり ÷ 全体の時間',600,88,{size:30,color:C.ink,anchor:'middle'}));
  s+=label('行き 120 km：2 時間',230,190,{size:28,color:C.dim})+label('帰り 120 km：3 時間',650,190,{size:28,color:C.dim});
  s+=fade(seg(p,.05,.25),label('道のり 240 km',300,280,{size:32,color:C.x,anchor:'middle'})+label('時間 5 時間',800,280,{size:32,color:C.t,anchor:'middle'}));
  s+=card(270,330,660,110,label('240 ÷ 5 ＝ 48 km/h',600,402,{size:44,color:C.v,anchor:'middle',weight:700}),seg(p,.5,.7),C.v);
  return s;
 },
 [K+'bars']:(p)=>{
  const A=tripAxes();
  let s=A.svg+tripBars(A,{g:seg(p,.0,.15),cells:seg(p,.35,.5),avg:seg(p,.75,.9)});
  s+=fade(seg(p,.1,.25),brace(A.X(0),A.X(2),A.Y(0)+42,{text:'2 時間',color:C.t,size:24})+brace(A.X(2),A.X(5),A.Y(0)+42,{text:'3 時間',color:C.t,size:24}));
  s+=card(860,100,320,290,label('1 時間ごとに',1020,160,{size:26,color:C.dim,anchor:'middle'})
   +label('60, 60,',1020,215,{size:30,color:C.v,anchor:'middle'})+label('40, 40, 40',1020,260,{size:30,color:'#a9b6f0',anchor:'middle'})
   +fade(seg(p,.6,.75),label('合計 240 ÷ 5',1020,315,{size:26,color:C.ink,anchor:'middle'})+label('＝ 48',1020,358,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.4,.55));
  return s;
 },
 [K+'pull']:(p)=>{
  const A=tripAxes();
  let s=A.svg+tripBars(A,{cells:1,avg:1});
  s+=fade(seg(p,.1,.3),line(A.X(0),A.Y(50),A.X(5),A.Y(50),{color:C.dim,w:2,dash:'4 6'})+label('50 ではない',A.X(3.5),A.Y(50)-12,{size:24,color:C.dim,anchor:'middle'}));
  s+=card(860,110,320,250,label('遅い 40 で',1020,175,{size:28,color:'#a9b6f0',anchor:'middle'})+label('長く 過ごす',1020,220,{size:28,color:C.ink,anchor:'middle'})+label('→ 40 寄りの 48',1020,290,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.35,.55));
  return s;
 },
 [K+'mistake']:(p)=>{
  let s=card(120,70,960,150,label('(60 ＋ 40) ÷ 2 ＝ 50',420,160,{size:40,color:C.dim,anchor:'middle'})+label('速さの平均',860,145,{size:30,color:C.a,anchor:'middle',weight:700})+label('（これではない）',860,190,{size:24,color:C.a,anchor:'middle'}),seg(p,.05,.2),C.a);
  s+=card(120,270,960,150,label('240 ÷ 5 ＝ 48',420,360,{size:40,color:C.v,anchor:'middle',weight:700})+label('平均の速さ',860,345,{size:30,color:C.hi,anchor:'middle',weight:700})+label('（全体 ÷ 全体）',860,390,{size:24,color:C.hi,anchor:'middle'}),seg(p,.5,.65),C.hi);
  return s;
 },
 // ================= S6 雷と次の問い =================
 ...Object.fromEntries([['thunder',0],['sound',1],['sound2',2]].map(([k,st])=>[K+k,(p)=>{
  let s=bolt(220,40,st?1:seg(p,.05,.15))+person(980,330);
  s+=line(100,330,1100,330,{color:C.dim,w:3});
  if(st===0){const u=seg(p,.3,.9);for(let i=0;i<3;i++){const r=mix(40,760,clamp01(u-i*.12));if(u>i*.12)s+=fade(.8,`<path d="M ${220+r} ${150} a ${r*.12} ${r*.25} 0 0 1 0 ${120}" fill="none" stroke="${C.hi}" stroke-width="3" opacity=".7"/>`);}
   s+=fade(seg(p,.3,.4),label(`${fmt(3*seg(p,.3,.9),1)} s`,600,90,{size:34,color:C.t,anchor:'middle',weight:700}));}
  else s+=label('3 s 後に 音',600,90,{size:34,color:C.t,anchor:'middle',weight:700});
  if(st>=1)s+=fade(st===1?seg(p,.05,.2):1,label('光：ほぼ 一瞬',600,190,{size:28,color:C.hi,anchor:'middle'}))+fade(st===1?seg(p,.45,.6):1,label('音：1 s あたり 約 340 m',600,250,{size:30,color:C.v,anchor:'middle',weight:700}));
  if(st===2)s+=fade(seg(p,.05,.25),tex('340\\times 3=1020\\,\\mathrm{m}',600,410,{size:50,auto:false}))+fade(seg(p,.6,.75),label('≈ 1 km',900,425,{size:36,color:C.hi,weight:700}))+fade(seg(p,.05,.2),brace(220,980,345,{text:'',color:C.x}));
  return s;
 }])),
 [K+'summary']:(p)=>{
  let s=card(110,60,980,170,label('速さ ＝ 道のり ÷ かかった時間',600,135,{size:40,color:C.v,anchor:'middle',weight:700})+label('1 s あたりに そろえた 道のり（定義）',600,195,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.v);
  s+=card(110,270,980,170,label('平均の速さ ＝ 全体の道のり ÷ 全体の時間',600,345,{size:36,color:C.v,anchor:'middle',weight:700})+label('途中が ずっと 同じ とは 限らない',600,405,{size:28,color:C.ink,anchor:'middle'}),seg(p,.5,.65),C.v);
  return s;
 },
 [K+'last1']:(p)=>{
  let s=backForth(p,{g1:seg(p,.05,.45),g2:seg(p,.55,.95)});
  s+=fade(seg(p,.85,.97),label('道のり 3 ＋ 3 ＝ 6 m',600,440,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'last2']:(p)=>{
  let s=backForth(1);
  s+=card(220,385,760,100,label('「どこへ 移ったか」 ＝ ？',600,448,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'bye']:(p)=>{
  let s=card(200,110,800,230,label('次回',600,175,{size:28,color:C.dim,anchor:'middle'})+label('向きを持つ「速度」',600,255,{size:46,color:C.v,anchor:'middle',weight:700})+label('「どこへ移ったか」に 答える',600,310,{size:26,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.v);
  s+=fade(seg(p,.5,.7),label('速度・深く学ぶ 2/2 へ',1080,470,{size:26,color:C.dim,anchor:'end'}));
  return s;
 },
};
function clamp01(u){return Math.max(0,Math.min(1,u));}

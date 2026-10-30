// YouTube シリーズ「微分方程式・上級 1/2」(ys-um-ode-1) — 図。Stage 1200×515.
// 色（初級・中級と同じ）：速さ v 紫、時刻 t 金、量 y（中級の例）橙、減る量・誤り 赤、強調・積分定数 C・A 黄、ln の量 水色。
// 上端の帯（補助線①）：手順6段のどこにいるかを示す。
// v の形の図（数値なし）：v＝A e^(−0.5t)。中級の例：y＝100e^(−0.2t)、ln y＝4.605−0.2t、1 秒刻み ln(100×0.8ⁱ)＝4.605, 4.382, 4.159, 3.936, 3.713。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,arrow,brace,highlight,axes,tex,texWidth,draw,poly} from './anim.mjs';

const K='um-ode-1:';
const CV=C.v,CT=C.t,CY=C.E,CR=C.a,CH=C.hi,CL=C.x,OK=C.F;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const cV=s=>cs(CV,s),cT=s=>cs(CT,s),cY=s=>cs(CY,s),cR=s=>cs(CR,s),cH=s=>cs(CH,s),cL=s=>cs(CL,s);
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});
const TF=(s,x,y,maxW,size=44,o={})=>{const w=texWidth(s,size,false);return T(s,x,y,{size:w>maxW?size*maxW/w:size,...o});};
const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const check=(x,y,sz=14,color=OK)=>draw([[x-sz,y],[x-sz*.3,y+sz*.7],[x+sz,y-sz*.8]],1,{color,w:5});
const cross=(x,y,sz=16,color=CR)=>line(x-sz,y-sz,x+sz,y+sz,{color,w:5})+line(x-sz,y+sz,x+sz,y-sz,{color,w:5});

// ---- formulas ----
const v=cV('v'),t=cT('t'),dvdt=`\\dfrac{d${v}}{d${t}}`;
const EQ=`${dvdt}=-k${v}`;
const lnv=`${cL('\\ln|')}${v}${cL('|')}`;
const eNeg=`e^{-k${t}}`;

// ---- the 6-step bar (補助線①) ----
const STEPS=['① 零解','② v で割る','③ ln|v| の傾き','④ 積分','⑤ 指数へ','⑥ 初期値'];
function bar(cur,g=1){
 let s='';
 STEPS.forEach((n,i)=>{
  const x=14+i*197,w=184,y=6,h=40,on=i+1===cur,done=i+1<cur;
  s+=rect(x,y,w,h,{fill:on?CH:'#131f38',fo:on?.2:.9,stroke:on?CH:C.faint,sw:on?2.5:1.5,rx:10});
  s+=label(n,x+w/2,y+28,{size:22,color:on?CH:done?C.ink:C.dim,anchor:'middle',weight:on?700:400});
  if(done)s+=check(x+w-16,y+20,8);
 });
 return fade(g,s);
}

// ---- v(t) shapes (no numbers) ----
const GV=(o={})=>axes({x:90,y:478,w:520,h:340,xmin:0,xmax:4,ymin:-1.8,ymax:2,xticks:[],yticks:[],xlabel:'t',ylabel:'v',xcolor:CT,ycolor:CV,...o});
const fam=A=>u=>A*Math.exp(-0.5*u);
function family(Ax,list,{hl=null,zero=0,zeroHl=0,g=1}={}){
 let s='';
 list.forEach(A=>{const on=hl!==null&&Math.abs(A-hl)<1e-9;s+=Ax.plot(fam(A),{from:0,to:3.9,color:on?CH:CV,w:on?5:3});});
 s+=fade(zero,line(Ax.X(0),Ax.Y(0),Ax.X(3.9),Ax.Y(0),{color:zeroHl?CH:CV,w:zeroHl?6:4}));
 return fade(g,s);
}

// ---- 中級の例 ----
const yEx=u=>100*Math.exp(-0.2*u);
const GY=(o={})=>axes({x:90,y:460,w:500,h:360,xmin:0,xmax:4.4,ymin:0,ymax:110,xticks:[1,2,3,4],yticks:[20,40,60,80,100],grid:true,xlabel:'t [s]',ylabel:'y [g]',xcolor:CT,ycolor:CY,...o});
const GLN=(o={})=>axes({x:110,y:460,w:520,h:360,xmin:0,xmax:4.4,ymin:3.6,ymax:4.7,xticks:[1,2,3,4],yticks:[3.7,3.8,3.9,4,4.1,4.2,4.3,4.4,4.5,4.6],grid:true,xlabel:'t [s]',ylabel:'ln y',xcolor:CT,ycolor:CL,...o});
const lnEx=u=>Math.log(100)-0.2*u;
const lnStep=i=>Math.log(100*0.8**i);

function eqRow(rows,{x=600,y0=140,dy=90,size=48,g=[]}={}){
 return rows.map((r,i)=>fade(g[i]??1,T(r,x,y0+i*dy,{size}))).join('');
}

export const ytUmOde1Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  const A=GY({x:80,w:480});
  let s=A.svg;
  const pts1=[0,1,2,3,4].map(i=>[A.X(i),A.Y(100*0.8**i)]);
  s+=draw(pts1,1,{color:C.dim,w:3})+pts1.map(q=>dot(q[0],q[1],6,C.dim)).join('');
  const pts2=Array.from({length:9},(_,i)=>[A.X(i*.5),A.Y(100*0.9**i)]);
  s+=draw(pts2,1,{color:C.p,w:3});
  s+=fade(seg(p,.15,.35),A.plot(yEx,{from:0,to:4.3,color:CY,w:5}));
  s+=card(650,80,500,330,L('減り方は、今の量に比例',900,140,{size:30,color:CY,weight:700})
   +T(`\\dfrac{dy}{d${t}}=-ky`,900,230,{size:50})
   +fade(seg(p,.45,.6),L('数値で見た 指数関数の減り方を',900,320,{size:26,color:C.ink})+L('式から 導くには？',900,375,{size:34,color:CH,weight:700})),1,CH);
  return s;
 },
 [K+'recall1']:(p)=>{
  let s=T(EQ,600,190,{size:84});
  s+=fade(seg(p,.1,.25),brace(345,505,265,{text:'速さ v の変わる速さ',size:26,color:CV}));
  s+=fade(seg(p,.25,.4),brace(650,850,265,{text:'今の速さに比例',size:26,color:CR}));
  s+=fade(seg(p,.4,.55),label('マイナス：減る向き',820,90,{size:26,color:CR,anchor:'middle'})+arrow(800,100,715,150,{color:CR,w:3,head:10}));
  s+=card(330,385,540,90,L('k は 正の定数（初級：ブレーキ）',600,440,{size:28,color:CH}),seg(p,.55,.7));
  return s;
 },
 [K+'recall2']:(p)=>{
  const A=GY({x:80,w:520});
  let s=A.svg;
  const pts1=[0,1,2,3,4].map(i=>[A.X(i),A.Y(100*0.8**i)]);
  s+=draw(pts1,seg(p,.0,.2),{color:C.dim,w:3})+fade(seg(p,.1,.2),label('1 s 刻み',A.X(4)+10,A.Y(40.96)+30,{size:22,color:C.dim}));
  const pts2=Array.from({length:9},(_,i)=>[A.X(i*.5),A.Y(100*0.9**i)]);
  s+=draw(pts2,seg(p,.2,.4),{color:C.p,w:3});
  const pts3=Array.from({length:17},(_,i)=>[A.X(i*.25),A.Y(100*0.95**i)]);
  s+=draw(pts3,seg(p,.4,.6),{color:CH,w:3});
  s+=fade(seg(p,.6,.75),A.plot(yEx,{from:0,to:4.3,color:CY,w:5}));
  s+=card(660,90,490,300,L('中級：一歩の式',905,145,{size:26,color:C.dim})
   +T(`y_{i+1}\\approx y_i\\,(1-k\\,\\Delta ${t})`,905,225,{size:44})
   +fade(seg(p,.6,.75),L('刻みを細かくすると',905,310,{size:26})+L('1本の曲線に 近づく',905,355,{size:30,color:CY,weight:700})),1);
  return s;
 },
 [K+'recall3']:(p)=>{
  const A=GY({x:80,w:520});
  let s=A.svg+A.plot(yEx,{from:0,to:4.3,color:CY,w:5});
  s+=card(660,90,490,330,T(`y=y_0\\,e^{-k${t}}`,905,180,{size:56})
   +fade(seg(p,.15,.3),L('数値で 確かめただけ',905,275,{size:30,color:C.dim}))
   +fade(seg(p,.5,.65),L('導き方は 上級で（約束）',905,355,{size:30,color:CH,weight:700})),1,CH);
  return s;
 },
 [K+'goal']:(p)=>{
  let s=T(EQ,330,170,{size:60})+fade(seg(p,.1,.25),arrow(330,225,330,300,{color:CH,w:5})+T(`${v}(${t})=\\;?`,330,360,{size:60}));
  s+=fade(seg(p,.02,.12),label('刻まずに 直接',330,60,{size:28,color:C.dim,anchor:'middle'}));
  s+=card(640,90,520,330,L('道具',900,140,{size:28,color:C.dim})
   +fade(seg(p,.4,.55),T(`(\\ln|x|)'=\\dfrac{1}{x}`,900,225,{size:48})+L('微分の法則・上級 1/2',900,285,{size:22,color:C.dim}))
   +fade(seg(p,.7,.85),L('積分（傾きから 元の量へ）',900,365,{size:28,color:CH})),1);
  return s;
 },
 [K+'flow']:(p)=>{
  let s='';
  const names=[['零解を','確かめる'],['v ≠ 0 で','割る'],['左を ln|v| の','傾きと見る'],['時間で','積分する'],['指数へ','戻す'],['初期値で','定数を決める']];
  names.forEach((nm,i)=>{
   const r=Math.floor(i/3),c=i%3,x=70+c*370,y=90+r*200,g=seg(p,.05+i*.12,.15+i*.12);
   s+=fade(g,rect(x,y,300,130,{fill:'#131f38',fo:.96,stroke:CH,sw:2,rx:14})+label(`${'①②③④⑤⑥'[i]}`,x+30,y+44,{size:30,color:CH,weight:700})
    +L(nm[0],x+165,y+58,{size:28})+L(nm[1],x+165,y+100,{size:28}));
   if(i%3<2)s+=fade(g,arrow(x+305,y+65,x+362,y+65,{color:C.dim,w:4,head:14}));
  });
  s+=fade(seg(p,.35,.45),draw([[970,225],[970,255],[220,255],[220,285]],1,{color:C.dim,w:4}))+fade(seg(p,.4,.5),arrow(220,270,220,288,{color:C.dim,w:4,head:14}));
  return s;
 },
 // ===== S2 零解 =====
 [K+'div']:(p)=>{
  let s=bar(1);
  s+=T(EQ,600,200,{size:80});
  s+=fade(seg(p,.1,.25),label('÷ v',300,205,{size:40,color:CH,anchor:'middle',weight:700})+label('÷ v',900,205,{size:40,color:CH,anchor:'middle',weight:700}));
  s+=card(300,330,600,120,L('v ＝ 0 なら',600,380,{size:30,color:CR})+L('0 で 割ることは できない',600,428,{size:30,color:CR,weight:700}),seg(p,.55,.7),CR);
  return s;
 },
 [K+'zero']:(p)=>{
  const A=GV();let s=bar(1)+A.svg;
  s+=line(A.X(0),A.Y(0),A.X(3.9),A.Y(0),{color:CH,w:6})+fade(seg(p,.05,.2),label('v ＝ 0（ずっと）',A.X(2.6),A.Y(0)-20,{size:26,color:CH,anchor:'middle',weight:700}));
  s+=card(680,110,470,260,L('左の辺',915,160,{size:26,color:C.dim})+T(`${dvdt}=\\dfrac{d\\,0}{d${t}}`,915,240,{size:48})
   +fade(seg(p,.5,.65),T('=0',915,320,{size:48})+label('定数の傾き',1060,325,{size:22,color:C.dim,anchor:'middle'})),seg(p,.1,.25));
  return s;
 },
 [K+'zero2']:(p)=>{
  const A=GV();let s=bar(1)+A.svg+line(A.X(0),A.Y(0),A.X(3.9),A.Y(0),{color:CH,w:6});
  s+=card(680,90,470,320,L('左の辺',800,140,{size:26,color:C.dim})+L('右の辺',1030,140,{size:26,color:C.dim})
   +T('0',800,215,{size:52})+T('-k\\times 0=0',1030,215,{size:44})
   +fade(seg(p,.3,.45),T('0=0',915,300,{size:52})+check(1010,295,14))
   +fade(seg(p,.45,.6),L('どの時刻でも 一致 → v ＝ 0 も解',915,375,{size:26,color:OK,weight:700})),1);
  s+=fade(seg(p,.65,.8),label('止まった物体は 止まったまま',A.X(2),A.Y(1.4),{size:26,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'lost']:(p)=>{
  let s=bar(1);
  s+=card(170,110,860,140,T(`${v}=0`,330,190,{size:60})+L('零解',560,200,{size:44,color:CH,weight:700})+L('割る前に 確かめておく',820,200,{size:30,color:C.ink}),1,CH);
  s+=card(170,300,860,130,L('いきなり ÷ v で 始めると …',600,350,{size:28,color:C.dim})+L('この解を 見落とす',600,400,{size:32,color:CR,weight:700}),seg(p,.05,.2),CR);
  return s;
 },
 [K+'uniq']:(p)=>{
  const A=GV();let s=bar(1)+A.svg;
  s+=family(A,[1.6,0.9],{});
  s+=line(A.X(0),A.Y(0),A.X(3.9),A.Y(0),{color:CH,w:4});
  const bad=u=>1.3*(1-u/1.8);
  s+=fade(seg(p,.1,.3),A.plot(bad,{from:0,to:1.8,color:CR,w:4,dash:'10 8'})+dot(A.X(1.8),A.Y(0),9,CR)+label('0 に なる？',A.X(1.8),A.Y(0)+44,{size:26,color:CR,weight:700}));
  s+=dot(A.X(0),A.Y(1.3),8,CV)+label('0 でない 出発',A.X(0)+16,A.Y(1.3)-14,{size:22,color:CV});
  s+=card(680,150,470,200,L('答え',915,200,{size:26,color:C.dim})+L('0 に ならず',915,255,{size:32,color:OK,weight:700})+L('符号も 変わらない',915,310,{size:32,color:OK,weight:700}),seg(p,.55,.7));
  return s;
 },
 [K+'uniq2']:(p)=>{
  const A=GV();let s=bar(1)+A.svg;
  const bad=u=>1.3*(1-u/1.8);
  s+=A.plot(bad,{from:0,to:1.8,color:CR,w:4,dash:'10 8'});
  s+=line(A.X(0),A.Y(0),A.X(3.9),A.Y(0),{color:CH,w:4});
  const X0=A.X(1.8),Y0=A.Y(0);
  s+=dot(X0,Y0,10,CR);
  s+=fade(seg(p,.1,.3),A.plot(u=>-1.3*(u-1.8)/1.8,{from:1.8,to:3.2,color:CR,w:4,dash:'10 8'})+label('その先 ①',A.X(3.2)+8,A.Y(-1.3*1.4/1.8)+8,{size:24,color:CR}));
  s+=fade(seg(p,.2,.35),label('その先 ②：零解',A.X(3),Y0-16,{size:24,color:CH,anchor:'middle'}));
  s+=fade(seg(p,.3,.45),label('同じ出発点から 2本',X0-30,Y0+110,{size:26,color:CR,anchor:'end',weight:700}));
  s+=card(680,140,470,230,L('解の一意性',915,195,{size:32,color:CH,weight:700})+L('出発点が決まれば 解は1本',915,255,{size:26})
   +fade(seg(p,.7,.85),L('ここでは 証明せずに 認める',915,320,{size:26,color:C.dim})),seg(p,.5,.65),CH);
  return s;
 },
 // ===== S3 ln|v| の傾き =====
 [K+'divide']:(p)=>{
  let s=bar(2)+T(EQ,600,150,{size:56});
  s+=fade(seg(p,.05,.2),label('v ≠ 0 で 両辺 ÷ v',760,262,{size:28,color:CH,anchor:'start'})+arrow(600,232,600,292,{color:CH,w:4,head:12}));
  s+=fade(seg(p,.2,.4),T(`\\dfrac{d${v}/d${t}}{${v}}=-k`,600,395,{size:66}));
  return s;
 },
 [K+'ratio']:(p)=>{
  let s=bar(2)+T(`\\dfrac{d${v}/d${t}}{${v}}`,190,180,{size:50})+label('＝ 減る割合',190,270,{size:26,color:C.dim,anchor:'middle'});
  const base=440,sc=2.2;
  const col=(x,val,dec,g)=>fade(g,rect(x,base-val*sc,110,val*sc,{fill:CV,fo:.35,rx:4})+label(`v ＝ ${val}`,x+55,base+34,{size:26,color:CV,anchor:'middle'})
   +arrow(x+150,base-val*sc,x+150,base-val*sc+dec*sc,{color:CR,w:5,head:12})+label(`減る速さ ${dec}`,x+170,base-val*sc+dec*sc/2+8,{size:24,color:CR}));
  s+=col(390,100,20,seg(p,.2,.35))+col(760,50,10,seg(p,.45,.6));
  s+=fade(seg(p,.35,.5),T('20\\div100=0.2',445,180,{size:36}));
  s+=fade(seg(p,.6,.75),T('10\\div50=0.2',815,290,{size:36}));
  s+=fade(seg(p,.05,.15),label('k ＝ 0.2 /s',190,330,{size:28,color:CH,anchor:'middle'}));
  return s;
 },
 [K+'ratio2']:(p)=>{
  const e2=`\\dfrac{d${v}/d${t}}{${v}}=-k`,W2=texWidth(e2,72,false),Wk=texWidth('-k',72,false);
  let s=bar(2)+T(e2,600,200,{size:72});
  s+=fade(seg(p,.1,.3),highlight(600+W2/2-Wk-14,150,Wk+28,90,1,CH));
  s+=card(270,330,660,110,L('減る割合が いつも 同じ k',600,395,{size:34,color:CH,weight:700}),seg(p,.2,.4));
  return s;
 },
 [K+'askln']:(p)=>{
  let s=bar(3)+T(`\\dfrac{d${v}/d${t}}{${v}}`,330,200,{size:66})+fade(seg(p,.05,.2),label('何かの 関数の 傾き？',330,320,{size:30,color:CH,anchor:'middle',weight:700}));
  s+=card(640,110,500,250,L('微分の法則・上級 1/2',890,160,{size:24,color:C.dim})+T(`\\dfrac{d}{dx}\\ln|x|=\\dfrac{1}{x}`,890,260,{size:54}),seg(p,.4,.55),CH);
  return s;
 },
 [K+'chain']:(p)=>{
  let s=bar(3);
  const box=(x,txt,col)=>rect(x-85,170,170,90,{fill:'#131f38',fo:.96,stroke:col,sw:2.5,rx:14})+T(txt,x,225,{size:46});
  s+=box(200,t,CT)+fade(seg(p,.05,.2),arrow(290,215,470,215,{color:C.dim,w:4,head:14})+box(560,v,CV)+label('中身',380,195,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.25,.4),arrow(650,215,830,215,{color:C.dim,w:4,head:14})+box(920,lnv,CL)+label('外側 ln',740,195,{size:26,color:C.dim,anchor:'middle'}));
  s+=card(250,330,700,110,L('二段の関数 → 連鎖律',600,395,{size:32,color:CH,weight:700}),seg(p,.6,.75));
  s+=label('ln|v| を t で 微分',600,110,{size:28,color:C.ink,anchor:'middle'});
  return s;
 },
 [K+'chain2']:(p)=>{
  let s=bar(3);
  const box=(x,txt,col)=>rect(x-85,110,170,90,{fill:'#131f38',fo:.96,stroke:col,sw:2.5,rx:14})+T(txt,x,165,{size:46});
  s+=box(200,t,CT)+arrow(290,155,470,155,{color:C.dim,w:4,head:14})+box(560,v,CV)+arrow(650,155,830,155,{color:C.dim,w:4,head:14})+box(920,lnv,CL);
  s+=fade(seg(p,.02,.15),label('中身の倍率',380,232,{size:22,color:C.dim,anchor:'middle'})+T(dvdt,380,300,{size:36}));
  s+=fade(seg(p,.0,.12),label('外側の倍率',740,232,{size:22,color:C.dim,anchor:'middle'})+T(`\\dfrac{1}{${v}}`,740,300,{size:36}));
  s+=fade(seg(p,.3,.5),T(`\\dfrac{d}{d${t}}${lnv}=\\dfrac{1}{${v}}\\cdot${dvdt}=`,700,430,{size:44,anchor:'end'}));
  s+=fade(seg(p,.45,.6),T(`\\dfrac{d${v}/d${t}}{${v}}`,800,430,{size:44}));
  s+=fade(seg(p,.6,.75),highlight(735,375,130,110,1,OK)+label('左の辺と 同じ',990,440,{size:26,color:OK,anchor:'middle',weight:700}));
  return s;
 },
 [K+'abs']:(p)=>{
  const A=axes({x:80,y:470,w:560,h:330,xmin:-3.2,xmax:3.2,ymin:-2.2,ymax:1.4,xticks:[-2,2],yticks:[],xlabel:'x',ylabel:'ln|x|',ycolor:CL});
  const f=u=>Math.log(Math.abs(u));
  let s=bar(3)+A.svg+A.plot(f,{from:0.12,to:3.1,color:CL,w:4})+A.plot(f,{from:-3.1,to:-0.12,color:CL,w:4});
  const tan=(x0,g)=>{const m=1/x0,y0=f(x0);return fade(g,line(A.X(x0-0.9),A.Y(y0-0.9*m),A.X(x0+0.9),A.Y(y0+0.9*m),{color:CH,w:3})+dot(A.X(x0),A.Y(y0),8,CH));};
  s+=tan(2,seg(p,.4,.55))+fade(seg(p,.45,.6),label('傾き 1/2',A.X(2),A.Y(f(2))-40,{size:24,color:CH,anchor:'middle'}));
  s+=tan(-2,seg(p,.55,.7))+fade(seg(p,.6,.75),label('傾き −1/2',A.X(-2),A.Y(f(-2))-40,{size:24,color:CH,anchor:'middle'}));
  s+=card(700,120,440,250,L('v が負の解も 含める',920,175,{size:28,color:CV})+fade(seg(p,.35,.5),T(`(\\ln|x|)'=\\dfrac{1}{x}`,920,265,{size:46})+L('x の正負に よらない',920,335,{size:26,color:C.dim})),1);
  return s;
 },
 [K+'rewrite']:(p)=>{
  let s=bar(3)+T(`\\dfrac{d}{d${t}}${lnv}=-k`,330,190,{size:56});
  const A=axes({x:660,y:450,w:450,h:300,xmin:0,xmax:4,ymin:0,ymax:4,xticks:[],yticks:[],xlabel:'t',ylabel:'ln|v|',xcolor:CT,ycolor:CL});
  s+=fade(seg(p,.4,.55),A.svg+A.plot(u=>3.5-0.6*u,{from:0,to:3.9,color:CL,w:5}));
  s+=fade(seg(p,.55,.7),draw([[A.X(1),A.Y(2.9)],[A.X(2),A.Y(2.9)],[A.X(2),A.Y(2.3)]],1,{color:CH,w:3})+label('1 秒',A.X(1.5),A.Y(2.9)-12,{size:22,color:CT,anchor:'middle'})+label('k 減る',A.X(2)+12,A.Y(2.6)+8,{size:22,color:CR}));
  s+=card(110,300,450,120,L('ln|v| が 毎秒 k ずつ',335,350,{size:28})+L('一定に 減る',335,395,{size:28,color:CH,weight:700}),seg(p,.5,.65));
  return s;
 },
 [K+'integ']:(p)=>{
  let s=bar(4);
  const A=axes({x:620,y:470,w:480,h:320,xmin:0,xmax:4,ymin:0,ymax:5,xticks:[],yticks:[],xlabel:'t',ylabel:'ln|v|',xcolor:CT,ycolor:CL});
  s+=A.svg+A.plot(u=>3.4-0.6*u,{from:0,to:3.9,color:CL,w:5});
  s+=T(`\\dfrac{d}{d${t}}${lnv}=-k`,320,150,{size:46});
  s+=fade(seg(p,.2,.35),label('傾きが いつも −k → 傾き −k の 直線',320,240,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.5,.65),T(`${lnv}=-k${t}+${cH('C')}`,320,340,{size:56}));
  s+=fade(seg(p,.55,.7),label('時間で 積分',320,410,{size:24,color:CH,anchor:'middle'}));
  return s;
 },
 [K+'cconst']:(p)=>{
  let s=bar(4);
  const A=axes({x:620,y:470,w:480,h:320,xmin:0,xmax:4,ymin:0,ymax:5,xticks:[],yticks:[],xlabel:'t',ylabel:'ln|v|',xcolor:CT,ycolor:CL});
  s+=A.svg;
  [4.3,3.4,2.5].forEach((c,i)=>{s+=fade(i===1?1:seg(p,.2,.4),A.plot(u=>c-0.6*u,{from:0,to:3.9,color:i===1?CL:C.dim,w:i===1?5:3}));});
  s+=fade(seg(p,.4,.55),arrow(A.X(0.5),A.Y(3.1),A.X(0.5),A.Y(3.85),{color:CH,w:4,head:12})+arrow(A.X(0.5),A.Y(3.1),A.X(0.5),A.Y(2.35),{color:CH,w:4,head:12}));
  s+=T(`${lnv}=-k${t}+${cH('C')}`,320,150,{size:52});
  s+=card(90,250,460,170,L('C ：積分定数',320,305,{size:32,color:CH,weight:700})+L('傾きだけでは 上下のずれが',320,355,{size:26})+L('決まらない',320,392,{size:26}),seg(p,.1,.25));
  return s;
 },
 [K+'short']:(p)=>{
  let s=bar(4);
  s+=T(`\\dfrac{d${v}}{${v}}=-k\\,d${t}`,600,135,{size:50});
  s+=fade(seg(p,.2,.35),T(`\\int\\dfrac{d${v}}{${v}}=\\int(-k)\\,d${t}`,600,280,{size:50}));
  s+=card(250,375,700,100,L('略記 ＝ 連鎖律 ＋ 積分 の 二段',600,435,{size:32,color:CH,weight:700}),seg(p,.55,.7),CH);
  return s;
 },
 [K+'short2']:(p)=>{
  let s=bar(4);
  s+=card(80,90,480,170,T(`\\dfrac{d${v}}{${v}}=-k\\,d${t}`,320,175,{size:48})+L('ばらばらに 扱う 略記',320,235,{size:24,color:C.dim}),1);
  s+=arrow(640,175,570,175,{color:CH,w:5,head:16})+label('根拠',605,155,{size:24,color:CH,anchor:'middle'});
  s+=card(650,90,480,170,T(`\\dfrac{d}{d${t}}${lnv}=\\dfrac{d${v}/d${t}}{${v}}`,890,175,{size:42})+L('連鎖律',890,235,{size:24,color:C.dim}),1);
  s+=card(250,320,700,110,L('使えるのは v ≠ 0 の 区間 だけ',600,385,{size:32,color:CR,weight:700}),seg(p,.5,.65),CR);
  return s;
 },
 // ===== S4 指数へ戻す =====
 [K+'exp']:(p)=>{
  let s=bar(5);
  s+=card(70,80,1060,80,L('ln|v| ＝「e を 何乗すれば |v| になるか」の 何乗',600,132,{size:30,color:CL}),1);
  s+=T(`${lnv}=-k${t}+${cH('C')}`,600,230,{size:50});
  s+=fade(seg(p,.4,.55),label('両辺を e の肩に',1000,300,{size:24,color:CH,anchor:'middle'})+arrow(600,265,600,305,{color:CH,w:4,head:12}));
  s+=fade(seg(p,.45,.6),T(`e^{${lnv}}=e^{-k${t}+${cH('C')}}`,600,370,{size:50}));
  s+=fade(seg(p,.7,.85),T(`|${v}|=e^{-k${t}+${cH('C')}}`,600,460,{size:50}));
  return s;
 },
 [K+'exp2']:(p)=>{
  let s=bar(5);
  s+=T(`|${v}|=e^{-k${t}+${cH('C')}}`,600,160,{size:56});
  s+=fade(seg(p,.35,.5),label('指数法則：e の (a＋b) 乗 ＝ e の a 乗 × e の b 乗',600,255,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.5,.65),T(`|${v}|=e^{${cH('C')}}\\cdot e^{-k${t}}`,600,370,{size:60}));
  return s;
 },
 [K+'pm']:(p)=>{
  const A=GV({x:640,w:500});let s=bar(5)+A.svg;
  s+=T(`|${v}|=e^{${cH('C')}}e^{-k${t}}`,320,140,{size:48});
  s+=fade(seg(p,.05,.2),label('e の C 乗 ＞ 0（正の定数）',320,215,{size:26,color:CH,anchor:'middle'}));
  s+=fade(seg(p,.4,.55),T(`${v}=\\pm\\, e^{${cH('C')}}e^{-k${t}}`,320,320,{size:52}));
  s+=fade(seg(p,.45,.6),A.plot(fam(1.2),{from:0,to:3.9,color:CV,w:4})+A.plot(fam(-1.2),{from:0,to:3.9,color:CV,w:4})+label('＋',A.X(0.3),A.Y(1.15)-14,{size:30,color:CV})+label('−',A.X(0.3),A.Y(-1.05)+34,{size:30,color:CV}));
  return s;
 },
 [K+'sign']:(p)=>{
  const A=GV({x:640,w:500});let s=bar(5)+A.svg;
  s+=fade(seg(p,.05,.2),label('一意性：符号は 途中で 変わらない',320,120,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.3,.45),T(`${cH('A')}=\\pm e^{${cH('C')}}`,320,210,{size:48}));
  s+=fade(seg(p,.5,.65),T(`${v}=${cH('A')}\\,e^{-k${t}}`,320,320,{size:64}));
  s+=family(A,[1.6,1.0,0.5,-0.6,-1.2],{g:seg(p,.5,.7)});
  return s;
 },
 [K+'azero']:(p)=>{
  const A=GV({x:640,w:500});let s=bar(5)+A.svg;
  s+=T(`${v}=${cH('A')}\\,e^{-k${t}}`,320,160,{size:64});
  s+=family(A,[1.6,1.0,0.5,-0.6,-1.2],{zero:1,zeroHl:1});
  s+=fade(seg(p,.05,.2),T(`${cH('A')}=0\\;\\to\\;${v}=0`,320,250,{size:44})+label('零解',A.X(3.9)+10,A.Y(0)-14,{size:24,color:CH,weight:700}));
  s+=card(90,270,460,150,L('A を選べば',320,325,{size:28})+L('解を すべて 含む',320,375,{size:32,color:OK,weight:700}),seg(p,.5,.65));
  return s;
 },
 [K+'init']:(p)=>{
  const A=GV({x:640,w:500});let s=bar(6)+A.svg;
  s+=family(A,[1.6,1.0,0.5,-0.6,-1.2],{zero:1,hl:1.0});
  s+=T(`${t}=0:\\; e^{0}=1`,320,140,{size:46});
  s+=fade(seg(p,.25,.4),T(`${v}(0)=${cH('A')}`,320,240,{size:56}));
  s+=fade(seg(p,.5,.65),dot(A.X(0),A.Y(1.0),10,CH)+label('v₀',A.X(0)-14,A.Y(1.0)+8,{size:28,color:CH,anchor:'end',weight:700}));
  s+=fade(seg(p,.55,.7),T(`${cH('A')}=${v}_0`,320,350,{size:56})+label('出発の値',320,415,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'result']:(p)=>{
  let s=bar(7);
  s+=card(300,80,600,140,T(`${v}=${v}_0\\,e^{-k${t}}`,600,165,{size:72}),1,OK);
  s+=fade(seg(p,.1,.25),label('導いた結果',600,255,{size:28,color:OK,anchor:'middle',weight:700}));
  s+=card(80,290,500,170,L('仮定',330,335,{size:26,color:C.dim})+L('減る速さ ∝ 今の量（k ＞ 0 一定）',330,380,{size:24})+L('認めた：解の一意性',330,425,{size:24,color:C.dim}),seg(p,.2,.35));
  s+=card(620,290,500,170,L('e が 現れた わけ',870,335,{size:26,color:C.dim})+L('ln を 元に 戻したから',870,395,{size:30,color:CL,weight:700}),seg(p,.6,.75));
  return s;
 },
 // ===== S5 中級の例 =====
 [K+'ex']:(p)=>{
  const A=GY({x:80,w:500});let s=A.svg+A.plot(yEx,{from:0,to:4.3,color:CY,w:5});
  s+=card(660,90,490,330,L('中級の例',905,140,{size:26,color:C.dim})+T(`\\dfrac{dy}{d${t}}=-0.2\\,y`,905,215,{size:46})+L('y₀ ＝ 100 g、k ＝ 0.2 /s',905,290,{size:26,color:CY})
   +fade(seg(p,.5,.65),L('v を y に 読み替えても 同じ',905,365,{size:26,color:CH,weight:700})),1);
  return s;
 },
 [K+'ex2']:(p)=>{
  let s=T(`\\ln y=C-0.2\\,${t}`,600,140,{size:60});
  s+=fade(seg(p,.3,.45),T(`${t}=0,\\; y=100`,600,250,{size:46}));
  s+=fade(seg(p,.55,.7),T(`C=\\ln 100\\approx 4.605`,600,360,{size:56}));
  return s;
 },
 [K+'line']:(p)=>{
  const A=GLN();let s=A.svg;
  s+=card(700,90,450,130,L('ln に 入れるのは',925,140,{size:26,color:C.dim})+L('グラムを 外した 数',925,190,{size:30,color:C.ink,weight:700}),1);
  s+=fade(seg(p,.45,.6),A.plot(lnEx,{from:0,to:4.3,color:CL,w:5}));
  s+=fade(seg(p,.55,.7),T(`\\ln y=4.605-0.2\\,${t}`,925,300,{size:40})+L('傾き −0.2 の 直線',925,370,{size:28,color:CH,weight:700}));
  return s;
 },
 [K+'line2']:(p)=>{
  const A=GLN({x:90,w:480});let s=A.svg+A.plot(lnEx,{from:0,to:4.3,color:CL,w:5});
  s+=dot(A.X(0),A.Y(lnEx(0)),8,CL)+dot(A.X(1),A.Y(lnEx(1)),9,CH);
  s+=label('4.605',A.X(0)+14,A.Y(lnEx(0))-12,{size:24,color:CL});
  s+=fade(seg(p,.1,.25),label('4.405',A.X(1)+14,A.Y(lnEx(1))-14,{size:24,color:CH,weight:700}));
  for(let i=0;i<4;i++)s+=fade(seg(p,.45+i*.05,.55+i*.05),label('−0.2',A.X(i+0.5),A.Y(lnEx(i+0.5))+38,{size:22,color:CR,anchor:'middle'}));
  const B=axes({x:700,y:450,w:400,h:300,xmin:0,xmax:4.4,ymin:0,ymax:110,xticks:[1,2,3,4],yticks:[],xlabel:'t',ylabel:'y',xcolor:CT,ycolor:CY});
  s+=fade(seg(p,.4,.55),B.svg+B.plot(yEx,{from:0,to:4.3,color:CY,w:4})+label('y は 曲線',B.X(2.4),B.Y(85),{size:26,color:CY,weight:700}));
  s+=fade(seg(p,.4,.55),label('ln y は 直線',A.X(2.6),A.Y(4.6),{size:26,color:CL,weight:700}));
  return s;
 },
 [K+'step']:(p)=>{
  const A=GLN();let s=A.svg+A.plot(lnEx,{from:0,to:4.3,color:CL,w:5});
  const pts=[0,1,2,3,4].map(i=>[A.X(i),A.Y(lnStep(i))]);
  s+=fade(seg(p,.1,.3),draw(pts,1,{color:C.dim,w:2,dash:'7 6'})+pts.map(q=>dot(q[0],q[1],7,C.p)).join(''));
  s+=card(700,90,450,150,L('1 秒刻み：毎秒 × 0.8',925,140,{size:26,color:C.p})+T('\\ln 0.8\\approx -0.223',925,200,{size:40}),1);
  for(let i=0;i<4;i++)s+=fade(seg(p,.5+i*.06,.6+i*.06),label('−0.223',A.X(i+1)-12,A.Y(lnStep(i+1))+30,{size:22,color:C.p,anchor:'end'}));
  s+=fade(seg(p,.4,.55),label('本当の直線',A.X(2.9),A.Y(4.25),{size:24,color:CL,anchor:'start'}));
  return s;
 },
 [K+'step2']:(p)=>{
  const A=GLN();let s=A.svg+A.plot(lnEx,{from:0,to:4.3,color:CL,w:5});
  const pts=[0,1,2,3,4].map(i=>[A.X(i),A.Y(lnStep(i))]);
  s+=draw(pts,1,{color:C.dim,w:2,dash:'7 6'})+pts.map(q=>dot(q[0],q[1],7,C.p)).join('');
  s+=card(700,90,450,200,L('本当：1秒に −0.2',925,140,{size:26,color:CL})+L('刻み：1秒に −0.223',925,185,{size:26,color:C.p})
   +fade(seg(p,.35,.5),L('毎秒 約0.023 下げすぎ',925,250,{size:28,color:CR,weight:700})),1);
  const X4=A.X(4);
  s+=fade(seg(p,.6,.75),line(X4+70,A.Y(lnEx(4)),X4+70,A.Y(lnStep(4)),{color:CR,w:5})+label('約 0.09',X4+84,A.Y((lnEx(4)+lnStep(4))/2)+9,{size:26,color:CR,weight:700}));
  s+=fade(seg(p,.6,.75),label('3.805',X4+22,A.Y(lnEx(4))-8,{size:22,color:CL})+label('3.713',X4+22,A.Y(lnStep(4))+20,{size:22,color:C.p}));
  return s;
 },
 [K+'step3']:(p)=>{
  const A=GY({x:80,w:520});let s=A.svg+A.plot(yEx,{from:0,to:4.3,color:CY,w:5});
  const pts1=[0,1,2,3,4].map(i=>[A.X(i),A.Y(100*0.8**i)]);
  s+=draw(pts1,1,{color:C.p,w:3})+pts1.map(q=>dot(q[0],q[1],6,C.p)).join('');
  s+=label('40.96',A.X(4)+12,A.Y(40.96)+28,{size:24,color:C.p,weight:700});
  s+=dot(A.X(4),A.Y(yEx(4)),9,CY)+label('行き先 ？',A.X(4)+8,A.Y(yEx(4))-34,{size:24,color:CY,weight:700});
  s+=fade(seg(p,.2,.4),line(A.X(4)-12,A.Y(yEx(4)),A.X(4)-12,A.Y(40.96),{color:CR,w:5}));
  s+=card(680,120,470,230,L('ln で 約 0.09 の 差',915,180,{size:28,color:CR,weight:700})+L('＝ 1秒刻みが',915,245,{size:28})+L('小さくなった 分',915,295,{size:28}),seg(p,.3,.45));
  return s;
 },
 [K+'sum']:(p)=>{
  let s=bar(7);
  const rows=[['① 零解 v ＝ 0 を 確かめる',null],['② v ≠ 0 で 割る',`\\dfrac{d${v}/d${t}}{${v}}=-k`],['③ ln|v| の 傾きと見る',`\\dfrac{d}{d${t}}${lnv}=-k`],['④ 積分',`${lnv}=-k${t}+C`],['⑤ 指数へ',`${v}=A\\,e^{-k${t}}`],['⑥ 初期値',`${v}=${v}_0\\,e^{-k${t}}`]];
  rows.forEach((r,i)=>{const y=95+i*70,g=seg(p,.03+i*.1,.13+i*.1);s+=fade(g,label(r[0],120,y+10,{size:28,color:C.ink,anchor:'start'})+(r[1]?T(r[1],860,y,{size:r[1].includes('dfrac')?32:36}):'')+check(90,y,10));});
  return s;
 },
 [K+'next']:(p)=>{
  let s=T(`${v}=${v}_0\\,e^{-k${t}}`,600,150,{size:70});
  s+=fade(seg(p,.2,.4),arrow(600,215,600,280,{color:CH,w:5}));
  s+=card(250,290,700,150,T(`${dvdt}=-k${v}\\quad ?`,600,368,{size:50}),seg(p,.3,.5),CH);
  s+=fade(seg(p,.4,.55),label('本当に 満たす？',600,480,{size:30,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next2']:(p)=>{
  let s=card(80,110,480,280,L('中級：刻みの行き先',320,170,{size:26,color:C.dim})+L('44 グラム台',320,260,{size:46,color:CY,weight:700})+L('式から どう出る？',320,340,{size:28,color:CH}),1,CH);
  s+=card(640,110,480,280,L('中級：半分になる時間',880,170,{size:26,color:C.dim})+L('約 3.47 秒',880,260,{size:46,color:CT,weight:700})+L('式から どう出る？',880,340,{size:28,color:CH}),seg(p,.4,.55),CH);
  return s;
 },
};

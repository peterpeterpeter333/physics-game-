// 高校編「電場とクーロンの法則・深く学ぶ 3/3」(ys-hs-e-field-3) — 図。Stage 1200×515.
// 色：電位 V 紫、位置エネルギー U・仕事 W 橙、電場 𝐄 水色、力 F 緑、電荷 q 桃、距離 d 白（強調は黄）。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,poly,clamp,mix,axes} from './anim.mjs';
import {card,tag,fcard,circuit,CIR,POS,NEG,FA,EC,VC,QC,FC,UC,HI,RC,cs,Ft,Et,vE,qt,Vt,Ut,Wt,U,TX,chg,dist} from './yt1-hs-e-field-1-diagrams.mjs';
import {EA} from './yt1-hs-e-field-2-diagrams.mjs';

const K='hs-e-field-3:';
export const VDEF=`${Vt}=\\dfrac{${Ut}}{${qt}}`;
const big=(t,x,y,{size=34,color=C.ink,g=1}={})=>fade(g,label(t,x,y,{size,color,anchor:'middle',weight:700}));
const V1=cs(VC,'V_1'),V2=cs(VC,'V_2'),dt='d';
// uniform field region with rows of arrows
export function uniField({x=100,y=70,w=640,h=300,rows=3,g=1,op=.75,lab=true}={}){
 let s='';for(let i=0;i<rows;i++){const yy=y+h*(i+.5)/rows;s+=EA(x,yy,x+w,yy,{w:4,head:16,opacity:op});}
 if(lab)s+=TX(vE,x+w+30,y+h*.5/rows+10,{size:40});
 return fade(g,s);
}
const P1=[230,170],P2=[610,170];
function moveScene(p,{u=1,F=0,W=0,pts=1}={}){
 let s=uniField();
 s+=fade(pts,ring(P1[0],P1[1],8,{color:HI,w:3})+label('1',P1[0]-8,P1[1]+88,{size:28,color:HI,weight:700})+ring(P2[0],P2[1],8,{color:HI,w:3})+label('2',P2[0]-8,P2[1]+88,{size:28,color:HI,weight:700})+line(P1[0],P1[1]+10,P1[0],P1[1]+58,{color:HI,w:2,dash:'4 4'})+line(P2[0],P2[1]+10,P2[0],P2[1]+58,{color:HI,w:2,dash:'4 4'}));
 s+=dist(P1[0],P2[0],400,{src:'d',g:pts});
 const x=mix(P1[0],P2[0],u);s+=chg(x,P1[1],{r:20})+TX(qt,x-36,P1[1]+12,{size:32});
 if(F>0)s+=FA(x+24,P1[1],x+124,P1[1],{g:F,w:9,head:22})+fade(F,TX(`${qt}${Et}`,x+150,P1[1]+10,{size:30,color:FC}));
 return s;
}
// U bar (orange) at x
function ubar(x,base,val,{g=1,text='U'}={}){return fade(g,rect(x-40,base-val,80,val,{fill:UC,fo:.55,stroke:UC,sw:2,rx:4})+label(text,x,base+34,{size:26,color:UC,anchor:'middle',weight:700}));}
// potential ruler (purple): marks at values, 0 at base
function vruler(x,y0,{marks=[],g=1,title='',k=40,top=5}={}){
 let s=line(x,y0,x,y0-k*top,{color:VC,w:3});
 marks.forEach(([v,t,c])=>{s+=line(x-10,y0-k*v,x+10,y0-k*v,{color:VC,w:3})+label(t,x-18,y0-k*v+8,{size:24,color:c||VC,anchor:'end',weight:700});});
 if(title)s+=label(title,x,y0+40,{size:26,color:C.dim,anchor:'middle'});
 return fade(g,s);
}
// slope triangle: drop height h (px) over run L (px), top-left at (x,y)
function slopeTri(x,y,L,h,{g=1,run='',drop='',grad='',col=VC}={}){
 let s=poly([[x,y],[x+L,y+h],[x,y+h]],{fill:VC,fo:.15,stroke:col,sw:3});
 s+=line(x,y,x+L,y+h,{color:col,w:5});
 if(drop)s+=label(drop,x-14,y+h/2+8,{size:26,color:VC,anchor:'end',weight:700});
 if(run)s+=label(run,x+L/2,y+h+36,{size:26,color:C.ink,anchor:'middle',weight:700});
 if(grad)s+=label(grad,x+L/2+30,y+h/2-18,{size:28,color:EC,weight:700});
 return fade(g,s);
}
function equiLines({g=1,x0=180,dx=170,n=4,vals=['40 V','30 V','20 V','10 V'],y=70,h=330,E=1,rowsY=null}={}){
 let s='';for(let i=0;i<n;i++){const x=x0+dx*i;s+=line(x,y,x,y+h,{color:VC,w:3,dash:'10 8'})+label(vals[i],x,y+h+36,{size:26,color:VC,anchor:'middle',weight:700});}
 const RY=rowsY||[y+60,y+165,y+270];if(E>0)for(const yy of RY)s+=EA(x0-60,yy,x0+dx*(n-1)+60,yy,{w:5,head:18,g:E});
 return fade(g,s);
}
export const hsEField3Diagrams={
 // ================= S1 前回の問い =================
 [K+'prev']:(p)=>{
  let s=uniField({g:1});
  const u=seg(p,.2,.7),x=mix(220,560,u);s+=chg(x,170,{r:20});
  s+=card(820,150,330,170,label('エネルギーは',985,215,{size:28,color:C.ink,anchor:'middle'})+label('どう 変わる？',985,275,{size:32,color:HI,anchor:'middle',weight:700}),seg(p,.4,.55),HI);
  return s;
 },
 [K+'q']:(p)=>{
  let s=circuit({on:1,cur:1,bhl:seg(p,.2,.35)});
  s+=card(850,140,310,230,label('電圧',1005,200,{size:32,color:VC,anchor:'middle',weight:700})+label('と',1005,250,{size:28,color:C.ink,anchor:'middle'})+label('電場',1005,300,{size:32,color:EC,anchor:'middle',weight:700})+label('どう つながる？',1005,350,{size:24,color:HI,anchor:'middle',weight:700}),seg(p,.4,.55),HI);
  return s;
 },
 [K+'plan']:(p)=>{
  let s=card(200,110,800,120,label('電気の 「高さ」',600,185,{size:38,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.faint);
  s+=card(350,270,500,120,label('＝ 電位',600,345,{size:42,color:VC,anchor:'middle',weight:700}),seg(p,.35,.5),VC);
  return s;
 },
 // ================= S2 電位の定義 =================
 [K+'grav']:(p)=>{
  const u=seg(p,.2,.6),gy=420,y=gy-200*u;
  let s=line(150,gy,650,gy,{color:C.dim,w:3});
  s+=rect(360,y-60,80,60,{fill:'#c9a46a',fo:.6,stroke:'#c9a46a',rx:6});
  s+=fade(u,line(480,gy,480,y-30,{color:HI,w:3,dash:'6 5'})+label('h',495,(gy+y-30)/2+8,{size:30,color:HI,weight:700}));
  s+=ubar(850,gy,170*u,{text:'位置エネルギー'});
  s+=fade(seg(p,.6,.75),label('増える',850,gy-200,{size:30,color:UC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'grav2']:(p)=>{
  let s=card(100,90,460,190,label('質量 m',330,150,{size:30,color:C.ink,anchor:'middle',weight:700})+TX(`${Ut}=mgh`,330,235,{size:52}),1,UC);
  s+=card(640,90,460,190,label('1 kg あたり',870,150,{size:30,color:C.ink,anchor:'middle',weight:700})+TX(`gh`,870,235,{size:52,color:UC}),seg(p,.2,.35),UC);
  s+=fade(seg(p,.6,.75),label('高さ だけで 決まる',870,350,{size:32,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'elecU']:(p)=>{
  let s=uniField();
  s+=chg(300,170,{r:22,g:seg(p,.1,.25)})+fade(seg(p,.1,.25),TX(qt,262,182,{size:36}));
  s+=ubar(950,420,150,{g:seg(p,.4,.55),text:'位置エネルギー U'});
  return s;
 },
 [K+'def']:(p)=>{
  let s=fcard(330,60,540,220,VDEF,{size:72,col:VC,g:seg(p,.25,.4)});
  s+=big('電位',600,360,{size:40,color:VC,g:seg(p,.05,.2)});
  s+=tag('定義',600,450,{g:seg(p,.7,.85),size:30});
  return s;
 },
 [K+'unit']:(p)=>{
  let s=fcard(330,40,540,190,VDEF,{size:62,col:VC});
  s+=fade(seg(p,.05,.2),label('1 C あたりの 位置エネルギー',600,290,{size:32,color:C.ink,anchor:'middle',weight:700}));
  s+=card(300,330,600,130,TX(`\\mathrm{J/C}=\\mathrm{V}`,600,400,{size:52,color:VC})+label('ボルト',790,410,{size:26,color:C.dim}),seg(p,.45,.6),VC);
  return s;
 },
 [K+'zero']:(p)=>{
  const g2=seg(p,.4,.55);
  let s=vruler(260,430,{marks:[[0,'0 V'],[1.5,'A 1.5 V',C.ink],[4.5,'B 4.5 V',C.ink]],title:'0 を 床に',k:70});
  s+=vruler(700,430,{marks:[[1.5,'A 0 V',C.ink],[4.5,'B 3.0 V',C.ink]],title:'0 を A に',g:g2,k:70});
  return s;
 },
 [K+'diff']:(p)=>{
  let s=vruler(260,430,{marks:[[0,'0 V'],[1.5,'A 1.5 V',C.ink],[4.5,'B 4.5 V',C.ink]],title:'0 を 床に',k:70});
  s+=vruler(700,430,{marks:[[1.5,'A 0 V',C.ink],[4.5,'B 3.0 V',C.ink]],title:'0 を A に',k:70});
  const g=seg(p,.1,.3);
  s+=fade(g,rect(285,430-70*4.5,24,70*3,{fill:HI,fo:.35,stroke:HI,sw:2,rx:4})+rect(725,430-70*4.5,24,70*3,{fill:HI,fo:.35,stroke:HI,sw:2,rx:4}));
  s+=fade(g,label('差 3.0 V',330,430-70*3+8,{size:28,color:HI,weight:700})+label('差 3.0 V',770,430-70*3+8,{size:28,color:HI,weight:700}));
  s+=card(930,150,240,200,label('電位差',1050,215,{size:32,color:VC,anchor:'middle',weight:700})+label('＝ 電圧',1050,275,{size:32,color:VC,anchor:'middle',weight:700})+label('変わらない',1050,325,{size:24,color:HI,anchor:'middle',weight:700}),seg(p,.5,.65),VC);
  return s;
 },
 [K+'recover']:(p)=>{
  let s=circuit({on:1,cur:1});
  s+=card(850,130,310,250,label('電圧',1005,190,{size:32,color:VC,anchor:'middle',weight:700})+label('1 C あたりの',1005,250,{size:26,color:C.ink,anchor:'middle'})+label('エネルギーの 差',1005,295,{size:26,color:UC,anchor:'middle',weight:700}),seg(p,.2,.35),VC);
  return s;
 },
 [K+'recover2']:(p)=>{
  let s=circuit({on:1,cur:1});
  s+=card(850,130,310,250,label('電圧',1005,190,{size:32,color:VC,anchor:'middle',weight:700})+label('＝',1005,250,{size:30,color:C.ink,anchor:'middle'})+label('電位差',1005,310,{size:36,color:VC,anchor:'middle',weight:700}),1,HI);
  s+=tag('正体',1005,420,{g:seg(p,.3,.45),size:28});
  return s;
 },
 // ================= S3 一様な電場で V＝Ed =================
 [K+'uni']:(p)=>{
  let s=uniField({g:seg(p,.4,.6),lab:false});
  s+=card(800,140,360,170,label('電位差 と 電場',980,205,{size:30,color:C.ink,anchor:'middle',weight:700})+label('どう つながる？',980,265,{size:30,color:HI,anchor:'middle',weight:700}),seg(p,.05,.2),HI);
  return s;
 },
 [K+'uni2']:(p)=>{
  let s=uniField();
  s+=card(840,140,320,190,label('どこでも',1000,200,{size:28,color:C.ink,anchor:'middle'})+label('同じ 向き・強さ',1000,250,{size:28,color:EC,anchor:'middle',weight:700})+TX(`${Et}`,1000,305,{size:40}),seg(p,.3,.45),EC);
  return s;
 },
 [K+'move']:(p)=>moveScene(p,{u:seg(p,.35,.85),pts:seg(p,.05,.2)}),
 [K+'work']:(p)=>{
  let s=moveScene(p,{u:seg(p,.45,.85),F:seg(p,.05,.2)});
  s+=card(840,140,330,210,label('電場の 仕事',1005,200,{size:28,color:UC,anchor:'middle',weight:700})+TX(`${Wt}=${qt}${Et}\\times d`,1005,270,{size:42})+fade(seg(p,.7,.85),TX(`=${qt}${Et}d`,1005,325,{size:38,color:UC})),seg(p,.4,.55),UC);
  return s;
 },
 [K+'drop']:(p)=>{
  const u=seg(p,.15,.6);
  let s=moveScene(p,{u});
  s+=ubar(900,440,mix(220,120,u),{text:'U'});
  s+=fade(seg(p,.5,.65),arrow(980,220,980,320,{color:UC,w:4,head:16})+label('qEd 減る',1000,280,{size:28,color:UC,weight:700}));
  return s;
 },
 [K+'eq1']:(p)=>{
  let s=TX(`${Ut}=${qt}${Vt}`,600,90,{size:44});
  s+=card(120,150,960,150,TX(`${qt}(${V2}-${V1})`,470,235,{size:56})+fade(seg(p,.5,.65),TX(`=-${qt}${Et}d`,750,235,{size:56})),seg(p,.1,.25),VC);
  s+=fade(seg(p,.25,.4),label('位置エネルギーの 変化',450,350,{size:26,color:UC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('電場の 仕事の 分 減る',760,350,{size:26,color:UC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'eq2']:(p)=>{
  let s=TX(`${qt}(${V2}-${V1})=-${qt}${Et}d`,600,100,{size:46});
  s+=fade(seg(p,.05,.2),label('両辺を q で 割る',600,175,{size:28,color:QC,anchor:'middle',weight:700}));
  s+=card(250,220,700,150,TX(`${V2}-${V1}=-${Et}d`,600,305,{size:60}),seg(p,.3,.45),VC);
  s+=fade(seg(p,.65,.8),label('q が 消える',600,430,{size:30,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'eq3']:(p)=>{
  let s=TX(`${V2}-${V1}=-${Et}d`,600,100,{size:52});
  s+=fade(seg(p,.05,.2),label('− ＝ 電場の 向きに 進むと 電位が 下がる',600,185,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fcard(380,240,440,170,`${Vt}=${Et}d`,{size:66,col:VC,g:seg(p,.5,.65)});
  s+=tag('結果',920,330,{g:seg(p,.7,.85),size:28});
  s+=fade(seg(p,.55,.7),label('大きさ だけ',600,460,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'letters']:(p)=>{
  let s=uniField({x:80,w:560,y:60,h:260});
  s+=ring(200,190,8,{color:HI,w:3})+ring(520,190,8,{color:HI,w:3})+dist(200,520,345,{src:'d',color:HI});
  s+=fade(seg(p,.55,.7),line(200,190,480,80,{color:C.a,w:3,dash:'8 6'})+label('✕ 斜め',470,70,{size:26,color:C.a,weight:700}));
  s+=card(760,90,400,320,TX(`${Vt}`,820,160,{size:40})+label('電位差の 大きさ',860,168,{size:26,color:C.ink})+TX(`${Et}`,820,250,{size:40})+label('電場の 強さ',860,258,{size:26,color:C.ink})+TX(`d`,820,340,{size:40,color:HI})+label('電場の 向きの 距離',860,348,{size:26,color:C.ink}),seg(p,.05,.2),VC);
  return s;
 },
 // ================= S4 単位・数値・符号 =================
 [K+'unitE']:(p)=>{
  let s=TX(`${Vt}=${Et}d`,330,150,{size:60});
  s+=arrow(470,140,620,140,{color:C.dim,w:4,head:16,g:seg(p,.1,.25)});
  s+=fade(seg(p,.2,.35),TX(`${Et}=\\dfrac{${Vt}}{d}`,800,150,{size:60}));
  s+=card(350,280,500,130,label('電場の 単位',600,330,{size:26,color:C.dim,anchor:'middle'})+TX(`\\mathrm{V/m}`,600,385,{size:50,color:EC}),seg(p,.55,.7),EC);
  return s;
 },
 [K+'unitE2']:(p)=>{
  let s=TX(`1\\,\\mathrm{V/m}`,160,200,{size:48,color:EC});
  s+=fade(seg(p,.05,.2),TX(`=\\dfrac{1\\,\\mathrm{J/C}}{1\\,\\mathrm{m}}`,380,200,{size:48}));
  s+=fade(seg(p,.35,.5),TX(`=\\dfrac{1\\,\\mathrm{N\\cdot m/C}}{1\\,\\mathrm{m}}`,700,200,{size:48}));
  s+=fade(seg(p,.65,.8),TX(`=1\\,\\mathrm{N/C}`,1020,200,{size:48,color:EC}));
  s+=fade(seg(p,.35,.5),label('J ＝ N·m',700,330,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.65,.8),label('m が 約分で 消える',1000,330,{size:28,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'unitE3']:(p)=>{
  let s=card(200,60,800,130,TX(`\\mathrm{V/m}=\\mathrm{N/C}`,600,140,{size:56,color:EC}),1,EC);
  s+=card(120,250,440,150,label('力の 地図',340,315,{size:32,color:FC,anchor:'middle',weight:700})+label('1 C あたりの 力',340,365,{size:26,color:C.ink,anchor:'middle'}),seg(p,.3,.45),FC);
  s+=card(640,250,440,150,label('電位の 坂の 傾き',860,315,{size:32,color:VC,anchor:'middle',weight:700})+label('1 m あたりの 電位差',860,365,{size:26,color:C.ink,anchor:'middle'}),seg(p,.55,.7),VC);
  return s;
 },
 [K+'n1']:(p)=>{
  let s=uniField();
  s+=fade(seg(p,.05,.2),TX(`${Et}=100${U('V/m')}`,960,200,{size:40}));
  s+=ring(250,170,8,{color:HI,w:3})+ring(570,170,8,{color:HI,w:3});
  s+=dist(250,570,400,{text:'0.20 m',color:HI,g:seg(p,.2,.35)});
  s+=fade(seg(p,.5,.65),label('電位は どれだけ 下がる？',960,320,{size:30,color:VC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'n2']:(p)=>{
  let s=uniField();
  s+=TX(`${Et}=100${U('V/m')}`,970,110,{size:36});
  s+=ring(250,170,8,{color:HI,w:3})+ring(570,170,8,{color:HI,w:3})+dist(250,570,400,{text:'0.20 m',color:HI});
  s+=card(760,170,420,200,TX(`${Vt}=${Et}d=100\\times0.20`,970,240,{size:36})+fade(seg(p,.35,.5),TX(`=20${U('V')}`,970,320,{size:48,color:VC})),seg(p,.05,.2),VC);
  s+=fade(seg(p,.55,.7),label('20 V 下がる',970,430,{size:30,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sign']:(p)=>signBase(p,{u:seg(p,.35,.8)}),
 [K+'sign2']:(p)=>signBase(p,{u:1})+card(80,340,1040,140,TX(`\\Delta ${Ut}=1.0\\times10^{-6}\\times(-20)=-2.0\\times10^{-5}${U('J')}`,600,400,{size:42})+fade(seg(p,.6,.75),label('減る',600,458,{size:26,color:UC,anchor:'middle',weight:700})),seg(p,.05,.2),UC),
 [K+'sign3']:(p)=>signBase(p,{u:1,neg:1})+card(80,340,1040,140,TX(`\\Delta ${Ut}=(-1.0\\times10^{-6})\\times(-20)=+2.0\\times10^{-5}${U('J')}`,600,400,{size:42})+fade(seg(p,.6,.75),label('増える',600,458,{size:26,color:UC,anchor:'middle',weight:700})),seg(p,.15,.3),UC),
 // ================= S5 坂と等電位線 =================
 [K+'slope']:(p)=>{
  let s=slopeTri(200,120,520,220,{g:seg(p,.05,.2)});
  s+=fade(seg(p,.25,.4),label('高さ ⇔ 電位',900,180,{size:32,color:VC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('急さ ⇔ 電場の 強さ',900,260,{size:32,color:EC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'slope2']:(p)=>{
  let s=slopeTri(170,120,200,200,{drop:'20 V',run:'0.20 m',g:1});
  s+=slopeTri(650,120,400,200,{drop:'20 V',run:'0.40 m',g:seg(p,.1,.25)});
  s+=fade(seg(p,.45,.6),label('100 V/m',290,110,{size:30,color:EC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.65,.8),label('50 V/m',870,160,{size:30,color:EC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.8,.9),rect(60,70,350,320,{fill:HI,fo:.05,stroke:HI,sw:3,rx:14})+label('急 ＝ 電場が 強い',250,450,{size:30,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'slope3']:(p)=>{
  let s=slopeTri(170,120,200,200,{drop:'20 V',run:'0.20 m'})+slopeTri(650,120,400,200,{drop:'20 V',run:'0.40 m'});
  s+=label('100 V/m',290,110,{size:30,color:EC,anchor:'middle',weight:700})+label('50 V/m',870,160,{size:30,color:EC,anchor:'middle',weight:700});
  s+=fade(seg(p,.1,.25),rect(150,70,260,320,{fill:HI,fo:.05,stroke:HI,sw:3,rx:14})+label('急 ＝ 電場が 強い',280,465,{size:30,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'equi']:(p)=>{
  let s=equiLines({E:0,g:seg(p,.05,.3)});
  s+=card(840,150,330,180,label('等電位線',1005,215,{size:34,color:VC,anchor:'middle',weight:700})+label('＝ 地図の 等高線',1005,275,{size:28,color:C.ink,anchor:'middle'}),seg(p,.4,.55),VC);
  return s;
 },
 [K+'equi2']:(p)=>{
  let s=equiLines({E:seg(p,.1,.35)});
  s+=fade(seg(p,.3,.45),rect(350-14,175-14,28,28,{fill:'none',fo:0,stroke:HI,sw:3,rx:0}));
  s+=card(840,130,330,220,label('直角に 交わる',1005,195,{size:30,color:HI,anchor:'middle',weight:700})+label('高い 電位 →',1005,255,{size:28,color:VC,anchor:'middle',weight:700})+label('低い 電位',1005,300,{size:28,color:VC,anchor:'middle',weight:700}),seg(p,.5,.65),EC);
  return s;
 },
 [K+'notmatch']:(p)=>{
  let s=equiLines({E:1});
  s+=chg(520,225,{sign:-1,r:20,g:seg(p,.1,.25)})+FA(498,225,380,225,{g:seg(p,.3,.5),w:9,head:22});
  s+=card(840,130,330,230,label('✕ たとえと 違う',1005,190,{size:28,color:C.a,anchor:'middle',weight:700})+label('負の 電荷は',1005,250,{size:28,color:NEG,anchor:'middle',weight:700})+label('電位の 高い 方へ',1005,300,{size:28,color:C.ink,anchor:'middle'}),seg(p,.45,.6),C.a);
  return s;
 },
 [K+'notmatch2']:(p)=>{
  let s=card(150,90,900,140,label('電位 ≠ 本当の 高さ',600,175,{size:40,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=card(150,290,900,140,TX(VDEF,350,370,{size:48})+label('1 C あたりの 位置エネルギー',720,375,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.4,.55),VC);
  return s;
 },
 [K+'mistake']:(p)=>mistakeBase(p,{lab:0}),
 [K+'mistake2']:(p)=>mistakeBase(p,{lab:1}),
 // ================= S6 回路に戻る =================
 [K+'ans']:(p)=>{
  let s=moveScene(p,{u:seg(p,.1,.5)});
  s+=card(820,140,350,190,label('位置エネルギー',995,200,{size:28,color:UC,anchor:'middle',weight:700})+TX(`${qt}${Et}d`,960,270,{size:46})+label('減る',1060,280,{size:30,color:UC,weight:700}),seg(p,.4,.55),UC);
  return s;
 },
 [K+'circ']:(p)=>{
  let s=circuit({on:1,cur:1,bhl:seg(p,.1,.25)});
  s+=card(850,140,310,220,label('電池',1005,195,{size:28,color:C.ink,anchor:'middle'})+TX(`1.5${U('V')}`,1005,260,{size:44,color:VC})+label('＋極 と −極 の 電位差',1005,320,{size:22,color:C.ink,anchor:'middle'}),seg(p,.3,.45),VC);
  return s;
 },
 [K+'circ2']:(p,ctx)=>{
  let s=circuit({on:1,cur:.35});
  const o=CIR,g=seg(p,.35,.55);
  for(let i=0;i<3;i++)s+=EA(o.ex+70-0,o.T-50-0*i,o.ex-70,o.T-50,{w:4,head:14,g});
  s+=fade(g,TX(vE,o.ex,o.T-80,{size:34}));
  s+=fade(seg(p,.05,.2),label('電位差',o.ex+110,o.T+70,{size:26,color:VC,weight:700}));
  s+=card(850,140,310,220,label('電球の 中に',1005,205,{size:28,color:C.ink,anchor:'middle'})+label('電場',1005,260,{size:36,color:EC,anchor:'middle',weight:700})+label('電子を 押す',1005,315,{size:28,color:C.ink,anchor:'middle'}),seg(p,.55,.7),EC);
  return s;
 },
 [K+'circ3']:(p,ctx)=>{
  const t=ctx&&ctx.scene&&ctx.scene.captions?ctx.t+(ctx.scene.captions[ctx.k]?.start||0):p*8;
  let s=circuit({on:1,cur:1,elec:seg(p,.05,.2),t,ev:60,n:26});
  const o=CIR;s+=EA(o.ex+70,o.T-50,o.ex-70,o.T-50,{w:4,head:14})+TX(vE,o.ex,o.T-80,{size:34});
  s+=card(850,140,310,230,label('電子（負）',1005,200,{size:28,color:NEG,anchor:'middle',weight:700})+label('𝐄 と 逆向き',1005,255,{size:28,color:C.ink,anchor:'middle'})+label('電位の 高い 側へ',1005,305,{size:26,color:VC,anchor:'middle',weight:700}),seg(p,.3,.45),NEG);
  return s;
 },
 [K+'univ']:(p)=>{
  let s=card(200,150,800,180,label('一様でない 電場での 電位',600,220,{size:32,color:C.ink,anchor:'middle',weight:700})+label('→ 大学編',600,285,{size:34,color:HI,anchor:'middle',weight:700}),seg(p,.05,.2),C.faint);
  return s;
 },
 [K+'next']:(p)=>plates(p,{bat:seg(p,.1,.3),E:seg(p,.45,.7)}),
 [K+'next2']:(p)=>plates(p,{bat:1,E:1,qs:seg(p,.1,.3)})+card(820,170,350,170,label('電荷を どれだけ',995,235,{size:28,color:C.ink,anchor:'middle'})+label('ためられる？',995,295,{size:34,color:HI,anchor:'middle',weight:700}),seg(p,.3,.45),HI),
 [K+'bye']:(p)=>fade(.35,plates(p,{bat:1,E:1,qs:1}))+card(300,170,600,140,label('次の 単元：コンデンサー',600,255,{size:40,color:HI,anchor:'middle',weight:700}),seg(p,.05,.2),HI),
};
function signBase(p,{u=1,neg=0}={}){
 let s=equiLines({E:1,y:50,h:220,rowsY:[90,230]});
 const x=mix(180+170,180+170*3,u);
 s+=chg(x,160,{sign:neg?-1:1,r:20})+label(neg?'−1.0 μC':'1.0 μC',x,124,{size:26,color:neg?NEG:QC,anchor:'middle',weight:700});
 s+=fade(u>0?1:0,arrow(350,198,350+340*u,198,{color:C.dim,w:3,head:14}));
 s+=label('30 V → 10 V（20 V 低い）',980,170,{size:26,color:VC,anchor:'middle',weight:700});
 return s;
}
function mistakeBase(p,{lab=0}={}){
 const A=axes({x:150,y:430,w:640,h:320,xmax:1,ymax:45,yticks:[20,40],xlabel:'位置',ylabel:'電位 [V]',ycolor:VC});
 let s=A.svg+A.plot(u=>u<.45?40:u<.7?40-40*(u-.45)/.25:0,{from:0,to:1,color:VC,w:5,p:seg(p,.05,.4)});
 s+=card(840,90,330,110,label('電場が 強い ほど',1005,135,{size:26,color:C.ink,anchor:'middle'})+label('電位が 高い？ ✕',1005,180,{size:28,color:C.a,anchor:'middle',weight:700}),seg(p,.3,.45),C.a);
 s+=fade(lab,label('高いが 平ら → 電場 0',A.X(.22),A.Y(40)-20,{size:26,color:HI,anchor:'middle',weight:700}));
 s+=fade(lab,label('急 → 電場が 強い',A.X(.58)+20,A.Y(20),{size:26,color:EC,weight:700}));
 s+=fade(lab*seg(p,.4,.55),card(840,260,330,110,label('電場 ＝ 坂の 傾き',1005,325,{size:28,color:EC,anchor:'middle',weight:700}),1,EC));
 return s;
}
function plates(p,{bat=1,E=1,qs=0}={}){
 const xl=250,xr=590,y1=90,y2=390;
 let s=rect(xl-14,y1,14,y2-y1,{fill:C.dim,fo:.6,stroke:C.ink,sw:2,rx:2})+rect(xr,y1,14,y2-y1,{fill:C.dim,fo:.6,stroke:C.ink,sw:2,rx:2});
 s+=fade(bat,line(xl-7,y2,xl-7,460,{color:C.dim,w:3})+line(xr+7,y2,xr+7,460,{color:C.dim,w:3})+line(xl-7,460,390,460,{color:C.dim,w:3})+line(450,460,xr+7,460,{color:C.dim,w:3})
  +line(410,430,410,490,{color:C.ink,w:5})+line(430,445,430,475,{color:C.ink,w:10})+label('＋',395,435,{size:22,color:POS,anchor:'middle',weight:700})+label('−',448,435,{size:24,color:NEG,anchor:'middle',weight:700}));
 for(let i=0;i<4;i++){const y=y1+40+i*72;s+=EA(xl+20,y,xr-20,y,{w:4,head:16,g:E});}
 s+=fade(qs,Array.from({length:5},(_,i)=>label('＋',xl-40,y1+40+i*65,{size:26,color:POS,anchor:'middle',weight:700})+label('−',xr+44,y1+40+i*65,{size:28,color:NEG,anchor:'middle',weight:700})).join(''));
 return s;
}

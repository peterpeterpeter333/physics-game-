// 高校編「電流とオームの法則・深く学ぶ 2/4」(ys-hs-e-current-2) — 図。Stage 1200×515.
// 色：電圧 V 紫、エネルギー（仕事）W 橙、電荷 Q 桃、電流 I 緑、電子 青、電場 水色、高さ（力学）水色の坂。
// 量の V は斜体（TeX の V）、単位のボルトは立体（\mathrm{V}）。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,poly,axes,brace,clamp,mix} from './anim.mjs';
import {card,tag,T2,sceneT,IC,VC,QC,TC,WC,NEG,POS,EC,CU,It,Qt,Vt,Wt,dQ,dT,U,qtok,electron,edot,tube,section,stream,battery,bulb,resistor,loopPath,along,pathLen,circuit,CIR,fcard,IDEF} from './yt1-hs-e-current-1-diagrams.mjs';

const K='hs-e-current-2:';
const hiV=C.v;
// ---- two levels (high / low) of "electric height" -----------------------------------------------
function levels({g=1,x1=160,x2=640,yh=150,yl=380,text=true}={}){
 let s=line(x1,yh,x2,yh,{color:VC,w:4,dash:'10 8'})+line(x1,yl,x2,yl,{color:VC,w:4,dash:'10 8'});
 if(text)s+=label('高い',x1-16,yh+9,{size:26,color:VC,anchor:'end',weight:700})+label('低い',x1-16,yl+9,{size:26,color:VC,anchor:'end',weight:700});
 return fade(g,s);
}
const vbar=(x,y1,y2,text,g=1)=>fade(g,arrow(x,y2,x,y1,{color:VC,w:4,head:14})+arrow(x,y1,x,y2,{color:VC,w:4,head:14})+label(text,x+18,(y1+y2)/2+9,{size:28,color:VC,weight:700}));
// ---- slope (mechanics) ---------------------------------------------------------------------------
function slope({g=1,u=0,x0=120,y0=420,w=420,h=240,text=true,unitmass='1 kg'}={}){
 let s=poly([[x0,y0],[x0+w,y0],[x0,y0-h]],{fill:'#6adfff',fo:.12,stroke:C.dim,sw:2.5});
 const bx=mix(x0+30,x0+w-60,u),by=mix(y0-h+30*h/w,y0,u)-0;
 const ang=Math.atan2(h,w)*180/Math.PI;
 s+=`<g transform="rotate(${ang.toFixed(2)} ${bx} ${by})">${rect(bx-30,by-50,60,46,{fill:'#c9a46a',fo:.7,stroke:'#e6c690',sw:2,rx:6})}</g>`;
 if(text)s+=label(unitmass,bx,by-62,{size:24,color:C.ink,anchor:'middle',weight:700});
 s+=line(x0-30,y0-h,x0-30,y0,{color:EC,w:3})+line(x0-40,y0-h,x0-20,y0-h,{color:EC,w:3})+line(x0-40,y0,x0-20,y0,{color:EC,w:3})+tex('h',x0-55,y0-h/2+10,{size:36,color:EC,auto:false});
 return fade(g,s);
}
// ---- simple icons --------------------------------------------------------------------------------
function cell(x,y,{g=1,text='1.5 V'}={}){ // a dry cell, ＋ cap on top
 let s=rect(x-40,y-100,80,200,{fill:'#3b4a66',fo:.9,stroke:C.dim,sw:2,rx:10})+rect(x-14,y-118,28,18,{fill:'#9aabc7',fo:.9,stroke:C.dim,sw:2,rx:3});
 s+=label('＋',x,y-60,{size:28,color:POS,anchor:'middle',weight:700})+label('−',x,y+80,{size:30,color:NEG,anchor:'middle',weight:700});
 s+=label(text,x,y+150,{size:32,color:VC,anchor:'middle',weight:700});
 return fade(g,s);
}
function outlet(x,y,{g=1,text='100 V'}={}){
 let s=rect(x-70,y-90,140,180,{fill:'#e8edf5',fo:.12,stroke:C.dim,sw:2.5,rx:16});
 s+=rect(x-30,y-40,12,44,{fill:C.ink,fo:.8,stroke:'none',rx:3})+rect(x+18,y-40,12,44,{fill:C.ink,fo:.8,stroke:'none',rx:3});
 s+=label(text,x,y+150,{size:32,color:VC,anchor:'middle',weight:700});
 return fade(g,s);
}
// ---- height-around-the-loop graph ----------------------------------------------------------------
const CIR2={L:90,R:450,T:130,B:400,bx:270,ex:270};
const P2=loopPath(CIR2.L,CIR2.R,CIR2.T,CIR2.B,CIR2.bx),LP2=pathLen(P2);
// fraction of the loop path at which the bulb starts / ends (top wire, x = ex±34)
const fAt=(x,y)=>{let L=0;for(let i=1;i<P2.length;i++){const [a,b]=[P2[i-1],P2[i]],d=Math.hypot(b[0]-a[0],b[1]-a[1]);
 if(Math.abs(a[1]-b[1])<1&&Math.abs(a[1]-y)<1&&(x-a[0])*(x-b[0])<=0)return (L+Math.abs(x-a[0]))/LP2;L+=d;}return 0;};
const FB1=fAt(CIR2.ex+34,CIR2.T),FB2=fAt(CIR2.ex-34,CIR2.T);
// s in [0,1.15]: [0,.15] inside the battery (− → ＋), then loop fraction f=(s-.15)
const SB=.15;
const hAt=s=>s<=SB?1.5*s/SB:(()=>{const f=s-SB;return f<FB1?1.5:f<FB2?1.5*(1-(f-FB1)/(FB2-FB1)):0;})();
function posAt(s){
 if(s<=SB)return [mix(CIR2.bx-11,CIR2.bx+11,s/SB),CIR2.B];
 return along(P2,Math.min(.9999,s-SB));
}
const GA=()=>axes({x:560,y:420,w:560,h:270,xmin:0,xmax:1.15,ymin:0,ymax:2,yticks:[1.5],grid:true,xlabel:'',ylabel:'電気の 高さ [V]',ycolor:VC});
function hGraph(upto,{g=1,dotAt=null,marks=1}={}){
 const A=GA();let s=A.svg;
 s+=A.plot(hAt,{from:0,to:Math.max(.001,upto),color:VC,w:5,steps:300});
 if(marks){
  const m=(a,b,t,col)=>fade(marks,line(A.X(a),A.Y(0)+14,A.X(a),A.Y(0)+26,{color:C.dim,w:2})+label(t,(A.X(a)+A.X(b))/2,A.Y(0)+44,{size:22,color:col,anchor:'middle',weight:700}));
  s+=m(0,SB,'電池',C.ink)+m(SB+FB1,SB+FB2,'電球',C.hi)+label('導線',(A.X(SB)+A.X(SB+FB1))/2,A.Y(0)+44,{size:22,color:C.dim,anchor:'middle'})+label('導線',(A.X(SB+FB2)+A.X(1.15))/2,A.Y(0)+44,{size:22,color:C.dim,anchor:'middle'});
 }
 if(dotAt!==null)s+=dot(A.X(dotAt),A.Y(hAt(dotAt)),9,QC);
 return fade(g,s);
}
function smallCircuit({tokenAt=null,on=1,g=1,hlB=0,hlL=0}={}){
 let s=circuit({o:CIR2,on,g});
 if(tokenAt!==null){const [x,y]=posAt(tokenAt);s+=qtok(x,y);}
 if(hlB)s+=fade(hlB,ring(CIR2.bx,CIR2.B,48,{color:C.hi,w:3}));
 if(hlL)s+=fade(hlL,ring(CIR2.ex,CIR2.T,52,{color:C.hi,w:3}));
 return s;
}
// field arrows inside a tube
function fieldArrows(y,{x1=150,x2=1050,n=5,g=1,dy=0}={}){let s='';for(let i=0;i<n;i++){const x=x1+(x2-x1)*i/n;s+=arrow(x,y+dy,x+(x2-x1)/n*.7,y+dy,{color:EC,w:4,head:14});}return fade(g,s);}

export const hsECurrent2Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=circuit({on:1,elec:1,t,ev:60,n:26});
  s+=card(850,150,310,140,label('押しているのは',1005,210,{size:28,color:C.hi,anchor:'middle',weight:700})+label('何？',1005,260,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'q2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=circuit({on:1,elec:1,t,ev:60,n:26,bhl:seg(p,.1,.25)});
  s+=card(850,150,310,140,label('押しているのは',1005,210,{size:28,color:C.hi,anchor:'middle',weight:700})+label('何？',1005,260,{size:32,color:C.hi,anchor:'middle',weight:700}),1,C.hi);
  s+=card(850,320,310,110,label('電池は 何を 渡す？',1005,385,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'recap']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=tube(70,1130,180)+section(600,180)+stream(t,{kind:'e',x1:70,x2:1130,gx:600,y:180,r:1.5,speed:60,dir:-1});
  s+=fade(seg(p,.05,.2),label('自由電子',200,110,{size:28,color:NEG,anchor:'middle',weight:700}));
  s+=fcard(380,300,440,170,IDEF,{size:54,col:IC,g:seg(p,.4,.55)});
  return s;
 },
 [K+'hint']:(p,ctx)=>{
  const t=sceneT(p,ctx),o=CIR;
  let s=circuit({on:1,cur:1,elec:1,t,ev:60,n:26,eop:.6});
  for(let i=0;i<6;i++){const a=-Math.PI*(i+.5)/6;s+=fade(seg(p,.4,.55),line(o.ex+56*Math.cos(a),o.T+56*Math.sin(a),o.ex+96*Math.cos(a),o.T+96*Math.sin(a),{color:WC,w:4}));}
  s+=card(850,150,310,200,label('電球で 移るのは',1005,220,{size:28,color:C.ink,anchor:'middle'})+label('エネルギー',1005,290,{size:36,color:WC,anchor:'middle',weight:700}),seg(p,.45,.6),WC);
  return s;
 },
 // ================= S2 電気の高さの差 =================
 [K+'water']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=rect(140,80,240,150,{fill:'#4a90d9',fo:.35,stroke:'#9fd0ff',sw:3,rx:6})+rect(760,300,300,150,{fill:'#4a90d9',fo:.35,stroke:'#9fd0ff',sw:3,rx:6});
  s+=draw([[380,200],[560,200],[560,360],[760,360]],1,{color:'#9fd0ff',w:18})+draw([[380,200],[560,200],[560,360],[760,360]],1,{color:'#4a90d9',w:12});
  for(let i=0;i<6;i++){const f=((t*.25+i/6)%1);const [x,y]=along([[380,200],[560,200],[560,360],[760,360]],f);s+=dot(x,y,5,'#d8f1ff');}
  s+=vbar(1110,80,300,'',seg(p,.4,.55))+fade(seg(p,.45,.6),label('高さの 差',1100,200,{size:28,color:C.hi,anchor:'end',weight:700}));
  s+=fade(seg(p,.05,.2),label('高い',260,60,{size:26,color:C.ink,anchor:'middle',weight:700})+label('低い',910,490,{size:26,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'elec']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=levels({x1:240,x2:700})+dot(700,150,10,C.ink)+dot(700,380,10,C.ink)+label('点 A',720,158,{size:26,color:C.ink,weight:700})+label('点 B',720,388,{size:26,color:C.ink,weight:700});
  s+=line(700,150,940,150,{color:C.dim,w:4})+line(940,150,940,190,{color:C.dim,w:4})+line(700,380,940,380,{color:C.dim,w:4})+line(940,320,940,380,{color:C.dim,w:4});
  s+=(`<g>${draw([[940,190],[922,205],[958,225],[922,245],[958,265],[922,285],[958,305],[940,320]],1,{color:C.ink,w:4})}</g>`);
  s+=arrow(980,190,980,330,{color:IC,w:6,head:18,g:seg(p,.55,.75)})+fade(seg(p,.6,.75),label('電流',1000,270,{size:28,color:IC,weight:700}));
  s+=vbar(500,150,380,'差',seg(p,.2,.35));
  return s;
 },
 [K+'name']:(p)=>{
  let s=levels({x1:240,x2:700})+dot(700,150,10,C.ink)+dot(700,380,10,C.ink)+label('点 A',720,158,{size:26,color:C.ink,weight:700})+label('点 B',720,388,{size:26,color:C.ink,weight:700});
  s+=vbar(500,150,380,'',1);
  s+=card(820,170,320,190,label('電圧',980,235,{size:34,color:VC,anchor:'middle',weight:700})+T2(Vt,980,315,{size:64}),seg(p,.1,.25),VC);
  return s;
 },
 [K+'unit']:(p)=>{
  let s=cell(330,240,{g:seg(p,.3,.45)})+outlet(850,240,{g:seg(p,.55,.7)});
  s+=fade(seg(p,.3,.45),label('乾電池 1個',330,90,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('家庭の コンセント',850,90,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=card(480,180,220,120,label('単位',590,230,{size:24,color:C.dim,anchor:'middle'})+label('ボルト V',590,275,{size:28,color:VC,anchor:'middle',weight:700}),seg(p,.05,.2),VC);
  return s;
 },
 [K+'twoV']:(p)=>{
  let s=card(330,130,540,160,T2(`${Vt}=1.5\\ \\mathrm{V}`,600,225,{size:70,auto:false}),1,VC);
  s+=fade(seg(p,.15,.3),arrow(470,340,470,280,{color:VC,w:4,head:14})+label('量（電圧）',470,380,{size:30,color:VC,anchor:'middle',weight:700})+label('斜めの V',470,425,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),arrow(760,340,760,280,{color:C.ink,w:4,head:14})+label('単位（ボルト）',760,380,{size:30,color:C.ink,anchor:'middle',weight:700})+label('まっすぐな V',760,425,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'between']:(p)=>{
  let s=line(330,260,577,260,{color:C.dim,w:5})+line(623,260,870,260,{color:C.dim,w:5});
  s+=line(620,170,620,350,{color:C.ink,w:8})+line(580,215,580,305,{color:C.ink,w:18});
  s+=label('＋極',660,160,{size:30,color:POS,weight:700})+label('−極',540,160,{size:30,color:NEG,anchor:'end',weight:700});
  s+=fade(seg(p,.4,.55),line(500,400,700,400,{color:VC,w:4})+line(500,385,500,415,{color:VC,w:4})+line(700,385,700,415,{color:VC,w:4})+label('この 2点の 間',600,450,{size:28,color:VC,anchor:'middle',weight:700}));
  s+=card(80,120,330,110,label('どこと どこの 間？',245,188,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'meter']:(p)=>{
  const o=CIR;let s=circuit({on:1});
  const mx=o.ex,my=o.T+160;
  s+=fade(seg(p,.1,.3),draw([[o.ex-40,o.T],[o.ex-40,o.T+40],[mx-60,my],[mx-36,my]],1,{color:VC,w:3})+draw([[o.ex+40,o.T],[o.ex+40,o.T+40],[mx+60,my],[mx+36,my]],1,{color:VC,w:3})
   +ring(mx,my,36,{color:VC,w:3,fill:'#1b1838'})+label('V',mx,my+11,{size:32,color:VC,anchor:'middle',weight:700})+dot(o.ex-40,o.T,7,VC)+dot(o.ex+40,o.T,7,VC));
  s+=card(850,150,310,170,label('電圧計は',1005,215,{size:28,color:C.ink,anchor:'middle'})+label('2点に 当てる',1005,275,{size:32,color:VC,anchor:'middle',weight:700}),seg(p,.3,.45),VC);
  return s;
 },
 // ================= S3 1クーロンあたりのエネルギー =================
 [K+'slope']:(p)=>{
  let s=slope({u:0});
  s+=card(680,120,440,200,label('電気の 高さ ＝',900,190,{size:32,color:VC,anchor:'middle',weight:700})+label('何の 量？',900,255,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'gh']:(p)=>{
  let s=slope({u:seg(p,.15,.6)});
  s+=card(680,120,440,220,label('重力の 仕事（1 kg あたり）',900,180,{size:28,color:WC,anchor:'middle',weight:700})+T2(`gh`,900,265,{size:56,auto:false,color:WC}),seg(p,.5,.65),WC);
  return s;
 },
 [K+'gh2']:(p)=>{
  let s=slope({u:1});
  s+=card(680,90,440,300,label('高さの 差',900,160,{size:32,color:EC,anchor:'middle',weight:700})+arrow(900,185,900,235,{color:C.hi,w:4,head:14})+label('1 kg あたりの',900,285,{size:30,color:C.ink,anchor:'middle',weight:700})+label('エネルギーの 差',900,335,{size:32,color:WC,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'map']:(p)=>{
  const row=(y,a,b,col,g)=>fade(g,label(a,360,y,{size:30,color:C.ink,anchor:'middle',weight:700})+label('⇔',600,y,{size:30,color:C.dim,anchor:'middle'})+label(b,840,y,{size:30,color:col,anchor:'middle',weight:700}));
  let s=card(150,50,900,400,'',1,C.faint);
  s+=label('坂（力学）',360,115,{size:28,color:C.dim,anchor:'middle'})+label('回路（電気）',840,115,{size:28,color:C.dim,anchor:'middle'});
  s+=row(210,'高さの 差','電圧',VC,seg(p,.1,.25));
  s+=row(300,'1 kg あたり','1 C あたり',QC,seg(p,.3,.45));
  s+=row(390,'の エネルギー','の エネルギー',WC,seg(p,.5,.65));
  return s;
 },
 [K+'def']:(p)=>{
  let s=levels({x1:220,x2:600});
  const u=seg(p,.15,.6),y=mix(150,380,u);
  s+=qtok(420,y)+fade(seg(p,.05,.15),label('1 C',450,y-16,{size:26,color:QC,weight:700}));
  s+=arrow(520,170,520,360,{color:WC,w:6,head:18,g:seg(p,.3,.6)})+fade(seg(p,.45,.6),label('電気の 力の 仕事',540,270,{size:26,color:WC,weight:700}));
  s+=card(780,140,370,210,label('この 仕事',965,200,{size:28,color:WC,anchor:'middle',weight:700})+label('＝ 2点の 間の 電圧',965,260,{size:28,color:C.ink,anchor:'middle',weight:700})+T2(Vt,965,325,{size:50}),seg(p,.7,.85),VC);
  return s;
 },
 [K+'def2']:(p)=>{
  let s=card(200,50,800,170,label('電圧',300,150,{size:34,color:VC,anchor:'middle',weight:700})+T2(Vt,380,145,{size:50})+label('＝ 1 C あたりの 電気の 力の 仕事',680,150,{size:30,color:C.ink,anchor:'middle',weight:700}),1,VC);
  s+=tag('定義',600,265,{color:C.hi,g:seg(p,.05,.2),size:28});
  s+=fcard(300,320,600,140,`1\\ \\mathrm{V}=1\\ \\mathrm{J/C}`,{size:56,col:VC,g:seg(p,.45,.6)});
  return s;
 },
 [K+'wqv']:(p)=>{
  let s='';const n=4;
  for(let i=0;i<n;i++){const g=seg(p,.05+i*.08,.15+i*.08);s+=fade(g,qtok(200+i*110,130)+rect(170+i*110,170,60,60,{fill:WC,fo:.5,stroke:WC,sw:2,rx:6})+T2(Vt,200+i*110,212,{size:30}));}
  s+=fade(seg(p,.3,.45),label('1 C ごとに 仕事 V → Q 倍',370,290,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fcard(650,100,480,190,`${Wt}=${Qt}${Vt}`,{size:70,col:WC,g:seg(p,.6,.75)});
  s+=fade(seg(p,.65,.8),label('仕事（エネルギー）',890,340,{size:28,color:WC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'vwq']:(p)=>{
  let s=fade(.55,T2(`${Wt}=${Qt}${Vt}`,600,90,{size:44}));
  s+=fade(seg(p,.05,.2),label(`両辺を Q で 割る`,600,170,{size:28,color:C.hi,anchor:'middle',weight:700})+arrow(600,185,600,230,{color:C.hi,w:4,head:14}));
  s+=fcard(350,250,500,170,`${Vt}=\\dfrac{${Wt}}{${Qt}}`,{size:64,col:VC,g:seg(p,.25,.4)});
  s+=fade(seg(p,.6,.75),label('1 C あたりの エネルギー',600,470,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ex']:(p)=>{
  let s=cell(220,230,{});
  const u=seg(p,.15,.55);s+=qtok(mix(380,620,u),230)+label('1 C',mix(380,620,u),200,{size:24,color:QC,anchor:'middle',weight:700});
  s+=fade(seg(p,.45,.6),rect(680,190,140,80,{fill:WC,fo:.5,stroke:WC,sw:2,rx:8})+label('1.5 J',750,240,{size:32,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('通る たびに 1.5 J',900,360,{size:30,color:WC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ex2']:(p)=>{
  let s=fcard(250,40,700,150,`${Vt}=\\dfrac{${Wt}}{${Qt}}`,{size:50,col:VC});
  s+=card(150,230,900,170,T2(`${Wt}=${Qt}${Vt}=2.0\\ \\mathrm{C}\\times1.5\\ \\mathrm{V}`,520,325,{size:46,auto:false})+fade(seg(p,.5,.65),T2(`=3.0\\ \\mathrm{J}`,900,322,{size:46,auto:false,color:WC})),seg(p,.05,.2),WC);
  s+=fade(seg(p,.5,.65),label('V × C ＝ (J/C) × C ＝ J',600,460,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'check']:(p)=>{
  let s=outlet(330,230,{});
  s+=card(600,150,500,170,label('1 C あたり',850,215,{size:30,color:C.ink,anchor:'middle',weight:700})+label('？ J',850,285,{size:44,color:WC,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'check2']:(p)=>{
  const base=440,k=3.0;
  let s=rect(300,base-100*k*seg(p,.05,.4),160,100*k*seg(p,.05,.4),{fill:WC,fo:.55,stroke:WC,sw:2,rx:6})+label('100 V：100 J',380,base+40,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=rect(700,base-1.5*k,160,1.5*k,{fill:WC,fo:.9,stroke:WC,sw:2,rx:2})+label('1.5 V：1.5 J',780,base+40,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.2),label('1 C あたりの エネルギー',600,60,{size:28,color:C.dim,anchor:'middle'}));
  s+=card(620,180,340,110,label('約 67 倍',790,250,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'nomatch']:(p)=>{
  let s=slope({u:.3,w:360,h:200,x0:100,y0:400,unitmass:''});
  s+=fade(seg(p,.05,.2),label('物は 下るだけ',280,460,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=levels({x1:700,x2:1100,g:seg(p,.4,.55)});
  s+=fade(seg(p,.5,.65),qtok(800,265)+label('正の 電荷',800,240,{size:24,color:POS,anchor:'middle',weight:700})+electron(1000,265)+label('負の 電荷',1000,240,{size:24,color:NEG,anchor:'middle',weight:700}));
  return s;
 },
 [K+'neg']:(p)=>{
  let s=levels({x1:240,x2:900});
  const u=seg(p,.1,.6);
  s+=electron(450,mix(380,150,u),{r:16});
  s+=arrow(500,360,500,170,{color:NEG,w:5,head:16,g:seg(p,.1,.3)})+fade(seg(p,.2,.35),label('電子：低い → 高い',520,270,{size:28,color:NEG,weight:700}));
  s+=arrow(800,170,800,360,{color:IC,w:6,head:18,g:seg(p,.6,.75)})+fade(seg(p,.65,.8),label('電流',820,270,{size:28,color:IC,weight:700}));
  return s;
 },
 // ================= S4 電池はポンプ =================
 [K+'pump']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=circuit({on:1,elec:1,t,ev:60,n:26,eop:.6,bhl:seg(p,.1,.25)});
  s+=card(850,140,310,230,label('電池 ＝ ポンプ',1005,200,{size:30,color:C.hi,anchor:'middle',weight:700})+label('電荷を',1005,260,{size:28,color:C.ink,anchor:'middle'})+label('「高い所」へ',1005,305,{size:28,color:VC,anchor:'middle',weight:700})+label('持ち上げる',1005,350,{size:28,color:C.ink,anchor:'middle'}),seg(p,.2,.35),C.hi);
  return s;
 },
 [K+'graph']:(p)=>{
  let s=smallCircuit({tokenAt:0})+hGraph(0,{dotAt:0,g:seg(p,.1,.3)});
  s+=fade(seg(p,.45,.6),label('−極 ＝ 0',CIR2.bx-40,CIR2.B+80,{size:24,color:NEG,anchor:'end',weight:700}));
  return s;
 },
 [K+'up']:(p)=>{
  const s0=SB*seg(p,.15,.7);
  let s=smallCircuit({tokenAt:s0,hlB:seg(p,.05,.15)})+hGraph(s0,{dotAt:s0});
  s+=fade(seg(p,.65,.8),label('＋1.5 V',830,200,{size:30,color:VC,weight:700}));
  return s;
 },
 [K+'flat']:(p)=>{
  const s0=mix(SB,SB+FB1,seg(p,.1,.7));
  let s=smallCircuit({tokenAt:s0})+hGraph(s0,{dotAt:s0})+label('＋1.5 V',830,200,{size:30,color:VC,weight:700});
  s+=fade(seg(p,.5,.65),label('導線：ほぼ 変わらない',840,340,{size:26,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'down']:(p)=>{
  const s0=mix(SB+FB1,1.149,seg(p,.1,.75));
  let s=smallCircuit({tokenAt:s0,hlL:seg(p,.05,.15)})+hGraph(s0,{dotAt:s0})+label('＋1.5 V',830,200,{size:30,color:VC,weight:700});
  s+=fade(seg(p,.45,.6),label('−1.5 V',1000,260,{size:30,color:VC,weight:700}));
  return s;
 },
 [K+'balance']:(p)=>{
  let s=smallCircuit({tokenAt:null})+hGraph(1.15,{marks:1})+label('＋1.5 V',830,200,{size:30,color:VC,weight:700})+label('−1.5 V',1000,260,{size:30,color:VC,weight:700});
  s+=fade(seg(p,.1,.25),label('電池で 受け取る 1.5 J',CIR2.bx,CIR2.B-85,{size:26,color:WC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),label('光と 熱に 1.5 J',CIR2.ex,CIR2.T-70,{size:26,color:WC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),label('（1 C あたり）',1000,130,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'notmade']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=circuit({on:1,elec:1,t,ev:60,n:26,bhl:seg(p,.1,.25)});
  s+=card(850,110,310,280,label('✕ 電荷を 作る',1005,175,{size:28,color:C.a,anchor:'middle',weight:700})+fade(seg(p,.45,.6),label('○ 回ってきた',1005,260,{size:28,color:C.F,anchor:'middle',weight:700})+label('電荷に',1005,300,{size:28,color:C.ink,anchor:'middle'})+label('エネルギーを 渡す',1005,345,{size:28,color:WC,anchor:'middle',weight:700})),seg(p,.05,.2),C.faint);
  return s;
 },
 [K+'notflow']:(p)=>{
  let s=card(100,90,470,300,label('流れる もの',335,160,{size:30,color:C.ink,anchor:'middle',weight:700})+label('電荷',335,240,{size:40,color:QC,anchor:'middle',weight:700})+label('（その流れが 電流）',335,310,{size:26,color:IC,anchor:'middle'}),seg(p,.05,.2),QC);
  s+=card(630,90,470,300,label('流れない',865,160,{size:30,color:C.ink,anchor:'middle',weight:700})+label('電圧',865,240,{size:40,color:VC,anchor:'middle',weight:700})+label('1 C あたりの',865,300,{size:26,color:C.ink,anchor:'middle'})+label('エネルギーの 差',865,345,{size:26,color:WC,anchor:'middle',weight:700}),seg(p,.45,.6),VC);
  return s;
 },
 // ================= S5 何が押しているか =================
 [K+'push']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=tube(70,1130,220,{fill:CU})+stream(t,{kind:'e',x1:70,x2:1130,gx:600,y:220,r:1.5,speed:60,dir:-1});
  s+=card(350,340,500,120,label('直接 押すのは？',600,415,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.35),C.hi);
  return s;
 },
 [K+'field']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=tube(70,1130,220,{fill:CU})+stream(t,{kind:'e',x1:70,x2:1130,gx:600,y:220,r:1.5,speed:60,dir:-1,g:.6});
  s+=fieldArrows(220,{g:seg(p,.25,.45),dy:0});
  s+=card(300,330,600,140,label('電荷を 押す 電気の 力の 場',600,385,{size:30,color:EC,anchor:'middle',weight:700})+label('＝ 電場',600,440,{size:34,color:EC,anchor:'middle',weight:700}),seg(p,.45,.6),EC);
  s+=fade(seg(p,.6,.75),label('電場の 向きに 正の 電荷が 押される',600,90,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'later']:(p)=>{
  let s=card(150,60,900,160,label('電場の 正体',600,120,{size:30,color:EC,anchor:'middle',weight:700})+label('→ 単元「電場とクーロンの法則」で',600,180,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),EC);
  s+=card(150,270,900,170,label('ここでは',600,325,{size:28,color:C.dim,anchor:'middle'})+label('電圧 ＝ 1 C あたりの エネルギーの 差',600,395,{size:34,color:VC,anchor:'middle',weight:700}),seg(p,.5,.65),VC);
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=tube(70,1130,200,{fill:CU})+stream(t,{kind:'e',x1:70,x2:1130,gx:600,y:200,r:1.5,speed:60,dir:-1})+fieldArrows(200,{g:1});
  s+=card(200,320,800,140,label('押しているのは、電圧によって',600,378,{size:30,color:C.ink,anchor:'middle',weight:700})+label('導線の 中に できる 電気の 力',600,430,{size:32,color:EC,anchor:'middle',weight:700}),seg(p,.3,.45),EC);
  return s;
 },
 [K+'ans2']:(p)=>{
  let s=card(200,60,800,150,label('電池が 渡すのは エネルギー',600,150,{size:34,color:WC,anchor:'middle',weight:700}),seg(p,.05,.2),WC);
  s+=card(200,250,800,200,label('電圧 1 V ＝ 1 C あたり 1 J の 差',600,320,{size:32,color:VC,anchor:'middle',weight:700})+T2(`1\\ \\mathrm{V}=1\\ \\mathrm{J/C}`,600,400,{size:50,auto:false}),seg(p,.45,.6),VC);
  return s;
 },
 [K+'next']:(p)=>{
  let s=circuit({elem:'res',cur:1});
  s+=card(850,130,310,250,label('電圧を',1005,195,{size:30,color:C.ink,anchor:'middle'})+label('2 倍',1005,250,{size:40,color:VC,anchor:'middle',weight:700})+label('→ 電流は？',1005,320,{size:34,color:IC,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'bye']:(p)=>{
  let s=fade(.35,circuit({elem:'res',cur:1}));
  s+=card(300,170,600,140,label('深く学ぶ 3/4 へ',600,255,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
};
Object.assign(hsECurrent2Diagrams,{
 [K+'onepoint']:(p)=>{
  let s=line(330,260,577,260,{color:C.dim,w:5})+line(623,260,870,260,{color:C.dim,w:5})+line(620,170,620,350,{color:C.ink,w:8})+line(580,215,580,305,{color:C.ink,w:18});
  s+=label('＋極',660,160,{size:30,color:POS,weight:700})+label('−極',540,160,{size:30,color:NEG,anchor:'end',weight:700});
  s+=dot(800,260,10,C.hi)+fade(seg(p,.05,.2),label('「この点の 電圧」？',800,350,{size:30,color:C.a,anchor:'middle',weight:700})+label('✕',800,215,{size:40,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('電圧は 2点の 差',600,450,{size:30,color:VC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'oneV']:(p)=>{
  let s=fcard(300,50,600,150,`1\\ \\mathrm{V}=1\\ \\mathrm{J/C}`,{size:60,col:VC});
  s+=levels({x1:300,x2:700,yh:250,yl:440,g:seg(p,.05,.2)});
  const y=mix(250,440,seg(p,.2,.6));s+=qtok(480,y)+label('1 C',512,y-16,{size:26,color:QC,weight:700});
  s+=fade(seg(p,.55,.7),rect(800,300,160,80,{fill:WC,fo:.5,stroke:WC,sw:2,rx:8})+label('1 J',880,350,{size:34,color:C.ink,anchor:'middle',weight:700}));
  s+=vbar(620,250,440,'1 V',seg(p,.1,.25));
  return s;
 },
 [K+'ex3']:(p)=>{
  let s=cell(220,220,{text:'9.0 V'});
  s+=card(420,120,700,200,label('0.50 C を 送り出す',770,190,{size:32,color:QC,anchor:'middle',weight:700})+label('渡す エネルギーは？',770,260,{size:34,color:WC,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'ex3b']:(p)=>{
  let s=card(150,120,900,190,T2(`${Wt}=${Qt}${Vt}=0.50\\ \\mathrm{C}\\times9.0\\ \\mathrm{V}`,540,225,{size:46,auto:false})+fade(seg(p,.4,.55),T2(`=4.5\\ \\mathrm{J}`,920,222,{size:46,auto:false,color:WC})),1,WC);
  return s;
 },
 [K+'field2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=tube(70,1130,220,{fill:CU})+stream(t,{kind:'e',x1:70,x2:1130,gx:600,y:220,r:1.5,speed:60,dir:-1})+fieldArrows(220,{g:.8});
  s+=fade(seg(p,.05,.2),arrow(700,110,450,110,{color:NEG,w:5,head:16})+label('電子は 逆向きに 押される',575,80,{size:28,color:NEG,anchor:'middle',weight:700}));
  s+=arrow(420,340,780,340,{color:IC,w:7,head:20,g:seg(p,.5,.65)})+fade(seg(p,.55,.7),label('電流（電場と 同じ 向き）',600,395,{size:28,color:IC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.05,.2),label('電場',1100,170,{size:26,color:EC,anchor:'end',weight:700}));
  return s;
 },
 [K+'ans3']:(p)=>{
  let s=card(200,80,800,170,label('電圧 1 V',600,150,{size:40,color:VC,anchor:'middle',weight:700})+label('＝ 1 C あたり 1 J の エネルギーの 差',600,215,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.1,.25),VC);
  s+=fcard(350,300,500,140,`1\\ \\mathrm{V}=1\\ \\mathrm{J/C}`,{size:56,col:VC,g:seg(p,.4,.55)});
  return s;
 },
});

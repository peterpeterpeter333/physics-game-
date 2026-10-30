// 高校編「波の基本・深く学ぶ 2/2」(ys-hs-w-basics-2) — 図。Stage 1200×515.
// 色は 1/2 と同じ：x・λ 水色、t・T 金、f 桃、v 紫、ずれ・A 白、印 黄、山の目印 紫。
// ロープの尺度：1 m ＝ 160 px（λ＝2.0 m ＝ 320 px）。表示の時間はゆっくり（f＝5.0 Hz の1周期を 1.6 s で見せる）。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,poly,axes,brace,clamp,mix} from './anim.mjs';
import {card,tag,T2,sceneT,tSince,RP,disp,rope,hand,mark,crestsAt,crestMark,trackedCrest,beads,
 LC,TCOL,FC,VCOL,ROPE,MK,Lt,Tt,ft,HZ,MS,MM,SS} from './yt1-hs-w-basics-1-diagrams.mjs';
export {tSince};
export {ropeN,crestX,pclock,span,longi,belt,vt};

const K='hs-w-basics-2:';
const PI=Math.PI;
const vt=`{\\color{${VCOL}}v}`;
// ---- startup wave controlled by phase n (in periods since the hand started) ---------------------
const ST=(n,o=RP)=>({t:n*o.T,o,front:true});
const ropeN=(n,o=RP,g=1)=>rope({...ST(n,o),g})+hand(n*o.T,o,true,g);
// crest made at phase n0 (=0.25 for the first): its distance from the hand at phase n
const crestX=(n,n0,o=RP)=>o.x0+o.lam*(n-n0);
// a small clock: gold sector = fraction of one period
function pclock(x,y,frac,{g=1,r=42,text=''}={}){
 let s=ring(x,y,r,{color:TCOL,w:3});
 if(frac>0){const a1=-PI/2+2*PI*Math.min(1,frac),pts=[[x,y]];for(let k=0;k<=40;k++){const a=-PI/2+(a1+PI/2)*k/40;pts.push([x+r*Math.cos(a),y+r*Math.sin(a)]);}s+=poly(pts,{fill:TCOL,fo:.35});}
 if(text)s+=label(text,x+r+16,y+9,{size:28,color:TCOL,weight:700});
 return fade(g,s);
}
const span=(x1,x2,y,text,color,g=1,size=34,dy=-16)=>fade(g,line(x1,y-14,x1,y+14,{color,w:2})+line(x2,y-14,x2,y+14,{color,w:2}))+arrow(x1,y,x2,y,{color,w:3,head:12,g})+arrow(x2,y,x1,y,{color,w:3,head:12,g})+fade(g,label(text,(x1+x2)/2,y+dy,{size,color,anchor:'middle',weight:700}));
// ---- longitudinal wave: rows of dots displaced sideways ------------------------------------------
const LO={x0:120,x1:1080,n:41,y:[330,362,394],A:16,lam:320,T:1.8};
const ldisp=(x,t,front=false)=>{const d=x-LO.x0,v=LO.lam/LO.T;if(front&&d>v*t)return 0;return LO.A*Math.sin(2*PI*(t/LO.T-d/LO.lam));};
function longi(t,{g=1,hl=20,front=false,handG=0,track=0,dense=0,graph=0,arrows=0}={}){
 let s='';const xs=Array.from({length:LO.n},(_,i)=>LO.x0+(LO.x1-LO.x0)*i/(LO.n-1));
 if(handG){const hx=LO.x0-40+ldisp(LO.x0,t,front);s+=fade(g*handG,rect(hx-34,LO.y[0]-30,34,LO.y[2]-LO.y[0]+60,{fill:'#e9c7a6',fo:.95,stroke:'none',rx:12}));}
 if(dense){ // compressions: phase where −ds/dx is max → cos(...)＝1 → t/T − d/λ ＝ n
  const k0=Math.floor(t/LO.T-(LO.x1-LO.x0)/LO.lam)-1;for(let k=k0;k<=Math.ceil(t/LO.T)+1;k++){const d=LO.lam*(t/LO.T-k);if(d<0||d>LO.x1-LO.x0||(front&&d>LO.lam/LO.T*t))continue;const x=LO.x0+d;
   s+=fade(g*dense,rect(x-34,LO.y[0]-26,68,LO.y[2]-LO.y[0]+52,{fill:C.hi,fo:.16,stroke:C.hi,sw:1.5,rx:10})+label('密',x,LO.y[2]+60,{size:26,color:C.hi,anchor:'middle',weight:700}));
   const xr=x+LO.lam/2;if(xr<LO.x1&&(!front||xr-LO.x0<=LO.lam/LO.T*t))s+=fade(g*dense,label('疎',xr,LO.y[2]+60,{size:26,color:C.dim,anchor:'middle',weight:700}));}
 }
 LO.y.forEach((y,r)=>xs.forEach((x,i)=>{const X=x+ldisp(x,t,front),h=i===hl&&r===1;s+=fade(g,dot(X,y,h?11:7,h?MK:'#a9d8ff'));}));
 if(track){const x=xs[hl];s+=fade(g*track,line(x-LO.A,LO.y[1]-34,x-LO.A,LO.y[1]+34,{color:MK,w:2,dash:'4 5'})+line(x+LO.A,LO.y[1]-34,x+LO.A,LO.y[1]+34,{color:MK,w:2,dash:'4 5'}));}
 if(arrows){const x=xs[hl];s+=fade(g*arrows,arrow(x,LO.y[0]-40,x-40,LO.y[0]-40,{color:MK,w:4,head:12})+arrow(x,LO.y[0]-40,x+40,LO.y[0]-40,{color:MK,w:4,head:12}));}
 if(graph){ // density graph above: crest at compressions
  const gy=170,ga=50;const pts=[];for(let x=LO.x0;x<=LO.x1;x+=5){const d=x-LO.x0;pts.push([x,gy-ga*Math.cos(2*PI*(t/LO.T-d/LO.lam))]);}
  s+=fade(g*graph,line(LO.x0,gy,LO.x1,gy,{color:C.faint,w:2,dash:'6 8'})+draw(pts,1,{color:C.hi,w:4})+label('密さ',LO.x0-10,gy-ga-16,{size:24,color:C.hi,weight:700}));
 }
 return s;
}
// ---- graph of y against x for the wave formula ----------------------------------------------------
const WG={x:110,y:470,w:900,h:250};
const wAxes=g=>axes({...WG,xmin:0,xmax:3.0,ymin:-1.3,ymax:1.3,xticks:[0.5,1,1.5,2,2.5],xlabel:'x [m]',ylabel:'ずれ y',g,xcolor:LC});
const wy=(x,t)=>Math.sin(2*PI*(x/2.0-t/.2));
function wgraph({g=1,t=0,ghost=null,crest=1,cl=null}={}){
 const A=wAxes(g);let s=A.svg;
 if(ghost!==null)s+=fade(g*.35,A.plot(u=>wy(u,ghost),{from:0,to:3,color:ROPE,w:3,dash:'8 8'}));
 s+=fade(g,A.plot(u=>wy(u,t),{from:0,to:3,color:ROPE,w:4}));
 if(crest){const xc=.5+t*10;s+=fade(g*crest,poly([[A.X(xc)-13,A.Y(1)-34],[A.X(xc)+13,A.Y(1)-34],[A.X(xc),A.Y(1)-14]],{fill:VCOL,fo:1})+(cl?label(cl,A.X(xc),A.Y(1)-44,{size:24,color:VCOL,anchor:'middle',weight:700}):''));}
 return {s,A};
}
const FORM=`y=A\\sin 2\\pi\\left(\\frac{x}{${Lt}}-\\frac{t}{${Tt}}\\right)`;
// ---- the "belt": 5 waves of 2.0 m laid end to end ------------------------------------------------
function belt(u,{g=1}={}){
 const x0=110,w=180,y=250;let s='';
 for(let i=0;i<5;i++){const o=clamp(u*5-i);if(o<=0)continue;const pts=[];for(let k=0;k<=60;k++){const xx=x0+i*w+w*k/60*o;pts.push([xx,y-55*Math.sin(2*PI*k/60*o)]);}
  s+=fade(g,draw(pts,1,{color:i%2?ROPE:'#a9d8ff',w:4})+(o>.98?label(`${i+1}個目`,x0+i*w+w/2,y+100,{size:24,color:FC,anchor:'middle',weight:700})+span(x0+i*w+4,x0+(i+1)*w-4,y+70,'',LC,1):''));}
 s+=fade(g,line(x0,y,x0+5*w,y,{color:C.faint,w:2,dash:'6 8'}));
 s+=fade(g*seg(u,.98,1),label('2.0 m',x0+w/2,y-80,{size:24,color:LC,anchor:'middle',weight:700}));
 return s;
}

export const hsWBasics2Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p,ctx)=>{
  const t=sceneT(p,ctx),o={...RP,y:340},t0=t-(ctx?ctx.t:p*8);
  let s=rope({t,o})+hand(t,o)+crestMark(trackedCrest(t,t0,o,{from:30}),o);
  s+=card(170,30,860,130,label('1回 振動する あいだに、山は どれだけ 進む？',600,110,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.15,.3),C.hi);
  return s;
 },
 [K+'q2']:(p,ctx)=>{
  const t=sceneT(p,ctx),o={...RP,y:340},t0=t-(ctx?ctx.t:p*8);
  let s=rope({t,o})+hand(t,o)+crestMark(trackedCrest(t,t0,o,{from:30}),o);
  s+=card(170,30,860,130,label('1回 振動する あいだに、山は どれだけ 進む？',600,110,{size:34,color:C.hi,anchor:'middle',weight:700}),1,C.hi);
  s+=fade(seg(p,.1,.3),label('→ 波の 速さ は？',600,490,{size:32,color:VCOL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'pred']:(p,ctx)=>{
  const t=sceneT(p,ctx),o1={...RP,y:250,A:40},o2={...RP,y:420,A:40,lam:160,T:.8};
  let s=rope({t,o:o1})+hand(t,o1)+rope({t,o:o2})+hand(t,o2);
  s+=fade(seg(p,.1,.25),label('ゆっくり 振る',1090,166,{size:24,color:C.dim,anchor:'end'})+label('速く 振る（振動数 大）',1090,345,{size:24,color:FC,anchor:'end',weight:700}));
  s+=card(300,30,600,110,label('波は 速く 進む？',600,102,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 // ================= S2 1周期で進む距離 =================
 [K+'setup']:(p)=>{
  const n=.25*seg(p,.6,1)*0; // still at rest
  let s=ropeN(0);
  s+=fade(seg(p,.1,.25),arrow(RP.x0-28,RP.y-40,RP.x0-28,RP.y-100,{color:C.ink,w:4,head:14})+arrow(RP.x0-28,RP.y+40,RP.x0-28,RP.y+100,{color:C.ink,w:4,head:14}));
  s+=fade(seg(p,.25,.4),label('静かな ロープ',600,RP.y+60,{size:26,color:C.dim,anchor:'middle'}));
  s+=pclock(1000,90,0,{g:seg(p,.55,.7),text:''})+fade(seg(p,.55,.7),label('手の 周期 T',1000,165,{size:26,color:TCOL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'first']:(p)=>{
  const n=.25*seg(p,.05,.5);
  let s=ropeN(n);
  s+=crestMark(RP.x0,RP,{g:seg(p,.55,.7),text:'最初の 山'});
  s+=fade(seg(p,.5,.6),label('いちばん 上',RP.x0-28,RP.y-RP.A-110,{size:24,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'cycle']:(p)=>{
  const u=seg(p,.05,.85),n=.25+u;
  let s=ropeN(n)+crestMark(crestX(n,.25),RP,{text:'最初の 山'});
  s+=pclock(1000,90,u,{text:u>.99?'T':''});
  s+=fade(seg(p,.05,.2),label('1回 振動',1000,165,{size:26,color:TCOL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'second']:(p)=>{
  const n=1.25;
  let s=ropeN(n)+crestMark(crestX(n,.25),RP,{text:'最初の 山'})+pclock(1000,90,1,{text:'T'});
  s+=crestMark(RP.x0,RP,{g:seg(p,.05,.2),text:'次の 山',color:C.dim});
  s+=fade(seg(p,.5,.65),label('どこまで？',crestX(n,.25),RP.y+RP.A+60,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'lam']:(p)=>{
  const n=1.25;
  let s=ropeN(n)+crestMark(crestX(n,.25),RP,{text:'最初の 山'})+crestMark(RP.x0,RP,{text:'次の 山',color:C.dim})+pclock(1000,90,1,{text:'T'});
  s+=span(RP.x0,crestX(n,.25),RP.y+RP.A+50,'',LC,seg(p,.2,.45))+fade(seg(p,.4,.55),tex('\\lambda',(RP.x0+crestX(n,.25))/2,RP.y+RP.A+95,{size:40,color:LC}));
  return s;
 },
 [K+'so']:(p)=>{
  const n=1.25;
  let s=ropeN(n)+crestMark(crestX(n,.25),RP,{text:'最初の 山'})+crestMark(RP.x0,RP,{text:'次の 山',color:C.dim})+pclock(1000,90,1,{text:'T'});
  s+=span(RP.x0,crestX(n,.25),RP.y+RP.A+50,'',LC,1)+tex('\\lambda',(RP.x0+crestX(n,.25))/2,RP.y+RP.A+95,{size:40,color:LC});
  s+=card(560,370,560,110,label('1周期 T で 1波長 λ 進む',840,437,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'again']:(p)=>{
  const u=seg(p,.05,.6),n=1.25+u;
  let s=ropeN(n)+crestMark(crestX(n,.25),RP,{text:'最初の 山'})+pclock(1000,90,1+u,{text:u>.99?'2T':'T'});
  s+=span(RP.x0,RP.x0+RP.lam,RP.y+RP.A+50,'λ',LC,1,30,40);
  s+=span(RP.x0+RP.lam,RP.x0+2*RP.lam,RP.y+RP.A+50,'λ',LC,seg(p,.6,.75),30,40);
  s+=fade(seg(p,.7,.85),label('同じ 割合',870,RP.y+RP.A+100,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S3 v＝fλ を導く =================
 [K+'speed']:(p)=>{
  const o={...RP,y:330},n=1.25;
  let s=fade(.5,ropeN(n,o))+span(o.x0,o.x0+o.lam,o.y+o.A+45,'',LC,1)+fade(.9,tex('\\lambda',o.x0+o.lam/2,o.y+o.A+90,{size:36,color:LC}));
  s+=card(200,40,800,110,label('速さ ＝ 距離 ÷ 時間',600,110,{size:36,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.dim);
  s+=card(700,200,380,120,T2(`${vt}=\\dfrac{${Lt}}{${Tt}}`,890,272,{size:52}),seg(p,.55,.7),VCOL);
  return s;
 },
 [K+'split']:(p)=>{
  const R=`=${Lt}\\times\\dfrac{1}{${Tt}}`,w=texWidth(R,52);
  let s=card(80,60,1040,170,T2(`${vt}=\\dfrac{${Lt}}{${Tt}}`,560,150,{size:52,anchor:'end'})+fade(seg(p,.15,.35),T2(R,575,150,{size:52,anchor:'start'})),1,VCOL);
  s+=fade(seg(p,.45,.6),rect(575+w-62,76,74,138,{fill:C.hi,fo:.08,stroke:C.hi,sw:2.5,rx:10}));
  return s;
 },
 [K+'subst']:(p)=>{
  let s=card(80,40,1040,150,T2(`${vt}=${Lt}\\times\\dfrac{1}{${Tt}}`,600,120,{size:50}),1,VCOL);
  s+=card(80,230,330,120,T2(`${ft}=\\dfrac{1}{${Tt}}`,245,300,{size:46}),seg(p,.05,.2),FC);
  s+=fade(seg(p,.2,.4),arrow(420,290,560,290,{color:C.hi,w:4,head:14})+label('置き換え',490,275,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=card(580,230,420,150,T2(`${vt}=${ft}${Lt}`,790,315,{size:64}),seg(p,.4,.55),C.hi);
  s+=tag('導いた 結果',790,430,{color:C.hi,g:seg(p,.65,.8)});
  return s;
 },
 [K+'ex']:(p)=>{
  let s=card(160,40,880,110,label('f ＝ 5.0 Hz、λ ＝ 2.0 m',600,112,{size:36,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.dim);
  s+=card(160,200,880,140,T2(`${vt}=5.0\\times 2.0=10${MS}`,600,280,{size:52}),seg(p,.45,.6),VCOL);
  return s;
 },
 [K+'chk']:(p)=>{
  let s=card(160,40,880,130,T2(`${Tt}=\\dfrac{1}{5.0}=0.20${SS}`,600,115,{size:46}),seg(p,.05,.2),TCOL);
  s+=card(160,210,880,140,T2(`\\dfrac{${Lt}}{${Tt}}=\\dfrac{2.0}{0.20}=10${MS}`,600,290,{size:46}),seg(p,.35,.5),VCOL);
  s+=fade(seg(p,.7,.85),label('同じ 速さ',600,420,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'read']:(p)=>{
  let s=card(240,30,720,110,T2(`${vt}=${ft}\\times${Lt}`,600,95,{size:50}),1,VCOL);
  s+=fade(seg(p,.25,.4),label('f：1秒に 送り出す 波の 個数',600,230,{size:32,color:FC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('λ：波 1個の 長さ',600,300,{size:32,color:LC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'belt']:(p)=>{
  let s=belt(lin(p,.05,.55));
  s+=fade(seg(p,.6,.7),span(110,1010,80,'10 m',VCOL,1,30,-16));
  s+=fade(seg(p,.75,.88),label('1秒で 先頭が 10 m 進む',1010,470,{size:28,color:VCOL,anchor:'end',weight:700}));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=card(160,60,880,120,T2('\\mathrm{Hz}=\\dfrac{1}{\\mathrm{s}}',600,128,{size:46,auto:false}),seg(p,.05,.2),FC);
  s+=card(160,230,880,130,T2('\\mathrm{Hz}\\times\\mathrm{m}=\\dfrac{1}{\\mathrm{s}}\\times\\mathrm{m}=\\mathrm{m/s}',600,300,{size:46,auto:false}),seg(p,.4,.55),VCOL);
  return s;
 },
 [K+'law']:(p,ctx)=>{
  const t=sceneT(p,ctx),o={...RP,y:330};
  let s=rope({t,o})+hand(t,o);
  s+=card(200,40,800,150,label('波の 速さ v は 媒質で 決まる',600,104,{size:34,color:VCOL,anchor:'middle',weight:700})+label('手の 振り方では 変わらない',600,160,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.2),VCOL);
  s+=tag('実験で 確かめた 性質',600,470,{color:C.F,g:seg(p,.6,.75)});
  return s;
 },
 [K+'double']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'double')-.3,o1={...RP,y:200,A:40},o2={...RP,y:380,A:40,lam:160,T:.8};
  let s=rope({t,o:o1,front:true})+hand(t,o1,true)+rope({t,o:o2,front:true})+hand(t,o2,true);
  s+=fade(seg(p,0,.1),label('f ＝ 5.0 Hz',1090,o1.y-70,{size:26,color:FC,anchor:'end',weight:700})+label('f ＝ 10 Hz',1090,o2.y-70,{size:26,color:FC,anchor:'end',weight:700}));
  const v=o1.lam/o1.T,fx=o1.x0+Math.max(0,v*t);
  if(fx<o1.x1)s+=line(fx,90,fx,480,{color:VCOL,w:2,dash:'6 6'})+label('先頭',fx,80,{size:24,color:VCOL,anchor:'middle',weight:700});
  s+=fade(seg(p,.6,.75),label('先頭は そろって 進む：同じ 速さ',600,505,{size:26,color:VCOL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'double2']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'double')-.3,o1={...RP,y:200,A:40},o2={...RP,y:380,A:40,lam:160,T:.8};
  let s=fade(.6,rope({t,o:o1,front:true})+rope({t,o:o2,front:true}));
  s+=span(o1.x0+o1.lam*.25+o1.lam,o1.x0+o1.lam*1.25+o1.lam,o1.y+o1.A+28,'2.0 m',LC,seg(p,.4,.55),26,34);
  s+=span(o2.x0+o2.lam*.25+o2.lam*2,o2.x0+o2.lam*1.25+o2.lam*2,o2.y+o2.A+28,'1.0 m',LC,seg(p,.4,.55),26,34);
  s+=card(250,40,700,100,T2(`${Lt}=\\dfrac{${vt}}{${ft}}=\\dfrac{10}{10}=1.0${MM}`,600,92,{size:40}),seg(p,.05,.2),LC);
  return s;
 },
 [K+'mis']:(p)=>{
  let s=card(140,60,920,140,label('× 振動数を 上げると 速くなる',600,145,{size:38,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=card(140,260,920,140,label('○ 速さは 同じ、波長が 短く なる',600,345,{size:38,color:C.F,anchor:'middle',weight:700}),seg(p,.5,.65),C.F);
  return s;
 },
 // ================= S4 横波と縦波 =================
 [K+'trans']:(p,ctx)=>{
  const t=sceneT(p,ctx),o={...RP,y:300};
  let s=rope({t,o})+hand(t,o)+mark(590,t,o,false,{track:1});
  s+=fade(seg(p,.1,.25),arrow(640,o.y-20,640,o.y-90,{color:MK,w:4,head:14})+arrow(640,o.y+20,640,o.y+90,{color:MK,w:4,head:14})+label('揺れ：上下',660,o.y-100,{size:26,color:MK,weight:700}));
  s+=fade(seg(p,.2,.35),arrow(800,110,1000,110,{color:VCOL,w:5,head:16})+label('進む 向き',900,90,{size:26,color:VCOL,anchor:'middle',weight:700}));
  s+=card(80,410,360,90,label('横波',260,468,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'long']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'long');
  let s=longi(t,{front:true,handG:1,hl:-1});
  s+=fade(seg(p,.1,.25),label('ばね（の 各部分）',600,250,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.3,.45),arrow(60,470,20,470,{color:C.ink,w:4,head:12})+arrow(80,470,120,470,{color:C.ink,w:4,head:12})+label('押す・引く',70,505,{size:22,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'long2']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'long');
  let s=longi(t,{front:true,handG:1,hl:12,arrows:seg(p,.1,.25)});
  s+=fade(seg(p,.1,.25),label('揺れ：左右',LO.x0+(LO.x1-LO.x0)*12/40,LO.y[0]-62,{size:24,color:MK,anchor:'middle',weight:700}));
  s+=fade(seg(p,.2,.35),arrow(800,150,1000,150,{color:VCOL,w:5,head:16})+label('進む 向き',900,130,{size:26,color:VCOL,anchor:'middle',weight:700}));
  s+=card(80,60,360,90,label('縦波',260,118,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'dense']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'long');
  let s=longi(t,{front:true,handG:1,hl:-1,dense:seg(p,.15,.35)});
  s+=fade(seg(p,.6,.75),label('密：詰まった 部分　疎：広がった 部分',600,200,{size:28,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'dot']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'long');
  let s=longi(t,{front:true,handG:1,hl:20,track:1,dense:1});
  s+=fade(seg(p,.1,.25),label('印：左右に 小さく 往復',600,190,{size:28,color:MK,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('密な 部分：右へ 進む',600,240,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'lamL']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'long');
  let s=longi(t,{front:false,hl:-1,dense:1,graph:seg(p,.45,.6)});
  const d0=((LO.lam*(t/LO.T))%LO.lam+LO.lam)%LO.lam,x1=LO.x0+d0+(d0<60?LO.lam:0);
  s+=fade(seg(p,.1,.25),span(x1,x1+LO.lam,262,'',LC,1)+tex('\\lambda',x1+LO.lam/2,248,{size:34,color:LC}));
  s+=fade(seg(p,.7,.85),label('密 ＝ 山、疎 ＝ 谷',1080,80,{size:26,color:C.hi,anchor:'end',weight:700}));
  return s;
 },
 // ================= S5 波の式 =================
 [K+'intro']:(p)=>{
  let s=card(200,80,800,130,label('右へ 進む 波 を 式で',600,160,{size:40,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.dim);
  s+=card(300,280,600,110,label('sin と ラジアン（数II）',600,348,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'form']:(p)=>{
  let s=card(150,60,900,150,T2(FORM,600,150,{size:52}),seg(p,.3,.45),C.hi);
  s+=fade(seg(p,.05,.2),label('y：媒質の ずれ',600,300,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'fx']:(p)=>{
  let s=card(150,60,900,150,T2(FORM,600,150,{size:52}),1,C.hi);
  s+=fade(seg(p,.05,.2),label('x：場所',420,290,{size:30,color:LC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.2,.35),label('t：時刻',780,290,{size:30,color:TCOL,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('山を 追って 確かめる',600,400,{size:32,color:VCOL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'crest']:(p)=>{
  let s=card(150,30,900,120,T2(FORM,600,100,{size:44}),1,C.dim);
  s+=card(150,190,900,120,T2(`2\\pi\\left(\\frac{x}{${Lt}}-\\frac{t}{${Tt}}\\right)=\\frac{\\pi}{2}`,600,260,{size:46}),seg(p,.05,.2),VCOL);
  s+=card(150,350,900,120,T2(`\\frac{x}{${Lt}}-\\frac{t}{${Tt}}=\\frac14`,600,420,{size:46}),seg(p,.5,.65),VCOL);
  s+=fade(seg(p,.6,.75),label('山',1000,420,{size:32,color:VCOL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'num']:(p)=>{
  const {s:g,A}=wgraph({t:0,crest:seg(p,.6,.75),cl:'x ＝ 0.50 m'});
  let s=g+card(640,40,520,110,T2(`t=0:\\ \\frac{x}{2.0}=\\frac14\\ \\Rightarrow\\ x=0.50${MM}`,900,100,{size:34}),seg(p,.4,.55),VCOL);
  s+=fade(seg(p,.05,.2),label('λ ＝ 2.0 m、T ＝ 0.20 s',110,80,{size:28,color:C.ink,weight:700}));
  return s;
 },
 [K+'num2']:(p)=>{
  const tt=.05*seg(p,.2,.55);
  const {s:g,A}=wgraph({t:tt,ghost:0,crest:1,cl:tt>.049?'x ＝ 1.0 m':''});
  let s=g+fade(.9,label(`t ＝ ${tt.toFixed(3)} s`,110,80,{size:28,color:TCOL,weight:700}));
  s+=card(560,30,600,130,T2(`\\frac{x}{2.0}=\\frac14+\\frac14=\\frac12\\ \\Rightarrow\\ x=1.0${MM}`,860,98,{size:34}),seg(p,.55,.7),VCOL);
  return s;
 },
 [K+'num3']:(p)=>{
  const {s:g,A}=wgraph({t:.05,ghost:0,crest:1});
  let s=g+span(A.X(.5),A.X(1),A.Y(1)-70,'0.50 m',LC,seg(p,.05,.2),24,-14);
  s+=card(560,30,600,120,T2(`\\dfrac{0.50}{0.050}=10${MS}`,860,92,{size:40}),seg(p,.4,.55),VCOL);
  s+=fade(seg(p,.7,.85),label('v ＝ fλ と 同じ',860,200,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'minus']:(p)=>{
  let s=card(150,30,900,130,T2(FORM,600,105,{size:46}),1,C.dim);
  const rows=[['t が 増える',TCOL],['−t/T は 減る',TCOL],['中身を 保つ → x が 増える',LC],['山は 右へ',VCOL]];
  rows.forEach(([a,c],i)=>{s+=fade(seg(p,.05+i*.2,.2+i*.2),label(a,600,230+i*68,{size:32,color:c,anchor:'middle',weight:700}));});
  return s;
 },
 [K+'plus']:(p)=>{
  let s=card(80,60,500,150,T2(`\\sin 2\\pi\\left(\\frac{x}{${Lt}}-\\frac{t}{${Tt}}\\right)`,330,140,{size:38}),1,VCOL);
  s+=fade(.999,arrow(230,260,430,260,{color:VCOL,w:6,head:18})+label('右へ',330,310,{size:30,color:VCOL,anchor:'middle',weight:700}));
  s+=card(620,60,500,150,T2(`\\sin 2\\pi\\left(\\frac{x}{${Lt}}+\\frac{t}{${Tt}}\\right)`,870,140,{size:38}),seg(p,.05,.2),C.a);
  s+=fade(seg(p,.25,.4),arrow(970,260,770,260,{color:C.a,w:6,head:18})+label('左へ',870,310,{size:30,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.65,.8),label('「−」は 右へ 進む 印',600,440,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S6 元の問いと次の単元 =================
 [K+'ans']:(p)=>{
  const n=1.25;
  let s=ropeN(n)+crestMark(crestX(n,.25),RP,{text:'最初の 山'})+crestMark(RP.x0,RP,{text:'次の 山',color:C.dim})+pclock(1000,90,1,{text:'T'});
  s+=span(RP.x0,crestX(n,.25),RP.y+RP.A+50,'',LC,1)+tex('\\lambda',(RP.x0+crestX(n,.25))/2,RP.y+RP.A+95,{size:40,color:LC});
  s+=card(560,370,560,110,label('1周期 T で 1波長 λ 進む',840,437,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'ans2']:(p)=>{
  let s=card(200,40,800,180,T2(`${vt}=\\dfrac{${Lt}}{${Tt}}=${ft}${Lt}`,600,148,{size:54}),1,C.hi);
  s+=card(200,270,800,120,label('f を 上げる → λ が 短く なる',600,342,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.45,.6),FC);
  return s;
 },
 [K+'univ']:(p)=>{
  let s=card(200,90,800,170,label('大学編では',600,150,{size:30,color:C.dim,anchor:'middle'})+T2('y(x,t)',600,215,{size:46}),seg(p,.05,.2),C.dim);
  s+=fade(seg(p,.4,.55),label('場所 と 時間、両方で 変わる 関数',600,330,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'n1']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=longi(t,{hl:-1,dense:1});
  s+=card(300,60,600,120,label('音 ＝ 空気の 縦波',600,135,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'n2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.45,longi(t,{hl:-1,dense:1}));
  s+=card(150,40,900,140,label('音の 高さ と 大きさ は、',600,100,{size:34,color:C.ink,anchor:'middle',weight:700})+label('どの 量で 決まる？',600,155,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.4,.55),label('A？　λ？　T？　f？',600,250,{size:32,color:C.dim,anchor:'middle',weight:700}));
  return s;
 },
 [K+'bye']:(p)=>{
  let s=card(200,110,800,230,label('次の 単元',600,175,{size:28,color:C.dim,anchor:'middle'})+label('音波',600,265,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  s+=fade(seg(p,.5,.7),label('波の基本 → 音波',1080,470,{size:26,color:C.dim,anchor:'end'}));
  return s;
 },
};

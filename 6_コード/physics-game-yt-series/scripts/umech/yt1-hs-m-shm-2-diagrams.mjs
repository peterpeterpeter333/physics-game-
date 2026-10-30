// 高校編「単振動・深く学ぶ 2/3」(ys-hs-m-shm-2) — 図。Stage 1200×515.
// 上：真上から見た等速円運動（半径 A＝0.10 m ↔ 120 px、反時計回り、角 ωt は右から測る）。下：真横から見た影と、ばねのおもり。
// 色：位置 x 水色、加速度 a 赤、力 F 緑、ω 桃、角 橙、t・T 金、強調 黄。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,ground,wall,spring,axes} from './anim.mjs';
import {card,table,tag,T2} from './yt1-hs-m-shm-1-diagrams.mjs';
import {ball} from './yt1-hs-m-freefall-1-diagrams.mjs';
import {arcPts} from './yt1-hs-m-circular-1-diagrams.mjs';

const K='hs-m-shm-2:';
const PI=Math.PI;
const W=`{\\color{${C.p}}\\omega}`, TT=`{\\color{${C.t}}T}`;
// ---- geometry -------------------------------------------------------------------------------------
export const G={cx:520,cy:165,R:120,px:1200,sy:330,by:445,wall:200};
const PT=(th,o=G)=>[o.cx+o.R*Math.cos(th),o.cy-o.R*Math.sin(th)];
// circle (top view) with the point at angle th
export function circ({th=0,g=1,o=G,rad=0,ang=0,acc=0,proj=1,omega=0,plate=1}={}){
 const [x,y]=PT(th,o);
 let s='';
 if(plate)s+=fade(g*.8,rect(o.cx-o.R-40,o.cy-o.R-34,2*o.R+80,2*o.R+68,{fill:'#1a2742',fo:.6,stroke:C.faint,rx:16}));
 s+=fade(g,ring(o.cx,o.cy,o.R,{color:C.faint,w:2.5,dash:'8 8'})+dot(o.cx,o.cy,5,C.dim));
 if(omega){const pts=arcPts(o.cx,o.cy,o.R+20,.5,1.1,16);s+=fade(g*omega,draw(pts,1,{color:C.p,w:3}));const [x2,y2]=pts[16],[x1,y1]=pts[14];s+=arrow(x1,y1,x2+(x2-x1)*1.5,y2+(y2-y1)*1.5,{color:C.p,w:3,head:12,g:g*omega});s+=fade(g*omega,label('ω',o.cx+(o.R+44)*Math.cos(.8),o.cy-(o.R+44)*Math.sin(.8),{size:28,color:C.p,weight:700}));}
 if(rad)s+=arrow(o.cx,o.cy,x,y,{color:C.ink,w:3,head:12,g:g*rad});
 if(ang){const pts=arcPts(o.cx,o.cy,34,0,th,20);s+=fade(g*ang,draw(pts,1,{color:C.E,w:3})+line(o.cx,o.cy,o.cx+o.R+20,o.cy,{color:C.faint,w:1.5,dash:'5 5'}));}
 if(acc){const L=.75;s+=arrow(x,y,x+(o.cx-x)*L,y+(o.cy-y)*L,{color:C.a,w:5,head:16,g:g*acc});}
 if(proj)s+=fade(g*proj*.7,line(x,y,x,o.sy,{color:C.faint,w:2,dash:'5 6'}));
 s+=fade(g,ball(x,y,{r:13}));
 return s;
}
// shadow on the side-view line
export function shadow({th=0,g=1,o=G,lineG=1,lab=0}={}){
 const x=o.cx+o.R*Math.cos(th);
 let s=fade(g*lineG,line(o.cx-o.R-60,o.sy,o.cx+o.R+60,o.sy,{color:C.dim,w:2})+line(o.cx,o.sy-10,o.cx,o.sy+10,{color:C.dim,w:2}));
 s+=fade(g,dot(x,o.sy,11,'#c9a46a'));
 if(lab)s+=fade(g*lab,label('真横から 見た 影',o.cx-o.R-70,o.sy+8,{size:22,color:C.dim,anchor:'end'}));
 return s;
}
// spring + block whose centre follows x (m)
export function sbox({x=0,g=1,o=G,F=0}={}){
 const bx=o.cx+x*o.px,bw=70,bh=56,y=o.by;
 let s=fade(g,wall(o.wall,y-50,y+bh/2)+ground(o.wall,o.cx+o.R+120,y+bh/2)+line(o.cx,y-44,o.cx,y+bh/2,{color:C.faint,w:2,dash:'6 6'}));
 s+=fade(g,spring(o.wall,bx-bw/2,y,{coils:9,amp:12,color:C.dim,w:3})+rect(bx-bw/2,y-bh/2,bw,bh,{fill:'#c9a46a',fo:.6,stroke:'#c9a46a',rx:8}));
 return s;
}
const cosAxes=(g=1,{x=760,y=200,w=380,h=110}={})=>axes({x,y,w,h,xmax:1.2,ymax:1.2,ymin:-1.2,xlabel:'t',ylabel:'x',xticks:[],yticks:[],g,xcolor:C.t,ycolor:C.x});

export const hsShm2Diagrams={
 // ================= S1 =================
 [K+'q']:(p)=>{
  const th=p*2.2*PI;
  let s=sbox({x:.1*Math.cos(th),o:{...G,by:300}});
  s+=card(250,40,700,130,label('1往復の 時間は 何で 決まる？',600,120,{size:40,color:C.t,anchor:'middle',weight:700}),seg(p,.1,.25),C.t);
  return s;
 },
 [K+'q2']:(p)=>{
  const th=p*2.6*PI;
  let s=sbox({x:.1*Math.cos(th),o:{...G,by:200}})+sbox({x:.04*Math.cos(th),o:{...G,by:400}});
  s+=fade(seg(p,.05,.2),label('大きく',820,208,{size:30,color:C.x,weight:700})+label('小さく',820,408,{size:30,color:C.x,weight:700}));
  s+=card(880,260,280,90,label('長く なる？',1020,318,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'T']:(p)=>{
  const th=p*2*PI;
  let s=sbox({x:.1*Math.cos(th),o:{...G,by:300}});
  s+=card(760,60,400,170,label('1往復の 時間',960,115,{size:28,color:C.ink,anchor:'middle'})+label('周期 T',960,190,{size:46,color:C.t,anchor:'middle',weight:700}),seg(p,.05,.2),C.t);
  s+=fade(seg(p,.55,.7),label('円運動：1周の 時間 も T',960,290,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 // ================= S2 加速度 =================
 [K+'a1']:(p)=>{
  let s=T2('ma=F',600,100,{size:52});
  s+=fade(seg(p,.1,.25),label('ばねの 力',900,60,{size:24,color:C.F,anchor:'middle'})+T2('F=-kx',900,110,{size:44}));
  s+=fade(seg(p,.5,.65),arrow(820,150,700,200,{color:C.hi,w:3,head:12}));
  s+=card(390,230,420,110,T2('ma=-kx',600,290,{size:54}),seg(p,.6,.75),C.F);
  return s;
 },
 [K+'a2']:(p)=>{
  let s=T2('ma=-kx',600,80,{size:50});
  s+=fade(seg(p,.1,.25),label('両辺を m で 割る',900,90,{size:26,color:C.hi}));
  s+=card(380,170,440,150,T2('a=-\\dfrac{k}{m}\\,x',600,255,{size:58}),seg(p,.3,.45),C.a);
  s+=tag('導いた 結果',600,400,{g:seg(p,.7,.85)});
  return s;
 },
 [K+'a3']:(p)=>{
  let s=T2('a=-\\dfrac{k}{m}\\,x',300,120,{size:50});
  const xs=[.1,.05,-.05,-.1];
  const o={...G,cx:760,R:120,by:330,wall:450};
  const u=seg(p,.1,.6),x=.1*Math.cos(u*PI);
  s+=sbox({x,o});
  const bx=o.cx+x*o.px,L=-x*1200*.9;
  if(Math.abs(L)>6)s+=arrow(bx,o.by-48,bx+L,o.by-48,{color:C.a,w:6,head:Math.min(16,Math.abs(L)*.6)});
  s+=fade(seg(p,.05,.2),label('ずれと 逆向き',300,250,{size:28,color:C.a,anchor:'middle',weight:700})+label('ずれに 比例',300,300,{size:28,color:C.a,anchor:'middle',weight:700}));
  s+=card(60,360,360,90,label('位置 → 加速度が 決まる',240,415,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.65,.8),C.hi);
  return s;
 },
 [K+'a4']:(p)=>{
  let s=card(200,50,800,110,T2('\\dfrac{k}{m}=100\\div 1.0=100',600,108,{size:40,auto:false}),seg(p,0,.15),C.ink);
  s+=fade(seg(p,.25,.4),T2('a=-100\\,x',600,230,{size:50}));
  s+=card(250,300,700,110,T2('x=0.10\\ \\mathrm{m}\\ \\to\\ a=-10\\ \\mathrm{m/s^2}',600,358,{size:40}),seg(p,.6,.75),C.a);
  return s;
 },
 [K+'a5']:(p)=>{
  let s=fade(.6,T2('a=-\\dfrac{k}{m}\\,x',600,110,{size:50}));
  s+=card(250,220,700,130,label('何秒後に どこに いる？',600,300,{size:40,color:C.t,anchor:'middle',weight:700}),seg(p,.2,.35),C.t);
  return s;
 },
 [K+'a6']:(p)=>{
  let s=fade(.5,T2('a=-\\dfrac{k}{m}\\,x',250,110,{size:44}));
  s+=fade(seg(p,.1,.25),label('同じ 決まりの 動きを 探す',250,250,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),circ({th:p*2*PI,o:{...G,cx:820,cy:240,R:130},proj:0}));
  s+=fade(seg(p,.55,.7),label('円運動',820,470,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S3 円運動の影 =================
 [K+'c1']:(p)=>{
  const th=p*1.6*PI;
  let s=circ({th,proj:0,omega:seg(p,.3,.45),rad:1});
  s+=fade(seg(p,.1,.25),label('A',G.cx+G.R*Math.cos(th)/2+24*Math.sin(th),G.cy-G.R*Math.sin(th)/2+24*Math.cos(th)+9,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=card(760,40,400,110,label('真上から 見た 図',960,108,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.55,.7));
  return s;
 },
 [K+'c2']:(p)=>{
  const th=1.6*PI+p*2*PI;
  let s=circ({th,proj:seg(p,.05,.2)})+shadow({th,g:seg(p,.1,.25),lab:seg(p,.3,.45)});
  s+=fade(seg(p,.5,.65),label('左右に 往復',G.cx,G.sy+50,{size:26,color:'#c9a46a',anchor:'middle',weight:700}));
  return s;
 },
 [K+'c3']:(p)=>{
  const th=50*PI/180;const [x,y]=PT(th);
  let s=circ({th,rad:1,ang:seg(p,.05,.2)})+shadow({th});
  s+=fade(seg(p,.05,.2),label('ωt',G.cx+62,G.cy-8,{size:26,color:C.E,weight:700}));
  s+=fade(seg(p,.35,.5),line(G.cx,G.cy+4,x,G.cy+4,{color:C.x,w:5})+line(x,G.cy,x,y,{color:C.dim,w:2,dash:'5 5'}));
  s+=fade(seg(p,.4,.55),line(G.cx,G.sy,x,G.sy,{color:C.x,w:5})+label('x',(G.cx+x)/2,G.sy+34,{size:26,color:C.x,anchor:'middle',weight:700}));
  s+=card(760,60,400,130,T2('x=A\\cos\\omega t',960,128,{size:44}),seg(p,.6,.75),C.x);
  s+=fade(seg(p,.7,.85),label('横の 成分 ＝ A cos ωt',960,240,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'c4']:(p)=>{
  const u=seg(p,.05,.9),th=u*2*PI;
  let s=circ({th,proj:1,o:{...G,cx:330}})+shadow({th,o:{...G,cx:330}});
  const A=cosAxes(1,{x:690,y:260,w:420,h:110});s+=A.svg;
  s+=A.plot(t=>Math.cos(t*2*PI),{from:0,to:u,color:C.x,w:4,steps:120});
  s+=fade(seg(p,.6,.75),label('cos の グラフ',900,420,{size:30,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),line(A.X(1),A.Y(0)-8,A.X(1),A.Y(0)+8,{color:C.t,w:3})+label('1周',A.X(1),A.Y(0)+36,{size:22,color:C.t,anchor:'middle'}));
  return s;
 },
 [K+'c5']:(p)=>{
  const th=50*PI/180;
  let s=circ({th,acc:seg(p,.3,.45),proj:0});
  s+=card(760,50,400,190,label('円運動の 加速度',960,95,{size:26,color:C.dim,anchor:'middle'})+T2('\\dfrac{v^2}{r}',960,185,{size:48}),seg(p,.4,.55),C.a);
  s+=fade(seg(p,.2,.35),label('中心向き',G.cx+80,G.cy+160,{size:26,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'c6']:(p)=>{
  let s=T2('\\dfrac{v^2}{r}',260,110,{size:46});
  s+=fade(seg(p,.1,.25),label('v ＝ rω を 入れる',600,215,{size:26,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.2,.35),T2('=\\dfrac{(r\\omega)^2}{r}',500,120,{size:46}));
  s+=fade(seg(p,.45,.6),T2('=r\\omega^2',780,115,{size:46}));
  s+=card(380,260,440,120,T2('A\\omega^2',600,325,{size:56}),seg(p,.7,.85),C.a);
  s+=fade(seg(p,.7,.85),label('半径 A の 円',600,430,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'c7']:(p)=>{
  const th=50*PI/180;
  let s=circ({th,acc:1,proj:0,rad:seg(p,.4,.55)});
  s+=fade(seg(p,.05,.2),label('加速度：点 → 中心',960,120,{size:28,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),label('半径の 矢印：中心 → 点',960,180,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('逆向き',960,250,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'c8']:(p)=>{
  const th=50*PI/180;
  let s=circ({th,acc:1,proj:0,rad:1});
  s+=card(740,70,420,190,label('長さ：A の ω² 倍',950,125,{size:28,color:C.a,anchor:'middle',weight:700})+fade(seg(p,.4,.55),label('加速度 ＝ 半径の 矢印 を',950,180,{size:24,color:C.ink,anchor:'middle'})+label('逆向きに して ω² 倍',950,220,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2),C.a);
  return s;
 },
 [K+'c9']:(p)=>{
  const th=50*PI/180;const [x,y]=PT(th);
  let s=circ({th,acc:.35,rad:1})+shadow({th});
  s+=fade(seg(p,.15,.3),line(G.cx,G.cy+4,x,G.cy+4,{color:C.x,w:5})+line(x,G.cy,x,y,{color:C.dim,w:2,dash:'5 5'})+label('x',(G.cx+x)/2,G.cy+34,{size:26,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),line(G.cx,G.sy,x,G.sy,{color:C.x,w:5})+label('影の 位置 x',(G.cx+x)/2,G.sy+38,{size:24,color:C.x,anchor:'middle',weight:700}));
  s+=card(760,60,400,110,label('半径の 横の 成分 ＝ x',960,128,{size:28,color:C.x,anchor:'middle',weight:700}),seg(p,.6,.75),C.x);
  return s;
 },
 [K+'c10']:(p)=>{
  const th=50*PI/180;const [x,y]=PT(th),L=.75,ax=x+(G.cx-x)*L,ay=y+(G.cy-y)*L;
  let s=circ({th,acc:1,rad:.4})+shadow({th});
  s+=fade(seg(p,.1,.25),arrow(x,y,ax,y,{color:C.a,w:5,head:14})+line(ax,y,ax,ay,{color:C.a,w:2,dash:'5 5'}));
  s+=fade(seg(p,.2,.35),label('横の 成分',(x+ax)/2,y-16,{size:22,color:C.a,anchor:'middle',weight:700}));
  s+=card(760,60,400,150,label('加速度の 横の 成分',960,110,{size:26,color:C.a,anchor:'middle'})+T2('-\\omega^2 x',960,170,{size:50}),seg(p,.4,.55),C.a);
  s+=fade(seg(p,.7,.85),label('x を 逆向きに して ω² 倍',960,260,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'c11']:(p)=>{
  const th=50*PI/180+seg(p,.05,.95)*1.4*PI;const [x]=PT(th);
  let s=circ({th,acc:1})+shadow({th});
  const ax=-(x-G.cx)*.75;
  if(Math.abs(ax)>6)s+=arrow(x,G.sy-24,x+ax,G.sy-24,{color:C.a,w:5,head:Math.min(14,Math.abs(ax)*.6)});
  s+=card(760,60,400,150,label('影の 加速度',960,110,{size:26,color:C.dim,anchor:'middle'})+T2('a=-\\omega^2 x',960,170,{size:48}),seg(p,.3,.45),C.a);
  s+=fade(seg(p,.05,.2),label('横の 動き だけ',960,280,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 // ================= S4 ばねと影を重ねる =================
 [K+'m1']:(p)=>{
  let s=card(80,90,480,200,label('ばね',320,140,{size:28,color:C.F,anchor:'middle',weight:700})+T2('a=-\\dfrac{k}{m}\\,x',320,225,{size:48}),seg(p,0,.15),C.F);
  s+=card(640,90,480,200,label('円運動の 影',880,140,{size:28,color:C.p,anchor:'middle',weight:700})+T2('a=-\\omega^2\\,x',880,225,{size:48}),seg(p,.2,.35),C.p);
  s+=fade(seg(p,.6,.75),label('同じ 形',600,380,{size:38,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'m2']:(p)=>{
  let s=fade(.5,T2('a=-\\dfrac{k}{m}\\,x',320,100,{size:40})+T2('a=-\\omega^2\\,x',880,100,{size:40}));
  s+=card(380,180,440,110,T2(W+'^2=\\dfrac{k}{m}',600,238,{size:50}),seg(p,.1,.25),C.p);
  s+=card(380,330,440,120,T2(W+'=\\sqrt{\\dfrac{k}{m}}',600,392,{size:50}),seg(p,.6,.75),C.p);
  return s;
 },
 [K+'m3']:(p)=>{
  let s=card(250,60,700,120,T2(W+'=\\sqrt{100}=10\\ \\mathrm{rad/s}',600,122,{size:46}),seg(p,0,.15),C.p);
  s+=card(300,260,600,120,label('角振動数',600,312,{size:38,color:C.p,anchor:'middle',weight:700})+label('（単振動の ω）',600,358,{size:24,color:C.dim,anchor:'middle'}),seg(p,.55,.7),C.p);
  return s;
 },
 [K+'m4']:(p)=>{
  let s=circ({th:0,proj:1})+shadow({th:0,lineG:.5})+sbox({x:.1});
  s+=fade(seg(p,.1,.25),label('右端・速度 0',G.cx+G.R+30,G.by-50,{size:24,color:C.v,weight:700}));
  s+=card(800,60,360,150,label('出発の 位置も',980,115,{size:28,color:C.ink,anchor:'middle'})+label('速度も 同じ',980,170,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'m5']:(p)=>{
  const th=seg(p,.05,.95)*2.5*PI;
  let s=circ({th,proj:1})+shadow({th,lineG:.5})+sbox({x:.1*Math.cos(th)});
  s+=fade(seg(p,.4,.55),line(G.cx+G.R*Math.cos(th),G.sy,G.cx+G.R*Math.cos(th),G.by-30,{color:C.hi,w:2,dash:'5 6'}));
  s+=card(800,60,360,110,label('ぴったり 重なる',980,128,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'m6']:(p)=>{
  const th=p*2*PI;
  let s=circ({th,proj:1})+shadow({th,lineG:.5})+sbox({x:.1*Math.cos(th)});
  s+=card(800,60,360,170,label('単振動 ＝ 円運動の 影',980,110,{size:26,color:C.hi,anchor:'middle',weight:700})+T2('x=A\\cos\\omega t',980,185,{size:42}),seg(p,.05,.2),C.hi);
  return s;
 },
 // ================= S5 周期 =================
 [K+'p1']:(p)=>{
  const u=seg(p,.05,.85),th=u*2*PI;
  let s=circ({th,proj:1,ang:1})+shadow({th});
  s+=card(780,60,380,110,label('影 1往復 ＝ 点 1周',970,128,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'p1b']:(p)=>{
  const th=2*PI*seg(p,0,.6);
  let s=circ({th,proj:1,ang:1})+shadow({th});
  s+=card(780,40,380,270,label('1周 ＝ 2π',970,95,{size:30,color:C.E,anchor:'middle',weight:700})+fade(seg(p,.2,.35),label('毎秒 ω ずつ 進む',970,145,{size:26,color:C.p,anchor:'middle'}))+fade(seg(p,.6,.75),T2(TT+'=\\dfrac{2\\pi}{'+W+'}',970,235,{size:48})),seg(p,0,.15),C.t);
  return s;
 },
 [K+'p2']:(p)=>{
  let s=T2(TT+'=\\dfrac{2\\pi}{'+W+'}',360,110,{size:48});
  s+=fade(seg(p,.1,.25),label('ω ＝ √(k/m) を 入れる',820,110,{size:26,color:C.hi,anchor:'middle'}));
  s+=card(330,220,540,150,T2(TT+'=2\\pi\\div\\sqrt{\\dfrac{k}{m}}',600,295,{size:50}),seg(p,.35,.5),C.t);
  return s;
 },
 [K+'p3']:(p)=>{
  let s=T2(TT+'=2\\pi\\div\\sqrt{\\dfrac{k}{m}}',600,90,{size:42});
  s+=fade(seg(p,.05,.2),label('分数で 割る ＝ ひっくり返して 掛ける',600,180,{size:26,color:C.hi,anchor:'middle'}));
  s+=card(360,230,480,150,T2(TT+'=2\\pi\\sqrt{\\dfrac{m}{k}}',600,305,{size:56}),seg(p,.35,.5),C.t);
  s+=tag('導いた 結果',600,440,{g:seg(p,.7,.85)});
  return s;
 },
 [K+'p4']:(p)=>{
  let s=T2(TT+'=2\\pi\\sqrt{\\dfrac{1.0}{100}}',600,90,{size:44,auto:false});
  s+=fade(seg(p,.3,.45),T2('=2\\pi\\times 0.10',600,210,{size:44,auto:false}));
  s+=card(400,280,400,110,T2('\\approx 0.63\\ \\mathrm{s}',600,340,{size:52,auto:false,color:C.t}),seg(p,.6,.75),C.t);
  return s;
 },
 [K+'p5']:(p)=>{
  let s=card(330,70,540,170,T2(TT+'=2\\pi\\sqrt{\\dfrac{m}{k}}',600,160,{size:56}),1,C.t);
  s+=fade(seg(p,.1,.25),label('振幅 A は？',600,320,{size:34,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),label('式の どこにも ない',600,390,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'p6']:(p)=>{
  const th=p*3.2*PI;
  const o1={...G,cx:430,by:170,wall:170},o2={...G,cx:430,by:400,wall:170};
  let s=sbox({x:.1*Math.cos(th),o:o1})+sbox({x:.04*Math.cos(th),o:o2});
  s+=fade(seg(p,.05,.2),label('振幅 0.10 m',760,178,{size:26,color:C.x,weight:700})+label('振幅 0.04 m',760,408,{size:26,color:C.x,weight:700}));
  s+=card(960,230,210,80,label('T ≈ 0.63 s',1065,282,{size:30,color:C.t,anchor:'middle',weight:700}),seg(p,.3,.45),C.t);
  s+=fade(seg(p,.5,.65),label('同時に 戻る',1065,360,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'p7']:(p)=>{
  const th=p*2*PI;
  const o1={...G,cx:430,cy:150,R:120},o2={...G,cx:430,cy:150,R:48};
  let s=circ({th,o:o1,proj:0,plate:0})+circ({th,o:o2,proj:0,plate:0});
  s+=card(720,60,440,200,label('大きい 円：道のり 長い',940,120,{size:26,color:C.x,anchor:'middle',weight:700})+label('でも 速さも 大きい',940,170,{size:26,color:C.v,anchor:'middle',weight:700})+label('1周の 時間は 同じ',940,225,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.35),C.hi);
  s+=fade(seg(p,.5,.65),label('同じ ω で 回る',430,360,{size:28,color:C.p,anchor:'middle',weight:700}));
  return s;
 },
 ...Object.fromEntries([['p8',0],['p9',1]].map(([k,st])=>[K+k,(p)=>{
  const rows=[['1.0','100','0.63'],['1.0','400','0.31'],['4.0','100','1.26']];
  const cols=[{h:'m [kg]',color:C.ink,w:170},{h:'k [N/m]',color:C.F,w:190},{h:'T [s]',color:C.t,w:170}];
  const rv=st?[1,1,seg(p,.05,.2)]:[seg(p,0,.1),seg(p,.4,.55),0];
  let s=table({x:100,y:90,cols,rows,reveal:rv,hl:st?[2]:[1],rh:72,size:32});
  s+=card(760,90,400,120,label(st?'m を 4倍':'k を 4倍',960,138,{size:28,color:st?C.ink:C.F,anchor:'middle',weight:700})+label(st?'→ T は 2倍':'→ T は 半分',960,188,{size:32,color:C.t,anchor:'middle',weight:700}),seg(p,st?.25:.55,st?.4:.7),C.t);
  if(st)s+=card(760,260,400,140,label('重い → ゆっくり',960,315,{size:28,color:C.ink,anchor:'middle',weight:700})+label('硬い ばね → 速い',960,365,{size:28,color:C.F,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  else s+=fade(seg(p,.7,.85),label('√(1/4) ＝ 1/2',960,280,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 }])),
 [K+'chk']:(p)=>{
  const th=PI/2;
  let s=circ({th,proj:1})+shadow({th});
  const [x,y]=PT(th);
  s+=arrow(x,y,x-110,y,{color:C.v,w:5,head:16,g:seg(p,.1,.25)});
  s+=arrow(G.cx,G.sy-22,G.cx-110,G.sy-22,{color:C.v,w:5,head:16,g:seg(p,.2,.35)});
  s+=card(740,50,430,110,T2('A\\omega=0.10\\times 10=1.0\\ \\mathrm{m/s}',955,105,{size:32,auto:false}),seg(p,.3,.45),C.v);
  s+=card(740,200,430,130,label('前回：エネルギーから',955,250,{size:26,color:C.dim,anchor:'middle'})+label('中心の 速さ 1.0 m/s',955,300,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 // ================= S6 =================
 [K+'ans']:(p)=>{
  let s=card(280,60,640,180,T2(TT+'=2\\pi\\sqrt{\\dfrac{m}{k}}',600,150,{size:56}),seg(p,0,.15),C.t);
  s+=fade(seg(p,.3,.45),label('m と k で 決まる',600,320,{size:34,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('振幅には よらない',600,390,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'mis']:(p)=>{
  const th=p*2*PI;
  let s=circ({th,proj:1})+shadow({th,lineG:.5})+sbox({x:.1*Math.cos(th)});
  s+=card(780,50,390,160,label('よくある 間違い',975,100,{size:26,color:C.a,anchor:'middle',weight:700})+label('円運動と ばねは 別物',975,160,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=fade(seg(p,.25,.35),line(810,150,1140,170,{color:C.a,w:4}));
  s+=card(780,260,390,90,label('同じ a ＝ −ω²x',975,315,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'univ']:(p)=>{
  let s=card(250,90,700,150,T2('a=-\\dfrac{k}{m}\\,x',600,170,{size:52}),seg(p,0,.15),C.a);
  s+=fade(seg(p,.35,.5),label('大学編：微分方程式 として 解く',600,330,{size:32,color:C.dim,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next']:(p)=>{
  const ang=.35*Math.cos(p*2.4*PI),px=600,py=60,L=300;
  const bx=px+L*Math.sin(ang),by=py+L*Math.cos(ang);
  let s=line(px-120,py,px+120,py,{color:C.dim,w:4})+line(px,py,bx,by,{color:C.ink,w:2})+line(px,py,px,py+L+30,{color:C.faint,w:1.5,dash:'5 6'})+ball(bx,by,{r:22});
  s+=card(780,140,380,160,label('振り子にも',970,200,{size:28,color:C.ink,anchor:'middle'})+label('ずれに 比例して 戻す 力？',970,260,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.35),C.hi);
  return s;
 },
 [K+'bye']:(p)=>{
  let s=card(200,110,800,230,label('次の回',600,175,{size:28,color:C.dim,anchor:'middle'})+label('振り子の 周期',600,265,{size:46,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  s+=fade(seg(p,.5,.7),label('単振動・深く学ぶ 3/3 へ',1080,470,{size:26,color:C.dim,anchor:'end'}));
  return s;
 },
};

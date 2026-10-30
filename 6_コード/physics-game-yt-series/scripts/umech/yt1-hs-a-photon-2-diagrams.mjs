// 高校編「光子と電子・深く学ぶ 2/3」(ys-hs-a-photon-2) — 図。Stage 1200×515.
// 色は 1/3 と同じ：hν の棒 橙、W₀（出るための費用）灰、Kmax（残り）薄い橙、振動数 ν 桃、光子 黄、電子 青。
// 補助線①エネルギーの家計簿（hν を W₀ と残りに分ける）、②Kmax–ν グラフ（ν₀ から傾き h、別の金属は平行）。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,poly,axes,clamp,mix} from './anim.mjs';
import {card,tag,sceneT,tSince,electron,NEG,EC,NC,LC,PH,W0C,KC,RED,UV,GRN,WHITE,cs,Et,nut,ht,Wt,Kt,n0t,U,TX,P10,H_,E19,bigL,
 metal,wavy,photon,emit,source,ebar,stepBlock,base,cross,check,counter,cl} from './yt1-hs-a-photon-1-diagrams.mjs';

const K='hs-a-photon-2:';
const PI=Math.PI;
const hn=`${ht}${nut}`, hn0=`${ht}${n0t}`;
// ---- the energy budget: a stacked bar (W₀ below, remainder above) ------------------------------------
// x centre, base y, values in eV, k px/eV
function budget(x,b0,hv,w0,k,{w=110,g=1,extra=0,labels=1,kcol=KC,kText='',wText=''}={}){
 const r=Math.max(0,hv-w0-extra);let s='';
 s+=rect(x-w/2,b0-w0*k,w,w0*k,{fill:W0C,fo:.4,stroke:W0C,sw:2.5,rx:4});
 if(extra>0)s+=rect(x-w/2,b0-(w0+extra)*k,w,extra*k,{fill:'#5b6780',fo:.6,stroke:W0C,sw:2,rx:4});
 if(r>0.01)s+=rect(x-w/2,b0-(w0+extra+r)*k,w,r*k,{fill:kcol,fo:.55,stroke:kcol,sw:2.5,rx:4});
 if(labels){s+=label(wText||'費用',x+w/2+14,b0-w0*k/2+9,{size:26,color:W0C,weight:700});
  if(extra>0)s+=label('余分',x+w/2+14,b0-(w0+extra/2)*k+9,{size:24,color:C.dim,weight:700});
  if(r>0.01)s+=label(kText||'残り',x+w/2+14,b0-(w0+extra+r/2)*k+9,{size:26,color:kcol,weight:700});}
 return fade(g,s);
}
// formula card shorthand
const fc=(x,y,w,h,src,{g=1,size=46,col=C.hi}={})=>card(x,y,w,h,TX(src,x+w/2,y+h/2+size*.3,{size}),g,col);
const KEQ=`${Kt}=${hn}-${Wt}`;
// ---- graph -------------------------------------------------------------------------------------------
const GR={x:150,y:440,w:800,h:340,xmax:12,ymax:3};
const gx=v=>GR.x+GR.w*v/GR.xmax, gy=e=>GR.y-GR.h*e/GR.ymax;
const SLOPE=0.4125; // eV per 10^14 Hz  (6.6e-34×1e14/1.6e-19)
function gAxes(g=1){
 let s=axes({x:GR.x,y:GR.y,w:GR.w,h:GR.h,xmax:GR.xmax,ymax:GR.ymax,xticks:[],yticks:[],g,xcolor:NC,ycolor:KC}).svg;
 s+=fade(g,TX(`${nut}`,GR.x+GR.w+62,GR.y+12,{size:40})+TX(Kt,GR.x-62,GR.y-GR.h-24,{size:38})+label('（eV）',GR.x+20,GR.y-GR.h-22,{size:22,color:C.dim}));
 return s;
}
function kLine(n0,{g=1,color=KC,p=1,w=5,zero=1}={}){
 const x0=gx(n0),x1=gx(GR.xmax),y1=gy(SLOPE*(GR.xmax-n0));let s='';
 if(zero)s+=line(GR.x,GR.y-3,x0,GR.y-3,{color,w});
 s+=draw([[x0,GR.y],[mix(x0,x1,p),mix(GR.y,y1,p)]],1,{color,w});
 return fade(g,s);
}
const n0mark=(n0,{g=1,text=true,lab=n0t}={})=>fade(g,line(gx(n0),GR.y-10,gx(n0),GR.y+10,{color:NC,w:3})+(text?TX(lab,gx(n0),GR.y+44,{size:34}):''));
function graph(p,k){
 let s=gAxes(k===0?seg(p,0,.2):1);
 if(k>=1)s+=n0mark(5.6,{g:k===1?seg(p,0,.15):1})+kLine(5.6,{p:k===1?seg(p,.35,.75):1});
 if(k===1)s+=fade(seg(p,.1,.3),label('出ない → 0',gx(2.8),GR.y-20,{size:26,color:C.dim,anchor:'middle',weight:700}))+fade(seg(p,.6,.8),TX(KEQ,gx(9.3),gy(2.7),{size:34}));
 if(k===2){s+=fade(seg(p,.1,.3),line(gx(10),GR.y,gx(10),gy(1.8),{color:UV,w:2,dash:'6 6'})+line(GR.x,gy(1.8),gx(10),gy(1.8),{color:KC,w:2,dash:'6 6'})+dot(gx(10),gy(1.8),11,C.hi)+TX(`${P10('1.0','15')}${U('Hz')}`,gx(10),GR.y+44,{size:28,color:UV})+label('1.8',GR.x-14,gy(1.8)+9,{size:26,color:KC,anchor:'end',weight:700}));}
 if(k>=3){const a=7.5,b=9.5;s+=fade(k===3?seg(p,.1,.35):.6,poly([[gx(a),gy(SLOPE*(a-5.6))],[gx(b),gy(SLOPE*(a-5.6))],[gx(b),gy(SLOPE*(b-5.6))]],{fill:C.hi,fo:.15,stroke:C.hi,sw:2.5}));
  s+=fade(k===3?seg(p,.3,.5):.6,label('傾き ＝',gx(5.4),gy(1.5),{size:30,color:C.ink,weight:700})+TX(ht,gx(5.4)+120,gy(1.5)+2,{size:38}));}
 if(k>=4){s+=n0mark(8.0,{g:k===4?seg(p,.2,.35):1,lab:cs(NC,"\\nu_0'")})+kLine(8.0,{g:k===4?seg(p,.2,.35):1,p:k===4?seg(p,.3,.6):1,color:'#ffb0e0',zero:0});
  s+=fade(k===4?seg(p,.6,.75):1,label('別の 金属',gx(12)+14,gy(SLOPE*4)+10,{size:26,color:'#ffb0e0',weight:700})+label('平行',gx(10.2),gy(1.35),{size:30,color:C.hi,weight:700}));}
 if(k===5)s+=card(300,40,360,110,label('どの 金属でも',480,85,{size:26,color:C.ink,anchor:'middle',weight:700})+label('傾きは 同じ h',480,130,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi)+tag('実験で 確かめられた',800,95,{color:C.dim,g:seg(p,.5,.65)});
 return s;
}
// ---- brightness panels -------------------------------------------------------------------------------
function panel(x,t,{n=2,col=UV,txt='',g=1,ecount=null,emitOn=1,bar=0}={}){
 let s=metal(x+30,400,440,{text:''});
 for(let i=0;i<n;i++)s+=wavy(x+40+i*34,80,x+150+i*40,390,{color:col,ph:t*1.2,w:3,amp:6});
 if(emitOn){const e=emit(t,{x0:x+260,x1:x+430,y:400,n:n+1,period:1.6,start:0});s+=e.svg;}
 s+=label(txt,x+250,480,{size:28,color:C.ink,anchor:'middle',weight:700});
 if(bar)s+=fade(bar,ebar(x+30,360,1.8,50,{w:40,stroke:KC,fill:KC,top:'1.8 eV',tcol:KC}));
 return fade(g,s);
}

export const hsAPhoton2Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s=metal(150,420,600,{text:'金属',g:seg(p,0,.15)});
  s+=wavy(200,90,380,410,{color:UV,ph:t*1.2,g:seg(p,0,.15)});
  s+=fade(seg(p,.3,.45),electron(560,300,{r:16})+arrow(580,288,700,210,{color:NEG,w:4,head:14}));
  s+=bigL('エネルギーは？',820,200,{size:32,color:C.hi,g:seg(p,.5,.65)});
  return s;
 },
 [K+'q2']:(p,ctx)=>{
  let s=hsAPhoton2Diagrams[K+'q'](1,ctx);
  s+=card(760,300,400,120,label('明るくすると',960,350,{size:30,color:C.ink,anchor:'middle',weight:700})+label('何が 変わる？',960,400,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.2),C.hi);
  return s;
 },
 [K+'recall']:(p,ctx)=>{
  let s=fc(380,40,440,120,`${Et}=${hn}`,{g:seg(p,0,.15),size:60,col:EC});
  const u=lin(p,.45,.8);s+=metal(100,400,1000,{text:'',g:seg(p,.4,.5)})+electron(700,380,{r:16,op:seg(p,.4,.5)});
  if(u<1)s+=fade(seg(p,.4,.5),photon(mix(260,680,u),mix(220,370,u))+ebar(mix(260,680,u),mix(195,345,u),1.8,50,{w:34}));
  s+=ebar(760,385,1.8,50,{w:34,g:seg(p,.8,.9)})+bigL('丸ごと 受け取る',600,240,{size:30,color:C.hi,g:seg(p,.8,.9)});
  return s;
 },
 [K+'plan']:(p)=>{
  let s=bigL('エネルギーの 家計簿',600,60,{size:36,color:C.hi,g:seg(p,0,.15)});
  s+=budget(600,450,4.1,2.3,80,{g:seg(p,.3,.5),labels:0});
  s+=fade(seg(p,.3,.5),label('？',600,280,{size:40,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S2 仕事関数と家計簿 =================
 [K+'w0']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s='';
  s+=fade(seg(p,0,.15),rect(150,230,900,240,{fill:'#8795ad',fo:.22,stroke:C.dim,sw:3,rx:6})+label('金属の 中',200,440,{size:28,color:C.dim,weight:700})+label('外',1000,140,{size:30,color:C.dim,weight:700}));
  for(let i=0;i<9;i++){const x=220+i*95+12*Math.sin(t*1.3+i),y=370+((i*53)%60)-10+8*Math.cos(t*1.1+i*2);s+=electron(x,y,{r:13,op:seg(p,0,.15)});}
  const g=seg(p,.35,.55),ex=560,ey=mix(250,200,0.5+0.5*Math.sin(t*2));
  s+=fade(g,electron(ex,ey,{r:15})+arrow(ex,ey+24,ex,ey+80,{color:C.F,w:5,head:16})+label('引き戻される',ex+40,ey+60,{size:26,color:C.F,weight:700}));
  s+=card(760,40,400,110,label('出るには エネルギーを',960,85,{size:26,color:C.ink,anchor:'middle',weight:700})+label('払う 必要がある',960,128,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'w0def']:(p)=>{
  const b0=440,k=80;let s=base(60,1140,b0,seg(p,0,.15))+stepBlock(640,1100,b0,2.3,k,{g:seg(p,0,.2),x0:100});
  s+=electron(560,b0-18,{r:15,op:seg(p,0,.2)})+label('金属の 中',300,b0+40,{size:26,color:C.dim,weight:700,anchor:'middle'})+label('外',870,b0+40,{size:26,color:C.dim,weight:700,anchor:'middle'});
  s+=fade(seg(p,.2,.4),arrow(600,b0,600,b0-2.3*k,{color:W0C,w:4,head:14})+arrow(600,b0-2.3*k,600,b0,{color:W0C,w:4,head:14})+TX(Wt,530,b0-2.3*k/2+12,{size:44}));
  s+=card(150,40,560,110,label('出るのに 必要な 最小の エネルギー',430,85,{size:26,color:C.ink,anchor:'middle',weight:700})+label('仕事関数',360,130,{size:30,color:W0C,anchor:'middle',weight:700})+TX(Wt,500,132,{size:40}),seg(p,.4,.6),W0C);
  s+=tag('定義',790,95,{color:C.hi,g:seg(p,.6,.75)});
  return s;
 },
 [K+'w0val']:(p)=>{
  const b0=440,k=80;let s=base(60,1140,b0)+stepBlock(640,1100,b0,2.3,k,{x0:100,text:'2.3 eV'});
  s+=electron(560,b0-18,{r:15})+arrow(600,b0,600,b0-2.3*k,{color:W0C,w:4,head:14})+arrow(600,b0-2.3*k,600,b0,{color:W0C,w:4,head:14})+TX(Wt,530,b0-2.3*k/2+12,{size:44});
  s+=bigL('前回の 段',870,b0-2.3*k-22,{size:26,color:W0C,g:seg(p,0,.2)});
  s+=card(150,40,500,100,label('値は 金属ごとに 違う',400,102,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'book']:(p)=>{
  const b0=450,k=80;let s=base(100,1100,b0);
  s+=ebar(300,b0,4.1,k,{w:110,top:'',g:seg(p,0,.15)})+fade(seg(p,0,.15),TX(hn,300,b0-4.1*k-18,{size:38})+label('収入',300,b0+38,{size:28,color:EC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.25,.4),arrow(380,b0-2*k,560,b0-2*k,{color:C.dim,w:4,head:16}));
  s+=budget(700,b0,4.1,2.3,k,{g:seg(p,.35,.5),labels:0});
  s+=fade(seg(p,.35,.5),TX(Wt,820,b0-2.3*k/2+12,{size:38})+label('出るための 費用',880,b0-2.3*k/2+10,{size:26,color:W0C,weight:700}));
  s+=fade(seg(p,.65,.8),label('残り：飛び出した 電子の',780,b0-3.2*k,{size:26,color:KC,weight:700})+label('運動エネルギー',780,b0-3.2*k+34,{size:26,color:KC,weight:700}));
  return s;
 },
 [K+'deep']:(p)=>{
  const b0=450,k=80;let s=base(100,1100,b0);
  s+=budget(330,b0,4.1,2.3,k,{labels:0})+label('表面の 電子',330,b0+38,{size:26,color:C.ink,anchor:'middle',weight:700});
  s+=budget(730,b0,4.1,2.3,k,{g:seg(p,.2,.4),extra:.8,labels:0})+fade(seg(p,.2,.4),label('奥の 電子',730,b0+38,{size:26,color:C.ink,anchor:'middle',weight:700})+label('さらに 失う',800,b0-2.7*k+8,{size:24,color:C.dim,weight:700}));
  s+=fade(seg(p,.55,.75),label('残りが 少ない',800,b0-3.6*k+8,{size:26,color:KC,weight:700}));
  s+=fade(1,label('費用',400,b0-1.15*k+8,{size:24,color:W0C,weight:700}));
  return s;
 },
 [K+'max']:(p)=>{
  const b0=450,k=80;let s=base(100,1100,b0);
  s+=budget(330,b0,4.1,2.3,k,{labels:0})+label('表面の 電子',330,b0+38,{size:26,color:C.ink,anchor:'middle',weight:700});
  s+=fade(.45,budget(730,b0,4.1,2.3,k,{extra:.8,labels:0})+label('奥の 電子',730,b0+38,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.3),rect(262,b0-4.1*k-10,136,1.8*k+10,{fill:'none',fo:0,stroke:C.hi,sw:4,rx:8})+label('残りが 一番 大きい',420,b0-3.6*k,{size:26,color:C.hi,weight:700}));
  s+=fade(seg(p,.55,.75),TX(Kt,470,b0-3.0*k+14,{size:44}));
  s+=fade(1,TX(Wt,450,b0-1.15*k+12,{size:36}));
  return s;
 },
 [K+'eq']:(p)=>{
  let s=fc(200,40,800,120,`${hn}=${Wt}+${Kt}`,{g:seg(p,0,.15),col:EC});
  s+=tag('エネルギー保存',1080,40,{color:C.dim,g:seg(p,0,.15)});
  s+=fade(seg(p,.35,.5),TX(`-${Wt}\\qquad\\qquad -${Wt}`,600,230,{size:34,color:W0C}));
  s+=fc(250,280,700,120,KEQ,{g:seg(p,.6,.75),col:KC,size:52});
  s+=tag('導いた 結果',600,460,{color:C.hi,g:seg(p,.8,.9)});
  return s;
 },
 [K+'num']:(p)=>{
  const b0=460,k=70;let s=base(60,640,b0);
  s+=budget(250,b0,4.1,2.3,k,{g:seg(p,0,.15),labels:0});
  s+=fade(seg(p,0,.15),label('4.1 eV',250,b0-4.1*k-14,{size:28,color:EC,anchor:'middle',weight:700})+label('2.3',330,b0-1.15*k+9,{size:26,color:W0C,weight:700})+label('1.8',330,b0-3.2*k+9,{size:26,color:KC,weight:700})+label('紫外線の 光子',250,b0+36,{size:24,color:UV,anchor:'middle',weight:700}));
  s+=fc(560,150,600,130,`${Kt}=4.1-2.3=${cs(KC,'1.8'+U('eV'))}`,{g:seg(p,.4,.6),col:KC,size:42});
  return s;
 },
 [K+'numj']:(p)=>{
  let s=fade(.45,hsAPhoton2Diagrams[K+'num'](1));
  s+=cl(`1.8\\times ${E19}\\approx ${cs(KC,P10('2.9','-19')+U('J'))}`,560,370,seg(p,.1,.3),{size:38});
  return s;
 },
 [K+'mis1']:(p)=>{
  let s=fc(250,60,700,120,`${Kt}=${hn}`,{g:seg(p,0,.15),col:C.a,size:52})+cross(600,120,{s:60,g:seg(p,.3,.45)});
  s+=fc(250,280,700,120,KEQ,{g:seg(p,.55,.7),col:KC,size:52});
  s+=bigL('費用を 先に 払う',600,460,{size:30,color:W0C,g:seg(p,.7,.85)});
  return s;
 },
 // ================= S3 限界振動数 =================
 [K+'edge']:(p)=>{
  const b0=460,k=80;const hv=mix(4.1,2.3,seg(p,.15,.7));let s=base(60,700,b0);
  s+=budget(300,b0,hv,2.3,k,{labels:0});
  s+=TX(hn,300,b0-hv*k-18,{size:36})+label('振動数を 下げる',520,120,{size:28,color:NC,weight:700})+arrow(500,140,500,260,{color:NC,w:4,head:14});
  s+=fade(seg(p,.7,.85),line(200,b0-2.3*k,420,b0-2.3*k,{color:C.hi,w:4})+TX(`${Kt}=0`,560,b0-2.3*k+12,{size:42}));
  s+=fade(seg(p,.8,.95),label('ぎりぎり 飛び出す',820,b0-2.3*k+60,{size:28,color:C.hi,weight:700}));
  return s;
 },
 [K+'sub']:(p)=>{
  let s=TX(KEQ,600,90,{size:46});
  s+=fade(seg(p,.25,.45),TX(`${cs(KC,'0')}=${hn0}-${Wt}`,600,220,{size:50}));
  s+=fade(seg(p,.05,.25),label('ぎりぎり：ν を ν₀ に、Kmax を 0 に',600,160,{size:26,color:C.dim,anchor:'middle',weight:700}));
  return s;
 },
 [K+'div']:(p)=>{
  let s=fade(.5,TX(KEQ,600,90,{size:46}))+TX(`${cs(KC,'0')}=${hn0}-${Wt}`,600,220,{size:50});
  s+=fade(seg(p,.05,.2),label('両辺に W₀ を 足す',1000,300,{size:24,color:C.dim,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.3),TX(`${hn0}=${Wt}`,600,310,{size:50}));
  s+=fade(seg(p,.5,.65),label('両辺を h で 割る',1000,420,{size:24,color:C.dim,anchor:'middle',weight:700}));
  s+=fc(380,370,440,120,`${n0t}=\\dfrac{${Wt}}{${ht}}`,{g:seg(p,.55,.7),col:NC,size:46});
  return s;
 },
 [K+'name']:(p)=>{
  let s=fc(330,40,540,130,`${n0t}=\\dfrac{${Wt}}{${ht}}`,{col:NC,size:50});
  s+=bigL('限界振動数',600,220,{size:34,color:NC,g:seg(p,0,.2)});
  const b0=480,k=70;s+=budget(600,b0,2.3,2.3,k,{g:seg(p,.4,.6),labels:0})+fade(seg(p,.4,.6),TX(hn0,720,b0-1.15*k+10,{size:34})+label('＝',800,b0-1.15*k+10,{size:30,color:C.ink,weight:700})+TX(Wt,860,b0-1.15*k+12,{size:34}));
  return s;
 },
 [K+'n1']:(p)=>{
  let s=tag(`h の 単位は J·s → J に そろえる`,600,50,{color:C.dim,g:seg(p,0,.2),size:26});
  s+=cl(`${Wt}=2.3${U('eV')}=2.3\\times ${E19}\\approx ${cs(W0C,P10('3.7','-19')+U('J'))}`,120,160,seg(p,.4,.6),{size:40});
  return s;
 },
 [K+'n2']:(p)=>{
  let s=fade(.6,tag(`h の 単位は J·s → J に そろえる`,600,50,{color:C.dim,size:26}))+cl(`${Wt}=2.3${U('eV')}=2.3\\times ${E19}\\approx ${cs(W0C,P10('3.7','-19')+U('J'))}`,120,160,1,{size:40});
  s+=cl(`${n0t}=\\dfrac{${Wt}}{${ht}}=\\dfrac{${P10('3.7','-19')}}{${H_}}\\approx ${cs(NC,P10('5.6','14')+U('Hz'))}`,120,280,seg(p,.1,.35),{size:40});
  return s;
 },
 [K+'n3']:(p)=>{
  let s=fade(.6,hsAPhoton2Diagrams[K+'n2'](1));
  s+=cl(`${cs(LC,'\\lambda')}=\\dfrac{${cs(C.v,'c')}}{${n0t}}=\\dfrac{${P10('3.0','8')}}{${P10('5.6','14')}}\\approx ${cs(LC,P10('5.4','-7')+U('m'))}`,120,410,seg(p,.1,.35),{size:38});
  s+=fade(seg(p,.6,.75),dot(1050,400,20,GRN)+label('約540 nm（緑）',1050,460,{size:26,color:GRN,anchor:'middle',weight:700}));
  return s;
 },
 [K+'n4']:(p)=>{
  let s='';const y=260,X=v=>100+v*85; // v in 10^14 Hz, 0..12
  s+=fade(seg(p,0,.15),rect(X(0),y-70,X(5.6)-X(0),140,{fill:'#1b2a48',fo:.6,stroke:'none',rx:0})+rect(X(5.6),y-70,X(12)-X(5.6),140,{fill:'#2b3d22',fo:.45,stroke:'none',rx:0})+arrow(X(0),y+70,X(12),y+70,{color:NC,w:4,head:16})+line(X(5.6),y-100,X(5.6),y+80,{color:C.hi,w:4,dash:'10 8'}));
  s+=fade(seg(p,0,.15),TX(`${n0t}=${P10('5.6','14')}${U('Hz')}`,X(5.6),y-120,{size:34}));
  s+=fade(seg(p,.1,.3),dot(X(4.3),y+70,13,RED)+label('赤 4.3×10¹⁴',X(4.3),y+120,{size:24,color:RED,anchor:'middle',weight:700})+label('出ない',X(2.8),y+10,{size:32,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.7),dot(X(10),y+70,13,UV)+label('紫外線 1.0×10¹⁵',X(10),y+120,{size:24,color:UV,anchor:'middle',weight:700})+label('出る',X(8.8),y+10,{size:32,color:GRN,anchor:'middle',weight:700}));
  s+=tag('前回の 結果と 一致',1000,470,{color:C.hi,g:seg(p,.8,.9)});
  return s;
 },
 // ================= S4 グラフ =================
 [K+'g1']:(p)=>graph(p,0),
 [K+'g2']:(p)=>graph(p,1),
 [K+'g3']:(p)=>graph(p,2),
 [K+'g4']:(p)=>graph(p,3),
 [K+'g5']:(p)=>graph(p,4),
 [K+'g6']:(p)=>graph(p,5),
 // ================= S5 明るさ =================
 [K+'b1']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s=panel(40,t,{n:2,txt:'弱い 紫外線',emitOn:0,g:seg(p,0,.15)})+panel(640,t,{n:6,txt:'明るい 紫外線（同じ 振動数）',emitOn:0,g:seg(p,.2,.35)});
  s+=bigL('毎秒 届く 光子が 増える',600,40,{size:30,color:PH,g:seg(p,.6,.75)});
  return s;
 },
 [K+'b2']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s=panel(40,t,{n:2,txt:'弱い 紫外線'})+panel(640,t,{n:6,txt:'明るい 紫外線（同じ 振動数）'});
  s+=bigL('飛び出す 電子の 数が 増える',600,40,{size:30,color:NEG,g:seg(p,.4,.55)});
  return s;
 },
 [K+'b3']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s=panel(40,t,{n:2,txt:'弱い 紫外線',bar:seg(p,.05,.25)})+panel(640,t,{n:6,txt:'明るい 紫外線（同じ 振動数）',bar:seg(p,.05,.25)});
  s+=bigL('1個の Kmax は 同じ',600,40,{size:30,color:KC,g:seg(p,.3,.45)});
  return s;
 },
 [K+'b4']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s=metal(330,400,540,{text:''});
  for(let i=0;i<6;i++)s+=wavy(330+i*40,80,430+i*45,390,{color:RED,ph:t*1.2,w:6,amp:12});
  s+=bigL('とても 明るい 赤（ν₀ より 低い）',600,50,{size:28,color:RED,g:seg(p,0,.15)});
  s+=counter(900,180,0,{g:seg(p,.4,.55),w:240});
  return s;
 },
 [K+'mis2']:(p)=>{
  let s=card(200,60,800,110,label('明るくすると、電子が 速く 飛び出す',600,128,{size:32,color:C.a,anchor:'middle',weight:700}),seg(p,0,.15),C.a)+cross(600,115,{s:50,g:seg(p,.25,.4)});
  s+=card(200,260,800,160,label('電子の 速さ（Kmax）を 決めるのは',600,320,{size:30,color:C.ink,anchor:'middle',weight:700})+label('振動数',600,385,{size:38,color:NC,anchor:'middle',weight:700}),seg(p,.55,.7),NC);
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p)=>{
  let s=fc(150,60,620,130,KEQ,{g:seg(p,0,.15),col:KC,size:52});
  const b0=470,k=70;s+=budget(950,b0,4.1,2.3,k,{g:seg(p,.3,.5),kText:'Kmax',wText:'W₀'});
  return s;
 },
 [K+'ans2']:(p)=>{
  let s=fade(.35,fc(150,30,620,110,KEQ,{col:KC,size:46}));
  const row=(y,a,b,ca,cb,o)=>fade(o,label(a,330,y,{size:32,color:ca,anchor:'middle',weight:700})+arrow(460,y-10,640,y-10,{color:C.dim,w:4,head:14})+label(b,860,y,{size:32,color:cb,anchor:'middle',weight:700}));
  s+=card(150,190,900,260,'',seg(p,0,.15),C.hi);
  s+=row(280,'明るさ','電子の 数',C.ink,NEG,seg(p,.05,.25))+row(390,'振動数','1個の エネルギー',NC,KC,seg(p,.45,.65));
  return s;
 },
 [K+'next']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s='';
  // left: interference fringes
  s+=card(40,40,540,380,'',seg(p,0,.15));
  for(let y=70;y<390;y+=4){const I=Math.cos(PI*(y-230)/40)**2;s+=fade(seg(p,0,.15),rect(400,y,60,4.5,{fill:'#fff3b0',fo:.08+.85*I,stroke:'none',rx:0}));}
  s+=fade(seg(p,0,.15),rect(150,70,10,140,{fill:'#56627a',fo:1,stroke:'none',rx:2})+rect(150,226,10,8,{fill:'#56627a',fo:1,stroke:'none',rx:2})+rect(150,250,10,140,{fill:'#56627a',fo:1,stroke:'none',rx:2}));
  s+=bigL('干渉：波',310,460,{size:30,color:C.x,g:seg(p,0,.15)});
  // right: photon hitting electron
  s+=card(620,40,540,380,'',seg(p,.4,.55));
  s+=fade(seg(p,.4,.55),metal(680,330,420,{text:''})+electron(950,300,{r:15}));
  for(let i=0;i<3;i++){const x=700+((t*160+i*90)%240);s+=photon(x,150+(x-700)*.55,{g:seg(p,.4,.55)});}
  s+=bigL('光電効果：粒',890,460,{size:30,color:PH,g:seg(p,.45,.6)});
  return s;
 },
 [K+'next2']:(p,ctx)=>{
  let s=fade(.35,hsAPhoton2Diagrams[K+'next'](1,ctx));
  s+=card(250,120,700,110,label('どちらが 本当？',600,190,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  s+=card(250,290,700,110,label('原子が 出す 光の 色は 何で 決まる？',600,358,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'bye']:(p)=>card(330,170,540,150,label('次の 回',600,230,{size:30,color:C.dim,anchor:'middle'})+label('深く 学ぶ 3/3',600,290,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.2),C.hi),
};

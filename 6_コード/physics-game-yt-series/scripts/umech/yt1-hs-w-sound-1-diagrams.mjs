// 高校編「音波・深く学ぶ 1/3」(ys-hs-w-sound-1) — 図。Stage 1200×515.
// 色は波の基本と同じ：λ 水色、t・T 金、f 桃、v・V（音の速さ）紫、ずれ・A 白、印 黄、密 黄の帯。
// 音は縦波：空気の粒（点）は左右に往復するだけ。グラフは「粒の右へのずれ」を縦にとったもの（上下の運動ではない）。
// 2/3・3/3・要点でも使う部品は export する。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,poly,clamp,mix} from './anim.mjs';
import {card,tag,T2,sceneT,tSince,LC,TCOL,FC,VCOL,ROPE,MK,Lt,Tt,ft,HZ,MS,MM,SS} from './yt1-hs-w-basics-1-diagrams.mjs';
export {card,tag,T2,sceneT,tSince,LC,TCOL,FC,VCOL,ROPE,MK,Lt,Tt,ft,HZ,MS,MM,SS};

const K='hs-w-sound-1:';
const PI=Math.PI;
export const Vt=`{\\color{${VCOL}}V}`;
export const ACOL=C.ink;
// ---- air: a speaker on the left pushes rows of air particles ---------------------------------------
// AIR.lam: display wavelength (px) at m＝1; m multiplies the frequency (λ → lam/m). A: displacement (px).
export const AIR={x0:230,x1:1060,rows:[118,148,178,208,238],n:34,lam:300,A:14,T:1.6,mx:190,gy:400,gA:2.4};
const hash=(i,r)=>{const z=Math.sin(i*12.9898+r*78.233)*43758.5453;return z-Math.floor(z);};
// displacement (px, + ＝ right) of the particle at distance d from x0, phase ph (cycles)
export function airS(d,ph,{o=AIR,m=1,A=o.A,front=false}={}){const arg=ph-d*m/o.lam;if(front&&arg<0)return 0;return A*Math.sin(2*PI*arg);}
export function speaker(ph,{o=AIR,m=1,A=o.A,g=1,y0=100,y1=256}={}){
 const xm=o.mx+airS(0,ph,{o,m,A}),yc=(y0+y1)/2;
 let s=rect(o.mx-118,y0-6,62,y1-y0+12,{fill:'#26324a',fo:1,stroke:C.dim,sw:2,rx:8});
 s+=poly([[o.mx-56,yc-26],[o.mx-56,yc+26],[xm,y1],[xm,y0]],{fill:'#3a4a66',fo:.9,stroke:C.dim,sw:2});
 s+=line(xm,y0,xm,y1,{color:'#d6deec',w:7});
 return fade(g,s);
}
export function ear(x,y,{g=1}={}){
 const s=`<path d="M${x+22} ${y-44} C ${x-30} ${y-56}, ${x-38} ${y+6}, ${x-6} ${y+18} C ${x+8} ${y+24}, ${x+2} ${y+46}, ${x+22} ${y+44}" fill="none" stroke="#e9c7a6" stroke-width="7" stroke-linecap="round"/>`
  +`<path d="M${x+10} ${y-22} C ${x-10} ${y-20}, ${x-12} ${y+2}, ${x+4} ${y+6}" fill="none" stroke="#e9c7a6" stroke-width="5" stroke-linecap="round"/>`;
 return fade(g,s+label('耳',x+6,y+86,{size:24,color:C.dim,anchor:'middle'}));
}
// list of compression positions (px from x0) for the current phase
export function denseD(ph,{o=AIR,m=1,front=false}={}){
 const L=o.lam/m,out=[];for(let k=Math.floor(ph-(o.x1-o.x0)/L)-1;k<=Math.ceil(ph)+1;k++){const d=L*(ph-k);if(d<-5||d>o.x1-o.x0+5)continue;if(front&&d>L*ph-20)continue;out.push(d);}return out;
}
export function air(ph,{o=AIR,m=1,A=o.A,g=1,hl=-1,track=0,dense=0,sparse=0,spk=1,earG=0,graph=0,front=false,glab=1,press=0}={}){
 let s='';const L=o.lam/m;
 if(spk)s+=speaker(ph,{o,m,A,g});
 if(dense||sparse){for(const d of denseD(ph,{o,m,front})){const x=o.x0+d;
  if(dense)s+=fade(g*dense,rect(x-30,o.rows[0]-20,60,o.rows.at(-1)-o.rows[0]+40,{fill:C.hi,fo:.14,stroke:C.hi,sw:1.5,rx:10})+label(press?'密（圧力 高）':'密',x,o.rows[0]-32,{size:24,color:C.hi,anchor:'middle',weight:700}));
  const xr=x+L/2;if(sparse&&xr<o.x1&&(!front||d>L/2+10)&&xr>o.x0)s+=fade(g*sparse,label(press?'疎（低）':'疎',xr,o.rows[0]-32,{size:24,color:C.dim,anchor:'middle',weight:700}));}}
 o.rows.forEach((y,r)=>{for(let i=0;i<o.n;i++){const bx=o.x0+(o.x1-o.x0)*i/(o.n-1)+(r%2?6:-6)+(hash(i,r)-.5)*6,by=y+(hash(i,r+9)-.5)*8;
  const X=bx+airS(bx-o.x0,ph,{o,m,A,front}),h=i===hl&&r===2;s+=fade(g,dot(X,by,h?10:6,h?MK:'#a9d8ff'));}});
 if(hl>=0&&track){const bx=o.x0+(o.x1-o.x0)*hl/(o.n-1)+6+(hash(hl,2)-.5)*6;s+=fade(g*track,line(bx-A,o.rows[2]-34,bx-A,o.rows[2]+34,{color:MK,w:2,dash:'4 5'})+line(bx+A,o.rows[2]-34,bx+A,o.rows[2]+34,{color:MK,w:2,dash:'4 5'}));}
 if(earG)s+=ear(1120,178,{g:g*earG});
 if(graph){const pts=[];for(let x=o.x0;x<=o.x1;x+=4)pts.push([x,o.gy-o.gA*airS(x-o.x0,ph,{o,m,A,front})]);
  s+=fade(g*graph,line(o.x0,o.gy,o.x1,o.gy,{color:C.faint,w:2,dash:'6 8'})+draw(pts,1,{color:ROPE,w:4}));
  if(glab)s+=fade(g*graph*glab,label('ずれ',o.x0-18,o.gy-6,{size:24,color:C.ink,anchor:'end',weight:700})+label('右へ ＋',o.x0-18,o.gy+26,{size:22,color:C.dim,anchor:'end'}));}
 return s;
}
// phase (cycles) integrated over the scene; prof maps diagram key → (u)=>m (frequency multiplier)
export function scenePhase(p,ctx,prof={},T=AIR.T){
 if(!ctx||!ctx.scene||!ctx.scene.captions)return p*8/T;
 const caps=ctx.scene.captions,cues=ctx.scene.cues;let ph=0;
 const integ=(i,span,dur)=>{const f=prof[cues[i].diagram]||(()=>1),N=80;let s=0;for(let j=0;j<N;j++){const tt=(j+.5)/N*span;s+=f(clamp(tt/dur))*span/N;}return s/T;};
 for(let i=0;i<ctx.k;i++)ph+=integ(i,caps[i+1].start-caps[i].start,caps[i].end-caps[i].start);
 return ph+integ(ctx.k,ctx.t,ctx.dur);
}
export const span=(x1,x2,y,text,color,g=1,size=30,dy=-14)=>fade(g,line(x1,y-12,x1,y+12,{color,w:2})+line(x2,y-12,x2,y+12,{color,w:2}))+arrow(x1,y,x2,y,{color,w:3,head:12,g})+arrow(x2,y,x1,y,{color,w:3,head:12,g})+(text?fade(g,label(text,(x1+x2)/2,y+dy,{size,color,anchor:'middle',weight:700})):'');
export const spanT=(x1,x2,y,src,color,g=1,size=34,dy=-22)=>fade(g,line(x1,y-12,x1,y+12,{color,w:2})+line(x2,y-12,x2,y+12,{color,w:2}))+arrow(x1,y,x2,y,{color,w:3,head:12,g})+arrow(x2,y,x1,y,{color,w:3,head:12,g})+fade(g,tex(src,(x1+x2)/2,y+dy,{size,color,auto:false}));
// a knob (dial) with a pointer at fraction u (0..1)
function knob(x,y,u,text,color,{g=1,act=0}={}){
 const a=PI*(1.25-1.5*u);
 let s=ring(x,y,30,{color:act?color:C.dim,w:act?4:3,fill:'#131f38'})+line(x,y,x+24*Math.cos(a),y-24*Math.sin(a),{color,w:5});
 return fade(g,s+label(text,x,y+56,{size:24,color,anchor:'middle',weight:700}));
}
// simple lightning scene parts
function cloud(x,y,g=1){return fade(g,[[0,0,46],[44,-14,40],[86,4,38],[40,16,40]].map(([dx,dy,r])=>dot(x+dx,y+dy,r,'#56627a')).join(''));}
function bolt(x,y,g=1){return fade(g,poly([[x,y],[x+34,y],[x+12,y+70],[x+40,y+70],[x-12,y+170],[x+4,y+96],[x-24,y+96]],{fill:C.hi,fo:1}));}
function person(x,y,{g=1,color='#d6deec',h=1}={}){return fade(g,dot(x,y-118*h,16*h,color)+line(x,y-100*h,x,y-48*h,{color,w:6})+line(x,y-48*h,x-16*h,y,{color,w:6})+line(x,y-48*h,x+16*h,y,{color,w:6})+line(x,y-86*h,x-22*h,y-58*h,{color,w:6})+line(x,y-86*h,x+22*h,y-58*h,{color,w:6}));}
// a small displacement-time trace (for 音色)
function trace(x,y,w,h,fn,{g=1,color=ROPE,title='',cyc=3}={}){
 const pts=[];for(let i=0;i<=240;i++){const u=i/240;pts.push([x+w*u,y-h*fn(u*cyc)]);}
 return fade(g,line(x,y,x+w,y,{color:C.faint,w:2,dash:'6 8'})+draw(pts,1,{color,w:4})+(title?label(title,x,y-h-26,{size:26,color:C.ink,weight:700}):''));
}
const piano=u=>(Math.sin(2*PI*u)+.5*Math.sin(4*PI*u+.6)+.3*Math.sin(6*PI*u+1.2))/1.45;
const flute=u=>(Math.sin(2*PI*u)+.12*Math.sin(4*PI*u))/1.05;
// wave fronts racing: displacement curve starting at x0, front at xf
function racer(y,lamPx,xf,{g=1,x0=230,A=40,text='',color=ROPE}={}){
 const pts=[];for(let x=x0;x<=xf;x+=3)pts.push([x,y-A*Math.sin(2*PI*(xf-x)/lamPx)]);
 return fade(g,line(x0,y,1080,y,{color:C.faint,w:2,dash:'6 8'})+draw(pts,1,{color,w:4})+(text?label(text,x0-14,y+8,{size:24,color:C.ink,anchor:'end',weight:700}):''));
}
const QCARD=(a,b,g=1)=>card(150,120,900,220,label(a,600,195,{size:34,color:C.ink,anchor:'middle'})+label(b,600,280,{size:40,color:C.hi,anchor:'middle',weight:700}),g,C.hi);

const PH=(p,ctx)=>scenePhase(p,ctx);
// S4 profiles: frequency knob turns in 'hi2'
const PROF_HI={[K+'hi2']:u=>1+seg(u,.15,.6),[K+'hi3']:()=>2,[K+'hi4']:()=>2,[K+'hi5']:()=>2};
const PROF_LO={};

export const hsWSound1Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p,ctx)=>{
  const ph=PH(p,ctx);
  let s=air(ph,{dense:seg(p,.3,.5),earG:1});
  s+=fade(seg(p,.4,.6),label('空気の 縦波 ＝ 音',600,370,{size:38,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'q2']:(p,ctx)=>{
  const ph=PH(p,ctx);
  let s=fade(.45,air(ph,{dense:1,earG:1}));
  s+=card(170,300,860,150,label('音の「高さ」と「大きさ」は、',600,362,{size:32,color:C.ink,anchor:'middle'})+label('波の どの 量 で 決まる？',600,418,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'pred']:(p)=>{
  let s=card(160,40,400,120,label('高い 音',360,115,{size:40,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.dim);
  s+=card(640,40,400,120,label('大きい 音',840,115,{size:40,color:C.ink,anchor:'middle',weight:700}),seg(p,.1,.25),C.dim);
  s+=fade(seg(p,.2,.3),label('？',360,215,{size:44,color:C.hi,anchor:'middle',weight:700})+label('？',840,215,{size:44,color:C.hi,anchor:'middle',weight:700}));
  const chips=[['振幅 A',C.ink],['波長 λ',LC],['周期 T',TCOL],['振動数 f',FC],['速さ v',VCOL]];
  chips.forEach(([t,c],i)=>{const x=200+i*200;s+=fade(seg(p,.35+i*.06,.45+i*.06),rect(x-80,300,160,64,{fill:c,fo:.1,stroke:c,sw:2,rx:14})+label(t,x,342,{size:26,color:c,anchor:'middle',weight:700}));});
  s+=fade(seg(p,.7,.8),label('どれで 決まる？',600,450,{size:30,color:C.dim,anchor:'middle'}));
  return s;
 },
 // ================= S2 音の正体 =================
 [K+'src1']:(p,ctx)=>{
  const ph=Math.max(0,tSince(p,ctx,K+'src1')-.4)/AIR.T;
  let s=air(ph,{front:true,dense:seg(p,.35,.55)});
  s+=fade(seg(p,.05,.2),label('スピーカーの 膜',AIR.mx-60,300,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.3,.45),label('押し 縮める',360,330,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'src2']:(p,ctx)=>{
  const ph=Math.max(0,tSince(p,ctx,K+'src1')-.4)/AIR.T;
  let s=air(ph,{front:true,dense:seg(p,.05,.25),sparse:seg(p,.55,.7)});
  s+=fade(seg(p,.1,.25),arrow(700,330,900,330,{color:C.hi,w:4,head:14})+label('密が 右へ 伝わる',800,370,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'src3']:(p,ctx)=>{
  const ph=Math.max(0,tSince(p,ctx,K+'src1')-.4)/AIR.T;
  let s=air(ph,{front:true,dense:.6,sparse:.6,hl:16,track:seg(p,.2,.4)});
  s+=fade(seg(p,.35,.5),label('印の 粒：左右に 小さく 往復するだけ',640,330,{size:28,color:MK,anchor:'middle',weight:700}));
  return s;
 },
 [K+'src4']:(p,ctx)=>{
  const ph=Math.max(0,tSince(p,ctx,K+'src1')-.4)/AIR.T;
  let s=air(ph,{dense:1,sparse:1,press:seg(p,.45,.6)>.5?1:0,earG:seg(p,.05,.2),hl:16,track:.5});
  s+=fade(seg(p,.1,.3),label('耳に 届くのは 圧力の 変化',640,350,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'src5']:(p,ctx)=>{
  const ph=Math.max(0,tSince(p,ctx,K+'src1')-.4)/AIR.T;
  let s=air(ph,{dense:1,sparse:1,press:1,earG:1,hl:16,track:.5});
  const sx=airS(AIR.x1-AIR.x0,ph);
  s+=fade(seg(p,.05,.2),rect(1092+sx*.8,150,8,56,{fill:MK,fo:.9,stroke:'none',rx:3})+label('鼓膜',1096,310,{size:24,color:MK,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),label('押されたり 引かれたり → 音として 感じる',640,350,{size:28,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'gr1']:(p,ctx)=>{
  const ph=Math.max(0,tSince(p,ctx,K+'src1')-.4)/AIR.T;
  let s=air(ph,{dense:.5,hl:16,track:.5,graph:seg(p,.1,.3)});
  s+=fade(seg(p,.45,.6),label('縦 ＝ 粒の 右への ずれ（上下の 動きではない）',640,500,{size:26,color:C.ink,anchor:'middle',weight:700}));
  // highlighted particle → its point on the graph
  const bx=AIR.x0+(AIR.x1-AIR.x0)*16/(AIR.n-1)+6+(hash(16,2)-.5)*6,sx=airS(bx-AIR.x0,ph);
  s+=fade(seg(p,.3,.45),line(bx,AIR.rows.at(-1)+20,bx,AIR.gy-AIR.gA*sx,{color:MK,w:2,dash:'4 5'})+dot(bx,AIR.gy-AIR.gA*sx,9,MK));
  return s;
 },
 [K+'gr2']:(p,ctx)=>{
  const ph0=Math.max(0,tSince(p,ctx,K+'src1')-.4)/AIR.T,ph=ph0;
  let s=air(ph,{dense:1,graph:1});
  // at the compression nearest x＝640: arrows converge
  const ds=denseD(ph),d=ds.reduce((a,b)=>Math.abs(AIR.x0+b-640)<Math.abs(AIR.x0+a-640)?b:a,ds[0]??410),x=AIR.x0+d;
  s+=fade(seg(p,.1,.25),dot(x,AIR.gy,10,C.hi));
  s+=arrow(x-110,AIR.gy-64,x-40,AIR.gy-64,{color:C.F,w:5,head:14,g:seg(p,.3,.45)})+arrow(x+110,AIR.gy+64,x+40,AIR.gy+64,{color:C.F,w:5,head:14,g:seg(p,.3,.45)});
  s+=fade(seg(p,.3,.45),label('右へ',x-75,AIR.gy-80,{size:22,color:C.F,anchor:'middle',weight:700})+label('左へ',x+150,AIR.gy+72,{size:22,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('寄った 所 ＝ 密',x,AIR.gy+100,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'gr3']:(p,ctx)=>{
  const ph=Math.max(0,tSince(p,ctx,K+'src1')-.4)/AIR.T;
  let s=air(ph,{dense:1,graph:1});
  const ds=denseD(ph).filter(d=>d>=0&&d+AIR.lam<=AIR.x1-AIR.x0).sort((a,b)=>a-b),d=ds[0]??100;
  s+=spanT(AIR.x0+d,AIR.x0+d+AIR.lam,AIR.rows[0]-64,'\\lambda',LC,seg(p,.1,.3),30,-20);
  // graph crests: arg＝k+1/4 → d＝lam(ph−k−1/4)
  const cs=[];for(let k=Math.floor(ph)-4;k<=Math.ceil(ph)+1;k++){const c=AIR.lam*(ph-k-.25);if(c>=0&&c+AIR.lam<=AIR.x1-AIR.x0)cs.push(c);}cs.sort((a,b)=>a-b);
  const c=cs[0]??100;s+=spanT(AIR.x0+c,AIR.x0+c+AIR.lam,AIR.gy+AIR.gA*AIR.A+24,'\\lambda',LC,seg(p,.35,.55),30,34);
  s+=fade(seg(p,.35,.55),line(AIR.x0+c,AIR.gy-AIR.gA*AIR.A,AIR.x0+c,AIR.gy+AIR.gA*AIR.A+24,{color:LC,w:2,dash:'4 5'})+line(AIR.x0+c+AIR.lam,AIR.gy-AIR.gA*AIR.A,AIR.x0+c+AIR.lam,AIR.gy+AIR.gA*AIR.A+24,{color:LC,w:2,dash:'4 5'}));
  s+=fade(seg(p,.7,.85),label('同じ 長さ ＝ 音の 波長',1180,300,{size:26,color:LC,anchor:'end',weight:700}));
  return s;
 },
 // ================= S3 音の速さ =================
 [K+'v1']:(p)=>{
  let s=card(200,60,800,190,label('空気中の 音の 速さ（常温）',600,120,{size:30,color:C.ink,anchor:'middle'})+T2(`\\text{約}\\ 340${MS}`,600,205,{size:58,color:VCOL,auto:false}),seg(p,.05,.2),VCOL);
  s+=tag('測定で 確かめた 値',600,330,{color:C.F,g:seg(p,.55,.7)});
  return s;
 },
 [K+'v2']:(p)=>{
  let s=card(200,60,800,190,label('空気中の 音の 速さ（常温）',600,120,{size:30,color:C.ink,anchor:'middle'})+T2(`${Vt}\\approx 340${MS}`,600,205,{size:58,auto:false}),1,VCOL);
  s+=fade(seg(p,.1,.25),label('音の 速さ ＝ 大文字の V',600,330,{size:32,color:VCOL,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('ドップラー効果の 単元でも 同じ 文字',600,400,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'med']:(p)=>{
  const X0=220,k=700/6000,rows=[['空気',340],['水',1500],['鉄',6000]];let s='';
  rows.forEach(([n,v],i)=>{const y=110+i*110,g=seg(p,.05+i*.22,.2+i*.22);
   s+=fade(g,label(n,X0-20,y+12,{size:30,color:C.ink,anchor:'end',weight:700})+rect(X0,y-22,v*k*g,44,{fill:VCOL,fo:.35,stroke:VCOL,rx:8})+label(`約 ${v} m/s`,X0+v*k*g+14,y+10,{size:26,color:VCOL,weight:700}));});
  return s;
 },
 [K+'vac']:(p)=>{
  const X0=220,k=700/6000,rows=[['空気',340],['水',1500],['鉄',6000]];let s='';
  rows.forEach(([n,v],i)=>{const y=110+i*110;s+=fade(.5,label(n,X0-20,y+12,{size:30,color:C.ink,anchor:'end',weight:700})+rect(X0,y-22,v*k,44,{fill:VCOL,fo:.35,stroke:VCOL,rx:8})+label(`約 ${v} m/s`,X0+v*k+14,y+10,{size:26,color:VCOL,weight:700}));});
  s+=fade(seg(p,.1,.25),label('真空',X0-20,452,{size:30,color:C.ink,anchor:'end',weight:700})+rect(X0,420,300,60,{fill:'#0f1a30',fo:1,stroke:C.dim,rx:10}));
  s+=fade(seg(p,.45,.6),label('押す 空気が ない → 伝わらない',X0+330,460,{size:28,color:C.a,weight:700}));
  return s;
 },
 [K+'thun']:(p)=>{
  let s=cloud(150,90)+bolt(170,120,seg(p,.05,.12)*(1-seg(p,.3,.45)))+person(1000,430)+line(80,432,1120,432,{color:C.dim,w:3});
  s+=fade(seg(p,.15,.3),label('ピカッ',260,110,{size:30,color:C.hi,weight:700}));
  s+=fade(seg(p,.5,.65),label('3.0 秒後に ゴロゴロ',1000,250,{size:28,color:TCOL,anchor:'middle',weight:700}));
  s+=fade(seg(p,.75,.9),label('距離は？',600,480,{size:30,color:LC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'thun2']:(p)=>{
  let s=cloud(150,90)+person(1000,430)+line(80,432,1120,432,{color:C.dim,w:3});
  const u=lin(p,.1,.85),xf=200+u*780;
  for(let j=0;j<3;j++){const r=xf-200-j*40;if(r>0)s+=fade(.8-j*.2,`<path d="M${200+r*Math.cos(.5)} ${110+r*Math.sin(.5)} A ${r} ${r} 0 0 0 ${200+r} 110" fill="none" stroke="#a9d8ff" stroke-width="3"/>`);}
  s+=fade(seg(p,.05,.2),label('光：ほぼ 一瞬',600,60,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.25,.4),label('音：3.0 秒 かけて 進む',600,300,{size:28,color:VCOL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'thun3']:(p)=>{
  let s=cloud(150,90)+person(1000,430)+line(80,432,1120,432,{color:C.dim,w:3});
  s+=span(200,1000,380,'',LC,seg(p,.05,.2));
  s+=card(220,150,760,120,T2(`340\\times 3.0=1020${MM}`,600,225,{size:48,auto:false}),seg(p,.2,.35),LC);
  s+=fade(seg(p,.6,.75),label('約 1.0 km',600,350,{size:32,color:LC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'thun4']:(p)=>{
  let s=cloud(150,90)+person(1000,430)+line(80,432,1120,432,{color:C.dim,w:3});
  s+=span(200,1000,380,'約 1.0 km',LC,1,30,-14);
  s+=fade(seg(p,.1,.25),label('光の 速さは「光波」の 単元で',600,200,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S4 高さと大きさ =================
 [K+'hi1']:(p,ctx)=>{
  const ph=scenePhase(p,ctx,PROF_HI);
  let s=air(ph,{graph:1,dense:.5,glab:1});
  s+=knob(75,330,0,'振動数',FC,{g:seg(p,.3,.45)})+knob(75,425,0,'振幅',ACOL,{g:seg(p,.55,.7)});
  return s;
 },
 [K+'hi2']:(p,ctx)=>{
  const ph=scenePhase(p,ctx,PROF_HI),m=1+seg(p,.15,.6);
  let s=air(ph,{m,graph:1,dense:.5});
  s+=knob(75,330,m-1,'振動数',FC,{act:1})+knob(75,425,0,'振幅',ACOL);
  s+=fade(seg(p,.6,.75),label('1秒の 往復の 回数 ↑',640,500,{size:26,color:FC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'hi3']:(p,ctx)=>{
  const ph=scenePhase(p,ctx,PROF_HI);
  let s=air(ph,{m:2,graph:1,dense:1});
  s+=knob(75,330,1,'振動数',FC,{act:1})+knob(75,425,0,'振幅',ACOL);
  const ds=denseD(ph,{m:2}).filter(d=>d>=300&&d+150<=AIR.x1-AIR.x0).sort((a,b)=>a-b),d=ds[0]??320;
  s+=span(AIR.x0+d,AIR.x0+d+150,AIR.rows.at(-1)+34,'',LC,seg(p,.05,.2));
  s+=card(700,442,440,64,label('高い 音 ＝ f が 大きい',920,485,{size:30,color:FC,anchor:'middle',weight:700}),seg(p,.45,.6),FC);
  return s;
 },
 [K+'hi4']:(p,ctx)=>{
  const ph=scenePhase(p,ctx,PROF_HI);
  let s=fade(.5,air(ph,{m:2,graph:1,dense:.5}));
  s+=card(250,250,700,140,label('ピアノの 真ん中の ラ',600,300,{size:30,color:C.ink,anchor:'middle'})+T2(`${ft}=440${HZ}`,600,360,{size:46,auto:false}),seg(p,.05,.2),FC);
  s+=fade(seg(p,.45,.6),label('1秒に 440回 押し 引き',600,450,{size:28,color:FC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'hi5']:(p,ctx)=>{
  const ph=scenePhase(p,ctx,PROF_HI);
  let s=fade(.5,air(ph,{m:2,graph:1,dense:.5}));
  s+=card(250,250,700,140,T2(`440${HZ}\\ \\times 2=880${HZ}`,600,320,{size:46,auto:false}),1,FC);
  s+=fade(seg(p,.3,.45),label('1オクターブ 上の ラ',600,450,{size:30,color:FC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'lo1']:(p,ctx)=>{
  const ph=scenePhase(p,ctx),A=AIR.A*(1+seg(p,.35,.75));
  let s=air(ph,{A,graph:1,dense:.5});
  s+=knob(75,330,0,'振動数',FC)+knob(75,425,seg(p,.35,.75),'振幅',ACOL,{act:1});
  s+=fade(seg(p,.05,.2),label('振動数は 元に 戻して 固定',640,505,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'lo2']:(p,ctx)=>{
  const ph=scenePhase(p,ctx),A=AIR.A*2;
  let s=air(ph,{A,graph:1,dense:1,hl:16,track:seg(p,.05,.2)});
  s+=knob(75,330,0,'振動数',FC)+knob(75,425,1,'振幅',ACOL,{act:1});
  const yA=AIR.gy-AIR.gA*A;s+=fade(seg(p,.2,.35),line(1070,AIR.gy,1110,AIR.gy,{color:C.ink,w:2})+line(1070,yA,1110,yA,{color:C.ink,w:2}))+arrow(1100,AIR.gy,1100,yA,{color:C.ink,w:3,head:12,g:seg(p,.2,.35)})+fade(seg(p,.25,.4),tex('A',1135,(AIR.gy+yA)/2+8,{size:34,color:C.ink,auto:false}));
  s+=card(760,6,420,64,label('大きい 音 ＝ A が 大きい',970,48,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.6,.75),C.ink);
  return s;
 },
 [K+'lo3']:(p,ctx)=>{
  const ph=scenePhase(p,ctx),A=AIR.A*2;
  let s=air(ph,{A,graph:1,dense:1});
  s+=knob(75,330,0,'振動数',FC)+knob(75,425,1,'振幅',ACOL);
  const ds=denseD(ph).filter(d=>d>=200&&d+AIR.lam<=AIR.x1-AIR.x0).sort((a,b)=>a-b),d=ds[0]??250;
  s+=spanT(AIR.x0+d,AIR.x0+d+AIR.lam,AIR.rows.at(-1)+34,'\\lambda',LC,seg(p,.05,.2),30,30);
  s+=fade(seg(p,.35,.5),label('波長は そのまま → 高さは 同じ',1180,505,{size:26,color:LC,anchor:'end',weight:700}));
  return s;
 },
 [K+'lo4']:(p,ctx)=>{
  const ph=scenePhase(p,ctx),A=AIR.A*2;
  let s=fade(.35,air(ph,{A,graph:1,dense:1}));
  s+=card(200,170,800,190,label('振幅 2倍',600,235,{size:32,color:C.ink,anchor:'middle',weight:700})+label('≠ 聞こえる 大きさ 2倍',600,305,{size:34,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=fade(seg(p,.55,.7),label('耳の 感じ方は 単純な 比例では ない',600,420,{size:28,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'tim']:(p)=>{
  let s=trace(140,170,420,70,piano,{title:'ピアノ（440 Hz）',g:seg(p,.05,.2)})+trace(640,170,420,70,flute,{title:'フルート（440 Hz）',g:seg(p,.2,.35)});
  s+=fade(seg(p,.1,.25),label('ずれ',120,170,{size:22,color:C.dim,anchor:'end'}));
  s+=fade(seg(p,.4,.55),label('同じ 周期、違う 形',600,320,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('音色 ＝ 波の 形',600,400,{size:36,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'tbl']:(p)=>{
  const rows=[['高さ','振動数 f',FC],['大きさ','振幅 A',C.ink],['音色','波の 形',C.hi]];
  let s=card(240,50,720,330,'',1,C.dim);
  rows.forEach(([a,b,c],i)=>{const y=130+i*95,g=seg(p,.05+i*.2,.2+i*.2);s+=fade(g,label(a,420,y+12,{size:36,color:C.ink,anchor:'middle',weight:700})+label('↔',600,y+12,{size:36,color:C.dim,anchor:'middle'})+label(b,780,y+12,{size:36,color:c,anchor:'middle',weight:700}));});
  return s;
 },
 // ================= S5 速さは同じ、波長が変わる =================
 [K+'race0']:(p)=>QCARD('高い 音は、低い 音より','速く 進む？',seg(p,.05,.2)),
 [K+'race']:(p,ctx)=>{
  const u=lin(tSince(p,ctx,K+'race')/7,0,1),xf=240+820*u;
  let s=racer(170,100,xf,{text:'高い 音'})+racer(370,300,xf,{text:'低い 音'});
  s+=fade(seg(p,.1,.25),line(xf,90,xf,450,{color:VCOL,w:3,dash:'8 6'}));
  s+=fade(seg(p,.35,.5),label('先頭は いつも そろう',600,490,{size:28,color:VCOL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'race2']:(p,ctx)=>{
  const u=lin(tSince(p,ctx,K+'race')/7,0,1),xf=240+820*u;
  let s=racer(170,100,xf,{text:'高い 音'})+racer(370,300,xf,{text:'低い 音'})+line(xf,90,xf,450,{color:VCOL,w:3,dash:'8 6'});
  s+=card(250,200,700,90,label('もし 高い 音ほど 速いと → メロディが ずれる',600,256,{size:28,color:C.a,anchor:'middle',weight:700}),seg(p,.1,.25),C.a);
  return s;
 },
 [K+'vfl']:(p)=>{
  let s=card(200,50,800,130,T2(`${'v'}=${ft}${Lt}`,600,128,{size:54}),1,VCOL);
  s+=fade(seg(p,.1,.25),label('波の基本で 導いた 式',600,230,{size:26,color:C.dim,anchor:'middle'}));
  s+=card(300,280,600,130,T2(`${Vt}=${ft}${Lt}`,600,358,{size:58,auto:false}),seg(p,.5,.65),VCOL);
  return s;
 },
 [K+'lam']:(p)=>{
  let s=card(300,30,600,120,T2(`${Vt}=${ft}${Lt}`,600,103,{size:52,auto:false}),1,VCOL);
  s+=fade(seg(p,.05,.2),label('両辺を f で 割る',600,200,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=card(300,225,600,170,T2(`${Lt}=\\dfrac{${Vt}}{${ft}}`,600,318,{size:52,auto:false}),seg(p,.2,.35),LC);
  s+=fade(seg(p,.6,.75),label('V 一定 → f 大 なら λ 小',600,460,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ex1']:(p)=>{
  const px=380,x0=170;
  let s=card(240,10,720,150,T2(`${Lt}=\\dfrac{340}{440}\\approx 0.77${MM}`,600,100,{size:44,auto:false}),seg(p,.05,.2),LC);
  s+=fade(seg(p,.4,.55),racer(280,0.77*px,x0+0.77*px*2,{x0,A:40}));
  s+=span(x0,x0+.77*px,355,'約 0.77 m',LC,seg(p,.55,.7),26,36);
  s+=fade(seg(p,.4,.55),label('440 Hz',x0-14,288,{size:24,color:FC,anchor:'end',weight:700}));
  return s;
 },
 [K+'ex2']:(p)=>{
  const px=380,x0=170;
  let s=card(240,10,720,150,T2(`${Lt}=\\dfrac{340}{170}=2.0${MM}`,600,100,{size:44,auto:false}),1,LC);
  s+=fade(.5,racer(240,.77*px,x0+.77*px*2,{x0,A:30}))+fade(.5,label('440 Hz',x0-14,248,{size:24,color:FC,anchor:'end',weight:700}));
  s+=fade(seg(p,.15,.3),racer(400,2.0*px,x0+2.0*px,{x0,A:40}))+fade(seg(p,.15,.3),label('170 Hz',x0-14,408,{size:24,color:FC,anchor:'end',weight:700}));
  s+=span(x0,x0+2.0*px,470,'2.0 m',LC,seg(p,.3,.45),26,36);
  return s;
 },
 [K+'mis']:(p)=>{
  let s=card(160,60,880,150,label('✕ 大きい 音・高い 音ほど 速く 届く',600,150,{size:34,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=card(160,260,880,120,label('速さは 媒質で 決まる（空気なら 約 340 m/s）',600,332,{size:30,color:C.F,anchor:'middle',weight:700}),seg(p,.5,.65),C.F);
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p)=>{
  const rows=[['高さ','振動数 f',FC],['大きさ','振幅 A',C.ink]];
  let s=card(240,40,720,230,'',1,C.hi);
  rows.forEach(([a,b,c],i)=>{const y=120+i*95,g=seg(p,.05+i*.25,.2+i*.25);s+=fade(g,label(a,420,y+12,{size:36,color:C.ink,anchor:'middle',weight:700})+label('↔',600,y+12,{size:36,color:C.dim,anchor:'middle'})+label(b,780,y+12,{size:36,color:c,anchor:'middle',weight:700}));});
  return s;
 },
 [K+'ans2']:(p)=>{
  let s=card(240,40,720,230,label('高さ ↔ 振動数 f',600,132,{size:36,color:FC,anchor:'middle',weight:700})+label('大きさ ↔ 振幅 A',600,227,{size:36,color:C.ink,anchor:'middle',weight:700}),1,C.hi);
  s+=card(240,300,720,165,T2(`${Vt}\\approx 340${MS}\\quad ${Lt}=\\dfrac{${Vt}}{${ft}}`,600,392,{size:44,auto:false}),seg(p,.05,.2),VCOL);
  return s;
 },
 [K+'n1']:(p)=>{
  const x0=150,w=900,y=250,pts=[];for(let i=0;i<=900;i++){const u=i/900,tt=u*1.5;pts.push([x0+w*u,y-80*Math.cos(2*PI*tt)*Math.sin(2*PI*20*tt)]);}
  let s=fade(seg(p,.1,.3),draw(pts,lin(p,.1,.7),{color:ROPE,w:2.5})+line(x0,y,x0+w,y,{color:C.faint,w:2,dash:'6 8'}));
  s+=fade(seg(p,.6,.75),label('ワーン',x0+w*0/1.5+20,y-110,{size:30,color:C.hi,weight:700})+label('ワーン',x0+w*.5/1.5-30,y-110,{size:30,color:C.hi,weight:700})+label('ワーン',x0+w*1/1.5-30,y-110,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'n2']:(p)=>{
  const x0=150,w=900,y=210,pts=[];for(let i=0;i<=900;i++){const u=i/900,tt=u*1.5;pts.push([x0+w*u,y-70*Math.cos(2*PI*tt)*Math.sin(2*PI*20*tt)]);}
  let s=fade(.5,draw(pts,1,{color:ROPE,w:2.5}));
  s+=card(200,330,800,120,label('1秒に 何回？',600,405,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'bye']:(p)=>{
  const x0=150,w=900,y=210,pts=[];for(let i=0;i<=900;i++){const u=i/900,tt=u*1.5;pts.push([x0+w*u,y-70*Math.cos(2*PI*tt)*Math.sin(2*PI*20*tt)]);}
  return fade(.5,draw(pts,1,{color:ROPE,w:2.5}))+card(200,330,800,120,label('次回：深く学ぶ 2/3',600,405,{size:36,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.dim);
 },
};

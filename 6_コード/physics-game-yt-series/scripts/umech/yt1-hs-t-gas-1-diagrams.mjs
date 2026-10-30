// 高校編「気体の法則・深く学ぶ 1/2」(ys-hs-t-gas-1) — 図。Stage 1200×515.
// 色（構成表の案）：圧力 P 緑（力の仲間）、体積 V 水色（長さ・位置の仲間）、絶対温度 T 黄緑（熱と温度と同じ）、力 F 緑、熱 橙、強調 黄。
// 分子の点は水色がかった白（量の色ではない）。2/2・要点でも使う部品は export する。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,clamp,mix} from './anim.mjs';
import {card,tag,T2,FA,TC,QC,Tt,sceneT,thermo} from './yt1-hs-t-heat-1-diagrams.mjs';
export {card,tag,T2,FA,TC,QC,Tt,sceneT,thermo};

const K='hs-t-gas-1:';
export const PC=C.F, VC=C.x, MOL='#a9d8ff', HIT=C.hi;
export const Pt=`{\\color{${PC}}P}`, Vt=`{\\color{${VC}}V}`;
export const P1=`{\\color{${PC}}P_1}`, P2=`{\\color{${PC}}P_2}`, V1=`{\\color{${VC}}V_1}`, V2=`{\\color{${VC}}V_2}`;
export const T1=`{\\color{${TC}}T_1}`, T2t=`{\\color{${TC}}T_2}`;
export const PA='\\ \\mathrm{Pa}', LL='\\ \\mathrm{L}', KK='\\ \\mathrm{K}';
export const E5='1.0\\times10^{5}';
const lt=(p,ctx)=>ctx&&typeof ctx.t==='number'?ctx.t:p*8; // time since this cue started

// ---- deterministic pseudo-random -------------------------------------------------------------
function rnd(seed){let s=seed*9301+49297;return()=>{s=(s*9301+49297)%233280;return s/233280;};}
const tri=z=>{z=((z%2)+2)%2;return z<1?z:2-z;};
// ---- gas molecules in a box; flashes where they hit the right wall (hit=1) ----------------------
// Every molecule keeps the same speed whatever the box width, so a narrower box gives more hits.
export function gasBox({x,y,w,h,n=16,dist=0,seed=1,r=8,color=MOL,hit=0,frame=true,g=1,fill='#0f1a30',stroke=C.faint,wallR=null}={}){
 const R=rnd(seed);let s='';
 if(frame)s+=rect(x,y,w,h,{fill,fo:.9,stroke,sw:2,rx:8});
 const W=Math.max(1,w-2*r),Hh=h-2*r;
 for(let i=0;i<n;i++){
  const u0=R(),v0=R(),a=R()*Math.PI*2,k=.7+.6*R();
  const ca=Math.cos(a)>=0?Math.max(.35,Math.cos(a)):Math.min(-.35,Math.cos(a));
  const zx=u0*2+dist*k*ca/240,px=x+r+W*tri(zx*240/W),py=y+r+Hh*tri(v0*2+dist*k*Math.sin(a)/Hh);
  s+=dot(px,py,r,color);
  if(hit){const d=x+w-r-px;if(d<16){const o=hit*(1-d/16);s+=fade(o,`<path d="M${x+w+4} ${py-16} q12 16 0 32" fill="none" stroke="${HIT}" stroke-width="4"/>`);}}
 }
 if(wallR)s+=line(x+w,y,x+w,y+h,{color:wallR,w:5});
 return fade(g,s);
}
// number of right-wall hits between dist d0 and d1 (exact count of reflections)
export function hitCount({w,n=16,seed=1,r=8,d0=0,d1=0}){
 const R=rnd(seed);let c=0;const W=Math.max(1,w-2*r);
 for(let i=0;i<n;i++){
  const u0=R();R();const a=R()*Math.PI*2,k=.7+.6*R();
  const ca=Math.cos(a)>=0?Math.max(.35,Math.cos(a)):Math.min(-.35,Math.cos(a));
  const z0=(u0*2+d0*k*ca/240)*240/W,z1=(u0*2+d1*k*ca/240)*240/W;
  const lo=Math.min(z0,z1),hi=Math.max(z0,z1);
  // reflections at the right wall happen where z is an odd integer
  c+=Math.max(0,Math.floor((hi-1)/2)-Math.ceil((lo-1)/2)+1);
 }
 return c;
}
// ---- syringe (tip on the left, sealed) -------------------------------------------------------
export function syringe({x0=240,x1=900,yc=250,h=170,xp=760,dist=0,n=16,seed=3,hit=0,g=1,push=0,sealHi=0}={}){
 let s='';
 s+=rect(x0-70,yc-22,70,44,{fill:'#0f1a30',fo:.9,stroke:C.dim,sw:2,rx:4});
 s+=rect(x0-100,yc-30,34,60,{fill:'#c9d2e3',fo:.9,stroke:'#eef3fb',sw:2,rx:6});
 if(sealHi)s+=fade(sealHi,ring(x0-83,yc,52,{color:C.hi,w:4}));
 s+=gasBox({x:x0,y:yc-h/2,w:xp-x0,h,n,dist,seed,hit,frame:true,stroke:'none'});
 s+=`<path d="M${x0} ${yc-h/2-4} L${x1} ${yc-h/2-4} M${x0} ${yc+h/2+4} L${x1} ${yc+h/2+4}" stroke="${C.dim}" stroke-width="4"/>`;
 s+=line(x0,yc-h/2-4,x0,yc-22,{color:C.dim,w:4})+line(x0,yc+22,x0,yc+h/2+4,{color:C.dim,w:4});
 s+=rect(xp,yc-h/2,22,h,{fill:'#7d8aa3',fo:1,stroke:'#c9d2e3',sw:2,rx:3});
 s+=rect(xp+22,yc-10,x1+120-xp-22,20,{fill:'#7d8aa3',fo:1,stroke:'none',rx:3});
 s+=rect(x1+120,yc-60,20,120,{fill:'#7d8aa3',fo:1,stroke:'#c9d2e3',sw:2,rx:4});
 if(push)s+=FA(x1+250,yc,x1+150,yc,{g:push,text:'押す',dy:-22});
 return fade(g,s);
}
// equation step: previous line (small, dim) + operation note + new line (big)
export function step(p,prev,next,op,{size=50,col=C.hi,y0=90}={}){
 let s=fade(.6,T2(prev,600,y0,{size:36}));
 s+=fade(seg(p,.05,.2),label(op,600,y0+85,{size:28,color:col,anchor:'middle',weight:700})+arrow(600,y0+100,600,y0+145,{color:col,w:4,head:14}));
 s+=card(150,y0+170,900,140,T2(next,600,y0+245,{size}),seg(p,.3,.5),col);
 return s;
}
// ---- clay pressed by a board or a fingertip ---------------------------------------------------
function clay(x,w,depth){return rect(x,330+depth,w,130-depth,{fill:'#c99a6a',fo:.75,stroke:'#e2bd90',sw:2,rx:6});}
function press(p,{deep=1}={}){
 const d=28*seg(p,.15,.45)*deep;
 let s=clay(120,400,0)+rect(170,330-10+d*.25-30,300,30,{fill:'#7d8aa3',fo:1,stroke:'#c9d2e3',sw:2,rx:4})+rect(170,330+d*.25,300,6,{fill:'#9c7650',fo:.9,stroke:'none'});
 s+=FA(320,140,320,280+d*.25,{text:'',w:9});
 s+=label('板（広い 面）',320,500,{size:26,color:C.ink,anchor:'middle',weight:700});
 s+=clay(680,400,0)+rect(860,330,40,d,{fill:'#9c7650',fo:.9,stroke:'none'})+rect(855,180+d,50,150,{fill:'#e9c7a6',fo:.95,stroke:'none',rx:20});
 s+=FA(880,40,880,165+d,{w:9});
 s+=label('指先（狭い 面）',880,500,{size:26,color:C.ink,anchor:'middle',weight:700});
 s+=fade(seg(p,.05,.2),label('同じ 力',600,90,{size:30,color:C.F,anchor:'middle',weight:700}));
 return s;
}
// ---- impulse spikes vs. averaged force -------------------------------------------------------
function spikes(p,{avg=0,many=1}={}){
 const x0=180,x1=1020,y0=420;let s=line(x0,y0,x1+20,y0,{color:C.dim,w:2.5})+line(x0,y0,x0,140,{color:C.dim,w:2.5});
 s+=label('時間',x1+30,y0+8,{size:24,color:C.t})+label('壁が 受ける 力',x0,120,{size:24,color:C.F,anchor:'middle'});
 const R=rnd(5);const N=Math.round(mix(12,70,many));const L=x0+(x1-x0)*clamp(p*1.4);
 for(let i=0;i<N;i++){const xx=x0+10+(x1-x0-20)*(i+R()*.8)/N,hh=60+120*R();if(xx<L)s+=line(xx,y0,xx,y0-hh,{color:C.F,w:3,opacity:.85});}
 if(avg)s+=fade(avg,line(x0,y0-150,x1,y0-150,{color:C.hi,w:5})+label('ならした 力',x1-10,y0-170,{size:26,color:C.hi,anchor:'end',weight:700}));
 return s;
}
// ---- Boyle P–V graph (V in L, P in 10⁵ Pa) ---------------------------------------------------
export const BG={x:170,y:440,w:520,h:330,xmax:3.6,ymax:3.6};
export const bX=v=>BG.x+BG.w*v/BG.xmax, bY=q=>BG.y-BG.h*q/BG.ymax;
export function boyleAxes({g=1}={}){
 let s=arrow(BG.x-10,BG.y,BG.x+BG.w+30,BG.y,{color:C.dim,w:2.5,head:14})+arrow(BG.x,BG.y+10,BG.x,BG.y-BG.h-30,{color:C.dim,w:2.5,head:14});
 for(const v of [1,1.5,2,3])s+=line(bX(v),BG.y-6,bX(v),BG.y+6,{color:C.dim})+label(String(v===1?'1.0':v===2?'2.0':v===3?'3.0':v),bX(v),BG.y+32,{size:22,color:C.dim,anchor:'middle'});
 for(const q of [1,2,3])s+=line(BG.x-6,bY(q),BG.x+6,bY(q),{color:C.dim})+label(`${q}.0`,BG.x-14,bY(q)+8,{size:22,color:C.dim,anchor:'end'});
 s+=label('体積 V [L]',BG.x+BG.w+20,BG.y+40,{size:24,color:VC,anchor:'middle',weight:700});
 s+=label('圧力 P [×10⁵ Pa]',BG.x+30,BG.y-BG.h-44,{size:24,color:PC,anchor:'middle',weight:700});
 return fade(g,s);
}
export const BPTS=[[3,1],[1.5,2],[1,3]];
export const BCOL=['#6adfff','#b49bff','#ffb36b'];
export function boyleRects(gs=[1,1,1]){
 let s='';BPTS.forEach(([v,q],i)=>{s+=fade(gs[i],rect(bX(0),bY(q),bX(v)-bX(0),bY(0)-bY(q),{fill:BCOL[i],fo:.16,stroke:BCOL[i],sw:2.5,rx:0}));});return s;
}
export const boyleCurve=(p=1)=>draw(Array.from({length:121},(_,i)=>{const v=.86+i*(3.5-.86)/120;return [bX(v),bY(3/v)];}),p,{color:PC,w:4});
export const boyleDots=(gs=[1,1,1])=>BPTS.map(([v,q],i)=>fade(gs[i],dot(bX(v),bY(q),10,C.hi))).join('');

const Q2=(a,b,o={})=>card(200,130,800,210,label(a,600,200,{size:34,color:C.ink,anchor:'middle'})+label(b,600,280,{size:44,color:C.hi,anchor:'middle',weight:700}),o.g??1,C.hi);
const sizes={big:{x:120,w:480},half:{x:120,w:240},third:{x:120,w:160}};

export const hsTGas1Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=gasBox({x:330,y:70,w:540,h:330,n:22,dist:220*t,seed:2,hit:seg(p,.45,.6)});
  s+=fade(seg(p,.1,.25),label('分子が 飛び回る',600,450,{size:28,color:MOL,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('壁',905,90,{size:28,color:C.hi,weight:700})+label('叩かれる',905,130,{size:26,color:C.hi}));
  return s;
 },
 [K+'q2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.3,gasBox({x:330,y:70,w:540,h:330,n:22,dist:220*t,seed:2,hit:1}));
  s+=Q2('壁を 叩く 力は','何で 決まる？',{g:seg(p,.05,.25)});
  return s;
 },
 [K+'syr']:(p,ctx)=>{
  const t=sceneT(p,ctx),xp=mix(820,700,seg(p,.2,.7));
  let s=syringe({xp,dist:220*t,hit:1,push:seg(p,.1,.3)});
  s+=fade(seg(p,.05,.2),label('先を ふさぐ',157,175,{size:24,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.6,.8),arrow(xp+70,370,xp+170,370,{color:C.hi,w:5,head:16})+label('押し返す 手応え',xp+120,420,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'goal']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.35,syringe({xp:700,dist:220*t}));
  s+=card(200,90,800,250,label('壁を 押す 力 → 「圧力」',600,170,{size:36,color:PC,anchor:'middle',weight:700})+label('体積を 変えると 圧力は どう 変わる？',600,270,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
 // ================= S2 圧力とは =================
 [K+'clay']:(p)=>{
  let s=press(p);
  s+=fade(seg(p,.35,.5),label('浅い',490,280,{size:28,color:C.ink,weight:700})+label('深い',990,330,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('効き目は 面積で 変わる',600,140,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'def']:(p)=>{
  let s=`<polygon points="160,420 520,420 600,340 240,340" fill="${PC}" fill-opacity=".18" stroke="${PC}" stroke-width="2.5"/>`;
  s+=label('面積 A',380,465,{size:26,color:C.ink,anchor:'middle',weight:700});
  for(const [x,y] of [[260,370],[380,380],[500,370],[330,355],[450,355]])s+=FA(x,y-170,x,y-6,{w:5,head:14,g:seg(p,.05,.25)});
  s+=fade(seg(p,.1,.25),label('面を 垂直に 押す 力 F',380,150,{size:26,color:C.F,anchor:'middle',weight:700}));
  s+=card(660,130,440,200,T2(`${Pt}=\\dfrac{F}{A}`,880,235,{size:60}),seg(p,.4,.6),PC);
  s+=tag('定義',880,390,{g:seg(p,.6,.75)});
  return s;
 },
 [K+'unit']:(p)=>{
  let s=card(660,130,440,200,T2(`${Pt}=\\dfrac{F}{A}`,880,235,{size:60}),1,PC);
  s+=fade(seg(p,.05,.2),label('力：N',230,180,{size:30,color:C.F,weight:700})+label('面積：m²',230,240,{size:30,color:C.ink,weight:700}));
  s+=card(150,300,460,120,T2('\\mathrm{1\\ Pa = 1\\ N/m^2}',380,365,{size:44,auto:false}),seg(p,.4,.6),C.hi);
  s+=fade(seg(p,.6,.75),label('パスカル',380,460,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'per1']:(p)=>{
  let s=`<polygon points="200,430 600,430 700,330 300,330" fill="${PC}" fill-opacity=".18" stroke="${PC}" stroke-width="2.5"/>`;
  s+=label('1 m²',450,395,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=FA(450,110,450,370,{w:10,head:26,g:seg(p,.1,.35)});
  s+=card(760,170,380,170,label('圧力 ＝',950,230,{size:30,color:PC,anchor:'middle',weight:700})+label('1 m² あたりの 力',950,295,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.6),PC);
  return s;
 },
 [K+'gas']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=gasBox({x:150,y:80,w:520,h:340,n:20,dist:220*t,seed:4,hit:1,wallR:C.dim});
  s+=fade(seg(p,.3,.5),label('1回 ごとに',940,180,{size:28,color:C.ink,anchor:'middle'})+label('壁を 一瞬 押す',940,230,{size:30,color:C.F,anchor:'middle',weight:700}));
  for(const yy of [150,250,350])s+=FA(690,yy,760,yy,{w:5,head:14,g:seg(p,.45,.6)*(.5+.5*Math.abs(Math.sin(t*3+yy)))});
  return s;
 },
 [K+'avg']:(p)=>spikes(p,{avg:seg(p,.55,.75),many:seg(p,.0,.3)}),
 [K+'model']:(p,ctx)=>{
  let s=spikes(1,{avg:1,many:1});
  s+=card(340,30,760,80,label('気体の 圧力 ＝ 衝突を 時間で ならした もの',720,82,{size:30,color:PC,anchor:'middle',weight:700}),seg(p,.05,.2),PC);
  s+=tag('モデル',1080,470,{color:C.dim,g:seg(p,.4,.55)});
  return s;
 },
 [K+'atm']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.6,gasBox({x:80,y:60,w:1040,h:400,n:40,dist:180*t,seed:9,frame:false,r:6}));
  s+=card(270,170,660,170,label('大気圧（周りの 空気の 圧力）',600,225,{size:30,color:C.ink,anchor:'middle',weight:700})+T2(`\\approx ${E5}${PA}`,600,295,{size:46,color:PC,auto:false}),seg(p,.05,.25),PC);
  return s;
 },
 [K+'nail']:(p)=>{
  let s=rect(280,140,240,240,{fill:PC,fo:.15,stroke:PC,sw:3,rx:4});
  s+=fade(seg(p,.05,.2),label('1 cm',400,125,{size:26,color:C.ink,anchor:'middle',weight:700})+label('1 cm',540,270,{size:26,color:C.ink,weight:700}));
  s+=fade(seg(p,.1,.25),label('爪 くらい',400,430,{size:28,color:C.dim,anchor:'middle'}));
  s+=card(640,190,500,130,T2('\\mathrm{1\\ cm^2 = 1.0\\times10^{-4}\\ m^2}',890,258,{size:38,auto:false}),seg(p,.5,.7),C.hi);
  return s;
 },
 [K+'fpa']:(p)=>step(p,`${Pt}=\\dfrac{F}{A}`,`F=${Pt}A`,'両辺 × A',{col:C.F}),
 [K+'atm3']:(p)=>{
  let s=fade(.6,T2(`F=${Pt}A`,600,90,{size:40}));
  s+=card(120,150,960,130,T2(`F=(${E5})\\times(1.0\\times10^{-4})`,600,218,{size:44}),seg(p,.05,.25),C.F);
  s+=card(380,320,440,110,T2('=10\\ \\mathrm{N}',600,378,{size:50,color:C.F,auto:false}),seg(p,.5,.7),C.hi);
  return s;
 },
 [K+'kg']:(p)=>{
  let s=rect(320,360,240,40,{fill:PC,fo:.15,stroke:PC,sw:3,rx:4})+label('1 cm²',440,440,{size:26,color:C.ink,anchor:'middle',weight:700});
  const y=mix(120,240,seg(p,.05,.3));
  s+=rect(360,y,160,120,{fill:'#8c97ad',fo:.95,stroke:'#d5dbe6',sw:2,rx:8})+label('1 kg',440,y+70,{size:32,color:C.bg,anchor:'middle',weight:700});
  s+=fade(seg(p,.35,.5),FA(630,200,630,350)+label('約 10 N',630,180,{size:28,color:C.F,anchor:'middle',weight:700}));
  s+=card(760,160,380,150,label('爪の 上に',950,215,{size:30,color:C.ink,anchor:'middle'})+label('1 kg の 物',950,275,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.75),C.hi);
  return s;
 },
 [K+'inside']:(p)=>{
  let s=rect(450,120,300,280,{fill:'#e9c7a6',fo:.25,stroke:'#e9c7a6',sw:2,rx:40})+label('体',600,270,{size:30,color:C.ink,anchor:'middle',weight:700});
  for(const yy of [180,260,340]){s+=FA(300,yy,440,yy,{w:6,head:16,g:seg(p,.05,.25)})+FA(900,yy,760,yy,{w:6,head:16,g:seg(p,.05,.25)});}
  s+=fade(seg(p,.05,.25),label('外の 空気',230,110,{size:26,color:C.F,anchor:'middle',weight:700}));
  for(const yy of [200,320]){s+=FA(560,yy,470,yy,{w:5,head:14,color:C.hi,g:seg(p,.45,.65)})+FA(640,yy,730,yy,{w:5,head:14,color:C.hi,g:seg(p,.45,.65)});}
  s+=fade(seg(p,.5,.7),label('内側からも 押し返す',600,460,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S3 ボイルで固定するもの =================
 [K+'setup']:(p,ctx)=>{
  const t=sceneT(p,ctx),xp=mix(820,640,seg(p,.3,.8));
  let s=syringe({xp,dist:220*t,push:seg(p,.25,.4)});
  s+=fade(seg(p,.1,.25),label('体積 V',(240+xp)/2,135,{size:30,color:VC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('圧力 P は？',(240+xp)/2,400,{size:32,color:PC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'fix']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.45,syringe({xp:760,dist:220*t}));
  s+=card(250,370,700,110,label('固定：',360,438,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=tag('分子の 数',560,432,{g:seg(p,.3,.45),size:28})+tag('温度',800,432,{g:seg(p,.55,.7),color:TC,size:28});
  return s;
 },
 [K+'fix2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=syringe({xp:760,dist:220*t,sealHi:seg(p,.2,.4)});
  s+=fade(seg(p,.3,.5),label('漏れない ように ふさぐ',157,400,{size:28,color:C.hi,weight:700}));
  s+=tag('分子の 数',600,470,{size:26});
  return s;
 },
 [K+'fix3']:(p,ctx)=>{
  const t=sceneT(p,ctx),xp=mix(800,660,seg(p,.1,.95));
  let s=syringe({xp,dist:220*t,push:.6});
  for(const [x,y,X,Y] of [[400,160,400,60],[560,160,560,60],[400,340,400,440],[560,340,560,440]])s+=FA(x,y,X,Y,{color:QC,w:5,head:14,g:seg(p,.45,.65)});
  s+=fade(seg(p,.05,.2),label('ゆっくり',1000,140,{size:28,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.7),label('熱を 外へ 逃がす',760,50,{size:28,color:QC,weight:700}));
  s+=tag('温度',1000,470,{color:TC,size:26});
  return s;
 },
 [K+'fast']:(p,ctx)=>{
  const t=sceneT(p,ctx),xp=mix(820,640,seg(p,.05,.15));
  let s=syringe({x1:860,xp,dist:340*t,push:1});
  s+=fade(seg(p,.02,.1),label('急に 押す',880,150,{size:28,color:C.a,anchor:'middle',weight:700}));
  s+=thermo(1165,180,400,40+140*seg(p,.15,.5));
  s+=fade(seg(p,.3,.45),label('温度が 上がる',1100,150,{size:26,color:TC,anchor:'middle',weight:700}));
  s+=card(200,420,640,80,label('温度 一定 では ない → この 先の 関係は 使えない',520,470,{size:26,color:C.a,anchor:'middle',weight:700}),seg(p,.55,.75),C.a);
  return s;
 },
 [K+'guess']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.3,syringe({xp:760,dist:220*t}));
  s+=Q2('温度 一定で 体積を 半分に すると','圧力は 何倍？',{g:seg(p,.05,.25)});
  return s;
 },
 // ================= S4 体積半分で圧力2倍 =================
 [K+'box']:(p,ctx)=>{
  const t=sceneT(p,ctx),w=mix(480,240,seg(p,.35,.75));
  let s=label('体積 V',360,60,{size:28,color:VC,anchor:'middle',weight:700})+gasBox({x:120,y:90,w:480,h:300,n:12,dist:200*t,seed:6});
  s+=gasBox({x:680,y:90,w,h:300,n:12,dist:200*t,seed:6,g:seg(p,.1,.3)});
  s+=fade(seg(p,.7,.85),label('体積 V／2',680+120,60,{size:28,color:VC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.3),label('分子 12 個',360,440,{size:26,color:C.ink,anchor:'middle'})+label('分子 12 個',800,440,{size:26,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'dens']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=label('体積 V',360,60,{size:28,color:VC,anchor:'middle',weight:700})+gasBox({x:120,y:90,w:480,h:300,n:12,dist:200*t,seed:6});
  s+=label('体積 V／2',800,60,{size:28,color:VC,anchor:'middle',weight:700})+gasBox({x:680,y:90,w:240,h:300,n:12,dist:200*t,seed:6});
  s+=card(560,400,560,100,label('密度（1 m³ あたりの 数）：2倍',840,462,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.6),C.hi);
  return s;
 },
 [K+'hits']:(p,ctx)=>{
  const t=sceneT(p,ctx),c=lt(p,ctx),t0=t-c;
  let s=gasBox({x:120,y:90,w:480,h:300,n:12,dist:200*t,seed:6,hit:1,wallR:C.dim});
  s+=gasBox({x:680,y:90,w:240,h:300,n:12,dist:200*t,seed:6,hit:1,wallR:C.dim});
  const a=hitCount({w:480,n:12,seed:6,d0:200*t0,d1:200*t}),b=hitCount({w:240,n:12,seed:6,d0:200*t0,d1:200*t});
  s+=fade(seg(p,.05,.15),label('右の 壁に 当たった 回数',600,50,{size:26,color:C.hi,anchor:'middle',weight:700}))+fade(seg(p,.3,.4),label(`${a} 回`,360,450,{size:34,color:C.hi,anchor:'middle',weight:700})+label(`${b} 回`,800,450,{size:34,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75)*(c>1?1:0),label('約 2倍',1060,250,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'p2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.35,gasBox({x:120,y:90,w:480,h:300,n:12,dist:200*t,seed:6,hit:1})+gasBox({x:680,y:90,w:240,h:300,n:12,dist:200*t,seed:6,hit:1}));
  s+=card(160,140,880,240,label('1回の 押す 強さ：同じ',600,200,{size:30,color:C.ink,anchor:'middle',weight:700})+label('当たる 回数：2倍',600,255,{size:30,color:C.ink,anchor:'middle',weight:700})+label('→ 圧力 2倍',600,335,{size:42,color:PC,anchor:'middle',weight:700}),seg(p,.05,.25),PC);
  return s;
 },
 [K+'three']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=label('V',230,60,{size:28,color:VC,anchor:'middle',weight:700})+gasBox({x:80,y:90,w:300,h:280,n:12,dist:200*t,seed:6,hit:1});
  s+=label('V／2',560,60,{size:28,color:VC,anchor:'middle',weight:700})+gasBox({x:485,y:90,w:150,h:280,n:12,dist:200*t,seed:6,hit:1});
  s+=fade(seg(p,.1,.3),label('V／3',850,60,{size:28,color:VC,anchor:'middle',weight:700})+gasBox({x:800,y:90,w:100,h:280,n:12,dist:200*t,seed:6,hit:1}));
  s+=label('P',230,430,{size:32,color:PC,anchor:'middle',weight:700})+label('2P',560,430,{size:32,color:PC,anchor:'middle',weight:700});
  s+=fade(seg(p,.5,.7),label('3P',850,430,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'inv']:(p)=>{
  const row=(y,a,col,g)=>fade(g,label(a[0],250,y,{size:32,color:col,anchor:'middle',weight:700})+a.slice(1).map((v,i)=>label(v,500+i*220,y,{size:36,color:col,anchor:'middle',weight:700})).join(''));
  let s=row(170,['体積','1倍','1／2倍','1／3倍'],VC,1)+row(270,['圧力','1倍','2倍','3倍'],PC,seg(p,.05,.25));
  s+=line(150,215,1050,215,{color:C.faint,w:2});
  s+=card(350,340,500,100,label('反比例',600,405,{size:42,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.7),C.hi);
  return s;
 },
 [K+'law']:(p)=>{
  let s=card(130,90,940,250,label('温度 一定・決まった 量の 気体',600,160,{size:30,color:C.ink,anchor:'middle',weight:700})+label('圧力 P は 体積 V に 反比例',600,240,{size:40,color:C.hi,anchor:'middle',weight:700})+label('ボイルの 法則',600,305,{size:30,color:PC,anchor:'middle',weight:700}),seg(p,.05,.25),PC);
  s+=tag('法則（実験で 確かめた）',600,410,{g:seg(p,.5,.65),size:26});
  return s;
 },
 [K+'ideal']:(p)=>{
  let s=fade(.5,card(130,90,940,250,label('圧力 P は 体積 V に 反比例',600,215,{size:40,color:C.hi,anchor:'middle',weight:700}),1,PC));
  s+=card(200,370,800,110,label('薄い 気体で よく 成り立つ',600,415,{size:28,color:C.ink,anchor:'middle',weight:700})+label('液体に 近づくと ずれる',600,460,{size:28,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.25),C.dim);
  return s;
 },
 // ================= S5 反比例を式に =================
 [K+'prop']:(p)=>{
  let s=card(300,120,600,200,T2(`${Pt}\\propto\\dfrac{1}{${Vt}}`,600,225,{size:64}),seg(p,.05,.25),PC);
  s+=fade(seg(p,.5,.65),label('∝ は「比例する」',600,400,{size:30,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'k']:(p)=>{
  let s=fade(.6,T2(`${Pt}\\propto\\dfrac{1}{${Vt}}`,600,90,{size:38}));
  s+=card(250,180,700,160,T2(`${Pt}=k\\times\\dfrac{1}{${Vt}}`,600,262,{size:58}),seg(p,.2,.4),PC);
  s+=fade(seg(p,.5,.65),label('k：一定の 数',600,410,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'mulV']:(p)=>{
  let s=step(p,`${Pt}=k\\times\\dfrac{1}{${Vt}}`,`${Pt}${Vt}=k`,'両辺 × V');
  s+=fade(seg(p,.6,.75),label('圧力 × 体積 が 一定',600,470,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'p1p2']:(p)=>{
  let s=fade(.6,T2(`${Pt}${Vt}=k`,600,80,{size:40}));
  s+=fade(seg(p,.05,.2),label('前：1',360,170,{size:30,color:C.ink,anchor:'middle',weight:700})+label('後：2',840,170,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.25),T2(`${P1}${V1}=k`,360,240,{size:44})+T2(`${P2}${V2}=k`,840,240,{size:44}));
  s+=card(300,320,600,130,T2(`${P1}${V1}=${P2}${V2}`,600,388,{size:56}),seg(p,.5,.7),C.hi);
  return s;
 },
 [K+'ex']:(p)=>{
  let s=syringe({x0:200,x1:760,yc:300,h:150,xp:mix(700,367,seg(p,.45,.85)),dist:0,n:12,seed:7});
  s+=card(150,40,420,150,T2(`${P1}=${E5}${PA}`,360,90,{size:34})+T2(`${V1}=3.0${LL}`,360,150,{size:34}),seg(p,.05,.2),C.dim);
  s+=card(630,40,420,150,T2(`${V2}=1.0${LL}`,840,90,{size:34})+T2(`${P2}=\\ ?`,840,150,{size:34}),seg(p,.5,.7),C.hi);
  s+=fade(seg(p,.3,.45),label('温度 一定',1000,320,{size:26,color:TC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ex2']:(p)=>step(p,`${P1}${V1}=${P2}${V2}`,`${P2}=\\dfrac{${P1}${V1}}{${V2}}`,'両辺 ÷ V₂',{size:44}),
 [K+'ex3']:(p)=>{
  let s=fade(.6,T2(`${P2}=\\dfrac{${P1}${V1}}{${V2}}`,600,85,{size:36}));
  s+=card(150,170,900,140,T2(`${P2}=\\dfrac{${E5}\\times3.0}{1.0}=3.0\\times10^{5}${PA}`,600,240,{size:46}),seg(p,.05,.25),PC);
  s+=fade(seg(p,.55,.7),label('体積 1／3 → 圧力 3倍',600,400,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'graph']:(p)=>{
  let s=boyleAxes()+boyleDots([seg(p,.3,.4),seg(p,.5,.6),seg(p,.7,.8)]);
  const lab=[[3,1,'(3.0, 1.0)'],[1.5,2,'(1.5, 2.0)'],[1,3,'(1.0, 3.0)']];
  lab.forEach(([v,q,tx],i)=>{s+=fade(seg(p,.3+.2*i,.4+.2*i),label(tx,bX(v)+16,bY(q)-14,{size:22,color:C.hi}));});
  return s;
 },
 [K+'rect']:(p)=>{
  let s=boyleAxes()+boyleRects([seg(p,.05,.2),seg(p,.25,.4),seg(p,.45,.6)])+boyleDots();
  const prod=['3.0 × 1.0 = 3.0','1.5 × 2.0 = 3.0','1.0 × 3.0 = 3.0'];
  prod.forEach((tx,i)=>{s+=fade(seg(p,.05+.2*i,.2+.2*i),label(tx,770,170+i*70,{size:30,color:BCOL[i],weight:700}));});
  s+=fade(seg(p,.7,.85),label('どれも 3.0 × 10⁵ Pa·L',770,400,{size:30,color:C.hi,weight:700}));
  s+=fade(seg(p,.05,.2),label('面積 ＝ V × P',770,100,{size:28,color:C.ink,weight:700}));
  return s;
 },
 [K+'curve']:(p)=>{
  let s=boyleAxes()+boyleRects([.6,.6,.6])+boyleCurve(seg(p,.05,.6))+boyleDots();
  s+=card(760,170,400,170,label('反比例の グラフ',960,230,{size:30,color:PC,anchor:'middle',weight:700})+label('長方形の 面積が 一定',960,290,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.7),C.hi);
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.35,gasBox({x:330,y:70,w:540,h:330,n:22,dist:220*t,seed:2,hit:1}));
  s+=card(170,110,860,250,T2(`${Pt}=\\dfrac{F}{A}`,600,195,{size:52})+label('壁に 当たる 回数が 多いほど 大きい',600,300,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),PC);
  return s;
 },
 [K+'syr2']:(p,ctx)=>{
  const t=sceneT(p,ctx),xp=mix(820,560,seg(p,.1,.8));
  let s=syringe({xp,dist:220*t,hit:1,push:1});
  s+=fade(seg(p,.3,.5),label('体積 減る',(240+xp)/2,135,{size:28,color:VC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.75),label('当たる 回数 増える → 圧力 上がる',600,420,{size:30,color:PC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next']:(p,ctx)=>{
  let s=card(200,90,800,230,label('圧力 一定 の まま 温めると',600,170,{size:36,color:C.ink,anchor:'middle'})+label('体積は どう 変わる？',600,255,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  s+=fade(seg(p,.4,.6),thermo(1090,130,380,60+150*seg(p,.5,1)));
  return s;
 },
 [K+'next2']:(p)=>{
  let s=fade(.5,card(200,90,800,230,label('圧力 一定 の まま 温めると',600,170,{size:36,color:C.ink,anchor:'middle'})+label('体積は どう 変わる？',600,255,{size:44,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
  s+=card(250,350,700,100,label('なぜ 絶対温度 が 必要？',600,415,{size:38,color:TC,anchor:'middle',weight:700}),seg(p,.05,.25),TC);
  return s;
 },
 [K+'bye']:(p)=>card(250,170,700,150,label('次の 動画：シャルルの 法則',600,260,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

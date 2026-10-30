// 高校編「等加速度運動・深く学ぶ 1/3」(ys-hs-m1-uniform-accel-1) — 図。Stage 1200×515.
// 色（anim.mjs C）：位置・変位・面積 水色、速度 v 紫、加速度 a 赤、時刻 t 金、強調 黄。
// 2/3・3/3・要点でも使う部品（v-t グラフ、短冊、台形）は export する。
import {C,clamp,mix,seg,fade,label,line,rect,dot,arrow,axes,tex,poly} from './anim.mjs';
import {card,NL,numberLine,thing,brace} from './yt1-hs-m1-velocity-1-diagrams.mjs';

const K='hs-m1-uniform-accel-1:';
const ms=v=>v<0?`−${-v}`:String(v);
export {card,brace};

// ---- v–t graph (numeric) ----------------------------------------------------------------
// Ticks are drawn here (not by axes) so that negative values get a real minus sign.
export function vtAxes(g=1,{x=110,y=450,w=560,h=370,xmax=4.6,ymax=9.4,ymin=0,xticks=[1,2,3,4],yticks=[2,4,6,8],tickBelow=false,ylabel='速度 v [m/s]'}={}){
 const A=axes({x,y,w,h,xmax,ymax,ymin,xlabel:'t [s]',ylabel,xticks:[],yticks:[],grid:false,g,xcolor:C.t,ycolor:C.v});
 const oy=A.Y(0);let s='';
 s+=yticks.map(v=>line(x,A.Y(v),x+w,A.Y(v),{color:C.grid,w:1.5})).join('')+xticks.map(u=>line(A.X(u),y,A.X(u),y-h,{color:C.grid,w:1.5})).join('');
 s+=xticks.map(u=>line(A.X(u),oy-6,A.X(u),oy+6,{color:C.dim})+label(String(u),A.X(u),tickBelow?y+30:oy+32,{size:22,color:C.t,anchor:'middle'})).join('');
 s+=yticks.map(v=>line(A.X(0)-6,A.Y(v),A.X(0)+6,A.Y(v),{color:C.dim})+label(ms(v),A.X(0)-14,A.Y(v)+8,{size:22,color:C.v,anchor:'end'})).join('');
 return {...A,svg:fade(g,s)+A.svg};
}
// symbolic v–t graph (no numbers): straight line from v₀ with slope a
export const SV0=3,SA=1.25,ST=4;
export const sv=t=>SV0+SA*t;
export function symAxes(g=1,o={}){return axes({x:110,y:450,w:560,h:370,xmax:4.9,ymax:9.6,xlabel:'t',ylabel:'速度 v',xticks:[],yticks:[],grid:false,g,xcolor:C.t,ycolor:C.v,...o});}

// region under f between t0 and t1 (signed: below the axis when f<0)
export function areaUnder(A,f,t0,t1,{color=C.x,fo=.32,g=1,sw=2}={}){
 const pts=[[A.X(t0),A.Y(0)]];for(let i=0;i<=40;i++){const u=t0+(t1-t0)*i/40;pts.push([A.X(u),A.Y(f(u))]);}pts.push([A.X(t1),A.Y(0)]);
 return fade(g,poly(pts,{fill:color,fo,stroke:color,sw}));
}
// strips of width (t1−t0)/n with the height at the left or right end; count reveals them one by one
export function strips(A,f,{t0=0,t1=4,n=4,mode='left',g=1,count=1e9,color=C.x,fo=.35,outline=false}={}){
 const dt=(t1-t0)/n;let s='';
 for(let i=0;i<n;i++){const al=clamp(count-i);if(al<=0)break;const a=t0+i*dt,b=a+dt,h=f(mode==='left'?a:b),y0=A.Y(0),y1=A.Y(h);
  s+=fade(al,outline?rect(A.X(a),Math.min(y0,y1),A.X(b)-A.X(a),Math.abs(y1-y0),{fill:color,fo:0,stroke:color,sw:2.5,rx:0})
   :rect(A.X(a),Math.min(y0,y1),A.X(b)-A.X(a),Math.abs(y1-y0),{fill:color,fo,stroke:color,sw:1.5,rx:0}));}
 return fade(g,s);
}
const v2=t=>2*t;
const RX=950; // centre of the right-hand card
export const rcard=(h,inner,g=1,stroke=C.faint,y=110)=>card(740,y,420,h,inner,g,stroke);

// three formulas in a row
export const F1='v=v_0+at',F2='x=v_0t+\\tfrac12at^2',F3='v^2-v_0^2=2ax';
export function threeCards(p,{g=[1,1,1],hl=-1,y=150,notes=null,dimOthers=false}={}){
 let s='';[[F1,'第1式'],[F2,'第2式'],[F3,'第3式']].forEach(([f,n],i)=>{const x=60+i*370,on=i===hl;
  s+=card(x,y,340,170,label(n,x+170,y+50,{size:28,color:on?C.hi:C.ink,anchor:'middle',weight:700})+fade(dimOthers&&!on&&hl>=0?.45:1,tex(f,x+170,y+120,{size:40})),g[i],on?C.hi:C.faint);
  if(notes)s+=fade(g[i],label(notes[i],x+170,y+215,{size:26,color:on?C.hi:C.dim,anchor:'middle'}));});
 return s;
}

// accelerating strobe (equal time steps, growing gaps)
function strobe(p,y=110){
 let s=line(120,y+26,1080,y+26,{color:C.faint,w:3});
 for(let k=0;k<=6;k++){const g=seg(p,.05+k*.08,.12+k*.08);s+=fade(g,dot(150+24*k*k,y,13,C.hi,k===6?1:.45));}
 return s;
}

// 1st formula: staircase of v₀ plus a per second
function stairs(p,{numeric=false,grow=1}={}){
 const base=440,U=21,W=80,x0=150,dx=130;let s=line(110,base,800,base,{color:C.dim,w:2.5});
 for(let k=0;k<=4;k++){const g=clamp(grow*5-k);if(g<=0)break;const x=x0+k*dx;
  let b=rect(x,base-2*U,W,2*U,{fill:C.v,fo:.5,stroke:C.v,rx:2});
  for(let j=0;j<k;j++)b+=rect(x,base-2*U-(j+1)*3*U,W,3*U,{fill:C.a,fo:.35,stroke:C.a,rx:2});
  const top=base-2*U-k*3*U;
  b+=label(numeric?`${2+3*k}`:(k===0?'v₀':`v₀ ＋ ${k===1?'':k}a`),x+W/2,top-12,{size:numeric?28:24,color:numeric?C.v:C.ink,anchor:'middle',weight:numeric?700:400});
  b+=label(`${k} s`,x+W/2,base+30,{size:22,color:C.t,anchor:'middle'});
  s+=fade(g,b);
 }
 return s;
}

export const hsUA1Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p)=>{
  let s=strobe(p);
  s+=fade(seg(p,.05,.2),label('同じ時間ごとの 位置',150,70,{size:24,color:C.dim}));
  s+=card(200,220,800,230,label('加速度 a が 一定',600,285,{size:36,color:C.a,anchor:'middle',weight:700})
   +label('t 秒後の 速度は？ 位置は？',600,360,{size:40,color:C.hi,anchor:'middle',weight:700})
   +label('予言 できる？',600,415,{size:28,color:C.ink,anchor:'middle'}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'goal']:(p)=>{
  let s=fade(seg(p,.02,.15),label('予言する 3つの式',600,90,{size:34,color:C.ink,anchor:'middle',weight:700}));
  s+=threeCards(p,{g:[seg(p,.45,.58),seg(p,.6,.73),seg(p,.75,.88)]});
  return s;
 },
 [K+'goal2']:(p)=>{
  let s=label('予言する 3つの式',600,90,{size:34,color:C.ink,anchor:'middle',weight:700});
  s+=threeCards(p,{hl:p>.4?0:-1,notes:['1本目','2本目','3本目'],g:[1,1,1]});
  s+=card(60,400,710,90,label('1本目：第1式 ＋ 第2式の 準備（面積）',415,457,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'assume']:(p)=>card(200,100,800,280,label('仮定（この場面で 置く 条件）',600,170,{size:30,color:C.hi,anchor:'middle',weight:700})
  +fade(seg(p,.15,.3),label('一直線の 運動',600,245,{size:38,color:C.ink,anchor:'middle',weight:700}))
  +fade(seg(p,.35,.5),label('加速度 a が ずっと 一定',600,320,{size:38,color:C.a,anchor:'middle',weight:700})),seg(p,.03,.18),C.hi),
 [K+'x0v0']:(p)=>{
  let s=numberLine({pos:0,zero:1});
  s+=fade(seg(p,.05,.2),thing(2)+label('時刻 0',NL.X(2),NL.y+140,{size:24,color:C.t,anchor:'middle'}));
  s+=fade(seg(p,.25,.4),tex('x_0',NL.X(2),NL.y+90,{size:44}));
  s+=arrow(NL.X(2),NL.y-80,NL.X(4.5),NL.y-80,{color:C.v,w:6,head:18,g:seg(p,.5,.65)})+fade(seg(p,.55,.7),tex('v_0',NL.X(3.25),NL.y-112,{size:40}));
  s+=fade(seg(p,.7,.85),label('v₀ ＝ 初速度',NL.X(6.5),NL.y-100,{size:32,color:C.v,weight:700}));
  return s;
 },
 [K+'disp']:(p)=>{
  let s=numberLine({pos:0,zero:1})+thing(2)+tex('x_0',NL.X(2),NL.y+90,{size:44})+label('時刻 0',NL.X(2),NL.y+140,{size:24,color:C.t,anchor:'middle'});
  s+=fade(seg(p,.05,.2),thing(8,NL.y,NL.X,C.dim)+label('時刻 t',NL.X(8),NL.y+140,{size:24,color:C.t,anchor:'middle'}));
  s+=arrow(NL.X(2),NL.y-80,NL.X(8),NL.y-80,{color:C.x,w:6,head:18,g:seg(p,.2,.45)});
  s+=fade(seg(p,.4,.55),label('x ＝ 開始からの 変位',NL.X(5),NL.y-104,{size:32,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.65,.8),label('はじめの位置から どれだけ 移ったか',600,490,{size:26,color:C.ink,anchor:'middle'}));
  return s;
 },
 // ================= S2 第1式 =================
 [K+'def']:(p)=>{
  let s=card(150,110,900,150,label('加速度 ＝ 速度の変化 ÷ かかった時間',600,200,{size:40,color:C.a,anchor:'middle',weight:700}),seg(p,.25,.45),C.a);
  s+=fade(seg(p,.55,.7),label('（定義）',600,320,{size:30,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.05,.2),label('加速度の単元で 作った 決め方',600,70,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'def2']:(p)=>{
  let s=fade(seg(p,.03,.18),label('時刻 0 → t',300,90,{size:30,color:C.t,anchor:'middle'})+label('速度 v₀ → v',300,140,{size:30,color:C.v,anchor:'middle'}));
  s+=fade(seg(p,.5,.62),tex('a=\\dfrac{v-v_0}{t}',560,270,{size:80}));
  s+=fade(seg(p,.2,.35),label('← 速度の変化 v − v₀',800,235,{size:28,color:C.v}));
  s+=fade(seg(p,.35,.48),label('← かかった時間 t',800,320,{size:28,color:C.t}));
  return s;
 },
 [K+'mult']:(p)=>{
  let s=tex('a=\\dfrac{v-v_0}{t}',600,90,{size:50});
  const c=seg(p,.4,.55);
  s+=fade(seg(p,.05,.2)*(1-c),tex('a\\,{\\color{#ffe28a}\\times t}=\\dfrac{v-v_0}{t}\\,{\\color{#ffe28a}\\times t}',600,230,{size:50}));
  s+=fade(c,tex('a\\,{\\color{#ffe28a}\\times t}=\\dfrac{v-v_0}{\\cancel{t}}\\,{\\color{#ffe28a}\\times \\cancel{t}}',600,230,{size:50}));
  s+=fade(seg(p,.05,.2),label('両辺に t を掛ける',900,240,{size:26,color:C.hi}));
  s+=card(400,330,400,110,tex('at=v-v_0',600,390,{size:56}),seg(p,.6,.75),C.a);
  return s;
 },
 [K+'add']:(p)=>{
  let s=tex('at=v-v_0',600,80,{size:50});
  s+=fade(seg(p,.05,.2),tex('at\\,{\\color{#ffe28a}+v_0}=v-v_0\\,{\\color{#ffe28a}+v_0}',600,190,{size:50})+label('両辺に v₀ を足す',930,200,{size:26,color:C.hi}));
  s+=fade(seg(p,.25,.4),tex('v_0+at=v',600,290,{size:50}));
  s+=card(380,350,440,110,tex('v=v_0+at',600,410,{size:60}),seg(p,.5,.65),C.hi);
  s+=fade(seg(p,.6,.75),label('第1式',930,420,{size:32,color:C.hi,weight:700}));
  return s;
 },
 [K+'mean']:(p)=>{
  let s=stairs(p,{grow:seg(p,.1,.7)});
  s+=card(830,120,330,240,tex('v=v_0+at',995,190,{size:48})+fade(seg(p,.4,.55),label('はじめの 速度 v₀',995,255,{size:24,color:C.v,anchor:'middle'})+label('＋ 毎秒 a × t 秒ぶん',995,300,{size:24,color:C.a,anchor:'middle'})),seg(p,.02,.15),C.hi);
  return s;
 },
 [K+'num']:(p)=>{
  let s=stairs(p,{numeric:true,grow:.2});
  s+=card(830,90,330,210,label('v₀ ＝ 2 m/s',995,150,{size:30,color:C.v,anchor:'middle',weight:700})
   +fade(seg(p,.3,.45),label('a ＝ 3 m/s²',995,205,{size:30,color:C.a,anchor:'middle',weight:700}))
   +fade(seg(p,.55,.7),label('t ＝ 4 s',995,260,{size:30,color:C.t,anchor:'middle',weight:700})),seg(p,.05,.2),C.faint);
  return s;
 },
 [K+'num2']:(p)=>{
  let s=stairs(p,{numeric:true,grow:mix(.2,1,seg(p,.05,.55))});
  s+=card(830,90,330,210,label('v₀ ＝ 2 m/s',995,150,{size:30,color:C.v,anchor:'middle',weight:700})+label('a ＝ 3 m/s²',995,205,{size:30,color:C.a,anchor:'middle',weight:700})+label('t ＝ 4 s',995,260,{size:30,color:C.t,anchor:'middle',weight:700}));
  s+=card(830,330,330,110,tex('2+3\\times 4=14',995,390,{size:40,auto:false}),seg(p,.6,.75),C.hi);
  s+=fade(seg(p,.6,.75),label('m/s',995,475,{size:26,color:C.v,anchor:'middle'}));
  return s;
 },
 [K+'nolaw']:(p)=>card(150,110,900,260,tex('v=v_0+at',600,190,{size:60})
  +fade(seg(p,.2,.35),label('新しい 法則は 使っていない',600,265,{size:32,color:C.ink,anchor:'middle'}))
  +fade(seg(p,.5,.65),label('定義の 並べ替え（結果）',600,325,{size:34,color:C.hi,anchor:'middle',weight:700})),seg(p,.03,.18),C.hi),
 // ================= S3 等速なら長方形 =================
 [K+'pos']:(p)=>{
  let s=card(200,100,800,300,label('次は 位置 x',600,170,{size:38,color:C.x,anchor:'middle',weight:700})
   +fade(seg(p,.3,.45),label('速度が 変わり続ける',600,250,{size:30,color:C.v,anchor:'middle'}))
   +fade(seg(p,.5,.65),label('速度 × 時間 では 求まらない',600,320,{size:34,color:C.a,anchor:'middle',weight:700})),seg(p,.03,.18),C.x);
  return s;
 },
 [K+'const']:(p)=>{
  const X=m=>150+m*70,y=260;let s=line(X(0)-20,y,X(12)+40,y,{color:C.dim,w:3});
  for(let m=0;m<=12;m+=3)s+=line(X(m),y-8,X(m),y+8,{color:C.dim,w:2})+label(`${m}`,X(m),y+36,{size:22,color:C.dim,anchor:'middle'});
  s+=label('m',X(12)+50,y+8,{size:22,color:C.x});
  for(let k=0;k<4;k++){const g=seg(p,.2+k*.1,.3+k*.1);s+=arrow(X(3*k),y-50,X(3*k+3),y-50,{color:C.v,w:5,g,head:14})+fade(g,label('3 m',X(3*k+1.5),y-66,{size:24,color:C.v,anchor:'middle'})+label('1 s',X(3*k+1.5),y-18,{size:22,color:C.t,anchor:'middle'}));}
  s+=fade(seg(p,.05,.18),label('秒速 3 m で 4 s',600,90,{size:32,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.65,.8),brace(X(0),X(12),y+60,{text:'変位 3 × 4 ＝ 12 m',color:C.x,size:30}));
  return s;
 },
 ...Object.fromEntries([['vt',0],['rect',1],['match',2],['unit',3]].map(([k,st])=>[K+k,(p)=>{
  const A=vtAxes(st?1:seg(p,.03,.25));let s=A.svg;
  if(st>=1)s+=fade(st===1?seg(p,.05,.3):1,rect(A.X(0),A.Y(3),A.X(4)-A.X(0),A.Y(0)-A.Y(3),{fill:C.x,fo:.3,stroke:C.x,rx:0}));
  s+=A.plot(()=>3,{from:0,to:4,p:st?1:seg(p,.55,.8),color:C.v,w:5,steps:2});
  if(st===0)s+=rcard(160,label('横：時刻 t [s]',RX,175,{size:30,color:C.t,anchor:'middle'})+label('縦：速度 v [m/s]',RX,230,{size:30,color:C.v,anchor:'middle'}),seg(p,.2,.35));
  if(st===0)s+=fade(seg(p,.7,.85),label('高さ 3 の 水平な線',RX,330,{size:28,color:C.v,anchor:'middle',weight:700}));
  if(st>=1){
   s+=fade(st===1?seg(p,.2,.35):1,label('縦 3',A.X(4)+14,A.Y(1.5)+8,{size:26,color:C.v,weight:700})+label('横 4',A.X(3.5),A.Y(0)-14,{size:26,color:C.t,anchor:'middle',weight:700}));
   s+=fade(st===1?seg(p,.5,.65):1,label('面積 12',A.X(2),A.Y(1.5)+10,{size:34,color:C.ink,anchor:'middle',weight:700}));
  }
  if(st===1)s+=rcard(110,label('3 × 4 ＝ 12',RX,182,{size:38,color:C.x,anchor:'middle',weight:700}),seg(p,.5,.65),C.x);
  if(st===2)s+=rcard(240,label('面積 12 ＝ 変位 12 m',RX,180,{size:34,color:C.x,anchor:'middle',weight:700})
   +fade(seg(p,.4,.55),label('速度 × 時間',RX,250,{size:30,color:C.ink,anchor:'middle'})+label('＝ 縦 × 横',RX,300,{size:30,color:C.ink,anchor:'middle'})),seg(p,.05,.2),C.x);
  if(st===3){const c=seg(p,.45,.6);
   s+=rcard(260,label('単位',RX,148,{size:26,color:C.dim,anchor:'middle'})
    +fade(1-c,tex('\\dfrac{\\mathrm{m}}{\\mathrm{s}}\\times\\mathrm{s}',RX,262,{size:52,auto:false}))
    +fade(c,tex('\\dfrac{\\mathrm{m}}{\\cancel{\\mathrm{s}}}\\times\\cancel{\\mathrm{s}}=\\mathrm{m}',RX,262,{size:52,auto:false}))
    +fade(seg(p,.65,.8),label('面積の 単位 ＝ 長さ',RX,345,{size:28,color:C.x,anchor:'middle',weight:700})),seg(p,.03,.18),C.hi);}
  return s;
 }])),
 // ================= S4 短冊で近づける =================
 [K+'accel']:(p)=>{
  const A=vtAxes(seg(p,.45,.7));let s=A.svg;
  s+=rcard(230,label('静止から',RX,165,{size:30,color:C.ink,anchor:'middle'})+label('a ＝ 2 m/s²',RX,225,{size:34,color:C.a,anchor:'middle',weight:700})+label('4 s 間',RX,285,{size:30,color:C.t,anchor:'middle'}),seg(p,.05,.25),C.faint);
  return s;
 },
 [K+'line']:(p)=>{
  const A=vtAxes();let s=A.svg+A.plot(v2,{from:0,to:4,p:seg(p,.2,.55),color:C.v,w:5,steps:2});
  s+=fade(seg(p,.55,.7),dot(A.X(4),A.Y(8),9,C.v)+label('8 m/s',A.X(4)+16,A.Y(8)+6,{size:26,color:C.v,weight:700}));
  s+=rcard(130,tex('v=2t',RX,190,{size:56}),seg(p,.05,.2),C.v);
  return s;
 },
 [K+'cut1']:(p)=>{
  const A=vtAxes();let s=A.svg+A.plot(v2,{from:0,to:4,color:C.v,w:5,steps:2})+dot(A.X(4),A.Y(8),9,C.v);
  [1,2,3,4].forEach((t,i)=>{s+=fade(seg(p,.05+i*.08,.12+i*.08),line(A.X(t),A.Y(0),A.X(t),A.Y(8.6),{color:C.t,w:2.5,dash:'7 6'}));});
  s+=rcard(130,label('1 s ずつ 区切る',RX,192,{size:32,color:C.t,anchor:'middle',weight:700}),seg(p,.05,.2));
  s+=rcard(130,label('1 s の間：速度は',RX,320,{size:28,color:C.ink,anchor:'middle'})+label('ほぼ 一定 とみなす',RX,365,{size:30,color:C.v,anchor:'middle',weight:700}),seg(p,.55,.7),C.v,270);
  return s;
 },
 [K+'left']:(p)=>{
  const A=vtAxes();let s=A.svg+strips(A,v2,{count:mix(0,4,seg(p,.3,.75))});
  s+=A.plot(v2,{from:0,to:4,color:C.v,w:5,steps:2});
  [0,2,4,6].forEach((h,i)=>{s+=fade(seg(p,.3+i*.11,.4+i*.11),label(String(h),A.X(i+.5),A.Y(h)-12,{size:26,color:C.v,anchor:'middle',weight:700}));});
  s+=rcard(150,label('区間の 始めの 速度',RX,180,{size:28,color:C.ink,anchor:'middle'})+label('0、2、4、6',RX,232,{size:34,color:C.v,anchor:'middle',weight:700}),seg(p,.05,.2));
  return s;
 },
 [K+'leftsum']:(p)=>{
  const A=vtAxes();let s=A.svg+strips(A,v2)+A.plot(v2,{from:0,to:4,color:C.v,w:5,steps:2});
  [0,2,4,6].forEach((h,i)=>{s+=label(String(h),A.X(i+.5),A.Y(h)-12,{size:26,color:C.v,anchor:'middle',weight:700});});
  s+=fade(seg(p,.05,.2),label('短冊',A.X(3.5),A.Y(3)+10,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=rcard(110,label('面積 ＝ 速度 × 1 s',RX,180,{size:30,color:C.x,anchor:'middle',weight:700}),seg(p,.25,.4),C.x);
  s+=rcard(110,label('0＋2＋4＋6 ＝ 12 m',RX,315,{size:32,color:C.x,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi,250);
  return s;
 },
 [K+'right']:(p)=>{
  const A=vtAxes();let s=A.svg+strips(A,v2)+strips(A,v2,{mode:'right',outline:true,color:C.hi,count:mix(0,4,seg(p,.05,.4))})+A.plot(v2,{from:0,to:4,color:C.v,w:5,steps:2});
  s+=rcard(100,label('始め：12 m',RX,172,{size:30,color:C.x,anchor:'middle',weight:700}),1,C.x);
  s+=rcard(100,label('終わり：2＋4＋6＋8 ＝ 20 m',RX,292,{size:25,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.35),C.hi,230);
  s+=fade(seg(p,.6,.75),label('12 m ＜ 変位 ＜ 20 m',RX,410,{size:32,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'predict']:(p)=>{
  const A=vtAxes();let s=A.svg+strips(A,v2)+strips(A,v2,{mode:'right',outline:true,color:C.hi})+A.plot(v2,{from:0,to:4,color:C.v,w:5,steps:2});
  s+=rcard(230,label('区切りを 細かく',RX,180,{size:32,color:C.ink,anchor:'middle'})+label('すると？',RX,235,{size:32,color:C.ink,anchor:'middle'})+label('12 と 20 は どうなる？',RX,300,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 ...Object.fromEntries([['finer',0],['approach',1]].map(([k,st])=>[K+k,(p)=>{
  const A=vtAxes();const n=st?16:(p<.45?8:16),g2=st?1:seg(p,.45,.6);
  let s=A.svg;
  if(st){s+=strips(A,v2,{n:16})+strips(A,v2,{n:16,mode:'right',outline:true,color:C.hi})+areaUnder(A,v2,0,4,{color:C.hi,fo:.0,sw:0});}
  else{const c8=p<.45?mix(0,8,seg(p,.03,.2)):8,o8=1-seg(p,.5,.64),c16=mix(0,16,seg(p,.47,.62));
   s+=fade(o8,strips(A,v2,{n:8,count:c8})+strips(A,v2,{n:8,mode:'right',outline:true,color:C.hi,count:c8}));
   if(p>=.45)s+=strips(A,v2,{n:16,count:c16})+strips(A,v2,{n:16,mode:'right',outline:true,color:C.hi,count:c16});}
  s+=A.plot(v2,{from:0,to:4,color:C.v,w:5,steps:2});
  const rows=[['1 s 幅','12','20'],['0.5 s 幅','14','18'],['0.25 s 幅','15','17']];
  let tb=label('始め',RX+40,160,{size:24,color:C.x,anchor:'middle'})+label('終わり',RX+140,160,{size:24,color:C.hi,anchor:'middle'});
  rows.forEach(([w,a,b],i)=>{const g=st?1:i===0?1:i===1?seg(p,.2,.32):seg(p,.62,.74);
   tb+=fade(g,label(w,RX-80,215+i*55,{size:26,color:C.t,anchor:'middle'})+label(a,RX+40,215+i*55,{size:30,color:C.x,anchor:'middle',weight:700})+label(b,RX+140,215+i*55,{size:30,color:C.hi,anchor:'middle',weight:700}));});
  s+=rcard(250,tb,1,C.faint);
  if(st){s+=fade(seg(p,.1,.25),arrow(RX+40,330,RX+80,395,{color:C.x,w:3,head:12})+arrow(RX+140,330,RX+100,395,{color:C.hi,w:3,head:12}));
   s+=fade(seg(p,.2,.35),label('16 m',RX+90,430,{size:36,color:C.hi,anchor:'middle',weight:700}));
   s+=fade(seg(p,.55,.75),areaUnder(A,v2,0,4,{color:C.hi,fo:.25})+label('三角形',A.X(3),A.Y(2.2),{size:28,color:C.ink,anchor:'middle',weight:700}));}
  return s;
 }])),
 [K+'tri']:(p)=>{
  const A=vtAxes();let s=A.svg+areaUnder(A,v2,0,4,{color:C.x,fo:.3})+A.plot(v2,{from:0,to:4,color:C.v,w:5,steps:2});
  s+=fade(seg(p,.05,.2),label('底辺 4 s',A.X(3),A.Y(0)-16,{size:26,color:C.t,anchor:'middle',weight:700}));
  s+=fade(seg(p,.2,.35),line(A.X(4),A.Y(0),A.X(4),A.Y(8),{color:C.v,w:3,dash:'6 5'})+label('高さ 8 m/s',A.X(4)+14,A.Y(4),{size:26,color:C.v,weight:700}));
  s+=rcard(120,label('4 × 8 ÷ 2 ＝ 16',RX,185,{size:36,color:C.x,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'limit']:(p)=>{
  const A=vtAxes();let s=A.svg+strips(A,v2,{n:16})+strips(A,v2,{n:16,mode:'right',outline:true,color:C.hi})+A.plot(v2,{from:0,to:4,color:C.v,w:5,steps:2});
  s+=rcard(110,label('短冊の 合計 ≈ 変位',RX,180,{size:32,color:C.x,anchor:'middle',weight:700}),seg(p,.05,.2),C.x);
  s+=fade(seg(p,.1,.25),label('（近似）',RX,250,{size:26,color:C.dim,anchor:'middle'}));
  s+=rcard(130,label('細くするほど',RX,330,{size:28,color:C.ink,anchor:'middle'})+label('直線の下の 面積へ',RX,375,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi,280);
  return s;
 },
 [K+'result']:(p)=>{
  const A=vtAxes();let s=A.svg+areaUnder(A,v2,0,4,{color:C.x,fo:.3})+A.plot(v2,{from:0,to:4,color:C.v,w:5,steps:2});
  s+=label('16 m',A.X(2.9),A.Y(2)+10,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=rcard(170,label('v-t グラフの 下の 面積',RX,190,{size:30,color:C.ink,anchor:'middle'})+label('＝ 変位',RX,245,{size:40,color:C.x,anchor:'middle',weight:700}),seg(p,.05,.2),C.x);
  return s;
 },
 // ================= S5 符号の付いた面積 =================
 ...Object.fromEntries([['neg',0],['negarea',1],['signed',2]].map(([k,st])=>[K+k,(p)=>{
  const o={w:520,ymin:-3.6,ymax:4.2,yticks:[-3,-2,-1,1,2,3],xticks:[1,2,3,4],xmax:4.6,tickBelow:true};
  const A=vtAxes(st?1:seg(p,.03,.2),o);let s=A.svg;
  if(st>=1)s+=fade(st===1?seg(p,.05,.3):1,rect(A.X(0),A.Y(0),A.X(3)-A.X(0),A.Y(-2)-A.Y(0),{fill:C.x,fo:.3,stroke:C.x,rx:0}));
  s+=A.plot(()=>-2,{from:0,to:3,p:st?1:seg(p,.2,.45),color:C.v,w:5,steps:2});
  if(st===0)s+=rcard(200,label('左向きに 2 m/s で 3 s',RX,175,{size:30,color:C.ink,anchor:'middle'})+fade(seg(p,.55,.7),label('変位 −2 × 3',RX,240,{size:32,color:C.x,anchor:'middle',weight:700})+label('＝ −6 m',RX,285,{size:32,color:C.x,anchor:'middle',weight:700})),seg(p,.05,.2));
  if(st>=1)s+=fade(st===1?seg(p,.35,.5):1,label('面積 −6',A.X(1.5),A.Y(-1)+10,{size:32,color:C.ink,anchor:'middle',weight:700}));
  if(st===1)s+=rcard(160,label('高さ −2 → 面積も 負',RX,185,{size:30,color:C.ink,anchor:'middle',weight:700})+label('−2 × 3 ＝ −6',RX,240,{size:32,color:C.x,anchor:'middle',weight:700}),seg(p,.45,.6),C.x);
  if(st===2)s+=rcard(240,label('横軸より 下の 面積',RX,175,{size:28,color:C.ink,anchor:'middle'})+label('＝ 左へ 進んだ 変位',RX,225,{size:30,color:C.x,anchor:'middle',weight:700})
   +fade(seg(p,.45,.6),label('符号付きの 面積',RX,295,{size:32,color:C.hi,anchor:'middle',weight:700})+label('＝ 変位',RX,340,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2),C.hi);
  return s;
 }])),
 ...Object.fromEntries([['trip',0],['path',1],['height',2]].map(([k,st])=>[K+k,(p)=>{
  const o={w:520,ymin:-3.6,ymax:4.2,yticks:[-3,-2,-1,1,2,3],xticks:[1,2,3,4,5],xmax:5.6,tickBelow:true};
  const A=vtAxes(st?1:seg(p,.03,.15),o);let s=A.svg;
  const ga=st?1:seg(p,.15,.35),gb=st?1:seg(p,.4,.6);
  s+=fade(ga,rect(A.X(0),A.Y(3),A.X(2)-A.X(0),A.Y(0)-A.Y(3),{fill:C.x,fo:.3,stroke:C.x,rx:0})+label('＋6',A.X(1),A.Y(1.5)+10,{size:32,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(gb,rect(A.X(2),A.Y(0),A.X(5)-A.X(2),A.Y(-2)-A.Y(0),{fill:C.x,fo:.3,stroke:C.x,rx:0})+label('−6',A.X(3.5),A.Y(-1)+10,{size:32,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(ga,A.plot(()=>3,{from:0,to:2,color:C.v,w:5,steps:2}))+fade(gb,A.plot(()=>-2,{from:2,to:5,color:C.v,w:5,steps:2}));
  if(st===0)s+=rcard(120,label('変位 ＝ (＋6) ＋ (−6)',RX,170,{size:30,color:C.x,anchor:'middle',weight:700})+label('＝ 0 m',RX,215,{size:32,color:C.x,anchor:'middle',weight:700}),seg(p,.7,.85),C.x);
  if(st===1){s+=rcard(120,label('変位 ＝ 0 m',RX,185,{size:32,color:C.x,anchor:'middle',weight:700}),1,C.x);
   s+=rcard(120,label('道のり ＝ 6 ＋ 6',RX,305,{size:32,color:C.hi,anchor:'middle',weight:700})+label('＝ 12 m',RX,350,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi,260);}
  if(st===2){s+=fade(seg(p,.1,.25),arrow(A.X(.3),A.Y(0),A.X(.3),A.Y(3),{color:C.v,w:4,head:14})+label('高さ',A.X(.3)+12,A.Y(2.5),{size:24,color:C.v}));
   s+=rcard(110,label('高さ → 速度',RX,180,{size:34,color:C.v,anchor:'middle',weight:700}),seg(p,.4,.55),C.v);
   s+=rcard(110,label('面積 → 変位',RX,300,{size:34,color:C.x,anchor:'middle',weight:700}),seg(p,.6,.75),C.x,240);}
  return s;
 }])),
 // ================= S6 まとめと次の問い =================
 [K+'sum']:(p)=>card(200,110,800,240,label('第1式',600,170,{size:30,color:C.hi,anchor:'middle',weight:700})+tex(F1,600,245,{size:60})
  +fade(seg(p,.4,.55),label('加速度の 定義の 並べ替え',600,315,{size:30,color:C.ink,anchor:'middle'})),seg(p,.03,.18),C.hi),
 [K+'sum2']:(p)=>{
  const A=vtAxes();let s=A.svg+areaUnder(A,v2,0,4,{color:C.x,fo:.3,g:seg(p,.05,.25)})+A.plot(v2,{from:0,to:4,color:C.v,w:5,steps:2});
  s+=rcard(200,label('v-t グラフの 下の',RX,180,{size:28,color:C.ink,anchor:'middle'})+label('符号付きの 面積',RX,230,{size:32,color:C.hi,anchor:'middle',weight:700})+label('＝ 変位',RX,285,{size:36,color:C.x,anchor:'middle',weight:700}),seg(p,.2,.35),C.x);
  return s;
 },
 [K+'next']:(p)=>{
  const A=symAxes();let s=A.svg;
  s+=areaUnder(A,sv,0,ST,{color:C.x,fo:.28,g:seg(p,.35,.55)});
  s+=A.plot(sv,{from:0,to:ST,p:seg(p,.05,.3),color:C.v,w:5,steps:2});
  s+=fade(seg(p,.05,.2),tex('v_0',A.X(0)-30,A.Y(SV0)+8,{size:36}));
  s+=fade(seg(p,.35,.5),label('t',A.X(ST),A.Y(0)+34,{size:28,color:C.t,anchor:'middle'})+label('？',A.X(ST/2),A.Y(SV0/2+.6),{size:60,color:C.hi,anchor:'middle',weight:700}));
  s+=rcard(170,label('台形の 面積は',RX,190,{size:32,color:C.ink,anchor:'middle'})+label('どんな 式？',RX,250,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'bye']:(p)=>{
  let s=card(200,110,800,230,label('次回 2/3',600,175,{size:28,color:C.dim,anchor:'middle'})+label('台形を 2つに 分ける',600,255,{size:46,color:C.x,anchor:'middle',weight:700})+label('→ 第2式',600,315,{size:30,color:C.hi,anchor:'middle'}),seg(p,.05,.25),C.x);
  return s;
 },
};

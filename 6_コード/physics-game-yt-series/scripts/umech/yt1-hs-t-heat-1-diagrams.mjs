// 高校編「熱と温度・深く学ぶ 1/2」(ys-hs-t-heat-1) — 図。Stage 1200×515.
// 色：絶対温度 T 黄緑（構成表の案）、熱 Q・エネルギー 橙、強調 黄。分子の点：冷たい＝青、熱い＝赤みの橙（温度の慣習色。量の色ではない）。
// 2/2・要点でも使う部品は export する（カード・タグ・T2 は力学の部品を読み込む）。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,poly,ground,clamp,mix} from './anim.mjs';
import {card} from './yt1-hs-m1-velocity-1-diagrams.mjs';
import {tag,T2,FA} from './yt1-hs-m-energy-1-diagrams.mjs';
export {card,tag,T2,FA};

const K='hs-t-heat-1:';
export const TC='#b8f06a', QC=C.E, UC='#ffd6a0';
export const Tt=`{\\color{${TC}}T}`, Qt=`{\\color{${QC}}Q}`, DT=`\\Delta {\\color{${TC}}T}`;
export const HOT='#ff9a7a', COLD='#7fb6ff', WATER='#4a90d9';
// time since the scene started (continuous across cues of one scene)
export const sceneT=(p,ctx)=>ctx&&ctx.scene&&ctx.scene.captions?ctx.t+(ctx.scene.captions[ctx.k]?.start||0):p*8;
// ---- deterministic pseudo-random -------------------------------------------------------------
function rnd(seed){let s=seed*9301+49297;return()=>{s=(s*9301+49297)%233280;return s/233280;};}
const tri=z=>{z=((z%2)+2)%2;return z<1?z:2-z;};
// ---- molecules bouncing in a box. dist = path length (px) travelled by an average molecule ----
export function molBox({x,y,w,h,n=20,dist=0,speed=0,seed=1,r=8,color=COLD,trail=.5,g=1,frame=true,fill=null,jit=0,time=0}={}){
 const R=rnd(seed);let s='';
 if(frame)s+=rect(x,y,w,h,{fill:fill||'#0f1a30',fo:fill?.18:.9,stroke:C.faint,sw:2,rx:10});
 const W=w-2*r,Hh=h-2*r;
 for(let i=0;i<n;i++){
  const u0=R(),v0=R(),a=R()*Math.PI*2,k=.6+.8*R();
  const pos=d=>[x+r+W*tri(u0*2+d*k*Math.cos(a)/W),y+r+Hh*tri(v0*2+d*k*Math.sin(a)/Hh)];
  let [px,py]=pos(dist);
  if(jit){px+=jit*Math.sin(time*23+i*1.7);py+=jit*Math.cos(time*19+i*2.3);}
  if(trail&&speed>1){const [qx,qy]=pos(dist-speed*k*.0+(-speed*.12));s+=line(qx,qy,px,py,{color,w:3,opacity:.35});}
  s+=dot(px,py,r,color);
 }
 return fade(g,s);
}
// ---- a thermometer: bulb at (x,bot); level in px above bulb top ------------------------------
export function thermo(x,top,bot,level,{color=TC,g=1,w=20}={}){
 let s=rect(x-w/2,top,w,bot-top,{fill:'#0f1a30',fo:1,stroke:C.dim,sw:2,rx:w/2});
 s+=rect(x-w/2+5,Math.max(top+4,bot-level),w-10,Math.min(bot-top-4,level)+8,{fill:color,fo:.95,stroke:'none',rx:4});
 s+=dot(x,bot+w*.9,w*1.05,color)+ring(x,bot+w*.9,w*1.05,{color:C.dim,w:2});
 return fade(g,s);
}
// ---- containers ------------------------------------------------------------------------------
export function beaker(x,gy,w,h,{water=WATER,fo=.35,level=.75,g=1,text='',tsize=26,tcolor=C.ink}={}){
 let s=rect(x-w/2,gy-h*level,w,h*level,{fill:water,fo,stroke:'none',rx:4});
 s+=`<path d="M${x-w/2} ${gy-h} L${x-w/2} ${gy} L${x+w/2} ${gy} L${x+w/2} ${gy-h}" fill="none" stroke="${C.dim}" stroke-width="3"/>`;
 if(text)s+=label(text,x,gy+36,{size:tsize,color:tcolor,anchor:'middle',weight:700});
 return fade(g,s);
}
export const steam=(x,y,t,{g=1,color='#c9d6ea'}={})=>{let s='';for(let i=0;i<3;i++){const o=(t*.6+i/3)%1;const yy=y-o*60,xx=x+(i-1)*22;s+=fade((1-o)*.8,`<path d="M${xx} ${yy} q10 -12 0 -24 q-10 -12 0 -24" fill="none" stroke="${color}" stroke-width="3"/>`);}return fade(g,s);};
export const ice=(x,y,s=34)=>rect(x-s/2,y-s/2,s,s,{fill:'#d8f1ff',fo:.55,stroke:'#eaf8ff',sw:2,rx:6});
export function hand(x,y,{o=1,flip=1}={}){ // a flat hand reaching down; fingertips at (x,y)
 return fade(o,rect(x-18,y-110,36,110,{fill:'#e9c7a6',fo:.95,stroke:'none',rx:16})+rect(x-30,y-170,60,70,{fill:'#e9c7a6',fo:.95,stroke:'none',rx:18}));
}
// magnifier ring with content inside an inscribed square
export function lens(cx,cy,R,inner,{g=1,color=C.dim}={}){
 return fade(g,ring(cx,cy,R,{color,w:4,fill:'#0f1a30'})+inner+line(cx+R*.72,cy+R*.72,cx+R*1.2,cy+R*1.2,{color,w:9}));
}
// pendulum with decaying swing
function pendulum(px,py,L,th,{g=1}={}){
 const bx=px+L*Math.sin(th),by=py+L*Math.cos(th);
 return fade(g,line(px-60,py,px+60,py,{color:C.dim,w:4})+line(px,py,bx,by,{color:C.dim,w:2.5})+dot(bx,by,22,'#c9d2e3')+ring(bx,by,22,{color:'#eef3fb',w:1.5}));
}
// two-scale thermometer pair: ℃ (left) and K (right). kpx = px per kelvin, base y = 0 K
export const SC={y0:470,k:1.0,xl:330,xr:650};
export const yK=Kv=>SC.y0-SC.k*Kv;
export function scales({g=1,showK=1,level=300,ticksC=[[100,373],[0,273],[-273,0]],hl=[],brace273=0,xl=SC.xl,xr=SC.xr}={}){
 let s=fade(g,thermo(xl,yK(400),SC.y0,SC.y0-yK(level),{color:TC})+label('セ氏（℃）',xl,yK(400)-18,{size:26,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(g*showK,thermo(xr,yK(400),SC.y0,SC.y0-yK(level),{color:TC})+label('絶対温度（K）',xr,yK(400)-18,{size:26,color:TC,anchor:'middle',weight:700}));
 for(const [c,k] of ticksC){
  const y=yK(k),h=hl.includes(c);
  const col=h?C.hi:C.ink;
  s+=fade(g,line(xl+12,y,xl+34,y,{color:col,w:2.5})+label(`${c<0?'−'+(-c):c}℃`,xl-24,y+(c===27?-2:c===0&&ticksC.some(q=>q[0]===27)?14:8),{size:22,color:col,anchor:'end',weight:h?700:400}));
  s+=fade(g*showK,line(xr-34,y,xr-12,y,{color:col,w:2.5})+label(`${k} K`,xr+26,y+(k===300?-2:k===273&&ticksC.some(q=>q[0]===27)?14:8),{size:22,color:h?C.hi:TC,weight:h?700:400}));
  if(h)s+=fade(g*showK,line(xl+40,y,xr-40,y,{color:C.hi,w:2,dash:'6 6'}));
 }
 return s;
}

export const hsTHeat1Diagrams={
 // ================= S1 力学の最後の問い =================
 [K+'q']:(p,ctx)=>{
  const t=sceneT(p,ctx),A=.6*Math.exp(-2.4*p),th=A*Math.sin(2*Math.PI*.9*t);
  let s=pendulum(260,70,260,th);
  s+=fade(.35,`<path d="M${260+260*Math.sin(-.6)} ${70+260*Math.cos(-.6)} A260 260 0 0 0 ${260+260*Math.sin(.6)} ${70+260*Math.cos(.6)}" fill="none" stroke="${C.faint}" stroke-width="2" stroke-dasharray="6 6"/>`);
  // energy bar shrinks, air thermometer rises a hair
  const E=Math.exp(-2.6*p);
  s+=rect(640,430-260*E,90,260*E,{fill:QC,fo:.55,stroke:QC,sw:2,rx:6})+line(620,430,750,430,{color:C.dim,w:2});
  s+=label('力学的',685,470,{size:24,color:QC,anchor:'middle',weight:700})+label('エネルギー',685,500,{size:24,color:QC,anchor:'middle',weight:700});
  s+=thermo(950,140,400,120+40*seg(p,.45,.95));
  s+=fade(seg(p,.5,.7),label('空気の 温度',950,110,{size:26,color:TC,anchor:'middle',weight:700})+arrow(900,300,900,250,{color:TC,w:4,head:14})+label('ほんの 少し 上がる',880,280,{size:24,color:TC,anchor:'end'}));
  return s;
 },
 [K+'q2']:(p,ctx)=>{
  let s=fade(.25,pendulum(260,70,260,0));
  s+=card(230,110,740,230,label('温度が 高い とは',600,190,{size:36,color:TC,anchor:'middle',weight:700})+label('物の 中で 何が 起きている？',600,275,{size:42,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'touch']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=beaker(330,440,220,230,{water:HOT,fo:.2,text:'お湯'})+steam(330,250,t);
  s+=beaker(870,440,220,230,{water:COLD,fo:.3,text:'氷水'})+ice(830,300)+ice(900,320)+ice(865,285,28);
  s+=hand(330,300+60*(1-seg(p,.05,.3)),{o:seg(p,.05,.2)})+hand(870,300+60*(1-seg(p,.5,.75)),{o:seg(p,.5,.65)});
  s+=fade(seg(p,.25,.4),label('熱い！',480,180,{size:36,color:HOT,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('冷たい！',1040,180,{size:36,color:COLD,anchor:'middle',weight:700}));
  return s;
 },
 [K+'touch2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=beaker(330,440,220,230,{water:HOT,fo:.2,text:'お湯'})+steam(330,250,t)+beaker(870,440,220,230,{water:COLD,fo:.3,text:'氷水'})+ice(830,300)+ice(900,320)+ice(865,285,28);
  s+=fade(seg(p,.05,.25),label('どちらも 透明な 水',600,110,{size:32,color:C.ink,anchor:'middle',weight:700}));
  s+=lens(330,330,70,label('？',330,348,{size:52,color:C.hi,anchor:'middle',weight:700}),{g:seg(p,.5,.65)});
  s+=lens(870,330,70,label('？',870,348,{size:52,color:C.hi,anchor:'middle',weight:700}),{g:seg(p,.55,.7)});
  return s;
 },
 [K+'guess']:(p,ctx)=>{
  let s=fade(.3,beaker(330,440,220,230,{water:HOT,fo:.2,text:'お湯'})+beaker(870,440,220,230,{water:COLD,fo:.3,text:'氷水'}));
  s+=card(300,120,600,190,label('水の 中で',600,190,{size:34,color:C.ink,anchor:'middle'})+label('何が 違う？',600,262,{size:46,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
 // ================= S2 温度の正体 =================
 [K+'model']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.6,beaker(200,440,200,220,{water:WATER,fo:.3,text:'水'}));
  s+=fade(seg(p,.05,.25),line(300,280,470,120,{color:C.faint,w:2,dash:'6 6'})+line(300,400,470,460,{color:C.faint,w:2,dash:'6 6'}));
  s+=molBox({x:470,y:60,w:520,h:400,n:26,dist:150*t,speed:150,seed:3,color:'#9fd0ff',g:seg(p,.1,.3)});
  s+=fade(seg(p,.25,.4),label('分子',1010,110,{size:28,color:'#9fd0ff',weight:700}));
  s+=fade(seg(p,.55,.7),label('たえず 不規則に 動く',730,500,{size:28,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'model2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.6,beaker(200,440,200,220,{water:WATER,fo:.3,text:'水'}));
  s+=fade(.5,line(300,280,470,120,{color:C.faint,w:2,dash:'6 6'})+line(300,400,470,460,{color:C.faint,w:2,dash:'6 6'}));
  s+=molBox({x:470,y:60,w:520,h:400,n:26,dist:150*t,speed:150,seed:3,color:'#9fd0ff'});
  s+=label('熱運動',1010,110,{size:30,color:C.hi,weight:700});
  s+=tag('モデル',1070,180,{color:C.dim,g:seg(p,.45,.6)});
  return s;
 },
 [K+'cmp']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(seg(p,.05,.2),label('冷たい 水',330,60,{size:30,color:COLD,anchor:'middle',weight:700}));
  s+=molBox({x:100,y:85,w:460,h:300,n:18,dist:60*t,speed:60,seed:7,color:COLD,g:seg(p,.05,.2)});
  s+=label('お湯',870,60,{size:30,color:HOT,anchor:'middle',weight:700});
  s+=molBox({x:640,y:85,w:460,h:300,n:18,dist:330*t,speed:330,seed:7,color:HOT});
  s+=fade(seg(p,.55,.7),label('速い・激しい',870,432,{size:30,color:HOT,anchor:'middle',weight:700}));
  return s;
 },
 [K+'cmp2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=label('冷たい 水',330,60,{size:30,color:COLD,anchor:'middle',weight:700})+molBox({x:100,y:85,w:460,h:300,n:18,dist:60*t,speed:60,seed:7,color:COLD});
  s+=label('お湯',870,60,{size:30,color:HOT,anchor:'middle',weight:700})+molBox({x:640,y:85,w:460,h:300,n:18,dist:330*t,speed:330,seed:7,color:HOT});
  s+=label('速い・激しい',870,432,{size:30,color:HOT,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.2),label('ゆっくり',330,432,{size:30,color:COLD,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('違い ＝ 動きの 激しさ',600,490,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'def']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.45,molBox({x:100,y:250,w:300,h:200,n:10,dist:60*t,speed:60,seed:7,color:COLD})+molBox({x:800,y:250,w:300,h:200,n:10,dist:330*t,speed:330,seed:7,color:HOT}));
  s+=label('低い',250,490,{size:28,color:COLD,anchor:'middle',weight:700})+label('高い',950,490,{size:28,color:HOT,anchor:'middle',weight:700});
  s+=card(200,40,800,170,label('温度 ＝ 分子 1個あたりの',600,105,{size:34,color:TC,anchor:'middle',weight:700})+label('運動の 激しさの 目安',600,165,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),TC);
  s+=tag('モデルで 見た 温度の 意味',600,330,{color:C.dim,g:seg(p,.6,.75),size:22});
  return s;
 },
 // ================= S3 温度と、エネルギーの合計 =================
 [K+'cup']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=beaker(230,440,110,140,{water:HOT,fo:.3,text:'コップ 1杯'})+steam(230,300,t);
  s+=fade(seg(p,.15,.3),rect(480,300,620,140,{fill:HOT,fo:.3,stroke:'none',rx:4})+`<path d="M470 260 L470 440 L1110 440 L1110 260" fill="none" stroke="${C.dim}" stroke-width="3"/>`+label('浴槽 1杯',790,476,{size:26,color:C.ink,anchor:'middle',weight:700})+steam(790,280,t));
  s+=thermo(270,190,400,0,{g:0})+'';
  s+=fade(seg(p,.55,.7),thermo(275,170,370,140)+label('60℃',275,150,{size:28,color:TC,anchor:'middle',weight:700})+thermo(1040,110,370,140)+label('60℃',1040,90,{size:28,color:TC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'cup2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.5,beaker(230,440,110,140,{water:HOT,fo:.3,text:'コップ 1杯'})+rect(480,300,620,140,{fill:HOT,fo:.3,stroke:'none',rx:4})+`<path d="M470 260 L470 440 L1110 440 L1110 260" fill="none" stroke="${C.dim}" stroke-width="3"/>`+label('浴槽 1杯',790,476,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(.5,thermo(275,170,370,140)+thermo(1040,110,370,140));
  s+=card(330,70,540,150,label('温度は 同じ 60℃',600,128,{size:30,color:TC,anchor:'middle',weight:700})+label('エネルギーも 同じ？',600,190,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'zoom']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=label('コップ',200,50,{size:28,color:C.ink,anchor:'middle',weight:700})+label('浴槽',780,50,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=molBox({x:110,y:80,w:180,h:180,n:5,dist:260*t,speed:260,seed:11,color:HOT});
  s+=molBox({x:420,y:80,w:720,h:300,n:60,dist:260*t,speed:260,seed:12,color:HOT,r:7});
  s+=fade(seg(p,.1,.25),label('1個の 激しさ：同じ',600,440,{size:30,color:TC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('違う のは 分子の 数',600,495,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'count']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=label('コップ',200,50,{size:28,color:C.ink,anchor:'middle',weight:700})+label('浴槽',780,50,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=molBox({x:110,y:80,w:180,h:180,n:5,dist:260*t,speed:260,seed:11,color:HOT});
  s+=molBox({x:420,y:80,w:720,h:300,n:60,dist:260*t,speed:260,seed:12,color:HOT,r:7});
  s+=fade(seg(p,.05,.2),label('200 g',200,300,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.2,.35),label('200 kg',780,420,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=card(300,440,600,66,label('分子の 数：約 1000 倍',600,485,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  s+=fade(seg(p,.8,.95),label('（図の 点は 一部）',1140,420,{size:22,color:C.dim,anchor:'end'}));
  return s;
 },
 [K+'total']:(p,ctx)=>{
  let s=label('分子の 運動の エネルギーを 全員分 足す',600,60,{size:30,color:QC,anchor:'middle',weight:700});
  // cup: 5 small blocks; bath: big stack
  const bx=(x,y,o)=>rect(x,y,34,34,{fill:QC,fo:.6,stroke:QC,sw:1.5,rx:4,opacity:o});
  let c='';for(let i=0;i<5;i++)c+=bx(150+i*38,380,seg(p,.05+i*.03,.12+i*.03));
  s+=c+label('コップ',245,460,{size:28,color:C.ink,anchor:'middle',weight:700});
  let b='';for(let r=0;r<6;r++)for(let i=0;i<14;i++){const k=r*14+i;b+=bx(520+i*38,380-r*38,seg(p,.2+k*.004,.3+k*.004));}
  s+=b+label('浴槽',785,460,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=card(760,90,400,70,label('合計 も 約 1000 倍',960,137,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  s+=fade(seg(p,.6,.75),label('（ブロックの 数は 図の ため）',1140,500,{size:22,color:C.dim,anchor:'end'}));
  return s;
 },
 [K+'fix']:(p,ctx)=>{
  let s=card(150,80,900,150,label('固定：1個 あたりの 激しさ',420,145,{size:32,color:C.ink,anchor:'middle',weight:700})+label('→ 温度（60℃）',830,145,{size:34,color:TC,anchor:'middle',weight:700})+label('同じ',600,200,{size:26,color:C.dim,anchor:'middle'}),seg(p,.05,.2),TC);
  s+=card(150,270,900,150,label('変える：個数',420,335,{size:32,color:C.ink,anchor:'middle',weight:700})+label('→ 合計の エネルギー',830,335,{size:34,color:QC,anchor:'middle',weight:700})+label('約 1000 倍',600,390,{size:26,color:C.dim,anchor:'middle'}),seg(p,.55,.7),QC);
  return s;
 },
 [K+'so']:(p,ctx)=>{
  let s=card(200,50,800,110,label('温度 ≠ エネルギーの 合計',600,120,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  s+=fade(seg(p,.45,.6),beaker(250,440,90,110,{water:HOT,fo:.3,text:'コップ'})+rect(520,340,560,100,{fill:HOT,fo:.3,stroke:'none',rx:4})+`<path d="M510 300 L510 440 L1090 440 L1090 300" fill="none" stroke="${C.dim}" stroke-width="3"/>`+label('浴槽',800,476,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),arrow(330,320,400,260,{color:QC,w:4,head:14})+arrow(820,290,820,200,{color:QC,w:8,head:22})+arrow(700,290,640,200,{color:QC,w:8,head:22})+arrow(940,290,1000,200,{color:QC,w:8,head:22}));
  s+=fade(seg(p,.75,.9),label('長く 暖める',820,190,{size:28,color:QC,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S4 絶対温度 T =================
 [K+'cool']:(p,ctx)=>{
  const t=sceneT(p,ctx),v0=300,v1=40;
  const d=v0*t-(v0-v1)*Math.min(t,ctx?.dur||8)**2/(2*(ctx?.dur||8));
  const sp=mix(v0,v1,clamp(p));
  const col=p<.5?HOT:COLD;
  let s=molBox({x:120,y:70,w:560,h:380,n:22,dist:d,speed:sp,seed:21,color:p<.45?HOT:p<.6?'#c9b0c8':COLD});
  s+=thermo(900,90,400,280*(1-.7*seg(p,.05,.95)));
  s+=fade(seg(p,.1,.25),arrow(990,140,990,330,{color:COLD,w:5,head:18})+label('冷やす',1010,240,{size:28,color:COLD,weight:700}));
  s+=fade(seg(p,.55,.7),label('おとなしく なる',400,495,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'limit']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=molBox({x:120,y:70,w:560,h:380,n:22,dist:40*t,speed:40,seed:21,color:COLD});
  s+=thermo(900,90,400,84*(1-.85*seg(p,.05,.45)));
  s+=fade(seg(p,.1,.3),label('どこまでも 下がる？',900,60,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),line(840,404,960,404,{color:C.hi,w:4})+label('下限',980,412,{size:30,color:C.hi,weight:700}));
  s+=tag('実験から 分かる',900,480,{color:C.dim,g:seg(p,.6,.75),size:22});
  return s;
 },
 [K+'zero']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=molBox({x:120,y:70,w:560,h:380,n:22,dist:40*t,speed:40,seed:21,color:COLD,g:.5});
  s+=thermo(900,90,400,13)+line(840,404,960,404,{color:C.hi,w:4})+label('下限',980,412,{size:30,color:C.hi,weight:700});
  s+=card(170,160,460,170,label('−273℃',400,235,{size:56,color:C.hi,anchor:'middle',weight:700})+label('絶対零度',400,300,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'quantum']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=molBox({x:120,y:70,w:560,h:380,n:22,dist:0,speed:0,seed:21,color:COLD,jit:2.5,time:t});
  s+=card(740,120,400,250,label('完全には',940,190,{size:30,color:C.ink,anchor:'middle',weight:700})+label('止まらない',940,240,{size:30,color:C.ink,anchor:'middle',weight:700})+label('ごく 小さな 運動が 残る',940,310,{size:26,color:C.dim,anchor:'middle'}),seg(p,.1,.25));
  s+=fade(seg(p,.55,.7),label('（量子力学）',940,410,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'abs']:(p)=>{
  let s=scales({g:1,showK:seg(p,.15,.35),level:0,ticksC:[[-273,0]]});
  s+=card(800,130,360,200,label('絶対温度',980,185,{size:30,color:C.ink,anchor:'middle',weight:700})+T2(Tt,980,255,{size:56})+label('単位：K（ケルビン）',980,310,{size:26,color:TC,anchor:'middle',weight:700}),seg(p,.4,.6),TC);
  return s;
 },
 [K+'scale']:(p)=>{
  let s=scales({level:300});
  s+=fade(seg(p,.1,.3),highlight2(SC.xl+40,yK(373),SC.xr-SC.xl-80,yK(273)-yK(373)));
  s+=fade(seg(p,.1,.3),label('幅は 同じ',(SC.xl+SC.xr)/2,yK(323)+8,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=card(820,180,330,170,label('0 の 位置だけ',985,240,{size:28,color:C.ink,anchor:'middle',weight:700})+label('273 ずれる',985,300,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'def2']:(p)=>{
  let s=fade(.5,scales({level:300,xl:200,xr:430}));
  s+=card(560,110,610,190,T2(Tt+'=',640,205,{size:52,anchor:'start'})+label('セ氏温度の 数値 ＋ 273',745,222,{size:34,color:C.ink,weight:700}),seg(p,.05,.25),TC);
  s+=tag('定義',850,370,{color:C.hi,g:seg(p,.7,.85)});
  return s;
 },
 [K+'ex']:(p)=>{
  let s=scales({level:300,ticksC:[[100,373],[27,300],[0,273],[-273,0]],hl:seg(p,.05,.15)>.5?(p<.55?[27]:[27,0]):[]});
  s+=card(820,100,350,120,T2('27+273=300',995,160,{size:40,auto:false}),seg(p,.1,.25),TC);
  s+=card(820,250,350,120,T2('0+273=273',995,310,{size:40,auto:false}),seg(p,.6,.75),TC);
  return s;
 },
 [K+'ex2']:(p)=>{
  let s=scales({level:300,ticksC:[[100,373],[27,300],[0,273],[-273,0]],hl:[27,0,-273]});
  s+=card(820,100,350,120,T2('-273+273=0',995,160,{size:40,auto:false}),seg(p,.05,.2),TC);
  s+=card(820,250,350,120,label('絶対零度 ＝ 0 K',995,320,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'exact']:(p)=>{
  let s=fade(.45,scales({level:300,hl:[0]}));
  s+=card(800,110,370,240,label('正確には',985,175,{size:28,color:C.dim,anchor:'middle'})+label('273.15',985,230,{size:40,color:C.ink,anchor:'middle',weight:700})+label('計算では 273',985,310,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2));
  return s;
 },
 [K+'diff']:(p)=>{
  // zoomed scales: 20..30 ℃ ↔ 293..303 K, 22 px per kelvin
  const yy=c=>420-(c-18)*22,xl=300,xr=620;
  let s=label('セ氏（℃）',xl,70,{size:26,color:C.ink,anchor:'middle',weight:700})+label('絶対温度（K）',xr,70,{size:26,color:TC,anchor:'middle',weight:700});
  s+=line(xl,yy(17),xl,yy(32),{color:C.dim,w:3})+line(xr,yy(17),xr,yy(32),{color:C.dim,w:3});
  for(let c=18;c<=31;c++){const big=c%5===0;s+=line(xl,yy(c),xl+(big?22:12),yy(c),{color:C.dim,w:2})+line(xr-(big?22:12),yy(c),xr,yy(c),{color:C.dim,w:2});}
  for(const c of [20,30]){s+=label(`${c}℃`,xl-16,yy(c)+8,{size:26,color:C.ink,anchor:'end',weight:700})+label(`${c+273} K`,xr+16,yy(c)+8,{size:26,color:TC,weight:700})+line(xl+30,yy(c),xr-30,yy(c),{color:C.hi,w:2,dash:'6 6'});}
  s+=fade(seg(p,.1,.25),arrow(xl-110,yy(20),xl-110,yy(30),{color:C.hi,w:4,head:14})+label('10 目盛り',xl-120,yy(25)+8,{size:24,color:C.hi,anchor:'end',weight:700}));
  s+=fade(seg(p,.1,.25),arrow(xr+140,yy(20),xr+140,yy(30),{color:C.hi,w:4,head:14}));
  s+=card(820,110,350,250,label('温度の 差',995,170,{size:30,color:C.ink,anchor:'middle',weight:700})+T2('30-20=10',995,235,{size:38,auto:false})+T2('303-293=10',995,300,{size:38,auto:false,color:TC}),seg(p,.55,.7),C.hi);
  s+=fade(seg(p,.75,.9),label('10 K の 差',995,410,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'prop']:(p)=>{
  let s=card(150,90,900,200,label('分子の 運動エネルギーの 平均',600,160,{size:34,color:QC,anchor:'middle',weight:700})+label('は',600,215,{size:28,color:C.dim,anchor:'middle'})+fade(1,T2(Tt,520,262,{size:44}))+label('に 比例',640,268,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.25),TC);
  s+=card(330,340,540,90,label('→ 状態方程式の 回で 導く',600,397,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 // ================= S5 熱とは何か =================
 [K+'tea']:(p,ctx)=>{
  const t=sceneT(p,ctx),w=seg(p,.35,.95);
  let s=beaker(420,440,280,220,{water:'#c08040',fo:.45,text:'熱い お茶'})+steam(420,240,t);
  const sx=560-60*seg(p,.05,.3),sy=150+80*seg(p,.05,.3);
  const sc=`rgb(${Math.round(mix(160,255,w))},${Math.round(mix(175,170,w))},${Math.round(mix(200,110,w))})`;
  s+=`<g transform="rotate(20 ${sx} ${sy})">${rect(sx-8,sy,16,230,{fill:sc,fo:.95,stroke:'none',rx:8})+`<ellipse cx="${sx}" cy="${sy-20}" rx="22" ry="34" fill="${sc}"/>`}</g>`;
  s+=fade(seg(p,.05,.2),label('冷たい スプーン',760,140,{size:26,color:COLD,weight:700}));
  s+=fade(seg(p,.4,.55),label('温まる',760,190,{size:26,color:HOT,weight:700}));
  s+=fade(seg(p,.65,.8),label('少し 冷める',150,300,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.35,.55),FA(330,370,450,320,{color:QC,w:7,head:20}));
  return s;
 },
 [K+'mol']:(p,ctx)=>{
  const t=sceneT(p,ctx),amp=2+7*seg(p,.3,.95);
  let s=label('お茶',300,50,{size:30,color:HOT,anchor:'middle',weight:700})+label('スプーン',860,50,{size:30,color:COLD,anchor:'middle',weight:700});
  s+=molBox({x:80,y:80,w:440,h:360,n:16,dist:320*t,speed:320,seed:31,color:HOT});
  s+=rect(600,80,520,360,{fill:'#0f1a30',fo:.9,stroke:C.faint,sw:2,rx:10});
  for(let r=0;r<6;r++)for(let c=0;c<8;c++){const x=640+c*62,y=115+r*60,a=amp*(1-c/12);s+=dot(x+a*Math.sin(t*21+r*1.3+c*2.1),y+a*Math.cos(t*17+c*1.1+r),9,mix(0,1,w2(p))>.5&&c<4?'#d7b0a0':COLD);}
  s+=line(560,80,560,440,{color:C.dim,w:3});
  s+=fade(seg(p,.35,.55),FA(470,260,660,260,{color:QC,w:8,head:24})+label('エネルギーを 渡す',565,480,{size:28,color:QC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('揺れが 激しく なる',860,480,{size:26,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'heat']:(p)=>{
  let s=fade(.35,beaker(220,440,220,180,{water:'#c08040',fo:.45,text:''}));
  s+=fade(.5,FA(160,360,300,300,{color:QC,w:7,head:20}));
  s+=card(420,70,730,250,label('熱',530,160,{size:40,color:QC,anchor:'middle',weight:700})+T2(Qt,600,150,{size:50})+label('温度差に よって 移る エネルギー',790,235,{size:32,color:C.ink,anchor:'middle',weight:700})+label('単位：J（ジュール）',790,290,{size:28,color:QC,anchor:'middle',weight:700}),seg(p,.05,.25),QC);
  s+=tag('定義',600,380,{color:C.hi,g:seg(p,.3,.45)});
  s+=fade(seg(p,.55,.7),label('熱量 とも 言う',930,390,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'dir']:(p)=>{
  let s=rect(120,170,260,180,{fill:HOT,fo:.3,stroke:HOT,sw:2,rx:12})+label('高温',250,272,{size:34,color:HOT,anchor:'middle',weight:700});
  s+=rect(820,170,260,180,{fill:COLD,fo:.3,stroke:COLD,sw:2,rx:12})+label('低温',950,272,{size:34,color:COLD,anchor:'middle',weight:700});
  s+=FA(400,230,800,230,{color:QC,w:10,head:28,g:seg(p,.05,.35)})+fade(seg(p,.2,.35),label('熱 Q',600,200,{size:30,color:QC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),arrow(800,310,400,310,{color:C.dim,w:5,head:18})+label('✕',600,325,{size:44,color:C.a,anchor:'middle',weight:700})+label('ひとりでには 起こらない',600,390,{size:26,color:C.dim,anchor:'middle'}));
  s+=tag('法則（経験）',600,470,{color:C.F,g:seg(p,.3,.45),size:22});
  return s;
 },
 [K+'fridge']:(p)=>{
  let s=rect(430,100,340,330,{fill:'#16233d',fo:1,stroke:C.dim,sw:3,rx:14})+label('冷蔵庫',600,90,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=rect(470,150,260,220,{fill:COLD,fo:.25,stroke:COLD,sw:2,rx:8})+label('低温',600,270,{size:30,color:COLD,anchor:'middle',weight:700});
  s+=label('外（高温）',1000,180,{size:28,color:HOT,anchor:'middle',weight:700});
  s+=FA(700,300,1000,300,{color:QC,w:8,head:24,g:seg(p,.3,.6)})+fade(seg(p,.45,.6),label('熱',1000,345,{size:28,color:QC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.05,.25),FA(150,300,430,300,{color:'#b49bff',w:6,head:20})+label('電気の 仕事',230,270,{size:26,color:'#b49bff',anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('流れに 逆らって 運ぶ',600,480,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'store']:(p)=>{
  let s=rect(380,130,440,260,{fill:HOT,fo:.2,stroke:HOT,sw:2,rx:16});
  s+=rect(470,220,260,140,{fill:UC,fo:.45,stroke:UC,sw:2,rx:8})+label('内部エネルギー',600,300,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=label('物',600,180,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.2),FA(160,260,370,260,{color:QC,w:8,head:24})+label('熱 Q（移る 途中）',230,220,{size:26,color:QC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),label('ためている 量',1000,280,{size:28,color:UC,anchor:'middle',weight:700})+arrow(910,285,740,285,{color:UC,w:4,head:14}));
  s+=fade(seg(p,.55,.7),label('「熱」とは 呼ばない',1000,330,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'mis']:(p)=>{
  let s=card(150,60,900,120,label('✕ 熱い 物は 熱を たくさん 持っている',600,135,{size:34,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=card(150,220,900,190,label('○ 持っているのは 内部エネルギー',600,290,{size:34,color:UC,anchor:'middle',weight:700})+label('熱は 移る 途中の 量',600,360,{size:34,color:QC,anchor:'middle',weight:700}),seg(p,.5,.65),C.F);
  return s;
 },
 [K+'rub']:(p,ctx)=>{
  const t=sceneT(p,ctx),o=Math.sin(t*9)*40*seg(p,.02,.15);
  let s=`<g transform="rotate(-8 400 280)">${rect(260+o,230,280,60,{fill:'#e9c7a6',fo:.95,stroke:'none',rx:26})}</g><g transform="rotate(8 400 330)">${rect(260-o,300,280,60,{fill:'#d9b293',fo:.95,stroke:'none',rx:26})}</g>`;
  s+=fade(seg(p,.1,.25),label('こする 仕事',400,180,{size:30,color:'#ff9440',anchor:'middle',weight:700}));
  s+=card(680,140,460,110,label('✕ 熱が 入った',910,208,{size:32,color:C.dim,anchor:'middle',weight:700}),seg(p,.25,.4));
  s+=card(680,280,460,130,label('○ 仕事で',910,330,{size:30,color:C.ink,anchor:'middle',weight:700})+label('内部エネルギーが 増えた',910,385,{size:30,color:UC,anchor:'middle',weight:700}),seg(p,.6,.75),UC);
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=molBox({x:100,y:150,w:420,h:320,n:16,dist:330*t,speed:330,seed:7,color:HOT});
  s+=card(600,170,540,200,label('温度が 高い',870,235,{size:34,color:TC,anchor:'middle',weight:700})+label('＝ 分子が 激しく 動く',870,310,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.5),TC);
  return s;
 },
 [K+'ans2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=beaker(330,440,240,240,{water:HOT,fo:.2,text:'お湯'})+steam(330,230,t)+hand(330,330);
  s+=molBox({x:240,y:330,w:180,h:100,n:6,dist:330*t,speed:330,seed:41,color:HOT,frame:false,r:7});
  s+=fade(seg(p,.3,.5),FA(470,360,640,260,{color:QC,w:8,head:24})+label('熱',600,350,{size:30,color:QC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),label('手へ 移る',820,250,{size:32,color:C.ink,anchor:'middle',weight:700})+label('→ 熱いと 感じる',840,310,{size:30,color:HOT,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ans3']:(p,ctx)=>{
  const t=sceneT(p,ctx),A=.5*Math.exp(-3*p),th=A*Math.sin(2*Math.PI*.9*t);
  let s=pendulum(220,60,250,th);
  const E=Math.exp(-4*p);
  s+=rect(440,420-200*E,70,200*E,{fill:QC,fo:.55,stroke:QC,sw:2,rx:6})+line(425,420,525,420,{color:C.dim,w:2})+label('力学的',475,455,{size:22,color:QC,anchor:'middle',weight:700})+label('エネルギー',475,482,{size:22,color:QC,anchor:'middle',weight:700});
  s+=fade(seg(p,.15,.3),FA(540,300,660,300,{color:QC,w:7,head:20}));
  s+=molBox({x:690,y:110,w:450,h:300,n:16,dist:(120+80*p)*t,speed:120+80*p,seed:51,color:'#9fd0ff',g:seg(p,.1,.25)});
  s+=fade(seg(p,.2,.35),label('空気の 分子の 不規則な 運動',915,90,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('温度が 少し 上がる',915,460,{size:30,color:TC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=beaker(330,400,200,180,{water:WATER,fo:.35,text:'水'})+rect(760,300,200,100,{fill:'#8c97ad',fo:.9,stroke:'#d5dbe6',sw:2,rx:6})+label('鉄',860,436,{size:26,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.2),FA(260,505,260,425,{color:QC,w:8,head:22})+FA(790,505,790,425,{color:QC,w:8,head:22})+label('同じ 熱',600,480,{size:30,color:QC,anchor:'middle',weight:700}));
  s+=thermo(450,140,350,40+30*seg(p,.3,.9))+thermo(1000,140,300,30+180*seg(p,.55,.95));
  s+=fade(seg(p,.4,.55),label('なかなか 上がらない',330,120,{size:26,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.75,.9),label('すぐ 熱く なる',860,120,{size:26,color:HOT,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next2']:(p)=>{
  let s=fade(.3,beaker(330,400,200,180,{water:WATER,fo:.35,text:'水'})+rect(760,300,200,100,{fill:'#8c97ad',fo:.9,stroke:'#d5dbe6',sw:2,rx:6}));
  s+=card(250,110,700,200,label('温まり方の 違いを',600,180,{size:34,color:C.ink,anchor:'middle'})+label('どんな 数で 表す？',600,260,{size:46,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'bye']:(p)=>card(300,150,600,170,label('熱と温度',600,215,{size:34,color:C.ink,anchor:'middle',weight:700})+label('深く 学ぶ 2/2 へ',600,280,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
function highlight2(x,y,w,h){return rect(x,y,w,h,{fill:C.hi,fo:.06,stroke:C.hi,sw:2,rx:8});}
function w2(p){return seg(p,.4,.9);}

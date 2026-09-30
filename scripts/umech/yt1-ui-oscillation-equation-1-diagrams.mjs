// YouTube シリーズ 振動の方程式・初級 1/2（ステージ ui-oscillation-equation 本0〜本2）— 図。Stage 1200×515.
// 色：位置・ずれ x 水色、速度 v 紫、加速度 a 赤、力 F 緑、時刻 t 金、ω 桃（微分の法則 2/2 と同じ）、強調 黄。
import {C,clamp,mix,smooth,seg,fmt,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,tex,texWidth,wall,ground,block,spring} from './anim.mjs';

const K='ui-oscillation-equation-1:';
const CW=C.p,CU=C.E;
const W=`{\\color{${CW}}\\omega}`;
const XDD=`\\dfrac{d^2x}{dt^2}`,XD=`\\dot{x}`,XDOT2=`\\ddot{x}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:C.F,weight:700}));
const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:34,color:C.a,weight:700}));
const P=(cx,cy,R,th)=>[cx+R*Math.cos(th),cy-R*Math.sin(th)];

// ---- spring + block on a smooth floor. d = displacement [m] (right positive) -------------------
function rig(d,{ox=600,y=400,sc=1500,wx=180,x0lab=1,xArr=0,fArr=0,aArr=0,vArr=0,v=0,fk=1,g=1,bw=110,bh=90,mtext='m'}={}){
 const bx=ox+d*sc;
 let s=ground(wx-10,1150,y)+wall(wx,y-170,y);
 s+=spring(wx,bx-bw/2,y-bh/2,{coils:10,amp:16,color:C.dim,w:3});
 s+=block(bx,y,bw,bh,{color:C.x,text:mtext,size:30,fo:.22});
 if(x0lab)s+=line(ox,y-bh-70,ox,y+14,{color:C.dim,w:2,dash:'7 7'})+label('x ＝ 0',ox,y+46,{size:24,color:C.dim,anchor:'middle'});
 const ya=y-bh-66;
 if(xArr&&Math.abs(d)>.004)s+=fade(xArr,arrow(ox,ya,bx,ya,{color:C.x,w:5,head:16})+label('x',(ox+bx)/2,ya-14,{size:28,color:C.x,anchor:'middle',weight:700}));
 const L=-d*sc*fk;
 if(fArr&&Math.abs(d)>.004)s+=fade(fArr,arrow(bx,y-bh-20,bx+L,y-bh-20,{color:C.F,w:6,head:18})+label('F',bx+L+(L<0?-14:14),y-bh-10,{size:28,color:C.F,anchor:L<0?'end':'start',weight:700}));
 if(aArr&&Math.abs(d)>.004)s+=fade(aArr,arrow(bx,y+40,bx+L,y+40,{color:C.a,w:6,head:18})+label('a',bx+L+(L<0?-14:14),y+50,{size:28,color:C.a,anchor:L<0?'end':'start',weight:700}));
 if(vArr&&Math.abs(v)>.02)s+=fade(vArr,arrow(bx,y-bh-2,bx+v*sc*.5,y-bh-2,{color:C.v,w:5,head:16})+label('v',bx+v*sc*.5+(v<0?-12:12),y-bh+4,{size:26,color:C.v,anchor:v<0?'end':'start',weight:700}));
 return fade(g,s);
}
// oscillation used in the pictures: amplitude .1 m, ω = 2 rad/s, released from +0.1 m
const osc=t=>.1*Math.cos(2*t),oscv=t=>-.2*Math.sin(2*t);

// x → v → a chain
function chain(step,{y=120,g=1}={}){
 const X=[200,600,1000],names=['x','v','a'],cols=[C.x,C.v,C.a],sub=['位置','速度','加速度'];let s='';
 X.forEach((x,i)=>{const gi=i<=step?1:0;s+=fade(gi,ring(x,y,44,{color:cols[i],w:4,fill:'#10182c'})+label(names[i],x,y+13,{size:38,color:cols[i],anchor:'middle',weight:700})+label(sub[i],x,y+86,{size:26,color:cols[i],anchor:'middle'}));
  if(i>0&&i<=step)s+=arrow(X[i-1]+52,y,x-54,y,{color:C.dim,w:3,head:14})+label('時間で微分',(X[i-1]+x)/2,y-22,{size:24,color:C.t,anchor:'middle'});});
 return fade(g,s);
}

export const ytUiOscillationEquation1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  const A=axes({x:110,y:450,w:470,h:320,xmin:0,xmax:4.4,ymin:0,ymax:110,xlabel:'t [s]',ylabel:'v [m/s]',xticks:[1,2,3,4],yticks:[50,100],xcolor:C.t,ycolor:C.v,g:seg(p,0,.15)});
  let s=A.svg+A.plot(t=>100*Math.exp(-.1*t),{from:0,to:4.2,p:seg(p,.1,.5),color:C.v,w:4});
  [100,90,81,72.9].forEach((v,i)=>{s+=fade(seg(p,.15+.08*i,.25+.08*i),dot(A.X(i),A.Y(v),8,C.hi));});
  s+=card(660,100,480,150,tex('\\dfrac{dv}{dt}=-kv',900,175,{size:52}),seg(p,0,.15));
  s+=card(660,290,480,110,label('答え ＝ 関数 v(t)',900,358,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'lastq']:(p)=>{
  let s=card(150,60,900,150,label('前回：速さの 変わり方 が 今の量 で決まる',600,105,{size:30,color:C.dim,anchor:'middle'})+tex('\\dfrac{dv}{dt}=-kv',600,170,{size:34}),1);
  s+=fade(seg(p,.3,.45),arrow(600,225,600,285,{color:C.hi,w:4}));
  s+=card(150,300,900,170,label('加速度 が 位置 で決まる ルールなら？',600,365,{size:34,color:C.hi,anchor:'middle',weight:700})+tex('a=\\;?\\;(x)',600,430,{size:44}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'spring']:(p)=>{
  const t=4*Math.PI*p;
  return rig(osc(t),{y:360})+fade(seg(p,.1,.25),label('引っぱって 離すと…',600,470,{size:30,color:C.ink,anchor:'middle'}));
 },
 [K+'ask']:(p)=>{
  const t=4*Math.PI*p;
  let s=rig(osc(t),{y:440,x0lab:0});
  s+=card(250,24,700,190,label('どんな 方程式？',600,95,{size:36,color:C.hi,anchor:'middle',weight:700})+label('その式は 何を 言っている？',600,165,{size:32,color:C.ink,anchor:'middle'}),seg(p,0,.15),C.hi);
  return s;
 },

 // ===== S2 点2つの記号 =====
 [K+'chain1']:(p)=>{
  let s=chain(seg(p,.1,.3)>.5?1:0);
  s+=fade(seg(p,.4,.6),tex('v=\\dfrac{dx}{dt}',600,370,{size:60}));
  return s;
 },
 [K+'chain2']:(p)=>{
  let s=chain(p>.15?2:1);
  s+=tex('v=\\dfrac{dx}{dt}',330,370,{size:50});
  s+=fade(seg(p,.4,.6),tex('a=\\dfrac{d^2x}{dt^2}',850,370,{size:56})+label('2回 微分',850,470,{size:26,color:C.a,anchor:'middle'}));
  return s;
 },
 [K+'two']:(p)=>{
  let s=tex('a=\\dfrac{d^2x}{dt^2}',400,200,{size:80});
  const W0=texWidth('a=\\dfrac{d^2x}{dt^2}',80),L=400-W0/2;
  s+=fade(seg(p,.1,.3),ring(L+W0*.55+45,99,26,{color:C.hi,w:3})+ring(L+W0*.86-6,214,26,{color:C.hi,w:3}));
  s+=card(720,80,440,160,label('2 ＝ 時間で 2回 微分',940,150,{size:30,color:C.hi,anchor:'middle',weight:700})+label('（2乗 ではない）',940,205,{size:26,color:C.dim,anchor:'middle'}),seg(p,.2,.4),C.hi);
  s+=fade(seg(p,.55,.7),tex('\\dfrac{d^2x}{dt^2}\\ \\neq\\ x^2',600,410,{size:56}));
  return s;
 },
 [K+'dots']:(p)=>{
  let s=label('時間での微分 ＝ 文字の上の 点',600,80,{size:30,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.25,.45),tex(`${XD}=\\dfrac{dx}{dt}=v`,600,210,{size:60})+label('点 1つ',180,220,{size:28,color:C.v,anchor:'middle'}));
  s+=fade(seg(p,.6,.8),tex(`${XDOT2}=\\dfrac{d^2x}{dt^2}=a`,600,390,{size:60})+label('点 2つ',180,400,{size:28,color:C.a,anchor:'middle'}));
  return s;
 },
 [K+'ex1']:(p)=>{
  let s=tex('x=5t^2',600,80,{size:54});
  s+=fade(seg(p,.2,.35),arrow(600,125,600,175,{color:C.dim,w:3,head:12})+label('微分',630,160,{size:24,color:C.t}));
  s+=fade(seg(p,.25,.4),tex('v=10t',600,230,{size:54}));
  s+=fade(seg(p,.45,.6),arrow(600,275,600,325,{color:C.dim,w:3,head:12})+label('もう一度 微分',630,310,{size:24,color:C.t}));
  s+=fade(seg(p,.5,.65),tex(`${XDD}=10`,600,385,{size:48}));
  s+=fade(seg(p,.72,.88),label('加速度 10 m/s²',600,470,{size:32,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ex2']:(p)=>{
  let s=card(110,120,440,260,tex(`${XDD}=10`,330,215,{size:56})+label('加速度 [m/s²]',330,310,{size:30,color:C.a,anchor:'middle'}),1,C.a);
  s+=card(650,120,440,260,tex('x^2=25t^4',870,215,{size:56})+label('位置の 2乗 [m²]',870,310,{size:30,color:C.x,anchor:'middle'}),seg(p,.05,.25),C.x);
  s+=fade(seg(p,.45,.6),label('≠',600,270,{size:60,color:C.hi,anchor:'middle',weight:700})+label('まったく 別の量',600,450,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },

 // ===== S3 ばねが引き戻す力 =====
 [K+'setup']:(p)=>{
  let s=rig(0,{y:380,x0lab:seg(p,.3,.5)>0?1:0});
  s+=fade(seg(p,.05,.2),label('なめらかな 床（摩擦なし）',950,440,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.5,.7),arrow(700,120,860,120,{color:C.dim,w:3,head:14})+label('右向きが 正',870,128,{size:26,color:C.ink})+label('ばねが 自然の長さ',600,80,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'push']:(p)=>{
  const d=p<.48?.1*seg(p,.02,.18):p<.55?.1*(1-seg(p,.48,.55)):-.1*seg(p,.55,.7);
  const right=p<.48;
  let s=rig(d,{y:380,xArr:1,fArr:right?seg(p,.2,.3):seg(p,.72,.82)});
  s+=fade(right?seg(p,.2,.3):seg(p,.72,.82),label(right?'伸びて 左へ 引き戻す':'縮んで 右へ 押し戻す',600,90,{size:32,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'dir']:(p)=>{
  const d=p<.5?.08:.16*1;
  const dd=.08+.08*seg(p,.5,.65);
  let s=rig(dd,{y:400,ox:360,wx:90,sc:1200,xArr:1,fArr:1,fk:.9});
  s+=fade(seg(p,.05,.2),label('F は いつも x と 逆向き',330,90,{size:28,color:C.F,anchor:'middle'}));
  s+=fade(seg(p,.55,.7),label('ずれ 2倍 → 力も 2倍',330,140,{size:28,color:C.hi,anchor:'middle',weight:700}));
  const A=axes({x:760,y:290,w:360,h:200,xmin:-.2,xmax:.2,ymin:-.9,ymax:.9,xlabel:'x',ylabel:'F',xticks:[],yticks:[],xcolor:C.x,ycolor:C.F,g:seg(p,.15,.3)});
  s+=A.svg+A.plot(x=>-4*x,{from:-.2,to:.2,p:seg(p,.25,.45),color:C.F,w:4});
  s+=fade(seg(p,.25,.4),dot(A.X(dd),A.Y(-4*dd),8,C.hi));
  return s;
 },
 [K+'hooke']:(p)=>{
  let s=rig(.1,{y:430,ox:360,wx:90,sc:1200,xArr:1,fArr:1,fk:.9,x0lab:1});
  s+=card(640,40,520,230,tex('F=-kx',900,115,{size:64})+label('フックの法則',900,190,{size:28,color:C.F,anchor:'middle',weight:700})+label('（実験で 確かめられた 法則）',900,235,{size:22,color:C.dim,anchor:'middle'}),seg(p,0,.15),C.F);
  s+=card(640,300,520,110,label('k：ばね定数 [N/m]',900,345,{size:30,color:C.ink,anchor:'middle',weight:700})+label('1 m ずらしたときの 力の大きさ',900,390,{size:24,color:C.dim,anchor:'middle'}),seg(p,.35,.5));
  return s;
 },
 [K+'minus']:(p)=>{
  const src='F=-kx',Wd=texWidth(src,90),L=600-Wd/2,wl=texWidth('F=',90);
  let s=tex(src,600,190,{size:90});
  s+=fade(seg(p,.05,.25),ring(L+wl+74,160,38,{color:C.hi,w:4})+label('－ ＝ ずれと 逆向き',600,320,{size:36,color:C.hi,anchor:'middle',weight:700}));
  s+=card(270,380,660,90,label('実験で 確かめられた 法則',600,438,{size:32,color:C.F,anchor:'middle',weight:700}),seg(p,.55,.7),C.F);
  return s;
 },
 [K+'hnum']:(p)=>{
  let s=rig(.1*seg(p,0,.2),{y:430,ox:330,wx:70,sc:1200,xArr:1,fArr:seg(p,.45,.6),fk:.9});
  s+=card(620,40,540,110,label('k ＝ 4 N/m，　x ＝ 0.1 m',890,108,{size:32,color:C.ink,anchor:'middle'}),seg(p,0,.15));
  s+=fade(seg(p,.25,.45),tex('F=-4\\times0.1',890,220,{size:48,auto:true}));
  s+=fade(seg(p,.45,.6),tex('=-0.4\\,\\mathrm{N}',890,310,{size:52}));
  s+=fade(seg(p,.7,.85),label('左向きに 0.4 N',890,400,{size:32,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'maf']:(p)=>{
  let s=tex('ma=F',600,150,{size:90});
  s+=fade(seg(p,.25,.4),label('m：質量 [kg]',300,300,{size:30,color:C.ink,anchor:'middle'})+label('F：力 [N]',600,300,{size:30,color:C.F,anchor:'middle'})+label('a：加速度 [m/s²]',900,300,{size:30,color:C.a,anchor:'middle'}));
  s+=card(250,370,700,90,label('力が はたらくと 加速度が 生じる',600,428,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'useonly']:(p)=>{
  let s=card(150,70,420,200,tex('ma=F',360,150,{size:60})+label('運動方程式',360,230,{size:26,color:C.dim,anchor:'middle'}),1);
  s+=card(630,70,420,200,tex('F=-kx',840,150,{size:60})+label('フックの法則',840,230,{size:26,color:C.dim,anchor:'middle'}),1,C.F);
  s+=card(250,330,700,120,label('ここでは 使うだけ',600,385,{size:34,color:C.hi,anchor:'middle',weight:700})+label('→ なぜ成り立つかは 力学の回で',600,430,{size:26,color:C.ink,anchor:'middle'}),seg(p,.1,.25),C.hi);
  return s;
 },

 // ===== S4 ばねの方程式を組み立てる =====
 [K+'sub']:(p)=>{
  let s=tex('m\\,a=F',600,90,{size:64});
  const Wd=texWidth('m\\,a=F',64),L=600-Wd/2;
  s+=fade(seg(p,.1,.3),label('a ＝ d²x/dt²',L+Wd*.3-60,200,{size:32,color:C.a,anchor:'middle',weight:700})+arrow(L+Wd*.3-40,165,L+Wd*.3,120,{color:C.a,w:3,head:12}));
  s+=fade(seg(p,.3,.5),label('F ＝ −kx',L+Wd+80,200,{size:32,color:C.F,anchor:'middle',weight:700})+arrow(L+Wd+60,165,L+Wd-10,120,{color:C.F,w:3,head:12}));
  const f=`m\\,${XDD}=-kx`;
  s+=fade(seg(p,.6,.75),tex(f,600,360,{size:72})+highlight(600-texWidth(f,72)/2-30,262,texWidth(f,72)+60,175,seg(p,.75,.9)));
  return s;
 },
 [K+'divide']:(p)=>{
  let s=tex(`m\\,${XDD}=-kx`,330,110,{size:50});
  s+=fade(seg(p,.1,.3),label('両辺を m で 割る',330,230,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.5),tex(`\\dfrac{m\\,${XDD}}{m}=-\\dfrac{kx}{m}`,850,110,{size:46})+arrow(560,110,660,110,{color:C.hi,w:3,head:12}));
  const f=`${XDD}=-\\dfrac{k}{m}\\,x`;
  s+=fade(seg(p,.6,.75),tex(f,600,380,{size:60})+highlight(600-texWidth(f,60)/2-30,300,texWidth(f,60)+60,150,seg(p,.75,.9)));
  return s;
 },
 [K+'positive']:(p)=>{
  let s=tex(`${XDD}=-\\dfrac{k}{m}\\,x`,600,90,{size:54});
  s+=fade(seg(p,.1,.3),label('k ＞ 0，　m ＞ 0',600,195,{size:34,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.25,.4),tex('\\dfrac{k}{m}>0',600,305,{size:44}));
  s+=card(300,370,600,100,label('正の数 ＝ 正の数の 2乗　例　4 ＝ 2²',600,432,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'omega']:(p)=>{
  let s=tex(`\\dfrac{k}{m}=${W}^2`,330,120,{size:60})+fade(seg(p,.2,.35),tex(`${W}=\\sqrt{\\dfrac{k}{m}}`,860,120,{size:60}));
  const f=`${XDD}=-${W}^2x`;
  s+=fade(seg(p,.5,.65),tex(f,600,370,{size:70})+highlight(600-texWidth(f,70)/2-35,275,texWidth(f,70)+70,170,seg(p,.65,.8)));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=label('N ＝ kg·m/s²',600,90,{size:34,color:C.F,anchor:'middle'});
  s+=fade(seg(p,.2,.4),tex('\\dfrac{k}{m}:\\ \\dfrac{\\mathrm{N/m}}{\\mathrm{kg}}=\\dfrac{\\mathrm{kg/s^2}}{\\mathrm{kg}}=\\dfrac{1}{\\mathrm{s}^2}',600,230,{size:48,auto:false}));
  s+=fade(seg(p,.6,.75),tex(`${W}:\\ \\dfrac{1}{\\mathrm{s}}`,600,390,{size:56,auto:false})+label('（1秒あたりの 量）',600,475,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'num1']:(p)=>{
  let s=card(200,40,800,100,label('m ＝ 1 kg，　k ＝ 4 N/m',600,105,{size:34,color:C.ink,anchor:'middle'}),1);
  s+=fade(seg(p,.2,.4),tex(`${W}^2=\\dfrac{4}{1}=4`,600,240,{size:56}));
  s+=fade(seg(p,.45,.6),tex(`${W}=2`,600,360,{size:60}));
  s+=fade(seg(p,.7,.85),tex(`${W}=2\\ \\mathrm{/s}`,600,460,{size:44,auto:true})+highlight(470,418,260,70,1));
  return s;
 },
 [K+'num2']:(p)=>{
  let s=rig(.1,{y:470,ox:330,wx:70,sc:1200,xArr:1,aArr:seg(p,.5,.65),fk:.9,x0lab:0,bh:80});
  s+=card(620,30,540,90,label('x ＝ 0.1 m，　ω² ＝ 4',890,88,{size:32,color:C.ink,anchor:'middle'}),1);
  s+=fade(seg(p,.1,.3),tex(`${XDD}=-${W}^2x=-4\\times0.1`,600,210,{size:48}));
  s+=fade(seg(p,.4,.55),tex('=-0.4\\,\\mathrm{m/s^2}',800,300,{size:52}));
  return s;
 },
 [K+'num3']:(p)=>{
  let s=tex(`${XDD}=-0.4\\,\\mathrm{m/s^2}`,600,90,{size:52});
  s+=fade(seg(p,.1,.35),tex('a=\\dfrac{F}{m}=\\dfrac{-0.4\\,\\mathrm{N}}{1\\,\\mathrm{kg}}=-0.4\\,\\mathrm{m/s^2}',600,260,{size:50}));
  s+=fade(seg(p,.55,.7),label('一致',600,420,{size:40,color:C.F,anchor:'middle',weight:700}))+ok(680,425,seg(p,.55,.7));
  return s;
 },
 [K+'read']:(p)=>{
  const f=`${XDD}=-${W}^2x`,Wd=texWidth(f,80),L=600-Wd/2,wl=texWidth(`${XDD}=`,80),wm=texWidth(`${XDD}=-`,80);
  let s=tex(f,600,130,{size:80});
  s+=fade(seg(p,.15,.3),brace(L,L+wl-40,190,{color:C.a,text:'加速度は',size:30}));
  s+=fade(seg(p,.35,.5),brace(L+wm,L+Wd,190,{color:C.x,text:'ずれに 比例',size:30}));
  s+=fade(seg(p,.55,.7),label('逆向き',L+wl+50,40,{size:28,color:C.hi,anchor:'middle',weight:700})+arrow(L+wl+50,52,L+wl+50,88,{color:C.hi,w:3,head:10})+label('いつも 中心を 向く',600,360,{size:40,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'arrows']:(p)=>{
  const t=Math.PI*.25+3*Math.PI*p,d=osc(t);
  let s=rig(d,{y:360,xArr:1,aArr:1,fk:1});
  s+=card(250,420,700,80,label('x と a は いつも 逆向き・遠いほど 大きい',600,470,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'center']:(p)=>{
  const t=mix(Math.PI/4-.2,Math.PI/4+.2,p),d=osc(t),v=oscv(t);
  let s=rig(d,{y:380,xArr:Math.abs(d)>.025?1:0,aArr:Math.abs(d)>.045?1:0,vArr:1,v});
  s+=card(260,40,680,120,label('中心：ずれ 0 → 加速度 0',600,92,{size:30,color:C.a,anchor:'middle',weight:700})+label('ついた 速さで 通り過ぎる',600,138,{size:28,color:C.v,anchor:'middle'}),seg(p,.05,.2));
  return s;
 },
 [K+'repeat']:(p)=>{
  const t=Math.PI/2+.35+3*Math.PI*p;
  let s=rig(osc(t),{y:250,xArr:1,aArr:1,x0lab:0,bh:80});
  const A=axes({x:200,y:500,w:840,h:150,xmin:0,xmax:10,ymin:-.13,ymax:.13,xlabel:'t',ylabel:'',xticks:[],yticks:[],xcolor:C.t,g:1});
  s+=fade(.9,A.svg+A.plot(tt=>osc(tt),{from:0,to:Math.min(10,t),color:C.x,w:3}));
  s+=label('x',175,432,{size:26,color:C.x,anchor:'end'});
  return s;
 },

 // ===== S5 この式を満たす動き =====
 [K+'recall']:(p)=>{
  let s=tex(`${XDD}=-${W}^2x`,600,100,{size:64});
  s+=card(200,200,800,220,label('微分の法則・初級 2/2',600,255,{size:28,color:C.dim,anchor:'middle'})
   +tex(`x=A\\sin(${W}t+\\varphi)`,600,340,{size:52}),seg(p,.3,.5),C.hi);
  return s;
 },
 [K+'same']:(p)=>{
  const rows=[[`x=A\\sin(${W}t+\\varphi)`,1],[`v=A${W}\\cos(${W}t+\\varphi)`,seg(p,.08,.22)],[`a=-A${W}^2\\sin(${W}t+\\varphi)=-${W}^2x`,seg(p,.22,.36)]];
  let s='';rows.forEach(([src,g],i)=>{s+=fade(g,tex(src,560,70+i*95,{size:42}));});
  s+=fade(seg(p,.45,.6),tex(`${XDD}=-${W}^2x`,560,400,{size:56})+label('ばねの式',560,480,{size:26,color:C.dim,anchor:'middle'})+label('同じ形',1000,330,{size:32,color:C.hi,anchor:'middle',weight:700})+arrow(1000,350,1000,260,{color:C.hi,w:3,head:12})+arrow(1000,360,1000,395,{color:C.hi,w:3,head:12}));
  return s;
 },
 [K+'role']:(p)=>{
  let s=card(150,50,900,120,label('sin の 振動 ＝ この方程式の 解',600,125,{size:34,color:C.hi,anchor:'middle',weight:700}),1,C.hi);
  const f=`x=A\\sin(${W}t+\\varphi)`;
  s+=fade(seg(p,.3,.45),tex(f,600,270,{size:56}));
  const Wd=texWidth(f,56),L=600-Wd/2,wo=texWidth('x=A\\sin(',56),wo2=texWidth(`x=A\\sin(${W}`,56);
  s+=fade(seg(p,.5,.65),ring(L+(wo+wo2)/2-8,262,30,{color:CW,w:3})+tex(`${W}=\\sqrt{\\dfrac{k}{m}}`,L+(wo+wo2)/2,420,{size:48})+arrow(L+(wo+wo2)/2,360,L+(wo+wo2)/2,300,{color:CW,w:3,head:12}));
  s+=fade(seg(p,.7,.85),label('角振動数',L+(wo+wo2)/2+140,425,{size:30,color:CW,weight:700}));
  return s;
 },
 [K+'rad']:(p)=>{
  const cx=280,cy=270,R=160,th=.4+1.9*seg(p,.05,.6);const [px,py]=P(cx,cy,R,th),[qx,qy]=P(cx,cy,R,.4);
  let s=line(cx-R-30,cy,cx+R+30,cy,{color:C.faint,w:2})+line(cx,cy+R+30,cx,cy-R-30,{color:C.faint,w:2})+ring(cx,cy,R,{color:C.dim,w:3});
  s+=line(cx,cy,qx,qy,{color:C.dim,w:2,dash:'6 6'})+line(cx,cy,px,py,{color:C.ink,w:3})+draw(Array.from({length:31},(_,i)=>P(cx,cy,60,.4+(th-.4)*i/30)),1,{color:CW,w:4})+dot(px,py,11,C.hi);
  s+=card(560,60,600,300,label('ω：1秒あたりに 進む角度',860,125,{size:30,color:CW,anchor:'middle',weight:700})
   +label('1/s ＝ rad/s',860,200,{size:34,color:C.ink,anchor:'middle'})
   +fade(seg(p,.6,.75),label('例のばね：ω ＝ 2 rad/s',860,290,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'rest']:(p)=>{
  let s=rig(0,{y:250,x0lab:1,bh:80});
  const A=axes({x:200,y:430,w:500,h:120,xmin:0,xmax:10,ymin:-.13,ymax:.13,xlabel:'t',ylabel:'',xticks:[],yticks:[],xcolor:C.t});
  s+=A.svg+A.plot(()=>0,{from:0,to:9.5,p:seg(p,.1,.5),color:C.x,w:5})+label('x ＝ 0 のまま',450,475,{size:26,color:C.x,anchor:'middle'});
  s+=card(760,300,400,160,tex(`${XDD}=0`,960,360,{size:40})+tex(`-${W}^2\\times0=0`,960,425,{size:40}),seg(p,.4,.55),C.F)+ok(1120,340,seg(p,.6,.75));
  return s;
 },
 [K+'init']:(p)=>{
  const A=axes({x:110,y:470,w:560,h:330,xmin:0,xmax:6.4,ymin:-.16,ymax:.16,xlabel:'t [s]',ylabel:'x',xticks:[],yticks:[],xcolor:C.t,ycolor:C.x});
  let s=A.svg;
  s+=A.plot(t=>.1*Math.cos(2*t),{from:0,to:6.2,p:seg(p,.05,.35),color:C.x,w:4});
  s+=A.plot(t=>.05*Math.sin(2*t),{from:0,to:6.2,p:seg(p,.15,.45),color:C.v,w:4});
  s+=A.plot(()=>0,{from:0,to:6.2,p:seg(p,.25,.55),color:C.dim,w:3,dash:'8 8'});
  s+=card(720,90,450,300,label('どれも 同じ方程式の 解',945,145,{size:28,color:C.ink,anchor:'middle'})
   +label('決めるもの（2つ）',945,215,{size:28,color:C.dim,anchor:'middle'})
   +label('① 初めの 位置',945,275,{size:32,color:C.x,anchor:'middle',weight:700})
   +label('② 初めの 速度',945,335,{size:32,color:C.v,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },

 // ===== S6 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  const rows=[['F=-kx',C.F,'フックの法則（使うだけ）'],['m\\,a=F',C.ink,'運動方程式（使うだけ）'],[`m\\,${XDD}=-kx`,C.ink,'代入'],[`${XDD}=-${W}^2x`,C.hi,'m で割る，ω² ＝ k/m']];
  let s='';rows.forEach(([src,col,lab],i)=>{s+=fade(seg(p,.05+.18*i,.2+.18*i),tex(src,420,[70,160,270,400][i],{size:46})+label(lab,720,[80,170,280,410][i],{size:26,color:C.dim}));});
  return s;
 },
 [K+'sum2']:(p)=>{
  const t=Math.PI*.25+3*Math.PI*p;
  let s=rig(osc(t),{y:280,xArr:1,aArr:1,x0lab:0,bh:80});
  s+=card(150,340,900,140,label('加速度は ずれに 比例して，いつも 中心向き',600,395,{size:30,color:C.hi,anchor:'middle',weight:700})
   +label('ω ＝ √(k/m)　例：2 rad/s',600,450,{size:28,color:CW,anchor:'middle'}),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'next']:(p)=>{
  const cx=250,cy=270,R=150,th=2*Math.PI*.9*seg(p,.05,.9);const [px,py]=P(cx,cy,R,th);
  let s=ring(cx,cy,R,{color:C.dim,w:3})+line(cx,cy,cx+R+30,cy,{color:C.faint,w:2})+draw(Array.from({length:61},(_,i)=>P(cx,cy,R,th*i/60)),1,{color:CU,w:6})+line(cx,cy,px,py,{color:C.ink,w:3})+dot(px,py,11,C.hi);
  s+=card(520,110,620,260,label('次の問い',830,150,{size:26,color:C.dim,anchor:'middle'})
   +tex(`${XDD}=-${W}^2x`,830,240,{size:44})
   +label('この振動は 何秒で 一周する？',830,320,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
};

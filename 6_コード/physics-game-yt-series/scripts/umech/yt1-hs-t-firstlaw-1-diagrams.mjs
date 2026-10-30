// 高校編「熱力学第一法則・深く学ぶ 1/3」(ys-hs-t-firstlaw-1) — 図。Stage 1200×515.
// 色：内部エネルギー U 薄い橙、熱 Q 橙、仕事 W 濃い橙（どれもエネルギーの橙系）、温度 T 黄緑、圧力 P 緑、体積 V 水色、強調 黄。
// W は「外から気体がされた仕事」。気体が外へした仕事は W外へ（W の右下に小さく「外へ」。tex に日本語を入れないので label で添える）。
// 2/3・3/3・要点でも使う部品は export する（注射器・分子の箱・式の一歩は 気体の法則・熱と温度 の部品を読み込む）。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,clamp,mix} from './anim.mjs';
import {card,tag,T2,FA,TC,QC,Tt,sceneT,thermo,PC,VC,Pt,Vt,gasBox,syringe,step,MOL} from './yt1-hs-t-gas-1-diagrams.mjs';
import {molBox,HOT} from './yt1-hs-t-heat-1-diagrams.mjs';
export {card,tag,T2,FA,TC,QC,Tt,sceneT,thermo,PC,VC,Pt,Vt,gasBox,syringe,step,MOL,molBox,HOT};

const K='hs-t-firstlaw-1:';
export const UC='#ffd6a0', WC='#ff9440';
export const Ut=`{\\color{${UC}}U}`, Qt=`{\\color{${QC}}Q}`, Wt=`{\\color{${WC}}W}`, dU=`\\Delta {\\color{${UC}}U}`, DT=`\\Delta {\\color{${TC}}T}`;
export const LAW=`${dU}=${Qt}+${Wt}`;
export const JJ='\\ \\mathrm{J}';
// ---- a row mixing TeX pieces and "W外へ" ('@' in the parts list) --------------------------------
// parts: array of TeX strings; the string '@' stands for W外へ. Returns svg centred at x (or start/end).
const WO_SUB=.6;
function woWidth(size){return texWidth(Wt,size)+size*WO_SUB*2+4;}
export function Wo(x,y,{size=46,anchor='start'}={}){
 const w=woWidth(size),l=anchor==='middle'?x-w/2:anchor==='end'?x-w:x;
 return tex(Wt,l,y,{size,anchor:'start'})+label('外へ',l+texWidth(Wt,size)+2,y+size*.42,{size:Math.round(size*WO_SUB),color:WC,weight:700});
}
export function mrow(parts,x,y,{size=46,anchor='middle',g=1}={}){
 const ws=parts.map(q=>q==='@'?woWidth(size):texWidth(q,size)),gap=size*.12;
 const W=ws.reduce((a,b)=>a+b,0)+gap*(parts.length-1);
 let cx=anchor==='middle'?x-W/2:anchor==='end'?x-W:x,s='';
 parts.forEach((q,i)=>{s+=q==='@'?Wo(cx,y,{size}):tex(q,cx,y,{size,anchor:'start'});cx+=ws[i]+gap;});
 return fade(g,s);
}
export const Q2=(a,b,o={})=>card(200,130,800,210,label(a,600,200,{size:34,color:C.ink,anchor:'middle'})+label(b,600,280,{size:44,color:C.hi,anchor:'middle',weight:700}),o.g??1,C.hi);
// ---- flame under a point ------------------------------------------------------------------------
export const flame=(x,y,{g=1,s=1}={})=>fade(g,`<path d="M${x-30*s} ${y} q${10*s} ${-40*s} ${30*s} ${-50*s} q${20*s} ${10*s} ${30*s} ${50*s} z" fill="${QC}" fill-opacity=".85"/>`+`<path d="M${x-12*s} ${y} q${6*s} ${-22*s} ${12*s} ${-28*s} q${8*s} ${8*s} ${12*s} ${28*s} z" fill="${C.hi}"/>`);
// heat arrow (wavy-ish orange arrow)
export const QA=(x,y,X,Y,o={})=>arrow(x,y,X,Y,{color:QC,w:8,head:22,...o});
export const WA=(x,y,X,Y,o={})=>arrow(x,y,X,Y,{color:WC,w:8,head:22,...o});
// dashed "system" boundary
export const sysLine=(x,y,w,h,{g=1,text='系'}={})=>fade(g,rect(x,y,w,h,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:12}).replace('<rect','<rect stroke-dasharray="12 9"')+(text?label(text,x+16,y+34,{size:30,color:C.hi,weight:700}):''));
// ---- a ball bouncing off a moving wall (1D). dir=-1: wall approaches, +1: wall recedes ----------
// u: ball speed, w: wall speed (px per unit p). Collision at p≈.55. Before/after speed arrows.
export function wallBounce(p,{y=260,u=760,w=220,dir=-1,g=1,x0=180,showArrows=1,lab=1}={}){
 const wx0=dir<0?960:560; // wall start x
 const wv=dir<0?-w:w;
 // ball x = x0+u p ; wall x = wx0+wv p ; contact when x0+u p + r = wx0 + wv p
 const r=20,pc=(wx0-x0-r)/(u-wv);
 const uo=u-2*wv; // speed after (towards left) = u + 2w if approaching
 const bx=p<pc?x0+u*p:x0+u*pc-uo*(p-pc), wx=wx0+wv*p;
 let s=line(100,y+r+4,1100,y+r+4,{color:C.faint,w:2});
 s+=rect(wx,y-110,30,220,{fill:'#7d8aa3',fo:1,stroke:'#c9d2e3',sw:2,rx:3})+rect(wx+30,y-12,200,24,{fill:'#7d8aa3',fo:1,stroke:'none',rx:3});
 s+=arrow(wx+120,y-140,wx+120+(dir<0?-90:90),y-140,{color:C.dim,w:5,head:16});
 s+=label(dir<0?'壁が 近づく':'壁が 遠ざかる',wx+120,y-160,{size:26,color:C.ink,anchor:'middle',weight:700});
 s+=dot(bx,y,r,MOL);
 const k=.16;
 if(showArrows){
  const a1=u*k,a2=uo*k;
  const ax=p<pc?bx:x0;
  s+=arrow(ax,y+70,ax+a1,y+70,{color:C.v,w:6,head:16,opacity:p<pc?1:.45});
  if(lab)s+=label('当たる 前',ax+a1/2,y+110,{size:24,color:C.v,anchor:'middle',opacity:p<pc?1:.6});
  if(p>=pc){s+=arrow(bx,y-60,bx-a2,y-60,{color:C.hi,w:7,head:18});if(lab)s+=label('はね返った 後',bx-a2/2,y-80,{size:24,color:C.hi,anchor:'middle',weight:700});}
 }
 return fade(g,s);
}
// ---- a hot wall (left) whose molecules jiggle; a gas molecule comes slow and leaves fast ----------
function hotWall(p,t,{y=260}={}){
 let s=rect(140,y-130,120,260,{fill:'#5a2a22',fo:.6,stroke:HOT,sw:2,rx:6});
 for(let i=0;i<4;i++)for(let j=0;j<6;j++){const jx=8*Math.sin(t*31+i*2.1+j*1.3),jy=8*Math.cos(t*27+i*1.7+j*2.9);s+=dot(165+i*28+jx,y-110+j*44+jy,9,HOT);}
 const pc=.5,u=600,uo=800,r=18;
 const bx=p<pc?900-u*(p):900-u*pc+uo*(p-pc);
 s+=dot(Math.max(278,bx),y,r,MOL);
 const k=.16;
 s+=arrow(p<pc?bx:900-u*pc,y+70,(p<pc?bx:900-u*pc)-u*k,y+70,{color:C.v,w:6,head:16,opacity:p<pc?1:.35});
 s+=label('当たる 前',(p<pc?bx:900-u*pc)-u*k/2,y+110,{size:24,color:C.v,anchor:'middle',opacity:p<pc?1:.5});
 if(p>=pc)s+=arrow(bx,y-60,bx+uo*k,y-60,{color:C.hi,w:7,head:18})+label('はね返った 後',bx+uo*k/2,y-80,{size:24,color:C.hi,anchor:'middle',weight:700});
 s+=label('熱い 壁',200,y+170,{size:26,color:HOT,anchor:'middle',weight:700});
 return s;
}
// ---- energy bars: in (Q, W) and the change of U --------------------------------------------------
export function bar(x,base,val,k,{color=QC,w=110,text='',g=1,top='',neg=0}={}){
 const h=Math.abs(val)*k,y=val>=0?base-h:base;
 return fade(g,rect(x-w/2,y,w,h,{fill:color,fo:.5,stroke:color,sw:2,rx:6})+(top?label(top,x,val>=0?y-12:y+h+32,{size:28,color,anchor:'middle',weight:700}):'')+(text?label(text,x,base+(val>=0?36:-14),{size:24,color:C.ink,anchor:'middle'}):''));
}
// syringe with a system boundary around the gas (tip x0=240, piston at xp)
const SY=(o={})=>syringe({yc:250,h:170,...o});

export const hsTFirstlaw1Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=molBox({x:120,y:90,w:420,h:320,n:18,dist:240*t,seed:3,color:MOL});
  s+=thermo(600,110,380,140,{g:seg(p,.1,.3)});
  s+=card(680,140,440,220,label('内部エネルギーは',900,200,{size:30,color:C.ink,anchor:'middle'})+T2(`${Ut}=\\tfrac{3}{2}nR${Tt}`,900,280,{size:50}),seg(p,.3,.5),UC);
  s+=fade(seg(p,.6,.75),label('温度 だけで 決まる',900,410,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'q2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.3,molBox({x:120,y:90,w:420,h:320,n:18,dist:240*t,seed:3,color:MOL}));
  s+=Q2('火を 使わずに','温度を 上げられる？',{g:seg(p,.05,.25)});
  s+=fade(seg(p,.3,.5),flame(1080,440,{s:1.2})+line(1030,350,1130,450,{color:C.a,w:6})+line(1130,350,1030,450,{color:C.a,w:6}));
  return s;
 },
 [K+'syr']:(p,ctx)=>{
  const t=sceneT(p,ctx),xp=mix(820,600,seg(p,.35,.55));
  let s=SY({xp,dist:220*t,push:seg(p,.25,.4)});
  s+=fade(seg(p,.05,.2),label('先を ふさぐ',157,175,{size:24,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.4,.55),label('素早く 押し込む',1010,140,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.65,.8),label('火は 使わない',600,450,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'guess']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.3,SY({xp:600,dist:220*t}));
  s+=Q2('中の 空気の 温度は','どう なる？',{g:seg(p,.05,.25)});
  return s;
 },
 // ================= S2 系と内部エネルギー =================
 [K+'sys']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=SY({xp:760,dist:220*t});
  s+=sysLine(230,152,540,196,{g:seg(p,.15,.4),text:''});
  s+=fade(seg(p,.5,.7),label('系',500,130,{size:34,color:C.hi,anchor:'middle',weight:700})+label('（容器の 中の 気体 だけ）',500,410,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sys2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=SY({xp:760,dist:220*t});
  s+=sysLine(230,152,540,196,{text:''})+label('系',500,130,{size:34,color:C.hi,anchor:'middle',weight:700});
  s+=fade(seg(p,.1,.3),flame(480,470)+QA(480,420,480,330)+label('熱',520,395,{size:30,color:QC,weight:700}));
  s+=fade(seg(p,.45,.65),WA(1100,190,880,190)+label('仕事',990,170,{size:30,color:WC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('線を 横切って 出入り',800,450,{size:28,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'udef']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=molBox({x:80,y:80,w:400,h:330,n:14,dist:240*t,seed:5,color:MOL,speed:200});
  // springs between two molecules (interaction) as a hint
  s+=fade(seg(p,.4,.55),line(200,200,300,260,{color:C.dim,w:2,dash:'5 6'})+label('分子どうしの 力',280,450,{size:24,color:C.dim,anchor:'middle'}));
  s+=card(540,110,620,250,label('内部エネルギー U',850,165,{size:34,color:UC,anchor:'middle',weight:700})+label('＝ 分子の 運動エネルギー',850,235,{size:30,color:C.ink,anchor:'middle'})+label('＋ 分子どうしの 位置エネルギー',850,295,{size:30,color:C.ink,anchor:'middle'}),seg(p,.1,.3),UC);
  return s;
 },
 [K+'udef2']:(p,ctx)=>{
  const t=sceneT(p,ctx),dx=mix(0,260,seg(p,.3,.8));
  let s=card(540,40,620,120,label('内部エネルギー U',850,90,{size:30,color:UC,anchor:'middle',weight:700})+label('分子 一つ一つの 運動',850,135,{size:26,color:C.ink,anchor:'middle'}),1,UC);
  s+=tag('定義',1060,200,{g:seg(p,.05,.2)});
  s+=molBox({x:120+dx,y:230,w:300,h:200,n:10,dist:200*t,seed:5,color:MOL});
  s+=fade(seg(p,.3,.5),arrow(150+dx,470,350+dx,470,{color:C.v,w:6,head:18})+label('容器ごと 動く',250+dx,505,{size:24,color:C.v,anchor:'middle'}));
  s+=fade(seg(p,.6,.8),label('U に 入れない',900,330,{size:34,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'mono']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=molBox({x:80,y:80,w:400,h:330,n:14,dist:240*t,seed:5,color:MOL,speed:200});
  s+=card(540,110,620,250,label('単原子の 理想気体',850,170,{size:32,color:C.ink,anchor:'middle',weight:700})+label('分子どうしの 力 → 無視',850,235,{size:28,color:C.dim,anchor:'middle'})+label('U ＝ 運動エネルギーの 合計',850,305,{size:32,color:UC,anchor:'middle',weight:700}),seg(p,.05,.25),UC);
  return s;
 },
 [K+'u32']:(p)=>{
  let s=card(250,70,700,170,T2(`${Ut}=\\tfrac{3}{2}nR${Tt}`,600,165,{size:64}),1,UC);
  s+=fade(seg(p,.05,.2),label('前の 単元で 導いた',600,280,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.45,.65),label('温度 T が 上がる',380,390,{size:34,color:TC,anchor:'middle',weight:700})+label('＝',600,390,{size:40,color:C.ink,anchor:'middle',weight:700})+label('U が 増える',800,390,{size:34,color:UC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'per1']:(p)=>{
  let s=fade(.6,T2(`${Ut}=\\tfrac{3}{2}nR${Tt}`,600,80,{size:40}));
  s+=fade(seg(p,.05,.2),label('1.0 mol',600,150,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=card(170,190,860,140,label('1 K ごとに',330,270,{size:34,color:TC,anchor:'middle',weight:700})+T2(`1.5\\times1.0\\times8.3\\approx 12${JJ}`,720,265,{size:46}),seg(p,.25,.45),UC);
  s+=fade(seg(p,.6,.75),label('温度の 目盛り 1つ ＝ U が 約 12 J',600,420,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S3 入口は二つ =================
 [K+'heat']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=molBox({x:320,y:80,w:560,h:300,n:16,dist:240*t,seed:7,color:MOL});
  s+=fade(seg(p,.05,.25),label('入口は 二つ',140,80,{size:30,color:C.hi,weight:700}));
  s+=fade(seg(p,.4,.6),rect(320,372,560,14,{fill:HOT,fo:.8,stroke:'none',rx:4})+flame(600,470,{s:1.1})+QA(460,470,460,395)+QA(740,470,740,395));
  s+=fade(seg(p,.5,.7),label('① 熱 Q（加熱）',1040,250,{size:32,color:QC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'heat2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=hotWall(seg(p,.05,.95),t);
  s+=fade(seg(p,.6,.8),label('速く なる',700,450,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'work']:(p,ctx)=>{
  const t=sceneT(p,ctx),xp=mix(820,640,seg(p,.2,.8));
  let s=SY({xp,dist:220*t,push:1});
  s+=fade(seg(p,.4,.6),label('② 仕事 W（押し縮める）',600,440,{size:32,color:WC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'work2']:(p)=>{
  let s=wallBounce(seg(p,.05,.95),{dir:-1});
  s+=fade(seg(p,.7,.85),label('速く なる',300,120,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'both']:(p)=>{
  let s=card(80,90,420,150,label('① 熱 Q',290,150,{size:34,color:QC,anchor:'middle',weight:700})+label('熱い 壁で 速く',290,205,{size:26,color:C.ink,anchor:'middle'}),seg(p,.0,.15),QC);
  s+=card(80,290,420,150,label('② 仕事 W',290,350,{size:34,color:WC,anchor:'middle',weight:700})+label('動く 壁で 速く',290,405,{size:26,color:C.ink,anchor:'middle'}),seg(p,.0,.15),WC);
  s+=fade(seg(p,.2,.4),arrow(520,165,700,250,{color:QC,w:6,head:18})+arrow(520,365,700,280,{color:WC,w:6,head:18}));
  s+=card(720,170,420,170,label('分子の 運動が 激しく',930,230,{size:30,color:C.ink,anchor:'middle',weight:700})+label('U 増加 → 温度 上昇',930,295,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.5),C.hi);
  return s;
 },
 [K+'same']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=molBox({x:430,y:120,w:340,h:250,n:14,dist:300*t,seed:12,color:MOL});
  s+=thermo(820,130,360,150);
  s+=fade(seg(p,.1,.3),label('熱で？',250,200,{size:34,color:QC,anchor:'middle',weight:700})+label('押して？',250,300,{size:34,color:WC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.7),label('区別 できない',600,450,{size:36,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S4 符号の約束と第一法則 =================
 [K+'signQ']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=molBox({x:360,y:90,w:480,h:280,n:14,dist:220*t,seed:8,color:MOL});
  s+=sysLine(350,80,500,300,{text:'系'});
  s+=fade(seg(p,.15,.35),QA(240,230,345,230)+label('入る 熱',180,180,{size:28,color:QC,anchor:'middle',weight:700})+T2(`${Qt}>0`,180,300,{size:40}));
  s+=fade(seg(p,.55,.75),QA(855,230,960,230)+label('出る 熱',1030,180,{size:28,color:QC,anchor:'middle',weight:700})+T2(`${Qt}<0`,1030,300,{size:40}));
  return s;
 },
 [K+'signW']:(p,ctx)=>{
  const t=sceneT(p,ctx),xp=mix(820,640,seg(p,.1,.7));
  let s=SY({xp,dist:220*t,push:1});
  s+=fade(seg(p,.05,.2),label('外から 気体が された 仕事 ＝ W',600,70,{size:30,color:WC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.7),label('押し縮める',440,440,{size:30,color:C.ink,anchor:'middle',weight:700})+T2(`${Wt}>0`,700,440,{size:46}));
  return s;
 },
 [K+'signW2']:(p,ctx)=>{
  const t=sceneT(p,ctx),xp=mix(640,820,seg(p,.1,.7));
  let s=SY({xp,dist:220*t});
  s+=fade(seg(p,.1,.3),arrow(xp+40,370,xp+150,370,{color:PC,w:6,head:18})+label('気体が 外を 押す',xp+95,410,{size:26,color:PC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.75),label('ふくらむ',380,450,{size:30,color:C.ink,anchor:'middle',weight:700})+T2(`${Wt}<0`,620,450,{size:46}));
  return s;
 },
 [K+'wout']:(p)=>{
  let s=card(80,60,1040,150,label('気体が 外へ した 仕事',360,145,{size:32,color:C.ink,anchor:'middle',weight:700})+mrow(['@'],800,140,{size:60}),seg(p,.05,.25),WC);
  s+=card(250,270,700,150,mrow([`${Wt}=-`,'@'],600,350,{size:64}),seg(p,.5,.7),C.hi);
  return s;
 },
 [K+'signdef']:(p)=>{
  let s=card(180,70,840,280,'',1,C.hi);
  s+=fade(seg(p,.0,.15),T2(Qt,300,160,{size:52})+label('気体に 入る 熱 が 正',640,175,{size:34,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.0,.15),T2(Wt,300,280,{size:52})+label('外から された 仕事 が 正',640,295,{size:34,color:C.ink,anchor:'middle',weight:700}));
  s+=tag('定義（決め方）',600,420,{g:seg(p,.3,.5),size:28});
  return s;
 },
 [K+'law']:(p)=>{
  let s=card(250,70,700,170,T2(LAW,600,165,{size:72}),seg(p,.3,.5),C.hi);
  const tx=[[440,'内部エネルギーの 増加',UC],[660,'入った 熱',QC],[840,'された 仕事',WC]];
  s+=fade(seg(p,.05,.2),label(tx[0][1],400,300,{size:26,color:UC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.15,.3),label(tx[1][1],640,300,{size:26,color:QC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.2,.35),label(tx[2][1],850,300,{size:26,color:WC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),molBox({x:440,y:340,w:320,h:150,n:10,dist:300*p,seed:9,color:MOL})+QA(380,470,435,430)+WA(840,410,765,410));
  return s;
 },
 [K+'law2']:(p)=>{
  let s=card(250,70,700,170,T2(LAW,600,165,{size:72}),1,C.hi);
  s+=card(250,290,700,110,label('熱力学第一法則',600,358,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  s+=tag('法則（熱も 含めた エネルギー保存）',600,460,{g:seg(p,.4,.6),size:26});
  return s;
 },
 [K+'book']:(p)=>{
  let s=fade(.6,T2(LAW,600,90,{size:44}));
  s+=fade(seg(p,.05,.2),mrow([`${Wt}=-`,'@'],960,90,{size:36}));
  s+=card(200,170,800,150,mrow([`${dU}=${Qt}-`,'@'],600,255,{size:62}),seg(p,.1,.3),C.dim);
  s+=fade(seg(p,.55,.75),label('同じ 内容・別の 文字',600,410,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ledger']:(p)=>{
  const k=1.5,b=470,g=seg(p,.6,.8);
  let s=label('帳簿に 例えると',300,70,{size:30,color:C.dim,anchor:'middle'});
  s+=bar(250,b,100,k,{color:QC,top:'入金 Q',g:seg(p,.3,.5)});
  s+=bar(420,b,60,k,{color:WC,top:'入金 W',g:seg(p,.4,.6)});
  s+=fade(seg(p,.55,.7),label('→',580,b-60,{size:50,color:C.ink,anchor:'middle',weight:700}));
  s+=bar(800,b,100,k,{color:UC,w:150,g:seg(p,.05,.25)});
  s+=rect(725,b-150-240*g,150,240*g,{fill:UC,fo:.3,stroke:UC,sw:2,rx:6});
  s+=fade(seg(p,.05,.25),label('残高 U',800,b-150-240*g-14,{size:28,color:UC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ledger2']:(p)=>{
  const b=470;
  let s=rect(725,b-390,150,390,{fill:UC,fo:.5,stroke:UC,sw:2,rx:6})+label('U',800,b-404,{size:28,color:UC,anchor:'middle',weight:700});
  s+=fade(1-seg(p,.15,.45),line(725,b-150,875,b-150,{color:C.ink,w:2,dash:'6 6'})+label('熱の 分？',890,b-70,{size:24,color:QC})+label('仕事の 分？',890,b-260,{size:24,color:WC}));
  s+=card(80,150,520,200,label('U は 入口を 覚えて いない',340,225,{size:32,color:C.hi,anchor:'middle',weight:700})+label('（比喩と 違う ところ）',340,290,{size:26,color:C.dim,anchor:'middle'}),seg(p,.3,.5),C.hi);
  return s;
 },
 // ================= S5 数で使ってみる =================
 [K+'ex']:(p,ctx)=>{
  const t=sceneT(p,ctx),xp=mix(700,800,seg(p,.4,.8));
  let s=SY({xp,dist:220*t});
  s+=fade(seg(p,.05,.25),flame(480,470)+QA(480,420,480,345)+label('100 J',530,400,{size:30,color:QC,weight:700}));
  s+=fade(seg(p,.4,.6),arrow(xp+40,370,xp+150,370,{color:WC,w:7,head:18})+label('外へ 30 J の 仕事',xp+95,420,{size:28,color:WC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),T2(`${dU}=\\ ?`,900,90,{size:46}));
  return s;
 },
 [K+'ex2']:(p)=>{
  let s=card(150,90,420,170,T2(`${Qt}=+100${JJ}`,360,175,{size:48}),seg(p,.05,.25),QC);
  s+=fade(seg(p,.05,.25),label('入った',360,300,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=card(630,90,420,170,T2(`${Wt}=-30${JJ}`,840,175,{size:48}),seg(p,.45,.65),WC);
  s+=fade(seg(p,.45,.65),label('外へ した ＝ された 仕事は 負',840,300,{size:28,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ex3']:(p)=>{
  let s=fade(.6,T2(LAW,600,90,{size:44}));
  s+=card(200,170,800,150,T2(`${dU}=100+(-30)`,600,255,{size:62}),seg(p,.05,.25),C.hi);
  const w=texWidth('(-30)',62);
  s+=fade(seg(p,.5,.7),rect(600+texWidth(`${dU}=100+(-30)`,62)/2-w-8,205,w+16,90,{fill:'none',fo:0,stroke:C.hi,sw:4,rx:10}));
  s+=fade(seg(p,.55,.7),label('かっこ を 付けて 入れる',600,400,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ex4']:(p)=>{
  let s=fade(.6,T2(`${dU}=100+(-30)`,600,70,{size:40}));
  s+=card(340,120,520,110,T2(`${dU}=70${JJ}`,600,180,{size:56}),seg(p,.05,.2),C.hi);
  const k=1.4,b=470;
  s+=bar(300,b,100,k,{color:QC,top:'Q ＝ 100',g:seg(p,.3,.45)});
  s+=bar(560,b-100*k+0,-30,k,{color:WC,w:110,g:seg(p,.45,.6)})+fade(seg(p,.45,.6),label('W ＝ −30',560,b-100*k-14,{size:28,color:WC,anchor:'middle',weight:700}));
  s+=bar(820,b,70,k,{color:UC,top:'ΔU ＝ 70',g:seg(p,.6,.75)});
  s+=fade(seg(p,.3,.45),line(200,b,920,b,{color:C.dim,w:2}));
  return s;
 },
 [K+'wrong']:(p)=>{
  let s=card(180,80,840,130,T2(`100+30=130${JJ}`,600,150,{size:54,color:C.a,auto:false}),seg(p,.05,.2),C.a);
  s+=fade(seg(p,.25,.4),line(250,150,950,150,{color:C.a,w:6}));
  s+=card(180,260,840,150,T2(`100+(-30)=70${JJ}`,600,320,{size:54})+label('外へ した 仕事 → W では 負',600,385,{size:28,color:WC,anchor:'middle',weight:700}),seg(p,.5,.7),C.hi);
  return s;
 },
 [K+'dt']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=molBox({x:120,y:110,w:380,h:300,n:14,dist:220*t,seed:4,color:MOL});
  s+=fade(seg(p,.05,.2),label('1.0 mol・単原子',310,80,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=card(620,120,480,240,T2(`${dU}=70${JJ}`,860,200,{size:50})+T2(`${DT}=\\ ?`,860,300,{size:50}),seg(p,.3,.5),TC);
  return s;
 },
 [K+'dt2']:(p)=>step(p,`${Ut}=\\tfrac{3}{2}nR${Tt}`,`${dU}=\\tfrac{3}{2}nR${DT}`,'増えた 分だけ を 見る',{size:56}),
 [K+'dt3']:(p)=>{
  let s=fade(.6,T2(`${dU}=\\tfrac{3}{2}nR${DT}`,600,80,{size:40}));
  s+=card(110,140,980,150,T2(`${DT}=\\dfrac{70}{1.5\\times1.0\\times8.3}`,600,215,{size:52}),seg(p,.05,.25),TC);
  s+=card(390,330,420,110,T2(`\\approx 5.6\\ \\mathrm{K}`,600,388,{size:54,color:TC,auto:false}),seg(p,.55,.75),C.hi);
  return s;
 },
 [K+'dt4']:(p)=>{
  let s=fade(.6,T2(`${DT}\\approx 5.6\\ \\mathrm{K}`,600,80,{size:40}));
  s+=card(150,160,900,140,T2(`1.5\\times1.0\\times8.3\\times5.6\\approx 70${JJ}`,600,232,{size:50}),seg(p,.1,.3),UC);
  s+=fade(seg(p,.55,.7),label('ΔU ＝ 70 J に 戻る',600,390,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'rev']:(p,ctx)=>{
  const t=sceneT(p,ctx),xp=mix(820,680,seg(p,.1,.6));
  let s=SY({xp,dist:220*t,push:1});
  s+=fade(seg(p,.15,.35),label('外から 50 J の 仕事',1000,120,{size:28,color:WC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.75),QA(450,345,450,450)+label('20 J の 熱が 逃げる',620,470,{size:28,color:QC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'rev2']:(p)=>{
  let s=card(110,60,460,110,T2(`${Wt}=+50${JJ}`,340,118,{size:46}),seg(p,.0,.15),WC);
  s+=card(630,60,460,110,T2(`${Qt}=-20${JJ}`,860,118,{size:46}),seg(p,.1,.25),QC);
  s+=card(200,220,800,130,T2(`${dU}=(-20)+50=30${JJ}`,600,288,{size:54}),seg(p,.45,.65),C.hi);
  s+=fade(seg(p,.7,.85),label('逃げた 熱を 差し引いても 増える',600,420,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'rev3']:(p)=>{
  const k=4,b=440;
  let s=bar(300,b,50,k,{color:WC,top:'押した 50 J',g:seg(p,.05,.2)});
  s+=fade(seg(p,.25,.45),rect(600-55,b-50*k,110,20*k,{fill:QC,fo:.5,stroke:QC,sw:2,rx:6})+QA(670,b-50*k+40,790,b-50*k+40)+label('熱で 出ていく 20 J',810,b-50*k+48,{size:28,color:QC,weight:700}));
  s+=fade(seg(p,.5,.7),rect(600-55,b-30*k,110,30*k,{fill:UC,fo:.5,stroke:UC,sw:2,rx:6})+label('残る 30 J',760,b-50,{size:30,color:UC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.25),line(200,b,1000,b,{color:C.dim,w:2}));
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p,ctx)=>{
  const t=sceneT(p,ctx),xp=mix(820,600,seg(p,.1,.25));
  let s=SY({xp,dist:320*t,push:1});
  s+=fade(seg(p,.4,.6),label('熱が 出入りする 時間が ない',600,440,{size:30,color:C.ink,anchor:'middle',weight:700})+T2(`${Qt}\\approx 0`,1000,440,{size:44}));
  return s;
 },
 [K+'ans2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.35,SY({xp:600,dist:320*t}));
  s+=card(170,60,860,150,T2(`${dU}=0+${Wt}>0`,600,140,{size:58}),seg(p,.05,.25),C.hi);
  s+=thermo(1120,240,440,60+120*seg(p,.35,.7));
  s+=card(170,260,860,130,label('押せば 温度は 上がる',600,340,{size:40,color:TC,anchor:'middle',weight:700}),seg(p,.5,.7),TC);
  return s;
 },
 [K+'next']:(p,ctx)=>{
  const t=sceneT(p,ctx),xp=mix(700,820,seg(p,.1,.6));
  let s=SY({xp,dist:220*t});
  s+=card(200,355,800,150,label('気体が される 仕事は',600,415,{size:32,color:C.ink,anchor:'middle'})+label('いくら？',600,475,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.6),C.hi);
  return s;
 },
 [K+'next2']:(p)=>{
  let s=card(150,100,400,160,label('力 × 距離',350,195,{size:44,color:C.F,anchor:'middle',weight:700}),seg(p,.0,.15),C.F);
  s+=fade(seg(p,.2,.4),arrow(580,180,690,180,{color:C.hi,w:6,head:18}));
  s+=card(710,100,400,160,label('気体の 言葉',910,165,{size:34,color:C.ink,anchor:'middle',weight:700})+label('圧力・体積 で？',910,225,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.5),C.hi);
  return s;
 },
 [K+'bye']:(p)=>card(200,170,800,150,label('次の 動画：ピストンの 仕事と P–V グラフ',600,260,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

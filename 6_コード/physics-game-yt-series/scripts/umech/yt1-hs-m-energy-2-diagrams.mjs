// 高校編「仕事とエネルギー・深く学ぶ 2/3」(ys-hs-m-energy-2) — 図。Stage 1200×515.
// 持ち上げる仕事 mgh → 位置エネルギー U（薄い橙）、基準の取り方（棚 2.0 m・机 0.80 m・床）、ばねの F-x 三角形 → ½kx²。
// 部品は 1/3 から借りる。g＝10。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,poly,ground,wall,spring,axes} from './anim.mjs';
import {card,ball,WC,KC,UC,Wt,Kt,Ut,MG,Gt,Ht,T2,FA,box,handUp,tag,ebar,fxAxes} from './yt1-hs-m-energy-1-diagrams.mjs';

const K='hs-m-energy-2:';
const UH=`${MG}${Ht}`; // mgh with mg green, h cyan
// ---- lifting column: ground at GY, box bottom at GY-kh*h ------------------------------------------
const GY=460;
function lift({x=330,y=GY,hand=1,up=0,mg=0,motion=0,hb=0,hText='h',top=GY-260,g=1}={}){
 let s=fade(g,ground(x-200,x+200,GY));
 s+=fade(g,box(x,y,{w:100,h:76}));
 if(hand)s+=fade(g*hand,handUp(x,y));
 if(up)s+=FA(x-90,y-20,x-90,y-120,{text:'手 mg',size:24,dx:-14,dy:0,anchor:'end',g:g*up});
 if(mg)s+=FA(x+90,y-70,x+90,y+30,{text:'重力 mg',size:24,dx:14,dy:10,anchor:'start',g:g*mg});
 if(motion)s+=fade(g*motion,arrow(x+170,GY-20,x+170,top+20,{color:C.x,w:4,head:14})+label('動き',x+182,GY-120,{size:22,color:C.x}));
 if(hb)s+=fade(g*hb,line(x-160,GY,x-160,top,{color:C.x,w:3})+line(x-172,GY,x-148,GY,{color:C.x,w:3})+line(x-172,top,x-148,top,{color:C.x,w:3})+label(hText,x-172,(GY+top)/2+8,{size:28,color:C.x,anchor:'end',weight:700}));
 return s;
}
// ---- reference scene: shelf 2.0 m, desk 0.80 m, floor (px per metre = PM) ---------------------------
const PM=140,FY=470,X=v=>v; const yH=h=>FY-PM*h;
function room({g=1,ballH=2,shelf=1,desk=1}={}){
 let s=fade(g,ground(380,820,FY));
 if(shelf)s+=fade(g,rect(560,yH(2),200,14,{fill:'#8c7a5a',fo:.9,stroke:'none',rx:3})+line(750,yH(2)+14,750,FY,{color:'#8c7a5a',w:6})+label('棚',780,yH(2)+10,{size:24,color:C.dim}));
 if(desk)s+=fade(g,rect(400,yH(.8),150,12,{fill:'#6f8db0',fo:.9,stroke:'none',rx:3})+line(415,yH(.8)+12,415,FY,{color:'#6f8db0',w:5})+line(535,yH(.8)+12,535,FY,{color:'#6f8db0',w:5})+label('机',475,yH(.8)-14,{size:24,color:C.dim,anchor:'middle'}));
 s+=fade(g,ball(660,yH(ballH)-18,{r:18}));
 return s;
}
// a height ruler at x with zero at height z0 (metres); marks = [[h, text, utext]]
function ruler(x,z0,marks,{g=1,color=C.x,title='',uG=1,side=-1}={}){
 let s=fade(g,line(x,yH(2.25),x,FY+5,{color:C.dim,w:3}));
 s+=fade(g,line(x-14,yH(z0),x+14,yH(z0),{color:C.hi,w:4})+label('0',x+side*-22,yH(z0)+8,{size:24,color:C.hi,anchor:side<0?'start':'end',weight:700}));
 if(title)s+=fade(g,label(title,x,yH(2.25)-14,{size:24,color:C.hi,anchor:'middle',weight:700}));
 marks.forEach(([h,t,u])=>{
  s+=fade(g,line(x-10,yH(h),x+10,yH(h),{color})+label(t,x+side*16,yH(h)+8,{size:22,color,anchor:side<0?'end':'start'}));
  if(u)s+=fade(g*uG,label(u,x+side*16,yH(h)+36,{size:24,color:UC,anchor:side<0?'end':'start',weight:700}));
 });
 return s;
}
// ---- spring on a wall, block pulled to the right ----------------------------------------------------
const SX0=200,SL=300,SY=300;
function springScene(ext,{g=1,F=0,fText='',labels=1,ghost=1}={}){ // ext in px
 let s=fade(g,wall(SX0,SY-80,SY+60)+ground(SX0,1000,SY+40));
 s+=fade(g,spring(SX0,SX0+SL+ext,SY,{coils:10,amp:16,color:C.dim,w:3}));
 s+=fade(g,rect(SX0+SL+ext,SY-40,80,80,{fill:'#c9a46a',fo:.6,stroke:'#c9a46a',rx:8}));
 if(ghost&&ext>2)s+=fade(g*.6,line(SX0+SL,SY-70,SX0+SL,SY+40,{color:C.faint,w:2,dash:'6 6'})+label('自然の長さ',SX0+SL,SY-80,{size:22,color:C.dim,anchor:'middle'}));
 if(labels&&ext>2)s+=fade(g,line(SX0+SL,SY+70,SX0+SL+ext,SY+70,{color:C.x,w:3})+label('伸び x',SX0+SL+ext/2,SY+105,{size:24,color:C.x,anchor:'middle',weight:700}));
 if(F>0)s+=FA(SX0+SL+ext+80,SY,SX0+SL+ext+80+F,SY,{text:fText,size:24,dy:-20,g});
 return s;
}
const spAxes=(g=1,o={})=>axes({x:110,y:440,w:480,h:320,xmax:1.15,ymax:1.15,xlabel:'伸び',ylabel:'力 F',xticks:[],yticks:[],grid:false,g,xcolor:C.x,ycolor:C.F,...o});
function spTri(A,{g=1,fill=UC,fo=.4}={}){return fade(g,poly([[A.X(0),A.Y(0)],[A.X(1),A.Y(1)],[A.X(1),A.Y(0)]],{fill,fo,stroke:fill,sw:2}));}
function spMarks(A,g=1){return fade(g,line(A.X(1),A.Y(0),A.X(1),A.Y(1),{color:C.dim,w:2,dash:'6 6'})+line(A.X(0),A.Y(1),A.X(1),A.Y(1),{color:C.dim,w:2,dash:'6 6'})+tex('x',A.X(1),A.Y(0)+34,{size:30})+tex('kx',A.X(0)-30,A.Y(1)+6,{size:30}));}

export const hsEnergy2Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p)=>{
  const u=seg(p,.05,.85);
  let s=lift({y:GY-260*u,up:1});
  s+=fade(seg(p,.2,.35),label('ゆっくり 持ち上げる',800,170,{size:30,color:C.ink,weight:700}));
    return s;
 },
 [K+'q1']:(p)=>{
  let s=lift({y:GY-260,up:1});
  s+=card(620,130,520,170,label('持ち上げた 仕事は',880,195,{size:30,color:WC,anchor:'middle',weight:700})+label('どこへ 行った？',880,260,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'q2']:(p)=>{
  let s=fade(.35,lift({y:GY-260,up:0}));
  s+=card(620,110,520,120,label('速さ：ほとんど 0',880,185,{size:32,color:C.v,anchor:'middle',weight:700}),seg(p,0,.15),C.v);
  s+=card(620,260,520,130,label('運動エネルギー では ない？',880,335,{size:32,color:KC,anchor:'middle',weight:700}),seg(p,.3,.45),KC);
  return s;
 },
 [K+'g10']:(p)=>card(250,120,700,230,label('計算を 見やすく するため',600,190,{size:30,color:C.ink,anchor:'middle'})+tex(Gt+'=10\\ \\mathrm{m/s^2}',600,280,{size:56,auto:false}),seg(p,0,.15),C.a)+fade(seg(p,.6,.75),label('（本当は 約 9.8）',600,410,{size:28,color:C.dim,anchor:'middle'})),
 // ================= S2 持ち上げる仕事 =================
 [K+'mg']:(p)=>lift({y:GY-130,hand:1,mg:seg(p,.1,.35)})+fade(seg(p,.4,.55),card(640,140,460,130,label('重力 は 下向き',870,195,{size:28,color:C.ink,anchor:'middle'})+T2(MG,870,250,{size:48}),1,C.F)),
 [K+'hand']:(p)=>lift({y:GY-130,hand:1,mg:1,up:seg(p,.1,.35)})+fade(seg(p,.45,.6),card(640,140,460,130,label('手の 力 は 上向き',870,195,{size:28,color:C.ink,anchor:'middle'})+label('大きさ mg',870,250,{size:34,color:C.F,anchor:'middle',weight:700}),1,C.F)),
 [K+'bal']:(p)=>{
  let s=lift({y:GY-130,hand:1,mg:1,up:1});
  s+=card(640,110,480,200,label('合力 ＝ mg − mg ＝ 0',880,180,{size:34,color:C.F,anchor:'middle',weight:700})+label('→ 速さ は 変わらない',880,245,{size:30,color:C.v,anchor:'middle',weight:700}),seg(p,0,.15),C.F);
  s+=tag('つり合い',880,370,{g:seg(p,.55,.7)});
  return s;
 },
 [K+'mgh']:(p)=>{
  const u=seg(p,.05,.5);
  let s=lift({y:GY-260*u,up:1,hb:seg(p,.4,.55),top:GY-260});
  s+=card(640,140,480,180,label('手が した 仕事',880,195,{size:28,color:WC,anchor:'middle',weight:700})+T2(MG+'\\times '+Ht+'='+UH,880,270,{size:50}),seg(p,.55,.7),WC);
  return s;
 },
 [K+'ex']:(p)=>{
  let s=lift({y:GY-260,up:1,hb:1,hText:'20 m',top:GY-260});
  s+=fade(seg(p,0,.15),label('1.0 kg',330,GY-260-90,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=card(640,140,480,150,label('手の 力',880,190,{size:28,color:C.F,anchor:'middle',weight:700})+tex('1.0\\times 10=10\\ \\mathrm{N}',880,255,{size:42,auto:false,color:C.F}),seg(p,.4,.55),C.F);
  return s;
 },
 [K+'ex2']:(p)=>{
  let s=lift({y:GY-260,up:1,hb:1,hText:'20 m',top:GY-260});
  s+=card(640,140,480,150,label('手の 仕事',880,190,{size:28,color:WC,anchor:'middle',weight:700})+tex('10\\times 20=200\\ \\mathrm{J}',880,255,{size:44,auto:false,color:WC}),seg(p,0,.15),WC);
  return s;
 },
 [K+'grav']:(p)=>{
  let s=lift({y:GY-260,up:1,mg:1,motion:1,hb:1,hText:'20 m',top:GY-260});
  s+=fade(seg(p,0,.2),label('重力 下向き ⇔ 動き 上向き',870,150,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=card(640,200,480,150,label('重力の 仕事',880,250,{size:28,color:WC,anchor:'middle',weight:700})+tex('-200\\ \\mathrm{J}',880,315,{size:48,auto:false,color:WC}),seg(p,.45,.6),WC);
  return s;
 },
 [K+'sum0']:(p)=>{
  let s=fade(.45,lift({y:GY-260,up:1,mg:1,hb:1,hText:'20 m',top:GY-260}));
  s+=card(620,90,520,240,label('手：＋200 J',880,150,{size:32,color:WC,anchor:'middle',weight:700})+label('重力：−200 J',880,205,{size:32,color:WC,anchor:'middle',weight:700})+line(700,230,1060,230,{color:C.dim,w:2})+label('合計 0 J',880,285,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),WC);
  s+=fade(seg(p,.5,.65),label('→ 運動エネルギーは 増えない',880,400,{size:30,color:KC,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S3 仕事は高さにたくわえられる =================
 [K+'drop']:(p)=>{
  let s=lift({y:GY-260,hand:1-seg(p,.4,.6),up:0,hb:1,hText:'20 m',top:GY-260});
  s+=card(640,140,480,170,label('200 J は',880,200,{size:30,color:WC,anchor:'middle',weight:700})+label('消えた？',880,265,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  s+=fade(seg(p,.6,.75),label('手を 離す',330,GY-260-110,{size:28,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'fall']:(p)=>{
  const u=seg(p,.05,.6);
  let s=lift({y:GY-260+(260-2)*u*u,hand:0,mg:1,hb:1,hText:'20 m',top:GY-260});
  s+=card(640,140,480,160,label('重力の 仕事（下向きに 動く）',880,195,{size:26,color:WC,anchor:'middle',weight:700})+tex('10\\times 20=200\\ \\mathrm{J}',880,260,{size:44,auto:false,color:WC}),seg(p,.45,.6),WC);
  return s;
 },
 [K+'fall2']:(p)=>{
  let s=lift({y:GY-2,hand:0,mg:0,hb:1,hText:'20 m',top:GY-260});
  s+=fade(seg(p,0,.15),arrow(330,GY-90,330,GY-170,{color:C.faint,w:2,head:10}));
  s+=card(640,110,480,150,label('仕事 ＝ K の 増えた 量',880,165,{size:28,color:C.ink,anchor:'middle'})+label('（深く学ぶ 1/3）',880,215,{size:22,color:C.dim,anchor:'middle'}),seg(p,0,.15));
  s+=card(640,290,480,120,tex(Kt+'=200\\ \\mathrm{J}',880,350,{size:50,auto:false}),seg(p,.5,.65),KC);
  return s;
 },
 [K+'store']:(p)=>{
  let s=card(110,100,420,300,label('持ち上げる',320,160,{size:30,color:C.ink,anchor:'middle',weight:700})+label('仕事 200 J',320,215,{size:30,color:WC,anchor:'middle',weight:700})+arrow(320,240,320,300,{color:C.hi,w:4,head:14})+label('高さ に たくわえる',320,345,{size:28,color:UC,anchor:'middle',weight:700}),seg(p,0,.15),UC);
  s+=fade(seg(p,.35,.5),arrow(560,250,640,250,{color:C.hi,w:5,head:18}));
  s+=card(670,100,420,300,label('落ちる',880,160,{size:30,color:C.ink,anchor:'middle',weight:700})+label('取り出す',880,215,{size:30,color:C.hi,anchor:'middle',weight:700})+arrow(880,240,880,300,{color:C.hi,w:4,head:14})+label('運動エネルギー 200 J',880,345,{size:28,color:KC,anchor:'middle',weight:700}),seg(p,.4,.55),KC);
  return s;
 },
 [K+'udef']:(p)=>{
  let s=card(250,70,700,170,T2(Ut+'='+UH,600,170,{size:64}),seg(p,0,.12),UC);
  s+=fade(seg(p,.1,.25),label('位置エネルギー',600,300,{size:36,color:UC,anchor:'middle',weight:700}));
  s+=tag('定義',600,400,{g:seg(p,.5,.65)});
  return s;
 },
 [K+'uex']:(p)=>{
  let s=lift({y:GY-260,hand:1,hb:1,hText:'20 m',top:GY-260});
  s+=card(600,140,560,170,label('1.0 kg を 20 m の 高さに',880,195,{size:28,color:C.ink,anchor:'middle'})+tex(Ut+'=1.0\\times 10\\times 20=200\\ \\mathrm{J}',880,265,{size:40,auto:false}),seg(p,0,.15),UC);
  return s;
 },
 [K+'bank']:(p)=>{
  let s=card(430,150,340,220,label('位置エネルギー',600,215,{size:28,color:UC,anchor:'middle',weight:700})+label('U',600,300,{size:64,color:UC,anchor:'middle',weight:700}),seg(p,0,.12),UC);
  s+=fade(seg(p,.1,.25),arrow(140,210,410,210,{color:WC,w:6,head:20})+label('持ち上げる',275,180,{size:26,color:WC,anchor:'middle',weight:700})+label('＝ 預ける',275,255,{size:24,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.3,.45),arrow(790,310,1060,310,{color:KC,w:6,head:20})+label('落ちる',925,280,{size:26,color:KC,anchor:'middle',weight:700})+label('＝ 引き出す',925,355,{size:24,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),label('高さ という 形の 貯金',600,450,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S4 高さ0はどこでもよい =================
 [K+'ref']:(p)=>{
  let s=room({});
  s+=card(840,130,320,170,label('高さ 0 は',1000,190,{size:28,color:C.ink,anchor:'middle'})+label('どこ？',1000,250,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  s+=fade(seg(p,.55,.7),label('→ 自由に 選べる',1000,350,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'shelf']:(p)=>{
  const u=seg(p,.35,.8);
  let s=room({ballH:2-2*u*u});
  s+=fade(seg(p,0,.15),label('1.0 kg',700,yH(2)-40,{size:24,color:C.ink,weight:700}));
  s+=fade(seg(p,.05,.2),line(870,yH(2),870,FY,{color:C.x,w:3})+label('2.0 m',885,yH(1)+8,{size:26,color:C.x,weight:700})+line(860,yH(.8),880,yH(.8),{color:C.x,w:2})+label('0.80 m',885,yH(.4)+8,{size:22,color:C.dim}));
  return s;
 },
 [K+'floor']:(p)=>{
  let s=room({});
  s+=ruler(250,0,[[2,'2.0 m','20 J'],[0,'',' ']],{title:'床が 基準',uG:seg(p,.3,.45)});
  s+=fade(seg(p,.55,.7),label('0 J',234,FY+36,{size:24,color:UC,anchor:'end',weight:700}));
  s+=card(860,140,300,140,tex(Ut+'=1.0\\times 10\\times 2.0',1010,190,{size:28,auto:false})+tex('=20\\ \\mathrm{J}',1010,245,{size:34,auto:false,color:UC}),seg(p,.1,.25),UC);
  return s;
 },
 [K+'desk']:(p)=>{
  let s=room({});
  s+=fade(.5,ruler(250,0,[[2,'2.0 m','20 J']],{title:'床が 基準'})+label('0 J',234,FY+36,{size:24,color:UC,anchor:'end',weight:700}));
  s+=ruler(950,.8,[[2,'＋1.2 m','12 J']],{title:'机が 基準',side:1,g:seg(p,0,.2),uG:seg(p,.55,.7)});
  s+=fade(seg(p,.1,.25),line(560,yH(.8),940,yH(.8),{color:C.hi,w:2,dash:'6 6'}));
  return s;
 },
 [K+'desk2']:(p)=>{
  let s=room({});
  s+=fade(.5,ruler(250,0,[[2,'2.0 m','20 J']],{title:'床が 基準'})+label('0 J',234,FY+36,{size:24,color:UC,anchor:'end',weight:700}));
  s+=ruler(950,.8,[[2,'＋1.2 m','12 J']],{title:'机が 基準',side:1});
  s+=line(560,yH(.8),940,yH(.8),{color:C.hi,w:2,dash:'6 6'});
  s+=fade(seg(p,.05,.2),line(940,FY,960,FY,{color:C.x,w:2})+label('−0.80 m',966,FY+8,{size:22,color:C.x}));
  s+=fade(seg(p,.5,.65),label('−8.0 J',966,FY-22,{size:24,color:UC,weight:700}));
  s+=card(1030,250,150,80,label('負 の U',1105,300,{size:24,color:UC,anchor:'middle',weight:700}),seg(p,.6,.75),UC);
  return s;
 },
 [K+'negu']:(p)=>{
  let s=fade(.4,room({}));
  s+=card(250,120,700,220,label('U ＜ 0',600,195,{size:46,color:UC,anchor:'middle',weight:700})+label('＝ 基準 より 下に ある',600,270,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,0,.15),UC);
  return s;
 },
 ...Object.fromEntries([['diff',0],['diff2',1]].map(([k,st])=>[K+k,(p)=>{
  let s=room({ballH:0});
  s+=ruler(250,0,[[2,'2.0 m','20 J']],{title:'床が 基準'})+label('0 J',234,FY+36,{size:24,color:UC,anchor:'end',weight:700});
  s+=ruler(950,.8,[[2,'＋1.2 m','12 J']],{title:'机が 基準',side:1})+label('−8.0 J',966,FY+8,{size:24,color:UC,weight:700});
  s+=card(15,270,220,80,tex('20-0=20\\ \\mathrm{J}',125,318,{size:28,auto:false,color:UC}),st?1:seg(p,.3,.45),UC);
  if(st){
   s+=card(970,250,225,80,tex('12-(-8.0)=20\\ \\mathrm{J}',1082,298,{size:24,auto:false,color:UC}),seg(p,0,.15),UC);
   s+=fade(seg(p,.5,.65),label('どちらも 20 J 減る',600,90,{size:32,color:C.hi,anchor:'middle',weight:700}));
  }
  return s;
 }])),
 [K+'du']:(p)=>{
  let s=card(150,90,420,200,label('U の 値',360,150,{size:30,color:UC,anchor:'middle',weight:700})+label('基準で 変わる',360,225,{size:32,color:C.dim,anchor:'middle',weight:700}),seg(p,0,.15),C.faint);
  s+=card(630,90,420,200,label('2点の 差 ΔU',840,150,{size:30,color:UC,anchor:'middle',weight:700})+label('変わらない',840,225,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.35,.5),C.hi);
  s+=fade(seg(p,.65,.8),label('運動を 決めるのは 差 ΔU',600,380,{size:36,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S5 ばねにもたくわえられる =================
 [K+'spring']:(p)=>springScene(160*seg(p,.2,.7),{F:0,labels:0,ghost:0})+fade(seg(p,.1,.25),label('ばね',SX0+150,SY-60,{size:28,color:C.ink,anchor:'middle',weight:700})),
 [K+'hooke']:(p)=>{
  let s=springScene(160,{F:120*seg(p,.15,.35),fText:'kx'});
  s+=card(760,90,380,170,label('力 は 伸び に 比例',950,145,{size:28,color:C.ink,anchor:'middle'})+T2('F=kx',950,215,{size:50}),seg(p,.35,.5),C.F);
  s+=fade(seg(p,.6,.75),label('k：ばね定数 [N/m]',950,400,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=tag('法則（実験）',950,460,{color:C.F,g:seg(p,.7,.85)});
  return s;
 },
 [K+'grow']:(p)=>{
  const u=seg(p,.05,.8),e=160*u;
  let s=springScene(e,{F:Math.max(0,120*u),fText:u>.15?'kx':''});
  s+=card(760,330,400,110,label('力：0 → kx と 増える',960,395,{size:30,color:C.F,anchor:'middle',weight:700}),seg(p,.5,.65),C.F);
  return s;
 },
 [K+'fx']:(p)=>{
  const A=spAxes(seg(p,0,.15));let s=A.svg;
  s+=A.plot(u=>u,{from:0,to:1,p:seg(p,.1,.35),color:C.F,w:4,steps:2});
  s+=spMarks(A,seg(p,.3,.45));
  s+=spTri(A,{g:seg(p,.5,.65)});
  s+=card(700,150,420,130,label('仕事 ＝ この下の 面積',910,225,{size:30,color:WC,anchor:'middle',weight:700}),seg(p,.6,.75),WC);
  return s;
 },
 [K+'strips']:(p)=>{
  const A=spAxes();let s=A.svg+A.plot(u=>u,{from:0,to:1,color:C.F,w:4,steps:2})+spMarks(A);
  const n=10;
  for(let i=0;i<n;i++){const g=seg(p,.05+i*.035,.1+i*.035);s+=fade(g,rect(A.X(i/n),A.Y((i+.5)/n),A.X(1/n)-A.X(0)-2,A.Y(0)-A.Y((i+.5)/n),{fill:UC,fo:.35,stroke:UC,sw:1.5,rx:0}));}
  s+=card(700,120,440,130,label('細い 長方形 ＝ 力 × 少しの 距離',920,195,{size:24,color:C.ink,anchor:'middle',weight:700}),seg(p,.3,.45));
  s+=card(700,280,440,130,label('v-t の 面積 ＝ 変位 と',920,330,{size:26,color:C.ink,anchor:'middle'})+label('同じ 考え方',920,375,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'tri']:(p)=>{
  const A=spAxes();let s=A.svg+A.plot(u=>u,{from:0,to:1,color:C.F,w:4,steps:2})+spMarks(A)+spTri(A);
  s+=card(680,90,470,110,T2('\\tfrac12\\times x\\times kx',915,148,{size:44}),seg(p,0,.15),UC);
  s+=card(680,240,470,130,T2(Ut+'=\\tfrac12 kx^2',915,310,{size:56}),seg(p,.45,.6),UC);
  s+=fade(seg(p,.1,.25),label('底辺 x',A.X(.5),A.Y(0)+34,{size:22,color:C.x,anchor:'middle'})+label('高さ kx',A.X(1)+14,A.Y(.5),{size:22,color:C.F}));
  return s;
 },
 [K+'avg']:(p)=>{
  const A=spAxes();let s=A.svg+A.plot(u=>u,{from:0,to:1,color:C.F,w:4,steps:2})+spMarks(A);
  s+=fade(1-seg(p,.1,.3)*.6,spTri(A));
  s+=fade(seg(p,.1,.3),rect(A.X(0),A.Y(.5),A.X(1)-A.X(0),A.Y(0)-A.Y(.5),{fill:UC,fo:.3,stroke:UC,sw:2,rx:0})+line(A.X(0),A.Y(.5),A.X(1),A.Y(.5),{color:C.hi,w:3,dash:'8 6'})+tex('\\tfrac{kx}{2}',A.X(0)-36,A.Y(.5)+8,{size:30}));
  s+=card(680,90,470,130,label('平均の 力 × 距離',915,140,{size:26,color:C.ink,anchor:'middle'})+T2('\\tfrac{kx}{2}\\times x=\\tfrac12 kx^2',915,195,{size:40}),seg(p,.3,.45),UC);
  s+=tag('導いた 結果',915,300,{g:seg(p,.6,.75)});
  return s;
 },
 [K+'sex']:(p)=>{
  let s=springScene(140,{F:100,fText:'',labels:0,g:.45});
  s+=fade(seg(p,0,.15),label('k ＝ 100 N/m、伸び 0.20 m',600,90,{size:32,color:C.ink,anchor:'middle',weight:700}));
  s+=card(170,370,860,110,T2(Ut+'=\\tfrac12\\times 100\\times 0.20^2=2.0\\ \\mathrm{J}',600,430,{size:44,auto:false}),seg(p,.4,.55),UC);
  return s;
 },
 [K+'same']:(p)=>{
  const A=spAxes(1,{x:100,y:420,w:420,h:280,xlabel:'伸び',ylabel:'力 F'});let s=A.svg+A.plot(u=>u,{from:0,to:1,color:C.F,w:4,steps:2})+spTri(A);
  s+=label('½kx²',A.X(.75),A.Y(.2),{size:28,color:C.ink,anchor:'middle',weight:700});
  const B=axes({x:680,y:420,w:420,h:280,xmax:1.15,ymax:1.15,xlabel:'t',ylabel:'速度 v',xticks:[],yticks:[],g:seg(p,.1,.3),xcolor:C.t,ycolor:C.v});
  s+=B.svg+fade(seg(p,.2,.35),B.plot(u=>u,{from:0,to:1,color:C.v,w:4,steps:2})+poly([[B.X(0),B.Y(0)],[B.X(1),B.Y(1)],[B.X(1),B.Y(0)]],{fill:C.x,fo:.35,stroke:C.x,sw:2})+label('→ ½mv²',B.X(.75),B.Y(.2),{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('どちらも 三角形の ½',600,500,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p)=>{
  let s=card(180,90,840,130,label('ゆっくり 持ち上げた 仕事',600,145,{size:30,color:WC,anchor:'middle',weight:700})+T2(UH,600,195,{size:40}),seg(p,0,.12),WC);
  s+=fade(seg(p,.2,.35),arrow(600,235,600,290,{color:C.hi,w:4,head:16}));
  s+=card(180,300,840,120,label('位置エネルギー U に たくわえられる',600,372,{size:34,color:UC,anchor:'middle',weight:700}),seg(p,.3,.45),UC);
  return s;
 },
 [K+'ans2']:(p)=>{
  const base=430,kk=1.2,u=seg(p,.1,.7);
  let s=line(300,base,900,base,{color:C.dim,w:3});
  s+=ebar(450,base,200*(1-u),kk,{color:UC,text:'U',top:''});
  s+=ebar(750,base,200*u,kk,{color:KC,text:'K',top:''});
  s+=fade(seg(p,.1,.25),label('手を 離すと',600,110,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('取り出せる',600,170,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'mis']:(p)=>{
  let s=card(150,110,420,200,label('U の 値 そのもの',360,180,{size:30,color:C.dim,anchor:'middle',weight:700})+label('意味 なし',360,250,{size:34,color:C.a,anchor:'middle',weight:700}),seg(p,0,.15),C.a);
  s+=card(630,110,420,200,label('差 ΔU',840,180,{size:34,color:UC,anchor:'middle',weight:700})+label('意味 あり',840,250,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'next']:(p)=>{
  let s=ground(150,550,GY)+ball(350,GY-300)+fade(seg(p,.1,.3),arrow(350,GY-260,350,GY-120,{color:C.faint,w:3,head:12})+label('落ちる',380,GY-180,{size:24,color:C.dim}));
  const base=GY,kk=1.2;
  s+=line(700,base,1100,base,{color:C.dim,w:3})+ebar(800,base,200,kk,{color:UC,text:'U',top:'？'})+ebar(1000,base,200,kk,{color:KC,text:'K',top:'？',g:.35});
  s+=card(600,60,560,100,label('落ちる 間に どう 受け渡す？',880,125,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'bye']:(p)=>{
  let s=card(200,110,800,230,label('次の回',600,175,{size:28,color:C.dim,anchor:'middle'})+label('高さ と 速さ の 受け渡し',600,265,{size:46,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  s+=fade(seg(p,.5,.7),label('仕事とエネルギー・深く学ぶ 3/3 へ',1080,470,{size:26,color:C.dim,anchor:'end'}));
  return s;
 },
};

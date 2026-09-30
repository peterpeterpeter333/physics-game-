// YouTube シリーズ 位置エネルギー・中級 1/2（ステージ um-potential-slope 本0〜本4＋補1・補3＋foundation）— 図。Stage 1200×515.
// 色：力 F・kx 緑、位置 x・s・伸び 水色、エネルギー U・K・仕事 橙（K は薄い橙で区別）、負・誤り 赤、強調 黄。
// ばね：k＝200 N/m、0.10 m で 20 N、U＝1.0 J。三角形 ½×0.10×20＝1.0 J（長方形 2.0 J は誤り）。確かめ 400 N/m・0.050 m → 0.50 J。
import {C,clamp,mix,smooth,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,tex,texWidth,ground,block,poly,wall,spring} from './anim.mjs';

const K='um-potential-slope-1:';
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:C.F,weight:700}));
const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:34,color:C.a,weight:700}));
const KC='#ffd9b0'; // 運動エネルギー K（薄い橙）
const U_=`{\\color{${C.E}}U}`,dU=`d${U_}`,KK=`{\\color{${KC}}K}`,S_=`{\\color{${C.x}}s}`,W_=`{\\color{${C.E}}W}`,X0=`x_0`;
const HALF=`{\\color{${C.hi}}\\tfrac12}`;

// ---- spring + block on a smooth floor. d = displacement [m] (right positive) ----
function rig(d,{ox=560,y=420,sc=1500,wx=150,x0lab=1,fArr=0,hand=0,xArr=0,g=1,bw=110,bh=86,flab='F',hlab='手'}={}){
 const bx=ox+d*sc;
 let s=ground(wx-10,1160,y)+wall(wx,y-160,y);
 s+=spring(wx,bx-bw/2,y-bh/2,{coils:10,amp:16,color:C.dim,w:3});
 s+=block(bx,y,bw,bh,{color:C.x,text:'物体',size:26,fo:.22});
 if(x0lab)s+=line(ox,y-bh-60,ox,y+14,{color:C.dim,w:2,dash:'7 7'})+label('x ＝ 0',ox,y+44,{size:24,color:C.dim,anchor:'middle'});
 const ya=y-bh-78;
 if(xArr&&Math.abs(d)>.004)s+=fade(xArr,arrow(ox,ya,bx,ya,{color:C.x,w:5,head:16})+label('x',(ox+bx)/2,ya-14,{size:28,color:C.x,anchor:'middle',weight:700}));
 const L=-d*sc*.9;
 if(fArr&&Math.abs(d)>.004)s+=fade(fArr,arrow(bx+(L<0?-bw/2:bw/2),y-bh-22,bx+(L<0?-bw/2:bw/2)+L,y-bh-22,{color:C.F,w:6,head:18})+label(flab,bx+(L<0?-bw/2:bw/2)+L+(L<0?-12:12),y-bh-12,{size:26,color:C.F,anchor:L<0?'end':'start',weight:700}));
 if(hand&&Math.abs(d)>.004){const hx=bx+(d>0?bw/2:-bw/2),H=d*sc*.9;s+=fade(hand,arrow(hx,y-bh/2+22,hx+H,y-bh/2+22,{color:C.F,w:6,head:18})+label(hlab,hx+H+(H>0?12:-12),y-bh/2+32,{size:26,color:C.F,anchor:H>0?'start':'end',weight:700}));}
 return fade(g,s);
}
// energy bars (max 1.0 J = 200 px)
function bars(Kv,Uv,{x=880,y=420,g=1,sum=1}={}){
 const h=v=>v*200;
 let s=line(x-30,y,x+230,y,{color:C.dim,w:2});
 s+=rect(x,y-h(Kv),70,h(Kv),{fill:KC,fo:.55,stroke:KC,sw:2,rx:3})+label('K',x+35,y+34,{size:28,color:KC,anchor:'middle',weight:700});
 s+=rect(x+120,y-h(Uv),70,h(Uv),{fill:C.E,fo:.55,stroke:C.E,sw:2,rx:3})+label('U',x+155,y+34,{size:28,color:C.E,anchor:'middle',weight:700});
 s+=label(`${Kv.toFixed(2)}`,x+35,y-h(Kv)-12,{size:22,color:KC,anchor:'middle'})+label(`${Uv.toFixed(2)}`,x+155,y-h(Uv)-12,{size:22,color:C.E,anchor:'middle'});
 if(sum)s+=fade(sum,line(x-30,y-h(1),x+230,y-h(1),{color:C.hi,w:2.5,dash:'8 6'})+label('K＋U ＝ 1.0 J',x+100,y-h(1)-50,{size:24,color:C.hi,anchor:'middle',weight:700}));
 return fade(g,s);
}
// F–x style graph for kx (k = 200)
const GF=(o={})=>axes({x:110,y:450,w:520,h:340,xmin:0,xmax:.13,ymin:0,ymax:26,xlabel:'x [m]',ylabel:'kx [N]',xticks:[.05,.1],yticks:[10,20],xcolor:C.x,ycolor:C.F,...o});
// U graph for U = 100 x²  (k = 200)
const GU=(o={})=>axes({x:130,y:450,w:600,h:340,xmin:-.13,xmax:.13,ymin:0,ymax:1.6,xlabel:'x [m]',ylabel:'U [J]',xticks:[-.1,.1],yticks:[1],xcolor:C.x,ycolor:C.E,...o});

export const ytUmPotentialSlope1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=tex(`${W_}=\\Delta ${KK}`,600,150,{size:90});
  s+=fade(seg(p,.35,.5),label('合力の 仕事',420,320,{size:32,color:C.E,anchor:'middle',weight:700})+arrow(530,310,670,310,{color:C.dim,w:4,head:14})+label('運動エネルギーの 変化',840,320,{size:32,color:KC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('（仕事・中級）',600,410,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'lastq']:(p)=>{
  let s=card(130,40,940,420,label('前回の 最後の問い',600,95,{size:24,color:C.dim,anchor:'middle'})
   +label('重力や ばねの 仕事は',600,170,{size:32,color:C.ink,anchor:'middle'})
   +label('道に よらず 両端だけで 決まる',600,225,{size:34,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.45,.6),label('→ 位置だけの 関数',520,330,{size:36,color:C.ink,anchor:'middle',weight:700})+tex(`${U_}(x)`,760,322,{size:48})+label('に まとめられる？',600,410,{size:34,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'shokyu']:(p)=>{
  const FY=450,SC=100,bx=260;
  let s=ground(90,440,FY)+line(150,FY,150,FY-3*SC-10,{color:C.x,w:3});
  for(let i=0;i<=3;i++)s+=line(142,FY-SC*i,158,FY-SC*i,{color:C.x,w:3})+label(`${i} m`,132,FY-SC*i+8,{size:22,color:C.x,anchor:'end'});
  const h=3*seg(p,.1,.45);
  s+=rect(bx-45,FY-SC*h-70,90,70,{fill:C.x,fo:.22,stroke:C.x,sw:2,rx:8})+label('2 kg',bx,FY-SC*h-26,{size:24,color:C.ink,anchor:'middle'});
  s+=arrow(bx+70,FY-SC*h-60,bx+70,FY-SC*h+10,{color:C.F,w:6,head:16})+label('重力',bx+84,FY-SC*h-18,{size:24,color:C.F,weight:700});
  s+=card(520,60,640,380,label('初級（重力）',840,115,{size:26,color:C.dim,anchor:'middle'})
   +label('U の 増加 ＝ −（重力の 仕事）',840,195,{size:32,color:C.E,anchor:'middle',weight:700})
   +fade(seg(p,.55,.7),tex(`\\Delta ${U_}=mgh`,840,300,{size:60})+label('（例：20 N × 3 m ＝ 60 J）',840,390,{size:26,color:C.dim,anchor:'middle'})),seg(p,.15,.3));
  return s;
 },
 [K+'ask']:(p)=>{
  let s=rig(.1,{ox:420,sc:1200,wx:110,x0lab:0,y:430});
  s+=card(700,70,460,330,label('ばねに 蓄えた 仕事',930,140,{size:30,color:C.ink,anchor:'middle',weight:700})+tex(`${U_}=\\ ?`,930,245,{size:70})+label('どんな 式の「位置の 貯金」？',930,350,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.35),C.hi);
  return s;
 },

 // ===== S2 戻ってくる 1.0 J =====
 [K+'setup']:(p)=>{
  let s=rig(0,{g:seg(p,0,.2)});
  s+=fade(seg(p,.45,.6),arrow(820,160,1000,160,{color:C.x,w:4,head:16})+label('右向きが 正',910,135,{size:26,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.2,.35),label('なめらかな 床（摩擦なし）',860,475,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.3,.45),label('自然の 長さ',560,245,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'hooke']:(p)=>{
  const u=seg(p,.15,.45),w=seg(p,.55,.85),d=.1*u-.2*w;
  let s=rig(d,{fArr:1,xArr:1});
  s+=card(760,40,400,110,tex('F=-kx',960,105,{size:50}),seg(p,0,.15));
  s+=fade(seg(p,.35,.45)*(1-seg(p,.55,.6)),label('伸ばす → 左へ 引く',860,195,{size:28,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,.8,.9),label('縮める → 右へ 押す',860,195,{size:28,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'nums']:(p)=>{
  const d=.1*seg(p,.1,.4);
  let s=rig(d,{hand:1,xArr:1,fArr:seg(p,.45,.6),ox:420,sc:1600,wx:110});
  s+=card(760,30,410,210,tex('k=200\\ \\mathrm{N/m}',965,90,{size:40})+tex('x=0.10\\ \\mathrm{m}',965,165,{size:40}),seg(p,.05,.2));
  s+=card(760,255,410,110,tex('kx=200\\times 0.10=20\\ \\mathrm{N}',965,315,{size:34}),seg(p,.55,.7),C.F);
  return s;
 },
 [K+'handW']:(p)=>{
  let s=rig(.1,{hand:1,fArr:1,ox:420,sc:1600,wx:110,flab:'20 N',hlab:'手 20 N'});
  s+=card(740,60,430,280,label('手が した 仕事',955,125,{size:28,color:C.ink,anchor:'middle'})+tex(`{\\color{${C.E}}1.0\\ \\mathrm{J}}`,955,210,{size:60})
   +fade(seg(p,.45,.6),label('なぜ？ → あとで 式から',955,300,{size:26,color:C.hi,anchor:'middle',weight:700})),seg(p,.1,.25),C.E);
  return s;
 },
 [K+'release']:(p)=>{
  const u=seg(p,.15,.75),d=.1*Math.cos(u*Math.PI/2);
  let s=rig(d,{fArr:1,ox:420,sc:1600,wx:110,x0lab:1});
  const Kv=1-100*d*d,Uv=100*d*d;
  s+=bars(Kv,Uv,{x:860,y:410,sum:0});
  s+=fade(seg(p,.75,.9),label('自然の 長さで K ＝ 1.0 J',960,110,{size:28,color:KC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'stored']:(p)=>{
  let s=card(60,70,500,320,label('伸ばす',310,130,{size:32,color:C.ink,anchor:'middle',weight:700})+label('手の 仕事 ＋1.0 J',310,210,{size:30,color:C.E,anchor:'middle',weight:700})+label('→ 伸びに 蓄える',310,290,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15));
  s+=fade(seg(p,.3,.45),arrow(580,230,620,230,{color:C.dim,w:4,head:14}));
  s+=card(640,70,500,320,label('離す',890,130,{size:32,color:C.ink,anchor:'middle',weight:700})+label('ばねの 仕事 ＋1.0 J',890,210,{size:30,color:C.E,anchor:'middle',weight:700})+label('→ 運動エネルギー',890,290,{size:30,color:KC,anchor:'middle',weight:700}),seg(p,.3,.45));
  s+=fade(seg(p,.6,.75),label('消えずに 戻ってくる',600,450,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'likeg']:(p)=>{
  // left: box at height; right: stretched spring
  let s=card(60,40,500,390,'',1);
  s+=ground(110,500,380)+rect(260,210,90,70,{fill:C.x,fo:.22,stroke:C.x,sw:2,rx:8})+line(200,380,200,280,{color:C.x,w:3})+arrow(200,380,200,284,{color:C.x,w:3,head:12})+label('高さ',188,335,{size:26,color:C.x,anchor:'end',weight:700});
  s+=label('初級：持ち上げた 箱',310,95,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=card(640,40,500,390,label('今回：伸ばした ばね',890,95,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,.25,.4));
  s+=fade(seg(p,.25,.4),ground(660,1120,380)+wall(680,250,380)+spring(680,870,338,{coils:8,amp:12})+block(915,380,90,80,{color:C.x,text:'',fo:.22})+line(800,240,800,390,{color:C.dim,w:2,dash:'6 6'})+arrow(800,225,870,225,{color:C.x,w:4,head:12})+label('伸び',835,205,{size:26,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('どちらも 位置が「戻せる量」を 決める',600,480,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },

 // ===== S3 U の定義と負号 =====
 [K+'whichF']:(p)=>{
  let s=card(90,80,480,300,label('手の 力',330,160,{size:34,color:C.F,anchor:'middle',weight:700})+label('運び方で 変えられる',330,240,{size:26,color:C.dim,anchor:'middle'})+ng(330,320),seg(p,.1,.25),C.a);
  s+=card(630,80,480,300,label('ばねの 力（保存力）',870,160,{size:34,color:C.F,anchor:'middle',weight:700})+label('位置で 決まる',870,240,{size:26,color:C.dim,anchor:'middle'})+label('式の F は こちら',870,320,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'def']:(p)=>{
  let s=label('力の 仕事',520,125,{size:36,color:C.E,anchor:'end',weight:700})+tex(`=F\\,dx`,540,110,{size:60,anchor:'start'});
  s+=fade(seg(p,.05,.2),label('（一歩 dx の 間）',600,190,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),tex(`${dU}=-\\bigl(F\\,dx\\bigr)`,600,300,{size:66}));
  s+=fade(seg(p,.6,.75),label('符号を 変えた もの ＝ U の 増加',600,440,{size:32,color:C.E,anchor:'middle',weight:700}));
  return s;
 },
 [K+'formula']:(p)=>{
  let s=tex(`${dU}=-F\\,dx`,600,130,{size:96});
  s+=card(180,260,840,190,label('定義（約束）',600,315,{size:30,color:C.hi,anchor:'middle',weight:700})+label('力に 逆らって 動かした 分だけ U が 増える',600,390,{size:32,color:C.ink,anchor:'middle'}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'sign']:(p)=>{
  let s=rig(.06,{fArr:1,ox:230,sc:1300,wx:40,y:430,flab:'F',bw:100});
  const bx=230+.06*1300;
  s+=fade(seg(p,.25,.4),arrow(bx-20,275,bx+60,275,{color:C.x,w:5,head:14})+label('dx',bx+20,255,{size:26,color:C.x,anchor:'middle',weight:700}));
  s+=label('伸ばす とき',160,120,{size:28,color:C.dim,anchor:'middle'});
  const row=(y,a,b,g,c=C.ink)=>fade(g,tex(a,870,y,{size:40,anchor:'end'})+label(b,900,y+10,{size:30,color:c,weight:700}));
  s+=card(530,40,640,440,row(110,'F','負（左向き）',seg(p,.05,.2),C.a)+row(190,'dx','正（右向き）',seg(p,.25,.4),C.x)+row(270,'F\\,dx','負',seg(p,.45,.6),C.a)+row(360,`${dU}=-F\\,dx`,'正',seg(p,.65,.8),C.E)+fade(seg(p,.8,.92),label('→ U は 増える',850,440,{size:30,color:C.hi,anchor:'middle',weight:700})),1);
  return s;
 },
 [K+'why']:(p)=>{
  let s=tex(`${dU}={\\color{${C.hi}}-}F\\,dx`,600,150,{size:80});
  s+=card(300,280,600,150,label('なぜ 負号を 付ける？',600,370,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.35),C.hi);
  return s;
 },
 [K+'relK']:(p)=>{
  const u=seg(p,.1,.7),d=.1*Math.cos(u*Math.PI/2);
  let s=rig(d,{fArr:1,ox:330,sc:1500,wx:80,y:430,flab:'ばねの 力'});
  s+=card(640,50,520,240,label('前回',900,100,{size:24,color:C.dim,anchor:'middle'})+tex(`\\Delta${KK}=${W_}`,900,180,{size:56})+label('W：ばねの 力の 仕事',900,255,{size:26,color:C.E,anchor:'middle'}),seg(p,.1,.25));
  s+=fade(seg(p,.6,.75),label('K は W だけ 増える',900,350,{size:30,color:KC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'relU']:(p)=>{
  let s=tex(`\\Delta${KK}=+${W_}`,340,110,{size:56});
  s+=fade(seg(p,.1,.3),tex(`\\Delta${U_}=-${W_}`,860,110,{size:56}));
  s+=fade(seg(p,.1,.3),label('（dU ＝ −F dx を 足し上げる）',860,190,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),tex(`\\Delta${KK}+\\Delta${U_}=${W_}-${W_}=0`,600,320,{size:56}));
  s+=fade(seg(p,.7,.85),label('増えた 分 と 減った 分が 打ち消す',600,430,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'bars']:(p)=>{
  const u=seg(p,.1,.85),d=.1*Math.cos(u*Math.PI/2);
  let s=rig(d,{fArr:1,ox:330,sc:1500,wx:80,y:430});
  s+=bars(1-100*d*d,100*d*d,{x:820,y:420,sum:0});
  return s;
 },
 [K+'const']:(p)=>{
  const u=seg(p,.05,.45),d=.1*Math.cos(u*Math.PI/2);
  let s=rig(d,{fArr:1,ox:330,sc:1500,wx:80,y:430});
  s+=bars(1-100*d*d,100*d*d,{x:820,y:420,sum:seg(p,.05,.2)});
  s+=fade(seg(p,.55,.7),label('負号 → K＋U を 一定に する 約束',600,60,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'finite']:(p)=>{
  let s=tex(`${dU}=-F\\,dx`,600,70,{size:44});
  s+=fade(seg(p,.2,.35),label('x₀ から x まで 足し上げる',600,160,{size:28,color:C.ink,anchor:'middle'})+arrow(600,95,600,130,{color:C.dim,w:3,head:12}));
  s+=fade(seg(p,.45,.6),tex(`${U_}(x)-${U_}(${X0})=-\\int_{${X0}}^{x}F(${S_})\\,d${S_}`,600,290,{size:60}));
  s+=fade(seg(p,.7,.85),label('（補足：有限の 区間の 形）',600,430,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'sx']:(p)=>{
  let s=tex(`${U_}(x)-${U_}(${X0})=-\\int_{${X0}}^{x}F(${S_})\\,d${S_}`,600,80,{size:48});
  const X=u=>200+u*800,y=320,sv=.15+.6*seg(p,.2,.7);
  s+=line(150,y,1060,y,{color:C.dim,w:3});
  s+=dot(X(0),y,10,C.ink)+label('x₀（基準）',X(0),y+45,{size:26,color:C.x,anchor:'middle',weight:700});
  s+=dot(X(1),y,10,C.hi)+label('x（終点）',X(1),y+45,{size:26,color:C.x,anchor:'middle',weight:700});
  s+=fade(seg(p,.15,.3),draw([[X(0),y],[X(sv),y]],1,{color:C.x,w:7})+dot(X(sv),y,9,C.x)+label('s（途中）',X(sv),y-24,{size:26,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('s は 動く，x は 決めた 終点',600,460,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },

 // ===== S4 ばねの U を作る =====
 [K+'sub']:(p)=>{
  let s=tex(`F(${S_})=-k${S_}`,600,60,{size:44});
  const f1=`${U_}(x)-${U_}(${X0})={\\color{${C.hi}}-}\\int_{${X0}}^{x}\\bigl({\\color{${C.hi}}-}k${S_}\\bigr)\\,d${S_}`;
  s+=fade(seg(p,.2,.35),tex(f1,600,190,{size:52}));
  s+=fade(seg(p,.6,.75),tex(`=+\\int_{${X0}}^{x}k${S_}\\,d${S_}`,600,340,{size:52}));
  s+=fade(seg(p,.75,.9),label('負号が 2つ → プラス',600,450,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'base']:(p)=>{
  let s=tex(`${X0}=0,\\quad ${U_}(0)=0`,600,80,{size:50});
  s+=fade(seg(p,.05,.2),label('基準：自然の 長さ（約束）',600,160,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),tex(`${U_}(x)=\\int_0^{x}k${S_}\\,d${S_}`,600,300,{size:66}));
  return s;
 },
 [K+'integ']:(p)=>{
  const q=[`${U_}(x)=k\\int_0^{x}${S_}\\,d${S_}`,`=k\\Bigl[\\dfrac{${S_}^2}{2}\\Bigr]_0^{x}`,`=${HALF}kx^2`],z=52;
  let s=tex(q[0],600,80,{size:z});
  s+=fade(seg(p,.1,.25),label('k は 定数 → 外へ',980,95,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.3,.45),tex(q[1],600,225,{size:z}));
  s+=fade(seg(p,.6,.75),tex(q[2],600,370,{size:64}));
  return s;
 },
 [K+'half']:(p)=>{
  let s=tex(`${U_}=${HALF}kx^2`,600,120,{size:84});
  s+=card(110,250,460,190,label('運動方程式の 回',340,305,{size:26,color:C.dim,anchor:'middle'})+tex(`\\int at\\,dt=${HALF}at^2`,340,385,{size:42}),seg(p,.2,.35));
  s+=card(630,250,460,190,label('今回',860,305,{size:26,color:C.dim,anchor:'middle'})+tex(`\\int_0^{x}k${S_}\\,d${S_}=${HALF}kx^2`,860,385,{size:42}),seg(p,.35,.5));
  s+=fade(seg(p,.6,.75),label('½ ＝ 積分した 足跡',600,490,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'graph']:(p)=>{
  const G=GF();
  let s=G.svg+G.plot(x=>200*x,{from:0,to:.125,p:seg(p,.3,.7),color:C.F,w:5});
  s+=card(720,90,440,270,label('横軸：伸び x',940,160,{size:30,color:C.x,anchor:'middle',weight:700})+label('縦軸：手の 力の 大きさ',940,230,{size:28,color:C.F,anchor:'middle',weight:700})+tex('kx\\;(=-F)',940,300,{size:40}),seg(p,.05,.2));
  return s;
 },
 [K+'tri']:(p)=>{
  const G=GF();
  let s=G.svg+G.plot(x=>200*x,{from:0,to:.125,color:C.F,w:5});
  s+=fade(seg(p,.45,.6),poly([[G.X(0),G.Y(0)],[G.X(.1),G.Y(20)],[G.X(.1),G.Y(0)]],{fill:C.E,fo:.4,stroke:C.E,sw:2}));
  s+=card(720,90,440,280,label('初級：力 × 位置 の',940,160,{size:28,color:C.ink,anchor:'middle'})+label('グラフの 面積 ＝ 仕事',940,210,{size:30,color:C.E,anchor:'middle',weight:700})+fade(seg(p,.45,.6),label('今回は 三角形',940,300,{size:34,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'triNum']:(p)=>{
  const G=GF();
  let s=G.svg+G.plot(x=>200*x,{from:0,to:.125,color:C.F,w:5});
  s+=poly([[G.X(0),G.Y(0)],[G.X(.1),G.Y(20)],[G.X(.1),G.Y(0)]],{fill:C.E,fo:.4,stroke:C.E,sw:2});
  s+=fade(seg(p,.05,.2),line(G.X(0),G.Y(0),G.X(.1),G.Y(0),{color:C.x,w:6})+label('底辺 0.10 m',G.X(.065),G.Y(0)-16,{size:24,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.15,.3),line(G.X(.1),G.Y(0),G.X(.1),G.Y(20),{color:C.F,w:6})+label('20 N',G.X(.1)+14,G.Y(10)+8,{size:26,color:C.F,weight:700}));
  s+=card(720,90,440,300,tex('\\tfrac12\\times {\\color{#6adfff}0.10}\\times {\\color{#83ecc0}20}',940,170,{size:42,auto:false})
   +fade(seg(p,.35,.5),tex(`=${'{\\color{'+C.E+'}1.0\\ \\mathrm{J}}'}`,940,260,{size:54})+ok(1060,270))
   +fade(seg(p,.6,.75),label('最初の 1.0 J',940,350,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.25,.4),C.E);
  return s;
 },
 [K+'wrong']:(p)=>{
  const G=GF();
  let s=G.svg+G.plot(x=>200*x,{from:0,to:.125,color:C.F,w:5});
  s+=poly([[G.X(0),G.Y(0)],[G.X(.1),G.Y(20)],[G.X(.1),G.Y(0)]],{fill:C.E,fo:.4,stroke:C.E,sw:2});
  s+=fade(seg(p,.05,.2),rect(G.X(0),G.Y(20),G.X(.1)-G.X(0),G.Y(0)-G.Y(20),{fill:'none',fo:0,stroke:C.a,sw:3,rx:2})+label('20 × 0.10 ＝ 2.0',G.X(.05),G.Y(20)-14,{size:24,color:C.a,anchor:'middle',weight:700}));
  s+=card(720,90,440,300,label('2.0 J ✗',940,160,{size:36,color:C.a,anchor:'middle',weight:700})+label('最初から 20 N で',940,225,{size:26,color:C.ink,anchor:'middle'})+label('引いた 長方形',940,265,{size:26,color:C.ink,anchor:'middle'})
   +fade(seg(p,.5,.65),label('0 から 増える 途中を',940,330,{size:24,color:C.dim,anchor:'middle'})+label('数えていない',940,365,{size:24,color:C.dim,anchor:'middle'})),seg(p,.1,.25),C.a);
  return s;
 },
 [K+'cap']:(p)=>{
  const G1=axes({x:80,y:430,w:400,h:300,xmin:0,xmax:.13,ymin:0,ymax:26,xlabel:'x',ylabel:'kx',xcolor:C.x,ycolor:C.F});
  const G2=axes({x:680,y:430,w:400,h:300,xmin:0,xmax:7.5,ymin:0,ymax:4,xlabel:'q',ylabel:'V',xcolor:C.p,ycolor:C.v,g:seg(p,.3,.45)});
  let s=label('ばね：½ × 0.10 m × 20 N ＝ 1.0 J',290,60,{size:24,color:C.E,anchor:'middle',weight:700})+G1.svg+G1.plot(x=>200*x,{from:0,to:.12,color:C.F,w:4})+poly([[G1.X(0),G1.Y(0)],[G1.X(.1),G1.Y(20)],[G1.X(.1),G1.Y(0)]],{fill:C.E,fo:.4,stroke:C.E,sw:2});
  s+=fade(seg(p,.3,.45),G2.svg+label('コンデンサ：½ × 6 μC × 3 V ＝ 9 μJ',890,60,{size:24,color:C.E,anchor:'middle',weight:700})+G2.plot(q=>q/2,{from:0,to:7,color:C.v,w:4})+poly([[G2.X(0),G2.Y(0)],[G2.X(6),G2.Y(3)],[G2.X(6),G2.Y(0)]],{fill:C.E,fo:.4,stroke:C.E,sw:2}));
  s+=fade(seg(p,.6,.75),label('比例して 増える 量を 足す → ½',600,490,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'compress']:(p)=>{
  const G=GU();
  let s=G.svg+G.plot(x=>100*x*x,{from:-.125,to:.125,p:seg(p,.05,.4),color:C.E,w:5});
  s+=fade(seg(p,.3,.45),dot(G.X(.1),G.Y(1),10,C.E)+label('伸ばす 0.10 m',G.X(.1)+10,G.Y(1)+40,{size:22,color:C.x,weight:700}));
  s+=fade(seg(p,.45,.6),dot(G.X(-.1),G.Y(1),10,C.E)+label('縮める −0.10 m',G.X(-.1)-10,G.Y(1)+40,{size:22,color:C.x,anchor:'end',weight:700})+line(G.X(-.1),G.Y(1),G.X(.1),G.Y(1),{color:C.hi,w:2,dash:'7 6'}));
  s+=card(845,110,330,250,tex(`${U_}=${HALF}kx^2`,1010,180,{size:44})+fade(seg(p,.5,.65),tex('(-0.10)^2=0.10^2',1010,260,{size:32})+label('同じ 1.0 J',1010,330,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.1,.25));
  return s;
 },

 // ===== S5 確かめと区別 =====
 [K+'quiz']:(p)=>{
  let s=card(230,70,740,360,label('確かめ',600,120,{size:26,color:C.dim,anchor:'middle'})
   +tex('k=400\\ \\mathrm{N/m}',600,195,{size:44})+tex('x=0.050\\ \\mathrm{m}',600,275,{size:44})
   +label('U は いくつ？',600,375,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'ans']:(p)=>{
  let s=tex('0.050^2=0.0025',600,90,{size:50});
  s+=fade(seg(p,.3,.45),tex(`${U_}=\\tfrac12\\times400\\times0.0025`,600,230,{size:52}));
  s+=fade(seg(p,.6,.75),tex(`={\\color{${C.E}}0.50\\ \\mathrm{J}}`,600,360,{size:62})+ok(780,372));
  return s;
 },
 [K+'traps']:(p)=>{
  const cd=(x,t1,t2,c,g,mark)=>card(x,90,340,300,label(t1,x+170,180,{size:40,color:c,anchor:'middle',weight:700})+label(t2,x+170,260,{size:24,color:C.dim,anchor:'middle'})+mark(x+170,340),g,c);
  let s=cd(60,'0.50 J','½ kx²',C.E,1,ok);
  s+=cd(430,'1.0 J','½ を 落とした',C.a,seg(p,.05,.2),ng);
  s+=cd(800,'20 N','力 kx（エネルギーでない）',C.a,seg(p,.4,.55),ng);
  return s;
 },
 [K+'kinds']:(p)=>{
  const cd=(x,t,body,c,g)=>card(x,70,340,360,label(t,x+170,130,{size:30,color:c,anchor:'middle',weight:700})+body,g,c);
  let s=cd(40,'実験に 支えられた',tex('F=-kx',210,250,{size:44})+label('フックの 法則',210,330,{size:26,color:C.dim,anchor:'middle'}),C.F,seg(p,0,.15));
  s+=cd(430,'定義（約束）',tex(`${dU}=-F\\,dx`,600,230,{size:42})+tex(`${U_}(0)=0`,600,320,{size:40})+label('0 の 基準',600,395,{size:24,color:C.dim,anchor:'middle'}),C.hi,seg(p,.3,.45));
  s+=cd(820,'導いた 結果',tex(`${U_}=\\tfrac12kx^2`,990,250,{size:46}),C.E,seg(p,.65,.8));
  return s;
 },
 [K+'cons']:(p)=>{
  let s=card(150,60,900,180,label('U を 位置だけの 関数に できた',600,125,{size:32,color:C.E,anchor:'middle',weight:700})+label('← ばねの 力の 仕事が 道に よらない（保存力）',600,195,{size:28,color:C.ink,anchor:'middle'}),seg(p,0,.15));
  s+=card(300,300,600,130,label('次回：この 条件を 確かめる',600,378,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },

 // ===== S6 まとめと次の問い =====
 [K+'sum']:(p)=>{
  let s=card(80,30,1040,200,label('U の 増加 ＝ 力の 仕事の 符号を 変えた もの',600,90,{size:30,color:C.ink,anchor:'middle',weight:700})+tex(`${dU}=-F\\,dx`,600,170,{size:52}),1);
  s+=card(80,260,1040,200,label('ばね：0 から x まで 足し上げる',600,315,{size:30,color:C.ink,anchor:'middle',weight:700})+tex(`${U_}=${HALF}kx^2`,600,400,{size:56}),seg(p,.45,.6));
  return s;
 },
 [K+'next']:(p)=>{
  let s=tex('F',300,150,{size:80})+fade(seg(p,.05,.2),arrow(360,130,540,130,{color:C.E,w:5,head:18})+label('足し上げる',450,95,{size:24,color:C.E,anchor:'middle'})+tex(U_,600,150,{size:80}));
  s+=fade(seg(p,.35,.5),arrow(540,190,360,190,{color:C.hi,w:5,head:18})+label('？',450,245,{size:44,color:C.hi,anchor:'middle',weight:700}));
  s+=card(700,70,440,260,label('次の問い',920,130,{size:24,color:C.dim,anchor:'middle'})+label('U の 式から',920,200,{size:34,color:C.E,anchor:'middle',weight:700})+label('力を 取り戻せる？',920,265,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
};

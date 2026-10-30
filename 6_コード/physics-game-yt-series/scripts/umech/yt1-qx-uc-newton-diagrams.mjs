// 問題編 解説「斜めに投げた球の道と、抵抗が入った瞬間」（q-uc-newton、大学編 10 運動方程式・上級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/10_運動方程式.md の q-uc-newton（解説 20 行）。
// 画面：左に x–y の座標と小球（初速度 紫）、右に手順の札と式の枠（紺の塗り）。誤答カードは右の枠の下に1枚ずつ。
// 色：位置 x・y 水色、速度 紫、加速度 赤、力（重力・抵抗）緑、時間 t 金、強調 黄、誤り 赤。札の帯（y＜78）には図を描かない。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,poly} from './anim.mjs';
import {QX,card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,cueT,sentWin,textW} from './yt1-qx-common.mjs';

const K='qx-uc-newton:';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const cA=s=>`{\\color{${C.a}}${s}}`,cV=s=>`{\\color{${C.v}}${s}}`,cX=s=>`{\\color{${C.x}}${s}}`,cT=s=>`{\\color{${C.t}}${s}}`,cH=s=>`{\\color{${C.hi}}${s}}`,cF=s=>`{\\color{${C.F}}${s}}`;
const BAD='#ff6b6b',GRAY='#8a97ad';
const G1='道の式（y を x で表す）',G2='成り立たない確かめ',G3='投げた瞬間の加速度 𝐚';
const ANS1=g=>answerTag(1,'C','',{g}),ANS2=g=>answerTag(2,'B','',{g}),ANS3=g=>answerTag(3,'B','(−3, −14) m/s²',{g});
const win2=ctx=>{const W=sentWin(ctx);return W.length>1?W[1][0]:.5;};
const PX=680,PW=500,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WO={x:PX,w:PW,size:26,whySize:22};

// ---- 座標（左） ------------------------------------------------------------------
const OX=130,OY=420,KM=55;
const P=(x,y)=>[OX+KM*x,OY-KM*y];
const xOf=t=>6*t,yOf=t=>8*t-5*t*t;
function plane({g=1,ticks=1}={}){
 let s=arrow(OX-30,OY,OX+KM*9.9,OY,{color:C.x,w:3,head:14})+arrow(OX,OY+40,OX,OY-KM*5.3,{color:C.x,w:3,head:14});
 s+=label('x [m]',OX+KM*9.9,OY+30,{size:22,color:C.x,anchor:'end'})+label('y [m]',OX+14,OY-KM*5.3+6,{size:22,color:C.x});
 if(ticks){for(const m of [2,4,6,8])s+=line(OX+KM*m,OY-6,OX+KM*m,OY+6,{color:C.x,w:2})+label(String(m),OX+KM*m,OY+30,{size:22,color:C.x,anchor:'middle'});
  for(const m of [1,2,3,4])s+=line(OX-6,OY-KM*m,OX+6,OY-KM*m,{color:C.x,w:2})+label(String(m),OX-12,OY-KM*m+8,{size:22,color:C.x,anchor:'end'});
  s+=label('0',OX-12,OY+26,{size:22,color:C.x,anchor:'end'});}
 return fade(g,s);
}
const VK=18; // 1 m/s あたりの px
function ball(x,y,{v0=0,vlab=1,tri=0,grav=0,r=13}={}){
 const [bx,by]=P(x,y);let s='';
 if(tri)s+=fade(tri,draw([[bx,by],[bx+6*VK,by],[bx+6*VK,by-8*VK]],1,{color:C.v,w:2.5,dash:'6 6'})
  +label('6',bx+3*VK,by+28,{size:24,color:C.v,anchor:'middle',weight:700})+label('8',bx+6*VK+14,by-4*VK+8,{size:24,color:C.v,weight:700}));
 if(v0)s+=fade(v0,arrow(bx,by,bx+6*VK,by-8*VK,{color:C.v,w:6,head:18})+(vlab?label('𝐯(0) ＝ (6, 8) m/s',bx+6*VK+14,by-8*VK+4,{size:24,color:C.v,weight:700}):''));
 if(grav)s+=fade(grav,arrow(bx,by,bx,by+90,{color:C.F,w:6,head:16})+label('mg',bx-12,by+84,{size:24,color:C.F,anchor:'end',weight:700}));
 s+=ring(bx,by,r,{color:C.x,w:3,fill:'#123049'});
 return s;
}
const gTag=(g=1,x=OX+KM*5.6,y=110)=>fade(g,rect(x,y-28,196,40,{fill:'#1b2438',fo:.95,stroke:C.dim,sw:2,rx:20})+label('g ＝ 10 m/s²',x+98,y,{size:24,color:C.ink,anchor:'middle'}));
const path=(p=1,{color=C.x,w=4,dash='',dy=0,to=1.6}={})=>draw(Array.from({length:81},(_,i)=>{const t=to*i/80;return P(xOf(t),yOf(t)+dy);}),p,{color,w,dash});

// ---- 手順の札（右の枠の上に横一列） ---------------------------------------------------
const STEPS=['①力を全部書く','②成分に分ける','③初期条件で積分'];
function steps({on=-1,g=1,y=88,x=620,w=570}={}){
 const cw=(w-20)/3;let s='';
 STEPS.forEach((t,i)=>{const cx=x+i*(cw+10),hi=i===on;
  s+=rect(cx,y,cw,44,{fill:hi?C.hi:'#131f38',fo:hi?.16:.96,stroke:hi?C.hi:C.faint,sw:hi?3:2,rx:12})+label(t,cx+cw/2,y+30,{size:22,color:hi?C.hi:C.dim,anchor:'middle',weight:700});});
 return fade(g,s);
}
// チェック欄（小問2）
const CHK=['方程式','初めの 位置','初めの 速度'];
function checks(st,{x=PX+30,y=250,g=1,frame=0,dy=58}={}){
 let s='';
 CHK.forEach((n,i)=>{const yy=y+i*dy,v=st[i]??0;
  s+=rect(x,yy-26,34,34,{fill:'none',fo:0,stroke:C.dim,sw:2.5,rx:6})+label(n,x+50,yy,{size:26,color:C.ink,weight:700});
  if(v>0)s+=fade(Math.min(1,v),label('✓',x+17,yy+2,{size:30,color:C.F,anchor:'middle',weight:700}));
  if(v<0)s+=fade(Math.min(1,-v),label('×',x+17,yy+2,{size:32,color:BAD,anchor:'middle',weight:700}));});
 if(frame)s+=fade(frame,rect(x-16,y-46,PW-30,dy*3+18,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:12}));
 return fade(g,s);
}

export const ytQxUcNewtonDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（約5秒）：座標と原点の小球。0〜2 s 初速度の矢印「(6, 8) m/s」、2〜4 s 点線の直角三角形（6 と 8）と「g＝10 m/s²」、4〜5 s 隅に「小問3：空気抵抗 −k𝐯 を加える」（緑の枠）。静止。
 [K+'q0']:(p)=>{
  let s=plane({g:seg(p,0,.1)});
  s+=ball(0,0,{v0:seg(p,.05,.4),tri:seg(p,.42,.65)});
  s+=gTag(seg(p,.6,.75));
  s+=fade(seg(p,.8,.95),rect(780,410,400,44,{fill:'#132a22',fo:.95,stroke:C.F,sw:2.5,rx:12})+label('小問3：空気抵抗 −k𝐯 を加える',980,440,{size:24,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 // 小問3（約3秒）：前の図（道・確かめの線）は描かない。原点の小球と初速度、「空気抵抗 −k𝐯 を加える（k/m ＝ 0.5 /s）」。抵抗の矢印は描かない。
 [K+'q3']:(p)=>{
  let s=plane({g:seg(p,0,.15)})+ball(0,0,{v0:seg(p,.05,.4),tri:seg(p,.3,.55)})+gTag(seg(p,.3,.5));
  s+=fade(seg(p,.55,.85),card(760,170,420,150,label('小問3',970,212,{size:24,color:C.dim,anchor:'middle'})+label('空気抵抗 −k𝐯 を 加える',970,256,{size:28,color:C.F,anchor:'middle',weight:700})
   +label('k/m ＝ 0.5 /s',970,298,{size:28,color:C.ink,anchor:'middle',weight:700}),1,C.F));
  return s;
 },

 // ===================== 小問1 =====================
 // 1. 出題中の図。求めるもの
 [K+'goal1']:(p)=>{
  let s=plane()+ball(0,0,{v0:1,tri:1})+gTag();
  s+=panel(170,170,label('小問1（抵抗なし）',PC,215,{size:26,color:C.dim,anchor:'middle'})+label('道の 形を 表す 式',PC,262,{size:30,color:C.hi,anchor:'middle',weight:700})
   +label('y を x で 表す',PC,306,{size:28,color:C.x,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 2. 手順の札①②③。①を光らせ、重力の矢印（緑、下向き）だけを描く
 [K+'steps']:(p,ctx)=>{
  const b=win2(ctx);
  let s=plane()+ball(0,0,{v0:1,grav:seg(p,b+.05,b+.15)});
  s+=steps({on:seg(p,b,b+.05)>0?0:-1,g:seg(p,.03,.15)});
  s+=fade(seg(p,b+.1,b+.2),panel(150,140,label('空中で はたらく 力',PC,192,{size:24,color:C.dim,anchor:'middle'})+label('重力 mg だけ（下向き）',PC,245,{size:28,color:C.F,anchor:'middle',weight:700}),1,C.F));
  s+=goalTag(G1);
  return s;
 },
 // 3. ②を光らせる。x の列と y の列の2列の表。x の列に y が入らないことを枠で示す
 [K+'comp']:(p,ctx)=>{
  let s=plane()+ball(0,0,{v0:1,grav:1});
  s+=steps({on:1});
  s+=panel(150,300,line(PC,165,PC,430,{color:C.faint,w:2})
   +label('x の 列',PX+125,192,{size:26,color:C.x,anchor:'middle',weight:700})+label('y の 列',PX+375,192,{size:26,color:C.x,anchor:'middle',weight:700})
   +fade(seg(p,.1,.25),T(`${cF('F_x')}=0`,PX+125,250,30)+T(`${cF('F_y')}=-mg`,PX+375,250,30))
   +fade(seg(p,.3,.45),T(`\\dfrac{d^2${cX('x')}}{dt^2}=0`,PX+125,335,30)+T(`\\dfrac{d^2${cX('y')}}{dt^2}=-10`,PX+375,335,30))
   +fade(seg(p,.6,.72),rect(PX+20,170,210,195,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:12})+label('y は 入らない',PX+125,410,{size:24,color:C.hi,anchor:'middle',weight:700})),1);
  s+=goalTag(G1);
  return s;
 },
 // 4. ③を光らせる。0.1 s ごとの点：水平の等速のフィルム（0.6 m ずつ）と鉛直のフィルムを描き、重ねて放物線に。−5t² の 5 に「½g」
 [K+'film']:(p,ctx)=>{
  const b=win2(ctx),n=16,hx=seg(p,.05,.35),vy=seg(p,b,b+.25),mix2=seg(p,b+.28,b+.5);
  let s=plane()+ball(0,0,{v0:1,vlab:0});
  for(let i=0;i<=n;i++){const t=i/10;
   if(i/n<=hx+1e-6){const [x]=P(xOf(t),0);s+=dot(x,OY+58,5,C.x);}
   if(i/n<=vy+1e-6){const [,y]=P(0,yOf(t));s+=dot(OX-46,y,5,C.x);}
   if(mix2>0&&i/n<=mix2+1e-6){const [x,y]=P(xOf(t),yOf(t));s+=dot(x,y,6,C.hi);}}
  s+=fade(hx,label('横：0.6 m ずつ',OX+KM*7,OY+88,{size:22,color:C.x,weight:700}));
  s+=fade(vy,label('縦',OX-46,OY-KM*4.2,{size:22,color:C.x,anchor:'middle',weight:700}));
  s+=steps({on:2});
  s+=panel(150,260,label('横：加速度 0',PX+125,192,{size:24,color:C.dim,anchor:'middle'})+label('縦：2回 積分',PX+375,192,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.05,.2),label('速度 6 m/s の まま',PX+125,240,{size:24,color:C.v,anchor:'middle',weight:700})+T(`${cX('x')}=6${cT('t')}`,PX+125,300,32))
   +fade(seg(p,b,b+.12),T(`${cX('y')}=8${cT('t')}-${cH('5')}${cT('t')}^2`,PX+375,300,32))
   +fade(seg(p,b+.15,b+.25),rect(PX+325,330,110,40,{fill:C.hi,fo:.12,stroke:C.hi,sw:2,rx:12})+label('5 ＝ ½g',PX+380,358,{size:24,color:C.hi,anchor:'middle',weight:700})),1);
  s+=goalTag(G1);
  return s;
 },
 // 5. 「t を消す」：t＝x/6 の札を作り、y の式の t の所へ運ぶ（式の場面）
 [K+'elim']:(p,ctx)=>{
  const b=win2(ctx),mv=seg(p,b+.15,b+.45),done=seg(p,b+.45,b+.55);
  let s=card(60,90,1080,380,'',1);
  s+=label('時刻 t を 消す',600,140,{size:28,color:C.hi,anchor:'middle',weight:700});
  s+=T(`${cX('x')}=6${cT('t')}`,330,215,40);
  s+=fade(seg(p,b,b+.12),arrow(420,210,520,210,{color:C.dim,w:3,head:12})+T(`${cT('t')}=\\dfrac{${cX('x')}}{6}`,640,215,40));
  s+=T(`${cX('y')}=8${cT('t')}-5${cT('t')}^2`,600,330,44,{opacity:1-done});
  // 運ばれる札
  if(mv>0&&done<1){const tx=mix(640,620,mv),ty=mix(250,320,mv);s+=fade(1-done,rect(tx-50,ty-40,100,80,{fill:C.hi,fo:.1,stroke:C.hi,sw:2.5,rx:10}));}
  s+=fade(done,T(`${cX('y')}=8\\left(\\dfrac{${cX('x')}}{6}\\right)-5\\left(\\dfrac{${cX('x')}}{6}\\right)^2`,600,340,40));
  s+=fade(seg(p,.05,.2),label('道の 形 ＝ y と x の 関係',600,440,{size:24,color:C.dim,anchor:'middle'}));
  s+=goalTag(G1);
  return s;
 },
 // 6. 8t → (4/3)x、5t² → 5×x²/36（分母の 6 が2乗で 36、黄）。完成した式の横に放物線。答えの札 C
 [K+'ans1']:(p,ctx)=>{
  const b=win2(ctx);
  let s=plane()+ball(0,0,{})+path(seg(p,b,b+.3));
  s+=panel(110,330,T(`8${cT('t')}=8\\cdot\\dfrac{${cX('x')}}{6}=\\dfrac{4}{3}${cX('x')}`,PC,175,30)
   +fade(seg(p,.25,.4),T(`5${cT('t')}^2=5\\cdot\\dfrac{${cX('x')}^2}{${cH('36')}}=\\dfrac{5}{36}${cX('x')}^2`,PC,265,30))
   +fade(seg(p,.3,.45),label('6² ＝ 36',PX+70,320,{size:24,color:C.hi,weight:700}))
   +fade(seg(p,b-.05,b+.05),line(PX+30,340,PX+PW-30,340,{color:C.faint,w:2})+T(`${cX('y')}=\\dfrac{4}{3}${cX('x')}-\\dfrac{5}{36}${cX('x')}^2`,PC,395,34)),1,C.x);
  s+=goalTag(G1)+ANS1(seg(p,b+.3,b+.38));
  return s;
 },
 // 7a. 最高点 t＝0.8 s、x＝4.8 m。頂点に印、x＝4.8 の目盛り
 [K+'check1']:(p)=>{
  const [vx,vy]=P(4.8,3.2);
  let s=plane()+path(1);
  s+=fade(seg(p,.2,.35),dot(vx,vy,9,C.hi)+line(vx,vy,vx,OY,{color:C.x,w:2.5,dash:'6 6'})+label('4.8',vx,OY+56,{size:24,color:C.x,anchor:'middle',weight:700}));
  s+=panel(110,200,label('確かめ：最高点',PC,152,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.1,.25),T(`\\dfrac{dy}{dt}=8-10${cT('t')}=0`,PC,215,30))
   +fade(seg(p,.3,.45),label('t ＝ 0.8 s、x ＝ 6 × 0.8 ＝ 4.8 m',PC,282,{size:26,color:C.ink,anchor:'middle',weight:700})),1);
  s+=goalTag(G1)+ANS1(1);
  return s;
 },
 // 7b. 道の式に入れると 6.4−3.2＝3.2。8t−5t² の値と一致
 [K+'check1b']:(p)=>{
  const [vx,vy]=P(4.8,3.2);
  let s=plane()+path(1)+dot(vx,vy,9,C.hi)+line(vx,vy,vx,OY,{color:C.x,w:2.5,dash:'6 6'})+label('4.8',vx,OY+56,{size:24,color:C.x,anchor:'middle',weight:700});
  s+=fade(seg(p,.5,.6),label('3.2 m',vx+14,vy-14,{size:26,color:C.hi,weight:700}));
  s+=panel(110,300,label('道の 式に x ＝ 4.8',PC,152,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.05,.2),T(`\\dfrac{4}{3}(4.8)-\\dfrac{5}{36}(4.8)^2`,PC,210,28))
   +fade(seg(p,.2,.35),T(`=6.4-3.2=${cH('3.2')}`,PC,270,30))
   +fade(seg(p,.4,.55),line(PX+30,300,PX+PW-30,300,{color:C.faint,w:2})+label('t ＝ 0.8 で 8t − 5t²',PC,340,{size:24,color:C.dim,anchor:'middle'})+T(`6.4-3.2=${cH('3.2')}\\ \\checkmark`,PC,385,30)),1,C.hi);
  s+=goalTag(G1)+ANS1(1);
  return s;
 },
 // 8. 誤答 A → D（1文目を半分ずつ）→ B（2文目）
 [K+'wrong1']:(p,ctx)=>{
  const W=sentWin(ctx),e1=W[0][1],b2=W[1]?W[1][0]:e1;
  let s=plane()+path(1);
  s+=panel(90,120,label('正しい 道の 式',PC,128,{size:22,color:C.dim,anchor:'middle'})+T(`${cX('y')}=\\dfrac{4}{3}${cX('x')}-\\dfrac{5}{36}${cX('x')}^2`,PC,180,30),1);
  s+=wrongSeq(p,ctx,[['A','y＝(4/3)x−(5/18)x²','½g で なく g を 使った（8t − 10t²）'],['D','y＝(4/3)x−(5/6)x²','6 を 2乗し 忘れた'],['B','y＝(3/4)x−(5/64)x²','横 8・縦 6 と 入れ替えた']],
   {win:[[0,e1*.5],[e1*.5,e1],[b2,1]],opts:{...WO,y:240}});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },

 // ===================== 小問2 =====================
 // 9. 誤答カードを消す。チェック欄3つを空で並べる
 [K+'goal2']:(p)=>{
  let s=plane()+path(1)+ball(0,0,{});
  s+=panel(90,400,label('ある人の 解',PC,130,{size:24,color:C.dim,anchor:'middle'})+T(`${cX('y')}=8${cT('t')}-5${cT('t')}^2+2`,PC,185,36)
   +fade(seg(p,.2,.35),checks([0,0,0])),seg(p,.03,.15));
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 10. 「方程式」に ✓。式の ＋2 に打ち消し線が2回の微分で入る
 [K+'eq2']:(p,ctx)=>{
  const b=win2(ctx),c1=seg(p,.1,.2),c2=seg(p,.25,.35);
  let s=plane()+path(1)+ball(0,0,{});
  const f0=`${cX('y')}=8${cT('t')}-5${cT('t')}^2+${c1>.5?`\\cancel{2}`:'2'}`;
  s+=panel(90,400,T(f0,PC,150,32)
   +fade(c1,T(`\\dfrac{dy}{dt}=8-10${cT('t')}`,PC-120,215,26))+fade(c2,T(`\\dfrac{d^2y}{dt^2}=-10`,PC+130,215,26))
   +fade(seg(p,b,b+.08),label('2 は 微分で 消える',PC,282,{size:24,color:C.hi,anchor:'middle',weight:700}))
   +checks([seg(p,.4,.5),0,0],{y:340,dy:46}),1);
  s+=goalTag(G2);
  return s;
 },
 // 11. 「初めの速度」に ✓
 [K+'v2']:(p)=>{
  let s=plane()+path(1)+ball(0,0,{v0:seg(p,.3,.45),vlab:0});
  s+=panel(90,400,T(`${cX('y')}=8${cT('t')}-5${cT('t')}^2+2`,PC,150,32)
   +T(`\\dfrac{dy}{dt}=8-10${cT('t')}`,PC,215,28)
   +fade(seg(p,.3,.45),label('t ＝ 0 で 8 m/s',PC,280,{size:24,color:C.v,anchor:'middle',weight:700}))
   +checks([1,0,seg(p,.5,.6)],{y:340,dy:46}),1);
  s+=goalTag(G2);
  return s;
 },
 // 12. 「初めの位置」に ×（赤）。放物線を 2 m 上にずらした点線。答えの札 B
 [K+'ans2']:(p,ctx)=>{
  const b=win2(ctx),[x2,y2]=P(0,2);
  let s=plane()+path(1)+ball(0,0,{});
  s+=fade(seg(p,.15,.35),path(1,{color:BAD,w:3,dash:'8 6',dy:2})+dot(x2,y2,8,BAD)+label('点線：t ＝ 0 で y ＝ 2 m',OX+KM*5,OY-KM*.6,{size:22,color:BAD,anchor:'middle',weight:700}));
  s+=panel(90,400,T(`${cX('y')}(0)=0-0+2=${cH('2')}`,PC,150,32)
   +fade(seg(p,.2,.35),label('原点から 投げた（y ＝ 0）に 合わない',PC,215,{size:24,color:BAD,anchor:'middle',weight:700}))
   +checks([1,-seg(p,.3,.4),1],{y:340,dy:46}),1);
  s+=goalTag(G2)+ANS2(seg(p,b,b+.08));
  return s;
 },
 // 13. 誤答 A → C（1文目を半分ずつ）→ D（2文目）
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),e1=W[0][1],b2=W[1]?W[1][0]:e1,inD=seg(p,b2,b2+.05);
  const [vx,vy]=P(4.8,5.2);
  let s=plane()+path(1)+path(1,{color:BAD,w:3,dash:'8 6',dy:2})+ball(0,0,{});
  s+=fade(inD,dot(vx,vy,9,C.hi)+label('t ＝ 0.8 s',vx,vy-18,{size:22,color:C.hi,anchor:'middle',weight:700}));
  s+=panel(90,190,checks([1,-1,1],{y:136,dy:46}),1);
  s+=wrongSeq(p,ctx,[['A','2回微分','−10 に なり 成り立つ'],['C','初めの 速度','8 に なり 成り立つ'],['D','最高点','t ＝ 0.8 s で dy/dt ＝ 0、成り立つ']],
   {win:[[0,e1*.5],[e1*.5,e1],[b2,1]],opts:{...WO,y:300}});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },
 // 14. 誤答カードを消す。チェック欄3つを黄で囲む
 [K+'all3']:(p,ctx)=>{
  const b=win2(ctx);
  let s=plane()+path(1)+ball(0,0,{});
  s+=panel(90,330,label('方程式を 満たす だけ では 足りない',PC,135,{size:26,color:C.ink,anchor:'middle',weight:700})
   +checks([1,-1,1],{y:215,dy:60,frame:seg(p,b,b+.1)})
   +fade(seg(p,b+.1,b+.2),label('三つ 全部を 確かめる',PC,395,{size:28,color:C.hi,anchor:'middle',weight:700})),1);
  s+=goalTag(G2)+ANS2(1);
  return s;
 },

 // ===================== 小問3 =====================
 // 15. 点線とチェック欄を消す。投げた瞬間の小球と初速度
 [K+'goal3']:(p)=>{
  let s=plane()+ball(0,0,{v0:1,tri:1})+gTag();
  s+=panel(170,200,label('小問3',PC,212,{size:26,color:C.dim,anchor:'middle'})+label('空気抵抗 −k𝐯 を 加える',PC,258,{size:28,color:C.F,anchor:'middle',weight:700})
   +label('k/m ＝ 0.5 /s',PC,302,{size:26,color:C.ink,anchor:'middle'})+label('投げた 瞬間の 加速度 は？',PC,346,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 16. 重力（緑・下向き）と、速度と逆向きの抵抗（緑・左下向き）。抵抗を横と縦の成分に分け、逆向きを黄で
 [K+'drag']:(p,ctx)=>{
  const b=win2(ctx),[bx,by]=P(0,0),RK=9,gr=seg(p,.05,.15),dr=seg(p,.15,.3),cp=seg(p,b,b+.12);
  let s=plane()+ball(0,0,{v0:1,vlab:0});
  s+=fade(gr,arrow(bx,by,bx,by+90,{color:C.F,w:6,head:16})+label('mg',bx+12,by+90,{size:24,color:C.F,weight:700}));
  s+=fade(dr,arrow(bx,by,bx-6*RK,by+8*RK,{color:C.F,w:6,head:16})+label('抵抗',bx-6*RK-10,by+8*RK+10,{size:24,color:C.F,anchor:'end',weight:700}));
  s+=fade(cp,arrow(bx,by+4,bx-6*RK,by+4,{color:C.hi,w:3.5,head:12})+arrow(bx-6*RK,by,bx-6*RK,by+8*RK,{color:C.hi,w:3.5,head:12}));
  s+=panel(110,300,label('抵抗 ＝ −k𝐯 ＝ −k(6, 8)',PC,155,{size:26,color:C.F,anchor:'middle',weight:700})
   +fade(dr,label('速度と 逆向き',PC,192,{size:24,color:C.hi,anchor:'middle',weight:700}))
   +fade(seg(p,b,b+.1),label('m で 割った 成分',PC,228,{size:24,color:C.dim,anchor:'middle'})
    +T(`${cA('a_x')}=-\\dfrac{k}{m}\\times6`,PC,290,32))
   +fade(seg(p,b+.2,b+.3),T(`${cA('a_y')}=-g-\\dfrac{k}{m}\\times8`,PC,365,32)),1,C.F);
  s+=goalTag(G3);
  return s;
 },
 // 17. aₓ＝−3、a_y＝−14。加速度 (−3, −14) を赤で。答えの札 B
 [K+'ans3']:(p,ctx)=>{
  const b=win2(ctx),[bx,by]=P(0,0),AK=6;
  let s=plane()+ball(0,0,{v0:1,vlab:0});
  s+=arrow(bx,by,bx,by+60,{color:C.F,w:4,head:12,opacity:.5})+arrow(bx,by,bx-6*9,by+8*9,{color:C.F,w:4,head:12,opacity:.5});
  s+=fade(seg(p,b*.7,b*.9),arrow(bx,by,bx-3*AK,by+14*AK,{color:C.a,w:7,head:20})+label('𝐚',bx-3*AK+12,by+14*AK-4,{size:30,color:C.a,weight:700}));
  s+=panel(110,300,T(`${cA('a_x')}=-0.5\\times6=${cA('-3')}`,PC,175,32)
   +fade(seg(p,.3,.45),T(`${cA('a_y')}=-10-0.5\\times8=${cA('-14')}`,PC,265,32))
   +fade(seg(p,.55,.68),label('𝐚 ＝ (−3, −14) m/s²',PC,355,{size:30,color:C.a,anchor:'middle',weight:700})),1,C.a);
  s+=goalTag(G3)+ANS3(seg(p,b,b+.08));
  return s;
 },
 // 18. 誤答 A（1文目）→ C → D（2文目を半分ずつ）
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),e1=W[0][1],b2=W[1]?W[1][0]:e1,m2=b2+(1-b2)*.5,[bx,by]=P(0,0),AK=6;
  let s=plane()+ball(0,0,{v0:1,vlab:0})+arrow(bx,by,bx-3*AK,by+14*AK,{color:C.a,w:7,head:20})+label('𝐚',bx-3*AK+12,by+14*AK-4,{size:30,color:C.a,weight:700});
  s+=panel(90,110,label('𝐚 ＝ (−3, −14) m/s²',PC,155,{size:30,color:C.a,anchor:'middle',weight:700}),1,C.a);
  s+=wrongSeq(p,ctx,[['A','(0, −10)','抵抗を 入れていない'],['C','(−3, −6)','上りで 抵抗の 縦を 上向きに した'],['D','(3, −14)','抵抗の 横を 速度と 同じ 向きに した']],
   {win:[[0,e1],[b2,m2],[m2,1]],opts:{...WO,y:230}});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },
 // 19. 上りの小球と下りの小球で、抵抗の縦成分が下向き→上向き。中級の「a を外に出す」操作に ×
 [K+'updown']:(p,ctx)=>{
  const b=win2(ctx),t1=.4,t2=1.2,RK=9;
  let s=plane()+path(1,{color:GRAY,w:2.5,dash:'7 7'});
  const one=(t,g,lab)=>{const [x,y]=P(xOf(t),yOf(t)),vx=6,vy=8-10*t;
   return fade(g,arrow(x,y,x+vx*VK*.8,y-vy*VK*.8,{color:C.v,w:5,head:14})+arrow(x,y,x,y+vy*RK,{color:C.F,w:6,head:16})
    +ring(x,y,12,{color:C.x,w:3,fill:'#123049'})+label(lab,x,y-28-(vy>0?vy*VK*.8:0),{size:24,color:C.ink,anchor:'middle',weight:700}));};
  s+=one(t1,seg(p,b,b+.1),'上り')+one(t2,seg(p,b+.15,b+.25),'下り');
  s+=fade(seg(p,b+.1,b+.2),label('抵抗の 縦：下向き',P(xOf(t1),0)[0]-10,OY+64,{size:22,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,b+.25,b+.35),label('抵抗の 縦：上向き',P(xOf(t2),0)[0]+30,OY+64,{size:22,color:C.F,anchor:'middle',weight:700}));
  s+=panel(110,300,label('加速度が 速度で 変わる',PC,155,{size:28,color:C.a,anchor:'middle',weight:700})
   +fade(seg(p,.1,.25),label('中級の 操作',PC,215,{size:22,color:C.dim,anchor:'middle'})+T(`\\int ${cA('a')}\\,dt=${cA('a')}\\int dt`,PC,272,32))
   +fade(seg(p,.25,.35),line(PC-140,240,PC+140,300,{color:BAD,w:5})+line(PC-140,300,PC+140,240,{color:BAD,w:5}))
   +fade(seg(p,.3,.42),label('a を 定数として 外に 出せない',PC,350,{size:24,color:BAD,anchor:'middle',weight:700})),1,C.a);
  s+=goalTag(G3)+ANS3(1);
  return s;
 },

 // ===================== まとめ =====================
 // 20. 手順の札①②③とチェック欄3つを並べる。右上に答えの札3枚
 [K+'sum']:(p)=>{
  let s=fade(seg(p,.02,.12),label('法則は ma ＝ F の 1本',600,140,{size:32,color:C.F,anchor:'middle',weight:700}));
  s+=steps({x:150,w:900,y:180,g:seg(p,.15,.3)});
  s+=fade(seg(p,.32,.42),label('力の モデルが 変わると 解き方は 変わる',600,280,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.42,.55),card(250,310,700,170,label('確かめ方は 同じ',600,350,{size:26,color:C.hi,anchor:'middle',weight:700})
   +[0,1,2].map(i=>{const x=290+i*220;return rect(x,390,34,34,{fill:'none',fo:0,stroke:C.dim,sw:2.5,rx:6})+label('✓',x+17,418,{size:30,color:C.F,anchor:'middle',weight:700})+label(CHK[i],x+48,416,{size:26,color:C.ink,weight:700});}).join(''),1,C.hi));
  s+=answerRow([[1,'C',''],[2,'B',''],[3,'B','(−3, −14) m/s²']],{g:seg(p,.65,.75)});
  return s;
 },
};

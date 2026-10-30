// 問題編 解説「縮めたばねの U と、谷の傾き」（q-um-potential-slope、大学編 13 位置エネルギー・中級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/13_位置エネルギー.md の q-um-potential-slope（解説 18 行）。
// 画面の配置：小問1 は左上にばね、右に「縮み−手の力」のグラフ、左下に式・誤答カード。小問2・3 は左に U の谷のグラフ、右に説明の枠。
// 札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 色：力 F・kx 緑、位置 x・縮み 水色、U 橙、傾き（接線）・強調 黄、負・誤り 赤（単元動画 um-potential-slope と同じ）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,axes,poly,wall,spring,tex,texWidth} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-um-potential-slope:';
const NEG='#ff6b6b',CU=C.E,CX=C.x,CF=C.F,HI=C.hi;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const cc=(col,s)=>`{\\color{${col}}{${s}}}`;
const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
const uU=cc(CU,'U'),xX=cc(CX,'x'),fF=cc(CF,'F');
const G1='x＝−0.040 m の U',G2='x＝−0.30 の力 F',G3='U＝50x²−2 の力と U';
const ANS1=g=>answerTag(1,'B','0.40 J',{g}),ANS2=g=>answerTag(2,'D','＋30 N',{g}),ANS3=g=>answerTag(3,'A','＋30 N、2.5 J',{g});

// ---- 小問1：ばね（0.040 m＝120 px）----
const FL=250,X0=430,SCX=3000,BW=90,BH=70;
function rig(c,{g=1,hand=0,ox=0,oy=0,ticks=1,kTag=0}={}){ // c＝縮み [m]
 const bx=ox+X0-SCX*c,fy=oy+FL;
 let s=line(ox+60,fy,ox+580,fy,{color:C.dim,w:3});
 for(let q=ox+66;q<ox+580;q+=26)s+=line(q,fy+2,q-14,fy+18,{color:C.faint,w:2});
 s+=wall(ox+60,fy-120,fy);
 s+=spring(ox+60,bx,fy-BH/2,{coils:10,amp:16,color:C.dim,w:3});
 s+=rect(bx,fy-BH,BW,BH,{fill:'#2a3a58',fo:1,stroke:'#8a9ab6',sw:3,rx:6})+label('物体',bx+BW/2,fy-BH/2+8,{size:22,color:C.ink,anchor:'middle'});
 if(ticks){
  s+=arrow(ox+80,fy+32,ox+600,fy+32,{color:CX,w:3,head:14})+label('x',ox+608,fy+40,{size:26,color:CX,weight:700});
  s+=line(ox+X0,fy+22,ox+X0,fy+42,{color:CX,w:3})+label('0',ox+X0,fy+66,{size:24,color:CX,anchor:'middle'});
  if(c>.001)s+=line(bx,fy+22,bx,fy+42,{color:CX,w:3})+label(c>.039?'−0.040':'',bx,fy+66,{size:24,color:CX,anchor:'middle'});
  s+=line(ox+X0,fy-BH-12,ox+X0,fy,{color:C.faint,w:2,dash:'5 6'});
 }
 if(hand>0&&c>.001){const F=500*c,len=4.5*F;s+=arrow(bx+BW+len+8,fy-BH/2,bx+BW+6,fy-BH/2,{color:CF,w:7,head:18,g:1})+label('手の力',bx+BW+len/2+8,fy-BH-14,{size:24,color:CF,anchor:'middle',weight:700});}
 if(kTag)s+=fade(kTag,label('k ＝ 500 N/m',ox+580,oy+150,{size:26,color:C.ink,anchor:'end',weight:700}));
 return fade(g,s);
}
// 縮み−手の力のグラフ
const GF=()=>axes({x:660,y:450,w:380,h:300,xmin:0,xmax:.05,ymin:0,ymax:25,xlabel:'縮み [m]',ylabel:'手の力 [N]',xticks:[],yticks:[],xcolor:CX,ycolor:CF});
function fgraph({c=.04,g=1,tri=0,rectG=0,triLab=0}={}){
 const A=GF();let s=A.svg;
 s+=line(A.X(.04),A.Y(0)-6,A.X(.04),A.Y(0)+6,{color:CX,w:2})+label('0.040',A.X(.04),A.Y(0)+34,{size:22,color:CX,anchor:'middle'});
 s+=line(A.X(0)-6,A.Y(20),A.X(0)+6,A.Y(20),{color:CF,w:2})+label('20',A.X(0)-12,A.Y(20)+8,{size:22,color:CF,anchor:'end'});
 if(rectG)s+=fade(rectG,rect(A.X(0),A.Y(20),A.X(.04)-A.X(0),A.Y(0)-A.Y(20),{fill:'none',fo:0,stroke:NEG,sw:3,rx:0})+line(A.X(0),A.Y(20),A.X(.04),A.Y(20),{color:NEG,w:3,dash:'8 6'})
  +label('0.80 J',A.X(.02),A.Y(22)-6,{size:26,color:NEG,anchor:'middle',weight:700}));
 if(tri)s+=fade(tri,poly([[A.X(0),A.Y(0)],[A.X(.04),A.Y(0)],[A.X(.04),A.Y(20)]],{fill:CU,fo:.35})+(triLab?fade(triLab,label('0.40 J',A.X(.028),A.Y(5),{size:28,color:CU,anchor:'middle',weight:700})):''));
 if(c>0){s+=line(A.X(0),A.Y(0),A.X(c),A.Y(500*c),{color:CF,w:5})+dot(A.X(c),A.Y(500*c),7,CF);
  s+=line(A.X(c),A.Y(0),A.X(c),A.Y(500*c),{color:C.faint,w:2,dash:'5 6'});}
 return fade(g,s);
}
// 小問1 の画面（左上ばね・右グラフ）
const scene1=(c,o={})=>rig(c,{hand:o.hand??1})+fgraph({c,...o});

// ---- 小問2・3：U の谷（x −0.45〜0.45 m、U −3〜11 J）----
const GV=()=>axes({x:80,y:495,w:580,h:350,xmin:-.45,xmax:.45,ymin:-3,ymax:11,xlabel:'x [m]',ylabel:'U [J]',xticks:[],yticks:[],xcolor:CX,ycolor:CU});
const Uf=x=>50*x*x;
const SH=(()=>{const A=GV();return label('U ＝ 50x² − 2',A.X(.2),A.Y(-2),{size:26,color:CU,weight:700});})();
function valley(A,{p=1,g=1,glow=0,shift=0,shiftG=0,orig=1,x3=1,x3lab=1}={}){
 let s='';
 if(x3)s+=line(A.X(-.3),A.Y(-3),A.X(-.3),A.Y(11),{color:CX,w:2.5,dash:'7 7'})+(x3lab?label('x ＝ −0.30',A.X(-.3),A.Y(11)+4,{size:24,color:CX,anchor:'middle',weight:700}):'');
 s+=line(A.X(0)-6,A.Y(0),A.X(0)+6,A.Y(0),{color:C.dim});
 if(orig)s+=fade(orig,A.plot(Uf,{from:-.45,to:.45,p,color:CU,w:5}));
 if(glow)s+=fade(glow,A.plot(Uf,{from:-.45,to:.45,color:HI,w:10})+'');
 if(shiftG)s+=fade(shiftG,A.plot(x=>Uf(x)-2*shift,{from:-.45,to:.45,color:CU,w:4,dash:'10 8'}));
 return fade(g,s);
}
function tangent(A,x0,{f=Uf,df=x=>100*x,half=.12,g=1,color=HI,w=4}={}){
 const y0=f(x0),k=df(x0);return fade(g,line(A.X(x0-half),A.Y(y0-k*half),A.X(x0+half),A.Y(y0+k*half),{color,w})+dot(A.X(x0),A.Y(y0),7,color));
}
// 右の説明の枠
const PX=790,PW=390,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const divider=(y,g=1)=>fade(g,line(PX+30,y,PX+PW-30,y,{color:C.faint,w:2}));
const fArrow=(A,x0,{g=1,y0=null,lab='＋30 N',len=110}={})=>{const X=A.X(x0),Y=A.Y(0)+30;return fade(g,arrow(X-len-4,Y,X-4,Y,{color:CF,w:7,head:18})+label(lab,X-len/2-4,Y+36,{size:26,color:CF,anchor:'middle',weight:700}));};

export const ytQxUmPotentialSlopeDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（5 s）：0〜2 s 物体が左へ動き x＝−0.040 m で止まる・k＝500 N/m → 2〜4 s 右に U＝50x² の谷と x＝−0.30 の点線 → 4〜5 s「小問3：U＝50x²−2 と書き直す」の札。静止。
 [K+'q0']:(p)=>{
  const t=5*p,c=.04*seg(t,.2,1.8);
  let s=rig(c,{hand:0,ox:-20,oy:-40,kTag:seg(t,1.2,1.8)});
  const A=axes({x:680,y:440,w:420,h:320,xmin:-.45,xmax:.45,ymin:0,ymax:11,xlabel:'x [m]',ylabel:'U [J]',xticks:[],yticks:[],xcolor:CX,ycolor:CU,g:seg(t,2,2.4)});
  s+=A.svg+fade(seg(t,2,2.4),line(A.X(-.3),A.Y(0),A.X(-.3),A.Y(11),{color:CX,w:2.5,dash:'7 7'})+label('x ＝ −0.30',A.X(-.3),A.Y(0)+34,{size:24,color:CX,anchor:'middle',weight:700}));
  s+=A.plot(Uf,{from:-.45,to:.45,p:seg(t,2.3,3.6),color:CU,w:5});
  s+=fade(seg(t,3.3,3.9),label('U ＝ 50x²',A.X(.2),A.Y(10.5),{size:30,color:CU,weight:700}));
  s+=fade(seg(t,3.8,4.1),label('（小問2 の U）',A.X(.2),A.Y(0)+34,{size:22,color:C.dim,anchor:'middle'}));
  s+=fade(seg(t,4.1,4.7),rect(40,380,520,56,{fill:'#1a2540',fo:.95,stroke:C.dim,sw:2,rx:12})+label('小問3：U ＝ 50x² − 2 と 書き直す',300,418,{size:26,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 // 小問2（2.5 s）：U＝50x² の谷と、x＝−0.30 の点線だけ。接線・力・U の値は描かない。
 [K+'q2']:(p)=>{
  const A=axes({x:240,y:470,w:620,h:380,xmin:-.45,xmax:.45,ymin:0,ymax:11,xlabel:'x [m]',ylabel:'U [J]',xticks:[],yticks:[],xcolor:CX,ycolor:CU,g:seg(p,0,.2)});
  let s=A.svg+fade(seg(p,.1,.3),line(A.X(-.3),A.Y(0),A.X(-.3),A.Y(11),{color:CX,w:2.5,dash:'7 7'})+label('x ＝ −0.30',A.X(-.3),A.Y(0)+34,{size:24,color:CX,anchor:'middle',weight:700}));
  s+=A.plot(Uf,{from:-.45,to:.45,p:seg(p,.2,.75),color:CU,w:5});
  s+=fade(seg(p,.7,.95),label('U ＝ 50x²（x は m、U は J）',A.X(.12),A.Y(10.6),{size:28,color:CU,weight:700}));
  return s;
 },
 // 小問3（2.5 s）：前の谷は描かない。軸と x＝−0.30 の点線、「U＝50x²−2 と書き直す」の札だけ。
 [K+'q3']:(p)=>{
  const A=axes({x:240,y:470,w:620,h:380,xmin:-.45,xmax:.45,ymin:-3,ymax:11,xlabel:'x [m]',ylabel:'U [J]',xticks:[],yticks:[],xcolor:CX,ycolor:CU,g:seg(p,0,.25)});
  let s=A.svg+fade(seg(p,.15,.4),line(A.X(-.3),A.Y(-3),A.X(-.3),A.Y(11),{color:CX,w:2.5,dash:'7 7'})+label('x ＝ −0.30',A.X(-.3),A.Y(-3)+30,{size:24,color:CX,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.8),rect(760,180,400,130,{fill:'#1a2540',fo:.95,stroke:C.ink,sw:2.5,rx:12})+label('基準を 変えて',960,228,{size:26,color:C.dim,anchor:'middle'})
   +label('U ＝ 50x² − 2',960,284,{size:34,color:CU,anchor:'middle',weight:700}));
  return s;
 },

 // ===================== 小問1 =====================
 // 1. ばねの図（x＝−0.040 m まで縮めた所）。札「求めるもの」
 [K+'goal1']:(p)=>{
  let s=rig(.04*seg(p,.05,.4),{hand:0,kTag:1});
  s+=card(40,330,560,150,L('小問1',320,372,{size:24,color:C.dim})+L('0.040 m 縮めた ばねの U は？',320,428,{size:30,color:HI,weight:700}),seg(p,.1,.25),HI);
  return s+goalTag(G1,{g:seg(p,.03,.15)});
 },
 // 2. 手の力が縮みとともに 0 から伸びる。右のグラフに原点を通る直線
 [K+'hand']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,c=.04*seg(p,b,b+.4);
  let s=scene1(c,{g:1});
  s+=card(40,330,560,150,L('U ＝ 手が した 仕事',320,380,{size:30,color:CU,weight:700})+fade(seg(p,b,b+.1),L('手の力 ＝ 縮みに 比例（0 から 増える）',320,440,{size:26,color:CF,weight:700})),seg(p,.03,.12));
  return s+goalTag(G1);
 },
 // 3. 式（カット割り：図を消して式を一段ずつ）。dU＝−F dx、F＝−kx、二つの負号が打ち消す → dU＝kx dx。0 から x まで足して U＝½kx²
 [K+'derive']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55;
  let s=kindTag('定義',600,118,{text:'dU ＝ −F dx',g:seg(p,0,.06)});
  s+=fade(seg(p,.05,.12),T(`d${uU}=-${fF}\\,d${xX}`,420,190,44));
  s+=fade(seg(p,.12,.2),label('←',600,200,{size:34,color:C.dim,anchor:'middle'})+T(`${fF}=-k${xX}`,760,190,44));
  const P1=`d${uU}=${cc(NEG,'-')}(${cc(NEG,'-')}k${xX})\\,d${xX}`,w1=texWidth(P1,44,false);
  s+=fade(seg(p,.22,.3),T(P1,240,275,44,{anchor:'start'}));
  s+=fade(seg(p,.3,.38),label('二つの 負号が 打ち消す',240+w1*.45,330,{size:24,color:NEG,weight:700,anchor:'middle'}));
  s+=fade(seg(p,.38,.46),T(`=k${xX}\\,d${xX}`,240+w1+14,275,44,{anchor:'start'}));
  s+=fade(seg(p,b,b+.08),label('0 から x まで 足す →',330,458,{size:26,color:C.dim,anchor:'end'}));
  s+=fade(seg(p,b+.1,b+.2),T(`${uU}=\\displaystyle\\int_0^{${xX}}k${xX}'\\,d${xX}'=${cc(HI,'\\tfrac12')}k${xX}^2`,600,450,46));
  s+=fade(seg(p,b+.25,b+.35),label('½ が 付く',900,462,{size:26,color:HI,weight:700}));
  return s+goalTag(G1);
 },
 // 4. (−0.040)² の負号が消える。三角形（底 0.040 m、高さ 20 N）を橙で「0.40 J」。答え B
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,ve=voiceEnd(ctx);
  let s=scene1(.04,{tri:seg(p,b,b+.12),triLab:seg(p,b+.1,b+.2)});
  let f=fade(seg(p,.03,.12),T(`(${cc(NEG,'-')}0.040)^2=0.0016`,320,385,38));
  f+=fade(seg(p,.2,.3),line(196,368,214,392,{color:NEG,w:4})+label('2乗で 負号が 消える',320,435,{size:24,color:NEG,anchor:'middle',weight:700}));
  s+=card(40,330,560,175,fade(1-seg(p,b-.02,b+.04),f)
   +fade(seg(p,b,b+.08),L('三角形の 面積',320,370,{size:24,color:C.dim})+T(`${uU}=\\tfrac12\\times500\\times0.0016=${cc(CU,'0.40\\ \\mathrm{J}')}`,320,440,34)),1);
  return s+goalTag(G1)+ANS1(seg(p,ve-.08,ve-.02));
 },
 // 5. 誤答 A：長方形 0.80 J を点線で重ね、その半分が三角形
 [K+'wrongA']:(p)=>{
  let s=scene1(.04,{tri:1,triLab:1,rectG:seg(p,.05,.15)});
  s+=wrongCard('A','0.80 J','長方形に した（½ を 落とした）',{x:40,w:560,y:340,size:26,whySize:22,g:seg(p,.03,.08)});
  s+=fade(seg(p,.45,.55),L('はじめから 20 N で 押した ことに なる',320,480,{size:24,color:NEG,weight:700}));
  return s+goalTag(G1)+ANS1(1);
 },
 // 6. 誤答 C → D（一枚ずつ）
 [K+'wrongCD']:(p,ctx)=>{
  let s=scene1(.04,{tri:1,triLab:1});
  s+=wrongSeq(p,ctx,[['C','−0.40 J','U は x² で 決まり、負に ならない'],['D','20 J','力 kx ＝ 20 N と 取り違えた']],{opts:{x:40,w:560,y:340,size:26,whySize:22}});
  return s+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 // 7. 谷のグラフを大きく
 [K+'goal2']:(p)=>{
  const A=GV();let s=A.svg+valley(A,{p:seg(p,.05,.35)});
  s+=fade(seg(p,.3,.45),label('U ＝ 50x²',A.X(.22),A.Y(10.2),{size:30,color:CU,weight:700}));
  s+=panel(90,210,L('小問2',PC,135,{size:24,color:C.dim})+L('x ＝ −0.30 m での',PC,190,{size:28,color:CX,weight:700})+L('力の 値と 向きは？',PC,240,{size:30,color:HI,weight:700}),seg(p,.05,.2),HI);
  return s+goalTag(G2,{g:seg(p,.03,.15)});
 },
 // 8. F＝−dU/dx を一手ずつ。「傾き」で谷の線を光らせる
 [K+'slope']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,A=GV();
  let s=A.svg+valley(A,{glow:seg(p,b+.1,b+.2)*(1-seg(p,.92,1))*.5});
  s+=label('U ＝ 50x²',A.X(.22),A.Y(10.2),{size:30,color:CU,weight:700});
  s+=panel(90,330,T(`d${uU}=-${fF}\\,d${xX}`,PC,145,40)
   +fade(seg(p,.12,.22),label('両辺を dx で 割る',PC,200,{size:24,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.22,.32),T(`${fF}=-\\dfrac{d${uU}}{d${xX}}`,PC,270,44))
   +fade(seg(p,b,b+.1),divider(325)+L('力 ＝ −（U の 傾き）',PC,375,{size:28,color:HI,weight:700})),1);
  return s+goalTag(G2);
 },
 // 9. 接線（右下がり）「傾き −30 J/m」。その下に右向きの力 ＋30 N。答え D
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,ve=voiceEnd(ctx),A=GV();
  let s=A.svg+valley(A)+label('U ＝ 50x²',A.X(.22),A.Y(10.2),{size:30,color:CU,weight:700});
  s+=tangent(A,-.3,{g:seg(p,.25,.35)})+fade(seg(p,.3,.4),label('傾き −30 J/m',A.X(-.3)+24,A.Y(4.5)-34,{size:26,color:HI,weight:700}));
  s+=fArrow(A,-.3,{g:seg(p,b+.05,b+.15)});
  s+=panel(90,330,T(`${fF}=-\\dfrac{d${uU}}{d${xX}}`,PC,150,36)
   +fade(seg(p,.05,.15),T(`\\dfrac{d${uU}}{d${xX}}=100${xX}`,PC,235,36))
   +fade(seg(p,.2,.3),T(`100\\times(-0.30)=${cc(HI,'-30\\ \\mathrm{J/m}')}`,PC,305,30))
   +fade(seg(p,b,b+.1),divider(340)+T(`${fF}=-(-30)=${cc(CF,'+30\\ \\mathrm{N}')}`,PC,385,32)),1);
  return s+goalTag(G2)+ANS2(seg(p,ve-.08,ve-.02));
 },
 // 10. 谷の両側の点で、力の矢印が谷底を向く
 [K+'downhill']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,A=GV();
  let s=A.svg+valley(A)+label('U ＝ 50x²',A.X(.22),A.Y(10.2),{size:30,color:CU,weight:700});
  s+=tangent(A,-.3,{g:.5});
  [[-.36,.05],[-.2,.15],[.2,.25],[.36,.35]].forEach(([x,a])=>{
   const X=A.X(x),Y=A.Y(Uf(x))-30,len=-x*100*3;
   s+=fade(seg(p,a,a+.1),dot(A.X(x),A.Y(Uf(x)),7,C.ink)+arrow(X,Y,X+len,Y,{color:CF,w:6,head:16}));
  });
  s+=fade(seg(p,.4,.5),label('谷底',A.X(0),A.Y(0)+34,{size:24,color:C.dim,anchor:'middle'}));
  s+=panel(90,250,L('谷の 左側（x＜0）',PC,140,{size:26,color:CX,weight:700})+L('→ 力は 右向き（谷底へ）',PC,190,{size:26,color:CF,weight:700})
   +fade(seg(p,b,b+.1),divider(222)+L('力は U の 坂を',PC,268,{size:28,color:HI,weight:700})+L('下る 向き',PC,310,{size:28,color:HI,weight:700})),1);
  return s+goalTag(G2)+ANS2(1);
 },
 // 11. 誤答 A。負号の横に「U が減る向き」
 [K+'wrongA2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,A=GV();
  let s=A.svg+valley(A)+label('U ＝ 50x²',A.X(.22),A.Y(10.2),{size:30,color:CU,weight:700});
  s+=tangent(A,-.3)+fArrow(A,-.3);
  const e=`${fF}=-\\dfrac{d${uU}}{d${xX}}`,w=texWidth(e,40,false);
  s+=panel(90,190,T(e,PC,160,40)+fade(seg(p,b,b+.1),highlight(PC-w/2+texWidth(`${fF}=`,40,false)-4,118,30,80,1,HI)
   +L('− は「U が 減る 向き」',PC,245,{size:26,color:HI,weight:700})),1);
  s+=wrongCard('A','−30 N','x が 負なので 傾きも 負、力は 正',{...WOPT,y:300,g:seg(p,.03,.08)});
  return s+goalTag(G2)+ANS2(1);
 },
 // 12. x＝−0.30 での谷の高さ 4.5 J に印。誤答 B → C
 [K+'wrongBC']:(p,ctx)=>{
  const A=GV();
  let s=A.svg+valley(A)+label('U ＝ 50x²',A.X(.22),A.Y(10.2),{size:30,color:CU,weight:700});
  s+=fade(seg(p,.03,.12),line(A.X(0),A.Y(4.5),A.X(-.3),A.Y(4.5),{color:CU,w:2.5,dash:'6 6'})+dot(A.X(-.3),A.Y(4.5),9,CU)+label('4.5 J',A.X(0)+12,A.Y(4.5)+8,{size:26,color:CU,weight:700}));
  s+=panel(90,190,L('U の 値（J）',PC,140,{size:24,color:C.dim})+L('4.5 J',PC,190,{size:32,color:CU,weight:700})+L('傾き −30 J/m とは 別もの',PC,240,{size:24,color:C.ink}),1);
  s+=wrongSeq(p,ctx,[['B','＋4.5 N','U の 値を 力に した（単位も J）'],['C','−4.5 N','U の 値に 負号を 付けた']],{opts:{...WOPT,y:300}});
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 // 13. 元の谷と札「U＝50x²−2」
 [K+'goal3']:(p)=>{
  const A=GV();let s=A.svg+valley(A)+label('U ＝ 50x²',A.X(.22),A.Y(10.2),{size:30,color:CU,weight:700});
  s+=panel(90,230,L('小問3',PC,135,{size:24,color:C.dim})+L('基準を 変えて',PC,185,{size:26,color:C.ink})+L('U ＝ 50x² − 2',PC,240,{size:34,color:CU,weight:700})
   +L('x ＝ −0.30 の 力と U は？',PC,292,{size:26,color:HI,weight:700}),seg(p,.05,.2),HI);
  return s+goalTag(G3,{g:seg(p,.03,.15)});
 },
 // 14a. 2 J 下へずらした谷（橙の点線）を重ねる
 [K+'shift']:(p)=>{
  const A=GV(),sh=seg(p,.15,.6);
  let s=A.svg+valley(A,{shift:sh,shiftG:seg(p,.1,.2)})+label('U ＝ 50x²',A.X(.22),A.Y(10.2),{size:30,color:CU,weight:700});
  s+=fade(seg(p,.55,.7),arrow(A.X(.05),A.Y(Uf(.05)),A.X(.05),A.Y(Uf(.05)-2),{color:HI,w:5,head:14})+label('2 J',A.X(.05)+10,A.Y(-.75),{size:26,color:HI,weight:700})
   +SH);
  s+=panel(90,230,L('定数 −2 を 足す',PC,145,{size:28,color:CU,weight:700})+L('→ 谷 全体が 2 J 下へ',PC,200,{size:28,color:HI,weight:700}),1);
  return s+goalTag(G3);
 },
 // 14b. x＝−0.30 で 4.5 J と 2.5 J
 [K+'shift2']:(p)=>{
  const A=GV();
  let s=A.svg+valley(A,{shift:1,shiftG:1})+label('U ＝ 50x²',A.X(.22),A.Y(10.2),{size:30,color:CU,weight:700})+SH;
  s+=fade(seg(p,.1,.25),dot(A.X(-.3),A.Y(4.5),8,CU)+label('4.5 J',A.X(-.3)+14,A.Y(4.5)-8,{size:26,color:CU,weight:700}));
  s+=fade(seg(p,.3,.45),dot(A.X(-.3),A.Y(2.5),8,CU)+label('2.5 J',A.X(-.3)-14,A.Y(2.5)+8,{size:26,color:CU,anchor:'end',weight:700})
   +arrow(A.X(-.3)+18,A.Y(4.5),A.X(-.3)+18,A.Y(2.5),{color:HI,w:4,head:12}));
  s+=panel(90,230,L('定数 −2 を 足す',PC,145,{size:28,color:CU,weight:700})+L('→ 谷 全体が 2 J 下へ',PC,200,{size:28,color:HI,weight:700})
   +fade(seg(p,.4,.55),divider(232)+T(`4.5-2=${cc(CU,'2.5\\ \\mathrm{J}')}`,PC,280,36)),1);
  return s+goalTag(G3);
 },
 // 15. 2本の接線が平行。力は同じ ＋30 N。答え A
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),ve=voiceEnd(ctx),A=GV();
  let s=A.svg+valley(A,{shift:1,shiftG:1})+label('U ＝ 50x²',A.X(.22),A.Y(10.2),{size:30,color:CU,weight:700})+SH;
  s+=label('4.5 J',A.X(-.3)+14,A.Y(4.5)-8,{size:26,color:CU,weight:700})+label('2.5 J',A.X(-.3)-14,A.Y(2.5)+8,{size:26,color:CU,anchor:'end',weight:700});
  s+=tangent(A,-.3,{g:seg(p,.1,.2)})+tangent(A,-.3,{f:x=>Uf(x)-2,g:seg(p,.2,.3)});
  s+=fade(seg(p,.25,.35),label('平行',A.X(-.3)+40,A.Y(3.2),{size:26,color:HI,weight:700}));
  s+=fArrow(A,-.3,{g:seg(p,.4,.5),y0:A.Y(2.5)});
  s+=panel(90,250,L('定数の 微分 ＝ 0',PC,140,{size:28,color:C.ink,weight:700})
   +fade(seg(p,.15,.25),L('傾き −30 J/m（同じ）',PC,195,{size:26,color:HI,weight:700}))
   +fade(seg(p,.4,.5),L('力 ＋30 N（同じ）',PC,245,{size:26,color:CF,weight:700})),1);
  return s+goalTag(G3)+ANS3(seg(p,ve-.08,ve-.02));
 },
 // 16. 誤答 B → C → D（一枚ずつ）
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),m=W[0][1]*.5,A=GV();
  let s=A.svg+valley(A,{shift:1,shiftG:1})+label('U ＝ 50x²',A.X(.22),A.Y(10.2),{size:30,color:CU,weight:700})+SH;
  s+=tangent(A,-.3)+tangent(A,-.3,{f:x=>Uf(x)-2})+fArrow(A,-.3,{y0:A.Y(2.5)});
  s+=panel(90,190,L('正しい 組',PC,140,{size:24,color:C.dim})+L('力 ＋30 N、U ＝ 2.5 J',PC,195,{size:28,color:HI,weight:700}),1);
  s+=wrongSeq(p,ctx,[['B','＋28 N','定数を 力にも 入れた'],['C','4.5 J','U の 値は 基準で 変わる'],['D','−30 N','基準を 変えても 向きは 同じ']],{win:[[0,m],[m,W[0][1]],[W[1]?W[1][0]:.6,1]],opts:{...WOPT,y:300}});
  return s+goalTag(G3)+ANS3(1);
 },
 // 17. 2点（x＝−0.30 と 0）の U の差が、2本の谷で同じ 4.5 J
 [K+'diff']:(p)=>{
  const A=GV();
  let s=A.svg+valley(A,{shift:1,shiftG:1})+label('U ＝ 50x²',A.X(.22),A.Y(10.2),{size:30,color:CU,weight:700})+SH;
  const g1=seg(p,.1,.25),g2=seg(p,.3,.45);
  s+=fade(g1,line(A.X(-.3),A.Y(4.5),A.X(.08),A.Y(4.5),{color:C.dim,w:2,dash:'5 6'})+dot(A.X(-.3),A.Y(4.5),7,CU)+dot(A.X(0),A.Y(0),7,CU)
   +arrow(A.X(.06),A.Y(0),A.X(.06),A.Y(4.5),{color:HI,w:4,head:12})+arrow(A.X(.06),A.Y(4.5),A.X(.06),A.Y(0),{color:HI,w:4,head:12}));
  s+=fade(g2,line(A.X(-.3),A.Y(2.5),A.X(-.1),A.Y(2.5),{color:C.dim,w:2,dash:'5 6'})+line(A.X(-.1),A.Y(-2),A.X(0),A.Y(-2),{color:C.dim,w:2,dash:'5 6'})+dot(A.X(-.3),A.Y(2.5),7,CU)+dot(A.X(0),A.Y(-2),7,CU)
   +arrow(A.X(-.1),A.Y(-2),A.X(-.1),A.Y(2.5),{color:HI,w:4,head:12})+arrow(A.X(-.1),A.Y(2.5),A.X(-.1),A.Y(-2),{color:HI,w:4,head:12}));
  s+=panel(90,330,L('基準で 変わる：U の 値',PC,140,{size:26,color:CU,weight:700})
   +fade(seg(p,.1,.2),divider(165)+L('元の 谷',PC,200,{size:24,color:C.dim})+T('4.5-0=4.5\\ \\mathrm{J}',PC,240,30))
   +fade(seg(p,.3,.4),L('ずらした 谷',PC,285,{size:24,color:C.dim})+T('2.5-(-2)=4.5\\ \\mathrm{J}',PC,325,30))
   +fade(seg(p,.5,.6),divider(350)+L('変わらない：力 と U の 差',PC,395,{size:26,color:HI,weight:700})),1);
  return s+goalTag(G3)+ANS3(1);
 },

 // ===================== まとめ =====================
 // 18. dU＝−F dx と F＝−dU/dx を往復する矢印。答えの札3枚
 [K+'sum']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=card(80,130,420,170,L('力 → U を 作る',290,168,{size:26,color:C.dim})+T(`d${uU}=-${fF}\\,d${xX}`,290,258,44),seg(p,.03,.12));
  s+=card(700,130,420,170,L('U → 力を 取り戻す',910,168,{size:26,color:C.dim})+T(`${fF}=-\\dfrac{d${uU}}{d${xX}}`,910,262,44),seg(p,.15,.25));
  s+=fade(seg(p,.25,.35),arrow(510,195,690,195,{color:HI,w:5,head:16})+arrow(690,240,510,240,{color:HI,w:5,head:16}));
  s+=fade(seg(p,b,b+.1),L('力は U の 坂を 下る 向き',600,385,{size:32,color:CF,weight:700}));
  return s+answerRow([[1,'B','0.40 J'],[2,'D','＋30 N'],[3,'A','＋30 N、2.5 J']],{g:seg(p,.6,.72),size:22});
 },
};

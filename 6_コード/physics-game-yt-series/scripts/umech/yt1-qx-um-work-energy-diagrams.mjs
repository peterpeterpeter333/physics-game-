// 問題編 解説「押す力と摩擦の下で、3 m 先の速さ」（q-um-work-energy、大学編 12 仕事・中級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/12_仕事.md の q-um-work-energy（解説 19 行）。
// 配置：上に道筋の図（F＝ma → 3つの箱 → 速さ ↔ 位置）、下に台車。式の場面は道筋の図を消すか、上に残して下に式。誤答カードは下。
// 色：力 F 緑、距離 x 水色、速度 v 紫、仕事・エネルギー 橙、強調 黄、誤り 赤。
// 尺度（図のために決めた値）：力 1 N＝15 px、距離 1 m＝100 px、速度 1 m/s＝45 px。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,ground,cart,poly,axes,tex,texWidth} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,pauseBadge,note,cueT,sentWin} from './yt1-qx-common.mjs';

const K='qx-um-work-energy:';
const CF=C.F,CX=C.x,CE=C.E,CV=C.v,CN='#ff6b6b';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const cv=s=>`{\\color{${CV}}${s}}`,cx=s=>`{\\color{${CX}}${s}}`,cf=s=>`{\\color{${CF}}${s}}`,ce=s=>`{\\color{${CE}}${s}}`;
const G1='3 m 先の速さ v',G2='a を x と v で',G3='dt＝dx/v の条件';
const ANS1=g=>answerTag(1,'B','4.0 m/s',{g}),ANS2=g=>answerTag(2,'C','',{g}),ANS3=g=>answerTag(3,'B','',{g});
const WOPT={x:150,w:900,y:400,size:26,whySize:22};

// ---- 道筋の図 ----
const RY=95,RH=90;
const BOXES=[[240,180],[460,180],[680,180]];
const STEPS=[`dt=\\dfrac{dx}{${cv('v')}}`,`a=${cv('v')}\\dfrac{d${cv('v')}}{dx}`,`${ce('W')}=\\Delta ${ce('K')}`];
function roadmap({g=1,fill=[0,0,0],hiStart=0,hiBox=-1,goalW=0,goalSolid=0}={}){
 let s=line(200,RY+RH/2,900,RY+RH/2,{color:C.faint,w:4,dash:'10 10'});
 s+=card(30,RY,170,RH,T('F=ma',115,RY+52,34),1,CF);
 if(hiStart)s+=highlight(22,RY-8,186,RH+16,hiStart,C.hi);
 BOXES.forEach(([x,w],i)=>{
  s+=rect(x,RY,w,RH,{fill:'#131f38',fo:.96,stroke:fill[i]>.5?C.ink:C.faint,sw:2,rx:12});
  s+=fill[i]>0?fade(fill[i],T(STEPS[i],x+w/2,RY+56,30)):label('？',x+w/2,RY+58,{size:32,color:C.faint,anchor:'middle',weight:700});
  if(hiBox===i)s+=highlight(x-8,RY-8,w+16,RH+16,1,C.hi);
 });
 s+=card(900,RY,270,RH,label('速さ ↔ 位置',1035,RY+(goalW?36:56),{size:28,color:C.hi,anchor:'middle',weight:700})
  +fade(goalW,T(`${ce('W')}=\\Delta ${ce('K')}`,1035,RY+76,28,{opacity:goalSolid?1:.75}))
  +(goalW&&!goalSolid?fade(goalW,label('（仮）',1150,RY+80,{size:22,color:C.dim,anchor:'end'})):''),1,C.hi);
 return fade(g,s);
}

// ---- 台車 ----
const FY=400,FS=15,MP=100,VS=45;
function cartScene({x=230,g=1,vel=1,vtxt='2 m/s',vlen=2,push=1,fric=1,dist=1,plus=1,hiPush=0,hiFric=0,fricShift=0,net=0,dimF=0,gTo=1180}={}){
 let s=ground(30,gTo,FY)+cart(x,FY,{w:140,h:60,color:CX});
 s+=label('4 kg',x,FY-38,{size:24,color:C.ink,anchor:'middle',weight:700});
 if(vel)s+=fade(vel,arrow(x,290,x+vlen*VS,290,{color:CV,w:6,head:18})+label(vtxt,x+vlen*VS+12,298,{size:26,color:CV,weight:700}));
 const fx=x+70,fy=355;
 if(push)s+=fade(1-dimF*.5,arrow(fx,fy,fx+10*FS,fy,{color:CF,w:7,head:20,g:push})+fade(push,label('押す力 10 N',fx+5*FS,fy-16,{size:24,color:CF,anchor:'middle',weight:700})));
 if(hiPush)s+=fade(hiPush,highlight(fx-6,fy-48,10*FS+16,64,1,C.hi));
 if(fric){
  const x0=mix(x-70,fx+10*FS,fricShift),y0=mix(FY-6,fy,fricShift);
  s+=fade(1-dimF*.5,arrow(x0,y0,x0-2*FS,y0,{color:CF,w:6,head:14,g:fric}));
  s+=fade(fric*(1-fricShift),label('摩擦 2 N',x0-2*FS-8,y0-10,{size:24,color:CF,anchor:'end',weight:700}));
  if(hiFric)s+=fade(hiFric,highlight(x0-2*FS-120,y0-38,2*FS+132,52,1,C.hi));
 }
 if(net){s+=fade(net,line(fx,fy,fx+8*FS,fy,{color:C.hi,w:12,cap:'butt'})+label('合力 8 N',fx+4*FS,fy+32,{size:24,color:C.hi,anchor:'middle',weight:700}));}
 if(dist){const y=FY+30,x1=x+70;
  s+=fade(dist,line(x1,y-12,x1,y+12,{color:CX,w:2})+line(x1+3*MP,y-12,x1+3*MP,y+12,{color:CX,w:2})+arrow(x1,y,x1+3*MP,y,{color:CX,w:4,head:14})+label('3 m',x1+1.5*MP,y+34,{size:26,color:CX,anchor:'middle',weight:700}));}
 if(plus)s+=fade(plus,arrow(700,290,780,290,{color:C.dim,w:3,head:14})+label('＋（右向きが正）',790,298,{size:24,color:C.dim}));
 return fade(g,s);
}

// ---- F–x グラフ ----
function fxGraph({x=700,y=470,w=360,h=260,g=1}={}){
 const A=axes({x,y,w,h,xmin:0,xmax:4,ymin:0,ymax:10,xlabel:'x [m]',ylabel:'F [N]',g,xcolor:CX,ycolor:CF});
 let s=A.svg+fade(g,line(A.X(0)-6,A.Y(8),A.X(0)+6,A.Y(8),{color:C.dim})+label('8',A.X(0)-12,A.Y(8)+8,{size:22,color:C.dim,anchor:'end'})
  +line(A.X(3),A.Y(0)-6,A.X(3),A.Y(0)+6,{color:C.dim})+label('3',A.X(3),A.Y(0)+30,{size:22,color:C.dim,anchor:'middle'}));
 return {A,svg:s};
}
const fxRect=(A,g=1,lab='24 J')=>g<=.001?'':rect(A.X(0),A.Y(8),(A.X(3)-A.X(0))*clamp(g),A.Y(0)-A.Y(8),{fill:CE,fo:.35,stroke:CE,sw:2.5,rx:2})+fade(seg(g,.8,1),label(lab,(A.X(0)+A.X(3))/2,A.Y(4)+11,{size:30,color:CE,anchor:'middle',weight:700}));

// ---- 運動エネルギーの棒と、右の台車 ----
const KB=7,KBASE=470;
function kBar(E,{hi8=0,lab=''}={}){
 let s=line(70,KBASE,210,KBASE,{color:C.dim,w:2})+rect(100,KBASE-E*KB,80,E*KB,{fill:CE,fo:.55,stroke:CE,sw:2});
 s+=label('K',140,KBASE+32,{size:28,color:CE,anchor:'middle',weight:700});
 s+=line(92,KBASE-8*KB,188,KBASE-8*KB,{color:C.ink,w:2,dash:'5 5'})+label('8 J',86,KBASE-8*KB+8,{size:22,color:C.ink,anchor:'end'});
 if(lab)s+=label(lab,140,KBASE-E*KB-14,{size:28,color:CE,anchor:'middle',weight:700});
 if(hi8)s+=fade(hi8,rect(100,KBASE-8*KB,80,8*KB,{fill:C.hi,fo:.55,stroke:C.hi,sw:3})+highlight(88,KBASE-8*KB-12,104,8*KB+24,1,C.hi));
 return s;
}
function miniCart(vlen=2,vtxt='2 m/s',g=1){
 return fade(g,ground(850,1180,380)+cart(950,380,{w:110,h:50,color:CX})+arrow(950,300,950+vlen*VS,300,{color:CV,w:6,head:18})+label(vtxt,950+vlen*VS/2,280,{size:26,color:CV,anchor:'middle',weight:700}));
}
// ---- v–mv グラフ ----
function vmv({x,y=360,w=380,h=220,g=1}={}){
 const A=axes({x,y,w,h,xmin:0,xmax:5,ymin:0,ymax:20,xlabel:'v',ylabel:'mv',g,xcolor:CV,ycolor:CV});
 let s=A.svg+fade(g,A.plot(u=>4*u,{from:0,to:5,color:C.dim,w:2.5,dash:'8 7'}));
 for(const u of [2,4])s+=fade(g,line(A.X(u),A.Y(0)-6,A.X(u),A.Y(0)+6,{color:C.dim})+label(String(u),A.X(u),A.Y(0)+30,{size:22,color:C.dim,anchor:'middle'}));
 return {A,svg:s};
}
const trap=(A,a,b,g=1,col=CE)=>fade(g,poly([[A.X(a),A.Y(0)],[A.X(a),A.Y(4*a)],[A.X(b),A.Y(4*b)],[A.X(b),A.Y(0)]],{fill:col,fo:.45,stroke:col,sw:2.5}));

export const ytQxUmWorkEnergyDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（6 秒）：0〜2 s 台車が 2 m/s で右へ動き、映像を一時停止。2〜4 s 押す力 10 N・摩擦 2 N・3 m。4〜6 s 道筋の図（間は空欄）。静止。
 [K+'q0']:(p)=>{
  const u=seg(p,0,.33),x=mix(-80,230,clamp(p/.33));
  let s=cartScene({x,push:seg(p,.36,.46),fric:seg(p,.48,.58),dist:seg(p,.56,.66),plus:1});
  s+=pauseBadge({g:seg(p,.33,.38),x:600,y:200});
  s+=roadmap({g:seg(p,.7,.9)});
  return s;
 },

 // ===================== 小問1 =====================
 [K+'goal1']:(p)=>roadmap({})+cartScene({})+goalTag(G1,{g:seg(p,.02,.12)}),
 // 2. W＝ΔK を道筋の右端に仮に置く。「合力」で二つの力を光らせる
 [K+'wk']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,hl=seg(p,b+.1,b+.2);
  let s=roadmap({goalW:seg(p,.3,.45)})+cartScene({hiPush:hl,hiFric:hl});
  s+=fade(seg(p,b,b+.08),card(780,330,380,70,label('W は 合力の 仕事',970,375,{size:28,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
  return s+goalTag(G1);
 },
 // 3. 摩擦の矢印を押す力の先へ継ぎ足し、残り 8 N。F–x グラフに 8×3 の長方形 24 J（カット）
 [K+'net']:(p)=>{
  const sh=seg(p,.05,.3),nt=seg(p,.3,.4);
  let s=cartScene({x:200,vel:0,plus:0,fricShift:sh,net:nt,dimF:nt,gTo:640});
  s+=fade(seg(p,.2,.35),T('10+(-2)=8\\ \\mathrm{N}',300,170,42,{color:CF}));
  const {A,svg}=fxGraph({g:seg(p,.4,.5)});
  s+=svg+fxRect(A,seg(p,.5,.75));
  s+=fade(seg(p,.7,.82),T(`8\\times3=${ce('24\\ \\mathrm{J}')}`,940,140,40));
  return s+goalTag(G1);
 },
 // 4. 始めの K＝8 J、終わり 8＋24＝32 J（カット：棒と式）
 [K+'kbar']:(p)=>{
  const E=mix(8,32,seg(p,.5,.8));
  let s=kBar(E,{lab:p>.8?'32 J':''});
  s+=card(260,100,560,280,label('始め',320,180,{size:24,color:C.dim})+fade(seg(p,.05,.2),T('\\tfrac{1}{2}\\times4\\times2^2=8\\ \\mathrm{J}',580,170,40))
   +label('終わり',320,300,{size:24,color:C.dim})+fade(seg(p,.45,.6),T(`8+24=${ce('32\\ \\mathrm{J}')}`,580,290,40)),1);
  s+=miniCart(2,'2 m/s');
  return s+goalTag(G1);
 },
 // 5. ½×4×v²＝32 → v²＝16 → v＝4.0 m/s。速度の矢印 2 → 4。小問1 の答え B
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.7,gv=seg(p,b-.12,b-.02);
  let s=kBar(32,{lab:'32 J'});
  s+=card(260,100,560,280,fade(seg(p,.02,.12),T(`\\tfrac{1}{2}\\times4\\times${cv('v')}^2=32`,540,165,40))
   +fade(seg(p,.25,.35),T(`${cv('v')}^2=16`,540,245,40))+fade(seg(p,.45,.55),T(cv('v=4.0\\ \\mathrm{m/s}'),540,330,44)),1);
  s+=miniCart(mix(2,4,gv),gv>.5?'4.0 m/s':'2 m/s');
  return s+goalTag(G1)+ANS1(seg(p,b,b+.06));
 },
 // 6. 押す力 ＋30 J、摩擦 −6 J。誤答 A
 [K+'wrongA']:(p,ctx)=>{
  let s=kBar(32,{lab:'32 J'});
  s+=card(260,100,560,280,label('押す力',330,185,{size:28,color:CF,weight:700})+T(ce('+30\\ \\mathrm{J}'),640,175,42)
   +fade(seg(p,.25,.4),label('摩擦',330,295,{size:28,color:CF,weight:700})+T(`{\\color{${CN}}-6\\ \\mathrm{J}}`,640,285,42)),seg(p,0,.1));
  s+=miniCart(4,'4.0 m/s');
  s+=wrongCard('A','約 4.4 m/s','押す力の 30 J だけを使った',{...WOPT,x:260,w:900,g:seg(p,.45,.52)});
  return s+goalTag(G1)+ANS1(1);
 },
 // 7. 棒の下の 8 J を黄で光らせる。誤答 C
 [K+'wrongC']:(p)=>{
  let s=kBar(32,{lab:'32 J',hi8:seg(p,.1,.25)});
  s+=card(260,100,560,280,label('始め',320,180,{size:24,color:C.dim})+T('\\tfrac{1}{2}\\times4\\times2^2=8\\ \\mathrm{J}',580,170,40)
   +label('終わり',320,300,{size:24,color:C.dim})+T(`8+24=${ce('32\\ \\mathrm{J}')}`,580,290,40),1);
  s+=fade(seg(p,.1,.25),highlight(270,115,540,100,1,C.hi));
  s+=miniCart(4,'4.0 m/s');
  s+=wrongCard('C','約 3.5 m/s','始めの K＝8 J を入れていない',{...WOPT,x:260,w:900,g:seg(p,.03,.1)});
  return s+goalTag(G1)+ANS1(1);
 },
 // 8. v–mv グラフ：0 から始まる三角形と、2→4 の台形。面積はどちらも 24、幅が違う。誤答 D（カット）
 [K+'wrongD']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,dv=Math.sqrt(12);
  const L=vmv({x:100}),R=vmv({x:680});
  let s=L.svg+R.svg;
  s+=fade(seg(p,.05,.2),poly([[L.A.X(0),L.A.Y(0)],[L.A.X(dv),L.A.Y(0)],[L.A.X(dv),L.A.Y(4*dv)]],{fill:C.dim,fo:.4,stroke:C.dim,sw:2.5})
   +label('面積 24',L.A.X(2.6),L.A.Y(3)+8,{size:24,color:C.ink,anchor:'middle',weight:700})+label('0 から',L.A.X(.2),L.A.Y(19.6),{size:24,color:C.dim,weight:700}));
  s+=trap(R.A,2,4,seg(p,b,b+.1))+fade(seg(p,b,b+.1),label('面積 24',R.A.X(3),R.A.Y(4)+8,{size:24,color:C.ink,anchor:'middle',weight:700})+label('2 m/s から',R.A.X(.2),R.A.Y(19.6),{size:24,color:CE,weight:700}));
  const gw=seg(p,b+.15,b+.25);
  s+=fade(gw,line(L.A.X(0),L.A.Y(15.2),L.A.X(dv),L.A.Y(15.2),{color:C.hi,w:4})+label('幅 約 3.5',L.A.X(dv)+10,L.A.Y(15.2)+8,{size:24,color:C.hi,weight:700})
   +line(R.A.X(2),R.A.Y(16.8),R.A.X(4),R.A.Y(16.8),{color:C.hi,w:4})+label('幅 2',R.A.X(4)+10,R.A.Y(16.8)+8,{size:24,color:C.hi,weight:700}));
  s+=wrongCard('D','約 5.5 m/s','½m(Δv)²＝24 として 2 に足した',{...WOPT,g:seg(p,.02,.08)});
  return s+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 [K+'goal2']:(p)=>{
  let s=roadmap({hiStart:seg(p,.3,.45)});
  s+=card(250,230,700,170,label('時刻 t を 消して',600,290,{size:30,color:C.dim,anchor:'middle',weight:700})
   +label('a を 位置 x と 速さ v で 書く',600,350,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s+goalTag(G2,{g:seg(p,.02,.12)});
 },
 // 10a. v＝dx/dt → dt＝dx/v。1つ目の箱に入る
 [K+'sub']:(p)=>{
  let s=roadmap({fill:[seg(p,.75,.9),0,0],hiBox:p>.75?0:-1});
  s+=label('速度の 定義',230,300,{size:28,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.03,.15),T(`${cv('v')}=\\dfrac{dx}{dt}`,480,300,52));
  s+=fade(seg(p,.4,.55),T('\\Rightarrow',660,300,48)+T(`dt=\\dfrac{dx}{${cv('v')}}`,850,300,52));
  return s+goalTag(G2);
 },
 // 10b. a＝dv/dt の dt に dx/v を入れる → dv÷(dx/v)
 [K+'sub2']:(p)=>{
  let s=roadmap({fill:[1,0,0]});
  s+=T(`dt=\\dfrac{dx}{${cv('v')}}`,850,260,40,{opacity:.8});
  const cr=seg(p,.4,.6);
  s+=fade(seg(p,.03,.12)*(1-cr),T(`a=\\dfrac{d${cv('v')}}{{\\color{${C.hi}}dt}}`,420,400,52));
  s+=fade(cr,T(`a=\\dfrac{d${cv('v')}}{{\\color{${C.hi}}dx/${cv('v')}}}`,420,400,52));
  s+=fade(seg(p,.25,.4)*(1-seg(p,.6,.7)),arrow(790,300,520,390,{color:C.hi,w:4,head:14}));
  s+=fade(seg(p,.65,.8),T(`=d${cv('v')}\\div\\left(\\dfrac{dx}{${cv('v')}}\\right)`,800,400,44));
  return s+goalTag(G2);
 },
 // 11. 逆数を掛ける → a＝v dv/dx。2つ目の箱に入る。小問2 の答え C
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=roadmap({fill:[1,seg(p,b-.12,b-.02),0],hiBox:p>b-.12&&p<b+.2?1:-1});
  s+=label('分数で 割る ＝ 逆数を 掛ける',600,250,{size:28,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.03,.12),T(`d${cv('v')}\\div\\dfrac{dx}{${cv('v')}}`,300,360,46));
  s+=fade(seg(p,.2,.32),T(`=d${cv('v')}\\times\\dfrac{${cv('v')}}{dx}`,590,360,46));
  s+=fade(seg(p,.4,.52),T(`=${cv('v')}\\,\\dfrac{d${cv('v')}}{dx}`,880,360,50)+highlight(790,300,190,120,1,C.hi));
  return s+goalTag(G2)+ANS2(seg(p,b,b+.06));
 },
 // 12. 単位：1/s × m/s ＝ m/s²
 [K+'units']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=roadmap({fill:[1,1,0]});
  s+=T(`a=${cv('v')}\\,\\dfrac{d${cv('v')}}{dx}`,600,270,48);
  s+=fade(seg(p,.03,.15),label('dv/dx：1 m あたりの 速度の 変化',330,380,{size:26,color:C.ink,anchor:'middle',weight:700})+label('1/s',330,425,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,b,b+.1),label('v：1秒に 進む 距離',870,380,{size:26,color:CV,anchor:'middle',weight:700})+label('m/s',870,425,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,b+.25,b+.35),card(330,450,540,56,label('1/s × m/s ＝ m/s²（加速度）',600,488,{size:28,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
  return s+goalTag(G2)+ANS2(1);
 },
 // 13. 誤答 A・B・D を一枚ずつ
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),e=W[0][1],w1=e*.27,w2=e*.66;
  let s=roadmap({fill:[1,1,0]});
  s+=T(`a=${cv('v')}\\,\\dfrac{d${cv('v')}}{dx}`,600,270,44)+label('m/s²',760,282,{size:28,color:C.hi,weight:700});
  s+=wrongSeq(p,ctx,[['A','dv/dx','1 m あたりの変化のまま（1/s）'],['B','(1/v) dv/dx','v を掛けずに割った（1/m）'],['D','x dv/dx','v ではなく x を掛けた（m/s）']],{win:[[0,w1],[w1,w2],[w2,1]],opts:{...WOPT,y:360}});
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 [K+'goal3']:(p)=>{
  let s=roadmap({fill:[1,1,0],hiBox:0});
  s+=T(`dt=\\dfrac{dx}{${cv('v')}}`,600,330,64);
  s+=fade(seg(p,.3,.45),highlight(640,290,90,110,1,C.hi));
  return s+goalTag(G3,{g:seg(p,.02,.12)});
 },
 // 15. v で割る → v≠0。小問3 の答え B
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.35;
  let s=roadmap({fill:[1,1,0],hiBox:0});
  s+=T(`dt=\\dfrac{dx}{${cv('v')}}`,520,330,64)+highlight(560,290,90,110,1,C.hi);
  s+=fade(seg(p,.05,.2),label('v で 割る',600,450,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,b+.1,b+.25),card(760,280,280,100,T(`${cv('v')}\\neq0`,900,338,52),1,C.hi));
  return s+goalTag(G3)+ANS3(seg(p,.88,.95));
 },
 // 16. 誤答 A・C
 [K+'wrong3']:(p,ctx)=>{
  let s=roadmap({fill:[1,1,0]});
  s+=T(`dt=\\dfrac{dx}{${cv('v')}}`,450,280,52)+card(640,235,220,90,T(`${cv('v')}\\neq0`,750,285,44),1,C.hi);
  s+=wrongSeq(p,ctx,[['A','力が一定','変わる力にも使える'],['C','加速度一定','½at² の仮定。ここでは不要']],{opts:{...WOPT,y:360}});
  return s+goalTag(G3)+ANS3(1);
 },
 // 17. 誤答 D：始点は自由（積分の下端に始めの位置）
 [K+'wrong3d']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=roadmap({fill:[1,1,0]});
  s+=T(`dt=\\dfrac{dx}{${cv('v')}}`,300,280,48)+card(450,235,200,90,T(`${cv('v')}\\neq0`,550,285,40),1,C.hi);
  s+=fade(seg(p,b,b+.1),T(`\\int_{x_0}^{x_1}F\\,dx`,840,285,44)+label('x₀ ＝ 始めの 位置',960,250,{size:24,color:CX,weight:700}));
  s+=wrongCard('D','原点から出発','始点は自由、下端に始めの位置',{...WOPT,y:360,g:seg(p,.03,.1)});
  return s+goalTag(G3)+ANS3(1);
 },

 // ===================== まとめ =====================
 // 18. F dx＝mv dv。細い短冊を足し上げ、F–x の長方形 24 と v–mv の台形 24 が等しい。3つ目の箱に W＝ΔK（カット）
 [K+'strip']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,rm=seg(p,b+.15,b+.25);
  let s='';
  s+=fade(seg(p,.02,.1)*(1-seg(p,.3,.36)),T(`F=m${cv('v')}\\,\\dfrac{d${cv('v')}}{dx}`,600,140,44));
  s+=fade(seg(p,.32,.4)*(1-rm),T(`F\\,dx=m${cv('v')}\\,d${cv('v')}`,600,140,44)+label('両辺に dx を 掛ける',900,150,{size:24,color:C.dim}));
  s+=roadmap({g:rm,fill:[1,1,seg(p,b+.25,b+.35)],hiBox:p>b+.25?2:-1});
  const A=axes({x:110,y:460,w:380,h:200,xmin:0,xmax:4,ymin:0,ymax:10,xlabel:'x [m]',ylabel:'F [N]',xcolor:CX,ycolor:CF});
  const B=axes({x:680,y:460,w:380,h:200,xmin:0,xmax:5,ymin:0,ymax:20,xlabel:'v',ylabel:'mv',xcolor:CV,ycolor:CV});
  s+=A.svg+B.svg+B.plot(u=>4*u,{from:0,to:5,color:C.dim,w:2.5,dash:'8 7'});
  const st=seg(p,.4,b),sum=seg(p,b,b+.15);
  // 細い短冊（F dx と mv dv）
  s+=fade(st*(1-sum),rect(A.X(1.2),A.Y(8),A.X(1.4)-A.X(1.2),A.Y(0)-A.Y(8),{fill:CE,fo:.7,stroke:CE,sw:2,rx:1})+label('F dx',A.X(1.3),A.Y(8)-12,{size:24,color:CE,anchor:'middle',weight:700})
   +rect(B.X(2.8),B.Y(4*2.8),B.X(3)-B.X(2.8),B.Y(0)-B.Y(4*2.8),{fill:CE,fo:.7,stroke:CE,sw:2,rx:1})+label('mv dv',B.X(2.9),B.Y(12.5)-8,{size:24,color:CE,anchor:'middle',weight:700}));
  s+=fade(sum,rect(A.X(0),A.Y(8),(A.X(3)-A.X(0))*sum,A.Y(0)-A.Y(8),{fill:CE,fo:.35,stroke:CE,sw:2.5,rx:2}));
  s+=trap(B,2,mix(2,4,sum)+1e-3,sum>0?1:0);
  s+=fade(seg(p,b+.1,b+.2),label('24 J',A.X(1.5),A.Y(4)+10,{size:30,color:CE,anchor:'middle',weight:700})+label('24 J',B.X(3),B.Y(4)+10,{size:30,color:CE,anchor:'middle',weight:700})
   +label('＝',590,350,{size:44,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // 19. 道筋の図がゴールまで埋まる。F は合力、v≠0。答えの札3枚
 [K+'sum']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=roadmap({fill:[seg(p,.1,.2),seg(p,.2,.3),seg(p,.3,.4)],goalW:seg(p,.4,.5),goalSolid:1});
  s+=fade(seg(p,b,b+.08),card(200,260,800,180,label('F ＝ 合力',600,320,{size:32,color:CF,anchor:'middle',weight:700})
   +T(`${cv('v')}\\neq0`,470,395,40)+label('の 区間で 考える',530,405,{size:30,color:C.ink,weight:700}),1,C.hi));
  s+=answerRow([[1,'B','4.0 m/s'],[2,'C',''],[3,'B','']],{g:seg(p,.85,.93)});
  return s;
 },
};

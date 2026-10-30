// 問題編 解説「台の上から投げ上げた球」（q-um-constant-force-derive、大学編 10 運動方程式・中級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/10_運動方程式.md の q-um-constant-force-derive（解説 18 行）。
// 画面：左に台（15 m）と小球と y の目盛り。右に階段（加速度 → 速度 → 位置）とグラフ、または式の枠。札の帯（y＜78）には図を描かない。
// 色：位置 y 水色、速度 v 紫、加速度 a 赤、力 F 緑、時間 t 金、強調 黄、誤りの線 灰色の点線。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,axes,tex,texWidth,poly,ground} from './anim.mjs';
import {QX,card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,cueT,tAt,sentWin,textW} from './yt1-qx-common.mjs';

const K='qx-um-constant-force-derive:';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const cA=s=>`{\\color{${C.a}}${s}}`,cV=s=>`{\\color{${C.v}}${s}}`,cX=s=>`{\\color{${C.x}}${s}}`,cT=s=>`{\\color{${C.t}}${s}}`,cH=s=>`{\\color{${C.hi}}${s}}`,cF=s=>`{\\color{${C.F}}${s}}`;
const GRAY='#8a97ad';
const G1='y を t の式で',G2='15 が入る理由',G3='地面に着く時刻 t';
const ANS1=g=>answerTag(1,'B',{tex:'y=15+10t-5t^2'},{g}),ANS2=g=>answerTag(2,'B','',{g}),ANS3=g=>answerTag(3,'C','3.0 s',{g});
const win2=ctx=>{const W=sentWin(ctx);return W.length>1?W[1][0]:.5;};
const yOf=t=>15+10*t-5*t*t,vOf=t=>10-10*t;

// ---- 台と小球（左） ---------------------------------------------------------------
const YP=m=>475-16*m,TX0=210;
function tower({yb=15,g=1,v0=0,grav=0,acc=0,hiGround=0,hi15=0,trail=0}={}){
 let s=line(60,YP(0)+6,60,YP(21.5),{color:C.x,w:3})+arrow(60,YP(20.5),60,YP(22.5),{color:C.x,w:3,head:12});
 for(const m of [0,5,10,15,20])s+=line(54,YP(m),66,YP(m),{color:C.x,w:2})+label(String(m),46,YP(m)+8,{size:22,color:m===15&&hi15>.5?C.hi:C.x,anchor:'end',weight:m===15&&hi15>.5?700:400});
 s+=label('y [m]',60,YP(22.5)-10,{size:22,color:C.x,anchor:'middle'});
 if(hi15)s+=fade(hi15,line(66,YP(15),TX0-100,YP(15),{color:C.hi,w:2.5,dash:'5 5'})+ring(36,YP(15),20,{color:C.hi,w:2.5}));
 s+=ground(80,390,YP(0));
 if(hiGround)s+=fade(hiGround,line(80,YP(0),390,YP(0),{color:C.hi,w:6}));
 s+=rect(TX0-100,YP(15)+14,100,YP(0)-YP(15)-14,{fill:'#5b6b88',fo:.35,stroke:C.dim,sw:2,rx:3});
 if(trail)s+=trail;
 const by=Math.min(YP(yb),YP(0)-14);
 s+=ring(TX0+(yb<15.01&&yb!==15?0:0),by,14,{color:C.x,w:3,fill:'#123049'});
 if(v0)s+=fade(v0,arrow(TX0,by-16,TX0,by-90,{color:C.v,w:6,head:16})+label('10 m/s',TX0+14,by-60,{size:24,color:C.v,weight:700}));
 if(grav)s+=fade(grav,arrow(TX0+40,by,TX0+40,by+70,{color:C.F,w:6,head:16})+label('mg',TX0+52,by+62,{size:24,color:C.F,weight:700}));
 if(acc)s+=fade(acc,arrow(TX0+100,by-20,TX0+100,by+40,{color:C.a,w:6,head:16})+label('a',TX0+112,by+30,{size:26,color:C.a,weight:700}));
 return fade(g,s);
}
const gTag=(g=1)=>fade(g,rect(110,88,330,38,{fill:'#1b2438',fo:.95,stroke:C.dim,sw:2,rx:19})+label('g ＝ 10 m/s²、空気抵抗なし',275,115,{size:22,color:C.ink,anchor:'middle'}));

// ---- グラフ ---------------------------------------------------------------------------
// 目盛りの数は 22px で描き直す。tBottom：時刻の数を下の端に置く（v–t で、線と重ならないように）
function graph({x,gy,w,h,ymin,ymax,yt,ylab,ycol,tmax=3.4,g=1,tBottom=0}){
 const A=axes({x,y:gy,w,h,xmin:0,xmax:tmax,ymin,ymax,xticks:[1,2,3],yticks:yt,grid:true,g:1});
 let s=A.svg.replace(/<text[^>]*>[^<]*<\/text>/g,'');
 const oy=A.Y(0);
 for(const t of [1,2,3])s+=label(String(t),A.X(t),(tBottom?gy:oy)+30,{size:22,color:C.t,anchor:'middle'});
 for(const v of yt)if(v!==0)s+=label(String(v),x-12,A.Y(v)+8,{size:22,color:ycol,anchor:'end'});
 s+=label('t [s]',A.X(3)+28,(tBottom?gy:oy)+30,{size:22,color:C.t});
 s+=label(ylab,x+14,gy-h-12,{size:22,color:ycol});
 return {A,svg:fade(g,s)};
}
const vG=(o={})=>graph({x:470,gy:465,w:280,h:175,ymin:-25,ymax:12,yt:[10,-10,-20],ylab:'v [m/s]',ycol:C.v,tBottom:1,...o});
const yG=(o={})=>graph({x:880,gy:465,w:250,h:175,ymin:0,ymax:21,yt:[5,10,15,20],ylab:'y [m]',ycol:C.x,...o});
const bigY=(o={})=>graph({x:470,gy:465,w:320,h:320,ymin:0,ymax:21,yt:[5,10,15,20],ylab:'y [m]',ycol:C.x,...o});

// ---- 階段（加速度 → 速度 → 位置） ------------------------------------------------------
const SX=[400,620,880],SWS=[180,220,290];
const tagX=(i,under)=>under?SX[i+1]+SWS[i+1]/2:SX[i]+SWS[i]+20;
function stairs({y0=104,g=1,a='',v='',yy='',cTag='C ＝ ?',dTag='D ＝ ?',cCol=C.dim,dCol=C.dim,cHi=0,dHi=0,tags=1,hiV=0,hiY=0,under=0}={}){
 const bh=100,items=[['加速度',a,C.a,0],['速度',v,C.v,hiV],['位置',yy,C.x,hiY]];
 let s='';
 items.forEach(([n,f,col,hi],i)=>{const x=SX[i],SW=SWS[i];
  s+=card(x,y0,SW,bh,label(n,x+SW/2,y0+32,{size:24,color:col,anchor:'middle',weight:700})+(f?T(f,x+SW/2,y0+76,30):label('？',x+SW/2,y0+82,{size:30,color:C.dim,anchor:'middle'})),1,hi>.5?C.hi:col);
  if(i<2){const ax=x+SW+4;s+=arrow(ax,y0+bh/2,ax+32,y0+bh/2,{color:C.dim,w:3,head:12})+label('積分',ax+16,y0-8,{size:22,color:C.dim,anchor:'middle'});}
 });
 if(tags)[[cTag,cCol,cHi,0],[dTag,dCol,dHi,1]].forEach(([t,col,hi,i])=>{const cx=tagX(i,under),w=Math.max(110,textW(t,22)+30);
  s+=rect(cx-w/2,y0+bh+10,w,36,{fill:'#1b2438',fo:.96,stroke:hi>.5?C.hi:col,sw:2+hi*1.5,rx:18})+label(t,cx,y0+bh+36,{size:22,color:hi>.5?C.hi:col,anchor:'middle',weight:700});});
 return fade(g,s);
}

// ---- 位置の式（小問2）と、その中の数の位置 --------------------------------------------
const YF=['y=','15','+','10','t-','5','t^2'];
function yFormula(x,y,size,{h15=0,h10=0,h5=0}={}){
 const src=YF.join(''),W=texWidth(src,size,false),x0=x-W/2;
 const pos=i=>{const a=i?texWidth(YF.slice(0,i).join('')+'{}',size,false):0,b=texWidth(YF.slice(0,i+1).join(''),size,false);return [x0+a,x0+b];};
 let s=T(src,x,y,size);
 const box=(i,g,col)=>{const [a,b]=pos(i);return fade(g,rect(a-3,y-size*.95,b-a+6,size*1.35,{fill:col,fo:.1,stroke:col,sw:3,rx:8}));};
 s+=box(1,h15,C.hi)+box(3,h10,C.v)+box(5,h5,C.hi);
 return {svg:s,pos};
}

export const ytQxUmConstantForceDeriveDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（約4秒）：台と小球、y の目盛り。0〜2 s 上向きの速度の矢印「10 m/s」。2〜4 s 目盛りだけの v–t と y–t、「g＝10 m/s²、空気抵抗なし」。静止。
 [K+'q0']:(p)=>{
  let s=tower({v0:seg(p,.05,.4)});
  const gv=vG({gy:465,h:300,g:seg(p,.5,.75)}),gy=yG({gy:465,h:300,g:seg(p,.55,.8)});
  s+=gv.svg+gy.svg+gTag(seg(p,.75,.95));
  return s;
 },

 // ===================== 小問1 =====================
 // 1. 出題中の図。求めるもの
 [K+'goal1']:(p)=>{
  let s=tower({v0:1});
  s+=vG({h:300}).svg+yG({h:300}).svg+gTag();
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 2. 下向きの重力（緑）と加速度（赤）。法則 m d²y/dt²＝−mg、両辺の m に打ち消し線 → d²y/dt²＝−g
 [K+'eom']:(p,ctx)=>{
  const b=win2(ctx),cn=seg(p,b+.3,b+.4);
  let s=tower({v0:1-seg(p,0,.1),grav:seg(p,.1,.25),acc:seg(p,.2,.35)});
  s+=fade(1-seg(p,0,.08),vG({h:300}).svg+yG({h:300}).svg);
  const mm=cn>.5?`{\\color{${C.a}}\\cancel{\\color{${C.ink}}m}}`:'m';
  s+=card(420,90,760,380,label('空中で はたらく 力',800,130,{size:24,color:C.dim,anchor:'middle'})
   +label('下向きの 重力 mg だけ',800,172,{size:30,color:C.F,anchor:'middle',weight:700})
   +fade(seg(p,b,b+.08),line(460,200,1140,200,{color:C.faint,w:2})+kindTag('法則',530,245)+label('上向きが ＋',1060,245,{size:24,color:C.x,anchor:'middle',weight:700}))
   +fade(seg(p,b+.05,b+.15),T(`${mm}\\,\\dfrac{d^2${cX('y')}}{dt^2}=${cH('-')}${mm}g`,800,320,44))
   +fade(seg(p,b+.42,b+.52),label('両辺を m で 割る',600,420,{size:24,color:C.dim,anchor:'middle'})+T(`\\dfrac{d^2${cX('y')}}{dt^2}=-g`,880,420,40)),seg(p,.03,.12),C.F);
  s+=goalTag(G1);
  return s;
 },
 // 3. 「加速度 → 速度 → 位置」の階段。空の札「C＝?」「D＝?」
 [K+'stairs']:(p)=>{
  let s=tower({grav:.5,acc:1});
  s+=stairs({g:seg(p,.05,.2),a:`${cA('a')}=-10`,tags:seg(p,.4,.5)>0});
  s+=fade(seg(p,.5,.7),vG().svg+yG().svg);
  s+=goalTag(G1);
  return s;
 },
 // 4a. v＝−10t＋C。t＝0 を入れると C は初めの速度
 [K+'int1']:(p,ctx)=>{
  const b=win2(ctx);
  let s=tower({v0:seg(p,.55,.7)});
  s+=stairs({a:`${cA('a')}=-10`,v:seg(p,.08,.2)>0?`${cV('v')}=-10${cT('t')}+C`:'',cTag:seg(p,.6,.7)>0?'C ＝ 初めの 速度':'C ＝ ?',cCol:seg(p,.6,.7)>0?C.v:C.dim,cHi:seg(p,.6,.7)*(1-seg(p,.9,1)),hiV:seg(p,.08,.2)*(1-seg(p,.5,.55))});
  s+=vG().svg+yG().svg;
  s+=goalTag(G1);
  return s;
 },
 // 4b. C＝v₀＝10、v＝10−10t。v–t グラフに切片 10、傾き −10 の直線（紫）
 [K+'int1b']:(p)=>{
  let s=tower({v0:1});
  s+=stairs({a:`${cA('a')}=-10`,v:`${cV('v')}=10-10${cT('t')}`,cTag:'C ＝ v₀ ＝ 10',cCol:C.v,cHi:seg(p,.05,.15)*(1-seg(p,.8,.9))});
  const {A,svg}=vG();s+=svg+A.plot(vOf,{from:0,to:3.15,p:seg(p,.3,.75),color:C.v,w:4});
  s+=fade(seg(p,.3,.4),dot(A.X(0),A.Y(10),7,C.v)+label('10',A.X(0)+12,A.Y(10)-10,{size:22,color:C.v,weight:700}));
  s+=yG().svg;
  s+=goalTag(G1);
  return s;
 },
 // 5. y＝10t−5t²＋D。v–t の三角形を一瞬だけ黄で塗り「½×t×10t」。−5t² の 5 を黄で
 [K+'int2']:(p,ctx)=>{
  const b=win2(ctx),tri=seg(p,b+.05,b+.15)*(1-seg(p,.92,1)),tt=1.4;
  let s=tower({v0:1});
  s+=stairs({a:`${cA('a')}=-10`,v:`${cV('v')}=10-10${cT('t')}`,yy:seg(p,.05,.2)>0?(seg(p,b+.15,b+.25)>.5?`${cX('y')}=10${cT('t')}-${cH('5')}${cT('t')}^2+D`:`${cX('y')}=10${cT('t')}-5${cT('t')}^2+D`):'',cTag:'C ＝ v₀ ＝ 10',cCol:C.v,hiY:seg(p,.05,.2)*(1-seg(p,.4,.45))});
  const {A,svg}=vG();s+=svg+A.plot(vOf,{from:0,to:3.15,color:C.v,w:4});
  s+=fade(tri,line(A.X(0),A.Y(10),A.X(tt),A.Y(10),{color:C.hi,w:2.5,dash:'6 5'})+poly([[A.X(0),A.Y(10)],[A.X(tt),A.Y(10)],[A.X(tt),A.Y(vOf(tt))]],{fill:C.hi,fo:.3,stroke:C.hi,sw:2})
   +label('½ × t × 10t',A.X(tt)+10,A.Y(4),{size:24,color:C.hi,weight:700}));
  s+=yG().svg;
  s+=goalTag(G1);
  return s;
 },
 // 6. D＝y₀＝15（水色）。目盛りの 15 を光らせる。y–t に切片 15 の放物線。式を完成
 [K+'d15']:(p,ctx)=>{
  const b=win2(ctx),dk=seg(p,b,b+.1);
  let s=tower({v0:1,hi15:seg(p,b,b+.1)*(1-seg(p,.9,1))});
  s+=stairs({a:`${cA('a')}=-10`,v:`${cV('v')}=10-10${cT('t')}`,yy:seg(p,b+.2,b+.3)>0?`${cX('y')}=15+10${cT('t')}-5${cT('t')}^2`:`${cX('y')}=10${cT('t')}-5${cT('t')}^2+D`,cTag:'C ＝ v₀ ＝ 10',cCol:C.v,dTag:seg(p,.3,.4)>0?(dk>0?'D ＝ y₀ ＝ 15':'D ＝ 初めの 位置'):'D ＝ ?',dCol:seg(p,.3,.4)>0?C.x:C.dim,dHi:seg(p,.3,.4)*(1-seg(p,.9,1)),hiY:seg(p,b+.2,b+.3)});
  const {A,svg}=vG();s+=svg+A.plot(vOf,{from:0,to:3.15,color:C.v,w:4});
  const Y=yG();s+=Y.svg+Y.A.plot(yOf,{from:0,to:3,p:seg(p,b+.3,b+.7),color:C.x,w:4});
  s+=fade(seg(p,b+.3,b+.4),dot(Y.A.X(0),Y.A.Y(15),7,C.x)+label('15',Y.A.X(0)+12,Y.A.Y(15)-10,{size:22,color:C.x,weight:700}));
  s+=goalTag(G1);
  return s;
 },
 // 7. 答えの札 B。誤答 A → C → D を一枚ずつ（グラフを消して、その場所に）
 [K+'ans1']:(p,ctx)=>{
  const b=win2(ctx),n=(1-b)/3;
  let s=tower({v0:1});
  s+=stairs({a:`${cA('a')}=-10`,v:`${cV('v')}=10-10${cT('t')}`,yy:`${cX('y')}=15+10${cT('t')}-5${cT('t')}^2`,cTag:'C ＝ v₀ ＝ 10',cCol:C.v,dTag:'D ＝ y₀ ＝ 15',dCol:C.x});
  s+=fade(1-seg(p,b-.05,b),vG().svg+yG().svg);
  s+=wrongSeq(p,ctx,[['A','y＝10t−5t²','初めの 位置 15 m が ない'],['C','y＝15＋10t−10t²','積分の ½ を 落とした'],['D','y＝15＋10t＋5t²','上向きが ＋ なのに 加速度を ＋g']],
   {win:[[b,b+n],[b+n,b+2*n],[b+2*n,1]],opts:{x:420,w:760,y:290,size:28,whySize:24}});
  s+=goalTag(G1)+ANS1(seg(p,.03,.1));
  return s;
 },

 // ===================== 小問2 =====================
 // 8. 誤答カードを消す。式の 15 を黄で囲む
 [K+'goal2']:(p)=>{
  let s=tower({v0:1});
  s+=yFormula(800,165,48,{h15:seg(p,.3,.45)}).svg;
  s+=stairs({y0:230,g:seg(p,.05,.2),a:`${cA('a')}=-10`,v:`${cV('v')}=10-10${cT('t')}`,yy:`${cX('y')}=15+10${cT('t')}-5${cT('t')}^2`,cTag:'C ＝ v₀ ＝ 10',cCol:C.v,dTag:'D ＝ y₀ ＝ 15',dCol:C.x});
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 9. 式の 15 と、階段の2段目の札「D＝y₀＝15」を黄の線で結ぶ。答えの札 B
 [K+'ans2']:(p,ctx)=>{
  const b=win2(ctx),lk=seg(p,.1,.3);
  const F=yFormula(800,165,48,{h15:1});
  let s=tower({v0:1,hi15:lk})+F.svg;
  s+=stairs({y0:230,a:`${cA('a')}=-10`,v:`${cV('v')}=10-10${cT('t')}`,yy:`${cX('y')}=15+10${cT('t')}-5${cT('t')}^2`,cTag:'C ＝ v₀ ＝ 10',cCol:C.v,dTag:'D ＝ y₀ ＝ 15',dCol:C.x,dHi:lk});
  const [a15,b15]=F.pos(1),dx=tagX(1,0);
  s+=fade(lk,draw([[(a15+b15)/2,190],[(a15+b15)/2,215],[dx,215],[dx,340]],1,{color:C.hi,w:3}));
  s+=fade(seg(p,.25,.4),label('2回目の 積分定数（t ＝ 0 の 位置）',800,470,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=goalTag(G2)+ANS2(seg(p,b,b+.08));
  return s;
 },
 // 10. 誤答 A（式の 10 と C の札を紫の線で）→ C → D（−5t² の 5 を黄で）
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),e1=W[0][1],b2=W[1]?W[1][0]:e1,m2=b2+(1-b2)*.55;
  const inA=seg(p,.01,.05)*(1-seg(p,e1-.04,e1)),inD=seg(p,m2,m2+.04);
  const F=yFormula(800,165,48,{h10:inA,h5:inD});
  let s=tower({v0:1})+F.svg;
  s+=stairs({y0:230,a:`${cA('a')}=-10`,v:`${cV('v')}=10-10${cT('t')}`,yy:`${cX('y')}=15+10${cT('t')}-5${cT('t')}^2`,cTag:'C ＝ v₀ ＝ 10',cCol:C.v,dTag:'D ＝ y₀ ＝ 15',dCol:C.x,cHi:inA});
  const [a10,b10]=F.pos(3),cx=tagX(0,0);
  s+=fade(inA,draw([[(a10+b10)/2,190],[(a10+b10)/2,212],[cx,212],[cx,340]],1,{color:C.v,w:3}));
  s+=wrongSeq(p,ctx,[['A','初めの 速度で 決めた','それは 10 の 方'],['C','g を 高さで 補正','g は 一定と 仮定、−5t² は 変わらない'],['D','½ を 高さに 掛けた','½ は t の 積分から']],
   {win:[[0,e1],[b2,m2],[m2,1]],opts:{x:420,w:760,y:385,size:26,whySize:22}});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },
 // 11. 地面から投げた放物線 y＝10t−5t²（点線）を、縦に 15 m ずらして実線の放物線に重ねる
 [K+'shift']:(p,ctx)=>{
  const b=win2(ctx),up=seg(p,b,b+.35);
  let s=tower({v0:1,hi15:up});
  const {A,svg}=bigY();s+=svg;
  s+=fade(seg(p,.05,.15),A.plot(t=>10*t-5*t*t,{from:0,to:2,p:seg(p,.05,.3),color:GRAY,w:3,dash:'8 6'}));
  s+=fade(up,A.plot(t=>10*t-5*t*t+15*up,{from:0,to:2,color:C.x,w:4}));
  s+=fade(seg(p,b+.3,b+.4),A.plot(yOf,{from:0,to:3,color:C.x,w:4}));
  s+=fade(up*(1-seg(p,b+.3,b+.4)),arrow(A.X(1),A.Y(5),A.X(1),A.Y(5+15*up),{color:C.hi,w:4,head:14}));
  s+=card(840,90,340,330,label('同じ 方程式',1010,135,{size:24,color:C.dim,anchor:'middle'})
   +T(`\\dfrac{d^2${cX('y')}}{dt^2}=-10`,1010,195,32)
   +fade(seg(p,.1,.2),label('地面から：D ＝ 0',1010,265,{size:26,color:GRAY,anchor:'middle',weight:700}))
   +fade(seg(p,b,b+.1),label('台の上から：D ＝ 15',1010,315,{size:26,color:C.x,anchor:'middle',weight:700}))
   +fade(seg(p,b+.2,b+.3),label('→ 別の 運動',1010,370,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.02,.1));
  s+=goalTag(G2)+ANS2(1);
  return s;
 },

 // ===================== 小問3 =====================
 // 12. 誤答カードと点線を消す。地面 y＝0 を黄で光らせる
 [K+'goal3']:(p)=>{
  let s=tower({v0:1,hiGround:seg(p,.25,.4)});
  const {A,svg}=bigY();s+=svg+A.plot(yOf,{from:0,to:3,color:C.x,w:4});
  s+=card(840,90,340,200,label('小問3',1010,135,{size:24,color:C.dim,anchor:'middle'})+label('地面に 着く 時刻 は？',1010,200,{size:28,color:C.hi,anchor:'middle',weight:700})
   +label('地面 ＝ y ＝ 0',1010,255,{size:26,color:C.x,anchor:'middle'}),seg(p,.05,.2),C.hi);
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 13. 横軸（y＝0）を黄で光らせる。式を一行ずつ
 [K+'solve']:(p,ctx)=>{
  const b=win2(ctx);
  let s=tower({v0:1,hiGround:1});
  const {A,svg}=bigY();s+=svg+A.plot(yOf,{from:0,to:3,color:C.x,w:4});
  s+=fade(seg(p,.1,.2),line(A.X(0),A.Y(0),A.X(3.4),A.Y(0),{color:C.hi,w:5}));
  s+=card(840,90,340,330,label('y ＝ 0 を 解く',1010,130,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.25,.4),T(`15+10${cT('t')}-5${cT('t')}^2=0`,1010,195,28))
   +fade(seg(p,b,b+.08),label('両辺を −5 で 割る',1010,265,{size:22,color:C.dim,anchor:'middle'}))
   +fade(seg(p,b+.1,b+.2),T(`${cT('t')}^2-2${cT('t')}-3=0`,1010,320,30)),1);
  s+=goalTag(G3);
  return s;
 },
 // 14. (t−3)(t＋1)＝0、t＝−1 に ×。交点 t＝3 に印（金）。小球が台から上がって地面まで落ちる。答えの札 C
 [K+'ans3']:(p,ctx)=>{
  const b=win2(ctx),tr=tAt(ctx,K+'ans3'),tb=clamp((tr-.6)*1.0,0,3);
  const yb=tr<.6?15:yOf(tb);
  let s=tower({yb,hiGround:1});
  const {A,svg}=bigY();s+=svg+A.plot(yOf,{from:0,to:3,color:C.x,w:4});
  s+=fade(seg(p,.1,.2)*(tr>=.6?1:0),dot(A.X(tb),A.Y(Math.max(0,yOf(tb))),8,C.x));
  s+=fade(seg(p,.4,.5),dot(A.X(3),A.Y(0),10,C.t)+label('t ＝ 3',A.X(3)+12,A.Y(0)-14,{size:24,color:C.t,weight:700}));
  s+=card(840,90,340,330,label('因数分解',1010,130,{size:24,color:C.dim,anchor:'middle'})
   +T(`(${cT('t')}-3)(${cT('t')}+1)=0`,1010,190,30)
   +fade(seg(p,.25,.35),T(`${cT('t')}=3`,950,265,32)+T(`${cT('t')}=-1`,1080,265,32))
   +fade(seg(p,.35,.45),line(1040,240,1120,285,{color:'#ff6b6b',w:4})+line(1040,285,1120,240,{color:'#ff6b6b',w:4})+label('時刻は 正',1080,320,{size:22,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.45,.55),T(`${cT('t')}=${cT('3.0\\ \\mathrm{s}')}`,1010,385,36)),1,C.t);
  s+=goalTag(G3)+ANS3(seg(p,b,b+.08));
  return s;
 },
 // 15. 放物線上の t＝1（頂上 y＝20）と t＝2（y＝15）を順に光らせる。誤答 A → B
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),e1=W[0][1],m=e1*.5,inA=seg(p,.01,.05)*(1-seg(p,m-.04,m)),inB=seg(p,m,m+.04),b2=W[1]?W[1][0]:e1;
  let s=tower({yb:0});
  const {A,svg}=bigY();s+=svg+A.plot(yOf,{from:0,to:3,color:C.x,w:4});
  s+=dot(A.X(3),A.Y(0),9,C.t);
  s+=fade(inA,dot(A.X(1),A.Y(20),10,C.hi)+label('最高点 t ＝ 1',A.X(1)+16,A.Y(20)-8,{size:22,color:C.hi,weight:700}));
  s+=fade(inB,dot(A.X(2),A.Y(15),10,C.hi)+line(A.X(0),A.Y(15),A.X(2),A.Y(15),{color:C.hi,w:2,dash:'6 5'})+label('t ＝ 2（y ＝ 15）',A.X(2)-14,A.Y(15)+30,{size:22,color:C.hi,weight:700,anchor:'end'}));
  s+=fade(seg(p,b2,b2+.08),line(A.X(2)+8,A.Y(15),A.X(2)+8,A.Y(0),{color:C.hi,w:4})+label('さらに 15 m',A.X(2)-10,A.Y(5),{size:22,color:C.hi,weight:700,anchor:'end'}));
  s+=card(840,90,340,110,T(`${cT('t')}=${cT('3.0\\ \\mathrm{s}')}`,1010,155,32),1,C.t);
  s+=wrongSeq(p,ctx,[['A','1.0 s','最高点の 時刻（v ＝ 0）'],['B','2.0 s','台の 高さに 戻る 時刻']],{win:[[0,m],[m,1]],opts:{x:840,w:340,y:220,size:26,whySize:22}});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },
 // 16. 静かに落ちる放物線（点線）が t≈1.7 で地面に着く。誤答 D
 [K+'wrongD']:(p)=>{
  const dr=seg(p,.1,.45),t0=Math.sqrt(3);
  let s=tower({yb:0});
  const {A,svg}=bigY();s+=svg+A.plot(yOf,{from:0,to:3,color:C.x,w:4})+dot(A.X(3),A.Y(0),9,C.t);
  s+=A.plot(t=>15-5*t*t,{from:0,to:t0,p:dr,color:C.hi,w:3.5,dash:'8 6'});
  s+=fade(seg(p,.4,.5),dot(A.X(t0),A.Y(0),8,C.hi)+label('約 1.7',A.X(t0)+10,A.Y(0)-12,{size:22,color:C.hi,weight:700})+label('静かに落とす',A.X(.06),A.Y(1.2),{size:22,color:C.hi,weight:700}));
  s+=card(840,90,340,110,T(`${cT('t')}=${cT('3.0\\ \\mathrm{s}')}`,1010,155,32),1,C.t);
  s+=wrongCard('D','√3 s',['初めの 速度 10 m/s を','入れていない（15 ＝ 5t²）'],{x:840,w:340,y:220,size:26,whySize:22,g:seg(p,.03,.1)});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },
 // 17. チェック欄3つ「方程式 ✓」「初めの位置 ✓」「初めの速度 ✓」
 [K+'check']:(p,ctx)=>{
  const b=win2(ctx),ok=[seg(p,.15,.25),seg(p,b+.1,b+.2),seg(p,b+.35,b+.45)];
  let s=tower({v0:1});
  const {A,svg}=bigY();s+=svg+A.plot(yOf,{from:0,to:3,color:C.x,w:4});
  const rows=[['方程式',`\\dfrac{d^2${cX('y')}}{dt^2}=-10`],['初めの 位置',`${cX('y')}(0)=15`],['初めの 速度',`${cV('v')}(0)=10`]];
  let inner=label('確かめ',1010,128,{size:24,color:C.dim,anchor:'middle'});
  rows.forEach(([n,f],i)=>{const y=170+i*100;
   inner+=rect(860,y-24,34,34,{fill:'none',fo:0,stroke:C.dim,sw:2.5,rx:6})+fade(ok[i],label('✓',877,y+4,{size:30,color:C.F,anchor:'middle',weight:700}))
    +label(n,910,y,{size:24,color:C.ink,weight:700})+fade(ok[i],T(f,1010,y+50,i?30:28));});
  s+=card(840,90,340,380,inner,1);
  s+=goalTag(G3)+ANS3(1);
  return s;
 },

 // ===================== まとめ =====================
 // 18. 階段の2枚の札「C＝v₀」「D＝y₀」を並べて光らせる。右上に答えの札3枚
 [K+'sum']:(p)=>{
  let s=tower({v0:1,g:1});
  const hi=seg(p,.3,.4);
  s+=stairs({y0:160,g:seg(p,.02,.12),a:`${cA('a')}=-10`,v:`${cV('v')}=10-10${cT('t')}`,yy:`${cX('y')}=15+10${cT('t')}-5${cT('t')}^2`,cTag:'C ＝ v₀（初めの 速度）',cCol:C.v,dTag:'D ＝ y₀（初めの 位置）',dCol:C.x,cHi:hi,dHi:hi,under:1});
  s+=fade(seg(p,.1,.2),label('ma ＝ F が 決める',SX[0]+SWS[0]/2,160-36,{size:24,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.5),label('ふたつの 積分定数は 初期条件で 決まる',800,380,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=answerRow([[1,'B',''],[2,'B',''],[3,'C','3.0 s']],{g:seg(p,.6,.72)});
  return s;
 },
};

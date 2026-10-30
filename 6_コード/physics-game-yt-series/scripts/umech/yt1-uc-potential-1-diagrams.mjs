// YouTube シリーズ「位置エネルギー・上級 1/2」(ys-uc-potential-1) — 図。Stage 1200×515.
// 色：距離 r・R・h・s・b 水色、力 F 緑、エネルギー U 橙、K 薄橙、全エネルギー E・強調 黄、速さ v 紫、時間 t 金、負・打ち消し 赤。
// U(r) のグラフは r を R 単位、U を GMm/R 単位で描く（U＝−1/r、r≥1）。
import {C,seg,fade,mix,label,line,rect,dot,ring,arrow,highlight,axes,texWidth,draw} from './anim.mjs';
import {card,T,cc,cX,cH,cV,cT} from './yt1-um-sum-to-integral-1-diagrams.mjs';

const K='uc-potential-1:';
const ok=C.F,bad=C.a,CK='#ffd9b0',EARTH='#2f5f9e';
const cU=s=>cc(C.E,s),cF=s=>cc(C.F,s),cR=s=>cc(bad,s),cK=s=>cc(CK,s);
const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
const GMm='GMm';
const strike=(x1,y1,x2,y2,g=1)=>fade(g,line(x1,y1,x2,y2,{color:bad,w:4}));

// ---- Earth + radial axis ----
function earth(cx,cy,R,{g=1,name=1}={}){
 return fade(g,`<circle cx="${cx}" cy="${cy}" r="${R}" fill="${EARTH}" fill-opacity=".55" stroke="#6f9fe0" stroke-width="2"/>`
  +dot(cx,cy,5,C.ink)+(name?L('地球',cx,cy+R*0.45,{size:24,color:C.ink}):''));
}
// object at screen x on the axis line y, with inward force arrow of length len
function body(x,y,{F=0,len=60,tag='m'}={}){
 let s=ring(x,y,15,{color:C.ink,w:2,fill:'#46597a'})+L(tag,x,y+8,{size:22,weight:700});
 if(F)s+=fade(F,arrow(x,y-30,x-len,y-30,{color:ok,w:5,head:14}));
 return s;
}
function radial({cx=170,cy=300,R=90,x2=640,g=1,label_=1}={}){
 let s=earth(cx,cy,R,{g});
 s+=fade(g,arrow(cx,cy,x2,cy,{color:C.x,w:3,head:14}));
 if(label_)s+=fade(g,label('r',x2+8,cy+10,{size:30,color:C.x,weight:700})+label('外向き ＋',x2-20,cy+46,{size:24,color:C.x,anchor:'end'}));
 return s;
}

// ---- U(r) graph ----
const Uf=r=>-1/r;
function GU(o={}){return axes({x:90,y:480,w:560,h:420,xmin:0,xmax:6,ymin:-1.2,ymax:0.2,xticks:[],yticks:[],grid:false,...o});}
function ugraph(A,{p=1,inside=1,ticks=1,below=0,ytop=0.2}={}){
 let s=A.svg;
 s+=fade(inside,rect(A.X(0),A.Y(0)+4,A.X(1)-A.X(0),A.Y(-1.2)-A.Y(0)-4,{fill:EARTH,fo:.25,stroke:'none'})+label('地球',A.X(0.5),A.Y(-0.55),{size:22,color:C.dim,anchor:'middle'}));
 s+=fade(ticks,[1,2,3,4,5].map(u=>line(A.X(u),A.Y(0)-6,A.X(u),A.Y(0)+6,{color:C.dim})+label(u===1?'R':u+'R',A.X(u),below?A.Y(0)+32:A.Y(0)-14,{size:22,color:C.x,anchor:'middle'})).join(''));
 s+=label('r',A.X(6)+34,A.Y(0)+8,{size:26,color:C.x,weight:700});
 s+=label('U',A.X(0)+14,A.Y(ytop)-8,{size:28,color:C.E,weight:700});
 s+=A.plot(Uf,{from:1,to:6,p,color:C.E,w:5});
 return s;
}

export const ytUcPotential1Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  // up and back down near the ground: +W and −W
  const y0=430,top=180,x=230,u=seg(p,.05,.45),d=seg(p,.45,.85),yy=u<1?mix(y0-20,top,u):mix(top,y0-20,d);
  let s=line(80,y0,420,y0,{color:C.dim,w:3})+dot(x,yy,13,C.ink);
  s+=arrow(x+60,y0-40,x+60,top+20,{color:C.x,w:3,head:12,g:seg(p,.05,.3)})+fade(seg(p,.2,.35),label('上る：重力の 仕事 −',x+80,top+70,{size:24,color:bad}));
  s+=arrow(x-60,top+20,x-60,y0-40,{color:C.x,w:3,head:12,g:seg(p,.45,.7)})+fade(seg(p,.6,.75),label('下る：＋',x-80,y0-80,{size:24,color:ok,anchor:'end'}));
  s+=card(560,90,600,300,L('前回の 最後の 問い',860,140,{color:C.dim})
   +label('重力の 仕事：往復で 0',860,220,{size:32,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.55,.7),label('→ 道に よらない',860,290,{size:30,color:ok,anchor:'middle',weight:700})),seg(p,.02,.15),C.hi);
  return s;
 },
 [K+'ask2']:(p)=>{
  let s=radial({x2:560});
  [[1.5,1],[2.6,.33],[4,.14]].forEach(([u,f],i)=>{const X=170+90*u;s+=fade(seg(p,.05+i*.1,.15+i*.1),body(X,300,{F:1,len:110*f}));});
  s+=fade(seg(p,.3,.45),label('遠いほど 弱い',380,400,{size:26,color:ok,anchor:'middle',weight:700}));
  s+=card(660,90,500,320,L('前回の 最後の 問い',910,140,{color:C.dim})
   +label('万有引力でも',910,205,{size:30,color:C.ink,anchor:'middle'})
   +label('位置エネルギー U は？',910,260,{size:32,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.55,.7),label('なぜ 負 に なる？',910,345,{size:34,color:bad,anchor:'middle',weight:700})),1,C.hi);
  return s;
 },
 [K+'recall']:(p)=>{
  let s=card(150,70,900,360,L('中級：U の 差の 定義（保存力）',600,120,{color:C.dim})
   +T(cU('U(x)')+'-'+cU('U(x_0)')+'=-\\int_{x_0}^{x}'+cF('F(s)')+'\\,ds',600,230,{size:52})
   +fade(seg(p,.45,.6),label('U の 増えた 分 ＝ −（保存力の 仕事）',600,350,{size:32,color:C.E,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'recall2']:(p)=>{
  let s=card(80,90,490,320,L('ばね',325,140,{color:C.dim})+T(cF('F')+'=-k'+cX('x'),325,225,{size:44})+fade(seg(p,.1,.25),T('\\Rightarrow\\ '+cU('U')+'=\\tfrac12 k'+cX('x')+'^2',325,320,{size:46})),seg(p,.02,.12));
  s+=card(630,90,490,320,L('地表近く（一定の 重力）',875,140,{color:C.dim})+T(cF('F')+'=-mg',875,225,{size:44})+fade(seg(p,.5,.65),T('\\Rightarrow\\ '+cU('U')+'=mg'+cX('h'),875,320,{size:46})),seg(p,.4,.5));
  return s;
 },
 [K+'newton']:(p)=>{
  let s=radial({x2:560});
  [[1.3,1],[2,.42],[3,.19],[4,.105]].forEach(([u,f],i)=>{const X=170+90*u;s+=body(X,300,{F:1,len:95*f});});
  s+=card(660,70,500,380,L('万有引力（中級）',910,115,{color:C.dim})
   +T(cF('F')+'=\\dfrac{'+GMm+'}{'+cX('r')+'^2}',910,215,{size:54})
   +label('r：中心からの 距離',910,300,{size:26,color:C.x,anchor:'middle'})
   +fade(seg(p,.5,.65),label('一定の mg ではない',910,360,{size:30,color:bad,anchor:'middle',weight:700})+label('→ mgh は 使えない',910,410,{size:28,color:bad,anchor:'middle'})),seg(p,.02,.12));
  return s;
 },
 // ===== S2 無限遠を基準に積分する =====
 [K+'axis']:(p)=>{
  let s=radial({x2:600});
  s+=fade(seg(p,.1,.25),body(470,300,{F:1,len:110}));
  s+=fade(seg(p,.3,.45),label('F（中心向き）',410,235,{size:24,color:ok,anchor:'middle',weight:700}));
  s+=card(700,90,460,320,L('力の 外向きの 成分',930,140,{color:C.dim})
   +fade(seg(p,.45,.6),T(cF('F')+'=-\\dfrac{'+GMm+'}{'+cX('r')+'^2}',930,240,{size:54}))
   +fade(seg(p,.65,.8),label('負号 ＝ 内向き',930,350,{size:30,color:bad,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'path']:(p)=>{
  // staircase path: arc steps (perpendicular to the force) and outward radial steps
  const cx=140,cy=405,R=75;
  let s=earth(cx,cy,R,{name:1});
  const P=(rr,t)=>[cx+rr*Math.cos(t),cy-rr*Math.sin(t)];
  const steps=[];let r=160,th=1.15;
  for(let i=0;i<4;i++){steps.push(['a',r,th,th-0.22]);th-=0.22;steps.push(['r',r,r+62,th]);r+=62;}
  s+=draw(Array.from({length:30},(_,k)=>P(mix(160,408,k/29),mix(1.15,0.27,k/29))),seg(p,.02,.12),{color:C.faint,w:3,dash:'8 7'});
  steps.forEach((st,i)=>{const g=seg(p,.08+i*.05,.13+i*.05);
   if(st[0]==='a'){const pts=Array.from({length:13},(_,k)=>P(st[1],mix(st[2],st[3],k/12)));s+=draw(pts,g,{color:C.dim,w:6});}
   else{const a=P(st[1],st[3]),b=P(st[2],st[3]);s+=draw([a,b],g,{color:C.x,w:6});}});
  const A=P(160,1.15),B=P(408,0.27);
  s+=dot(A[0],A[1],8,C.ink)+label('A',A[0]-14,A[1]-10,{size:26,color:C.ink,anchor:'end',weight:700});
  s+=fade(seg(p,.45,.55),dot(B[0],B[1],8,C.ink)+label('B',B[0]+14,B[1]+8,{size:26,color:C.ink,weight:700}));
  const t0=0.93-0.11,[fx,fy]=P(222,t0);
  s+=fade(seg(p,.55,.7),arrow(fx,fy,fx-60*Math.cos(t0),fy+60*Math.sin(t0),{color:ok,w:5,head:13})+label('F',fx+10,fy-10,{size:24,color:ok,weight:700}));
  s+=card(620,80,540,350,label('円に 沿う 一歩（灰）',660,145,{size:28,color:C.dim,weight:700})
   +label('力と 直角 → 仕事 0',660,195,{size:28,color:C.ink})
   +fade(seg(p,.6,.75),label('外向きの 一歩（水色）',660,275,{size:28,color:C.x,weight:700})+label('仕事は r の 変化 だけで 決まる',660,325,{size:28,color:C.ink}))
   +fade(seg(p,.75,.9),label('→ U は r だけの 関数',660,395,{size:30,color:C.hi,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'ref']:(p)=>{
  let s=radial({x2:900,label_:0});
  [[1.4,1],[2.2,.4],[3.4,.17],[5,.08]].forEach(([u,f])=>{const X=170+120*u;s+=body(X,300,{F:1,len:110*f});});
  s+=label('r',908,310,{size:30,color:C.x,weight:700});
  s+=fade(seg(p,.4,.55),label('…',980,310,{size:36,color:C.dim})+label('無限に 遠い 所',1060,250,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),T(cU('U(\\infty)')+'=0',1060,380,{size:46})+label('（約束）',1060,440,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'def']:(p)=>{
  let s=T(cU('U(r)')+'-'+cU('U(\\infty)')+'=-\\int_{\\infty}^{'+cX('r')+'}'+cF('F(s)')+'\\,ds',600,95,{size:48});
  s+=fade(seg(p,.35,.5),T(cU('U(\\infty)')+'=0',600,205,{size:40})+label('約束',760,212,{size:26,color:C.hi,weight:700}));
  const e=cU('U(r)')+'=-\\int_{\\infty}^{'+cX('r')+'}'+cF('F(s)')+'\\,ds',w=texWidth(e,56,false);
  s+=fade(seg(p,.5,.65),T(e,600,350,{size:56})+highlight(600-w/2-24,262,w+48,170,1));
  return s;
 },
 [K+'b']:(p)=>{
  let s=T(cU('U(r)')+'-'+cU('U(b)')+'=-\\int_{'+cX('b')+'}^{'+cX('r')+'}'+cF('F(s)')+'\\,ds',600,100,{size:50});
  s+=fade(seg(p,.25,.4),label('まず 有限の 遠い 点 b から',600,200,{size:28,color:C.dim,anchor:'middle'}));
  // number line r ... b ... ∞
  const y=330;s+=fade(seg(p,.35,.5),arrow(200,y,1000,y,{color:C.x,w:3,head:14})+dot(320,y,8,C.x)+label('r',320,y+40,{size:28,color:C.x,anchor:'middle',weight:700})
   +dot(700,y,8,C.x)+label('b',700,y+40,{size:28,color:C.x,anchor:'middle',weight:700})+label('∞',1030,y+10,{size:32,color:C.dim}));
  s+=fade(seg(p,.6,.75),arrow(720,y-40,960,y-40,{color:C.hi,w:4,head:14})+label('あとで b → ∞',840,y-60,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sub']:(p)=>{
  const e1='-\\int_{'+cX('b')+'}^{'+cX('r')+'}\\Big('+cF('-\\dfrac{'+GMm+'}{'+cX('s')+'^2}')+'\\Big)ds';
  let s=T(e1,600,110,{size:50});
  const w=texWidth(e1,50,false),x0=600-w/2;
  s+=fade(seg(p,.25,.4),ring(x0+16,104,24,{color:bad,w:3})+ring(x0+w*0.405,104,24,{color:bad,w:3})+label('− と − が 打ち消す',600,215,{size:28,color:bad,anchor:'middle',weight:700}));
  s+=label('s：途中の 距離',990,215,{size:24,color:C.x,anchor:'middle'});
  const e2='=+'+GMm+'\\int_{'+cX('b')+'}^{'+cX('r')+'}'+cX('s')+'^{-2}\\,ds',w2=texWidth(e2,54,false);
  s+=fade(seg(p,.5,.65),T(e2,600,360,{size:54})+highlight(600-w2/2-24,272,w2+48,170,1));
  return s;
 },
 [K+'anti']:(p)=>{
  let s=card(200,70,800,170,L('積分・上級',600,115,{color:C.dim})+T('\\int '+cX('s')+'^{-2}\\,ds=-\\dfrac{1}{'+cX('s')+'}',600,190,{size:48}),seg(p,.02,.12));
  s+=fade(seg(p,.45,.6),T('\\dfrac{d}{d'+cX('s')+'}\\Big(-\\dfrac{1}{'+cX('s')+'}\\Big)=\\dfrac{1}{'+cX('s')+'^2}',600,370,{size:48})+label('✓',890,380,{size:40,color:ok,weight:700}));
  return s;
 },
 [K+'eval']:(p)=>{
  let s=T(GMm+'\\Big[-\\dfrac{1}{'+cX('s')+'}\\Big]_{'+cX('b')+'}^{'+cX('r')+'}',600,95,{size:48});
  s+=fade(seg(p,.15,.3),label('上端 r の 値 − 下端 b の 値',600,195,{size:28,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.3,.45),T('='+GMm+'\\Big(-\\dfrac{1}{'+cX('r')+'}+\\dfrac{1}{'+cX('b')+'}\\Big)',600,290,{size:48}));
  const e='=-\\dfrac{'+GMm+'}{'+cX('r')+'}+\\dfrac{'+GMm+'}{'+cX('b')+'}',w=texWidth(e,50,false);
  s+=fade(seg(p,.6,.75),T(e,600,420,{size:50}));
  return s;
 },
 [K+'lim']:(p)=>{
  const e=cU('U(r)')+'=-\\dfrac{'+GMm+'}{'+cX('r')+'}+\\dfrac{'+GMm+'}{'+cX('b')+'}',w=texWidth(e,52,false),x0=600-w/2;
  let s=T(e,600,100,{size:52});
  const tx=x0+w*0.80;
  s+=fade(seg(p,.1,.25),label('b → ∞ で 0 へ',tx+40,190,{size:28,color:bad,anchor:'middle',weight:700}));
  s+=strike(x0+w*0.66,135,x0+w*0.99,62,seg(p,.25,.4));
  const e2=cU('U(r)')+'=-\\dfrac{'+GMm+'}{'+cX('r')+'}',w2=texWidth(e2,62,false);
  s+=fade(seg(p,.45,.6),T(e2,600,340,{size:62})+highlight(600-w2/2-28,250,w2+56,170,1));
  s+=fade(seg(p,.65,.8),label('基準：U(∞) ＝ 0',600,475,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'sign']:(p)=>{
  let s=radial({x2:640,label_:0});
  const X=mix(620,430,seg(p,.1,.7));
  s+=body(X,300,{F:1,len:70});
  s+=fade(seg(p,.2,.35),arrow(600,230,360,230,{color:C.x,w:4,head:14})+label('一歩：内向き',480,210,{size:24,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.35,.5),label('力：内向き',X-30,370,{size:24,color:ok,anchor:'middle',weight:700}));
  s+=card(720,110,440,280,L('向きが 同じ',940,165,{color:C.dim})
   +fade(seg(p,.5,.65),label('仕事 ＞ 0',940,260,{size:44,color:ok,anchor:'middle',weight:700}))
   +fade(seg(p,.65,.8),label('（遠くから r まで）',940,330,{size:26,color:C.dim,anchor:'middle'})),seg(p,.02,.12));
  return s;
 },
 [K+'sign2']:(p)=>{
  // vertical energy scale
  const x=300,y0=150,dy=230;
  let s=line(x-120,y0,x+120,y0,{color:C.dim,w:3})+label('0（無限遠）',x+135,y0+8,{size:26,color:C.dim});
  s+=dot(x,y0,9,C.E);
  const yy=mix(y0,y0+dy,seg(p,.15,.45));
  s+=fade(seg(p,.1,.2),arrow(x,y0,x,yy,{color:C.E,w:6,head:16}));
  s+=fade(seg(p,.45,.6),line(x-120,y0+dy,x+120,y0+dy,{color:C.E,w:3,dash:'8 6'})+label('U(r) ＜ 0',x+135,y0+dy+8,{size:28,color:C.E,weight:700})+label('仕事の 分 だけ 下がる',x+24,y0+dy/2+8,{size:24,color:C.dim}));
  s+=card(700,110,460,280,L('U は 負',930,180,{size:36,color:C.E,weight:700})
   +fade(seg(p,.6,.75),label('＝ 無限遠より 低い',930,270,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,.4,.5));
  return s;
 },
 [K+'graph']:(p)=>{
  const A=GU();let s=ugraph(A,{p:seg(p,.05,.4)});
  [[1,'−1'],[2,'−½'],[4,'−¼']].forEach(([u,t],i)=>{const g=seg(p,.4+i*.12,.5+i*.12);s+=fade(g,dot(A.X(u),A.Y(-1/u),9,C.E)+line(A.X(u),A.Y(0),A.X(u),A.Y(-1/u),{color:C.faint,w:2,dash:'5 5'})+label(t,A.X(u)+14,A.Y(-1/u)+30,{size:24,color:C.E,weight:700}));});
  s+=card(720,110,440,290,L('U ＝ −GMm/r',940,165,{size:32,color:C.E,weight:700})
   +label('下から 0 へ 近づく',940,235,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.6,.75),label('r が 2倍 → U は 半分',940,310,{size:30,color:C.hi,anchor:'middle',weight:700})+label('（単位 GMm/R）',940,360,{size:24,color:C.dim,anchor:'middle'})),seg(p,.02,.12));
  return s;
 },
 [K+'refch']:(p)=>{
  const A=GU({ymax:1.1,ymin:-1.2,h:440});
  let s=ugraph(A,{inside:0,below:1,ytop:1.1});
  s+=fade(seg(p,.1,.3),A.plot(r=>1-1/r,{from:1,to:6,color:C.hi,w:4,dash:'10 7'})+label('地表を 0',A.X(5.2),A.Y(1-1/5.2)-16,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=label('無限遠を 0',A.X(5.2),A.Y(-1/5.2)+36,{size:24,color:C.E,anchor:'middle',weight:700});
  // same difference between r=1.5 and r=3
  const d=(y1,y2,x,col)=>line(x,A.Y(y1),x,A.Y(y2),{color:col,w:6});
  s+=fade(seg(p,.45,.6),d(-1/1.5,-1/3,A.X(3)+18,C.E)+d(1-1/1.5,1-1/3,A.X(3)+18,C.hi)
   +line(A.X(1.5),A.Y(-1/1.5),A.X(3)+18,A.Y(-1/1.5),{color:C.faint,w:2,dash:'4 5'})+line(A.X(1.5),A.Y(1-1/1.5),A.X(3)+18,A.Y(1-1/1.5),{color:C.faint,w:2,dash:'4 5'}));
  s+=card(720,120,440,260,L('0 の 基準は 約束',940,180,{size:30,color:C.ink,weight:700})
   +fade(seg(p,.55,.7),label('2点の 差は 同じ',940,270,{size:34,color:ok,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 // ===== S3 地表の近くでは mgh =====
 [K+'q']:(p)=>{
  // big Earth surface arc
  const cx=330,cy=1500,R=1060;
  let s=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="${EARTH}" fill-opacity=".45" stroke="#6f9fe0" stroke-width="2"/>`;
  const yS=cy-R,yH=yS-170;
  s+=dot(cx,yS,7,C.ink)+fade(seg(p,.25,.4),dot(cx,yH,12,C.ink)+line(cx+40,yS,cx+40,yH,{color:C.x,w:4})+label('h',cx+56,(yS+yH)/2+8,{size:30,color:C.x,weight:700}));
  s+=label('地表 r ＝ R',cx-30,yS+40,{size:26,color:C.x,anchor:'end'});
  s+=card(660,90,500,320,L('mgh と 食い違わない？',910,145,{size:30,color:C.hi,weight:700})
   +fade(seg(p,.45,.6),T(cU('U(R+h)')+'-'+cU('U(R)')+'=\\ ?',910,250,{size:42}))
   +fade(seg(p,.6,.75),label('高さ h だけ 上がったときの 差',910,340,{size:26,color:C.dim,anchor:'middle'})),seg(p,.02,.12));
  return s;
 },
 [K+'diff']:(p)=>{
  let s=T(cU('U(R+h)')+'-'+cU('U(R)'),600,110,{size:50});
  const e='=-\\dfrac{'+GMm+'}{R+'+cX('h')+'}+\\dfrac{'+GMm+'}{R}',w=texWidth(e,56,false);
  s+=fade(seg(p,.2,.4),T(e,600,300,{size:56})+highlight(600-w/2-24,205,w+48,180,seg(p,.4,.55)));
  s+=fade(seg(p,.55,.7),label('U ＝ −GMm/r に r ＝ R＋h と r ＝ R を 入れた',600,460,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'factor']:(p)=>{
  let s=T('R+'+cX('h')+'=R\\Big(1+\\dfrac{'+cX('h')+'}{R}\\Big)',600,110,{size:50});
  s+=fade(seg(p,.25,.4),label('逆数を とる',600,220,{size:28,color:C.dim,anchor:'middle'}));
  const e='\\dfrac{1}{R+'+cX('h')+'}=\\dfrac{1}{R}\\Big(1+\\dfrac{'+cX('h')+'}{R}\\Big)^{-1}',w=texWidth(e,54,false);
  s+=fade(seg(p,.4,.55),T(e,600,350,{size:54})+highlight(600-w/2-24,258,w+48,180,1));
  return s;
 },
 [K+'approx']:(p)=>{
  let s=card(150,50,900,130,L('近似・上級 1/2',600,90,{size:24,color:C.dim})+T('(1+x)^n\\approx 1+nx',600,145,{size:44,auto:false}),seg(p,.02,.12));
  s+=fade(seg(p,.2,.35),label('n ＝ −1、x ＝ h/R',600,245,{size:32,color:C.hi,anchor:'middle',weight:700}));
  const e='\\Big(1+\\dfrac{'+cX('h')+'}{R}\\Big)^{-1}\\approx 1-\\dfrac{'+cX('h')+'}{R}',w=texWidth(e,54,false);
  s+=fade(seg(p,.4,.55),T(e,600,360,{size:54})+highlight(600-w/2-24,280,w+48,160,1));
  s+=fade(seg(p,.65,.8),label('h ≪ R の とき',1000,470,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'open']:(p)=>{
  let s=T('-\\dfrac{'+GMm+'}{R}\\Big(1-\\dfrac{'+cX('h')+'}{R}\\Big)+\\dfrac{'+GMm+'}{R}',600,110,{size:50});
  s+=fade(seg(p,.3,.45),label('かっこを 開く',600,225,{size:28,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),T('=-\\dfrac{'+GMm+'}{R}+\\dfrac{'+GMm+cX('h')+'}{R^2}+\\dfrac{'+GMm+'}{R}',600,350,{size:54}));
  return s;
 },
 [K+'cancel']:(p)=>{
  const e='-\\dfrac{'+GMm+'}{R}+\\dfrac{'+GMm+cX('h')+'}{R^2}+\\dfrac{'+GMm+'}{R}',w=texWidth(e,54,false),x0=600-w/2;
  let s=T(e,600,110,{size:54});
  s+=strike(x0-4,145,x0+w*0.30,70,seg(p,.1,.25))+strike(x0+w*0.70,145,x0+w+4,70,seg(p,.25,.4));
  s+=fade(seg(p,.2,.35),label('打ち消す',600,215,{size:28,color:bad,anchor:'middle',weight:700}));
  const e2='='+cU('\\dfrac{'+GMm+cX('h')+'}{R^2}'),w2=texWidth(e2,62,false);
  s+=fade(seg(p,.5,.65),T(e2,600,360,{size:62})+highlight(600-w2/2-28,265,w2+56,180,1));
  return s;
 },
 [K+'mg']:(p)=>{
  let s=card(160,30,880,180,L('地表の 重力（中級）',600,70,{size:24,color:C.dim})+T('m'+cc(C.a,'g')+'=\\dfrac{'+GMm+'}{R^2}',600,150,{size:44}),seg(p,.02,.12));
  s+=fade(seg(p,.3,.45),T('\\dfrac{'+GMm+cX('h')+'}{R^2}=\\dfrac{'+GMm+'}{R^2}\\times'+cX('h'),600,315,{size:50}));
  const e='=m'+cc(C.a,'g')+cX('h'),w=texWidth(e,62,false);
  s+=fade(seg(p,.55,.7),T(e,600,450,{size:62})+label('✓ 中級の mgh',840,460,{size:30,color:ok,weight:700}));
  return s;
 },
 [K+'tangent']:(p)=>{
  const A=axes({x:90,y:470,w:560,h:420,xmin:0.6,xmax:3.2,ymin:-1.15,ymax:0.6,xticks:[],yticks:[],grid:false});
  let s=A.svg+A.plot(Uf,{from:1,to:3.2,color:C.E,w:5});
  s+=[1,2,3].map(u=>line(A.X(u),A.Y(0)-6,A.X(u),A.Y(0)+6,{color:C.dim})+label(u===1?'R':u+'R',A.X(u),A.Y(0)-14,{size:22,color:C.x,anchor:'middle'})).join('');
  s+=label('U',A.X(0.6)+14,A.Y(0.6)-8,{size:28,color:C.E,weight:700});
  s+=fade(seg(p,.1,.3),A.plot(r=>-1+(r-1),{from:0.85,to:1.75,color:C.hi,w:4,dash:'10 7'})+label('mgh の 直線（接線）',A.X(1.75)+10,A.Y(-0.12)+8,{size:24,color:C.hi,weight:700}));
  s+=dot(A.X(1),A.Y(-1),9,C.E)+label('地表',A.X(1)+14,A.Y(-1)+30,{size:24,color:C.x});
  s+=fade(seg(p,.25,.4),line(A.X(1.5),A.Y(-1/1.5),A.X(1.5),A.Y(-0.5),{color:bad,w:5})+label('h が 大きいと ずれる',A.X(1.5)+10,A.Y(-0.85),{size:22,color:bad,weight:700}));
  s+=card(720,60,440,400,L('高さ 400 km',940,110,{size:28,weight:700})
   +fade(seg(p,.45,.6),label('mgh ÷ 本当の 差',940,170,{size:26,color:C.ink,anchor:'middle'})+T('=\\dfrac{R+'+cX('h')+'}{R}',940,250,{size:38}))
   +fade(seg(p,.6,.75),label('6770 ÷ 6370 ≈ 1.06',940,345,{size:28,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.7,.85),label('mgh が 約 6% 大きい',940,415,{size:30,color:bad,anchor:'middle',weight:700})),seg(p,.4,.5));
  return s;
 },
 // ===== S4 保存則を証明する =====
 [K+'ke']:(p)=>{
  const rows=[['m'+cc(C.a,'a')+'='+cF('F'),'運動方程式（法則）'],['\\Delta '+cK('K')+'=W','仕事・上級で 導いた']];
  let s='';
  rows.forEach(([t,n],i)=>{const y=80+i*190;s+=card(200,y,800,140,T(t,450,y+80,{size:50})+label(n,700,y+82,{size:28,color:C.dim}),seg(p,.05+i*.3,.15+i*.3));});
  s+=fade(seg(p,.3,.4),arrow(450,225,450,265,{color:C.hi,w:4,head:12})+label('v を 掛けて 積分',480,252,{size:24,color:C.hi}));
  s+=fade(seg(p,.6,.75),label('W は 合力の 仕事',600,480,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'cons']:(p)=>{
  let s=card(200,60,800,150,L('U の 定義（保存力）',600,105,{size:24,color:C.dim})+label('U の 増えた 分 ＝ −（保存力の 仕事）',600,170,{size:30,color:C.E,anchor:'middle',weight:700}),seg(p,.02,.12));
  s+=fade(seg(p,.3,.45),label('力が 保存力 だけ なら',600,270,{size:28,color:C.dim,anchor:'middle'}));
  const e='W=-\\Delta '+cU('U'),w=texWidth(e,62,false);
  s+=fade(seg(p,.45,.6),T(e,600,390,{size:62})+highlight(600-w/2-28,300,w+56,170,1));
  return s;
 },
 [K+'move']:(p)=>{
  let s=T('\\Delta '+cK('K')+'=W',600,85,{size:48});
  s+=fade(seg(p,.1,.25),T('\\Delta '+cK('K')+'=-\\Delta '+cU('U'),600,205,{size:52})+label('W ＝ −ΔU を 代入',900,215,{size:24,color:C.hi}));
  s+=fade(seg(p,.4,.55),label('−ΔU を 左辺へ',600,295,{size:26,color:C.dim,anchor:'middle'}));
  const e='\\Delta '+cK('K')+'+\\Delta '+cU('U')+'=0',w=texWidth(e,58,false);
  s+=fade(seg(p,.55,.7),T(e,600,410,{size:58})+highlight(600-w/2-24,330,w+48,150,1));
  return s;
 },
 [K+'thm']:(p)=>{
  let s=(()=>{const e='\\Delta('+cK('K')+'+'+cU('U')+')=0\\quad\\Rightarrow\\quad '+cK('K')+'+'+cU('U'),w=texWidth(e,44,false);return T(e,520,80,{size:44})+label('＝ 一定',520+w/2+14,90,{size:32,color:C.ink,weight:700});})();
  const rows=[['法則','ma ＝ F',C.dim],['導いた','ΔK ＝ W',C.dim],['定義','W ＝ −ΔU（保存力）',C.dim],['定理','K ＋ U ＝ 一定',ok]];
  rows.forEach(([a,b,col],i)=>{const y=150+i*88;s+=card(250,y,700,76,label(a,290,y+50,{size:28,color:i===3?ok:C.hi,weight:700})+label(b,910,y+50,{size:30,color:i===3?ok:C.ink,anchor:'end',weight:i===3?700:400}),seg(p,.2+i*.15,.3+i*.15));});
  return s;
 },
 [K+'dt']:(p)=>{
  let s=label('1本の 直線上',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=T(cK('K')+'=\\tfrac12 m'+cV('v')+'^2',600,160,{size:48});
  s+=fade(seg(p,.25,.4),label('仕事・上級 1/3',600,245,{size:26,color:C.dim,anchor:'middle'}));
  const e='\\dfrac{d'+cK('K')+'}{d'+cT('t')+'}='+cF('F')+cV('v'),w=texWidth(e,58,false);
  s+=fade(seg(p,.4,.55),T(e,600,370,{size:58})+highlight(600-w/2-24,285,w+48,160,1));
  return s;
 },
 [K+'chain']:(p)=>{
  let s=label('U は 位置 x を 通して 時刻に よる',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.15,.3),T('\\dfrac{d'+cU('U')+'}{d'+cT('t')+'}=\\dfrac{d'+cU('U')+'}{d'+cX('x')+'}\\times\\dfrac{d'+cX('x')+'}{d'+cT('t')+'}',600,190,{size:52})+label('連鎖律',1010,200,{size:26,color:C.hi,weight:700}));
  const e='=\\dfrac{d'+cU('U')+'}{d'+cX('x')+'}\\,'+cV('v'),w=texWidth(e,56,false);
  s+=fade(seg(p,.55,.7),T(e,600,360,{size:56})+highlight(600-w/2-24,270,w+48,170,1));
  return s;
 },
 [K+'add']:(p)=>{
  let s=T('\\dfrac{d('+cK('K')+'+'+cU('U')+')}{d'+cT('t')+'}='+cF('F')+cV('v')+'+\\dfrac{d'+cU('U')+'}{d'+cX('x')+'}'+cV('v'),600,95,{size:48});
  s+=fade(seg(p,.2,.35),T('=\\Big('+cF('F')+'+\\dfrac{d'+cU('U')+'}{d'+cX('x')+'}\\Big)'+cV('v'),600,235,{size:50}));
  s+=fade(seg(p,.45,.6),label('F ＝ −dU/dx',380,360,{size:30,color:ok,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),T('=\\big(0\\big)\\,'+cV('v')+'=0',700,370,{size:56})+label('✓',900,380,{size:44,color:ok,weight:700}));
  return s;
 },
 [K+'time']:(p)=>{
  let s=card(150,25,900,205,L('U が 時刻 t にも よると',600,65,{size:28,color:C.dim})
   +T('\\dfrac{d'+cU('U')+'}{d'+cT('t')+'}=\\dfrac{\\partial '+cU('U')+'}{\\partial '+cX('x')+'}'+cV('v')+'+\\dfrac{\\partial '+cU('U')+'}{\\partial '+cT('t')+'}',600,160,{size:44}),seg(p,.02,.12));
  s+=fade(seg(p,.25,.4),label('∂U/∂t：時刻 だけで 微分',600,275,{size:28,color:C.t,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),T('\\dfrac{d('+cK('K')+'+'+cU('U')+')}{d'+cT('t')+'}=\\dfrac{\\partial '+cU('U')+'}{\\partial '+cT('t')+'}',600,370,{size:50}));
  s+=fade(seg(p,.65,.8),label('→ 一定 とは 限らない（外から 出入り）',600,470,{size:28,color:bad,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S5 脱出速度と次の問い =====
 [K+'esc']:(p)=>{
  let s=radial({x2:900,label_:0,cx:170,cy:300,R:90});
  const X=mix(275,860,seg(p,.1,.8));
  s+=body(X,300,{tag:'m'});
  s+=fade(seg(p,.05,.2),arrow(285,250,420,250,{color:C.v,w:5,head:14})+label('v（真上へ）',350,225,{size:26,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('二度と 戻らない',800,400,{size:30,color:C.hi,anchor:'middle',weight:700})+label('最小の v は？',800,450,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'esc2']:(p)=>{
  const A=GU();let s=ugraph(A);
  s+=fade(seg(p,.1,.25),line(A.X(0.1),A.Y(0),A.X(6),A.Y(0),{color:C.hi,w:4,dash:'10 7'})+label('K＋U ＝ 0',A.X(4.6),A.Y(0)+34,{size:24,color:C.hi,weight:700}));
  s+=fade(seg(p,.3,.45),line(A.X(1)+10,A.Y(-1),A.X(1)+10,A.Y(0),{color:CK,w:7})+label('K',A.X(1)+24,A.Y(-0.5),{size:26,color:CK,weight:700}));
  s+=card(720,100,440,320,L('無限遠：K ＝ 0、U ＝ 0',940,150,{size:26,color:C.dim})
   +fade(seg(p,.4,.55),label('地表 r ＝ R でも',940,225,{size:26,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.5,.65),T('\\tfrac12 m'+cV('v')+'^2-\\dfrac{'+GMm+'}{R}=0',940,320,{size:40})),seg(p,.02,.12));
  return s;
 },
 [K+'esc3']:(p)=>{
  let s=T(cV('v')+'^2=\\dfrac{2GM}{R}',360,110,{size:52});
  s+=fade(seg(p,.25,.4),label('GM ＝ gR²（中級）',820,120,{size:30,color:C.hi,anchor:'middle',weight:700}));
  const e=cV('v')+'=\\sqrt{2'+cc(C.a,'g')+'R}',w=texWidth(e,64,false);
  s+=fade(seg(p,.45,.6),T(e,600,300,{size:64})+highlight(600-w/2-28,210,w+56,170,1));
  s+=fade(seg(p,.65,.8),label('質量 m は 消えた',600,450,{size:30,color:ok,anchor:'middle',weight:700}));
  return s;
 },
 [K+'esc4']:(p)=>{
  let s=label('g ＝ 9.8 m/s²、R ＝ 6.37×10⁶ m',600,70,{size:30,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.1,.25),T('2'+cc(C.a,'g')+'R=2\\times9.8\\times6.37\\times10^6\\approx1.25\\times10^8\\ \\mathrm{m^2/s^2}',600,175,{size:40}));
  s+=fade(seg(p,.4,.55),T(cV('v')+'\\approx1.12\\times10^4\\ \\mathrm{m/s}',600,300,{size:50}));
  s+=fade(seg(p,.6,.75),T('\\approx'+cV('11.2\\ \\mathrm{km/s}'),600,420,{size:58}));
  return s;
 },
 [K+'sum']:(p)=>{
  const A=GU({x:80,w:460});let s=ugraph(A,{ticks:1});
  s+=card(620,80,540,350,L('無限遠を 0 に すると',890,130,{size:26,color:C.dim})
   +T(cU('U')+'=-\\dfrac{'+GMm+'}{'+cX('r')+'}',890,215,{size:50})
   +fade(seg(p,.3,.45),label('負 ＝ 無限遠より 低い',890,305,{size:30,color:C.E,anchor:'middle',weight:700}))
   +fade(seg(p,.55,.7),label('地表近くの 差 → mgh',890,375,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.02,.12),ok);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(150,70,900,130,L('保存力 だけ',330,145,{size:30,color:C.dim,anchor:'start'})+T(cK('K')+'+'+cU('U'),640,138,{size:50})+label('＝ 一定',640+texWidth(cK('K')+'+'+cU('U'),50,false)/2+16,152,{size:40,color:C.ink,weight:700}),seg(p,.02,.12),ok);
  s+=fade(seg(p,.25,.4),label('運動方程式から 導いた 定理',600,280,{size:34,color:ok,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('摩擦が 仕事を すると 成り立たない',600,380,{size:32,color:bad,anchor:'middle',weight:700}));
  return s;
 },
 [K+'short']:(p)=>{
  const A=GU();let s=ugraph(A);
  const E=-0.5;
  s+=fade(seg(p,.05,.2),line(A.X(1),A.Y(E),A.X(6),A.Y(E),{color:C.hi,w:4,dash:'10 7'})+label('K＋U（負）',A.X(4.3),A.Y(E)-14,{size:24,color:C.hi,weight:700}));
  const u=seg(p,.25,.85),r=u<.5?mix(1,2,Math.sin(u*Math.PI)):mix(1,2,Math.sin(u*Math.PI));
  s+=fade(seg(p,.2,.3),dot(A.X(r),A.Y(Uf(r)),11,C.ink));
  s+=fade(seg(p,.5,.65),dot(A.X(2),A.Y(E),8,C.hi)+label('止まって 戻る',A.X(2)+14,A.Y(E)+34,{size:24,color:C.hi,weight:700}));
  s+=card(720,120,440,260,L('速さが 足りない',940,180,{size:30,weight:700})
   +fade(seg(p,.3,.45),label('K＋U ＜ 0',940,260,{size:36,color:C.hi,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),label('どこかで 戻ってくる',940,330,{size:28,color:C.ink,anchor:'middle'})),seg(p,.02,.12));
  return s;
 },
 [K+'next']:(p)=>{
  const A=GU();let s=ugraph(A);
  const E=-0.5;
  s+=line(A.X(1),A.Y(E),A.X(6),A.Y(E),{color:C.hi,w:4,dash:'10 7'})+label('E',A.X(6)+14,A.Y(E)+8,{size:28,color:C.hi,weight:700});
  s+=fade(seg(p,.2,.4),rect(A.X(1),A.Y(E),A.X(2)-A.X(1),8,{fill:C.hi,fo:.6,stroke:'none'}));
  s+=card(720,90,440,330,L('次の 問い',940,140,{size:26,color:C.dim})
   +label('U の グラフ ＋ E の 横線',940,210,{size:28,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.3,.45),label('動ける 範囲は？',940,290,{size:32,color:C.hi,anchor:'middle',weight:700}))
   +fade(seg(p,.45,.6),label('折り返す 点は？',940,360,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,.02,.12),C.hi);
  return s;
 },
};

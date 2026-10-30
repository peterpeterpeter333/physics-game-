// 問題編 解説「引き返す点を見つける」（q-um-average-rate、大学 01 微分・中級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/01_微分.md の q-um-average-rate（解説 20 行）。
// 画面：小問1 は式と正方形の図（式が主役）。小問2・3・まとめは左に「数直線（上の帯）・x–t グラフ・dx/dt のグラフ」、右に式と札。
// 札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 色：位置 x 水色、速度 v（dx/dt・接線）紫、時刻 t 金、幅 h 黄、誤り 赤。正方形の図：t² 水色、帯 th 黄、角 h² 赤。
import {C,seg,fade,label,line,rect,dot,ring,arrow,tex,texWidth,highlight,axes,draw,mix,clamp} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,sentWin,QC} from './yt1-qx-common.mjs';

const K='qx-um-average-rate:';
const Hc=`{\\color{${C.hi}}h}`;
const RED=QC.bad;
const fx=t=>t*t-4*t,vx=t=>2*t-4;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,...o});
const G1='差商を約分した式',G2='t＝1 s の dx/dt と動く向き',G3='h＝±0.1 の差商と、近づく値';
const ANS1=g=>answerTag(1,'D',{tex:'2t-4+h'},{g}),ANS2=g=>answerTag(2,'A','−2 m/s、左向き',{g}),ANS3=g=>answerTag(3,'B','近づく値 −2',{g});
const WR={x:610,w:580,size:26,whySize:22};       // 右の列の誤答カード
const WF={x:200,w:800,size:28,whySize:24};       // 式の画面の誤答カード（中央）
const DQ=`\\dfrac{(t+${Hc})^2-4(t+${Hc})-(t^2-4t)}{${Hc}}`;
const NUM=`(t+${Hc})^2-4(t+${Hc})-(t^2-4t)`;
const vC=s=>`{\\color{${C.v}}${s}}`;
const DXDT=vC('\\dfrac{dx}{dt}');
function clauseWin(ctx,i){
 const W=sentWin(ctx),[a,b]=W[Math.min(i,W.length-1)];
 const r=((ctx?.cue?.reading??'').split('。').map(x=>x.replace(/\s/g,'')).filter(Boolean)[i])??'';
 const parts=r.split('、').filter(Boolean);if(parts.length<2)return [[a,b]];
 const tot=parts.reduce((s,x)=>s+x.length,0);let acc=0;
 return parts.map(x=>{const s0=a+(b-a)*acc/tot;acc+=x.length;return [s0,a+(b-a)*acc/tot];});
}
const s2=(ctx,d=.45)=>{const W=sentWin(ctx);return W[1]?W[1][0]:d;};

// ---- 数直線（右向きが正）----
const NY=115;
function numberLine(xp,{x0=70,x1=530,y=NY,g=1,vmin=-5,vmax=2,dot0=1,labels=[-4,-2,0,2]}={}){
 const X=v=>x0+(x1-x0)*(v-vmin)/(vmax-vmin);
 let s=arrow(x0-10,y,x1+28,y,{color:C.x,w:3,head:14})+label('x [m]',x1+34,y+8,{size:22,color:C.x});
 for(let v=Math.ceil(vmin);v<=vmax;v++)s+=line(X(v),y-7,X(v),y+7,{color:C.dim,w:2});
 for(const v of labels)s+=label(v<0?`−${-v}`:String(v),X(v),y+32,{size:20,color:C.dim,anchor:'middle'});
 if(dot0&&xp!=null)s+=dot(X(xp),y,11,C.x)+ring(X(xp),y,11,{color:C.ink,w:2});
 return {X,svg:fade(g,s)};
}
// ---- 上の x–t グラフ、下の dx/dt グラフ ----
function upperG({g=1,curve=1,x=80,y=330,w=440,h=150,ticks=true}={}){
 const A=axes({x,y,w,h,xmin:0,xmax:4.4,ymin:-5,ymax:1.5,xticks:ticks?[1,2,3,4]:[],yticks:ticks?[-4,-2]:[],xlabel:'t [s]',ylabel:'',xcolor:C.t,g});
 let s=A.svg+fade(g,label('x [m]',A.X(0)+12,y-h-12,{size:22,color:C.x}));
 if(curve)s+=A.plot(fx,{from:0,to:4.35,p:curve,color:C.x,w:4});
 return {A,svg:s};
}
function lowerG({g=1,curve=1,x=80,y=495,w=440,h=140}={}){
 const B=axes({x,y,w,h,xmin:0,xmax:4.4,ymin:-5,ymax:5,xticks:[1,2,3,4],yticks:[-4,4],xlabel:'t [s]',ylabel:'',xcolor:C.t,g});
 let s=B.svg+fade(g,label('dx/dt [m/s]',B.X(0)+12,y-h-12,{size:22,color:C.v}));
 if(curve)s+=B.plot(vx,{from:0,to:4.4,p:curve,color:C.v,w:4});
 return {B,svg:s};
}
const tanAt=(A,t,half=.7,o={})=>line(A.X(t-half),A.Y(fx(t)-vx(t)*half),A.X(t+half),A.Y(fx(t)+vx(t)*half),{color:C.v,w:4,...o});
// 左の3段（数直線・x–t・dx/dt）
function stack({xp=-3,nl=1,ug=1,lg=1,uCurve=1,lCurve=1}={}){
 const N=numberLine(xp,{g:nl}),U=upperG({g:ug,curve:uCurve}),L=lowerG({g:lg,curve:lCurve});
 return {N,A:U.A,B:L.B,svg:N.svg+U.svg+L.svg};
}
// ---- 小問3 の拡大グラフ（t＝0.6〜1.4）----
function zoomG({x=80,y=470,w=440,h=320,g=1}={}){
 const tmin=.6,tmax=1.4,xmin=-3.8,xmax=-1.9;
 const X=t=>x+w*(t-tmin)/(tmax-tmin),Y=v=>y-h*(v-xmin)/(xmax-xmin);
 let s=rect(x,y-h,w,h,{fill:'none',fo:0,stroke:C.faint,sw:2,rx:0});
 for(const t of [.8,1,1.2])s+=line(X(t),y-6,X(t),y+6,{color:C.dim,w:2})+label(String(t),X(t),y+30,{size:21,color:C.t,anchor:'middle'});
 for(const v of [-3.5,-3,-2.5,-2])s+=line(x-6,Y(v),x+6,Y(v),{color:C.dim,w:2})+label(`−${-v}`,x-12,Y(v)+7,{size:20,color:C.dim,anchor:'end'});
 s+=label('t [s]',x+w+12,y+8,{size:22,color:C.t})+label('x [m]',x+6,y-h-12,{size:22,color:C.x});
 s+=draw(Array.from({length:81},(_,i)=>{const t=tmin+(tmax-tmin)*i/80;return [X(t),Y(fx(t))];}),1,{color:C.x,w:4});
 const tanZ=(half=.38,o={})=>line(X(1-half),Y(fx(1)-2*-half),X(1+half),Y(fx(1)+(-2)*half),{color:C.v,w:3,...o});
 return {X,Y,tanZ,svg:fade(g,s+label('t＝1 の 付近を 拡大',x+w-10,y-h+30,{size:22,color:C.dim,anchor:'end'}))};
}
const chordZ=(Z,t1,t2,ext=.08,o={})=>{const k=(fx(t2)-fx(t1))/(t2-t1),a=Math.min(t1,t2)-ext,b=Math.max(t1,t2)+ext;return line(Z.X(a),Z.Y(fx(t1)+k*(a-t1)),Z.X(b),Z.Y(fx(t1)+k*(b-t1)),{w:4,...o});};

// ---- 出題中の図 ----
function setupFig({g=1,eq=1,nl=1,ax=1,tm=1,hm=1,glow=0}={}){
 let s=fade(eq,T('x=t^2-4t',40,135,46,{anchor:'start'})+label('差商',40,212,{size:24,color:C.dim})+T(DQ,40,280,32,{anchor:'start'}));
 // 数直線（上の帯・右）
 const X=v=>600+560*(v+5)/7;
 let n=arrow(590,130,1172,130,{color:C.x,w:3,head:14})+label('x',1150,104,{size:24,color:C.x,weight:700})+label('＋ の向き →',1060,104,{size:20,color:C.dim,anchor:'end'});
 for(let v=-5;v<=2;v++)n+=line(X(v),123,X(v),137,{color:C.dim,w:2});
 for(const v of [-4,-2,0,2])n+=label(v<0?`−${-v}`:String(v),X(v),162,{size:20,color:C.dim,anchor:'middle'});
 n+=dot(X(0),130,11,C.x)+ring(X(0),130,11,{color:C.ink,w:2});
 s+=fade(nl,n);
 // 目盛りだけの x–t 座標
 const A=axes({x:720,y:490,w:370,h:250,xmin:0,xmax:4.4,ymin:-5,ymax:1.5,xticks:[1,2,3,4],yticks:[-4,-2],xlabel:'t [s]',ylabel:'',xcolor:C.t,g:ax});
 s+=A.svg+fade(ax,label('x [m]',A.X(0)+12,240-12,{size:22,color:C.x}));
 const oy=A.Y(0);
 const mk=(t,txt,gg,col=C.t,dy=-16,anc='middle')=>fade(gg,line(A.X(t),oy-9,A.X(t),oy+9,{color:col,w:3})+label(txt,A.X(t),oy+dy,{size:22,color:col,anchor:anc,weight:700}));
 s+=mk(2.5,'t',tm)+mk(3.4,'t＋h',tm);
 if(glow)s+=fade(glow,rect(A.X(2.5),oy-8,A.X(3.4)-A.X(2.5),16,{fill:C.hi,fo:.45,stroke:C.hi,rx:3})+label('h',(A.X(2.5)+A.X(3.4))/2,oy-36,{size:26,color:C.hi,anchor:'middle',weight:700})
  +ring(A.X(2.5),oy-24,22,{color:C.t,w:2})+ring(A.X(3.4),oy-24,30,{color:C.t,w:2}));
 s+=fade(hm,line(A.X(.9),oy-9,A.X(.9),oy+9,{color:C.t,w:3})+line(A.X(1.1),oy-9,A.X(1.1),oy+9,{color:C.t,w:3})
  +label('h＝−0.1',A.X(.9)-6,oy-18,{size:22,color:C.hi,anchor:'end',weight:700})+label('h＝0.1',A.X(1.1)+6,oy-18,{size:22,color:C.hi,anchor:'start',weight:700}));
 return fade(g,s);
}

// 正方形の図（t² 水色、帯 th 黄、角 h² 赤）
function square({x0=780,y0=110,u=200,hh=80,g1=1,g2=1,g3=1}={}){
 let s=rect(x0,y0+hh,u,u,{fill:C.x,fo:.25,stroke:C.x,rx:0})+label('t²',x0+u/2,y0+hh+u/2+12,{size:34,color:C.x,anchor:'middle',weight:700});
 s+=label('t',x0+u/2,y0+hh+u+34,{size:26,color:C.t,anchor:'middle'})+label('t',x0-16,y0+hh+u/2+8,{size:26,color:C.t,anchor:'end'});
 s+=fade(g1,rect(x0+u,y0+hh,hh,u,{fill:C.hi,fo:.3,stroke:C.hi,rx:0})+rect(x0,y0,u,hh,{fill:C.hi,fo:.3,stroke:C.hi,rx:0})
  +label('th',x0+u+hh/2,y0+hh+u/2+10,{size:28,color:C.hi,anchor:'middle',weight:700})+label('th',x0+u/2,y0+hh/2+10,{size:28,color:C.hi,anchor:'middle',weight:700})
  +label('h',x0+u+hh/2,y0+hh+u+34,{size:26,color:C.hi,anchor:'middle'})+label('h',x0-16,y0+hh/2+8,{size:26,color:C.hi,anchor:'end'}));
 s+=fade(g2,rect(x0+u,y0,hh,hh,{fill:C.a,fo:.35,stroke:C.a,rx:0})+label('h²',x0+u+hh/2,y0+hh/2+10,{size:28,color:C.a,anchor:'middle',weight:700}));
 return s;
}
const SQEXP=`(t+${Hc})^2={\\color{${C.x}}t^2}+{\\color{${C.hi}}2th}+{\\color{${C.a}}h^2}`;
const cancelR=s=>`{\\color{${RED}}\\cancel{\\color{${C.ink}}${s}}}`;
// 分子を1行に並べた式（打ち消し線と −4h の枠を段階で）
function numLine(k=0,box=0){
 const a=k?cancelR('t^2'):'t^2',b=k?cancelR('-4t'):'-4t',c=k?cancelR('-t^2'):'-t^2',d=k?cancelR('+4t'):'+4t';
 const m=box?`{\\color{${C.hi}}\\boxed{-4${Hc}}}`:`-4${Hc}`;
 return `${a}+2t${Hc}+${Hc}^2${b}${m}${c}${d}`;
}

export const ytQxUmAverageRateDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（約5秒）：式と差商 → 数直線と止まった点 → 目盛りだけの x–t 座標 → t・t＋h の印 → t＝1 の両側に h＝±0.1 の印。静止。
 // 放物線・正方形の分け方・接線・点の動く向き・傾きの数値は出さない。
 [K+'q0']:(p)=>setupFig({eq:seg(p,0,.15),nl:seg(p,.12,.27),ax:seg(p,.25,.42),tm:seg(p,.45,.6),hm:seg(p,.65,.82)}),

 // ===================== 問題の設定 =====================
 // 1. 出題中と同じ図。「文字のまま」で t と t＋h の印を光らせ、間に黄の h
 [K+'setup']:(p,ctx)=>{const b=s2(ctx,.45);return setupFig({eq:seg(p,0,.1),glow:seg(p,b+.05,b+.18)});},

 // ===================== 小問1 =====================
 // 2. 差商を中央に大きく。「位置の差」で分子を水色の枠、「時間の幅 h」で分母の h を黄の枠
 [K+'goal1']:(p,ctx)=>{
  const cw=clauseWin(ctx,1),g1=seg(p,cw[0][0]+.02,cw[0][0]+.08),g2=seg(p,(cw[1]??cw[0])[0]-.02,(cw[1]??cw[0])[0]+.05);
  const nw=texWidth(NUM,52);
  let s=T(DQ,600,260,52);
  s+=highlight(600-nw/2-14,170,nw+28,72,g1,C.x)+fade(g1,label('位置の 差',600,155,{size:28,color:C.x,anchor:'middle',weight:700}));
  s+=highlight(600-28,262,56,66,g2,C.hi)+fade(g2,label('時間の 幅 h',600,370,{size:28,color:C.hi,anchor:'middle',weight:700}));
  const c3=(cw[2]??cw[cw.length-1])[0];
  s+=fade(seg(p,c3,c3+.06),label('＝ その間の 平均の 速度',600,430,{size:30,color:C.v,anchor:'middle',weight:700}));
  return s+goalTag(G1,{g:seg(p,.02,.1)});
 },
 // 3. 正方形の図：t² → 帯2本 th → 角 h²。式の (t＋h)² の下に t²＋2th＋h²
 [K+'square']:(p,ctx)=>{
  const b=s2(ctx,.62);
  let s=T(DQ,360,170,34);
  s+=square({x0:800,y0:110,u:190,hh:80,g1:seg(p,.25,.38),g2:seg(p,.42,.52)});
  s+=fade(seg(p,.5,.62),T(SQEXP,360,330,40,{auto:false,color:C.ink}));
  s+=fade(seg(p,b,b+.08),label('帯 2本（黄）と 角 1個（赤）',360,420,{size:28,color:C.ink,anchor:'middle',weight:700}));
  return s+goalTag(G1);
 },
 // 4. 分子を1行に並べる。「引くと」で t² どうし、−4t と ＋4t に打ち消し線。−4h を黄の枠で残す
 [K+'minus4h']:(p,ctx)=>{
  const cw=clauseWin(ctx,0),gk=seg(p,cw[1]?cw[1][0]:.3,(cw[1]?cw[1][0]:.3)+.04),gb=seg(p,cw[2]?cw[2][0]:.45,(cw[2]?cw[2][0]:.45)+.05);
  let s=T(DQ,600,135,30,{opacity:.75});
  s+=fade(seg(p,.03,.12),label('分子を 1行に 並べる',600,230,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.05,.15),T(numLine(gk>.5?1:0,gb>.5?1:0),600,300,46));
  s+=fade(gb,label('−4(t＋h) − (−4t) ＝ −4h が 残る',600,400,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s+goalTag(G1);
 },
 // 5. 分子 2th＋h²−4h。各項の h を光らせ、h(2t＋h−4) に書き直す
 [K+'factor']:(p,ctx)=>{
  const b=s2(ctx,.45);
  let s=label('分子',600,130,{size:26,color:C.dim,anchor:'middle'});
  const hb=seg(p,b+.05,b+.15),hB=hb>.5?`{\\color{${C.hi}}\\boxed{h}}`:Hc;
  s+=T(`2t${hB}+${hB}^2-4${hB}`,600,215,52,{auto:true});
  s+=fade(seg(p,b+.12,b+.22),label('どの 項にも h',600,300,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,b+.3,b+.42),T(`=${Hc}(2t+${Hc}-4)`,600,390,52));
  return s+goalTag(G1);
 },
 // 6. h(2t＋h−4)/h の h に打ち消し線、「h ≠ 0 なので約分してよい」→ 2t−4＋h。答えの札 D
 [K+'ans1']:(p,ctx)=>{
  const b=s2(ctx,.42),cw=clauseWin(ctx,1);
  const kc=seg(p,.12,.2),hx=kc>.5?cancelR(Hc):Hc;
  let s=T(`\\dfrac{${hx}(2t+${Hc}-4)}{${hx}}`,380,230,56);
  s+=fade(seg(p,.1,.2),card(640,175,500,80,label('h ≠ 0 なので 約分してよい',890,226,{size:30,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
  const R=`2t-4+${Hc}`,W=texWidth(R,62);
  s+=fade(seg(p,b+.02,b+.12),label('差商',600,345,{size:26,color:C.dim,anchor:'middle'})+T(R,600,410,62)+highlight(600-W/2-20,365,W+40,90,1));
  const ga=cw[1]?cw[1][0]:.8;
  return s+goalTag(G1)+ANS1(seg(p,ga,ga+.06));
 },
 // 7. 誤答 A（h で割っていない）→ 誤答 C（−4h を落とした。上の黄の −4h を矢印で指す）
 [K+'wrongAC']:(p,ctx)=>{
  const W=sentWin(ctx),wA=W[0],wC=[W[1]?W[1][0]:.5,1],inC=seg(p,wC[0]+.01,wC[0]+.05);
  let s=label('分子',140,135,{size:24,color:C.dim,anchor:'middle'});
  const L=numLine(1,1),x0=600-texWidth(L,40)/2;
  s+=T(L,600,140,40);
  const pre=texWidth(`${cancelR('t^2')}+2t${Hc}+${Hc}^2${cancelR('-4t')}`,40),bw=texWidth(`{\\boxed{-4${Hc}}}`,40);
  s+=fade(inC,arrow(600,240,x0+pre+bw/2,178,{color:C.hi,w:4,head:14}));
  s+=fade(seg(p,.02,.1),T(`2t-4+${Hc}`,1000,215,34)+label('（正しい 差商）',1000,262,{size:22,color:C.dim,anchor:'middle'}));
  s+=wrongCard('A','2th＋h²−4h','h で 割っていない（分子の まま）',{...WF,y:270,g:seg(p,wA[0]+.01,wA[0]+.05)*(1-seg(p,wA[1]-.03,wA[1]))});
  s+=wrongCard('C','2t＋h','−4h を 落とした',{...WF,y:270,g:inC});
  return s+goalTag(G1)+ANS1(1);
 },
 // 8. 誤答 B（h の項まで消した）。2t−4＋h の ＋h を黄で光らせ「h≠0 の間は残る」
 [K+'wrongB']:(p,ctx)=>{
  const b=s2(ctx,.45);
  const R=`2t-4+${Hc}`,W=texWidth(R,60),wP=texWidth(`+${Hc}`,60);
  let s=label('差商',600,125,{size:26,color:C.dim,anchor:'middle'})+T(R,600,185,60);
  s+=highlight(600+W/2-wP-12,140,wP+24,90,seg(p,b,b+.08),C.hi)+fade(seg(p,b,b+.08),label('h ≠ 0 の 間は 残る',600+W/2+30,195,{size:28,color:C.hi,weight:700}));
  s+=wrongCard('B','2t−4','h の 項まで 消した（h を 0 に 近づけた ときの 値）',{...WF,y:290,g:seg(p,.02,.08)});
  return s+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 // 9. 約分前の差商に h＝0 を入れた形 0/0、赤の ×
 [K+'goal2']:(p,ctx)=>{
  const b=s2(ctx,.5);
  let s=fade(seg(p,.05,.18),label('約分の 前の 差商',600,140,{size:26,color:C.dim,anchor:'middle'})+T(DQ,600,215,40));
  s+=fade(seg(p,b+.1,b+.22),label('h ＝ 0 を 入れると',600,320,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,b+.25,b+.37),T('\\dfrac{0}{0}',600,410,56,{auto:false,color:C.ink})+label('×',680,420,{size:56,color:RED,weight:700})+label('決まらない',740,420,{size:30,color:RED,weight:700}));
  return s+goalTag(G2,{g:seg(p,.02,.1)});
 },
 // 10. 2t−4＋h の h の棒が縮む。札「lim」→ lim(2t−4＋h)＝2t−4＝dx/dt。左に x–t グラフ（放物線）と dx/dt の直線
 [K+'limit']:(p,ctx)=>{
  const b=s2(ctx,.42),sp=1-b;
  const st=stack({xp:null,nl:0,ug:seg(p,b+sp*.6,b+sp*.72),lg:seg(p,b+sp*.65,b+sp*.77),uCurve:seg(p,b+sp*.65,b+sp*.8),lCurve:seg(p,b+sp*.7,b+sp*.85)});
  let s=st.svg;
  const hl=1-seg(p,.15,b-.02);
  s+=T(`2t-4+${Hc}`,895,140,48);
  const bw=160*Math.max(hl,.02);
  s+=fade(seg(p,.05,.12),rect(895-80,185,Math.max(0,bw),20,{fill:C.hi,fo:.7,stroke:C.hi,rx:3})+label(hl>.03?`h ＝ ${(0.5*hl).toFixed(2)}`:'h → 0',895-90,201,{size:24,color:C.hi,anchor:'end',weight:700}));
  s+=fade(seg(p,b,b+.08),card(620,235,550,60,label('lim（h→0）：h を 0 に 近づけた とき 近づく 値',895,273,{size:22,color:C.dim,anchor:'middle'}),1,C.dim));
  s+=fade(seg(p,b+sp*.18,b+sp*.3),T(`\\lim_{${Hc}\\to0}(2t-4+${Hc})=2t-4`,895,350,38));
  s+=fade(seg(p,b+sp*.45,b+sp*.58),T(`=${DXDT}`,895,440,48,{auto:false,color:C.ink}));
  return s+goalTag(G2);
 },
 // 11. 下のグラフの t＝1 に点（−2）、上の t＝1 に接線「傾き −2」、2本の t＝1 を黄の点線で結ぶ
 [K+'t1']:(p,ctx)=>{
  const b=s2(ctx,.5);
  const st=stack({xp:-3});const {A,B}=st;let s=st.svg;
  s+=fade(seg(p,.05,.15),T(`${DXDT}=2t-4`,895,140,40,{auto:false,color:C.ink}));
  s+=fade(seg(p,.15,.3),T('2\\times1-4=-2\\ \\mathrm{m/s}',895,240,40,{auto:false,color:C.v}));
  s+=fade(seg(p,.2,.32),dot(B.X(1),B.Y(-2),9,C.v)+label('−2',B.X(1)+14,B.Y(-2)+28,{size:24,color:C.v,weight:700}));
  s+=fade(seg(p,b,b+.1),tanAt(A,1,.7)+dot(A.X(1),A.Y(-3),8,C.hi)+label('傾き −2',A.X(1.2),A.Y(-1.7),{size:24,color:C.v,weight:700}));
  s+=fade(seg(p,b+.1,b+.2),line(A.X(1),A.Y(fx(1))-10,B.X(1),B.Y(-2)+10,{color:C.hi,w:2.5,dash:'6 6'}));
  s+=fade(seg(p,b+.1,b+.2),label('グラフでは t＝1 の 接線の 傾き',895,330,{size:26,color:C.ink,anchor:'middle'}));
  return s+goalTag(G2);
 },
 // 12. 数直線の点に左向きの矢印（紫）、点が少し左へ。答えの札 A
 [K+'ans2']:(p,ctx)=>{
  const b=s2(ctx,.45);
  const mv=seg(p,b,b+.25),xp=fx(1+.25*mv);
  const st=stack({xp});const {A,B,N}=st;let s=st.svg;
  s+=tanAt(A,1,.7)+label('傾き −2',A.X(1.2),A.Y(-1.7),{size:24,color:C.v,weight:700})+dot(B.X(1),B.Y(-2),9,C.v);
  s+=fade(seg(p,.05,.15),arrow(N.X(xp)-14,NY-22,N.X(xp)-120,NY-22,{color:C.v,w:5,head:16}));
  s+=card(620,110,560,180,label('傾きが 負',895,158,{size:30,color:C.v,anchor:'middle',weight:700})
   +fade(seg(p,.12,.25),label('t が 増えると x が 減る',895,210,{size:28,color:C.ink,anchor:'middle'}))
   +fade(seg(p,b,b+.1),label('→ 左向きに 動いている',895,262,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.08),C.v);
  const ga=clauseWin(ctx,1).at(-1)[0];
  return s+goalTag(G2)+ANS2(seg(p,ga,ga+.06));
 },
 // 13. 数直線に x＝−3（水色）と dx/dt＝−2 の矢印（紫）。誤答 B → C → D を1枚ずつ
 [K+'wrong2']:(p,ctx)=>{
  const st=stack({xp:-3});const {A,B,N}=st;let s=st.svg;
  s+=tanAt(A,1,.7)+dot(B.X(1),B.Y(-2),9,C.v);
  s+=label('x ＝ −3',N.X(-3),NY+32,{size:22,color:C.x,anchor:'middle',weight:700});
  s+=arrow(N.X(-3)+4,NY-22,N.X(-3)-110,NY-22,{color:C.v,w:5,head:16})+label('dx/dt ＝ −2',N.X(-3)+14,NY-14,{size:22,color:C.v,anchor:'start',weight:700});
  const W=sentWin(ctx),cw=clauseWin(ctx,1),wB=W[0],wC=[cw[0][0],cw[1]?cw[1][0]:.8],wD=[cw[1]?cw[1][0]:.8,1];
  s+=wrongSeq(p,ctx,[['B','−3 m','位置の 値と 傾きを 取り違えた',{mid:'x(1)=1-4=-3'}],['C','−1 m/s',['h＝1 を 入れた','（h を 0 に 近づけていない）'],{mid:'2-4+1=-1'}],['D','2 m/s','符号を 落とした']],{win:[wB,wC,wD],opts:{...WR,y:110}});
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 // 14. 拡大した x–t グラフの t＝1 の右（1.1）と左（0.9）に黄の点
 [K+'goal3']:(p,ctx)=>{
  const b=s2(ctx,.5),Z=zoomG();let s=Z.svg;
  s+=dot(Z.X(1),Z.Y(fx(1)),8,C.ink)+label('t＝1',Z.X(1)+10,Z.Y(fx(1))-14,{size:22,color:C.t});
  s+=fade(seg(p,.2,.3),dot(Z.X(1.1),Z.Y(fx(1.1)),9,C.hi)+label('h＝0.1',Z.X(1.1)+10,Z.Y(fx(1.1))-14,{size:22,color:C.hi,weight:700}));
  s+=fade(seg(p,b+.1,b+.2),dot(Z.X(.9),Z.Y(fx(.9)),9,C.hi)+label('h＝−0.1',Z.X(.9)-10,Z.Y(fx(.9))+34,{size:22,color:C.hi,anchor:'end',weight:700}));
  s+=card(620,110,560,200,label('h ＞ 0：右側の 点（t＋h）',900,170,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,b+.1,b+.2),label('h ＜ 0：左側の 点',900,240,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.1,.2));
  return s+goalTag(G3,{g:seg(p,.02,.1)});
 },
 // 15. t＝1〜1.1（−1.9）と 0.9〜1（−2.1）の直線。右に表、「直接」で直接の計算
 [K+'pm']:(p,ctx)=>{
  const b=s2(ctx,.6),Z=zoomG();let s=Z.svg+dot(Z.X(1),Z.Y(fx(1)),8,C.ink)+dot(Z.X(1.1),Z.Y(fx(1.1)),9,C.hi)+dot(Z.X(.9),Z.Y(fx(.9)),9,C.hi);
  const cw=clauseWin(ctx,0),g1=seg(p,cw[1]?cw[1][0]:.2,(cw[1]?cw[1][0]:.2)+.06),g2=seg(p,cw[2]?cw[2][0]:.4,(cw[2]?cw[2][0]:.4)+.06);
  s+=fade(g1,chordZ(Z,1,1.1,.12,{color:C.v})+label('−1.9',Z.X(1.2)+8,Z.Y(fx(1)-1.9*.2)+8,{size:24,color:C.v,weight:700}));
  s+=fade(g2,chordZ(Z,.9,1,.12,{color:C.v,dash:'10 6'})+label('−2.1',Z.X(.8)-8,Z.Y(fx(.9)+2.1*.1)-6,{size:24,color:C.v,anchor:'end',weight:700}));
  s+=card(620,105,560,190,T(`2t-4+${Hc}\\ \\ (t=1)`,900,145,30)
   +fade(g1,label('h ＝ 0.1',680,205,{size:28,color:C.hi,weight:700})+T('-2+0.1=-1.9',990,200,32,{auto:false}))
   +fade(g2,label('h ＝ −0.1',680,265,{size:28,color:C.hi,weight:700})+T('-2-0.1=-2.1',990,260,32,{auto:false})),seg(p,.03,.1));
  s+=fade(seg(p,b+.05,b+.15),label('直接の 計算',900,340,{size:24,color:C.dim,anchor:'middle'})
   +T('\\dfrac{-3.19+3}{0.1}=-1.9',900,400,28,{auto:false})+T('\\dfrac{-2.79+3}{-0.1}=-2.1',900,470,28,{auto:false}));
  return s+goalTag(G3);
 },
 // 16. h を ±0.1 → ±0.01。2本の直線が両側から接線（傾き −2）に重なる。数直線上で両側から −2 へ。答えの札 B
 [K+'ans3']:(p,ctx)=>{
  const b=s2(ctx,.62),u=seg(p,.05,b-.05),hh=.1*Math.pow(.1,u),Z=zoomG();
  let s=Z.svg+fade(.6,Z.tanZ(.38,{dash:'4 6',w:2.5}));
  s+=chordZ(Z,1,1+hh,.15,{color:C.v})+chordZ(Z,1-hh,1,.15,{color:C.v,dash:'10 6'})+dot(Z.X(1),Z.Y(fx(1)),8,C.ink)+dot(Z.X(1+hh),Z.Y(fx(1+hh)),8,C.hi)+dot(Z.X(1-hh),Z.Y(fx(1-hh)),8,C.hi);
  s+=card(620,105,560,70,label(`h ＝ ±${hh.toFixed(hh<.0999?3:1)}`,660,150,{size:28,color:C.hi,weight:700})+label(`${(-2+hh).toFixed(hh<.0999?3:1)} ／ ${(-2-hh).toFixed(hh<.0999?3:1)}`.replaceAll('-','−'),1150,150,{size:28,color:C.v,anchor:'end',weight:700}),1);
  // 数直線 −2.15 … −1.85
  const x0=650,x1=1150,y=290,X=v=>x0+(x1-x0)*(v+2.15)/.3;
  let n=line(x0,y,x1,y,{color:C.dim,w:3});
  for(const v of [-2.1,-2,-1.9])n+=line(X(v),y-8,X(v),y+8,{color:C.dim,w:2})+label(v===-2?'−2':v.toFixed(1).replace('-','−'),X(v),y+36,{size:22,color:v===-2?C.v:C.dim,anchor:'middle',weight:v===-2?700:400});
  n+=line(X(-2),y-50,X(-2),y+12,{color:C.v,w:3,dash:'8 6'});
  n+=dot(X(-2+hh),y,9,C.hi)+dot(X(-2-hh),y,9,C.hi);
  n+=fade(seg(p,.15,.3),arrow(X(-1.9)+4,y-26,X(-2)+10,y-26,{color:C.hi,w:4,head:14})+arrow(X(-2.1)-4,y-26,X(-2)-10,y-26,{color:C.hi,w:4,head:14})
   +label('右から',X(-1.95),y-40,{size:22,color:C.hi,anchor:'middle'})+label('左から',X(-2.05),y-40,{size:22,color:C.hi,anchor:'middle'}));
  s+=n+fade(seg(p,b-.05,b+.05),label('どちらも −2 に 近づく',900,400,{size:30,color:C.v,anchor:'middle',weight:700}));
  return s+goalTag(G3)+ANS3(seg(p,b+.05,b+.12));
 },
 // 17. 誤答 A（両方 −1.9）→ 誤答 D（−2.1 と −1.9）
 [K+'wrongAD']:(p,ctx)=>{
  const Z=zoomG();let s=Z.svg+fade(.6,Z.tanZ(.38,{dash:'4 6',w:2.5}));
  s+=chordZ(Z,1,1.1,.12,{color:C.v})+chordZ(Z,.9,1,.12,{color:C.v,dash:'10 6'})+dot(Z.X(1),Z.Y(fx(1)),8,C.ink)+dot(Z.X(1.1),Z.Y(fx(1.1)),9,C.hi)+dot(Z.X(.9),Z.Y(fx(.9)),9,C.hi);
  s+=label('−1.9',Z.X(1.2)+8,Z.Y(fx(1)-1.9*.2)+8,{size:24,color:C.v,weight:700})+label('−2.1',Z.X(.8)-8,Z.Y(fx(.9)+2.1*.1)-6,{size:24,color:C.v,anchor:'end',weight:700});
  s+=card(620,105,560,90,T(`h=0.1\\to-1.9\\qquad h=-0.1\\to-2.1`,900,150,28,{auto:false}),1,C.F);
  s+=wrongSeq(p,ctx,[['A','両方 −1.9','h に −0.1 を 入れていない'],['D','−2.1 と −1.9','h の 符号を 入れ違えた',{mid:'-2+0.1=-1.9\\ (h=0.1)'}]],{opts:{...WR,y:225}});
  return s+goalTag(G3)+ANS3(1);
 },
 // 18. 誤答 C（決まらない）。両側の矢印が −2 で合流する所を黄で光らせる
 [K+'wrongC']:(p,ctx)=>{
  const b=s2(ctx,.42);
  let s=wrongCard('C','決まらない','途中の 値と、近づく 値を 混同した',{...WR,x:100,w:1000,y:100,g:seg(p,.02,.08)});
  const x0=150,x1=1050,y=360,X=v=>x0+(x1-x0)*(v+2.15)/.3;
  let n=line(x0,y,x1,y,{color:C.dim,w:3});
  for(const v of [-2.1,-2,-1.9])n+=line(X(v),y-8,X(v),y+8,{color:C.dim,w:2})+label(v===-2?'−2':v.toFixed(1).replace('-','−'),X(v),y+38,{size:24,color:v===-2?C.v:C.dim,anchor:'middle',weight:v===-2?700:400});
  const pts=[.1,.05,.01,.001];
  n+=pts.map(h=>dot(X(-2+h),y,7,C.hi)+dot(X(-2-h),y,7,C.hi)).join('');
  n+=arrow(X(-1.9),y-30,X(-2)+12,y-30,{color:C.hi,w:4,head:14})+arrow(X(-2.1),y-30,X(-2)-12,y-30,{color:C.hi,w:4,head:14});
  n+=label('右から −1.9、−1.99 …',X(-1.95),y-50,{size:24,color:C.hi,anchor:'middle'})+label('左から −2.1、−2.01 …',X(-2.05),y-50,{size:24,color:C.hi,anchor:'middle'});
  s+=n+fade(seg(p,b,b+.1),ring(X(-2),y,30,{color:C.hi,w:4})+label('合流：近づく 値は −2 の 一つ',600,465,{size:30,color:C.v,anchor:'middle',weight:700}));
  return s+goalTag(G3)+ANS3(1);
 },

 // ===================== まとめ =====================
 // 19. 下のグラフが t＝2 で横軸を横切る点（黄）、上の谷に水平な接線。数直線の点が左へ動いて −4 で止まり、右へ戻る
 [K+'turn']:(p,ctx)=>{
  const b=s2(ctx,.45),tm=1+2.2*seg(p,b,1),xp=fx(tm);
  const st=stack({xp});const {A,B,N}=st;let s=st.svg;
  s+=fade(seg(p,.05,.15),ring(B.X(2),B.Y(0),12,{color:C.hi,w:4})+label('t＝2 で 0',B.X(2)-16,B.Y(0)-14,{size:24,color:C.hi,anchor:'end',weight:700}));
  s+=fade(seg(p,b-.05,b+.05),line(A.X(1.3),A.Y(-4),A.X(2.7),A.Y(-4),{color:C.v,w:4})+dot(A.X(2),A.Y(-4),8,C.hi)+label('水平',A.X(2.75),A.Y(-4)+8,{size:24,color:C.v,weight:700}));
  s+=dot(A.X(tm),A.Y(fx(tm)),7,C.x);
  const v=vx(tm);if(Math.abs(v)>.25)s+=arrow(N.X(xp),NY-22,N.X(xp)+v*28,NY-22,{color:C.v,w:5,head:16});
  s+=card(620,110,560,240,T(`${DXDT}=2t-4`,900,165,40,{auto:false,color:C.ink})
   +fade(seg(p,.1,.2),label('t ＜ 2：負 → 左向き',900,235,{size:28,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.2,.3),label('t ＝ 2：0 → 向きを 変える',900,285,{size:28,color:C.hi,anchor:'middle',weight:700}))
   +fade(seg(p,.3,.4),label('t ＞ 2：正 → 右向き',900,335,{size:28,color:C.ink,anchor:'middle'})),1);
  s+=label(`t ＝ ${tm.toFixed(1)} s`,900,420,{size:28,color:C.t,anchor:'middle',weight:700});
  return s;
 },
 // 20. 差商 → lim → 2t−4 → t＝1 で −2 を矢印でつなぐ。上の接線と数直線の左向き矢印に「−2」。黄の一文。答えの札3枚
 [K+'summary']:(p)=>{
  const st=stack({xp:-3});const {A,B,N}=st;let s=st.svg;
  s+=tanAt(A,1,.7)+dot(A.X(1),A.Y(-3),8,C.hi)+fade(seg(p,.35,.45),label('−2',A.X(1.2),A.Y(-1.7),{size:26,color:C.v,weight:700}));
  s+=dot(B.X(1),B.Y(-2),9,C.v);
  s+=arrow(N.X(-3)+4,NY-22,N.X(-3)-110,NY-22,{color:C.v,w:5,head:16})+fade(seg(p,.35,.45),label('−2',N.X(-3)+14,NY-12,{size:26,color:C.v,anchor:'start',weight:700}));
  const items=[[`2t-4+${Hc}`,'差商'],['2t-4',`\\lim_{h\\to0}`],['-2','t=1']];
  items.forEach(([f,lab],i)=>{const y=160+i*100,g=seg(p,.05+i*.1,.13+i*.1);
   s+=fade(g,T(i===0?f:vC(f),900,y,40,{auto:i===0})+(i>0?arrow(900,y-80,900,y-40,{color:C.dim,w:3,head:12})+T(lab,960,y-60,30,{auto:false,color:C.dim,anchor:'start'}):''));});
  s+=fade(seg(p,.5,.6),label('h を 0 に 近づけた とき、差商が 近づく 値 ＝ dx/dt',900,465,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=answerRow([[1,'D',{tex:'2t-4+h'}],[2,'A','−2 m/s、左向き'],[3,'B','']],{g:seg(p,.8,.9)});
  return s;
 },
};

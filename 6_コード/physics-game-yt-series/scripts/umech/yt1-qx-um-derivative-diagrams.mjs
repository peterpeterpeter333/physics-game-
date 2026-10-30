// 問題編 解説「行って戻る物体の加速度」（q-um-derivative、大学 01 微分・上級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/01_微分.md の q-um-derivative（解説 19 行）。
// 画面：左に x・v・a・|v| の4段のグラフを縦に並べたまま、右に式と札。札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。
// 札の帯（y＜78）には図を描かない。色：位置 x 水色、速度 v 紫（|v| は紫の点線の枠）、加速度 a 赤、時刻 t 金、強調 黄、誤り 赤。
import {C,seg,fade,label,line,rect,dot,ring,arrow,tex,texWidth,highlight,draw,clamp,mix} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,sentWin,QC} from './yt1-qx-common.mjs';

const K='qx-um-derivative:';
const RED=QC.bad;
const fx=t=>t*t*t-6*t*t+9*t,fv=t=>3*t*t-12*t+9,fa=t=>6*t-12,fs=t=>Math.abs(fv(t));
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,...o});
const G1='向きを変える時刻と、そのときの a',G2='t＝1 で a≠0 の理由',G3='|v| が t＝1 で微分できるか';
const ANS1=g=>answerTag(1,'D','',{g}),ANS2=g=>answerTag(2,'C','a は v の傾き',{g}),ANS3=g=>answerTag(3,'A','微分できない',{g});
const WR={x:620,w:570,size:26,whySize:22};
const s2=(ctx,d=.45)=>{const W=sentWin(ctx);return W[1]?W[1][0]:d;};
function clauseWin(ctx,i){
 const W=sentWin(ctx),[a,b]=W[Math.min(i,W.length-1)];
 const r=((ctx?.cue?.reading??'').split('。').map(x=>x.replace(/\s/g,'')).filter(Boolean)[i])??'';
 const parts=r.split('、').filter(Boolean);if(parts.length<2)return [[a,b]];
 const tot=parts.reduce((s,x)=>s+x.length,0);let acc=0;
 return parts.map(x=>{const s0=a+(b-a)*acc/tot;acc+=x.length;return [s0,a+(b-a)*acc/tot];});
}

// ---- 4段のグラフ ----
const PX0=120,PWD=430,TMAX=4.2;
const X=t=>PX0+PWD*t/TMAX;
const ROWS=[
 {key:'x',name:'x',unit:'[m]',col:C.x,ymin:-1.2,ymax:5.2,fn:fx},
 {key:'v',name:'v',unit:'[m/s]',col:C.v,ymin:-4.5,ymax:10,fn:fv},
 {key:'a',name:'a',unit:'[m/s²]',col:C.a,ymin:-13,ymax:13,fn:fa},
 {key:'s',name:'|v|',unit:'[m/s]',col:C.v,ymin:-1,ymax:10,fn:fs},
];
const TOP0=86,RH=104,PH=94;
const Yof=i=>v=>{const r=ROWS[i],top=TOP0+i*RH;return top+PH-PH*(v-r.ymin)/(r.ymax-r.ymin);};
const YX=Yof(0),YV=Yof(1),YA=Yof(2),YS=Yof(3);
const YS_=[YX,YV,YA,YS];
function frameRow(i,g=1){
 const r=ROWS[i],top=TOP0+i*RH,Y=YS_[i];
 let s=line(X(0),top,X(0),top+PH,{color:C.dim,w:2})+arrow(X(0)-6,Y(0),X(TMAX)+20,Y(0),{color:C.dim,w:2,head:11});
 for(const t of [1,2,3,4])s+=line(X(t),Y(0)-5,X(t),Y(0)+5,{color:C.dim,w:2});
 s+=label(r.name,PX0-62,top+PH/2+4,{size:30,color:r.col,anchor:'middle',weight:700})+label(r.unit,PX0-62,top+PH/2+30,{size:18,color:C.dim,anchor:'middle'});
 if(i===3)s+=rect(PX0-104,top+PH/2-28,84,72,{fill:'none',fo:0,stroke:C.v,sw:2,rx:8})+'';
 if(i===3)s=s.replace(/(<rect[^>]*stroke-width="2")\/>$/,'$1 stroke-dasharray="6 5"/>');
 return fade(g,s);
}
function grid(g=1){
 let s='';for(const t of [1,2,3,4])s+=line(X(t),TOP0,X(t),TOP0+3*RH+PH,{color:C.grid,w:1.5});
 s+=[1,2,3,4].map(t=>label(String(t),X(t),TOP0+3*RH+PH+22,{size:21,color:C.t,anchor:'middle'})).join('')+label('t [s]',X(TMAX)+26,TOP0+3*RH+PH+22,{size:22,color:C.t});
 return fade(g,s);
}
const curve=(i,p=1,o={})=>{const r=ROWS[i],Y=YS_[i];return draw(Array.from({length:161},(_,k)=>{const t=4*k/160;return [X(t),Y(r.fn(t))];}),p,{color:r.col,w:3.5,...o});};
// |v| の段に、v を写して負の部分を折り返す（u＝0：v のまま、1：|v|）
const foldCurve=(u,p=1)=>draw(Array.from({length:161},(_,k)=>{const t=4*k/160,v=fv(t);return [X(t),YS(v<0?mix(v,-v,u):v)];}),p,{color:C.v,w:3.5});
function panels({rows=[1,1,1,1],cur=[1,0,0,0],fold=null}={}){
 let s=grid();
 for(let i=0;i<4;i++)s+=frameRow(i,rows[i]);
 for(let i=0;i<3;i++)if(cur[i])s+=curve(i,cur[i]);
 if(fold!=null)s+=foldCurve(fold);else if(cur[3])s+=curve(3,cur[3]);
 return s;
}
const tanSeg=(i,t,k,half=.45,o={})=>{const Y=YS_[i],y0=ROWS[i].fn(t);return line(X(t-half),Y(y0-k*half),X(t+half),Y(y0+k*half),{w:3.5,...o});};
const vline=(t,g=1,col=C.hi,i0=0,i1=3)=>fade(g,line(X(t),TOP0+i0*RH,X(t),TOP0+i1*RH+PH,{color:col,w:2.5,dash:'6 6'}));
const pt=(i,t,col=C.hi,r=7)=>dot(X(t),YS_[i](ROWS[i].fn(t)),r,col);
const vC=s=>`{\\color{${C.v}}${s}}`,aC=s=>`{\\color{${C.a}}${s}}`,xC=s=>`{\\color{${C.x}}${s}}`;
const RC=905; // 右の列の中心

export const ytQxUmDerivativeDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（約4秒）：4段の枠が上から順にフェードイン、x の段に式 x＝t³−6t²＋9t だけ。曲線・山や谷の時刻・値の印は出さない。
 [K+'q0']:(p)=>{
  let s=fade(seg(p,0,.2),grid());
  for(let i=0;i<4;i++)s+=frameRow(i,seg(p,.05+.15*i,.2+.15*i));
  s+=fade(seg(p,.7,.88),T('x=t^3-6t^2+9t',RC,YX(2),44));
  s+=fade(seg(p,.75,.9),label('（速さ ＝ |v|）',RC,YS(4.5)+10,{size:26,color:C.v,anchor:'middle'}));
  return s;
 },

 // ===================== 問題の設定 =====================
 // 1. 4段の座標。x の段に曲線（水色）。v、a、|v| の段はまだ空
 [K+'setup']:(p,ctx)=>{
  const b=s2(ctx,.45);
  let s=panels({cur:[seg(p,.08,.5),0,0,0]});
  s+=T('x=t^3-6t^2+9t',RC,150,42);
  s+=fade(seg(p,b,b+.1),label('微分して',RC,250,{size:28,color:C.dim,anchor:'middle'})+T(`${xC('x')}\\ \\to\\ ${vC('v')}\\ \\to\\ ${aC('a')}`,RC,320,46,{auto:false}));
  return s;
 },

 // ===================== 小問1 =====================
 // 2. 「向きが変わる ＝ v の符号が変わる」（黄）
 [K+'goal1']:(p,ctx)=>{
  const b=s2(ctx,.5);
  let s=panels();
  s+=T('x=t^3-6t^2+9t',RC,150,38,{opacity:.8});
  s+=fade(seg(p,b,b+.1),card(630,230,550,120,label('向きが 変わる',RC,280,{size:30,color:C.hi,anchor:'middle',weight:700})+label('＝ v の 符号が 変わる',RC,326,{size:30,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
  return s+goalTag(G1,{g:seg(p,.02,.1)});
 },
 // 3. 各項から「n を前に、肩を1つ下げる」矢印：t³→3t²、−6t²→−12t、9t→9。v＝3t²−12t＋9（紫）と v の曲線
 [K+'vel']:(p,ctx)=>{
  const cw=clauseWin(ctx,0),b=s2(ctx,.7);
  const g=[0,1,2].map(i=>seg(p,(cw[i]??cw.at(-1))[0],(cw[i]??cw.at(-1))[0]+.06));
  let s=panels({cur:[1,seg(p,b+.05,b+.3),0,0]});
  const xs=[700,880,1060],top=['t^3','-6t^2','+9t'],bot=['3t^2','-12t','+9'];
  s+=label('n を 前に、肩を 1つ 下げる',RC,120,{size:24,color:C.hi,anchor:'middle',weight:700});
  xs.forEach((x,i)=>{s+=T(top[i],x,180,40);s+=fade(g[i],arrow(x,205,x,250,{color:C.hi,w:3,head:12})+T(bot[i],x,285,40,{color:C.v,auto:false}));});
  s+=fade(seg(p,b,b+.08),T(vC('v=3t^2-12t+9'),RC,385,46,{auto:false}));
  return s+goalTag(G1);
 },
 // 4. v＝3(t−1)(t−3)。v の段で t＝1、3 に黄の点、x の段の山と谷に水平な接線、縦の黄の点線
 [K+'roots']:(p,ctx)=>{
  const cw=clauseWin(ctx,0),gp=seg(p,.45,.55),gt=seg(p,.6,.72);
  let s=panels({cur:[1,1,0,0]});
  s+=T(vC('v=3t^2-12t+9'),RC,140,36,{auto:false,opacity:.8});
  s+=fade(seg(p,.05,.15),T(vC('=3(t-1)(t-3)'),RC+20,210,42,{auto:false}));
  s+=fade(gp,pt(1,1)+pt(1,3)+label('0',X(1)-14,YV(0)-10,{size:22,color:C.hi,anchor:'end',weight:700})+label('0',X(3)+12,YV(0)-10,{size:22,color:C.hi,weight:700}));
  s+=fade(gp,T('v=0\\ :\\ t=1,\\ 3\\ \\mathrm{s}',RC,300,40,{auto:false,color:C.hi}));
  s+=fade(gt,tanSeg(0,1,0,.45,{color:C.v})+tanSeg(0,3,0,.45,{color:C.v})+pt(0,1)+pt(0,3)+label('山',X(1)-40,YX(4)+10,{size:22,color:C.x,anchor:'end',weight:700})+label('谷',X(3)+16,YX(0)-8,{size:22,color:C.x,weight:700}));
  s+=vline(1,gt,C.hi,0,1)+vline(3,gt,C.hi,0,1);
  s+=fade(gt,label('x の 山と 谷で 接線が 水平',RC,380,{size:26,color:C.v,anchor:'middle',weight:700}));
  return s+goalTag(G1);
 },
 // 5. v の各項から矢印：3t²→6t、−12t→−12、9→0（9 に打ち消し線「定数の傾きは 0」）。a の段に直線（赤）
 [K+'acc']:(p,ctx)=>{
  const b=s2(ctx,.45);
  let s=panels({cur:[1,1,seg(p,.4,.6),0]});
  const xs=[700,880,1060],top=['3t^2','-12t','+9'],bot=['6t','-12','0'];
  xs.forEach((x,i)=>{const g=seg(p,.05+i*.08,.12+i*.08);s+=T(vC(top[i]),x,140,40,{auto:false});
   s+=fade(g,arrow(x,165,x,210,{color:C.hi,w:3,head:12})+T(aC(bot[i]),x,245,40,{auto:false}));});
  const gk=seg(p,b,b+.08),w9=texWidth('+9',40,false);
  s+=fade(gk,line(1060-w9/2-4,158,1060+w9/2+4,122,{color:RED,w:4})+label('定数の 傾きは 0',1060,300,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.3,.4),T(aC('a=6t-12'),780,360,46,{auto:false}));
  return s+goalTag(G1);
 },
 // 6. a の段の t＝1 に「−6」、t＝3 に「＋6」。答えの札 D
 [K+'ans1']:(p,ctx)=>{
  const b=s2(ctx,.55);
  let s=panels({cur:[1,1,1,0]});
  s+=pt(1,1)+pt(1,3);
  s+=fade(seg(p,.05,.15),pt(2,1,C.a,8)+label('−6',X(1)+12,YA(-6)+26,{size:24,color:C.a,weight:700}));
  s+=fade(seg(p,.25,.35),pt(2,3,C.a,8)+label('＋6',X(3)+12,YA(6)-6,{size:24,color:C.a,weight:700}));
  s+=vline(1,1,C.hi,1,2)+vline(3,1,C.hi,1,2);
  s+=T(aC('a=6t-12'),RC,150,40,{auto:false});
  s+=fade(seg(p,.05,.15),T('t=1:\\ a=-6\\ \\mathrm{m/s^2}',RC,240,38,{auto:false}));
  s+=fade(seg(p,.25,.35),T('t=3:\\ a=6\\ \\mathrm{m/s^2}',RC,310,38,{auto:false}));
  return s+goalTag(G1)+ANS1(seg(p,b,b+.06));
 },
 // 7. x の段の t＝0、3（x＝0）を灰色、a の段の t＝2（a＝0）を灰色、v の段の t＝2 に「−3」。誤答 A → B
 [K+'wrongAB']:(p,ctx)=>{
  const W=sentWin(ctx),wA=W[0],wB=[W[1]?W[1][0]:.45,1],inA=seg(p,wA[0]+.01,wA[0]+.06)*(1-seg(p,wA[1]-.03,wA[1])),inB=seg(p,wB[0]+.01,wB[0]+.06);
  let s=panels({cur:[1,1,1,0]});
  s+=pt(1,1)+pt(1,3)+pt(2,1,C.a,7)+pt(2,3,C.a,7);
  s+=fade(inA,ring(X(0),YX(0),11,{color:C.dim,w:3})+ring(X(3),YX(0),11,{color:C.dim,w:3})+label('x＝0',X(3)+16,YX(0)+28,{size:22,color:C.dim}));
  s+=fade(inB,ring(X(2),YA(0),11,{color:C.dim,w:3})+label('a＝0',X(2)+14,YA(0)-12,{size:22,color:C.dim})+dot(X(2),YV(-3),7,C.v)+label('−3',X(2)+12,YV(-3)+24,{size:22,color:C.v,weight:700}));
  s+=card(630,95,550,100,label('v ＝ 0 は t ＝ 1、3 だけ',RC,155,{size:28,color:C.hi,anchor:'middle',weight:700}),1,C.hi);
  s+=wrongSeq(p,ctx,[['A','t＝0 s と 3 s','x＝0 の 時刻'],['B','t＝2 s',['a＝0 の 時刻','（v＝−3 m/s の まま、向きは 変わらない）']]],{win:[wA,wB],opts:{...WR,y:225}});
  return s+goalTag(G1)+ANS1(1);
 },
 // 8. 誤答 C（加速度 0）。a の段の −6、＋6 を指す
 [K+'wrongC']:(p)=>{
  let s=panels({cur:[1,1,1,0]});
  s+=pt(1,1)+pt(1,3)+pt(2,1,C.a,8)+pt(2,3,C.a,8)+label('−6',X(1)+12,YA(-6)+26,{size:24,color:C.a,weight:700})+label('＋6',X(3)+12,YA(6)-6,{size:24,color:C.a,weight:700});
  s+=fade(seg(p,.3,.4),ring(X(1),YA(-6),16,{color:C.hi,w:3})+ring(X(3),YA(6),16,{color:C.hi,w:3}));
  s+=wrongCard('C','加速度 0','v＝0 でも a＝0 とは 限らない',{...WR,y:110,g:seg(p,.02,.08)});
  s+=fade(seg(p,.3,.4),arrow(620,260,X(3)+24,YA(6),{color:C.hi,w:3,head:12})+arrow(620,260,X(1)+24,YA(-6),{color:C.hi,w:3,head:12}));
  return s+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 // 9. a＝dv/dt、「v のグラフの傾き」（黄）
 [K+'goal2']:(p,ctx)=>{
  const b=s2(ctx,.55);
  let s=panels({cur:[1,1,1,0]});
  s+=fade(seg(p,b,b+.1),T(`${aC('a')}=\\dfrac{d${vC('v')}}{dt}`,RC,190,50,{auto:false})+label('＝ v の グラフの 傾き',RC,290,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s+goalTag(G2,{g:seg(p,.02,.1)});
 },
 // 10. v の段の t＝1 に右下がりの接線（赤「傾き −6」）。t＝0.9、1、1.1 の v の値。a の段の −6 と矢印
 [K+'slope']:(p,ctx)=>{
  const b=s2(ctx,.5);
  let s=panels({cur:[1,1,1,0]});
  const gv=seg(p,.05,.3);
  [[.9,'＋0.63'],[1,'0'],[1.1,'−0.57']].forEach(([t,txt],i)=>{const g=seg(p,.05+i*.08,.12+i*.08);s+=fade(g,dot(X(t),YV(fv(t)),6,C.hi));});
  s+=card(630,95,550,150,label('t ＝ 0.9 → 1 → 1.1',RC,140,{size:26,color:C.t,anchor:'middle',weight:700})
   +T('v:\\ \\ +0.63\\ \\to\\ 0\\ \\to\\ -0.57',RC,200,36,{auto:false,color:C.v}),gv);
  s+=fade(seg(p,b,b+.1),tanSeg(1,1,-6,.4,{color:C.a,w:4})+label('傾き −6',X(1.45),YV(-2)+6,{size:24,color:C.a,weight:700}));
  s+=fade(seg(p,b+.15,b+.25),pt(2,1,C.a,8)+label('−6',X(1)+12,YA(-6)+26,{size:24,color:C.a,weight:700})+arrow(X(1)-14,YV(0)+12,X(1)-14,YA(-6)-10,{color:C.a,w:3,head:12}));
  s+=fade(seg(p,b+.15,b+.25),label('減り続ける → 傾きは 負',RC,300,{size:28,color:C.ink,anchor:'middle'})+T(aC('a=-6'),RC,370,44,{auto:false}));
  return s+goalTag(G2);
 },
 // 11. x の水平な接線（傾き 0 → v＝0）と、v の傾いた接線（傾き −6 → a＝−6）を並べて光らせる。答えの札 C
 [K+'ans2']:(p,ctx)=>{
  const b=s2(ctx,.4),W=sentWin(ctx),cw=clauseWin(ctx,1);
  let s=panels({cur:[1,1,1,0]});
  const g1=seg(p,.03,.12),g2=seg(p,b+.05,b+.15);
  s+=fade(g1,tanSeg(0,1,0,.45,{color:C.v,w:5})+pt(0,1));
  s+=fade(g2,tanSeg(1,1,-6,.4,{color:C.a,w:5})+pt(1,1)+pt(2,1,C.a,8));
  s+=card(630,95,550,110,label('x の 傾き 0',RC-130,140,{size:26,color:C.x,anchor:'middle',weight:700})+label('→ v ＝ 0',RC+110,140,{size:28,color:C.v,anchor:'middle',weight:700})
   +label('（速度 0）',RC,182,{size:22,color:C.dim,anchor:'middle'}),g1,C.v);
  s+=card(630,225,550,110,label('v の 傾き −6',RC-130,270,{size:26,color:C.v,anchor:'middle',weight:700})+label('→ a ＝ −6',RC+110,270,{size:28,color:C.a,anchor:'middle',weight:700})
   +label('（加速度）',RC,312,{size:22,color:C.dim,anchor:'middle'}),g2,C.a);
  const ga=cw.at(-1)[0];
  return s+goalTag(G2)+ANS2(seg(p,ga,ga+.06));
 },
 // 12. 誤答 A（v÷t）→ B（x の傾き）→ D（位置に比例）を1枚ずつ
 [K+'wrong2']:(p,ctx)=>{
  let s=panels({cur:[1,1,1,0]});
  s+=tanSeg(0,1,0,.45,{color:C.v,w:4})+tanSeg(1,1,-6,.4,{color:C.a,w:4})+pt(0,1)+pt(1,1)+pt(2,1,C.a,8);
  const W=sentWin(ctx),cw=clauseWin(ctx,1),wA=W[0],wB=[cw[0][0],cw[1]?cw[1][0]:.75],wD=[cw[1]?cw[1][0]:.75,1];
  s+=wrongSeq(p,ctx,[['A','v÷t',['a は v の 傾き','（v÷t なら 0）']],['B','x の 傾き',['x の 傾きは v で、t＝1 では 0']],['D','位置に 比例',['振動のような 特別な 場合だけ']]],{win:[wA,wB,wD],opts:{...WR,y:110}});
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 // 13. |v| の段に v の曲線を写し、1〜3 s の横軸より下の部分が上へ折り返る。t＝1、3 に角
 [K+'goal3']:(p,ctx)=>{
  const b=s2(ctx,.45),u=seg(p,b+.15,b+.45);
  let s=panels({cur:[1,1,1,0],fold:seg(p,b,b+.08)>0?u:null});
  if(seg(p,b,b+.08)<=0)s+='';
  s+=fade(seg(p,b,b+.06),label('v を 写して',RC,150,{size:28,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,b+.15,b+.25),label('横軸より 下を 上へ 折り返す',RC,210,{size:28,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,b+.5,b+.6),ring(X(1),YS(0),13,{color:C.hi,w:3})+ring(X(3),YS(0),13,{color:C.hi,w:3})+label('角',RC,300,{size:30,color:C.hi,anchor:'middle',weight:700})
   +label('t ＝ 1、3',RC,345,{size:28,color:C.t,anchor:'middle'}));
  return s+goalTag(G3,{g:seg(p,.02,.1)});
 },
 // 14. |v| の段の t＝1 の右に短い線（＋6）、左に（−6）。右に2行
 [K+'sides']:(p,ctx)=>{
  const b=s2(ctx,.5);
  let s=panels({cur:[1,1,1,0],fold:1});
  const gR=seg(p,.1,.2),gL=seg(p,b+.05,b+.15);
  s+=fade(gR,line(X(1),YS(0),X(1.45),YS(6*.45),{color:C.hi,w:5})+label('＋6',X(1.5)+4,YS(2.7)+6,{size:24,color:C.hi,weight:700}));
  s+=fade(gL,line(X(.55),YS(6*.45),X(1),YS(0),{color:C.hi,w:5})+label('−6',X(.5)-6,YS(2.7)+6,{size:24,color:C.hi,anchor:'end',weight:700}));
  s+=card(620,95,570,130,label('右（v ＜ 0）',650,140,{size:26,color:C.ink,weight:700})+T(`|${vC('v')}|=-${vC('v')}`,1000,135,32,{auto:false})
   +label('傾き −a ＝ ＋6',RC,200,{size:28,color:C.hi,anchor:'middle',weight:700}),gR);
  s+=card(620,245,570,130,label('左（v ＞ 0）',650,290,{size:26,color:C.ink,weight:700})+T(`|${vC('v')}|=${vC('v')}`,1000,285,32,{auto:false})
   +label('傾き a ＝ −6',RC,350,{size:28,color:C.hi,anchor:'middle',weight:700}),gL);
  return s+goalTag(G3);
 },
 // 15. 表：h＝0.01 → 5.97、0.001 → 5.997、h＝−0.01 → −6.03、−0.001 → −6.003。右の列は ＋6、左の列は −6 へ
 [K+'table']:(p,ctx)=>{
  const b=s2(ctx,.6);
  let s=panels({cur:[1,1,1,0],fold:1});
  s+=line(X(1),YS(0),X(1.45),YS(2.7),{color:C.hi,w:4})+line(X(.55),YS(2.7),X(1),YS(0),{color:C.hi,w:4});
  const cell=(h,v,y,g)=>fade(g,label(`h ＝ ${h}`,650,y,{size:26,color:C.hi})+label(v,955,y,{size:28,color:C.ink,anchor:'end',weight:700}));
  let t=label('右から（h ＞ 0）',650,130,{size:22,color:C.dim})+cell('0.01','5.97',170,seg(p,.05,.15))+cell('0.001','5.997',212,seg(p,.12,.22))
   +line(640,232,1170,232,{color:C.faint,w:2})
   +label('左から（h ＜ 0）',650,262,{size:22,color:C.dim})+cell('−0.01','−6.03',302,seg(p,.2,.3))+cell('−0.001','−6.003',344,seg(p,.27,.37));
  t+=fade(seg(p,b,b+.08),arrow(975,190,1035,190,{color:C.hi,w:4,head:14})+label('＋6',1110,202,{size:40,color:C.hi,anchor:'middle',weight:700}));
  t+=fade(seg(p,b+.15,b+.23),arrow(975,322,1035,322,{color:C.hi,w:4,head:14})+label('−6',1110,334,{size:40,color:C.hi,anchor:'middle',weight:700}));
  s+=card(620,95,570,275,t,1);
  return s+goalTag(G3);
 },
 // 16. ＋6 と −6 を並べ、間に赤の ≠。答えの札 A
 [K+'ans3']:(p,ctx)=>{
  const b=s2(ctx,.55);
  let s=panels({cur:[1,1,1,0],fold:1});
  s+=line(X(1),YS(0),X(1.45),YS(2.7),{color:C.hi,w:4})+line(X(.55),YS(2.7),X(1),YS(0),{color:C.hi,w:4})+ring(X(1),YS(0),13,{color:C.hi,w:3});
  s+=card(620,110,570,170,label('右から',760,155,{size:24,color:C.dim,anchor:'middle'})+label('左から',1050,155,{size:24,color:C.dim,anchor:'middle'})
   +label('＋6',760,225,{size:44,color:C.hi,anchor:'middle',weight:700})+label('−6',1050,225,{size:44,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.1,.2),label('≠',905,228,{size:56,color:RED,anchor:'middle',weight:700})),1);
  s+=fade(seg(p,.3,.4),label('t ＝ 1 で |v| は 微分できない',RC,340,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s+goalTag(G3)+ANS3(seg(p,b,b+.06));
 },
 // 17. 誤答 B（傾き 0）。|v| の t＝1 を2回拡大しても尖ったまま。横に x＝t² の谷底（拡大すると直線に見える）
 [K+'wrongB']:(p,ctx)=>{
  const b=s2(ctx,.45);
  let s=panels({cur:[1,1,1,0],fold:1})+ring(X(1),YS(0),13,{color:C.hi,w:3});
  s+=wrongCard('B','傾き 0','角の ある 谷底（なめらかな 谷底と 区別していない）',{...WR,y:95,g:seg(p,.02,.08)});
  // 拡大の窓：上段 |v|（角）、下段 x＝t²（なめらか）
  const z=seg(p,b,b+.25),z2=seg(p,b+.3,b+.55),zoom=1+3*z+12*z2;
  const box=(x0,y0,w,h,inner,ttl,col)=>rect(x0,y0,w,h,{fill:'#0e1830',fo:.98,stroke:col,sw:2,rx:8})+`<svg x="${x0}" y="${y0}" width="${w}" height="${h}" viewBox="${x0} ${y0} ${w} ${h}" overflow="hidden">${inner}</svg>`+label(ttl,x0+w/2,y0+h+26,{size:22,color:col,anchor:'middle',weight:700});
  const cxA=740,cyA=330,W=230,Hh=120,sc=40*zoom;
  const ptsA=Array.from({length:61},(_,k)=>{const d=(k-30)/30*(W/2)/sc;return [cxA+d*sc,cyA+Hh/2-12-fs(1+d)*sc/6*1];});
  // |v| 近く：|v|≈6|d| → 角は拡大しても角
  const ptsV=Array.from({length:61},(_,k)=>{const d=(k-30)/30*(W/2)/sc,yy=fs(1+d);return [cxA+d*sc,cyA+Hh/2-12-yy*sc/6];});
  const ptsX=Array.from({length:61},(_,k)=>{const d=(k-30)/30*(W/2)/sc;return [1050+d*sc,cyA+Hh/2-12-d*d*sc*4];});
  s+=fade(seg(p,b-.05,b+.05),box(cxA-W/2,cyA-Hh/2,W,Hh,draw(ptsV,1,{color:C.v,w:4})+dot(cxA,cyA+Hh/2-12,5,C.hi),'|v| の 角（t＝1）',C.v)
   +box(1050-W/2,cyA-Hh/2,W,Hh,draw(ptsX,1,{color:C.x,w:4})+dot(1050,cyA+Hh/2-12,5,C.hi),'x＝t² の 谷底',C.x)
   +label(`拡大 ×${Math.round(zoom)}`,RC,cyA+Hh/2+70,{size:26,color:C.hi,anchor:'middle',weight:700}));
  void ptsA;
  return s+goalTag(G3)+ANS3(1);
 },
 // 18. 誤答 C（左側だけ）→ D（分母が 0）。差商の式の分母 h（黄）、分子の |v(1)|＝0（灰）
 [K+'wrongCD']:(p,ctx)=>{
  const W=sentWin(ctx),wC=W[0],wD=[W[1]?W[1][0]:.45,1],inC=seg(p,wC[0]+.01,wC[0]+.06)*(1-seg(p,wC[1]-.03,wC[1])),inD=seg(p,wD[0]+.01,wD[0]+.06);
  let s=panels({cur:[1,1,1,0],fold:1})+ring(X(1),YS(0),13,{color:C.hi,w:3});
  s+=fade(inC,line(X(.55),YS(2.7),X(1),YS(0),{color:C.hi,w:5})+label('−6（左側だけ）',X(.75),YS(6)+4,{size:22,color:C.hi,anchor:'middle',weight:700}));
  s+=wrongSeq(p,ctx,[['C','−6 m/s²','左側だけを 見た'],['D','分母が 0','分母は h、0 は 分子の |v(1)|']],{win:[wC,[wD[0],1]],opts:{...WR,y:95}});
  s+=fade(inD,T(`\\dfrac{|v(1+{\\color{${C.hi}}h})|-{\\color{${C.dim}}|v(1)|}}{{\\color{${C.hi}}h}}`,RC,330,44,{auto:false})
   +label('|v(1)| ＝ 0',RC+150,420,{size:24,color:C.dim,anchor:'middle'})+label('h ≠ 0（幅）',RC-150,420,{size:24,color:C.hi,anchor:'middle',weight:700}));
  return s+goalTag(G3)+ANS3(1);
 },

 // ===================== まとめ =====================
 // 19. 4段を並べ、t＝1 を縦の黄の線で貫く。x の水平な接線 → v＝0 → a＝−6、|v| の角（＋6 と −6）を順に光らせ、各段の横に結論。答えの札3枚
 [K+'summary']:(p)=>{
  let s=panels({cur:[1,1,1,0],fold:1});
  s+=vline(1,seg(p,.02,.1));
  const g=[seg(p,.08,.16),seg(p,.2,.28),seg(p,.32,.4),seg(p,.44,.52)];
  s+=fade(g[0],tanSeg(0,1,0,.45,{color:C.v,w:5})+pt(0,1));
  s+=fade(g[1],pt(1,1)+label('v＝0',X(1)+12,YV(0)-12,{size:22,color:C.v,weight:700}));
  s+=fade(g[2],tanSeg(1,1,-6,.35,{color:C.a,w:4})+pt(2,1,C.a,8)+label('a＝−6',X(1)+12,YA(-6)+26,{size:22,color:C.a,weight:700}));
  s+=fade(g[3],line(X(.55),YS(2.7),X(1),YS(0),{color:C.hi,w:4})+line(X(1),YS(0),X(1.45),YS(2.7),{color:C.hi,w:4})+label('−6 ／ ＋6',X(1.5)+6,YS(3)+6,{size:22,color:C.hi,weight:700}));
  const cl=(i,txt,col,gg)=>fade(gg,card(640,TOP0+i*RH+14,540,66,label(txt,910,TOP0+i*RH+56,{size:26,color:col,anchor:'middle',weight:700}),1,col));
  s+=cl(0,'小問1：v の 符号が 変わる → 向きを 変える',C.x,seg(p,.55,.62));
  s+=cl(1,'x の 傾きが v、v の 傾きが a',C.v,seg(p,.6,.67));
  s+=cl(2,'小問2：a は v の 傾き（v＝0 でも a≠0）',C.a,seg(p,.65,.72));
  s+=cl(3,'小問3：角では 微分できない',C.hi,seg(p,.7,.77));
  s+=answerRow([[1,'D',''],[2,'C',''],[3,'A','']],{g:seg(p,.82,.9)});
  return s;
 },
};

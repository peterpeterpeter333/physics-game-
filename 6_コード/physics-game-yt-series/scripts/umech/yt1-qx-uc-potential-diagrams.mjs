// 問題編 解説「9.1 km/s で打ち上げた物体」（q-uc-potential、大学編 13 位置エネルギー・上級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/13_位置エネルギー.md の q-uc-potential（解説 20 行）。
// 画面の配置：左に地球と物体（真上に打ち上げる。R＝60 px）、右に U(r) のグラフ（r は R 単位、U は GMm/R 単位、r＜R は描かない）。
// 式が主役の行は、図を消して式を一段ずつ（カット割り）。誤答カードはグラフの右下（曲線のない所）。
// 札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 色：距離 r・R 水色、力 F 緑、U 橙、K 薄橙、全エネルギー E・強調 黄、速さ v 紫、負・誤り 赤（単元動画 uc-potential と同じ）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,axes,poly,tex,texWidth} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,sentWin,voiceEnd,note} from './yt1-qx-common.mjs';

const K='qx-uc-potential:';
const NEG='#ff6b6b',CU=C.E,CX=C.x,CF=C.F,HI=C.hi,CV=C.v,CK='#ffd9b0',EARTH='#2f5f9e';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const cc=(col,s)=>`{\\color{${col}}{${s}}}`;
const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
const G1='最も遠い点の r（中心から）',G2='r＝2R の速さ v',G3='r＝3R での様子';
const ANS1=g=>answerTag(1,'C','3R',{g}),ANS2=g=>answerTag(2,'B','約 4.6 km/s',{g}),ANS3=g=>answerTag(3,'C','',{g});
const GMm='GMm',E3=`-\\dfrac{${GMm}}{3R}`;

// ---- 左：地球と物体 ----
const EX=190,EY=440,ER=60,ry=r=>EY-ER*r;
function earth({g=1,obj=1,r=1,v0=0,vArr=0,vDown=0,fArr=0,stopMark=0}={}){
 let s=ring(EX,EY,ER,{color:'#5f8fd0',w:3,fill:EARTH})+label('地球',EX,EY+8,{size:22,color:C.ink,anchor:'middle'});
 s+=line(EX,EY,EX,ry(4.3),{color:C.faint,w:2,dash:'5 7'});
 if(obj){const y=ry(r);s+=dot(EX,y,11,C.ink)+label('m',EX+16,y+8,{size:22,color:C.ink});
  if(v0)s+=fade(v0,arrow(EX,y-14,EX,y-104,{color:CV,w:6,head:16})+label('v₀',EX+14,y-70,{size:28,color:CV,weight:700}));
  if(vArr)s+=fade(vArr,arrow(EX,y-14,EX,y-14-60*vArr,{color:CV,w:5,head:14}));
  if(vDown)s+=fade(vDown,arrow(EX-26,y,EX-26,y+50,{color:CV,w:5,head:14}));
  if(fArr)s+=fade(fArr,arrow(EX,y+14,EX,y+84,{color:CF,w:7,head:18})+label('中心向き',EX+16,y+66,{size:22,color:CF,weight:700}));
  if(stopMark)s+=fade(stopMark,label('速度 0',EX+20,y-14,{size:24,color:CV,weight:700}));
 }
 return fade(g,s);
}
// ---- 右：U(r) のグラフ ----
const GU=()=>axes({x:420,y:490,w:700,h:380,xmin:0,xmax:5,ymin:-1.15,ymax:.15,xlabel:'r',ylabel:'',xticks:[],yticks:[],xcolor:CX});
const Ur=r=>-1/r,EE=-1/3;
function ugraph(A,{p=1,ticks=1,ulab=1,zero=0,glow=0}={}){
 let s=A.svg;
 if(ticks)[1,2,3,4].forEach(r=>{s+=line(A.X(r),A.Y(0)-6,A.X(r),A.Y(0)+6,{color:CX,w:2})+label(r===1?'R':`${r}R`,A.X(r),A.Y(0)+32,{size:24,color:CX,anchor:'middle'});});
 s+=label('U',A.X(0)+14,A.Y(.08),{size:26,color:CU,weight:700})+label('0',A.X(0)-12,A.Y(0)+8,{size:22,color:C.dim,anchor:'end'});
 s+=A.plot(Ur,{from:1,to:5,p,color:CU,w:5});
 if(glow)s+=fade(glow*.5,A.plot(Ur,{from:1,to:5,color:HI,w:11}));
 if(ulab)s+=fade(ulab,label('U ＝ −GMm/r',A.X(1.35),440,{size:26,color:CU,weight:700}));
 if(zero)s+=fade(zero,rect(A.X(3.6)-10,A.Y(0)-50,220,36,{fill:HI,fo:.1,stroke:HI,sw:2,rx:10})+label('無限遠で U ＝ 0',A.X(3.6)+100,A.Y(0)-25,{size:22,color:HI,anchor:'middle',weight:700}));
 return s;
}
const eLine=(A,{g=1,p=1,lab=1,E=EE,txt='E ＝ −GMm/(3R)'}={})=>fade(g,line(A.X(0),A.Y(E),A.X(0)+(A.X(5)-A.X(0))*p,A.Y(E),{color:HI,w:4,dash:'12 7'})
 +(lab?fade(lab,label(txt,A.X(0)+12,A.Y(E)-12,{size:24,color:HI,weight:700})):''));
const meet=(A,g=1)=>fade(g,dot(A.X(3),A.Y(EE),9,HI));
const WOPT={x:800,w:390,size:26,whySize:22,y:310};
// 式の画面（図を消して式を一段ずつ）
const FX=600;

export const ytQxUcPotentialDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（5 s）：0〜2 s 地球と物体、真上向きの v₀（紫）と条件の札 → 2〜4 s 右に横軸 r（R〜4R）と U＝−GMm/r の曲線（r＞R だけ）→ 静止。
 // E の横線・交点・速さの値は描かない。物体は打ち上げない。
 [K+'q0']:(p)=>{
  const t=5*p,A=axes({x:420,y:490,w:700,h:380,xmin:0,xmax:5,ymin:-1.15,ymax:.15,xlabel:'r',ylabel:'',xticks:[],yticks:[],xcolor:CX,g:seg(t,2,2.4)});
  let s=earth({g:seg(t,0,.5),v0:seg(t,.6,1.6)});
  s+=fade(seg(t,1.2,1.9),label('v₀² ＝ (4/3)gR（約 9.1 km/s）、GM ＝ gR²',40,40,{size:26,color:C.ink,weight:700}));
  s+=fade(seg(t,2,2.4),ugraph(A,{p:0,ulab:0}));
  s+=A.plot(Ur,{from:1,to:5,p:seg(t,2.4,3.8),color:CU,w:5});
  s+=fade(seg(t,3.6,4),label('U ＝ −GMm/r',A.X(1.35),440,{size:26,color:CU,weight:700}));
  return s;
 },

 // ===================== 小問1 =====================
 // 1. 出題中の図
 [K+'goal1']:(p)=>{
  const A=GU();
  let s=earth({v0:1})+ugraph(A);
  return s+goalTag(G1,{g:seg(p,.03,.15)});
 },
 // 2. U の曲線を光らせ「無限遠で U＝0」。「法則」タグ
 [K+'law']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,A=GU();
  let s=earth({v0:1})+ugraph(A,{glow:seg(p,.1,.2)*(1-seg(p,b-.05,b)),zero:seg(p,.25,.35)});
  s+=kindTag('法則',960,340,{text:'E ＝ K ＋ U 一定',g:seg(p,b,b+.08)})+fade(seg(p,b+.05,b+.12),L('（保存力 だけ）',960,392,{size:24,color:C.dim}));
  return s+goalTag(G1);
 },
 // 3a. 式の画面：E＝½mv₀²−GMm/R
 [K+'subst']:(p)=>{
  let s=L('地表（r ＝ R）での 全エネルギー',FX,130,{size:26,color:C.dim,g:1});
  s+=fade(seg(p,.1,.3),T(`${cc(HI,'E')}=\\tfrac12 m${cc(CV,'v_0')}^2-\\dfrac{${GMm}}{R}`,FX,215,48));
  s+=fade(seg(p,.35,.5),L('運動エネルギー',470,300,{size:24,color:CK})+L('位置エネルギー',750,300,{size:24,color:CU}));
  return s+goalTag(G1);
 },
 // 3b. v₀² と GM を一つずつ代入（代入する項を黄で）
 [K+'subst2']:(p,ctx)=>{
  let s=L('地表（r ＝ R）での 全エネルギー',FX,130,{size:26,color:C.dim});
  s+=T(`${cc(HI,'E')}=\\tfrac12 m${cc(CV,'v_0')}^2-\\dfrac{${GMm}}{R}`,FX,215,44);
  const a=seg(p,.12,.25),b=seg(p,.3,.45);
  s+=fade(a,T(`=\\tfrac12 m\\cdot${cc(HI,'\\tfrac43 gR')}-\\dfrac{${b>.5?cc(HI,'gR^2'):'GM'}\\,m}{R}`,FX,320,44));
  s+=fade(seg(p,.55,.7),T(`=\\tfrac23 mgR-mgR`,FX,420,44));
  return s+goalTag(G1);
 },
 // 4. まとめて E＝−(1/3)mgR＝−GMm/(3R)（式）→ 2文目でグラフに戻り、E の横線と交点
 [K+'eline']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,cA=1-seg(p,b-.05,b),cB=seg(p,b-.02,b+.04),A=GU();
  let s=fade(cA,L('地表（r ＝ R）での 全エネルギー',FX,130,{size:26,color:C.dim})+T(`=\\tfrac23 mgR-mgR`,FX,215,44)
   +fade(seg(p,.1,.25),T(`${cc(HI,'E')}=-\\tfrac13 mgR=${cc(HI,E3)}`,FX,330,50))+fade(seg(p,.3,.4),L('E は 負',FX,440,{size:30,color:NEG,weight:700})));
  s+=fade(cB,earth({v0:1})+ugraph(A)+eLine(A,{p:seg(p,b+.05,b+.3)})+meet(A,seg(p,b+.3,b+.4)));
  return s+goalTag(G1);
 },
 // 5. 交点から横軸へ点線「r＝3R」。答え C
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,ve=voiceEnd(ctx),A=GU();
  let s=earth({v0:1})+ugraph(A)+eLine(A)+meet(A);
  s+=fade(seg(p,.05,.15),label('速さ 0 → E ＝ U',A.X(3)+16,A.Y(EE)+36,{size:24,color:HI,weight:700}));
  s+=fade(seg(p,b+.2,b+.3),line(A.X(3),A.Y(EE),A.X(3),A.Y(0),{color:CX,w:3,dash:'6 6'})+rect(A.X(3)-50,A.Y(0)-46,100,36,{fill:'#0b1122',fo:.9,stroke:CX,sw:2,rx:8})+L('r ＝ 3R',A.X(3),A.Y(0)-20,{size:24,color:CX,weight:700}));
  s+=card(800,310,390,180,fade(seg(p,b,b+.1),T(`-\\dfrac{${GMm}}{r}=-\\dfrac{${GMm}}{3R}`,995,370,32))+fade(seg(p,b+.15,b+.25),T(`${cc(CX,'r')}=${cc(CX,'3R')}`,995,455,40)),seg(p,b,b+.08));
  return s+goalTag(G1)+ANS1(seg(p,ve-.08,ve-.02));
 },
 // 6. 誤答 B：中心から 3R と、地表から 2R を区別
 [K+'wrongB']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,A=GU();
  let s=earth({r:3})+ugraph(A)+eLine(A)+meet(A);
  s+=fade(seg(p,.05,.15),arrow(EX-34,EY,EX-34,ry(3),{color:CX,w:5,head:14})+label('中心から 3R',EX-44,ry(2.2),{size:22,color:CX,anchor:'end',weight:700}));
  s+=fade(seg(p,b,b+.1),arrow(EX+40,ry(1),EX+40,ry(3),{color:HI,w:5,head:14})+label('地表から 2R',EX+52,ry(2.2),{size:22,color:HI,weight:700}));
  s+=wrongCard('B','4R',['中心からの 3R を','高さと 取り違えた'],{...WOPT,g:seg(p,.03,.08)});
  return s+goalTag(G1)+ANS1(1);
 },
 // 7. 誤答 A：mgh の直線（地表での接線）。交点が (5/3)R に手前にずれる
 [K+'wrongA']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,A=GU(),tg=seg(p,.05,.25);
  let s=earth({r:3})+ugraph(A)+eLine(A);
  // 接線 U≈−1＋(r−1)：r＝1〜2
  s+=draw([[A.X(1),A.Y(-1)],[A.X(2),A.Y(0)]],tg,{color:NEG,w:4,dash:'10 7'});
  s+=fade(seg(p,.2,.3),dot(A.X(5/3),A.Y(EE),8,NEG)+line(A.X(5/3),A.Y(EE),A.X(5/3),A.Y(0),{color:NEG,w:2,dash:'5 6'})+label('(5/3)R',A.X(5/3)-8,A.Y(0)-14,{size:24,color:NEG,anchor:'end',weight:700}));
  s+=fade(seg(p,.25,.35),label('mgh の 直線',A.X(1.05),A.Y(-.55),{size:22,color:NEG,anchor:'end',weight:700}));
  const pts=[];for(let i=0;i<=20;i++){const r=1+i/20;pts.push([A.X(r),A.Y(-1+(r-1))]);}for(let i=20;i>=0;i--){const r=1+i/20;pts.push([A.X(r),A.Y(Ur(r))]);}
  s+=fade(seg(p,b+.1,b+.2),poly(pts,{fill:HI,fo:.22}));
  s+=kindTag('近似',1030,112,{text:'h ≪ R',g:seg(p,b,b+.08)});
  s+=wrongCard('A','(5/3)R',['mgh（h ≪ R の 近似）を 使った'],{...WOPT,g:seg(p,.03,.08)});
  return s+goalTag(G1)+ANS1(1);
 },
 // 8. 誤答 D
 [K+'wrongD']:(p,ctx)=>{
  const A=GU();
  let s=earth({r:3})+ugraph(A)+eLine(A)+meet(A);
  s+=wrongCard('D','無限遠まで 去る',['E ＜ 0 なので 折り返し点が ある'],{...WOPT,g:seg(p,.03,.08)});
  return s+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 // 9. r＝2R に縦線
 [K+'goal2']:(p)=>{
  const A=GU();
  let s=earth({r:2})+ugraph(A)+eLine(A);
  s+=fade(seg(p,.2,.35),line(A.X(2),A.Y(.12),A.X(2),A.Y(-1.12),{color:CX,w:3,dash:'7 7'}));
  return s+goalTag(G2,{g:seg(p,.03,.15)});
 },
 // 10a. すき間を薄橙で塗る
 [K+'gap']:(p)=>{
  const A=GU();
  let s=earth({r:2})+ugraph(A)+eLine(A)+line(A.X(2),A.Y(.12),A.X(2),A.Y(-1.12),{color:CX,w:3,dash:'7 7'});
  s+=fade(seg(p,.3,.45),rect(A.X(2)-16,A.Y(EE),32,A.Y(-.5)-A.Y(EE),{fill:CK,fo:.75,stroke:CK,sw:2,rx:3})+dot(A.X(2),A.Y(-.5),8,CU));
  s+=fade(seg(p,.45,.6),label('すき間 ＝ K',A.X(2)-26,A.Y(-.42)+8,{size:26,color:CK,weight:700,anchor:'end'}));
  return s+goalTag(G2);
 },
 // 10b. 式の画面：K＝E−U を一行ずつ
 [K+'gap2']:(p)=>{
  let s=L('r ＝ 2R での 運動エネルギー',FX,130,{size:26,color:C.dim});
  s+=fade(seg(p,.05,.2),T(`${cc(CK,'K')}=${cc(HI,'E')}-${cc(CU,'U')}`,FX,200,46));
  s+=fade(seg(p,.25,.45),T(`=-\\dfrac{${GMm}}{3R}+\\dfrac{${GMm}}{2R}`,FX,300,46));
  s+=fade(seg(p,.55,.7),T(`=${cc(CK,`\\dfrac{${GMm}}{6R}`)}`,FX,420,46));
  return s+goalTag(G2);
 },
 // 11. GMm/R＝mgR、両辺の m に打ち消し線 → v²＝gR/3
 [K+'v2']:(p)=>{
  let s=L('GM ＝ gR² を 使う',FX,130,{size:26,color:C.dim});
  s+=fade(seg(p,.03,.15),T(`\\dfrac{${GMm}}{R}=mgR`,FX,200,42));
  const st=seg(p,.45,.55);
  const mm=st>.5?`{\\color{${NEG}}\\cancel{\\color{${C.ink}}m}}`:'m';
  s+=fade(seg(p,.2,.35),T(`\\tfrac12 ${mm}${cc(CV,'v')}^2=\\dfrac{${mm}gR}{6}`,FX,300,46));
  s+=fade(seg(p,.5,.6),label('m が 消える',930,310,{size:24,color:NEG,weight:700}));
  s+=fade(seg(p,.62,.75),T(`${cc(CV,'v')}^2=\\dfrac{gR}{3}`,FX,420,48));
  return s+goalTag(G2);
 },
 // 12. 数値の計算（式）→ 2文目でグラフに戻り「約 4.6 km/s」。答え B
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.7,ve=voiceEnd(ctx),cA=1-seg(p,b-.04,b),cB=seg(p,b-.02,b+.03),A=GU();
  let s=fade(cA,T(`${cc(CV,'v')}^2=\\dfrac{gR}{3}`,FX,130,40)
   +fade(seg(p,.05,.2),T(`=\\dfrac{9.8\\times6.37\\times10^{6}}{3}\\approx2.08\\times10^{7}\\ \\mathrm{m^2/s^2}`,FX,250,40))
   +fade(seg(p,.35,.5),T(`${cc(CV,'v')}\\approx4.6\\times10^{3}\\ \\mathrm{m/s}=${cc(CV,'4.6\\ \\mathrm{km/s}')}`,FX,380,42)));
  s+=fade(cB,earth({r:2,vArr:.8})+ugraph(A)+eLine(A)+line(A.X(2),A.Y(.12),A.X(2),A.Y(-1.12),{color:CX,w:3,dash:'7 7'})
   +rect(A.X(2)-16,A.Y(EE),32,A.Y(-.5)-A.Y(EE),{fill:CK,fo:.75,stroke:CK,sw:2,rx:3})+label('約 4.6 km/s',A.X(2)-26,A.Y(-.42)+8,{size:28,color:CV,weight:700,anchor:'end'}));
  return s+goalTag(G2)+ANS2(seg(p,ve-.08,ve-.02));
 },
 // 13. 誤答 A → D → C（一枚ずつ）
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),m=W[0][1]*.5,A=GU();
  let s=earth({r:2,vArr:.8})+ugraph(A)+eLine(A)+line(A.X(2),A.Y(.12),A.X(2),A.Y(-1.12),{color:CX,w:3,dash:'7 7'})
   +rect(A.X(2)-16,A.Y(EE),32,A.Y(-.5)-A.Y(EE),{fill:CK,fo:.75,stroke:CK,sw:2,rx:3})+label('約 4.6 km/s',A.X(2)+26,A.Y(-.42)+8,{size:28,color:CV,weight:700});
  const cW=W[1]?W[1][0]:.6;
  s+=fade(seg(p,cW,cW+.06),draw([[A.X(1),A.Y(-1)],[A.X(2),A.Y(0)]],1,{color:NEG,w:3,dash:'10 7'})+dot(A.X(5/3),A.Y(EE),8,NEG)+label('(5/3)R',A.X(5/3)-10,A.Y(EE)+30,{size:24,color:NEG,anchor:'end',weight:700}));
  s+=wrongSeq(p,ctx,[['A','約 3.2 km/s','½ を 落とした（v² ＝ gR/6）'],['D','約 9.1 km/s','U が 増えた 分、K は 減る'],['C','通らない',['mgh の 最高点 (5/3)R は','2R より 手前']]],{win:[[0,m],[m,W[0][1]],[cW,1]],opts:WOPT});
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 // 14. 交点を黄で囲む
 [K+'goal3']:(p)=>{
  const A=GU();
  let s=earth({r:2.4})+ugraph(A)+eLine(A)+meet(A);
  s+=fade(seg(p,.2,.35),ring(A.X(3),A.Y(EE),26,{color:HI,w:4}));
  return s+goalTag(G3,{g:seg(p,.03,.15)});
 },
 // 15. 物体が 3R まで上がって一瞬止まる。速度 0 の印
 [K+'stop']:(p)=>{
  const A=GU(),u=seg(p,.05,.7),r=mix(2.4,3,1-(1-u)*(1-u));
  let s=earth({r,vArr:(1-u)*.8,stopMark:seg(p,.7,.8)})+ugraph(A)+eLine(A)+ring(A.X(3),A.Y(EE),26,{color:HI,w:4});
  s+=dot(A.X(r),A.Y(Ur(r)),8,C.ink);
  if(r<2.98)s+=rect(A.X(r)-12,A.Y(EE),24,A.Y(Ur(r))-A.Y(EE),{fill:CK,fo:.7,stroke:'none',rx:2});
  s+=fade(seg(p,.7,.8),label('すき間 K ＝ 0',A.X(3)+34,A.Y(EE)+44,{size:26,color:CK,weight:700}));
  return s+goalTag(G3);
 },
 // 16. 交点での U の接線（右上がり）と、中心向きの力
 [K+'force']:(p)=>{
  const A=GU(),k=1/9; // dU/dr＝1/r²（r＝3）
  let s=earth({r:3,stopMark:1,fArr:seg(p,.4,.55)})+ugraph(A)+eLine(A)+meet(A);
  s+=fade(seg(p,.1,.25),line(A.X(1.8),A.Y(EE-1.2*k),A.X(4.2),A.Y(EE+1.2*k),{color:HI,w:4})+label('傾き 正',A.X(3.3),205,{size:24,color:HI,weight:700}));
  s+=card(800,310,390,170,T(`${cc(CF,'F')}=-\\dfrac{d${cc(CU,'U')}}{d${cc(CX,'r')}}`,995,380,38)+fade(seg(p,.4,.55),L('中心向き、0 ではない',995,452,{size:26,color:CF,weight:700})),seg(p,.25,.35));
  return s+goalTag(G3);
 },
 // 17. 物体が向きを変えて落ち始める。答え C
 [K+'ans3']:(p,ctx)=>{
  const A=GU(),ve=voiceEnd(ctx),u=seg(p,.05,.6),r=3-.5*u*u;
  let s=earth({r,fArr:1,vDown:seg(p,.2,.3)})+ugraph(A)+eLine(A)+meet(A);
  s+=dot(A.X(r),A.Y(Ur(r)),8,C.ink);
  s+=fade(seg(p,.2,.3),label('戻って くる',EX-40,ry(r)+8,{size:24,color:CV,weight:700,anchor:'end'}));
  return s+goalTag(G3)+ANS3(seg(p,ve-.08,ve-.02));
 },
 // 18. 誤答 A → B
 [K+'wrong3']:(p,ctx)=>{
  const A=GU();
  let s=earth({r:3,fArr:1})+ugraph(A)+eLine(A)+meet(A);
  s+=wrongSeq(p,ctx,[['A','力も 0',['−GMm/r には','傾き 0 の 点が ない']],['B','U も 0','U ＝ E ＜ 0']],{opts:WOPT});
  return s+goalTag(G3)+ANS3(1);
 },
 // 19. 誤答 D
 [K+'wrongD3']:(p)=>{
  const A=GU();
  let s=earth({r:3,fArr:1})+ugraph(A)+eLine(A)+meet(A);
  s+=wrongCard('D','速さも 最も 大きい',['K ＝ E − U、','U が 大きいほど K は 小さい'],{...WOPT,g:seg(p,.03,.08)});
  return s+goalTag(G3)+ANS3(1);
 },

 // ===================== まとめ =====================
 // 20a. E＜0 と E≥0 の2本の横線
 [K+'sum']:(p)=>{
  const A=GU();
  let s=earth({obj:0})+ugraph(A);
  s+=eLine(A,{p:seg(p,.1,.3),txt:'E ＜ 0'})+fade(seg(p,.3,.4),meet(A)+label('折り返し点',A.X(3)+14,A.Y(EE)+34,{size:24,color:HI,weight:700}));
  s+=fade(seg(p,.45,.6),line(A.X(0),A.Y(.08),A.X(5),A.Y(.08),{color:C.F,w:4,dash:'12 7'})+label('E ≥ 0',A.X(5),A.Y(.08)-12,{size:24,color:C.F,weight:700,anchor:'end'}));
  return s+answerRow([[1,'C','3R'],[2,'B','約 4.6 km/s'],[3,'C','']],{g:seg(p,.65,.8)});
 },
 // 20b. 「E＜0 なら必ず戻る」
 [K+'sum2']:(p)=>{
  const A=GU();
  let s=earth({obj:0})+ugraph(A);
  s+=eLine(A,{txt:'E ＜ 0'})+meet(A)+label('折り返し点',A.X(3)+14,A.Y(EE)+34,{size:24,color:HI,weight:700});
  s+=line(A.X(0),A.Y(.08),A.X(5),A.Y(.08),{color:C.F,w:4,dash:'12 7'})+label('E ≥ 0',A.X(5),A.Y(.08)-12,{size:24,color:C.F,weight:700,anchor:'end'});
  s+=card(800,310,390,170,L('U ＝ −GMm/r では',995,365,{size:26,color:CU,weight:700})+L('E ＜ 0 なら 必ず 戻る',995,430,{size:30,color:HI,weight:700}),seg(p,.05,.15),HI);
  return s+answerRow([[1,'C','3R'],[2,'B','約 4.6 km/s'],[3,'C','']]);
 },
};

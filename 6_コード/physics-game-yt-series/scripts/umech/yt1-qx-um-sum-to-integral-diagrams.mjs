// 問題編 解説「短冊で近づき、原始関数で決める」（q-um-sum-to-integral、大学編 02 積分・中級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/02_積分.md の q-um-sum-to-integral（解説 20 行）。
// 配置：左に v–t グラフと短冊（x≈60〜600）、右に式と札の枠（x 620〜1190）。小問2 では右の枠の下に x–t 座標。札の帯（y＜78）には図を描かない。
// 色：位置 x 水色、速度 v 紫、時刻 t・幅 Δt 金、短冊は紫の薄い塗り、欠けの三角形 黄、誤り 赤、✓ 緑。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,arrow,highlight,poly,draw,tex,texWidth} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,sentWin,cueT,isProblem} from './yt1-qx-common.mjs';

const K='qx-um-sum-to-integral:';
const RED='#ff6b6b';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const TA=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:true,...o});
const cV=s=>`{\\color{${C.v}}${s}}`,cT=s=>`{\\color{${C.t}}${s}}`,cX=s=>`{\\color{${C.x}}${s}}`,cH=s=>`{\\color{${C.hi}}${s}}`,cR=s=>`{\\color{${RED}}${s}}`;
// ---- 配置 ----
const PX=620,PW=570,PC=PX+PW/2;
const WOPT={x:PX,w:PW,size:26,whySize:22};
// v–t グラフ：t 0〜2（金）、v 0〜6（紫）
const GX=90,SX=210,GB=470,SY=50;
const X=t=>GX+SX*t,Y=v=>GB-SY*v;
const G1='S₄',G3='欠けの合計と Sn',G2='t＝2 s の位置 x';
const ANS1=g=>answerTag(1,'D','4.5 m',{g}),ANS3=g=>answerTag(3,'B','',{g}),ANS2=g=>answerTag(2,'A','7 m',{g});

// ---- 部品 ----
function axesVT({g=1}={}){
 let s='';
 for(const v of [1.5,3,4.5,6])s+=line(X(0),Y(v),X(2.1),Y(v),{color:C.grid,w:1.5});
 for(const t of [.5,1,1.5,2])s+=line(X(t),Y(0),X(t),Y(6.3),{color:C.grid,w:1.5});
 s+=arrow(X(0)-10,Y(0),X(2.3),Y(0),{color:C.dim,w:2.5,head:14})+arrow(X(0),Y(0)+10,X(0),Y(6.6),{color:C.dim,w:2.5,head:14});
 for(const t of [.5,1,1.5,2])s+=line(X(t),Y(0)-6,X(t),Y(0)+6,{color:C.t,w:2})+label(String(t),X(t),Y(0)+30,{size:22,color:C.t,anchor:'middle'});
 for(const v of [1.5,3,4.5,6])s+=line(X(0)-6,Y(v),X(0)+6,Y(v),{color:C.v,w:2})+label(String(v),X(0)-12,Y(v)+8,{size:22,color:C.v,anchor:'end'});
 s+=label('0',X(0)-12,Y(0)+26,{size:22,color:C.dim,anchor:'end'});
 s+=label('t [s]',X(2.3),Y(0)+32,{size:24,color:C.t,weight:700,anchor:'end'})+label('v [m/s]',X(0)+16,Y(6.6)+6,{size:24,color:C.v,weight:700});
 return fade(g,s);
}
const vline=(p=1,o={})=>draw([[X(0),Y(0)],[X(2),Y(6)]],p,{color:C.v,w:5,...o});
const vlab=(g=1)=>fade(g,label('v ＝ 3t',X(.62),Y(3.5),{size:28,color:C.v,anchor:'end',weight:700}));
const range02=(g=1)=>fade(g,line(X(0),Y(0),X(0),Y(6.4),{color:C.t,w:2.5,dash:'7 7'})+line(X(2),Y(0),X(2),Y(6.4),{color:C.t,w:2.5,dash:'7 7'}));
// n 本の短冊（左端の高さ）。g：塗り、k：何本目まで出すか（1本ずつ出すとき）。right：右端の高さ
function strips(n,{g=1,fill=1,k=n,right=0,color=C.v,sw=2,fo=.26}={}){
 if(g<=.001)return '';
 let s='';const w=2/n;
 for(let i=0;i<Math.min(n,Math.ceil(k));i++){const a=i*w,h=3*(right?a+w:a),u=clamp(k-i);
  s+=fade(u,rect(X(a),Y(h),X(a+w)-X(a),Y(0)-Y(h),{fill:color,fo:fill?fo:0,stroke:color,sw,rx:1}));}
 return fade(g,s);
}
// 欠けの三角形（黄）
function gaps(n,{g=1,fo=.55}={}){
 if(g<=.001)return '';
 let s='';const w=2/n;
 for(let i=0;i<n;i++){const a=i*w,b=a+w;s+=poly([[X(a),Y(3*a)],[X(b),Y(3*a)],[X(b),Y(3*b)]],{fill:C.hi,fo,stroke:C.hi,sw:n>20?0:1.5});}
 return fade(g,s);
}
const triFill=(g=1,col=C.v)=>fade(g,poly([[X(0),Y(0)],[X(2),Y(0)],[X(2),Y(6)]],{fill:col,fo:.28,stroke:'none'}));
// 拡大した欠けの三角形（右の枠の中）。hLab：高さの札（'3Δt' か '？'）
function inset(cx,cy,{g=1,base=1,slope=0,hLab='',hCol=C.hi,size=1}={}){
 const bw=220*size,bh=bw*3*SY/SX,x0=cx-bw/2,y0=cy+bh/2;
 let s=poly([[x0,y0],[x0+bw,y0],[x0+bw,y0-bh]],{fill:C.hi,fo:.35,stroke:C.hi,sw:3});
 s+=fade(base,line(x0,y0+14,x0+bw,y0+14,{color:C.t,w:3})+T(cT('\\Delta t'),x0+bw/2,y0+46,34));
 s+=fade(slope,label('傾き 3',x0+bw/2-30,y0-bh/2-14,{size:26,color:C.v,anchor:'end',weight:700}));
 if(hLab)s+=line(x0+bw+14,y0,x0+bw+14,y0-bh,{color:hCol,w:3})+(hLab==='？'?label('？',x0+bw+28,y0-bh/2+12,{size:34,color:hCol,weight:700}):T(`{\\color{${hCol}}3\\Delta t}`,x0+bw+30,y0-bh/2+8,34,{anchor:'start'}));
 return fade(g,s);
}
// 拡大する三角形の印（n＝4 の3本目）
const ZI=2,zoomMark=(g=1)=>{const a=ZI*.5,b=a+.5,cx=(X(a)+X(b))/2+20,cy=(Y(3*a)+Y(3*b))/2+8;return fade(g,ring(cx,cy,48,{color:C.hi,w:3}));};
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
// x–t 座標（右下）
const XA={x:700,y:470,w:380,h:156,tmax:2.2,xmax:8};
const XX=t=>XA.x+XA.w*t/XA.tmax,XY=x=>XA.y-XA.h*x/XA.xmax;
function axesXT({g=1}={}){
 let s=rect(PX,292,PW,220,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:14});
 for(const x of [2,4,6,8])s+=line(XX(0),XY(x),XX(2.1),XY(x),{color:C.grid,w:1.5});
 for(const t of [1,2])s+=line(XX(t),XY(0),XX(t),XY(8),{color:C.grid,w:1.5});
 s+=arrow(XX(0)-8,XY(0),XX(2.25),XY(0),{color:C.dim,w:2.5,head:12})+arrow(XX(0),XY(0)+8,XX(0),XY(8.6),{color:C.dim,w:2.5,head:12});
 for(const t of [1,2])s+=label(String(t),XX(t),XY(0)+26,{size:20,color:C.t,anchor:'middle'})+line(XX(t),XY(0)-5,XX(t),XY(0)+5,{color:C.t,w:2});
 for(const x of [2,4,6,8])s+=label(String(x),XX(0)-10,XY(x)+7,{size:20,color:C.x,anchor:'end'});
 s+=label('t [s]',XX(2.25)+4,XY(0)+28,{size:22,color:C.t,weight:700})+label('x [m]',XX(0)+12,XY(8.6)+12,{size:22,color:C.x,weight:700});
 return fade(g,s);
}
const xcurve=(c,{p=1,color=C.x,w=4,opacity=1}={})=>draw(Array.from({length:41},(_,i)=>{const t=2*i/40;return [XX(t),XY(1.5*t*t+c)];}).filter(q=>q[1]>=XY(8.4)-1),p,{color,w,opacity});
const startPt=(g=1)=>fade(g,dot(XX(0),XY(1),8,C.x)+label('x＝1',XX(0)+14,XY(1)-8,{size:22,color:C.x,weight:700}));
// 小問1 の計算（右の枠）
const S4eq=(g1=1,g2=1)=>fade(g1,T(`(0+1.5+3+4.5)\\times${cT('0.5')}`,PC,190,36))+fade(g2,T(`=9\\times${cT('0.5')}=${cX('4.5\\ \\mathrm{m}')}`,PC,250,36));
// 表 n → Sn
const TAB=[[4,'4.5'],[8,'5.25'],[16,'5.625'],[100,'5.94']];

export const ytQxUmSumToIntegralDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（約5秒）：v＝3t（紫）、0〜2 s の点線、短冊4本の輪郭を左から1本ずつ（左端の高さ。数値は出さない）
 [K+'q1']:(p)=>{
  let s=axesVT({g:seg(p,0,.15)})+range02(seg(p,.1,.22))+vline(seg(p,.12,.35))+vlab(seg(p,.3,.4));
  s+=strips(4,{fill:0,k:4*clamp((p-.42)/.5),sw:3});
  return s;
 },
 // 小問2（約5秒）：v–t グラフ（短冊なし）と、横に x–t 座標。t＝0 で x＝1 の点だけ（式と曲線は出さない）
 [K+'q2']:(p)=>{
  let s=axesVT({g:seg(p,0,.15)})+range02()+vline(seg(p,.05,.25))+vlab(seg(p,.2,.3));
  s+=axesXT({g:seg(p,.35,.55)})+startPt(seg(p,.6,.75));
  s+=fade(seg(p,.6,.75),label('t ＝ 0 の 位置',XX(.5),XY(1)-30,{size:22,color:C.x,weight:700}));
  return s;
 },
 // 小問3（約5秒）：4本の短冊の上の欠けを黄に、1つを拡大して底辺 Δt・高さ「？」。続けて本数を 4 → 8 → 16（Sn の値は出さない）
 [K+'q3']:(p)=>{
  const n=p<.62?4:p<.8?8:16;
  let s=axesVT()+range02()+strips(n,{fill:1})+vline(1)+vlab(1)+gaps(n,{g:seg(p,.1,.25)});
  s+=zoomMark(seg(p,.28,.36)*(1-seg(p,.58,.62)));
  s+=panel(90,300,label('欠けの 三角形（拡大）',PC,130,{size:24,color:C.dim,anchor:'middle'})+inset(PC-20,250,{hLab:'？',hCol:C.hi}),seg(p,.32,.45));
  s+=fade(seg(p,.62,.66),label(`n ＝ ${n}`,X(1.15),Y(6.6)+6,{size:28,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },

 // ===================== 問題の設定 =====================
 // 1. v–t グラフと 0〜2 s の点線。「面積」で三角形を一瞬光らせ、消す
 [K+'setup']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=axesVT()+range02()+vline(1)+vlab(1);
  s+=triFill(seg(p,b+.05,b+.12)*(1-seg(p,b+.3,b+.4)));
  s+=panel(90,250,T(`${cV('v')}=3${cT('t')}`,PC,165,46)+label('0 s 〜 2 s',PC,230,{size:30,color:C.t,anchor:'middle',weight:700})
   +fade(seg(p,b,b+.1),label('短冊 → 面積 → 原始関数',PC,295,{size:26,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.1));
  return s;
 },

 // ===================== 小問1 =====================
 // 2. 短冊4本の輪郭。1本を光らせ、高さに「速度」、幅に「時間」
 [K+'goal1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,h=seg(p,b,b+.08);
  let s=axesVT()+range02()+strips(4,{fill:0,k:4*seg(p,.05,.3),sw:3})+vline(1)+vlab(1);
  const a=1,c=1.5,hv=3;
  s+=fade(h,rect(X(a),Y(hv),X(c)-X(a),Y(0)-Y(hv),{fill:C.hi,fo:.15,stroke:C.hi,sw:4,rx:1})
   +label('速度',X(a)-10,Y(hv/2)+8,{size:24,color:C.v,anchor:'end',weight:700})+label('時間',(X(a)+X(c))/2,Y(0)-14,{size:24,color:C.t,anchor:'middle',weight:700}));
  s+=panel(90,250,label('短冊 1本の 面積',PC,135,{size:26,color:C.dim,anchor:'middle'})
   +fade(h,label('高さ（速度）× 幅（時間）',PC,195,{size:30,color:C.ink,anchor:'middle',weight:700})+label('＝ その間に 進んだ 距離の 見積もり',PC,250,{size:26,color:C.x,anchor:'middle'})),seg(p,0,.1));
  s+=goalTag(G1,{g:seg(p,.02,.1)});
  return s;
 },
 // 3. 幅 0.5（金）。左上の角に黄の点、高さ 0、1.5、3、4.5（紫）。短冊を紫の薄い塗りに
 [K+'heights']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=axesVT()+range02()+strips(4,{fill:0,sw:3})+strips(4,{g:seg(p,b+.4,b+.55),sw:0})+vline(1)+vlab(1);
  s+=fade(seg(p,.05,.2),line(X(.5),Y(0)-10,X(1),Y(0)-10,{color:C.t,w:3})+label('0.5',X(.75),Y(0)-20,{size:24,color:C.t,anchor:'middle',weight:700}));
  [0,1,2,3].forEach(i=>{const a=i*.5,g=seg(p,b+.06+i*.08,b+.14+i*.08);
   s+=fade(g,dot(X(a),Y(3*a),8,C.hi)+label(['0','1.5','3','4.5'][i],X(a)+(i?6:14),Y(3*a)-14,{size:24,color:C.v,weight:700}));});
  s+=panel(90,200,label('幅',PX+90,150,{size:26,color:C.dim,anchor:'middle'})+T(`2\\div4=${cT('0.5\\ \\mathrm{s}')}`,PC+40,150,36)
   +fade(seg(p,b,b+.08),label('左端の 高さ',PX+120,225,{size:26,color:C.dim,anchor:'middle'})+T(cV('0,\\ 1.5,\\ 3,\\ 4.5'),PC+60,225,36)),seg(p,0,.08));
  s+=goalTag(G1);
  return s;
 },
 // 4. (0＋1.5＋3＋4.5)×0.5＝9×0.5＝4.5 m。答えの札 D（4.5 m）
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=axesVT()+range02()+strips(4)+vline(1)+vlab(1);
  s+=panel(90,200,label('左端の 高さ × 幅',PC,130,{size:24,color:C.dim,anchor:'middle'})+S4eq(seg(p,.03,.15),seg(p,.3,.45)),1);
  s+=fade(seg(p,.4,.5),label('S₄ ＝ 4.5 m',X(.75),Y(5.6),{size:32,color:C.x,anchor:'middle',weight:700}));
  s+=goalTag(G1)+ANS1(seg(p,b,b+.08));
  return s;
 },
 // 5. 誤答 C（幅を掛けていない）→ 誤答 B（右端の高さ）。B のとき右端の短冊を赤の輪郭で重ねる
 [K+'wrongCB']:(p,ctx)=>{
  const W=sentWin(ctx),wC=[0,W[0][1]],wB=[W[1]?W[1][0]:.5,1],inB=seg(p,wB[0]+.01,wB[0]+.06);
  let s=axesVT()+range02()+strips(4)+vline(1)+vlab(1)+strips(4,{g:inB,right:1,fill:0,color:RED,sw:3.5});
  s+=panel(90,200,label('左端の 高さ × 幅',PC,130,{size:24,color:C.dim,anchor:'middle'})+S4eq(),1);
  s+=wrongSeq(p,ctx,[['C','9 m',['幅 0.5 を 掛けていない（単位は m/s のまま）'],{mid:'0+1.5+3+4.5=9'}],['B','7.5 m',['右端の 高さ 1.5、3、4.5、6 を 使った'],{mid:'(1.5+3+4.5+6)\\times0.5=7.5'}]],{win:[wC,wB],opts:{...WOPT,y:305}});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },
 // 6. 底辺2・高さ6の三角形の輪郭（紫）に「6」。欠けの三角形4つを黄に。誤答カード A
 [K+'wrongA']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=axesVT()+range02()+strips(4)+vline(1)+vlab(1);
  s+=fade(seg(p,.05,.15)*(1-seg(p,b,b+.08)),poly([[X(0),Y(0)],[X(2),Y(0)],[X(2),Y(6)]],{fill:'none',fo:0,stroke:C.v,sw:5})+label('6',X(1.55),Y(1.6),{size:40,color:C.ink,anchor:'middle',weight:700}));
  s+=gaps(4,{g:seg(p,b,b+.1)});
  s+=fade(seg(p,b+.08,b+.18),label('欠け',X(1.9)+30,Y(5.5),{size:26,color:C.hi,weight:700}));
  s+=panel(90,200,label('左端の 高さ × 幅',PC,130,{size:24,color:C.dim,anchor:'middle'})+S4eq(),1);
  s+=wrongCard('A','6 m',['積分の 値（4本では 欠けが 残る）'],{...WOPT,y:305,mid:'\\tfrac12\\times2\\times6=6',g:seg(p,.03,.1)});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },

 // ===================== 小問3 =====================
 // 7. 欠けの三角形を黄に、1つを拡大（右の枠）
 [K+'goal3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=axesVT()+range02()+strips(4)+vline(1)+vlab(1)+gaps(4);
  s+=zoomMark(seg(p,b,b+.08));
  s+=panel(90,330,label('欠けの 三角形（拡大）',PC,130,{size:24,color:C.dim,anchor:'middle'})+inset(PC-20,265,{base:0,g:seg(p,b+.06,b+.2)}),seg(p,b,b+.06));
  s+=fade(seg(p,b+.1,b+.2),line(X(1.25)+40,Y(4.5),PX,250,{color:C.hi,w:2,dash:'6 6'}));
  s+=fade(seg(p,.05,.15)*(1-seg(p,b-.05,b)),panel(90,200,label('n 等分 すると？',PC,160,{size:32,color:C.hi,anchor:'middle',weight:700})+label('欠けの 合計 と Sn',PC,225,{size:28,color:C.ink,anchor:'middle'}),1,C.hi));
  s+=goalTag(G3,{g:seg(p,.02,.1)});
  return s;
 },
 // 8. 底辺 Δt、斜辺「傾き 3」、高さ 3Δt（黄）
 [K+'tri']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=axesVT()+range02()+strips(4)+vline(1)+vlab(1)+gaps(4)+zoomMark(1);
  s+=line(X(1.25)+40,Y(4.5),PX,250,{color:C.hi,w:2,dash:'6 6'});
  s+=panel(90,330,label('欠けの 三角形（拡大）',PC,130,{size:24,color:C.dim,anchor:'middle'})
   +inset(PC-20,265,{base:seg(p,.05,.15),slope:seg(p,b,b+.1),hLab:seg(p,b+.2,b+.3)>0?'3Δt':''}),1);
  s+=fade(seg(p,b+.3,b+.4),label('Δt 進むと 高さは 3Δt',PC,445,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=goalTag(G3);
  return s;
 },
 // 9. ½×Δt×3Δt → Δt＝2/n を代入（2/n を光らせる）→ ½×(2/n)×(6/n)＝6/n²（式が主役）
 [K+'area1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=inset(240,270,{size:.9,hLab:'3Δt'})+label('1つの 欠け',240,140,{size:26,color:C.dim,anchor:'middle'});
  s+=T(`\\dfrac12\\times${cT('\\Delta t')}\\times3${cT('\\Delta t')}`,780,150,44);
  s+=fade(seg(p,b,b+.1),rect(600,200,360,84,{fill:C.t,fo:.12,stroke:C.t,sw:2.5,rx:10})+T(`${cT('\\Delta t')}=\\dfrac{2}{n}`,780,248,34));
  s+=fade(seg(p,b+.15,b+.3),T(`=\\dfrac12\\times${cT('\\dfrac{2}{n}')}\\times\\dfrac{6}{n}`,780,350,44));
  s+=fade(seg(p,b+.35,b+.48),T(`=${cH('\\dfrac{6}{n^2}')}`,780,460,48));
  s+=goalTag(G3);
  return s;
 },
 // 10. 欠けが n 個並ぶ図に「×n」。6/n²×n＝6/n。Sn＝6−6/n を大きく。答えの札 B
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=axesVT()+range02()+strips(8)+vline(1)+vlab(1)+gaps(8);
  s+=fade(seg(p,.03,.12),label('欠けが n 個',X(.7),Y(5.6),{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=panel(90,410,label('欠けの 合計',PC,130,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.08,.2),T(`\\dfrac{6}{n^2}\\times n=${cH('\\dfrac{6}{n}')}`,PC,200,42))
   +fade(seg(p,b,b+.1),line(PX+40,265,PX+PW-40,265,{color:C.faint,w:2})+label('Sn ＝ 三角形 6 − 欠け',PC,305,{size:24,color:C.dim,anchor:'middle'}))
   +fade(seg(p,b+.08,b+.2),T(`S_n=6-\\dfrac{6}{n}`,PC,400,56)),1);
  s+=goalTag(G3)+ANS3(seg(p,b+.28,b+.36));
  return s;
 },
 // 11. n＝4 を入れて 6−1.5＝4.5。小問1 の 4.5 と並べて緑の ✓
 [K+'check']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=axesVT()+range02()+strips(4)+vline(1)+vlab(1)+gaps(4);
  s+=panel(90,410,T(`S_n=6-\\dfrac{6}{n}`,PC,160,44)
   +fade(seg(p,.05,.18),label('n ＝ 4',PC,240,{size:28,color:C.ink,anchor:'middle',weight:700}))
   +fade(seg(p,.15,.3),T(`S_4=6-\\dfrac{6}{4}=6-1.5=${cX('4.5')}`,PC,310,38))
   +fade(seg(p,b,b+.1),line(PX+40,365,PX+PW-40,365,{color:C.faint,w:2})+label('小問1 の S₄ ＝ 4.5',PC-30,425,{size:28,color:C.ink,anchor:'middle',weight:700})+label('✓',PC+170,428,{size:40,color:C.F,anchor:'middle',weight:700})),1);
  s+=goalTag(G3)+ANS3(1);
  return s;
 },
 // 12. 誤答 A → C → D を1枚ずつ
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),s1=W[1]?W[1][0]:.35,mid=s1+(1-s1)*.38;
  let s=axesVT()+range02()+strips(4)+vline(1)+vlab(1)+gaps(4);
  s+=panel(90,200,label('欠けの 合計 と Sn',PC,130,{size:24,color:C.dim,anchor:'middle'})+T(`\\dfrac{6}{n},\\qquad S_n=6-\\dfrac{6}{n}`,PC,210,38),1);
  s+=wrongSeq(p,ctx,[['A','6/n²',['三角形 1つ分 だけ（三角形は n 個 ある）']],['C','2/n',['高さを Δt と した（正しくは 3Δt）']],['D','8−8/n',['単元の 動画の v ＝ t、0〜4 s の 式']]],{win:[[0,s1],[s1,mid],[mid,1]],opts:{...WOPT,y:310}});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },
 // 13. 本数を 4→8→16→100、欠けが細くなる。表と数直線。→ 札を図の上に置いてから ∫₀² 3t dt ＝ 短冊の和が近づく値
 [K+'limit']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,u=clamp(p/(b*.85));
  const ki=Math.min(3,Math.floor(u*4)),n=TAB[ki][0];
  const cA=1-seg(p,b-.03,b),cB=seg(p,b,b+.05);
  let s=axesVT()+range02()+strips(n,{sw:n>20?.6:2})+vline(1)+gaps(n,{fo:.7})+vlab(1-cB);
  s+=fade(cA,label(`n ＝ ${n}`,X(.7),Y(5.6),{size:30,color:C.ink,anchor:'middle',weight:700}));
  // 表と数直線（1文目）
  let tb=label('n',PX+130,135,{size:28,color:C.ink,anchor:'middle',weight:700})+label('Sn',PX+330,135,{size:28,color:C.x,anchor:'middle',weight:700});
  TAB.forEach(([nn,sv],i)=>{const g=i<=ki?1:0;tb+=fade(g,label(String(nn),PX+130,180+i*42,{size:28,color:C.ink,anchor:'middle'})+label(sv,PX+330,180+i*42,{size:28,color:C.x,anchor:'middle'}));});
  const NX=v=>PX+60+(v-4)/2*(PW-120),ny=400;
  tb+=line(NX(4),ny,NX(6.1),ny,{color:C.dim,w:2.5})+[4,5,6].map(v=>line(NX(v),ny-8,NX(v),ny+8,{color:C.dim,w:2})+label(String(v),NX(v),ny+34,{size:22,color:C.dim,anchor:'middle'})).join('');
  tb+=dot(NX(6),ny,7,C.hi)+label('6',NX(6),ny-18,{size:24,color:C.hi,anchor:'middle',weight:700});
  TAB.forEach(([nn,sv],i)=>{if(i<=ki)tb+=dot(NX(+sv),ny,i===ki?9:6,C.x,i===ki?1:.5);});
  tb+=fade(seg(p,b*.75,b*.9),label('下から 6 に 近づく',PC,470,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(cA,panel(90,410,tb,1));
  // 札（2文目）：図の上に先に置く
  const g1=seg(p,b+.03,b+.1),g2=seg(p,b+.1,b+.17),g3=seg(p,b+.17,b+.24),g4=seg(p,b+.3,b+.4);
  s+=fade(g1,label('3t ＝ 高さ（速度）',X(.1),Y(4.6),{size:24,color:C.v,weight:700}));
  s+=fade(g2,label('dt ＝ 細くした 幅',X(1.4),Y(0)-14,{size:24,color:C.t,anchor:'middle',weight:700}));
  s+=fade(g3,label('0〜2 ＝ 足す 範囲',X(1.15),Y(6.3),{size:24,color:C.t,anchor:'middle',weight:700})+line(X(0),Y(0),X(0),Y(6.4),{color:C.t,w:5})+line(X(2),Y(0),X(2),Y(6.4),{color:C.t,w:5}));
  s+=fade(cB,panel(90,300,fade(g4,TA('\\int_0^2 3t\\,dt',PC,200,56))+fade(seg(p,b+.4,b+.5),label('＝ 短冊の 和が 近づく 値',PC,300,{size:30,color:C.hi,anchor:'middle',weight:700})+label('（定積分）',PC,350,{size:24,color:C.dim,anchor:'middle'})),1,C.hi));
  s+=goalTag(G3);
  return s;
 },

 // ===================== 小問2 =====================
 // 14. 右下に x–t 座標と t＝0、x＝1 の点
 [K+'goal2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=axesVT()+range02()+vline(1)+vlab(1);
  s+=axesXT({g:seg(p,.1,.22)})+startPt(seg(p,.2,.3));
  s+=panel(90,190,label('t ＝ 2 s の 位置 は？',PC,150,{size:32,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,b,b+.1),label('短冊を 数えずに 原始関数で',PC,215,{size:28,color:C.ink,anchor:'middle'})),seg(p,.03,.12),C.hi);
  s+=goalTag(G2,{g:seg(p,.02,.1)});
  return s;
 },
 // 15. (3t²/2)′＝3/2×2t＝3t を一操作ずつ（2 が約分で消える）。「原始関数」で 3t²/2 を黄の枠
 [K+'prim']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=axesVT()+range02()+vline(1)+vlab(1)+axesXT()+startPt();
  const cn=seg(p,b*.5,b*.65);
  const two=cn>.5?`{\\color{${RED}}\\cancel{\\color{${C.ink}}2}}`:'2';
  const q1='\\left(\\dfrac{3t^2}{2}\\right)\'',q2=`=\\dfrac{3}{${two}}\\times ${two}t`,q3='=3t',sz=36;
  const w1=texWidth(q1,sz),w2=texWidth(q2,sz),w3=texWidth(q3,sz),x0=PC-(w1+w2+w3+24)/2;
  let pn=TA(q1,x0,160,sz,{anchor:'start'});
  pn+=fade(seg(p,.1,.25),TA(q2,x0+w1+12,160,sz,{anchor:'start'}));
  pn+=fade(seg(p,b*.7,b*.85),TA(q3,x0+w1+w2+24,160,sz,{anchor:'start'}));
  pn+=fade(seg(p,b,b+.1),rect(PX+30,204,PW-60,76,{fill:C.hi,fo:.08,stroke:C.hi,sw:3,rx:12})+label('3t の 原始関数 ＝',PX+190,252,{size:28,color:C.ink,anchor:'middle',weight:700})+TA('\\dfrac{3t^2}{2}',PX+400,246,32));
  s+=panel(90,196,pn,1);
  s+=goalTag(G2);
  return s;
 },
 // 16. 札「F(t)＝3t²/2（3t の原始関数）」→ F(2)−F(0)＝6−0＝6。三角形の 6 と黄の線で結ぶ。x–t の横に水色の矢印「6 m」
 [K+'diff']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=axesVT()+range02()+triFill(1)+vline(1)+vlab(1)+axesXT()+startPt();
  s+=label('6',X(1.55),Y(1.6),{size:40,color:C.hi,anchor:'middle',weight:700})+label('短冊が 近づく 値',X(1.3),Y(-0)-50,{size:22,color:C.hi,anchor:'middle'});
  let pn=fade(seg(p,.02,.1),T(`F(${cT('t')})=\\dfrac{3${cT('t')}^2}{2}`,PX+150,150,34)+label('（3t の 原始関数）',PX+400,158,{size:24,color:C.dim,anchor:'middle'}));
  pn+=fade(seg(p,.14,.3),T(`F(2)-F(0)=6-0=${cH('6')}`,PC,235,40));
  s+=panel(90,190,pn,1);
  s+=fade(seg(p,.35,.45),line(PX+30,235,X(1.55)+24,Y(1.6)-18,{color:C.hi,w:3}));
  s+=fade(seg(p,b,b+.1),arrow(XX(2.12)+24,XY(0),XX(2.12)+24,XY(6),{color:C.x,w:5,head:14})+label('変位 6 m',XX(2.12)+12,XY(3),{size:22,color:C.x,weight:700,anchor:'end'}));
  s+=goalTag(G2);
  return s;
 },
 // 17. 縦にずれた曲線の家族（水色の薄い線）。「C＝1」で x(0)＝1 を通る1本だけ光らせ、他は消える
 [K+'family']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,sel=seg(p,b+.15,b+.3);
  let s=axesVT()+range02()+vline(1)+vlab(1)+axesXT();
  for(const c of [-2,-1,0,2,3])s+=fade(seg(p,.1,.25)*(1-sel),xcurve(c,{color:C.x,w:2.5,opacity:.45}));
  s+=fade(seg(p,.1,.25),xcurve(1,{color:C.x,w:2.5+2.5*sel,opacity:.45+.55*sel}));
  s+=startPt(seg(p,b,b+.08));
  let pn=TA('x=\\dfrac{3t^2}{2}+C',PC,150,40);
  pn+=fade(seg(p,.25,.35),label('速度だけでは C が 決まらない',PC,215,{size:24,color:C.dim,anchor:'middle'}));
  pn+=fade(seg(p,b+.05,b+.15),T(`${cX('x')}(0)=C=1`,PC,265,36));
  s+=panel(90,195,pn,1);
  s+=goalTag(G2);
  return s;
 },
 // 18. 光った曲線の t＝2 に点と「7」。x(2)＝6＋1＝7 m。答えの札 A（7 m）
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=axesVT()+range02()+vline(1)+vlab(1)+axesXT()+xcurve(1,{w:5})+startPt();
  s+=fade(seg(p,.05,.15),dot(XX(2),XY(7),9,C.hi)+label('7',XX(2)+16,XY(7)+8,{size:26,color:C.hi,weight:700}));
  s+=panel(90,195,TA('x=\\dfrac{3t^2}{2}+1',PC,140,36)+fade(seg(p,.1,.25),T(`${cX('x')}(2)=6+1=${cX('7\\ \\mathrm{m}')}`,PC,230,40)),1);
  s+=goalTag(G2)+ANS2(seg(p,b,b+.08));
  return s;
 },
 // 19. 誤答 B → C → D を1枚ずつ（右の枠の位置）
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),s1=W[1]?W[1][0]:.35,mid=s1+(1-s1)*.45;
  let s=axesVT()+range02()+vline(1)+vlab(1)+axesXT()+xcurve(1,{w:5})+startPt()+dot(XX(2),XY(7),9,C.hi)+label('7',XX(2)+16,XY(7)+8,{size:26,color:C.hi,weight:700});
  s+=wrongSeq(p,ctx,[['B','6 m',['変位の まま（出発点 1 m を 足していない）']],['C','13 m',['原始関数を 3t² と した（微分すると 6t）'],{mid:'3\\times2^2+1=13'}],['D','5.5 m',['S₄ ＝ 4.5 に 1 を 足した'],{mid:'4.5+1=5.5'}]],{win:[[0,s1],[s1,mid],[mid,1]],opts:{...WOPT,y:90}});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },

 // ===================== まとめ =====================
 // 20. 左に短冊（S₄＝4.5 → Sn＝6−6/n → 6）、右に F(2)−F(0)＝6。両方の 6 を黄の枠で結ぶ。下で 6 に C＝1 を足して 7 m
 [K+'sum']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  const gL=seg(p,.02,.12),gR=seg(p,b,b+.08),gB=seg(p,b+.3,b+.4);
  let s=card(20,90,560,250,'',gL);
  const mX=t=>60+t*90,mY=v=>300-v*30;
  let mini=line(mX(0),mY(0),mX(2.2),mY(0),{color:C.dim,w:2})+line(mX(0),mY(0),mX(0),mY(6.5),{color:C.dim,w:2});
  for(let i=0;i<8;i++){const a=i*.25;mini+=rect(mX(a),mY(3*a),mX(a+.25)-mX(a),mY(0)-mY(3*a),{fill:C.v,fo:.26,stroke:C.v,sw:1,rx:0});}
  mini+=line(mX(0),mY(0),mX(2),mY(6),{color:C.v,w:3});
  s+=fade(gL,mini+label('S₄ ＝ 4.5',300,140,{size:28,color:C.x,weight:700})+label('↓',340,180,{size:26,color:C.dim})
   +T('S_n=6-\\dfrac{6}{n}',380,215,30)+label('↓ n を 増やす',300,268,{size:24,color:C.dim})+rect(300,282,110,48,{fill:C.hi,fo:.1,stroke:C.hi,sw:3,rx:10})+label('6',355,318,{size:32,color:C.hi,anchor:'middle',weight:700}));
  s+=card(620,90,560,250,label('原始関数の 差',900,140,{size:26,color:C.dim,anchor:'middle'})
   +T(`F(2)-F(0)`,900,215,40)+label('＝',900,272,{size:30,color:C.ink,anchor:'middle'})+rect(845,282,110,48,{fill:C.hi,fo:.1,stroke:C.hi,sw:3,rx:10})+label('6',900,318,{size:32,color:C.hi,anchor:'middle',weight:700}),gR);
  s+=fade(gR,line(410,306,845,306,{color:C.hi,w:3})+label('同じ 6（積分）',600,354,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=card(200,370,800,120,T(`6+${cX('C')}=6+1`,430,440,40)+arrow(570,430,660,430,{color:C.x,w:5,head:16})+T(`${cX('x')}(2)=${cX('7\\ \\mathrm{m}')}`,800,440,40)
   +label('出発点 C ＝ 1',430,478,{size:22,color:C.dim,anchor:'middle'}),gB,C.x);
  s+=answerRow([[1,'D','4.5 m'],[2,'A','7 m'],[3,'B','']],{g:seg(p,.9,.97)});
  return s;
 },
};

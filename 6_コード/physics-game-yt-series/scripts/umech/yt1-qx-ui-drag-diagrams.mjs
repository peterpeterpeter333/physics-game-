// 問題編 解説「2 kg の球の終端速度」（q-ui-drag、大学編 11 空気抵抗・初級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/11_空気抵抗.md の q-ui-drag（解説 18 行）。
// 配置：左に落ちる球（力の矢印 緑・速度 紫・加速度 赤）、右に v–t グラフか説明の枠。札は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 色：速度 v 紫、加速度 a 赤、力（重力・抵抗）緑、時間 t 金、終端速度の線・強調 黄（単元動画と同じ）。
// 力の矢印は 1 N ＝ 5 px、速度の矢印は 1 m/s ＝ 16 px（図のために決めた縮尺）。
// v–t グラフの曲線：v＝4(1−e^(−t/0.4))（静止から）、v＝4＋2e^(−t/0.4)（6 m/s から）。τ＝m/k＝0.4 s。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth} from './anim.mjs';
import {QC,card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,cueT,tAt,sentWin,isProblem} from './yt1-qx-common.mjs';

const K='qx-ui-drag:';
const CF=QC.F,CV=QC.v,CA=QC.a,CT=QC.t,CH=QC.hi;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const FS=5,VS=16,BX=230,BY=300,BR=34;
const G1='終端速度 v∞',G2='v＝3 m/s の瞬間の加速度 a',G3='その後の速度の変わり方';
const ANS1=g=>answerTag(1,'B','4 m/s',{g}),ANS2=g=>answerTag(2,'C','2.5 m/s²',{g}),ANS3=g=>answerTag(3,'D','',{g});
const WOPT={size:26,whySize:24};
const vUp=t=>4*(1-Math.exp(-t/.4)),vDn=t=>4+2*Math.exp(-t/.4);

// ---- 球と矢印 ----
// grav/res：力 [N]、vel：速度 [m/s]（左に紫）、acc：加速度 [m/s²]（右に赤、負は上向き）
function ball({x=BX,y=BY,grav=0,gTxt='',res=0,rTxt='',rG=1,vel=0,vTxt='',acc=0,aTxt='',g=1,mass='2 kg'}={}){
 let s=ring(x,y,BR,{color:C.dim,w:3,fill:'#2b3d63'})+label(mass,x,y+8,{size:22,color:C.ink,anchor:'middle',weight:700});
 if(grav>0)s+=arrow(x,y+BR,x,y+BR+grav*FS,{color:CF,w:6,head:16})+(gTxt?label(gTxt,x+16,y+BR+grav*FS-6,{size:26,color:CF,weight:700}):'');
 if(res*FS>4)s+=fade(rG,arrow(x,y-BR,x,y-BR-res*FS,{color:CF,w:6,head:16})+(rTxt?label(rTxt,x+16,y-BR-res*FS+20,{size:26,color:CF,weight:700}):''));
 if(vel*VS>4){const L=vel*VS,vx=x-85;s+=arrow(vx,y-L/2,vx,y+L/2,{color:CV,w:7,head:16})+(vTxt?label(vTxt,vx-12,y+L/2-4,{size:26,color:CV,anchor:'end',weight:700}):'');}
 if(Math.abs(acc)>.05){const L=Math.abs(acc)*14*Math.sign(acc),ax=x+80;s+=arrow(ax,y-L/2,ax,y+L/2,{color:CA,w:6,head:16})+(aTxt?label(aTxt,ax+14,y+(acc<0?-L/2:L/2)+8,{size:26,color:CA,weight:700}):'');}
 return fade(g,s);
}
// 下向きが正（左上）
const plusDown=(g=1)=>fade(g,arrow(55,110,55,200,{color:CH,w:4,head:14})+label('＋',72,170,{size:28,color:CH,weight:700})+label('下向きが正',55,232,{size:22,color:CH,anchor:'middle',weight:700}));
// 背景の目盛り（上へ流れる。off＝流れた距離 px）
function ticks(off=0,g=1){let s='';const sp=44,o=((off%sp)+sp)%sp;
 for(let y=96-o+sp;y<500;y+=sp)s+=line(110,y,128,y,{color:C.faint,w:3})+line(332,y,350,y,{color:C.faint,w:3});
 return fade(g,line(119,90,119,505,{color:C.grid,w:2})+line(341,90,341,505,{color:C.grid,w:2})+s);}
// 抵抗のモデルの札（球の上）
const modelCard=(g=1,x=110,y=86)=>card(x,y,350,128,kindTag('前提（モデル）',x+250,y+32,{color:C.dim,size:22})
 +label('抵抗 R ＝ kv（上向き）',x+18,y+76,{size:26,color:CF,weight:700})+label('k ＝ 5 N·s/m',x+18,y+114,{size:26,color:CF,weight:700}),g,CF);
// v–t グラフ（目盛りの文字は 22px）
function vt({x=640,y=450,w=470,h=320,xmax=2,ymax=7,g=1}={}){
 const X=u=>x+w*u/xmax,Y=v=>y-h*v/ymax;
 let s=arrow(x-8,y,x+w+24,y,{color:C.dim,w:2.5,head:14})+arrow(x,y+8,x,y-h-24,{color:C.dim,w:2.5,head:14});
 for(const u of [.5,1,1.5])s+=line(X(u),y-6,X(u),y+6,{color:C.dim})+label(String(u),X(u),y+32,{size:22,color:C.dim,anchor:'middle'});
 for(const v of [2,4,6])s+=line(x-6,Y(v),x+6,Y(v),{color:C.dim})+label(String(v),x-12,Y(v)+8,{size:22,color:C.dim,anchor:'end'});
 s+=label('t [s]',x+w+28,y+8,{size:24,color:CT})+label('v [m/s]',x,y-h-34,{size:24,color:CV,anchor:'middle'});
 const plot=(fn,{from=0,to=xmax,p=1,color=CV,w:ww=4,dash=''}={})=>draw(Array.from({length:121},(_,i)=>{const u=from+(to-from)*i/120;return [X(u),Y(fn(u))];}),p,{color,w:ww,dash});
 return {svg:fade(g,s),X,Y,plot,x,y,w,h};
}
const vinfLine=(A,g=1,txt='v∞ ＝ 4 m/s')=>fade(g,line(A.X(0),A.Y(4),A.X(2),A.Y(4),{color:CH,w:3,dash:'10 7'})+(txt?label(txt,A.X(2),A.Y(4)+34,{size:24,color:CH,anchor:'end',weight:700}):''));
// 右の説明の枠
const PX=470,PW=710,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
// 小問2 の3段の表
function table({r1=0,r2=0,r3=0,g=1}={}){
 const rows=[['合力',r1,'5 N',CF],['加速度',r2,'2.5 m/s²',CA],['0.1 s の 速度の変化',r3,'0.25 m/s',CV]];
 let s='';rows.forEach(([a,on,v,col],i)=>{const y=145+i*80;
  s+=label(a,PX+40,y,{size:28,color:C.ink,weight:700})+label('？',PX+560,y,{size:28,color:C.dim,anchor:'middle',opacity:1-on})+fade(on,label(v,PX+560,y,{size:30,color:col,anchor:'middle',weight:700}));
  if(i<2)s+=label('↓',PX+90,y+44,{size:24,color:C.dim,anchor:'middle'});});
 return panel(92,250,s,g);
}
// 力を継ぎ足す列（下向き down N、上向き up N。残りを光らせる）
function tipTail(x,y0,down,up,{g=1,hi=1,txt=''}={}){
 const yD=y0+down*FS,yU=yD-up*FS;let s=arrow(x,y0,x,yD,{color:CF,w:5,head:14})+arrow(x+22,yD,x+22,yU,{color:CF,w:5,head:14});
 const a=Math.min(y0,yU),b=Math.max(y0,yU);
 s+=fade(hi,rect(x-12,a,46,b-a,{fill:CH,fo:.18,stroke:CH,sw:2.5,rx:6})+(txt?label(txt,x+46,(a+b)/2+9,{size:26,color:CH,weight:700}):''));
 return fade(g,s);
}

function sumBase(p){
 const A=vt({x:300,w:600});
 let s=A.svg+vinfLine(A,1,'')+A.plot(vUp,{p:seg(p,.05,.4),color:CV,w:5})+A.plot(vDn,{p:seg(p,.15,.5),color:CV,w:5});
 s+=fade(seg(p,.1,.2),label('遅い → 加速',A.X(.9),A.Y(2.4),{size:26,color:CV,anchor:'middle',weight:700}));
 s+=fade(seg(p,.2,.3),label('速い → 減速',A.X(.9),A.Y(5.8),{size:26,color:CV,anchor:'middle',weight:700}));
 return s;
}

export const ytQxUiDragDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（約5秒）：0〜2 s 重力 mg＝20 N と g、背景の目盛りが上へ流れる（だんだん速く）。2〜4 s 抵抗のモデルの札。4〜5 s 目盛りだけの v–t グラフ。静止。
 [K+'q1']:(p,ctx)=>{
  const t=cueT(ctx);
  let s=ticks(18*t*t)+plusDown(seg(p,0,.15));
  s+=ball({grav:seg(p,.05,.3)>0?20*seg(p,.05,.3):0,gTxt:seg(p,.2,.35)>.5?'mg ＝ 20 N':''});
  s+=fade(seg(p,.1,.3),label('g ＝ 10 m/s²',20,500,{size:24,color:C.ink,weight:700}));
  s+=modelCard(seg(p,.4,.6));
  s+=vt({g:seg(p,.8,.95)}).svg;
  return s;
 },
 // 小問2（約3秒）：前の図を消し、下向き 3 m/s で落ちている瞬間の球（速度の矢印 紫）と重力。抵抗の矢印は描かない。
 [K+'q2']:(p)=>{
  let s=plusDown()+ball({grav:20*seg(p,.1,.4),gTxt:p>.3?'mg ＝ 20 N':'',vel:3*seg(p,.35,.7),vTxt:p>.6?'3 m/s':''});
  s+=modelCard(seg(p,.6,.85),470,120);
  s+=fade(seg(p,.6,.85),label('下向きに 3 m/s で 落ちている 瞬間',470,330,{size:28,color:CV,weight:700}));
  return s;
 },
 // 小問3（約3秒）：前の図を消し、下向きに 6 m/s で投げ下ろした球（速度の矢印 紫）と重力。抵抗の矢印は描かない。
 [K+'q3']:(p)=>{
  let s=plusDown()+ball({grav:20*seg(p,.1,.4),gTxt:p>.3?'mg ＝ 20 N':'',vel:6*seg(p,.35,.7),vTxt:p>.6?'6 m/s':''});
  s+=modelCard(seg(p,.6,.85),470,120);
  s+=fade(seg(p,.6,.85),label('下向きに 6 m/s で 投げ下ろした',470,330,{size:28,color:CV,weight:700}));
  return s;
 },

 // ===================== 小問1 =====================
 // 1. 出題中の図。札「求めるもの：終端速度 v∞」
 [K+'goal1']:(p)=>ticks(0)+plusDown()+ball({grav:20,gTxt:'mg ＝ 20 N'})+label('g ＝ 10 m/s²',20,500,{size:24,color:C.ink,weight:700})+modelCard()+vt().svg+goalTag(G1,{g:seg(p,.03,.15)}),
 // 2. v–t グラフに寝ていく曲線（薄く）、平らな所を黄で囲む。「加速度 0 → 合力 0」
 [K+'term']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,A=vt();
  let s=ticks(0)+plusDown()+ball({grav:20,gTxt:'mg ＝ 20 N'})+modelCard()+A.svg;
  s+=fade(.55,A.plot(vUp,{p:seg(p,.05,.3),w:4}));
  s+=highlight(A.X(1.05),A.Y(4)-34,A.X(2)-A.X(1.05)+10,60,seg(p,.3,.4));
  s+=fade(seg(p,.32,.42),label('速さ 一定',A.X(1.5),A.Y(4)-48,{size:24,color:CH,anchor:'middle',weight:700}));
  s+=card(800,325,330,70,label('加速度 0 → 合力 0',965,370,{size:28,color:CH,anchor:'middle',weight:700}),seg(p,b,b+.08),CH);
  return s+goalTag(G1);
 },
 // 3. 重力 ＋20 N、抵抗 −kv（速さとともに伸びる）。合力 20−5v の 5v を光らせる
 [K+'force']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,t=cueT(ctx),v=3.2*seg(p,.08,.95);
  let s=ticks(10*t*t*.4)+plusDown()+ball({grav:20,gTxt:'＋20 N',res:5*v,rTxt:'−kv',vel:v});
  const x0=PX+40;
  let q=label('下向きを 正',x0,140,{size:26,color:C.dim})
   +label('重力',x0,200,{size:28,color:CF,weight:700})+T('+20\\ \\mathrm{N}',x0+230,190,36,{color:CF})
   +label('抵抗',x0,262,{size:28,color:CF,weight:700})+T('-kv=-5v',x0+250,252,36,{color:CF});
  q+=fade(seg(p,b,b+.08),line(PX+30,295,PX+PW-30,295,{color:C.faint,w:2})+label('合力',x0,350,{size:28,color:C.ink,weight:700})+T('20-5v',x0+230,340,40));
  const wq=texWidth('20-5v',40,false),w5=texWidth('5v',40,false);
  q+=highlight(x0+230+wq/2-w5-6,312,w5+12,56,seg(p,b+.1,b+.18));
  q+=fade(seg(p,b+.15,b+.25),label('速さとともに 大きくなる',x0+360,350,{size:24,color:CH,weight:700}));
  s+=panel(92,300,q,1);
  return s+goalTag(G1);
 },
 // 4. 20−5v＝0 → v＝4 m/s。抵抗が重力と同じ長さで止まる。（カット割り）文2で v–t グラフと v∞＝mg/k。答えの札 B
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,v=mix(3.2,4,seg(p,0,.35)),c1=1-seg(p,b-.04,b+.02),c2=seg(p,b,b+.06);
  let s=ticks(0)+plusDown()+ball({grav:20,gTxt:'＋20 N',res:5*v,rTxt:v>3.99?'20 N':'−kv',vel:v});
  s+=fade(seg(p,.35,.45),label('同じ 長さ',BX+60,BY+8,{size:24,color:CH,weight:700}));
  s+=fade(c1,panel(92,300,T('20-5v=0',PC,180,44)+fade(seg(p,.1,.2),T('v=20\\div5',PC,270,44))+fade(seg(p,.22,.32),T('=4\\ \\mathrm{m/s}',PC,355,44,{color:CV})),1));
  const A=vt();
  s+=fade(c2,A.svg+A.plot(vUp,{color:CV,w:4})+vinfLine(A,1,'')+card(820,300,300,110,T('v_\\infty=\\dfrac{mg}{k}',970,335,34)+label('＝ 4 m/s',970,395,{size:28,color:CH,anchor:'middle',weight:700}),1,CH));
  const ia=b+(1-b)*.55;
  return s+goalTag(G1)+ANS1(seg(p,ia,ia+.06));
 },
 // 5. 単位：N ÷ (N·s/m)、N が約分で消え m/s が残る
 [K+'unit']:(p)=>{
  const cn=seg(p,.3,.4);
  let s=card(80,110,1040,330,'',1);
  s+=label('N を N·s/m で 割る',600,165,{size:28,color:C.dim,anchor:'middle'});
  const N=cn>.5?`{\\color{${CA}}\\cancel{\\color{${C.ink}}\\mathrm{N}}}`:'\\mathrm{N}';
  s+=T('\\dfrac{mg}{k}',300,290,48);
  s+=T(`\\to\\ \\dfrac{${N}}{${N}\\cdot\\mathrm{s/m}}`,560,290,48);
  s+=fade(seg(p,.45,.55),T('=\\mathrm{m/s}',860,290,52,{color:CV}));
  s+=fade(seg(p,.55,.65),label('速さの 単位',860,390,{size:28,color:CV,anchor:'middle',weight:700}));
  s+=label('単位',300,390,{size:24,color:C.dim,anchor:'middle'});
  return s+goalTag(G1)+ANS1(1);
 },
 // 6. 誤答 A → C を一枚ずつ（誤答の計算つき）。上に正しい式
 [K+'wrongAC']:(p,ctx)=>{
  let s=card(300,90,600,110,T('v_\\infty=\\dfrac{mg}{k}=\\dfrac{20}{5}=4\\ \\mathrm{m/s}',600,145,36),1,CH);
  s+=wrongSeq(p,ctx,[['A','0.25 m/s','k/(mg) と逆にした。単位 s/m',{mid:'\\dfrac{k}{mg}=\\dfrac{5}{20}=0.25'}],['C','2 m/s','g÷k で、m を掛けていない',{mid:'\\dfrac{g}{k}=\\dfrac{10}{5}=2'}]],{opts:{...WOPT,x:200,w:800,y:225}});
  return s+goalTag(G1)+ANS1(1);
 },
 // 7. 誤答 D。文2で緑の矢印2本が打ち消して消え、紫の速度の矢印は下向きのまま残る
 [K+'wrongD']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,gone=seg(p,b+.05,b+.3);
  let s=plusDown()+ball({grav:20*(1-gone),res:20*(1-gone),vel:4,vTxt:'4 m/s'});
  s+=fade(seg(p,b,b+.08)*(1-gone),label('打ち消し合う',BX+50,BY-BR-70,{size:24,color:CF,weight:700}));
  s+=fade(seg(p,b+.25,b+.35),label('速度は 残る',BX-85,BY+80,{size:26,color:CV,anchor:'middle',weight:700}));
  s+=wrongCard('D','0 m/s','つり合い＝止まる、と考えた',{...WOPT,x:470,w:700,y:180,g:seg(p,.02,.08)});
  return s+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 // 8. 下向き 3 m/s の球。3段の表
 [K+'goal2']:(p)=>plusDown()+ball({grav:20,gTxt:'mg ＝ 20 N',vel:3,vTxt:'3 m/s'})+table({g:seg(p,.2,.35)})+goalTag(G2,{g:seg(p,.03,.15)}),
 // 9. 20 N と 15 N の矢印。継ぎ足して残る下向き 5 N。表の1段目
 [K+'net2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=plusDown()+ball({grav:20,gTxt:'20 N',res:15*seg(p,b,b+.15),rTxt:'15 N',vel:3,vTxt:'3 m/s'});
  s+=fade(seg(p,b+.2,b+.3),tipTail(BX+120,BY-50,20,15,{hi:seg(p,b+.4,b+.5),txt:'5 N'}));
  s+=table({r1:seg(p,b+.55,b+.65)});
  s+=fade(seg(p,.05,.15)*(1-seg(p,b,b+.05)),label('a ＝ 合力 ÷ 質量',PC,385,{size:30,color:CA,anchor:'middle',weight:700}));
  return s+goalTag(G2);
 },
 // 10. 表の2段目 2.5 m/s²（赤）、3段目 0.25 m/s。答えの札 C
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=plusDown()+ball({grav:20,gTxt:'20 N',res:15,rTxt:'15 N',vel:3,vTxt:'3 m/s',acc:2.5*seg(p,.1,.25)});
  s+=tipTail(BX+120,BY-50,20,15,{txt:'5 N'});
  s+=table({r1:1,r2:seg(p,.1,.2),r3:seg(p,.3,.4)});
  s+=fade(seg(p,.1,.2),label('5 ÷ 2',PX+390,225,{size:24,color:C.dim,anchor:'middle'}))+fade(seg(p,.3,.4),label('2.5 × 0.1',PX+390,305,{size:24,color:C.dim,anchor:'middle'}));
  return s+goalTag(G2)+ANS2(seg(p,b+.02,b+.1));
 },
 // 11. 誤答 A・B（文1を半分ずつ）→ D（文2）。表の下に一枚ずつ
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),e=W[0][1],win=[[0,e*.5],[e*.5,e],[W[1]?W[1][0]:e,1]];
  let s=plusDown()+ball({grav:20,gTxt:'20 N',res:15,rTxt:'15 N',vel:3,vTxt:'3 m/s',acc:2.5});
  s+=table({r1:1,r2:1,r3:1});
  s+=wrongSeq(p,ctx,[['A','5 m/s²','2 kg で割っていない'],['B','10 m/s²','抵抗を入れていない'],['D','17.5 m/s²','(20＋15)÷2、抵抗を下向きにした']],{win,opts:{...WOPT,x:PX,w:PW,y:370}});
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 // 12. 暗転して切りかえ。下向き 6 m/s の球
 [K+'goal3']:(p)=>plusDown()+ball({grav:20,gTxt:'20 N',vel:6,vTxt:'6 m/s'})+fade(seg(p,.2,.35),label('下向きに 6 m/s で 投げ下ろした',PX+20,300,{size:30,color:CV,weight:700}))+goalTag(G3,{g:seg(p,.03,.15)}),
 // 13. 抵抗 30 N が重力 20 N より長い
 [K+'res3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=plusDown()+ball({grav:20,gTxt:'重力 20 N',res:30*seg(p,b+.05,b+.25),rTxt:'抵抗 30 N',vel:6,vTxt:'6 m/s'});
  s+=panel(92,300,label('速度の 変わり方',PC,145,{size:28,color:C.dim,anchor:'middle'})+label('← 合力の 向きで 決まる',PC,195,{size:28,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,b,b+.08),line(PX+30,230,PX+PW-30,230,{color:C.faint,w:2})+label('抵抗 ＝ 5 × 6 ＝ 30 N',PC,285,{size:30,color:CF,anchor:'middle',weight:700}))
   +fade(seg(p,b+.25,b+.35),label('30 N ＞ 重力 20 N',PC,350,{size:30,color:CH,anchor:'middle',weight:700})),1);
  return s+goalTag(G3);
 },
 // 14. 合力 −10 N（上向き）、加速度 −5 m/s²（赤・上向き）。速度の矢印が縮み始め、6 m/s の数値は消す。v–t グラフで 6 から下がり始める
 [K+'dec3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,tt=.25*seg(p,b,1),v=vDn(tt),A=vt();
  let s=plusDown()+ball({grav:20,gTxt:'20 N',res:5*v,rTxt:tt<.01?'30 N':'',vel:v,vTxt:tt<.01?'6 m/s':'',acc:-5*seg(p,.3,.45)*(tt<.01?1:(v-4)/2),aTxt:tt<.01?'−5 m/s²':''});
  s+=fade(seg(p,.1,.2)*(1-seg(p,b,b+.05)),tipTail(BX+235,BY-40,20,30,{hi:seg(p,.15,.25),txt:'10 N'}));
  s+=fade(seg(p,.05,.15),label('合力 ＝ 20 − 30 ＝ −10 N（上向き）',20,505,{size:24,color:CF,weight:700}));
  s+=A.svg+dot(A.X(0),A.Y(6),8,CV)+(tt>.005?A.plot(vDn,{to:tt,color:CV,w:5}):'');
  s+=fade(seg(p,b,b+.1),label('下向きのまま 遅くなる',A.X(1),A.Y(6)-10,{size:24,color:CV,anchor:'middle',weight:700}));
  return s+goalTag(G3);
 },
 // 15. 曲線が上から 4 の線に近づく。抵抗の矢印が縮み、重力と同じ長さに近づく。答えの札 D
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,tt=mix(.25,1.9,seg(p,0,.85)),v=vDn(tt),A=vt();
  let s=plusDown()+ball({grav:20,gTxt:'20 N',res:5*v,vel:v,acc:-5*(v-4)/2});
  s+=A.svg+dot(A.X(0),A.Y(6),8,CV)+A.plot(vDn,{to:tt,color:CV,w:5})+vinfLine(A,seg(p,b,b+.1));
  s+=fade(seg(p,.05,.15),label('抵抗も 小さく → 減り方も 弱まる',20,505,{size:24,color:CF,weight:700}));
  const ia=b+(1-b)*.6;
  return s+goalTag(G3)+ANS3(seg(p,ia,ia+.06));
 },
 // 16. 誤答 A（文1の前半）・B（文1の後半〜）。灰色の点線で上がる線・水平な線
 [K+'wrong3a']:(p,ctx)=>{
  const W=sentWin(ctx),e=W[0][1],A=vt(),inA=seg(p,.01,.05)*(1-seg(p,e*.5-.04,e*.5)),inB=seg(p,e*.5+.01,e*.5+.05);
  let s=A.svg+dot(A.X(0),A.Y(6),8,CV)+A.plot(vDn,{color:CV,w:5})+vinfLine(A);
  s+=fade(inA,line(A.X(0),A.Y(6),A.X(.3),A.Y(7.2),{color:C.dim,w:3,dash:'6 6'}));
  s+=fade(inB,line(A.X(0),A.Y(6),A.X(2),A.Y(6),{color:C.dim,w:3,dash:'6 6'}));
  s+=fade(seg(p,W[1]?W[1][0]:.6,(W[1]?W[1][0]:.6)+.08),label('合力 0 は 4 m/s だけ',A.X(1),A.Y(4)+84,{size:24,color:CH,anchor:'middle',weight:700}));
  s+=wrongSeq(p,ctx,[['A','速くなり続ける',['抵抗 30 N＞重力 20 N を','見落とした']],['B','6 m/s のまま','合力 0 は 4 m/s のときだけ']],{win:[[0,e*.5],[e*.5,1]],opts:{...WOPT,x:20,w:560,y:150}});
  return s+goalTag(G3)+ANS3(1);
 },
 // 17. 誤答 C
 [K+'wrong3c']:(p)=>{
  const A=vt();
  let s=A.svg+dot(A.X(0),A.Y(6),8,CV)+A.plot(vDn,{color:CV,w:5})+vinfLine(A);
  s+=wrongCard('C','すぐ止まる','合力は速度を少しずつ変えるだけ',{...WOPT,x:20,w:560,y:150,g:seg(p,.02,.08)});
  return s+goalTag(G3)+ANS3(1);
 },

 // ===================== まとめ =====================
 // 18a. 下から近づく曲線と上から近づく曲線を、4 の線をはさんで並べる（正本の行18の文1）
 [K+'sum']:(p)=>sumBase(p),
 // 18b. v∞＝mg/k の札、右上に答えの札3枚（正本の行18の文2）
 [K+'sum2']:(p)=>sumBase(1)+card(930,215,250,110,T('v_\\infty=\\dfrac{mg}{k}',1055,270,34),seg(p,.05,.15),CH)
  +answerRow([[1,'B','4 m/s'],[2,'C','2.5 m/s²'],[3,'D','']],{g:seg(p,.4,.5)}),
};

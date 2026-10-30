// 問題編 解説「直列にすると、どちらが熱い？」(ys-qx-hs-e-power-1) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/402_電力とジュール熱.md の q-hs-e-power-1（解説 22 行）。
// 色（正本の指示）：電流 I 緑、電圧 V 紫、電力 P・熱 橙、抵抗 R 黄（単元動画 power-1 の台本に合わせる）。
//   R の黄と強調の黄が重なるので、強調は黄の「枠」だけを使い、右下に凡例「R 黄」を出す。
// 回路：電池は下の導線（＋極＝長い細い線を左）。電流は ＋極 → 左の辺を上へ → 上の導線を右へ（R₁ → R₂）→ 右の辺を下へ → −極。
// 左（x＜600）に回路、右（x＞620）に式・誤答カード。札の帯（y＜78）には図を描かない。
// 単元動画（yt1-hs-e-power-1）の部品（抵抗のギザギザ・熱の波線・場面の時刻）を読み込んで使う（そのファイルは編集しない）。
import {C,seg,fade,label,line,rect,arrow,tex,mix} from './anim.mjs';
import {heatWaves,resistor,sceneT} from './yt1-hs-e-power-1-diagrams.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,legend,sentWin} from './yt1-qx-common.mjs';

const K='qx-hs-e-power-1:';
const IC=C.F,VC=C.v,PC=C.E,RC=C.hi,HI=C.hi,DIM=C.dim;
const Rt=`{\\color{${RC}}R}`,It=`{\\color{${IC}}I}`,Vt=`{\\color{${VC}}V}`,Pt=`{\\color{${PC}}P}`;
const U=s=>`\\,\\mathrm{${s}}`;
const TX=(src,x,y,o={})=>tex(src,x,y,{size:44,auto:false,...o});
const G1='R₁ の消費電力',G2='発熱が大きい方とその電力',G3='発熱の大小を決める理由';
const A1=g=>answerTag(1,'D',{tex:`4.8\\times10^2${U('W')}`},{g}),A2=g=>answerTag(2,'A','R₁、270 W',{g}),A3=g=>answerTag(3,'C','',{g});
const LEG=(g=1)=>legend([['R 黄',RC]],1085,498,{g});
const frame=(x,y,w,h,g=1)=>fade(g,rect(x,y,w,h,{fill:HI,fo:0,stroke:HI,sw:3.5,rx:10}));
const sw=(ctx,i,d=.5)=>{const W=sentWin(ctx);return W[i]?W[i][0]:d;};

// ---- 電池（＋極＝長い細い線を左）----------------------------------------------------------------
function battery(x,y,{g=1}={}){
 const xl=x-11,xr=x+11;
 let s=line(xl,y-36,xl,y+36,{color:C.ink,w:5})+line(xr,y-19,xr,y+19,{color:C.ink,w:10});
 s+=label('＋',xl-24,y-26,{size:26,color:C.a,anchor:'middle',weight:700})+label('−',xr+24,y-26,{size:28,color:'#7fb3ff',anchor:'middle',weight:700});
 return fade(g,s);
}
// ---- 回路（mode：'one'＝R₁ だけ、'series'＝R₁・R₂ の直列）----------------------------------------
const O={L:120,R:540,T:200,B:420,bx:330};
const SPAN={one:[[250,410]],series:[[165,295],[365,495]]};
const NAME=['R₁ ＝ 30 Ω','R₂ ＝ 10 Ω'];
function circ({mode='one',g=1,t=0,wires=1,res=1,labs=1,vlab=1,glow=[0,0],heat=[0,0],cur=0,curLab=0,pw=['',''],pwg=[0,0],
 hiV=0,hiR=0,hiRes=[0,0],merge=0,vbr=[0,0],float2=0,curHi=0}={}){
 const {L,R,T,B,bx}=O,sp=SPAN[mode];let s='';
 // 導線
 let top=line(L,T,sp[0][0],T,{color:DIM,w:4})+line(sp[sp.length-1][1],T,R,T,{color:DIM,w:4});
 if(sp.length===2)top+=line(sp[0][1],T,sp[1][0],T,{color:DIM,w:4});
 s+=fade(wires,top+line(L,T,L,B,{color:DIM,w:4})+line(R,T,R,B,{color:DIM,w:4})+line(L,B,bx-11,B,{color:DIM,w:4})+line(bx+11,B,R,B,{color:DIM,w:4})+battery(bx,B));
 if(vlab)s+=fade(vlab*wires,label('120 V',bx,B+74,{size:30,color:VC,anchor:'middle',weight:700}));
 if(hiV)s+=frame(bx-62,B+40,124,48,hiV);
 // 抵抗
 sp.forEach(([a,b],i)=>{
  if(glow[i]>0)s+=fade(glow[i],rect(a-12,T-30,b-a+24,60,{fill:PC,fo:.35,stroke:'none',rx:16}));
  s+=fade(res*(1-merge),resistor(a,b,T,{color:RC,n:mode==='one'?6:5}));
  if(labs)s+=fade(labs*(1-merge),label(NAME[i],(a+b)/2,T+54,{size:26,color:RC,anchor:'middle',weight:700}));
  if(hiRes[i])s+=frame(a-14,T-32,b-a+28,64,hiRes[i]);
  if(heat[i]>0)s+=heatWaves(a,b,T,t,{g:Math.min(1,heat[i]),n:Math.max(1,Math.round(4*heat[i])),h:12+60*heat[i]});
  if(pw[i])s+=fade(pwg[i],label(pw[i],(a+b)/2,T+96,{size:30,color:PC,anchor:'middle',weight:700}));
  if(vbr[i]>0){const yb=T-46;s+=fade(vbr[i],line(a,yb,b,yb,{color:VC,w:3})+line(a,yb-10,a,yb+10,{color:VC,w:3})+line(b,yb-10,b,yb+10,{color:VC,w:3})
   +label(i===0?'90 V':'30 V',(a+b)/2,yb-14,{size:30,color:VC,anchor:'middle',weight:700}));}
 });
 if(hiR)s+=frame(sp[0][0]-20,T+24,sp[0][1]-sp[0][0]+40,44,hiR);
 if(merge>0&&mode==='series'){const a=sp[0][0],b=sp[1][1];
  s+=fade(merge,line(sp[0][1],T,sp[1][0],T,{color:C.bg,w:6})+resistor(a,b,T,{color:RC,n:9})+label('30 ＋ 10 ＝ 40 Ω',(a+b)/2,T+54,{size:28,color:RC,anchor:'middle',weight:700}));}
 // 電流（同じ太さの緑の矢印）
 if(cur>0){let a='';const w=6,h=18;
  a+=arrow(L,B-40,L,T+40,{color:IC,w,head:h})+arrow(L+26,T,sp[0][0]-16,T,{color:IC,w,head:h});
  if(sp.length===2)a+=arrow(sp[0][1]+12,T,sp[1][0]-12,T,{color:IC,w,head:14});
  a+=arrow(sp[sp.length-1][1]+16,T,R-26,T,{color:IC,w,head:h})+arrow(R,T+40,R,B-40,{color:IC,w,head:h})+arrow(R-26,B,bx+56,B,{color:IC,w,head:h})+arrow(bx-56,B,L+26,B,{color:IC,w,head:h});
  s+=fade(cur,a);
  if(curHi>0)s+=frame(L+16,T-24,sp[0][0]-L-24,48,curHi)+frame(sp[0][1]+4,T-24,sp[1]?sp[1][0]-sp[0][1]-8:60,48,curHi);}
 if(curLab>0)s+=fade(curLab,label('3.0 A',L+20,B-36,{size:30,color:IC,weight:700}));
 // まだつないでいない R₂（小問1）
 if(float2>0)s+=fade(float2,resistor(640,780,300,{color:RC,n:5})+label(NAME[1],710,356,{size:26,color:RC,anchor:'middle',weight:700})
  +label('（まだ つないでいない）',710,394,{size:22,color:DIM,anchor:'middle'}));
 return fade(g,s);
}
// ---- 並列（小問3 の誤答 A）---------------------------------------------------------------------------
function para({g=1,t=0,heat=[0,0],lab=1}={}){
 const xl=150,xr=510,y1=170,y2=300,B=420,bx=330,a=250,b=410;let s='';
 s+=line(xl,y1,a,y1,{color:DIM,w:4})+line(b,y1,xr,y1,{color:DIM,w:4})+line(xl,y2,a,y2,{color:DIM,w:4})+line(b,y2,xr,y2,{color:DIM,w:4});
 s+=line(xl,y1,xl,B,{color:DIM,w:4})+line(xr,y1,xr,B,{color:DIM,w:4})+line(xl,B,bx-11,B,{color:DIM,w:4})+line(bx+11,B,xr,B,{color:DIM,w:4})+battery(bx,B);
 s+=resistor(a,b,y1,{color:RC,n:5})+resistor(a,b,y2,{color:RC,n:5});
 if(lab)s+=label('R₁',200,y1-16,{size:28,color:RC,anchor:'middle',weight:700})+label('R₂',200,y2-16,{size:28,color:RC,anchor:'middle',weight:700})
  +label('120 V',bx,B+74,{size:30,color:VC,anchor:'middle',weight:700});
 if(heat[0]>0)s+=heatWaves(a,b,y1,t,{g:heat[0],n:2,h:24});
 if(heat[1]>0)s+=fade(heat[1],rect(a-12,y2-30,b-a+24,60,{fill:PC,fo:.35,stroke:'none',rx:16}))+heatWaves(a,b,y2,t,{g:heat[1],n:5,h:62});
 return fade(g,s);
}
// ---- 電気の高さのグラフ（小問3）---------------------------------------------------------------------
function vgraph({g=1,hi1=0,drops=1}={}){
 const x0=660,yv=v=>400-270*v/120,X=[700,770,880,950,1060,1130];
 let s=line(x0,412,x0,110,{color:DIM,w:2.5})+line(x0,400,1160,400,{color:DIM,w:2.5});
 s+=label('電気の 高さ',x0+12,100,{size:24,color:VC,weight:700})+label('120 V',x0-10,yv(120)+9,{size:24,color:VC,anchor:'end',weight:700})+label('0',x0-10,yv(0)+9,{size:24,color:DIM,anchor:'end'});
 s+=line(x0-6,yv(120),x0+6,yv(120),{color:DIM,w:2.5});
 s+=`<polyline points="${X[0]},${yv(120)} ${X[1]},${yv(120)} ${X[2]},${yv(30)} ${X[3]},${yv(30)} ${X[4]},${yv(0)} ${X[5]},${yv(0)}" fill="none" stroke="${VC}" stroke-width="5" stroke-linejoin="round"/>`;
 s+=rect(X[1],404,X[2]-X[1],10,{fill:RC,fo:.8,stroke:'none',rx:3})+rect(X[3],404,X[4]-X[3],10,{fill:RC,fo:.8,stroke:'none',rx:3});
 s+=label('R₁',(X[1]+X[2])/2,446,{size:26,color:RC,anchor:'middle',weight:700})+label('R₂',(X[3]+X[4])/2,446,{size:26,color:RC,anchor:'middle',weight:700});
 if(drops>0){s+=fade(drops,line(X[2]+16,yv(120),X[2]+16,yv(30),{color:VC,w:2.5,dash:'5 5'})+line(X[1],yv(120),X[2]+26,yv(120),{color:VC,w:1.5,dash:'4 6'})
  +label('90 V',X[2]+24,(yv(120)+yv(30))/2+10,{size:30,color:VC,weight:700})
  +line(X[4]+16,yv(30),X[4]+16,yv(0),{color:VC,w:2.5,dash:'5 5'})+line(X[3],yv(30),X[4]+26,yv(30),{color:VC,w:1.5,dash:'4 6'})
  +label('30 V',X[4]+24,(yv(30)+yv(0))/2+10,{size:28,color:VC,weight:700}));}
 if(hi1>0)s+=frame(X[1]-14,yv(120)-16,X[2]-X[1]+100,yv(30)-yv(120)+32,hi1);
 return fade(g,s);
}
// 右の式のカード
const fc=(y,h,src,{g=1,size=44,col=C.faint,x=620,w=560}={})=>card(x,y,w,h,TX(src,x+w/2,y+h/2+size*.3,{size}),g,col);
// 誤答カード（右の列）
const WO={x:620,w:560,y:150,size:28,whySize:24};

export const qxHsEPower1Diagrams={
 // ================= 問題アニメ =================
 // 出題（小問1）：R₁ だけを 120 V につないだ回路。横に、まだつないでいない R₂。2〜4 秒で R₁ が少し橙に色づく（湯気・電流・電力の値は出さない）。
 [K+'q0']:(p)=>'<g transform="translate(180 0)">'+circ({wires:seg(p,0,.2),res:seg(p,.12,.3),labs:seg(p,.25,.45),vlab:seg(p,.25,.45),float2:seg(p,.3,.5),glow:[.75*seg(p,.55,.95),0]})+'</g>'+LEG(seg(p,.3,.5)),
 // 小問2（小問2・3 共通）：暗転して直列の回路に切り替え、2 秒で描いて静止（電流・電圧・電力の値、湯気の違いは出さない）。
 [K+'q2']:(p)=>'<g transform="translate(180 0)">'+circ({mode:'series',wires:seg(p,0,.45),res:seg(p,.2,.6),labs:seg(p,.5,.9),vlab:seg(p,.5,.9)})+'</g>'+LEG(seg(p,.5,.9)),
 // ================= S1 小問1 =================
 // 1. 小問1の回路。求めるもの：R₁ の消費電力
 [K+'goal1']:(p)=>circ({glow:[.55,0],float2:1})+goalTag(G1,{g:seg(p,.03,.15)})+LEG(),
 // 2. 記号の札（V 電圧・I 電流・P 1秒あたりに変わるエネルギー）を先に置き、P＝VI と J/s＝W
 [K+'sym']:(p)=>{
  let s=circ({glow:[.55,0],float2:1-seg(p,0,.08),vbr:[0,0],cur:seg(p,.18,.3)});
  const {T}=O;
  s+=fade(seg(p,.06,.18),line(250,T-46,410,T-46,{color:VC,w:3})+line(250,T-56,250,T-36,{color:VC,w:3})+line(410,T-56,410,T-36,{color:VC,w:3})+label('V：電圧',330,T-60,{size:28,color:VC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.18,.3),label('I：電流',O.L+18,390,{size:28,color:IC,weight:700}));
  s+=fade(seg(p,.3,.42),label('P：1秒あたりに 変わる エネルギー',330,T+112,{size:24,color:PC,anchor:'middle',weight:700}));
  s+=fc(110,120,`${Pt}=${Vt}${It}`,{g:seg(p,.5,.62),size:56,col:PC});
  s+=fc(260,100,`\\mathrm{J/s}=\\mathrm{W}`,{g:seg(p,.68,.8),size:44});
  s+=goalTag(G1)+LEG();
  return s;
 },
 // 3. 電圧 120 V と抵抗 30 Ω を黄の枠で囲む → P＝VI の I に V/R が入って P＝V²/R
 [K+'pvr']:(p,ctx)=>{
  const b=sw(ctx,1,.4);
  let s=circ({glow:[.55,0],hiV:seg(p,.05,.15),hiR:seg(p,.05,.15)});
  s+=fade(seg(p,.06,.16),label('分かっている',330,O.T-50,{size:26,color:HI,anchor:'middle',weight:700}));
  const u1=seg(p,b+.02,b+.1),u2=seg(p,b+.22,b+.3),u3=seg(p,b+.42,b+.5);
  let eq=fade(1-u2,TX(`${Pt}=${Vt}\\,{\\color{${u1>.5?HI:IC}}\\boxed{${It}}}`,900,190,{size:54}));
  eq+=fade(u2*(1-u3),TX(`${Pt}=${Vt}\\times\\dfrac{${Vt}}{${Rt}}`,900,196,{size:50}));
  eq+=fade(u3,TX(`${Pt}=\\dfrac{${Vt}^2}{${Rt}}`,900,196,{size:56}));
  s+=card(620,110,560,170,eq,1,PC);
  s+=fade(u1*(1-u3),TX(`${It}=\\dfrac{${Vt}}{${Rt}}`,900,370,{size:44})+label('を 入れる',1010,380,{size:26,color:DIM,weight:700}));
  s+=goalTag(G1)+LEG();
  return s;
 },
 // 4. 120²÷30＝14400÷30＝480 W。R₁ が橙に光る。小問1 の答え D
 [K+'calc']:(p,ctx)=>{
  const t=sceneT(p,ctx),b=sw(ctx,1,.6);
  let s=circ({t,glow:[.55+.45*seg(p,.35,.5),0],heat:[.6*seg(p,.35,.5),0]});
  s+=fc(110,120,`${Pt}=\\dfrac{${Vt}^2}{${Rt}}`,{size:46,col:C.faint});
  s+=card(620,260,560,120,TX(`\\dfrac{120^2}{30}=\\dfrac{14400}{30}=480${U('W')}`,900,330,{size:40}),seg(p,.05,.18),PC);
  s+=goalTag(G1)+A1(seg(p,b,b+.08))+LEG();
  return s;
 },
 // 5. 誤答 B：4.0 W（それは電流 4.0 A）。4.0 A×120 V＝480 W を小さく
 [K+'wrongB']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=circ({t,glow:[1,0],heat:[.6,0]});
  s+=wrongCard('B','4.0 W','それは 電流 4.0 A',{...WO,mid:`4.0${U('A')}\\times120${U('V')}=480${U('W')}`,midSize:30,g:seg(p,.03,.1)});
  s+=goalTag(G1)+A1(1)+LEG();
  return s;
 },
 // 6. 誤答 A（R₂ で計算した）→ 前のカードを消して 誤答 C（R で割らずに掛けた）
 [K+'wrongAC']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=circ({t,glow:[1,0],heat:[.6,0]});
  s+=wrongSeq(p,ctx,[['A','1.4×10³ W','R₂ で 計算した',{mid:`\\dfrac{120^2}{10}\\approx1.4\\times10^3${U('W')}`}],['C','4.3×10⁵ W','R で 割らずに 掛けた',{mid:`120^2\\times30\\approx4.3\\times10^5`}]],{opts:{...WO,midSize:30}});
  s+=goalTag(G1)+A1(1)+LEG();
  return s;
 },
 // ================= S2 小問2 =================
 // 7. 暗転して直列の回路。求めるもの：発熱が大きい方とその電力
 [K+'goal2']:(p)=>circ({mode:'series'})+goalTag(G2,{g:seg(p,.05,.18)})+LEG(),
 // 8. 直列は1本の道 → 同じ太さの緑の矢印。「同じ電流」
 [K+'same']:(p)=>{
  let s=circ({mode:'series',cur:seg(p,.05,.3)});
  s+=card(660,150,480,90,label('同じ 電流',900,207,{size:36,color:IC,anchor:'middle',weight:700}),seg(p,.3,.42),IC);
  s+=fade(seg(p,.3,.42),label('1本の 道 → どこでも 同じ 太さ',900,290,{size:26,color:DIM,anchor:'middle',weight:700}));
  s+=goalTag(G2)+LEG();
  return s;
 },
 // 9. 全体の抵抗 40 Ω（1本に置き換えてから戻す）、電流 3.0 A
 [K+'total']:(p)=>{
  const m=seg(p,.08,.2)*(1-seg(p,.5,.6));
  let s=circ({mode:'series',cur:1,merge:m,curLab:seg(p,.62,.72)});
  s+=fc(110,110,`30+10=40${U('\\Omega')}`,{g:seg(p,.12,.24),size:42});
  s+=fc(250,110,`${It}=\\dfrac{120}{40}=3.0${U('A')}`,{g:seg(p,.45,.57),size:42,col:IC});
  s+=goalTag(G2)+LEG();
  return s;
 },
 // 10. P＝RI²。R₁ は 30×3.0²＝270 W、R₁ から橙の湯気
 [K+'p1']:(p,ctx)=>{
  const t=sceneT(p,ctx),b=sw(ctx,1,.45),h=seg(p,b+.1,b+.3);
  let s=circ({mode:'series',t,cur:1,curLab:1,glow:[h,0],heat:[h,0],pw:['270 W',''],pwg:[seg(p,b+.3,b+.45),0]});
  s+=fc(110,110,`${Pt}=${Rt}${It}^2`,{g:seg(p,.05,.15),size:50,col:PC});
  s+=fc(250,110,`30\\times3.0^2=270${U('W')}`,{g:seg(p,b+.02,b+.14),size:42});
  s+=fade(seg(p,b+.02,b+.14),label('R₁',650,315,{size:28,color:RC,weight:700}));
  s+=goalTag(G2)+LEG();
  return s;
 },
 // 11. R₂ は 10×3.0²＝90 W（湯気は R₁ より少ない）。発熱が大きいのは R₁
 [K+'p2']:(p,ctx)=>{
  const t=sceneT(p,ctx),b=sw(ctx,1,.55),h=seg(p,.12,.3);
  let s=circ({mode:'series',t,cur:1,curLab:1,glow:[1,.35*h],heat:[1,.3*h],pw:['270 W','90 W'],pwg:[1,seg(p,.2,.32)],hiRes:[seg(p,b,b+.1),0]});
  s+=fc(110,110,`${Pt}=${Rt}${It}^2`,{size:50,col:PC});
  s+=fc(250,110,`10\\times3.0^2=90${U('W')}`,{g:seg(p,.04,.16),size:42});
  s+=fade(seg(p,.04,.16),label('R₂',650,315,{size:28,color:RC,weight:700}));
  s+=fade(seg(p,b+.03,b+.13),label('発熱が 大きいのは R₁',900,420,{size:30,color:HI,anchor:'middle',weight:700}));
  s+=goalTag(G2)+LEG();
  return s;
 },
 // 12. 270＋90＝360＝120×3.0。小問2 の答え A
 [K+'sum2']:(p,ctx)=>{
  const t=sceneT(p,ctx),b=sw(ctx,1,.6);
  let s=circ({mode:'series',t,cur:1,curLab:1,glow:[1,.35],heat:[1,.3],pw:['270 W','90 W'],pwg:[1,1]});
  s+=card(620,150,560,150,TX(`270+90=360`,900,205,{size:44})+TX(`=120\\times3.0`,920,268,{size:44}),seg(p,.04,.16),PC);
  s+=fade(seg(p,.25,.4),label('電源が 1秒に 渡す エネルギー と 一致',900,350,{size:26,color:DIM,anchor:'middle',weight:700}));
  s+=goalTag(G2)+A2(seg(p,b,b+.08))+LEG();
  return s;
 },
 // 13. 誤答 C（R₁ に 120 V 全部）→ 誤答 B（R₂ に 120 V 全部）。直列では電圧を分け合う
 [K+'wrongCB']:(p,ctx)=>{
  const t=sceneT(p,ctx),W=sentWin(ctx),m=W[0][1]*.42;
  let s=circ({mode:'series',t,cur:1,curLab:1,glow:[1,.35],heat:[1,.3],pw:['270 W','90 W'],pwg:[1,1]});
  s+=wrongSeq(p,ctx,[['C','R₁ で 480 W','R₁ に 120 V 全部と した'],['B','R₂ で 1.4×10³ W','R₂ に 120 V 全部と した']],{win:[[0,m],[m,1]],opts:WO});
  s+=fade(seg(p,sw(ctx,1,.7),sw(ctx,1,.7)+.08),label('直列では、電圧を 分け合う',900,330,{size:30,color:VC,anchor:'middle',weight:700}));
  s+=goalTag(G2)+A2(1)+LEG();
  return s;
 },
 // 14. 誤答 D：R₂ で 90 W（小さい方を選んだ）
 [K+'wrongD']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=circ({mode:'series',t,cur:1,curLab:1,glow:[1,.35],heat:[1,.3],pw:['270 W','90 W'],pwg:[1,1]});
  s+=wrongCard('D','R₂ で 90 W','小さい 方を 選んだ',{...WO,g:seg(p,.03,.1)});
  s+=goalTag(G2)+A2(1)+LEG();
  return s;
 },
 // ================= S3 小問3 =================
 // 15. カードを消す。求めるもの：発熱の大小を決める理由
 [K+'goal3']:(p)=>circ({mode:'series',cur:1,curLab:1})+goalTag(G3,{g:seg(p,.05,.18)})+LEG(),
 // 16. R₁ の両端 90 V、R₂ の両端 30 V（紫の札）。右に電気の高さのグラフ
 [K+'volt']:(p)=>{
  let s=circ({mode:'series',cur:1,curLab:1,vbr:[seg(p,.1,.22),seg(p,.5,.62)]});
  s+=vgraph({g:seg(p,.15,.3),drops:seg(p,.3,.6)});
  s+=goalTag(G3)+LEG();
  return s;
 },
 // 17. 電流が同じ → RI² で比べる。90 V の段を黄の枠で囲む。小問3 の答え C
 [K+'reason']:(p,ctx)=>{
  const b=sw(ctx,1,.7);
  let s=circ({mode:'series',cur:1,curLab:1,vbr:[1,1]});
  s+=vgraph({hi1:seg(p,.3,.42)});
  s+=card(650,462,410,48,label('電流が 同じ → RI² で 比べる',855,495,{size:26,color:IC,anchor:'middle',weight:700}),seg(p,.05,.15),IC);
  s+=goalTag(G3)+A3(seg(p,b,b+.08))+LEG();
  return s;
 },
 // 18. 誤答 B：電流が先で減る（直列の電流はどこでも同じ）。矢印は R₁ の前後で同じ太さ
 [K+'wrongB3']:(p)=>{
  let s=circ({mode:'series',cur:1,curLab:1,vbr:[1,1],curHi:seg(p,.3,.42)});
  s+=wrongCard('B','電流が 先で 減る','直列の 電流は どこでも 同じ',{...WO,g:seg(p,.03,.1)});
  s+=goalTag(G3)+A3(1)+LEG();
  return s;
 },
 // 19. 誤答 D：電圧が同じ（それは並列）
 [K+'wrongD3']:(p,ctx)=>{
  const b=sw(ctx,1,.5);
  let s=circ({mode:'series',cur:1,curLab:1,vbr:[1,1]});
  s+=wrongCard('D','電圧が 同じ','それは 並列',{...WO,g:seg(p,.03,.1)});
  s+=fade(seg(p,b,b+.08),label('電圧が 同じ なら',900,330,{size:28,color:VC,anchor:'middle',weight:700})+label('抵抗が 大きいほど 電流は 小さい',900,375,{size:28,color:IC,anchor:'middle',weight:700}));
  s+=goalTag(G3)+A3(1)+LEG();
  return s;
 },
 // 20a. 誤答 A：抵抗が大きい方がいつも多く熱を出す（並列では逆。2026-10-16 に「熱い」から変更）。カードだけ先に出す（直列の図は残す）
 [K+'wrongA3']:(p)=>{
  let s=circ({mode:'series',cur:1,curLab:1,vbr:[1,1]});
  s+=wrongCard('A','抵抗が 大きい 方が いつも 多く 熱を 出す','並列では 逆',{...WO,x:605,w:585,size:23,y:110,g:seg(p,.03,.15)});
  s+=goalTag(G3)+A3(1)+LEG();
  return s;
 },
 // 20b. 並列の図を小さく出し、R₂ の湯気が多くなる。R₂：120²÷10≈1.4×10³ W
 [K+'para']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=circ({mode:'series',cur:1,curLab:1,vbr:[1,1],g:1-seg(p,0,.08)});
  s+=wrongCard('A','抵抗が 大きい 方が いつも 多く 熱を 出す','並列では 逆',{...WO,x:605,w:585,size:23,y:110});
  s+=para({g:seg(p,.06,.16),t,heat:[seg(p,.3,.5),seg(p,.3,.5)]});
  s+=fade(seg(p,.12,.22),label('並列：どちらにも 120 V',900,300,{size:28,color:VC,anchor:'middle',weight:700}));
  s+=card(620,330,560,110,TX(`{\\color{${RC}}R_2}:\\ \\dfrac{120^2}{10}\\approx1.4\\times10^3${U('W')}`,900,395,{size:40}),seg(p,.5,.6),PC);
  s+=goalTag(G3)+A3(1)+LEG();
  return s;
 },
 // 21. 何が一定かで式が変わる：電流一定 → RI²、電圧一定 → V²/R
 [K+'rule']:(p,ctx)=>{
  const b=sw(ctx,1,.4);
  let s=fade(seg(p,.03,.15),label('何が 一定か で、比べる 式が 変わる',600,150,{size:34,color:HI,anchor:'middle',weight:700}));
  s+=card(80,210,500,230,label('電流が 一定（直列）',330,265,{size:30,color:IC,anchor:'middle',weight:700})+TX(`${Pt}=${Rt}${It}^2`,330,345,{size:56})
   +label('R が 大きいほど 多く 熱を 出す',330,425,{size:24,color:DIM,anchor:'middle',weight:700}),seg(p,b,b+.08),IC);
  s+=card(620,210,500,230,label('電圧が 一定（並列）',870,265,{size:30,color:VC,anchor:'middle',weight:700})+TX(`${Pt}=\\dfrac{${Vt}^2}{${Rt}}`,870,345,{size:48})
   +label('R が 小さいほど 多く 熱を 出す',870,425,{size:24,color:DIM,anchor:'middle',weight:700}),seg(p,b+.3,b+.38),VC);
  s+=goalTag(G3)+A3(1)+LEG();
  return s;
 },
 // ================= S4 まとめ =================
 // 22. R₁ だけ（電圧一定）・直列（電流一定）・並列（電圧一定）を並べる
 [K+'sum']:(p,ctx)=>{
  const t=sceneT(p,ctx),mini=(svg,dx,dy)=>`<g transform="translate(${dx} ${dy}) scale(.5)">${svg}</g>`;
  const P=[[15,'R₁ だけ（電圧一定）',`${Pt}=\\dfrac{${Vt}^2}{${Rt}}`,'480 W',VC],[410,'直列（電流一定）',`${Pt}=${Rt}${It}^2`,'270 W と 90 W',IC],[805,'並列（電圧一定）',`${Pt}=\\dfrac{${Vt}^2}{${Rt}}`,'R₂ が 約1.4×10³ W',VC]];
  let s='';
  P.forEach(([x,ttl,f,v,col],i)=>{const g=seg(p,.05+i*.18,.15+i*.18),cx=x+190;
   let m=i===0?circ({t,glow:[1,0],heat:[.6,0],labs:0,vlab:0}):i===1?circ({mode:'series',t,glow:[1,.35],heat:[1,.3],labs:0,vlab:0,cur:1}):para({t,heat:[.4,1],lab:0});
   s+=card(x,92,380,418,mini(m,cx-165,40)+label(ttl,cx,330,{size:26,color:col,anchor:'middle',weight:700})+TX(f,cx,400,{size:i===1?44:40})+label(v,cx,478,{size:28,color:PC,anchor:'middle',weight:700}),g,col);});
  s+=answerRow([[1,'D',''],[2,'A',''],[3,'C','']],{g:seg(p,.6,.7)});
  return s;
 },
};

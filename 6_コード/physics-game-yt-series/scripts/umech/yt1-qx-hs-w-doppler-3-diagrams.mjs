// 問題編 解説「止まったスピーカーへ自転車で近づく」(ys-qx-hs-w-doppler-3) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/303_ドップラー効果.md の q-hs-w-doppler-3（解説 19 行）。
// 出題中の図に合わせ、スピーカーは右に止まり、自転車の聞き手が左から右へ近づく。
// 色（01_共通の約束）：波長 λ 水色、時間 金、振動数 f 桃、速さ V・vo・vs 紫、山（波面）白、強調 黄、一致 緑。
// 円の図の自転車は実際の比 vo/V＝0.1 で動かす。音源が動く場面（比べる場面）は速さを 0.25V に大げさに描く（注記を出す）。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない（まとめの答えの札は除く）。
// 見た目は q-hs-w-doppler-1 の図にそろえ、元の単元動画の部品を読み込んで使う（それらのファイルは編集しない）。
import {C,seg,lin,fade,label,line,rect,dot,ring,arrow,tex,clamp} from './anim.mjs';
import {T2,LC,TCOL,FC,VCOL,ft,HZ,MM,SC,WF,Vt,vst,vot,fp,listener,fronts,crestEdges,plate,dbl,siren} from './yt1-hs-w-doppler-1-diagrams.mjs';
import {card,goalTag,answerTag,answerRow,wrongSeq,wrongCard,tAt,cueT,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-hs-w-doppler-3:';
const OK=C.F;
const G1='空気中の波長 λ',G2='聞こえる振動数 f′',G3='935 と 944 が違う理由';
const A1=g=>answerTag(1,'A','0.40 m',{g}),A2=g=>answerTag(2,'C','935 Hz',{g}),A3=g=>answerTag(3,'B','',{g});
const s2=(ctx,d=.5)=>{const W=sentWin(ctx);return W[1]?W[1][0]:d;};
// 答えの札：答えを言う文（i 番目）を言い終える所で出す
const ansG=(p,ctx,i=0)=>{const W=sentWin(ctx),w=W[Math.min(i,W.length-1)],e=w[0]+(w[1]-w[0])*.85;return seg(p,e,e+.05);};
let CLIP=0;const clipTo=(x,y,w,h,svg)=>{const id=`qxd3c${CLIP++}`;return `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#${id})">${svg}</g>`;};

// ---- 止まったスピーカー（(x,y) が音の出る所）と自転車の聞き手（(x,yg)：地面の上の中央）--------------------
export function speaker(x,y,{s=1,g=1}={}){
 let o=rect(x-6*s,y-46*s,52*s,92*s,{fill:'#2a3346',fo:1,stroke:'#9aa8c0',sw:2,rx:6*s});
 o+=ring(x+20*s,y+12*s,20*s,{color:'#c9d3e4',w:3*s,fill:'#3a4a66'})+dot(x+20*s,y+12*s,6*s,'#c9d3e4')+ring(x+20*s,y-26*s,9*s,{color:'#c9d3e4',w:2*s,fill:'#3a4a66'});
 o+=line(x+20*s,y+46*s,x+20*s,y+70*s,{color:C.dim,w:4*s})+line(x,y+70*s,x+40*s,y+70*s,{color:C.dim,w:4*s});
 return fade(g,o);
}
const SKIN='#e9c7a6',CLO='#7fa0d0';
export function bike(x,yg,{s=1,g=1}={}){
 const r=19*s,yw=yg-r,xr=x-30*s,xf=x+30*s,xp=x-2*s,yp=yg-r;
 let o=ring(xr,yw,r,{color:C.dim,w:3*s})+ring(xf,yw,r,{color:C.dim,w:3*s});
 o+=line(xr,yw,xp,yp,{color:'#c97f5a',w:4*s})+line(xp,yp,x+18*s,yg-50*s,{color:'#c97f5a',w:4*s})+line(xr,yw,x-8*s,yg-50*s,{color:'#c97f5a',w:4*s})+line(x-8*s,yg-50*s,x+18*s,yg-50*s,{color:'#c97f5a',w:4*s});
 o+=line(x+18*s,yg-50*s,xf,yw,{color:'#c97f5a',w:4*s})+line(x+16*s,yg-62*s,x+26*s,yg-62*s,{color:C.dim,w:4*s});
 // rider
 o+=line(x-6*s,yg-56*s,xp+6*s,yp,{color:CLO,w:7*s})+line(x-6*s,yg-56*s,x+4*s,yg-40*s,{color:CLO,w:7*s});
 o+=rect(x-16*s,yg-100*s,22*s,46*s,{fill:CLO,fo:.9,stroke:'none',rx:9*s})+line(x+2*s,yg-90*s,x+20*s,yg-64*s,{color:CLO,w:6*s});
 o+=dot(x-4*s,yg-114*s,15*s,SKIN);
 return fade(g,o);
}
// ---- 円の図（スピーカーは止まっている。山は同じ間隔の同心円）---------------------------------------------
const SP={x:980,y:280,ground:360};
const WS={y:SP.y,Vd:120,Td:.5};                  // 山の間隔 60 px（＝0.40 m）
const BV=12;                                      // 自転車の速さ（表示）＝ 0.1 × 120 px/s（実際の比 34/340）
const ground=(y=SP.ground,{x0=40,x1=1160}={})=>line(x0,y,x1,y,{color:C.dim,w:3});
function vLabels(xb,g=1){return fade(g,arrow(xb+44,SP.ground-130,xb+150,SP.ground-130,{color:VCOL,w:5,head:16})+plate('34 m/s',xb+98,SP.ground-150,{size:26,color:VCOL}));}
const spLab=(g=1)=>fade(g,plate('850 Hz',SP.x-70,SP.y+8,{size:28,color:FC,anchor:'end'})+label('止まった スピーカー',SP.x+20,SP.ground+44,{size:24,color:C.dim,anchor:'middle',weight:700}));
const Vcard=(g=1)=>card(60,90,300,62,label('V ＝ 340 m/s',210,132,{size:28,color:VCOL,anchor:'middle',weight:700}),g,VCOL);
const cmpCard=(g=1)=>card(600,86,580,96,label('比べる 場面：',620,124,{size:24,color:C.dim,weight:700})+label('スピーカーが 34 m/s で 近づくと 約 944 Hz',620,164,{size:24,color:C.ink,weight:700}),g,C.dim);
function circleScene(t,{xb,circles=1,g=1,lab=1}={}){
 let s=ground();
 if(circles>0)s+=clipTo(30,84,1150,440,fronts(t,{o:WS,k:0,xs0:SP.x+20,g:circles,w:3}));
 s+=speaker(SP.x,SP.y)+bike(xb,SP.ground);
 if(lab)s+=label('聞き手（自転車）',xb,SP.ground+44,{size:24,color:C.dim,anchor:'middle',weight:700});
 return fade(g,s);
}
const XB0=360;                                     // 出題中の図で自転車が止まる所
const xbAt=t=>XB0+BV*t;
// 隣り合う山（自転車と音源の間、自転車のすぐ前）の位置
function crestPair(t,xb){const e=crestEdges(t,{o:WS,k:0,xs0:SP.x+20,side:-1,count:14}).filter(x=>x>xb+110&&x<SP.x-40).sort((a,b)=>a-b);return e.length>=2?[e[0],e[1]]:null;}
// ---- 1次元の図：左に聞き手（右へ 34）、右に山の列（左へ 340）。窓 [x, x+L] ＝ 聞き手の前 374 m ----------------
const WIN={x:150,L:935,y:330,n:22};                // 374 m → 935 px（2.5 px/m）。山の間隔は省略して描く（n 本）
const SPW=WIN.L/WIN.n,LIS=34/374*WIN.L;           // 聞き手が1秒に進む 85 px、山が進む 850 px
function meetRow(u,{bracket=0,mark=0,arrows=0,g=1,split=0}={}){
 const {x,L,y}=WIN,lx=x+LIS*u,sh=(L-LIS)*u;
 let s=line(40,y+60,1180,y+60,{color:C.faint,w:2});
 for(let i=0;i<=30;i++){const X=x+SPW*i-sh;if(X<40||X>1180)continue;
  const met=X<lx-2,inW=x+SPW*i<=x+L+1,isM=i===WIN.n;
  const col=isM&&mark?C.hi:WF,op=met?.3:inW?1:.4;
  s+=fade(op,line(X,y-60,X,y+50,{color:col,w:isM&&mark?7:4}));}
 s+=bike(lx-30,y+60,{s:.8})+label('聞き手',lx-30,y+92,{size:24,color:C.dim,anchor:'middle',weight:700});
 if(arrows){s+=fade(arrows,arrow(700,y-110,520,y-110,{color:VCOL,w:6,head:18})+label('340 m（1秒）',720,y-100,{size:28,color:VCOL,weight:700}));
  s+=fade(arrows,arrow(lx-40,y-140,lx+80,y-140,{color:VCOL,w:6,head:18})+label('34 m（1秒）',lx+90,y-132,{size:26,color:VCOL,weight:700}));}
 if(bracket){const yb=y-96;
  s+=fade(bracket,line(x,yb-20,x,y+60,{color:VCOL,w:2,dash:'6 6'})+line(x+L,yb-20,x+L,y+60,{color:VCOL,w:2,dash:'6 6'}));
  s+=fade(bracket*split,rect(x,yb-8,LIS,16,{fill:VCOL,fo:.25,stroke:'none',rx:4})+rect(x+LIS,yb-8,L-LIS,16,{fill:VCOL,fo:.6,stroke:'none',rx:4})
   +label('34',x+LIS/2,yb+30,{size:22,color:VCOL,anchor:'middle',weight:700})+label('340',x+LIS+(L-LIS)/2,yb+30,{size:22,color:VCOL,anchor:'middle',weight:700}));
  s+=fade(bracket,dbl(x,x+L,yb,VCOL,{w:4,head:14}))+plate('聞き手の 前 374 m',x+L/2,yb-14,{size:28,color:VCOL,g:bracket});}
 if(mark)s+=fade(mark,label('374 m 先に いた 山',Math.max(x+SPW*WIN.n-sh,x+80),y+128,{size:24,color:C.hi,anchor:'middle',weight:700}));
 return fade(g,s);
}
const counter=(n,x,y,g=1)=>card(x,y,250,60,label(`出会った 山：${n} 個`,x+125,y+40,{size:26,color:FC,anchor:'middle',weight:700}),g,FC);
// ---- 左右に分けた場面（行14〜19）---------------------------------------------------------------------------
// 左：聞き手が動く（スピーカーは止まっている、円は同じ間隔）。右：音源が動く（前方＝左で間隔が詰まる、大げさ）。
const PL={x:10,w:585},PR={x:605,w:585},PY=86,PH=290,SY=170;
function leftPanel(t,{g=1,hl=0,ruleHi=0,arrows=0,eq=1,dim=1}={}){
 const sx=500,xb=90+5*t;
 let s=card(PL.x,PY,PL.w,PH,'',1,LC);
 s+=label('聞き手が 動く',PL.x+20,PY+32,{size:24,color:C.ink,weight:700});
 let pic=fronts(t,{o:{y:SY,Vd:120,Td:.5},k:0,xs0:sx,w:2})+line(PL.x+10,SY+54,PL.x+PL.w-10,SY+54,{color:C.faint,w:2});
 pic+=speaker(sx-18,SY,{s:.55})+bike(xb,SY+54,{s:.55});
 const e=crestEdges(t,{o:{y:SY,Vd:120,Td:.5},k:0,xs0:sx,side:-1,count:8}).filter(x=>x>xb+30&&x<sx-40).sort((a,b)=>a-b);
 s+=clipTo(PL.x+4,PY+40,PL.w-8,100,pic);
 if(e.length>=2)s+=dbl(e[0],e[1],SY+62,LC,{w:3+3*ruleHi,head:10});
 s+=label('λ ＝ 0.40 m（変わらない）',PL.x+PL.w/2,PY+176,{size:24,color:LC,anchor:'middle',weight:700});
 if(ruleHi)s+=fade(ruleHi,rect(PL.x+130,PY+150,325,36,{fill:C.hi,fo:.12,stroke:C.hi,sw:2,rx:8}));
 if(arrows)s+=fade(arrows,arrow(xb+150,SY-42,xb+60,SY-42,{color:VCOL,w:4,head:12})+label('340',xb+160,SY-34,{size:22,color:VCOL,weight:700})
  +arrow(xb-30,SY-42,xb+40,SY-42,{color:VCOL,w:4,head:12})+label('34',xb-50,SY-34,{size:22,color:VCOL,anchor:'middle',weight:700}));
 if(eq)s+=fade(eq,T2(`${ft}\\times\\dfrac{${hl?`{\\color{${C.hi}}\\boxed{${Vt}+${vot}}}`:`${Vt}+${vot}`}}{${Vt}}=935${HZ}`,PL.x+PL.w/2,PY+240,{size:26}));
 return fade(g*dim,s);
}
function rightPanel(t,{g=1,hl=0,eq=1,dim=1}={}){
 const sx=PR.x+430,k=-.25,o={y:SY,Vd:120,Td:.5},xs0=sx-k*o.Vd*t;
 let s=card(PR.x,PY,PR.w,PH,'',1,SC);
 s+=label('音源が 動く',PR.x+20,PY+32,{size:24,color:C.ink,weight:700})+label('（速さは 大げさ）',PR.x+PR.w-20,PY+32,{size:22,color:C.dim,anchor:'end'});
 let pic=fronts(t,{o,k,xs0,tmin:-6,w:2})+line(PR.x+10,SY+54,PR.x+PR.w-10,SY+54,{color:C.faint,w:2});
 pic+=speaker(sx-18,SY,{s:.55})+arrow(sx-30,SY-40,sx-100,SY-40,{color:VCOL,w:4,head:12});
 s+=clipTo(PR.x+4,PY+40,PR.w-8,100,pic);
 const e=crestEdges(t,{o,k,xs0,side:-1,count:3}).sort((a,b)=>b-a).filter(x=>x<sx-20);
 if(e.length>=2)s+=dbl(e[1],e[0],SY+62,LC,{w:3,head:10});
 s+=label('λ前 ＝ 306/850 ＝ 0.36 m',PR.x+PR.w/2,PY+176,{size:24,color:LC,anchor:'middle',weight:700});
 if(eq)s+=fade(eq,T2(`${ft}\\times\\dfrac{${Vt}}{${hl?`{\\color{${C.hi}}\\boxed{${Vt}-${vst}}}`:`${Vt}-${vst}`}}=850\\times\\dfrac{340}{306}\\approx 944${HZ}`,PR.x+PR.w/2,PY+240,{size:24}));
 return fade(g*dim,s);
}

export const qxHsWDoppler3Diagrams={
 // ================= 問題アニメ：出題中（小問1〜3 共通、約5秒＋静止）=================
 // 右に止まったスピーカー（850 Hz 桃）。左から自転車の聞き手が右へ近づく（右向きの紫の矢印と 34 m/s）。上に V＝340 m/s、
 // 右上に文字だけの枠「比べる場面：スピーカーが 34 m/s で近づくと 約 944 Hz」。山の円は描かない。自転車が左寄りに来た所で止まる。
 [K+'q0']:(p)=>{
  const xb=110+(XB0-110)*(1-(1-clamp(p/.9))**2);
  let s=ground()+speaker(SP.x,SP.y)+spLab()+bike(xb,SP.ground)+vLabels(xb);
  s+=label('聞き手（自転車）',xb,SP.ground+44,{size:24,color:C.dim,anchor:'middle',weight:700});
  s+=Vcard()+cmpCard();
  return s;
 },
 // ================= S1 小問1：空気中の波長 =================
 // 1. 出題中の図から始める。自転車が右へ進む
 [K+'setup']:(p,ctx)=>{
  const xb=xbAt(tAt(ctx,K+'setup'));
  let s=ground()+speaker(SP.x,SP.y)+spLab()+bike(xb,SP.ground)+vLabels(xb);
  s+=label('聞き手（自転車）',xb,SP.ground+44,{size:24,color:C.dim,anchor:'middle',weight:700});
  s+=Vcard()+cmpCard();
  return s;
 },
 // 2. 求めるもの：空気中の波長 λ。スピーカーから中心のずれない同じ間隔の円
 [K+'goal1']:(p,ctx)=>{
  const t=tAt(ctx,K+'setup'),xb=xbAt(t),o=seg(p,.25,.45);
  let s=circleScene(t,{xb,circles:o});
  s+=spLab(1-o)+vLabels(xb,1-seg(p,0,.15));
  s+=fade(o,plate('山 ＝ 空気が 押し縮められた 所（円で 描く）',560,118,{size:24,color:WF}));
  s+=fade(seg(p,.6,.75),plate('中心は ずれない・間隔は 同じ',560,505,{size:26,color:C.ink}));
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 3. λ＝340÷850＝0.40 m の物差し。自転車が進んでも、物差しの長さと円の間隔は変わらない（物差しの両端を点線で山に固定）
 [K+'lam']:(p,ctx)=>{
  const t=tAt(ctx,K+'setup'),xb=xbAt(t),b=s2(ctx);
  let s=circleScene(t,{xb});
  const pr=crestPair(t,xb);
  if(pr){const y=SP.ground+30;
   s+=fade(seg(p,.05,.15),line(pr[0],SP.y,pr[0],y+10,{color:LC,w:2,dash:'5 5'})+line(pr[1],SP.y,pr[1],y+10,{color:LC,w:2,dash:'5 5'})+dbl(pr[0],pr[1],y,LC,{w:5,head:12})+label('0.40 m',(pr[0]+pr[1])/2,y+34,{size:26,color:LC,anchor:'middle',weight:700}));}
  s+=card(380,86,440,70,T2(`\\lambda=340\\div 850=0.40${MM}`,600,128,{size:34}),seg(p,.1,.22),LC);
  s+=fade(seg(p,b,b+.1),plate('聞き手が 動いても、山の 並びは 同じ',560,505,{size:26,color:C.hi}));
  s+=goalTag(G1);
  return s;
 },
 // 4. 小問1 の答え A。誤答 B（縮む）→ C（伸びる）。1枚ずつ
 [K+'ans1']:(p,ctx)=>{
  const t=tAt(ctx,K+'setup'),xb=xbAt(t),W=sentWin(ctx),b=W[1]?W[1][0]:.4,m=b+(1-b)*.5;
  let s=fade(.45,circleScene(t,{xb,lab:0}));
  s+=card(380,86,440,70,T2(`\\lambda=0.40${MM}`,600,128,{size:34}),1,LC);
  s+=wrongSeq(p,ctx,[['B','0.36 m','聞き手が 動くと 波長が 縮む、と した'],['C','0.44 m','聞き手の 速さで 波長が 伸びる、と した']],{win:[[b,m],[m,1]]});
  s+=goalTag(G1)+A1(ansG(p,ctx,0));
  return s;
 },
 // 5. 誤答 D（2.5：割る向きが逆、単位も m にならない）
 [K+'wrongD1']:(p,ctx)=>{
  const t=tAt(ctx,K+'setup'),xb=xbAt(t);
  let s=fade(.45,circleScene(t,{xb,lab:0}));
  s+=card(380,86,440,70,T2(`\\lambda=0.40${MM}`,600,128,{size:34}),1,LC);
  s+=wrongCard('D','2.5 m','割る 向きを 逆に した（単位も m に ならない）',{mid:`850\\div 340=2.5`,midSize:32,g:seg(p,.03,.1)});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // ================= S2 小問2：聞こえる振動数 =================
 // 6. 求めるもの：f′。聞き手の横に「出会った山」のカウンター（円を通り過ぎるたびに増える）
 [K+'goal2']:(p,ctx)=>{
  const t0=tAt(ctx,K+'setup')-cueT(ctx),t=tAt(ctx,K+'setup'),xb=xbAt(t);
  const passed=tt=>{const d=SP.x+20-xbAt(tt)-14;return Math.floor((WS.Vd*tt-d)/(WS.Vd*WS.Td));};
  const n=Math.max(0,passed(t)-passed(t0));
  let s=circleScene(t,{xb});
  s+=counter(n,xb-125,SP.ground+66,seg(p,.3,.45));
  s+=fade(seg(p,.45,.6),plate('1秒に 出会う 山の 数を 数える',600,120,{size:28,color:FC}));
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 7. 1次元の図：山は聞き手へ 340 m、聞き手は山へ 34 m（1秒）
 [K+'meet']:(p)=>{
  let s=meetRow(0,{arrows:seg(p,.05,.25)});
  s+=fade(seg(p,.3,.45),label('（山の 数は 省略して 描いています）',850,WIN.y+128,{size:22,color:C.dim,anchor:'middle'}));
  s+=goalTag(G2);
  return s;
 },
 // 8. 1秒の間に出会うのは、聞き手の前 374 m までにある山（340＋34）。時間 0 → 1秒後で、黄色の山と聞き手が出会う
 [K+'window']:(p)=>{
  const u=lin(p,.42,.88);
  let s=meetRow(u,{bracket:seg(p,.05,.18),split:seg(p,.15,.28),mark:seg(p,.3,.4)});
  s+=card(30,92,190,60,label(u<.999?`時間 ${u<.01?'0':'…'}`:'1秒後',125,132,{size:28,color:TCOL,anchor:'middle',weight:700}),seg(p,.36,.42),TCOL);
  s+=fade(seg(p,.9,.97),plate('374 m の 中の 山と 全部 出会った',600,505,{size:26,color:C.hi}));
  s+=goalTag(G2);
  return s;
 },
 // 9. 374 m の中に 0.40 m おき → 374÷0.40＝935。カウンターが 935 まで。比べる：340÷0.40＝850（灰色）
 [K+'count']:(p,ctx)=>{
  const b=s2(ctx),u=lin(p,b+.05,voiceEnd(ctx));
  let s=meetRow(0,{bracket:1,split:1});
  const x1=WIN.x+SPW*5,x2=WIN.x+SPW*6;
  s+=fade(seg(p,.05,.2),dbl(x1,x2,WIN.y+96,LC,{w:4,head:12})+label('0.40 m',(x1+x2)/2,WIN.y+136,{size:28,color:LC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.05,.2),label('（山の 数は 省略して 描いています）',850,WIN.y+136,{size:22,color:C.dim,anchor:'middle'}));
  s+=card(300,86,360,70,T2(`374\\div 0.40=935`,480,128,{size:34}),seg(p,b,b+.08),FC);
  s+=fade(seg(p,b+.1,b+.2),label('止まっていれば 340÷0.40＝850',680,130,{size:22,color:C.dim,weight:700}));
  s+=counter(Math.round(935*u),10,WIN.y+104,seg(p,b,b+.08));
  s+=goalTag(G2);
  return s;
 },
 // 10. 850 Hz → 935 Hz。小問2 の答え C
 [K+'hear']:(p,ctx)=>{
  let s=card(250,110,700,120,T2(`850${HZ}\\ \\rightarrow\\ 935${HZ}`,600,178,{size:50}),seg(p,.03,.15),FC);
  s+=label('スピーカーの 振動数',430,270,{size:24,color:C.dim,anchor:'middle',opacity:seg(p,.08,.2)})+label('聞こえる 振動数',780,270,{size:24,color:FC,anchor:'middle',opacity:seg(p,.08,.2)});
  s+=fade(seg(p,.2,.32),plate('聞こえる 振動数 ＝ 1秒に 出会う 山の 数',600,340,{size:28,color:FC}));
  s+=goalTag(G2)+A2(ansG(p,ctx,1));
  return s;
 },
 // 11. 式でも f′＝f×(V＋vo)/V＝850×374/340＝850×1.1＝935 Hz。数えた 935 個と一致
 [K+'formula']:(p)=>{
  const hl=seg(p,.15,.25);
  let s=card(150,86,900,150,T2(`${fp}=${ft}\\times\\dfrac{${hl>.5?`{\\color{${C.hi}}\\boxed{${Vt}+${vot}}}`:`${Vt}+${vot}`}}{${Vt}}`,600,170,{size:44}),seg(p,.03,.12),C.hi);
  s+=card(150,250,900,120,T2(`850\\times\\dfrac{374}{340}=850\\times 1.1=935${HZ}`,600,316,{size:42}),seg(p,.3,.42),FC);
  s+=fade(seg(p,.6,.72),label('数えた 935個 と 一致',600,430,{size:30,color:OK,anchor:'middle',weight:700}));
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // 12. 誤答 A（V−vo：765 Hz）→ B（850＋34：884 Hz）。1枚ずつ
 [K+'wrongAB']:(p,ctx)=>{
  let s=card(150,90,900,140,T2(`${fp}=${ft}\\times\\dfrac{${Vt}+${vot}}{${Vt}}=935${HZ}`,600,166,{size:42}),.45,C.hi);
  s+=wrongSeq(p,ctx,[['A','765 Hz','近づくのに V−vo を 使った',{mid:`850\\times\\dfrac{306}{340}=765`,midSize:30}],['B','884 Hz','Hz と m/s を 足した',{mid:`850+34=884`,midSize:30}]],{opts:{y:260}});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // 13. 誤答 D（944 Hz：音源が動くときの式に 34 m/s を入れた）。小問3 でこの違いを考える
 [K+'wrongD2']:(p,ctx)=>{
  const b=s2(ctx);
  let s=card(150,90,900,140,T2(`${fp}=${ft}\\times\\dfrac{${Vt}+${vot}}{${Vt}}=935${HZ}`,600,166,{size:42}),.45,C.hi);
  s+=wrongCard('D','944 Hz','音源が 動く ときの 式を 使った',{y:260,mid:`850\\times\\dfrac{340}{340-34}\\approx 944`,midSize:30,g:seg(p,.03,.1)});
  s+=fade(seg(p,b,b+.1),plate('→ 小問3 で この 違いを 考える',600,480,{size:26,color:C.hi}));
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // ================= S3 小問3：理由 =================
 // 14. 求めるもの：935 と 944 が違う理由。右に音源が動く場面（前方で円の間隔が詰まる）。分母 V−vs を光らせる
 [K+'why1']:(p,ctx)=>{
  const b=s2(ctx),t=tAt(ctx,K+'why1');
  let s=fade(seg(p,.05,.15)*(1-seg(p,b-.02,b+.04)),card(300,150,600,110,label('935 Hz',450,222,{size:44,color:FC,anchor:'middle',weight:700})+label('約 944 Hz',750,222,{size:44,color:FC,anchor:'middle',weight:700}),1,C.dim));
  s+=rightPanel(t,{g:seg(p,b,b+.08),eq:seg(p,b+.2,b+.3),hl:seg(p,b+.4,b+.5)});
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 15. 左に聞き手が動く場面（円の間隔は同じ λ＝0.40 m）。分子 V＋vo を光らせる
 [K+'why2']:(p,ctx)=>{
  const t=tAt(ctx,K+'why1'),b=s2(ctx);
  let s=rightPanel(t,{hl:1})+leftPanel(t,{g:seg(p,.03,.12),eq:seg(p,b,b+.1),hl:seg(p,b+.2,b+.3)});
  s+=goalTag(G3);
  return s;
 },
 // 16. 小問3 の答え B。誤答 A（波長がより大きく縮む）。左の 0.40 m の物差しを光らせる
 [K+'ans3']:(p,ctx)=>{
  const t=tAt(ctx,K+'why1'),b=s2(ctx);
  let s=rightPanel(t,{hl:1})+leftPanel(t,{hl:1,ruleHi:seg(p,b+.1,b+.2)});
  s+=wrongCard('A','波長が より 大きく 縮む','聞き手が 動いても、山の 間隔は 変わらない',{y:392,g:seg(p,b,b+.05)});
  s+=goalTag(G3)+A3(ansG(p,ctx,0));
  return s;
 },
 // 17. 誤答 C（V−vo）：向かい合うので V＋vo。左の場面に向かい合う紫の矢印 2 本（340 と 34）
 [K+'wrongC3']:(p,ctx)=>{
  const t=tAt(ctx,K+'why1');
  let s=rightPanel(t,{hl:1})+leftPanel(t,{hl:1,arrows:seg(p,.1,.25)});
  s+=wrongCard('C','V−vo','向かい合うので V＋vo',{y:392,g:seg(p,.03,.1)});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 18. 誤答 D（差は計算の誤差）：しくみが違う。935 と 944 を並べ、間に「約 9 Hz」
 [K+'wrongD3']:(p,ctx)=>{
  const t=tAt(ctx,K+'why1'),b=s2(ctx);
  let s=rightPanel(t,{dim:.3})+leftPanel(t,{dim:.3});
  s+=card(250,120,700,130,label('935 Hz',400,210,{size:40,color:C.ink,anchor:'middle',weight:700})+label('約 944 Hz',800,210,{size:40,color:C.ink,anchor:'middle',weight:700})
   +arrow(500,190,700,190,{color:C.hi,w:3,head:10})+arrow(700,190,500,190,{color:C.hi,w:3,head:10})+label('約 9 Hz',600,170,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,b,b+.1),C.hi);
  s+=wrongCard('D','差は 計算の 誤差','しくみが 違う（差は 丸めの 誤差より 大きい）',{y:392,g:seg(p,.03,.1)});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // ================= S4 まとめ =================
 // 19. 左に聞き手が動く場面（λ＝0.40 m のまま、374÷0.40＝935 Hz）、右に音源が動く場面（λ前＝0.36 m、約 944 Hz）。分子と分母を光らせる
 [K+'sum']:(p,ctx)=>{
  const t=cueT(ctx),b=s2(ctx);
  let s=leftPanel(t,{g:seg(p,.03,.12),hl:seg(p,b,b+.1),ruleHi:seg(p,.15,.25)*(1-seg(p,b-.05,b))})+rightPanel(t,{g:seg(p,.03,.12),hl:seg(p,b,b+.1)});
  s+=fade(seg(p,.15,.25),label('374 ÷ 0.40 ＝ 935 → 935 Hz',PL.x+PL.w/2,PY+PH+40,{size:26,color:FC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.15,.25),label('約 944 Hz',PR.x+PR.w/2,PY+PH+40,{size:26,color:FC,anchor:'middle',weight:700}));
  s+=fade(seg(p,b,b+.1),plate('変わるのは、山と 出会う 速さ（分子）',PL.x+PL.w/2,PY+PH+90,{size:26,color:C.hi}));
  s+=answerRow([[1,'A','0.40 m'],[2,'C','935 Hz'],[3,'B','']],{g:seg(p,.5,.6),size:22});
  return s;
 },
};

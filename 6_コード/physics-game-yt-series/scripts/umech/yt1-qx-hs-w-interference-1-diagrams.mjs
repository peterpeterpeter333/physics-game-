// 問題編 解説「水面の点 P と点 Q」(ys-qx-hs-w-interference-1) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/305_干渉と回折.md の q-hs-w-interference-1（解説 18 行）。
// 上から見た水面：S₁（上）・S₂（下）を左寄りに置き、波は右へ広がる。S₁S₂＝16 cm（問題文にないので図のために決めた値）、1 cm＝18 px。
// 色（正本の指定）：λ・経路差 水色、T・遅れ 金、f 桃、v 紫、S₁ の波 水色系 W1、S₂ の波 桃系 W2、強め合いの線 黄、弱め合いの線 灰。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,poly,clamp} from './anim.mjs';
import {W1,W2} from './yt1-hs-w-sound-2-diagrams.mjs';
import {card,textW,goalTag,answerTag,answerTagW,wrongCard,wrongSeq,note,cueT,sentWin,voiceEnd,isProblem} from './yt1-qx-common.mjs';

const K='qx-hs-w-interference-1:';
const PI=Math.PI;
const LC=C.x,TCOL=C.t,FC=C.p,VCOL=C.v,STR=C.hi,WEAK='#8d9ab3',OK=C.F;
const n2=v=>Number(v.toFixed(2));
const G1='P と Q の揺れ方',G2='P での遅れ（秒と周期）',G3='半周期ずらしたときの P';
const A1=g=>answerTag(1,'D','P 強め合い、Q 弱め合い',{g}),A2=g=>answerTag(2,'B','0.75 s、3 周期',{g}),A3=g=>answerTag(3,'C','弱め合い',{g});
// 場面の中の通しの秒（波を cue をまたいで動かし続ける）
const sT=ctx=>(ctx?.scene?.captions?.[ctx.k]?.start??0)+(ctx?.t??0);
// 文の区切り（2文の行で、2文目の始まり）
const s2=(ctx,d=.5)=>{const W=sentWin(ctx);return W[1]?W[1][0]:d;};

// ---- 水面（上から見た図） ------------------------------------------------------------------------------
const TK={mx:150,my:340,s:18,half:8,lam:3.0,Td:.5,x0:0,x1:790,y0:86,y1:510};
const S1=[TK.mx,TK.my-TK.half*TK.s],S2=[TK.mx,TK.my+TK.half*TK.s];
const LP=TK.lam*TK.s;                         // 波長 54 px
const VP=LP/TK.Td;                            // 表示の速さ px/s（実際よりゆっくり）
// S₁ から r1、S₂ から r2（cm）の点（右側）
function ptOf(r1,r2,side=1){const w=(r1*r1-r2*r2)/(4*TK.half),x2=r1*r1-(w+TK.half)**2;if(x2<0)return null;return [TK.mx+side*Math.sqrt(x2)*TK.s,TK.my+w*TK.s];}
const PP=ptOf(15,24),QQ=ptOf(15,19.5);
const along=(A,B,u)=>[A[0]+(B[0]-A[0])*u,A[1]+(B[1]-A[1])*u];
let CL=0;
function tankBg(g=1){return fade(g,rect(TK.x0,TK.y0,TK.x1-TK.x0,TK.y1-TK.y0,{fill:'#0f2846',fo:.55,stroke:'#2b4a72',sw:2,rx:10}));}
// 山（実線）と谷（点線）の円。front＝波の先頭の半径（px、null なら画面の外まで）。anti＝S₂ を半周期ずらす
function ripples(t,{g=1,front=null,anti=0,op=1,on1=1,on2=1}={}){
 if(g<=0)return '';
 const id='qxi1c'+(++CL);let s='';
 const R=front??2000;
 [[S1,W1,on1,0],[S2,W2,on2,anti?.5:0]].forEach(([S,col,on,ph])=>{if(on<=0)return;
  for(let k=0;k<80;k++){
   const rc=VP*t-(k+ph)*LP-LP*.25,rt=rc-LP/2;            // 山・谷の半径
   if(rc<-LP&&rt<-LP)break;
   if(rc>0&&rc<=R&&rc<1300)s+=fade(on*op,ring(S[0],S[1],rc,{color:col,w:3}));
   if(rt>0&&rt<=R&&rt<1300)s+=fade(on*op*.75,ring(S[0],S[1],rt,{color:col,w:2,dash:'7 7'}));
  }});
 return fade(g,`<clipPath id="${id}"><rect x="${TK.x0}" y="${TK.y0}" width="${TK.x1-TK.x0}" height="${TK.y1-TK.y0}" rx="10"/></clipPath><g clip-path="url(#${id})">${s}</g>`);
}
// 波源の棒（上から見ると点）。上下の動きに合わせて大きさが少し変わる
function rods(t,{anti=0,g=1}={}){
 const k1=1+.25*Math.sin(2*PI*t/TK.Td),k2=1+.25*Math.sin(2*PI*t/TK.Td+(anti?PI:0));
 let s=dot(S1[0],S1[1],11*k1,W1)+dot(S2[0],S2[1],11*k2,W2);
 s+=rect(S1[0]-70,S1[1]-20,40,40,{fill:C.bg,fo:.8,stroke:'none',rx:8})+rect(S2[0]-70,S2[1]-20,40,40,{fill:C.bg,fo:.8,stroke:'none',rx:8});
 s+=tex('S_1',S1[0]-50,S1[1]+10,{size:30,color:W1,auto:false})+tex('S_2',S2[0]-50,S2[1]+10,{size:30,color:W2,auto:false});
 return fade(g,s);
}
// 点 P・Q と、S₁・S₂ からの細い線と距離
function ptMark(q,name,{g=1}={}){return fade(g,dot(q[0],q[1],10,C.ink)+ring(q[0],q[1],10,{color:C.bg,w:2})+label(name,q[0]+18,q[1]+10,{size:30,color:C.ink,weight:700}));}
// 文字の後ろに暗い下地（波の円の上でも読めるように）
function tl(t,x,y,{size=24,color=C.ink,anchor='start'}={}){const w=textW(t,size)+10,x0=anchor==='middle'?x-w/2:anchor==='end'?x-w+5:x-5;
 return rect(x0,y-size*.95,w,size*1.3,{fill:C.bg,fo:.8,stroke:'none',rx:6})+label(t,x,y,{size,color,anchor,weight:700});}
function distP({g=1,lab=1,col1=C.ink,col2=C.ink,w=2.5}={}){
 let s=line(S1[0],S1[1],PP[0],PP[1],{color:col1,w})+line(S2[0],S2[1],PP[0],PP[1],{color:col2,w});
 if(lab)s+=tl('15 cm',290,150,{color:col1,anchor:'middle'})+tl('24 cm',262,318,{color:col2,anchor:'end'});
 return fade(g,s+ptMark(PP,'P'));
}
function distQ({g=1,lab=1,col1=C.ink,col2=C.ink,w=2.5}={}){
 let s=line(S1[0],S1[1],QQ[0],QQ[1],{color:col1,w})+line(S2[0],S2[1],QQ[0],QQ[1],{color:col2,w});
 if(lab)s+=tl('15 cm',228,244,{color:col1,anchor:'middle'})+tl('19.5 cm',312,404,{color:col2,anchor:'start'});
 return fade(g,s+ptMark(QQ,'Q'));
}
// f・λ の札（右の欄の下。水面の左上は P への線と重なるので、右に置く）
const fl=(g=1)=>card(812,446,374,56,label('f ＝ 4.0 Hz',832,483,{size:26,color:FC,weight:700})+label('λ ＝ 3.0 cm',1010,483,{size:26,color:LC,weight:700}),g,C.dim);
// 山・谷の見本と「ゆっくり」（右の欄）
function legendWave(g=1){
 let s=card(812,96,374,150,'',1,C.dim);
 s+=line(836,136,906,136,{color:C.ink,w:3})+label('山（実線）',922,145,{size:26,color:C.ink,weight:700});
 s+=line(836,184,906,184,{color:C.ink,w:2,dash:'7 7'})+label('谷（点線）',922,193,{size:26,color:C.ink,weight:700});
 s+=label('動きは 実際より ゆっくり',999,232,{size:22,color:C.dim,anchor:'middle'});
 return fade(g,s);
}
// 強め合いの線（黄）・弱め合いの線（灰）：r2−r1＝D の双曲線。anti なら入れ替わる
function hyper(D,{color,w=3.5,dash='',g=1}={}){
 const r0=(2*TK.half-Math.abs(D))/2;if(r0<=0)return '';
 const sgn=D>=0?1:-1;let out='';
 for(const side of [1,-1]){const pts=[];
  for(let i=0;i<=120;i++){const a=r0+.0001+(60-r0)*(i/120)**1.5;const r1=D>=0?a:a-D,r2=r1+D;const q=ptOf(r1,r2,side);if(q)pts.push(q);}
  out+=draw(pts,1,{color,w,dash});}
 return fade(g,out);
}
function lines({g=1,anti=0,hlS=null,hlW=null}={}){
 if(g<=0)return '';
 const id='qxi1h'+(++CL);let s='';
 for(let m=-6;m<=6;m++){const Ds=(m+(anti?.5:0))*TK.lam,Dw=(m+(anti?0:.5))*TK.lam;
  if(Math.abs(Ds)<2*TK.half)s+=hyper(Ds,{color:STR,w:Ds===hlS?6:3.5});
  if(Math.abs(Dw)<2*TK.half)s+=hyper(Dw,{color:WEAK,w:Dw===hlW?6:3.5,dash:'10 8'});}
 return fade(g,`<clipPath id="${id}"><rect x="${TK.x0}" y="${TK.y0}" width="${TK.x1-TK.x0}" height="${TK.y1-TK.y0}" rx="10"/></clipPath><g clip-path="url(#${id})">${s}</g>`);
}
// 経路差の部分（S₂ 側の道の、S₂ から extra cm）を水色の太線で
function extraSeg(Q,r2,extra,{g=1,ticks=0,mark=1}={}){
 const A=S2,B=along(S2,Q,extra/r2);
 let s=line(A[0],A[1],B[0],B[1],{color:LC,w:10});
 if(mark){const dx=Q[0]-S2[0],dy=Q[1]-S2[1],L=Math.hypot(dx,dy),nx=-dy/L*14,ny=dx/L*14;s+=line(B[0]-nx,B[1]-ny,B[0]+nx,B[1]+ny,{color:C.hi,w:4});}
 if(ticks)for(let k=1;k*TK.lam<extra-.01;k++){const T=along(S2,Q,k*TK.lam/r2),dx=Q[0]-S2[0],dy=Q[1]-S2[1],L=Math.hypot(dx,dy),nx=-dy/L*10,ny=dx/L*10;s+=fade(ticks,line(T[0]-nx,T[1]-ny,T[0]+nx,T[1]+ny,{color:C.bg,w:4}));}
 return fade(g,s);
}
// 水面の図ひとまとめ
function tank(t,{waves=1,anti=0,front=null,P=1,Q=1,lab=1,F=1,op=1,rodsAnti=anti}={}){
 return tankBg()+ripples(t,{g:waves,front,anti,op})+rods(t,{anti:rodsAnti})+distP({g:P,lab})+distQ({g:Q,lab})+fl(F);
}
// 横から見た棒（右の欄）。anti＝逆向き。stopAt＝止める（S₁ 上・S₂ 下）
function sideView(ph,{g=1,anti=1,x=812,y=96,w=374,h=270,text=1}={}){
 const yw=y+170,A=26,u=Math.sin(ph);
 let s=card(x,y,w,h,'',1,C.dim);
 s+=label('横から 見ると',x+w/2,y+36,{size:24,color:C.dim,anchor:'middle'});
 s+=line(x+20,yw,x+w-20,yw,{color:'#4a90d9',w:3});
 const b1=x+w*.32,b2=x+w*.68,y1=yw-40-A*u,y2=yw-40-A*(anti?-u:u);
 s+=rect(b1-9,y1-20,18,70,{fill:W1,fo:.9,stroke:W1,rx:4})+rect(b2-9,y2-20,18,70,{fill:W2,fo:.9,stroke:W2,rx:4});
 s+=tex('S_1',b1-32,yw+36,{size:26,color:W1,auto:false})+tex('S_2',b2+32,yw+36,{size:26,color:W2,auto:false});
 s+=arrow(b1+24,y1+15,b1+24,y1+15-30*Math.cos(ph),{color:C.ink,w:3,head:10,g:Math.abs(Math.cos(ph))>.15?1:0});
 s+=arrow(b2+24,y2+15,b2+24,y2+15+30*Math.cos(ph)*(anti?1:-1),{color:C.ink,w:3,head:10,g:Math.abs(Math.cos(ph))>.15?1:0});
 if(text)s+=fade(text,label('S₁ が山のとき S₂ が谷',x+w/2,y+h-22,{size:26,color:C.hi,anchor:'middle',weight:700}));
 return fade(g,s);
}
// ---- P・Q での揺れの時間のグラフ ----------------------------------------------------------------------
const TG={x0:270,x1:1150,ys:[168,300,430],A:32,per:125};
function tgraph({sh=0,anti=0,gs=0,mark=1,shLab='',g=1,sumLab='',title=''}={}){
 const [y1,y2,y3]=TG.ys,xa=TG.x0+TG.per*1.5;
 const w1=X=>TG.A*Math.cos(2*PI*(X-xa)/TG.per),w2=X=>TG.A*Math.cos(2*PI*((X-xa)/TG.per-sh)+(anti?PI:0));
 const tr=(y,fn,col,wd)=>{const pts=[];for(let X=TG.x0;X<=TG.x1;X+=3)pts.push([X,y-fn(X)]);return draw(pts,1,{color:col,w:wd});};
 let s=[y1,y2].map(y=>line(TG.x0,y,TG.x1,y,{color:C.faint,w:2,dash:'6 8'})).join('');
 s+=label('S₁ からの 波',TG.x0-16,y1+8,{size:24,color:W1,anchor:'end',weight:700})+label('S₂ からの 波',TG.x0-16,y2+8,{size:24,color:W2,anchor:'end',weight:700});
 s+=tr(y1,w1,W1,3.5)+tr(y2,w2,W2,3.5);
 if(mark){
  const xb=xa+sh*TG.per;
  s+=fade(mark,poly([[xa-11,y1-TG.A-28],[xa+11,y1-TG.A-28],[xa,y1-TG.A-10]],{fill:C.ink,fo:1}));
  if(xb<=TG.x1)s+=fade(mark,poly([[xb-11,y2-TG.A-28],[xb+11,y2-TG.A-28],[xb,y2-TG.A-10]],{fill:W2,fo:1}));
  if(sh>.02)s+=arrow(xa,y2-TG.A-44,Math.min(xb,TG.x1),y2-TG.A-44,{color:TCOL,w:3,head:12,g:mark});
  if(shLab)s+=fade(mark,label(shLab,(xa+Math.min(xb,TG.x1))/2,y2-TG.A-52,{size:24,color:TCOL,anchor:'middle',weight:700}));
  s+=fade(mark*.8,line(xa,y1+TG.A+6,xa,(gs?y3:y2)+TG.A+6,{color:C.hi,w:2,dash:'4 6'}));
 }
 if(gs){s+=fade(gs,line(TG.x0,y3,TG.x1,y3,{color:C.faint,w:2,dash:'6 8'})+tr(y3,X=>w1(X)+w2(X),C.ink,4.5)+label('足した 揺れ',TG.x0-16,y3+8,{size:24,color:C.ink,anchor:'end',weight:700}));
  if(sumLab)s+=fade(gs,label(sumLab,TG.x1,y3-TG.A*2-14,{size:24,color:C.hi,anchor:'end',weight:700}));}
 s+=label('時刻',40,500,{size:22,color:TCOL})+arrow(96,492,200,492,{color:TCOL,w:3,head:12});
 if(title)s+=label(title,TG.x1,104,{size:26,color:C.ink,anchor:'end',weight:700});
 return fade(g,s);
}
const PLUS=t=>label(t,TG.x0+TG.per*1.5+22,TG.ys[0]-TG.A-14,{size:24,color:C.hi,weight:700});
// ---- 物差し（経路差を λ で区切る。1 cm＝40 px） ---------------------------------------------------------
function ruler(x,y,cm,{g=1,cut=1,title='',s=40}={}){
 let o='';const L=cm*s;
 o+=rect(x,y-14,L,28,{fill:LC,fo:.35,stroke:LC,sw:2,rx:4});
 for(let k=0;k*TK.lam<cm-.01;k++){const a=x+k*TK.lam*s,b=Math.min(x+L,a+TK.lam*s);
  o+=fade(cut,rect(a+2,y-12,b-a-4,24,{fill:k%2?LC:'#2fb6e0',fo:.55,stroke:'none',rx:3})+(b-a>=TK.lam*s-1?label('λ',(a+b)/2,y+52,{size:26,color:LC,anchor:'middle',weight:700}):label('½λ',(a+b)/2,y+52,{size:24,color:LC,anchor:'middle',weight:700})));
  if(k>0)o+=fade(cut,line(a,y-24,a,y+24,{color:C.ink,w:3}));}
 if(title)o+=label(title,x,y-30,{size:26,color:LC,weight:700});
 return fade(g,o);
}
// 答えの札を右上に横一列（長い値は2行の札。answerRow と同じ並べ方で、幅の上限だけ変える）
function ansRow(items,{g=1,size=22,gap=10,maxW=330}={}){let x=1190,s='';for(const it of [...items].reverse()){s+=answerTag(...it,{g,right:x,size,maxW});x-=answerTagW(...it,{size,maxW})+gap;}return s;}
const eq=(src,x,y,size=36)=>tex(src,x,y,{size,auto:false});

export const qxHsWInterference1Diagrams={
 // ================= 問題アニメ：出題（小問1・2、6 秒＋静止） =================
 // S₁・S₂ から山（実線）と谷（点線）の円が広がり、水面の端まで届いたところで止まる。強め合い・弱め合いの線は描かない。
 [K+'q0']:(p,ctx)=>{
  const t=cueT(ctx),front=100+(790-100)*clamp(t/5.6);
  let s=tankBg()+ripples(t+20,{front})+rods(t);
  s+=distP({g:seg(p,.05,.2)})+distQ({g:seg(p,.12,.27)})+fl(seg(p,0,.12));
  s+=legendWave(seg(p,.05,.2));
  return s;
 },
 // ================= 問題アニメ：小問3（約3秒） =================
 // 同位相の円を消し、棒・P・Q・距離・f・λ だけを残す。横から見た棒が逆向きに1往復して、S₁ 上・S₂ 下で止まる。
 [K+'q3']:(p,ctx)=>{
  const t=cueT(ctx),u=lin(t,.7,3.0),ph=2*PI*1.25*u;
  let s=tankBg()+ripples(10,{g:1-seg(t,0,.5)})+rods(u*1.25*TK.Td,{anti:1});
  s+=distP({})+distQ({})+fl();
  s+=sideView(ph,{g:seg(t,.4,.8),text:seg(t,2.6,3.0)});
  return s;
 },
 // ================= S1 小問1 =================
 // 1. 出題中の水面の図。棒が同時に上下する
 [K+'setup']:(p,ctx)=>{
  const t=8+sT(ctx);
  return tank(t)+legendWave();
 },
 // 2. 求めるもの。v＝fλ＝12 cm/s（紫）、T＝0.25 s（金）
 [K+'goal1']:(p,ctx)=>{
  const t=8+sT(ctx),b=s2(ctx);
  let s=tank(t,{op:.7});
  s+=card(812,96,374,110,eq(`{\\color{${VCOL}}v}={\\color{${FC}}f}{\\color{${LC}}\\lambda}=4.0\\times 3.0`,999,138,30)+eq(`=12\\ \\mathrm{cm/s}`,999,186,30),seg(p,b,b+.08),VCOL);
  s+=card(812,222,374,80,eq(`{\\color{${TCOL}}T}=\\dfrac{1}{4.0}=0.25\\ \\mathrm{s}`,999,270,30),seg(p,b+.3,b+.4),TCOL);
  s+=goalTag(G1,{g:seg(p,.03,.12)});
  return s;
 },
 // 3. P の経路差 9.0 cm：S₁→P 水色、S₂→P 桃、S₂ の道に「15 cm」の印、残り 9.0 cm を水色の太線
 [K+'pathP']:(p,ctx)=>{
  const t=8+sT(ctx);
  let s=tankBg()+ripples(t,{op:.25})+rods(t)+fl()+distQ({g:.25,lab:0});
  s+=distP({col1:W1,col2:W2,w:4});
  s+=extraSeg(PP,24,9,{g:seg(p,.25,.4)});
  s+=fade(seg(p,.15,.28),label('黄の 印 から P まで',830,236,{size:24,color:C.hi,weight:700})+label('15 cm（S₁ と 同じ）',830,270,{size:24,color:C.hi,weight:700}));
  s+=card(812,96,374,90,label('経路差 9.0 cm',999,152,{size:32,color:LC,anchor:'middle',weight:700}),seg(p,.3,.42),LC);
  s+=fade(seg(p,.55,.7),label('S₂ の 波は',830,326,{size:26,color:W2,weight:700})+label('9.0 cm 余分に 進む',830,364,{size:26,color:C.ink,weight:700}));
  s+=goalTag(G1);
  return s;
 },
 // 4. 遅れ 9.0÷12＝0.75 s。0.25 s の目盛り3つ →「3周期」
 [K+'delay']:(p,ctx)=>{
  const t=8+sT(ctx),b=s2(ctx);
  let s=tankBg()+ripples(t,{op:.25})+rods(t)+fl()+distQ({g:.25,lab:0})+distP({col1:W1,col2:W2,w:4})+extraSeg(PP,24,9,{});
  s+=card(812,96,374,90,eq(`9.0\\div 12={\\color{${TCOL}}0.75\\ \\mathrm{s}}`,999,148,34),seg(p,.04,.15),TCOL);
  const x0=840,wT=104;
  for(let k=0;k<3;k++){const g=seg(p,b+.05+k*.1,b+.13+k*.1);
   s+=fade(g,rect(x0+k*wT+2,236,wT-4,30,{fill:TCOL,fo:.35,stroke:TCOL,sw:2,rx:4})+label('0.25 s',x0+k*wT+wT/2,296,{size:22,color:TCOL,anchor:'middle',weight:700}));}
  s+=fade(seg(p,b+.4,b+.5),label('＝ 3周期',999,346,{size:32,color:TCOL,anchor:'middle',weight:700}));
  s+=goalTag(G1);
  return s;
 },
 // 5. P での揺れの時間のグラフ。S₂ を 3周期ずらすと山と山が重なる → 足すと 2倍
 [K+'graphP']:(p,ctx)=>{
  const b=s2(ctx),u=seg(p,.08,b-.02);
  let s=tgraph({sh:3*u,shLab:u>.95?'0.75 s ＝ 3周期 遅れ':'',gs:seg(p,b+.05,b+.2),sumLab:'2倍の 振幅',title:'点 P での 揺れ'});
  s+=fade(seg(p,b-.1,b),PLUS('山 ＋ 山'));
  s+=goalTag(G1);
  return s;
 },
 // 6. 経路差 9.0 cm を λ＝3.0 cm の物差しで 3つに区切る。経路差＝mλ → 強め合い（m＝3）
 [K+'ruler']:(p,ctx)=>{
  let s=ruler(420,190,9,{cut:seg(p,.15,.35),title:'経路差 9.0 cm'});
  s+=fade(seg(p,.25,.4),label('9.0 ÷ 3.0 ＝ 3',600,320,{size:32,color:C.ink,anchor:'middle',weight:700}));
  s+=card(300,360,600,90,label('経路差 ＝',470,424,{size:32,color:LC,anchor:'end',weight:700})+tex(`m{\\color{${LC}}\\lambda}`,510,412,{size:36,auto:false})+label('→ 強め合い',690,418,{size:30,color:STR,weight:700}),seg(p,.55,.68),STR);
  s+=fade(seg(p,.7,.82),label('（m ＝ 3）',600,486,{size:26,color:C.dim,anchor:'middle',weight:700}));
  s+=goalTag(G1);
  return s;
 },
 // 7. Q：経路差 4.5 cm＝1.5λ（物差し 1個半）→ 時間のグラフで山に谷 → ほぼ 0
 [K+'Q']:(p,ctx)=>{
  const t=8+sT(ctx),b=s2(ctx),sw=seg(p,b-.02,b+.06);
  let a=tankBg()+ripples(t,{op:.2})+rods(t)+fl()+distP({g:.25,lab:0})+distQ({col1:W1,col2:W2,w:4})+extraSeg(QQ,19.5,4.5,{g:seg(p,.1,.22),ticks:seg(p,.3,.4)});
  a+=card(812,96,374,90,label('経路差 4.5 cm',999,152,{size:32,color:LC,anchor:'middle',weight:700}),seg(p,.08,.2),LC);
  a+=fade(seg(p,.25,.38),ruler(830,270,4.5,{}));
  a+=fade(seg(p,.35,.45),label('＝ 1.5λ',999,380,{size:32,color:LC,anchor:'middle',weight:700}));
  let s=fade(1-sw,a);
  const u=seg(p,b+.04,b+.17);
  s+=fade(sw,tgraph({sh:1.5*u,shLab:u>.95?'1.5周期 遅れ':'',gs:seg(p,b+.22,b+.3),sumLab:'ほぼ 0',title:'点 Q での 揺れ'}));
  s+=fade(sw*seg(p,b+.17,b+.22),PLUS('山 ＋ 谷'));
  s+=goalTag(G1);
  return s;
 },
 // 8. 強め合いの線（黄）と弱め合いの線（灰）。P は黄、Q は灰の線の上。答え D → 誤答 A
 [K+'ans1']:(p,ctx)=>{
  const t=8+sT(ctx),b=s2(ctx,.3);
  const dm=1-.65*seg(p,b,b+.05);
  let s=fade(dm,tankBg()+ripples(t,{op:.25})+lines({g:seg(p,.03,.15),hlS:9,hlW:4.5})+rods(t)+distP({lab:0,g:1})+distQ({lab:0,g:1})+fl());
  s+=card(812,96,374,130,'',seg(p,.05,.15),C.dim);
  s+=fade(seg(p,.05,.15),line(836,140,900,140,{color:STR,w:4})+label('強め合い',916,149,{size:26,color:STR,weight:700})+line(836,192,900,192,{color:WEAK,w:4,dash:'10 8'})+label('弱め合い',916,201,{size:26,color:WEAK,weight:700}));
  s+=fade(seg(p,.1,.2),label('P：黄の 線',830,272,{size:26,color:STR,weight:700})+label('Q：灰の 線',830,312,{size:26,color:WEAK,weight:700}));
  s+=goalTag(G1)+A1(seg(p,b*.75,b*.75+.06));
  s+=wrongCard('A','P 弱め合い、Q 強め合い','経路差が 大きいほど 弱め合う とした',{g:seg(p,b+.02,b+.07)});
  return s;
 },
 // 9. 誤答 B・C を1枚ずつ。経路差を λ で区切った物差し2本（3個、1.5個）
 [K+'wrongBC']:(p,ctx)=>{
  let s=ruler(330,140,9,{title:'P：経路差 9.0 cm'})+label('3個 → 強め合い',740,148,{size:26,color:STR,weight:700});
  s+=ruler(330,260,4.5,{title:'Q：経路差 4.5 cm',g:1})+label('1.5個 → 弱め合い',560,268,{size:26,color:WEAK,weight:700});
  s+=goalTag(G1)+A1(1);
  s+=wrongSeq(p,ctx,[['B','どちらも 強め合い','どこでも 大きく 揺れる とした'],['C','どちらも 弱め合い','経路差が 0 でなければ 弱め合う とした']],{win:[[0,.36],[.36,1]],opts:{y:350}});
  return s;
 },
 // ================= S2 小問2 =================
 // 10. 求めるもの。番号4 の式をもう一度
 [K+'goal2']:(p,ctx)=>{
  const b=s2(ctx);
  let s=card(250,120,700,100,eq(`9.0\\div 12={\\color{${TCOL}}0.75\\ \\mathrm{s}}`,600,180,42),seg(p,.12,.22),TCOL);
  s+=card(250,250,700,100,eq(`0.75\\div 0.25=3`,540,310,42)+label('周期',690,322,{size:34,color:TCOL,weight:700}),seg(p,b+.3,b+.4),TCOL);
  s+=fade(seg(p,.18,.28),label('経路差 ÷ 速さ',600,108,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,b+.4,b+.5),label('（周期で 割る）',600,390,{size:24,color:C.dim,anchor:'middle'}));
  s+=goalTag(G2,{g:seg(p,.03,.12)});
  return s;
 },
 // 11. 答え B。誤答 A（秒の数を周期の数にした）
 [K+'ans2']:(p,ctx)=>{
  const b=s2(ctx,.3);
  let s=card(250,100,700,90,eq(`9.0\\div 12={\\color{${TCOL}}0.75\\ \\mathrm{s}}`,600,155,38),1,TCOL);
  s+=card(250,206,700,90,eq(`0.75\\div 0.25=3`,540,262,38)+label('周期',680,274,{size:32,color:TCOL,weight:700}),1,TCOL);
  s+=goalTag(G2)+A2(seg(p,b*.7,b*.7+.06));
  s+=wrongCard('A','0.75 s、0.75 周期','秒の 数を、そのまま 周期の 数と した',{g:seg(p,b+.02,b+.07)});
  return s;
 },
 // 12. 誤答 C・D を1枚ずつ
 [K+'wrongCD']:(p,ctx)=>{
  let s=card(250,100,700,90,eq(`9.0\\div 12={\\color{${TCOL}}0.75\\ \\mathrm{s}}`,600,155,38),1,TCOL);
  s+=card(250,206,700,90,eq(`0.75\\div 0.25=3`,540,262,38)+label('周期',680,274,{size:32,color:TCOL,weight:700}),1,TCOL);
  s+=goalTag(G2)+A2(1);
  s+=wrongSeq(p,ctx,[['C','3.0 s、12 周期','波長の 個数を 秒と した',{mid:'9.0\\div 3.0=3',midSize:30}],['D','108 s、432 周期','経路差に 速さを 掛けた',{mid:'9.0\\times 12=108',midSize:30}]],{opts:{y:318}});
  return s;
 },
 // ================= S3 小問3 =================
 // 13. 同位相の円・線を消し、出題中の小問3 の画面。棒が逆向きに上下する
 [K+'goal3']:(p,ctx)=>{
  const t=cueT(ctx),ph=2*PI*t/1.6;
  let s=tankBg()+rods(t*TK.Td/1.6,{anti:1})+distP({})+distQ({})+fl();
  s+=sideView(ph,{text:seg(p,s2(ctx),s2(ctx)+.1)});
  s+=goalTag(G3,{g:seg(p,.03,.12)});
  return s;
 },
 // 14. P の時間のグラフ：3周期ずらした後も、出発の半周期のずれが残る → 山に谷
 [K+'graph3']:(p,ctx)=>{
  const b=s2(ctx),u=seg(p,.1,b-.02);
  let s=tgraph({sh:3*u,anti:1,shLab:u>.95?'道のりの 遅れ 3周期':'',title:'点 P での 揺れ（波源を 半周期 ずらした）'});
  s+=fade(seg(p,b+.05,b+.2),label('出発の ずれ 半周期 が 残る',TG.x0+TG.per*4.5,TG.ys[1]+TG.A+40,{size:24,color:C.hi,anchor:'middle',weight:700})+PLUS('山 ＋ 谷'));
  s+=goalTag(G3);
  return s;
 },
 // 15. 足すとほぼ 0 → 答え C → 答えの札のあとで、水面を描き直す（S₂ の山と谷を入れ替え、黄と灰の線も入れかわる）
 [K+'ans3']:(p,ctx)=>{
  const b=s2(ctx),ve=voiceEnd(ctx),sw=seg(p,ve+.02,ve+.12),t=8+cueT(ctx);
  let s=fade(1-sw,tgraph({sh:3,anti:1,gs:seg(p,.05,.2),sumLab:'ほぼ 0',title:'点 P での 揺れ（波源を 半周期 ずらした）'})+PLUS('山 ＋ 谷'));
  s+=fade(sw,tankBg()+ripples(t,{anti:1,op:.45})+lines({g:seg(p,ve+.12,ve+.25),anti:1,hlW:9})+rods(t,{anti:1})+distP({lab:0})+fl());
  s+=fade(sw,card(812,96,374,190,'',1,C.dim)+label('S₂ の 山と 谷を',999,140,{size:24,color:W2,anchor:'middle',weight:700})+label('入れ替えて 描く',999,174,{size:24,color:W2,anchor:'middle',weight:700})
   +fade(seg(p,ve+.12,ve+.25),line(836,214,900,214,{color:STR,w:4})+label('強め合い',916,223,{size:24,color:STR,weight:700})+line(836,256,900,256,{color:WEAK,w:4,dash:'10 8'})+label('弱め合い',916,265,{size:24,color:WEAK,weight:700})));
  s+=fade(seg(p,ve+.2,ve+.3),label('P：灰の 線',830,330,{size:26,color:WEAK,weight:700}));
  s+=goalTag(G3)+A3(seg(p,b+.12,b+.2));
  return s;
 },
 // 16. 誤答 A。「経路差＝mλ → 強め合い」に「（同位相のとき）」を黄色で足す
 [K+'wrongA3']:(p,ctx)=>{
  let s=card(200,110,800,110,label('経路差 ＝',390,182,{size:32,color:LC,anchor:'end',weight:700})+tex(`m{\\color{${LC}}\\lambda}`,432,170,{size:38,auto:false})+label('→ 強め合い',570,178,{size:30,color:STR,weight:700}),1,STR);
  s+=fade(seg(p,.25,.38),label('（同位相のとき）',770,178,{size:28,color:C.hi,weight:700}));
  s+=goalTag(G3)+A3(1);
  s+=wrongCard('A','強め合いの まま','条件は 同位相の 波源の ときの もの',{g:seg(p,.05,.12),y:300});
  return s;
 },
 // 17. 誤答 B・D を1枚ずつ
 [K+'wrongBD3']:(p,ctx)=>{
  let s=card(200,110,800,110,label('経路差 ＝',390,182,{size:32,color:LC,anchor:'end',weight:700})+tex(`m{\\color{${LC}}\\lambda}`,432,170,{size:38,auto:false})+label('→ 強め合い',570,178,{size:30,color:STR,weight:700})+label('（同位相のとき）',770,178,{size:28,color:C.hi,weight:700}),1,STR);
  s+=goalTag(G3)+A3(1);
  s+=wrongSeq(p,ctx,[['B','さらに 大きく 揺れる','山に 谷が 重なる'],['D','強弱を くり返す','振動数が 同じ なので、うなりに ならない']],{opts:{y:300}});
  return s;
 },
 // ================= S4 まとめ =================
 [K+'sum']:(p,ctx)=>{
  const col=[[STR,'点 P','経路差 3λ','3周期の 遅れ','強め合い'],[WEAK,'点 Q','経路差 1.5λ','1.5周期の 遅れ','弱め合い'],[WEAK,'波源を 半周期 ずらした P','3周期 ＋ 半周期','のずれ','弱め合い']];
  let s='';
  col.forEach(([c,h,a,b,r],i)=>{const x=20+i*395,g=seg(p,.03+i*.15,.13+i*.15);
   s+=card(x,110,375,300,label(h,x+187,160,{size:i===2?24:30,color:C.ink,anchor:'middle',weight:700})+label(a,x+187,230,{size:28,color:LC,anchor:'middle',weight:700})+label(b,x+187,280,{size:28,color:TCOL,anchor:'middle',weight:700})+label(r,x+187,360,{size:34,color:c,anchor:'middle',weight:700}),g,c);});
  s+=fade(seg(p,.55,.65),label('同位相の 波源：経路差 mλ で 強め合い、(m＋½)λ で 弱め合い',600,465,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=ansRow([[1,'D','P 強め合い、Q 弱め合い'],[2,'B','0.75 s、3 周期'],[3,'C','弱め合い']],{g:seg(p,.6,.7)});
  return s;
 },
};

// 問題編 解説「2 nC を囲む球」（q-um-gauss-sphere-preview、大学編 21 ガウスの法則・中級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/21_ガウスの法則.md の q-um-gauss-sphere-preview（解説 21 行）。
// 色（正本の約束）：電場 𝐄 水色、法線 𝐧 桃、面積 金、電気束 Φ・強調 黄、正電荷 赤、負電荷 青、誤り 赤。
// 札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 球の描き方は 単元動画 ys-um-gauss-sphere-preview-1 の部品（正射影の 3D、手前の格子だけ実線）を import して使う（あちらは編集しない）。
// 小問2 の矢印：球の中心を半径の半分だけ右へずらし、各タイルで電荷からの向き・1/(距離)² の長さを計算して描く（最長は一定に抑える）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,texWidth} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,sentWin,cueT,voiceEnd} from './yt1-qx-common.mjs';
import {GC,cs,T,OI,view,SPHERE,surface,sphereOutline,patch,sph} from './yt1-um-gauss-sphere-preview-1-diagrams.mjs';
import {charge} from './yt1-ui-closed-bag-1-diagrams.mjs';

const K='qx-um-gauss-sphere-preview:';
const BAD='#ff6b6b',NEGC='#7fb3ff',POSC=C.a;
const G1='中心の 球面の 電気束 Φ',G2='球を ずらしたときの Φ と 求め方',G3='2つの電荷を 入れたときの Φ';
const ANS1=g=>answerTag(1,'C','226 N·m²/C',{g}),ANS2=g=>answerTag(2,'A','',{g}),ANS3=g=>answerTag(3,'B','−339 N·m²/C',{g});
const blink=ctx=>.5+.5*Math.sin(cueT(ctx)*7);
const UF='\\,\\mathrm{N\\cdot m^2/C}';
const E_=cs(GC.E,'E'),vE=cs(GC.E,'\\mathbf{E}'),vn=cs(GC.n,'\\mathbf{n}'),A4=cs(GC.A,'4\\pi r^2'),PHI=cs(C.hi,'\\Phi');
const inWin=(p,[a,b],last=false)=>seg(p,a+.005,a+.04)*(last?1:1-seg(p,b-.03,b));
function clauseWin(ctx,si,groups){
 const W=sentWin(ctx),[a,b]=W[si]??[0,1];
 const r=(ctx?.cue?.reading??'').split('。').map(x=>x.replace(/\s/g,'')).filter(Boolean)[si]??'';
 const parts=r.split('、').map(x=>Math.max(1,x.length));
 const tot=parts.reduce((x,y)=>x+y,0);let acc=0,k=0;const out=[];
 for(const n of groups){const s0=acc;for(let j=0;j<n&&k<parts.length;j++,k++)acc+=parts[k];out.push([a+(b-a)*s0/tot,a+(b-a)*acc/tot]);}
 out[out.length-1][1]=Math.max(out[out.length-1][1],1);
 return out;
}

// ---- 球（正射影の 3D）。中心 (CX,CY)、半径 R px（＝ 3 m）。spin は縦軸のまわりの回転 ----
const CX=300,CY=300,R=165,TILT=.36,SPIN0=.5,SPIN=.5+Math.PI/6;
const PX=600,PW=580,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const add=(a,b,k=1)=>[a[0]+k*b[0],a[1]+k*b[1],a[2]+k*b[2]];
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const nrm=a=>{const l=Math.hypot(...a);return [a[0]/l,a[1]/l,a[2]/l];};
// 画面で真右に動く向き（spin に合わせる）
const RIGHT=sp=>[Math.cos(sp),0,Math.sin(sp)];
// 球の中心をモデル座標 c に置いたときの射影（電荷はモデルの原点）
const viewAt=(c,{spin=SPIN,r=R}={})=>{const P0=view(CX,CY,r,{tilt:TILT,spin});const pc=P0(c);return {P0,P:view(pc[0],pc[1],r,{tilt:TILT,spin}),pc};};
// 手前を向くタイル（30° の格子の中心）。depth＝法線の画面の奥行き成分
function frontTiles(spin=SPIN,min=.35){
 const P=view(0,0,1,{tilt:TILT,spin}),out=[];
 for(const f of [-45,-15,15,45])for(let l=-165;l<180;l+=30){const p=sph(f,l),a=P(p),b=P(add(p,p,1));const d=b[2]-a[2];if(d>min)out.push([f,l,d]);}
 return out;
}
const TL=frontTiles();
function sphereFig({c=[0,0,0],spin=SPIN,grid=1,g=1,q=1,r=R,qlabel=1}={}){
 const {P0,P}=viewAt(c,{spin,r});
 let s=surface(P,SPHERE,{g:grid})+ring(P([0,0,0])[0],P([0,0,0])[1],r,{color:'#c9d6ee',w:3});
 const o=P0([0,0,0]);
 if(q)s+=fade(q,charge(o[0],o[1],1,18)+(qlabel?label('+2 nC',o[0]+24,o[1]+40,{size:24,color:POSC,weight:700}):''));
 return fade(g,s);
}
// 外向きの法線（桃）。c＝球の中心
function normals({c=[0,0,0],spin=SPIN,g=1,len=.3,list=TL}={}){
 const {P}=viewAt(c,{spin});let s='';
 list.forEach(([f,l],i)=>{const p=sph(f,l),a=P(p),b=P(add(p,p,len));s+=fade(seg(g,i/list.length*.5,i/list.length*.5+.5),dot(a[0],a[1],4,C.ink)+arrow(a[0],a[1],b[0],b[1],{color:GC.n,w:4,head:13}));});
 return s;
}
// 各タイルの電場（電荷は原点。長さ ∝ 1/距離²、最長 cap）
function fieldArrows({c=[0,0,0],spin=SPIN,g=1,k=.45,cap=.85,list=TL,glow=null}={}){
 const {P}=viewAt(c,{spin});let s='';
 list.forEach(([f,l],i)=>{const p=sph(f,l),pos=add(c,p),d=Math.hypot(...pos),u=nrm(pos),L=Math.min(cap,k/(d*d));
  const a=P(p),b=P(add(p,u,L)),gl=glow?glow(i,d):0;
  s+=arrow(a[0],a[1],b[0],b[1],{color:gl>.5?C.hi:GC.E,w:gl>.5?7:5,head:15});});
 return fade(g,s);
}
// ずらした球の、タイルごとの距離
const dists=c=>TL.map(([f,l])=>Math.hypot(...add(c,sph(f,l))));
const SHIFT=RIGHT(SPIN).map(v=>v*.5);
const FA={k:.36,cap:.6};
// チェック欄：st＝[①,②] の状態（1＝✓、−1＝×、0＝空）。gx＝切り替えの進み
function checks(x,y,{st=[0,0],g=1,w=440}={}){
 const row=(yy,t,v)=>{let s=label(t,x+70,yy,{size:26,color:C.ink,weight:700});
  if(v>0)s+=label('✓',x+30,yy+2,{size:34,color:C.F,weight:700,anchor:'middle'});
  if(v<0)s+=label('×',x+30,yy+2,{size:36,color:BAD,weight:700,anchor:'middle'});
  if(v===0)s+=ring(x+30,yy-9,13,{color:C.dim,w:2});return s;};
 return card(x,y,w,150,label('掛け算 1回の チェック',x+w/2,y+38,{size:24,color:C.dim,anchor:'middle'})+row(y+85,'① cos ＝ 1（𝐄 ∥ 𝐧）',st[0])+row(y+128,'② どこでも 同じ E',st[1]),g);
}

// ---- 小問3：2つの電荷（モデル座標、半径 1 ＝ 3 m）----
const QA0=[-.45,.25,.1],QB0=[.35,-.3,0],QA1=[-.2,-.35,.1],QB1=[.45,.2,0];
function twoCharges({u=0,g=1,lbl=1}={}){
 const {P}=viewAt([0,0,0]);const a=P(QA0.map((v,i)=>mix(v,QA1[i],u))),b=P(QB0.map((v,i)=>mix(v,QB1[i],u)));
 return fade(g,charge(a[0],a[1],1,18)+charge(b[0],b[1],-1,18)
  +(lbl?label('+2 nC',a[0]-22,a[1]-26,{size:24,color:POSC,weight:700,anchor:'end'})+label('−5 nC',b[0]+24,b[1]+38,{size:24,color:NEGC,weight:700}):''));
}

// 問題アニメは字幕の帯がないので、図を画面の中央へ寄せる
const CEN=svg=>`<g transform="translate(300 0)">${svg}</g>`;
function q1(p,ctx){
  const t=cueT(ctx),gr=seg(t,.4,2),sp=mix(SPIN0,SPIN,seg(t,3,4.8)),r=Math.max(2,R*gr);
  let s=fade(seg(t,0,.4),charge(CX,CY,1,18)+label('+2 nC',CX+24,CY+40,{size:24,color:POSC,weight:700}));
  if(gr>.02){const P=view(CX,CY,r,{tilt:TILT,spin:sp});s=surface(P,SPHERE,{g:seg(t,.4,1.2)})+ring(CX,CY,r,{color:'#c9d6ee',w:3})+s;}
  s+=fade(seg(t,1.6,2),line(CX,CY,CX+R,CY,{color:C.ink,w:3,dash:'7 6'})+label('r ＝ 3 m',CX+R/2,CY-14,{size:26,color:C.ink,anchor:'middle',weight:700}));
  if(t>2){const tl=frontTiles(sp,.45);s+=normals({spin:sp,g:seg(t,2,3),list:tl});}
  return s;
}
 // 小問2：球面だけが右へ半径の半分ずれて止まる（電荷は中に残る）。元の位置に灰色の点線
function q2(p,ctx){
  const t=cueT(ctx),u=seg(t,.4,1.8),c=SHIFT.map(v=>v*u);
  let s=fade(seg(t,.4,.8),ring(CX,CY,R,{color:C.dim,w:2.5,dash:'8 8'})+label('元の 位置',CX-R+10,CY+R+30,{size:22,color:C.dim}));
  s+=sphereFig({c,q:1});
  return s;
}
 // 小問3：球を中心に戻し、中心の +2 nC を消す。中に +2 nC と −5 nC（どちらも中心からずれた位置）
function q3(p,ctx){
  const t=cueT(ctx);
  return sphereFig({q:1-seg(t,.2,.7),qlabel:1})+twoCharges({g:seg(t,.9,1.7)});
}

export const ytQxUmGaussSpherePreviewDiagrams={
 // ===================== 問題アニメ =====================
 // 出題：中心に +2 nC → 半径 3 m の球面が広がる → タイルの外向きの法線 → 30° 回って静止。電場の矢印・チェック・値は出さない。
 [K+'q1']:(p,ctx)=>CEN(q1(p,ctx)),
 // 小問2：球面だけが右へ半径の半分ずれて止まる（電荷は中に残る）。元の位置に灰色の点線
 [K+'q2']:(p,ctx)=>CEN(q2(p,ctx)),
 // 小問3：球を中心に戻し、中心の +2 nC を消す。中に +2 nC と −5 nC（どちらも中心からずれた位置）
 [K+'q3']:(p,ctx)=>CEN(q3(p,ctx)),
 // 出題：中心に +2 nC → 半径 3 m の球面が広がる → タイルの外向きの法線 → 30° 回って静止。電場の矢印・チェック・値は出さない。

 // ===================== 小問1 =====================
 // 1. 出題図（中心の赤い丸、タイルの球面、外向きの法線）と r＝3 m
 [K+'setup']:(p)=>{
  let s=sphereFig({grid:seg(p,0,.15)})+normals({g:seg(p,.2,.6)});
  s+=fade(seg(p,.4,.55),line(CX,CY,CX+R,CY,{color:C.ink,w:3,dash:'7 6'})+label('r ＝ 3 m',CX+R/2,CY-14,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=panel(130,200,label('Q ＝ 2 nC（中心）',PC,190,{size:30,color:POSC,anchor:'middle',weight:700})+label('半径 r ＝ 3 m の 球面',PC,245,{size:28,color:C.ink,anchor:'middle'})
   +label('法線は 外向き',PC,295,{size:26,color:GC.n,anchor:'middle',weight:700}),seg(p,.1,.3));
  return s;
 },
 // 2. 求めるもの。球面全体を黄で一度なぞる
 [K+'goal1']:(p)=>{
  let s=sphereFig()+normals({g:1})+line(CX,CY,CX+R,CY,{color:C.ink,w:3,dash:'7 6'})+label('r ＝ 3 m',CX+R/2,CY-14,{size:26,color:C.ink,anchor:'middle',weight:700});
  const u=seg(p,.25,.75);if(u>.01){const n=Math.ceil(80*u),pts=Array.from({length:n+1},(_,i)=>{const a=-Math.PI/2+2*Math.PI*u*i/n;return [CX+R*Math.cos(a),CY+R*Math.sin(a)];});s+=fade(1-seg(p,.85,.98)*.6,draw(pts,1,{color:C.hi,w:7}));}
  s+=panel(130,200,label('Q ＝ 2 nC（中心）',PC,190,{size:30,color:POSC,anchor:'middle',weight:700})+label('半径 r ＝ 3 m の 球面',PC,245,{size:28,color:C.ink,anchor:'middle'})
   +label('法線は 外向き',PC,295,{size:26,color:GC.n,anchor:'middle',weight:700}),1);
  return s+goalTag(G1,{g:seg(p,.03,.12)});
 },
 // 3. タイルを1枚拡大し、先に記号（ΔA 金・𝐧 桃・𝐄 水色）を置いてから、式 Φ＝Σ 𝐄·𝐧ΔA
 [K+'tile']:(p)=>{
  const {P}=viewAt([0,0,0]),[f0,l0]=[15,Math.round(-SPIN*180/Math.PI/15)*15];
  let s=sphereFig()+fade(seg(p,.05,.15),patch(P,SPHERE,f0-12,f0+12,l0-15,l0+15,{color:C.hi,fo:.4}));
  const pc=P(sph(f0,l0));
  s+=fade(seg(p,.12,.22),line(pc[0],pc[1],PX+10,180,{color:C.hi,w:2,dash:'5 6'}));
  // 拡大の枠：平らな四角（金）、外向きの法線、電場の矢印
  const bx=PX+40,by=110,bw=500,bh=250;
  let z=poly4([[bx+120,by+190],[bx+330,by+190],[bx+380,by+120],[bx+170,by+120]]);
  z+=fade(seg(p,.2,.3),label('ΔA',bx+250,by+170,{size:34,color:GC.A,anchor:'middle',weight:700}));
  z+=fade(seg(p,.3,.4),arrow(bx+250,by+155,bx+250,by+50,{color:GC.n,w:6,head:18})+label('𝐧（長さ 1）',bx+268,by+60,{size:26,color:GC.n,weight:700}));
  z+=fade(seg(p,.4,.5),arrow(bx+215,by+150,bx+150,by+30,{color:GC.E,w:6,head:18})+label('𝐄',bx+130,by+50,{size:32,color:GC.E,weight:700,anchor:'end'}));
  s+=card(PX,95,PW,280,z+label('タイル 1枚（拡大）',PC,128,{size:22,color:C.dim,anchor:'middle'}),seg(p,.12,.22),C.hi);
  s+=card(PX,390,PW,112,T(`${PHI}=\\sum_i ${vE}_i\\cdot${vn}_i\\,${cs(GC.A,'\\Delta A_i')}`,PC,448,{size:40}),seg(p,.55,.68),C.hi);
  return s+goalTag(G1);
 },
 // 4. チェック1：電場の矢印が法線とぴったり重なる。① cos＝1 に ✓
 [K+'check1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=sphereFig()+normals({g:1,len:.3})+fieldArrows({g:seg(p,b,b+.15),k:.5,cap:.5});
  s+=checks(PX+70,130,{st:[seg(p,b+.3,b+.35)>.5?1:0,0]});
  s+=fade(seg(p,b+.3,b+.4),T(`${vE}\\cdot${vn}=${E_}`,PC,360,{size:44}));
  return s+goalTag(G1);
 },
 // 5. チェック2：中心から3つのタイルへ半径の線「3 m」。どの矢印も同じ長さ。② に ✓
 [K+'check2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,{P}=viewAt([0,0,0]);
  let s=sphereFig()+normals({g:.6,len:.3})+fieldArrows({k:.5,cap:.5});
  [35,150,265].forEach((deg,i)=>{const a=[CX+R*Math.cos(deg*Math.PI/180),CY-R*Math.sin(deg*Math.PI/180)];s+=fade(seg(p,b+.05*i,b+.1+.05*i),line(CX,CY,a[0],a[1],{color:C.hi,w:3,dash:'6 6'})+dot(a[0],a[1],5,C.hi)+label('3 m',CX+.62*(a[0]-CX)+(deg>90&&deg<200?-12:12),CY+.62*(a[1]-CY)-8,{size:24,color:C.hi,weight:700,anchor:deg>90&&deg<200?'end':'start'}));});
  s+=checks(PX+70,130,{st:[1,seg(p,b+.3,b+.35)>.5?1:0]});
  s+=fade(seg(p,b+.3,b+.4),label('E は どこでも 同じ',PC,360,{size:30,color:GC.E,anchor:'middle',weight:700}));
  return s+goalTag(G1);
 },
 // 6. E を和の外へ。ΣΔA ＝ 4πr²（金）。図は消して、式を一段ずつ
 [K+'factor']:(p)=>{
  let s=checks(40,110,{st:[1,1],w:440});
  s+=T(`${PHI}=\\sum_i ${E_}\\,${cs(GC.A,'\\Delta A_i')}`,820,170,{size:44});
  s+=fade(seg(p,.25,.4),T(`=${E_}\\sum_i ${cs(GC.A,'\\Delta A_i')}`,820,270,{size:44})+label('E を 和の 外へ',820,330,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.55,.7),T(`=${E_}\\times ${A4}`,820,420,{size:48})+label('球の 表面積',1050,425,{size:24,color:GC.A,anchor:'start'}));
  return s+goalTag(G1);
 },
 // 7. E＝kQ/r² を代入。分母の r² と 4πr² の r² に打ち消し線。4πkQ が残る
 [K+'cancel']:(p,ctx)=>{
  const cn=seg(p,.45,.55);
  const r2a=cn>.5?`\\cancel{r^2}`:'r^2',r2b=cn>.5?`\\cancel{r^2}`:'r^2';
  let s=T(`${PHI}=${E_}\\times ${A4}`,600,150,{size:44});
  s+=fade(seg(p,.1,.22),T(`=\\dfrac{kQ}{${r2a}}\\times ${cs(GC.A,'4\\pi '+r2b)}`,600,270,{size:52}));
  s+=fade(seg(p,.62,.75),T(`=4\\pi kQ`,600,410,{size:56}));
  return s+goalTag(G1);
 },
 // 8a. 4πk と 1/ε₀ を同じ色の枠で結ぶ。Φ＝Q/ε₀
 [K+'eps']:(p)=>{
  let s=T(`${PHI}=${cs(C.F,'4\\pi k')}\\,Q`,600,160,{size:52});
  s+=fade(seg(p,.1,.25),T(`\\varepsilon_0=\\dfrac{1}{4\\pi k}\\quad\\Longrightarrow\\quad ${cs(C.F,'4\\pi k')}=${cs(C.F,'\\dfrac{1}{\\varepsilon_0}')}`,600,280,{size:42}));
  s+=fade(seg(p,.5,.65),T(`${PHI}=\\dfrac{Q}{\\varepsilon_0}`,600,420,{size:56}));
  return s+goalTag(G1);
 },
 // 8b. 数値の計算を一行ずつ。226 を黄で
 [K+'eps2']:(p)=>{
  let s=T(`${PHI}=\\dfrac{Q}{\\varepsilon_0}`,600,150,{size:48});
  s+=fade(seg(p,.1,.25),T(`=\\dfrac{2\\times10^{-9}}{8.85\\times10^{-12}}`,600,280,{size:48}));
  s+=fade(seg(p,.5,.65),T(`\\approx ${cs(C.hi,'226')}${UF}`,600,410,{size:52}));
  return s+goalTag(G1);
 },
 // 9. 確かめ：E≈2.0 と 4πr²＝36π≈113 を掛けて 226。「小問1 の答えは C」で答えの札
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.7;
  let s=sphereFig()+fieldArrows({k:.5,cap:.5});
  s+=panel(110,330,label('確かめ',PC,150,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.05,.18),T(`${E_}=\\dfrac{kQ}{r^2}\\approx${cs(GC.E,'2.0')}\\,\\mathrm{N/C}`,PC,215,{size:36}))
   +fade(seg(p,.2,.33),T(`${A4}=36\\pi\\approx${cs(GC.A,'113')}\\,\\mathrm{m^2}`,PC,300,{size:36}))
   +fade(seg(p,.38,.5),T(`${cs(GC.E,'2.0')}\\times${cs(GC.A,'113')}\\approx${cs(C.hi,'226')}`,PC,385,{size:38})),1,C.hi);
  return s+goalTag(G1)+ANS1(seg(p,b,b+.06));
 },
 // 10. 誤答 A（断面の円を金で塗る）→ 誤答 B（kQ/r）。1枚ずつ
 [K+'wrongAB']:(p,ctx)=>{
  const W=sentWin(ctx),wA=[0,W[0][1]],wB=[W[1]?W[1][0]:.5,1],inA=inWin(p,wA),inB=inWin(p,wB,true);
  let s=fade(1-inB,sphereFig({grid:.5}));
  s+=fade(inA*(1-inB),dot(CX,CY,R-2,GC.A,.3)+ring(CX,CY,R-2,{color:GC.A,w:4})+label('断面の 円 πr²',CX,CY+R+34,{size:26,color:GC.A,anchor:'middle',weight:700}));
  s+=wrongCard('A','56.5',['円の 面積 πr² を 掛けた'],{x:PX,w:PW,y:150,size:28,whySize:24,g:inA});
  s+=wrongCard('B','678',['電場を kQ/r と した'],{x:200,w:800,y:150,size:28,whySize:24,g:inB,mid:`\\dfrac{kQ}{r}\\times4\\pi r^2\\approx678`});
  return s+goalTag(G1)+ANS1(1);
 },
 // 11. 誤答 D：Φ＝4πkQ の 4π に赤い丸
 [K+'wrongD']:(p)=>{
  let s=T(`${PHI}=4\\pi kQ`,600,170,{size:56});
  const wAll=texWidth(`${PHI}=4\\pi kQ`,56,false),wPre=texWidth(`${PHI}=`,56,false),w4=texWidth('4\\pi',56,false),x4=600-wAll/2+wPre+w4/2;
  s+=fade(seg(p,.1,.2),ring(x4+16,150,42,{color:BAD,w:4}));
  s+=wrongCard('D','18.0',['4π を 落とした（Φ ＝ kQ）'],{x:250,w:700,y:250,size:28,whySize:24,g:seg(p,.05,.12)});
  return s+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 // 12. 求めるもの。前のカードを消して、球と電荷、チェック欄（✓✓）
 [K+'goal2']:(p)=>{
  let s=sphereFig()+checks(PX+70,130,{st:[1,1]});
  return s+goalTag(G2,{g:seg(p,.03,.12)});
 },
 // 13. 球が右へずれる（電荷は中に残る）。近い左側の矢印は長く、遠い右側は短く、法線と角ができる
 [K+'shift']:(p)=>{
  const u=seg(p,.05,.3),c=SHIFT.map(v=>v*u);
  let s=fade(seg(p,.05,.15),ring(CX,CY,R,{color:C.dim,w:2,dash:'8 8'}));
  s+=sphereFig({c})+normals({c,g:seg(p,.3,.45)})+fieldArrows({c,g:seg(p,.35,.5),...FA});
  s+=fade(seg(p,.5,.6),label('近い 側：長い',CX-60,CY+R+40,{size:24,color:GC.E,weight:700,anchor:'middle'})+label('遠い 側：短い',CX+260,CY+R+40,{size:24,color:GC.E,weight:700,anchor:'middle'}));
  s+=checks(PX+130,130,{st:[1,1],w:420});
  s+=fade(seg(p,.7,.8),label('矢印と 法線の 間に 角',PX+340,330,{size:26,color:GC.n,anchor:'middle',weight:700}));
  return s+goalTag(G2);
 },
 // 14. チェックの ✓ が × に。「Φ＝226 のまま」を黄で
 [K+'fail']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=ring(CX,CY,R,{color:C.dim,w:2,dash:'8 8'})+sphereFig({c:SHIFT})+normals({c:SHIFT})+fieldArrows({c:SHIFT,...FA});
  const x1=seg(p,.1,.15)>.5?-1:1,x2=seg(p,.22,.27)>.5?-1:1;
  s+=checks(PX+130,130,{st:[x1,x2],w:420});
  s+=fade(seg(p,.3,.38),label('掛け算 1回は 使えない',PX+340,330,{size:28,color:BAD,anchor:'middle',weight:700}));
  s+=fade(seg(p,b+.15,b+.25),rect(PX+170,370,340,70,{fill:C.hi,fo:.12,stroke:C.hi,sw:3,rx:12})+label('Φ ＝ 226 の まま',PX+340,416,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s+goalTag(G2);
 },
 // 15. ①（はじめの文）2枚のカードと答えの札 → ②（2文目）図に戻り、遠い側の短い矢印を光らせ、誤答 B
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,cA=1-seg(p,b-.03,b),cB=seg(p,b-.01,b+.04),bl=blink(ctx);
  let a=card(80,110,500,300,label('法則が 成り立つ 範囲',330,165,{size:30,color:C.F,anchor:'middle',weight:700})+label('どんな 閉じた面 でも',330,240,{size:28,color:C.ink,anchor:'middle'})+T(`${PHI}=\\dfrac{Q}{\\varepsilon_0}`,330,330,{size:44}),seg(p,.03,.12),C.F);
  a+=card(620,110,500,300,label('掛け算が 使える 範囲',870,165,{size:30,color:C.hi,anchor:'middle',weight:700})+label('チェック ①② が',870,240,{size:28,color:C.ink,anchor:'middle'})+label('両方 ✓ の とき だけ',870,290,{size:28,color:C.ink,anchor:'middle'}),seg(p,.08,.17),C.hi);
  let s=fade(cA,a);
  const d=dists(SHIFT),dmax=Math.max(...d);
  s+=fade(cB,ring(CX,CY,R,{color:C.dim,w:2,dash:'8 8'})+sphereFig({c:SHIFT})+normals({c:SHIFT,g:.5})+fieldArrows({c:SHIFT,...FA,glow:(i,dd)=>dd>dmax-.35?bl:0})
   +label('遠い 側：弱い',CX+260,CY+R+40,{size:24,color:C.hi,weight:700,anchor:'middle'}));
  s+=wrongCard('B','Φ が 大きくなる',['近い 側 だけを 見た'],{x:PX+40,w:PW-40,y:180,size:28,whySize:24,g:seg(p,b+.02,b+.06)});
  return s+goalTag(G2)+ANS2(seg(p,.02,.08));
 },
 // 16. 誤答 C（矢印の長さがタイルごとに違う）→ 誤答 D（一番近い点の矢印だけを光らせる）
 [K+'wrongCD']:(p,ctx)=>{
  const W=sentWin(ctx),wC=[0,W[0][1]],wD=[W[1]?W[1][0]:.45,1],inC=inWin(p,wC),inD=inWin(p,wD,true),bl=blink(ctx);
  const d=dists(SHIFT),dmin=Math.min(...d);
  let s=ring(CX,CY,R,{color:C.dim,w:2,dash:'8 8'})+sphereFig({c:SHIFT})+normals({c:SHIFT,g:.5});
  s+=fieldArrows({c:SHIFT,...FA,glow:(i,dd)=>inC>.5?bl:(inD>.5&&dd<dmin+1e-6?bl:0)});
  s+=wrongCard('C','掛け算 1回',['E が タイルごとに 違う'],{x:PX+40,w:PW-40,y:180,size:28,whySize:24,g:inC});
  s+=wrongCard('D','近い点の E × 4πr²',['一番 近い点の E で 代表させた'],{x:PX+40,w:PW-40,y:180,size:28,whySize:24,g:inD});
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 // 17. 球を中心に戻し、中心の電荷を消す。中に +2 nC（赤）と −5 nC（青）
 [K+'goal3']:(p)=>{
  let s=sphereFig({q:0})+twoCharges({g:seg(p,.1,.3)});
  return s+goalTag(G3,{g:seg(p,.03,.12)});
 },
 // 18. 2＋(−5)＝−3 を赤と青の数字で。2つの電荷を中で少し動かしても −3 は変わらない
 [K+'net']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=sphereFig({q:0})+twoCharges({u:seg(p,b+.05,b+.45)});
  s+=panel(130,220,label('中の 正味の 電荷',PC,180,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.15,.3),T(`${cs(POSC,'2')}+(${cs(NEGC,'-5')})=${cs(C.hi,'-3')}\\,\\mathrm{nC}`,PC,270,{size:48})),1,C.hi);
  s+=fade(seg(p,b+.1,b+.2),label('中で 動かしても −3 nC の まま',PC,400,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s+goalTag(G3);
 },
 // 19. Φ＝−3×10⁻⁹÷(8.85×10⁻¹²)≈−339。「小問3 の答えは B」で答えの札
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.7;
  let s=sphereFig({q:0})+twoCharges({u:1});
  s+=panel(110,330,T(`${PHI}=\\dfrac{Q}{\\varepsilon_0}`,PC,180,{size:40})
   +fade(seg(p,.08,.22),T(`=\\dfrac{-3\\times10^{-9}}{8.85\\times10^{-12}}`,PC,285,{size:40}))
   +fade(seg(p,.35,.5),T(`\\approx ${cs(C.hi,'-339')}${UF}`,PC,385,{size:40})),1,C.hi);
  return s+goalTag(G3)+ANS3(seg(p,b,b+.06));
 },
 // 20. 誤答 A → C → D を1枚ずつ
 [K+'wrong3']:(p,ctx)=>{
  const [wA,wC]=clauseWin(ctx,0,[1,1]),W=sentWin(ctx),wD=[W[1]?W[1][0]:.6,1];
  const inA=inWin(p,[wA[0],wA[1]]),inC=inWin(p,[wC[0],W[0][1]]),inD=inWin(p,wD,true);
  let s=sphereFig({q:0})+twoCharges({u:1});
  s+=wrongCard('A','+791',['符号を 無視して 7 nC'],{x:PX,w:PW,y:160,size:28,whySize:24,g:inA});
  s+=wrongCard('C','−27.0',['4π を 落とした'],{x:PX,w:PW,y:160,size:28,whySize:24,g:inC});
  s+=wrongCard('D','−2.7×10⁻²⁰',['ε₀ を 掛けた'],{x:PX,w:PW,y:160,size:28,whySize:24,g:inD});
  return s+goalTag(G3)+ANS3(1);
 },
 // 21. カードと札を消す。∯𝐄·d𝐀＝Q/ε₀（左辺 水色・右辺 桃）。最後に答えの札3枚
 [K+'sum']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,ve=voiceEnd(ctx);
  let s=T(`${cs(GC.E,OI+'\\mathbf{E}\\cdot d\\mathbf{A}')}=${cs(C.p,'\\dfrac{Q}{\\varepsilon_0}')}`,600,215,{size:64});
  s+=fade(seg(p,.1,.25),card(90,320,480,150,label('左辺',330,365,{size:26,color:GC.E,anchor:'middle',weight:700})+label('球なら E × 4πr²（掛け算 1回）',330,420,{size:26,color:C.ink,anchor:'middle'}),1,GC.E));
  s+=fade(seg(p,b,b+.12),card(630,320,480,150,label('右辺',870,365,{size:26,color:C.p,anchor:'middle',weight:700})+label('中の 正味の 電荷 で 決まる',870,420,{size:26,color:C.ink,anchor:'middle'}),1,C.p));
  s+=answerRow([[1,'C','226 N·m²/C'],[2,'A',''],[3,'B','−339 N·m²/C']],{g:seg(p,ve,ve+.05),size:22});
  return s;
 },
};
function poly4(q){return `<polygon points="${q.map(v=>v.join(',')).join(' ')}" fill="${GC.A}" fill-opacity=".35" stroke="${GC.A}" stroke-width="3"/>`;}

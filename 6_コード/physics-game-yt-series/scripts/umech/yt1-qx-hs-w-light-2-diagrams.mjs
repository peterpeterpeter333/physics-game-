// 問題編 解説「53° で入る光」(ys-qx-hs-w-light-2) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/304_光波.md の q-hs-w-light-2（解説 17 行）。
// 色（正本の 304 冒頭）：角度 θ 橙、屈折率 n 白、速さ v 紫、長さ d 水色、光 淡い黄、強調 黄。プラスチック 薄い青、砂 茶。
// 作図の寸法：1目盛り＝U＝42 px。波面 PQ の長さ 6 目盛り、P が空気中を 8 目盛り、Q がプラスチックの中を 5 目盛り、斜辺 d＝10 目盛り。
//   入射角 53°（sin＝0.80、cos＝0.60）、屈折角 30°（sin＝0.50）。先に境界に着く端が Q（単元動画の B）、あとの端が P（単元動画の A）。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 元の単元動画（yt1-hs-w-light-1）の部品（色、媒質、法線、光線、角の弧、光の帯）を読み込んで使う（そのファイルは編集しない）。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,poly,clamp,mix} from './anim.mjs';
import {ANG,LIGHT,GLASS,GLINE,SAND,VCOL,arc,angMark,beam} from './yt1-hs-w-light-1-diagrams.mjs';
import {QC,card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,note,sentWin,cueT,tAt,isProblem,textW,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-hs-w-light-2:';
const R=Math.PI/180;
const F=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const th=i=>`{\\color{${ANG}}\\theta_{${i}}}`,sinT=i=>`\\sin${th(i)}`;
const SNELL=`n_1\\,${sinT(1)}=n_2\\,${sinT(2)}`;
const DC=C.x;   // 長さ d：水色
const G1='屈折角 θ₂',G2='Q が 進む 目盛りの 数',G3='法線に 近づく 理由';
const A1=g=>answerTag(1,'C','30°',{g}),A2=g=>answerTag(2,'A','5 目盛り',{g}),A3=g=>answerTag(3,'D','',{g});
const P_=(o,d,k)=>[o[0]+k*d[0],o[1]+k*d[1]];

// ---- 境界と媒質（上 空気、下 プラスチック）--------------------------------------------------------
const YB=300;
function media({g=1,labs=1,right=0}={}){
 let s=rect(0,YB,1200,515-YB,{fill:GLASS,fo:.22,stroke:'none',rx:0})+line(0,YB,1200,YB,{color:GLINE,w:3});
 const lx=right?1170:30,an=right?'end':'start';
 if(labs)s+=label('空気  n＝1.0',lx,YB-18,{size:26,color:C.dim,anchor:an,weight:700})+label('プラスチック  n＝1.6',lx,YB+42,{size:26,color:GLINE,anchor:an,weight:700});
 return fade(g,s);
}
// sin の表（右上）。hi＝光らせる行
const SINROWS=['sin53°＝0.80','sin37°＝0.60','sin30°＝0.50','sin22°＝0.375'];
function sinTable({g=1,hi=-1,hiG=0,x=920,y=96}={}){
 let s=card(x,y,265,176,'',1,C.dim);
 SINROWS.forEach((t,i)=>{const yy=y+40+i*38;
  if(i===hi&&hiG>0)s+=fade(hiG,rect(x+10,yy-28,245,38,{fill:C.hi,fo:.15,stroke:C.hi,sw:2.5,rx:8}));
  s+=label(t,x+24,yy,{size:26,color:i===hi&&hiG>.5?C.hi:C.ink,weight:700});});
 return fade(g,s);
}
// ---- 小問1・3 の図：O に入る光線と 53° の弧 ----------------------------------------------------------
const O=[560,YB],D1=[Math.sin(53*R),Math.cos(53*R)],D2=[.5,Math.sqrt(3)/2];
function normalLine(x,{g=1,top=100,bot=510,hi=0}={}){return fade(g,line(x,top,x,bot,{color:hi>0?C.hi:C.ink,w:2.5+2*hi,dash:'8 8'}));}
function incRay(u=1,{g=1,L=300}={}){
 const A=P_(O,D1,-L),E=P_(A,D1,L*u);
 return fade(g,line(...A,...E,{color:LIGHT,w:6})+(u>.25?arrow(...P_(A,D1,L*u*.45),...P_(A,D1,L*u*.6),{color:LIGHT,w:6,head:18}):''));
}
function refRay(u=1,{g=1,L=230,deg=30}={}){
 const d=[Math.sin(deg*R),Math.cos(deg*R)],E=P_(O,d,L*u);
 return fade(g,line(...O,...E,{color:LIGHT,w:6})+(u>.3?arrow(...P_(O,d,L*u*.45),...P_(O,d,L*u*.6),{color:LIGHT,w:6,head:18}):''));
}
const arc53=(g=1,{r=80,text='53^\\circ'}={})=>angMark(O,'in',53,{r,text,g,size:30});
const arc30=(g=1,{r=95,text='30^\\circ'}={})=>angMark(O,'out',30,{r,text,g,size:30});
function q1Pic({g=1,u=1,table=1,labs=1}={}){
 return fade(g,media({labs})+normalLine(O[0])+incRay(u)+fade(seg(u,.95,1),arc53()))+(table?sinTable({g}):'');
}
// ---- 小問2 の図：波面 PQ（Q が先に境界に着いた瞬間）--------------------------------------------------
const U=42,E_UP=[.6,-.8];
const QB=[250,YB],PP=P_(QB,E_UP,6*U),PB=[QB[0]+10*U,YB],QQ=P_(QB,D2,5*U);
function ticks(o,d,n,{color=C.ink,g=1,len=9}={}){const nn=[-d[1],d[0]];let q='';for(let i=0;i<=n;i++){const p=P_(o,d,i*U);q+=line(p[0]-len*nn[0],p[1]-len*nn[1],p[0]+len*nn[0],p[1]+len*nn[1],{color,w:3});}return fade(g,q);}
const ptLab=(t,p,dx,dy,{g=1,color=C.ink,size=30}={})=>fade(g,label(t,p[0]+dx,p[1]+dy,{size,color,anchor:'middle',weight:700}));
// 光の束（空気中、波面より後ろ）と P・Q の光線
function beamAir({g=1,back=30}={}){
 const Pb=P_(PP,D1,-back),Qb=P_(QB,D1,-back-120);
 let s=poly([Qb,QB,PB,PP,Pb],{fill:LIGHT,fo:.10});
 s+=line(...Qb,...QB,{color:LIGHT,w:2,dash:'6 6'})+line(...Pb,...PP,{color:LIGHT,w:2,dash:'6 6'})+line(...PP,...PB,{color:LIGHT,w:2,dash:'6 6'});
 return fade(g,s);
}
function wavefront({g=1,qHi=0,lab=1}={}){
 let s=line(...PP,...QB,{color:LIGHT,w:7})+dot(...PP,8,LIGHT)+dot(...QB,8,LIGHT);
 if(qHi>0)s+=fade(qHi,ring(...QB,18,{color:C.hi,w:4})+dot(...QB,10,C.hi));
 if(lab)s+=ptLab('P',PP,-26,-6)+ptLab('Q',QB,-30,-14,{color:qHi>.5?C.hi:C.ink});
 return fade(g,s);
}
// P の前の 8 目盛り（白）と「8 目盛り」
function pPath({g=1,txt=1}={}){
 let s=ticks(PP,D1,8,{color:C.ink});
 if(txt){const m=P_(P_(PP,D1,4*U),E_UP,34);s+=label('8 目盛り',m[0]+10,m[1],{size:28,color:C.ink,weight:700});}
 return fade(g,s);
}
// P' での法線と 53°（与えた入射角）
function pbNormal(g=1){return fade(g,line(PB[0],YB-150,PB[0],YB+40,{color:C.ink,w:2.5,dash:'8 8'})+angMark(PB,'in',53,{r:62,text:'53^\\circ',size:26}));}
function q2Pic({g=1,table=1,qHi=0}={}){
 return fade(g,media({right:table?0:1})+beamAir()+pbNormal()+pPath()+wavefront({qHi}))+(table?sinTable({g}):'');
}
// P が up 目盛り、Q が uq 目盛り進んだところ（小問2 の解説）
function advance(u,{g=1,counters=1,circ=1}={}){
 const pPos=P_(PP,D1,8*U*u),qPos=P_(QB,D2,5*U*u);
 let s='';
 if(circ){const r=5*U*u;if(r>1)s+=fade(.8,`<path d="M${QB[0]-r} ${YB} A${r} ${r} 0 0 0 ${QB[0]+r} ${YB}" fill="none" stroke="${VCOL}" stroke-width="2.5" stroke-dasharray="6 6"/>`);}
 if(u>.005){s+=arrow(...PP,...pPos,{color:VCOL,w:5,head:16})+arrow(...QB,...qPos,{color:VCOL,w:5,head:16});}
 s+=ticks(QB,D2,Math.floor(5*u+1e-6),{color:VCOL});
 s+=dot(...pPos,9,C.hi)+dot(...qPos,9,C.hi);
 if(counters){const nP=Math.min(8,Math.floor(8*u+1e-6)),nQ=Math.min(5,Math.floor(5*u+1e-6));
  s+=card(720,392,200,54,label(`P：${nP}`,820,428,{size:30,color:C.ink,anchor:'middle',weight:700}),1,C.dim);
  s+=card(720,454,200,54,label(`Q：${nQ}`,820,490,{size:30,color:C.ink,anchor:'middle',weight:700}),1,VCOL);}
 return fade(g,s);
}
// 作図の三角形（上：Q・P・P′、下：Q・Q′・P′、共通の斜辺 d＝QP′）
function triangles({g=1,t1=1,t2=1,hi8=0,hi5=0,dl=1,dt=0,ang=1}={}){
 let s='';
 s+=fade(t1,poly([QB,PP,PB],{fill:C.x,fo:.10,stroke:C.x,sw:2}));
 s+=fade(t2,poly([QB,QQ,PB],{fill:C.F,fo:.10,stroke:C.F,sw:2}));
 s+=fade(t1,line(...PP,...PB,{color:hi8>0?C.hi:C.ink,w:3+4*hi8}))+fade(t2,line(...QB,...QQ,{color:hi5>0?C.hi:VCOL,w:3+4*hi5}));
 s+=fade(t1*hi8,label('8',mix(PP[0],PB[0],.5)+22,mix(PP[1],PB[1],.5)-8,{size:32,color:C.hi,weight:700}));
 s+=fade(t2*hi5,label('5',mix(QB[0],QQ[0],.5)-34,mix(QB[1],QQ[1],.5)+8,{size:32,color:C.hi,weight:700}));
 s+=fade(t2,line(...PB,...QQ,{color:LIGHT,w:5})+dot(...QQ,7,LIGHT)+label('Q′',QQ[0]-8,QQ[1]+36,{size:28,color:C.ink,anchor:'middle',weight:700}));
 if(dl)s+=fade(dl,line(...QB,...PB,{color:DC,w:7})+label('d',mix(QB[0],PB[0],.5),YB+40,{size:34,color:DC,anchor:'middle',weight:700}));
 if(dt)s+=fade(dt,ticks(QB,[1,0],10,{color:DC})+label('d＝10 目盛り',PB[0]+22,YB+40,{size:28,color:DC,anchor:'start',weight:700}));
 if(ang){const a1=Math.atan2(-E_UP[1],E_UP[0])/R;s+=fade(ang*t1,arc(QB[0],QB[1],62,0,a1,{color:ANG,w:4})+F(th(1),QB[0]+92,QB[1]-26,30));
  s+=fade(ang*t2,arc(PB[0],PB[1],80,180,210,{color:ANG,w:4})+F(th(2),PB[0]-118,PB[1]+30,30));}
 return fade(g,s);
}
function q2Base({g=1,qHi=0,lab=1}={}){return fade(g,media({labs:lab,right:1})+beamAir()+wavefront({qHi}));}

// ---- 台車（上から見た図）------------------------------------------------------------------------------
function cartState(t,{c0=[300,120],h0=53,v1=90,v2=90/1.6,L=150}={}){
 let c=[...c0],h=h0*R;const dt=1/30;const n=Math.round(clamp(t,0,30)/dt);
 const sp=y=>y<YB?v1:v2;
 for(let i=0;i<n;i++){const d=[Math.sin(h),Math.cos(h)],a=[Math.cos(h),-Math.sin(h)];
  const Pw=[c[0]-L/2*a[0],c[1]-L/2*a[1]],Qw=[c[0]+L/2*a[0],c[1]+L/2*a[1]];
  const vp=sp(Pw[1]),vq=sp(Qw[1]),vc=(vp+vq)/2;
  c=[c[0]+vc*d[0]*dt,c[1]+vc*d[1]*dt];h-=(vq-vp)/L*dt;}
 return {c,h};
}
function cartPic(t,{g=1,tags=1}={}){
 const L=150;let s=rect(0,YB,1200,515-YB,{fill:SAND,fo:.3,stroke:'none',rx:0})+line(0,YB,1200,YB,{color:SAND,w:3})
  +label('舗装路（速い）',1170,YB-18,{size:26,color:C.dim,anchor:'end',weight:700})+label('砂（遅い）',1170,YB+42,{size:26,color:SAND,anchor:'end',weight:700});
 const pts=[];for(let k=0;k<=40;k++)pts.push(cartState(t*k/40).c);
 s+=fade(.7,draw(pts,1,{color:C.dim,w:2,dash:'5 7'}));
 const {c,h}=cartState(t),d=[Math.sin(h),Math.cos(h)],a=[Math.cos(h),-Math.sin(h)];
 const W1=P_(c,a,-L/2),W2=P_(c,a,L/2);   // W1＝左下の車輪（先に砂に入る）＝波面の Q 側
 const corner=(u,v)=>[c[0]+u*a[0]+v*d[0],c[1]+u*a[1]+v*d[1]];
 s+=poly([corner(-L/2+10,-40),corner(L/2-10,-40),corner(L/2-10,40),corner(-L/2+10,40)],{fill:C.x,fo:.3,stroke:C.x,sw:2});
 s+=line(...W1,...W2,{color:C.dim,w:4});
 const wheel=(W,col)=>line(...P_(W,d,-18),...P_(W,d,18),{color:col,w:12});
 s+=wheel(W1,C.hi)+wheel(W2,C.ink);
 s+=arrow(...P_(c,d,45),...P_(c,d,110),{color:VCOL,w:5,head:16});
 if(tags){const in1=W1[1]>YB,in2=W2[1]>YB;
  s+=fade(in1&&!in2?1:0,label('先に 入って 遅い',W1[0]-24,W1[1]+46,{size:26,color:C.hi,anchor:'end',weight:700}));}
 // 法線（境界に垂直）
 s+=line(860,YB-170,860,YB+170,{color:C.ink,w:2,dash:'8 8'})+label('法線',872,YB-140,{size:24,color:C.ink,weight:700});
 return fade(g,s);
}

function sumPic(p,second){
 const o=second?1:seg(p,.02,.12),f=second?seg(p,.03,.12):0;
 let s=fade(o,`<g transform="translate(20 20) scale(.92)">${media({labs:0})+beamAir({g:.5})+wavefront({})+triangles({hi8:1,hi5:1,dl:1,dt:0,ang:1})}</g>`);
 s+=fade(second?1:seg(p,.1,.2),label('先に 着いた Q 側から 遅れる',730,140,{size:26,color:C.hi,weight:700}));
 s+=card(800,190,385,200,F(SNELL,992,240,32)+fade(f,F(`1.0\\times0.80=1.6\\times0.50`,992,310,32)+F(`${th(2)}=30^\\circ`,992,370,32)),second?1:seg(p,.3,.4),C.F);
 s+=answerRow([[1,'C','30°'],[2,'A','5 目盛り'],[3,'D','']],{g:second?1:seg(p,.05,.15)});
 return s;
}

export const qxHsWLight2Diagrams={
 // ================= 問題アニメ =================
 // 出題（小問1・3、約4秒＋静止）：境界、法線、左上から入る光が O に着いて止まる。53° の弧。右上に sin の表。屈折した光は描かない。
 [K+'q1']:(p)=>q1Pic({u:clamp(p/.85)}),
 // 小問2（約5秒＋静止）：小問1 の光線と 53° の弧（と法線）を消してから、光の束と波面 PQ。Q が先に境界に着いた瞬間。P の前に 8 目盛り。
 [K+'q2']:(p)=>{
  const o=1-seg(p,.05,.3),b=seg(p,.35,.6),c=seg(p,.6,.85);
  let s=media({})+sinTable({});
  s+=fade(o,normalLine(O[0])+incRay(1)+arc53());
  s+=fade(b,beamAir()+wavefront({})+pbNormal())+fade(c,pPath());
  return s;
 },
 // ================= S1 小問1：屈折角 =================
 [K+'setup']:(p)=>q1Pic({}),
 // 2. 求めるもの θ₂。法線を光らせ、法線からの 53° に○、境界面からの 37° を灰色で×
 [K+'goal1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=media({})+normalLine(O[0],{hi:seg(p,b,b+.08)})+incRay(1)+sinTable({});
  s+=arc53(1);
  s+=fade(seg(p,b+.1,b+.2),label('○',O[0]-150,O[1]-150,{size:40,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,b+.25,b+.35),arc(O[0],O[1],120,143,180,{color:C.dim,w:4})+label('37°',O[0]-190,O[1]-24,{size:28,color:C.dim,anchor:'middle',weight:700})+label('×',O[0]-245,O[1]-24,{size:40,color:QC.bad,anchor:'middle',weight:700}));
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 3. スネルの法則（法則）。左辺 1.0×0.80＝0.80
 [K+'snell']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=media({})+normalLine(O[0])+incRay(1)+arc53()+sinTable({hi:0,hiG:seg(p,b+.1,b+.2)});
  let e=F(SNELL,905,350,40)+kindTag('法則',1110,322,{size:22});
  e+=fade(seg(p,b+.05,b+.2),F(`1.0\\times0.80=0.80`,905,430,38));
  s+=card(650,290,540,200,e,seg(p,.03,.12),C.F);
  s+=goalTag(G1);
  return s;
 },
 // 4. 両辺を 1.6 で割る：1.0×0.80＝1.6×sinθ₂ → ÷1.6（右辺の 1.6 に打ち消し線）→ sinθ₂＝0.80÷1.6＝0.50
 [K+'divide']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,u=lin(p,0,b);
  let s=fade(.35,media({})+normalLine(O[0])+incRay(1)+arc53())+sinTable({});
  let e=F(`0.80=1.6\\,${sinT(2)}`,920,330,40);
  e+=fade(seg(u,.3,.5),F(`\\dfrac{0.80}{1.6}=\\dfrac{\\cancel{1.6}\\,${sinT(2)}}{\\cancel{1.6}}`,920,420,36)+label('両辺を ÷1.6',1180,470,{size:24,color:C.hi,anchor:'end',weight:700}));
  s+=card(650,280,540,210,fade(1-seg(p,b-.02,b+.04),e)+fade(seg(p,b,b+.08),F(`${sinT(2)}=0.80\\div1.6=0.50`,920,385,40)),1,C.F);
  s+=goalTag(G1);
  return s;
 },
 // 5. 表の sin30°＝0.50 を光らせる。屈折光と 30° の弧。53° と 30° を並べ、法線に近づいた。答え C
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=media({})+normalLine(O[0])+incRay(1)+arc53()+sinTable({hi:2,hiG:seg(p,.03,.12)});
  s+=refRay(seg(p,.12,.3))+arc30(seg(p,.28,.38));
  s+=fade(seg(p,.38,.5),label('法線に 近づいた',O[0]+120,O[1]+150,{size:28,color:C.hi,weight:700}));
  s+=goalTag(G1)+A1(seg(p,voiceEnd(ctx)-.06,voiceEnd(ctx)-.01));
  return s;
 },
 // 6. 誤答 A：1.6 を掛けた（sin が 1 を超える）
 [K+'wrongA']:(p)=>{
  let s=fade(.5,media({})+normalLine(O[0])+incRay(1)+arc53()+refRay(1)+arc30())+sinTable({});
  s+=wrongCard('A','屈折する 光は ない','1.6×0.80＝1.28 と、掛けてしまった',{g:seg(p,.03,.1)});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // 7. 誤答 B・D を1枚ずつ
 [K+'wrongBD']:(p,ctx)=>{
  let s=fade(.5,media({})+normalLine(O[0])+incRay(1)+arc53()+refRay(1)+arc30())+sinTable({});
  s+=wrongSeq(p,ctx,[['B','22°','境界面から 測った 37° を 使った'],['D','53°','向きは 変わらないと した']]);
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // ================= S2 小問2：波面の作図 =================
 // 8. 求めるもの。波面 PQ の図へ。Q を黄色で光らせる。P・Q は単元動画の A・B
 [K+'goal2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=q2Pic({table:0,qHi:seg(p,b,b+.08)});
  s+=fade(seg(p,b+.1,b+.2),label('Q が 先に 境界に 着いた',QB[0]-20,YB+90,{size:26,color:C.hi,weight:700}));
  s+=note('（P・Q は 単元動画の A・B）',1000,505);
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 9a. v₂＝c/1.6（空気中の 1.6分の1）
 [K+'adv0']:(p)=>{
  let s=media({right:1})+beamAir()+wavefront({})+pPath({txt:1});
  s+=card(720,96,300,70,F(`{\\color{${VCOL}}v_2}=\\dfrac{{\\color{${VCOL}}c}}{1.6}`,870,136,34),seg(p,.05,.2),VCOL);
  s+=goalTag(G2);
  return s;
 },
 // 9b. P が 8 目盛り進むあいだに、Q は 5 目盛り（Q を中心に半径 5 目盛りの弧）。カウンター
 [K+'adv']:(p)=>{
  const u=lin(p,.05,.7);
  let s=media({right:1})+beamAir()+wavefront({})+fade(1-seg(p,0,.05),pPath({txt:1}));
  s+=card(720,96,300,70,F(`{\\color{${VCOL}}v_2}=\\dfrac{{\\color{${VCOL}}c}}{1.6}`,870,136,34),1,VCOL);
  s+=advance(u);
  s+=fade(seg(p,.7,.8),label('8 ÷ 1.6 ＝ 5',1060,420,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=goalTag(G2);
  return s;
 },
 // 10. 作図の三角形。sinθ₁＝8/d、sinθ₂＝5/d。d＝10 目盛りで 8/10＝0.80、5/10＝0.50
 [K+'tri']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=media({labs:0})+beamAir({g:.5})+wavefront({lab:1});
  s+=triangles({t1:seg(p,.03,.12),t2:seg(p,.1,.2),hi8:seg(p,.18,.26),hi5:seg(p,.3,.38),dl:seg(p,.05,.12)*(1-seg(p,b,b+.04)),dt:seg(p,b,b+.08)});
  s+=fade(seg(p,.2,.28),F(`${sinT(1)}=\\dfrac{8}{d}`,880,150,38))+fade(seg(p,.32,.4),F(`${sinT(2)}=\\dfrac{5}{d}`,1070,150,38));
  s+=fade(seg(p,b+.1,b+.2),F(`\\dfrac{8}{10}=0.80`,880,260,36))+fade(seg(p,b+.2,b+.3),F(`\\dfrac{5}{10}=0.50`,1070,260,36));
  s+=fade(seg(p,b+.32,b+.42),label('計算と 一致',975,340,{size:28,color:C.F,anchor:'middle',weight:700}));
  s+=goalTag(G2);
  return s;
 },
 // 11. 答え A（5 目盛り）。三角形を消し、誤答 B・C を1枚ずつ
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,m=b+(1-b)/2;
  let s=media({right:1})+beamAir()+wavefront({})+advance(1,{counters:0});
  s+=fade(1-seg(p,b-.04,b),triangles({hi8:1,hi5:1,dl:0,dt:1}));
  s+=fade(seg(p,b-.04,b),label('P：8 目盛り',820,140,{size:28,color:C.ink,anchor:'middle',weight:700})+label('Q：5 目盛り',820,186,{size:28,color:VCOL,anchor:'middle',weight:700}));
  s+=wrongSeq(p,ctx,[['B','8 目盛り','中でも 速さが 同じと した'],['C','12.8 目盛り','屈折率を 掛けた']],{win:[[b,m],[m,1]]});
  s+=goalTag(G2)+A2(seg(p,b-.07,b-.01));
  return s;
 },
 // 12. 誤答 D
 [K+'wrongD']:(p)=>{
  let s=media({right:1})+beamAir()+wavefront({})+advance(1,{counters:0});
  s+=label('P：8 目盛り',820,140,{size:28,color:C.ink,anchor:'middle',weight:700})+label('Q：5 目盛り',820,186,{size:28,color:VCOL,anchor:'middle',weight:700});
  s+=wrongCard('D','4 目盛り','屈折率に 関係なく 半分と した',{g:seg(p,.03,.1)});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // ================= S3 小問3：理由 =================
 // 13. 求めるもの。波面が進み、Q 側が境界を越えると遅くなって波面が折れる
 [K+'bend']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,t=tAt(ctx,K+'bend');
  let s=media({})+normalLine(600,{top:110,bot:505,g:.6});
  s+=beam({O:[600,YB],th1:53,n1:1,n2:1.6,w:200,lam:62,t,T:1.8,la:320,lb:230,g:seg(p,.02,.1)});
  s+=fade(seg(p,b,b+.08),label('先に 入って 遅くなる',330,YB+120,{size:28,color:C.hi,weight:700})+arrow(460,YB+92,520,YB+40,{color:C.hi,w:4,head:14}));
  s+=fade(seg(p,b+.1,b+.18),label('まだ 空気中で 速い',760,YB-170,{size:26,color:C.ink,weight:700}));
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 14. 答え D。台車：先に砂に入った車輪（黄）が遅くなり、向きが変わる
 [K+'cart']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.35,t=Math.max(0,cueT(ctx)-b*(ctx?.dur??8));
  let s=fade(1-seg(p,b-.04,b),media({})+normalLine(600,{top:110,bot:505,g:.6})+beam({O:[600,YB],th1:53,n1:1,n2:1.6,w:200,lam:62,t:tAt(ctx,K+'bend'),T:1.8,la:320,lb:230}));
  s+=fade(seg(p,b-.02,b+.04),cartPic(Math.min(t,4.6)));
  s+=fade(seg(p,b+.1,b+.2),label('Q 側 ＝ 先に 入った 車輪',30,500,{size:24,color:C.hi,weight:700}));
  s+=goalTag(G3)+A3(seg(p,b-.07,b-.01));
  return s;
 },
 // 15. 誤答 A・B を1枚ずつ（1文目を半分ずつ）
 [K+'wrongAB']:(p,ctx)=>{
  const W=sentWin(ctx),a=W[0][1],m=a/2;
  let s=fade(.4,cartPic(4.6));
  s+=wrongSeq(p,ctx,[['A','光を 引き寄せる','引く 力では なく 速さの 違い'],['B','力を 受けて 曲げられる','媒質の 中での 速さの 違いで 曲がる']],{win:[[0,m],[m,1]]});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 16. 誤答 C
 [K+'wrongC']:(p)=>{
  let s=fade(.4,cartPic(4.6));
  s+=wrongCard('C','振動数が 小さくなる','振動数は 境界で 変わらない',{g:seg(p,.03,.1)});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // ================= S4 まとめ =================
 // 17. 波面の作図（8 目盛りと 5 目盛り、d＝10 目盛り）と、1.0×0.80＝1.6×0.50、θ₂＝30°
 [K+'sum']:(p)=>sumPic(p,0),
 [K+'sum2']:(p)=>sumPic(p,1),
};

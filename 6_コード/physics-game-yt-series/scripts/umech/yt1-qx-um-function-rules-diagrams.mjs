// 問題編 解説「中身の倍率と、凍結する変数」（q-um-function-rules、大学編 03 微分の法則・中級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/03_微分の法則.md の q-um-function-rules（解説 19 行）。
// 画面：歯車（小問1）・長方形（小問2）・地図と2枚の断面（小問3）を順に使い、右に式と札。図を替えるときは cut（暗転）。
// 色：時刻 t 金、内側の歯車（中身 u）黄、外側の歯車 緑（凡例）。長方形の右の帯 黄、上の帯 緑、角 赤。地図：x 東 水色、y 北 緑、高さ h・断面 橙、等高線 灰、鍵 桃。
import {C,clamp,mix,smooth,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,axes,tex,texWidth,poly} from './anim.mjs';
import {QX,card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,legend,note,cueT,tAt,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-um-function-rules:';
const CT=C.t,CIN=C.hi,COUT=C.F,CK=C.a,CX=C.x,CY=C.F,CH=C.E,CL=C.p,CD='#ff6b6b';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const Ts=`{\\color{${CT}}t}`,Us=`{\\color{${CIN}}u}`;
const WF=`w=(3${Ts}-1)^2`;
const G1='t＝1 の dw/dt',G2='t＝1 の dz/dt',G3='点 (2, 1) の (∂h/∂x, ∂h/∂y)';
const ANS1=g=>answerTag(1,'C','12',{g}),ANS2=g=>answerTag(2,'A','16',{g}),ANS3=g=>answerTag(3,'C','(1, 4)',{g});
const LEG=(g=1,x=560,y=500)=>legend([['黄＝内側の倍率',CIN],['緑＝外側の倍率',COUT]],x,y,{g,dir:'row',size:22});

// ---- 歯車 ----------------------------------------------------------------------------------------
function gear(cx,cy,r,teeth,ang,color,g=1){
 const pts=[];const N=teeth*4;
 for(let i=0;i<N;i++){const a=ang+i*2*Math.PI/N,rr=(i%4<2)?r:r*.8;pts.push([cx+rr*Math.cos(a),cy+rr*Math.sin(a)]);}
 return fade(g,poly(pts,{fill:color,fo:.22,stroke:color,sw:3})+ring(cx,cy,r*.28,{color,w:3,fill:C.bg})+line(cx,cy,cx+r*.62*Math.cos(ang),cy+r*.62*Math.sin(ang),{color,w:4}));
}
const badge=(x,y,text,color,g=1,w=150,glow=0)=>fade(g,rect(x-w/2,y-28,w,56,{fill:'#1a2440',fo:1,stroke:color,sw:2+3*glow,rx:12})+label(text,x,y+10,{size:28,color,anchor:'middle',weight:700}));
function cross(x,y,g){return fade(g,line(x-40,y-40,x+40,y+40,{color:CD,w:5})+line(x-40,y+40,x+40,y-40,{color:CD,w:5}));}
// t →［黄］→ u →［緑］→ w
function gears({cx=600,y=215,ang=0,b1=0,b2=0,t1='×3',t2='×2u',h1=0,glow1=0,glow2=0,mul=0,g=1,sc=1}={}){
 const X1=cx-120*sc,X2=cx+120*sc,r=46*sc;
 let s='';
 s+=label('t',X1-110*sc,y+11,{size:34*sc,color:CT,anchor:'middle',weight:700})+arrow(X1-92*sc,y,X1-r-6,y,{color:C.dim,w:3,head:12});
 s+=fade(1-h1*.85,gear(X1,y,r,8,ang,CIN));
 s+=arrow(X1+r+6,y,cx-20*sc,y,{color:C.dim,w:3,head:12})+label('u',cx,y+11,{size:34*sc,color:CIN,anchor:'middle',weight:700})+arrow(cx+20*sc,y,X2-r-6,y,{color:C.dim,w:3,head:12});
 s+=gear(X2,y,r,8,-ang*1.4,COUT);
 s+=arrow(X2+r+6,y,X2+92*sc,y,{color:C.dim,w:3,head:12})+label('w',X2+110*sc,y+11,{size:34*sc,color:C.ink,anchor:'middle',weight:700});
 if(sc>=1){
  s+=fade(1-h1*.7,label('t → u＝3t−1',X1,y+r+40,{size:24,color:CIN,anchor:'middle',weight:700}));
  s+=label('u → u²',X2,y+r+40,{size:24,color:COUT,anchor:'middle',weight:700});
  s+=badge(X1,y+r+88,t1,CIN,b1*(1-h1),150,glow1)+badge(X2,y+r+88,t2,COUT,b2,150,glow2);
  s+=fade(mul,label('×',cx,y+r+98,{size:40,color:C.ink,anchor:'middle',weight:700}));
 }
 s+=cross(X1,y,h1);
 return fade(g,s);
}

// ---- 長方形（横 f、縦 g） ------------------------------------------------------------------------
const RB={x0:150,y0:470,w:300,h:250,d:52};
function rectFG({grow=0,strips=1,lab=1,corner=1,cornerShrink=0,txt=['gΔf','fΔg','ΔfΔg'],dimR=1,dimT=1,crossR=0,crossT=0,glowR=0,glowT=0,g=1,names=1}={}){
 const {x0,y0,w,h}=RB,d=RB.d*grow,dc=d*(1-cornerShrink);
 let s=rect(x0,y0-h,w,h,{fill:C.dim,fo:.12,stroke:C.dim,sw:3,rx:2});
 s+=label('z ＝ fg',x0+w/2,y0-h/2+12,{size:34,color:C.ink,anchor:'middle',weight:700});
 if(names){s+=label('f ＝ t',x0+w/2,y0+36,{size:28,color:C.ink,anchor:'middle',weight:700})+label('g',x0-16,y0-h/2+10,{size:30,color:C.ink,anchor:'end',weight:700});}
 if(d>.5){
  s+=fade(strips*dimR,rect(x0+w,y0-h,d,h,{fill:CIN,fo:.45,stroke:CIN,sw:2+3*glowR,rx:2}));
  s+=fade(strips*dimT,rect(x0,y0-h-d,w,d,{fill:COUT,fo:.45,stroke:COUT,sw:2+3*glowT,rx:2}));
  if(dc>.5)s+=fade(strips*corner,rect(x0+w,y0-h-d,dc,dc,{fill:CK,fo:.7,stroke:CK,sw:2,rx:2}));
  if(lab){
   s+=fade(strips*dimR,label(txt[0],x0+w+d+10,y0-h/2+10,{size:26,color:CIN,weight:700}));
   s+=fade(strips*dimT,label(txt[1],x0+w/2,y0-h-d/2+9,{size:26,color:C.ink,anchor:'middle',weight:700}));
   if(txt[2]&&dc>4)s+=fade(strips*corner*(1-cornerShrink),label(txt[2],x0+w+d+10,y0-h-d/2+8,{size:24,color:CK,weight:700}));
   s+=fade(strips,label('Δf',x0+w+d/2,y0+36,{size:24,color:CIN,anchor:'middle'})+label('Δg',x0-16,y0-h-d/2+8,{size:24,color:COUT,anchor:'end'}));
  }
 }
 if(crossR)s+=fade(crossR,line(x0+w-6,y0-h+20,x0+w+d+6,y0-20,{color:CD,w:5})+line(x0+w+d+6,y0-h+20,x0+w-6,y0-20,{color:CD,w:5}));
 if(crossT)s+=fade(crossT,line(x0+20,y0-h-d-4,x0+w-20,y0-h+4,{color:CD,w:5})+line(x0+20,y0-h+4,x0+w-20,y0-h-d-4,{color:CD,w:5}));
 return fade(g,s);
}

// ---- 地図（h＝xy²） --------------------------------------------------------------------------------
const M={x0:80,y0:470,sx:140,sy:150,xmax:3,ymax:2.4};
const MX=x=>M.x0+M.sx*x,MY=y=>M.y0-M.sy*y,P=[2,1];
function contour(c,{color=C.dim,w=2.5,op=.6}={}){
 const xa=Math.max(c/(M.ymax*M.ymax),.05);const pts=[];
 for(let i=0;i<=60;i++){const x=mix(xa,M.xmax,i/60);pts.push([MX(x),MY(Math.sqrt(c/x))]);}
 return `<g opacity="${op}">${draw(pts,1,{color,w})}</g>`;
}
function map({g=1,cont=1,pt=1,ptGlow=0,levels=[.5,1,2,4,8],hlLevel=0}={}){
 let s=rect(M.x0,MY(M.ymax),M.sx*M.xmax,M.sy*M.ymax,{fill:'#0f1a30',fo:1,stroke:C.faint,sw:2,rx:4});
 for(let i=1;i<=3;i++)s+=line(MX(i),M.y0,MX(i),MY(M.ymax),{color:C.grid??'#1c2a44',w:2});
 for(let j=1;j<=2;j++)s+=line(M.x0,MY(j),MX(M.xmax),MY(j),{color:C.grid??'#1c2a44',w:2});
 if(cont)levels.forEach(c=>{s+=fade(cont,contour(c,{color:c===2&&hlLevel?C.hi:C.dim,w:c===2&&hlLevel?4:2.5,op:c===2&&hlLevel?1:.55}));});
 s+=arrow(M.x0,M.y0,MX(M.xmax)+34,M.y0,{color:CX,w:3,head:12})+label('東 x',MX(M.xmax)+44,M.y0+8,{size:24,color:CX});
 s+=arrow(M.x0,M.y0,M.x0,MY(M.ymax)-24,{color:CY,w:3,head:12})+label('北 y',M.x0+12,MY(M.ymax)-6,{size:24,color:CY});
 s+=label('1',MX(1),M.y0+30,{size:22,color:CX,anchor:'middle'})+label('2',MX(2),M.y0+30,{size:22,color:CX,anchor:'middle'})+label('3',MX(3),M.y0+30,{size:22,color:CX,anchor:'middle'});
 s+=label('1',M.x0-12,MY(1)+8,{size:22,color:CY,anchor:'end'})+label('2',M.x0-12,MY(2)+8,{size:22,color:CY,anchor:'end'});
 if(pt){s+=dot(MX(P[0]),MY(P[1]),10,C.hi)+label('(2, 1)',MX(P[0])+14,MY(P[1])+32,{size:24,color:C.hi,weight:700});
  if(ptGlow)s+=fade(ptGlow,ring(MX(P[0]),MY(P[1]),24,{color:C.hi,w:4}));}
 return fade(g,s);
}
function lock(x,y,color=CL,g=1,s=1){
 return fade(g,`<path d="M ${x-9*s} ${y-6*s} v ${-8*s} a ${9*s} ${9*s} 0 0 1 ${18*s} 0 v ${8*s}" fill="none" stroke="${color}" stroke-width="${3.5*s}"/>`
  +rect(x-14*s,y-7*s,28*s,22*s,{fill:color,fo:.9,stroke:color,sw:1,rx:4*s}));
}
// 東向きの断面 h＝x（y＝1）、北向きの断面 h＝2y²（x＝2）
function eastSec({x=620,y=470,w=500,h=330,g=1,tan=0,small=0}={}){
 const A=axes({x,y,w,h,xmin:0,xmax:3.2,ymin:0,ymax:4.6,xlabel:small?'':'x',ylabel:'',xticks:[1,2,3],yticks:[2,4],grid:true,xcolor:CX,ycolor:CH});
 let s=A.svg+A.plot(t=>t,{from:0,to:3.1,color:CH,w:4})+dot(A.X(2),A.Y(2),9,C.hi);
 s+=fade(tan,draw([[A.X(1),A.Y(1)],[A.X(3),A.Y(3)]],1,{color:C.hi,w:4,dash:'9 6'})+label('傾き 1',A.X(2.15),A.Y(1.35),{size:26,color:C.hi,weight:700}));
 s+=label(small?'東（y＝1）':'h ＝ x（y ＝ 1 の 断面）',x+w/2,y-h-14,{size:small?24:26,color:CH,anchor:'middle',weight:700});
 return fade(g,s);
}
function northSec({x=620,y=470,w=500,h=330,g=1,tan=0,small=0}={}){
 const A=axes({x,y,w,h,xmin:0,xmax:1.7,ymin:0,ymax:5.4,xlabel:small?'':'y',ylabel:'',xticks:[1],yticks:[2,4],grid:true,xcolor:CY,ycolor:CH});
 let s=A.svg+A.plot(t=>2*t*t,{from:0,to:1.64,color:CH,w:4})+dot(A.X(1),A.Y(2),9,C.hi);
 s+=fade(tan,draw([[A.X(.62),A.Y(2-4*.38)],[A.X(1.38),A.Y(2+4*.38)]],1,{color:C.hi,w:4,dash:'9 6'})+label('傾き 4',A.X(1.08),A.Y(1.2),{size:26,color:C.hi,weight:700}));
 s+=label(small?'北（x＝2）':'h ＝ 2y²（x ＝ 2 の 断面）',x+w/2,y-h-14,{size:small?24:26,color:CH,anchor:'middle',weight:700});
 return fade(g,s);
}

// 行2：単元の動画 y＝(2t＋1)² と w＝(3t−1)² を並べる（a：1文目の進み）。b：2文目の進み（−1 なら出さない）
function goal1Fig({a=1,b=-1,g0=1}={}){
 let s=card(40,90,540,110,label('単元の 動画',310,125,{size:22,color:C.dim,anchor:'middle'})+T(`y=(2${Ts}+1)^2`,310,170,36),g0);
 const wW=texWidth(WF,40,false),x0=890-wW/2,wIn=texWidth(`3${Ts}-1`,40,false),wPre=texWidth('w=(',40,false);
 s+=card(620,90,540,110,label('この 問題',890,125,{size:22,color:C.dim,anchor:'middle'})+T(WF,890,170,40),g0);
 s+=fade(seg(a,.3,.45),label('同じ 形（中に 式が 入った 2乗）',600,240,{size:26,color:C.hi,anchor:'middle',weight:700}));
 if(b>=0){
  s+=highlight(x0+wPre-4,140,wIn+8,52,seg(b,.02,.12),CIN)+fade(seg(b,.06,.16),label('u',x0+wPre+wIn/2,218,{size:26,color:CIN,anchor:'middle',weight:700}));
  s+=gears({y:330,ang:0,g:seg(b,.15,.3)});
  s+=fade(seg(b,.5,.62),rect(860,450,280,50,{fill:CIN,fo:.12,stroke:CIN,sw:2,rx:10})+label('t＝1 で u＝2',1000,484,{size:28,color:CIN,anchor:'middle',weight:700}));
 }
 return s;
}

export const ytQxUmFunctionRulesDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（小問1、約4秒）：二段の歯車の枠だけ。ゆっくり1回転して止まる。倍率の数は出さない。
 [K+'q1']:(p)=>gears({cx:600,y:230,ang:2*Math.PI*smooth(clamp(p/.9)),b1:0,b2:0}),
 // 小問2（約4秒）：横 f＝t、縦 g＝(3t−1)² の長方形が、右と上に少し広がって止まる（帯の名前と大きさは出さない）。
 [K+'q2']:(p)=>{
  let s=rectFG({grow:seg(p,.25,.85),lab:0,names:1});
  s+=label('横 f ＝ t',700,230,{size:30,color:C.ink,weight:700})+label('縦 g ＝ (3t − 1)²',700,290,{size:30,color:C.ink,weight:700});
  return s;
 },
 // 小問3（約4秒）：方眼の地図と点 (2, 1) だけ。点が一度光って止まる（等高線・断面・傾きは出さない）。
 [K+'q3']:(p)=>{
  const gl=Math.sin(Math.PI*clamp((p-.2)/.6));
  let s=map({cont:0,ptGlow:gl});
  s+=label('x：東向き、y：北向き',820,260,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=label('山の高さ h ＝ xy²',820,320,{size:28,color:CH,anchor:'middle',weight:700});
  return s;
 },

 // ===================== 問題の設定 =====================
 // 1. 3つの式を縦に並べ、横に小さく歯車・長方形・地図のアイコン。
 [K+'setup']:(p)=>{
  let s='';
  const rows=[[WF,'式の中の式'],[`z=${Ts}(3${Ts}-1)^2`,'掛け算'],[`h=xy^2`,'2つの変数']];
  rows.forEach(([f,t],i)=>{const y=150+i*120,g=seg(p,.05+.12*i,.15+.12*i);
   s+=card(300,y-50,600,100,T(f,560,y+12,40)+label(t,820,y+10,{size:26,color:C.dim,anchor:'middle'}),g);});
  const g1=seg(p,.5,.6),g2=seg(p,.58,.68),g3=seg(p,.66,.76);
  s+=fade(g1,gear(200,150,38,8,0,CIN));
  s+=fade(g2,rect(170,240,60,60,{fill:C.dim,fo:.15,stroke:C.dim,sw:2,rx:2})+rect(230,240,14,60,{fill:CIN,fo:.5,stroke:CIN,sw:1,rx:1})+rect(170,226,60,14,{fill:COUT,fo:.5,stroke:COUT,sw:1,rx:1}));
  s+=fade(g3,rect(165,360,80,70,{fill:'#0f1a30',fo:1,stroke:C.faint,sw:2,rx:4})+draw([[175,365],[190,395],[240,410]],1,{color:C.dim,w:2})+dot(215,395,6,C.hi));
  return s;
 },

 // ===================== 小問1 =====================
 // 2. 単元の動画 y＝(2t＋1)² と w＝(3t−1)² を並べる。3t−1 に黄の枠と u、「t＝1 で u＝2」。二段の歯車。
 [K+'goal1']:(p)=>goal1Fig({a:p,b:-1,g0:seg(p,.03,.1)})+goalTag(G1,{g:seg(p,.02,.08)}),
 // 2b. （行2の2文目）3t−1 に黄の枠と u、二段の歯車、「t＝1 で u＝2」。
 [K+'name']:(p)=>goal1Fig({a:1,b:p,g0:1})+goalTag(G1),
 // 3. 黄の歯車：Δt＝0.001 → Δu＝0.003、×3
 [K+'inner']:(p,ctx)=>{
  const t=cueT(ctx);
  let s=T(WF,600,115,40)+gears({y:215,ang:-.6*smooth(clamp(t/1.5)),b1:seg(p,.5,.62)});
  s+=fade(seg(p,.08,.2),label('Δt ＝ 0.001',330,445,{size:30,color:CT,anchor:'middle',weight:700}));
  s+=fade(seg(p,.2,.3),arrow(440,435,520,435,{color:C.dim,w:3,head:12})+label('Δu ＝ 0.003',640,445,{size:30,color:CIN,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.62),label('内側の 倍率 3',920,445,{size:30,color:CIN,anchor:'middle',weight:700}));
  s+=LEG(1,560,500)+label('t＝1 で u＝2',150,115,{size:26,color:CIN,anchor:'middle',weight:700});
  s+=goalTag(G1);
  return s;
 },
 // 4. 緑の歯車：×2u → u＝2 で ×4。dw/dt＝(dw/du)(du/dt)＝4×3＝12
 [K+'outer']:(p,ctx)=>{
  const t=cueT(ctx),W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  const u2=seg(p,.25,.32);
  let s=T(WF,600,115,40)+gears({y:215,ang:-.6-.8*smooth(clamp(t/2)),b1:1,b2:seg(p,.05,.15),t2:u2>.5?'×4':'×2u',glow2:seg(p,.25,.32),mul:seg(p,b,b+.08)});
  s+=fade(seg(p,.25,.32),label('u＝2 を 入れる',840,330,{size:22,color:COUT,anchor:'start'}));
  s+=fade(seg(p,b+.05,b+.15),T(`\\dfrac{dw}{d${Ts}}=\\dfrac{dw}{d${Us}}\\,\\dfrac{d${Us}}{d${Ts}}`,480,450,32));
  s+=fade(seg(p,b+.25,b+.35),T(`=4\\times3=12`,830,450,38,{color:C.hi}));
  s+=label('t＝1 で u＝2',150,115,{size:26,color:CIN,anchor:'middle',weight:700});
  s+=goalTag(G1);
  return s;
 },
 // 5. 数値：幅 0.001 で 12.009。小問1 の答え C。
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=gears({cx:300,y:150,ang:-1.4,b1:1,b2:1,t2:'×4',mul:1});
  s+=card(620,100,560,170,label('3 × 4 ＝ 12',900,200,{size:40,color:C.hi,anchor:'middle',weight:700}),1);
  s+=card(120,320,960,170,label('数値で 確かめる（幅 0.001）',600,360,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.05,.2),T(`\\dfrac{(3.003-1)^2-4}{0.001}=12.009`,600,435,40)),seg(p,.02,.08));
  s+=goalTag(G1)+ANS1(seg(p,b+.02,b+.1));
  return s;
 },
 // 6. 誤答 A（黄の歯車を外すと 4）→ B（u＝3）→ D（外側を ×2）
 [K+'wrong1']:(p,ctx)=>{
  const W=sentWin(ctx),b2=W[1]?W[1][0]:.4,m=b2+(1-b2)*.5;
  const wA=[0,b2+.02],wB=[b2+.02,m+.02],wD=[m+.02,1];
  const inA=seg(p,.01,.05)*(1-seg(p,b2,b2+.03)),inB=seg(p,b2+.01,b2+.04)*(1-seg(p,m,m+.03)),inD=seg(p,m+.01,m+.04);
  let s=gears({y:170,ang:-1.4,b1:1,b2:1,t2:inB>.5?'×6':(inD>.5?'×2':'×4'),h1:inA,mul:1,glow2:Math.max(inB,inD)});
  s+=fade(inB,label('u ＝ 3t ＝ 3 とすると 2u ＝ 6',960,362,{size:22,color:CD,anchor:'middle'}));
  s+=wrongSeq(p,ctx,[['A','4','内側の ×3 を 落とした（黄の 歯車を 外すと 4）'],['B','18','u ＝ 3t ＝ 3 とした（2×3×3）'],['D','6','外側を ×2 とした（2×3）']],{win:[wA,wB,wD],opts:{x:150,w:900,y:385,size:26,whySize:24}});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },

 // ===================== 小問2 =====================
 // 7. 長方形：横 f＝t、縦 g＝(3t−1)²、面積 z。
 [K+'goal2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=fade(seg(p,b,b+.1),rectFG({grow:0}));
  s+=card(620,100,560,130,T(`z=${Ts}(3${Ts}-1)^2`,900,175,42),seg(p,.03,.1));
  s+=fade(seg(p,b+.05,b+.15),T(`f=${Ts}`,760,300,38)+T(`g=(3${Ts}-1)^2`,980,300,38));
  s+=fade(seg(p,b+.15,b+.25),label('z ＝ f × g（長方形の 面積）',900,390,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=goalTag(G2,{g:seg(p,.02,.08)});
  return s;
 },
 // 8. 少し広げる：右の帯 gΔf、上の帯 fΔg、角 ΔfΔg
 [K+'grow']:(p)=>{
  let s=rectFG({grow:seg(p,.05,.3),strips:1,lab:1});
  s+=card(620,100,560,330,label('増える 面積',900,150,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.35,.45),label('右の 帯 gΔf',900,220,{size:30,color:CIN,anchor:'middle',weight:700}))
   +fade(seg(p,.47,.57),label('上の 帯 fΔg',900,290,{size:30,color:COUT,anchor:'middle',weight:700}))
   +fade(seg(p,.59,.69),label('角 ΔfΔg',900,360,{size:30,color:CK,anchor:'middle',weight:700})),seg(p,.02,.1));
  s+=goalTag(G2);
  return s;
 },
 // 9. 角は Δt で割っても Δg が残り 0 に近づく。f′＝df/dt、g′＝dg/dt → dz/dt＝f′g＋fg′
 [K+'corner']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=rectFG({grow:1,cornerShrink:seg(p,.3,b-.02)});
  const e=`\\dfrac{\\Delta f\\,\\Delta g}{\\Delta ${Ts}}=\\dfrac{\\Delta f}{\\Delta ${Ts}}\\,{\\color{${C.hi}}\\Delta g}`;
  s+=card(620,100,560,180,T(e,900,175,36)+fade(seg(p,.2,.3),label('Δg → 0 なので 0 に 近づく',900,255,{size:26,color:CK,anchor:'middle',weight:700})),1);
  s+=fade(seg(p,b,b+.08),label('f′ ＝ df/dt、g′ ＝ dg/dt',900,330,{size:26,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,b+.12,b+.22),T(`\\dfrac{dz}{d${Ts}}={\\color{${CIN}}f'g}+{\\color{${COUT}}fg'}`,900,430,48));
  s+=goalTag(G2);
  return s;
 },
 // 10. t＝1：右の帯 1×4、上の帯 1×12。小問1 の歯車（3×4＝12）を小さく再掲。
 [K+'values']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  const lab=seg(p,.05,.15);
  let s=rectFG({grow:1,corner:0,txt:[lab>.5?'1×4':'gΔf',lab>.5?'1×12':'fΔg','']});
  s+=card(620,100,560,170,T(`\\dfrac{dz}{d${Ts}}={\\color{${CIN}}f'g}+{\\color{${COUT}}fg'}`,900,165,40)
   +fade(seg(p,.1,.2),T(`={\\color{${CIN}}1\\times4}+{\\color{${COUT}}1\\times12}`,900,235,36)),1);
  s+=fade(seg(p,b,b+.1),card(700,300,400,190,gears({cx:900,y:360,ang:0,sc:.55})+label('小問1：g′ ＝ 3 × 4 ＝ 12',900,460,{size:26,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
  s+=fade(seg(p,b+.1,b+.2),line(700,395,520,RB.y0-RB.h-26,{color:C.hi,w:2,dash:'6 6'}));
  s+=goalTag(G2);
  return s;
 },
 // 11. 4＋12＝16。小問2 の答え A。
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.3;
  let s=rectFG({grow:1,corner:0,txt:['1×4','1×12','']});
  s+=card(620,100,560,250,T(`\\dfrac{dz}{d${Ts}}={\\color{${CIN}}1\\times4}+{\\color{${COUT}}1\\times12}`,900,180,36)
   +fade(seg(p,.05,.2),T(`=16`,900,290,56,{color:C.hi})),1);
  s+=goalTag(G2)+ANS2(seg(p,b+.02,b+.12));
  return s;
 },
 // 12. 展開して確かめる：z＝9t³−6t²＋t → 27t²−12t＋1 → 16 ✓
 [K+'expand']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=card(100,100,1000,390,'',1);
  s+=T(`z=${Ts}(9${Ts}^2-6${Ts}+1)=9${Ts}^3-6${Ts}^2+${Ts}`,600,170,40);
  s+=fade(seg(p,.25,.35),label('項ごとに 微分',600,240,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.3,.42),T(`\\dfrac{dz}{d${Ts}}=27${Ts}^2-12${Ts}+1`,600,310,40));
  s+=fade(seg(p,b+.1,b+.22),T(`${Ts}=1:\\ 27-12+1=16`,580,420,40));
  s+=fade(seg(p,b+.28,b+.36),label('✓',830,432,{size:44,color:C.F,weight:700}));
  s+=goalTag(G2)+ANS2(1);
  return s;
 },
 // 13. 誤答 B（f′g′：帯を2本とも失う）→ C（g′ で ×3 を落とす）→ D（fg′ の帯を忘れた）
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),b2=W[1]?W[1][0]:.4,m=b2+(1-b2)*.5;
  const wB=[0,b2+.02],wC=[b2+.02,m+.02],wD=[m+.02,1];
  const inB=seg(p,.01,.05)*(1-seg(p,b2,b2+.03)),inC=seg(p,b2+.01,b2+.04)*(1-seg(p,m,m+.03)),inD=seg(p,m+.01,m+.04);
  let s=rectFG({grow:1,corner:0,txt:['1×4',inC>.5?'1×4':'1×12',''],crossR:inB,crossT:Math.max(inB,inD),dimT:1-.6*inD});
  s+=wrongSeq(p,ctx,[['B','12',['f′g′ ＝ 1×12 と 掛けた','（帯を 2本とも 失う）']],['C','8',['1×4 ＋ 1×4','（g′ で ×3 を 落とした）']],['D','4',['f′g の 帯 だけ','（fg′ の 帯を 忘れた）']]],{win:[wB,wC,wD],opts:{x:620,w:560,y:200,size:28,whySize:24}});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },

 // ===================== 小問3 =====================
 // 14. 地図と点 (2, 1)、等高線。一つの変数だけを動かし、もう一つに鍵。
 [K+'goal3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=map({cont:seg(p,.1,.25)});
  s+=card(620,100,560,330,T(`h=xy^2`,900,175,48,{color:CH})+label('等高線（灰）＝ 同じ 高さ',900,245,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,b,b+.1),line(660,280,1140,280,{color:C.faint,w:2})+label('一つの 変数 だけを 動かし',900,330,{size:28,color:C.ink,anchor:'middle',weight:700})
   +lock(760,378,CL)+label('もう 一つに 鍵',920,390,{size:28,color:CL,anchor:'middle',weight:700})),seg(p,.03,.1));
  s+=goalTag(G3,{g:seg(p,.02,.08)});
  return s;
 },
 // 15. 東へ：y＝1 に鍵。断面 h＝x、傾き 1。∂h/∂x＝y²＝1
 [K+'east']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=map({cont:.5});
  s+=fade(seg(p,.05,.15),line(M.x0,MY(1),MX(M.xmax),MY(1),{color:CX,w:3,dash:'8 6'})+lock(MX(.5),MY(1)-24,CL)+label('y＝1 に 鍵',MX(.5)+24,MY(1)-16,{size:24,color:CL,weight:700}));
  s+=fade(seg(p,.1,.2),arrow(MX(2),MY(1),MX(2.6),MY(1),{color:CX,w:6,head:16}));
  s+=eastSec({x:640,y:370,w:500,h:220,tan:seg(p,b+.1,b+.2),g:seg(p,.15,.28)});
  s+=fade(seg(p,b,b+.1),T(`\\dfrac{\\partial h}{\\partial x}=y^2=1`,890,465,38));
  s+=goalTag(G3);
  return s;
 },
 // 16. 北へ：x＝2 に鍵。断面 h＝2y²、y＝1 で接線、傾き 4。∂h/∂y＝2xy＝4
 [K+'north']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=map({cont:.5});
  s+=fade(seg(p,.05,.15),line(MX(2),M.y0,MX(2),MY(M.ymax),{color:CY,w:3,dash:'8 6'})+lock(MX(2)+30,MY(2.1),CL)+label('x＝2 に 鍵',MX(2)+52,MY(2.1)+8,{size:24,color:CL,weight:700}));
  s+=fade(seg(p,.1,.2),arrow(MX(2),MY(1),MX(2),MY(1.55),{color:CY,w:6,head:16}));
  s+=northSec({x:640,y:370,w:500,h:220,tan:seg(p,b+.15,b+.25),g:seg(p,.15,.28)});
  s+=fade(seg(p,b,b+.1),T(`\\dfrac{\\partial h}{\\partial y}=2xy=2\\times2\\times1=4`,890,465,34));
  s+=goalTag(G3);
  return s;
 },
 // 17. 2枚の断面を並べ、傾き 1 と 4 を光らせる。小問3 の答え C。
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=eastSec({x:110,y:420,w:440,h:270,tan:1,small:1})+northSec({x:680,y:420,w:440,h:270,tan:1,small:1});
  const gl=seg(p,.1,.25);
  s+=fade(gl,label('(1, 4)：北へ 歩く ほうが 4倍 急',600,490,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=goalTag(G3)+ANS3(seg(p,b+.02,b+.12));
  return s;
 },
 // 18. 誤答 A（入れ違え）→ B（x を掛け忘れ）→ D（y² を 0 にした）
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),b2=W[1]?W[1][0]:.4,m=b2+(1-b2)*.5;
  const wA=[0,b2+.02],wB=[b2+.02,m+.02],wD=[m+.02,1];
  let s=map({cont:.5});
  s+=card(620,95,560,200,T(`\\dfrac{\\partial h}{\\partial x}=y^2=1`,900,150,32)+T(`\\dfrac{\\partial h}{\\partial y}=2xy=4`,900,245,32),1);
  s+=wrongSeq(p,ctx,[['A','(4, 1)','2つを 入れ違えた'],['B','(1, 2)',['2y だけ','（鍵を 掛けた x を 掛け忘れた）']],['D','(0, 4)',['y² は x に 掛かる 数','0 に ならない']]],{win:[wA,wB,wD],opts:{x:620,w:560,y:315,size:28,whySize:24}});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },

 // ===================== まとめ =====================
 // 19. 歯車（3×4＝12）・長方形の帯（4＋12＝16）・2枚の断面（傾き 1 と 4）と、その下に式。最後に答えの札を並べる。
 [K+'sum']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s='';
  const g1=seg(p,0,.05),g2=seg(p,.15,.22),g3=seg(p,b,b+.08);
  s+=card(30,100,360,250,gears({cx:210,y:180,ang:0,sc:.6})+label('3 × 4 ＝ 12',210,300,{size:30,color:C.hi,anchor:'middle',weight:700}),g1);
  s+=card(420,100,360,250,rect(520,170,110,90,{fill:C.dim,fo:.12,stroke:C.dim,sw:2,rx:2})+rect(630,170,22,90,{fill:CIN,fo:.5,stroke:CIN,sw:1,rx:1})+rect(520,148,110,22,{fill:COUT,fo:.5,stroke:COUT,sw:1,rx:1})
   +label('4 ＋ 12 ＝ 16',600,300,{size:30,color:C.hi,anchor:'middle',weight:700}),g2);
  s+=card(810,100,360,250,draw([[850,250],[950,170]],1,{color:CH,w:3})+draw(Array.from({length:21},(_,i)=>{const y=i/20*1.5;return [1010+y*80,260-2*y*y*20];}),1,{color:CH,w:3})
   +label('傾き 1 と 4',990,300,{size:30,color:C.hi,anchor:'middle',weight:700}),g3);
  s+=fade(g1,T(`\\dfrac{dw}{d${Ts}}=12`,210,410,34));
  s+=fade(g2,T(`\\dfrac{dz}{d${Ts}}=f'g+fg'=16`,600,410,30));
  s+=fade(g3,T(`\\left(\\dfrac{\\partial h}{\\partial x},\\dfrac{\\partial h}{\\partial y}\\right)=(1,4)`,990,410,28));
  s+=fade(g1,label('掛け算',210,480,{size:24,color:C.dim,anchor:'middle'}))+fade(g2,label('足し算',600,480,{size:24,color:C.dim,anchor:'middle'}))+fade(g3,label('一つずつ 鍵',990,480,{size:24,color:C.dim,anchor:'middle'}));
  s+=answerRow([[1,'C','12'],[2,'A','16'],[3,'C','(1, 4)']],{g:seg(p,.85,.92)});
  return s;
 },
};

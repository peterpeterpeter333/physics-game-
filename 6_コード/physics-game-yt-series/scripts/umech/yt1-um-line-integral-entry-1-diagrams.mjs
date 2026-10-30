// YouTube シリーズ「線積分と面積分・中級 1/2」(ys-um-line-integral-entry-1) — 図。Stage 1200×515.
// 道と区間の数値は初級 20（yt1-ui-electric-work-path-1-diagrams.mjs の SEGS/VERT/curveAt）と同じ。+1 C なので力 𝐅 の数値＝電場の数値。
// 色：力 𝐅 緑、沿う部分 黄（負は赤）、直角な部分 桃、仕事 橙、Σ 黄、Δ𝐫ᵢ（一般の式）金、区間 i＝1〜4 は SCOL（青・紫・銀・薔薇）、位置 𝐫ᵢ 白。
// 部品は export して 2/2 でも使う（関数・定数の export は図の登録に入らない）。
import {C,clamp,mix,seg,fade,move,label,line,rect,dot,ring,draw,arrow,tex,texWidth,poly,brace,highlight} from './anim.mjs';
import {SCOL,SEGS,VERT,curveAt,view,curveSvg,charge} from './yt1-ui-electric-work-path-1-diagrams.mjs';

const K='um-line-integral-entry-1:';
export const FC=C.F,AL=C.hi,PP=C.p,WC=C.E,NG=C.a,QC='#ff6b6b',DC=C.t,EC=C.x;
export const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
export const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});
export const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
export const cross=(x,y,sz=16,color=C.a)=>line(x-sz,y-sz,x+sz,y+sz,{color,w:4})+line(x-sz,y+sz,x+sz,y-sz,{color,w:4});
const rad=d=>d*Math.PI/180;
// TeX pieces
export const vF=cs(FC,'\\mathbf{F}'),Fri=(i='i')=>cs(FC,`\\mathbf{F}(\\mathbf{r}_{${i}})`),dri=(i='i',c=DC)=>cs(c,`\\Delta\\mathbf{r}_{${i}}`),ri=(i='i')=>`\\mathbf{r}_{${i}}`;
export const SIG=(lo='i=1',hi='N')=>cs(AL,`\\sum_{${lo}}^{${hi}}`);
export const WNsum=()=>`W_N=${SIG()}${Fri()}\\cdot${dri()}`;
// horizontal box [left,width] of the part that follows `pre` inside `full` (full is centred at x)
export const hb=(full,pre,part,x,size)=>{const W=texWidth(full,size,false),l=x-W/2+(pre?texWidth(pre,size,false):0);return [l,texWidth(part,size,false)];};
export function hl(full,pre,part,x,size,y0,h,g=1,color=C.hi){const [l,w]=hb(full,pre,part,x,size);return highlight(l-8,y0,w+16,h,g,color);}

// ---- overview of the 4-segment path (same geometry as 初級 20) ----------------------------------------
export const O1={ox:230,oy:420,sc:120,Fsc:19};
export const ORG=[130,485];
const mid=(V,i)=>{const a=V(VERT[i]),b=V(VERT[i+1]);return [(a[0]+b[0])/2,(a[1]+b[1])/2];};
const BADGE=[[0,42],[30,36],[-44,-10],[-16,-40]];
const VOFF=[[0,54],[44,44],[-78,0],[-14,-52]];
const DOFF=[[-66,40],[84,62],[-104,-4],[-74,-48]];
// o: curve (draw progress), curveOp, chords (g), hl (index), dim (0..1 others), F (g), idx (g badges), rep (g dots), pos (g position arrows), vals (g), valsText, drl (g)
export function ov({ox=O1.ox,oy=O1.oy,sc=O1.sc,Fsc=O1.Fsc,curve=1,curveOp=.6,chords=0,hl=-1,dim=0,F=0,idx=0,rep=0,pos=0,vals=0,valsText=null,drl=0,chordCol=null,org=ORG}={}){
 const V=view(ox,oy,sc);let s=curveSvg(V,{p:curve,color:C.dim,w:5,opacity:chords>0?curveOp*(1-.45*chords)+.001:1});
 s+=fade(curve,dot(...V(VERT[0]),6,C.dim)+dot(...V(VERT[4]),6,C.dim));
 SEGS.forEach((q,i)=>{
  const a=V(VERT[i]),b=V(VERT[i+1]),[mx,my]=mid(V,i);const op=hl>=0&&i!==hl?1-.75*dim:1;const col=chordCol??SCOL[i];
  s+=fade(pos*op,arrow(org[0],org[1],mx,my,{color:C.ink,w:2.5,head:11,opacity:.85}));
  s+=fade(chords*op,arrow(a[0],a[1],b[0],b[1],{color:col,w:i===hl?7:5,head:15}));
  const fx=Math.cos(rad(q.edir))*q.mag*Fsc,fy=-Math.sin(rad(q.edir))*q.mag*Fsc;
  s+=fade(F*op,arrow(mx,my,mx+fx,my+fy,{color:FC,w:4.5,head:13}));
  s+=fade(rep*op,dot(mx,my,6.5,C.ink)+ring(mx,my,9,{color:SCOL[i],w:2.5}));
  const [bx,by]=BADGE[i];
  s+=fade(idx*op,ring(mx+bx,my+by,16,{color:SCOL[i],w:2.5,fill:'#0f1830'})+label(String(i+1),mx+bx,my+by+8,{size:22,color:SCOL[i],anchor:'middle',weight:700}));
  s+=fade(drl*op,T(dri(i+1,SCOL[i]),mx+DOFF[i][0],my+DOFF[i][1]+10,{size:28}));
  if(valsText)s+=fade(vals*op,label(valsText[i],mx+VOFF[i][0],my+VOFF[i][1]+10,{size:26,color:q.dW<0?NG:WC,anchor:'middle',weight:700}));
 });
 s+=fade(pos,dot(org[0],org[1],6,C.ink)+label('原点',org[0]-12,org[1]+8,{size:22,color:C.dim,anchor:'end'}));
 return s;
}
export const VALS=['+3 J','+2 J','0 J','−2 J'];

// ---- one step, with the force split into the part along the step and the part perpendicular to it -------------
// (cx,cy): representative point on the step. L: px per m, S: px per N.
export function step(i,cx,cy,{L=70,S=16,gDr=1,gF=1,gA=0,gP=0,lab=true,labF='',labSize=24,path=true,drText=true}={}){
 const q=SEGS[i],ux=Math.cos(rad(q.deg)),uy=-Math.sin(rad(q.deg)),nx=-uy,ny=ux;// n: right of travel
 const fx=Math.cos(rad(q.edir))*q.mag*S,fy=-Math.sin(rad(q.edir))*q.mag*S;
 const a=q.mag*Math.cos(rad(q.edir-q.deg)),ax=cx+a*S*ux,ay=cy+a*S*uy;const len=q.m*L;
 let s='';
 if(path)s+=line(cx-(len/2+40)*ux,cy-(len/2+40)*uy,cx+(len/2+40)*ux,cy+(len/2+40)*uy,{color:C.faint,w:3,dash:'8 7'});
 const off=i===2?-26:26;
 s+=fade(gDr,arrow(cx-len/2*ux+off*nx,cy-len/2*uy+off*ny,cx+len/2*ux+off*nx,cy+len/2*uy+off*ny,{color:SCOL[i],w:5,head:14}));
 if(drText)s+=fade(gDr,T(dri(i+1,SCOL[i]),cx+off*2.3*nx+(i===1?10:0),cy+off*2.3*ny+10,{size:22}));
 if(Math.abs(a)>.01){const col=a>0?AL:NG;s+=fade(gA,line(cx,cy,ax,ay,{color:col,w:13,cap:'butt',opacity:.5})+arrow(cx,cy,ax,ay,{color:col,w:5,head:15}));}
 else s+=fade(gA,ring(cx,cy,10,{color:AL,w:4}));
 if(q.perp>0&&Math.abs(a)>.01||i===2)s+=fade(gP,arrow(ax,ay,cx+fx,cy+fy,{color:PP,w:4,head:13}));
 s+=fade(gF,arrow(cx,cy,cx+fx,cy+fy,{color:FC,w:5,head:16}));
 if(labF)s+=fade(gF,T(labF,cx+fx+(i===3?-8:10),cy+fy+(i===3?30:-6),{size:labSize,anchor:i===3?'end':'start'}));
 s+=dot(cx,cy,5,C.ink);
 return s;
}
// four tiles, one per segment
export const TILE={x0:40,y:52,w:272,h:268,gap:12};
export function tiles({g=[1,1,1,1],hl=-1,dim=0,gA=1,gP=1,vals=[0,0,0,0],y=TILE.y,h=TILE.h}={}){
 let s='';
 SEGS.forEach((q,i)=>{
  const inHl=Array.isArray(hl)?hl.includes(i):hl===i,x=TILE.x0+i*(TILE.w+TILE.gap),op=((Array.isArray(hl)||hl>=0)&&!inHl)?1-.7*dim:1,gg=g[i]*op;
  if(gg<=0.001)return;
  const cx=x+TILE.w/2+(i===3?30:0),cy=y+h*.52+(i===2?18:0);
  const txt=[`沿う 3 N × 1 m`,`沿う 1 N × 2 m`,`沿う 0 N`,`沿う −2 N × 1 m`][i];
  const res=['＝ +3 J','＝ +2 J','→ 0 J','＝ −2 J'][i];
  s+=fade(gg,rect(x,y,TILE.w,h,{fill:'#111c33',fo:.95,stroke:SCOL[i],sw:2,rx:12})
   +label(`i＝${i+1}`,x+14,y+32,{size:24,color:SCOL[i],weight:700})
   +step(i,cx,cy,{L:i===1?78:110,S:28,gA,gP,drText:false})
   +fade(vals[i],label(txt,x+TILE.w/2,y+h+34,{size:22,color:i===3?NG:AL,anchor:'middle',weight:700})+label(res,x+TILE.w/2,y+h+66,{size:26,color:q.dW<0?NG:WC,anchor:'middle',weight:700})));
 });
 return s;
}

// ---- small helpers for this film --------------------------------------------------------------------------
function straightStep(p,{gF=1,gDr=1,gA=0,gP=0,neg=false}={}){
 // one straight step (2 m to the right), constant force 5 N at 53° (or backwards when neg)
 const x0=150,y0=360,L=300,S=26;
 let s=line(x0-60,y0,x0+L+80,y0,{color:C.faint,w:3,dash:'8 7'});
 s+=fade(gDr,arrow(x0,y0+34,x0+L,y0+34,{color:DC,w:6,head:16})+T(`${dri('')}`,x0+L/2,y0+78,{size:30}));
 const ang=neg?rad(233.13):rad(53.13),fx=Math.cos(ang)*5*S,fy=-Math.sin(ang)*5*S,ax=Math.cos(ang)*5*S;
 const px=x0+(neg?L*.62:L*.08);
 s+=fade(gA,line(px,y0,px+ax,y0,{color:neg?NG:AL,w:14,cap:'butt',opacity:.5})+arrow(px,y0,px+ax,y0,{color:neg?NG:AL,w:6,head:17}));
 s+=fade(gP,arrow(px+ax,y0,px+fx,y0+fy,{color:PP,w:5,head:15}));
 s+=fade(gF,arrow(px,y0,px+fx,y0+fy,{color:FC,w:6,head:18})+T(vF,px+fx+(neg?-16:16),y0+fy+(neg?30:0),{size:34,anchor:neg?'end':'start'}));
 return s;
}
function vfield(V,{g=1,sc=19}={}){
 // the force at several places along the curve (the 4 segment forces, plus the joints averaged)
 let s='';const at=[[.5,0],[1.5,1],[2.5,2],[3.5,3],[1.0,-1],[2.0,-2],[3.0,-3]];
 at.forEach(([t,i],k)=>{const [x,y]=V(curveAt(t));let ang,mag;
  if(i>=0){ang=rad(SEGS[i].edir);mag=SEGS[i].mag;}else{const A=SEGS[-i-1],B=SEGS[-i];const ax=A.mag*Math.cos(rad(A.edir))+B.mag*Math.cos(rad(B.edir)),ay=A.mag*Math.sin(rad(A.edir))+B.mag*Math.sin(rad(B.edir));ang=Math.atan2(ay,ax);mag=Math.max(1.2,Math.hypot(ax,ay)/2);}
  s+=fade(seg(g,k*.08,k*.08+.4),arrow(x,y,x+Math.cos(ang)*mag*sc,y-Math.sin(ang)*mag*sc,{color:FC,w:4.5,head:13}));});
 return s;
}
function tangents(V,g=1){let s='';[.5,1.5,2.5,3.5].forEach((t,k)=>{const [x,y]=V(curveAt(t)),[x2,y2]=V(curveAt(t+.08));const d=Math.hypot(x2-x,y2-y);
 s+=fade(seg(g,k*.15,k*.15+.4),arrow(x,y,x+(x2-x)/d*58,y+(y2-y)/d*58,{color:C.ink,w:3,head:11}));});return s;}

export const ytUmLineIntegralEntry1Diagrams={
 // ===== S1 前回の問い =====
 [K+'intro']:(p)=>{
  const V=view(O1.ox,O1.oy,O1.sc);
  let s=ov({curve:seg(p,.05,.45)})+vfield(V,{g:seg(p,.35,.9)});
  s+=fade(seg(p,.05,.25),label('前回の最後の問い',80,60,{size:26,color:C.dim}));
  s+=card(780,110,380,170,label('道に沿って',970,175,{size:28,color:C.ink,anchor:'middle'})+label('小さな仕事を 足した',970,230,{size:30,color:WC,anchor:'middle',weight:700}),seg(p,.5,.7),C.faint);
  return s;
 },
 [K+'intro2']:(p)=>{
  const V=view(O1.ox,O1.oy,O1.sc);
  let s=ov({})+vfield(V,{g:1});
  s+=label('前回の最後の問い',80,60,{size:26,color:C.dim});
  s+=card(780,110,380,170,label('道に沿って',970,175,{size:28,color:C.ink,anchor:'middle'})+label('小さな仕事を 足した',970,230,{size:30,color:WC,anchor:'middle',weight:700}),1-seg(p,.05,.2),C.faint);
  s+=card(780,110,380,250,T(`${cs(AL,'\\sum')}\\;\\longrightarrow\\;${cs(AL,'\\int')}`,970,200,{size:46})+label('正式に 書くと？',970,300,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.15,.35),C.hi);
  return s;
 },
 [K+'recallwork']:(p)=>{
  let s=label('仕事・中級 3/3',80,60,{size:24,color:C.dim});
  // a short curved path, one step with the force and its shadow on the step
  const pts=Array.from({length:60},(_,k)=>{const u=k/59;return [110+440*u,430-160*u*u-40*Math.sin(u*3)];});
  s+=draw(pts,1,{color:C.dim,w:5});
  const k=34,[x,y]=pts[k],[x2,y2]=pts[k+4];const d=Math.hypot(x2-x,y2-y),ux=(x2-x)/d,uy=(y2-y)/d;
  s+=fade(seg(p,.1,.3),arrow(x,y,x+ux*90,y+uy*90,{color:DC,w:6,head:16})+T(cs(DC,'d\\mathbf{r}'),x+ux*90+8,y+uy*90+42,{size:30,anchor:'start'}));
  const fx=40,fy=-120,a=fx*ux+fy*uy;
  s+=fade(seg(p,.25,.45),arrow(x,y,x+fx,y+fy,{color:FC,w:6,head:17})+T(vF,x+fx-12,y+fy-8,{size:32,anchor:'end'}));
  s+=fade(seg(p,.4,.6),line(x,y,x+a*ux,y+a*uy,{color:AL,w:13,cap:'butt',opacity:.5})+arrow(x,y,x+a*ux,y+a*uy,{color:AL,w:5,head:14})+line(x+fx,y+fy,x+a*ux,y+a*uy,{color:AL,w:2,dash:'6 6'}));
  s+=card(680,110,470,270,T(`W=\\int ${vF}\\cdot ${cs(DC,'d\\mathbf{r}')}`,915,200,{size:56})+label('一歩ごとに 内積（影）を 足す',915,280,{size:26,color:AL,anchor:'middle'})
   +fade(seg(p,.65,.8),label('ここでは 結果だけ',915,340,{size:26,color:C.dim,anchor:'middle'})),seg(p,.5,.65),C.faint);
  return s;
 },
 [K+'recallintro']:(p)=>{
  let s=label('初級 20',80,60,{size:24,color:C.dim});
  s+=ov({chords:1,F:.8,vals:seg(p,.2,.5),valsText:VALS,curveOp:.5});
  s+=card(790,150,370,150,T(`3+2+0-2=${cs(WC,'3\\,\\mathrm{J}')}`,975,240,{size:42}),seg(p,.5,.7),C.faint);
  return s;
 },
 [K+'plan']:(p)=>{
  let s=T(`3+2+0-2`,380,110,{size:56});
  s+=arrow(380,150,380,205,{color:C.hi,w:4,head:14,g:seg(p,.1,.3)});
  s+=fade(seg(p,.2,.45),T(`${SIG('i=1','4')}\\,(\\cdots)`,380,300,{size:64}));
  s+=fade(seg(p,.3,.5),label('今回：番号の付いた Σ の式 1本',600,310,{size:30,color:C.hi,weight:700}));
  s+=fade(seg(p,.6,.8),T(cs(C.dim,'\\int'),380,450,{size:50})+label('次回：∫ への 行き先',600,460,{size:30,color:C.dim,weight:700}));
  return s;
 },
 // ===== S2 掛ける力が決まらない =====
 [K+'one']:(p)=>{
  let s=straightStep(p,{gF:seg(p,.3,.5),gDr:seg(p,.05,.25)});
  s+=card(700,120,450,200,label('力が 一定・道が まっすぐ',925,180,{size:26,color:C.ink,anchor:'middle'})+T(`\\Delta W=${vF}\\cdot${dri('')}`,925,260,{size:50}),seg(p,.5,.7),C.faint);
  return s;
 },
 [K+'split']:(p)=>{
  let s=straightStep(p,{gA:seg(p,.1,.35),gP:seg(p,.3,.5)});
  s+=fade(seg(p,.15,.35),label('沿う部分',140,368,{size:24,color:AL,anchor:'end',weight:700}));
  s+=fade(seg(p,.35,.5),label('直角な部分',300,250,{size:24,color:PP,weight:700}));
  s+=card(700,120,450,240,T(`\\Delta W=${vF}\\cdot${dri('')}`,925,190,{size:46})+fade(seg(p,.55,.7),label('＝ 沿う部分 × 一歩の長さ',925,275,{size:30,color:AL,anchor:'middle',weight:700})),1,C.faint);
  return s;
 },
 [K+'perp']:(p)=>{
  let s=move(-40,-20,straightStep(p,{gA:1,gP:1}));
  s+=fade(seg(p,.1,.25),cross(252,290,15,PP));
  s+=card(700,90,450,150,label('直角な部分',925,145,{size:28,color:PP,anchor:'middle',weight:700})+label('→ 仕事に 入らない',925,200,{size:28,color:C.ink,anchor:'middle'}),seg(p,.1,.25),PP);
  s+=card(700,260,450,200,move(655,-60,scaleAt0(straightStep(1,{gA:1,gP:.6,neg:true}))),seg(p,.5,.65),NG);
  s+=fade(seg(p,.55,.7),label('沿う部分が 逆向き → 仕事は 負',925,445,{size:24,color:NG,anchor:'middle',weight:700}));
  return s;
 },
 [K+'vary']:(p)=>{
  const V=view(O1.ox,O1.oy,O1.sc);
  let s=ov({})+vfield(V,{g:seg(p,.0,.45)})+tangents(V,seg(p,.5,.95));
  s+=fade(seg(p,.05,.25),label('力の 大きさも 向きも 場所ごとに 違う',80,60,{size:26,color:FC}));
  s+=fade(seg(p,.55,.75),label('進む向き（白）も 変わる',80,100,{size:26,color:C.ink}));
  return s;
 },
 [K+'which']:(p)=>{
  const V=view(O1.ox,O1.oy,O1.sc);
  let s=ov({})+vfield(V,{g:1});
  s+=card(780,110,380,250,T(`?`,970,185,{size:60,color:C.hi})+label('どこの 力を',970,250,{size:30,color:FC,anchor:'middle',weight:700})+label('どの 移動に 掛ける？',970,305,{size:30,color:C.ink,anchor:'middle'}),seg(p,.1,.3),C.hi);
  s+=fade(seg(p,.35,.5),label('掛ける 𝐅 が 1つに 決まらない',80,60,{size:26,color:C.hi,weight:700}));
  return s;
 },
 [K+'wrongstart']:(p)=>{
  const V=view(O1.ox,O1.oy,O1.sc);
  let s=ov({curveOp:.6})+vfield(V,{g:1});
  const a=V(VERT[0]),b=V(VERT[4]);
  s+=fade(seg(p,.05,.25),arrow(a[0],a[1],a[0]+60,a[1]-80,{color:C.hi,w:6,head:18})+label('始点の力',a[0]+40,a[1]-100,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.2,.4),arrow(a[0],a[1],b[0],b[1],{color:C.hi,w:4,head:15})+label('始点 → 終点',mix(a[0],b[0],.62)+20,mix(a[1],b[1],.62)+30,{size:24,color:C.hi,weight:700}));
  s+=card(780,120,380,200,label('途中で 力が',970,185,{size:28,color:C.ink,anchor:'middle'})+label('変わった分が 入らない',970,240,{size:28,color:NG,anchor:'middle',weight:700}),seg(p,.5,.65),NG);
  s+=fade(seg(p,.55,.7),cross(a[0]+230,a[1]-120,16));
  return s;
 },
 // ===== S3 曲線を N 本に分ける =====
 [K+'name']:(p)=>{
  const V=view(O1.ox,O1.oy,O1.sc);
  let s=ov({chords:seg(p,.45,.8),chordCol:C.hi,curveOp:.8});
  s+=fade(seg(p,.05,.25),T('C',V(curveAt(2.1))[0]+48,V(curveAt(2.1))[1]+20,{size:48,color:C.ink}));
  s+=fade(seg(p,.45,.7),[1,2,3].map(k=>dot(...V(VERT[k]),7,C.hi)).join(''));
  s+=card(800,120,360,190,label('曲線 C を',980,180,{size:28,color:C.ink,anchor:'middle'})+label('N 本の 短い直線に',980,235,{size:30,color:C.hi,anchor:'middle',weight:700})+label('（図は N ＝ 4）',980,280,{size:22,color:C.dim,anchor:'middle'}),seg(p,.55,.75),C.hi);
  return s;
 },
 [K+'straight']:(p)=>{
  const V=view(O1.ox,O1.oy,O1.sc);
  let s=ov({chords:1,chordCol:C.hi,curveOp:.7});
  const [cx,cy]=mid(V,1);
  s+=fade(seg(p,.05,.25),ring(cx,cy,58,{color:C.hi,w:3})+line(cx+42,cy-40,770,200,{color:C.hi,w:2,opacity:.6}));
  s+=fade(seg(p,.2,.4),ring(930,250,160,{color:C.hi,w:3,fill:'#0f1830'})+line(800,325,1060,175,{color:C.ink,w:5})
   +[[850,296],[930,250],[1010,204]].map(([x,y])=>arrow(x,y,x,y-70,{color:FC,w:4,head:12})).join(''));
  s+=fade(seg(p,.45,.6),label('道 ≈ まっすぐ、力 ≈ 一定',930,465,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('積分の回の 短冊と 同じ考え',80,60,{size:24,color:C.dim}));
  return s;
 },
 [K+'two']:(p)=>{
  let s=step(1,330,310,{L:170,S:62,gDr:seg(p,.45,.65),gF:seg(p,.15,.35),labF:Fri(),labSize:32,drText:false});
  s+=fade(seg(p,.05,.2),ring(330,310,13,{color:SCOL[1],w:3}));
  s+=fade(seg(p,.1,.3),T(ri(),310,300,{size:36,anchor:'end'}));
  s+=fade(seg(p,.5,.7),T(dri(),505,330,{size:36,anchor:'start'}));
  s+=card(700,100,460,300,label('各区間で 決める 2つ',930,150,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.1,.3),T(ri(),760,225,{size:40,anchor:'start'})+label('代表点：力を 読む場所',830,235,{size:26,color:C.ink}))
   +fade(seg(p,.45,.65),T(dri(),760,320,{size:40,anchor:'start'})+label('小移動：進む 矢印',850,330,{size:26,color:DC})),seg(p,0,.12),C.faint);
  return s;
 },
 [K+'index']:(p)=>{
  let s=ov({chords:1,idx:seg(p,.05,.4),rep:seg(p,.55,.8),curveOp:.5});
  s+=card(800,120,360,210,T('i',880,210,{size:56,color:C.hi})+label('＝ 区間の 番号',920,212,{size:28,color:C.hi})
   +fade(seg(p,.55,.75),label('代表点 ＝ 各区間の 真ん中',980,285,{size:26,color:C.ink,anchor:'middle'})),seg(p,0,.15),C.faint);
  return s;
 },
 [K+'pos']:(p)=>{
  let s=ov({chords:seg(p,.5,.75),idx:1,rep:1,pos:seg(p,.05,.4),curveOp:.5});
  s+=card(770,110,400,260,fade(seg(p,.1,.3),T(ri(),800,180,{size:42,anchor:'start'})+label('原点 → 代表点',900,190,{size:24,color:C.ink})+label('位置の 矢印（白）',900,225,{size:22,color:C.dim}))
   +fade(seg(p,.5,.7),T(dri('i',C.ink),800,300,{size:42,anchor:'start'})+label('区間の 始め → 終わり',900,300,{size:24,color:C.ink})+label('移動の 矢印（色）',900,335,{size:22,color:C.dim})),seg(p,0,.12),C.faint);
  return s;
 },
 [K+'notmix']:(p)=>{
  let s=card(80,90,480,330,T(ri(),320,190,{size:70})+label('どこに いるか',320,280,{size:34,color:C.ink,anchor:'middle',weight:700})+label('位置（原点から）',320,340,{size:26,color:C.dim,anchor:'middle'}),seg(p,0,.15),C.ink);
  s+=card(640,90,480,330,T(dri(),880,190,{size:70})+label('どれだけ 動いたか',880,280,{size:34,color:DC,anchor:'middle',weight:700})+label('移動（区間の 始め → 終わり）',880,340,{size:26,color:C.dim,anchor:'middle'}),seg(p,.25,.4),DC);
  s+=fade(seg(p,.6,.75),label('同じ r の字でも、役割が違う',600,480,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'Fri']:(p)=>{
  let s=ov({chords:1,rep:1,F:seg(p,.3,.6),curveOp:.5,idx:.6});
  s+=card(790,110,370,250,T(Fri(),975,200,{size:60})+fade(seg(p,.2,.4),line(960,235,1045,235,{color:C.hi,w:3})+label('かっこの中 ＝',975,285,{size:26,color:C.ink,anchor:'middle'})+label('力を どこで 読むか',975,325,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15),C.faint);
  return s;
 },
 [K+'piece']:(p)=>{
  const f=`\\Delta W_i${cs(C.hi,'\\approx')}${Fri()}\\cdot${dri()}`;
  let s=T(f,600,170,{size:80});
  s+=move(8,0,hl(f,'\\Delta W_i',cs(C.hi,'\\approx'),600,80,112,90,seg(p,.3,.45)));
  s+=fade(seg(p,.4,.6),label('≈ ：区間の中で 力を 一定、道を まっすぐと みなした 印',600,330,{size:28,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.05,.2),label('1区間の 仕事',600,60,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },

 [K+'sum']:(p)=>{
  let s=fade(seg(p,.05,.3),T(`\\Delta W_1+\\Delta W_2+\\cdots+\\Delta W_N`,600,130,{size:50}));
  s+=arrow(600,175,600,235,{color:C.hi,w:4,head:14,g:seg(p,.35,.5)});
  s+=fade(seg(p,.45,.7),T(WNsum(),600,340,{size:72}));
  return s;
 },
 [K+'read1']:(p)=>{
  const f=WNsum();let s=T(f,600,210,{size:84});
  const [l,w]=hb(f,'W_N=',SIG(),600,84);
  s+=fade(seg(p,.05,.25),highlight(l+14,236,w-4,48,1));
  s+=fade(seg(p,.1,.3),label('i ＝ 1 から 始める',l+w/2,330,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),highlight(l+w/2-4,70,52,50,1));
  s+=fade(seg(p,.5,.65),label('N 番まで ＝ 足した 区間の 総数',l+w+30,90,{size:28,color:C.hi,anchor:'start',weight:700}));
  return s;
 },

 [K+'read2']:(p)=>{
  const f=WNsum();let s=T(f,600,210,{size:84});
  const part=`${Fri()}\\cdot${dri()}`;const [l,w]=hb(f,`W_N=${SIG()}`,part,600,84);
  s+=fade(seg(p,.05,.2),highlight(l-8,118,w+16,112,1,FC));
  s+=fade(seg(p,.1,.3),label('1区間の 仕事',l+w/2,300,{size:28,color:FC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.6),label('i に 1, 2, …, N を 順に入れ、できた項を 全部足せ',600,420,{size:30,color:C.ink,anchor:'middle'}));
  return s;
 },

 [K+'expand']:(p)=>{
  let s=T(`W_4=${SIG('i=1','4')}${Fri()}\\cdot${dri()}`,600,110,{size:54});
  const terms=[1,2,3,4].map(i=>(i===1?'=':'+')+cs(SCOL[i-1],`\\mathbf{F}(\\mathbf{r}_{${i}})\\cdot\\Delta\\mathbf{r}_{${i}}`));
  const ws=terms.map(t=>texWidth(t,42,false)+14),tot=ws.reduce((a,b)=>a+b,0);let x=600-tot/2;
  terms.forEach((t,k)=>{s+=fade(seg(p,.15+k*.13,.3+k*.13),T(t,x,265,{size:42,anchor:'start'}));x+=ws[k];});
  s+=fade(seg(p,.7,.85),label('項の色 ＝ 区間の色',600,420,{size:28,color:C.ink,anchor:'middle'})+SCOL.map((c,i)=>rect(420+i*95,450,70,14,{fill:c,fo:.8,rx:3})).join(''));
  return s;
 },

 [K+'range']:(p)=>{
  let s=card(80,90,480,290,T(`${cs(AL,'\\sum')}${Fri()}\\cdot${dri()}`,320,200,{size:52})+label('どこから どこまで？',320,300,{size:30,color:NG,anchor:'middle',weight:700}),seg(p,0,.15),NG);
  s+=card(640,90,480,290,T(`${SIG()}${Fri()}\\cdot${dri()}`,880,200,{size:52})+label('1 から N まで',880,300,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'approx']:(p)=>{
  const f=WNsum();let s=T(f,600,130,{size:64});
  const [l,w]=hb(f,'','W_N',600,64);
  s+=fade(seg(p,.05,.2),highlight(l,70,w+16,82,1));
  s+=fade(seg(p,.1,.3),label('N 区間で 数えた 仕事',l+w/2,245,{size:26,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.45,.65),T(`W${cs(C.hi,'\\approx')}W_N`,600,360,{size:72}));
  s+=fade(seg(p,.6,.8),label('道全体の 仕事',500,450,{size:24,color:C.dim,anchor:'middle'})+label('N 区間の 和',700,450,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },

 [K+'back']:(p)=>{
  let s=ov({chords:1,F:seg(p,.4,.7),curveOp:.5});
  const V=view(O1.ox,O1.oy,O1.sc);const [x,y]=V(curveAt(.35));
  s+=charge(x,y,{g:seg(p,.05,.2)});
  s+=card(790,110,370,240,T(`${vF}=q\\,${cs(EC,'\\mathbf{E}')}`,975,190,{size:56})+label('q ＝ +1 C なら',975,260,{size:26,color:C.ink,anchor:'middle'})+label('電場と 同じ向き・同じ数の N',975,305,{size:26,color:FC,anchor:'middle',weight:700}),seg(p,.25,.45),C.faint);
  return s;
 },
 [K+'lab']:(p)=>{
  return ov({chords:1,F:.5,idx:seg(p,.05,.3),rep:seg(p,.3,.55),drl:seg(p,.55,.8),curveOp:.4})
   +card(830,120,330,190,label('番号 i ごとに',995,180,{size:26,color:C.ink,anchor:'middle'})+label('同じ色',995,235,{size:30,color:C.hi,anchor:'middle',weight:700})+SCOL.map((c,i)=>rect(900+i*50,262,36,12,{fill:c,fo:.85,rx:3})).join(''),seg(p,.3,.5),C.faint);
 },
 [K+'t1']:(p)=>tiles({g:[seg(p,0,.15),seg(p,.4,.55),0,0],gA:1,gP:1,vals:[seg(p,.15,.3),seg(p,.6,.75),0,0]}),
 [K+'t3']:(p)=>tiles({g:[1,1,seg(p,0,.15),seg(p,.45,.6)],vals:[1,1,seg(p,.2,.35),seg(p,.65,.8)],hl:[2,3],dim:seg(p,0,.1)*.5}),
 [K+'sum4']:(p)=>{
  let s=tiles({h:230,vals:[1,1,1,1],gA:1,gP:.5});
  s+=fade(seg(p,.2,.4),T(`W_4=${cs(WC,'3')}+${cs(WC,'2')}+0${cs(NG,'-2')}=${cs(WC,'3\\,\\mathrm{J}')}`,600,478,{size:44}));
  return move(0,-24,s);
 },
 [K+'wrong']:(p)=>{
  let s=move(0,-24,tiles({h:230,vals:[1,1,1,1],gA:1,gP:.5}));
  s+=card(250,382,700,125,T(`3+2+0+2=7\\,\\mathrm{J}`,600,425,{size:40}),seg(p,.02,.15),NG);
  s+=fade(seg(p,.2,.35),line(440,422,760,422,{color:NG,w:5})+cross(800,415,14));
  s+=fade(seg(p,.45,.6),label('i＝4 で 押し戻された分を 落とす',600,488,{size:26,color:NG,anchor:'middle',weight:700}));
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=move(0,-24,tiles({h:230,vals:[1,1,1,1],gA:1,gP:.5,hl:[1,2,3],dim:seg(p,.1,.3)}));
  s+=card(300,390,600,115,T(`${SIG('i=2','4')}${Fri()}\\cdot${dri()}=\\;?`,600,450,{size:44}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'ans']:(p)=>{
  let s=move(0,-24,tiles({h:230,vals:[1,1,1,1],gA:1,gP:.5,hl:[1,2,3],dim:1}));
  s+=card(300,390,600,115,T(`${SIG('i=2','4')}\\cdots=${cs(WC,'2')}+0${cs(NG,'-2')}=${cs(WC,'0\\,\\mathrm{J}')}`,600,450,{size:44}),1,C.hi);
  s+=fade(seg(p,.45,.6),label('i＝1 は 範囲の外',160,440,{size:24,color:SCOL[0],anchor:'middle',weight:700}));
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'summary']:(p)=>{
  let s=ov({ox:130,oy:440,sc:100,Fsc:16,chords:1,F:1,rep:1,idx:1,curveOp:.4,org:[70,490]});
  s+=card(600,110,570,230,T(WNsum(),885,200,{size:50})+label('曲線 C を N 本に 分けて 足す',885,285,{size:26,color:C.ink,anchor:'middle'}),seg(p,.1,.3),C.hi);
  return s;
 },
 [K+'notlen']:(p)=>{
  let s=card(80,110,480,260,label('道の長さ の和',320,185,{size:32,color:C.dim,anchor:'middle',weight:700})+label('1＋2＋1＋1 ＝ 5 m',320,250,{size:28,color:C.dim,anchor:'middle'}),seg(p,0,.15),C.faint);
  s+=fade(seg(p,.1,.25),cross(320,320,18));
  s+=card(640,110,480,260,label('沿う部分 × 長さ の和',880,185,{size:32,color:AL,anchor:'middle',weight:700})+T(`${cs(WC,'3')}+${cs(WC,'2')}+0${cs(NG,'-2')}`,880,260,{size:42})+label('0 の項・負の項 も 入る',880,325,{size:26,color:C.ink,anchor:'middle'}),seg(p,.3,.45),AL);
  return s;
 },
 [K+'limit']:(p)=>{
  const V=view(O1.ox,O1.oy,O1.sc);
  let s=ov({chords:1,chordCol:C.hi,curveOp:1});
  const [cx,cy]=V(curveAt(1.5)),[mx,my]=mid(V,1);
  s+=fade(seg(p,.15,.35),ring((cx+mx)/2,(cy+my)/2,48,{color:NG,w:3})+label('曲線と 折れ線の ずれ',(cx+mx)/2+70,(cy+my)/2+80,{size:24,color:NG,weight:700}));
  s+=card(790,110,370,200,T(`W${cs(C.hi,'\\approx')}W_4=3\\,\\mathrm{J}`,975,195,{size:46})+label('近似の値',975,260,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.6),C.hi);
  return s;
 },
 [K+'next']:(p)=>{
  let s=card(80,70,1040,190,T(`W_N=${SIG()}${Fri()}\\cdot${dri()}\\;\\xrightarrow{\\;N\\to\\infty\\;}\\;?`,600,172,{size:52}),seg(p,0,.2),C.hi);
  return s;
 },
 [K+'next2']:(p)=>{
  let s=card(80,70,1040,190,T(`W_N=${SIG()}${Fri()}\\cdot${dri()}\\;\\xrightarrow{\\;N\\to\\infty\\;}\\;?`,600,172,{size:52}),1,C.hi);
  s+=card(80,290,500,170,label('道を 逆に たどると？',330,390,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.3),C.hi);
  s+=card(620,290,500,170,label('別の 道を 選ぶと？',870,390,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.35,.55),C.hi);
  return s;
 },
};
// scale helper used by 'perp' for the small reverse-case picture (keeps the call site short)
function scaleAt0(svg){return `<g transform="translate(150 360) scale(0.75) translate(-150 -360)">${svg}</g>`;}

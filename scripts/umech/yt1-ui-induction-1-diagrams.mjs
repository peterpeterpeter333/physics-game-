// YouTube シリーズ「電磁誘導・初級 1/2」(ys-ui-induction-1) — 図。Stage 1200×515.
// 色：磁場 𝐁 橙(C.E)、法線 桃(C.p)、法線方向の成分・磁束の値 黄(C.hi)、負の値 赤(C.a)、時間 t 金(C.t)、電流 I 青。
// 真横から見た図：面は線に見える。𝐁 は右向き。法線の角 nDeg は右向き＝0°、反時計回りに測る（＝θ、𝐁 と法線の間の角）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,poly} from './anim.mjs';

const K='ui-induction-1:';
const BC=C.E,NC=C.p,HI=C.hi,NEG=C.a,CI='#6f9dff',CE=C.x,SURF='#c9d6ee';
const rad=d=>d*Math.PI/180;
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const vB=cs(BC,'\\mathbf{B}'),vn=cs(NC,'\\mathbf{n}'),vE=cs(CE,'\\mathbf{E}');
const Bp=cs(HI,'B_{\\perp}');
const n2=v=>Number(v.toFixed(2));

// ---- symbols ---------------------------------------------------------------------------------------
function outSym(x,y,r=20,color=BC,g=1){return fade(g,ring(x,y,r,{color,w:4,fill:'#101a30'})+dot(x,y,r*.3,color));}
function head(x,y,dx,dy,{color=CI,L=18}={}){
 const m=Math.hypot(dx,dy)||1,ux=dx/m,uy=dy/m,bx=x-L*ux,by=y-L*uy;
 return `<polygon points="${n2(x)},${n2(y)} ${n2(bx-L*.5*uy)},${n2(by+L*.5*ux)} ${n2(bx+L*.5*uy)},${n2(by-L*.5*ux)}" fill="${color}"/>`;
}
// ---- uniform field rows (screen), B to the right ----------------------------------------------------
function fieldRows(x0,x1,ys,{g=1,len=62,gap=115,opacity=1,w=4}={}){
 let s='';for(const y of ys)for(let x=x0;x+len<=x1;x+=gap)s+=arrow(x,y,x+len,y,{color:BC,w,head:14});
 return fade(g*opacity,s);
}
const SV={cx:330,cy:275};
function sideField(g=1,opacity=1){return fieldRows(70,640,[115,175,235,295,355,415],{g,opacity});}
function tileSide(cx,cy,nDeg,{L=190,g=1,color=SURF}={}){
 const tx=-Math.sin(rad(nDeg)),ty=Math.cos(rad(nDeg));
 return fade(g,line(cx-tx*L/2,cy+ty*L/2,cx+tx*L/2,cy-ty*L/2,{color,w:9}));
}
function normalArrow(cx,cy,nDeg,{len=120,g=1,text='法線'}={}){
 const X=cx+len*Math.cos(rad(nDeg)),Y=cy-len*Math.sin(rad(nDeg)),right=Math.cos(rad(nDeg))>=-.01;
 return fade(g,arrow(cx,cy,X,Y,{color:NC,w:6,head:18})+(text?label(text,X+(right?12:-12),Y-12,{size:24,color:NC,anchor:right?'start':'end',weight:700}):''));
}
function bLabel(x=70,y=62,val='0.2'){return T(`${vB}\\ \\text{右向き}\\ ${val}\\,\\mathrm{T}`,x,y,{size:30,anchor:'start'});}
function arcPts(cx,cy,r,a0,a1,n=24){return Array.from({length:n+1},(_,i)=>{const a=rad(a0+(a1-a0)*i/n);return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});}
// B arrow from the centre + its shadow on the normal
function shadow(cx,cy,th,{U=48,Bv=3,g1=1,g2=1,txt=''}={}){
 const ex=cx+Bv*U,ey=cy;let s='';
 const par=Bv*U*Math.cos(rad(th)),px=cx+par*Math.cos(rad(th)),py=cy-par*Math.sin(rad(th));
 s+=fade(g1,line(ex,ey,px,py,{color:HI,w:2,dash:'6 6'}));
 s+=fade(g2,line(cx,cy,px,py,{color:par<-1?NEG:HI,w:par<-1?16:10,cap:'butt'})+(txt?label(txt,px-24,py-8,{size:28,color:HI,anchor:'end',weight:700}):''));
 s+=arrow(cx,cy,ex,ey,{color:BC,w:7,head:20});
 return s;
}

// ---- 3D tile (square in the y–z plane, oblique projection) -----------------------------------------
const TL={ox:250,oy:380,s:150,k:.6,a:rad(38)};
function P3([x,y,z],o=TL){return [o.ox+o.s*(x+o.k*z*Math.cos(o.a)),o.oy-o.s*(y+o.k*z*Math.sin(o.a))];}
const Q=(x,y,z)=>P3([x,y,z]);
function tile3d({g=1,fieldG=1,nR=0,areaG=1}={}){
 const e=Math.SQRT1_2*1.4,x0=1.1;// drawn side (0.5 m² → side 0.71 m; drawn a little larger)
 const pts=[[x0,0,0],[x0,e,0],[x0,e,e],[x0,0,e]].map(p=>Q(...p));
 let s='';
 const rows=[[.2,.25],[.5,.25],[.8,.25],[.2,.75],[.5,.75],[.8,.75]];
 for(const [y,z] of rows){const [a,b]=Q(-.25,y,z),[A,B]=Q(x0,y,z);s+=fade(fieldG,line(a,b,A,B,{color:BC,w:3,opacity:.8}));}
 s+=fade(g,poly(pts,{fill:SURF,fo:.16,stroke:SURF,sw:3}));
 for(const [y,z] of rows){const [a,b]=Q(x0,y,z),[A,B]=Q(x0+.9,y,z);s+=fade(fieldG,arrow(a,b,A,B,{color:BC,w:4,head:14})+dot(a,b,4,BC));}
 s+=fade(areaG*g,label('面積 0.5 m²',Q(x0,e,e)[0]+8,Q(x0,e,e)[1]-14,{size:28,color:SURF,weight:700}));
 const [cx,cy]=Q(x0,e/2,e/2);
 if(nR)s+=fade(nR,arrow(cx,cy,Q(x0+1.05,e/2,e/2)[0],cy,{color:NC,w:6,head:18})+label('法線',Q(x0+1.05,e/2,e/2)[0]+10,cy+36,{size:26,color:NC,weight:700}));
 return s;
}

// ---- loop (face-on) and coil side view ------------------------------------------------------------
function loopFace(cx,cy,R,{g=1,ccw=1,heads=true}={}){
 let s=ring(cx,cy,R,{color:CI,w:6});
 if(heads)for(const d of [0,90,180,270]){const t=rad(d),x=cx+R*Math.cos(t),y=cy-R*Math.sin(t);s+=head(x,y,-Math.sin(t)*ccw,-Math.cos(t)*ccw,{color:CI,L:22});}
 return fade(g,s);
}
// coil seen from the side (edge-on ellipse) with a bar magnet below; u = 0 far … 1 near
const CO={x:330,y:190,rx:130,ry:30};
function coilSide(u,{g=1,showPhi=true}={}){
 let s='';
 const my=mix(470,300,u);// top of the magnet (N)
 // field arrows upward through the coil; more and longer as the magnet approaches
 const k=mix(.35,1,u),xs=[-90,-45,0,45,90];
 // back half of the ellipse
 s+=draw(arcPts(CO.x,CO.y,CO.rx,0,180).map(([x,y])=>[x,CO.y-(CO.y-y)*CO.ry/CO.rx]),1,{color:CI,w:5,opacity:.6});
 xs.forEach((dx,i)=>{const on=i===0||i===4?seg(u,.4,.8):1;const L=mix(50,120,u);
  s+=fade(on*k,arrow(CO.x+dx,my-14,CO.x+dx*(1-.15*u),my-14-L-(my-CO.y)*.55,{color:BC,w:4,head:14}));});
 // front half
 s+=draw(arcPts(CO.x,CO.y,CO.rx,180,360).map(([x,y])=>[x,CO.y+(y-CO.y)*CO.ry/CO.rx]),1,{color:CI,w:6});
 // magnet
 s+=rect(CO.x-34,my,68,60,{fill:'#ff6b6b',fo:.85,stroke:'#ff6b6b',rx:4})+label('N',CO.x,my+42,{size:30,color:C.bg,anchor:'middle',weight:700});
 s+=rect(CO.x-34,my+60,68,60,{fill:'#6f9dff',fo:.85,stroke:'#6f9dff',rx:4})+label('S',CO.x,my+102,{size:30,color:C.bg,anchor:'middle',weight:700});
 s+=label('コイル（輪）',CO.x-CO.rx-12,CO.y+8,{size:24,color:CI,anchor:'end'});
 if(showPhi){const w=mix(60,240,u);s+=label('磁束 Φ',640,120,{size:26,color:HI,anchor:'middle'})+rect(612,440-w,56,w,{fill:HI,fo:.55,rx:6})+line(596,440,684,440,{color:C.dim,w:2});}
 return fade(g,s);
}

// ---- spinning tile + Φ–t graph ----------------------------------------------------------------------
const GA={x:730,y:260,w:380,h:170};// graph origin at (x,y) = (t=0, Φ=0); h = 0.1 Wb
const GX=t=>GA.x+GA.w*t/6.4,GY=f=>GA.y-GA.h*f/.1;
function graphAxes(g=1){
 let s=arrow(GA.x-8,GA.y,GA.x+GA.w+26,GA.y,{color:C.dim,w:2.5,head:14})+arrow(GA.x,GA.y+GA.h+30,GA.x,GA.y-GA.h-34,{color:C.dim,w:2.5,head:14});
 for(const t of [2,3,6]){s+=line(GX(t),GA.y-6,GX(t),GA.y+6,{color:C.dim})+label(String(t),GX(t)+(t===3?-12:0),GA.y+30,{size:21,color:C.t,anchor:'middle'});}
 for(const [f,txt] of [[.1,'0.1'],[.05,'0.05'],[-.1,'−0.1']]){s+=line(GA.x-6,GY(f),GA.x+6,GY(f),{color:C.dim})+line(GA.x,GY(f),GA.x+GA.w,GY(f),{color:C.grid,w:1.5})+label(txt,GA.x-12,GY(f)+8,{size:21,color:HI,anchor:'end'});}
 s+=label('t［s］',GA.x+GA.w+30,GA.y+36,{size:22,color:C.t,anchor:'middle'})+label('Φ［Wb］',GA.x,GA.y-GA.h-46,{size:22,color:HI,anchor:'middle'});
 return fade(g,s);
}
const phiAt=t=>.1*Math.cos(rad(30*t));
function spinScene(t,{graphG=1,curveG=1,shadowG=1}={}){
 const th=30*t,cx=SV.cx-20,cy=SV.cy;
 let s=label('真横から見た図',60,62,{size:24,color:C.dim});
 s+=sideField(1,.35)+tileSide(cx,cy,th,{L:210});
 s+=fade(shadowG,shadow(cx,cy,th,{U:44}));
 s+=normalArrow(cx,cy,th,{len:115});
 // angle arc between B (0°) and the normal
 if(th>3)s+=draw(arcPts(cx,cy,40,0,th,Math.max(4,Math.round(th/6))),1,{color:C.ink,w:3})+label('θ',cx+40*Math.cos(rad(th/2))+10,cy-40*Math.sin(rad(th/2))-6,{size:26,color:C.ink});
 s+=graphAxes(graphG);
 if(curveG>0&&t>0)s+=fade(curveG,draw(Array.from({length:61},(_,i)=>{const u=t*i/60;return [GX(u),GY(phiAt(u))];}),1,{color:HI,w:4}));
 s+=fade(graphG,dot(GX(t),GY(phiAt(t)),8,phiAt(t)<-.001?NEG:HI));
 const f=phiAt(t),ft=Math.abs(f)<.0005?'0':(f<0?'−':'')+Number(Math.abs(f).toFixed(3));
 s+=fade(graphG,label(`θ ＝ ${Math.round(th)}°`,760,480,{size:28,color:C.ink})+label(`Φ ＝ ${ft} Wb`,960,480,{size:28,color:f<-.001?NEG:HI,weight:700}));
 return s;
}

export const ytUiInduction1Diagrams={
 // ===== S1 前回の問い =====
 [K+'intro']:(p)=>{
  let s=label('前回の 最後の問い',60,62,{size:24,color:C.dim});
  s+=fieldRows(60,640,[140,210,280,350,420],{g:seg(p,.02,.25),gap:120});
  s+=fade(seg(p,.15,.35),line(330,120,330,440,{color:SURF,w:9}));
  s+=card(700,120,460,260,label('面を 貫く 磁場の量は',930,195,{size:32,color:C.ink,anchor:'middle'})
   +label('どう 数える？',930,275,{size:44,color:HI,anchor:'middle',weight:700}),seg(p,.3,.5),HI);
  return s;
 },
 [K+'recap']:(p)=>{
  let s=label('前回：輪の中心で 磁場の向きが そろう',60,62,{size:24,color:C.dim});
  s+=loopFace(300,280,150,{g:seg(p,0,.2)});
  s+=fade(seg(p,.15,.3),label('電流 I',470,150,{size:26,color:CI,weight:700}));
  s+=outSym(300,280,mix(12,36,seg(p,.25,.55)),BC,seg(p,.2,.35));
  s+=fade(seg(p,.35,.5),label('手前向き（⊙）',300,370,{size:24,color:BC,anchor:'middle'}));
  s+=card(720,150,440,200,T(`${vB}`,940,225,{size:52})+label('単位：テスラ T',940,305,{size:32,color:BC,anchor:'middle',weight:700}),seg(p,.6,.75),BC);
  return s;
 },
 [K+'plan']:(p)=>{
  let s=card(70,120,460,280,label('ガウスの法則の回',300,170,{size:26,color:C.dim,anchor:'middle'})
   +label('電気束',300,225,{size:32,color:CE,anchor:'middle',weight:700})
   +arrow(220,300,380,300,{color:CE,w:6})+T(vE,400,310,{size:36,anchor:'start'})
   +T(`\\Phi=E_{\\perp}A`,300,370,{size:38,color:CE}),seg(p,.02,.2));
  s+=fade(seg(p,.4,.55),arrow(555,260,645,260,{color:C.dim,w:5})+label('取り替える',600,225,{size:22,color:C.dim,anchor:'middle'}));
  s+=card(670,120,460,280,label('今回',900,170,{size:26,color:C.dim,anchor:'middle'})
   +label('磁束',900,225,{size:32,color:BC,anchor:'middle',weight:700})
   +arrow(820,300,980,300,{color:BC,w:6})+T(vB,1000,310,{size:36,anchor:'start'})
   +T(`\\Phi=${Bp}A`,900,370,{size:38}),seg(p,.5,.7),BC);
  return s;
 },
 // ===== S2 まっすぐ貫く =====
 [K+'tile3d']:(p)=>{
  let s=tile3d({g:seg(p,.3,.45),fieldG:seg(p,.05,.25),areaG:seg(p,.4,.55)});
  s+=fade(seg(p,.05,.2),bLabel(60,62));
  s+=card(760,300,400,150,label('一様 ＝ どこでも',960,355,{size:28,color:C.ink,anchor:'middle'})+label('同じ向き・同じ強さ',960,405,{size:30,color:BC,anchor:'middle',weight:700}),seg(p,.1,.25));
  return s;
 },
 [K+'normal']:(p)=>{
  let s=tile3d({nR:seg(p,.2,.4)})+bLabel(60,62);
  s+=card(760,110,400,240,label('面に垂直な 矢印',960,165,{size:28,color:C.ink,anchor:'middle'})+label('＝ 法線',960,220,{size:34,color:NC,anchor:'middle',weight:700})
   +fade(seg(p,.6,.75),label('正の向き：約束で 右向き',960,300,{size:26,color:NC,anchor:'middle'})),seg(p,.3,.45),NC);
  return s;
 },
 [K+'perp']:(p)=>{
  let s=label('真横から見た図（面は 線に見える）',60,62,{size:24,color:C.dim});
  s+=sideField(1,.9)+tileSide(SV.cx,SV.cy,0,{g:seg(p,0,.15)})+normalArrow(SV.cx,SV.cy,0,{len:130});
  s+=fade(seg(p,.05,.2),label('面積 0.5 m²',SV.cx,470,{size:26,color:SURF,anchor:'middle',weight:700}));
  s+=card(700,110,460,300,label('まっすぐ 貫くとき',930,165,{size:28,color:C.ink,anchor:'middle'})
   +label('磁場の強さ × 面積',930,225,{size:32,color:HI,anchor:'middle',weight:700})
   +fade(seg(p,.6,.75),T(`${cs(BC,'0.2\\,\\mathrm{T}')}\\times 0.5\\,\\mathrm{m^2}=${cs(HI,'0.1')}`,930,320,{size:38})),seg(p,.2,.35),HI);
  return s;
 },
 [K+'why']:(p)=>{
  let s=card(60,110,500,300,label('磁場が 2倍',310,165,{size:30,color:BC,anchor:'middle',weight:700})
   +T(`${cs(BC,'0.4')}\\times 0.5=${cs(HI,'0.2')}`,310,250,{size:44})+label('貫く量も 2倍',310,340,{size:28,color:HI,anchor:'middle'}),seg(p,.02,.18));
  s+=card(640,110,500,300,label('面積が 2倍',890,165,{size:30,color:SURF,anchor:'middle',weight:700})
   +T(`${cs(BC,'0.2')}\\times 1=${cs(HI,'0.2')}`,890,250,{size:44})+label('貫く量も 2倍',890,340,{size:28,color:HI,anchor:'middle'}),seg(p,.3,.45));
  s+=fade(seg(p,.65,.8),label('両方に 比例 → 掛け算',600,470,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'name']:(p)=>{
  let s=label('磁束（じそく）',600,95,{size:40,color:HI,anchor:'middle',weight:700});
  s+=fade(seg(p,.1,.25),T(`\\Phi=${cs(BC,'0.2\\,\\mathrm{T}')}\\times 0.5\\,\\mathrm{m^2}=0.1\\,\\mathrm{T\\cdot m^2}`,600,230,{size:50,color:HI}));
  s+=fade(seg(p,.5,.65),label('単位：T × m² ＝ T·m²',600,350,{size:32,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.1,.25),label('Φ（ファイ）… 電気束と 同じ文字',600,440,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=label('磁束（じそく）',600,95,{size:40,color:HI,anchor:'middle',weight:700});
  s+=T(`1\\,\\mathrm{T\\cdot m^2}=1\\,\\mathrm{Wb}`,600,215,{size:60,color:C.ink});
  s+=label('ウェーバ',760,290,{size:28,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.45,.6),card(300,330,600,110,T(`\\Phi=${cs(HI,'0.1\\,\\mathrm{Wb}')}`,600,400,{size:52}),1,HI));
  return s;
 },
 [K+'caution']:(p)=>{
  let s=label('真横から見た図',60,62,{size:24,color:C.dim});
  s+=sideField(1,.9)+tileSide(SV.cx,SV.cy,0)+normalArrow(SV.cx,SV.cy,0,{len:130});
  s+=card(700,110,460,300,label('✕ 何かが 流れて 通る',930,175,{size:30,color:C.a,anchor:'middle'})
   +fade(seg(p,.45,.6),label('○ 磁場の矢印 と 面の向き から',930,260,{size:28,color:C.F,anchor:'middle'})+label('計算で 決める量',930,310,{size:30,color:C.F,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 // ===== S3 斜めに貫く =====
 [K+'predict0']:(p)=>{
  const nd=mix(0,90,seg(p,.1,.5));
  let s=label('真横から見た図',60,62,{size:24,color:C.dim});
  s+=sideField(1,.45)+tileSide(SV.cx,SV.cy,nd)+normalArrow(SV.cx,SV.cy,nd,{len:120});
  s+=card(700,130,460,220,label('面を 寝かせて 平行に',930,195,{size:30,color:C.ink,anchor:'middle'})
   +label('磁束は どうなる？',930,275,{size:34,color:HI,anchor:'middle',weight:700}),seg(p,.05,.2),HI);
  return s;
 },
 [K+'quiz2']:(p)=>{
  let s=label('真横から見た図',60,62,{size:24,color:C.dim});
  s+=sideField(1,.45)+tileSide(SV.cx,SV.cy,0,{L:230});
  s+=arrow(SV.cx,SV.cy,SV.cx+150,SV.cy,{color:BC,w:7,head:20})+label('0.2 T',SV.cx+150,SV.cy+36,{size:24,color:BC,weight:700});
  s+=fade(seg(p,.3,.45),rect(SV.cx,SV.cy-22,22,22,{fill:'none',fo:0,stroke:C.ink,sw:2,rx:0})+label('面と 直角',SV.cx+30,SV.cy-40,{size:24,color:C.ink}));
  s+=card(700,120,460,260,label('確認',930,175,{size:28,color:C.dim,anchor:'middle'})
   +label('面そのものと 磁場が 直角',930,235,{size:28,color:C.ink,anchor:'middle'})
   +label('A ＝ 0.5 m²',930,285,{size:28,color:SURF,anchor:'middle'})
   +label('Φ ＝ ？ Wb',930,350,{size:36,color:HI,anchor:'middle',weight:700}),seg(p,.05,.2),HI);
  return s;
 },
 [K+'quiz2ans']:(p)=>{
  let s=label('真横から見た図',60,62,{size:24,color:C.dim});
  s+=sideField(1,.45)+tileSide(SV.cx,SV.cy,0,{L:230});
  s+=arrow(SV.cx,SV.cy,SV.cx+150,SV.cy,{color:BC,w:7,head:20});
  s+=fade(seg(p,.05,.25),normalArrow(SV.cx,SV.cy,0,{len:110}));
  s+=card(680,110,480,300,label('法線と 磁場は 平行',920,170,{size:30,color:NC,anchor:'middle',weight:700})
   +fade(seg(p,.2,.35),T(`\\theta=0^\\circ`,920,240,{size:40}))
   +fade(seg(p,.5,.65),T(`\\Phi=${cs(BC,'0.2')}\\times 0.5=${cs(HI,'0.1')}\\,\\mathrm{Wb}`,920,320,{size:40}))
   +fade(seg(p,.7,.85),label('一番 大きい',920,385,{size:26,color:HI,anchor:'middle'})),seg(p,0,.15),HI);
  return s;
 },
 [K+'spinq']:(p)=>{
  let s=spinScene(0);
  s+=fade(seg(p,.1,.3),label('？',GX(4),GY(.02),{size:72,color:HI,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.3),card(60,90,420,70,label('Φ の グラフの 形は？',270,135,{size:28,color:HI,anchor:'middle',weight:700}),1,HI));
  return s;
 },
 [K+'coilnum']:(p)=>{
  let s=coilSide(mix(.35,1,seg(p,.2,.7)));
  s+=card(720,110,440,300,label('A ＝ 0.5 m² の 輪',940,165,{size:28,color:SURF,anchor:'middle'})
   +T(`${cs(BC,'0.2\\,\\mathrm{T}')}\\times 0.5=${cs(HI,'0.1\\,\\mathrm{Wb}')}`,940,240,{size:36})
   +fade(seg(p,.35,.5),arrow(940,265,940,300,{color:C.dim,w:4,head:12}))
   +fade(seg(p,.45,.65),T(`${cs(BC,'0.6\\,\\mathrm{T}')}\\times 0.5=${cs(HI,'0.3\\,\\mathrm{Wb}')}`,940,345,{size:36})),seg(p,0,.15));
  return s;
 },
 [K+'parallel']:(p)=>{
  const u=seg(p,.05,.4),nd=mix(0,90,u);
  let s=label('真横から見た図',60,62,{size:24,color:C.dim});
  s+=sideField(1,.45)+tileSide(SV.cx,SV.cy,nd)+normalArrow(SV.cx,SV.cy,nd,{len:120});
  s+=fade(seg(p,.45,.6),label('直角',SV.cx-14,SV.cy-30,{size:24,color:C.ink,anchor:'end'})+rect(SV.cx,SV.cy-20,20,20,{fill:'none',fo:0,stroke:C.ink,sw:2,rx:0}));
  s+=card(700,130,460,240,label('面を 寝かせる',930,190,{size:30,color:C.ink,anchor:'middle'})
   +fade(seg(p,.35,.5),label('矢印は 面に沿って すり抜ける',930,250,{size:26,color:BC,anchor:'middle'}))
   +fade(seg(p,.7,.85),T(`\\Phi=${cs(HI,'0')}`,930,330,{size:48})),seg(p,.05,.2));
  return s;
 },
 [K+'tilt']:(p)=>{
  const th=60,cx=SV.cx-40,cy=SV.cy+30;
  let s=label('真横から見た図',60,62,{size:24,color:C.dim});
  s+=sideField(1,.35)+tileSide(cx,cy,mix(90,th,seg(p,0,.2)),{L:200});
  s+=fade(seg(p,.2,.35),line(cx-150*Math.cos(rad(th)),cy+150*Math.sin(rad(th)),cx+230*Math.cos(rad(th)),cy-230*Math.sin(rad(th)),{color:NC,w:2,dash:'4 8',opacity:.7}));
  s+=normalArrow(cx,cy,mix(90,th,seg(p,0,.2)),{len:110});
  s+=shadow(cx,cy,th,{g1:seg(p,.5,.65),g2:seg(p,.6,.8),txt:'影'});
  s+=label('𝐁',cx+3*48+10,cy+10,{size:30,color:BC,weight:700});
  s+=card(720,140,440,200,label('電気束と 同じ',940,200,{size:28,color:C.dim,anchor:'middle'})
   +label('磁場の矢印の 影を',940,255,{size:30,color:C.ink,anchor:'middle'})+label('法線の上に 落とす',940,305,{size:30,color:HI,anchor:'middle',weight:700}),seg(p,.1,.25),HI);
  return s;
 },
 [K+'comp']:(p)=>{
  const th=60,cx=SV.cx-40,cy=SV.cy+30;
  let s=sideField(1,.35)+tileSide(cx,cy,th,{L:200});
  s+=line(cx-150*Math.cos(rad(th)),cy+150*Math.sin(rad(th)),cx+230*Math.cos(rad(th)),cy-230*Math.sin(rad(th)),{color:NC,w:2,dash:'4 8',opacity:.7});
  s+=normalArrow(cx,cy,th,{len:110,text:''})+shadow(cx,cy,th)+label('B',cx+3*48+10,cy+10,{size:28,color:BC,weight:700});
  const par=3*48*Math.cos(rad(th)),px=cx+par*Math.cos(rad(th)),py=cy-par*Math.sin(rad(th));
  s+=fade(seg(p,.05,.2),label('B⊥',px-30,py-6,{size:30,color:HI,anchor:'end',weight:700}));
  s+=fade(seg(p,.4,.55),draw(arcPts(cx,cy,46,0,th),1,{color:C.ink,w:3})+label('θ',cx+46+10,cy-22,{size:28,color:C.ink}));
  s+=card(700,130,460,240,label('法線方向の成分',930,190,{size:30,color:HI,anchor:'middle',weight:700})
   +fade(seg(p,.3,.45),T(`${Bp}=${cs(BC,'B')}\\cos\\theta`,930,285,{size:52}))
   +fade(seg(p,.55,.72),label('θ：磁場と 法線の 間の角',930,350,{size:24,color:C.dim,anchor:'middle'})),seg(p,.05,.2),HI);
  return s;
 },
 [K+'pitfall']:(p)=>{
  const th=60,cx=SV.cx-40,cy=SV.cy+30;
  let s=sideField(1,.3)+tileSide(cx,cy,th,{L:260});
  s+=normalArrow(cx,cy,th,{len:130,text:'法線'});
  s+=arrow(cx,cy,cx+170,cy,{color:BC,w:7,head:20})+label('𝐁',cx+180,cy+10,{size:30,color:BC,weight:700});
  // angle to the surface (surface runs toward −30°)
  s+=fade(seg(p,.2,.35),draw(arcPts(cx,cy,95,-30,0),1,{color:NEG,w:4})+label('30°',cx+104,cy+34,{size:26,color:NEG,weight:700}));
  s+=fade(seg(p,.45,.6),draw(arcPts(cx,cy,60,0,60),1,{color:C.F,w:4})+label('60°',cx+44,cy-58,{size:26,color:C.F,weight:700}));
  s+=card(720,120,440,280,
   fade(seg(p,.2,.35),label('✕ 面から 測る … 30°',940,190,{size:30,color:NEG,anchor:'middle'}))
   +fade(seg(p,.45,.6),label('○ 法線から 測る … 60°',940,260,{size:30,color:C.F,anchor:'middle',weight:700}))
   +fade(seg(p,.7,.85),label('使うのは 60°',940,345,{size:32,color:HI,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'sixty']:(p)=>{
  const th=60,cx=SV.cx-40,cy=SV.cy+30;
  let s=sideField(1,.35)+tileSide(cx,cy,th,{L:200})+normalArrow(cx,cy,th,{len:110,text:''})+shadow(cx,cy,th,{txt:'0.1'});
  s+=label('0.2 T',cx+3*48+10,cy+34,{size:24,color:BC,weight:700});
  s+=draw(arcPts(cx,cy,46,0,th),1,{color:C.ink,w:3})+label('60°',cx+46+10,cy-22,{size:24,color:C.ink});
  s+=card(660,110,500,260,
   T(`${Bp}=${cs(BC,'0.2')}\\times\\cos 60^\\circ`,910,180,{size:40})
   +fade(seg(p,.25,.4),T(`=${cs(BC,'0.2')}\\times 0.5`,910,255,{size:40}))
   +fade(seg(p,.55,.7),T(`=${cs(HI,'0.1')}\\,\\mathrm{T}`,910,330,{size:44})),seg(p,0,.12));
  return s;
 },
 [K+'sixty2']:(p)=>{
  const th=60,cx=SV.cx-40,cy=SV.cy+30;
  let s=sideField(1,.35)+tileSide(cx,cy,th,{L:200})+normalArrow(cx,cy,th,{len:110,text:''})+shadow(cx,cy,th,{txt:'0.1'});
  s+=draw(arcPts(cx,cy,46,0,th),1,{color:C.ink,w:3})+label('60°',cx+46+10,cy-22,{size:24,color:C.ink});
  s+=card(660,110,500,300,
   T(`\\Phi=${Bp}A=${cs(HI,'0.1')}\\times 0.5`,910,185,{size:40})
   +fade(seg(p,.25,.4),T(`=${cs(HI,'0.05')}\\,\\mathrm{Wb}`,910,265,{size:48}))
   +fade(seg(p,.6,.75),label('まっすぐ（0.1 Wb）の 半分',910,355,{size:28,color:C.ink,anchor:'middle'})),seg(p,0,.12),HI);
  return s;
 },
 [K+'formula']:(p)=>{
  let s=label('1枚の面の 磁束',600,80,{size:32,color:C.dim,anchor:'middle'});
  s+=T(`\\Phi=${Bp}\\,A`,600,185,{size:76,color:C.ink});
  s+=fade(seg(p,.15,.3),label('法線方向の成分',490,280,{size:26,color:HI,anchor:'middle'})+label('面積',720,280,{size:26,color:SURF,anchor:'middle'}));
  s+=fade(seg(p,.5,.65),card(220,320,760,140,T(`\\Phi=(${vB}\\cdot${vn})\\,A`,600,380,{size:50})
   +label('𝐧：長さ 1 の 法線',600,440,{size:26,color:NC,anchor:'middle'})));
  return s;
 },
 [K+'reverse']:(p)=>{
  const flip=seg(p,.05,.3);
  let s=label('真横から見た図',60,62,{size:24,color:C.dim});
  s+=sideField(1,.9)+tileSide(SV.cx,SV.cy,0);
  s+=fade(1-flip,normalArrow(SV.cx,SV.cy,0,{len:130}))+fade(flip,normalArrow(SV.cx,SV.cy,180,{len:130}));
  s+=card(700,110,460,300,label('法線を 左向きに 立て直す',930,165,{size:28,color:NC,anchor:'middle'})
   +fade(seg(p,.3,.45),T(`\\theta=180^\\circ,\\ \\cos 180^\\circ=-1`,930,240,{size:34}))
   +fade(seg(p,.45,.6),T(`\\Phi=${cs(NEG,'-0.1\\,\\mathrm{Wb}')}`,930,320,{size:44}))
   +fade(seg(p,.7,.85),label('符号 ＝ 約束しだい',930,385,{size:28,color:C.ink,anchor:'middle',weight:700})),seg(p,.05,.2),NC);
  return s;
 },
 [K+'quiz']:(p)=>{
  const th=60,cx=SV.cx-40,cy=SV.cy+30;
  let s=sideField(1,.35)+tileSide(cx,cy,th,{L:200})+normalArrow(cx,cy,th,{len:110});
  s+=arrow(cx,cy,cx+150,cy,{color:BC,w:7,head:20})+label('0.4 T',cx+160,cy+34,{size:24,color:BC,weight:700});
  s+=draw(arcPts(cx,cy,46,0,th),1,{color:C.ink,w:3})+label('60°',cx+46+10,cy-22,{size:24,color:C.ink});
  s+=card(680,110,480,280,label('確認',920,165,{size:28,color:C.dim,anchor:'middle'})
   +label('B ＝ 0.4 T，A ＝ 0.5 m²',920,225,{size:30,color:C.ink,anchor:'middle'})
   +label('法線との角 60°',920,280,{size:30,color:C.ink,anchor:'middle'})
   +label('Φ ＝ ？ Wb',920,350,{size:36,color:HI,anchor:'middle',weight:700}),seg(p,.05,.2),HI);
  return s;
 },
 [K+'quizans']:(p)=>{
  const th=60,cx=SV.cx-40,cy=SV.cy+30;
  let s=sideField(1,.35)+tileSide(cx,cy,th,{L:200})+normalArrow(cx,cy,th,{len:110,text:''});
  s+=shadow(cx,cy,th,{U:48,Bv:3.2,txt:'0.2'})+label('0.4 T',cx+160,cy+34,{size:24,color:BC,weight:700});
  s+=card(660,110,500,280,
   T(`${Bp}=${cs(BC,'0.4')}\\times 0.5=${cs(HI,'0.2')}\\,\\mathrm{T}`,910,190,{size:38})
   +fade(seg(p,.4,.55),T(`\\Phi=${cs(HI,'0.2')}\\times 0.5=${cs(HI,'0.1')}\\,\\mathrm{Wb}`,910,300,{size:38})),seg(p,0,.12),HI);
  return s;
 },
 // ===== S4 面を回すと =====
 [K+'spin']:(p)=>{
  const t=1.2*seg(p,.35,.8)*(1-seg(p,.85,1));// a short preview of the turning, then back
  let s=spinScene(t,{graphG:0,curveG:0});
  s+=card(720,140,440,220,label('𝐁 も 面積も そのまま',940,200,{size:28,color:C.ink,anchor:'middle'})
   +label('1秒に 30° ずつ 回す',940,260,{size:32,color:C.t,anchor:'middle',weight:700})
   +fade(seg(p,.55,.7),label('変わるのは 角 θ だけ',940,320,{size:28,color:HI,anchor:'middle'})),seg(p,.05,.2));
  return s;
 },
 [K+'spin0']:(p)=>spinScene(0,{graphG:seg(p,.05,.3)}),
 [K+'spin1']:(p)=>{
  const t=p<.45?2*seg(p,.05,.4):2+seg(p,.5,.85);
  let s=spinScene(t);
  if(p>.4)s+=fade(seg(p,.4,.5),ring(GX(2),GY(.05),14,{color:C.ink,w:2}));
  return s;
 },
 [K+'spin2']:(p)=>spinScene(3+3*seg(p,.1,.85)),
 [K+'spin3']:(p)=>{
  let s=spinScene(6);
  s+=fade(seg(p,.2,.4),card(60,90,560,70,label('𝐁 も 面積も 同じ → 向きだけで Φ が 変わる',340,135,{size:26,color:HI,anchor:'middle',weight:700}),1,HI));
  return s;
 },
 [K+'ways']:(p)=>{
  let s=T(`\\Phi=${Bp}\\,A`,600,95,{size:56});
  const items=[['① 磁場の 強さ',BC],['② 面積',SURF],['③ 面の 向き',NC]];
  items.forEach(([t,c],i)=>{s+=card(80+i*360,170,320,220,label(t,240+i*360,230,{size:32,color:c,anchor:'middle',weight:700})+label('を 変える',240+i*360,290,{size:28,color:C.ink,anchor:'middle'}),seg(p,.2+i*.18,.32+i*.18),c);});
  // small pictograms
  s+=fade(seg(p,.2,.32),arrow(180,340,250,340,{color:BC,w:3,head:10})+arrow(260,340,360,340,{color:BC,w:6,head:16}));
  s+=fade(seg(p,.38,.5),rect(540,325,40,40,{fill:SURF,fo:.2,stroke:SURF,rx:2})+rect(620,310,70,70,{fill:SURF,fo:.2,stroke:SURF,rx:2}));
  s+=fade(seg(p,.56,.68),line(930,315,930,375,{color:SURF,w:6})+line(1010,320,1060,370,{color:SURF,w:6})+arrow(955,345,995,345,{color:C.dim,w:3,head:10}));
  return s;
 },
 // ===== S5 次の問い =====
 [K+'summary']:(p)=>{
  let s=label('まとめ：磁束',600,80,{size:32,color:C.dim,anchor:'middle'});
  s+=T(`\\Phi=${Bp}\\,A=(${vB}\\cdot${vn})\\,A`,600,180,{size:58});
  s+=fade(seg(p,.35,.5),label('角 θ は 法線から 測る',600,290,{size:30,color:NC,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),T(`1\\,\\mathrm{Wb}=1\\,\\mathrm{T\\cdot m^2}`,600,390,{size:48,color:HI}));
  return s;
 },
 [K+'coil']:(p)=>{
  let s=coilSide(seg(p,.35,.9),{g:seg(p,0,.15)});
  s+=card(720,150,440,220,label('N 極を 下から 近づける',940,210,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.5,.65),label('輪を貫く 磁場が 強くなる',940,265,{size:28,color:BC,anchor:'middle'}))
   +fade(seg(p,.75,.9),label('磁束 Φ が 増える',940,325,{size:32,color:HI,anchor:'middle',weight:700})),seg(p,.1,.25));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=coilSide(1);
  s+=card(720,150,440,200,label('磁束が 変わると',940,215,{size:30,color:C.ink,anchor:'middle'})
   +label('コイルに 何が 起こる？',940,280,{size:34,color:HI,anchor:'middle',weight:700}),seg(p,.05,.25),HI);
  return s;
 },
 [K+'next']:(p)=>{
  let s=label('次の問い',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=loopFace(300,290,140,{g:seg(p,.05,.25),heads:false})+fade(seg(p,.25,.4),label('？',470,200,{size:56,color:CI,anchor:'middle',weight:700}));
  s+=outSym(300,290,26,BC)+label('元の磁場',300,230,{size:24,color:BC,anchor:'middle'});
  s+=fade(seg(p,.25,.4),label('つくる磁場は？',300,470,{size:26,color:CI,anchor:'middle'}));
  s+=card(620,140,540,240,label('コイルに 電流が 流れたら',890,200,{size:28,color:C.ink,anchor:'middle'})
   +label('その磁場は いつも',890,260,{size:30,color:C.ink,anchor:'middle'})
   +label('元の磁場と 逆向き？',890,325,{size:36,color:HI,anchor:'middle',weight:700}),seg(p,.3,.5),HI);
  return s;
 },
};

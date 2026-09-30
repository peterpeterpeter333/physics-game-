// YouTube シリーズ「ガウスの法則・初級 1/2」(ys-ui-closed-bag-1) — 図。Stage 1200×515.
// 色：電場 𝐄 水色(C.x)、法線 桃(C.p)、法線方向の成分・電気束の値 黄(C.hi)、負の値 赤(C.a)、正電荷 赤、負電荷 青。
// 3D の箱は斜投影（奥行きを右上へ）。法線はいつも外向き。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,poly} from './anim.mjs';

const K='ui-closed-bag-1:';
export const EC=C.x,NC=C.p,HI=C.hi,NEGV=C.a,POS=C.a,NEG='#7fb3ff';
export const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
export const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
export const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
export const vE=cs(EC,'\\mathbf{E}'),vn=cs(NC,'\\mathbf{n}');
export function charge(x,y,sign=1,r=24){const c=sign>0?POS:NEG;return ring(x,y,r,{color:c,w:3,fill:sign>0?'#3a1d2a':'#1b2a48'})+label(sign>0?'＋':'−',x,y+r*.36,{size:r*1.05,color:c,anchor:'middle',weight:700});}
const rad=d=>d*Math.PI/180;

// ---- closed curves (math coords, y up; CCW) ----------------------------------------------------
export function blobPts(R=150,n=120){return Array.from({length:n},(_,i)=>{const t=2*Math.PI*i/n,r=R*(1+.10*Math.sin(2*t+.6)+.07*Math.cos(3*t));return [r*Math.cos(t),r*Math.sin(t)];});}
export const toS=(cx,cy)=>([x,y])=>[cx+x,cy-y];
export function closedPath(pts,cx,cy,{color=C.dim,w=4,fill='#9aabc7',fo=.07,dash=''}={}){
 const P=pts.map(toS(cx,cy));return poly(P,{fill,fo,stroke:'none'})+draw([...P,P[0]],1,{color,w,dash});
}
// outward normal at parameter index i (math coords, CCW polygon): (dy,-dx)
export function normalAt(pts,i){const a=pts[(i-1+pts.length)%pts.length],b=pts[(i+1)%pts.length];const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy);return [dy/L,-dx/L];}

// ---- uniform field rows (screen) ---------------------------------------------------------------
function fieldRows(x0,x1,ys,{g=1,len=64,gap=120,opacity=1,w=4}={}){
 let s='';for(const y of ys)for(let x=x0;x+len<=x1;x+=gap)s+=arrow(x,y,x+len,y,{color:EC,w,head:14});
 return fade(g*opacity,s);
}

// ---- side view of one flat tile ------------------------------------------------------------------
// tile centred (cx,cy); nDeg = direction of the chosen normal (0 = right, 90 = up)
function tileSide(cx,cy,nDeg,{L=190,g=1,color='#c9d6ee'}={}){
 const tx=-Math.sin(rad(nDeg)),ty=Math.cos(rad(nDeg));
 return fade(g,line(cx-tx*L/2,cy+ty*L/2,cx+tx*L/2,cy-ty*L/2,{color,w:9}));
}
function normalArrow(cx,cy,nDeg,{len=120,g=1,text='法線',dash=false,opacity=1}={}){
 const X=cx+len*Math.cos(rad(nDeg)),Y=cy-len*Math.sin(rad(nDeg));
 const s=dash?line(cx,cy,X,Y,{color:NC,w:4,dash:'8 8'})+dot(X,Y,6,NC):arrow(cx,cy,X,Y,{color:NC,w:6,head:18,g});
 return fade(opacity,s+(text?fade(g,label(text,X+(Math.cos(rad(nDeg))>=0?12:-12),Y-12,{size:24,color:NC,anchor:Math.cos(rad(nDeg))>=0?'start':'end',weight:700})):''));
}
const SV={cx:330,cy:275};
function sideField(g=1,opacity=1){return fieldRows(70,640,[115,175,235,295,355,415],{g,opacity,gap:115,len:62});}
function eLabel(x=70,y=62){return T(`${vE}\\ \\text{右向き}\\ 3\\,\\mathrm{N/C}`,x,y,{size:30,anchor:'start'});}

// ---- oblique box -------------------------------------------------------------------------------
const BX={ox:235,oy:385,s:118,k:.55,a:rad(38)};
export function P3([x,y,z],o=BX){return [o.ox+o.s*(x+o.k*z*Math.cos(o.a)),o.oy-o.s*(y+o.k*z*Math.sin(o.a))];}
const BA=2,BB=Math.SQRT2,BC=Math.SQRT2;// box: x along E (2 m), left/right faces √2 × √2 = 2 m²
const V=(x,y,z)=>P3([x,y,z]);
function faceP(pts,{fill='#9aabc7',fo=.07,stroke='none',sw=2}={}){return poly(pts.map(p=>V(...p)),{fill,fo,stroke,sw});}
const FACES={
 left:[[0,0,0],[0,BB,0],[0,BB,BC],[0,0,BC]],right:[[BA,0,0],[BA,BB,0],[BA,BB,BC],[BA,0,BC]],
 top:[[0,BB,0],[BA,BB,0],[BA,BB,BC],[0,BB,BC]],bottom:[[0,0,0],[BA,0,0],[BA,0,BC],[0,0,BC]],
 front:[[0,0,0],[BA,0,0],[BA,BB,0],[0,BB,0]],back:[[0,0,BC],[BA,0,BC],[BA,BB,BC],[0,BB,BC]],
};
// centre, outward unit normal, drawn length (m), label offset
const NORM={
 left:{c:[0,BB/2,BC/2],n:[-1,0,0],L:1.05},right:{c:[BA,BB/2,BC/2],n:[1,0,0],L:1.05},
 top:{c:[BA/2,BB,BC/2],n:[0,1,0],L:.8},bottom:{c:[BA/2,0,BC/2],n:[0,-1,0],L:.72},
 front:{c:[BA/2,BB/2,0],n:[0,0,-1],L:1.6},back:{c:[BA/2,BB/2,BC],n:[0,0,1],L:1.5},
};
export const VAL3={left:'−6',right:'+6',top:'0',bottom:'0',front:'0',back:'0'};
const LBL={left:[-16,-14,'end'],right:[14,-14,'start'],top:[14,6,'start'],bottom:[14,16,'start'],front:[-14,20,'end'],back:[14,-4,'start']};
function boxEdges(){
 const hidden=[[[0,0,BC],[BA,0,BC]],[[0,0,BC],[0,BB,BC]],[[0,0,BC],[0,0,0]]];
 const vis=[[[0,0,0],[BA,0,0]],[[BA,0,0],[BA,BB,0]],[[BA,BB,0],[0,BB,0]],[[0,BB,0],[0,0,0]],[[BA,0,0],[BA,0,BC]],[[BA,0,BC],[BA,BB,BC]],[[BA,BB,BC],[BA,BB,0]],[[0,BB,0],[0,BB,BC]],[[0,BB,BC],[BA,BB,BC]]];
 let s='';for(const [a,b] of hidden){const [x1,y1]=V(...a),[x2,y2]=V(...b);s+=line(x1,y1,x2,y2,{color:C.dim,w:2,dash:'6 7'});}
 for(const [a,b] of vis){const [x1,y1]=V(...a),[x2,y2]=V(...b);s+=line(x1,y1,x2,y2,{color:'#c9d6ee',w:3});}
 return s;
}
function boxFieldLines({g=1,inside=1,E=3}={}){
 let s='';const ys=[.35,.75,1.1],zs=[.35,1.05];
 const len=E>=5?.66:.5;
 for(const y of ys)for(const z of zs){
  // continuous faint line through the box, plus arrow heads outside and inside
  const [a1,b1]=V(-1.35,y,z),[a2,b2]=V(BA+1.05,y,z);
  s+=line(a1,b1,a2,b2,{color:EC,w:2,opacity:.35});
  for(const x0 of [-1.3,BA+.38]){const [p,q]=V(x0,y,z),[P,Q]=V(x0+len,y,z);s+=arrow(p,q,P,Q,{color:EC,w:4,head:13});}
  const [p,q]=V(BA/2-len/2,y,z),[P,Q]=V(BA/2+len/2,y,z);s+=fade(inside,arrow(p,q,P,Q,{color:EC,w:4,head:13}));
 }
 return fade(g,s);
}
export function boxNormals(which,{g=1,vals=null,hl=null}={}){
 let s='';for(const f of which){const {c,n,L}=NORM[f];const [x,y]=V(...c),[X,Y]=V(c[0]+n[0]*L,c[1]+n[1]*L,c[2]+n[2]*L);
  const hidden=f==='left'||f==='bottom'||f==='back';
  s+=(hidden?dot(x,y,5,NC):dot(x,y,5,NC))+arrow(x,y,X,Y,{color:NC,w:hl&&hl!==f?4:5,head:15,opacity:hl&&hl!==f?.45:1});
  if(vals&&vals[f]!==undefined){const [dx,dy,an]=LBL[f];const v=vals[f];s+=label(v,X+dx,Y+dy+10,{size:34,color:v.startsWith('−')?NEGV:HI,anchor:an,weight:700});}
 }
 return fade(g,s);
}
export function boxScene({field=1,inside=1,E=3,faceHL=null}={}){
 let s=faceP(FACES.back,{fo:.04})+faceP(FACES.left,{fo:.05})+faceP(FACES.bottom,{fo:.04});
 if(faceHL)for(const [f,col] of faceHL)s+=faceP(FACES[f],{fill:col,fo:.28,stroke:col,sw:3});
 s+=boxFieldLines({g:field,inside,E});
 s+=faceP(FACES.front,{fo:.06})+faceP(FACES.top,{fo:.08})+faceP(FACES.right,{fo:.06})+boxEdges();
 return s;
}

// ---- 3D tile (square in the y–z plane) ---------------------------------------------------------
const TL={ox:250,oy:380,s:125,k:.6,a:rad(38)};
const Q=(x,y,z)=>P3([x,y,z],TL);
function tile3d({g=1,fieldG=1,nR=0,nL=0,areaG=1}={}){
 const e=Math.SQRT2,x0=1.3;
 const pts=[[x0,0,0],[x0,e,0],[x0,e,e],[x0,0,e]].map(p=>Q(...p));
 let s='';
 const rows=[[.25,.3],[.7,.3],[1.15,.3],[.25,1.1],[.7,1.1],[1.15,1.1]];
 // behind the tile
 for(const [y,z] of rows){const [a,b]=Q(-.2,y,z),[A,B]=Q(x0,y,z);s+=fade(fieldG,line(a,b,A,B,{color:EC,w:3,opacity:.8}));}
 s+=fade(g,poly(pts,{fill:'#c9d6ee',fo:.16,stroke:'#c9d6ee',sw:3}));
 for(const [y,z] of rows){const [a,b]=Q(x0,y,z),[A,B]=Q(x0+1.1,y,z);s+=fade(fieldG,arrow(a,b,A,B,{color:EC,w:4,head:14})+dot(a,b,4,EC));}
 s+=fade(areaG*g,label('面積 2 m²',Q(x0,e,e)[0]+8,Q(x0,e,e)[1]-14,{size:28,color:'#c9d6ee',weight:700}));
 const [cx,cy]=Q(x0,e/2,e/2);
 if(nR)s+=fade(nR,arrow(cx,cy,Q(x0+1.25,e/2,e/2)[0],cy,{color:NC,w:6,head:18})+label('法線',Q(x0+1.25,e/2,e/2)[0]+10,cy+36,{size:26,color:NC,weight:700}));
 if(nL)s+=fade(nL,line(cx,cy,Q(x0-1.1,e/2,e/2)[0],cy,{color:NC,w:4,dash:'8 8'})+dot(Q(x0-1.1,e/2,e/2)[0],cy,7,NC)+label('左向きにも 立てられる',Q(x0-1.1,e/2,e/2)[0]+10,Q(x0,0,0)[1]+50,{size:22,color:NC,anchor:'middle'}));
 return s;
}

// ---- small curved path for the recap --------------------------------------------------------------
function recapPath(p){
 const pts=[[110,420],[260,330],[420,300],[560,220],[650,110]];
 let s=draw(pts,seg(p,0,.3),{color:C.dim,w:5});
 for(let i=0;i<pts.length;i++)s+=fade(seg(p,.2,.35),dot(pts[i][0],pts[i][1],6,C.ink));
 const E=[[3,1.2],[2.2,1.8],[1.4,-1],[.4,2.2]];
 for(let i=0;i<4;i++){const [x,y]=pts[i],[X,Y]=pts[i+1],mx=(x+X)/2,my=(y+Y)/2,dx=X-x,dy=Y-y,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L;
  const ex=E[i][0]*34,ey=-E[i][1]*34,par=ex*ux+ey*uy;
  s+=fade(seg(p,.3+i*.05,.45+i*.05),arrow(mx,my,mx+ex,my+ey,{color:EC,w:4,head:13}));
  s+=fade(seg(p,.5+i*.05,.65+i*.05),line(mx+ex,my+ey,mx+par*ux,my+par*uy,{color:HI,w:2,dash:'5 5',opacity:.7})+line(mx,my,mx+par*ux,my+par*uy,{color:HI,w:8,cap:'butt'}));
 }
 return s;
}

export const ytUiClosedBag1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=label('前回：道に沿って足す',60,60,{size:26,color:C.dim});
  s+=recapPath(p);
  s+=card(760,140,400,220,label('区間ごとに',960,195,{size:28,color:C.ink,anchor:'middle'})
   +label('道に沿う成分 × 長さ',960,250,{size:30,color:HI,anchor:'middle',weight:700})
   +label('を 全部足す ＝ 仕事',960,305,{size:28,color:C.ink,anchor:'middle'}),seg(p,.7,.85));
  return s;
 },
 [K+'question']:(p)=>{
  const pts=blobPts(140);let s=closedPath(pts,330,275,{w:4});
  s+=fieldRows(40,650,[135,205,275,345,415],{g:seg(p,.05,.3),gap:130,len:64});
  s+=card(700,110,460,250,label('線 → 面',930,170,{size:28,color:C.dim,anchor:'middle'})
   +label('閉じた袋を 出入りする',930,235,{size:32,color:C.ink,anchor:'middle'})
   +label('矢印は、どう数える？',930,300,{size:36,color:HI,anchor:'middle',weight:700}),seg(p,.3,.5),HI);
  return s;
 },
 [K+'imagined']:(p)=>{
  const pts=blobPts(140);
  let s=fieldRows(40,650,[135,205,275,345,415],{gap:130,len:64});
  s+=fade(seg(p,.05,.25),closedPath(pts,330,275,{w:4,dash:'12 9',fo:.04}));
  s+=card(700,120,460,230,label('袋 ＝ 頭の中で描いた面',930,190,{size:30,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.5,.65),label('電場の矢印は 変わらない',930,265,{size:30,color:EC,anchor:'middle'})),seg(p,.15,.3));
  return s;
 },
 [K+'plan']:(p)=>{
  let s=card(90,130,440,260,label('① 平らな面 1枚',310,190,{size:32,color:C.ink,anchor:'middle',weight:700})
   +line(250,300,370,260,{color:'#c9d6ee',w:9})+arrow(310,280,350,330,{color:NC,w:5,head:14}),seg(p,.05,.25));
  s+=fade(seg(p,.35,.5),arrow(560,260,640,260,{color:C.dim,w:5}));
  s+=card(670,130,440,260,label('② 閉じた袋',890,190,{size:32,color:C.ink,anchor:'middle',weight:700})
   +closedPath(blobPts(62),890,300,{w:3}),seg(p,.45,.65));
  return s;
 },
 // ===== S2 面を貫く量 =====
 [K+'tile3d']:(p)=>{
  let s=tile3d({g:seg(p,.3,.45),fieldG:seg(p,.05,.25),areaG:seg(p,.35,.5)});
  s+=fade(seg(p,.05,.2),eLabel(60,62));
  s+=card(760,300,400,150,label('一様 ＝ どこでも',960,355,{size:28,color:C.ink,anchor:'middle'})+label('同じ向き・同じ強さ',960,405,{size:30,color:EC,anchor:'middle',weight:700}),seg(p,.62,.78));
  return s;
 },
 [K+'normal']:(p)=>{
  let s=tile3d({nR:seg(p,.25,.45)})+eLabel(60,62);
  s+=card(760,130,400,150,label('面に垂直な 矢印',960,190,{size:28,color:C.ink,anchor:'middle'})+label('＝ 法線',960,245,{size:34,color:NC,anchor:'middle',weight:700}),seg(p,.4,.6),NC);
  return s;
 },
 [K+'normal2']:(p)=>{
  let s=tile3d({nR:seg(p,.6,.75),nL:seg(p,.05,.2)*(1-seg(p,.6,.75)*.7)})+eLabel(60,62);
  s+=card(760,130,400,200,label('どちら向きを 正にする？',960,190,{size:28,color:C.ink,anchor:'middle'})+label('→ 約束で決める',960,240,{size:28,color:NC,anchor:'middle'})
   +fade(seg(p,.62,.78),label('いまは 右向き',960,295,{size:32,color:NC,anchor:'middle',weight:700})),seg(p,.15,.3),NC);
  return s;
 },
 [K+'perp']:(p)=>{
  let s=label('真横から見た図（面は 線に見える）',60,62,{size:24,color:C.dim});
  s+=sideField(1,.9)+tileSide(SV.cx,SV.cy,0,{g:seg(p,0,.15)})+normalArrow(SV.cx,SV.cy,0,{len:130});
  s+=fade(seg(p,.05,.2),label('面積 2 m²',SV.cx,470,{size:26,color:'#c9d6ee',anchor:'middle',weight:700}));
  s+=card(700,110,460,300,label('まっすぐ 貫くとき',930,165,{size:28,color:C.ink,anchor:'middle'})
   +label('電場の強さ × 面積',930,225,{size:32,color:HI,anchor:'middle',weight:700})
   +fade(seg(p,.6,.75),T(`${cs(EC,'3\\,\\mathrm{N/C}')}\\times 2\\,\\mathrm{m^2}=${cs(HI,'6')}`,930,320,{size:40})),seg(p,.2,.35),HI);
  return s;
 },
 [K+'why']:(p)=>{
  let s=card(60,110,500,300,label('電場が 2倍',310,165,{size:30,color:EC,anchor:'middle',weight:700})
   +T(`${cs(EC,'6')}\\times 2=${cs(HI,'12')}`,310,250,{size:44})+label('貫く量も 2倍',310,340,{size:28,color:HI,anchor:'middle'}),seg(p,.05,.2));
  s+=card(640,110,500,300,label('面積が 2倍',890,165,{size:30,color:'#c9d6ee',anchor:'middle',weight:700})
   +T(`${cs(EC,'3')}\\times 4=${cs(HI,'12')}`,890,250,{size:44})+label('貫く量も 2倍',890,340,{size:28,color:HI,anchor:'middle'}),seg(p,.25,.4));
  s+=fade(seg(p,.6,.75),label('両方に比例 → 掛け算（仕事 ＝ 力 × 距離と同じ理由）',600,470,{size:28,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'name']:(p)=>{
  let s=label('電気束（でんきそく）',600,95,{size:40,color:HI,anchor:'middle',weight:700});
  s+=fade(seg(p,.1,.25),T(`\\Phi=${cs(EC,'3\\,\\mathrm{N/C}')}\\times 2\\,\\mathrm{m^2}=6\\,\\mathrm{N\\cdot m^2/C}`,600,230,{size:52,color:HI}));
  s+=fade(seg(p,.45,.6),label('単位：N/C × m² ＝ N·m²/C',600,350,{size:32,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.1,.25),label('Φ（ファイ）',600,440,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'caution']:(p)=>{
  let s=label('真横から見た図',60,62,{size:24,color:C.dim});
  s+=sideField(1,.9)+tileSide(SV.cx,SV.cy,0)+normalArrow(SV.cx,SV.cy,0,{len:130});
  s+=card(700,110,460,300,label('✕ 何かが 流れて 通る',930,175,{size:30,color:C.a,anchor:'middle'})
   +fade(seg(p,.45,.6),label('○ 電場の矢印 と 面の向き から',930,260,{size:28,color:C.F,anchor:'middle'})+label('計算で 決める量',930,310,{size:30,color:C.F,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'parallel']:(p)=>{
  const u=seg(p,.05,.4),nd=mix(0,90,u);
  let s=label('真横から見た図',60,62,{size:24,color:C.dim});
  s+=sideField(1,.9)+tileSide(SV.cx,SV.cy,nd)+normalArrow(SV.cx,SV.cy,nd,{len:120});
  s+=card(700,130,460,220,label('面を 寝かせる',930,190,{size:30,color:C.ink,anchor:'middle'})
   +fade(seg(p,.5,.65),label('矢印は 面に沿って すり抜ける',930,260,{size:28,color:EC,anchor:'middle'})),seg(p,.1,.25));
  return s;
 },
 [K+'parallel2']:(p)=>{
  let s=label('真横から見た図',60,62,{size:24,color:C.dim});
  s+=sideField(1,.9)+tileSide(SV.cx,SV.cy,90)+normalArrow(SV.cx,SV.cy,90,{len:120});
  s+=fade(seg(p,.4,.55),label('直角',SV.cx-14,SV.cy-30,{size:24,color:C.ink,anchor:'end'})+rect(SV.cx,SV.cy-20,20,20,{fill:'none',fo:0,stroke:C.ink,sw:2,rx:0}));
  s+=card(700,130,460,240,label('面積は 2 m² のまま',930,190,{size:28,color:C.ink,anchor:'middle'})
   +T(`\\Phi=${cs(HI,'0')}`,930,280,{size:52,color:HI})+fade(seg(p,.45,.6),label('法線 と 電場 が 直角',930,345,{size:26,color:NC,anchor:'middle'})),seg(p,.05,.2),HI);
  return s;
 },
 [K+'tilt']:(p)=>{
  const th=60,cx=SV.cx-40,cy=SV.cy+30,U=48;
  let s=label('真横から見た図',60,62,{size:24,color:C.dim});
  s+=sideField(1,.35)+tileSide(cx,cy,th,{L:200});
  // extended normal guide line
  s+=fade(seg(p,.2,.35),line(cx-150*Math.cos(rad(th)),cy+150*Math.sin(rad(th)),cx+230*Math.cos(rad(th)),cy-230*Math.sin(rad(th)),{color:NC,w:2,dash:'4 8',opacity:.7}));
  s+=normalArrow(cx,cy,th,{len:110});
  const ex=cx+3*U,ey=cy;s+=arrow(cx,cy,ex,ey,{color:EC,w:7,head:20})+label('𝐄',ex+10,ey+10,{size:30,color:EC,weight:700});
  const par=3*U*Math.cos(rad(th)),px=cx+par*Math.cos(rad(th)),py=cy-par*Math.sin(rad(th));
  s+=fade(seg(p,.5,.65),line(ex,ey,px,py,{color:HI,w:2,dash:'6 6'}));
  s+=fade(seg(p,.6,.8),line(cx,cy,px,py,{color:HI,w:10,cap:'butt'})+label('影',px-26,py-8,{size:26,color:HI,anchor:'end',weight:700}));
  s+=card(720,140,440,200,label('内積の回と 同じ',940,200,{size:28,color:C.dim,anchor:'middle'})
   +label('電場の矢印の影を',940,255,{size:30,color:C.ink,anchor:'middle'})+label('法線の上に 落とす',940,305,{size:30,color:HI,anchor:'middle',weight:700}),seg(p,.1,.25),HI);
  return s;
 },
 [K+'comp']:(p)=>{
  const th=60,cx=SV.cx-40,cy=SV.cy+30,U=48;
  let s=sideField(1,.35)+tileSide(cx,cy,th,{L:200});
  s+=line(cx-150*Math.cos(rad(th)),cy+150*Math.sin(rad(th)),cx+230*Math.cos(rad(th)),cy-230*Math.sin(rad(th)),{color:NC,w:2,dash:'4 8',opacity:.7});
  s+=normalArrow(cx,cy,th,{len:110,text:''});
  const ex=cx+3*U,ey=cy;s+=arrow(cx,cy,ex,ey,{color:EC,w:7,head:20})+label('E',ex+10,ey+10,{size:28,color:EC,weight:700});
  const par=3*U*Math.cos(rad(th)),px=cx+par*Math.cos(rad(th)),py=cy-par*Math.sin(rad(th));
  s+=line(ex,ey,px,py,{color:HI,w:2,dash:'6 6'})+line(cx,cy,px,py,{color:HI,w:10,cap:'butt'});
  s+=fade(seg(p,.05,.2),label('E⊥',px-30,py-6,{size:30,color:HI,anchor:'end',weight:700}));
  // angle arc between E (0°) and the normal (60°)
  const r=46,arc=Array.from({length:21},(_,i)=>{const a=rad(th*i/20);return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});
  s+=fade(seg(p,.4,.55),draw(arc,1,{color:C.ink,w:3})+label('θ',cx+r+10,cy-22,{size:28,color:C.ink}));
  s+=card(700,130,460,240,label('法線方向の成分',930,190,{size:30,color:HI,anchor:'middle',weight:700})
   +fade(seg(p,.55,.72),T(`${cs(HI,'E_{\\perp}')}=${cs(EC,'E')}\\cos\\theta`,930,285,{size:52}))
   +fade(seg(p,.55,.72),label('θ：電場と法線の間の角',930,350,{size:24,color:C.dim,anchor:'middle'})),seg(p,.05,.2),HI);
  return s;
 },
 [K+'sixty']:(p)=>{
  const th=60,cx=SV.cx-40,cy=SV.cy+30,U=48;
  let s=sideField(1,.35)+tileSide(cx,cy,th,{L:200})+normalArrow(cx,cy,th,{len:110,text:''});
  const ex=cx+3*U,ey=cy;s+=arrow(cx,cy,ex,ey,{color:EC,w:7,head:20})+label('3 N/C',ex+10,ey+34,{size:24,color:EC,weight:700});
  const par=3*U*Math.cos(rad(th)),px=cx+par*Math.cos(rad(th)),py=cy-par*Math.sin(rad(th));
  s+=line(ex,ey,px,py,{color:HI,w:2,dash:'6 6'})+line(cx,cy,px,py,{color:HI,w:10,cap:'butt'})+label('1.5',px-28,py-6,{size:28,color:HI,anchor:'end',weight:700});
  const r=46,arc=Array.from({length:21},(_,i)=>{const a=rad(th*i/20);return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});
  s+=draw(arc,1,{color:C.ink,w:3})+label('60°',cx+r+10,cy-22,{size:24,color:C.ink});
  s+=card(660,90,500,340,
   T(`${cs(HI,'E_{\\perp}')}=${cs(EC,'3')}\\times\\cos 60^\\circ=${cs(EC,'3')}\\times 0.5`,910,160,{size:36})
   +fade(seg(p,.2,.35),T(`=${cs(HI,'1.5')}\\,\\mathrm{N/C}`,910,225,{size:40}))
   +fade(seg(p,.5,.65),T(`\\Phi=${cs(HI,'1.5')}\\times 2`,910,310,{size:42}))
   +fade(seg(p,.65,.8),T(`=${cs(HI,'3')}\\,\\mathrm{N\\cdot m^2/C}`,910,380,{size:42})),seg(p,0,.12));
  return s;
 },
 [K+'formula']:(p)=>{
  let s=label('1枚の面の 電気束',600,90,{size:32,color:C.dim,anchor:'middle'});
  s+=T(`\\Phi=${cs(HI,'E_{\\perp}')}\\,A`,600,210,{size:80,color:C.ink});
  s+=fade(seg(p,.2,.35),label('法線方向の成分',470,320,{size:28,color:HI,anchor:'middle'})+label('面積',760,320,{size:28,color:'#c9d6ee',anchor:'middle'}));
  s+=fade(seg(p,.55,.7),card(250,370,700,80,label('面に沿う成分 → 数に入らない',600,422,{size:30,color:C.ink,anchor:'middle'})));
  return s;
 },
 [K+'dot']:(p)=>{
  let s=T(`\\Phi=${cs(HI,'E_{\\perp}')}\\,A`,600,110,{size:56});
  s+=fade(seg(p,.05,.25),T(`=(${vE}\\cdot${vn})\\,A`,600,210,{size:56}));
  s+=fade(seg(p,.2,.35),label('𝐧：長さ 1 の 法線',600,290,{size:28,color:NC,anchor:'middle'}));
  s+=fade(seg(p,.5,.7),card(200,330,800,120,T(`${vE}\\cdot${vn}=E\\times 1\\times\\cos\\theta=${cs(HI,'E\\cos\\theta')}`,600,380,{size:40})
   +label('＝ 𝐄 の 影の長さ',600,430,{size:26,color:HI,anchor:'middle'})));
  return s;
 },
 [K+'reverse']:(p)=>{
  const flip=seg(p,.05,.3);
  let s=label('真横から見た図',60,62,{size:24,color:C.dim});
  s+=sideField(1,.9)+tileSide(SV.cx,SV.cy,0);
  s+=fade(1-flip,normalArrow(SV.cx,SV.cy,0,{len:130}))+fade(flip,normalArrow(SV.cx,SV.cy,180,{len:130}));
  s+=card(700,110,460,300,label('法線を 左向きに 立て直す',930,165,{size:28,color:NC,anchor:'middle'})
   +fade(seg(p,.35,.5),T(`\\theta=180^\\circ,\\ \\cos 180^\\circ=-1`,930,240,{size:36}))
   +fade(seg(p,.6,.75),T(`\\Phi=3\\times(-1)\\times 2=${cs(NEGV,'-6')}`,930,330,{size:40})),seg(p,.05,.2),NC);
  return s;
 },
 [K+'reverse2']:(p)=>{
  let s=card(80,120,480,250,label('法線 右向き',320,180,{size:28,color:NC,anchor:'middle'})+T(`\\Phi=${cs(HI,'+6')}`,320,280,{size:52}),1);
  s+=card(640,120,480,250,label('法線 左向き',880,180,{size:28,color:NC,anchor:'middle'})+T(`\\Phi=${cs(NEGV,'-6')}`,880,280,{size:52}),1);
  s+=fade(seg(p,.3,.45),label('電場も 面も 同じ → 違うのは 約束だけ',600,450,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S3 閉じた面の約束 =====
 [K+'closed']:(p)=>{
  let s='';
  // a box
  const B={ox:170,oy:390,s:120,k:.55,a:rad(38)};const Pb=(x,y,z)=>P3([x,y,z],B);
  const box=[[[0,0,0],[1.6,0,0],[1.6,1.4,0],[0,1.4,0]],[[0,1.4,0],[1.6,1.4,0],[1.6,1.4,1.3],[0,1.4,1.3]],[[1.6,0,0],[1.6,0,1.3],[1.6,1.4,1.3],[1.6,1.4,0]]];
  s+=fade(seg(p,.05,.25),box.map(f=>poly(f.map(q=>Pb(...q)),{fill:'#9aabc7',fo:.1,stroke:'#c9d6ee',sw:3})).join('')+label('穴のない 箱',Pb(.8,0,0)[0],450,{size:28,color:C.ink,anchor:'middle'}));
  // a ball
  s+=fade(seg(p,.2,.4),ring(820,250,120,{color:'#c9d6ee',w:3,fill:'rgba(154,171,199,.08)'})+`<ellipse cx="820" cy="250" rx="120" ry="34" fill="none" stroke="#c9d6ee" stroke-width="2" stroke-dasharray="6 7"/>`+label('ボールの 表面',820,450,{size:28,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.55,.7),label('＝ 閉じた面',600,70,{size:36,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'outward']:(p)=>{
  const pts=blobPts(150),cx=330,cy=270;
  let s=closedPath(pts,cx,cy,{w:4});
  s+=fade(seg(p,.05,.2),label('内側',cx,cy+10,{size:30,color:C.ink,anchor:'middle'})+label('外側',cx+230,cy-170,{size:30,color:C.dim,anchor:'middle'}));
  for(let j=0;j<10;j++){const i=j*12,[x,y]=pts[i],[nx,ny]=normalAt(pts,i),[X,Y]=toS(cx,cy)([x,y]);
   s+=fade(seg(p,.4+j*.03,.55+j*.03),dot(X,Y,5,NC)+arrow(X,Y,X+nx*70,Y-ny*70,{color:NC,w:5,head:14}));}
  s+=card(720,150,440,200,label('法線は いつも',940,215,{size:30,color:C.ink,anchor:'middle'})+label('外向き',940,285,{size:44,color:NC,anchor:'middle',weight:700}),seg(p,.45,.6),NC);
  return s;
 },
 [K+'inout']:(p)=>{
  const pts=blobPts(150),cx=330,cy=270;
  let s=closedPath(pts,cx,cy,{w:4});
  const iR=0,iL=60;// right point (t=0) and left point (t=π)
  const [xR,yR]=toS(cx,cy)(pts[iR]),[nxR,nyR]=normalAt(pts,iR),[xL,yL]=toS(cx,cy)(pts[iL]),[nxL,nyL]=normalAt(pts,iL);
  s+=arrow(xR,yR,xR+nxR*80,yR-nyR*80,{color:NC,w:5,head:14})+arrow(xL,yL,xL+nxL*80,yL-nyL*80,{color:NC,w:5,head:14});
  // outgoing arrow at right, incoming arrow at left
  s+=fade(seg(p,.1,.3),arrow(xR-70,yR,xR+75,yR,{color:EC,w:6,head:18})+label('出る',xR+10,yR+50,{size:28,color:EC,weight:700}));
  s+=fade(seg(p,.2,.35),label('正',xR+95,yR-28,{size:40,color:HI,weight:700}));
  s+=fade(seg(p,.5,.7),arrow(xL-80,yL-30,xL+70,yL+10,{color:EC,w:6,head:18})+label('入る',xL-10,yL+56,{size:28,color:EC,weight:700,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),label('負',xL-110,yL-56,{size:40,color:NEGV,weight:700}));
  s+=card(720,130,440,240,label('外向きの法線と 同じ側',940,190,{size:26,color:C.ink,anchor:'middle'})+label('→ 正（出る）',940,240,{size:32,color:HI,anchor:'middle',weight:700})
   +fade(seg(p,.55,.7),label('逆側',940,295,{size:26,color:C.ink,anchor:'middle'})+label('→ 負（入る）',940,340,{size:32,color:NEGV,anchor:'middle',weight:700})),seg(p,.15,.3));
  return s;
 },
 [K+'words']:(p)=>{
  const pts=blobPts(150),cx=330,cy=270;
  let s=closedPath(pts,cx,cy,{w:4});
  const [xR,yR]=toS(cx,cy)(pts[0]),[xL,yL]=toS(cx,cy)(pts[60]);
  s+=arrow(xR-70,yR,xR+75,yR,{color:EC,w:6,head:18})+arrow(xL-80,yL-30,xL+70,yL+10,{color:EC,w:6,head:18});
  s+=card(720,130,440,240,label('「出る」「入る」',940,195,{size:32,color:C.ink,anchor:'middle',weight:700})
   +label('＝ 矢印が 面を 貫く 向き',940,255,{size:28,color:EC,anchor:'middle'})
   +fade(seg(p,.45,.6),label('何かが 出入りするのではない',940,320,{size:26,color:C.a,anchor:'middle'})),seg(p,.05,.2));
  return s;
 },
 [K+'quiz']:(p)=>{
  const pts=blobPts(150),cx=330,cy=270,i=30;
  let s=closedPath(pts,cx,cy,{w:4});
  const [x,y]=toS(cx,cy)(pts[i]),[nx,ny]=normalAt(pts,i);
  s+=arrow(x,y,x+nx*80,y-ny*80,{color:NC,w:5,head:14});
  s+=fade(seg(p,.1,.3),arrow(x+nx*95+30,y-ny*95,x-nx*60+30,y+ny*60,{color:EC,w:6,head:18}));
  s+=card(720,140,440,220,label('電場が 内側を向いて 貫く',940,205,{size:28,color:C.ink,anchor:'middle'})+label('電気束の 符号は？',940,275,{size:36,color:HI,anchor:'middle',weight:700}),seg(p,.2,.35),HI);
  return s;
 },
 [K+'quizans']:(p)=>{
  const pts=blobPts(150),cx=330,cy=270,i=30;
  let s=closedPath(pts,cx,cy,{w:4});
  const [x,y]=toS(cx,cy)(pts[i]),[nx,ny]=normalAt(pts,i);
  s+=arrow(x,y,x+nx*80,y-ny*80,{color:NC,w:5,head:14})+arrow(x+nx*95+30,y-ny*95,x-nx*60+30,y+ny*60,{color:EC,w:6,head:18});
  s+=label('負',x+nx*80+50,y-ny*80+10,{size:44,color:NEGV,weight:700});
  s+=card(720,140,440,220,label('内向き ＝ 外向きの法線と 逆',940,215,{size:28,color:C.ink,anchor:'middle'})+label('→ 負',940,285,{size:44,color:NEGV,anchor:'middle',weight:700}),seg(p,.05,.2),NEGV);
  return s;
 },
 [K+'sum']:(p)=>{
  const pts=blobPts(150),cx=330,cy=270;
  let s=closedPath(pts,cx,cy,{w:4});
  // cut the surface into patches
  for(let j=0;j<8;j++){const i=j*15,[X,Y]=toS(cx,cy)(pts[i]);s+=fade(seg(p,.05,.25),line(X-6*Math.cos(2*Math.PI*i/120),Y+6*Math.sin(2*Math.PI*i/120),X+6*Math.cos(2*Math.PI*i/120),Y-6*Math.sin(2*Math.PI*i/120),{color:C.ink,w:3}));}
  s+=fade(seg(p,.1,.3),label('面ごとに 電気束 ΔΦ₁, ΔΦ₂, …',cx,490,{size:26,color:HI,anchor:'middle'}));
  s+=card(700,130,460,250,label('袋全体の 電気束',930,190,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.35,.5),T(`\\Phi=\\sum_i ${cs(HI,'\\Delta\\Phi_i')}`,930,285,{size:52}))
   +fade(seg(p,.55,.7),label('符号を つけたまま 全部足す',930,350,{size:26,color:C.dim,anchor:'middle'})),seg(p,.2,.35));
  return s;
 },
 // ===== S4 一様な電場を貫く箱 =====
 [K+'box']:(p)=>{
  let s=boxScene({field:seg(p,.05,.3)});
  s+=fade(seg(p,.05,.2),T(`${vE}\\ \\text{右向き}\\ 3\\,\\mathrm{N/C}`,60,60,{size:30,anchor:'start'}));
  s+=fade(seg(p,.4,.55),boxScene({field:0,faceHL:[['left','#c9d6ee'],['right','#c9d6ee']]}));
  s+=card(800,150,360,190,label('左右の面',980,205,{size:28,color:C.ink,anchor:'middle'})+label('電場に 垂直',980,250,{size:28,color:C.ink,anchor:'middle'})+label('面積 2 m²',980,305,{size:32,color:'#c9d6ee',anchor:'middle',weight:700}),seg(p,.45,.6));
  return s;
 },
 [K+'normals']:(p)=>{
  let s=boxScene({})+T(`${vE}\\ 3\\,\\mathrm{N/C}`,60,60,{size:30,anchor:'start'});
  const order=['left','right','top','bottom','front','back'];
  order.forEach((f,i)=>{s+=boxNormals([f],{g:seg(p,.12+i*.12,.22+i*.12)});});
  s+=card(840,130,320,140,label('6面すべてに',1000,185,{size:28,color:C.ink,anchor:'middle'})+label('外向きの 法線',1000,235,{size:32,color:NC,anchor:'middle',weight:700}),seg(p,.02,.12),NC);
  return s;
 },
 [K+'left']:(p)=>{
  let s=boxScene({faceHL:[['left',NEGV]]})+T(`${vE}\\ 3\\,\\mathrm{N/C}`,60,60,{size:30,anchor:'start'});
  s+=boxNormals(['left','right','top','bottom','front','back'],{hl:'left',vals:p>.7?{left:'−6'}:null});
  s+=card(800,130,360,270,label('左の面',980,180,{size:30,color:C.ink,anchor:'middle',weight:700})
   +label('電場 → ／ 法線 ←',980,230,{size:26,color:C.ink,anchor:'middle'})+label('逆向き：入る',980,275,{size:28,color:NEGV,anchor:'middle'})
   +fade(seg(p,.55,.7),T(`-3\\times 2=${cs(NEGV,'-6')}`,980,350,{size:40})),seg(p,.05,.2),NEGV);
  return s;
 },
 [K+'right']:(p)=>{
  let s=boxScene({faceHL:[['right',HI]]})+T(`${vE}\\ 3\\,\\mathrm{N/C}`,60,60,{size:30,anchor:'start'});
  s+=boxNormals(['left','right','top','bottom','front','back'],{hl:'right',vals:p>.7?{left:'−6',right:'+6'}:{left:'−6'}});
  s+=card(800,130,360,270,label('右の面',980,180,{size:30,color:C.ink,anchor:'middle',weight:700})
   +label('電場 → ／ 法線 →',980,230,{size:26,color:C.ink,anchor:'middle'})+label('同じ向き：出る',980,275,{size:28,color:HI,anchor:'middle'})
   +fade(seg(p,.55,.7),T(`+3\\times 2=${cs(HI,'+6')}`,980,350,{size:40})),seg(p,.05,.2),HI);
  return s;
 },
 [K+'others']:(p)=>{
  const g=seg(p,.55,.7);
  let s=boxScene({faceHL:[['top',NC],['front',NC]]})+T(`${vE}\\ 3\\,\\mathrm{N/C}`,60,60,{size:30,anchor:'start'});
  const vals=g>.5?{...VAL3}:{left:'−6',right:'+6'};
  s+=boxNormals(['left','right','top','bottom','front','back'],{vals});
  s+=card(800,130,360,270,label('上・下・手前・奥',980,180,{size:28,color:C.ink,anchor:'middle',weight:700})
   +label('法線 ⊥ 電場',980,230,{size:28,color:NC,anchor:'middle'})+label('面に沿うだけ',980,275,{size:26,color:EC,anchor:'middle'})
   +fade(g,label('4面とも 0',980,345,{size:36,color:HI,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'total']:(p)=>{
  let s=boxScene({})+T(`${vE}\\ 3\\,\\mathrm{N/C}`,60,60,{size:30,anchor:'start'})+boxNormals(['left','right','top','bottom','front','back'],{vals:VAL3});
  s+=card(760,140,400,250,label('合計',960,190,{size:28,color:C.dim,anchor:'middle'})
   +T(`(${cs(NEGV,'-6')})+${cs(HI,'6')}+0+0+0+0`,960,260,{size:32})
   +fade(seg(p,.5,.65),T(`=${cs(HI,'0')}`,960,335,{size:52})),seg(p,.05,.2),HI);
  return s;
 },
 [K+'predict']:(p)=>{
  let s=boxScene({inside:0})+T(`${vE}\\ 3\\,\\mathrm{N/C}`,60,60,{size:30,anchor:'start'})+boxNormals(['left','right','top','bottom','front','back'],{vals:VAL3,g:.5});
  s+=fade(seg(p,.1,.3),label('？',V(BA/2,BB/2,BC/2)[0],V(BA/2,BB/2,BC/2)[1]+22,{size:64,color:HI,anchor:'middle',weight:700}));
  s+=card(760,130,400,270,label('合計 0',960,190,{size:34,color:HI,anchor:'middle',weight:700})
   +label('なら 箱の中に',960,250,{size:28,color:C.ink,anchor:'middle'})+label('電場は ない？',960,300,{size:34,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.4,.55),label('予想してみよう',960,365,{size:26,color:HI,anchor:'middle'})),seg(p,.05,.2),HI);
  return s;
 },
 // ===== S5 合計0が語ること =====
 [K+'answer']:(p)=>{
  const g=seg(p,.15,.35);
  let s=boxScene({inside:1})+T(`${vE}\\ 3\\,\\mathrm{N/C}`,60,60,{size:30,anchor:'start'});
  const [cx,cy]=V(BA/2,BB/2,BC/2);
  s+=fade(g,highlight(cx-70,cy-75,140,150,1,EC)+label('中も 3 N/C',cx,V(BA/2,0,0)[1]+44,{size:28,color:EC,anchor:'middle',weight:700}));
  s+=card(760,130,400,270,label('答え：言えない',960,190,{size:34,color:C.a,anchor:'middle',weight:700})
   +label('中の電場は',960,250,{size:28,color:C.ink,anchor:'middle'})+label('右向き 3 N/C のまま',960,300,{size:32,color:EC,anchor:'middle',weight:700})
   +fade(seg(p,.6,.75),label('箱は 頭の中の面',960,360,{size:26,color:C.dim,anchor:'middle'})),seg(p,.05,.2),C.a);
  return s;
 },
 [K+'fixed']:(p)=>{
  // 補助線②：合計0の横に、中の電場の矢印を残したまま
  let s=boxScene({inside:1})+boxNormals(['left','right'],{vals:{left:'−6',right:'+6'}});
  const [cx,cy]=V(BA/2,BB/2,BC/2);s+=highlight(cx-70,cy-75,140,150,1,EC);
  s+=card(740,100,420,160,label('変わらない：各点の 矢印',950,160,{size:28,color:EC,anchor:'middle',weight:700})+label('（中も 3 N/C）',950,210,{size:26,color:EC,anchor:'middle'}),seg(p,.05,.2),EC);
  s+=card(740,290,420,170,label('0 になったのは 足し方',950,340,{size:28,color:HI,anchor:'middle',weight:700})
   +fade(seg(p,.4,.6),T(`(${cs(NEGV,'-6')})+(${cs(HI,'+6')})=0`,950,410,{size:38})),seg(p,.3,.45),HI);
  return s;
 },
 [K+'meaning']:(p)=>{
  let s=boxScene({inside:1})+boxNormals(['left','right','top','bottom','front','back'],{vals:VAL3,g:.7});
  s+=card(740,110,420,330,label('合計 0 が 語ること',950,165,{size:28,color:C.dim,anchor:'middle'})
   +label('入った分だけ 出た',950,225,{size:36,color:HI,anchor:'middle',weight:700})
   +fade(seg(p,.45,.6),label('✕ 各面が 0',950,310,{size:28,color:C.a,anchor:'middle'})+label('✕ 中の電場が 0',950,360,{size:28,color:C.a,anchor:'middle'})+label('とは 限らない',950,410,{size:26,color:C.ink,anchor:'middle'})),seg(p,.05,.2),HI);
  return s;
 },
 [K+'counter']:(p)=>{
  let s=boxScene({inside:1});
  const [cx,cy]=V(BA/2,BB/2,BC/2);s+=highlight(cx-70,cy-75,140,150,1,EC);
  s+=card(740,120,420,300,label('反例 1つ',950,180,{size:32,color:HI,anchor:'middle',weight:700})
   +label('合計 0 ／ 中の電場 3 N/C',950,240,{size:26,color:C.ink,anchor:'middle'})
   +fade(seg(p,.45,.6),label('「合計 0 なら 場は 0」',950,315,{size:28,color:C.ink,anchor:'middle'})+label('→ 正しくない',950,370,{size:34,color:C.a,anchor:'middle',weight:700})),seg(p,.05,.2),HI);
  return s;
 },
 [K+'check']:(p)=>{
  let s=boxScene({inside:1,E:5})+T(`${vE}\\ 5\\,\\mathrm{N/C}`,60,60,{size:30,anchor:'start'});
  s+=boxNormals(['left','right','top','bottom','front','back'],{vals:{left:'−10',right:'+10',top:'0',bottom:'0',front:'0',back:'0'}});
  s+=card(760,130,400,280,label('確かめ：5 N/C',960,185,{size:30,color:C.ink,anchor:'middle',weight:700})
   +T(`\\text{左}\\ -5\\times 2=${cs(NEGV,'-10')}`,960,240,{size:32})+T(`\\text{右}\\ +5\\times 2=${cs(HI,'+10')}`,960,290,{size:32})
   +fade(seg(p,.3,.45),label('合計 0',960,345,{size:34,color:HI,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),label('中の電場は 5 N/C',960,392,{size:30,color:EC,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'differ']:(p)=>{
  let s=card(80,110,480,300,label('合計',320,170,{size:32,color:HI,anchor:'middle',weight:700})
   +label('面ごとの値を 足した',320,240,{size:28,color:C.ink,anchor:'middle'})+label('一つの 数',320,300,{size:34,color:HI,anchor:'middle',weight:700}),seg(p,.05,.2),HI);
  let arrows='';for(let i=0;i<4;i++)for(let j=0;j<2;j++){const x=730+i*90,y=270+j*60;arrows+=arrow(x,y,x+60,y,{color:EC,w:4,head:13});}
  s+=card(640,110,480,300,label('場',880,170,{size:32,color:EC,anchor:'middle',weight:700})+label('場所ごとの 矢印',880,215,{size:28,color:C.ink,anchor:'middle'})+arrows,seg(p,.35,.5),EC);
  s+=fade(seg(p,.6,.75),label('別のもの',600,470,{size:32,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S6 次の問い =====
 [K+'summary']:(p)=>{
  let s=label('まとめ',600,70,{size:30,color:C.dim,anchor:'middle'});
  s+=card(80,110,500,300,label('1枚の面',330,165,{size:30,color:C.ink,anchor:'middle',weight:700})+T(`\\Phi=${cs(HI,'E_{\\perp}')}\\,A`,330,260,{size:52})+label('単位 N·m²/C',330,350,{size:26,color:C.dim,anchor:'middle'}),seg(p,.02,.15));
  s+=card(620,110,500,300,label('閉じた面',870,165,{size:30,color:C.ink,anchor:'middle',weight:700})+label('法線は 外向き',870,230,{size:30,color:NC,anchor:'middle'})
   +label('出る ＝ 正',870,295,{size:30,color:HI,anchor:'middle',weight:700})+label('入る ＝ 負',870,350,{size:30,color:NEGV,anchor:'middle',weight:700}),seg(p,.4,.55));
  return s;
 },
 [K+'summary2']:(p)=>{
  let s=boxScene({inside:1})+boxNormals(['left','right','top','bottom','front','back'],{vals:VAL3,g:.7});
  const [cx,cy]=V(BA/2,BB/2,BC/2);s+=highlight(cx-70,cy-75,140,150,1,EC);
  s+=card(760,140,400,230,label('合計 0',960,205,{size:36,color:HI,anchor:'middle',weight:700})+label('でも 中の電場は',960,265,{size:28,color:C.ink,anchor:'middle'})+label('3 N/C のまま',960,320,{size:32,color:EC,anchor:'middle',weight:700}),seg(p,.05,.2));
  return s;
 },
 [K+'next']:(p)=>{
  const pts=blobPts(140);let s=closedPath(pts,330,275,{w:4});
  s+=fade(seg(p,.1,.3),charge(330,275,1,28));
  s+=fade(seg(p,.2,.4),label('？',420,200,{size:56,color:HI,weight:700}));
  s+=card(660,140,500,230,label('次の問い',910,195,{size:26,color:C.dim,anchor:'middle'})+label('袋の中に 電荷を入れると',910,260,{size:30,color:C.ink,anchor:'middle'})+label('合計は どう変わる？',910,315,{size:34,color:HI,anchor:'middle',weight:700}),seg(p,.3,.5),HI);
  return s;
 },
};

// YouTube シリーズ「線積分と面積分・初級 1/2」(ys-ui-electric-work-path-1) — 図。Stage 1200×515.
// 色：電場 𝐄 水色(C.x)、道に沿う部分（影）黄(C.hi)、道に直角な部分 桃(C.p)、仕事 ΔW 橙(C.E)、負 赤(C.a)、電荷 +1 C 赤い丸。
// 区間の矢印 Δ𝐫₁〜Δ𝐫₄ は区間ごとの色（青・紫・銀・薔薇）。2/2 の棒グラフも同じ色。右が進む向きの基準ではなく、各区間の矢印の向きが「進む向き」。
// ステージ ui-electric-work-path の数値：区間1 0°・1 m・𝐄 5 N/C（道から 53°）→ 沿う 3・直角 4 → 3 J。
// 区間2 30°・2 m・𝐄 真上 2 N/C（道と 60°）→ 沿う 1・直角 √3≈1.73 → 2 J。区間3 70°・1 m・𝐄 2 N/C 直角 → 0 J。区間4 20°・1 m・𝐄 2 N/C 逆向き → −2 J。
// 共通の部品は export して 2/2 でも使う（関数の export は図の登録に入らない）。
import {C,clamp,mix,seg,fade,move,label,line,rect,dot,ring,draw,arrow,highlight,axes,tex,poly} from './anim.mjs';

const K='ui-electric-work-path-1:';
export const EC=C.x,AL=C.hi,PP=C.p,WC=C.E,NG=C.a,QC='#ff6b6b';
export const SCOL=['#6f9dff','#c49bff','#b8c4d8','#f06a8a'];
export const SUB='₁₂₃₄';
export const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
export const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
export const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
export const cross=(x,y,sz=16,color=C.a)=>line(x-sz,y-sz,x+sz,y+sz,{color,w:4})+line(x-sz,y+sz,x+sz,y-sz,{color,w:4});
const rad=d=>d*Math.PI/180;
export const vE=cs(EC,'\\mathbf{E}'),Epar=i=>cs(AL,`E_{\\parallel${i?' '+i:''}}`),dr=i=>`\\Delta r${i?'_'+i:''}`,vdr=i=>`\\Delta\\mathbf{r}${i?'_'+i:''}`;

// ---- the path ----------------------------------------------------------------------------
// deg: direction of the step (0 = right, counter-clockwise), m: length [m], mag/edir: field [N/C] and its direction.
export const SEGS=[
 {deg:0, m:1,mag:5,edir:53.13,ang:53,par:3,perp:4,dW:3},
 {deg:30,m:2,mag:2,edir:90,  ang:60,par:1,perp:1.73,dW:2},
 {deg:70,m:1,mag:2,edir:-20, ang:90,par:0,perp:2,dW:0},
 {deg:20,m:1,mag:2,edir:200, ang:180,par:-2,perp:0,dW:-2},
];
export const VERT=(()=>{const v=[[0,0]];for(const s of SEGS){const [x,y]=v[v.length-1];v.push([x+s.m*Math.cos(rad(s.deg)),y+s.m*Math.sin(rad(s.deg))]);}return v;})();
// Catmull–Rom through the vertices; t in [0,4] (t = k lands on vertex k).
export function curveAt(t){
 const n=VERT.length-1,tt=clamp(t,0,n),i=Math.min(Math.floor(tt),n-1),f=tt-i;
 const P=k=>VERT[clamp(k,0,n)];const p0=P(i-1),p1=P(i),p2=P(i+1),p3=P(i+2);
 const h=(a,b,c,d)=>.5*(2*b+(-a+c)*f+(2*a-5*b+4*c-d)*f*f+(-a+3*b-3*c+d)*f*f*f);
 return [h(p0[0],p1[0],p2[0],p3[0]),h(p0[1],p1[1],p2[1],p3[1])];
}
export const view=(ox,oy,sc)=>([u,v])=>[ox+sc*u,oy-sc*v];
export function curveSvg(V,{p=1,color=C.ink,w=5,opacity=1,dash=''}={}){
 return draw(Array.from({length:161},(_,i)=>V(curveAt(4*i/160))),p,{color,w,opacity,dash});
}
export function charge(x,y,{g=1,text='+1 C',r=13}={}){
 return fade(g,ring(x,y,r,{color:QC,w:3,fill:'#3a1d2a'})+label('+',x,y+r*.42,{size:r*1.5,color:QC,anchor:'middle',weight:700})+(text?label(text,x,y-r-12,{size:22,color:QC,anchor:'middle',weight:700}):''));
}
// Overview: curve + chords + field arrows at the chord midpoints.
// o: {ox,oy,sc, curve, chords(0..1), hl (index or -1), E (g), Esc px per N/C, lab (Δr labels), len (length labels), dimOthers}
export function overview({ox=110,oy=420,sc=105,curve=1,curveOp=.55,chords=0,hl=-1,E=0,Esc=22,lab=0,len=0,dimOthers=0,only=null}={}){
 const V=view(ox,oy,sc);let s=curveSvg(V,{p:curve,color:C.dim,w:5,opacity:chords>0?curveOp*(1-.5*chords):1});
 s+=fade(curve,dot(...V(VERT[0]),6,C.dim)+dot(...V(VERT[4]),6,C.dim));
 SEGS.forEach((q,i)=>{
  if(only&&!only.includes(i))return;
  const a=V(VERT[i]),b=V(VERT[i+1]),mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;
  const op=hl>=0&&i!==hl?1-.7*dimOthers:1;
  const ux=Math.cos(rad(q.deg)),uy=-Math.sin(rad(q.deg));
  s+=fade(chords*op,arrow(a[0],a[1],b[0],b[1],{color:SCOL[i],w:i===hl?7:5,head:16}));
  s+=fade(lab*op,T(`${vdr(i+1)}`,mx+uy*30,my-ux*30+10,{size:26,color:SCOL[i]}));
  s+=fade(len*op,label(`${q.m} m`,mx-uy*32,my+ux*32+10,{size:22,color:SCOL[i],anchor:'middle',weight:700}));
  const ex=Math.cos(rad(q.edir))*q.mag*Esc,ey=-Math.sin(rad(q.edir))*q.mag*Esc;
  s+=fade(E*op,dot(mx,my,4,EC)+arrow(mx,my,mx+ex,my+ey,{color:EC,w:4,head:13}));
 });
 return s;
}
export const chargeAt=(t,{ox=110,oy=420,sc=105,g=1,text='+1 C'}={})=>{const [x,y]=view(ox,oy,sc)(curveAt(t));return charge(x,y,{g,text});};

// Zoom on one segment: dashed path line, Δr arrow (offset to the right of travel), field arrow at the tail,
// optional "light" perpendicular to the path, the shadow (along part) and the perpendicular part.
export function zoom(i,{tx,ty,sc=(i===0?60:90),lpx=150,gE=1,gDr=1,gLight=0,gAlong=0,gPerp=0,gTri=0,gArc=0,labE=true,labA='',labP='',labDr=true,arcText=''}={}){
 const q=SEGS[i],ux=Math.cos(rad(q.deg)),uy=-Math.sin(rad(q.deg)),ds=i===2?-1:1,nx=-uy*ds,ny=ux*ds;// n: side of the Δr arrow (right of travel; left for segment 3)
 const ex=Math.cos(rad(q.edir))*q.mag*sc,ey=-Math.sin(rad(q.edir))*q.mag*sc;
 const a=q.mag*Math.cos(rad(q.edir-q.deg)),fx=tx+a*sc*ux,fy=ty+a*sc*uy;// foot of the shadow
 const L=q.m*lpx;let s='';
 s+=line(tx-190*ux,ty-190*uy,tx+(L+70)*ux,ty+(L+70)*uy,{color:C.faint,w:3,dash:'10 8'});
 s+=fade(gDr,arrow(tx+36*nx,ty+36*ny,tx+36*nx+L*ux,ty+36*ny+L*uy,{color:SCOL[i],w:5,head:16})
  +line(tx+22*nx,ty+22*ny,tx+50*nx,ty+50*ny,{color:SCOL[i],w:2})+(labDr?T(`${vdr(i+1)}`,tx+36*nx+L/2*ux+34*nx,ty+36*ny+L/2*uy+34*ny+10,{size:26,color:SCOL[i]})
  +label(`${q.m} m`,tx+36*nx+L/2*ux+82*nx+(i===1?30:0),ty+36*ny+L/2*uy+82*ny+8,{size:24,color:SCOL[i],anchor:'middle',weight:700}):''));
 // triangle tail–foot–tip
 if(gTri>0&&q.perp>0&&Math.abs(a)>.01)s+=fade(gTri,poly([[tx,ty],[fx,fy],[tx+ex,ty+ey]],{fill:C.hi,fo:.12,stroke:C.hi,sw:1.5}));
 // light perpendicular to the path, from the side where the field tip is
 if(gLight>0){
  const side=Math.sign((ex*nx+ey*ny))||-1;// +1: tip on the right of travel
  let l='';for(let k=(i===2?1:-1);k<=(i===2?4:2);k++){const bx=tx+(a*sc*.5+k*48)*ux,by=ty+(a*sc*.5+k*48)*uy;const d=q.perp*sc+(i===2?90:30);
   l+=arrow(bx+side*(d+46)*nx,by+side*(d+46)*ny,bx+side*(d+10)*nx,by+side*(d+10)*ny,{color:C.hi,w:3,head:10,opacity:.75});}
  l+=line(tx+ex,ty+ey,fx,fy,{color:C.hi,w:2.5,dash:'6 6',opacity:.9});
  s+=fade(gLight,l);
 }
 if(gArc>0&&q.ang>0&&q.ang<180){
  const d0=q.deg,d1=q.edir,r=48,pts=Array.from({length:25},(_,k)=>{const d=rad(mix(d0,d1,k/24));return [tx+r*Math.cos(d),ty-r*Math.sin(d)];});
  const dm=rad((d0+d1)/2);
  s+=fade(gArc,draw(pts,1,{color:C.ink,w:3})+(arcText?label(arcText,tx+(r+30)*Math.cos(dm)+(i===0?10:0),ty-(r+30)*Math.sin(dm)+8,{size:24,color:C.ink,anchor:'middle',weight:700}):''));
 }
 s+=fade(gE,arrow(tx,ty,tx+ex,ty+ey,{color:EC,w:6,head:20}));
 if(labE){const [lx,ly,an]=i===3?[tx+ex-10,ty+ey+42,'middle']:i===1?[tx+ex-18,ty+ey+4,'end']:[tx+ex+18,ty+ey-6,'start'];
  s+=fade(gE,T(vE,lx,ly,{size:32,anchor:an})+label(`${q.mag} N/C`,lx,ly+36,{size:24,color:EC,anchor:an,weight:700}));}
 // along part (shadow)
 if(Math.abs(a)>.01){const col=a>0?AL:NG;s+=fade(gAlong,line(tx,ty,fx,fy,{color:col,w:14,cap:'butt',opacity:.55})+arrow(tx,ty,fx,fy,{color:col,w:6,head:18}));}
 else s+=fade(gAlong,ring(tx,ty,11,{color:AL,w:4}));
 if(labA){const [lx,ly,an]=i===0?[(tx+fx)/2,ty-16,'middle']:i===1?[tx-40,ty+14,'end']:i===2?[tx-30,ty+40,'end']:[(tx+fx)/2-nx*30,(ty+fy)/2-ny*30+8,'middle'];
  s+=fade(gAlong,label(labA,lx,ly,{size:24,color:a<0?NG:AL,anchor:an,weight:700}));}
 // perpendicular part: from the foot to the tip
 if(q.perp>0){s+=fade(gPerp,arrow(fx,fy,tx+ex,ty+ey,{color:PP,w:5,head:16}));
  if(labP)s+=fade(gPerp,label(labP,(fx+tx+ex)/2+(i===0?16:14),(fy+ty+ey)/2+8,{size:24,color:PP,weight:700}));}
 return s;
}
export function mini(i,{x=940,y=40,w=220,h=140}={}){
 // small map of the whole path in a corner, the current segment highlighted
 const sc=46,ox=x+18,oy=y+h-16;
 return rect(x,y,w,h,{fill:'#0f1830',fo:.9,stroke:C.faint,sw:2,rx:10})+overview({ox,oy,sc,curve:1,curveOp:.5,chords:1,hl:i,dimOthers:1,E:0})
  +label(`区間${i+1}`,x+12,y+30,{size:22,color:SCOL[i],weight:700});
}
export const TX=[[250,420],[230,430],[330,360],[420,300]];

// ---- local pictures ----------------------------------------------------------------------
const O={ox:170,oy:470,sc:140,Esc:30};
function recipeCard(x,y,g=1,hl=-1){
 const rows=['① 電場を、道に沿う部分と','　 直角な部分に 分ける','② 直角な部分は 捨てる','③ 沿う部分 × 電荷 × 長さ'];
 const cols=[C.ink,C.ink,PP,AL];
 return card(x,y,440,230,rows.map((r,k)=>label(r,x+26,y+56+k*50,{size:28,color:hl===k||hl<0?cols[k]:C.dim,weight:hl===k?700:400})).join(''),g,C.hi);
}
function seg1Calc(p,{x=680,y=220}={}){
 return card(x,y,480,250,T(`\\Delta W_1=q\\,${Epar(1)}\\,${dr(1)}`,x+240,y+60,{size:40})
  +fade(seg(p,.25,.4),T(`=${cs(QC,'1\\,\\mathrm{C}')}\\times${cs(AL,'3\\,\\mathrm{N/C}')}\\times${cs(SCOL[0],'1\\,\\mathrm{m}')}`,x+240,y+135,{size:36}))
  +fade(seg(p,.6,.75),T(`=${cs(WC,'3\\,\\mathrm{J}')}`,x+240,y+210,{size:46})),seg(p,0,.12));
}
function seg2Calc(p,{x=680,y=220}={}){
 return card(x,y,480,250,T(`\\Delta W_2=q\\,${Epar(2)}\\,${dr(2)}`,x+240,y+60,{size:40})
  +fade(seg(p,.2,.35),T(`=${cs(QC,'1\\,\\mathrm{C}')}\\times${cs(AL,'1\\,\\mathrm{N/C}')}\\times${cs(SCOL[1],'2\\,\\mathrm{m}')}`,x+240,y+135,{size:36}))
  +fade(seg(p,.5,.65),T(`=${cs(WC,'2\\,\\mathrm{J}')}`,x+240,y+210,{size:46})),seg(p,0,.12));
}
function straight(p,{E=1,q=1,move=0,dr=0,comp=0}={}){
 // a straight horizontal path with a uniform field 3 N/C along it
 const y=300,x0=160,x1=1040,u=120;let s=line(x0-40,y,x1+40,y,{color:C.dim,w:5})+label('まっすぐな道',x0-40,y-40,{size:24,color:C.dim});
 for(let k=0;k<4;k++){const x=x0+60+k*230;s+=fade(E,arrow(x,y-80,x+3*30,y-80,{color:EC,w:5,head:15}));}
 s+=fade(E,T(vE,x0+60,y-120,{size:30})+label('3 N/C（道に沿う向き）',x0+100,y-112,{size:24,color:EC,weight:700}));
 const cx=mix(x0+200,x0+200+8.33*u*.6,move);
 s+=fade(dr,line(x0+200,y+36,x0+200,y+64,{color:SCOL[0],w:2})+arrow(x0+200,y+50,x0+200+300,y+50,{color:SCOL[0],w:5,head:16})+label('1 m',x0+350,y+90,{size:26,color:SCOL[0],anchor:'middle',weight:700}));
 s+=charge(mix(x0+200,x0+500,move),y,{g:q});
 return s;
}

export const ytUiElectricWorkPath1Diagrams={
 // ===== S1 前回の問い =====
 [K+'intro']:(p)=>{
  let s=overview({...O,curve:seg(p,.05,.4),E:seg(p,.35,.6)});
  s+=chargeAt(4*seg(p,.45,.95),{...O,g:seg(p,.4,.5)});
  s+=fade(seg(p,.1,.3),label('電場の中の 曲がった道',80,70,{size:28,color:C.dim}));
  s+=card(850,90,320,150,label('電場がする仕事',1010,150,{size:28,color:C.ink,anchor:'middle'})+label('どう数える？',1010,205,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'vary']:(p)=>{
  let s=overview({...O,E:1});
  // tangent arrows at 4 places, shown one by one
  [.5,1.5,2.5,3.5].forEach((t,k)=>{const V=view(O.ox,O.oy,O.sc);const [x,y]=V(curveAt(t)),[x2,y2]=V(curveAt(t+.08));const d=Math.hypot(x2-x,y2-y);
   s+=fade(seg(p,.45+k*.08,.55+k*.08),arrow(x,y,x+(x2-x)/d*60,y+(y2-y)/d*60,{color:C.ink,w:3,head:11}));});
  s+=fade(seg(p,.05,.25),label('矢印の 向きも 長さも 場所ごとに 違う',80,70,{size:26,color:EC}));
  s+=fade(seg(p,.5,.7),label('進む向き（白）も 変わる',80,110,{size:26,color:C.ink}));
  return s;
 },
 [K+'plan']:(p)=>{
  let s=overview({...O,E:.35,chords:seg(p,.1,.35),curveOp:.6});
  s+=card(820,120,350,220,label('短い区間に 分けて',995,185,{size:28,color:C.ink,anchor:'middle'})+label('掛け算 → 足し算',995,250,{size:32,color:C.hi,anchor:'middle',weight:700})+label('だけで 数える',995,305,{size:26,color:C.ink,anchor:'middle'}),seg(p,.3,.45),C.hi);
  return s;
 },
 // ===== S2 まっすぐな道なら =====
 [K+'tools']:(p)=>{
  let s=label('ベクトルの回',80,70,{size:24,color:C.dim});
  s+=charge(250,260,{text:'+1 C'})+arrow(263,260,420,260,{color:EC,w:6,head:18})+T(vE,440,270,{size:34,anchor:'start'});
  s+=label('＋1 C が 受ける力 ＝ 電場',160,350,{size:28,color:EC,weight:700});
  s+=fade(seg(p,.5,.65),card(660,130,480,200,T(`${cs(C.F,'\\mathbf{F}')}=q\\,${vE}`,900,215,{size:60})+label('電荷 q が 受ける力',900,290,{size:26,color:C.ink,anchor:'middle'}),1,C.F));
  return s;
 },
 [K+'workdef']:(p)=>{
  // an oblique field at a horizontal step: along part counts, perpendicular part does not
  let s=label('内積の回',80,70,{size:24,color:C.dim});
  s+=zoom(0,{tx:230,ty:400,gAlong:seg(p,.2,.4),gPerp:seg(p,.45,.6),labP:'直角な成分',labDr:false,gDr:0});
  s+=fade(seg(p,.1,.2),arrow(230,470,560,470,{color:C.ink,w:4,head:14})+label('進む向き',400,505,{size:22,color:C.ink,anchor:'middle'}));
  s+=card(660,110,500,260,label('仕事 ＝',700,180,{size:30,color:C.ink})+label('進む向きの成分 × 距離',720,235,{size:32,color:AL,weight:700})
   +fade(seg(p,.55,.7),label('直角な成分 → 仕事 0',720,320,{size:30,color:PP,weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'straight']:(p)=>straight(p,{E:seg(p,.05,.3),q:seg(p,.35,.5),dr:seg(p,.55,.7),move:seg(p,.6,.95)}),
 [K+'straight3']:(p)=>{
  let s=move(0,-40,straight(p,{dr:1,move:1}));
  s+=card(250,370,700,140,T(`${cs(C.F,'F')}=${cs(QC,'1\\,\\mathrm{C}')}\\times${cs(EC,'3\\,\\mathrm{N/C}')}=${cs(C.F,'3\\,\\mathrm{N}')}`,600,412,{size:36})
   +fade(seg(p,.45,.6),T(`W=${cs(C.F,'3\\,\\mathrm{N}')}\\times${cs(SCOL[0],'1\\,\\mathrm{m}')}=${cs(WC,'3\\,\\mathrm{J}')}`,600,478,{size:36})),seg(p,0,.12));
  return s;
 },
 [K+'formula']:(p)=>{
  let s=T(`\\Delta W=q\\,${Epar()}\\,${dr()}`,600,130,{size:84});
  s+=fade(seg(p,.35,.5),T(Epar(),330,270,{size:44})+label('：電場のうち、進む向きに沿った成分 [N/C]',370,282,{size:30,color:AL}));
  s+=fade(seg(p,.65,.8),T('\\parallel',330,360,{size:44,color:C.ink})+label('：「平行」を表す記号',370,372,{size:30,color:C.ink}));
  return s;
 },
 [K+'symbols']:(p)=>{
  let s=T(`\\Delta W=q\\,${Epar()}\\,${dr()}`,600,130,{size:84});
  s+=fade(.45,T(Epar(),330,270,{size:44})+label('：電場のうち、進む向きに沿った成分 [N/C]',370,282,{size:30,color:AL}));
  s+=fade(seg(p,.05,.2),T(dr(),330,350,{size:44,color:C.ink})+label('：区間の長さ [m]',370,362,{size:30,color:C.ink}));
  s+=fade(seg(p,.25,.4),T('\\Delta W',330,430,{size:44,color:WC})+label('：その区間で 電場がした仕事 [J]',370,442,{size:30,color:WC}));
  s+=fade(seg(p,.6,.75),label('Δ ＝「小さな一区間の」という印',880,500,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'units']:(p)=>{
  let s=T(`\\Delta W=q\\,${Epar()}\\,${dr()}`,600,110,{size:64});
  s+=fade(seg(p,.05,.2),T(`\\mathrm{C}\\times\\mathrm{\\frac{N}{C}}\\times\\mathrm{m}`,600,260,{size:60,color:C.ink}));
  s+=fade(seg(p,.35,.5),line(450,255,488,213,{color:NG,w:4})+line(578,292,616,250,{color:NG,w:4}));
  s+=fade(seg(p,.55,.7),T(`=\\mathrm{N\\cdot m}=${cs(WC,'\\mathrm{J}')}`,600,390,{size:60,color:C.ink}));
  return s;
 },
 [K+'ex']:(p)=>{
  let s=card(80,110,480,300,label('ベクトルの回',320,165,{size:26,color:C.dim,anchor:'middle'})+arrow(140,320,500,320,{color:C.dim,w:4,head:14})+label('まっすぐ右',320,360,{size:24,color:C.dim,anchor:'middle'})
   +T(cs(AL,'E_x'),320,250,{size:54})+label('右向きの成分',320,295,{size:24,color:AL,anchor:'middle'}),1);
  const V=view(800,395,40);
  s+=card(640,110,480,300,label('今回',880,165,{size:26,color:C.dim,anchor:'middle'})+curveSvg(V,{color:C.dim,w:4})+T(Epar(),880,250,{size:54})
   +label('その場所の 進む向きに 沿った成分',880,295,{size:24,color:AL,anchor:'middle'}),seg(p,.3,.45),C.hi);
  return s;
 },
 // ===== S3 曲線を区間に分ける =====
 [K+'curveback']:(p)=>{
  let s=overview({...O,E:1});
  const V=view(O.ox,O.oy,O.sc);
  [.5,1.5,2.5,3.5].forEach((t,k)=>{const [x,y]=V(curveAt(t)),[x2,y2]=V(curveAt(t+.08));const d=Math.hypot(x2-x,y2-y);
   s+=arrow(x,y,x+(x2-x)/d*60,y+(y2-y)/d*60,{color:C.ink,w:3,head:11});});
  s+=fade(seg(p,.3,.5),card(820,110,350,190,label('電場と 進む向きの',995,175,{size:26,color:C.ink,anchor:'middle'})+label('角度が 場所ごとに',995,225,{size:28,color:C.hi,anchor:'middle',weight:700})+label('違う',995,270,{size:28,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
  return s;
 },
 [K+'noone']:(p)=>{
  let s=overview({...O,E:1});
  s+=card(760,110,410,250,tex('?',965,190,{size:60,color:C.hi,auto:false})+label('どの長さに',965,250,{size:30,color:C.ink,anchor:'middle'})+label('どの成分を 掛ける？',965,305,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  s+=fade(seg(p,.35,.5),cross(260,120,14)+label('掛け算 1回 では 無理',290,130,{size:26,color:NG,weight:700}));
  return s;
 },
 [K+'recallint']:(p)=>{
  const A=axes({x:140,y:430,w:520,h:280,xmax:3.4,ymax:5,xticks:[1,2,3],yticks:[2,3,4],xlabel:'t [s]',ylabel:'速さ v [m/s]',xcolor:C.t,ycolor:C.v,grid:true});
  let s=label('積分の回',80,70,{size:24,color:C.dim})+A.svg+A.plot(u=>1.6+0.9*u,{from:0,to:3.2,color:C.v,w:4});
  [2,3,4].forEach((h,k)=>{s+=fade(seg(p,.25+k*.12,.37+k*.12),rect(A.X(k),A.Y(h),A.X(1)-A.X(0),A.Y(0)-A.Y(h),{fill:C.x,fo:.22,stroke:C.x,sw:2,rx:2}));});
  s+=card(760,140,400,200,label('短く区切ると',960,205,{size:28,color:C.ink,anchor:'middle'})+label('区間の中は 一定',960,265,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'short']:(p)=>{
  let s=overview({...O,E:.5});
  // magnifier on segment 1
  const V=view(O.ox,O.oy,O.sc),[cx,cy]=V([.5,0]);
  s+=fade(seg(p,.1,.3),ring(cx,cy,62,{color:C.hi,w:3})+line(cx+44,cy-44,780,190,{color:C.hi,w:2,opacity:.6}));
  s+=fade(seg(p,.25,.45),ring(900,220,150,{color:C.hi,w:3,fill:'#0f1830'})+line(770,250,1030,250,{color:C.ink,w:5})
   +[800,900,1000].map(x=>arrow(x,250,x+3*22,250-4*22,{color:EC,w:4,head:13})).join(''));
  s+=fade(seg(p,.55,.7),label('道 ≈ まっすぐ、電場 ≈ 一定',900,420,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'split']:(p)=>{
  let s=overview({...O,E:0,chords:seg(p,.1,.5),lab:seg(p,.45,.7),curveOp:.8});
  s+=fade(seg(p,.1,.3),[1,2,3].map(k=>dot(...view(O.ox,O.oy,O.sc)(VERT[k]),7,C.hi)).join(''));
  s+=fade(seg(p,.55,.75),card(850,120,320,150,T(`${vdr(1)}\\sim${vdr(4)}`,1010,185,{size:42,color:C.ink})+label('4本の 矢印',1010,245,{size:26,color:C.ink,anchor:'middle'}),1));
  return s;
 },
 [K+'lengths']:(p)=>{
  let s=overview({...O,E:0,chords:1,lab:1,len:seg(p,.1,.35),curveOp:.8});
  s+=card(820,100,350,260,label('矢印の向き ＝ 進む向き',995,160,{size:24,color:C.ink,anchor:'middle'})+label('長さ ＝ 区間の長さ',995,205,{size:24,color:C.ink,anchor:'middle'})
   +fade(seg(p,.5,.65),T(`${vdr()}`,900,280,{size:40,color:C.ink})+label('矢印',990,290,{size:26,color:C.ink})+T(`${dr()}`,900,335,{size:40,color:C.ink})+label('その長さ',990,345,{size:26,color:C.ink})),seg(p,0,.15));
  return s;
 },
 [K+'recipe']:(p)=>{
  let s=move(-60,0,zoom(0,{tx:250,ty:410,gAlong:seg(p,.3,.45),gPerp:seg(p,.3,.45),gDr:.6,labE:true}));
  s+=recipeCard(700,120,seg(p,.05,.2));
  return s;
 },
 // ===== S4 区間1 =====
 [K+'s1']:(p)=>{
  let s=mini(0)+zoom(0,{tx:250,ty:420,gE:seg(p,.3,.5),gDr:seg(p,.05,.25),gArc:seg(p,.5,.65),arcText:'53°'});
  return s;
 },
 [K+'s1split']:(p)=>{
  return mini(0)+zoom(0,{tx:250,ty:420,gAlong:seg(p,.2,.45),gPerp:seg(p,.45,.7),labA:'沿う部分',labP:'直角な部分'});
 },
 [K+'s1tri']:(p)=>{
  let s=mini(0)+zoom(0,{tx:250,ty:420,gAlong:1,gPerp:1,gTri:seg(p,.05,.2),labA:'3 N/C',labP:'4 N/C'});
  s+=card(680,230,480,210,T(`${cs(AL,'3')}^2+${cs(PP,'4')}^2=9+16=25`,920,300,{size:40})+fade(seg(p,.5,.65),T(`=${cs(EC,'5')}^2`,920,380,{size:44})),seg(p,.3,.45));
  return s;
 },
 [K+'s1shadow']:(p)=>{
  let s=mini(0)+zoom(0,{tx:250,ty:420,gLight:seg(p,.1,.35),gAlong:seg(p,.35,.55),gPerp:.15,labA:'影 3 N/C'});
  s+=card(680,230,480,180,label('道に 直角に 光を当てる',920,290,{size:28,color:C.hi,anchor:'middle'})+label('影の長さ ＝ 沿う部分',920,355,{size:30,color:AL,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'s1cos']:(p)=>{
  let s=mini(0)+zoom(0,{tx:250,ty:420,gLight:.4,gAlong:1,gPerp:.15,gArc:1,arcText:'53°'});
  s+=card(680,230,480,220,T(`${cs(AL,'E_{\\parallel 1}')}=${cs(EC,'5')}\\cos 53^\\circ`,920,300,{size:40})+fade(seg(p,.4,.55),T(`\\approx ${cs(EC,'5')}\\times 0.6=${cs(AL,'3')}`,920,390,{size:40})),seg(p,.05,.2));
  return s;
 },
 [K+'s1perp']:(p)=>{
  let s=mini(0)+zoom(0,{tx:250,ty:420,gAlong:1,gPerp:1,labA:'3 N/C',labP:'4 N/C'});
  s+=fade(seg(p,.3,.45),cross(395,300,16,PP));
  s+=card(680,230,480,190,label('直角な 4 N/C',920,290,{size:30,color:PP,anchor:'middle',weight:700})+label('道に沿って 速めも 遅くもしない',920,345,{size:26,color:C.ink,anchor:'middle'})+label('→ 仕事に 入らない',920,395,{size:28,color:PP,anchor:'middle',weight:700}),seg(p,.15,.3),PP);
  return s;
 },
 [K+'s1calc']:(p)=>mini(0)+zoom(0,{tx:250,ty:420,gAlong:1,gPerp:.25,labA:'3 N/C'})+seg1Calc(p),
 [K+'s1wrong']:(p)=>{
  let s=mini(0)+zoom(0,{tx:250,ty:420,gAlong:1,gPerp:1,labA:'3 N/C',labP:'4 N/C'});
  s+=card(680,230,480,220,T(`${cs(QC,'1')}\\times${cs(EC,'5')}\\times${cs(SCOL[0],'1')}=5\\,\\mathrm{J}`,920,300,{size:40})+fade(seg(p,.2,.35),line(760,295,1080,295,{color:NG,w:5})+cross(1110,262,14))
   +fade(seg(p,.4,.55),label('直角な部分まで 数えた',920,370,{size:26,color:C.ink,anchor:'middle'})+label('多すぎる値',920,420,{size:30,color:NG,anchor:'middle',weight:700})),seg(p,0,.12),NG);
  return s;
 },
 // ===== S5 区間2 =====
 [K+'s2']:(p)=>{
  return mini(1)+zoom(1,{tx:230,ty:430,gDr:seg(p,.05,.25),gE:seg(p,.35,.55),gArc:seg(p,.6,.75),arcText:'60°'})
   +fade(seg(p,.2,.35),label('30°',330,470,{size:22,color:C.dim}));
 },
 [K+'s2predict']:(p)=>{
  let s=mini(1)+zoom(1,{tx:230,ty:430,gArc:1,arcText:'60°'});
  s+=card(640,220,520,240,label('区間1：3 J',900,280,{size:28,color:SCOL[0],anchor:'middle',weight:700})+label('区間2 は？',900,340,{size:34,color:C.hi,anchor:'middle',weight:700})
   +label('電場は 弱く、傾きも 大きい',900,400,{size:24,color:C.ink,anchor:'middle'})+label('予想してみよう',900,440,{size:22,color:C.hi,anchor:'middle'}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'s2split']:(p)=>{
  let s=mini(1)+zoom(1,{tx:230,ty:430,gArc:1,arcText:'60°',gLight:seg(p,.05,.25),gAlong:seg(p,.25,.45),labA:'1 N/C'});
  s+=card(640,220,520,240,label('60° ＝ 正三角形の 半分の角',900,275,{size:26,color:C.ink,anchor:'middle'})+T('\\cos 60^\\circ=0.5',900,340,{size:38,color:C.ink})
   +fade(seg(p,.5,.65),T(`${cs(AL,'E_{\\parallel 2}')}=${cs(EC,'2')}\\times0.5=${cs(AL,'1\\,\\mathrm{N/C}')}`,900,420,{size:36})),seg(p,.05,.2));
  return s;
 },
 [K+'s2perp']:(p)=>{
  let s=mini(1)+zoom(1,{tx:230,ty:430,gAlong:1,gPerp:seg(p,.05,.25),labA:'1 N/C',labP:'約 1.73'});
  s+=card(640,220,520,240,T(`\\sqrt{${cs(EC,'2')}^2-${cs(AL,'1')}^2}=\\sqrt{3}`,900,295,{size:38})+T(`\\approx ${cs(PP,'1.73\\,\\mathrm{N/C}')}`,900,370,{size:38})
   +fade(seg(p,.55,.7),label('→ 仕事に 入らない',900,440,{size:28,color:PP,anchor:'middle',weight:700})),seg(p,.15,.3),PP);
  return s;
 },
 [K+'s2calc']:(p)=>mini(1)+zoom(1,{tx:230,ty:430,gAlong:1,gPerp:.25,labA:'1 N/C'})+seg2Calc(p),
 [K+'s2compare']:(p)=>{
  const bar=(x,y,w,h,c,t)=>rect(x,y-h,w,h,{fill:c,fo:.35,stroke:c,sw:2,rx:4})+label(t,x+w/2,y+32,{size:22,color:C.ink,anchor:'middle'});
  let s='';
  s+=card(60,60,520,390,label('区間1',320,120,{size:28,color:SCOL[0],anchor:'middle',weight:700})
   +bar(140,400,60,3*45,AL,'沿う 3')+label('×',260,350,{size:34,color:C.ink,anchor:'middle'})+bar(300,400,60,1*45,SCOL[0],'長さ 1')+label('＝',420,350,{size:34,color:C.ink,anchor:'middle'})+bar(460,400,60,3*45,WC,'3 J'),1);
  s+=card(620,60,520,390,label('区間2',880,120,{size:28,color:SCOL[1],anchor:'middle',weight:700})
   +bar(700,400,60,1*45,AL,'沿う 1')+label('×',820,350,{size:34,color:C.ink,anchor:'middle'})+bar(860,400,60,2*45,SCOL[1],'長さ 2')+label('＝',980,350,{size:34,color:C.ink,anchor:'middle'})+bar(1020,400,60,2*45,WC,'2 J'),seg(p,.1,.25));
  s+=fade(seg(p,.55,.7),label('仕事は 沿う部分にも 長さにも 比例',600,495,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S6 次の問い =====
 [K+'recap']:(p)=>{
  let s=recipeCard(60,110,1);
  s+=card(560,110,600,230,T(`\\Delta W_i=q\\,${cs(AL,'E_{\\parallel i}')}\\,\\Delta r_i`,860,190,{size:50})+label('i ＝ 区間の番号',860,280,{size:24,color:C.dim,anchor:'middle'}),seg(p,.3,.45));
  return s;
 },
 [K+'sofar']:(p)=>{
  let s=overview({...O,chords:1,E:.8,curveOp:.5});
  const V=view(O.ox,O.oy,O.sc);
  [[0,'+3 J'],[1,'+2 J']].forEach(([i,t],k)=>{const a=V(VERT[i]),b=V(VERT[i+1]);const q=SEGS[i],ux=Math.cos(rad(q.deg)),uy=-Math.sin(rad(q.deg));
   s+=fade(seg(p,.05+k*.2,.2+k*.2),label(t,i===0?(a[0]+b[0])/2-60:(a[0]+b[0])/2+30-uy*-44,i===0?(a[1]+b[1])/2-40:(a[1]+b[1])/2+ux*44+10,{size:28,color:WC,anchor:'middle',weight:700}));});
  s+=fade(seg(p,.5,.65),card(830,120,340,160,label('どちらも 電場が',1000,180,{size:26,color:C.ink,anchor:'middle'})+label('進む向きに 後押し',1000,235,{size:28,color:AL,anchor:'middle',weight:700}),1,AL));
  return s;
 },
 [K+'rest']:(p)=>{
  let s=overview({...O,chords:1,E:1,curveOp:.5,hl:seg(p,.05,.1)>0?2:-1,dimOthers:.0});
  const V=view(O.ox,O.oy,O.sc);
  const at=i=>{const a=V(VERT[i]),b=V(VERT[i+1]);return [(a[0]+b[0])/2,(a[1]+b[1])/2];};
  const [x3,y3]=at(2),[x4,y4]=at(3);
  s+=fade(seg(p,.1,.25),ring(x3,y3,52,{color:C.hi,w:3})+label('区間3：真横',x3+60,y3+70,{size:24,color:C.hi,weight:700}));
  s+=fade(seg(p,.45,.6),ring(x4,y4,52,{color:C.hi,w:3})+label('区間4：真逆',x4+50,y4-60,{size:24,color:C.hi,weight:700}));
  return s;
 },
 [K+'next']:(p)=>{
  let s=overview({ox:120,oy:470,sc:130,Esc:28,chords:1,E:1,curveOp:.4});
  s+=card(720,110,450,250,label('直角な区間 → ？',945,185,{size:32,color:C.hi,anchor:'middle',weight:700})+label('逆向きの区間 → ？',945,255,{size:32,color:C.hi,anchor:'middle',weight:700})+label('どう数える？',945,320,{size:28,color:C.ink,anchor:'middle'}),seg(p,.1,.25),C.hi);
  return s;
 },
};

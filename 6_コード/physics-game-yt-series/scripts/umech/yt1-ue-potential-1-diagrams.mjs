// YouTube シリーズ「電位・上級 1/2」(ys-ue-potential-1) — 図。Stage 1200×515.
// 色：電場 𝐄 水色、電位 V 紫（等電位線も紫）、傾きの矢印 ∇V 桃（微分の法則・上級 2/2 と同じ）、一歩 Δ𝐫・d𝐫 金、鍵 橙、
//   正電荷 赤、強調 黄、誤り 赤、座標軸 灰。
// 地図（S2〜S4）：地図の外の左下に正電荷があるときの電位 V＝12/ρ（ρ は地図の単位での距離）。等電位線は円弧、𝐄 は外向き（右上向き）。
//   電位は右上へ行くほど下がる。𝐄 は等電位線と直角、∇V はその逆向き。
// 部品は export して 2/2 でも使う（関数の export は図の登録に入らない）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,axes,tex,texWidth,poly} from './anim.mjs';

const K='ue-potential-1:';
export const EC=C.x,VC=C.v,GC=C.p,SC=C.t,LC=C.E,POS=C.a,NEG='#7fb3ff',OK=C.F,BAD=C.a;
export const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
export const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});
export const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
export const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
// fitted tex, optionally boxed
export function TF(s,x,y,{size=44,maxW=1100,g=1,box=false,col=C.hi,frac=false}={}){
 const w0=texWidth(s,size,false),sz=w0>maxW?size*maxW/w0:size,w=w0*sz/size;
 let o=T(s,x,y,{size:sz});
 if(box){const top=frac?1.95:1.5,h=frac?3.0:2.45;o+=highlight(x-w/2-20,y-sz*top,w+40,sz*h,1,col);}
 return fade(g,o);
}
export const strike=(x1,y1,x2,y2,g=1)=>fade(g,line(x1,y1,x2,y2,{color:BAD,w:4}));
export function lock(x,y,g=1,s=1,color=LC){
 return fade(g,`<path d="M ${x-9*s} ${y-6*s} v ${-8*s} a ${9*s} ${9*s} 0 0 1 ${18*s} 0 v ${8*s}" fill="none" stroke="${color}" stroke-width="${3.5*s}"/>`
  +rect(x-14*s,y-7*s,28*s,22*s,{fill:color,fo:.9,stroke:color,sw:1,rx:4*s}));
}
export function charge(x,y,sign=1,r=22){const c=sign>0?POS:NEG;return ring(x,y,r,{color:c,w:3,fill:sign>0?'#3a1d2a':'#1b2a48'})+label(sign>0?'＋':'−',x,y+r*.36,{size:r*1.05,color:c,anchor:'middle',weight:700});}
// TeX pieces
export const vE=cs(EC,'\\mathbf{E}'),Ex=cs(EC,'E_x'),Ey=cs(EC,'E_y'),Ez=cs(EC,'E_z'),V=cs(VC,'V');
export const dr=cs(SC,'d\\mathbf{r}'),Dr=cs(SC,'\\Delta\\mathbf{r}'),Dx=cs(SC,'\\Delta x');
export const pd=(a)=>`\\dfrac{\\partial ${V}}{\\partial ${a}}`;
export const NAB=cs(GC,'\\nabla')+V,NABg=cs(GC,'\\nabla V');
export const U=s=>`\\,\\mathrm{${s}}`;

// ---- generic potential map (S2–S4): charge outside the lower-left corner -------------------------
export const M={x0:60,y0:470,s:100,w:4.9,h:4.25,cx:-0.7,cy:-0.7,k:12};
export const MX=u=>M.x0+M.s*u,MY=v=>M.y0-M.s*v;
export const Vmap=(u,v)=>M.k/Math.hypot(u-M.cx,v-M.cy);
const LEV=[6,4,3,2.5];
function arcPts(rr){const pts=[];for(let i=0;i<=120;i++){const t=Math.PI/2*i/120,u=M.cx+rr*Math.cos(t),v=M.cy+rr*Math.sin(t);if(u>=0&&u<=M.w&&v>=0&&v<=M.h)pts.push([MX(u),MY(v)]);}return pts;}
export function map({g=1,lab=1,hl=-1,frame=1,triad=1}={}){
 if(g<=.001)return '';
 let s=frame?rect(M.x0,MY(M.h),M.s*M.w,M.s*M.h,{fill:'#0f1a30',fo:1,stroke:C.faint,sw:2,rx:4}):'';
 LEV.forEach((lv,i)=>{const pts=arcPts(M.k/lv);if(pts.length<2)return;const on=i===hl;
  s+=draw(pts,1,{color:VC,w:on?5:3,opacity:on?1:.75});
  if(lab){const rr=M.k/lv,v0=0.12,u0=M.cx+Math.sqrt(rr*rr-(v0-M.cy)**2);s+=label(`${lv} V`,MX(u0)+5,MY(v0)-4,{size:22,color:VC});}});
 if(triad){const ox=MX(4.05),oy=MY(3.35);
  s+=arrow(ox,oy,ox+56,oy,{color:C.dim,w:2.5,head:10})+label('x',ox+62,oy+8,{size:22,color:C.dim});
  s+=arrow(ox,oy,ox,oy-56,{color:C.dim,w:2.5,head:10})+label('y',ox-6,oy-62,{size:22,color:C.dim,anchor:'end'});
  s+=ring(ox+44,oy-44,9,{color:C.dim,w:2.5})+dot(ox+44,oy-44,3,C.dim)+label('z',ox+58,oy-50,{size:22,color:C.dim});}
 return fade(g,s);
}
// unit radial direction and field strength (screen) at map point
export function fieldAt(u,v,{len=1,g=1,color=EC,w=5,k=110}={}){
 const du=u-M.cx,dv=v-M.cy,r=Math.hypot(du,dv),L=Math.min(150,k*M.k/(r*r))*len;
 return fade(g,arrow(MX(u),MY(v),MX(u)+L*du/r,MY(v)-L*dv/r,{color,w,head:15}));
}
export function gradAt(u,v,{len=1,g=1,w=5,k=110}={}){
 const du=u-M.cx,dv=v-M.cy,r=Math.hypot(du,dv),L=Math.min(150,k*M.k/(r*r))*len;
 return fade(g,arrow(MX(u),MY(v),MX(u)-L*du/r,MY(v)+L*dv/r,{color:GC,w,head:15}));
}
export function fieldGrid({g=1,op=.7}={}){
 let s='';for(const [u,v] of [[1.0,3.7],[2.3,3.5],[3.3,2.9],[4.3,1.9],[3.2,0.55],[4.4,0.6],[1.5,2.5],[2.5,1.9],[0.6,1.7]])s+=fieldAt(u,v,{w:3.5,len:.6});
 return fade(g*op,s);
}
const A0=[2.0,1.4];

// ---- V along x (slice at fixed y,z) -----------------------------------------------------------
// graph of V(u, v=A0[1]) for u in [0.6, 4.6]
const VS=u=>Vmap(u,A0[1]);
export function slice({g=1,x=640,y=440,w=500,h=330,sec=0,dx=1.4,tan=0,lab=1}={}){
 const A=axes({x,y,w,h,xmin:0.4,xmax:4.8,ymin:1.4,ymax:5.2,xticks:[],yticks:[],g});
 let s=A.svg+A.plot(VS,{from:0.5,to:4.7,color:VC,w:5});
 s+=label('x',x+w+40,y+8,{size:26,color:C.dim})+label('V',x-2,y-h-40,{size:28,color:VC,anchor:'middle',weight:700});
 if(lab)s+=label('y, z は 固定',x+w-10,y-h+20,{size:22,color:LC,anchor:'end'});
 const xa=A0[0],xb=A0[0]+dx;
 if(sec>0){s+=fade(sec,draw([[A.X(xa-.5),A.Y(VS(xa)-.5*(VS(xb)-VS(xa))/dx)],[A.X(xb+.5),A.Y(VS(xb)+.5*(VS(xb)-VS(xa))/dx)]],1,{color:C.hi,w:3,dash:'8 6'})
   +dot(A.X(xa),A.Y(VS(xa)),8,C.ink)+dot(A.X(xb),A.Y(VS(xb)),8,C.ink)+label('A',A.X(xa)-10,A.Y(VS(xa))-14,{size:22,color:C.ink,anchor:'end',weight:700})+label('B',A.X(xb)+8,A.Y(VS(xb))-14,{size:22,color:C.ink,weight:700})
   +line(A.X(xa),A.Y(VS(xa)),A.X(xb),A.Y(VS(xa)),{color:SC,w:3})+line(A.X(xb),A.Y(VS(xa)),A.X(xb),A.Y(VS(xb)),{color:VC,w:3})
   +label('Δx',(A.X(xa)+A.X(xb))/2,A.Y(VS(xa))-12,{size:22,color:SC,anchor:'middle'})+label('ΔV',A.X(xb)+8,(A.Y(VS(xa))+A.Y(VS(xb)))/2+30,{size:22,color:VC}));}
 if(tan>0){const sl=-M.k*(xa-M.cx)/Math.pow(Math.hypot(xa-M.cx,A0[1]-M.cy),3);
  s+=fade(tan,draw([[A.X(xa-1),A.Y(VS(xa)-sl)],[A.X(xa+1.3),A.Y(VS(xa)+1.3*sl)]],1,{color:GC,w:4})+dot(A.X(xa),A.Y(VS(xa)),8,C.ink));}
 return {svg:fade(g,s),A};
}

export const ytUePotential1Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  // Gauss: charges -> field (sphere around a charge)
  let s=charge(300,260,1,26)+ring(300,260,140,{color:C.dim,w:3,dash:'8 7'});
  for(let i=0;i<8;i++){const t=i*Math.PI/4,c=Math.cos(t),sn=Math.sin(t);s+=arrow(300+40*c,260-40*sn,300+(40+90*seg(p,.1,.4))*c,260-(40+90*seg(p,.1,.4))*sn,{color:EC,w:4,head:13});}
  s+=fade(seg(p,.3,.45),L('電荷 → 電場',300,460,{size:28,color:EC,weight:700}));
  s+=card(640,110,500,260,L('ガウスの法則・上級',890,160,{size:24,color:C.dim})
   +T(`\\displaystyle\\mathop{\\iint\\mkern-23.5mu\\bigcirc\\mkern2mu}\\nolimits_S ${vE}\\cdot d\\mathbf{A}=\\frac{Q}{\\varepsilon_0}`,890,270,{size:44}),seg(p,.05,.2));
  return s;
 },
 [K+'ask2']:(p)=>{
  let s=map({g:1,triad:0})+fieldGrid({g:seg(p,.45,.7),op:.6});
  s+=fade(seg(p,.2,.4),label('電位の 地図',MX(2.4),MY(4.0),{size:28,color:VC,anchor:'middle',weight:700}));
  s+=card(640,110,520,260,L('前回の 最後の 問い',900,160,{size:24,color:C.dim})
   +L('電位の 地図から',900,225,{size:30,color:VC,weight:700})
   +L('3次元の 各点の 電場を',900,280,{size:30,color:EC,weight:700})+L('取り出すには？',900,335,{size:30,color:C.hi,weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'recall']:(p)=>{
  // 1D: V = -4x, slope -4, E = 4 V/m
  const A=axes({x:110,y:440,w:440,h:340,xmin:0,xmax:3.4,ymin:-13,ymax:1,xticks:[1,2,3],yticks:[],g:1});
  let s=A.svg+A.plot(x=>-4*x,{from:0,to:3.2,color:VC,w:5,p:seg(p,.05,.35)});
  s+=label('x [m]',560,A.Y(0)+40,{size:22,color:C.dim})+label('V [V]',110,90,{size:24,color:VC,anchor:'middle'});
  [-4,-8,-12].forEach(v=>{s+=line(A.X(0)-6,A.Y(v),A.X(0)+6,A.Y(v),{color:C.dim})+label(String(v),A.X(0)-12,A.Y(v)+8,{size:21,color:C.dim,anchor:'end'});});
  s+=fade(seg(p,.35,.5),line(A.X(1),A.Y(-4),A.X(2),A.Y(-4),{color:SC,w:3})+line(A.X(2),A.Y(-4),A.X(2),A.Y(-8),{color:VC,w:3})+label('1 m',A.X(1.5),A.Y(-4)-12,{size:22,color:SC,anchor:'middle'})+label('−4 V',A.X(2)+10,A.Y(-6)+8,{size:22,color:VC}));
  s+=card(650,80,500,330,L('中級：x 方向だけの 坂',900,125,{size:24,color:C.dim})
   +T(`${cs(EC,'E')}=-\\dfrac{d${V}}{dx}`,900,215,{size:46})
   +fade(seg(p,.45,.6),T(`${V}=-4x\\ \\Rightarrow\\ ${cs(EC,'E')}=-(-4)=4${U('V/m')}`,900,320,{size:30})),seg(p,0,.15));
  s+=fade(seg(p,.7,.85),arrow(A.X(0.6),A.Y(-8),A.X(1.6),A.Y(-8),{color:EC,w:5,head:15})+label('𝐄',A.X(1.1),A.Y(-8)+34,{size:26,color:EC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'recall2']:(p)=>{
  // circles V = -alpha(x^2+y^2)/2, E outward = (alpha x, alpha y)
  const cx=300,cy=270;let s='';
  [60,100,140,180].forEach((r,i)=>{s+=fade(seg(p,.05+i*.05,.15+i*.05),ring(cx,cy,r,{color:VC,w:3}));});
  s+=dot(cx,cy,5,C.ink)+label('原点',cx,cy+30,{size:22,color:C.dim,anchor:'middle'});
  for(let i=0;i<8;i++){const t=i*Math.PI/4+Math.PI/8;[80,160].forEach(r=>{const L0=r*.28;s+=fade(seg(p,.45,.65),arrow(cx+r*Math.cos(t),cy-r*Math.sin(t),cx+(r+L0)*Math.cos(t),cy-(r+L0)*Math.sin(t),{color:EC,w:4,head:12}));});}
  s+=card(620,70,540,360,L('線積分と面積分・上級',890,115,{size:24,color:C.dim})
   +T(`${V}=-\\dfrac{\\alpha\\,(x^2+y^2)}{2}`,890,200,{size:44})
   +fade(seg(p,.35,.5),T(`-\\dfrac{\\partial ${V}}{\\partial x}=\\alpha x,\\quad -\\dfrac{\\partial ${V}}{\\partial y}=\\alpha y`,890,300,{size:36}))
   +fade(seg(p,.55,.7),L('→ 電場 (αx, αy)',890,385,{size:30,color:EC,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'why']:(p)=>{
  let s=card(200,80,800,340,L('今回の 問い',600,130,{size:24,color:C.dim})
   +T(`${Ex}\\overset{?}{=}-\\dfrac{\\partial ${V}}{\\partial x}`,600,240,{size:58})
   +fade(seg(p,.35,.5),L('どんな 電位でも、なぜ？',600,340,{size:32,color:C.hi,weight:700}))
   +fade(seg(p,.6,.75),L('→ 電位の 定義から 導く',600,395,{size:28,color:C.ink})),seg(p,0,.15),C.hi);
  return s;
 },
 // ===== S2 x 方向の傾きを取り出す =====
 [K+'def']:(p)=>{
  let s=map({g:1,triad:0})+fieldGrid({op:.4});
  const pts=[[1.0,0.9],[1.6,1.9],[2.6,2.3],[3.4,2.0],[4.1,2.9]].map(([u,v])=>[MX(u),MY(v)]);
  s+=draw(pts,seg(p,.1,.45),{color:SC,w:4});
  s+=dot(pts[0][0],pts[0][1],8,C.ink)+label('A',pts[0][0]-12,pts[0][1]+8,{size:26,color:C.ink,anchor:'end',weight:700});
  s+=fade(seg(p,.4,.5),dot(pts[4][0],pts[4][1],8,C.ink)+label('B',pts[4][0]+12,pts[4][1]-6,{size:26,color:C.ink,weight:700}));
  s+=card(620,90,540,320,L('電位の 差の 定義（中級）',890,140,{size:24,color:C.dim})
   +T(`${V}(\\mathrm{B})-${V}(\\mathrm{A})=-\\int_{\\mathrm{A}}^{\\mathrm{B}}${vE}\\cdot ${dr}`,890,240,{size:40})
   +fade(seg(p,.5,.65),L('道に 沿って 電場を 足し、マイナス',890,345,{size:26,color:C.ink})),seg(p,0,.15));
  return s;
 },
 [K+'step']:(p)=>{
  let s=map({g:1})+fieldGrid({op:.35});
  const [u,v]=A0,xa=MX(u),ya=MY(v),xb=MX(u+1);
  s+=dot(xa,ya,8,C.ink)+label('A',xa-12,ya+30,{size:26,color:C.ink,anchor:'end',weight:700});
  s+=arrow(xa,ya,mix(xa,xb,seg(p,.2,.45)),ya,{color:SC,w:6,head:16});
  s+=fade(seg(p,.4,.5),dot(xb,ya,8,C.ink)+label('B',xb+10,ya+30,{size:26,color:C.ink,weight:700})+label('Δx',(xa+xb)/2,ya-14,{size:26,color:SC,anchor:'middle',weight:700}));
  s+=card(640,100,520,300,L('x 方向に だけ 一歩',900,150,{size:30,color:SC,weight:700})
   +fade(seg(p,.55,.7),lock(720,228)+label('y に 鍵',748,236,{size:28,color:LC})+lock(720,298)+label('z に 鍵（画面の 手前・奥）',748,306,{size:26,color:LC}))
   +fade(seg(p,.75,.9),L('動くのは x だけ',900,375,{size:28,color:C.ink})),seg(p,.05,.2));
  return s;
 },
 [K+'dot']:(p)=>{
  // zoom: E at A split into along-step part and perpendicular part
  const ax=200,ay=330,ex=150,ey=-110;
  let s=rect(60,60,520,400,{fill:'#0f1a30',fo:1,stroke:C.faint,sw:2,rx:6});
  s+=arrow(ax,ay,ax+300,ay,{color:SC,w:6,head:18})+label('Δ𝐫 ＝ (Δx, 0, 0)',ax+150,ay+44,{size:26,color:SC,anchor:'middle',weight:700});
  s+=arrow(ax,ay,ax+ex,ay+ey,{color:EC,w:6,head:18})+label('𝐄',ax+ex-6,ay+ey-14,{size:30,color:EC,weight:700});
  s+=fade(seg(p,.25,.45),line(ax+ex,ay+ey,ax+ex,ay,{color:C.dim,w:2,dash:'6 6'})+arrow(ax,ay+8,ax+ex,ay+8,{color:EC,w:4,head:12})+label('Eₓ',ax+ex/2,ay-12,{size:24,color:EC,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),label('一歩と 直角な 部分（y・z 成分）は 効かない',320,430,{size:22,color:C.dim,anchor:'middle'}));
  s+=dot(ax,ay,8,C.ink)+label('A',ax-14,ay+8,{size:26,color:C.ink,anchor:'end',weight:700});
  s+=card(640,110,520,280,L('一歩と 電場の 内積',900,160,{size:26,color:C.dim})
   +fade(seg(p,.3,.5),T(`${vE}\\cdot${Dr}=${Ex}\\,${Dx}`,900,260,{size:50}))
   +fade(seg(p,.6,.75),L('効くのは x 成分 だけ',900,345,{size:28,color:EC,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'approx']:(p)=>{
  let s=card(120,30,960,200,L('定義を 短い 一歩に 使う',600,68,{size:24,color:C.dim})
   +T(`\\Delta ${V}=-\\int_{\\mathrm{A}}^{\\mathrm{B}}${vE}\\cdot d\\mathbf{r}`,600,175,{size:44}),1);
  s+=fade(seg(p,.2,.4),L('Δx が 短い → その間の Eₓ は ほぼ 一定',600,290,{size:28,color:EC}));
  s+=TF(`\\Delta ${V}\\approx-${Ex}\\,${Dx}`,600,390,{size:58,g:seg(p,.35,.55),box:true});
  s+=fade(seg(p,.65,.8),L('≈：区間の 電場を 一つの 値で 代表させた 近似',600,480,{size:24,color:C.hi}));
  return s;
 },
 [K+'divide']:(p)=>{
  const {svg}=slice({sec:1,x:620,w:480});
  let s=svg;
  s+=card(60,80,500,330,L('両辺を Δx で 割る',310,130,{size:26,color:C.dim})
   +T(`\\dfrac{\\Delta ${V}}{${Dx}}\\approx-${Ex}`,310,235,{size:54})
   +fade(seg(p,.4,.6),L('1 m あたりの 電位の 変化',310,330,{size:26,color:VC,weight:700})+L('＝ x 方向の 坂の 傾き',310,375,{size:26,color:VC})),seg(p,0,.15));
  return s;
 },
 [K+'limit']:(p)=>{
  const dx=mix(1.4,0.12,seg(p,.1,.55));
  const {svg}=slice({sec:1-seg(p,.55,.7),dx,tan:seg(p,.5,.7),x:620,w:480});
  let s=svg;
  s+=card(60,80,500,330,L('Δx → 0',310,130,{size:28,color:SC,weight:700})
   +fade(seg(p,.5,.65),T(`\\dfrac{\\Delta ${V}}{${Dx}}\\ \\to\\ \\dfrac{\\partial ${V}}{\\partial x}`,310,230,{size:48}))
   +fade(seg(p,.7,.85),L('∂：y と z を 固定した 微分',310,330,{size:26,color:LC,weight:700})+L('（偏微分）',310,372,{size:24,color:C.dim})),seg(p,0,.15));
  return s;
 },
 [K+'ex']:(p)=>{
  const {svg}=slice({sec:0,tan:1,x:620,w:480});
  let s=svg;
  s+=card(60,80,500,330,L('導いた 結果',310,130,{size:24,color:C.dim})
   +TF(`${Ex}=-\\dfrac{\\partial ${V}}{\\partial x}`,310,250,{size:58,box:true,frac:true,g:seg(p,.05,.25)})
   +fade(seg(p,.4,.6),L('x 方向の 傾きに 負号',310,370,{size:28,color:C.ink})),1);
  return s;
 },
 [K+'sign']:(p)=>{
  const {svg,A}=slice({sec:0,tan:1,x:620,w:480});
  let s=svg;
  const xa=A0[0];
  s+=fade(seg(p,.2,.4),label('傾き ＜ 0',A.X(xa)+60,A.Y(VS(xa))-46,{size:26,color:GC,weight:700}));
  s+=fade(seg(p,.45,.65),arrow(A.X(xa),A.Y(1.4)-30,A.X(xa)+120,A.Y(1.4)-30,{color:EC,w:6,head:16})+label('Eₓ ＞ 0',A.X(xa)+60,A.Y(1.4)-48,{size:26,color:EC,anchor:'middle',weight:700}));
  s+=card(60,80,500,330,L('負号の 意味',310,130,{size:26,color:C.dim})
   +L('x へ 進むと V が 下がる',310,210,{size:28,color:VC})
   +fade(seg(p,.2,.4),T(`\\dfrac{\\partial ${V}}{\\partial x}<0\\ \\Rightarrow\\ ${Ex}>0`,310,290,{size:38}))
   +fade(seg(p,.65,.8),L('電場は 電位が 下がる 向き',310,375,{size:28,color:EC,weight:700})),seg(p,0,.15));
  return s;
 },
 // ===== S3 3方向を並べて E = −∇V =====
 [K+'three']:(p)=>{
  const rows=[['x','y と z',Ex],['y','x と z',Ey],['z','x と y',Ez]];
  let s='';
  rows.forEach(([a,lk,E],i)=>{const y=125+i*135,g=seg(p,.05+i*.2,.2+i*.2);
   s+=fade(g,rect(110,y-55,980,110,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:12})
    +label(`${a} 方向`,150,y+10,{size:30,color:C.ink,weight:700})
    +lock(330,y)+label(`${lk} に 鍵`,356,y+9,{size:26,color:LC})
    +T(`${E}=-\\dfrac{\\partial ${V}}{\\partial ${a}}`,830,y+4,{size:44}));});
  return s;
 },
 [K+'nabla']:(p)=>{
  let s=TF(`${NABg}=\\left(\\dfrac{\\partial ${V}}{\\partial x},\\ \\dfrac{\\partial ${V}}{\\partial y},\\ \\dfrac{\\partial ${V}}{\\partial z}\\right)`,600,170,{size:50,g:seg(p,.05,.3)});
  s+=fade(seg(p,.3,.5),L('各方向の 傾きを 並べた 矢印',600,300,{size:34,color:GC,weight:700}));
  s+=fade(seg(p,.6,.8),L('∇：ナブラ',600,390,{size:30,color:C.ink})+L('（三角形を 逆さにした 記号）',600,440,{size:24,color:C.dim}));
  return s;
 },
 [K+'grad']:(p)=>{
  let s=map({g:1});
  const [u,v]=[2.2,2.0];
  s+=dot(MX(u),MY(v),8,C.ink);
  s+=gradAt(u,v,{g:seg(p,.15,.35),len:1.25})+fade(seg(p,.25,.4),label('∇V',MX(u)-118,MY(v)+56,{size:28,color:GC,weight:700}));
  s+=fieldAt(u,v,{g:seg(p,.45,.65),len:1.25})+fade(seg(p,.55,.7),label('𝐄',MX(u)+96,MY(v)-70,{size:30,color:EC,weight:700}));
  s+=card(640,110,520,290,L('3つの 成分に 負号を 付けて 並べる',900,160,{size:24,color:C.dim})
   +TF(`${vE}=-${NABg}`,900,265,{size:66,box:true,g:seg(p,.05,.25)})
   +fade(seg(p,.6,.75),L('傾きの 矢印を 逆向きに',900,365,{size:28,color:EC,weight:700})),1);
  return s;
 },
 [K+'hill']:(p)=>{
  // h = x^2 y around (1,2): contours, gradient (4,1)
  const x0=90,y0=460,sc=125,X=x=>x0+sc*x,Y=y=>y0-sc*y;
  let s=rect(x0,Y(3.2),sc*3.4,sc*3.2,{fill:'#0f1a30',fo:1,stroke:C.faint,sw:2,rx:4});
  [1,2,4,8].forEach(c=>{const pts=[];for(let i=0;i<=80;i++){const x=mix(Math.sqrt(c/3.2),3.4,i/80);pts.push([X(x),Y(c/(x*x))]);}s+=draw(pts,1,{color:c===2?C.hi:C.dim,w:c===2?4:2.5,opacity:c===2?1:.6});
   if(c===2)s+=label('h ＝ 2 の 等高線',X(1.45)+10,Y(2/(1.45*1.45))+6,{size:22,color:C.hi});});
  s+=dot(X(1),Y(2),8,C.hi);
  s+=arrow(X(1),Y(2),X(1)+4*38,Y(2)-1*38,{color:GC,w:6,head:16,g:seg(p,.2,.45)})+fade(seg(p,.35,.5),label('(4, 1)',X(1)+4*38+10,Y(2)-38-12,{size:26,color:GC,weight:700}));
  s+=fade(seg(p,.5,.65),label('等高線と 直角',X(1)+40,Y(2)+70,{size:24,color:C.ink}));
  s+=card(640,90,520,330,L('微分の法則・上級：山の 高さ h',900,140,{size:24,color:C.dim})
   +T(`\\left(\\dfrac{\\partial h}{\\partial x},\\ \\dfrac{\\partial h}{\\partial y}\\right)=(4,\\,1)`,900,230,{size:40})
   +L('東向きと 北向きの 傾きを 並べた 矢印',900,315,{size:24,color:GC})
   +fade(seg(p,.6,.75),L('∇V も 同じ 作り',900,385,{size:30,color:C.hi,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'vd']:(p)=>{
  const A=axes({x:110,y:430,w:440,h:320,xmin:0,xmax:1.15,ymin:0,ymax:1.15,xticks:[],yticks:[],g:1});
  let s=A.svg+A.plot(x=>1-x,{from:0,to:1,color:VC,w:5,p:seg(p,.05,.3)});
  s+=label('V',A.X(0)-14,A.Y(1)+8,{size:26,color:VC,anchor:'end',weight:700})+label('d',A.X(1),A.Y(0)+34,{size:26,color:C.ink,anchor:'middle'})+label('x',A.X(1.15)+36,A.Y(0)+8,{size:24,color:C.dim});
  s+=fade(seg(p,.3,.45),[.25,.5,.75].map(x=>arrow(A.X(x)-30,A.Y(0)-40,A.X(x)+30,A.Y(0)-40,{color:EC,w:4,head:12})).join('')+label('どこでも 同じ 傾き',A.X(.55),A.Y(.75),{size:24,color:GC}));
  s+=card(640,100,520,300,L('まっすぐな 坂（一様な 電場）',900,150,{size:24,color:C.dim})
   +TF(`${cs(EC,'E')}=\\dfrac{${V}}{d}`,900,260,{size:58,g:seg(p,.4,.6),frac:true})
   +fade(seg(p,.65,.8),L('下がり幅 ÷ 距離',900,360,{size:28,color:C.ink})),seg(p,0,.15));
  return s;
 },
 [K+'alpha']:(p)=>{
  const cx=260,cy=270;let s='';
  [60,100,140,180].forEach(r=>{s+=ring(cx,cy,r,{color:VC,w:3});});
  s+=dot(cx,cy,5,C.ink);
  for(let i=0;i<8;i++){const t=i*Math.PI/4+Math.PI/8;[80,160].forEach(r=>{const L0=r*.28;s+=fade(seg(p,.7,.85),arrow(cx+r*Math.cos(t),cy-r*Math.sin(t),cx+(r+L0)*Math.cos(t),cy-(r+L0)*Math.sin(t),{color:EC,w:4,head:12}));});}
  s+=TF(`${V}=-\\dfrac{\\alpha\\,(x^2+y^2)}{2}`,820,110,{size:42});
  s+=TF(`${NABg}=(-\\alpha x,\\ -\\alpha y,\\ 0)`,820,240,{size:40,g:seg(p,.15,.35)});
  s+=TF(`${vE}=-${NABg}=(\\alpha x,\\ \\alpha y,\\ 0)`,820,380,{size:40,g:seg(p,.5,.7),box:true});
  return s;
 },
 [K+'alpha2']:(p)=>{
  const cx=260,cy=270;let s='';
  [60,100,140,180].forEach(r=>{s+=ring(cx,cy,r,{color:VC,w:3});});
  s+=dot(cx,cy,5,C.ink);
  for(let i=0;i<8;i++){const t=i*Math.PI/4+Math.PI/8;[80,160].forEach(r=>{const L0=r*.28;s+=arrow(cx+r*Math.cos(t),cy-r*Math.sin(t),cx+(r+L0)*Math.cos(t),cy-(r+L0)*Math.sin(t),{color:EC,w:4,head:12});});}
  s+=TF(`${vE}=(\\alpha x,\\ \\alpha y,\\ 0)`,820,150,{size:46,box:true});
  s+=fade(seg(p,.2,.4),L('線積分の 回で 道に 沿って 足した 電場',820,270,{size:26,color:C.ink})+L('✓',820,340,{size:44,color:OK,weight:700}));
  s+=fade(seg(p,.5,.7),L('外向き・中心から 離れるほど 強い',820,410,{size:24,color:EC}));
  return s;
 },
 // ===== S4 等電位面と直角になる理由 =====
 [K+'total']:(p)=>{
  // oblique step split into dx, dy, dz (oblique drawing)
  const ox=230,oy=400,ax=[220,0],ay=[0,-210],az=[-90,70];
  const P=(a,b,c)=>[ox+a*ax[0]+b*ay[0]+c*az[0],oy+a*ax[1]+b*ay[1]+c*az[1]];
  let s=rect(60,60,520,410,{fill:'#0f1a30',fo:1,stroke:C.faint,sw:2,rx:6});
  const [x1,y1]=P(1,0,0),[x2,y2]=P(1,1,0),[x3,y3]=P(1,1,1);
  s+=fade(seg(p,.25,.4),arrow(ox,oy,x1,y1,{color:C.dim,w:4,head:12})+label('dx',(ox+x1)/2,oy+30,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.35,.5),arrow(x1,y1,x2,y2,{color:C.dim,w:4,head:12})+label('dy',x1+12,(y1+y2)/2,{size:24,color:C.dim}));
  s+=fade(seg(p,.45,.6),arrow(x2,y2,x3,y3,{color:C.dim,w:4,head:12})+label('dz',x3-24,y3+8,{size:24,color:C.dim,anchor:'end'}));
  s+=arrow(ox,oy,x3,y3,{color:SC,w:6,head:16,g:seg(p,.05,.2)})+label('d𝐫',(ox+x3)/2-24,(oy+y3)/2-8,{size:28,color:SC,anchor:'end',weight:700});
  s+=dot(ox,oy,7,C.ink);
  s+=TF(`d${V}=\\dfrac{\\partial ${V}}{\\partial x}dx+\\dfrac{\\partial ${V}}{\\partial y}dy+\\dfrac{\\partial ${V}}{\\partial z}dz`,880,200,{size:34,maxW:560,g:seg(p,.5,.7)});
  s+=fade(seg(p,.7,.85),L('傾き × 進んだ 量 を 3方向 足す',880,320,{size:26,color:C.ink})+L('（全微分の 連鎖律）',880,370,{size:24,color:C.dim}));
  return s;
 },
 [K+'dotform']:(p)=>{
  let s=TF(`d${V}=\\dfrac{\\partial ${V}}{\\partial x}dx+\\dfrac{\\partial ${V}}{\\partial y}dy+\\dfrac{\\partial ${V}}{\\partial z}dz`,600,90,{size:38});
  s+=TF(`=${NABg}\\cdot ${dr}`,600,215,{size:50,g:seg(p,.1,.3)});
  s+=fade(seg(p,.15,.3),L('成分ごとの 積の 和 ＝ 内積',940,225,{size:24,color:C.dim}));
  s+=TF(`=-${vE}\\cdot ${dr}`,600,330,{size:50,g:seg(p,.35,.55),box:true});
  s+=fade(seg(p,.6,.75),L('電位の 定義の 一歩の 形に 戻った',600,445,{size:28,color:C.hi,weight:700}));
  return s;
 },
 [K+'steep']:(p)=>{
  let s=map({g:1});
  const [u,v]=[2.2,2.0],x=MX(u),y=MY(v);
  const du=u-M.cx,dv=v-M.cy,r=Math.hypot(du,dv),gx=-du/r,gy=dv/r; // screen dir of grad (toward charge)
  s+=gradAt(u,v,{len:1.25});
  s+=ring(x,y,70,{color:SC,w:2,dash:'5 6'});
  const N=8;for(let i=0;i<N;i++){const t=Math.atan2(gy,gx)+i*2*Math.PI/N;const c=Math.cos(t-Math.atan2(gy,gx));
   s+=fade(seg(p,.1+i*.04,.18+i*.04),arrow(x,y,x+70*Math.cos(t),y+70*Math.sin(t),{color:i===0?C.hi:SC,w:i===0?5:3,head:11}));}
  s+=dot(x,y,7,C.ink);
  s+=card(640,90,520,330,L('長さ 一定の 一歩 d𝐫',900,140,{size:26,color:SC,weight:700})
   +T(`d${V}=${NABg}\\cdot ${dr}`,900,225,{size:44})
   +fade(seg(p,.45,.6),L('最大：d𝐫 が ∇V と 同じ 向き',900,310,{size:26,color:C.hi,weight:700}))
   +fade(seg(p,.65,.8),L('∇V ＝ 一番 急に 上がる 向き',900,375,{size:28,color:GC,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'steep2']:(p)=>{
  let s=map({g:1});
  const [u,v]=[2.2,2.0];
  s+=gradAt(u,v,{len:1.25,g:.5})+fieldAt(u,v,{len:1.25,g:seg(p,.1,.3)})+dot(MX(u),MY(v),7,C.ink);
  s+=fade(seg(p,.2,.35),label('𝐄',MX(u)+96,MY(v)-70,{size:30,color:EC,weight:700}));
  s+=card(640,110,520,280,L('電場 ＝ −∇V',900,170,{size:34,color:EC,weight:700})
   +fade(seg(p,.35,.5),L('電位が 一番 急に 下がる 向き',900,260,{size:28,color:C.ink})),seg(p,0,.15));
  return s;
 },
 [K+'surf']:(p)=>{
  // nested spheres around a charge (3D look) + map contours
  const cx=300,cy=270;let s=charge(cx,cy,1,18);
  [70,120,175].forEach((r,i)=>{s+=fade(seg(p,.05+i*.12,.2+i*.12),`<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r}" fill="${VC}" fill-opacity=".07" stroke="${VC}" stroke-width="3"/>`
   +`<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r*.28}" fill="none" stroke="${VC}" stroke-width="1.8" stroke-dasharray="6 6" opacity=".7"/>`);});
  s+=fade(seg(p,.5,.65),label('V ＝ 一定 の 面',cx,cy-190,{size:26,color:VC,anchor:'middle',weight:700}));
  s+=card(640,110,520,280,L('等電位面',900,170,{size:36,color:VC,weight:700})
   +L('同じ 電位の 点を 集めた 面',900,250,{size:28,color:C.ink})
   +fade(seg(p,.55,.7),L('地図の 等高線 → 3次元の 面',900,320,{size:26,color:C.dim})),seg(p,0,.15));
  return s;
 },
 [K+'along']:(p)=>{
  let s=map({g:1,hl:1});
  const r0=M.k/4,t0=0.75,u=M.cx+r0*Math.cos(t0),v=M.cy+r0*Math.sin(t0),x=MX(u),y=MY(v);
  const tx=Math.sin(t0),ty=Math.cos(t0); // screen tangent (along increasing angle reversed)
  s+=arrow(x,y,x+90*tx,y+90*ty,{color:SC,w:6,head:16,g:seg(p,.1,.3)})+fade(seg(p,.2,.35),label('d𝐫',x+90*tx+10,y+90*ty+24,{size:28,color:SC,weight:700}));
  s+=dot(x,y,8,C.ink);
  
  s+=card(640,100,520,310,L('4 V の 面に 沿う 一歩',900,150,{size:28,color:SC,weight:700})
   +fade(seg(p,.3,.45),T(`d${V}=0`,900,230,{size:46}))
   +fade(seg(p,.55,.7),T(`\\Rightarrow\\ ${vE}\\cdot ${dr}=0`,900,330,{size:46})),seg(p,0,.15));
  return s;
 },
 [K+'perp']:(p)=>{
  let s=map({g:1,hl:1});
  const r0=M.k/4,t0=0.75,u=M.cx+r0*Math.cos(t0),v=M.cy+r0*Math.sin(t0),x=MX(u),y=MY(v);
  const tx=Math.sin(t0),ty=Math.cos(t0);
  s+=arrow(x,y,x+90*tx,y+90*ty,{color:SC,w:4,head:13})+arrow(x,y,x-90*tx,y-90*ty,{color:SC,w:4,head:13,g:seg(p,.05,.2)});
  s+=fieldAt(u,v,{len:1.3,g:seg(p,.25,.45)})+fade(seg(p,.35,.5),label('𝐄',x+110*Math.cos(t0),y-110*Math.sin(t0)-12,{size:30,color:EC,weight:700}));
  // right-angle mark
  const a=18,nx=Math.cos(t0),ny=-Math.sin(t0);
  s+=fade(seg(p,.45,.6),draw([[x+a*tx,y+a*ty],[x+a*tx+a*nx,y+a*ty+a*ny],[x+a*nx,y+a*ny]],1,{color:C.hi,w:3}));
  s+=dot(x,y,8,C.ink);
  s+=card(640,110,520,280,L('どの 向きの 一歩とも 内積 0',900,170,{size:26,color:C.ink})
   +fade(seg(p,.5,.65),L('𝐄 は 等電位面と 直角',900,265,{size:34,color:EC,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'space']:(p)=>{
  // straight equipotential lines, 1 V apart, 0.5 m spacing
  const x0=110,y0=90,h=340,sp=110;let s='';
  [5,4,3,2].forEach((v,i)=>{const x=x0+i*sp;s+=line(x,y0,x,y0+h,{color:VC,w:3})+label(`${v} V`,x,y0-14,{size:24,color:VC,anchor:'middle'});});
  s+=fade(seg(p,.2,.4),line(x0,y0+h+24,x0+sp,y0+h+24,{color:C.ink,w:2})+line(x0,y0+h+16,x0,y0+h+32,{color:C.ink,w:2})+line(x0+sp,y0+h+16,x0+sp,y0+h+32,{color:C.ink,w:2})+label('0.5 m',x0+sp/2,y0+h+58,{size:24,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.55,.75),[150,250,350].map(y=>arrow(x0+20,y,x0+20+70,y,{color:EC,w:5,head:14})+arrow(x0+sp+20,y,x0+sp+90,y,{color:EC,w:5,head:14})+arrow(x0+2*sp+20,y,x0+2*sp+90,y,{color:EC,w:5,head:14})).join(''));
  s+=card(640,100,520,310,L('1 V ごと・間隔 0.5 m',900,150,{size:26,color:C.dim})
   +fade(seg(p,.3,.5),T(`${cs(EC,'E')}=\\dfrac{1${U('V')}}{0.5${U('m')}}=2${U('V/m')}`,900,260,{size:44}))
   +fade(seg(p,.6,.75),L('1 m で 2 V 下がる',900,360,{size:28,color:C.ink})),seg(p,0,.15));
  return s;
 },
 [K+'space2']:(p)=>{
  const y0=90,h=340;let s='';
  const xs=[110,220,330,385,440,495,550];
  [6,5,4,3,2,1,0].forEach((v,i)=>{s+=line(xs[i],y0,xs[i],y0+h,{color:VC,w:3})+label(`${v}`,xs[i],y0-14,{size:22,color:VC,anchor:'middle'});});
  s+=label('[V]',590,y0-14,{size:22,color:VC});
  [150,250,350].forEach(y=>{s+=arrow(135,y,195,y,{color:EC,w:5,head:14})+arrow(245,y,305,y,{color:EC,w:5,head:14});
   s+=fade(seg(p,.3,.5),arrow(350,y,470,y,{color:EC,w:5,head:14}));});
  s+=fade(seg(p,.15,.3),label('0.5 m',165,y0+h+40,{size:22,color:C.ink,anchor:'middle'})+label('0.25 m',412,y0+h+40,{size:22,color:C.ink,anchor:'middle'}));
  s+=card(640,100,520,310,L('間隔が 半分 → 電場は 2倍',900,150,{size:26,color:C.dim})
   +fade(seg(p,.2,.4),T(`${cs(EC,'E')}=\\dfrac{1${U('V')}}{0.25${U('m')}}=4${U('V/m')}`,900,255,{size:44}))
   +fade(seg(p,.55,.7),L('混んでいる 所ほど 強い',900,355,{size:30,color:EC,weight:700})),seg(p,0,.15));
  return s;
 },
 // ===== S5 点電荷で確かめる =====
 [K+'pc']:(p)=>pcFig(p,{pt:0,arcs:seg(p,.2,.5)})+card(660,90,500,330,L('原点に Q ＝ 1 nC',910,130,{size:28,color:POS,weight:700})
   +T(`${V}=\\dfrac{kQ}{r}`,910,232,{size:46})+L('（中級で 確かめた 結果）',910,312,{size:24,color:C.dim})
   +fade(seg(p,.55,.7),T(`kQ\\approx 8.99${U('V\\cdot m')}`,910,375,{size:38})),seg(p,0,.15)),
 [K+'pt']:(p)=>pcFig(p,{pt:seg(p,.05,.25),rline:seg(p,.25,.45)})+card(660,90,500,330,L('点 P (0.3, 0.4, 0) m',910,140,{size:28,color:C.hi,weight:700})
   +fade(seg(p,.25,.45),T(`r=\\sqrt{0.3^2+0.4^2}=0.5${U('m')}`,910,230,{size:36}))
   +fade(seg(p,.55,.75),T(`${V}=\\dfrac{8.99}{0.5}=17.98${U('V')}`,910,335,{size:40})),1),
 [K+'form']:(p)=>{
  let s=TF(`r=\\sqrt{x^2+y^2+z^2}`,600,100,{size:44});
  s+=TF(`${V}=\\dfrac{kQ}{\\sqrt{x^2+y^2+z^2}}`,600,250,{size:54,g:seg(p,.2,.4),frac:true});
  s+=fade(seg(p,.55,.7),lock(430,400)+label('y と z に 鍵 → x で 微分',460,409,{size:30,color:LC,weight:700}));
  return s;
 },
 [K+'chain']:(p)=>{
  let s=TF(`${V}=kQ\\cdot\\dfrac{1}{\\sqrt{u}},\\qquad u=x^2+y^2+z^2`,600,90,{size:40});
  s+=card(80,170,480,250,L('中身',320,215,{size:28,color:C.hi,weight:700})+T(`\\dfrac{\\partial u}{\\partial x}=2x`,320,320,{size:48}),seg(p,.15,.3));
  s+=card(640,170,480,250,L('外側',880,215,{size:28,color:C.hi,weight:700})+T(`\\dfrac{d}{du}\\dfrac{1}{\\sqrt{u}}=-\\dfrac{1}{2u\\sqrt{u}}`,880,320,{size:42}),seg(p,.5,.65));
  s+=fade(seg(p,.75,.9),L('連鎖律：外側の 微分 × 中身の 微分',600,475,{size:26,color:C.dim}));
  return s;
 },
 [K+'chain2']:(p)=>{
  const g=seg(p,.12,.28),two=g>.5?`{\\color{${BAD}}{\\cancel{2}}}`:'2';
  const e1=`\\dfrac{\\partial ${V}}{\\partial x}=kQ\\cdot\\left(-\\dfrac{1}{${two}u\\sqrt{u}}\\right)\\cdot ${two}x`;
  let s=TF(e1,600,110,{size:46});
  s+=fade(g,label('2 が 約分',980,120,{size:26,color:BAD,weight:700}));
  s+=TF(`=-\\dfrac{kQ\\,x}{r^3}`,600,320,{size:56,g:seg(p,.35,.55),box:true,frac:true});
  s+=fade(seg(p,.6,.8),T(`u\\sqrt{u}=r^2\\times r=r^3`,600,465,{size:36}));
  return s;
 },
 [K+'num']:(p)=>pcFig(p,{pt:1,rline:.5})+card(640,80,520,350,L('x＝0.3，r³＝0.125',900,125,{size:26,color:C.dim})
   +T(`\\dfrac{\\partial ${V}}{\\partial x}=-\\dfrac{8.99\\times0.3}{0.125}`,900,215,{size:38})
   +fade(seg(p,.25,.4),T(`=-21.576`,900,295,{size:40}))
   +fade(seg(p,.5,.7),T(`${Ex}\\approx 21.6${U('V/m')}`,900,385,{size:44})),1),
 [K+'numchk']:(p)=>{
  let s=card(80,50,1040,420,'',1);
  s+=L('差の 商で 確かめる（y＝0.4，z＝0 は 固定）',600,88,{size:26,color:C.dim});
  s+=T(`\\dfrac{${V}(0.3+\\Delta x,\\ 0.4)-${V}(0.3,\\ 0.4)}{\\Delta x}`,600,182,{size:34});
  const rows=[['0.01','−21.54'],['0.001','−21.57'],['→ 0','−21.576']];
  s+=label('幅 Δx [m]',380,250,{size:26,color:SC,anchor:'middle'})+label('差の 商',820,250,{size:26,color:VC,anchor:'middle'});
  rows.forEach(([a,b],i)=>{const y=310+i*58;s+=fade(seg(p,.1+i*.25,.25+i*.25),label(a,380,y,{size:34,color:C.ink,anchor:'middle'})+label(b,820,y,{size:34,color:i===2?C.hi:C.ink,anchor:'middle',weight:i===2?700:400}));});
  s+=fade(seg(p,.6,.75),label('（偏微分の 値）',990,426,{size:22,color:C.hi}));
  return s;
 },
 [K+'ey']:(p)=>pcFig(p,{pt:1,comps:seg(p,.1,.5),efull:seg(p,.55,.75)})+card(660,80,500,350,L('y 方向も 同じく',910,125,{size:26,color:C.dim})
   +T(`${Ey}=\\dfrac{8.99\\times0.4}{0.125}\\approx 28.8${U('V/m')}`,910,210,{size:34})
   +fade(seg(p,.3,.45),T(`(21.6,\\ 28.8)`,910,300,{size:40}))
   +fade(seg(p,.5,.65),L('比 3：4 ＝ 原点 → P の 向き',910,380,{size:26,color:EC,weight:700})),1),
 [K+'mag']:(p)=>pcFig(p,{pt:1,efull:1,sphere:seg(p,.4,.6),right:seg(p,.6,.75)})+card(660,80,500,350,L('大きさ',910,125,{size:26,color:C.dim})
   +T(`\\sqrt{21.576^2+28.768^2}=35.96`,910,200,{size:32})
   +fade(seg(p,.15,.3),T(`\\dfrac{kQ}{r^2}=\\dfrac{8.99}{0.25}=35.96`,910,285,{size:36}))
   +fade(seg(p,.6,.75),L('半径 0.5 m の 球面 と 直角',910,385,{size:28,color:EC,weight:700})),1),
 // ===== S6 まとめと次の問い =====
 [K+'sum']:(p)=>{
  let s=card(100,50,1000,420,'',1);
  const items=[[`${Ex}=-\\dfrac{\\partial ${V}}{\\partial x}`,'定義から 導いた（y, z を 固定）'],[`${vE}=-${NABg}`,'3方向を 並べた'],[`${vE}\\perp\\ \\text{}`,'']];
  s+=T(items[0][0],330,150,{size:44})+label(items[0][1],560,160,{size:26,color:C.ink});
  s+=fade(seg(p,.25,.4),T(items[1][0],330,270,{size:48})+label(items[1][1],560,280,{size:26,color:C.ink}));
  s+=fade(seg(p,.5,.65),label('𝐄 は 等電位面と 直角',330,400,{size:30,color:EC,anchor:'middle',weight:700})+label('面が 混むほど 強い',560,410,{size:26,color:C.ink}));
  return s;
 },
 [K+'next']:(p)=>pcFig(p,{pt:0,arcs:1})+card(660,110,500,280,L('今回 使った 前提',910,165,{size:24,color:C.dim})
   +T(`${V}=\\dfrac{kQ}{r}`,910,260,{size:50})+L('中級で 確かめた 結果',910,345,{size:26,color:C.hi,weight:700}),seg(p,0,.15)),
 [K+'next2']:(p)=>{
  let s=card(150,70,900,370,L('次の 問い',600,120,{size:24,color:C.dim}),1,C.hi);
  s+=T(`${V}=\\dfrac{kQ}{r}`,360,235,{size:50})+label('は 積分から 正面切って 導けるか？',470,245,{size:30,color:C.hi,weight:700});
  s+=fade(seg(p,.35,.55),label('どんな 静電場でも 道に よらない 理由は？',600,370,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
};

// ---- point charge figure (S5): origin at (OX,OY), 560 px per metre -------------------------------
const PO={x:120,y:460,s:560};
const PX=x=>PO.x+PO.s*x,PY=y=>PO.y-PO.s*y;
function pcFig(p,{pt=1,arcs=1,rline=0,comps=0,efull=0,sphere=0,right=0}={}){
 let s=arrow(PO.x-20,PO.y,PX(0.88),PO.y,{color:C.dim,w:2.5,head:12})+arrow(PO.x,PO.y+20,PO.x,PY(0.78),{color:C.dim,w:2.5,head:12});
 s+=label('x [m]',PX(0.88)+6,PO.y+30,{size:22,color:C.dim})+label('y',PO.x-12,PY(0.78)+8,{size:22,color:C.dim,anchor:'end'});
 [0.3].forEach(x=>{s+=line(PX(x),PO.y-6,PX(x),PO.y+6,{color:C.dim})+label(String(x),PX(x),PO.y+30,{size:21,color:C.dim,anchor:'middle'});});
 [0.4].forEach(y=>{s+=line(PO.x-6,PY(y),PO.x+6,PY(y),{color:C.dim})+label(String(y),PO.x-12,PY(y)+8,{size:21,color:C.dim,anchor:'end'});});
 const arc=(r,o=1,w=3,col=VC)=>{const pts=[];for(let i=0;i<=60;i++){const t=Math.PI/2*i/60;pts.push([PX(r*Math.cos(t)),PY(r*Math.sin(t))]);}return draw(pts,1,{color:col,w,opacity:o});};
 s+=fade(arcs,arc(0.25,.6)+arc(0.75,.6));
 s+=arc(0.5,sphere>0?1:.6,sphere>0?5:3);
 s+=fade(arcs,label('V ＝ 一定',PX(0.53),PY(0.08),{size:22,color:VC}));
 s+=charge(PO.x,PO.y,1,18);
 const px=PX(0.3),py=PY(0.4);
 s+=fade(rline,line(PO.x,PO.y,px,py,{color:C.ink,w:2,dash:'6 6'})+label('r ＝ 0.5',(PO.x+px)/2-12,(PO.y+py)/2,{size:22,color:C.ink,anchor:'end'}));
 const k=4.2; // px per V/m
 s+=fade(comps,arrow(px,py,px+21.576*k,py,{color:EC,w:4,head:12})+label('Eₓ',px+21.576*k/2,py+30,{size:22,color:EC,anchor:'middle'})
   +arrow(px+21.576*k,py,px+21.576*k,py-28.768*k,{color:EC,w:4,head:12})+label('Eᵧ',px+21.576*k+12,py-28.768*k/2,{size:22,color:EC}));
 s+=fade(efull,arrow(px,py,px+21.576*k,py-28.768*k,{color:EC,w:6,head:16})+label('𝐄',px+21.576*k-30,py-28.768*k-6,{size:28,color:EC,weight:700}));
 if(right>0){s+=fade(right,line(px-70*.8,py-70*.6,px+70*.8,py+70*.6,{color:VC,w:3,dash:'6 5'}));}
 if(right>0){const a=16,ux=.6,uy=-.8,tx=.8,ty=.6;s+=fade(right,draw([[px+a*tx,py+a*ty],[px+a*tx+a*ux,py+a*ty+a*uy],[px+a*ux,py+a*uy]],1,{color:C.hi,w:3}));}
 s+=fade(pt,dot(px,py,8,C.hi)+label('P',px-14,py-10,{size:26,color:C.hi,anchor:'end',weight:700}));
 return s;
}

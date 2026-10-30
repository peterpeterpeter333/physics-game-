// YouTube シリーズ 線積分と面積分・上級 1/4（ステージ ue-integrals 本0〜本5）— 図。Stage 1200×515.
// 色：電場 𝐄 水色、道・接線・一歩 黄、力 緑、仕事 橙、電子 青、電位 紫、法線 桃。
// 平面の図は縦横同じ縮尺（L＝H＝1 として描く）。共通の部品は export function で 2/4〜4/4 からも使う（関数の export は図のキーとして登録されない）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,poly} from './anim.mjs';

export const UC={E:C.x,P:C.hi,F:C.F,W:C.E,el:'#7aa2ff',V:C.v,N:C.p,U:C.ink};
export function card(x,y,w,h,inner,g=1,stroke=C.faint){return fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);}
export function L(s,x,y,o={}){return label(s,x,y,{anchor:'middle',size:28,color:C.ink,...o});}
export function T(s,x,y,size=40,o={}){return tex(s,x,y,{size,auto:false,...o});}
export function TF(s,x,y,size,maxW,o={}){const w=texWidth(s,size,false);return T(s,x,y,w>maxW?size*maxW/w:size,o);}
export function cc(c,s){return `{\\color{${c}}${s}}`;}
export const bE=cc(UC.E,'\\mathbf{E}'),bR=cc(UC.P,'\\mathbf{r}'),dR=cc(UC.P,'d\\mathbf{r}'),bF=cc(UC.F,'\\mathbf{F}'),rp=cc(UC.P,"\\mathbf{r}'");

// ---------- equal-scale plane ----------
export function plane({ox=100,oy=455,S=300,xmax=1.25,ymax=1.25,g=1,xt=[[1,'L']],yt=[[1,'H']],xl='x',yl='y'}={}){
 const X=x=>ox+S*x,Y=y=>oy-S*y;
 let s=arrow(X(-.08),Y(0),X(xmax)+12,Y(0),{color:C.dim,w:2.5,head:13})+arrow(X(0),Y(-.08),X(0),Y(ymax)-6,{color:C.dim,w:2.5,head:13});
 s+=label(xl,X(xmax)+18,Y(0)+8,{size:24,color:C.dim})+label(yl,X(0)+12,Y(ymax)+14,{size:24,color:C.dim});
 for(const [v,t] of xt)s+=line(X(v),Y(0)-6,X(v),Y(0)+6,{color:C.dim})+label(t,X(v),Y(0)+32,{size:22,color:C.dim,anchor:'middle'});
 for(const [v,t] of yt)s+=line(X(0)-6,Y(v),X(0)+6,Y(v),{color:C.dim})+label(t,X(0)-12,Y(v)+8,{size:22,color:C.dim,anchor:'end'});
 return {svg:fade(g,s),X,Y,S};
}
export const Efield=(x,y)=>[x,y];   // α＝1
export function fieldArrows(P,{g=1,step=.25,k=.16,xmax=1.25,ymax=1.25,color=UC.E,w=3,op=1,half=0,fn=Efield}={}){
 if(g<=0)return '';let s='';
 const pts=[];for(let i=0;i*step<=xmax+1e-9;i++)for(let j=0;j*step<=ymax+1e-9;j++)pts.push([i*step,j*step,0]);
 if(half>0)for(let i=0;i*step<=xmax;i++)for(let j=0;j*step<=ymax;j++)pts.push([(i+.5)*step,(j+.5)*step,1]);
 for(const [x,y,h] of pts){if(x>xmax+1e-9||y>ymax+1e-9)continue;const [ex,ey]=fn(x,y);if(Math.hypot(ex,ey)<1e-6)continue;
  s+=fade(h?half*.55:1,arrow(P.X(x),P.Y(y),P.X(x+k*ex),P.Y(y+k*ey),{color,w:h?2:w,head:h?8:11}));}
 return fade(g*op,s);
}
export const para=u=>[u,u*u],straight=u=>[u,u];
export function pathLine(P,fn=para,{g=1,color=UC.P,w=5,dash='',head=1,u0=0,u1=1}={}){
 const pts=Array.from({length:81},(_,i)=>{const q=fn(mix(u0,u1,i/80));return [P.X(q[0]),P.Y(q[1])];});
 let s=draw(pts,g,{color,w,dash});
 if(head&&g>.97){const a=fn(u1-.03),b=fn(u1);s+=arrow(P.X(a[0]),P.Y(a[1]),P.X(b[0]),P.Y(b[1]),{color,w,head:16});}
 return s;
}
export function ends(P,{g=1,A='A',B='B'}={}){return fade(g,dot(P.X(0),P.Y(0),7,C.ink)+label(A,P.X(0)-14,P.Y(0)+30,{size:26,color:C.ink,anchor:'end',weight:700})+dot(P.X(1),P.Y(1),7,C.ink)+label(B,P.X(1)+14,P.Y(1)-6,{size:26,color:C.ink,weight:700}));}
export function electron(x,y,g=1,r=12){return fade(g,`<circle cx="${x}" cy="${y}" r="${r}" fill="${UC.el}" stroke="${C.ink}" stroke-width="2"/>`+label('−',x,y+7,{size:22,color:'#0b1122',anchor:'middle',weight:700}));}
export function vecAt(P,at,v,{k=1,color=UC.P,w=5,g=1,head=15,lab='',ldx=8,ldy=-8,size=26,anchor='start'}={}){
 const a=[P.X(at[0]),P.Y(at[1])],b=[P.X(at[0]+k*v[0]),P.Y(at[1]+k*v[1])];
 return fade(g,arrow(a[0],a[1],b[0],b[1],{color,w,head})+(lab?label(lab,b[0]+ldx,b[1]+ldy,{size,color,weight:700,anchor}):''));
}
export function uTicks(P,fn=para,{g=1,us=[0,.25,.5,.75,1],labels=1,size=21}={}){
 let s='';for(const u of us){const q=fn(u),d=fn(Math.min(1,u+.01)),e=fn(Math.max(0,u-.01));const tx=d[0]-e[0],ty=d[1]-e[1],n=Math.hypot(tx,ty);const nx=-ty/n,ny=tx/n;
  const X=P.X(q[0]),Y=P.Y(q[1]);s+=line(X-9*nx,Y+9*ny,X+9*nx,Y-9*ny,{color:C.ink,w:3});
  if(labels&&u===0)s+=label('u＝0',X+16,Y+34,{size,color:C.ink});
  else if(labels)s+=label(`u＝${u}`,X+30*nx+4,Y-30*ny+8,{size,color:C.ink,anchor:nx<-.3?'end':'start'});}
 return fade(g,s);
}
export function qcard(lines,g=1,{x=640,y=120,w=500,h=260}={}){
 let inner=L('前回の最後の問い',x+w/2,y+48,{size:24,color:C.dim});lines.forEach((t,i)=>inner+=L(t,x+w/2,y+100+i*52,{size:30,color:C.hi,weight:700}));
 return card(x,y,w,h,inner,g,C.hi);
}
// a small curved surface patch with a (u,v) grid, for previews
export function patch(cx,cy,{g=1,grid=1,sc=1,color=UC.N}={}){
 const S=(u,v)=>[cx+sc*(-150+300*u+40*v),cy+sc*(60-150*v+30*Math.sin(Math.PI*u)-25*u)];
 const edge=(f)=>Array.from({length:21},(_,i)=>f(i/20));
 let s=poly([...edge(u=>S(u,0)),...edge(v=>S(1,v)),...edge(u=>S(1-u,1)),...edge(v=>S(0,1-v))],{fill:color,fo:.12,stroke:color,sw:2.5});
 if(grid){for(let k=1;k<5;k++){s+=fade(grid,draw(edge(u=>S(u,k/5)),1,{color,w:1.5,opacity:.7})+draw(edge(v=>S(k/5,v)),1,{color,w:1.5,opacity:.7}));}}
 return fade(g,s);
}

const K='ue-integrals-1:';
const P0=plane();
const PR={x:560,w:620,cx:870};   // right panel

function fieldScene(p,{g=1,op=1,path=0,half=0,ticks=0}={}){
 return P0.svg+fieldArrows(P0,{g,op,half})+(path?pathLine(P0,para,{g:path})+ends(P0,{g:path}):'')+(ticks?uTicks(P0,para,{g:ticks}):'');
}
// difference-quotient picture (du ＝ the step Δu in the scale u)
function secant(du,{g=1,legs=1,scaled=0}={}){
 const u=.5,a=para(u),b=para(u+du);let s='';
 s+=fade(g,dot(P0.X(a[0]),P0.Y(a[1]),8,C.ink)+label('𝐫(u)',P0.X(a[0])-12,P0.Y(a[1])-14,{size:24,color:C.ink,anchor:'end'}));
 if(du>.02)s+=fade(g,dot(P0.X(b[0]),P0.Y(b[1]),8,C.ink)+label('𝐫(u＋Δu)',P0.X(b[0])-14,P0.Y(b[1])-10,{size:24,color:C.ink,anchor:'end'}));
 if(legs){s+=fade(legs,line(P0.X(a[0]),P0.Y(a[1]),P0.X(b[0]),P0.Y(a[1]),{color:UC.P,w:5})+line(P0.X(b[0]),P0.Y(a[1]),P0.X(b[0]),P0.Y(b[1]),{color:UC.P,w:5,dash:'7 5'}));}
 if(scaled){const k=.3,v=[1,2*u+du];s+=vecAt(P0,a,v,{k,color:C.ink,w:4,g:scaled,lab:'差 ÷ Δu',ldx:10,ldy:4,size:22});}
 return s;
}
// a point at scale u with its x read on the x axis and its y read on the y axis
function readOff(u,{gx=0,gy=0,xl='Lu',yl='Hu²',col=C.hi}={}){
 const q=para(u),X=P0.X(q[0]),Y=P0.Y(q[1]),X0=P0.X(0),Y0=P0.Y(0);let s='';
 s+=fade(gx,line(X,Y,X,Y0,{color:col,w:2,dash:'5 5'})+line(X0,Y0,X,Y0,{color:col,w:7})+label(xl,(X0+X)/2,Y0+58,{size:24,color:col,anchor:'middle',weight:700}));
 s+=fade(gy,line(X,Y,X0,Y,{color:col,w:2,dash:'5 5'})+line(X0,Y0,X0,Y,{color:col,w:7})+label(yl,X0-14,(Y0+Y)/2+8,{size:24,color:col,anchor:'end',weight:700}));
 return s+dot(X,Y,8,col)+label(`u＝${u.toFixed(2)}`,X+16,Y+8,{size:22,color:col});
}

export const ytUeIntegrals1Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  const P=plane({ox:90,oy:450,S:280,xt:[],yt:[]});
  let s=P.svg+fieldArrows(P,{op:.45})+pathLine(P,para,{g:seg(p,.05,.4)});
  s+=qcard(['力学は 軌道まで届いた','では 電磁気は？'],seg(p,.05,.25));
  return s;
 },
 [K+'ask2']:(p)=>{
  const P=plane({ox:90,oy:450,S:280,xt:[],yt:[]});
  let s=P.svg+fieldArrows(P,{op:.45})+pathLine(P,para)+uTicks(P,para,{g:seg(p,.15,.35),labels:0});
  s+=fade(seg(p,.1,.3),L('道に目盛り → 仕事',260,40,{size:28,color:UC.P,weight:700}));
  s+=patch(880,280,{g:seg(p,.4,.6),grid:seg(p,.55,.75)});
  s+=fade(seg(p,.45,.65),L('面に目盛り → 電気束',880,90,{size:28,color:UC.N,weight:700}));
  s+=fade(seg(p,.8,.95),L('実際に計算するには？',880,470,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'plan']:(p)=>{
  const items=[['1/4','道に目盛り u','線積分 → u の積分'],['2/4','電子の仕事','別の道と比べる'],['3/4','電位で説明','電気束の定義'],['4/4','面に2つの目盛り','球の面積・電気束']];
  let s='';
  items.forEach(([n,a,b],i)=>{const x=50+i*280,g=seg(p,.05+i*.08,.2+i*.08),hi=i===0;
   s+=card(x,170,260,200,L(n,x+130,215,{size:24,color:C.dim})+L(a,x+130,275,{size:28,color:hi?C.hi:C.ink,weight:700})+L(b,x+130,330,{size:22,color:C.dim}),g,hi?C.hi:C.faint);});
  s+=fade(seg(p,.4,.6),line(60,130,580,130,{color:UC.P,w:4})+L('道に沿う仕事',320,110,{size:26,color:UC.P,weight:700}));
  s+=fade(seg(p,.6,.8),line(620,130,1140,130,{color:UC.N,w:4})+L('面を貫く電気束',880,110,{size:26,color:UC.N,weight:700}));
  s+=fade(seg(p,.85,.98),L('今回は 1/4',180,430,{size:28,color:C.hi,weight:700}));
  return s;
 },
 [K+'tools']:(p)=>{
  let s=card(60,90,520,330,L('部品①',320,140,{size:26,color:C.dim})+L('小さい区間の 値 × 幅 を足す',320,195,{size:28,color:C.hi,weight:700}),seg(p,.05,.2));
  for(let i=0;i<8;i++){const x=120+i*50,h=40+12*i+6*Math.sin(i);s+=fade(seg(p,.1+i*.02,.3+i*.02),rect(x,390-h,44,h,{fill:UC.W,fo:.35,stroke:UC.W,sw:1.5,rx:2}));}
  s+=card(620,90,520,330,L('部品②',880,140,{size:26,color:C.dim})+L('内積：進む向きの成分だけ',880,195,{size:28,color:C.hi,weight:700}),seg(p,.45,.6));
  const g2=seg(p,.5,.7);
  s+=fade(g2,arrow(700,370,1060,370,{color:UC.P,w:5,head:16})+label('進む向き',1060,405,{size:22,color:UC.P,anchor:'end'})
   +arrow(700,370,900,250,{color:UC.F,w:5,head:16})+line(900,250,900,370,{color:C.dim,w:2,dash:'5 5'})+line(700,382,900,382,{color:UC.F,w:8})
   +label('使う成分',800,412,{size:22,color:UC.F,anchor:'middle',weight:700}));
  return s;
 },

 // ===== S2 電場という関数と電子 =====
 [K+'field']:(p)=>{
  let s=P0.svg+fieldArrows(P0,{g:seg(p,.05,.4)});
  const g=seg(p,.45,.65),q=[.75,.5];
  s+=fade(g,ring(P0.X(q[0]),P0.Y(q[1]),12,{color:C.hi,w:3})+label('点 (x, y)',P0.X(q[0])+16,P0.Y(q[1])+34,{size:22,color:C.hi}));
  s+=card(PR.x,110,PR.w,250,L('電場 ＝ 各点に 矢印を1本ずつ',PR.cx,180,{size:28,color:C.ink})+L('対応させる 関数',PR.cx,230,{size:28,color:C.ink})
   +fade(seg(p,.45,.65),T(`(x,y)\\ \\longmapsto\\ ${bE}(x,y)`,PR.cx,305,40)),seg(p,.1,.3));
  return s;
 },
 [K+'ex']:(p)=>{
  let s=P0.svg+fieldArrows(P0);
  s+=card(PR.x,70,PR.w,170,T(`${bE}(x,y)=(\\alpha x,\\ \\alpha y)`,PR.cx,135,44)+T('\\alpha=1\\ \\mathrm{V/m^2}',PR.cx,200,34,{color:C.dim}),seg(p,.02,.15));
  const g1=seg(p,.4,.55),g2=seg(p,.6,.75);
  s+=fade(g1,ring(P0.X(1),P0.Y(.25),10,{color:C.hi,w:3})+vecAt(P0,[1,.25],[1,.25],{k:.16,color:C.hi,w:4,head:12}));
  s+=fade(g2,ring(P0.X(.25),P0.Y(1),10,{color:C.hi,w:3})+vecAt(P0,[.25,1],[.25,1],{k:.16,color:C.hi,w:4,head:12}));
  s+=fade(g1,L('右の点 (1, 0.25) → 右向きが大',PR.cx,310,{size:26}));
  s+=fade(g2,L('上の点 (0.25, 1) → 上向きが大',PR.cx,370,{size:26}));
  return s;
 },
 [K+'grid']:(p)=>{
  let s=P0.svg+fieldArrows(P0,{half:seg(p,.3,.65)});
  s+=card(PR.x,150,PR.w,200,L('描いたのは 格子の点だけ',PR.cx,215,{size:28})+fade(seg(p,.4,.6),L('すき間の どの点にも 矢印がある',PR.cx,285,{size:28,color:UC.E,weight:700})),seg(p,.02,.15));
  return s;
 },
 [K+'electron']:(p)=>{
  const q=para(.6);
  let s=P0.svg+fieldArrows(P0,{op:mix(1,.35,seg(p,.1,.4))});
  s+=electron(P0.X(q[0]),P0.Y(q[1]),seg(p,.05,.25));
  s+=card(PR.x,120,PR.w,240,L('電子の電荷',PR.cx,180,{size:26,color:C.dim})+T('q=-e',PR.cx,245,48)+fade(seg(p,.5,.7),L('e ＞ 0：正の電荷の大きさ',PR.cx,315,{size:26})),seg(p,.1,.3));
  return s;
 },
 [K+'force']:(p)=>{
  const q=para(.6);
  let s=P0.svg+fieldArrows(P0,{op:.3});
  s+=vecAt(P0,q,q,{k:.45,color:UC.E,w:5,lab:'𝐄',g:seg(p,.02,.2)});
  s+=vecAt(P0,q,[-q[0],-q[1]],{k:.45,color:UC.F,w:5,lab:'−e𝐄',ldx:-10,ldy:28,anchor:'end',g:seg(p,.2,.4)});
  s+=electron(P0.X(q[0]),P0.Y(q[1]));
  s+=card(PR.x,110,PR.w,260,T(`${bF}=-e\\,${bE}(${bR})`,PR.cx,180,44)+fade(seg(p,.2,.4),L('その点の電場と 逆向き',PR.cx,250,{size:28,color:UC.F,weight:700}))
   +fade(seg(p,.6,.8),L('周りの矢印は 電子を引かない',PR.cx,320,{size:26,color:C.dim})),seg(p,.02,.15));
  return s;
 },
 [K+'external']:(p)=>{
  const u=mix(.15,.85,seg(p,.2,.9)),q=para(u);
  let s=P0.svg+fieldArrows(P0,{op:.3})+pathLine(P0,para,{g:seg(p,.02,.25)})+ends(P0,{g:seg(p,.02,.25)});
  s+=electron(P0.X(q[0]),P0.Y(q[1]));
  s+=card(PR.x,120,PR.w,240,L('外からの力で',PR.cx,180,{size:28})+L('決めた道に沿って 運ぶ',PR.cx,230,{size:30,color:UC.P,weight:700})
   +fade(seg(p,.55,.75),L('電気力だけの軌道 ではない',PR.cx,305,{size:26,color:C.dim})),seg(p,.05,.2));
  return s;
 },
 [K+'goal']:(p)=>{
  const q=para(.85);
  let s=P0.svg+fieldArrows(P0,{op:.3})+pathLine(P0,para)+ends(P0)+electron(P0.X(q[0]),P0.Y(q[1]));
  s+=card(PR.x,110,PR.w,260,L('求めるもの',PR.cx,165,{size:26,color:C.dim})+L('電気力が する仕事',PR.cx,230,{size:34,color:UC.W,weight:700})
   +fade(seg(p,.45,.65),L('外からの力の仕事とは 別に数える',PR.cx,305,{size:26})),seg(p,.02,.2),UC.W);
  return s;
 },

 // ===== S3 振り返り =====
 [K+'dot']:(p)=>{
  const ox=140,oy=370,ang=.35,Ls=360,fa=1.25,FL=230;
  const d=[Math.cos(ang),-Math.sin(ang)],f=[Math.cos(fa),-Math.sin(fa)],c=Math.cos(fa-ang);
  const F=[ox+FL*f[0],oy+FL*f[1]],Pp=[ox+FL*c*d[0],oy+FL*c*d[1]];
  let s=arrow(ox,oy,ox+Ls*d[0],oy+Ls*d[1],{color:UC.P,w:6,head:18})+label('d𝐫',ox+Ls*d[0]+10,oy+Ls*d[1]+8,{size:28,color:UC.P,weight:700});
  s+=fade(seg(p,.05,.2),arrow(ox,oy,F[0],F[1],{color:UC.F,w:5,head:16})+label('力',F[0]-12,F[1]-8,{size:26,color:UC.F,anchor:'end',weight:700}));
  const g=seg(p,.35,.55);
  s+=fade(g,line(F[0],F[1],Pp[0],Pp[1],{color:C.dim,w:2.5,dash:'6 5'})+line(ox,oy,Pp[0],Pp[1],{color:UC.F,w:9})
   +label('沿う部分',(ox+Pp[0])/2+10,(oy+Pp[1])/2+40,{size:24,color:UC.F,weight:700})+label('直角な部分（仕事 0）',Pp[0]+30,(F[1]+Pp[1])/2-20,{size:22,color:C.dim}));
  s+=card(PR.x+40,130,PR.w-40,220,L('一歩の仕事 ＝',PR.cx+20,190,{size:28,color:C.dim})+L('沿う部分 × 一歩の長さ',PR.cx+20,250,{size:32,color:C.hi,weight:700})+L('（内積・上級）',PR.cx+20,310,{size:22,color:C.dim}),seg(p,.55,.75));
  return s;
 },
 [K+'comp']:(p)=>{
  const ox=140,oy=400,dx=300,dy=160;
  let s=arrow(ox,oy,ox+dx,oy-dy,{color:UC.P,w:6,head:18})+label('d𝐫',ox+dx*.6+6,oy-dy*.6+40,{size:28,color:UC.P,weight:700});
  s+=fade(seg(p,.05,.25),line(ox,oy+14,ox+dx,oy+14,{color:UC.P,w:4})+label('dx',ox+dx/2,oy+46,{size:26,color:UC.P,anchor:'middle'})+line(ox+dx+14,oy,ox+dx+14,oy-dy,{color:UC.P,w:4})+label('dy',ox+dx+26,oy-dy/2+8,{size:26,color:UC.P}));
  s+=fade(seg(p,.1,.3),arrow(ox,oy,ox+180,oy-250,{color:UC.E,w:5,head:16})+label('𝐄',ox+190,oy-256,{size:28,color:UC.E,weight:700}));
  s+=T(`${bE}\\cdot${dR}=${cc(UC.E,'E_x')}\\,${cc(UC.P,'dx')}+${cc(UC.E,'E_y')}\\,${cc(UC.P,'dy')}`,PR.cx+20,190,46);
  s+=fade(seg(p,.45,.65),L('水平どうし ＋ 鉛直どうし',PR.cx+20,280,{size:28,color:C.hi,weight:700}));
  s+=fade(seg(p,.45,.65),L('（直角な組は 0 で消える）',PR.cx+20,330,{size:24,color:C.dim}));
  return s;
 },
 [K+'work']:(p)=>{
  let s=T(`dK=${cc(UC.F,'\\mathbf{F}')}\\cdot${dR}`,600,140,50);
  s+=L('（𝐅：はたらく力すべての合力。仕事・上級）',600,205,{size:24,color:C.dim});
  s+=fade(seg(p,.4,.6),T(`dW=${cc(C.p,'q')}\\,${bE}\\cdot${dR}`,600,320,54,{color:UC.W}));
  s+=fade(seg(p,.4,.6),L('そのうち 電気力 q𝐄 の分',600,390,{size:28,color:UC.W,weight:700}));
  return s;
 },
 [K+'sum']:(p)=>{
  let s=P0.svg+fieldArrows(P0,{op:.3});
  const N=6,g1=seg(p,.02,.3);
  for(let i=0;i<N;i++){const a=para(i/N),b=para((i+1)/N);s+=fade(seg(p,.02+i*.04,.12+i*.04),arrow(P0.X(a[0]),P0.Y(a[1]),P0.X(b[0]),P0.Y(b[1]),{color:UC.P,w:4,head:12}));}
  s+=ends(P0,{g:g1});
  s+=fade(seg(p,.25,.45),TF(`W\\approx\\sum_i q\\,${bE}(${bR}_i)\\cdot\\Delta${bR}_i`,PR.cx,120,40,600));
  s+=fade(seg(p,.45,.6),L('↓ 細かくした 行き先',PR.cx,225,{size:24,color:C.dim}));
  s+=fade(seg(p,.5,.65),T(`W=\\int_C q\\,${bE}\\cdot${dR}`,PR.cx,310,50));
  s+=fade(seg(p,.7,.85),L('道 C と 進む向き も 答えを決める',PR.cx,390,{size:26,color:C.hi,weight:700}));
  return s;
 },
 [K+'problem']:(p)=>{
  let s=P0.svg+fieldArrows(P0,{op:.25})+pathLine(P0,para)+ends(P0);
  [[.2,.1],[.55,.35],[.88,.6]].forEach(([u,t])=>{const q=para(u),g=seg(p,t,t+.2);
   s+=vecAt(P0,q,[1,2*u],{k:.22,color:UC.P,w:5,g,head:12});s+=vecAt(P0,q,q,{k:.4,color:UC.E,w:4,g,head:12});});
  s+=card(PR.x,120,PR.w,250,T(`\\int_C q\\,${bE}\\cdot${dR}\\ =\\ ?`,PR.cx,190,46)
   +fade(seg(p,.2,.4),L('d𝐫 の向きも 𝐄 も',PR.cx,265,{size:28}))+fade(seg(p,.2,.4),L('場所ごとに 変わる',PR.cx,315,{size:28,color:C.hi,weight:700})),seg(p,.02,.15));
  return s;
 },

 // ===== S4 道に目盛り u =====
 [K+'path']:(p)=>{
  let s=P0.svg+pathLine(P0,para,{g:seg(p,.1,.6)})+ends(P0,{g:seg(p,.02,.15)});
  s+=fade(seg(p,.1,.3),L('A＝(0, 0)',PR.cx,170,{size:30})+L('B＝(L, H)',PR.cx,230,{size:30}));
  s+=fade(seg(p,.5,.7),L('放物線の道',PR.cx,310,{size:30,color:UC.P,weight:700}));
  return s;
 },
 [K+'mark']:(p)=>{
  let s=P0.svg+pathLine(P0,para)+ends(P0)+uTicks(P0,para,{g:seg(p,.15,.45)});
  s+=card(PR.x,120,PR.w,230,L('道に 目盛り u（0 → 1）',PR.cx,190,{size:30,color:C.ink,weight:700})+fade(seg(p,.45,.65),L('A：u＝0　　B：u＝1',PR.cx,265,{size:30,color:C.hi})),seg(p,.02,.15));
  return s;
 },
 [K+'readx']:(p)=>{
  const u=Math.round(mix(.3,.8,seg(p,.55,.85))*100)/100;
  let s=P0.svg+pathLine(P0,para)+ends(P0)+uTicks(P0,para,{labels:0})+readOff(u,{gx:seg(p,.1,.3)});
  s+=card(PR.x,110,PR.w,250,L('x は L の 何割まで 進んだ？',PR.cx,175,{size:28})+fade(seg(p,.3,.5),L('その割合 ＝ 目盛り u',PR.cx,235,{size:28,color:C.hi}))+fade(seg(p,.6,.8),T('x=Lu',PR.cx,310,46,{color:C.hi})),seg(p,.02,.15));
  return s;
 },
 [K+'ready']:(p)=>{
  let s=P0.svg+pathLine(P0,para)+ends(P0)+uTicks(P0,para,{labels:0});
  const g=seg(p,.5,.7);
  s+=fade(g,line(P0.X(1),P0.Y(1),P0.X(0),P0.Y(1),{color:C.hi,w:2,dash:'5 5'})+line(P0.X(1),P0.Y(1),P0.X(1),P0.Y(0),{color:C.hi,w:2,dash:'5 5'})+dot(P0.X(1),P0.Y(1),9,C.hi));
  s+=card(PR.x,100,PR.w,280,L('高さ y は 放物線の式で',PR.cx,150,{size:28})+fade(seg(p,.2,.4),T('y=H\\left(\\frac{x}{L}\\right)^2',PR.cx,250,44))+fade(g,L('x＝L のとき y＝H（点 B）',PR.cx,345,{size:26,color:C.hi})),seg(p,.02,.15));
  return s;
 },
 [K+'ready2']:(p)=>{
  let s=P0.svg+pathLine(P0,para)+ends(P0)+uTicks(P0,para,{labels:0})+readOff(.5,{gx:.45,gy:seg(p,.55,.75),xl:'L/2',yl:'H/4'});
  s+=card(PR.x,95,PR.w,290,T('\\frac{x}{L}=u',PR.cx,170,40)+fade(seg(p,.15,.35),T('y=H\\left(\\frac{x}{L}\\right)^2=Hu^2',PR.cx,265,40,{color:C.hi}))+fade(seg(p,.55,.75),T('u=0.5:\\ \\ y=\\tfrac{1}{4}H',PR.cx,345,34,{color:C.hi})),seg(p,.02,.15));
  return s;
 },
 [K+'param']:(p)=>{
  const u=Math.round(mix(.1,.9,seg(p,.5,.9))*100)/100,q=para(u);
  let s=P0.svg+pathLine(P0,para)+ends(P0)+uTicks(P0,para);
  s+=fade(seg(p,.5,.6),dot(P0.X(q[0]),P0.Y(q[1]),9,C.hi));
  s+=card(PR.x,110,PR.w,230,T(`${bR}(u)=(Lu,\\ Hu^2)`,PR.cx,185,48)+fade(seg(p,.5,.7),L('u は 道の点の番号（時刻ではない）',PR.cx,270,{size:26,color:C.hi})),seg(p,.02,.2));
  return s;
 },
 [K+'nottime']:(p)=>{
  let s=P0.svg+pathLine(P0,para)+ends(P0)+uTicks(P0,para,{labels:0});
  const rx0=640,rx1=1100,ry=420,g=seg(p,.1,.35);
  s+=fade(g,line(rx0,ry,rx1,ry,{color:C.ink,w:4}));
  [0,.25,.5,.75,1].forEach(u=>{const X=mix(rx0,rx1,u),q=para(u);s+=fade(g,line(X,ry-10,X,ry+10,{color:C.ink,w:3})+label(String(u),X,ry+38,{size:22,color:C.ink,anchor:'middle'}));
   s+=fade(seg(p,.3,.5)*.5,line(X,ry-12,P0.X(q[0]),P0.Y(q[1]),{color:C.dim,w:1.5,dash:'4 6'}));});
  s+=card(PR.x+40,90,PR.w-40,170,L('u ＝ 道の目盛り（番号）',PR.cx+20,150,{size:30,color:C.ink,weight:700})+fade(seg(p,.5,.7),L('時刻 ではない',PR.cx+20,215,{size:28,color:C.a,weight:700})),seg(p,.02,.15));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=P0.svg+pathLine(P0,para)+ends(P0)+uTicks(P0,para,{labels:0})+secant(0,{legs:0});
  const q=para(.5);
  s+=fade(seg(p,.2,.4),label('？',P0.X(q[0])+40,P0.Y(q[1])-30,{size:44,color:C.hi,weight:700}));
  s+=card(PR.x,130,PR.w,220,L('u を 少し進めると',PR.cx,195,{size:30})+L('位置は どちら向きに どれだけ？',PR.cx,260,{size:30,color:C.hi,weight:700})+fade(seg(p,.5,.7),L('予想してみよう',PR.cx,320,{size:24,color:C.hi})),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'diffx']:(p)=>{
  let s=P0.svg+pathLine(P0,para,{g:1,head:0})+ends(P0)+secant(.25,{legs:seg(p,.3,.5)});
  s+=fade(seg(p,.3,.5),label('LΔu',P0.X(.625),P0.Y(.25)+30,{size:24,color:UC.P,anchor:'middle',weight:700}));
  s+=TF('x:\\ L(u+\\Delta u)-Lu=L\\Delta u',PR.cx,160,40,600);
  s+=fade(seg(p,.6,.8),T('\\div \\Delta u\\ \\to\\ L',PR.cx,240,40,{color:C.hi}));
  s+=fade(seg(p,.05,.2),L('分かりやすく Δu を大きく描いた',PR.cx,440,{size:22,color:C.dim}));
  return s;
 },
 [K+'diffy']:(p)=>{
  let s=P0.svg+pathLine(P0,para,{head:0})+ends(P0)+secant(.25);
  s+=fade(seg(p,.1,.3),label('y の差',P0.X(.75)+14,P0.Y(.42)+8,{size:24,color:UC.P,weight:700}));
  s+=TF('x:\\ L(u+\\Delta u)-Lu=L\\Delta u',PR.cx,120,32,600,{color:C.dim});
  s+=TF('y:\\ H(u+\\Delta u)^2-Hu^2',PR.cx,210,40,600);
  s+=fade(seg(p,.45,.65),TF('=2Hu\\,\\Delta u+H(\\Delta u)^2',PR.cx+40,285,40,560,{color:C.hi}));
  return s;
 },
 [K+'divide']:(p)=>{
  const du=Math.round(mix(.25,.02,seg(p,.35,.85))*100)/100;
  let s=P0.svg+pathLine(P0,para,{head:0})+ends(P0)+secant(du,{legs:0,scaled:1});
  s+=TF('(2Hu\\,\\Delta u+H(\\Delta u)^2)\\div \\Delta u=2Hu+H\\Delta u',PR.cx,130,38,600);
  s+=fade(seg(p,.35,.55),TF(`\\Delta u\\to0:\\ \\ 2Hu+${cc(C.a,'H\\Delta u')}\\ \\to\\ 2Hu`,PR.cx,215,40,600,{color:C.hi}));
  s+=fade(seg(p,.35,.5),L(`Δu ＝ ${du.toFixed(2)}`,PR.cx,300,{size:28,color:C.dim}));
  s+=fade(seg(p,.6,.8),L('差 ÷ Δu の矢印が 接線に 近づく',PR.cx,360,{size:26}));
  return s;
 },
 [K+'tangent']:(p)=>{
  let s=P0.svg+pathLine(P0,para)+ends(P0)+secant(0,{legs:0});
  s+=vecAt(P0,para(.5),[1,1],{k:.3,color:UC.P,w:6,lab:'𝐫′',g:seg(p,.05,.3),ldx:8,ldy:-6,size:30});
  s+=card(PR.x,110,PR.w,250,T(`${rp}(u)=(L,\\ 2Hu)`,PR.cx,185,50)+fade(seg(p,.45,.65),L('目盛り1あたりの 位置の変化',PR.cx,260,{size:26}))+fade(seg(p,.6,.8),L('向き ＝ 道の接線',PR.cx,315,{size:28,color:UC.P,weight:700})),seg(p,.02,.2));
  return s;
 },
 [K+'dr']:(p)=>{
  let s=P0.svg+pathLine(P0,para)+ends(P0)+secant(0,{legs:0});
  s+=vecAt(P0,para(.5),[1,1],{k:.3,color:UC.P,w:3,g:.35});
  s+=vecAt(P0,para(.5),[1,1],{k:.1,color:UC.P,w:7,head:14,g:seg(p,.3,.5),lab:'d𝐫',ldx:16,ldy:30,size:28});
  s+=card(PR.x,110,PR.w,250,T(`${dR}=${rp}(u)\\,du`,PR.cx,190,54)+fade(seg(p,.45,.65),L('du 進めた 一歩',PR.cx,270,{size:28}))+fade(seg(p,.65,.85),L('曲がった道の一歩が u で書けた',PR.cx,325,{size:26,color:C.hi,weight:700})),seg(p,.02,.2));
  return s;
 },
 [K+'drcheck']:(p)=>{
  let s=P0.svg+pathLine(P0,para)+ends(P0);
  s+=vecAt(P0,[0,0],[1,0],{k:.3,color:UC.P,w:6,g:seg(p,.05,.25),lab:'(L, 0)',ldx:6,ldy:-14});
  s+=vecAt(P0,[1,1],[1,2],{k:.12,color:UC.P,w:6,g:seg(p,.35,.55),lab:'(L, 2H)',ldx:-90,ldy:-14});
  s+=card(PR.x,130,PR.w,210,L('u＝0：真横',PR.cx,195,{size:30})+fade(seg(p,.35,.55),L('u＝1：斜め上',PR.cx,255,{size:30}))+fade(seg(p,.6,.8),L('だんだん急になる 形と一致',PR.cx,310,{size:26,color:C.hi,weight:700})),seg(p,.02,.2));
  return s;
 },

 // ===== S5 電場も同じ u =====
 [K+'sub']:(p)=>{
  const u=.6,q=para(u);
  let s=fieldScene(p,{op:.25,path:1})+dot(P0.X(q[0]),P0.Y(q[1]),7,C.ink)+label('u',P0.X(q[0])+12,P0.Y(q[1])+26,{size:24,color:C.ink});
  s+=vecAt(P0,q,q,{k:.45,color:UC.E,w:5,g:seg(p,.6,.8),lab:'𝐄'});
  s+=T(`${bE}=(\\alpha x,\\ \\alpha y)`,PR.cx,110,40);
  s+=fade(seg(p,.2,.4),T('x=Lu,\\quad y=Hu^2',PR.cx,185,36,{color:C.dim}));
  s+=fade(seg(p,.5,.7),T(`${bE}(${bR}(u))=(\\alpha Lu,\\ \\alpha Hu^2)`,PR.cx,275,42,{color:C.ink}));
  return s;
 },
 [K+'meaning']:(p)=>{
  const u=Math.round(mix(.2,.9,seg(p,.15,.9))*100)/100,q=para(u);
  let s=fieldScene(p,{op:.2,path:1});
  s+=vecAt(P0,q,q,{k:.45,color:UC.E,w:5,lab:'𝐄'})+electron(P0.X(q[0]),P0.Y(q[1]));
  s+=card(PR.x,110,PR.w,250,L('目盛り u の点で 読む電場',PR.cx,175,{size:28,color:UC.E,weight:700})+L(`u ＝ ${u.toFixed(2)}`,PR.cx,240,{size:30})
   +T(`${bE}=(${(u).toFixed(2)},\\ ${(u*u).toFixed(2)})\\ \\mathrm{V/m}`,PR.cx,305,34),seg(p,.02,.15));
  s+=fade(seg(p,.02,.15),L('L＝H＝1 m のとき',PR.cx,410,{size:22,color:C.dim}));
  return s;
 },
 [K+'dot1']:(p)=>{
  const u=.6,q=para(u),k1=.45,k2=.22;
  let s=fieldScene(p,{op:.15,path:1});
  s+=vecAt(P0,q,q,{k:k1,color:UC.E,w:5,lab:'𝐄',ldx:-30,ldy:-12});
  s+=vecAt(P0,q,[1,2*u],{k:k2,color:UC.P,w:5,lab:'𝐫′',ldx:-34,ldy:0});
  const g=seg(p,.3,.5);
  s+=fade(g,line(P0.X(q[0]),P0.Y(q[1])+16,P0.X(q[0]+k1*q[0]),P0.Y(q[1])+16,{color:UC.E,w:7})+line(P0.X(q[0]),P0.Y(q[1])+28,P0.X(q[0]+k2),P0.Y(q[1])+28,{color:UC.P,w:7})+label('水平',P0.X(q[0]+.3),P0.Y(q[1])+60,{size:22,color:C.hi,anchor:'middle'}));
  s+=T(`${rp}=(L,\\ 2Hu)`,PR.cx,100,36,{color:C.dim});
  s+=T(`${bE}\\cdot${rp}=${cc(UC.E,'\\alpha Lu')}\\times ${cc(UC.P,'L')}+\\cdots`,PR.cx,195,40);
  s+=fade(seg(p,.55,.75),T('=\\alpha L^2u+\\cdots',PR.cx,275,40,{color:C.hi}));
  return s;
 },
 [K+'dot2']:(p)=>{
  const u=.6,q=para(u),k1=.45,k2=.22;
  let s=fieldScene(p,{op:.15,path:1});
  s+=vecAt(P0,q,q,{k:k1,color:UC.E,w:5,lab:'𝐄',ldx:-30,ldy:-12});
  s+=vecAt(P0,q,[1,2*u],{k:k2,color:UC.P,w:5,lab:'𝐫′',ldx:-34,ldy:0});
  const g=seg(p,.05,.25);
  s+=fade(g,line(P0.X(q[0])-16,P0.Y(q[1]),P0.X(q[0])-16,P0.Y(q[1]+k1*q[1]),{color:UC.E,w:7})+line(P0.X(q[0])-28,P0.Y(q[1]),P0.X(q[0])-28,P0.Y(q[1]+k2*2*u),{color:UC.P,w:7})+label('鉛直',P0.X(q[0])-40,P0.Y(q[1])-20,{size:22,color:C.hi,anchor:'end'}));
  s+=T(`${bE}\\cdot${rp}=\\alpha L^2u+${cc(UC.E,'\\alpha Hu^2')}\\times ${cc(UC.P,'2Hu')}`,PR.cx,140,38);
  s+=fade(seg(p,.4,.6),T('=\\alpha L^2u+2\\alpha H^2u^3',PR.cx,250,46,{color:C.hi}));
  return s;
 },
 [K+'integral']:(p)=>{
  const P=plane({ox:70,oy:470,S:150,xt:[],yt:[],xl:'',yl:''});
  let s=P.svg+pathLine(P,para,{w:4})+uTicks(P,para,{labels:0});
  s+=TF(`\\int_C q\\,${bE}\\cdot${dR}\\;=\\;\\int_0^1 q\\,${bE}(${bR}(u))\\cdot${rp}(u)\\,du`,690,150,46,880);
  const g=seg(p,.25,.45);
  s+=fade(g,L('d𝐫 → 𝐫′(u) du',540,260,{size:28,color:UC.P,weight:700})+L('道 C → u の 0 から 1',880,260,{size:28,color:C.ink,weight:700}));
  s+=card(420,320,740,110,L('曲がった道の線積分 ＝ u の普通の積分',790,388,{size:30,color:C.hi,weight:700}),seg(p,.55,.75),C.hi);
  return s;
 },
 [K+'integrand']:(p)=>{
  const ox=140,oy=440,sx=330,sy=110,f=u=>u+2*u**3;
  let s=arrow(ox-10,oy,ox+sx+50,oy,{color:C.dim,w:2.5,head:13})+arrow(ox,oy+10,ox,oy-3.2*sy,{color:C.dim,w:2.5,head:13});
  s+=label('u',ox+sx+56,oy+8,{size:24,color:C.dim})+label('1',ox+sx,oy+32,{size:22,color:C.dim,anchor:'middle'})+label('0',ox-8,oy+32,{size:22,color:C.dim,anchor:'end'});
  [1,2,3].forEach(v=>{s+=line(ox-6,oy-v*sy,ox+6,oy-v*sy,{color:C.dim})+label(String(v),ox-12,oy-v*sy+8,{size:22,color:C.dim,anchor:'end'});});
  s+=label('（V）',ox+14,oy-3.2*sy+6,{size:22,color:C.dim});
  const pts=Array.from({length:61},(_,i)=>{const u=i/60;return [ox+sx*u,oy-sy*f(u)];});
  s+=fade(seg(p,.35,.6),poly([[ox,oy],...pts,[ox+sx,oy]],{fill:UC.W,fo:.22}));
  s+=draw(pts,seg(p,.05,.35),{color:UC.W,w:4});
  s+=TF(`q\\int_0^1(\\alpha L^2u+2\\alpha H^2u^3)\\,du`,PR.cx,150,44,600);
  s+=fade(seg(p,.05,.25),L('グラフは L＝H＝1 m、α＝1 V/m²',PR.cx,240,{size:24,color:C.dim}));
  s+=fade(seg(p,.4,.6),L('何を：この関数　どこからどこまで：0〜1',PR.cx,320,{size:26,color:C.hi,weight:700}));
  return s;
 },

 // ===== S6 中級の約束 =====
 ...(()=>{
  const PF=plane({xt:[[1,'1']],yt:[[1,'1']],xl:'x（m）',yl:'y（m）'});
  const Ffn=(x,y)=>[0,x];
  const base=(o={})=>PF.svg+fieldArrows(PF,{fn:Ffn,color:UC.F,k:.2,op:o.op??.6})+pathLine(PF,para,{g:o.path??1})+(o.ends??1?fade(o.ends??1,dot(PF.X(0),PF.Y(0),7,C.ink)+dot(PF.X(1),PF.Y(1),7,C.ink)+label('(1, 1) m',PF.X(1)+14,PF.Y(1)-8,{size:22,color:C.ink})):'');
  const chords=(N,g)=>{let s='';for(let i=0;i<N;i++){const a=para(i/N),b=para((i+1)/N);s+=line(PF.X(a[0]),PF.Y(a[1]),PF.X(b[0]),PF.Y(b[1]),{color:C.ink,w:2.5});s+=dot(PF.X(b[0]),PF.Y(b[1]),3.5,C.ink);}return fade(g,s);};
  const table=(g,rows=3,lim=0)=>{let t=L('分割数',PR.cx-120,150,{size:24,color:C.dim})+L('仕事',PR.cx+110,150,{size:24,color:C.dim});
   [['4','0.656 J'],['8','0.664 J'],['16','0.666 J']].slice(0,rows).forEach(([n,w],i)=>{t+=L(n,PR.cx-120,205+i*52,{size:30})+L(w,PR.cx+110,205+i*52,{size:30,color:UC.W})});
   if(lim)t+=fade(lim,L('→ 2/3 J ≈ 0.667 J',PR.cx+60,370,{size:32,color:C.hi,weight:700}));return card(PR.x+60,110,PR.w-60,lim?300:250,t,g);};
  return {
   [K+'promise']:(p)=>{
    let s=base({path:seg(p,.3,.6),ends:seg(p,.3,.5)});
    s+=card(PR.x,120,PR.w,270,L('中級の例',PR.cx,175,{size:24,color:C.dim})+T(`${bF}=(0,\\ x)\\ \\mathrm{N}`,PR.cx,240,44)+L('いつも上向き・右ほど強い',PR.cx,295,{size:24,color:UC.F})+fade(seg(p,.3,.5),L('道：y＝x²（原点 → (1, 1) m）',PR.cx,345,{size:28,color:UC.P,weight:700})),seg(p,.02,.15));
    return s;
   },
   [K+'nums']:(p)=>{
    const n=p<.3?4:p<.55?8:16;
    let s=base({op:.35})+chords(n,1);
    s+=table(seg(p,.02,.15),p<.3?1:p<.55?2:3);
    s+=fade(seg(p,.7,.85),L('分割せずに出すのは 上級',PR.cx+30,420,{size:26,color:C.hi,weight:700}));
    return s;
   },
   [K+'param2']:(p)=>{
    let s=base({op:.35})+uTicks(PF,para,{g:seg(p,.2,.4)});
    s+=card(PR.x,120,PR.w,240,T(`${bR}(u)=(u,\\ u^2)`,PR.cx,190,48)+fade(seg(p,.4,.6),L('x＝u、y＝u² → y＝x²',PR.cx,270,{size:30,color:UC.P,weight:700})),seg(p,.02,.15));
    return s;
   },
   [K+'tangent2']:(p)=>{
    const u=.6,q=para(u);
    let s=base({op:.2});
    s+=vecAt(PF,q,[1,2*u],{k:.25,color:UC.P,w:6,lab:'𝐫′',g:seg(p,.05,.25),ldx:-34,ldy:6,size:28});
    s+=vecAt(PF,q,[0,u],{k:.45,color:UC.F,w:6,lab:'𝐅',g:seg(p,.45,.65),ldx:-30,ldy:4,size:28});
    s+=T(`${rp}=(1,\\ 2u)`,PR.cx,170,46);
    s+=fade(seg(p,.45,.65),T(`${bF}=(0,\\ x)=(0,\\ u)`,PR.cx,265,46));
    return s;
   },
   [K+'dot3']:(p)=>{
    const u=.6,q=para(u),k=.25,a=[PF.X(q[0]),PF.Y(q[1])];
    let s=base({op:.2});
    s+=vecAt(PF,q,[1,2*u],{k,color:UC.P,w:5,g:.5});
    s+=vecAt(PF,q,[0,u],{k:.45,color:UC.F,w:6,lab:'𝐅',ldx:-30,ldy:4,size:28});
    const g=seg(p,.35,.55),bx=PF.X(q[0]+k),by=PF.Y(q[1]+k*2*u);
    s+=fade(g,line(a[0],a[1],bx,a[1],{color:UC.P,w:6})+line(bx,a[1],bx,by,{color:UC.P,w:6})+label('水平 1',(a[0]+bx)/2,a[1]+30,{size:22,color:UC.P,anchor:'middle'})+label('鉛直 2u',bx+10,(a[1]+by)/2+8,{size:22,color:UC.P}));
    s+=fade(seg(p,.6,.75),line(a[0]+10,a[1]-10,bx-10,a[1]+10,{color:C.a,w:3})+label('力と直角 → 0',(a[0]+bx)/2+10,a[1]+60,{size:22,color:C.a,anchor:'middle',weight:700}));
    s+=T(`${bF}\\cdot${rp}=0\\times1+u\\times2u`,PR.cx,170,42);
    s+=fade(seg(p,.2,.4),T('=2u^2',PR.cx+60,250,46,{color:C.hi}));
    return s;
   },
   [K+'int']:(p)=>{
    const ox=140,oy=440,sx=330,sy=150,f=u=>2*u*u;
    let s=arrow(ox-10,oy,ox+sx+50,oy,{color:C.dim,w:2.5,head:13})+arrow(ox,oy+10,ox,oy-2.4*sy,{color:C.dim,w:2.5,head:13});
    s+=label('u',ox+sx+56,oy+8,{size:24,color:C.dim})+label('1',ox+sx,oy+32,{size:22,color:C.dim,anchor:'middle'});
    [1,2].forEach(v=>{s+=line(ox-6,oy-v*sy,ox+6,oy-v*sy,{color:C.dim})+label(String(v),ox-12,oy-v*sy+8,{size:22,color:C.dim,anchor:'end'});});
    const pts=Array.from({length:61},(_,i)=>{const u=i/60;return [ox+sx*u,oy-sy*f(u)];});
    s+=poly([[ox,oy],...pts,[ox+sx,oy]],{fill:UC.W,fo:.22})+draw(pts,1,{color:UC.W,w:4})+label('2u²',ox+sx-10,oy-sy*2-14,{size:24,color:UC.W,anchor:'end'});
    s+=T('W=\\int_0^1 2u^2\\,du',PR.cx,120,46,{color:UC.W});
    s+=fade(seg(p,.3,.5),T("(u^3)'=3u^2",PR.cx,220,40));
    s+=fade(seg(p,.55,.75),T('\\int u^2\\,du=\\frac{u^3}{3}',PR.cx,320,44,{color:C.hi}));
    s+=fade(seg(p,.55,.75),L('（u² の原始関数）',PR.cx,400,{size:22,color:C.dim}));
    return s;
   },
   [K+'result']:(p)=>{
    let s=TF('W=2\\times\\left(\\frac13-0\\right)=\\frac23\\ \\mathrm{J}',300,170,46,500,{color:UC.W});
    s+=fade(seg(p,.2,.4),T('\\approx 0.667\\ \\mathrm{J}',300,280,46,{color:C.hi}));
    s+=table(seg(p,.4,.55),3,seg(p,.6,.8));
    return s;
   },
  };
 })(),
 [K+'summary']:(p)=>{
  const items=[[`${bR}(u)`,'道に目盛り'],[`${dR}=${rp}(u)\\,du`,'一歩を u で'],[`\\int_0^1(\\cdots)\\,du`,'普通の積分']];
  let s='';
  items.forEach(([t,l],i)=>{const x=60+i*380,g=seg(p,.05+i*.2,.25+i*.2);s+=card(x,150,330,200,T(t,x+165,235,38)+L(l,x+165,310,{size:26,color:C.dim}),g,i===2?C.hi:C.faint);
   if(i<2)s+=fade(seg(p,.2+i*.2,.3+i*.2),arrow(x+340,250,x+372,250,{color:C.dim,w:3,head:12}));});
  return s;
 },
 [K+'next']:(p)=>{
  let s=P0.svg+fieldArrows(P0,{op:.3})+pathLine(P0,para)+ends(P0);
  s+=fade(seg(p,.5,.7),pathLine(P0,straight,{dash:'10 8',w:4,color:C.ink}));
  s+=card(PR.x,110,PR.w,280,L('電子の仕事は いくら？',PR.cx,180,{size:32,color:C.hi,weight:700})+fade(seg(p,.5,.7),L('別の道でも 同じ値？',PR.cx,260,{size:32,color:C.hi,weight:700}))
   +fade(seg(p,.5,.7),L('（点線：まっすぐな道）',PR.cx,330,{size:24,color:C.dim})),seg(p,.05,.2),C.hi);
  return s;
 },
};

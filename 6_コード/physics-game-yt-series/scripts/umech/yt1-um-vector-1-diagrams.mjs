// YouTube シリーズ ベクトル・上級 1/1（ステージ um-vector 本9・本10：位置ベクトルの微分）— 図。Stage 1200×515.
// 色：位置 𝐫・x 水色、速度 𝐯 紫、加速度 𝐚 赤、時間 t 金、y 緑、z 橙、強調 黄。
// 放物運動と円は縦横同じ縮尺（向き・直角が正しく見えるように）。3D は斜投影（y 軸を右上 35°、半分の長さ）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,poly} from './anim.mjs';

const K='um-vector-1:';
const CX=C.x,CV=C.v,CA=C.a,CT=C.t,CY=C.F,CZ=C.E,CH=C.hi;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:C.F,weight:700}));
const L=(s,x,y,o={})=>label(s,x,y,{anchor:'middle',size:28,color:C.ink,...o});
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const cc=(c,s)=>`{\\color{${c}}${s}}`;
const bR=cc(CX,'\\mathbf{r}'),bV=cc(CV,'\\mathbf{v}'),bA=cc(CA,'\\mathbf{a}'),tt=cc(CT,'t'),dT=`\\Delta ${tt}`;
const bDR=cc(CX,'\\Delta\\mathbf{r}');

// ---------- 3D oblique projection ----------
const O3={x:150,y:430,s:105};
const P3=(x,y,z,o=O3)=>[o.x+o.s*(x+0.41*y),o.y-o.s*(z+0.29*y)];
function axes3({g=1,o=O3,len=[3.6,3.2,3.2],lab=1}={}){
 const [X,Y,Z]=len,O=P3(0,0,0,o),Ax=P3(X,0,0,o),Ay=P3(0,Y,0,o),Az=P3(0,0,Z,o);
 let s=arrow(O[0],O[1],Ax[0],Ax[1],{color:C.dim,w:2.5,head:13})+arrow(O[0],O[1],Ay[0],Ay[1],{color:C.dim,w:2.5,head:13})+arrow(O[0],O[1],Az[0],Az[1],{color:C.dim,w:2.5,head:13});
 if(lab)s+=label('x',Ax[0]+10,Ax[1]+8,{size:26,color:CX})+label('y',Ay[0]+8,Ay[1]-4,{size:26,color:CY})+label('z',Az[0]-8,Az[1]-10,{size:26,color:CZ,anchor:'end'});
 return fade(g,s);
}
// a 3D curve used in S1–S2
const cur=u=>[2.8-1.6*u,0.3+1.8*u,0.5+2.4*u-0.6*u*u];
const curvePts=(a=0,b=1.25,o=O3)=>Array.from({length:61},(_,i)=>{const q=cur(mix(a,b,i/60));return P3(q[0],q[1],q[2],o);});
const posArrow=(u,color=CX,g=1,o=O3,w=4)=>{const q=cur(u),O=P3(0,0,0,o),Q=P3(...q,o);return fade(g,arrow(O[0],O[1],Q[0],Q[1],{color,w,head:15}));};
// legs Δx, Δy, Δz from point u1 to u2
function legs(u1,u2,g=[1,1,1],o=O3){
 const a=cur(u1),b=cur(u2),p0=P3(...a,o),p1=P3(b[0],a[1],a[2],o),p2=P3(b[0],b[1],a[2],o),p3=P3(...b,o);
 return fade(g[0],line(p0[0],p0[1],p1[0],p1[1],{color:CX,w:4})+label('Δx',(p0[0]+p1[0])/2,p0[1]-12,{size:24,color:CX,anchor:'middle',weight:700}))
  +fade(g[1],line(p1[0],p1[1],p2[0],p2[1],{color:CY,w:4})+label('Δy',(p1[0]+p2[0])/2-30,(p1[1]+p2[1])/2-8,{size:24,color:CY,weight:700}))
  +fade(g[2],line(p2[0],p2[1],p3[0],p3[1],{color:CZ,w:4})+label('Δz',p3[0]-12,(p2[1]+p3[1])/2+8,{size:24,color:CZ,weight:700}));
}
function base3({g=1,path=1,r1=1,r2=0,dr=0,u1=0.1,u2=1.0,labels=1}={}){
 let s=axes3({g})+fade(g*path,draw(curvePts(),1,{color:C.dim,w:3,dash:'8 6'}));
 const A=P3(...cur(u1)),B=P3(...cur(u2));
 s+=posArrow(u1,CX,r1)+fade(r1*labels,label('𝐫(t)',(O3.x+A[0])/2+20,(O3.y+A[1])/2+36,{size:26,color:CX,weight:700}));
 s+=posArrow(u2,'#9fe9ff',r2)+fade(r2*labels,label('𝐫(t＋Δt)',(O3.x+B[0])/2-14,(O3.y+B[1])/2-10,{size:26,color:'#9fe9ff',weight:700,anchor:'end'}));
 s+=fade(dr,arrow(A[0],A[1],B[0],B[1],{color:CH,w:5,head:16})+label('Δ𝐫',(A[0]+B[0])/2+18,(A[1]+B[1])/2-4,{size:28,color:CH,weight:700}));
 return s;
}

// ---------- projectile (equal scale) ----------
const PJ={x0:90,y0:440,s:130};
const PX=u=>PJ.x0+PJ.s*u,PY=v=>PJ.y0-PJ.s*v;
const pr=t=>[4*t,5*t-5*t*t],pv=t=>[4,5-10*t];
function projBase({g=1,path=1,pts=[],ticks=1}={}){
 let s=fade(g,arrow(PJ.x0-10,PJ.y0,PX(4.3),PJ.y0,{color:C.dim,w:2.5,head:13})+arrow(PJ.x0,PJ.y0+10,PJ.x0,PY(1.65),{color:C.dim,w:2.5,head:13})
  +label('x（m）',PX(4.3)-4,PJ.y0+62,{size:24,color:CX,anchor:'end'})+label('y（m）',PJ.x0+12,PY(1.65)+6,{size:24,color:CY}));
 s+=fade(g*ticks,[1,2,3,4].map(u=>line(PX(u),PJ.y0-6,PX(u),PJ.y0+6,{color:C.dim})+label(String(u),PX(u),PJ.y0+32,{size:22,color:C.dim,anchor:'middle'})).join('')
  +[0.5,1].map(v=>line(PJ.x0-6,PY(v),PJ.x0+6,PY(v),{color:C.dim})+label(String(v),PJ.x0-12,PY(v)+8,{size:22,color:C.dim,anchor:'end'})).join(''));
 s+=fade(g,draw(Array.from({length:81},(_,i)=>{const q=pr(i/80);return [PX(q[0]),PY(q[1])];}),path,{color:CX,w:3.5}));
 pts.forEach(t=>{const q=pr(t);s+=fade(g,dot(PX(q[0]),PY(q[1]),7,CT));});
 return s;
}
const VS=20; // px per m/s
const velAt=(t,g=1,col=CV)=>{const q=pr(t),v=pv(t);return fade(g,arrow(PX(q[0]),PY(q[1]),PX(q[0])+VS*v[0],PY(q[1])-VS*v[1],{color:col,w:4,head:14}));};

// ---------- circle (equal scale), R = 2 m ----------
const CI={cx:290,cy:262,s:95};
const th0=0.5; // drawn angle 3t
const CPx=(x)=>CI.cx+CI.s*x,CPy=(y)=>CI.cy-CI.s*y;
function circBase({g=1,th=th0,r=1,v=0,a=0,axesOn=1,pt=1,vs=18,as=6.5,rlab=1,vlab=1,alab=1}={}){
 let s=fade(g*axesOn,arrow(CI.cx-230,CI.cy,CI.cx+240,CI.cy,{color:C.dim,w:2,head:12})+arrow(CI.cx,CI.cy+225,CI.cx,CI.cy-235,{color:C.dim,w:2,head:12})
  +label('x',CI.cx+244,CI.cy+8,{size:24,color:CX})+label('y',CI.cx+12,CI.cy-222,{size:24,color:CY}));
 s+=fade(g,ring(CI.cx,CI.cy,2*CI.s,{color:C.faint,w:3}));
 const P=[CPx(2*Math.cos(th)),CPy(2*Math.sin(th))];
 s+=fade(g*r,arrow(CI.cx,CI.cy,P[0],P[1],{color:CX,w:4,head:15})+fade(rlab,label('𝐫',(CI.cx+P[0])/2-8,(CI.cy+P[1])/2-12,{size:28,color:CX,weight:700,anchor:'end'})));
 const tv=[-Math.sin(th),Math.cos(th)];
 s+=fade(g*v,arrow(P[0],P[1],P[0]+vs*6*tv[0],P[1]-vs*6*tv[1],{color:CV,w:5,head:16})+fade(vlab,label('𝐯',P[0]+vs*6*tv[0]-12,P[1]-vs*6*tv[1]-10,{size:28,color:CV,weight:700,anchor:'end'})));
 s+=fade(g*a,arrow(P[0],P[1],P[0]-as*18*Math.cos(th),P[1]+as*18*Math.sin(th),{color:CA,w:5,head:16})+fade(alab,label('𝐚',P[0]-as*18*Math.cos(th)+4,P[1]+as*18*Math.sin(th)+30,{size:28,color:CA,weight:700})));
 s+=fade(g*pt,dot(P[0],P[1],9,CH));
 return s;
}
function rightMark(P,u,w,k=18,g=1){
 const q1=[P[0]+u[0]*k,P[1]+u[1]*k],q2=[q1[0]+w[0]*k,q1[1]+w[1]*k],q3=[P[0]+w[0]*k,P[1]+w[1]*k];
 return fade(g,draw([q1,q2,q3],1,{color:C.ink,w:2.5}));
}

// ---------- helix (z drawn at 1/4) ----------
const OH={x:330,y:440,s:68},CA30=Math.cos(0.5),SA30=Math.sin(0.5);
const ZK=0.125,hx=t=>[2*Math.cos(3*t),2*Math.sin(3*t),8*t*ZK];
const HP=(x,y,z)=>[OH.x+OH.s*(x*CA30-y*SA30)*1.0,OH.y-OH.s*(z+0.35*(x*SA30+y*CA30))];
function helixAxes(g=1){
 const O=HP(0,0,0),Ax=HP(3.2,0,0),Ay=HP(0,3.2,0),Az=HP(0,0,5.6);
 return fade(g,arrow(O[0],O[1],Ax[0],Ax[1],{color:C.dim,w:2.5,head:13})+arrow(O[0],O[1],Ay[0],Ay[1],{color:C.dim,w:2.5,head:13})+arrow(O[0],O[1],Az[0],Az[1],{color:C.dim,w:2.5,head:13})
  +label('x',Ax[0]+10,Ax[1]+12,{size:26,color:CX})+label('y',Ay[0]-12,Ay[1]-2,{size:26,color:CY,anchor:'end'})+label('z',Az[0]-10,Az[1]+4,{size:26,color:CZ,anchor:'end'}));
}
function helixBase({g=1,t0=3.76,v=0,a=0,pt=1,path=1}={}){
 let s=helixAxes(g);
 s+=fade(g*.6,draw(Array.from({length:61},(_,i)=>{const t=i/60*2*Math.PI;return HP(2*Math.cos(t),2*Math.sin(t),0);}),1,{color:C.faint,w:2,dash:'5 6'}));
 s+=fade(g,draw(Array.from({length:241},(_,i)=>HP(...hx(i/240*4.4))),path,{color:CX,w:3.5}));
 const q=hx(t0),P=HP(...q);
 if(v){const vv=[-6*Math.sin(3*t0),6*Math.cos(3*t0),8*ZK],k=0.2,Q=HP(q[0]+k*vv[0],q[1]+k*vv[1],q[2]+k*vv[2]);s+=fade(v,arrow(P[0],P[1],Q[0],Q[1],{color:CV,w:5,head:16})+label('𝐯',Q[0]+10,Q[1]-6,{size:28,color:CV,weight:700}));}
 if(a){const aa=[-18*Math.cos(3*t0),-18*Math.sin(3*t0),0],k=0.06,Q=HP(q[0]+k*aa[0],q[1]+k*aa[1],q[2]);s+=fade(a,arrow(P[0],P[1],Q[0],Q[1],{color:CA,w:5,head:16})+label('𝐚',Q[0]-6,Q[1]+30,{size:28,color:CA,weight:700,anchor:'end'}));
  const ax0=HP(0,0,0),ax1=HP(0,0,5.2);s+=fade(a,line(ax0[0],ax0[1],ax1[0],ax1[1],{color:CZ,w:2.5,dash:'8 6'})+label('軸',ax1[0]+10,ax1[1]+30,{size:24,color:CZ}));}
 s+=fade(g*pt,dot(P[0],P[1],8,CH));
 s+=fade(g,label('（高さは 1/8 に縮めて描いた）',OH.x,505,{size:22,color:C.dim,anchor:'middle'}));
 return s;
}

export const ytUmVector1Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  let s=base3({g:seg(p,.02,.2),r1:seg(p,.15,.35),labels:1});
  const A=P3(...cur(0.1));
  s+=fade(seg(p,.35,.5),label('？',A[0]+20,A[1]-30,{size:44,color:CV,weight:700}));
  s+=card(660,100,480,280,L('前回の最後の問い',900,150,{size:24,color:C.dim})
   +L('3 次元の 位置の矢印を',900,215,{size:30,color:CX,weight:700})+L('時間で微分すると',900,265,{size:30,color:CX,weight:700})
   +L('速度・加速度は どんな矢印？',900,330,{size:30,color:CH,weight:700}),seg(p,.1,.25),CH);
  return s;
 },
 [K+'recap']:(p)=>{
  const q=[1.6,1.5,1.9],O=P3(0,0,0),Q=P3(...q),a1=P3(q[0],0,0),a2=P3(q[0],q[1],0);
  let s=axes3({});
  s+=fade(seg(p,.3,.5),line(O[0],O[1],a1[0],a1[1],{color:CX,w:3,dash:'6 5'})+line(a1[0],a1[1],a2[0],a2[1],{color:CY,w:3,dash:'6 5'})+line(a2[0],a2[1],Q[0],Q[1],{color:CZ,w:3,dash:'6 5'})
   +label('x',(O[0]+a1[0])/2,O[1]+30,{size:24,color:CX,anchor:'middle'})+label('y',(a1[0]+a2[0])/2+12,(a1[1]+a2[1])/2+22,{size:24,color:CY})+label('z',Q[0]+12,(a2[1]+Q[1])/2+8,{size:24,color:CZ}));
  s+=fade(seg(p,.05,.25),arrow(O[0],O[1],Q[0],Q[1],{color:CX,w:5,head:16})+dot(Q[0],Q[1],8,CH)+label('物体',Q[0]+14,Q[1]-10,{size:24,color:CH}));
  s+=L('位置ベクトル',900,120,{size:28,color:CX,weight:700});
  s+=fade(seg(p,.05,.25),L('原点 → 物体 の矢印',900,180,{size:26}));
  s+=fade(seg(p,.4,.6),T(`${bR}=(${cc(CX,'x')},\\,${cc(CY,'y')},\\,${cc(CZ,'z')})`,900,280,52));
  s+=fade(seg(p,.7,.85),L('（ベクトル・中級）',900,380,{size:24,color:C.dim}));
  return s;
 },
 [K+'move']:(p)=>{
  let s=base3({r1:1,r2:seg(p,.1,.3),dr:seg(p,.45,.65)});
  s+=card(660,110,480,260,L('移動',900,160,{size:28,color:CH,weight:700})
   +T(`${bDR}=${cc('#9fe9ff','\\mathbf{r}(t+\\Delta t)')}-${cc(CX,'\\mathbf{r}(t)')}`,900,240,36)
   +L('あとの位置 − 前の位置',900,320,{size:26,color:C.dim}),seg(p,.45,.6),CH);
  return s;
 },
 [K+'oned']:(p)=>{
  const X=v=>120+v*90;
  let s=arrow(90,250,600,250,{color:C.dim,w:2.5,head:13})+label('x',606,258,{size:26,color:CX});
  [0,1,2,3,4,5].forEach(v=>{s+=line(X(v),242,X(v),258,{color:C.dim})+label(String(v),X(v),286,{size:22,color:C.dim,anchor:'middle'});});
  s+=dot(X(1.5),250,10,CX)+label('x(t)',X(1.5),218,{size:24,color:CX,anchor:'middle'});
  s+=fade(seg(p,.1,.3),dot(X(3.7),250,10,'#9fe9ff')+label('x(t＋Δt)',X(3.7),218,{size:24,color:'#9fe9ff',anchor:'middle'}));
  s+=fade(seg(p,.2,.4),arrow(X(1.5),330,X(3.7),330,{color:CH,w:5,head:15})+label('Δx',X(2.6),370,{size:26,color:CH,anchor:'middle',weight:700}));
  s+=L('1 本の数直線（中級）',900,110,{size:26,color:C.dim});
  s+=fade(seg(p,.3,.5),T(`\\dfrac{\\Delta ${cc(CX,'x')}}{${dT}}`,900,220,52));
  s+=fade(seg(p,.6,.8),T(`\\xrightarrow{\\;${dT}\\to0\\;}\\ \\dfrac{d${cc(CX,'x')}}{d${tt}}`,900,340,52));
  s+=fade(seg(p,.75,.9),L('＝ 速度',900,440,{size:28,color:CV,weight:700}));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=L('矢印の微分は？',600,70,{size:34,color:CH,weight:700});
  s+=card(90,120,480,280,L('①',330,170,{size:30,color:CH,weight:700})+L('成分を 1 つずつ微分',330,230,{size:28})
   +T(`\\left(\\tfrac{d${cc(CX,'x')}}{d${tt}},\\tfrac{d${cc(CY,'y')}}{d${tt}},\\tfrac{d${cc(CZ,'z')}}{d${tt}}\\right)`,330,330,40),seg(p,.1,.3));
  s+=card(630,120,480,280,L('②',870,170,{size:30,color:CH,weight:700})+L('矢印の 長さを微分',870,230,{size:28})
   +T(`\\dfrac{d\\,|${bR}|}{d${tt}}`,870,330,46),seg(p,.4,.6));
  s+=fade(seg(p,.7,.85),L('予想してみよう',600,460,{size:26,color:CH}));
  return s;
 },

 // ===== S2 差も割り算も成分ごと =====
 [K+'pair']:(p)=>{
  let s=base3({r1:seg(p,.05,.2),r2:seg(p,.3,.5),dr:seg(p,.65,.8)});
  s+=card(660,120,480,240,L('短い時間 Δt の間の',900,175,{size:26,color:C.dim})
   +L('位置の変化',900,230,{size:30,color:CH,weight:700})+fade(seg(p,.65,.8),T(`${bDR}`,900,305,48)),seg(p,.1,.25));
  return s;
 },
 [K+'comp']:(p)=>{
  let s=base3({r1:1,r2:1,dr:1})+legs(0.1,1.0,[seg(p,.3,.42),seg(p,.4,.52),seg(p,.5,.62)]);
  s+=T(`${bDR}=(\\Delta ${cc(CX,'x')},\\ \\Delta ${cc(CY,'y')},\\ \\Delta ${cc(CZ,'z')})`,900,180,40);
  s+=fade(seg(p,.6,.8),L('差は 成分ごと',900,280,{size:30,color:CH,weight:700}));
  s+=fade(seg(p,.6,.8),L('x・y・z の変化が 並ぶ',900,340,{size:26,color:C.dim}));
  return s;
 },
 [K+'div']:(p)=>{
  let s=T(`${bDR}=(\\Delta ${cc(CX,'x')},\\ \\Delta ${cc(CY,'y')},\\ \\Delta ${cc(CZ,'z')})`,600,80,44);
  s+=fade(seg(p,.05,.25),L('Δt で割る ＝ 1/Δt 倍する',600,170,{size:30,color:CT,weight:700}));
  const xs=[410,600,790];
  ['x','y','z'].forEach((c,i)=>{const col=[CX,CY,CZ][i],g=seg(p,.45+i*.1,.6+i*.1);
   s+=fade(g,arrow(xs[i],215,xs[i],270,{color:CT,w:3,head:12})+T(`\\tfrac{1}{${dT}}\\times\\Delta ${cc(col,c)}`,xs[i],320,40));});
  s+=fade(seg(p,.8,.95),L('数倍は どの成分にも 同じように掛かる',600,430,{size:26,color:C.dim}));
  return s;
 },
 [K+'divres']:(p)=>{
  const src=`\\dfrac{${bDR}}{${dT}}=\\left(\\dfrac{\\Delta ${cc(CX,'x')}}{${dT}},\\ \\dfrac{\\Delta ${cc(CY,'y')}}{${dT}},\\ \\dfrac{\\Delta ${cc(CZ,'z')}}{${dT}}\\right)`;
  let s=T(src,600,200,54);
  s+=fade(seg(p,.55,.75),L('差も 割り算も 成分ごと',600,370,{size:32,color:CH,weight:700}));
  return s;
 },
 [K+'lim']:(p)=>{
  let s=L('Δt → 0',600,45,{size:28,color:CT,weight:700});
  const src=`${bV}=\\dfrac{d${bR}}{d${tt}}=\\left(\\dfrac{d${cc(CX,'x')}}{d${tt}},\\ \\dfrac{d${cc(CY,'y')}}{d${tt}},\\ \\dfrac{d${cc(CZ,'z')}}{d${tt}}\\right)`;
  const W=texWidth(src,58,false);
  s+=fade(seg(p,.1,.35),T(`\\dfrac{${bDR}}{${dT}}\\ \\longrightarrow`,600,115,36,{color:C.dim}));
  s+=fade(seg(p,.4,.6),T(src,600,290,58));
  s+=highlight(600-W/2-24,195,W+48,190,seg(p,.75,.9));
  s+=fade(seg(p,.8,.95),L('矢印の微分 ＝ 成分ごとの微分',600,450,{size:28,color:CH,weight:700}));
  return s;
 },
 [K+'note']:(p)=>{
  let s=card(90,90,480,300,L('使ったもの',330,140,{size:28,color:CH,weight:700})
   +L('① 微分の定義',330,210,{size:28})+L('（差 ÷ 時間 の行き先）',330,255,{size:24,color:C.dim})
   +L('② 成分の表し方',330,320,{size:28}),seg(p,.02,.2));
  s+=card(630,90,480,300,L('導いた結果',870,140,{size:28,color:C.F,weight:700})
   +T(`\\dfrac{d${bR}}{d${tt}}=\\left(\\tfrac{d${cc(CX,'x')}}{d${tt}},\\tfrac{d${cc(CY,'y')}}{d${tt}},\\tfrac{d${cc(CZ,'z')}}{d${tt}}\\right)`,870,260,38),seg(p,.25,.45),C.F);
  s+=card(250,415,700,80,L('条件：x・y・z の軸は 時間がたっても動かさない',600,466,{size:26,color:CZ,weight:700}),seg(p,.6,.75),CZ);
  return s;
 },
 [K+'tangent']:(p)=>{
  const X=u=>110+u*120,Y=v=>460-v*120;
  const f=u=>0.3+1.9*u-0.45*u*u,df=u=>1.9-0.9*u;
  const u0=1.1,dt=mix(1.9,0.08,seg(p,.1,.7));
  let s=draw(Array.from({length:81},(_,i)=>{const u=0.05+i/80*3.6;return [X(u),Y(f(u))];}),1,{color:C.dim,w:3,dash:'8 6'});
  const A=[X(u0),Y(f(u0))],B=[X(u0+dt),Y(f(u0+dt))];
  s+=line(A[0],A[1],A[0]+(B[0]-A[0])*1.6,A[1]+(B[1]-A[1])*1.6,{color:CH,w:1.5,opacity:.4});
  s+=arrow(A[0],A[1],B[0],B[1],{color:CH,w:5,head:14})+dot(B[0],B[1],7,'#9fe9ff');
  s+=label('Δ𝐫',(A[0]+B[0])/2-6,(A[1]+B[1])/2-18,{size:26,color:CH,weight:700,anchor:'end'});
  s+=fade(seg(p,.55,.75),line(X(u0-1),Y(f(u0)-df(u0)),X(u0+1.6),Y(f(u0)+1.6*df(u0)),{color:C.ink,w:2,dash:'4 6'})+label('接線',X(u0+1.65),Y(f(u0)+1.6*df(u0))+10,{size:24,color:C.ink}));
  const n=Math.hypot(1,df(u0));
  s+=fade(seg(p,.75,.9),arrow(A[0],A[1],A[0]+150/n,A[1]-150*df(u0)/n,{color:CV,w:6,head:18})+label('𝐯',A[0]+150/n+10,A[1]-150*df(u0)/n+30,{size:30,color:CV,weight:700}));
  s+=dot(A[0],A[1],8,CX);
  s+=card(700,110,440,280,L('Δt を 縮める',920,165,{size:30,color:CT,weight:700})
   +T(`\\Delta ${tt}=${(dt).toFixed(2)}`,920,235,36)
   +fade(seg(p,.6,.8),L('Δ𝐫 の向き → 接線',920,300,{size:28,color:CH}))
   +fade(seg(p,.75,.9),L('速度は 道の接線の向き',920,355,{size:28,color:CV,weight:700})),seg(p,.02,.15));
  return s;
 },
 [K+'accel']:(p)=>{
  let s=T(`${bV}=\\left(\\dfrac{d${cc(CX,'x')}}{d${tt}},\\ \\dfrac{d${cc(CY,'y')}}{d${tt}},\\ \\dfrac{d${cc(CZ,'z')}}{d${tt}}\\right)`,600,110,44);
  s+=fade(seg(p,.1,.3),L('もう一度 成分ごとに微分',600,215,{size:26,color:C.dim}));
  s+=fade(seg(p,.3,.55),T(`${bA}=\\dfrac{d${bV}}{d${tt}}=\\left(\\dfrac{d^2${cc(CX,'x')}}{d${tt}^2},\\ \\dfrac{d^2${cc(CY,'y')}}{d${tt}^2},\\ \\dfrac{d^2${cc(CZ,'z')}}{d${tt}^2}\\right)`,600,330,52));
  return s;
 },

 // ===== S3 放物運動 =====
 [K+'proj']:(p)=>{
  let s=projBase({path:seg(p,.1,.6),pts:[]});
  s+=card(700,100,450,300,L('投げたボール',925,150,{size:28,color:CH,weight:700})
   +T(`${bR}=(4${tt},\\ 5${tt}-5${tt}^2)\\ \\mathrm{m}`,925,230,40)
   +L('x 横，y 上向き（z ＝ 0）',925,305,{size:24,color:C.dim})+L('t：秒',925,355,{size:24,color:CT}),seg(p,.05,.2));
  return s;
 },
 [K+'projv']:(p)=>{
  let s=projBase({pts:[0,.25,.5,.75]});
  [0,.25,.5,.75].forEach((t,i)=>{s+=velAt(t,seg(p,.55+i*.08,.65+i*.08));});
  s+=T(`${bR}=(4${tt},\\ 5${tt}-5${tt}^2)`,925,100,38);
  s+=fade(seg(p,.05,.25),T(`\\downarrow\\ \\tfrac{d}{d${tt}}\\qquad\\ \\downarrow\\ \\tfrac{d}{d${tt}}\\quad`,925,180,32));
  s+=fade(seg(p,.2,.45),T(`${bV}=(4,\\ 5-10${tt})\\ \\mathrm{m/s}`,925,270,40));
  return s;
 },
 [K+'projread']:(p)=>{
  let s=projBase({pts:[0,.25,.5,.75]});
  [0,.25,.5,.75].forEach(t=>{const q=pr(t),v=pv(t),X0=PX(q[0]),Y0=PY(q[1]);
   s+=fade(.35,arrow(X0,Y0,X0+VS*v[0],Y0-VS*v[1],{color:CV,w:3,head:10}));
   s+=fade(seg(p,.05,.25),arrow(X0,Y0,X0+VS*v[0],Y0,{color:CX,w:4,head:12}));
   if(Math.abs(v[1])>.1)s+=fade(seg(p,.45,.65),arrow(X0+VS*v[0],Y0,X0+VS*v[0],Y0-VS*v[1],{color:CY,w:4,head:12}));});
  const hx=[800,920,1060];
  s+=L('t（s）',hx[0],110,{size:24,color:CT})+L('横',hx[1],110,{size:24,color:CX})+L('縦',hx[2],110,{size:24,color:CY})+line(720,128,1120,128,{color:C.faint,w:2});
  [[0,4,5],[.25,4,2.5],[.5,4,0],[.75,4,-2.5]].forEach((r,i)=>{const y=175+i*55;
   s+=L(String(r[0]),hx[0],y,{size:26,color:CT})+fade(seg(p,.05,.25),L(String(r[1]),hx[1],y,{size:26}))+fade(seg(p,.45,.65),L(String(r[2]).replace('-','−'),hx[2],y,{size:26}));});
  s+=fade(seg(p,.2,.35),L('ずっと 4',hx[1],405,{size:24,color:CX,weight:700}));
  s+=fade(seg(p,.65,.8),L('0.25 s で 2.5 減る',1000,448,{size:24,color:CY,weight:700}));
  s+=fade(seg(p,.65,.8),L('（1 s で 10）',1000,486,{size:22,color:C.dim}));
  return s;
 },
 [K+'projq']:(p)=>{
  let s=projBase({pts:[]})+velAt(0,1);
  s+=fade(seg(p,.1,.3),label('？',PX(2)-10,PY(1.25)-20,{size:44,color:CH,weight:700}));
  s+=card(700,110,450,260,L('一番高い点は',925,165,{size:30,color:CH,weight:700})
   +L('何秒後？',925,225,{size:30,color:CT,weight:700})+L('速度の矢印の向きは？',925,285,{size:28,color:CV,weight:700})
   +fade(seg(p,.5,.7),L('予想してみよう',925,340,{size:24,color:CH})),seg(p,.05,.2),CH);
  return s;
 },
 [K+'projtop']:(p)=>{
  let s=projBase({pts:[.5]});
  s+=fade(seg(p,.55,.75),velAt(.5,1)+label('(4, 0)',PX(2)+VS*4+10,PY(1.25)+8,{size:24,color:CV,weight:700}));
  s+=fade(seg(p,.55,.75),label('(2, 1.25)',PX(2)-10,PY(1.25)+40,{size:22,color:CX,anchor:'middle'}));
  s+=T(`${bV}=(4,\\ 5-10${tt})`,925,90,38);
  s+=fade(seg(p,.1,.3),L('縦の成分 ＝ 0',925,170,{size:28,color:CY,weight:700}));
  s+=fade(seg(p,.3,.5),T(`5-10${tt}=0\\ \\Rightarrow\\ ${tt}=0.5\\ \\mathrm{s}`,925,250,38));
  s+=fade(seg(p,.55,.75),T(`${bV}=(4,\\ 0)`,925,340,42)+L('真横向き',925,410,{size:28,color:CV,weight:700}));
  return s;
 },
 [K+'proja']:(p)=>{
  // hodograph: velocity arrows with a common tail
  const T0=[230,265],S=20;
  let s=L('速度の矢印の 根元をそろえる',280,60,{size:24,color:C.dim});
  [0,.25,.5,.75,1].forEach((t,i)=>{const v=pv(t),g=seg(p,.02+i*.05,.12+i*.05);
   s+=fade(g,arrow(T0[0],T0[1],T0[0]+S*v[0],T0[1]-S*v[1],{color:CV,w:3.5,head:13})+label(`t＝${t}`,T0[0]+S*v[0]+12,T0[1]-S*v[1]+8,{size:22,color:CT}));});
  s+=fade(seg(p,.35,.5),line(T0[0]+80,T0[1]-100,T0[0]+80,T0[1]+100,{color:CA,w:2,dash:'6 5'}));
  s+=fade(seg(p,.35,.5),arrow(T0[0]+230,T0[1]-100,T0[0]+230,T0[1]+100,{color:CA,w:4,head:14})+label('先は 真下へ動く',T0[0]+80,T0[1]+150,{size:24,color:CA}));
  s+=T(`${bV}=(4,\\ 5-10${tt})`,880,120,40);
  s+=fade(seg(p,.1,.35),L('もう一度 微分',880,200,{size:26,color:C.dim}));
  s+=fade(seg(p,.3,.55),T(`${bA}=(0,\\ -10)\\ \\mathrm{m/s^2}`,880,290,46));
  s+=fade(seg(p,.6,.8),L('横 0，縦 下向きに 10',880,380,{size:28,color:CA,weight:700}));
  return s;
 },
 [K+'projg']:(p)=>{
  const cx=[230,500,760,1010];
  let s=L('位置',cx[1],90,{size:26,color:CX,weight:700})+L('速度',cx[2],90,{size:26,color:CV,weight:700})+L('加速度',cx[3],90,{size:26,color:CA,weight:700})+line(90,112,1130,112,{color:C.faint,w:2});
  s+=L('横（水平）',cx[0],180,{size:28,color:CX,weight:700})+T(`4${tt}`,cx[1],180,38)+T('4',cx[2],180,38)+T('0',cx[3],180,38);
  s+=L('縦（鉛直）',cx[0],270,{size:28,color:CY,weight:700})+T(`5${tt}-5${tt}^2`,cx[1],270,38)+T(`5-10${tt}`,cx[2],270,38)+T('-10',cx[3],270,38);
  s+=fade(seg(p,.1,.3),highlight(cx[3]-70,215,140,90,1,CA)+L('重力は 縦だけ',cx[3],345,{size:24,color:CA}));
  s+=card(170,380,860,100,L('高校：水平は 等速，鉛直は 等加速度',600,420,{size:28,color:CH,weight:700})
   +L('＝ 成分ごとの微分そのもの',600,462,{size:26}),seg(p,.5,.7),CH);
  return s;
 },
 [K+'speed']:(p)=>{
  let s=projBase({pts:[0,.5]})+velAt(0,1)+velAt(.5,1);
  s+=fade(seg(p,.1,.3),label('|𝐯| ≈ 6.4 m/s',PX(0.5),PY(0.18),{size:24,color:CV,weight:700}));
  s+=fade(seg(p,.55,.75),label('4 m/s',PX(2)+VS*4+14,PY(1.25)+8,{size:24,color:CV,weight:700}));
  s+=L('速さ ＝ 矢印の長さ',925,110,{size:28,color:CV,weight:700});
  s+=fade(seg(p,.1,.35),T(`t=0:\\ \\sqrt{4^2+5^2}=\\sqrt{16+25}=\\sqrt{41}`,925,200,32));
  s+=fade(seg(p,.25,.45),L('≈ 6.4 m/s',925,270,{size:30}));
  s+=fade(seg(p,.55,.75),L('一番高い点：4 m/s',925,350,{size:30}));
  return s;
 },

 // ===== S4 等速円運動 =====
 [K+'circ']:(p)=>{
  let s=circBase({g:seg(p,.02,.2),r:seg(p,.2,.4)});
  s+=fade(seg(p,.02,.2),label('R ＝ 2 m',CI.cx+100,CI.cy+40,{size:24,color:C.dim})+label('真上から見た図（z ＝ 0）',CI.cx,505,{size:22,color:C.dim,anchor:'middle'}));
  s+=card(620,90,540,300,L('等速円運動',890,140,{size:28,color:CH,weight:700})
   +L('半径 2 m，ω ＝ 3 rad/s',890,200,{size:28})
   +fade(seg(p,.45,.65),T(`${bR}=(2\\cos 3${tt},\\ 2\\sin 3${tt},\\ 0)\\ \\mathrm{m}`,890,290,38)),seg(p,.05,.2),CH);
  return s;
 },
 [K+'circvx']:(p)=>{
  let s=L('x 成分',600,60,{size:28,color:CX,weight:700});
  s+=T(`\\dfrac{d}{d${tt}}\\bigl(2\\cos 3${tt}\\bigr)`,600,150,50);
  s+=fade(seg(p,.2,.45),T(`=2\\times(-\\sin 3${tt})\\times ${cc(CH,'3')}`,600,270,50));
  s+=fade(seg(p,.2,.45),L('cos の微分 → −sin',470,350,{size:24,color:C.dim}));
  s+=fade(seg(p,.4,.6),L('中身の倍率 3',800,350,{size:24,color:CH}));
  s+=fade(seg(p,.7,.85),T(`=-6\\sin 3${tt}`,600,440,54));
  return s;
 },
 [K+'circvy']:(p)=>{
  let s=T(`\\tfrac{d}{d${tt}}\\bigl(2\\cos 3${tt}\\bigr)=-6\\sin 3${tt}`,600,70,34,{color:C.dim});
  s+=L('y 成分',600,150,{size:28,color:CY,weight:700});
  s+=fade(seg(p,.05,.3),T(`\\dfrac{d}{d${tt}}\\bigl(2\\sin 3${tt}\\bigr)=2\\times\\cos 3${tt}\\times ${cc(CH,'3')}=6\\cos 3${tt}`,600,250,46));
  s+=fade(seg(p,.7,.85),L('z 成分：0 → 0 のまま',600,390,{size:28,color:CZ,weight:700}));
  return s;
 },
 [K+'circv']:(p)=>{
  let s=circBase({v:seg(p,.05,.25)});
  s+=T(`${bV}=(-6\\sin 3${tt},\\ 6\\cos 3${tt},\\ 0)`,890,110,36);
  s+=L('m/s',890,165,{size:24,color:C.dim});
  s+=fade(seg(p,.4,.6),L('長さの 2 乗',890,240,{size:26,color:C.dim}));
  s+=fade(seg(p,.45,.7),T(`36\\sin^2 3${tt}+36\\cos^2 3${tt}`,890,310,40));
  s+=fade(seg(p,.8,.92),T(`=36`,890,390,46));
  return s;
 },
 [K+'circspeed']:(p)=>{
  let s=circBase({v:0,r:.35,rlab:0,pt:0});
  [0.2,1.3,2.4,3.5,4.6,5.7].forEach((th,i)=>{s+=fade(seg(p,.35+i*.05,.45+i*.05),circBase({g:1,th,r:0,v:1,axesOn:0,vlab:0,pt:1}).replace(/<circle[^>]*r="190"[^>]*\/>/,''));});
  s+=T(`\\sin^2 3${tt}+\\cos^2 3${tt}=1`,890,120,40);
  s+=fade(seg(p,.1,.3),T(`|${bV}|^2=36\\ \\Rightarrow\\ |${bV}|=6\\ \\mathrm{m/s}`,890,230,40));
  s+=fade(seg(p,.5,.7),L('速さは いつも 6 m/s',890,330,{size:30,color:CV,weight:700}));
  return s;
 },
 [K+'circperp']:(p)=>{
  let s=circBase({v:1});
  s+=L('位置と速度の内積',890,70,{size:26,color:C.dim});
  s+=fade(seg(p,.1,.3),L('x どうし',700,150,{size:24,color:CX,weight:700})+T(`2\\cos 3${tt}\\times(-6\\sin 3${tt})`,960,150,32));
  s+=fade(seg(p,.2,.4),T(`=-12\\cos 3${tt}\\,\\sin 3${tt}`,960,215,32));
  s+=fade(seg(p,.5,.7),L('y どうし',700,300,{size:24,color:CY,weight:700})+T(`2\\sin 3${tt}\\times 6\\cos 3${tt}`,960,300,32));
  s+=fade(seg(p,.6,.8),T(`=+12\\sin 3${tt}\\,\\cos 3${tt}`,960,365,32));
  return s;
 },
 [K+'circperp2']:(p)=>{
  let s=circBase({v:1});
  const th=th0,P=[CPx(2*Math.cos(th)),CPy(2*Math.sin(th))];
  s+=rightMark(P,[-Math.cos(th),Math.sin(th)],[-Math.sin(th),-Math.cos(th)],20,seg(p,.3,.5));
  s+=T(`${bR}\\cdot${bV}=-12\\cos 3${tt}\\sin 3${tt}+12\\sin 3${tt}\\cos 3${tt}`,890,120,28);
  s+=fade(seg(p,.05,.25),T(`=0`,890,200,48));
  s+=fade(seg(p,.35,.55),L('𝐯 は 𝐫 と直角',890,300,{size:30,color:CV,weight:700})+L('＝ 円の接線の向き',890,355,{size:28}));
  return s;
 },
 [K+'circa']:(p)=>{
  let s=L('もう一度 微分',600,55,{size:26,color:C.dim});
  s+=T(`\\dfrac{d}{d${tt}}\\bigl(-6\\sin 3${tt}\\bigr)=-6\\times\\cos 3${tt}\\times ${cc(CH,'3')}=-18\\cos 3${tt}`,600,170,42);
  s+=fade(seg(p,.45,.7),T(`\\dfrac{d}{d${tt}}\\bigl(6\\cos 3${tt}\\bigr)=6\\times(-\\sin 3${tt})\\times ${cc(CH,'3')}=-18\\sin 3${tt}`,600,320,42));
  return s;
 },
 [K+'circa2']:(p)=>{
  let s=T(`${bA}=(-18\\cos 3${tt},\\ -18\\sin 3${tt},\\ 0)\\ \\mathrm{m/s^2}`,600,100,44);
  s+=fade(seg(p,.35,.55),T(`=-9\\times(2\\cos 3${tt},\\ 2\\sin 3${tt},\\ 0)`,600,230,44));
  s+=fade(seg(p,.55,.75),T(`=-9\\,${bR}`,600,350,56)+highlight(510,300,180,90,seg(p,.7,.85)));
  return s;
 },
 [K+'circa3']:(p)=>{
  let s=circBase({v:.4,vlab:0,a:seg(p,.05,.25)});
  s+=T(`${bA}=-9\\,${bR}`,890,110,48);
  s+=fade(seg(p,.05,.25),L('𝐫 と逆向き ＝ 中心向き',890,210,{size:28,color:CA,weight:700}));
  s+=fade(seg(p,.5,.7),T(`|${bA}|=9\\times2=18\\ \\mathrm{m/s^2}`,890,320,42));
  return s;
 },
 [K+'circgen']:(p)=>{
  let s=T(`${bA}=-9\\,${bR}`,600,80,44);
  s+=fade(seg(p,.05,.25),T(`9=\\omega^2=3^2`,600,170,44));
  s+=fade(seg(p,.4,.6),L('一般に 半径 R，角速度 ω',600,260,{size:28,color:C.dim}));
  const GS=`${bA}=-\\omega^2\\,${bR},\\qquad |${bA}|=R\\,\\omega^2`,GW=texWidth(GS,52,false);
  s+=fade(seg(p,.5,.7),T(GS,600,360,52));
  s+=highlight(600-GW/2-24,312,GW+48,90,seg(p,.8,.92));
  return s;
 },
 [K+'circcheck']:(p)=>{
  // middle 19-2 picture: v1, v2 from a common tail
  const T0=[290,350],Lv=220,d=0.6;
  let s=L('中級：速度の矢印が回る図',260,60,{size:24,color:C.dim});
  s+=arrow(T0[0],T0[1],T0[0],T0[1]-Lv,{color:CV,w:4,head:14})+label('𝐯₁',T0[0]+14,T0[1]-Lv/2,{size:26,color:CV});
  const B=[T0[0]-Lv*Math.sin(d),T0[1]-Lv*Math.cos(d)];
  s+=arrow(T0[0],T0[1],B[0],B[1],{color:'#d6c9ff',w:4,head:14})+label('𝐯₂',(T0[0]+B[0])/2-16,(T0[1]+B[1])/2+10,{size:26,color:'#d6c9ff',anchor:'end'});
  s+=arrow(T0[0],T0[1]-Lv,B[0]+4,B[1]+2,{color:CA,w:4,head:12})+label('Δ𝐯',(T0[0]+B[0])/2,T0[1]-Lv-22,{size:24,color:CA,anchor:'middle'});
  s+=T(`a=\\dfrac{v^2}{r}`,260,440,40);
  s+=fade(seg(p,.4,.6),T(`\\dfrac{6^2}{2}=\\dfrac{36}{2}=18\\ \\mathrm{m/s^2}`,850,170,46));
  s+=fade(seg(p,.6,.8),L('式の計算：Rω² ＝ 2 × 9 ＝ 18',850,300,{size:28,color:CA,weight:700}));
  s+=fade(seg(p,.75,.9),L('一致',850,380,{size:34,color:C.F,weight:700})+ok(920,384));
  return s;
 },
 [K+'circpred']:(p)=>{
  let s=circBase({v:1,a:1});
  s+=card(620,110,540,280,L('速さ：ずっと 6 m/s',890,170,{size:30,color:CV,weight:700})
   +L('加速度：18 m/s²（0 でない）',890,235,{size:30,color:CA,weight:700})
   +L('おかしくない？',890,305,{size:32,color:CH,weight:700})+fade(seg(p,.5,.7),L('予想してみよう',890,360,{size:24,color:CH})),seg(p,.05,.2),CH);
  return s;
 },
 [K+'circdiff']:(p)=>{
  const X=t=>120+t*170,Y=v=>420-v*40;
  let s=arrow(110,420,560,420,{color:C.dim,w:2.5,head:12})+arrow(120,430,120,120,{color:C.dim,w:2.5,head:12})+label('t',566,428,{size:24,color:CT})+label('|𝐯|（m/s）',130,110,{size:24,color:CV});
  s+=line(114,Y(6),126,Y(6),{color:C.dim})+label('6',104,Y(6)+8,{size:22,color:C.dim,anchor:'end'});
  s+=draw([[X(0),Y(6)],[X(2.4),Y(6)]],seg(p,.05,.4),{color:CV,w:5});
  s+=fade(seg(p,.4,.6),L('ずっと 6（平ら）',X(1.2),Y(6)-30,{size:24,color:CV}));
  s+=T(`\\dfrac{d\\,|${bV}|}{d${tt}}=0`,890,200,52);
  s+=fade(seg(p,.5,.7),L('速さ ＝ 矢印の長さ の変化',890,320,{size:28,color:CV,weight:700}));
  return s;
 },
 [K+'circdiff2']:(p)=>{
  const T0=[280,265],R=26*6;
  let s=ring(T0[0],T0[1],R,{color:C.faint,w:2,dash:'6 6'})+label('根元をそろえた 𝐯',T0[0],T0[1]+R+40,{size:24,color:C.dim,anchor:'middle'});
  const a1=0.75+Math.PI/2,a2=a1+mix(0.2,0.9,seg(p,.5,.8));
  const P1=[T0[0]+R*Math.cos(a1),T0[1]-R*Math.sin(a1)],P2=[T0[0]+R*Math.cos(a2),T0[1]-R*Math.sin(a2)];
  s+=arrow(T0[0],T0[1],P1[0],P1[1],{color:CV,w:4,head:14})+label('前',P1[0]+12,P1[1]-8,{size:24,color:CV});
  s+=fade(seg(p,.45,.6),arrow(T0[0],T0[1],P2[0],P2[1],{color:'#d6c9ff',w:4,head:14})+label('後',P2[0]-12,P2[1]-4,{size:24,color:'#d6c9ff',anchor:'end'}));
  s+=fade(seg(p,.55,.7),arrow(P1[0],P1[1],P2[0],P2[1],{color:CA,w:4,head:12})+label('Δ𝐯',(P1[0]+P2[0])/2-10,(P1[1]+P2[1])/2-14,{size:26,color:CA,anchor:'end',weight:700}));
  s+=T(`\\dfrac{d\\,|${bV}|}{d${tt}}=0`,890,110,42)+L('速さ（長さ）は ずっと 6',890,190,{size:26,color:CV});
  s+=fade(seg(p,.45,.6),T(`\\dfrac{d${bV}}{d${tt}}\\neq 0`,890,290,42));
  s+=fade(seg(p,.5,.65),L('矢印 全体の変化',890,370,{size:28,color:CA,weight:700}));
  s+=fade(seg(p,.7,.85),L('長さは同じ，向きが回る',890,430,{size:28}));
  return s;
 },
 [K+'circnum']:(p)=>{
  const hx=[330,620,900];
  let s=L('Δt（s）',hx[0],110,{size:26,color:CT,weight:700})+L('|Δ𝐯|（m/s）',hx[1],110,{size:26,color:CA,weight:700})+L('|Δ𝐯| ÷ Δt（m/s²）',hx[2],110,{size:26,color:CA,weight:700})+line(170,132,1070,132,{color:C.faint,w:2});
  const rows=[['0.1','約 1.793','約 17.93'],['0.01','約 0.179993','約 17.9993'],['→ 0','','→ 18']],gs=[seg(p,.05,.25),seg(p,.4,.6),seg(p,.7,.85)];
  rows.forEach((r,i)=>{const y=200+i*75;s+=fade(gs[i],L(r[0],hx[0],y,{size:30,color:CT})+L(r[1],hx[1],y,{size:30})+L(r[2],hx[2],y,{size:30,color:i===2?CA:C.ink,weight:i===2?700:400}));});
  s+=fade(seg(p,.8,.92),highlight(170,308,900,60,1));
  s+=fade(seg(p,.05,.25),L('|Δ𝐯| ＝ 2 × 6 × sin(3Δt/2)（二等辺三角形の底辺）',600,460,{size:24,color:C.dim}));
  return s;
 },

 // ===== S5 3次元で確かめる =====
 [K+'helix']:(p)=>{
  let s=helixBase({path:seg(p,.05,.5)});
  s+=card(660,90,490,310,L('らせん',905,140,{size:28,color:CH,weight:700})
   +T(`${bR}=(2\\cos 3${tt},\\ 2\\sin 3${tt},\\ 8${tt})\\ \\mathrm{m}`,905,215,32)
   +L('同じ円を回りながら 毎秒 8 m 上る',905,285,{size:24})
   +fade(seg(p,.55,.75),L('速度と速さは？',905,355,{size:30,color:CV,weight:700})),seg(p,.05,.2),CH);
  return s;
 },
 [K+'helixv']:(p)=>{
  let s=helixBase({v:seg(p,.1,.3)});
  s+=T(`${bV}=(-6\\sin 3${tt},\\ 6\\cos 3${tt},\\ 8)\\ \\mathrm{m/s}`,905,90,32);
  // right triangle: horizontal 6, vertical 8, slant 10
  const A=[760,420],S=18;
  s+=fade(seg(p,.4,.6),line(A[0],A[1],A[0]+S*6,A[1],{color:CV,w:4})+line(A[0]+S*6,A[1],A[0]+S*6,A[1]-S*8,{color:CZ,w:4})+line(A[0],A[1],A[0]+S*6,A[1]-S*8,{color:CH,w:4})
   +label('水平 6',A[0]+S*3,A[1]+32,{size:24,color:CV,anchor:'middle'})+label('上 8',A[0]+S*6+12,A[1]-S*4,{size:24,color:CZ})+label('10',A[0]+S*3-18,A[1]-S*4-6,{size:26,color:CH,anchor:'end',weight:700}));
  s+=fade(seg(p,.45,.7),T(`\\sqrt{36+64}=\\sqrt{100}=10\\ \\mathrm{m/s}`,960,190,36));
  return s;
 },
 [K+'helixa']:(p)=>{
  let s=helixBase({v:.35,a:seg(p,.05,.25)});
  s+=T(`${bA}=(-18\\cos 3${tt},\\ -18\\sin 3${tt},\\ 0)\\ \\mathrm{m/s^2}`,905,90,30);
  s+=fade(seg(p,.4,.6),L('上る速さ 8 は一定 → z 成分 0',905,200,{size:26,color:CZ,weight:700}));
  s+=fade(seg(p,.65,.85),L('加速度は 水平に 軸を向く',905,280,{size:28,color:CA,weight:700}));
  return s;
 },

 // ===== S6 まとめと次の問い =====
 [K+'sum']:(p)=>{
  let s=L('まとめ',600,60,{size:30,color:CH,weight:700});
  s+=fade(seg(p,.05,.25),T(`\\dfrac{${bDR}}{${dT}}=\\left(\\dfrac{\\Delta ${cc(CX,'x')}}{${dT}},\\dfrac{\\Delta ${cc(CY,'y')}}{${dT}},\\dfrac{\\Delta ${cc(CZ,'z')}}{${dT}}\\right)`,600,170,40));
  s+=fade(seg(p,.4,.6),T(`${bV}=\\dfrac{d${bR}}{d${tt}}=\\left(\\dfrac{d${cc(CX,'x')}}{d${tt}},\\dfrac{d${cc(CY,'y')}}{d${tt}},\\dfrac{d${cc(CZ,'z')}}{d${tt}}\\right)`,600,320,44));
  s+=fade(seg(p,.6,.8),L('矢印の微分 ＝ 成分ごとの微分',600,440,{size:28,color:CH,weight:700}));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=circBase({v:1,a:1,rlab:1});
  s+=card(620,90,540,330,L('速度：道の 接線の向き',890,150,{size:28,color:CV,weight:700})
   +fade(seg(p,.3,.5),L('加速度：速さの変化',890,225,{size:28,color:CA,weight:700})+L('＋ 向きの変化',890,275,{size:28,color:CA,weight:700}))
   +fade(seg(p,.6,.8),L('等速円運動：中心向き Rω²',890,360,{size:28,color:CA})),seg(p,.02,.15));
  return s;
 },
 [K+'next']:(p)=>{
  let s=circBase({v:1});
  s+=T(`${bR}\\cdot${bV}=-12\\cos 3${tt}\\sin 3${tt}+12\\sin 3${tt}\\cos 3${tt}`,890,110,28);
  s+=fade(seg(p,.1,.3),L('成分の積の和',890,180,{size:28,color:CH,weight:700}));
  s+=fade(seg(p,.5,.7),card(640,240,500,170,L('中級：この形は',890,290,{size:26,color:C.dim})+L('分配法則 から導いた',890,350,{size:30,color:CH,weight:700}),1,CH));
  return s;
 },
 [K+'next2']:(p)=>{
  let s=T(`\\mathbf{A}\\cdot(\\mathbf{B}+\\mathbf{C})=\\mathbf{A}\\cdot\\mathbf{B}+\\mathbf{A}\\cdot\\mathbf{C}`,600,120,52);
  s+=fade(seg(p,.05,.25),L('中級では 図で確かめただけ',600,230,{size:28,color:C.dim}));
  s+=card(310,290,580,150,L('内積の分配法則は',600,345,{size:30,color:CH,weight:700})+L('なぜ成り立つ？',600,405,{size:34,color:CH,weight:700}),seg(p,.4,.6),CH);
  return s;
 },
};

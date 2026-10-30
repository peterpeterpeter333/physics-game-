// 高校編「円運動と万有引力・深く学ぶ 1/3」(ys-hs-m-circular-1) — 図。Stage 1200×515.
// 真上から見た等速円運動：半径 2.0 m（170 px）、速さ 4.0 m/s（矢印 120 px）、反時計回り。
// 色：位置・弧 水色、速度 v 紫、速度の変化 Δ𝐯 黄、加速度 a 赤、力 F 緑、ω 桃、角度 θ 橙、時間 t・T 金。
// 2/3・3/3・要点でも使う部品は export する（diagrams.mjs は object だけを読み込む）。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,poly} from './anim.mjs';
import {card} from './yt1-hs-m1-velocity-1-diagrams.mjs';
import {ball} from './yt1-hs-m-freefall-1-diagrams.mjs';
import {table} from './yt1-hs-m-force-1-diagrams.mjs';
export {card,ball,table};

const K='hs-m-circular-1:';
export const V=`{\\color{${C.v}}v}`, BV=`{\\color{${C.v}}\\boldsymbol{v}}`, DV=`{\\color{${C.hi}}\\Delta\\boldsymbol{v}}`,
 ADV=`{\\color{${C.hi}}|\\Delta\\boldsymbol{v}|}`, TH=`{\\color{${C.E}}\\theta}`, DTH=`{\\color{${C.E}}\\Delta\\theta}`,
 DT=`{\\color{${C.t}}\\Delta t}`, TT=`{\\color{${C.t}}T}`, W=`{\\color{${C.p}}\\omega}`, A=`{\\color{${C.a}}a}`,
 VA=`{\\color{${C.v}}\\boldsymbol{v}_\\mathrm{A}}`, VB=`{\\color{${C.v}}\\boldsymbol{v}_\\mathrm{B}}`;
export const TF=(src,x,y,o={})=>tex(src,x,y,{size:44,auto:false,...o});
export const frac=(x,y,top,bot,color=C.ink,w=60)=>label(top,x,y-14,{size:28,color,anchor:'middle',weight:700})+line(x-w,y,x+w,y,{color:C.ink,w:2})+label(bot,x,y+34,{size:28,color:C.ink,anchor:'middle'});

// ---- top view of the circle -----------------------------------------------------------------------
export const O={x:290,y:262,R:170,LV:120};
export const P=(phi,o=O)=>[o.x+o.R*Math.cos(phi),o.y-o.R*Math.sin(phi)];
export const U=phi=>[-Math.sin(phi),-Math.cos(phi)];          // unit tangent, counter-clockwise
export const arcPts=(cx,cy,r,a1,a2,n=40)=>Array.from({length:n+1},(_,i)=>{const a=a1+(a2-a1)*i/n;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});
export function orbit({o=O,g=1,phi=null,vel=0,str=1,rlab=0,vlab=0,acc=0,ccw=0,plate=1,circle=1,ballR=16}={}){
 let s='';
 if(plate)s+=fade(g*.8,rect(o.x-o.R-50,o.y-o.R-40,2*o.R+100,2*o.R+80,{fill:'#1a2742',fo:.7,stroke:C.faint,rx:18}));
 if(circle)s+=fade(g,ring(o.x,o.y,o.R,{color:C.faint,w:2.5,dash:'8 8'}));
 s+=fade(g,dot(o.x,o.y,6,C.dim));
 if(ccw){const pts=arcPts(o.x,o.y,o.R+26,2.2,2.9,20);s+=fade(g*ccw,draw(pts,1,{color:C.dim,w:3}));const [x2,y2]=pts[20],[x1,y1]=pts[18];s+=arrow(x1,y1,x2+(x2-x1)*1.2,y2+(y2-y1)*1.2,{color:C.dim,w:3,head:14,g:g*ccw});}
 if(phi!==null){
  const [x,y]=P(phi,o),[ux,uy]=U(phi);
  if(str)s+=fade(g*str,line(o.x,o.y,x,y,{color:C.dim,w:2}));
  if(rlab)s+=fade(g*rlab,label('r ＝ 2.0 m',(o.x+x)/2+(Math.sin(phi)>0?14:14),(o.y+y)/2+(Math.sin(phi)>0?30:-14),{size:24,color:C.ink}));
  if(vel)s+=arrow(x,y,x+o.LV*ux,y+o.LV*uy,{color:C.v,w:5,head:16,g:g*vel});
  if(vlab)s+=fade(g*vlab*vel,label('4.0 m/s',x+o.LV*ux+(ux>0?10:-10),y+o.LV*uy-10,{size:24,color:C.v,anchor:ux>0?'start':'end',weight:700}));
  if(acc)s+=arrow(x,y,x+(o.x-x)*.55,y+(o.y-y)*.55,{color:C.a,w:5,head:16,g:g*acc});
  s+=fade(g,ball(x,y,{r:ballR}));
 }
 return s;
}
export function rightMark(x,y,u,w,{g=1,k=16,color=C.dim}={}){ // small square at (x,y) between directions u and w
 const a=[x+u[0]*k,y+u[1]*k],b=[x+(u[0]+w[0])*k,y+(u[1]+w[1])*k],c=[x+w[0]*k,y+w[1]*k];
 return fade(g,draw([a,b,c],1,{color,w:2}));
}
export function earth(x,y,r){return dot(x,y,r,'#2f6fd0')+`<ellipse cx="${x-r*.25}" cy="${y-r*.15}" rx="${r*.35}" ry="${r*.22}" fill="#3fae6a" opacity=".85"/>`+`<ellipse cx="${x+r*.35}" cy="${y+r*.3}" rx="${r*.25}" ry="${r*.15}" fill="#3fae6a" opacity=".8"/>`+ring(x,y,r,{color:'#9cc8ff',w:2});}
export function moon(x,y,r){return dot(x,y,r,'#b9bfca')+dot(x-r*.3,y-r*.2,r*.22,'#9097a3')+dot(x+r*.3,y+r*.3,r*.16,'#9097a3');}

// ---- two points A, B and the velocity fan ---------------------------------------------------------
const DTH0=50*Math.PI/180, PA=-DTH0/2, PB=DTH0/2;
const Q={x:760,y:420};
function abScene({g=1,pts=1,rad=1,ang=0,vel=0,vlab=0,mv=0,ghost=.35,dv=0,dvlab=0,fanAng=0,vc=0,plate=1,inward=0,rights=0}={}){
 let s=orbit({g,plate,phi:null});
 const A=P(PA),B=P(PB),uA=U(PA),uB=U(PB),L=O.LV;
 if(rad)s+=fade(g*rad,line(O.x,O.y,A[0],A[1],{color:C.dim,w:2})+line(O.x,O.y,B[0],B[1],{color:C.dim,w:2}));
 if(ang){s+=fade(g*ang,draw(arcPts(O.x,O.y,52,PA,PB),1,{color:C.E,w:3})+tex('\\Delta\\theta',O.x+86,O.y+12,{size:30,color:C.E,auto:false}));}
 if(rights){s+=rightMark(A[0],A[1],[(O.x-A[0])/O.R,(O.y-A[1])/O.R],uA,{g:g*rights,color:C.hi})+rightMark(B[0],B[1],[(O.x-B[0])/O.R,(O.y-B[1])/O.R],uB,{g:g*rights,color:C.hi});}
 // velocity arrows: drawn at A/B, then moved to the common tail Q
 const at=(base,u,m)=>{const x=base[0]+(Q.x-base[0])*m,y=base[1]+(Q.y-base[1])*m;return [x,y,x+L*u[0],y+L*u[1]];};
 if(vel){
  if(mv>0&&ghost>0)[[A,uA],[B,uB]].forEach(([b,u])=>{s+=fade(g*vel*ghost,arrow(b[0],b[1],b[0]+L*u[0],b[1]+L*u[1],{color:C.v,w:4,head:14}));});
  [[A,uA,VA,1],[B,uB,VB,-1]].forEach(([b,u,lab,sd])=>{const [x,y,X,Y]=at(b,u,mv);s+=arrow(x,y,X,Y,{color:C.v,w:5,head:16,g:g*vel});
   if(vlab)s+=fade(g*vlab*vel,tex(lab,(x+X)/2+sd*34,(y+Y)/2+10,{size:30,auto:false}));});
 }
 if(pts)s+=fade(g*pts,ball(A[0],A[1],{r:13})+ball(B[0],B[1],{r:13})+label('A',A[0]+18,A[1]+34,{size:28,color:C.ink,weight:700})+label('B',B[0]+20,B[1]+6,{size:28,color:C.ink,weight:700}));
 const tA=[Q.x+L*uA[0],Q.y+L*uA[1]],tB=[Q.x+L*uB[0],Q.y+L*uB[1]];
 if(vc)s+=fade(g*vc,draw(arcPts(Q.x,Q.y,L,Math.PI*.18,Math.PI*.82),1,{color:C.v,w:2,dash:'5 7'})+label('半径 v の円',Q.x-L-8,Q.y-L*.75,{size:24,color:C.v,anchor:'end'}));
 if(fanAng)s+=fade(g*fanAng,draw(arcPts(Q.x,Q.y,46,Math.PI/2-DTH0/2,Math.PI/2+DTH0/2),1,{color:C.E,w:3})+tex('\\Delta\\theta',Q.x,Q.y-64,{size:28,color:C.E,auto:false}));
 if(dv){s+=arrow(tA[0],tA[1],tB[0],tB[1],{color:C.hi,w:5,head:16,g:g*dv});
  if(dvlab)s+=fade(g*dvlab,tex('\\Delta\\boldsymbol{v}',(tA[0]+tB[0])/2,tA[1]-26,{size:30,color:C.hi,auto:false}));}
 if(inward){const M=P(0),len=Math.hypot(tB[0]-tA[0],tB[1]-tA[1]);
  s+=fade(g*inward,line(M[0],M[1],O.x,O.y,{color:C.hi,w:2,dash:'5 7'}));
  s+=arrow(M[0],M[1],M[0]-len,M[1],{color:C.hi,w:5,head:16,g:g*inward});
  s+=fade(g*inward,tex('\\Delta\\boldsymbol{v}',M[0]-len/2,M[1]-22,{size:28,color:C.hi,auto:false}));}
 return s;
}
// ---- a big velocity fan for the small-angle step ---------------------------------------------------
function bigFan({g=1,deg=50,ox=330,oy=455,L=300,arc=0,chord=1,lab=0,arcLab=0}={}){
 const d=deg*Math.PI/180,a1=Math.PI/2-d/2,a2=Math.PI/2+d/2;
 const t1=[ox+L*Math.cos(a1),oy-L*Math.sin(a1)],t2=[ox+L*Math.cos(a2),oy-L*Math.sin(a2)];
 let s=fade(g,draw(arcPts(ox,oy,L,Math.PI*.22,Math.PI*.78),1,{color:C.v,w:2,dash:'5 7'}));
 s+=arrow(ox,oy,t1[0],t1[1],{color:C.v,w:5,head:16,g})+arrow(ox,oy,t2[0],t2[1],{color:C.v,w:5,head:16,g});
 s+=fade(g,draw(arcPts(ox,oy,60,a1,a2),1,{color:C.E,w:3})+tex('\\Delta\\theta',ox+58,oy-56,{size:28,color:C.E,auto:false,anchor:'start'}));
 if(arc)s+=fade(g*arc,draw(arcPts(ox,oy,L,a1,a2),1,{color:C.x,w:9,opacity:.55}));
 if(chord)s+=arrow(t1[0],t1[1],t2[0],t2[1],{color:C.hi,w:4,head:14,g:g*chord});
 if(lab)s+=fade(g*lab,label('v',ox+L*.55*Math.cos(a1)+16,oy-L*.55*Math.sin(a1)+8,{size:28,color:C.v,weight:700}));
 if(arcLab)s+=fade(g*arcLab,label('弧',(t1[0]+t2[0])/2,t1[1]-48,{size:26,color:C.x,anchor:'middle',weight:700}));
 return s;
}
const RX=900; // centre of the right-hand card column

export const hsCircular1Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p)=>{
  let s=orbit({phi:-0.4+2.2*seg(p,0,1),vel:1,ccw:1});
  s+=card(680,120,460,200,label('速さは 一定',RX+10,190,{size:30,color:C.ink,anchor:'middle'})+label('向きが 変わり続ける',RX+10,260,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'q2']:(p)=>{
  let s=orbit({phi:1.8+1.2*p,vel:1,ccw:1});
  s+=card(680,120,460,200,label('円を 描いて 回る 物体',RX+10,190,{size:28,color:C.ink,anchor:'middle'})+label('速度は 変化している？',RX+10,260,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'setup']:(p)=>{
  let s=orbit({phi:-0.3+1.6*p,vel:seg(p,.45,.6),vlab:seg(p,.5,.65),rlab:seg(p,.2,.35)});
  s+=card(680,90,460,300,label('なめらかな 台の 上',RX+10,150,{size:28,color:C.dim,anchor:'middle'})+label('糸に つないだ おもり',RX+10,205,{size:28,color:C.ink,anchor:'middle'})+label('半径 r ＝ 2.0 m',RX+10,275,{size:30,color:C.ink,anchor:'middle',weight:700})+label('速さ v ＝ 4.0 m/s',RX+10,335,{size:30,color:C.v,anchor:'middle',weight:700}),seg(p,.05,.2));
  return s;
 },
 [K+'view']:(p)=>{
  let s=orbit({phi:1.3+1.6*p,vel:1,ccw:seg(p,.4,.6)});
  s+=card(680,110,460,220,label('真上から 見た 図',RX+10,180,{size:32,color:C.ink,anchor:'middle',weight:700})+label('反時計回り',RX+10,260,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2));
  return s;
 },
 [K+'guess']:(p)=>{
  let s=fade(.45,orbit({phi:2.9+0.6*p,vel:1,ccw:1}));
  s+=card(300,130,600,210,label('速さが 変わらない なら',600,200,{size:30,color:C.ink,anchor:'middle'})+label('加速度は 0？',600,280,{size:46,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
 // ================= S2 1周の時間と角速度 =================
 [K+'circ']:(p)=>{
  let s=orbit({phi:-0.6,vel:0,rlab:1});
  s+=fade(1,draw(arcPts(O.x,O.y,O.R,0,2*Math.PI,90),seg(p,.05,.45),{color:C.x,w:6}));
  s+=card(680,90,460,140,label('1周の 長さ ＝ 円周',RX+10,140,{size:26,color:C.dim,anchor:'middle'})+TF('2\\pi r',RX+10,200,{size:46,color:C.x}),seg(p,.1,.25),C.x);
  s+=card(680,270,460,130,TF('2\\pi\\times 2.0=4\\pi\\ \\mathrm{m}',RX+10,340,{size:44}),seg(p,.55,.7),C.x);
  return s;
 },
 [K+'period']:(p)=>{
  const u=seg(p,.05,.6);
  let s=orbit({phi:2*Math.PI*u,vel:1});
  s+=fade(1,draw(arcPts(O.x,O.y,O.R,0,2*Math.PI*u,90),1,{color:C.x,w:5,opacity:.6}));
  s+=card(680,80,460,130,label('1周に かかる 時間',RX+10,130,{size:26,color:C.dim,anchor:'middle'})+label('周期 T',RX+10,182,{size:34,color:C.t,anchor:'middle',weight:700}),seg(p,.05,.2),C.t);
  s+=card(680,250,460,180,label('速さ ＝ 1周の 長さ ÷ 周期',RX+10,295,{size:24,color:C.dim,anchor:'middle'})+TF(V+'=\\dfrac{2\\pi r}{'+TT+'}',RX+10,375,{size:48}),seg(p,.5,.65),C.v);
  return s;
 },
 [K+'tcalc']:(p)=>{
  let s=orbit({phi:2*Math.PI*seg(p,0,1),vel:1});
  s+=card(680,90,460,140,label('周期 ＝ 1周の 長さ ÷ 速さ',RX+10,140,{size:24,color:C.dim,anchor:'middle'})+TF(TT+'=4\\pi\\div 4.0=\\pi',RX+10,200,{size:44}),seg(p,.05,.2),C.t);
  s+=card(680,270,460,120,TF('\\pi\\approx 3.1\\ \\mathrm{s}',RX+10,335,{size:46,color:C.t}),seg(p,.5,.65),C.t);
  return s;
 },
 [K+'rad']:(p)=>{
  const th=1.0;let s=orbit({phi:null});
  const B=P(th);
  s+=fade(1,line(O.x,O.y,O.x+O.R,O.y,{color:C.dim,w:2.5})+line(O.x,O.y,B[0],B[1],{color:C.dim,w:2.5}));
  s+=fade(seg(p,.1,.25),draw(arcPts(O.x,O.y,46,0,th),1,{color:C.E,w:3})+tex('\\theta',O.x+64,O.y-24,{size:30,color:C.E,auto:false}));
  s+=fade(1,draw(arcPts(O.x,O.y,O.R,0,th),seg(p,.25,.45),{color:C.x,w:7}));
  s+=fade(seg(p,.35,.5),label('弧の 長さ',O.x+O.R*Math.cos(.5)+16,O.y-O.R*Math.sin(.5)-8,{size:24,color:C.x,weight:700})+label('半径',O.x+O.R/2,O.y+32,{size:24,color:C.ink,anchor:'middle'}));
  s+=card(680,80,460,190,label('弧度法',RX+10,125,{size:26,color:C.dim,anchor:'middle'})+tex(TH,RX-90,205,{size:44,auto:false})+label('＝',RX-50,215,{size:32,color:C.ink})+frac(RX+60,205,'弧の 長さ','半径',C.x,70),seg(p,.4,.55),C.E);
  s+=card(680,310,460,110,label('単位 rad（ラジアン）',RX+10,375,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.7,.82));
  return s;
 },
 [K+'rad2']:(p)=>{
  let s=orbit({phi:null});
  s+=fade(1,line(O.x,O.y,O.x+O.R,O.y,{color:C.dim,w:2.5}));
  s+=fade(1,draw(arcPts(O.x,O.y,O.R,0,2*Math.PI,90),seg(p,.05,.35),{color:C.x,w:6}));
  s+=card(680,80,460,180,label('1周',RX+10,125,{size:26,color:C.dim,anchor:'middle'})+TF('2\\pi r\\div r=2\\pi\\ \\mathrm{rad}',RX+10,205,{size:44}),seg(p,.15,.3),C.E);
  s+=card(680,300,460,120,TF('360^\\circ=2\\pi\\ \\mathrm{rad}',RX+10,370,{size:46,color:C.E}),seg(p,.6,.75),C.E);
  return s;
 },
 [K+'omega']:(p)=>{
  const u=seg(p,.1,.9),phi=2.0*u;
  let s=orbit({phi,vel:1});
  s+=fade(1,line(O.x,O.y,O.x+O.R,O.y,{color:C.dim,w:2,dash:'5 6'}));
  if(phi>.02)s+=poly([[O.x,O.y],...arcPts(O.x,O.y,70,0,phi,30)],{fill:C.p,fo:.35});
  s+=card(680,110,460,230,label('1秒 あたりに 回る 角度',RX+10,175,{size:28,color:C.ink,anchor:'middle'})+label('角速度',RX-30,262,{size:32,color:C.ink,anchor:'middle',weight:700})+TF(W,RX+60,252,{size:48})+label('（定義）',RX+10,312,{size:24,color:C.dim,anchor:'middle'}),seg(p,.05,.2),C.p);
  return s;
 },
 [K+'omega2']:(p)=>{
  let s=orbit({phi:2.0*seg(p,0,1)+2.0,vel:1});
  s+=card(680,80,460,150,label('2π rad を T 秒で',RX+10,125,{size:26,color:C.dim,anchor:'middle'})+TF(W+'=\\dfrac{2\\pi}{'+TT+'}',RX+10,195,{size:46}),seg(p,.05,.2),C.p);
  s+=card(680,270,460,130,TF('2\\pi\\div\\pi=2.0\\ \\mathrm{rad/s}',RX+10,340,{size:44,color:C.p}),seg(p,.5,.65),C.p);
  return s;
 },
 [K+'vrw']:(p)=>{
  const u=seg(p,.05,.4);
  let s=orbit({phi:2.0*u,vel:1});
  s+=fade(1,line(O.x,O.y,O.x+O.R,O.y,{color:C.dim,w:2,dash:'5 6'}));
  s+=fade(1,draw(arcPts(O.x,O.y,O.R,0,2.0*u),1,{color:C.x,w:7}));
  s+=fade(seg(p,.3,.42),label('1秒で 進む 弧',O.x+O.R*Math.cos(1)+18,O.y-O.R*Math.sin(1)-16,{size:24,color:C.x,weight:700}));
  s+=card(680,70,460,120,label('弧 ＝ 半径 × 角度',RX+10,120,{size:26,color:C.dim,anchor:'middle'})+TF('r'+W,RX+10,165,{size:40}),seg(p,.2,.35),C.x);
  s+=card(680,220,460,120,TF(V+'=r'+W,RX+10,290,{size:50}),seg(p,.45,.6),C.v);
  s+=card(680,370,460,100,TF('2.0\\times 2.0=4.0',RX+10,428,{size:40}),seg(p,.7,.82),C.hi);
  return s;
 },
 // ================= S3 速度の向き =================
 [K+'tan']:(p)=>{
  let s=orbit({phi:null});
  [0.3,1.9,3.5,5.0].forEach((phi,i)=>{const g=seg(p,.05+i*.12,.17+i*.12),[x,y]=P(phi),[ux,uy]=U(phi);
   s+=fade(g,line(O.x,O.y,x,y,{color:C.dim,w:2})+ball(x,y,{r:12}))+arrow(x,y,x+O.LV*ux,y+O.LV*uy,{color:C.v,w:5,head:16,g});
   s+=rightMark(x,y,[(O.x-x)/O.R,(O.y-y)/O.R],[ux,uy],{g:seg(p,.6,.75),color:C.hi});});
  s+=card(680,110,460,220,label('速度の 矢印',RX+10,170,{size:28,color:C.v,anchor:'middle',weight:700})+label('接線の 向き',RX+10,230,{size:30,color:C.ink,anchor:'middle'})+label('＝ 半径に 垂直',RX+10,290,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.v);
  return s;
 },
 [K+'turn']:(p)=>{
  let s=orbit({phi:null});
  for(let i=0;i<8;i++){const phi=i*Math.PI/4,g=seg(p,.03+i*.07,.1+i*.07),[x,y]=P(phi),[ux,uy]=U(phi);
   s+=fade(g,ball(x,y,{r:10}))+arrow(x,y,x+90*ux,y+90*uy,{color:C.v,w:4,head:14,g});}
  s+=card(680,110,460,220,label('長さ：いつも 4.0',RX+10,180,{size:30,color:C.v,anchor:'middle',weight:700})+label('向き：少しずつ 回る',RX+10,260,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75));
  return s;
 },
 [K+'vec']:(p)=>{
  const a1=Math.PI*.38,a2=Math.PI*.62,L=150;
  let s=arrow(220,400,220+L*Math.cos(a1),400-L*Math.sin(a1),{color:C.v,w:6,head:18,g:seg(p,.05,.2)});
  s+=arrow(440,400,440+L*Math.cos(a2),400-L*Math.sin(a2),{color:C.v,w:6,head:18,g:seg(p,.2,.35)});
  s+=fade(seg(p,.4,.55),label('≠',330,330,{size:60,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.25),label('長さ 4.0',260,450,{size:24,color:C.dim,anchor:'middle'})+label('長さ 4.0',400,450,{size:24,color:C.dim,anchor:'middle'}));
  s+=card(680,110,460,230,label('速度 ＝ 向き ＋ 大きさ',RX+10,175,{size:30,color:C.v,anchor:'middle',weight:700})+label('向きが 変われば',RX+10,250,{size:28,color:C.ink,anchor:'middle'})+label('速度は 変化',RX+10,305,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.v);
  return s;
 },
 [K+'yes']:(p)=>{
  let s=orbit({phi:0.5+1.4*p,vel:1});
  s+=card(680,110,460,230,label('速さ 一定 でも',RX+10,180,{size:30,color:C.ink,anchor:'middle'})+label('加速度 ≠ 0',RX+10,265,{size:46,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  return s;
 },
 [K+'which']:(p)=>{
  let s=orbit({phi:1.9+1.0*p,vel:1});
  s+=card(680,110,460,230,label('加速度は',RX+10,180,{size:30,color:C.ink,anchor:'middle'})+label('どちら向き？',RX+10,260,{size:42,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.5,.65),label('→ 速度の 変化を 矢印で',RX+10,400,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 // ================= S4 速度の変化の矢印 =================
 [K+'ab']:(p)=>{
  let s=abScene({pts:seg(p,.05,.25),rad:seg(p,.25,.4),ang:seg(p,.5,.65)});
  s+=card(840,110,320,170,label('少し 離れた 2点',1000,170,{size:26,color:C.ink,anchor:'middle'})+label('回った 角',990,235,{size:26,color:C.ink,anchor:'end'})+tex(DTH,1050,225,{size:36,auto:false}),seg(p,.55,.7),C.E);
  return s;
 },
 [K+'vab']:(p)=>{
  let s=abScene({ang:1,vel:seg(p,.05,.3),vlab:seg(p,.3,.45)});
  s+=card(840,110,320,190,label('長さは 同じ',1000,175,{size:28,color:C.ink,anchor:'middle'})+label('向き だけ 違う',1000,240,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.v);
  return s;
 },
 [K+'move']:(p)=>{
  let s=abScene({vel:1,vlab:1,mv:seg(p,.1,.6)});
  s+=fade(seg(p,.55,.7),dot(Q.x,Q.y,6,C.ink)+label('根元を そろえる',Q.x,Q.y+50,{size:24,color:C.ink,anchor:'middle'}));
  s+=card(880,110,280,170,label('向き と 長さ は',1020,175,{size:26,color:C.ink,anchor:'middle'})+label('そのまま',1020,235,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75));
  return s;
 },
 [K+'diff']:(p)=>{
  let s=abScene({vel:1,vlab:1,mv:1,dv:seg(p,.15,.45),dvlab:seg(p,.5,.65)});
  s+=card(880,110,280,190,label('速度の 変化',1020,175,{size:28,color:C.ink,anchor:'middle'})+tex(DV,1020,245,{size:46,auto:false}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'chain']:(p)=>{
  let s=abScene({vel:1,vlab:1,mv:1,dv:1,dvlab:1});
  s+=card(860,90,310,150,TF(VA+'+'+DV+'='+VB,1015,165,{size:34}),seg(p,.05,.25),C.hi);
  s+=card(860,280,310,150,TF(DV+'='+VB+'-'+VA,1015,355,{size:34}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'inward']:(p)=>{
  let s=abScene({pts:1,rad:.5,vel:1,vlab:1,mv:1,dv:1,dvlab:1,inward:seg(p,.1,.45)});
  s+=card(880,110,280,190,label('Δv は',1020,175,{size:28,color:C.hi,anchor:'middle',weight:700})+label('中心を 向く',1020,240,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'angle']:(p)=>{
  let s=abScene({vel:1,vlab:1,mv:0,rad:1,rights:seg(p,.45,.6)});
  s+=card(840,110,320,190,label('2本の 速度の',1000,170,{size:26,color:C.ink,anchor:'middle'})+label('間の 角は？',1000,235,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.6,.75),label('速度 ⊥ 半径',1000,360,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'angle2']:(p)=>{
  let s=abScene({vel:1,vlab:1,mv:1,ghost:.5,rad:1,ang:seg(p,.05,.25),fanAng:seg(p,.4,.6),rights:.6});
  s+=card(880,110,280,170,label('同じ 角',1020,175,{size:28,color:C.ink,anchor:'middle'})+tex(DTH,1020,240,{size:44,auto:false}),seg(p,.6,.75),C.E);
  return s;
 },
 [K+'vcircle']:(p)=>{
  let s=abScene({vel:1,vlab:1,mv:1,ghost:0,fanAng:1,dv:1,dvlab:1,vc:seg(p,.1,.4)});
  s+=card(880,110,280,190,label('矢印の 先は',1020,175,{size:26,color:C.ink,anchor:'middle'})+label('円を 描く',1020,240,{size:32,color:C.v,anchor:'middle',weight:700}),seg(p,.45,.6),C.v);
  return s;
 },
 // ================= S5 小さい角で v²/r =================
 [K+'small']:(p)=>{
  const deg=50-30*seg(p,.2,.75);
  let s=bigFan({deg,arc:1,chord:1,arcLab:1});
  s+=card(680,110,460,230,label('Δθ を 小さく すると',RX+10,175,{size:28,color:C.ink,anchor:'middle'})+label('Δv の 矢印 ≈ 弧',RX+10,255,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'dv']:(p)=>{
  let s=bigFan({deg:20,arc:1,chord:1,lab:1,arcLab:1});
  s+=card(680,80,460,140,label('弧 ＝ 半径 × 角',RX+10,130,{size:26,color:C.dim,anchor:'middle'})+TF(V+'\\times'+DTH,RX+10,185,{size:42}),seg(p,.05,.2),C.x);
  s+=card(680,260,460,130,TF(ADV+'\\approx '+V+'\\,'+DTH,RX+10,330,{size:50}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'approx']:(p)=>{
  let s=bigFan({deg:20,arc:1,chord:1,lab:1});
  s+=card(680,110,460,230,TF('\\approx',RX+10,190,{size:60,color:C.hi})+label('ほぼ 等しい',RX+10,250,{size:32,color:C.ink,anchor:'middle',weight:700})+label('Δθ が 小さいほど よく 合う',RX+10,305,{size:24,color:C.dim,anchor:'middle'}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'path']:(p)=>{
  let s=abScene({pts:1,rad:1,ang:1});
  s+=fade(1,draw(arcPts(O.x,O.y,O.R,PA,PB),seg(p,.05,.35),{color:C.x,w:8}));
  s+=fade(seg(p,.2,.35),label('vΔt 進む',P(0)[0]+20,P(0)[1]+8,{size:26,color:C.x,weight:700}));
  s+=card(680,90,460,130,label('進んだ 弧の 長さ',RX+10,135,{size:24,color:C.dim,anchor:'middle'})+TF(V+DT,RX+10,190,{size:42}),seg(p,.1,.25),C.x);
  s+=card(680,260,460,150,label('半径 r の 円の 弧',RX+10,300,{size:24,color:C.dim,anchor:'middle'})+TF(V+DT+'=r'+DTH,RX+10,365,{size:46}),seg(p,.5,.65),C.x);
  return s;
 },
 [K+'theta']:(p)=>{
  let s=TF(V+DT+'=r'+DTH,600,100,{size:54});
  s+=fade(seg(p,.2,.35),label('両辺を r で 割る',600,200,{size:28,color:C.hi,anchor:'middle'}));
  s+=card(380,250,440,170,TF(DTH+'=\\dfrac{'+V+DT+'}{r}',600,345,{size:54}),seg(p,.45,.6),C.E);
  return s;
 },
 [K+'sub']:(p)=>{
  let s=TF(ADV+'\\approx '+V+'\\,'+DTH,600,80,{size:50});
    s+=fade(seg(p,.1,.25),label('Δθ ＝ vΔt ÷ r を 入れる',600,140,{size:26,color:C.E,anchor:'middle'}));
  s+=fade(seg(p,.3,.45),TF('\\approx '+V+'\\times\\dfrac{'+V+DT+'}{r}',600,250,{size:50}));
  s+=card(380,335,440,150,TF('='+'\\dfrac{'+V+'^2'+DT+'}{r}',600,415,{size:54}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'div']:(p)=>{
  let s=TF(ADV+'\\approx\\dfrac{'+V+'^2'+DT+'}{r}',600,90,{size:50});
  s+=fade(seg(p,.1,.25),label('加速度 ＝ 1秒 あたりの 速度の 変化',600,195,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.3,.45),label('両辺を Δt で 割る',600,245,{size:28,color:C.hi,anchor:'middle'}));
  s+=card(370,290,460,170,TF('\\dfrac{'+ADV+'}{'+DT+'}\\approx\\dfrac{'+V+'^2}{r}',600,380,{size:54}),seg(p,.5,.65),C.a);
  return s;
 },
 [K+'table']:(p)=>{
  let s=card(30,90,380,330,label('Δv の 長さ（正確に）',220,140,{size:24,color:C.dim,anchor:'middle'})+TF(ADV+'=2'+V+'\\sin\\dfrac{'+DTH+'}{2}',220,215,{size:36})+label('この 例では',220,300,{size:24,color:C.dim,anchor:'middle'})+TF(DTH+'=2.0\\times'+DT,220,360,{size:36}),seg(p,.3,.45),C.hi);
  s+=table({x:440,y:110,cols:TCOLS,rows:TROWS,reveal:[seg(p,.75,.9),0,0],g:seg(p,.05,.2),size:28});
  return s;
 },
 [K+'table2']:(p)=>{
  let s=table({x:440,y:110,cols:TCOLS,rows:TROWS,reveal:[1,seg(p,.2,.3),seg(p,.4,.5)],hl:p>.6?[2]:[],size:28});
  s+=fade(seg(p,.62,.75),label('→ v² ÷ r ＝ 8.0 に 近づく',780,400,{size:30,color:C.a,anchor:'middle',weight:700}));
  s+=card(30,110,380,170,label('Δt を',220,170,{size:28,color:C.ink,anchor:'middle'})+label('小さく していく',220,230,{size:30,color:C.t,anchor:'middle',weight:700}),1,C.t);
  return s;
 },
 [K+'result']:(p)=>{
  let s=card(200,60,800,130,label('Δt を 小さく していくと 近づく 値',600,115,{size:28,color:C.dim,anchor:'middle'})+label('＝ その 瞬間の 加速度',600,165,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2));
  s+=card(350,230,500,200,TF(A+'=\\dfrac{'+V+'^2}{r}',600,330,{size:70})+label('（結果）',600,410,{size:24,color:C.dim,anchor:'middle'}),seg(p,.5,.65),C.a);
  return s;
 },
 [K+'center']:(p)=>{
  let s=orbit({phi:0.3+2.2*p,vel:1,acc:seg(p,.05,.25)});
  s+=card(680,90,460,150,label('向き：円の 中心',RX+10,150,{size:30,color:C.a,anchor:'middle',weight:700})+label('Δv と 同じ 向き',RX+10,205,{size:24,color:C.dim,anchor:'middle'}),seg(p,.1,.25),C.a);
  s+=card(680,280,460,130,label('向心加速度',RX+10,358,{size:40,color:C.a,anchor:'middle',weight:700}),seg(p,.5,.65),C.a);
  return s;
 },
 [K+'ex']:(p)=>{
  let s=orbit({phi:2.5+1.6*p,vel:1,acc:1,vlab:1});
  s+=card(680,90,460,150,TF(A+'=\\dfrac{4.0^2}{2.0}',RX+10,170,{size:48}),seg(p,.05,.2),C.a);
  s+=card(680,280,460,120,TF('=8.0\\ \\mathrm{m/s^2}',RX+10,345,{size:48,color:C.a}),seg(p,.3,.45),C.a);
  s+=fade(seg(p,.6,.75),label('速さは 一定 なのに',RX+10,450,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p)=>{
  let s=orbit({phi:0.8+1.6*p,vel:1});
  s+=card(680,110,460,230,label('速さ 一定 でも',RX+10,175,{size:28,color:C.ink,anchor:'middle'})+label('向きが 変わる',RX+10,235,{size:30,color:C.ink,anchor:'middle'})+label('→ 速度は 変化',RX+10,295,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'ans2']:(p)=>{
  let s=orbit({phi:2.4+1.6*p,vel:1,acc:1});
  s+=card(680,90,460,170,TF(A+'=\\dfrac{'+V+'^2}{r}',RX+10,175,{size:56}),seg(p,.05,.2),C.a);
  s+=card(680,290,460,140,label('向き：中心',RX+10,345,{size:30,color:C.a,anchor:'middle',weight:700})+label('（接線の 向き ではない）',RX+10,395,{size:24,color:C.dim,anchor:'middle'}),seg(p,.4,.55),C.a);
  return s;
 },
 [K+'univ']:(p)=>{
  let s=card(200,110,800,230,label('大学編',600,175,{size:28,color:C.dim,anchor:'middle'})+label('「Δt を 小さく していくと 近づく 値」',600,240,{size:30,color:C.ink,anchor:'middle'})+label('→ 微分 で 書く',600,300,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25));
  return s;
 },
 [K+'next']:(p)=>{
  let s=orbit({phi:0.5+1.8*p,vel:1,acc:1});
  s+=card(680,110,460,230,label('中心向きの 加速度を',RX+10,180,{size:28,color:C.ink,anchor:'middle'})+label('作る 力は？',RX+10,260,{size:42,color:C.F,anchor:'middle',weight:700}),seg(p,.05,.2),C.F);
  return s;
 },
 [K+'next2']:(p)=>{
  const ex=300,ey=262,R=180,ph=0.4+1.2*p,mx=ex+R*Math.cos(ph),my=ey-R*Math.sin(ph);
  let s=ring(ex,ey,R,{color:C.faint,w:2.5,dash:'8 8'})+earth(ex,ey,46)+moon(mx,my,20);
  s+=label('地球',ex,ey+80,{size:24,color:C.dim,anchor:'middle'})+label('月',mx+30,my-20,{size:24,color:C.dim});
  s+=card(680,110,460,230,label('月の 場合',RX+10,180,{size:28,color:C.ink,anchor:'middle'})+label('何が その 役を？',RX+10,260,{size:40,color:C.F,anchor:'middle',weight:700}),seg(p,.05,.2),C.F);
  return s;
 },
 [K+'bye']:(p)=>{
  let s=card(200,110,800,230,label('次回',600,175,{size:28,color:C.dim,anchor:'middle'})+label('中心向きの 力と、月',600,255,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  s+=fade(seg(p,.5,.7),label('円運動と万有引力・深く学ぶ 2/3 へ',1080,470,{size:26,color:C.dim,anchor:'end'}));
  return s;
 },
};
const TCOLS=[{h:'Δt [s]',color:C.t,w:120},{h:'Δθ [rad]',color:C.E,w:140},{h:'|Δv| [m/s]',color:C.hi,w:170},{h:'|Δv|÷Δt [m/s²]',color:C.a,w:240}];
const TROWS=[['0.5','1.0','3.835','7.67'],['0.1','0.2','0.7987','7.99'],['0.01','0.02','0.07999','8.00']];

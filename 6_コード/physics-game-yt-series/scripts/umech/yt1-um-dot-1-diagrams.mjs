// YouTube シリーズ 内積・上級 1/1（ステージ um-dot 本4・本5・本9・本10＋分配法則の証明）— 図。Stage 1200×515.
// 色：一般の矢印 𝐀 黄、𝐁 紫、𝐂 桃、𝐁＋𝐂 橙。力 𝐅 緑、移動 Δ𝐫 水色、仕事 橙。磁場 𝐁（磁束の場面）橙、面積ベクトル 黄。
// 影の図は縦横同じ縮尺（直角が直角に見えるように）。𝐀 の向き (0.8, 0.6)。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,poly} from './anim.mjs';

const K='um-dot-1:';
const CA_=C.hi,CB=C.v,CC=C.p,CS=C.E,CF=C.F,CR=C.x,CW=C.E,CMB=C.E;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:C.F,weight:700}));
const L=(s,x,y,o={})=>label(s,x,y,{anchor:'middle',size:28,color:C.ink,...o});
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const cc=(c,s)=>`{\\color{${c}}${s}}`;
const bA=cc(CA_,'\\mathbf{A}'),bB=cc(CB,'\\mathbf{B}'),bC=cc(CC,'\\mathbf{C}'),bBC=cc(CS,'(\\mathbf{B}+\\mathbf{C})');
const xh='\\hat{x}',yh='\\hat{y}';

// ---------- projection picture (𝐀 drawn horizontal: the shadow line is the 𝐀 line) ----------
const PJ={ox:90,oy:390,s:95};
const SX=x=>PJ.ox+PJ.s*x,SY=y=>PJ.oy-PJ.s*y;
const foot=v=>v[0];
const onLine=(t,off=0)=>[SX(t),SY(0)+off];
function ruler(g=1,ticks=1){
 let s='';
 if(ticks)for(let t=0;t<=5;t++){const p=onLine(t);s+=line(p[0],p[1]-7,p[0],p[1]+7,{color:C.dim,w:2});}
 return fade(g,s);
}
const vec=(from,v,color,g=1,w=5,lab='',ldx=10,ldy=-8,anchor='start')=>{const a=[SX(from[0]),SY(from[1])],b=[SX(from[0]+v[0]),SY(from[1]+v[1])];
 return fade(g,arrow(a[0],a[1],b[0],b[1],{color,w,head:16})+(lab?label(lab,(a[0]+b[0])/2+ldx,(a[1]+b[1])/2+ldy,{size:28,color,weight:700,anchor}):''));};
const drop=(p,g=1,color=C.dim)=>{const f=onLine(p[0]);return fade(g,line(SX(p[0]),SY(p[1]),f[0],f[1],{color,w:2,dash:'5 5'})+dot(f[0],f[1],5,color));};
const shadow=(t0,t1,off,color,g=1,lab='')=>{if(g<=0)return '';const a=onLine(t0,off),b=onLine(mix(t0,t1,g),off);
 return line(a[0],a[1],b[0],b[1],{color,w:8})+(lab&&g>.9?label(lab,(a[0]+b[0])/2,a[1]+30,{size:24,color,weight:700,anchor:'middle'}):'');};
function projScene({Cv=[1.8,-1.0],A=1,B=1,Cg=0,BC=0,drops=[0,0],sh=[0,0,0],P=0,Q=0,num=0,rul=1}={}){
 const Bv=[2.6,2.2],BCv=[Bv[0]+Cv[0],Bv[1]+Cv[1]];
 let s=fade(A,arrow(SX(-0.3),SY(0),SX(5.4),SY(0),{color:CA_,w:5,head:18})+label('𝐀 の直線',SX(5.55),SY(0)+44,{size:22,color:CA_,weight:700,anchor:'end'}));
 s+=ruler(rul);
 s+=vec([0,0],Bv,CB,B,5,'𝐁',-14,-6,'end');
 s+=vec(Bv,Cv,CC,Cg,5,'𝐂',14,-8,'start');
 s+=vec([0,0],BCv,CS,BC,4,'',0,0)+(Cv[0]>0?fade(BC,label('𝐁＋𝐂',SX(3.4),SY(1.0)+30,{size:28,color:CS,weight:700,anchor:'middle'})):fade(BC,label('𝐁＋𝐂',SX(BCv[0]/2)-16,SY(BCv[1]/2)-10,{size:28,color:CS,weight:700,anchor:'end'})));
 s+=drop(Bv,drops[0],CB)+drop(BCv,drops[1],CS);
 const tB=foot(Bv),tBC=foot(BCv);
 s+=shadow(0,tB,24,CB,sh[0],num?tB.toFixed(1):'');
 s+=shadow(tB,tBC,24,CC,sh[1],num?(tBC-tB).toFixed(1).replace('-','−'):'');
 s+=shadow(0,tBC,70,CS,sh[2],num?tBC.toFixed(1):'');
 s+=fade(P,label('P',SX(tB)+(Cv[0]>0?-16:14),SY(0)-14,{size:26,color:C.ink,weight:700,anchor:Cv[0]>0?'end':'start'}));
 s+=fade(Q,label('Q',SX(tBC)+(Cv[0]>0?14:-16),SY(0)-14,{size:26,color:C.ink,weight:700,anchor:Cv[0]>0?'start':'end'}));
 s+=dot(SX(0),SY(0),6,C.ink);
 return s;
}

// ---------- generic two-arrow angle picture ----------
function angPic({cx=200,cy=400,a=0.0,b=0.9,LA=330,LB=230,g=1,proj=0,signNeg=0}={}){
 const A=[cx+LA*Math.cos(a),cy-LA*Math.sin(a)],B=[cx+LB*Math.cos(b),cy-LB*Math.sin(b)];
 let s=fade(g,arrow(cx,cy,A[0],A[1],{color:CA_,w:6,head:18})+label('𝐀',A[0]+10,A[1]+8,{size:30,color:CA_,weight:700}));
 s+=fade(g,arrow(cx,cy,B[0],B[1],{color:CB,w:5,head:16})+label('𝐁',B[0]+(b>1.6?-30:10),B[1]-6,{size:30,color:CB,weight:700}));
 const r=60,pts=Array.from({length:21},(_,i)=>{const u=mix(a,b,i/20);return [cx+r*Math.cos(u),cy-r*Math.sin(u)];});
 s+=fade(g,draw(pts,1,{color:C.ink,w:2})+label('θ',cx+(r+18)*Math.cos((a+b)/2),cy-(r+18)*Math.sin((a+b)/2)+8,{size:26,color:C.ink}));
 if(proj){const t=LB*Math.cos(b-a),F=[cx+t*Math.cos(a),cy-t*Math.sin(a)];
  if(t<0)s+=fade(proj,line(cx,cy,cx+t*1.25*Math.cos(a),cy-t*1.25*Math.sin(a),{color:C.dim,w:2,dash:'4 6'}));
  s+=fade(proj,line(B[0],B[1],F[0],F[1],{color:C.dim,w:2,dash:'5 5'})+line(cx,cy+16,F[0],F[1]+16,{color:t<0?C.a:CB,w:7})
   +label(t<0?'影（負）':'影 B cosθ',(cx+F[0])/2,cy+52,{size:24,color:t<0?C.a:CB,anchor:'middle',weight:700}));}
 return s;
}

// ---------- 4-cell table ----------
function table4({g=1,cross=0,keep=0}={}){
 const x0=360,y0=110,w=240,h=120;
 let s=fade(g,T(`${cc(CB,'B_x'+xh)}`,x0+w/2,y0-24,36)+T(`${cc(CB,'B_y'+yh)}`,x0+w*1.5,y0-24,36)
  +T(`${cc(CA_,'A_x'+xh)}`,x0-70,y0+h/2+10,36)+T(`${cc(CA_,'A_y'+yh)}`,x0-70,y0+h*1.5+10,36));
 const cells=[[0,0,`A_xB_x\\,(${xh}\\cdot${xh})`,1],[1,0,`A_xB_y\\,(${xh}\\cdot${yh})`,0],[0,1,`A_yB_x\\,(${yh}\\cdot${xh})`,0],[1,1,`A_yB_y\\,(${yh}\\cdot${yh})`,1]];
 cells.forEach(([i,j,t,diag])=>{const X=x0+i*w,Y=y0+j*h;
  s+=fade(g,rect(X,Y,w,h,{fill:diag?'#1d2e4f':'#131f38',fo:1,stroke:C.faint,sw:2,rx:4})+T(t,X+w/2,Y+h/2+10,30));
  if(!diag)s+=fade(cross,line(X+20,Y+20,X+w-20,Y+h-20,{color:C.a,w:4})+label('0',X+w-26,Y+30,{size:26,color:C.a,weight:700}));
  if(diag)s+=fade(keep,label('×1',X+w-30,Y+30,{size:24,color:C.F,weight:700}));});
 return s;
}

// ---------- curved path (work) ----------
const WP={ox:110,oy:440,s:95};
const WX=x=>WP.ox+WP.s*x,WY=y=>WP.oy-WP.s*y;
const slope=u=>[4*u,3*(1-u)+0.55*Math.sin(2*Math.PI*u)];   // (0,3) → (4,0), curved
const stepsU=[0,0.2,0.42,0.68,1];
function workAxes(g=1){
 let s=arrow(WX(-0.2),WY(0),WX(4.6),WY(0),{color:C.dim,w:2.5,head:12})+arrow(WX(0),WY(-0.2),WX(0),WY(3.6),{color:C.dim,w:2.5,head:12});
 s+=label('x（m）',WX(4.6),WY(0)+56,{size:22,color:C.dim,anchor:'end'})+label('y（m）',WX(0)+10,WY(3.6)+4,{size:22,color:C.dim});
 [1,2,3,4].forEach(u=>{s+=line(WX(u),WY(0)-5,WX(u),WY(0)+5,{color:C.dim})+label(String(u),WX(u),WY(0)+28,{size:21,color:C.dim,anchor:'middle'});});
 [1,2,3].forEach(v=>{s+=line(WX(0)-5,WY(v),WX(0)+5,WY(v),{color:C.dim})+label(String(v),WX(0)-12,WY(v)+7,{size:21,color:C.dim,anchor:'end'});});
 return fade(g,s);
}
function slopePath({g=1,steps=0,forces=0,total=0,labels=1}={}){
 let s=fade(g,draw(Array.from({length:61},(_,i)=>{const q=slope(i/60);return [WX(q[0]),WY(q[1])];}),1,{color:C.dim,w:3,dash:'8 6'}));
 for(let i=0;i<stepsU.length-1;i++){const a=slope(stepsU[i]),b=slope(stepsU[i+1]);
  s+=fade(steps>i/4?1:0,arrow(WX(a[0]),WY(a[1]),WX(b[0]),WY(b[1]),{color:CR,w:4,head:13})+(labels?label(`Δ𝐫${'₁₂₃₄'[i]}`,(WX(a[0])+WX(b[0]))/2+8,(WY(a[1])+WY(b[1]))/2-12,{size:22,color:CR}):''));
  s+=fade(forces,arrow(WX(a[0]),WY(a[1]),WX(a[0]),WY(a[1])+60,{color:CF,w:4,head:12}));}
 s+=fade(forces,label('𝐅',WX(0)+12,WY(3)+56,{size:26,color:CF,weight:700}));
 s+=fade(total,arrow(WX(0),WY(3),WX(4),WY(0),{color:CH(),w:5,head:16})+label('全体の移動',WX(2)+16,WY(1.5)+8,{size:24,color:CH(),weight:700}));
 return s;
}
function CH(){return C.hi;}

// ---------- surface (flux) ----------
function plane({cx=330,cy=300,g=1,normal=0,field=0,th=1.05,comp=0}={}){
 // a tilted square seen in perspective; normal points up-right
 const pts=[[cx-150,cy+70],[cx+90,cy+120],[cx+150,cy-40],[cx-90,cy-90]];
 let s=fade(g,poly(pts,{fill:'#6adfff',fo:.12,stroke:'#6adfff',sw:2}));
 const nd=[0.42,-0.91];const n0=[cx,cy];
 s+=fade(normal,arrow(n0[0],n0[1],n0[0]+nd[0]*170,n0[1]+nd[1]*170,{color:C.hi,w:5,head:16})+label('𝐀（法線）',n0[0]+nd[0]*170+12,n0[1]+nd[1]*170+6,{size:24,color:C.hi,weight:700}));
 // field direction: rotate normal by th (clockwise on screen)
 const fdir=[nd[0]*Math.cos(th)-nd[1]*Math.sin(th),nd[0]*Math.sin(th)+nd[1]*Math.cos(th)];
 if(field){for(let k=-1;k<=1;k++){const o=[cx+k*80*(-fdir[1]),cy+k*80*fdir[0]];
  s+=fade(field,arrow(o[0]-fdir[0]*110,o[1]-fdir[1]*110,o[0]+fdir[0]*90,o[1]+fdir[1]*90,{color:CMB,w:3.5,head:13}));}
  s+=fade(field,label('𝐁',cx+fdir[0]*90+80*(-fdir[1])+10,cy+fdir[1]*90+80*fdir[0]+6,{size:28,color:CMB,weight:700}));}
 if(comp){const L1=150,c=Math.cos(th),F=[n0[0]+fdir[0]*L1,n0[1]+fdir[1]*L1],Pn=[n0[0]+nd[0]*L1*c,n0[1]+nd[1]*L1*c];
  s+=fade(comp,arrow(n0[0],n0[1],F[0],F[1],{color:CMB,w:5,head:16})+line(F[0],F[1],Pn[0],Pn[1],{color:C.dim,w:2,dash:'5 5'})
   +line(n0[0]-10*nd[1]*0,n0[1],Pn[0],Pn[1],{color:C.F,w:7})+label('B cosθ',Pn[0]-14,Pn[1]+4,{size:22,color:C.F,anchor:'end',weight:700}));
  const r=46,a0=Math.atan2(-nd[1],nd[0]),a1=Math.atan2(-fdir[1],fdir[0]),arc=Array.from({length:16},(_,i)=>{const u=mix(a0,a1,i/15);return [n0[0]+r*Math.cos(u),n0[1]-r*Math.sin(u)];});
  s+=fade(comp,draw(arc,1,{color:C.ink,w:2})+label('θ',n0[0]+(r+16)*Math.cos((a0+a1)/2),n0[1]-(r+16)*Math.sin((a0+a1)/2)+8,{size:24,color:C.ink}));}
 return s;
}

export const ytUmDot1Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  let s=T(`${bA}\\cdot(${bB}+${bC})=${bA}\\cdot${bB}+${bA}\\cdot${bC}`,600,130,52);
  s+=card(330,230,540,190,L('前回の最後の問い',600,280,{size:24,color:C.dim})+L('内積の 分配法則は',600,335,{size:32,color:C.hi,weight:700})+L('なぜ成り立つ？',600,390,{size:34,color:C.hi,weight:700}),seg(p,.1,.3),C.hi);
  return s;
 },
 [K+'recap']:(p)=>{
  let s=table4({g:seg(p,.02,.25),cross:seg(p,.45,.6),keep:seg(p,.45,.6)});
  s+=fade(seg(p,.65,.85),T(`${bA}\\cdot${bB}=A_xB_x+A_yB_y`,600,420,46));
  s+=L('（内積・中級）',1060,80,{size:22,color:C.dim});
  return s;
 },
 [K+'recap2']:(p)=>{
  let s=T(`(A_x${xh}+A_y${yh})\\cdot(B_x${xh}+B_y${yh})`,600,80,36,{color:C.dim});
  s+=fade(seg(p,.05,.25),L('展開に使った性質',600,170,{size:26,color:C.dim}));
  s+=fade(seg(p,.1,.35),T(`${bA}\\cdot(${bB}+${bC})=${bA}\\cdot${bB}+${bA}\\cdot${bC}`,600,250,50)+L('分配法則',600,330,{size:30,color:C.hi,weight:700}));
  s+=card(250,370,700,100,L('中級：図で確かめただけ → 証明は 上級で',600,430,{size:28,color:C.hi}),seg(p,.6,.75),C.hi);
  return s;
 },

 // ===== S2 内積を影で読み直す =====
 [K+'def']:(p)=>{
  let s=angPic({g:seg(p,.02,.2)});
  s+=fade(seg(p,.1,.3),T(`${bA}\\cdot${bB}=A\\,B\\cos\\theta`,880,170,52));
  s+=fade(seg(p,.5,.7),L('太字 ＝ 矢印，細字 ＝ その長さ',880,280,{size:26}));
  s+=fade(seg(p,.75,.9),L('θ ＝ 二本の間の角',880,340,{size:26}));
  return s;
 },
 [K+'shadow']:(p)=>{
  let s=angPic({proj:seg(p,.05,.3)});
  s+=T(`${bA}\\cdot${bB}=A\\times(${cc(CB,'B\\cos\\theta')})`,880,170,46);
  s+=fade(seg(p,.5,.7),L('𝐀 の長さ × 𝐁 の影の長さ',880,280,{size:30,color:C.hi,weight:700}));
  s+=fade(seg(p,.05,.3),L('影：𝐁 の先から 𝐀 の直線へ 垂直に下ろす',880,360,{size:22,color:C.dim}));
  return s;
 },
 [K+'sign']:(p)=>{
  let s=angPic({cx:170,cy:330,LA:250,LB:170,b:0.9,proj:1});
  s+=fade(seg(p,.2,.4),angPic({cx:800,cy:330,LA:250,LB:170,b:2.3,proj:1}));
  s+=L('同じ向き → 正',300,470,{size:26,color:CB,weight:700});
  s+=fade(seg(p,.2,.4),L('逆向き → 負（θ > 90°，cosθ < 0）',880,470,{size:26,color:C.a,weight:700}));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=projScene({A:1,B:1,Cg:seg(p,.1,.3),BC:seg(p,.25,.45),rul:1});
  s+=card(640,110,500,260,L('𝐁 ＋ 𝐂 の影は',890,170,{size:30,color:CS,weight:700})
   +L('𝐁 の影・𝐂 の影と',890,235,{size:28})+L('どんな関係？',890,295,{size:32,color:C.hi,weight:700})
   +fade(seg(p,.5,.7),L('予想してみよう',890,345,{size:24,color:C.hi})),seg(p,.05,.2),C.hi);
  return s;
 },

 // ===== S3 継ぎ足した矢印の影 =====
 [K+'tip']:(p)=>{
  let s=projScene({A:.5,B:1,Cg:seg(p,.05,.25),BC:seg(p,.5,.7),rul:.5});
  s+=card(640,140,500,200,L('先に 根元をつなぐ',890,195,{size:28,color:CC,weight:700})
   +fade(seg(p,.5,.7),L('𝐁＋𝐂：𝐁 の根元 → 𝐂 の先',890,265,{size:28,color:CS,weight:700})),seg(p,.02,.15));
  return s;
 },
 [K+'drop']:(p)=>{
  let s=projScene({Cg:1,BC:1,drops:[seg(p,.05,.25),seg(p,.5,.65)],sh:[seg(p,.25,.45),0,seg(p,.65,.85)],P:seg(p,.25,.4),Q:seg(p,.65,.8)});
  s+=card(660,140,480,220,L('𝐀 の直線へ 垂直に下ろす',900,195,{size:26,color:C.dim})
   +fade(seg(p,.25,.45),L('𝐁 の影：0 → P',900,255,{size:28,color:CB,weight:700}))
   +fade(seg(p,.65,.85),L('𝐁＋𝐂 の影：0 → Q',900,315,{size:28,color:CS,weight:700})),seg(p,.02,.15));
  return s;
 },
 [K+'cshadow']:(p)=>{
  let s=projScene({Cg:1,BC:1,drops:[1,1],sh:[1,seg(p,.05,.3),1],P:1,Q:1});
  // ghost of C moved to the origin: same shadow length
  s+=fade(seg(p,.45,.65),vec([0,0],[1.8,-1.0],CC,.5,4)+drop([1.8,-1.0],.6,CC));
  s+=card(660,140,480,220,L('P → Q ＝ 𝐂 の影',900,195,{size:30,color:CC,weight:700})
   +fade(seg(p,.45,.65),L('平行に動かしても',900,260,{size:26}))+fade(seg(p,.45,.65),L('影の長さは 同じ',900,305,{size:26})),seg(p,.02,.15));
  return s;
 },
 [K+'add']:(p)=>{
  let s=projScene({Cg:1,BC:1,drops:[1,1],sh:[1,1,1],P:1,Q:1});
  s+=card(660,120,480,260,L('同じ 一本の直線の上',900,175,{size:28,color:C.dim})
   +fade(seg(p,.4,.6),L('0→Q ＝ 0→P ＋ P→Q',900,245,{size:32,color:C.hi,weight:700}))
   +fade(seg(p,.55,.75),L('𝐁＋𝐂 の影 ＝ 𝐁 の影 ＋ 𝐂 の影',900,315,{size:24})),seg(p,.02,.15));
  return s;
 },
 [K+'num']:(p)=>{
  let s=projScene({Cg:1,BC:1,drops:[1,1],sh:[1,1,1],P:1,Q:1,num:1});
  s+=card(660,120,480,260,L('目盛りで読む',900,175,{size:26,color:C.dim})
   +fade(seg(p,.05,.3),L('2.6 ＋ 1.8 ＝ 4.4',900,245,{size:36,color:C.hi,weight:700}))
   +fade(seg(p,.55,.75),L('𝐁＋𝐂 の影 4.4 と 同じ',900,315,{size:26,color:CS,weight:700})+ok(1080,318)),seg(p,.02,.15));
  return s;
 },
 [K+'neg']:(p)=>{
  let s=projScene({Cv:[-1.0,1.2],Cg:1,BC:seg(p,.05,.2),drops:[1,seg(p,.1,.25)],sh:[1,seg(p,.25,.45),seg(p,.25,.45)],P:1,Q:seg(p,.1,.25),num:1});
  s+=card(660,120,480,280,L('𝐂 が 逆向きに戻る',900,175,{size:28,color:CC,weight:700})
   +fade(seg(p,.25,.45),L('P → Q は 負',900,235,{size:28,color:C.a,weight:700}))
   +fade(seg(p,.45,.65),L('2.6 ＋ (−1.0) ＝ 1.6',900,300,{size:34,color:C.hi,weight:700}))
   +fade(seg(p,.7,.85),L('負の数を 足すだけ',900,360,{size:26})),seg(p,.02,.15));
  return s;
 },
 [K+'mult']:(p)=>{
  let s=L('影の足し算',600,50,{size:26,color:C.dim});
  s+=L('(𝐁＋𝐂) の影',390,130,{size:34,color:CS,weight:700})+L('＝',540,130,{size:34})+L('𝐁 の影',660,130,{size:34,color:CB,weight:700})+L('＋',770,130,{size:34})+L('𝐂 の影',880,130,{size:34,color:CC,weight:700});
  s+=fade(seg(p,.05,.25),L('両辺 × 𝐀 の長さ A',600,220,{size:28,color:CA_,weight:700}));
  s+=fade(seg(p,.25,.5),T(`${bA}\\cdot(${bB}+${bC})=${bA}\\cdot${bB}+${bA}\\cdot${bC}`,600,320,56));
  s+=highlight(170,265,860,110,seg(p,.6,.75));
  s+=fade(seg(p,.7,.85),L('内積の定義から 導いた結果',600,450,{size:28,color:C.F,weight:700}));
  return s;
 },
 [K+'scalar']:(p)=>{
  let s=T(`${bA}\\cdot(k${bB})=k\\,(${bA}\\cdot${bB})`,600,110,50);
  s+=fade(seg(p,.05,.3),L('𝐁 を k 倍 → 影も k 倍',600,200,{size:28,color:CB}));
  s+=fade(seg(p,.45,.65),T(`AB\\cos\\theta=BA\\cos\\theta\\ \\Rightarrow\\ ${bB}\\cdot${bA}=${bA}\\cdot${bB}`,600,320,44));
  s+=fade(seg(p,.6,.8),L('掛ける順を 変えても同じ',600,410,{size:28}));
  return s;
 },

 // ===== S4 成分の式と3次元の角度 =====
 [K+'expand']:(p)=>{
  let s=T(`(A_x${xh}+A_y${yh})\\cdot(B_x${xh}+B_y${yh})`,600,80,44);
  s+=fade(seg(p,.3,.55),T(`=A_xB_x(${xh}\\cdot${xh})+A_xB_y(${xh}\\cdot${yh})+A_yB_x(${yh}\\cdot${xh})+A_yB_y(${yh}\\cdot${yh})`,600,200,34));
  s+=fade(seg(p,.3,.5),L('分配法則で 4 項に分ける',600,290,{size:26,color:C.hi}));
  s+=fade(seg(p,.65,.85),L('数倍は かっこの外へ出す',600,350,{size:26,color:C.dim}));
  s+=fade(seg(p,.7,.85),ok(600,420)+L('中級の展開が 正当に',600,470,{size:26,color:C.F,weight:700}));
  return s;
 },
 [K+'vanish']:(p)=>{
  let s=table4({cross:seg(p,.35,.55),keep:seg(p,.05,.3)});
  s+=fade(seg(p,.65,.85),T(`${bA}\\cdot${bB}=A_xB_x+A_yB_y`,600,420,46));
  return s;
 },
 [K+'three']:(p)=>{
  const x0=330,y0=90,w=180,h=95,ax=['x','y','z'];
  let s=L('3 × 3 ＝ 9 マス',600,55,{size:26,color:C.dim});
  for(let i=0;i<3;i++)for(let j=0;j<3;j++){const X=x0+i*w,Y=y0+j*h,d=i===j;
   s+=rect(X,Y,w,h,{fill:d?'#1d2e4f':'#131f38',fo:1,stroke:C.faint,sw:2,rx:4})+T(`A_${ax[j]}B_${ax[i]}`,X+w/2,Y+h/2+10,30);
   if(!d)s+=fade(seg(p,.3,.5),line(X+20,Y+16,X+w-20,Y+h-16,{color:C.a,w:3}));}
  s+=fade(seg(p,.55,.75),T(`${bA}\\cdot${bB}=A_xB_x+A_yB_y+A_zB_z`,600,420,44));
  s+=fade(seg(p,.3,.5),L('同じ向きの 3 マスだけ',1040,250,{size:24,color:C.F}));
  return s;
 },
 [K+'num3']:(p)=>{
  let s=T(`${bA}=(1,2,2),\\qquad ${bB}=(2,-1,3)`,600,90,44);
  s+=fade(seg(p,.35,.6),T(`${bA}\\cdot${bB}=1\\times2+2\\times(-1)+2\\times3`,600,210,44));
  s+=fade(seg(p,.7,.85),T(`=2-2+6=6`,600,320,50));
  return s;
 },
 [K+'len']:(p)=>{
  let s=T(`${bA}\\cdot${bB}=6`,600,70,40,{color:C.dim});
  s+=fade(seg(p,.05,.3),T(`A=\\sqrt{1+4+4}=3`,600,180,46)+L('（ベクトル・中級）',900,180,{size:22,color:C.dim,anchor:'start'}).replace('text-anchor="start"','text-anchor="start"'));
  s+=fade(seg(p,.45,.7),T(`B=\\sqrt{4+1+9}=\\sqrt{14}\\approx3.74`,600,310,46));
  return s;
 },
 [K+'angle']:(p)=>{
  let s=T(`\\cos\\theta=\\dfrac{${bA}\\cdot${bB}}{A\\,B}=\\dfrac{6}{3\\sqrt{14}}\\approx0.535`,600,140,48);
  s+=fade(seg(p,.35,.55),T(`\\theta\\approx57.7^\\circ`,600,280,56));
  s+=fade(seg(p,.6,.8),L('分度器なしで，成分だけから',600,390,{size:28,color:C.hi,weight:700}));
  return s;
 },

 // ===== S5 曲がった道の仕事 =====
 [K+'work']:(p)=>{
  const O=[160,360];
  let s=arrow(O[0],O[1],O[0]+420,O[1],{color:CR,w:5,head:16})+label('Δ𝐫',O[0]+210,O[1]+40,{size:28,color:CR,weight:700,anchor:'middle'});
  s+=fade(seg(p,.05,.25),arrow(O[0],O[1],O[0]+230,O[1]-170,{color:CF,w:5,head:16})+label('𝐅（一定）',O[0]+240,O[1]-180,{size:26,color:CF,weight:700}));
  s+=fade(seg(p,.4,.6),T(`W=${cc(CF,'\\mathbf{F}')}\\cdot${cc(CR,'\\Delta\\mathbf{r}')}`,900,230,54));
  s+=fade(seg(p,.4,.6),L('一定の力・まっすぐの移動',900,330,{size:26,color:C.dim}));
  return s;
 },
 [K+'curve']:(p)=>{
  let s=workAxes()+slopePath({steps:seg(p,.15,.6),forces:0});
  s+=card(640,110,500,240,L('道を 短い一歩に分ける',890,170,{size:28,color:CR,weight:700})
   +fade(seg(p,.6,.8),T(`${cc(CF,'\\mathbf{F}')}\\cdot${cc(CR,'\\Delta\\mathbf{r}_1')}+${cc(CF,'\\mathbf{F}')}\\cdot${cc(CR,'\\Delta\\mathbf{r}_2')}+\\cdots`,890,270,34)),seg(p,.05,.2));
  return s;
 },
 [K+'factor']:(p)=>{
  const F=cc(CF,'\\mathbf{F}'),r1=cc(CR,'\\Delta\\mathbf{r}_1'),r2=cc(CR,'\\Delta\\mathbf{r}_2');
  let s=L('どの一歩でも 𝐅 が同じ',600,60,{size:28,color:CF,weight:700});
  s+=T(`${F}\\cdot${r1}+${F}\\cdot${r2}+\\cdots`,600,170,50);
  s+=fade(seg(p,.4,.65),T(`=${F}\\cdot(${r1}+${r2}+\\cdots)`,600,290,50));
  s+=fade(seg(p,.4,.65),L('分配法則で くくり出す',600,390,{size:28,color:C.hi,weight:700}));
  return s;
 },
 [K+'factor2']:(p)=>{
  let s=workAxes()+slopePath({steps:1,total:seg(p,.1,.35)});
  s+=card(640,110,500,270,T(`${cc(CR,'\\Delta\\mathbf{r}_1')}+${cc(CR,'\\Delta\\mathbf{r}_2')}+\\cdots`,890,170,36)
   +L('＝ 始点 → 終点 の移動',890,235,{size:28,color:C.hi,weight:700})
   +fade(seg(p,.55,.75),L('仕事は 道の形によらず',890,300,{size:26}))+fade(seg(p,.55,.75),L('始点と終点だけで決まる',890,345,{size:26})),seg(p,.05,.2));
  return s;
 },
 [K+'grav']:(p)=>{
  let s=workAxes()+slopePath({steps:1,forces:seg(p,.05,.3),total:seg(p,.6,.8),labels:0});
  s+=fade(seg(p,.3,.5),dot(WX(0),WY(3),7,C.hi)+label('(0, 3)',WX(0)+14,WY(3)-12,{size:22,color:C.hi})+dot(WX(4),WY(0),7,C.hi)+label('(4, 0)',WX(4)+4,WY(0)-16,{size:22,color:C.hi}));
  s+=card(640,100,500,280,T(`${cc(CF,'\\mathbf{F}')}=(0,\\,-20)\\ \\mathrm{N}`,890,165,40)+L('重力（一定）',890,215,{size:24,color:CF})
   +fade(seg(p,.6,.8),L('移動',770,300,{size:32,color:CR,weight:700})+T(`=(4,\\,-3)\\ \\mathrm{m}`,920,300,40)),seg(p,.02,.2));
  return s;
 },
 [K+'grav2']:(p)=>{
  let s=workAxes()+slopePath({steps:1,forces:1,total:1,labels:0});
  s+=card(640,100,500,300,T(`W=0\\times4+(-20)\\times(-3)`,890,170,34)
   +fade(seg(p,.2,.4),T(`=60\\ \\mathrm{J}`,890,250,48))
   +fade(seg(p,.55,.75),L('坂の曲がり方によらない',890,335,{size:26,color:CW,weight:700})),seg(p,.02,.15));
  return s;
 },
 [K+'vary']:(p)=>{
  const ox=150,oy=420,s0=260,X=x=>ox+s0*x,Y=y=>oy-s0*y;
  let s=arrow(X(-.1),Y(0),X(1.3),Y(0),{color:C.dim,w:2.5,head:12})+arrow(X(0),Y(-.1),X(0),Y(1.3),{color:C.dim,w:2.5,head:12})
   +label('1',X(1),Y(0)+28,{size:22,color:C.dim,anchor:'middle'})+label('1',X(0)-12,Y(1)+8,{size:22,color:C.dim,anchor:'end'});
  [0.25,0.5,0.75,1].forEach(x=>[0.2,0.6].forEach(y=>{s+=fade(.55,arrow(X(x),Y(y),X(x),Y(y)-x*70,{color:CF,w:3,head:10}));}));
  s+=fade(seg(p,.25,.4),draw([[X(0),Y(0)],[X(1),Y(0)],[X(1),Y(1)]],1,{color:C.hi,w:5})+label('1 J',X(1)+14,Y(.5),{size:26,color:C.hi,weight:700}));
  s+=fade(seg(p,.4,.55),draw([[X(0),Y(0)],[X(0),Y(1)],[X(1),Y(1)]],1,{color:C.p,w:5})+label('0 J',X(.5),Y(1)-14,{size:26,color:C.p,weight:700,anchor:'middle'}));
  s+=card(640,100,500,280,T(`${cc(CF,'\\mathbf{F}')}=(0,\\,x)\\ \\mathrm{N}`,890,165,40)+L('右ほど 強い上向きの力（中級）',890,215,{size:22,color:C.dim})
   +fade(seg(p,.05,.25),L('一歩ごとに 𝐅 が違う',890,275,{size:28,color:CF,weight:700}))
   +fade(seg(p,.6,.8),L('→ くくり出せない',890,330,{size:28,color:C.a,weight:700})),seg(p,.02,.15));
  return s;
 },
 [K+'lineint']:(p)=>{
  let s=T(`W\\approx\\sum_i ${cc(CF,'\\mathbf{F}(\\mathbf{r}_i)')}\\cdot${cc(CR,'\\Delta\\mathbf{r}_i')}`,600,110,50);
  s+=fade(seg(p,.3,.5),L('一歩を 細かくした行き先',600,210,{size:26,color:C.dim}));
  s+=fade(seg(p,.35,.6),T(`W=\\int_C ${cc(CF,'\\mathbf{F}')}\\cdot d${cc(CR,'\\mathbf{r}')}`,600,320,58));
  s+=fade(seg(p,.7,.85),L('一つの角度を 全体に掛けることは できない',600,450,{size:26,color:C.a,weight:700}));
  return s;
 },

 // ===== S6 面を貫く量 =====
 [K+'flux']:(p)=>{
  let s=plane({field:seg(p,.05,.25),normal:0,th:0.7});
  s+=card(640,100,500,280,L('面を貫く量（初級：磁束）',890,160,{size:26,color:C.dim})
   +fade(seg(p,.3,.5),T(`\\Phi=B_{\\perp}A`,890,250,52))
   +fade(seg(p,.5,.7),L('面に垂直な 磁場の成分 × 面積',890,335,{size:26})),seg(p,.02,.15));
  return s;
 },
 [K+'normal']:(p)=>{
  let s=plane({field:.35,normal:seg(p,.05,.3),th:0.7});
  s+=card(640,100,500,280,L('面積ベクトル 𝐀',890,160,{size:30,color:C.hi,weight:700})
   +L('長さ ＝ 面積',890,225,{size:26})+L('向き ＝ 面に垂直（法線）',890,275,{size:26})
   +fade(seg(p,.6,.8),L('この場面の 𝐁 ＝ 磁場',890,340,{size:26,color:CMB,weight:700})),seg(p,.02,.15));
  return s;
 },
 [K+'fluxdot']:(p)=>{
  let s=plane({field:.25,normal:1,th:0.7,comp:seg(p,.3,.55)});
  s+=card(640,100,500,250,T(`\\Phi=${cc(CMB,'\\mathbf{B}')}\\cdot${cc(C.hi,'\\mathbf{A}')}=BA\\cos\\theta`,890,180,40)
   +fade(seg(p,.55,.75),L('θ：磁場と法線の間の角',890,280,{size:26})),seg(p,.02,.15));
  return s;
 },
 [K+'fluxnum']:(p)=>{
  let s=plane({field:.25,normal:1,th:1.047,comp:1});
  s+=card(640,90,500,320,L('B ＝ 0.2 T，A ＝ 0.5 m²，θ ＝ 60°',890,150,{size:24})
   +fade(seg(p,.35,.55),T(`\\Phi=0.2\\times0.5\\times\\cos60^\\circ`,890,225,36))
   +fade(seg(p,.5,.7),T(`=0.2\\times0.5\\times0.5`,890,295,36))
   +fade(seg(p,.7,.85),T(`=0.05\\ \\mathrm{Wb}`,890,370,44)),seg(p,.02,.15));
  return s;
 },
 [K+'compare']:(p)=>{
  let s=card(60,70,520,380,L('仕事',320,120,{size:30,color:CW,weight:700})
   +T(`W=${cc(CF,'\\mathbf{F}')}\\cdot${cc(CR,'\\Delta\\mathbf{r}')}`,320,210,44)
   +L('移動の向き の成分',320,300,{size:28,color:CR,weight:700})+L('単位 J',320,370,{size:24,color:C.dim}),seg(p,.02,.2),CW);
  s+=card(620,70,520,380,L('磁束',880,120,{size:30,color:CMB,weight:700})
   +T(`\\Phi=${cc(CMB,'\\mathbf{B}')}\\cdot${cc(C.hi,'\\mathbf{A}')}`,880,210,44)
   +L('法線の向き の成分',880,300,{size:28,color:C.hi,weight:700})+L('単位 Wb',880,370,{size:24,color:C.dim}),seg(p,.15,.35),CMB);
  s+=fade(seg(p,.6,.8),L('同じ内積，取る向きが違うだけ',600,495,{size:28,color:C.hi,weight:700}));
  return s;
 },

 // ===== S7 まとめと次の問い =====
 [K+'sum']:(p)=>{
  let s=projScene({Cg:1,BC:1,drops:[1,1],sh:[1,1,1],P:1,Q:1});
  s+=card(660,110,480,280,L('𝐀·𝐁 ＝ A × 影の長さ',900,175,{size:30,color:C.hi,weight:700})
   +fade(seg(p,.35,.55),L('影は 一本の直線上で 足せる',900,255,{size:26}))
   +fade(seg(p,.6,.8),L('→ 分配法則',900,320,{size:32,color:C.hi,weight:700})),seg(p,.02,.15));
  return s;
 },
 [K+'sum2']:(p)=>{
  const rows=[['成分の式','成分どうしの積の和 が正当に',C.hi],['仕事','一定の力は くくり出せる',CW],['磁束','法線の成分を取る',CMB]];
  let s='';
  rows.forEach((r,i)=>{const y=130+i*110,g=seg(p,.05+i*.25,.25+i*.25);
   s+=fade(g,rect(150,y-50,900,90,{fill:'#131f38',fo:.96,stroke:r[2],sw:2,rx:12})+label(r[0],190,y+8,{size:28,color:r[2],weight:700})+label(r[1],420,y+8,{size:28}));});
  return s;
 },
 [K+'next']:(p)=>{
  let s=L('中級：外積の分配法則',600,80,{size:28,color:C.dim});
  s+=fade(seg(p,.1,.35),T(`${bA}\\times(${bB}+${bC})=${bA}\\times${bB}+${bA}\\times${bC}`,600,200,52));
  s+=fade(seg(p,.45,.7),L('「成り立つことは 上級で確かめる」',600,320,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'next2']:(p)=>{
  let s=T(`${bA}\\times(${bB}+${bC})=${bA}\\times${bB}+${bA}\\times${bC}`,600,110,44,{color:C.dim});
  s+=card(270,200,660,230,L('外積の分配法則は どう示す？',600,270,{size:32,color:C.hi,weight:700})
   +fade(seg(p,.45,.65),L('成分の式は どうなる？',600,350,{size:32,color:C.hi,weight:700})),seg(p,.05,.2),C.hi);
  return s;
 },
};

// YouTube シリーズ「外積・上級 1/2」(ys-um-cross-1) — 図。Stage 1200×515.
// 色：𝐀 水色、𝐁 緑、𝐂 紫、𝐁＋𝐂 黄、θ 橙、外積の答え 桃、負・誤り 赤。基本の向き x̂ 水色、ŷ 紫、ẑ 金（中級 07 と同じ）。
// 空間：x 右、y 奥（斜め右上に描く）、z 上（斜投影、中級 07 と同じ向き）。真上から見た図：x 右、y 上（＝奥）、z は手前 ⊙。
// 三段の図の数値（形だけ）：𝐀＝(0,0,1.3)、𝐁＝(1.2,0.2,0.9)、𝐂＝(−0.2,1.0,0.5)。影 (1.2,0.2)、(−0.2,1.0)、和 (1.0,1.2)。
//   90° 反時計回り：(x,y)→(−y,x)。(−0.2,1.2)、(−1.0,−0.2)、和 (−1.2,1.0)。A 倍＝1.3 倍。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,poly} from './anim.mjs';

const K='um-cross-1:';
const CA=C.x,CB=C.F,CC=C.v,CS=C.hi,CT=C.E,CN=C.p,NG=C.a,HX=C.x,HY=C.v,HZ=C.t;
const RAD=Math.PI/180;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
const TF=(s,x,y,maxW,size=40,o={})=>{const w=texWidth(s,size,false);return T(s,x,y,{size:w>maxW?size*maxW/w:size,...o});};
const L=(s,x,y,o={})=>label(s,x,y,{anchor:'middle',size:28,color:C.ink,...o});
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const bA=cs(CA,'\\mathbf{A}'),bB=cs(CB,'\\mathbf{B}'),bC=cs(CC,'\\mathbf{C}');
const hx=cs(HX,'\\hat{x}'),hy=cs(HY,'\\hat{y}'),hz=cs(HZ,'\\hat{z}');
const BpC=`(${bB}+${bC})`;
const check=(x,y,sz=16,color=C.F)=>draw([[x-sz,y],[x-sz*.3,y+sz*.7],[x+sz,y-sz*.8]],1,{color,w:5});

// ---- ⊙ / ⊗（中級 07 と同じ絵） ----
function outSym(x,y,r=22,color=CN,g=1){return fade(g,ring(x,y,r,{color,w:4,fill:'#1a1030'})+dot(x,y,r*.28,color));}
function arc2(pts,{c1=CA,c2=CB,w=5,g=1}={}){
 if(g<=0||pts.length<3)return '';
 const n=pts.length,h=Math.floor(n/2),[x1,y1]=pts[n-2],[x2,y2]=pts[n-1];
 const a=Math.atan2(y2-y1,x2-x1),Lh=16;
 const head=`<polygon points="${x2+Math.cos(a)*6},${y2+Math.sin(a)*6} ${x2-Lh*Math.cos(a)+Lh*.55*Math.sin(a)},${y2-Lh*Math.sin(a)-Lh*.55*Math.cos(a)} ${x2-Lh*Math.cos(a)-Lh*.55*Math.sin(a)},${y2-Lh*Math.sin(a)+Lh*.55*Math.cos(a)}" fill="${c2}"/>`;
 return fade(g,draw(pts.slice(0,h+1),1,{color:c1,w})+draw(pts.slice(h),1,{color:c2,w})+head);
}
const circPts=(cx,cy,r,a0,a1,n=40)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});

// ---- oblique 3D (x 右、y 奥＝斜め右上、z 上) ----
function view({ox,oy,u,ky=.7,ay=40*RAD}){return (x,y,z)=>[ox+u*(x+ky*Math.cos(ay)*y),oy-u*(z+ky*Math.sin(ay)*y)];}
const V3=(P,a,b,o={})=>{const A=P(...a),B=P(...b);return arrow(A[0],A[1],B[0],B[1],o);};
const L3=(P,a,b,o={})=>{const A=P(...a),B=P(...b);return line(A[0],A[1],B[0],B[1],o);};
function axes3(P,{xl=1.9,yl=2.2,zl=1.75,g=1,xn=.45,yn=.45,zn=.2}={}){
 let s=L3(P,[-xn,0,0],[0,0,0],{color:C.faint,w:2,dash:'5 6'})+L3(P,[0,-yn,0],[0,0,0],{color:C.faint,w:2,dash:'5 6'})+L3(P,[0,0,-zn],[0,0,0],{color:C.faint,w:2,dash:'5 6'});
 s+=V3(P,[0,0,0],[xl,0,0],{color:C.dim,w:2.5,head:13})+V3(P,[0,0,0],[0,yl,0],{color:C.dim,w:2.5,head:13})+V3(P,[0,0,0],[0,0,zl],{color:C.dim,w:2.5,head:13});
 const X=P(xl,0,0),Y=P(0,yl,0),Z=P(0,0,zl);
 s+=label('x（右）',X[0]+10,X[1]+8,{size:24,color:HX,weight:700})+label('y（奥）',Y[0]+10,Y[1]-2,{size:24,color:HY,weight:700})+label('z（上）',Z[0]+14,Z[1]+10,{size:24,color:HZ,weight:700});
 return fade(g,s);
}
function floor(P,{x0=-1,x1=1.8,y0=-.6,y1=2,g=1}={}){return fade(g,poly([P(x0,y0,0),P(x1,y0,0),P(x1,y1,0),P(x0,y1,0)],{fill:'#1a2a48',fo:.55,stroke:C.grid,sw:2}));}

// ---- the three-step scene in 3D ----
const P3=view({ox:240,oy:410,u:150,ky:.6,ay:50*RAD});
const Av=[0,0,1.3],Bv=[1.3,.9,.6],Cv=[-.6,.6,.6],BC=[.7,1.5,1.2];
const rot=([x,y],a)=>[x*Math.cos(a)-y*Math.sin(a),x*Math.sin(a)+y*Math.cos(a)];
function scene3({gB=1,gA=1,drop=0,shadow=0,theta=0,hgt=0,turn=0,scl=0,res=0,gC=0,dropC=0,shadowC=0,sum=0,labRes=''}={}){
 let s=floor(P3)+axes3(P3);
 // shadows on the floor
 if(shadow>0){s+=V3(P3,[0,0,0],[Bv[0]*shadow,Bv[1]*shadow,0],{color:CB,w:6,head:18,opacity:.75});}
 if(shadowC>0){s+=fade(shadowC,V3(P3,[Bv[0],Bv[1],0],[Bv[0]+Cv[0],Bv[1]+Cv[1],0],{color:CC,w:6,head:18,opacity:.75})+V3(P3,[0,0,0],[BC[0],BC[1],0],{color:CS,w:6,head:18,opacity:.75}));}
 if(hgt>0){const m=P3(Bv[0]/2,Bv[1]/2,0);s+=fade(hgt,label('B sinθ',m[0]+6,m[1]+36,{size:26,color:CB,weight:700}));}
 // rotated (and scaled) shadow
 if(turn>0){const a=turn*Math.PI/2,k=1+.3*scl,[x,y]=rot([Bv[0],Bv[1]],a);
  s+=V3(P3,[0,0,0],[x*k,y*k,0],{color:res>0?CN:CB,w:7,head:20});
  const pts=Array.from({length:25},(_,i)=>{const t=Math.atan2(Bv[1],Bv[0])+a*i/24;return P3(.55*Math.cos(t),.55*Math.sin(t),0);});
  s+=fade(1-res,arc2(pts,{c1:CB,c2:CN,w:4}));
  if(labRes){const E=P3(x*k,y*k,0);s+=fade(res,T(labRes,E[0]-14,E[1]-8,{size:32,anchor:'end'}));}}
 // A
 s+=V3(P3,[0,0,0],Av,{color:CA,w:7,head:20,g:gA})+fade(gA,T(bA,P3(...Av)[0]-22,P3(...Av)[1]+18,{size:38,anchor:'end'}));
 // B and its drop line
 if(drop>0)s+=fade(drop,L3(P3,Bv,[Bv[0],Bv[1],0],{color:C.dim,w:2.5,dash:'6 6'}));
 if(theta>0){const u=[Bv[0],Bv[1],0].map(v=>v/Math.hypot(Bv[0],Bv[1])),th=Math.acos(Bv[2]/Math.hypot(...Bv));
  const pts=Array.from({length:21},(_,i)=>{const t=th*i/20;return P3(.42*Math.sin(t)*u[0],.42*Math.sin(t)*u[1],.42*Math.cos(t));});
  s+=fade(theta,draw(pts,1,{color:CT,w:3.5})+label('θ',P3(.3*u[0],.3*u[1],.62)[0]+4,P3(.3*u[0],.3*u[1],.62)[1],{size:26,color:CT,weight:700}));}
 s+=V3(P3,[0,0,0],Bv,{color:CB,w:7,head:20,g:gB})+fade(gB,T(bB,P3(...Bv)[0]+14,P3(...Bv)[1]+4,{size:38,anchor:'start'}));
 if(gC>0){s+=fade(gC,V3(P3,Bv,[Bv[0]+Cv[0],Bv[1]+Cv[1],Bv[2]+Cv[2]],{color:CC,w:7,head:20})+T(bC,P3(...BC)[0]+18,P3(...BC)[1]+30,{size:38,anchor:'start'}));}
 if(sum>0){s+=fade(sum,V3(P3,[0,0,0],BC,{color:CS,w:6,head:18})+T(BpC,P3(...BC)[0]-16,P3(...BC)[1]-4,{size:32,anchor:'end'}));}
 if(dropC>0)s+=fade(dropC,L3(P3,BC,[BC[0],BC[1],0],{color:C.dim,w:2.5,dash:'6 6'}));
 return s;
}
// light from above (little rays)
function rays(g=1){let s='';for(const x of [1.65,1.9]){const A=P3(x,.9,1.6),B=P3(x,.9,1.15);s+=arrow(A[0],A[1],B[0],B[1],{color:CS,w:3,head:10,opacity:.8});}
 return fade(g,s+label('光',P3(1.78,.9,1.7)[0],P3(1.78,.9,1.7)[1]-6,{size:24,color:CS,anchor:'middle'}));}

// ---- top view (looking down along A): x right, y up ----
const TV={ox:380,oy:410,u:140};
const TX=x=>TV.ox+TV.u*x,TY=y=>TV.oy-TV.u*y;
function topAxes(g=1){
 let s=line(TX(-1.75),TY(0),TX(1.5),TY(0),{color:C.faint,w:2,dash:'5 6'})+line(TX(0),TY(-.5),TX(0),TY(1.65),{color:C.faint,w:2,dash:'5 6'});
 s+=label('x（右）',TX(1.5)-4,TY(0)+30,{size:24,color:HX,weight:700,anchor:'end'})+label('y（奥）',TX(0)+12,TY(1.6)+4,{size:24,color:HY,weight:700});
 s+=outSym(TX(0),TY(0),17,CA)+T(bA,TX(0)+30,TY(0)+44,{size:32});
 return fade(g,s);
}
const v2=(a,b,color,o={})=>arrow(TX(a[0]),TY(a[1]),TX(b[0]),TY(b[1]),{color,w:6,head:18,...o});
function triTop({ang=0,k=1,g=1,op=1,labs=0,lab=[]}={}){
 const P1=rot([Bv[0],Bv[1]],ang).map(v=>v*k),P2=rot([BC[0],BC[1]],ang).map(v=>v*k);
 let s=v2([0,0],P1,CB,{opacity:op})+v2(P1,P2,CC,{opacity:op})+v2([0,0],P2,CS,{opacity:op});
 if(labs){const [l1,l2,l3]=lab,G=[(P1[0]+P2[0])/3,(P1[1]+P2[1])/3];
  const put=(a,b,t,d=.2)=>{const m=[(a[0]+b[0])/2,(a[1]+b[1])/2];let dx=m[0]-G[0],dy=m[1]-G[1];const r=Math.hypot(dx,dy)||1;dx/=r;dy/=r;
   const o=Math.abs(dx)<.3?60:40,an=Math.abs(dx)<.3?'middle':dx>0?'start':'end',x=TX(m[0])+dx*o,y=TY(m[1])-dy*o+12,w=texWidth(t,28,false),x0=an==='middle'?x-w/2:an==='start'?x:x-w;
   return rect(x0-6,y-30,w+12,40,{fill:C.bg,fo:.85,stroke:'none',rx:6})+T(t,x,y,{size:28,anchor:an});};
  s+=put([0,0],P1,l1)+put(P1,P2,l2)+put([0,0],P2,l3);}
 return fade(g,s);
}
const sh=c=>`${c}_{\\perp}`;

// ---- small 1-D shadow picture (inner product) ----
function dotShadow(ox,oy,{u=120,g=1,lab=1}={}){
 const b=[1.3,.9],c=[.9,.7],A=2.6;
 const X=v=>ox+u*v,Y=v=>oy-u*v;
 let s=line(X(-.2),Y(0),X(2.9),Y(0),{color:C.faint,w:2})+arrow(X(0),Y(0),X(A),Y(0),{color:CA,w:5,head:16,opacity:.55});
 s+=arrow(X(0),Y(0),X(b[0]),Y(b[1]),{color:CB,w:6,head:18})+arrow(X(b[0]),Y(b[1]),X(b[0]+c[0]),Y(b[1]+c[1]),{color:CC,w:6,head:18});
 s+=line(X(b[0]),Y(b[1]),X(b[0]),Y(0),{color:C.dim,w:2,dash:'5 6'})+line(X(b[0]+c[0]),Y(b[1]+c[1]),X(b[0]+c[0]),Y(0),{color:C.dim,w:2,dash:'5 6'});
 s+=line(X(0),Y(0)+10,X(b[0]),Y(0)+10,{color:CB,w:7})+line(X(b[0]),Y(0)+10,X(b[0]+c[0]),Y(0)+10,{color:CC,w:7});
 if(lab)s+=T(bA,X(A)+20,Y(0)+12,{size:32,anchor:'start'})+T(bB,X(b[0]/2)-12,Y(b[1]/2)-8,{size:32,anchor:'end'})+T(bC,X(b[0]+c[0]/2)-12,Y(b[1]+c[1]/2)-10,{size:32,anchor:'end'})
  +label('影',X(b[0]/2),Y(0)+44,{size:24,color:CB,anchor:'middle'})+label('影',X(b[0]+c[0]/2),Y(0)+44,{size:24,color:CC,anchor:'middle'});
 return fade(g,s);
}

// ---- tables (中級 07 と同じ見た目) ----
const HT={x:hx,y:hy,z:hz},HC={x:HX,y:HY,z:HZ};
const TAB={x:{x:'0',y:hz,z:`-${hz}`},y:{x:`-${hz}`,y:'0',z:hx},z:{x:hy,y:`-${hx}`,z:'0'}};
function table3(x0,y0,{cw=120,rh=70,g=1,hlDiag=0,dotTab=0,title=''}={}){
 let s=title?label(title,x0+cw*2,y0-58,{size:26,color:dotTab?C.F:CN,anchor:'middle',weight:700}):'';
 const ks=['x','y','z'];
 s+=T(dotTab?'\\cdot':'\\times',x0+cw*.5,y0+10,{size:32,color:C.dim});
 ks.forEach((k,j)=>{s+=T(HT[k],x0+cw*(j+1.5),y0+10,{size:34});s+=T(HT[k],x0+cw*.5,y0+rh*(j+1)+10,{size:34});});
 s+=line(x0,y0+rh*.5,x0+cw*4,y0+rh*.5,{color:C.faint,w:2})+line(x0+cw,y0-rh*.5,x0+cw,y0+rh*3.5,{color:C.faint,w:2});
 ks.forEach((r,i)=>ks.forEach((c,j)=>{const cx=x0+cw*(j+1.5),cy=y0+rh*(i+1)+10;
  const v=dotTab?(r===c?'1':'0'):TAB[r][c];const diag=r===c;
  s+=(diag&&hlDiag?fade(hlDiag,rect(cx-cw/2+6,cy-rh/2-6,cw-12,rh-8,{fill:dotTab?C.F:NG,fo:.15,stroke:dotTab?C.F:NG,sw:2,rx:8})):'')+T(v,cx,cy,{size:32,color:v==='0'?(dotTab?C.dim:NG):C.ink});}));
 return fade(g,s);
}
function cycle(cx,cy,{R=95,g=1}={}){
 const pos={x:90,y:-30,z:210};let s='';
 for(const [a,b] of [['x','y'],['y','z'],['z','x']]){let a0=pos[a]*RAD,a1=pos[b]*RAD;if(a1>a0)a1-=2*Math.PI;
  s+=arc2(circPts(cx,cy,R,a0-.33,a1+.33,24),{c1:C.hi,c2:C.hi,w:4});}
 for(const k of ['x','y','z']){const a=pos[k]*RAD,x=cx+R*Math.cos(a),y=cy-R*Math.sin(a);s+=ring(x,y,28,{color:HC[k],w:3,fill:'#131f38'})+T(HT[k],x,y+10,{size:34});}
 s+=label('＋',cx,cy+14,{size:44,color:C.hi,anchor:'middle',weight:700});
 return fade(g,s);
}

// ---- 9-term grid ----
const AC=k=>cs(CA,`A_${k}`),BCc=k=>cs(CB,`B_${k}`);
function grid9({x0=80,y0=150,cw=320,rh=82,mode=0,g=1,zero=0,hl=[],dim=0}={}){
 const ks=['x','y','z'];let s='';
 ks.forEach((k,j)=>{s+=T(`${BCc(k)}${HT[k]}`,x0+90+cw*(j+.5),y0+10,{size:32});});
 ks.forEach((k,i)=>{s+=T(`${AC(k)}${HT[k]}`,x0+45,y0+rh*(i+1)+10,{size:32});});
 s+=line(x0,y0+rh*.5,x0+90+cw*3,y0+rh*.5,{color:C.faint,w:2})+line(x0+90,y0-rh*.4,x0+90,y0+rh*3.5,{color:C.faint,w:2});
 ks.forEach((r,i)=>ks.forEach((c,j)=>{const cx=x0+90+cw*(j+.5),cy=y0+rh*(i+1)+10,diag=r===c;
  const on=hl.includes(r+c);
  if(on)s+=rect(cx-cw/2+8,cy-rh/2-8,cw-16,rh-8,{fill:CN,fo:.15,stroke:CN,sw:2.5,rx:8});
  const raw=`${AC(r)}${BCc(c)}\\,(${HT[r]}\\times${HT[c]})`;
  let res=diag?'0':(TAB[r][c].startsWith('-')?`-${AC(r)}${BCc(c)}\\,${TAB[r][c].slice(1)}`:`+${AC(r)}${BCc(c)}\\,${TAB[r][c]}`);
  const op=dim&&!on&&!diag?.35:1;
  if(diag){s+=fade(1-zero,T(raw,cx,cy,{size:32,opacity:op}))+fade(zero,T('0',cx,cy,{size:34,color:NG})+rect(cx-cw/2+8,cy-rh/2-8,cw-16,rh-8,{fill:NG,fo:.1,stroke:NG,sw:2,rx:8}));}
  else s+=T(mode?res:raw,cx,cy,{size:32,opacity:op});
 }));
 return fade(g,s);
}
const FX=`${AC('y')}${BCc('z')}-${AC('z')}${BCc('y')}`,FY=`${AC('z')}${BCc('x')}-${AC('x')}${BCc('z')}`,FZ=`${AC('x')}${BCc('y')}-${AC('y')}${BCc('x')}`;
const AxB=`${bA}\\times${bB}`;

// ---- numeric example ----
const nA=cs(CA,'(1,\\,2,\\,3)'),nB=cs(CB,'(4,\\,5,\\,6)');
const n=(c,v)=>cs(c,v);
const RES=cs(CN,'(-3,\\,6,\\,-3)');
const PN=view({ox:300,oy:330,u:33,ky:.6,ay:35*RAD});

export const ytUmCross1Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  let s=label('前回：内積・上級',40,50,{size:24,color:C.dim});
  s+=card(150,90,900,330,L('前回の最後の問い',600,145,{size:26,color:C.dim})
   +T(`${bA}\\times${BpC}\\ \\overset{?}{=}\\ ${bA}\\times${bB}+${bA}\\times${bC}`,600,235,{size:48})
   +fade(seg(p,.3,.45),L('外積の 分配法則は どう示す？',600,320,{size:32,color:C.hi,weight:700}))
   +fade(seg(p,.55,.7),L('成分の式は どうなる？',600,380,{size:32,color:C.hi,weight:700})),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'dotrecap']:(p)=>{
  let s=dotShadow(90,400,{u:130,g:seg(p,0,.2)});
  s+=card(640,90,520,330,L('内積：影を 足す',900,145,{size:28,color:C.dim})
   +fade(seg(p,.25,.45),L('影は 一本の直線の上',900,215,{size:28,color:C.ink}))
   +fade(seg(p,.25,.45),L('→ 継ぎ足すと 長さが足される',900,265,{size:26,color:C.ink}))
   +fade(seg(p,.6,.8),TF(`${bA}\\cdot${BpC}=${bA}\\cdot${bB}+${bA}\\cdot${bC}`,900,350,480,38)),seg(p,.05,.2));
  return s;
 },
 [K+'table']:(p)=>{
  let s=label('中級：基本の3方向の表',40,50,{size:24,color:C.dim});
  s+=table3(120,140,{g:seg(p,0,.2),hlDiag:seg(p,.7,.85),title:'外積の表（左 × 上）'});
  s+=cycle(900,250,{R:100,g:seg(p,.3,.5)});
  s+=fade(seg(p,.4,.55),L('順に回る → ＋，逆 → −',900,420,{size:26,color:C.hi,weight:700}));
  s+=fade(seg(p,.7,.85),L('同じ向きどうし → 0',900,470,{size:26,color:NG,weight:700}));
  return s;
 },
 [K+'promise']:(p)=>{
  let s=table3(120,140,{hlDiag:1,title:'外積の表（左 × 上）'});
  s+=card(650,100,500,320,L('かっこの 展開',900,155,{size:28,color:C.dim})
   +TF(`${bA}\\times${BpC}`,900,225,460,40)+TF(`=${bA}\\times${bB}+${bA}\\times${bC}`,900,290,460,40)
   +fade(seg(p,.35,.55),rect(720,330,360,60,{fill:CT,fo:.12,stroke:CT,sw:2.5,rx:10})+L('中級：上級で 確かめる',900,370,{size:28,color:CT,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'hard']:(p)=>{
  let s=dotShadow(60,390,{u:100,lab:0});
  s+=L('内積：影は 直線の上',220,140,{size:26,color:C.dim});
  const P=view({ox:760,oy:380,u:120});
  s+=fade(seg(p,.05,.25),floor(P,{x0:-.3,x1:2,y0:-.3,y1:1.6})+V3(P,[0,0,0],[1.7,0,0],{color:CA,w:6,head:18})+V3(P,[0,0,0],[.6,1.3,0],{color:CB,w:6,head:18})
   +T(bA,P(1.7,0,0)[0]+16,P(1.7,0,0)[1]+12,{size:32,anchor:'start'})+T(bB,P(.6,1.3,0)[0]+14,P(.6,1.3,0)[1],{size:32,anchor:'start'}));
  s+=V3(P,[0,0,0],[0,0,1.9],{color:CN,w:8,head:22,g:seg(p,.15,.35)})+fade(seg(p,.3,.45),T(AxB,P(0,0,1.9)[0]-16,P(0,0,1.9)[1]+20,{size:32,anchor:'end'}));
  s+=fade(seg(p,.3,.45),L('外積：答えは 垂直な矢印',860,90,{size:28,color:CN,weight:700}));
  s+=fade(seg(p,.6,.75),L('影の 足し算は そのままでは 使えない',600,480,{size:28,color:NG,weight:700}));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=card(150,90,900,330,T(`${bA}\\times${BpC}`,600,180,{size:50})
   +T(`${bA}\\times${bB}+${bA}\\times${bC}`,600,270,{size:50})
   +L('いつも 同じ矢印？',600,355,{size:34,color:C.hi,weight:700})+fade(seg(p,.4,.6),L('予想してみよう',600,400,{size:24,color:C.dim})),seg(p,.05,.2),C.hi);
  return s;
 },

 // ===== S2 外積を三段で作る =====
 [K+'setup']:(p)=>{
  let s=scene3({gA:seg(p,.1,.3),gB:seg(p,.55,.75)});
  s+=card(680,110,470,250,L('軸の向き',915,165,{size:26,color:C.dim})
   +L('x 右，y 奥，z 上',915,225,{size:30,color:C.ink,weight:700})
   +fade(seg(p,.1,.3),label('𝐀',780,295,{size:30,color:CA,weight:700})+label('：z 軸に沿って 上向き',806,295,{size:26}))
   +fade(seg(p,.55,.75),label('𝐁',780,340,{size:30,color:CB,weight:700})+label('：斜め',806,340,{size:26})),seg(p,0,.15));
  return s;
 },
 [K+'shadow']:(p)=>{
  let s=scene3({drop:seg(p,.15,.35),shadow:seg(p,.3,.55)})+rays(seg(p,.05,.2));
  s+=card(680,90,470,320,L('一段目：影を 取る',915,145,{size:30,color:CB,weight:700})
   +L('真上（𝐀 の向き）から 光',915,210,{size:26})
   +fade(seg(p,.6,.75),L('影 ＝ 𝐁 のうち',915,285,{size:28,color:CB,weight:700})+L('𝐀 に 直角な部分',915,330,{size:28,color:CB,weight:700}))
   +fade(seg(p,.6,.75),T(sh(bB),915,385,{size:34})),seg(p,0,.12),CB);
  return s;
 },
 [K+'height']:(p)=>{
  let s=scene3({drop:1,shadow:1,theta:seg(p,.05,.25),hgt:seg(p,.35,.55)});
  s+=card(680,110,470,280,L('影の 長さ',915,165,{size:28,color:C.dim})
   +fade(seg(p,.35,.55),T(`|${sh(bB)}|=B\\sin{\\color{${CT}}\\theta}`,915,240,{size:42}))
   +fade(seg(p,.65,.8),L('＝ 平行四辺形の 高さ',915,330,{size:28,color:CS,weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'rotate']:(p)=>{
  let s=scene3({drop:1,shadow:1,turn:seg(p,.1,.45)});
  // inset: from above
  const cx=915,cy=270;
  let t=rect(cx-150,cy-170,300,300,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:14})+L('真上から 見ると',cx,cy-138,{size:22,color:C.dim});
  const o=[cx,cy+20],u=100,a0=Math.atan2(Bv[1],Bv[0]),a=a0+Math.PI/2*seg(p,.1,.45);
  t+=arrow(o[0],o[1],o[0]+u*Math.cos(a0),o[1]-u*Math.sin(a0),{color:CB,w:5,head:15,opacity:.6});
  t+=arrow(o[0],o[1],o[0]+u*Math.cos(a),o[1]-u*Math.sin(a),{color:CB,w:5,head:15});
  t+=arc2(circPts(o[0],o[1],50,a0,a,24),{c1:CB,c2:CN,w:4,g:seg(p,.12,.2)});
  t+=outSym(o[0],o[1],15,CA)+T(bA,o[0]-26,o[1]+40,{size:28});
  t+=fade(seg(p,.4,.55),L('反時計回りに 90°',cx,cy+110,{size:24,color:CN,weight:700}));
  s+=fade(seg(p,0,.12),t);
  s+=fade(seg(p,.6,.75),L('右ねじなら 𝐀 の向きへ進む',915,470,{size:26,color:C.hi,weight:700}));
  s+=fade(seg(p,0,.12),L('二段目：90° 回す',915,50,{size:30,color:CN,weight:700}));
  return s;
 },
 [K+'scale']:(p)=>{
  let s=scene3({drop:1,shadow:.6,turn:1,scl:seg(p,.1,.45)});
  s+=card(680,110,470,260,L('三段目：A 倍',915,165,{size:30,color:CN,weight:700})
   +L('回した 矢印の長さ × A',915,235,{size:28})
   +fade(seg(p,.55,.7),L('A ＝ 𝐀 の長さ',915,305,{size:26,color:CA})),seg(p,0,.12),CN);
  return s;
 },
 [K+'mag']:(p)=>{
  let s=scene3({drop:1,shadow:.6,turn:1,scl:1,res:seg(p,.05,.25),labRes:AxB});
  s+=card(680,90,470,320,L('できた 矢印の 長さ',915,145,{size:28,color:C.dim})
   +T(`A\\times B\\sin{\\color{${CT}}\\theta}`,915,220,{size:44})
   +fade(seg(p,.35,.5),L('＝ 底辺 A × 高さ B sinθ',915,290,{size:26,color:CS}))
   +fade(seg(p,.55,.7),L('＝ 外積の 大きさ',915,350,{size:30,color:C.F,weight:700})+check(1090,345)),seg(p,0,.12));
  return s;
 },
 [K+'dir']:(p)=>{
  let s=scene3({drop:1,shadow:.6,turn:1,scl:1,res:1,labRes:AxB});
  s+=card(680,90,470,330,L('向き',915,140,{size:28,color:C.dim})
   +fade(seg(p,.05,.2),L('床の上 → 𝐀 に 垂直',915,200,{size:28}))
   +fade(seg(p,.35,.5),L('影 𝐁⊥ にも 垂直',915,255,{size:28}))
   +fade(seg(p,.55,.7),T(`${bB}=${cs(CB,'\\mathbf{B}_{\\parallel}')}+${sh(bB)}`,915,320,{size:36}))
   +fade(seg(p,.75,.9),L('→ 𝐁 にも 垂直',915,385,{size:30,color:C.F,weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'check']:(p)=>{
  const cx=330,cy=290,u=130;
  let s=L('真上から 見た 床',cx,70,{size:24,color:C.dim});
  s+=line(cx-170,cy,cx+190,cy,{color:C.faint,w:2,dash:'5 6'})+line(cx,cy+90,cx,cy-190,{color:C.faint,w:2,dash:'5 6'});
  s+=label('x（右）',cx+200,cy-14,{size:24,color:HX,weight:700,anchor:'end'})+label('y（奥）',cx+12,cy-170,{size:24,color:HY,weight:700});
  s+=outSym(cx,cy,17,HZ)+T(hz,cx-34,cy-16,{size:32});
  s+=arrow(cx,cy,cx+u,cy,{color:HX,w:7,head:20})+T(hx,cx+u*.6,cy+40,{size:34});
  const a=Math.PI/2*seg(p,.25,.55);
  s+=fade(seg(p,.25,.3),arrow(cx,cy,cx+u*Math.cos(a),cy-u*Math.sin(a),{color:CN,w:7,head:20}));
  s+=arc2(circPts(cx,cy,60,0,a,24),{c1:HX,c2:CN,w:4,g:seg(p,.25,.3)});
  s+=fade(seg(p,.5,.6),T(hy,cx-30,cy-u+20,{size:34}));
  s+=card(660,100,490,320,TF(`${bA}=${hz},\\quad ${bB}=${hx}`,905,165,450,40)
   +fade(seg(p,.25,.5),L('xハット を 反時計回りに 90°',905,235,{size:26}))
   +fade(seg(p,.5,.65),T(`\\to\\ ${hy}`,905,295,{size:42}))
   +fade(seg(p,.7,.85),L('中級の表：',830,375,{size:26,color:C.dim})+T(`${hz}\\times${hx}=${hy}`,985,375,{size:34})+check(1110,368)),seg(p,0,.12));
  return s;
 },
 [K+'three']:(p)=>{
  const xs=[200,600,1000],ts=['① 影を取る','② 90° 回す','③ A 倍する'],cl=[CB,CN,CN],ds=['𝐀 に直角な部分','𝐀 の周りに 右ねじの向き','長さ A × B sinθ'];
  let s='';
  xs.forEach((x,i)=>{s+=card(x-170,110,340,200,L(ts[i],x,180,{size:32,color:cl[i],weight:700})+L(ds[i],x,250,{size:24,color:C.ink}),seg(p,.05+i*.12,.17+i*.12),cl[i]);
   if(i<2)s+=fade(seg(p,.17+i*.12,.25+i*.12),arrow(x+175,210,x+225,210,{color:C.dim,w:4,head:14}));});
  s+=fade(seg(p,.55,.7),T(`=\\ ${AxB}`,600,390,{size:52})+L('どの 𝐁 にも 同じ三段',600,470,{size:28,color:C.hi,weight:700}));
  return s;
 },

 // ===== S3 三段は継ぎ足しを保つ =====
 [K+'addc']:(p)=>{
  let s=scene3({gC:seg(p,.1,.3),sum:seg(p,.3,.5)});
  s+=card(680,110,470,260,L('𝐁 の先に 𝐂 を 継ぎ足す',915,170,{size:28,color:C.ink,weight:700})
   +fade(seg(p,.3,.5),T(`${bB}+${bC}`,915,240,{size:42}))
   +fade(seg(p,.6,.75),L('三段で 継ぎ足しは 保たれる？',915,320,{size:26,color:C.hi,weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'proj']:(p)=>{
  let s=scene3({gC:1,sum:1,drop:seg(p,.05,.2),dropC:seg(p,.05,.2),shadow:seg(p,.15,.35),shadowC:seg(p,.25,.45)})+rays(seg(p,0,.12));
  s+=card(680,90,470,330,L('一段目：影',915,140,{size:30,color:CB,weight:700})
   +fade(seg(p,.25,.45),L('三角形の影も 三角形',915,205,{size:28}))
   +fade(seg(p,.55,.75),TF(`${BpC}_{\\perp}`,915,280,440,40)+TF(`=${sh(bB)}+${sh(bC)}`,915,345,440,40)),seg(p,0,.12),CB);
  return s;
 },
 [K+'top']:(p)=>{
  let s=topAxes(seg(p,0,.2))+triTop({g:seg(p,.15,.35),labs:1,lab:[sh(bB),sh(bC),`${BpC}_{\\perp}`]});
  s+=L('真上から 見た 床',330,60,{size:24,color:C.dim});
  s+=card(680,110,470,250,L('𝐀 は 見る人の方を 向く',915,175,{size:28})
   +fade(seg(p,.4,.6),outSym(915,255,22,CA)+label('手前向き',955,265,{size:28,color:CA,weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'rot']:(p)=>{
  const a=Math.PI/2*seg(p,.1,.5);
  let s=topAxes()+triTop({op:.4})+triTop({ang:a,labs:p>.5?1:0,lab:[`${sh(bB)}'`,`${sh(bC)}'`,`${BpC}_{\\perp}'`]});
  s+=arc2(circPts(TX(0),TY(0),70,Math.atan2(Bv[1],Bv[0]),Math.atan2(Bv[1],Bv[0])+a,20),{c1:CB,c2:CN,w:4,g:seg(p,.1,.15)});
  s+=card(680,110,470,260,L('二段目：まるごと 90°',915,170,{size:30,color:CN,weight:700})
   +fade(seg(p,.55,.7),L('形は 崩れない',915,240,{size:28}))
   +fade(seg(p,.7,.85),L('→ 継ぎ足しの まま',915,300,{size:28,color:C.F,weight:700})),seg(p,0,.12),CN);
  return s;
 },
 [K+'scl']:(p)=>{
  const k=1+.3*seg(p,.1,.45);
  let s=topAxes()+triTop({ang:Math.PI/2,op:.35})+triTop({ang:Math.PI/2,k});
  s+=card(680,110,470,260,L('三段目：全部 A 倍',915,170,{size:30,color:CN,weight:700})
   +fade(seg(p,.45,.6),L('形は 相似のまま',915,240,{size:28}))
   +fade(seg(p,.65,.8),L('→ 継ぎ足しの まま',915,300,{size:28,color:C.F,weight:700})),seg(p,0,.12),CN);
  return s;
 },
 [K+'result']:(p)=>{
  let s=topAxes()+triTop({ang:Math.PI/2,k:1.3,labs:1,lab:[AxB,`${bA}\\times${bC}`,`${bA}\\times${BpC}`]});
  s+=card(660,110,500,290,L('三段を 通しても 継ぎ足しのまま',910,165,{size:26,color:C.dim})
   +fade(seg(p,.35,.55),TF(`${bA}\\times${BpC}`,910,245,460,44)+TF(`=${bA}\\times${bB}+${bA}\\times${bC}`,910,320,460,44)),seg(p,0,.12),C.F);
  s+=fade(seg(p,.6,.75),highlight(675,200,470,160,1,C.F));
  return s;
 },
 [K+'left']:(p)=>{
  let s=T(`${BpC}\\times${bA}`,600,100,{size:48});
  s+=fade(seg(p,.1,.3),T(`=-\\,${bA}\\times${BpC}`,600,200,{size:48})+L('順序を 入れ替えると 符号が反転',600,250,{size:24,color:C.dim}));
  s+=fade(seg(p,.5,.7),T(`=-\\,${bA}\\times${bB}-${bA}\\times${bC}`,600,330,{size:48}));
  s+=fade(seg(p,.75,.9),T(`=${bB}\\times${bA}+${bC}\\times${bA}`,600,440,{size:52})+highlight(330,385,540,90,1));
  return s;
 },
 [K+'kmul']:(p)=>{
  const k=cs(C.hi,'k');
  let s=card(150,90,900,320,L('数の倍',600,145,{size:28,color:C.dim})
   +T(`${bA}\\times(${k}${bB})`,600,220,{size:48})
   +fade(seg(p,.1,.3),L('影も 回した矢印も k 倍',600,290,{size:28}))
   +fade(seg(p,.55,.75),T(`=${k}\\,(${AxB})`,600,370,{size:48})),seg(p,0,.12));
  return s;
 },

 // ===== S4 9項から6項へ =====
 [K+'write']:(p)=>{
  let s=T(`(${AC('x')}${hx}+${AC('y')}${hy}+${AC('z')}${hz})\\times(${BCc('x')}${hx}+${BCc('y')}${hy}+${BCc('z')}${hz})`,600,45,{size:36});
  s+=grid9({g:seg(p,.3,.6)});
  s+=fade(seg(p,.6,.75),L('3 × 3 ＝ 9 項',1100,470,{size:26,color:C.hi,weight:700}));
  return s;
 },
 [K+'zero']:(p)=>{
  let s=T(`${hx}\\times${hx}=0,\\quad ${hy}\\times${hy}=0,\\quad ${hz}\\times${hz}=0`,600,45,{size:36});
  s+=grid9({zero:seg(p,.15,.4)});
  s+=fade(seg(p,.6,.75),L('残り 6 項',1100,470,{size:26,color:C.hi,weight:700}));
  return s;
 },
 [K+'xdir']:(p)=>{
  let s=T(`${hy}\\times${hz}=${hx},\\qquad ${hz}\\times${hy}=-${hx}`,600,45,{size:36});
  s+=grid9({zero:1,mode:p>.3?1:0,hl:p>.2?['yz','zy']:[],dim:p>.2?1:0});
  return s;
 },
 [K+'xcomp']:(p)=>{
  let s=grid9({y0:100,cw:300,rh:66,zero:1,mode:1,hl:['yz','zy'],dim:1,x0:120});
  s+=fade(seg(p,.1,.3),T(`(${AxB})_x=${FX}`,600,420,{size:48}));
  s+=fade(seg(p,.5,.7),L('y と z の 組',600,485,{size:26,color:C.hi,weight:700}));
  return s;
 },
 [K+'yz']:(p)=>{
  const rows=[['x',FX,'（y と z）'],['y',FY,'（z と x）'],['z',FZ,'（x と y）']];
  let s=T(`${AxB}=`,600,60,{size:40});
  rows.forEach(([k,f,pr],i)=>{const y=150+i*105,g=i===0?1:seg(p,.1+(i-1)*.3,.3+(i-1)*.3);
   s+=fade(g,T(`${k}\\ \\text{}:`,250,y,{size:38,color:HC[k]})+T(f,600,y,{size:48})+L(pr,950,y,{size:28,color:C.hi}));});
  return s;
 },
 [K+'cyc']:(p)=>{
  let s=cycle(220,280,{R:105});
  const P=[['x','y','z'],['y','z','x'],['z','x','y']];
  const ga=seg(p,.2,.4),gb=seg(p,.45,.6);
  P.forEach(([k,a,b],i)=>{const y=150+i*105;
   const t1=`A_${a}B_${b}`,t2=`A_${b}B_${a}`;
   s+=T(`${k}:`,520,y,{size:38,color:HC[k]})+T(`{\\color{${ga>.5?C.hi:C.ink}}${t1}}-{\\color{${gb>.5?NG:C.ink}}${t2}}`,780,y,{size:48});
   s+=fade(ga,L(`${a} → ${b}`,1060,y+2,{size:26,color:C.hi}));});
  s+=fade(ga,L('順に回る組 ＋',700,480,{size:28,color:C.hi,weight:700}));
  s+=fade(gb,L('逆 −',900,480,{size:28,color:NG,weight:700}));
  return s;
 },
 [K+'contrast']:(p)=>{
  let s=table3(70,150,{cw:110,rh:66,hlDiag:1,dotTab:1,title:'内積の表'});
  s+=table3(650,150,{cw:110,rh:66,hlDiag:1,title:'外積の表'});
  s+=fade(seg(p,.1,.3),L('同じ向きの 3項 だけ 残る',290,470,{size:28,color:C.F,weight:700}));
  s+=fade(seg(p,.5,.7),L('3項が消え 6項が 答え',870,470,{size:28,color:NG,weight:700}));
  return s;
 },
 [K+'area']:(p)=>{
  const ox=180,oy=400,u=110,a=[2.2,.4],b=[.7,1.6];
  const X=v=>ox+u*v,Y=v=>oy-u*v;
  let s=L('真上から 見た 床',330,60,{size:24,color:C.dim});
  s+=line(X(-.4),Y(0),X(3.3),Y(0),{color:C.faint,w:2,dash:'5 6'})+line(X(0),Y(-.4),X(0),Y(2.6),{color:C.faint,w:2,dash:'5 6'});
  s+=label('x（右）',X(3.3),Y(0)+30,{size:24,color:HX,weight:700,anchor:'end'})+label('y（奥）',X(0)+12,Y(2.55),{size:24,color:HY,weight:700});
  s+=poly([[X(0),Y(0)],[X(a[0]),Y(a[1])],[X(a[0]+b[0]),Y(a[1]+b[1])],[X(b[0]),Y(b[1])]],{fill:CS,fo:.18,stroke:CS,sw:1.5});
  s+=arrow(X(0),Y(0),X(a[0]),Y(a[1]),{color:CA,w:6,head:18})+arrow(X(0),Y(0),X(b[0]),Y(b[1]),{color:CB,w:6,head:18});
  s+=T(bA,X(a[0])+18,Y(a[1])+12,{size:34,anchor:'start'})+T(bB,X(b[0])-12,Y(b[1])-4,{size:34,anchor:'end'});
  s+=fade(seg(p,.5,.65),outSym(X(1.45),Y(1),20,CN));
  s+=card(650,90,500,340,L('z 成分 だけ 残る',900,145,{size:28,color:C.dim})
   +T(`${AC('x')}${BCc('y')}-${AC('y')}${BCc('x')}`,900,220,{size:46})
   +fade(seg(p,.35,.5),L('大きさ ＝ 平行四辺形の 面積',900,290,{size:26,color:CS,weight:700}))
   +fade(seg(p,.5,.65),L('＋ → 上（手前 ⊙）',900,345,{size:26,color:CN})+L('− → 下（奥 ⊗）',900,395,{size:26,color:CN})),seg(p,0,.12));
  return s;
 },

 // ===== S5 数値で確かめる =====
 [K+'ex']:(p)=>{
  let s=card(80,90,420,180,TF(`${bA}=${nA}`,290,160,380,44)+TF(`${bB}=${nB}`,290,235,380,44),seg(p,0,.15));
  s+=fade(seg(p,.2,.4),T(`(${AxB})_x=${FX}`,800,130,{size:34})+T(`(${AxB})_y=${FY}`,800,215,{size:34})+T(`(${AxB})_z=${FZ}`,800,300,{size:34}));
  s+=fade(seg(p,.55,.7),L('どちらも 斜めの矢印',290,330,{size:26,color:C.dim}));
  return s;
 },
 [K+'cx']:(p)=>{
  let s=TF(`${bA}=${nA},\\quad ${bB}=${nB}`,600,50,900,36);
  s+=T(`x:`,170,160,{size:40,color:HX});
  s+=fade(seg(p,.05,.25),T(`${n(CA,2)}\\times${n(CB,6)}-${n(CA,3)}\\times${n(CB,5)}`,470,160,{size:46}));
  s+=fade(seg(p,.4,.6),T(`=12-15`,770,160,{size:46}));
  s+=fade(seg(p,.65,.85),T(`=-3`,985,160,{size:50,color:CN}));
  s+=fade(seg(p,.05,.25),L('（A の y）×（B の z）−（A の z）×（B の y）',470,225,{size:22,color:C.dim}));
  return s;
 },
 [K+'cy']:(p)=>{
  let s=TF(`${bA}=${nA},\\quad ${bB}=${nB}`,600,50,900,36);
  s+=T(`x:`,170,160,{size:40,color:HX})+T(`${n(CA,2)}\\times${n(CB,6)}-${n(CA,3)}\\times${n(CB,5)}=12-15`,560,160,{size:40})+T(`=-3`,985,160,{size:44,color:CN});
  s+=T(`y:`,170,280,{size:40,color:HY});
  s+=fade(seg(p,.05,.25),T(`${n(CA,3)}\\times${n(CB,4)}-${n(CA,1)}\\times${n(CB,6)}`,470,280,{size:46}));
  s+=fade(seg(p,.4,.6),T(`=12-6`,770,280,{size:46}));
  s+=fade(seg(p,.65,.85),T(`=6`,985,280,{size:50,color:CN}));
  s+=fade(seg(p,.05,.25),L('（A の z）×（B の x）−（A の x）×（B の z）',470,345,{size:22,color:C.dim}));
  return s;
 },
 [K+'cz']:(p)=>{
  let s=TF(`${bA}=${nA},\\quad ${bB}=${nB}`,600,50,900,36);
  s+=T(`x:`,170,130,{size:38,color:HX})+T(`${n(CA,2)}\\times${n(CB,6)}-${n(CA,3)}\\times${n(CB,5)}=12-15`,560,130,{size:38})+T(`=-3`,985,130,{size:42,color:CN});
  s+=T(`y:`,170,215,{size:38,color:HY})+T(`${n(CA,3)}\\times${n(CB,4)}-${n(CA,1)}\\times${n(CB,6)}=12-6`,560,215,{size:38})+T(`=6`,985,215,{size:42,color:CN});
  s+=T(`z:`,170,300,{size:38,color:HZ});
  s+=fade(seg(p,.05,.2),T(`${n(CA,1)}\\times${n(CB,5)}-${n(CA,2)}\\times${n(CB,4)}=5-8`,560,300,{size:38}));
  s+=fade(seg(p,.25,.4),T(`=-3`,985,300,{size:42,color:CN}));
  s+=fade(seg(p,.55,.7),T(`${AxB}=${RES}`,600,410,{size:50})+highlight(350,365,500,90,1,CN));
  return s;
 },
 [K+'pq']:(p)=>{
  const P=PN,Av3=[1,2,3],Bv3=[4,5,6],Rv=[-3,6,-3];
  let s=fade(1,poly([P(-4,-1,0),P(5,-1,0),P(5,7,0),P(-4,7,0)],{fill:'#1a2a48',fo:.45,stroke:C.grid,sw:2}));
  s+=V3(P,[0,0,0],[5.5,0,0],{color:C.dim,w:2,head:12})+V3(P,[0,0,0],[0,7.5,0],{color:C.dim,w:2,head:12})+V3(P,[0,0,0],[0,0,7],{color:C.dim,w:2,head:12});
  s+=label('x（右）',P(5.5,0,0)[0]+6,P(5.5,0,0)[1]+26,{size:22,color:HX,weight:700})+label('y（奥）',P(0,7.5,0)[0]+8,P(0,7.5,0)[1],{size:22,color:HY,weight:700})+label('z（上）',P(0,0,7)[0]+10,P(0,0,7)[1]+8,{size:22,color:HZ,weight:700});
  s+=V3(P,[0,0,0],Av3,{color:CA,w:6,head:18})+V3(P,[0,0,0],Bv3,{color:CB,w:6,head:18})+V3(P,[0,0,0],Rv,{color:CN,w:7,head:20});
  s+=T(bA,P(...Av3)[0]-10,P(...Av3)[1]-6,{size:30,anchor:'end'})+T(bB,P(...Bv3)[0]+12,P(...Bv3)[1]+6,{size:30,anchor:'start'})+T(AxB,P(...Rv)[0]-10,P(...Rv)[1]+30,{size:28,anchor:'end'});
  s+=card(650,100,500,300,L('本当に 両方に 垂直？',900,165,{size:32,color:C.hi,weight:700})
   +L('図では 直角か 分かりにくい',900,235,{size:26,color:C.dim})
   +fade(seg(p,.45,.6),L('→ 内積で 確かめる',900,300,{size:30,color:C.F,weight:700})),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'perp']:(p)=>{
  let s=T(`${AxB}=${RES}`,600,60,{size:40});
  s+=fade(seg(p,.05,.3),T(`${bA}\\cdot(${AxB})=1(-3)+2(6)+3(-3)`,520,175,{size:42}));
  s+=fade(seg(p,.2,.4),T(`=-3+12-9=0`,520,240,{size:42})+check(830,232));
  s+=fade(seg(p,.45,.65),T(`${bB}\\cdot(${AxB})=4(-3)+5(6)+6(-3)`,520,335,{size:42}));
  s+=fade(seg(p,.6,.75),T(`=-12+30-18=0`,520,400,{size:42})+check(840,392));
  s+=fade(seg(p,.8,.92),L('両方に 垂直',1030,300,{size:32,color:C.F,weight:700}));
  return s;
 },
 [K+'mag1']:(p)=>{
  let s=T(`${AxB}=${RES}`,600,70,{size:40});
  s+=fade(seg(p,.2,.4),L('長さの 2乗',600,170,{size:28,color:C.dim}));
  s+=fade(seg(p,.3,.6),T(`|${AxB}|^2=(-3)^2+6^2+(-3)^2`,600,260,{size:46}));
  s+=fade(seg(p,.6,.8),T(`=9+36+9=54`,600,360,{size:50,color:CN}));
  return s;
 },
 [K+'mag2']:(p)=>{
  let s=T(`|${AxB}|^2=54`,600,55,{size:38,color:C.ink});
  s+=fade(seg(p,.02,.2),T(`A^2B^2-(${bA}\\cdot${bB})^2`,600,140,{size:44}));
  s+=fade(seg(p,.15,.35),L('A² ＝ 1＋4＋9 ＝ 14，B² ＝ 16＋25＋36 ＝ 77，𝐀·𝐁 ＝ 4＋10＋18 ＝ 32',600,210,{size:24,color:C.dim}));
  s+=fade(seg(p,.3,.5),T(`=14\\times77-32^2`,600,290,{size:44}));
  s+=fade(seg(p,.5,.7),T(`=1078-1024=54`,600,380,{size:48,color:CN})+check(870,372));
  s+=fade(seg(p,.75,.9),L('一致',1000,385,{size:32,color:C.F,weight:700}));
  return s;
 },
 [K+'why']:(p)=>{
  let s=T(`A^2B^2-(${bA}\\cdot${bB})^2=A^2B^2-(AB\\cos\\theta)^2`,600,90,{size:42});
  s+=fade(seg(p,.2,.4),T(`=A^2B^2(1-\\cos^2\\theta)=A^2B^2\\sin^2\\theta`,600,200,{size:42}));
  s+=fade(seg(p,.4,.55),T(`=|${AxB}|^2`,600,295,{size:44}));
  s+=fade(seg(p,.6,.8),T(`\\sin^2\\theta+\\cos^2\\theta=1`,600,410,{size:46,color:C.hi})+highlight(400,365,400,80,1));
  return s;
 },

 // ===== S6 まとめと次の問い =====
 [K+'sum']:(p)=>{
  const xs=[200,600,1000],ts=['① 影','② 90° 回す','③ A 倍'];
  let s='';
  xs.forEach((x,i)=>{s+=card(x-150,90,300,130,L(ts[i],x,145,{size:30,color:i?CN:CB,weight:700})+L('継ぎ足しを 保つ',x,195,{size:24,color:C.F}),seg(p,.05+i*.1,.15+i*.1),i?CN:CB);});
  s+=fade(seg(p,.5,.7),T(`${bA}\\times${BpC}=${bA}\\times${bB}+${bA}\\times${bC}`,600,330,{size:48})+L('分配法則',600,410,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=L('9 項 − 同じ向きの 3 項 ＝ 6 項',600,80,{size:30,color:C.hi,weight:700});
  s+=fade(seg(p,.2,.45),T(`${AxB}=(\\,${FX},\\ ${FY},\\ ${FZ}\\,)`,600,220,{size:42}));
  s+=fade(seg(p,.45,.65),L('x：y と z　　y：z と x　　z：x と y',600,320,{size:32,color:C.hi}));
  return s;
 },
 [K+'next']:(p)=>{
  const P=view({ox:150,oy:420,u:95});
  let s=fade(seg(p,.05,.3),floor(P,{x0:-.3,x1:2.2,y0:-.3,y1:2.2})+V3(P,[0,0,0],[1,2,0],{color:CA,w:6,head:18})+V3(P,[1,2,0],[1,3.05,1.4],{color:CB,w:6,head:18})
   +T(cs(CA,'\\mathbf{r}'),P(.5,1,0)[0]+10,P(.5,1,0)[1]+30,{size:32})+T(cs(CB,'\\mathbf{F}'),P(1,3.05,1.4)[0]+14,P(1,3.05,1.4)[1],{size:32,anchor:'start'}));
  s+=card(560,90,600,330,L('成分で 計算できる',860,145,{size:26,color:C.dim})
   +L('軸に そろっていない力の トルク',860,215,{size:30,color:C.hi,weight:700})
   +L('負の電荷に 働く 磁気力',860,275,{size:30,color:C.hi,weight:700})
   +fade(seg(p,.4,.6),L('実際に 出すと？',860,355,{size:34,color:C.hi,weight:700})),seg(p,.1,.25),C.hi);
  return s;
 },
};

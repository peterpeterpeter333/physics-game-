// YouTube シリーズ「外積・上級 2/2」(ys-um-cross-2) — 図。Stage 1200×515.
// 色：腕 𝐫 水色、力 𝐅 緑、トルク 𝐍 桃、速度 𝐯 紫、磁場 𝐁 橙、𝐯×𝐁 桃、負電荷 青、正電荷 赤。たすき：＋ 黄、− 赤。
// 空間：x 右、y 奥（斜め右上）、z 上（1/2 と同じ斜投影）。正面図：x 右、z 上、y は奥（⊗）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,poly} from './anim.mjs';

const K='um-cross-2:';
const CR=C.x,CF=C.F,CN=C.p,CV=C.v,CB=C.E,PL=C.hi,NG=C.a,EL='#7fb2ff',PO=C.a,HX=C.x,HY=C.v,HZ=C.t;
const RAD=Math.PI/180;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
const TF=(s,x,y,maxW,size=40,o={})=>{const w=texWidth(s,size,false);return T(s,x,y,{size:w>maxW?size*maxW/w:size,...o});};
const L=(s,x,y,o={})=>label(s,x,y,{anchor:'middle',size:28,color:C.ink,...o});
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const check=(x,y,sz=16,color=C.F)=>draw([[x-sz,y],[x-sz*.3,y+sz*.7],[x+sz,y-sz*.8]],1,{color,w:5});
const br=cs(CR,'\\mathbf{r}'),bF=cs(CF,'\\mathbf{F}'),bN=cs(CN,'\\mathbf{N}'),bv=cs(CV,'\\mathbf{v}'),bB=cs(CB,'\\mathbf{B}'),bq=cs(EL,'q');
const vxB=`${bv}\\times${bB}`;
function inSym(x,y,r=16,color=CB,g=1){const d=r*.62;return fade(g,ring(x,y,r,{color,w:3,fill:'#1a1030'})+line(x-d,y-d,x+d,y+d,{color,w:3})+line(x-d,y+d,x+d,y-d,{color,w:3}));}
function arc2(pts,{c1=C.hi,c2=C.hi,w=5,g=1}={}){
 if(g<=0||pts.length<3)return '';
 const n=pts.length,h=Math.floor(n/2),[x1,y1]=pts[n-2],[x2,y2]=pts[n-1];
 const a=Math.atan2(y2-y1,x2-x1),Lh=16;
 const head=`<polygon points="${x2+Math.cos(a)*6},${y2+Math.sin(a)*6} ${x2-Lh*Math.cos(a)+Lh*.55*Math.sin(a)},${y2-Lh*Math.sin(a)-Lh*.55*Math.cos(a)} ${x2-Lh*Math.cos(a)-Lh*.55*Math.sin(a)},${y2-Lh*Math.sin(a)+Lh*.55*Math.cos(a)}" fill="${c2}"/>`;
 return fade(g,draw(pts.slice(0,h+1),1,{color:c1,w})+draw(pts.slice(h),1,{color:c2,w})+head);
}
const circPts=(cx,cy,r,a0,a1,n=40)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});

// ---- oblique 3D ----
function view({ox,oy,u,ky=.6,ay=50*RAD}){return (x,y,z)=>[ox+u*(x+ky*Math.cos(ay)*y),oy-u*(z+ky*Math.sin(ay)*y)];}
const V3=(P,a,b,o={})=>{const A=P(...a),B=P(...b);return arrow(A[0],A[1],B[0],B[1],o);};
const L3=(P,a,b,o={})=>{const A=P(...a),B=P(...b);return line(A[0],A[1],B[0],B[1],o);};
function axes3(P,{xl=2.2,yl=3.2,zl=2.4,g=1}={}){
 let s=L3(P,[-.4,0,0],[0,0,0],{color:C.faint,w:2,dash:'5 6'})+L3(P,[0,-.9,0],[0,0,0],{color:C.faint,w:2,dash:'5 6'})+L3(P,[0,0,-.3],[0,0,0],{color:C.faint,w:2,dash:'5 6'});
 s+=V3(P,[0,0,0],[xl,0,0],{color:C.dim,w:2.5,head:13})+V3(P,[0,0,0],[0,yl,0],{color:C.dim,w:2.5,head:13})+V3(P,[0,0,0],[0,0,zl],{color:C.dim,w:2.5,head:13});
 const X=P(xl,0,0),Y=P(0,yl,0),Z=P(0,0,zl);
 s+=label('x（右）',X[0]+10,X[1]+8,{size:24,color:HX,weight:700})+label('y（奥）',Y[0]-10,Y[1]-2,{size:24,color:HY,weight:700,anchor:'end'})+label('z（上）',Z[0]+14,Z[1]+10,{size:24,color:HZ,weight:700});
 return fade(g,s);
}
function floor(P,{x0=-.4,x1=2.3,y0=-.9,y1=3.2,g=1}={}){return fade(g,poly([P(x0,y0,0),P(x1,y0,0),P(x1,y1,0),P(x0,y1,0)],{fill:'#1a2a48',fo:.55,stroke:C.grid,sw:2}));}

// ---- the x y z x y strip with たすき ----
const COLS=['x','y','z','x','y'],CC={x:HX,y:HY,z:HZ};
const PAIR={x:1,y:2,z:3};
function strip(top,bot,{x0=110,y0=120,cw=104,rh=70,names=[br,bF],hl='',g=1,tasuki=1,extraDim=1}={}){
 let s='';const lx=x0+40;
 COLS.forEach((k,j)=>{const cx=x0+80+cw*(j+.5);s+=label(k,cx,y0,{size:26,color:CC[k],anchor:'middle',weight:700,opacity:j>2&&extraDim?.7:1});});
 s+=line(x0+80,y0+14,x0+80+cw*5,y0+14,{color:C.faint,w:2})+line(x0+80+cw*3,y0-24,x0+80+cw*3,y0+rh*2+30,{color:C.faint,w:2,dash:'4 6'});
 [top,bot].forEach((row,i)=>{const cy=y0+rh*(i+1)+4;s+=T(names[i],lx,cy+8,{size:36});
  [...row,row[0],row[1]].forEach((v,j)=>{const cx=x0+80+cw*(j+.5);s+=T(String(v),cx,cy+10,{size:38,color:j>2?C.dim:C.ink});});});
 if(hl){const j=PAIR[hl],xa=x0+80+cw*(j+.5),xb=xa+cw,ya=y0+rh+4,yb=y0+rh*2+4;
  s+=rect(x0+80+cw*j+4,y0+20,cw*2-8,rh*2+4,{fill:C.hi,fo:.07,stroke:C.hi,sw:2.5,rx:10});
  if(tasuki>0){s+=fade(tasuki,line(xa+20,ya-2,xb-20,yb-14,{color:PL,w:3.5})+line(xb-20,ya-2,xa+20,yb-14,{color:NG,w:3.5}));}}
 return fade(g,s);
}
const sline=(k,expr,res,x,y,{g=1,gr=1,size=40,color=CN}={})=>fade(g,T(`${k}:`,x,y,{size,color:CC[k]})+T(expr,x+250,y,{size}))+fade(gr,T(`=${res}`,x+520,y,{size:size+4,color}));

// ---- torque scenes ----
const PT=view({ox:200,oy:420,u:105});
const rv=[1,2,0],Fv=[0,3,4],Nv=[8,-4,3];
function torque({gr=1,gF=1,gN=0,labN='',pred=0,plane=0}={}){
 const kF=.3,kN=.2,Ft=[rv[0]+Fv[0]*kF,rv[1]+Fv[1]*kF,rv[2]+Fv[2]*kF],Ne=Nv.map(v=>v*kN);
 let s=floor(PT)+axes3(PT);
 if(plane>0){s+=fade(plane*.8,poly([PT(0,0,0),PT(...rv),PT(...Ft),PT(Fv[0]*kF,Fv[1]*kF,Fv[2]*kF)],{fill:C.hi,fo:.15,stroke:C.hi,sw:1.5}));}
 s+=V3(PT,[0,0,0],rv,{color:CR,w:7,head:20,g:gr})+fade(gr,T(br,PT(.5,1,0)[0]+16,PT(.5,1,0)[1]+30,{size:36}));
 s+=fade(gF,L3(PT,rv,[rv[0],rv[1]+Fv[1]*kF,0],{color:C.dim,w:2,dash:'5 6'})+L3(PT,[rv[0],rv[1]+Fv[1]*kF,0],Ft,{color:C.dim,w:2,dash:'5 6'}));
 s+=V3(PT,rv,Ft,{color:CF,w:7,head:20,g:gF})+fade(gF,T(bF,PT(...Ft)[0]+16,PT(...Ft)[1]+10,{size:36,anchor:'start'}));
 if(pred>0)s+=fade(pred,V3(PT,[0,0,0],[0,0,1.2],{color:CN,w:5,head:16,opacity:.5})+label('真上？',PT(0,0,1.2)[0]-14,PT(0,0,1.2)[1]+8,{size:26,color:CN,anchor:'end',weight:700}));
 if(gN>0){s+=fade(gN,L3(PT,Ne,[Ne[0],Ne[1],0],{color:CN,w:2,dash:'5 6'})+L3(PT,[Ne[0],Ne[1],0],[Ne[0],0,0],{color:CN,w:2,dash:'5 6'})+L3(PT,[Ne[0],Ne[1],0],[0,Ne[1],0],{color:CN,w:2,dash:'5 6'}));s+=V3(PT,[0,0,0],Ne,{color:CN,w:8,head:22,g:gN});if(labN)s+=fade(gN,T(labN,PT(...Ne)[0]+14,PT(...Ne)[1]+40,{size:34,anchor:'start'}));}
 return s;
}
// aligned example (r along x, F along y, N along z)
function aligned({gN=0,par=0}={}){
 const P=view({ox:200,oy:400,u:100});
 let s=floor(P,{x1:3.3})+axes3(P,{xl:3.4});
 s+=V3(P,[0,0,0],[2,0,0],{color:CR,w:7,head:20})+T(br,P(1,0,0)[0],P(1,0,0)[1]+40,{size:36});
 if(!par){s+=V3(P,[2,0,0],[2,1.5,0],{color:CF,w:7,head:20})+T(bF,P(2,1.5,0)[0]+14,P(2,1.5,0)[1]+8,{size:36,anchor:'start'});}
 else{s+=V3(P,[2,0,0],[2.9,0,0],{color:CF,w:7,head:20})+T(bF,P(2.5,0,0)[0],P(2.5,0,0)[1]-16,{size:36});}
 if(gN>0)s+=V3(P,[0,0,0],[0,0,1.8],{color:CN,w:8,head:22,g:gN})+fade(gN,T(bN,P(0,0,1.8)[0]-20,P(0,0,1.8)[1]+20,{size:36,anchor:'end'}));
 return s;
}

// ---- magnetic: oblique and front ----
const PM=view({ox:240,oy:400,u:95});
function mag3({gv=1,gB=1}={}){
 let s=floor(PM,{x0:-1.2,x1:2.3,y0:-.9,y1:3})+axes3(PM,{xl:2.2,yl:3.2,zl:2.4});
 for(const [x,z] of [[-1,.6],[-1,1.8],[2.4,.6],[2.4,1.8]])s+=fade(gB*.85,V3(PM,[x,-.6,z],[x,1.6,z],{color:CB,w:3,head:12}));
 s+=fade(gB,T(bB,PM(2.4,1.6,1.8)[0]+10,PM(2.4,1.6,1.8)[1]+6,{size:34,anchor:'start'}));
 s+=V3(PM,[0,0,0],[.9,0,1.2],{color:CV,w:7,head:20,g:gv})+fade(gv,T(bv,PM(.9,0,1.2)[0]-16,PM(.9,0,1.2)[1]+10,{size:36,anchor:'end'}));
 s+=charge(PM(0,0,0)[0],PM(0,0,0)[1],-1);
 return s;
}
function charge(x,y,q){return ring(x,y,17,{color:q<0?EL:PO,w:3,fill:'#1b2338'})+label(q<0?'−':'+',x,y+9,{size:28,color:q<0?EL:PO,anchor:'middle',weight:700});}
const FO={x:330,y:300};
function front({gv=1,gX=0,gF=0,q=-1,perp=0,path=0,gB=1,labF=1}={}){
 let s='';
 for(let i=-3;i<=3;i++)for(let j=-2;j<=2;j++){const x=FO.x+i*90,y=FO.y+j*85;if(Math.hypot(x-FO.x,y-FO.y)<60||(x<240&&y>360))continue;s+=inSym(x,y,13,CB,gB*.7);}
 // axis indicator
 const ax=60,ay=470;s+=arrow(ax,ay,ax+70,ay,{color:HX,w:3,head:11})+arrow(ax,ay,ax,ay-70,{color:HZ,w:3,head:11})+label('x（右）',ax+76,ay+8,{size:22,color:HX})+label('z（上）',ax+8,ay-76,{size:22,color:HZ})+inSym(ax,ay,10,HY)+label('y（奥）',ax+20,ay-14,{size:22,color:HY});
 const v=[3,4],X=[-8,6],F=q<0?[16,-12]:[-16,12];
 const end=(d,k)=>[FO.x+d[0]*k,FO.y-d[1]*k];
 if(path>0){const u=[F[0]/20,F[1]/20],R=170,c=[FO.x+u[0]*R,FO.y-u[1]*R],a0=Math.atan2(-(FO.y-c[1]),FO.x-c[0]),dir=q<0?-1:1;
  s+=fade(path,arc2(circPts(c[0],c[1],R,a0,a0+dir*2.2*path,40),{c1:q<0?EL:PO,c2:q<0?EL:PO,w:3}));}
 s+=fade(gv,arrow(FO.x,FO.y,...end(v,30),{color:CV,w:7,head:20})+T(bv,end(v,30)[0]+14,end(v,30)[1]+6,{size:36,anchor:'start'}));
 if(gX>0)s+=fade(gX,arrow(FO.x,FO.y,...end(X,15),{color:CN,w:7,head:20})+T(vxB,end(X,15)[0]-10,end(X,15)[1]-8,{size:32,anchor:'end'}));
 if(gF>0)s+=fade(gF,arrow(FO.x,FO.y,...end(F,10),{color:CF,w:8,head:22})+(labF?T(bF,end(F,10)[0]+(F[0]>0?14:-14),end(F,10)[1]+(F[1]<0?30:-6),{size:36,anchor:F[0]>0?'start':'end'}):''));
 if(perp>0){const a=[.6,.8],b=[.8,-.6],k=18,P0=[FO.x,FO.y];const p1=[P0[0]+a[0]*k,P0[1]-a[1]*k],p2=[p1[0]+b[0]*k,p1[1]-b[1]*k],p3=[P0[0]+b[0]*k,P0[1]-b[1]*k];s+=fade(perp,draw([p1,p2,p3],1,{color:C.ink,w:2.5}));}
 s+=charge(FO.x,FO.y,q);
 return s;
}
const vrow=['3','0','4'],Brow=['0','2','0'];

export const ytUmCross2Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  let s=label('前回：外積・上級 1/2',40,50,{size:24,color:C.dim});
  s+=card(150,90,900,330,L('前回の最後の問い',600,145,{size:26,color:C.dim})
   +L('軸に そろっていない力の トルク',600,225,{size:34,color:C.hi,weight:700})
   +L('負の電荷に 働く 磁気力',600,295,{size:34,color:C.hi,weight:700})
   +fade(seg(p,.5,.65),L('実際に 出すと？',600,370,{size:32,color:C.ink})),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'recap']:(p)=>{
  const A=k=>cs(CR,`A_${k}`),B=k=>cs(CF,`B_${k}`);
  let s=L('前回：成分の式',600,60,{size:26,color:C.dim});
  const rows=[['x',`${A('y')}${B('z')}-${A('z')}${B('y')}`,'y と z'],['y',`${A('z')}${B('x')}-${A('x')}${B('z')}`,'z と x'],['z',`${A('x')}${B('y')}-${A('y')}${B('x')}`,'x と y']];
  rows.forEach(([k,f,pr],i)=>{const y=160+i*100,g=seg(p,.25+i*.18,.38+i*.18);s+=T(`${k}:`,300,y,{size:40,color:CC[k]})+T(f,560,y,{size:48})+fade(g,L(`（${pr}）`,880,y+2,{size:28,color:C.hi}));});
  return s;
 },
 [K+'trick']:(p)=>{
  let s=strip(['A_x','A_y','A_z'].map(t=>`{${t}}`),['B_x','B_y','B_z'].map(t=>`{${t}}`),{names:[cs(CR,'\\mathbf{A}'),cs(CF,'\\mathbf{B}')],g:seg(p,0,.2),extraDim:1});
  s+=card(700,110,450,260,L('上下 2段に 書く',925,170,{size:28})+fade(seg(p,.45,.6),L('x，y，z の後に',925,240,{size:28})+L('もう一度 x，y',925,290,{size:30,color:C.hi,weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'trick2']:(p)=>{
  const hl=p<.42?'x':p<.7?'y':'z';
  let s=strip(['A_x','A_y','A_z'],['B_x','B_y','B_z'],{names:[cs(CR,'\\mathbf{A}'),cs(CF,'\\mathbf{B}')],hl:p>.08?hl:'',tasuki:seg(p,.08,.2)});
  s+=fade(seg(p,.05,.2),label('左上 × 右下',740,170,{size:28,color:PL,weight:700})+label('− 右上 × 左下',740,220,{size:28,color:NG,weight:700}));
  const res={x:'x 成分（y と z）',y:'y 成分（z と x）',z:'z 成分（x と y）'};
  if(p>.3)s+=L(`→ ${res[hl]}`,880,320,{size:30,color:C.hi,weight:700});
  return s;
 },
 [K+'goal']:(p)=>{
  let s=card(100,110,470,250,L('① トルク',335,175,{size:32,color:CN,weight:700})+T(`${bN}=${br}\\times${bF}`,335,260,{size:46}),seg(p,0,.15),CN);
  s+=card(630,110,470,250,L('② 磁気力',865,175,{size:32,color:CF,weight:700})+T(`${bF}=${bq}\\,${vxB}`,865,260,{size:46}),seg(p,.15,.3),CF);
  s+=fade(seg(p,.5,.7),L('内積と 長さで 確かめる',600,440,{size:30,color:C.hi,weight:700}));
  return s;
 },

 // ===== S2 軸にそろった例 =====
 [K+'rf']:(p)=>{
  let s=aligned({});
  s+=card(640,110,510,260,L('軸に そろった例（中級のドア）',895,165,{size:26,color:C.dim})
   +TF(`${br}=(2,\\,0,\\,0)\\ \\mathrm{m}`,895,240,460,40)+TF(`${bF}=(0,\\,3,\\,0)\\ \\mathrm{N}`,895,315,460,40),seg(p,.05,.2));
  return s;
 },
 [K+'calc']:(p)=>{
  let s=strip(['2','0','0'],['0','3','0'],{x0:300,y0:80,hl:p<.5?'x':'y'});
  s+=sline('x','0\\times0-0\\times3','0',190,330,{g:seg(p,.05,.25),gr:seg(p,.3,.45)});
  s+=sline('y','0\\times0-2\\times0','0',190,420,{g:seg(p,.5,.7),gr:seg(p,.75,.9)});
  return s;
 },
 [K+'calc2']:(p)=>{
  let s=strip(['2','0','0'],['0','3','0'],{x0:300,y0:80,hl:'z'});
  s+=sline('x','0\\times0-0\\times3','0',190,300,{size:32})+sline('y','0\\times0-2\\times0','0',190,360,{size:32});
  s+=sline('z','2\\times3-0\\times0','6',190,440,{g:seg(p,.1,.35),gr:seg(p,.45,.65)});
  return s;
 },
 [K+'res']:(p)=>{
  let s=aligned({gN:seg(p,.05,.3)});
  s+=card(640,90,510,330,TF(`${bN}=(0,\\,0,\\,6)\\ \\mathrm{N\\cdot m}`,895,160,470,42)
   +fade(seg(p,.25,.4),L('上向き（z）',895,235,{size:30,color:CN,weight:700}))
   +fade(seg(p,.5,.7),T(`${cs(HX,'\\hat{x}')}\\times${cs(HY,'\\hat{y}')}=${cs(HZ,'\\hat{z}')}`,895,320,{size:40})+L('表と 同じ向き',895,385,{size:26,color:C.dim})),seg(p,0,.12));
  return s;
 },
 [K+'par']:(p)=>{
  let s=aligned({par:1});
  s+=card(640,90,510,330,L('柄に 平行な力',895,140,{size:28,color:C.dim})
   +TF(`${bF}=(3,\\,0,\\,0)\\ \\mathrm{N}`,895,210,460,40)
   +fade(seg(p,.15,.35),TF(`${bN}=(0,\\,0,\\,0)`,895,285,460,42))
   +fade(seg(p,.5,.7),L('回らない（初級のレンチ）',895,365,{size:28,color:NG,weight:700})),seg(p,0,.12));
  return s;
 },

 // ===== S3 斜めの力のトルク =====
 [K+'setup']:(p)=>{
  let s=torque({gF:0,gr:seg(p,.1,.35)});
  s+=card(680,110,470,220,TF(`${br}=(1,\\,2,\\,0)\\ \\mathrm{m}`,915,180,430,42)+fade(seg(p,.4,.6),L('床の上，右へ 1・奥へ 2',915,265,{size:28})),seg(p,0,.15));
  return s;
 },
 [K+'force']:(p)=>{
  let s=torque({gF:seg(p,.1,.35)});
  s+=card(680,110,470,260,TF(`${br}=(1,\\,2,\\,0)\\ \\mathrm{m}`,915,170,430,38)+TF(`${bF}=(0,\\,3,\\,4)\\ \\mathrm{N}`,915,240,430,42)
   +fade(seg(p,.4,.6),L('奥へ 3，上へ 4',915,320,{size:28,color:CF,weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=torque({pred:seg(p,.1,.3)});
  s+=card(680,110,470,240,L('トルクの 軸は',915,180,{size:30})+L('真上を 向く？',915,245,{size:34,color:C.hi,weight:700})+fade(seg(p,.4,.6),L('予想してみよう',915,310,{size:24,color:C.dim})),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'nx']:(p)=>{
  let s=strip(['1','2','0'],['0','3','4'],{x0:300,y0:80,hl:'x'});
  s+=sline('x','2\\times4-0\\times3','8',190,350,{g:seg(p,.05,.3),gr:seg(p,.5,.7)});
  return s;
 },
 [K+'ny']:(p)=>{
  let s=strip(['1','2','0'],['0','3','4'],{x0:300,y0:80,hl:'y'});
  s+=sline('x','2\\times4-0\\times3','8',190,320,{size:34});
  s+=sline('y','0\\times0-1\\times4','-4',190,400,{g:seg(p,.05,.3),gr:seg(p,.5,.7)});
  return s;
 },
 [K+'nz']:(p)=>{
  let s=strip(['1','2','0'],['0','3','4'],{x0:300,y0:80,hl:'z'});
  s+=sline('x','2\\times4-0\\times3','8',190,310,{size:32})+sline('y','0\\times0-1\\times4','-4',190,370,{size:32});
  s+=sline('z','1\\times3-2\\times0','3',190,445,{g:seg(p,.05,.3),gr:seg(p,.5,.7)});
  return s;
 },
 [K+'nres']:(p)=>{
  let s=torque({gN:seg(p,.05,.3),labN:bN});
  s+=card(680,90,470,330,TF(`${bN}=(8,\\,-4,\\,3)\\ \\mathrm{N\\cdot m}`,915,155,430,40)
   +fade(seg(p,.3,.45),L('x：＋8 → 右へ 大きく',915,230,{size:26,color:HX}))
   +fade(seg(p,.45,.6),L('y：−4 → 手前へ',915,285,{size:26,color:HY}))
   +fade(seg(p,.6,.75),L('z：＋3 → 少し 上へ',915,340,{size:26,color:HZ}))
   +fade(seg(p,.75,.9),L('真上 ではない',915,395,{size:28,color:C.hi,weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'nmag']:(p)=>{
  let s=T(`${bN}=(8,\\,-4,\\,3)\\ \\mathrm{N\\cdot m}`,600,80,{size:40});
  s+=fade(seg(p,.05,.3),T(`|${bN}|^2=8^2+(-4)^2+3^2=64+16+9=89`,600,210,{size:44}));
  s+=fade(seg(p,.45,.7),T(`|${bN}|=\\sqrt{89}\\approx 9.4\\ \\mathrm{N\\cdot m}`,600,330,{size:50,color:CN}));
  return s;
 },
 [K+'nperp']:(p)=>{
  let s=T(`${bN}=(8,\\,-4,\\,3),\\quad ${br}=(1,\\,2,\\,0),\\quad ${bF}=(0,\\,3,\\,4)`,600,70,{size:34});
  s+=fade(seg(p,.05,.3),T(`${bN}\\cdot${br}=8\\times1+(-4)\\times2+3\\times0=8-8+0=0`,560,200,{size:38})+check(1100,192));
  s+=fade(seg(p,.4,.65),T(`${bN}\\cdot${bF}=8\\times0+(-4)\\times3+3\\times4=0-12+12=0`,560,300,{size:38})+check(1100,292));
  s+=fade(seg(p,.75,.9),L('𝐫 にも 𝐅 にも 垂直',600,420,{size:32,color:C.F,weight:700}));
  return s;
 },
 [K+'nlen']:(p)=>{
  let s=T(`|${bN}|^2=89`,600,60,{size:38});
  s+=fade(seg(p,.05,.25),T(`r^2F^2-(${br}\\cdot${bF})^2`,600,145,{size:44}));
  s+=fade(seg(p,.2,.4),L('r² ＝ 1＋4＋0 ＝ 5，F² ＝ 0＋9＋16 ＝ 25，𝐫·𝐅 ＝ 0＋6＋0 ＝ 6',600,215,{size:24,color:C.dim}));
  s+=fade(seg(p,.35,.55),T(`=5\\times25-6^2`,600,295,{size:44}));
  s+=fade(seg(p,.55,.75),T(`=125-36=89`,600,385,{size:48,color:CN})+check(840,377));
  s+=fade(seg(p,.8,.92),L('一致',940,390,{size:32,color:C.F,weight:700}));
  return s;
 },
 [K+'nmean']:(p)=>{
  let s=torque({gN:1,labN:bN,plane:seg(p,.05,.3)});
  s+=card(680,110,470,280,L('𝐫 と 𝐅 の 斜めの面',915,170,{size:28,color:C.hi,weight:700})
   +fade(seg(p,.25,.45),L('𝐍 ＝ その面に 垂直な 軸',915,240,{size:28,color:CN,weight:700}))
   +fade(seg(p,.55,.75),L('軸の周りに 右ねじの向きに 回す',915,320,{size:26})),seg(p,0,.12));
  return s;
 },

 // ===== S4 負電荷の磁気力 =====
 [K+'msetup']:(p)=>{
  let s=mag3({gB:0,gv:seg(p,.4,.6)});
  s+=card(660,90,490,300,T(`${bF}=${bq}\\,${vxB}`,905,160,{size:44})
   +fade(seg(p,.3,.45),TF(`${bq}=-2\\ \\mathrm{C}`,905,240,440,40)+L('負の電荷',1080,248,{size:24,color:EL}))
   +fade(seg(p,.5,.65),TF(`${bv}=(3,\\,0,\\,4)\\ \\mathrm{m/s}`,905,320,440,40)),seg(p,0,.15));
  return s;
 },
 [K+'mfield']:(p)=>{
  let s=mag3({gB:seg(p,.05,.3)});
  s+=card(660,90,490,300,TF(`${bB}=(0,\\,2,\\,0)\\ \\mathrm{T}`,905,160,440,42)
   +fade(seg(p,.1,.3),L('奥向き（y）',905,230,{size:28,color:CB,weight:700}))
   +fade(seg(p,.45,.65),L('𝐯：右と上の 間',905,290,{size:28,color:CV}))
   +fade(seg(p,.65,.85),L('𝐯 ⊥ 𝐁（𝐯·𝐁 ＝ 0）',905,345,{size:28,color:C.ink})),seg(p,0,.12));
  return s;
 },
 [K+'mfront']:(p)=>{
  let s=front({gB:seg(p,.4,.6)});
  s+=card(690,90,470,320,L('力は 𝐁 に 垂直',925,145,{size:28})
   +L('→ x と z の面（正面）',925,200,{size:28,color:C.hi,weight:700})
   +fade(seg(p,.45,.6),L('正面から 見る',925,275,{size:28}))
   +fade(seg(p,.55,.7),inSym(860,340,18,CB)+label('𝐁：奥へ',890,350,{size:28,color:CB,weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'mrule']:(p)=>{
  let s=front({});
  s+=card(690,90,470,300,L('中級と 同じ 手順',925,145,{size:26,color:C.dim})
   +L('① 先に 𝐯×𝐁',925,215,{size:32,color:CN,weight:700})
   +fade(seg(p,.35,.55),L('② 最後に q を掛ける',925,290,{size:32,color:EL,weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'mx']:(p)=>{
  let s=strip(vrow,Brow,{x0:300,y0:80,hl:'x',names:[bv,bB]});
  s+=sline('x','0\\times0-4\\times2','-8',190,350,{g:seg(p,.05,.3),gr:seg(p,.5,.7)});
  return s;
 },
 [K+'my']:(p)=>{
  let s=strip(vrow,Brow,{x0:300,y0:80,hl:'y',names:[bv,bB]});
  s+=sline('x','0\\times0-4\\times2','-8',190,320,{size:34});
  s+=sline('y','4\\times0-3\\times0','0',190,400,{g:seg(p,.05,.3),gr:seg(p,.5,.7)});
  return s;
 },
 [K+'mz']:(p)=>{
  let s=strip(vrow,Brow,{x0:200,y0:60,hl:'z',names:[bv,bB],cw:72,rh:56});
  s+=sline('x','0\\times0-4\\times2','-8',60,265,{size:30})+sline('y','4\\times0-3\\times0','0',60,320,{size:30});
  s+=sline('z','3\\times2-0\\times0','6',60,380,{size:30,g:seg(p,.05,.25),gr:seg(p,.3,.45)});
  s+=fade(seg(p,.5,.65),T(`${vxB}=(-8,\\,0,\\,6)`,330,460,{size:38}));
  // small front view on the right
  const ox=930,oy=300;
  s+=fade(seg(p,.6,.75),arrow(ox,oy,ox+3*28,oy-4*28,{color:CV,w:5,head:16})+T(bv,ox+3*28+10,oy-4*28,{size:30,anchor:'start'})
   +arrow(ox,oy,ox-8*15,oy-6*15,{color:CN,w:6,head:18})+T(vxB,ox-8*15-6,oy-6*15-10,{size:28,anchor:'end'})+inSym(ox,oy,12,CB)+L('左上',ox-70,oy+60,{size:26,color:CN,weight:700})
   +label('正面：x 右，z 上',ox-110,oy+120,{size:22,color:C.dim}));
  return s;
 },
 [K+'mq']:(p)=>{
  let s=front({gX:1,gF:seg(p,.35,.6)});
  s+=card(690,90,470,320,T(`${vxB}=(-8,\\,0,\\,6)`,925,150,{size:36})
   +fade(seg(p,.1,.3),T(`${bF}=(-2)\\times(-8,\\,0,\\,6)`,925,225,{size:36}))
   +fade(seg(p,.3,.5),TF(`=(16,\\,0,\\,-12)\\ \\mathrm{N}`,925,295,440,40))
   +fade(seg(p,.6,.75),L('負の電荷 → 右下へ 反転',925,370,{size:28,color:EL,weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'mmag']:(p)=>{
  let s=T(`${bF}=(16,\\,0,\\,-12)\\ \\mathrm{N}`,600,70,{size:40});
  s+=fade(seg(p,.05,.3),T(`|${bF}|=\\sqrt{16^2+12^2}=\\sqrt{400}=20\\ \\mathrm{N}`,600,185,{size:44}));
  s+=fade(seg(p,.4,.6),T(`v=\\sqrt{3^2+4^2}=5,\\quad B=2,\\quad ${bv}\\perp${bB}`,600,290,{size:38}));
  s+=fade(seg(p,.6,.8),T(`|q|\\,vB=2\\times5\\times2=20\\ \\mathrm{N}`,600,390,{size:46,color:CF})+check(900,382));
  return s;
 },
 [K+'mwork']:(p)=>{
  let s=front({gX:0,gF:1,perp:seg(p,.4,.6)});
  s+=card(690,90,470,300,T(`${bF}\\cdot${bv}=16\\times3+0+(-12)\\times4`,925,155,{size:32})
   +fade(seg(p,.1,.3),T(`=48-48=0`,925,225,{size:40}))
   +fade(seg(p,.4,.6),L('力 ⊥ 速度 → 仕事 0',925,300,{size:28,color:C.F,weight:700}))
   +fade(seg(p,.65,.8),L('向きだけ 曲がる',925,355,{size:28})),seg(p,0,.12));
  return s;
 },
 [K+'mturn']:(p)=>{
  let s=front({gF:1,path:seg(p,.35,.85)});
  s+=card(690,90,470,280,L('正面から 見ると',925,145,{size:26,color:C.dim})
   +L('右上へ 進み，右下へ 押される',925,210,{size:28})
   +fade(seg(p,.6,.75),L('負の電荷：時計回り',925,290,{size:32,color:EL,weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'mpos']:(p)=>{
  let s=front({q:1,gF:1,path:seg(p,.1,.5)});
  s+=card(690,90,470,320,TF(`${cs(PO,'q>0')}:\\ ${bF}=(-16,\\,0,\\,12)\\ \\mathrm{N}`,925,150,440,34)
   +L('左上へ 押される',925,215,{size:28})
   +fade(seg(p,.3,.45),L('正の電荷：反時計回り',925,280,{size:32,color:PO,weight:700}))
   +fade(seg(p,.6,.75),L('逆になるのは q の符号のため',925,350,{size:26,color:C.hi,weight:700})),seg(p,0,.12));
  return s;
 },

 // ===== S5 まとめと次の問い =====
 [K+'sum']:(p)=>{
  let s=card(80,90,500,300,L('トルク',330,150,{size:30,color:CN,weight:700})+TF(`${br}\\times${bF}`,330,220,440,40)+TF(`=(8,\\,-4,\\,3)\\ \\mathrm{N\\cdot m}`,330,295,440,40),seg(p,.05,.2),CN);
  s+=card(620,90,500,300,L('負電荷の 磁気力',870,150,{size:30,color:CF,weight:700})+TF(`(-2)\\,${vxB}`,870,220,440,40)+TF(`=(16,\\,0,\\,-12)\\ \\mathrm{N}`,870,295,440,40),seg(p,.25,.4),CF);
  s+=fade(seg(p,.05,.2),L('隣り合う 2列の たすき掛け',600,450,{size:28,color:C.hi,weight:700}));
  return s;
 },
 [K+'sum2']:(p)=>{
  const rows=[['垂直','内積 ＝ 0','𝐍·𝐫 ＝ 𝐍·𝐅 ＝ 0','𝐅·𝐯 ＝ 0'],['長さ','別の式と 比べる','√89 ≈ 9.4','|q|vB ＝ 20'],['符号','q は 最後に','','負 → 反転']];
  let s='';
  rows.forEach((r,i)=>{const y=150+i*100,g=seg(p,.05+i*.25,.2+i*.25);s+=fade(g,L(r[0],170,y,{size:30,color:C.hi,weight:700})+L(r[1],400,y,{size:26})+L(r[2],720,y,{size:26,color:CN})+L(r[3],1000,y,{size:26,color:CF}));});
  return s;
 },
 [K+'next']:(p)=>{
  const ox=110,oy=430,w=480,h=320;
  let s=line(ox,oy,ox+w,oy,{color:C.dim,w:2})+line(ox,oy,ox,oy-h,{color:C.dim,w:2})+label('t',ox+w+10,oy+8,{size:26,color:C.t})+label('量',ox-12,oy-h+10,{size:26,color:C.hi,anchor:'end'});
  const f=t=>Math.exp(-.2*t);
  // steps (×0.8 per second) like 中級
  let st=[];for(let k=0;k<8;k++){const x0=ox+k*55,x1=x0+55,y=oy-h*.9*Math.pow(.8,k);st.push([x0,y],[x1,y]);}
  s+=fade(seg(p,.1,.4),draw(st,1,{color:C.dim,w:3}));
  s+=fade(seg(p,.4,.7),draw(Array.from({length:61},(_,i)=>{const t=i/60*8;return [ox+t*55,oy-h*.9*f(t)];}),1,{color:C.hi,w:4}));
  s+=card(660,110,490,250,L('減り方は',905,180,{size:30})+L('今の量に 比例する',905,240,{size:34,color:C.hi,weight:700})+fade(seg(p,.5,.7),L('（中級：刻んで 数値で 見た）',905,305,{size:24,color:C.dim})),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'next2']:(p)=>{
  const ox=110,oy=430,w=480,h=320,f=t=>Math.exp(-.2*t);
  let s=line(ox,oy,ox+w,oy,{color:C.dim,w:2})+line(ox,oy,ox,oy-h,{color:C.dim,w:2})+label('t',ox+w+10,oy+8,{size:26,color:C.t})+label('量',ox-12,oy-h+10,{size:26,color:C.hi,anchor:'end'});
  s+=draw(Array.from({length:61},(_,i)=>{const t=i/60*8;return [ox+t*55,oy-h*.9*f(t)];}),1,{color:C.hi,w:4});
  s+=card(660,110,490,250,L('指数関数の 減り方を',905,185,{size:30})+L('式から 導くには？',905,255,{size:36,color:C.hi,weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
};

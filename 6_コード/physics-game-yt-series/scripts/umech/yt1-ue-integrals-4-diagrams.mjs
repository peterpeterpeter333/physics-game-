// YouTube シリーズ 線積分と面積分・上級 4/4（ステージ ue-integrals 本12〜本14）— 図。Stage 1200×515.
// 色：u 方向の一歩 黄、v 方向の一歩 紫、法線・面積ベクトル 桃、電場 𝐄 水色、角度 θ・φ 橙。⊙＝画面の手前向き。
// 3D は正射影（方位角 az、仰角 el）。球の裏側は点線。
import {C,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,poly,texWidth} from './anim.mjs';
import {UC,card,L,T,TF,cc,bE,rp,plane,para,pathLine,uTicks,patch,vecAt} from './yt1-ue-integrals-1-diagrams.mjs';

const K='ue-integrals-4:';
const PR={x:560,w:620,cx:870};
const CU=C.hi,CV=C.v,CN=UC.N,CE=UC.E,CA=C.E;
const su=cc(CU,'\\mathbf{s}_u'),sv=cc(CV,'\\mathbf{s}_v'),bA=cc(CN,'d\\mathbf{A}');

function view(ox,oy,s,az=-.6,el=.38){
 const ca=Math.cos(az),sa=Math.sin(az),ce=Math.cos(el),se=Math.sin(el);
 const P=([x,y,z])=>{const xr=x*ca-y*sa,yr=x*sa+y*ca;return [ox+s*xr,oy-s*(z*ce+yr*se)];};
 const depth=([x,y,z])=>-ce*(x*sa+y*ca)+se*z;
 return {P,depth};
}
const add=(a,b,k=1)=>[a[0]+k*b[0],a[1]+k*b[1],a[2]+k*b[2]];
function arrow3(V,from,vec,{k=1,color=CU,w=5,head=15,lab='',ldx=8,ldy=-8,size=26,g=1,anchor='start'}={}){
 const a=V.P(from),b=V.P(add(from,vec,k));
 return fade(g,arrow(a[0],a[1],b[0],b[1],{color,w,head})+(lab?label(lab,b[0]+ldx,b[1]+ldy,{size,color,weight:700,anchor}):''));
}
// sphere pieces
const sph=(th,ph,R=1)=>[R*Math.sin(th)*Math.cos(ph),R*Math.sin(th)*Math.sin(ph),R*Math.cos(th)];
const sTh=(th,ph)=>[Math.cos(th)*Math.cos(ph),Math.cos(th)*Math.sin(ph),-Math.sin(th)];
const sPh=(th,ph)=>[-Math.sin(th)*Math.sin(ph),Math.sin(th)*Math.cos(ph),0];
function curve3(V,fn,{n=90,color=C.dim,w=2,g=1,hidden=1}={}){
 // split into visible (solid) and hidden (dashed) runs
 let s='',run=[],vis=null;const flush=()=>{if(run.length>1)s+=draw(run,1,{color,w,dash:vis?'':'4 6',opacity:vis?1:.55});run=[];};
 for(let i=0;i<=n;i++){const p=fn(i/n),v=V.depth(p)>=-1e-9;if(vis!==null&&v!==vis){const q=V.P(p);run.push(q);flush();run=[q];vis=v;continue;}vis=v;run.push(V.P(p));}
 flush();if(!hidden)s=s.replace(/<polyline[^>]*stroke-dasharray[^>]*\/>/g,'');return fade(g,s);
}
function sphere(V,ox,oy,R,{g=1,grid=1,lat=[],mer=[]}={}){
 let s=fade(g,ring(ox,oy,R,{color:C.dim,w:2.5,fill:'#14203a'}));
 if(grid){for(const th of [Math.PI/4,Math.PI/2,3*Math.PI/4])s+=curve3(V,u=>sph(th,2*Math.PI*u),{g:g*grid});
  for(const ph of [0,Math.PI/3,2*Math.PI/3,Math.PI,4*Math.PI/3,5*Math.PI/3])s+=curve3(V,u=>sph(Math.PI*u,ph),{g:g*grid});}
 return s;
}
// flat parallelogram in 2D
function para2({ox=150,oy=400,a=[330,0],b=[120,-200],g=1,fill=CN,h=0,gam=0,labs=1}={}){
 const A=[ox+a[0],oy+a[1]],B=[ox+b[0],oy+b[1]],D=[ox+a[0]+b[0],oy+a[1]+b[1]];
 let s=fade(g,poly([[ox,oy],A,D,B],{fill,fo:.14,stroke:'none'})+arrow(ox,oy,A[0],A[1],{color:CU,w:6,head:16})+arrow(ox,oy,B[0],B[1],{color:CV,w:6,head:16}));
 if(labs)s+=fade(g,label('a',ox+a[0]/2,oy+34,{size:28,color:CU,weight:700,anchor:'middle'})+label('b',ox+b[0]/2-18,oy+b[1]/2,{size:28,color:CV,weight:700,anchor:'end'}));
 if(gam){const ang=Math.atan2(-b[1],b[0]);s+=fade(gam,draw(Array.from({length:16},(_,i)=>{const t=ang*i/15;return [ox+46*Math.cos(t),oy-46*Math.sin(t)];}),1,{color:CA,w:2.5})+label('γ',ox+60*Math.cos(ang/2)+4,oy-60*Math.sin(ang/2)+8,{size:26,color:CA}));}
 if(h)s+=fade(h,line(B[0],B[1],B[0],oy,{color:C.ink,w:2.5,dash:'6 5'})+label('b sinγ',B[0]+10,(B[1]+oy)/2,{size:24,color:C.ink}));
 return s;
}
// top view of the square 0..L (z toward the viewer)
const SQ={x0:110,y0:450,s:340};
const sqX=u=>SQ.x0+SQ.s*u,sqY=v=>SQ.y0-SQ.s*v;
function square({g=1,grid=0,strip=null,stack=0}={}){
 let s=fade(g,rect(sqX(0),sqY(1),SQ.s,SQ.s,{fill:CN,fo:.08,stroke:CN,sw:2.5,rx:2})
  +arrow(sqX(0)-10,sqY(0),sqX(1.12),sqY(0),{color:C.dim,w:2.5,head:12})+arrow(sqX(0),sqY(0)+10,sqX(0),sqY(1.12),{color:C.dim,w:2.5,head:12})
  +label('x（u）',sqX(1.12)+6,sqY(0)+8,{size:22,color:C.dim})+label('y（v）',sqX(0)+10,sqY(1.12)+4,{size:22,color:C.dim})
  +label('L',sqX(1),sqY(0)+30,{size:22,color:C.dim,anchor:'middle'})+label('L',sqX(0)-12,sqY(1)+8,{size:22,color:C.dim,anchor:'end'})+label('0',sqX(0)-10,sqY(0)+28,{size:22,color:C.dim,anchor:'end'}));
 if(strip!==null)s+=rect(sqX(0),sqY(strip+.1),SQ.s,SQ.s*.1,{fill:C.hi,fo:.25,stroke:C.hi,sw:2,rx:2});
 if(stack){const n=Math.floor(stack*10+1e-6);for(let i=0;i<n;i++)s+=rect(sqX(0),sqY((i+1)/10),SQ.s,SQ.s*.1,{fill:C.hi,fo:.12+.012*i,stroke:C.hi,sw:1,rx:1});}
 return s;
}
function odots({g=1}={}){
 let s='';for(let i=0;i<5;i++)for(let j=0;j<5;j++){const u=(i+.5)/5,v=(j+.5)/5,r=4+16*u;
  s+=ring(sqX(u),sqY(v),r,{color:CE,w:2.5})+dot(sqX(u),sqY(v),Math.max(2.5,r*.25),CE);}
 return fade(g,s);
}

export const ytUeIntegrals4Diagrams={
 // ===== S1 =====
 [K+'ask']:(p)=>{
  let s=patch(330,290,{grid:0})+fade(seg(p,.2,.4),label('？',330,250,{size:60,color:C.hi,weight:700,anchor:'middle'}));
  s+=card(PR.x+40,130,PR.w-40,230,L('前回の最後の問い',PR.cx+20,180,{size:24,color:C.dim})+L('曲がった面のタイルの',PR.cx+20,240,{size:28})+L('面積と法線は？',PR.cx+20,295,{size:32,color:C.hi,weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'recap']:(p)=>{
  const P=plane({ox:70,oy:440,S:260,xt:[],yt:[],xl:'',yl:''});
  let s=P.svg+pathLine(P,para)+uTicks(P,para,{labels:0})+vecAt(P,para(.5),[1,1],{k:.3,color:CU,w:5,lab:'𝐫′du',ldx:6,ldy:-6});
  s+=fade(seg(p,.1,.3),T(`d\\mathbf{r}=${rp}(u)\\,du`,250,60,36,{color:CU}));
  s+=fade(seg(p,.5,.7),arrow(470,270,560,270,{color:C.dim,w:4,head:16}));
  s+=patch(880,300,{g:seg(p,.55,.75),grid:seg(p,.6,.85)});
  s+=fade(seg(p,.6,.8),L('面にも 目盛りを',880,110,{size:30,color:CN,weight:700}));
  return s;
 },

 // ===== S2 =====
 ...(()=>{
  const S0=(u,v)=>[330-150+300*u+40*v,290+60-150*v+30*Math.sin(Math.PI*u)-25*u];
  const grid=(g=1)=>{let s='';for(let k=0;k<=5;k++){s+=fade(g,draw(Array.from({length:21},(_,i)=>S0(i/20,k/5)),1,{color:CU,w:1.8,opacity:.75})+draw(Array.from({length:21},(_,i)=>S0(k/5,i/20)),1,{color:CV,w:1.8,opacity:.75}));}return s;};
  const base=(o={})=>patch(330,290,{grid:0})+grid(o.grid??1);
  const u0=.4,v0=.4,du=.2,dv=.2,P0=S0(u0,v0),Pu=S0(u0+du,v0),Pv=S0(u0,v0+dv),Puv=S0(u0+du,v0+dv);
  return {
   [K+'two']:(p)=>{
    let s=patch(330,290,{grid:0})+grid(seg(p,.2,.5));
    s+=fade(seg(p,.2,.4),label('u',S0(1,0)[0]+8,S0(1,0)[1]+26,{size:28,color:CU,weight:700})+label('v',S0(0,1)[0]-12,S0(0,1)[1],{size:28,color:CV,weight:700,anchor:'end'}));
    s+=fade(seg(p,.5,.7),dot(P0[0],P0[1],8,C.ink)+label('𝐬(u, v)',P0[0]-12,P0[1]+30,{size:24,color:C.ink,anchor:'end'}));
    s+=card(PR.x+40,130,PR.w-40,230,L('面には 目盛りが 2つ',PR.cx+20,195,{size:30,color:C.ink,weight:700})+fade(seg(p,.5,.7),T('\\mathbf{s}(u,\\,v)',PR.cx+20,280,48)),seg(p,.02,.15));
    return s;
   },
   [K+'su']:(p)=>{
    let s=base()+dot(P0[0],P0[1],8,C.ink);
    s+=fade(seg(p,.15,.4),arrow(P0[0],P0[1],Pu[0],Pu[1],{color:CU,w:6,head:16})+label('∂𝐬/∂u du',Pu[0]+8,Pu[1]+30,{size:24,color:CU,weight:700}));
    s+=T(`\\frac{\\partial\\mathbf{s}}{\\partial u}\\,du=${su}\\,du`,PR.cx+20,170,44);
    s+=fade(seg(p,.05,.2),L('v を止めて u だけ進める',PR.cx+20,260,{size:28,color:CU,weight:700}));
    s+=fade(seg(p,.5,.7),L('面に接する 小さな矢印',PR.cx+20,320,{size:26}));
    return s;
   },
   [K+'sv']:(p)=>{
    let s=base()+arrow(P0[0],P0[1],Pu[0],Pu[1],{color:CU,w:6,head:16});
    s+=fade(seg(p,.1,.35),arrow(P0[0],P0[1],Pv[0],Pv[1],{color:CV,w:6,head:16})+label('∂𝐬/∂v dv',Pv[0]-10,Pv[1]-8,{size:24,color:CV,weight:700,anchor:'end'}));
    s+=fade(seg(p,.5,.7),poly([P0,Pu,Puv,Pv],{fill:CN,fo:.35,stroke:CN,sw:2}));
    s+=T(`\\frac{\\partial\\mathbf{s}}{\\partial v}\\,dv=${sv}\\,dv`,PR.cx+20,170,44);
    s+=fade(seg(p,.5,.7),L('2本の一歩 → 小さな平行四辺形',PR.cx+20,270,{size:28,color:CN,weight:700}));
    return s;
   },
   [K+'dA']:(p)=>{
    const n=[.15,-1];let s=base({grid:.5})+poly([P0,Pu,Puv,Pv],{fill:CN,fo:.35,stroke:CN,sw:2})+arrow(P0[0],P0[1],Pu[0],Pu[1],{color:CU,w:5,head:14})+arrow(P0[0],P0[1],Pv[0],Pv[1],{color:CV,w:5,head:14});
    const c=[(P0[0]+Puv[0])/2,(P0[1]+Puv[1])/2];
    s+=fade(seg(p,.2,.45),arrow(c[0],c[1],c[0]+n[0]*150,c[1]+n[1]*150,{color:CN,w:6,head:18})+label('d𝐀',c[0]+n[0]*150+12,c[1]+n[1]*150+10,{size:28,color:CN,weight:700}));
    s+=TF(`${bA}=(${su}\\times${sv})\\,du\\,dv`,PR.cx+20,170,44,560);
    s+=fade(seg(p,.5,.7),L('大きさ ＝ タイルの面積',PR.cx+20,260,{size:28}));
    s+=fade(seg(p,.6,.8),L('向き ＝ 法線',PR.cx+20,315,{size:28,color:CN,weight:700}));
    return s;
   },
  };
 })(),
 [K+'area']:(p)=>{
  let s=para2({ox:150,oy:400,gam:seg(p,.2,.4),h:seg(p,.4,.6)});
  s+=fade(seg(p,.4,.6),L('高さ ＝ b sinγ',PR.cx,170,{size:30}));
  s+=fade(seg(p,.6,.8),T('\\text{面積}=ab\\sin\\gamma'.replace('\\text{面積}','S'),PR.cx,260,48,{color:CN}));
  s+=fade(seg(p,.6,.8),L('（S：平行四辺形の面積）',PR.cx,330,{size:22,color:C.dim}));
  return s;
 },
 [K+'cross']:(p)=>{
  let s=para2({ox:150,oy:420,gam:1,labs:1});
  s+=fade(seg(p,.15,.4),arrow(300,320,300,110,{color:CN,w:6,head:18})+label('𝐚×𝐛',312,120,{size:28,color:CN,weight:700}));
  s+=T('|\\mathbf{a}\\times\\mathbf{b}|=ab\\sin\\gamma',PR.cx,160,44,{color:CN});
  s+=fade(seg(p,.4,.6),L('向き：面に垂直（右ねじ）',PR.cx,250,{size:28}));
  s+=fade(seg(p,.6,.8),L('（外積・上級）',PR.cx,310,{size:24,color:C.dim}));
  return s;
 },
 [K+'order']:(p)=>{
  let s=para2({ox:90,oy:400,a:[260,0],b:[90,-150],labs:0})+arrow(220,325,220,130,{color:CN,w:5,head:16})+label('𝐚×𝐛：上',232,140,{size:24,color:CN,weight:700});
  s+=fade(seg(p,.2,.4),para2({ox:640,oy:300,a:[260,0],b:[90,-150],labs:0})+arrow(770,225,770,450,{color:CN,w:5,head:16})+label('𝐛×𝐚：下',782,440,{size:24,color:CN,weight:700}));
  s+=fade(seg(p,.55,.75),L('閉じた面では 外向きになる順を選ぶ',600,490,{size:28,color:C.hi,weight:700}));
  return s;
 },
 [K+'flux']:(p)=>{
  let s=TF(`\\Phi=\\iint_D ${bE}(\\mathbf{s}(u,v))\\cdot(${su}\\times${sv})\\,du\\,dv`,600,190,50,1080);
  s+=fade(seg(p,.5,.7),L('u と v の 二重積分',600,320,{size:32,color:C.hi,weight:700}));
  s+=fade(seg(p,.6,.8),L('（D：u と v が動く範囲）',600,380,{size:24,color:C.dim}));
  return s;
 },
 [K+'compare']:(p)=>{
  let s=L('線積分',170,170,{size:28,color:CU,weight:700})+TF(`\\int ${bE}\\cdot${cc(CU,"\\mathbf{r}'(u)\\,du")}`,600,170,46,700);
  s+=fade(seg(p,.2,.4),L('面積分',170,320,{size:28,color:CN,weight:700})+TF(`\\iint ${bE}\\cdot${cc(CN,'(\\mathbf{s}_u\\times\\mathbf{s}_v)\\,du\\,dv')}`,600,320,46,700));
  s+=fade(seg(p,.45,.65),arrow(600,215,600,270,{color:C.dim,w:3,head:12})+L('一歩 → タイル',760,250,{size:24,color:C.dim}));
  return s;
 },
 ...(()=>{
  const V=view(230,370,300);
  const sq=(g=1)=>{const c=[[0,0,0],[1,0,0],[1,1,0],[0,1,0]].map(V.P);let s=poly(c,{fill:CN,fo:.12,stroke:CN,sw:2.5});
   for(let k=1;k<5;k++){const a=V.P([k/5,0,0]),b=V.P([k/5,1,0]),c2=V.P([0,k/5,0]),d=V.P([1,k/5,0]);s+=line(a[0],a[1],b[0],b[1],{color:CU,w:1.2,opacity:.6})+line(c2[0],c2[1],d[0],d[1],{color:CV,w:1.2,opacity:.6});}
   const o=V.P([0,0,0]);s+=label('x',V.P([1.15,0,0])[0],V.P([1.15,0,0])[1]+8,{size:24,color:C.dim})+label('y',V.P([0,1.2,0])[0],V.P([0,1.2,0])[1],{size:24,color:C.dim});
   return fade(g,s);};
  return {
   [K+'flat']:(p)=>{
    let s=sq(seg(p,.05,.3));
    s+=arrow3(V,[0,0,0],[1,0,0],{k:.45,color:CU,w:6,lab:'(1, 0, 0)',ldx:4,ldy:30,g:seg(p,.45,.65),size:22});
    s+=arrow3(V,[0,0,0],[0,1,0],{k:.45,color:CV,w:6,lab:'(0, 1, 0)',ldx:-6,ldy:-10,g:seg(p,.55,.75),size:22,anchor:'end'});
    s+=T('\\mathbf{s}(u,v)=(u,\\ v,\\ 0)',PR.cx,150,44);
    s+=fade(seg(p,.45,.65),T(`${su}=(1,0,0),\\quad ${sv}=(0,1,0)`,PR.cx,250,38));
    return s;
   },
   [K+'flat2']:(p)=>{
    let s=sq()+arrow3(V,[0,0,0],[1,0,0],{k:.45,color:CU,w:6})+arrow3(V,[0,0,0],[0,1,0],{k:.45,color:CV,w:6});
    s+=arrow3(V,[.5,.5,0],[0,0,1],{k:.8,color:CN,w:6,lab:'(0, 0, 1)',ldx:10,ldy:4,g:seg(p,.3,.55),size:24});
    s+=TF('(1,0,0)\\times(0,1,0)=(0,0,1)',PR.cx,150,42,600,{color:CN});
    s+=fade(seg(p,.45,.65),L('上向き・長さ 1',PR.cx,240,{size:28,color:CN,weight:700}));
    s+=fade(seg(p,.6,.8),T(`${bA}=(0,0,1)\\,du\\,dv`,PR.cx,320,40));
    return s;
   },
  };
 })(),

 // ===== S3 球面 =====
 ...(()=>{
  const ox=290,oy=280,R=190,V=view(ox,oy,R,-2.2);
  const th0=1.0,ph0=.6,pt=sph(th0,ph0);
  const axis=(g=1)=>{const n=V.P([0,0,1.25]),sP=V.P([0,0,-1.25]);return fade(g,line(sP[0],sP[1],n[0],n[1],{color:C.dim,w:1.5,dash:'5 6'})+label('北極',V.P([0,0,1])[0]+10,V.P([0,0,1])[1]-8,{size:22,color:C.dim}));};
  const ball=(o={})=>sphere(V,ox,oy,R,{grid:o.grid??.8})+axis();
  const latC=(th,color=CA,w=3)=>curve3(V,u=>sph(th,2*Math.PI*u),{color,w});
  const merC=(ph,color=CA,w=3,t1=Math.PI)=>curve3(V,u=>sph(t1*u,ph),{color,w});
  const ptDot=()=>{const q=V.P(pt);return dot(q[0],q[1],7,C.ink);};
  return {
   [K+'intro']:(p)=>{
    let s=ball({grid:seg(p,.1,.4)});
    s+=card(PR.x+40,120,PR.w-40,250,L('中級：公式として 使っただけ',PR.cx+20,180,{size:26,color:C.dim})+T('A=4\\pi R^2',PR.cx+20,260,52,{color:CN})+fade(seg(p,.5,.7),L('今回は 導く',PR.cx+20,330,{size:30,color:C.hi,weight:700})),seg(p,.02,.15));
    return s;
   },
   [K+'coords']:(p)=>{
    let s=ball()+fade(seg(p,.1,.35),merC(ph0,CA,4,th0))+ptDot();
    s+=fade(seg(p,.1,.35),label('θ',V.P(sph(th0/2,ph0))[0]+12,V.P(sph(th0/2,ph0))[1],{size:30,color:CA,weight:700}));
    s+=fade(seg(p,.4,.65),curve3(V,u=>sph(Math.PI/2,ph0*u),{color:CA,w:4})+label('φ',V.P(sph(Math.PI/2,ph0/2))[0]-4,V.P(sph(Math.PI/2,ph0/2))[1]+34,{size:30,color:CA,weight:700}));
    s+=card(PR.x+40,120,PR.w-40,250,L('θ：北極から測る角',PR.cx+20,180,{size:28,color:CA,weight:700})+L('φ：軸の周りの角',PR.cx+20,235,{size:28,color:CA,weight:700})+fade(seg(p,.6,.8),T('0\\le\\theta\\le\\pi,\\quad 0\\le\\varphi\\le2\\pi',PR.cx+20,315,36)),seg(p,.02,.15));
    return s;
   },
   [K+'lat']:(p)=>{
    const z=Math.cos(th0),W=1.0,cq=[[-W,-W,z],[W,-W,z],[W,W,z],[-W,W,z]].map(V.P);
    let s=ball();
    s+=fade(seg(p,.3,.5),poly(cq,{fill:C.hi,fo:.10,stroke:C.hi,sw:1.5}));
    [0,1,2,3,4,5,6,7].forEach(k=>{const q=V.P(sph(th0,ph0+k*Math.PI/4));s+=fade(seg(p,.05+k*.025,.15+k*.025),dot(q[0],q[1],6,CA));});
    s+=fade(seg(p,.45,.65),latC(th0,CA,4));
    s+=card(PR.x+40,130,PR.w-40,230,L('θ が同じ点を 全部集める',PR.cx+20,190,{size:28})+fade(seg(p,.45,.65),L('球を 同じ高さで 切った円',PR.cx+20,265,{size:30,color:CA,weight:700})),seg(p,.02,.15));
    return s;
   },
   [K+'latname']:(p)=>{
    let s=ball()+latC(th0,CA,4);
    s+=fade(seg(p,.5,.7),merC(ph0-1.0,C.ink,3.5));
    s+=card(PR.x+40,130,PR.w-40,230,L('同じ高さで切った円 ＝ 緯線',PR.cx+20,200,{size:30,color:CA,weight:700})+fade(seg(p,.5,.7),L('北極と南極を結ぶ半円 ＝ 経線',PR.cx+20,280,{size:28,color:C.ink,weight:700})),seg(p,.02,.15));
    return s;
   },
   [K+'latr']:(p)=>{
    const c=V.P([0,0,Math.cos(th0)]),q=V.P(pt);
    let s=ball()+latC(th0,CA,4)+ptDot();
    s+=fade(seg(p,.15,.35),line(c[0],c[1],q[0],q[1],{color:C.hi,w:3})+label('R sinθ',(c[0]+q[0])/2,(c[1]+q[1])/2-10,{size:24,color:C.hi,weight:700,anchor:'middle'}));
    s+=card(PR.x+40,130,PR.w-40,230,L('緯線（円）の 大きさ',PR.cx+20,190,{size:28})+fade(seg(p,.15,.35),L('半径 R sinθ',PR.cx+20,255,{size:30,color:C.hi,weight:700}))+fade(seg(p,.55,.75),L('高さ R cosθ',PR.cx+20,315,{size:28})),seg(p,.02,.15));
    return s;
   },
   [K+'lat2']:(p)=>{
    const c=V.P([0,0,Math.cos(th0)]),q=V.P(pt);
    let s=ball()+latC(th0,CA,3)+line(c[0],c[1],q[0],q[1],{color:C.hi,w:2.5})+fade(seg(p,.05,.3),curve3(V,u=>sph(th0,ph0*u),{color:CV,w:5}))+ptDot();
    s+=fade(seg(p,.05,.3),label('φ',V.P(sph(th0,ph0/2))[0]+6,V.P(sph(th0,ph0/2))[1]+30,{size:28,color:CA,weight:700}));
    s+=TF('\\mathbf{s}=R(\\sin\\theta\\cos\\varphi,\\ \\sin\\theta\\sin\\varphi,\\ \\cos\\theta)',PR.cx+20,200,40,580);
    s+=fade(seg(p,.4,.6),L('x, y：緯線の円（半径 R sinθ）　z：高さ R cosθ',PR.cx+20,300,{size:22,color:C.dim}));
    return s;
   },
   [K+'sth']:(p)=>{
    let s=ball()+merC(ph0,C.dim,2.5)+ptDot();
    s+=arrow3(V,pt,sTh(th0,ph0),{k:.5,color:CU,w:6,lab:'∂𝐬/∂θ',ldx:8,ldy:22,g:seg(p,.2,.45),size:24});
    s+=TF('\\frac{\\partial\\mathbf{s}}{\\partial\\theta}=R(\\cos\\theta\\cos\\varphi,\\ \\cos\\theta\\sin\\varphi,\\ -\\sin\\theta)',PR.cx+20,170,36,600,{color:CU});
    s+=fade(seg(p,.55,.75),L('経線に沿って 南へ・長さ R',PR.cx+20,280,{size:28,color:CU,weight:700}));
    return s;
   },
   [K+'sph']:(p)=>{
    let s=ball()+latC(th0,C.dim,2.5)+ptDot()+arrow3(V,pt,sTh(th0,ph0),{k:.5,color:CU,w:5});
    s+=arrow3(V,pt,sPh(th0,ph0),{k:.5,color:CV,w:6,lab:'∂𝐬/∂φ',ldx:6,ldy:-8,g:seg(p,.2,.45),size:24});
    s+=TF('\\frac{\\partial\\mathbf{s}}{\\partial\\varphi}=R(-\\sin\\theta\\sin\\varphi,\\ \\sin\\theta\\cos\\varphi,\\ 0)',PR.cx+20,170,36,600,{color:CV});
    s+=fade(seg(p,.55,.75),L('緯線に沿って 東へ・長さ R sinθ',PR.cx+20,280,{size:28,color:CV,weight:700}));
    return s;
   },
   [K+'perp']:(p)=>{
    let s=ball()+ptDot()+arrow3(V,pt,sTh(th0,ph0),{k:.5,color:CU,w:5})+arrow3(V,pt,sPh(th0,ph0),{k:.5,color:CV,w:5});
    {const a=V.P(add(pt,sTh(th0,ph0),.12)),b=V.P(add(add(pt,sTh(th0,ph0),.12),sPh(th0,ph0),.12/Math.sin(th0)*Math.sin(th0))),c=V.P(add(pt,sPh(th0,ph0),.12));s+=fade(seg(p,.6,.8),draw([a,b,c],1,{color:C.ink,w:2.5}));}
    s+=TF(`${cc(C.a,'-R^2\\sin\\theta\\cos\\theta\\sin\\varphi\\cos\\varphi')}+${cc(C.a,'R^2\\sin\\theta\\cos\\theta\\sin\\varphi\\cos\\varphi')}+0`,PR.cx+20,150,30,600);
    s+=fade(seg(p,.3,.5),L('最初の2項が 打ち消し合う',PR.cx+20,230,{size:26,color:C.a}));
    s+=fade(seg(p,.5,.7),L('内積 ＝ 0 → 直角',PR.cx+20,300,{size:32,color:C.hi,weight:700}));
    return s;
   },
   [K+'dAs']:(p)=>{
    const dth=.25,dph=.35,c=[sph(th0,ph0),sph(th0+dth,ph0),sph(th0+dth,ph0+dph),sph(th0,ph0+dph)].map(V.P);
    let s=ball()+fade(seg(p,.05,.25),poly(c,{fill:CN,fo:.4,stroke:CN,sw:2}));
    s+=fade(seg(p,.15,.35),label('R dθ',(c[0][0]+c[1][0])/2-10,(c[0][1]+c[1][1])/2,{size:24,color:CU,weight:700,anchor:'end'})+label('R sinθ dφ',(c[0][0]+c[3][0])/2+10,(c[0][1]+c[3][1])/2-14,{size:24,color:CV,weight:700}));
    s+=TF('dA=R\\times R\\sin\\theta\\,d\\theta\\,d\\varphi',PR.cx+20,170,40,600);
    s+=fade(seg(p,.45,.65),T('=R^2\\sin\\theta\\,d\\theta\\,d\\varphi',PR.cx+40,270,46,{color:CN}));
    s+=fade(seg(p,.05,.2),L('直角なので sinγ＝1',PR.cx+20,370,{size:24,color:C.dim}));
    return s;
   },
   [K+'pole']:(p)=>{
    const tileAt=(th,g)=>{const c=[sph(th,ph0),sph(th+.25,ph0),sph(th+.25,ph0+.5),sph(th,ph0+.5)].map(V.P);return fade(g,poly(c,{fill:CN,fo:.45,stroke:CN,sw:2}));};
    let s=ball()+tileAt(.2,seg(p,.05,.25))+tileAt(1.45,seg(p,.2,.4));
    s+=fade(seg(p,.05,.25),label('北極の近く：細い',V.P(sph(.3,ph0+.6))[0]+16,V.P(sph(.3,ph0+.6))[1]-6,{size:24,color:CN,weight:700}));
    s+=fade(seg(p,.2,.4),label('赤道：太い',V.P(sph(1.55,ph0+.6))[0]+16,V.P(sph(1.55,ph0+.6))[1]+6,{size:24,color:CN,weight:700}));
    s+=card(PR.x+100,140,PR.w-100,200,L('同じ dθ・dφ でも',PR.cx+50,200,{size:28})+L('sinθ が小さいと 細い',PR.cx+50,265,{size:30,color:C.hi,weight:700}),seg(p,.3,.5));
    return s;
   },
   [K+'outward']:(p)=>{
    const q=sph(Math.PI/2,0);
    let s=ball()+(()=>{const a=V.P(q);return dot(a[0],a[1],7,C.ink);})();
    s+=arrow3(V,q,sTh(Math.PI/2,0),{k:.45,color:CU,w:6,lab:'南',ldx:8,ldy:20,g:seg(p,.1,.3)});
    s+=arrow3(V,q,sPh(Math.PI/2,0),{k:.45,color:CV,w:6,lab:'東',ldx:6,ldy:-6,g:seg(p,.25,.45)});
    s+=arrow3(V,q,[1,0,0],{k:.6,color:CN,w:6,lab:'外向き',ldx:-8,ldy:-14,anchor:'end',g:seg(p,.5,.7)});
    s+=TF('(0,0,-1)\\times(0,1,0)=(1,0,0)',PR.cx+20,170,38,600,{color:CN});
    s+=fade(seg(p,.05,.2),L('赤道・φ＝0 の点（R＝1 で）',PR.cx+20,250,{size:24,color:C.dim}));
    s+=fade(seg(p,.6,.8),L('南 × 東 → 外向き',PR.cx+20,320,{size:30,color:CN,weight:700}));
    return s;
   },
   [K+'range']:(p)=>{
    let s=ball({grid:.4});
    s+=fade(seg(p,.05,.4),merC(ph0,CA,4,Math.PI*seg(p,.05,.4)));
    s+=fade(seg(p,.4,.8),curve3(V,u=>sph(Math.PI/2,2*Math.PI*u*seg(p,.4,.8)),{color:CA,w:4}));
    s+=card(PR.x+40,140,PR.w-40,210,T('0\\le\\theta\\le\\pi,\\quad 0\\le\\varphi\\le2\\pi',PR.cx+20,205,38)+fade(seg(p,.5,.7),L('球面を 一度ずつ すき間なく',PR.cx+20,280,{size:28,color:C.hi,weight:700})),seg(p,.02,.15));
    return s;
   },
  };
 })(),
 [K+'phiint']:(p)=>{
  let s=TF('A=\\int_0^{2\\pi}\\!\\!\\int_0^{\\pi}R^2\\sin\\theta\\,d\\theta\\,d\\varphi',600,140,50,1000);
  s+=fade(seg(p,.4,.6),TF('=2\\pi R^2\\int_0^{\\pi}\\sin\\theta\\,d\\theta',640,300,50,1000,{color:C.hi}));
  s+=fade(seg(p,.2,.4),L('中身は φ によらない → 2π 倍',600,430,{size:28,color:CA,weight:700}));
  return s;
 },
 [K+'thint']:(p)=>{
  let s=T('\\int_0^{\\pi}\\sin\\theta\\,d\\theta=\\Big[-\\cos\\theta\\Big]_0^{\\pi}',600,140,48);
  s+=fade(seg(p,.35,.55),T('=-\\cos\\pi-(-\\cos0)',600,270,48));
  s+=fade(seg(p,.6,.8),T('=1+1=2',640,390,52,{color:C.hi}));
  return s;
 },
 [K+'result']:(p)=>{
  let s=T('A=R^2\\times2\\pi\\times2',600,170,54);
  s+=fade(seg(p,.25,.45),T('=4\\pi R^2',600,300,66,{color:CN})+rect(470,240,260,100,{fill:'none',fo:0,stroke:CN,sw:3,rx:12}));
  s+=fade(seg(p,.55,.75),L('中級の球の面積を 二重積分から導いた',600,430,{size:28,color:C.hi,weight:700}));
  return s;
 },

 // ===== S4 一様でない電気束 =====
 [K+'setup']:(p)=>{
  let s=T(`${bE}=\\beta\\,(z,\\ 0,\\ x)`,600,170,58);
  s+=fade(seg(p,.3,.5),L('前半とは別の 例の静電場（β は定数）',600,280,{size:28}));
  s+=fade(seg(p,.55,.75),L('場所で変わる電場を そのまま積分する',600,360,{size:28,color:C.hi,weight:700}));
  return s;
 },
 [K+'square']:(p)=>{
  let s=square({g:seg(p,.05,.3)});
  s+=fade(seg(p,.4,.6),ring(sqX(.5),sqY(.5),22,{color:CN,w:3})+dot(sqX(.5),sqY(.5),6,CN)+label('法線 ⊙（手前＝上向き）',sqX(.5),sqY(.5)+52,{size:22,color:CN,anchor:'middle',weight:700}));
  s+=card(PR.x+40,130,PR.w-40,230,L('z＝0 の正方形',PR.cx+20,190,{size:30,weight:700})+L('0 ≦ x ≦ L、0 ≦ y ≦ L',PR.cx+20,250,{size:28})+fade(seg(p,.4,.6),L('法線は 上向き',PR.cx+20,310,{size:28,color:CN,weight:700})),seg(p,.02,.15));
  return s;
 },
 [K+'param']:(p)=>{
  let s=square()+ring(sqX(.5),sqY(.5),22,{color:CN,w:3})+dot(sqX(.5),sqY(.5),6,CN);
  s+=T('\\mathbf{s}(u,v)=(u,\\ v,\\ 0)',PR.cx,150,44);
  s+=fade(seg(p,.35,.55),T(`${bA}=(0,\\ 0,\\ 1)\\,du\\,dv`,PR.cx,250,44));
  s+=fade(seg(p,.35,.55),L('（平らな正方形と同じ）',PR.cx,330,{size:24,color:C.dim}));
  return s;
 },
 [K+'onsurf']:(p)=>{
  let s=square()+odots({g:seg(p,.3,.6)});
  s+=T('z=0,\\ x=u',PR.cx,120,38,{color:C.dim});
  s+=fade(seg(p,.15,.35),T(`${bE}=(0,\\ 0,\\ \\beta u)`,PR.cx,210,46));
  s+=fade(seg(p,.45,.65),L('面に垂直（⊙ 手前向き）',PR.cx,300,{size:28,color:CE,weight:700}));
  s+=fade(seg(p,.6,.8),L('右へ行くほど 強い（⊙ が大きい）',PR.cx,355,{size:26}));
  return s;
 },
 [K+'dot']:(p)=>{
  let s=square()+odots();
  s+=TF(`${bE}\\cdot${bA}=\\beta u\\,du\\,dv`,PR.cx,190,48,600);
  s+=fade(seg(p,.4,.6),L('積分する関数が 決まった',PR.cx,290,{size:28,color:C.hi,weight:700}));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=square()+odots({g:.6});
  s+=card(PR.x+40,130,PR.w-40,240,L('一番強い βL × 面積 L²',PR.cx+20,195,{size:30})+T('=\\beta L^3\\ ?',PR.cx+20,270,46,{color:C.hi})+fade(seg(p,.5,.7),L('予想してみよう',PR.cx+20,335,{size:24,color:C.hi})),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'strip']:(p)=>{
  let s=square({strip:.45})+odots({g:.35});
  s+=fade(seg(p,.05,.25),label('v を止めた 細い帯',sqX(1)+12,sqY(.5)+8,{size:22,color:C.hi,weight:700}));
  // inset graph βu over the strip
  const gx=720,gy=430,gw=240,gh=150;
  s+=fade(seg(p,.25,.45),arrow(gx-6,gy,gx+gw+30,gy,{color:C.dim,w:2.5,head:12})+arrow(gx,gy+6,gx,gy-gh-30,{color:C.dim,w:2.5,head:12})+label('u',gx+gw+36,gy+8,{size:22,color:C.dim})+label('L',gx+gw,gy+28,{size:22,color:C.dim,anchor:'middle'})+label('βL',gx-10,gy-gh+8,{size:22,color:C.dim,anchor:'end'})
   +poly([[gx,gy],[gx+gw,gy-gh],[gx+gw,gy]],{fill:CE,fo:.25,stroke:CE,sw:3})+label('βu',gx+gw/2-20,gy-gh/2-14,{size:24,color:CE,anchor:'end'}));
  s+=TF('\\int_0^L\\beta u\\,du=\\beta\\left[\\frac{u^2}{2}\\right]_0^L=\\frac{\\beta L^2}{2}',PR.cx+20,120,40,600,{color:C.hi});
  return s;
 },
 [K+'stack']:(p)=>{
  let s=square({stack:seg(p,.05,.6)});
  s+=TF('\\Phi=\\int_0^L\\frac{\\beta L^2}{2}\\,dv',PR.cx+20,140,44,600);
  s+=fade(seg(p,.4,.6),L('帯の値は v によらない → L 倍',PR.cx+20,250,{size:26}));
  s+=fade(seg(p,.6,.8),T('=\\frac{\\beta L^3}{2}',PR.cx+40,340,52,{color:C.hi}));
  return s;
 },
 [K+'num']:(p)=>{
  let s=TF('\\Phi=\\frac{(1\\ \\mathrm{V/m^2})(1\\ \\mathrm{m})^3}{2}=0.5\\ \\mathrm{V\\cdot m}',600,150,48,1000,{color:C.hi});
  s+=fade(seg(p,.4,.6),T('\\beta L\\times L^2=1\\ \\mathrm{V\\cdot m}',600,300,44,{color:C.a})+line(450,300-8,750,300-8,{color:C.a,w:4}));
  s+=fade(seg(p,.4,.6),L('最大値 × 面積 は 誤り',600,380,{size:30,color:C.a,weight:700}));
  return s;
 },
 [K+'tri']:(p)=>{
  const gx=160,gy=430,gw=380,gh=260;
  let s=arrow(gx-6,gy,gx+gw+30,gy,{color:C.dim,w:2.5,head:12})+arrow(gx,gy+6,gx,gy-gh-30,{color:C.dim,w:2.5,head:12})+label('u',gx+gw+36,gy+8,{size:22,color:C.dim})+label('L',gx+gw,gy+28,{size:22,color:C.dim,anchor:'middle'})+label('βL',gx-10,gy-gh+8,{size:22,color:C.dim,anchor:'end'});
  s+=poly([[gx,gy],[gx+gw,gy-gh],[gx+gw,gy]],{fill:CE,fo:.25,stroke:CE,sw:3});
  s+=fade(seg(p,.2,.4),line(gx,gy-gh/2,gx+gw,gy-gh/2,{color:C.hi,w:3,dash:'8 6'})+label('平均 βL/2',gx+gw+10,gy-gh/2+8,{size:24,color:C.hi,weight:700}));
  s+=fade(seg(p,.55,.75),L('三角形の面積 ＝ ½ × L × βL',870,200,{size:28}));
  s+=fade(seg(p,.55,.75),L('½ はここから',870,260,{size:28,color:C.hi,weight:700}));
  return s;
 },

 // ===== S5 =====
 [K+'sum']:(p)=>{
  let s=card(80,130,480,240,L('道：目盛り 1つ',320,185,{size:28,color:CU,weight:700})+T(`\\int(\\cdots)\\,${cc(CU,"\\mathbf{r}'(u)")}\\,du`,320,275,40),seg(p,.02,.15));
  s+=card(640,130,480,240,L('面：目盛り 2つ',880,185,{size:28,color:CN,weight:700})+T(`\\iint(\\cdots)\\cdot(${su}\\times${sv})\\,du\\,dv`,880,275,36),seg(p,.2,.35));
  return s;
 },
 ...(()=>{
  const ox=300,oy=270,R=170,V=view(ox,oy,R,-2.2);
  return {
   [K+'sum2']:(p)=>{
    let s=sphere(V,ox,oy,R,{grid:.6});
    s+=card(PR.x+40,130,PR.w-40,240,T('A=4\\pi R^2',PR.cx+20,200,44,{color:CN})+fade(seg(p,.3,.5),T('\\Phi=\\frac{\\beta L^3}{2}=0.5\\ \\mathrm{V\\cdot m}',PR.cx+20,295,38,{color:C.hi})),seg(p,.02,.15));
    return s;
   },
   [K+'next']:(p)=>{
    let s=sphere(V,ox,oy,R,{grid:.4})+dot(ox,oy,12,C.a)+label('＋',ox,oy+8,{size:20,color:'#0b1122',anchor:'middle',weight:700});
    s+=card(PR.x+40,140,PR.w-40,210,L('中級：電荷が 球の中心',PR.cx+20,210,{size:30,color:C.ink,weight:700})+L('のときだけ 計算した',PR.cx+20,270,{size:28}),seg(p,.05,.2));
    return s;
   },
   [K+'next2']:(p)=>{
    const dx=mix(0,85,seg(p,.1,.5));
    let s=sphere(V,ox,oy,R,{grid:.4})+dot(ox+dx,oy-dx*.3,12,C.a)+label('＋',ox+dx,oy-dx*.3+8,{size:20,color:'#0b1122',anchor:'middle',weight:700});
    s+=card(PR.x+40,130,PR.w-40,240,L('中心から ずれた電荷でも',PR.cx+20,195,{size:30})+L('面を取り替えずに',PR.cx+20,255,{size:28})+L('積分で 確かめられる？',PR.cx+20,315,{size:32,color:C.hi,weight:700}),seg(p,.05,.2),C.hi);
    return s;
   },
  };
 })(),
};

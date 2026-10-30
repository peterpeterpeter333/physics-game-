// Diagrams for the v3 (深く学ぶモード) Maxwell film, part p78. Keys: 'mxN-n-<name>' (N = chapter number).
// Chapter 7: the wave travels along +x, E (cyan) along +y, B (orange) along +z (toward the
// viewer in the side view, so E × B points along +x). The speed is derived with a step front
// (a calculation idealisation) and two calculation paths (not wires):
//  ③ side view, path in the xy plane, counter-clockwise on screen (normal +z, same as B):
//     left side runs down against E → ∮E·dr = −Eh = −dΦB/dt = −Bhv → E = vB.
//  ④ view along y (E points away, ⊗), path in the xz plane, clockwise on screen (normal +y):
//     left side runs up along B → ∮B·dr = +Bw = ε₀μ₀ dΦE/dt = ε₀μ₀Ewv → B = ε₀μ₀vE.
// Chapter 8: a short recap (fullBar), a fact check and a reasoning check, glass as next time's question.
// Timings are fractions of the voice (ctx.t / voice end) so they hold for any audio length.
import {MX,C,clamp,mix,smooth,fade,label,line,dot,ring,draw,arrow,tex,texWidth,stage,word,callout,check,magnet,fit,EQ,evidenceCard} from './mx-common.mjs';
import {poly} from './anim.mjs';

// ---- timing ---------------------------------------------------------------------------------
const VE=ctx=>Math.max(.6,ctx.dur-(ctx.cue?.pause??0)-.12);
const vp=ctx=>ctx.t/VE(ctx);
const W=(ctx,a,b)=>smooth(clamp((vp(ctx)-a)/Math.max(1e-3,b-a)));
const at=(ctx,f,d=.5)=>smooth(clamp((ctx.t-f*VE(ctx))/d));
const after=(ctx,s)=>ctx.t-VE(ctx)-s;

// ---- formulas -------------------------------------------------------------------------------
const cE=s=>`{\\color{${MX.E}}${s}}`,cB=s=>`{\\color{${MX.B}}${s}}`,cV=s=>`{\\color{${MX.hi}}${s}}`;
const Es=cE('E'),Bs=cB('B'),vs=cV('v'),e0m0='\\varepsilon_0\\mu_0',e0m0c=`${cE('\\varepsilon_0')}${cB('\\mu_0')}`;
const T=(src,x,y,size=40,o={})=>tex(src,x,y,{size,auto:false,color:MX.ink,...o});
const box=(x,y,src,size,color=MX.hi)=>{const w=texWidth(src,size,false)+36;return `<rect x="${x-w/2}" y="${y-size*.95}" width="${w}" height="${size*1.45}" rx="12" fill="${color}" fill-opacity=".08" stroke="${color}" stroke-width="2.5"/>`;};
const sparkle=(x,y,r,g)=>fade(g,`<path d="M${x} ${y-r} L${x+r*.3} ${y-r*.3} L${x+r} ${y} L${x+r*.3} ${y+r*.3} L${x} ${y+r} L${x-r*.3} ${y+r*.3} L${x-r} ${y} L${x-r*.3} ${y-r*.3} Z" fill="${MX.hi}"/>`);
const ROW=(toks,size,cx)=>{const gap=size*.3,w=toks.map(t=>texWidth(t,size,false));let x=cx-(w.reduce((a,b)=>a+b,0)+gap*(w.length-1))/2;return toks.map((t,i)=>{const r={t,x,w:w[i],c:x+w[i]/2};x+=w[i]+gap;return r;});};
const strike=(q,y,size,g)=>fade(g,line(q.x-6,y+size*.3,q.x+q.w+6,y-size*.65,{color:MX.plus,w:5}));

// ---- 3-D camera (from mxD) -------------------------------------------------------------------
const OY=330;
function cam(th,sh=0){const c=Math.cos(th),s=Math.sin(th);return (x,y,z)=>{const yp=y*c+z*s,zp=-y*s+z*c;return [x+sh*zp,OY-yp,zp];};}
const OBL=[-.6,-.38],SIDE=[0,0],TOP=[Math.PI/2,0];
const camMix=(a,b,u)=>cam(mix(a[0],b[0],u),mix(a[1],b[1],u));
function sym(x,y,out,color,g=1,r=10){return fade(g,ring(x,y,r,{color,w:3,fill:MX.bg})+(out?dot(x,y,r*.4,color):line(x-r*.6,y-r*.6,x+r*.6,y+r*.6,{color,w:3})+line(x-r*.6,y+r*.6,x+r*.6,y-r*.6,{color,w:3})));}
function arr3(P,a,b,color,{w=4,g=1,head=14}={}){
 if(g<=.001)return '';const A=P(...a),B=P(...b),L=Math.hypot(B[0]-A[0],B[1]-A[1]),L3=Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]);
 const s=L<18&&L3>40?sym((A[0]+B[0])/2,(A[1]+B[1])/2,B[2]>A[2],color,g*(1-L/18)):'';
 return s+(L>14?arrow(A[0],A[1],B[0],B[1],{color,w,head:Math.min(head,L*.45),opacity:g*clamp((L-14)/12)}):'');
}
function hull(pts){pts=pts.map(p=>[p[0],p[1]]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);const lo=[],up=[];
 for(const p of pts){while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop();lo.push(p);}
 for(const p of [...pts].reverse()){while(up.length>=2&&cr(up[up.length-2],up[up.length-1],p)<=0)up.pop();up.push(p);}return lo.slice(0,-1).concat(up.slice(0,-1));}
const P2=(P,pts)=>pts.map(q=>{const r=P(...q);return [r[0],r[1]];});
function closed(P,pts,{color=MX.ink,w=4,p=1,dash=''}={}){const q=P2(P,[...pts,pts[0]]);return draw(q,p,{color,w,dash});}

const DX=40,AMP=100;
// E arrows (y) and B arrows (z) sampled along x. gAt(x) scales each sample (used to single out one place).
function field(P,f,{x0=20,x1=1180,g=1,gE=1,gB=1,extraB=0,extraE=0,curves=true,dx=DX,gAt=null,wAt=null,cg=1}={}){
 let s='';const DXl=dx;
 for(let x=x0;x<=x1;x+=DXl){const a=f(x);if(Math.abs(a)<.02)continue;const k=gAt?gAt(x):1,w=wAt?wAt(x):3.5;
  s+=arr3(P,[x,0,0],[x,AMP*a,0],MX.E,{g:g*gE*k,w})+arr3(P,[x,0,0],[x,0,AMP*a],MX.B,{g:g*gB*k,w});
  if(extraB>0&&x+DXl/2<=x1&&Math.abs(f(x+DXl/2))>.5)for(const y of [-65,65])s+=arr3(P,[x+DXl/2,y,-30*f(x+DXl/2)],[x+DXl/2,y,30*f(x+DXl/2)],MX.B,{g:g*extraB,w:3});
  if(extraE>0&&x+DXl/2<=x1&&Math.abs(f(x+DXl/2))>.5)for(const z of [-65,65])s+=arr3(P,[x+DXl/2,-30*f(x+DXl/2),z],[x+DXl/2,30*f(x+DXl/2),z],MX.E,{g:g*extraE,w:3});}
 if(curves){const ce=[],cb=[];for(let x=x0;x<=x1;x+=6){const a=f(x);ce.push(P(x,AMP*a,0));cb.push(P(x,0,AMP*a));}
  s=fade(g*gB*.8*cg,draw(cb.map(q=>[q[0],q[1]]),1,{color:MX.B,w:2.5}))+fade(g*gE*.8*cg,draw(ce.map(q=>[q[0],q[1]]),1,{color:MX.E,w:2.5}))+s;}
 return s;
}
const axisX=(P,g=1)=>{const a=P(0,0,0),b=P(1185,0,0);return fade(g,line(a[0],a[1],b[0],b[1],{color:'#3b4d70',w:2,dash:'6 8'}));};
function slab(P,xf,{g=1,x0=0}={}){
 const R=112,bx=[];for(const x of [x0,xf])for(const y of [-R,R])for(const z of [-R,R])bx.push(P(x,y,z));
 const wall=[[xf,-R,-R],[xf,R,-R],[xf,R,R],[xf,-R,R]];
 return fade(g,poly(hull(bx),{fill:MX.E,fo:.05,stroke:'none'}))+fade(g,poly(P2(P,wall),{fill:MX.hi,fo:.10,stroke:MX.hi,sw:3}));
}
const frontV=(P,xf,g)=>{const x=P(xf,0,0)[0];return fade(g,arrow(x+6,160,x+96,160,{color:MX.hi,w:6,head:18})+label('v',x+106,170,{size:34,color:MX.hi,weight:700}));};
const step=xf=>x=>x<xf?1:0;
const LAM=320,KX=2*Math.PI/LAM;
const sineAt=ctx=>x=>Math.sin(KX*(x-120*ctx.t));

// chain of loops (schematic)
const WIREX=110,LINKS=[110,200,290,380,470,560,650,740];
function linkLoop(P,cx,kind,p,{r=80,color,g=1}){
 const pts=[];for(let i=0;i<=72;i++){const a=Math.PI+2*Math.PI*i/72,u=Math.cos(a)*r,v=Math.sin(a)*r;pts.push(kind==='B'?P(cx+u,0,v):P(cx+u,v,0));}
 const q=pts.map(z=>[z[0],z[1]]);let s=draw(q,p,{color,w:4.5});
 if(p>.3){const i=18,a=q[i],b=q[i+2],ang=Math.atan2(b[1]-a[1],b[0]-a[0]);s+=`<polygon points="${b[0]+12*Math.cos(ang)},${b[1]+12*Math.sin(ang)} ${b[0]-8*Math.cos(ang)+7*Math.sin(ang)},${b[1]-8*Math.sin(ang)-7*Math.cos(ang)} ${b[0]-8*Math.cos(ang)-7*Math.sin(ang)},${b[1]-8*Math.sin(ang)+7*Math.cos(ang)}" fill="${color}"/>`;}
 return fade(g,s);
}
function wire(P,ctx,{g=1,cur=1}={}){
 const a=P(WIREX,-180,0),b=P(WIREX,180,0);let s=line(a[0],a[1],b[0],b[1],{color:'#9aa6bd',w:10})+line(a[0],a[1],b[0],b[1],{color:'#c9d2e3',w:4});
 if(cur>0){const I=Math.sin(ctx.t*2.6),m=P(WIREX,0,0);
  s+=fade(cur,(Math.abs(I)>.08?arrow(m[0]+26,m[1]+55*I,m[0]+26,m[1]-55*I,{color:MX.I,w:6,head:Math.min(18,40*Math.abs(I))}):'')+label('電流',m[0]+8,m[1]-128,{size:26,color:MX.I,weight:700}));}
 return fade(g,s);
}
const AIR=Array.from({length:60},(_,i)=>[(i*197.3)%1150+30,110+((i*83.7)%390)]);
const air=g=>fade(g,AIR.map(([x,y])=>dot(x,y,3,'#8d9cb8',.5)).join(''));
function chain(P,ctx,shown,{g=1}={}){let s='';LINKS.forEach((x,k)=>{const q=shown(k);if(q<=0)return;const kind=k%2?'E':'B';s+=linkLoop(P,x,kind,q,{color:kind==='E'?MX.E:MX.B,g});});return s;}
const goRight=(g,y=478)=>fade(g,arrow(880,y,1130,y,{color:MX.hi,w:6,head:20})+label('進む向き',860,y+10,{size:28,color:MX.hi,anchor:'end',weight:700}));

const SURF='#c9b0ff';// the surface bounded by a calculation path ("through the surface"); the path itself is ink
// a curled arrow around (cx,cy): ccw on screen when ccw=true
function curl(cx,cy,r,ccw,color,g=1,w=4){
 const pts=[];for(let i=0;i<=40;i++){const a=(ccw?1:-1)*(Math.PI*.35+Math.PI*1.6*i/40);pts.push([cx+r*Math.cos(a),cy-r*Math.sin(a)]);}
 const b=pts[40],a=pts[38],ang=Math.atan2(b[1]-a[1],b[0]-a[0]);
 return fade(g,draw(pts,1,{color,w})+`<polygon points="${b[0]+11*Math.cos(ang)},${b[1]+11*Math.sin(ang)} ${b[0]-7*Math.cos(ang)+7*Math.sin(ang)},${b[1]-7*Math.sin(ang)-7*Math.cos(ang)} ${b[0]-7*Math.cos(ang)-7*Math.sin(ang)},${b[1]-7*Math.sin(ang)+7*Math.cos(ang)}" fill="${color}"/>`);
}

// ---- chapter 7: the ③ derivation (side view) --------------------------------------------------
const LX0=400,LX1=660,LH=80,PX=790,PC=985;
const panel=(inner,g=1)=>callout(770,92,410,413,inner,g);
const pRow=(txt,y,src,{g=1,size=36,col=MX.dim,x=1070}={})=>fade(g,(txt?label(txt,PX,y+8,{size:22,color:col}):'')+T(src,x,y+12,size));
function eq3Head(hl){// hl: 0 both, 1 left side lit, 2 right side lit
 const L=`\\oint ${Es}\\cdot d\\vec r`,R='=-\\dfrac{d\\Phi_B}{dt}',r=ROW([L,R],38,PC);
 return fade(hl===2?.35:1,T(L,r[0].c,158,38))+fade(hl===1?.35:1,T(R,r[1].c,158,38));
}
// the order in which the signs are fixed (review 61): surface normal → loop direction → the two sides
const SIGN3=['1. 面の正の向き：手前','2. 一周の向き：左回り','3. 左辺 −Eh・右辺 −Bhv'];
function signPanel(active){let c=label('符号を決める順番',PX,222,{size:22,color:MX.hi,weight:700});
 SIGN3.forEach((t,i)=>{const col=i===active?MX.hi:i<active?MX.ink:MX.dim;c+=label(t,PX,272+i*48,{size:22,color:col,weight:i===active?700:400});});return c;}
// deriv3 states: 0 loop, 10 why this loop, 1 law ③, 11 surface normal, 2 area, 3 flux, 4 loop direction,
// 12 two roles of the right hand, 5–7 the sides, 8 E = vB, 9 h drops out
function deriv3(ctx,st){
 const P=cam(...SIDE);
 const pre=st===0||st===1||st===10||st===11;
 const xf=st===10?mix(470,560,W(ctx,.62,.95)):pre?470:st===2?mix(470,560,W(ctx,.3,.65)):560;
 const hh=st===9?LH*(1+.38*Math.sin(Math.max(0,ctx.t-.25*VE(ctx))*2.4)*W(ctx,.1,.3)):LH;
 const dimF=st===12?.3:1;
 let s=axisX(P,.5)+fade(dimF,slab(P,xf)+field(P,step(xf),{curves:false,dx:80,extraB:1,gE:st===7?1:st>=4&&st<=9?.75:1}));
 s+=fade(dimF,frontV(P,xf,1));
 const Y0=OY+hh,Y1=OY-hh,m=(LX0+LX1)/2,NX=612;
 // the surface bounded by the path (violet) — only while it matters
 const surfG=st===1?W(ctx,.62,.78):st===11?1:st===4?.5:0;
 if(surfG>0)s+=fade(surfG,poly([[LX0,Y1],[LX1,Y1],[LX1,Y0],[LX0,Y0]],{fill:SURF,fo:.16,stroke:SURF,sw:0}));
 if(st>=2&&st<=9||st===10&&xf>472)s+=poly([[470,Y1],[xf,Y1],[xf,Y0],[470,Y0]],{fill:MX.B,fo:st===2||st===3||st===10?.35:.18,stroke:'none'});
 // the calculation path (dashed, not a wire)
 s+=fade(dimF,draw([[LX0,Y0],[LX1,Y0],[LX1,Y1],[LX0,Y1],[LX0,Y0]],st===0?W(ctx,.05,.3):1,{color:MX.ink,w:st===1?5:4,dash:'14 8'}));
 // dimensions
 if(st===2||st===3){const g=st===2?W(ctx,.2,.35):1;s+=fade(g,line(470,Y0+22,xf,Y0+22,{color:MX.hi,w:3})+line(470,Y0+12,470,Y0+32,{color:MX.hi,w:3})+line(xf,Y0+12,xf,Y0+32,{color:MX.hi,w:3})+T(`${vs}\\,\\Delta t`,(470+xf)/2,Y0+62,28));}
 if(st>=2&&st<=9){const g=st===2?W(ctx,.6,.75):1,hx=LX1+24;s+=fade(g*dimF,arrow(hx,OY,hx,Y1,{color:MX.ink,w:3,head:12})+arrow(hx,OY,hx,Y0,{color:MX.ink,w:3,head:12})+T('h',hx+20,OY+10,32));}
 if(st===1)s+=fade(W(ctx,.3,.45),word('道：沿う成分を 一周足す',20,122,{size:24,color:MX.ink}))+fade(W(ctx,.62,.78),word('面：道を縁とする面を 貫く磁束',20,478,{size:24,color:SURF}));
 if(st===2)s+=fade(W(ctx,.08,.22),word('境目が 道の中を 横切る間',20,122,{size:24,color:MX.hi}));
 if(st===3)s+=fade(W(ctx,.05,.25),word('増えるのは B のある面積（B は一定）',20,122,{size:24,color:MX.B}));
 // surface normal (toward the viewer) for ③
 if(st===11||st===4){const g=st===11?W(ctx,.3,.45):1;s+=fade(g,sym(NX,OY,true,MX.hi,1,16));
  if(st===11)s+=fade(g,word('面の正の向き：手前',20,122,{size:24,color:MX.hi}))+fade(W(ctx,.55,.7),word('磁場も 手前向き → 磁束 ＋',20,478,{size:24,color:MX.B}));}
 // direction of the path (counter-clockwise on screen: normal toward the viewer, like B)
 if(st===4||(st>=5&&st<=8)){const g=st===4?W(ctx,.6,.78):.9,c=MX.ink;
  s+=fade(g,arrow(m-30,Y0,m+20,Y0,{color:c,w:5,head:16})+arrow(LX1,OY+25,LX1,OY-25,{color:c,w:5,head:16})+arrow(m+20,Y1,m-30,Y1,{color:c,w:5,head:16})+arrow(LX0,OY-25,LX0,OY+25,{color:c,w:5,head:16}));
  if(st===4){s+=curl(NX,OY,40,true,MX.hi,W(ctx,.45,.6));
   s+=fade(W(ctx,.2,.35),word('親指：面の正の向き（手前）',20,122,{size:24,color:MX.hi}));
   s+=fade(W(ctx,.5,.65),word('指の巻く向き：一周の正の向き',20,478,{size:24,color:MX.ink}));}}
 // why this rectangle: three sides can be made zero, one side is left
 if(st===10){const g=W(ctx,.08,.3),gl=(pts,col,gg)=>fade(gg*.55,draw(pts,1,{color:col,w:14}));
  s+=gl([[LX1,Y0],[LX1,Y1]],MX.hi,g)+gl([[LX0,Y0],[LX1,Y0]],MX.hi,g)+gl([[LX0,Y1],[LX1,Y1]],MX.hi,g);
  s+=fade(g,label('0',LX1-34,OY-30,{size:32,color:MX.hi,weight:700})+label('0',610,Y1-14,{size:32,color:MX.hi,weight:700})+label('0',610,Y0+40,{size:32,color:MX.hi,weight:700}));
  s+=gl([[LX0,Y0],[LX0,Y1]],MX.E,W(ctx,.3,.45))+fade(W(ctx,.3,.45),word('残る一辺',LX0-26,Y1-30,{size:22,color:MX.E,anchor:'end'}));
  s+=fade(W(ctx,.7,.85),word('道は 固定',LX0-26,Y0+38,{size:22,color:MX.ink,anchor:'end'})+word('動くのは 境目',P(xf,0,0)[0]+20,482,{size:22,color:MX.hi}));}
 // the four sides
 const glow=(pts,g,col=MX.hi)=>fade(g*.55,draw(pts,1,{color:col,w:14}));
 if(st>=5&&st<=8){const g=st===5?W(ctx,.05,.3):.5;s+=glow([[LX1,Y0],[LX1,Y1]],st===5?g:.35)+fade(st===5?g:.6,label('0',LX1-34,OY-30,{size:32,color:MX.hi,weight:700}));}
 if(st>=6&&st<=8){const g=st===6?W(ctx,.05,.3):.5;s+=glow([[LX0,Y0],[LX1,Y0]],st===6?g:.35)+glow([[LX0,Y1],[LX1,Y1]],st===6?g:.35)+fade(st===6?g:.6,label('0',610,Y1-14,{size:32,color:MX.hi,weight:700})+label('0',610,Y0+40,{size:32,color:MX.hi,weight:700}));
  if(st===6)s+=fade(W(ctx,.3,.5),word('道と直角',470,Y1-40,{size:24,color:MX.E,anchor:'middle'}));}
 if(st>=7&&st<=8){const g=st===7?W(ctx,.05,.25):.8;s+=glow([[LX0,Y0],[LX0,Y1]],g);
  s+=fade(st===7?W(ctx,.25,.45):.8,arrow(LX0-16,Y0,LX0-16,Y1,{color:MX.E,w:8,head:20})+word('電場 ↑',LX0-26,Y1-30,{size:22,color:MX.E,anchor:'end'}));
  s+=fade(st===7?W(ctx,.4,.55):.8,arrow(LX0+16,Y1+10,LX0+16,Y0-10,{color:MX.ink,w:6,head:18})+word('道 ↓',LX0-26,Y0+38,{size:22,color:MX.ink,anchor:'end'}));
  s+=fade(st===7?W(ctx,.7,.85):1,word('−E h',LX0-30,OY+10,{size:30,color:MX.E,anchor:'end'}));}
 // two roles of the right hand (review 61)
 if(st===12){const g1=W(ctx,.02,.2),g2=W(ctx,.45,.62);
  let a=`<rect x="25" y="100" width="355" height="330" rx="16" fill="${MX.bg2}" fill-opacity=".97" stroke="${MX.faint}" stroke-width="2"/>`+label('第4章の右手',202,140,{size:24,color:MX.dim,anchor:'middle',weight:700});
  a+=line(202,170,202,370,{color:'#c9d3e6',w:6})+arrow(222,340,222,200,{color:MX.I,w:4,head:12})+`<ellipse cx="202" cy="270" rx="110" ry="30" fill="none" stroke="${MX.B}" stroke-width="3.5"/>`+arrow(178,300,222,300,{color:MX.B,w:4,head:12});
  a+=label('電流 → 磁場の向き',202,410,{size:24,color:MX.ink,anchor:'middle',weight:700});
  let b=`<rect x="400" y="100" width="355" height="330" rx="16" fill="${MX.bg2}" fill-opacity=".97" stroke="${MX.hi}" stroke-width="3"/>`+label('今の右手',577,140,{size:24,color:MX.hi,anchor:'middle',weight:700});
  b+=poly([[487,190],[667,190],[667,350],[487,350]],{fill:SURF,fo:.16,stroke:'none'})+draw([[487,350],[667,350],[667,190],[487,190],[487,350]],1,{color:MX.ink,w:3,dash:'10 6'});
  b+=sym(577,270,true,MX.hi,1,14)+curl(577,270,38,true,MX.hi,1,3.5);
  b+=label('面の向き ↔ 一周の向き',577,392,{size:24,color:MX.ink,anchor:'middle',weight:700})+label('（符号の約束）',577,420,{size:22,color:MX.dim,anchor:'middle'});
  s+=fade(g1,a)+fade(g2,b)+fade(W(ctx,.3,.45),word('形は同じ・役割が違う',390,478,{size:26,color:MX.hi,anchor:'middle',border:MX.hi}));}
 // ---- right panel
 let c='';
 if(st===0){c+=fade(W(ctx,.5,.7),word('計算の道',PC,200,{size:30,anchor:'middle'})+label('電線ではない',PC,270,{size:28,color:MX.hi,anchor:'middle',weight:700}));
  c+=fade(W(ctx,.55,.75),label('法則を使うために',PC,350,{size:24,color:MX.dim,anchor:'middle'})+label('こちらで決めた道',PC,390,{size:24,color:MX.dim,anchor:'middle'}));}
 if(st===10){c+=label('この形を選ぶ理由',PX,140,{size:24,color:MX.hi,weight:700});
  c+=fade(W(ctx,.1,.25),label('右の辺：場がない → 0',PX,200,{size:22,color:MX.ink})+label('上と下の辺：直角 → 0',PX,245,{size:22,color:MX.ink}));
  c+=fade(W(ctx,.3,.45),label('左の辺だけが残る',PX,300,{size:22,color:MX.E,weight:700}));
  c+=fade(W(ctx,.45,.6),label('＋ 面積の増え方と 結べる',PX,345,{size:22,color:MX.B,weight:700}));
  c+=fade(W(ctx,.7,.85),line(PX,380,1160,380,{color:MX.faint,w:2})+label('道：固定したまま',PX,425,{size:22,color:MX.ink})+label('動くのは 境目だけ',PX,468,{size:22,color:MX.hi,weight:700}));}
 if(st===1){c+=eq3Head(0);const r=ROW([`\\oint ${Es}\\cdot d\\vec r`,'=-\\dfrac{d\\Phi_B}{dt}'],38,PC);
  c+=fade(W(ctx,.3,.45),`<rect x="${r[0].x-8}" y="110" width="${r[0].w+12}" height="80" rx="10" fill="none" stroke="${MX.ink}" stroke-width="2.5"/>`+label('道に沿う：一周の足し算',PX,245,{size:22,color:MX.ink,weight:700})+label('道に沿う電場 × 短い長さ',PX,280,{size:22,color:MX.dim}));
  c+=fade(W(ctx,.62,.8),`<rect x="${r[1].x+2}" y="110" width="${r[1].w+8}" height="80" rx="10" fill="none" stroke="${SURF}" stroke-width="2.5"/>`+label('面を貫く：磁束の変化',PX,345,{size:22,color:SURF,weight:700})+label('道を縁とする面を貫く磁束の',PX,380,{size:22,color:MX.dim})+label('1秒あたりの増え方',PX,412,{size:22,color:MX.dim}));}
 if(st===11)c+=eq3Head(2)+signPanel(0)+fade(W(ctx,.55,.7),label('磁束は ＋ で増える',PX,440,{size:22,color:MX.B,weight:700}));
 if(st===4)c+=eq3Head(1)+signPanel(1);
 if(st===12)c+=eq3Head(1)+signPanel(1)+fade(W(ctx,.75,.9),label('手前 → 左回り',PX,440,{size:24,color:MX.hi,weight:700}));
 if(st>=2&&st<=3){c+=eq3Head(2)+label('右辺：磁束の増え方',PX,222,{size:22,color:MX.B,weight:700});
  c+=pRow('進む距離',265,`${vs}\\,\\Delta t`,{g:st===2?W(ctx,.3,.45):.6});
  c+=pRow('新しい面積',330,`h\\cdot ${vs}\\,\\Delta t`,{g:st===2?W(ctx,.75,.9):.6});
  if(st===2)c+=fade(W(ctx,.4,.55),label('v：境目の速さ',PX,400,{size:22,color:MX.hi})+label('h：道の高さ',PX,435,{size:22,color:MX.ink}));
  if(st===3){c+=pRow('磁束の増加',395,`${Bs}\\,h\\,${vs}\\,\\Delta t`,{g:W(ctx,.45,.6)});
   c+=pRow('÷ Δt',465,`${Bs}\\,h\\,${vs}`,{g:W(ctx,.72,.85),size:40,col:MX.hi})+fade(W(ctx,.8,.92),box(1070,477,`${Bs}\\,h\\,${vs}`,40));}}
 if(st>=5&&st<=7){c+=eq3Head(1)+label('左辺：一周の足し算',PX,222,{size:22,color:MX.E,weight:700});
  c+=pRow('右辺',262,`-${Bs}\\,h\\,${vs}`,{size:32,g:.6});
  c+=line(PX,288,1160,288,{color:MX.faint,w:2});
  if(st>=5)c+=pRow('右の辺',322,'0',{size:32,g:st===5?W(ctx,.1,.3):.7});
  if(st>=6)c+=pRow('上と下の辺',372,'0',{size:32,g:st===6?W(ctx,.1,.3):.7});
  if(st>=7){c+=pRow('左の辺',422,`-${Es}\\,h`,{size:32,g:W(ctx,.65,.8)});c+=fade(W(ctx,.8,.95),line(PX,448,1160,448,{color:MX.dim,w:2})+pRow('一周',482,`-${Es}\\,h`,{size:34,col:MX.hi}));}}
 if(st===8){c+=eq3Head(0);
  c+=fade(W(ctx,0,.2),T(`-${Es}\\,h=-${Bs}\\,h\\,${vs}`,PC,262,40));
  c+=fade(W(ctx,.5,.62),label('両辺を −h で割る',PC,335,{size:26,color:MX.dim,anchor:'middle',weight:700}));
  c+=fade(W(ctx,.65,.8),T(`${Es}=${vs}\\,${Bs}`,PC,440,64)+box(PC,440,`${Es}=${vs}\\,${Bs}`,64));}
 if(st===9){c+=T(`${Es}=${vs}\\,${Bs}`,PC,220,64)+box(PC,220,`${Es}=${vs}\\,${Bs}`,64);
  c+=fade(W(ctx,.1,.3),label('h は こちらが決めた高さ',PC,320,{size:24,color:MX.dim,anchor:'middle'}));
  c+=fade(W(ctx,.55,.75),word('選んだ高さ h によらない',PC,420,{size:28,color:MX.hi,anchor:'middle',border:MX.hi}));}
 s+=panel(c);
 return s;
}

// ---- chapter 7: the ④ derivation (a second fixed path, seen from above) ---------------------------
// states: 0 new surface + camera, 5 surface normal, 1 flux, 6 loop direction, 2 sides, 7 I = 0, 3 B = ε₀μ₀vE
const AX0=420,AX1=680,AW=80,XF4=560,XF4b=610;
const STEP4=['新しい面','視点を変える','面の正の向き','電気束の増え方','一周の向き','四つの辺','電流の項','式'];
const stepChip=(k,g=1)=>word(`手順 ${k+1}/8：${STEP4[k]}`,20,122,{size:24,color:MX.hi,g});
function eq4Head(){const r=ROW([`\\oint ${Bs}\\cdot d\\vec r=`,'\\mu_0 I',`+\\,${e0m0}\\dfrac{d\\Phi_E}{dt}`],32,PC);
 return T(r[0].t,r[0].c,158,32)+fade(.35,T(r[1].t,r[1].c,158,32))+T(r[2].t,r[2].c,158,32);}
function deriv4(ctx,st){
 let P,u=1;
 if(st===0){const u1=W(ctx,.05,.35),u2=W(ctx,.55,.9);u=u2;P=u2>0?cam(mix(.6,Math.PI/2,u2),mix(-.3,0,u2)):cam(mix(0,.6,u1),mix(0,-.3,u1));}
 else P=cam(...TOP);
 const xf=st===0||st===5?XF4:st===1?mix(XF4,XF4b,W(ctx,.2,.55)):XF4b;
 const fg=st===5?1-.6*W(ctx,.45,.6):st===6?.4:1;
 let s=axisX(P,.5)+slab(P,xf)+fade(fg,field(P,step(xf),{curves:false,dx:80,extraB:st===0?1-W(ctx,.05,.2):0,extraE:st===0?u:1}));
 s+=frontV(P,xf,1);
 if(st===0)s+=fade(1-W(ctx,.05,.25),closed(P,[[LX0,-LH,0],[LX1,-LH,0],[LX1,LH,0],[LX0,LH,0]],{color:MX.ink,w:4,dash:'14 8'}));
 const A=[[AX0,0,-AW],[AX1,0,-AW],[AX1,0,AW],[AX0,0,AW]];
 s+=fade(st===0?W(ctx,.1,.3):.6,poly(P2(P,A),{fill:SURF,fo:.14,stroke:'none'}));
 s+=closed(P,A,{color:MX.ink,w:4,p:st===0?W(ctx,.1,.3):1,dash:'14 8'});
 const Y0=OY+AW,Y1=OY-AW,m=(AX0+AX1)/2;
 if(st!==0&&st!==5){const bandG=st===1?W(ctx,.2,.35):.8;
  s+=fade(bandG,poly(P2(P,[[XF4,0,-AW],[xf,0,-AW],[xf,0,AW],[XF4,0,AW]]),{fill:MX.E,fo:.3,stroke:'none'}));}
 if(st!==0||u>.95){const g=st===1?W(ctx,.55,.7):1,hx=AX1+24;s+=fade(g,arrow(hx,OY,hx,Y1,{color:MX.ink,w:3,head:12})+arrow(hx,OY,hx,Y0,{color:MX.ink,w:3,head:12})+T('w',hx+22,OY+10,32));}
 // step chip
 const k={0:vp(ctx)<.5?0:1,5:2,1:3,6:4,2:5,7:6,3:7}[st];s+=stepChip(k);
 if(st===0){s+=fade(W(ctx,.12,.3)*(1-W(ctx,.5,.55)),word('横に寝た面・その縁が 新しい道',20,480,{size:24,color:SURF}));
  s+=fade(W(ctx,.55,.7),word('動かすのは カメラだけ（波も面も そのまま）',20,480,{size:24,color:MX.ink}));}
 // surface normal (away from the viewer, like E)
 if(st===5||st===6){const g=st===5?W(ctx,.5,.65):1;s+=fade(g,sym(m,OY,false,MX.hi,1,18));
  if(st===5){s+=fade(W(ctx,.08,.25),word('電場：上向き → 見下ろすと 奥向き ⊗',20,180,{size:24,color:MX.E}));
   s+=fade(W(ctx,.55,.7),word('面の正の向き：奥（電場と同じ）',20,490,{size:24,color:MX.hi}));}}
 // path direction: clockwise on screen (normal away from the viewer)
 if(st===6||st===2||st===7||st===3){const g=st===6?W(ctx,.45,.62):.9,c=MX.ink;
  s+=fade(g,arrow(m-30,Y1,m+20,Y1,{color:c,w:5,head:16})+arrow(AX1,OY-25,AX1,OY+25,{color:c,w:5,head:16})+arrow(m+20,Y0,m-30,Y0,{color:c,w:5,head:16})+arrow(AX0,OY+25,AX0,OY-25,{color:c,w:5,head:16}));
  if(st===6){s+=curl(m,OY,36,false,MX.hi,W(ctx,.2,.4),4);
   s+=fade(W(ctx,.1,.25),word('親指：奥（面の正の向き）',20,180,{size:24,color:MX.hi}));
   s+=fade(W(ctx,.35,.5),word('指の巻く向き：右回り',20,490,{size:24,color:MX.ink}));}}
 if(st===2||st===7||st===3){const gl=st===2?W(ctx,.45,.6):.8;
  s+=fade(st===2?W(ctx,.05,.25):.6,label('0',AX1-34,OY-30,{size:30,color:MX.hi,weight:700})+label('0',640,Y1-12,{size:30,color:MX.hi,weight:700})+label('0',640,Y0+36,{size:30,color:MX.hi,weight:700}));
  s+=fade(gl*.55,draw([[AX0,Y0],[AX0,Y1]],1,{color:MX.hi,w:14}));
  s+=fade(gl,arrow(AX0-16,Y0,AX0-16,Y1,{color:MX.B,w:8,head:20})+word('磁場 ↑',AX0-26,Y1-30,{size:22,color:MX.B,anchor:'end'})+word('道 ↑',AX0-26,Y0+38,{size:22,color:MX.ink,anchor:'end'}));
  s+=fade(st===2?W(ctx,.7,.85):1,word('+B w',AX0-34,OY+10,{size:30,color:MX.B,anchor:'end'}));}
 if(st===7){s+=fade(W(ctx,.05,.25),word('← ずっと遠く：波を出した電線',20,490,{size:24,color:MX.I}));
  s+=fade(W(ctx,.45,.6),word('ここ：電荷の流れのない場所',20,180,{size:24,color:MX.ink}));}
 // ---- right panel
 let c=eq4Head();
 if(st===0){c+=label('④ で使う 新しい道',PX,222,{size:22,color:MX.hi,weight:700});
  c+=fade(W(ctx,.1,.3),label('面：横に寝た長方形',PX,275,{size:22,color:SURF})+label('道：その面の縁',PX,315,{size:22,color:MX.ink}));
  c+=fade(W(ctx,.6,.75),line(PX,350,1160,350,{color:MX.faint,w:2})+label('変えたのは 見る向きだけ',PX,395,{size:22,color:MX.hi,weight:700})+label('波・場は 同じ',PX,435,{size:22,color:MX.dim}));}
 if(st===5){c+=label('面の正の向き',PX,222,{size:22,color:MX.hi,weight:700});
  c+=fade(W(ctx,.1,.3),label('貫く場：電場（上向き）',PX,275,{size:22,color:MX.E}));
  c+=fade(W(ctx,.55,.72),label('正の向き：奥 ＝ 電場と同じ',PX,320,{size:22,color:MX.hi})+label('→ 電気束は ＋',PX,365,{size:22,color:MX.E,weight:700}));}
 if(st===1){c+=label('電気束の増え方',PX,222,{size:22,color:MX.E,weight:700});
  c+=pRow('新しい面積',275,`w\\cdot ${vs}\\,\\Delta t`,{g:W(ctx,.6,.75)});
  c+=pRow('電気束の増加',345,`${Es}\\,w\\,${vs}\\,\\Delta t`,{g:W(ctx,.7,.85)});
  c+=pRow('1秒あたり',420,`${Es}\\,w\\,${vs}`,{g:W(ctx,.85,1),size:40,col:MX.hi})+fade(W(ctx,.9,1.05),box(1070,432,`${Es}\\,w\\,${vs}`,40));}
 if(st===6){c+=pRow('電気束の増え方',230,`${Es}\\,w\\,${vs}`,{size:32,g:.6});
  c+=line(PX,256,1160,256,{color:MX.faint,w:2})+label('一周の向き',PX,300,{size:22,color:MX.hi,weight:700});
  c+=fade(W(ctx,.4,.55),label('奥 → 右回り',PX,345,{size:26,color:MX.hi,weight:700}));}
 if(st===2||st===7){c+=pRow('電気束の増え方',230,`${Es}\\,w\\,${vs}`,{size:32,g:.6});
  c+=line(PX,256,1160,256,{color:MX.faint,w:2});
  c+=pRow('左辺：一周',300,`+${Bs}\\,w`,{size:34,g:st===2?W(ctx,.75,.9):.7});}
 if(st===7){const q=ROW([`\\oint ${Bs}\\cdot d\\vec r=`,'\\mu_0 I',`+\\,${e0m0}\\dfrac{d\\Phi_E}{dt}`],32,PC)[1];
  c+=fade(W(ctx,.3,.45),`<rect x="${q.x-6}" y="122" width="${q.w+12}" height="52" rx="8" fill="none" stroke="${MX.I}" stroke-width="2.5"/>`+label('I：面を通り抜ける',PX,355,{size:22,color:MX.I})+label('電荷の流れ',PX,387,{size:22,color:MX.I}));
  c+=fade(W(ctx,.75,.9),word('ここでは I ＝ 0',PC,460,{size:28,color:MX.hi,anchor:'middle',border:MX.hi}));}
 if(st===3){c+=fade(W(ctx,0,.2),T(`${Bs}\\,w=${e0m0}\\,${Es}\\,${vs}\\,w`,PC,262,38));
  c+=fade(W(ctx,.5,.62),label('両辺を w で割る',PC,335,{size:26,color:MX.dim,anchor:'middle',weight:700}));
  c+=fade(W(ctx,.65,.8),T(`${Bs}=${e0m0}\\,${vs}\\,${Es}`,PC,440,52)+box(PC,440,`${Bs}=${e0m0}\\,${vs}\\,${Es}`,52));}
 s+=panel(c);
 return s;
}
// ③ vs ④ table (what changes when we choose the second path)
function diffTable(ctx){
 const rows=[['面の正の向き','手前','上'],['面を貫く場','磁場 B','電場 E'],['道に沿う場','電場 E','磁場 B'],['使う法則','③','④']];
 const X=[250,560,850],y0=188;
 let s=`<rect x="120" y="100" width="960" height="400" rx="18" fill="${MX.bg}" fill-opacity=".94" stroke="${MX.faint}" stroke-width="2"/>`;
 s+=fade(W(ctx,.05,.2),label('③ で E = vB',X[1],160,{size:28,color:MX.dim,anchor:'middle',weight:700})+label('④ でもう一つ',X[2],160,{size:28,color:MX.hi,anchor:'middle',weight:700})+line(150,180,1050,180,{color:MX.faint,w:2}));
 rows.forEach(([a,b,c],i)=>{const g=W(ctx,.45+i*.1,.6+i*.1),y=y0+30+i*72,colOf=t=>/電場/.test(t)?MX.E:/磁場/.test(t)?MX.B:MX.ink;
  s+=fade(g,label(a,X[0],y+10,{size:28,color:MX.ink,anchor:'middle',weight:700})+label(b,X[1],y+10,{size:28,color:colOf(b),anchor:'middle'})+label('→',(X[1]+X[2])/2,y+10,{size:28,color:MX.dim,anchor:'middle'})
   +`<rect x="${X[2]-95}" y="${y-26}" width="190" height="50" rx="10" fill="${MX.hi}" fill-opacity=".08" stroke="${MX.hi}" stroke-width="2"/>`+label(c,X[2],y+10,{size:28,color:colOf(c),anchor:'middle',weight:700}));});
 s+=fade(W(ctx,.3,.45),label('波は そのまま。選び直すのは 計算の道だけ',600,488,{size:24,color:MX.ink,anchor:'middle',weight:700}));
 return s;
}

// ---- chapter 7: combining ---------------------------------------------------------------------
const combCards=(g1=1,g2=1)=>callout(90,110,440,130,label('③から',120,150,{size:24,color:MX.dim})+T(`${Es}=${vs}\\,${Bs}`,310,195,52),g1)+callout(670,110,440,130,label('④から',700,150,{size:24,color:MX.dim})+T(`${Bs}=${e0m0}\\,${vs}\\,${Es}`,890,195,52),g2);
const RSUB=()=>ROW([Es,'=',vs,`\\big(${e0m0}\\,${vs}\\,${Es}\\big)`],62,600);

// ---- chapter 7: numbers -----------------------------------------------------------------------
const CARD={s:.78,L:[40,120],R:[793,120]};
// Small cards (sc < .7) drop the card's own title (it would fall under 22px) and get a 22px caption above.
function cardAt(side,x,y,sc,o={}){const small=sc<.7;return `<g transform="translate(${x} ${y}) scale(${sc})">${evidenceCard(side,0,0,{...o,title:!small})}</g>`+(small?label(side?'電流のまわりの磁場':'電荷どうしの力',x+235*sc,y-10,{size:22,color:side?MX.B:MX.E,anchor:'middle',weight:700}):'');}
const badge=(side,x,y,sc)=>[x+235*sc,y+252*sc];
const vFormula=(x,y,size,col=true)=>T(`${vs}=\\dfrac{1}{\\sqrt{${col?e0m0c:e0m0}}}`,x,y,size);
const calcRows=[
 ['1. 掛ける',175,'\\varepsilon_0\\mu_0\\approx(8.85\\times10^{-12})\\times(1.26\\times10^{-6})'],
 ['',232,'\\approx 1.11\\times10^{-17}\\ \\mathrm{s^2/m^2}'],
 ['2. 平方根',318,'\\sqrt{\\varepsilon_0\\mu_0}\\approx 3.34\\times10^{-9}\\ \\mathrm{s/m}'],
 ['3. 逆数',415,`${vs}=\\dfrac{1}{\\sqrt{\\varepsilon_0\\mu_0}}\\approx 3.00\\times10^{8}\\ \\mathrm{m/s}`],
 ['4. 単位',490,'3.00\\times10^{8}\\ \\mathrm{m/s}=3.00\\times10^{5}\\ \\mathrm{km/s}'],
];
function calc(ctx,st){// st 0: product, 1: root, 2: reciprocal + units
 let s=word('ここからは 電卓',1160,125,{size:24,color:MX.dim,anchor:'end',g:st===0?W(ctx,.02,.2):.8});
 const g=[st===0?W(ctx,.3,.5):.55,st===0?W(ctx,.6,.8):.55,st===1?W(ctx,0,.25):st>1?.55:0,st===2?W(ctx,.45,.62):0,st===2?W(ctx,.8,.92):0];
 calcRows.forEach(([t,y,src],i)=>{if(g[i]<=0)return;s+=fade(g[i],(t?label(t,40,y+8,{size:26,color:MX.hi,weight:700}):'')+T(src,640,y+12,34));});
 if(st===0){s+=fade(W(ctx,.65,.8),T(calcRows[1][2],640,calcRows[1][1]+12,34,{color:MX.hi}));
  s+=callout(620,300,540,150,word('補足',640,340,{size:22,color:MX.dim,border:MX.faint})+T('10^{-12}\\times10^{-6}=10^{-18}',890,395,32)+label('10 の何乗は、掛けると 指数を足す',890,435,{size:22,color:MX.ink,anchor:'middle'}),W(ctx,.85,1));}
 if(st===1){s+=fade(W(ctx,.55,.75),label('この波が 1 m 進むのに かかる時間',640,370,{size:24,color:MX.E,anchor:'middle',weight:700}));}
 if(st===2){s+=fade(W(ctx,.08,.25),word('単位も逆数：s/m → m/s',40,372,{size:24,color:MX.hi}));
  s+=fade(W(ctx,.3,.45),label('1秒で 進む距離',1160,385,{size:22,color:MX.dim,anchor:'end'}));
  s+=fade(W(ctx,.88,.98),word('秒速 約30万 km',1160,448,{size:26,color:MX.hi,anchor:'end',border:MX.hi}));}
 return s;
}
// units: why F/m × N/A² is s²/m²
function units(ctx,st){
 let s=T('\\varepsilon_0\\mu_0:\\quad \\mathrm{\\dfrac{F}{m}\\times\\dfrac{N}{A^2}}',600,160,40);
 const rows=[['F：1 V あたりの電荷','\\mathrm{F}=\\dfrac{\\mathrm{C}}{\\mathrm{V}}',.1],['V：1 C あたりの仕事','\\mathrm{V}=\\dfrac{\\mathrm{J}}{\\mathrm{C}}=\\dfrac{\\mathrm{N\\,m}}{\\mathrm{C}}',.3],['A：1秒あたりの電荷','\\mathrm{A}=\\dfrac{\\mathrm{C}}{\\mathrm{s}}',.7]];
 if(st===0)rows.forEach(([t,src,a],i)=>{s+=fade(W(ctx,a,a+.15),label(t,120,262+i*100,{size:26,color:MX.ink,weight:700})+T(src,820,267+i*100,38));});
 if(st===1){s+=fade(1-W(ctx,0,.12),rows.map(([t,src],i)=>label(t,120,262+i*100,{size:26,color:MX.ink,weight:700})+T(src,820,267+i*100,38)).join(''));
  const toks=['=\\dfrac{\\mathrm{C^2}}{\\mathrm{N\\,m^2}}','\\times','\\dfrac{\\mathrm{N\\,s^2}}{\\mathrm{C^2}}'],r=ROW(toks,44,600),y=290;
  s+=fade(W(ctx,.05,.2),r.map(q=>T(q.t,q.c,y,44)).join(''));
  const k=W(ctx,.35,.5),cc=MX.plus;
  // strike C² (top of 1st, bottom of 2nd) and N (bottom of 1st, top of 2nd)
  const sx=(q,dy,w0,w1)=>fade(k,line(q.x+w0,y+dy+12,q.x+w1,y+dy-12,{color:cc,w:4}));
  const a=r[0],b=r[2];
  s+=sx(a,-28,a.w*.3,a.w*.72)+sx(a,26,a.w*.25,a.w*.5)+sx(b,-28,b.w*.12,b.w*.42)+sx(b,26,b.w*.25,b.w*.75);
  s+=fade(k,label('C² と N が 打ち消し合う',600,380,{size:24,color:cc,anchor:'middle',weight:700}));
  s+=fade(W(ctx,.62,.8),T('=\\mathrm{s^2/m^2}',600,468,46)+box(600,468,'=\\mathrm{s^2/m^2}',46));}
 return s;
}

// ---- chapter 8 ----------------------------------------------------------------------------------
function panelBox(x,y,w,h,{g=1,hi=0,dim=0}={}){return fade(g*(1-.55*dim),`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${MX.bg2}" fill-opacity=".96" stroke="${hi?MX.hi:MX.faint}" stroke-width="${hi?4:2}"/>`);}
function magnetCut(ctx,x,y,g=1){// a bar magnet that splits: each half still has N and S
 const sp=18+14*smooth(clamp((Math.sin(ctx.t*1.4)+1)/2));
 return fade(g,magnet(x-60-sp,y,{w:120,h:44})+magnet(x+60+sp,y,{w:120,h:44}));
}
function coilDemo(ctx,x,y,g=1){
 const mx=x-120+40*Math.sin(ctx.t*2.2),vel=Math.cos(ctx.t*2.2);
 let s=[0,1,2,3].map(i=>`<ellipse cx="${x+50+i*20}" cy="${y}" rx="14" ry="48" fill="none" stroke="#c9d2e3" stroke-width="3"/>`).join('');
 s+=magnet(mx,y,{w:120,h:34});
 s+=Math.abs(vel)>.12?arrow(x+80-vel*30,y-66,x+80+vel*30,y-66,{color:MX.I,w:5,head:13}):'';
 return fade(g,s+label('電流',x+80,y-84,{size:22,color:MX.I,anchor:'middle',weight:700}));
}
function capPic(ctx,x,y,sc,{term=0}={}){// capacitor charging: current in the wire, E growing in the gap, B loops
 const ch=.5+.5*Math.sin(ctx.t*2);let s='';
 s+=line(0,100,220,100,{color:'#c9d2e3',w:4})+line(270,100,490,100,{color:'#c9d2e3',w:4})+line(220,30,220,170,{color:'#c9d2e3',w:6})+line(270,30,270,170,{color:'#c9d2e3',w:6});
 s+=arrow(60,82,130,82,{color:MX.I,w:5,head:14})+label('I',95,70,{size:26,color:MX.I,anchor:'middle',weight:700});
 s+=[60,100,140].map(yy=>arrow(226,yy,226+38*ch,yy,{color:MX.E,w:3,head:10,g:ch>.1?1:0})).join('');
 s+=`<ellipse cx="110" cy="100" rx="20" ry="62" fill="none" stroke="${MX.B}" stroke-width="3.5"/>`;
 s+=`<ellipse cx="245" cy="100" rx="22" ry="70" fill="none" stroke="${term>0?MX.hi:MX.B}" stroke-width="${3.5+2*term}"/>`;
 return `<g transform="translate(${x} ${y}) scale(${sc})">${s}</g>`;
}
// recap road (fullBar cues): cards → ④ completed → ③⇄④ wave → v = 1/√(ε₀μ₀)
function road(ctx,st){
 const sc=.56,L=[40,145],R=[40,345];let s='';
 const g0=st===0?W(ctx,.35,.6):1,gl=st===2?W(ctx,.75,.95):0;
 s+=fade(g0,cardAt(0,L[0],L[1],sc,{gn:1,glow:gl})+cardAt(1,R[0],R[1],sc,{gn:1,glow:gl,t:ctx.t}));
 s+=fade(st===0?W(ctx,0,.2)*(1-W(ctx,.9,1.1)):0,word('最初の謎：なぜ光の速さが？',720,300,{size:32,color:MX.hi,anchor:'middle',border:MX.hi}));
 if(st===0)s+=fade(W(ctx,.55,.75)*(1-W(ctx,.9,1.1)),word('電磁気の法則 ＋ 二つの定数',720,380,{size:28,color:MX.ink,anchor:'middle'}));
 if(st>=1){const g=st===1?W(ctx,.05,.3):.7;
  s+=fade(g,`<rect x="340" y="140" width="330" height="170" rx="14" fill="${MX.bg2}" stroke="${st===1?MX.hi:MX.faint}" stroke-width="${st===1?3:2}"/>`+capPic(ctx,360,150,.58,{term:st===1?W(ctx,.4,.6):1})+label('④ 電場の変化も 磁場を作る',505,292,{size:22,color:MX.ink,anchor:'middle',weight:700}));
  s+=fade(g,arrow(320,220,338,220,{color:MX.dim,w:3,head:10}));}
 if(st>=2){const g=W(ctx,.05,.3),ph=ctx.t*4,pe=[],pb=[];
  for(let x=360;x<=660;x+=5){const a=Math.sin((x-360)/40-ph);pe.push([x,410-40*a]);pb.push([x-8,410+24*a]);}
  s+=fade(g,`<rect x="340" y="330" width="330" height="170" rx="14" fill="${MX.bg2}" stroke="${MX.hi}" stroke-width="3"/>`+draw(pb,1,{color:MX.B,w:3})+draw(pe,1,{color:MX.E,w:4})+label('③ と ④：結びついて伝わる波',505,485,{size:22,color:MX.ink,anchor:'middle',weight:700}));
  s+=fade(g,arrow(505,312,505,328,{color:MX.dim,w:3,head:10}));
  const f=W(ctx,.55,.75);
  s+=fade(f,`<rect x="720" y="250" width="440" height="200" rx="16" fill="${MX.hi}" fill-opacity=".08" stroke="${MX.hi}" stroke-width="3"/>`+vFormula(940,355,54)+label('光の速さ',940,430,{size:26,color:MX.hi,anchor:'middle',weight:700}));
  s+=fade(f,arrow(680,410,715,380,{color:MX.dim,w:3,head:10}));
  s+=fade(gl,label('この二つの定数だけ',940,480,{size:24,color:MX.hi,anchor:'middle',weight:700}));}
 return s;
}
const GX=390,GR=740;
function glass(g=1){return fade(g,`<rect x="${GX}" y="110" width="${GR-GX}" height="395" rx="8" fill="#9fd8ff" fill-opacity=".10" stroke="#9fd8ff" stroke-opacity=".6" stroke-width="3"/>`+label('ガラス',GR-16,146,{size:28,color:'#bfe6ff',anchor:'end',weight:700})+label('真空',60,146,{size:28,color:MX.dim,weight:700}));}
// straight-on wave fronts (vertical lines = crests), closer together inside the glass (slower, same frequency)
const LAMG=80,NG=1.5;
const offG=ctx=>(ctx.t*50)%LAMG;
function frontsStraight(ctx,{g=1,y0=225,y1=495}={}){
 const off=offG(ctx);let s='';
 for(let k=-1;k<20;k++){const S=40+k*LAMG+off;let x=S<GX?S:GX+(S-GX)/NG;if(x<40||x>GR-6)continue;s+=line(x,y0,x,y1,{color:MX.E,w:3,opacity:.85});}
 return fade(g,s);
}
// the wave profile above the fronts: crests line up with the front lines
function profile(ctx,{g=1,yc=185,A=26}={}){const off=offG(ctx),pts=[];
 for(let x=40;x<=GR-6;x+=3){const S=x<GX?x:GX+(x-GX)*NG;pts.push([x,yc-A*Math.cos(2*Math.PI*(S-40-off)/LAMG)]);}
 return fade(g,draw(pts,1,{color:MX.E,w:3}));}
function frontsOblique(ctx,{g=1,alpha=35}={}){
 const a=alpha*Math.PI/180,lam=70,off=(ctx.t*40)%lam,Yc=330;let s='';
 for(let k=-12;k<=2;k++){const S=k*lam+off,pts=[];for(let y=150;y<=500;y+=5){const x=GX+(S-(y-Yc)*Math.sin(a))/Math.cos(a);if(x>=40&&x<=GX)pts.push([x,y]);}
  if(pts.length>1)s+=draw(pts,1,{color:MX.E,w:3,opacity:.8});}
 const y0=Yc-(GX-170)*Math.tan(a);s+=arrow(170,y0,GX-4,Yc,{color:MX.hi,w:5,head:18});
 return fade(g,s);
}
// charges in the glass, shaken by the wave's electric field
function glassCharges(ctx,g=1){let s='';for(let i=0;i<4;i++)for(let j=0;j<5;j++){const x=GX+50+i*85,y=200+j*62,d=9*Math.sin(ctx.t*5-(x-GX)/30);
 s+=dot(x,y+d,6,MX.minus)+line(x,y-14,x,y+14,{color:MX.dim,w:1.5,opacity:.5});}return fade(g,s);}

// =============================================================================================
export const mx2p78Diagrams={
 // ───────── chapter 7: from the chain to the wave ─────────
 'mx7-n-wire':(p,ctx)=>{const P=cam(...OBL);
  let s=axisX(P,.4)+air(.7)+wire(P,ctx,{cur:W(ctx,.02,.12)});
  s+=fade(W(ctx,.2,.35),word('向きと大きさが くり返し変わる',260,150,{size:26,color:MX.I}));
  s+=fade(W(ctx,.62,.78),word('電線は 固定',260,470,{size:26}));
  return stage(ctx,p,s);},
 'mx7-n-chain':(p,ctx)=>{const P=cam(...OBL);
  let s=axisX(P,.4)+air(.7)+wire(P,ctx);
  s+=chain(P,ctx,k=>k===0?W(ctx,.12,.3):k===1?W(ctx,.45,.62):k===2?W(ctx,.75,.92):0);
  s+=word('磁場',WIREX+50,OY+100,{size:26,color:MX.B,g:W(ctx,.2,.3)});
  s+=word('電場',LINKS[1]+40,OY-110,{size:26,color:MX.E,g:W(ctx,.5,.6)});
  s+=word('磁場',LINKS[2]+40,OY+100,{size:26,color:MX.B,g:W(ctx,.8,.9)});
  return stage(ctx,p,s);},
 'mx7-n-schematic':(p,ctx)=>{const P=cam(...OBL),out=W(ctx,.5,.68),wv=W(ctx,.55,.75);
  let s=axisX(P,.4)+air(.7*(1-out))+wire(P,ctx,{g:1-out});
  s+=fade(1-out,chain(P,ctx,k=>k<=2?1:k===3?W(ctx,0,.1):0));
  s+=word('模式図',600,150,{size:32,color:MX.hi,anchor:'middle',border:MX.hi,g:W(ctx,.08,.2)*(1-out)});
  s+=fade(wv,field(P,sineAt(ctx)));
  // one place: E and B arrows at the same x, at the same time
  const x0=600,m=P(x0,0,0);s+=fade(W(ctx,.75,.9),`<rect x="${m[0]-48}" y="200" width="96" height="260" rx="14" fill="${MX.hi}" fill-opacity=".07" stroke="${MX.hi}" stroke-width="2.5" stroke-dasharray="8 6"/>`+word('同じ場所に 同時に',m[0],150,{size:28,color:MX.hi,anchor:'middle'}));
  return stage(ctx,p,s);},
 // review 55: a time delay between a near and a far point (the change travels)
 'mx7-n-delay':(p,ctx)=>{const P=cam(...OBL),t0=.3,t1=1,X0=WIREX+10,X1=1180;
  const pr=clamp((vp(ctx)-t0)/(t1-t0)),xf=mix(X0,X1,pr);
  const f=x=>x<xf?Math.sin(KX*(xf-x)):0;
  let s=axisX(P,.4)+wire(P,ctx,{cur:W(ctx,.25,.35)})+field(P,f,{x0:WIREX+30});
  const pts=[[400,'近い地点',120],[880,'遠い地点',153]];
  // timeline (top): each point's electric field against time
  const TX0=420,TX1=1130,tx=tau=>TX0+(TX1-TX0)*tau;
  let tl=`<rect x="300" y="92" width="860" height="106" rx="12" fill="${MX.bg}" fill-opacity=".92" stroke="${MX.faint}" stroke-width="2"/>`+label('時間 →',1150,190,{size:22,color:MX.dim,anchor:'end'});
  const starts=[];
  pts.forEach(([x,name,ry])=>{const ts=t0+(x-X0)/(X1-X0)*(t1-t0);starts.push(ts);const q=[];const now=vp(ctx);
   for(let tau=0;tau<=Math.min(now,1);tau+=.004)q.push([tx(tau),ry-(tau>ts?10*Math.sin(60*(tau-ts)):0)]);
   tl+=label(name.slice(0,2),318,ry+8,{size:22,color:MX.ink,weight:700})+line(TX0,ry,TX1,ry,{color:MX.faint,w:1.5})+draw(q,1,{color:MX.E,w:3});});
  if(vp(ctx)>starts[1]){const g=clamp((vp(ctx)-starts[1])/.06),a=tx(starts[0]),b=tx(starts[1]);
   tl+=fade(g,line(a,100,a,186,{color:MX.hi,w:2,dash:'5 5'})+line(b,100,b,186,{color:MX.hi,w:2,dash:'5 5'})+arrow(a+4,182,b-4,182,{color:MX.hi,w:3,head:10})+label('遅れ',b+10,190,{size:22,color:MX.hi,weight:700}));}
  s+=fade(W(ctx,.05,.2),tl);
  pts.forEach(([x,name])=>{const on=xf>x,a=P(x,-140,0),b=P(x,140,0),c=P(x,0,0),g=W(ctx,.05,.2);
   s+=fade(g,line(a[0],a[1],b[0],b[1],{color:on?MX.hi:MX.dim,w:2.5,dash:'7 7'})+dot(c[0],c[1],9,on?MX.hi:MX.dim)+word(name,c[0],488,{size:24,color:on?MX.hi:MX.ink,anchor:'middle'}));});
  return stage(ctx,p,s);},
 // review 55: the relation alone gives no delay/speed → find the travelling wave that satisfies ③ and ④ at once
 'mx7-n-goal':(p,ctx)=>{
  let s=callout(40,105,520,190,label('互いに関係する',300,150,{size:26,color:MX.ink,anchor:'middle',weight:700})
   +label('磁場の変化 → 電場',300,205,{size:24,color:MX.B,anchor:'middle'})+label('電場の変化 → 磁場',300,250,{size:24,color:MX.E,anchor:'middle'}),W(ctx,0,.12));
  s+=fade(W(ctx,.12,.3),word('これだけでは 遅れも速さも 出ない',300,345,{size:24,color:MX.plus,anchor:'middle',border:MX.plus}));
  const g=W(ctx,.45,.62);
  s+=callout(620,105,540,250,label('③',650,185,{size:26,color:MX.dim,weight:700})+fit(EQ[3].tex,915,180,430,34,{color:MX.ink})
   +label('④',650,275,{size:26,color:MX.dim,weight:700})+fit(EQ[4].tex,915,270,430,34,{color:MX.ink}),g);
  s+=fade(W(ctx,.55,.7),label('二つを 同時に満たす',890,338,{size:24,color:MX.hi,anchor:'middle',weight:700}));
  s+=fade(W(ctx,.72,.88),arrow(890,366,890,402,{color:MX.dim,w:3,head:10})+word('進む波の条件 → 速さ v ＝ ？',890,450,{size:28,color:MX.hi,anchor:'middle',border:MX.hi}));
  return stage(ctx,p,s);},
 'mx7-n-dirs':(p,ctx)=>{const P=cam(...OBL),e=W(ctx,.5,.7);
  let s=axisX(P,.5)+field(P,sineAt(ctx),{gB:.25,gE:.45+.55*e,wAt:()=>3.5+1.5*e});
  s+=goRight(W(ctx,.1,.3));
  s+=word('真空・右へ進む 平らな波',600,140,{size:26,color:MX.hi,anchor:'middle',border:MX.hi,g:W(ctx,.05,.25)});
  s+=word('電場 E：上下',40,140,{size:28,color:MX.E,g:e});
  return stage(ctx,p,s);},
 'mx7-n-dirs2':(p,ctx)=>{const P=cam(...OBL),b=W(ctx,.05,.3),tri=W(ctx,.6,.8);
  let s=axisX(P,.5)+field(P,sineAt(ctx),{gB:.25+.75*b,gE:1-.4*b});
  s+=goRight(1)+word('電場 E：上下',40,140,{size:28,color:MX.E,g:1-.4*b});
  s+=word('磁場 B：手前と奥',300,140,{size:28,color:MX.B,g:b});
  // right-angle triad (same colours): travel → x, E → y, B → z (toward the viewer)
  const o=[1050,172],Q=cam(...OBL),dxz=Q(0,0,70),dz=[dxz[0],dxz[1]-OY];
  s+=fade(tri,`<rect x="${o[0]-110}" y="${o[1]-92}" width="240" height="160" rx="14" fill="${MX.bg}" fill-opacity=".9" stroke="${MX.faint}" stroke-width="2"/>`
   +arrow(o[0],o[1],o[0]+90,o[1],{color:MX.hi,w:5,head:14})+arrow(o[0],o[1],o[0],o[1]-80,{color:MX.E,w:5,head:14})+arrow(o[0],o[1],o[0]+dz[0],o[1]+dz[1],{color:MX.B,w:5,head:14})
   +draw([[o[0]+14,o[1]],[o[0]+14,o[1]-14],[o[0],o[1]-14]],1,{color:MX.dim,w:2})+label('互いに直角',o[0]+10,o[1]+56,{size:22,color:MX.ink,anchor:'middle',weight:700}));
  return stage(ctx,p,s);},
 'mx7-n-point':(p,ctx)=>{const P=cam(...OBL),m=W(ctx,.45,.62),x0=620;
  const near=x=>Math.abs(x-x0)<1?1:1-.75*m;
  let s=axisX(P,.5)+field(P,sineAt(ctx),{cg:1-.7*m,gAt:near,wAt:x=>Math.abs(x-x0)<1?3.5+3*m:3.5});
  s+=fade(W(ctx,.05,.2)*(1-m),word('粒の通り道 ではない',600,150,{size:28,anchor:'middle',color:MX.plus,border:MX.plus}));
  const a=P(x0,-150,0),b=P(x0,150,0),c=P(x0,0,0);
  s+=fade(m,line(a[0],a[1],b[0],b[1],{color:MX.hi,w:2.5,dash:'7 7'})+dot(c[0],c[1],9,MX.hi)+word('印',c[0]+30,a[1]+14,{size:26,color:MX.hi}));
  s+=fade(W(ctx,.7,.85),word('場の強さと向きが 変わる',600,150,{size:28,anchor:'middle',color:MX.hi}));
  return stage(ctx,p,s);},
 // review 56: E and B have different units; the picture's arrow lengths are a drawing choice
 'mx7-n-scale':(p,ctx)=>{const P=cam(...OBL),x0=620,c=P(x0,0,0);
  let s=axisX(P,.5)+field(P,sineAt(ctx),{cg:.3,gAt:x=>Math.abs(x-x0)<1?1:.3,wAt:x=>Math.abs(x-x0)<1?6.5:3.5});
  const a=P(x0,-150,0),b=P(x0,150,0);s+=line(a[0],a[1],b[0],b[1],{color:MX.hi,w:2.5,dash:'7 7'})+dot(c[0],c[1],9,MX.hi);
  s+=callout(20,92,420,150,label('電場 E の単位',40,135,{size:24,color:MX.E,weight:700})+T('\\mathrm{V/m}',360,140,30)
   +label('磁場 B の単位',40,180,{size:24,color:MX.B,weight:700})+T('\\mathrm{T}',360,185,30)+label('矢印の長さは 絵の都合',230,225,{size:22,color:MX.ink,anchor:'middle',weight:700}),W(ctx,.05,.2));
  s+=fade(W(ctx,.6,.75),word('直角・一緒に伸び縮み：一方向に進む 平らな波の場合',600,488,{size:24,color:MX.hi,anchor:'middle',border:MX.hi}));
  return stage(ctx,p,s);},
 'mx7-n-wave':(p,ctx)=>{const P=cam(...OBL),gone=W(ctx,.15,.45);
  let s=axisX(P,.5)+air(.7*(1-gone))+wire(P,ctx,{g:.6*(1-gone),cur:0})+field(P,sineAt(ctx));
  s+=goRight(1);
  s+=word('電磁波',600,150,{size:40,color:MX.ink,anchor:'middle',g:W(ctx,.62,.78)});
  return stage(ctx,p,s);},
 'mx7-n-front':(p,ctx)=>{const P=cam(...OBL),u=W(ctx,.4,.65),xf=mix(300,470,W(ctx,.4,.9));
  const sine=sineAt(ctx),f=x=>mix(sine(x),x<xf?1:0,u);
  let s=axisX(P,.5)+slab(P,xf,{g:u})+field(P,f,{curves:u<.5});
  s+=word('速さは？',600,150,{size:34,color:MX.hi,anchor:'middle',g:W(ctx,.02,.15)*(1-W(ctx,.35,.45))});
  s+=word('平らな境目',P(xf,0,0)[0],120,{anchor:'middle',size:26,color:MX.hi,g:W(ctx,.55,.7)});
  s+=word('計算のための 理想化した 階段形の波',40,478,{size:26,color:MX.hi,g:W(ctx,.75,.9)});
  return stage(ctx,p,s);},
 'mx7-n-region':(p,ctx)=>{const u=W(ctx,0,.25),P=camMix(OBL,SIDE,u),xf=470;
  let s=axisX(P,.5)+slab(P,xf)+field(P,step(xf),{curves:false,dx:80,extraB:u});
  s+=fade(W(ctx,.2,.35),word('電場 E：上向き',40,138,{size:26,color:MX.E}));
  s+=fade(W(ctx,.3,.45),`<g>${word('磁場 B：手前向き',40,478,{size:26,color:MX.B})}</g>`+sym(322,470,true,MX.B,1,12));
  s+=fade(W(ctx,.25,.4),word('どこも 同じ強さ',240,200,{size:24,color:MX.hi,anchor:'middle'}));
  s+=fade(W(ctx,.55,.7),word('どちらも ゼロ',P(xf,0,0)[0]+230,478,{size:26,color:MX.dim,anchor:'middle'}));
  s+=frontV(P,xf,W(ctx,.72,.85));
  return stage(ctx,p,s);},
 // review 57: why a step front — uniform fields turn the sums into products; the moving boundary is area growth
 'mx7-n-whystep':(p,ctx)=>{const P=cam(...SIDE),xf=mix(470,560,W(ctx,.6,.95));
  let s=axisX(P,.5)+slab(P,xf)+field(P,step(xf),{curves:false,dx:80,extraB:1})+frontV(P,xf,1);
  s+=fade(W(ctx,.05,.2)*(1-.6*W(ctx,.5,.6)),`<rect x="130" y="${OY-125}" width="320" height="250" rx="10" fill="none" stroke="${MX.hi}" stroke-width="2.5" stroke-dasharray="8 6"/>`);
  s+=fade(W(ctx,.55,.65),poly([[470,OY-LH],[xf,OY-LH],[xf,OY+LH],[470,OY+LH]],{fill:MX.B,fo:.4,stroke:MX.B,sw:2})+word('増えた面積',470,478,{size:24,color:MX.B}));
  let c=label('階段形の波を 使う理由',PX,140,{size:24,color:MX.hi,weight:700});
  c+=fade(W(ctx,.08,.22),label('場がどこも同じ',PX,195,{size:22,color:MX.dim}));
  c+=fade(W(ctx,.15,.3),label('一周の足し算',PX,245,{size:24,color:MX.ink,weight:700})+label('→ 場 × 長さ',PX+30,285,{size:24,color:MX.ink}));
  c+=fade(W(ctx,.3,.45),label('磁束・電気束',PX,335,{size:24,color:MX.ink,weight:700})+label('→ 場 × 面積',PX+30,375,{size:24,color:MX.ink}));
  c+=fade(W(ctx,.62,.78),label('境目の移動',PX,425,{size:24,color:MX.hi,weight:700})+label('→ 面積の増え方',PX+30,465,{size:24,color:MX.B,weight:700}));
  s+=panel(c);
  return stage(ctx,p,s);},
 // ───────── chapter 7: ③ derivation ─────────
 'mx7-n-loop':(p,ctx)=>stage(ctx,p,deriv3(ctx,0)),
 'mx7-n-whyloop':(p,ctx)=>stage(ctx,p,deriv3(ctx,10)),
 'mx7-n-law3':(p,ctx)=>stage(ctx,p,deriv3(ctx,1)),
 'mx7-n-normal':(p,ctx)=>stage(ctx,p,deriv3(ctx,11)),
 'mx7-n-area':(p,ctx)=>stage(ctx,p,deriv3(ctx,2)),
 'mx7-n-flux':(p,ctx)=>stage(ctx,p,deriv3(ctx,3)),
 'mx7-n-dir':(p,ctx)=>stage(ctx,p,deriv3(ctx,4)),
 'mx7-n-role':(p,ctx)=>stage(ctx,p,deriv3(ctx,12)),
 'mx7-n-side1':(p,ctx)=>stage(ctx,p,deriv3(ctx,5)),
 'mx7-n-side2':(p,ctx)=>stage(ctx,p,deriv3(ctx,6)),
 'mx7-n-side3':(p,ctx)=>stage(ctx,p,deriv3(ctx,7)),
 'mx7-n-evb':(p,ctx)=>stage(ctx,p,deriv3(ctx,8)),
 'mx7-n-hfree':(p,ctx)=>stage(ctx,p,deriv3(ctx,9)),
 // ───────── chapter 7: ④ derivation ─────────
 'mx7-n-diff':(p,ctx)=>stage(ctx,p,fade(.35,deriv3(ctx,9))+diffTable(ctx)),
 'mx7-n-surf2':(p,ctx)=>stage(ctx,p,deriv4(ctx,0)),
 'mx7-n-normal2':(p,ctx)=>stage(ctx,p,deriv4(ctx,5)),
 'mx7-n-top':(p,ctx)=>stage(ctx,p,deriv4(ctx,1)),
 'mx7-n-dir2':(p,ctx)=>stage(ctx,p,deriv4(ctx,6)),
 'mx7-n-along':(p,ctx)=>stage(ctx,p,deriv4(ctx,2)),
 'mx7-n-i0':(p,ctx)=>stage(ctx,p,deriv4(ctx,7)),
 'mx7-n-bmve':(p,ctx)=>stage(ctx,p,deriv4(ctx,3)),
 // ───────── chapter 7: combining (review 65) ─────────
 'mx7-n-combine':(p,ctx)=>{
  let s=combCards(at(ctx,0,.4),at(ctx,.05,.4));
  const k=W(ctx,.4,.55);
  s+=fade(k,label('E と B：まだ 分からない',310,285,{size:24,color:MX.dim,anchor:'middle',weight:700})+label('E と B：まだ 分からない',890,285,{size:24,color:MX.dim,anchor:'middle',weight:700}));
  s+=fade(W(ctx,.62,.8),word('E と B を消して → 速さ v だけの式へ',600,410,{size:30,color:MX.hi,anchor:'middle',border:MX.hi}));
  return stage(ctx,p,s);},
 'mx7-n-subst':(p,ctx)=>{
  let s=combCards();
  s+=fade(1-W(ctx,0,.15),word('E と B を消して → 速さ v だけの式へ',600,410,{size:30,color:MX.hi,anchor:'middle',border:MX.hi}));
  const size=62,row=RSUB(),yR=400;
  const d=W(ctx,.12,.3),ins=W(ctx,.5,.75);
  const bw=texWidth(Bs,size,false),bx=row[3].x+bw/2;
  s+=fade(d,T(Es,mix(250,row[0].c,d),mix(195,yR,d),mix(52,size,d))+T('=',mix(290,row[1].c,d),mix(195,yR,d),mix(52,size,d))+T(vs,mix(325,row[2].c,d),mix(195,yR,d),mix(52,size,d)));
  s+=fade(d*(1-ins),T(Bs,mix(360,bx,d),mix(195,yR,d)-ins*50,size));
  s+=fade(W(ctx,.3,.42)*(1-ins),`<rect x="${bx-bw/2-10}" y="${yR-size*.9}" width="${bw+20}" height="${size*1.4}" rx="10" fill="none" stroke="${MX.B}" stroke-width="3" stroke-dasharray="7 6"/>`);
  s+=fade(ins,T(row[3].t,mix(955,row[3].c,ins),mix(195,yR,ins),mix(46,size,ins)));
  s+=fade(W(ctx,.42,.55)*(1-ins),arrow(900,250,700,340,{color:MX.dim,w:3,head:12}));
  s+=fade(W(ctx,.82,.95),word('B が消えた',600,490,{size:26,color:MX.B,anchor:'middle'}));
  return stage(ctx,p,s);},
 'mx7-n-predict':(p,ctx)=>{
  const r0=RSUB(),r1=ROW([Es,'=',`${e0m0}\\,${vs}^2`,Es],62,600),a=W(ctx,.18,.35),y=mix(400,190,W(ctx,.06,.2));
  let s=fade(1-W(ctx,0,.06),combCards());
  s+=fade(1-a,r0.map(q=>T(q.t,q.c,y,62)).join(''))+fade(a,r1.map(q=>T(q.t,q.c,y,62)).join(''));
  s+=fade(W(ctx,.2,.4),`<rect x="${r1[3].x-10}" y="${y-58}" width="${r1[3].w+20}" height="84" rx="10" fill="none" stroke="${MX.E}" stroke-width="3"/>`+label('右辺にも E',r1[3].c,y+62,{size:24,color:MX.E,anchor:'middle',weight:700}));
  const q=W(ctx,.55,.75),pul=.5+.5*Math.sin(ctx.t*5);
  s+=fade(q,T(`${vs}^2=`,540,390,64)+`<rect x="610" y="320" width="120" height="100" rx="14" fill="${MX.hi}" fill-opacity="${.06+.08*pul}" stroke="${MX.hi}" stroke-width="3"/>`+label('？',670,392,{size:60,color:MX.hi,anchor:'middle',weight:700}));
  s+=fade(W(ctx,.8,.95),label('予想してみよう',670,478,{size:26,color:MX.dim,anchor:'middle',weight:700}));
  return stage(ctx,p,s);},
 'mx7-n-v2':(p,ctx)=>{
  const r1=ROW([Es,'=',`${e0m0}\\,${vs}^2`,Es],62,600),y=190;
  let s=r1.map(q=>T(q.t,q.c,y,62)).join('');
  s+=fade(W(ctx,.05,.25),label('E ≠ 0 なので、両辺を E で割れる',600,272,{size:26,color:MX.dim,anchor:'middle',weight:700}));
  const k=W(ctx,.3,.45);s+=strike(r1[0],y,62,k)+strike(r1[3],y,62,k);
  s+=fade(W(ctx,.62,.8),T(`1=${e0m0}\\,${vs}^2`,600,410,60));
  return stage(ctx,p,s);},
 'mx7-n-v2b':(p,ctx)=>{
  const r1=ROW([Es,'=',`${e0m0}\\,${vs}^2`,Es],62,600),k=W(ctx,0,.15),y=mix(410,190,W(ctx,.05,.25));
  let s=fade(1-k,r1.map(q=>T(q.t,q.c,190,62)).join('')+strike(r1[0],190,62,1)+strike(r1[3],190,62,1));
  s+=T(`1=${e0m0}\\,${vs}^2`,600,y,60);
  s+=fade(W(ctx,.2,.38),label('両辺を ε₀μ₀ で割る',600,285,{size:26,color:MX.dim,anchor:'middle',weight:700}));
  s+=fade(W(ctx,.62,.8),T(`${vs}^2=\\dfrac{1}{${e0m0}}`,600,410,60));
  return stage(ctx,p,s);},
 'mx7-n-efree':(p,ctx)=>{
  let s=T(`${vs}^2=\\dfrac{1}{${e0m0}}`,1000,180,40)+fade(W(ctx,.05,.2),word('E が残らない',40,150,{size:28,color:MX.E}));
  const wave=(yc,A,g,lab)=>{const ph=ctx.t*3,pts=[];for(let x=120;x<=1100;x+=5)pts.push([x,yc-A*Math.sin((x-120)/60-ph)]);
   return fade(g,draw(pts,1,{color:MX.E,w:4})+label(lab,40,yc+8,{size:24,color:MX.ink,weight:700}));};
  s+=wave(300,22,W(ctx,.5,.62),'弱い')+wave(430,58,W(ctx,.62,.74),'強い');
  const xm=160+((ctx.t*180)%900);s+=fade(W(ctx,.74,.86),line(xm,250,xm,500,{color:MX.hi,w:3,dash:'7 6'})+arrow(xm+6,245,xm+70,245,{color:MX.hi,w:4,head:12})+label('同じ速さ',xm+80,254,{size:24,color:MX.hi,weight:700}));
  return stage(ctx,p,s);},
 'mx7-n-sqrt':(p,ctx)=>{
  const top=`${vs}^2=\\dfrac{1}{${e0m0}}`;
  let s=T(top,600,195,52)+fade(W(ctx,.05,.2),`<rect x="${600-texWidth(top,52,false)/2-12}" y="130" width="${texWidth(`${vs}^2`,52,false)+24}" height="80" rx="10" fill="none" stroke="${MX.hi}" stroke-width="3"/>`+label('二乗する前の 速さが欲しい',860,120,{size:24,color:MX.dim,anchor:'middle'}));
  s+=fade(W(ctx,.4,.55),label('速さは 正 → 正の平方根',600,300,{size:26,color:MX.dim,anchor:'middle',weight:700}));
  const g=W(ctx,.65,.85);
  s+=fade(g,`<rect x="400" y="330" width="400" height="168" rx="16" fill="${MX.hi}" fill-opacity=".10" stroke="${MX.hi}" stroke-width="3"/>`+T(`${vs}=\\dfrac{1}{\\sqrt{${e0m0}}}`,600,432,54));
  return stage(ctx,p,s,{glow:[600,420,240,MX.hi]});},
 // review 66 (補足): a numerical example and √(1/a) = 1/√a
 'mx7-n-sqrtnote':(p,ctx)=>{
  let s=word('補足',40,140,{size:26,color:MX.dim,border:MX.faint});
  s+=fade(W(ctx,.02,.2),T(`${vs}^2=9`,380,240,52)+label('→',560,250,{size:40,color:MX.dim,anchor:'middle'})+T(`${vs}=3`,720,240,52)+label('（正の方）',880,250,{size:24,color:MX.ink}));
  s+=fade(W(ctx,.45,.65),T('\\sqrt{\\dfrac{1}{a}}=\\dfrac{1}{\\sqrt{a}}',560,400,52)+label('（a は正の数）',800,410,{size:24,color:MX.ink}));
  return stage(ctx,p,s);},
 'mx7-n-cards':(p,ctx)=>{const sc=CARD.s,[lx,ly]=CARD.L,[rx,ry]=CARD.R;
  let s=fade(W(ctx,0,.2),cardAt(0,lx,ly,sc,{gn:1,glow:W(ctx,.55,.75)})+cardAt(1,rx,ry,sc,{gn:1,glow:W(ctx,.55,.75),t:ctx.t}));
  s+=vFormula(600,260,58);
  s+=fade(W(ctx,.15,.35),label('残ったのは 二つの定数',600,150,{size:26,color:MX.hi,anchor:'middle',weight:700}));
  const b0=badge(0,lx,ly,sc),b1=badge(1,rx,ry,sc),g=W(ctx,.55,.85);
  s+=fade(g,`<path d="M${b0[0]+30} ${b0[1]} C 480 ${b0[1]}, 540 360, 575 300" fill="none" stroke="${MX.E}" stroke-width="3" stroke-dasharray="8 7"/><path d="M${b1[0]-30} ${b1[1]} C 720 ${b1[1]}, 660 360, 632 300" fill="none" stroke="${MX.B}" stroke-width="3" stroke-dasharray="8 7"/>`);
  s+=fade(W(ctx,.7,.9),label('最初の 二つの実験で 決まる',600,470,{size:28,color:MX.hi,anchor:'middle',weight:700}));
  return stage(ctx,p,s);},
 'mx7-n-values':(p,ctx)=>{const sc=CARD.s,[lx,ly]=CARD.L,[rx,ry]=CARD.R,fly=W(ctx,.88,1.15);
  let s=cardAt(0,lx,ly,sc,{gn:1})+cardAt(1,rx,ry,sc,{gn:1,t:ctx.t});
  s+=vFormula(600,260,58);
  s+=fade(fly,T(`${vs}=\\dfrac{1}{\\sqrt{(8.85\\times10^{-12})(1.26\\times10^{-6})}}`,600,408,30));
  s+=fade(W(ctx,.1,.3),T('\\varepsilon_0\\approx 8.85\\times10^{-12}\\ \\mathrm{F/m}',lx+235*sc,470,30));
  s+=fade(W(ctx,.55,.75),T('\\mu_0\\approx 1.26\\times10^{-6}\\ \\mathrm{N/A^2}',rx+235*sc,470,30));
  return stage(ctx,p,s);},
 'mx7-n-prod':(p,ctx)=>stage(ctx,p,calc(ctx,0)),
 'mx7-n-unit1':(p,ctx)=>stage(ctx,p,units(ctx,0)),
 'mx7-n-unit2':(p,ctx)=>stage(ctx,p,units(ctx,1)),
 'mx7-n-root':(p,ctx)=>stage(ctx,p,calc(ctx,1)),
 'mx7-n-recip':(p,ctx)=>stage(ctx,p,calc(ctx,2)),
 'mx7-n-match':(p,ctx)=>{const sc=.5;
  let s=cardAt(0,30,140,sc,{gn:1,glow:W(ctx,.55,.7)})+cardAt(1,935,140,sc,{gn:1,glow:W(ctx,.55,.7),t:ctx.t});
  s+=callout(390,110,420,120,label('計算した速さ',600,145,{size:24,color:MX.dim,anchor:'middle'})+T(`${vs}\\approx 3.00\\times10^{8}\\ \\mathrm{m/s}`,600,205,36));
  s+=callout(390,280,420,120,label('測られていた光の速さ',600,315,{size:24,color:MX.dim,anchor:'middle'})+T('c\\approx 3.00\\times10^{8}\\ \\mathrm{m/s}',600,375,36),W(ctx,.1,.25));
  const ok=W(ctx,.3,.42);s+=fade(ok,word('測定の精度で 一致',600,258,{size:24,color:MX.hi,anchor:'middle',border:MX.hi}));
  const g=W(ctx,.6,.8);
  s+=fade(g,`<path d="M${30+235*sc} ${140+300*sc} C ${30+235*sc} 420, 300 460, 420 470" fill="none" stroke="${MX.E}" stroke-width="3.5"/><path d="M${935+235*sc} ${140+300*sc} C ${935+235*sc} 420, 900 460, 780 470" fill="none" stroke="${MX.B}" stroke-width="3.5"/>`
   +word('別々に測った 電気と磁気の数 → 光の速さ',600,478,{size:26,color:MX.hi,anchor:'middle',border:MX.hi}));
  const burst=clamp(after(ctx,0)/1.6);if(burst>0&&burst<1)s+=fade(1-burst,ring(600,330,40+300*burst,{color:MX.hi,w:4}));
  s+=[[330,150],[870,150],[330,420],[870,420]].map(([x,y],i)=>sparkle(x,y,14,clamp((after(ctx,0)-i*.15)/.4))).join('');
  return stage(ctx,p,s,{glow:[600,330,300,MX.hi]});},
 'mx7-n-quote':(p,ctx)=>{
  let s=`<rect x="140" y="130" width="920" height="250" rx="10" fill="${MX.paper}" fill-opacity=".97"/>`+label('“',170,195,{size:80,color:'#b9a98a'});
  const jp=['光は、電気と磁気の現象を起こすのと','同じ媒質の、横波である。','——この推論は、ほとんど避けられない。'];
  s+=jp.map((l,i)=>`<text x="230" y="${200+i*54}" font-size="36" fill="${MX.paperInk}" font-family="'Hiragino Mincho ProN','Yu Mincho',serif">${l}</text>`).join('');
  s+=`<text x="1030" y="362" font-size="24" fill="#6b6152" text-anchor="end" font-family="'Hiragino Mincho ProN','Yu Mincho',serif">J. C. マクスウェル（1862年）の要旨</text>`;
  return stage(ctx,p,fade(at(ctx,0,.6),s));},
 // review 68: agreement of speeds = strong evidence, then experimental confirmation
 'mx7-n-evidence':(p,ctx)=>{
  const bx=(x,w,t1,t2,col,g,hi=0)=>fade(g,`<rect x="${x}" y="190" width="${w}" height="170" rx="16" fill="${MX.bg2}" stroke="${hi?col:MX.faint}" stroke-width="${hi?3:2}"/>`+label(t1,x+w/2,255,{size:28,color:col,anchor:'middle',weight:700})+label(t2,x+w/2,305,{size:22,color:MX.ink,anchor:'middle'}));
  let s=bx(40,330,'速さが 一致','電磁波の計算 ＝ 光の測定',MX.ink,W(ctx,0,.12));
  s+=fade(W(ctx,.12,.28),word('＝ 同じもの の 証明？',205,440,{size:24,color:MX.plus,anchor:'middle',border:MX.plus})+line(90,452,320,428,{color:MX.plus,w:4}));
  s+=fade(W(ctx,.4,.52),arrow(378,275,428,275,{color:MX.dim,w:4,head:14}))+bx(435,330,'強い 手がかり','光は 電磁波では？',MX.hi,W(ctx,.4,.52),1);
  s+=fade(W(ctx,.62,.75),arrow(773,275,823,275,{color:MX.dim,w:4,head:14}))+bx(830,330,'のちの実験','ヘルツ：電磁波をつくり',MX.good,W(ctx,.62,.75),1);
  s+=fade(W(ctx,.8,.92),label('光と同じ性質を 確かめる',995,335,{size:22,color:MX.ink,anchor:'middle'}));
  return stage(ctx,p,s);},
 // review 57/68 (e): what was computed — the step-shaped plane wave; smooth waves are not derived here
 'mx7-n-scope':(p,ctx)=>{
  const g1=W(ctx,0,.15),g2=W(ctx,.4,.55);
  let s=fade(g1,`<rect x="40" y="110" width="540" height="330" rx="16" fill="${MX.bg2}" stroke="${MX.hi}" stroke-width="3"/>`+label('今回 計算した波',310,155,{size:26,color:MX.hi,anchor:'middle',weight:700})
   +line(90,330,540,330,{color:MX.faint,w:2})+draw([[90,230],[330,230],[330,330],[540,330]],1,{color:MX.E,w:4})+label('階段形・平らな波面',310,400,{size:24,color:MX.ink,anchor:'middle'}))+check(530,160,g1);
  const pts=[];for(let x=670;x<=1110;x+=4)pts.push([x,290-55*Math.sin((x-670)/45)]);
  s+=fade(g2,`<rect x="620" y="110" width="540" height="330" rx="16" fill="${MX.bg2}" stroke="${MX.faint}" stroke-width="2" stroke-dasharray="10 8"/>`+label('なめらかな形の波',890,155,{size:26,color:MX.ink,anchor:'middle',weight:700})
   +draw(pts,1,{color:MX.E,w:4})+label('同じ速さで 進む',890,385,{size:24,color:MX.ink,anchor:'middle'})+label('（その計算は この動画の外）',890,420,{size:22,color:MX.dim,anchor:'middle'}));
  return stage(ctx,p,s);},

 // ───────── chapter 8 ─────────
 'mx8-n-trace0':(p,ctx)=>stage(ctx,p,road(ctx,0)),
 'mx8-n-trace1':(p,ctx)=>stage(ctx,p,road(ctx,1)),
 'mx8-n-trace2':(p,ctx)=>stage(ctx,p,road(ctx,2)),
 'mx8-n-quiz':(p,ctx)=>{const ans=ctx.cue.diagram==='mx8-n-quiz-ans',ok=ans?W(ctx,0,.2):0;
  let s=fit(EQ[2].tex,600,160,520,52,{color:MX.ink})+label('② 磁場のガウスの法則',600,215,{size:22,color:MX.dim,anchor:'middle'});
  const pg=ans?1:W(ctx,.2,.35),qg=ans?1:W(ctx,.3,.45);
  s+=panelBox(40,240,540,265,{hi:ok,g:pg})+panelBox(620,240,540,265,{dim:ok,g:qg});
  s+=fade(pg,label('左',70,280,{size:28,color:MX.hi,weight:700})+magnetCut(ctx,310,360)+label('切っても N と S がセット',310,470,{size:24,color:MX.ink,anchor:'middle',weight:700}));
  s+=fade(qg*(1-.55*ok),label('右',650,280,{size:28,color:MX.hi,weight:700})+coilDemo(ctx,890,380)+label('動かすと コイルに電流',890,470,{size:24,color:MX.ink,anchor:'middle',weight:700}));
  if(!ans){const e=after(ctx,.1);s+=fade(W(ctx,.7,.85),word('左と右の どちら？',960,165,{size:30,color:MX.hi,anchor:'middle',border:MX.hi}));
   if(e>0&&e<3.4){const n=3-Math.floor(e);s+=`<circle cx="600" cy="380" r="46" fill="${MX.bg}" fill-opacity=".92" stroke="${MX.hi}" stroke-width="4"/>`+label(n>0?String(n):'？',600,402,{size:56,color:MX.hi,anchor:'middle',weight:700});}}
  else{s+=check(545,280,ok);
   const bag=W(ctx,.3,.5);s+=fade(bag,`<ellipse cx="${310+92}" cy="360" rx="84" ry="56" fill="none" stroke="${MX.hi}" stroke-width="3" stroke-dasharray="8 6"/>`+label('出る − 入る ＝ 0',402,288,{size:22,color:MX.hi,anchor:'middle',weight:700}));
   s+=fade(W(ctx,.45,.6),label('③ の現象',1140,282,{size:24,color:MX.dim,anchor:'end',weight:700}));}
  return stage(ctx,p,s);},
 'mx8-n-quiz-ans':(p,ctx)=>mx2p78Diagrams['mx8-n-quiz'](p,ctx),
 // review 72: one reasoning check — why was ③ alone not enough? (review 69: the concrete answer)
 'mx8-n-quiz2':(p,ctx)=>{const ans=ctx.cue.diagram==='mx8-n-quiz2-ans';
  const card=(x,title,src,sub,col,g,hi)=>fade(g,`<rect x="${x}" y="110" width="520" height="220" rx="16" fill="${MX.bg2}" stroke="${hi?col:MX.faint}" stroke-width="${hi?3:2}"/>`+label(title,x+30,152,{size:24,color:col,weight:700})+T(src,x+260,235,48)+label(sub,x+260,305,{size:22,color:MX.ink,anchor:'middle'}));
  let s=card(50,'③ から',`${Es}=${vs}\\,${Bs}`,ans?'関係は一つ：v はまだ 決まらない':'v は これで決まる？',MX.E,ans?1:W(ctx,.15,.3),!ans);
  if(!ans){s+=fade(W(ctx,.6,.75),word('なぜ ③ だけでは 足りない？',600,420,{size:30,color:MX.hi,anchor:'middle',border:MX.hi}));
   const e=after(ctx,.1);if(e>0&&e<3.4){const n=3-Math.floor(e);s+=`<circle cx="900" cy="220" r="46" fill="${MX.bg}" fill-opacity=".92" stroke="${MX.hi}" stroke-width="4"/>`+label(n>0?String(n):'？',900,242,{size:56,color:MX.hi,anchor:'middle',weight:700});}}
  else{const g=W(ctx,.45,.6);
   s+=card(630,'④ から（電場の変化の項）',`${Bs}=${e0m0}\\,${vs}\\,${Es}`,'電場の変化 → 磁場',MX.B,g,1);
   s+=fade(W(ctx,.75,.9),word('合わせて E と B が消える → v ＝ 1 ／ √(ε₀μ₀)',600,420,{size:26,color:MX.hi,anchor:'middle',border:MX.hi}))+check(1120,420,W(ctx,.8,.95));}
  return stage(ctx,p,s);},
 'mx8-n-quiz2-ans':(p,ctx)=>mx2p78Diagrams['mx8-n-quiz2'](p,ctx),
 'mx8-n-glass':(p,ctx)=>{
  let s=glass(at(ctx,0,.4))+word('次の問い',40,192,{size:28,color:MX.hi,g:W(ctx,0,.15)});
  s+=frontsStraight(ctx,{g:W(ctx,.2,.4)});
  s+=fade(W(ctx,.55,.75),`<rect x="790" y="150" width="370" height="200" rx="16" fill="${MX.bg2}" stroke="${MX.faint}" stroke-width="2"/>`+label('真空より',975,225,{size:30,color:MX.ink,anchor:'middle',weight:700})+label('遅く進む',975,285,{size:40,color:MX.hi,anchor:'middle',weight:700}));
  return stage(ctx,p,s);},
 // review 70: the response of the glass's charges changes how the wave travels; the vacuum formula is not reused
 'mx8-n-glass2':(p,ctx)=>{
  let s=glass()+frontsStraight(ctx,{g:.5})+glassCharges(ctx,W(ctx,.02,.2));
  s+=fade(W(ctx,.1,.28),word('電荷が 電場に揺すられて 応える',GX+175,478,{size:22,color:MX.E,anchor:'middle'}));
  s+=fade(W(ctx,.55,.7),`<rect x="790" y="150" width="370" height="250" rx="16" fill="${MX.bg2}" stroke="${MX.faint}" stroke-width="2"/>`+label('真空の式',975,192,{size:26,color:MX.ink,anchor:'middle',weight:700})+vFormula(975,290,40,false)
   +line(880,305,1070,260,{color:MX.plus,w:4})+label('そのままは 使えない',975,355,{size:24,color:MX.plus,anchor:'middle',weight:700}));
  s+=fade(W(ctx,.82,.95),word('詳しい計算は 次回',975,450,{size:26,color:MX.hi,anchor:'middle',border:MX.hi}));
  return stage(ctx,p,s);},
 // review 71: what the lines are — crests joined up (wavefronts)
 'mx8-n-fronts':(p,ctx)=>{
  let s=glass()+frontsStraight(ctx,{g:W(ctx,0,.15)})+profile(ctx,{g:W(ctx,.05,.25)});
  const off=offG(ctx),cx=40+off+LAMG*(off<40?1:0);
  s+=fade(W(ctx,.2,.35),dot(cx,159,7,MX.hi)+label('山',cx+12,150,{size:22,color:MX.hi,weight:700}));
  s+=fade(W(ctx,.3,.45),`<rect x="790" y="150" width="370" height="130" rx="16" fill="${MX.bg2}" stroke="${MX.faint}" stroke-width="2"/>`+label('波面',975,200,{size:30,color:MX.E,anchor:'middle',weight:700})+label('＝ 山の位置を 結んだ線',975,250,{size:24,color:MX.ink,anchor:'middle'}));
  s+=fade(W(ctx,.55,.7),arrow(120,420,GR-30,420,{color:MX.hi,w:5,head:18}));
  s+=fade(W(ctx,.62,.78),word('正面：間隔が つまるだけ',975,340,{size:24,color:MX.ink,anchor:'middle'})+word('曲がらない',975,400,{size:26,color:MX.hi,anchor:'middle'}));
  return stage(ctx,p,s);},
 'mx8-n-bend':(p,ctx)=>{const ob=W(ctx,.05,.2);
  let s=glass();
  s+=frontsStraight(ctx,{g:1-ob})+frontsOblique(ctx,{g:ob});
  const q=W(ctx,.3,.45);s+=fade(q,word('斜めに入ると？',975,250,{size:30,color:MX.hi,anchor:'middle',border:MX.hi})+label('？',GX+150,360,{size:120,color:MX.hi,anchor:'middle',weight:700}));
  s+=fade(W(ctx,.6,.75),word('今回は 解かない：次回の問い',975,340,{size:26,color:MX.ink,anchor:'middle'}));
  return stage(ctx,p,s);},
 'mx8-n-end':(p,ctx)=>{
  let s=`<rect x="40" y="128" width="1120" height="378" rx="20" fill="#101c35" stroke="${MX.hi}" stroke-opacity=".45" stroke-width="2"/>`;
  const g1=W(ctx,0,.15),g2=W(ctx,.15,.3),g3=W(ctx,.3,.45);
  s+=fade(g1,word('電気と磁石の実験',70,230,{size:32}));
  s+=fade(g2,arrow(420,218,480,218,{color:MX.dim,w:4,head:14})+T(`${cE('\\varepsilon_0')},\\ ${cB('\\mu_0')}`,580,225,48));
  s+=fade(g3,arrow(680,218,740,218,{color:MX.dim,w:4,head:14})+T(`c=\\dfrac{1}{\\sqrt{${e0m0}}}`,920,228,50)+label('光の速さ',920,300,{size:26,color:MX.dim,anchor:'middle'}));
  s+=fade(W(ctx,.6,.8),label('謎が解けた',600,420,{size:72,color:MX.hi,anchor:'middle',weight:700}));
  s+=[[150,380],[1050,370],[260,470],[940,480],[600,160]].map(([x,y],i)=>sparkle(x,y,16,W(ctx,.75+i*.07,.9+i*.07))).join('');
  return stage(ctx,p,s,{glow:[600,380,320,MX.hi]});},
};

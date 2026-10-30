// Diagrams for the Maxwell film, group D: chapter 7 (light is born, v = 1/√(ε₀μ₀)) and
// chapter 8 (reading the four equations again, glass prediction, closing card).
// Chapter 7 base: one 3-D space seen through a camera that can turn. The wave travels along x;
// E (cyan) points along y, B (orange) along z, so E ⟂ B ⟂ direction. The derivation uses a
// step-shaped front; the camera turns to a side view for ③ (vertical loop, B shows as ⊙)
// and to a top view for ④ (horizontal loop, E shows as ⊗).
// Chapter 8 base: the four equations as rows (accordion); the row being read opens up with
// its picture while the matching slot in the bar pulses.
// Timings are fractions of the voice (ctx.t / voice end) so they hold for any audio length.
import {MX,C,clamp,mix,smooth,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,stage,word,callout,quote,check,charge,magnet,fieldLines,fit,EQ} from './mx-common.mjs';
import {poly} from './anim.mjs';

// ---- timing ---------------------------------------------------------------------------------
const VE=ctx=>Math.max(.6,ctx.dur-(ctx.cue?.pause??0)-.12);
const vp=ctx=>ctx.t/VE(ctx);
// eased 0→1 while the voice goes from fraction a to b (b>1 reaches into the pause)
const W=(ctx,a,b)=>smooth(clamp((vp(ctx)-a)/Math.max(1e-3,b-a)));
const at=(ctx,f,d=.5)=>smooth(clamp((ctx.t-f*VE(ctx))/d));
const after=(ctx,s)=>ctx.t-VE(ctx)-s; // seconds after the voice ended (minus s)

// ---- formulas -------------------------------------------------------------------------------
const cE=s=>`{\\color{${MX.E}}${s}}`,cB=s=>`{\\color{${MX.B}}${s}}`,cV=s=>`{\\color{${MX.hi}}${s}}`;
const Es=cE('E'),Bs=cB('B'),vs=cV('v'),e0m0='\\varepsilon_0\\mu_0';
const T=(src,x,y,size=40,o={})=>tex(src,x,y,{size,auto:false,color:MX.ink,...o});
const SLOT=[150,450,750,1050];
const box=(x,y,src,size,color=MX.ink)=>{const w=texWidth(src,size,false)+36;return `<rect x="${x-w/2}" y="${y-size*.95}" width="${w}" height="${size*1.45}" rx="12" fill="none" stroke="${color}" stroke-width="2.5"/>`;};
const slotLink=(x,y,k,g)=>fade(g,line(x,y,SLOT[k-1],116,{color:MX.hi,w:3,dash:'8 7'})+dot(SLOT[k-1],116,6,MX.hi));
const sparkle=(x,y,r,g)=>fade(g,`<path d="M${x} ${y-r} L${x+r*.3} ${y-r*.3} L${x+r} ${y} L${x+r*.3} ${y+r*.3} L${x} ${y+r} L${x-r*.3} ${y+r*.3} L${x-r} ${y} L${x-r*.3} ${y-r*.3} Z" fill="${MX.hi}"/>`);

// ---- 3-D camera for chapter 7 --------------------------------------------------------------
const OY=330;
// th: turn about the x axis (0 = side view, π/2 = top view); sh: oblique shear of depth.
function cam(th,sh=0){const c=Math.cos(th),s=Math.sin(th);return (x,y,z)=>{const yp=y*c+z*s,zp=-y*s+z*c;return [x+sh*zp,OY-yp,zp];};}
const OBL=[-.6,-.38],SIDE=[0,0],TOP=[Math.PI/2,0];
const camMix=(a,b,u)=>cam(mix(a[0],b[0],u),mix(a[1],b[1],u));
function sym(x,y,out,color,g=1){return fade(g,ring(x,y,10,{color,w:3,fill:MX.bg})+(out?dot(x,y,4,color):line(x-6,y-6,x+6,y+6,{color,w:3})+line(x-6,y+6,x+6,y-6,{color,w:3})));}
// Arrow between two 3-D points; seen end-on it becomes ⊙ (toward us) or ⊗ (away).
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

// Wave field sampled every DX along x: E arrows (y) and B arrows (z) from the axis, length A·f(x).
const DX=40,AMP=100;
function field(P,f,{x0=20,x1=1180,g=1,gE=1,gB=1,extraB=0,extraE=0,curves=true,dx=DX}={}){
 let s='';const eC=[],bC=[];const DX=dx;
 for(let x=x0;x<=x1;x+=DX){const a=f(x);if(Math.abs(a)<.02){eC.push(P(x,0,0));bC.push(P(x,0,0));continue;}
  s+=arr3(P,[x,0,0],[x,AMP*a,0],MX.E,{g:g*gE,w:3.5})+arr3(P,[x,0,0],[x,0,AMP*a],MX.B,{g:g*gB,w:3.5});
  if(extraB>0&&x+DX/2<=x1&&Math.abs(f(x+DX/2))>.5)for(const y of [-65,65])s+=arr3(P,[x+DX/2,y,-30*f(x+DX/2)],[x+DX/2,y,30*f(x+DX/2)],MX.B,{g:g*extraB,w:3});
  if(extraE>0&&x+DX/2<=x1&&Math.abs(f(x+DX/2))>.5)for(const z of [-65,65])s+=arr3(P,[x+DX/2,-30*f(x+DX/2),z],[x+DX/2,30*f(x+DX/2),z],MX.E,{g:g*extraE,w:3});
  eC.push(P(x,AMP*a,0));bC.push(P(x,0,AMP*a));}
 if(curves){const ce=[],cb=[];for(let x=x0;x<=x1;x+=6){const a=f(x);ce.push(P(x,AMP*a,0));cb.push(P(x,0,AMP*a));}
  s=fade(g*gB*.8,draw(cb.map(q=>[q[0],q[1]]),1,{color:MX.B,w:2.5}))+fade(g*gE*.8,draw(ce.map(q=>[q[0],q[1]]),1,{color:MX.E,w:2.5}))+s;}
 return s;
}
const axisX=(P,g=1)=>{const a=P(0,0,0),b=P(1185,0,0);return fade(g,line(a[0],a[1],b[0],b[1],{color:'#3b4d70',w:2,dash:'6 8'}));};
// The step-shaped front: filled region behind it and a translucent wall at x = xf.
function slab(P,xf,{g=1,x0=0}={}){
 const R=112,box=[];for(const x of [x0,xf])for(const y of [-R,R])for(const z of [-R,R])box.push(P(x,y,z));
 const wall=[[xf,-R,-R],[xf,R,-R],[xf,R,R],[xf,-R,R]];
 return fade(g,poly(hull(box),{fill:MX.E,fo:.05,stroke:'none'}))+fade(g,poly(P2(P,wall),{fill:MX.hi,fo:.10,stroke:MX.hi,sw:3}));
}
const frontV=(P,xf,g)=>{const x=P(xf,0,0)[0];return fade(g,arrow(x+6,168,x+96,168,{color:MX.hi,w:6,head:18})+label('v',x+106,178,{size:34,color:MX.hi,weight:700}));};
const step=xf=>x=>x<xf?1:x<xf+DX?0:0;

// ---- chapter 7: chain of loops -------------------------------------------------------------
const WIREX=110,LINKS=[110,200,290,380,470,560,650,740,830,920,1010,1100];
function linkLoop(P,cx,kind,p,{r=80,color,g=1}){
 const pts=[];for(let i=0;i<=72;i++){const a=Math.PI+2*Math.PI*i/72,u=Math.cos(a)*r,v=Math.sin(a)*r;pts.push(kind==='B'?P(cx+u,0,v):P(cx+u,v,0));}
 const q=pts.map(z=>[z[0],z[1]]);let s=draw(q,p,{color,w:4.5});
 if(p>.3){const i=18,a=q[i],b=q[i+2],ang=Math.atan2(b[1]-a[1],b[0]-a[0]);s+=`<polygon points="${b[0]+12*Math.cos(ang)},${b[1]+12*Math.sin(ang)} ${b[0]-8*Math.cos(ang)+7*Math.sin(ang)},${b[1]-8*Math.sin(ang)-7*Math.cos(ang)} ${b[0]-8*Math.cos(ang)-7*Math.sin(ang)},${b[1]-8*Math.sin(ang)+7*Math.cos(ang)}" fill="${color}"/>`;}
 return fade(g,s);
}
function wire(P,ctx,{g=1,shake=0}={}){
 const a=P(WIREX,-180,0),b=P(WIREX,180,0);let s=line(a[0],a[1],b[0],b[1],{color:'#9aa6bd',w:10})+line(a[0],a[1],b[0],b[1],{color:'#c9d2e3',w:4});
 if(shake>0){const I=Math.sin(ctx.t*9)*shake,m=P(WIREX,0,0);s+=arrow(m[0]+22,m[1],m[0]+22+I*0,m[1]-70*I,{color:MX.I,w:6,head:16,g:Math.abs(I)>.05?1:0});
  s+=label('電流',m[0]+26,m[1]-120,{size:26,color:MX.I,weight:700});}
 return fade(g,s);
}
const AIR=Array.from({length:70},(_,i)=>[(i*197.3)%1150+30,150+((i*83.7)%350)]);
const air=g=>fade(g,AIR.map(([x,y])=>dot(x,y,3,'#8d9cb8',.5)).join(''));
function chain(P,ctx,shown,{g=1,pulse=0}={}){
 let s='';LINKS.forEach((x,k)=>{const q=shown(k);if(q<=0)return;const kind=k%2?'E':'B',col=kind==='E'?MX.E:MX.B;
  const br=pulse?.55+.45*Math.max(0,Math.sin(k*.9-ctx.t*5)):1;s+=linkLoop(P,x,kind,q,{color:col,g:g*br});});
 return s;
}

// ---- chapter 7: formula rows used in the combination -----------------------------------------
const ROW=(toks,size,cx)=>{const gap=size*.3,w=toks.map(t=>texWidth(t,size,false));let x=cx-(w.reduce((a,b)=>a+b,0)+gap*(w.length-1))/2;return toks.map((t,i)=>{const r={t,x,w:w[i],c:x+w[i]/2};x+=w[i]+gap;return r;});};

// ---- chapter 8: accordion rows --------------------------------------------------------------
const ROWTOP=122,ROWH=386,FOCUSH=212;
const heights=f=>[1,2,3,4].map(k=>f?(k===f?FOCUSH:(ROWH-FOCUSH)/3):ROWH/4);
const PREV={'mx8-four':null,'mx8-read1':null,'mx8-read2':1,'mx8-read3':2,'mx8-read4':3,'mx8-journey':4};
const FOC={'mx8-four':null,'mx8-read1':1,'mx8-read2':2,'mx8-read3':3,'mx8-read4':4,'mx8-journey':null};
function rowLayout(key,ctx){const u=smooth(clamp(ctx.t/.8)),a=heights(PREV[key]),b=heights(FOC[key]);let y=ROWTOP;return [0,1,2,3].map(i=>{const h=mix(a[i],b[i],u),r={y,h};y+=h;return r;});}
const WORDS={1:'中の電荷で決まる',2:'合計は いつもゼロ',3:'磁場の変化 → 電場',4:'電流・電場の変化 → 磁場'};
const EQ4TERM='\\mu_0\\varepsilon_0\\dfrac{d\\Phi_E}{dt}';
function eqRow(k,r,{g=1,focus=false,done=false,dim=false,grey=false,w=500,cx=390,term=0}={}){
 const size=Math.min(48,r.h*(focus?.3:.34)),yc=r.y+r.h/2-3;
 let s=`<rect x="20" y="${r.y+3}" width="1160" height="${r.h-6}" rx="14" fill="${focus?'#16223d':'#111b31'}" stroke="${focus?MX.hi:'#26375a'}" stroke-width="${focus?3:2}"/>`;
 s+=label('①②③④'[k-1],58,yc+Math.min(30,r.h*.2),{size:Math.min(44,r.h*.5),color:focus?MX.hi:MX.dim,anchor:'middle',weight:700});
 const src=grey?EQ[k].tex.replace(/\\color\{[^}]*\}/g,''):EQ[k].tex,tw=texWidth(src,size,false),sc=Math.min(1,w/tw);
 const ey=focus?yc-14:yc+size*.1;
 s+=grey?fit(src,cx,ey,w,size,{color:'#55627e'}):fit(src,cx,ey,w,size,{color:MX.ink});
 if(term>0&&k===4){const tw2=texWidth(EQ4TERM,size,false)*sc,right=cx+tw*sc/2;s+=fade(term,`<rect x="${right-tw2-8}" y="${ey-size*.95}" width="${tw2+16}" height="${size*1.55}" rx="10" fill="${MX.hi}" fill-opacity=".12" stroke="${MX.hi}" stroke-width="3"/>`);}
 if(focus)s+=label(WORDS[k],cx,r.y+r.h-26,{size:28,color:MX.hi,anchor:'middle',weight:700});
 if(done)s+=check(1140,r.y+r.h/2,1);
 return fade(g*(dim?.45:1),s);
}
// Pictures for each equation, drawn in a 490×200 box.
let _dip=null,_rad=null;
const dipLines=()=>_dip??=fieldLines([{x:170,y:100,q:1},{x:340,y:100,q:-1}],{n:12,step:3,bounds:[-5,-5,495,205]});
const radLines=()=>_rad??=Array.from({length:12},(_,k)=>{const a=2*Math.PI*(k+.5)/12;return [[170+20*Math.cos(a),100+20*Math.sin(a)],[170+110*Math.cos(a),100+110*Math.sin(a)]];});
function clipBox(inner){return `<svg x="0" y="0" width="490" height="200" viewBox="0 0 490 200" overflow="hidden">${inner}</svg>`;}
const PIC={
 1:(ctx,a,b)=>{let s='';
  s+=fade(1-b,radLines().map(l=>draw(l,a,{color:MX.E,w:3})).join(''))+fade(a,ring(170,100,56,{color:MX.dim,w:2.5,dash:'7 6'}));
  s+=fade(b,dipLines().map(l=>draw(l,b,{color:MX.E,w:3})).join(''));
  s+=charge(170,100,1,{r:20})+charge(340,100,-1,{r:20,g:b});
  return clipBox(s);},
 2:(ctx,a,b)=>{let s='';const loops=[40,70].flatMap(h=>[1,-1].map(d=>`<path d="M300 100 C 360 ${100-d*h*1.6}, 130 ${100-d*h*1.6}, 190 100" fill="none" stroke="${MX.B}" stroke-width="3"/>`));
  s+=fade(a*(1-b),loops.join('')+magnet(245,100,{w:130,h:38}));
  const sp=b*40;s+=fade(b,magnet(245-sp-35,100,{w:66,h:38})+magnet(245+sp+35,100,{w:66,h:38}));
  s+=fade(b,label('✂',245,60,{size:30,color:MX.ink,anchor:'middle'}));
  return clipBox(s);},
 3:(ctx,a,b)=>{let s='';const k=Math.sin(ctx.t*3),grow=.6+.4*k;
  // left: changing B (orange, out of page) with a circulating E (cyan)
  s+=fade(a,[[-1,-1],[1,-1],[-1,1],[1,1],[0,0]].map(([i,j])=>sym(110+i*34,100+j*34,true,MX.B,1)).join('')+`<circle cx="110" cy="100" r="${60+8*grow}" fill="none" stroke="${MX.E}" stroke-width="4"/>`+arrow(110+(68+8*grow)*0-2,100-60-8*grow,110-30,100-60-8*grow+2,{color:MX.E,w:4,head:14}));
  // right: magnet moving into a coil, current flows
  const mx=300+30*Math.sin(ctx.t*2.4),vel=Math.cos(ctx.t*2.4);
  s+=fade(b,[0,1,2,3].map(i=>`<ellipse cx="${400+i*18}" cy="100" rx="14" ry="50" fill="none" stroke="#c9d2e3" stroke-width="3"/>`).join('')+magnet(mx-40,100,{w:100,h:30})+arrow(427,40,427+vel*40,40,{color:MX.I,w:5,head:13,g:Math.abs(vel)>.1?1:0}));
  return clipBox(s);},
 4:(ctx,a,b)=>{let s='';const ch=.5+.5*Math.sin(ctx.t*2);
  s+=line(0,100,220,100,{color:'#c9d2e3',w:4})+line(270,100,490,100,{color:'#c9d2e3',w:4})+line(220,40,220,160,{color:'#c9d2e3',w:6})+line(270,40,270,160,{color:'#c9d2e3',w:6});
  s+=arrow(60,82,130,82,{color:MX.I,w:5,head:14})+label('I',95,70,{size:26,color:MX.I,anchor:'middle',weight:700});
  s+=[60,100,140].map(y=>arrow(226,y,226+38*ch,y,{color:MX.E,w:3,head:10,g:ch>.1?1:0})).join('');
  s+=fade(a,`<ellipse cx="110" cy="100" rx="20" ry="62" fill="none" stroke="${MX.B}" stroke-width="3.5"/>`+arrow(116,38,100,38,{color:MX.B,w:3,head:12}));
  s+=fade(a,`<ellipse cx="245" cy="100" rx="20" ry="66" fill="none" stroke="${b>0?MX.hi:MX.B}" stroke-width="${3.5+2*b}"/>`+arrow(251,34,235,34,{color:b>0?MX.hi:MX.B,w:3,head:12}));
  return clipBox(s);},
};
function picIn(k,ctx,r,a,b,g=1){const sc=(r.h-16)/200;return fade(g,`<g transform="translate(${660+(490-490*sc)} ${r.y+8}) scale(${sc.toFixed(4)})">${PIC[k](ctx,a,b)}</g>`);}
function readRow(key,ctx,p){
 const L=rowLayout(key,ctx),f=FOC[key];let s='';
 for(let k=1;k<=4;k++){const r=L[k-1],foc=k===f;
  s+=eqRow(k,r,{focus:foc,done:k<f,dim:k>f,w:foc?520:460,term:foc&&k===4?W(ctx,.55,.7):0});
  if(foc)s+=picIn(k,ctx,r,W(ctx,.08,.4),W(ctx,.56,.8));
  else if(k<f)s+=picIn(k,ctx,r,1,1,.6);}
 return s+fade(clamp(ctx.t/.4),`<polygon points="${SLOT[f-1]-12},126 ${SLOT[f-1]+12},126 ${SLOT[f-1]},114" fill="${MX.hi}"/>`);
}

// ---- chapter 8: glass --------------------------------------------------------------------------
const GX=390,GR=740;
function glass(g=1){let s=`<rect x="${GX}" y="140" width="${GR-GX}" height="365" rx="8" fill="#9fd8ff" fill-opacity=".10" stroke="#9fd8ff" stroke-opacity=".6" stroke-width="3"/>`;return fade(g,s+label('ガラス',GR-16,176,{size:28,color:'#bfe6ff',anchor:'end',weight:700})+label('真空',60,176,{size:28,color:MX.dim,weight:700}));}
function molecules(tilt,g=1){let s='';for(let i=0;i<4;i++)for(let j=0;j<2;j++){const x=GX+50+i*85,y=235+j*170;
 s+=`<g transform="rotate(${-90*tilt} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="24" ry="12" fill="#1b2a47" stroke="#6b7fa6" stroke-width="2"/><circle cx="${x+13}" cy="${y}" r="6" fill="${MX.plus}"/><circle cx="${x-13}" cy="${y}" r="6" fill="${MX.minus}"/></g>`;}return fade(g,s);}
// A sine wave (E, cyan) that is shorter inside the glass (same frequency, speed ÷ n).
function waveIn(ctx,{n=1.5,g=1,reach=1,front=null}={}){
 const lam=150,w=2*Math.PI,ph=ctx.t*.8,pts=[];const xEnd=front??GR;
 for(let x=40;x<=Math.min(xEnd,GR);x+=4){const ph1=x<GX?(x-40)/lam:(GX-40)/lam+(x-GX)*n/lam;pts.push([x,330-70*Math.sin(w*(ph1-ph))]);}
 return fade(g,draw(pts,reach,{color:MX.E,w:4}));
}
function fronts(ctx,{alpha=35,n=1.5,g=1}={}){
 const a=alpha*Math.PI/180,b=Math.asin(Math.sin(a)/n),Yc=330,lam=70,off=(ctx.t*40)%lam;let s='';
 for(let k=-14;k<=14;k++){const S=k*lam+off,pts=[];let seg=[];
  for(let y=145;y<=500;y+=5){const dy=y-Yc;let x=GX+(S-dy*Math.sin(a))/Math.cos(a);if(x>GX)x=GX+(S/n-dy*Math.sin(b))/Math.cos(b);
   if(x<40||x>GR){if(seg.length>1)pts.push(seg);seg=[];}else seg.push([x,y]);}
  if(seg.length>1)pts.push(seg);s+=pts.map(q=>draw(q,1,{color:MX.E,w:3,opacity:.8})).join('');}
 // ray
 const y0=330-(GX-150)*Math.tan(a);s+=arrow(150,y0,GX,330,{color:MX.hi,w:5,head:0})+arrow(GX,330,GX+(GR-GX-20),330+(GR-GX-20)*Math.tan(b),{color:MX.hi,w:5,head:18});
 return fade(g,s+line(GX,280,GX,380,{color:'#ffffff',w:1.5,dash:'5 6'}));
}

// ---- odometer ---------------------------------------------------------------------------------
function odometer(V,x,y,{size=96,color=MX.hi}={}){
 const digits=6,cw=size*.62,h=size*1.2;let s='';let pos=x;
 for(let k=digits-1;k>=0;k--){const d=V/10**k;const cont=k>=4?d%10:Math.floor(d)%10;const lo=Math.floor(cont),fr=cont-lo;
  s+=`<svg x="${pos}" y="${y-h}" width="${cw}" height="${h}" overflow="hidden"><rect width="${cw}" height="${h}" fill="#0a111f"/>`
   +label(String(lo%10),cw/2,h*.82-fr*h,{size,color,anchor:'middle',weight:700})+label(String((lo+1)%10),cw/2,h*.82-fr*h+h,{size,color,anchor:'middle',weight:700})+'</svg>';
  pos+=cw+4;if(k===3){s+=label(',',pos+2,y-8,{size:size*.7,color});pos+=size*.3;}}
 return {svg:s,right:pos};
}

// =============================================================================================
export const mxDDiagrams={
 // ───────── chapter 7 ─────────
 'mx7-chain1':(p,ctx)=>{const P=cam(...OBL);
  let s=axisX(P,.5)+air(.8)+wire(P,ctx,{shake:W(ctx,.05,.15)});
  s+=chain(P,ctx,k=>k===0?W(ctx,.33,.55):k===1?W(ctx,.66,.9):0);
  s+=word('磁場',WIREX+60,OY+95,{size:28,color:MX.B,g:at(ctx,.4)});
  s+=word('電場',LINKS[1]+50,OY-105,{size:28,color:MX.E,g:at(ctx,.72)});
  s+=fade(at(ctx,.68),arrow(P(LINKS[0]+40,0,40)[0],P(LINKS[0]+40,0,40)[1],LINKS[1]+60,OY+10,{color:MX.dim,w:3,head:12}));
  return stage(ctx,p,s);},
 'mx7-chain2':(p,ctx)=>{const P=cam(...OBL);
  const show=k=>k<=1?1:k===2?W(ctx,.04,.22):k===3?W(ctx,.27,.45):W(ctx,.5+(k-4)*.05,.6+(k-4)*.05);
  let s=axisX(P,.5)+air(.8)+wire(P,ctx,{shake:1});
  s+=chain(P,ctx,show,{pulse:vp(ctx)>.55?1:0});
  s+=word('磁場',WIREX+60,OY+95,{size:28,color:MX.B})+word('電場',LINKS[1]+50,OY-105,{size:28,color:MX.E});
  s+=fade(W(ctx,.7,.85),arrow(700,470,1000,470,{color:MX.ink,w:5,head:18})+label('空間を進む',1015,480,{size:30,color:MX.ink,weight:700}));
  return stage(ctx,p,s);},
 'mx7-wave':(p,ctx)=>{const P=cam(...OBL),gone=W(ctx,.45,.65),wv=W(ctx,.45,.7);
  let s=axisX(P,.5)+air(.8*(1-W(ctx,.2,.4)))+wire(P,ctx,{shake:1,g:1-W(ctx,.02,.2)});
  s+=fade(1-gone,chain(P,ctx,()=>1,{pulse:1}));
  const lam=320,kx=2*Math.PI/lam,f=x=>Math.sin(kx*(x-120*ctx.t));
  s+=fade(wv,field(P,f));
  s+=word('電磁波',600,470,{size:40,color:MX.ink,g:at(ctx,.62)})+fade(at(ctx,.62),label('電場',230,200,{size:26,color:MX.E,weight:700})+label('磁場',150,470,{size:26,color:MX.B,weight:700}));
  s+=fade(at(ctx,.7),arrow(1000,470,1150,470,{color:MX.ink,w:5,head:18}));
  return stage(ctx,p,s);},
 'mx7-front':(p,ctx)=>{const P=cam(...OBL),u=W(ctx,.4,.62),xf=mix(250,470,W(ctx,.4,1.15));
  const lam=320,kx=2*Math.PI/lam,sine=x=>Math.sin(kx*(x-120*ctx.t)),f=x=>mix(sine(x),x<xf?1:0,u)*(x<xf+DX||u<1?1:0);
  let s=axisX(P,.5)+slab(P,xf,{g:u})+field(P,f,{curves:u<.5});
  s+=word('速さは？',520,200,{size:38,color:MX.hi,g:at(ctx,.02)*(1-W(ctx,.4,.5))});
  s+=word('先頭',P(xf,0,0)[0]-8,178,{anchor:'end',size:28,color:MX.hi,g:W(ctx,.55,.7)});
  s+=frontV(P,xf,W(ctx,.78,.9));
  return stage(ctx,p,s);},
 'mx7-faraday-loop':(p,ctx)=>{const u=W(ctx,0,.22),P=camMix(OBL,SIDE,u),xf=mix(470,560,W(ctx,.42,.66));
  const f=step(xf),L=[[400,-80,0],[660,-80,0],[660,80,0],[400,80,0]];
  let s=axisX(P,.5)+slab(P,xf)+field(P,f,{curves:false,extraB:u,dx:80});
  const band=W(ctx,.42,.5);s+=fade(band,poly(P2(P,[[470,-80,0],[xf,-80,0],[xf,80,0],[470,80,0]]),{fill:MX.B,fo:.35,stroke:'none'}));
  s+=closed(P,L,{color:MX.ink,w:5,p:W(ctx,.08,.3)})+word('輪',330,200,{size:28,g:W(ctx,.2,.3)});
  s+=frontV(P,xf,1);
  const Y=P(0,-80,0)[1];s+=fade(W(ctx,.45,.6),line(470,Y+22,xf,Y+22,{color:MX.hi,w:3})+line(470,Y+12,470,Y+32,{color:MX.hi,w:3})+line(xf,Y+12,xf,Y+32,{color:MX.hi,w:3})+label('v × 1秒',(470+xf)/2,Y+62,{size:26,color:MX.hi,anchor:'middle',weight:700}));
  const hx=684;s+=fade(W(ctx,.8,.9),arrow(hx,OY,hx,OY-80,{color:MX.ink,w:3,head:12})+arrow(hx,OY,hx,OY+80,{color:MX.ink,w:3,head:12})+label('h',hx+14,OY+10,{size:32,color:MX.ink,weight:700}));
  s+=callout(790,150,390,170,label('1秒で増える磁束',985,200,{size:28,color:MX.dim,anchor:'middle'})+T(`${Bs}\\,${vs}\\,h`,985,270,56),W(ctx,.74,.86));
  return stage(ctx,p,s);},
 'mx7-e-vb':(p,ctx)=>{const P=cam(...SIDE),xf=560,L=[[400,-80,0],[660,-80,0],[660,80,0],[400,80,0]];
  let s=axisX(P,.5)+slab(P,xf)+field(P,step(xf),{curves:false,dx:80,extraB:1,gE:1-.6*W(ctx,.3,.4)});
  s+=poly(P2(P,[[470,-80,0],[xf,-80,0],[xf,80,0],[470,80,0]]),{fill:MX.B,fo:.3,stroke:'none'})+closed(P,L,{color:MX.ink,w:5})+frontV(P,xf,1);
  const e=W(ctx,.3,.45);s+=fade(e,arrow(400,OY+80,400,OY-80,{color:MX.E,w:9,head:22})+word('E h',385,OY+14,{size:30,color:MX.E,anchor:'end'}));
  s+=fade(W(ctx,.4,.52),label('0',530,OY-92,{size:28,color:MX.dim,anchor:'middle',weight:700})+label('0',530,OY+112,{size:28,color:MX.dim,anchor:'middle',weight:700})+label('0',682,OY+10,{size:28,color:MX.dim,weight:700}));
  let c=fit(EQ[3].tex,985,205,350,40,{color:MX.ink});
  c+=fade(W(ctx,.44,.58),T(`${Es}\\,h=${Bs}\\,${vs}\\,h`,985,310,44));
  c+=fade(W(ctx,.62,.8),T(`${Es}=${vs}\\,${Bs}`,985,430,64)+box(985,430,`${Es}=${vs}\\,${Bs}`,64));
  s+=callout(790,140,390,360,c,at(ctx,0,.4))+slotLink(985,140,3,at(ctx,.05));
  return stage(ctx,p,s);},
 'mx7-b-mevE':(p,ctx)=>{const u=W(ctx,0,.24),P=camMix(SIDE,TOP,u),xf=mix(560,650,W(ctx,.42,.6));
  let s=axisX(P,.5)+slab(P,xf)+field(P,step(xf),{curves:false,dx:80,extraB:1-u,extraE:u});
  s+=fade(1-u,closed(P,[[400,-80,0],[660,-80,0],[660,80,0],[400,80,0]],{color:MX.ink,w:5}));
  const A=[[500,0,-80],[760,0,-80],[760,0,80],[500,0,80]];s+=closed(P,A,{color:MX.ink,w:5,p:W(ctx,.16,.32)})+word('横向きの輪',560,480,{size:26,g:W(ctx,.2,.3)*(1-W(ctx,.5,.6))});
  s+=fade(W(ctx,.42,.5),poly(P2(P,[[560,0,-80],[xf,0,-80],[xf,0,80],[560,0,80]]),{fill:MX.E,fo:.3,stroke:'none'}));
  s+=frontV(P,xf,1);
  s+=fade(W(ctx,.5,.62),arrow(500,OY+80,500,OY-80,{color:MX.B,w:9,head:22})+word('B w',485,OY-40,{size:30,color:MX.B,anchor:'end'}));
  let c=fit(EQ[4].tex,985,200,360,40,{color:MX.ink});
  c+=fade(W(ctx,.3,.42),label('真空：電流 I = 0',985,258,{size:26,color:MX.dim,anchor:'middle'}));
  c+=fade(W(ctx,.55,.7),T(`${Bs}\\,w=${e0m0}\\,${Es}\\,${vs}\\,w`,985,335,40));
  c+=fade(W(ctx,.72,.9),T(`${Bs}=${e0m0}\\,${vs}\\,${Es}`,985,440,58)+box(985,440,`${Bs}=${e0m0}\\,${vs}\\,${Es}`,58));
  s+=callout(790,140,390,360,c,W(ctx,.18,.3))+slotLink(985,140,4,W(ctx,.2,.3));
  return stage(ctx,p,s);},
 'mx7-combine':(p,ctx)=>{
  let s=callout(90,140,440,120,label('③から',120,180,{size:24,color:MX.dim})+T(`${Es}=${vs}\\,${Bs}`,310,215,52),at(ctx,0,.4));
  s+=callout(670,140,440,120,label('④から',700,180,{size:24,color:MX.dim})+T(`${Bs}=${e0m0}\\,${vs}\\,${Es}`,890,215,52),at(ctx,.05,.4));
  const size=62,row=ROW([Es,'=',vs,`\\big(${e0m0}\\,${vs}\\,${Es}\\big)`],size,600),yR=400;
  const d=W(ctx,.3,.5),ins=W(ctx,.62,.85);
  // E = v B copies down from the ③ card
  const bw=texWidth(Bs,size,false),bx=row[3].x+bw/2;
  s+=fade(d,T(Es,mix(250,row[0].c,d),mix(215,yR,d),mix(52,size,d))+T('=',mix(290,row[1].c,d),mix(215,yR,d),mix(52,size,d))+T(vs,mix(325,row[2].c,d),mix(215,yR,d),mix(52,size,d)));
  s+=fade(d*(1-ins),T(Bs,mix(360,bx,d),mix(215,yR,d)-ins*50,size));
  s+=fade(W(ctx,.45,.6)*(1-ins),`<rect x="${bx-bw/2-10}" y="${yR-size*.9}" width="${bw+20}" height="${size*1.4}" rx="10" fill="none" stroke="${MX.B}" stroke-width="3" stroke-dasharray="7 6"/>`);
  // the ④ right-hand side flies into the place of B
  s+=fade(ins,T(row[3].t,mix(955,row[3].c,ins),mix(215,yR,ins),mix(46,size,ins)));
  s+=fade(W(ctx,.62,.75)*(1-ins),arrow(900,260,700,340,{color:MX.dim,w:3,head:12}));
  return stage(ctx,p,s);},
 'mx7-c':(p,ctx)=>{
  const a=W(ctx,0,.12),y1=180;
  const r0=ROW([Es,'=',vs,`\\big(${e0m0}\\,${vs}\\,${Es}\\big)`],62,600),r1=ROW([Es,'=',`${e0m0}\\,${vs}^2`,Es],56,600);
  let s=fade(1-a,r0.map(q=>T(q.t,q.c,mix(400,y1,a*0),62)).join(''));
  s+=fade(a,r1.map(q=>T(q.t,q.c,y1,56)).join(''));
  const k=W(ctx,.06,.2),cancel=W(ctx,.2,.3);
  for(const i of [0,3]){const q=r1[i];s+=fade(k*a,line(q.x-6,y1+18,q.x+q.w+6,y1-40,{color:'#ff6b6b',w:5}));}
  s+=fade(W(ctx,.08,.22),label('両辺の E が消える',840,190,{size:26,color:MX.dim}));
  s+=fade(W(ctx,.25,.42),T(`${vs}^2=\\dfrac{1}{${e0m0}}`,600,300,46));
  const g=W(ctx,.6,.8);
  s+=fade(g,`<rect x="400" y="340" width="400" height="168" rx="16" fill="${MX.hi}" fill-opacity=".10" stroke="${MX.hi}" stroke-width="3"/>`+T(`${vs}=\\dfrac{1}{\\sqrt{${e0m0}}}`,600,448,54));
  s+=sparkle(330,420,14,W(ctx,.95,1.1))+sparkle(870,470,12,W(ctx,1,1.2));
  void cancel;
  return stage(ctx,p,s,{glow:[600,440,260,MX.hi]});},
 'mx7-numbers':(p,ctx)=>{
  const fly=W(ctx,.9,1.25);
  let s=fade(1-fly,T(`${vs}=\\dfrac{1}{\\sqrt{${e0m0}}}`,600,215,54));
  s+=fade(fly,T(`${vs}=\\dfrac{1}{\\sqrt{(8.85\\times10^{-12})\\times(1.26\\times10^{-6})}}`,600,215,46));
  // electricity card: a capacitor
  const g1=W(ctx,.2,.35),g2=W(ctx,.55,.7);
  let c1=label('電気の実験',320,315,{size:28,color:MX.E,anchor:'middle',weight:700})+line(250,345,250,425,{color:'#c9d2e3',w:6})+line(300,345,300,425,{color:'#c9d2e3',w:6})+[360,385,410].map(y=>arrow(256,y,294,y,{color:MX.E,w:3,head:9})).join('')+label('+',232,392,{size:28,color:MX.plus,anchor:'middle',weight:700})+label('−',322,392,{size:28,color:MX.minus,anchor:'middle',weight:700});
  c1+=fade(W(ctx,.3,.45)*(1-.6*fly),T('\\varepsilon_0\\approx 8.85\\times10^{-12}',440,470,34));
  let c2=label('磁石の実験',880,315,{size:28,color:MX.B,anchor:'middle',weight:700})+magnet(840,390,{w:130,h:36})+`<path d="M905 390 C 950 330, 730 330, 775 390" fill="none" stroke="${MX.B}" stroke-width="3"/><path d="M905 390 C 950 450, 730 450, 775 390" fill="none" stroke="${MX.B}" stroke-width="3"/>`;
  c2+=fade(W(ctx,.66,.8)*(1-.6*fly),T('\\mu_0\\approx 1.26\\times10^{-6}',1000,470,34));
  s+=callout(140,285,420,215,c1,g1)+callout(700,285,420,215,c2,g2);
  // numbers flying up into the formula
  s+=fade(fly*(1-fly),T('8.85\\times10^{-12}',mix(440,560,fly),mix(470,240,fly),34)+T('1.26\\times10^{-6}',mix(1000,760,fly),mix(470,240,fly),34));
  return stage(ctx,p,s);},
 'mx7-result':(p,ctx)=>{
  const u=W(ctx,0,.42),V=Math.round(300000*(1-(1-u)**3));
  let s=label('秒速',250,272,{size:36,color:MX.dim,weight:700})+label('約',360,272,{size:36,color:MX.dim,weight:700});
  const o=odometer(u>=1?300000:300000*(1-(1-u)**3),410,290,{size:96});s+=o.svg+label('km',o.right+14,272,{size:44,color:MX.hi,weight:700});
  void V;
  const c=W(ctx,.5,.62),m=W(ctx,.62,.76);
  s+=callout(90,340,440,150,label('計算',310,378,{size:26,color:MX.dim,anchor:'middle'})+T(`${vs}\\approx 3.0\\times10^{8}\\ \\mathrm{m/s}`,310,440,40),c);
  s+=callout(670,340,440,150,label('測られていた光の速さ',890,378,{size:26,color:MX.dim,anchor:'middle'})+T(`c\\approx 3.0\\times10^{8}\\ \\mathrm{m/s}`,890,440,40),m);
  const eq=W(ctx,.8,.9),ok=W(ctx,.94,1.06);s+=fade(eq*(1-ok),label('＝',600,440,{size:64,color:MX.hi,anchor:'middle',weight:700}));
  s+=fade(ok,word('一致！',600,428,{size:34,color:MX.hi,anchor:'middle',border:MX.hi}));
  const burst=clamp(after(ctx,0)/1.6);if(burst>0&&burst<1)s+=fade(1-burst,ring(600,420,40+300*burst,{color:MX.hi,w:4}));
  s+=[[150,200],[1060,190],[110,470],[1110,480]].map(([x,y],i)=>sparkle(x,y,14,clamp((after(ctx,0)-i*.15)/.4))).join('');
  return stage(ctx,p,s,{glow:[600,330,300,MX.hi]});},
 'mx7-quote':(p,ctx)=>{
  const g2=W(ctx,.62,.75);
  let s=fade(1-.85*g2,quote(['We can scarcely avoid the inference that light','consists in the transverse undulations of the','same medium which is the cause of electric','and magnetic phenomena.'],'— J. C. Maxwell, 1862',{g:at(ctx,0,.6),y:160})
   +fade(W(ctx,.08,.2),label('「光は、電気と磁気の現象を起こすのと同じ媒質の横波だ',600,475,{size:25,color:MX.ink,anchor:'middle'})+label('——そう推論せずにはいられない」',600,506,{size:25,color:MX.ink,anchor:'middle'})));
  s+=fade(g2,`<rect x="300" y="230" width="600" height="140" rx="20" fill="${MX.bg}" fill-opacity=".9" stroke="${MX.hi}" stroke-width="3"/>`+label('光 ＝ 電磁波',600,325,{size:72,color:MX.hi,anchor:'middle',weight:700}));
  return stage(ctx,p,s,{glow:g2>0?[600,300,300,MX.hi]:null});},

 // ───────── chapter 8 ─────────
 'mx8-four':(p,ctx)=>{const L=rowLayout('mx8-four',ctx),lit=W(ctx,.55,.8);let s='';
  for(let k=1;k<=4;k++){const g=W(ctx,.05+(k-1)*.1,.2+(k-1)*.1);s+=fade(g,eqRow(k,L[k-1],{grey:true}));s+=fade(g*lit,eqRow(k,L[k-1]));
   s+=fade(g*(1-lit),label('？',900,L[k-1].y+L[k-1].h/2+16,{size:44,color:'#55627e',anchor:'middle',weight:700}));}
  s+=fade(lit,label('今なら 読める',900,320,{size:40,color:MX.hi,anchor:'middle',weight:700}));
  return stage(ctx,p,s);},
 'mx8-read1':(p,ctx)=>stage(ctx,p,readRow('mx8-read1',ctx,p)),
 'mx8-read2':(p,ctx)=>stage(ctx,p,readRow('mx8-read2',ctx,p)),
 'mx8-read3':(p,ctx)=>stage(ctx,p,readRow('mx8-read3',ctx,p)),
 'mx8-read4':(p,ctx)=>stage(ctx,p,readRow('mx8-read4',ctx,p)),
 'mx8-journey':(p,ctx)=>{const L=rowLayout('mx8-journey',ctx);let s='';
  const pf=1-clamp(ctx.t/.6);
  for(let k=1;k<=4;k++){const r=L[k-1],hot=(k===3||k===4)?W(ctx,.02,.15):0;s+=eqRow(k,r,{w:480,cx:370,dim:!hot&&W(ctx,.02,.15)>0&&vp(ctx)<.55});if(k===4)s+=picIn(4,ctx,r,1,1,pf);
   if(hot)s+=fade(hot*(1-W(ctx,.55,.65)),`<rect x="20" y="${r.y+3}" width="1160" height="${r.h-6}" rx="14" fill="none" stroke="${MX.hi}" stroke-width="3"/>`);}
  // ③ ⇄ ④ cycle
  const y3=L[2].y+L[2].h/2,y4=L[3].y+L[3].h/2,cyc=W(ctx,.05,.2),sp=ctx.t*3;
  s+=fade(cyc,`<path d="M640 ${y3} C 720 ${y3}, 720 ${y4}, 640 ${y4}" fill="none" stroke="${MX.B}" stroke-width="4"/><path d="M640 ${y4} C 590 ${y4}, 590 ${y3}, 640 ${y3}" fill="none" stroke="${MX.E}" stroke-width="4"/>`
   +dot(640+68*Math.max(0,Math.sin(sp)),mix(y3,y4,.5+.5*Math.cos(sp)),7,MX.hi));
  // the wave that comes out: light
  const wv=W(ctx,.25,.42),ph=ctx.t*4,pts=[],ptsB=[];for(let x=720;x<=1160;x+=5){const a=Math.sin((x-720)/45-ph);pts.push([x,(y3+y4)/2-40*a]);ptsB.push([x-10,(y3+y4)/2+26*a]);}
  s+=fade(wv,draw(ptsB,wv,{color:MX.B,w:3})+draw(pts,wv,{color:MX.E,w:4}))+word('光',1100,200,{size:44,color:MX.hi,anchor:'middle',g:W(ctx,.35,.48)});
  // the road from electrostatics to light
  const road=W(ctx,.55,.95),rp=[[58,L[0].y+L[0].h/2],[58,L[1].y+L[1].h/2],[58,L[2].y+L[2].h/2],[58,L[3].y+L[3].h/2],[110,500],[900,500],[1100,230]];
  s+=fade(road,label('静電気',96,L[0].y+L[0].h/2+10,{size:24,color:MX.hi,weight:700}))+draw(rp,road,{color:MX.hi,w:5});
  s+=sparkle(1100,160,16,W(ctx,.95,1.1));
  return stage(ctx,p,s);},
 'mx8-predict':(p,ctx)=>{
  let s=glass(at(ctx,0,.4))+word('最後の予想',40,230,{size:30,color:MX.hi,g:at(ctx,0,.3)*(1-W(ctx,.18,.25))});
  const pol=W(ctx,.2,.4);s+=molecules(pol*.35,W(ctx,.18,.3));
  s+=fade(W(ctx,.2,.3),arrow(120,450,120,290,{color:MX.E,w:7,head:20})+arrow(GX+300,450,GX+300,390,{color:MX.E,w:7,head:20}));
  s+=word('電場が できにくい',GX+20,480,{size:26,color:MX.E,g:W(ctx,.32,.42)});
  s+=word('ε ＞ ε₀',(GX+GR)/2,332,{anchor:'middle',size:34,color:MX.hi,g:W(ctx,.45,.55)});
  s+=waveIn(ctx,{front:GX,g:at(ctx,.1),n:1});
  let c=T(`${vs}=\\dfrac{1}{\\sqrt{\\varepsilon\\mu}}`,975,215,46);
  c+=fade(W(ctx,.66,.76),word('速くなる？',975,320,{size:34,anchor:'middle'}))+fade(W(ctx,.82,.92),word('遅くなる？',975,420,{size:34,anchor:'middle'}));
  s+=callout(790,140,370,350,c,W(ctx,.48,.6));
  const e=after(ctx,.1);if(e>0&&e<3.9){const n=3-Math.floor(e);s+=`<circle cx="215" cy="215" r="54" fill="${MX.bg}" fill-opacity=".92" stroke="${MX.hi}" stroke-width="4"/>`+label(n>0?String(n):'？',215,239,{size:64,color:MX.hi,anchor:'middle',weight:700});}
  return stage(ctx,p,s);},
 'mx8-answer':(p,ctx)=>{
  const bend=W(ctx,.6,.72);
  let s=glass()+molecules(.35,.5);
  s+=fade(1-bend,waveIn(ctx,{reach:1}))+fronts(ctx,{g:bend});
  s+=word('遅い → 波が 詰まる',GX+10,480,{size:26,color:MX.E,g:W(ctx,.3,.42)*(1-bend)})+word('曲がる！',GX+180,470,{size:34,color:MX.hi,g:W(ctx,.75,.86)});
  let c=T(`${vs}=\\dfrac{1}{\\sqrt{\\varepsilon\\mu}}`,975,215,46);
  c+=fade(W(ctx,.25,.4),label('ε が大きい',975,300,{size:28,color:MX.ink,anchor:'middle',weight:700})+label('↓',975,338,{size:30,color:MX.dim,anchor:'middle'})+label('v が小さい',975,376,{size:28,color:MX.hi,anchor:'middle',weight:700}));
  c+=word('遅くなる',975,450,{size:36,color:MX.hi,anchor:'middle',border:MX.hi})+check(1110,442,at(ctx,.05));
  s+=callout(790,140,370,350,c);
  return stage(ctx,p,s);},
 'mx8-end':(p,ctx)=>{
  let s=`<rect x="40" y="128" width="1120" height="378" rx="20" fill="#101c35" stroke="${MX.hi}" stroke-opacity=".45" stroke-width="2"/>`;
  const g1=W(ctx,0,.15),g2=W(ctx,.15,.3),g3=W(ctx,.3,.45);
  s+=fade(g1,word('電気と磁石の実験',70,230,{size:32}));
  s+=fade(g2,arrow(420,218,480,218,{color:MX.dim,w:4,head:14})+T('\\varepsilon_0,\\ \\mu_0',580,225,48));
  s+=fade(g3,arrow(680,218,740,218,{color:MX.dim,w:4,head:14})+T(`c=\\dfrac{1}{\\sqrt{${e0m0}}}`,920,228,50)+label('光の速さ',920,300,{size:26,color:MX.dim,anchor:'middle'}));
  const d=W(ctx,.6,.8);
  s+=fade(d,label('謎が解けた',600,420,{size:72,color:MX.hi,anchor:'middle',weight:700}));
  s+=[[150,380],[1050,370],[260,470],[940,480],[600,160]].map(([x,y],i)=>sparkle(x,y,16,W(ctx,.75+i*.07,.9+i*.07))).join('');
  return stage(ctx,p,s,{glow:[600,380,320,MX.hi]});},
};

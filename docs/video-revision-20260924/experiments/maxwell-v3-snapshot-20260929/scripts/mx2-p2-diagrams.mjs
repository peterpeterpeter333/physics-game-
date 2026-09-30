// Diagrams for the v3 (深く学ぶモード) Maxwell film, part p2 (chapter 2: 電場とガウスの法則).
// Keys: 'mx2-n-<name>'. Chapter experience: 調べる — probe the invisible field with a test charge.
// Timing: an element appears when the narration reaches the phrase that names it (T/G below map the
// phrase's position in the subtitle onto the voiced part of the sentence, as in mxA).
import {MX,C,clamp,mix,smooth,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,stage,word,callout,charge,fieldLines,fit} from './mx-common.mjs';
import {poly} from './anim.mjs';

// ---- timing -------------------------------------------------------------------------------
const VE=ctx=>Math.max(.6,(ctx?.dur??4)-(ctx?.cue?.pause??0)-.12);
function T(ctx,s,k=0){const sub=ctx?.cue?.subtitle??'';let i=-1;for(let j=0,f=0;j<=k;j++){i=sub.indexOf(s,f);if(i<0)break;f=i+1;}
 if(i<0)throw Error(`mx2-p2: phrase "${s}" not in subtitle: ${sub}`);return VE(ctx)*i/sub.length;}
// Elements start a little before the phrase is voiced (off<0), so they are on screen when it is heard.
const G=(ctx,s,{d=.45,k=0,off=-.3}={})=>smooth((ctx.t-T(ctx,s,k)-off)/d);

// ---- small pieces -------------------------------------------------------------------------
const F=C.F,W='#ffffff',GH='#c9d3e6',C1='#ff9c9c',C2='#9cb8ff';
const tx=(src,x,y,size,color=MX.ink,anchor='middle',opacity=1)=>tex(src,x,y,{size,color,anchor,auto:false,opacity});
const dash=(x,y,X,Y,g=1,color=MX.dim)=>fade(g,line(x,y,X,Y,{color,w:2.5,dash:'8 7'}));
const probe=(x,y,g=1,r=12)=>charge(x,y,1,{r,g});
const cross=(x,y,s,g,color=MX.plus)=>fade(g,line(x-s,y-s,x+s,y+s,{color,w:7})+line(x-s,y+s,x+s,y-s,{color,w:7}));
const cE=v=>`{\\color{${MX.E}}${v}}`,cQ=v=>`{\\color{${MX.plus}}${v}}`,cH=v=>`{\\color{${MX.hi}}${v}}`;
function along(pts,u){let L=0;const d=[];for(let i=1;i<pts.length;i++){const s=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);d.push(s);L+=s;}
 let want=L*clamp(u);for(let i=1;i<pts.length;i++){if(d[i-1]>=want||i===pts.length-1){const k=d[i-1]?clamp(want/d[i-1]):0;return {x:mix(pts[i-1][0],pts[i][0],k),y:mix(pts[i-1][1],pts[i][1],k),a:Math.atan2(pts[i][1]-pts[i-1][1],pts[i][0]-pts[i-1][0]),L};}want-=d[i-1];}
 return {x:pts[0][0],y:pts[0][1],a:0,L:0};}
const head=(x,y,a,color=MX.E,h=13)=>`<polygon points="${x+h*Math.cos(a)},${y+h*Math.sin(a)} ${x-h*.6*Math.cos(a)+h*.55*Math.sin(a)},${y-h*.6*Math.sin(a)-h*.55*Math.cos(a)} ${x-h*.6*Math.cos(a)-h*.55*Math.sin(a)},${y-h*.6*Math.sin(a)+h*.55*Math.cos(a)}" fill="${color}"/>`;
function fline(pts,p=1,{color=MX.E,w=3,opacity=1,at=.5}={}){let s=draw(pts,p,{color,w,opacity});if(p>=at+.05&&pts.length>2){const q=along(pts,at);if(q.L>60)s+=fade(opacity,head(q.x,q.y,q.a,color));}return s;}
// Arrow of length L centred on (x,y) pointing along angle a.
const carrow=(x,y,a,L,{color=MX.E,w=4,g=1}={})=>arrow(x-Math.cos(a)*L/2,y-Math.sin(a)*L/2,x+Math.cos(a)*L/2,y+Math.sin(a)*L/2,{color,w,head:Math.min(14,L*.5),g});
// TeX with a dark plate behind it (for labels sitting on field lines).
function plate(src,x,y,size,color){const w=texWidth(src,size,false)+22,h=size*1.35;return rect(x-w/2,y-h*.72,w,h,{fill:MX.bg,fo:.92,stroke:color,sw:2,rx:10})+tx(src,x,y,size,color);}
const pathOf=P=>`M${P.map(q=>q.map(v=>v.toFixed(1)).join(' ')).join(' L')} Z`;
const openPath=P=>`M${P.map(q=>q.map(v=>v.toFixed(1)).join(' ')).join(' L')}`;
// Thin cone seen from the side: a wedge from Q along angle a, half-angle phi, length L.
function wedge(Q,a,phi,L,{fill=MX.hi,fo=.13,edge=MX.hi,eo=.8,g=1,w=2}={}){const p1=[Q.x+L*Math.cos(a-phi),Q.y+L*Math.sin(a-phi)],p2=[Q.x+L*Math.cos(a+phi),Q.y+L*Math.sin(a+phi)];
 return fade(g,poly([[Q.x,Q.y],p1,p2],{fill,fo})+line(Q.x,Q.y,p1[0],p1[1],{color:edge,w,opacity:eo})+line(Q.x,Q.y,p2[0],p2[1],{color:edge,w,opacity:eo}));}
// Right-angle mark at P between unit directions u and v.
const rightMark=(P,u,v,s=12,color=W)=>draw([[P[0]+u[0]*s,P[1]+u[1]*s],[P[0]+u[0]*s+v[0]*s,P[1]+u[1]*s+v[1]*s],[P[0]+v[0]*s,P[1]+v[1]*s]],1,{color,w:2});
// Arc for an angle mark at (x,y) from angle a0 to a1 (screen radians).
function arcMark(x,y,r,a0,a1,color=MX.hi,w=3){const p0=[x+r*Math.cos(a0),y+r*Math.sin(a0)],p1=[x+r*Math.cos(a1),y+r*Math.sin(a1)];return `<path d="M${p0[0].toFixed(1)} ${p0[1].toFixed(1)} A${r} ${r} 0 0 ${a1>a0?1:0} ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}" fill="none" stroke="${color}" stroke-width="${w}"/>`;}

// ---- scene A: one charge, probed on a grid --------------------------------------------------
const QA={x:404,y:276};
const GX=Array.from({length:11},(_,i)=>110+98*i),GY=[140,208,276,344,412];
const AL=r=>clamp(62*(180/r)**2,10,62);
const P1={x:600,y:276},P2={x:208,y:276},P3={x:110,y:140};
function forceAt(pt,g=1,{color=F,op=1,k=1,src=QA}={}){const dx=pt.x-src.x,dy=pt.y-src.y,r=Math.hypot(dx,dy),ux=dx/r,uy=dy/r,L=AL(r)*k;
 return fade(op,arrow(pt.x+ux*16,pt.y+uy*16,pt.x+ux*(16+L),pt.y+uy*(16+L),{color,w:6,head:Math.min(16,L*.6),g}));}
// The map: arrows on the grid for a charge at src. reveal = radius shown so far; dim = opacity; col = 0 green(force) … 1 blue(field)
function map({reveal=1e9,dim=1,col=1,hl=null,skip=null,src=QA}={}){let s='';
 for(const x of GX)for(const y of GY){const dx=x-src.x,dy=y-src.y,r=Math.hypot(dx,dy);if(r<70)continue;if(skip&&skip.x===x&&skip.y===y)continue;
  const g=clamp((reveal-r)/90);if(g<=0)continue;const a=Math.atan2(dy,dx),L=AL(r),isH=hl&&hl.x===x&&hl.y===y,op=isH?1:dim;
  if(col<1)s+=fade(op*(1-col),carrow(x,y,a,L,{color:F,w:4,g}));
  if(col>0)s+=fade(op*col,carrow(x,y,a,L,{color:isH?MX.hi:MX.E,w:isH?6:4,g}));}
 return s;}

// ---- dipole ---------------------------------------------------------------------------------
const DP={x:400,y:300},DM={x:800,y:300};
let dipCache=null;const dipole=()=>dipCache??=fieldLines([{...DP,q:1},{...DM,q:-1}],{n:16,step:3,maxSteps:900,bounds:[0,85,1200,515]});
function dipE(x,y){let ex=0,ey=0;for(const c of [{...DP,q:1},{...DM,q:-1}]){const dx=x-c.x,dy=y-c.y,r2=dx*dx+dy*dy,r3=r2*Math.sqrt(r2);ex+=c.q*dx/r3;ey+=c.q*dy/r3;}return [ex,ey];}
function dipGrid(op){let s='';for(let x=110;x<=1090;x+=98)for(let y=130;y<=480;y+=70){if(Math.hypot(x-DP.x,y-DP.y)<55||Math.hypot(x-DM.x,y-DM.y)<55)continue;
 const [ex,ey]=dipE(x,y),m=Math.hypot(ex,ey),L=clamp(m*1.3e6,10,50);s+=carrow(x,y,Math.atan2(ey,ex),L,{color:MX.E,w:3});}return fade(op,s);}
// Superposition at one point XP: field of + (away) and of − (towards), each drawn 130 px long here.
const XP={x:600,y:170};
const SV=(()=>{const d1=[XP.x-DP.x,XP.y-DP.y],r1=Math.hypot(...d1),d2=[DM.x-XP.x,DM.y-XP.y],r2=Math.hypot(...d2);return {e1:[130*d1[0]/r1,130*d1[1]/r1],e2:[130*d2[0]/r2,130*d2[1]/r2]};})();
function superPic({g1=1,slide=1,gsum=1,gh=0}={}){const {e1,e2}=SV,o2=[XP.x+e1[0]*slide,XP.y+e1[1]*slide];let s='';
 s+=dash(DP.x,DP.y,XP.x,XP.y,g1*.8)+dash(DM.x,DM.y,XP.x,XP.y,g1*.8);
 s+=fade(g1*(slide>0?.35:0),line(XP.x,XP.y,XP.x+e2[0],XP.y+e2[1],{color:C2,w:3,dash:'6 6'}));
 s+=arrow(XP.x,XP.y,XP.x+e1[0],XP.y+e1[1],{color:C1,w:6,head:16,g:g1})+arrow(o2[0],o2[1],o2[0]+e2[0],o2[1]+e2[1],{color:C2,w:6,head:16,g:g1});
 s+=fade(g1*(1-slide),label('−が作る電場',XP.x-14,XP.y+86,{size:24,color:C2,anchor:'end',weight:700}));
 s+=fade(g1,label('＋が作る電場',XP.x-14,XP.y-40,{size:24,color:C1,anchor:'end',weight:700}));
 s+=arrow(XP.x,XP.y,XP.x+e1[0]+e2[0],XP.y+e1[1]+e2[1],{color:MX.E,w:8,head:20,g:gsum})+fade(gsum,label('合計の電場',XP.x+e1[0]+e2[0]+18,XP.y+10,{size:26,color:MX.E,weight:700}));
 s+=fade(gh,ring(XP.x,XP.y,14,{color:MX.hi,w:3}));
 s+=charge(DP.x,DP.y,1,{r:28})+charge(DM.x,DM.y,-1,{r:28});
 return s;}

// ---- 3D rays and spheres ------------------------------------------------------------------
const SC={x:380,y:300};
const FIB=Array.from({length:44},(_,i)=>{const y=1-2*(i+.5)/44,r=Math.sqrt(1-y*y),th=i*2.39996;return [r*Math.cos(th),y,r*Math.sin(th)];});
function view(d,beta,alpha){const [x,y,z]=d,x1=x*Math.cos(beta)+z*Math.sin(beta),z1=-x*Math.sin(beta)+z*Math.cos(beta);return [x1,y*Math.cos(alpha)-z1*Math.sin(alpha),y*Math.sin(alpha)+z1*Math.cos(alpha)];}
function rays3(beta,alpha,{g3=1,op=1,R=110,len=205,dots=0}={}){let back='',front='';
 for(const d of FIB){const flat=Math.abs(d[2])<.2,g=flat?1:g3;if(g<=0)continue;const [x,y,z]=view(d,beta,alpha),o=op*g*(.35+.65*(z+1)/2);
  const seg=line(SC.x+x*26,SC.y+y*26,SC.x+x*len,SC.y+y*len,{color:MX.E,w:2.5,opacity:o})+head(SC.x+x*len,SC.y+y*len,Math.atan2(y,x),MX.E,10*Math.max(.3,Math.hypot(x,y))).replace('/>',` opacity="${o.toFixed(2)}"/>`);
  const pd=dots>0?dot(SC.x+x*R,SC.y+y*R,z>0?5:3.5,z>0?MX.hi:MX.E,dots*g*(z>0?1:.45)):'';
  if(z<0)back+=seg+pd;else front+=seg+pd;}
 return {back,front};}
function sphereShell(cx,cy,R,alpha,{g=1}={}){return fade(g,`<circle cx="${cx}" cy="${cy}" r="${R}" fill="${MX.E}" fill-opacity=".08" stroke="${MX.E}" stroke-opacity=".85" stroke-width="3"/>`
 +`<ellipse cx="${cx}" cy="${cy}" rx="${R}" ry="${Math.max(2,R*Math.sin(alpha))}" fill="none" stroke="${MX.E}" stroke-opacity=".35" stroke-width="2" stroke-dasharray="6 6"/>`);}
// Front view of a sphere with the pierce points of evenly spread lines (same angular grid → same count).
const DEL=.3;
function spherePts(cx,cy,R){const out=[];for(let i=-5;i<5;i++)for(let j=-5;j<5;j++){const a=(i+.5)*DEL,b=(j+.5)*DEL,z=Math.cos(a)*Math.cos(b);if(z<.1)continue;out.push({x:cx+R*Math.sin(a)*Math.cos(b),y:cy-R*Math.sin(b),z});}return out;}
function frontSphere(cx,cy,R,{g=1,dots=1}={}){return fade(g,`<circle cx="${cx}" cy="${cy}" r="${R}" fill="${MX.E}" fill-opacity=".09" stroke="${MX.E}" stroke-opacity=".85" stroke-width="3"/>`
 +`<ellipse cx="${cx}" cy="${cy}" rx="${R}" ry="${R*.28}" fill="none" stroke="${MX.E}" stroke-opacity=".3" stroke-width="2" stroke-dasharray="6 6"/>`
 +fade(dots,spherePts(cx,cy,R).map(q=>dot(q.x,q.y,2.5+1.5*q.z,MX.E,.35+.65*q.z)).join('')));}
const WO=21,WS=40; // window: centre offset (+WO,-WO) from the sphere centre, side WS (pixels, same on both spheres)
const inWin=(cx,cy,R)=>spherePts(cx,cy,R).filter(q=>Math.abs(q.x-(cx+WO))<=WS/2&&Math.abs(q.y-(cy-WO))<=WS/2);

// ---- flat window in a uniform field (oblique 3D) -------------------------------------------
const WC={x:600,y:300};
const pj=(x,y,z)=>[WC.x+x+.45*z,WC.y-y-.3*z];
const LY=[-75,-25,25,75],LZ=[-75,-25,25,75];
function windowScene(th,{lineOp=1,count=1}={}){
 const sn=Math.sin(th),cs=Math.cos(th),corner=(s,y)=>pj(s*sn,y,s*cs);
 const wpts=[corner(-100,-100),corner(100,-100),corner(100,100),corner(-100,100)];
 let back='',front='',pierce='',n=0;
 for(const y of LY)for(const z of LZ){const hit=Math.abs(z)<=100*cs+1e-6,xi=z*Math.tan(th);
  const A=pj(-430,y,z),B=pj(430,y,z),M=pj(xi,y,z);
  if(hit){n++;back+=line(A[0],A[1],M[0],M[1],{color:MX.E,w:3,opacity:.55*lineOp});front+=arrow(M[0],M[1],B[0],B[1],{color:MX.E,w:3,head:12,opacity:lineOp});pierce+=dot(M[0],M[1],6,MX.hi);}
  else back+=arrow(A[0],A[1],B[0],B[1],{color:MX.E,w:3,head:12,opacity:.55*lineOp});}
 const win=poly(wpts,{fill:MX.hi,fo:.13,stroke:MX.hi,sw:3});
 return {svg:back+win+front+fade(count,pierce),n,wpts};}
// The tilted-window scenes are drawn smaller and to the left, leaving room for an inset on the right.
const TS=.8,TXO=-160,tp=(x,y)=>[(x-WC.x)*TS+WC.x+TXO,(y-WC.y)*TS+WC.y];
const tgrp=svg=>`<g transform="translate(${WC.x+TXO} ${WC.y}) scale(${TS}) translate(${-WC.x} ${-WC.y})">${svg}</g>`;
const TH1=-.96;
// Face-on panels (seen from the field direction): dots = lines through the window.
const PS=140,PSP=35;
function facePanel(x0,y0,dense=false){let t=rect(x0,y0,PS,PS,{fill:MX.hi,fo:.13,stroke:MX.hi,sw:3,rx:2});
 if(!dense){for(let i=0;i<4;i++)for(let j=0;j<4;j++)t+=dot(x0+PSP/2+i*PSP,y0+PSP/2+j*PSP,7,MX.E);}
 else{for(let j=0;j<8;j++)for(let i=0;i<4;i++)t+=dot(x0+(j%2?26.25:8.75)+i*PSP,y0+8.75+j*17.5,6,MX.E);}
 return t;}
function windowPanels({g2=1,gE=1,op=1}={}){let s='';
 s+=label('電場の向きから見た窓（点＝つき抜ける線）',600,116,{size:22,color:MX.dim,anchor:'middle'});
 s+=label('窓 1枚',200,168,{size:26,color:MX.ink,anchor:'middle',weight:700})+facePanel(130,190)+label('16本',200,378,{size:32,color:MX.E,anchor:'middle',weight:700});
 s+=fade(g2,label('窓 2枚（面積 2倍）',605,168,{size:26,color:MX.ink,anchor:'middle',weight:700})+facePanel(460,190)+facePanel(610,190)+label('32本 ＝ 2倍',605,378,{size:32,color:MX.E,anchor:'middle',weight:700}));
 s+=fade(gE,label('電場 2倍',1000,168,{size:26,color:MX.ink,anchor:'middle',weight:700})+facePanel(930,190,true)+label('32本 ＝ 2倍',1000,378,{size:32,color:MX.E,anchor:'middle',weight:700}));
 return fade(op,s);}

// ---- the bag (closed surface), star-shaped around its centre -------------------------------------
const B={x:800,y:310};
const bagR=(th,w,ph)=>130+w*(12+22*Math.sin(3*th+ph)+13*Math.sin(5*th-1.3*ph)+8*Math.cos(2*th+.7*ph));
const bagPts=(w,ph,n=180,cx=B.x,cy=B.y)=>Array.from({length:n},(_,i)=>{const th=2*Math.PI*i/n,R=bagR(th,w,ph);return [cx+R*Math.cos(th),cy+R*Math.sin(th)];});
function bagSvg(w,ph,{g=1,glow=0,cx=B.x,cy=B.y,stroke=GH}={}){return fade(g,`<path d="${pathOf(bagPts(w,ph,180,cx,cy))}" fill="#9fb3d6" fill-opacity="${.10+.08*glow}" stroke="${stroke}" stroke-width="${3+2*glow}"/>`);}
const starPt=(cx,cy,w,ph,th)=>{const R=bagR(th,w,ph);return [cx+R*Math.cos(th),cy+R*Math.sin(th)];};
const starArc=(cx,cy,w,ph,a0,a1,n=16)=>Array.from({length:n+1},(_,i)=>starPt(cx,cy,w,ph,mix(a0,a1,i/n)));
// Crossings of a straight ray from (ox,oy) with the bag outline centred at (cx,cy): [{x,y,out}]
function crossings(ox,oy,a,w,ph,cx=B.x,cy=B.y){const P=bagPts(w,ph,240,cx,cy),dx=Math.cos(a),dy=Math.sin(a),res=[];
 for(let i=0;i<P.length;i++){const [x1,y1]=P[i],[x2,y2]=P[(i+1)%P.length],ex=x2-x1,ey=y2-y1,den=dx*ey-dy*ex;if(Math.abs(den)<1e-9)continue;
  const t=((x1-ox)*ey-(y1-oy)*ex)/den,u=((x1-ox)*dy-(y1-oy)*dx)/den;if(t>0&&u>=0&&u<1){const X=ox+dx*t,Y=oy+dy*t;
   const nx=-(ey),ny=ex,cxm=(x1+x2)/2-cx,cym=(y1+y2)/2-cy,sgn=(nx*cxm+ny*cym)>0?1:-1;res.push({x:X,y:Y,t,out:(dx*nx+dy*ny)*sgn>0});}}
 return res.sort((p,q)=>p.t-q.t);}
const farT=(ox,oy,a)=>Math.min(...[(Math.cos(a)>0?(1195-ox)/Math.cos(a):(5-ox)/Math.cos(a)),(Math.sin(a)>0?(512-oy)/Math.sin(a):(88-oy)/Math.sin(a))].map(Math.abs));
// Outline split into N pieces: midpoint, outward normal, piece ends.
function pieces(w,ph,N=24,cx=B.x,cy=B.y){return Array.from({length:N},(_,k)=>{const a0=2*Math.PI*k/N,a1=2*Math.PI*(k+1)/N,am=(a0+a1)/2;
 const p=a=>{const R=bagR(a,w,ph);return [cx+R*Math.cos(a),cy+R*Math.sin(a)];},A=p(a0),Bq=p(a1),M=p(am);
 let tx_=Bq[0]-A[0],ty_=Bq[1]-A[1];const L=Math.hypot(tx_,ty_);tx_/=L;ty_/=L;let nx=ty_,ny=-tx_;if(nx*(M[0]-cx)+ny*(M[1]-cy)<0){nx=-nx;ny=-ny;}
 return {A,B:Bq,M,nx,ny,tx:tx_,ty:ty_,am,a0,a1};});}
// Field of point charges at (x,y), scaled so a lone Q at 140 px gives 40 px.
const KE=40*140*140;
function Efield(x,y,qs){let ex=0,ey=0;for(const c of qs){const dx=x-c.x,dy=y-c.y,r2=dx*dx+dy*dy,r=Math.sqrt(r2);ex+=KE*c.q*dx/(r2*r);ey+=KE*c.q*dy/(r2*r);}return [ex,ey];}
const QB=[{x:B.x,y:B.y,q:1}];
const bagQ=(g=1)=>charge(B.x,B.y,1,{r:24,g})+fade(g,label('Q',B.x+28,B.y-24,{size:28,color:MX.plus,weight:700}));
const ticks=(PC,g=1)=>fade(g,PC.map(q=>line(q.A[0]-q.nx*9,q.A[1]-q.ny*9,q.A[0]+q.nx*9,q.A[1]+q.ny*9,{color:GH,w:3})).join(''));
const fieldOnPieces=(PC,qs,{op=1,color=MX.E,k=1}={})=>fade(op,PC.map(q=>{const [ex,ey]=Efield(q.M[0],q.M[1],qs),m=Math.hypot(ex,ey)*k;return carrow(q.M[0]+ex/Math.hypot(ex,ey)*m/2,q.M[1]+ey/Math.hypot(ex,ey)*m/2,Math.atan2(ey,ex),m,{color,w:3});}).join(''));

// ---- Gauss formula built from pieces (so each part can be lit on its own) --------------------------
const GS=60,GX0=300,GY0=300;
const GP=[['\\oint',MX.ink],[`{\\color{${MX.E}}\\vec E}`,MX.E],['\\cdot',MX.ink],['d\\vec A',MX.ink],[`=\\dfrac{{\\color{${MX.plus}}Q}}{\\varepsilon_0}`,MX.ink]];
const GW=GP.map(([s])=>texWidth(s,GS,false)),GAP=10,GTOT=GW.reduce((a,b)=>a+b,0)+GAP*(GP.length-1);
const GXS=GW.map((w,i)=>GX0-GTOT/2+GW.slice(0,i).reduce((a,b)=>a+b,0)+GAP*i+w/2);
function gauss(ops){return GP.map(([s,c],i)=>fade(ops[i],tx(s,GXS[i],GY0,GS,c))).join('');}
const gbox=(i,j,g,lab)=>{const x0=GXS[i]-GW[i]/2-10,x1=GXS[j]+GW[j]/2+10;return fade(g,rect(x0,GY0-62,x1-x0,96,{fill:MX.hi,fo:.1,stroke:MX.hi,sw:3,rx:10})+label(lab,(x0+x1)/2,GY0+90,{size:26,color:MX.hi,anchor:'middle',weight:700}));};

// ---- cones (general closed surfaces) ---------------------------------------------------------------
const PHI=.11,QF={x:150,y:300},R1=230,R2=460;
// the far window tilted by alpha (from perpendicular): its two ends on the cone edges
function tiltedEnds(alpha){const C=[QF.x+R2,QF.y],t=[Math.sin(alpha),Math.cos(alpha)],tp_=Math.tan(PHI);
 return [1,-1].map(sg=>{const s=sg*R2*tp_/(Math.cos(alpha)-sg*Math.sin(alpha)*tp_);return [C[0]+s*t[0],C[1]+s*t[1]];});}
function coneFar({g2=1,gE=1,gw1=1,op2=1}={}){let s=wedge(QF,0,PHI,600,{fo:.10});
 s+=charge(QF.x,QF.y,1,{r:22})+label('Q',QF.x-8,QF.y-34,{size:26,color:MX.plus,weight:700,anchor:'end'});
 const h1=R1*Math.tan(PHI),h2=R2*Math.tan(PHI),x1=QF.x+R1,x2=QF.x+R2;
 s+=fade(gw1,line(x1,QF.y-h1,x1,QF.y+h1,{color:MX.hi,w:8})+arrow(x1+6,QF.y,x1+86,QF.y,{color:MX.E,w:5,head:14})+plate('E',x1+46,QF.y-60,26,MX.E));
 s+=fade(g2*op2,line(x2,QF.y-h2,x2,QF.y+h2,{color:MX.hi,w:8}))+fade(g2,arrow(x2+6,QF.y,x2+26,QF.y,{color:MX.E,w:5,head:10}));
 s+=fade(gE*g2,plate('E/4',x2+60,QF.y-84,26,MX.E));
 // distance ruler
 s+=line(QF.x,410,x1,410,{color:W,w:2})+line(QF.x,402,QF.x,418,{color:W,w:2})+line(x1,402,x1,418,{color:W,w:2})+tx('r',(QF.x+x1)/2,440,28,W);
 s+=fade(g2,line(QF.x,470,x2,470,{color:W,w:2})+line(x2,462,x2,478,{color:W,w:2})+line(QF.x,462,QF.x,478,{color:W,w:2})+tx('2r',(QF.x+x2)/2,500,28,W));
 return s;}

// ---- a folded (concave) closed surface around QD: a cone along angle 0 crosses it three times ----------
const QD={x:320,y:300},DR=[90,150,210];
const DENT=(()=>{const P=[];const arc=(r,a0,a1,n)=>{for(let i=0;i<=n;i++){const a=mix(a0,a1,i/n);P.push([QD.x+r*Math.cos(a),QD.y+r*Math.sin(a)]);}};
 arc(90,-.75,.45,24);arc(150,.45,-.45,18);arc(210,-.45,.75,24);
 const a0=.75,a1=2*Math.PI-.75;for(let i=1;i<90;i++){const u=i/90,a=mix(a0,a1,u),r=mix(210,90,smooth(u));P.push([QD.x+r*Math.cos(a),QD.y+r*Math.sin(a)]);}
 return P;})();

// ---- outside charge and its cone through the bag ------------------------------------------------------
const OC={x:300,y:230},AO=Math.atan2(B.y-OC.y,B.x-OC.x),PHO=.06,WB=1,PB=2.4;
const angB=(x,y)=>Math.atan2(y-B.y,x-B.x);
const near=(a0,a1)=>{let d=a1-a0;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;return a0+d;};
function coneWindows(a,phi){const c1=crossings(OC.x,OC.y,a-phi,WB,PB),c2=crossings(OC.x,OC.y,a+phi,WB,PB);if(c1.length<2||c2.length<2)return null;
 const i0=angB(c1[0].x,c1[0].y),o0=angB(c1.at(-1).x,c1.at(-1).y),inn=starArc(B.x,B.y,WB,PB,i0,near(i0,angB(c2[0].x,c2[0].y)),8),out=starArc(B.x,B.y,WB,PB,o0,near(o0,angB(c2.at(-1).x,c2.at(-1).y)),8);
 return {inn,out,tin:c1[0].t,tout:c1.at(-1).t};}
function outsideCone(a,phi,{g=1,op=1,labels=0,wEdge=2}={}){const cw=coneWindows(a,phi);if(!cw)return '';
 let s=wedge(OC,a,phi,Math.min(900,farT(OC.x,OC.y,a)),{fo:.09*op,eo:.7*op,w:wEdge});
 s+=draw(cw.inn,1,{color:MX.minus,w:8})+draw(cw.out,1,{color:MX.hi,w:8});
 if(labels>0){const pi=cw.inn[4],po=cw.out[4];
  s+=fade(labels,plate('-',pi[0]-40,pi[1]-40,30,MX.minus)+plate('+',po[0]+40,po[1]-40,30,MX.hi));}
 return fade(g,s);}

export const mx2p2Diagrams={
 // ============ 調べる：試験電荷 ============
 'mx2-n-ask':(p,ctx)=>stage(ctx,p,(()=>{
  const gv=G(ctx,'見えないもの'),gp=G(ctx,'小さなプラス'),t=ctx.t;
  let s=charge(QA.x,QA.y,1,{r:28});
  // chapter-1 question: the second charge is pushed, with nothing in between
  s+=fade(1-gv,charge(800,QA.y,1,{r:28})+arrow(832,QA.y,900,QA.y,{color:F,w:6,head:16})+arrow(376,QA.y,308,QA.y,{color:F,w:6,head:16})
   +`<rect x="470" y="206" width="264" height="140" rx="14" fill="none" stroke="${MX.dim}" stroke-width="3" stroke-dasharray="10 8"/>`
   +label('？',602,300+6*Math.sin(t*4),{size:76,color:MX.hi,anchor:'middle',weight:700}));
  s+=word('どうやって押す？',600,470,{size:32,color:MX.hi,anchor:'middle',g:smooth(t/.4)*(1-gv)});
  s+=fade(gp,`<circle cx="${P1.x}" cy="${P1.y}" r="${26+5*Math.sin(t*5)}" fill="none" stroke="${MX.hi}" stroke-width="3"/>`)+probe(P1.x,P1.y,gp);
  s+=word('小さなプラスの電荷で 調べる',600,470,{size:30,color:MX.ink,anchor:'middle',g:gp});
  return s;})()),

 'mx2-n-probe':(p,ctx)=>stage(ctx,p,(()=>{
  const gT=G(ctx,'試験電荷'),g1=G(ctx,'右へ'),g2=G(ctx,'左に置く'),g2a=G(ctx,'左へ'),g3=G(ctx,'遠くでは'),g3a=G(ctx,'弱く');
  let s=charge(QA.x,QA.y,1,{r:28});
  const old=.4;
  s+=fade(1-(1-old)*g2,probe(P1.x,P1.y)+forceAt(P1,g1));
  s+=fade(g2*(1-(1-old)*g3),probe(P2.x,P2.y)+forceAt(P2,g2a));
  s+=fade(g3,probe(P3.x,P3.y)+forceAt(P3,g3a));
  s+=fade(gT*(1-g2),`<circle cx="${P1.x}" cy="${P1.y}" r="24" fill="none" stroke="${MX.hi}" stroke-width="3"/>`+dash(P1.x+22,P1.y-18,820,188,1,MX.hi));
  s+=word('試験電荷',900,176,{size:32,color:MX.hi,anchor:'middle',g:gT});
  s+=fade(g1,label('右へ',P1.x+60,P1.y+52,{size:26,color:F,anchor:'middle',weight:700}));
  s+=fade(g2a,label('左へ',P2.x-50,P2.y+52,{size:26,color:F,anchor:'middle',weight:700}));
  s+=fade(g3a,label('弱い',P3.x+70,P3.y+8,{size:26,color:F,weight:700}));
  s+=word('押される力（緑）',600,482,{size:26,color:F,anchor:'middle',g:g1});
  return s;})()),

 // why the test charge is small: a big one pushes the source charge away and changes what we wanted to measure
 'mx2-n-small':(p,ctx)=>stage(ctx,p,(()=>{
  const gs=G(ctx,'試験電荷を小さく'),gm=G(ctx,'動かさない'),gb=G(ctx,'大きな電荷'),gc=G(ctx,'配置が変わって');
  const mv=smooth((ctx.t-T(ctx,'大きな電荷')-.2)/1.6);
  let s=callout(40,96,540,404,'')+callout(620,96,540,404,'',gb);
  const L={x:170,y:290},Pr={x:430,y:290};
  s+=label('小さな試験電荷',310,146,{size:28,color:MX.ink,anchor:'middle',weight:700});
  s+=charge(L.x,L.y,1,{r:28})+label('元の電荷',L.x,L.y+66,{size:24,color:MX.dim,anchor:'middle'});
  s+=probe(Pr.x,Pr.y,gs,10)+arrow(Pr.x+14,Pr.y,Pr.x+84,Pr.y,{color:F,w:5,head:14,g:gs});
  s+=fade(gm,arrow(L.x-32,L.y,L.x-50,L.y,{color:F,w:4,head:10})+label('押し返しは ごくわずか',310,410,{size:24,color:MX.ink,anchor:'middle'})+label('元の配置は ほぼそのまま',310,458,{size:26,color:MX.good,anchor:'middle',weight:700}));
  const R0={x:800,y:290},Rx=R0.x-70*mv,Pb={x:1020,y:290};
  s+=fade(gb,label('大きな電荷',890,146,{size:28,color:MX.ink,anchor:'middle',weight:700})
   +(mv>0?ring(R0.x,R0.y,28,{color:MX.dim,w:2,dash:'6 6'}):'')+charge(Rx,R0.y,1,{r:28})+charge(Pb.x,Pb.y,1,{r:40})
   +arrow(Pb.x+44,Pb.y,Pb.x+120,Pb.y,{color:F,w:6,head:16})+arrow(Rx-32,R0.y,Rx-92,R0.y,{color:F,w:6,head:16})
   +label('元の電荷',Rx,R0.y+66,{size:24,color:MX.dim,anchor:'middle'}));
  s+=fade(gc,label('強く押し返され、動いてしまう',890,410,{size:24,color:MX.ink,anchor:'middle'})+label('元の配置が 変わる',890,458,{size:26,color:MX.plus,anchor:'middle',weight:700}));
  return s;})()),

 'mx2-n-unit':(p,ctx)=>stage(ctx,p,(()=>{
  const gc=G(ctx,'クーロン'),t0=T(ctx,'場所ごとの力'),rv=Math.max(0,(ctx.t-t0+.2)*420),gq=G(ctx,'場所ごとの力'),ge=G(ctx,'一クーロンあたり'),gE=G(ctx,'電場です');
  const fo=clamp(1-rv/400);
  let s=map({reveal:rv,dim:mix(.6,1,gE),col:gE});
  s+=fade(.4*fo,probe(P1.x,P1.y)+forceAt(P1)+probe(P2.x,P2.y)+forceAt(P2))+fade(fo,probe(P3.x,P3.y)+forceAt(P3));
  s+=charge(QA.x,QA.y,1,{r:28});
  s+=callout(770,96,400,404,'',gc);
  s+=fade(gc,word('クーロン（C）',970,150,{size:30,color:MX.ink,anchor:'middle'})+label('電荷の量の単位',970,200,{size:24,color:MX.dim,anchor:'middle'}));
  s+=fade(gq,probe(840,280)+tx('q',840,330,34,MX.plus)+arrow(858,280,990,280,{color:F,w:6,head:16})+tx('F',924,258,34,F));
  s+=fade(ge,tx(`{\\color{${MX.E}}E}=\\dfrac{F}{q}`,970,405,48,MX.ink)+label('1 C あたりの力',970,478,{size:24,color:MX.E,anchor:'middle'}));
  s+=word('場所ごとの力の地図',QA.x,482,{size:28,color:F,anchor:'middle',g:gq*(1-gE)})+word('電場',QA.x-150,482,{size:32,color:MX.E,anchor:'middle',g:gE});
  return s;})()),

 // 1 C あたり: 2 C に 6 N → 1 C あたり 3 N (a conversion by division, not placing 1 C)
 'mx2-n-per':(p,ctx)=>stage(ctx,p,(()=>{
  const g1=G(ctx,'2 C の電荷'),g2=G(ctx,'6 N の力'),g3=G(ctx,'1 C あたり',{d:.8}),g4=G(ctx,'6 割る 2');
  let s=map({dim:.3,hl:P1})+charge(QA.x,QA.y,1,{r:28});
  s+=`<circle cx="${P1.x}" cy="${P1.y}" r="40" fill="none" stroke="${MX.hi}" stroke-width="3"/>`+dash(P1.x+40,P1.y,770,300,1,MX.hi);
  s+=callout(770,96,400,404,'');
  s+=label('数を簡単にした例',970,138,{size:24,color:MX.dim,anchor:'middle'});
  s+=fade(g1*(1-g3),charge(840,215,1,{r:26})+tx('2\\,\\mathrm{C}',840,275,30,MX.plus));
  s+=arrow(870,215,1082,215,{color:F,w:7,head:18,g:g2*(1-g3)})+fade(g2*(1-g3),tx('6\\,\\mathrm{N}',975,190,30,F));
  const one=y=>charge(860,y,1,{r:18})+tx('1\\,\\mathrm{C}',805,y+10,26,MX.plus)+arrow(882,y,988,y,{color:F,w:6,head:16})+tx('3\\,\\mathrm{N}',1040,y+10,28,F);
  s+=fade(g3,one(220)+one(300)+label('1 C ずつに分けて見る',970,360,{size:22,color:MX.dim,anchor:'middle'}));
  s+=fade(g4,tx('\\dfrac{6\\,\\mathrm{N}}{2\\,\\mathrm{C}}=3\\,\\mathrm{N/C}',970,438,36,MX.hi));
  s+=word('1 C を置くのではなく、割り算で直す',QA.x,482,{size:24,color:MX.ink,anchor:'middle',g:g3});
  return s;})()),

 'mx2-n-per:sign':(p,ctx)=>stage(ctx,p,(()=>{
  const g0=G(ctx,'式で書くと'),gm=G(ctx,'マイナスの電荷'),gr=G(ctx,'逆向き');
  let s=map({dim:.3,skip:P1})+charge(QA.x,QA.y,1,{r:28});
  s+=fade(gm,charge(P1.x,P1.y,-1,{r:14})+arrow(P1.x+18,P1.y-24,P1.x+118,P1.y-24,{color:MX.E,w:6,head:16})+arrow(P1.x-18,P1.y+24,P1.x-98,P1.y+24,{color:F,w:6,head:16,g:gr}));
  s+=fade(gm,label('電場',P1.x+68,P1.y-44,{size:24,color:MX.E,anchor:'middle',weight:700}))+fade(gr,label('力',P1.x-58,P1.y+62,{size:24,color:F,anchor:'middle',weight:700}));
  s+=callout(770,96,400,404,'');
  s+=fade(g0,tx(`${cE('E')}=\\dfrac{F}{q}`,970,190,50,MX.ink));
  const row=(y,sg,lab,col)=>charge(815,y,sg,{r:15})+arrow(845,y-14,945,y-14,{color:MX.E,w:5,head:13})+(sg>0?arrow(845,y+14,945,y+14,{color:F,w:5,head:13}):arrow(945,y+14,845,y+14,{color:F,w:5,head:13}))+label(lab,1060,y+9,{size:24,color:col,anchor:'middle',weight:700});
  s+=fade(g0,row(310,1,'同じ向き',MX.ink))+fade(gm,row(410,-1,'逆向き',MX.plus));
  s+=fade(g0,label('青：電場　緑：力',970,478,{size:22,color:MX.dim,anchor:'middle'}));
  return s;})()),

 'mx2-n-double':(p,ctx)=>stage(ctx,p,(()=>{
  const g2=G(ctx,'二倍にすると'),gF=G(ctx,'力も二倍'),gs=G(ctx,'つまり電場');
  let s=map({dim:.3,hl:P1})+charge(QA.x,QA.y,1,{r:28});
  s+=`<circle cx="${P1.x}" cy="${P1.y}" r="40" fill="none" stroke="${MX.hi}" stroke-width="3"/>`+dash(P1.x+40,P1.y,770,300,1,MX.hi);
  s+=callout(770,96,400,404,'');
  s+=label('同じ場所で',970,138,{size:24,color:MX.dim,anchor:'middle'});
  s+=probe(830,190)+tx('q',830,238,30,MX.plus)+arrow(848,190,918,190,{color:F,w:6,head:16})+tx('F',945,200,32,F);
  s+=fade(g2,probe(830,300,1,17)+tx('2q',830,352,30,MX.plus))+arrow(853,300,993,300,{color:F,w:6,head:16,g:gF})+fade(gF,tx('2F',1030,310,32,F));
  s+=fade(gs,tx(`\\dfrac{F}{q}=\\dfrac{2F}{2q}`,970,420,40,MX.ink)+label('＝ 電場は同じ',970,482,{size:26,color:MX.E,anchor:'middle',weight:700}));
  return s;})()),

 // the field belongs to the place, given the source arrangement; move the source and the field there changes
 'mx2-n-place':(p,ctx)=>stage(ctx,p,(()=>{
  const go=smooth(1-ctx.t/.5),gt=G(ctx,'試験電荷によらず'),gc=G(ctx,'元の電荷の配置'),gP=G(ctx,'場所の性質'),gm=G(ctx,'元の電荷が動けば',{d:1.2});
  const src={x:QA.x-100*gm,y:QA.y+60*gm};
  let s=callout(770,96,400,404,'',go)+map({dim:mix(.3,.9,1-go),src,hl:gP>.5?P1:null});
  s+=fade(.8*(1-gt),probe(P1.x,P1.y+40));
  s+=fade(gP,ring(P1.x,P1.y,40,{color:MX.hi,w:3})+word('この場所の電場',P1.x+150,P1.y-62,{size:24,color:MX.hi,anchor:'middle'}));
  s+=fade(gm,ring(QA.x,QA.y,28,{color:MX.dim,w:2,dash:'6 6'}));
  s+=fade(gc*(1-gm),ring(src.x,src.y,44,{color:MX.hi,w:3}));
  s+=charge(src.x,src.y,1,{r:28});
  s+=word('電場は 元の電荷の配置で決まる',600,482,{size:26,color:MX.ink,anchor:'middle',g:gc*(1-gm)});
  s+=word('元の電荷が動く → この場所の電場も変わる',600,482,{size:26,color:MX.hi,anchor:'middle',g:gm});
  return s;})()),

 // answer to chapter 1: charge → field → force on a charge that comes there
 'mx2-n-push':(p,ctx)=>stage(ctx,p,(()=>{
  const gr=G(ctx,'電場を作り'),gn=G(ctx,'そこに来た'),gp=G(ctx,'押す。'),gm=G(ctx,'間に何もない');
  const N={x:600,y:412};
  let s=map({dim:.85,skip:N});
  const rr=(ctx.t-T(ctx,'電場を作り'))*420;
  if(rr>0&&rr<760)s+=`<circle cx="${QA.x}" cy="${QA.y}" r="${rr}" fill="none" stroke="${MX.E}" stroke-width="4" stroke-opacity="${(.7*(1-rr/760)).toFixed(2)}"/>`;
  s+=charge(QA.x,QA.y,1,{r:28});
  s+=probe(N.x,N.y,gn,16)+(gn>0?forceAt(N,gp,{k:1.8}):'');
  s+=fade(gr,label('電荷',760,492,{size:30,color:MX.plus,weight:700})+label('→',840,492,{size:30,color:MX.dim})+label('電場',880,492,{size:30,color:MX.E,weight:700}))
   +fade(gp,label('→',960,492,{size:30,color:MX.dim})+label('力',1000,492,{size:30,color:F,weight:700}));
  s+=word('間にあるのは 電場',850,120,{size:28,color:MX.E,anchor:'middle',g:gm});
  return s;})()),

 'mx2-n-arrow':(p,ctx)=>stage(ctx,p,(()=>{
  const H={x:600,y:208},a=Math.atan2(H.y-QA.y,H.x-QA.x),gd=G(ctx,'向きは'),gl=G(ctx,'長さは'),gw=G(ctx,'電荷が進む道');
  let s=map({dim:.28,hl:H})+charge(QA.x,QA.y,1,{r:28});
  s+=`<circle cx="${H.x}" cy="${H.y}" r="42" fill="none" stroke="${MX.hi}" stroke-width="3"/>`+dash(H.x+42,H.y-8,770,160,1,MX.hi);
  s+=callout(770,96,400,390,'');
  const cx=950,cy=175,L=150;
  s+=probe(cx-Math.cos(a)*L/2-18,cy-Math.sin(a)*L/2+2)+carrow(cx,cy,a,L,{color:MX.hi,w:7});
  s+=fade(gd,label('向き：＋が押される向き',970,262,{size:26,color:MX.ink,anchor:'middle'}));
  s+=fade(gl,label('長さ：電場の強さ',970,310,{size:26,color:MX.ink,anchor:'middle'}));
  const path=Array.from({length:40},(_,i)=>[830+i*7.5,382+16*Math.sin(i*.35)]);
  s+=fade(gw,draw(path,1,{color:MX.dim,w:3,dash:'7 7'})+cross(970,382,20,1)+label('電荷の通り道 ではない',970,455,{size:26,color:MX.plus,anchor:'middle',weight:700}));
  return s;})()),

 // ============ 点電荷の電場：クーロンの法則 ÷ q ============
 'mx2-n-point':(p,ctx)=>stage(ctx,p,pointScene(ctx,{g1:G(ctx,'点電荷 Q'),gC:G(ctx,'クーロンの法則'),gd:G(ctx,'試験電荷 q で割り')})),
 'mx2-n-point:div':(p,ctx)=>stage(ctx,p,(()=>{
  const gc=G(ctx,'分子と分母'),gl=G(ctx,'だけが残り'),ge=G(ctx,'点電荷の電場'),go=G(ctx,'外向き');
  let s=fade(.3,pointLeft());
  s+=fade(go,Array.from({length:8},(_,k)=>{const a=2*Math.PI*k/8+Math.PI/8;return arrow(200+40*Math.cos(a),300+40*Math.sin(a),200+110*Math.cos(a),300+110*Math.sin(a),{color:MX.E,w:5,head:14});}).join('')+charge(200,300,1,{r:30})+word('Q が＋なら 外向き',200,470,{size:26,color:MX.E,anchor:'middle'}));
  s+=callout(470,100,700,400,'');
  const q0='\\dfrac{1}{q}\\times\\dfrac{k\\,q\\,'+cQ('Q')+'}{r^2}',q1='\\dfrac{1}{\\cancel{q}}\\times\\dfrac{k\\,\\cancel{q}\\,'+cQ('Q')+'}{r^2}';
  s+=tx(`${cE('E')}=`,560,200,42,MX.ink)+fade(1-gc,tx(q0,730,200,42))+fade(gc,tx(q1,730,200,42));
  s+=fade(gc,label('q は消える',1060,210,{size:24,color:MX.ink,anchor:'middle'}));
  s+=fade(gl,tx(`=\\dfrac{k\\,${cQ('Q')}}{${cH('r')}^2}`,660,318,42)+label('源の Q と 距離 r が残る',990,328,{size:24,color:MX.ink,anchor:'middle'}));
  s+=fade(ge,tx(`=\\dfrac{${cQ('Q')}}{4\\pi\\varepsilon_0 r^2}`,690,438,44,MX.hi)+label('点電荷の電場',990,448,{size:28,color:MX.hi,anchor:'middle',weight:700}));
  return s;})()),

 // ============ 重ね合わせの原理 ============
 'mx2-n-super':(p,ctx)=>stage(ctx,p,(()=>{
  const g1=G(ctx,'それぞれの電荷'),gh=G(ctx,'同じ地点で'),sl=smooth((ctx.t-T(ctx,'矢印として'))/1.1),g3=G(ctx,'足します'),gn=G(ctx,'重ね合わせの原理');
  let s=superPic({g1,slide:sl,gsum:g3,gh});
  s+=word('重ね合わせの原理：矢印として足す',600,470,{size:28,color:MX.hi,anchor:'middle',g:gn});
  return s;})()),
 'mx2-n-super:exp':(p,ctx)=>stage(ctx,p,(()=>{
  const gC=G(ctx,'クーロンの法則とは別'),gx=G(ctx,'実験で確かめ'),gd=G(ctx,'この後の電気力線',{d:.8});
  let s=dipGrid(.8*gd)+fade(1-.6*gd,superPic({gh:0}));
  const box=(x,col,t1,t2,g)=>fade(g,rect(x,360,440,120,{fill:col,fo:.08,stroke:col,sw:2,rx:12})+label(t1,x+220,402,{size:26,color:col,anchor:'middle',weight:700})+label(t2,x+220,448,{size:24,color:MX.ink,anchor:'middle'}));
  s+=fade(1-gd,box(120,MX.E,'クーロンの法則','2つの電荷の間の力',gC)+box(640,MX.plus,'重ね合わせの原理','別の原理：実験で確かめた',gx));
  s+=word('どの点の矢印も、この足し算で描いた',600,482,{size:26,color:MX.ink,anchor:'middle',g:gd});
  return s;})()),

 // ============ 電気力線 ============
 'mx2-n-trace':(p,ctx)=>stage(ctx,p,(()=>{
  const L=dipole(),tr=L[13],t0=T(ctx,'矢印の向きに'),t1=T(ctx,'これを繰り返して'),gl=G(ctx,'電気力線',{d:1.2});
  const u=clamp((ctx.t-t0)/Math.max(1,t1-t0+.6));
  let s=dipGrid(mix(.5,.25,gl))+fade(gl,L.map(l=>fline(l,gl,{opacity:.9})).join(''));
  // the tracer: small steps along the local arrow (a marker, not a particle)
  const q=along(tr,u),Ltot=q.L,step=42,n=Math.floor(u*Ltot/step);
  s+=draw(tr,u,{color:MX.hi,w:5});
  for(let i=1;i<=n;i++){const r=along(tr,i*step/Ltot);s+=dot(r.x,r.y,4.5,MX.hi);}
  if(u>0&&u<1)s+=carrow(q.x+Math.cos(q.a)*22,q.y+Math.sin(q.a)*22,q.a,44,{color:W,w:4})+ring(q.x,q.y,8,{color:W,w:3,fill:MX.bg});
  s+=charge(DP.x,DP.y,1,{r:28})+charge(DM.x,DM.y,-1,{r:28});
  s+=fade(smooth((ctx.t-t0)/.5)*(1-gl),rect(40,100,330,48,{fill:MX.bg,fo:.9,stroke:MX.faint,sw:2,rx:10})+ring(66,124,8,{color:W,w:3,fill:MX.bg})+label('向きをなぞる目印（粒ではない）',84,132,{size:22,color:MX.ink}));
  s+=word('少し進む → 矢印に合わせる → 繰り返す',600,482,{size:26,color:MX.ink,anchor:'middle',g:smooth((ctx.t-t0)/.5)*(1-G(ctx,'電気力線',{d:.3}))});
  s+=word('電気力線',600,482,{size:32,color:MX.E,anchor:'middle',g:G(ctx,'電気力線',{d:.3,off:.1})});
  return s;})()),

 'mx2-n-density':(p,ctx)=>stage(ctx,p,(()=>{
  const g1=G(ctx,'線一本が表す量'),gs=G(ctx,'密に描く'),gn=G(ctx,'線が力を');
  let s=dipole().map(l=>fline(l,1)).join('')+charge(DP.x,DP.y,1,{r:28})+charge(DM.x,DM.y,-1,{r:28});
  const lens=(x,y,g,col)=>fade(g,`<circle cx="${x}" cy="${y}" r="42" fill="${col}" fill-opacity=".10" stroke="${col}" stroke-width="4"/>`);
  s+=lens(480,300,gs,MX.hi)+lens(150,300,gs,MX.dim);
  s+=fade(gs,label("強い → 密",480,236,{size:26,color:MX.hi,anchor:'middle',weight:700})+label('弱い → まばら',150,236,{size:26,color:MX.ink,anchor:'middle',weight:700}));
  s+=word('約束：線 1本 ＝ 決まった量',600,130,{size:28,color:MX.ink,anchor:'middle',g:g1*(1-gs)});
  s+=word('約束：強い所ほど 線を密に描く',600,130,{size:28,color:MX.hi,anchor:'middle',g:gs});
  s+=word('線は 強さの目印（力を生むものではない）',600,482,{size:26,color:MX.ink,anchor:'middle',g:gn});
  return s;})()),

 // ============ 逆二乗を球の面で理解する ============
 'mx2-n-sphere':(p,ctx)=>stage(ctx,p,(()=>{
  const tr=T(ctx,'前後にも'),u=smooth((ctx.t-tr+.2)/1.6),beta=.9*u,alpha=.3*u,gS=G(ctx,'球の面全体');
  const {back,front}=rays3(beta,alpha,{g3:u,dots:gS});
  let s=back+sphereShell(SC.x,SC.y,110,alpha,{g:gS})+charge(SC.x,SC.y,1,{r:22})+front;
  s+=callout(700,110,460,170,tx('F\\propto\\dfrac{1}{r^2}',860,215,46,MX.ink)+label('前の章：',1000,180,{size:24,color:MX.dim})+label('実験で',1000,218,{size:24,color:MX.dim})+label('分かった関係',1000,252,{size:24,color:MX.dim}),smooth(ctx.t/.4));
  s+=word('紙の上だけ？',930,370,{size:28,color:MX.ink,anchor:'middle',g:smooth((ctx.t-.3)/.4)*(1-u)});
  s+=word('前後にも 広がる',930,370,{size:28,color:MX.E,anchor:'middle',g:u*(1-gS)});
  s+=word('球の面全体を つき抜ける',930,370,{size:28,color:MX.hi,anchor:'middle',g:gS});
  s+=fade(gS,label('混み具合は、空間の面を通る本数で数える',930,440,{size:22,color:MX.ink,anchor:'middle'})+label('（紙の上の線の間隔は、断面を見ているだけ）',930,478,{size:22,color:MX.dim,anchor:'middle'}));
  return s;})()),

 'mx2-n-two':(p,ctx)=>stage(ctx,p,(()=>{
  const S1={x:210,y:300,R:70},S2={x:540,y:300,R:140},g0=G(ctx,'図形の公式'),g2=G(ctx,'二倍なら'),ga=G(ctx,'面積は四倍'),gw=G(ctx,'同じ広さの窓'),gc=G(ctx,'四分の一'),ge=G(ctx,'電場も');
  const R2=mix(S1.R,S2.R,g2);
  let s=frontSphere(S1.x,S1.y,S1.R)+charge(S1.x,S1.y,1,{r:14})+fade(1,line(S1.x,S1.y,S1.x-S1.R,S1.y,{color:W,w:3})+plate("r",S1.x-S1.R/2,S1.y+40,26,W));
  s+=fade(g2,frontSphere(S2.x,S2.y,R2)+charge(S2.x,S2.y,1,{r:14})+line(S2.x,S2.y,S2.x-R2,S2.y,{color:W,w:3})+plate('2r',S2.x-R2/2,S2.y+30,26,W));
  s+=fade(smooth(ctx.t/.4),label('球の面積',40,142,{size:24,color:MX.dim})+tx('4\\pi r^2',190,134,34,MX.hi));
  s+=fade(g0,rect(40,478-30,470,44,{fill:MX.bg,fo:.9,stroke:MX.faint,sw:2,rx:10})+label('補足',56,478,{size:22,color:MX.hi,weight:700})+label('4πr² は図形の公式として使う',112,478,{size:22,color:MX.ink}));
  s+=word('面積 ×4',S2.x+80,482,{size:28,color:MX.hi,anchor:'start',g:ga});
  const n1=inWin(S1.x,S1.y,S1.R),n2=inWin(S2.x,S2.y,S2.R);
  const win=(S)=>rect(S.x+WO-WS/2,S.y-WO-WS/2,WS,WS,{fill:MX.hi,fo:.15,stroke:MX.hi,sw:3,rx:2});
  s+=fade(gw,win(S1)+win(S2));
  const inset=(ix,S,pts,lab)=>{const k=150/WS,x0=ix,y0=130;let t=rect(x0,y0,150,150,{fill:'#0d1526',fo:1,stroke:MX.hi,sw:3,rx:6});
   for(const q of pts)t+=dot(x0+(q.x-(S.x+WO-WS/2))*k,y0+(q.y-(S.y-WO-WS/2))*k,11,MX.E);
   return t+label(lab,x0+75,y0+190,{size:24,color:MX.dim,anchor:'middle'})+fade(gc,label(`${pts.length}本`,x0+75,y0+245,{size:36,color:MX.E,anchor:'middle',weight:700}));};
  s+=fade(gw,inset(780,S1,n1,'半径 r')+inset(990,S2,n2,'半径 2r')+dash(S1.x+WO+WS/2,S1.y-WO-WS/2,780,130,1,MX.hi)+dash(S2.x+WO+WS/2,S2.y-WO-WS/2,990,130,1,MX.hi));
  s+=word('電場も ¼',990,482,{size:28,color:MX.E,anchor:'middle',g:ge});
  return s;})()),

 'mx2-n-two:law':(p,ctx)=>stage(ctx,p,(()=>{
  const S1={x:210,y:300,R:70},S2={x:540,y:300,R:140},ge=G(ctx,'実験で'),gu=G(ctx,'線が球の面');
  let s=fade(.3,frontSphere(S1.x,S1.y,S1.R)+frontSphere(S2.x,S2.y,S2.R)+charge(S1.x,S1.y,1,{r:14})+charge(S2.x,S2.y,1,{r:14}));
  s+=callout(250,110,700,380,'');
  s+=tx('F\\propto\\dfrac{1}{r^2}',600,215,56,MX.ink);
  s+=fade(ge,rect(300,280,270,120,{fill:MX.plus,fo:.08,stroke:MX.plus,sw:2,rx:12})+label('法則の出発点',435,322,{size:24,color:MX.dim,anchor:'middle'})+label('実験',435,370,{size:34,color:MX.plus,anchor:'middle',weight:700}));
  s+=fade(gu,rect(630,280,270,120,{fill:MX.E,fo:.08,stroke:MX.E,sw:2,rx:12})+label('理解のしかた',765,322,{size:24,color:MX.dim,anchor:'middle'})+label('線の広がり',765,370,{size:34,color:MX.E,anchor:'middle',weight:700}));
  s+=fade(gu,label('図は証明ではなく、実験結果の見え方',600,448,{size:24,color:MX.ink,anchor:'middle'}));
  return s;})()),

 // ============ 電気束 ============
 'mx2-n-window':(p,ctx)=>stage(ctx,p,(()=>{
  const gw=G(ctx,'平らな窓'),gu=G(ctx,'そろった電場');
  const {svg,n}=windowScene(0,{count:gw});
  let s=fade(gw,svg);
  if(gw<1)s+=fade((1-gw)*mix(.4,1,gu),LY.flatMap(y=>LZ.map(z=>{const A=pj(-430,y,z),Bp=pj(430,y,z);return arrow(A[0],A[1],Bp[0],Bp[1],{color:MX.E,w:3,head:12,opacity:.8});})).join(''));
  s+=plate('\\vec E',140,170,34,MX.E);
  s+=fade(gw,label('面積 A',WC.x+10,WC.y-150,{size:26,color:MX.hi,anchor:'middle',weight:700})+label(`つき抜ける線 ${n}本`,1000,150,{size:26,color:MX.hi,anchor:'middle',weight:700}));
  s+=word('向きも強さも そろった電場',600,482,{size:26,color:MX.ink,anchor:'middle',g:gu*(1-gw)});
  s+=word('電場と 垂直な窓',600,482,{size:26,color:MX.hi,anchor:'middle',g:gw});
  return s;})()),

 'mx2-n-window:two':(p,ctx)=>stage(ctx,p,(()=>{
  const g2=G(ctx,'二枚並べれば'),gE=G(ctx,'電場を二倍'),gf=G(ctx,'電場の強さ×面積');
  let s=windowPanels({g2,gE});
  s+=word('つき抜ける量 ＝ 電場の強さ × 面積',600,462,{size:30,color:MX.hi,anchor:'middle',g:gf});
  return s;})()),

 'mx2-n-window:def':(p,ctx)=>stage(ctx,p,(()=>{
  const gn=G(ctx,'電気束と呼び'),gs=G(ctx,'電場そのもの'),gf=G(ctx,'何かが流れ出る');
  let s=windowPanels({op:.25});
  s+=callout(180,130,840,370,'');
  s+=fade(gn,tx('\\Phi_E',300,205,54,MX.E)+label('電気束',360,220,{size:36,color:MX.E,weight:700})+label('＝ 電場の強さ × 面積',520,220,{size:30,color:MX.ink}));
  s+=fade(gn,label('（電場が面を垂直につき抜けるとき。線の本数に比例）',600,275,{size:22,color:MX.dim,anchor:'middle'}));
  s+=fade(gs,label('電場そのものではない',600,345,{size:28,color:MX.ink,anchor:'middle',weight:700})+label('選んだ面について 合計した量',600,392,{size:26,color:MX.hi,anchor:'middle',weight:700}));
  s+=fade(gf,label('何かが流れ出る量でもない',600,455,{size:26,color:MX.dim,anchor:'middle'}));
  return s;})()),

 'mx2-n-tilt':(p,ctx)=>stage(ctx,p,(()=>{
  const th=TH1*smooth((ctx.t-T(ctx,'傾けると')+.1)/1.4),gv=G(ctx,'電場の向きから見る'),gs=G(ctx,'窓が細く');
  const {svg,n}=windowScene(th);
  let s=tgrp(svg+plate('\\vec E',140,170,34,MX.E));
  s+=callout(860,100,310,400,'');
  s+=label(`つき抜ける線 ${n}本`,1015,145,{size:26,color:MX.hi,anchor:'middle',weight:700});
  const cs=Math.cos(th),cx=1015,cy=320,k=.8;
  let f=rect(cx-80,cy-80,160,160,{fill:'none',fo:0,stroke:MX.dim,sw:2,rx:2}).replace('/>',' stroke-dasharray="6 6"/>');
  f+=rect(cx-80*cs,cy-80,160*cs,160,{fill:MX.hi,fo:.15,stroke:MX.hi,sw:3,rx:2});
  for(const y of LY)for(const z of LZ)if(Math.abs(z)<=100*cs+1e-6)f+=dot(cx+z*k,cy-y*k,6,MX.E);
  s+=fade(gv,label('電場の向きから見た窓',cx,200,{size:22,color:MX.dim,anchor:'middle'})+f);
  s+=fade(gs,label('見かけの面積が小さい',cx,448,{size:24,color:MX.hi,anchor:'middle',weight:700})+label('→ 通る線が減る',cx,482,{size:22,color:MX.ink,anchor:'middle'}));
  return s;})()),

 'mx2-n-tilt:comp':(p,ctx)=>stage(ctx,p,(()=>{
  const th=TH1,gn=G(ctx,'面に垂直な成分'),gpar=G(ctx,'面に沿う成分'),gk=G(ctx,'効くのは');
  const {svg,n}=windowScene(th,{lineOp:1-.6*gn});
  // decomposition at the window centre (3D vectors projected)
  const sn=Math.sin(th),cs=Math.cos(th),K=300,pv=v=>[v[0]+.45*v[2],-v[1]-.3*v[2]];
  const nrm=[cs,0,-sn],Ep=[K*cs*cs,0,-K*cs*sn],Ea=[K-K*cs*cs,0,K*cs*sn];
  const [nx,ny]=pv(nrm.map(v=>v*170)),[px,py]=pv(Ep),[ax,ay]=pv(Ea),[ex,ey]=pv([K,0,0]);
  let g=svg+plate('\\vec E',140,170,34,MX.E);
  g+=fade(gn,line(WC.x,WC.y,WC.x+nx,WC.y+ny,{color:W,w:2,dash:'6 6'})+arrow(WC.x,WC.y,WC.x+ex,WC.y+ey,{color:MX.E,w:3,head:12,opacity:.5})+arrow(WC.x,WC.y,WC.x+px,WC.y+py,{color:MX.hi,w:7,head:18}));
  g+=fade(gpar,arrow(WC.x,WC.y,WC.x+ax,WC.y+ay,{color:MX.dim,w:5,head:14}));
  let s=tgrp(g);
  const lp=tp(WC.x+px,WC.y+py),la=tp(WC.x+ax,WC.y+ay);
  s+=fade(gn,word('垂直な成分',lp[0]+10,lp[1]-34,{size:24,color:MX.hi,anchor:'middle'}));
  s+=fade(gpar,word('面に沿う成分：すべるだけ',la[0],la[1]+44,{size:22,color:MX.ink,anchor:'middle'}));
  s+=callout(860,100,310,400,'');
  s+=label(`つき抜ける線 ${n}本`,1015,145,{size:26,color:MX.hi,anchor:'middle',weight:700});
  s+=fade(gk,label('効くのは',1015,250,{size:24,color:MX.dim,anchor:'middle'})+tx(`${cH('E_{\\perp}')}\\times A`,1015,320,46,MX.ink)+label('垂直な成分 × 面積',1015,390,{size:24,color:MX.hi,anchor:'middle',weight:700}));
  return s;})()),

 // side view: the normal component and the apparent area shrink by the same ratio (same angle θ)
 'mx2-n-tilt:same':(p,ctx)=>stage(ctx,p,(()=>{
  const g0=G(ctx,'間の角'),gc=G(ctx,'垂直な成分も'),ga=G(ctx,'見かけの面積も'),gs=G(ctx,'同じ割合'),gd=G(ctx,'どちらで数えても');
  const Cc={x:360,y:300},th=.873,cs=Math.cos(th),sn=Math.sin(th),h=130,n=[cs,-sn],tv=[sn,cs];
  const A1=[Cc.x-h*tv[0],Cc.y-h*tv[1]],A2=[Cc.x+h*tv[0],Cc.y+h*tv[1]];
  let s='';
  for(let y=130;y<=470;y+=34){const hit=y>=A1[1]&&y<=A2[1],xi=Cc.x+(y-Cc.y)/cs*sn;
   s+=arrow(40,y,640,y,{color:MX.E,w:2.5,head:10,opacity:hit?.75:.3});if(hit)s+=dot(xi,y,5,MX.hi);}
  s+=label('横から見た図',40,112,{size:22,color:MX.dim});
  s+=line(A1[0],A1[1],A2[0],A2[1],{color:MX.hi,w:8})+label('窓',A2[0]+14,A2[1]+26,{size:24,color:MX.hi,weight:700});
  s+=line(Cc.x,Cc.y,Cc.x+n[0]*175,Cc.y+n[1]*175,{color:W,w:2,dash:'6 6'})+word('面に垂直な向き',Cc.x+n[0]*175+10,Cc.y+n[1]*175-16,{size:22,color:MX.ink});
  s+=fade(g0,arcMark(Cc.x,Cc.y,58,-th,0,MX.hi,3)+tx('\\theta',Cc.x+84*Math.cos(-th/2),Cc.y+84*Math.sin(-th/2)+10,28,MX.hi));
  const L=180,Et=[Cc.x+L,Cc.y],Ep=[Cc.x+n[0]*L*cs,Cc.y+n[1]*L*cs];
  s+=fade(gc,arrow(Cc.x,Cc.y,Et[0],Et[1],{color:MX.E,w:6,head:16})+plate('E',Et[0]+24,Et[1]+34,26,MX.E)
   +line(Et[0],Et[1],Ep[0],Ep[1],{color:MX.dim,w:2,dash:'4 5'})+arrow(Cc.x,Cc.y,Ep[0],Ep[1],{color:MX.hi,w:7,head:16})
   +rightMark(Ep,[-n[0],-n[1]],[sn,cs],11)+plate('E_{\\perp}',Ep[0]+46,Ep[1]-8,26,MX.hi));
  s+=fade(ga,line(A1[0],A1[1],A1[0],A2[1],{color:MX.good,w:6})+line(A1[0],A2[1],A2[0],A2[1],{color:MX.dim,w:2,dash:'4 5'})
   +arcMark(A1[0],A1[1],40,Math.atan2(tv[1],tv[0]),Math.PI/2,MX.good,3)+tx('\\theta',A1[0]+30,A1[1]+62,24,MX.good)
   +word('見かけの幅',A1[0]-16,(A1[1]+A2[1])/2+8,{size:24,color:MX.good,anchor:'end'}));
  s+=callout(680,100,490,400,'');
  s+=label('同じ角 θ の直角三角形',925,150,{size:26,color:MX.ink,anchor:'middle',weight:700});
  s+=fade(gs,tx(`\\dfrac{${cH('E_{\\perp}')}}{${cE('E')}}=\\dfrac{{\\color{${MX.good}}A'}}{A}`,925,235,44,MX.ink)+label('どちらも「隣の辺 ÷ 斜辺」',925,305,{size:22,color:MX.dim,anchor:'middle'})+label('A′：見かけの面積',925,345,{size:24,color:MX.good,anchor:'middle',weight:700}));
  s+=fade(gd,tx(`${cH('E_{\\perp}')}\\times A=${cE('E')}\\times{\\color{${MX.good}}A'}`,925,420,40,MX.ink)+label('どちらで数えても同じ値',925,476,{size:24,color:MX.hi,anchor:'middle',weight:700}));
  return s;})()),

 // ============ 閉じた面：細かく分けて足す・符号の約束 ============
 'mx2-n-pieces':(p,ctx)=>stage(ctx,p,(()=>{
  const w=1,ph=2.4,gb=G(ctx,'閉じた面で'),gi=G(ctx,'想像上'),gq=G(ctx,'面全体の電気束'),gd=G(ctx,'曲がっていて'),gv=G(ctx,'場所ごとに違い');
  const PC=pieces(w,ph);
  let s='';
  for(let k=0;k<12;k++){const a=2*Math.PI*(k+.5)/12,far=farT(B.x,B.y,a);s+=fline([[B.x+22*Math.cos(a),B.y+22*Math.sin(a)],[B.x+far*Math.cos(a),B.y+far*Math.sin(a)]],1,{at:.8,opacity:.5*gi});}
  s+=bagSvg(w,ph,{g:gb,glow:gd})+bagQ();
  s+=fieldOnPieces(PC,QB,{op:gv});
  s+=callout(40,120,520,370,'',gb);
  s+=fade(gb,label('電荷を包む 閉じた面',300,172,{size:28,color:GH,anchor:'middle',weight:700}));
  s+=fade(gi,label('想像上の面：電場をさえぎらない',300,220,{size:24,color:MX.dim,anchor:'middle'}));
  s+=fade(gq,label('求めたい：面全体の電気束',300,285,{size:28,color:MX.hi,anchor:'middle',weight:700}));
  s+=fade(gd,label('面は曲がり、電場も場所ごとに違う',300,355,{size:24,color:MX.ink,anchor:'middle'}));
  s+=fade(gv,label('→ 電場 × 面積 を一度には使えない',300,415,{size:26,color:MX.plus,anchor:'middle',weight:700}));
  return s;})()),

 'mx2-n-pieces:small':(p,ctx)=>stage(ctx,p,(()=>{
  const w=1,ph=2.4,gc=G(ctx,'細かく分け'),gp=G(ctx,'ほぼ平ら'),ge=G(ctx,'電場もほぼ一定'),gu=G(ctx,'垂直な成分×面積');
  const PC=pieces(w,ph),K=12,pc=PC[K];
  let s=bagSvg(w,ph)+bagQ()+ticks(PC,gc)+fieldOnPieces(PC,QB,{op:.45});
  s+=fade(gp,line(pc.A[0],pc.A[1],pc.B[0],pc.B[1],{color:MX.hi,w:9})+dash(pc.M[0]-30,pc.M[1],560,300,1,MX.hi));
  s+=callout(40,120,520,370,'');
  s+=label('小さな一片を 拡大',300,165,{size:26,color:MX.dim,anchor:'middle'});
  // magnified piece: local frame (tangent → right, outward normal → up), ×5
  const loc=P=>{const dx=P[0]-pc.M[0],dy=P[1]-pc.M[1];return [300+5*(dx*pc.tx+dy*pc.ty),290-5*(dx*pc.nx+dy*pc.ny)];};
  const arcP=starArc(B.x,B.y,w,ph,pc.a0,pc.a1,20).map(loc);
  let z=draw(arcP,1,{color:MX.hi,w:6});
  for(const u of [.1,.5,.9]){const a=mix(pc.a0,pc.a1,u),P=starPt(B.x,B.y,w,ph,a),[ex,ey]=Efield(P[0],P[1],QB),L0=loc(P),et=ex*pc.tx+ey*pc.ty,en=ex*pc.nx+ey*pc.ny,k=1.9;
   z+=fade(ge,arrow(L0[0],L0[1],L0[0]+et*k,L0[1]-en*k,{color:MX.E,w:5,head:14}));}
  s+=fade(gp,z);
  s+=fade(gp,label('ほぼ平ら',160,345,{size:24,color:MX.hi,anchor:'middle',weight:700}))+fade(ge,label('電場もほぼ一定',420,345,{size:24,color:MX.E,anchor:'middle',weight:700}));
  s+=fade(gu,tx(`${cH('E_{\\perp}')}\\times\\Delta A`,300,410,40,MX.ink)+label('ΔA：一片の面積',300,468,{size:22,color:MX.dim,anchor:'middle'}));
  return s;})()),

 'mx2-n-pieces:sign':(p,ctx)=>stage(ctx,p,(()=>{
  const w=1,ph=2.4,PC=pieces(w,ph),g0=G(ctx,'外向きを正'),gs=G(ctx,'外へつき抜ける'),gi=G(ctx,'内へつき抜ける');
  let s=bagSvg(w,ph)+bagQ()+ticks(PC)+fieldOnPieces(PC,QB,{op:.35});
  s+=fade(g0,PC.map(q=>arrow(q.M[0],q.M[1],q.M[0]+q.nx*34,q.M[1]+q.ny*34,{color:W,w:3,head:10})).join(''));
  s+=callout(40,120,520,370,'');
  s+=label('符号の約束',300,170,{size:30,color:MX.hi,anchor:'middle',weight:700});
  s+=fade(g0,label('閉じた面：外向きを 正の向きとする',300,222,{size:24,color:MX.ink,anchor:'middle'}));
  const mini=(y,out,lab,col)=>line(120,y-34,120,y+34,{color:GH,w:6})+label('外',208,y-24,{size:22,color:MX.dim,anchor:'middle'})+line(120,y,200,y,{color:W,w:2,dash:'5 5'})
   +(out?arrow(126,y,212,y,{color:col,w:6,head:16}):arrow(212,y,126,y,{color:col,w:6,head:16}))+label(lab,240,y+9,{size:24,color:col,weight:700});
  s+=fade(gs,mini(310,1,'外へつき抜ける → ＋',MX.hi))+fade(gi,mini(410,0,'内へつき抜ける → −',MX.minus));
  return s;})()),

 'mx2-n-pieces:sum':(p,ctx)=>stage(ctx,p,(()=>{
  const w=1,ph=2.4,gA=G(ctx,'全部の一片'),gn=G(ctx,'近似に'),gf=G(ctx,'細かくするほど'),gi=G(ctx,'積分で');
  const tf=T(ctx,'細かくするほど'),lv=clamp((ctx.t-tf+.2)/2.4)*3,N=8*2**Math.floor(lv);
  const u=clamp((ctx.t-T(ctx,'全部の一片')+.2)/1.8);
  let s=bagSvg(w,ph,{stroke:MX.faint})+bagQ();
  const V=Array.from({length:N},(_,k)=>starPt(B.x,B.y,w,ph,2*Math.PI*k/N));
  for(let k=0;k<N;k++){const a=V[k],b=V[(k+1)%N],lit=k<u*N;s+=line(a[0],a[1],b[0],b[1],{color:lit?MX.hi:GH,w:lit?5:3});}
  s+=V.map(v=>dot(v[0],v[1],N>30?2.5:4,W)).join('');
  s+=callout(40,120,520,370,'');
  s+=label('全部の一片で足す',300,170,{size:28,color:MX.hi,anchor:'middle',weight:700});
  s+=fade(gA,tx(`\\sum ${cH('E_{\\perp}')}\\,\\Delta A`,300,240,42,MX.ink));
  s+=fade(gn,label(`近似：平らな一片 ${N}枚`,300,305,{size:24,color:MX.ink,anchor:'middle'}));
  s+=fade(gf,label('細かくするほど 近似が良くなる',300,345,{size:24,color:MX.dim,anchor:'middle'}));
  s+=fade(gi,tx(`\\Phi_E=\\oint ${cH('E_{\\perp}')}\\,dA`,300,425,38,MX.E)+label('行き着く値 ＝ 積分',300,478,{size:24,color:MX.E,anchor:'middle',weight:700}));
  return s;})()),

 // ============ 確認：一様な電場の中の箱 ============
 'mx2-n-box':(p,ctx)=>stage(ctx,p,(()=>boxScene(ctx,{q:G(ctx,'箱全体'),gb:G(ctx,'箱を置く')}))()),
 'mx2-n-box:answer':(p,ctx)=>stage(ctx,p,(()=>boxScene(ctx,{q:1-smooth(ctx.t/.4),gb:1,gl:G(ctx,'左の面'),gr:G(ctx,'右の面'),go:G(ctx,'残りの面'),gs:G(ctx,'合計は')}))()),

 // ============ 例：中心に点電荷がある球 ============
 'mx2-n-ball':(p,ctx)=>stage(ctx,p,(()=>{
  const g0=G(ctx,'中心にして'),gr=G(ctx,'半径 r'),gd=G(ctx,'同じ距離'),gE=G(ctx,'電場の強さは');
  let s=ballScene(130,{ga:gE,gr});
  s+=fade(gd,[.6,1.9,2.9,4.2,5.3].map(a=>line(B.x,B.y,B.x+130*Math.cos(a),B.y+130*Math.sin(a),{color:W,w:2,dash:'5 6',opacity:.7})).join(''));
  s+=callout(40,120,520,330,'',g0);
  s+=fade(g0,label('中心に ＋の点電荷 Q',300,172,{size:26,color:MX.ink,anchor:'middle',weight:700}));
  s+=fade(gd,label('球の上は どこも距離 r',300,225,{size:24,color:MX.ink,anchor:'middle'}));
  s+=fade(gE,tx(`${cE('E')}=\\dfrac{${cQ('Q')}}{4\\pi\\varepsilon_0 r^2}`,300,315,46,MX.ink)+label('→ どこも同じ強さ',300,405,{size:26,color:MX.E,anchor:'middle',weight:700}));
  return s;})()),

 'mx2-n-ball:normal':(p,ctx)=>stage(ctx,p,(()=>{
  const gs=G(ctx,'まっすぐ外向き'),gn=G(ctx,'球の面に垂直'),gm=G(ctx,'まとめて'),gA=G(ctx,'電場×球の面積');
  let s=ballScene(130,{ga:1,gr:1});
  s+=fade(gn,[1,5,9,13].map(k=>{const a=2*Math.PI*(k+.5)/16,u=[Math.cos(a),Math.sin(a)],t=[-u[1],u[0]],P=[B.x+130*u[0],B.y+130*u[1]];
   return line(P[0]-t[0]*34,P[1]-t[1]*34,P[0]+t[0]*34,P[1]+t[1]*34,{color:W,w:3})+rightMark(P,u,t,12,MX.hi);}).join(''));
  s+=callout(40,120,520,370,'');
  s+=fade(gs,label('電場の向き ＝ 半径の向き',300,170,{size:24,color:MX.ink,anchor:'middle',weight:700}));
  s+=fade(gn,label('＝ 面に垂直 → 垂直な成分は電場そのもの',300,215,{size:22,color:MX.ink,anchor:'middle'})+tx(`\\sum ${cH('E_{\\perp}')}\\,\\Delta A`,300,285,40,MX.ink));
  s+=fade(gm,tx(`=${cE('E')}\\times\\sum\\Delta A`,300,355,40,MX.ink));
  s+=fade(gA,tx(`=${cE('E')}\\times 4\\pi r^2`,300,435,40,MX.hi));
  return s;})()),

 'mx2-n-ball:flux':(p,ctx)=>stage(ctx,p,(()=>{
  const g1=smooth(ctx.t/.4),g2=G(ctx,'四パイも'),g3=G(ctx,'Q 割る'),gz=G(ctx,'球の大きさ');
  const R=130*(1+.28*Math.sin(Math.max(0,ctx.t-T(ctx,'球の大きさ'))*2.4)*gz);
  let s=ballScene(R,{ga:1,gr:1});
  s+=callout(40,120,520,370,'');
  s+=fade(g1,fit(`\\Phi_E=\\dfrac{${cQ('Q')}}{4\\pi\\varepsilon_0 r^2}\\times 4\\pi r^2`,300,190,440,40,{color:MX.ink}));
  s+=fade(g2,fit(`=\\dfrac{${cQ('Q')}}{\\cancel{4\\pi}\\,\\varepsilon_0\\cancel{r^2}}\\times\\cancel{4\\pi}\\,\\cancel{r^2}`,300,300,440,36,{color:MX.ink}));
  s+=fade(g3,tx(`=\\dfrac{${cQ('Q')}}{\\varepsilon_0}`,230,420,46,MX.hi));
  s+=word('半径によらない',330,425,{size:24,color:MX.hi,anchor:'start',g:gz});
  return s;})()),

 // the product E × 4πr² needed the charge at the centre; off-centre or another shape → distance and tilt vary
 'mx2-n-ball:off':(p,ctx)=>stage(ctx,p,(()=>{
  const gc=G(ctx,'中心にある'),gm=G(ctx,'中心がずれ',{d:1}),gk=G(ctx,'形が違っ',{d:1}),gv=G(ctx,'距離も傾きも');
  const Qp={x:B.x+70*gm,y:B.y-45*gm},ph=2.4;
  let s=`<path d="${pathOf(bagPts(gk,ph))}" fill="${MX.E}" fill-opacity=".08" stroke="${MX.E}" stroke-opacity=".85" stroke-width="3"/>`;
  const PC=pieces(gk,ph,16);
  s+=PC.map(q=>{const [ex,ey]=Efield(q.M[0],q.M[1],[{...Qp,q:1}]),m=Math.hypot(ex,ey),L=Math.min(95,m);return arrow(q.M[0],q.M[1],q.M[0]+ex/m*L,q.M[1]+ey/m*L,{color:MX.E,w:4,head:12});}).join('');
  s+=fade(gv,PC.map(q=>line(q.M[0],q.M[1],q.M[0]+q.nx*44,q.M[1]+q.ny*44,{color:W,w:2,dash:'5 5'})).join(''));
  s+=fade(gm,cross(B.x,B.y,8,1,MX.dim)+label('球の中心',B.x-14,B.y+34,{size:22,color:MX.dim,anchor:'middle'}));
  s+=charge(Qp.x,Qp.y,1,{r:22});
  s+=callout(40,120,520,360,'');
  s+=fade(gc,label('中心にあるときだけ：',300,170,{size:24,color:MX.dim,anchor:'middle'})+label('距離も向きも そろう → E × 4πr²',300,215,{size:24,color:MX.ink,anchor:'middle',weight:700}));
  s+=fade(gm,label('ずれる・形が違うと',300,295,{size:24,color:MX.dim,anchor:'middle'}));
  s+=fade(gv,label('距離も傾きも 場所ごとに違う',300,345,{size:26,color:MX.plus,anchor:'middle',weight:700})+label('（白い点線：面に垂直な向き）',300,390,{size:22,color:MX.dim,anchor:'middle'})+label('この掛け算は 使えない',300,440,{size:26,color:MX.plus,anchor:'middle',weight:700}));
  return s;})()),

 // ============ 一般化：細い円すい ============
 'mx2-n-cone':(p,ctx)=>stage(ctx,p,(()=>{
  const QK={x:260,y:300},w=1.2,ph=.8,a=-.35,gc=G(ctx,'細い円すいで'),gl=G(ctx,'円すいを伸ばし'),gw=G(ctx,'小さな窓');
  let s=`<path d="${pathOf(bagPts(w,ph,180,QK.x,QK.y))}" fill="#9fb3d6" fill-opacity=".10" stroke="${GH}" stroke-width="3"/>`;
  const cl=smooth((ctx.t-T(ctx,'円すいを伸ばし')+.2)/1.2),L=380*cl;
  if(L>5){s+=wedge(QK,a,PHI,L,{fo:.12});const E=[QK.x+L*Math.cos(a),QK.y+L*Math.sin(a)];
   s+=`<ellipse cx="${E[0].toFixed(1)}" cy="${E[1].toFixed(1)}" rx="9" ry="${(L*Math.tan(PHI)).toFixed(1)}" transform="rotate(${(a*180/Math.PI).toFixed(1)} ${E[0].toFixed(1)} ${E[1].toFixed(1)})" fill="none" stroke="${MX.hi}" stroke-width="2" stroke-opacity=".7"/>`;}
  s+=fade(gw,draw(starArc(QK.x,QK.y,w,ph,a-PHI,a+PHI,10),1,{color:MX.hi,w:9}));
  s+=charge(QK.x,QK.y,1,{r:22})+label('Q',QK.x+8,QK.y+50,{size:26,color:MX.plus,weight:700,anchor:'middle'});
  s+=callout(620,110,550,370,'');
  s+=label('ここまで：球という特別な面の例',895,160,{size:24,color:MX.dim,anchor:'middle'});
  s+=label('ここから：どんな形の閉じた面でも？',895,210,{size:28,color:MX.hi,anchor:'middle',weight:700});
  s+=fade(gc,label('道具：細い円すい（立体の束）',895,290,{size:24,color:MX.ink,anchor:'middle'}));
  s+=fade(gw,label('面が切り取る 小さな窓',895,355,{size:26,color:MX.hi,anchor:'middle',weight:700})+label('窓ごとに 電気束を比べる',895,405,{size:24,color:MX.ink,anchor:'middle'}));
  return s;})()),

 'mx2-n-cone:far':(p,ctx)=>stage(ctx,p,(()=>{
  const g2=G(ctx,'距離が二倍'),gE=G(ctx,'電場は四分の一'),gA=G(ctx,'面積は四倍'),gx=G(ctx,'掛けると');
  let s=coneFar({g2,gE});
  s+=callout(720,100,450,400,'');
  s+=label('窓を 電場の向きから見ると',945,145,{size:24,color:MX.dim,anchor:'middle'});
  s+=rect(815-25,240-25,50,50,{fill:MX.hi,fo:.15,stroke:MX.hi,sw:3,rx:2})+label('面積 a',815,315,{size:24,color:MX.ink,anchor:'middle'})+tx('E',815,360,28,MX.E);
  s+=fade(g2,rect(1045-50,240-50,100,100,{fill:MX.hi,fo:.15,stroke:MX.hi,sw:3,rx:2})+`<path d="M${1045} ${190} V${290} M${995} ${240} H${1095}" stroke="${MX.hi}" stroke-width="1.5" stroke-opacity=".6"/>`);
  s+=fade(gA,label('面積 4a',1045,315,{size:24,color:MX.hi,anchor:'middle',weight:700}))+fade(gE,tx('E/4',1045,360,28,MX.E));
  s+=fade(gx,tx(`${cE('E')}\\times a=${cE('\\tfrac{E}{4}')}\\times 4a`,945,430,38,MX.ink)+label('距離によらず 同じ',945,482,{size:24,color:MX.hi,anchor:'middle',weight:700}));
  return s;})()),

 'mx2-n-cone:tilt':(p,ctx)=>stage(ctx,p,(()=>{
  const gt=G(ctx,'傾いて',{d:1.2}),gA=G(ctx,'面積は増え'),gc=G(ctx,'垂直な成分が'),gv=G(ctx,'電場の向きから見た');
  const al=.95*gt;
  let s=coneFar({g2:1,gE:1,op2:0});
  const h2=R2*Math.tan(PHI),x2=QF.x+R2,[e1,e2]=tiltedEnds(al);
  s+=fade(mix(.8,1,gv),line(x2,QF.y-h2,x2,QF.y+h2,{color:gv>.5?MX.good:MX.dim,w:gv>.5?5:3,dash:'6 6'}));
  s+=line(e1[0],e1[1],e2[0],e2[1],{color:MX.hi,w:8});
  s+=fade(gv,word('A′：電場の向きから見た面積',700,150,{size:22,color:MX.good,anchor:'end'}));
  s+=callout(720,100,450,400,'');
  // enlarged: the tilted window and the field split into its normal component
  const Mc=[850,210],t=[Math.sin(al),Math.cos(al)],n=[Math.cos(al),-Math.sin(al)],L=120;
  s+=line(Mc[0]-t[0]*70,Mc[1]-t[1]*70,Mc[0]+t[0]*70,Mc[1]+t[1]*70,{color:MX.hi,w:6})+line(Mc[0],Mc[1],Mc[0]+n[0]*110,Mc[1]+n[1]*110,{color:W,w:2,dash:'5 5'});
  s+=arrow(Mc[0],Mc[1],Mc[0]+L,Mc[1],{color:MX.E,w:5,head:14})+tx('E',Mc[0]+L+18,Mc[1]+10,26,MX.E);
  s+=fade(gc,arrow(Mc[0],Mc[1],Mc[0]+n[0]*L*Math.cos(al),Mc[1]+n[1]*L*Math.cos(al),{color:MX.hi,w:6,head:14})+tx('E_{\\perp}',Mc[0]+n[0]*L*Math.cos(al)-26,Mc[1]+n[1]*L*Math.cos(al)-8,24,MX.hi));
  s+=fade(gA,label('面積 A：傾けると増える',945,322,{size:22,color:MX.ink,anchor:'middle'}));
  s+=fade(gc,label('垂直な成分：同じ割合で減る',945,360,{size:24,color:MX.hi,anchor:'middle',weight:700}));
  s+=fade(gv,tx(`${cH('E_{\\perp}')}\\times A=${cE('E')}\\times{\\color{${MX.good}}A'}`,945,418,36,MX.ink)+label('A′ は円すいの断面：傾けても同じ',945,476,{size:22,color:MX.good,anchor:'middle',weight:700}));
  return s;})()),

 'mx2-n-cone:all':(p,ctx)=>stage(ctx,p,(()=>{
  const Qc={x:400,y:300},w=1.2,ph=.8,ph24=Math.PI/24,g1=G(ctx,'円すい一本分'),gf=G(ctx,'形によらず'),gq=G(ctx,'Q 割る'),ta=T(ctx,'全方向の円すい'),nOn=clamp((ctx.t-ta+.3)/2)*24,K0=21;
  let s=`<path d="${pathOf(bagPts(w,ph,180,Qc.x,Qc.y))}" fill="#9fb3d6" fill-opacity=".08" stroke="${GH}" stroke-width="3"/>`;
  s+=ring(Qc.x,Qc.y,105,{color:MX.E,w:2,dash:'6 6'});
  for(let k=0;k<24;k++){const on=k===K0?1:clamp(nOn-((k-K0+24)%24)+1);if(on<=0)continue;const a=2*Math.PI*(k+.5)/24,arc=starArc(Qc.x,Qc.y,w,ph,a-ph24,a+ph24,6);
   s+=fade(on,poly([[Qc.x,Qc.y],...arc],{fill:k%2?MX.E:MX.hi,fo:k===K0?.22:.10})+draw(arc,1,{color:MX.hi,w:k===K0?8:4}));
   if(k===K0)s+=fade(g1,draw(Array.from({length:7},(_,i)=>{const b=a-ph24+2*ph24*i/6;return [Qc.x+105*Math.cos(b),Qc.y+105*Math.sin(b)];}),1,{color:MX.E,w:7}));}
  s+=charge(Qc.x,Qc.y,1,{r:22});
  s+=callout(760,110,410,380,'');
  s+=fade(g1,label('円すい1本分の電気束',965,160,{size:26,color:MX.ink,anchor:'middle',weight:700}));
  s+=fade(gf,label('球（点線）でも 袋でも 同じ',965,208,{size:22,color:MX.hi,anchor:'middle'}));
  s+=fade(clamp(nOn/3),label('全方向の円すいで足す',965,280,{size:26,color:MX.ink,anchor:'middle'}));
  s+=fade(gq,tx(`\\Phi_E=\\dfrac{${cQ('Q')}}{\\varepsilon_0}`,965,365,46,MX.hi)+label('中の点電荷1つなら',965,440,{size:22,color:MX.E,anchor:'middle'})+label('どんな閉じた面でも',965,474,{size:22,color:MX.E,anchor:'middle'}));
  return s;})()),

 'mx2-n-cone:dent':(p,ctx)=>stage(ctx,p,(()=>{
  const gd=G(ctx,'へこんで'),g3=G(ctx,'三回横切る'),gs=G(ctx,'出る、入る'),gk=G(ctx,'打ち消し'),gr=G(ctx,'一回出た分'),ph=.1;
  let s=`<path d="${pathOf(DENT)}" fill="#9fb3d6" fill-opacity=".24" stroke="${GH}" stroke-width="3"/>`;
  s+=fade(g3,wedge(QD,0,ph,270,{fo:.12}));
  const sg=[1,-1,1],col=[MX.hi,MX.minus,MX.hi];
  DR.forEach((r,i)=>{const arc=Array.from({length:7},(_,j)=>{const b=-ph+2*ph*j/6;return [QD.x+r*Math.cos(b),QD.y+r*Math.sin(b)];});
   s+=fade(g3,draw(arc,1,{color:col[i],w:8}));
   s+=fade(gs,plate(sg[i]>0?'+':'-',QD.x+r,QD.y-58,28,col[i]));});
  s+=fade(gk,`<path d="M${QD.x+DR[0]} ${QD.y+36} Q${QD.x+(DR[0]+DR[1])/2} ${QD.y+80} ${QD.x+DR[1]} ${QD.y+36}" fill="none" stroke="${MX.ink}" stroke-width="2.5"/>`+label('打ち消す',QD.x+(DR[0]+DR[1])/2,QD.y+104,{size:22,color:MX.dim,anchor:'middle'}));
  s+=charge(QD.x,QD.y,1,{r:20});
  s+=callout(640,110,530,380,'');
  s+=fade(gd,label('へこんだ面',905,160,{size:26,color:MX.ink,anchor:'middle',weight:700}));
  s+=fade(g3,label('円すいが 面を3回 横切る',905,208,{size:24,color:MX.ink,anchor:'middle'}));
  s+=fade(gs,label('出る ＋　入る −　出る ＋',905,272,{size:26,color:MX.hi,anchor:'middle',weight:700}));
  s+=fade(gk,tx('+\\Phi_c-\\Phi_c+\\Phi_c=\\Phi_c',905,345,38,MX.ink)+label('Φc：円すい1本分（どの窓も同じ大きさ）',905,405,{size:22,color:MX.dim,anchor:'middle'}));
  s+=fade(gr,label('残るのは 1回出た分',905,460,{size:26,color:MX.hi,anchor:'middle',weight:700}));
  return s;})()),

 // ============ 外の電荷 ============
 'mx2-n-outside':(p,ctx)=>stage(ctx,p,(()=>{
  const w=1,ph=2.4,gm=G(ctx,'近づけると',{d:1.8}),ge=G(ctx,'面の上の電場'),gq=G(ctx,'電気束は変わる');
  const O={x:mix(110,470,gm),y:mix(150,215,gm)},go=smooth(ctx.t/.5),qs=[{x:B.x,y:B.y,q:1},{x:O.x,y:O.y,q:go}];
  let s='';
  for(let k=0;k<12;k++){const a=2*Math.PI*(k+.5)/12,far=farT(B.x,B.y,a);s+=fline([[B.x+22*Math.cos(a),B.y+22*Math.sin(a)],[B.x+far*Math.cos(a),B.y+far*Math.sin(a)]],1,{at:.8,opacity:.35});}
  s+=bagSvg(w,ph);
  for(let k=0;k<16;k++){const a=2*Math.PI*(k+.5)/16,far=farT(O.x,O.y,a);
   s+=fline([[O.x+20*Math.cos(a),O.y+20*Math.sin(a)],[O.x+far*Math.cos(a),O.y+far*Math.sin(a)]],go,{color:'#b9e6ff',w:2.5,opacity:.6,at:.2});}
  // total field on the surface: it does change as the outside charge comes closer
  s+=pieces(w,ph,16).map(q=>{const [ex,ey]=Efield(q.M[0],q.M[1],qs),m=Math.min(80,Math.hypot(ex,ey));return arrow(q.M[0],q.M[1],q.M[0]+ex/Math.hypot(ex,ey)*m,q.M[1]+ey/Math.hypot(ex,ey)*m,{color:ge>.5?MX.hi:MX.E,w:4,head:12,opacity:mix(.6,1,ge)});}).join('');
  s+=bagQ()+charge(O.x,O.y,1,{r:22,g:go});
  s+=word('外の電荷',O.x,O.y-46,{size:26,color:MX.ink,anchor:'middle',g:go});
  s+=word('面の上の電場は 変わる',1000,120,{size:26,color:MX.hi,anchor:'middle',g:ge});
  s+=word('では、電気束は？',230,462,{size:30,color:MX.hi,anchor:'middle',g:gq});
  return s;})()),

 'mx2-n-outside:cone':(p,ctx)=>stage(ctx,p,(()=>{
  const gc=G(ctx,'伸ばした円すい'),gi=G(ctx,'面に入り'),go=G(ctx,'出ていきます'),gw=G(ctx,'入る窓と'),ge=G(ctx,'大きさが等しく');
  let s=bagSvg(WB,PB)+bagQ(.5);
  const cw=coneWindows(AO,PHO);
  s+=fade(gc,wedge(OC,AO,PHO,Math.min(900,farT(OC.x,OC.y,AO)),{fo:.10}));
  s+=fade(gi,draw(cw.inn,1,{color:MX.minus,w:9}))+fade(go,draw(cw.out,1,{color:MX.hi,w:9}));
  const pi=cw.inn[4],po=cw.out[4];
  s+=fade(gw,plate('-',pi[0]-34,pi[1]-44,30,MX.minus)+plate('+',po[0]+30,po[1]-44,30,MX.hi));
  s+=fade(gi,word('入る',pi[0]-40,pi[1]+62,{size:24,color:MX.minus,anchor:'middle'}))+fade(go,word('出る',po[0]+40,po[1]+62,{size:24,color:MX.hi,anchor:'middle'}));
  s+=charge(OC.x,OC.y,1,{r:22})+word('外の電荷',OC.x,OC.y-48,{size:24,color:MX.ink,anchor:'middle'});
  s+=callout(40,330,500,170,'',gw);
  s+=fade(gw,label('入る窓：内向きにつき抜ける → −',290,375,{size:24,color:MX.ink,anchor:'middle'})+label('出る窓：外向きにつき抜ける → ＋',290,418,{size:24,color:MX.ink,anchor:'middle'}));
  s+=fade(ge,label('大きさは等しく、符号が逆',290,470,{size:26,color:MX.hi,anchor:'middle',weight:700}));
  return s;})()),

 'mx2-n-outside:zero':(p,ctx)=>stage(ctx,p,(()=>{
  const gd=G(ctx,'距離と傾き'),gz=G(ctx,'どの円すいでも',{d:.9}),g0=G(ctx,'差し引きゼロ');
  let s=bagSvg(WB,PB)+bagQ(.5);
  s+=outsideCone(AO,PHO,{labels:1});
  const offs=[-.24,-.16,-.08,.08,.16,.24];
  offs.forEach((o,i)=>{s+=outsideCone(AO+o,PHO*.8,{g:clamp(gz*7-i),op:.6,wEdge:1.5});});
  s+=charge(OC.x,OC.y,1,{r:22})+word('外の電荷',OC.x,OC.y-48,{size:24,color:MX.ink,anchor:'middle'});
  s+=callout(40,330,500,170,'');
  s+=fade(gd,label('遠い窓：電場は弱いが 面積は広い',290,375,{size:24,color:MX.ink,anchor:'middle'})+label('傾き：面積と垂直な成分が 打ち消す',290,418,{size:24,color:MX.ink,anchor:'middle'}));
  s+=fade(g0,tx('(-\\Phi_c)+(+\\Phi_c)=0',290,472,34,MX.hi));
  return s;})()),

 // superposition → flux adds charge by charge
 'mx2-n-outside:sum':(p,ctx)=>stage(ctx,p,(()=>{
  const q1={x:745,y:265},q2={x:855,y:365},q3={x:1090,y:160};
  const gs=G(ctx,'重ね合わせで'),gf=G(ctx,'電気束も'),go=G(ctx,'外の電荷はゼロ'),gi=G(ctx,'中の電荷はそれぞれ'),gt=G(ctx,'加えます');
  let s=bagSvg(WB,PB);
  s+=charge(q1.x,q1.y,1,{r:20})+tx('q_1',q1.x+34,q1.y-22,26,MX.plus)+charge(q2.x,q2.y,1,{r:20})+tx('q_2',q2.x+34,q2.y-22,26,MX.plus);
  s+=charge(q3.x,q3.y,1,{r:20})+tx('q_3',q3.x-40,q3.y-18,26,MX.plus)+label('外',q3.x,q3.y+50,{size:22,color:MX.dim,anchor:'middle'});
  s+=callout(40,110,560,390,'');
  s+=fade(gs,label('重ね合わせ',100,168,{size:22,color:MX.dim})+tx(`${cE('\\vec E')}=${cE('\\vec E_1')}+${cE('\\vec E_2')}+${cE('\\vec E_3')}`,360,168,34,MX.ink));
  s+=fade(gf,tx('\\Phi_E=\\Phi_1+\\Phi_2+\\Phi_3',320,245,36,MX.ink)+label('電荷ごとの電気束の和',320,292,{size:22,color:MX.dim,anchor:'middle'}));
  s+=fade(gi,tx(`=\\dfrac{${cQ('q_1')}}{\\varepsilon_0}+\\dfrac{${cQ('q_2')}}{\\varepsilon_0}+{\\color{${MX.dim}}0}`,270,370,36,MX.ink));
  s+=fade(go,label('外の q₃ の分は 0',500,378,{size:22,color:MX.dim,anchor:'middle'}));
  s+=fade(gt,tx(`=\\dfrac{${cQ('q_1+q_2')}}{\\varepsilon_0}`,230,455,34,MX.hi)+label('中の電荷の合計',430,462,{size:22,color:MX.hi,anchor:'middle',weight:700}));
  return s;})()),

 // net charge zero → flux zero, but the field on the surface is not zero
 'mx2-n-outside:net':(p,ctx)=>stage(ctx,p,(()=>{
  const qp={x:745,y:310},qm={x:855,y:310},gp=G(ctx,'プラスとマイナス'),gs=G(ctx,'符号をつけて'),gz=G(ctx,'合計がゼロ'),gb=G(ctx,'箱の例'),gE=G(ctx,'面の上の電場');
  const qs=[{...qp,q:1},{...qm,q:-1}];
  let s=bagSvg(WB,PB);
  s+=fade(gE,pieces(WB,PB,24).map(q=>{const [ex,ey]=Efield(q.M[0],q.M[1],qs),m=Math.hypot(ex,ey),L=clamp(m*1.6,16,60),out=ex*q.nx+ey*q.ny>0;
   return arrow(q.M[0],q.M[1],q.M[0]+ex/m*L,q.M[1]+ey/m*L,{color:out?MX.hi:MX.minus,w:4,head:11});}).join(''));
  s+=fade(gp,charge(qp.x,qp.y,1,{r:22})+charge(qm.x,qm.y,-1,{r:22})+tx('+q',qp.x,qp.y-40,26,MX.plus)+tx('-q',qm.x,qm.y-40,26,MX.minus));
  s+=callout(40,110,560,390,'');
  s+=fade(gs,tx('(+q)+(-q)=0',320,175,38,MX.ink)+label('符号をつけて足す',320,225,{size:22,color:MX.dim,anchor:'middle'}));
  s+=fade(gz,tx('\\Phi_E=\\dfrac{0}{\\varepsilon_0}=0',320,290,40,MX.hi));
  s+=fade(gb,label('でも 面の上の電場は 0 ではない',320,368,{size:26,color:MX.plus,anchor:'middle',weight:700})+label('（黄：出る所　青：入る所が 打ち消すだけ）',320,410,{size:22,color:MX.dim,anchor:'middle'}));
  s+=fade(gp,label('電荷がちょうど面の上にある場合は 扱わない',320,470,{size:22,color:MX.dim,anchor:'middle'}));
  return s;})()),

 // ============ ガウスの法則 ============
 'mx2-n-gauss':(p,ctx)=>stage(ctx,p,(()=>{
  const w=1,ph=2.4,gL=G(ctx,'閉じた面の電気束'),gR=G(ctx,'中の電荷の'),gN=G(ctx,'ガウスの法則');
  let s=bagSvg(w,ph)+bagQ();
  s+=pieces(w,ph,16).map(q=>{const [ex,ey]=Efield(q.M[0],q.M[1],QB);return arrow(q.M[0],q.M[1],q.M[0]+ex,q.M[1]+ey,{color:MX.E,w:4,head:12});}).join('');
  s+=gauss([gL,gL,gL,gL,gR]);
  s+=fade(gL,label('閉じた面の電気束',GXS[1],GY0+90,{size:26,color:MX.E,anchor:'middle',weight:700}))+fade(gR,label('中の電荷の合計 ÷ ε₀',GXS[4],GY0+130,{size:24,color:MX.plus,anchor:'middle',weight:700}));
  s+=word('ガウスの法則',GX0,470,{size:32,color:MX.hi,anchor:'middle',g:gN});
  return s;})()),

 'mx2-n-gauss:scope':(p,ctx)=>stage(ctx,p,(()=>{
  const g1=G(ctx,'クーロンの法則と'),g2=G(ctx,'動いていても');
  let s=gauss([1,1,1,1,1]);
  s+=word('ガウスの法則',GX0,470,{size:32,color:MX.hi,anchor:'middle'});
  s+=fade(g1,rect(620,120,540,170,{fill:MX.E,fo:.08,stroke:MX.E,sw:2,rx:12})+label('この章で導いた範囲',890,160,{size:24,color:MX.dim,anchor:'middle'})+label('止まった電荷',890,210,{size:32,color:MX.E,anchor:'middle',weight:700})+label('クーロンの法則 ＋ 重ね合わせ',890,260,{size:24,color:MX.ink,anchor:'middle'}));
  s+=fade(g2,rect(620,310,540,150,{fill:MX.plus,fo:.08,stroke:MX.plus,sw:2,rx:12})+label('実験で確かめられている',890,352,{size:24,color:MX.dim,anchor:'middle'})+label('電荷が動いていても 成り立つ',890,410,{size:30,color:MX.plus,anchor:'middle',weight:700}));
  return s;})()),

 'mx2-n-gauss:vec':(p,ctx)=>stage(ctx,p,(()=>{
  const w=1,ph=2.4,PC=pieces(w,ph,16),pc=PC[0],gA=G(ctx,'dA'),gv=G(ctx,'外向きの向き'),gx=G(ctx,'動きや力');
  let s=bagSvg(w,ph)+bagQ();
  s+=PC.map(q=>{const [fx,fy]=Efield(q.M[0],q.M[1],QB);return arrow(q.M[0],q.M[1],q.M[0]+fx,q.M[1]+fy,{color:MX.E,w:3,head:10,opacity:.35});}).join('');
  s+=fade(gA,line(pc.A[0],pc.A[1],pc.B[0],pc.B[1],{color:MX.hi,w:10}));
  s+=fade(gv,arrow(pc.M[0],pc.M[1],pc.M[0]+pc.nx*95,pc.M[1]+pc.ny*95,{color:W,w:5,head:16})+plate('d\\vec A',pc.M[0]+pc.nx*95+10,pc.M[1]+pc.ny*95-44,26,W));
  s+=fade(gv,word('長さ＝面積、向き＝外向き',1000,120,{size:22,color:MX.ink,anchor:'middle'}));
  s+=gauss([.3,.3,.3,1,.3])+gbox(3,3,gA,'面積の矢印');
  s+=word('動きや力ではない：面の向きの目印',GX0+40,470,{size:24,color:MX.hi,anchor:'middle',g:gx});
  return s;})()),

 'mx2-n-gauss:dot':(p,ctx)=>stage(ctx,p,(()=>{
  const w=1,ph=2.4,PC=pieces(w,ph,16),pc=PC[0],gd=G(ctx,'点は'),gc=G(ctx,'方向の成分'),gt=G(ctx,'つまり'),gp=G(ctx,'外向きなら');
  let s=bagSvg(w,ph)+bagQ();
  s+=PC.map(q=>{const [fx,fy]=Efield(q.M[0],q.M[1],QB);return arrow(q.M[0],q.M[1],q.M[0]+fx,q.M[1]+fy,{color:MX.E,w:3,head:10,opacity:.35});}).join('');
  const [ex,ey]=Efield(pc.M[0],pc.M[1],QB),k=2.2,EX=ex*k,EY=ey*k,en=EX*pc.nx+EY*pc.ny;
  s+=line(pc.A[0],pc.A[1],pc.B[0],pc.B[1],{color:MX.hi,w:10})+line(pc.M[0],pc.M[1],pc.M[0]+pc.nx*130,pc.M[1]+pc.ny*130,{color:W,w:2,dash:'6 6'});
  s+=arrow(pc.M[0],pc.M[1],pc.M[0]+EX,pc.M[1]+EY,{color:MX.E,w:5,head:14,opacity:mix(1,.5,gc)});
  s+=fade(gc,arrow(pc.M[0],pc.M[1],pc.M[0]+pc.nx*en,pc.M[1]+pc.ny*en,{color:MX.hi,w:7,head:16})+line(pc.M[0]+pc.nx*en,pc.M[1]+pc.ny*en,pc.M[0]+EX,pc.M[1]+EY,{color:MX.dim,w:2,dash:'4 5'}));
  s+=gauss([.3,1,1,.3,.3])+gbox(1,2,gd,'矢印の方向の成分');
  s+=fade(gt,tx(`\\vec E\\cdot d\\vec A=${cH('E_{\\perp}')}\\,dA`,GX0,452,38,MX.ink));
  s+=fade(gp,label('外向き ＋／内向き −',GX0,500,{size:22,color:MX.dim,anchor:'middle'}));
  return s;})()),

 'mx2-n-gauss:ring':(p,ctx)=>stage(ctx,p,(()=>{
  const w=1,ph=2.4,PC=pieces(w,ph,16),gS=G(ctx,'丸の付いた'),gr=G(ctx,'dA なら'),gd=G(ctx,'dr なら');
  const u=clamp((ctx.t-T(ctx,'閉じたもの全体'))/2);
  let s=fade(1-.8*gr,bagSvg(w,ph)+bagQ()+PC.map((q,i)=>u>0&&i<u*PC.length?line(q.A[0],q.A[1],q.B[0],q.B[1],{color:MX.hi,w:7}):'').join(''));
  s+=gauss([1,.3,.3,.3,.3])+gbox(0,0,gS,'閉じたもの全体で足す');
  s+=callout(620,120,550,340,'',gr);
  s+=fade(gr,tx('\\oint\\cdots\\,d\\vec A',740,210,40,MX.hi)+label('閉じた面（袋）',850,200,{size:26,color:MX.ink,weight:700})+label('一片ずつ 面積で足す',850,240,{size:22,color:MX.dim}));
  s+=fade(gd,tx('\\oint\\cdots\\,d\\vec r',740,350,40,MX.B)+label('閉じた道（後の章）',850,340,{size:26,color:MX.ink,weight:700})+label('一歩ずつ 一周して足す',850,380,{size:22,color:MX.dim}));
  s+=fade(gd,label('丸 ＝ 閉じている',895,430,{size:24,color:MX.hi,anchor:'middle',weight:700}));
  return s;})()),

 'mx2-n-gauss:read':(p,ctx)=>stage(ctx,p,(()=>{
  const w=1,ph=2.4,gR=G(ctx,'読めなかった');
  let s='';
  for(let k=0;k<12;k++){const a=2*Math.PI*(k+.5)/12,far=farT(B.x,B.y,a);s+=fline([[B.x+22*Math.cos(a),B.y+22*Math.sin(a)],[B.x+far*Math.cos(a),B.y+far*Math.sin(a)]],1,{at:.85,opacity:.8});}
  s+=bagSvg(w,ph);
  for(let k=0;k<12;k++){const a=2*Math.PI*(k+.5)/12;for(const c of crossings(B.x,B.y,a,w,ph))s+=dot(c.x,c.y,7,MX.hi);}
  s+=bagQ();
  s+=gauss([1,1,1,1,1]);
  s+=word('＝ つき抜ける線の数え方',GX0,470,{size:30,color:MX.E,anchor:'middle',g:gR});
  return s;})()),
};

// Point charge Q and test charge q (left part of the E = F/q derivation).
function pointLeft(){const S0={x:200,y:300},Pq={x:420,y:300};
 return charge(S0.x,S0.y,1,{r:30})+tx('Q',S0.x,S0.y-48,32,MX.plus)+probe(Pq.x,Pq.y,1,12)+tx('q',Pq.x,Pq.y-34,28,MX.plus)
  +arrow(Pq.x+16,Pq.y,Pq.x+100,Pq.y,{color:F,w:6,head:16})+tx('F',Pq.x+60,Pq.y+40,28,F)
  +line(S0.x,380,Pq.x,380,{color:W,w:2})+line(S0.x,372,S0.x,388,{color:W,w:2})+line(Pq.x,372,Pq.x,388,{color:W,w:2})+tx('r',(S0.x+Pq.x)/2,412,28,W);}
function pointScene(ctx,{g1=1,gC=1,gd=1}={}){
 let s=pointLeft();
 s+=word('点電荷・止まっている・真空',290,140,{size:24,color:MX.ink,anchor:'middle',g:g1});
 s+=callout(600,110,570,380,'',gC);
 s+=fade(gC,label('前の章：クーロンの法則',885,158,{size:24,color:MX.dim,anchor:'middle'})+tx(`F=\\dfrac{k\\,q\\,${cQ('Q')}}{r^2}`,885,235,50,MX.ink));
 s+=fade(gd,label('試験電荷 q で割る ＝ 1 C あたりに直す',885,318,{size:24,color:MX.E,anchor:'middle'})+tx(`${cE('E')}=\\dfrac{F}{q}`,885,418,50,MX.ink));
 return s;}

// Box in a uniform field (the understanding check). Cross-section; the faces not shown are parallel to the field.
function boxScene(ctx,{q=0,gb=1,gl=0,gr=0,go=0,gs=0}={}){
 const x0=500,x1=700,y0=200,y1=400;let s='';
 for(let y=130;y<=490;y+=45)s+=arrow(40,y,1160,y,{color:MX.E,w:3,head:12,opacity:.75});
 s+=plate('\\vec E',90,118,30,MX.E);
 s+=fade(gb,rect(x0+34,y0-24,200,200,{fill:'none',fo:0,stroke:GH,sw:2,rx:0})+line(x0,y0,x0+34,y0-24,{color:GH,w:2})+line(x1,y0,x1+34,y0-24,{color:GH,w:2})+line(x1,y1,x1+34,y1-24,{color:GH,w:2})
  +rect(x0,y0,200,200,{fill:'#9fb3d6',fo:.12,stroke:GH,sw:3,rx:0}));
 s+=fade(gl,line(x0,y0,x0,y1,{color:MX.minus,w:8})+arrow(x0,300,x0-70,300,{color:W,w:3,head:12})+plate('-EA',x0-110,250,34,MX.minus));
 s+=fade(gr,line(x1,y0,x1,y1,{color:MX.hi,w:8})+arrow(x1,300,x1+70,300,{color:W,w:3,head:12})+plate('+EA',x1+110,250,34,MX.hi));
 s+=fade(go,line(x0,y0,x1,y0,{color:MX.dim,w:8})+line(x0,y1,x1,y1,{color:MX.dim,w:8})+arrow(600,y0,600,y0-60,{color:W,w:3,head:12})+arrow(600,y1,600,y1+44,{color:W,w:3,head:12})
  +plate('0',660,y0-40,34,MX.ink)+plate('0',660,y1+28,30,MX.ink));
 s+=word('箱全体の電気束は？',600,482,{size:32,color:MX.hi,anchor:'middle',g:q});
 s+=fade(gs,plate('-EA+EA+0=0',600,490,34,MX.hi));
 return s;
}
// Sphere of radius R around Q (at B), with the outward field on it (length ∝ 1/R²).
function ballScene(R,{ga=1,gr=1}={}){
 let s=`<circle cx="${B.x}" cy="${B.y}" r="${R}" fill="${MX.E}" fill-opacity=".08" stroke="${MX.E}" stroke-opacity=".85" stroke-width="3"/>`
  +`<ellipse cx="${B.x}" cy="${B.y}" rx="${R}" ry="${R*.28}" fill="none" stroke="${MX.E}" stroke-opacity=".3" stroke-width="2" stroke-dasharray="6 6"/>`;
 const L=40*(130/R)**2;
 for(let k=0;k<16;k++){const a=2*Math.PI*(k+.5)/16,x=B.x+R*Math.cos(a),y=B.y+R*Math.sin(a);s+=arrow(x,y,x+L*Math.cos(a),y+L*Math.sin(a),{color:MX.E,w:4,head:12,g:ga});}
 s+=charge(B.x,B.y,1,{r:22})+label('Q',B.x+26,B.y-22,{size:28,color:MX.plus,weight:700});
 s+=fade(gr,line(B.x,B.y,B.x-R,B.y,{color:W,w:3})+plate('r',B.x-R/2,B.y+32,28,W));
 return s;
}

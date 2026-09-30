// Diagrams for the v2 Maxwell film, part p2 (chapter 2: 電場とガウスの法則).
// Keys: 'mx2-n-<name>'. Chapter experience: 調べる — probe the invisible field with a test charge.
// Timing: an element appears when the narration reaches the phrase that names it (T/G below map the
// phrase's position in the subtitle onto the voiced part of the sentence, as in mxA).
import {MX,C,clamp,mix,smooth,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,stage,word,callout,charge,fieldLines,fit} from './mx-common.mjs';
import {poly} from './anim.mjs';

// ---- timing -------------------------------------------------------------------------------
const VE=ctx=>Math.max(.6,(ctx?.dur??4)-(ctx?.cue?.pause??0)-.12);
function T(ctx,s,k=0){const sub=ctx?.cue?.subtitle??'';let i=-1;for(let j=0,f=0;j<=k;j++){i=sub.indexOf(s,f);if(i<0)break;f=i+1;}
 if(i<0)throw Error(`mx2-p2: phrase "${s}" not in subtitle: ${sub}`);return VE(ctx)*i/sub.length;}
const G=(ctx,s,{d=.45,k=0,off=-.15}={})=>smooth((ctx.t-T(ctx,s,k)-off)/d);

// ---- small pieces -------------------------------------------------------------------------
const F=C.F,W='#ffffff',GH='#c9d3e6';
const tx=(src,x,y,size,color=MX.ink,anchor='middle',opacity=1)=>tex(src,x,y,{size,color,anchor,auto:false,opacity});
const dash=(x,y,X,Y,g=1,color=MX.dim)=>fade(g,line(x,y,X,Y,{color,w:2.5,dash:'8 7'}));
const probe=(x,y,g=1,r=12)=>charge(x,y,1,{r,g});
const cross=(x,y,s,g,color=MX.plus)=>fade(g,line(x-s,y-s,x+s,y+s,{color,w:7})+line(x-s,y+s,x+s,y-s,{color,w:7}));
function along(pts,u){let L=0;const d=[];for(let i=1;i<pts.length;i++){const s=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);d.push(s);L+=s;}
 let want=L*clamp(u);for(let i=1;i<pts.length;i++){if(d[i-1]>=want||i===pts.length-1){const k=d[i-1]?clamp(want/d[i-1]):0;return {x:mix(pts[i-1][0],pts[i][0],k),y:mix(pts[i-1][1],pts[i][1],k),a:Math.atan2(pts[i][1]-pts[i-1][1],pts[i][0]-pts[i-1][0]),L};}want-=d[i-1];}
 return {x:pts[0][0],y:pts[0][1],a:0,L:0};}
const head=(x,y,a,color=MX.E,h=13)=>`<polygon points="${x+h*Math.cos(a)},${y+h*Math.sin(a)} ${x-h*.6*Math.cos(a)+h*.55*Math.sin(a)},${y-h*.6*Math.sin(a)-h*.55*Math.cos(a)} ${x-h*.6*Math.cos(a)-h*.55*Math.sin(a)},${y-h*.6*Math.sin(a)+h*.55*Math.cos(a)}" fill="${color}"/>`;
function fline(pts,p=1,{color=MX.E,w=3,opacity=1,at=.5}={}){let s=draw(pts,p,{color,w,opacity});if(p>=at+.05&&pts.length>2){const q=along(pts,at);if(q.L>60)s+=fade(opacity,head(q.x,q.y,q.a,color));}return s;}
// Arrow of length L centred on (x,y) pointing along angle a.
const carrow=(x,y,a,L,{color=MX.E,w=4,g=1}={})=>arrow(x-Math.cos(a)*L/2,y-Math.sin(a)*L/2,x+Math.cos(a)*L/2,y+Math.sin(a)*L/2,{color,w,head:Math.min(14,L*.5),g});
// TeX with a dark plate behind it (for labels sitting on field lines).
function plate(src,x,y,size,color){const w=texWidth(src,size,false)+22,h=size*1.35;return rect(x-w/2,y-h*.72,w,h,{fill:MX.bg,fo:.92,stroke:color,sw:2,rx:10})+tx(src,x,y,size,color);}

// ---- scene A: one charge, probed on a grid --------------------------------------------------
const QA={x:404,y:276};
const GX=Array.from({length:11},(_,i)=>110+98*i),GY=[140,208,276,344,412];
const AL=r=>clamp(62*(180/r)**2,10,62);
const P1={x:600,y:276},P2={x:208,y:276},P3={x:110,y:140};
function forceAt(pt,g=1,{color=F,op=1,k=1}={}){const dx=pt.x-QA.x,dy=pt.y-QA.y,r=Math.hypot(dx,dy),ux=dx/r,uy=dy/r,L=AL(r)*k;
 return fade(op,arrow(pt.x+ux*16,pt.y+uy*16,pt.x+ux*(16+L),pt.y+uy*(16+L),{color,w:6,head:Math.min(16,L*.6),g}));}
// The map: arrows on the grid. reveal = radius shown so far; dim = opacity; col = 0 green(force) … 1 blue(field)
function map({reveal=1e9,dim=1,col=1,hl=null,skip=null}={}){let s='';
 for(const x of GX)for(const y of GY){const dx=x-QA.x,dy=y-QA.y,r=Math.hypot(dx,dy);if(r<70)continue;if(skip&&skip.x===x&&skip.y===y)continue;
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

// ---- the bag (closed surface), star-shaped around its charge -------------------------------------
const B={x:800,y:310};
const bagR=(th,w,ph)=>130+w*(12+22*Math.sin(3*th+ph)+13*Math.sin(5*th-1.3*ph)+8*Math.cos(2*th+.7*ph));
const bagPts=(w,ph,n=180,cx=B.x,cy=B.y)=>Array.from({length:n},(_,i)=>{const th=2*Math.PI*i/n,R=bagR(th,w,ph);return [cx+R*Math.cos(th),cy+R*Math.sin(th)];});
const pathOf=P=>`M${P.map(q=>q.map(v=>v.toFixed(1)).join(' ')).join(' L')} Z`;
function bagSvg(w,ph,{g=1,glow=0,cx=B.x,cy=B.y}={}){return fade(g,`<path d="${pathOf(bagPts(w,ph,180,cx,cy))}" fill="#9fb3d6" fill-opacity="${.10+.08*glow}" stroke="${GH}" stroke-width="${3+2*glow}" stroke-dasharray="${w>0?'':''}"/>`);}
// Crossings of a straight ray from (ox,oy) with the bag outline centred at (cx,cy): [{x,y,out}]
function crossings(ox,oy,a,w,ph,cx=B.x,cy=B.y){const P=bagPts(w,ph,240,cx,cy),dx=Math.cos(a),dy=Math.sin(a),res=[];
 for(let i=0;i<P.length;i++){const [x1,y1]=P[i],[x2,y2]=P[(i+1)%P.length],ex=x2-x1,ey=y2-y1,den=dx*ey-dy*ex;if(Math.abs(den)<1e-9)continue;
  const t=((x1-ox)*ey-(y1-oy)*ex)/den,u=((x1-ox)*dy-(y1-oy)*dx)/den;if(t>0&&u>=0&&u<1){const X=ox+dx*t,Y=oy+dy*t;
   // outward if the ray goes from inside to outside: compare the outline radius with the distance from the bag centre
   const nx=-(ey),ny=ex,cxm=(x1+x2)/2-cx,cym=(y1+y2)/2-cy,sgn=(nx*cxm+ny*cym)>0?1:-1;res.push({x:X,y:Y,t,out:(dx*nx+dy*ny)*sgn>0});}}
 return res.sort((p,q)=>p.t-q.t);}
const farT=(ox,oy,a)=>Math.min(...[(Math.cos(a)>0?(1195-ox)/Math.cos(a):(5-ox)/Math.cos(a)),(Math.sin(a)>0?(512-oy)/Math.sin(a):(88-oy)/Math.sin(a))].map(Math.abs));
// Outline split into N pieces for the surface-integral scenes: midpoint, outward normal, piece ends.
function pieces(w,ph,N=24,cx=B.x,cy=B.y){return Array.from({length:N},(_,k)=>{const a0=2*Math.PI*k/N,a1=2*Math.PI*(k+1)/N,am=(a0+a1)/2;
 const p=a=>{const R=bagR(a,w,ph);return [cx+R*Math.cos(a),cy+R*Math.sin(a)];},A=p(a0),Bq=p(a1),M=p(am);
 let tx_=Bq[0]-A[0],ty_=Bq[1]-A[1];const L=Math.hypot(tx_,ty_);tx_/=L;ty_/=L;let nx=ty_,ny=-tx_;if(nx*(M[0]-cx)+ny*(M[1]-cy)<0){nx=-nx;ny=-ny;}
 return {A,B:Bq,M,nx,ny,tx:tx_,ty:ty_,am};});}
// Field of point charges at (x,y), scaled so a lone Q at 140 px gives 40 px.
const KE=40*140*140;
function Efield(x,y,qs){let ex=0,ey=0;for(const c of qs){const dx=x-c.x,dy=y-c.y,r2=dx*dx+dy*dy,r=Math.sqrt(r2);ex+=KE*c.q*dx/(r2*r);ey+=KE*c.q*dy/(r2*r);}return [ex,ey];}

// ---- Gauss formula built from pieces (so each part can be lit on its own) --------------------------
const GS=60,GX0=300,GY0=300;
const GP=[['\\oint',MX.ink],[`{\\color{${MX.E}}\\vec E}`,MX.E],['\\cdot',MX.ink],['d\\vec A',MX.ink],[`=\\dfrac{{\\color{${MX.plus}}Q}}{\\varepsilon_0}`,MX.ink]];
const GW=GP.map(([s])=>texWidth(s,GS,false)),GAP=10,GTOT=GW.reduce((a,b)=>a+b,0)+GAP*(GP.length-1);
const GXS=GW.map((w,i)=>GX0-GTOT/2+GW.slice(0,i).reduce((a,b)=>a+b,0)+GAP*i+w/2);
function gauss(ops){return GP.map(([s,c],i)=>fade(ops[i],tx(s,GXS[i],GY0,GS,c))).join('');}

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

 'mx2-n-place':(p,ctx)=>stage(ctx,p,(()=>{
  const go=smooth(1-ctx.t/.5),gr=G(ctx,'電場を作り'),gn=G(ctx,'そこに来た'),gp=G(ctx,'押すのです'),gP=G(ctx,'場所の性質');
  let s=callout(770,96,400,404,'',go)+map({dim:mix(.3,1,1-go)});
  // the test charge is taken away; the field at that place stays
  s+=fade(.7*(1-G(ctx,'置いた電荷',{d:.8})),probe(P1.x,P1.y+34))+fade(gP*(1-gn),`<circle cx="${P1.x}" cy="${P1.y}" r="34" fill="none" stroke="${MX.hi}" stroke-width="3"/>`);
  const rr=(ctx.t-T(ctx,'電場を作り'))*420;
  if(rr>0&&rr<760)s+=`<circle cx="${QA.x}" cy="${QA.y}" r="${rr}" fill="none" stroke="${MX.E}" stroke-width="4" stroke-opacity="${(.7*(1-rr/760)).toFixed(2)}"/>`;
  s+=charge(QA.x,QA.y,1,{r:28});
  const N={x:600,y:412};s+=probe(N.x,N.y,gn,16)+(gn>0?forceAt(N,gp,{k:1.8}):'');
  s+=fade(gr,label('電荷',760,492,{size:30,color:MX.plus,weight:700})+label('→',840,492,{size:30,color:MX.dim})+label('電場',880,492,{size:30,color:MX.E,weight:700}))
   +fade(gp,label('→',960,492,{size:30,color:MX.dim})+label('力',1000,492,{size:30,color:F,weight:700}));
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

 // ============ 電気力線 ============
 'mx2-n-trace':(p,ctx)=>stage(ctx,p,(()=>{
  const L=dipole(),tr=L[13],t0=T(ctx,'矢印の向きに'),t1=T(ctx,'これを繰り返して'),gl=G(ctx,'電気力線',{d:1.2});
  const u=clamp((ctx.t-t0)/Math.max(1,t1-t0+.6));
  let s=dipGrid(mix(.5,.25,gl))+fade(gl,L.map(l=>fline(l,gl,{opacity:.9})).join(''));
  // the tracer: small steps along the local arrow
  const q=along(tr,u),Ltot=q.L,step=42,n=Math.floor(u*Ltot/step);
  s+=draw(tr,u,{color:MX.hi,w:5});
  for(let i=1;i<=n;i++){const r=along(tr,i*step/Ltot);s+=dot(r.x,r.y,4.5,MX.hi);}
  if(u>0&&u<1)s+=carrow(q.x+Math.cos(q.a)*22,q.y+Math.sin(q.a)*22,q.a,44,{color:W,w:4})+dot(q.x,q.y,8,W);
  s+=charge(DP.x,DP.y,1,{r:28})+charge(DM.x,DM.y,-1,{r:28});
  s+=word('少し進む → 矢印に合わせる → 繰り返す',600,482,{size:26,color:MX.ink,anchor:'middle',g:smooth((ctx.t-t0)/.5)*(1-G(ctx,'電気力線',{d:.3}))});
  s+=word('電気力線',600,482,{size:32,color:MX.E,anchor:'middle',g:G(ctx,'電気力線',{d:.3,off:.1})});
  return s;})()),

 'mx2-n-density':(p,ctx)=>stage(ctx,p,(()=>{
  const gs=G(ctx,'密に描く'),gn=G(ctx,'線が力を');
  let s=dipole().map(l=>fline(l,1)).join('')+charge(DP.x,DP.y,1,{r:28})+charge(DM.x,DM.y,-1,{r:28});
  const lens=(x,y,g,col)=>fade(g,`<circle cx="${x}" cy="${y}" r="42" fill="${col}" fill-opacity=".10" stroke="${col}" stroke-width="4"/>`);
  s+=lens(480,300,gs,MX.hi)+lens(150,300,gs,MX.dim);
  s+=fade(gs,label("強い → 密",480,236,{size:26,color:MX.hi,anchor:'middle',weight:700})+label('弱い → まばら',150,236,{size:26,color:MX.ink,anchor:'middle',weight:700}));
  s+=word('約束：強い所ほど 線を密に描く',600,130,{size:28,color:MX.hi,anchor:'middle',g:gs});
  s+=word('線は 強さの目印（力を生むものではない）',600,482,{size:26,color:MX.ink,anchor:'middle',g:gn});
  return s;})()),

 // ============ 逆二乗を球の面で理解する ============
 'mx2-n-sphere':(p,ctx)=>stage(ctx,p,(()=>{
  const tr=T(ctx,'前後にも'),u=smooth((ctx.t-tr+.2)/1.6),beta=.9*u,alpha=.3*u,gS=G(ctx,'球の面全体');
  const {back,front}=rays3(beta,alpha,{g3:u,dots:gS});
  let s=back+sphereShell(SC.x,SC.y,110,alpha,{g:gS})+charge(SC.x,SC.y,1,{r:22})+front;
  s+=callout(700,110,460,170,tx('F\\propto\\dfrac{1}{r^2}',860,215,46,MX.ink)+label('前の章：',1000,180,{size:24,color:MX.dim})+label('実験で',1000,218,{size:24,color:MX.dim})+label('分かった関係',1000,252,{size:24,color:MX.dim}),smooth(ctx.t/.4));
  s+=word('紙の上だけ？',930,400,{size:28,color:MX.ink,anchor:'middle',g:smooth((ctx.t-.3)/.4)*(1-u)});
  s+=word('前後にも 広がる',930,400,{size:28,color:MX.E,anchor:'middle',g:u*(1-gS)});
  s+=word('球の面全体を つき抜ける',930,400,{size:28,color:MX.hi,anchor:'middle',g:gS});
  return s;})()),

 'mx2-n-two':(p,ctx)=>stage(ctx,p,(()=>{
  const S1={x:210,y:300,R:70},S2={x:540,y:300,R:140},g2=G(ctx,'二倍なら'),ga=G(ctx,'面積は四倍'),gw=G(ctx,'同じ広さの窓'),gc=G(ctx,'四分の一になり'),ge=G(ctx,'電場も');
  const R2=mix(S1.R,S2.R,g2);
  let s=frontSphere(S1.x,S1.y,S1.R)+charge(S1.x,S1.y,1,{r:14})+fade(1,line(S1.x,S1.y,S1.x-S1.R,S1.y,{color:W,w:3})+plate("r",S1.x-S1.R/2,S1.y+40,26,W));
  s+=fade(g2,frontSphere(S2.x,S2.y,R2)+charge(S2.x,S2.y,1,{r:14})+line(S2.x,S2.y,S2.x-R2,S2.y,{color:W,w:3})+plate('2r',S2.x-R2/2,S2.y+30,26,W));
  s+=fade(smooth(ctx.t/.4),label('球の面積',210,130,{size:24,color:MX.dim,anchor:'middle'})+tx('4\\pi r^2',210,178,36,MX.hi));
  s+=word('面積 ×4',S2.x,482,{size:28,color:MX.hi,anchor:'middle',g:ga});
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
  const gw=G(ctx,'平らな窓'),gq=G(ctx,'電場の強さ×面積');
  const {svg,n}=windowScene(0,{count:gw});
  let s=fade(gw,svg);
  if(gw<1)s+=fade(1-gw,LY.flatMap(y=>LZ.map(z=>{const A=pj(-430,y,z),Bp=pj(430,y,z);return arrow(A[0],A[1],Bp[0],Bp[1],{color:MX.E,w:3,head:12,opacity:.8});})).join(''));
  s+=plate('\\vec E',140,170,34,MX.E);
  s+=fade(gw,label('面積 A',WC.x+10,WC.y-150,{size:26,color:MX.hi,anchor:'middle',weight:700})+label(`つき抜ける線 ${n}本`,1000,150,{size:26,color:MX.hi,anchor:'middle',weight:700}));
  s+=word('電場の強さ × 面積',600,482,{size:30,color:MX.hi,anchor:'middle',g:gq});
  return s;})()),

 'mx2-n-window:tilt':(p,ctx)=>stage(ctx,p,(()=>{
  const th=-.96*smooth((ctx.t-T(ctx,'傾けると')+.1)/1.4),gn=G(ctx,'垂直な向き'),gpar=G(ctx,'面に沿う');
  const {svg,n}=windowScene(th,{lineOp:1-.6*gn});
  let s=svg+plate('\\vec E',140,170,34,MX.E)+label(`つき抜ける線 ${n}本`,1000,150,{size:26,color:MX.hi,anchor:'middle',weight:700});
  // decomposition at the window centre (3D vectors projected)
  const sn=Math.sin(th),cs=Math.cos(th),K=300,pv=v=>[v[0]+.45*v[2],-v[1]-.3*v[2]];
  const nrm=[cs,0,-sn],Ep=[K*cs*cs,0,-K*cs*sn],Ea=[K-K*cs*cs,0,K*cs*sn];
  const [nx,ny]=pv(nrm.map(v=>v*170)),[px,py]=pv(Ep),[ax,ay]=pv(Ea),[ex,ey]=pv([K,0,0]);
  s+=fade(gn,line(WC.x,WC.y,WC.x+nx,WC.y+ny,{color:W,w:2,dash:'6 6'})+arrow(WC.x,WC.y,WC.x+ex,WC.y+ey,{color:MX.E,w:3,head:12,opacity:.5})+arrow(WC.x,WC.y,WC.x+px,WC.y+py,{color:MX.hi,w:7,head:18}));
  s+=fade(gn,label('垂直な成分',WC.x+px+14,WC.y+py-20,{size:26,color:MX.hi,weight:700}));
  s+=fade(gpar,arrow(WC.x,WC.y,WC.x+ax,WC.y+ay,{color:MX.dim,w:5,head:14})+label('面に沿う成分：すべるだけ',WC.x+ax+14,WC.y+ay+34,{size:24,color:MX.dim}));
  s+=word('効くのは 垂直な成分だけ',600,482,{size:28,color:MX.hi,anchor:'middle',g:gn});
  return s;})()),

 'mx2-n-pieces':(p,ctx)=>stage(ctx,p,(()=>{
  const w=1,ph=2.4,gb=G(ctx,'閉じた面'),gc=G(ctx,'細かく分け'),gd=G(ctx,'一つの小片'),gn=G(ctx,'外向き');
  const PC=pieces(w,ph),K=0,pc=PC[K],Q=[{x:B.x,y:B.y,q:1}];
  let s=bagSvg(w,ph,{g:gb})+charge(B.x,B.y,1,{r:24})+fade(gb,label('Q',B.x+28,B.y-24,{size:28,color:MX.plus,weight:700}));
  s+=fade(gc,PC.map(q=>line(q.A[0]-q.nx*9,q.A[1]-q.ny*9,q.A[0]+q.nx*9,q.A[1]+q.ny*9,{color:GH,w:3})).join(''));
  s+=fade(gc*(1-.6*gd),PC.map(q=>{const [ex,ey]=Efield(q.M[0],q.M[1],Q),m=Math.hypot(ex,ey);return carrow(q.M[0]+ex/m*m/2,q.M[1]+ey/m*m/2,Math.atan2(ey,ex),m,{color:MX.E,w:3});}).join(''));
  s+=fade(gd,line(pc.A[0],pc.A[1],pc.B[0],pc.B[1],{color:MX.hi,w:9})+plate('dA',pc.M[0]-pc.nx*52,pc.M[1]-pc.ny*52+10,28,MX.hi));
  s+=fade(gn,arrow(pc.M[0],pc.M[1],pc.M[0]+pc.nx*90,pc.M[1]+pc.ny*90,{color:W,w:4,head:14}));
  s+=callout(40,120,520,300,'',gb);
  s+=fade(gb,label('電荷を包む 閉じた面',300,172,{size:28,color:GH,anchor:'middle',weight:700}));
  s+=fade(gd,label('① 小片の面積：dA',80,250,{size:28,color:MX.hi,weight:700}));
  s+=fade(gn,label('② 向き：面に垂直・外向き',80,320,{size:28,color:W,weight:700}));
  return s;})()),

 'mx2-n-pieces:sign':(p,ctx)=>stage(ctx,p,(()=>{
  const w=1,ph=2.4,PC=pieces(w,ph),K=0,pc=PC[K],Q=[{x:B.x,y:B.y,q:1}],gp=G(ctx,'垂直な成分'),gs=G(ctx,'外向きなら');
  let s=bagSvg(w,ph)+charge(B.x,B.y,1,{r:24})+label('Q',B.x+28,B.y-24,{size:28,color:MX.plus,weight:700});
  s+=PC.map(q=>line(q.A[0]-q.nx*9,q.A[1]-q.ny*9,q.A[0]+q.nx*9,q.A[1]+q.ny*9,{color:GH,w:3})).join('');
  s+=fade(.35,PC.map(q=>{const [ex,ey]=Efield(q.M[0],q.M[1],Q),m=Math.hypot(ex,ey);return carrow(q.M[0]+ex/2,q.M[1]+ey/2,Math.atan2(ey,ex),m,{color:MX.E,w:3});}).join(''));
  s+=line(pc.A[0],pc.A[1],pc.B[0],pc.B[1],{color:MX.hi,w:9})+line(pc.M[0],pc.M[1],pc.M[0]+pc.nx*130,pc.M[1]+pc.ny*130,{color:W,w:2,dash:'6 6'});
  // E at the piece, split into the normal part and the part along the surface
  const [ex,ey]=Efield(pc.M[0],pc.M[1],Q),k=3.2,EX=ex*k,EY=ey*k,en=EX*pc.nx+EY*pc.ny,et=EX*pc.tx+EY*pc.ty;
  s+=arrow(pc.M[0],pc.M[1],pc.M[0]+EX,pc.M[1]+EY,{color:MX.E,w:4,head:14,opacity:mix(1,.45,gp)});
  s+=fade(gp,arrow(pc.M[0],pc.M[1],pc.M[0]+pc.nx*en,pc.M[1]+pc.ny*en,{color:MX.hi,w:7,head:16})+line(pc.M[0]+pc.nx*en,pc.M[1]+pc.ny*en,pc.M[0]+EX,pc.M[1]+EY,{color:MX.dim,w:2,dash:'4 5'}));
  s+=callout(40,120,520,370,'');
  s+=label('小片ごとに',300,170,{size:26,color:MX.dim,anchor:'middle'});
  s+=fade(gp,tx(`{\\color{${MX.hi}}E_{\\perp}}\\times dA`,300,236,46,MX.ink)+label('③ 垂直な成分 × 面積',300,296,{size:26,color:MX.hi,anchor:'middle',weight:700}));
  // sign rule: two little pieces
  const mini=(y,out,lab,col)=>line(150,y-34,150,y+34,{color:GH,w:6})+line(150,y,215,y,{color:W,w:2,dash:'5 5'})+(out?arrow(150,y,235,y,{color:col,w:6,head:16}):arrow(235,y,156,y,{color:col,w:6,head:16}))+label(lab,270,y+10,{size:28,color:col,weight:700});
  s+=fade(gs,mini(360,1,'外向き → ＋',MX.hi)+mini(445,0,'内向き → −',MX.minus));
  return s;})()),

 'mx2-n-pieces:sum':(p,ctx)=>stage(ctx,p,(()=>{
  const w=1,ph=2.4,PC=pieces(w,ph),Q=[{x:B.x,y:B.y,q:1}],t0=T(ctx,'全部の小片'),u=clamp((ctx.t-t0+.2)/2.4),gn=G(ctx,'電気束と'),gf=G(ctx,'何かが流れ');
  let s=bagSvg(w,ph,{glow:gn})+charge(B.x,B.y,1,{r:24})+label('Q',B.x+28,B.y-24,{size:28,color:MX.plus,weight:700});
  s+=PC.map((q,i)=>{const lit=u>0&&i<u*PC.length,[ex,ey]=Efield(q.M[0],q.M[1],Q),m=Math.hypot(ex,ey);
   return line(q.A[0]-q.nx*9,q.A[1]-q.ny*9,q.A[0]+q.nx*9,q.A[1]+q.ny*9,{color:GH,w:3})+(lit?line(q.A[0],q.A[1],q.B[0],q.B[1],{color:MX.hi,w:7}):'')
    +carrow(q.M[0]+ex/2,q.M[1]+ey/2,Math.atan2(ey,ex),m,{color:lit?MX.hi:MX.E,w:lit?5:3});}).join('');
  s+=callout(40,120,520,370,'');
  s+=label('④ 全部の小片で足す',300,172,{size:28,color:MX.hi,anchor:'middle',weight:700});
  s+=fit(`{\\color{${MX.hi}}E_{\\perp}}dA+{\\color{${MX.hi}}E_{\\perp}}dA+\\cdots`,300,240,460,40,{color:MX.ink});
  s+=fade(gn,tx(`\\Phi_E`,160,330,50,MX.E)+label('電気束',230,342,{size:36,color:MX.E,weight:700}));
  s+=fade(gf,label('流れ出る物ではない。',300,410,{size:26,color:MX.dim,anchor:'middle'})+label('つき抜ける電場を数えた量',300,454,{size:26,color:MX.ink,anchor:'middle',weight:700}));
  return s;})()),

 // ============ 確認：一様な電場の中の箱 ============
 'mx2-n-box':(p,ctx)=>stage(ctx,p,(()=>boxScene(ctx,{q:G(ctx,'箱全体'),gb:G(ctx,'箱を置く')}))()),
 'mx2-n-box:answer':(p,ctx)=>stage(ctx,p,(()=>boxScene(ctx,{q:1-smooth(ctx.t/.4),gb:1,gl:G(ctx,'左の面'),gr:G(ctx,'右の面'),go:G(ctx,'残りの面'),gs:G(ctx,'合計は')}))()),

 // ============ 点電荷の球 → ガウスの法則 ============
 'mx2-n-ball':(p,ctx)=>stage(ctx,p,(()=>{
  const gr=G(ctx,'半径 r'),ga=G(ctx,'どこも外向き'),gE=G(ctx,'強さは');
  let s=ballScene(130,{ga,gr});
  s+=callout(40,120,520,330,'',gE);
  s+=fade(gE,tx(`{\\color{${MX.E}}E}=\\dfrac{{\\color{${MX.plus}}Q}}{4\\pi\\varepsilon_0 r^2}`,300,240,52,MX.ink)+label('前の章のクーロンの法則から',300,340,{size:24,color:MX.dim,anchor:'middle'})+label('（k を 1/4πε₀ と書いた形）',300,384,{size:24,color:MX.dim,anchor:'middle'}));
  return s;})()),

 'mx2-n-ball:flux':(p,ctx)=>stage(ctx,p,(()=>{
  const g1=smooth(ctx.t/.4),g2=G(ctx,'四パイも'),g3=G(ctx,'Q 割る'),gz=G(ctx,'球の大きさ');
  const R=130*(1+.28*Math.sin(Math.max(0,ctx.t-T(ctx,'球の大きさ'))*2.4)*gz);
  let s=ballScene(R,{ga:1,gr:1});
  s+=callout(40,120,520,370,'');
  s+=fade(g1,fit(`\\Phi_E={\\color{${MX.E}}E}\\times 4\\pi r^2`,300,175,400,40,{color:MX.ink}));
  s+=fade(g2,fit(`=\\dfrac{{\\color{${MX.plus}}Q}}{\\cancel{4\\pi}\\,\\varepsilon_0\\cancel{r^2}}\\times\\cancel{4\\pi}\\,\\cancel{r^2}`,300,300,440,36,{color:MX.ink}));
  s+=fade(g3,tx(`=\\dfrac{{\\color{${MX.plus}}Q}}{\\varepsilon_0}`,230,420,46,MX.hi));
  s+=word('半径によらない',330,425,{size:24,color:MX.hi,anchor:'start',g:gz});
  return s;})()),

 'mx2-n-bag':(p,ctx)=>stage(ctx,p,(()=>{
  const ph=2.4,gi=G(ctx,'想像上'),gc=G(ctx,'さえぎりません'),w=G(ctx,'形を変えても',{d:.9}),gm=G(ctx,'動かしても'),gq=G(ctx,'電気束は同じ');
  const tm=Math.max(0,ctx.t-T(ctx,'動かしても')),ox=B.x+gm*36*Math.sin(tm*1.6),oy=B.y+gm*22*Math.sin(tm*1.1);
  let s='',net=0;
  for(let k=0;k<12;k++){const a=2*Math.PI*(k+.5)/12,far=farT(B.x,B.y,a);s+=fline([[B.x+22*Math.cos(a),B.y+22*Math.sin(a)],[B.x+far*Math.cos(a),B.y+far*Math.sin(a)]],1,{at:.8,opacity:.85});}
  s+=bagSvg(w,ph,{cx:ox,cy:oy,glow:gi*.6});
  for(let k=0;k<12;k++){const a=2*Math.PI*(k+.5)/12;for(const c of crossings(B.x,B.y,a,w,ph,ox,oy)){net+=c.out?1:-1;s+=c.out?dot(c.x,c.y,7,MX.hi):ring(c.x,c.y,7,{color:MX.hi,w:3,fill:MX.bg});}}
  s+=charge(B.x,B.y,1,{r:24})+label('Q',B.x+28,B.y-24,{size:28,color:MX.plus,weight:700});
  s+=callout(40,120,500,370,'');
  s+=fade(gi,label('想像上の面',290,180,{size:34,color:GH,anchor:'middle',weight:700})+label('数える場所を決めるだけ',290,225,{size:24,color:MX.dim,anchor:'middle'}));
  s+=fade(gc,label('電場をさえぎらない',290,300,{size:28,color:MX.E,anchor:'middle',weight:700})+label('電荷も線も そのまま',290,342,{size:24,color:MX.dim,anchor:'middle'}));
  s+=fade(gq,label(`つき抜ける線 ${net}本`,290,400,{size:32,color:MX.hi,anchor:'middle',weight:700})+tx('\\Phi_E=\\dfrac{Q}{\\varepsilon_0}',290,462,30,MX.hi));
  return s;})()),

 'mx2-n-outside':(p,ctx)=>stage(ctx,p,(()=>{
  const w=1,ph=2.4,gm=G(ctx,'近づけると',{d:1.8}),ge=G(ctx,'面の上の電場'),gi=G(ctx,'入った分'),gz=G(ctx,'電気束は変わりません');
  const O={x:mix(110,470,gm),y:mix(150,215,gm)},go=smooth(ctx.t/.5),qs=[{x:B.x,y:B.y,q:1},{x:O.x,y:O.y,q:go}];
  let s='';
  for(let k=0;k<12;k++){const a=2*Math.PI*(k+.5)/12,far=farT(B.x,B.y,a);s+=fline([[B.x+22*Math.cos(a),B.y+22*Math.sin(a)],[B.x+far*Math.cos(a),B.y+far*Math.sin(a)]],1,{at:.8,opacity:.35});}
  s+=bagSvg(w,ph);
  let nin=0,nout=0,marks='';
  for(let k=0;k<16;k++){const a=2*Math.PI*(k+.5)/16,far=farT(O.x,O.y,a);
   s+=fline([[O.x+20*Math.cos(a),O.y+20*Math.sin(a)],[O.x+far*Math.cos(a),O.y+far*Math.sin(a)]],go,{color:'#b9e6ff',w:2.5,opacity:.7,at:.2});
   for(const c of crossings(O.x,O.y,a,w,ph)){if(c.out)nout++;else nin++;marks+=c.out?dot(c.x,c.y,7,W):ring(c.x,c.y,7,{color:W,w:3,fill:MX.bg});}}
  // total field on the surface: it does change as the outside charge comes closer
  s+=pieces(w,ph,16).map(q=>{const [ex,ey]=Efield(q.M[0],q.M[1],qs),m=Math.min(80,Math.hypot(ex,ey));return arrow(q.M[0],q.M[1],q.M[0]+ex/Math.hypot(ex,ey)*m,q.M[1]+ey/Math.hypot(ex,ey)*m,{color:ge>.5?MX.hi:MX.E,w:4,head:12,opacity:mix(.6,1,ge)});}).join('');
  s+=fade(gi,marks)+charge(B.x,B.y,1,{r:24})+charge(O.x,O.y,1,{r:22,g:go});
  s+=word('外の電荷',O.x,O.y-46,{size:26,color:MX.ink,anchor:'middle',g:go});
  s+=word('面の上の電場は 変わる',1000,120,{size:26,color:MX.hi,anchor:'middle',g:ge});
  s+=callout(40,300,400,205,'',gi);
  s+=fade(gi,ring(70,345,9,{color:W,w:3})+label(`入る ${nin}本`,90,356,{size:30,color:MX.ink,weight:700})+dot(250,345,9,W)+label(`出る ${nout}本`,270,356,{size:30,color:MX.ink,weight:700}));
  s+=fade(gz,label('外の電荷の分：差し引き 0',240,420,{size:28,color:MX.hi,anchor:'middle',weight:700})+tx('\\Phi_E=\\dfrac{Q}{\\varepsilon_0}',160,470,30,MX.hi)+label('のまま',250,488,{size:26,color:MX.hi,weight:700}));
  return s;})()),

 'mx2-n-gauss':(p,ctx)=>stage(ctx,p,(()=>{
  const w=1,ph=2.4,gL=G(ctx,'閉じた面の電気束'),gR=G(ctx,'中の電荷を'),gN=G(ctx,'ガウスの法則'),g0=smooth(1-ctx.t/.5);
  let s=bagSvg(w,ph)+charge(B.x,B.y,1,{r:24})+label('Q',B.x+28,B.y-24,{size:28,color:MX.plus,weight:700});
  s+=pieces(w,ph,16).map(q=>{const [ex,ey]=Efield(q.M[0],q.M[1],[{x:B.x,y:B.y,q:1}]),m=Math.hypot(ex,ey);return arrow(q.M[0],q.M[1],q.M[0]+ex,q.M[1]+ey,{color:MX.E,w:4,head:12});}).join('');
  s+=fade(g0,charge(470,215,1,{r:22}));
  s+=gauss([gL,gL,gL,gL,gR]);
  s+=fade(gL,label('電気束',GXS[0]+40,GY0+90,{size:28,color:MX.E,anchor:'middle',weight:700}))+fade(gR,label('中の電荷 ÷ ε₀',GXS[4],GY0+90,{size:26,color:MX.plus,anchor:'middle',weight:700}));
  s+=word('ガウスの法則',GX0,470,{size:32,color:MX.hi,anchor:'middle',g:gN});
  s+=fade(gN,line(GX0-60,GY0-60,120,74,{color:MX.hi,w:3,dash:'9 7'})+dot(120,74,6,MX.hi));
  return s;})()),

 'mx2-n-gauss:read':(p,ctx)=>stage(ctx,p,(()=>{
  const w=1,ph=2.4,PC=pieces(w,ph,16),K=0,pc=PC[K],Q=[{x:B.x,y:B.y,q:1}];
  const gA=G(ctx,'dA'),gD=G(ctx,'点は'),gS=G(ctx,'積分記号'),gR=G(ctx,'読めなかった');
  // light only the part being read: dA → (E·) → ∮ ; at the end all
  const on=[gS,gD*(1-gS),gD*(1-gS),gA*(1-gD),0];
  let s=bagSvg(w,ph)+charge(B.x,B.y,1,{r:24})+label('Q',B.x+28,B.y-24,{size:28,color:MX.plus,weight:700});
  const [ex,ey]=Efield(pc.M[0],pc.M[1],Q);
  s+=PC.map((q,i)=>{const [fx,fy]=Efield(q.M[0],q.M[1],Q);return arrow(q.M[0],q.M[1],q.M[0]+fx,q.M[1]+fy,{color:MX.E,w:3,head:10,opacity:.5});}).join('');
  s+=fade(gA*(1-gS),line(pc.A[0],pc.A[1],pc.B[0],pc.B[1],{color:MX.hi,w:9})+arrow(pc.M[0],pc.M[1],pc.M[0]+pc.nx*80,pc.M[1]+pc.ny*80,{color:W,w:4,head:14}));
  const en=(ex*pc.nx+ey*pc.ny)*2;
  s+=fade(gD*(1-gS),arrow(pc.M[0],pc.M[1],pc.M[0]+pc.nx*en,pc.M[1]+pc.ny*en,{color:MX.hi,w:7,head:16}));
  const u=clamp((ctx.t-T(ctx,'全部の小片'))/2.2);
  s+=PC.map((q,i)=>u>0&&i<u*PC.length?line(q.A[0],q.A[1],q.B[0],q.B[1],{color:MX.hi,w:7}):'').join('');
  s+=gauss(on.map((a,i)=>mix(.3,1,Math.max(a,gR))));
  const box=(i,g,lab)=>fade(g,rect(GXS[i]-GW[i]/2-10,GY0-62,GW[i]+20,96,{fill:MX.hi,fo:.1,stroke:MX.hi,sw:3,rx:10})+label(lab,GXS[i],GY0+90,{size:26,color:MX.hi,anchor:'middle',weight:700}));
  s+=box(3,gA*(1-gD),'面積と外向き')+box(2,gD*(1-gS),'垂直な成分')+box(0,gS*(1-gR),'全部で足す');
  s+=word('＝ つき抜ける線の数え方',GX0,470,{size:30,color:MX.E,anchor:'middle',g:gR});
  return s;})()),
};

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

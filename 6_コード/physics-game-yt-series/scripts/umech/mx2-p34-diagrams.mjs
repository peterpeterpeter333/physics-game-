// Diagrams for the v2 Maxwell film, part p34 (chapter 3 magnets / Gauss's law for B,
// chapter 4 current → magnetic field / Ampère's law). Keys: 'mx3-n-*', 'mx4-n-*'.
// Stage 1200×515; the compact progress bar uses y 0–72, pictures use y 85–515.
// Chapter 3 base: one bar magnet (S left, N right). Its field is modelled by pole sheets on the
// two end faces; closed loops are completed through the interior from S to N.
// Chapter 4 base: a vertical wire (current up) through a horizontal plate seen obliquely
// (plate coordinates X right, Z toward the viewer). B = ŷ × r̂ → horizontal direction (Z,−X):
// counter-clockwise seen from above, so on the front of a ring it points to the right.
import {MX,C,clamp,mix,smooth,fade,label,line,dot,ring,draw,arrow,tex,texWidth,stage,word,callout,causal,check,charge,compass,fieldLines,fit,evidenceCard} from './mx-common.mjs';

// ---- timing: elements appear when the narration reaches a word of the reading ----------
const VE=ctx=>Math.max(.6,ctx.dur-(ctx.cue?.pause??0)-.12);
function at(ctx,kw,n=1){const r=ctx.cue?.reading??'';let i=-1;for(let k=0;k<n;k++){i=r.indexOf(kw,i+1);if(i<0)throw Error(`mx2p34: "${kw}" not in reading: ${r}`);}return VE(ctx)*i/r.length;}
const on=(ctx,kw,d=.45,n=1)=>smooth(clamp((ctx.t-at(ctx,kw,n))/d));
const since=(ctx,kw,n=1)=>ctx.t-at(ctx,kw,n);
const hexRGB=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const mixC=(a,b,u)=>{const A=hexRGB(a),B=hexRGB(b);return '#'+A.map((v,i)=>Math.round(mix(v,B[i],clamp(u))).toString(16).padStart(2,'0')).join('');};
const head=(x,y,a,color=MX.B,s=13)=>`<polygon points="${x+s*Math.cos(a)},${y+s*Math.sin(a)} ${x-s*.7*Math.cos(a)+s*.6*Math.sin(a)},${y-s*.7*Math.sin(a)-s*.6*Math.cos(a)} ${x-s*.7*Math.cos(a)-s*.6*Math.sin(a)},${y-s*.7*Math.sin(a)+s*.6*Math.cos(a)}" fill="${color}"/>`;
const cB=v=>`{\\color{${MX.B}}${v}}`,cI=v=>`{\\color{${MX.I}}${v}}`;
const DIM='#56637d';
const panel=(g,inner,{x=740,y=95,w=440,h=405}={})=>callout(x,y,w,h,inner,g);

// =====================================================================================
// Chapter 3: bar magnet
// =====================================================================================
const M={x:600,y:322,w:280,h:80};const ML=M.x-M.w/2,MR=M.x+M.w/2,MT=M.y-M.h/2,MB=M.y+M.h/2;
const POLES=[];for(let i=0;i<9;i++){const y=MT+4+(M.h-8)*i/8;POLES.push([MR,y,1/9],[ML,y,-1/9]);}
function Bf(x,y){let bx=0,by=0;for(const [px,py,q] of POLES){const dx=x-px,dy=y-py,r2=dx*dx+dy*dy+4,r3=r2*Math.sqrt(r2);bx+=q*dx/r3;by+=q*dy/r3;}return [bx,by];}
const inMag=(x,y,m=1)=>x>=ML-m&&x<=MR+m&&y>=MT-m&&y<=MB+m;
function trace(x,y){const pts=[[x,y]];for(let i=0;i<3000;i++){let [bx,by]=Bf(x,y);let m=Math.hypot(bx,by);const hx=x+1.5*bx/m,hy=y+1.5*by/m;[bx,by]=Bf(hx,hy);m=Math.hypot(bx,by);x+=3*bx/m;y+=3*by/m;pts.push([x,y]);
 if(inMag(x,y))return {pts,closed:x<M.x};if(x<-60||x>1260||y<40||y>580)return {pts,closed:false};}return {pts,closed:false};}
const LOOP_X=[736,714,688];
const LOOPS=[];
LOOP_X.forEach((x0,i)=>{for(const s of [-1,1]){
 const r=trace(x0,s<0?MT-1:MB+1);if(!r.closed)continue;
 const out=r.pts.map(([x,y])=>[x,y]),end=out[out.length-1],yi=M.y+s*(8+i*14);
 const inner=[[end[0],s<0?MT:MB],[end[0]+6,yi],[x0-6,yi],[x0,s<0?MT:MB]];
 LOOPS.push({out,inner,all:[...out,...inner.slice(1)]});
}});
const OPEN0=[M.y-30,M.y-20,M.y+20,M.y+30].map(y0=>trace(MR+2,y0).pts);
const OPEN=[...OPEN0,...OPEN0.map(pts=>pts.map(([x,y])=>[2*M.x-x,y]).reverse())];
const len=pts=>{let L=0;for(let i=1;i<pts.length;i++)L+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);return L;};
function pointAt(pts,u){const L=len(pts)*(((u%1)+1)%1);let a=0;for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);if(a+d>=L){const v=(L-a)/Math.max(d,1e-6);return [mix(pts[i-1][0],pts[i][0],v),mix(pts[i-1][1],pts[i][1],v),Math.atan2(pts[i][1]-pts[i-1][1],pts[i][0]-pts[i-1][0])];}a+=d;}const q=pts[pts.length-1];return [q[0],q[1],0];}
const clipDef=`<defs><clipPath id="mx34stage"><rect x="0" y="84" width="1200" height="431"/></clipPath></defs>`;
function lines3({p=1,op=1,heads=0,flow=0,w=4,open=true}={}){
 let s='';const all=[...LOOPS.map(l=>l.out),...(open?OPEN:[])];
 for(const pts of all){s+=draw(pts,p,{color:MX.B,w,opacity:op});
  if(heads>0){for(const u of [.3,.7]){const [x,y,a]=pointAt(pts,u+flow*.04);if(y>92)s+=fade(heads*op,head(x,y,a));}}}
 return `<g clip-path="url(#mx34stage)">${clipDef}${s}</g>`;
}
// Iron filings on a jittered grid (deterministic).
let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const FIL=[];for(let y=104;y<506;y+=22)for(let x=18;x<1190;x+=24){const px=x+rnd()*14,py=y+rnd()*12;if(inMag(px,py,10))continue;const [bx,by]=Bf(px,py);FIL.push({x:px,y:py,a0:rnd()*Math.PI,a1:Math.atan2(by,bx),str:Math.hypot(bx,by),d:rnd()});}
function filings(fall,align,op=1){if(fall<=0||op<=0)return '';let s='';
 for(const f of FIL){const g=clamp(fall*1.6-f.d*.6);if(g<=0)continue;let da=f.a1-f.a0;da=((da+Math.PI/2)%Math.PI+Math.PI)%Math.PI-Math.PI/2;
  const a=f.a0+da*clamp(align*1.4-f.d*.4),y=f.y-40*(1-g),L=7,c=Math.cos(a)*L,sn=Math.sin(a)*L,o=g*op*(.35+.65*clamp(f.str*9000));
  s+=`<line x1="${(f.x-c).toFixed(1)}" y1="${(y-sn).toFixed(1)}" x2="${(f.x+c).toFixed(1)}" y2="${(y+sn).toFixed(1)}" stroke="#c9d1de" stroke-width="3" stroke-linecap="round" opacity="${o.toFixed(2)}"/>`;}
 return s;}
function bar(x,y,w,h,{op=1,left=MX.minus,right=MX.plus,labels=true,size=34}={}){
 return fade(op,`<rect x="${x-w/2}" y="${y-h/2}" width="${w/2}" height="${h}" fill="${left}" rx="5"/><rect x="${x}" y="${y-h/2}" width="${w/2}" height="${h}" fill="${right}" rx="5"/>`
  +(labels?label('S',x-w/4,y+size*.36,{size,color:'#fff',anchor:'middle',weight:700})+label('N',x+w/4,y+size*.36,{size,color:'#fff',anchor:'middle',weight:700}):''));}
const magBase=(op=1)=>bar(M.x,M.y,M.w,M.h,{op});
const paper=g=>fade(g,`<rect x="40" y="${mix(-300,95,g)}" width="1120" height="412" rx="6" fill="${MX.paper}" fill-opacity=".10" stroke="${MX.paper}" stroke-opacity=".35" stroke-width="2"/>`);
function magTranslucent(op){return fade(op,`<rect x="${ML}" y="${MT}" width="${M.w/2}" height="${M.h}" fill="${MX.minus}" fill-opacity=".45" rx="5"/><rect x="${M.x}" y="${MT}" width="${M.w/2}" height="${M.h}" fill="${MX.plus}" fill-opacity=".45" rx="5"/>`);}
const poleLabels=()=>label('S',ML-26,M.y+12,{size:34,color:MX.minus,anchor:'middle',weight:700})+label('N',MR+26,M.y+12,{size:34,color:MX.plus,anchor:'middle',weight:700});
// Loops with the interior drawn and dots circulating along B (S→N inside, N→S outside).
function loops3({inner=1,dots=0,T=0,op=1,glow=0,only=-1,heads=0}={}){let s='';
 LOOPS.forEach((l,i)=>{const o=only<0||only===i?op:op*.22;
  if(glow>0&&(only<0||only===i))s+=draw(l.all,1,{color:MX.B,w:12,opacity:.18*glow});
  s+=draw(l.out,1,{color:MX.B,w:4,opacity:o});
  if(inner>0)s+=draw(l.inner,inner,{color:MX.B,w:4,opacity:o});
  if(heads>0)for(const u of [.25,.6]){const [x,y,a]=pointAt(l.out,u);s+=fade(heads*o,head(x,y,a));}
  if(dots>0&&(only<0||only===i)){const L=len(l.all);for(let k=0;k<3;k++){const [x,y]=pointAt(l.all,k/3+T*110/L);s+=fade(dots,dot(x,y,6,MX.hi));}}});
 return s;}
// Pieces after cutting. level L: 2^L pieces; u = split progress; cu = colour of the new faces.
function pieces(L,u,cu){const n=2**L,w=M.w/n,gaps=[0,46,26,14],G=gaps[L];let s='';
 const pg=gaps[L-1]??0,np=n/2,pw=M.w/np;
 for(let j=0;j<np;j++){const pc=M.x+(j-(np-1)/2)*(pw+pg);
  for(const side of [-1,1]){
   const x=pc+side*(w/2)+side*u*G/2;
   const l=side<0?MX.minus:mixC(MX.plus,MX.minus,cu),r=side<0?mixC(MX.minus,MX.plus,cu):MX.plus;
   const lab=L<=2,size=L===1?30:24;
   s+=bar(x,M.y,w,M.h,{left:l,right:r,labels:false});
   if(lab){s+=label('S',x-w/4,M.y+size*.36,{size,color:'#fff',anchor:'middle',weight:700,opacity:side<0?1:cu})+label('N',x+w/4,M.y+size*.36,{size,color:'#fff',anchor:'middle',weight:700,opacity:side<0?cu:1});}
  }}
 return s;}
// Closed bag (Gaussian surface) centred at (cx,cy); wobble changes its shape.
const BR=86;
const bagR=(a,ph,wob)=>BR*(1+wob*(.2*Math.sin(3*a+ph)+.12*Math.sin(2*a-1.7*ph+1)));
function bagPath(cx,cy,ph,wob){const pts=[];for(let i=0;i<=120;i++){const a=2*Math.PI*i/120,r=bagR(a,ph,wob);pts.push([cx+r*Math.cos(a),cy+r*Math.sin(a)]);}return pts;}
function crossings(cx,cy,ph,wob,only=-1){const res=[];const ins=([x,y])=>Math.hypot(x-cx,y-cy)<bagR(Math.atan2(y-cy,x-cx),ph,wob);
 LOOPS.forEach((l,li)=>{if(only>=0&&li!==only)return;const P=l.all;for(let i=1;i<P.length;i++){const a=ins(P[i-1]),b=ins(P[i]);if(a!==b){let lo=0,hi=1;for(let k=0;k<12;k++){const m=(lo+hi)/2,q=[mix(P[i-1][0],P[i][0],m),mix(P[i-1][1],P[i][1],m)];if(ins(q)===a)lo=m;else hi=m;}
  res.push({x:mix(P[i-1][0],P[i][0],lo),y:mix(P[i-1][1],P[i][1],lo),a:Math.atan2(P[i][1]-P[i-1][1],P[i][0]-P[i-1][0]),out:a&&!b});}}});
 const ang=c=>((Math.atan2(c.y-cy,c.x-cx)+Math.PI/2)%(2*Math.PI)+2*Math.PI)%(2*Math.PI);
 return res.sort((a,b)=>ang(a)-ang(b));}
const OUTC=MX.good,INC='#ff9ce6';
// Crossing marks: a short field arrow through the surface + a coloured dot (green out, pink in).
function marks(cr,g,{arrows=true}={}){return fade(g,cr.map(c=>(arrows?arrow(c.x-20*Math.cos(c.a),c.y-20*Math.sin(c.a),c.x+26*Math.cos(c.a),c.y+26*Math.sin(c.a),{color:MX.B,w:4,head:12}):'')+`<circle cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="8" fill="${c.out?OUTC:INC}" stroke="#0d1526" stroke-width="2"/>`).join(''));}
function bagSvg(cx,cy,ph,wob,g=1){const bp=bagPath(cx,cy,ph,wob);return draw(bp,g,{color:'#ffffff',w:4,dash:'12 7'})+fade(g,`<polygon points="${bp.map(q=>q.map(v=>v.toFixed(1)).join(',')).join(' ')}" fill="#ffffff" fill-opacity=".06"/>`);}
const BAG0=[MR-5,M.y];
// Compass positions on the paper for chapter 3.
const CMP=[[MR+80,M.y],[ML-80,M.y],[M.x,MT-80],[M.x,MB+80],[MR+60,MT-70],[ML-60,MT-70],[MR+60,MB+70],[ML-60,MB+70],[M.x+170,MT-150],[M.x-170,MT-150],[M.x+170,MB+130],[M.x-170,MB+130],[MR+170,M.y],[ML-170,M.y]];
const bAng=(x,y)=>{const [bx,by]=Bf(x,y);return Math.atan2(-by,bx)*180/Math.PI;};
function swing(a0,a1,t,t0){if(t<t0)return a0;const u=t-t0;let d=a1-a0;d=((d+180)%360+360)%360-180;return a1-d*Math.exp(-2.6*u)*Math.cos(7*u);}

// =====================================================================================
// Chapter 4: wire through a plate
// =====================================================================================
const P4={cx:400,cy:390,rx:300,k:.367};
const pj=(X,Z)=>[P4.cx+X,P4.cy+P4.k*Z];
const RC=170,PHI=[0,1,2,3,4,5,6].map(i=>Math.PI/2+i*2*Math.PI/7);
function plate(){return `<ellipse cx="${P4.cx}" cy="${P4.cy}" rx="${P4.rx}" ry="${P4.rx*P4.k}" fill="#1b2a4a" fill-opacity=".85" stroke="#3b4f78" stroke-width="3"/>`;}
function wireLower(c){return line(P4.cx,P4.cy,P4.cx,510,{color:mixC('#6c7a94',MX.I,c),w:12,opacity:.45});}
// dir: +1 current up (arrowhead at the top), −1 current down (arrowhead pointing down at the top).
function wireUpper(c,T,{glow=0,I=1,top=150,dir=1,x=P4.cx,y0=P4.cy,lab='I'}={}){const col=mixC('#6c7a94',MX.I,c);let s='';
 if(glow>0)s+=line(x,top,x,y0,{color:MX.I,w:34,opacity:.25*glow});
 s+=`<ellipse cx="${x}" cy="${y0}" rx="11" ry="4" fill="#0d1526"/>`+line(x,top,x,y0,{color:col,w:12*(I>1?1.4:1)});
 if(c>0){const H=y0-top;for(let k=0;k<4;k++){const ph=((T*90+k*60)%240)/240*H;const y=dir>0?y0-ph:top+ph;if(y>top+10&&y<y0-4)s+=fade(c,line(x,y,x,y-18*dir,{color:'#fff7c2',w:4}));}
  s+=fade(c,(dir>0?`<polygon points="${x},${top-22} ${x-17},${top+8} ${x+17},${top+8}" fill="${MX.I}"/>`:`<polygon points="${x},${top+14} ${x-17},${top-16} ${x+17},${top-16}" fill="${MX.I}"/>`)+(lab?tex(lab,x+34,top+8,{size:36,color:MX.I,auto:false}):''));}
 return s;}
// Needle angle at plate point (X,Z): current field (Z,−X) plus a weak earth field (0,−1).
function needle(X,Z,c,ratio=12){const r=Math.hypot(X,Z),bw=c*ratio*RC/r;const bx=bw*Z/r,bz=-bw*X/r-1;return Math.atan2(-P4.k*bz,bx)*180/Math.PI;}
function compassAt(phi,ang,g=1,r=24,R=RC){const [x,y]=pj(R*Math.cos(phi),R*Math.sin(phi));return compass(x,y,ang,{r,g});}
// rev: heads point the other way round (clockwise seen from above).
function ringPlate(r,{p=1,color=MX.B,w=4,op=1,heads=0,flow=0,dash='',rev=false}={}){const pts=[];for(let i=0;i<=96;i++){const a=Math.PI/2-2*Math.PI*i/96;pts.push(pj(r*Math.cos(a),r*Math.sin(a)));}
 let s=draw(pts,p,{color,w,opacity:op,dash});
 if(heads>0)for(let k=0;k<3;k++){const a=Math.PI/2+.5-2*Math.PI*(k/3+(rev?-flow:flow));const [x,y]=pj(r*Math.cos(a),r*Math.sin(a));const dx=Math.sin(a),dy=-P4.k*Math.cos(a);s+=fade(heads*op,head(x,y,Math.atan2(dy,dx)+(rev?Math.PI:0),color,15));}
 return s;}
function base4(ctx,{c=1,T=0,rings=null,glow=0,I=1,top=150}={}){return wireLower(c)+plate()+(rings??'')+wireUpper(c,T,{glow,I,top});}
// Screen direction of B (unit, in screen px) at plate angle phi.
const bDir=phi=>{const dx=Math.sin(phi),dy=-P4.k*Math.cos(phi),n=Math.hypot(dx,dy);return [dx/n,dy/n];};
const FORM=`${cB('B')}=\\dfrac{\\mu_0 ${cI('I')}}{2\\pi r}`;
// The walker (a small figure) at screen point (x,y).
const walker=(x,y,g=1)=>fade(g,`<circle cx="${x}" cy="${y-30}" r="9" fill="${MX.good}"/>`+line(x,y-21,x,y-2,{color:MX.good,w:6}));
// Right hand gripping the wire: thumb up along the current, fingers curling round the front
// from left to right (= counter-clockwise seen from above = the field direction).
function fist(x,y0,g){const skin='#e8b58c',edge='#a8744f';let s='';
 s+=`<rect x="${x-64}" y="${y0-4}" width="40" height="92" rx="16" fill="${mixC(skin,'#000000',.18)}" stroke="${edge}" stroke-width="2"/>`;
 for(let i=0;i<4;i++){const yc=y0+10+i*22;
  s+=`<path d="M ${x-40} ${yc} A 44 15 0 0 0 ${x+40} ${yc}" fill="none" stroke="${edge}" stroke-width="22" stroke-linecap="round"/>`
   +`<path d="M ${x-40} ${yc} A 44 15 0 0 0 ${x+40} ${yc}" fill="none" stroke="${skin}" stroke-width="18" stroke-linecap="round"/>`;}
 s+=`<rect x="${x-12}" y="${y0-66}" width="24" height="86" rx="12" fill="${skin}" stroke="${edge}" stroke-width="2"/>`;
 return fade(g,s);}

// ---- v3 helpers ------------------------------------------------------------------------
// 補足 tag (short side-track that does not stop the main line).
const hosoku=(g=1)=>word('補足',40,128,{size:26,color:MX.hi,g,border:MX.hi});
// ---- v4 helpers: thinking aids (たとえ), numbered cards, wind, walker figure ------------------
const TAT='#e3b8ff';
// 「たとえ」 tag: shown while a metaphor is on screen, faded out when we return to the real picture.
const tatoe=(g=1,x=40,y=128)=>word('たとえ',x,y,{size:24,color:TAT,g,border:TAT});
// Numbered circle (same number on the picture and on the matching card / term).
function num(n,x,y,{r=16,g=1,fill=MX.hi,color='#0d1526',size}={}){return fade(g,`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="#0d1526" stroke-width="2"/>`+label(String(n),x,y+(size??r*1.15)*.36,{size:size??r*1.15,color,anchor:'middle',weight:700}));}
// A wind streak: a wavy line from (x,y) along angle a (screen radians), arrowhead at the end.
function windStreak(x,y,a,L=70,{g=1,color=MX.B,w=4,ph=0}={}){if(g<=0)return '';const c=Math.cos(a),s=Math.sin(a),pts=[];
 for(let i=0;i<=16;i++){const u=i/16,off=5*Math.sin(u*Math.PI*2+ph);pts.push([x+c*L*u-s*off,y+s*L*u+c*off]);}
 const e=pts[16];return fade(g,draw(pts,1,{color,w})+head(e[0]+c*4,e[1]+s*4,a,color,11));}
// Walking figure (side view), feet at (x,y), facing the +x direction; st = stride phase.
function person(x,y,{s=1,g=1,color=MX.good,st=0}={}){const hy=y-58*s,sw=Math.sin(st)*10*s;
 return fade(g,`<circle cx="${x}" cy="${hy}" r="${10*s}" fill="${color}"/>`+line(x,hy+10*s,x,y-24*s,{color,w:6*s})
  +line(x,y-24*s,x+sw,y,{color,w:5*s})+line(x,y-24*s,x-sw,y,{color,w:5*s})+line(x,hy+20*s,x+12*s,hy+34*s,{color,w:4*s})+line(x,hy+20*s,x-10*s,hy+32*s,{color,w:4*s}));}
// A small card (paper) with a number circle: used for "one step → one term".
function card(x,y,w,h,{n=null,g=1,hi=false,inner=''}={}){return fade(g,`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#1d2a47" stroke="${hi?MX.hi:'#5b6c8f'}" stroke-width="${hi?4:2}"/>`+(n!=null?num(n,x+14,y+14,{r:13,fill:hi?MX.hi:'#9fb0cf'}):'')+inner);}
// Magnetic field into the screen: a grid of ⊗ marks.
function crossGrid(x0,y0,x1,y1,{op=1,gap=62,r=11}={}){let s='';for(let y=y0;y<=y1;y+=gap)for(let x=x0;x<=x1;x+=gap){s+=ring(x,y,r,{color:MX.B,w:2.5})+line(x-r*.62,y-r*.62,x+r*.62,y+r*.62,{color:MX.B,w:2.5})+line(x-r*.62,y+r*.62,x+r*.62,y-r*.62,{color:MX.B,w:2.5});}return fade(op,s);}
// Horizontal test wire with current to the right and flowing dashes.
function testWire(x0,x1,y,T,{w=10,I=1}={}){let s=line(x0,y,x1,y,{color:MX.I,w:w*I});
 for(let k=0;k<4;k++){const x=x0+((T*80+k*(x1-x0)/4)%(x1-x0));if(x<x1-24)s+=line(x,y,x+16,y,{color:'#fff7c2',w:4});}
 return s+head(x1+6,y,0,MX.I,18);}
// Perspective wire through the plate at plate point (X,Z): lower part (drawn before the plate) and upper part.
const wireLowerAt=(X,Z,c=1)=>{const [x,y]=pj(X,Z);return line(x,y,x,510,{color:mixC('#6c7a94',MX.I,c),w:12,opacity:.45});};
const wireUpperAt=(X,Z,c,T,o={})=>{const [x,y]=pj(X,Z);return wireUpper(c,T,{...o,x,y0:y});};
// Loop on the plate with walking-direction heads; dir +1 = along B (counter-clockwise seen from above).
function loopPlate(r,{color=MX.good,w=5,op=1,heads=1,flow=0,dir=1}={}){return ringPlate(r,{color,w,op,heads,flow,rev:dir<0});}
// Top view (the plate seen from straight above; the part nearest the viewer is at the bottom).
const TV={x:360,y:300};
const tvP=(r,th,o=TV)=>[o.x+r*Math.cos(th),o.y-r*Math.sin(th)];
const tvTan=th=>[-Math.sin(th),-Math.cos(th)];   // counter-clockwise on screen = along B
function wireDot(x,y,dir=1,g=1,r=17){return fade(g,ring(x,y,r,{color:MX.I,w:4,fill:'#0d1526'})+(dir>0?dot(x,y,5,MX.I):line(x-r*.55,y-r*.55,x+r*.55,y+r*.55,{color:MX.I,w:4})+line(x-r*.55,y+r*.55,x+r*.55,y-r*.55,{color:MX.I,w:4})));}
function tvField(op=.35,o=TV){let s='';for(const r of [70,130,190]){s+=ring(o.x,o.y,r,{color:MX.B,w:2}).replace('/>',` opacity="${op}"/>`);
 for(const th of [0,Math.PI/2,Math.PI,1.5*Math.PI]){const [x,y]=tvP(r,th+.35,o),[tx,ty]=tvTan(th+.35);s+=fade(op,head(x,y,Math.atan2(ty,tx),MX.B,11));}}return s;}
// Fan pictogram at the wire (top view) for the metaphor 「扇風機のまわりを回った角度」.
function fan(x,y,T,g=1,R=46){if(g<=0)return '';let q='';for(let i=0;i<3;i++){const a=T*4+i*2*Math.PI/3;const cx=x+R*.55*Math.cos(a),cy=y-R*.55*Math.sin(a);
 q+=`<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${R*.5}" ry="${R*.2}" transform="rotate(${(-a*180/Math.PI).toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})" fill="#c9d1de" fill-opacity=".55"/>`;}
 return fade(g,ring(x,y,R+6,{color:'#c9d1de',w:2,dash:'5 6'})+q);}
// Wobbly loop around the wire in the top view.
const wob=th=>118*(1+.26*Math.sin(3*th+.6)+.12*Math.cos(2*th));
const WOB=[];for(let i=0;i<=240;i++){const th=2*Math.PI*i/240;WOB.push(tvP(wob(th),th));}
// Plate-plane helpers for the bent path (chapter 4).
const PA=(r,a)=>pj(r*Math.cos(a),r*Math.sin(a));
// Pie showing a fraction u of a turn (u may be negative).
function pie(cx,cy,R,u,{color=MX.B,op=.55}={}){if(Math.abs(u)<1e-3)return ring(cx,cy,R,{color:MX.dim,w:2});
 if(Math.abs(u)>=.999)return ring(cx,cy,R,{color:MX.dim,w:2})+`<circle cx="${cx}" cy="${cy}" r="${R}" fill="${color}" fill-opacity="${op}"/>`;
 const a0=Math.PI/2,a1=a0+2*Math.PI*u,[x0,y0]=[cx+R*Math.cos(a0),cy-R*Math.sin(a0)],[x1,y1]=[cx+R*Math.cos(a1),cy-R*Math.sin(a1)];
 return ring(cx,cy,R,{color:MX.dim,w:2})+`<path d="M ${cx} ${cy} L ${x0.toFixed(1)} ${y0.toFixed(1)} A ${R} ${R} 0 ${Math.abs(u)>.5?1:0} ${u>0?0:1} ${x1.toFixed(1)} ${y1.toFixed(1)} Z" fill="${color}" fill-opacity="${op}"/>`;}
// Crossings of the drawn loops with a horizontal segment y=Y0, x∈[xa,xb].
function hCross(Y0,xa,xb){const res=[];LOOPS.forEach(l=>{const P=l.all;for(let i=1;i<P.length;i++){const [x0,y0]=P[i-1],[x1,y1]=P[i];if((y0-Y0)*(y1-Y0)<0){const u=(Y0-y0)/(y1-y0),x=mix(x0,x1,u);if(x>=xa&&x<=xb)res.push({x,y:Y0,up:y1<y0,a:Math.atan2(y1-y0,x1-x0)});}}});return res;}
// Scene for the one-line counting cues.
function oneScene(ctx,{fg=1,og=0,ig=0,zg=0,pg=0}){const T=ctx.t;
 let s=magTranslucent(1)+bar(M.x,M.y,M.w,M.h,{op:.3,labels:false})+loops3({dots:1,T,heads:1,only:fg>0?0:-1,glow:fg})+poleLabels();
 s+=bagSvg(BAG0[0],BAG0[1],0,0,1);
 const cr=crossings(BAG0[0],BAG0[1],0,0,0);const cin=cr.find(c=>!c.out),cout=cr.find(c=>c.out);
 s+=fade(og,marks([cout],1)+word('+1',cout.x+30,cout.y-10,{size:30,color:OUTC}));
 s+=fade(ig,marks([cin],1)+word('−1',cin.x,MB+48,{size:30,color:INC,anchor:'middle'}));
 return {s,cin,cout};}

// =====================================================================================
export const mx2p34Diagrams={
 // ---------------------------------------------------------------- chapter 3
 // 砂鉄の模様（まず観察）
 'mx3-n-sand':(p,ctx)=>{
  const pg=on(ctx,'かみを',.7),fall=clamp(since(ctx,'さてつ')/1.2),align=clamp(since(ctx,'すると')/1.6);
  let s=magBase()+paper(pg)+filings(fall,align,1);
  s+=word('砂鉄',70,150,{size:30,g:on(ctx,'さてつ')*(1-on(ctx,'すると'))});
  s+=word('模様が 浮かぶ',600,480,{size:28,anchor:'middle',g:on(ctx,'もようが')});
  return stage(ctx,p,s);
 },
 // 模様だけでは向きが分からない → 方位磁針の N が指す向きを矢印に（26）
 'mx3-n-compass':(p,ctx)=>{const T=ctx.t,cg=at(ctx,'ちいさな'),ag=on(ctx,'やじるしに',.6);
  let s=fade(1-on(ctx,'ちいさな',.8),paper(1))+filings(1,1,1-.6*on(ctx,'ちいさな',.6))+magBase();
  s+=word('向きは？',600,130,{size:30,anchor:'middle',color:MX.hi,g:on(ctx,'どちら')*(1-on(ctx,'ちいさな'))});
  CMP.forEach(([x,y],i)=>{const t0=cg+i*.12,g=clamp((T-t0)/.3);if(g<=0)return;const a1=bAng(x,y),a=swing(a1+140-i*37,a1,T,t0+.2);
   s+=compass(x,y,a,{r:22,g:g*(1-.55*ag)});
   const r=a1*Math.PI/180;s+=arrow(x-24*Math.cos(r),y+24*Math.sin(r),x+30*Math.cos(r),y-30*Math.sin(r),{color:MX.B,w:5,head:14,g:ag});});
  s+=fade(on(ctx,'はりの',.5),callout(830,95,340,62,`<polygon points="860,126 900,116 900,136" fill="${MX.plus}"/><polygon points="940,126 900,116 900,136" fill="#dfe6f2"/>`+label('赤＝針の N極',955,137,{size:26,color:MX.ink,weight:700})));
  return stage(ctx,p,s);
 },
 // 矢印をつなぐと N から S への線 = 磁力線、電気力線と似ている
 'mx3-n-lines':(p,ctx)=>{const T=ctx.t,lp=clamp(since(ctx,'つなぐと')/1.6);
  let s=filings(1,1,.25)+lines3({p:lp,heads:clamp(lp*2-1),flow:T*.9})+magBase();
  CMP.forEach(([x,y])=>{const r=bAng(x,y)*Math.PI/180;s+=arrow(x-24*Math.cos(r),y+24*Math.sin(r),x+30*Math.cos(r),y-30*Math.sin(r),{color:MX.B,w:5,head:14,opacity:1-lp});});
  s+=word('N極から出て S極へ',600,490,{size:26,anchor:'middle',color:MX.B,g:on(ctx,'エヌきょくから')*(1-on(ctx,'でんきりきせん'))});
  s+=word('磁力線',60,140,{size:32,color:MX.B,g:on(ctx,'じりょくせん')});
  const g=on(ctx,'でんきりきせん',.6),ib=[900,95,1185,300];
  if(g>0){const ch=[{x:1105,y:180,q:1},{x:980,y:180,q:-1}];const fl=fieldLines(ch,{n:10,step:3,bounds:[ib[0]+4,ib[1]+4,ib[2]-4,ib[3]-50]});
   s+=callout(ib[0],ib[1],ib[2]-ib[0],ib[3]-ib[1],fl.map(l=>draw(l,1,{color:MX.E,w:2.5})).join('')+charge(1105,180,1,{r:18})+charge(980,180,-1,{r:18})+label('電気力線',1042,285,{size:24,color:MX.E,anchor:'middle',weight:700}),g);}
  return stage(ctx,p,s);
 },
 // 強さの測り方（25）：向きは方位磁針、強さは「磁場と直角な電線が受ける力」
 'mx3-n-measure':(p,ctx)=>{const T=ctx.t,dg=on(ctx,'むき',.5),sg=on(ctx,'つよさは',.6),wg=on(ctx,'ちょっかくに',.6),cg=on(ctx,'ながし',.4),fg=on(ctx,'ちからで',.6);
  // left: the bar magnet, shrunk; a compass shows only the direction
  let mag=lines3({heads:1,op:.8})+magBase()+compass(MR+95,M.y,0,{r:30});
  let s=`<g transform="translate(290 300) scale(.5) translate(${-M.x} ${-M.y})">${mag}</g>`;
  s+=fade(dg,ring(290+(MR+95-M.x)*.5,300,26,{color:MX.hi,w:3})+word('向き：方位磁針',290,445,{size:26,anchor:'middle',color:MX.ink}));
  // right: measuring the strength
  let inner=label('強さ：電線が受ける力で測る',905,140,{size:26,color:MX.ink,anchor:'middle',weight:700})
   +crossGrid(700,200,1120,460,{op:.9})
   +label('磁場は 画面の奥向き',905,488,{size:22,color:MX.B,anchor:'middle'});
  inner+=fade(wg,testWire(720,1080,360,cg>0?T:0,{})+fade(cg,tex('I',1100,398,{size:32,color:MX.I,auto:false}))+word('直角',760,318,{size:22,color:MX.ink}));
  inner+=fade(fg,arrow(900,352,900,352-110*fg,{color:C.F,w:7,head:20})+word('力 F',930,262,{size:26,color:C.F}));
  s+=callout(640,95,530,410,inner,sg);
  return stage(ctx,p,s);
 },
 // 力 ∝ I、∝ 磁場の中の長さ L。はみ出した部分は数えない（レビュー19）
 'mx3-n-tesla':(p,ctx)=>{const T=ctx.t,i2=on(ctx,'でんりゅう アイにも',.5),l2=on(ctx,'ながさ エルにも',.6),og=on(ctx,'はみだした',.5),ng=on(ctx,'かぞえません',.5);
  const I=1+i2,hw=mix(95,190,l2),F=45*I*(hw/95),cx=300,y=345;
  let ex=`<rect x="${cx-hw}" y="150" width="${2*hw}" height="280" rx="8" fill="${MX.B}" fill-opacity=".10" stroke="${MX.B}" stroke-opacity=".7" stroke-width="2" stroke-dasharray="8 6"/>`
   +crossGrid(cx-hw+31,181,cx+hw-20,420,{op:.6,gap:62,r:10})+label('磁場のある所',cx,142,{size:22,color:MX.B,anchor:'middle',weight:700});
  ex+=testWire(60,530,y,T,{w:8,I:mix(1,1.5,i2)})+tex('I',548,y+44,{size:30,color:MX.I,auto:false});
  // outside parts of the wire: no force, not counted
  ex+=fade(og,line(60,y,cx-hw,y,{color:'#0d1526',w:14,opacity:.55})+line(cx+hw,y,530,y,{color:'#0d1526',w:14,opacity:.55})+label('力なし',(60+cx-hw)/2+2,y+36,{size:22,color:MX.dim,anchor:'middle',weight:700}));
  // L: dimension line only over the part inside the field
  ex+=line(cx-hw,y+58,cx+hw,y+58,{color:MX.ink,w:3})+line(cx-hw,y+46,cx-hw,y+70,{color:MX.ink,w:3})+line(cx+hw,y+46,cx+hw,y+70,{color:MX.ink,w:3})
   +tex('L',cx,y+98,{size:32,color:MX.ink,auto:false});
  ex+=arrow(cx,y-10,cx,y-10-F,{color:C.F,w:7,head:18})+label('力',cx+18,y-18-F*.55,{size:24,color:C.F,weight:700});
  let s=callout(40,95,520,410,ex,1);
  let pn=label('力は どう変わる？',885,150,{size:28,color:MX.ink,anchor:'middle',weight:700})
   +fade(i2,label('電流 I ×2',650,225,{size:28,color:MX.I,weight:700})+label('→ 力 ×2',910,225,{size:28,color:C.F,weight:700}))
   +fade(l2,label('磁場の中の長さ L ×2',650,295,{size:26,color:MX.ink,weight:700})+label('→ 力 ×2',910,340,{size:28,color:C.F,weight:700}))
   +fade(og,line(640,375,1130,375,{color:MX.faint,w:2})+label('磁場の外に はみ出した部分',650,420,{size:24,color:MX.dim,weight:700}))
   +fade(ng,label('→ 力を受けない：L に数えない',650,462,{size:24,color:MX.hi,weight:700}));
  s+=callout(620,95,550,410,pn,i2);
  return stage(ctx,p,s);
 },
 // B ＝ F／(I L)：1個あたりと同じ割り算。6 N を 2 A × 3 m の 6 マスに分ける → 1 マス 1 N（レビュー19）
 'mx3-n-per':(p,ctx)=>{const T=ctx.t,kg=on(ctx,'いっこ',.5),dg=on(ctx,'アイと エルで',.6),ug=on(ctx,'いち アンペア',.6),bg=on(ctx,'じばの つよさ',.5),tg=on(ctx,'たんいは',.5);
  const x0=110,x1=470,ys=[270,380],cw=(x1-x0)/3;
  let ex=`<rect x="${x0}" y="170" width="${x1-x0}" height="260" rx="8" fill="${MX.B}" fill-opacity=".10" stroke="${MX.B}" stroke-opacity=".7" stroke-width="2" stroke-dasharray="8 6"/>`;
  // two 1 A strands (I = 2 A) across the field
  for(const y of ys)ex+=testWire(60,520,y,T,{w:6});
  for(const y of ys)ex+=label('1 A',64,y-14,{size:22,color:MX.I,weight:700});ex+=label('I = 2 A',64,ys[1]+92,{size:22,color:MX.I,weight:700});
  // L = 3 m in 1 m steps
  for(let j=0;j<=3;j++)ex+=line(x0+j*cw,405,x0+j*cw,425,{color:MX.ink,w:3});
  ex+=line(x0,415,x1,415,{color:MX.ink,w:3})+label('L = 3 m',(x0+x1)/2,455,{size:24,color:MX.ink,anchor:'middle',weight:700});
  // the 6 N of force: one 1 N arrow per (1 A strand × 1 m) cell
  for(let i=0;i<2;i++)for(let j=0;j<3;j++){const x=x0+cw*(j+.5)+(i?16:-16),y=ys[i]-8;ex+=arrow(x,y,x,y-70,{color:C.F,w:5,head:13});}
  ex+=label('力 F = 6 N（1 N の矢印 6本）',x0,160,{size:24,color:C.F,weight:700});
  ex+=fade(dg,line(x0+cw,170,x0+cw,430,{color:'#ffffff',w:1.5,dash:'4 6',opacity:.6})+line(x0+2*cw,170,x0+2*cw,430,{color:'#ffffff',w:1.5,dash:'4 6',opacity:.6}));
  // one cell highlighted: 1 A・1 m → 1 N
  ex+=fade(ug,`<rect x="${x0+4}" y="${ys[0]-92}" width="${cw-8}" height="${96}" rx="8" fill="none" stroke="${MX.hi}" stroke-width="4"/>`+label('1 A・1 m → 1 N',x0+cw*1.5,488,{size:22,color:MX.hi,anchor:'middle',weight:700}));
  let s=callout(40,95,520,410,ex,1);
  let pn=fade(kg,label('第2章の 1個あたり：2個で 600円 → 1個 300円',895,145,{size:22,color:MX.dim,anchor:'middle'}));
  const f=`${cB('B')}=\\dfrac{{\\color{${C.F}}F}}{${cI('I')}\\,L}`;
  pn+=fade(dg,fit(f,800,232,200,58,{auto:false,color:MX.ink})+label('← 力を',930,214,{size:22,color:C.F,weight:700})+label('I と L で割る',930,248,{size:22,color:MX.ink,weight:700}));
  pn+=fade(ug,fit(`=\\dfrac{6\\,\\mathrm{N}}{2\\,\\mathrm{A}\\times 3\\,\\mathrm{m}}=1\\,\\mathrm{N}`,880,352,380,40,{auto:false,color:MX.ink})+label('＝ 1 A・1 m あたりの力',880,410,{size:24,color:MX.hi,anchor:'middle',weight:700}));
  pn+=fade(bg,label('これが 磁場の強さ B',880,448,{size:24,color:MX.B,anchor:'middle',weight:700}));
  pn+=fade(tg,word('単位 T（テスラ）',880,482,{size:24,color:MX.hi,anchor:'middle'}));
  s+=callout(600,95,570,410,pn,1);
  return stage(ctx,p,s);
 },
 // 予想：真ん中で切ったら右半分は N だけ？（① ⑦）
 'mx3-n-predict':(p,ctx)=>{const T=ctx.t,pul=.5+.5*Math.sin(T*6);
  const eg=on(ctx,'プラス',.5),kg=on(ctx,'まんなかで',.6),rg=on(ctx,'みぎはんぶん',.5);
  let s=lines3({op:mix(.9,.3,smooth(clamp(T/.8))),heads:1})+magBase();
  s+=fade(eg*(1-kg*.6),callout(60,110,230,110,charge(120,165,1,{r:24})+label('だけ',160,176,{size:30,color:MX.ink,weight:700})));
  if(kg>0){const y=mix(100,MT-14,kg);s+=fade(kg,line(M.x,MT-12,M.x,MB+30,{color:'#ffffff',w:3,dash:'10 8'})+`<polygon points="${M.x-24},${y-26} ${M.x+24},${y-26} ${M.x},${y}" fill="#dfe6f2"/>`);}
  s+=fade(rg*(.6+.4*pul),`<rect x="${M.x+4}" y="${MT-8}" width="${M.w/2+6}" height="${M.h+16}" rx="9" fill="none" stroke="${MX.hi}" stroke-width="4"/>`);
  s+=fade(rg,label('？',M.x+28,M.y+14,{size:40,color:MX.hi,anchor:'middle',weight:700}));
  s+=word('右半分は N極だけ？',M.x+M.w/4,490,{size:30,anchor:'middle',color:MX.hi,g:rg});
  return stage(ctx,p,s);
 },
 // 切ると断面に新しい極。何回切っても N だけにはならない（④ 予想を裏切る）
 'mx3-n-cut':(p,ctx)=>{const t=ctx.t;
  const u1=clamp(t/.8),c1=clamp(since(ctx,'あたらしい')/1.0),u2=clamp(since(ctx,'なんかい')/.9),u3=clamp(since(ctx,'エヌきょく',2)/.9);
  let s=lines3({op:.3*(1-smooth(clamp(t/.6))),heads:1});
  if(u2<=0)s+=pieces(1,smooth(u1),smooth(c1));
  else if(u3<=0)s+=pieces(2,smooth(u2),smooth(u2));
  else s+=pieces(3,smooth(u3),smooth(u3));
  if(u2<=0&&c1>0){const pul=.5+.5*Math.sin(t*9),G=46,w=M.w/4;s+=fade(c1*(.6+.4*pul),`<rect x="${M.x-G/2-w-5}" y="${MT-7}" width="${w+10}" height="${M.h+14}" rx="9" fill="none" stroke="${MX.hi}" stroke-width="4"/><rect x="${M.x+G/2-5}" y="${MT-7}" width="${w+10}" height="${M.h+14}" rx="9" fill="none" stroke="${MX.hi}" stroke-width="4"/>`)+word('新しい N と S',M.x,190,{size:30,anchor:'middle',g:c1*(1-on(ctx,'なんかい'))});}
  s+=word('予想',150,150,{size:26,color:MX.dim,g:1-on(ctx,'なんかい')})+fade(1-on(ctx,'なんかい'),label('右半分は N だけ',150,205,{size:26,color:MX.dim})+line(140,196,345,196,{color:MX.plus,w:4}));
  s+=word('何回 切っても',M.x,190,{size:30,anchor:'middle',g:on(ctx,'なんかい')*(1-on(ctx,'できません'))});
  const e=on(ctx,'できません');
  s+=fade(e,word('N極だけ',M.x-40,470,{size:32,anchor:'middle',color:MX.plus})+line(M.x+48,448,M.x+92,488,{color:MX.plus,w:6})+line(M.x+92,448,M.x+48,488,{color:MX.plus,w:6}));
  return stage(ctx,p,s);
 },
 // 観測に合う描き方：この棒磁石では、中を S→N へ戻る閉じた輪（26）
 'mx3-n-loops':(p,ctx)=>{const T=ctx.t;
  const fg=clamp(T/.6),tr=on(ctx,'なかを',.8),ip=clamp(since(ctx,'エスきょくから')/1.4),lg=on(ctx,'とじた'),ng=on(ctx,'しゅっぱつてん',.5);
  let s=magTranslucent(1)+bar(M.x,M.y,M.w,M.h,{op:1-.7*tr,labels:false});
  s+=loops3({inner:ip,dots:clamp(ip*2-1),T:Math.max(0,since(ctx,'エスきょくから')),glow:lg,heads:1});
  s+=fade(1-tr,label('S',M.x-M.w/4,M.y+12,{size:34,color:'#fff',anchor:'middle',weight:700})+label('N',M.x+M.w/4,M.y+12,{size:34,color:'#fff',anchor:'middle',weight:700}))+fade(tr,poleLabels());
  let pcs='';for(let i=0;i<4;i++){const x=905+i*62;pcs+=bar(x,185,52,30,{labels:false});}
  s+=fade(fg*(1-ng),callout(860,100,300,165,label('観測',1010,142,{size:28,color:MX.hi,anchor:'middle',weight:700})+pcs+label('どこで切っても S と N',1010,245,{size:22,color:MX.ink,anchor:'middle'})));
  s+=fade(ng,callout(860,100,300,165,label('線に',1010,160,{size:28,color:MX.ink,anchor:'middle',weight:700})+label('出発点も 終点も',1010,205,{size:26,color:MX.B,anchor:'middle',weight:700})+label('ない',1010,245,{size:26,color:MX.ink,anchor:'middle',weight:700})));
  s+=word('中は S → N',150,340,{size:28,color:MX.B,g:on(ctx,'エスきょくから')});
  s+=word('この棒磁石の 閉じた輪',60,140,{size:28,color:MX.B,g:lg});
  return stage(ctx,p,s);
 },
 // 切る実験は証明ではない。土台は「N だけ・S だけの粒が見つかっていない」（26）
 'mx3-n-premise':(p,ctx)=>{const T=ctx.t,xg=on(ctx,'しょうめい',.5),fg=on(ctx,'どだい',.6),bg=on(ctx,'つぶが',.6),ng=on(ctx,'みつかって',.5);
  let s=`<g transform="translate(-200 0)">${magTranslucent(.6)+loops3({op:.45,heads:1})+bar(M.x,M.y,M.w,M.h,{op:.35,labels:false})+poleLabels()}</g>`;
  let inner=label('磁石を切る実験',960,150,{size:26,color:MX.ink,anchor:'middle',weight:700});
  let pcs='';for(let i=0;i<3;i++)pcs+=bar(900+i*60,192,50,26,{labels:false});
  inner+=pcs+fade(xg,label('＝ 観測（証明ではない）',960,250,{size:24,color:MX.hi,anchor:'middle',weight:700}));
  inner+=fade(fg,line(770,280,1150,280,{color:MX.faint,w:2})+label('法則の土台',960,320,{size:26,color:MX.ink,anchor:'middle',weight:700}));
  const ball=(x,c,t)=>`<circle cx="${x}" cy="385" r="28" fill="${c}"/>`+label(t,x,396,{size:30,color:'#fff',anchor:'middle',weight:700});
  inner+=fade(bg,ball(880,MX.plus,'N')+label('だけ',925,396,{size:24,color:MX.ink})+ball(1040,MX.minus,'S')+label('だけ',1085,396,{size:24,color:MX.ink}));
  inner+=fade(ng,label('どんな実験でも 見つかっていない',960,465,{size:24,color:MX.hi,anchor:'middle',weight:700}));
  s+=callout(750,100,420,400,inner,1);
  return stage(ctx,p,s);
 },
 // 磁束：選んだ面を細かく分け、一片ごとに「垂直な成分 × 面積」のレシート → 全部足す（27、レシートは第2章の比喩）
 'mx3-n-bag':(p,ctx)=>{const T=ctx.t,bg=on(ctx,'じそくを',.7),pg=on(ctx,'こまかく',.5),ng=on(ctx,'すいちょくな',.5),rg=on(ctx,'レシート',.5),sg=on(ctx,'ぜんぶ',.5);
  let s=magTranslucent(1)+bar(M.x,M.y,M.w,M.h,{op:.3,labels:false})+loops3({dots:1,T,heads:1})+poleLabels();
  s+=bagSvg(BAG0[0],BAG0[1],0,0,bg);
  s+=fade(on(ctx,'えらんだ',.5),word('選んだ面（ここでは 袋）',60,470,{size:24,color:MX.ink}));
  const cr=crossings(BAG0[0],BAG0[1],0,0);
  s+=marks(cr,pg);
  if(pg>0){const c=cr.find(q=>q.out&&q.y<M.y)??cr[0];
   s+=fade(pg,ring(c.x,c.y,20,{color:MX.hi,w:3})+line(c.x+18,c.y-12,875,190,{color:MX.hi,w:2,dash:'6 6'}));
   const px=1020,py=250;
   let inner=line(px-110,py,px+110,py,{color:'#ffffff',w:4})+line(px-40,py,px+40,py,{color:MX.hi,w:10})+label('一片の面積',px-40,py+36,{size:22,color:MX.hi,anchor:'middle',weight:700})
    +arrow(px,py,px+70,py-110,{color:MX.B,w:6,head:16})+label('磁場',px+80,py-100,{size:22,color:MX.B,weight:700})
    +fade(ng,line(px,py,px,py-102,{color:MX.good,w:5,dash:'8 6'})+line(px+70,py-110,px+8,py-110,{color:MX.good,w:2,dash:'4 5'})+label('垂直な成分',px-14,py-116,{size:22,color:MX.good,anchor:'end',weight:700}));
   // the receipt for this piece
   inner+=fade(rg,`<path d="M 880 300 H 1030 V 402 l -12 8 l -12 -8 l -12 8 l -12 -8 l -12 8 l -12 -8 l -12 8 l -12 -8 l -12 8 l -12 -8 l -12 8 l -12 -8 l -6 4 Z" fill="${MX.paper}"/>`
    +label('レシート',955,328,{size:20,color:MX.paperInk,anchor:'middle',weight:700})+label('垂直な成分',955,358,{size:20,color:'#1c7a4b',anchor:'middle',weight:700})+label('× 面積',955,386,{size:20,color:'#8a5a00',anchor:'middle',weight:700}));
   inner+=fade(sg,label('全部足す',1100,340,{size:24,color:MX.ink,anchor:'middle',weight:700})+tex('\\sum',1100,392,{size:40,color:MX.hi,auto:false})+label('＝ 磁束',1020,448,{size:26,color:MX.B,anchor:'middle',weight:700}));
   s+=callout(860,110,320,370,inner,pg);}
  s+=word('磁束',60,140,{size:32,color:MX.B,g:bg});
  s+=word('電気束と 同じ作り',60,200,{size:26,color:MX.E,g:on(ctx,'でんきそく')*(1-on(ctx,'こまかく'))});
  return stage(ctx,p,s);
 },
 // 閉じた面（袋）と、閉じた道（輪）に張った開いた面（膜）を区別する（レビュー20）
 'mx3-n-open':(p,ctx)=>{const T=ctx.t,cg=on(ctx,'とじた',.5),og=on(ctx,'ひらいた',.6),kg=on(ctx,'ふちの',.5),zg=on(ctx,'まく そのもの',.5);
  let s=magTranslucent(1)+bar(M.x,M.y,M.w,M.h,{op:.3,labels:false})+loops3({dots:1,T,heads:1})+poleLabels();
  const bcx=ML+60;s+=fade(cg,bagSvg(bcx,M.y,0,0,1)+marks(crossings(bcx,M.y,0,0),1)+word('閉じた面（袋）',60,470,{size:24}));
  const Y0=MT-52,xa=MR-110,xb=MR+20,xc=(xa+xb)/2,rx=(xb-xa)/2;
  s+=fade(og,`<ellipse cx="${xc}" cy="${Y0}" rx="${rx}" ry="13" fill="#ffffff" fill-opacity="${.14+.16*zg}" stroke="#ffffff" stroke-width="4"/>`+word('輪に張った膜',xc,Y0-70,{size:24,anchor:'middle'}));
  s+=fade(kg*(1-.5*zg),`<ellipse cx="${xc}" cy="${Y0}" rx="${rx}" ry="13" fill="none" stroke="${MX.good}" stroke-width="7"/>`);
  // icon table: closed surface / closed path / open surface on that path
  const icBag=(x,y)=>`<circle cx="${x}" cy="${y}" r="22" fill="#ffffff" fill-opacity=".08" stroke="#ffffff" stroke-width="3" stroke-dasharray="7 5"/>`;
  const icRing=(x,y)=>`<ellipse cx="${x}" cy="${y}" rx="28" ry="10" fill="none" stroke="${MX.good}" stroke-width="5"/>`;
  const icMem=(x,y)=>`<ellipse cx="${x}" cy="${y}" rx="28" ry="10" fill="#ffffff" fill-opacity=".35" stroke="#ffffff" stroke-width="3"/>`;
  s+=callout(860,285,310,215,fade(cg,icBag(900,330)+label('閉じた面（袋）',940,339,{size:24,color:MX.ink,weight:700}))
   +fade(kg,icRing(900,395)+label('閉じた道（輪）',940,404,{size:24,color:MX.good,weight:700}))
   +fade(zg,icMem(900,458)+label('輪に張った膜',940,456,{size:22,color:MX.ink,weight:700})+label('＝ 開いた面',940,486,{size:22,color:MX.hi,weight:700})),cg);
  return stage(ctx,p,s);
 },
 // 線 1本 ＝ 決まった量の磁束（約束）。この図は見取り図（28）
 'mx3-n-count':(p,ctx)=>{const T=ctx.t,ig=on(ctx,'いっぽんが',.5),yg=on(ctx,'やくそく',.5),mg=on(ctx,'みとりず',.5);
  let s=magTranslucent(1)+bar(M.x,M.y,M.w,M.h,{op:.3,labels:false})+loops3({dots:0,T,heads:1,only:ig>0?0:-1,glow:ig})+poleLabels();
  const win=(x,n,lab)=>{let q=`<rect x="${x-50}" y="300" width="100" height="100" rx="6" fill="#ffffff" fill-opacity=".08" stroke="#ffffff" stroke-width="3"/>`;for(let i=0;i<n;i++){const xx=x-50+100*(i+1)/(n+1);q+=arrow(xx,420,xx,282,{color:MX.B,w:4,head:12});}return q+label(lab,x,450,{size:22,color:MX.ink,anchor:'middle'});};
  let inner=fade(ig,line(890,165,960,165,{color:MX.B,w:5})+label('線 1本',975,174,{size:26,color:MX.B,weight:700})+label('＝ 決まった量の磁束',1020,220,{size:26,color:MX.ink,anchor:'middle',weight:700}))
   +fade(yg,label('（約束）',1020,258,{size:22,color:MX.hi,anchor:'middle'})+win(950,2,'2本')+win(1090,4,'4本 ＝ 磁束 2倍'));
  s+=callout(860,110,310,370,inner,ig);
  s+=word('本数で 数える',60,140,{size:28,color:MX.B,g:on(ctx,'ほんすう',.5)});
  s+=word('この図は 約束で描いた 見取り図',60,480,{size:24,color:MX.ink,g:mg});
  return stage(ctx,p,s);
 },
 // 1本の線：外向きをプラス、出る +1・入る −1（符号付きの数、矢印ではない）（28）
 'mx3-n-one':(p,ctx)=>{const fg=on(ctx,'いっぽんの',.6),sg=on(ctx,'そとむき',.5),og=on(ctx,'でる',.4),ig=on(ctx,'ハイル',.4),ng=on(ctx,'ふごうつき',.5);
  let {s}=oneScene(ctx,{fg,og,ig});
  s+=fade(sg,callout(860,120,300,110,label('外向き ＝ プラス',1010,168,{size:26,color:MX.ink,anchor:'middle',weight:700})+label('（第2章と同じ約束）',1010,208,{size:22,color:MX.dim,anchor:'middle'})));
  s+=fade(ng,callout(860,260,300,110,label('足すのは 矢印ではなく',1010,305,{size:22,color:MX.ink,anchor:'middle'})+label('符号付きの数',1010,345,{size:26,color:MX.hi,anchor:'middle',weight:700})));
  return stage(ctx,p,s);
 },
 // 輪なので入れば必ず出る：+1 と −1 が対 → 0。部屋の出入り口で数える（第2章の比喩）（28）
 'mx3-n-pair':(p,ctx)=>{const T=ctx.t,zg=on(ctx,'ゼロ',.5),rg=on(ctx,'ヘやの',.5),pg=on(ctx,'ついに',.5);
  let {s}=oneScene(ctx,{fg:1,og:1,ig:1});
  s+=fade(pg,callout(860,120,300,120,fit(`{\\color{${OUTC}}+1}\\;{\\color{${INC}}-1}`+(zg>0?`\\;=\\;0`:''),1010,190,250,48,{auto:false,color:MX.ink})));
  s+=word('入れば 必ず出る',60,140,{size:26,g:on(ctx,'ハイれば',.5)*(1-rg)});
  // metaphor: count at the doorway of a room (walls = the closed surface)
  const rx=880,ry=270,w=260,h=200,dx=rx+w,dy=ry+120,u=((T*.5)%1);
  let room=`<rect x="${rx}" y="${ry}" width="${w}" height="${h}" rx="6" fill="#1d2a47" stroke="#c9d1de" stroke-width="4"/>`
   +line(dx,dy-40,dx,dy+40,{color:'#0d1526',w:8})+label('出入り口',dx-12,dy-52,{size:20,color:MX.ink,anchor:'end',weight:700});
  const px=mix(dx+30,dx-60,u),qx=mix(dx-60,dx+30,u);
  room+=dot(px,dy-18,8,INC)+head(px-12,dy-18,Math.PI,INC,12)+dot(qx,dy+20,8,OUTC)+head(qx+12,dy+20,0,OUTC,12);
  room+=label('入る −1',rx+20,dy-10,{size:22,color:INC,weight:700})+label('出る +1',rx+20,dy+28,{size:22,color:OUTC,weight:700});
  room+=label('壁 ＝ 閉じた面',rx+w/2,ry+h-18,{size:20,color:MX.dim,anchor:'middle'});
  s+=fade(rg*(1-.45*pg),room);
  s+=tatoe(rg*(1-pg),860,258);
  return stage(ctx,p,s);
 },
 // この磁石の図では、袋の形・場所を変えても 差 0（28）
 'mx3-n-any':(p,ctx)=>{const T=ctx.t,mv=on(ctx,'ばしょを',1.2),wob=on(ctx,'かたちや',.8);
  const cx=mix(BAG0[0],ML+30,mv*(.5+.5*Math.sin(T*.8-1.2))),ph=T*.9,dg=on(ctx,'さは',.5);
  let s=magTranslucent(1)+bar(M.x,M.y,M.w,M.h,{op:.3,labels:false})+loops3({dots:1,T,heads:1})+poleLabels();
  s+=bagSvg(cx,M.y,ph,wob,1);
  const cr=crossings(cx,M.y,ph,wob);s+=marks(cr,1);
  const nin=cr.filter(c=>!c.out).length,nout=cr.length-nin;
  s+=callout(880,110,290,170,label(`出る ${nout}`,905,165,{size:30,color:OUTC,weight:700})+label(`入る ${nin}`,905,215,{size:30,color:INC,weight:700})
   +fade(dg,label(`差 ${nout-nin}`,905,265,{size:30,color:MX.hi,weight:700})+check(1120,200,dg)));
  s+=word('この磁石の図では',60,140,{size:26,color:MX.ink});
  s+=fade(dg,callout(740,420,430,70,label('出る磁束 − 入る磁束 ＝ 0',955,466,{size:28,color:MX.hi,anchor:'middle',weight:700})));
  return stage(ctx,p,s);
 },
 // 法則として採用：N だけ・S だけの粒がない → どんな閉じた面でも 0（26 28）
 'mx3-n-gauss':(p,ctx)=>{const T=ctx.t,bg=clamp(T/.6),dg=on(ctx,'どんな',.6),eg=on(ctx,'ふたつめ',.6);
  const X=-230;
  let body=magTranslucent(1)+bar(M.x,M.y,M.w,M.h,{op:.3,labels:false})+loops3({dots:1,T,heads:1})+poleLabels();
  body+=fade(dg,bagSvg(BAG0[0]-60+60*Math.sin(T*.7),M.y,T*.9,1,1));
  let s=`<g transform="translate(${X} 0)">${body}</g>`;
  const ball=(x,c,t)=>`<circle cx="${x}" cy="175" r="24" fill="${c}"/>`+label(t,x,185,{size:26,color:'#fff',anchor:'middle',weight:700});
  s+=panel(1,fade(bg,ball(840,MX.plus,'N')+ball(930,MX.minus,'S')+label('だけの粒は ない',970,185,{size:24,color:MX.ink,weight:700}))
   +fade(dg,arrow(960,205,960,232,{color:MX.dim,w:3,head:10})+fit(`\\oint ${cB('\\vec B')}\\cdot d\\vec A=0`,960,315,340,54,{auto:false,color:MX.ink})+label('どんな閉じた面でも',960,365,{size:22,color:MX.dim,anchor:'middle'}))
   +fade(eg,label('磁場のガウスの法則',960,440,{size:30,color:MX.hi,anchor:'middle',weight:700})));
  return stage(ctx,p,s);
 },
 // 面の上の磁場は残っている、ゼロなのは閉じた面での出入りの差。輪に張った膜ではゼロとは限らない（⑥、レビュー20）
 'mx3-n-law':(p,ctx)=>{const T=ctx.t,eg=1,mg=on(ctx,'めんの',.5),zg=on(ctx,'でる',.5),wg=on(ctx,'わに はった',.5),ng=on(ctx,'かぎりません',.5);
  const X=-230;
  let body=magTranslucent(1)+bar(M.x,M.y,M.w,M.h,{op:.3,labels:false})+loops3({dots:1,T,heads:1})+poleLabels()+bagSvg(BAG0[0],BAG0[1],1.2,1,1);
  const cr=crossings(BAG0[0],BAG0[1],1.2,1);body+=marks(cr,1);
  let s=`<g transform="translate(${X} 0)">${body}</g>`;
  s+=fade(mg,word('面の上に 磁場はある',505,112,{size:24,color:MX.B,anchor:'middle'}));
  const lc=zg>0?DIM:MX.ink,src=`{\\color{${lc}}\\oint {\\color{${zg>0?'#8a6a3a':MX.B}}\\vec B}\\cdot d\\vec A}={\\color{${zg>0?MX.hi:MX.ink}}0}`;
  s+=fade(mg,marks(cr.map(c=>({...c,x:c.x+X})),1)+cr.map(c=>ring(c.x+X,c.y,16+3*Math.sin(T*6),{color:MX.B,w:3})).join(''));
  // membrane icon with lines passing one way through it
  let mem=`<ellipse cx="820" cy="440" rx="44" ry="13" fill="#ffffff" fill-opacity=".3" stroke="#ffffff" stroke-width="3"/>`;
  for(const x of [800,822,844])mem+=arrow(x,480,x,398,{color:MX.B,w:3.5,head:10});
  s+=panel(eg,label('磁場のガウスの法則',960,150,{size:28,color:MX.hi,anchor:'middle',weight:700})+fit(src,960,240,340,56,{auto:false,color:MX.ink})
   +fade(eg*(1-zg),label('閉じた面で 磁束を合計',960,320,{size:24,color:MX.ink,anchor:'middle'}))
   +fade(zg,label('出る磁束 − 入る磁束',960,325,{size:26,color:MX.hi,anchor:'middle',weight:700})+arrow(1060,300,1085,266,{color:MX.hi,w:3,head:12}))
   +fade(wg,line(770,360,1150,360,{color:MX.faint,w:2})+mem+label('輪に張った膜',885,425,{size:22,color:MX.ink,weight:700})+label('（開いた面）',885,455,{size:22,color:MX.dim,weight:700}))
   +fade(ng,label('0 とは 限らない',885,487,{size:24,color:MX.hi,weight:700})));
  return stage(ctx,p,s);
 },
 // 電気と磁気は別の世界？ → 1820年
 'mx3-n-to-oersted':(p,ctx)=>{
  const sl=smooth(clamp(ctx.t/1.2)),mx=mix(M.x,880,sl),yg=on(ctx,'せんはっぴゃく',.6);
  let s='';const ch=[{x:180,y:M.y,q:1},{x:400,y:M.y,q:-1}];
  const fl=fieldLines(ch,{n:14,step:4,bounds:[20,95,570,505]});
  s+=fade(sl,fl.map(l=>draw(l,1,{color:MX.E,w:3})).join('')+charge(180,M.y,1)+charge(400,M.y,-1));
  const sc=mix(1,.85,sl);
  s+=`<g transform="translate(${mx.toFixed(1)} ${M.y}) scale(${sc.toFixed(3)}) translate(${-M.x} ${-M.y})">${fade(1-sl,lines3({heads:1}))+fade(sl,lines3({heads:1,open:false}))+magBase()}</g>`;
  s+=fade(on(ctx,'べつべつ',.5),line(600,100,600,505,{color:MX.dim,w:3,dash:'10 10'}));
  s+=word('電気',70,140,{size:32,color:MX.E,g:on(ctx,'でんきと')})+word('磁気',1130,140,{size:32,color:MX.B,anchor:'end',g:on(ctx,'じきは')});
  s+=fade(yg,callout(470,420,260,80,label('1820年',600,475,{size:40,color:MX.hi,anchor:'middle',weight:700})));
  return stage(ctx,p,s);
 },

 // ---------------------------------------------------------------- chapter 4
 // エルステッド：電流を流すと方位磁針が回る
 'mx4-n-oersted':(p,ctx)=>{const T=ctx.t,c=on(ctx,'ながすと',.3),t0=at(ctx,'ながすと');
  const a=swing(90,needle(0,RC,1),T,t0);
  let s=base4(ctx,{c,T})+compassAt(Math.PI/2,a,1,30);
  s+=word('方位磁針',P4.cx+50,505,{size:26,g:on(ctx,'ほういじしん')*(1-on(ctx,'デンマーク'))});
  s+=word('電流',P4.cx+40,200,{size:28,color:MX.I,g:c});
  s+=fade(on(ctx,'デンマーク',.6),callout(780,190,380,190,label('エルステッド',970,260,{size:36,color:MX.ink,anchor:'middle',weight:700})+label('デンマーク・1820年',970,325,{size:28,color:MX.dim,anchor:'middle'})));
  return stage(ctx,p,s);
 },
 // 同じ道具（方位磁針）が磁石にも電流にも反応した（30）
 'mx4-n-same':(p,ctx)=>{const T=ctx.t,mg=on(ctx,'じしゃくの',.6),t0=at(ctx,'じしゃくの');
  let s=base4(ctx,{c:1,T})+compassAt(Math.PI/2,needle(0,RC,1),1,30);
  // inset: magnet brought to a compass; the needle's N turns away from the magnet's N
  const mx=mix(820,862,smooth(clamp((T-t0)/1.2)));
  let ins=bar(mx,200,150,44,{size:24})+compass(1030,200,swing(90,0,T,t0+.9),{r:30});
  s+=fade(mg,callout(740,110,440,160,ins)+label('磁石',790,255,{size:22,color:MX.dim}));
  const sg=on(ctx,'おなじ',.5);
  s+=fade(sg,draw([[1030,236],[1030,300],[620,300],[P4.cx+30,436]],1,{color:MX.hi,w:3,dash:'8 7'})+word('同じ道具',850,300,{size:28,color:MX.hi,anchor:'middle'}));
  s+=fade(on(ctx,'でんりゅうの',.5),callout(740,360,440,130,causal('電流','まわりに磁場',960,410,{ca:MX.I,cb:MX.B,size:30})+fade(on(ctx,'つながって',.5),label('電気と磁気が つながる',960,465,{size:26,color:MX.hi,anchor:'middle',weight:700}))));
  return stage(ctx,p,s);
 },
 // 方位磁針を並べる → 円に沿ってそろう
 'mx4-n-ring':(p,ctx)=>{const T=ctx.t,off=clamp(T/.5),cOn=on(ctx,'かこむ',.3),t1=at(ctx,'かこむ'),t0=at(ctx,'ならべて');
  const c=cOn>0?cOn:1-off;
  let s=base4(ctx,{c,T});
  s+=fade(on(ctx,'えんに',.6),ringPlate(RC,{color:'#ffffff',w:2.5,op:.55,p:clamp(since(ctx,'えんに')/.9)}));
  PHI.forEach((ph,i)=>{const g=i===0?1:clamp((T-t0-i*.18)/.3);if(g<=0)return;
   const target=needle(RC*Math.cos(ph),RC*Math.sin(ph),1);
   const a=i===0?(T<t1?swing(needle(0,RC,1),90,T,0):swing(90,target,T,t1)):swing(90,target,T,t1);
   s+=compassAt(ph,a,g);});
  s+=word('電流 オフ',P4.cx+40,200,{size:28,color:MX.dim,g:(1-cOn)*off})+word('電流 オン',P4.cx+40,200,{size:28,color:MX.I,g:cOn});
  return stage(ctx,p,s);
 },
 // 向きは観測で決まる：上向き→反時計回り、逆→時計回り（29）
 'mx4-n-reverse':(p,ctx)=>{const T=ctx.t,tv=on(ctx,'うえから',.5),t1=at(ctx,'ぎゃくに'),rv=T>t1?1:0,rg=on(ctx,'ぎゃくに',.4);
  const dir=rv?-1:1;
  let rings=ringPlate(RC,{color:MX.B,w:2.5,op:.6,heads:1,flow:T*.12,rev:rv===1});
  PHI.forEach(ph=>{const X=RC*Math.cos(ph),Z=RC*Math.sin(ph);const a=rv?swing(needle(X,Z,1),needle(X,Z,-1),T,t1+.15):needle(X,Z,1);rings+=compassAt(ph,a,1);});
  let s=wireLower(1)+plate()+rings+wireUpper(1,T,{dir});
  // top view inset
  const cx=960,cy=300,R=95;
  let inner=label('上から見ると',cx,150,{size:26,color:MX.ink,anchor:'middle',weight:700});
  inner+=ring(cx,cy,R,{color:MX.B,w:3});
  for(let k=0;k<3;k++){const th=Math.PI/2+.4+2*Math.PI*k/3,[x,y]=[cx+R*Math.cos(th),cy-R*Math.sin(th)];const [tx,ty]=tvTan(th);inner+=head(x,y,Math.atan2(ty,tx)+(rv?Math.PI:0),MX.B,16);}
  inner+=wireDot(cx,cy,dir,1,20);
  inner+=label(rv?'下向きの電流 ⊗':'上向きの電流 ⊙',cx,cy+R+50,{size:24,color:MX.I,anchor:'middle',weight:700});
  inner+=label(rv?'時計回り':'反時計回り',cx,cy+R+88,{size:26,color:MX.B,anchor:'middle',weight:700});
  s+=callout(760,105,400,395,inner,tv);
  s+=fade(rg,word('電流を 逆に',P4.cx+50,215,{size:26,color:MX.I}));
  s+=word('観測',60,140,{size:28,color:MX.hi,g:on(ctx,'かんそく',.5)*(1-tv)});
  return stage(ctx,p,s);
 },
 // 右手：向きを覚える目印（磁場を作るのではない）（29）
 'mx4-n-hand':(p,ctx)=>{const T=ctx.t,hg=on(ctx,'みぎて',.6),tg=on(ctx,'おやゆびを',.5),fg=on(ctx,'よんほんの',.5),bg=on(ctx,'じばの',.6);
  const rings=ringPlate(RC,{op:.35+.65*bg,heads:bg,flow:T*.12})+PHI.map(ph=>compassAt(ph,needle(RC*Math.cos(ph),RC*Math.sin(ph),1),1-.8*hg)).join('');
  let s=base4(ctx,{c:1,T,rings});
  s+=fist(P4.cx,240,hg);
  if(tg>0)s+=fade(tg,ring(P4.cx,176,26,{color:MX.I,w:4}));
  if(fg>0){const pts=[];const A0=Math.PI*.95,A1=Math.PI*.1;for(let i=0;i<=40;i++){const a=mix(A0,A1,i/40);pts.push([P4.cx+78*Math.cos(a),330+22*Math.sin(a)]);}
   s+=draw(pts,clamp(since(ctx,'よんほんの')/.8),{color:MX.B,w:6});
   if(since(ctx,'よんほんの')>.8){const a=A1;s+=head(pts[40][0],pts[40][1],Math.atan2(-22*Math.cos(a),78*Math.sin(a)),MX.B,18);}}
  s+=panel(1,label('右手 ＝ 覚える目印',960,150,{size:30,color:MX.ink,anchor:'middle',weight:700})
   +label('（右手が 磁場を作るのではない）',960,192,{size:22,color:MX.dim,anchor:'middle'})
   +fade(tg,label('親指',790,260,{size:28,color:MX.I,weight:700})+label('→ 電流の向き',880,260,{size:28,color:MX.ink}))
   +fade(fg,label('4本の指',790,330,{size:28,color:MX.B,weight:700})+label('→ 磁場の向き',910,330,{size:28,color:MX.ink}))
   +fade(bg,label('上から見て 反時計回り',960,410,{size:24,color:MX.ink,anchor:'middle'})),{h:350});
  return stage(ctx,p,s);
 },
 // 第3章の方法で B を測る：B ∝ I、∝ 1/r（30）
 'mx4-n-formula':(p,ctx)=>{const T=ctx.t,mg=on(ctx,'はかります',.5);
  const i2=on(ctx,'ひれい',.6)*(1-on(ctx,'きょり',.6)),rG=on(ctx,'はんぴれい',1.0),I=1+i2,r=mix(110,220,rG);
  const L=100*I*110/r;const [x,y]=pj(0,r);
  let s=base4(ctx,{c:1,T,I,rings:ringPlate(r,{op:.45,w:3})});
  s+=line(P4.cx,P4.cy,x,y,{color:'#ffffff',w:3,dash:'7 6'})+tex('r',P4.cx-18,mix(P4.cy,y,.6)+8,{size:34,color:'#ffffff',auto:false})+dot(x,y,8,'#ffffff')+arrow(x,y,x+L,y,{color:MX.B,w:7,head:20})+tex('B',x+L/2,y-18,{size:34,color:MX.B,auto:false});
  // short test wire at the measuring point (parallel to the long wire): the force on it gives B
  s+=fade(mg,line(x-80,y-30,x-80,y+10,{color:MX.I,w:6})+arrow(x-80,y-10,x-80,y-58,{color:C.F,w:4,head:12})+word('測る電線',x-100,y+34,{size:22,color:MX.I,anchor:'end'}));
  s+=panel(1,label('測った結果',960,150,{size:28,color:MX.ink,anchor:'middle',weight:700})
   +fade(mg,label('測る電線が受ける力 → B',960,205,{size:22,color:MX.ink,anchor:'middle'}))
   +fade(i2>0||rG>0?1:0,label('電流 I ×2',800,285,{size:28,color:MX.I,weight:700})+label('→ B ×2',990,285,{size:28,color:MX.B,weight:700}))
   +fade(rG,label('距離 r ×2',800,365,{size:28,color:MX.ink,weight:700})+label('→ B ×½',990,365,{size:28,color:MX.B,weight:700})),{y:110,h:330});
  return stage(ctx,p,s);
 },
 // 測定をまとめた式 = この章の出発点（30）
 'mx4-n-start':(p,ctx)=>{const T=ctx.t,fg=on(ctx,'しきが',.5),sg=on(ctx,'しゅっぱつてん',.6);
  let s=base4(ctx,{c:1,T,rings:ringPlate(RC,{op:.45,w:3,heads:1,flow:T*.12})});
  s+=panel(1,label('測定をまとめた式',960,160,{size:26,color:MX.ink,anchor:'middle',weight:700})+fade(fg,fit(FORM,960,280,380,64,{auto:false,color:MX.ink}))
   +fade(sg,word('出発点（実験で確かめた）',960,410,{size:26,color:MX.hi,anchor:'middle'})),{y:110,h:360});
  return stage(ctx,p,s);
 },
 // 適用条件：十分長くまっすぐ・一定の電流・真空（32）
 'mx4-n-cond':(p,ctx)=>{const T=ctx.t,lg=on(ctx,'ながく',.6),ig=on(ctx,'いってい',.5),vg=on(ctx,'しんくう',.5);
  const top=mix(150,108,lg);
  let s=base4(ctx,{c:1,T,top,rings:ringPlate(RC,{op:.45,w:3,heads:1,flow:T*.12})});
  s+=fade(lg,line(P4.cx,top-26,P4.cx,top-44,{color:MX.I,w:5,dash:'3 7'}));
  s+=panel(1,fit(FORM,960,175,300,46,{auto:false,color:MX.ink})
   +fade(lg,word('十分に長く まっすぐな電線',775,285,{size:24,color:MX.ink}))
   +fade(ig,word('一定の電流',775,355,{size:24,color:MX.I}))
   +fade(vg,word('まわりは 真空',775,425,{size:24,color:MX.E})),{y:95,h:380});
  s+=fade(ig,label('I は 一定',P4.cx+40,250,{size:26,color:MX.I,weight:700}));
  return stage(ctx,p,s);
 },
 // μ0 = 二つ目の数。冒頭の実験カードにバッジ（② ⑨）
 'mx4-n-mu':(p,ctx)=>{const T=ctx.t,mg=on(ctx,'ミューゼロが',.5),cg=on(ctx,'さいしょに',.6),bgd=on(ctx,'きまります',.6),pul=.5+.5*Math.sin(T*5);
  let s=base4(ctx,{c:1,T,rings:ringPlate(RC,{op:.45,w:3,heads:1,flow:T*.12})});
  const fw=texWidth(FORM,46,false);
  s+=callout(740,95,440,110,fit(FORM,960,172,290,44,{auto:false,color:MX.ink}),1);
  s+=fade(mg*(1-cg*.5),`<rect x="${976-3*pul}" y="${110-3*pul}" width="${54+6*pul}" height="${44+6*pul}" rx="9" fill="none" stroke="${MX.hi}" stroke-width="3"/>`);
  s+=fade(mg*(1-cg),label('二つ目の数',960,262,{size:30,color:MX.hi,anchor:'middle',weight:700}));
  s+=fade(cg,evidenceCard(1,715,212,{gn:bgd,glow:bgd*(.5+.5*pul),t:T,title:true}));
  return stage(ctx,p,s);
 },
 // B は場所で変わる → 場所によらず I だけで決まる量を探す（試み）（31）
 'mx4-n-motive':(p,ctx)=>{const T=ctx.t,wg=on(ctx,'よわく',.6),qg=on(ctx,'そこで',.5),tg=on(ctx,'ためして',.5);
  let rings='';for(const r of [90,170,250]){rings+=ringPlate(r,{op:.4,w:3});const [x,y]=pj(0,r),L=110*90/r;rings+=fade(wg,arrow(x,y,x+L,y,{color:MX.B,w:6,head:16}));}
  let s=base4(ctx,{c:1,T,rings});
  const [xa,ya]=pj(0,90),[xc,yc]=pj(0,250);
  s+=fade(wg,label('強い',xa+122+14,ya+8,{size:22,color:MX.B,weight:700})+label('弱い',xc+40+14,yc+8,{size:22,color:MX.B,weight:700}));
  s+=panel(1,label('B：場所で 値が変わる',960,170,{size:28,color:MX.B,anchor:'middle',weight:700})
   +fade(qg,arrow(960,200,960,250,{color:MX.dim,w:3,head:12})+label('場所によらず',960,300,{size:26,color:MX.ink,anchor:'middle'})+label('I だけで決まる量は？',960,345,{size:28,color:MX.I,anchor:'middle',weight:700}))
   +fade(tg,word('試してみる',960,430,{size:26,color:MX.hi,anchor:'middle'})),{y:110,h:370});
  return stage(ctx,p,s);
 },
 // 円を一周歩き、一歩ごとに「点数 × 歩幅」を記録して足す。たとえ：風の中の散歩（磁場＝風）（33 ③）
 'mx4-n-walk':(p,ctx)=>{const T=ctx.t,R=180,N=12,wg=since(ctx,'いっしゅう');
  const u=clamp(wg/Math.max(1.5,VE(ctx)-at(ctx,'いっしゅう')-.2)),ph=Math.PI/2-2*Math.PI*u,k=Math.floor(u*N+1e-6);
  const pts=[];for(let i=0;i<=96*u;i++){const a=Math.PI/2-2*Math.PI*i/96;pts.push(pj(R*Math.cos(a),R*Math.sin(a)));}
  let rings=ringPlate(R,{color:'#ffffff',w:2.5,op:.35})+draw(pts,1,{color:MX.good,w:6});
  const sg=on(ctx,'いっぽ',.5),tg=on(ctx,'たとえる',.5);
  for(let i=0;i<Math.min(k,N);i++){const a0=Math.PI/2-2*Math.PI*i/N;const [x0,y0]=pj(R*Math.cos(a0),R*Math.sin(a0));rings+=fade(sg,dot(x0,y0,5,'#ffffff'));}
  // wind streaks drifting round the wire (= the field, counter-clockwise seen from above)
  for(const [rr,a0] of [[120,.3],[120,2.4],[120,4.5],[245,1.2],[245,3.3],[245,5.4]]){const a=a0-T*.35,pts2=[];for(let i=0;i<=12;i++){const b=a-.32*i/12;pts2.push(pj((rr+5*Math.sin(i*1.3+T*3))*Math.cos(b),(rr+5*Math.sin(i*1.3+T*3))*Math.sin(b)));}
   const e=pts2[12],d=pts2[11];rings+=fade(tg*.9,draw(pts2,1,{color:MX.B,w:3.5})+head(e[0],e[1],Math.atan2(e[1]-d[1],e[0]-d[0]),MX.B,10));}
  let s=base4(ctx,{c:1,T,rings});
  const [x,y]=pj(R*Math.cos(ph),R*Math.sin(ph)),[bx,by]=bDir(ph);
  s+=fade(on(ctx,'てんすう',.5),arrow(x,y,x+70*bx,y+70*by,{color:MX.B,w:6,head:18}));
  s+=walker(x,y,clamp(wg/.4));
  let blocks='';for(let i=0;i<Math.min(k,N);i++)blocks+=`<rect x="${770+i*32}" y="300" width="28" height="44" rx="4" fill="${MX.B}" fill-opacity=".85"/>`;
  s+=panel(sg,label('一歩ごとに',960,160,{size:28,color:MX.ink,anchor:'middle',weight:700})
   +label('点数 × 歩幅',960,218,{size:32,color:MX.hi,anchor:'middle',weight:700})
   +fade(on(ctx,'きろく',.4),blocks+label('記録して 足していく',960,390,{size:26,color:MX.dim,anchor:'middle'}))
   +fade(tg,label('風 ＝ 磁場',960,450,{size:28,color:MX.B,anchor:'middle',weight:700})));
  s+=tatoe(tg);s+=word('風の中の散歩',40,190,{size:26,color:TAT,g:tg});
  return stage(ctx,p,s);
 },
 // 追い風 ＋、横風 0、向かい風 −。本物では「進む向きに沿った磁場の成分」。仕事ではない（32）
 'mx4-n-comp':(p,ctx)=>{const T=ctx.t,g1=on(ctx,'おいかぜ',.5),g2=on(ctx,'よこかぜ',.5),g3=on(ctx,'むかいかぜ',.5),rg=on(ctx,'ほんものの',.7),wg=on(ctx,'しごとを',.5);
  const box=(cx,g,kind,sign,cap,real)=>{const y=380;let q='';
   q+=arrow(cx-80,y+30,cx+90,y+30,{color:MX.good,w:6,head:16})+label('進む向き',cx+5,y+66,{size:20,color:MX.good,anchor:'middle',weight:700});
   q+=person(cx-10,y,{s:1.1,st:T*6});
   const ph=T*5;
   if(kind===0)for(const yy of [270,310,350])q+=windStreak(cx-150+((T*40)%30),yy,0,70,{g:1-rg,ph});
   if(kind===1)for(const xx of [cx-110,cx+70])q+=windStreak(xx,390-((T*40)%30),-Math.PI/2,80,{g:1-rg,ph});
   if(kind===2)for(const yy of [270,310,350])q+=windStreak(cx+150-((T*40)%30),yy,Math.PI,70,{g:1-rg,ph});
   // the real field arrow
   const ba=[0,-Math.PI/2,Math.PI][kind],ox=kind===2?cx+70:kind===1?cx+60:cx-70,oy=kind===1?360:282;
   q+=fade(rg,arrow(ox,oy,ox+110*Math.cos(ba),oy+110*Math.sin(ba),{color:MX.B,w:7,head:18})+label('磁場',ox+(kind===2?-110:kind===1?20:0),oy+(kind===1?-60:-18),{size:22,color:MX.B,weight:700}));
   q+=label(cap,cx,200,{size:26,color:MX.ink,anchor:'middle',weight:700})+fade(rg,label(real,cx,232,{size:22,color:MX.B,anchor:'middle',weight:700}));
   q+=label(sign,cx+100,250,{size:56,color:MX.hi,anchor:'middle',weight:700});
   return callout(cx-180,160,360,340,q,g);};
  let s=box(210,g1,0,'＋','追い風','同じ向き')+box(600,g2,1,'0','横風','直角')+box(990,g3,2,'−','向かい風','逆向き');
  s+=tatoe(1-rg,40,120);
  s+=fade(rg*(1-wg),label('本物：点数 ＝ 進む向きに沿った 磁場の成分',600,132,{size:24,color:MX.B,anchor:'middle',weight:700}));
  s+=fade(wg,label('※ 磁場の一周の足し算は、仕事ではない',600,132,{size:24,color:MX.hi,anchor:'middle',weight:700}));
  return stage(ctx,p,s);
 },
 // 斜めの風：第2章の「矢印の影」。進む向きに落とした影の長さが点数。影が後ろ向きなら −（32）
 'mx4-n-oblique':(p,ctx)=>{const T=ctx.t,wg=on(ctx,'やじるしの かげ',.5),cg=on(ctx,'おとした',.6),sg=on(ctx,'てんすうに',.5),bg=on(ctx,'うしろむき',.5);
  const ox=150,oy=390,ang=35*Math.PI/180,L=260,bx=ox+L*Math.cos(ang),by=oy-L*Math.sin(ang);
  let s=arrow(ox,oy,560,oy,{color:MX.good,w:8,head:20})+label('進む向き',470,435,{size:24,color:MX.good,weight:700});
  s+=arrow(ox,oy,bx,by,{color:MX.B,w:7,head:18})+label('斜めの風（磁場）',bx-60,by-20,{size:24,color:MX.B,weight:700});
  // light from straight above the path: the shadow on the path
  s+=fade(cg,[0,.33,.66,1].map(u=>{const x=mix(ox+20,bx,u);return line(x,130,x,mix(oy-L*Math.sin(ang)*(x-ox)/(bx-ox),oy,0)-6,{color:'#fff3b0',w:2,dash:'3 7',opacity:.55});}).join('')+label('光',bx+20,150,{size:22,color:'#fff3b0',weight:700}));
  s+=fade(cg,line(bx,by,bx,oy,{color:'#ffffff',w:2,dash:'6 6'})+line(ox,oy-10,bx,oy-10,{color:MX.B,w:12})+label('影',(ox+bx)/2,oy-24,{size:24,color:MX.B,anchor:'middle',weight:700}));
  s+=fade(sg,label('影の長さ ＝ 点数（＋）',ox,oy+60,{size:24,color:MX.hi,weight:700}));
  const qx=880,qy=390,a2=130*Math.PI/180,L2=200,cx2=qx+L2*Math.cos(a2),cy2=qy-L2*Math.sin(a2);
  let inner=label('後ろ寄りの 風なら',960,150,{size:24,color:MX.ink,anchor:'middle',weight:700})
   +arrow(qx,qy,qx+230,qy,{color:MX.good,w:7,head:18})+arrow(qx,qy,cx2,cy2,{color:MX.B,w:6,head:16})
   +line(cx2,cy2,cx2,qy,{color:'#ffffff',w:2,dash:'6 6'})+line(qx,qy-10,cx2,qy-10,{color:MX.B,w:12})
   +label('影は 後ろ向き',960,440,{size:24,color:MX.ink,anchor:'middle',weight:700})+label('点数は −',960,478,{size:28,color:MX.hi,anchor:'middle',weight:700});
  s+=callout(740,105,430,395,inner,bg);
  s+=word('第2章の 矢印の影と同じ',60,140,{size:24,color:MX.E,g:wg*(1-bg)});
  return stage(ctx,p,s);
 },
 // 半径と一歩を区別（必ず直す・レビュー21）。たとえ：円いトラックを走る
 'mx4-n-track':(p,ctx)=>{const T=ctx.t,O={x:330,y:305},R=150,kg=on(ctx,'トラック',.5),rg=on(ctx,'はしっても',.4),cg=on(ctx,'ちゅうしんからの',.5),ng=on(ctx,'かわりませんが',.5),dg=on(ctx,'はしった きょり',.5),fg=on(ctx,'ふえて',.5);
  const u=.85*clamp(since(ctx,'はしっても')/Math.max(1.5,VE(ctx)-at(ctx,'はしっても'))),th=-Math.PI/2+2*Math.PI*u;
  const P=a=>[O.x+R*Math.cos(a),O.y-R*Math.sin(a)];
  let s=fade(kg,ring(O.x,O.y,R,{color:'#b9573f',w:34}).replace('/>',' opacity=".55"/>')+ring(O.x,O.y,R,{color:'#ffffff',w:2,dash:'10 8'}));
  s+=ring(O.x,O.y,R,{color:'#ffffff',w:2}).replace('/>',` opacity="${.4*(1-kg)}"/>`);
  s+=wireDot(O.x,O.y,1,1,14)+label('中心',O.x+22,O.y-20,{size:22,color:MX.ink,weight:700});
  const trail=[];for(let i=0;i<=80;i++)trail.push(P(-Math.PI/2+2*Math.PI*u*i/80));
  s+=fade(dg,draw(trail,1,{color:MX.good,w:8}));
  const [x,y]=P(th);
  s+=fade(cg,arrow(O.x,O.y,x,y,{color:'#ffffff',w:4,head:14})+tex('r',(O.x+x)/2+26*Math.sin(th)*(Math.cos(th)>0?1:-1)*0+(-(y-O.y))/R*0+28*(-Math.sin(th)),(O.y+y)/2-28*Math.cos(th)+10,{size:32,color:'#ffffff',auto:false}));
  s+=dot(x,y,11,MX.good)+fade(rg,ring(x,y,17,{color:MX.good,w:3}));
  const cx=960;
  let inner=label('二つの長さ',cx,150,{size:28,color:MX.ink,anchor:'middle',weight:700});
  inner+=fade(cg,label('中心からの距離 r',790,215,{size:24,color:MX.ink,weight:700})+line(790,245,790+170,245,{color:'#ffffff',w:10})+fade(ng,label('変わらない',990,254,{size:24,color:MX.hi,weight:700})));
  inner+=fade(dg,label('走った距離（道に沿った長さ）',790,320,{size:24,color:MX.good,weight:700})+line(790,350,790+Math.max(4,340*u/.85),350,{color:MX.good,w:10})+fade(fg,label('増える',1100,395,{size:24,color:MX.hi,anchor:'end',weight:700})));
  inner+=fade(fg,label('一歩 ＝ 道に沿った長さ',cx,455,{size:24,color:MX.good,anchor:'middle',weight:700}));
  s+=callout(760,105,410,395,inner,kg);
  s+=tatoe(kg);
  return stage(ctx,p,s);
 },
 // 本物に戻る：半径 r（白い点線）と一歩 Δℓ（緑の矢印）は別物。一歩③ → 磁場の成分 → カード③（21 22）
 'mx4-n-card':(p,ctx)=>{const T=ctx.t,R=180,N=12,hg=on(ctx,'はんけいと',.5),lg=on(ctx,'デルタ エルと',.5),tg=on(ctx,'さんばんめ',.5),bg=on(ctx,'せいぶん',.5),cg=on(ctx,'カード さんに',.5);
  const A=i=>Math.PI/2+2.5*2*Math.PI/N-2*Math.PI*i/N,P=i=>pj(R*Math.cos(A(i)),R*Math.sin(A(i)));
  let rings=ringPlate(R,{color:MX.good,w:3,op:.5});
  for(let i=0;i<N;i++){const [x,y]=P(i);rings+=dot(x,y,4,'#ffffff');}
  for(let i=0;i<N;i++){const am=A(i+.5),[x,y]=pj((R+34)*Math.cos(am),(R+34)*Math.sin(am));if(i!==2)rings+=fade(tg*.8,num(i+1,x,y,{r:12,fill:'#9fb0cf'}));}
  let s=base4(ctx,{c:1,T,rings});
  const [x2,y2]=P(2),[x3,y3]=P(3),am=A(2.5),[xm,ym]=pj(R*Math.cos(am),R*Math.sin(am)),[bx,by]=bDir(am);
  // radius: from the wire to the step (white, dashed) — not the step
  s+=fade(hg,line(P4.cx,P4.cy,x2,y2,{color:'#ffffff',w:3,dash:'8 6'})+tex('r',mix(P4.cx,x2,.5)-26,mix(P4.cy,y2,.5)+4,{size:30,color:'#ffffff',auto:false}));
  // the step along the path (green, solid arrow)
  s+=fade(lg,arrow(x2,y2,x3,y3,{color:MX.good,w:8,head:16})+tex('\\Delta\\ell',x2-36,y2+30,{size:30,color:MX.good,auto:false}));
  s+=fade(tg,num(3,...pj((R+40)*Math.cos(am),(R+40)*Math.sin(am)),{r:15}));
  s+=fade(bg,arrow(xm-40*bx,ym-22,xm+40*bx,ym-22+80*by,{color:MX.B,w:6,head:16})+label('磁場',xm+48,ym-30,{size:22,color:MX.B,weight:700}));
  s+=callout(40,100,300,100,label('r：電線からの距離',60,140,{size:22,color:'#ffffff',weight:700})+fade(lg,label('Δℓ：道に沿った一歩',60,180,{size:22,color:MX.good,weight:700})),hg);
  let inner=fade(tg,num(3,800,160,{r:20})+label('3番目の一歩',832,170,{size:26,color:MX.ink,weight:700}));
  inner+=fade(bg,label('道に沿った 磁場の成分',780,235,{size:22,color:MX.B,weight:700})+label('（この円では 磁場そのもの）',780,265,{size:20,color:MX.dim}));
  inner+=fade(cg,card(790,300,340,120,{n:3,hi:true,inner:fit(`${cB('B_{\\parallel,3}')}\\times{\\color{${MX.good}}\\Delta\\ell_3}`,975,362,260,46,{auto:false,color:MX.ink})})
   +label('単位は T·m（テスラ × メートル）',960,460,{size:20,color:MX.dim,anchor:'middle'}));
  s+=panel(tg,inner);
  return stage(ctx,p,s);
 },
 // 全ての一歩でカード → 全部足す。カードは数なので向かい側と打ち消し合わない（34 22）
 'mx4-n-cards':(p,ctx)=>{const T=ctx.t,R=180,N=12,wg=since(ctx,'すべての'),sg=on(ctx,'ぜんぶ',.5),vg=on(ctx,'むかいがわと',.5),pg=on(ctx,'どれも',.5);
  const u=clamp(wg/Math.max(1.5,at(ctx,'ぜんぶ')-at(ctx,'すべての'))),k=Math.floor(u*N+1e-6);
  const A=i=>Math.PI/2+2.5*2*Math.PI/N-2*Math.PI*i/N,P=i=>pj(R*Math.cos(A(i)),R*Math.sin(A(i)));
  let rings=ringPlate(R,{color:MX.good,w:3,op:.5});
  for(let i=0;i<N;i++){const am=A(i+.5),[x,y]=pj((R+34)*Math.cos(am),(R+34)*Math.sin(am));rings+=num(i+1,x,y,{r:12,fill:i<k?MX.hi:'#5b6c8f'});}
  // opposite sides: the arrows point opposite ways, but both cards are +
  for(const i of [2,8]){const am=A(i+.5),[x,y]=pj(R*Math.cos(am),R*Math.sin(am)),[bx,by]=bDir(am);rings+=fade(vg,arrow(x,y,x+80*bx,y+80*by,{color:MX.B,w:6,head:16}));}
  let s=base4(ctx,{c:1,T,rings});
  const ph=A(u*N),[wx,wy]=pj(R*Math.cos(ph),R*Math.sin(ph));s+=walker(wx,wy,1-sg);
  s+=fade(vg,word('③と⑨：矢印は 逆向き',40,140,{size:22,color:MX.B}));
  let inner=label('一歩ごとの カード',960,145,{size:26,color:MX.ink,anchor:'middle',weight:700});
  for(let i=0;i<N;i++){const c=i%4,r=Math.floor(i/4),x=770+c*100,y=170+r*72;
   inner+=card(x,y,86,58,{n:i+1,g:i<k?1:0,hi:(i===2||i===8)&&vg>0,inner:label('＋',x+60,y+42,{size:28,color:MX.good,anchor:'middle',weight:700})});}
  inner+=fade(sg,label('全部 足す',960,420,{size:26,color:MX.hi,anchor:'middle',weight:700}));
  inner+=fade(vg,label('カードは 数：打ち消し合わない',960,458,{size:22,color:MX.ink,anchor:'middle',weight:700}));
  inner+=fade(pg,label('この円では どれも ＋',960,490,{size:22,color:MX.good,anchor:'middle',weight:700}));
  s+=panel(1,inner,{y:100,h:410});
  return stage(ctx,p,s);
 },
 // 一歩を細かく分ける → 合計は一つの値に近づく（32）
 'mx4-n-fine':(p,ctx)=>{const T=ctx.t,R=180,sg=on(ctx,'みじかく',.4),hg=on(ctx,'ほぼ',.5),cg=on(ctx,'こまかく',.4),vg=on(ctx,'ちかづき',.5);
  const lv=clamp(since(ctx,'みじかく')/1.2)+clamp(since(ctx,'こまかく')/.9)+clamp(since(ctx,'こまかく')/.9-1.1);
  const Ns=[6,12,24,48],n=Ns[Math.min(3,Math.floor(lv))];
  let rings=ringPlate(R,{color:'#ffffff',w:2,op:.3});
  const P=i=>pj(R*Math.cos(Math.PI/2-2*Math.PI*i/n),R*Math.sin(Math.PI/2-2*Math.PI*i/n));
  let pts=[];for(let i=0;i<=n;i++)pts.push(P(i));rings+=draw(pts,1,{color:MX.good,w:4});for(let i=0;i<n;i++){const [x,y]=P(i);rings+=dot(x,y,4,'#ffffff');}
  let s=base4(ctx,{c:1,T,rings});
  // one step, enlarged: the chord and the field at its middle
  const [x0,y0]=P(0),[x1,y1]=P(1),mx=(x0+x1)/2,my=(y0+y1)/2,[bx,by]=bDir(Math.PI/2-Math.PI/n);
  s+=fade(hg,arrow(mx,my,mx+60*bx,my+60*by,{color:MX.B,w:5,head:14}));
  const Nt=`${n}`;
  s+=panel(1,label('一歩を 短く分ける',960,160,{size:28,color:MX.ink,anchor:'middle',weight:700})
   +label(`一周を ${Nt} 歩`,960,220,{size:30,color:MX.good,anchor:'middle',weight:700})
   +fade(hg,label('短い一歩：ほぼまっすぐ',960,285,{size:24,color:MX.ink,anchor:'middle'})+label('磁場も ほぼ一定',960,320,{size:24,color:MX.ink,anchor:'middle'}))
   +fade(cg,fit(`\\sum ${cB('B_{\\parallel}')}\\,{\\color{${MX.good}}\\Delta\\ell}`,960,390,320,40,{auto:false,color:MX.ink}))
   +fade(vg,label('→ 一つの値に 近づく',960,450,{size:26,color:MX.hi,anchor:'middle',weight:700})));
  return stage(ctx,p,s);
 },
 // 「一周の足し算」と名付ける。記号の dr は位置の小さな変化＝道に沿った一歩で、半径 r の変化ではない（必ず直す・21）
 'mx4-n-sum':(p,ctx)=>{const T=ctx.t,R=180,ng=on(ctx,'たしざんと',.5),dg=on(ctx,'ディー アール',.5),pg=on(ctx,'いちが',.5),hg=on(ctx,'はんけい アールの',.5);
  const a0=1.0,a1=.2,[x0,y0]=pj(R*Math.cos(a0),R*Math.sin(a0)),[x1,y1]=pj(R*Math.cos(a1),R*Math.sin(a1));
  let rings=ringPlate(R,{color:MX.good,w:4,op:.7});
  rings+=fade(hg,line(P4.cx,P4.cy,x0,y0,{color:'#ffffff',w:3,dash:'8 6'})+line(P4.cx,P4.cy,x1,y1,{color:'#ffffff',w:3,dash:'8 6'})+label('r',mix(P4.cx,x1,.5),mix(P4.cy,y1,.5)-12,{size:28,color:'#ffffff',weight:700})+label('r',mix(P4.cx,x0,.6),mix(P4.cy,y0,.6)+32,{size:28,color:'#ffffff',weight:700}));
  rings+=fade(pg,arrow(x0,y0,x1,y1,{color:MX.good,w:8,head:16})+dot(x0,y0,6,'#ffffff'));
  let s=base4(ctx,{c:1,T,rings});
  s+=walker(x0,y0,1-pg);
  s+=fade(pg,word('dr：位置が少し動いた分 ＝ 一歩',40,128,{size:22,color:MX.good}));
  s+=fade(hg,word('半径 r は 同じまま',40,190,{size:22,color:'#ffffff'}));
  const src=`\\oint ${cB('\\vec B')}\\cdot{\\color{${dg>0?MX.good:MX.ink}}d\\vec r}`;
  s+=panel(1,label('一周の足し算',960,150,{size:34,color:MX.hi,anchor:'middle',weight:700})
   +fade(ng,fit(src,960,250,300,54,{auto:false,color:MX.ink}))
   +label('細かく分けた合計の 行き着く値',960,320,{size:22,color:MX.ink,anchor:'middle'})
   +fade(dg,label('dr ＝ 道に沿った一歩',960,385,{size:26,color:MX.good,anchor:'middle',weight:700}))
   +fade(hg,label('半径 r の変化 ではない',960,440,{size:26,color:MX.hi,anchor:'middle',weight:700})));
  return stage(ctx,p,s);
 },
 // 道をほどいてグラフへ：横＝歩いた距離、縦＝道に沿った成分。カード1枚＝細い長方形（23）
 'mx4-n-graph':(p,ctx)=>stage(ctx,p,graphScene(ctx,{hg:on(ctx,'ほどいて',.5),xg:on(ctx,'よこに',.5),yg:on(ctx,'たてに',.5),cg:on(ctx,'カード いちまい',.5),bg:on(ctx,'おび ぜんたい',.5),walk:since(ctx,'よこに')})),
 // 電線を中心とする円：どこも同じ向き・同じ強さ → 高さ B、幅 2πr の長方形 → B × 2πr（24）
 'mx4-n-rect':(p,ctx)=>stage(ctx,p,graphScene(ctx,{hg:1,xg:1,yg:1,cg:0,bg:0,walk:99,cond:on(ctx,'ちゅうしんと',.5),eg:on(ctx,'どこも',.5),mg:on(ctx,'グラフは',.8),hb:on(ctx,'たかさ',.5),wb:on(ctx,'はば',.5),fg:on(ctx,'いっしゅうの たしざんは',.5)})),
 // 補足：π = 円周 ÷ 直径 → 円周 = 2πr（33）
 'mx4-n-pi':(p,ctx)=>{const T=ctx.t,pg=on(ctx,'えんしゅうりつ',.5),dg=on(ctx,'ちょっけい',.5),cg=on(ctx,'いっしゅうは',.5),rg=on(ctx,'つまり',.5);
  let s=fade(.3,base4(ctx,{c:1,T,rings:ringPlate(180,{color:MX.good,w:5})}));
  s+=hosoku(1);
  const cx=960,cy=280,R=105;
  let inner=ring(cx,cy,R,{color:MX.good,w:5});
  inner+=fade(dg,line(cx-R,cy,cx+R,cy,{color:'#ffffff',w:4})+dot(cx,cy,5,'#ffffff')+label('直径 2r',cx,cy-14,{size:24,color:MX.ink,anchor:'middle',weight:700}));
  inner+=fade(pg,tex('\\pi',cx-110,152,{size:46,color:MX.hi,auto:false})+label('＝ 円周 ÷ 直径',cx-80,158,{size:26,color:MX.ink,weight:700}));
  inner+=fade(cg,label('円周 ＝ π × 2r',cx,cy+R+50,{size:28,color:MX.good,anchor:'middle',weight:700}));
  inner+=fade(rg,fit(`=2\\pi r`,cx,cy+R+95,160,40,{auto:false,color:MX.hi}));
  s+=callout(740,105,440,400,inner,1);
  return stage(ctx,p,s);
 },
 // 計算：出発点の式 B = μ0 I / 2πr を入れると 2πr が約分で消える
 'mx4-n-cancel':(p,ctx)=>{const T=ctx.t,R=180,ig=on(ctx,'いれると',.5),sk=clamp(since(ctx,'やくぶん')/.6),rg=on(ctx,'のこります',.5),og=on(ctx,'しゅっぱつてん',.5);
  const [x,y]=pj(0,R);
  let s=base4(ctx,{c:1,T,rings:ringPlate(R,{color:MX.good,w:5})});
  s+=arrow(x,y,x+90,y,{color:MX.B,w:6,head:18});
  s+=fade(og*(1-ig),word('出発点の式',P4.cx+120,200,{size:24,color:MX.hi}));
  const size=46,cx=960,y1=290,f1=`\\dfrac{\\mu_0 ${cI('I')}}{2\\pi r}`,w1=texWidth(f1,size,false),w2=texWidth('\\times',size,false),w3=texWidth('2\\pi r',size,false),gap=14,tot=w1+w2+w3+2*gap,x0=cx-tot/2;
  let pn=label('一周の足し算',cx,160,{size:28,color:MX.hi,anchor:'middle',weight:700})+fade(1-ig,fit(`${cB('B')}\\times{\\color{${MX.good}}2\\pi r}`,cx,y1,300,50,{auto:false,color:MX.ink}));
  pn+=fade(ig,tex(f1,x0+w1/2,y1,{size,auto:false,color:MX.ink})+tex('\\times',x0+w1+gap+w2/2,y1,{size,auto:false,color:MX.ink})+tex('2\\pi r',x0+w1+w2+2*gap+w3/2,y1,{size,auto:false,color:MX.good}));
  const wd=texWidth('2\\pi r',size*.72,false);
  if(sk>0){pn+=line(x0+w1/2-wd/2-4,y1+30,mix(x0+w1/2-wd/2-4,x0+w1/2+wd/2+4,sk),y1+14,{color:MX.plus,w:5})+line(x0+w1+w2+2*gap-4,y1+8,mix(x0+w1+w2+2*gap-4,x0+tot+4,sk),y1-14,{color:MX.plus,w:5});}
  pn+=fade(rg,fit(`=\\;\\mu_0 ${cI('I')}`,cx,400,300,64,{auto:false,color:MX.hi}));
  s+=panel(1,pn);
  return stage(ctx,p,s);
 },
 // 2πr が消えた意味を長方形で：半径 2倍 → 高さ ½・幅 2倍 → 面積は同じ（⑧、24）
 'mx4-n-meaning':(p,ctx)=>{const T=ctx.t,R1=110,R2=220,pg=on(ctx,'ちょうほうけいで',.5),fg=on(ctx,'はんけいを',.6),hg=on(ctx,'たかさの',.5),wg=on(ctx,'はばの',.5),ag=on(ctx,'めんせきは',.5),ig=on(ctx,'かこんだ',.5);
  const [x1,y1]=pj(0,R1),[x2,y2]=pj(0,R2);
  let rings=ringPlate(R1,{color:MX.good,w:5})+fade(fg,ringPlate(R2,{color:MX.good,w:5,p:clamp(since(ctx,'はんけいを')/.8)}));
  rings+=arrow(x1,y1,x1+100,y1,{color:MX.B,w:6,head:16})+fade(hg,arrow(x2,y2,x2+50,y2,{color:MX.B,w:6,head:16}));
  let s=base4(ctx,{c:1,T,rings,glow:ig*(.6+.4*Math.sin(T*6))});
  const base=400,H=150,W=100;
  let inner=label('一周の足し算 ＝ 長方形の面積',960,150,{size:24,color:MX.ink,anchor:'middle',weight:700});
  inner+=`<rect x="780" y="${base-H}" width="${W}" height="${H}" fill="${MX.B}" fill-opacity=".45" stroke="${MX.B}" stroke-width="3"/>`+label('小さい円',830,base+34,{size:22,color:MX.ink,anchor:'middle',weight:700});
  const h2=mix(H,H/2,hg),w2=mix(W,2*W,wg);
  inner+=fade(fg,`<rect x="920" y="${base-h2}" width="${w2}" height="${h2}" fill="${MX.B}" fill-opacity=".45" stroke="${MX.B}" stroke-width="3"/>`+label('半径 2倍の円',1020,base+34,{size:22,color:MX.ink,anchor:'middle',weight:700}));
  inner+=line(760,base,1150,base,{color:MX.dim,w:2});
  inner+=fade(hg,label('高さ B：½',1030,base-h2-44,{size:22,color:MX.B,anchor:'middle',weight:700}));
  inner+=fade(wg,label('幅（一周）：2倍',1020,base-h2-14,{size:22,color:MX.good,anchor:'middle',weight:700}));
  inner+=fade(ag,label('面積は 同じ',960,480,{size:26,color:MX.hi,anchor:'middle',weight:700})+check(1090,470,ag));
  s+=panel(1,fade(pg,inner));
  return stage(ctx,p,s);
 },
 // 確認：同じ円を逆回りに一周したら？（35 の準備）
 'mx4-n-check':(p,ctx)=>{const T=ctx.t,R=180,sg=on(ctx,'ぎゃくまわり',.5),pul=.5+.5*Math.sin(T*6);
  const u=clamp(since(ctx,'ぎゃくまわり')/2.2)%1,ph=Math.PI/2+2*Math.PI*u;
  let rings=loopPlate(R,{op:sg,dir:-1,flow:T*.12});
  for(const a of [Math.PI/2,0,Math.PI]){const [x,y]=pj(R*Math.cos(a),R*Math.sin(a)),[bx,by]=bDir(a);rings+=arrow(x,y,x+55*bx,y+55*by,{color:MX.B,w:5,head:14});}
  let s=base4(ctx,{c:1,T,rings});
  const [x,y]=pj(R*Math.cos(ph),R*Math.sin(ph));s+=walker(x,y,sg);
  s+=panel(sg,label('逆回りに 一周すると',960,200,{size:30,color:MX.ink,anchor:'middle',weight:700})+label('一周の足し算は？',960,250,{size:30,color:MX.ink,anchor:'middle',weight:700})+label('？',960,390,{size:80+8*pul,color:MX.hi,anchor:'middle',weight:700}),{y:120,h:340});
  return stage(ctx,p,s);
 },
 // 答え：どの一歩も磁場と逆向き → 成分マイナス → −μ0 I
 'mx4-n-zero':(p,ctx)=>{const T=ctx.t,R=180,og=on(ctx,'むかいかぜ',.5),mg=on(ctx,'マイナス',.5),ag=on(ctx,'マイナス ミューゼロ',.5);
  let rings=loopPlate(R,{dir:-1,flow:T*.12});
  const [x,y]=pj(0,R);
  rings+=arrow(x,y,x+90,y,{color:MX.B,w:6,head:18})+fade(og,arrow(x-10,y+16,x-100,y+16,{color:MX.good,w:7,head:18})+label('一歩',x-170,y+26,{size:24,color:MX.good,weight:700}));
  let s=base4(ctx,{c:1,T,rings});
  s+=panel(1,label('逆回り',960,170,{size:30,color:MX.ink,anchor:'middle',weight:700})
   +fade(og,label('どの一歩も 向かい風（磁場と逆向き）',960,240,{size:22,color:MX.ink,anchor:'middle'}))
   +fade(mg,label('点数は マイナス',960,295,{size:26,color:MX.hi,anchor:'middle',weight:700}))
   +fade(ag,fit(`=\\;-\\mu_0 ${cI('I')}`,960,390,280,60,{auto:false,color:MX.hi})+check(1110,380,ag)),{y:120,h:340});
  return stage(ctx,p,s);
 },
 // ゆがんだ道：遠ざかる所は直角で 0（34）
 'mx4-n-bent':(p,ctx)=>{const dg=on(ctx,'ゆがんだ',.8),zg=on(ctx,'とおざかる',.5);
  return stage(ctx,p,bentScene(ctx,{dg,zg,ag:0,fg:0,tg:0,title:true}));
 },
 // 補足：弧の長さ ＝ 2πr × 中心角の割合（33）
 'mx4-n-arc':(p,ctx)=>{const T=ctx.t,ag=on(ctx,'ちゅうしんかく',.6),fg=on(ctx,'よんぶんの',.6);
  let s=fade(.3,bentScene(ctx,{dg:1,zg:0,ag:0,fg:0,tg:0,title:false}));
  s+=hosoku(1);
  const cx=960,cy=280,R=100,u=.75*clamp(since(ctx,'ちゅうしんかく')/1.2);
  let inner=pie(cx,cy,R,u,{color:MX.B,op:.35});
  if(u>0){const pts=[];for(let i=0;i<=60;i++){const a=Math.PI/2+2*Math.PI*u*i/60;pts.push([cx+R*Math.cos(a),cy-R*Math.sin(a)]);}inner+=draw(pts,1,{color:MX.good,w:6});}
  inner+=label('一周 ＝ 2πr',cx,145,{size:26,color:MX.ink,anchor:'middle',weight:700});
  inner+=fade(ag,label('弧 ＝ 2πr × 角度の割合',cx,cy+R+50,{size:26,color:MX.good,anchor:'middle',weight:700}));
  inner+=fade(fg,label('¾周 → 2πr × ¾',cx,cy+R+100,{size:28,color:MX.hi,anchor:'middle',weight:700}));
  s+=callout(740,105,440,400,inner,1);
  return stage(ctx,p,s);
 },
 // 弧では 1/r と r が相殺 → 角度の割合 ¾ と ¼ → 合計 μ0 I（33 34）
 'mx4-n-bentsum':(p,ctx)=>{const ag=on(ctx,'はんけいに',.5),fg=on(ctx,'よんぶんの',.5),tg=on(ctx,'あわせて',.5);
  return stage(ctx,p,bentScene(ctx,{dg:1,zg:1,ag,fg,tg,title:true,sum:true}));
 },
 // どんな一歩も「回る部分」と「近づく・離れる部分」に分けられる。たとえ：扇風機（電線）のまわりを回る（25）
 'mx4-n-split':(p,ctx)=>{const T=ctx.t,vg=clamp(T/.6),lg=on(ctx,'かたち',.6),fg=on(ctx,'せんぷうき',.5),sg=on(ctx,'どんな いっぽも',.5),cg=on(ctx,'まわる ぶぶん',.5),rg=on(ctx,'ちかづく',.5);
  let s=tvField(.3)+fan(TV.x,TV.y,T,fg)+draw(WOB,lg,{color:MX.good,w:5})+wireDot(TV.x,TV.y,1,1);
  s+=word('上から見た図',40,190,{size:22,color:MX.ink,g:vg});
  s+=tatoe(fg);s+=fade(fg,label('扇風機 ＝ 電線',TV.x+130,488,{size:22,color:TAT,weight:700}));
  s+=label('電流 ⊙＝上向き',40,490,{size:22,color:MX.I,weight:700});
  const th0=.6,th1=.9,[x0,y0]=tvP(wob(th0),th0),[x1,y1]=tvP(wob(th1),th1);
  const [xc,yc]=tvP(wob(th0),th1);
  s+=fade(sg,arrow(x0,y0,x1,y1,{color:MX.good,w:6,head:14})+ring((x0+x1)/2,(y0+y1)/2,40,{color:MX.hi,w:2}));
  const S=4,ox=1090,oy=330,E=(x,y)=>[ox+(x-x0)*S,oy+(y-y0)*S];
  const [X1,Y1]=E(x1,y1),[Xc,Yc]=E(xc,yc);
  let inner=label('この一歩を 拡大',960,150,{size:24,color:MX.ink,anchor:'middle',weight:700})+arrow(ox,oy,X1,Y1,{color:MX.good,w:7,head:18})+label('一歩',(ox+X1)/2+14,(oy+Y1)/2+34,{size:24,color:MX.good,weight:700});
  inner+=fade(cg,arrow(ox,oy,Xc,Yc,{color:MX.B,w:6,head:16})+label('回る部分',(ox+Xc)/2+22,(oy+Yc)/2-12,{size:24,color:MX.B,weight:700}));
  inner+=fade(rg,arrow(Xc,Yc,X1,Y1,{color:'#ffffff',w:6,head:16})+label('近づく・',(Xc+X1)/2-30,(Yc+Y1)/2-6,{size:24,color:MX.ink,weight:700,anchor:'end'})+label('離れる部分',(Xc+X1)/2-30,(Yc+Y1)/2+24,{size:24,color:MX.ink,weight:700,anchor:'end'}));
  s+=callout(740,105,440,400,inner,sg);
  return stage(ctx,p,s);
 },
 // 近づく・離れる＝横風 0、回る部分＝回った角度の割合 × μ0 I。囲めば一周分 → μ0 I（25）
 'mx4-n-anyloop':(p,ctx)=>{const T=ctx.t,zg=on(ctx,'ちかづく',.5),ag=on(ctx,'かくどの',.5),wg=since(ctx,'でんせんを'),og=on(ctx,'いつも',.5),rg=on(ctx,'でんせんを',.5);
  const u=clamp(wg/2.4),th=2*Math.PI*u,[wx,wy]=tvP(wob(th),th);
  let s=tvField(.25)+fan(TV.x,TV.y,T,.8*(1-rg))+draw(WOB,1,{color:MX.good,w:5})+wireDot(TV.x,TV.y,1,1);
  const trail=[];for(let i=0;i<=240*u;i++){const t2=2*Math.PI*i/240;trail.push(tvP(wob(t2),t2));}
  s+=draw(trail,1,{color:MX.hi,w:7});
  s+=fade(ag,line(TV.x,TV.y,wx,wy,{color:'#ffffff',w:2,dash:'6 6'}))+walker(wx,wy,clamp(wg/.3));
  s+=word('上から見た図',40,190,{size:22,color:MX.ink});s+=tatoe(1-rg);
  const cx=960,cy=300;
  let inner=fade(zg,label('近づく・離れる部分：横風 0',960,150,{size:24,color:MX.ink,anchor:'middle',weight:700}))
   +fade(ag,label('回る部分：角度の割合 ×',930,190,{size:24,color:MX.B,anchor:'middle',weight:700})+tex(`\\mu_0 ${cI('I')}`,1110,184,{size:30,color:MX.B,auto:false})+pie(cx,cy,80,u)+label(`${Math.round(360*u)}°`,cx,cy+12,{size:30,color:MX.ink,anchor:'middle',weight:700}))
   +fade(clamp(u*1.2-.2)*ag,label('電線のまわりを 回った角度',cx,cy+115,{size:22,color:MX.ink,anchor:'middle'}))
   +fade(og,fit(`\\tfrac{360^\\circ}{360^\\circ}\\times\\mu_0 ${cI('I')}=\\mu_0 ${cI('I')}`,cx,465,380,40,{auto:false,color:MX.hi}));
  s+=callout(740,105,440,400,inner,zg);
  return stage(ctx,p,s);
 },
 // 囲まない道：行きに回った角度を、帰りに逆回りで引く → 最後は 0（26）
 'mx4-n-outside':(p,ctx)=>{const T=ctx.t,wg=since(ctx,'でんせんを'),bg=on(ctx,'かえりに',.5),zg=on(ctx,'ごうけいは',.5),ig=on(ctx,'かこんだ',.5),eg=on(ctx,'さいごは',.5);
  const O2={x:560,y:300},R2=95;
  const u=clamp(wg/Math.max(2.8,at(ctx,'さいごは')-at(ctx,'でんせんを'))),a=Math.PI+2*Math.PI*u;
  const pt=b=>[O2.x+R2*Math.cos(b),O2.y-R2*Math.sin(b)];
  const [wx,wy]=pt(a);
  const ang=b=>{const [x,y]=pt(b);return Math.atan2(-(y-TV.y),x-TV.x);};
  let sw=0,prev=ang(Math.PI);for(let i=1;i<=100;i++){const cur=ang(Math.PI+2*Math.PI*u*i/100);let d=cur-prev;d=Math.atan2(Math.sin(d),Math.cos(d));sw+=d;prev=cur;}
  const dNow=ang(a+.02)-ang(a);const turning=u>0&&u<1?(Math.atan2(Math.sin(dNow),Math.cos(dNow))>0?1:-1):0;
  const ring2=[];for(let i=0;i<=120;i++)ring2.push(pt(2*Math.PI*i/120));
  let s=tvField(.25)+draw(ring2,1,{color:MX.good,w:5})+wireDot(TV.x,TV.y,1,1,17)+fade(ig,ring(TV.x,TV.y,30,{color:MX.I,w:3}));
  s+=line(TV.x,TV.y,wx,wy,{color:'#ffffff',w:3,dash:'6 6'})+walker(wx,wy,clamp(wg/.3));
  s+=word('上から見た図',40,190,{size:22,color:MX.ink});
  s+=word('電線を 囲まない道',560,470,{size:24,color:MX.good,anchor:'middle'});
  const deg=Math.round(sw*180/Math.PI),cx=960,cy=280;
  let inner=label('電線のまわりを 回った角度',cx,150,{size:24,color:MX.ink,anchor:'middle',weight:700})+pie(cx,cy,80,sw/(2*Math.PI))
   +label(`${deg>0?'+':''}${deg}°`,cx,cy+12,{size:30,color:MX.ink,anchor:'middle',weight:700})
   +(turning>0?label('足す（反時計回り）',cx,cy+118,{size:24,color:MX.good,anchor:'middle',weight:700}):turning<0?label('引く（逆回り）',cx,cy+118,{size:24,color:INC,anchor:'middle',weight:700}):'')
   +fade(eg,label('最後は 0° に戻る',cx,cy+160,{size:24,color:MX.ink,anchor:'middle',weight:700}))
   +fade(zg,label('合計 0',cx,cy+202,{size:30,color:MX.hi,anchor:'middle',weight:700}));
  s+=callout(740,105,440,400,inner,1);
  return stage(ctx,p,s);
 },
 // 符号の約束：回る向き＝4本の指、親指の向きの電流を ＋（35）
 'mx4-n-sign':(p,ctx)=>{const T=ctx.t,dg=on(ctx,'まわる むきに',.5),tg=on(ctx,'おやゆびの',.5),pg=on(ctx,'プラス',.5),mg=on(ctx,'ぎゃくむきを',.5);
  const X2=95,Z2=-40;
  let rings=`<ellipse cx="${P4.cx}" cy="${P4.cy}" rx="${RC}" ry="${RC*P4.k}" fill="#ffffff" fill-opacity="${.10*dg}"/>`+loopPlate(RC,{flow:T*.12,heads:dg});
  let s=wireLower(1)+fade(mg,wireLowerAt(X2,Z2))+plate()+rings+wireUpper(1,T,{lab:''})+fade(mg,wireUpperAt(X2,Z2,1,T,{dir:-1,lab:'',top:190}));
  // thumb arrow = positive direction, beside the loop
  const [tx,ty]=pj(-RC-40,0);
  s+=fade(tg,arrow(tx,ty,tx,ty-150,{color:'#ffffff',w:7,head:20})+label('親指',tx-10,ty-165,{size:24,color:MX.ink,anchor:'end',weight:700}));
  s+=fade(pg,word('＋',P4.cx-50,190,{size:28,color:MX.good}));
  const [x2]=pj(X2,Z2);s+=fade(mg,word('−',x2+30,230,{size:28,color:MX.plus}));
  s+=panel(1,label('囲んだ電流の 符号',960,150,{size:28,color:MX.ink,anchor:'middle',weight:700})
   +fade(dg,label('4本の指 → 回る向き',960,215,{size:26,color:MX.good,anchor:'middle',weight:700}))
   +fade(tg,label('親指の向きの電流 → ＋',960,270,{size:26,color:MX.ink,anchor:'middle',weight:700}))
   +fade(mg,label('逆向きの電流 → −',960,325,{size:26,color:MX.ink,anchor:'middle',weight:700}))
   +fade(mg,line(780,360,1140,360,{color:MX.faint,w:2})+label('さっきの逆回り：親指が下',960,400,{size:22,color:MX.ink,anchor:'middle'})+fit(`-${cI('I')}\\;\\to\\;-\\mu_0 ${cI('I')}`,930,450,220,34,{auto:false,color:MX.hi})+check(1090,445,mg)));
  return stage(ctx,p,s);
 },
 // 何本も：重ね合わせ → 一周の足し算も足し合わせ。上 3 A・下 1 A → 2 A（35）
 'mx4-n-opposite':(p,ctx)=>{const T=ctx.t,sg=on(ctx,'かさねあわせ',.5),ug=on(ctx,'うわむき',.5),dg=on(ctx,'したむき',.5),rg=on(ctx,'さの',.5);
  const A=[-75,20],B2=[85,-20];
  let rings=`<ellipse cx="${P4.cx}" cy="${P4.cy}" rx="${RC+20}" ry="${(RC+20)*P4.k}" fill="#ffffff" fill-opacity=".08"/>`+loopPlate(RC+20,{flow:T*.12});
  let s=wireLowerAt(...A)+wireLowerAt(...B2)+plate()+rings+wireUpperAt(...A,1,T,{I:2,lab:''})+wireUpperAt(...B2,1,T,{dir:-1,lab:'',top:190});
  const [xa]=pj(...A),[xb]=pj(...B2);
  s+=fade(ug,word('3 A',xa-40,230,{size:26,color:MX.I,anchor:'end'}))+fade(dg,word('1 A',xb+30,260,{size:26,color:MX.I}));
  s+=panel(1,fade(sg,label('磁場を 重ね合わせる',960,160,{size:26,color:MX.ink,anchor:'middle',weight:700})+label('→ 一周の足し算も 足し合わせ',960,205,{size:24,color:MX.ink,anchor:'middle'}))
   +fade(ug,fit(`(+3\\,\\mathrm{A})`,860,290,160,40,{auto:false,color:MX.I}))+fade(dg,fit(`+\\,(-1\\,\\mathrm{A})`,1040,290,190,40,{auto:false,color:MX.I}))
   +fade(rg,fit(`=\\;2\\,\\mathrm{A}`,960,370,200,48,{auto:false,color:MX.hi})+label('囲んだ電流は 差',960,440,{size:26,color:MX.hi,anchor:'middle',weight:700})));
  return stage(ctx,p,s);
 },
 // 示した範囲と、法則として採用する範囲（34）
 'mx4-n-scope':(p,ctx)=>{const T=ctx.t,cg=on(ctx,'たしかめた',.5),bg=on(ctx,'まがった',.6),ag=on(ctx,'じっけんに',.5);
  // left card: straight wire (what was shown)
  let L=line(300,195,300,440,{color:MX.I,w:10})+`<ellipse cx="300" cy="330" rx="110" ry="36" fill="none" stroke="${MX.good}" stroke-width="5"/>`+head(300,185,-Math.PI/2,MX.I,18);
  L+=label('まっすぐな電線',300,480,{size:24,color:MX.ink,anchor:'middle',weight:700})+check(470,170,cg);
  L+=label('出発点の式 ＋ 分けて足す',300,130,{size:22,color:MX.ink,anchor:'middle'});
  let s=callout(60,95,480,410,L,cg);
  // right card: any steady current (adopted as a law)
  const wire=[];for(let i=0;i<=80;i++){const u=i/80;wire.push([660+440*u,420-200*u+60*Math.sin(u*Math.PI*2.2)]);}
  let R=draw(wire,1,{color:MX.I,w:9})+`<ellipse cx="880" cy="300" rx="60" ry="100" fill="none" stroke="${MX.good}" stroke-width="5" transform="rotate(-25 880 300)"/>`;
  R+=label('どんな一定の電流でも',880,480,{size:24,color:MX.ink,anchor:'middle',weight:700});
  R+=fade(ag,word('実験に支えられた法則として採用',880,140,{size:22,color:MX.hi,anchor:'middle'}));
  s+=callout(600,95,560,410,R,bg);
  return stage(ctx,p,s);
 },
 // 一定の電流なら、どんな閉じた道でも：アンペールの法則（④の前半）
 'mx4-n-law':(p,ctx)=>{const T=ctx.t,cg=on(ctx,'いっていの',.5),dg=on(ctx,'どんな',.8),lg=on(ctx,'いっしゅうの',.5),ig=on(ctx,'かこんだ',.5),ag=on(ctx,'アンペール',.5);
  const pts=[];for(let i=0;i<=120;i++){const a=2*Math.PI*i/120,r=175*(1+.22*Math.sin(3*a+T*.8)+.1*Math.sin(2*a-1));pts.push(pj(r*Math.cos(a),r*Math.sin(a)));}
  let rings=draw(pts,dg,{color:MX.good,w:5});
  let s=base4(ctx,{c:1,T,rings,glow:ig*(.6+.4*Math.sin(T*6))});
  s+=word('一定の電流',P4.cx+40,215,{size:26,color:MX.I,g:cg});
  const fL=lg>0&&ig<=0?1:ig>0?.4:1,fR=ig>0?1:lg>0?.4:1,cl=u=>u<1?DIM:MX.ink;
  const src=`{\\color{${cl(fL)}}\\oint {\\color{${fL<1?'#8a6a3a':MX.B}}\\vec B}\\cdot d\\vec r}={\\color{${cl(fR)}}\\mu_0 {\\color{${fR<1?'#8a7a3a':MX.I}}I}}`;
  s+=panel(1,fit(src,960,300,380,56,{auto:false,color:MX.ink})
   +fade(cg,word('一定の電流のとき',960,170,{size:24,color:MX.I,anchor:'middle'}))
   +fade(lg,label('一周の足し算',860,395,{size:22,color:MX.hi,anchor:'middle',weight:700}))
   +fade(ig,label('囲んだ電流 ×',1040,395,{size:22,color:MX.hi,anchor:'middle',weight:700})+tex('\\mu_0',1122,392,{size:26,color:MX.hi,auto:false}))
   +fade(ag,label('アンペールの法則',960,460,{size:30,color:MX.hi,anchor:'middle',weight:700})));
  return stage(ctx,p,s);
 },
 // 一定の電流＝定常：どの場所でも電流も電荷の量も時間で変わらない → 電荷はたまらない（必ず直す・27）
 'mx4-n-steady':(p,ctx)=>steadyScene(p,ctx,{pg:on(ctx,'どの ばしょでも',.5),ig:on(ctx,'でんりゅうも',.5),qg:on(ctx,'でんかの りょうも',.5),sg:on(ctx,'ていじょうな',.5),dg:on(ctx,'だから',.5),cg:0,xg:0,ng:0}),
 // コンデンサに電荷がたまる場面では条件が外れる → 第6章（27）
 'mx4-n-steady2':(p,ctx)=>steadyScene(p,ctx,{pg:1,ig:1,qg:1,sg:1,dg:1,cg:on(ctx,'コンデンサに',.5),xg:on(ctx,'はずれ',.5),ng:on(ctx,'だいろくしょう',.5),since0:since(ctx,'たまって')}),
 // 電流 → 磁場。逆に 磁場 → 電流 は？
 'mx4-n-to-faraday':(p,ctx)=>{const T=ctx.t;
  let s=base4(ctx,{c:1,T,rings:[100,RC,240].map(r=>ringPlate(r,{op:.6,heads:1,flow:T*.12})).join('')});
  s+=fade(on(ctx,'でんりゅうが',.5),callout(760,140,420,110,causal('電流','磁場',970,208,{ca:MX.I,cb:MX.B,size:36})));
  const q=on(ctx,'ぎゃくに',.6),pul=.5+.5*Math.sin(T*6);
  s+=fade(q,callout(760,320,420,110,causal('磁場','電流',940,388,{ca:MX.B,cb:MX.I,size:36})+label('？',1120,396,{size:44+6*pul,color:MX.hi,anchor:'middle',weight:700})));
  s+=fade(q,arrow(970,262,970,310,{color:MX.dim,w:4,head:12})+label('逆は？',1000,295,{size:24,color:MX.dim}));
  return stage(ctx,p,s);
 },
};

// Bent path on the plate: inner arc r1 over φ ∈ [q, 2π−q], radial out at φ=−q, outer arc r2 over [−q, q], radial in at φ=q.
// Walking direction marks follow B (decreasing φ, counter-clockwise seen from above).
function bentScene(ctx,{dg,zg,ag,fg,tg,title,sum=false}){const T=ctx.t,r1=110,r2=230,q=Math.PI/4;
 const inner=[],outer=[];for(let i=0;i<=72;i++){inner.push(PA(r1,q+(2*Math.PI-2*q)*i/72));}for(let i=0;i<=24;i++){outer.push(PA(r2,-q+2*q*i/24));}
 const rad1=[PA(r1,-q),PA(r2,-q)],rad2=[PA(r2,q),PA(r1,q)];
 const glow=(pts,g,col)=>g>0?draw(pts,1,{color:col,w:14,opacity:.3*g}):'';
 let rings=draw([...inner,...rad1.slice(1),...outer.slice(1),...rad2.slice(1)],dg,{color:MX.good,w:5});
 rings+=glow(rad1,zg*(1-tg),'#ffffff')+glow(rad2,zg*(1-tg),'#ffffff')+glow(inner,ag*(1-tg),MX.B)+glow(outer,ag*(1-tg),MX.B);
 for(const [r,a] of [[r1,Math.PI/2],[r1,Math.PI],[r1,3*Math.PI/2],[r2,0],[r1+60,q],[r1+60,-q]]){const [x,y]=PA(r,a),[bx,by]=bDir(a),Ls=r===r2?30:55;rings+=fade(dg,arrow(x,y,x+Ls*bx,y+Ls*by,{color:MX.B,w:5,head:14}));}
 // walking direction heads along the path (same sense as B on the arcs)
 for(const [r,a] of [[r1,Math.PI*1.25],[r1,Math.PI*.75],[r2,-.2]]){const [x,y]=PA(r,a),[bx,by]=bDir(a);rings+=fade(dg,head(x,y,Math.atan2(by,bx),MX.good,15));}
 {// walking along B: outward on the radial at φ=q, inward on the radial at φ=−q
  const [x0,y0]=PA(r1+50,q),[x1,y1]=PA(r1+60,q);rings+=fade(dg,head(x1,y1,Math.atan2(y1-y0,x1-x0),MX.good,15));
  const [u0,v0]=PA(r1+70,-q),[u1,v1]=PA(r1+60,-q);rings+=fade(dg,head(u1,v1,Math.atan2(v1-v0,u1-u0),MX.good,15));}
 let s=base4(ctx,{c:1,T,rings});
 const [ra,rb]=PA(r1+60,-q),[rc,rd]=PA(r1+60,q);
 s+=fade(zg,word('0',ra+34,rb+26,{size:26,color:'#ffffff'})+word('0',rc+34,rd-6,{size:26,color:'#ffffff'}));
 const [ia,ib]=PA(r1,Math.PI*1.1),[oa,ob]=PA(r2,0);
 const tl=(src,x,y)=>`<rect x="${x-58}" y="${y-30}" width="116" height="50" rx="10" fill="${MX.bg}" fill-opacity=".9" stroke="${MX.B}" stroke-opacity=".6" stroke-width="2"/>`+tex(src,x,y,{size:30,color:MX.B,auto:false});
 s+=fade(fg,tl(`\\tfrac34\\mu_0 I`,ia-80,ib+6)+tl(`\\tfrac14\\mu_0 I`,650,250)+line(640,275,oa-10,ob-40,{color:MX.B,w:2,dash:'5 5'}));
 if(title)s+=panel(zg,label('ゆがんだ道',960,160,{size:30,color:MX.ink,anchor:'middle',weight:700})
  +fade(zg,label('遠ざかる所：横風 → 0',960,225,{size:24,color:MX.ink,anchor:'middle'}))
  +(sum?fade(ag,label('弧：B ∝ 1/r、長さ ∝ r',960,280,{size:24,color:MX.B,anchor:'middle'})+label('→ 半径が消え 角度の割合',960,315,{size:24,color:MX.B,anchor:'middle'})):'')
  +fade(fg,fit(`\\tfrac34\\mu_0 ${cI('I')}+\\tfrac14\\mu_0 ${cI('I')}`,960,375,380,44,{auto:false,color:MX.ink}))
  +fade(tg,fit(`=\\mu_0 ${cI('I')}`,960,445,220,50,{auto:false,color:MX.hi})+check(1110,435,tg)));
 return s;}

// Unrolled path (reviews 23, 24): left, the circle seen from above with numbered steps; right, a graph
// with x = distance walked along the path, y = the component along the path. One step = one thin
// rectangle (height B∥, width Δℓ). It is a graph of values in walking order, not a deformed circle.
function graphScene(ctx,{hg=1,xg=1,yg=1,cg=0,bg=0,walk=99,cond=0,eg=0,mg=0,hb=0,wb=0,fg=0}){const T=ctx.t,N=12,O={x:215,y:315},R=105;
 const u=clamp(walk/2.6),k=Math.floor(u*N+1e-6)+(u>=1?0:0);
 const th=i=>-Math.PI/2-2.5*2*Math.PI/N+2*Math.PI*i/N;
 let s=ring(O.x,O.y,R,{color:MX.good,w:4})+wireDot(O.x,O.y,1,1,14);
 for(let i=0;i<N;i++){const [x,y]=tvP(R+28,th(i+.5),O);s+=num(i+1,x,y,{r:12,fill:i===2&&cg>0?MX.hi:i<Math.min(k,N)?'#c7d2e8':'#5b6c8f'});}
 for(let i=0;i<8;i++){const t=i*Math.PI/4,[x,y]=tvP(R,t,O),[tx,ty]=tvTan(t);s+=fade(eg,arrow(x,y,x+40*tx,y+40*ty,{color:MX.B,w:5,head:13}));}
 if(u<1){const [wx,wy]=tvP(R,th(u*N),O);s+=dot(wx,wy,9,MX.good);}
 s+=label('上から見た道',O.x,128,{size:22,color:MX.ink,anchor:'middle',weight:700});
 // unrolling hint
 s+=fade(hg*(1-mg),draw([[O.x+R+10,O.y+60],[360,470],[430,470]],clamp(hg*1.5),{color:MX.dim,w:3,dash:'7 6'})+label('ほどく',350,500,{size:22,color:MX.dim,anchor:'middle',weight:700}));
 // graph
 const gx=450,gy=430,W=660,w=W/N,Hh=180,top=gy-Hh;
 s+=fade(xg,arrow(gx,gy,gx+W+50,gy,{color:MX.ink,w:3,head:12})+label('歩いた距離',gx+W+40,gy+36,{size:22,color:MX.ink,anchor:'end',weight:700}));
 s+=fade(yg,arrow(gx,gy,gx,top-50,{color:MX.ink,w:3,head:12})+label('道に沿った成分',gx+12,top-40,{size:22,color:MX.B,weight:700}));
 const gap=3*(1-mg);
 for(let i=0;i<N;i++){const gi=i<k||u>=1?1:0;if(!gi)continue;const x=gx+i*w+gap,hi=i===2&&cg>0;
  s+=`<rect x="${x.toFixed(1)}" y="${top}" width="${(w-2*gap).toFixed(1)}" height="${Hh}" fill="${MX.B}" fill-opacity="${hi?.75:.42}" stroke="${hi?MX.hi:MX.B}" stroke-width="${hi?4:1.5}"/>`;
  s+=fade(1-mg,num(i+1,gx+(i+.5)*w,gy-18,{r:11,fill:hi?MX.hi:'#c7d2e8'}));}
 s+=fade(cg*(1-bg),label('カード③ ＝ 高さ（道に沿った成分）× 幅 Δℓ',gx+2*w,top-8,{size:20,color:MX.hi,weight:700}));
 s+=fade(bg,`<rect x="${gx}" y="${top}" width="${W}" height="${Hh}" fill="none" stroke="${MX.hi}" stroke-width="4"/>`+label('帯全体の面積 ＝ 一周の足し算',gx+W/2,top-10,{size:24,color:MX.hi,anchor:'middle',weight:700}));
 s+=fade(hg*(1-cond),label('※ 円を変形した絵ではなく、道順に値を並べたグラフ',gx-10,138,{size:20,color:MX.dim}));
 s+=fade(cg*(1-cond),label('マイナスの点数なら 横軸の下',gx+W+50,gy+70,{size:20,color:MX.dim,anchor:'end'}));
 s+=fade(cond,label('電線を中心とする円：どこも 同じ向き・同じ強さ',gx-10,138,{size:22,color:MX.B,weight:700}));
 s+=fade(hb,line(gx+W+14,top,gx+W+14,gy,{color:MX.B,w:4})+tex(cB('B'),gx+W+38,(top+gy)/2+12,{size:32,auto:false}));
 s+=fade(wb,tex(`{\\color{${MX.good}}2\\pi r}`,gx+W/2,gy+46,{size:30,auto:false}));
 s+=fade(fg,callout(gx+W/2-190,top+40,380,76,fit(`\\oint ${cB('\\vec B')}\\cdot d\\vec r=${cB('B')}\\times{\\color{${MX.good}}2\\pi r}`,gx+W/2,top+92,340,40,{auto:false,color:MX.ink}),1));
 return s;}

// Steady current: a closed circuit with charges flowing evenly; two chosen places P1, P2 each carry a
// current meter; a time slider moves and the readings do not change (review 27). Right: charge piling
// up on a plate (the condition fails → chapter 6).
function steadyScene(p,ctx,{pg,ig,qg,sg,dg,cg,xg,ng,since0=0}){const T=ctx.t;
 const rx0=110,ry0=190,rw=360,rh=200,per=2*(rw+rh);
 const along=d=>{d=((d%per)+per)%per;if(d<rw)return [rx0+d,ry0];d-=rw;if(d<rh)return [rx0+rw,ry0+d];d-=rh;if(d<rw)return [rx0+rw-d,ry0+rh];d-=rw;return [rx0,ry0+rh-d];};
 let L=`<rect x="${rx0}" y="${ry0}" width="${rw}" height="${rh}" rx="10" fill="none" stroke="#6c7a94" stroke-width="8"/>`;
 for(let k=0;k<16;k++){const [x,y]=along(k*per/16+T*70);L+=dot(x,y,6,MX.I);}
 const meter=(x,y,n)=>num(n,x,y-34,{r:13,fill:'#c7d2e8'})+`<rect x="${x+18}" y="${y-54}" width="80" height="38" rx="8" fill="#0d1526" stroke="${MX.I}" stroke-width="2"/>`+label('2 A',x+58,y-26,{size:24,color:MX.I,anchor:'middle',weight:700});
 L+=fade(ig,meter(rx0+80,ry0,1)+meter(rx0+rw-40,ry0+rh+70,2));
 // time slider
 const sx0=150,sx1=430,sy=470,kx=mix(sx0,sx1,(T*.28)%1);
 L+=fade(ig,line(sx0,sy,sx1,sy,{color:MX.dim,w:4})+`<circle cx="${kx.toFixed(1)}" cy="${sy}" r="11" fill="${MX.hi}"/>`+label('時間',sx0-14,sy+8,{size:22,color:MX.dim,anchor:'end',weight:700}));
 L+=fade(pg,label('どの場所でも',230,436,{size:24,color:MX.ink,anchor:'middle',weight:700}));
 L+=fade(qg,label('電荷の量も 変わらない',290,300,{size:24,color:MX.good,anchor:'middle',weight:700}));
 let s=callout(60,95,480,410,L,1);
 // right: steady → no pile-up, or the capacitor case
 let R0=fade(sg,label('定常な状態',880,170,{size:30,color:MX.hi,anchor:'middle',weight:700})+label('電流も 電荷の量も',880,225,{size:24,color:MX.ink,anchor:'middle'})+label('時間で 変わらない',880,262,{size:24,color:MX.ink,anchor:'middle'}))
  +fade(dg,label('だから 電荷は',880,340,{size:26,color:MX.ink,anchor:'middle',weight:700})+label('どこにも たまらない',880,380,{size:26,color:MX.good,anchor:'middle',weight:700}));
 s+=callout(620,95,540,410,fade(1-cg,R0),sg*(1-cg));
 if(cg>0){const n=Math.min(12,Math.floor(Math.max(0,since0)*5));
  let R=line(660,320,900,320,{color:'#6c7a94',w:8})+`<rect x="900" y="220" width="18" height="200" fill="#9aa6bd"/>`;
  for(let k=0;k<4;k++){const x=660+((T*70+k*60)%240);R+=dot(x,320,6,MX.I);}
  for(let k=0;k<n;k++)R+=charge(940+(k%2)*34,235+Math.floor(k/2)*32,1,{r:13});
  R+=label('コンデンサ：たまっていく',880,150,{size:24,color:MX.ink,anchor:'middle',weight:700});
  R+=fade(xg,label('定常の条件が 外れる',880,195,{size:24,color:MX.plus,anchor:'middle',weight:700}));
  R+=fade(ng,word('第6章で 調べる',880,470,{size:26,color:MX.hi,anchor:'middle'}));
  s+=callout(620,95,540,410,R,cg);}
 return stage(ctx,p,s);}

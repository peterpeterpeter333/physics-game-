// YouTube シリーズ「アンペールの法則・初級 1/1」(ys-ui-current-field-1) — 図。Stage 1200×515.
// 色：磁場 𝐁 橙(C.E)、電流 I 青、方位磁針の N 極 赤・S 極 灰、一歩 Δℓ 黄(C.hi)、半径 r 白、半径の向きの部分 桃(C.p)。
// 向き：上から見た図・正面図とも、⊙＝画面の手前向き、⊗＝奥向き。電流 ⊙ → 𝐁 は反時計回り（画面上で）。⊗ → 時計回り。
// 斜めから見た図（板・右手・右ねじ）は、板を手前下に傾けて見る：手前側（画面の下側）の 𝐁 は右向き＝上から見て反時計回り。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,poly} from './anim.mjs';

const K='ui-current-field-1:';
const CB=C.E,CI='#6f9dff',CN='#ff6b6b',CS='#c9d3e3',CST=C.hi,CR=C.ink,CP=C.p;
const RAD=Math.PI/180;
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const vB=(x,y,{size=30,anchor='start'}={})=>T(`\\mathbf{B}`,x,y,{size,color:CB,anchor});
const n2=v=>Number(v.toFixed(2));

// ---- symbols -------------------------------------------------------------------------------------
function outSym(x,y,r=20,color=CI,g=1){return fade(g,ring(x,y,r,{color,w:4,fill:'#101a30'})+dot(x,y,r*.3,color));}
function inSym(x,y,r=20,color=CI,g=1){const d=r*.6;return fade(g,ring(x,y,r,{color,w:4,fill:'#101a30'})+line(x-d,y-d,x+d,y+d,{color,w:4})+line(x-d,y+d,x+d,y-d,{color,w:4}));}
function wireTop(x,y,kind='out',{g=1,text='I',r=22}={}){
 const s=(kind==='out'?outSym(x,y,r,CI):inSym(x,y,r,CI))+(text?label(text,x+r+8,y-r-2,{size:28,color:CI,weight:700}):'');
 return fade(g,s);
}
// arrowhead at (x,y) pointing along screen direction (dx,dy)
function head(x,y,dx,dy,{color=CB,L=18}={}){
 const m=Math.hypot(dx,dy)||1,ux=dx/m,uy=dy/m,bx=x-L*ux,by=y-L*uy;
 return `<polygon points="${n2(x)},${n2(y)} ${n2(bx-L*.5*uy)},${n2(by+L*.5*ux)} ${n2(bx+L*.5*uy)},${n2(by-L*.5*ux)}" fill="${color}"/>`;
}
// circle of field lines around (cx,cy); sense +1 = counter-clockwise on screen, −1 = clockwise.
function fieldCircle(cx,cy,R,sense=1,{g=1,color=CB,w=3.5,nh=4,phase=45,L=18,dash=''}={}){
 if(g<=0)return '';
 let s=ring(cx,cy,R,{color,w,dash});
 for(let i=0;i<nh;i++){const t=(phase+360*i/nh)*RAD;const x=cx+R*Math.cos(t),y=cy-R*Math.sin(t);s+=head(x,y,-Math.sin(t)*sense,-Math.cos(t)*sense,{color,L});}
 return fade(g,s);
}
// compass: angle a (radians, 0 = right, π/2 = up on screen) is where the N end points.
function compass(x,y,a,{r=24,g=1,hl=0,dim=1}={}){
 const ux=Math.cos(a),uy=-Math.sin(a),px=-uy,py=ux,L=r*.86,wd=r*.3;
 let s=ring(x,y,r,{color:hl?C.hi:C.dim,w:hl?4:2.5,fill:'#172238'});
 s+=`<polygon points="${n2(x+L*ux)},${n2(y+L*uy)} ${n2(x+wd*px)},${n2(y+wd*py)} ${n2(x-wd*px)},${n2(y-wd*py)}" fill="${CN}"/>`;
 s+=`<polygon points="${n2(x-L*ux)},${n2(y-L*uy)} ${n2(x+wd*px)},${n2(y+wd*py)} ${n2(x-wd*px)},${n2(y-wd*py)}" fill="${CS}"/>`;
 s+=dot(x,y,3,'#172238');
 return fade(g*dim,s);
}
const angLerp=(a,b,u)=>{let d=((b-a)%(2*Math.PI)+3*Math.PI)%(2*Math.PI)-Math.PI;return a+d*u;};
const NORTH=Math.PI/2;
// compasses on a circle around the wire; turn: 0 = all north, 1 = tangent (sense).
const W0={x:330,y:262},RC=150,CANG=[0,45,90,135,180,225,270,315];
function compassRing({turn=0,sense=1,from=null,g=1,hlIdx=-1,dimOthers=1,R=RC,cx=W0.x,cy=W0.y,skip=-1}={}){
 let s='';
 CANG.forEach((d,i)=>{if(i===skip)return;const t=d*RAD,x=cx+R*Math.cos(t),y=cy-R*Math.sin(t);
  const tang=t+sense*Math.PI/2,start=from===null?NORTH:t+from*Math.PI/2;
  s+=compass(x,y,angLerp(start,tang,turn),{hl:i===hlIdx,dim:i===hlIdx?1:dimOthers});});
 return fade(g,s);
}
function northRose(x,y,g=1){return fade(g,arrow(x,y+26,x,y-30,{color:C.dim,w:3,head:14})+label('北',x,y-40,{size:24,color:C.dim,anchor:'middle'}));}

// ===== S1 : uniform B from the previous film ======================================================
function bGrid({g=1,hl=0}={}){
 let s='';
 for(let i=0;i<3;i++)for(let j=0;j<4;j++){const x=90+j*95,y=150+i*95;s+=arrow(x,y,x+64,y,{color:CB,w:4,head:14});}
 s+=vB(470,160,{size:34})+label('［T］',500,168,{size:26,color:CB});
 if(hl)s+=highlight(66,110,420,280,hl,CB);
 return fade(g,s);
}
function chargeScene(g=1){
 // + charge moving up (𝐯), 𝐁 to the right → 𝐅 = q𝐯×𝐁 into the screen (⊗).
 const x=250,y=300;
 let s=dot(x,y,14,'#ff6b6b')+label('+',x,y+8,{size:22,color:C.bg,anchor:'middle',weight:700});
 s+=arrow(x,y-18,x,y-110,{color:C.v,w:5})+T('\\mathbf{v}',x-24,y-98,{size:30,color:C.v,anchor:'end'});
 s+=inSym(x+52,y,15,C.F)+T('\\mathbf{F}',x+76,y+10,{size:30,color:C.F,anchor:'start'});
 return fade(g,s);
}
function wireQuestion(g=1,q=1){
 let s=line(840,70,840,460,{color:CI,w:7})+arrow(840,300,840,130,{color:CI,w:7,head:22})+label('I',858,150,{size:30,color:CI,weight:700});
 s+=fade(q,`<ellipse cx="840" cy="300" rx="120" ry="34" fill="none" stroke="${CB}" stroke-width="3" stroke-dasharray="8 8"/>`+label('？',980,250,{size:64,color:C.hi,weight:700,anchor:'middle'}));
 return fade(g,s);
}

// ===== S2 : oblique board =========================================================================
const OB={cx:370,cy:330,k:.42,q:.5};
const obl=(u,w)=>[OB.cx+u+OB.q*w*.7,OB.cy-OB.k*w];
function boardScene({turn=0,g=1}={}){
 const P=[obl(-300,-150),obl(300,-150),obl(300,230),obl(-300,230)];
 let s=line(OB.cx,OB.cy,OB.cx,480,{color:CI,w:7,opacity:.55});
 s+=poly(P,{fill:'#24324e',fo:.9,stroke:C.dim,sw:2});
 CANG.forEach(d=>{const t=d*RAD,[x,y]=obl(150*Math.cos(t),150*Math.sin(t));
  const a=angLerp(NORTH,t+Math.PI/2,turn),ux=Math.cos(a),uw=Math.sin(a);
  const [x2,y2]=obl(150*Math.cos(t)+20*ux,150*Math.sin(t)+20*uw),[x3,y3]=obl(150*Math.cos(t)-20*ux,150*Math.sin(t)-20*uw);
  s+=`<ellipse cx="${n2(x)}" cy="${n2(y)}" rx="26" ry="12" fill="#172238" stroke="${C.dim}" stroke-width="2.5"/>`+line(x,y,x2,y2,{color:CN,w:5})+line(x,y,x3,y3,{color:CS,w:5});});
 s+=line(OB.cx,OB.cy,OB.cx,50,{color:CI,w:7})+arrow(OB.cx,200,OB.cx,80,{color:CI,w:7,head:22})+label('I',OB.cx+18,100,{size:30,color:CI,weight:700});
 // north arrow on the board (away from the viewer)
 const [nx0,ny0]=obl(250,120),[nx1,ny1]=obl(250,210);
 s+=arrow(nx0,ny0,nx1,ny1,{color:C.dim,w:3,head:14})+label('北',nx1+10,ny1-6,{size:24,color:C.dim});
 return fade(g,s);
}

// ===== S3 : right hand / right screw (oblique, wire vertical) ======================================
const HX=330;
function ellipseArc(cx,cy,rx,ry,a0,a1,n=40){return Array.from({length:n+1},(_,i)=>{const a=(a0+(a1-a0)*i/n)*RAD;return [cx+rx*Math.cos(a),cy+ry*Math.sin(a)];});}
// field ellipse around the vertical wire; front half (lower on screen) runs to the right (= ccw seen from above).
function fieldEllipse(cx,cy,rx,ry,{g=1,sense=1}={}){
 let s=draw(ellipseArc(cx,cy,rx,ry,180,360),1,{color:CB,w:3.5,opacity:.55})+draw(ellipseArc(cx,cy,rx,ry,0,180),1,{color:CB,w:4});
 // front point (angle 90° → lowest) moving right when sense=+1; back point moving left.
 s+=head(cx+sense*14,cy+ry,sense,0,{color:CB,L:20})+fade(.7,head(cx-sense*14,cy-ry,-sense,0,{color:CB,L:18}));
 return fade(g,s);
}
function hand(g=1){
 const skin='#e2b48f',edge='#8a5a3c';
 let s='';
 // palm behind the wire on the left, fingers wrap across the front towards the right.
 s+=rect(HX-92,212,70,150,{fill:skin,fo:1,stroke:edge,sw:2.5,rx:26});
 for(let i=0;i<4;i++){const y=236+i*32;
  s+=draw(ellipseArc(HX,y,62,17,160,20,30),1,{color:edge,w:27});
  s+=draw(ellipseArc(HX,y,62,17,160,20,30),1,{color:skin,w:22});
  const [tx,ty]=ellipseArc(HX,y,62,17,20,20,1)[0];s+=dot(tx,ty,11,skin);}
 // thumb up along the wire
 s+=draw([[HX-40,228],[HX-22,170],[HX-14,138]],1,{color:edge,w:30})+draw([[HX-40,228],[HX-22,170],[HX-14,138]],1,{color:skin,w:25});
 return fade(g,s);
}
function wireV(x,{g=1,top=40,bot=480,ay=[230,90],text=true}={}){
 return fade(g,line(x,top,x,bot,{color:CI,w:7})+arrow(x,ay[0],x,ay[1],{color:CI,w:7,head:22})+(text?label('I',x+18,ay[1]+20,{size:30,color:CI,weight:700}):''));
}
function screwFig(x,g=1,turn=1){
 let s=line(x,40,x,480,{color:CI,w:5,opacity:.4});
 // body: tip at the top (the screw advances upward)
 const top=150,bot=380;
 s+=poly([[x-22,bot],[x+22,bot],[x+22,top+40],[x,top],[x-22,top+40]],{fill:'#5a6680',fo:1,stroke:C.ink,sw:2});
 for(let y=top+44;y<bot;y+=18)s+=line(x-22,y+6,x+22,y-6,{color:C.ink,w:1.5});
 s+=`<ellipse cx="${x}" cy="${bot+6}" rx="46" ry="14" fill="#46526e" stroke="${C.ink}" stroke-width="2.5"/>`;
 s+=fade(turn,fieldEllipse(x,300,95,26));
 return fade(g,s);
}

// ===== S4 : a loop in the screen plane, current counter-clockwise ===================================
const L0={x:300,y:262,R:165};
const PIECES=[{c:0,name:'右'},{c:90,name:'上'},{c:180,name:'左'},{c:270,name:'下'}];
function loopFig({g=1,hl=[],ringW=6,offs=[[0,0]]}={}){
 let s='';
 for(const [dx,dy] of offs){
  s+=ring(L0.x+dx,L0.y+dy,L0.R,{color:CI,w:ringW});
  for(const d of [0,90,180,270]){const t=d*RAD;s+=head(L0.x+dx+L0.R*Math.cos(t),L0.y+dy-L0.R*Math.sin(t),-Math.sin(t),-Math.cos(t),{color:CI,L:22});}
 }
 for(const {i,a} of hl){if(a<=0)continue;const c=PIECES[i].c;s+=fade(a,draw(ellipseArc(L0.x,L0.y,L0.R,L0.R,-(c+24),-(c-24),20),1,{color:C.hi,w:14,opacity:.55}));}
 s+=label('I',L0.x+L0.R+22,L0.y-60,{size:30,color:CI,weight:700});
 return fade(g,s);
}
function stack(n,{x=1010,base=440,h=58,w=110,g=1,labels=true,a=[1,1,1,1]}={}){
 let s='';
 for(let i=0;i<n;i++){if((a[i]??1)<=0)continue;s+=fade(a[i]??1,rect(x-w/2,base-(i+1)*h,w,h-6,{fill:CB,fo:.35,stroke:CB,sw:2,rx:6})+(labels?label(PIECES[i%4].name,x,base-i*h-h/2+4,{size:24,color:C.ink,anchor:'middle'}):''));}
 return fade(g,s);
}

// ===== S5 : coils ===================================================================================
function coil(x0,len,turns,y,{h=70,g=1,w=1.6,color=CI}={}){
 let s=rect(x0,y-h/2,len,h,{fill:'#24324e',fo:.7,stroke:C.faint,sw:1.5,rx:8});
 let d='';const dx=len/turns;
 for(let i=0;i<turns;i++){const x=x0+dx*(i+.5);d+=`M${n2(x-dx*.3)} ${n2(y+h/2)} L${n2(x+dx*.3)} ${n2(y-h/2)} `;}
 s+=`<path d="${d}" stroke="${color}" stroke-width="${w}" fill="none"/>`;
 return fade(g,s);
}
function ruler(x0,len,y,text,{g=1,color=C.dim}={}){
 return fade(g,line(x0,y,x0+len,y,{color,w:2.5})+line(x0,y-10,x0,y+10,{color,w:2.5})+line(x0+len,y-10,x0+len,y+10,{color,w:2.5})+label(text,x0+len/2,y+32,{size:26,color,anchor:'middle',weight:700}));
}
const M=700; // px per metre in the comparison
const CX0=90;
function twoCoils({g=1,nLabel=1}={}){
 let s=coil(CX0,M,100,120)+ruler(CX0,M,178,'L ＝ 1 m');
 s+=coil(CX0,M*.5,100,310)+ruler(CX0,M*.5,368,'L ＝ 0.5 m');
 s+=fade(nLabel,label('N ＝ 100 巻',CX0,72,{size:26,color:CI,weight:700})+label('N ＝ 100 巻',CX0,262,{size:26,color:CI,weight:700}));
 return fade(g,s);
}

// ===== S6 : circular track around the wire (top view) ============================================
const TR={x:330,y:262,R:175};
function track({g=1,runner=null,rAng=35,showR=1,field=0}={}){
 let s=ring(TR.x,TR.y,TR.R,{color:'#26324c',w:30})+ring(TR.x,TR.y,TR.R,{color:C.faint,w:1.5,dash:'6 8'});
 if(field)s+=fieldCircle(TR.x,TR.y,TR.R,1,{g:field,nh:6,phase:0,w:2.5});
 s+=wireTop(TR.x,TR.y,'out');
 if(showR){const t=rAng*RAD,x=TR.x+TR.R*Math.cos(t),y=TR.y-TR.R*Math.sin(t);
  s+=fade(showR,line(TR.x+22*Math.cos(t),TR.y-22*Math.sin(t),x,y,{color:CR,w:3,dash:'10 7'})+label('r',TR.x+.55*TR.R*Math.cos(t)-6,TR.y-.55*TR.R*Math.sin(t)-14,{size:32,color:CR,weight:700}));}
 if(runner!==null){const t=runner*RAD;s+=dot(TR.x+TR.R*Math.cos(t),TR.y-TR.R*Math.sin(t),11,C.hi);}
 return fade(g,s);
}
const pt=a=>[TR.x+TR.R*Math.cos(a*RAD),TR.y-TR.R*Math.sin(a*RAD)];
const tdir=a=>[-Math.sin(a*RAD),-Math.cos(a*RAD)]; // ccw tangent on screen
const rdir=a=>[Math.cos(a*RAD),-Math.sin(a*RAD)];  // outward radial on screen
function stepArrow(a,{len=70,g=1,text=true}={}){
 const [x,y]=pt(a),[dx,dy]=tdir(a);
 return fade(g,arrow(x,y,x+len*dx,y+len*dy,{color:CST,w:6,head:18})+(text?T('\\Delta\\ell',x+len*dx+10,y+len*dy-16,{size:32,color:CST,anchor:'start'}):''));
}
function bAt(a,{len=100,g=1,off=28}={}){
 const [x,y]=pt(a),[dx,dy]=tdir(a),[rx,ry]=rdir(a);
 const X=x-off*rx,Y=y-off*ry;
 return fade(g,arrow(X,Y,X+len*dx,Y+len*dy,{color:CB,w:5,head:18})+vB(X+len*dx-28,Y+len*dy-4,{size:30,anchor:'end'}));
}

export const ytUiCurrentField1Diagrams={
 // ===== S1 前回の問い =====
 [K+'intro']:(p)=>bGrid({g:.55})+wireQuestion(seg(p,.35,.55),seg(p,.6,.8)),
 [K+'recap']:(p)=>bGrid({hl:seg(p,.05,.2)})+chargeScene(seg(p,.45,.6))+wireQuestion(.35,.35),
 [K+'plan']:(p)=>{
  let s=fade(1-seg(p,0,.2),bGrid({g:.55})+wireQuestion(1,1));
  const items=['① まっすぐな導線のまわり','② 丸く巻いた導線（輪）','③ 巻き方の密さを数で'];
  items.forEach((t,i)=>{s+=card(300,90+i*120,600,90,label(t,600,146+i*120,{size:32,color:i===2?C.hi:C.ink,anchor:'middle',weight:700}),seg(p,.15+i*.15,.3+i*.15));});
  return s;
 },

 // ===== S2 方位磁針を並べる =====
 [K+'setup']:(p)=>{
  let s=boardScene({g:1});
  s+=card(790,120,380,250,
   label('方位磁針',980,170,{size:28,color:C.dim,anchor:'middle'})+compass(980,245,0,{r:40})
   +label('N 極の指す向き',980,318,{size:28,color:CN,anchor:'middle',weight:700})
   +label('＝ 磁場 𝐁 の向き',980,354,{size:28,color:CB,anchor:'middle',weight:700}),seg(p,.5,.65));
  return s;
 },
 [K+'top']:(p)=>{
  let s=compassRing({g:1})+wireTop(W0.x,W0.y,'out',{g:seg(p,.2,.4)})+northRose(640,110);
  s+=card(760,110,400,260,
   outSym(820,180,22)+label('手前向き',860,190,{size:28,color:C.ink})+label('（矢の先が見える）',860,226,{size:22,color:C.dim})
   +inSym(820,290,22)+label('奥向き',860,300,{size:28,color:C.ink})+label('（矢の羽根が見える）',860,336,{size:22,color:C.dim}),seg(p,.45,.6));
  s+=fade(seg(p,.2,.4),label('電流は 手前向き',W0.x,W0.y+RC+70,{size:26,color:CI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'north']:(p)=>{
  let s=compassRing({})+wireTop(W0.x,W0.y,'out')+northRose(640,110);
  s+=card(760,150,400,160,label('電流を流す前',960,210,{size:28,color:C.dim,anchor:'middle'})+label('どの磁針も 北（上）',960,262,{size:30,color:CN,anchor:'middle',weight:700}),seg(p,.1,.25));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=compassRing({})+wireTop(W0.x,W0.y,'out')+northRose(640,110);
  s+=card(760,150,400,160,label('大きな電流を流すと',960,210,{size:28,color:C.dim,anchor:'middle'})+label('磁針は どちらへ？',960,262,{size:32,color:C.hi,anchor:'middle',weight:700}),1);
  return s;
 },
 [K+'turn']:(p)=>{
  const u=seg(p,.05,.5);
  let s=compassRing({turn:u})+wireTop(W0.x,W0.y,'out')+northRose(640,110,1-seg(p,.5,.7));
  s+=fade(seg(p,.55,.75),ring(W0.x,W0.y,RC,{color:C.faint,w:2,dash:'6 8'}));
  s+=card(760,130,400,220,
   label('導線の方 …',800,190,{size:28,color:C.dim})+label('✗',1120,190,{size:30,color:C.a,anchor:'end',weight:700})
   +label('離れる方 …',800,245,{size:28,color:C.dim})+label('✗',1120,245,{size:30,color:C.a,anchor:'end',weight:700})
   +label('円の 接線の向き',800,305,{size:30,color:C.hi,weight:700})+label('○',1120,305,{size:30,color:C.F,anchor:'end',weight:700}),seg(p,.4,.55));
  return s;
 },
 [K+'tangent']:(p)=>{
  const x=W0.x+RC,y=W0.y;
  let s=ring(W0.x,W0.y,RC,{color:C.faint,w:2,dash:'6 8'})+compassRing({turn:1,hlIdx:0,dimOthers:.45})+wireTop(W0.x,W0.y,'out');
  s+=fade(seg(p,.1,.3),line(W0.x+24,W0.y,x-26,y,{color:CR,w:3,dash:'10 7'})+label('半径',W0.x+RC*.5,W0.y+34,{size:26,color:CR,anchor:'middle'}));
  s+=fade(seg(p,.3,.5),line(x,y-120,x,y+120,{color:C.hi,w:3})+label('接線',x+16,y-96,{size:26,color:C.hi,weight:700}));
  s+=fade(seg(p,.5,.65),line(x-18,y,x-18,y+18,{color:C.ink,w:2})+line(x-18,y+18,x,y+18,{color:C.ink,w:2})+label('直角',x+16,y+50,{size:24,color:C.ink}));
  return s;
 },
 [K+'circles']:(p)=>{
  let s=compassRing({turn:1,dimOthers:.35});
  const Rs=[90,RC,225];
  Rs.forEach((R,i)=>{s+=fade(seg(p,.05+i*.12,.2+i*.12),ring(W0.x,W0.y,R,{color:CB,w:2,dash:'4 8'}));
   const L=5200/R;for(const d of [45,135,225,315]){const t=d*RAD,x=W0.x+R*Math.cos(t),y=W0.y-R*Math.sin(t),dx=-Math.sin(t),dy=-Math.cos(t);
    s+=fade(seg(p,.05+i*.12,.2+i*.12),arrow(x-dx*L/2,y-dy*L/2,x+dx*L/2,y+dy*L/2,{color:CB,w:4.5,head:16}));}});
  s+=wireTop(W0.x,W0.y,'out');
  s+=card(760,110,400,260,
   label('上から見て',960,165,{size:26,color:C.dim,anchor:'middle'})+label('反時計回り',960,212,{size:32,color:CB,anchor:'middle',weight:700})
   +fade(seg(p,.6,.75),label('離れるほど 弱い',960,290,{size:30,color:C.ink,anchor:'middle',weight:700})+label('（矢印が短い）',960,330,{size:24,color:C.dim,anchor:'middle'})),seg(p,.3,.45));
  return s;
 },

 // ===== S3 右手と右ねじ =====
 [K+'hand']:(p)=>{
  let s=wireV(HX,{ay:[130,60],text:false});
  s+=fieldEllipse(HX,420,120,30,{g:seg(p,.45,.6)});
  s+=hand(seg(p,.1,.3));
  s+=card(640,90,520,300,
   label('右手',900,145,{size:28,color:C.dim,anchor:'middle'})
   +label('親指',690,215,{size:30,color:'#e2b48f',weight:700})+label('＝ 電流 I の向き',790,215,{size:30,color:CI,weight:700})
   +fade(seg(p,.45,.6),label('曲げた指',690,300,{size:30,color:'#e2b48f',weight:700})+label('＝ 磁場 𝐁 の向き',840,300,{size:30,color:CB,weight:700})),seg(p,.2,.35));
  s+=fade(seg(p,.2,.35),label('I',HX+18,78,{size:30,color:CI,weight:700}));
  return s;
 },
 [K+'screw']:(p)=>{
  let s=screwFig(HX,1,seg(p,.4,.55));
  s+=arrow(HX+70,250,HX+70,120,{color:CI,w:5,head:18});
  s+=card(640,90,520,300,
   label('右ねじ（ふつうのねじ）',900,145,{size:28,color:C.dim,anchor:'middle'})
   +label('進む向き',690,215,{size:30,color:C.ink,weight:700})+label('＝ 電流 I の向き',820,215,{size:30,color:CI,weight:700})
   +fade(seg(p,.4,.55),label('回す向き',690,300,{size:30,color:C.ink,weight:700})+label('＝ 磁場 𝐁 の向き',820,300,{size:30,color:CB,weight:700})),seg(p,.1,.25));
  return s;
 },
 [K+'check']:(p)=>{
  let s=compassRing({turn:1,dimOthers:.6})+fieldCircle(W0.x,W0.y,95,1,{g:seg(p,.3,.5)})+wireTop(W0.x,W0.y,'out');
  s+=card(760,110,400,280,
   label('上から見る',960,160,{size:26,color:C.dim,anchor:'middle'})
   +outSym(830,220,20)+label('電流 手前向き',866,230,{size:28,color:CI,weight:700})
   +fade(seg(p,.3,.5),label('反時計回りに回すと',960,290,{size:26,color:C.ink,anchor:'middle'})+label('ねじは 手前へ',960,328,{size:28,color:C.ink,anchor:'middle',weight:700}))
   +fade(seg(p,.7,.85),label('実験と一致 ○',960,372,{size:28,color:C.F,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'reverse']:(p)=>{
  let s=compassRing({turn:1,hlIdx:-1,dimOthers:.3,skip:0})+ring(W0.x+RC,W0.y,24,{color:C.hi,w:4,fill:'#172238'})+label('？',W0.x+RC,W0.y+10,{size:28,color:C.hi,anchor:'middle',weight:700})+wireTop(W0.x,W0.y,'in',{g:seg(p,.05,.25)})+fade(1-seg(p,.05,.25),wireTop(W0.x,W0.y,'out'));
  s+=card(760,130,400,220,
   inSym(830,200,20)+label('電流 奥向き',866,210,{size:28,color:CI,weight:700})
   +label('真右の磁針の N 極は',960,275,{size:26,color:C.ink,anchor:'middle'})+label('上？ 下？',960,320,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45));
  return s;
 },
 [K+'flip']:(p)=>{
  const u=seg(p,.05,.45);
  let s=compassRing({turn:u,sense:-1,from:1,hlIdx:0,dimOthers:1})+fieldCircle(W0.x,W0.y,95,-1,{g:seg(p,.3,.5)})+wireTop(W0.x,W0.y,'in');
  s+=card(760,130,400,220,
   inSym(830,200,20)+label('電流 奥向き',866,210,{size:28,color:CI,weight:700})
   +label('磁場は 時計回り',960,275,{size:30,color:CB,anchor:'middle',weight:700})
   +fade(seg(p,.6,.75),label('真右の磁針は 下向き',960,322,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.2,.35));
  return s;
 },

 // ===== S4 輪にすると =====
 [K+'loop']:(p)=>{
  let s=draw(ellipseArc(L0.x,L0.y,L0.R,L0.R,0,-360,90),seg(p,.05,.5),{color:CI,w:6});
  s+=fade(seg(p,.5,.6),loopFig({}));
  s+=card(720,140,440,180,label('正面から見て',940,200,{size:26,color:C.dim,anchor:'middle'})+label('電流は 反時計回り',940,255,{size:32,color:CI,anchor:'middle',weight:700}),seg(p,.55,.7));
  return s;
 },
 [K+'piece']:(p)=>{
  let s=loopFig({hl:[{i:0,a:seg(p,.3,.5)}]});
  s+=fade(seg(p,.4,.6),arrow(L0.x+L0.R+40,L0.y+50,L0.x+L0.R+40,L0.y-50,{color:CI,w:5})+label('上向き',L0.x+L0.R+60,L0.y+8,{size:28,color:CI,weight:700}));
  return s;
 },
 [K+'rule']:(p)=>{
  let s=loopFig({hl:[{i:0,a:1}]});
  // inset: straight piece with current up; left side ⊙, right side ⊗
  const ix=960;
  s+=card(760,40,400,420,
   label('右側の部分を 拡大',ix,86,{size:24,color:C.dim,anchor:'middle'})
   +line(ix,120,ix,420,{color:CI,w:7})+arrow(ix,330,ix,170,{color:CI,w:7,head:20})+label('I',ix+16,190,{size:28,color:CI,weight:700})
   +fade(seg(p,.2,.35),outSym(ix-90,220,17,CB)+outSym(ix-90,330,17,CB)+label('左：手前',ix-90,396,{size:26,color:CB,anchor:'middle',weight:700}))
   +fade(seg(p,.35,.5),inSym(ix+90,220,17,CB)+inSym(ix+90,330,17,CB)+label('右：奥',ix+90,396,{size:26,color:CB,anchor:'middle',weight:700})),1);
  s+=fade(seg(p,.65,.8),line(L0.x+L0.R-12,L0.y,L0.x+30,L0.y,{color:C.dim,w:2,dash:'6 6'})+outSym(L0.x,L0.y,18,CB)+label('中心',L0.x,L0.y+50,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'all']:(p)=>{
  const a=[1,seg(p,.1,.25),seg(p,.3,.45),seg(p,.5,.65)];
  let s=loopFig({hl:a.map((v,i)=>({i,a:v}))});
  const cnt=a.reduce((x,y)=>x+y,0);
  s+=outSym(L0.x,L0.y,14+5*cnt,CB);
  s+=stack(4,{a});
  s+=label('中心での 寄与',1010,470,{size:24,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.7,.85),label('どれも 手前向き',760,120,{size:28,color:CB,weight:700}));
  return s;
 },
 [K+'sum']:(p)=>{
  let s=loopFig({})+outSym(L0.x,L0.y,34,CB)+stack(4,{});
  s+=fade(seg(p,.1,.3),line(1080,208,1096,208,{color:C.hi,w:3})+line(1096,208,1096,432,{color:C.hi,w:3})+line(1080,432,1096,432,{color:C.hi,w:3}));
  s+=fade(seg(p,.1,.3),label('中心の',720,200,{size:28,color:C.ink})+label('磁場の強さ',720,240,{size:28,color:CB,weight:700})+label('＝ 各部分の和',720,280,{size:28,color:C.ink}));
  s+=fade(seg(p,.55,.7),card(700,330,240,70,label('重ね合わせ',820,376,{size:30,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
  return s;
 },
 [K+'nturn']:(p)=>{
  const offs=[[0,0],[10,-8],[20,-16]];
  let s=loopFig({offs:offs.filter((o,i)=>i===0||p>.05+i*.1),ringW:4});
  s+=outSym(L0.x+10,L0.y-8,40,CB);
  s+=label('N 回 巻く',L0.x,L0.y+L0.R+50,{size:28,color:CI,anchor:'middle',weight:700});
  s+=card(720,150,440,200,label('中心の磁場',940,210,{size:28,color:C.dim,anchor:'middle'})+label('およそ N 倍',940,270,{size:36,color:CB,anchor:'middle',weight:700})
   +fade(seg(p,.55,.7),label('同じ向きの寄与が 重なる',940,322,{size:24,color:C.ink,anchor:'middle'})),seg(p,.3,.45));
  return s;
 },

 // ===== S5 全巻数と 1 m あたりの巻数 =====
 [K+'sol']:(p)=>{
  let s=coil(120,760,24,240,{h:110,w:3});
  for(let i=0;i<3;i++){const x=120+760/24*(i+.5);s+=fade(seg(p,.35+i*.08,.45+i*.08),label(String(i+1),x,168,{size:24,color:C.hi,anchor:'middle',weight:700}));}
  s+=fade(seg(p,.6,.7),label('…',120+760/24*4.2,168,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=card(340,360,520,110,label('全巻数 N ＝ 巻いた回数',600,408,{size:30,color:CI,anchor:'middle',weight:700})+label('回数なので 単位なし',600,448,{size:24,color:C.dim,anchor:'middle'}),seg(p,.4,.55));
  return s;
 },
 [K+'two']:(p)=>{
  let s=twoCoils({});
  s+=card(840,70,330,300,
   label('固定',870,125,{size:26,color:C.dim})+label('N ＝ 100',990,125,{size:30,color:CI,weight:700})
   +fade(seg(p,.5,.65),label('変化',870,205,{size:26,color:C.dim})+label('長さ L',990,205,{size:30,color:C.ink,weight:700})+label('密さ',990,260,{size:30,color:C.hi,weight:700})),seg(p,.4,.55));
  return s;
 },
 [K+'def']:(p)=>{
  let s=twoCoils({});
  s+=card(840,70,330,360,
   label('1 m あたりの巻数',1005,125,{size:26,color:C.dim,anchor:'middle'})
   +T(`n=\\dfrac{${cs(CI,'N')}}{L}`,1005,225,{size:50,color:C.hi})
   +fade(seg(p,.4,.6),label('N：全巻数',880,320,{size:26,color:CI})+label('L：長さ［m］',880,365,{size:26,color:C.ink})),seg(p,.1,.3),C.hi);
  return s;
 },
 [K+'calc']:(p)=>{
  let s=twoCoils({});
  s+=card(830,80,350,110,T(`n=\\dfrac{100}{1}=100\\ \\mathrm{/m}`,1005,138,{size:36,color:C.hi}),seg(p,.05,.2),C.hi);
  s+=card(830,270,350,110,T(`n=\\dfrac{100}{0.5}=200\\ \\mathrm{/m}`,1005,328,{size:36,color:C.hi}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'why']:(p)=>{
  let s=twoCoils({});
  s+=card(830,80,350,110,T(`n=100\\ \\mathrm{/m}`,1005,138,{size:36,color:C.hi}),1,C.faint);
  s+=card(830,270,350,110,T(`n=200\\ \\mathrm{/m}`,1005,328,{size:36,color:C.hi}),1,C.hi);
  // ghost: extend the 0.5 m coil to 1 m at the same density
  const g=seg(p,.45,.7);
  s+=fade(g*.8,coil(CX0+M*.5,M*.5,100,310,{color:'#9ab8ff',w:1.2}));
  s+=fade(g,rect(CX0+M*.5,310-35,M*.5,70,{fill:'none',fo:0,stroke:C.hi,sw:2,rx:8})+label('延ばすと 1 m に 200 巻の割合',CX0+M*.75,440,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=fade(.35,twoCoils({}));
  s+=card(250,70,700,360,
   label('単位',600,125,{size:26,color:C.dim,anchor:'middle'})
   +label('回数 ÷ m ＝ /m（毎メートル）',600,180,{size:34,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.35,.5),label('大文字 N：回数（単位なし）',600,280,{size:30,color:CI,anchor:'middle',weight:700}))
   +fade(seg(p,.55,.7),label('小文字 n：1 m あたりの回数［/m］',600,345,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'quiz']:(p)=>{
  const Q=700/1.5; // px per metre (1.5 m → 700 px)
  let s=coil(CX0,1.5*Q,300,160,{w:1})+ruler(CX0,1.5*Q,218,'L ＝ 1.5 m')+label('N ＝ 300 巻',CX0,112,{size:26,color:CI,weight:700});
  s+=card(830,90,340,150,label('n ＝ ？',1000,180,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.35),C.hi);
  return s;
 },
 [K+'quizans']:(p)=>{
  const Q=700/1.5;
  let s=coil(CX0,1.5*Q,300,160,{w:1})+ruler(CX0,1.5*Q,218,'L ＝ 1.5 m')+label('N ＝ 300 巻',CX0,112,{size:26,color:CI,weight:700});
  s+=card(830,90,340,150,T(`n=\\dfrac{300}{1.5}=200\\ \\mathrm{/m}`,1000,168,{size:34,color:C.hi}),seg(p,.02,.15),C.hi);
  const g=seg(p,.45,.6);
  s+=fade(g,coil(CX0,.5*Q,100,350,{w:1})+ruler(CX0,.5*Q,408,'L ＝ 0.5 m')+label('N ＝ 100 巻',CX0,302,{size:26,color:CI,weight:700}));
  s+=card(830,300,340,120,T(`\\dfrac{100}{0.5}=200\\ \\mathrm{/m}`,1000,346,{size:32,color:C.hi})+label('同じ密さ',1000,404,{size:24,color:C.ink,anchor:'middle'}),g);
  return s;
 },

 // ===== S6 円に沿って足す =====
 [K+'track']:(p)=>{
  let s=track({runner:35+360*seg(p,.2,.95),rAng:35,showR:1});
  s+=card(760,140,400,200,label('r：導線からの距離',960,205,{size:30,color:CR,anchor:'middle',weight:700})+label('一周しても 変わらない',960,262,{size:28,color:C.dim,anchor:'middle'}),seg(p,.4,.55));
  return s;
 },
 [K+'step']:(p)=>{
  let s=track({runner:35,rAng:35})+stepArrow(35,{g:seg(p,.05,.2)});
  s+=card(760,120,400,240,
   label('Δℓ：道に沿った 一歩',960,190,{size:30,color:CST,anchor:'middle',weight:700})
   +fade(seg(p,.45,.6),label('r：導線からの距離',960,265,{size:30,color:CR,anchor:'middle',weight:700})+label('別の量',960,318,{size:28,color:C.dim,anchor:'middle'})),seg(p,.15,.3));
  return s;
 },
 [K+'along']:(p)=>{
  let s=track({runner:35,rAng:35,field:seg(p,.05,.25)*.6})+stepArrow(35)+bAt(35,{g:seg(p,.1,.3)});
  s+=card(760,120,400,240,
   label('一歩に 沿う部分 × 長さ',960,185,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.5,.65),label('円の上：ぴったり沿う',960,245,{size:28,color:C.ink,anchor:'middle'})+T(`${cs(CB,'B')}\\times${cs(CST,'\\Delta\\ell')}`,960,315,{size:44})),seg(p,.2,.35));
  return s;
 },
 [K+'radial']:(p)=>{
  const a=35,[x,y]=pt(a),[tx,ty]=tdir(a),[rx,ry]=rdir(a);
  const Lt=70,Lr=60;
  let s=track({runner:a,rAng:a,field:.35,showR:.5})+bAt(a,{off:0,len:95,g:.8});
  const ex=x+Lt*tx+Lr*rx,ey=y+Lt*ty+Lr*ry;
  s+=fade(seg(p,.05,.2),arrow(x,y,ex,ey,{color:C.ink,w:5,head:16})+label('斜めの一歩',ex+14,ey-4,{size:24,color:C.ink}));
  s+=fade(seg(p,.25,.45),arrow(x,y,x+Lt*tx,y+Lt*ty,{color:CST,w:6,head:16})+arrow(x+Lt*tx,y+Lt*ty,ex,ey,{color:CP,w:5,head:16}));
  s+=card(760,110,400,280,
   label('円に沿う部分',800,175,{size:28,color:CST,weight:700})+label('→ B × 長さ',800,215,{size:26,color:C.ink})
   +fade(seg(p,.55,.7),label('半径の向きの部分',800,285,{size:28,color:CP,weight:700})+label('→ 𝐁 に直角：寄与 0',800,325,{size:26,color:C.ink})),seg(p,.25,.4));
  return s;
 },
 [K+'loopsum']:(p)=>{
  let s=track({rAng:35,field:.6});
  const k=Math.round(12*seg(p,.05,.5));
  for(let i=0;i<k;i++)s+=stepArrow(i*30+8,{len:62,text:false});
  s+=card(760,110,400,280,
   label('円の上：B はどこも同じ',960,170,{size:26,color:C.dim,anchor:'middle'})
   +label('Δℓ の合計 ＝ 円周',960,225,{size:28,color:CST,anchor:'middle',weight:700})+T('2\\pi r',960,272,{size:38,color:CST})
   +fade(seg(p,.6,.75),label('一周の和',960,330,{size:26,color:C.ink,anchor:'middle'})+T(`${cs(CB,'B')}\\times 2\\pi r`,960,378,{size:40})),seg(p,.25,.4));
  return s;
 },
 [K+'bagloop']:(p)=>{
  let s='';
  // left: closed surface (bag) with 𝐄 through it
  const bx=280,by=240;
  s+=`<circle cx="${bx}" cy="${by}" r="120" fill="${C.x}" fill-opacity=".12" stroke="${C.x}" stroke-width="3"/>`+dot(bx,by,12,'#ff6b6b');
  for(const d of [0,60,120,180,240,300]){const t=d*RAD;s+=arrow(bx+70*Math.cos(t),by-70*Math.sin(t),bx+175*Math.cos(t),by-175*Math.sin(t),{color:C.x,w:3.5,head:14});}
  s+=label('閉じた面（袋）で足す',bx,462,{size:28,color:C.x,anchor:'middle',weight:700});
  // right: closed loop with a wire through it
  const lx=860,ly=240;
  s+=fade(seg(p,.4,.6),fieldCircle(lx,ly,130,1,{nh:4,phase:45,w:4})+wireTop(lx,ly,'out')+label('閉じた輪に沿って足す',lx,462,{size:28,color:CB,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ampere']:(p)=>{
  const lx=300,ly=250;
  let s=fieldCircle(lx,ly,150,1,{nh:4,phase:45,w:4})+wireTop(lx,ly,'out',{text:''})+label('I',lx+30,ly-26,{size:30,color:CI,weight:700});
  s+=fade(seg(p,.35,.5),label('輪をくぐる 電流',lx,ly+196,{size:26,color:CI,anchor:'middle',weight:700}));
  s+=card(560,70,600,370,
   label('定常電流',860,120,{size:30,color:C.hi,anchor:'middle',weight:700})
   +label('時間で変わらない・どこにも電荷がたまらない',860,162,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.35,.55),label('一周の和',720,250,{size:30,color:CB,weight:700,anchor:'middle'})+label('∝',820,252,{size:36,color:C.ink,anchor:'middle'})+label('輪をくぐる電流 I',990,250,{size:30,color:CI,weight:700,anchor:'middle'}))
   +fade(seg(p,.7,.85),label('アンペールの法則',860,340,{size:34,color:C.hi,anchor:'middle',weight:700})+label('（詳しくは中級）',860,385,{size:24,color:C.dim,anchor:'middle'})),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'recap2']:(p)=>{
  let s='';
  // ① straight wire
  s+=card(40,70,350,380,fieldCircle(215,210,80,1,{nh:4,phase:45,w:3.5})+wireTop(215,210,'out',{text:''})+label('① 直線電流',215,350,{size:28,color:C.ink,anchor:'middle',weight:700})+label('右手で読める円',215,395,{size:26,color:CB,anchor:'middle'}),seg(p,.02,.15));
  // ② loop centre
  s+=card(425,70,350,380,ring(600,210,85,{color:CI,w:5})+[0,90,180,270].map(d=>{const t=d*RAD;return head(600+85*Math.cos(t),210-85*Math.sin(t),-Math.sin(t),-Math.cos(t),{color:CI,L:18});}).join('')+outSym(600,210,26,CB)+label('② コイルの中心',600,350,{size:28,color:C.ink,anchor:'middle',weight:700})+label('各部分の磁場が 重なる',600,395,{size:26,color:CB,anchor:'middle'}),seg(p,.3,.45));
  // ③ n = N/l
  s+=card(810,70,350,380,T(`n=\\dfrac{${cs(CI,'N')}}{L}`,985,200,{size:54,color:C.hi})+label('③ 巻き方の密さ',985,350,{size:28,color:C.ink,anchor:'middle',weight:700})+label('1 m あたりの巻数［/m］',985,395,{size:24,color:C.hi,anchor:'middle'}),seg(p,.6,.75));
  return s;
 },
 [K+'next']:(p)=>{
  const cx=420,cy=290;
  let s=`<ellipse cx="${cx}" cy="${cy}" rx="210" ry="70" fill="${C.hi}" fill-opacity=".14" stroke="${CI}" stroke-width="5"/>`;
  const xs=[-150,-90,-30,30,90,150];
  xs.forEach((dx,i)=>{const g=seg(p,.1+i*.05,.3+i*.05),yy=cy+((i%2)?20:-14);
   s+=fade(g,line(cx+dx,yy+150,cx+dx,yy,{color:CB,w:4,opacity:.45})+arrow(cx+dx,yy,cx+dx,yy-190,{color:CB,w:4,head:15}));});
  s+=vB(cx+170,cy-160,{size:32});
  s+=card(760,110,400,280,
   label('面を貫く',960,175,{size:28,color:C.dim,anchor:'middle'})+label('磁場の量',960,222,{size:34,color:CB,anchor:'middle',weight:700})
   +fade(seg(p,.5,.65),label('時間とともに 変わると？',960,318,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.25,.4),C.hi);
  return s;
 },
};

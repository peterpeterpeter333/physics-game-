// YouTube シリーズ「ローレンツ力・初級 1/1」(ys-ui-magnetic-force-1) — 図。Stage 1200×515.
// 色：速度 𝐯 紫、磁場 𝐁 橙（電磁気編）、力 𝐅 緑、正電荷 赤、電子 青、電流 I 黄、電荷 q 桃。ベクトルは太字、大きさは細字。
// ⊙＝画面の手前向き、⊗＝奥向き（外積・初級 2/2 と同じ描き方）。右ねじ：𝐯 → 𝐁 に回す（外積の 𝐀 → 𝐁）。
// 向きの検算（x 右・y 上・z 手前）：x̂×ŷ＝ẑ（⊙）。x̂×(−ẑ)＝ŷ（上）。ŷ×(−ẑ)＝−x̂（左）。𝐁 奥で正電荷は反時計回り、電子は時計回り。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,poly,tex,texWidth} from './anim.mjs';

const K='ui-magnetic-force-1:';
const CV=C.v,CB=C.E,CF=C.F,POS=C.a,NEG='#7fb3ff',CI=C.hi,CQ=C.p,CD=C.x;
const RAD=Math.PI/180;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
const vV=cs(CV,'\\mathbf{v}'),vB=cs(CB,'\\mathbf{B}'),vF=cs(CF,'\\mathbf{F}'),qq=cs(CQ,'q');
const LAW=`${vF}=${qq}\\,${vV}\\times${vB}`;
const vl=(s,x,y,{size=30,color=C.ink,anchor='start'}={})=>tex(`\\mathbf{${s}}`,x,y,{size:size+6,color,anchor,auto:false});
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);

// ---- symbols -----------------------------------------------------------------------------------
function outSym(x,y,r=22,color=CF,g=1){return fade(g,ring(x,y,r,{color,w:4,fill:'#10182c'})+dot(x,y,r*.28,color));}
function inSym(x,y,r=22,color=CF,g=1){const d=r*.62;return fade(g,ring(x,y,r,{color,w:4,fill:'#10182c'})+line(x-d,y-d,x+d,y+d,{color,w:4})+line(x-d,y+d,x+d,y-d,{color,w:4}));}
function charge(x,y,sign=1,r=20,g=1){const c=sign>0?POS:NEG;return fade(g,ring(x,y,r,{color:c,w:3,fill:sign>0?'#3a1d2a':'#1b2a48'})+label(sign>0?'＋':'−',x,y+r*.38,{size:r*1.1,color:c,anchor:'middle',weight:700}));}
// uniform field into the screen: a grid of faint ⊗
function intoField(x0,y0,x1,y1,{step=80,g=1,r=10}={}){
 let s='';for(let x=x0;x<=x1+1;x+=step)for(let y=y0;y<=y1+1;y+=step){const d=r*.62;s+=ring(x,y,r,{color:CB,w:2})+line(x-d,y-d,x+d,y+d,{color:CB,w:2})+line(x-d,y+d,x+d,y-d,{color:CB,w:2});}
 return fade(g*.55,s);
}
// uniform field pointing up in the screen: columns of faint arrows
function upField(x0,x1,y0,y1,{step=104,g=1,lab=1}={}){
 let s='';for(let x=x0;x<=x1+1;x+=step)s+=arrow(x,y1,x,y0,{color:CB,w:3,head:14});
 return fade(g*.5,s)+(lab?fade(g,vl('B',x0+14,y0+26,{color:CB})):'');
}
function rightMark(x,y,a,b,s=14,color=C.dim){return draw([[x+a[0]*s,y+a[1]*s],[x+(a[0]+b[0])*s,y+(a[1]+b[1])*s],[x+b[0]*s,y+b[1]*s]],1,{color,w:2});}
function arc2(pts,{c1=CV,c2=CB,w=5,g=1}={}){
 if(g<=0||pts.length<3)return '';
 const n=pts.length,h=Math.floor(n/2),[x1,y1]=pts[n-2],[x2,y2]=pts[n-1];
 const a=Math.atan2(y2-y1,x2-x1),L=16;
 const head=`<polygon points="${x2+Math.cos(a)*6},${y2+Math.sin(a)*6} ${x2-L*Math.cos(a)+L*.55*Math.sin(a)},${y2-L*Math.sin(a)-L*.55*Math.cos(a)} ${x2-L*Math.cos(a)-L*.55*Math.sin(a)},${y2-L*Math.sin(a)+L*.55*Math.cos(a)}" fill="${c2}"/>`;
 return fade(g,draw(pts.slice(0,h+1),1,{color:c1,w})+draw(pts.slice(h),1,{color:c2,w})+head);
}
const circPts=(cx,cy,r,a0,a1,n=40)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});
function hexagon(cx,cy,r,rot){return Array.from({length:6},(_,i)=>{const a=rot+i*Math.PI/3;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});}

// ---- circular motion in a field into the screen ------------------------------------------------
// φ: angle on the circle (math convention, screen y down). sign>0: counter-clockwise.
const CIR={cx:400,cy:262,R:165};
function onCircle(phi,{cx=CIR.cx,cy=CIR.cy,R=CIR.R,sign=1}={}){
 const x=cx+R*Math.cos(phi),y=cy-R*Math.sin(phi);
 const v=sign>0?[-Math.sin(phi),-Math.cos(phi)]:[Math.sin(phi),Math.cos(phi)];
 const f=[-Math.cos(phi),Math.sin(phi)];
 return {x,y,v,f};
}
function vfAt(x,y,v,f,{lv=90,lf=70,g=1,mark=1,labels=0,sign=1}={}){
 let s=arrow(x,y,x+v[0]*lv,y+v[1]*lv,{color:CV,w:5,head:16})+arrow(x,y,x+f[0]*lf,y+f[1]*lf,{color:CF,w:5,head:16});
 if(mark)s+=rightMark(x,y,v,f,14);
 s+=charge(x,y,sign,13);
 if(labels)s+=vl('v',x+v[0]*lv+v[0]*16-10,y+v[1]*lv+v[1]*16+10,{size:24,color:CV})+vl('F',x+f[0]*lf+f[0]*18-10,y+f[1]*lf+f[1]*18+10,{size:24,color:CF});
 return fade(g,s);
}
function circleBase({g=1,path=1,field=1,cx=CIR.cx,cy=CIR.cy,R=CIR.R,dash='8 8'}={}){
 return (field?intoField(80,70,720,470,{g}):'')+fade(g*path,draw(circPts(cx,cy,R,0,2*Math.PI,90),1,{color:C.dim,w:2.5,dash}));
}

// ---- 3D triad: v = x̂, B and F rotated together about v -------------------------------------------
// α=0: B up, F toward the viewer (⊙). α=90°: B into the screen (⊗), F up. k: oblique view amount.
function triad(alpha,k,{ox=320,oy=320,g=1,plane=1,axis=0}={}){
 const P=(x,y,z)=>[ox+x-.5*k*z,oy-y+.36*k*z];
 const V=[220,0,0],B=[0,170*Math.cos(alpha),-170*Math.sin(alpha)],F=[0,150*Math.sin(alpha),150*Math.cos(alpha)];
 const [vx,vy]=P(...V),[bx,by]=P(...B),[fx,fy]=P(...F),[qx,qy]=P(V[0]+B[0],V[1]+B[1],V[2]+B[2]);
 let s=fade(plane,poly([[ox,oy],[vx,vy],[qx,qy],[bx,by]],{fill:CI,fo:.10,stroke:C.faint,sw:2}));
 if(axis)s+=fade(axis,line(ox-120,oy,ox+350,oy,{color:C.dim,w:2,dash:'8 8'})+arc2(circPts(ox+310,oy,30,-.6*Math.PI,.55*Math.PI,24),{c1:C.dim,c2:C.dim,w:3}));
 const lb=Math.hypot(bx-ox,by-oy),lf=Math.hypot(fx-ox,fy-oy);
 const bArrow=arrow(ox,oy,bx,by,{color:CB,w:6,opacity:clamp((lb-24)/30)})+fade(clamp((lb-40)/30),vl('B',bx+(bx>=ox?12:-40),by-6,{color:CB}));
 const fArrow=arrow(ox,oy,fx,fy,{color:CF,w:6,opacity:clamp((lf-24)/30)})+fade(clamp((lf-40)/30),vl('F',fx+(fx>=ox-5?12:-40),fy-4,{color:CF}));
 const back=B[2]<0; // B behind the screen plane is drawn first
 s+=(back?bArrow:'')+arrow(ox,oy,vx,vy,{color:CV,w:6})+vl('v',vx+12,vy+10,{color:CV})+(back?'':bArrow)+fArrow;
 s+=charge(ox,oy,1,16);
 s+=outSym(ox,oy,26,CF,clamp(1-lf/24))+inSym(ox,oy,26,CB,clamp(1-lb/24)*(back?1:0));
 return fade(g,s);
}

// ---- bar magnet and compasses ---------------------------------------------------------------------
const MG={cx:340,cy:285,a:100};
function magnetField(x,y){
 const N=[MG.cx+MG.a,MG.cy],S=[MG.cx-MG.a,MG.cy];
 const f=(p,q)=>{const dx=x-p[0],dy=y-p[1],r3=Math.pow(dx*dx+dy*dy,1.5);return [q*dx/r3,q*dy/r3];};
 const a=f(N,1),b=f(S,-1),bx=a[0]+b[0],by=a[1]+b[1],L=Math.hypot(bx,by);return [bx/L,by/L];
}
function barMagnet(g=1){
 const {cx,cy}=MG;
 return fade(g,rect(cx-130,cy-30,130,60,{fill:NEG,fo:.55,stroke:NEG,rx:4})+rect(cx,cy-30,130,60,{fill:POS,fo:.55,stroke:POS,rx:4})
  +label('S',cx-65,cy+11,{size:32,color:C.ink,anchor:'middle',weight:700})+label('N',cx+65,cy+11,{size:32,color:C.ink,anchor:'middle',weight:700}));
}
function compass(x,y,{g=1,needle=1,bArrow=0}={}){
 const [dx,dy]=magnetField(x,y),nx=-dy,ny=dx,L=24,W=7;
 let s=ring(x,y,32,{color:C.faint,w:2,fill:'#10182c'});
 s+=fade(needle,poly([[x+dx*L,y+dy*L],[x+nx*W,y+ny*W],[x-nx*W,y-ny*W]],{fill:POS,fo:1})+poly([[x-dx*L,y-dy*L],[x+nx*W,y+ny*W],[x-nx*W,y-ny*W]],{fill:'#c9d2e3',fo:1}));
 s+=fade(bArrow,arrow(x-dx*30,y-dy*30,x+dx*46,y+dy*46,{color:CB,w:5,head:16}));
 return fade(g,s);
}
const COMPASS=[[340,120],[175,165],[505,165],[80,285],[600,285],[175,405],[505,405],[340,450]];

// ---- summary rows ----------------------------------------------------------------------------------
function sumRows(n,p){
 const rows=[
  ['磁場 𝐁',()=>label('向き：方位磁針の N 極',330,142,{size:28,color:C.ink})+T(`B=\\dfrac{F}{q\\,v}\\ \\ [\\mathrm{T}]`,900,128,{size:40,color:CB})],
  ['力の向き',()=>T(LAW,420,258,{size:48})+label('𝐯 → 𝐁 の右ねじ，負なら逆',720,268,{size:28,color:C.ink})],
  ['仕事',()=>T(`P=${vF}\\cdot${vV}=0`,420,392,{size:44})+label('速さ一定，向きだけ曲がる',720,402,{size:28,color:C.hi,weight:700})],
 ];
 let s='';rows.forEach(([h,f],i)=>{if(i>=n)return;const y=80+i*130,g=i===n-1?seg(p,.02,.15):1;s+=fade(g,rect(80,y,1040,110,{fill:'#131f38',fo:.96,stroke:C.faint,rx:14})+label(h,110,y+62,{size:28,color:C.dim})+f());});
 return s;
}

function unitSteps(r1,r2,r3,r3b,r4){
 let s=fade(r1,T(`B=\\dfrac{6\\,\\mathrm{N}}{2\\,\\mathrm{C}\\times3\\,\\mathrm{m/s}}`,140,120,{size:46,anchor:'start',color:C.ink}));
 s+=fade(r2,T(`=1\\ \\dfrac{\\mathrm{N}}{\\mathrm{C}\\cdot\\mathrm{m/s}}`,560,120,{size:46,anchor:'start',color:C.ink}));
 s+=fade(r3,T(`\\mathrm{C/s}=\\mathrm{A}`,140,265,{size:44,anchor:'start',color:CI})+label('（1秒に 1 C ＝ 1 A）',470,275,{size:26,color:C.dim}));
 s+=fade(r3b,T(`=1\\ \\dfrac{\\mathrm{N}}{\\mathrm{A}\\cdot\\mathrm{m}}`,140,400,{size:46,anchor:'start',color:C.ink}));
 s+=fade(r4,T(`=1\\,\\mathrm{T}`,420,400,{size:52,anchor:'start',color:CB})+highlight(400,355,190,86,1,CB)+label('テスラ',630,410,{size:30,color:CB,weight:700}));
 return s;
}

export const ytUiMagneticForce1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  const y=250;
  let s=rect(80,y-50,640,100,{fill:'#8795ad',fo:.12,stroke:C.dim,sw:2,rx:12});
  s+=rect(390,y-70,20,140,{fill:CI,fo:.25,stroke:CI,sw:2,rx:4})+label('断面',400,y+150,{size:24,color:CI,anchor:'middle'});
  for(let i=0;i<9;i++){const x=700-((i*68+p*300)%600);s+=charge(x,y+((i%3)-1)*26,-1,13);}
  s+=fade(seg(p,.05,.2),arrow(250,y+95,550,y+95,{color:CI,w:6})+label('電流 I',560,y+104,{size:28,color:CI,weight:700}));
  s+=fade(seg(p,.05,.2),arrow(550,y-95,250,y-95,{color:NEG,w:4,head:14})+label('電子の動き',560,y-86,{size:26,color:NEG}));
  s+=card(790,110,370,260,T(`I=\\dfrac{\\Delta Q}{\\Delta t}`,975,190,{size:50,color:CI})
   +fade(seg(p,.45,.6),label('1 A ＝ 1秒に 1 C',975,300,{size:32,color:C.ink,anchor:'middle',weight:700})),seg(p,.1,.25));
  return s;
 },
 [K+'question']:(p)=>{
  let s=intoField(80,70,660,430,{g:seg(p,0,.2)});
  const x=mix(140,380,seg(p,.1,.6));
  s+=arrow(x,280,x+110,280,{color:CV,w:6})+vl('v',x+118,290,{color:CV})+charge(x,280,1,18);
  s+=fade(seg(p,.4,.6),label('？',x,200,{size:48,color:CF,anchor:'middle',weight:700})+label('力',x,140,{size:26,color:CF,anchor:'middle'}));
  s+=fade(seg(p,0,.2),label('磁場の中（⊗：奥向き）',80,480,{size:24,color:CB}));
  s+=card(720,90,440,150,label('① 力は',940,145,{size:28,color:C.dim,anchor:'middle'})+label('どちらを 向く？',940,200,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  s+=card(720,280,440,150,label('② 運動に',940,335,{size:28,color:C.dim,anchor:'middle'})+label('何を する？',940,390,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'turn']:(p)=>{
  const cx=320,cy=262,R=170,phi=seg(p,.05,.6)*Math.PI/2;
  let s=draw(circPts(cx,cy,R,0,2*Math.PI,90),1,{color:C.dim,w:2.5,dash:'8 8'})+dot(cx,cy,5,C.dim);
  const x=cx+R*Math.cos(phi),y=cy-R*Math.sin(phi);
  s+=fade(seg(p,.1,.25),arrow(cx+R,cy,cx+R,cy-110,{color:CV,w:5,opacity:.45}));
  s+=arrow(x,y,x-110*Math.sin(phi),y-110*Math.cos(phi),{color:CV,w:6})+dot(x,y,11,C.ink);
  s+=fade(seg(p,.6,.75),arrow(cx,cy-R,cx,cy-R+70,{color:C.a,w:5})+label('中心向き',cx+14,cy-R+62,{size:24,color:C.a}));
  s+=card(720,120,440,250,label('速さは 一定',940,185,{size:30,color:CV,anchor:'middle',weight:700})
   +fade(seg(p,.5,.65),label('でも 加速度が ある',940,250,{size:30,color:C.a,anchor:'middle',weight:700})+label('（慣性力と軌道の回）',940,310,{size:24,color:C.dim,anchor:'middle'})),seg(p,.05,.2));
  return s;
 },
 [K+'turn2']:(p)=>{
  const ox=300,oy=380,L=150;
  let s=arrow(ox,oy,ox,oy-L,{color:CV,w:6})+label('前',ox-14,oy-L/2,{size:24,color:CV,anchor:'end'});
  s+=fade(seg(p,.1,.3),arrow(ox,oy,ox-L,oy,{color:CV,w:6})+label('後',ox-L/2,oy+36,{size:24,color:CV,anchor:'middle'}));
  s+=fade(seg(p,.1,.3),label('長さ（速さ）は 同じ',ox-40,oy+80,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.3,.45),arrow(ox,oy-L,ox-L,oy,{color:C.a,w:5})+label('速度の変化',ox-L/2-20,oy-L/2-24,{size:24,color:C.a,anchor:'end'}));
  // a perpendicular push on a moving object
  const bx=520,by=300;
  s+=fade(seg(p,.55,.7),arrow(bx,by,bx+120,by,{color:CV,w:6})+vl('v',bx+128,by+10,{color:CV})+arrow(bx,by,bx,by-110,{color:CF,w:6})+vl('F',bx+12,by-100,{color:CF})+rightMark(bx,by,[1,0],[0,-1])+dot(bx,by,10,C.ink)
   +draw(circPts(bx,by-260,260,-Math.PI/2,-Math.PI/2+.5,30),1,{color:C.dim,w:2.5,dash:'6 8'}));
  s+=card(720,120,440,270,label('向きが 変わる',940,185,{size:30,color:C.ink,anchor:'middle'})+label('＝ 速度が 変わる',940,240,{size:30,color:C.a,anchor:'middle',weight:700})
   +fade(seg(p,.6,.75),label('直角な力でも',940,310,{size:28,color:C.ink,anchor:'middle'})+label('運動を 変えられる',940,360,{size:30,color:CF,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 // ===== S2 磁場の矢印 =====
 [K+'magnet']:(p)=>{
  let s=barMagnet(seg(p,0,.15));
  COMPASS.forEach(([x,y],i)=>{s+=compass(x,y,{g:seg(p,.25+i*.06,.33+i*.06)});});
  s+=card(740,140,420,210,label('方位磁針の 針は',950,210,{size:30,color:C.ink,anchor:'middle'})+label('場所ごとに 決まった向き',950,275,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.7,.85));
  return s;
 },
 [K+'magnet2']:(p)=>{
  let s=barMagnet();
  COMPASS.forEach(([x,y],i)=>{s+=compass(x,y,{needle:1-.7*seg(p,.3,.5),bArrow:seg(p,.3+i*.03,.4+i*.03)});});
  s+=card(740,90,420,330,label('N 極が 指す向き',950,150,{size:28,color:POS,anchor:'middle',weight:700})+label('＝ 磁場',930,210,{size:30,color:C.ink,anchor:'middle'})+vl('B',1000,202,{color:CB})+label('の向き',950,265,{size:30,color:C.ink,anchor:'middle'})
   +fade(seg(p,.6,.75),label('電場と同じ',950,330,{size:26,color:C.dim,anchor:'middle'})+label('場所ごとの 矢印の地図',950,380,{size:28,color:CB,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'rest']:(p)=>{
  let s=upField(110,630,90,470,{g:seg(p,0,.2)})+label('一様な磁場',370,505-4,{size:24,color:CB,anchor:'middle'});
  s+=charge(370,300,1,20,seg(p,.3,.45))+fade(seg(p,.5,.65),label('止まっている',370,250,{size:26,color:C.ink,anchor:'middle'}));
  s+=card(720,90,440,110,label('止まっている',760,155,{size:28,color:C.ink})+label('力 0',1120,155,{size:30,color:CF,anchor:'end',weight:700}),seg(p,.6,.75));
  return s;
 },
 [K+'move']:(p)=>{
  let s=upField(110,630,90,470)+label('一様な磁場',370,505-4,{size:24,color:CB,anchor:'middle'});
  const a=seg(p,.05,.35),b=seg(p,.45,.8);
  if(p<.42){const y=mix(380,200,a);s+=arrow(370,y,370,y-100,{color:CV,w:6})+vl('v',384,y-80,{color:CV})+charge(370,y,1,20)+fade(seg(p,.2,.3),label('力 0',440,y+10,{size:28,color:CF,weight:700}));}
  else{const x=mix(180,440,b);s+=arrow(x,300,x+110,300,{color:CV,w:6})+vl('v',x+118,310,{color:CV})+charge(x,300,1,20)+outSym(x,230,20,CF,seg(p,.55,.65))+fade(seg(p,.6,.7),label('力（向きは あとで）',x+34,238,{size:24,color:CF}));}
  s+=card(720,90,440,110,label('止まっている',760,155,{size:28,color:C.ink})+label('力 0',1120,155,{size:30,color:CF,anchor:'end',weight:700}));
  s+=card(720,220,440,110,label('𝐁 と 平行に動く',760,285,{size:28,color:C.ink})+label('力 0',1120,285,{size:30,color:CF,anchor:'end',weight:700}),seg(p,.2,.32));
  s+=card(720,350,440,110,label('𝐁 と 直角に動く',760,415,{size:28,color:C.ink})+label('最大',1120,415,{size:30,color:CF,anchor:'end',weight:700}),seg(p,.6,.72));
  s+=fade(seg(p,.8,.92),label('実験で 分かったこと',940,495,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'prop']:(p)=>{
  let s=upField(110,630,90,470)+label('𝐁 と 直角に動く',370,505-4,{size:24,color:C.dim,anchor:'middle'});
  s+=arrow(300,300,410,300,{color:CV,w:6})+vl('v',418,310,{color:CV})+charge(300,300,1,20)+label('q',300,352,{size:30,color:CQ,anchor:'middle',weight:700})+outSym(300,230,20,CF)+label('力 F',334,238,{size:26,color:CF});
  s+=card(720,90,440,300,label('力の 大きさ F',940,145,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.25,.4),label('q を 2倍',760,220,{size:30,color:CQ})+label('→ 2倍',1120,220,{size:30,color:CF,anchor:'end',weight:700}))
   +fade(seg(p,.55,.7),label('v を 2倍',760,290,{size:30,color:CV})+label('→ 2倍',1120,290,{size:30,color:CF,anchor:'end',weight:700}))
   +fade(seg(p,.75,.9),label('q にも v にも 比例',940,360,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'define']:(p)=>{
  let s=upField(110,630,90,470);
  s+=arrow(300,300,410,300,{color:CV,w:6})+vl('v',418,310,{color:CV})+charge(300,300,1,20)+label('q',300,352,{size:30,color:CQ,anchor:'middle',weight:700})+outSym(300,230,20,CF)+label('力 F',334,238,{size:26,color:CF});
  s+=card(700,70,460,380,label('磁場の強さ（定義）',930,112,{size:26,color:C.dim,anchor:'middle'})
   +T(`${cs(CB,'B')}=\\dfrac{${cs(CF,'F')}}{${qq}\\,${cs(CV,'v')}}`,930,222,{size:54})
   +label('（𝐯 と 𝐁 が 直角のとき）',930,290,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.55,.7),label('1 C が 秒速 1 m で',930,350,{size:28,color:C.ink,anchor:'middle'})+label('動く ときの力',930,395,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2),CB);
  return s;
 },
 [K+'example']:(p)=>{
  let s=card(60,70,540,170,label('電場',100,125,{size:28,color:CD,weight:700})+T(`E=\\dfrac{F}{q}`,300,135,{size:40,color:CD})+label('1 C あたりの力',330,205,{size:26,color:C.ink,anchor:'middle'}));
  s+=card(620,70,540,170,label('磁場',660,125,{size:28,color:CB,weight:700})+T(`B=\\dfrac{F}{q\\,v}`,870,135,{size:40,color:CB})+label('1 C・1 m/s あたりの力',890,205,{size:26,color:C.ink,anchor:'middle'}),seg(p,.1,.25),CB);
  const g=seg(p,.5,.65);
  s+=fade(g,arrow(380,380,520,380,{color:CV,w:6})+label('3 m/s',530,390,{size:28,color:CV,weight:700})+charge(380,380,1,22)+label('2 C',380,440,{size:28,color:CQ,anchor:'middle',weight:700})
   +outSym(380,310,20,CF)+label('6 N',412,318,{size:28,color:CF,weight:700})+label('𝐁 と 直角',160,390,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(g,arrow(760,470,760,300,{color:CB,w:5})+vl('B',774,316,{color:CB})+label('B ＝ ？',860,400,{size:32,color:C.hi,weight:700}));
  return s;
 },
 [K+'unit']:(p)=>unitSteps(seg(p,0,.1),seg(p,.25,.37),seg(p,.5,.62),seg(p,.62,.74),0),
 [K+'unit2']:(p)=>unitSteps(1,1,1,1,seg(p,.05,.25)),
 [K+'notforce']:(p)=>{
  let s=upField(110,470,90,470,{lab:0});
  s+=arrow(290,450,290,120,{color:CB,w:8,head:22})+vl('B',306,140,{color:CB,size:34});
  s+=arrow(290,300,400,300,{color:CV,w:6})+vl('v',408,310,{color:CV})+charge(290,300,1,20)+outSym(220,300,20,CF)+label('力',220,262,{size:26,color:CF,anchor:'middle'});
  s+=card(620,80,540,160,T(`B=1\\,\\mathrm{T}`,760,160,{size:48,color:CB})+fade(seg(p,.05,.2),label('1 N ではない',1070,170,{size:30,color:C.a,anchor:'end',weight:700})));
  s+=card(620,270,540,170,label('𝐁 の矢印',700,335,{size:30,color:CB,weight:700})+label('≠',890,337,{size:36,color:C.ink,anchor:'middle',weight:700})+label('力の矢印',950,335,{size:30,color:CF,weight:700})
   +label('力は 別の向き',890,405,{size:26,color:C.dim,anchor:'middle'}),seg(p,.55,.7),C.hi);
  return s;
 },
 // ===== S3 力の向きは右ねじ =====
 [K+'law']:(p)=>{
  let s=T(LAW,600,190,{size:96});
  const g=seg(p,.3,.5);
  s+=fade(g,label('q：電荷（＋か−）',380,320,{size:28,color:CQ,anchor:'middle'})+label('𝐯：速度',640,320,{size:28,color:CV,anchor:'middle'})+label('𝐁：磁場',850,320,{size:28,color:CB,anchor:'middle'}));
  s+=fade(seg(p,.4,.55),label('実験で 確かめられてきた 法則',600,410,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('（外積の回の 最後に 名前だけ）',600,470,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'size']:(p)=>{
  const ox=180,oy=400,th=60*RAD;
  let s=arrow(ox,oy,ox+260,oy,{color:CV,w:6})+vl('v',ox+270,oy+10,{color:CV});
  s+=arrow(ox,oy,ox+230*Math.cos(th),oy-230*Math.sin(th),{color:CB,w:6})+vl('B',ox+230*Math.cos(th)+10,oy-230*Math.sin(th),{color:CB});
  s+=draw(circPts(ox,oy,54,0,th,24),1,{color:C.hi,w:3})+label('θ',ox+80,oy-36,{size:26,color:C.hi,weight:700});
  s+=card(620,70,540,380,label('外積の回',890,120,{size:24,color:C.dim,anchor:'middle'})
   +T(`\\mathbf{A}\\times\\mathbf{B}\\ \\rightarrow\\ ${vV}\\times${vB}`,890,180,{size:40})
   +fade(seg(p,.3,.45),T(`F=${qq}\\,${cs(CV,'v')}\\,${cs(CB,'B')}\\sin\\theta`,890,275,{size:44,color:CF}))
   +fade(seg(p,.3,.45),label('（q が 正のとき）',890,335,{size:24,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.65,.8),label('平行で 0，直角で 最大',890,405,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'size2']:(p)=>{
  const ox=180,oy=400,d=90*seg(p,.05,.8),th=d*RAD;
  let s=arrow(ox,oy,ox+260,oy,{color:CV,w:6})+vl('v',ox+270,oy+10,{color:CV});
  s+=arrow(ox,oy,ox+230*Math.cos(th),oy-230*Math.sin(th),{color:CB,w:6})+vl('B',ox+230*Math.cos(th)+10,oy-230*Math.sin(th)-(d<15?24:0),{color:CB});
  if(d>3)s+=draw(circPts(ox,oy,54,0,th,24),1,{color:C.hi,w:3});
  s+=label(`θ ＝ ${Math.round(d)}°`,ox,120,{size:30,color:C.hi,weight:700});
  const F=Math.sin(th);
  s+=rect(700,150,420*F,40,{fill:CF,fo:.55,rx:6})+rect(700,150,420,40,{fill:'none',fo:0,stroke:C.faint,rx:6})+label('力の大きさ',700,130,{size:26,color:CF});
  s+=label(`sinθ ＝ ${F.toFixed(2)}`,700,250,{size:30,color:C.ink});
  s+=fade(d<5?1:0,label('平行：力 0',700,330,{size:32,color:C.hi,weight:700}))+fade(d>85?1:0,label('直角：最大',700,330,{size:32,color:C.hi,weight:700}));
  return s;
 },
 [K+'size30']:(p)=>{
  const ox=180,oy=400,th=30*RAD;
  let s=arrow(ox,oy,ox+260,oy,{color:CV,w:6})+vl('v',ox+270,oy+10,{color:CV})+label('3 m/s',ox+200,oy+44,{size:24,color:CV});
  s+=arrow(ox,oy,ox+250*Math.cos(th),oy-250*Math.sin(th),{color:CB,w:6})+vl('B',ox+250*Math.cos(th)+10,oy-250*Math.sin(th),{color:CB})+label('1 T',ox+250*Math.cos(th)-40,oy-250*Math.sin(th)-34,{size:24,color:CB});
  s+=draw(circPts(ox,oy,90,0,th,24),1,{color:C.hi,w:3})+label('30°',ox+104,oy-16,{size:24,color:C.hi,weight:700})+charge(ox,oy,1,16)+label('2 C',ox-30,oy+10,{size:24,color:CQ,anchor:'end'});
  s+=card(620,90,540,330,T(`F=2\\times3\\times1\\times\\sin30^\\circ`,890,170,{size:40,color:CF})
   +fade(seg(p,.35,.5),T(`=3\\,\\mathrm{N}`,890,255,{size:46,color:CF}))
   +fade(seg(p,.6,.75),label('直角（6 N）の 半分',890,350,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'screw']:(p)=>{
  const ox=260,oy=360;
  let s=arrow(ox,oy,ox+230,oy,{color:CV,w:6})+vl('v',ox+240,oy+10,{color:CV});
  s+=arrow(ox,oy,ox,oy-210,{color:CB,w:6})+vl('B',ox+14,oy-196,{color:CB});
  s+=arc2(circPts(ox,oy,90,0,Math.PI/2*seg(p,.2,.6),30),{g:seg(p,.2,.25)});
  s+=`<g transform="rotate(${(-40*seg(p,.2,.6)).toFixed(1)} ${ox} ${oy})">`+poly(hexagon(ox,oy,26,0),{fill:'#46526e',fo:1,stroke:C.ink,sw:2.5})+`</g>`;
  s+=card(640,90,520,330,label('① 𝐯 から ② 𝐁 へ 回す',900,150,{size:30,color:C.ink,anchor:'middle'})
   +label('（外積の回：𝐀 → 𝐯，𝐁 → 𝐁）',900,205,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.6,.75),label('𝐯 右 → 𝐁 上',900,285,{size:30,color:C.ink,anchor:'middle'})+label('反時計回り',900,345,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'screw2']:(p)=>{
  const ox=260,oy=360;
  let s=arrow(ox,oy,ox+230,oy,{color:CV,w:6})+vl('v',ox+240,oy+10,{color:CV});
  s+=arrow(ox,oy,ox,oy-210,{color:CB,w:6})+vl('B',ox+14,oy-196,{color:CB});
  s+=arc2(circPts(ox,oy,90,0,Math.PI/2,30));
  s+=`<g transform="rotate(${(-40-60*seg(p,.05,.4)).toFixed(1)} ${ox} ${oy})">`+poly(hexagon(ox,oy,26,0),{fill:'#46526e',fo:1*(1-seg(p,.45,.6)),stroke:C.ink,sw:2.5})+`</g>`;
  s+=outSym(ox,oy,26,CF,seg(p,.5,.65))+fade(seg(p,.55,.7),vl('F',ox-70,oy+50,{color:CF}));
  s+=card(640,90,520,330,label('反時計回り に回すと',900,150,{size:28,color:C.ink,anchor:'middle'})+label('ねじは ゆるんで 手前へ',900,205,{size:30,color:C.dim,anchor:'middle'})
   +fade(seg(p,.55,.7),label('正の電荷：',780,300,{size:30,color:POS,weight:700})+label('𝐅 は 手前',940,300,{size:30,color:CF,weight:700})+outSym(900,365,24,CF)),seg(p,0,.12));
  return s;
 },
 [K+'negative']:(p)=>{
  const panel=(cx,sign,g)=>{const ox=cx-110,oy=380;
   let t=arrow(ox,oy,ox+180,oy,{color:CV,w:6})+vl('v',ox+188,oy+10,{color:CV})+arrow(ox,oy,ox,oy-190,{color:CB,w:6})+vl('B',ox+14,oy-176,{color:CB});
   t+=(sign>0?outSym(ox+100,oy-100,28,CF):inSym(ox+100,oy-100,28,CF))+label(sign>0?'𝐅：手前':'𝐅：奥',ox+140,oy-92,{size:28,color:CF,weight:700});
   t+=charge(ox,oy,sign,16)+label(sign>0?'正の電荷':'負の電荷（電子）',cx,90,{size:30,color:sign>0?POS:NEG,anchor:'middle',weight:700});
   return fade(g,t);};
  let s=panel(300,1,1)+panel(860,-1,seg(p,.3,.45));
  s+=line(600,70,600,440,{color:C.faint,w:2});
  s+=fade(seg(p,.05,.2),label('𝐅 は 𝐯 にも 𝐁 にも 直角',300,480,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('q が マイナス → 逆向き',860,480,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'tilt']:(p)=>{
  const k=seg(p,.05,.35),al=45*RAD*seg(p,.4,.95);
  let s=triad(al,k,{axis:seg(p,.3,.45)});
  s+=card(760,110,400,260,label('𝐯 を 軸に',960,175,{size:30,color:C.ink,anchor:'middle'})+label('3本を まとめて 回す',960,235,{size:30,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.5,.65),label('𝐁 は 奥へ 倒れ',960,300,{size:28,color:CB,anchor:'middle'})+label('𝐅 は 立ち上がる',960,345,{size:28,color:CF,anchor:'middle'})),seg(p,.3,.45));
  return s;
 },
 [K+'tilt2']:(p)=>{
  const al=mix(45,90,seg(p,.02,.45))*RAD,k=1-seg(p,.02,.45);
  let s=triad(al,k,{axis:1-seg(p,.4,.5)});
  s+=card(760,110,400,300,label('𝐯：右',960,175,{size:30,color:CV,anchor:'middle',weight:700})+label('𝐁：奥（⊗）',960,235,{size:30,color:CB,anchor:'middle',weight:700})
   +fade(seg(p,.5,.65),label('正の電荷の 𝐅：上',960,320,{size:32,color:CF,anchor:'middle',weight:700})),seg(p,.4,.55));
  return s;
 },
 [K+'quiz']:(p)=>{
  const ox=320,oy=380;
  let s=intoField(80,70,640,390,{g:1});
  s+=arrow(ox,oy,ox,oy-200,{color:CV,w:6})+vl('v',ox+14,oy-186,{color:CV})+charge(ox,oy,1,18)+label('𝐁：奥向き（⊗）',80,500,{size:24,color:CB});
  s+=card(720,120,440,270,label('𝐁：奥向き（⊗）',940,180,{size:30,color:CB,anchor:'middle'})+label('正の電荷が 上へ',940,240,{size:30,color:CV,anchor:'middle'})+label('力は どちら？',940,320,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'quizA']:(p)=>{
  const ox=380,oy=330,b=90*RAD*seg(p,.05,.5);
  let s=intoField(80,70,640,390,{g:1});
  const v=[Math.cos(b),-Math.sin(b)],f=[-Math.sin(b),-Math.cos(b)];
  s+=arrow(ox,oy,ox+v[0]*190,oy+v[1]*190,{color:CV,w:6})+vl('v',ox+v[0]*205-8,oy+v[1]*205+(b>1?-6:10),{color:CV});
  s+=arrow(ox,oy,ox+f[0]*160,oy+f[1]*160,{color:CF,w:6})+vl('F',ox+f[0]*178-(b>1?30:8),oy+f[1]*178+(b>1?10:-6),{color:CF});
  s+=rightMark(ox,oy,v,f,16)+charge(ox,oy,1,18);
  s+=fade(seg(p,.05,.15)*(1-seg(p,.5,.6)),arc2(circPts(ox,oy,120,.2,.2+Math.PI/2*seg(p,.05,.5),30),{c1:C.dim,c2:C.dim,w:3}));
  s+=card(720,120,440,290,label('反時計回りに 90° 回す',940,180,{size:28,color:C.ink,anchor:'middle'})+label('𝐁 は 奥向きのまま',940,235,{size:26,color:CB,anchor:'middle'})
   +fade(seg(p,.55,.7),label('𝐯：上 → 𝐅：左',940,310,{size:32,color:CF,anchor:'middle',weight:700})+label('答え：左向き',940,370,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 // ===== S4 仕事は0、だから円 =====
 [K+'launch']:(p)=>{
  const {cx,cy,R}=CIR;
  let s=circleBase({path:0});
  const a=seg(p,.05,.4),b=seg(p,.45,.95);
  let x,y,v,f;
  if(b<=0){x=mix(90,cx,a);y=cy+R;v=[1,0];f=[0,-1];s+=draw([[90,cy+R],[x,y]],1,{color:POS,w:3,opacity:.6});}
  else{const phi=-Math.PI/2+b*Math.PI*.55;({x,y,v,f}=onCircle(phi));s+=draw([[90,cy+R],[cx,cy+R]],1,{color:POS,w:3,opacity:.6})+draw(circPts(cx,cy,R,-Math.PI/2,phi,40),1,{color:POS,w:3,opacity:.6});}
  s+=vfAt(x,y,v,f,{labels:1});
  s+=card(760,110,400,280,label('𝐁：奥向き（⊗）',960,170,{size:28,color:CB,anchor:'middle'})+label('正の電荷が 右へ',960,225,{size:28,color:CV,anchor:'middle'})
   +fade(seg(p,.35,.5),label('𝐅：上 → 上へ曲がる',960,310,{size:30,color:CF,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'perp']:(p)=>{
  let s=circleBase();
  const angs=[-90,-30,30,90,150,210];
  angs.forEach((d,i)=>{const {x,y,v,f}=onCircle(d*RAD);s+=vfAt(x,y,v,f,{g:seg(p,.05+i*.1,.15+i*.1),lv:80,lf:60,labels:i===0});});
  s+=card(760,140,400,220,label('どの点でも',960,210,{size:30,color:C.ink,anchor:'middle'})+label('𝐯 と 𝐅 は 直角',960,275,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75));
  return s;
 },
 [K+'recallDot']:(p)=>{
  const gy=380;
  let s=line(80,gy,640,gy,{color:C.dim,w:3});
  const bx=mix(200,380,seg(p,.1,.6));
  s+=rect(bx-50,gy-80,100,80,{fill:'#8795ad',fo:.3,stroke:C.dim,rx:6});
  s+=arrow(bx,gy-40,bx,gy-200,{color:CF,w:6})+vl('F',bx+14,gy-190,{color:CF});
  s+=arrow(bx+70,gy-40,bx+200,gy-40,{color:CD,w:5})+label('動く向き',bx+140,gy-60,{size:24,color:CD,anchor:'middle'});
  s+=fade(seg(p,.3,.45),[-30,0,30].map(d=>line(bx+d,80,bx+d,gy-210,{color:C.hi,w:2,dash:'6 8'})).join('')+label('真上から 光',bx,66,{size:24,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),dot(bx,gy,8,C.hi)+label('影は 点',bx,gy+42,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=card(760,140,400,230,label('力が 動く向きと 直角',960,205,{size:28,color:C.ink,anchor:'middle'})+label('→ 仕事 0',960,270,{size:34,color:C.hi,anchor:'middle',weight:700})+label('（内積の回）',960,325,{size:24,color:C.dim,anchor:'middle'}),seg(p,.55,.7));
  return s;
 },
 [K+'work0']:(p)=>{
  const x=260,y=330;
  let s=intoField(80,70,640,470,{g:.6});
  s+=arrow(x,y,x+250,y,{color:CV,w:6})+vl('v',x+260,y+10,{color:CV});
  s+=fade(seg(p,.1,.3),arrow(x,y+60,x+130,y+60,{color:CD,w:5})+T(`${cs(CV,'\\mathbf{v}')}\\,\\Delta t`,x+70,y+100,{size:30,color:CD}));
  s+=arrow(x,y,x,y-180,{color:CF,w:6})+vl('F',x+14,y-168,{color:CF})+rightMark(x,y,[1,0],[0,-1],18)+charge(x,y,1,16);
  s+=card(700,120,460,280,label('短い時間 Δt の 仕事',930,180,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.45,.6),T(`${vF}\\cdot${vV}\\,\\Delta t=0`,930,265,{size:46}))
   +fade(seg(p,.65,.8),label('どの瞬間も 0',930,350,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'power']:(p)=>{
  let s=circleBase();
  const phi=-Math.PI/2+2*Math.PI*seg(p,.1,.95),{x,y,v,f}=onCircle(phi);
  s+=vfAt(x,y,v,f,{labels:1});
  // gauge for F·v
  const gx=960,gy=360,gr=120;
  let gs=draw(circPts(gx,gy,gr,Math.PI,0,60),1,{color:C.dim,w:4})+label('−',gx-gr-4,gy+30,{size:28,color:C.dim,anchor:'middle'})+label('＋',gx+gr+4,gy+30,{size:28,color:C.dim,anchor:'middle'})+label('0',gx,gy-gr-14,{size:26,color:C.hi,anchor:'middle',weight:700});
  gs+=line(gx,gy,gx,gy-gr+16,{color:C.hi,w:6})+dot(gx,gy,9,C.hi)+T(`${vF}\\cdot${vV}`,gx,gy+50,{size:36});
  s+=card(760,70,400,420,T(`P=${vF}\\cdot${vV}=0`,960,125,{size:40})+label('仕事率（1秒あたりの仕事）',960,185,{size:22,color:C.dim,anchor:'middle'})+gs,seg(p,0,.15));
  return s;
 },
 [K+'speed']:(p)=>{
  let s=circleBase();
  const phi=-Math.PI/2+2*Math.PI*seg(p,0,1)+2*Math.PI*.95,{x,y,v,f}=onCircle(phi);
  s+=vfAt(x,y,v,f,{labels:1});
  s+=card(760,90,400,340,label('仕事 0',960,150,{size:30,color:C.ink,anchor:'middle'})
   +fade(seg(p,.1,.25),label('↓',960,195,{size:28,color:C.dim,anchor:'middle'})+T(`\\tfrac12 m v^2`,900,245,{size:38,color:C.E})+label('変わらない',1000,255,{size:26,color:C.E}))
   +fade(seg(p,.55,.7),label('↓',960,305,{size:28,color:C.dim,anchor:'middle'})+label('速さは 一定',960,370,{size:34,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'const']:(p)=>{
  let s=circleBase();
  [-90,-30,30,90,150,210].forEach(d=>{const {x,y,v,f}=onCircle(d*RAD);s+=vfAt(x,y,v,f,{lv:70,lf:70});});
  s+=card(760,110,400,300,label('速さ v：一定',960,175,{size:30,color:CV,anchor:'middle',weight:700})
   +fade(seg(p,.15,.3),label('力の大きさ',960,245,{size:28,color:C.ink,anchor:'middle'})+T(`q\\,v\\,B`,960,300,{size:40,color:CF})+label('も 一定',960,360,{size:28,color:C.ink,anchor:'middle'})),seg(p,0,.12));
  s+=fade(seg(p,.6,.75),label('いつも直角・同じ大きさ',960,460,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'circle']:(p)=>{
  // left: ball on a string (内積の回)
  const lx=190,ly=260,R=110,ph=2*Math.PI*p;
  let s=label('ひもで 回す 球',lx,90,{size:26,color:C.dim,anchor:'middle'})+draw(circPts(lx,ly,R,0,2*Math.PI,60),1,{color:C.dim,w:2,dash:'6 8'})+dot(lx,ly,6,C.ink);
  const bx=lx+R*Math.cos(ph),by=ly-R*Math.sin(ph);
  s+=line(lx,ly,bx,by,{color:C.dim,w:2})+arrow(bx,by,bx+(lx-bx)*.5,by+(ly-by)*.5,{color:CF,w:5,head:14})+dot(bx,by,13,C.ink);
  // middle: the charge in B ⊗
  const mx=520,my=260;
  s+=intoField(400,110,640,410,{step:80});
  s+=label('磁場の中の 正電荷',mx,90,{size:26,color:C.dim,anchor:'middle'})+draw(circPts(mx,my,R,0,2*Math.PI,60),1,{color:C.dim,w:2,dash:'6 8'})+dot(mx,my,6,C.ink);
  const o=onCircle(ph,{cx:mx,cy:my,R});s+=vfAt(o.x,o.y,o.v,o.f,{lv:60,lf:55});
  s+=card(760,110,400,300,label('中心向きの 力 → 円',960,170,{size:28,color:CF,anchor:'middle',weight:700})
   +fade(seg(p,.4,.55),label('向心加速度',960,240,{size:28,color:C.a,anchor:'middle'})+T(`a=\\dfrac{v^2}{r}`,960,315,{size:44,color:C.a})),seg(p,.05,.2));
  return s;
 },
 [K+'electron']:(p)=>{
  const ex=120,ey=262,R=105,cx=ex+180;
  let s=intoField(80,70,680,470,{g:1});
  const a=seg(p,.05,.3),b=seg(p,.3,.95);
  s+=draw([[ex,ey],[mix(ex,cx,a),ey]],1,{color:C.dim,w:3});
  if(b>0){
   const phP=-Math.PI/2+b*2*Math.PI,phN=Math.PI/2-b*2*Math.PI;
   s+=draw(circPts(cx,ey-R,R,-Math.PI/2,phP,60),1,{color:POS,w:3});
   s+=draw(circPts(cx,ey+R,R,Math.PI/2,phN,60),1,{color:NEG,w:3});
   const P=onCircle(phP,{cx,cy:ey-R,R}),N=onCircle(phN,{cx,cy:ey+R,R,sign:-1});
   s+=vfAt(P.x,P.y,P.v,P.f,{lv:60,lf:50})+vfAt(N.x,N.y,N.v,N.f,{lv:60,lf:50,sign:-1});
  }else s+=charge(mix(ex,cx,a),ey,1,13);
  s+=card(760,90,400,340,label('正の電荷',960,150,{size:30,color:POS,anchor:'middle',weight:700})+label('反時計回り',960,200,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.45,.6),label('電子',960,280,{size:30,color:NEG,anchor:'middle',weight:700})+label('力が 逆 → 時計回り',960,330,{size:28,color:C.ink,anchor:'middle'}))
   +label('同じ 𝐁（奥向き）',960,400,{size:24,color:CB,anchor:'middle'}),seg(p,0,.12));
  return s;
 },
 [K+'radius']:(p)=>{
  const {cx,cy,R}=CIR;
  let s=circleBase();
  s+=line(cx,cy,cx+R*Math.cos(.6),cy-R*Math.sin(.6),{color:C.hi,w:3})+dot(cx,cy,6,C.hi)+label('r ＝ ？',cx+30,cy+40,{size:28,color:C.hi,weight:700});
  s+=card(760,130,400,250,label('円の大きさ（半径）',960,195,{size:28,color:C.ink,anchor:'middle'})+label('q，v，B，質量 m から',960,255,{size:28,color:C.ink,anchor:'middle'})+label('→ 中級で',960,325,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2));
  return s;
 },
 [K+'notzero']:(p)=>{
  let s=circleBase();
  const phi=-Math.PI/2+2*Math.PI*p,{x,y,v,f}=onCircle(phi);
  s+=vfAt(x,y,v,f,{labels:1});
  s+=card(760,100,400,320,label('✗ 力が ない',960,170,{size:32,color:C.a,anchor:'middle',weight:700})
   +fade(seg(p,.3,.45),label('○ 力は 働き続け',960,250,{size:30,color:CF,anchor:'middle',weight:700})+label('向きだけを 変える',960,305,{size:30,color:CF,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 // ===== S5 まとめ =====
 [K+'sum1']:(p)=>sumRows(1,p),
 [K+'sum2']:(p)=>sumRows(2,p),
 [K+'sum3']:(p)=>sumRows(3,p),
 [K+'next']:(p)=>{
  const x=260;
  let s=rect(x-8,70,16,400,{fill:'#8795ad',fo:.4,stroke:C.dim,rx:4});
  s+=arrow(x+40,400,x+40,160,{color:CI,w:6})+label('電流 I',x+56,180,{size:28,color:CI,weight:700});
  [[x-150,200],[x+150,300],[x-150,380],[x+150,120]].forEach(([cx,cy],i)=>{s+=fade(seg(p,.2+i*.1,.3+i*.1),ring(cx,cy,32,{color:C.faint,w:2,fill:'#10182c'})+label('？',cx,cy+12,{size:34,color:CB,anchor:'middle',weight:700}));});
  s+=card(640,110,520,280,label('次の問い',900,165,{size:26,color:C.dim,anchor:'middle'})+label('その磁場は どこから？',900,235,{size:32,color:C.ink,anchor:'middle'})+label('電流のまわりには',900,300,{size:30,color:C.hi,anchor:'middle',weight:700})+label('どんな磁場が できる？',900,350,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.3),C.hi);
  return s;
 },
};

// YouTube シリーズ「ガウスの法則・初級 2/2」(ys-ui-closed-bag-2) — 図。Stage 1200×515.
// 色：電場・電気力線 水色、外向き法線 桃、+1・正の合計 黄、−1・負の合計 赤、正電荷 赤、負電荷 青（1/2 と共通）。
// 袋は断面（2D）で描く。貫く点と符号は、多角形と線の交点から計算する（外向き法線との内積の符号）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,poly} from './anim.mjs';
import {EC,NC,HI,NEGV,cs,card,T,charge,blobPts,toS,closedPath,boxScene,boxNormals,VAL3,P3} from './yt1-ui-closed-bag-1-diagrams.mjs';

const K='ui-closed-bag-2:';
const rad=d=>d*Math.PI/180;

// ---- shapes (math coords, y up) ----------------------------------------------------------------
function area2(P){let a=0;for(let i=0;i<P.length;i++){const [x1,y1]=P[i],[x2,y2]=P[(i+1)%P.length];a+=x1*y2-x2*y1;}return a;}
const ccw=P=>area2(P)>0?P:[...P].reverse();
const circlePts=(R,n=96)=>Array.from({length:n},(_,i)=>{const t=2*Math.PI*i/n;return [R*Math.cos(t),R*Math.sin(t)];});
const SQUARE=ccw([[-140,-125],[-40,-150],[150,-130],[165,20],[130,150],[-30,135],[-165,120],[-150,0]]);
const HOOK=ccw([[5,-72],[45,-55],[65,-15],[62,35],[90,45],[115,35],[122,3],[118,-30],[135,-45],[160,-40],[186,4],[175,50],[140,85],[90,90],[50,80],[-5,72],[-50,50],[-72,5],[-50,-50]].map(([x,y])=>[x*1.3,y*1.3]));

// intersections of the ray o + s·u (0<s<L) with polygon P; sign = sign(u·outward normal)
function crossings(P,[ox,oy],[ux,uy],L){
 const out=[];
 for(let i=0;i<P.length;i++){const [ax,ay]=P[i],[bx,by]=P[(i+1)%P.length],dx=bx-ax,dy=by-ay;
  const den=ux*dy-uy*dx;if(Math.abs(den)<1e-9)continue;
  const s=((ax-ox)*dy-(ay-oy)*dx)/den,t=((ax-ox)*uy-(ay-oy)*ux)/den;
  if(s>1e-6&&s<L&&t>=0&&t<1){const nx=dy,ny=-dx,nl=Math.hypot(nx,ny);out.push({s,x:ox+s*ux,y:oy+s*uy,sign:Math.sign(ux*nx+uy*ny),n:[nx/nl,ny/nl]});}
 }
 return out.sort((a,b)=>a.s-b.s);
}
// field lines from a point charge at q=(qx,qy) (math coords), drawn on screen around (cx,cy)
function fieldLines(cx,cy,[qx,qy],sign,{n=8,rot=rad(22.5),L=260,g=1,r0=30,heads=[.45,.85],hl=-1}={}){
 const S=toS(cx,cy);let s='';
 for(let i=0;i<n;i++){const a=rot+2*Math.PI*i/n,u=[Math.cos(a),Math.sin(a)];
  const p0=[qx+r0*u[0],qy+r0*u[1]],p1=[qx+L*u[0],qy+L*u[1]];const [x0,y0]=S(p0),[x1,y1]=S(p1);
  const col=i===hl?HI:EC;
  s+=line(x0,y0,x1,y1,{color:col,w:i===hl?4:3,opacity:.9});
  for(const f of heads){const m=r0+(L-r0)*f,a1=sign>0?m-18:m+18,a2=sign>0?m+18:m-18;const [hx,hy]=S([qx+a1*u[0],qy+a1*u[1]]),[HX,HY]=S([qx+a2*u[0],qy+a2*u[1]]);s+=arrow(hx,hy,HX,HY,{color:col,w:i===hl?4:3,head:14});}
 }
 return fade(g,s);
}
// crossing markers for all lines of a charge
function marks(cx,cy,P,[qx,qy],sign,{n=8,rot=rad(22.5),L=260,g=1,labels=true,normals=true,only=null,above=false}={}){
 const S=toS(cx,cy);let s='',tot=0;
 for(let i=0;i<n;i++){if(only!==null&&!only.includes(i))continue;const a=rot+2*Math.PI*i/n,u=[Math.cos(a),Math.sin(a)];
  for(const c of crossings(P,[qx,qy],u,L)){const v=c.sign*sign;tot+=v;const [X,Y]=S([c.x,c.y]);
   if(normals)s+=arrow(X,Y,X+c.n[0]*42,Y-c.n[1]*42,{color:NC,w:3,head:10});
   s+=dot(X,Y,7,v>0?HI:NEGV);
   if(labels){const lx=above?X:X+c.n[0]*62,ly=above?Y-(c.sign>0?26:-44):Y-c.n[1]*62+8;s+=label(v>0?'+1':'−1',lx,ly,{size:24,color:v>0?HI:NEGV,anchor:'middle',weight:700});}
  }}
 return {svg:fade(g,s),tot};
}
const bag=(P,cx,cy,o={})=>closedPath(P,cx,cy,{w:4,...o});
function sumCard(x,y,txt,val,{g=1,color=HI,w=380,h=190}={}){return card(x,y,w,h,label(txt,x+w/2,y+55,{size:28,color:C.ink,anchor:'middle'})+label(val,x+w/2,y+135,{size:52,color,anchor:'middle',weight:700}),g,color);}
// field arrows (not lines) around a point charge, for the first scenes
function radialArrows(cx,cy,sign,{g=1,R=[95,175],n=8,rot=rad(22.5)}={}){
 let s='';for(const r of R)for(let i=0;i<n;i++){const a=rot+2*Math.PI*i/n,ux=Math.cos(a),uy=-Math.sin(a),L=r<120?46:30;
  const x=cx+r*ux,y=cy+r*uy;s+=dot(x,y,3,C.dim)+(sign>0?arrow(x,y,x+L*ux,y+L*uy,{color:EC,w:4,head:12}):arrow(x+L*ux,y+L*uy,x,y,{color:EC,w:4,head:12}));}
 return fade(g,s);
}
const CIR=circlePts(135);

export const ytUiClosedBag2Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=card(80,110,500,300,label('電気束',330,165,{size:30,color:HI,anchor:'middle',weight:700})+T(`\\Phi=${cs(HI,'E_{\\perp}')}\\,A`,330,260,{size:52})+label('法線方向の成分 × 面積',330,345,{size:26,color:C.dim,anchor:'middle'}),seg(p,.02,.15));
  s+=card(620,110,500,300,label('閉じた面',870,165,{size:30,color:C.ink,anchor:'middle',weight:700})+label('法線は 外向き',870,230,{size:30,color:NC,anchor:'middle'})
   +label('出る ＝ 正',870,295,{size:30,color:HI,anchor:'middle',weight:700})+label('入る ＝ 負',870,350,{size:30,color:NEGV,anchor:'middle',weight:700}),seg(p,.4,.55));
  return s;
 },
 [K+'recap2']:(p)=>{
  let s=boxScene({inside:1})+boxNormals(['left','right','top','bottom','front','back'],{vals:VAL3});
  s+=card(760,140,400,230,label('合計 0',960,205,{size:36,color:HI,anchor:'middle',weight:700})+fade(seg(p,.5,.65),label('でも 中の電場は',960,265,{size:28,color:C.ink,anchor:'middle'})+label('3 N/C のまま',960,320,{size:32,color:EC,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'question']:(p)=>{
  let s=bag(blobPts(135),330,270)+fade(seg(p,.05,.2),charge(330,270,1,26))+fade(seg(p,.1,.25),label('？',430,190,{size:56,color:HI,weight:700}));
  s+=card(660,110,500,270,label('今回の問い',910,165,{size:26,color:C.dim,anchor:'middle'})+label('袋の中に 電荷を入れると',910,225,{size:30,color:C.ink,anchor:'middle'})
   +label('合計は どう変わる？',910,280,{size:32,color:HI,anchor:'middle',weight:700})+label('何を 教えてくれる？',910,335,{size:32,color:HI,anchor:'middle',weight:700}),seg(p,.2,.4),HI);
  return s;
 },
 // ===== S2 正の電荷と負の電荷 =====
 [K+'pos']:(p)=>{
  let s=bag(CIR,330,270,{fo:.04})+charge(330,270,1,26)+radialArrows(330,270,1,{g:seg(p,.3,.55)});
  s+=card(720,140,440,200,label('正の電荷のまわり',940,205,{size:28,color:C.ink,anchor:'middle'})+label('電場は 外向き',940,270,{size:36,color:EC,anchor:'middle',weight:700}),seg(p,.5,.65),EC);
  return s;
 },
 [K+'section']:(p)=>{
  let s=bag(CIR,330,270,{fo:.04})+charge(330,270,1,26)+radialArrows(330,270,1,{R:[95]});
  // arrows crossing the surface, highlighted at the bag
  const S=toS(330,270);let x='';
  for(let i=0;i<8;i++){const a=rad(22.5)+i*Math.PI/4,u=[Math.cos(a),Math.sin(a)];const [X0,Y0]=S([105*u[0],105*u[1]]),[X1,Y1]=S([175*u[0],175*u[1]]);x+=arrow(X0,Y0,X1,Y1,{color:EC,w:5,head:15});const [bx,by]=S([135*u[0],135*u[1]]);x+=dot(bx,by,6,HI);}
  s+=fade(seg(p,.35,.55),x);
  s+=fade(seg(p,.05,.2),label('真ん中で 切った 断面',60,70,{size:24,color:C.dim}));
  s+=card(720,140,440,200,label('袋の どこでも',940,205,{size:28,color:C.ink,anchor:'middle'})+label('内 → 外 へ 貫く',940,270,{size:34,color:EC,anchor:'middle',weight:700}),seg(p,.5,.65),EC);
  return s;
 },
 [K+'allpos']:(p)=>{
  let s=bag(CIR,330,270,{fo:.04})+charge(330,270,1,26);
  const S=toS(330,270);
  for(let i=0;i<8;i++){const a=rad(22.5)+i*Math.PI/4,u=[Math.cos(a),Math.sin(a)];const [X0,Y0]=S([105*u[0],105*u[1]]),[X1,Y1]=S([175*u[0],175*u[1]]);s+=arrow(X0,Y0,X1,Y1,{color:EC,w:5,head:15});
   const [lx,ly]=S([205*u[0],205*u[1]]);s+=fade(seg(p,.1+i*.04,.2+i*.04),label('＋',lx,ly+10,{size:30,color:HI,anchor:'middle',weight:700}));}
  s+=sumCard(740,150,'合計','正',{g:seg(p,.55,.7)});
  return s;
 },
 [K+'neg']:(p)=>{
  let s=bag(CIR,330,270,{fo:.04})+charge(330,270,-1,26);
  const S=toS(330,270);
  for(let i=0;i<8;i++){const a=rad(22.5)+i*Math.PI/4,u=[Math.cos(a),Math.sin(a)];const [X0,Y0]=S([175*u[0],175*u[1]]),[X1,Y1]=S([105*u[0],105*u[1]]);s+=fade(seg(p,.1,.3),arrow(X0,Y0,X1,Y1,{color:EC,w:5,head:15}));
   const [lx,ly]=S([205*u[0],205*u[1]]);s+=fade(seg(p,.55+i*.03,.65+i*.03),label('−',lx,ly+10,{size:34,color:NEGV,anchor:'middle',weight:700}));}
  s+=card(720,140,440,200,label('負の電荷のまわり',940,205,{size:28,color:C.ink,anchor:'middle'})+label('電場は 内向き',940,270,{size:36,color:EC,anchor:'middle',weight:700}),seg(p,.2,.35),EC);
  return s;
 },
 [K+'negsum']:(p)=>{
  let s=bag(CIR,330,270,{fo:.04})+charge(330,270,-1,26);
  const S=toS(330,270);
  for(let i=0;i<8;i++){const a=rad(22.5)+i*Math.PI/4,u=[Math.cos(a),Math.sin(a)];const [X0,Y0]=S([175*u[0],175*u[1]]),[X1,Y1]=S([105*u[0],105*u[1]]);s+=arrow(X0,Y0,X1,Y1,{color:EC,w:5,head:15});
   const [lx,ly]=S([205*u[0],205*u[1]]);s+=label('−',lx,ly+10,{size:34,color:NEGV,anchor:'middle',weight:700});}
  s+=sumCard(740,110,'合計','負',{color:NEGV});
  s+=fade(seg(p,.45,.6),label('中の電荷の符号 と 一致',930,370,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'double']:(p)=>{
  const k=1+seg(p,.1,.4);
  let s=bag(CIR,330,270,{fo:.04})+charge(330,270,1,26)+fade(seg(p,.1,.3),label('× 2',372,238,{size:28,color:HI,weight:700}));
  const S=toS(330,270);
  for(let i=0;i<8;i++){const a=rad(22.5)+i*Math.PI/4,u=[Math.cos(a),Math.sin(a)];const [X0,Y0]=S([118*u[0],118*u[1]]),[X1,Y1]=S([(118+34*k)*u[0],(118+34*k)*u[1]]);s+=arrow(X0,Y0,X1,Y1,{color:EC,w:5,head:15});}
  s+=card(720,120,440,260,label('電荷 2倍',940,180,{size:30,color:C.ink,anchor:'middle',weight:700})+label('→ どの場所でも 電場 2倍',940,240,{size:28,color:EC,anchor:'middle'})
   +fade(seg(p,.55,.7),label('力は 電荷に比例',940,305,{size:26,color:C.dim,anchor:'middle'})+label('（実験で分かっている）',940,345,{size:24,color:C.dim,anchor:'middle'})),seg(p,.05,.2));
  return s;
 },
 [K+'doublesum']:(p)=>{
  let s=bag(CIR,330,270,{fo:.04})+charge(330,270,1,26)+label('× 2',372,238,{size:28,color:HI,weight:700});
  const S=toS(330,270);
  for(let i=0;i<8;i++){const a=rad(22.5)+i*Math.PI/4,u=[Math.cos(a),Math.sin(a)];const [X0,Y0]=S([118*u[0],118*u[1]]),[X1,Y1]=S([186*u[0],186*u[1]]);s+=arrow(X0,Y0,X1,Y1,{color:EC,w:5,head:15});}
  s+=card(720,120,440,280,label('どの部分の電気束も 2倍',940,180,{size:28,color:C.ink,anchor:'middle'})+label('合計も 2倍',940,240,{size:34,color:HI,anchor:'middle',weight:700})
   +fade(seg(p,.5,.65),T(`\\Phi\\ \\propto\\ Q`,940,320,{size:44,color:HI}))+fade(seg(p,.5,.65),label('Φ：合計　Q：中の電荷',940,375,{size:24,color:C.dim,anchor:'middle'})),seg(p,.05,.2),HI);
  return s;
 },
 // ===== S3 線で数える =====
 [K+'lines']:(p)=>{
  let s=charge(330,270,1,26)+radialArrows(330,270,1,{g:1-seg(p,.3,.6)*.8})+fieldLines(330,270,[0,0],1,{g:seg(p,.3,.6)});
  s+=card(720,140,440,200,label('矢印を つないだ 線',940,205,{size:28,color:C.ink,anchor:'middle'})+label('＝ 電気力線',940,270,{size:36,color:EC,anchor:'middle',weight:700}),seg(p,.5,.65),EC);
  return s;
 },
 [K+'convention']:(p)=>{
  let s=charge(330,270,1,26)+fieldLines(330,270,[0,0],1);
  const S=toS(330,270);for(let i=0;i<8;i++){const a=rad(22.5)+i*Math.PI/4;const [x,y]=S([232*Math.cos(a),232*Math.sin(a)]);s+=fade(seg(p,.45+i*.04,.55+i*.04),label(String(i+1),x,y+9,{size:24,color:HI,anchor:'middle',weight:700}));}
  s+=card(720,140,440,220,label('本数 ∝ 電荷の量',940,205,{size:30,color:C.ink,anchor:'middle',weight:700})+label('（描き方の 約束）',940,255,{size:24,color:C.dim,anchor:'middle'})+fade(seg(p,.5,.7),label('この電荷から 8本',940,320,{size:32,color:HI,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'caution']:(p)=>{
  let s=charge(330,270,1,26)+fieldLines(330,270,[0,0],1,{g:.6});
  s+=card(660,110,500,300,label('線の本数 ＝ 数えるための 絵',910,170,{size:28,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.4,.55),label('電気束の 定義は',910,245,{size:26,color:C.dim,anchor:'middle'})+T(`\\Phi=${cs(HI,'E_{\\perp}')}\\,A`,910,320,{size:48})),seg(p,.05,.2));
  return s;
 },
 [K+'count']:(p)=>{
  const P=ccw(CIR);let s=bag(P,330,270)+fieldLines(330,270,[0,0],1,{L:250})+charge(330,270,1,26);
  const m=marks(330,270,P,[0,0],1,{L:250,g:seg(p,.3,.55)});s+=m.svg;
  s+=card(740,110,420,150,label('外へ 突き抜ける → +1',950,165,{size:28,color:HI,anchor:'middle',weight:700})+label('中へ 突き抜ける → −1',950,215,{size:28,color:NEGV,anchor:'middle',weight:700}),seg(p,.02,.15));
  s+=sumCard(760,290,'丸い袋',`+${m.tot}`,{g:seg(p,.6,.75),w:380,h:170});
  return s;
 },
 [K+'square']:(p)=>{
  let s=bag(SQUARE,330,270)+fieldLines(330,270,[0,0],1,{L:250})+charge(330,270,1,26);
  const m=marks(330,270,SQUARE,[0,0],1,{L:250,g:seg(p,.35,.6)});s+=m.svg;
  s+=card(740,110,420,150,label('電荷のない所で',950,165,{size:26,color:C.ink,anchor:'middle'})+label('線は 途切れない',950,215,{size:30,color:EC,anchor:'middle',weight:700}),seg(p,.2,.35));
  s+=sumCard(760,290,'角ばった袋',`+${m.tot}`,{g:seg(p,.65,.8),w:380,h:170});
  return s;
 },
 [K+'wavy']:(p)=>{
  const rot=rad(3),hl=0;
  let s=bag(HOOK,300,285)+fieldLines(300,285,[0,0],1,{L:280,rot,hl,heads:[.3,.62,.9]})+charge(300,285,1,24);
  const one=marks(300,285,HOOK,[0,0],1,{L:280,rot,only:[0],normals:false,above:true,g:seg(p,.3,.5)});
  const rest=marks(300,285,HOOK,[0,0],1,{L:280,rot,only:[1,2,3,4,5,6,7],labels:false,normals:false,g:seg(p,.3,.5)});
  s+=one.svg+rest.svg;
  s+=card(740,100,420,190,label('黄色の線',950,150,{size:26,color:HI,anchor:'middle'})+label('出る・入る・出る',950,200,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.55,.7),label('+1 − 1 + 1 ＝ +1',950,255,{size:32,color:HI,anchor:'middle',weight:700})),seg(p,.15,.3),HI);
  s+=sumCard(760,320,'くねった袋 全体',`+${one.tot+rest.tot}`,{g:seg(p,.75,.88),w:380,h:160});
  return s;
 },
 [K+'bigfact']:(p)=>{
  const cx=260,cy=300,a1=rad(28),a2=rad(-28),r=110;let s=charge(cx,cy,1,24);
  const P=(a,d)=>[cx+d*Math.cos(a),cy-d*Math.sin(a)];
  {const [x0,y0]=P(a1,r),[x1,y1]=P(a1,r+120);s+=fade(seg(p,.1,.3),line(cx,cy,x0,y0,{color:C.dim,w:2,dash:'5 6'})+dot(x0,y0,6,C.dim)+arrow(x0,y0,x1,y1,{color:EC,w:6,head:18})+label('距離 r',(cx+x0)/2-10,(cy+y0)/2-16,{size:24,color:C.dim,anchor:'middle'})+label('E',x1+14,y1+6,{size:28,color:EC,weight:700}));}
  {const [x0,y0]=P(a2,2*r),[x1,y1]=P(a2,2*r+30);s+=fade(seg(p,.35,.55),line(cx,cy,x0,y0,{color:C.dim,w:2,dash:'5 6'})+dot(x0,y0,6,C.dim)+arrow(x0,y0,x1,y1,{color:EC,w:6,head:14})+label('距離 2r',(cx+x0)/2,(cy+y0)/2+40,{size:24,color:C.dim,anchor:'middle'})+label('E/4',x1+12,y1+12,{size:28,color:EC,weight:700}));}
  s+=card(700,120,460,250,label('点電荷の電場',930,180,{size:28,color:C.ink,anchor:'middle'})+T(`E\\ \\propto\\ \\dfrac{1}{r^2}`,930,265,{size:48,color:EC})
   +fade(seg(p,.6,.75),label('実験で 分かっている',930,340,{size:26,color:HI,anchor:'middle'})),seg(p,.05,.2));
  return s;
 },
 [K+'big']:(p)=>{
  const cx=300,cy=270;let s=bag(circlePts(70),cx,cy,{fo:.05})+fade(seg(p,.05,.25),bag(circlePts(140),cx,cy,{fo:.03,dash:'10 8'}))+charge(cx,cy,1,18);
  s+=label('r',cx+35,cy-8,{size:22,color:C.dim,anchor:'middle'})+fade(seg(p,.05,.25),label('2r',cx+105,cy-8,{size:22,color:C.dim,anchor:'middle'}));
  s+=card(640,90,520,360,
   label('半径 2倍の 丸い袋',900,145,{size:28,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.15,.3),label('電場 ×1/4',900,205,{size:30,color:EC,anchor:'middle',weight:700}))
   +fade(seg(p,.35,.5),label('表面積 ×4（半径の 2乗に比例）',900,260,{size:28,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.6,.75),T(`\\tfrac{1}{4}\\times 4=1`,900,340,{size:48,color:HI}))
   +fade(seg(p,.7,.85),label('合計は 変わらない',900,410,{size:30,color:HI,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'same']:(p)=>{
  const items=[[150,'丸',ccw(circlePts(85))],[450,'角ばった',ccw(SQUARE.map(([x,y])=>[x*.55,y*.55]))],[750,'くねった',ccw(HOOK.map(([x,y])=>[x*.5,y*.5]))],[1030,'大きい',ccw(circlePts(120))]];
  let s='';items.forEach(([x,t,P],i)=>{s+=fade(seg(p,.05+i*.12,.2+i*.12),bag(P,x,240,{w:3})+charge(x,240,1,14)+label(t,x,420,{size:26,color:C.ink,anchor:'middle'})+label('+8',x,470,{size:34,color:HI,anchor:'middle',weight:700}));});
  s+=fade(seg(p,.65,.8),label('中の電荷が 同じ → 合計は 同じ',600,70,{size:32,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S4 外の電荷と、中の正味 =====
 [K+'outside']:(p)=>{
  const P=ccw(circlePts(120)),q=[-250,-10],n=16,rot=rad(3);
  let s=bag(P,560,270)+fieldLines(560,270,q,1,{n,rot,L:560,r0:26,heads:[.25,.55,.8],g:seg(p,.05,.3)})+charge(560+q[0],270-q[1],1,22);
  s+=fade(seg(p,.1,.25),rect(560+q[0]-95,270-q[1]+38,190,40,{fill:'#0b1122',fo:.92,stroke:C.faint,rx:8})+label('袋の 外の 電荷',560+q[0],270-q[1]+66,{size:24,color:C.ink,anchor:'middle'}));
  s+=card(820,80,340,150,label('どの線も',990,135,{size:26,color:C.ink,anchor:'middle'})+label('入って → 出る',990,190,{size:30,color:EC,anchor:'middle',weight:700}),seg(p,.45,.6));
  return s;
 },
 [K+'cancel']:(p)=>{
  const P=ccw(circlePts(120)),q=[-250,-10],n=16,rot=rad(3);
  let s=bag(P,560,270)+fieldLines(560,270,q,1,{n,rot,L:560,r0:26,heads:[.25,.55,.8]})+charge(560+q[0],270-q[1],1,22);
  const m=marks(560,270,P,q,1,{n,rot,L:560,normals:false,g:seg(p,.1,.35)});s+=m.svg;
  s+=card(820,80,340,150,label('−1 ＋ 1 ＝ 0',990,140,{size:32,color:C.ink,anchor:'middle',weight:700})+label('線 1本ごとに',990,190,{size:24,color:C.dim,anchor:'middle'}),seg(p,.3,.45));
  s+=sumCard(840,290,'合計',String(m.tot===0?'0':m.tot),{g:seg(p,.55,.7),w:300,h:170});
  return s;
 },
 [K+'notzero']:(p)=>{
  const P=ccw(circlePts(120)),q=[-250,-10],n=16,rot=rad(3);
  let s=bag(P,560,270)+fieldLines(560,270,q,1,{n,rot,L:560,r0:26,heads:[.25,.55,.8],g:.45})+charge(560+q[0],270-q[1],1,22);
  // field arrows on the bag surface
  const S=toS(560,270);for(let i=0;i<12;i++){const t=2*Math.PI*i/12,x=120*Math.cos(t),y=120*Math.sin(t),dx=x-q[0],dy=y-q[1],r=Math.hypot(dx,dy),L=26+2600000/(r*r*60);const [X,Y]=S([x,y]);s+=fade(seg(p,.1,.3),dot(X,Y,4,C.dim)+arrow(X,Y,X+L*dx/r,Y-L*dy/r,{color:EC,w:4,head:12}));}
  s+=card(820,80,340,170,label('袋の上の 電場',990,135,{size:26,color:C.ink,anchor:'middle'})+label('0 ではない',990,195,{size:32,color:EC,anchor:'middle',weight:700}),seg(p,.15,.3),EC);
  s+=card(820,280,340,170,label('合計 0 ＝',990,335,{size:26,color:C.ink,anchor:'middle'})+label('入った分だけ 出た',990,395,{size:28,color:HI,anchor:'middle',weight:700}),seg(p,.5,.65),HI);
  return s;
 },
 [K+'two']:(p)=>{
  let s=bag(ccw(circlePts(140)),330,270)+charge(275,270,1,22)+charge(385,270,-1,22);
  s+=fade(seg(p,.1,.3),label('同じ量',330,330,{size:24,color:C.dim,anchor:'middle'}));
  s+=card(660,110,500,270,label('電場 ＝',910,170,{size:28,color:C.ink,anchor:'middle'})+label('正の電荷の電場 ＋ 負の電荷の電場',910,225,{size:26,color:EC,anchor:'middle'})
   +fade(seg(p,.5,.65),label('→ 電気束も それぞれの分を 足す',910,300,{size:28,color:HI,anchor:'middle',weight:700})),seg(p,.2,.35));
  return s;
 },
 [K+'twosum']:(p)=>{
  const P=ccw(circlePts(90));
  let s='';
  s+=card(40,90,330,380,bag(P,205,260,{w:3})+fieldLines(205,260,[0,0],1,{L:140,r0:22,heads:[.7]})+charge(205,260,1,18)+label('正の分',205,135,{size:26,color:C.ink,anchor:'middle'})+label('+8',205,440,{size:40,color:HI,anchor:'middle',weight:700}),seg(p,.02,.15));
  s+=fade(seg(p,.2,.3),label('＋',410,290,{size:48,color:C.ink,anchor:'middle'}));
  s+=card(450,90,330,380,bag(P,615,260,{w:3})+fieldLines(615,260,[0,0],-1,{L:140,r0:22,heads:[.7]})+charge(615,260,-1,18)+label('負の分',615,135,{size:26,color:C.ink,anchor:'middle'})+label('−8',615,440,{size:40,color:NEGV,anchor:'middle',weight:700}),seg(p,.25,.4));
  s+=fade(seg(p,.5,.6),label('＝',820,290,{size:48,color:C.ink,anchor:'middle'}));
  s+=sumCard(860,190,'合計','0',{g:seg(p,.55,.7),w:300,h:180});
  return s;
 },
 [K+'net']:(p)=>{
  let s=card(150,120,900,260,label('合計が 表すのは',600,185,{size:30,color:C.ink,anchor:'middle'})
   +label('中の電荷を 符号をつけて 足した',600,255,{size:32,color:C.ink,anchor:'middle'})+label('正味の 電荷',600,325,{size:42,color:HI,anchor:'middle',weight:700}),seg(p,.05,.25),HI);
  return s;
 },
 // ===== S5 合計が教えること =====
 [K+'law']:(p)=>{
  let s=label('ガウスの法則',600,90,{size:40,color:HI,anchor:'middle',weight:700});
  s+=fade(seg(p,.1,.3),label('閉じた面の 電気束の 合計',330,210,{size:30,color:C.ink,anchor:'middle'})+label('∝',600,215,{size:48,color:HI,anchor:'middle',weight:700})+label('中の 正味の 電荷',870,210,{size:30,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.35,.5),T(`\\Phi`,330,300,{size:50,color:HI})+T(`\\propto`,600,300,{size:50})+T(`Q`,870,300,{size:50,color:C.a}));
  s+=fade(seg(p,.55,.7),label('閉じた面は どんな形でも よい',600,420,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'basis']:(p)=>{
  let s=card(80,110,500,300,label('支えている 実験事実',330,170,{size:28,color:C.ink,anchor:'middle',weight:700})+T(`E\\ \\propto\\ \\dfrac{1}{r^2}`,330,270,{size:52,color:EC})+label('距離の 2乗に 反比例',330,355,{size:26,color:C.dim,anchor:'middle'}),seg(p,.05,.2));
  s+=card(620,110,500,300,label('比例の 係数',870,200,{size:30,color:C.ink,anchor:'middle',weight:700})+label('→ 中級で 扱う',870,270,{size:32,color:HI,anchor:'middle',weight:700}),seg(p,.55,.7));
  return s;
 },
 [K+'nottell']:(p)=>{
  let s=card(80,110,500,300,label('分かる',330,170,{size:32,color:HI,anchor:'middle',weight:700})+label('中の 正味の 電荷',330,245,{size:30,color:C.ink,anchor:'middle'})+label('（符号 と 量）',330,295,{size:26,color:C.dim,anchor:'middle'}),seg(p,.02,.15),HI);
  s+=card(620,110,500,300,label('分からない',870,170,{size:32,color:C.a,anchor:'middle',weight:700})
   +fade(seg(p,.35,.5),label('電荷が 中の どこに あるか',870,245,{size:28,color:C.ink,anchor:'middle'}))+fade(seg(p,.6,.75),label('各点の 電場の 強さ',870,305,{size:28,color:C.ink,anchor:'middle'})),seg(p,.2,.35),C.a);
  return s;
 },
 [K+'offcenter']:(p)=>{
  const P=ccw(circlePts(150)),q0=[0,0],q1=[80,-35],u=seg(p,.05,.3),q=[mix(q0[0],q1[0],u),mix(q0[1],q1[1],u)];
  let s=bag(P,330,270)+fieldLines(330,270,q,1,{L:280,r0:24})+charge(330+q[0],270-q[1],1,22);
  const m=marks(330,270,P,q,1,{L:280,g:seg(p,.6,.75)});s+=m.svg;
  s+=card(720,100,440,190,label('近い面：電場が 強い',940,160,{size:28,color:EC,anchor:'middle'})+label('遠い面：電場が 弱い',940,215,{size:28,color:C.dim,anchor:'middle'}),seg(p,.3,.45));
  s+=sumCard(760,320,'合計',`+${m.tot}`,{g:seg(p,.7,.85),w:360,h:160});
  return s;
 },
 [K+'reread']:(p)=>{
  let s=boxScene({inside:1})+boxNormals(['left','right','top','bottom','front','back'],{vals:VAL3,g:.7});
  const [cx,cy]=P3([1,.707,.707]);s+=highlight(cx-70,cy-75,140,150,1,EC);
  s+=card(760,110,400,300,label('中の電荷 なし',960,170,{size:28,color:C.ink,anchor:'middle'})+label('→ 合計 0',960,230,{size:34,color:HI,anchor:'middle',weight:700})
   +fade(seg(p,.45,.6),label('でも 中の電場は',960,300,{size:26,color:C.ink,anchor:'middle'})+label('0 ではない',960,355,{size:32,color:EC,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=bag(ccw(blobPts(140)),330,270)+charge(270,230,1,22)+charge(390,230,1,22)+charge(330,320,-1,22);
  s+=card(680,110,480,270,label('正 2つ ＋ 同じ大きさの 負 1つ',920,175,{size:26,color:C.ink,anchor:'middle'})+label('合計の 符号は？',920,250,{size:36,color:HI,anchor:'middle',weight:700})+fade(seg(p,.4,.55),label('予想してみよう',920,320,{size:26,color:HI,anchor:'middle'})),seg(p,.05,.2),HI);
  return s;
 },
 [K+'quizans']:(p)=>{
  let s=bag(ccw(blobPts(140)),330,270)+charge(270,230,1,22)+charge(390,230,1,22)+charge(330,320,-1,22);
  s+=card(680,110,480,300,label('線で 数えると',920,165,{size:26,color:C.dim,anchor:'middle'})
   +T(`${cs(HI,'+16')}+(${cs(C.a,'-8')})=${cs(HI,'+8')}`,920,240,{size:44})
   +fade(seg(p,.5,.65),label('合計は 正',920,315,{size:32,color:HI,anchor:'middle',weight:700})+label('＝ 正の電荷 1つ分',920,365,{size:28,color:C.ink,anchor:'middle'})),seg(p,.05,.2),HI);
  return s;
 },
 // ===== S6 次の問い =====
 [K+'summary']:(p)=>{
  let s=label('まとめ',600,70,{size:30,color:C.dim,anchor:'middle'});
  const cell=(x,t,v,col,g,P,sg)=>card(x,110,250,300,bag(P,x+125,230,{w:3})+charge(x+125,230,sg,16)+label(t,x+125,365,{size:24,color:C.ink,anchor:'middle'})+label(v,x+125,150,{size:30,color:col,anchor:'middle',weight:700}),g);
  s+=cell(60,'正を囲む','正',HI,seg(p,.02,.15),ccw(circlePts(70)),1);
  s+=cell(340,'負を囲む','負',C.a,seg(p,.12,.25),ccw(circlePts(70)),-1);
  s+=cell(620,'形を変える','同じ',HI,seg(p,.5,.62),SQUARE.map(([x,y])=>[x*.45,y*.45]),1);
  s+=fade(seg(p,.62,.75),card(900,110,250,300,bag(ccw(circlePts(60)),1025,240,{w:3})+charge(935,175,1,14)+label('外に 電荷',1025,365,{size:24,color:C.ink,anchor:'middle'})+label('変わらない',1025,150,{size:28,color:HI,anchor:'middle',weight:700})));
  s+=fade(seg(p,.3,.45),label('中の 正味の 電荷に 比例',600,470,{size:30,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'summary2']:(p)=>{
  let s=card(150,120,900,260,label('合計が 教えてくれるのは',600,190,{size:30,color:C.ink,anchor:'middle'})
   +label('中にある 電荷の 正味の 符号 と 量',600,270,{size:36,color:HI,anchor:'middle',weight:700})+fade(seg(p,.4,.6),label('だけ',600,335,{size:32,color:C.ink,anchor:'middle',weight:700})),seg(p,.05,.2),HI);
  return s;
 },
 [K+'connect']:(p)=>{
  // left: along a line (work); right: through a closed surface (flux)
  let s=card(80,110,500,300,label('線に 沿って 足す',330,165,{size:28,color:C.ink,anchor:'middle',weight:700})
   +draw([[140,350],[250,300],[360,290],[470,230]],1,{color:C.dim,w:5})+arrow(200,325,250,290,{color:EC,w:4,head:12})+arrow(305,295,355,262,{color:EC,w:4,head:12})+arrow(415,260,470,240,{color:EC,w:4,head:12})
   +label('仕事',330,395,{size:26,color:C.E,anchor:'middle'}),seg(p,.05,.2));
  s+=card(620,110,500,300,label('閉じた面で 足す',870,165,{size:28,color:C.ink,anchor:'middle',weight:700})+bag(ccw(blobPts(75)),870,280,{w:3})+charge(870,280,1,14)+label('電気束',870,395,{size:26,color:HI,anchor:'middle'}),seg(p,.35,.5));
  return s;
 },
 [K+'next']:(p)=>{
  // arrow map → height map
  let s='';const cx=250,cy=280;
  for(let x=90;x<=420;x+=66)for(let y=140;y<=430;y+=58){const dx=x-cx,dy=y-cy,r=Math.hypot(dx,dy);if(r<40)continue;const L=Math.min(40,5200/r);s+=arrow(x,y,x+L*dx/r,y+L*dy/r,{color:EC,w:3,head:10});}
  s=fade(seg(p,.02,.15),s+charge(cx,cy,1,18)+label('電場の 矢印の 地図',cx,100,{size:26,color:EC,anchor:'middle'}));
  s+=fade(seg(p,.25,.4),arrow(480,280,560,280,{color:C.dim,w:5}));
  let h='';[140,105,72,42].forEach((r,i)=>{h+=ring(810,280,r,{color:C.E,w:3-i*.3});});
  h+=label('高さの 地図？',810,100,{size:26,color:C.E,anchor:'middle'})+label('？',810,295,{size:40,color:HI,anchor:'middle',weight:700});
  s+=fade(seg(p,.3,.5),h);
  s+=fade(seg(p,.55,.7),label('電位とは 何か？',810,470,{size:32,color:HI,anchor:'middle',weight:700}));
  return s;
 },
};

// YouTube シリーズ 外積・初級 2/2（ステージ ui-cross-product 本2・本3・本0）— 図。Stage 1200×515.
// 色：𝐀 水色（前回の腕 𝐫）、𝐁 緑（前回の力 𝐅）、高さ B sinθ 黄、θ 橙、面積 黄の塗り、外積の矢印 𝐀×𝐁 桃。ベクトルの名前は太字、長さは細字。
// 3D：A と B の平面を「台」とみなし、見る位置の高さ e を変える正射影。e＝90° が正面（A×B は ⊙）、e＝−90° が裏（⊗）。
// 右の小図（横から見た位置関係）はいつも：平面＝横線、上＝手前（正面の見る人の側）。
import {C,clamp,mix,smooth,seg,fmt,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,tex,texWidth,poly} from './anim.mjs';

const K='ui-cross-product-2:';
const CA=C.x,CB=C.F,CQ=C.hi,CT=C.E,CN=C.p;
const RAD=Math.PI/180;
// ベクトルの名前は太字（tex の \mathbf）。長さ・大きさは細字のまま。
const vl=(s,x,y,{size=30,color=C.ink,anchor='start'}={})=>tex(`\\mathbf{${s}}`,x,y,{size:size+6,color,anchor,auto:false});
const TQ=`{\\color{${CT}}\\theta}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('○',x,y,{size:34,color:C.F,weight:700}));
const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:34,color:C.a,weight:700}));
const AxB=`{\\color{${CA}}\\mathbf{A}}\\times{\\color{${CB}}\\mathbf{B}}`,BxA=`{\\color{${CB}}\\mathbf{B}}\\times{\\color{${CA}}\\mathbf{A}}`;

// ---- ⊙ / ⊗ symbols ----------------------------------------------------------------------------
function outSym(x,y,r=22,color=CN,g=1){return fade(g,ring(x,y,r,{color,w:4,fill:'#1a1030'})+dot(x,y,r*.28,color));}
function inSym(x,y,r=22,color=CN,g=1){const d=r*.62;return fade(g,ring(x,y,r,{color,w:4,fill:'#1a1030'})+line(x-d,y-d,x+d,y+d,{color,w:4})+line(x-d,y+d,x+d,y-d,{color,w:4}));}

// ---- arc with arrowhead; colour first half c1, second half c2 (A→B order) ---------------------
function arc2(pts,{c1=CA,c2=CB,w=5,g=1}={}){
 if(g<=0||pts.length<3)return '';
 const n=pts.length,h=Math.floor(n/2),[x1,y1]=pts[n-2],[x2,y2]=pts[n-1];
 const a=Math.atan2(y2-y1,x2-x1),L=16;
 const head=`<polygon points="${x2+Math.cos(a)*6},${y2+Math.sin(a)*6} ${x2-L*Math.cos(a)+L*.55*Math.sin(a)},${y2-L*Math.sin(a)-L*.55*Math.cos(a)} ${x2-L*Math.cos(a)-L*.55*Math.sin(a)},${y2-L*Math.sin(a)+L*.55*Math.cos(a)}" fill="${c2}"/>`;
 return fade(g,draw(pts.slice(0,h+1),1,{color:c1,w})+draw(pts.slice(h),1,{color:c2,w})+head);
}
const circPts=(cx,cy,r,a0,a1,n=40)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});

// ---- simple wrench (same look as 1/2) -----------------------------------------------------------
function hexagon(cx,cy,r,rot){return Array.from({length:6},(_,i)=>{const a=rot+i*Math.PI/3;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});}
function wrench(cx,cy,L,ang=0,{g=1,flip=0}={}){
 const deg=-ang/RAD;
 let s=`<g transform="rotate(${deg.toFixed(2)} ${cx} ${cy})">`+rect(cx+36,cy-15,L-12,30,{fill:'#2c3854',fo:1,stroke:C.dim,sw:2.5,rx:14})+ring(cx,cy,54,{color:C.dim,w:4,fill:'#2c3854'})+`</g>`;
 s+=poly(hexagon(cx,cy,32,ang),{fill:'#46526e',fo:1,stroke:C.ink,sw:2.5})+ring(cx,cy,13,{color:C.ink,w:2.5,fill:'#1b2338'});
 s+=dot(cx+L*Math.cos(ang),cy-L*Math.sin(ang),8,C.ink);
 return fade(g,s);
}

// ---- 2D parallelogram of A (length 3) and B (length 2) at angle deg ---------------------------
const PO={ox:220,oy:400,u:80};
function para(deg,{ox=PO.ox,oy=PO.oy,u=PO.u,fill=1,sides=1,arrows=1,labels=1,height=0,hlabel='',grid=0,ga=1,gb=1,thetaArc=1,a=3,b=2}={}){
 const th=deg*RAD,Ax=ox+a*u,bx=ox+b*u*Math.cos(th),by=oy-b*u*Math.sin(th),cx=bx+a*u,cy=by;
 let s='';
 if(grid){for(let i=-2;i<=5;i++)s+=line(ox+i*u,oy-3*u,ox+i*u,oy+u*.5,{color:C.grid,w:1.5});for(let j=-0;j<=3;j++)s+=line(ox-2*u,oy-j*u,ox+5.3*u,oy-j*u,{color:C.grid,w:1.5});}
 s+=fade(fill,poly([[ox,oy],[Ax,oy],[cx,cy],[bx,by]],{fill:CQ,fo:.16}));
 s+=fade(sides,line(Ax,oy,cx,cy,{color:CB,w:2.5,dash:'8 6'})+line(bx,by,cx,cy,{color:CA,w:2.5,dash:'8 6'}));
 if(height>0&&Math.abs(Math.sin(th))>.02){
  const fx=bx;
  if(fx<ox||fx>Ax)s+=fade(height,line(Math.min(fx,ox),oy,Math.max(fx,Ax),oy,{color:C.dim,w:2,dash:'4 6'}));
  s+=line(fx,oy,fx,mix(oy,by,height),{color:CQ,w:6});
  const d=fx>=ox?-14:14;s+=fade(height,line(fx+d,oy,fx+d,oy-14,{color:C.dim,w:2})+line(fx+d,oy-14,fx,oy-14,{color:C.dim,w:2}));
  if(hlabel)s+=fade(height,label(hlabel,fx+(Math.cos(th)>=0?14:-14),(oy+by)/2+9,{size:26,color:CQ,weight:700,anchor:Math.cos(th)>=0?'start':'end'}));
 }
 if(arrows){s+=arrow(ox,oy,Ax,oy,{color:CA,w:6,g:ga})+arrow(ox,oy,bx,by,{color:CB,w:6,g:gb});}
 if(labels){s+=fade(ga,vl('A',Ax+12,oy+10,{color:CA}))+fade(gb,vl('B',bx+(Math.cos(th)>.3?10:-34),by-10,{color:CB}));}
 if(thetaArc&&deg>2){const r=44;s+=draw(circPts(ox,oy,r,0,th,24),1,{color:CT,w:3});const m=th/2;s+=label('θ',ox+(r+20)*Math.cos(m)-6,oy-(r+20)*Math.sin(m)+9,{size:24,color:CT,weight:700});}
 return {svg:s,Ax,bx,by,cx,cy};
}

// ---- 3D: plane of A (x) and B (f) seen from elevation e (radians) ------------------------------
function P3(x,f,u,e,{cx=260,cy=330}={}){const ph=28*RAD*Math.abs(Math.cos(e)),X=x*Math.cos(ph)-f*Math.sin(ph),Fp=x*Math.sin(ph)+f*Math.cos(ph);return [cx+X,cy-(Fp*Math.sin(e)+u*Math.cos(e))];}
function depth(x,f,u,e){return -f*Math.cos(e)+u*Math.sin(e);}
function scene3(e,{cx=260,cy=330,A=240,B=160,nlen=150,g=1,nG=1,fill=1,turn=0,screw=0,rise=0,sym=1,nlabel=''}={}){
 const o={cx,cy},Q=(x,f,u)=>P3(x,f,u,e,o);
 const n0=screw>0?40+rise:0,[ox,oy]=Q(0,0,0),[ax,ay]=Q(A,0,0),[bx,by]=Q(0,B,0),[qx,qy]=Q(A,B,0),[n0x,n0y]=Q(0,0,n0),[nx,ny]=Q(0,0,n0+nlen*(screw>0?.7:1));
 const behind=Math.sin(e)<0; // arrow is behind the plane for the viewer
 let plane=fade(fill,poly([[ox,oy],[ax,ay],[qx,qy],[bx,by]],{fill:CQ,fo:.13,stroke:C.faint,sw:2}));
 plane+=arrow(ox,oy,ax,ay,{color:CA,w:6})+arrow(ox,oy,bx,by,{color:CB,w:6,g:Math.abs(by-oy)>4?1:0});
 plane+=vl('A',ax+12,ay+10,{color:CA})+(Math.abs(by-oy)>20?vl('B',by<oy?bx-34:bx-44,by<oy?by+4:by-6,{color:CB}):'');
 // turning arc in the plane (A → B), drawn around the origin
 let arcs='';
 if(turn>0){const pts=Array.from({length:31},(_,i)=>{const a=Math.PI/2*i/30*turn;return Q(70*Math.cos(a),70*Math.sin(a),0);});arcs=arc2(pts);}
 // screw along the normal
 let sc='';
 if(screw>0){
  const ub=-70+rise,ut=40+rise,[sx,sy1]=Q(0,0,ub),[,sy2]=Q(0,0,ut),top=Math.min(sy1,sy2),hgt=Math.abs(sy1-sy2),ry=26*Math.abs(Math.sin(e))+2;
  let t=rect(sx-12,top,24,Math.max(hgt,1),{fill:'#5a6680',fo:1,stroke:C.ink,sw:2,rx:3});
  for(let k=1;k<6;k++){const yy=mix(sy1,sy2,k/6);t+=line(sx-12,yy+4,sx+12,yy-4,{color:C.ink,w:1.5});}
  const [hx,hy]=Q(0,0,ut);t+=`<ellipse cx="${hx}" cy="${hy}" rx="30" ry="${ry.toFixed(1)}" fill="#46526e" stroke="${C.ink}" stroke-width="2.5"/>`;
  sc=fade(screw,t);
 }
 let nv='';
 const L=Math.hypot(nx-n0x,ny-n0y);
 if(L>6)nv=fade(nG,arrow(n0x,n0y,nx,ny,{color:CN,w:7,head:22})+(nlabel?(nlabel==='A×B'?tex(AxB,nx+16,ny+10,{size:36,anchor:'start',auto:false}):label(nlabel,nx+16,ny+10,{size:28,color:CN,weight:700})):''));
 const face=clamp(1-Math.abs(Math.cos(e))/.25);
 const symb=sym?(Math.sin(e)>0?outSym(ox,oy,24,CN,face*nG):inSym(ox,oy,24,CN,face*nG)):'';
 const s=behind?nv+sc+plane+arcs+symb:plane+arcs+sc+nv+symb;
 return fade(g,s);
}
// inset: side view of the plane with the viewer's position (elevation e)
function inset(e,{cx=930,cy=300,R=150,g=1,arrowG=1,both=0,axis=0,title='横から見た 位置'}={}){
 let s=label(title,cx,cy-R-40,{size:24,color:C.dim,anchor:'middle'});
 s+=line(cx-130,cy,cx+130,cy,{color:C.ink,w:5})+label('𝐀 と 𝐁 の平面',cx-20,cy+34,{size:22,color:C.dim,anchor:'end'});
 if(axis)s+=line(cx,cy-110,cx,cy+110,{color:CN,w:3,dash:'8 6'})+label('軸',cx+12,cy-86,{size:24,color:CN});
 if(both){s+=fade(both,arrow(cx,cy,cx,cy-100,{color:CN,w:5})+label('手前',cx+14,cy-76,{size:26,color:CN,weight:700})+arrow(cx,cy,cx,cy+100,{color:CN,w:5})+label('奥',cx+14,cy+84,{size:26,color:CN,weight:700}));}
 else s+=fade(arrowG,arrow(cx,cy,cx,cy-100,{color:CN,w:5}));
 const ex=cx+R*Math.cos(e),ey=cy-R*Math.sin(e);
 s+=line(ex,ey,mix(ex,cx,.8),mix(ey,cy,.8),{color:C.dim,w:2,dash:'4 6'});
 s+=`<ellipse cx="${ex}" cy="${ey}" rx="20" ry="12" fill="#1b2338" stroke="${C.hi}" stroke-width="3"/>`+dot(ex+6*Math.cos(Math.PI+e),ey-6*Math.sin(Math.PI+e),5,C.hi);
 s+=label('見る人',ex+(Math.cos(e)>-.2?28:-28),ey+8,{size:22,color:C.hi,anchor:Math.cos(e)>-.2?'start':'end'});
 return fade(g,s);
}

// ---- area sync (補助線①): parallelogram + area readout + graph -----------------------------------
function syncScene(deg,p,{hl=0}={}){
 const pr=para(deg,{height:1,hlabel:''});
 let s=pr.svg;
 const area=6*Math.sin(deg*RAD);
 s+=label(`θ ＝ ${Math.round(deg)}°`,700,110,{size:30,color:CT,weight:700});
 s+=label(`面積 ＝ ${fmt(area,1)}`,1150,110,{size:32,color:CQ,anchor:'end',weight:700});
 const A=axes({x:720,y:450,w:400,h:230,xmax:180,ymax:6.8,xticks:[0,90,180],yticks:[3,6],grid:true,xlabel:'θ',ylabel:'面積',xcolor:CT,ycolor:CQ});
 s+=A.svg+A.plot(t=>6*Math.sin(t*RAD),{from:0,to:180,color:CQ,w:3});
 s+=dot(A.X(deg),A.Y(area),10,C.hi);
 if(hl)s+=highlight(706,160,448,320,hl);
 return s;
}

export const ytUiCrossProduct2Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=wrench(150,330,310,0);
  s+=arrow(460,330,460,178,{color:CQ,w:6})+arrow(460,330,574,178,{color:CB,w:5,opacity:.4})+label('F sinθ',446,256,{size:26,color:CQ,anchor:'end',weight:700});
  s+=line(150,392,460,392,{color:CA,w:4})+label('r',305,428,{size:30,color:CA,anchor:'middle',weight:700});
  s+=draw(circPts(150,330,100,.25,1.3),1,{color:CN,w:4});
  s+=card(700,120,460,230,label('トルク（回す効き目）',930,180,{size:28,color:CN,anchor:'middle'})
   +tex(`{\\color{${CN}}N}={\\color{${CA}}r}\\,{\\color{${CQ}}F\\sin\\theta}`,930,270,{size:54,auto:false}),seg(p,.2,.35));
  return s;
 },
 [K+'recap2']:(p)=>{
  const pr=para(50,{fill:0,sides:0});
  let s=pr.svg;
  s+=card(680,110,480,260,tex(`A\\,B\\sin${TQ}`,920,200,{size:60,auto:false,color:CQ})
   +fade(seg(p,.5,.65),label('＝ 外積の大きさ',920,300,{size:34,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2),CQ);
  return s;
 },
 [K+'ask']:(p)=>{
  const pr=para(50,{fill:0,sides:0});
  let s=pr.svg;
  s+=card(680,70,480,160,label('① AB sinθ は',920,130,{size:28,color:CQ,anchor:'middle'})+label('図の上で 何に見える？',920,190,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  s+=card(680,270,480,160,label('② 外積には',920,330,{size:28,color:CN,anchor:'middle'})+label('向きが ある？',920,390,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 // ===== S2 平行四辺形の面積 =====
 [K+'build']:(p)=>{
  const pr=para(50,{fill:seg(p,.6,.85),sides:seg(p,.3,.6)});
  let s=pr.svg;
  s+=card(720,140,430,200,label('𝐀 と 𝐁 を 二辺とする',935,210,{size:28,color:C.ink,anchor:'middle'})+label('平行四辺形',935,275,{size:36,color:CQ,anchor:'middle',weight:700}),seg(p,.6,.75));
  return s;
 },
 [K+'base']:(p)=>{
  const pr=para(50);
  let s=pr.svg+fade(seg(p,.4,.6),line(PO.ox,PO.oy+36,pr.Ax,PO.oy+36,{color:CA,w:4})+label('底辺 ＝ A',(PO.ox+pr.Ax)/2,PO.oy+74,{size:28,color:CA,anchor:'middle',weight:700}));
  s+=card(720,140,430,200,label('面積 ＝ 底辺 × 高さ',935,245,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2));
  return s;
 },
 [K+'height']:(p)=>{
  const pr=para(50,{height:seg(p,.3,.6),hlabel:'高さ'});
  let s=pr.svg+line(PO.ox,PO.oy+36,pr.Ax,PO.oy+36,{color:CA,w:4})+label('底辺 ＝ A',(PO.ox+pr.Ax)/2,PO.oy+74,{size:28,color:CA,anchor:'middle',weight:700});
  s+=card(720,140,430,200,label('高さ：𝐁 の先から',935,215,{size:28,color:C.ink,anchor:'middle'})+label('𝐀 の線へ 下ろした垂線',935,270,{size:28,color:CQ,anchor:'middle',weight:700}),seg(p,.1,.25));
  return s;
 },
 [K+'height2']:(p)=>{
  const pr=para(50,{height:1,hlabel:'B sinθ'});
  let s=pr.svg;
  s+=card(720,110,430,280,label('高さ ＝ 𝐁 の、𝐀 に',935,170,{size:28,color:C.ink,anchor:'middle'})+label('直角な部分',935,220,{size:30,color:CQ,anchor:'middle',weight:700})
   +tex(`B\\sin${TQ}`,935,290,{size:48,auto:false,color:CQ})+fade(seg(p,.5,.65),label('（前回：柄に直角な部分）',935,360,{size:24,color:C.dim,anchor:'middle'})),seg(p,.05,.2));
  return s;
 },
 [K+'area']:(p)=>{
  const pr=para(50,{height:1,hlabel:'B sinθ'});
  let s=pr.svg+label('底辺 A',(PO.ox+pr.Ax)/2,PO.oy+50,{size:26,color:CA,anchor:'middle'});
  s+=card(700,100,460,320,label('面積',930,150,{size:28,color:C.dim,anchor:'middle'})
   +tex(`={\\color{${CA}}A}\\times({\\color{${CQ}}B\\sin\\theta})`,930,220,{size:46,auto:false})
   +fade(seg(p,.25,.4),tex(`=A\\,B\\sin${TQ}`,930,300,{size:46,auto:false,color:CQ}))
   +fade(seg(p,.6,.75),label('＝ 外積の大きさ',930,385,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'cut']:(p)=>{
  const deg=50,th=deg*RAD,u=PO.u,{ox,oy}=PO,bx=ox+2*u*Math.cos(th),by=oy-2*u*Math.sin(th),m=smooth(seg(p,.3,.75));
  const pr=para(deg,{fill:0,height:1,hlabel:''});
  // remaining part (trapezoid) and the moving triangle
  let s=poly([[bx,oy],[ox+3*u,oy],[bx+3*u,by],[bx,by]],{fill:CQ,fo:.16});
  const dx=3*u*m;
  s+=poly([[ox+dx,oy],[bx+dx,oy],[bx+dx,by]],{fill:CQ,fo:.32,stroke:CQ,sw:2});
  s+=pr.svg;
  s+=fade(seg(p,.75,.9),rect(bx,by,3*u,oy-by,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:2}));
  s+=card(760,120,400,260,label('三角形を 右へ移す',960,180,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.75,.9),label('長方形',960,245,{size:34,color:C.hi,anchor:'middle',weight:700})+label('底辺 A × 高さ B sinθ',960,310,{size:28,color:CQ,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 [K+'num']:(p)=>{
  const pr=para(90,{grid:1,height:0,thetaArc:0});
  let s=pr.svg;
  const {ox,oy,u}=PO;
  for(let i=0;i<3;i++)for(let j=0;j<2;j++){const k=i+3*j,g=seg(p,.3+k*.06,.36+k*.06);s+=fade(g,label(String(k+1),ox+i*u+u/2,oy-j*u-u/2+10,{size:28,color:C.hi,anchor:'middle',weight:700}));}
  s+=line(ox+14,oy,ox+14,oy-14,{color:C.dim})+line(ox+14,oy-14,ox,oy-14,{color:C.dim});
  s+=card(720,120,430,260,label('A ＝ 3，B ＝ 2，θ ＝ 90°',935,180,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.7,.8),tex(`3\\times2\\times\\sin90^\\circ=6`,935,260,{size:40,auto:false,color:CQ})+label('（前回の答えと 同じ）',935,330,{size:24,color:C.dim,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 [K+'num2']:(p)=>{
  const pr=para(30,{grid:1,height:seg(p,.1,.3),hlabel:'1'});
  let s=pr.svg;
  s+=card(720,120,430,260,label('θ ＝ 30°',935,180,{size:30,color:CT,anchor:'middle',weight:700})
   +fade(seg(p,.2,.35),tex(`2\\times\\sin30^\\circ=1`,935,250,{size:40,auto:false,color:CQ}))
   +fade(seg(p,.6,.75),tex(`\\text{面積}=3\\times1=3`,935,330,{size:40,auto:false,color:CQ})),seg(p,0,.15));
  return s;
 },
 // ===== S3 倒すとつぶれて 0 =====
 [K+'squash']:(p)=>{
  const deg=90-25*seg(p,.2,.7);
  const pr=para(deg,{height:1});
  let s=pr.svg+arrow(PO.ox+80,PO.oy-140,PO.ox+160,PO.oy-100,{color:C.hi,w:3,head:12,g:seg(p,.2,.5)});
  s+=card(720,140,430,230,label('𝐁 を 𝐀 の方へ 倒すと',935,205,{size:30,color:C.ink,anchor:'middle'})+label('面積は？',935,270,{size:34,color:C.hi,anchor:'middle',weight:700})+label('予想してみよう',935,330,{size:26,color:C.dim,anchor:'middle'}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'squash2']:(p)=>syncScene(90-70*seg(p,.1,.9),p),
 [K+'graph']:(p)=>syncScene(20,p,{hl:seg(p,.1,.3)}),
 [K+'zero']:(p)=>{
  let s=syncScene(20-20*seg(p,.05,.4),p);
  s+=fade(seg(p,.45,.6),label('平行 → 面積 0',PO.ox+120,PO.oy-120,{size:32,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'open']:(p)=>syncScene(180*seg(p,.05,.9),p),
 [K+'q150']:(p)=>{
  const pr=para(150);
  let s=pr.svg;
  s+=card(720,140,430,230,label('θ ＝ 150°',935,205,{size:32,color:CT,anchor:'middle',weight:700})+label('面積は いくつ？',935,270,{size:32,color:C.hi,anchor:'middle',weight:700})+label('予想してみよう',935,330,{size:26,color:C.dim,anchor:'middle'}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'q150a']:(p)=>{
  const pr=para(150,{height:seg(p,.05,.25),hlabel:'1'});
  let s=pr.svg;
  s+=card(720,110,430,300,tex(`2\\times\\sin150^\\circ=1`,935,180,{size:40,auto:false,color:CQ})
   +fade(seg(p,.3,.45),tex(`\\text{面積}=3\\times1=3`,935,260,{size:40,auto:false,color:CQ}))
   +fade(seg(p,.6,.75),label('30° と 同じ高さ',935,345,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'door']:(p)=>{
  const ox=180,oy=420,W=250,Hh=240; // 0.5 m → 250 px, 4 N → 240 px
  let s=fade(seg(p,.2,.45),rect(ox,oy-Hh,W,Hh,{fill:CQ,fo:.18,stroke:C.faint}));
  s+=arrow(ox,oy,ox+W,oy,{color:CA,w:6})+label('r ＝ 0.5 m',ox+W/2,oy+40,{size:26,color:CA,anchor:'middle',weight:700});
  s+=arrow(ox,oy,ox,oy-Hh,{color:CB,w:6})+label('F ＝ 4 N',ox-14,oy-Hh/2,{size:26,color:CB,anchor:'end',weight:700});
  s+=line(ox+14,oy,ox+14,oy-14,{color:C.dim})+line(ox+14,oy-14,ox,oy-14,{color:C.dim});
  s+=card(700,120,460,260,label('ドア（直角に押す）',930,180,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.3,.45),tex(`0.5\\times4=2\\,\\mathrm{N\\cdot m}`,930,260,{size:42,auto:false,color:CN}))
   +fade(seg(p,.55,.7),label('長方形の 面積 ＝ トルク',930,335,{size:28,color:CQ,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 // ===== S4 向きが要る =====
 [K+'need']:(p)=>{
  const g1=seg(p,.05,.25),g2=seg(p,.3,.5);
  let s=wrench(120,140,260,0)+arrow(380,140,380,50,{color:CB,w:5,g:g1})+fade(g1,draw(circPts(120,140,85,.3,1.5),1,{color:CN,w:4})+label('左回り',520,110,{size:28,color:CN,weight:700})+label('2 N·m',520,150,{size:26,color:C.ink}));
  s+=fade(g1,`<polygon points="${120+85*Math.cos(1.5)-13},${140-85*Math.sin(1.5)-5} ${120+85*Math.cos(1.5)+5},${140-85*Math.sin(1.5)-14} ${120+85*Math.cos(1.5)+3},${140-85*Math.sin(1.5)+8}" fill="${CN}"/>`);
  s+=wrench(120,400,260,0)+arrow(380,400,380,490,{color:CB,w:5,g:g2})+fade(g2,draw(circPts(120,400,85,-.3,-1.5),1,{color:C.a,w:4})+label('右回り',520,390,{size:28,color:C.a,weight:700})+label('2 N·m',520,430,{size:26,color:C.ink}));
  s+=fade(g2,`<polygon points="${120+85*Math.cos(-1.5)-13},${400-85*Math.sin(-1.5)+5} ${120+85*Math.cos(-1.5)+5},${400-85*Math.sin(-1.5)+14} ${120+85*Math.cos(-1.5)+3},${400-85*Math.sin(-1.5)-8}" fill="${C.a}"/>`);
  s+=card(720,170,430,180,label('大きさは 同じ',935,235,{size:30,color:C.ink,anchor:'middle'})+label('回る向きが 逆',935,295,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75));
  return s;
 },
 [K+'axis']:(p)=>{
  let s=wrench(150,300,280,0)+dot(150,300,6,CN)+label('軸',150,400,{size:26,color:CN,anchor:'middle'});
  s+=draw(circPts(150,300,90,.3,1.4),1,{color:CN,w:4});
  s+=inset(Math.PI/2,{axis:1,arrowG:0,g:seg(p,.3,.5),title:'横から見ると'});
  s+=fade(seg(p,.55,.7),label('軸は 平面に 垂直',930,470,{size:28,color:CN,anchor:'middle',weight:700}));
  return s;
 },
 [K+'arrow']:(p)=>{
  let s=scene3(Math.PI/2,{sym:0,nG:0});
  s+=inset(Math.PI/2,{axis:1,arrowG:0});
  s+=fade(seg(p,.4,.6),line(930,300,930,190,{color:CN,w:6})+label('回転を 軸の向きの 矢印で',930,470,{size:28,color:CN,anchor:'middle',weight:700}));
  return s;
 },
 [K+'notation']:(p)=>{
  let s=scene3(Math.PI/2,{sym:0,nG:0});
  s+=card(640,70,520,370,tex(AxB,900,150,{size:62,auto:false})+label('「エー クロス ビー」',900,215,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.4,.55),label('大きさ：AB sinθ（面積）',900,300,{size:28,color:CQ,anchor:'middle'})+label('向き：平面に 垂直',900,360,{size:28,color:CN,anchor:'middle'})),seg(p,0,.15),CN);
  return s;
 },
 [K+'two']:(p)=>{
  let s=scene3(Math.PI/2,{sym:0,nG:0});
  s+=fade(seg(p,.3,.5),label('？',215,375,{size:40,color:CN,anchor:'middle',weight:700}));
  s+=inset(Math.PI/2,{both:seg(p,.2,.45)});
  return s;
 },
 [K+'dot']:(p)=>{
  let s=scene3(Math.PI/2,{sym:0,nG:0})+outSym(260,330,26,CN,seg(p,.4,.6));
  s+=inset(Math.PI/2,{arrowG:1,title:'手前向き'});
  s+=fade(seg(p,.2,.4),outSym(930,470,26));
  s+=fade(seg(p,.2,.4),label('矢の先が 見える',990,478,{size:24,color:CN}));
  return s;
 },
 [K+'cross']:(p)=>{
  let s=scene3(Math.PI/2,{sym:0,nG:0})+inSym(260,330,26,CN,seg(p,.4,.6));
  let t=label('奥向き',930,110,{size:24,color:C.dim,anchor:'middle'})+line(800,300,1060,300,{color:C.ink,w:5})+arrow(930,300,930,400,{color:CN,w:5});
  const ex=930,ey=150;t+=`<ellipse cx="${ex}" cy="${ey}" rx="20" ry="12" fill="#1b2338" stroke="${C.hi}" stroke-width="3"/>`+dot(ex,ey+6,5,C.hi)+label('見る人',ex+28,ey+8,{size:22,color:C.hi});
  s+=t+fade(seg(p,.2,.4),inSym(1090,380,26)+label('羽根が 見える',1090,440,{size:24,color:CN,anchor:'middle'}));
  return s;
 },
 [K+'tilt']:(p)=>{
  const e=mix(90,35,seg(p,.1,.6))*RAD;
  let s=scene3(e,{nlabel:p>.6?'手前向き':''});
  s+=inset(e);
  return s;
 },
 // ===== S5 右ねじ =====
 [K+'screw']:(p)=>{
  // a plain screw drawn from the side
  const x0=200,y0=260;
  let s=rect(x0,y0-40,40,80,{fill:'#46526e',fo:1,stroke:C.ink,sw:2.5,rx:6})+rect(x0+40,y0-16,260,32,{fill:'#5a6680',fo:1,stroke:C.ink,sw:2,rx:3});
  for(let k=0;k<13;k++){const xx=x0+52+k*19;s+=line(xx,y0+16,xx+10,y0-16,{color:C.ink,w:1.8});}
  s+=`<polygon points="${x0+300},${y0-16} ${x0+330},${y0} ${x0+300},${y0+16}" fill="#5a6680" stroke="${C.ink}" stroke-width="2"/>`;
  s+=label('右ねじ ＝ ふつうの ねじ・ボルト',x0+165,y0+90,{size:28,color:C.ink,anchor:'middle'});
  s+=card(720,140,430,220,label('手前か 奥か',935,210,{size:30,color:C.ink,anchor:'middle'})+label('右ねじで 決める（約束）',935,275,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25));
  return s;
 },
 [K+'turn']:(p)=>{
  let s=scene3(Math.PI/2,{sym:0,nG:0,turn:seg(p,.2,.6)});
  s+=`<g transform="rotate(${(-40*seg(p,.2,.6)).toFixed(1)} 260 330)">`+poly(hexagon(260,330,26,0),{fill:'#46526e',fo:1,stroke:C.ink,sw:2.5})+`</g>`;
  s+=card(640,110,520,300,label('① 𝐀 から ② 𝐁 へ',900,170,{size:30,color:C.ink,anchor:'middle'})+label('小さい方の角で 回す',900,225,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.6,.75),label('𝐀 右 → 𝐁 上：反時計回り',900,310,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'loosen']:(p)=>{
  const e=mix(90,35,seg(p,.05,.35))*RAD,rise=90*seg(p,.35,.7);
  let s=scene3(e,{turn:1,screw:1,rise,nG:seg(p,.65,.8),nlabel:p>.75?'A×B':'',sym:0});
  s+=fade(1-seg(p,.05,.2),outSym(260,330,24,CN,0));
  s+=card(700,90,460,330,label('反時計回り に回すと',930,150,{size:28,color:C.ink,anchor:'middle'})+label('ゆるんで 手前へ出る',930,205,{size:30,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.7,.85),tex(AxB,880,300,{size:40,auto:false})+label('：手前向き',915,310,{size:32,color:CN,weight:700})+outSym(930,365,24)),seg(p,0,.12));
  return s;
 },
 [K+'rquiz']:(p)=>{
  const ox=260,oy=360;
  let s=arrow(ox,oy,ox,oy-200,{color:CA,w:6})+vl('A',ox+14,oy-190,{color:CA});
  s+=arrow(ox,oy,ox-200,oy,{color:CB,w:6})+vl('B',ox-210,oy-14,{color:CB});
  s+=card(700,140,450,230,label('𝐀 上，𝐁 左',925,200,{size:30,color:C.ink,anchor:'middle'})+tex(AxB,925,265,{size:44,auto:false})+label('手前？ 奥？',925,330,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'rquizA']:(p)=>{
  const ox=260,oy=360;
  let s=arrow(ox,oy,ox,oy-200,{color:CA,w:6})+vl('A',ox+14,oy-190,{color:CA});
  s+=arrow(ox,oy,ox-200,oy,{color:CB,w:6})+vl('B',ox-210,oy-14,{color:CB});
  s+=arc2(circPts(ox,oy,90,Math.PI/2,Math.PI/2+Math.PI/2*seg(p,.05,.35),30),{g:seg(p,.05,.1)});
  s+=outSym(ox,oy,24,CN,seg(p,.5,.65));
  s+=card(700,110,450,300,label('上 → 左：反時計回り',925,175,{size:30,color:C.ink,anchor:'middle'})
   +fade(seg(p,.4,.55),label('ねじは ゆるんで 手前へ',925,245,{size:28,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.55,.7),tex(AxB,880,330,{size:44,auto:false})+label('：手前',950,340,{size:30,color:CN,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'wrench']:(p)=>{
  let s=wrench(150,330,310,0)+arrow(460,330,460,170,{color:CB,w:6})+vl('F',474,190,{color:CB});
  s+=line(150,392,460,392,{color:CA,w:4})+vl('r',305,428,{color:CA,anchor:'middle'});
  s+=arc2(circPts(150,330,100,.25,.25+1.2*seg(p,.2,.5),30),{c1:CA,c2:CB,g:seg(p,.2,.25)});
  s+=outSym(150,330,22,CN,seg(p,.55,.7));
  s+=card(700,110,460,300,label('𝐫 右，𝐅 上 → 反時計回り',930,170,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.35,.5),label('ボルトは ゆるんで 手前へ',930,235,{size:28,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.6,.75),label('トルクの矢印：手前向き',930,320,{size:30,color:CN,anchor:'middle',weight:700})+outSym(930,375,22)),seg(p,0,.15));
  return s;
 },
 [K+'reverse']:(p)=>{
  const ox=260,oy=360;
  let s=arrow(ox,oy,ox+220,oy,{color:CA,w:6})+vl('A',ox+230,oy+10,{color:CA});
  s+=arrow(ox,oy,ox,oy-200,{color:CB,w:6})+vl('B',ox+14,oy-190,{color:CB});
  s+=arc2(circPts(ox,oy,90,Math.PI/2,Math.PI/2-Math.PI/2*seg(p,.1,.4),30),{c1:CB,c2:CA,g:seg(p,.1,.15)});
  s+=inSym(ox,oy,24,CN,seg(p,.6,.75));
  s+=card(700,110,450,300,label('① 𝐁 から ② 𝐀 へ：時計回り',925,175,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.4,.55),label('ねじは 締まって 奥へ',925,245,{size:28,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.6,.75),tex(BxA,880,330,{size:44,auto:false})+label('：奥',950,340,{size:30,color:CN,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'reverse2']:(p)=>{
  let s=card(80,90,440,300,tex(AxB,300,160,{size:48,auto:false})+outSym(300,250,30)+label('手前',300,330,{size:28,color:CN,anchor:'middle'}));
  s+=card(680,90,440,300,tex(BxA,900,160,{size:48,auto:false})+inSym(900,250,30)+label('奥',900,330,{size:28,color:CN,anchor:'middle'}));
  s+=fade(seg(p,.3,.5),tex(`${BxA}=-\\,${AxB}`,600,460,{size:50,auto:false}));
  return s;
 },
 // ===== S6 見る向きを変えても =====
 [K+'view']:(p)=>{const e=mix(35,-35,seg(p,.1,.9))*RAD;return scene3(e,{turn:1,nlabel:'A×B'})+inset(e);},
 [K+'view2']:(p)=>{
  const e=mix(-35,-90,seg(p,.05,.5))*RAD;
  let s=scene3(e,{turn:1,nlabel:''})+inset(e);
  s+=fade(seg(p,.55,.7),label('時計回りに 見える',260,120,{size:28,color:C.hi,anchor:'middle',weight:700})+label('矢印は 奥向き（⊗）',260,165,{size:28,color:CN,anchor:'middle',weight:700}));
  return s;
 },
 [K+'view3']:(p)=>{
  const e=-90*RAD;
  let s=scene3(e,{turn:1});
  s+=card(680,120,480,200,label('時計回りに見える ねじは',920,190,{size:28,color:C.ink,anchor:'middle'})+label('見る人から 遠ざかる',920,250,{size:30,color:C.hi,anchor:'middle',weight:700})+label('→ 約束どおり',920,300,{size:24,color:C.dim,anchor:'middle'}),seg(p,.1,.25));
  return s;
 },
 [K+'view4']:(p)=>{
  const e=mix(-90,35,seg(p,.05,.8))*RAD;
  let s=scene3(e,{turn:1,nlabel:'A×B'})+inset(e);
  s+=fade(seg(p,.8,.95),label('矢印そのものは 同じ',930,490,{size:28,color:CN,anchor:'middle',weight:700}));
  return s;
 },
 [K+'where']:(p)=>{
  const rows=[['回す効き目（トルク）',`{\\color{${CN}}\\mathbf{N}}=\\mathbf{r}\\times\\mathbf{F}`],['回転の勢い',`\\mathbf{L}=\\mathbf{r}\\times\\mathbf{p}`],['磁場の中を動く電荷が受ける力',`\\mathbf{F}=q\\,\\mathbf{v}\\times\\mathbf{B}`]];
  let s=label('この先の 外積',600,90,{size:30,color:C.dim,anchor:'middle'});
  rows.forEach(([t,f],i)=>{const g=seg(p,.1+i*.2,.25+i*.2),y=170+i*110;s+=fade(g,rect(120,y-45,960,90,{fill:'#131f38',fo:.96,stroke:C.faint,rx:14})+label(t,160,y+10,{size:30,color:C.ink})+tex(f,880,y,{size:44}));});
  return s;
 },
 [K+'sum1']:(p)=>{
  const pr=para(50,{height:1,hlabel:'B sinθ'});
  let s=pr.svg;
  s+=card(700,110,460,300,label('まとめ ①',930,165,{size:26,color:C.dim,anchor:'middle'})+tex(`|${AxB}|=A\\,B\\sin${TQ}`,930,245,{size:44,auto:false})
   +label('＝ 平行四辺形の 面積',930,330,{size:30,color:CQ,anchor:'middle',weight:700}),seg(p,0,.15));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=scene3(35*RAD,{turn:1,screw:1,rise:90,nlabel:'A×B'});
  s+=card(700,110,460,300,label('まとめ ②',930,165,{size:26,color:C.dim,anchor:'middle'})+label('向き：平面に 垂直',930,240,{size:30,color:CN,anchor:'middle',weight:700})
   +label('𝐀 → 𝐁 に回す 右ねじが',930,305,{size:28,color:C.ink,anchor:'middle'})+label('進む向き',930,355,{size:28,color:C.ink,anchor:'middle'}),seg(p,0,.15));
  return s;
 },
 [K+'next']:(p)=>{
  const A=axes({x:120,y:440,w:440,h:300,xmax:4,ymax:11,xlabel:'時刻 t',ylabel:'量',xticks:[],yticks:[],g:seg(p,0,.2),xcolor:C.t,ycolor:C.E});
  let s=A.svg+A.plot(t=>10*Math.exp(-.6*t),{from:0,to:3.8,color:C.E,w:4,p:seg(p,.1,.5)});
  s+=card(640,120,520,250,label('次の問い',900,175,{size:26,color:C.dim,anchor:'middle'})+label('変化の速さが 今の量で決まる',900,240,{size:30,color:C.ink,anchor:'middle'})+label('量そのものを 求められる？',900,305,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.5),C.hi);
  return s;
 },
};

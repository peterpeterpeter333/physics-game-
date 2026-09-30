// YouTube シリーズ「外積・中級 1/2」(ys-um-cross-product-1) — 図。Stage 1200×515.
// 色（外積・初級に合わせる）：𝐀 水色、𝐁 緑、外積の矢印・法線 桃、面積 黄の塗り、θ 橙。
//   基本の向き（ベクトル・中級の軸に合わせる）：x̂ 水色、ŷ 紫、ẑ 金。ベクトルは太字、長さは細字。
// 空間：x 右、y 奥（斜め右上に描く）、z 上（斜投影）。⊙＝見る人の側、⊗＝その反対。
import {C,clamp,mix,smooth,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,poly} from './anim.mjs';

const K='um-cross-product-1:';
const CA=C.x,CB=C.F,CN=C.p,CQ=C.hi,CT=C.E,HX=C.x,HY=C.v,HZ=C.t,NG=C.a;
const RAD=Math.PI/180;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const bA=cs(CA,'\\mathbf{A}'),bB=cs(CB,'\\mathbf{B}');
const hx=cs(HX,'\\hat{x}'),hy=cs(HY,'\\hat{y}'),hz=cs(HZ,'\\hat{z}');
const AxB=`${bA}\\times${bB}`,BxA=`${bB}\\times${bA}`;

// ---- ⊙ / ⊗ ----
function outSym(x,y,r=22,color=CN,g=1){return fade(g,ring(x,y,r,{color,w:4,fill:'#1a1030'})+dot(x,y,r*.28,color));}
function inSym(x,y,r=22,color=CN,g=1){const d=r*.62;return fade(g,ring(x,y,r,{color,w:4,fill:'#1a1030'})+line(x-d,y-d,x+d,y+d,{color,w:4})+line(x-d,y+d,x+d,y-d,{color,w:4}));}
// arc with arrowhead; first half c1, second half c2
function arc2(pts,{c1=CA,c2=CB,w=5,g=1}={}){
 if(g<=0||pts.length<3)return '';
 const n=pts.length,h=Math.floor(n/2),[x1,y1]=pts[n-2],[x2,y2]=pts[n-1];
 const a=Math.atan2(y2-y1,x2-x1),L=16;
 const head=`<polygon points="${x2+Math.cos(a)*6},${y2+Math.sin(a)*6} ${x2-L*Math.cos(a)+L*.55*Math.sin(a)},${y2-L*Math.sin(a)-L*.55*Math.cos(a)} ${x2-L*Math.cos(a)-L*.55*Math.sin(a)},${y2-L*Math.sin(a)+L*.55*Math.cos(a)}" fill="${c2}"/>`;
 return fade(g,draw(pts.slice(0,h+1),1,{color:c1,w})+draw(pts.slice(h),1,{color:c2,w})+head);
}
const circPts=(cx,cy,r,a0,a1,n=40)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});
function hexagon(cx,cy,r,rot){return Array.from({length:6},(_,i)=>{const a=rot+i*Math.PI/3;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});}

// ---- oblique 3D: x right, y into the screen (drawn up-right), z up ----
const KY=.55,AY=32*RAD;
function view({ox,oy,u,ky=KY,ay=AY}){return (x,y,z)=>[ox+u*(x+ky*Math.cos(ay)*y),oy-u*(z+ky*Math.sin(ay)*y)];}
const FL={ky:.8,ay:55*RAD}; // floor-heavy view for the parallelogram scenes
const V3=(P,a,b,o={})=>{const A=P(...a),B=P(...b);return arrow(A[0],A[1],B[0],B[1],o);};
const L3=(P,a,b,o={})=>{const A=P(...a),B=P(...b);return line(A[0],A[1],B[0],B[1],o);};
function axes3(P,{xl=1.7,yl=2.1,zl=1.5,zn=1.3,g=1,names=true}={}){
 let s='';
 s+=L3(P,[-.35,0,0],[0,0,0],{color:C.faint,w:2,dash:'5 6'})+L3(P,[0,-.5,0],[0,0,0],{color:C.faint,w:2,dash:'5 6'})+L3(P,[0,0,-zn],[0,0,0],{color:C.faint,w:2,dash:'5 6'});
 s+=V3(P,[0,0,0],[xl,0,0],{color:C.dim,w:2.5,head:13})+V3(P,[0,0,0],[0,yl,0],{color:C.dim,w:2.5,head:13})+V3(P,[0,0,0],[0,0,zl],{color:C.dim,w:2.5,head:13});
 if(names){const X=P(xl,0,0),Y=P(0,yl,0),Z=P(0,0,zl);
  s+=label('x（右）',X[0]+10,X[1]+8,{size:24,color:HX,weight:700})+label('y（奥）',Y[0]+10,Y[1]-2,{size:24,color:HY,weight:700})+label('z（上）',Z[0]+14,Z[1]+10,{size:24,color:HZ,weight:700});}
 return fade(g,s);
}
// floor tiles (xy plane) for depth cue
function floor(P,{x0=-.35,x1=1.6,y0=-.5,y1=2,g=1}={}){
 return fade(g,poly([P(x0,y0,0),P(x1,y0,0),P(x1,y1,0),P(x0,y1,0)],{fill:'#1a2a48',fo:.55,stroke:C.grid,sw:2}));
}
// rotation arc on the floor, angle a0→a1 (radians measured from +x toward +y)
function floorArc(P,r,a0,a1,{c1=CA,c2=CB,g=1,w=5}={}){
 if(g<=0)return '';
 const pts=Array.from({length:31},(_,i)=>{const a=a0+(a1-a0)*i/30*g;return P(r*Math.cos(a),r*Math.sin(a),0);});
 return arc2(pts,{c1,c2,w});
}
// a screw standing on the z axis; rise>0 moves it up, <0 down
function screw(P,{rise=0,g=1,turn=0}={}){
 if(g<=0)return '';
 const zb=-.34+rise,zt=.16+rise,[sx,y1]=P(0,0,zb),[,y2]=P(0,0,zt);
 let t=rect(sx-10,y2,20,Math.max(1,y1-y2),{fill:'#5a6680',fo:1,stroke:C.ink,sw:2,rx:3});
 for(let k=1;k<6;k++){const yy=mix(y1,y2,k/6),o=((k+turn*3)%2)*0;t+=line(sx-10,yy+4+o,sx+10,yy-4+o,{color:C.ink,w:1.5});}
 t+=`<polygon points="${sx},${y1+14} ${sx-10},${y1} ${sx+10},${y1}" fill="#5a6680" stroke="${C.ink}" stroke-width="1.5"/>`;
 t+=`<ellipse cx="${sx}" cy="${y2}" rx="26" ry="9" fill="#46526e" stroke="${C.ink}" stroke-width="2.5"/>`;
 const sl=26*Math.cos(turn*2.4);t+=line(sx-sl,y2,sx+sl,y2+(sl/26)*0,{color:C.ink,w:2.5});
 return fade(g,t);
}
// top view inset: first vector right, second up (ccw) or reversed
function topView(cx,cy,{g=1,rev=0,sym='out',n1=hx,n2=hy,c1=HX,c2=HY,u=70,title='真上から見ると',arcG=1,second=90}={}){
 let s=rect(cx-120,cy-150,240,250,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:14});
 s+=label(title,cx,cy-118,{size:22,color:C.dim,anchor:'middle'});
 const bx=cx+u*Math.cos(second*RAD),by=cy+20-u*Math.sin(second*RAD);
 s+=arrow(cx,cy+20,cx+u,cy+20,{color:c1,w:5,head:15})+arrow(cx,cy+20,bx,by,{color:c2,w:5,head:15});
 s+=T(n1,cx+u+20,cy+30,{size:28})+T(n2,bx+(second>100?-22:-26),by-8,{size:28});
 const a0=rev?second*RAD:0,a1=rev?0:second*RAD;
 s+=arc2(circPts(cx,cy+20,40,a0,a1,24),{c1:rev?c2:c1,c2:rev?c1:c2,w:4,g:arcG});
 s+=sym==='out'?outSym(cx,cy+20,15,CN,arcG):sym==='in'?inSym(cx,cy+20,15,CN,arcG):'';
 return fade(g,s);
}

// ---- main 3D scene: unit x̂, ŷ on the floor with the answer on the z axis ----
const PU=view({ox:230,oy:300,u:150});
function hatScene(p,{gx=1,gy=1,perp=0,two=0,turn=0,rev=0,sc=0,rise=0,res=0,resDir=1,resLab='',zhat=0}={}){
 let s=floor(PU)+axes3(PU);
 if(perp>0)s+=fade(perp,L3(PU,[0,0,-1.25],[0,0,1.45],{color:CN,w:3,dash:'9 7'}));
 if(two>0)s+=fade(two,V3(PU,[0,0,0],[0,0,1],{color:CN,w:5,head:18,opacity:.55})+V3(PU,[0,0,0],[0,0,-1],{color:CN,w:5,head:18,opacity:.55})
  +label('上？',PU(0,0,1)[0]-22,PU(0,0,1)[1]+6,{size:28,color:CN,anchor:'end',weight:700})+label('下？',PU(0,0,-1)[0]-22,PU(0,0,-1)[1]+6,{size:28,color:CN,anchor:'end',weight:700}));
 if(res<0.001&&sc>0)s+=screw(PU,{rise,g:sc,turn});
 s+=V3(PU,[0,0,0],[1,0,0],{color:HX,w:7,head:20,g:gx})+V3(PU,[0,0,0],[0,1,0],{color:HY,w:7,head:20,g:gy});
 s+=fade(gx,T(hx,PU(1,0,0)[0]-6,PU(1,0,0)[1]+42,{size:40}))+fade(gy,T(hy,PU(0,1,0)[0]+26,PU(0,1,0)[1]+6,{size:40}));
 if(perp>0){const m=(a,b,c)=>PU(a,b,c);const k=.12;s+=fade(perp,draw([m(k,0,0),m(k,0,k),m(0,0,k)],1,{color:C.ink,w:2})+draw([m(0,k,0),m(0,k,k),m(0,0,k)],1,{color:C.ink,w:2}));}
 if(turn>0)s+=floorArc(PU,.55,rev?Math.PI/2:0,rev?0:Math.PI/2,{c1:rev?HY:HX,c2:rev?HX:HY,g:turn});
 if(res>0.001){s+=sc>0?screw(PU,{rise,g:sc,turn:1}):'';
  s+=V3(PU,[0,0,0],[0,0,resDir],{color:CN,w:8,head:22,g:res});
  const E=PU(0,0,resDir*res);if(resLab)s+=fade(seg(res,.7,1),T(resLab,E[0]-18,E[1]+(resDir>0?4:14),{size:36,anchor:'end'}));}
 if(zhat>0)s+=fade(zhat,V3(PU,[0,0,0],[0,0,1],{color:HZ,w:5,head:18})+T(hz,PU(0,0,1)[0]+22,PU(0,0,1)[1]+20,{size:40}));
 return s;
}

// ---- parallelogram on the floor: A (len 3 along x), B (len 2 at 50°) ----
function paraScene(P,{deg=65,gF=1,normal=0,dir=1,turn=0,rev=0,labN='',nScale=.4,a=3,b=2,grid=0,axesG=1,thetaG=1}={}){
 const th=deg*RAD,Bv=[b*Math.cos(th),b*Math.sin(th),0],Av=[a,0,0];
 let s=fade(axesG,poly([P(-.4,-.5,0),P(3.6,-.5,0),P(3.6,2.3,0),P(-.4,2.3,0)],{fill:'#1a2a48',fo:.55,stroke:C.grid,sw:2}));
 if(grid){for(let i=0;i<=a;i++)s+=L3(P,[i,0,0],[i,b,0],{color:C.grid,w:1.5});for(let j=0;j<=b;j++)s+=L3(P,[0,j,0],[a,j,0],{color:C.grid,w:1.5});}
 s+=fade(gF,poly([P(0,0,0),P(...Av),P(Av[0]+Bv[0],Bv[1],0),P(...Bv)],{fill:CQ,fo:.2,stroke:CQ,sw:1.5}));
 const L=a*b*Math.sin(th)*nScale*dir;
 const nArrow=normal>0?V3(P,[0,0,0],[0,0,L],{color:CN,w:8,head:22,g:normal})+(labN?fade(seg(normal,.7,1),T(labN,P(0,0,L)[0]-18,P(0,0,L)[1]+(dir>0?4:-24),{size:36,anchor:'end'})):''):'';
 if(dir<0)s+=nArrow; // below the floor: draw under the vectors
 s+=V3(P,[0,0,0],Av,{color:CA,w:7,head:20})+V3(P,[0,0,0],Bv,{color:CB,w:7,head:20});
 s+=T(bA,P(...Av)[0]+20,P(...Av)[1]+14,{size:38,anchor:'start'})+T(bB,P(...Bv)[0]+8,P(...Bv)[1]-12,{size:38,anchor:'start'});
 if(thetaG&&!grid){const pts=Array.from({length:21},(_,i)=>{const t=th*i/20;return P(.38*Math.cos(t),.38*Math.sin(t),0);});s+=fade(thetaG,draw(pts,1,{color:CT,w:3}));}
 if(turn>0)s+=floorArc(P,.8,rev?th:0,rev?0:th,{c1:rev?CB:CA,c2:rev?CA:CB,g:turn});
 if(dir>0)s+=nArrow;
 return s;
}
const PP=view({ox:130,oy:290,u:95,...FL});

// ---- two bolts: floor (vertical axis) and wall (horizontal axis) ----
function floorBolt(cx,cy,{g=1,arcG=1,ccw=1,color=CN}={}){
 let s=poly([[cx-170,cy+40],[cx+110,cy+40],[cx+170,cy-40],[cx-110,cy-40]],{fill:'#1a2a48',fo:.7,stroke:C.grid,sw:2});
 s+=line(cx,cy+90,cx,cy-190,{color,w:3,dash:'9 7'});
 s+=`<ellipse cx="${cx}" cy="${cy}" rx="34" ry="13" fill="#46526e" stroke="${C.ink}" stroke-width="2.5"/>`+rect(cx-24,cy-30,48,30,{fill:'#46526e',fo:1,stroke:C.ink,sw:2.5,rx:3})+`<ellipse cx="${cx}" cy="${cy-30}" rx="24" ry="9" fill="#5a6680" stroke="${C.ink}" stroke-width="2"/>`;
 const pts=Array.from({length:31},(_,i)=>{const a=(ccw? -0.6+2.2*i/30 : 1.6-2.2*i/30);return [cx+80*Math.cos(a),cy-60+28*Math.sin(a)];});
 s+=arc2(pts,{c1:color,c2:color,w:4,g:arcG});
 return fade(g,s);
}
function wallBolt(cx,cy,{g=1,arcG=1,ccw=1,color=CN,axis=1}={}){
 let s=poly([[cx-130,cy+130],[cx+70,cy+130],[cx+130,cy+70],[cx+130,cy-150],[cx-70,cy-150],[cx-130,cy-90]],{fill:'#1a2a48',fo:.0,stroke:'none'});
 s+=rect(cx-120,cy-130,240,250,{fill:'#1a2a48',fo:.7,stroke:C.grid,sw:2,rx:4});
 if(axis)s+=line(cx-110,cy+70,cx+110,cy-70,{color,w:3,dash:'9 7'});
 s+=poly(hexagon(cx,cy,28,0),{fill:'#46526e',fo:1,stroke:C.ink,sw:2.5})+ring(cx,cy,10,{color:C.ink,w:2,fill:'#1b2338'});
 const pts=ccw?circPts(cx,cy,62,-.5,2.2,30):circPts(cx,cy,62,2.2,-.5,30);
 s+=arc2(pts,{c1:color,c2:color,w:4,g:arcG});
 return fade(g,s);
}

export const ytUmCrossProduct1Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  let s=label('前回：内積・中級 2/2',40,50,{size:24,color:C.dim});
  s+=hatScene(p,{gx:seg(p,.05,.2),gy:seg(p,.1,.25),two:seg(p,.3,.45)});
  s+=card(640,90,520,300,T(AxB,900,150,{size:48})
   +fade(seg(p,.3,.45),label('① 向きを 基本の3方向で どう計算？',900,240,{size:28,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.55,.7),label('② 順序を 入れ替えると？',900,310,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.02,.15),C.hi);
  return s;
 },
 [K+'recall']:(p)=>{
  let s=card(60,90,500,320,label('内積',310,150,{size:30,color:C.dim,anchor:'middle'})+T(`${bA}\\cdot${bB}=AB\\cos\\theta`,310,230,{size:44})
   +label('答え：一つの 数',310,320,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,0,.15));
  s+=card(640,90,500,320,label('外積',890,150,{size:30,color:C.dim,anchor:'middle'})+T(`|${AxB}|=AB\\sin\\theta`,890,230,{size:44})
   +fade(seg(p,.55,.7),label('＝ 平行四辺形の 面積',890,320,{size:30,color:CQ,anchor:'middle',weight:700})),seg(p,.4,.55));
  return s;
 },
 [K+'plan']:(p)=>{
  const rows=[['なぜ 答えが 矢印？',C.ink],['向きは どう決まる？',C.ink],['順序で 何が変わる？',C.hi]];
  let s=label('今回 確かめること',600,80,{size:28,color:C.dim,anchor:'middle'});
  rows.forEach(([t,c],i)=>{s+=card(300,110+i*95,600,78,label(`${i+1}．${t}`,600,160+i*95,{size:32,color:c,anchor:'middle',weight:700}),seg(p,.05+i*.12,.17+i*.12));});
  s+=fade(seg(p,.6,.75),label('基本の3方向の 計算表 → 次の回',600,470,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=card(80,110,440,260,T(AxB,300,200,{size:56})+label('？',300,310,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15));
  s+=card(680,110,440,260,T(BxA,900,200,{size:56})+label('？',900,310,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25));
  s+=fade(seg(p,.3,.45),label('同じ？ 違う？',600,430,{size:34,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),label('予想してみよう',600,480,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 // ===== S2 答えが矢印になる理由 =====
 [K+'door']:(p)=>{
  const hx0=170,hy0=340,W=300;
  let s=label('初級のドア（真上から）',60,60,{size:24,color:C.dim});
  s+=rect(hx0-6,hy0-12,W,24,{fill:'#2c3854',fo:1,stroke:C.dim,sw:2,rx:6})+ring(hx0,hy0,14,{color:C.ink,w:3,fill:'#1b2338'})+label('蝶番',hx0,hy0+56,{size:24,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.15,.3),line(hx0,hy0+30,hx0+W,hy0+30,{color:CA,w:4})+label('0.5 m',hx0+W/2,hy0+62,{size:26,color:CA,anchor:'middle',weight:700}));
  s+=arrow(hx0+W,hy0,hx0+W,hy0-170,{color:CB,w:7,g:seg(p,.3,.5)})+fade(seg(p,.4,.55),label('4 N',hx0+W+16,hy0-100,{size:28,color:CB,weight:700}));
  s+=arc2(circPts(hx0,hy0,120,.15,1.3,30),{c1:CN,c2:CN,w:4,g:seg(p,.5,.65)});
  s+=card(680,120,460,240,label('トルク',910,180,{size:28,color:C.dim,anchor:'middle'})+T(`0.5\\times4=2\\ \\mathrm{N\\cdot m}`,910,260,{size:44,color:CN}),seg(p,.6,.75));
  return s;
 },
 [K+'enough']:(p)=>{
  let s=card(330,110,540,260,label('「2 N·m で 回す」',600,190,{size:40,color:CN,anchor:'middle',weight:700})
   +fade(seg(p,.35,.5),label('回し方は 一つに 決まる？',600,290,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'axes']:(p)=>{
  let s=floorBolt(290,330,{g:seg(p,.05,.2),arcG:seg(p,.15,.35)})+fade(seg(p,.15,.3),label('床のボルト',290,470,{size:28,color:C.ink,anchor:'middle',weight:700})+label('縦の軸',395,150,{size:26,color:CN,weight:700}));
  s+=wallBolt(880,270,{g:seg(p,.35,.5),arcG:seg(p,.45,.65)})+fade(seg(p,.45,.6),label('壁のボルト',880,470,{size:28,color:C.ink,anchor:'middle',weight:700})+label('横の軸',1000,215,{size:26,color:CN,weight:700}));
  s+=fade(seg(p,.7,.85),label('どちらも 2 N·m',600,60,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sense']:(p)=>{
  let s=wallBolt(300,260,{arcG:seg(p,.05,.3),ccw:1,axis:0})+fade(seg(p,.2,.35),label('左回り：ゆるむ',300,460,{size:28,color:CN,anchor:'middle',weight:700}));
  s+=wallBolt(900,260,{g:seg(p,.35,.45),arcG:seg(p,.4,.65),ccw:0,color:NG,axis:0})+fade(seg(p,.55,.7),label('右回り：締まる',900,460,{size:28,color:NG,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('同じ軸',600,260,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'info']:(p)=>{
  const rows=[['① 大きさ','2 N·m',C.ink],['② どの軸の 周りか','縦・横…',CN],['③ どちら回りか','左・右',CN]];
  let s=label('回転の 情報',600,70,{size:30,color:C.dim,anchor:'middle'});
  rows.forEach(([a,b,c],i)=>{const y=150+i*95;s+=card(250,y-50,700,80,label(a,300,y+2,{size:32,color:c,weight:700})+label(b,900,y+2,{size:28,color:C.dim,anchor:'end'}),seg(p,.05+i*.15,.2+i*.15));});
  s+=fade(seg(p,.7,.85),label('数 一つでは 足りない',600,475,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'arrow']:(p)=>{
  const cx=300,base=420,top=100;
  let s=poly([[cx-190,base+30],[cx+110,base+30],[cx+180,base-40],[cx-120,base-40]],{fill:'#1a2a48',fo:.7,stroke:C.grid,sw:2});
  s+=line(cx,base+60,cx,top-40,{color:C.dim,w:2,dash:'8 7'});
  s+=arrow(cx,base,cx,top,{color:CN,w:9,head:26,g:seg(p,.05,.25)});
  const pts=Array.from({length:31},(_,i)=>{const a=-0.5+2.4*i/30;return [cx+80*Math.cos(a),base-110+26*Math.sin(a)];});
  s+=arc2(pts,{c1:CN,c2:CN,w:4,g:seg(p,.6,.8)});
  s+=fade(seg(p,.25,.4),line(cx-40,base,cx-40,top,{color:C.hi,w:2})+line(cx-50,base,cx-30,base,{color:C.hi,w:2})+line(cx-50,top,cx-30,top,{color:C.hi,w:2})+label('長さ ＝ 大きさ',cx-56,(base+top)/2,{size:28,color:C.hi,weight:700,anchor:'end'}));
  s+=fade(seg(p,.4,.55),label('乗る線 ＝ 軸',cx+20,top-20,{size:28,color:C.dim,weight:700}));
  s+=fade(seg(p,.6,.8),label('指す端 ＝ 回る向き',cx+100,top+60,{size:28,color:CN,weight:700}));
  s+=card(720,190,430,200,label('答え ＝ 一本の 矢印',935,270,{size:34,color:C.ink,anchor:'middle',weight:700})+label('大きさ・軸・回る向き',935,330,{size:28,color:C.dim,anchor:'middle'}),seg(p,.8,.95));
  return s;
 },
 [K+'rule']:(p)=>{
  let s=paraScene(PP,{turn:seg(p,.2,.5),normal:seg(p,.55,.75),labN:AxB});
  s+=card(680,110,470,270,label('指す端は 右ねじの 約束',915,175,{size:30,color:C.ink,anchor:'middle',weight:700})
   +label('𝐀 から 𝐁 へ ねじを 回す',915,245,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.55,.7),label('→ ねじが 進む 向き',915,315,{size:30,color:CN,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 // ===== S3 空間で向きを決める =====
 [K+'space']:(p)=>{
  const ox=150,oy=360;
  let s=label('初級：画面の中',270,90,{size:26,color:C.dim,anchor:'middle'});
  s+=arrow(ox,oy,ox+220,oy,{color:CA,w:6})+T(bA,ox+236,oy+12,{size:36,anchor:'start'})+arrow(ox,oy,ox,oy-200,{color:CB,w:6})+T(bB,ox+16,oy-190,{size:36,anchor:'start'});
  s+=outSym(ox,oy,20)+label('⊙ 手前　⊗ 奥',270,450,{size:28,color:CN,anchor:'middle',weight:700});
  s+=fade(seg(p,.5,.7),line(560,80,560,470,{color:C.faint,w:2})+label('今回：空間',870,90,{size:26,color:C.hi,anchor:'middle',weight:700}));
  const P=view({ox:770,oy:360,u:130});
  s+=fade(seg(p,.55,.75),floor(P)+axes3(P,{zn:.7}));
  return s;
 },
 [K+'axes3']:(p)=>{
  let s=hatScene(p,{gx:seg(p,.35,.5),gy:seg(p,.45,.6)});
  s+=card(700,110,450,280,label('x：右',925,175,{size:30,color:HX,anchor:'middle',weight:700})+label('y：奥',925,235,{size:30,color:HY,anchor:'middle',weight:700})+label('z：上',925,295,{size:30,color:HZ,anchor:'middle',weight:700})
   +fade(seg(p,.5,.65),T(`${hx},\\ ${hy}`,835,352,{size:32})+label('：長さ1、床の上',870,360,{size:26,color:C.dim})),seg(p,0,.15));
  return s;
 },
 [K+'perp']:(p)=>{
  let s=hatScene(p,{perp:seg(p,.4,.6)});
  s+=card(700,110,450,280,label('答えの 矢印は',925,175,{size:28,color:C.ink,anchor:'middle'})+T(`\\perp\\ ${hx}\\quad\\perp\\ ${hy}`,925,245,{size:44})
   +fade(seg(p,.55,.7),label('縦の 直線 だけ',925,330,{size:32,color:CN,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'two']:(p)=>{
  let s=hatScene(p,{perp:1,two:seg(p,.1,.35)});
  s+=card(700,110,450,280,label('縦の 直線 の上で',925,175,{size:28,color:C.ink,anchor:'middle'})+label('上 か 下',925,245,{size:36,color:CN,anchor:'middle',weight:700})
   +fade(seg(p,.5,.65),label('右ねじで 選ぶ',925,325,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'turn']:(p)=>{
  let s=hatScene(p,{turn:seg(p,.1,.45),sc:1,rise:0,perp:.5});
  s+=topView(800,300,{g:seg(p,.45,.6),arcG:seg(p,.55,.75),sym:''});
  s+=fade(seg(p,.7,.85),label('反時計回り',1020,330,{size:28,color:C.hi,weight:700}));
  return s;
 },
 [K+'rise']:(p)=>{
  const r=seg(p,.05,.45);
  let s=hatScene(p,{turn:1,sc:1-seg(p,.55,.7),rise:.45*r,res:seg(p,.45,.7),resDir:1,resLab:`${hx}\\times${hy}`});
  s+=topView(800,300,{sym:'out',arcG:1});
  s+=fade(seg(p,.2,.35),label('ゆるむ → 上へ',1000,240,{size:28,color:C.hi,weight:700}));
  s+=fade(seg(p,.6,.75),label('⊙：上向き',1000,300,{size:28,color:CN,weight:700}));
  return s;
 },
 [K+'size']:(p)=>{
  let s=hatScene(p,{res:1,resDir:1,resLab:'',zhat:seg(p,.55,.7)});
  s+=card(640,100,520,300,label('大きさ',900,155,{size:26,color:C.dim,anchor:'middle'})+T(`1\\times1\\times\\sin90^\\circ=1`,900,215,{size:40})
   +fade(seg(p,.5,.65),T(`${hx}\\times${hy}=${hz}`,900,320,{size:54})),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'righthand']:(p)=>{
  let s=hatScene(p,{zhat:1});
  s+=card(640,100,520,300,T(`${hx}\\times${hy}=${hz}`,900,170,{size:46})
   +label('となる向きに z を取る',900,250,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.4,.55),label('右手系',900,340,{size:40,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 // ===== S4 順序を入れ替えると =====
 [K+'para']:(p)=>{
  let s=paraScene(PP,{gF:seg(p,.1,.3),normal:seg(p,.55,.8),labN:''});
  s+=fade(seg(p,.65,.8),label('法線',PP(0,0,2.1)[0]+22,PP(0,0,2.1)[1]+10,{size:30,color:CN,weight:700}));
  s+=card(700,110,450,270,label('A ＝ 3，B ＝ 2',925,175,{size:30,color:C.ink,anchor:'middle'})+label('平行四辺形',925,240,{size:32,color:CQ,anchor:'middle',weight:700})
   +fade(seg(p,.55,.7),label('面に垂直な 矢印 ＝ 法線',925,315,{size:28,color:CN,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'axb']:(p)=>{
  let s=paraScene(PP,{turn:seg(p,.05,.35),normal:seg(p,.4,.6),labN:AxB});
  s+=topView(820,300,{g:seg(p,.5,.65),n1:bA,n2:bB,c1:CA,c2:CB,second:65,sym:'out',arcG:seg(p,.55,.75)});
  s+=fade(seg(p,.7,.85),label('⊙ 手前',1000,330,{size:28,color:CN,weight:700}));
  return s;
 },
 [K+'bxa']:(p)=>{
  let s=paraScene(PP,{turn:seg(p,.05,.35),rev:1,normal:seg(p,.4,.6),dir:-1,labN:BxA});
  s+=topView(820,300,{g:seg(p,.5,.65),n1:bA,n2:bB,c1:CA,c2:CB,second:65,rev:1,sym:'in',arcG:seg(p,.55,.75)});
  s+=fade(seg(p,.7,.85),label('⊗ 奥',1000,330,{size:28,color:CN,weight:700}));
  return s;
 },
 [K+'same']:(p)=>{
  const P1=view({ox:170,oy:270,u:55,...FL}),P2=view({ox:730,oy:270,u:55,...FL});
  let s=paraScene(P1,{normal:1,labN:AxB,nScale:.45})+paraScene(P2,{normal:1,dir:-1,labN:BxA,nScale:.45});
  s+=fade(seg(p,.2,.4),label('面積 同じ → 長さ 同じ',600,490,{size:30,color:CQ,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('向きだけ 逆',600,60,{size:32,color:CN,anchor:'middle',weight:700}));
  return s;
 },
 [K+'minus']:(p)=>{
  let s=card(80,90,440,260,T(AxB,300,160,{size:48})+outSym(300,245,28)+label('上（真上から ⊙）',300,320,{size:26,color:CN,anchor:'middle'}));
  s+=card(680,90,440,260,T(BxA,900,160,{size:48})+inSym(900,245,28)+label('下（真上から ⊗）',900,320,{size:26,color:CN,anchor:'middle'}));
  s+=fade(seg(p,.1,.3),T(`${BxA}=-\\,${AxB}`,600,440,{size:56}));
  s+=fade(seg(p,.1,.3),highlight(330,395,540,90,1,C.hi));
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=hatScene(p,{res:1,resDir:1,resLab:`${hx}\\times${hy}`});
  s+=card(640,100,520,300,label('分かっていること',900,155,{size:26,color:C.dim,anchor:'middle'})+T(`${hx}\\times${hy}=${hz}`,900,215,{size:44})
   +fade(seg(p,.3,.45),T(`${hy}\\times${hx}=\\ ?`,900,315,{size:50})),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'quizans']:(p)=>{
  let s=hatScene(p,{turn:seg(p,.05,.35),rev:1,sc:1-seg(p,.7,.8),rise:-.4*seg(p,.35,.6),res:seg(p,.6,.8),resDir:-1,resLab:`${hy}\\times${hx}`});
  s+=topView(800,300,{g:seg(p,.3,.45),rev:1,sym:'in',arcG:seg(p,.35,.55)});
  s+=fade(seg(p,.4,.55),label('時計回り',1000,240,{size:28,color:C.hi,weight:700}));
  s+=fade(seg(p,.75,.9),T(`=-${hz}`,1000,320,{size:40,anchor:'start'}));
  return s;
 },
 [K+'num']:(p)=>{
  const P=view({ox:130,oy:360,u:95,...FL});
  let s=paraScene(P,{deg:90,grid:1,thetaG:0});
  const c0=P(0,0,0);s+=fade(seg(p,.5,.65),draw([P(.22,0,0),P(.22,.22,0),P(0,.22,0)],1,{color:C.ink,w:2.5}));
  s+=card(680,110,470,270,T(`${bA}=3\\,${hx}`,915,180,{size:40})+T(`${bB}=2\\,${hy}`,915,250,{size:40})
   +fade(seg(p,.5,.65),label('直角',915,335,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'num2']:(p)=>{
  const P=view({ox:130,oy:330,u:62,...FL});
  let s=paraScene(P,{deg:90,grid:1,thetaG:0,normal:seg(p,.45,.65),labN:'',nScale:.4});
  for(let i=0;i<3;i++)for(let j=0;j<2;j++){const k=i+3*j,g=seg(p,.05+k*.05,.1+k*.05),c=P(i+.5,j+.5,0);s+=fade(g,label(String(k+1),c[0],c[1]+9,{size:24,color:C.hi,anchor:'middle',weight:700}));}
  s+=fade(seg(p,.6,.7),T(`6\\,${hz}`,P(0,0,2.4)[0]-16,P(0,0,2.4)[1]+6,{size:34,anchor:'end'}));
  s+=card(640,100,520,310,T(`3\\times2\\times\\sin90^\\circ=6`,900,170,{size:40,color:CQ})
   +fade(seg(p,.3,.45),label('向き：上',900,245,{size:30,color:CN,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),T(`${AxB}=6\\,${hz}`,900,340,{size:48})),seg(p,0,.12));
  return s;
 },
 [K+'num3']:(p)=>{
  const P=view({ox:130,oy:330,u:62,...FL});
  let s=paraScene(P,{deg:90,grid:1,thetaG:0,normal:1,labN:'',nScale:.4})+T(`6\\,${hz}`,P(0,0,2.4)[0]-16,P(0,0,2.4)[1]+6,{size:34,anchor:'end'});
  s+=fade(seg(p,.15,.35),V3(P,[0,0,0],[0,0,-2.4],{color:CN,w:8,head:22})+T(`-6\\,${hz}`,P(0,0,-2.4)[0]-16,P(0,0,-2.4)[1]+14,{size:34,anchor:'end'}));
  s+=card(640,100,520,310,T(`${AxB}=6\\,${hz}`,900,190,{size:48})
   +fade(seg(p,.3,.45),T(`${BxA}=-6\\,${hz}`,900,300,{size:48})),seg(p,0,.12));
  return s;
 },
 // ===== S5 内積とくらべる =====
 ...(()=>{
  const rows=[['答え','数','矢印'],['順序を 入れ替えると','同じ','符号が 反転'],['直角のとき','0','最大 AB'],['平行のとき','最大 AB','0']];
  const X0=110,X1=560,X2=880,Y0=90,DY=78;
  function table(n,p,hl=-1){
   let s=label('内積',X1,Y0,{size:32,color:C.F,anchor:'middle',weight:700})+label('外積',X2,Y0,{size:32,color:CN,anchor:'middle',weight:700});
   s+=T(`${bA}\\cdot${bB}`,X1,Y0+36,{size:28})+T(AxB,X2,Y0+36,{size:28});
   s+=line(X0,Y0+62,1100,Y0+62,{color:C.faint,w:2});
   rows.forEach(([a,b,c],i)=>{if(i>=n)return;const y=Y0+62+DY*(i+.62),g=i===n-1?seg(p,.05,.25):1;
    s+=fade(g,(i===hl?highlight(X0-10,y-40,1000,62,1,C.hi):'')+label(a,X0,y+8,{size:28,color:C.dim})+label(b,X1,y+8,{size:30,color:C.ink,anchor:'middle',weight:700})+label(c,X2,y+8,{size:30,color:i===1?C.hi:C.ink,anchor:'middle',weight:700}));});
   return s;
  }
  return {
   [K+'table']:(p)=>table(1,p),
   [K+'order']:(p)=>table(2,p)+fade(seg(p,.3,.45),T(`${bB}\\cdot${bA}=${bA}\\cdot${bB}`,X1,Y0+62+DY*1.62+44,{size:26})+T(`${BxA}=-${AxB}`,X2,Y0+62+DY*1.62+44,{size:26})),
   [K+'perpcol']:(p)=>table(3,p),
   [K+'parcol']:(p)=>table(4,p),
   [K+'hats']:(p)=>{
    let s=card(80,110,500,300,T(hx,285,160,{size:36})+label('どうし',305,170,{size:30,color:C.ink,weight:700})
     +T(`${hx}\\cdot${hx}=1`,330,250,{size:42})+T(`${hx}\\times${hx}=0`,330,340,{size:42}),seg(p,0,.15));
    s+=card(620,110,500,300,T(hx,835,160,{size:36})+label('と',870,170,{size:30,color:C.ink,anchor:'middle',weight:700})+T(hy,905,160,{size:36})
     +T(`${hx}\\cdot${hy}=0`,870,250,{size:42})+T(`${hx}\\times${hy}=${hz}`,870,340,{size:42}),seg(p,.45,.6));
    s+=fade(seg(p,.1,.2),label('内積',60,250,{size:22,color:C.F,anchor:'end'})+label('外積',60,340,{size:22,color:CN,anchor:'end'}));
    return s;
   },
   [K+'use']:(p)=>{
    let s=card(80,110,500,300,label('揃った部分を 掛ける',330,180,{size:30,color:C.ink,anchor:'middle',weight:700})+label('例：仕事',330,250,{size:28,color:C.dim,anchor:'middle'})+label('→ 内積',330,340,{size:36,color:C.F,anchor:'middle',weight:700}),seg(p,0,.15));
    s+=card(620,110,500,300,label('直角な部分で 回す',870,180,{size:30,color:C.ink,anchor:'middle',weight:700})+label('例：レンチ',870,250,{size:28,color:C.dim,anchor:'middle'})+label('→ 外積',870,340,{size:36,color:CN,anchor:'middle',weight:700}),seg(p,.45,.6));
    return s;
   },
  };
 })(),
 // ===== S6 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  let s=paraScene(PP,{turn:1,normal:1,labN:AxB});
  s+=card(680,90,470,340,label('まとめ ①',915,140,{size:26,color:C.dim,anchor:'middle'})
   +label('回転：軸と 回る向き → 矢印',915,200,{size:26,color:C.ink,anchor:'middle'})
   +fade(seg(p,.35,.5),label('長さ ＝ 平行四辺形の 面積',915,270,{size:26,color:CQ,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),label('向き：両方に 垂直，右ねじ',915,340,{size:26,color:CN,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(330,100,540,300,label('まとめ ②',600,150,{size:26,color:C.dim,anchor:'middle'})+T(`${BxA}=-${AxB}`,600,230,{size:46})
   +fade(seg(p,.4,.55),T(`${hy}\\times${hx}=-${hz}`,600,330,{size:46})),seg(p,0,.12));
  return s;
 },
 [K+'next1']:(p)=>{
  const P=view({ox:230,oy:300,u:140});
  let s=floor(P)+axes3(P);
  s+=V3(P,[0,0,0],[1.25,-.35,.55],{color:CA,w:7,head:20,g:seg(p,.05,.25)})+V3(P,[0,0,0],[.3,-.4,1],{color:CB,w:7,head:20,g:seg(p,.15,.35)});
  s+=fade(seg(p,.3,.45),label('？',P(0,0,0)[0]-40,P(0,0,0)[1]-60,{size:48,color:C.hi,anchor:'middle',weight:700}));
  s+=card(680,150,460,200,label('斜めの 矢印どうし',910,220,{size:30,color:C.ink,anchor:'middle'})+label('毎回 右ねじ？ 大変',910,290,{size:32,color:C.a,anchor:'middle',weight:700}),seg(p,.4,.55));
  return s;
 },
 [K+'next2']:(p)=>{
  let s=hatScene(p,{zhat:1});
  s+=card(640,100,520,300,label('次の問い',900,160,{size:26,color:C.dim,anchor:'middle'})+label('基本の 3方向 だけで',900,230,{size:32,color:C.ink,anchor:'middle'})
   +label('計算の 約束を 作れる？',900,300,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
};

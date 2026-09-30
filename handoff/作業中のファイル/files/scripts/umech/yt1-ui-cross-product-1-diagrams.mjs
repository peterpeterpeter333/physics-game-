// YouTube シリーズ 外積・初級 1/2（ステージ ui-cross-product 本1＋ドアの例題）— 図。Stage 1200×515.
// 色：力 F 緑、柄に平行な部分（cos）青、柄に直角な部分（sin）黄、腕 r 水色、角 θ 橙、トルク N 桃。
// 回転の向き：柄は右向き・力は上向き → 画面上で反時計回り（2/2 の右ねじ ⊙ と一致）。
import {C,clamp,mix,smooth,seg,fmt,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,tex,texWidth,poly,block,ground} from './anim.mjs';

const K='ui-cross-product-1:';
const CP='#8fb8ff',CQ=C.hi,CT=C.E,CR=C.x,CN=C.p;
const RAD=Math.PI/180;
// ベクトルの名前は太字（tex の \mathbf）。長さ・大きさは細字のまま。
const vl=(s,x,y,{size=30,color=C.ink,anchor='start'}={})=>tex(`\\mathbf{${s}}`,x,y,{size:size+6,color,anchor,auto:false});
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('○',x,y,{size:34,color:C.F,weight:700}));
const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:34,color:C.a,weight:700}));
const TH0=Math.atan2(8,6); // 6・8・10 の角（約 53°）
const TQ=`{\\color{${CT}}\\theta}`;

// ---- wrench ----------------------------------------------------------------------------------
const W0={cx:150,cy:330,L:310,k:19}; // k = px per newton
const tipOf=(ang,{cx=W0.cx,cy=W0.cy,L=W0.L}={})=>[cx+L*Math.cos(ang),cy-L*Math.sin(ang)];
function hexagon(cx,cy,r,rot){return Array.from({length:6},(_,i)=>{const a=rot+i*Math.PI/3;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});}
function wrench(ang=0,{cx=W0.cx,cy=W0.cy,L=W0.L,g=1,axis=1,pt=1}={}){
 const deg=-ang/RAD;
 let s=`<g transform="rotate(${deg.toFixed(2)} ${cx} ${cy})">`
  +rect(cx+36,cy-15,L-12,30,{fill:'#2c3854',fo:1,stroke:C.dim,sw:2.5,rx:14})
  +ring(cx,cy,54,{color:C.dim,w:4,fill:'#2c3854'})+`</g>`;
 s+=poly(hexagon(cx,cy,32,ang),{fill:'#46526e',fo:1,stroke:C.ink,sw:2.5});
 s+=ring(cx,cy,13,{color:C.ink,w:2.5,fill:'#1b2338'});
 // a mark on the bolt so its turning is visible
 s+=line(cx,cy,cx+26*Math.cos(ang+Math.PI/2),cy-26*Math.sin(ang+Math.PI/2),{color:C.ink,w:3});
 if(axis)s+=dot(cx,cy,5,C.hi)+label('軸',cx-18,cy+86,{size:24,color:C.dim,anchor:'middle'});
 if(pt){const [tx,ty]=tipOf(ang,{cx,cy,L});s+=dot(tx,ty,8,C.ink);}
 return fade(g,s);
}
// counter-clockwise turning arc around (cx,cy) from angle a0 to a1 (radians)
function turnArc(cx,cy,r,a0,a1,{color=C.hi,w=4,g=1}={}){
 if(g<=0||a1-a0<.02)return '';
 const P=a=>[cx+r*Math.cos(a),cy-r*Math.sin(a)],n=30;
 const pts=Array.from({length:n+1},(_,i)=>P(a0+(a1-a0)*i/n));
 const [ex,ey]=P(a1),tx=-Math.sin(a1),ty=-Math.cos(a1),h=16;
 const head=`<polygon points="${ex+tx*h},${ey+ty*h} ${ex+ty*h*.55},${ey-tx*h*.55} ${ex-ty*h*.55},${ey+tx*h*.55}" fill="${color}"/>`;
 return fade(g,draw(pts,1,{color,w})+head);
}
// force at the tip: direction ang+th, magnitude F (N). push=true draws the arrow ending at the tip.
function force(ang,th,F,{g=1,push=false,color=C.F,text='',w=6,cx=W0.cx,cy=W0.cy,L=W0.L,k=W0.k}={}){
 const [tx,ty]=tipOf(ang,{cx,cy,L}),d=ang+th,dx=k*F*Math.cos(d),dy=-k*F*Math.sin(d);
 if(push)return arrow(tx-dx-16*Math.cos(d),ty-dy+16*Math.sin(d),tx-16*Math.cos(d),ty+16*Math.sin(d),{color,w,g,text,tdx:-60,tdy:-20});
 return arrow(tx,ty,tx+dx,ty+dy,{color,w,g});
}
// components of the force: parallel (cos) and perpendicular (sin) as arrows from the tip
function parts(ang,th,F,{gp=1,gq=1,dash=1,cx=W0.cx,cy=W0.cy,L=W0.L,k=W0.k}={}){
 const [tx,ty]=tipOf(ang,{cx,cy,L}),c=Math.cos(th)*F*k,sn=Math.sin(th)*F*k;
 const px=tx+c*Math.cos(ang),py=ty-c*Math.sin(ang),qx=tx+sn*Math.cos(ang+Math.PI/2),qy=ty-sn*Math.sin(ang+Math.PI/2);
 const fx=px+qx-tx,fy=py+qy-ty;
 let s=fade(dash*Math.min(gp,gq),line(px,py,fx,fy,{color:C.dim,w:2,dash:'6 6'})+line(qx,qy,fx,fy,{color:C.dim,w:2,dash:'6 6'}));
 s+=arrow(tx,ty,px,py,{color:CP,w:6,g:gp})+arrow(tx,ty,qx,qy,{color:CQ,w:6,g:gq});
 return {svg:s,px,py,qx,qy,fx,fy,tx,ty};
}
function thetaArc(ang,th,{g=1,r=46,text='θ',cx=W0.cx,cy=W0.cy,L=W0.L,ext=1}={}){
 const [tx,ty]=tipOf(ang,{cx,cy,L});
 let s=fade(ext,line(tx,ty,tx+120*Math.cos(ang),ty-120*Math.sin(ang),{color:C.dim,w:2,dash:'5 6'}));
 if(th>.03){const pts=Array.from({length:25},(_,i)=>{const a=ang+th*i/24;return [tx+r*Math.cos(a),ty-r*Math.sin(a)];});
  s+=draw(pts,1,{color:CT,w:3.5});const a=ang+th/2;s+=label(text,tx+(r+22)*Math.cos(a),ty-(r+22)*Math.sin(a)+9,{size:26,color:CT,anchor:'middle',weight:700});}
 return fade(g,s);
}
const armBrace=(g=1,text='r')=>fade(g,line(W0.cx,W0.cy+62,W0.cx+W0.L,W0.cy+62,{color:CR,w:4})+line(W0.cx,W0.cy+50,W0.cx,W0.cy+74,{color:CR,w:3})+line(W0.cx+W0.L,W0.cy+50,W0.cx+W0.L,W0.cy+74,{color:CR,w:3})+label(text,W0.cx+W0.L/2+60,W0.cy+100,{size:30,color:CR,anchor:'middle',weight:700}));

// ---- recap: box, force, shadow on the floor ---------------------------------------------------
function recapScene(thDeg,{g=1,shadowG=1}={}){
 const gy=400,bx=250,th=thDeg*RAD,Lf=170;
 let s=ground(60,620,gy)+block(bx,gy,110,80,{color:C.x,fo:.25});
 const ox=bx+55,oy=gy-40,fx=ox+Lf*Math.cos(th),fy=oy-Lf*Math.sin(th);
 s+=arrow(ox,oy,fx,fy,{color:C.F,w:6})+vl('F',fx+10,fy-6,{size:28,color:C.F});
 // light from above
 for(let i=0;i<4;i++){const x=ox+10+i*45;s+=fade(.5*shadowG,arrow(x,60,x,100,{color:C.hi,w:2,head:10}));}
 s+=fade(shadowG,line(fx,fy,fx,gy,{color:C.dim,w:2,dash:'6 6'}));
 s+=fade(shadowG,line(ox,gy+2,fx,gy+2,{color:CP,w:10})+label(thDeg>85?'影 ＝ 0':`影 ＝ F cosθ`,Math.max(ox,(ox+fx)/2-20),gy+44,{size:26,color:CP}));
 s+=arrow(bx-60,gy-110,bx+60,gy-110,{color:C.x,w:3,head:12})+label('動く向き',bx,gy-124,{size:22,color:C.x,anchor:'middle'});
 return fade(g,s);
}

export const ytUiCrossProduct1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=recapScene(40,{shadowG:seg(p,.15,.35)});
  s+=card(680,120,480,250,label('前回：内積',920,170,{size:28,color:C.dim,anchor:'middle'})
   +tex(`W=F\\,L\\cos${TQ}`,920,250,{size:50,auto:false,color:C.ink})
   +label('影の長さ × 動いた距離',920,320,{size:28,color:CP,anchor:'middle'}),seg(p,.45,.6));
  return s;
 },
 [K+'recap2']:(p)=>{
  const th=40+50*seg(p,.1,.6);
  let s=recapScene(th);
  s+=card(680,120,480,250,label('前回：内積',920,170,{size:28,color:C.dim,anchor:'middle'})
   +tex(`W=F\\,L\\cos${TQ}`,920,250,{size:50,auto:false,color:C.ink})
   +fade(seg(p,.6,.75),label('直角なら 影 0 → 仕事 0',920,320,{size:30,color:C.a,anchor:'middle',weight:700})));
  return s;
 },
 [K+'ask']:(p)=>{
  let s=card(60,60,500,200,label('内積',310,110,{size:30,color:C.dim,anchor:'middle'})+label('そろった部分（影）が効く',310,170,{size:30,color:CP,anchor:'middle',weight:700})+tex(`\\cos${TQ}`,310,225,{size:40,auto:false,color:CP}),seg(p,0,.15));
  s+=card(640,60,500,200,label('今回',890,110,{size:30,color:C.dim,anchor:'middle'})+label('直角な部分だけが効く',890,170,{size:30,color:CQ,anchor:'middle',weight:700})+label('どんな掛け算？',890,228,{size:30,color:C.hi,anchor:'middle'}),seg(p,.25,.4),C.hi);
  s+=fade(seg(p,.5,.7),arrow(575,160,625,160,{color:C.dim,w:3,head:12}));
  s+=fade(seg(p,.55,.8),move0(wrench(0,{cx:520,cy:400,L:200,axis:0,pt:0})+force(0,Math.PI/2,6,{cx:520,cy:400,L:200,k:12})));
  return s;
 },
 [K+'wrench']:(p)=>{
  const ang=24*RAD*seg(p,.45,.9);
  let s=wrench(ang,{g:seg(p,0,.2)});
  s+=fade(seg(p,.3,.45),force(ang,Math.PI/2,8));
  s+=turnArc(W0.cx,W0.cy,100,.3,.3+ang*2.5,{g:seg(p,.5,.6)});
  s+=card(700,120,450,190,label('レンチ',925,175,{size:32,color:C.ink,anchor:'middle',weight:700})+label('ボルトにはめて 柄の先を押す',925,240,{size:28,color:C.dim,anchor:'middle'}),seg(p,.1,.25));
  return s;
 },
 [K+'arm']:(p)=>{
  let s=wrench(0);
  s+=fade(seg(p,.05,.25),ring(W0.cx,W0.cy,22,{color:C.hi,w:3}));
  s+=armBrace(seg(p,.45,.65));
  s+=card(700,120,450,230,label('軸 ＝ ボルトの中心',925,180,{size:30,color:C.hi,anchor:'middle'})
   +fade(seg(p,.5,.7),label('r：軸から押す点までの長さ',925,250,{size:28,color:CR,anchor:'middle'})+label('[m]',925,300,{size:26,color:C.dim,anchor:'middle'})),seg(p,.05,.2));
  return s;
 },
 // ===== S2 柄に沿った力 =====
 [K+'along']:(p)=>{
  let s=wrench(0)+armBrace(1);
  s+=force(0,Math.PI,8,{push:true,g:seg(p,.2,.5)});
  s+=fade(seg(p,.3,.5),label('柄に沿って 軸へ押す',540,240,{size:28,color:C.F}));
  s+=card(760,330,390,110,label('ボルトは 回る？',955,398,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'along2']:(p)=>{
  const pull=seg(p,.5,.65),push=1-pull;
  let s=wrench(0)+armBrace(1);
  s+=fade(push,force(0,Math.PI,8,{push:true}));
  s+=fade(pull,force(0,0,8));
  s+=fade(push,label('押す',560,280,{size:28,color:C.F}))+fade(pull,label('引っ張る',540,280,{size:28,color:C.F}));
  s+=card(760,140,390,300,label('回らない',955,205,{size:34,color:C.a,anchor:'middle',weight:700})
   +label('押しても',955,275,{size:28,color:C.dim,anchor:'middle'})+fade(pull,label('引っ張っても',955,325,{size:28,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.2,.35),label('柄を 押し込むだけ',955,395,{size:28,color:C.ink,anchor:'middle'})),seg(p,.05,.2),C.a);
  return s;
 },
 [K+'perp']:(p)=>{
  const ang=30*RAD*seg(p,.45,.95);
  let s=wrench(ang)+fade(1-seg(p,.4,.5),armBrace(1));
  s+=force(ang,Math.PI/2,8,{g:seg(p,.05,.3)});
  s+=turnArc(W0.cx,W0.cy,100,.25,.25+2.6*ang,{g:seg(p,.45,.55)});
  s+=card(760,140,390,200,label('柄に 直角に押す',955,205,{size:30,color:C.F,anchor:'middle'})+fade(seg(p,.45,.6),label('よく回る',955,275,{size:34,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=wrench(0)+force(0,TH0,10,{g:seg(p,.05,.3)});
  s+=card(720,140,430,230,label('斜めに押すと',935,205,{size:32,color:C.ink,anchor:'middle'})+label('どうなる？',935,265,{size:34,color:C.hi,anchor:'middle',weight:700})+label('予想してみよう',935,330,{size:26,color:C.dim,anchor:'middle'}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'split']:(p)=>{
  const pr=parts(0,TH0,10,{gp:seg(p,.15,.35),gq:seg(p,.3,.5)});
  let s=wrench(0)+pr.svg+force(0,TH0,10,{color:C.F});
  s+=fade(seg(p,.15,.35),label('平行な部分',pr.px-10,pr.py+40,{size:26,color:CP,anchor:'end'}));
  s+=fade(seg(p,.3,.5),label('直角な部分',pr.qx-16,pr.qy+10,{size:26,color:CQ,anchor:'end'}));
  s+=card(700,150,460,210,label('前回の「影」と 同じ分け方',930,215,{size:28,color:C.dim,anchor:'middle'})
   +label('平行 ＋ 直角',930,285,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.6,.75));
  return s;
 },
 [K+'which']:(p)=>{
  const pr=parts(0,TH0,10);
  let s=wrench(0)+pr.svg+fade(.35,force(0,TH0,10));
  s+=label('平行な部分',pr.px-10,pr.py+40,{size:26,color:CP,anchor:'end'})+label('直角な部分',pr.qx-16,pr.qy+10,{size:26,color:CQ,anchor:'end'});
  s+=card(700,110,460,300,
   label('平行な部分',790,180,{size:30,color:CP})+label('回さない',1090,180,{size:30,color:C.a,anchor:'end',weight:700})+ng(1110,183)
   +fade(seg(p,.45,.6),label('直角な部分',790,270,{size:30,color:CQ})+label('回す',1090,270,{size:30,color:C.hi,anchor:'end',weight:700})+ok(1104,273))
   ,seg(p,.05,.2));
  s+=turnArc(W0.cx,W0.cy,100,.25,1.3,{g:seg(p,.55,.7)});
  return s;
 },
 // ===== S3 直角な部分は F sinθ =====
 [K+'theta']:(p)=>{
  let s=wrench(0)+force(0,TH0,10)+vl('F',W0.cx+W0.L+30,W0.cy-110,{size:30,color:C.F});
  s+=thetaArc(0,TH0,{g:seg(p,.2,.5)});
  s+=card(700,150,460,200,label('θ：柄の向きと',930,215,{size:30,color:CT,anchor:'middle'})+label('力の向きの 間の角',930,265,{size:30,color:CT,anchor:'middle'}),seg(p,.3,.45));
  return s;
 },
 [K+'tri']:(p)=>{
  const pr=parts(0,TH0,10,{gp:1,gq:0,dash:0});
  let s=wrench(0);
  s+=fade(seg(p,.05,.25),poly([[pr.tx,pr.ty],[pr.px,pr.py],[pr.fx,pr.fy]],{fill:C.F,fo:.12}));
  s+=pr.svg+force(0,TH0,10)+thetaArc(0,TH0,{ext:0});
  s+=fade(seg(p,.05,.25),line(pr.px-14,pr.py,pr.px-14,pr.py-14,{color:C.dim,w:2})+line(pr.px-14,pr.py-14,pr.px,pr.py-14,{color:C.dim,w:2}));
  s+=fade(seg(p,.1,.25),label('斜辺 F',pr.tx+10,pr.fy+34,{size:24,color:C.F,anchor:'end'}));
  s+=line(pr.px,pr.py,pr.fx,pr.fy,{color:CQ,w:7*seg(p,.45,.6)+.01});
  s+=fade(seg(p,.45,.6),label('向かいの辺',pr.fx+14,(pr.py+pr.fy)/2+8,{size:24,color:CQ}));
  s+=card(760,130,400,250,label('向かいの辺 ＝',960,195,{size:28,color:CQ,anchor:'middle'})+label('柄に 直角な部分',960,245,{size:30,color:CQ,anchor:'middle',weight:700})
   +label('（直角三角形の 縦の辺）',960,305,{size:24,color:C.dim,anchor:'middle'}),seg(p,.6,.75));
  return s;
 },
 [K+'sin']:(p)=>{
  const pr=parts(0,TH0,10,{gp:1,gq:0,dash:0});
  let s=wrench(0)+fade(.12,poly([[pr.tx,pr.ty],[pr.px,pr.py],[pr.fx,pr.fy]],{fill:C.F,fo:1}))+pr.svg+force(0,TH0,10)+thetaArc(0,TH0,{ext:0});
  s+=line(pr.px,pr.py,pr.fx,pr.fy,{color:CQ,w:7});
  s+=card(740,110,420,300,
   label('向かいの辺 ＝ 斜辺 × sin θ',950,170,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.35,.55),tex(`{\\color{${CQ}}\\text{直角な部分}}`,950,240,{size:34,auto:false})),seg(p,.05,.2));
  s+=fade(seg(p,.4,.6),tex(`=F\\sin${TQ}`,950,330,{size:58,auto:false,color:CQ}))+highlight(820,280,260,90,seg(p,.6,.75));
  return s;
 },
 [K+'cos']:(p)=>{
  const pr=parts(0,TH0,10);
  let s=wrench(0)+pr.svg+force(0,TH0,10)+thetaArc(0,TH0,{ext:0});
  s+=card(680,70,230,300,label('平行',795,120,{size:30,color:CP,anchor:'middle',weight:700})+tex(`F\\cos${TQ}`,795,195,{size:40,auto:false,color:CP})
   +label('内積で使った',795,265,{size:24,color:C.dim,anchor:'middle'})+label('（影）',795,305,{size:24,color:C.dim,anchor:'middle'}),seg(p,.05,.3),CP);
  s+=card(930,70,230,300,label('直角',1045,120,{size:30,color:CQ,anchor:'middle',weight:700})+tex(`F\\sin${TQ}`,1045,195,{size:40,auto:false,color:CQ})
   +label('回すのに',1045,265,{size:24,color:C.dim,anchor:'middle'})+label('効く',1045,305,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.55,.7),highlight(676,66,238,308,1,CP));
  return s;
 },
 [K+'num']:(p)=>{
  const pr=parts(0,TH0,10,{gp:seg(p,.3,.45),gq:seg(p,.45,.6)});
  let s=wrench(0)+pr.svg+force(0,TH0,10);
  s+=fade(seg(p,.05,.2),label('10 N',pr.fx+14,pr.fy-6,{size:28,color:C.F,weight:700}));
  s+=fade(seg(p,.3,.45),label('6 N',(pr.tx+pr.px)/2,pr.py+40,{size:28,color:CP,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),label('8 N',pr.qx-14,(pr.ty+pr.qy)/2+10,{size:28,color:CQ,anchor:'end',weight:700}));
  s+=card(720,130,430,230,label('6・8・10 の 三角形',935,190,{size:30,color:C.ink,anchor:'middle',weight:700})
   +tex('6^2+8^2=10^2',935,270,{size:40,auto:false,color:C.dim})+label('（前回と 同じ）',935,330,{size:24,color:C.dim,anchor:'middle'}),seg(p,.65,.8));
  return s;
 },
 [K+'num2']:(p)=>{
  const pr=parts(0,TH0,10);
  let s=wrench(0)+pr.svg+fade(.4,force(0,TH0,10))+thetaArc(0,TH0,{ext:0});
  s+=label('8 N',pr.qx-14,(pr.ty+pr.qy)/2+10,{size:28,color:CQ,anchor:'end',weight:700})+label('6 N',(pr.tx+pr.px)/2,pr.py+40,{size:28,color:CP,anchor:'middle'});
  s+=card(700,100,460,320,label('回すのに効く：8 N だけ',930,160,{size:30,color:CQ,anchor:'middle',weight:700})
   +fade(seg(p,.4,.55),tex(`10\\,\\mathrm{N}\\times\\sin${TQ}=8\\,\\mathrm{N}`,930,250,{size:40,auto:false}))
   +fade(seg(p,.65,.8),tex(`\\sin${TQ}=0.8`,930,340,{size:46,auto:false,color:CQ})),seg(p,.05,.2));
  return s;
 },
 [K+'dial']:(p)=>{
  const th=TH0+(Math.PI/2-TH0)*seg(p,.3,.9);
  return dialScene(th,p);
 },
 [K+'dial2']:(p)=>{
  // 90° → 0° → 180° → 90°... keep simple: sweep 90°→0°, then 0°→180°
  const th=p<.25?Math.PI/2*(1-seg(p,0,.22)):Math.PI*seg(p,.28,.9);
  return dialScene(th,p,true);
 },
 // ===== S4 トルク =====
 [K+'long']:(p)=>{
  const ang=18*RAD*seg(p,.35,.9);
  const a1=ang*.5,a2=ang;
  let s=wrench(a1,{cx:140,cy:140,L:150,axis:0})+force(a1,Math.PI/2,5,{cx:140,cy:140,L:150,k:14});
  s+=wrench(a2,{cx:140,cy:390,L:320,axis:0})+force(a2,Math.PI/2,5,{cx:140,cy:390,L:320,k:14});
  s+=turnArc(140,140,80,.3,.3+a1*3,{g:seg(p,.35,.45)})+turnArc(140,390,80,.3,.3+a2*3,{g:seg(p,.35,.45)});
  s+=label('短い柄',140+150+60,150,{size:26,color:C.dim})+label('長い柄',140+320+60,400,{size:26,color:C.dim});
  s+=card(720,150,440,220,label('同じ力でも',940,210,{size:30,color:C.ink,anchor:'middle'})+label('長い柄の方が 楽に回る',940,275,{size:32,color:C.hi,anchor:'middle',weight:700})
   +label('（てこと同じ）',940,330,{size:24,color:C.dim,anchor:'middle'}),seg(p,.5,.65));
  return s;
 },
 [K+'def']:(p)=>{
  const pr=parts(0,TH0,10,{gp:0,gq:1,dash:0});
  let s=wrench(0)+armBrace(seg(p,.05,.25))+pr.svg+fade(.35,force(0,TH0,10));
  s+=label('F sinθ',pr.qx-14,(pr.ty+pr.qy)/2+10,{size:26,color:CQ,anchor:'end',weight:700});
  s+=card(700,100,460,320,label('回す効き目',930,160,{size:30,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.15,.35),tex(`{\\color{${CR}}r}\\times {\\color{${CQ}}F\\sin\\theta}`,930,240,{size:46,auto:false}))
   +fade(seg(p,.2,.35),label('柄の長さ × 直角な部分',930,305,{size:26,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.65,.8),label('＝ トルク（こう決める）',930,380,{size:30,color:CN,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'sym']:(p)=>{
  const pr=parts(0,TH0,10,{gp:0,gq:1,dash:0});
  let s=wrench(0)+armBrace(1)+pr.svg+fade(.35,force(0,TH0,10));
  s+=turnArc(W0.cx,W0.cy,100,.25,1.3,{color:CN,g:seg(p,.1,.3)});
  s+=card(700,100,460,320,label('トルク',930,160,{size:30,color:CN,anchor:'middle',weight:700})
   +tex(`{\\color{${CN}}N}={\\color{${CR}}r}\\,{\\color{${CQ}}F\\sin\\theta}`,930,250,{size:54,auto:false})
   +fade(seg(p,.55,.7),label('単位：N·m（ニュートン メートル）',930,340,{size:25,color:C.ink,anchor:'middle'})),seg(p,0,.15),CN);
  return s;
 },
 [K+'unit']:(p)=>{
  let s=card(60,90,520,300,label('仕事',320,150,{size:30,color:C.E,anchor:'middle',weight:700})+tex(`W=F\\,L\\cos${TQ}`,320,225,{size:44,auto:false})
   +label('N·m ＝ J（ジュール）',320,295,{size:28,color:C.ink,anchor:'middle'})+label('エネルギー',320,350,{size:26,color:C.dim,anchor:'middle'}),seg(p,0,.2),C.E);
  s+=card(620,90,520,300,label('トルク',880,150,{size:30,color:CN,anchor:'middle',weight:700})+tex(`{\\color{${CN}}N}={\\color{${CR}}r}\\,{\\color{${CQ}}F\\sin\\theta}`,880,225,{size:44,auto:false})
   +label('N·m のまま',880,295,{size:28,color:C.ink,anchor:'middle'})+fade(seg(p,.5,.7),label('回す効き目：J とは呼ばない',880,350,{size:26,color:C.hi,anchor:'middle'})),seg(p,.15,.35),CN);
  return s;
 },
 [K+'wnum']:(p)=>{
  const pr=parts(0,TH0,10,{gp:0,gq:1,dash:0});
  let s=wrench(0)+armBrace(1,'r ＝ 0.2 m')+pr.svg+fade(.35,force(0,TH0,10));
  s+=label('8 N',pr.qx-14,(pr.ty+pr.qy)/2+10,{size:28,color:CQ,anchor:'end',weight:700});
  s+=card(700,110,460,300,
   tex(`{\\color{${CN}}N}={\\color{${CR}}0.2\\,\\mathrm{m}}\\times{\\color{${CQ}}8\\,\\mathrm{N}}`,930,200,{size:42,auto:false})
   +fade(seg(p,.55,.7),tex(`=1.6\\,\\mathrm{N\\cdot m}`,960,300,{size:50,auto:false,color:CN})),seg(p,.1,.25));
  s+=highlight(820,255,280,86,seg(p,.7,.85),CN);
  return s;
 },
 // ===== S5 ドア =====
 [K+'door']:(p)=>doorScene(p,{mode:'perp',ask:1}),
 [K+'door2']:(p)=>doorScene(p,{mode:'perp',ans:1}),
 [K+'door3']:(p)=>doorScene(p,{mode:'along'}),
 [K+'door4']:(p)=>doorScene(p,{mode:'near'}),
 // ===== S6 二つ目の掛け算 =====
 [K+'form']:(p)=>{
  const src=`{\\color{${CN}}N}={\\color{${CR}}r}\\times{\\color{${C.F}}F}\\times\\sin${TQ}`,sz=76,W=texWidth(src,sz,false),x0=600-W/2;
  const wAt=q=>texWidth(q,sz,false);
  const xr=x0+(wAt('N=')+wAt('N=r'))/2,xF=x0+(wAt('N=r\\times')+wAt('N=r\\times F'))/2,xs=x0+(wAt('N=r\\times F\\times')+W)/2;
  let s=tex(src,600,170,{size:sz,auto:false});
  const tag=(x,t,c,g)=>fade(g,arrow(x,262,x,212,{color:c,w:3,head:12})+label(t,x,300,{size:28,color:c,anchor:'middle'}));
  s+=tag(xr,'長さ',CR,seg(p,.15,.3))+tag(xF,'大きさ',C.F,seg(p,.3,.45))+tag(xs,'間の角の sin',CT,seg(p,.55,.7));
  return s;
 },
 [K+'ab']:(p)=>{
  const ox=150,oy=400,th=50*RAD;
  let s=arrow(ox,oy,ox+320,oy,{color:CR,w:6})+vl('A',ox+330,oy+10,{size:32,color:CR});
  s+=arrow(ox,oy,ox+230*Math.cos(th),oy-230*Math.sin(th),{color:C.F,w:6})+vl('B',ox+230*Math.cos(th)+10,oy-230*Math.sin(th)-8,{size:32,color:C.F});
  s+=draw(Array.from({length:21},(_,i)=>[ox+50*Math.cos(th*i/20),oy-50*Math.sin(th*i/20)]),1,{color:CT,w:3})+label('θ',ox+70,oy-22,{size:26,color:CT,weight:700});
  s+=card(620,90,540,150,tex(`A\\,B\\sin${TQ}`,890,165,{size:60,auto:false,color:CQ}),seg(p,.05,.25),CQ);
  s+=card(620,280,540,150,label('内積',700,365,{size:28,color:C.dim})+tex(`A\\,B\\cos${TQ}`,940,355,{size:52,auto:false,color:CP}),seg(p,.55,.7),CP);
  return s;
 },
 [K+'table']:(p)=>{
  const cols=[[0,'0°'],[90,'90°'],[180,'180°']],X=[520,760,1000];
  let s=label('𝐀 と 𝐁 の間の角',140,95,{size:28,color:CT});
  cols.forEach(([d,t],i)=>{const x=X[i],y=110,th=d*RAD;
   s+=label(t,x,95,{size:30,color:CT,anchor:'middle',weight:700});
   s+=arrow(x-60,y+70,x+40,y+70,{color:CR,w:4,head:12})+arrow(x-60,y+70+(d===180?8:0),x-60+75*Math.cos(th),y+70-75*Math.sin(th)+(d===180?8:0),{color:C.F,w:4,head:12});});
  const r1=seg(p,.05,.3),r2=seg(p,.4,.65);
  s+=fade(r1,tex(`A\\,B\\cos${TQ}`,260,295,{size:40,auto:false,color:CP})+label('内積',100,300,{size:26,color:C.dim})
   +['AB','0','−AB'].map((v,i)=>label(v,X[i],305,{size:34,color:CP,anchor:'middle',weight:700})).join(''));
  s+=fade(r2,tex(`A\\,B\\sin${TQ}`,260,410,{size:40,auto:false,color:CQ})+label('今回',100,415,{size:26,color:C.dim})
   +['0','AB','0'].map((v,i)=>label(v,X[i],420,{size:34,color:CQ,anchor:'middle',weight:700})).join(''));
  s+=fade(r1,line(100,245,1130,245,{color:C.faint,w:2}))+fade(r2,line(100,355,1130,355,{color:C.faint,w:2}));
  s+=highlight(X[1]-70,380,140,62,seg(p,.7,.85));
  return s;
 },
 [K+'name']:(p)=>{
  const ox=150,oy=400,th=50*RAD,B=230,bx=ox+B*Math.cos(th),by=oy-B*Math.sin(th);
  let s=arrow(ox,oy,ox+320,oy,{color:CR,w:6})+vl('A',ox+330,oy+10,{size:32,color:CR});
  s+=arrow(ox,oy,bx,by,{color:C.F,w:6})+vl('B',bx-40,by-14,{size:32,color:C.F});
  s+=fade(seg(p,.1,.3),line(bx,oy,bx,by,{color:CQ,w:7})+label('B sinθ',bx+14,(oy+by)/2+8,{size:28,color:CQ,weight:700})+line(bx-14,oy,bx-14,oy-14,{color:C.dim})+line(bx-14,oy-14,bx,oy-14,{color:C.dim}));
  s+=draw(Array.from({length:21},(_,i)=>[ox+50*Math.cos(th*i/20),oy-50*Math.sin(th*i/20)]),1,{color:CT,w:3})+label('θ',ox+70,oy-22,{size:26,color:CT,weight:700});
  s+=card(620,90,540,330,label('𝐀 の長さ × 𝐁 の直角な部分',890,150,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.2,.4),tex(`{\\color{${CR}}A}\\times({\\color{${CQ}}B\\sin\\theta})`,890,230,{size:48,auto:false}))
   +fade(seg(p,.55,.7),label('外積の大きさ',890,320,{size:36,color:C.hi,anchor:'middle',weight:700})+tex(`=A\\,B\\sin${TQ}`,890,385,{size:42,auto:false,color:CQ})),seg(p,0,.15));
  return s;
 },
 [K+'perp2']:(p)=>{
  const o={cx:110,cy:170,L:200,k:9,axis:0};const o2={cx:110,cy:400,L:200,k:9,axis:0};
  let s=wrench(0,o)+force(0,Math.PI,8,{...o,push:true})+ng(450,185)+label('柄に沿って',490,183,{size:26,color:C.dim});
  s+=wrench(0,o2)+force(0,Math.PI/2,8,o2)+turnArc(110,400,80,.3,1.3)+ok(450,415)+label('柄に直角',490,413,{size:26,color:C.dim});
  s+=card(700,150,460,220,label('同じ 8 N',930,215,{size:30,color:C.F,anchor:'middle',weight:700})+label('向きだけで 結果が変わる',930,285,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45));
  return s;
 },
 [K+'q30']:(p)=>{
  let s=wrench(0)+force(0,30*RAD,10)+thetaArc(0,30*RAD,{text:'30°'});
  s+=card(720,140,430,230,label('10 N，θ ＝ 30°',935,205,{size:30,color:C.ink,anchor:'middle'})+label('直角な部分は 何 N？',935,270,{size:32,color:C.hi,anchor:'middle',weight:700})+label('予想してみよう',935,330,{size:26,color:C.dim,anchor:'middle'}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'q30a']:(p)=>{
  const pr=parts(0,30*RAD,10,{gp:.6,gq:seg(p,.05,.25)});
  let s=wrench(0)+pr.svg+force(0,30*RAD,10)+thetaArc(0,30*RAD,{text:'30°',ext:0});
  s+=fade(seg(p,.2,.35),label('5 N',pr.qx-14,(pr.ty+pr.qy)/2+10,{size:28,color:CQ,anchor:'end',weight:700}));
  s+=card(700,110,460,300,tex(`\\sin30^\\circ=0.5`,930,180,{size:42,auto:false,color:CQ})
   +fade(seg(p,.15,.35),tex(`10\\,\\mathrm{N}\\times0.5=5\\,\\mathrm{N}`,930,265,{size:42,auto:false}))
   +fade(seg(p,.6,.75),label('効くのは 半分だけ',930,350,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'dial3']:(p)=>dialScene(Math.PI/2,p)+fade(seg(p,.2,.4),label('直角に押すと 一番よく効く',W0.cx+W0.L/2+60,475,{size:28,color:C.hi,anchor:'middle',weight:700})),
 [K+'wnum2']:(p)=>{
  const L2=W0.L*1.6,o={L:L2};
  const pr=parts(0,TH0,10,{gp:0,gq:1,dash:0,L:L2});
  let s=wrench(0,{L:L2})+pr.svg;
  s+=label('8 N',pr.qx-14,(pr.ty+pr.qy)/2+10,{size:28,color:CQ,anchor:'end',weight:700});
  s+=fade(1,line(W0.cx,W0.cy+62,W0.cx+L2,W0.cy+62,{color:CR,w:4})+line(W0.cx+L2,W0.cy+50,W0.cx+L2,W0.cy+74,{color:CR,w:3})+label('r ＝ 0.4 m（2倍）',W0.cx+L2/2+60,W0.cy+100,{size:28,color:CR,anchor:'middle',weight:700}));
  s+=card(740,110,420,300,
   tex(`{\\color{${CN}}N}={\\color{${CR}}0.4}\\times{\\color{${CQ}}8}`,950,190,{size:44,auto:false})
   +fade(seg(p,.3,.45),tex(`=3.2\\,\\mathrm{N\\cdot m}`,950,280,{size:46,auto:false,color:CN}))
   +fade(seg(p,.55,.7),label('1.6 N·m の 2倍',950,360,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'door2b']:(p)=>doorScene(1,{mode:'perp',ans:1,far:1,q:p}),
 [K+'quiz']:(p)=>abPair(90,p,{ask:1}),
 [K+'quiz2']:(p)=>{const d=p<.5?90:90*(1-seg(p,.5,.75));return abPair(d,p,{ask:0});},
 [K+'sum']:(p)=>{
  const pr=parts(0,TH0,10,{gp:1,gq:1});
  let s=wrench(0)+pr.svg+fade(.4,force(0,TH0,10))+armBrace(1);
  s+=card(680,70,480,380,label('まとめ',920,120,{size:28,color:C.dim,anchor:'middle'})
   +label('回すのに効く：直角な部分',920,180,{size:28,color:CQ,anchor:'middle'})+tex(`F\\sin${TQ}`,920,235,{size:44,auto:false,color:CQ})
   +fade(seg(p,.4,.6),label('トルク（回す効き目）',920,305,{size:28,color:CN,anchor:'middle'})+tex(`{\\color{${CN}}N}={\\color{${CR}}r}\\,{\\color{${CQ}}F\\sin\\theta}`,920,370,{size:44,auto:false})+label('[N·m]',920,425,{size:24,color:C.dim,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 [K+'next']:(p)=>{
  const ox=150,oy=400,th=50*RAD,B=230,bx=ox+B*Math.cos(th),by=oy-B*Math.sin(th);
  let s=arrow(ox,oy,ox+320,oy,{color:CR,w:6})+vl('A',ox+330,oy+10,{size:32,color:CR});
  s+=arrow(ox,oy,bx,by,{color:C.F,w:6})+vl('B',bx-40,by-14,{size:32,color:C.F});
  s+=draw(Array.from({length:21},(_,i)=>[ox+50*Math.cos(th*i/20),oy-50*Math.sin(th*i/20)]),1,{color:CT,w:3})+label('θ',ox+70,oy-22,{size:26,color:CT,weight:700});
  s+=card(620,120,540,250,label('次の問い',890,175,{size:26,color:C.dim,anchor:'middle'})+tex(`A\\,B\\sin${TQ}`,890,250,{size:52,auto:false,color:CQ})
   +label('図の上では 何に見える？',890,325,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.3),C.hi);
  return s;
 },
};

function move0(svg){return svg;}

// ---- angle dial with a meter -----------------------------------------------------------------
function dialScene(th,p,labels=false){
 const pr=parts(0,th,10,{gp:.5,gq:1,dash:0});
 let s=wrench(0)+pr.svg+force(0,th,10)+thetaArc(0,th,{ext:1});
 const v=10*Math.sin(th),deg=Math.round(th/RAD);
 // meter
 const mx=690,mw=440,my=100;
 s+=label(`θ ＝ ${deg}°`,mx,my-40,{size:30,color:CT,weight:700});
 s+=label('直角な部分',mx+mw,my-40,{size:26,color:CQ,anchor:'end'});
 s+=rect(mx,my,mw,34,{fill:'#1a2440',fo:1,stroke:C.faint,rx:8})+rect(mx,my,mw*v/10,34,{fill:CQ,fo:.85,stroke:CQ,rx:8});
 s+=label(`${fmt(v,1)} N`,mx+mw,my+74,{size:30,color:CQ,anchor:'end',weight:700});
 s+=label('力は いつも 10 N',mx,my+74,{size:26,color:C.F});
 // small graph of F sinθ against θ
 const A=axes({x:720,y:470,w:400,h:170,xmax:180,ymax:11,xticks:[0,90,180],yticks:[10],xlabel:'θ',ylabel:'',xcolor:CT});
 s+=A.svg+A.plot(t=>10*Math.sin(t*RAD),{from:0,to:180,color:CQ,w:3,p:1});
 s+=dot(A.X(deg),A.Y(v),9,C.hi);
 if(labels){
  s+=label('0°：引っ張る',W0.cx+W0.L+14,W0.cy+58,{size:22,color:C.dim});
  s+=label('180°：軸へ押す',W0.cx+160,W0.cy-40,{size:22,color:C.dim,anchor:'middle'});
 }
 return s;
}

// ---- door seen from above ---------------------------------------------------------------------
function doorScene(p,{mode,ask=0,ans=0,far=0,q=1}){
 const hx=150,hy=390,Wd=400,ppm=500; // 0.8 m door, 500 px per metre
 const r=mode==='near'?.25:.5,push=mode!=='along';
 const turn=push?(mode==='near'?9:18)*RAD*seg(p,.35,.85)*(ask?0:1):0;
 const P=d=>[hx+d*Math.cos(turn),hy-d*Math.sin(turn)];
 let s=label('上から見た図',60,60,{size:26,color:C.dim});
 s+=line(40,hy,hx-14,hy,{color:C.dim,w:5});for(let x=48;x<hx-14;x+=22)s+=line(x,hy+2,x-14,hy+18,{color:C.faint,w:2});
 const [ex,ey]=P(Wd);
 s+=line(hx,hy,ex,ey,{color:'#b99b73',w:16,cap:'butt'});
 s+=ring(hx,hy,12,{color:C.ink,w:3,fill:C.bg})+label('蝶番（軸）',hx-16,hy-26,{size:24,color:C.dim,anchor:'end'});
 const [hxp,hyp]=P(r*ppm);
 s+=dot(hxp,hyp,9,C.ink);
 // r arrow below the door
 s+=fade(push||1,arrow(hx,hy+26,hx+r*ppm,hy+26,{color:CR,w:4,head:12})+label(`r ＝ ${r} m`,hx+r*ppm/2,hy+62,{size:24,color:CR,anchor:'middle'}));
 if(push){
  const k=30,ux=-Math.sin(turn),uy=-Math.cos(turn);
  s+=arrow(hxp,hyp,hxp+ux*4*k,hyp+uy*4*k,{color:C.F,w:6})+label('4 N',hxp+ux*4*k+14,hyp+uy*4*k+10,{size:26,color:C.F,weight:700});
  s+=line(hxp+14*Math.cos(turn),hyp-14*Math.sin(turn),hxp+14*Math.cos(turn)+14*ux,hyp-14*Math.sin(turn)+14*uy,{color:C.dim})+line(hxp+14*ux,hyp+14*uy,hxp+14*Math.cos(turn)+14*ux,hyp-14*Math.sin(turn)+14*uy,{color:C.dim});
  if(!ask)s+=turnArc(hx,hy,90,.1,.1+turn*3,{color:CN,g:seg(p,.35,.45)});
 }else{
  s+=arrow(hxp+150,hyp-2,hxp+10,hyp-2,{color:C.F,w:6,g:seg(p,.05,.3)})+fade(seg(p,.05,.3),label('4 N',hxp+160,hyp-24,{size:26,color:C.F,weight:700}));
  s+=fade(seg(p,.3,.5),label('θ ＝ 180°',hxp+60,hyp-60,{size:28,color:CT,anchor:'middle',weight:700}));
 }
 // card
 let c='';
 if(ask){c=label('r ＝ 0.5 m，直角に 4 N',910,170,{size:28,color:C.ink,anchor:'middle'})+fade(seg(p,.5,.65),label('トルクは？',910,250,{size:34,color:C.hi,anchor:'middle',weight:700})+label('予想してみよう',910,310,{size:26,color:C.dim,anchor:'middle'}));}
 else if(far){c=label('取っ手は 蝶番から 遠くに',910,170,{size:30,color:C.ink,anchor:'middle'})+fade(seg(q,.35,.55),label('小さな力で',910,250,{size:30,color:C.F,anchor:'middle'})+label('大きなトルク',910,310,{size:34,color:CN,anchor:'middle',weight:700}));}
 else if(mode==='perp'){c=tex(`\\sin 90^\\circ=1`,910,160,{size:40,auto:false,color:CQ})
   +fade(seg(p,.3,.5),tex(`{\\color{${CN}}N}=0.5\\times4\\times1`,910,250,{size:42,auto:false}))
   +fade(seg(p,.55,.7),tex(`=2\\,\\mathrm{N\\cdot m}`,930,340,{size:50,auto:false,color:CN}));}
 else if(mode==='along'){c=label('ドアに沿って 蝶番の方へ',910,160,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.35,.55),tex(`\\sin180^\\circ=0`,910,245,{size:42,auto:false,color:CQ}))
   +fade(seg(p,.55,.7),tex(`{\\color{${CN}}N}=0`,910,320,{size:46,auto:false})+label('回らない',910,390,{size:30,color:C.a,anchor:'middle',weight:700}));}
 else{c=label('蝶番に近い所を 直角に',910,160,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.25,.45),tex(`{\\color{${CN}}N}=0.25\\times4\\times1`,910,245,{size:42,auto:false}))
   +fade(seg(p,.5,.65),tex(`=1\\,\\mathrm{N\\cdot m}`,930,320,{size:46,auto:false,color:CN})+label('半分',910,395,{size:30,color:C.hi,anchor:'middle',weight:700}));}
 s+=card(660,90,500,340,c,1,ask?C.hi:C.faint);
 return s;
}

// ---- A = 3, B = 2 at a given angle (quiz) ----------------------------------------------------
function abPair(deg,p,{ask=1}={}){
 const ox=170,oy=400,u=60,th=deg*RAD,off=deg<20?14*(1-deg/20):0,bx=ox+2*u*Math.cos(th),by=oy-off-2*u*Math.sin(th);
 let s='';
 for(let i=0;i<=3;i++)s+=line(ox+i*u,oy+10,ox+i*u,oy-10,{color:C.faint,w:2});
 s+=arrow(ox,oy,ox+3*u,oy,{color:CR,w:6})+label('A ＝ 3',ox+3*u+14,oy+10,{size:28,color:CR,weight:700});
 s+=arrow(ox,oy-off,bx,by,{color:C.F,w:6})+label('B ＝ 2',deg<30?bx-20:bx+12,deg<30?by-26:by-12,{size:28,color:C.F,weight:700,anchor:deg<30?'middle':'start'});
 if(deg>60)s+=line(ox+16,oy,ox+16,oy-16,{color:C.dim})+line(ox+16,oy-16,ox,oy-16,{color:C.dim});
 s+=label(`θ ＝ ${Math.round(deg)}°`,ox,oy+56,{size:28,color:CT,weight:700});
 let c;
 if(ask)c=tex(`A\\,B\\sin${TQ}`,930,190,{size:48,auto:false,color:CQ})+label('直角なら いくつ？',930,275,{size:32,color:C.hi,anchor:'middle',weight:700})+label('予想してみよう',930,335,{size:26,color:C.dim,anchor:'middle'});
 else c=tex(`3\\times2\\times\\sin90^\\circ=6`,930,180,{size:40,auto:false,color:CQ})
   +fade(seg(p,.55,.75),tex(`3\\times2\\times\\sin0^\\circ=0`,930,280,{size:40,auto:false,color:CQ})+label('平行なら 0',930,360,{size:30,color:C.a,anchor:'middle',weight:700}));
 s+=card(700,110,460,300,c,seg(p,0,.15),ask?C.hi:C.faint);
 return s;
}

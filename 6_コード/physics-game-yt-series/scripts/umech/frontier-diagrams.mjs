// 単元「遠心力と万有引力」 — pictures. Viewbox 1200×515.
// Colours: x cyan, v purple, a red, F green, t gold. Apparent (inertial) forces: C.a dashed.
import {C,clamp,mix,smooth,seg,lin,fmt,fade,label,line,rect,dot,ring,draw,poly,arrow,axes,move,tex,texWidth} from './anim.mjs';

const n2=v=>Number(v.toFixed(2));
const TAU=2*Math.PI;
// Dashed arrow = a force with no partner (inertial / centrifugal force).
function darrow(x,y,X,Y,{color=C.a,w=5,g=1,head=18,dash='12 9'}={}){
 const XX=mix(x,X,g),YY=mix(y,Y,g),L=Math.hypot(XX-x,YY-y);if(L<1||g<=0)return '';
 const a=Math.atan2(YY-y,XX-x),h=Math.min(head,L*.6),bx=XX-h*Math.cos(a),by=YY-h*Math.sin(a);
 return line(x,y,bx,by,{color,w,dash,cap:'butt'})+`<polygon points="${n2(XX)},${n2(YY)} ${n2(bx+h*.5*Math.sin(a))},${n2(by-h*.5*Math.cos(a))} ${n2(bx-h*.5*Math.sin(a))},${n2(by+h*.5*Math.cos(a))}" fill="${color}"/>`;
}
// Time since the start of the scene (keeps continuous motion across cues of one picture group).
const sceneT=o=>o&&o.scene?o.scene.captions[o.k].start-o.scene.captions[0].start+o.t:0;

// ---- train pieces --------------------------------------------------------------
const FLOOR=360,RAIL=398,ROOF=140;
const wrapX=(x,L=1300)=>((x%L)+L)%L-50;
function rails(shift=0,{posts=true}={}){
 let s='';
 if(posts)for(let k=0;k<5;k++){const gx=wrapX(k*260+120-shift);s+=line(gx,RAIL,gx,RAIL-170,{color:C.faint,w:6})+rect(gx-22,RAIL-190,44,20,{fill:C.faint,fo:.6,sw:0,rx:3});}
 s+=line(0,RAIL,1200,RAIL,{color:C.dim,w:3});
 for(let k=0;k<30;k++){const gx=wrapX(k*44-shift);s+=line(gx,RAIL+2,gx-14,RAIL+18,{color:C.faint,w:2});}
 return s;
}
function train(x0,w=520,{ticks=true}={}){
 let s=rect(x0,ROOF,w,FLOOR-ROOF,{fill:C.bg,fo:1,stroke:C.dim,sw:3,rx:14})+rect(x0,ROOF,w,FLOOR-ROOF,{fill:C.dim,fo:.07,sw:0,rx:14});
 const ww=(w-60)/3;for(let i=0;i<3;i++)s+=rect(x0+30+i*ww+8,ROOF+22,ww-16,64,{fill:C.x,fo:.05,stroke:C.faint,sw:2,rx:6});
 s+=line(x0,FLOOR,x0+w,FLOOR,{color:C.dim,w:4});
 s+=ring(x0+70,RAIL-14,14,{color:C.dim,w:3,fill:C.bg})+ring(x0+w-70,RAIL-14,14,{color:C.dim,w:3,fill:C.bg});
 if(ticks)for(let q=26;q<w;q+=52)s+=line(x0+q,FLOOR-3,x0+q,FLOOR-15,{color:C.x,w:2.5});
 return s;
}
function bag(cx,{o=1,text=true}={}){return fade(o,rect(cx-32,FLOOR-52,64,52,{fill:C.dim,fo:.35,stroke:C.ink,sw:2,rx:5})+(text?label('荷物',cx,FLOOR-64,{size:22,color:C.ink,anchor:'middle'}):''));}
function accelTag(x,y,{text='電車の加速度 A'}={}){return arrow(x,y,x+110,y,{color:C.a,w:6})+label(text,x+122,y+8,{size:24,color:C.a});}

// ---- intro ---------------------------------------------------------------------
function strap(px,py,L,psi){const hx=px-L*Math.sin(psi),hy=py+L*Math.cos(psi);return {hx,hy,svg:line(px,py,hx,hy,{color:C.ink,w:3})+ring(hx-10*Math.sin(psi),hy+10*Math.cos(psi),11,{color:C.ink,w:4})};}
const PSI=Math.atan(2/9.8);
function groundView(t,{lag=0}={}){
 const sh=50*t*t,x0=250+sh,bx=590;
 let s=rails(0)+train(x0,520)+bag(bx);
 s+=accelTag(x0+300,100);
 if(t>.05)s+=arrow(x0+300,60,x0+300+45*t,60,{color:C.v,w:5,head:14})+label('電車の速さ',x0+300+45*t+12,68,{size:22,color:C.v});
 s+=line(bx,120,bx,RAIL+30,{color:C.hi,w:2,dash:'6 8'})+label('地面に対して止まったまま',bx,462,{size:24,color:C.hi,anchor:'middle'});
 s+=label('つるつるの床（摩擦なし）',x0+260,FLOOR+32,{size:22,color:C.dim,anchor:'middle'});
 s+=label(`時刻 ${fmt(t,1)} s`,30,40,{size:24,color:C.t})+label('地面から見る',1170,40,{size:26,color:C.dim,anchor:'end'});
 if(lag>0){
  const mx=x0+340;
  s+=fade(lag,line(mx,FLOOR-2,mx,250,{color:C.x,w:3,dash:'5 6'})+label('はじめの位置',mx+8,244,{size:22,color:C.x,anchor:'start'})
   +(mx-bx>8?arrow(mx,250,bx+4,250,{color:C.x,w:5,head:14}):'')+label('床の目盛りでは、後ろへずれる',(mx+bx)/2,505,{size:24,color:C.x,anchor:'middle'}));
 }
 return s;
}
function insideView(t,{force=0,aprime=0}={}){
 const sh=50*t*t,x0=340,bx=680-50*t*t;
 let s=rails(sh)+train(x0,520);
 [.5,1,1.5].forEach(q=>{if(q<t-.05)s+=bag(680-50*q*q,{o:.25,text:false});});
 s+=bag(bx)+accelTag(x0+320,100,{text:'電車の加速度 A（前向き）'});
 if(aprime>0)s+=fade(aprime,arrow(bx,FLOOR-26,bx-130,FLOOR-26,{color:C.a,w:6})+label('見える加速度 a′（後ろ向き）',bx-65,FLOOR-80,{size:24,color:C.a,anchor:'middle'}));
 if(force>0)s+=darrow(bx,FLOOR-26,bx-140,FLOOR-26,{g:force,w:6})+fade(force,label('慣性力 −mA',bx-70,FLOOR-80,{size:28,color:C.a,anchor:'middle',weight:700}));
 s+=label(`時刻 ${fmt(t,1)} s`,30,40,{size:24,color:C.t})+label('電車の中から見る',1170,40,{size:26,color:C.dim,anchor:'end'});
 return s;
}
export const frontierDiagrams={
 'fr-hook':(p)=>{
  const t=2.2*p,sh=50*t*t;
  let s=rails(sh)+train(340,520,{ticks:false});
  const {hx,hy,svg}=strap(600,ROOF,120,PSI*seg(p,.08,.35));s+=svg;
  s+=accelTag(760,100);
  s+=fade(seg(p,.5,.75),darrow(hx-18,hy+12,hx-150,hy+12,{color:C.dim,w:4})+label('後ろへ引く力？',hx-160,hy+20,{size:26,color:C.hi,anchor:'end'}));
  s+=fade(seg(p,.7,.95),label('誰が引いた？',600,470,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s+label('電車の中から見る',1170,40,{size:26,color:C.dim,anchor:'end'});
 },
 'fr-ground:run':(p)=>groundView(1.3*lin(p,0,.95)),
 'fr-ground:lag':(p)=>groundView(1.3+.7*lin(p,0,.8),{lag:seg(p,.25,.5)}),
 'fr-inside:run':(p)=>insideView(2*lin(p,0,.8),{aprime:seg(p,.45,.7)}),
 'fr-inside:force':(p)=>{
  const t=2*lin(p,.1,.9);
  return insideView(t,{force:seg(p,.1,.35)})+fade(seg(p,0,.25),tex("a'=0-A=-A",200,100,{size:38}))
   +fade(seg(p,.55,.8),label('破線の矢印：押している相手がいない「見かけの力」',600,480,{size:24,color:C.a,anchor:'middle'}));
 },
 'fr-seat':(p)=>{
  const t=2+2*p;let s=rails(50*t*t,{posts:false})+train(60,480,{ticks:false});
  // seat and passenger (a block with mass 50 kg)
  s+=rect(214,190,16,170,{fill:C.dim,fo:.4,stroke:C.dim,rx:3})+rect(214,338,150,22,{fill:C.dim,fo:.4,stroke:C.dim,rx:3});
  s+=rect(232,226,100,112,{fill:C.x,fo:.18,stroke:C.x,rx:12})+label('人',282,262,{size:26,color:C.ink,anchor:'middle'})+label('50 kg',282,292,{size:22,color:C.ink,anchor:'middle'});
  s+=arrow(232,318,400,318,{color:C.F,w:6,g:seg(p,.05,.3)})+fade(seg(p,.2,.35),label('背もたれが押す 100 N',410,326,{size:24,color:C.F}));
  s+=darrow(300,210,130,210,{g:seg(p,.3,.55),w:6})+fade(seg(p,.45,.6),label('慣性力 100 N',80,128,{size:24,color:C.a}));
  s+=accelTag(350,100,{text:'A'});
  const g1=seg(p,.55,.75),g2=seg(p,.72,.92);
  s+=fade(g1,label('電車の中から見ると',700,190,{size:26,color:C.hi})+tex('100-100=0',950,245,{size:36,auto:false})+label('→ 止まって見える',700,295,{size:26,color:C.ink}));
  s+=fade(g2,label('地面から見ると',700,90,{size:26,color:C.dim})+tex('100\\div50=2\\ \\mathrm{m/s^2}',950,130,{size:32,auto:false})+label('→ 電車と同じ加速度で進む',700,160,{size:24,color:C.dim}));
  return s;
 },
 'fr-tilt:forces':(p)=>tiltPic(p,0),
 'fr-tilt:sum':(p)=>tiltPic(1,p),
};
function tiltPic(p,sum){
 const px=380,py=60,L=200,{hx,hy,svg}=strap(px,py,L,PSI*(sum>0?1:seg(p,0,.25))),hc=[hx-10*Math.sin(PSI),hy+10*Math.cos(PSI)];
 let s=line(180,py,600,py,{color:C.dim,w:5})+label('電車の天井',190,py-14,{size:22,color:C.dim})+line(px,py,px,py+L+30,{color:C.faint,w:2,dash:'5 7'})+svg;
 s+=accelTag(760,60,{text:'電車の加速度 A'})+label('前 →',1150,120,{size:24,color:C.dim,anchor:'end'});
 const K=180,ga=sum>0?1:seg(p,.25,.45),gb=sum>0?1:seg(p,.4,.6),gc=sum>0?1:seg(p,.55,.75),[X,Y]=hc;
 s+=arrow(X,Y,X,Y+K,{color:C.F,w:6,g:ga,head:16})+fade(ga,label('重力 mg',X+16,Y+K-10,{size:24,color:C.F}));
 s+=darrow(X,Y,X-K*2/9.8,Y,{g:gb,w:6,head:14})+fade(gb,label('慣性力',X-48,Y-18,{size:24,color:C.a,anchor:'end'}));
 const tx=K*2/9.8,ty=-K;s+=arrow(X,Y,X+tx,Y+ty,{color:C.F,w:6,g:gc,head:16})+fade(gc,label('ひもが引く力',X+tx+26,Y+ty/2,{size:24,color:C.F}));
 // force triangle: head to tail closes = balance
 const gt=sum>0?1:seg(p,.72,.95),O=[830,120];
 s+=fade(gt,arrow(O[0],O[1],O[0],O[1]+K,{color:C.F,w:5,head:14})+darrow(O[0],O[1]+K,O[0]-tx,O[1]+K,{w:5,head:12})+arrow(O[0]-tx,O[1]+K,O[0],O[1],{color:C.F,w:5,head:14})
  +label('三つの矢印をつなぐと',870,190,{size:24,color:C.ink})+label('閉じた三角形＝つり合い',870,228,{size:24,color:C.hi}));
 if(sum>0){
  s+=fade(seg(sum,.05,.3),rect(640,330,540,72,{fill:C.F,fo:.08,stroke:C.F,rx:12})+label('ひも・重力：引く相手がいる',910,376,{size:26,color:C.F,anchor:'middle'}));
  s+=fade(seg(sum,.3,.55),rect(640,418,540,72,{fill:C.a,fo:.08,stroke:C.a,rx:12})+label('慣性力：相手なし（つじつま合わせ）',910,464,{size:26,color:C.a,anchor:'middle'}));
 }
 return s;
}

// ---- middle: x = X + x′ --------------------------------------------------------
Object.assign(frontierDiagrams,{
 'fr-xX':(p)=>{
  const u=2.4*lin(p,0,.75),x0=180+30*u*u,w=440,xr=300-22*u*u,bx=x0+xr,O=70;
  let s=move(0,-60,rails(0)+train(x0,w,{ticks:false})+bag(bx,{text:false}));
  s+=dot(O,RAIL-60,8,C.ink)+label('原点',O,RAIL-78,{size:22,color:C.ink,anchor:'middle'})+dot(x0,FLOOR-60,7,C.x);
  const y1=392,y2=452;
  s+=arrow(O,y1,x0,y1,{color:'#4fb8d6',w:5,head:14})+tex('X',(O+x0)/2,y1-20,{size:32,auto:false,color:'#4fb8d6'});
  s+=arrow(x0,y1,bx,y1,{color:C.x,w:5,head:14})+tex("x'",(x0+bx)/2,y1-20,{size:32});
  s+=arrow(O,y2,bx,y2,{color:C.x,w:6,head:14})+tex('x',(O+bx)/2,y2+34,{size:32});
  s+=line(bx,y1,bx,y2,{color:C.faint,w:2,dash:'4 6'});
  s+=label('電車の位置',(O+x0)/2,y1+34,{size:22,color:'#4fb8d6',anchor:'middle'})+label('電車の中での位置',(x0+bx)/2,y1+34,{size:22,color:C.x,anchor:'middle'});
  return s+fade(seg(p,.6,.85),rect(870,60,290,90,{fill:C.hi,fo:.06,stroke:C.hi,rx:12})+tex("x=X+x'",1015,112,{size:44}));
 },
});

// ---- middle: rotating disc, two viewpoints ------------------------------------
const W=.7; // visual angular speed (rad/s)
function discBody(cx,cy,R,ang){let s=ring(cx,cy,R,{color:C.dim,w:3,fill:'#15203a'});for(let i=0;i<6;i++){const a=ang+i*Math.PI/3;s+=line(cx,cy,cx+R*Math.cos(a),cy-R*Math.sin(a),{color:C.faint,w:2});}return s+dot(cx,cy,6,C.dim);}
function person(x,y){return ring(x,y,15,{color:C.hi,w:3,fill:'#3a3320'});}
function discGround(cx,cy,R,rp,T,{vel=1,force=0,tangent=0,ghost=1}={}){
 const a=W*T+.4,px=cx+rp*Math.cos(a),py=cy-rp*Math.sin(a),tx=-Math.sin(a),ty=-Math.cos(a);
 let s=discBody(cx,cy,R,a);
 s+=draw(Array.from({length:40},(_,i)=>{const b=a-1.6*i/39;return [cx+rp*Math.cos(b),cy-rp*Math.sin(b)];}),1,{color:C.hi,w:2,dash:'3 7'});
 if(ghost)[.8,1.6].forEach(d=>{const b=a-d,qx=cx+rp*Math.cos(b),qy=cy-rp*Math.sin(b);s+=arrow(qx,qy,qx-85*Math.sin(b),qy-85*Math.cos(b),{color:C.v,w:4,head:12,opacity:.3*ghost});});
 if(tangent>0)s+=fade(tangent,line(px,py,px+320*tx,py+320*ty,{color:C.dim,w:2,dash:'8 8'}));
 s+=person(px,py);
 if(vel)s+=arrow(px,py,px+95*tx,py+95*ty,{color:C.v,w:5,head:14});
 if(force>0)s+=arrow(px,py,mix(px,cx,.62),mix(py,cy,.62),{color:C.F,w:6,g:force,head:16});
 return {svg:s,px,py};
}
Object.assign(frontierDiagrams,{
 'fr-disc:ground':(p,o)=>{
  const T=sceneT(o),{svg}=discGround(340,262,210,160,T,{tangent:seg(p,.55,.8)});
  return svg+label('地面から見る',720,90,{size:30,color:C.hi})+fade(seg(p,.15,.4),label('速度の矢印',720,160,{size:26,color:C.v})+label('向きが変わり続ける',720,200,{size:26,color:C.ink}))
   +fade(seg(p,.55,.8),label('点線：力がなければ、まっすぐ',720,280,{size:24,color:C.dim}));
 },
 'fr-disc:force':(p,o)=>{
  const T=sceneT(o),{svg}=discGround(340,262,210,160,T,{force:seg(p,.05,.3)});
  return svg+label('地面から見る',720,90,{size:30,color:C.hi})+fade(seg(p,.1,.35),label('手すりが内側へ引く力',720,160,{size:26,color:C.F})+tex('F=mr\\omega^2',900,230,{size:46}))
   +fade(seg(p,.4,.65),label('ω（オメガ）：1秒あたりに回る角度',720,310,{size:24,color:C.v}))+fade(seg(p,.6,.85),label('向き：いつも中心向き',720,360,{size:24,color:C.F}));
 },
 'fr-disc:rot':(p,o)=>{
  const T=sceneT(o),cx=340,cy=262,R=210,rp=160;
  let s='';
  for(let i=0;i<10;i++){const a=i*TAU/10-W*T;s+=rect(cx+250*Math.cos(a)-8,cy-250*Math.sin(a)-8,16,16,{fill:C.faint,fo:.8,sw:0,rx:3});}
  s+=discBody(cx,cy,R,.4)+person(cx+rp,cy);
  const gi=seg(p,.1,.35),go=seg(p,.35,.6);
  s+=arrow(cx+rp,cy,cx+rp-100,cy,{color:C.F,w:6,g:gi,head:16})+fade(gi,label('手すり',cx+rp-50,cy+40,{size:22,color:C.F,anchor:'middle'}));
  s+=darrow(cx+rp,cy,cx+rp+100,cy,{g:go,w:6,head:16})+fade(go,label('遠心力',cx+rp+90,cy-60,{size:26,color:C.a,anchor:'middle',weight:700})+tex('mr\\omega^2',cx+rp+90,cy-24,{size:30}));
  s+=label('円盤と一緒に回る視点',720,90,{size:30,color:C.hi})+label('円盤は止まり、まわりの景色が回る',720,140,{size:22,color:C.dim});
  s+=fade(seg(p,.6,.85),tex('mr\\omega^2-mr\\omega^2=0',930,240,{size:38})+label('→ 人は止まって見える',720,310,{size:26,color:C.ink}));
  return s;
 },
 'fr-disc:both':(p,o)=>{
  const T=sceneT(o);
  const L=discGround(300,280,130,95,T,{force:1,ghost:0}).svg;
  let R=discBody(900,280,130,.4)+person(995,280)+arrow(995,280,935,280,{color:C.F,w:5,head:14})+darrow(995,280,1060,280,{w:5,head:14});
  const s=move(0,0,L)+R+label('地面から見る',300,120,{size:28,color:C.hi,anchor:'middle'})+label('回る視点で見る',900,120,{size:28,color:C.hi,anchor:'middle'})
   +fade(seg(p,.1,.4),label('内向きの力だけ → 円を描く',300,460,{size:24,color:C.F,anchor:'middle'}))
   +fade(seg(p,.3,.6),label('遠心力とつり合い → 止まる',900,460,{size:24,color:C.a,anchor:'middle'}))
   +fade(seg(p,.6,.85),label('同じ動き・二つの語り方',600,60,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
});

// ---- middle: the Moon falls -------------------------------------------------------
Object.assign(frontierDiagrams,{
 'fr-moon':(p)=>{
  const cx=110,cy=300,R=16,k=Math.round(60*seg(p,.35,.8));
  let s=ring(cx,cy,R,{color:C.x,w:3,fill:'#123049'})+dot(cx,cy,3,C.ink);
  s+=fade(seg(p,0,.2),dot(cx,cy-R-5,6,C.a)+label('リンゴ',cx-6,cy-R-54,{size:24,color:C.ink,anchor:'start'})+label('9.8 m/s²',cx-6,cy-R-24,{size:24,color:C.a}));
  s+=fade(seg(p,.05,.25),arrow(cx,cy,cx,cy-R,{color:C.hi,w:3,head:8})+label('地球半径 1 つ分',cx+30,cy+60,{size:22,color:C.dim}));
  for(let i=1;i<=k;i++)s+=line(cx+i*R,cy-6,cx+i*R,cy+6,{color:i%10===0?C.hi:C.faint,w:i%10===0?3:2});
  if(k>0)s+=line(cx,cy,cx+k*R,cy,{color:C.x,w:3})+label(`× ${k}`,cx+k*R,cy+40,{size:24,color:C.x,anchor:'middle'});
  const gm=seg(p,.55,.8);
  s+=fade(gm,ring(cx+60*R,cy,8,{color:C.ink,w:2,fill:'#9aa3b5'})+label('月',cx+60*R,cy-30,{size:26,color:C.ink,anchor:'middle'})+label('?',cx+60*R,cy-68,{size:30,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.8,1),label('地球の「中心」から、地球半径の約 60 倍',600,140,{size:28,color:C.hi,anchor:'middle'}));
  return s;
 },
 'fr-moonfall':(p)=>{
  let s='';
  // apple: 4.9 m in the first second
  const y0=90,H=330,u=lin(p,.05,.4),ya=y0+H*u*u;
  s+=line(180,y0,180,y0+H,{color:C.dim,w:2})+label('0 m',168,y0+8,{size:22,color:C.dim,anchor:'end'})+label('4.9 m',168,y0+H+8,{size:22,color:C.dim,anchor:'end'});
  s+=draw([[220,y0],[220,ya]],1,{color:C.x,w:3,dash:'4 6'})+dot(220,ya,12,C.a)+label('リンゴ',250,y0+8,{size:24,color:C.ink});
  s+=fade(seg(p,.35,.45),label('1 秒で 4.9 m',250,y0+H-10,{size:26,color:C.hi}));
  s+=line(420,60,420,470,{color:C.faint,w:2});
  // Moon: tangent (straight) vs actual path (exaggerated)
  const x0=500,x1=1120,yt=150,drop=150,f=x=>yt+drop*((x-x0)/(x1-x0))**2,m=lin(p,.45,.85),xm=mix(x0,x1,m);
  s+=line(x0,yt,x1,yt,{color:C.dim,w:2,dash:'8 8'})+label('力がなければ、まっすぐ',x1,yt-18,{size:22,color:C.dim,anchor:'end'});
  s+=draw(Array.from({length:61},(_,i)=>{const x=mix(x0,xm,i/60);return [x,f(x)];}),1,{color:C.x,w:4});
  s+=ring(xm,f(xm),14,{color:C.ink,w:2,fill:'#9aa3b5'})+label('月',x0-20,yt+8,{size:26,color:C.ink,anchor:'end'});
  const ge=seg(p,.8,.95);
  s+=fade(ge,arrow(x1,yt,x1,yt+drop-16,{color:C.a,w:4,head:12})+label('約 1.4 mm',x1-18,yt+drop/2+8,{size:26,color:C.a,anchor:'end',weight:700})+label('横へ 約 1 km',(x0+x1)/2,yt-50,{size:24,color:C.v,anchor:'middle'}));
  s+=arrow(800,390,800,460,{color:C.dim,w:4,head:12})+label('地球の方へ',820,440,{size:22,color:C.dim});
  s+=label('（落ちる量は大げさに描いています）',1120,500,{size:22,color:C.dim,anchor:'end'});
  return s;
 },
});

// ---- advanced: Newton's cannon (numerically integrated, GM chosen so v_circle = 1) ---
const CAN={cx:500,cy:210,R:118,r0:185};
function orbitPath(v){
 const {R,r0}=CAN,GM=r0,dt=.35;let x=0,y=r0,vx=v,vy=0,ang=0,prev=Math.atan2(y,x);const pts=[[0,r0]];
 for(let i=0;i<20000;i++){
  let r=Math.hypot(x,y),a=-GM/(r*r*r);vx+=a*x*dt/2;vy+=a*y*dt/2;x+=vx*dt;y+=vy*dt;r=Math.hypot(x,y);a=-GM/(r*r*r);vx+=a*x*dt/2;vy+=a*y*dt/2;
  const th=Math.atan2(y,x);let d=th-prev;if(d>Math.PI)d-=TAU;if(d<-Math.PI)d+=TAU;ang+=d;prev=th;
  if(i%4===0)pts.push([x,y]);
  if(r<R){pts.push([x,y]);break;}if(r>1600||Math.abs(ang)>=TAU){pts.push([x,y]);break;}
 }
 return pts.map(([x,y])=>[CAN.cx+x,CAN.cy-y]);
}
const SHOTS=[.6,.8,.93,1,1.1,1.45].map(v=>({v,pts:orbitPath(v)}));
function earth(){const {cx,cy,R,r0}=CAN;const a=.1;return ring(cx,cy,R,{color:C.x,w:3,fill:'#123049'})+poly([[cx+R*Math.sin(-a),cy-R*Math.cos(a)],[cx,cy-r0+2],[cx+R*Math.sin(a),cy-R*Math.cos(a)]],{fill:C.dim,fo:.6,stroke:C.dim})+rect(cx-8,cy-r0-4,24,9,{fill:C.ink,fo:.9,sw:0,rx:2});}
function shot(i,g,{color=C.x,w=4,dash='',tip=true}={}){const P=SHOTS[i].pts;if(g<=0)return '';const k=Math.max(2,Math.ceil(P.length*g));const Q=P.slice(0,k);return draw(Q,1,{color,w,dash})+(tip&&g<1?dot(Q.at(-1)[0],Q.at(-1)[1],8,C.hi):'');}
const SHOTCOL=[C.E,C.E,C.E,C.hi,C.x,C.v];
Object.assign(frontierDiagrams,{
 'fr-cannon:shots':(p)=>{
  let s=earth();
  for(let i=0;i<4;i++){const g=seg(p,.06+i*.22,.06+i*.22+.2);s+=fade(i<3&&p>.06+(i+1)*.22+.2?.45:1,shot(i,g,{color:SHOTCOL[i]}));}
  s+=label('山の上から水平に撃つ',820,70,{size:26,color:C.ink})+fade(seg(p,.1,.3),label('遅い → すぐ落ちる',820,140,{size:24,color:C.E}))
   +fade(seg(p,.4,.6),label('速い → 遠くに落ちる',820,190,{size:24,color:C.E}))+label('（山の高さは大げさに描いています）',1170,500,{size:22,color:C.dim,anchor:'end'})+fade(seg(p,.85,1),label('もっと速い → 一周！',820,240,{size:24,color:C.hi}));
  return s;
 },
 'fr-cannon:orbit':(p)=>{
  let s=earth();for(let i=0;i<3;i++)s+=fade(.35,shot(i,1,{color:SHOTCOL[i],tip:false}));
  s+=shot(3,1,{color:C.hi,tip:false})+shot(4,seg(p,.3,.6),{color:C.x})+shot(5,seg(p,.6,.9),{color:C.v,dash:'10 8'});
  s+=label('秒速 約 7.9 km → 円',820,140,{size:24,color:C.hi})+label('（地表すれすれの場合）',820,172,{size:22,color:C.dim});
  s+=fade(seg(p,.3,.45),label('もっと速い → 楕円',820,240,{size:24,color:C.x}));
  s+=fade(seg(p,.6,.75),label('秒速 約 11.2 km 以上',820,310,{size:24,color:C.v})+label('→ 戻ってこない',820,342,{size:24,color:C.v}));
  return s;
 },
 'fr-kepler3':(p)=>{
  const sx=330,sy=262,r1=55,r2=220,u=lin(p,.05,.9),a1=TAU*8*u,a2=TAU*u;
  let s=dot(sx,sy,14,C.t)+ring(sx,sy,r1,{color:C.faint,w:2})+ring(sx,sy,r2,{color:C.faint,w:2});
  s+=draw(Array.from({length:81},(_,i)=>{const b=a2*i/80;return [sx+r2*Math.cos(b),sy-r2*Math.sin(b)];}),1,{color:C.x,w:3});
  s+=dot(sx+r1*Math.cos(a1),sy-r1*Math.sin(a1),9,C.hi)+dot(sx+r2*Math.cos(a2),sy-r2*Math.sin(a2),11,C.x);
  s+=label('半径 1',sx+r1+8,sy+30,{size:22,color:C.hi})+label('半径 4',sx+r2+10,sy+30,{size:22,color:C.x});
  s+=label(`内側：${Math.min(8,Math.floor(8*u+1e-6))} 周`,700,140,{size:30,color:C.hi})+label(`外側：${Math.min(1,Math.floor(u+1e-6))} 周`,700,200,{size:30,color:C.x});
  s+=fade(seg(p,.2,.4),tex('4^3=64=8^2',930,300,{size:40}));
  s+=fade(seg(p,.45,.65),label('半径 4 倍 → 周期 8 倍',700,390,{size:30,color:C.ink,weight:700}));
  return s;
 },
});

// ---- advanced: equal areas ---------------------------------------------------------
function keplerE(M,e){let E=M;for(let i=0;i<30;i++)E-=(E-e*Math.sin(E)-M)/(1-e*Math.cos(E));return E;}
const EL={cx:560,cy:262,a:250,e:.6};EL.b=EL.a*Math.sqrt(1-EL.e**2);EL.c=EL.a*EL.e;
// Perihelion on the left, Sun at the left focus.
const elPos=M=>{const E=keplerE(M,EL.e);return [EL.cx-EL.a*Math.cos(E),EL.cy-EL.b*Math.sin(E)];};
Object.assign(frontierDiagrams,{
 'fr-area:sweep':(p)=>{
  const sx=EL.cx-EL.c,sy=EL.cy,N=12,u=lin(p,.05,.85),M=TAU*u;
  let s=draw(Array.from({length:121},(_,i)=>elPos(TAU*i/120)),1,{color:C.faint,w:2});
  for(let k=0;k<N;k++){const m0=TAU*k/N,m1=TAU*(k+1)/N;if(M<=m0)break;const mm=Math.min(M,m1);
   const pts=[[sx,sy],...Array.from({length:13},(_,i)=>elPos(mix(m0,mm,i/12)))];
   const hi=k===0||k===6;s+=poly(pts,{fill:C.t,fo:hi?.55:(k%2?.14:.26),stroke:hi?C.hi:'none',sw:2});}
  const [px,py]=elPos(M),E=keplerE(M,EL.e),vx=EL.a*Math.sin(E),vy=-EL.b*Math.cos(E),k=1/(1-EL.e*Math.cos(E)),sc=.28;
  s+=dot(sx,sy,14,C.t)+label('太陽',sx,sy+42,{size:22,color:C.t,anchor:'middle'});
  s+=line(sx,sy,px,py,{color:C.x,w:2})+dot(px,py,10,C.hi)+arrow(px,py,px+vx*k*sc,py+vy*k*sc,{color:C.v,w:4,head:12});
  s+=fade(seg(p,.55,.75),label('近い：速い',EL.cx-EL.a-10,90,{size:24,color:C.v})+label('遠い：遅い',EL.cx+EL.a-120,90,{size:24,color:C.v}));
  s+=fade(seg(p,.8,1),label('同じ時間 → 同じ面積',860,470,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 'fr-area:tri':(p)=>{
  const sx=160,sy=420,px=760,h=170,g1=seg(p,0,.2),g2=seg(p,.2,.4),g3=seg(p,.4,.6);
  let s=dot(sx,sy,14,C.t)+label('太陽',sx,sy+44,{size:22,color:C.t,anchor:'middle'});
  s+=fade(g3,poly([[sx,sy],[px,sy],[px,sy-h]],{fill:C.t,fo:.35,stroke:C.hi,sw:2}));
  s+=line(sx,sy,mix(sx,px,g1),sy,{color:C.x,w:4})+fade(g1,tex('r',(sx+px)/2,sy+38,{size:34,auto:false,color:C.x})+dot(px,sy,10,C.hi));
  s+=arrow(px,sy,px,sy-h,{color:C.v,w:5,g:g2,head:14})+fade(g2,tex('v_{\\perp}\\Delta t',px+20,sy-h/2+10,{size:32,anchor:'start'})+label('横向きの速さ × 時間',px+20,sy-h/2+54,{size:22,color:C.v}));
  s+=fade(g3,label('面積',(sx+2*px)/3-10,sy-40,{size:26,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.55,.75),tex('\\tfrac12\\,r\\,v_{\\perp}\\Delta t',980,120,{size:40}));
  s+=fade(seg(p,.75,.95),label('r × 横向きの速さ',870,200,{size:24,color:C.ink})+tex('=\\dfrac{L}{m}',980,260,{size:40,auto:false})+label('（角運動量 ÷ 質量）',870,320,{size:22,color:C.dim}));
  return s;
 },
});

// ---- advanced: conic sections r = p/(1+e cos θ) --------------------------------
function conic(sx,sy,p,e,{th0=0,th1=TAU,steps=360,rmax=1600}={}){
 const segs=[];let cur=[];
 for(let i=0;i<=steps;i++){const th=mix(th0,th1,i/steps),den=1+e*Math.cos(th),r=den>1e-3?p/den:Infinity;
  if(r<rmax){cur.push([sx+r*Math.cos(th),sy-r*Math.sin(th)]);}else if(cur.length){segs.push(cur);cur=[];}}
 if(cur.length)segs.push(cur);return segs;
}
const drawSegs=(segs,o)=>segs.map(q=>draw(q,1,o)).join('');
function eOfMorph(p){return .5*seg(p,.15,.4)+.4*seg(p,.55,.8);}
Object.assign(frontierDiagrams,{
 'fr-conic:morph':(p)=>{
  const sx=640,sy=262,A=220,e=eOfMorph(p),pp=A*(1-e*e);
  let s=drawSegs(conic(sx,sy,pp,e),{color:C.x,w:4})+dot(sx,sy,13,C.t)+label('太陽',sx,sy+40,{size:22,color:C.t,anchor:'middle'});
  const th=1.0,rr=pp/(1+e*Math.cos(th)),qx=sx+rr*Math.cos(th),qy=sy-rr*Math.sin(th);
  s+=line(sx,sy,sx+A*(1-e)+30,sy,{color:C.faint,w:2,dash:'5 6'})+line(sx,sy,qx,qy,{color:C.x,w:2.5})+dot(qx,qy,9,C.hi);
  s+=draw(Array.from({length:21},(_,i)=>[sx+40*Math.cos(th*i/20),sy-40*Math.sin(th*i/20)]),1,{color:C.hi,w:2.5})+tex('\\theta',sx+58,sy-22,{size:28,auto:false})+tex('r',(sx+qx)/2-16,(sy+qy)/2-4,{size:28,auto:false,color:C.x});
  s+=rect(30,30,330,90,{fill:C.hi,fo:.06,stroke:C.hi,rx:12})+tex('r=\\dfrac{p}{1+e\\cos\\theta}',195,82,{size:40});
  s+=label(`e = ${e.toFixed(2)}`,920,80,{size:34,color:C.hi,weight:700})+label(e<.02?'円':'楕円',920,130,{size:30,color:C.x});
  s+=label('e：離心率（つぶれ具合）',870,400,{size:22,color:C.dim})+label('θ：一番近い向きから測る角度',870,435,{size:22,color:C.dim})+label('p：軌道の大きさを決める長さ',870,470,{size:22,color:C.dim});
  return s;
 },
 'fr-conic:open':(p)=>{
  const sx=820,sy=262,pp=150;
  let s=fade(.35,drawSegs(conic(sx,sy,pp,.5),{color:C.x,w:3}))+label('e = 0.5',sx-330,sy+10,{size:22,color:C.dim,anchor:'end'});
  const g1=seg(p,.1,.45),g2=seg(p,.5,.85);
  const par=conic(sx,sy,pp,1,{th0:-Math.PI,th1:Math.PI,steps:720,rmax:1200}),hyp=conic(sx,sy,pp,1.5,{th0:-Math.PI,th1:Math.PI,steps:720,rmax:1200});
  s+=fade(g1,drawSegs(par,{color:C.v,w:4}))+fade(g1,label('e = 1',sx-150,90,{size:26,color:C.v,anchor:'end'}));
  s+=fade(g2,drawSegs(hyp,{color:C.a,w:4}))+fade(g2,label('e = 1.5',sx-300,60,{size:26,color:C.a,anchor:'end'}));
  s+=dot(sx,sy,13,C.t);
  s+=fade(seg(p,.2,.4),rect(30,420,560,70,{fill:C.v,fo:.08,stroke:C.v,rx:12})+label('e ≥ 1：開いた軌道 → 二度と戻らない',310,464,{size:26,color:C.ink,anchor:'middle'}));
  return s;
 },
 'fr-conic:speed':(p)=>{
  const A=axes({x:170,y:440,w:760,h:340,xmin:1,xmax:1.5,ymin:0,ymax:1.3,xticks:[1,1.1,1.2,1.3,1.4,1.5],yticks:[0.5,1],grid:true,xlabel:'',ylabel:'e',g:seg(p,0,.15),xcolor:C.v,ycolor:C.x});
  let s=A.svg+label('最初の速さ（円の速さを 1 とする）',A.X(1.25),505,{size:22,color:C.v,anchor:'middle'});
  s+=fade(seg(p,.1,.3),rect(A.X(1),A.Y(1.3),A.X(1.5)-A.X(1),A.Y(1)-A.Y(1.3),{fill:C.a,fo:.1,sw:0,rx:0})+label('開いた軌道',A.X(1.02),A.Y(1.12),{size:24,color:C.a})+label('楕円',A.X(1.02),A.Y(.55),{size:24,color:C.x}));
  const g=seg(p,.15,.75),vend=mix(1,Math.sqrt(2.25),g);
  s+=A.plot(v=>v*v-1,{from:1,to:1.5,p:g,color:C.hi,w:4});
  const pts=[[1,0,'円'],[Math.sqrt(1.5),.5,'e = 0.5'],[Math.sqrt(1.9),.9,'e = 0.9'],[Math.SQRT2,1,'√2 倍 → e = 1']];
  pts.forEach(([v,e,t],i)=>{const gi=seg(p,.2+i*.14,.3+i*.14);s+=fade(gi,dot(A.X(v),A.Y(e),9,C.hi)+label(t,A.X(v)+(i===3?-14:14),A.Y(e)+(i===3?-18:8),{size:22,color:C.ink,anchor:i===3?'end':'start'}));});
  s+=fade(seg(p,.8,1),label('（太陽と直角の向きに打ち出した場合）',1170,40,{size:22,color:C.dim,anchor:'end'}));
  return s;
 },
});

// ---- followups-2: angle as the clock, u = 1/r ------------------------------------
function trueAnom(M,e){const E=keplerE(M,e);return 2*Math.atan2(Math.sqrt(1+e)*Math.sin(E/2),Math.sqrt(1-e)*Math.cos(E/2));}
const polarPt=(sx,sy,pp,e,th)=>{const r=pp/(1+e*Math.cos(th));return [sx+r*Math.cos(th),sy-r*Math.sin(th),r];};
function thetaArc(sx,sy,th,rad=46){const k=Math.max(2,Math.ceil(24*Math.abs(th)/Math.PI));return draw(Array.from({length:k+1},(_,i)=>[sx+rad*Math.cos(th*i/k),sy-rad*Math.sin(th*i/k)]),1,{color:C.hi,w:2.5});}
function uAxes(x,w,ymax=1.6,{g=1,ymin=0,y=440,h=320}={}){
 const A=axes({x,y,w,h,xmin:0,xmax:TAU,ymin,ymax,xticks:[],yticks:[],xlabel:'',ylabel:'',g});
 let s=A.svg+fade(g,[[Math.PI,'\\pi'],[TAU,'2\\pi']].map(([u,t])=>line(A.X(u),A.Y(0)-6,A.X(u),A.Y(0)+6,{color:C.dim})+tex(t,A.X(u),A.Y(0)+34,{size:24,auto:false,color:C.dim})).join('')+tex('\\theta',x+w+44,A.Y(0)+8,{size:28,auto:false,color:C.dim}));
 return {A,svg:s};
}
Object.assign(frontierDiagrams,{
 'fr-u:clock':(p,o)=>{
  const sx=560,sy=262,e=.5,pp=150,T=sceneT(o),M=TAU*T/7,th=trueAnom(M%TAU,e),thTot=Math.floor(M/TAU)*TAU+((th%TAU)+TAU)%TAU;
  let s=drawSegs(conic(sx,sy,pp,e),{color:C.faint,w:2})+dot(sx,sy,13,C.t)+line(sx,sy,sx+pp/(1+e)+40,sy,{color:C.faint,w:2,dash:'5 6'});
  const [px,py]=polarPt(sx,sy,pp,e,th);
  s+=line(sx,sy,px,py,{color:C.x,w:2.5})+thetaArc(sx,sy,((th%TAU)+TAU)%TAU)+dot(px,py,11,C.hi);
  s+=label('θ',sx+60,sy-16,{size:26,color:C.hi});
  s+=label(`θ = ${Math.round(thTot*180/Math.PI)}°`,900,90,{size:34,color:C.hi,weight:700})+fade(seg(p,.3,.6),label('θ は増え続ける',900,150,{size:26,color:C.ink})+label('→ 時計の代わりになる',900,190,{size:26,color:C.ink}));
  s+=label('太陽',sx,sy+40,{size:22,color:C.t,anchor:'middle'});
  return s;
 },
 'fr-u:plot':(p)=>{
  const sx=230,sy=240,e=.5,pp=90,u=lin(p,.05,.85),th=TAU*u;
  let s=drawSegs(conic(sx,sy,pp,e),{color:C.faint,w:2})+dot(sx,sy,10,C.t);
  const [px,py,r]=polarPt(sx,sy,pp,e,th);s+=line(sx,sy,px,py,{color:C.x,w:3})+dot(px,py,9,C.hi)+thetaArc(sx,sy,th,30);
  s+=label(`r が小さい ⇔ u が大きい`,60,470,{size:22,color:C.dim});
  const {A,svg}=uAxes(480,620,1.7);s+=svg+label('u（距離の逆数）',A.X(0),A.Y(1.7)-6,{size:24,color:C.hi,anchor:'middle'});
  s+=A.plot(t=>1+e*Math.cos(t),{from:0,to:TAU,p:u,color:C.hi,w:4});
  s+=dot(A.X(th),A.Y(1+e*Math.cos(th)),9,C.hi)+line(A.X(th),A.Y(0),A.X(th),A.Y(1+e*Math.cos(th)),{color:C.hi,w:2,dash:'4 6'});
  s+=fade(seg(p,.85,1),label('なめらかな波',A.X(4.2),A.Y(1.35),{size:26,color:C.hi}));
  return s;
 },
 'fr-radial':(p,o)=>{
  const sx=250,sy=262,R=170,T=sceneT(o),a=.9*T,px=sx+R*Math.cos(a),py=sy-R*Math.sin(a);
  let s=ring(sx,sy,R,{color:C.faint,w:2})+dot(sx,sy,13,C.t)+line(sx,sy,px,py,{color:C.x,w:2.5})+dot(px,py,11,C.hi);
  s+=arrow(px,py,px-70*Math.sin(a),py-70*Math.cos(a),{color:C.v,w:4,head:12});
  s+=arrow(px,py,mix(px,sx,.5),mix(py,sy,.5),{color:C.a,w:5,head:14,g:seg(p,.45,.65)});
  const parts=[['\\ddot r',C.ink],['-\\,r\\dot{\\theta}^2',C.a],['=-\\dfrac{GM}{r^2}',C.F]],sz=44,gap=10,ws=parts.map(([t])=>texWidth(t,sz,false));
  let x=520;const cxs=[];
  parts.forEach(([t,c],i)=>{const g=seg(p,i*.15,i*.15+.2);s+=fade(g,tex(t,x+ws[i]/2,150,{size:sz,auto:false,color:c}));cxs.push(x+ws[i]/2);x+=ws[i]+gap;});
  const notes=[['半径の伸び縮み',C.ink],['円運動の中心向き',C.a],['万有引力',C.F]];
  notes.forEach(([t,c],i)=>{const g=seg(p,.35+i*.15,.5+i*.15);s+=fade(g,line(cxs[i],195,cxs[i],225+i*50,{color:c,w:2})+label(t,cxs[i],250+i*50,{size:24,color:c,anchor:'middle'}));});
  s+=fade(seg(p,.8,1),label('G：万有引力定数　M：太陽の質量',1170,470,{size:22,color:C.dim,anchor:'end'}));
  return s;
 },
 'fr-spring':(p,o)=>{
  const T=sceneT(o),ph=T*1.4;
  // left: spring and mass, and its x–t trace
  const xm=260+70*Math.cos(ph);
  let s=line(60,150,60,230,{color:C.dim,w:4});
  const pts=[[60,190],[80,190]];for(let i=0;i<=16;i++)pts.push([80+(xm-110)*i/16,190+(i===0||i===16?0:(i%2?14:-14))]);pts.push([xm-30,190]);
  s+=draw(pts,1,{color:C.dim,w:3})+rect(xm-30,165,60,50,{fill:C.x,fo:.3,rx:6});
  s+=tex("\\ddot x+x=0",260,90,{size:38})+label('ばね：時間で振動',260,300,{size:26,color:C.ink,anchor:'middle'});
  const L=axes({x:60,y:440,w:400,h:100,xmin:0,xmax:TAU,ymin:-1.2,ymax:1.2,g:1});
  s+=L.svg+L.plot(t=>Math.cos(t),{from:0,to:TAU,p:seg(p,0,.5),color:C.x,w:3})+label('t',480,448,{size:22,color:C.t});
  // right: orbit equation
  const {A,svg}=uAxes(680,440,1.7,{h:260,y:440});
  s+=svg+line(A.X(0),A.Y(1),A.X(TAU),A.Y(1),{color:C.F,w:2,dash:'6 6'})+tex('\\dfrac{GM}{h^2}',A.X(TAU)+44,A.Y(1)+8,{size:26,auto:false,color:C.F});
  s+=A.plot(t=>1+.5*Math.cos(t),{from:0,to:TAU,p:seg(p,.2,.7),color:C.hi,w:4});
  s+=tex("u''+u=\\dfrac{GM}{h^2}",900,90,{size:38,auto:false})+label('軌道：角度で振動',900,150,{size:26,color:C.ink,anchor:'middle'});
  s+=fade(seg(p,.75,1),label('同じ形！',600,60,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
});

// ---- followups-3: the cosine wave becomes an ellipse --------------------------------
Object.assign(frontierDiagrams,{
 'fr-wave':(p,o)=>{
  const u=lin(p,.05,.85),th=TAU*u,w=Math.cos(th);
  const A=axes({x:340,y:262+150,w:760,h:300,xmin:0,xmax:TAU,ymin:-1.2,ymax:1.2,xticks:[],yticks:[],g:1});
  let s='';
  s+=line(A.X(0),A.Y(0),A.X(TAU)+20,A.Y(0),{color:C.dim,w:2.5})+line(A.X(0),A.Y(1.3),A.X(0),A.Y(-1.3),{color:C.dim,w:2.5});
  s+=[[Math.PI,'\\pi'],[TAU,'2\\pi']].map(([q,t])=>line(A.X(q),A.Y(0)-6,A.X(q),A.Y(0)+6,{color:C.dim})+tex(t,A.X(q),A.Y(0)+34,{size:24,auto:false,color:C.dim})).join('')+tex('\\theta',A.X(TAU)+44,A.Y(0)+8,{size:28,auto:false,color:C.dim})+tex('w',A.X(0),A.Y(1.3)-18,{size:28,auto:false,color:C.hi});
  s+=A.plot(t=>Math.cos(t),{from:0,to:TAU,p:u,color:C.hi,w:4})+dot(A.X(th),A.Y(w),9,C.hi);
  // a spring whose stretch is w
  const my=A.Y(w),top=40;const pts=[[150,top],[150,top+14]];for(let i=0;i<=14;i++)pts.push([150+(i===0||i===14?0:(i%2?14:-14)),top+14+(my-30-top-14)*i/14]);
  s+=line(100,top,200,top,{color:C.dim,w:4})+draw(pts,1,{color:C.dim,w:3})+rect(120,my-30,60,60,{fill:C.x,fo:.3,rx:6})+line(180,my,A.X(th),my,{color:C.hi,w:1.5,dash:'4 6'});
  s+=fade(seg(p,.5,.8),tex('w=C\\cos\\theta',870,70,{size:38,auto:false})+label('振れ幅 C',A.X(0)+14,A.Y(1)-14,{size:22,color:C.hi}));
  return s;
 },
});
function polarScene(p,{e,pp=150,sx=820,sy=262,th,full=false,nums=0,g0=1}){
 const {A,svg}=uAxes(50,330,1.7,{h:300,y:420});
 let s=svg+label('u（距離の逆数）',A.X(0),A.Y(1.7)-8,{size:22,color:C.hi,anchor:'start'});
 s+=A.plot(t=>1+e*Math.cos(t),{from:0,to:TAU,p:full?1:th/TAU,color:C.hi,w:3});
 if(!full)s+=dot(A.X(th),A.Y(1+e*Math.cos(th)),8,C.hi);
 const seg0=conic(sx,sy,pp,e,{th0:0,th1:full?TAU:Math.max(.001,th),steps:Math.max(8,Math.ceil(360*(full?1:th/TAU)))});
 s+=dot(sx,sy,13,C.t)+drawSegs(seg0,{color:C.x,w:4});
 if(!full){const [px,py]=polarPt(sx,sy,pp,e,th);s+=line(sx,sy,px,py,{color:C.x,w:2.5})+dot(px,py,10,C.hi)+thetaArc(sx,sy,th,36)+tex('r',(sx+px)/2+14,(sy+py)/2-10,{size:28,auto:false,color:C.x});}
 s+=label('逆数を取る →',400,120,{size:24,color:C.dim});
 if(nums>0){
  const g1=seg(nums,.05,.3),g2=seg(nums,.35,.6),g3=seg(nums,.65,.9);
  s+=fade(g1,line(sx,sy,sx+pp/(1+e),sy,{color:C.hi,w:4})+tex('\\tfrac23p',sx+pp/(1+e)/2,sy+40,{size:30,auto:false,color:C.hi}));
  s+=fade(g2,line(sx,sy,sx-pp/(1-e),sy,{color:C.hi,w:4})+tex('2p',sx-pp/(1-e)/2,sy+40,{size:30,auto:false,color:C.hi}));
  s+=fade(g3,line(sx,sy,sx,sy-pp,{color:C.hi,w:4})+tex('p',sx+22,sy-pp/2,{size:30,auto:false,color:C.hi}));
 }
 return s;
}
Object.assign(frontierDiagrams,{
 'fr-polar:draw':(p)=>polarScene(p,{e:.5,th:TAU*lin(p,.05,.9)})+fade(seg(p,.9,1),label('閉じた曲線',1100,480,{size:26,color:C.x,anchor:'end'})),
 'fr-polar:nums':(p)=>polarScene(p,{e:.5,full:true,nums:p})+label('e = 0.5',1160,60,{size:30,color:C.hi,anchor:'end'}),
});
function shapeScene(e,{th=TAU,pp=100,sx=860,sy=262}={}){
 const {A,svg}=uAxes(40,340,2.4,{ymin:-.6,h:330,y:430});
 let s=svg+label('u（距離の逆数）',A.X(0)+8,A.Y(2.4)-6,{size:22,color:C.hi});
 s+=line(A.X(0),A.Y(0),A.X(TAU),A.Y(0),{color:C.a,w:2})+label('u = 0',A.X(.15),A.Y(0)+30,{size:22,color:C.a});
 s+=A.plot(t=>1+e*Math.cos(t),{from:0,to:TAU,p:1,color:C.hi,w:3});
 if(e>1){const t0=Math.acos(-1/e);s+=dot(A.X(t0),A.Y(0),8,C.a)+dot(A.X(TAU-t0),A.Y(0),8,C.a);
  s+=poly([[A.X(t0),A.Y(0)],...Array.from({length:30},(_,i)=>{const t=mix(t0,TAU-t0,i/29);return [A.X(t),A.Y(1+e*Math.cos(t))];}),[A.X(TAU-t0),A.Y(0)]],{fill:C.a,fo:.25});}
 const clip=`<clipPath id="frc"><rect x="420" y="0" width="780" height="515"/></clipPath>`;
 const segs=e<1?conic(sx,sy,pp,e,{th0:0,th1:th}):conic(sx,sy,pp,e,{th0:-Math.PI,th1:Math.PI,steps:720,rmax:1500});
 s+=`${clip}<g clip-path="url(#frc)">${drawSegs(segs,{color:C.x,w:4})}</g>`+dot(sx,sy,13,C.t);
 const name=e<.01?'円':e<1?'楕円':'開いた軌道';
 s+=label(`e = ${e.toFixed(2)}`,1170,60,{size:32,color:C.hi,anchor:'end',weight:700})+label(name,1170,105,{size:28,color:e<1?C.x:C.a,anchor:'end'});
 return s;
}
Object.assign(frontierDiagrams,{
 'fr-shape:e0':(p)=>shapeScene(0,{th:TAU*seg(p,.05,.7)}),
 'fr-shape:ell':(p)=>shapeScene(.7*seg(p,.05,.6))+fade(seg(p,.6,.85),label('波はゼロより上 → 距離は有限',230,490,{size:22,color:C.hi,anchor:'middle'})),
 'fr-open':(p)=>{const e=mix(1,1.35,seg(p,.2,.65));
  return shapeScene(e)+fade(seg(p,.35,.6),label('u = 0 → 距離は無限大',230,490,{size:22,color:C.a,anchor:'middle'}));},
});

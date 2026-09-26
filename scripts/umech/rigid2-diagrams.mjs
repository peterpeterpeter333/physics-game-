// 単元9 回転の運動方程式 (rigid2) — pictures. Viewbox 1200×515.
// Colours: translation part of a velocity C.x (cyan), rotation part Rω / ω C.v (purple), their sum C.hi,
// force and torque N C.F, angular momentum L C.p, energy C.E, time C.t.
import {C,clamp,mix,smooth,seg,lin,fmt,fade,label,line,rect,dot,ring,draw,poly,arrow,highlight,ground,block,tex,cart} from './anim.mjs';

const TAU=2*Math.PI;
const at=ctx=>(ctx?.scene?.captions?.[ctx.k]?.start??0)+(ctx?.t??0);
const n2=v=>Number(v.toFixed(2));

function curved(cx,cy,r,a0,a1,{color=C.F,w=5,g=1,head=16}={}){
 if(g<=0.01)return '';
 const a=mix(a0,a1,g),N=40,pts=Array.from({length:N+1},(_,i)=>{const u=mix(a0,a,i/N);return [cx+r*Math.cos(u),cy+r*Math.sin(u)];});
 const dir=Math.sign(a1-a0)||1,tx=-Math.sin(a)*dir,ty=Math.cos(a)*dir,ex=cx+r*Math.cos(a),ey=cy+r*Math.sin(a);
 const bx=ex-tx*head,by=ey-ty*head,nx=-ty,ny=tx;
 return draw(pts.slice(0,-2),1,{color,w})+`<polygon points="${n2(ex+tx*2)},${n2(ey+ty*2)} ${n2(bx+nx*head*.55)},${n2(by+ny*head*.55)} ${n2(bx-nx*head*.55)},${n2(by-ny*head*.55)}" fill="${color}"/>`;
}
// Wheel whose marker spoke has turned by phi (clockwise on screen = rolling to the right).
// The marked rim point starts at the bottom (phi=0).
function wheel(cx,cy,R,phi,{marker=true,fo=.12,col='#8aa0c4'}={}){
 let s=`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${R}" fill="${col}" fill-opacity="${fo}" stroke="${col}" stroke-width="4"/>`;
 for(let k=0;k<4;k++){const a=phi+k*Math.PI/2;s+=line(cx,cy,cx-R*Math.sin(a),cy+R*Math.cos(a),{color:col,w:2,opacity:.6});}
 s+=dot(cx,cy,6,C.ink);
 if(marker)s+=dot(cx-R*Math.sin(phi),cy+R*Math.cos(phi),9,C.hi);
 return s;
}
// Rotation velocity (screen coords) of a point at offset (dx,dy) from the centre, rolling right with |Rω| scaled to len at the rim.
const rotV=(dx,dy,R,len)=>[-dy*len/R,dx*len/R];

// ---------------------------------------------------------------- intro
const GY=430;
export const rigid2Diagrams={
 'r2-q':(p)=>{
  const R=90,x=150+700*lin(p,0,1),phi=(x-150)/R;
  let s=ground(40,1160,GY)+wheel(x,GY-R,R,phi,{marker:false});
  s+=dot(x,GY,10,C.hi)+fade(seg(p,.1,.3),label('？',x+14,GY-12,{size:30,color:C.hi,weight:700}));
  s+=arrow(x,GY-R,x+110,GY-R,{color:C.x,w:5,head:14})+tex('v',x+128,GY-R+10,{size:32,anchor:'start'});
  const g=seg(p,.35,.7);
  s+=fade(g,label('地面に触れている点の速さは？',600,55,{size:30,color:C.ink,anchor:'middle',weight:700}));
  ['v','0','2v'].forEach((c,i)=>{const cx=420+i*180,gi=seg(p,.45+i*.1,.6+i*.1);s+=fade(gi,rect(cx-60,85,120,62,{fill:C.hi,fo:.08,stroke:C.hi,rx:12})+tex(c,cx,126,{size:38}));});
  return s;
 },
 'r2-parts:slide':(p)=>partsScene(p,1),
 'r2-parts:spin':(p,ctx)=>partsScene(p,2,ctx),
 'r2-parts:merge':(p,ctx)=>partsScene(p,3,ctx),
 'r2-sum:bottom':(p)=>sumScene(p,1),
 'r2-sum:top':(p)=>sumScene(p,2),
 'r2-sum:num':(p)=>sumScene(p,3),
 'r2-cyc':(p)=>cycScene(p,1),
 'r2-cyc:cusp':(p)=>cycScene(p,2),
 'r2-cyc:sum':(p)=>cycScene(p,3),
 // ---------------------------------------------------------------- middle
 'r2m-pair':(p,ctx)=>pairScene(p,ctx,1),
 'r2m-pair:table':(p,ctx)=>pairScene(p,ctx,2),
 'r2m-spin':(p)=>{
  const t=3*lin(p,.05,.95),w=3*t;// α = 3 rad/s², starts from rest
  const cx=250,cy=260,R=130,phi=1.5*t*t/2;let s='';
  s+=wheel(cx,cy,R,phi,{marker:true,col:'#8aa0c4'});
  s+=arrow(cx+R,cy-40,cx+R,cy+60,{color:C.F,w:6,head:16})+label('一定の力',cx+R+16,cy+40,{size:22,color:C.F});
  s+=curved(cx,cy,R+34,-2.4,-.9,{color:C.F,w:5,head:14})+label('トルク N = 6',cx,cy-R-60,{size:26,color:C.F,anchor:'middle'});
  s+=label('I = 2',cx,cy+R+50,{size:26,color:C.x,anchor:'middle'});
  // ω–t graph
  const X=q=>560+q*170,Y=q=>440-q*33;
  s+=line(X(0),Y(0),X(3.2),Y(0),{color:C.dim,w:2.5})+line(X(0),Y(0),X(0),Y(10),{color:C.dim,w:2.5});
  s+=label('時刻 t [s]',X(1.6),Y(0)+64,{size:22,color:C.t,anchor:'middle'})+label('角速度 ω',X(0)-10,Y(10)-12,{size:22,color:C.v});
  [1,2,3].forEach(q=>{s+=label(String(q),X(q),Y(0)+30,{size:22,color:C.dim,anchor:'middle'});s+=label(String(3*q),X(0)-12,Y(3*q)+8,{size:22,color:C.dim,anchor:'end'})+line(X(0),Y(3*q),X(3.2),Y(3*q),{color:C.grid,w:1.5});});
  s+=draw([[X(0),Y(0)],[X(t),Y(w)]],1,{color:C.v,w:4})+dot(X(t),Y(w),8,C.v);
  s+=label(`ω = ${fmt(w,1)}`,X(t)+14,Y(w)-10,{size:24,color:C.v});
  return s+fade(seg(p,.6,.9),label('1秒ごとに 3 ずつ増える',1150,90,{size:26,color:C.hi,anchor:'end'}));
 },
 'r2m-wheel':(p,ctx)=>wheelFriction(p,ctx,1),
 'r2m-wheel:torque':(p,ctx)=>wheelFriction(p,ctx,2),
 // ---------------------------------------------------------------- advanced: the race
 'r2a-race:setup':(p)=>raceScene(0,{intro:seg(p,0,.6)}),
 'r2a-race:run':(p)=>raceScene(lin(p,.03,.95)),
 'r2a-race:split':(p)=>raceScene(1,{bars:seg(p,.1,.8)}),
 'r2a-slider':(p)=>{
  const X=q=>200+q*700,Y=v=>440-v*70;let s='';
  s+=line(X(0),Y(0),X(1.08),Y(0),{color:C.dim,w:2.5})+line(X(0),Y(0),X(0),Y(5),{color:C.dim,w:2.5});
  [0,.4,.5,1].forEach(q=>{s+=line(X(q),Y(0)-6,X(q),Y(0)+6,{color:C.dim})+label(q===.4?'0.4':q===.5?'0.5':String(q),X(q),Y(0)+30,{size:22,color:C.dim,anchor:'middle'});});
  [1,2,3,4].forEach(v=>{s+=label(String(v),X(0)-12,Y(v)+8,{size:22,color:C.dim,anchor:'end'})+line(X(0),Y(v),X(1.05),Y(v),{color:C.grid,w:1.5});});
  s+=tex('I/(MR^2)',X(1.08)+20,Y(0)+10,{size:30,anchor:'start',auto:false})+label('坂の下の速さ [m/s]',X(0),Y(5)-18,{size:22,color:C.x,anchor:'middle'});
  const vf=q=>Math.sqrt(2*9.8/(1+q));
  s+=draw(Array.from({length:101},(_,i)=>[X(i/100),Y(vf(i/100))]),seg(p,.05,.4),{color:C.x,w:4});
  const q=mix(0,1,seg(p,.4,.9));
  s+=fade(seg(p,.35,.45),line(X(q),Y(0),X(q),Y(vf(q)),{color:C.hi,w:2,dash:'6 6'})+dot(X(q),Y(vf(q)),10,C.hi)+label(`${fmt(vf(q),2)} m/s`,X(q)+16,Y(vf(q))-14,{size:24,color:C.hi}));
  const marks=[[0,'箱'],[.4,'球'],[.5,'円板'],[1,'輪']];
  marks.forEach(([m,nm],i)=>{if(q+.001>=m)s+=dot(X(m),Y(vf(m)),7,C.x)+label(nm,X(m)+(i===0?16:i===2?14:-10),Y(vf(m))+(i===0?-14:i===2?30:-16),{size:22,color:C.ink,anchor:i===1||i===3?'end':'start'});});
  return s+label('高さ 1 m',1150,80,{size:24,color:C.dim,anchor:'end'})+fade(seg(p,.5,.9),label('回しにくい形ほど、遅い',1150,120,{size:26,color:C.hi,anchor:'end'}));
 },
 'r2a-result':(p)=>resultScene(p,1),
 'r2a-result:why':(p)=>resultScene(p,2),
 // ---------------------------------------------------------------- followups-6: the skater
 'r2f-skater':(p,ctx)=>skaterScene(p,ctx,1),
 'r2f-skater:pull':(p,ctx)=>skaterScene(p,ctx,2),
 'r2f-skater:note':(p,ctx)=>skaterScene(p,ctx,3),
 'r2f-bars':(p,ctx)=>skaterScene(p,ctx,4),
 'r2f-arm':(p)=>armScene(p,1),
 'r2f-arm:work':(p)=>armScene(p,2),
 'r2f-arm:end':(p)=>armScene(p,3),
};

// Points on the rim used for velocity arrows (offsets from centre, in units of R).
const PTS=[[0,1],[0,-1],[1,0],[-1,0],[.707,.707],[-.707,.707],[.707,-.707],[-.707,-.707]];
function partsScene(p,stage,ctx){
 const R=100,len=85;let s='';
 const LX=300,RX=900,cy=260;
 // left panel: slides without turning
 const slideX=LX-60+120*(stage===1?lin(p,0,1):1);
 const mergeU=stage===3?seg(p,.1,.55):0;
 const lx=mix(slideX,600,mergeU),rx=mix(RX,600,mergeU);
 const phiR=stage>=2?.9*at(ctx):0;
 if(mergeU<.99){
  s+=fade(1-mergeU,line(LX-200,cy+R,LX+200,cy+R,{color:C.dim,w:3})+label('① 回らずに滑るだけ',LX,60,{size:26,color:C.x,anchor:'middle'}));
 }
 s+=wheel(lx,cy,R,0,{marker:false});
 PTS.concat([[0,0]]).forEach(([dx,dy])=>{s+=arrow(lx+dx*R,cy+dy*R,lx+dx*R+len,cy+dy*R,{color:C.x,w:4,head:12,opacity:.95});});
 s+=fade(stage===1?seg(p,.3,.6):1,tex('v',lx+len+36,cy+10,{size:32})+label('どの点も同じ',lx,cy+R+50,{size:24,color:C.x,anchor:'middle'}));
 if(stage>=2){
  const g=stage===2?seg(p,0,.3):1;
  s+=fade(g*(1-mergeU),label('② その場で回るだけ',RX,60,{size:26,color:C.v,anchor:'middle'}));
  s+=fade(g,wheel(rx,cy,R,phiR,{marker:false,col:'#b49bff',fo:.08}));
  const ga=stage===2?seg(p,.25,.6):1;
  PTS.forEach(([dx,dy])=>{const [vx,vy]=rotV(dx,dy,1,len);s+=arrow(rx+dx*R,cy+dy*R,rx+dx*R+vx,cy+dy*R+vy,{color:C.v,w:4,head:12,g:ga});});
  s+=fade(stage===2?seg(p,.55,.85):1-mergeU,tex('R\\omega',rx+len+30,cy-R+10,{size:32,anchor:'start'})+label('縁の速さ',rx,cy+R+50,{size:24,color:C.v,anchor:'middle'}));
  s+=fade(stage===2?seg(p,.6,.9):1-mergeU,line(rx,cy,rx+R*.7,cy+R*.7,{color:C.t,w:2.5})+tex('R',rx+R*.35+18,cy+R*.35+2,{size:28,anchor:'start'}));
 }
 if(stage===3)s+=fade(seg(p,.55,.85),label('転がり ＝ ① ＋ ②',600,60,{size:32,color:C.hi,anchor:'middle',weight:700}));
 return s;
}

// Vector sums at the contact point, the centre, the top (and finally every rim point).
function sumScene(p,stage){
 const cx=600,cy=230,R=140,len=110,gy=cy+R;let s=line(250,gy,950,gy,{color:C.dim,w:3})+wheel(cx,cy,R,0,{marker:false});
 if(stage===1){
  // contact point: translation (forward) and rotation (backward), drawn on separate rows so both stay visible
  s+=dot(cx,gy,9,C.ink);
  s+=arrow(cx,gy+30,cx+len,gy+30,{color:C.x,w:6,head:16,g:seg(p,.05,.3)})+fade(seg(p,.05,.3),label('滑る分 v',cx+len+16,gy+38,{size:24,color:C.x}));
  s+=arrow(cx+len,gy+62,cx,gy+62,{color:C.v,w:6,head:16,g:seg(p,.35,.6)})+fade(seg(p,.35,.6),label('回る分 Rω（後ろ向き）',cx+len+16,gy+70,{size:24,color:C.v}));
  s+=fade(seg(p,.7,.95),dot(cx,gy,14,C.hi)+label('足すと 0',cx-30,gy-18,{size:30,color:C.hi,anchor:'end',weight:700}));
  return s;
 }
 s+=dot(cx,gy,12,C.hi)+label('0',cx-24,gy-14,{size:28,color:C.hi,anchor:'end',weight:700});
 const g2=stage===2?1:1,ty=cy-R;
 const a1=stage===2?seg(p,.05,.3):1,a2=stage===2?seg(p,.3,.55):1,a3=stage===2?seg(p,.6,.8):1;
 s+=arrow(cx,ty,cx+len,ty,{color:C.x,w:6,head:16,g:a1})+arrow(cx+len,ty,cx+2*len,ty,{color:C.v,w:6,head:16,g:a2});
 s+=fade(a2,label('v',cx+len/2,ty-14,{size:26,color:C.x,anchor:'middle'})+label('Rω',cx+1.5*len,ty-14,{size:26,color:C.v,anchor:'middle'}));
 s+=fade(a2,label('上：2v',cx+2*len+24,ty+9,{size:28,color:C.hi,weight:700}));
 s+=arrow(cx,cy,cx+len,cy,{color:C.x,w:6,head:16,g:a3})+fade(a3,label('中心：v',cx+len+30,cy+40,{size:28,color:C.x}));
 if(stage===3){
  const g=seg(p,.05,.45);
  PTS.slice(2).forEach(([dx,dy])=>{const [vx,vy]=rotV(dx,dy,1,len);s+=arrow(cx+dx*R,cy+dy*R,cx+dx*R+len+vx,cy+dy*R+vy,{color:C.hi,w:4,head:12,g,opacity:.8});});
  s+=fade(seg(p,.4,.7),rect(40,40,300,170,{fill:C.x,fo:.06,stroke:C.dim,rx:12})+label('v ＝ 2 m/s なら',60,82,{size:24,color:C.ink})+label('上　4 m/s',80,122,{size:26,color:C.hi})+label('中心 2 m/s',80,158,{size:26,color:C.x})+label('下　0 m/s',80,194,{size:26,color:C.hi}));
  s+=fade(seg(p,.7,.95),label('接地点を中心に回っているように動く',600,470,{size:24,color:C.dim,anchor:'middle'}));
 }
 void g2;return s;
}

// A rim point traces a cycloid; it stops for an instant at every touch-down.
function cycScene(p,stage){
 const R=70,x0=120,gy=440,cy=gy-R;let s=ground(60,1160,gy);
 const cyc=(ph)=>[x0+R*(ph-Math.sin(ph)),cy+R*Math.cos(ph)];
 const phMax=(1140-x0)/R;
 let ph;
 if(stage===1)ph=phMax*lin(p,0,.95);
 else if(stage===2){ph=mix(TAU-1.3,TAU+1.3,lin(p,.05,.95));}
 else ph=TAU*2+.6;
 const full=stage===1?ph:phMax;
 s+=draw(Array.from({length:241},(_,i)=>cyc(full*i/240)),1,{color:C.hi,w:3,opacity:stage===1?1:.6});
 const cx=x0+R*ph;
 s+=wheel(cx,cy,R,ph);
 [TAU,2*TAU].forEach(c=>{if(full>=c-.01)s+=dot(x0+R*c,gy,8,C.hi);});
 if(stage===1)s+=fade(seg(p,.6,.9),label('サイクロイド',600,80,{size:30,color:C.hi,anchor:'middle',weight:700}));
 if(stage===2){
  const [px,py]=cyc(ph),sp=2*Math.abs(Math.sin(ph/2)),ang=Math.atan2(Math.sin(ph),1-Math.cos(ph));// velocity direction of the marked point
  const vx=1-Math.cos(ph),vy=-Math.sin(ph),L=Math.hypot(vx,vy)||1,len=60*sp;
  if(len>2)s+=arrow(px,py,px+len*vx/L,py+len*vy/L,{color:C.hi,w:5,head:14});
  s+=label(`印の点の速さ ${fmt(sp,2)} v`,600,80,{size:30,color:C.hi,anchor:'middle'});
  s+=fade(seg(p,.4,.6),highlight(x0+R*TAU-60,gy-40,120,70,1)+label('とがった点：一瞬止まる',x0+R*TAU,gy+50,{size:24,color:C.hi,anchor:'middle'}));
  void ang;
 }
 if(stage===3){
  s+=fade(seg(p,.05,.35),rect(250,60,700,110,{fill:C.hi,fo:.08,stroke:C.hi,rx:14})+label('滑らない ＝ 触れた瞬間は止まっている',600,125,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.8),label('地面をこすらない → 滑り摩擦で削られない',600,215,{size:26,color:C.ink,anchor:'middle'}));
 }
 return s;
}

// Cart (F → a) next to a disc on an axle (N → α); then the dictionary.
function pairScene(p,ctx,stage){
 let s='';
 if(stage===1){
  const t=lin(p,0,1)*2.2,x=270+28*t*t;
  s+=ground(60,560,380)+cart(x,380,{w:130,h:60,color:C.x,text:'m'});
  s+=arrow(x-160,335,x-70,335,{color:C.F,w:7,head:16})+tex('F',x-178,345,{size:34,anchor:'end'});
  s+=arrow(x-20,270,x-20+30*t+.1,270,{color:C.v,w:5,head:12})+label('速くなる',x-20,245,{size:22,color:C.v});
  const cx=880,cy=260,R=110,phi=.9*t*t;
  s+=wheel(cx,cy,R,phi,{marker:true});
  s+=arrow(cx+R,cy-40,cx+R,cy+60,{color:C.F,w:6,head:16})+line(cx,cy,cx+R,cy,{color:C.t,w:3,dash:'6 5'})+label('うで',cx+R/2,cy+30,{size:22,color:C.t,anchor:'middle'});
  s+=curved(cx,cy,R+30,-2.3,-.9,{color:C.F,w:5,head:14});
  s+=fade(seg(p,.3,.6),label('トルク N ＝ 力 × うでの長さ',cx,cy+R+75,{size:26,color:C.F,anchor:'middle'})+tex('N',cx,cy-R-60,{size:40}));
  s+=fade(seg(p,.1,.3),label('押す力',300,460,{size:24,color:C.F,anchor:'middle'})+label('回す効き目',880,40,{size:24,color:C.F,anchor:'middle'}));
  return s+fade(seg(p,.55,.85),label('単位のニュートンとは別物',880,500,{size:22,color:C.dim,anchor:'middle'}));
 }
 const rows=[['m','I','質量','慣性モーメント'],['a','\\alpha','加速度','角加速度'],['F','N','力','トルク'],['p','L','運動量','角運動量']];
 s+=label('並進',380,70,{size:28,color:C.ink,anchor:'middle',weight:700})+label('回転',820,70,{size:28,color:C.ink,anchor:'middle',weight:700});
 rows.forEach(([a,b,ja,jb],i)=>{const y=145+i*88,g=seg(p,.05+i*.17,.2+i*.17);
  s+=fade(g,tex(a,300,y,{size:44})+label(ja,350,y+10,{size:24,color:C.dim})+arrow(520,y-4,650,y-4,{color:C.hi,w:3,head:12})+tex(b,740,y,{size:44})+label(jb,790,y+10,{size:24,color:C.dim}));});
 return s+fade(seg(p,.85,1),label('α：1秒あたりの角速度の増え方',600,500,{size:24,color:C.v,anchor:'middle'}));
}

// A wheel (disc) pulled at its centre; static friction f at the contact point also gives a torque fR.
function wheelFriction(p,ctx,stage){
 const R=110,gy=420,T=at(ctx),x=250+12*T,phi=(x-250)/R,cy=gy-R;let s=ground(60,1160,gy);
 s+=wheel(x,cy,R,phi);
 s+=arrow(x,cy,x+170,cy,{color:C.F,w:7,head:18})+tex('F',x+190,cy+10,{size:36,anchor:'start'});
 const gf=stage===1?seg(p,.35,.65):1;
 s+=arrow(x,gy,x-90,gy,{color:C.F,w:6,head:16,g:gf})+fade(gf,tex('f',x-110,gy-10,{size:36,anchor:'end'}));
 s+=fade(stage===1?seg(p,.05,.3):1,label('質量 M、半径 R の円板',900,80,{size:24,color:C.dim,anchor:'middle'}));
 if(stage===1)s+=fade(seg(p,.6,.9),label('摩擦力 f：滑らせまいと、床が逆向きに押す',900,130,{size:24,color:C.F,anchor:'middle'}));
 if(stage===2){
  s+=line(x,cy,x,gy,{color:C.t,w:3,dash:'6 5'})+tex('R',x+14,cy+R/2+8,{size:30,anchor:'start'});
  s+=curved(x,cy,R+30,Math.PI*.3,Math.PI*.85,{color:C.v,w:5,head:14,g:seg(p,.2,.55)});
  s+=fade(seg(p,.4,.7),label('トルク fR で回り始める',900,130,{size:26,color:C.v,anchor:'middle'}));
  s+=fade(seg(p,.6,.9),label('f は、重心を引き戻しもする',900,180,{size:26,color:C.F,anchor:'middle'}));
 }
 return s;
}

// Four lanes on the same slope: box (slides, no friction), sphere, disc, hoop.
const RACERS=[['箱（摩擦なし）',0],['球',.4],['円板',.5],['輪',1]];
function raceScene(u,{intro=1,bars=0}={}){
 let s='';
 const tHoop=Math.sqrt(2);// finishing times ∝ sqrt(1+k); the hoop is last
 RACERS.forEach(([name,k],i)=>{
  const col=i%2,row=Math.floor(i/2),ox=30+col*590,oy=20+row*250,x0=ox+40,y0=oy+50,x1=ox+500,y1=oy+200;
  const ang=Math.atan2(y1-y0,x1-x0),L=Math.hypot(x1-x0,y1-y0),r=24;
  s+=poly([[x0,y0],[x1,y1],[x0,y1]],{fill:'#3a4a66',fo:.35,stroke:C.dim,sw:2});
  s+=line(x1,y1-44,x1,y1,{color:C.hi,w:3});
  const tf=Math.sqrt(1+k)/tHoop,tt=u*1.02,d=clamp((tt/tf)**2)*(L-r-10),nx=Math.sin(ang),ny=-Math.cos(ang);
  const px=x0+Math.cos(ang)*(d+r)+nx*r,py=y0+Math.sin(ang)*(d+r)+ny*r;
  if(k===0)s+=`<g transform="rotate(${n2(ang*180/Math.PI)} ${n2(px)} ${n2(py)})">${rect(px-r,py-r,2*r,2*r,{fill:C.E,fo:.5,rx:4})}</g>`;
  else{const phi=d/r;
   if(k===1)s+=ring(px,py,r,{color:C.x,w:6});
   else s+=`<circle cx="${n2(px)}" cy="${n2(py)}" r="${r}" fill="${C.x}" fill-opacity="${k===.5?.45:.3}" stroke="${C.x}" stroke-width="2"/>`+(k===.4?`<ellipse cx="${n2(px)}" cy="${n2(py)}" rx="${r}" ry="${r*.3}" fill="none" stroke="${C.x}" stroke-width="1.5"/>`:'');
   s+=line(px,py,px-r*Math.sin(phi),py+r*Math.cos(phi),{color:C.ink,w:2.5});}
  s+=fade(intro,label(name,ox+40,oy+230,{size:24,color:C.ink}));
  if(u>0&&tt>=tf)s+=label(['1位','2位','3位','4位'][i],x1-10,y1-58,{size:26,color:C.hi,anchor:'end',weight:700});
  if(bars>0){
   const bx=ox+300,by=oy+112,h=100*bars,tr=1/(1+k);
   s+=rect(bx,by-h*tr,40,h*tr,{fill:C.x,fo:.55,rx:0,sw:1})+rect(bx,by-h,40,h*(1-tr),{fill:C.v,fo:.55,rx:0,sw:1})+rect(bx,by-100,40,100,{fill:'none',fo:0,stroke:C.E,sw:2,rx:0});
   s+=fade(seg(bars,.7,1),label(k===0?'全部 進む':`回転 ${fmt(100*k/(1+k),0)}%`,bx+50,by-80,{size:22,color:k===0?C.x:C.v}));
  }
 });
 s+=fade(seg(intro,.3,1),label('同じ質量・同じ半径',600,30,{size:24,color:C.hi,anchor:'middle'}));
 if(bars>0)s+=fade(seg(bars,.5,1),label('水色：進む分　紫：回る分',1180,505,{size:22,color:C.dim,anchor:'end'}));
 return s;
}

function resultScene(p,stage){
 const rows=[['箱',0,'4.43'],['球',.4,'3.74'],['円板',.5,'3.61'],['輪',1,'3.13']];let s='';
 const X0=240,scale=125;
 s+=label('高さ 1 m の坂の下での速さ',600,50,{size:28,color:C.ink,anchor:'middle'});
 rows.forEach(([nm,k,v],i)=>{const y=110+i*90,g=stage===2?1:seg(p,.05+i*.15,.25+i*.15),w=scale*Math.sqrt(19.6/(1+k));
  s+=label(nm,X0-20,y+36,{size:28,color:C.ink,anchor:'end'})+rect(X0,y,w*g,50,{fill:C.x,fo:.45,rx:4});
  s+=fade(g,label(`${v} m/s`,X0+w+16,y+36,{size:28,color:C.x,weight:700}));
  s+=fade(g,tex(`\\tfrac{I}{MR^2}=${k===.4?'\\tfrac25':k===.5?'\\tfrac12':k}`,1090,y+30,{size:32,auto:false}));});
 if(stage===2){
  s+=fade(seg(p,.1,.4),rect(170,470-10,860,50,{fill:C.hi,fo:.08,stroke:C.hi,rx:12})+label('M も R も消えた → 形だけで順位が決まる',600,495,{size:26,color:C.hi,anchor:'middle',weight:700}));
 }
 return s;
}

// Skater seen from above. L = Iω = 4 stays; I goes 4 → 2, ω 1 → 2, K 2 J → 4 J.
function skaterScene(p,ctx,stage){
 const cx=280,cy=260;let s='';
 const pull=stage===1?0:stage===2||stage===4?seg(p,.15,.75):1;
 const I=4-2*pull,w=4/I,K=8/I;
 const th=.6*skaterTurn(ctx,stage);
 const rh=mix(170,70,pull);
 s+=ring(cx,cy,rh,{color:C.faint,w:2,dash:'5 8'});
 s+=`<ellipse cx="${cx}" cy="${cy}" rx="46" ry="30" fill="#8aa0c4" fill-opacity=".35" stroke="#8aa0c4" stroke-width="2" transform="rotate(${n2(th*180/Math.PI)} ${cx} ${cy})"/>`;
 [1,-1].forEach(k=>{const hx=cx+k*rh*Math.cos(th),hy=cy+k*rh*Math.sin(th);s+=line(cx+k*40*Math.cos(th),cy+k*40*Math.sin(th),hx,hy,{color:'#8aa0c4',w:8})+dot(hx,hy,14,'#d8e2f2');});
 s+=dot(cx,cy,16,'#d8e2f2');
 s+=curved(cx,cy,215,-2.2,-1.2,{color:C.v,w:4,head:12});
 s+=label('真上から見たスケーター',cx,40,{size:24,color:C.dim,anchor:'middle'});
 // bars
 const bars=[['L','角運動量',4,C.p,4],['I','慣性モーメント',I,C.x,4],['\\omega','角速度',w,C.v,2]];
 if(stage===4)bars.push(['K','回転エネルギー',K,C.E,4]);
 const bw=stage===4?90:120,gap=stage===4?55:60,x0=560,base=405,unit=stage===4?70:80;
 bars.forEach(([sym,jp,val,col,],i)=>{const x=x0+i*(bw+gap),h=val*unit*(sym==='\\omega'?1:.5)*(sym==='K'?1:1);
  const hh=sym==='\\omega'?val*unit:sym==='K'?val*unit*.5:val*unit*.5;
  s+=rect(x,base-hh,bw,hh,{fill:col,fo:.45,rx:4})+tex(sym,x+bw/2,base+40,{size:36,auto:false})+label(jp,x+bw/2,base+76+(stage===4?(i%2)*26:0),{size:22,color:col,anchor:'middle'});
  const unitTxt=sym==='K'?' J':'';
  s+=label(`${fmt(val,2)}${unitTxt}`,x+bw/2,base-hh-14,{size:26,color:col,anchor:'middle',weight:700});void h;});
 if(stage===1)s+=fade(seg(p,.4,.8),label('氷からのトルクは ほぼ 0 → L は一定',1170,60,{size:26,color:C.p,anchor:'end'}));
 if(stage===2)s+=fade(seg(p,.6,.95),label('L ＝ I × ω ＝ 4 のまま',1170,60,{size:26,color:C.p,anchor:'end'}));
 if(stage===3)s+=fade(seg(p,.05,.35),rect(560,30,610,100,{fill:C.a,fo:.06,stroke:C.dim,rx:12})+label('形が変わる → Iα ＝ N は使えない',865,72,{size:26,color:C.ink,anchor:'middle'})+label('使うのは「L が一定」だけ',865,112,{size:26,color:C.p,anchor:'middle',weight:700}));
 if(stage===4)s+=fade(seg(p,.7,.95),label('K：2 J → 4 J　増えた 2 J はどこから？',1170,60,{size:26,color:C.E,anchor:'end'}));
 return s;
}

// One hand spirals inward. The arm pulls it toward the centre; the hand also moves toward the centre → positive work.
function armScene(p,stage){
 const cx=330,cy=265;let s='';
 const u=stage===1?seg(p,.05,.9):1;
 // hand keeps its own angular momentum: r² dθ = const; r from 190 to 95 (I of the hands ÷ 4 in this sketch)
 const rAt=q=>mix(190,95,q),thAt=q=>-.4+2.4*q+2.2*q*q;
 const path=stage===1?Array.from({length:81},(_,i)=>{const th=-.4+3*u*i/80;return [cx+190*Math.cos(th),cy+190*Math.sin(th)];})
  :Array.from({length:81},(_,i)=>{const q=(stage===2?mix(.35,.65,lin(p,0,1)):1)*i/80,r=rAt(q),th=thAt(q);return [cx+r*Math.cos(th),cy+r*Math.sin(th)];});
 s+=ring(cx,cy,190,{color:C.faint,w:2,dash:'5 8'})+ring(cx,cy,95,{color:C.faint,w:2,dash:'5 8'});
 s+=draw(path,1,{color:C.x,w:3,dash:'3 7'});
 const q=stage===2?mix(.35,.65,lin(p,0,1)):u,r=stage===1?190:rAt(q),th=stage===1?-.4+3*u:thAt(q),hx=cx+r*Math.cos(th),hy=cy+r*Math.sin(th);
 s+=line(cx,cy,hx,hy,{color:'#8aa0c4',w:8})+dot(cx,cy,18,'#d8e2f2')+dot(hx,hy,16,'#d8e2f2');
 // force: toward the centre
 const fx=(cx-hx)/r,fy=(cy-hy)/r;
 s+=arrow(hx,hy,hx+fx*90,hy+fy*90,{color:C.F,w:6,head:16});
 s+=fade(stage===1?seg(p,.2,.45):1,label('腕が引く力（内向き）',760,90,{size:26,color:C.F}));
 if(stage===2){
  // displacement: the inward part of the motion
  s+=arrow(hx-fy*16,hy+fx*16,hx-fy*16+fx*45,hy+fx*16+fy*45,{color:C.x,w:4,head:12,g:1});
  s+=label('手の動きの内向きの成分',760,140,{size:26,color:C.x});
  s+=fade(seg(p,.2,.5),highlight(740,175,420,70,1)+label('同じ向き → 正の仕事',760,222,{size:30,color:C.hi,weight:700}));
  const W=stage===2?2*seg(p,.4,.9):2;
  s+=rect(800,440-75*W,90,75*W,{fill:C.E,fo:.5,rx:4})+rect(800,290,90,150,{fill:'none',fo:0,stroke:C.E,rx:4})+label(`腕がした仕事 ${fmt(W,1)} J`,910,430,{size:26,color:C.E});
  s+=fade(seg(p,.8,1),label('＝ 増えた回転エネルギー',910,470,{size:24,color:C.E}));
 }
 if(stage===3){
  s+=fade(seg(p,.1,.4),rect(620,180,550,170,{fill:C.hi,fo:.06,stroke:C.hi,rx:14})+label('外からのトルク 0 でも、',895,232,{size:26,color:C.ink,anchor:'middle'})+label('体の中の力は仕事ができる',895,272,{size:26,color:C.ink,anchor:'middle'})+label('保存するのは L、K ではない',895,322,{size:28,color:C.hi,anchor:'middle',weight:700}));
 }
 return s;
}

// ∫ω dt from the start of the skater picture, so the spin never jumps between cues.
function skaterTurn(ctx,stage){
 const caps=ctx?.scene?.captions??[],k=ctx?.k??0,T=at(ctx);
 const pullW=q=>4/(4-2*seg(q,.15,.75));
 const wAt=tau=>{
  if(stage===4){const c=caps[k];const d=c?Math.max(.05,c.end-c.start):1;return pullW((tau-(c?.start??0))/d);}
  let j=0;for(let i=0;i<caps.length;i++)if(caps[i].start<=tau)j=i;
  if(j===0)return 1;if(j===1){const c=caps[1];return pullW((tau-c.start)/Math.max(.05,c.end-c.start));}return 2;};
 const t0=stage===4?(caps[k]?.start??0):(caps[0]?.start??0),N=160;let a=0;
 for(let i=0;i<N;i++){const tau=t0+(T-t0)*(i+.5)/N;a+=wAt(tau)*(T-t0)/N;}
 return a;
}

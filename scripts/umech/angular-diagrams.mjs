// 単元「トルクと角運動量」＋橋渡し「向きだけ変える力」 — pictures. Viewbox 1200×515.
// Colours: position r ink(white), force F / torque N green, momentum p / angular momentum L pink,
// velocity v purple, arm length d cyan, time gold, highlight yellow.
import {C,clamp,mix,smooth,seg,lin,fmt,fade,label,line,rect,dot,ring,draw,poly,arrow,tex} from './anim.mjs';

const R2D=180/Math.PI,D2R=Math.PI/180;
const n2=v=>Number(v.toFixed(2));
// Small square marking a right angle at corner (x,y) between unit directions u and w.
function rightMark(x,y,u,w,s=16,color=C.hi){const a=[x+u[0]*s,y+u[1]*s],b=[x+u[0]*s+w[0]*s,y+u[1]*s+w[1]*s],c=[x+w[0]*s,y+w[1]*s];return draw([a,b,c],1,{color,w:2.5});}
// Arc (screen coords) centred at (cx,cy) from angle a0 to a1 (radians, screen y down) with optional head.
function arcArrow(cx,cy,r,a0,a1,{color=C.hi,w=3.5,g=1,head=true,ry}={}){
 const k=ry??r,N=40,a=mix(a0,a0+(a1-a0),g);if(g<=0.01)return '';
 const pts=Array.from({length:N+1},(_,i)=>{const t=mix(a0,a,i/N);return [cx+r*Math.cos(t),cy+k*Math.sin(t)];});
 let s=draw(pts,1,{color,w});
 if(head&&pts.length>2){const q=pts.at(-1),o=pts.at(-4);s+=arrow(o[0],o[1],q[0],q[1],{color,w,head:14});}
 return s;
}
const panel=(x,y,w,h,col=C.dim)=>rect(x,y,w,h,{fill:col,fo:.06,stroke:C.faint,rx:14,sw:2});

// =============================== intro: the door =====================================
// Door seen from above. Hinge H, door length 0.8 m drawn at S px per metre, opening upward (screen).
const H={x:170,y:420},DS=650,DL=.8;
function doorAt(th,{hx=H.x,hy=H.y,S=DS,opacity=1,wall=true}={}){
 const u=[Math.cos(th*D2R),-Math.sin(th*D2R)],len=DL*S;
 let s='';
 if(wall)s+=line(40,hy+10,hx-10,hy+10,{color:C.dim,w:4})+line(hx+len+14,hy+10,Math.min(1160,hx+len+220),hy+10,{color:C.dim,w:4})+label('壁',Math.min(1150,hx+len+220),hy+44,{size:22,color:C.dim,anchor:'end'});
 s+=fade(opacity,line(hx,hy,hx+u[0]*len,hy+u[1]*len,{color:'#c9d6ec',w:16,cap:'butt'}));
 s+=ring(hx,hy,11,{color:C.hi,w:3,fill:C.bg})+dot(hx,hy,4,C.hi);
 return s;
}
function doorPoint(th,d,{hx=H.x,hy=H.y,S=DS}={}){return [hx+Math.cos(th*D2R)*d*S,hy-Math.sin(th*D2R)*d*S];}
// Push arrow at distance d, perpendicular to the door, ending on it.
function pushArrow(th,d,{len=110,g=1,text='',opacity=1,hx=H.x,hy=H.y,S=DS}={}){
 const [px,py]=doorPoint(th,d,{hx,hy,S}),nx=-Math.sin(th*D2R),ny=-Math.cos(th*D2R);
 return arrow(px-nx*len,py-ny*len+ (th===0?12:0),px,py+(th===0?12:0),{color:C.F,w:7,g,text,tsize:24,tdx:-60,tdy:len+40,opacity})+fade(opacity*g,dot(px,py,8,C.F));
}
function hingeLabel(g=1,x=H.x,y=H.y){return fade(g,label('蝶番',x-24,y+38,{size:24,color:C.hi,anchor:'end'})+label('（回す中心）',x-10,y+66,{size:21,color:C.hi,anchor:'end'}));}

export const angularDiagrams={
 // Three pushes of the same force for the same 1 s: near the hinge, middle, end. Angle grows with the arm.
 'an-door':(p)=>{
  const trials=[[.1,5],[.4,20],[.8,40]];let s=doorAt(0,{opacity:0});
  const k=Math.min(2,Math.floor(p*3)),q=p*3-k;
  // ghosts of finished trials stay where they stopped (the door does not swing back)
  for(let i=0;i<k;i++)s+=doorAt(trials[i][1],{opacity:.28,wall:false});
  const [d,ang]=trials[k],u=seg(q,.2,.85),th=ang*u;
  s+=doorAt(th,{wall:false})+pushArrow(th,d,{g:seg(q,0,.18)});
  s+=hingeLabel()+label(`時刻 ${fmt(u,1)} s`,60,60,{size:26,color:C.t});
  // bar chart of the angle turned in the same 1 s
  const bx=800,by=430,bw=80;
  s+=line(bx-20,by,bx+330,by,{color:C.dim,w:2.5})+label('同じ 1 秒で回った角度',bx+155,70,{size:24,color:C.hi,anchor:'middle'});
  trials.forEach(([dd,a],i)=>{const h=i<k?1:i===k?u:0,x=bx+i*115;
   if(i<=k)s+=rect(x,by-a*7*h,bw,a*7*h,{fill:C.v,fo:.4,rx:4})+label(`${fmt(a*h,0)}°`,x+bw/2,by-a*7*h-12,{size:22,color:C.v,anchor:'middle'});
   s+=label(`${dd} m`,x+bw/2,by+32,{size:22,color:C.x,anchor:'middle'});});
  s+=label('押す位置（蝶番から）',bx+155,by+64,{size:21,color:C.dim,anchor:'middle'});
  return s+label('力はどれも 10 N',1150,120,{size:22,color:C.F,anchor:'end'});
 },
 // Arm length d grows as the push point slides; the turning effect grows with it.
 'an-arm':(p)=>{
  const d=.8*seg(p,.05,.7)+.001;let s=doorAt(0)+pushArrow(0,d,{text:'10 N'});
  const [px]=doorPoint(0,d),y=H.y-60;
  s+=line(H.x,y,px,y,{color:C.x,w:4})+line(H.x,y-12,H.x,y+12,{color:C.x,w:3})+line(px,y-12,px,y+12,{color:C.x,w:3});
  s+=label(`腕の長さ d = ${fmt(d,2)} m`,Math.max(H.x+10,px-10),y-22,{size:24,color:C.x,anchor:px>560?'end':'start'});
  s+=hingeLabel();
  // turning-effect bar: 10 × d
  const bx=1000,by=440,h=d*10*32;
  s+=line(bx-40,by,bx+120,by,{color:C.dim,w:2.5})+rect(bx,by-h,80,h,{fill:C.F,fo:.35,rx:4})+label('回す効き目',bx+40,by+36,{size:22,color:C.F,anchor:'middle'});
  s+=label(`10 × ${fmt(d,2)} = ${fmt(10*d,1)}`,bx+40,by-h-16,{size:24,color:C.F,anchor:'middle'});
  return s+fade(seg(p,.72,.95),label('力 × 腕の長さ',640,70,{size:32,color:C.hi,anchor:'middle',weight:700}));
 },
 // Same force at 0.4 m and 0.8 m: torque 4 and 8.
 'an-num':(p)=>{
  let s='';
  [[.4,190,0],[.8,420,.35]].forEach(([d,y,t0])=>{const g=seg(p,t0,t0+.25),hx=110,S=560;
   s+=fade(g,doorAt(0,{hx,hy:y,S,wall:false})+line(40,y+10,hx-10,y+10,{color:C.dim,w:4}));
   const [px]=doorPoint(0,d,{hx,hy:y,S});
   s+=pushArrow(0,d,{len:70,g,hx,hy:y,S});
   s+=fade(g,line(hx,y-38,px,y-38,{color:C.x,w:4})+line(px,y-48,px,y-28,{color:C.x,w:3})+label(`${d} m`,(hx+px)/2,y-50,{size:24,color:C.x,anchor:'middle'}));
   const gt=seg(p,t0+.15,t0+.35);
   s+=fade(gt,tex(`{\\color{#83ecc0}N}=10\\times${d}=${fmt(10*d,0)}`,760,y-8,{size:40}));
   s+=fade(gt,rect(980,y+10-d*10*16,70,d*10*16,{fill:C.F,fo:.35,rx:4}));
  });
  return s+fade(seg(p,.8,1),label('腕が 2 倍 → トルクも 2 倍',1150,60,{size:28,color:C.hi,anchor:'end',weight:700}))+label('力 10 N',60,60,{size:24,color:C.F});
 },
 // ---- scene 2: tilt the force, line of action, perpendicular distance ----
 'an-line:tilt':(p)=>lineScene(p,'tilt'),
 'an-line:draw':(p)=>lineScene(p,'draw'),
 'an-line:30':(p)=>lineScene(p,'30'),
 'an-line:zero':(p)=>lineScene(p,'zero'),
 // ---- scene 3: seesaw, reference point ----
 'an-saw:right':(p)=>seesaw(p,'right'),
 'an-saw:balance':(p)=>seesaw(p,'balance'),
 'an-saw:shift':(p)=>seesaw(p,'shift'),
 'an-saw:end':(p)=>seesaw(p,'end'),
};

// Force at the door's end, making angle phi (deg) with the door, tilted toward the hinge.
function lineScene(p,stage){
 const phi=stage==='tilt'?mix(90,30,seg(p,.1,.75)):stage==='zero'?mix(30,0,seg(p,.1,.7)):30;
 const P=[H.x+DL*DS,H.y],f=[-Math.cos(phi*D2R),-Math.sin(phi*D2R)],len=150;
 let s=doorAt(0)+hingeLabel();
 // line of action
 const gl=stage==='tilt'?0:stage==='draw'?seg(p,.05,.4):1;
 if(gl>0){const a=[P[0]-f[0]*300,P[1]-f[1]*300],b=[P[0]+f[0]*620,P[1]+f[1]*620];
  s+=draw([[mix(P[0],a[0],gl),mix(P[1],a[1],gl)],[mix(P[0],b[0],gl),mix(P[1],b[1],gl)]],1,{color:C.F,w:2.5,dash:'10 9',opacity:.8});
  if(stage==='draw')s+=fade(seg(p,.2,.4),label('作用線',P[0]+f[0]*-330+10,P[1]+f[1]*-330-16,{size:24,color:C.F}));
 }
 s+=arrow(P[0]-f[0]*len,P[1]-f[1]*len,P[0],P[1],{color:C.F,w:7})+dot(P[0],P[1],8,C.F)+label('10 N',P[0]-f[0]*len+14,P[1]-f[1]*len+(phi<15?-20:8),{size:24,color:C.F});
 // angle mark between force and door
 if(phi>2&&stage!=='zero')s+=arcArrow(P[0],P[1],46,Math.PI,Math.PI+phi*D2R,{color:C.t,w:2.5,head:false})+label(`${fmt(phi,0)}°`,P[0]-78,P[1]-16-phi*.3,{size:22,color:C.t,anchor:'end'});
 // perpendicular from hinge to the line of action
 const t=(H.x-P[0])*f[0]+(H.y-P[1])*f[1],Q=[P[0]+f[0]*t,P[1]+f[1]*t],dd=DL*Math.sin(phi*D2R);
 const gp=stage==='tilt'?0:stage==='draw'?seg(p,.45,.8):1;
 if(gp>0&&dd>.005){
  s+=line(H.x,H.y,mix(H.x,Q[0],gp),mix(H.y,Q[1],gp),{color:C.x,w:5});
  const u=[(H.x-Q[0])/Math.hypot(H.x-Q[0],H.y-Q[1]),(H.y-Q[1])/Math.hypot(H.x-Q[0],H.y-Q[1])];
  s+=fade(seg(gp,.8,1),rightMark(Q[0],Q[1],u,f,18,C.x));
  const mx=(H.x+Q[0])/2,my=(H.y+Q[1])/2;
  s+=fade(seg(gp,.7,1),stage==='zero'?label(`本当の腕 ${fmt(dd,2)} m`,H.x+140,H.y-270,{size:24,color:C.x}):label(`本当の腕 ${fmt(dd,2)} m`,mx-24,my-6,{size:24,color:C.x,anchor:'end'}));
 }
 if(stage==='30'){
  const g=seg(p,.1,.4);
  s+=fade(g,poly([[H.x,H.y],[P[0],P[1]],Q],{fill:C.x,fo:.1})+label('0.8 m',(H.x+P[0])/2,H.y+44,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.35,.6),panel(760,40,400,120)+label('30° の直角三角形',960,88,{size:24,color:C.t,anchor:'middle'})+label('→ 向かいの辺は斜辺の半分',960,130,{size:22,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.6,.85),tex('{\\color{#83ecc0}N}=10\\times0.4=4',960,215,{size:40}));
 }
 // turning-effect bar
 const N=10*dd,bx=1060,by=470,h=N*30;
 if(stage!=='30')s+=line(bx-30,by,bx+110,by,{color:C.dim,w:2.5})+rect(bx,by-h,70,h,{fill:C.F,fo:.35,rx:4})+label(`トルク ${fmt(N,1)}`,bx+35,by-h-14,{size:24,color:C.F,anchor:'middle'});
 if(stage==='zero'){const g=seg(p,.7,.9);
  s+=fade(g,ring(H.x,H.y,26,{color:C.a,w:3})+label('作用線が蝶番を通る → 腕 0 → 回らない',640,70,{size:28,color:C.a,anchor:'middle',weight:700}));}
 return s;
}

// Seesaw: plank pivot at (px,Y). Scale 500 px/m. Weights fixed on the plank at x=1000 (10 N) and x=400 (20 N)
// measured with the pivot in the middle (600). tilt>0 = right side down.
function seesaw(p,stage){
 const Y=350,S=500,G=440;
 const shift=stage==='shift'?seg(p,.05,.35)*.2:stage==='end'?.2:0,px=600+shift*S;
 const leftOn=stage==='right'?0:stage==='balance'?seg(p,.05,.3):1;
 let tilt=0;
 if(stage==='right')tilt=7*seg(p,.3,.65);
 if(stage==='balance')tilt=7*(1-seg(p,.3,.65));
 if(stage==='shift')tilt=-7*seg(p,.45,.8);
 if(stage==='end')tilt=-7;
 const a=tilt*D2R,pt=x=>[px+(x-px)*Math.cos(a),Y+(x-px)*Math.sin(a)];
 let s=line(60,G,1140,G,{color:C.dim,w:3});
 s+=poly([[px,Y+6],[px-44,G],[px+44,G]],{fill:C.hi,fo:.25,stroke:C.hi,sw:2.5});
 const [l1,l2]=[pt(150),pt(1050)];
 s+=line(l1[0],l1[1],l2[0],l2[1],{color:'#c9d6ec',w:12,cap:'butt'});
 const wt=(x,Nw,w,g)=>{const [cx,cy]=pt(x),h=w;return fade(g,rect(cx-w/2,cy-6-h-(1-g)*120,w,h,{fill:C.m,fo:.18,rx:6})+arrow(cx,cy-6-h/2-(1-g)*120,cx,cy+70-(1-g)*120,{color:C.F,w:6})+label(`${Nw} N`,cx+w/2+10,cy-h/2+8-(1-g)*120,{size:24,color:C.F}));};
 s+=wt(1000,10,60,stage==='right'?seg(p,0,.25):1)+(leftOn>0?wt(400,20,80,leftOn):'');
 // arms (horizontal distance from the pivot to each weight's line)
 const armY=G+40,rx=pt(1000)[0],lx=pt(400)[0];
 const arm=(x,col,txt,g)=>fade(g,line(px,armY,x,armY,{color:C.x,w:4})+line(x,armY-10,x,armY+10,{color:C.x,w:3})+label(txt,(px+x)/2,armY+30,{size:22,color:C.x,anchor:'middle'}));
 const dr=(1000-px)/S,dl=(px-400)/S;
 s+=line(px,armY-10,px,armY+10,{color:C.x,w:3});
 s+=arm(rx,C.x,`${fmt(dr,2)} m`,stage==='right'?seg(p,.2,.4):1);
 if(leftOn>0)s+=arm(lx,C.x,`${fmt(dl,2)} m`,leftOn);
 // torque read-outs
 const tR=10*dr,tL=20*dl,gR=stage==='right'?seg(p,.4,.6):1;
 s+=fade(gR,label(`右回り 10 × ${fmt(dr,2)} = ${fmt(tR,1)}`,1150,70,{size:26,color:C.F,anchor:'end'}));
 if(leftOn>0)s+=fade(stage==='balance'?seg(p,.25,.45):1,label(`左回り 20 × ${fmt(dl,2)} = ${fmt(tL,1)}`,60,70,{size:26,color:C.F}));
 if(stage==='right')s+=fade(seg(p,.55,.85),ring(px,Y,16,{color:C.hi,w:3})+label('支点 ＝ 基準点',px,Y-40-0,{size:26,color:C.hi,anchor:'middle',weight:700}));
 if(stage==='balance')s+=fade(seg(p,.65,.9),label('8 ＝ 8 → つり合う',600,130,{size:30,color:C.hi,anchor:'middle',weight:700}));
 if(stage==='shift'){s+=fade(seg(p,.05,.3),arrow(600,Y-70,700,Y-70,{color:C.hi,w:4,head:14})+label('支点を 0.2 m 右へ',650,Y-90,{size:22,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.7,.95),label('12 ＞ 6 → 左へ傾く',600,130,{size:30,color:C.hi,anchor:'middle',weight:700}));}
 if(stage==='end')s+=panel(290,110,620,110)+label('基準点が変わると、トルクも変わる',600,155,{size:28,color:C.hi,anchor:'middle',weight:700})+fade(seg(p,.4,.7),label('まず「どこを中心に回すか」を決める',600,200,{size:24,color:C.ink,anchor:'middle'}));
 return s;
}

// =============================== middle: r × p in pseudo-3D ==========================
// World: table plane (x,y), z up. Oblique projection: depth y squashed by 0.42.
function P3(cx,cy,s){return (x,y,z)=>[cx+s*(x+0.28*y),cy-s*(0.40*y+z)];}
function arrow3(pr,a,b,opt){const [x,y]=pr(...a),[X,Y]=pr(...b);return arrow(x,y,X,Y,opt);}
function table(pr,R=4.3){const c=[[-R,-R],[R,-R],[R,R],[-R,R]].map(([x,y])=>pr(x,y,0));return poly(c,{fill:'#16233c',fo:.8,stroke:'#2a3a58',sw:2});}
function orbit3(pr,r=3){return draw(Array.from({length:97},(_,i)=>{const a=2*Math.PI*i/96;return pr(r*Math.cos(a),r*Math.sin(a),0);}),1,{color:C.faint,w:2.5,dash:'6 8'});}
// Curl of the fingers: arc in the table plane around the origin from angle a0 to a1.
function curl3(pr,a0,a1,rad=1.1,g=1,color=C.hi){
 const N=40,pts=Array.from({length:N+1},(_,i)=>{const t=mix(a0,a1,g*i/N);return pr(rad*Math.cos(t),rad*Math.sin(t),0);});
 if(g<=.02)return '';let s=draw(pts,1,{color,w:4});const q=pts.at(-1),o=pts.at(-5);return s+arrow(o[0],o[1],q[0],q[1],{color,w:4,head:16});
}
// A stylised right hand: fist with curled fingers and a raised thumb. flip=true → thumb down.
function hand(cx,cy,{flip=false,g=1,dir=1}={}){
 const sy=flip?-1:1;
 let s=`<g transform="translate(${cx} ${cy}) scale(1 ${sy})">`;
 s+=`<rect x="-52" y="-6" width="104" height="92" rx="30" fill="#e8c3a0" fill-opacity=".85" stroke="#b58f6c" stroke-width="3"/>`;
 for(let i=0;i<4;i++)s+=`<path d="M-50 ${14+i*18} q56 -14 100 0" fill="none" stroke="#9c7658" stroke-width="3"/>`;
 s+=`<rect x="-16" y="-92" width="32" height="96" rx="16" fill="#e8c3a0" fill-opacity=".95" stroke="#b58f6c" stroke-width="3"/>`;
 s+='</g>';
 // curling arrow around the fist, and L from the thumb
 s+=arcArrow(cx,cy+40*sy,78,dir>0?Math.PI*.15:Math.PI*.85,dir>0?Math.PI*.85:Math.PI*.15,{color:C.hi,w:4,ry:22,g});
 s+=arrow(cx,cy-96*sy,cx,cy-190*sy,{color:C.p,w:7,g});
 return fade(g,s);
}
function rhr(p,stage){
 const pr=P3(400,300,62),dir=stage==='flip'?-1:1;
 const ph=(stage==='orbit'?-.4+2.2*p:stage==='curl'?1.8+.25*p:1.8-2.2*p)+(stage==='flip'?.25:0);
 const b=[3*Math.cos(ph),3*Math.sin(ph),0],pv=[-Math.sin(ph)*dir,Math.cos(ph)*dir,0],pl=2.3;
 let s=table(pr)+orbit3(pr);
 const O=pr(0,0,0);
 // L arrow (drawn before the ball so the ball stays visible)
 const gL=stage==='orbit'?0:stage==='curl'?seg(p,.45,.75):1,Lz=3*dir;
 const flipU=stage==='flip'?seg(p,.05,.4):0;
 const Lnow=stage==='flip'?mix(2.6,-2.6,flipU):2.6;
 if(gL>0&&Math.abs(Lnow)>.05)s+=arrow3(pr,[0,0,0],[0,0,Lnow*gL],{color:C.p,w:8,head:20});
 if(gL>0){const tip=pr(0,0,Lnow*gL);s+=fade(gL,tex('\\vec L',tip[0]+30,tip[1]+(Lnow>0?20:0),{size:38,color:C.p,auto:false}));}
 s+=arrow3(pr,[0,0,0],b,{color:C.ink,w:5,head:16})+dot(...O,6,C.ink);
 const [bx,by]=pr(...b);
 s+=arrow3(pr,b,[b[0]+pv[0]*pl,b[1]+pv[1]*pl,0],{color:C.p,w:6,head:18});
 s+=dot(bx,by,13,C.hi);
 const rm=pr(b[0]*.55,b[1]*.55,0),pt=pr(b[0]+pv[0]*pl,b[1]+pv[1]*pl,0);
 s+=tex('\\vec r',rm[0]+(Math.sin(ph)>0?-26:22),rm[1]-18,{size:34,auto:false});
 s+=tex('\\vec p',pt[0]+18*Math.sign(pv[0]||1),pt[1]-14,{size:34,color:C.p,auto:false});
 // curl of the fingers r → p
 if(stage==='curl')s+=curl3(pr,ph,ph+dir*Math.PI/2,1.2,seg(p,.1,.45));
 if(stage==='flip')s+=fade(seg(p,.4,.7),curl3(pr,ph,ph+dir*Math.PI/2,1.2,1));
 // hand on the right
 if(stage!=='orbit'){
  const gh=stage==='curl'?seg(p,.2,.55):1;
  s+=hand(900,stage==='flip'?250:300,{flip:stage==='flip'&&flipU>.5,g:gh,dir:stage==='flip'?(flipU>.5?-1:1):1});
  s+=fade(gh,label('指：r から p へ巻く',1000,stage==='flip'?120:430,{size:22,color:C.hi})+label('親指：L',1000,stage==='flip'?470:130,{size:24,color:C.p,weight:700}));
 }else{
  s+=fade(seg(p,.1,.35),label('位置 r（中心から玉へ）',790,150,{size:24,color:C.ink}))+fade(seg(p,.3,.55),label('運動量 p ＝ 質量 × 速度',790,200,{size:24,color:C.p}));
  s+=fade(seg(p,.6,.9),label('上から見て左回り',790,270,{size:22,color:C.dim}));
 }
 if(stage==='flip')s+=fade(seg(p,.75,1),label('回る面に垂直な矢印 ＝ 回る向き',600,40,{size:26,color:C.hi,anchor:'middle',weight:700}));
 return s;
}
Object.assign(angularDiagrams,{
 'an-rhr:orbit':(p)=>rhr(p,'orbit'),
 'an-rhr:curl':(p)=>rhr(p,'curl'),
 'an-rhr:flip':(p)=>rhr(p,'flip'),
});

// ---- L as the parallelogram area (top view, flat) ----
function para(p,stage){
 const O=[200,410],rs=90,ps=30,r=3,pm=8;
 const th=stage==='para'?60:mix(60,0,seg(p,.1,.75));
 const R=[O[0]+r*rs,O[1]],pv=[Math.cos(th*D2R)*pm*ps,-Math.sin(th*D2R)*pm*ps];
 const g=stage==='para'?seg(p,.1,.45):1;
 let s=fade(g,poly([O,R,[R[0]+pv[0],R[1]+pv[1]],[O[0]+pv[0],O[1]+pv[1]]],{fill:C.p,fo:.22,stroke:C.p,sw:1.5}));
 s+=fade(g*.6,draw([[O[0],O[1]],[O[0]+pv[0],O[1]+pv[1]],[R[0]+pv[0],R[1]+pv[1]]],1,{color:C.p,w:2,dash:'6 7'}));
 s+=arrow(O[0],O[1],R[0],R[1],{color:C.ink,w:6})+tex('\\vec r',(O[0]+R[0])/2,O[1]+44,{size:36,auto:false});
 s+=arrow(R[0],R[1],R[0]+pv[0],R[1]+pv[1],{color:C.p,w:6})+tex('\\vec p',R[0]+pv[0]+28,R[1]+pv[1]+4,{size:36,color:C.p,auto:false});
 // height (the part of p perpendicular to r)
 if(th>3){const gh=stage==='para'?seg(p,.5,.8):1,hx=R[0]+pv[0];
  s+=fade(gh,line(hx,R[1],hx,R[1]+pv[1],{color:C.hi,w:3,dash:'5 6'})+line(R[0],R[1],hx+10,R[1],{color:C.faint,w:2,dash:'4 6'})+label('p の、r に直角な分',hx+14,R[1]+pv[1]/2+8,{size:22,color:C.hi}));}
 if(th>10)s+=arcArrow(R[0],R[1],40,0,-th*D2R,{color:C.t,w:2.5,head:false});
 // L bar = area
 const A=r*pm*Math.sin(th*D2R),bx=1000,by=440,h=A*10;
 s+=line(bx-40,by,bx+120,by,{color:C.dim,w:2.5})+rect(bx,by-h,80,h,{fill:C.p,fo:.4,rx:4})+label('L の長さ',bx+40,by+34,{size:24,color:C.p,anchor:'middle'});
 s+=fade(stage==='para'?seg(p,.6,.9):1,label('＝ 平行四辺形の面積',bx+40,by+66,{size:22,color:C.dim,anchor:'middle'}));
 if(stage==='tilt')s+=fade(seg(p,.78,.98),label('同じ向き → 面積 0 → L = 0',640,60,{size:28,color:C.hi,anchor:'middle',weight:700}));
 return s;
}
Object.assign(angularDiagrams,{
 'an-area:para':(p)=>para(p,'para'),
 'an-area:tilt':(p)=>para(p,'tilt'),
 // Circular motion: r ⟂ p always, the parallelogram is a rectangle.
 'an-circle':(p)=>{
  const O=[330,265],R=190,ph=(-30+100*lin(p,0,.55))*D2R,ps=24;
  const b=[O[0]+R*Math.cos(ph),O[1]-R*Math.sin(ph)],u=[-Math.sin(ph),-Math.cos(ph)],pv=[u[0]*8*ps,u[1]*8*ps];
  let s=ring(O[0],O[1],R,{color:C.faint,w:2.5,dash:'6 8'});
  s+=poly([O,b,[b[0]+pv[0],b[1]+pv[1]],[O[0]+pv[0],O[1]+pv[1]]],{fill:C.p,fo:.2,stroke:C.p,sw:1.5});
  const rr=[(b[0]-O[0])/R,(b[1]-O[1])/R];
  s+=rightMark(b[0],b[1],[-rr[0],-rr[1]],u,18,C.hi);
  s+=arrow(O[0],O[1],b[0],b[1],{color:C.ink,w:6})+dot(O[0],O[1],6,C.ink)+arrow(b[0],b[1],b[0]+pv[0],b[1]+pv[1],{color:C.p,w:6})+dot(b[0],b[1],12,C.hi);
  s+=tex('\\vec r',(O[0]+b[0])/2-u[0]*32,(O[1]+b[1])/2-u[1]*32+10,{size:34,auto:false})+tex('\\vec p',b[0]+pv[0]*1.15,b[1]+pv[1]*1.15+10,{size:34,color:C.p,auto:false});
  const g=seg(p,.55,.8);
  s+=fade(g,panel(700,70,450,250)+label('r ＝ 3 m',740,130,{size:28,color:C.ink})+label('p ＝ 2 kg × 4 m/s ＝ 8',740,185,{size:28,color:C.p})+label('直角 → 長方形',740,240,{size:26,color:C.hi}));
  s+=fade(seg(p,.8,1),label('面積 ＝ r × p ＝ 3 × 8 ＝ 24',925,295,{size:26,color:C.p,anchor:'middle',weight:700}));
  return s+label('上から見た図',60,40,{size:22,color:C.dim});
 },
});

// ---- torque N = r × F changes L ----
function torque(p,stage){
 const pr=P3(400,380,62);
 const Lv=stage==='def'?2.6:stage==='grow'?2.6+1*seg(p,.2,.95):2.6-1.2*seg(p,.2,.95);
 const w=stage==='def'?.35:.35+.25*(Lv-3)/1.5;
 const ph=1.9+(stage==='def'?.5*p:stage==='grow'?1.2*p+0.35*p*p:1.2*p-.3*p*p);
 const b=[3*Math.cos(ph),3*Math.sin(ph),0],tg=[-Math.sin(ph),Math.cos(ph),0];
 let s=table(pr)+orbit3(pr);
 // L arrow, N stacked on its tip
 s+=arrow3(pr,[0,0,0],[0,0,Lv],{color:C.p,w:8,head:20,opacity:stage==='def'?.35:1});
 const tip=pr(0,0,Lv);
 s+=tex('\\vec L',tip[0]-34,tip[1]+30,{size:36,color:C.p,auto:false,opacity:stage==='def'?.5:1});
 const Nd=stage==='shrink'?-1:1,gN=stage==='def'?seg(p,.35,.7):1,Nlen=.9;
 {const a=pr(0,0,Lv),b=pr(0,0,Lv+Nd*Nlen*gN);s+=arrow(a[0]+16,a[1],b[0]+16,b[1],{color:C.F,w:7,head:16});}
 if(gN>0)s+=fade(gN,tex('\\vec N',tip[0]+34,tip[1]-Nd*28,{size:36,color:C.F,auto:false}));
 s+=arrow3(pr,[0,0,0],b,{color:C.ink,w:5,head:16});
 const Fd=stage==='shrink'?-1:1,fl=1.6;
 const gF=stage==='def'?seg(p,0,.3):1;
 s+=arrow3(pr,b,[b[0]+tg[0]*fl*Fd,b[1]+tg[1]*fl*Fd,0],{color:C.F,w:6,head:16,g:gF});
 const bt=pr(...b),ft=pr(b[0]+tg[0]*fl*Fd,b[1]+tg[1]*fl*Fd,0);
 s+=dot(bt[0],bt[1],13,C.hi)+fade(gF,tex('\\vec F',ft[0]-26,ft[1]-12,{size:34,color:C.F,auto:false}));
 if(stage==='def')s+=curl3(pr,ph,ph+Math.PI/2,1.2,seg(p,.2,.5),C.hi);
 // side read-out
 const x0=780;
 if(stage==='def')s+=fade(seg(p,.5,.8),panel(x0-20,90,420,200)+tex('\\vec N=\\vec r\\times\\vec F',x0+190,150,{size:40})+label('N：トルク',x0+190,215,{size:24,color:C.F,anchor:'middle'})+label('（単位のニュートンとは別物）',x0+190,255,{size:22,color:C.dim,anchor:'middle'}));
 else{
  const bw=70,by=450,h=Lv*50;
  s+=line(x0+120,by,x0+300,by,{color:C.dim,w:2.5})+rect(x0+170,by-h,bw,h,{fill:C.p,fo:.4,rx:4})+label('L の長さ',x0+205,by+32,{size:22,color:C.p,anchor:'middle'});
  s+=line(x0+150,by-130,x0+260,by-130,{color:C.faint,w:2,dash:'5 6'});
  s+=label(stage==='grow'?'N と L が同じ向き → L が伸びる':'N と L が逆向き → L が縮む',600,40,{size:26,color:C.hi,anchor:'middle',weight:700});
  s+=label(stage==='grow'?'押す → 速くなる':'ブレーキ → 遅くなる',x0+210,120,{size:22,color:C.F,anchor:'middle'});
 }
 return s;
}
Object.assign(angularDiagrams,{
 'an-tq:def':(p)=>torque(p,'def'),
 'an-tq:grow':(p)=>torque(p,'grow'),
 'an-tq:shrink':(p)=>torque(p,'shrink'),
});

// =============================== advanced: orbit and equal areas =====================
// v × p: the angle between v and p=mv closes to zero, the parallelogram collapses.
Object.assign(angularDiagrams,{
 'an-vp':(p)=>{
  const O=[250,380],ang=mix(55,0,seg(p,.2,.75))*D2R,vl=200,pl=320;
  const V=[O[0]+vl,O[1]],Pp=[O[0]+pl*Math.cos(ang),O[1]-pl*Math.sin(ang)];
  let s='';
  s+=poly([O,V,[V[0]+Pp[0]-O[0],V[1]+Pp[1]-O[1]],Pp],{fill:C.hi,fo:.15,stroke:C.hi,sw:1.5});
  s+=arrow(O[0],O[1],Pp[0],Pp[1],{color:C.p,w:10,head:22})+arrow(O[0],O[1],V[0],V[1],{color:C.v,w:6,head:18});
  s+=tex('\\vec p=m\\vec v',Pp[0]+20,Pp[1]-24,{size:34,color:C.p,auto:false})+tex('\\vec v',V[0]-10,V[1]+46,{size:34,auto:false});
  const A=Math.sin(ang)*vl*pl/1000;
  s+=panel(760,60,380,220)+label('v × p の大きさ',950,100,{size:24,color:C.dim,anchor:'middle'})+label('＝ 平行四辺形の面積',950,132,{size:22,color:C.dim,anchor:'middle'});
  const bh=Math.sin(ang)*120;s+=rect(915,258-bh,70,bh,{fill:C.hi,fo:.4,rx:3})+line(880,258,1020,258,{color:C.dim,w:2.5});
  s+=fade(seg(p,.72,.8),label('0',950,244,{size:36,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.3)*(1-seg(p,.35,.5)),label('（もし向きがずれていたら）',O[0]-20,O[1]+90,{size:22,color:C.dim}));
  return s+fade(seg(p,.78,.95),label('p は v と同じ向き → つぶれて 0',640,440,{size:28,color:C.hi,anchor:'middle',weight:700}));
 },
});

// Orbit: GM=12, a=1.5, e=1/3 → perihelion r=1 (v=4), aphelion r=2 (v=2), L/m = 4, period T.
const GM=12,Aa=1.5,Ee=1/3,Bb=Math.sqrt(Aa*Aa*(1-Ee*Ee)),Nn=Math.sqrt(GM/Aa**3),TT=2*Math.PI/Nn;
const SUN=[340,258],OS=140;
// time t from perihelion → position (sun at origin, perihelion on the left)
function kep(t){let M=Nn*t,E=M;for(let i=0;i<30;i++)E-= (E-Ee*Math.sin(E)-M)/(1-Ee*Math.cos(E));
 const x=-(Aa*(Math.cos(E)-Ee)),y=Bb*Math.sin(E);const r=Math.hypot(x,y);
 const dE=Nn/(1-Ee*Math.cos(E)),vx=Aa*Math.sin(E)*dE,vy=Bb*Math.cos(E)*dE;return {x,y,r,vx,vy};}
const scr=(x,y)=>[SUN[0]+OS*x,SUN[1]-OS*y];
function ellipse(){return draw(Array.from({length:121},(_,i)=>{const k=kep(TT*i/120);return scr(k.x,k.y);}),1,{color:C.faint,w:2.5});}
function sun(){return dot(SUN[0],SUN[1],16,'#ffc34d')+ring(SUN[0],SUN[1],24,{color:'#ffc34d',w:2})}
function legend(){return dot(40,490,10,'#ffc34d')+label('太陽',58,498,{size:22,color:C.dim})+dot(130,490,9,C.x)+label('惑星',148,498,{size:22,color:C.dim});}
function sector(t0,t1,col,fo=.35){const pts=[SUN];for(let i=0;i<=40;i++){const k=kep(mix(t0,t1,i/40));pts.push(scr(k.x,k.y));}return poly(pts,{fill:col,fo,stroke:col,sw:1.5});}
function planet(k){const [x,y]=scr(k.x,k.y);return dot(x,y,11,C.x);}
function orbScene(p,stage){
 const t=TT*(stage==='const'?lin(p,0,1)*1.0:lin(p,0,1)*.95)+ (stage==='flat'?TT*.3:0);
 const k=kep(stage==='flat'?TT*.3:t),[x,y]=scr(k.x,k.y);
 let s=ellipse()+sun();
 // r (white) and F toward the sun (green)
 s+=arrow(SUN[0],SUN[1],x,y,{color:C.ink,w:4,head:14});
 const ux=(SUN[0]-x)/Math.hypot(SUN[0]-x,SUN[1]-y),uy=(SUN[1]-y)/Math.hypot(SUN[0]-x,SUN[1]-y),fl=60/k.r/k.r+40;
 s+=arrow(x,y,x+ux*fl,y+uy*fl,{color:C.F,w:6,head:16});
 s+=planet(k)+legend();
 if(stage==='force'){
  s+=panel(720,60,440,160)+label('r：太陽 → 惑星',760,115,{size:26,color:C.ink})+label('F：惑星 → 太陽',760,170,{size:26,color:C.F});
  s+=fade(seg(p,.5,.8),label('同じ直線の上で、反対向き',940,275,{size:26,color:C.hi,anchor:'middle',weight:700}));
 }
 if(stage==='flat'){
  // enlarged: r and F on one line, the parallelogram has no height
  const g=seg(p,.05,.4),cx=950,cy=200,sq=mix(90,0,seg(p,.3,.75));
  s+=fade(g,panel(730,40,440,380));
  const A=[cx-100,cy+40],B=[cx+120,cy+40],off=[-Math.cos(sq*D2R)*120,-Math.sin(sq*D2R)*120];
  s+=fade(g,poly([A,B,[B[0]+off[0],B[1]+off[1]],[A[0]+off[0],A[1]+off[1]]],{fill:C.hi,fo:.15,stroke:C.hi,sw:1.5}));
  s+=fade(g,arrow(A[0],A[1],B[0],B[1],{color:C.ink,w:6})+arrow(B[0],B[1],B[0]+off[0],B[1]+off[1],{color:C.F,w:6})+tex('\\vec r',(A[0]+B[0])/2-40,A[1]+44,{size:32,auto:false})+tex('\\vec F',B[0]+off[0]+20,B[1]+off[1]-24,{size:32,color:C.F,auto:false}));
  s+=fade(seg(p,.7,.95),label('高さ 0 → 面積 0',cx,cy+130,{size:28,color:C.hi,anchor:'middle',weight:700})+tex('\\vec N=\\vec r\\times\\vec F=0',cx,cy+180,{size:34}));
 }
 if(stage==='const'){
  // r × v⊥ stays 4 wherever the planet is
  const vperp=Math.abs(k.x*k.vy-k.y*k.vx)/k.r;
  const x0=740,by=420;
  s+=panel(x0-20,40,450,390);
  s+=label('r',x0+45,by+34,{size:26,color:C.ink,anchor:'middle'})+rect(x0+20,by-k.r*80,50,k.r*80,{fill:C.ink,fo:.3,rx:3});
  s+=label('v の直角な分',x0+175,by+34,{size:22,color:C.v,anchor:'middle'})+rect(x0+150,by-vperp*40,50,vperp*40,{fill:C.v,fo:.4,rx:3});
  s+=label('r × 直角な分',x0+330,by+34,{size:22,color:C.p,anchor:'middle'})+rect(x0+305,by-k.r*vperp*40,50,k.r*vperp*40,{fill:C.p,fo:.45,rx:3});
  s+=label(`${fmt(k.r,2)}`,x0+45,by-k.r*80-12,{size:22,color:C.ink,anchor:'middle'})+label(`${fmt(vperp,2)}`,x0+175,by-vperp*40-12,{size:22,color:C.v,anchor:'middle'})+label(`${fmt(k.r*vperp,1)}`,x0+330,by-k.r*vperp*40-12,{size:26,color:C.p,anchor:'middle',weight:700});
  s+=label('L 一定',x0+330,90,{size:26,color:C.p,anchor:'middle',weight:700});
 }
 return s;
}
Object.assign(angularDiagrams,{
 'an-orb:force':(p)=>orbScene(p,'force'),
 'an-orb:flat':(p)=>orbScene(p,'flat'),
 'an-orb:const':(p)=>orbScene(p,'const'),
});

// Equal-time sectors: dt = T/12 around perihelion (near) and aphelion (far).
const DT=TT/12;
function sweep(p,stage){
 let s=ellipse();
 const near=[-DT/2,DT/2],far=[TT/2-DT/2,TT/2+DT/2];
 if(stage==='two'){
  const g1=seg(p,.05,.4),g2=seg(p,.45,.8);
  if(g1>0)s+=sector(near[0],mix(near[0],near[1],g1),C.p);
  if(g2>0)s+=sector(far[0],mix(far[0],far[1],g2),C.x);
  const t=g2>0?mix(far[0],far[1],g2):mix(near[0],near[1],g1);
  s+=sun()+planet(kep(t))+legend();
  // copies side by side on the right, same scale
  const gc=seg(p,.82,1);
  s+=fade(gc,panel(700,40,470,380)+label('同じ時間になぞる面積',935,85,{size:24,color:C.hi,anchor:'middle'}));
  if(gc>0){
   s+=fade(gc,`<g transform="translate(${930-SUN[0]} ${210-SUN[1]})">${sector(near[0],near[1],C.p)}</g>`+`<g transform="translate(${840-SUN[0]} ${350-SUN[1]})">${sector(far[0],far[1],C.x)}</g>`);
   s+=fade(gc,label('近く',730,218,{size:24,color:C.p})+label('遠く',730,358,{size:24,color:C.x}));
  }
  return s;
 }
 s+=sector(near[0],near[1],C.p,.25)+sector(far[0],far[1],C.x,.25)+sun()+legend();
 if(stage==='tri'){
  // thin triangles: base r, height v·Δt (Δt small), per second area r v / 2
  const g=seg(p,.05,.35);
  const kN=kep(0),kF=kep(TT/2),[nx,ny]=scr(kN.x,kN.y),[fx,fy]=scr(kF.x,kF.y);
  s+=fade(g,line(SUN[0],SUN[1],nx,ny,{color:C.ink,w:4})+line(SUN[0],SUN[1],fx,fy,{color:C.ink,w:4}));
  s+=fade(g,arrow(nx,ny,nx,ny-4*28,{color:C.v,w:5,head:14})+arrow(fx,fy,fx,fy+2*28,{color:C.v,w:5,head:14}));
  s+=fade(g,label('r=1',(SUN[0]+nx)/2,SUN[1]-12,{size:22,color:C.ink,anchor:'middle'})+label('r=2',(SUN[0]+fx)/2,SUN[1]+30,{size:22,color:C.ink,anchor:'middle'}));
  s+=fade(g,label('v=4',nx-12,ny-90,{size:22,color:C.v,anchor:'end'})+label('v=2',fx+14,fy+50,{size:22,color:C.v}));
  s+=fade(seg(p,.25,.5),panel(700,40,470,380)+label('1 秒あたりの面積',935,85,{size:24,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.35,.6),label('近く',730,165,{size:24,color:C.p})+tex('\\tfrac12\\times1\\times4=2',970,160,{size:38}));
  s+=fade(seg(p,.6,.85),label('遠く',730,265,{size:24,color:C.x})+tex('\\tfrac12\\times2\\times2=2',970,260,{size:38}));
  s+=fade(seg(p,.85,1),label('同じ！',935,360,{size:32,color:C.hi,anchor:'middle',weight:700}));
 }
 if(stage==='end'){
  // twelve equal-time sectors around the whole orbit, planet sweeping them in turn
  s=ellipse();const t=TT*lin(p,0,.95),kk=Math.floor(t/DT);
  for(let i=0;i<=Math.min(11,kk);i++){const a=i*DT-DT/2,b=Math.min(t,(i+1)*DT)-DT/2;if(b>a)s+=sector(a,b,i%2?C.x:C.p,.28);}
  s+=sun()+planet(kep(t-DT/2))+legend();
  s+=panel(700,60,470,200)+label('どの扇形も同じ時間・同じ面積',935,120,{size:24,color:C.hi,anchor:'middle'});
  s+=fade(seg(p,.3,.6),label('近く：速く、太く短い',935,175,{size:24,color:C.p,anchor:'middle'})+label('遠く：遅く、細く長い',935,220,{size:24,color:C.x,anchor:'middle'}));
 }
 return s;
}
Object.assign(angularDiagrams,{
 'an-sweep:two':(p)=>sweep(p,'two'),
 'an-sweep:tri':(p)=>sweep(p,'tri'),
 'an-sweep:end':(p)=>sweep(p,'end'),
});

// =============================== bridges-9: turning force =============================
const CO=[330,300],CR=170,VS=38;   // circle centre, radius; 38 px per m/s
const onC=a=>[CO[0]+CR*Math.cos(a),CO[1]-CR*Math.sin(a)];
const tanV=(a,len=4*VS)=>[-Math.sin(a)*len,-Math.cos(a)*len];
function circleBase(){return ring(CO[0],CO[1],CR,{color:C.faint,w:2.5,dash:'6 8'})+dot(CO[0],CO[1],5,C.dim)+label('中心',CO[0]+12,CO[1]+28,{size:21,color:C.dim});}
function ballV(a,{g=1,op=1,lab=''}={}){const [x,y]=onC(a),v=tanV(a);return fade(op,arrow(x,y,x+v[0],y+v[1],{color:C.v,w:6,head:16,g})+dot(x,y,12,C.hi))+(lab?fade(op,label(lab,x+v[0]+(v[0]<0?-10:10),y+v[1]-12,{size:22,color:C.v,anchor:v[0]<0?'end':'start'})):'');}
const A1=50*D2R,A2=130*D2R;
function circ(p,stage){
 let s=circleBase();
 if(stage==='run'){const a=(-20+200*lin(p,0,1))*D2R;s+=ballV(a,{lab:'4 m/s'});
  s+=label('速さはいつも 4 m/s',1150,80,{size:26,color:C.v,anchor:'end'});return s;}
 // two moments
 s+=ballV(A1,{lab:'少し前'})+ballV(A2,{lab:'今'});
 const T=[880,170];   // common tail on the right
 const v1=tanV(A1),v2=tanV(A2);
 const g=stage==='two'?seg(p,.3,.8):1;
 const [x1,y1]=onC(A1),[x2,y2]=onC(A2);
 const t1=[mix(x1,T[0],g),mix(y1,T[1],g)],t2=[mix(x2,T[0],g),mix(y2,T[1],g)];
 if(stage==='two'&&g<.02)return s+label('2 つの時刻の速度',1150,70,{size:24,color:C.dim,anchor:'end'});
 s+=arrow(t1[0],t1[1],t1[0]+v1[0],t1[1]+v1[1],{color:C.v,w:6,head:16,opacity:.8})+arrow(t2[0],t2[1],t2[0]+v2[0],t2[1]+v2[1],{color:'#8f7ae0',w:6,head:16});
 if(g>.95)s+=dot(T[0],T[1],7,C.v)+label('根元をそろえる',T[0]+20,T[1]+8,{size:22,color:C.dim});
 if(stage==='dv'){
  const e1=[T[0]+v1[0],T[1]+v1[1]],e2=[T[0]+v2[0],T[1]+v2[1]];
  s+=label('少し前',e1[0]-10,e1[1]-14,{size:21,color:C.v,anchor:'end'})+label('今',e2[0]-10,e2[1]+28,{size:21,color:'#8f7ae0',anchor:'end'});
  const gd=seg(p,.05,.35);s+=arrow(e1[0],e1[1],e2[0],e2[1],{color:C.a,w:6,head:16,g:gd});
  s+=fade(seg(p,.25,.45),label('速度の変化 Δv',e1[0]-16,(e1[1]+e2[1])/2+8,{size:24,color:C.a,anchor:'end'}));
  // carry Δv back to the circle, midway between the two moments (top of the circle)
  const gm=seg(p,.5,.85),top=onC(Math.PI/2),dv=[(e2[0]-e1[0])*.6,(e2[1]-e1[1])*.6];
  const st=[mix(e1[0],top[0]-dv[0]*0,gm),mix(e1[1],top[1]+14,gm)];
  if(gm>0){s+=fade(gm,arrow(st[0],st[1],st[0]+dv[0],st[1]+dv[1],{color:C.a,w:6,head:16}));
   s+=fade(seg(p,.8,1),line(top[0],top[1]+14,CO[0],CO[1],{color:C.a,w:2,dash:'5 7'})+label('中心を向く',CO[0]+24,CO[1]-60,{size:26,color:C.a,weight:700}));}
 }
 return s;
}
Object.assign(angularDiagrams,{
 'an-circ:run':(p)=>circ(p,'run'),
 'an-circ:two':(p)=>circ(p,'two'),
 'an-circ:dv':(p)=>circ(p,'dv'),
});
function cf(p,stage){
 let s=circleBase();
 const a=(stage==='force'?(20+160*lin(p,0,1)):stage==='zoom'?60:(60+150*lin(p,0,1)))*D2R;
 const [x,y]=onC(a),v=tanV(a),fl=110,f=[(CO[0]-x)/CR*fl,(CO[1]-y)/CR*fl];
 if(stage==='force')[0,1,2,3].forEach(i=>{const b=(20+i*40)*D2R;if(b<a-.1){const [gx,gy]=onC(b);s+=fade(.3,arrow(gx,gy,gx+(CO[0]-gx)/CR*fl,gy+(CO[1]-gy)/CR*fl,{color:C.F,w:5,head:14}));}});
 s+=arrow(x,y,x+v[0],y+v[1],{color:C.v,w:6,head:16})+arrow(x,y,x+f[0],y+f[1],{color:C.F,w:7,head:18})+dot(x,y,12,C.hi);
 s+=label('速度 v',1150,70,{size:24,color:C.v,anchor:'end'})+label('力 F（中心向き）',1150,110,{size:24,color:C.F,anchor:'end'});
 if(stage==='zoom'){
  // magnifier: tiny step along the circle vs the force
  const g=seg(p,.05,.35),M=[840,300],MR=150;
  s+=fade(g,ring(x,y,34,{color:C.hi,w:3})+line(x+30,y+18,M[0]-MR*.8,M[1]-MR*.4,{color:C.hi,w:2,dash:'5 6'})+ring(M[0],M[1],MR,{color:C.hi,w:3,fill:'#101a30'}));
  const u=[-Math.sin(a),-Math.cos(a)],c=[(CO[0]-x)/CR,(CO[1]-y)/CR];
  const gs=seg(p,.3,.6);
  s+=fade(gs,arrow(M[0],M[1],M[0]+u[0]*110,M[1]+u[1]*110,{color:C.x,w:6,head:16})+label('少しの移動',M[0]+MR+14,M[1]-50,{size:24,color:C.x}));
  s+=fade(gs,arrow(M[0],M[1],M[0]+c[0]*110,M[1]+c[1]*110,{color:C.F,w:6,head:16})+label('力（中心向き）',M[0]+MR+14,M[1]+60,{size:24,color:C.F}));
  s+=fade(seg(p,.6,.85),rightMark(M[0],M[1],u,c,22,C.hi)+label('直角',M[0]+u[0]*30+c[0]*30+16,M[1]+u[1]*30+c[1]*30+48,{size:24,color:C.hi,weight:700}));
 }
 if(stage==='zero'){
  s+=panel(700,160,460,230);
  s+=fade(seg(p,.05,.3),label('仕事 ＝ 進む向きの力 × 距離',930,215,{size:24,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.35,.6),label('進む向きの力：0 N',930,270,{size:26,color:C.F,anchor:'middle'}));
  s+=fade(seg(p,.6,.85),label('0 N × 2 m ＝ 0 J',930,340,{size:34,color:C.hi,anchor:'middle',weight:700}));
 }
 if(stage==='speed'){
  s+=panel(700,160,460,260)+label('運動エネルギー',930,210,{size:24,color:C.E,anchor:'middle'});
  s+=rect(780,240,300,40,{fill:C.E,fo:.4,rx:4})+label('増えも減りもしない',930,320,{size:24,color:C.E,anchor:'middle'});
  s+=fade(seg(p,.4,.7),label('速さ 4 m/s のまま',930,385,{size:30,color:C.v,anchor:'middle',weight:700}));
 }
 return s;
}
Object.assign(angularDiagrams,{
 'an-cf:force':(p)=>cf(p,'force'),
 'an-cf:zoom':(p)=>cf(p,'zoom'),
 'an-cf:zero':(p)=>cf(p,'zero'),
 'an-cf:speed':(p)=>cf(p,'speed'),
});
// Oblique 5 N split into 3 N along the motion and 4 N perpendicular to it.
function split(p,stage){
 const Y=380,S=60;
 const x=stage==='work'?200+2*120*seg(p,.1,.7):200;
 let s=line(80,Y+20,1140,Y+20,{color:C.dim,w:3})+label('進む向き',1140,Y+56,{size:22,color:C.dim,anchor:'end'});
 s+=rect(x-40,Y-60,80,80,{fill:C.x,fo:.25,rx:8});
 const cx=x,cy=Y-20,F=[3*S,-4*S];
 s+=arrow(cx-170,cy-10,cx-60,cy-10,{color:C.v,w:5,head:14})+label('4 m/s',cx-170,cy-32,{size:22,color:C.v});
 const g=stage==='angle'?seg(p,.05,.3):1;
 s+=arrow(cx,cy,cx+F[0],cy+F[1],{color:C.F,w:7,g,head:18})+fade(g,label('5 N',cx+F[0]+12,cy+F[1]+8,{size:26,color:C.F,weight:700}));
 const gs=stage==='angle'?seg(p,.4,.75):1;
 s+=fade(gs,line(cx+F[0],cy,cx+F[0],cy+F[1],{color:C.F,w:2,dash:'5 6'})+line(cx,cy+F[1],cx+F[0],cy+F[1],{color:C.F,w:2,dash:'5 6'}));
 s+=arrow(cx,cy,cx+F[0],cy,{color:'#5fd39f',w:7,head:16,g:gs})+arrow(cx,cy,cx,cy+F[1],{color:C.a,w:7,head:16,g:gs});
 s+=fade(gs,label('3 N（進む向き）',cx+F[0]/2+20,cy+76,{size:24,color:'#5fd39f',anchor:'middle'})+label('4 N（直角）',cx-16,cy+F[1]/2,{size:24,color:C.a,anchor:'end'}));
 if(stage==='angle')s+=fade(seg(p,.8,1),label('3・4・5 の直角三角形',1150,80,{size:26,color:C.hi,anchor:'end'}));
 if(stage==='work'){
  s+=fade(seg(p,.1,.3),line(200,Y+100,200+2*120*seg(p,.1,.7),Y+100,{color:C.x,w:4})+label(`${fmt(2*seg(p,.1,.7),1)} m`,200+120*seg(p,.1,.7),Y+128,{size:22,color:C.x,anchor:'middle'}));
  s+=panel(720,60,440,200)+tex('W=3\\times2=6',940,140,{size:40})+label('単位は J（ジュール）',940,200,{size:22,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.7,.95),label('速さを増やすのは 3 N だけ',940,240,{size:22,color:'#5fd39f',anchor:'middle'}));
 }
 if(stage==='role'){
  s+=panel(620,40,540,300);
  s+=label('沿う力',680,110,{size:26,color:'#5fd39f'})+label('→ 速さを変える（仕事をする）',790,110,{size:24,color:C.ink});
  s+=fade(seg(p,.2,.45),label('直角な力',680,180,{size:26,color:C.a})+label('→ 向きだけ変える（仕事 0）',790,180,{size:24,color:C.ink}));
  s+=fade(seg(p,.55,.85),label('力があっても 仕事 0 なら 速さは同じ',890,280,{size:26,color:C.hi,anchor:'middle',weight:700}));
 }
 return s;
}
Object.assign(angularDiagrams,{
 'an-split:angle':(p)=>split(p,'angle'),
 'an-split:work':(p)=>split(p,'work'),
 'an-split:role':(p)=>split(p,'role'),
});

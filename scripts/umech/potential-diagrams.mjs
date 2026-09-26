// 単元「力はポテンシャルの傾き」 — pictures. Viewbox 1200×515.
// Colours: position cyan, velocity purple, force green, time gold, energy orange (U).
// Kinetic energy K is drawn purple (it comes from the speed), total energy E in the highlight colour.
import {C,clamp,mix,smooth,seg,lin,fmt,fade,label,line,rect,dot,ring,draw,poly,arrow,brace,axes,ground,block,spring,wall,tex} from './anim.mjs';

const KC=C.v,UC=C.E,EC=C.hi;
const ball=(x,y,r=20,col=C.x)=>`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${col}" fill-opacity=".35" stroke="${col}" stroke-width="3"/>`;
// Vertical energy bar standing on baseline y0 (negative values hang below it).
function ebar(x,w,y0,val,scale,col,{name='',value=true,g=1,unit=' J',nameY,dec=0}={}){
 const h=val*scale,top=Math.min(y0,y0-h),H=Math.abs(h);
 let s=rect(x,top,w,H,{fill:col,fo:.45,rx:3,sw:2,stroke:col});
 if(value)s+=label(`${val<-.001?'−':''}${Math.abs(val).toFixed(dec)}${unit}`,x+w/2,val>=0?y0-h-12:y0-h+30,{size:24,color:col,anchor:'middle',weight:700});
 if(name)s+=label(name,x+w/2,nameY??y0+34,{size:22,color:col,anchor:'middle'});
 return fade(g,s);
}

// ---------------------------------------------------------------- intro: zero of U
const FL=470,MP=110; // floor y, px per metre
const hy=h=>FL-MP*h;
function room({desk=true}={}){
 let s=ground(40,700,FL);
 // shelf 3 m high at the left
 s+=rect(90,hy(3),200,14,{fill:C.dim,fo:.5,rx:2,sw:0})+line(100,hy(3)+14,100,FL,{color:C.faint,w:6});
 s+=label('棚',150,hy(3)-16,{size:22,color:C.dim,anchor:'middle'});
 if(desk)s+=rect(430,hy(1),180,12,{fill:C.dim,fo:.5,rx:2,sw:0})+line(445,hy(1)+12,445,FL,{color:C.faint,w:5})+line(595,hy(1)+12,595,FL,{color:C.faint,w:5})+label('机',520,hy(1)+44,{size:22,color:C.dim,anchor:'middle'});
 return s;
}
function ruler(x,zero,g,col,side=1){
 // ticks every metre from floor (0 m) to 3 m, labelled relative to `zero`.
 let s=line(x,FL,x,hy(3.25),{color:col,w:3});
 for(let h=0;h<=3;h++){const v=h-zero;s+=line(x-8,hy(h),x+8,hy(h),{color:col,w:3})+label(`${v}`,x+side*16,hy(h)+8,{size:22,color:col,anchor:side>0?'start':'end'});}
 s+=dot(x,hy(zero),7,col);
 return fade(g,s);
}
const BAR0=300,BS=3.2; // U panel baseline and px per joule
function uPanel(uA,uB,{gA=1,gB=1}={}){
 let s=line(760,BAR0,1170,BAR0,{color:C.dim,w:2})+label('U = 0',765,BAR0+28,{size:22,color:C.dim});
 s+=ebar(780,100,BAR0,uA,BS,UC,{name:'床がゼロ',g:gA,nameY:BAR0+150});
 s+=ebar(1000,100,BAR0,uB,BS,UC,{name:'机がゼロ',g:gB,nameY:BAR0+150});
 return s;
}
const BX=270; // ball x on the shelf edge
function zeroScene(p,stage){
 let s=room();
 let h=3,x=BX;
 if(stage===3){const u=lin(p,.08,.6);x=BX+60*smooth(u*4);h=3-3*u*u;}
 const y=hy(h)-20;
 s+=ball(x,y)+label('2 kg',x,y-32,{size:22,color:C.x,anchor:'middle'});
 const gA=stage===1?seg(p,.05,.3):1,gB=stage===2?seg(p,.05,.35):stage>2?1:0;
 s+=ruler(60,0,gA,C.x,1);
 s+=ruler(680,1,gB,C.t,-1);
 if(stage<=2)s+=fade(stage===1?seg(p,.25,.45):1,line(BX,hy(3),690,hy(3),{color:C.hi,w:2,dash:'6 7'}));
 if(stage>=2)s+=fade(gB,label('机の面を 0 に',700,hy(1)+8,{size:22,color:C.t}));
 const uA=stage===1?60*seg(p,.35,.7):20*h,uB=stage===2?40*seg(p,.35,.7):20*(h-1);
 s+=uPanel(uA,uB,{gA:stage===1?seg(p,.3,.4):1,gB:stage===1?0:stage===2?seg(p,.3,.4):1});
 if(stage===1)s+=fade(seg(p,.7,.95),tex('U=mgh=2\\times10\\times3=60',960,40,{size:30}));
 if(stage===3){const g=seg(p,.65,.9);
  s+=fade(g,line(780,BAR0-60*BS,900,BAR0-60*BS,{color:C.faint,w:1.5,dash:'5 6'})+line(1000,BAR0-40*BS,1120,BAR0-40*BS,{color:C.faint,w:1.5,dash:'5 6'}));
  s+=fade(g,label('−60 J',902,BAR0-30*BS+10,{size:26,color:C.hi,weight:700})+label('−60',1122,BAR0-10*BS-6,{size:26,color:C.hi,weight:700})+label('J',1122,BAR0-10*BS+24,{size:26,color:C.hi,weight:700}));
  s+=arrow(892,BAR0-58*BS,892,BAR0-2,{color:C.hi,w:3,g,head:12})+arrow(1112,BAR0-38*BS,1112,BAR0+20*BS-2,{color:C.hi,w:3,g,head:12});
  s+=fade(seg(p,.85,1),label('差は同じ',960,60,{size:30,color:C.hi,anchor:'middle',weight:700}));
 }
 return s;
}

// ---------------------------------------------------------------- intro: falling ball, U → K
const FX=380,FF=440,FM=100,fy=h=>FF-FM*h;
function fallScene(p,stage){
 // stage 1: bars; 2: work of gravity; 3: thrown up (K → U)
 let s=ground(40,640,FF)+line(220,FF,220,fy(3),{color:C.x,w:3});
 for(let h=0;h<=3;h++)s+=line(212,fy(h),228,fy(h),{color:C.x,w:3})+label(`${h} m`,200,fy(h)+8,{size:22,color:C.x,anchor:'end'});
 const up=stage===3,u=lin(p,.08,.78),d=up?3*(1-u)*(1-u):3*u*u; // d = drop below 3 m
 const h=3-d,y=fy(h)-20,v=Math.sqrt(20*Math.max(0,d));
 s+=line(FX,fy(3)-20,FX,FF-20,{color:C.faint,w:2,dash:'4 8'});
 s+=ball(FX,y)+label('2 kg',FX+34,y-22,{size:22,color:C.x});
 s+=arrow(FX+30,y+4,FX+30,y+56,{color:C.F,w:6,head:16})+label('重力 20 N',FX+44,y+46,{size:22,color:C.F});
 if(v>1)s+=arrow(FX-32,y,FX-32,y+(up?-1:1)*v*7,{color:C.v,w:5,head:14})+label(`${fmt(v)} m/s`,FX-44,up?y-v*3.5+8:y-14,{size:22,color:C.v,anchor:'end'});
 const B0=440,SC=4.4,U=20*h,K=60-U;
 s+=line(680,B0,1170,B0,{color:C.dim,w:2});
 s+=ebar(690,110,B0,U,SC,UC,{name:'位置エネルギー U',nameY:B0+34});
 s+=ebar(940,110,B0,K,SC,KC,{name:'運動エネルギー K',nameY:B0+34,value:K>1});
 s+=line(680,B0-60*SC,1170,B0-60*SC,{color:EC,w:2.5,dash:'8 7'})+label('合計 60 J',1170,B0-60*SC-12,{size:24,color:EC,anchor:'end'});
 if(stage===2){
  const g=seg(p,.1,.35);
  s+=arrow(815,B0-40,925,B0-40,{color:C.F,w:5,head:16,g})+fade(g,label('重力の仕事',870,B0-56,{size:22,color:C.F,anchor:'middle'}));
  s+=fade(seg(p,.55,.9),tex('W_g=20\\times3=60',930,80,{size:32}));
  s+=fade(seg(p,.2,.5),line(FX+160,fy(3),FX+160,FF,{color:C.x,w:3})+label('3 m',FX+172,fy(1.5),{size:22,color:C.x}));
 }
 if(stage===3){
  s+=fade(seg(p,.05,.3),label('上へ動く ↔ 重力は下向き',1170,60,{size:24,color:C.F,anchor:'end'}));
  s+=fade(seg(p,.35,.7),label('重力の仕事は負：K が U へ',1170,100,{size:24,color:C.hi,anchor:'end'}));
 }
 return s;
}

// ---------------------------------------------------------------- intro: three paths
const A0=[130,hy(3)],B0p=[620,FL];
const PATHS=[
 {name:'坂',col:C.x,pts:[A0,B0p]},
 {name:'階段',col:C.v,pts:[A0,[293,hy(3)],[293,hy(2)],[457,hy(2)],[457,hy(1)],[620,hy(1)],B0p]},
 {name:'落ちて横へ',col:C.t,pts:[A0,[130,FL],B0p]},
];
function along(pts,u){let L=0;const ls=[];for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);ls.push(d);L+=d;}let w=L*clamp(u);for(let i=1;i<pts.length;i++){if(w<=ls[i-1]){const k=ls[i-1]?w/ls[i-1]:0;return {x:mix(pts[i-1][0],pts[i][0],k),y:mix(pts[i-1][1],pts[i][1],k),seg:i-1};}w-=ls[i-1];}return {x:pts.at(-1)[0],y:pts.at(-1)[1],seg:pts.length-2};}
function pathBase(){let s=ground(40,700,FL)+label('A',A0[0]-30,A0[1]+8,{size:26,color:C.hi,weight:700})+label('B',B0p[0]+14,B0p[1]-14,{size:26,color:C.hi,weight:700});s+=dot(A0[0],A0[1],7,C.hi)+dot(B0p[0],B0p[1],7,C.hi);return s;}
const WS=4; // px per J in the meters
function meter(y,name,col,val,g=1){return fade(g,label(name,740,y+8,{size:24,color:col})+rect(870,y-14,60*WS,28,{fill:C.faint,fo:.25,rx:4,sw:0})+rect(870,y-14,val*WS,28,{fill:col,fo:.55,rx:4,sw:0})+label(`${fmt(val,0)} J`,870+60*WS+12,y+8,{size:24,color:col}));}
function pathsAll(p){
 let s=pathBase();
 PATHS.forEach((P,i)=>{const a=.03+i*.29,b=a+.25,u=lin(p,a,b);
  s+=draw(P.pts,1,{color:P.col,w:3,dash:'6 8',opacity:.6});
  if(u>0)s+=draw(P.pts,u,{color:P.col,w:5});
  const q=along(P.pts,u),dropM=(q.y-A0[1])/MP;
  if(u>0&&u<1)s+=ball(q.x,q.y-18,16,P.col);
  s+=meter(150+i*90,P.name,P.col,20*dropM,u>0?1:.35);
 });
 s+=label('重力の仕事',990,90,{size:24,color:C.F,anchor:'middle'});
 return s+fade(seg(p,.86,.95),label('どれも 60 J',1010,440,{size:30,color:C.hi,anchor:'middle',weight:700}));
}
function pathsSteps(p){
 let s=pathBase();const P=PATHS[1];
 s+=draw(P.pts,1,{color:P.col,w:3,dash:'6 8',opacity:.6});
 const u=lin(p,.05,.85);s+=draw(P.pts,u,{color:P.col,w:5});
 const q=along(P.pts,u),drop=(q.y-A0[1])/MP;
 const bx=q.x,by=q.y-18,horiz=q.seg%2===0&&u<1;
 s+=ball(bx,by,16,P.col);
 s+=arrow(bx,by+4,bx,by+80,{color:C.F,w:5,head:14})+label('重力',bx+10,by+84,{size:22,color:C.F});
 if(u<1)s+=arrow(bx,by-30,bx+(horiz?70:0),by-30+(horiz?0:70),{color:C.x,w:4,head:12});
 // tally
 const parts=[0,1,2].map(i=>clamp(drop-i));
 s+=label('重力の仕事',760,120,{size:26,color:C.F});
 ['1段目','2段目','3段目'].forEach((n,i)=>{s+=label(`${n}：横 0 J ＋ 下 ${fmt(20*parts[i],0)} J`,760,175+i*55,{size:24,color:parts[i]>0?C.ink:C.dim});});
 s+=fade(u>.02&&horiz?1:0,label('直角 → 仕事 0',bx+10,by-50,{size:22,color:C.hi}));
 return s+fade(seg(p,.85,1),label('合計 60 J',760,370,{size:30,color:C.hi,weight:700}));
}
// Top view of a floor with friction: straight 2 m vs 6 m detour.
function friction(p){
 const S=110,Ax=190,Ay=400,Bx=Ax+2*S,By=Ay;
 let s=rect(70,90,560,370,{fill:C.faint,fo:.18,rx:10,stroke:C.faint})+label('床を上から見た図（摩擦 1 N）',80,80,{size:22,color:C.dim});
 const straight=[[Ax,Ay],[Bx,By]],detour=[[Ax,Ay],[Ax,Ay-2*S],[Bx,Ay-2*S],[Bx,By]];
 const u1=lin(p,.05,.35),u2=lin(p,.42,.9);
 s+=draw(straight,1,{color:C.x,w:3,dash:'6 8',opacity:.6})+draw(detour,1,{color:C.t,w:3,dash:'6 8',opacity:.6});
 s+=draw(straight,u1,{color:C.x,w:5})+draw(detour,u2,{color:C.t,w:5});
 s+=label('A',Ax-30,Ay+8,{size:26,color:C.hi,weight:700})+label('B',Bx+14,By+8,{size:26,color:C.hi,weight:700})+label('2 m',(Ax+Bx)/2,Ay+36,{size:22,color:C.x,anchor:'middle'});
 const cur=u2>0?{P:detour,u:u2,col:C.t}:{P:straight,u:u1,col:C.x};
 if(cur.u>0&&cur.u<1){const a=along(cur.P,cur.u),b=along(cur.P,Math.min(1,cur.u+.02));const dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy)||1;
  s+=ball(a.x,a.y,15,cur.col)+arrow(a.x-dx/L*18,a.y-dy/L*18,a.x-dx/L*78,a.y-dy/L*78,{color:C.F,w:5,head:14})+'';}
 s+=label('緑の矢印：摩擦（動きと逆向き）',80,490,{size:22,color:C.F});
 // meters (negative work)
 const W1=-2*u1,W2=-6*u2,Z=780,SC=48;
 s+=label('摩擦の仕事',Z,120,{size:26,color:C.F});
 s+=line(Z,170,Z,430,{color:C.dim,w:2})+label('0',Z-8,160,{size:22,color:C.dim,anchor:'middle'});
 s+=rect(Z,190,-W1*SC,40,{fill:C.x,fo:.5,rx:3,sw:0})+label(`まっすぐ ${W1<-.01?'−':''}${fmt(Math.abs(W1),1)} J`,Z+10,262,{size:24,color:C.x});
 s+=rect(Z,300,-W2*SC,40,{fill:C.t,fo:.5,rx:3,sw:0})+label(`遠回り 6 m：${W2<-.01?'−':''}${fmt(Math.abs(W2),1)} J`,Z+10,372,{size:24,color:C.t});
 return s+fade(seg(p,.84,.95),label('同じ A→B でも値が違う',900,460,{size:28,color:C.hi,anchor:'middle',weight:700}));
}
function verdict(p){
 const g1=seg(p,0,.25),g2=seg(p,.3,.55),g3=seg(p,.65,.9);
 let s=fade(g1,rect(70,70,500,300,{fill:C.F,fo:.08,stroke:C.F,rx:16})+label('重力',320,120,{size:32,color:C.F,anchor:'middle',weight:700})+label('どの道でも 60 J',320,190,{size:28,color:C.ink,anchor:'middle'})+label('→ 場所だけで決まる',320,250,{size:28,color:C.ink,anchor:'middle'})+label('位置エネルギー U を持てる',320,320,{size:28,color:C.hi,anchor:'middle',weight:700}));
 s+=fade(g2,rect(630,70,500,300,{fill:C.a,fo:.08,stroke:C.a,rx:16})+label('摩擦',880,120,{size:32,color:C.a,anchor:'middle',weight:700})+label('道で −2 J、−6 J',880,190,{size:28,color:C.ink,anchor:'middle'})+label('→ 場所だけでは決まらない',880,250,{size:28,color:C.ink,anchor:'middle'})+label('U は作れない',880,320,{size:28,color:C.a,anchor:'middle',weight:700}));
 return s+fade(g3,label('仕事が道によらない力 ＝ 保存力',600,450,{size:34,color:C.hi,anchor:'middle',weight:700}));
}

export const potentialDiagrams={
 'pt-zero:floor':p=>zeroScene(p,1),
 'pt-zero:desk':p=>zeroScene(p,2),
 'pt-zero:drop':p=>zeroScene(p,3),
 'pt-fall:bars':p=>fallScene(p,1),
 'pt-fall:work':p=>fallScene(p,2),
 'pt-fall:up':p=>fallScene(p,3),
 'pt-path:all':pathsAll,
 'pt-path:steps':pathsSteps,
 'pt-fric':friction,
 'pt-verdict':verdict,
};

// ---------------------------------------------------------------- middle: spring and U(x)
const K=200;
function springPull(p){
 const x=.1*seg(p,.1,.7),N=520,SC=3000,bx=N+SC*x,Y=330;
 let s=wall(120,210,430)+ground(120,1000,430);
 s+=spring(120,bx-60,Y,{coils:10,amp:18,color:C.dim});
 s+=rect(bx-60,Y-55,120,110,{fill:C.x,fo:.28,rx:8});
 s+=line(N,190,N,440,{color:C.faint,w:2,dash:'6 6'})+label('自然長',N,180,{size:22,color:C.dim,anchor:'middle'});
 // x arrow (stretch)
 if(x>.004)s+=arrow(N,460,bx,460,{color:C.x,w:4,head:12})+label(`x = ${fmt(x,2)} m`,(N+bx)/2,500,{size:22,color:C.x,anchor:'middle'});
 const F=K*x,L=6*F;
 if(L>4){
  s+=arrow(bx+60,Y,bx+60+L,Y,{color:C.dim,w:6,head:16})+label(`手の力 +kx = ${fmt(F,0)} N`,bx+66,Y+36,{size:22,color:C.dim});
  s+=arrow(bx-60,Y-80,bx-60-L,Y-80,{color:C.F,w:6,head:16})+label(`ばねの力 −kx = −${fmt(F,0)} N`,bx-60-L,Y-104,{size:22,color:C.F});
 }
 return s+label('右向きを正',1050,120,{size:22,color:C.dim,anchor:'end'})+arrow(960,140,1050,140,{color:C.dim,w:3,head:12});
}
function springArea(p){
 const A=axes({x:140,y:450,w:620,h:340,xmax:.12,ymax:26,xlabel:'伸び x [m]',ylabel:'−F = kx [N]',xticks:[.05,.1],yticks:[10,20],grid:true,xcolor:C.x,ycolor:C.F});
 let s=A.svg+A.plot(x=>K*x,{from:0,to:.115,color:C.F,w:4});
 const n=10,w=.01;let area=0;
 for(let i=0;i<n;i++){const g=seg(p,.05+i*.05,.1+i*.05);if(g<=0)continue;const x0=i*w,xm=x0+w/2,h=K*xm;area+=h*w*g;
  s+=fade(g,rect(A.X(x0)+1,A.Y(h),A.X(x0+w)-A.X(x0)-2,A.Y(0)-A.Y(h),{fill:UC,fo:.45,rx:0,sw:0}));}
 const gT=seg(p,.62,.8);
 s+=fade(gT,poly([[A.X(0),A.Y(0)],[A.X(.1),A.Y(20)],[A.X(.1),A.Y(0)]],{fill:UC,fo:.25,stroke:UC,sw:3}));
 s+=fade(seg(p,.1,.3),label('短冊1本 = kx × dx',A.X(.06),A.Y(24),{size:22,color:UC,anchor:'middle'}));
 // U bar
 s+=line(1000,450,1170,450,{color:C.dim,w:2})+ebar(1040,100,450,Math.min(1,area),300,UC,{name:'たまった U',nameY:485,dec:2});
 return s+fade(seg(p,.72,.95),tex('U=\\tfrac12kx^2=\\tfrac12\\times200\\times0.1^2=1.0',640,50,{size:30}));
}
const uAx=(g=1)=>axes({x:150,y:450,w:680,h:360,xmin:-.15,xmax:.15,ymax:2.5,xlabel:'位置 x [m]',ylabel:'U [J]',xticks:[-.1,.1],yticks:[1,2],grid:true,g,xcolor:C.x,ycolor:UC});
const Uf=x=>K*x*x/2;
function uCurve(p){
 const A=uAx(seg(p,0,.2));let s=A.svg+A.plot(Uf,{from:-.15,to:.15,p:seg(p,.15,.6),color:UC,w:5});
 s+=fade(seg(p,.55,.75),dot(A.X(.1),A.Y(1),9,UC)+label('0.1 m で 1.0 J',A.X(.1)+16,A.Y(1)+34,{size:22,color:UC}));
 return s+fade(seg(p,.7,.95),rect(920,60,260,110,{fill:UC,fo:.08,stroke:UC,rx:12})+label('縦軸はエネルギー',1050,105,{size:24,color:UC,anchor:'middle'})+label('高さではない',1050,145,{size:24,color:UC,anchor:'middle'}));
}
function uSecant(p){
 const A=uAx();let s=A.svg+A.plot(Uf,{from:-.15,to:.15,color:UC,w:5});
 const x0=.06,dx=mix(.07,.004,seg(p,.2,.8)),x1=x0+dx,m=(Uf(x1)-Uf(x0))/dx;
 const ext=.07;
 s+=line(A.X(x0-ext),A.Y(Uf(x0)-m*ext),A.X(x1+ext),A.Y(Uf(x1)+m*ext),{color:C.hi,w:3});
 s+=line(A.X(x0),A.Y(Uf(x0)),A.X(x1),A.Y(Uf(x0)),{color:C.x,w:4})+line(A.X(x1),A.Y(Uf(x0)),A.X(x1),A.Y(Uf(x1)),{color:UC,w:4});
 s+=dot(A.X(x0),A.Y(Uf(x0)),9,C.hi)+dot(A.X(x1),A.Y(Uf(x1)),8,C.hi);
 const gl=1-seg(p,.55,.7);
 s+=fade(gl,tex('\\Delta x',(A.X(x0)+A.X(x1))/2,A.Y(Uf(x0))+30,{size:26})+tex('\\Delta U',A.X(x1)+44,(A.Y(Uf(x0))+A.Y(Uf(x1)))/2+8,{size:28}));
 s+=label('傾き',900,90,{size:26,color:C.hi})+tex(`\\frac{\\Delta U}{\\Delta x}=${fmt(m,1)}`,1040,90,{size:30});
 s+=fade(seg(p,.75,.95),label('Δx → 0 で接線',900,160,{size:26,color:C.hi})+label('傾き 12 → 力 −12 N',900,215,{size:26,color:C.F}));
 s+=fade(seg(p,.8,1),arrow(A.X(x0),A.Y(Uf(x0))-30,A.X(x0)-100,A.Y(Uf(x0))-30,{color:C.F,w:6,head:16}));
 return s;
}
function uBall(p){
 const A=uAx();let s=A.svg+A.plot(Uf,{from:-.15,to:.15,color:UC,w:5});
 const u=lin(p,.05,.85),x=.12*Math.cos(2.5*Math.PI*u),y=Uf(x),m=K*x,F=-m;
 const X=A.X(x),Y=A.Y(y);
 s+=line(A.X(x-.035),A.Y(y-m*.035),A.X(x+.035),A.Y(y+m*.035),{color:C.hi,w:3});
 s+=ball(X,Y-18,16,C.x);
 if(Math.abs(F)>.8)s+=arrow(X,Y-56,X+F*5.5,Y-56,{color:C.F,w:6,head:16});
 const sg=v=>Math.abs(v)<.5?'0':`${v>0?'+':'−'}${fmt(Math.abs(v),0)}`;
 s+=rect(900,60,280,130,{fill:C.faint,fo:.2,rx:12,sw:0});
 s+=label(`傾き ${sg(m)}`,925,108,{size:26,color:C.hi});
 s+=label(`力 ${sg(F)} N`,925,160,{size:26,color:C.F});
 return s+fade(seg(p,.85,1),label('谷底：傾き 0 → 力 0',905,240,{size:26,color:C.hi,weight:700}));
}
// A landscape with a valley (s=3) and a hill (s=7).
const Lf=s=>2.1-1.1*Math.sin(Math.PI*(s-1)/4),dL=s=>-1.1*Math.PI/4*Math.cos(Math.PI*(s-1)/4);
const hAx=()=>axes({x:130,y:440,w:900,h:330,xmax:10,ymax:3.5,xlabel:'位置 x',ylabel:'U',xticks:[],yticks:[],xcolor:C.x,ycolor:UC});
function landscape(p,names){
 const A=hAx();let s=A.svg+A.plot(Lf,{from:.3,to:9.7,color:UC,w:5});
 const place=(sx,col)=>{const X=A.X(sx),Y=A.Y(Lf(sx)),F=-dL(sx);let o=ball(X,Y-18,16,col);if(Math.abs(F)>.08)o+=arrow(X,Y-54,X+F*90,Y-54,{color:C.F,w:6,head:16});return o;};
 const gv=names?1:seg(p,0,.1),gh=names?1:seg(p,.45,.55);
 // valley: small oscillation around s=3
 const uv=names?p:lin(p,.02,.5),sv=3+.9*Math.cos(2*Math.PI*1.5*uv)*(names?1:1);
 s+=fade(gv,place(sv,C.x));
 // hill: roll away from s=7
 const uh=names?1:lin(p,.5,.95),sh=Math.min(9.3,7.05+.05*(Math.exp(4.2*uh)-1));
 if(gh>0)s+=fade(gh,place(sh,C.v)+(names?'':dot(A.X(7.05),A.Y(Lf(7.05))-18,5,C.dim)));
 if(names){const g=seg(p,.05,.35);
  s+=fade(g,label('安定なつり合い',A.X(3),A.Y(Lf(3))+50,{size:28,color:C.x,anchor:'middle',weight:700})+label('ずらすと戻される',A.X(3),A.Y(Lf(3))+82,{size:22,color:C.x,anchor:'middle'}));
  s+=fade(seg(p,.3,.6),label('不安定なつり合い',A.X(7),A.Y(Lf(7))-80,{size:28,color:C.v,anchor:'middle',weight:700})+label('ずらすと離れていく',A.X(7),A.Y(Lf(7))-48,{size:22,color:C.v,anchor:'middle'}));
 }else{
  s+=fade(seg(p,.2,.4),label('谷：力は谷底へ',A.X(3),A.Y(Lf(3))+56,{size:24,color:C.x,anchor:'middle'}));
  s+=fade(seg(p,.7,.85),label('山：力は外へ',A.X(7),A.Y(Lf(7))-80,{size:24,color:C.v,anchor:'middle'}));
 }
 return s;
}
Object.assign(potentialDiagrams,{
 'pt-spr:pull':springPull,
 'pt-spr:area':springArea,
 'pt-u:curve':uCurve,
 'pt-u:secant':uSecant,
 'pt-u:ball':uBall,
 'pt-hill:nudge':p=>landscape(p,false),
 'pt-hill:names':p=>landscape(p,true),
});

// ---------------------------------------------------------------- advanced: gravity, U = −GMm/r, escape
const EX=150,EY=300,ER=80; // Earth centre and radius in px (1 R = 80 px)
function earth(x=EX,y=EY,r=ER){return `<circle cx="${x}" cy="${y}" r="${r}" fill="#2f6fb0" fill-opacity=".55" stroke="#7fb7ff" stroke-width="3"/>`+label('地球 M',x,y+8,{size:24,color:C.ink,anchor:'middle'});}
function gravEarth(p){
 let s=earth()+line(EX+ER,EY,1160,EY,{color:C.faint,w:2,dash:'6 8'});
 [2,4,8].forEach(r=>{const X=EX+ER*r;s+=line(X,EY-8,X,EY+8,{color:C.dim,w:2})+label(`${r}R`,X,EY+36,{size:22,color:C.dim,anchor:'middle'});});
 s+=label('R：地球の半径',EX,EY+ER+40,{size:22,color:C.dim,anchor:'middle'});
 const r=mix(1.6,12.5,lin(p,.05,.9)),X=EX+ER*r,L=Math.min(400/(r*r),X-18-EX-ER-6);
 // ghosts at 2R and 4R
 const ghost=(rr,g)=>fade(g*.55,ball(EX+ER*rr,EY-70,16,C.x)+arrow(EX+ER*rr-18,EY-70,EX+ER*rr-18-400/(rr*rr),EY-70,{color:C.F,w:5,head:14}));
 if(r>2)s+=ghost(2,1)+fade(.8,label('1',EX+ER*2-18-50,EY-94,{size:24,color:C.F,anchor:'middle'}));
 if(r>4)s+=ghost(4,1)+fade(.8,label('1/4',EX+ER*4-40,EY-94,{size:24,color:C.F,anchor:'middle'}));
 s+=ball(X,EY-70,16,C.x)+label('m',X,EY-100,{size:24,color:C.x,anchor:'middle'});
 if(L>3)s+=arrow(X-18,EY-70,X-18-L,EY-70,{color:C.F,w:6,head:16});
 return s+fade(seg(p,.55,.85),label('距離 2 倍 → 力は 1/4',1160,440,{size:30,color:C.hi,anchor:'end',weight:700}));
}
const PX0=150,PY0=420,pol=(r,th)=>[PX0+ER*r*Math.cos(th),PY0-ER*r*Math.sin(th)];
function arcPts(r,t0,t1){return Array.from({length:21},(_,i)=>pol(r,mix(t0,t1,i/20)));}
function gravPath(p){
 let s=earth(PX0,PY0);
 [2,3.2,4.5].forEach(r=>{s+=draw(arcPts(r,-.05,1.05),1,{color:C.grid,w:2});});
 const zig=[...arcPts(2,1,.7),pol(3.2,.7),...arcPts(3.2,.7,.35),pol(4.5,.35),...arcPts(4.5,.35,.1)];
 const radial=[pol(2,1),pol(4.5,1),...arcPts(4.5,1,.1)];
 const u1=lin(p,.04,.5),u2=lin(p,.55,.88);
 s+=draw(zig,1,{color:C.x,w:2.5,dash:'5 8',opacity:.6})+draw(zig,u1,{color:C.x,w:5});
 s+=draw(radial,1,{color:C.t,w:2.5,dash:'5 8',opacity:.6})+draw(radial,u2,{color:C.t,w:5});
 s+=dot(...pol(2,1),8,C.hi)+dot(...pol(4.5,.1),8,C.hi)+label('始め',pol(2,1)[0]-14,pol(2,1)[1]-4,{size:22,color:C.hi,anchor:'end'})+label('終わり',pol(4.5,.1)[0]+14,pol(4.5,.1)[1]+8,{size:22,color:C.hi});
 const cur=u2>0?{P:radial,u:u2,col:C.t}:{P:zig,u:u1,col:C.x};
 const rOf=q=>Math.hypot(q.x-PX0,PY0-q.y)/ER;
 const a=along(cur.P,cur.u),rr=rOf(a),ux=(PX0-a.x)/(rr*ER),uy=(PY0-a.y)/(rr*ER);
 s+=ball(a.x,a.y,14,cur.col)+arrow(a.x,a.y,a.x+ux*300/(rr*rr),a.y+uy*300/(rr*rr),{color:C.F,w:5,head:14});
 const b=along(cur.P,Math.min(1,cur.u+.01)),onArc=Math.abs(rOf(b)-rr)<.01&&cur.u<1&&cur.u>0;
 s+=fade(onArc?1:0,label('直角 → 仕事 0',a.x+22,a.y-22,{size:22,color:C.hi}));
 const Wz=r0=>Math.max(0,1/2-1/r0),m1=u1>0?Wz(rOf(along(zig,u1))):0,m2=u2>0?Wz(rOf(along(radial,u2))):0;
 const MX=760,MS=620;
 s+=label('重力の仕事（負の大きさ）',MX,300,{size:24,color:C.F});
 s+=label('回り道',MX,365,{size:22,color:C.x})+rect(MX+100,346,m1*MS,26,{fill:C.x,fo:.55,rx:3,sw:0});
 s+=label('別の道',MX,425,{size:22,color:C.t})+rect(MX+100,406,m2*MS,26,{fill:C.t,fo:.55,rx:3,sw:0});
 return s+fade(seg(p,.86,.95),label('同じ',MX+100+.278*MS+14,425,{size:26,color:C.hi,weight:700}));
}
function gravArea(p){
 const A=axes({x:130,y:440,w:900,h:340,xmax:10,ymax:1.15,xlabel:'距離 r',ylabel:'重力の大きさ F',xticks:[],yticks:[],xcolor:C.x,ycolor:C.F});
 let s=A.svg;const f=r=>1/(r*r);
 s+=line(A.X(1),A.Y(0),A.X(1),A.Y(1.05),{color:C.faint,w:2,dash:'5 6'})+label('地表 R',A.X(1),A.Y(0)+34,{size:22,color:C.dim,anchor:'middle'});
 const r0=2,re=mix(r0,9.9,seg(p,.1,.7));
 const pts=[[A.X(r0),A.Y(0)]];for(let i=0;i<=80;i++){const r=mix(r0,re,i/80);pts.push([A.X(r),A.Y(f(r))]);}pts.push([A.X(re),A.Y(0)]);
 s+=poly(pts,{fill:C.F,fo:.3});
 s+=A.plot(f,{from:1,to:9.9,color:C.F,w:4});
 s+=label('r',A.X(r0),A.Y(0)+34,{size:24,color:C.x,anchor:'middle'})+dot(A.X(r0),A.Y(f(r0)),8,C.hi);
 s+=fade(seg(p,.1,.3),label('はるか遠くへ →',A.X(9.8),A.Y(0)-20,{size:22,color:C.dim,anchor:'end'}));
 s+=fade(seg(p,.6,.85),label('面積',A.X(4),A.Y(.2),{size:26,color:C.F,anchor:'middle'})+tex('=\\dfrac{GMm}{r}',A.X(4)+110,A.Y(.2)-2,{size:32}));
 return s+fade(seg(p,.8,1),label('遠くへ運ぶ間、重力の仕事は負',1150,70,{size:26,color:C.hi,anchor:'end'}));
}
// U(r) = −1/r in units of GMm/R, r in units of R.
const wAx=(x=130,w=900,g=1)=>axes({x,y:470,w,h:390,xmax:10.5,ymin:-1.1,ymax:.25,xlabel:'距離 r',ylabel:'U',xticks:[],yticks:[],g,xcolor:C.x,ycolor:UC});
const Ur=r=>-1/r;
function wellBase(A,{surface=true}={}){
 let s=A.svg+A.plot(Ur,{from:1,to:10.3,color:UC,w:5});
 if(surface)s+=line(A.X(1),A.Y(.15),A.X(1),A.Y(-1.05),{color:C.faint,w:2,dash:'5 6'})+label('地表',A.X(1)-8,A.Y(-1.05)+2,{size:22,color:C.dim,anchor:'end'});
 s+=label('U = 0（はるか遠く）',A.X(10.3),A.Y(0)-14,{size:22,color:C.dim,anchor:'end'});
 return s;
}
function wellCurve(p){
 const A=wAx(130,640,seg(p,0,.2));let s=A.svg+A.plot(Ur,{from:1,to:10.3,p:seg(p,.15,.6),color:UC,w:5});
 s+=fade(seg(p,.15,.3),line(A.X(1),A.Y(.15),A.X(1),A.Y(-1.05),{color:C.faint,w:2,dash:'5 6'})+label('地表',A.X(1)-8,A.Y(-1.05)+2,{size:22,color:C.dim,anchor:'end'})+label('U = 0（はるか遠く）',A.X(10.3),A.Y(0)-14,{size:22,color:C.dim,anchor:'end'}));
 const r=mix(8,2,seg(p,.55,.85));
 s+=fade(seg(p,.5,.6),dot(A.X(r),A.Y(Ur(r)),10,C.x));
 s+=fade(seg(p,.7,.95),label('近いほど深い井戸',A.X(3.2),A.Y(-.75),{size:28,color:UC})+label('U は負',A.X(3.2),A.Y(-.9),{size:24,color:UC}));
 return s;
}
function wellFall(p){
 const A=wAx(130,640);let s=wellBase(A);
 const E=-.5,r=mix(2,1.2,Math.pow(lin(p,.08,.8),2)),U=Ur(r),Kk=E-U;
 s+=dot(A.X(r),A.Y(U),11,C.x)+arrow(A.X(r)-14,A.Y(U),A.X(r)-60,A.Y(U),{color:C.F,w:4,head:12,g:lin(p,.08,.8)<1?1:0});
 // bars on the right, same vertical scale as the graph
 const y0=A.Y(0),sc=A.Y(0)-A.Y(1);
 s+=line(900,y0,1170,y0,{color:C.dim,w:2});
 s+=ebar(920,80,y0,U,sc,UC,{value:false,name:'U',nameY:y0-10});
 s+=ebar(1040,80,y0,Kk,sc,KC,{value:false,name:'K',nameY:y0-Kk*sc-10});
 s+=line(900,A.Y(E),1170,A.Y(E),{color:EC,w:2.5,dash:'8 7'})+label('K + U',1170,A.Y(E)+30,{size:22,color:EC,anchor:'end'});
 s+=label('距離 2R で放す',A.X(10.3),A.Y(-.75),{size:22,color:C.dim,anchor:'end'});
 s+=fade(seg(p,.6,.9),label('合計は一定',1040,A.Y(-1.0),{size:26,color:EC,anchor:'middle',weight:700}));
 return s;
}
function escape(p,E){
 const A=wAx();let s=wellBase(A);
 s+=line(A.X(.3),A.Y(E),A.X(10.4),A.Y(E),{color:EC,w:3})+(E<0?label('E（負）',A.X(10.4),A.Y(E)+30,{size:24,color:EC,anchor:'end'}):label('E = 0',A.X(1.4),A.Y(0)-14,{size:24,color:EC}));
 let r;
 if(E<0){const rt=-1/E,u=lin(p,.12,.9);r=1+(rt-1)*Math.sin(Math.PI*u);
  s+=fade(seg(p,.5,.65),dot(A.X(rt),A.Y(E),8,C.hi)+label('折り返し点（K = 0）',A.X(rt)+10,A.Y(E)+36,{size:22,color:C.hi}));
 }else{r=mix(1,10.2,Math.pow(lin(p,.12,.92),1.6));
  s+=fade(seg(p,.8,1),label('K が残ったまま → 戻らない',A.X(10.3),A.Y(-.35),{size:26,color:C.hi,anchor:'end',weight:700}));}
 const U=Ur(r),Kk=E-U;
 s+=rect(A.X(r)-12,A.Y(E),24,Math.max(0,A.Y(U)-A.Y(E)),{fill:KC,fo:.55,rx:3,sw:0});
 s+=dot(A.X(r),A.Y(U),10,C.x);
 if(Kk>.05)s+=label('K',A.X(r)+20,(A.Y(E)+A.Y(U))/2+8,{size:24,color:KC});
 return s;
}
Object.assign(potentialDiagrams,{
 'pt-grav:earth':gravEarth,
 'pt-grav:path':gravPath,
 'pt-grav:area':gravArea,
 'pt-well:curve':wellCurve,
 'pt-well:fall':wellFall,
 'pt-esc:bound':p=>escape(p,-.3),
 'pt-esc:free':p=>escape(p,0),
});

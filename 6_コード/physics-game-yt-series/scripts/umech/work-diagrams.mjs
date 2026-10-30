// 単元3 仕事の再定義 — pictures. Viewbox 1200×515.
// Colours: x cyan (position, displacement), v purple, F green, t gold, E orange (work / energy), p pink (mv).
import {C,clamp,mix,smooth,seg,lin,fmt,fade,move,label,line,rect,dot,ring,draw,poly,arrow,brace,highlight,axes,ground,block,cart,spring,wall,tex} from './anim.mjs';

const DEG=Math.PI/180;
// A horizontal number line for signed work in joules.
function numLine(y,{min=-20,max=15,cx=600,sc=22,g=1,step=5}={}){
 const X=w=>cx+w*sc;let s=line(X(min)-20,y,X(max)+20,y,{color:C.dim,w:2.5});
 for(let w=min;w<=max;w+=step)s+=line(X(w),y-7,X(w),y+7,{color:C.dim,w:2})+label(w>0?`+${w}`:String(w).replace('-','−'),X(w),y+34,{size:22,color:w===0?C.ink:C.dim,anchor:'middle'});
 return {svg:fade(g,s+label('J',X(max)+34,y+8,{size:22,color:C.dim})),X};
}
const sgn=w=>w>0?`+${fmt(w)}`:w<0?`−${fmt(-w)}`:'0';
// Right-angle marker at P between unit directions u and w.
function rightAngle(P,u,w,s=16,color=C.hi){const a=[P[0]+u[0]*s,P[1]+u[1]*s],b=[a[0]+w[0]*s,a[1]+w[1]*s],c=[P[0]+w[0]*s,P[1]+w[1]*s];return draw([a,b,c],1,{color,w:2.5});}
function chip(x,y,w,h,col,text,{size=24,fo=.14}={}){return rect(x,y,w,h,{fill:col,fo,stroke:col,rx:10})+label(text,x+w/2,y+h/2+size*.36,{size,color:col,anchor:'middle'});}

// =============== uc-work-intro: a sliding box, pull 2 N, friction 3 N =====================
const FY=290,BX=m=>260+130*m;
const boxX=t=>3*t-.25*t*t,boxV=t=>3-.5*t;
function sliding(m,v,{pull=1,fric=1,fr=3,vg=1,o=1,tag=true}={}){
 const X=BX(m);let s=fade(o,block(X,FY,120,90,{color:C.x,text:'2 kg',size:26}));
 s+=arrow(X+60,FY-45,X+60+2*45,FY-45,{color:C.F,w:7,g:pull,opacity:o});
 if(tag)s+=fade(pull*o,label('引く力 2 N',X+64,FY-100,{size:24,color:C.F}));
 s+=arrow(X-60,FY-18,X-60-fr*45,FY-18,{color:C.F,w:7,g:fric,opacity:o});
 if(tag)s+=fade(fric*o,label(`摩擦 ${fr} N`,X-66,FY-60,{size:24,color:C.F,anchor:'end'}));
 if(v>0.01)s+=arrow(X-40,FY-140,X-40+v*55,FY-140,{color:C.v,w:6,g:vg,opacity:o})+fade(vg*o,label(`${fmt(v,1)} m/s`,X-30+v*55,FY-132,{size:24,color:C.v}));
 return s;
}
function floorRuler(g=1){let s=ground(120,1100,FY);for(let m=0;m<=5;m++)s+=fade(g,line(BX(m),FY+26,BX(m),FY+36,{color:C.dim})+label(`${m} m`,BX(m),FY+62,{size:22,color:C.dim,anchor:'middle'}));return s;}
function workBars(wp,wf,g=1){ // pull work (+) and friction work (−) as arrows on a number line
 const N=numLine(450,{g});let s=N.svg;
 if(wp>0.01)s+=arrow(N.X(0),405,N.X(wp),405,{color:C.E,w:9,head:16})+label(`引く力 ${sgn(wp)} J`,N.X(wp)+14,413,{size:24,color:C.E});
 if(wf<-0.01)s+=arrow(N.X(0),420,N.X(wf),420,{color:C.a,w:9,head:16})+label(`摩擦 ${sgn(wf)} J`,N.X(wf)-14,395,{size:24,color:C.a,anchor:'end'});
 return s;
}
export const workDiagrams={
 'wk-box:forces':(p)=>{
  // The box slides slowly into place while the three arrows appear one after another.
  const m=-.6+.6*seg(p,0,.5);
  return floorRuler(seg(p,.6,.9))+sliding(m,3,{vg:seg(p,0,.25),pull:seg(p,.25,.5),fric:seg(p,.5,.75)})
   +fade(seg(p,.75,1),label('速度は右向き 3 m/s',1100,60,{size:26,color:C.v,anchor:'end'}));
 },
 'wk-box:pull':(p)=>{
  const t=2*lin(p,.05,.85),m=boxX(t);
  return floorRuler()+sliding(m,boxV(t))+line(BX(0),FY+80,BX(m),FY+80,{color:C.x,w:5})
   +workBars(2*m,0)+fade(seg(p,.8,1),tex('2\\times5=10\\,\\mathrm{J}',1000,60,{size:36}));
 },
 'wk-box:fric':(p)=>{
  // The friction work grows with the distance covered: a cursor re-walks the 5 m.
  const d=5*lin(p,.1,.8);
  return floorRuler()+sliding(5,2,{pull:1})+line(BX(0),FY+80,BX(d),FY+80,{color:C.a,w:5})+dot(BX(d),FY+80,8,C.a)
   +fade(seg(p,0,.15),label('摩擦は左向き ↔ 移動は右向き',80,60,{size:26,color:C.a}))
   +workBars(10,-3*d)+fade(seg(p,.8,1),tex('(-3)\\times5=-15\\,\\mathrm{J}',1000,60,{size:36}));
 },
 'wk-box:slow':(p)=>{
  // Strobe: ghosts at t = 0, 1, 2 s with shrinking velocity arrows.
  let s=floorRuler();
  [0,1,2].forEach((t,i)=>{const g=seg(p,i*.22,i*.22+.2);s+=fade(g,sliding(boxX(t),boxV(t),{tag:false,o:i===2?1:.55})+label(`${t} s`,BX(boxX(t)),FY+100,{size:24,color:C.t,anchor:'middle'}));});
  return s+fade(seg(p,.7,1),rect(760,380,400,100,{fill:C.v,fo:.1,stroke:C.v,rx:12})+label('3 m/s → 2 m/s',960,420,{size:28,color:C.v,anchor:'middle'})+label('遅くなった！',960,462,{size:26,color:C.hi,anchor:'middle'}));
 },
 // ---- sum of work: tip-to-tail on a number line --------------------------------------------
 'wk-sum:merge':(p)=>{
  const N=numLine(330,{sc:26}),a=seg(p,0,.25),b=seg(p,.3,.65);
  let s=N.svg+label('仕事を順につなぐ',600,70,{size:28,color:C.hi,anchor:'middle'});
  s+=arrow(N.X(0),240,N.X(10),240,{color:C.E,w:10,g:a,head:18})+fade(a,label('引く力 +10 J',N.X(5),215,{size:26,color:C.E,anchor:'middle'}));
  s+=arrow(N.X(10),290,N.X(-5),290,{color:C.a,w:10,g:b,head:18})+fade(b,label('摩擦 −15 J',N.X(2.5),160,{size:26,color:C.a,anchor:'middle'}))+fade(b,line(N.X(10),240,N.X(10),290,{color:C.faint,w:2,dash:'5 5'}));
  const r=seg(p,.65,.85);
  s+=fade(r,dot(N.X(-5),330,12,C.hi)+label('合計 −5 J',N.X(-5),420,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s+fade(seg(p,.8,1),label('マイナス → 遅くなる',1100,440,{size:28,color:C.v,anchor:'end'}));
 },
 'wk-sum:zero':(p)=>{
  // Friction 2 N: the arrows balance, equal spacing in the strobe, total work 0.
  const t=5/3*lin(p,0,.8),m=3*t;let s=ground(120,1100,230);
  const X=m=>220+150*m;
  for(let k=0;k<=Math.floor(t/.4);k++)s+=fade(.35,rect(X(1.2*k)-40,170,80,60,{fill:C.x,fo:.25,rx:6}));
  const x=X(m);
  s+=block(x,230,110,80,{color:C.x,text:'2 kg',size:24})+arrow(x+55,190,x+55+90,190,{color:C.F,w:6})+arrow(x-55,214,x-55-90,214,{color:C.F,w:6})
   +arrow(x-40,110,x-40+165,110,{color:C.v,w:6})+label('3 m/s',x+135,118,{size:24,color:C.v});
  const N=numLine(420,{sc:22,min:-15,max:15}),a=seg(p,.1,.35),b=seg(p,.4,.7);
  s+=N.svg+arrow(N.X(0),345,N.X(10),345,{color:C.E,w:9,g:a,head:16})+fade(a,label('+10 J',N.X(10)+12,353,{size:24,color:C.E}));
  s+=arrow(N.X(10),378,N.X(0),378,{color:C.a,w:9,g:b,head:16})+fade(b,label('−10 J',N.X(-1),386,{size:24,color:C.a,anchor:'end'}));
  return s+fade(seg(p,.7,.9),dot(N.X(0),420,12,C.hi)+label('合計 0 → 速さ一定',1100,300,{size:28,color:C.hi,anchor:'end',weight:700}));
 },
 'wk-sum:rule':(p)=>{
  const rows=[['合計 ＋','速くなる',v=>2+2*v],['合計 −','遅くなる',v=>4-2*v],['合計 0','変わらない',()=>3]];
  let s='';
  rows.forEach(([a,b,f],i)=>{const g=seg(p,i*.25,i*.25+.2),y=110+i*140,u=lin(p,i*.25,.95);
   s+=fade(g,chip(80,y-40,210,64,C.E,a,{size:28})+label('→',330,y+8,{size:30,color:C.dim})+label(b,1120,y+8,{size:30,color:C.hi,anchor:'end'}))
    +fade(g,arrow(400,y-8,400+f(u)*70,y-8,{color:C.v,w:8,head:18})+label(`${fmt(f(u),1)} m/s`,410+f(u)*70,y,{size:24,color:C.v}));});
  return s;
 },
 // ---- count every force ---------------------------------------------------------------------
 ...(()=>{
  const cx=300,cy=300,rows=[['引く力','+10 J',C.E,[1,0]],['摩擦','−15 J',C.a,[-1,0]],['重力','0 J',C.dim,[0,1]],['床が押し返す力','0 J',C.dim,[0,-1]]];
  const tip=d=>[cx+d[0]*170,cy+d[1]*150];
  function pic(g=1){
   let s=ground(60,560,cy+45)+rect(cx-60,cy-45,120,90,{fill:C.x,fo:.28,rx:8})+label('2 kg',cx,cy+9,{size:24,color:C.ink,anchor:'middle'});
   rows.forEach(([n,,col,d],i)=>{const [X,Y]=tip(d),o=[cx+d[0]*60,cy+d[1]*45];s+=arrow(o[0],o[1],X,Y,{color:C.F,w:6,g:seg(g,i*.15,i*.15+.2)});});
   s+=fade(seg(g,.3,.7),label('引く力',cx+120,cy-18,{size:22,color:C.F})+label('摩擦',cx-120,cy-18,{size:22,color:C.F,anchor:'end'})+label('重力',cx+14,cy+140,{size:22,color:C.F})+label('床が押し返す力',cx+14,cy-126,{size:22,color:C.F}));
   s+=arrow(cx-100,cy+100,cx+100,cy+100,{color:C.x,w:3,head:12,opacity:.9})+fade(1,label('移動',cx+110,cy+108,{size:22,color:C.x}));
   return s;
  }
  function table(n,fly=1){
   let s=label('力',700,90,{size:26,color:C.dim})+label('仕事',1130,90,{size:26,color:C.dim,anchor:'end'})+line(680,105,1140,105,{color:C.faint,w:2});
   rows.forEach(([nm,w,col,d],i)=>{const g=clamp(n-i);if(g<=0)return;const y=150+i*62,[X,Y]=tip(d);
    const f=smooth(fly===1?g:1);s+=move(mix(X-700,0,f),mix(Y-y,0,f),fade(g,label(nm,700,y,{size:26,color:C.F})+label(w,1130,y,{size:28,color:col,anchor:'end',weight:700})));
    if(i>=2)s+=fade(g,label('移動と直角',1060,y,{size:22,color:C.dim,anchor:'end'}));});
   return s;
  }
  return {
   'wk-list:circle':(p)=>{const r=seg(p,.55,.95);return pic(seg(p,0,.6))+draw(Array.from({length:61},(_,i)=>[cx+175*Math.cos(i/60*2*Math.PI-Math.PI/2),cy+165*Math.sin(i/60*2*Math.PI-Math.PI/2)]),r,{color:C.hi,w:3,dash:'10 8'})+fade(r,label('考える物体',cx-150,cy-150,{size:24,color:C.hi,anchor:'end'}));},
   'wk-list:table':(p)=>pic()+table(4*seg(p,0,.9)),
   'wk-list:total':(p)=>{const g=seg(p,.1,.5);return pic()+table(4,0)+fade(g,line(680,400,1140,400,{color:C.hi,w:3})+label('合計',700,445,{size:28,color:C.hi,weight:700})+label('−5 J',1130,445,{size:32,color:C.hi,anchor:'end',weight:700}))+highlight(680,412,460,50,seg(p,.5,.8));},
  };
 })(),
};

// =============== uc-work-middle: F dx = m v dv, the ½ is a triangle ==========================
function mvAxes(g=1){return axes({x:170,y:450,w:700,h:360,xmax:6,ymax:12.5,xlabel:'速度 v',ylabel:'mv',xticks:[1,2,3,4,5],yticks:[2,4,6,8,10],grid:true,g,xcolor:C.v,ycolor:C.p});}
function strips(A,from,to,n,g=1,hiIdx=-1){let s='';const w=(to-from)/n;for(let i=0;i<n;i++){const u=seg(g,i/n*.8,i/n*.8+.2);if(u<=0)continue;const v0=from+i*w,h=2*(v0+w/2);s+=fade(u,rect(A.X(v0),A.Y(h),A.X(v0+w)-A.X(v0),A.Y(0)-A.Y(h),{fill:i===hiIdx?C.hi:C.E,fo:i===hiIdx?.45:.3,rx:0,sw:1}));}return s;}
Object.assign(workDiagrams,{
 'wk-step1':(p)=>{
  const Y=330,x=mix(200,640,seg(p,0,.55));let s=ground(80,1120,Y);
  if(p>.55){const g=seg(p,.55,.75);s+=fade(.4*g,rect(x-120-60,Y-80,120,80,{fill:C.x,fo:.2,rx:8}))+brace(x-120-60+60,x,Y+14,{text:'',g})+fade(g,tex('dx',x-60,Y+80,{size:38}));}
  s+=block(x,Y,120,80,{color:C.x,text:'m',size:30})+arrow(x-200,Y-40,x-62,Y-40,{color:C.F,w:7})+tex('F',x-210,Y-40,{size:36,anchor:'end'});
  return s+fade(seg(p,.7,.95),rect(760,70,360,110,{fill:C.E,fo:.1,stroke:C.E,rx:14})+tex('dW=F\\,dx',940,130,{size:44}))+fade(seg(p,.72,.95),label('一歩の仕事',940,215,{size:24,color:C.E,anchor:'middle'}));
 },
 'wk-mv:line':(p)=>{const A=mvAxes(seg(p,0,.3)),u=5.5*seg(p,.3,.9);return A.svg+A.plot(v=>2*v,{from:0,to:5.8,p:seg(p,.3,.9),color:C.p,w:4})+(u>.05?dot(A.X(u),A.Y(2*u),9,C.hi)+tex(`mv=${fmt(2*u,1)}`,A.X(u)-20,A.Y(2*u)-30,{size:30,anchor:'end'}):'')+fade(seg(p,.8,1),label('m = 2 kg なら 傾き 2',860,400,{size:24,color:C.p,anchor:'end'}));},
 'wk-mv:strips':(p)=>{const A=mvAxes(),n=20,hi=14;let s=A.svg+strips(A,0,5,n,seg(p,.3,1),hi)+A.plot(v=>2*v,{from:0,to:5.8,color:C.p,w:4});
  const g=seg(p,0,.3),v0=hi*.25,w=.25;
  s+=fade(g,rect(A.X(v0),A.Y(2*(v0+w/2)),A.X(v0+w)-A.X(v0),A.Y(0)-A.Y(2*(v0+w/2)),{fill:C.hi,fo:.5,rx:0,sw:1.5}));
  s+=fade(g,tex('mv',A.X(v0)-16,A.Y(v0+w/2)+10,{size:30,anchor:'end'})+tex('dv',A.X(v0+w/2),A.Y(0)+60,{size:30})+line(A.X(v0),A.Y(0)+30,A.X(v0+w),A.Y(0)+30,{color:C.hi,w:3}));
  return s+fade(seg(p,.4,.7),label('帯の面積 ＝ mv × dv',1150,90,{size:26,color:C.hi,anchor:'end'}));},
 'wk-mv:tri':(p)=>{const A=mvAxes(),V=5,g=seg(p,.35,.7);let s=A.svg+fade(1-seg(p,0,.3),strips(A,0,5,20,1))+poly([[A.X(0),A.Y(0)],[A.X(V),A.Y(0)],[A.X(V),A.Y(2*V)]],{fill:C.E,fo:.4*seg(p,0,.3)+.05,stroke:C.E,sw:2});
  // The copy flips over the diagonal and completes a rectangle: the triangle is half of it.
  s+=fade(g,poly([[A.X(0),A.Y(0)],[A.X(0),A.Y(2*V*g)],[A.X(V),A.Y(2*V)]],{fill:C.faint,fo:.3,stroke:C.dim,sw:2}));
  s+=A.plot(v=>2*v,{from:0,to:5.8,color:C.p,w:4})+fade(seg(p,.2,.4),tex('v',A.X(V/2),A.Y(0)+62,{size:32})+tex('mv',A.X(V)+16,A.Y(V)+10,{size:32,anchor:'start'}));
  return s+fade(seg(p,.65,.95),rect(640,230,520,90,{fill:C.bg,fo:.85,stroke:C.E,rx:12})+tex('\\tfrac12\\times v\\times mv=\\tfrac12mv^2',900,275,{size:36}));},
 'wk-mv:trap':(p)=>{const A=mvAxes(),g=seg(p,0,.35),h=seg(p,.35,.65);let s=A.svg;
  s+=fade(g,poly([[A.X(0),A.Y(0)],[A.X(5),A.Y(0)],[A.X(5),A.Y(10)]],{fill:C.faint,fo:.35,stroke:C.dim,sw:2}));
  s+=fade(h,poly([[A.X(3),A.Y(0)],[A.X(5),A.Y(0)],[A.X(5),A.Y(10)],[A.X(3),A.Y(6)]],{fill:C.E,fo:.45,stroke:C.E,sw:2.5}));
  s+=fade(g*(1-.6*h),poly([[A.X(0),A.Y(0)],[A.X(3),A.Y(0)],[A.X(3),A.Y(6)]],{fill:C.bg,fo:.6,stroke:C.dim,sw:2}));
  s+=A.plot(v=>2*v,{from:0,to:5.8,color:C.p,w:4})+fade(h,tex('6',A.X(3)-14,A.Y(3)+10,{size:30,anchor:'end'})+tex('10',A.X(5)+14,A.Y(5)+10,{size:30,anchor:'start'})+label('3 → 5 m/s',A.X(4),A.Y(0)+90,{size:24,color:C.v,anchor:'middle'}));
  return s+fade(seg(p,.65,.95),rect(170,70,470,90,{fill:C.bg,fo:.85,stroke:C.E,rx:12})+tex('\\tfrac{6+10}{2}\\times2=16\\,\\mathrm{J}',405,115,{size:36}));},
 'wk-both':(p)=>{
  // Left: work as area under a changing force F = 6 − x. Right: the matching strip of the mv–v graph.
  const L=axes({x:90,y:440,w:400,h:280,xmax:4.4,ymax:7,xlabel:'x [m]',ylabel:'力 F [N]',xticks:[1,2,3,4],yticks:[2,4,6],grid:true,xcolor:C.x,ycolor:C.F});
  const R=axes({x:690,y:440,w:400,h:280,xmax:6,ymax:12.5,xlabel:'v',ylabel:'mv',xticks:[1,2,3,4,5],yticks:[2,6,10],grid:true,xcolor:C.v,ycolor:C.p});
  const x=4*lin(p,.1,.85),W=6*x-x*x/2,v=Math.sqrt(9+W);
  let s=L.svg+R.svg;
  s+=poly([[L.X(0),L.Y(0)],...Array.from({length:31},(_,i)=>{const u=x*i/30;return [L.X(u),L.Y(6-u)];}),[L.X(x),L.Y(0)]],{fill:C.E,fo:.4,stroke:'none'})+L.plot(u=>6-u,{from:0,to:4.2,color:C.F,w:4});
  s+=poly([[R.X(3),R.Y(0)],[R.X(3),R.Y(6)],[R.X(v),R.Y(2*v)],[R.X(v),R.Y(0)]],{fill:C.E,fo:.4,stroke:'none'})+R.plot(u=>2*u,{from:0,to:5.8,color:C.p,w:4});
  s+=label(`左の面積 ${fmt(W,1)} J`,290,70,{size:28,color:C.E,anchor:'middle',weight:700})+label(`右の面積 ${fmt(v*v-9,1)} J`,890,70,{size:28,color:C.E,anchor:'middle',weight:700});
  return s+fade(seg(p,.85,1),label('＝',600,70,{size:34,color:C.hi,anchor:'middle'}));
 },
});

// =============== uc-work-advanced: F·v on a curved rail ======================================
const railY=X=>300-130*Math.sin((X-60)/1080*Math.PI*1.7);
const railT=X=>{const d=(railY(X+1)-railY(X-1))/2,L=Math.hypot(1,d);return [1/L,d/L];};
function rail(){return draw(Array.from({length:121},(_,i)=>{const X=60+1080*i/120;return [X,railY(X)];}),1,{color:C.dim,w:5});}
function railBall(X){return ring(X,railY(X)-0,16,{color:C.hi,w:3,fill:'#3a3320'});}
Object.assign(workDiagrams,{
 'wk-rail:dr':(p)=>{
  const X=mix(260,620,lin(p,0,.9)),T=railT(X),P=[X,railY(X)];let s=rail();
  for(let k=1;k<=4;k++){const Xk=X-k*48*T[0];if(Xk>200)s+=dot(Xk,railY(Xk),6,C.x,.5);}
  const Nn=[T[1],-T[0]],o=[P[0]+Nn[0]*26,P[1]+Nn[1]*26];
  s+=arrow(o[0],o[1],o[0]+T[0]*220,o[1]+T[1]*220,{color:C.v,w:6})+tex('\\vec v',o[0]+T[0]*220+Nn[0]*30,o[1]+T[1]*220+Nn[1]*30,{size:34})+railBall(X);
  const g=seg(p,.35,.6);
  s+=arrow(P[0],P[1],P[0]+T[0]*60,P[1]+T[1]*60,{color:C.x,w:8,head:16,g});
  s+=fade(seg(p,.5,.75),tex('d\\vec r=\\vec v\\,dt',P[0]+T[0]*40-Nn[0]*70,P[1]+T[1]*40-Nn[1]*70,{size:34}));
  return s+fade(seg(p,.7,1),label('dr は v の dt 倍：同じ向きで、ずっと短い',1150,470,{size:24,color:C.hi,anchor:'end'}));
 },
 ...(()=>{
  const X=560,P=[X,railY(X)],T=railT(X),Nn=[T[1],-T[0]]; // Nn points "up" off the rail
  const Fdir=th=>[T[0]*Math.cos(th)+Nn[0]*Math.sin(th),T[1]*Math.cos(th)+Nn[1]*Math.sin(th)];
  function scene(th,{proj=1,L=190}={}){
   const d=Fdir(th),tip=[P[0]+d[0]*L,P[1]+d[1]*L],c=L*Math.cos(th),foot=[P[0]+T[0]*c,P[1]+T[1]*c];
   let s=line(P[0]-T[0]*300,P[1]-T[1]*300,P[0]+T[0]*300,P[1]+T[1]*300,{color:C.faint,w:2,dash:'8 8'})+rail()+railBall(X);
   s+=arrow(P[0],P[1],P[0]+T[0]*120,P[1]+T[1]*120,{color:C.v,w:5,opacity:.7})+tex('\\vec v',P[0]+T[0]*120-10,P[1]+T[1]*120+40,{size:28,opacity:.8});
   s+=arrow(P[0],P[1],tip[0],tip[1],{color:C.F,w:6})+tex('\\vec F',tip[0]+14,tip[1]-12,{size:34,anchor:'start'});
   s+=fade(proj,line(tip[0],tip[1],foot[0],foot[1],{color:C.F,w:2.5,dash:'6 6'})+line(P[0],P[1],foot[0],foot[1],{color:c>=0?C.hi:C.a,w:10,cap:'butt'})+(Math.abs(c)>20?rightAngle(foot,[T[0]*Math.sign(-c),T[1]*Math.sign(-c)],[(tip[0]-foot[0])/Math.max(1,Math.hypot(tip[0]-foot[0],tip[1]-foot[1])),(tip[1]-foot[1])/Math.max(1,Math.hypot(tip[0]-foot[0],tip[1]-foot[1]))],14):''));
   return {s,c};
  }
  return {
   'wk-rail:proj':(p)=>{const {s}=scene(60*DEG,{proj:seg(p,.3,.65)});return s+fade(seg(p,.55,.85),label('道に沿った成分 ＝ 効く分',80,70,{size:28,color:C.hi}))+fade(seg(p,.7,1),label('道に直角な成分は、仕事をしない',80,470,{size:24,color:C.dim}));},
   'wk-rail:angle':(p)=>{
    const th=mix(20,160,seg(p,.05,.9))*DEG,{s,c}=scene(th),Pw=c/190;
    const bx=930,by=470,wd=260;let m=rect(bx-wd/2,by-20,wd,40,{fill:C.faint,fo:.3,stroke:C.dim,rx:8})+line(bx,by-30,bx,by+30,{color:C.dim,w:2})+rect(Math.min(bx,bx+Pw*wd/2),by-16,Math.abs(Pw*wd/2),32,{fill:Pw>=0?C.E:C.a,fo:.8,rx:4,sw:0});
    m+=label('仕事率 P',bx-wd/2-16,by+9,{size:24,color:C.E,anchor:'end'})+label(Math.abs(Pw)<.12?'0':Pw>0?'正':'負',bx+wd/2+16,by+9,{size:28,color:Math.abs(Pw)<.12?C.ink:Pw>0?C.E:C.a,weight:700});
    return s+m+label(`θ = ${Math.round(th/DEG)}°`,80,470,{size:26,color:C.t});
   },
  };
 })(),
 'wk-check':(p)=>{
  const t=.2+1.8*lin(p,.1,.85);
  const L=axes({x:90,y:440,w:400,h:300,xmax:2.2,ymax:40,xlabel:'t',ylabel:'運動エネルギー',xticks:[1,2],yticks:[10,20,30],grid:true,xcolor:C.t,ycolor:C.E});
  const R=axes({x:690,y:440,w:400,h:300,xmax:2.2,ymax:40,xlabel:'t',ylabel:'仕事率',xticks:[1,2],yticks:[10,20,30],grid:true,xcolor:C.t,ycolor:C.E});
  let s=L.svg+R.svg+L.plot(u=>9*u*u,{from:0,to:2.05,color:C.E,w:4})+R.plot(u=>18*u,{from:0,to:2.05,color:C.F,w:4});
  const K=9*t*t,S=18*t;s+=line(L.X(t-.35),L.Y(K-.35*S),L.X(t+.35),L.Y(K+.35*S),{color:C.hi,w:3})+dot(L.X(t),L.Y(K),8,C.hi)+dot(R.X(t),R.Y(S),8,C.hi)+line(R.X(t),R.Y(0),R.X(t),R.Y(S),{color:C.hi,w:2,dash:'5 5'});
  s+=tex('9t^2',L.X(1.2),L.Y(9*1.44)-20,{size:30,anchor:'end'})+tex('Fv=6\\times3t',R.X(.2),R.Y(36),{size:30,anchor:'start'});
  return s+label(`傾き ${fmt(S,1)}`,290,60,{size:28,color:C.hi,anchor:'middle',weight:700})+label(`${fmt(S,1)}`,890,60,{size:28,color:C.hi,anchor:'middle',weight:700})+label('＝',600,60,{size:32,color:C.hi,anchor:'middle'});
 },
 'wk-paths':(p)=>{
  // Two tracks from A to B. Lower track has a rough patch: less work, and exactly that much less kinetic energy.
  const A=[90,120],B=[560,420];
  const up=u=>[mix(A[0],B[0],u),A[1]+(B[1]-A[1])*(u*u*(3-2*u))];
  const lo=u=>[mix(A[0],B[0],u),A[1]+(B[1]-A[1])*Math.sin(u*Math.PI/2)**.6+60*Math.sin(u*Math.PI)];
  const P1=Array.from({length:61},(_,i)=>up(i/60)),P2=Array.from({length:61},(_,i)=>lo(i/60));
  let s=draw(P1,1,{color:C.x,w:4})+draw(P2,1,{color:C.p,w:4});
  s+=draw(P2.slice(34,50),1,{color:C.a,w:12,dash:'4 6'})+label('ざらざら',P2[42][0]+30,P2[42][1]+30,{size:22,color:C.a});
  const u=lin(p,.05,.7),b1=up(u),b2=lo(u);s+=dot(b1[0],b1[1],12,C.hi)+dot(b2[0],b2[1],12,C.hi)+label('出発',A[0],A[1]-24,{size:22,color:C.dim})+label('到着',B[0]+20,B[1]+8,{size:22,color:C.dim});
  const rows=[['摩擦のない道',C.x,12,140],['ざらざらの道',C.p,5,330]],g=seg(p,.1,.8);
  rows.forEach(([nm,col,W,y])=>{const w=W*22*g;
   s+=label(nm,680,y-40,{size:26,color:col})+rect(820,y-24,w,28,{fill:C.E,fo:.7,rx:4,sw:0})+label('仕事',810,y-2,{size:22,color:C.E,anchor:'end'})+label(`${fmt(W*g,0)} J`,830+w,y-2,{size:22,color:C.E})
    +rect(820,y+14,w,28,{fill:C.v,fo:.7,rx:4,sw:0})+label('Kの差',810,y+36,{size:22,color:C.v,anchor:'end'})+label(`${fmt(W*g,0)} J`,830+w,y+36,{size:22,color:C.v});});
  return s+fade(seg(p,.8,1),label('道ごとに、仕事 ＝ 運動エネルギーの差',1150,480,{size:26,color:C.hi,anchor:'end'}));
 },
 'wk-circle':(p)=>{
  const cx=330,cy=265,r=170,a=-Math.PI*2*1.2*p,P=[cx+r*Math.cos(a),cy+r*Math.sin(a)],T=[Math.sin(a),-Math.cos(a)],In=[-Math.cos(a),-Math.sin(a)];
  let s=ring(cx,cy,r,{color:C.faint,w:3,dash:'6 8'})+dot(cx,cy,5,C.dim);
  s+=arrow(P[0],P[1],P[0]+T[0]*130,P[1]+T[1]*130,{color:C.v,w:6})+tex('\\vec v',P[0]+T[0]*150,P[1]+T[1]*150+10,{size:30});
  s+=arrow(P[0],P[1],P[0]+In[0]*110,P[1]+In[1]*110,{color:C.F,w:6})+rightAngle(P,T,In,18)+ring(P[0],P[1],14,{color:C.hi,w:3,fill:'#3a3320'});
  s+=fade(seg(p,.2,.4),label('力 ⟂ 速度',720,130,{size:30,color:C.hi}))+fade(seg(p,.35,.55),tex('P=\\vec F\\cdot\\vec v=0',840,230,{size:40}))+fade(seg(p,.5,.7),label('速さ 3.0 m/s のまま',720,340,{size:28,color:C.v}));
  return s;
 },
});

// =============== ui-work-changing: stair force, then smooth force ==============================
const stairF=[2,3,1,2];
function sAxes(g=1,ylabel='力 F [N]'){return axes({x:150,y:470,w:760,h:260,xmax:4.4,ymax:3.6,xlabel:'位置 [m]',ylabel,xticks:[1,2,3,4],yticks:[1,2,3],grid:true,g,xcolor:C.x,ycolor:C.F});}
function stairPath(A,upto=4){const pts=[[A.X(0),A.Y(stairF[0])]];for(let i=0;i<4;i++){const x1=Math.min(i+1,upto);if(i>=upto)break;pts.push([A.X(x1),A.Y(stairF[i])]);if(x1===i+1&&i<3&&upto>i+1)pts.push([A.X(i+1),A.Y(stairF[i+1])]);}return draw(pts,1,{color:C.F,w:5});}
function stairRect(A,i,g,col=C.E){return fade(g,rect(A.X(i),A.Y(stairF[i]),A.X(i+1)-A.X(i),A.Y(0)-A.Y(stairF[i]),{fill:col,fo:.4,rx:0,sw:1.5})+tex(`${stairF[i]}\\times1`,A.X(i+.5),A.Y(stairF[i]/2)+10,{size:28}));}
const smoothF=x=>3*x-.75*x*x;
function midSum(N){let s=0;for(let i=0;i<N;i++){s+=smoothF((i+.5)*4/N)*4/N;}return s;}
function midRects(A,N){let s='';const w=4/N;for(let i=0;i<N;i++){const h=smoothF((i+.5)*w);s+=rect(A.X(i*w),A.Y(h),A.X(w)-A.X(0),A.Y(0)-A.Y(h),{fill:C.E,fo:.35,rx:0,sw:N>16?.8:1.5});}return s;}
Object.assign(workDiagrams,{
 'wk-stair:walk':(p)=>{
  const A=sAxes(seg(p,0,.2)),x=4*lin(p,.1,.85),F=stairF[Math.min(3,Math.floor(x))],Y=95;
  let s=A.svg+ground(120,1060,Y)+block(A.X(x),Y,70,50,{color:C.x})+arrow(A.X(x)+35,Y-25,A.X(x)+35+F*40,Y-25,{color:C.F,w:6,head:14})+label(`${F} N`,A.X(x)+45+F*40,Y-17,{size:24,color:C.F});
  s+=stairPath(A,Math.max(.01,x))+line(A.X(x),Y+10,A.X(x),A.Y(F),{color:C.faint,w:1.5,dash:'4 6'});
  return s+fade(seg(p,.85,1),label('F に何を入れる？',1150,220,{size:28,color:C.hi,anchor:'end',weight:700}));
 },
 'wk-stair:one':(p)=>{const A=sAxes();return A.svg+stairPath(A)+stairRect(A,0,seg(p,.1,.5))+fade(seg(p,.5,.8),label('2 N × 1 m ＝ 2 J',1150,200,{size:30,color:C.E,anchor:'end',weight:700}));},
 'wk-stair:sum':(p)=>{const A=sAxes();let s=A.svg+stairRect(A,0,1);let tot=2;
  [1,2,3].forEach(i=>{const g=seg(p,(i-1)*.28,(i-1)*.28+.22);s+=stairRect(A,i,g);if(g>.5)tot+=stairF[i];});
  return s+stairPath(A)+label(`合計 ${tot} J`,1150,200,{size:34,color:C.hi,anchor:'end',weight:700})+fade(seg(p,.2,.4),label('2 → 5 → 6 → 8',1150,250,{size:24,color:C.dim,anchor:'end'}));},
 'wk-smooth:4':(p)=>{const A=sAxes(seg(p,0,.2));const g=seg(p,.3,.6);
  return A.svg+fade(g,midRects(A,4))+A.plot(smoothF,{from:0,to:4,p:seg(p,.1,.35),color:C.F,w:4})+fade(seg(p,.6,.8),label('4 本：8.25 J',1150,200,{size:32,color:C.E,anchor:'end',weight:700}))+fade(seg(p,.7,.9),label('はみ出し・すき間が残る',1150,250,{size:24,color:C.dim,anchor:'end'}));},
 'wk-smooth:more':(p)=>{const A=sAxes(),k=Math.min(3,Math.floor(lin(p,.05,.9)*4)),N=[4,8,16,32][k];
  return A.svg+midRects(A,N)+A.plot(smoothF,{from:0,to:4,color:C.F,w:4})+label(`${N} 本：${fmt(midSum(N),2)} J`,1150,200,{size:32,color:C.E,anchor:'end',weight:700})+label('→ 8 J に近づく',1150,250,{size:24,color:C.dim,anchor:'end'});},
 'wk-smooth:area':(p)=>{const A=sAxes(),u=seg(p,.1,.7)*4;
  return A.svg+fade(1-seg(p,0,.3),midRects(A,32))+poly([[A.X(0),A.Y(0)],...Array.from({length:61},(_,i)=>{const x=u*i/60;return [A.X(x),A.Y(smoothF(x))];}),[A.X(u),A.Y(0)]],{fill:C.E,fo:.5})+A.plot(smoothF,{from:0,to:4,color:C.F,w:4})+fade(seg(p,.7,.95),label('曲線の下の面積 ＝ 8 J',1150,200,{size:30,color:C.E,anchor:'end',weight:700}));},
 'wk-unit:tile':(p)=>{
  const x0=330,y0=410,W=420*seg(p,0,.35),H=240*seg(p,.15,.45);
  let s=rect(x0,y0-H,W,H,{fill:C.E,fo:.3,rx:0});
  s+=fade(seg(p,.3,.5),label('横：1 m',x0+210,y0+45,{size:28,color:C.x,anchor:'middle'})+label('縦：2 N',x0-20,y0-110,{size:28,color:C.F,anchor:'end'}));
  s+=fade(seg(p,.5,.75),label('N × m',1000,200,{size:34,color:C.ink,anchor:'middle'})+label('＝ N・m',1000,260,{size:34,color:C.ink,anchor:'middle'}))+fade(seg(p,.7,.95),label('＝ J（ジュール）',1000,320,{size:34,color:C.E,anchor:'middle',weight:700}));
  return s;
 },
 'wk-unit:area':(p)=>{const A=sAxes();let s=A.svg;for(let i=0;i<4;i++)s+=rect(A.X(i),A.Y(stairF[i]),A.X(i+1)-A.X(i),A.Y(0)-A.Y(stairF[i]),{fill:C.E,fo:.4*seg(p,i*.1,i*.1+.2),rx:0,sw:1.5});
  s+=stairPath(A)+fade(seg(p,.4,.6),label('面積 ＝ 仕事 8 J',1150,190,{size:32,color:C.E,anchor:'end',weight:700}));
  const g=seg(p,.6,.85);return s+fade(g,label('紙の広さ（m²）',1150,260,{size:26,color:C.dim,anchor:'end'})+line(955,252,1150,252,{color:C.a,w:4}));},
 'wk-unit:recipe':(p)=>{const terms=['2\\times1','3\\times1','1\\times1','2\\times1'];let s='';
  terms.forEach((t,i)=>{const g=seg(p,i*.15,i*.15+.18),x=150+i*230;s+=fade(g,rect(x-80,150,160,160*stairF[i]/3,{fill:C.E,fo:.3,rx:4})+tex(t,x,120,{size:36}))+(i?fade(g,tex('+',x-115,120,{size:36})):'');});
  s+=fade(seg(p,.6,.8),tex('=8\\,\\mathrm{J}',1080,120,{size:40}));
  return s+fade(seg(p,.7,.95),label('その場所の力 × 短い距離 を、全部足す',600,420,{size:30,color:C.hi,anchor:'middle',weight:700}));},
});

// =============== ui-energy-change: same 9 J, different speed gain ============================
const CX=m=>150+100*m;
function cartState(T,moving){ // T in [0,2] s on a common clock; returns {x,v,push}
 if(!moving)return {x:.75*T*T,v:1.5*T,push:true};
 const tp=(-3+Math.sqrt(18))/1.5;if(T<tp)return {x:3*T+.75*T*T,v:3+1.5*T,push:true};
 return {x:3+Math.sqrt(18)*(T-tp),v:Math.sqrt(18),push:false};
}
function lane(y,st,{name,push=1,fill=0,delta=''}={}){
 let s=ground(60,1140,y)+fade(push>0?1:0,rect(CX(0),y+8,CX(3)-CX(0),16,{fill:C.faint,fo:.35,rx:3,sw:0}))+rect(CX(0),y+8,(CX(3)-CX(0))*fill,16,{fill:C.E,fo:.8,rx:3,sw:0});
 if(fill>0)s+=label(`仕事 ${fmt(9*fill,0)} J`,CX(0),y+54,{size:22,color:C.E});
 const X=CX(st.x);s+=cart(X,y,{w:110,h:50,color:C.x,text:'2 kg',size:22});
 if(st.push&&push>0)s+=arrow(X-135,y-40,X-58,y-40,{color:C.F,w:6,g:push})+fade(push,label('3 N',X-135,y-60,{size:22,color:C.F}));
 s+=label(name,40,y-135,{size:24,color:C.dim});
 if(st.v>.01)s+=arrow(X-30,y-88,X-30+st.v*32,y-88,{color:C.v,w:5,head:14});
 s+=label(`${fmt(st.v,1)} m/s`,X-30+Math.max(st.v*32,0)+12,y-80,{size:24,color:C.v});
 if(delta)s+=label(delta,X+70,y-40,{size:28,color:C.hi,weight:700});
 return s;
}
function kvAxes(g=1){return axes({x:170,y:420,w:700,h:340,xmax:7,ymax:40,xlabel:'速さ v [m/s]',ylabel:'½mv² [J]',xticks:[1,2,3,4,5,6],yticks:[9,18,27,36],grid:true,g,xcolor:C.v,ycolor:C.E});}
function band(A,k0,k1,g,{faint=false}={}){
 const v0=Math.sqrt(k0),v1=Math.sqrt(k0+(k1-k0)*g),o=faint?.35:1;
 return fade(o,rect(A.X(0)-8,A.Y(k0+(k1-k0)*g),16,A.Y(k0)-A.Y(k0+(k1-k0)*g),{fill:C.E,fo:.8,rx:3,sw:0})+rect(A.X(v0),A.Y(0)-8,A.X(v1)-A.X(v0),16,{fill:C.v,fo:.8,rx:3,sw:0})
  +line(A.X(0),A.Y(k0+(k1-k0)*g),A.X(v1),A.Y(v1*v1),{color:C.E,w:2,dash:'5 6'})+line(A.X(v1),A.Y(v1*v1),A.X(v1),A.Y(0),{color:C.v,w:2,dash:'5 6'})+dot(A.X(v1),A.Y(v1*v1),8,C.hi));
}
Object.assign(workDiagrams,{
 'wk-carts:start':(p)=>{const u=lin(p,0,1);return lane(180,{x:0,v:0,push:false},{name:'止まっていた台車'})+lane(420,{x:-.8+.8*u,v:3,push:false},{name:'走っていた台車'})+fade(seg(p,.5,.8),label('摩擦なし',1140,60,{size:24,color:C.dim,anchor:'end'}));},
 'wk-carts:push':(p)=>{const T=2*lin(p,.05,.9),a=cartState(T,false),b=cartState(T,true);
  return lane(180,a,{name:'止まっていた台車',fill:Math.min(1,a.x/3)})+lane(420,b,{name:'走っていた台車',fill:Math.min(1,b.x/3),push:b.push?1:0})+label('3 N × 3 m ＝ 9 J',1140,60,{size:28,color:C.E,anchor:'end',weight:700});},
 'wk-carts:result':(p)=>{const a=cartState(2,false),b=cartState(2,true),g=seg(p,.2,.5),h=seg(p,.5,.8);
  return lane(180,a,{name:'止まっていた台車',fill:1,delta:''})+lane(420,b,{name:'走っていた台車',fill:1,push:0})+fade(g,label('+3',CX(a.x)+80,140,{size:32,color:C.hi,weight:700}))+fade(h,label('+1.2 だけ',CX(b.x)-60,470,{size:30,color:C.hi,weight:700,anchor:'end'}));},
 'wk-kv:curve':(p)=>{const A=kvAxes(seg(p,0,.25));let s=A.svg+A.plot(v=>v*v,{from:0,to:6.3,p:seg(p,.2,.6),color:C.E,w:4});
  const g=seg(p,.6,.85);s+=fade(g,line(A.X(3),A.Y(0),A.X(3),A.Y(9),{color:C.v,w:2,dash:'5 6'})+line(A.X(6),A.Y(0),A.X(6),A.Y(36),{color:C.v,w:2,dash:'5 6'})+dot(A.X(3),A.Y(9),8,C.hi)+dot(A.X(6),A.Y(36),8,C.hi));
  return s+fade(seg(p,.75,1),label('速さ 2 倍 → 4 倍',1150,200,{size:30,color:C.hi,anchor:'end',weight:700}));},
 'wk-kv:first':(p)=>{const A=kvAxes();return A.svg+A.plot(v=>v*v,{from:0,to:6.3,color:C.E,w:4})+band(A,0,9,seg(p,.1,.6))+fade(seg(p,.55,.8),label('+9 J',A.X(0)+16,A.Y(4.5)+8,{size:24,color:C.E})+label('速さ +3',A.X(1.5),A.Y(0)+62,{size:26,color:C.v,anchor:'middle',weight:700}));},
 'wk-kv:second':(p)=>{const A=kvAxes();return A.svg+A.plot(v=>v*v,{from:0,to:6.3,color:C.E,w:4})+band(A,0,9,1,{faint:true})+band(A,9,18,seg(p,.1,.6))+fade(seg(p,.55,.8),label('+9 J',A.X(0)+16,A.Y(13.5)+8,{size:24,color:C.E})+label('+1.2 だけ',A.X(3.6),A.Y(0)+62,{size:26,color:C.v,anchor:'start',weight:700}))+fade(seg(p,.6,.9),label('曲線が急 → 横の幅が細い',1150,120,{size:26,color:C.hi,anchor:'end'}));},
 'wk-kv:four':(p)=>{const A=kvAxes();return A.svg+A.plot(v=>v*v,{from:0,to:6.3,color:C.E,w:4})+band(A,0,9,1,{faint:true})+band(A,0,36,seg(p,.2,.7))+fade(seg(p,.65,.9),label('仕事 4 倍（36 J）',1150,130,{size:28,color:C.E,anchor:'end',weight:700})+label('→ 速さは 2 倍（6 m/s）',1150,180,{size:28,color:C.v,anchor:'end',weight:700}));},
});

// =============== um-work-sum: spring, hand force +kx, Riemann sums ============================
function springRig(x,{y=250,wallX=120,L0=300,sc=4000,hand=1,ruler=true}={}){
 const X=wallX+L0+x*sc;let s=wall(wallX,y-70,y+70)+spring(wallX,X,y,{coils:10,amp:22,color:C.dim})+rect(X,y-32,60,64,{fill:C.t,fo:.25,stroke:C.t,rx:12})+label('手',X+30,y+9,{size:26,color:C.t,anchor:'middle'});
 const F=200*x;
 if(hand>0&&F>.3)s+=arrow(X+60,y,X+60+F*9,y,{color:C.F,w:7,g:hand});
 if(ruler)s+=line(wallX+L0,y+80,wallX+L0,y+100,{color:C.dim,w:2})+(x>0.002?arrow(wallX+L0,y+90,X,y+90,{color:C.x,w:3,head:10}):'')+label(`伸び x = ${fmt(x,2)} m`,wallX+L0,y+130,{size:24,color:C.x});
 return {s,X,F};
}
function stAxes(ymin=0,g=1){return axes({x:170,y:ymin<0?270:450,w:720,h:ymin<0?210:360,xmax:.11,ymax:22,xlabel:'伸び x [m]',ylabel:'力 F [N]',xticks:[.02,.04,.06,.08,.1],yticks:[4,8,12,16,20],grid:true,g,xcolor:C.x,ycolor:C.F});}
function rightRects(A,N,{mid=false,g=1}={}){let s='';const w=.1/N;for(let i=0;i<N;i++){const u=g>=1?1:seg(g,i/N*.8,i/N*.8+.2);if(u<=0)continue;const xr=mid?(i+.5)*w:(i+1)*w,h=200*xr;s+=fade(u,rect(A.X(i*w),A.Y(h),A.X(w)-A.X(0),A.Y(0)-A.Y(h),{fill:C.E,fo:.35,rx:0,sw:N>20?.8:1.5}));
  if(!mid&&N<=10)s+=fade(u,poly([[A.X(i*w),A.Y(h)],[A.X((i+1)*w),A.Y(h)],[A.X(i*w),A.Y(200*i*w)]],{fill:C.hi,fo:.5}));
  if(mid)s+=fade(u,poly([[A.X(i*w),A.Y(h)],[A.X(xr),A.Y(h)],[A.X(i*w),A.Y(200*i*w)]],{fill:C.bg,fo:.9,stroke:C.dim,sw:1})+poly([[A.X(xr),A.Y(h)],[A.X((i+1)*w),A.Y(h)],[A.X((i+1)*w),A.Y(200*(i+1)*w)]],{fill:C.hi,fo:.55}));}
 return s;}
Object.assign(workDiagrams,{
 'wk-spring:pull':(p)=>{const x=.1*seg(p,.1,.9),r=springRig(x);return r.s+(r.F>.3?label(`${fmt(r.F,0)} N`,r.X+70+r.F*9,258,{size:26,color:C.F}):'')+fade(seg(p,.4,.8),label('伸ばすほど、強く引く必要がある',1150,70,{size:26,color:C.hi,anchor:'end'}));},
 'wk-spring:hand':(p)=>{const x=.1-.05*Math.sin(Math.PI*seg(p,.05,.75)),r=springRig(x);
  return r.s+label(`${fmt(r.F,0)} N`,r.X+70+r.F*9,258,{size:26,color:C.F})+tex('F=kx',1000,80,{size:44})+fade(seg(p,.2,.5),tex(`=200\\times${fmt(x,3)}=${fmt(r.F,0)}`,1000,150,{size:32}))+fade(seg(p,.1,.3),label('k：ばね定数 200 N/m',1150,480,{size:24,color:C.dim,anchor:'end'}));},
 'wk-spring:pair':(p)=>{const r=springRig(.1,{hand:0,ruler:false}),y=250,g=seg(p,.05,.35),h=seg(p,.35,.65);
  let s=r.s+arrow(r.X,y-50,r.X+180,y-50,{color:C.F,w:7,g})+fade(g,label('手がばねを引く力',r.X+10,y-110,{size:24,color:C.F})+tex('+kx',r.X+220,y-50,{size:36,anchor:'start'}));
  s+=arrow(r.X+60,y+50,r.X-120,y+50,{color:C.F,w:7,g:h})+fade(h,label('ばねが手を引く力',r.X-130,y+110,{size:24,color:C.F,anchor:'end'})+tex('-kx',r.X-140,y+50,{size:36,anchor:'end'}));
  return s+arrow(900,440,1100,440,{color:C.dim,w:3,head:12})+label('＋の向き',1000,480,{size:22,color:C.dim,anchor:'middle'})+fade(seg(p,.7,.95),label('作用・反作用：大きさ同じ、向き逆',80,60,{size:26,color:C.hi}));},
 'wk-spring:graph':(p)=>{
  const u=seg(p,0,.25),x=.1*seg(p,.3,.9),r=springRig(x,{y:mix(250,80,u),hand:1,ruler:u<.5});
  const A=axes({x:170,y:480,w:720,h:300,xmax:.11,ymax:22,xlabel:'伸び x [m]',ylabel:'',xticks:[.02,.04,.06,.08,.1],yticks:[10,20],grid:true,g:u,xcolor:C.x,ycolor:C.F});
  return fade(1-.3*u,r.s)+A.svg+fade(u,label('手の力 [N]',175,160,{size:24,color:C.F}))+A.plot(z=>200*z,{from:0,to:Math.max(.0001,x),color:C.F,w:4})+(x>0?dot(A.X(x),A.Y(200*x),8,C.hi):'')+fade(seg(p,.85,1),label('原点を通る直線',1150,230,{size:26,color:C.hi,anchor:'end'}));
 },
 'wk-strip:five':(p)=>{const A=stAxes();let s=A.svg+rightRects(A,5,{g:seg(p,0,.7)})+A.plot(z=>200*z,{from:0,to:.105,color:C.F,w:4});
  [4,8,12,16,20].forEach((F,i)=>{const g=seg(p,i*.14,i*.14+.2);s+=fade(g,label(String(F),A.X((i+.5)*.02),A.Y(F)-10,{size:24,color:C.F,anchor:'middle'}));});
  return s+fade(seg(p,.75,.95),label('右の端の力を使う',1150,120,{size:26,color:C.hi,anchor:'end'}));},
 'wk-strip:more':(p)=>{const A=stAxes(),k=Math.min(3,Math.floor(lin(p,.05,.9)*4)),N=[5,10,20,40][k];
  return A.svg+rightRects(A,N)+A.plot(z=>200*z,{from:0,to:.105,color:C.F,w:4})+label(`${N} 等分：${fmt(1+1/N,3)} J`,1150,120,{size:32,color:C.E,anchor:'end',weight:700})+label('→ 1 J に近づく',1150,170,{size:24,color:C.dim,anchor:'end'});},
 'wk-strip:mid':(p)=>{const A=stAxes();return A.svg+rightRects(A,5,{mid:true,g:seg(p,.05,.5)})+A.plot(z=>200*z,{from:0,to:.105,color:C.F,w:4})+fade(seg(p,.4,.7),label('はみ出し ＝ すき間',1150,120,{size:26,color:C.hi,anchor:'end'}))+fade(seg(p,.6,.9),label('真ん中の力：1.0 J',1150,170,{size:32,color:C.E,anchor:'end',weight:700}));},
 'wk-tri:area':(p)=>{const A=stAxes();const u=.1*seg(p,.05,.5);
  return A.svg+poly([[A.X(0),A.Y(0)],[A.X(u),A.Y(0)],[A.X(u),A.Y(200*u)]],{fill:C.E,fo:.45,stroke:C.E,sw:2})+A.plot(z=>200*z,{from:0,to:.105,color:C.F,w:4})
   +fade(seg(p,.45,.7),label('0.1 m',A.X(.05),A.Y(0)+62,{size:24,color:C.x,anchor:'middle'})+label('20 N',A.X(.1)+14,A.Y(10),{size:24,color:C.F}))
   +fade(seg(p,.6,.9),tex('\\tfrac12\\times0.1\\times20=1.0\\,\\mathrm{J}',480,120,{size:36}));},
 'wk-tri:sign':(p)=>{
  const A=axes({x:170,y:250,w:720,h:190,xmax:.11,ymax:22,ymin:-22,xlabel:'伸び x [m]',ylabel:'力 [N]',xticks:[.1],yticks:[-20,20],grid:false,xcolor:C.x,ycolor:C.F});
  const g=seg(p,.3,.7);let s=A.svg+poly([[A.X(0),A.Y(0)],[A.X(.1),A.Y(0)],[A.X(.1),A.Y(20)]],{fill:C.E,fo:.4})+A.plot(z=>200*z,{from:0,to:.105,color:C.F,w:4})+label('手の力 +kx：+1.0 J',1150,110,{size:26,color:C.E,anchor:'end',weight:700});
  s+=fade(g,poly([[A.X(0),A.Y(0)],[A.X(.1),A.Y(0)],[A.X(.1),A.Y(-20)]],{fill:C.a,fo:.35}))+A.plot(z=>-200*z,{from:0,to:.105,p:g,color:C.F,w:4,dash:'10 8'})+fade(g,label('ばねの力 −kx：−1.0 J',1150,410,{size:26,color:C.a,anchor:'end',weight:700}));
  return s;
 },
});

// =============== um-work-vector: cut the path, pair each Δr with the local F ==================
const PX=x=>100+100*x,PY=y=>470-100*y;
const pathW=s=>[1+8*s,1+2.4*Math.sin(Math.PI*s)+.5*s];
const fieldF=(x,y)=>[1+.1*y,.5-.12*x];
function lineSum(N){let W=0;for(let i=0;i<N;i++){const a=pathW(i/N),b=pathW((i+1)/N),m=pathW((i+.5)/N),F=fieldF(m[0],m[1]);W+=F[0]*(b[0]-a[0])+F[1]*(b[1]-a[1]);}return W;}
function curve(o=1){return draw(Array.from({length:101},(_,i)=>{const q=pathW(i/100);return [PX(q[0]),PY(q[1])];}),1,{color:C.faint,w:3,opacity:o});}
function chords(N,g=1,{hi=-1}={}){let s='';for(let i=0;i<N;i++){const u=g>=1?1:seg(g,i/N*.8,i/N*.8+.2);const a=pathW(i/N),b=pathW((i+1)/N);s+=arrow(PX(a[0]),PY(a[1]),PX(b[0]),PY(b[1]),{color:i===hi?C.hi:C.x,w:N>20?3:5,head:N>20?8:14,g:u});}return s;}
function forces(N,g=1,{tag='F',sc=70}={}){let s='';for(let i=0;i<N;i++){const u=g>=1?1:seg(g,i/N*.8,i/N*.8+.2);const a=pathW(i/N),F=fieldF(a[0],a[1]);s+=arrow(PX(a[0]),PY(a[1]),PX(a[0])+F[0]*sc,PY(a[1])-F[1]*sc,{color:C.F,w:4,head:12,g:u});}return s;}
Object.assign(workDiagrams,{
 'wk-path:cut':(p)=>{const g=seg(p,0,.3),a=pathW(2/6),b=pathW(3/6);return draw(Array.from({length:101},(_,i)=>{const q=pathW(i/100);return [PX(q[0]),PY(q[1])];}),g,{color:C.dim,w:3})+chords(6,seg(p,.3,.8),{hi:2})+fade(seg(p,.75,1),tex('\\Delta\\vec r',(PX(a[0])+PX(b[0]))/2-10,(PY(a[1])+PY(b[1]))/2-30,{size:34,anchor:'end'}));},
 'wk-path:force':(p)=>{const a=pathW(2/6);return curve()+chords(6,1,{hi:2})+forces(6,seg(p,0,.6))+fade(seg(p,.6,.9),highlight(PX(a[0])-30,PY(a[1])-80,200,150,1)+label('この区間の F と Δr を組にする',1150,480,{size:24,color:C.hi,anchor:'end'}));},
 'wk-path:notr':(p)=>{const a=pathW(2/6),b=pathW(3/6),g=seg(p,.05,.4),h=seg(p,.4,.65);
  let s=curve()+chords(6,1,{hi:2})+forces(6,1)+dot(PX(0),PY(0),7,C.dim)+label('原点',PX(0)-10,PY(0)+30,{size:22,color:C.dim,anchor:'end'});
  s+=arrow(PX(0),PY(0),PX(b[0]),PY(b[1]),{color:C.dim,w:4,g,head:12})+fade(g,label('位置ベクトル r',PX(b[0]/2)+40,PY(b[1]/2)+70,{size:24,color:C.dim}));
  const cx=PX(b[0]/2)-10,cy=PY(b[1]/2);s+=fade(h,line(cx-24,cy-24,cx+24,cy+24,{color:C.a,w:7})+line(cx-24,cy+24,cx+24,cy-24,{color:C.a,w:7}));
  return s+fade(seg(p,.6,.9),label('使うのは Δr（動いた分）',1150,60,{size:26,color:C.hi,anchor:'end',weight:700}));},
 'wk-dot:proj':(p)=>{
  const P=[250,380],L=560,th=40*DEG,F=280,g=seg(p,.15,.45),h=seg(p,.45,.7);
  const tip=[P[0]+F*Math.cos(th),P[1]-F*Math.sin(th)],foot=[tip[0],P[1]];
  let s=arrow(P[0],P[1],P[0]+L,P[1],{color:C.x,w:6})+tex('\\Delta\\vec r',P[0]+L+20,P[1]+10,{size:34,anchor:'start'});
  s+=arrow(P[0],P[1],tip[0],tip[1],{color:C.F,w:6,g:seg(p,0,.2)})+tex('\\vec F',tip[0]+14,tip[1]-10,{size:34,anchor:'start'});
  s+=fade(g,draw(Array.from({length:21},(_,i)=>[P[0]+70*Math.cos(th*i/20),P[1]-70*Math.sin(th*i/20)]),1,{color:C.t,w:2.5})+tex('\\theta',P[0]+95,P[1]-22,{size:28}));
  s+=fade(h,line(tip[0],tip[1],foot[0],foot[1],{color:C.F,w:2.5,dash:'6 6'})+line(P[0],P[1]+2,foot[0],P[1]+2,{color:C.hi,w:12,cap:'butt'})+tex('F\\cos\\theta',(P[0]+foot[0])/2,P[1]+54,{size:32}));
  return s+fade(seg(p,.7,.95),rect(760,70,410,100,{fill:C.E,fo:.1,stroke:C.E,rx:12})+tex('\\vec F\\cdot\\Delta\\vec r=F\\cos\\theta\\times\\Delta r',965,120,{size:30}));
 },
 'wk-dot:three':(p)=>{
  const s0=[150,430],k=115,pts=[s0,[s0[0]+3*k,s0[1]],[s0[0]+3*k,s0[1]-2*k],[s0[0]+2*k,s0[1]-2*k]],W=[12,0,-4],tags=['+12 J','0 J','−4 J'];
  let s='';
  for(let i=0;i<3;i++){const g=seg(p,i*.25,i*.25+.22),a=pts[i],b=pts[i+1],m=[(a[0]+b[0])/2,(a[1]+b[1])/2];
   s+=arrow(a[0],a[1],b[0],b[1],{color:C.x,w:6,g})+fade(g,i===1?arrow(m[0]+20,m[1],m[0]+100,m[1],{color:C.F,w:5,head:12}):arrow(m[0]-40,m[1]-36,m[0]+40,m[1]-36,{color:C.F,w:5,head:12}));
   s+=fade(g,label(tags[i],820,150+i*70,{size:30,color:W[i]>0?C.E:W[i]<0?C.a:C.dim,weight:700})+label(['右へ 3 m','上へ 2 m','左へ 1 m'][i],1150,150+i*70,{size:24,color:C.x,anchor:'end'}));}
  s+=label('力：右向き 4 N（どこでも同じ）',80,60,{size:26,color:C.F});
  return s+fade(seg(p,.8,1),line(800,370,1160,370,{color:C.hi,w:3})+label('合計 8 J',820,420,{size:32,color:C.hi,weight:700}));
 },
 'wk-path:fine':(p)=>{const k=Math.min(3,Math.floor(lin(p,.05,.9)*4)),N=[6,12,24,48][k];
  return curve()+chords(N)+label(`${N} 区間：W ≈ ${fmt(lineSum(N),3)} J`,1150,60,{size:30,color:C.E,anchor:'end',weight:700})+fade(seg(p,.8,1),label(`→ ${fmt(lineSum(2000),3)} J に落ち着く`,1150,110,{size:24,color:C.dim,anchor:'end'}));},
 'wk-path:qE':(p)=>{const g=seg(p,.2,.55),N=12;let s=curve(.7)+chords(N);
  for(let i=0;i<N;i+=2){const a=pathW(i/N),F=fieldF(a[0],a[1]),X=PX(a[0])+F[0]*70,Y=PY(a[1])-F[1]*70;s+=arrow(PX(a[0]),PY(a[1]),X,Y,{color:C.F,w:4,head:12})+fade(1-g,tex('\\vec F',X+8,Y-8,{size:26,anchor:'start'}))+fade(g,tex('q\\vec E',X+8,Y-8,{size:26,anchor:'start'}));}
  return s+fade(g,tex('\\vec F\\;\\to\\;q\\vec E',760,400,{size:40}))+fade(seg(p,.6,.9),tex('W=\\int_C q\\vec E\\cdot d\\vec r',760,470,{size:34}));},
});

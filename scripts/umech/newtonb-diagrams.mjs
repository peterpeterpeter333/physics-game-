// Bridges for 位置の記録 / 力の地図 / 成分の運動方程式. Viewbox 1200×515.
// Colours: x cyan, v purple, a red, F green, t gold (anim.mjs C).
import {C,clamp,mix,seg,lin,fmt,fade,label,line,rect,dot,draw,poly,arrow,brace,highlight,axes,cart,tex} from './anim.mjs';

const n2=v=>Number(v.toFixed(2));
// Ellipse outline drawn on progressively (g 0→1).
function oval(cx,cy,rx,ry,{color=C.hi,w=3,g=1}={}){
 if(g<=0.001)return '';
 const L=Math.PI*(3*(rx+ry)-Math.sqrt((3*rx+ry)*(rx+3*ry)));
 return `<ellipse cx="${n2(cx)}" cy="${n2(cy)}" rx="${n2(rx)}" ry="${n2(ry)}" fill="${color}" fill-opacity="${n2(.05*g)}" stroke="${color}" stroke-width="${w}"${g<.999?` stroke-dasharray="${n2(L*g)} ${n2(L)}"`:''}/>`;
}

// ---------------------------------------------------------------------------------
// 1) 位置の記録 (ui-motion-record): 0.5 s ごと 0, 0.5, 1.2, 2.1, 3.0 m
// ---------------------------------------------------------------------------------
const RT=[0,.5,1,1.5,2],RXm=[0,.5,1.2,2.1,3];
const TY=230,RX=m=>140+290*m;
// Smooth motion through the recorded points (0.4t²+0.8t up to 1.5 s, then 1.8 m/s).
const xAt=t=>t<=1.5?.4*t*t+.8*t:2.1+1.8*(t-1.5);
function track(g=1){
 return fade(g,arrow(100,TY,1120,TY,{color:C.dim,w:3,head:16})+line(RX(0),TY-12,RX(0),TY+12,{color:C.ink,w:3})
  +label('原点',RX(0)-16,TY-20,{size:22,color:C.dim,anchor:'end'})+label('右が正',1160,TY+44,{size:22,color:C.dim,anchor:'end'}));
}
function shot(i,g,{pos=true,time=true}={}){
 const x=RX(RXm[i]);
 return fade(g,dot(x,TY,9,C.x)+(time?label(`${RT[i]} s`,x,TY-100,{size:24,color:C.t,anchor:'middle'}):'')+(pos?label(`${RXm[i].toFixed(1)} m`,x,TY+44,{size:22,color:C.x,anchor:'middle'}):''));
}
const gaps=[.5,.7,.9,.9];
export const newtonbDiagrams={
 'nb-rec:shots':(p)=>{
  const t=2*lin(p,.05,.9);let s=track(seg(p,0,.1));
  s+=cart(RX(xAt(t)),TY-2,{w:110,h:50,color:C.x});
  RT.forEach((T,i)=>{if(t>=T-1e-6)s+=shot(i,seg(t,T,T+.12));});
  s+=label(`時刻 ${fmt(t,1)} s`,60,50,{size:26,color:C.t})+label('0.5 秒ごとに撮影',1150,50,{size:24,color:C.dim,anchor:'end'});
  return s;
 },
 'nb-rec:gaps':(p)=>{
  let s=track()+RT.map((_,i)=>shot(i,1)).join('');
  gaps.forEach((d,i)=>{const g=seg(p,.1+i*.16,.3+i*.16);s+=brace(RX(RXm[i])+6,RX(RXm[i+1])-6,TY+64,{text:`${d} m`,color:C.x,g,size:24});});
  return s+fade(seg(p,.8,1),label('間隔が、だんだん広がる',1150,470,{size:28,color:C.hi,anchor:'end'}));
 },
 'nb-rec:compare':(p)=>{
  let s=track()+RT.map((_,i)=>shot(i,1)).join('');
  gaps.forEach((d,i)=>{s+=brace(RX(RXm[i])+6,RX(RXm[i+1])-6,TY+64,{text:`${d} m`,color:C.x,g:1-seg(p,0,.15),size:24});});
  gaps.forEach((d,i)=>{
   const u=seg(p,.1+i*.12,.35+i*.12),y=338+i*45,x0=mix(RX(RXm[i]),300,u),yy=mix(TY,y,u),L=290*d;
   s+=line(x0,yy,x0+L,yy,{color:C.x,w:12,cap:'butt'});
   s+=fade(u,label(`${RT[i]}〜${RT[i+1]} s`,280,y+8,{size:22,color:C.t,anchor:'end'})+label(`${d} m`,300+L+14,y+8,{size:24,color:C.x}));
  });
  return s+fade(seg(p,.7,.9),label('どれも同じ 0.5 s',1150,360,{size:28,color:C.t,anchor:'end'}))
   +fade(seg(p,.8,1),label('長いほど、速い',1150,420,{size:30,color:C.hi,anchor:'end',weight:700}));
 },
 // ---- two records of the same motion: equal times vs uneven times ----
 'nb-rec2:uneven':(p)=>rec2(p,1),
 'nb-rec2:wide':(p)=>rec2(p,2),
 'nb-rec2:divide':(p)=>rec2(p,3),
 // ---- x–t graph: Δx/Δt, negative velocity, shrinking interval ----
 'nb-rec3:div':(p)=>rec3(p,1),
 'nb-rec3:back':(p)=>rec3(p,2),
 'nb-rec3:shrink':(p)=>rec3(p,3),
};
const UT=[0,1,1.5,2],UX=[0,1.2,2.1,3];
function strip(y,T,X,g,{title,col=C.x,upto=99}={}){
 let s=fade(g,line(RX(0)-20,y,RX(3)+40,y,{color:C.faint,w:3})+label(title,RX(0)-30,y+8,{size:22,color:C.dim,anchor:'end'}));
 T.forEach((t,i)=>{if(i>upto)return;s+=fade(g,dot(RX(X[i]),y,9,col)+label(`${t} s`,RX(X[i]),y-24,{size:22,color:C.t,anchor:'middle'}));});
 return s;
}
function rec2(p,stage){
 let s=strip(110,RT,RXm,1,{title:'0.5 s ごと'});
 const ya=300;
 const shown=stage===1?Math.floor(clamp(p/.12,0,3.99)):3;
 s+=strip(ya,UT,UX,stage===1?seg(p,0,.1):1,{title:'ばらばら',upto:shown});
 const bg=[1.2,.9,.9];
 bg.forEach((d,i)=>{const g=stage===1?seg(p,.5+i*.13,.65+i*.13):1;s+=brace(RX(UX[i])+6,RX(UX[i+1])-6,ya+18,{text:`${d} m`,color:C.x,g,size:24});});
 if(stage===1)s+=fade(seg(p,.1,.4),line(RX(0),110,RX(0),ya,{color:C.faint,w:1.5,dash:'4 6'})+line(RX(3),110,RX(3),ya,{color:C.faint,w:1.5,dash:'4 6'}))+fade(seg(p,.2,.45),label('同じ動き',RX(3)+60,210,{size:22,color:C.dim}));
 if(stage===2){
  const g=seg(p,0,.35);
  s+=highlight(RX(0)-14,ya-14,RX(1.2)-RX(0)+28,84,g);
  s+=fade(seg(p,.3,.6),label('1 秒かけて 1.2 m',(RX(0)+RX(1.2))/2,ya+120,{size:26,color:C.t,anchor:'middle'}));
  s+=fade(seg(p,.55,.85),label('0.5 秒で 0.9 m',(RX(1.2)+RX(2.1))/2,ya+120,{size:26,color:C.t,anchor:'middle'}));
  s+=fade(seg(p,.75,1),label('広い ＝ 速い？',1150,470,{size:28,color:C.hi,anchor:'end',weight:700}));
 }
 if(stage===3){
  const fr=[['\\frac{1.2}{1}=1.2',0],['\\frac{0.9}{0.5}=1.8',1],['\\frac{0.9}{0.5}=1.8',2]];
  fr.forEach(([f,i],j)=>{const g=seg(p,.1+j*.2,.3+j*.2),cx=(RX(UX[i])+RX(UX[i+1]))/2;s+=fade(g,tex(f,cx,ya+128,{size:30}));});
  s+=fade(seg(p,.1,.3),label('速さ [m/s]',RX(0)-30,ya+136,{size:22,color:C.v,anchor:'end'}));
  const g=seg(p,.7,.95);
  s+=fade(g,rect(RX(1.2)+8,ya+92,RX(3)-RX(1.2)-16,64,{fill:C.hi,fo:.06,stroke:C.hi,rx:10}))+fade(g,label('狭いほうが速い',1150,40,{size:30,color:C.hi,anchor:'end',weight:700}));
 }
 return s;
}
function recAxes(){return axes({x:130,y:455,w:640,h:360,xmax:2.7,ymax:3.4,xlabel:'時刻 t [s]',ylabel:'位置 x [m]',xticks:[.5,1,1.5,2,2.5],yticks:[1,2,3],grid:true,xcolor:C.t,ycolor:C.x});}
const PT=[0,.5,1,1.5,2,2.5],PX=[0,.5,1.2,2.1,3,2.6];
function rec3(p,stage){
 const A=recAxes();let s=A.svg;
 const nPts=stage===1?5:6,gBack=stage===2?seg(p,0,.3):1;
 const pts=PT.slice(0,5).map((t,i)=>[A.X(t),A.Y(PX[i])]);
 s+=draw(pts,1,{color:C.x,w:3,opacity:stage===3?.35:1});
 if(nPts===6)s+=draw([[A.X(2),A.Y(3)],[A.X(2.5),A.Y(2.6)]],gBack,{color:C.x,w:3,opacity:stage===3?.35:1});
 PT.forEach((t,i)=>{if(i<nPts)s+=fade(i===5?gBack:1,dot(A.X(t),A.Y(PX[i]),7,C.x));});
 const P=880; // right panel centre
 if(stage===1){
  const g1=seg(p,.05,.3),g2=seg(p,.25,.5);
  if(g1>.01)s+=line(A.X(1),A.Y(1.2),mix(A.X(1),A.X(1.5),g1),A.Y(1.2),{color:C.t,w:5});
  if(g2>.01)s+=line(A.X(1.5),A.Y(1.2),A.X(1.5),mix(A.Y(1.2),A.Y(2.1),g2),{color:C.x,w:5});
  s+=fade(g1,tex('\\Delta t=0.5',A.X(1.25),A.Y(1.2)+40,{size:28}))+fade(g2,tex('\\Delta x=0.9',A.X(1.5)+16,A.Y(1.65)+10,{size:28,anchor:'start'}));
  s+=fade(seg(p,.45,.6),tex('v=\\dfrac{\\Delta x}{\\Delta t}',P+120,130,{size:44}));
  s+=fade(seg(p,.6,.75),tex('=\\dfrac{0.9}{0.5}',P+120,250,{size:40}));
  s+=fade(seg(p,.75,.9),tex('=1.8\\ \\mathrm{m/s}',P+120,350,{size:40}));
 }
 if(stage===2){
  const g=seg(p,.2,.45);
  const g2=seg(p,.35,.55);
  if(g>.01)s+=line(A.X(2),A.Y(3),mix(A.X(2),A.X(2.5),g),A.Y(3),{color:C.t,w:5});
  if(g2>.01)s+=line(A.X(2.5),A.Y(3),A.X(2.5),mix(A.Y(3),A.Y(2.6),g2),{color:C.a,w:5});
  s+=fade(seg(p,.4,.6),tex('\\Delta x=-0.4',A.X(2.5)+14,A.Y(2.8)+60,{size:28,anchor:'start'}));
  s+=fade(seg(p,.45,.65),tex('v=\\dfrac{-0.4}{0.5}=-0.8',P+120,130,{size:38}));
  const ga=seg(p,.65,.85);
  s+=arrow(P+200,240,P+200-140*ga,240,{color:C.v,w:6,g:ga>0?1:0})+fade(ga,label('左向き',P+120,285,{size:26,color:C.v,anchor:'middle'}));
  s+=fade(seg(p,.8,1),label('速さ 0.8 m/s（大きさだけ）',P+120,360,{size:24,color:C.ink,anchor:'middle'})+label('速度 −0.8 m/s（向きつき）',P+120,405,{size:24,color:C.v,anchor:'middle'}));
 }
 if(stage===3){
  s+=A.plot(xAt,{from:0,to:2,color:C.x,w:4});
  const t2=mix(1.5,1.0005,seg(p,.1,.75)),sl=(xAt(t2)-1.2)/(t2-1);
  const L=.55,ex=t=>1.2+sl*(t-1);
  s+=line(A.X(1-L),A.Y(ex(1-L)),A.X(t2+L),A.Y(ex(t2+L)),{color:C.hi,w:3});
  s+=dot(A.X(1),A.Y(1.2),9,C.hi)+dot(A.X(t2),A.Y(xAt(t2)),9,C.hi);
  s+=fade(1-seg(p,.7,.8),line(A.X(1),A.Y(0)-4,A.X(1),A.Y(0)+4,{color:C.t,w:4})+rect(A.X(1),A.Y(0)-10,A.X(t2)-A.X(1),20,{fill:C.t,fo:.3,rx:3,sw:0}));
  s+=label('区間の幅',P+120,110,{size:24,color:C.t,anchor:'middle'})+tex(`${(t2-1).toFixed(2)}\\ \\mathrm{s}`,P+120,160,{size:36,auto:false,color:C.t});
  s+=label('割り算の答え（傾き）',P+120,240,{size:24,color:C.v,anchor:'middle'})+tex(`${sl.toFixed(2)}\\ \\mathrm{m/s}`,P+120,290,{size:40,auto:false,color:C.v});
  s+=fade(seg(p,.78,.95),label('区間を縮めた割り算 ＝ 微分',P+120,400,{size:26,color:C.hi,anchor:'middle',weight:700}));
 }
 return s;
}

// ---------------------------------------------------------------------------------
// 2) 力の地図 (ui-force-map): 2 kg の箱、重力 20 N、垂直抗力 20 N、押す 6 N、摩擦 2 N
// ---------------------------------------------------------------------------------
const FL=400,BX=470,BW=170,BH=130,BCY=FL-BH/2;
function room(g=1){
 return fade(g,rect(90,FL,650,22,{fill:'#9fd8ff',fo:.08,rx:0,sw:0})+line(90,FL,740,FL,{color:C.dim,w:3})+label('床',100,FL+50,{size:22,color:C.dim}))
  +fade(g,rect(BX-BW/2,FL-BH,BW,BH,{fill:C.x,fo:.22,rx:8})+label('箱 2 kg',BX+12,FL-BH+36,{size:24,color:C.ink,anchor:'middle'}))
  +fade(g,line(120,BCY,258,BCY,{color:'#c9a27a',w:18})+rect(258,BCY-30,80,60,{fill:'#c9a27a',fo:.35,stroke:'#c9a27a',rx:20})+label('手',298,BCY+9,{size:24,color:C.ink,anchor:'middle'}));
}
// The four forces on the box (drawn with a common look, lengths not to scale; numbers are labelled).
const F4={
 grav:(g,o=1)=>arrow(BX,BCY,BX,BCY+130,{color:C.F,w:6,g,opacity:o}),
 norm:(g,o=1)=>arrow(BX-55,FL,BX-55,FL-165,{color:C.F,w:6,g,opacity:o}),
 push:(g,o=1)=>arrow(338,BCY,BX-BW/2,BCY,{color:C.F,w:6,g,opacity:o}),
 fric:(g,o=1)=>arrow(BX+BW/2-8,FL-12,BX+BW/2-58,FL-12,{color:C.F,w:6,g,head:14,opacity:o}),
};
const TAG={
 grav:(o)=>label('重力',BX-12,BCY+100,{size:22,color:C.F,anchor:'end',opacity:o}),
 norm:(o)=>label('垂直抗力',BX-44,FL-142,{size:22,color:C.F,opacity:o}),
 push:(o)=>label('押す力',270,BCY-44,{size:22,color:C.F,anchor:'middle',opacity:o}),
 fric:(o)=>label('摩擦',BX+BW/2+12,FL-6,{size:22,color:C.F,opacity:o}),
};
function forceList(items,g=1){
 // Right-hand list: name, value, direction arrow.
 let s=fade(g,label('箱が受ける力',820,70,{size:26,color:C.ink}));
 items.forEach(([name,val,dx,dy,a],i)=>{const y=130+i*62;
  s+=fade(a,label(name,820,y+8,{size:24,color:C.F})+label(val,1040,y+8,{size:24,color:C.ink,anchor:'end'})+arrow(1110-dx*30,y-dy*22,1110+dx*30,y+dy*22,{color:C.F,w:5,head:14}));});
 return s;
}
const LIST=[['重力','20 N',0,1],['垂直抗力','20 N',0,-1],['押す力','6 N',1,0],['摩擦','2 N',-1,0]];
Object.assign(newtonbDiagrams,{
 'nb-fm:ring':(p)=>room(seg(p,0,.25))+oval(BX,BCY,BW/2+70,BH/2+70,{g:seg(p,.45,.9)})+fade(seg(p,.8,1),label('この輪の中だけを調べる',BX,95,{size:26,color:C.hi,anchor:'middle'})),
 'nb-fm:vert':(p)=>{
  const gg=seg(p,.15,.45),gn=seg(p,.45,.75);
  return room()+oval(BX,BCY,BW/2+70,BH/2+70)+F4.grav(gg)+F4.norm(gn)+fade(gg,TAG.grav(1))+fade(gn,TAG.norm(1))
   +forceList(LIST.map((r,i)=>[...r,[gg,gn,0,0][i]]),seg(p,0,.2));
 },
 'nb-fm:horiz':(p)=>{
  const gp=seg(p,.05,.35),gf=seg(p,.3,.6);
  return room()+oval(BX,BCY,BW/2+70,BH/2+70)+F4.grav(1)+F4.norm(1)+F4.push(gp)+F4.fric(gf)+TAG.grav(1)+TAG.norm(1)+fade(gp,TAG.push(1))+fade(gf,TAG.fric(1))
   +fade(seg(p,.4,.6),arrow(BX+BW/2+30,FL+50,BX+BW/2+100,FL+50,{color:C.dim,w:3,head:12})+label('滑る向き',BX+BW/2+110,FL+58,{size:22,color:C.dim}))
   +forceList(LIST.map((r,i)=>[...r,[1,1,gp,gf][i]]))+fade(seg(p,.8,1),label('これで 4 本',1110,420,{size:28,color:C.hi,anchor:'end',weight:700}));
 },
 'nb-fm2:add':(p)=>fm2(p,1),'nb-fm2:wrong':(p)=>fm2(p,2),'nb-fm2:move':(p)=>fm2(p,3),
 'nb-fm3:vert':(p)=>fm3(p,1),'nb-fm3:horiz':(p)=>fm3(p,2),'nb-fm3:order':(p)=>fm3(p,3),
});
function allFour(o=1){return F4.grav(1,o)+F4.norm(1,o)+F4.push(1,o)+F4.fric(1,o)+TAG.grav(o)+TAG.norm(o)+TAG.push(o)+TAG.fric(o);}
function fm2(p,stage){
 let s=room()+oval(BX,BCY,BW/2+70,BH/2+70)+allFour(stage===3?1:.9);
 // the extra arrow "箱が床を押す 20 N" (acts on the floor)
 const bad=C.hi,X0=BX+45;
 if(stage<3){
  const g=stage===1?seg(p,.35,.7):1;
  s+=arrow(X0,FL+2,X0,FL+105,{color:bad,w:6,g})+fade(g,label('箱が床を押す 20 N',X0+14,FL+80,{size:22,color:bad}));
  s+=fade(stage===1?seg(p,0,.3):1,label('この矢印も描く？',980,90,{size:28,color:C.hi,anchor:'middle'}));
 }
 if(stage===2){
  s+=fade(seg(p,.05,.35),label('縦の合計（上が正）',980,170,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.15,.45),tex('20-20-20=-20',980,240,{size:38}));
  const g=seg(p,.5,.8);
  s+=fade(g,label('箱が床に沈む？',980,320,{size:30,color:C.a,anchor:'middle',weight:700})+line(860,370,1100,420,{color:C.a,w:5})+line(860,420,1100,370,{color:C.a,w:5}));
 }
 if(stage===3){
  // The arrow leaves the box's ring and lands in the floor's own diagram.
  const u=seg(p,.1,.55),fx=980,fy=330;
  s+=fade(seg(p,0,.2),rect(fx-120,fy,240,40,{fill:'#9fd8ff',fo:.12,stroke:'#9fd8ff',rx:4})+label('床',fx,fy+30,{size:24,color:C.ink,anchor:'middle'})+label('床の図',fx,fy+100,{size:26,color:C.dim,anchor:'middle'}));
  s+=oval(fx,fy+20,160,85,{g:seg(p,.05,.35),color:C.x});
  const x=mix(X0,fx,u),y1=mix(FL+2,fy-110,u);
  s+=arrow(x,y1,x,y1+103,{color:C.F,w:6})+label('箱が床を押す 20 N',x+14,y1+(u>.99?40:78),{size:22,color:C.F});
  s+=fade(seg(p,.6,.85),label('作用と反作用は、別々の図に入る',BX+150,70,{size:28,color:C.hi,anchor:'middle',weight:700}));
 }
 return s;
}
function fm3(p,stage){
 let s=room()+oval(BX,BCY,BW/2+70,BH/2+70)+allFour(stage===3?1:.45);
 // vertical stack (up positive): normal up 130 px, gravity back down 130 px
 const VX=900,VB=290,VL=130;
 const gv=stage===1?seg(p,.05,.4):1,gv2=stage===1?seg(p,.3,.6):1;
 s+=fade(stage===1?seg(p,0,.15):1,label('縦（上が正）',VX,110,{size:24,color:C.dim,anchor:'middle'})+line(VX-50,VB,VX+50,VB,{color:C.dim,w:2}));
 {const x=mix(BX-55,VX-20,gv),yb=mix(FL,VB,gv);s+=arrow(x,yb,x,yb-mix(165,VL,gv),{color:C.F,w:6})+fade(gv,label('+20',x-14,yb-VL/2,{size:24,color:C.F,anchor:'end'}));}
 {const x=mix(BX,VX+20,gv2),yt=mix(BCY,VB-VL,gv2);s+=arrow(x,yt,x,yt+VL,{color:C.F,w:6})+fade(gv2,label('−20',x+14,yt+VL/2,{size:24,color:C.F}));}
 s+=fade(stage===1?seg(p,.6,.85):1,tex('20-20=0',VX+180,VB-55,{size:34}));
 if(stage>=2){
  const HY=390,HX=820,sc=25,gp=stage===2?seg(p,.05,.35):1,gf=stage===2?seg(p,.3,.6):1;
  s+=fade(stage===2?seg(p,0,.15):1,label('横（右が正）',HX,345,{size:24,color:C.dim}));
  {const x=mix(338,HX,gp),y=mix(BCY,HY,gp),L=mix(BX-BW/2-338,6*sc,gp);s+=arrow(x,y,x+L,y,{color:C.F,w:6})+fade(gp,label('+6',x+L/2,y-14,{size:22,color:C.F,anchor:'middle'}));}
  {const x=mix(BX+BW/2-10,HX+6*sc,gf),y=mix(FL-14,HY+26,gf),L=mix(50,2*sc,gf);s+=arrow(x,y,x-L,y,{color:C.F,w:6,head:14})+fade(gf,label('−2',x+14,y+8,{size:22,color:C.F}));}
  const gr=stage===2?seg(p,.6,.85):1;
  s+=arrow(HX,HY+70,HX+4*sc,HY+70,{color:C.hi,w:8,g:gr});
  s+=fade(gr,tex('6-2=4',HX+290,HY+30,{size:34})+label('合力 4 N',HX+4*sc+16,HY+78,{size:24,color:C.hi}));
 }
 if(stage===3){
  const steps=['① 囲む','② 外からの力だけ描く','③ 縦と横に分けて足す'];
  const xs=[60,250,580];
  steps.forEach((t,i)=>{const g=seg(p,.05+i*.22,.25+i*.22);s+=fade(g,label(t,xs[i],50,{size:28,color:C.hi,weight:700}));
   if(i)s+=fade(g,label('→',xs[i]-36,50,{size:28,color:C.dim}));});
 }
 return s;
}

// ---------------------------------------------------------------------------------
// 3) 成分の運動方程式 (um-newton-components): そり 2 kg、10 N・30°、g ≈ 10
// ---------------------------------------------------------------------------------
const OX=760,OY=240,KF=13,TH=Math.PI/6; // force plane origin, px per N
const TX=OX+10*KF*Math.cos(TH),TYp=OY-10*KF*Math.sin(TH);
function sledScene(g=1){
 const y=330;
 return fade(g,rect(40,y,540,16,{fill:'#9fd8ff',fo:.12,rx:3,sw:0})+line(40,y,580,y,{color:'#9fd8ff',w:3})+label('氷（摩擦なし）',570,y+50,{size:22,color:C.dim,anchor:'end'})
  +rect(120,y-52,170,36,{fill:C.x,fo:.3,rx:8})+draw([[110,y-6],[300,y-6],[318,y-24]],1,{color:C.dim,w:4})+label('2 kg',205,y-26,{size:22,color:C.ink,anchor:'middle'})
  +line(290,y-34,290+230*Math.cos(TH),y-34-230*Math.sin(TH),{color:'#c9a27a',w:3})
  +label('ひも',290+240*Math.cos(TH),y-34-240*Math.sin(TH)-6,{size:22,color:C.dim}));
}
function plane(g=1){
 return fade(g,arrow(610,OY,1170,OY,{color:C.dim,w:2.5,head:14})+arrow(OX,508,OX,20,{color:C.dim,w:2.5,head:14})
  +tex('x',1180,OY+8,{size:30,anchor:'start'})+tex('y',OX+14,34,{size:30,anchor:'start',auto:false,color:C.ink}));
}
function tension(g=1,from=[OX,OY]){return arrow(from[0],from[1],from[0]+10*KF*Math.cos(TH),from[1]-10*KF*Math.sin(TH),{color:C.F,w:6,g})+fade(g,label('10 N',from[0]+10*KF*Math.cos(TH)+10,from[1]-10*KF*Math.sin(TH)-6,{size:24,color:C.F}));}
function shadowX(g){return fade(g,line(TX,TYp,TX,OY,{color:C.hi,w:2,dash:'5 6'}))+line(OX,OY,mix(OX,TX,g),OY,{color:C.F,w:10,cap:'butt',opacity:.8})+fade(seg(g,.6,1),tex('F_x\\approx8.66',OX+12,OY+44,{size:28,anchor:'start'}));}
function shadowY(g){return fade(g,line(TX,TYp,OX,TYp,{color:C.hi,w:2,dash:'5 6'}))+line(OX,OY,OX,mix(OY,TYp,g),{color:C.F,w:10,cap:'butt',opacity:.8})+fade(seg(g,.6,1),tex('F_y=5',OX-14,(OY+TYp)/2+10,{size:28,anchor:'end',auto:false,color:C.F}));}
Object.assign(newtonbDiagrams,{
 'nb-sl:scene':(p)=>{
  const g=seg(p,.35,.7),y=330-34;
  return sledScene(seg(p,0,.25))+arrow(290,y,290+10*KF*Math.cos(TH),y-10*KF*Math.sin(TH),{color:C.F,w:6,g})
   +fade(g,label('10 N',290+10*KF*Math.cos(TH)+14,y-10*KF*Math.sin(TH)-4,{size:24,color:C.F}))
   +fade(seg(p,.6,.9),draw(Array.from({length:13},(_,i)=>{const a=-TH*i/12;return [290+60*Math.cos(a),y+60*Math.sin(a)];}),1,{color:C.t,w:3})+line(290,y,380,y,{color:C.faint,w:2,dash:'4 5'})+label('30°',360,y-14,{size:24,color:C.t}))
   +fade(seg(p,.75,1),label('10 N のうち、',900,200,{size:30,color:C.ink,anchor:'middle'})+label('横へ効くのはどれだけ？',900,250,{size:30,color:C.hi,anchor:'middle',weight:700}));
 },
 'nb-sl:x':(p)=>{
  const u=seg(p,.1,.4);
  return sledScene()+plane(seg(p,0,.2))+tension(1,[mix(290,OX,u),mix(296,OY,u)])
   +fade(seg(p,.4,.55),arrow(TX,TYp-110,TX,TYp-40,{color:C.hi,w:3,head:12})+label('光',TX+14,TYp-80,{size:22,color:C.hi}))
   +shadowX(seg(p,.5,.85))+fade(seg(p,.85,1),tex('10\\cos30^\\circ',OX+12,OY+90,{size:28,auto:false,color:C.dim,anchor:'start'}));
 },
 'nb-sl:y':(p)=>sledScene()+plane()+tension()+shadowX(1)+tex('10\\cos30^\\circ',OX+12,OY+90,{size:28,auto:false,color:C.dim,anchor:'start'})
   +fade(seg(p,.05,.25),arrow(TX+170,TYp,TX+90,TYp,{color:C.hi,w:3,head:12})+label('光',TX+120,TYp-18,{size:22,color:C.hi}))
   +shadowY(seg(p,.2,.55))+fade(seg(p,.55,.75),tex('10\\sin30^\\circ',OX-14,TYp-30,{size:28,anchor:'end',auto:false,color:C.dim}))
   +fade(seg(p,.75,1),label('矢印 1 本 → 数が 2 つ',1170,470,{size:28,color:C.hi,anchor:'end',weight:700})),
 'nb-sl2:grav':(p)=>sl2(p,1),'nb-sl2:normal':(p)=>sl2(p,2),
 'nb-sl3:clock':(p)=>sl3(p),
 'nb-sl3:ball':(p)=>ball(p,1),'nb-sl3:land':(p)=>ball(p,2),
});
function table(){
 return rect(40,50,250,420,{fill:C.x,fo:.05,stroke:C.x,rx:12})+rect(310,50,250,420,{fill:C.x,fo:.05,stroke:C.dim,rx:12})
  +label('x の式（横）',165,95,{size:26,color:C.x,anchor:'middle'})+label('y の式（縦）',435,95,{size:26,color:C.ink,anchor:'middle'});
}
function sl2(p,stage){
 let s=table()+plane()+tension(.999)+shadowX(1)+shadowY(1);
 const fly=(g,x0,y0,x1,y1,svg)=>move2(mix(x0,x1,g),mix(y0,y1,g),svg);
 // entries already known from scene 1
 s+=tex('+8.66',165,160,{size:32,auto:false,color:C.F})+tex('+5',435,160,{size:32,auto:false,color:C.F})+label('ひも',100,168,{size:22,color:C.dim,anchor:'end'});
 const gg=stage===1?seg(p,.05,.35):1;
 s+=arrow(OX+6,OY,OX+6,OY+20*KF,{color:C.F,w:6,g:gg})+fade(gg,label('重力 20 N',OX+20,OY+20*KF-10,{size:24,color:C.F}));
 const g0=stage===1?seg(p,.35,.6):1;
 s+=fade(g0,ringDot(OX,OY)+label('x への影 0',OX-30,OY+80,{size:24,color:C.hi,anchor:'end'}));
 const gx=stage===1?seg(p,.6,.85):1;
 s+=fade(gx,tex('+0',165,220,{size:32,auto:false,color:C.dim})+tex('-20',435,220,{size:32,auto:false,color:C.F}));
 if(stage===1)s+=fade(seg(p,.85,1),label('横の式には入らない',165,420,{size:24,color:C.hi,anchor:'middle'}));
 if(stage===2){
  const gn=seg(p,.05,.4);
  s+=arrow(OX-6,OY,OX-6,OY-15*KF,{color:C.F,w:6,g:gn})+fade(gn,label('垂直抗力 15 N',OX-20,OY-15*KF+4,{size:24,color:C.F,anchor:'end'}));
  s+=fade(seg(p,.35,.6),tex('+15',435,280,{size:32,auto:false,color:C.F}));
  s+=fade(seg(p,.55,.8),line(340,315,530,315,{color:C.dim,w:2})+tex('=0',435,365,{size:34,auto:false,color:C.ink})+tex('=8.66',165,365,{size:34,auto:false,color:C.ink}));
  s+=fade(seg(p,.8,1),label('浮きも沈みもしない',435,430,{size:22,color:C.hi,anchor:'middle'})+label('横にだけ残る',165,430,{size:22,color:C.hi,anchor:'middle'}));
 }
 return s;
}
function move2(x,y,svg){return `<g transform="translate(${n2(x)} ${n2(y)})">${svg}</g>`;}
function ringDot(x,y){return dot(x,y,9,C.hi)+`<circle cx="${x}" cy="${y}" r="20" fill="none" stroke="${C.hi}" stroke-width="3"/>`;}
function sl3(p){
 // The sled moves; one clock drives its x shadow and its (constant) y shadow.
 const t=2*lin(p,.05,.95),ax=4.33,xm=.5*ax*t*t,sc=48,x0=150,gy=330,X=x0+xm*sc;
 let s=rect(60,gy,1100,14,{fill:'#9fd8ff',fo:.12,rx:3,sw:0})+line(60,gy,1160,gy,{color:'#9fd8ff',w:3});
 s+=rect(X-80,gy-52,160,36,{fill:C.x,fo:.3,rx:8})+draw([[X-90,gy-6],[X+90,gy-6],[X+108,gy-24]],1,{color:C.dim,w:4});
 s+=arrow(X+90,gy-34,X+90+10*KF*Math.cos(TH),gy-34-10*KF*Math.sin(TH),{color:C.F,w:5});
 // shadows on axes
 const ay=430;s+=arrow(60,ay,1160,ay,{color:C.dim,w:2.5,head:14})+tex('x',1170,ay+8,{size:28,anchor:'start'})+line(X,gy+14,X,ay,{color:C.x,w:1.5,dash:'5 6'})+dot(X,ay,10,C.x);
 s+=label('x の影',X,ay+40,{size:22,color:C.x,anchor:'middle'});
 s+=line(60,gy-160,60,gy+10,{color:C.dim,w:2.5})+dot(60,gy-24,10,C.ink)+label('y の影は 0 のまま',80,gy-150,{size:22,color:C.dim});
 // shared clock and the two equations
 s+=rect(760,40,400,160,{fill:C.t,fo:.06,stroke:C.t,rx:14});
 s+=tex(`t=${fmt(t,1)}\\ \\mathrm{s}`,960,80,{size:34});
 s+=fade(seg(p,.1,.3),tex('2\\,a_x=8.66',870,160,{size:30})+tex('2\\,a_y=0',1070,160,{size:30}));
 s+=fade(seg(p,.35,.6),label('同じ m ＝ 2 kg、同じ時計 t',960,245,{size:26,color:C.hi,anchor:'middle'}));
 return s+fade(seg(p,.7,.9),label('そりは 1 台',X,gy-80,{size:24,color:C.ink,anchor:'middle'}));
}
function ball(p,stage){
 // Ball: 6 m/s sideways, 10 m/s up, g ≈ 10. Lands at t = 2 s, x = 12 m.
 const ox=120,oy=430,sc=44,T=2,t=stage===1?T*lin(p,.05,.85):T;
 const X=u=>ox+6*u*sc,Y=u=>oy-(10*u-5*u*u)*sc;
 let s=line(60,oy,720,oy,{color:C.dim,w:3})+line(ox,oy+10,ox,oy-250,{color:C.dim,w:2.5})+tex('x',730,oy+8,{size:28,anchor:'start'})+tex('y',ox,oy-266,{size:28,auto:false,color:C.ink});
 s+=draw(Array.from({length:81},(_,i)=>{const u=T*i/80;return [X(u),Y(u)];}),1,{color:C.faint,w:2,dash:'4 8'});
 s+=draw(Array.from({length:81},(_,i)=>{const u=t*i/80;return [X(u),Y(u)];}),1,{color:C.x,w:4});
 s+=line(X(t),Y(t),X(t),oy,{color:C.x,w:1.5,dash:'5 6'})+line(X(t),Y(t),ox,Y(t),{color:C.dim,w:1.5,dash:'5 6'})+dot(X(t),oy,9,C.x)+dot(ox,Y(t),9,C.ink)+dot(X(t),Y(t),13,C.hi);
 // shared clock and equations
 s+=rect(780,40,380,110,{fill:C.t,fo:.06,stroke:C.t,rx:14})+label('共通の時計',970,80,{size:22,color:C.t,anchor:'middle'})+tex(`t=${fmt(t,2)}`,970,125,{size:34});
 s+=label('縦の式',800,210,{size:24,color:C.dim})+tex('y=10t-5t^2',1000,210,{size:32});
 s+=label('横の式',800,290,{size:24,color:C.dim})+tex('x=6t',1000,290,{size:32});
 if(stage===1){
  s+=fade(seg(p,.85,1),tex('y=0\\ \\Rightarrow\\ t=2',1000,250,{size:28,color:C.hi,auto:false})+label('地面に戻る',X(T)+14,oy-40,{size:24,color:C.hi}));
 }
 if(stage===2){
  s+=tex('y=0\\ \\Rightarrow\\ t=2',1000,250,{size:28,color:C.hi,auto:false});
  const u=seg(p,.1,.45);
  s+=fade(u,tex('=6\\times2=12',1000,340,{size:32}));
  s+=arrow(1150,262,1150,318,{color:C.t,w:4,head:12,g:u})+fade(u,label('同じ t',1138,296,{size:22,color:C.t,anchor:'end'}));
  s+=fade(seg(p,.5,.75),label('12 m 先',X(T),oy+40,{size:26,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.95),label('同じ時計が、二本の式をつなぐ',970,440,{size:26,color:C.hi,anchor:'middle',weight:700}));
 }
 return s;
}

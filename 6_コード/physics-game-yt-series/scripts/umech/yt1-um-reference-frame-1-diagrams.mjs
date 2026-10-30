// YouTube シリーズ 慣性力と軌道・中級 1/3（ステージ um-reference-frame 本0〜本2＋例題）— 図。Stage 1200×515.
// 色：x・X 水色、x′（電車の目盛り）黄、v・V・v′ 紫、a・A・a′ 赤、F 緑（慣性力は緑の破線＝相互作用ではない）、t 金。
// 右向きを正。画面上の地面の座標 m は GX(m−S)。電車の車体は地面の [X−4.5, X+2.5] m、車内の目盛りは −4〜2。
import {C,clamp,mix,seg,fmt,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth} from './anim.mjs';

const K='um-reference-frame-1:';
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
const col=(c,s)=>`{\\color{${c}}${s}}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const BOX='#d9a066';
const GX=m=>440+72*m;
const mm=v=>v<0?`−${fmt(-v,0)}`:fmt(v,0);
const xp=col(C.hi,"x'"),xg=col(C.x,'x'),XX=col(C.x,'X'),ap=col(C.a,"a'"),aa=col(C.a,'a'),AA=col(C.a,'A'),FF=col(C.F,'F'),tt=col(C.t,'t');
const vp=col(C.v,"v'"),vv=col(C.v,'v'),VV=col(C.v,'V');

function dashArrow(x,y,X,Y,{color=C.F,w=5,g=1,head=18}={}){
 if(g<=0)return '';const XX=mix(x,X,g),YY=mix(y,Y,g),L=Math.hypot(XX-x,YY-y);if(L<2)return '';
 const a=Math.atan2(YY-y,XX-x),h=Math.min(head,L*.6),bx=XX-h*Math.cos(a),by=YY-h*Math.sin(a);
 return line(x,y,bx,by,{color,w,dash:'10 8',cap:'butt'})+`<polygon points="${XX},${YY} ${bx+h*.5*Math.sin(a)},${by-h*.5*Math.cos(a)} ${bx-h*.5*Math.sin(a)},${by+h*.5*Math.cos(a)}" fill="none" stroke="${color}" stroke-width="3"/>`;
}
function person(x,yf,h=70,{color=C.hi}={}){
 const hy=yf-h+10;
 return ring(x,hy,h*.12,{color,w:3,fill:C.bg})+line(x,hy+h*.12,x,yf-h*.32,{color,w:4})+line(x,yf-h*.32,x-h*.14,yf,{color,w:4})+line(x,yf-h*.32,x+h*.14,yf,{color,w:4})
  +line(x,yf-h*.55,x-h*.2,yf-h*.37,{color,w:3.5})+line(x,yf-h*.55,x+h*.2,yf-h*.37,{color,w:3.5});
}
// side view: rail, ground scale, car, car scale, box
function strip({y=300,bodyH=140,X=0,S=0,box=1,boxX=2.5,gScale=1,carScale=1,car=1,obs='',A=0,Atext='A',small=false,mark0=0,boxText='',gmin=-4,gmax=9}={}){
 let s='';const ry=y+44;
 s+=line(10,ry,1190,ry,{color:C.faint,w:3});
 for(let m=-8;m<=16;m+=.5){const x=GX(m-S);if(x>10&&x<1190)s+=line(x,ry,x-8,ry+10,{color:C.faint,w:2});}
 if(gScale){let g='';for(let m=gmin;m<=gmax;m++){const x=GX(m-S);if(x<40||x>1160)continue;g+=line(x,ry+12,x,ry+22,{color:C.x,w:2.5})+label(mm(m),x,ry+46,{size:22,color:C.x,anchor:'middle'});}
  s+=fade(gScale,g);}
 if(obs==='ground'){const x=GX(-5.3-S);if(x>-30)s+=person(x,ry,small?56:70,{color:C.dim});}
 if(car){const xL=GX(X-S-4.5),xR=GX(X-S+2.5);
  s+=fade(car,rect(xL,y-bodyH,xR-xL,bodyH,{fill:'#141d33',fo:1,stroke:C.dim,sw:3,rx:10})
   +(small?'':[0,1,2,3].map(i=>rect(xL+24+i*120,y-bodyH+14,86,bodyH*.17,{fill:'#22335a',fo:.8,stroke:'#2e4270',sw:1.5,rx:6})).join(''))
   +rect(xL,y,xR-xL,26,{fill:'#24324f',fo:1,stroke:'none',rx:3})
   +[-3.5,-2.5,.5,1.5].map(k=>ring(GX(X-S+k),y+34,8,{color:C.dim,w:3,fill:C.bg})).join(''));
  if(carScale){let g='';for(let k=-4;k<=2;k++){const x=GX(X-S+k);g+=line(x,y,x,y+8,{color:C.hi,w:2.5})+label(mm(k),x,y+26,{size:22,color:C.hi,anchor:'middle'});}
   s+=fade(carScale*car,g);}
  if(mark0){const x=GX(X-S);s+=fade(mark0,`<polygon points="${x},${y-2} ${x-9},${y-16} ${x+9},${y-16}" fill="${C.hi}"/>`);}
  if(obs==='car')s+=person(GX(X-S-3.4),y,small?Math.min(56,bodyH-14):70,{color:C.hi});
  if(A){const cx=(xL+xR)/2,ay=y-bodyH-22;s+=fade(A,arrow(cx-60,ay,cx+60,ay,{color:C.a,w:6,head:18})+label(Atext,cx+76,ay+8,{size:24,color:C.a,weight:700}));}
 }
 if(box){const bw=small?40:52,bh=small?32:44,bx=GX(boxX-S);s+=rect(bx-bw/2,y-bh,bw,bh,{fill:BOX,fo:.5,stroke:BOX,sw:2.5,rx:5});
  if(boxText)s+=label(boxText,bx,y-bh/2+8,{size:22,color:C.ink,anchor:'middle'});}
 return s;
}
const tLabel=(t,x=20,y=40)=>label(`t ＝ ${t.toFixed(1)} s`,x,y,{size:28,color:C.t,weight:700});
// arrows under the rail: X, x′, x
function spans({X=1,bx=2.5,y=300,gX=1,gP=1,gx=1}={}){
 const ry=y+44;let s='';
 s+=fade(gX,arrow(GX(0),ry+76,GX(X),ry+76,{color:C.x,w:5,head:14})+label('X',(GX(0)+GX(X))/2,ry+108,{size:28,color:C.x,anchor:'middle',weight:700}));
 s+=fade(gP,arrow(GX(X),ry+76,GX(bx),ry+76,{color:C.hi,w:5,head:14})+label('x′',(GX(X)+GX(bx))/2,ry+108,{size:28,color:C.hi,anchor:'middle',weight:700}));
 s+=fade(gx,arrow(GX(0),ry+136,GX(bx),ry+136,{color:C.x,w:5,head:14})+label('x',GX(bx)+16,ry+144,{size:28,color:C.x,weight:700}));
 s+=fade(Math.max(gX,gx),line(GX(0),ry+60,GX(0),ry+150,{color:C.x,w:2,dash:'5 5'}));
 s+=fade(Math.max(gP,gx),line(GX(bx),y-10,GX(bx),ry+150,{color:C.dim,w:2,dash:'5 5'}));
 return s;
}
// forces on a box (big) — for the two-panel scene
function boxForces(cx,cy,{inertial=0,aTxt='',aDir=0,aColor=C.a,real=1,cross=0}={}){
 let s=rect(cx-150,cy+55,300,20,{fill:'#24324f',fo:1,stroke:'none'});
 s+=rect(cx-55,cy-55,110,110,{fill:BOX,fo:.5,stroke:BOX,sw:3,rx:8})+label('3 kg',cx,cy+9,{size:24,color:C.ink,anchor:'middle'});
 s+=fade(real*.9,arrow(cx+12,cy+55,cx+12,cy+130,{color:C.F,w:6,head:18})+arrow(cx-12,cy-55,cx-12,cy-150,{color:C.F,w:6,head:18}));
 s+=fade(real,label('重力',cx+26,cy+128,{size:22,color:C.F})+label('床の力',cx+4,cy-130,{size:22,color:C.F}));
 if(inertial)s+=fade(inertial,dashArrow(cx-60,cy+20,cx-170,cy+20,{})+label('慣性力 −mA',cx-60,cy+62,{size:22,color:C.F,anchor:'end',weight:700}));
 if(aTxt&&aDir)s+=arrow(cx+aDir*60,cy-80,cx+aDir*150,cy-80,{color:aColor,w:5,head:14})+label(aTxt,cx+aDir*160,cy-72,{size:24,color:aColor,anchor:aDir<0?'end':'start',weight:700});
 if(aTxt&&!aDir)s+=label(aTxt,cx+70,cy-72,{size:24,color:aColor,weight:700});
 if(cross)s+=fade(cross,line(cx-190,cy-70,cx+190,cy+80,{color:C.a,w:5})+line(cx-190,cy+80,cx+190,cy-70,{color:C.a,w:5}));
 return s;
}
function panel(x0,title,colr,inner){return rect(x0,20,560,470,{fill:'#131f38',fo:.96,stroke:colr,sw:2,rx:14})+label(title,x0+280,62,{size:28,color:colr,anchor:'middle',weight:700})+inner;}
// hanging strap
function strap(cx,top,{L=230,th=11.5,forces=0,frame='ground',g=1}={}){
 const r=th*Math.PI/180,hx=cx-L*Math.sin(r),hy=top+L*Math.cos(r);
 let s=line(cx-120,top,cx+120,top,{color:C.dim,w:5})+dot(cx,top,6,C.dim);
 s+=line(cx,top,hx,hy,{color:C.ink,w:3})+ring(hx,hy+22,22,{color:C.ink,w:5});
 s+=line(cx,top,cx,top+L+60,{color:C.faint,w:2,dash:'6 6'});
 if(forces){const hy2=hy+22,mg=200,ma=mg*Math.tan(r);
  s+=fade(g,arrow(hx,hy2,hx,hy2+mg*.8,{color:C.F,w:5,head:14})+label('重力',hx+12,hy2+mg*.8,{size:22,color:C.F}));
  s+=fade(g,arrow(hx,hy2,hx+ma*.8,hy2-mg*.8,{color:C.F,w:5,head:14})+label('ひもの力',hx-14,hy2-mg*.55,{size:22,color:C.F,anchor:'end'}));
  if(frame==='ground')s+=fade(forces,arrow(hx+40,hy2+20,hx+40+ma*1.6,hy2+20,{color:C.a,w:5,head:12})+label('合力 mA（右）',hx+100,hy2+60,{size:22,color:C.a}));
  else s+=fade(forces,dashArrow(hx-30,hy2+20,hx-30-ma*1.6,hy2+20,{head:12})+label('慣性力（左）',hx-40,hy2+60,{size:22,color:C.F,anchor:'end',weight:700}));
 }
 return s;
}

export const ytReferenceFrameM1Diagrams={
 [K+'recap']:(p)=>{
  const cx=330,cy=250,R=130,gy=cy+R;
  let s=line(40,gy,640,gy,{color:C.dim,w:3});for(let q=40;q<640;q+=26)s+=line(q,gy+2,q-14,gy+18,{color:C.faint,w:2});
  s+=ring(cx,cy,R,{color:C.dim,w:4})+dot(cx,cy,6,C.dim);
  const ph=p*2;for(let k=0;k<6;k++){const a=ph+k*Math.PI/3;s+=line(cx,cy,cx+R*Math.cos(a),cy+R*Math.sin(a),{color:C.faint,w:2});}
  s+=arrow(cx,cy,cx+110,cy,{color:C.v,w:6})+label('v',cx+118,cy-10,{size:28,color:C.v,weight:700});
  s+=fade(seg(p,.15,.35),arrow(cx,gy-8,cx+110,gy-8,{color:C.v,w:6,head:16})+label('v',cx+110,gy-24,{size:26,color:C.v}));
  s+=fade(seg(p,.3,.5),arrow(cx,gy-8,cx-110,gy-8,{color:C.v,w:6,head:16})+label('Rω',cx-110,gy-24,{size:26,color:C.v,anchor:'end'}));
  s+=fade(seg(p,.2,.4),dot(cx,gy,9,C.hi)+label('接地点',cx,gy+50,{size:24,color:C.hi,anchor:'middle'}));
  s+=card(700,120,460,230,label('前回：転がる車輪',930,170,{size:26,color:C.dim,anchor:'middle'})
   +label('接地点の速度',930,230,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.6,.78),T(`${vv}-R${col(C.p,'\\omega')}=0`,930,305,{size:44})),seg(p,.05,.2));
  return s;
 },
 [K+'lastq']:(p)=>{
  let s='';
  s+=fade(seg(p,.05,.3),rect(90,170,330,120,{fill:'#141d33',fo:1,stroke:C.dim,sw:3,rx:10})+ring(140,300,10,{color:C.dim,w:3})+ring(370,300,10,{color:C.dim,w:3})+line(40,312,470,312,{color:C.faint,w:3})
   +arrow(195,145,315,145,{color:C.a,w:6})+label('加速する電車',255,370,{size:28,color:C.ink,anchor:'middle'})+person(330,290,80,{color:C.hi}));
  const ph=p*3;
  s+=fade(seg(p,.25,.5),`<ellipse cx="760" cy="250" rx="170" ry="60" fill="#141d33" stroke="${C.dim}" stroke-width="3"/>`+line(760,250,760+150*Math.cos(ph),250+52*Math.sin(ph),{color:C.faint,w:3})
   +person(760+110*Math.cos(ph+1.2),250+38*Math.sin(ph+1.2),80,{color:C.hi})+label('回る台',760,370,{size:28,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.6,.8),label('乗った観測者の 運動方程式は？',520,460,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'recap2']:(p)=>{
  let s=strip({y:170,bodyH:90,X:4,boxX:0,small:true,mark0:1,carScale:1,A:1,Atext:'2 m/s²',obs:''});
  s+=label('初級',20,40,{size:26,color:C.dim});
  const xs=[260,480,700],hd=['t [s]','X [m]','x′ [m]'],hc=[C.t,C.x,C.hi],data=[[0,0,0],[1,1,-1],[2,4,-4]];
  let tb=rect(150,290,660,210,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:12});
  hd.forEach((h,i)=>tb+=label(h,xs[i],325,{size:24,color:hc[i],anchor:'middle',weight:700}));
  tb+=line(160,340,800,340,{color:C.faint,w:2});
  data.forEach((r,j)=>r.forEach((v,i)=>tb+=label(mm(v),xs[i],380+j*42,{size:28,color:hc[i],anchor:'middle'})));
  s+=fade(seg(p,.1,.3),tb);
  s+=card(850,300,320,190,label('電車から見た 加速度',1010,345,{size:24,color:C.dim,anchor:'middle'})
   +T(`${ap}=-2\\,\\mathrm{m/s^2}`,1010,425,{size:40}),seg(p,.5,.7),C.a);
  return s;
 },
 [K+'recap3']:(p)=>{
  let s=boxForces(300,280,{inertial:seg(p,.2,.45),real:.6});
  s+=card(620,90,540,330,label('初級：電車の中の式',890,140,{size:26,color:C.dim,anchor:'middle'})
   +T(`m${ap}=${FF}+(-m${AA})`,890,225,{size:46})
   +fade(seg(p,.35,.55),label('慣性力 −mA は',890,305,{size:28,color:C.F,anchor:'middle'})+label('決めて足した項',890,355,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.02,.15));
  return s;
 },
 [K+'ask']:(p)=>{
  let s=card(160,60,880,400,label('今回の問い',600,120,{size:28,color:C.dim,anchor:'middle'})
   +T(`-m${AA}`,600,215,{size:64})+label('は どこから 出てくる？',600,300,{size:34,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.45,.65),label('どんな加速にも使える形で',600,370,{size:26,color:C.ink,anchor:'middle'})+T(`m${aa}=${FF}`,600,425,{size:36})+label('から 導く',720,432,{size:26,color:C.ink})),seg(p,0,.12),C.hi);
  return s;
 },
 [K+'setup']:(p)=>{
  let s=strip({car:0,box:1,boxX:2.5,gScale:1,obs:'ground'});
  s+=fade(seg(p,.1,.3),arrow(GX(-.5),110,GX(1.5),110,{color:C.dim,w:4})+label('＋（右向きが正）',GX(1.5)+14,118,{size:24,color:C.dim}));
  s+=fade(seg(p,.35,.55),label('地面の目盛り（慣性系）',GX(-4),430,{size:24,color:C.x}));
  s+=fade(seg(p,.55,.75),spans({X:0,bx:2.5,gX:0,gP:0,gx:1}));
  return s;
 },
 [K+'setupX']:(p)=>{
  const X=seg(p,.35,.85);
  let s=strip({X,box:1,boxX:2.5,car:seg(p,.02,.2),carScale:seg(p,.1,.3),mark0:seg(p,.2,.35),obs:'ground'});
  s+=fade(seg(p,.2,.35),label('電車の目盛り',GX(X-2),92,{size:24,color:C.hi,anchor:'middle'}));
  s+=spans({X:Math.max(X,.001),bx:2.5,gX:seg(p,.3,.45),gP:0,gx:0});
  s+=card(930,40,250,110,T(`${XX}(${tt})`,1055,110,{size:44}),seg(p,.6,.75));
  return s;
 },
 [K+'prime']:(p)=>{
  let s=strip({X:1,box:1,boxX:2.5,y:250,bodyH:120,obs:'ground',mark0:1});
  s+=spans({X:1,bx:2.5,y:250,gX:.35,gP:seg(p,.05,.25),gx:0});
  s+=card(770,20,410,200,T(`${xp}`,975,85,{size:48})
   +label('′：別の目盛りで 読んだ印',975,150,{size:24,color:C.ink,anchor:'middle'})
   +fade(seg(p,.5,.7),label('時間の微分 ではない',975,195,{size:26,color:C.a,anchor:'middle',weight:700})),seg(p,.25,.45),C.hi);
  return s;
 },
 [K+'relation']:(p)=>{
  let s=strip({X:1,box:1,boxX:2.5,y:230,bodyH:110,obs:'ground',mark0:1});
  s+=spans({X:1,bx:2.5,y:230,gX:seg(p,.05,.25),gP:seg(p,.3,.5),gx:seg(p,.6,.8)});
  return s;
 },
 [K+'relation2']:(p)=>{
  let s=strip({X:1,box:1,boxX:2.5,y:230,bodyH:110,obs:'ground',mark0:1,gmax:6});
  s+=spans({X:1,bx:2.5,y:230});
  s+=card(790,20,390,250,T(`${xg}=${XX}+${xp}`,985,80,{size:44})
   +fade(seg(p,.3,.5),T(`${xp}=${xg}-${XX}`,985,160,{size:48})+highlight(855,118,260,66,1,C.hi))
   +fade(seg(p,.6,.8),T(`1.5=2.5-1`,985,235,{size:34,color:C.dim})),seg(p,.02,.15),C.hi);
  s+=fade(seg(p,.7,.9),label('二つの目盛りの 1 m と 時計 t は 共通とする',1180,500,{size:22,color:C.dim,anchor:'end'}));
  return s;
 },
 [K+'assume']:(p)=>{
  let s=card(80,70,500,370,label('二つの目盛り',330,125,{size:28,color:C.dim,anchor:'middle'})
   +line(130,205,530,205,{color:C.x,w:4})+[0,1,2,3,4].map(k=>line(130+k*100,195,130+k*100,215,{color:C.x,w:3})).join('')+label('地面',120,180,{size:22,color:C.x})
   +line(130,295,530,295,{color:C.hi,w:4})+[0,1,2,3,4].map(k=>line(130+k*100,285,130+k*100,305,{color:C.hi,w:3})).join('')+label('電車',120,270,{size:22,color:C.hi})
   +fade(seg(p,.1,.3),label('1 m の長さは 同じ',330,380,{size:28,color:C.ink,anchor:'middle',weight:700})),seg(p,0,.12));
  const cx=870,cy=220,r=90,a=p*6.28;
  s+=card(620,70,500,370,ring(cx,cy,r,{color:C.t,w:4})+line(cx,cy,cx+70*Math.sin(a),cy-70*Math.cos(a),{color:C.t,w:4})+dot(cx,cy,6,C.t)
   +label('時計 t も 共通',870,380,{size:28,color:C.t,anchor:'middle',weight:700}),seg(p,.3,.45));
  s+=fade(seg(p,.6,.8),label('光よりずっと遅い運動なら 十分',600,490,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'check1']:(p)=>{
  const t=2*seg(p,.05,.6),X=t*t;
  let s=strip({y:150,bodyH:80,X,boxX:0,small:true,mark0:1,obs:'ground',gmax:9});
  s+=tLabel(t,20,36);
  s+=card(120,270,960,230,
   T(`${XX}=${tt}^2,\\quad ${xg}=0`,600,325,{size:40})
   +fade(seg(p,.35,.55),T(`${xp}=0-${tt}^2=-${tt}^2`,600,395,{size:44}))
   +fade(seg(p,.65,.85),label('t ＝ 0, 1, 2 s で',400,465,{size:26,color:C.t,anchor:'middle'})+label('x′ ＝ 0, −1, −4 m',720,465,{size:28,color:C.hi,anchor:'middle',weight:700})+label('表と一致 ✓',960,465,{size:26,color:C.F,anchor:'middle'})),seg(p,.1,.25));
  return s;
 },
 [K+'d0']:(p)=>{
  let s=card(140,50,920,420,
   T(`${xp}(${tt})=${xg}(${tt})-${XX}(${tt})`,600,140,{size:50})
   +fade(seg(p,.1,.3),label('どの時刻 t でも 成り立つ',600,220,{size:28,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.35,.55),label('→ 両辺を t で 微分できる',600,290,{size:28,color:C.hi,anchor:'middle',weight:700}))
   +fade(seg(p,.65,.85),label('微分の法則：',380,390,{size:26,color:C.dim,anchor:'middle'})+T(`(f-g)'=f'-g'`,700,385,{size:36})+label('差の微分は 微分の差',700,440,{size:24,color:C.dim,anchor:'middle'})),seg(p,0,.1));
  return s;
 },
 [K+'d1']:(p)=>chain(p,1),
 [K+'d2']:(p)=>chain(p,2),
 [K+'check2']:(p)=>{
  let s=card(140,50,920,420,
   label('初級の数',600,105,{size:26,color:C.dim,anchor:'middle'})
   +T(`${xp}=-${tt}^2`,600,175,{size:48})
   +fade(seg(p,.15,.35),label('1回微分',320,262,{size:24,color:C.dim,anchor:'middle'})+T(`${vp}=-2${tt}`,600,255,{size:44}))
   +fade(seg(p,.4,.6),label('もう1回',320,342,{size:24,color:C.dim,anchor:'middle'})+T(`${ap}=-2\\,\\mathrm{m/s^2}`,600,335,{size:44}))
   +fade(seg(p,.7,.85),label('表から求めた値と 一致 ✓',600,430,{size:30,color:C.F,anchor:'middle',weight:700})),seg(p,0,.1));
  return s;
 },
 [K+'general']:(p)=>{
  let s=card(60,50,560,420,label('X(t) の形は 自由',340,100,{size:26,color:C.dim,anchor:'middle'}),seg(p,0,.1));
  const pts=Array.from({length:61},(_,i)=>{const u=i/60;return [110+460*u,420-300*(u*u*.6+.25*Math.sin(u*7)*u)];});
  s+=fade(seg(p,0,.1),line(100,420,590,420,{color:C.dim,w:2})+line(110,430,110,130,{color:C.dim,w:2})+label('t',590,450,{size:24,color:C.t})+label('X',86,140,{size:24,color:C.x}));
  s+=draw(pts,seg(p,.05,.4),{color:C.x,w:4});
  s+=card(660,90,500,340,T(`${ap}(${tt})=${aa}(${tt})-${AA}(${tt})`,910,175,{size:40})
   +fade(seg(p,.4,.6),label('途中で X(t) の形を',910,265,{size:26,color:C.ink,anchor:'middle'})+label('一度も 使っていない',910,305,{size:26,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.65,.85),label('その瞬間の A を引く',910,380,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.25,.4),C.hi);
  return s;
 },
 [K+'uniform']:(p)=>{
  const X=-1+2.5*p;
  let s=strip({y:250,bodyH:120,X,boxX:1,box:0,obs:'ground',mark0:1});
  s+=arrow(GX(X)-60,100,GX(X)+60,100,{color:C.v,w:6})+label('一定の速度 V',GX(X)+76,108,{size:24,color:C.v});
  s+=card(820,160,360,260,T(`${AA}=0`,1000,225,{size:44})
   +fade(seg(p,.2,.4),T(`${ap}=${aa}`,1000,305,{size:48}))
   +fade(seg(p,.5,.7),label('V によらない',1000,385,{size:26,color:C.ink,anchor:'middle'})),seg(p,.02,.15));
  return s;
 },
 [K+'law']:(p)=>{
  let s=boxForces(300,280,{real:1});
  s+=fade(seg(p,.02,.15),label('地面から見る',300,70,{size:26,color:C.x,anchor:'middle',weight:700}));
  s+=card(620,80,540,350,label('慣性系（地面の目盛り）',890,130,{size:26,color:C.x,anchor:'middle'})
   +T(`m${aa}=${FF}`,890,215,{size:60})
   +fade(seg(p,.3,.5),label('F：ほかの物体から受ける力の合計',890,295,{size:24,color:C.F,anchor:'middle'}))
   +fade(seg(p,.6,.8),label('実験に支えられた法則',890,370,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'sub']:(p)=>algebra(p,0),
 [K+'expand']:(p)=>algebra(p,1),
 [K+'result']:(p)=>algebra(p,2),
 [K+'name']:(p)=>{
  let s=card(120,40,960,440,
   T(`m${ap}=${FF}+(-m${AA})`,600,140,{size:60})
   +fade(seg(p,.05,.25),highlight(600+texWidth(`ma'=F+(-mA)`,60,false)/2-texWidth(`(-mA)`,60,false)-10,90,texWidth(`(-mA)`,60,false)+20,90,1,C.F)+label('慣性力',600+texWidth(`ma'=F+(-mA)`,60,false)/2-texWidth(`(-mA)`,60,false)/2,215,{size:30,color:C.F,anchor:'middle',weight:700}))
   +fade(seg(p,.35,.55),label('初級：決めて足した項',360,320,{size:28,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.5,.7),label('→',600,320,{size:34,color:C.ink,anchor:'middle'})+label('中級：導いた項',840,320,{size:30,color:C.hi,anchor:'middle',weight:700}))
   +fade(seg(p,.7,.88),label('x′＝x−X を 2回微分 → ma＝F に代入',600,410,{size:26,color:C.ink,anchor:'middle'})));
  return s;
 },
 [K+'notReal']:(p)=>{
  let s=card(50,50,530,420,label('実在の力',315,100,{size:30,color:C.F,anchor:'middle',weight:700})
   +arrow(150,160,280,160,{color:C.F,w:6})
   +label('重力 ← 地球',110,240,{size:28,color:C.ink})+label('床の力 ← 床',110,295,{size:28,color:C.ink})
   +label('相手がいる・反作用がある',315,390,{size:26,color:C.dim,anchor:'middle'}),seg(p,.02,.15),C.F);
  s+=card(620,50,530,420,label('慣性力 −mA',885,100,{size:30,color:C.F,anchor:'middle',weight:700})
   +dashArrow(960,160,830,160,{})
   +fade(seg(p,.2,.35),label('押す相手：なし',660,240,{size:28,color:C.ink})+label('反作用の相手：なし',660,295,{size:28,color:C.ink}))
   +fade(seg(p,.55,.75),label('出どころ：観測者の加速度 A',885,390,{size:28,color:C.a,anchor:'middle',weight:700})),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'ex']:(p)=>{
  let s=strip({y:280,bodyH:130,X:0,boxX:-1,A:seg(p,.05,.25),Atext:'A ＝ 2 m/s²',obs:'car',boxText:'3 kg',carScale:0,gScale:.4});
  s+=card(740,40,440,180,label('箱 3 kg',960,90,{size:28,color:BOX,anchor:'middle'})
   +fade(seg(p,.45,.6),label('床は なめらか',960,140,{size:26,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.65,.8),label('横向きの実在の力 F ＝ 0',960,190,{size:26,color:C.F,anchor:'middle',weight:700})),seg(p,.3,.45));
  return s;
 },
 [K+'ex2']:(p)=>{
  let s=boxForces(300,300,{inertial:seg(p,.02,.2),aTxt:"a′ ＝ −2",aDir:-1,real:.5});
  s+=label('電車から見る',300,60,{size:26,color:C.hi,anchor:'middle',weight:700});
  s+=card(620,50,540,420,T(`-m${AA}=-3\\times2=-6\\,\\mathrm{N}`,890,120,{size:40})
   +fade(seg(p,.2,.35),label('左向き',890,175,{size:26,color:C.F,anchor:'middle'}))
   +fade(seg(p,.4,.6),T(`3${ap}=0-6`,890,265,{size:44}))
   +fade(seg(p,.65,.85),T(`${ap}=-2\\,\\mathrm{m/s^2}`,890,360,{size:48})+highlight(735,318,310,72,1,C.a)),seg(p,0,.1));
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=boxForces(300,300,{inertial:1,real:.5});
  s+=fade(seg(p,.2,.4),arrow(180,260,240,260,{color:C.F,w:6,head:16})+label('手 3 N',175,245,{size:24,color:C.F,anchor:'end',weight:700}));
  s+=card(620,120,540,260,label('同じ電車（A ＝ 2 m/s²）',890,180,{size:26,color:C.dim,anchor:'middle'})
   +label('右へ 3 N 押し続ける',890,240,{size:30,color:C.F,anchor:'middle'})
   +label('車内から見た a′ は？',890,315,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.5),C.hi);
  return s;
 },
 [K+'quiz2']:(p)=>{
  let s=panel(30,'電車から見る',C.hi,
   T(`3${ap}=${col(C.F,'3')}-6`,310,170,{size:44})
   +fade(seg(p,.1,.3),T(`${ap}=-1\\,\\mathrm{m/s^2}`,310,270,{size:46})));
  s+=fade(seg(p,.35,.5),panel(610,'地面から見る',C.x,
   T(`${aa}=3\\div3=1`,890,170,{size:44})
   +fade(seg(p,.5,.65),T(`${aa}-${AA}=1-2=-1`,890,270,{size:44}))));
  s+=fade(seg(p,.75,.9),label('一致 ✓',890,400,{size:40,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'panels']:(p)=>twoPanels(p,0),
 [K+'panels2']:(p)=>twoPanels(p,1),
 [K+'mix']:(p)=>{
  let s=panel(30,'地面から見る',C.x,boxForces(310,300,{inertial:1,real:1,cross:seg(p,.4,.6)}));
  s+=card(640,120,520,280,label('地面の式に −mA を入れると',900,180,{size:26,color:C.ink,anchor:'middle'})
   +label('止まっているはずの箱が',900,250,{size:28,color:C.ink,anchor:'middle'})+label('左へ動き出す？',900,305,{size:32,color:C.a,anchor:'middle',weight:700})
   +fade(seg(p,.6,.8),label('✕ 混ぜない',900,370,{size:30,color:C.a,anchor:'middle',weight:700})),seg(p,.15,.3),C.a);
  return s;
 },
 [K+'strap']:(p)=>{
  let s=strip({y:450,bodyH:400,X:0,box:0,carScale:0,gScale:0,A:seg(p,.05,.2),Atext:'A',small:true});
  s+=strap(GX(-1),90,{L:220});
  s+=fade(seg(p,.3,.45),label('後ろ（左）へ 傾く',GX(-1)-60,370,{size:26,color:C.hi,anchor:'end'}));
  s+=card(740,120,440,220,label('なぜ？',960,180,{size:32,color:C.hi,anchor:'middle',weight:700})
   +label('地面から見ると？',960,240,{size:26,color:C.x,anchor:'middle'})+label('電車から見ると？',960,290,{size:26,color:C.hi,anchor:'middle'}),seg(p,.4,.6),C.hi);
  return s;
 },
 [K+'strap2']:(p)=>{
  let s=panel(30,'地面から見る',C.x,strap(310,110,{L:170,forces:seg(p,.4,.6),frame:'ground',g:seg(p,.1,.3)}));
  s+=fade(seg(p,.02,.15),arrow(470,90,550,90,{color:C.a,w:5,head:14})+label('A',560,98,{size:24,color:C.a,weight:700}));
  s+=card(640,140,520,230,label('吊り革も 右へ加速',900,200,{size:28,color:C.ink,anchor:'middle'})
   +label('ひもの力の 右向きの成分',900,260,{size:28,color:C.F,anchor:'middle'})+T(`=m${AA}`,900,325,{size:40}),seg(p,.55,.7));
  return s;
 },
 [K+'strap3']:(p)=>{
  let s=panel(30,'電車から見る',C.hi,strap(330,110,{L:170,forces:seg(p,.35,.55),frame:'car',g:1}));
  s+=card(640,140,520,230,label('吊り革は 止まっている',900,200,{size:28,color:C.ink,anchor:'middle'})
   +label('ひもの力 ＋ 重力 ＋ 慣性力',900,260,{size:28,color:C.F,anchor:'middle'})+label('＝ 0（つり合い）',900,320,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7));
  return s;
 },
 [K+'strap4']:(p)=>{
  const ox=180,oy=110,L=320,r=11.5*Math.PI/180,g=300,ma=g*Math.tan(r);
  let s=line(ox,oy,ox,oy+g,{color:C.F,w:4})+label('mg',ox-14,oy+g/2,{size:26,color:C.F,anchor:'end'});
  s+=line(ox,oy+g,ox+ma,oy+g,{color:C.a,w:4})+label('mA',ox+ma/2,oy+g+36,{size:26,color:C.a,anchor:'middle'});
  s+=line(ox,oy,ox+ma,oy+g,{color:C.ink,w:3,dash:'6 6'});
  s+=`<path d="M ${ox} ${oy+80} A 80 80 0 0 0 ${ox+80*Math.sin(r)} ${oy+80*Math.cos(r)}" fill="none" stroke="${C.E}" stroke-width="3"/>`+label('θ',ox+30,oy+118,{size:26,color:C.E});
  s+=label('（角を 実際の大きさで描いた図）',60,480,{size:22,color:C.dim});
  s+=card(460,60,700,400,T(`\\tan${col(C.E,'\\theta')}=\\dfrac{m${AA}}{mg}=\\dfrac{${AA}}{g}`,810,150,{size:46})
   +fade(seg(p,.3,.5),T(`=\\dfrac{2}{9.8}\\approx0.20`,810,265,{size:44}))
   +fade(seg(p,.6,.8),T(`${col(C.E,'\\theta')}\\approx11.5^\\circ`,810,370,{size:48})),seg(p,0,.12));
  return s;
 },
 [K+'sum1']:(p)=>summary(p,1),
 [K+'sum2']:(p)=>summary(p,2),
 [K+'next']:(p)=>{
  const ph=p*3,cx=330,cy=260;
  let s=`<ellipse cx="${cx}" cy="${cy}" rx="230" ry="90" fill="#141d33" stroke="${C.dim}" stroke-width="3"/>`+line(cx,cy,cx+210*Math.cos(ph),cy+80*Math.sin(ph),{color:C.faint,w:3});
  s+=person(cx+150*Math.cos(ph+1.2),cy+56*Math.sin(ph+1.2),90,{color:C.hi})+label('回る台',cx,cy+150,{size:28,color:C.ink,anchor:'middle'});
  s+=card(660,140,500,220,label('次の問い',910,190,{size:26,color:C.dim,anchor:'middle'})+label('回る台の上の観測者には',910,250,{size:28,color:C.ink,anchor:'middle'})
   +label('どんな慣性力が 現れる？',910,310,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.4),C.hi);
  return s;
 },
 [K+'next2']:(p)=>{
  const cx=300,cy=260,r=170,ph=-p*3;
  let s=ring(cx,cy,r,{color:C.faint,w:3,dash:'8 8'})+dot(cx,cy,6,C.dim);
  const bx=cx+r*Math.cos(ph),by=cy+r*Math.sin(ph);
  s+=arrow(bx,by,bx+110*Math.sin(ph),by-110*Math.cos(ph),{color:C.v,w:6})+dot(bx,by,14,C.hi);
  s+=arrow(bx,by,bx+(cx-bx)*.45,by+(cy-by)*.45,{color:C.a,w:6,g:seg(p,.1,.3)});
  s+=card(620,120,540,260,label('初級で 結果として使った',890,180,{size:26,color:C.dim,anchor:'middle'})
   +T(`${aa}=\\dfrac{${vv}^2}{${col(C.x,'r')}}`,890,265,{size:52})+label('は どこから？',890,345,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.4),C.hi);
  return s;
 },
};

function chain(p,k){
 let s=card(120,30,960,460,'',1);
 s+=T(`${xp}=${xg}-${XX}`,520,100,{size:48})+label('位置',220,108,{size:26,color:C.dim,anchor:'middle'});
 const g1=k===1?seg(p,.05,.25):1;
 s+=fade(g1,label('↓ t で微分',520,165,{size:24,color:C.dim,anchor:'middle'})
  +T(`${vp}=${vv}-${VV}`,520,230,{size:46})+label('速度',220,238,{size:26,color:C.dim,anchor:'middle'}));
 if(k===1)s+=fade(seg(p,.45,.65),label('V：電車の速度',760,238,{size:26,color:C.v}));
 if(k>=2){s+=label('V：電車の速度',760,238,{size:26,color:C.v});
  s+=fade(seg(p,.05,.25),label('↓ もう一度 微分',520,295,{size:24,color:C.dim,anchor:'middle'})
   +T(`${ap}=${aa}-${AA}`,520,370,{size:56})+label('加速度',220,378,{size:26,color:C.dim,anchor:'middle'})+highlight(380,322,280,90,1,C.a));
  s+=fade(seg(p,.4,.6),label('A：電車の加速度',690,378,{size:26,color:C.a})+T(`=\\dfrac{d^2${XX}}{d${tt}^2}`,960,372,{size:36}));
 }
 return s;
}
function algebra(p,k){
 let s=card(120,30,960,460,'',1);
 const Y=[110,215,320,420];
 // row 0: solve for a
 s+=T(`${ap}=${aa}-${AA}`,330,Y[0],{size:40})+label('→',600,Y[0]+8,{size:34,color:C.dim,anchor:'middle'})+T(`${aa}=${ap}+${AA}`,850,Y[0],{size:40});
 if(k===0){
  s+=fade(seg(p,.35,.55),T(`m(${col(C.hi,"a'+A")})=${FF}`,600,Y[1],{size:52}));
  s+=fade(seg(p,.3,.5),label('ma＝F の a に 代入',600,Y[1]+70,{size:26,color:C.hi,anchor:'middle'}));
  return s;
 }
 s+=T(`m(${ap}+${AA})=${FF}`,600,Y[1],{size:44});
 const g2=k===1?seg(p,.05,.25):1;
 s+=fade(g2,T(`m${ap}+m${AA}=${FF}`,600,Y[2],{size:44}));
 if(k===1){s+=fade(seg(p,.45,.65),label('両辺から mA を引く',900,Y[2]+70,{size:26,color:C.hi,anchor:'middle'})
   +T(`${col(C.hi,'-m')}${col(C.hi,'A')}`,900,Y[2]+2,{size:36}));return s;}
 {const w=texWidth(`ma'=F-mA`,56,false),wp=texWidth(`-mA`,56,false);s+=T(`m${ap}=${FF}-m${AA}`,600,Y[3],{size:56})+highlight(600+w/2-wp-14,Y[3]-45,wp+26,82,seg(p,.3,.5),C.F);}
 s+=fade(seg(p,.5,.7),label('加わった項',960,Y[3]+10,{size:26,color:C.F,anchor:'middle'}));
 return s;
}
function twoPanels(p,k){
 let s=panel(30,'地面から見る',C.x,boxForces(310,300,{real:1,aTxt:'a ＝ 0',aDir:0,aColor:C.a}));
 s+=fade(seg(p,.35,.55),label('描くのは 実在の力だけ',310,478,{size:24,color:C.ink,anchor:'middle'}));
 if(k)s+=fade(seg(p,.02,.2),panel(610,'電車から見る',C.hi,boxForces(890,300,{real:1,inertial:seg(p,.15,.35),aTxt:"a′ ＝ −2",aDir:-1})
  +fade(seg(p,.5,.7),label('固定：箱と実在の力　変化：見ている人',890,478,{size:22,color:C.ink,anchor:'middle'}))));
 return s;
}
function summary(p,k){
 let s=rect(100,50,1000,420,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:14});
 const L=[
  ()=>T(`${xp}=${xg}-${XX}`,260,130,{size:38})+label('2回微分 →',480,138,{size:26,color:C.dim})+T(`${ap}=${aa}-${AA}`,730,130,{size:40})
   +label('ma＝F に代入 →',300,238,{size:26,color:C.dim})+T(`m${ap}=${FF}-m${AA}`,730,230,{size:46}),
  ()=>label('慣性力 −mA：観測者の加速度から来る項',150,330,{size:28,color:C.F})+label('ほかの物体から受ける力ではない。加速する観測者の式にだけ',150,390,{size:26,color:C.ink}),
 ];
 for(let i=0;i<k;i++)s+=fade(i===k-1?seg(p,.02,.18):1,L[i]());
 return s;
}

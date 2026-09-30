// YouTube シリーズ 慣性力と軌道・初級 1/2（ステージ ui-reference-frame 本0＋例題）— 図。Stage 1200×515.
// 色：位置 x・X・x′ 水色（電車の目盛りの数字は黄）、速度 v 紫、加速度 a・A 赤、力 F 緑（慣性力は緑の破線）、時間 t 金。
// 右向きを正。電車は静止から A＝2 m/s² → X＝t²。箱は地面で静止（x＝0）。車内の目盛り x′＝x−X＝−t²。
// 画面上の地面の座標 m は GX(m−S)。S＝0：地面から見た画面、S＝X：電車から見た画面（電車が止まって見える）。
import {C,clamp,mix,seg,fmt,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth} from './anim.mjs';

const K='ui-reference-frame-1:';
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
const col=(c,s)=>`{\\color{${c}}${s}}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const BOX='#d9a066';
const PX=80,GX=m=>520+PX*m;
const Xt=t=>t*t;
const mm=v=>v<0?`−${fmt(-v,0)}`:fmt(v,0);

// dashed arrow (inertial force: not an interaction)
function dashArrow(x,y,X,Y,{color=C.F,w=5,g=1,head=18}={}){
 if(g<=0)return '';const XX=mix(x,X,g),YY=mix(y,Y,g),L=Math.hypot(XX-x,YY-y);if(L<2)return '';
 const a=Math.atan2(YY-y,XX-x),h=Math.min(head,L*.6),bx=XX-h*Math.cos(a),by=YY-h*Math.sin(a);
 return line(x,y,bx,by,{color,w,dash:'10 8',cap:'butt'})+`<polygon points="${XX},${YY} ${bx+h*.5*Math.sin(a)},${by-h*.5*Math.cos(a)} ${bx-h*.5*Math.sin(a)},${by+h*.5*Math.cos(a)}" fill="none" stroke="${color}" stroke-width="3"/>`;
}
function person(x,yf,h=70,{color=C.hi,lean=0}={}){
 const hx=x-lean*h*.35,hy=yf-h+10,sx=x-lean*h*.2,sy=yf-h*.55;
 return ring(hx,hy,h*.12,{color,w:3,fill:C.bg})+line(hx,hy+h*.12,x,yf-h*.32,{color,w:4})
  +line(x,yf-h*.32,x-h*.14,yf,{color,w:4})+line(x,yf-h*.32,x+h*.14,yf,{color,w:4})
  +line(sx,sy,sx-h*.2,sy+h*.18,{color,w:3.5})+line(sx,sy,sx+h*.2,sy+h*.18,{color,w:3.5});
}

// one side view of the track + train. X = train position (ground m of the car's 0 mark), S = screen shift.
function strip({y=330,bodyH=150,X=0,S=0,box=1,boxX=0,carScale=1,carHi=0,gScale=1,obs='',A=0,Atext='A ＝ 2 m/s²',Adir=1,small=false,xmax=930,boxText='2 kg',mark0=0,windows=1}={}){
 let s='';const ry=y+44;
 s+=line(10,ry,1190,ry,{color:C.faint,w:3});
 for(let m=-12;m<=12;m+=.5){const x=GX(m-S);if(x>10&&x<1190)s+=line(x,ry,x-8,ry+10,{color:C.faint,w:2});}
 if(gScale){let g='';for(let m=-6;m<=6;m++){const x=GX(m-S);if(x<110||x>xmax)continue;g+=line(x,ry+12,x,ry+22,{color:C.x,w:2.5})+label(mm(m),x,ry+46,{size:22,color:C.x,anchor:'middle'});}
  s+=fade(gScale,g+label('地面 x',16,ry+46,{size:22,color:C.x}));}
 if(obs==='ground'){const x=GX(-6.2-S);if(x>-30)s+=person(x,ry,small?60:74,{color:C.dim});}
 const xL=GX(X-S-5),xR=GX(X-S+1);
 s+=rect(xL,y-bodyH,xR-xL,bodyH,{fill:'#141d33',fo:1,stroke:C.dim,sw:3,rx:10});
 if(windows&&!small)for(let i=0;i<4;i++)s+=rect(xL+26+i*118,y-bodyH+16,84,bodyH*.18,{fill:'#22335a',fo:.8,stroke:'#2e4270',sw:1.5,rx:6});
 s+=rect(xL,y,xR-xL,30,{fill:'#24324f',fo:1,stroke:'none',rx:3});
 [-4.5,-3.5,-.5,.5].forEach(k=>{s+=ring(GX(X-S+k),y+36,8,{color:C.dim,w:3,fill:C.bg});});
 if(carScale){let g='';for(let k=-5;k<=1;k++){const x=GX(X-S+k);g+=line(x,y,x,y+8,{color:C.hi,w:2.5})+label(mm(k),x+(k===-5?14:k===1?-12:0),y+26,{size:22,color:C.hi,anchor:'middle'});}
  s+=fade(carScale,g);}
 if(carHi)s+=highlight(xL-6,y-4,xR-xL+12,38,carHi);
 if(mark0){const x=GX(X-S);s+=fade(mark0,`<polygon points="${x},${y-2} ${x-9},${y-16} ${x+9},${y-16}" fill="${C.hi}"/>`);}
 if(obs==='car')s+=person(GX(X-S+.75),y,small?Math.min(60,bodyH-16):74,{color:C.hi});
 if(box){const bw=small?40:54,bh=small?34:46,bx=GX(boxX-S);s+=rect(bx-bw/2,y-bh,bw,bh,{fill:BOX,fo:.5,stroke:BOX,sw:2.5,rx:5});
  if(boxText&&!small)s+=label(boxText,bx,y-bh/2+8,{size:22,color:C.ink,anchor:'middle'});}
 if(A){const cx=(xL+xR)/2,ay=y-bodyH-20;s+=fade(A,arrow(cx-Adir*60,ay,cx+Adir*60,ay,{color:C.a,w:6,head:18})+label(Atext,cx+Adir*80,ay+8,{size:24,color:C.a,anchor:Adir>0?'start':'end',weight:700}));}
 return s;
}
const tLabel=(t,x=20,y=40)=>label(`t ＝ ${t.toFixed(1)} s`,x,y,{size:28,color:C.t,weight:700});
// t goes 0→1→2 with holds (for tables)
const steps=(p,a=.08,b=.34,c=.44,d=.7)=>p<a?0:p<b?smoothStep((p-a)/(b-a)):p<c?1:p<d?1+smoothStep((p-c)/(d-c)):2;
function smoothStep(u){u=clamp(u);return u*u*(3-2*u);}

// table below a small strip
function table(rows,{cols=3,g=1,hiCol=-1,y0=310}={}){
 const xs=[230,470,710,950],hd=['t [s]','X 電車 [m]','x 箱・地面 [m]','x′ 箱・電車 [m]'],hc=[C.t,C.x,C.x,C.hi];
 let s=rect(110,y0,240*cols,190,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:12});
 for(let i=0;i<cols;i++)s+=label(hd[i],xs[i],y0+34,{size:24,color:hc[i],anchor:'middle',weight:700});
 s+=line(120,y0+48,100+240*cols,y0+48,{color:C.faint,w:2});
 const data=[[0,0,0,0],[1,1,0,-1],[2,4,0,-4]];
 data.forEach((r,j)=>{for(let i=0;i<cols;i++){const a=rows[j]?.[i]??0;if(a<=0)continue;s+=fade(a,label(mm(r[i]),xs[i],y0+90+j*44,{size:28,color:i===0?C.t:i===3?C.hi:C.x,anchor:'middle',weight:i===hiCol?700:400}));}});
 if(hiCol>=0)s+=highlight(xs[hiCol]-110,y0+8,220,176,1);
 return fade(g,s);
}

export const ytReferenceFrame1Diagrams={
 [K+'recap']:(p)=>{
  let s='';
  s+=line(60,300,640,300,{color:C.dim,w:3});
  for(let m=0;m<=6;m++){const x=100+m*80;s+=line(x,300,x,312,{color:C.x,w:2.5})+label(String(m),x,340,{size:22,color:C.x,anchor:'middle'});}
  s+=label('地面に固定した目盛り',350,385,{size:26,color:C.x,anchor:'middle'});
  s+=person(90,300,80,{color:C.dim});
  s+=rect(330,254,60,46,{fill:BOX,fo:.5,stroke:BOX,sw:2.5,rx:5})+fade(seg(p,.1,.3),arrow(392,277,480,277,{color:C.F,w:6,text:'F',tsize:26,tdx:8,tdy:8}));
  s+=card(700,90,460,300,label('慣性系',930,150,{size:32,color:C.hi,anchor:'middle',weight:700})
   +T(`m${col(C.a,'a')}=${col(C.F,'F')}`,930,240,{size:60})
   +fade(seg(p,.55,.75),label('実験で確かめられてきた法則',930,330,{size:28,color:C.ink,anchor:'middle'})),seg(p,.15,.35),C.hi);
  return s;
 },
 [K+'ask']:(p)=>{
  let s='';
  // train icon
  s+=fade(seg(p,.05,.3),rect(90,170,330,120,{fill:'#141d33',fo:1,stroke:C.dim,sw:3,rx:10})+ring(140,300,10,{color:C.dim,w:3})+ring(370,300,10,{color:C.dim,w:3})+line(40,312,470,312,{color:C.faint,w:3})
   +arrow(195,145,315,145,{color:C.a,w:6})+label('加速する電車',255,370,{size:28,color:C.ink,anchor:'middle'})+person(330,290,80,{color:C.hi}));
  // turntable icon
  const ph=p*3;
  s+=fade(seg(p,.25,.5),`<ellipse cx="760" cy="250" rx="170" ry="60" fill="#141d33" stroke="${C.dim}" stroke-width="3"/>`+line(760,250,760+150*Math.cos(ph),250+52*Math.sin(ph),{color:C.faint,w:3})
   +person(760+110*Math.cos(ph+1.2),250+38*Math.sin(ph+1.2),80,{color:C.hi})+label('回る台',760,370,{size:28,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.55,.75),label('？',255,120,{size:56,color:C.hi,anchor:'middle',weight:700})+label('？',760,150,{size:56,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.8),label('運動の見え方は 変わる？',480,470,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'setup']:(p)=>{
  let s=strip({box:0,obs:'',A:0,carScale:0,gScale:seg(p,0,.2)});
  s+=fade(seg(p,.4,.6),arrow(760,250,560,318,{color:C.hi,w:4})+label('なめらかな床',770,240,{size:28,color:C.hi})+label('摩擦なし',770,280,{size:26,color:C.dim}));
  return s;
 },
 [K+'setup2']:(p)=>{
  let s=strip({box:1,obs:'',A:seg(p,.45,.65),Atext:'2 m/s²',carScale:0});
  s+=fade(seg(p,.55,.75),label('静止から 右へ加速',760,110,{size:28,color:C.a}));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=strip({box:1,A:1,Atext:'2 m/s²',carScale:0,obs:''});
  s+=card(660,70,500,250,label('箱は どう動く？',910,125,{size:32,color:C.ink,anchor:'middle',weight:700})
   +label('地面に立つ人から見ると？',910,195,{size:28,color:C.x,anchor:'middle'})+label('電車に乗った人から見ると？',910,255,{size:28,color:C.hi,anchor:'middle'})
   +label('予想してみよう',910,300,{size:24,color:C.dim,anchor:'middle'}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'forces']:(p)=>{
  let s=rect(80,360,560,30,{fill:'#24324f',fo:1,stroke:'none'})+label('電車の床（なめらか）',90,425,{size:24,color:C.dim});
  s+=rect(270,250,180,110,{fill:BOX,fo:.5,stroke:BOX,sw:3,rx:8})+label('2 kg',312,295,{size:26,color:C.ink,anchor:'middle'});
  s+=fade(seg(p,.3,.45),arrow(360,305,360,470,{color:C.F,w:7,head:22})+label('重力',385,470,{size:26,color:C.F}));
  s+=fade(seg(p,.5,.65),arrow(360,300,360,135,{color:C.F,w:7,head:22})+label('床が押す力',385,150,{size:26,color:C.F}));
  s+=fade(seg(p,.72,.88),label('同じ大きさ・逆向き',720,230,{size:28,color:C.F})+label('→ つり合う',720,275,{size:28,color:C.F,weight:700}));
  return s;
 },
 [K+'forces2']:(p)=>{
  let s=rect(80,360,560,30,{fill:'#24324f',fo:1,stroke:'none'})+label('電車の床（なめらか）',90,425,{size:24,color:C.dim});
  s+=rect(270,250,180,110,{fill:BOX,fo:.5,stroke:BOX,sw:3,rx:8})+label('2 kg',312,295,{size:26,color:C.ink,anchor:'middle'});
  s+=fade(.35,arrow(360,305,360,470,{color:C.F,w:7,head:22})+arrow(360,300,360,135,{color:C.F,w:7,head:22}));
  s+=fade(seg(p,.05,.2),line(460,305,600,305,{color:C.dim,w:3,dash:'8 8'})+label('横向きの力：なし',470,230,{size:28,color:C.ink}));
  s+=card(700,110,460,300,label('地面から見て',930,160,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.35,.5),label('合力 F ＝ 0',930,225,{size:30,color:C.F,anchor:'middle'}))
   +fade(seg(p,.55,.72),T(`${col(C.a,'a')}=\\dfrac{${col(C.F,'F')}}{m}=\\dfrac{0}{2}=0`,930,320,{size:46})),seg(p,.25,.4));
  return s;
 },
 [K+'groundRun']:(p)=>{
  const t=2*seg(p,.12,.85);
  let s=strip({X:Xt(t),box:1,A:1,Atext:'2 m/s²',carScale:0,obs:'ground'});
  s+=tLabel(t);
  s+=fade(seg(p,.2,.4),label('箱は 地面の 0 m のまま',GX(0)-150,120,{size:26,color:C.x}));
  return s;
 },
 [K+'groundX']:(p)=>{
  let s=strip({X:4,box:1,A:1,carScale:0,obs:'ground',mark0:seg(p,.05,.2)});
  s+=tLabel(2);
  s+=fade(seg(p,.1,.3),arrow(GX(0),470,GX(4),470,{color:C.x,w:5})+label('X ＝ 4 m',GX(2),500,{size:24,color:C.x,anchor:'middle'})+line(GX(4),320,GX(4),462,{color:C.hi,w:2,dash:'6 6'}));
  s+=card(945,110,230,230,label('電車の位置',1060,160,{size:24,color:C.dim,anchor:'middle'})
   +T(`${col(C.x,'X')}=${col(C.t,'t')}^2`,1060,245,{size:50})
   +fade(seg(p,.7,.85),label('運動方程式の回と同じ',1060,310,{size:22,color:C.dim,anchor:'middle'})),seg(p,.45,.6));
  return s;
 },
 [K+'table1']:(p)=>{
  const t=steps(p);
  let s=strip({y:190,bodyH:90,X:Xt(t),box:1,A:1,carScale:0,obs:'ground',small:true,mark0:1});
  s+=tLabel(t,20,36);
  s+=table([[1,1,seg(p,.75,.9)],[seg(p,.3,.4),seg(p,.3,.4),seg(p,.8,.92)],[seg(p,.66,.76),seg(p,.66,.76),seg(p,.84,.96)]],{cols:3});
  return s;
 },
 [K+'carScale']:(p)=>{
  let s=strip({box:1,A:0,carScale:seg(p,.3,.5),carHi:seg(p,.3,.5)*(1-seg(p,.8,.95)),obs:'car',mark0:seg(p,.6,.75)});
  s+=fade(seg(p,.35,.55),label('電車の目盛り x′',GX(-2),460,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.8),arrow(760,200,GX(0)+10,286,{color:C.hi,w:4})+label('0：はじめに箱があった点',770,190,{size:26,color:C.hi}));
  return s;
 },
 [K+'carDef']:(p)=>{
  let s=strip({X:1,box:1,A:0,carScale:1,obs:'car',mark0:1});
  s+=tLabel(1);
  s+=fade(seg(p,.05,.2),line(GX(1),330,GX(1),405,{color:C.hi,w:2,dash:'6 6'}));
  s+=fade(seg(p,.35,.5),arrow(GX(1),262,GX(0),262,{color:C.hi,w:5,head:16})+label('x′ ＝ −1 m',GX(0)-8,270,{size:24,color:C.hi,anchor:'end',weight:700}));
  s+=fade(seg(p,.5,.65),arrow(GX(0),470,GX(1),470,{color:C.x,w:5,head:16})+label('X ＝ 1 m',GX(1)+14,478,{size:24,color:C.x}));
  s+=card(720,70,450,200,T(`${col(C.hi,"x'")}=${col(C.x,'x')}-${col(C.x,'X')}`,945,140,{size:50})
   +fade(seg(p,.7,.85),T(`${col(C.hi,'-1')}=${col(C.x,'0')}-${col(C.x,'1')}`,945,225,{size:40})),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'table2']:(p)=>{
  let s=strip({y:190,bodyH:90,X:4,box:1,A:0,carScale:1,obs:'car',small:true,mark0:1});
  s+=tLabel(2,20,36);
  s+=table([[1,1,1,seg(p,.1,.25)],[1,1,1,seg(p,.35,.5)],[1,1,1,seg(p,.62,.77)]],{cols:4,hiCol:seg(p,.05,.2)>.5?3:-1});
  return s;
 },
 [K+'table3']:(p)=>{
  let s=strip({y:190,bodyH:90,X:4,box:1,A:0,carScale:1,obs:'car',small:true,mark0:1});
  s+=tLabel(2,20,36);
  s+=table([[1,1,1,1],[1,1,1,1],[1,1,1,1]],{cols:4,hiCol:3});
  s+=card(945,40,230,230,T(`${col(C.hi,"x'")}=-${col(C.t,'t')}^2`,1060,110,{size:42})
   +fade(seg(p,.45,.6),label('電車は',1060,175,{size:22,color:C.dim,anchor:'middle'})+T(`${col(C.x,'X')}=${col(C.t,'t')}^2`,1060,230,{size:38})),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'two']:(p)=>twoPanel(p,{lab2:0}),
 [K+'two2']:(p)=>twoPanel(p,{lab2:1}),
 [K+'avgV']:(p)=>{
  const SX=k=>870+150*k,ly=190;
  let s=line(SX(-5.3),ly,SX(1.3),ly,{color:C.hi,w:3});
  for(let k=-5;k<=1;k++)s+=line(SX(k),ly-8,SX(k),ly+8,{color:C.hi,w:2.5})+label(mm(k),SX(k),ly+40,{size:22,color:C.hi,anchor:'middle'});
  s+=label('電車の目盛り x′ [m]',SX(1.3),ly+40,{size:22,color:C.hi,anchor:'end'}).replace(/y="[^"]+"/,`y="${ly+76}"`);
  [[0,0],[1,-1],[2,-4]].forEach(([t,k],i)=>{s+=fade(seg(p,.02+i*.08,.1+i*.08),rect(SX(k)-22,ly-60,44,38,{fill:BOX,fo:.5,stroke:BOX,sw:2,rx:5})+label(`t＝${t} s`,SX(k),ly-72,{size:22,color:C.t,anchor:'middle'}));});
  s+=fade(seg(p,.25,.4),arrow(SX(0),ly-40,SX(-1)+24,ly-40,{color:C.x,w:4,head:14})+label('−1 m',SX(-.5),ly-100,{size:24,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),label('−3 m',SX(-2.5),ly-100,{size:24,color:C.x,anchor:'middle',weight:700})+arrow(SX(-1)-24,ly-40,SX(-4)+24,ly-40,{color:C.x,w:4,head:14}));
  s+=card(150,290,900,200,
   fade(seg(p,.6,.72),label('0〜1 s の平均の速度',200,345,{size:26,color:C.dim})+label('−1 m ÷ 1 s ＝ −1 m/s',620,345,{size:28,color:C.v,weight:700}))
   +fade(seg(p,.74,.86),label('1〜2 s の平均の速度',200,405,{size:26,color:C.dim})+label('−3 m ÷ 1 s ＝ −3 m/s',620,405,{size:28,color:C.v,weight:700})),seg(p,.55,.65));
  return s;
 },
 [K+'avgA']:(p)=>{
  const SX=k=>870+150*k,ly=190;
  let s=line(SX(-5.3),ly,SX(1.3),ly,{color:C.hi,w:3});
  for(let k=-5;k<=1;k++)s+=line(SX(k),ly-8,SX(k),ly+8,{color:C.hi,w:2.5})+label(mm(k),SX(k),ly+40,{size:22,color:C.hi,anchor:'middle'});
  [[0,0],[1,-1],[2,-4]].forEach(([t,k])=>{s+=rect(SX(k)-22,ly-60,44,38,{fill:BOX,fo:.5,stroke:BOX,sw:2,rx:5})+label(`t＝${t} s`,SX(k),ly-72,{size:22,color:C.t,anchor:'middle'});});
  s+=card(150,250,900,245,
   label('平均の速度',200,300,{size:26,color:C.dim})+label('−1 m/s  →  −3 m/s',620,300,{size:28,color:C.v,weight:700})
   +fade(seg(p,.1,.3),label('1 s で 変わった分',200,360,{size:26,color:C.dim})+label('−3 − (−1) ＝ −2 m/s',620,360,{size:28,color:C.v,weight:700}))
   +fade(seg(p,.45,.65),label('電車から見た加速度',200,440,{size:26,color:C.dim})+T(`${col(C.a,"a'")}=-2\\,\\mathrm{m/s^2}`,620,440,{size:40,anchor:'start'})+highlight(605,405,texWidth(`a'=-2\\,\\mathrm{m/s^2}`,40,false)+30,58,1,C.a)));
  return s;
 },
 [K+'rule']:(p)=>{
  let s=card(120,50,960,420,
   label('位置',260,145,{size:26,color:C.dim,anchor:'middle'})+T(`${col(C.hi,"x'")}=${col(C.x,'x')}-${col(C.x,'X')}`,600,140,{size:52})
   +fade(seg(p,.1,.25),label('どの時刻でも 引き算',900,145,{size:24,color:C.dim}))
   +fade(seg(p,.25,.4),label('↓',600,215,{size:36,color:C.dim,anchor:'middle'})+label('変わり方も 引き算',640,212,{size:24,color:C.dim}))
   +fade(seg(p,.3,.45),label('速度',260,270,{size:26,color:C.dim,anchor:'middle'})+T(`${col(C.v,"v'")}=${col(C.v,'v')}-${col(C.v,'V')}`,600,265,{size:44}))
   +fade(seg(p,.62,.78),label('加速度',260,395,{size:26,color:C.dim,anchor:'middle'})+T(`${col(C.a,"a'")}=${col(C.a,'a')}-${col(C.a,'A')}`,600,390,{size:56})+highlight(470,345,260,86,1,C.a)
    +label('A：電車の加速度',800,398,{size:24,color:C.a})),seg(p,0,.1));
  return s;
 },
 [K+'rule2']:(p)=>{
  let s=card(120,50,960,420,
   T(`${col(C.a,"a'")}=${col(C.a,'a')}-${col(C.a,'A')}`,600,130,{size:56})
   +fade(seg(p,.05,.2),label('箱（地面で）',470,210,{size:24,color:C.dim,anchor:'middle'})+label('電車',700,210,{size:24,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.2,.4),T(`${col(C.a,"a'")}=0-2=-2\\,\\mathrm{m/s^2}`,600,300,{size:52}))
   +fade(seg(p,.6,.75),label('表から求めた値と 一致 ✓',600,410,{size:30,color:C.F,anchor:'middle',weight:700})));
  return s;
 },
 [K+'dir']:(p)=>{
  let s=twoPanel(1,{t:2,lab2:0,labels:0});
  s+=fade(seg(p,.05,.2),label('a ＝ 0',GX(0),60,{size:24,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.3),arrow(GX(-4)-10,290,GX(-4)-110,290,{color:C.a,w:6})+label('a′ ＝ −2 m/s²',GX(-4)+40,280,{size:24,color:C.a,weight:700}));
  s+=card(945,60,235,190,label('新しい力',1062,100,{size:24,color:C.ink,anchor:'middle'})+label('✕',1062,140,{size:28,color:C.a,anchor:'middle',weight:700})
   +label('見ている人が',1062,195,{size:24,color:C.ink,anchor:'middle'})+label('加速 ○',1062,235,{size:28,color:C.F,anchor:'middle',weight:700}),seg(p,.4,.6));
  return s;
 },
 [K+'maF']:(p)=>boxZoom(p,{step:0}),
 [K+'maF2']:(p)=>boxZoom(p,{step:1}),
 [K+'inertial']:(p)=>boxZoom(p,{step:2}),
 [K+'inertial2']:(p)=>boxZoom(p,{step:3}),
 [K+'notReal']:(p)=>{
  let s=card(60,60,520,400,label('実在の力',320,115,{size:30,color:C.F,anchor:'middle',weight:700})
   +label('重力 ← 地球が引く',100,200,{size:28,color:C.ink})+label('床が押す力 ← 床',100,260,{size:28,color:C.ink})
   +label('相手がいる（押し返される）',320,350,{size:26,color:C.dim,anchor:'middle'}),seg(p,.02,.15),C.F);
  s+=card(620,60,520,400,label('慣性力 −mA',880,115,{size:30,color:C.F,anchor:'middle',weight:700})
   +dashArrow(940,175,820,175,{g:1})
   +fade(seg(p,.2,.35),label('押す相手：なし',660,250,{size:28,color:C.ink}))
   +fade(seg(p,.5,.65),label('加速する目盛りで',660,320,{size:26,color:C.ink})+label('ma＝F の形を使うために',660,360,{size:26,color:C.ink})+label('決めて足した項',660,410,{size:28,color:C.hi,weight:700})),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'dirRule']:(p)=>{
  let s=strip({X:0,box:1,boxX:-1.5,A:1,Atext:'電車の加速度 A',carScale:0,obs:'car'});
  s+=fade(seg(p,.2,.4),dashArrow(GX(-1.5)-30,300,GX(-1.5)-150,300,{})+label('慣性力 −mA',GX(-1.5)-90,262,{size:24,color:C.F,anchor:'middle',weight:700}));
  s+=card(700,130,460,150,label('慣性力の向き',930,185,{size:26,color:C.dim,anchor:'middle'})+label('いつも A と 逆向き',930,240,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'passenger']:(p)=>{
  const t=1.2*seg(p,.1,.6);
  let s=strip({X:Xt(t),box:0,A:1,Atext:'前へ加速',carScale:0,obs:'ground'});
  const px=GX(Xt(t)-2),lean=.35*seg(p,.1,.3);
  s+=person(px,330,100,{color:C.hi,lean});
  s+=fade(seg(p,.35,.5),dashArrow(px-40,290,px-140,290,{color:C.dim})+label('後ろへ',px-40,245,{size:22,color:C.dim,anchor:'end'})+label('持っていかれる',px-40,272,{size:22,color:C.dim,anchor:'end'}));
  s+=card(760,60,420,150,label('地面から見ると',970,105,{size:24,color:C.dim,anchor:'middle'})+label('体は 元の速度を保とうとし',970,150,{size:26,color:C.ink,anchor:'middle'})+label('電車が 前へ進む',970,190,{size:26,color:C.a,anchor:'middle'}),seg(p,.6,.75));
  return s;
 },
 [K+'brake']:(p)=>{
  let s=strip({X:0,box:1,boxX:-3,A:seg(p,.3,.45),Atext:'2 m/s²',Adir:-1,carScale:0,obs:''});
  s+=fade(seg(p,.05,.2),arrow(GX(-2),120,GX(0),120,{color:C.v,w:6})+label('右へ走る',GX(0)+14,128,{size:24,color:C.v}));
  s+=fade(seg(p,.3,.45),label('ブレーキ',GX(-2)-140,128,{size:24,color:C.a,anchor:'end'}));
  s+=card(680,190,490,160,label('箱は 電車の中で',925,245,{size:28,color:C.ink,anchor:'middle'})+label('どう動いて見える？',925,300,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'brake2']:(p)=>{
  const t=2*seg(p,.35,.9),bx=-3+t*t*.25;
  let s=strip({X:0,box:1,boxX:bx,A:1,Atext:'A ＝ −2 m/s²',Adir:-1,carScale:0,obs:'',windows:0});
  s+=fade(seg(p,.35,.5),arrow(GX(bx)+34,235,GX(bx)+124,235,{color:C.a,w:5})+label('a′ ＝ ＋2',GX(bx)+34,220,{size:24,color:C.a,weight:700}));
  s+=fade(seg(p,.55,.7),dashArrow(GX(bx)+34,300,GX(bx)+134,300,{})+label('慣性力 ＋4 N',GX(bx)+34,280,{size:24,color:C.F,weight:700}));
  s+=card(700,40,470,120,T(`${col(C.a,"a'")}=0-(-2)=+2\\,\\mathrm{m/s^2}`,935,105,{size:36}),seg(p,.05,.2));
  return s;
 },
 [K+'uniform']:(p)=>{
  let s=strip({X:0,box:1,boxX:-2,A:0,carScale:0,obs:'car'});
  s+=arrow(GX(-2.5),140,GX(-.5),140,{color:C.v,w:6})+label('一定の速度',GX(-.5)+14,148,{size:24,color:C.v});
  s+=card(720,60,450,230,T(`${col(C.a,'A')}=0`,945,120,{size:44})
   +fade(seg(p,.2,.4),T(`${col(C.a,"a'")}=${col(C.a,'a')}`,945,190,{size:44}))
   +fade(seg(p,.5,.7),label('慣性力は いらない',945,260,{size:28,color:C.F,anchor:'middle',weight:700})),seg(p,.02,.15));
  return s;
 },
 [K+'sum']:(p)=>summary(p,1),
 [K+'sum2']:(p)=>summary(p,2),
 [K+'sum3']:(p)=>summary(p,3),
 [K+'next']:(p)=>{
  const cx=300,cy=260,r=170,ph=-p*4;
  let s=ring(cx,cy,r,{color:C.faint,w:3,dash:'8 8'})+dot(cx,cy,6,C.dim);
  const bx=cx+r*Math.cos(ph),by=cy+r*Math.sin(ph);
  s+=arrow(bx,by,bx+110*Math.sin(ph),by-110*Math.cos(ph),{color:C.v,w:6})+dot(bx,by,14,C.hi);
  s+=fade(seg(p,.15,.3),label('速さ 一定',cx,cy+r+50,{size:26,color:C.v,anchor:'middle'}));
  s+=card(620,150,540,200,label('次の問い',890,200,{size:26,color:C.dim,anchor:'middle'})+label('速さが一定の円運動は',890,255,{size:30,color:C.ink,anchor:'middle'})+label('「加速していない」と言える？',890,310,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.4),C.hi);
  return s;
 },
};

function twoPanel(p,{lab2=0,t=null,labels=1}={}){
 const tt=t??2*seg(p,.08,.85),X=Xt(tt);
 let s=strip({y:150,bodyH:80,X,S:0,box:1,A:1,carScale:1,obs:'ground',small:true,xmax:920});
 s+=strip({y:392,bodyH:80,X,S:X,box:1,A:0,carScale:1,obs:'car',small:true,xmax:920});
 s+=line(0,262,1200,262,{color:C.faint,w:2,dash:'4 8'});
 s+=label('地面から見る',1180,40,{size:26,color:C.x,anchor:'end',weight:700})+label('電車から見る',1180,300,{size:26,color:C.hi,anchor:'end',weight:700});
 s+=tLabel(tt,20,36);
 if(labels&&lab2){
  s+=fade(seg(p,.2,.4),label('箱：同じ',1180,110,{size:24,color:BOX,anchor:'end'})+label('電車が 右へ加速',1180,150,{size:24,color:C.a,anchor:'end'}));
  s+=fade(seg(p,.45,.65),label('見ている人：',1180,350,{size:24,color:C.ink,anchor:'end'})+label('加速する電車の中',1180,390,{size:24,color:C.hi,anchor:'end'}));
 }
 return s;
}

function boxZoom(p,{step}){
 let s=rect(60,360,560,30,{fill:'#24324f',fo:1,stroke:'none'})+label('電車の床',80,425,{size:24,color:C.dim});
 s+=rect(250,250,180,110,{fill:BOX,fo:.5,stroke:BOX,sw:3,rx:8})+label('2 kg',292,295,{size:26,color:C.ink,anchor:'middle'});
 s+=fade(.45,arrow(340,305,340,470,{color:C.F,w:7,head:22})+arrow(340,300,340,135,{color:C.F,w:7,head:22}));
 s+=arrow(250,205,130,205,{color:C.a,w:6})+label('a′ ＝ −2 m/s²',140,190,{size:24,color:C.a,weight:700});
 const gi=step>=2?(step===2?seg(p,.3,.5):1):0;
 s+=fade(gi,dashArrow(248,330,110,330,{})+label('慣性力 −mA',60,300,{size:24,color:C.F,weight:700}));
 let c='';
 if(step<=1){
  c+=T(`m${col(C.a,"a'")}=2\\times(-2)=-4\\,\\mathrm{N}`,925,150,{size:38});
  c+=fade(step===0?seg(p,.5,.65):1,label('横向きの実在の力',720,230,{size:26,color:C.dim})+T(`${col(C.F,'F')}=0`,1060,228,{size:40}));
  c+=fade(step===0?seg(p,.7,.85):1,label('合わない ✕',925,300,{size:32,color:C.a,anchor:'middle',weight:700}));
  if(step===1)c+=fade(seg(p,.35,.55),label('ma＝F は 慣性系の法則',925,370,{size:26,color:C.ink,anchor:'middle'})+label('この目盛りは 加速している',925,410,{size:26,color:C.hi,anchor:'middle'}));
 }else{
  c+=T(`m${col(C.a,"a'")}=${col(C.F,'F')}+(-m${col(C.a,'A')})`,925,150,{size:40});
  c+=fade(step===2?seg(p,.6,.8):1,label('慣性力：電車の中の式にだけ足す項',925,215,{size:24,color:C.dim,anchor:'middle'}));
  if(step===3){
   c+=fade(seg(p,.05,.2),T(`-m${col(C.a,'A')}=-2\\times2=-4\\,\\mathrm{N}`,925,285,{size:36}));
   c+=fade(seg(p,.4,.55),T(`-4=0+(-4)`,925,360,{size:40}));
   c+=fade(seg(p,.65,.8),label('合う ✓',925,425,{size:30,color:C.F,anchor:'middle',weight:700}));
  }
 }
 s+=card(690,90,470,370,c,1);
 return s;
}

function summary(p,k){
 const L=[
  [()=>label('加速度 A で動く電車から見ると',160,130,{size:28,color:C.ink})+T(`${col(C.a,"a'")}=${col(C.a,'a')}-${col(C.a,'A')}`,860,125,{size:46})],
  [()=>label('物体に新しい力は働いていない',160,240,{size:28,color:C.ink})+label('見ている人の目盛りが 加速',160,285,{size:28,color:C.hi})],
  [()=>label('その目盛りで ma＝F の形を使うときだけ',160,370,{size:28,color:C.ink})+label('慣性力 −mA を足す（地面の式には入れない）',160,415,{size:28,color:C.F})],
 ];
 let s=rect(120,60,960,400,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:14});
 for(let i=0;i<k;i++)s+=fade(i===k-1?seg(p,.02,.18):1,L[i][0]());
 return s;
}

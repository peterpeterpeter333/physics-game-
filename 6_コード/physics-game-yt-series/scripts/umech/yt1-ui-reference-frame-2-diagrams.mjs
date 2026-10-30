// YouTube シリーズ 慣性力と軌道・初級 2/2（ステージ ui-reference-frame 本1・本2）— 図。Stage 1200×515.
// 色：位置・半径 r 水色、速度 v 紫、Δ𝐯 黄、加速度 a 赤、力 F 緑（遠心力＝慣性力は緑の破線）、時間 t 金、角速度 ω 桃、電場 E 水色。
// 上から見た円：半径 1 m＝180 px、中心 (300,265)。反時計回り。角 θ の点は (cx+R cosθ, cy−R sinθ)、速度の向きは (−sinθ, −cosθ)（画面座標）。
// 速度 2 m/s＝110 px（55 px per m/s）。
import {C,clamp,mix,seg,fmt,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth} from './anim.mjs';

const K='ui-reference-frame-2:';
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
const col=(c,s)=>`{\\color{${c}}${s}}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const CX=300,CY=265,R=180,VS=55,D2R=Math.PI/180;
const P=(th,r=R,cx=CX,cy=CY)=>[cx+r*Math.cos(th),cy-r*Math.sin(th)];
const vdir=th=>[-Math.sin(th),-Math.cos(th)];
const EARTH='#4d8fe0',MOON='#c8ccd6';
const V1=`${col(C.v,'\\mathbf{v}_1')}`,V2=`${col(C.v,'\\mathbf{v}_2')}`,DV=`${col(C.hi,'\\Delta\\mathbf{v}')}`;

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
// the circle seen from above; ball at angle th
function circle({th=0,ball=1,string=1,vel=1,g=1,labels=0,title=1}={}){
 let s=ring(CX,CY,R,{color:C.faint,w:3,dash:'8 8'})+dot(CX,CY,6,C.dim);
 const [bx,by]=P(th);
 if(string)s+=line(CX,CY,bx,by,{color:C.dim,w:2.5});
 if(vel){const [dx,dy]=vdir(th);s+=arrow(bx,by,bx+dx*110,by+dy*110,{color:C.v,w:6});}
 if(ball)s+=dot(bx,by,14,C.hi);
 if(title)s+=label('上から見た図',20,40,{size:24,color:C.dim});
 if(labels){
  s+=fade(labels,label('r ＝ 1 m',CX+R*.5*Math.cos(th)-12,CY-R*.5*Math.sin(th)-14,{size:24,color:C.x,anchor:'middle'}));
 }
 return fade(g,s);
}
const thAt=p=>-0+p*2.2; // slow sweep
function ghostBall(th,{v=1,lab='',lp=[0,0]}={}){
 const [x,y]=P(th),[dx,dy]=vdir(th);
 let s=dot(x,y,12,C.hi);
 if(v)s+=arrow(x,y,x+dx*110,y+dy*110,{color:C.v,w:6});
 if(lab)s+=T(lab,x+lp[0],y+lp[1],{size:34});
 return s;
}
// right panel: common tail
const TX=860,TY=330;
function tails(p,{dv=1,comp=0}={}){
 let s=label('根元を そろえる',TX-40,90,{size:24,color:C.dim,anchor:'middle'});
 s+=arrow(TX,TY,TX,TY-110,{color:C.v,w:6})+T(V1,TX+30,TY-80,{size:34});
 s+=arrow(TX,TY,TX-110,TY,{color:C.v,w:6})+T(V2,TX-80,TY+42,{size:34});
 s+=fade(dv,arrow(TX,TY-110,TX-110,TY,{color:C.hi,w:6,g:dv})+T(DV,TX-100,TY-80,{size:34}));
 if(comp)s+=fade(comp,label('𝐯₁ ＝ (0, 2)',1000,200,{size:24,color:C.v})+label('𝐯₂ ＝ (−2, 0)',1000,240,{size:24,color:C.v}));
 return s;
}

export const ytReferenceFrame2Diagrams={
 [K+'recap']:(p)=>{
  let s=card(160,70,880,380,label('前回：加速度 A の電車から見ると',600,140,{size:30,color:C.ink,anchor:'middle'})
   +T(`${col(C.a,"a'")}=${col(C.a,'a')}-${col(C.a,'A')}`,600,235,{size:60}),seg(p,0,.15));
  return s;
 },
 [K+'recap2']:(p)=>{
  let s=card(160,70,880,380,label('前回：加速度 A の電車から見ると',600,140,{size:30,color:C.ink,anchor:'middle'})
   +T(`${col(C.a,"a'")}=${col(C.a,'a')}-${col(C.a,'A')}`,600,225,{size:56})
   +fade(seg(p,.05,.25),label('電車の中の式にだけ 慣性力 −mA を足す',600,320,{size:28,color:C.F,anchor:'middle'}))
   +fade(seg(p,.5,.7),label('押す相手のいない、決めて足した項',600,385,{size:28,color:C.hi,anchor:'middle',weight:700})));
  return s;
 },
 [K+'ask']:(p)=>{
  let s=circle({th:p*2.4});
  s+=card(620,150,540,200,label('速さが一定の円運動は',890,215,{size:30,color:C.ink,anchor:'middle'})+label('「加速していない」と言える？',890,280,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.15,.35),C.hi);
  return s;
 },
 [K+'setup']:(p)=>{
  const th=p*2.2;
  let s=circle({th});
  s+=card(620,90,540,320,label('なめらかな 水平の机',890,145,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.15,.3),label('糸につないだ 球 0.5 kg',890,205,{size:30,color:C.hi,anchor:'middle'}))
   +fade(seg(p,.35,.5),label('半径 r ＝ 1 m',890,260,{size:30,color:C.x,anchor:'middle'}))
   +fade(seg(p,.5,.65),label('速さ v ＝ 2 m/s',890,315,{size:30,color:C.v,anchor:'middle'}))
   +fade(seg(p,.65,.8),label('反時計回り',890,370,{size:26,color:C.dim,anchor:'middle'})),seg(p,.05,.2));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=circle({th:2.2+p*1.6});
  s+=card(620,120,540,250,label('速さは いつも 2 m/s',890,190,{size:30,color:C.v,anchor:'middle'})
   +label('加速度は 0 ？',890,270,{size:36,color:C.a,anchor:'middle',weight:700})
   +label('予想してみよう',890,335,{size:24,color:C.dim,anchor:'middle'}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'def']:(p)=>{
  let s=circle({th:.8,ball:1});
  s+=fade(seg(p,.35,.55),ghostBall(1.6,{v:1}));
  s+=card(620,110,540,280,T(`${col(C.a,'\\mathbf{a}')}=\\dfrac{${DV}}{${col(C.t,'\\Delta t')}}`,890,200,{size:56})
   +fade(seg(p,.3,.5),label('𝐯：向きも 含めた速度',890,300,{size:28,color:C.v,anchor:'middle'}))
   +fade(seg(p,.55,.75),label('速さ（長さ）だけではない',890,350,{size:26,color:C.dim,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 [K+'two']:(p)=>{
  let s=circle({th:0,ball:0,vel:0,string:0});
  s+=draw(Array.from({length:31},(_,i)=>P(i/30*Math.PI/2)),seg(p,.3,.6),{color:C.hi,w:5,opacity:.6});
  s+=fade(seg(p,.02,.2),ghostBall(0,{lab:V1,lp:[40,-70]})+label('右端',P(0)[0]+22,P(0)[1]+36,{size:22,color:C.dim}));
  s+=fade(seg(p,.5,.7),ghostBall(Math.PI/2,{lab:V2,lp:[-60,-40]})+label('上端',P(Math.PI/2)[0]+20,P(Math.PI/2)[1]-14,{size:22,color:C.dim}));
  s+=fade(seg(p,.6,.75),label('4分の1周',CX+140,CY-150,{size:24,color:C.hi}));
  s+=card(700,150,440,200,label('𝐯₁：上向き 2 m/s',920,220,{size:28,color:C.v,anchor:'middle'})
   +fade(seg(p,.55,.72),label('𝐯₂：左向き 2 m/s',920,290,{size:28,color:C.v,anchor:'middle'})),seg(p,.1,.25));
  return s;
 },
 [K+'sub']:(p)=>{
  let s=circle({th:0,ball:0,vel:0,string:0})+ghostBall(0,{lab:V1,lp:[40,-70]})+ghostBall(Math.PI/2,{lab:V2,lp:[-60,-40]});
  s+=fade(seg(p,.02,.2),tails(p,{dv:seg(p,.5,.75)}));
  s+=fade(seg(p,.75,.9),T(`${DV}=${V2}-${V1}`,860,440,{size:36}));
  return s;
 },
 [K+'sub2']:(p)=>{
  let s=circle({th:0,ball:0,vel:0,string:0})+ghostBall(0,{lab:V1,lp:[40,-70]})+ghostBall(Math.PI/2,{lab:V2,lp:[-60,-40]});
  s+=tails(p,{dv:1,comp:seg(p,.02,.2)});
  s+=fade(seg(p,.25,.45),T(`${DV}=(-2,\\,0)-(0,\\,2)`,860,430,{size:34}));
  s+=fade(seg(p,.5,.7),T(`=(-2,\\,-2)\\ \\mathrm{m/s}`,900,485,{size:34}));
  s+=fade(seg(p,.7,.85),label('左下向き',1000,300,{size:26,color:C.hi,weight:700}));
  return s;
 },
 [K+'mid']:(p)=>{
  let s=circle({th:0,ball:0,vel:0,string:0})+fade(.45,ghostBall(0)+ghostBall(Math.PI/2));
  const th=Math.PI/4,[mx,my]=P(th),L=2*Math.SQRT2*VS,u=[(CX-mx)/R,(CY-my)/R];
  s+=fade(seg(p,.05,.2),dot(mx,my,8,C.dim)+label('真ん中',mx+14,my-12,{size:22,color:C.dim}));
  s+=arrow(mx,my,mx+u[0]*L,my+u[1]*L,{color:C.hi,w:6,g:seg(p,.15,.45)})+fade(seg(p,.35,.5),T(DV,mx+u[0]*L*.5+36,my+u[1]*L*.5+10,{size:34}));
  s+=fade(seg(p,.5,.65),line(mx+u[0]*L,my+u[1]*L,CX,CY,{color:C.hi,w:2,dash:'6 6'})+ring(CX,CY,14,{color:C.hi,w:3}));
  s+=card(660,160,480,160,label('Δ𝐯 は',900,220,{size:28,color:C.ink,anchor:'middle'})+label('円の中心を 向く',900,280,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.72),C.hi);
  return s;
 },
 [K+'bounce']:(p)=>{
  let s=circle({th:0,ball:0,vel:0,string:0})+fade(.45,ghostBall(0)+ghostBall(Math.PI/2));
  const [mx,my]=P(Math.PI/4),L=2*Math.SQRT2*VS,u=[(CX-mx)/R,(CY-my)/R];
  s+=arrow(mx,my,mx+u[0]*L,my+u[1]*L,{color:C.hi,w:6});
  // bounce inset
  let b=line(1100,140,1100,380,{color:C.dim,w:4});for(let y=150;y<380;y+=24)b+=line(1100,y,1116,y+14,{color:C.faint,w:2});
  b+=label('前に見た 跳ね返り',880,130,{size:24,color:C.dim,anchor:'middle'});
  b+=arrow(760,200,925,200,{color:C.v,w:6})+label('前 3 m/s',760,185,{size:22,color:C.v});
  b+=fade(seg(p,.2,.35),arrow(1000,270,835,270,{color:C.v,w:6})+label('後 3 m/s',1000,255,{size:22,color:C.v,anchor:'end'}));
  b+=fade(seg(p,.4,.55),arrow(1060,340,730,340,{color:C.hi,w:6})+label('Δ𝐯：左へ 6 m/s',730,395,{size:24,color:C.hi,weight:700}));
  s+=card(680,90,470,340,b,seg(p,.02,.15));
  s+=fade(seg(p,.6,.75),label('速さが同じでも 向きが変われば Δ𝐯 ≠ 0',600,490,{size:26,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'fine']:(p)=>{
  let s=circle({th:0,ball:0,vel:0,string:0});
  for(let k=0;k<12;k++){const a0=k*30*D2R,g=seg(p,.05+k*.05,.12+k*.05);if(g<=0)continue;
   const [x0,y0]=P(a0);s+=fade(g,dot(x0,y0,5,C.dim));
   const th=a0+15*D2R,[mx,my]=P(th),L=2*2*Math.sin(15*D2R)*VS,u=[(CX-mx)/R,(CY-my)/R];
   s+=fade(g,arrow(mx,my,mx+u[0]*L,my+u[1]*L,{color:C.hi,w:5,head:14}));}
  s+=card(660,150,480,190,label('30° ずつに刻むと',900,210,{size:28,color:C.ink,anchor:'middle'})+label('どの区間でも Δ𝐯 は 中心向き',900,275,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45));
  return s;
 },
 [K+'inward']:(p)=>{
  const th=p*3;let s=circle({th,vel:1});
  const [bx,by]=P(th),u=[(CX-bx)/R,(CY-by)/R];
  s+=arrow(bx,by,bx+u[0]*100,by+u[1]*100,{color:C.a,w:6,g:seg(p,.05,.2)});
  s+=card(660,130,480,240,label('速さ一定の円運動にも',900,190,{size:28,color:C.ink,anchor:'middle'})+label('加速度がある',900,240,{size:30,color:C.a,anchor:'middle',weight:700})
   +fade(seg(p,.35,.5),label('向きは いつも 円の中心',900,295,{size:28,color:C.a,anchor:'middle'}))
   +fade(seg(p,.6,.75),label('向心加速度',900,350,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'mag']:(p)=>{
  let s=circle({th:0,ball:0,vel:0,string:0,title:1});
  s+=draw(Array.from({length:31},(_,i)=>P(i/30*Math.PI/2)),1,{color:C.hi,w:5,opacity:.7});
  s+=fade(.5,ghostBall(0)+ghostBall(Math.PI/2));
  s+=card(600,70,570,400,
   label('4分の1周',885,120,{size:28,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.1,.3),label('Δ𝐯 の長さ',630,190,{size:26,color:C.dim})+T(`\\sqrt{2^2+2^2}\\approx 2.83\\ \\mathrm{m/s}`,1150,190,{size:34,anchor:'end',color:C.hi}))
   +fade(seg(p,.45,.6),label('道のり',630,275,{size:26,color:C.dim})+T(`2\\pi\\times1\\div4\\approx1.57\\ \\mathrm{m}`,1150,275,{size:34,anchor:'end',color:C.x}))
   +fade(seg(p,.6,.78),label('時間',630,355,{size:26,color:C.dim})+T(`1.57\\div2\\approx0.785\\ \\mathrm{s}`,1150,355,{size:34,anchor:'end',color:C.t})),seg(p,0,.12));
  return s;
 },
 [K+'mag2']:(p)=>{
  let s=card(90,60,1020,410,
   label('区間の刻み',260,120,{size:26,color:C.dim,anchor:'middle'})+label('平均の加速度の大きさ',760,120,{size:26,color:C.dim,anchor:'middle'})
   +line(120,140,1080,140,{color:C.faint,w:2})
   +label('4分の1周（90°）',260,205,{size:28,color:C.ink,anchor:'middle'})+T(`2.83\\div0.785\\approx3.6\\ \\mathrm{m/s^2}`,760,205,{size:36,color:C.a})
   +fade(seg(p,.35,.5),label('30° ずつ',260,285,{size:28,color:C.ink,anchor:'middle'})+T(`\\approx3.95\\ \\mathrm{m/s^2}`,760,285,{size:36,color:C.a}))
   +fade(seg(p,.65,.8),label('もっと細かく',260,375,{size:28,color:C.ink,anchor:'middle'})+T(`\\to 4\\ \\mathrm{m/s^2}`,760,375,{size:40,color:C.a})+highlight(640,335,240,70,1,C.a)),seg(p,0,.1));
  return s;
 },
 [K+'v2r']:(p)=>{
  let s=card(160,60,880,400,
   label('近づく先（向心加速度の大きさ）',600,120,{size:28,color:C.dim,anchor:'middle'})
   +T(`${col(C.a,'a')}=\\dfrac{${col(C.v,'v')}^2}{${col(C.x,'r')}}`,600,215,{size:60})
   +fade(seg(p,.25,.45),T(`=\\dfrac{2^2}{1}=4\\ \\mathrm{m/s^2}`,600,320,{size:48,color:C.a}))
   +fade(seg(p,.6,.78),label('導き方は中級。ここでは 結果として使う',600,420,{size:26,color:C.hi,anchor:'middle'})),seg(p,0,.12));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=card(160,60,880,400,
   label('単位',600,120,{size:28,color:C.dim,anchor:'middle'})
   +T(`\\dfrac{(\\mathrm{m/s})^2}{\\mathrm{m}}=\\dfrac{\\mathrm{m^2/s^2}}{\\mathrm{m}}=\\mathrm{m/s^2}`,600,240,{size:50})
   +fade(seg(p,.5,.7),label('加速度の単位 ✓',600,380,{size:30,color:C.F,anchor:'middle',weight:700})));
  return s;
 },
 [K+'omega']:(p)=>{
  let s=card(160,50,880,420,
   T(`${col(C.v,'v')}=${col(C.x,'r')}${col(C.p,'\\omega')}`,600,120,{size:48})+label('回転の回',850,125,{size:24,color:C.dim})
   +fade(seg(p,.1,.3),T(`${col(C.p,'\\omega')}=2\\div1=2\\ \\mathrm{rad/s}`,600,210,{size:42}))
   +fade(seg(p,.45,.62),T(`\\dfrac{${col(C.v,'v')}^2}{${col(C.x,'r')}}=${col(C.x,'r')}${col(C.p,'\\omega')}^2`,600,305,{size:44}))
   +fade(seg(p,.65,.8),T(`=1\\times2^2=4\\ \\mathrm{m/s^2}`,600,400,{size:42,color:C.a})));
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=circle({th:.5+p*3});
  s+=card(620,120,540,250,label('同じ円で 速さを2倍',890,190,{size:30,color:C.ink,anchor:'middle'})+label('v ＝ 4 m/s',890,250,{size:32,color:C.v,anchor:'middle'})
   +label('加速度は 何倍？',890,320,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'quiz2']:(p)=>{
  let s=card(160,60,880,400,
   T(`${col(C.a,'a')}=\\dfrac{4^2}{1}=16\\ \\mathrm{m/s^2}`,600,150,{size:54})
   +fade(seg(p,.15,.3),label('2 m/s のとき',230,265,{size:26,color:C.dim})+rect(420,242,4*30,32,{fill:C.a,fo:.7,rx:6})+label('4',560,268,{size:26,color:C.a}))
   +fade(seg(p,.25,.4),label('4 m/s のとき',230,335,{size:26,color:C.dim})+rect(420,312,16*30,32,{fill:C.a,fo:.7,rx:6})+label('16',915,338,{size:26,color:C.a}))
   +fade(seg(p,.45,.6),label('速さ 2倍 → 加速度 4倍',600,420,{size:30,color:C.hi,anchor:'middle',weight:700})));
  return s;
 },
 [K+'force']:(p)=>{
  const th=.6;let s=circle({th,string:1});
  const [bx,by]=P(th),u=[(CX-bx)/R,(CY-by)/R];
  s+=arrow(bx,by,bx+u[0]*120,by+u[1]*120,{color:C.F,w:7,g:seg(p,.5,.7)});
  s+=card(620,90,540,330,T(`${col(C.F,'F')}=m${col(C.a,'a')}`,890,160,{size:52})
   +fade(seg(p,.2,.4),T(`=0.5\\times4=2\\ \\mathrm{N}`,890,250,{size:44,color:C.F}))
   +fade(seg(p,.55,.72),label('向きは 中心向き',890,340,{size:30,color:C.F,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'string']:(p)=>{
  const th=.6;let s=circle({th,string:0});
  const [bx,by]=P(th),u=[(CX-bx)/R,(CY-by)/R];
  s+=line(CX,CY,bx,by,{color:C.hi,w:4});
  s+=arrow(bx,by,bx+u[0]*120,by+u[1]*120,{color:C.F,w:7});
  s+=label('糸が引く力 2 N',CX+80,CY+10,{size:26,color:C.F,weight:700});
  s+=card(620,120,540,260,label('重力（下向き）と',890,190,{size:28,color:C.ink,anchor:'middle'})+label('机が押す力（上向き）は',890,240,{size:28,color:C.ink,anchor:'middle'})
   +label('つり合う',890,300,{size:30,color:C.F,anchor:'middle',weight:700})+label('（図の面に 垂直な向き）',890,350,{size:24,color:C.dim,anchor:'middle'}),seg(p,.45,.6));
  return s;
 },
 [K+'cut']:(p)=>{
  const TC=-0.6,thc=TC-1+seg(p,0,.3),[cx0,cy0]=P(TC);
  let s=circle({th:0,ball:0,vel:0,string:0});
  if(p<.3){const [bx,by]=P(thc);s+=line(CX,CY,bx,by,{color:C.dim,w:2.5})+dot(bx,by,14,C.hi);}
  else{const [dx,dy]=vdir(TC),d=300*seg(p,.35,.9),bx=cx0+dx*d,by=cy0+dy*d;
   s+=draw([[cx0,cy0],[bx,by]],1,{color:C.hi,w:3,dash:'6 6'})+dot(bx,by,14,C.hi)+arrow(bx,by,bx+dx*90,by+dy*90,{color:C.v,w:6});
   s+=fade(seg(p,.3,.4),label('✂ 糸を切る',cx0+10,cy0+48,{size:24,color:C.dim,anchor:'middle'}));}
  s+=fade(seg(p,.6,.8),label('接線の方向へ まっすぐ',700,200,{size:28,color:C.v,weight:700}));
  return s;
 },
 [K+'cut2']:(p)=>{
  const th=-0.6,[cx0,cy0]=P(th),[dx,dy]=vdir(th);
  let s=circle({th:0,ball:0,vel:0,string:0});
  s+=draw([[cx0,cy0],[cx0+dx*300,cy0+dy*300]],1,{color:C.hi,w:3,dash:'6 6'})+dot(cx0+dx*300,cy0+dy*300,14,C.hi)+label('○ 接線の方向',cx0+dx*300+22,cy0+dy*300+10,{size:30,color:C.F,weight:700});
  const ux=(cx0-CX)/R,uy=(cy0-CY)/R;
  s+=fade(seg(p,.1,.3),line(cx0,cy0,cx0+ux*120,cy0+uy*120,{color:C.a,w:3,dash:'6 6'})+label('✕ 外へ',cx0+ux*120+12,cy0+uy*120+10,{size:26,color:C.a,weight:700}));
  s+=card(700,260,460,190,label('地面から見て',930,320,{size:26,color:C.dim,anchor:'middle'})+label('外向きの力は 働いていない',930,385,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,.35,.5));
  return s;
 },
 [K+'rot']:(p)=>{
  let s=`<circle cx="${CX}" cy="${CY}" r="${R+30}" fill="#141d33" stroke="${C.dim}" stroke-width="3"/>`;
  s+=line(CX,CY,CX+R,CY,{color:C.dim,w:2.5})+dot(CX+R,CY,14,C.hi)+person(CX-10,CY+30,70,{color:C.hi});
  s+=label('一緒に回る 台',20,40,{size:24,color:C.dim});
  s+=card(660,150,480,190,label('回る人から見ると',900,210,{size:28,color:C.ink,anchor:'middle'})+label('球は 止まって見える',900,275,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.5),C.hi);
  return s;
 },
 [K+'rot2']:(p)=>{
  let s=`<circle cx="${CX}" cy="${CY}" r="${R+30}" fill="#141d33" stroke="${C.dim}" stroke-width="3"/>`;
  s+=line(CX,CY,CX+R,CY,{color:C.dim,w:2.5})+dot(CX+R,CY,14,C.hi)+person(CX-10,CY+30,70,{color:C.hi});
  s+=arrow(CX+R-14,CY-22,CX+R-124,CY-22,{color:C.F,w:6})+label('糸 2 N',CX+R-70,CY-40,{size:22,color:C.F,anchor:'middle'});
  s+=fade(seg(p,.4,.6),dashArrow(CX+R+14,CY+24,CX+R+124,CY+24,{})+label('遠心力 2 N',CX+R+20,CY+68,{size:22,color:C.F,weight:700}));
  s+=card(660,90,500,340,label('回る人の式（慣性力を足す）',910,140,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.4,.6),label('遠心力（外向き）',910,200,{size:28,color:C.F,anchor:'middle',weight:700}))
   +fade(seg(p,.5,.7),T(`\\dfrac{m${col(C.v,'v')}^2}{${col(C.x,'r')}}=\\dfrac{0.5\\times2^2}{1}=2\\ \\mathrm{N}`,910,300,{size:40}))
   +fade(seg(p,.8,.92),label('糸 2 N と つり合って 止まって見える',910,415,{size:22,color:C.ink,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 [K+'rot3']:(p)=>{
  let s='';
  const pan=(x0,title,rotv)=>{let q=rect(x0,50,520,420,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:14})+label(title,x0+260,95,{size:28,color:rotv?C.hi:C.x,anchor:'middle',weight:700});
   const cx=x0+200,cy=260,r=120;q+=ring(cx,cy,r,{color:C.faint,w:3,dash:'8 8'})+dot(cx,cy,5,C.dim)+line(cx,cy,cx+r,cy,{color:C.dim,w:2.5})+dot(cx+r,cy,13,C.hi);
   q+=arrow(cx+r-14,cy-20,cx+r-104,cy-20,{color:C.F,w:6})+label('2 N',cx+r-60,cy-36,{size:22,color:C.F,anchor:'middle'});
   if(rotv)q+=dashArrow(cx+r+14,cy+22,cx+r+104,cy+22,{})+label('遠心力 2 N',cx+r+10,cy+62,{size:22,color:C.F});
   else q+=arrow(cx+r,cy+30,cx+r-70,cy+30,{color:C.a,w:5})+label('a ＝ 4 m/s²',cx+r-40,cy+68,{size:22,color:C.a,anchor:'middle'});
   q+=label(rotv?'球は静止：2 − 2 ＝ 0':'ma ＝ 0.5×4 ＝ 2 N',x0+260,440,{size:26,color:C.ink,anchor:'middle'});return q;};
  s+=fade(seg(p,0,.15),pan(40,'地面から見た式',0));
  s+=fade(seg(p,.4,.55),pan(640,'回る人の式',1));
  s+=fade(seg(p,.7,.85),label('混ぜない',600,500,{size:26,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'moon']:(p)=>{
  const ex=300,ey=265,rr=190,th=.3+p*1.4,mx=ex+rr*Math.cos(th),my=ey-rr*Math.sin(th);
  let s=ring(ex,ey,rr,{color:C.faint,w:2.5,dash:'8 8'})+`<circle cx="${ex}" cy="${ey}" r="60" fill="${EARTH}" fill-opacity=".55" stroke="${EARTH}" stroke-width="3"/>`+label('地球',ex,ey+9,{size:26,color:C.ink,anchor:'middle'});
  s+=dot(mx,my,18,MOON)+label('月',mx+26,my-18,{size:26,color:MOON});
  s+=fade(seg(p,.4,.6),arrow(mx,my,mx+(ex-mx)*.45,my+(ey-my)*.45,{color:C.F,w:6})+label('？',mx+(ex-mx)*.45+14,my+(ey-my)*.45-8,{size:30,color:C.F,weight:700}));
  s+=label('大きさの比は 正しくない',20,500,{size:22,color:C.dim});
  s+=card(640,160,520,170,label('糸はない',900,220,{size:28,color:C.ink,anchor:'middle'})+label('中心向きの力は？',900,285,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.35));
  return s;
 },
 [K+'law']:(p)=>lawPic(p,0),
 [K+'law2']:(p)=>lawPic(p,1),
 [K+'G']:(p)=>{
  let s=card(120,60,960,400,
   T(`${col(C.F,'F')}=${col(C.hi,'G')}\\dfrac{Mm}{${col(C.x,'r')}^2}`,600,145,{size:52})
   +fade(seg(p,.1,.25),label('G：万有引力定数（どこでも同じ値）',600,245,{size:28,color:C.hi,anchor:'middle'}))
   +fade(seg(p,.4,.6),T(`${col(C.hi,'G')}\\approx6.67\\times10^{-11}\\ \\mathrm{N\\,m^2/kg^2}`,600,340,{size:42}))
   +fade(seg(p,.7,.85),label('とても小さい数',600,420,{size:24,color:C.dim,anchor:'middle'})));
  return s;
 },
 [K+'g']:(p)=>{
  let s=card(80,60,500,400,label('G（大文字）',330,115,{size:30,color:C.hi,anchor:'middle',weight:700})
   +label('万有引力定数',330,175,{size:26,color:C.ink,anchor:'middle'})+label('どこでも同じ',330,225,{size:26,color:C.ink,anchor:'middle'})
   +T(`\\approx6.67\\times10^{-11}\\ \\mathrm{N\\,m^2/kg^2}`,330,320,{size:28}));
  s+=card(620,60,500,400,label('g（小文字）',870,115,{size:30,color:C.a,anchor:'middle',weight:700})
   +label('地表での重力加速度',870,175,{size:26,color:C.ink,anchor:'middle'})
   +fade(seg(p,.35,.5),T(`${col(C.a,'g')}=\\dfrac{${col(C.hi,'G')}M}{R^2}\\approx9.8\\ \\mathrm{m/s^2}`,870,280,{size:38}))
   +fade(seg(p,.6,.75),label('R：地球の半径',870,375,{size:26,color:C.x,anchor:'middle'})+label('場所で 変わる',870,425,{size:24,color:C.dim,anchor:'middle'})),seg(p,.15,.3));
  return s;
 },
 [K+'predict2']:(p)=>{
  const ex=260,ey=265;
  let s=`<circle cx="${ex}" cy="${ey}" r="60" fill="${EARTH}" fill-opacity=".55" stroke="${EARTH}" stroke-width="3"/>`+label('地球',ex,ey+9,{size:24,color:C.ink,anchor:'middle'});
  s+=dot(ex+180,ey,10,C.hi)+arrow(ex+180,ey+40,ex,ey+40,{color:C.x,w:3,head:12})+label('r',ex+90,ey+72,{size:26,color:C.x,anchor:'middle'});
  s+=fade(seg(p,.2,.4),dot(ex+360,ey,10,C.hi)+arrow(ex+360,ey+110,ex,ey+110,{color:C.x,w:3,head:12})+label('2r',ex+180,ey+145,{size:26,color:C.x,anchor:'middle'}));
  s+=card(720,150,440,190,label('距離が 2倍なら',940,215,{size:28,color:C.ink,anchor:'middle'})+label('重力は 何倍？',940,280,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.5),C.hi);
  return s;
 },
 [K+'lines']:(p)=>linesPic(p,0),
 [K+'lines2']:(p)=>linesPic(p,1),
 [K+'lines3']:(p)=>{
  let s=card(80,70,500,370,label('線の図',330,125,{size:30,color:C.dim,anchor:'middle',weight:700})
   +label('r² の形を 覚えるための',330,215,{size:26,color:C.ink,anchor:'middle'})+label('補助',330,265,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,0,.15));
  s+=card(620,70,500,370,T(`${col(C.F,'F')}=G\\dfrac{Mm}{${col(C.x,'r')}^2}`,870,150,{size:46})
   +label('天体の観測などで',870,255,{size:26,color:C.ink,anchor:'middle'})+label('確かめられてきた 法則',870,305,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'twoR']:(p)=>{
  const ex=200,ey=280,Rp=80;
  let s=`<circle cx="${ex}" cy="${ey}" r="${Rp}" fill="${EARTH}" fill-opacity=".55" stroke="${EARTH}" stroke-width="3"/>`+label('地球',ex,ey+9,{size:24,color:C.ink,anchor:'middle'});
  s+=dot(ex+Rp,ey,8,C.hi)+label('地表 9.8 m/s²',ex+Rp+14,ey-20,{size:22,color:C.a});
  s+=fade(seg(p,.1,.3),dot(ex+2*Rp*2,ey,10,C.hi)+arrow(ex,ey+110,ex+2*Rp*2,ey+110,{color:C.x,w:3,head:12})+label('中心から 2R',ex+2*Rp,ey+145,{size:24,color:C.x,anchor:'middle'}));
  s+=card(620,110,520,280,label('半径の2倍の所',880,165,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.3,.5),T(`\\dfrac{9.8}{4}\\approx2.45\\ \\mathrm{m/s^2}`,880,265,{size:46,color:C.a}))
   +fade(seg(p,.6,.75),label('地表の 4分の1',880,350,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.2,.35));
  return s;
 },
 [K+'sum']:(p)=>summary(p,1),
 [K+'sum2']:(p)=>summary(p,2),
 [K+'sum3']:(p)=>summary(p,3),
 [K+'next']:(p)=>{
  let s='';
  for(let j=0;j<5;j++)for(let i=0;i<5;i++){const x=70+i*110,y=90+j*85;s+=arrow(x,y,x+60,y,{color:C.x,w:3,head:12});}
  s+=label('電場 𝐄',20,40,{size:26,color:C.x});
  const path=Array.from({length:41},(_,i)=>{const u=i/40;return [110+400*u,420-280*u+90*Math.sin(u*Math.PI*1.3)];});
  s+=draw(path,seg(p,.1,.5),{color:C.hi,w:4,dash:'8 8'});
  const k=Math.round(40*seg(p,.1,.5)),[qx,qy]=path[k];
  s+=ring(qx,qy,16,{color:C.hi,w:3,fill:C.bg})+label('+',qx,qy+9,{size:26,color:C.hi,anchor:'middle',weight:700});
  s+=card(660,130,500,260,label('次の問い',910,180,{size:26,color:C.dim,anchor:'middle'})+label('曲がった道に沿って 電荷を運ぶと',910,240,{size:26,color:C.ink,anchor:'middle'})
   +label('電場がする仕事は',910,300,{size:30,color:C.hi,anchor:'middle',weight:700})+label('どう数える？',910,350,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.5),C.hi);
  return s;
 },
};

function lawPic(p,k){
 const ex=230,ey=280,Rp=70,mx=ex+300,my=ey;
 let s=`<circle cx="${ex}" cy="${ey}" r="${Rp}" fill="${EARTH}" fill-opacity=".55" stroke="${EARTH}" stroke-width="3"/>`+label('地球',ex,ey-Rp-14,{size:24,color:C.ink,anchor:'middle'});
 s+=dot(mx,my,14,MOON)+arrow(mx-20,my,mx-110,my,{color:C.F,w:6})+label('F',mx-80,my-20,{size:26,color:C.F,weight:700});
 s+=dot(ex,ey,5,C.ink);
 if(k){s+=arrow(ex,ey+120,mx,ey+120,{color:C.x,w:3,head:12})+line(ex,ey,ex,ey+130,{color:C.x,w:2,dash:'5 5'})+line(mx,my,mx,ey+130,{color:C.x,w:2,dash:'5 5'})
  +label('r：中心から測る',(ex+mx)/2,ey+160,{size:24,color:C.x,anchor:'middle'})
  +label('M',ex-10,ey+10,{size:28,color:C.ink,anchor:'end',weight:700})+label('m',mx+22,my+10,{size:28,color:C.ink,weight:700});
  s+=fade(seg(p,.55,.75),line(ex+Rp,ey+75,mx,ey+75,{color:C.a,w:2,dash:'4 6'})+label('✕ 地面から',ex+Rp+10,ey+68,{size:22,color:C.a}));}
 s+=card(620,90,540,300,label('球の形の天体の外で',890,140,{size:26,color:C.dim,anchor:'middle'})
  +T(`${col(C.F,'F')}=G\\dfrac{Mm}{${col(C.x,'r')}^2}`,890,240,{size:56})
  +(k?label('M：地球の質量　m：物体の質量',890,340,{size:24,color:C.ink,anchor:'middle'}):''),k?1:seg(p,.3,.5));
 return s;
}

function linesPic(p,k){
 const ex=110,ey=250,x1=440,x2=770,h1=60,h2=120;
 let s=`<circle cx="${ex}" cy="${ey}" r="36" fill="${EARTH}" fill-opacity=".55" stroke="${EARTH}" stroke-width="3"/>`;
 const g=seg(p,.02,.3);
 for(let i=0;i<4;i++){const f=-1+2*(i+.5)/4,yA=ey+h1*f,yB=ey+h2*f;s+=draw([[ex,ey],[x1,yA],[x2,yB],[x2+60,yB+(yB-ey)*60/(x2-ex)]],g,{color:C.hi,w:2.5});}
 s+=fade(seg(p,.25,.4),rect(x1-6,ey-h1,12,2*h1,{fill:C.x,fo:.35,stroke:C.x,sw:2,rx:3})+label('距離 r',x1,ey+h1+40,{size:24,color:C.x,anchor:'middle'}));
 s+=fade(seg(p,.4,.55),rect(x2-6,ey-h2,12,2*h2,{fill:C.x,fo:.35,stroke:C.x,sw:2,rx:3})+label('距離 2r',x2,ey+h2+40,{size:24,color:C.x,anchor:'middle'}));
 // face-on grids (right)
 const gx=960,cell=50;
 const grid=(x,y,n)=>{let q='';for(let i=0;i<n;i++)for(let j=0;j<n;j++)q+=rect(x+i*cell,y+j*cell,cell,cell,{fill:C.x,fo:.12,stroke:C.x,sw:2,rx:2});return q;};
 s+=fade(seg(p,.55,.7),label('正面から見た面',1060,40,{size:22,color:C.dim,anchor:'middle'})+grid(gx+25,70,1)+label('面積 1',gx+160,105,{size:24,color:C.x})
  +[[.3,.3],[.7,.3],[.3,.7],[.7,.7]].map(([a,b])=>dot(gx+25+a*cell,70+b*cell,5,C.hi)).join(''));
 s+=fade(seg(p,.7,.85),grid(gx,200,2)+label('面積 4',gx+120,255,{size:24,color:C.x})
  +[[.5,.5],[1.5,.5],[.5,1.5],[1.5,1.5]].map(([a,b])=>dot(gx+a*cell,200+b*cell,5,C.hi)).join(''));
 if(k){s+=fade(seg(p,.05,.2),label('1マスに 4本',gx+75,160,{size:22,color:C.hi,anchor:'middle'})+label('1マスに 1本',gx+50,335,{size:22,color:C.hi,anchor:'middle'}));
  s+=card(40,408,560,100,label('1 m² あたり 4分の1',70,468,{size:28,color:C.hi,weight:700})+T(`\\propto\\dfrac{1}{${col(C.x,'r')}^2}`,500,462,{size:28}),seg(p,.4,.6),C.hi);}
 return s;
}

function summary(p,k){
 const L=[
  ()=>label('速さ一定でも 向きが変わる →',150,125,{size:28,color:C.ink})+T(`${col(C.a,'a')}=\\dfrac{${col(C.v,'v')}^2}{${col(C.x,'r')}}`,760,125,{size:40})+label('中心向き',870,132,{size:26,color:C.a}),
  ()=>label('中心向きの合力は ma＝F で決まる',150,235,{size:28,color:C.ink})+label('遠心力：回る人の見方で足す 慣性力',150,280,{size:28,color:C.F}),
  ()=>T(`${col(C.F,'F')}=G\\dfrac{Mm}{${col(C.x,'r')}^2}`,300,380,{size:40})+label('距離2倍 → 4分の1',480,375,{size:28,color:C.hi})+label('G と g は 別の量',480,420,{size:26,color:C.ink}),
 ];
 let s=rect(120,60,960,400,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:14});
 for(let i=0;i<k;i++)s+=fade(i===k-1?seg(p,.02,.18):1,L[i]());
 return s;
}

// YouTube シリーズ 慣性力と軌道・中級 2/3（ステージ um-reference-frame 本3＋v²/r の導出）— 図。Stage 1200×515.
// 色：位置・半径 r・弧 水色、速度 𝐯 紫、Δ𝐯 黄、加速度 a 赤、力 F 緑（遠心力＝慣性力は緑の破線）、時間 Δt 金、ω 桃、角 Δθ 橙。
// 真上から見た円：中心 (300,265)、半径 1 m＝180 px。反時計回り。角 θ の点は (CX+R cosθ, CY−R sinθ)、速度の向きは (−sinθ, −cosθ)（画面座標）。
// Δθ は見やすさのため 30° に大きく描く（画面に明記）。
import {C,clamp,mix,seg,fmt,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth} from './anim.mjs';

const K='um-reference-frame-2:';
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
const col=(c,s)=>`{\\color{${c}}${s}}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const CX=300,CY=265,R=180,D2R=Math.PI/180,DT=15*D2R;
const P=(th,r=R,cx=CX,cy=CY)=>[cx+r*Math.cos(th),cy-r*Math.sin(th)];
const vdir=th=>[-Math.sin(th),-Math.cos(th)];
const vv=col(C.v,'v'),rr=col(C.x,'r'),aa=col(C.a,'a'),dt=col(C.t,'\\Delta t'),dth=col(C.E,'\\Delta\\theta'),om=col(C.p,'\\omega');
const DV=col(C.hi,'\\Delta\\mathbf{v}'),V1=col(C.v,'\\mathbf{v}_1'),V2=col(C.v,'\\mathbf{v}_2');
const DISK='#16213b';

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
// arc path on circle (cx,cy,r) from angle a0 to a1 (math angles, CCW)
function arcPts(a0,a1,r=R,cx=CX,cy=CY,n=30){return Array.from({length:n+1},(_,i)=>P(a0+(a1-a0)*i/n,r,cx,cy));}
function angleMark(cx,cy,a0,a1,r,{color=C.E,txt='',tdx=0,tdy=0,size=30}={}){
 let s=draw(arcPts(a0,a1,r,cx,cy,20),1,{color,w:3});
 if(txt){const am=(a0+a1)/2,[x,y]=P(am,r+26,cx,cy);s+=T(txt,x+tdx,y+tdy,{size});}
 return s;
}
function base({title=1,g=1}={}){
 let s=ring(CX,CY,R,{color:C.faint,w:3,dash:'8 8'})+dot(CX,CY,6,C.dim);
 if(title)s+=label('真上から見た図',20,40,{size:24,color:C.dim});
 return fade(g,s);
}
const BIG=()=>label('（角 Δθ は 大きく描いた図）',20,500,{size:22,color:C.dim});
function twoPoints({radii=1,arcG=1,ang=1,vel=0,rightAng=0}={}){
 let s=base();
 const [x1,y1]=P(-DT),[x2,y2]=P(DT);
 if(radii)s+=fade(radii,line(CX,CY,x1,y1,{color:C.x,w:2.5})+line(CX,CY,x2,y2,{color:C.x,w:2.5})+label('r',CX+90,CY+40,{size:26,color:C.x}));
 if(ang)s+=fade(ang,angleMark(CX,CY,-DT,DT,50,{txt:dth,tdx:14,tdy:10}));
 if(arcG)s+=fade(arcG,draw(arcPts(-DT,DT),1,{color:C.x,w:6})+T(`${vv}${dt}`,x1+66,CY+10,{size:32}));
 s+=dot(x1,y1,12,C.hi)+dot(x2,y2,12,C.hi)+label('前',x1+10,y1+36,{size:22,color:C.dim})+label('後',x2+10,y2-18,{size:22,color:C.dim});
 if(vel){const [a,b]=vdir(-DT),[c,d]=vdir(DT);
  s+=fade(vel,arrow(x1,y1,x1+a*130,y1+b*130,{color:C.v,w:6})+T(V1,x1+a*130+28,y1+b*130+20,{size:30})
   +arrow(x2,y2,x2+c*130,y2+d*130,{color:C.v,w:6})+T(V2,x2+c*130-30,y2+d*130+6,{size:30}));}
 if(rightAng){const sq=(x,y,th)=>{const u=[(CX-x)/R,(CY-y)/R],v=vdir(th),k=16;return `<polyline points="${x+u[0]*k},${y+u[1]*k} ${x+u[0]*k+v[0]*k},${y+u[1]*k+v[1]*k} ${x+v[0]*k},${y+v[1]*k}" fill="none" stroke="${C.ink}" stroke-width="2.5"/>`;};
  s+=fade(rightAng,sq(x1,y1,-DT)+sq(x2,y2,DT));}
 return s;
}
// tails panel
const BX=880,BY=440,L=260;
function tails({dv=0,arcG=0,g=1,ang=1}={}){
 const [a,b]=vdir(-DT),[c,d]=vdir(DT),t1=[BX+a*L,BY+b*L],t2=[BX+c*L,BY+d*L];
 let s=dot(BX,BY,6,C.dim)+label('根元をそろえる',BX+120,BY+10,{size:22,color:C.dim});
 s+=arrow(BX,BY,t1[0],t1[1],{color:C.v,w:6})+T(V1,t1[0]+30,t1[1]+40,{size:32});
 s+=arrow(BX,BY,t2[0],t2[1],{color:C.v,w:6})+T(V2,t2[0]-34,t2[1]+40,{size:32});
 s+=label('長さ v',BX+60,BY-110,{size:22,color:C.v});
 if(ang)s+=fade(ang,angleMark(BX,BY,Math.PI/2-DT,Math.PI/2+DT,70,{txt:dth,tdy:-4,size:28}));
 if(arcG)s+=fade(arcG,`<path d="M ${t1[0]} ${t1[1]} A ${L} ${L} 0 0 0 ${t2[0]} ${t2[1]}" fill="none" stroke="${C.x}" stroke-width="3" stroke-dasharray="7 6"/>`);
 if(dv)s+=arrow(t1[0],t1[1],t2[0],t2[1],{color:C.hi,w:6,g:dv,head:16})+fade(dv,T(DV,(t1[0]+t2[0])/2,t1[1]+46,{size:32}));
 return fade(g,s);
}
// turntable (top view). rot = disc angle (for drawing marks), ball at angle bth on radius R.
function disc({rot=0,ball=1,bth=0,string=1,obs=0,obsAng=Math.PI*1.15,cx=CX,cy=CY,rad=215,rb=R,marks=1}={}){
 let s=`<circle cx="${cx}" cy="${cy}" r="${rad}" fill="${DISK}" stroke="${C.dim}" stroke-width="3"/>`;
 if(marks)for(let k=0;k<6;k++){const a=rot+k*Math.PI/3,[x,y]=P(a,rad-8,cx,cy),[x2,y2]=P(a,rad-40,cx,cy);s+=line(x,y,x2,y2,{color:C.faint,w:3});}
 s+=dot(cx,cy,6,C.dim);
 const [bx,by]=P(bth,rb,cx,cy);
 if(string)s+=line(cx,cy,bx,by,{color:C.dim,w:2.5});
 if(obs){const [px,py]=P(obsAng,rb*.75,cx,cy);s+=person(px,py+30,64,{color:C.hi});}
 if(ball)s+=dot(bx,by,14,C.hi);
 return s;
}
function inward(bth,len,{color=C.F,cx=CX,cy=CY,rb=R,off=0}={}){const [bx,by]=P(bth,rb,cx,cy),u=[Math.cos(bth),-Math.sin(bth)];return arrow(bx-u[0]*16+off*u[1],by-u[1]*16-off*u[0],bx-u[0]*(16+len)+off*u[1],by-u[1]*(16+len)-off*u[0],{color,w:6});}
function outward(bth,len,{cx=CX,cy=CY,rb=R}={}){const [bx,by]=P(bth,rb,cx,cy),u=[Math.cos(bth),-Math.sin(bth)];return dashArrow(bx+u[0]*16,by+u[1]*16,bx+u[0]*(16+len),by+u[1]*(16+len),{});}
function panel(x0,title,colr,inner){return rect(x0,20,560,470,{fill:'#131f38',fo:.96,stroke:colr,sw:2,rx:14})+label(title,x0+280,62,{size:28,color:colr,anchor:'middle',weight:700})+inner;}

export const ytReferenceFrameM2Diagrams={
 [K+'recap']:(p)=>{
  let s=card(140,60,920,400,label('前回：加速する電車の中の式',600,120,{size:28,color:C.dim,anchor:'middle'})
   +T(`${col(C.hi,"x'")}=${col(C.x,'x')}-${col(C.x,'X')}`,600,195,{size:44})+label('2回微分 ↓',600,250,{size:24,color:C.dim,anchor:'middle'})
   +T(`m${col(C.a,"a'")}=${col(C.F,'F')}-m${col(C.a,'A')}`,600,320,{size:52})
   +fade(seg(p,.6,.8),label('−mA：慣性力',600,410,{size:30,color:C.F,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'lastq']:(p)=>{
  let s=disc({rot:p*2,bth:p*2,obs:1,obsAng:p*2+Math.PI*1.1});
  s+=card(620,90,540,330,label('前回の問い',890,140,{size:26,color:C.dim,anchor:'middle'})
   +label('回る台の上の観測者の 慣性力は？',890,210,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.4,.6),label('そもそも',890,285,{size:26,color:C.dim,anchor:'middle'})+T(`${aa}=\\dfrac{${vv}^2}{${rr}}`,820,365,{size:44})+label('は どこから？',960,372,{size:28,color:C.hi,weight:700})),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'recap2']:(p)=>{
  let s=base();
  const [x0,y0]=P(0),[x1,y1]=P(Math.PI/2);
  s+=arrow(x0,y0,x0,y0-110,{color:C.v,w:6})+arrow(x1,y1,x1-110,y1,{color:C.v,w:6})+dot(x0,y0,12,C.hi)+dot(x1,y1,12,C.hi);
  const [mx,my]=P(Math.PI/4),L2=2*Math.SQRT2*55,u=[(CX-mx)/R,(CY-my)/R];s+=arrow(mx,my,mx+u[0]*L2,my+u[1]*L2,{color:C.hi,w:6});
  s+=label('初級の図',20,500,{size:24,color:C.dim});
  s+=card(620,70,540,380,label('半径 1 m、速さ 2 m/s',890,120,{size:26,color:C.dim,anchor:'middle'})
   +label('90° ずつ',720,200,{size:28,color:C.ink,anchor:'middle'})+T(`\\approx3.6\\ \\mathrm{m/s^2}`,990,200,{size:34,color:C.a})
   +fade(seg(p,.3,.5),label('30° ずつ',720,275,{size:28,color:C.ink,anchor:'middle'})+T(`\\approx3.95\\ \\mathrm{m/s^2}`,990,275,{size:34,color:C.a}))
   +fade(seg(p,.6,.8),label('刻むほど',720,360,{size:28,color:C.ink,anchor:'middle'})+T(`\\to4\\ \\mathrm{m/s^2}`,990,360,{size:38,color:C.a})),seg(p,.05,.2));
  return s;
 },
 [K+'recap3']:(p)=>{
  let s=card(160,60,880,400,label('初級：近づく先',600,120,{size:26,color:C.dim,anchor:'middle'})
   +T(`${aa}=\\dfrac{${vv}^2}{${rr}}`,600,220,{size:60})
   +label('導き方は中級で扱う（結果として使った）',600,320,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.6,.8),label('今回：その導き方',600,400,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.12),C.hi);
  return s;
 },
 [K+'ask']:(p)=>{
  let s=card(160,60,880,400,label('今回の問い',600,115,{size:26,color:C.dim,anchor:'middle'})
   +T(`\\dfrac{${vv}^2}{${rr}}`,470,215,{size:56})+label('は どこから 来る？',560,225,{size:32,color:C.hi,weight:700})
   +fade(seg(p,.4,.6),label('回る観測者には 何が見える？',600,360,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.12),C.hi);
  return s;
 },
 [K+'setup']:(p)=>{
  const th=p*2.4;let s=base();
  const [bx,by]=P(th),[dx,dy]=vdir(th);
  s+=line(CX,CY,bx,by,{color:C.x,w:2.5})+label('r',(CX+bx)/2+10,(CY+by)/2-10,{size:28,color:C.x,weight:700});
  s+=arrow(bx,by,bx+dx*120,by+dy*120,{color:C.v,w:6})+dot(bx,by,13,C.hi)+T(vv,bx+dx*120+20,by+dy*120,{size:32});
  s+=card(620,120,540,260,label('速さ v は 一定',890,190,{size:30,color:C.v,anchor:'middle'})+label('半径 r',890,250,{size:30,color:C.x,anchor:'middle'})
   +label('反時計回り',890,310,{size:28,color:C.dim,anchor:'middle'}),seg(p,.1,.25));
  return s;
 },
 [K+'arc']:(p)=>{
  let s=twoPoints({radii:seg(p,.4,.6),arcG:seg(p,.1,.35),ang:seg(p,.6,.8)})+BIG();
  s+=card(660,130,500,240,label('短い時間 Δt で',910,190,{size:28,color:C.t,anchor:'middle'})
   +label('弧に沿って vΔt 進む',910,250,{size:28,color:C.x,anchor:'middle'})
   +fade(seg(p,.6,.8),label('中心から見た角 Δθ',910,320,{size:28,color:C.E,anchor:'middle'})),seg(p,.1,.3));
  return s;
 },
 [K+'angle']:(p)=>{
  let s=twoPoints({})+BIG();
  s+=card(620,50,540,420,label('ラジアンでは',890,100,{size:26,color:C.dim,anchor:'middle'})
   +label('弧の長さ ＝ 半径 × 角',890,160,{size:30,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.35,.55),T(`${vv}${dt}=${rr}${dth}`,890,240,{size:46}))
   +fade(seg(p,.6,.8),T(`${dth}=\\dfrac{${vv}${dt}}{${rr}}`,890,385,{size:50})+highlight(760,314,260,116,1,C.E)),seg(p,0,.12));
  return s;
 },
 [K+'perp']:(p)=>{
  let s=twoPoints({arcG:.4,vel:seg(p,.1,.3),rightAng:seg(p,.25,.4)})+BIG();
  s+=card(660,110,500,290,label('速度は 半径と 直角',910,170,{size:28,color:C.v,anchor:'middle'})
   +fade(seg(p,.45,.65),label('半径が Δθ 回ると',910,250,{size:28,color:C.ink,anchor:'middle'})+label('速度の矢印も Δθ 回る',910,310,{size:30,color:C.E,anchor:'middle',weight:700})),seg(p,.2,.35));
  return s;
 },
 [K+'tails']:(p)=>{
  let s=fade(.6,twoPoints({arcG:.3,vel:1,ang:.5}))+BIG();
  s+=tails({g:seg(p,.05,.3),ang:seg(p,.45,.65)});
  return s;
 },
 [K+'dv']:(p)=>{
  let s=fade(.6,twoPoints({arcG:.3,vel:1,ang:.5}))+BIG();
  s+=tails({dv:seg(p,.1,.4)});
  s+=fade(seg(p,.45,.65),T(`${DV}=${V2}-${V1}`,880,80,{size:34}));
  s+=fade(seg(p,.65,.85),label('細長い 二等辺三角形の 底辺',1180,500,{size:24,color:C.hi,anchor:'end'}));
  return s;
 },
 [K+'arcapprox']:(p)=>{
  let s=fade(.35,twoPoints({arcG:.3,vel:1,ang:.5}))+BIG();
  s+=tails({dv:1,arcG:seg(p,.1,.35)});
  s+=fade(seg(p,.2,.4),label('半径 v の弧：長さ vΔθ',1180,110,{size:24,color:C.x,anchor:'end'}));
  s+=card(40,60,520,150,T(`|${DV}|\\approx${vv}${dth}`,300,150,{size:48}),seg(p,.6,.8),C.hi);
  return s;
 },
 [K+'dir']:(p)=>{
  let s=base();
  const [x1,y1]=P(-DT),[x2,y2]=P(DT),[mx,my]=P(0);
  s+=fade(.5,dot(x1,y1,10,C.hi)+dot(x2,y2,10,C.hi));
  s+=dot(mx,my,8,C.dim)+label('真ん中',mx+14,my-14,{size:22,color:C.dim});
  s+=arrow(mx,my,mx-134,my,{color:C.hi,w:6,g:seg(p,.45,.7)})+fade(seg(p,.6,.75),T(DV,mx-70,my+44,{size:30}));
  s+=fade(seg(p,.65,.8),line(mx-134,my,CX,CY,{color:C.hi,w:2,dash:'6 6'})+ring(CX,CY,14,{color:C.hi,w:3}));
  s+=card(620,90,540,330,T(`\\approx`,890,165,{size:52})
   +label('Δθ が小さいほど 正確になる 近似',890,235,{size:26,color:C.ink,anchor:'middle'})
   +fade(seg(p,.45,.65),label('向き：円の中心向き',890,320,{size:30,color:C.hi,anchor:'middle',weight:700})+label('（初級で見た）',890,370,{size:24,color:C.dim,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 [K+'divide']:(p)=>alg(p,0),
 [K+'subst']:(p)=>alg(p,1),
 [K+'result']:(p)=>alg(p,2),
 [K+'num']:(p)=>numTable(p,1),
 [K+'num2']:(p)=>numTable(p,2),
 [K+'num3']:(p)=>numTable(p,3),
 [K+'omega']:(p)=>{
  let s=card(140,40,920,440,
   label('単位',300,120,{size:26,color:C.dim,anchor:'middle'})+T(`\\dfrac{(\\mathrm{m/s})^2}{\\mathrm{m}}=\\mathrm{m/s^2}`,640,115,{size:40})+label('加速度 ✓',930,122,{size:26,color:C.F})
   +fade(seg(p,.45,.6),label('v ＝ rω を入れる',300,260,{size:26,color:C.dim,anchor:'middle'})+T(`${aa}=\\dfrac{(${rr}${om})^2}{${rr}}=${rr}${om}^2`,680,255,{size:44}))
   +fade(seg(p,.75,.9),T(`=1\\times2^2=4\\ \\mathrm{m/s^2}`,680,380,{size:40,color:C.a})+label('ω ＝ 2 rad/s',300,388,{size:26,color:C.p,anchor:'middle'})),seg(p,0,.1));
  return s;
 },
 [K+'kind']:(p)=>{
  let s=card(100,40,1000,440,
   label('使ったもの',600,95,{size:26,color:C.dim,anchor:'middle'})
   +label('① 加速度の定義（Δ𝐯/Δt の行き先）',200,165,{size:28,color:C.ink})
   +fade(seg(p,.15,.3),label('② 弧 ＝ 半径 × 角（ラジアン）',200,225,{size:28,color:C.ink}))
   +fade(seg(p,.3,.45),label('③ Δt を 0 に近づける',200,285,{size:28,color:C.ink}))
   +fade(seg(p,.6,.8),T(`${aa}=\\dfrac{${vv}^2}{${rr}}`,420,395,{size:48})+label('＝ 導いた結果（法則ではない）',560,405,{size:30,color:C.hi,weight:700})),seg(p,0,.1));
  return s;
 },
 [K+'table']:(p)=>{
  const a=p*3;let s=disc({rot:a,bth:a});
  const [bx,by]=P(a);s+=label('0.5 kg',bx+18,by-18,{size:24,color:C.hi});
  s+=label('回る台（なめらか）',20,40,{size:24,color:C.dim});
  s+=card(620,100,540,300,label('ω ＝ 2 rad/s',890,170,{size:32,color:C.p,anchor:'middle'})
   +fade(seg(p,.35,.5),label('中心から 1 m',890,240,{size:30,color:C.x,anchor:'middle'}))
   +fade(seg(p,.5,.7),label('0.5 kg の球を 糸でつなぐ',890,310,{size:28,color:C.hi,anchor:'middle'})),seg(p,.05,.2));
  return s;
 },
 [K+'ground']:(p)=>{
  const a=p*3;let s=disc({rot:a,bth:a})+label('地面から見る',20,40,{size:26,color:C.x,weight:700});
  const [bx,by]=P(a),[dx,dy]=vdir(a);
  s+=arrow(bx,by,bx+dx*110,by+dy*110,{color:C.v,w:6});
  s+=fade(seg(p,.4,.6),inward(a,100,{color:C.a}));
  s+=card(620,90,540,330,T(`${vv}=${rr}${om}=1\\times2=2\\ \\mathrm{m/s}`,890,165,{size:36})
   +fade(seg(p,.4,.6),label('中心向きの加速度',890,250,{size:26,color:C.a,anchor:'middle'})+T(`${rr}${om}^2=1\\times2^2=4\\ \\mathrm{m/s^2}`,890,320,{size:36})),seg(p,.05,.2));
  return s;
 },
 [K+'groundF']:(p)=>{
  const a=.7;let s=disc({rot:a,bth:a})+label('地面から見る',20,40,{size:26,color:C.x,weight:700});
  s+=inward(a,110,{color:C.F});const [bx,by]=P(a);
  s+=fade(seg(p,.3,.5),label('糸が引く 2 N',bx-40,by-40,{size:24,color:C.F,anchor:'end',weight:700}));
  s+=card(620,90,540,330,T(`m${aa}=0.5\\times4=2\\ \\mathrm{N}`,890,165,{size:40})
   +fade(seg(p,.3,.5),label('糸が引く 実在の力（相手：糸）',890,250,{size:26,color:C.F,anchor:'middle'}))
   +fade(seg(p,.6,.8),label('向心力',890,340,{size:36,color:C.F,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'noOut']:(p)=>{
  const a=.7;let s=disc({rot:a,bth:a})+label('地面から見る',20,40,{size:26,color:C.x,weight:700});
  s+=inward(a,110,{color:C.F});
  const [bx,by]=P(a),u=[Math.cos(a),-Math.sin(a)],[dx,dy]=vdir(a);
  s+=fade(seg(p,.05,.25),line(bx+u[0]*20,by+u[1]*20,bx+u[0]*110,by+u[1]*110,{color:C.a,w:3,dash:'6 6'})+label('✕ 外向きの力',bx+u[0]*110+10,by+u[1]*110,{size:24,color:C.a,weight:700}));
  s+=fade(seg(p,.5,.7),draw([[bx,by],[bx+dx*260,by+dy*260]],1,{color:C.v,w:3,dash:'8 6'})+label('糸がなければ 接線の方向へ',bx+dx*260-10,by+dy*260-14,{size:24,color:C.v,anchor:'middle'}));
  return s;
 },
 [K+'rotView']:(p)=>{
  let s=disc({rot:0,bth:0,obs:1,obsAng:Math.PI*1.1})+label('台と一緒に回る人から見る',20,40,{size:26,color:C.hi,weight:700});
  s+=card(620,130,540,250,label('球は 止まって見える',890,200,{size:30,color:C.ink,anchor:'middle'})+fade(seg(p,.4,.6),T(`${col(C.a,"a'")}=0`,890,300,{size:52})),seg(p,.1,.3),C.hi);
  return s;
 },
 [K+'mismatch']:(p)=>{
  let s=disc({rot:0,bth:0,obs:1,obsAng:Math.PI*1.1})+label('台と一緒に回る人から見る',20,40,{size:26,color:C.hi,weight:700});
  s+=inward(0,110,{color:C.F})+label('糸 2 N',CX+R-60,CY-24,{size:24,color:C.F,anchor:'middle'});
  s+=card(620,110,540,290,label('左辺',760,170,{size:24,color:C.dim,anchor:'middle'})+T(`m${col(C.a,"a'")}=0`,760,230,{size:40})
   +label('右辺（実在の力）',1020,170,{size:24,color:C.dim,anchor:'middle'})+T(`${col(C.F,'F')}=2\\,\\mathrm{N}`,1020,230,{size:40})
   +fade(seg(p,.4,.6),label('合わない ✕',890,330,{size:32,color:C.a,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'link']:(p)=>{
  const a=p*2;let s=disc({rot:a,bth:a,string:0,ball:0})+label('地面から見た 台の上の点',20,40,{size:26,color:C.x,weight:700});
  const [bx,by]=P(a);s+=dot(bx,by,10,C.dim)+ring(bx,by,16,{color:C.dim,w:2});
  s+=fade(seg(p,.2,.4),inward(a,100,{color:C.a}));
  s+=card(620,90,540,330,label('台の上の この点の加速度',890,150,{size:26,color:C.ink,anchor:'middle'})
   +fade(seg(p,.2,.4),label('中心向き',890,210,{size:28,color:C.a,anchor:'middle'})+T(`${rr}${om}^2`,890,275,{size:44}))
   +fade(seg(p,.55,.75),label('＝ 観測者の加速度 A',890,370,{size:32,color:C.a,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'cf']:(p)=>{
  let s=disc({rot:0,bth:0,obs:1,obsAng:Math.PI*1.1})+label('台と一緒に回る人から見る',20,40,{size:26,color:C.hi,weight:700});
  s+=inward(0,110,{color:C.F})+label('糸 2 N',CX+R-60,CY-24,{size:24,color:C.F,anchor:'middle'});
  s+=fade(seg(p,.1,.3),outward(0,110)+label('遠心力',CX+R+40,CY+56,{size:24,color:C.F,weight:700}));
  s+=card(620,60,540,400,T(`-m${col(C.a,'A')}`,890,120,{size:40})+label('外向き',1010,128,{size:26,color:C.F})
   +fade(seg(p,.1,.3),T(`m${rr}${om}^2`,890,200,{size:46})+label('遠心力',1040,208,{size:28,color:C.F,weight:700}))
   +fade(seg(p,.45,.65),T(`0.5\\times1\\times2^2=2\\ \\mathrm{N}`,890,290,{size:40}))
   +fade(seg(p,.7,.85),label('糸 2 N と つり合う：a′ ＝ 0 ✓',890,390,{size:28,color:C.F,anchor:'middle',weight:700})),seg(p,0,.1));
  return s;
 },
 [K+'coriolis']:(p)=>{
  let s=disc({rot:0,bth:0,obs:1,obsAng:Math.PI*1.1});
  s+=outward(0,110)+inward(0,110,{color:C.F});
  s+=card(620,100,540,310,label('台の上を 動く物体には',890,160,{size:28,color:C.ink,anchor:'middle'})
   +label('コリオリ力 という 別の項も',890,220,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.45,.65),label('今回：台の上で 止まっている物体だけ',890,320,{size:26,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'cut']:(p)=>{
  const a0=0;let s=disc({rot:p*2,bth:0,string:0,ball:0,rb:R})+label('地面から見る',20,40,{size:26,color:C.x,weight:700});
  const t=.55*seg(p,.2,.9),[x0,y0]=P(a0),bx=x0,by=y0-2*t*R/1;
  s+=fade(seg(p,.05,.2),label('✂',x0+22,y0+30,{size:28,color:C.dim}));
  s+=draw([[x0,y0],[bx,by]],1,{color:C.hi,w:3,dash:'6 6'})+dot(bx,by,14,C.hi)+arrow(bx,by,bx,by-80,{color:C.v,w:6});
  s+=card(660,140,500,200,label('地面から見ると',910,200,{size:26,color:C.x,anchor:'middle'})+label('接線の方向へ まっすぐ',910,265,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.4,.6));
  return s;
 },
 [K+'cut2']:(p)=>{
  let s=disc({rot:0,bth:0,string:0,ball:0,obs:1,obsAng:Math.PI*1.1})+label('台と一緒に回る人から見る',20,40,{size:26,color:C.hi,weight:700});
  const tt=.7*seg(p,.05,.6),S=R;
  const pts=Array.from({length:41},(_,i)=>{const t=tt*i/40,x=Math.cos(2*t)+2*t*Math.sin(2*t),y=-Math.sin(2*t)+2*t*Math.cos(2*t);return [CX+S*x,CY-S*y];});
  s+=draw(pts,1,{color:C.hi,w:3,dash:'6 6'})+dot(pts[40][0],pts[40][1],14,C.hi);
  s+=card(660,90,500,340,label('台から見ると',910,140,{size:26,color:C.hi,anchor:'middle'})+label('外へ 離れていく',910,195,{size:30,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.5,.7),label('「遠心力で 外へ引かれる」',910,275,{size:26,color:C.F,anchor:'middle'})+label('「慣性で まっすぐ進む」',910,325,{size:26,color:C.v,anchor:'middle'})
   +label('同じ現象の 二つの語り方',910,395,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.3,.45));
  return s;
 },
 [K+'panels']:(p)=>{
  const pan=(x0,title,rot)=>{const cx=x0+230,cy=275,rb=130;let q=disc({cx,cy,rad:160,rb,bth:0,rot:0,obs:rot?1:0,obsAng:Math.PI*1.1});
   q+=inward(0,90,{color:C.F,cx,cy,rb})+label('糸 2 N',cx+rb-50,cy-26,{size:22,color:C.F,anchor:'middle'});
   if(rot)q+=outward(0,90,{cx,cy,rb})+label('遠心力 2 N',cx+rb+10,cy+56,{size:22,color:C.F});
   else q+=arrow(cx+rb,cy+30,cx+rb-70,cy+30,{color:C.a,w:5})+label('a ＝ 4 m/s²',cx+rb-40,cy+68,{size:22,color:C.a,anchor:'middle'});
   q+=label(rot?'2 − 2 ＝ 0 → 止まって見える':'ma ＝ 0.5×4 ＝ 2 N',x0+280,470,{size:24,color:C.ink,anchor:'middle'});
   return panel(x0,title,rot?C.hi:C.x,q);};
  let s=fade(seg(p,0,.15),pan(30,'地面から見た式',0));
  s+=fade(seg(p,.35,.5),pan(610,'回る観測者の式',1));
  return s;
 },
 [K+'station']:(p)=>stationPic(p,0),
 [K+'station2']:(p)=>stationPic(p,1),
 [K+'sum1']:(p)=>summary(p,1),
 [K+'sum2']:(p)=>summary(p,2),
 [K+'next']:(p)=>{
  const ex=300,ey=265,rr2=190,th=.3+p*1.4,mx=ex+rr2*Math.cos(th),my=ey-rr2*Math.sin(th);
  let s=ring(ex,ey,rr2,{color:C.faint,w:2.5,dash:'8 8'})+`<circle cx="${ex}" cy="${ey}" r="60" fill="#4d8fe0" fill-opacity=".55" stroke="#4d8fe0" stroke-width="3"/>`+label('地球',ex,ey+9,{size:26,color:C.ink,anchor:'middle'});
  s+=dot(mx,my,18,'#c8ccd6')+label('月',mx+26,my-18,{size:26,color:'#c8ccd6'});
  s+=fade(seg(p,.4,.6),arrow(mx,my,mx+(ex-mx)*.45,my+(ey-my)*.45,{color:C.F,w:6})+label('？',mx+(ex-mx)*.45+14,my+(ey-my)*.45-8,{size:30,color:C.F,weight:700}));
  s+=label('大きさの比は 正しくない',20,500,{size:22,color:C.dim});
  s+=card(640,150,520,190,label('糸はない',900,210,{size:28,color:C.ink,anchor:'middle'})+label('月を曲げる 中心向きの力は？',900,280,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.35));
  return s;
 },
 [K+'next2']:(p)=>{
  let s='';
  // apple tree-ish
  s+=line(150,470,150,300,{color:'#8a6a4a',w:10})+`<circle cx="150" cy="260" r="80" fill="#2f6b45" fill-opacity=".6"/>`+line(40,470,400,470,{color:C.dim,w:3});
  const ay=300+150*seg(p,.1,.5);s+=dot(200,ay,14,'#e05a5a');
  s+=fade(seg(p,.2,.4),arrow(240,300,240,380,{color:C.F,w:5})+label('地上の重力',255,350,{size:24,color:C.F}));
  s+=card(560,130,600,240,label('リンゴを落とす力',860,190,{size:30,color:C.ink,anchor:'middle'})+label('＝ 月を曲げる力 ？',860,260,{size:34,color:C.hi,anchor:'middle',weight:700})
   +label('次の問い',860,330,{size:24,color:C.dim,anchor:'middle'}),seg(p,.3,.5),C.hi);
  return s;
 },
};

function alg(p,k){
 let s=card(100,30,1000,460,'',1);
 s+=T(`|${DV}|\\approx${vv}${dth}`,330,95,{size:36})+label('前の結果',620,102,{size:22,color:C.dim});
 s+=T(`${dth}=\\dfrac{${vv}${dt}}{${rr}}`,860,95,{size:36});
 const g0=k===0?seg(p,.05,.3):1;
 s+=fade(g0,T(`\\dfrac{|${DV}|}{${dt}}\\approx\\dfrac{${vv}${dth}}{${dt}}`,600,190,{size:42}));
 if(k===0)s+=fade(seg(p,.5,.7),label('Δt で割る',880,200,{size:26,color:C.t}));
 if(k>=1){
  const g1=k===1?seg(p,.1,.35):1;
  const e0=`=\\dfrac{${vv}}{${dt}}\\times\\dfrac{${vv}${dt}}{${rr}}`,e1=`=\\dfrac{${vv}}{${col(C.a,'\\cancel{'+dt+'}')}}\\times\\dfrac{${vv}${col(C.a,'\\cancel{'+dt+'}')}}{${rr}}`;
  const cut=k===1?seg(p,.7,.85):1;
  s+=fade(g1*(1-cut),T(e0,600,310,{size:42}))+fade(g1*cut,T(e1,600,310,{size:42}));
  const w=texWidth(`=\\dfrac{v}{\\Delta t}\\times\\dfrac{v\\Delta t}{r}`,42,false),wf=texWidth(`\\dfrac{v\\Delta t}{r}`,42,false);
  if(k===1){s+=fade(seg(p,.45,.6)*(1-seg(p,.7,.8)),highlight(600+w/2-wf-12,262,wf+24,96,1,C.E))+fade(seg(p,.45,.6),label('Δθ を代入',880,300,{size:26,color:C.E}));
   s+=fade(cut,label('Δt が 約分で消える',880,350,{size:26,color:C.a}));}
 }
 if(k===2){
  s+=fade(seg(p,.05,.25),T(`=\\dfrac{${vv}^2}{${rr}}`,600,428,{size:44}));
  s+=fade(seg(p,.35,.55),label('Δt → 0 で ≈ が ＝ に',880,255,{size:26,color:C.dim}));
  s+=fade(seg(p,.55,.75),T(`${aa}=\\dfrac{${vv}^2}{${rr}}`,920,395,{size:52})+highlight(820,322,200,114,1,C.a)+label('向心加速度',920,470,{size:24,color:C.a,anchor:'middle'}));
 }
 return s;
}
function numTable(p,k){
 let s=card(100,30,1000,460,'',1);
 const xs=[250,500,760],hd=['Δt [s]','Δθ [rad]','|Δ𝐯|/Δt [m/s²]'],hc=[C.t,C.E,C.a];
 hd.forEach((h,i)=>s+=label(h,xs[i],85,{size:26,color:hc[i],anchor:'middle',weight:700}));
 s+=line(140,105,1060,105,{color:C.faint,w:2});
 s+=label('v ＝ 2 m/s、r ＝ 1 m',1080,470,{size:22,color:C.dim,anchor:'end'});
 const rows=[['0.1','0.2','≈ 3.99'],['0.01','0.02','≈ 3.9999'],['→ 0','','→ 4']];
 const g=[k===1?seg(p,.2,.45):1,k===2?seg(p,.02,.25):k>2?1:0,k===2?seg(p,.5,.75):k>2?1:0];
 rows.forEach((r,j)=>{if(g[j]<=0)return;s+=fade(g[j],r.map((v,i)=>label(v,xs[i],165+j*75,{size:32,color:j===2?C.hi:C.ink,anchor:'middle',weight:j===2?700:400})).join(''));});
 if(k>=2)s+=fade(k===2?seg(p,.6,.8):1,T(`\\dfrac{${vv}^2}{${rr}}=\\dfrac{2^2}{1}=4`,960,318,{size:30}));
 if(k===1)s+=fade(seg(p,.5,.7),label('Δθ ＝ vΔt/r ＝ 2×0.1÷1',500,420,{size:26,color:C.E,anchor:'middle'}));
 if(k>=2)s+=fade(k===2?seg(p,.8,.95):1,label('初級：90° で 3.6、30° で 3.95 → 同じ行き先 4',600,420,{size:28,color:C.hi,anchor:'middle'}));
 return s;
}
function stationPic(p,k){
 const cx=300,cy=265,ro=220,ri=180,a=p*.5;
 let s=`<circle cx="${cx}" cy="${cy}" r="${ro}" fill="none" stroke="${C.dim}" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="${ri}" fill="none" stroke="${C.faint}" stroke-width="2"/>`;
 s+=`<path d="M ${cx-ro} ${cy} A ${ro} ${ro} 0 1 0 ${cx+ro} ${cy} A ${ro} ${ro} 0 1 0 ${cx-ro} ${cy} M ${cx-ri} ${cy} A ${ri} ${ri} 0 1 1 ${cx+ri} ${cy} A ${ri} ${ri} 0 1 1 ${cx-ri} ${cy}" fill="${DISK}" fill-rule="evenodd"/>`;
 for(let j=0;j<4;j++){const b=a+j*Math.PI/2;s+=line(cx+30*Math.cos(b),cy-30*Math.sin(b),cx+ri*Math.cos(b),cy-ri*Math.sin(b),{color:C.faint,w:6});}
 s+=ring(cx,cy,30,{color:C.dim,w:3,fill:C.bg});
 // person standing on outer floor at bottom (angle -90° + rotation), head toward center
 const pa=-Math.PI/2+a,fx=cx+ro*Math.cos(pa),fy=cy-ro*Math.sin(pa);
 const hx=cx+(ro-70)*Math.cos(pa),hy=cy-(ro-70)*Math.sin(pa);
 s+=line(fx,fy,hx,hy,{color:C.hi,w:5})+ring(cx+(ro-80)*Math.cos(pa),cy-(ro-80)*Math.sin(pa),10,{color:C.hi,w:3,fill:C.bg});
 const u=[-Math.cos(pa),Math.sin(pa)];
 if(!k)s+=fade(seg(p,.35,.55),arrow(fx+20*(-Math.sin(pa)),fy+20*(-Math.cos(pa)),fx+20*(-Math.sin(pa))+u[0]*90,fy+20*(-Math.cos(pa))+u[1]*90,{color:C.F,w:6})+label('緑：床が押す力（中心向き）',20,500,{size:24,color:C.F}));
 else s+=dashArrow(hx-u[0]*0+22*Math.sin(pa),hy+22*Math.cos(pa),hx+22*Math.sin(pa)-u[0]*110,hy+22*Math.cos(pa)-u[1]*110,{})+label('破線：外向きの慣性力 mrω²',20,500,{size:24,color:C.F});
 s+=label(k?'一緒に回る人から見る':'宇宙の 回るステーション',20,40,{size:24,color:k?C.hi:C.dim,weight:k?700:400});
 if(!k)s+=card(620,120,540,260,label('外周の床が',890,190,{size:28,color:C.ink,anchor:'middle'})+label('人を 中心向きに押す',890,250,{size:30,color:C.F,anchor:'middle',weight:700})+label('＝ 向心力',890,320,{size:28,color:C.F,anchor:'middle'}),seg(p,.4,.6));
 else s+=card(620,50,540,420,label('外向き rω² を 重さのように感じる',890,100,{size:26,color:C.ink,anchor:'middle'})
  +fade(seg(p,.2,.4),T(`${rr}${om}^2=9.8`,890,175,{size:40})+label('r ＝ 100 m',1050,182,{size:24,color:C.x}))
  +fade(seg(p,.4,.6),T(`${om}^2=0.098,\\ \\ ${om}\\approx0.31\\ \\mathrm{rad/s}`,890,265,{size:36}))
  +fade(seg(p,.65,.85),T(`${col(C.t,'T')}=\\dfrac{2\\pi}{${om}}\\approx20\\ \\mathrm{s}`,890,370,{size:40})+label('約20秒で1周',890,440,{size:26,color:C.t,anchor:'middle'})),seg(p,0,.1));
 return s;
}
function summary(p,k){
 let s=rect(100,50,1000,420,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:14});
 const L=[
  ()=>label('速度の矢印が Δθ 回る →',150,135,{size:28,color:C.ink})+T(`|${DV}|\\approx${vv}${dth}`,640,128,{size:38})
   +label('Δt で割る →',150,235,{size:28,color:C.ink})+T(`${aa}=\\dfrac{${vv}^2}{${rr}}=${rr}${om}^2`,640,228,{size:44}),
  ()=>label('地面：実在するのは 中心向きの力だけ（向心力）',150,330,{size:28,color:C.F})+label('遠心力 mrω²：回る観測者の式にだけ入れる慣性力',150,400,{size:28,color:C.hi}),
 ];
 for(let i=0;i<k;i++)s+=fade(i===k-1?seg(p,.02,.18):1,L[i]());
 return s;
}

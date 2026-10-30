import {text,line,circle,arrow,path,C} from './all-film-visuals.mjs';
const ring=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#62728c" stroke-width="2"/>`;
const ease=p=>{p=Math.max(0,Math.min(1,p));return p*p*(3-2*p);};
const lerp=(a,b,p)=>a+(b-a)*p;
const arc=(cx,cy,r,a,b,color,width=4)=>path(Array.from({length:65},(_,i)=>[cx+r*Math.cos(a+(b-a)*i/64),cy+r*Math.sin(a+(b-a)*i/64)]),color,width);
const label=(s,x,y,color=C.ink,size=27)=>text(s,x,y,size,color);
/** Full-width diagrams, with labels tied to the actual geometry. No equations. */
export function clarityDiagram(kind,phase,k,t){
 // Finish the motion before speech ends, leaving time to inspect the result.
 const p=ease(phase/.65);
 if(['orbit','release','gravity','circumference','reaction','acceleration'].includes(kind)){
  const cx=390,cy=255,R=175,a=kind==='circumference'?2*Math.PI*Math.min(1,phase/.85):t*.52;
  if(kind==='release'){
   // One continuous, constant-speed departure, never a modulo-time reset.
   const angle=.1,q=Math.max(0,Math.min(1,phase)),sx=cx+R*Math.cos(angle),sy=cy-R*Math.sin(angle);
   const x=sx-145*q*Math.sin(angle),y=sy-145*q*Math.cos(angle);
   return ring(cx,cy,R)+line(sx,sy,sx-145*Math.sin(angle),sy-145*Math.cos(angle),C.cyan,2,'7 5')+circle(x,y,14,C.gold)+arrow(x,y,x-65*Math.sin(angle),y-65*Math.cos(angle),C.cyan)+label('ひもを切った後',750,125)+label('青：球の速度',750,200,C.cyan)+label('水平な合力は0',750,275,C.gold)+label('球は切れた瞬間の速度の向きへ進む',620,350,C.ink,25);
  }
  const gravity=kind==='gravity'||kind==='circumference',x=cx+R*Math.cos(a),y=cy-R*Math.sin(a);
  let s=ring(cx,cy,R)+circle(cx,cy,gravity?38:8,gravity?'#315c9d':C.gold)+line(cx,cy,x,y,C.gold,2,'6 5')+circle(x,y,14,C.purple)+arrow(x,y,x-88*Math.sin(a),y-88*Math.cos(a),C.cyan)+arrow(x,y,x-75*Math.cos(a),y+75*Math.sin(a),C.red);
  s+=label(gravity?'地球 M':kind==='reaction'?'ひもを持つ手':'固定した中心',250,35,gravity?C.red:C.ink)+label(gravity?'紫の点：衛星 m':'紫の点：球 m',720,120,C.purple)+label('青：進む速度',720,180,C.cyan)+label(kind==='acceleration'?'赤：中心向きの加速度':'赤：球を中心へ引く力',720,240,C.red)+label('黄：中心からの距離 r',720,300,C.gold);
  if(gravity)s=s.replace('赤：球を中心へ引く力','赤：衛星を引く万有引力');
  if(kind==='reaction')s+=arrow(cx,cy,cx+75*Math.cos(a),cy-75*Math.sin(a),C.purple)+label('紫：手を外へ引く力',720,365,C.purple)+label('二つの力は、受け手が違う',650,440,C.ink,27);
  if(kind==='circumference')s+=arc(cx,cy,R,0,-a,C.gold,5)+label('黄色の弧：衛星が進んだ道のり',620,370,C.gold,26)+label('一周の長さ：2πr',730,435,C.gold,30);
  return s;
 }
 if(['compare','double'].includes(kind)){
  const double=kind==='double';let s='';
  for(let j=0;j<2;j++){
   const cx=290+j*570,cy=250,R=double?155:(j?175:87.5),w=double?(j?1.1:.55):(j?.2:1.6),a=t*w;
   const x=cx+R*Math.cos(a),y=cy-R*Math.sin(a),v=double?(j?100:50):(j?45:90);
   s+=ring(cx,cy,R)+circle(cx,cy,double?7:22,double?C.dim:'#315c9d')+circle(x,y,13,C.purple)+arrow(x,y,x-v*Math.sin(a),y-v*Math.cos(a),C.cyan);
   if(double){const f=j?140:35;s+=arrow(x,y,x-f*Math.cos(a),y+f*Math.sin(a),C.red);}
   s+=label(double?(j?'速さ2倍・力4倍':'元の速さ・元の力'):(j?'半径4倍・周期8倍':'基準の円軌道'),cx-150,40,C.ink,30);
  }
  return s+label(double?'青：速度　赤：中心向きの力':'半径の比は見やすく圧縮。周期の比は8倍。',double?365:245,480,C.dim,26);
 }
 if(['velocity-change','velocity-add'].includes(kind)){
  const cx=250,cy=245,R=145,h=.85;
  const pos=[h/2,-h/2].map(a=>[cx+R*Math.cos(a),cy+R*Math.sin(a)]);
  const vel=[h/2,-h/2].map(a=>[105*Math.sin(a),-105*Math.cos(a)]);
  const slide=kind==='velocity-add'?1:k>=2?p:0;
  let s=ring(cx,cy,R)+circle(cx,cy,6,C.gold);
  for(let j=0;j<2;j++){
   const [x,y]=pos[j];const ox=lerp(x,780,slide),oy=lerp(y,165,slide);
   s+=circle(x,y,12,C.purple)+line(cx,cy,x,y,C.gold,2)+label(j?'後の位置':'前の位置',x+22,y+5);
   s+=arrow(ox,oy,ox+vel[j][0],oy+vel[j][1],C.cyan)+label(j?'後の速度':'前の速度',ox+vel[j][0]+(j?-140:15),oy+vel[j][1]+28,C.cyan,25);
  }
  if(kind==='velocity-add'){
   const a=[780+vel[0][0],165+vel[0][1]],b=[780+vel[1][0],165+vel[1][1]];
   s+=arrow(...a,lerp(a[0],b[0],p),lerp(a[1],b[1],p),C.red);
   s+=label('前の先端 → 後の先端',665,335,C.red)+label('前の速度 ＋ 赤い矢印 → 後の速度',520,390,C.ink,25);
  }else s+=label('矢印の長さは同じ',700,355,C.cyan)+label('向きが違う',700,398,C.gold);
  return s;
 }
 if(['triangles','correspondence','similarity'].includes(kind)){
  const h=.95,R=280,V=190,d=R*Math.sin(h/2),x=200+R*Math.cos(h/2);
  const y=135,oy=450,dx=V*Math.sin(h/2),dy=-V*Math.cos(h/2);
  const pulse=3+3*Math.sin(Math.PI*p);
  let s=arrow(200,y,x,y-d,C.gold)+arrow(200,y,x,y+d,C.gold)+line(x,y-d,x,y+d,C.green,kind==='correspondence'?pulse:4);
  s+=arc(200,y,65,-h/2,h/2,C.gold)+label('θ',275,143,C.gold);
  s+=label('r',310,48,C.gold)+label('r',310,235,C.gold)+label('ℓ',x+20,145,C.green);
  s+=arrow(300,oy,300+dx,oy+dy,C.cyan)+arrow(300,oy,300-dx,oy+dy,C.cyan)+arrow(300+dx,oy+dy,300-dx,oy+dy,C.red);
  s+=arc(300,oy,55,-Math.PI/2-h/2,-Math.PI/2+h/2,C.gold)+label('θ',291,370,C.gold);
  s+=label('v',345,380,C.cyan)+label('v',220,380,C.cyan)+label('Δv',405,280,C.red);
  s+=label('上：位置の三角形',650,70)+label('半径 r ・ 半径 r ・ 直線距離 ℓ',650,117,C.gold,24)+label('θ：二本の間の角度',650,155,C.dim,23);
  s+=label('下：速度の三角形',650,295)+label('速さ v ・ 速さ v ・ 変化の長さ Δv',650,342,C.cyan,24);
  if(kind==='correspondence')s+=label('対応する辺：r と v',680,192,C.gold)+label('対応する辺：ℓ と Δv',680,407,C.red);
  if(kind==='similarity'){
   // Rotate/scale a copy of the upper triangle onto the lower triangle.
   const angle=-90*p,scale=1+(V/R-1)*p;
   s+=`<g opacity=".55" transform="translate(${lerp(200,300,p)} ${lerp(y,oy,p)}) rotate(${angle}) scale(${scale})">${path([[0,0],[R*Math.cos(h/2),-d],[R*Math.cos(h/2),d],[0,0]],C.ink,3)}</g>`;
   s+=label('回して縮めると、辺が重なる',650,195,C.ink,25);
  }
  return s;
 }
 if(kind==='right-angle'){
  const cx=410,cy=290,R=200,h=.95,turn=-Math.PI/2*p;
  let s=label('二本を同じだけ回す',670,100);
  for(const a of [-h/2,h/2]){
   s+=arrow(cx,cy,cx+R*Math.cos(a),cy+R*Math.sin(a),C.gold);
   s+=arrow(cx,cy,cx+R*Math.cos(a+turn),cy+R*Math.sin(a+turn),C.cyan);
  }
  s+=arc(cx,cy,75,-h/2+turn,h/2+turn,C.cyan);
  s+=label('黄色：半径の向き',710,205,C.gold)+label('青色：90°回した向き',710,253,C.cyan)+label('速度は半径と直角',710,310)+label('二本の間の角度は同じ',710,365,C.gold);
  return s;
 }
 if(['arc-chord','limit'].includes(kind)){
  const h=kind==='limit'?lerp(1.1,.1,p):1.1,cx=235,cy=240,R=165;
  const a=[cx+R*Math.cos(h/2),cy-R*Math.sin(h/2)],b=[a[0],cy+R*Math.sin(h/2)];
  let s=ring(cx,cy,R)+arc(cx,cy,R,-h/2,h/2,C.gold,6)+line(...a,...b,C.green,5)+circle(...a,9,C.purple)+circle(...b,9,C.purple);
  s+=label('球が通った円弧',50,450,C.gold)+label('二点間の直線',330,450,C.green);
  // Magnify the same chord to a constant height: curvature visibly tends to zero.
  const scale=300/(2*R*Math.sin(h/2)),xx=760,yy=245;
  s+=path(Array.from({length:65},(_,i)=>{const v=-h/2+h*i/64;return[xx+(R*Math.cos(v)-R*Math.cos(h/2))*scale,yy+R*Math.sin(v)*scale];}),C.gold,6);
  s+=line(xx,95,xx,395,C.green,5)+label('同じ区間を拡大',650,45)+label('直線／円弧の長さの比',880,195,C.ink,23)+label((2*Math.sin(h/2)/h).toFixed(4),885,242,C.gold,37);
  s+=label('比が 1 に近づく',865,320,C.ink,24);
  return s;
 }
 if(kind==='direction'){
  const h=lerp(1.1,.03,p),cx=410,cy=245,R=175,A=[cx+R,cy],B=[cx+R*Math.cos(h),cy-R*Math.sin(h)];
  // Counterclockwise interval: Δv points left/down, approaching the inward radius.
  const ux=-Math.cos(h/2),uy=Math.sin(h/2);
  let s=ring(cx,cy,R)+circle(cx,cy,8,C.gold)+circle(...A,13,C.purple)+circle(...B,9,C.purple);
  s+=line(...A,cx,cy,C.gold,3,'7 5')+arrow(...A,A[0]+130*ux,A[1]+130*uy,C.red);
  s+=arrow(...A,A[0],A[1]-80,C.cyan)+arrow(...B,B[0]-80*Math.sin(h),B[1]-80*Math.cos(h),C.cyan);
  s+=label('中心',cx-65,cy-15,C.gold)+label('前の位置',A[0]+18,A[1]+5)+label('後の位置',155,60)+line(270,65,B[0]-12,B[1]-12,C.dim,1);
  s+=label('時間の間隔を短くする',770,110)+label('赤い矢印の向きが',780,208,C.red)+label('中心向きへ近づく',780,258,C.red);
  s+=label('赤は向きを比較するため一定の長さ',705,405,C.dim,23);
  return s;
 }
 if(kind==='mass'){
  let s='';
  for(let j=0;j<2;j++){
   const cx=310+j*550,cy=260,R=155,a=t*.7,x=cx+R*Math.cos(a),y=cy+R*Math.sin(a);
   s+=ring(cx,cy,R)+circle(cx,cy,28,'#315c9d')+circle(x,y,j?18:9,C.purple)+arrow(x,y,x-65*Math.sin(a),y+65*Math.cos(a),C.cyan);
   s+=label(j?'重い衛星':'軽い衛星',cx-70,50,C.purple)+label('同じ半径・同じ速さ',cx-115,460,C.cyan,25);
  }
  return s;
 }
 return null;
}

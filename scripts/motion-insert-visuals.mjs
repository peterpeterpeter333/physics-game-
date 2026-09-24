import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const ease=p=>{p=clamp(p/.8);return p*p*(3-2*p);};
const person=(x,y,c)=>circle(x,y-35,12,c)+line(x,y-23,x,y+15,c,5)+line(x,y-12,x-22,y+5,c,4)+line(x,y-12,x+22,y+5,c,4)+line(x,y+15,x-18,y+42,c,4)+line(x,y+15,x+18,y+42,c,4);
const ring=(x,y,r)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="none" stroke="'+C.dim+'" stroke-width="2"/>';
function walkers(kind,p){
 const u=ease(p);
 if(kind==='signed-displacements'){
  return [1,-1].map((d,i)=>{const y=90+225*i,start=600,end=600+d*300;
   return line(140,y+50,1070,y+50)+circle(start,y+50,7,C.dim)+person(start+d*300*u,y,i?C.gold:C.cyan)+arrow(start,y+125,start+d*300*u,y+125,i?C.gold:C.cyan)+text('最初 0 m',520,y+95,24)+text('最後 '+(d>0?'+1':'−1')+' m',end-80,y+95,24)+text('位置の変化 '+(d>0?'+1':'−1')+' m',780,y+180,27,i?C.gold:C.cyan);
  }).join('');
 }
 if(kind==='force-changes-direction'){
  const x=300+400*(u-.25*u*u);
  return line(150,270,1070,270)+person(x,220,C.cyan)+arrow(x,160,x+140-70*u,160,C.cyan)+arrow(x,325,x-180,325,C.red)+text('人の速度：右向き・徐々に遅くなる',160,80,30,C.cyan)+text('人に働く力：左向き',160,420,30,C.red)+text('進む向きと、速度を変える向きを区別する',160,475,25);
 }
 return [1,-1].map((d,i)=>{const y=120+240*i,x=600+d*260*u,c=i?C.gold:C.cyan;
  return line(160,y+55,1060,y+55)+person(x,y,c)+arrow(x,y-65,x+d*135,y-65,c)+text((i?'黄色い人：左へ':'青い人：右へ')+' 1 m/s',140,y-85,29,c)+text(kind==='signed-walkers'?'速度 '+(i?'−1':'+1')+' m/s':'速さ 1 m/s',850,y+115,27,c);
 }).join('');
}
function slope(kind,p){
 const u=ease(p),A=[230,335],B=[850,110],physical=kind==='physical-slope';
 return line(160,390,1040,390)+line(160,390,160,35)+text(physical?'位置 [m]':'縦の値',175,30,28)+text(physical?'時刻 [s]':'横の値',910,435,28)
 +path([A,B],C.cyan,5)+circle(...A,9,C.cyan)+circle(...B,9,C.gold)
 +arrow(...A,A[0]+620*u,A[1],C.gold)+arrow(B[0],A[1],B[0],A[1]-225*u,C.purple)
 +text(physical?'時間の変化 2 s':'横の変化',410,375,27,C.gold)+text(physical?'位置の変化 6 m':'縦の変化',870,245,26,C.purple)
 +text(physical?'同じ割り算だから、傾きは平均速度':'傾きは「縦の変化 ÷ 横の変化」',240,495,29);
}
export function secantSample(h){return {h,average:2+h,from:[1,1],to:[1+h,(1+h)**2]};}
function oneSecond(kind,p){
 const u=ease(p),gx=t=>160+270*t,gy=x=>365-67*x;
 let out=line(160,365,805,365)+line(160,365,160,30)+text('位置 [m]',165,25,26)+text('時刻 [s]',660,418,26)
 +path(Array.from({length:81},(_,i)=>{const t=2.1*i/80;return[gx(t),gy(t*t)];}),C.cyan,4)
 +[0,1,2].map(t=>text(String(t),gx(t)-7,398,23)).join('')+circle(gx(1),gy(1),10,C.cyan)+text('1秒の位置：1 m',195,105,26,C.cyan)+line(330,120,gx(1)-8,gy(1)-12,C.dim,1);
 if(kind==='one-second-position')return out+circle(gx(2*u),gy(4*u*u),9,C.gold)+text('時刻の数値を二乗 → 位置の数値',160,485,28);
 const h=kind==='one-second-tangent'?1-.999*u:[1,.1,.01][Math.min(2,Math.floor(u*3))],s=secantSample(h);
 const lo=.65,hi=2;
 out+=line(gx(lo),gy(1+s.average*(lo-1)),gx(hi),gy(1+s.average*(hi-1)),C.gold,4)+circle(gx(1+h),gy((1+h)**2),8,C.gold);
 if(kind==='one-second-secants'){
  out+=text('時間の幅',835,65,23)+text('[s]',875,95,23)+text('平均速度',1010,65,23)+text('[m/s]',1030,95,23);
  [1,.1,.01].forEach((v,i)=>{const color=v===h?C.gold:C.dim;out+=text(String(v),855,150+65*i,30,color)+text(String(2+v),1035,150+65*i,30,color);});
  out+=text('黄色い点を青い点へ近づける',815,380,22,C.gold);
 }else out+=text('平均速度 '+s.average.toFixed(3)+' m/s',820,140,27,C.gold)+text('近づく先：2 m/s',820,215,29,C.cyan);
 return out+text('二つの点を結ぶ直線の傾きを比べる',200,485,28);
}
export function vectorSample(h){
 const V=240;return {v0:[0,-V],v1:[-V*Math.sin(h),-V*Math.cos(h)],delta:[-V*Math.sin(h),V*(1-Math.cos(h))]};
}
function vectors(kind,p){
 const u=ease(p);
 if(['instant-inward','perpendicular-acceleration'].includes(kind)){
  const ox=490,oy=260,R=175,a=-1.1*u,X=ox+R*Math.cos(a),Y=oy+R*Math.sin(a);
  return ring(ox,oy,R)+circle(ox,oy,7,C.dim)+circle(X,Y,11,C.gold)+arrow(X,Y,X+105*Math.sin(a),Y-105*Math.cos(a),C.cyan)+arrow(X,Y,X-115*Math.cos(a),Y-115*Math.sin(a),C.red)
   +text('中心',ox-50,oy+38,26)+text('青：瞬間の速度',810,140,28,C.cyan)+text('赤：瞬間の加速度',810,220,28,C.red)+text('矢印の長さは、向きを見やすくしたもの',175,490,25,C.dim);
 }
 if(kind==='tangent-change'){
  return arrow(260,310,680,310,C.cyan)+arrow(680,310,680+220*u,310,C.red)+text('もとの速度',300,265,30,C.cyan)+text('同じ向きの変化',760,370,28,C.red)+text('矢印が長くなる → 速さが増える',270,470,30);
 }
 const h=kind==='triangle-limit'?.9-.895*u:kind==='equal-speed-vectors'?.85*u:.85,{v0,v1,delta}=vectorSample(h);
 const O=[700,360],A=O.map((v,i)=>v+v0[i]),B=O.map((v,i)=>v+v1[i]);
 if(kind==='velocity-triangle'){
  const Q=[O[0]+250*(1-u),O[1]],end=Q.map((v,i)=>v+v1[i]);
  return arrow(...O,...A,C.cyan)+arrow(...Q,...end,C.gold)+(u>.7?arrow(...A,...B,C.red):'')+text('青：前の速度',130,100,28,C.cyan)+text('黄：後の速度',130,160,28,C.gold)+text('向きと長さを保って、根元をそろえる',130,430,29)+text('同じ長さの二辺 → 二等辺三角形',130,485,28);
 }
 if(kind==='equal-speed-vectors'){
  return arrow(300,350,300,110,C.cyan)+arrow(850,350,850+v1[0],350+v1[1],C.gold)
   +text('前の速度',205,420,32,C.cyan)+text('後の速度',760,420,32,C.gold)+text('長さは同じ、向きが違う',360,40,32);
 }
 if(kind==='inward-not-outward'){
  const ox=300,oy=260,R=165,X=ox+R;
  return ring(ox,oy,R)+circle(ox,oy,7,C.dim)+circle(X,oy,10,C.cyan)+arrow(X,oy,X,oy-140,C.cyan)+arrow(X,oy,X+delta[0]*.6,oy+delta[1]*.6,C.red)
   +arrow(...O,...A,C.cyan)+arrow(...O,...B,C.gold)+arrow(...A,...B,C.red)
   +text('中心',ox-55,oy+45,26)+text('赤は前の先端 → 後の先端',730,70,25,C.red)+text('赤の向きは外側でなく内側',600,470,28,C.red);
 }
 let out=arrow(...O,...A,C.cyan)+arrow(...O,...B,C.gold)+arrow(...A,...B,C.red)
 +text('前の速度',740,180,27,C.cyan)+text('後の速度',390,275,27,C.gold)+text('赤：速度の変化',780,80,28,C.red)+text('二本の速度の長さが等しい → 二等辺三角形',150,450,29);
 if(kind==='triangle-limit'){
  // Enlarge direction only: the true delta vector shrinks to zero.
  const angle=h/2,len=Math.hypot(...delta);
  out+=arrow(290,180,290+delta[0]/len*140,180+delta[1]/len*140,C.red)+line(290,180,290,340,C.cyan,3)
   +text('底角 '+(90-angle*180/Math.PI).toFixed(1)+'°',100,100,28)+text('赤の向きだけ拡大',90,390,23,C.dim)
   +text('時間を短くする → 頂角が小さく、底角は90°へ',150,500,26);
 }
 return out;
}
export const motionInsertDiagramKinds=['opposite-walkers','force-changes-direction','signed-walkers','signed-displacements','rise-run','physical-slope','one-second-position','one-second-secants','one-second-tangent','equal-speed-vectors','velocity-triangle','triangle-limit','inward-not-outward','instant-inward','tangent-change','perpendicular-acceleration'];
export function motionInsertDiagram(kind,p){
 if(motionInsertDiagramKinds.slice(0,4).includes(kind))return walkers(kind,p);
 if(['rise-run','physical-slope'].includes(kind))return slope(kind,p);
 if(kind.startsWith('one-second-'))return oneSecond(kind,p);
 if(motionInsertDiagramKinds.includes(kind))return vectors(kind,p);
 throw Error('Missing motion supplement diagram '+kind);
}
export function motionInsertFrame(c,s,t){
 if(c.visualPilot!=='motion-inserts-v1')return null;
 return authoredMotionFrame(c,s,t,motionInsertDiagram);
}

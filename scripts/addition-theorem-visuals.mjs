import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const ease=p=>{p=clamp(p/.75);return p*p*(3-2*p);};
const rad=d=>d*Math.PI/180;
export const additionDiagramKinds=['chord-goal','chord-coordinates','chord-rotate','chord-triangle','circle-pythagoras','chord-before-differences','chord-renamed','complement-triangle','complement-circle'];
export function additionDiagram(kind,p){
 if(!additionDiagramKinds.includes(kind))throw Error('Unknown addition diagram '+kind);
 const u=ease(p),ox=365,oy=265,r=195,pt=d=>[ox+r*Math.cos(rad(d)),oy-r*Math.sin(rad(d))];
 const ring=`<circle cx="${ox}" cy="${oy}" r="${r}" fill="none" stroke="${C.dim}" stroke-width="2"/>`;
 const axes=line(130,oy,610,oy)+line(ox,495,ox,30)+text('横',615,oy+8,22)+text('縦',ox+8,28,22);
 const arc=(a,b,rr,color)=>path(Array.from({length:41},(_,i)=>{const q=rad(a+(b-a)*i/40);return[ox+rr*Math.cos(q),oy-rr*Math.sin(q)];}),color,3);
 if(kind==='complement-triangle'){
  const x=200,y=440,w=560,h=340;
  return path([[x,y],[x+w,y],[x+w,y-h],[x,y]],C.ink,4)+path([[x+w-20,y],[x+w-20,y-20],[x+w,y-20]],C.dim,2)+line(x,y,x+w,y,C.cyan,7)+line(x+w,y,x+w,y-h,C.purple,7)+text('α',310,413,34,C.cyan)+text('90° − α',740,185,32,C.purple)+text('横の辺',410,485,31,C.cyan)+text('縦の辺',805,310,31,C.purple)+circle(315+465*u,410-230*u,50,C.gold,.12)+text('注目する角度を変えると、隣の辺と向かいの辺が交代',150,45,28);
 }
 if(kind==='complement-circle'){
  const a=30+105*u,P=pt(a),Q=pt(90-a);
  return ring+axes+line(210,420,520,110,C.dim,2)+arrow(ox,oy,...P,C.cyan)+arrow(ox,oy,...Q,C.purple)+circle(...P,10,C.cyan)+circle(...Q,10,C.purple)+text('青：元の点 (cos α, sin α)',660,110,28,C.cyan)+text('紫：横と縦を交換した点',660,180,28,C.purple)+text('(sin α, cos α)',710,225,29,C.purple)+text(`元の角度 α = ${Math.round(a)}°`,660,320,29,C.cyan)+text(`交換後の角度 = ${Math.round(90-a)}°`,660,375,29,C.purple)+text('斜めの直線を鏡として、点が映る',660,455,25,C.dim);
 }
 const rotated=['chord-triangle','circle-pythagoras'].includes(kind),shift=kind==='chord-rotate'?25*u:rotated?25:0,a=25-shift,b=75-shift,P=pt(a),Q=pt(b);
 let out=ring+axes+line(ox,oy,...P,C.cyan,3)+line(ox,oy,...Q,C.purple,3)+circle(...P,10,C.cyan)+circle(...Q,10,C.purple);
 if(kind!=='circle-pythagoras')out+=line(...P,P[0]+(Q[0]-P[0])*(kind==='chord-goal'?u:1),P[1]+(Q[1]-P[1])*(kind==='chord-goal'?u:1),C.gold,5)+text('二点を結ぶ線分',670,95,31,C.gold);
 out+=arc(a,b,70,C.gold)+text('β',ox+80*Math.cos(rad((a+b)/2)),oy-80*Math.sin(rad((a+b)/2)),28,C.gold);
 if(kind==='chord-goal'||kind==='chord-coordinates'){
  out+=arc(0,a,105,C.cyan)+text('α',ox+110,oy-20,27,C.cyan)+text('α + β',Q[0]+20,Q[1]-10,27,C.purple);
  out+=text('青の点：(cos α, sin α)',665,185,27,C.cyan)+text('紫の点：',665,265,27,C.purple)+text('(cos(α+β), sin(α+β))',665,307,27,C.purple)+text('半径は 1',720,415,30);
  if(kind==='chord-coordinates')out+=line(Q[0],Q[1],Q[0],Q[1]+(oy-Q[1])*u,C.purple,4)+line(Q[0],Q[1],Q[0]+(ox-Q[0])*u,Q[1],C.purple,4);
 }else if(kind==='chord-rotate')out+=text('円と二点を同じ角度だけ回す',650,220,29)+text('黄の線分の長さは変わらない',650,295,28,C.gold)+text('点の間の角度 β も変わらない',650,370,27);
 else if(kind==='chord-triangle'){
  out+=line(Q[0],Q[1],Q[0],Q[1]+(oy-Q[1])*u,C.purple,5)+line(Q[0],oy,Q[0]+(P[0]-Q[0])*u,oy,C.cyan,5)+text('(1, 0)',P[0]-25,oy+38,26,C.cyan)+text('(cos β, sin β)',Q[0]-105,Q[1]-20,26,C.purple)+text('横の差：1 − cos β',690,205,31,C.cyan)+text('縦の差：sin β',690,285,31,C.purple)+text('斜めの辺：長さ L',690,365,31,C.gold);
 }else if(kind==='circle-pythagoras'){
  out=ring+axes+line(ox,oy,ox+(Q[0]-ox)*u,oy,C.cyan,6)+line(Q[0],oy,Q[0],oy+(Q[1]-oy)*u,C.purple,6)+line(ox,oy,...Q,C.gold,5)+text('半径 1',Q[0]-120,Q[1]+55,30,C.gold)+text('横：cos β',700,160,32,C.cyan)+text('縦：sin β',700,250,32,C.purple)+text('横² ＋ 縦² = 半径²',665,360,29)+text('半径が 1 だから、右側は 1',665,425,27);
 }else if(kind==='chord-before-differences'){
  out+=line(P[0],P[1],P[0]+(Q[0]-P[0])*u,P[1],C.cyan,4)+line(Q[0],P[1],Q[0],P[1]+(Q[1]-P[1])*u,C.purple,4)+text('(x₁, y₁)',P[0]+12,P[1]+25,27,C.cyan)+text('(x₂, y₂)',Q[0]-30,Q[1]-20,27,C.purple)+text('横の差：x₂ − x₁',695,210,31,C.cyan)+text('縦の差：y₂ − y₁',695,290,31,C.purple)+text('負の差でも、二乗は正',695,395,27,C.dim);
 }else if(kind==='chord-renamed')out+=circle(ox+(Q[0]-ox)*u,oy+(Q[1]-oy)*u,9,C.purple)+text('B = α',P[0]+20,P[1]+25,29,C.cyan)+text('A = α + β',Q[0]-30,Q[1]-20,29,C.purple)+text('角度の差：β = A − B',670,190,30,C.gold)+text('点1：(cos B, sin B)',670,290,29,C.cyan)+text('点2：(cos A, sin A)',670,370,29,C.purple);
 return out;
}
export function additionTheoremFrame(c,s,t){return c.visualPilot==='addition-theorem-v1'?authoredMotionFrame(c,s,t,additionDiagram):null;}

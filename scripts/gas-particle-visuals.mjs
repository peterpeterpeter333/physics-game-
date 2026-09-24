import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
export const gasParticleKinds=['gasparticle-reflection','gasparticle-impulse-pair','gasparticle-roundtrip','gasparticle-three-directions'];
export function gasParticleDiagram(kind,p){
 if(!gasParticleKinds.includes(kind))throw Error(kind);const u=clamp(p/.9);
 if(kind==='gasparticle-reflection'){
  const x=u<.5?300+1340*u:970-1340*(u-.5),sign=u<.5?1:-1;
  return text('右向きを正とする。分子は壁で向きを逆にする',150,35,31)+line(200,130,200,400,C.dim,5)+line(980,130,980,400,C.dim,5)+line(200,130,980,130,C.dim,2)+line(200,400,980,400,C.dim,2)+circle(x,265,10,C.cyan)+arrow(x,265,x+sign*110,265,C.gold)+text(sign>0?'衝突前：右向き':'衝突後：左向き',420,190,32,C.gold)+text('質量mの分子',x-65,320,27,C.cyan)+arrow(650,465,890,465,C.purple)+text('右向きが＋x',440,475,28,C.purple)+text('箱の一辺 L',480,100,28);
 }
 if(kind==='gasparticle-impulse-pair')return text('力積は、二つの物体に逆向きに働く',240,35,31)+line(660,125,660,440,C.dim,8)+circle(645,280,13,C.cyan)+arrow(630,240,350-80*u,240,C.cyan)+arrow(690,340,970+80*u,340,C.gold)+text('壁が分子へ：左向き',150,190,30,C.cyan)+text('分子が壁へ：右向き',760,400,30,C.gold)+text('分子',525,310,29,C.cyan)+text('壁',690,150,30)+text('分子の運動量の変化と、壁への力積の向きを取り違えない',100,505,28);
 if(kind==='gasparticle-roundtrip'){
  const x=u<.5?970-1520*u:210+1520*(u-.5);
  return text('同じ右の壁に戻るまで、横方向に往復する',200,35,31)+line(200,140,200,385,C.dim,6)+line(980,140,980,385,C.dim,6)+arrow(940,180,240,180,C.cyan)+arrow(240,365,940,365,C.gold)+text('行き：L',470,150,32,C.cyan)+text('帰り：L',470,420,32,C.gold)+circle(x,275,11,C.cyan)+text('左の壁',110,105,28)+text('右の壁',920,105,28)+text('横方向の速さの大きさは一定。往復距離は2L',225,500,29);
 }
 if(kind==='gasparticle-three-directions'){
  const theta=.2+.35*u,project=(x,y,z)=>[460+Math.cos(theta)*x+Math.sin(theta)*z,340-y+.28*z-.1*x],O=project(0,0,0),X=project(270,0,0),Y=project(0,200,0),Z=project(0,0,220),V=project(200,160,170);
  return text('三方向の成分を分ける。等しいのは、多数の分子での平均',60,35,30)+arrow(...O,...X,C.cyan)+arrow(...O,...Y,C.gold)+arrow(...O,...Z,C.purple)+arrow(...O,...V,'#fff')+text('横 x',X[0]+5,X[1]+15,29,C.cyan)+text('縦 y',Y[0]-35,Y[1]-20,29,C.gold)+text('奥行き z',Z[0]+15,Z[1]+25,29,C.purple)+text('速度ベクトル',V[0]+20,V[1]-10,28)+path([project(200,0,0),project(200,160,0),V],C.dim,2)+text('一個の分子の各成分が同じ、という意味ではない',210,485,28);
 }
}
export function gasParticleFrame(c,s,t){return c.visualPilot==='gas-particles-v1'?authoredMotionFrame(c,s,t,gasParticleDiagram):null;}

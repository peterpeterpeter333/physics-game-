import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const ease=p=>{p=clamp(p/.8);return p*p*(3-2*p);};
const ring=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${C.dim}" stroke-width="2"/>`;
export const shmMiddleKinds=['shm-equilibrium-sign','shm-phase-progress','shm-amplitude-comparison','shm-horizontal-projection','shm-acceleration-projection'];
export function shmMiddleDiagram(kind,p){
 if(!shmMiddleKinds.includes(kind))throw Error('Unknown '+kind);const u=clamp(p/.8);
 if(kind==='shm-equilibrium-sign'){
  const x=600+180*Math.cos(Math.PI*u),f=(600-x)*.7;
  return text('中心を0、右向きをプラスに決める',285,35,31)+line(120,330,1100,330)+line(600,160,600,400,C.dim,2,'7 7')+circle(x,300,28,C.gold)+arrow(x,220,x+f,220,C.red)+arrow(600,385,x,385,C.cyan)+text('0',585,445,30)+text('−',235,445,35)+text('+',950,445,35)+text('赤：ばねの力',180,115,29,C.red)+text('青：中心からのずれ x',690,115,29,C.cyan)+text('位置が右なら力は左。位置が左なら力は右',255,495,29);
 }
 if(kind==='shm-phase-progress'||kind==='shm-horizontal-projection'){
  const x=400,y=225,r=140,a=2*Math.PI*u,X=x+r*Math.cos(a),Y=y-r*Math.sin(a),isPhase=kind==='shm-phase-progress';
  return text(isPhase?'一周する角度と、一往復する位置を対応させる':'半径Aの円を回る点 → 横方向の位置だけを取り出す',100,35,30)+ring(x,y,r)+line(x,y,X,Y,C.cyan,3)+circle(X,Y,10,C.gold)+line(X,Y,X,430,C.dim,2,'6 6')+line(x-r-30,430,x+r+30,430)+circle(X,430,13,C.purple)+line(x,400,x,460,C.dim,2,'5 5')+text('0',x-10,495,28)+text('−A',x-r-25,495,28)+text('+A',x+r-10,495,28)+text(isPhase?`角度 ${(a/Math.PI).toFixed(2)}π rad`:'A：半径、ω：角速度',730,205,30,C.gold)+text(isPhase?'一周すると、一往復も完了':'紫：点の横方向の位置',700,285,30,C.purple);
 }
 if(kind==='shm-amplitude-comparison'){
  const a=2*Math.PI*u;
  return text('同じ質量・同じばね。振幅だけを変えて比較',205,35,31)+[110,220].map((A,i)=>{const y=200+i*195,c=i?C.purple:C.cyan,x=640+A*Math.cos(a);return line(320,y,980,y)+line(640,y-60,640,y+55,C.dim,2,'6 6')+line(640-A,y-40,640-A,y+40,c,2,'5 5')+line(640+A,y-40,640+A,y+40,c,2,'5 5')+circle(x,y,20,c)+text(i?'振幅2倍':'元の振幅',130,y+10,30,c);}).join('')+text('中心・端に着く時刻は同じ → 周期は同じ',260,495,29);
 }
 if(kind==='shm-acceleration-projection'){
  const a=.25+3.4*u;
  return text('同じ位置の点を、位置と加速度に分けて比較',190,35,30)+[0,1].map(i=>{const x=310+520*i,y=245,r=140,X=x+r*Math.cos(a),Y=y-r*Math.sin(a),c=i?C.red:C.cyan;return ring(x,y,r)+circle(X,Y,10,C.gold)+(i?arrow(X,Y,x,y,c):arrow(x,y,X,Y,c))+line(X,Y,X,445,C.dim,2,'5 5')+line(x,410,x,465,C.dim,2,'5 5')+(i?arrow(X,445,x,445,c):arrow(x,445,X,445,c))+text(i?'加速度：中心へ':'位置：中心から外へ',x-145,90,29,c);}).join('')+text('下の矢印は横成分。別々の縮尺で表示し、向きを比較',115,505,28);
 }
}
export function shmMiddleFrame(c,s,t){return c.visualPilot==='shm-middle-v1'?authoredMotionFrame(c,s,t,shmMiddleDiagram):null;}

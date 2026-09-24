import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const ease=p=>{p=clamp(p/.8);return p*p*(3-2*p);};
export const shmAdvancedKinds=['shmadvanced-restoring-force','shmadvanced-initial-states','shmadvanced-damping-limit'];
export function shmAdvancedDiagram(kind,p){
 if(!shmAdvancedKinds.includes(kind))throw Error(kind);const u=ease(p);
 if(kind==='shmadvanced-restoring-force'){
  const x=620+200*Math.cos(Math.PI*u),pts=Array.from({length:25},(_,i)=>[200+(x-225)*i/24,280+(i===0||i===24?0:i%2?22:-22)]);
  return text('摩擦のない水平面で、ばねにつながれた物体',185,35,31)+line(200,200,200,340,C.dim,7)+path(pts,C.cyan,4)+line(160,315,1120,315)+line(620,150,620,450,C.dim,2,'6 6')+`<rect x="${x-25}" y="250" width="50" height="65" rx="9" fill="${C.gold}"/>`+arrow(x,190,x-(x-620)*.8,190,C.red)+arrow(620,390,x,390,C.purple)+text('0',610,490,29)+text('右向きがプラス',850,460,27)+text('赤：ばねの力',160,110,29,C.red)+text('紫：中心からのずれ',750,110,29,C.purple);
 }
 if(kind==='shmadvanced-initial-states'){
  const a=Math.PI*.65*clamp((p-.3)/.5);
  return text('同じA・同じωで、始まり方だけを変える',230,35,31)+text('黄の矢印：速度',770,90,26,C.gold)+[0,Math.PI/2].map((phi,i)=>{const y=195+i*205,x=700+210*Math.cos(a+phi),v=-95*Math.sin(a+phi);return line(420,y,990,y)+line(700,y-65,700,y+50,C.dim,2,'6 6')+circle(x,y,22,i?C.purple:C.cyan)+(Math.abs(v)>1?arrow(x,y-55,x+v,y-55,C.gold):text('速度0',x-45,y-45,25,C.gold))+text(i?'最初は中心から左へ':'最初は右端で速度0',55,y,28,i?C.purple:C.cyan)+text(i?'φ = π/2':'φ = 0',80,y+45,27)+text('−A',465,y+60,26)+text('0',690,y+60,26)+text('+A',900,y+60,26);}).join('')+text(p<.3?'時刻0の状態':'どちらも同じ周期で動く',440,505,28,C.gold);
 }
 if(kind==='shmadvanced-damping-limit'){
  const end=.2+5.8*u;
  return text('振幅が一定のモデルと、小さくなる振動を比較',185,35,30)+[0,1].map(i=>{const y=180+i*205,A=65,X=t=>350+115*t,Y=t=>y-A*Math.exp(i?-.25*t:0)*Math.cos(4*t);return line(320,y,1080,y)+line(350,y-80,350,y+85)+path(Array.from({length:121},(_,j)=>{const t=end*j/120;return[X(t),Y(t)];}),i?C.purple:C.cyan,4)+circle(X(end),Y(end),7,C.gold)+text(i?'抵抗で振幅が減る':'摩擦なし',50,y-10,28,i?C.purple:C.cyan)+text('位置',280,y-75,25)+text('時間',1030,y+90,25);}).join('')+text('下は減衰の例。上の一定振幅の式とは別のモデル',195,510,27);
 }
}
export function shmAdvancedFrame(c,s,t){return c.visualPilot==='shm-advanced-v1'?authoredMotionFrame(c,s,t,shmAdvancedDiagram):null;}

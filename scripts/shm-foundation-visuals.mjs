import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const ease=p=>{p=clamp(p/.8);return p*p*(3-2*p);};
const ring=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${C.dim}" stroke-width="2"/>`;
const spring=(end,y)=>path(Array.from({length:29},(_,i)=>[120+(end-120)*i/28,y+(i===0||i===28?0:(i%2?17:-17))]),C.dim,3);
const rect=(x,y,w,h,c,a=.5)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" fill-opacity="${a}"/>`;
const arc=(x,y,r,a)=>path(Array.from({length:61},(_,i)=>[x+r*Math.cos(a*i/60),y-r*Math.sin(a*i/60)]),C.gold,4);
export const shmFoundationKinds=['shm-release','shm-speed-up','shm-center-velocity','shm-cross-center','shm-slow-down','shm-turn-back','wave-circle-height','wave-triangle','wave-signed-height','wave-amplitude-period','wave-start-angle','wave-phase-comparison','wave-three-roles'];
function oscillator(a){const x=600+220*Math.cos(a),v=-160*Math.sin(a),f=-120*Math.cos(a);return line(95,270,95,370,C.dim,7)+spring(x-42,310)+rect(x-42,275,84,70,C.gold)+line(95,350,1090,350)+line(600,80,600,430,C.dim,2,'8 8')+arrow(x,210,x+v,210,C.cyan)+arrow(x,145,x+f,145,C.red)+text('青：速度',100,115,28,C.cyan)+text('赤：ばねの力',100,165,28,C.red)+text('真ん中（つり合い）',450,475,30);}
export function shmFoundationDiagram(kind,p){
 if(!shmFoundationKinds.includes(kind))throw Error('Unknown '+kind);const u=ease(p);
 if(kind.startsWith('shm-')){
  const settings={
   'shm-release':[0,.2*Math.PI,'伸ばして、静かに放す。はじめの速度は0'],
   'shm-speed-up':[.2*Math.PI,.5*Math.PI-.2,'力と速度が同じ左向き → 速さが増す'],
   'shm-center-velocity':[.5*Math.PI,.5*Math.PI,'真ん中の瞬間：ばねの力は0、速度は左向き'],
   'shm-cross-center':[.5*Math.PI-.25,.5*Math.PI+.25,'速度が残っているので、真ん中を通り過ぎる'],
   'shm-slow-down':[.5*Math.PI,Math.PI-.25,'速度は左、力は右 → 物体が減速する'],
   'shm-turn-back':[Math.PI,1.4*Math.PI,'左端で折り返す：右向きの力で、右へ動き出す']};
  const [a,b,title]=settings[kind];let out=text(title,175,35,31)+oscillator(a+(b-a)*u);
  if(kind==='shm-center-velocity')out+=`<circle cx="600" cy="310" r="${52+10*u}" fill="none" stroke="${C.cyan}" stroke-opacity="${1-.6*u}" stroke-width="3"/>`+text('力 0',625,150,30,C.red)+text('速度は0ではない',760,225,30,C.cyan);
  return out;
 }
 if(kind==='wave-triangle'){
  const x=370,y=335,r=230,a=.25+.5*u,X=x+r*Math.cos(a),Y=y-r*Math.sin(a);
  return text('半径が斜辺、点の高さが縦の辺になる',235,35,31)+line(x,y,X,y,C.dim,3)+line(X,y,X,Y,C.purple,5)+line(x,y,X,Y,C.cyan,4)+arc(x,y,55,a)+path([[X-20,y],[X-20,y-20],[X,y-20]],C.ink,2)+circle(X,Y,10,C.gold)+text('半径 A（斜辺）',285,155,30,C.cyan)+text('縦の位置 x',690,250,31,C.purple)+text('角度 θ',430,405,30,C.gold)+text('サインは「縦の辺 ÷ 斜辺」。この図では x ÷ A',220,485,30);
 }
 if(kind==='wave-circle-height'||kind==='wave-signed-height'){
  const a=kind==='wave-signed-height'?Math.PI+Math.PI/2*u:2*Math.PI*u,x=300,y=270,r=155,X=x+r*Math.cos(a),Y=y-r*Math.sin(a);
  return text(kind==='wave-signed-height'?'中心より上が正、下が負。円の点の高さで定義する':'点が一周すると、高さは一往復する',150,35,30)+ring(x,y,r)+line(x-r-20,y,900,y,C.dim,2,'7 7')+line(740,y-r-20,740,y+r+20)+line(x,y,X,Y,C.cyan,3)+line(X,Y,740,Y,C.dim,2,'6 6')+circle(X,Y,10,C.gold)+circle(740,Y,13,C.purple)+text('円を回る点',180,490,29,C.gold)+text('縦の位置だけを取り出す',670,490,29,C.purple)+text('+A',790,y-r+10,28)+text('0',790,y+10,28)+text('−A',790,y+r+10,28)+arrow(875,y,875,Y,C.purple);
 }
 if(kind==='wave-amplitude-period'){
  const x=205,y=265,w=770,A=125;
  return text('中心からの最大距離が振幅、一往復の時間が周期',155,35,30)+line(x,y,x+w+30,y)+line(x,y-A-25,x,y+A+25)+path(Array.from({length:121},(_,i)=>{const q=i/120*u;return[x+w*q,y-A*Math.sin(2*Math.PI*q)];}),C.purple,4)+circle(x+w*u,y-A*Math.sin(2*Math.PI*u),10,C.gold)+arrow(x+w/4,y,x+w/4,y-A,C.cyan)+text('振幅 A',x+w/4+20,y-A/2,29,C.cyan)+line(x,430,x+w,430,C.gold,3)+text('0',x-10,470,26)+text('4 s：一周期',x+w-110,470,29,C.gold)+text('時間',1030,y+40,26)+text('縦の位置',95,100,28);
 }
 if(kind==='wave-start-angle'){
  const a=Math.PI/2*u;
  return text('回り始める前に、出発角度だけを変えて比較',195,35,30)+[0,a].map((q,i)=>{const x=310+520*i,y=270,r=135,X=x+r*Math.cos(q),Y=y-r*Math.sin(q);return ring(x,y,r)+line(x-r,y,x+r,y,C.dim,2,'5 5')+arc(x,y,55,q)+line(x,y,X,Y,C.cyan,3)+circle(X,Y,12,i?C.purple:C.gold)+text(i?`出発角度 ${(q/Math.PI).toFixed(2)}π rad`:'出発角度 0 rad',x-120,460,28,i?C.purple:C.gold);}).join('');
 }
 if(kind==='wave-phase-comparison'){
  const a=2*Math.PI*u;
  return text('振幅と周期は同じ。出発角度だけが違う',220,35,31)+[0,Math.PI/2].map((phi,i)=>{const x=320+540*i,y=275,A=135,c=i?C.purple:C.cyan,Y=y-A*Math.sin(a+phi);return line(x,y-A,x,y+A)+line(x-120,y,x+120,y,C.dim,2,'6 6')+circle(x,y-A*Math.sin(phi),15,c,.2)+circle(x,Y,14,c)+arrow(x+55,Y,x+55,Y-65*Math.cos(a+phi),c)+text(i?'出発：上端から下へ':'出発：中心から上へ',x-150,465,29,c)+text(i?'φ = π/2':'φ = 0',x-60,95,31,c);}).join('');
 }
 if(kind==='wave-three-roles')return text('振幅・角速度・初期位相の役割を分ける',230,35,31)+text('各グラフの横軸：時間、縦軸：中心からの位置',250,495,28)+['振幅：最大のずれ','角速度：往復の速さ','初期位相：出発の状態'].map((label,i)=>{const x=480,y=135+135*i,w=560,A=i===0?25+20*u:40,n=i===1?1+u:1,phi=i===2?Math.PI/2*u:0,c=[C.cyan,C.gold,C.purple][i];return text(label,100,y+10,29,c)+line(x,y,x+w,y,C.dim,1)+path(Array.from({length:101},(_,j)=>[x+w*j/100,y-A*Math.sin(2*Math.PI*n*j/100+phi)]),c,3)+circle(x,y-A*Math.sin(phi),6,c);}).join('');
}
export function shmFoundationFrame(c,s,t){return c.visualPilot==='shm-foundations-v1'?authoredMotionFrame(c,s,t,shmFoundationDiagram):null;}

import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const ease=p=>{p=clamp(p/.7);return p*p*(3-2*p);};
const car=(x,y)=>`<rect x="${x-35}" y="${y-30}" width="70" height="35" rx="7" fill="${C.cyan}"/>`+circle(x-22,y+13,10,C.dim)+circle(x+22,y+13,10,C.dim);
export function uniformDiagram(kind,p){
 const u=ease(p);
 if(['uniform-start','uniform-first','uniform-second'].includes(kind)){
  const from=kind==='uniform-second'?1:0,to=kind==='uniform-start'?0:kind==='uniform-first'?1:2,t=from+(to-from)*u,v=2+3*t,x=150+(2*t+1.5*t*t)*65;
  return text('右を正にする →',100,35,27)+text(`測り始めてから ${t.toFixed(1)} s`,100,90,30)+line(90,280,1110,280)+car(x,260)+arrow(x,185,x+v*30,185,C.purple)+text(`速度 ${v.toFixed(1)} m/s`,100,340,32,C.purple)+text('加速度 3 m/s²：一秒ごとに速度が 3 m/s 増える',100,410,29,C.red)+text('矢印の長さは速度。台車の位置とは別の量。',100,465,24,C.dim);
 }
 if(kind==='uniform-compare')return text('どちらも加速度は 3 m/s²。二秒間の増加は 6 m/s。',70,35,28)+[2,4].map((v,i)=>{const y=130+i*200,x=150;return text(i?'最初 4 m/s → 二秒後 10 m/s':'最初 2 m/s → 二秒後 8 m/s',100,y-30,29)+arrow(x,y+35,x+v*65,y+35,C.purple)+arrow(x+v*65,y+35,x+v*65+6*65*u,y+35,C.gold)+text('紫：最初の速度　黄色：増加分',100,y+92,24,C.dim);}).join('');
 if(kind==='uniform-graph')return line(150,405,1060,405)+line(150,405,150,40)+text('速度 [m/s]',140,25,28)+text('経過時間 [s]',895,455,26)+path([[150,325],[150+700*u,325-240*u]],C.purple,5)+[0,1,2].map(t=>circle(150+350*t,325-120*t,9,t===2?C.gold:C.cyan)+text(`${t} s：${2+3*t} m/s`,170+350*t,310-120*t,25)+text(String(t),145+350*t,440,23)).join('');
 if(kind==='uniform-distance'){
  const t=2*u,x=140+(2*t+1.5*t*t)*85;
  return text('同じ一秒でも、後の一秒ほど長く進む',110,45,30)+line(100,210,1100,210)+car(x,185)+[0,3.5,10].map((d,i)=>line(140+d*85,210,140+d*85,265)+text(`${i} s の位置`,110+d*85,300,25)).join('')+arrow(140,350,140+3.5*85,350,C.cyan)+arrow(140+3.5*85,420,990,420,C.gold)+text('最初の一秒で進む距離',130,390,25,C.cyan)+text('次の一秒で進む距離',620,470,25,C.gold);
 }
 throw Error(`Unknown uniform diagram ${kind}`);
}
export function uniformAccelerationFrame(c,s,t){return c.visualPilot==='uniform-acceleration-v1'?authoredMotionFrame(c,s,t,uniformDiagram):null;}

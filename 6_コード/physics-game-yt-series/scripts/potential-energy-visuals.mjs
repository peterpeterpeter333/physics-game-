import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const ease=p=>{p=clamp(p/.8);return p*p*(3-2*p);};
const box=(x,y)=>`<rect x="${x-42}" y="${y-32}" width="84" height="64" rx="8" fill="${C.cyan}" fill-opacity=".3" stroke="${C.cyan}" stroke-width="3"/>`;
const bar=(x,y,w,c)=>`<rect x="${x}" y="${y}" width="${Math.max(0,w)}" height="44" fill="${c}" fill-opacity=".7"/>`;
export const potentialEnergyKinds=['potential-lift','potential-ready-to-fall','potential-falling','potential-resistance','potential-two-metres','potential-numeric-transfer'];
export function potentialEnergyDiagram(kind,p){
 if(!potentialEnergyKinds.includes(kind))throw Error('Unknown potential diagram '+kind);
 // The lift is explicitly at constant speed: do not ease its position.
 const u=kind==='potential-lift'?clamp(p/.8):ease(p);
 if(kind==='potential-lift'){
  const x=380,y=390-240*u;
  return line(100,440,600,440)+box(x,y)+arrow(x-80,y+35,x-80,y-65,C.gold)+arrow(x+80,y-35,x+80,y+65,C.red)+arrow(150,390,150,y,C.purple)+text('黄：手の力 10 N',685,100,31,C.gold)+text('赤：重力 10 N',685,180,31,C.red)+text('二つの力はつり合う',685,280,30)+text(`増えた高さ ${(2*u).toFixed(1)} m`,660,390,31,C.purple)+text('荷物は一定の速さで上がる',290,510,30);
 }
 if(kind==='potential-ready-to-fall'){
  const x=325,y=160;
  return box(x,y)+line(110,445,540,445)+line(170,y,500,y,C.dim,2)+path([[x,y+55],[x,400]],C.red,2)+arrow(x,y+50,x,y+50+140*u,C.red)+text('高くした物体を、これから放す',130,65,30)+text('落ちる距離がある',670,170,32,C.cyan)+text('重力が仕事をできる状態',670,260,30,C.red)+text('今の速さが同じでも、高さの違いを数えたい',225,490,29);
 }
 if(kind==='potential-resistance'){
  const fallen=u*u,y=110+300*fallen,heat=.3*fallen,kin=.7*fallen;
  return line(110,445,540,445)+box(320,y)+arrow(390,y+35,390,y-55,C.purple)+arrow(250,y-50,250,y+50,C.red)+text('紫：空気抵抗',675,55,30,C.purple)+text('位置エネルギー',650,130,29,C.gold)+bar(650,150,410*(1-fallen),C.gold)+text('運動エネルギー',650,250,29,C.cyan)+bar(650,270,410*kin,C.cyan)+text('熱などへ変わった分',650,370,29,C.purple)+bar(650,390,410*heat,C.purple)+text('エネルギーの行き先を整理した模式図',225,505,26,C.dim);
 }
 if(kind==='potential-two-metres'){
  return line(130,445,1100,445)+box(430,120)+arrow(560,440,560,155,C.gold)+text('高さ 2 m',605,300,34,C.gold)+text('質量 1 kg',340,65,32,C.cyan)+circle(430,120,10+25*u,C.cyan,.12)+text('床：高さ0、位置エネルギー0',315,505,30)+text('放す直前：速さ0',730,135,30);
 }
 const numeric=kind==='potential-numeric-transfer',fallen=u*u,y=105+305*fallen,U=19.6*(1-fallen),K=19.6*fallen;
 let out=line(100,445,560,445)+box(310,y)+arrow(225,y-40,225,y+40,C.red)+text('赤：重力は下向き',125,50,29,C.red)+text('位置エネルギー',660,95,30,C.gold)+bar(660,125,390*(1-fallen),C.gold)+text('運動エネルギー',660,255,30,C.cyan)+bar(660,285,390*fallen,C.cyan)+text('空気抵抗なし。床に着く直前まで考える',210,505,28);
 if(numeric)out+=text(`${U.toFixed(1)} J`,660,205,30,C.gold)+text(`${K.toFixed(1)} J`,660,365,30,C.cyan)+text('合計 19.6 J',710,450,33);
 else out+=text('高さが下がる → 位置エネルギーは減る',650,210,25,C.gold)+text('速くなる → 運動エネルギーは増える',650,370,25,C.cyan)+text('減少と増加が同じ大きさ',685,450,30);
 return out;
}
export function potentialEnergyFrame(c,s,t){return c.visualPilot==='potential-energy-v1'?authoredMotionFrame(c,s,t,potentialEnergyDiagram):null;}

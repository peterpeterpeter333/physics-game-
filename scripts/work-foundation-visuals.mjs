import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const ease=p=>{p=clamp(p/.75);return p*p*(3-2*p);};
const box=(x,y,c=C.cyan)=>`<rect x="${x-55}" y="${y-40}" width="110" height="80" rx="8" fill="${c}" fill-opacity=".25" stroke="${c}" stroke-width="3"/>`+text('荷物',x-35,y+10,29,c);
const hand=(x,y)=>`<rect x="${x-68}" y="${y+45}" width="136" height="20" rx="10" fill="${C.gold}" fill-opacity=".7"/>`;
const rect=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" fill-opacity=".5"/>`;
export const workFoundationKinds=['work-distance','work-displacement','speed-energy-ratio','holding-package','body-energy','work-target','lifting-package','opposite-work','zero-work-not-zero-effort'];
export function workFoundationDiagram(kind,p){
 if(!workFoundationKinds.includes(kind))throw Error('Unknown work diagram '+kind);
 const u=kind==='opposite-work'||kind==='speed-energy-ratio'?clamp(p/.75):ease(p);
 if(kind==='work-distance'){
  const x=220+660*u,y=250;
  return line(140,300,1100,300)+box(x,y)+arrow(x,y-80,x+110,y-80,C.red)+text('赤：一定の力 2 N',650,70,32,C.red)+arrow(220,400,x,400,C.cyan)+text(`移動した距離 ${(3*u).toFixed(1)} m`,360,460,33,C.cyan)+[0,1,2,3].map(i=>line(220+220*i,300,220+220*i,315)+text(`${i} m`,200+220*i,350,25)).join('');
 }
 if(kind==='work-displacement')return text('合力は一定。右向きをプラスとする',215,50,31)+line(120,330,1120,330)+`<g opacity=".35">${box(250,270)}</g>`+box(250+650*u,270)+arrow(250,420,250+650*u,420,C.gold)+text('最初の位置',170,165,31,C.dim)+text('最後の位置',820,165,31,C.cyan)+text('d：向きを含めた位置の変化',360,485,29,C.gold);
 if(kind==='speed-energy-ratio')return text('二つの物体の質量は同じ',355,45,32)+[1,2].map((n,i)=>{const y=155+i*220,x=180+190*n*u;return circle(x,y,24,i?C.purple:C.cyan)+arrow(x,y-45,x+60*n,y-45,i?C.purple:C.cyan)+text(i?'速さ 2v':'速さ v',130,y+85,30,i?C.purple:C.cyan)+rect(710,y-35,90*n*n*u,65,i?C.purple:C.cyan)+text(i?'エネルギー 4倍':'エネルギー 1倍',710,y+85,29,i?C.purple:C.cyan);}).join('');
 if(kind==='body-energy'){
  const x=310,y=225;
  return box(x,y)+hand(x,y)+arrow(x-85,y+35,x-85,y-65,C.gold)+text('荷物：位置は変わらない',160,75,31,C.cyan)+text('荷物への仕事：0',170,390,31)+text('体の中：エネルギーを消費',660,75,30,C.gold)+rect(700,175,350,110,C.dim)+rect(710,185,330*(1-.7*u),90,C.gold)+text('体内の消費を示す模式図',690,350,26,C.dim)+text('この二つは、別の量を調べている',315,480,31);
 }
 if(kind==='zero-work-not-zero-effort'){
  const x=330,y=230,heat=[0,1,2].map(i=>path(Array.from({length:31},(_,j)=>{const q=j/30;return[755+90*i+13*Math.sin(q*3*Math.PI+u*5),390-210*q];}),C.gold,4)).join('');
  return box(x,y)+hand(x,y)+text('荷物：移動なし',175,75,32,C.cyan)+text('手の仕事も、重力の仕事も0',145,380,29)+heat+text('体の中：エネルギーを消費',650,75,30,C.gold)+text('曲線は体内の消費を表す模式図',645,430,25,C.dim)+text('「仕事0」と「疲れない」は別',210,495,30);
 }
 if(kind==='opposite-work'){
  const x=340,y=365-180*u;
  return line(130,425,580,425)+box(x,y)+hand(x,y)+arrow(x-95,y+30,x-95,y-70,C.gold)+arrow(x+100,y-30,x+100,y+70,C.red)+arrow(145,365,145,y,C.cyan)+text('荷物は一定の速さで上がる',145,45,31)+text('手の仕事：正',715,115,30,C.gold)+rect(700,150,360*u,65,C.gold)+text('重力の仕事：負',715,285,30,C.red)+rect(700,320,360*u,65,C.red)+text('二つの仕事の大きさは同じ。合計は0',575,475,28);
 }
 const lifting=kind==='lifting-package',x=440,y=lifting?365-190*u:265;
 let out=box(x,y)+hand(x,y)+arrow(x-100,y+35,x-100,y+35-130*(kind==='holding-package'?u:1),C.gold)+text('黄：手から荷物への力',690,145,31,C.gold);
 if(lifting)out+=arrow(200,365,200,y,C.cyan)+text('青：荷物の移動',690,255,31,C.cyan)+text('力も移動も上向き → 手の仕事は正',225,485,31);
 else if(kind==='work-target')out+=`<rect x="${x-70}" y="${y-55}" width="140" height="98" rx="15" fill="none" stroke="${C.cyan}" stroke-width="${2+3*u}" stroke-dasharray="9 7"/>`+text('注目する物体：荷物',670,270,31,C.cyan)+text('手の力と、荷物の移動を組にして調べる',250,460,30);
 else out+=line(190,330,1000,330,C.dim,2)+text('荷物の位置は変わらない',665,275,31,C.cyan)+text('力はあるが、移動はない',340,450,32);
 return out;
}
export function workFoundationFrame(c,s,t){return c.visualPilot==='work-foundations-v1'?authoredMotionFrame(c,s,t,workFoundationDiagram):null;}

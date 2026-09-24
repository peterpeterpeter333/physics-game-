import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const box=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" fill-opacity=".18" stroke="${c}" stroke-width="2"/>`;
export const firstlawFoundationKinds=['firstlaw-heated-piston','firstlaw-signs','firstlaw-rigid-vessel','firstlaw-force-area','firstlaw-volume-prism','firstlaw-compression'];
export function firstlawFoundationDiagram(kind,p){
 if(!firstlawFoundationKinds.includes(kind))throw Error(kind);const u=clamp(p/.85);
 if(kind==='firstlaw-heated-piston'){
  const y=240-95*u;
  return text('気体を温めると、動くふたを押し上げられる',165,35,31)+box(455,y,290,395-y,C.cyan)+line(445,100,445,405,C.dim,5)+line(755,100,755,405,C.dim,5)+line(455,y,745,y,C.gold,9)+box(555,y-55,90,50,C.gold)+text('ピストン',790,y+10,30,C.gold)+arrow(865,y+105,865,y+45,C.gold)+arrow(160,330,405,330,C.red)+circle(160+245*u,330,10,C.red)+text('受け取る熱',160,285,30,C.red)+text('気体は、上のおもりも持ち上げる',345,480,29);
 }
 if(kind==='firstlaw-signs')return text('気体を主語にして、熱と仕事の向きを決める',170,35,31)+box(435,140,340,270,C.cyan)+text('気体',545,285,38,C.cyan)+arrow(85,220,395,220,C.gold)+circle(85+310*u,220,9,C.gold)+text('熱を受け取る',120,150,30,C.gold)+text('Qはプラス',155,285,29,C.gold)+arrow(820,330,1120,330,C.purple)+circle(820+300*u,330,9,C.purple)+text('外へ仕事をする',830,265,29,C.purple)+text('Wはプラス',870,405,29,C.purple)+text('Qは入ってくる量、Wは出ていく量として正を決めた',125,500,28);
 if(kind==='firstlaw-rigid-vessel')return text('硬い容器は動かないので、膨張の仕事はない',180,35,31)+box(450,130,340,280,C.cyan)+line(450,130,790,130,C.dim,9)+Array.from({length:15},(_,i)=>circle(475+i%5*68+Math.sin(i+p*5)*5,175+Math.floor(i/5)*85+Math.cos(i+p*5)*5,6,C.cyan)).join('')+arrow(90,280,410,280,C.gold)+circle(90+320*u,280,10,C.gold)+text('熱は入る',140,215,31,C.gold)+text('ふたは固定',500,95,31)+text('外を押して',860,240,29,C.purple)+text('動かす仕事：0',845,305,29,C.purple)+text('ほかの仕事がなければ、熱はすべて内部エネルギーの増加へ',70,495,28);
 if(kind==='firstlaw-force-area'){
  const x=710+70*u;
  return text('圧力が一定の気体が、ピストンの面を押す',195,35,31)+box(210,140,x-210,265,C.cyan)+line(x,120,x,425,C.gold,8)+arrow(x,270,x+170,270,C.gold)+text('気体が押す力 F',815,215,29,C.gold)+text('圧力 p',345,280,35,C.cyan)+line(x+15,140,x+15,405,C.purple,2)+text('ピストンの面積 S',685,475,29,C.purple)+text('ゆっくり動くピストン',225,100,28);
 }
 if(kind==='firstlaw-volume-prism'){
  const y=260-110*u;
  return text('増えた部分を立体で見る：底面積と移動距離',155,35,31)+box(435,y,300,260-y,C.gold)+path([[435,y],[515,y-60],[815,y-60],[735,y],[435,y]],C.gold,3,C.gold).replace('fill=', 'fill-opacity=".15" fill=')+path([[735,y],[815,y-60],[815,200],[735,260],[735,y]],C.gold,3,C.gold).replace('fill=', 'fill-opacity=".12" fill=')+line(435,260,735,260,C.dim,3)+line(435,260,435,415,C.dim,3)+line(735,260,735,415,C.dim,3)+line(435,415,735,415,C.dim,3)+arrow(355,260,355,y,C.purple)+text('移動距離 Δx',100,215,29,C.purple)+text('面積 S',840,y+10,31,C.gold)+text('黄色の立体：増えた体積',405,480,30,C.gold);
 }
 if(kind==='firstlaw-compression'){
  const x=830-260*u;
  return text('圧縮では、気体が押す向きと移動が逆向き',170,35,31)+box(190,160,x-190,230,C.cyan)+line(x,135,x,415,C.gold,8)+line(830,145,830,405,C.dim,2,'7 6')+arrow(x,115,x+150,115,C.gold)+text('気体が押す力：右向き',410,75,29,C.gold)+arrow(1030,260,x+30,260,C.red)+text('外から押す力',865,215,28,C.red)+arrow(830,450,x,450,C.purple)+text('ピストンの移動：左向き',445,505,29,C.purple);
 }
}
export function firstlawFoundationFrame(c,s,t){return c.visualPilot==='firstlaw-foundations-v1'?authoredMotionFrame(c,s,t,firstlawFoundationDiagram):null;}

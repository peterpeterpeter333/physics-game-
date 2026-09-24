import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const tau=2*Math.PI;
const chart=(y,amp,cycles,t,c)=>path(Array.from({length:201},(_,i)=>{const z=i/200;return[200+850*z,y-amp*Math.sin(tau*(cycles*z-t))];}),c,4);
const air=(t,y=280)=>Array.from({length:47},(_,i)=>{const base=120+20*i,x=base+22*Math.sin(tau*(base/400-t));return [y-45,y,y+45].map(Y=>circle(x,Y,i===19?8:5,i===19?C.red:C.cyan)).join('');}).join('');
export const soundFoundationKinds=['soundintro-air-motion','soundintro-compression','soundintro-pressure-graph','soundintro-displacement-graph','soundintro-loudness','soundintro-pitch'];
export function soundFoundationDiagram(kind,p){
 if(!soundFoundationKinds.includes(kind))throw Error(kind);const u=clamp(p/.9);
 if(kind==='soundintro-air-motion')return text('空気は前後へ往復し、密な場所が右へ伝わる',130,35,32)+air(u)+line(500,165,500,390,C.dim,2,'7 6')+arrow(465,420,535,420,C.red)+text('同じ空気の集まり',375,465,29,C.red)+arrow(760,125,1080,125,C.gold)+text('音が進む向き',785,95,29,C.gold)+text('点は空気の小さな集まりを表す模式図',275,505,26);
 if(kind==='soundintro-compression'){const center=200+400*u;return text('密な所と疎らな所が、右へ進む',270,35,32)+air(u)+line(center,180,center,380,C.gold,2)+line(center+200,180,center+200,380,C.purple,2)+text('密・圧力が高い',center-90,145,27,C.gold)+text('疎・圧力が低い',center+110,435,27,C.purple)+text('空気が上へ盛り上がっているわけではない',240,505,29);}
 if(kind==='soundintro-pressure-graph')return text('縦軸が圧力の変化なら、山は圧力の高い場所',100,35,32)+line(200,295,1090,295,C.dim,2)+line(200,155,200,430,C.dim,2)+chart(295,100,2,u+.25,C.gold)+text('普段からの圧力の変化 [Pa]',200,105,29,C.gold)+text('0',155,305,27)+text('普段より高い',215,150,27,C.gold)+text('普段より低い',215,455,27,C.purple)+text('横軸：位置',910,485,28)+circle(200+850*(.5+u)/2,195,10,C.gold);
 if(kind==='soundintro-displacement-graph')return text('縦軸が横向きのずれなら、山は右へずれた場所',70,35,32)+line(200,285,1090,285,C.dim,2)+line(200,130,200,420,C.dim,2)+chart(285,90,2,u,C.cyan)+text('右を正にした、空気の横向きのずれ [m]',200,100,28,C.cyan)+text('0',155,295,26)+text('右へずれた',35,185,25,C.cyan)+text('左へずれた',35,395,25,C.purple)+text('横軸：位置',910,455,28)+text('グラフの上向きは、実際の空気の右向きに対応',190,505,27);
 if(kind==='soundintro-loudness')return text('同じ振動数で比較：振幅の大きい音と小さい音',100,35,31)+[0,1].map(i=>{const y=200+i*190;return line(200,y,1090,y,C.dim,2)+chart(y,i?60:25,3,u,i?C.gold:C.cyan)+text(i?'大きい振幅':'小さい振幅',20,y+10,27,i?C.gold:C.cyan);}).join('')+text('同じ点の圧力変化',220,95,28)+text('どちらも、横軸は時刻。同じ時間幅で比較',270,505,27);
 if(kind==='soundintro-pitch')return text('同じ時間に、振動する回数が多いほど高い音',140,35,31)+[0,1].map(i=>{const y=200+i*190;return line(200,y,1090,y,C.dim,2)+chart(y,45,i?6:3,u*(i?2:1),i?C.purple:C.cyan)+text(i?'高い音':'低い音',55,y+10,29,i?C.purple:C.cyan);}).join('')+text('同じ点の圧力変化。振幅をそろえて比較',210,95,28)+text('横軸は時刻。下の音は上の音の2倍の振動数',245,505,27);
}
export function soundFoundationFrame(c,s,t){return c.visualPilot==='sound-foundations-v1'?authoredMotionFrame(c,s,t,soundFoundationDiagram):null;}

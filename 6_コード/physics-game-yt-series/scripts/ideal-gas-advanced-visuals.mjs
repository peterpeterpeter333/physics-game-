import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const box=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" fill-opacity=".22" stroke="${c}"/>`;
export const idealGasAdvancedKinds=['idealadvanced-oblique-wall','idealadvanced-components','idealadvanced-isotropic','idealadvanced-collision-ledger','idealadvanced-square-mean'];
export function idealGasAdvancedDiagram(kind,p){
 if(!idealGasAdvancedKinds.includes(kind))throw Error(kind);const u=clamp(p/.85);
 if(kind==='idealadvanced-oblique-wall'){
  const x=u<.5?320+1040*u:840-1040*(u-.5),y=405-300*u;
  return text('斜めの衝突でも、分子は壁を押す',280,35,32)+line(850,100,850,440,C.dim,6)+path([[320,405],[840,255],[320,105]],C.cyan,3)+circle(x,y,10,C.gold)+arrow(900,260,1080,260,C.gold)+text('壁への力',900,220,28,C.gold)+text('分子の道筋',170,280,30,C.cyan)+text('同じ速さで反射する、滑らかな壁を考える',250,495,29);
 }
 if(kind==='idealadvanced-components')return text('壁に垂直な成分は反転し、壁に沿う成分は変わらない',70,35,30)+[0,1].map(i=>{const x=270+i*600,y=330,s=i?-1:1,v=100+80*u;return line(x+s*230,100,x+s*230,425,C.dim,4)+arrow(x,y,x+s*v,y-v*.65,'#fff')+arrow(x,y,x+s*v,y,C.cyan)+arrow(x,y,x,y-v*.65,C.gold)+text(i?'反射後':'衝突前',x-65,95,32)+text(i?'横：左向き':'横：右向き',x-90,395,28,C.cyan)+text('縦：上向きのまま',x-125,455,27,C.gold)+circle(x,y,7,'#fff');}).join('');
 if(kind==='idealadvanced-isotropic'){
  const a=.25+.65*u,P=(x,y,z)=>[370+Math.cos(a)*x+Math.sin(a)*z,300-y+.3*z-.15*x],O=P(0,0,0),dirs=[[180,0,0],[-180,0,0],[0,140,0],[0,-140,0],[0,0,170],[0,0,-170]],colors=[C.cyan,C.cyan,C.gold,C.gold,C.purple,C.purple];
  return text('向きに偏りがない気体では、三方向の平均がそろう',125,35,31)+dirs.map((d,i)=>arrow(...O,...P(...d),colors[i])).join('')+text('三方向の対称な向きの例',150,485,28)+[0,1,2].map(i=>box(780+i*110,370-130*u,65,130*u,colors[i*2])+text(['横','縦','奥行き'][i],765+i*110,425,25,colors[i*2])).join('')+text('速度の二乗の平均',755,150,29)+text('高さが同じ',825,210,28)+text('一個の分子ではなく、全体の平均',690,485,26);
 }
 if(kind==='idealadvanced-collision-ledger'){
  const x=280+clamp(u*2)*520,back=800-clamp((u-.5)*2)*520;
  return text('分子の変化と、壁が受け取る量を別々に記録する',125,35,30)+line(820,125,820,440,C.dim,5)+circle(u<.5?x:back,190,10,C.cyan)+arrow(250,260,520,260,C.cyan)+text('衝突前：右向きの運動量',120,325,28,C.cyan)+arrow(530,385,260,385,C.purple)+text('衝突後：左向きの運動量',120,440,28,C.purple)+arrow(860,270,1100,270,C.gold)+text('壁は右向きの',880,335,28,C.gold)+text('力積を受け取る',865,380,28,C.gold)+text('右向きを正として、符号をそろえる',310,505,29);
 }
 if(kind==='idealadvanced-square-mean'){
  const vals=[1,4,9],mean=14/3,Y=v=>435-v*31;
  return text('三個の例で、二乗してから平均する意味を確かめる',100,35,30)+line(180,435,1080,435)+vals.map((v,i)=>`<g opacity="${.25+.75*clamp(u*3-i)}">`+box(270+i*270,Y(v),105,31*v,[C.cyan,C.gold,C.purple][i])+text(String(v),300+i*270,Y(v)-18,30)+'</g>'+text(['横の速度：1','横の速度：2','横の速度：3'][i],220+i*270,485,26)).join('')+line(190,Y(mean),1080,Y(mean),C.gold,2,'7 5')+text('二乗の平均：14/3',190,Y(mean)-18,27,C.gold)+text('縦軸：速度の二乗 [(m/s)²]',110,95,28)+text('横の速度の単位：m/s',675,95,26);
 }
}
export function idealGasAdvancedFrame(c,s,t){return c.visualPilot==='ideal-gas-advanced-v1'?authoredMotionFrame(c,s,t,idealGasAdvancedDiagram):null;}

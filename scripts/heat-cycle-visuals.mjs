import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const box=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" fill-opacity=".15" stroke="${c}" stroke-width="2"/>`;
const onPath=(pts,u)=>{const s=Math.min(pts.length-2,Math.floor(u*(pts.length-1))),v=u*(pts.length-1)-s;return[pts[s][0]+(pts[s+1][0]-pts[s][0])*v,pts[s][1]+(pts[s+1][1]-pts[s][1])*v];};
export const heatCycleKinds=['heatcycle-work-signs','heatcycle-return-state','heatcycle-adiabatic','heatcycle-engine-loop','heatcycle-heat-flow','heatcycle-second-law','heatcycle-state-ledger'];
export function heatCycleDiagram(kind,p){
 if(!heatCycleKinds.includes(kind))throw Error(kind);const u=clamp(p/.85);
 if(kind==='heatcycle-work-signs')return text('膨張で取り出す仕事と、圧縮に必要な仕事を差し引く',90,35,30)+[0,1].map(i=>{const x=80+i*610,w=i?340-120*u:220+120*u,c=i?C.purple:C.gold;return box(x,185,w,200,C.cyan)+line(x+w,160,x+w,410,c,7)+arrow(x+w,145,x+w+80,145,C.gold)+arrow(x+200,445,x+200+(i?-100:100),445,c)+text(i?'圧縮：気体の仕事は負':'膨張：気体の仕事は正',x+10,100,28,c)+text('気体が押す力は右向き',x,500,26,C.gold);}).join('');
 if(kind==='heatcycle-return-state'){
  const pts=[[360,180],[850,180],[850,365],[360,365],[360,180]];
  return text('同じ状態へ戻っても、一周の仕事は残りうる',170,35,31)+line(180,435,1080,435)+line(210,95,210,435)+path(pts,C.cyan,4)+circle(...onPath(pts,u),11,C.gold)+circle(360,180,6,C.gold)+text('最初と最後は同じ点',300,125,30,C.gold)+arrow(535,180,650,180,C.gold)+arrow(650,365,535,365,C.purple)+text('圧力 p',105,95,28)+text('体積 V',960,475,28)+text('内部エネルギーは元に戻る。途中の熱と仕事は別に数える',125,505,27);
 }
 if(kind==='heatcycle-adiabatic'){
  const x=720+100*u;
  return text('断熱でも、仕事によるエネルギーの出入りはできる',100,35,30)+box(360,140,x-360,270,C.cyan)+line(350,135,x+10,135,C.dim,12)+line(350,415,x+10,415,C.dim,12)+line(350,135,350,415,C.dim,12)+line(x,140,x,410,C.gold,7)+arrow(x+20,275,1100,275,C.gold)+circle(x+20+(1080-x)*u,275,8,C.gold)+text('外へする仕事',865,225,29,C.gold)+arrow(70,275,300,275,C.red)+line(205,235,265,315,C.red,5)+line(265,235,205,315,C.red,5)+text('熱の出入りなし',55,190,28,C.red)+text('断熱材の壁',450,105,28)+text('気体の温度が一定、という条件ではない',310,495,29);
 }
 if(kind==='heatcycle-engine-loop'){
  const pts=[[340,165],[835,165],[835,385],[340,385],[340,165]];
  return text('繰り返し働く熱機関：気体の状態は一周して戻る',120,35,30)+path(pts,C.cyan,4)+circle(...onPath(pts,u),12,C.gold)+text('加熱・膨張',430,115,31,C.gold)+text('冷却・圧縮',430,455,31,C.cyan)+arrow(485,165,665,165,C.gold)+arrow(665,385,485,385,C.cyan)+text('熱を受け取る',45,210,27,C.gold)+arrow(90,250,290,250,C.gold)+text('仕事を取り出す',895,275,27,C.purple)+arrow(870,310,1110,310,C.purple)+text('状態を表す概念図。実際のp-Vグラフではない',250,505,27);
 }
 if(kind==='heatcycle-heat-flow')return text('高温側からの熱が、仕事と低温側への熱に分かれる',75,35,30)+box(120,155,250,260,C.red)+text('高温側',175,285,35,C.red)+box(490,180,260,190,C.gold)+text('熱機関',560,290,35,C.gold)+arrow(390,270,465,270,C.red)+circle(390+75*u,270,8,C.red)+text('受取熱 Q_H',365,145,27,C.red)+box(875,340,255,130,C.cyan)+text('低温側',945,425,32,C.cyan)+arrow(775,340,850,405,C.cyan)+circle(775+75*u,340+65*u,8,C.cyan)+text('放出熱 Q_C',820,315,27,C.cyan)+arrow(790,200,1120,200,C.purple)+circle(790+330*u,200,8,C.purple)+text('差し引きの仕事 W',810,140,28,C.purple);
 if(kind==='heatcycle-second-law')return text('熱の全量を仕事へ変え続ける熱機関は作れない',130,35,30)+box(80,175,250,230,C.red)+text('一つの熱源',120,290,31,C.red)+arrow(355,285,465,285,C.gold)+circle(355+110*u,285,8,C.gold)+box(495,175,260,230,C.cyan)+text('一周する装置',515,290,31,C.cyan)+arrow(790,285,1120,285,C.purple)+circle(790+330*u,285,8,C.purple)+text('受取熱の全量を仕事へ？',805,230,27,C.purple)+line(885,315,960,390,C.red,5)+line(960,315,885,390,C.red,5)+text('ほかに変化を残さず繰り返す場合。第二法則による制限',150,490,28);
 if(kind==='heatcycle-state-ledger'){
  return text('一周の前後で同じ状態なら、内部エネルギーも同じ',115,35,30)+[0,1].map(i=>{const x=95+i*720;return box(x,115,285,285,C.cyan)+text(i?'一周した後':'一周する前',x+50,165,31)+text('同じ圧力・体積',x+35,225,27,C.cyan)+text('同じ量・温度',x+45,280,27,C.cyan)+box(x+60,325,165,45,C.gold);}).join('')+arrow(425,245,755,245,C.gold)+circle(425+330*u,245,10,C.gold)+text('途中で熱と仕事を受け渡す',400,190,26)+text('黄色の棒：内部エネルギー。前後の値は同じ',260,480,28,C.gold);
 }
}
export function heatCycleFrame(c,s,t){return c.visualPilot==='heat-cycle-v1'?authoredMotionFrame(c,s,t,heatCycleDiagram):null;}

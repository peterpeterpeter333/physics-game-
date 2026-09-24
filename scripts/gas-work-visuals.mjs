import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const box=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" fill-opacity=".2" stroke="${c}" stroke-width="2"/>`;
const face=(x,y,w,h,c)=>path([[x,y],[x+w,y-65],[x+w,y+h-65],[x,y+h],[x,y]],c,3,c).replace('fill=', 'fill-opacity=".18" fill=');
export const gasWorkKinds=['gaswork-pressure-face','gaswork-swept-volume','gaswork-area-pieces','gaswork-path-comparison','gaswork-energy-split','gaswork-numeric-paths'];
export function gasWorkDiagram(kind,p){
 if(!gasWorkKinds.includes(kind))throw Error(kind);const u=clamp(p/.85);
 if(kind==='gaswork-pressure-face')return text('圧力は、ピストンの面全体を押す',280,35,32)+face(700,170,130,270,C.cyan)+Array.from({length:3},(_,i)=>{const y=185+i*90,x=460;return arrow(x,y,700+10*u,y,C.gold);}).join('')+text('気体の圧力 p',200,270,31,C.gold)+text('面積 S',875,265,34,C.cyan)+text('圧力が一様なら、面積が大きいほど合計の力も大きい',150,490,28);
 if(kind==='gaswork-swept-volume'){
  const start=550,end=550+250*u,w=120,y=175,h=230;
  return text('ピストンが進んだ部分が、増えた体積になる',195,35,31)+face(start,y,w,h,C.dim)+face(end,y,w,h,C.gold)+[[0,0],[w,-65],[w,h-65],[0,h]].map(([a,b])=>line(start+a,y+b,end+a,y+b,C.gold,2)).join('')+path([[start,y],[end,y],[end,y+h],[start,y+h],[start,y]],C.gold,1,C.gold).replace('fill=', 'fill-opacity=".1" fill=')+arrow(start,450,end,450,C.purple)+text('進んだ距離 Δx',535,500,28,C.purple)+text('面積 S',end+w+25,250,29,C.gold)+text('増えた部分',210,270,30,C.gold)+arrow(385,270,start+90*u,270,C.gold);
 }
 if(kind==='gaswork-area-pieces'){
  const X=v=>170+260*v,Y=q=>425-85*q,n=3+Math.floor(13*u),dv=2/n,P=v=>2.8-.55*(v-1);
  return text('小区間の仕事を足すと、グラフの下の面積になる',100,35,31)+line(150,425,1100,425)+line(170,95,170,425)+Array.from({length:n},(_,i)=>{const v=1+i*dv;return box(X(v),Y(P(v+dv/2)),dv*260,425-Y(P(v+dv/2)),C.gold);}).join('')+path(Array.from({length:61},(_,i)=>{const v=1+i/30;return[X(v),Y(P(v))];}),C.cyan,4)+text('圧力 p',75,85,28)+text('体積 V',1000,460,28)+text('体積の小さい変化',495,475,28,C.gold)+text('細い長方形一つの面積が、小区間の仕事',280,505,26);
 }
 if(kind==='gaswork-path-comparison')return text('同じ体積変化でも、高い圧力の道筋ほど仕事が大きい',60,35,30)+[0,1].map(i=>{const x=95+590*i,h=i?130:240,c=i?C.cyan:C.gold;return line(x,420,x+460,420)+line(x,120,x,420)+box(x+90,420-h,290, h,c)+line(x+90,420-h,x+380,420-h,c,4)+circle(x+90+290*u,420-h,9,c)+text('圧力',x-30,105,26)+text('体積',x+390,465,26)+text(i?'低い圧力のまま膨張':'高い圧力のまま膨張',x+20,85,27,c);}).join('')+text('横幅は同じ。面積の違いは、圧力の高さの違い',235,505,28);
 if(kind==='gaswork-energy-split')return text('受け取ったエネルギーは、気体の中と外へ分かれる',105,35,30)+box(430,120,350,310,C.cyan)+text('気体',560,190,35,C.cyan)+arrow(80,275,390,275,C.gold)+circle(80+310*u,275,9,C.gold)+text('受け取る熱',135,225,30,C.gold)+arrow(830,245,1110,245,C.purple)+circle(830+280*u,245,9,C.purple)+text('外へする仕事',845,195,28,C.purple)+text('内部エネルギー',450,345,30,C.cyan)+text('気体の中に残る分',470,395,27)+text('熱と仕事だけでエネルギーが出入りする場合',265,500,28);
 if(kind==='gaswork-numeric-paths'){
  const X=v=>230+220*v,Y=q=>430-q*100;
  return text('膨張する体積は同じ1 L。圧力が2倍なら仕事も2倍',80,35,30)+line(190,430,1100,430)+line(230,125,230,430)+box(X(1),Y(2),220,200,C.gold)+box(X(1),Y(1),220,100,C.cyan)+path([[X(1),Y(2)],[X(1),Y(1)],[X(2),Y(1)]],C.cyan,4)+line(X(1),Y(2),X(2),Y(2),C.gold,4)+circle(X(1)+220*u,Y(2),8,C.gold)+circle(X(1)+220*u,Y(1),8,C.cyan)+text('20万 Pa',80,Y(2)+10,29,C.gold)+text('10万 Pa',80,Y(1)+10,29,C.cyan)+text('200 J',760,Y(2)+10,32,C.gold)+text('100 J',760,Y(1)+10,32,C.cyan)+text('体積 V',960,470,28)+text('膨張した分：1 L',430,485,29)+text('圧力 p',130,100,29);
 }
}
export function gasWorkFrame(c,s,t){return c.visualPilot==='gas-work-v1'?authoredMotionFrame(c,s,t,gasWorkDiagram):null;}

import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const ease=p=>{p=clamp(p/.8);return p*p*(3-2*p);};
const box=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${c}" opacity=".25" stroke="${c}" stroke-width="3"/>`;
export const heatMeltingKinds=['meltingadvanced-mass-fractions','meltingadvanced-mixing-transfer','meltingprep-plateau','meltingprep-equilibrium','meltinginsert-hot-cold','meltinginsert-temperature-balance'];
export function heatMeltingDiagram(kind,p){
 if(!heatMeltingKinds.includes(kind))throw Error(kind);const u=ease(p);
 if(kind==='meltingadvanced-mass-fractions'){
  return text('氷100 gが水へ変わる：質量の割合を棒で見る',180,35,31)+box(180,190,800*(1-u),90,C.purple)+box(180+800*(1-u),190,800*u,90,C.cyan)+text(`氷 ${(100*(1-u)).toFixed(0)} g`,180,150,32,C.purple)+text(`水 ${(100*u).toFixed(0)} g`,790,150,32,C.cyan)+text('温度 0℃',430,355,45,C.gold)+text(`受け取った熱量 ${(33400*u).toFixed(0)} J`,350,435,31)+text('一気圧の純粋な氷。棒は体積ではなく質量の割合',160,505,28);
 }
 if(kind==='meltingadvanced-mixing-transfer'){
  return text('外への熱の出入りがなければ、受け渡す量は同じ',125,35,31)+box(140,180,300,175,C.red)+box(760,180,300,175,C.cyan)+text('熱い物体',215,245,33,C.red)+text('冷たい物体',815,245,33,C.cyan)+arrow(470,260,725,260,C.gold)+circle(485+220*u,260,10,C.gold)+text('失う熱量',210,410,30,C.red)+text('受け取る熱量',800,410,30,C.cyan)+box(180,435,210*u,25,C.red)+box(810,435,210*u,25,C.cyan)+text('下の棒は、同じ受け渡し量を両側から見たもの',230,505,28);
 }
 if(kind==='meltingprep-plateau'){
  const x=180+850*u;
  return text('氷が融ける間は、熱量が増えても温度は0℃',205,35,30)+line(150,290,1120,290)+line(180,120,180,310)+line(180,290,1030,290,C.dim,2,'6 6')+line(180,290,x,290,C.cyan,5)+circle(x,290,11,C.gold)+text('温度 [℃]',70,100,29)+text('0',130,300,30)+text('融かすために受け取った熱量 [J]',560,440,28)+text('0',175,335,26)+text('33400',980,335,26)+text(`融けた氷 ${(100*u).toFixed(0)} g ／ 全体100 g`,400,170,31,C.cyan)+text('氷が全部融けるまでの区間だけを表示',335,505,28);
 }
 if(kind==='meltingprep-equilibrium'){
  const X=q=>180+q/12600*830,Y=T=>430-T*3.8,Q=12600*u;
  return text('同じ量の水が熱を受け渡し、同じ温度へ近づく',165,35,30)+line(160,440,1120,440)+line(180,100,180,440)+text('温度 [℃]',65,85,28)+[20,50,80].map(T=>text(String(T),130,Y(T)+8,26)+line(175,Y(T),185,Y(T))).join('')+path([[X(0),Y(80)],[X(Q),Y(80-Q/420)]],C.red,4)+path([[X(0),Y(20)],[X(Q),Y(20+Q/420)]],C.cyan,4)+circle(X(Q),Y(80-Q/420),9,C.red)+circle(X(Q),Y(20+Q/420),9,C.cyan)+text('熱い水から移った熱量 Q [J]',660,485,27)+text('熱い水',370,130,28,C.red)+text('冷たい水',370,400,28,C.cyan)+text('水は各100 g。外・容器との熱の出入りを無視',270,505,25);
 }
 if(kind==='meltinginsert-hot-cold'){
  return text('同じ質量の水を混ぜ、外には熱を逃がさない',190,35,30)+box(180,160,300,230,C.red)+box(720,160,300,230,C.cyan)+text('水 100 g',255,120,30)+text('水 100 g',795,120,30)+text(`${(80-30*u).toFixed(0)}℃`,275,250,45,C.red)+text(`${(20+30*u).toFixed(0)}℃`,815,250,45,C.cyan)+arrow(495,300,700,300,C.gold)+text('失う分',280,445,28,C.red)+text('受け取る分',790,445,28,C.cyan)+text('二つの量が等しい：エネルギー保存を使う',265,510,29);
 }
 if(kind==='meltinginsert-temperature-balance'){
  const X=T=>180+(T-20)*14.0,hot=80-30*u,cold=20+30*u;
  return text('同じ質量・同じ比熱なら、温度の変化も同じ',190,35,30)+line(X(20),260,X(80),260,C.dim,4)+[20,50,80].map(T=>line(X(T),240,X(T),280)+text(`${T}℃`,X(T)-30,330,30)).join('')+circle(X(hot),220,14,C.red)+circle(X(cold),300,14,C.cyan)+arrow(X(80),150,X(hot),150,C.red)+arrow(X(20),405,X(cold),405,C.cyan)+text('熱い水：30℃下がる',700,100,28,C.red)+text('冷たい水：30℃上がる',180,465,28,C.cyan)+text('質量や比熱が違う場合は、真ん中の温度とは限らない',140,505,27);
 }
}
export function heatMeltingFrame(c,s,t){return c.visualPilot==='heat-melting-v1'?authoredMotionFrame(c,s,t,heatMeltingDiagram):null;}

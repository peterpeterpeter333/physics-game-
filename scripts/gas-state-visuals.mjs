import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const ease=p=>{p=clamp(p/.8);return p*p*(3-2*p);};
const box=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" opacity=".22" stroke="${c}" stroke-width="2"/>`;
export const gasStateKinds=['gasstates-piston-work','gasstates-pressure-area','gasstates-two-paths','gasstates-energy-boundary','gasstates-intermediate-state'];
export function gasStateDiagram(kind,p){
 if(!gasStateKinds.includes(kind))throw Error(kind);const u=ease(p);
 if(kind==='gasstates-piston-work'){
  const x=590+240*u;
  return text('気体がピストンを押し、体積を増やす',235,35,31)+box(170,160,x-170,230,C.cyan)+line(170,160,170,390,C.dim,5)+line(170,160,980,160,C.dim,3)+line(170,390,980,390,C.dim,3)+line(590,140,590,420,C.dim,2,'7 6')+box(590,160,x-590,230,C.gold)+line(x,145,x,410,C.gold,7)+arrow(x,100,x+100,100,C.red)+text('押す力 F',x-40,70,28,C.red)+arrow(590,455,x,455,C.purple)+text('移動距離 Δx',600,505,29,C.purple)+text('ピストンの面積 S',185,110,29)+text('黄の部分：増えた体積',210,335,27,C.gold);
 }
 if(kind==='gasstates-pressure-area'){
  const X=v=>140+v*250,Y=p=>425-p*105,n=4+Math.floor(12*u),dv=2/n,pressure=v=>2.6-.45*(v-1);
  return text('ゆっくり膨張：小さい体積変化ごとの仕事を足す',125,35,30)+line(120,425,1120,425)+line(140,95,140,425)+Array.from({length:n},(_,i)=>{const v=1+i*dv,P=pressure(v+dv/2);return box(X(v),Y(P),dv*250,425-Y(P),C.gold);}).join('')+path(Array.from({length:61},(_,i)=>{const v=1+2*i/60;return[X(v),Y(pressure(v))];}),C.cyan,4)+text('圧力 p',65,90,28)+text('体積 V',970,465,28)+text('V₁',X(1)-15,465,27)+text('V₂',X(3)-15,465,27)+text('長方形の横幅：小さい体積変化　高さ：そのときの圧力',165,135,27,C.gold)+text('分け方を細かくすると、道筋の下の面積へ近づく',210,505,27);
 }
 if(kind==='gasstates-two-paths'){
  return text('始点と終点は同じでも、仕事を表す面積は違う',160,35,30)+[0,1].map(i=>{const x=100+i*590,X=v=>x+v*135,Y=p=>435-p*95,c=i?C.cyan:C.purple,high=2.5,low=1.1,pts=i?[[X(1),Y(high)],[X(1),Y(low)],[X(3),Y(low)]]:[[X(1),Y(high)],[X(3),Y(high)],[X(3),Y(low)]],a=u<.5?pts[0]:pts[1],b=u<.5?pts[1]:pts[2],v=u<.5?u*2:(u-.5)*2;return line(x,435,x+470,435)+line(x,110,x,435)+box(X(1),Y(i?low:high),270,435-Y(i?low:high),c)+path(pts,c,4)+circle(X(1),Y(high),8,C.gold)+circle(X(3),Y(low),8,C.gold)+circle(a[0]+(b[0]-a[0])*v,a[1]+(b[1]-a[1])*v,10,'#fff')+text('p',x-30,125,27)+text('V',x+440,475,27)+text(i?'低い圧力で膨らませる':'高い圧力で膨らませる',x+25,85,27,c)+text('始点',X(1)-30,Y(high)-25,24,C.gold)+text('終点',X(3)-30,Y(low)-20,24,C.gold);}).join('')+text('縦の移動では体積が変わらないので、膨張の仕事は0',170,505,27);
 }
 if(kind==='gasstates-energy-boundary'){
  return text('気体の状態と、外との受け渡しは分けて記録する',125,35,30)+box(425,145,350,280,C.cyan)+text('気体の状態',505,215,32,C.cyan)+text('圧力・体積・温度',455,310,29)+arrow(100,250,390,250,C.gold)+circle(110+260*u,250,9,C.gold)+text('受け取る熱',140,190,30,C.gold)+arrow(810,330,1110,330,C.red)+circle(825+265*u,330,9,C.red)+text('外へする仕事',835,275,30,C.red)+text('次は、二つの受け渡しで気体のエネルギーがどう変わるか',100,505,27);
 }
 if(kind==='gasstates-intermediate-state'){
  return text('途中の状態を置き、既知の法則を一つずつ使う',155,35,30)+[0,1,2].map(i=>{const x=65+i*400,c=i===1?C.gold:C.cyan;return box(x,130,270,245,c)+text(['状態1','途中の状態','状態2'][i],x+40,180,31,c)+text(['圧力 p₁','圧力 p₁','圧力 p₂'][i],x+45,245,28)+text(['体積 V₁','体積 V′','体積 V₂'][i],x+45,295,28)+text(['温度 T₁','温度 T₂','温度 T₂'][i],x+45,345,28);}).join('')+arrow(350,270,440,270,C.gold)+arrow(750,270,840,270,C.gold)+text('① 圧力を保って温度を変える',90,440,27,C.gold)+text('② 温度を保って圧力を変える',665,480,27,C.gold)+circle(355+clamp(u*2)*70,270,6,C.gold)+circle(755+clamp(u*2-1)*70,270,6,C.gold);
 }
}
export function gasStateFrame(c,s,t){return c.visualPilot==='gas-states-v1'?authoredMotionFrame(c,s,t,gasStateDiagram):null;}

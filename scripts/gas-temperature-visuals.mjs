import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const ease=p=>{p=clamp(p/.8);return p*p*(3-2*p);};
export const gasTemperatureKinds=['gastemp-two-scales','gastemp-small-expansion','gastemp-volume-line','gastemp-extrapolate','gastemp-shift-origin'];
export function gasTemperatureDiagram(kind,p){
 if(!gasTemperatureKinds.includes(kind))throw Error(kind);const u=ease(p);
 if(kind==='gastemp-two-scales'){
  const X=K=>180+K*2.5,K=293.15+20*u;
  return text('同じ温度を、ゼロの位置が違う二つの目盛りで読む',100,35,30)+[180,370].map(y=>line(180,y,1080,y)).join('')+line(X(K),130,X(K),410,C.dim,2,'6 6')+circle(X(K),180,12,C.cyan)+circle(X(K),370,12,C.gold)+text('摂氏温度',70,100,30,C.cyan)+text('絶対温度',70,310,30,C.gold)+text('−273.15℃',120,235,28)+text('0℃',X(273.15)-22,235,29)+text('0 K',160,425,29)+line(X(273.15),165,X(273.15),195,C.dim)+text(`${(K-273.15).toFixed(0)}℃`,X(K)-40,120,32,C.cyan)+text(`${K.toFixed(2)} K`,X(K)-75,330,32,C.gold)+text('1℃の幅と1 Kの幅は同じ。違うのはゼロの位置',190,505,29);
 }
 if(kind==='gastemp-small-expansion'){
  const ratio=(293.15+20*u)/293.15,w=600*ratio;
  return text('圧力と気体の量を一定にして、20℃から40℃へ',155,35,30)+`<rect x="200" y="170" width="${w}" height="225" fill="${C.cyan}" opacity=".18"/>`+line(200,170,200,395,C.dim,5)+line(200,170,900,170,C.dim,3)+line(200,395,900,395,C.dim,3)+line(800,150,800,420,C.dim,2,'6 6')+line(200+w,155,200+w,410,C.gold,7)+text('初めのピストン',640,135,27,C.dim)+text(`${(20+20*u).toFixed(0)}℃`,430,255,43,C.cyan)+text(`体積：元の${ratio.toFixed(3)}倍`,345,330,32,C.gold)+text('同じ断面積なので、長さの比が体積の比になる',200,495,29);
 }
 const X=t=>180+(t+273.15)*2.25,Y=V=>430-V*220;
 const axes=line(150,430,1100,430)+line(180,95,180,450)+text('体積（相対値）',65,85,28)+text('0',135,440,28);
 if(kind==='gastemp-volume-line'){
  const end=80*u;
  return text('量と圧力を一定にした、薄い気体の近似',205,35,31)+axes+path([[X(0),Y(1)],[X(end),Y((end+273.15)/273.15)]],C.cyan,5)+[0,20,40,80].filter(t=>t<=end).map(t=>circle(X(t),Y((t+273.15)/273.15),8,C.gold)).join('')+text('摂氏温度 [℃]',860,410,28)+text('0',X(0)-10,470,28)+text('80',X(80)-15,470,28)+text('グラフは関係を示す模式図。実測データではない',240,505,26);
 }
 if(kind==='gastemp-extrapolate'){
  const low=-273.15*u;
  return text('近似の直線を、測っていない低温側へ延ばす',160,35,31)+axes+line(X(0),Y(1),X(80),Y((80+273.15)/273.15),C.cyan,5)+line(X(low),Y((low+273.15)/273.15),X(0),Y(1),C.gold,3,'9 7')+circle(X(low),Y((low+273.15)/273.15),9,C.gold)+text('実際の気体がこのまま縮む',250,130,28,C.dim)+text('という意味ではない',250,170,28,C.dim)+text('−273.15℃',115,480,28,C.gold)+text('摂氏温度',920,480,28)+text('実在の気体は、液化などでこの近似から外れる',230,505,27);
 }
 if(kind==='gastemp-shift-origin'){
  const shift=273.15*u;
  return text('ゼロの目盛りを変えると、原点を通る比例になる',105,35,30)+axes+line(X(-273.15),Y(0),X(80),Y((80+273.15)/273.15),C.cyan,4)+[[-273.15,0],[0,1],[80,353.15/273.15]].map(([t,v])=>line(X(t),423,X(t),437)+text((t+shift).toFixed(u===1?2:0),X(t)-28,478,27,C.gold)).join('')+text(u===1?'絶対温度 [K]':'温度の目盛りを移動中',760,505,27,C.gold)+text('体積の値・直線そのものは変えていない',320,135,29);
 }
}
export function gasTemperatureFrame(c,s,t){return c.visualPilot==='gas-temperature-v1'?authoredMotionFrame(c,s,t,gasTemperatureDiagram):null;}

import {C,text,line,circle,arrow,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
export const foundationAppendixKinds=['appendix-shm-ends','appendix-shm-center','appendix-shm-crossing','appendix-heat-ten-groups'];
export function foundationAppendixDiagram(kind,p){
 if(!foundationAppendixKinds.includes(kind))throw Error(kind);const u=clamp(p/.8);
 if(kind==='appendix-shm-ends'||kind==='appendix-shm-center'){
  const center=kind==='appendix-shm-center';
  return text(center?'真ん中では、力0でも速さは最大':'両端では、速さ0でも力の大きさは最大',210,35,31)+[0,1,2].map(i=>{const x=220+i*380,active=center?i===1:i!==1,opacity=active?.55+.45*u:.22;return `<g opacity="${opacity}">`+line(x-125,275,x+125,275)+circle(x,275,24,C.gold)+text(['左の端','真ん中','右の端'][i],x-60,130,29)+(i!==1?arrow(x,195,x+(i===0?95:-95),195,C.red):text('力0',x-27,200,28,C.red))+(i===1?arrow(x-70,370,x+70,370,C.cyan):text('速度0',x-45,380,29,C.cyan))+'</g>';}).join('')+text('赤：ばねの力　青：速度（左から右へ通る場合）',165,470,29)+text('摩擦なし。左端は縮み、右端は伸びが最大',255,510,27);
 }
 if(kind==='appendix-shm-crossing'){
  const a=Math.PI*(.5+u*.5),x=600-260*Math.cos(a),v=140*Math.sin(a),f=-(x-600)*.55;
  return text('中心を右へ通過した後は、力が速度と逆向き',165,35,31)+line(230,280,1030,280)+line(600,130,600,435,C.dim,2,'6 6')+circle(x,280,25,C.gold)+(Math.abs(v)>1?arrow(x,190,x+v,190,C.cyan):text('速度0',x-40,190,28,C.cyan))+(Math.abs(f)>1?arrow(x,365,x+f,365,C.red):text('力0',x-25,370,28,C.red))+text('速度',220,150,29,C.cyan)+text('ばねの力',220,370,29,C.red)+text('中心',570,470,29)+text('右の端',805,470,29)+text('矢印の長さは別の縮尺。速度は小さくなり、力は大きくなる',100,510,26);
 }
 if(kind==='appendix-heat-ten-groups'){
  const n=Math.min(10,Math.floor(u*10)+1);
  return text('100 gの水を10組集めると、1000 g',255,35,31)+Array.from({length:10},(_,i)=>{const x=125+i%5*200,y=140+Math.floor(i/5)*150,active=i<n;return `<g opacity="${active?1:.18}"><rect x="${x}" y="${y}" width="150" height="100" rx="9" fill="${C.cyan}" opacity=".2"/>`+text('100 g',x+28,y+38,28)+text('420 J',x+28,y+80,28,C.gold)+'</g>';}).join('')+text(`点灯した${n}組分の熱量：${n*420} J`,320,455,31,C.gold)+text('各組を同じ1℃だけ温める。熱量を足す',305,510,27);
 }
}
export function foundationAppendixFrame(c,s,t){return c.visualPilot==='foundation-appendices-v1'?authoredMotionFrame(c,s,t,foundationAppendixDiagram):null;}

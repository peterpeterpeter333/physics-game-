import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const tau=2*Math.PI;
const wave=(x,y,w,a,lambda,shift,c=C.cyan)=>path(Array.from({length:201},(_,i)=>{const q=i*w/200;return[x+q,y-a*Math.cos(tau*(q-shift)/lambda)];}),c,4);
const bracket=(a,b,y,label,c=C.gold)=>line(a,y,b,y,c,3)+line(a,y-9,a,y+9,c,3)+line(b,y-9,b,y+9,c,3)+text(label,(a+b)/2-50,y-15,28,c);
export const waveSpeedKinds=['wavespeed-crest-distance','wavespeed-cycle-count','wavespeed-fixed-speed','wavespeed-numeric-travel'];
export function waveSpeedDiagram(kind,p){
 if(!waveSpeedKinds.includes(kind))throw Error(kind);const u=clamp(p/.88);
 if(kind==='wavespeed-crest-distance'){const start=210,end=650;return text('一周期後：山は、隣の山がいた位置へ進む',180,35,32)+wave(start,290,880,90,440,0,C.dim)+wave(start,290,880,90,440,440*u)+circle(start+440*u,200,12,C.gold)+line(start,140,start,390,C.dim,2,'7 6')+line(end,140,end,390,C.dim,2,'7 6')+bracket(start,end,110,'一波長')+text('最初の山',start-65,435,28,C.dim)+text('一周期後の山',end-80,435,28,C.gold)+text('灰色：最初の形。水色：動いている波',285,495,28);}
 if(kind==='wavespeed-cycle-count'){const x=120+960*u;return text('周期0.5秒なら、1秒の中に二回ぶん入る',155,35,32)+line(120,280,1100,280,C.dim,2)+path(Array.from({length:201},(_,i)=>{const q=i/200;return[120+960*q,280-90*Math.sin(4*Math.PI*q)];}),C.cyan,4)+[0,.5,1].map(t=>line(120+960*t,155,120+960*t,350,C.dim,2,'6 6')+text(t+' s',100+960*t,390,28)).join('')+circle(x,280-90*Math.sin(4*Math.PI*u),11,C.gold)+bracket(120,600,120,'一回')+bracket(600,1080,120,'一回')+text('同じ一点の上下のずれを、時間に沿って記録',230,460,29)+text('横軸は時刻。ひもの横の位置ではない',310,505,27,C.gold);}
 if(kind==='wavespeed-fixed-speed')return text('波の速さは同じ：山の進む距離をそろえて比較',100,35,31)+[0,1].map(i=>{const y=190+i*210,lam=i?220:440;return wave(180,y,900,55,lam,440*u)+circle(180+440*u,y-55,11,C.gold)+text(i?'振動数2倍・波長半分':'もとの振動数と波長',190,y+100,28,i?C.purple:C.cyan);}).join('')+line(180+440*u,100,180+440*u,460,C.gold,2,'6 6')+arrow(940,105,1120,105,C.gold);
 if(kind==='wavespeed-numeric-travel'){const X=x=>150+130*x,peak=6*u;return text('1秒で、3 mの波長を二つぶん進む',275,35,32)+wave(150,285,950,70,390,780*u)+circle(X(peak),215,12,C.gold)+line(X(0),160,X(0),380,C.dim,2,'6 6')+line(X(6),160,X(6),380,C.dim,2,'6 6')+bracket(X(0),X(3),125,'3 m')+bracket(X(3),X(6),125,'3 m')+[0,3,6].map(x=>text(x+' m',X(x)-15,425,28)).join('')+text('経過時間：'+u.toFixed(2)+' 秒',410,485,30,C.gold);}
}
export function waveSpeedFrame(c,s,t){return c.visualPilot==='wave-speed-v1'?authoredMotionFrame(c,s,t,waveSpeedDiagram):null;}

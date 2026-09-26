import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const ease=p=>{p=clamp(p/.8);return p*p*(3-2*p);};
const rect=(x,y,w,h,c,alpha=.3)=>`<rect x="${x}" y="${y}" width="${Math.max(0,w)}" height="${Math.max(0,h)}" fill="${c}" fill-opacity="${alpha}"/>`;
const cart=(x,y,c=C.cyan)=>rect(x-45,y-30,90,45,c,.6)+circle(x-28,y+24,12,C.dim)+circle(x+28,y+24,12,C.dim);
const graph=(ox,oy,w,h)=>line(ox,oy,ox+w,oy)+line(ox,oy,ox,oy-h)+text('時間 [s]',ox+w-60,oy+44,25)+text('力 [N]',ox+5,oy-h-18,25);
export const momentumFoundationKinds=['impulse-duration','impulse-double-time','impulse-area','impulse-average','impulse-internal-pair','momentum-two-carts','momentum-stop-times','momentum-equal-impulses','momentum-mass-bars'];
export function momentumFoundationDiagram(kind,p){
 if(!momentumFoundationKinds.includes(kind))throw Error('Unknown momentum diagram '+kind);
 const u=ease(p),time=clamp(p/.8);
 if(kind==='impulse-duration'){
  const t=2*time,x=200+110*t*t;
  return text('質量 1 kg、右向きの合力 2 N、初速0',240,40,31)+line(120,335,1080,335)+cart(x,300)+arrow(x,230,x+90,230,C.red)+arrow(x,390,x+100*t,390,C.cyan)+text(`経過時間 ${t.toFixed(1)} s`,165,125,32,C.gold)+text(`速度 ${(2*t).toFixed(1)} m/s`,670,450,31,C.cyan)+text('赤：一定の合力　青：変わる速度',245,505,28);
 }
 if(kind==='impulse-double-time')return text('同じ 2 N の力を、長く加える',330,35,31)+[1,2].map((n,i)=>{const ox=150+i*535,oy=380;return graph(ox,oy,390,255)+rect(ox,oy-150,140*n*u,150,i?C.purple:C.cyan)+text('2',ox-40,oy-140,28)+text(`${n} s`,ox+140*n-25,oy+45,27)+text(i?'2秒：面積は2倍':'1秒：面積は1倍',ox+25,470,30,i?C.purple:C.cyan);}).join('');
 if(kind==='impulse-area'||kind==='impulse-average'){
  const ox=190,oy=385,w=720,H=260,n=4+Math.floor(28*u);
  let out=graph(ox,oy,w+70,H+35)+path([[ox,oy],[ox+w/2,oy-H],[ox+w,oy]],C.cyan,4)+text('青：時間とともに変わる力',375,35,30,C.cyan);
  if(kind==='impulse-area')out+=Array.from({length:n},(_,i)=>{const q=(i+.5)/n,h=H*(1-Math.abs(2*q-1));return rect(ox+w*i/n,oy-h,w/n-1,h,C.gold);}).join('')+text(`時間を ${n} 個に分け、短い区間の力積を足す`,240,495,28,C.gold);
  else out+=rect(ox,oy-H/2,w*u,H/2,C.gold)+line(ox,oy-H/2,ox+w,oy-H/2,C.gold,3)+text('最大の力',825,90,28,C.cyan)+text('平均の力',970,oy-H/2+5,27,C.gold)+text('同じ時間幅、同じ面積になる長方形',315,495,29,C.gold);
  return out;
 }
 if(kind==='impulse-internal-pair'){
  return cart(490,265,C.cyan)+cart(600,265,C.purple)+`<rect x="360" y="125" width="410" height="230" rx="22" fill="none" stroke="${C.dim}" stroke-width="3" stroke-dasharray="8 8"/>`+arrow(490,185,490-105*u,185,C.red)+arrow(600,185,600+105*u,185,C.red)+text('押し合う瞬間の力を整理した図',295,45,30)+text('同じ大きさ・逆向きの力を、同じ時間受ける',235,415,29)+arrow(505,475,505-130*u,475,C.cyan)+arrow(650,475,650+130*u,475,C.purple)+text('力積',570,484,27)+text('二つをまとめる',805,230,28,C.dim);
 }
 if(kind==='momentum-two-carts'||kind==='momentum-stop-times'){
  const stopping=kind==='momentum-stop-times',t=stopping?4*time:2*time;
  return text(stopping?'同じ左向きの合力 3 N で止める':'二台とも、同じ右向き 3 m/s',265,35,32)+text(`経過時間 ${t.toFixed(1)} s`,830,95,29,C.gold)+[2,4].map((m,i)=>{const y=170+i*220,T=m,tt=stopping?Math.min(t,T):t,v=stopping?3-3/m*tt:3,x=170+65*(3*tt-(stopping?.5*3/m*tt*tt:0)),c=i?C.purple:C.cyan;return line(120,y+40,1080,y+40)+cart(x,y,c)+arrow(x,y-65,x+50*v,y-65,c)+(stopping&&t<T?arrow(x-55,y,x-140,y,C.red):'')+text(`${m} kg`,125,y+85,29,c)+text(stopping?`速度 ${v.toFixed(1)} m/s${t>=T?'：停止':''}`:'速度 3 m/s',705,y+85,29,c)+(stopping&&t>=T?text(`${T} s で停止`,380,y+85,29,C.gold):'');}).join('');
 }
 if(kind==='momentum-equal-impulses')return text('同じ向きの力を加える二つの場合',300,35,31)+[0,1].map(i=>{const ox=155+i*540,oy=365,n=i?2:1,h=i?105:210,c=i?C.purple:C.cyan;return graph(ox,oy,390,255)+rect(ox,oy-h,140*n*u,h,c)+text(i?'3 N':'6 N',ox+140*n+15,oy-h+15,28,c)+text(`${n} s`,ox+140*n-20,oy+45,27)+text('面積は同じ',ox+90,475,31,c);}).join('');
 if(kind==='momentum-mass-bars')return text('同じ右向き 3 m/s でも、運動量は違う',270,35,31)+[2,4].map((m,i)=>{const y=155+i*230,c=i?C.purple:C.cyan;return cart(280,y,c)+text(`質量 ${m} kg`,190,y+80,29,c)+arrow(280,y-60,430,y-60,c)+rect(630,y-30,90*m*u,60,c)+text(`運動量 ${3*m} kg m/s`,630,y+85,30,c);}).join('');
 throw Error(kind);
}
export function momentumFoundationFrame(c,s,t){return c.visualPilot==='momentum-foundations-v1'?authoredMotionFrame(c,s,t,momentumFoundationDiagram):null;}

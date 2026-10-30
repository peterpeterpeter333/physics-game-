import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const ease=p=>{p=clamp(p/.8);return p*p*(3-2*p);};
const ring=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${C.dim}" stroke-width="2"/>`;
const arc=(x,y,r,a,c=C.gold)=>path(Array.from({length:81},(_,i)=>[x+r*Math.cos(a*i/80),y-r*Math.sin(a*i/80)]),c,6);
const radius=(x,y,r,a,c=C.cyan)=>line(x,y,x+r*Math.cos(a),y-r*Math.sin(a),c,3);
export const radianFoundationKinds=['radian-arc','radian-ratio','radian-full-turn','radian-clock','radian-two-speeds'];
export function radianFoundationDiagram(kind,p){
 if(!radianFoundationKinds.includes(kind))throw Error('Unknown '+kind);const u=['radian-clock','radian-two-speeds'].includes(kind)?clamp(p/.8):ease(p);
 if(kind==='radian-arc'){
  const x=445,y=265,r=180,a=.5*u;
  return text('円周に沿う長さが「弧の長さ」',305,35,32)+ring(x,y,r)+radius(x,y,r,0)+radius(x,y,r,a)+arc(x,y,r,a)+circle(x+r*Math.cos(a),y-r*Math.sin(a),10,C.gold)+arc(x,y,65,a,C.purple)+text('半径 2 m',290,315,29,C.cyan)+text(`弧の長さ ${(2*a).toFixed(2)} m`,695,220,31,C.gold)+text(`角度 ${a.toFixed(2)} rad`,695,290,31,C.purple)+text('始点から円周に沿って、黄色の部分だけ進む',250,490,29);
 }
 if(kind==='radian-ratio'){
  const a=.7*u;
  return text('同じ角度：半径と弧の長さが、同じ割合で増える',160,35,31)+[1,2].map((k,i)=>{const x=280+560*i,y=280,r=85*k;return ring(x,y,r)+radius(x,y,r,0)+radius(x,y,r,a)+arc(x,y,r,a)+arc(x,y,40,a,C.purple)+text(`半径 ${k} m`,x-70,y+60,29,C.cyan)+text(`弧 ${(k*a).toFixed(2)} m`,x-80,490,29,C.gold);}).join('')+text('弧÷半径は同じ',470,270,27,C.purple);
 }
 if(kind==='radian-full-turn'){
  const x=420,y=270,r=175,a=2*Math.PI*u;
  return text('一周は円周の長さ。半周はその半分',260,35,31)+ring(x,y,r)+arc(x,y,r,a)+radius(x,y,r,a)+circle(x+r*Math.cos(a),y-r*Math.sin(a),10,C.gold)+text('円周：2πr',710,170,34,C.gold)+text('一周：2π rad',710,255,33,C.purple)+text('半周：π rad',710,340,33,C.cyan)+text('同じ角度を「度」と「ラジアン」で言い換える',245,490,29);
 }
 if(kind==='radian-clock'){
  const t=4*u,a=t*Math.PI/2,x=405,y=265,r=165;
  return text('一定の速さで、一周4秒。1秒ごとに四分の一周',160,35,31)+ring(x,y,r)+[0,1,2,3].map(i=>{const q=i*Math.PI/2;return circle(x+r*Math.cos(q),y-r*Math.sin(q),5,C.dim)+text(i===0?'0 / 4 s':`${i} s`,i===3?x+35:x+(r+35)*Math.cos(q)-20,i===3?y+r+25:y-(r+35)*Math.sin(q)+8,26);}).join('')+radius(x,y,r,a)+arc(x,y,r,a)+circle(x+r*Math.cos(a),y-r*Math.sin(a),11,C.gold)+text(`時間 ${t.toFixed(1)} s`,780,200,33,C.gold)+text(`角度 ${(a/Math.PI).toFixed(2)} π rad`,780,290,30,C.purple)+text('一周で増える角度を、4秒で割る',350,490,30);
 }
 if(kind==='radian-two-speeds'){
  const x=440,y=270,a=1.15*u;
  return text('同じ角速度：同じ時間に同じ角度だけ回る',230,35,31)+[100,200].map((r,i)=>{const X=x+r*Math.cos(a),Y=y-r*Math.sin(a),c=i?C.purple:C.cyan,L=i?100:50;return ring(x,y,r)+arc(x,y,r,a,c)+circle(X,Y,9,c)+arrow(X,Y,X-L*Math.sin(a),Y-L*Math.cos(a),c);}).join('')+radius(x,y,200,a,C.dim)+text('内側：半径1倍、速さ1倍',730,230,29,C.cyan)+text('外側：半径2倍、速さ2倍',730,310,29,C.purple)+text('矢印：進む速度。外側は、長い弧を同じ時間で進む',160,495,29);
 }
}
export function radianFoundationFrame(c,s,t){return c.visualPilot==='radian-foundations-v1'?authoredMotionFrame(c,s,t,radianFoundationDiagram):null;}

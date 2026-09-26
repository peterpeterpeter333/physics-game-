import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const ease=p=>{p=clamp(p/.8);return p*p*(3-2*p);};
export const sineMotionKinds=['sinemotion-cosine-slope','sinemotion-angle-clocks','sinemotion-center-acceleration','sinemotion-numeric-secant'];
export function sineMotionDiagram(kind,p){
 if(!sineMotionKinds.includes(kind))throw Error(kind);const u=['sinemotion-angle-clocks','sinemotion-center-acceleration'].includes(kind)?clamp(p/.8):ease(p);
 if(kind==='sinemotion-cosine-slope'){
  const X=t=>160+t*280,Y=v=>275-v*150,a=1.4*u,x=X(a),y=Y(Math.cos(a)),h=.3;
  return text('コサインの値の変化を、接線の傾きで見る',220,35,31)+line(140,275,1100,275)+line(160,100,160,455)+path(Array.from({length:81},(_,i)=>{const t=i*Math.PI/80;return[X(t),Y(Math.cos(t))];}),C.cyan,4)+line(X(a-h),Y(Math.cos(a)+Math.sin(a)*h),X(a+h),Y(Math.cos(a)-Math.sin(a)*h),C.gold,5)+circle(x,y,10,C.gold)+text('角度 θ [rad]',915,320,28)+text('cos θ',70,90,29,C.cyan)+text('0',135,310,26)+text('1',118,130,26)+text('−1',102,435,26)+text(`接線の傾き ${(-Math.sin(a)).toFixed(2)}`,650,110,29,C.gold)+text('角度0では水平。その後は右下がり',300,500,29);
 }
 if(kind==='sinemotion-angle-clocks'){
  return text('同じ1秒間で進む角度を比較する',310,35,31)+[1,2].map((w,i)=>{const x=325+i*540,y=270,r=135,a=w*u;return `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${C.dim}" stroke-width="2"/>`+line(x,y,x+r,y,C.dim)+arrow(x,y,x+r*Math.cos(a),y-r*Math.sin(a),i?C.purple:C.cyan)+path(Array.from({length:41},(_,j)=>{const v=a*j/40;return[x+45*Math.cos(v),y-45*Math.sin(v)];}),C.gold,3)+text(`ω = ${w} rad/s`,x-95,90,30,i?C.purple:C.cyan)+text(`角度 ${(w*u).toFixed(2)} rad`,x-120,455,29);}).join('')+text(`経過時間 ${u.toFixed(2)} s`,455,505,29,C.gold);
 }
 if(kind==='sinemotion-center-acceleration'){
  const a=.2+Math.PI*u,x=600+230*Math.cos(a),acc=-140*Math.cos(a),vel=-120*Math.sin(a);
  return text('中心を0、右向きをプラスにする',290,35,31)+line(170,300,1040,300)+line(600,120,600,425,C.dim,2,'6 6')+circle(x,300,24,C.gold)+arrow(x,215,x+acc,215,C.red)+arrow(x,375,x+vel,375,C.cyan)+text('加速度：中心へ',140,120,29,C.red)+text('速度：進む向き',740,120,29,C.cyan)+text('0',590,460,28)+text('−A',340,460,28)+text('+A',815,460,28)+text('矢印の長さは別の縮尺。速度と加速度の向きを比較',150,505,27);
 }
 if(kind==='sinemotion-numeric-secant'){
  const h=.5*(1-u)+.001*u,X=t=>180+t*1500,Y=v=>425-v*330,z=Math.sin(2*h);
  return text('原点と、少し先の点を結ぶ直線の傾き',235,35,31)+line(150,425,1100,425)+line(180,80,180,440)+path(Array.from({length:81},(_,i)=>{const t=i*.6/80;return[X(t),Y(Math.sin(2*t))];}),C.cyan,4)+line(X(0),Y(0),X(.53),Y(.53*z/h),C.gold,3)+line(X(h),Y(0),X(h),Y(z),C.purple,3)+circle(X(h),Y(z),9,C.purple)+text('時間 t [s]',920,475,29)+text('sin(2t)',45,85,29,C.cyan)+text('0',147,467,27)+text(`時間の幅 ${h.toFixed(3)} s`,580,80,29,C.purple)+text(`直線の傾き ${(z/h).toFixed(6)}`,580,125,29,C.gold)+text('時間の幅を小さくすると、傾きは2へ近づく',255,510,29);
 }
}
export function sineMotionFrame(c,s,t){return c.visualPilot==='sine-motion-v1'?authoredMotionFrame(c,s,t,sineMotionDiagram):null;}

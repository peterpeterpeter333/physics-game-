import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const ease=p=>{p=clamp(p/.75);return p*p*(3-2*p);};
export const projectileMiddleKinds=['launch-components','launch-angle','launch-return','launch-numbers'];
export function projectileMiddleDiagram(kind,p){
 if(!projectileMiddleKinds.includes(kind))throw Error('Unknown projectile middle '+kind);
 const u=ease(p);
 if(kind==='launch-return'){
  const T=12/9.8,t=T*u,X=q=>180+80*8*q,Y=q=>420-130*(6*q-4.9*q*q);
  return line(130,420,1110,420)+text('投げた高さ = 着地の高さ',320,480,31)+path(Array.from({length:81},(_,i)=>{const q=T*i/80;return[X(q),Y(q)];}),C.gold,4)+circle(X(t),Y(t),19,C.cyan)+text('y = 0',150,385,28)+text('y = 0',920,385,28)+text('縦が元の高さに戻るときの、横の位置を求める',165,45,29);
 }
 const ox=220,oy=440,w=480,h=360;
 let out=arrow(ox,oy,ox+w,oy-h,C.gold)+arrow(ox,oy,ox+w*u,oy,C.cyan)+arrow(ox+w,oy,ox+w,oy-h*u,C.purple);
 out+=text(kind==='launch-numbers'?'横の速度 8 m/s':'横の成分 v₀x',380,490,30,C.cyan)+text(kind==='launch-numbers'?'縦の速度 6 m/s':'縦の成分 v₀y',790,275,30,C.purple)+text(kind==='launch-numbers'?'初速 10 m/s':'初速 v₀',370,185,30,C.gold)+path([[680,440],[680,420],[700,420]],C.dim,2);
 if(kind==='launch-angle')out+=`<path d="M 310 440 A 90 90 0 0 0 292 386" fill="none" stroke="${C.ink}" stroke-width="3"/>`+text('θ',325,414,32)+text('θ（シータ）：水平から測る角度',210,45,30);
 else out+=text(kind==='launch-numbers'?'cos θ = 0.8 ／ sin θ = 0.6':'斜めの矢印を、横と縦につないだ矢印で表す',170,45,30);
 return out;
}
export function projectileMiddleFrame(c,s,t){return c.visualPilot==='projectile-middle-v1'?authoredMotionFrame(c,s,t,projectileMiddleDiagram):null;}

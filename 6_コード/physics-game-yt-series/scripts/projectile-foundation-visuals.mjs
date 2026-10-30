import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const ease=p=>{p=clamp(p/.8);return p*p*(3-2*p);};
const point=t=>[210+320*t,80+80*t*t];
const route=p=>path(Array.from({length:61},(_,i)=>point(2*p*i/60)),C.gold,3);
export const projectileFoundationKinds=['projectile-whole','projectile-horizontal','projectile-vertical','projectile-dots','projectile-projections','projectile-launch','projectile-force','projectile-twins','projectile-landing'];
export function projectileFoundationDiagram(kind,p){
 if(!projectileFoundationKinds.includes(kind))throw Error('Unknown projectile diagram '+kind);
 const u=ease(p),t=2*u,[x,y]=point(t);
 if(kind==='projectile-launch')return arrow(250,350,250+570*Math.min(1,2*u),350,C.cyan)+arrow(820,350,820,350-240*Math.max(0,2*u-1),C.purple)+`<g opacity="${u}">${arrow(250,350,820,110,C.gold)}</g>`+text('横の初速度',430,405,30,C.cyan)+text('縦の初速度',875,245,30,C.purple)+text('斜めの初速度を、二つの方向へ分ける',205,55,31);
 if(kind==='projectile-force')return line(180,370,1050,370)+arrow(240,370,240,60,C.dim)+text('右：x の正方向',830,420,28)+text('上：y の正方向',140,35,28)+circle(610,180,20,C.gold)+arrow(610,180,610,315,C.red)+text('重力は下向きだけ',675,245,31,C.red)+text('横向きの力はゼロ',420,485,29);
 if(kind==='projectile-twins'||kind==='projectile-landing'){
  const yy=95+315*u*u,xx=450+500*u;
  return text('同じ高さ・同時に離す・最初の縦の速度は0',100,35,30)+line(100,430,1100,430)+line(160,yy,1030,yy,C.dim,2)+circle(200,yy,18,C.cyan)+circle(xx,yy,18,C.gold)+text('そっと離す',110,485,27,C.cyan)+text('横に投げる',790,485,27,C.gold)+text('二つの球の高さは、いつも同じ',330,70,26);
 }
 let out=route(u)+circle(x,y,18,C.gold)+text(`共通の時計 ${t.toFixed(1)} s`,770,35,28)+text('横方向の速度は一定 ／ 縦方向は下へ加速',190,505,28);
 if(kind==='projectile-whole')out+=arrow(x+35,y,x+35,y+75,C.red)+text('赤：重力',180,35,29,C.red);
 if(kind==='projectile-horizontal'){
  out+=arrow(x,y,x+110,y,C.cyan)+text('青：横方向の速度（長さ一定）',155,35,29,C.cyan);
  out+=[0,.5,1,1.5,2].map(q=>circle(...point(q),6,C.dim)+line(point(q)[0],445,point(q)[0],465,C.cyan)).join('');
 }else if(kind==='projectile-vertical'){
  out+=arrow(x,y,x,y+65*u,C.purple)+text('紫：縦方向の速度（だんだん増える）',100,35,29,C.purple);
  out+=[0,.5,1,1.5,2].map(q=>circle(115,point(q)[1],6,C.purple)+line(125,point(q)[1],155,point(q)[1],C.purple)).join('');
 }else if(kind==='projectile-dots')out+=[0,.5,1,1.5,2].map(q=>circle(...point(q),9,C.cyan)+text(q+' s',point(q)[0]-20,point(q)[1]+40,23)).join('');
 else if(kind==='projectile-projections')out+=line(150,80,1080,80)+line(210,40,210,450)+line(x,80,x,y,C.cyan,2)+line(210,y,x,y,C.purple,2)+circle(x,80,10,C.cyan)+circle(210,y,10,C.purple)+text('横の位置',x-65,65,26,C.cyan)+text('縦の位置',45,y+10,26,C.purple);
 return out;
}
export function projectileFoundationFrame(c,s,t){return c.visualPilot==='projectile-foundations-v1'?authoredMotionFrame(c,s,t,projectileFoundationDiagram):null;}

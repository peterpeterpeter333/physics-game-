import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const ease=p=>{p=clamp(p/.75);return p*p*(3-2*p);};
const arc=(x,y,r,a,p=1)=>path(Array.from({length:31},(_,i)=>{const q=a*p*i/30;return[x+r*Math.cos(q),y-r*Math.sin(q)];}),C.gold,3);
const cart=(x,y)=>`<rect x="${x-55}" y="${y-38}" width="110" height="60" rx="8" fill="${C.cyan}" fill-opacity=".3" stroke="${C.cyan}" stroke-width="3"/>`+circle(x-35,y+32,13,C.dim)+circle(x+35,y+32,13,C.dim);
const tri=(x,y,s,u,labels=true)=>arrow(x,y,x+4*s*u,y-3*s*u,C.cyan)+arrow(x,y,x+4*s*u,y,C.gold)+arrow(x+4*s,y,x+4*s,y-3*s*u,C.purple)+line(x+4*s-18,y,x+4*s-18,y-18)+line(x+4*s-18,y-18,x+4*s,y-18)+(labels?text('4',x+2*s,y+40,31,C.gold)+text('3',x+4*s+24,y-1.5*s,31,C.purple)+text('5',x+2*s-30,y-1.5*s-20,32,C.cyan):'');
export const workComponentKinds=['component-unit-triangle','component-triangle','component-similarity','component-velocity','component-projectile','component-same-time','pull-components','pull-horizontal','work-angle-sign','work-friction','work-sixty','work-vertical-balance','work-cos-sixty'];
export function workComponentDiagram(kind,p){
 if(!workComponentKinds.includes(kind))throw Error('Unknown work-component diagram '+kind);
 const u=ease(p);
 if(kind==='component-unit-triangle')return tri(260,360,80,u)+arc(260,360,65,Math.atan2(3,4))+text('θ',345,337,32,C.gold)+text('横と斜めの比：4/5',755,170,30,C.gold)+text('縦と斜めの比：3/5',755,255,30,C.purple)+text('二つの比は、同じ直角三角形から求めている',240,470,29);
 if(kind==='component-triangle')return tri(300,385,90,u)+text('横へ進んでから縦へ進んでも、同じ点へ届く',230,65,30)+text('青：斜めの移動　黄：横の移動　紫：縦の移動',250,485,27);
 if(kind==='component-similarity'){
  const s=55*(1+u),x=330,y=410;
  return tri(x,y,s,1,false)+arc(x,y,65,Math.atan2(3,4))+text('θ',x+80,y-25,32,C.gold)+text(`横 ${(4*s/55).toFixed(1)}`,x+s*2,y+50,28,C.gold)+text(`縦 ${(3*s/55).toFixed(1)}`,x+s*4+20,y-s*1.5,28,C.purple)+text(`斜め ${(5*s/55).toFixed(1)}`,x+s*1.8-80,y-s*1.5-25,28,C.cyan)+text('同じ角度で拡大 → 辺の比は変わらない',255,55,30);
 }
 if(kind==='component-velocity')return tri(250,375,100,u,false)+text('速度を表す矢印（物体の軌跡ではない）',245,45,30)+text('横の速度 8 m/s',370,440,31,C.gold)+text('縦の速度 6 m/s',700,210,30,C.purple)+text('速さ 10 m/s',290,200,31,C.cyan)+text('横→縦の矢印と、元の速度の矢印は同じ終点',250,500,27);
 if(kind==='component-projectile'||kind==='component-same-time'){
  const t=1.2*u,x=150+650*t/1.2,y=360-65*(6*t-4.9*t*t);
  let out=line(110,360,1030,360)+line(110,400,1030,400,C.dim,2)+path(Array.from({length:81},(_,i)=>{const q=t*i/80;return[150+650*q/1.2,360-65*(6*q-4.9*q*q)];}),C.cyan,3)+circle(x,y,13,C.cyan)+text(`同じ時刻 ${(t).toFixed(2)} s`,750,65,32,C.gold)+text('空気抵抗なし。右向きが正、上向きが正',205,500,28);
  if(kind==='component-projectile')out+=arrow(x,y,x+95,y,C.gold)+arrow(x,y,x,y-(6-9.8*t)*17,C.purple)+text('黄：横の速度は一定',175,55,28,C.gold)+text('紫：縦の速度は変化',175,105,28,C.purple);
  else out+=`<path d="M ${x} 400 V ${y} H 110" fill="none" stroke="${C.dim}" stroke-width="2" stroke-dasharray="7 7"/>`+circle(x,400,10,C.gold)+circle(110,y,10,C.purple)+text('横の位置',750,450,28,C.gold)+text('縦の位置',115,55,28,C.purple);
  return out;
 }
 if(kind==='work-angle-sign'){
  const a=Math.PI/2*(clamp((p-.15)/.2)+clamp((p-.6)/.2)),x=560,y=230,L=160,fx=Math.cos(a)*L;
  return circle(x,y,14,C.ink)+arrow(x,y,x+L*Math.cos(a),y-L*Math.sin(a),C.red)+arrow(x,y+90,x+fx,y+90,C.gold)+arrow(390,430,800,430,C.cyan)+arc(x,y,65,a)+text(`力と移動の角度 ${Math.round(a*180/Math.PI)}°`,375,55,31)+text('青：移動は右向き',425,490,30,C.cyan)+text('赤：力',860,160,29,C.red)+text('黄：移動方向の成分',805,335,27,C.gold)+text(fx>1e-6?'仕事は正':fx< -1e-6?'仕事は負':'仕事はゼロ',105,270,34,C.gold);
 }
 if(kind==='pull-horizontal'){
  const x=300+350*u,y=295;
  return line(140,340,1070,340)+cart(x,y)+arrow(x,y-65,x+130,y-65,C.gold)+arrow(x+5,y-70,x+5,y-190,C.purple)+arrow(300,440,x,440,C.cyan)+text('力の成分を、移動と比べる',365,45,31)+text('縦の移動は0',800,125,29,C.purple)+text('横の移動はある',800,195,29,C.gold)+text('横の成分だけが仕事に関わる',315,505,30);
 }
 if(kind==='work-vertical-balance'){
  const x=550,y=285;
  return line(100,330,1100,330)+cart(x,y)+arrow(x-80,y,x-80,y-70*u,C.gold)+arrow(x+85,y,x+85,y-55*u,C.cyan)+arrow(x,y+55,x,y+55+125*u,C.red)+text('引く力の縦成分',135,95,28,C.gold)+text('床からの力',720,145,28,C.cyan)+text('重力',630,455,31,C.red)+text('上向き二つの合計と、下向きの重力がつり合う',180,510,27)+text('縦の移動：0',735,245,30);
 }
 if(kind==='work-cos-sixty'){
  const x=320,y=380,L=360,top=[x+L/2,y-L*Math.sqrt(3)/2];
  return path([[x,y],top,[x+L,y],[x,y]],C.cyan,3)+line(...top,top[0],y,C.gold,3)+arc(x,y,62,Math.PI/3,u)+text('60°',x+75,y-28,29,C.gold)+text('正三角形を、半分に分ける',335,470,31)+text('斜め：1',x+25,y-190,31,C.cyan)+text('横：1/2',x+25,y+40,31,C.gold)+circle(top[0],y,8,C.gold)+text('横は斜めの半分',805,210,30,C.gold);
 }
 const sixty=kind==='work-sixty',x=260+340*u,y=325,a=sixty?Math.PI/3:Math.PI/5,L=190;
 let out=line(120,370,1120,370)+cart(x,y)+arrow(x,y-50,x+L*Math.cos(a),y-50-L*Math.sin(a),C.red)+text(sixty?'赤：引く力 10 N':'赤：斜め上へ引く力',640,55,31,C.red)+arrow(260,445,x,445,C.cyan)+text(sixty?`水平の移動 ${(2*u).toFixed(1)} m`:'青：台車の移動は水平',360,500,30,C.cyan);
 if(kind==='work-friction')out+=arrow(x-60,y-15,x-150,y-15,C.purple)+text('紫：摩擦は移動と逆向き',670,255,28,C.purple)+text('正の仕事と、負の仕事を合計する',330,115,29);
 else {
  const hx=x+L*Math.cos(a),hy=y-50-L*Math.sin(a);
  out+=arrow(x,y-50,hx,y-50,C.gold)+arrow(hx,y-50,hx,hy,C.purple)+arc(x,y-50,55,a)+text(sixty?'60°':'θ',x+65,y-63,27,C.gold)+text('黄：横の成分',760,210,29,C.gold)+text('紫：縦の成分',760,285,29,C.purple);
  if(kind==='pull-horizontal')out+=text('縦の移動がない → 縦の成分の仕事は0',270,105,30);
 }
 return out;
}
export function workComponentFrame(c,s,t){return c.visualPilot==='work-components-v1'?authoredMotionFrame(c,s,t,workComponentDiagram):null;}

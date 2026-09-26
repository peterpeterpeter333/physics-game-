import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const ease=p=>{p=clamp(p/.8);return p*p*(3-2*p);};
const ring=(x,y,r,c=C.dim)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${c}" stroke-width="2"/>`;
const bar=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" opacity=".65"/>`;
function flight(kind,p){
 const u=ease(p),t=kind==='fall-apex'||kind==='fall-acceleration'?2:kind==='fall-rise'||kind==='fall-clock'||kind==='fall-energy'||kind==='fall-height'?2*u:kind==='fall-descend'?2+2*u:kind==='fall-initial'||kind==='fall-sign'?0:4*u;
 const height=19.6*t-4.9*t*t,Y=380-height/19.6*270,v=19.6-9.8*t,X=430;
 let out=line(120,400,580,400)+text('投げた位置',140,455,27)+line(X,380,X,110,C.dim,2)+circle(X,Y,24,C.gold)+arrow(120,350,120,120,C.dim)+text('上向きを正',45,85,28);
 if(kind==='fall-energy'){
  const f=height/19.6;
  return out+bar(730,400-240*(1-f),120,240*(1-f),C.cyan)+bar(960,400-240*f,120,240*f,C.purple)+text('運動',735,460,27,C.cyan)+text('位置',965,460,27,C.purple)+text('エネルギーの合計は一定',650,65,29)+text('高さの基準：投げた位置',690,505,26);
 }
 if(Math.abs(v)>.05)out+=arrow(X,Y,X,Y-v*3.5,C.cyan);
 else out+=text('速度 0',X+35,Y-15,30,C.cyan);
 out+=arrow(X+80,Y,X+80,Y+65,C.red)+text(kind==='fall-acceleration'||kind==='fall-sign'?'赤：加速度（下向き）':'赤：重力（下向き）',695,230,29,C.red);
 out+=text('青：速度',695,145,29,C.cyan);
 if(kind==='fall-initial')out+=text('初速度 19.6 m/s',650,70,30,C.cyan);
 if(kind==='fall-sign')out+=text('g = 9.8 m/s² ／ a = −g',650,70,30,C.red);
 if(kind==='fall-clock')out+=text(`経過時間 ${t.toFixed(1)} s`,680,330,32,C.gold);
 if(kind==='fall-height')out+=arrow(300,380,300,110,C.purple)+text('高さの変化 Δy',650,330,30,C.purple);
 return out+text('地表近く・空気抵抗なし',680,370,24,C.dim)+text('矢印の長さは比較用',680,410,24,C.dim);
}
function gravity(kind,p){
 const u=ease(p);
 if(kind==='gravity-compare')return [false,true].map((real,i)=>{const x=330+580*i,y=real?150+240*u*u:150;return circle(x,y,20,C.gold)+(real?arrow(x+50,y,x+50,y+45,C.red):'')+text(real?'実際：重力が残る':'仮定：この先ずっと力がゼロ',100+550*i,65,28)+text(real?'速度が下向きに変わる':'速度ゼロのまま',150+550*i,490,28,real?C.red:C.cyan);}).join('');
 if(kind==='gravity-apex')return flight('fall-apex',p);
 const bx=330,by=kind==='gravity-scale'?125-10*u:110;
 return circle(330,325,155,'#213d66')+circle(330,325,6,C.ink)+text('地球',290,380,33)+circle(bx,by,17,C.gold)+line(330,325,bx,by,C.gold,3)+text('中心から球までの距離',545,190,30,C.gold)+text('球の質量と、この距離で重力が決まる',545,270,26)+text(kind==='gravity-scale'?'短い投げ上げでは、この距離はほぼ同じ':'最高点で急に質量・距離が変わるわけではない',110,45,28)+text('説明のため、球と高度を大きく描いています',145,505,25,C.dim);
}
function comparison(kind,p){
 const u=ease(p),h=300*(2*u-u*u);
 if(kind==='fall-masses')return [0,1].map(i=>{const x=350+500*i;return line(x-140,430,x+160,430)+circle(x,420-h,i?28:16,C.gold)+text(i?'重い球':'軽い球',x-70,485,28)+line(x-140,120,x+160,120,C.dim,2);}).join('')+text('同じ初速度・空気抵抗なし → 同じ最高点',165,55,31);
 const Y=420-h*.72;
 return line(150,435,1080,435)+circle(450,Y,20,C.gold)+arrow(490,Y,490,Y+90,C.red)+arrow(540,Y,540,Y+50,C.purple)+text('上がっている球',680,100,31)+text('赤：重力',680,190,29,C.red)+text('紫：空気抵抗',680,260,29,C.purple)+text('どちらの力も、上向きの運動を妨げる',215,500,29);
}
export const freefallKinds=['apex-signs','apex-continuous','apex-crossing','apex-turn','fall-overview','fall-rise','fall-apex','fall-descend','fall-acceleration','fall-clock','gravity-earth','gravity-scale','gravity-apex','gravity-compare','fall-initial','fall-sign','fall-height','fall-energy','fall-masses','fall-resistance'];
export function freefallDiagram(kind,p){
 if(!freefallKinds.includes(kind))throw Error('Unknown freefall diagram '+kind);
 if(kind==='apex-signs')return [1,-1].map((sign,i)=>{const x=330+i*540,y=270-sign*80*ease(p);return circle(x,y,20,C.gold)+arrow(x+60,y,x+60,y-sign*100,C.cyan)+text(i?'下がる球：速度は負':'上がる球：速度は正',x-160,490,29,C.cyan);}).join('')+text('上向きを正にする',430,55,31);
 if(kind==='apex-turn'){
  const t=1.5+ease(p),y=100+200*(t-2)**2;
  return circle(570,y,22,C.gold)+(Math.abs(t-2)>.03?arrow(650,y,650,y+(t-2)*130,C.cyan):'')+line(320,100,840,100,C.dim,2)+text('最高点',200,110,29)+text(t<1.98?'上り':t>2.02?'下り':'速度ゼロ',800,230,30,C.cyan)+text('球は最高点の前後で、進む向きを変える',220,450,30);
 }
 if(kind==='apex-continuous'||kind==='apex-crossing'){
  const u=ease(p),t=kind==='apex-crossing'?1.5+u:4*u,x=190+190*t,y=110+85*t;
  return line(140,280,1080,280)+line(190,460,190,55)+text('速度',105,50,28)+text('時間',1010,325,28)+text('0',150,289,27)+text('正',145,120,27,C.cyan)+text('負',145,445,27,C.purple)+path([[190,110],[950,450]],C.cyan,4)+(kind==='apex-crossing'?ring(570,280,22,C.gold)+text('この交点で速度が0',605,240,27,C.gold):'')+circle(x,y,13,C.gold)+text('正から負へ変わる途中で、ゼロを通る',230,505,29);
 }
 if(kind.startsWith('gravity-'))return gravity(kind,p);
 if(['fall-masses','fall-resistance'].includes(kind))return comparison(kind,p);
 return flight(kind,p);
}
export function freefallFrame(c,s,t){return c.visualPilot==='freefall-v1'?authoredMotionFrame(c,s,t,freefallDiagram):null;}

import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const ease=p=>{p=clamp(p/.85);return p*p*(3-2*p);};
const rect=(x,y,w,h,c,a=.5)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" fill-opacity="${a}"/>`;
const cart=(x,y,c)=>rect(x-50,y-30,100,45,c)+circle(x-32,y+22,12,C.dim)+circle(x+32,y+22,12,C.dim);
export const momentumAdvancedKinds=['collision-boundary','collision-exchange','collision-shared-speed','collision-energy-transfer','collision-work-distance','collision-numbers','collision-energy-numbers'];
export function momentumAdvancedDiagram(kind,p){
 if(!momentumAdvancedKinds.includes(kind))throw Error('Unknown '+kind);
 // Physical motion uses uniform time; only explanatory marks ease in.
 const u=['collision-boundary','collision-shared-speed'].includes(kind)?clamp(p/.85):ease(p);
 if(kind==='collision-boundary')return text('対象は二台。外からの水平方向の力積は無視する',155,40,31)+`<rect x="145" y="135" width="905" height="260" rx="30" fill="none" stroke="${C.gold}" stroke-dasharray="12 8" stroke-width="3"/>`+line(100,335,1100,335)+cart(300+150*u,300,C.cyan)+cart(650,300,C.purple)+arrow(300+150*u,225,420+150*u,225,C.cyan)+text('動く台車',270,455,30,C.cyan)+text('止まった台車',650,455,30,C.purple);
 if(kind==='collision-exchange')return text('押し合う間、二台は運動量を受け渡す',265,35,31)+cart(495,220,C.cyan)+cart(595,220,C.purple)+arrow(495,145,495-140*u,145,C.red)+arrow(595,145,595+140*u,145,C.red)+text('台車1：減る',190,330,31,C.cyan)+text('台車2：同じだけ増える',670,330,31,C.purple)+rect(190,370,390-130*u,45,C.cyan)+rect(670,370,130*u,45,C.purple)+text('力は逆向きで同じ大きさ。押し合う時間も同じ',200,485,30);
 if(kind==='collision-shared-speed')return text('くっついた二台は、共通の速度 V で進む',240,35,32)+line(110,340,1100,340)+cart(290+360*u,305,C.cyan)+cart(390+360*u,305,C.purple)+arrow(290+360*u,205,420+360*u,205,C.cyan)+arrow(390+360*u,125,520+360*u,125,C.purple)+text('同じ長さの速度の矢印',350,445,31)+text('質量の合計：m₁ + m₂',375,495,29,C.gold);
 if(kind==='collision-numbers'){
  const t=3.2*clamp(p/.85),before=t<1.6;
  // 50 pixels per metre: 3 m/s before contact, 2 m/s after contact.
  const x=before?240+150*t:480+100*(t-1.6),z=before?580:580+100*(t-1.6);
  return text('衝突前：2 kgが3 m/s、1 kgは静止',250,35,31)+line(100,325,1100,325)+cart(x,290,C.cyan)+cart(z,290,C.purple)+arrow(x,185,x+(before?150:100),185,C.cyan)+(before?'':arrow(z,125,z+100,125,C.purple))+text('2 kg',x-30,390,29,C.cyan)+text('1 kg',z-30,440,29,C.purple)+text(before?'右向きを正として、二台の運動量を足す':'衝突後：二台がくっついて2 m/s',230,495,30,C.gold);
 }
 if(kind==='collision-energy-transfer'||kind==='collision-energy-numbers'){
  const num=kind==='collision-energy-numbers',x=210,y=245,w=720,moved=w/3*u;
  return text(num?'全体9 Jのうち、運動は6 J、別の形が3 J':'運動エネルギーの一部が、別の形へ移る',215,35,31)+text('衝突前',100,160,29)+rect(x,120,w,60,C.cyan)+text(num?'運動 9 J':'運動エネルギー',450,161,30,C.cyan)+text('衝突後',100,290,29)+rect(x,y,w-moved,60,C.cyan)+rect(x+w-moved,y,moved,60,C.gold)+text(num?'運動 6 J':'運動',310,360,30,C.cyan)+text(num?'3 J':'別の形',875,360,29,C.gold)+text('熱・音・変形に関係するエネルギー',495,420,30,C.gold)+text('エネルギーが消えたわけではない',325,490,31);
 }
 if(kind==='collision-work-distance'){
  return text('重心の移動を上下に分けて比較（接触の形は省略）',115,35,29)+[0,1].map(i=>{const start=350,x=start+(i?60:180)*u,y=150+190*i,c=i?C.purple:C.cyan;return line(start,y+48,x,y+48,c,5)+cart(x,y,c)+arrow(x,y-60,x+(i?110:-110),y-60,C.red)+text(i?'押される台車':'押す台車',90,y+10,29,c)+text(i?'右向きの力・右向きの移動':'左向きの力・右向きの移動',670,y+10,28,c);}).join('')+text('赤：力　下の線：移動距離。距離は同じとは限らない',150,435,28)+text('力積は相殺しても、力の仕事は相殺するとは限らない',130,495,30);
 }
}
export function momentumAdvancedFrame(c,s,t){return c.visualPilot==='momentum-advanced-v1'?authoredMotionFrame(c,s,t,momentumAdvancedDiagram):null;}

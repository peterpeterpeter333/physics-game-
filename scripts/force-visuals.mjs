import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const ease=p=>{p=clamp(p/.75);return p*p*(3-2*p);};
const cart=(x,y,color=C.cyan,label='')=>`<rect x="${x-62}" y="${y-40}" width="124" height="65" rx="12" fill="${color}" fill-opacity=".22" stroke="${color}" stroke-width="3"/>`+circle(x-40,y+30,13,C.dim)+circle(x+40,y+30,13,C.dim)+text(label,x-35,y+3,30,color);
const border=(x,y,w,h,color=C.gold)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" fill="none" stroke="${color}" stroke-width="3" stroke-dasharray="12 8"/>`;
export const forceDiagramKinds=['force-arrows','force-lengths','force-head-tail','mass-response','mass-versus-weight','inertia-cart','inertia-balanced','rest-and-uniform','force-changes-velocity','choose-cart','choose-hand','net-force-example','same-acceleration-opposite-velocities','initial-conditions','balance-box','box-floor-pair','box-earth-pair','system-boundary','two-carts-push','force-recipients','both-accelerate','system-boundary-advanced','isolate-b','isolate-a'];
export function forceDiagram(kind,p){
 if(!forceDiagramKinds.includes(kind))throw Error('Unknown force diagram '+kind);
 const u=ease(p),t=2*u;
 if(['force-arrows','force-lengths','net-force-example'].includes(kind)){
  const scale=kind==='force-lengths'?1:u,x=570,y=275;
  return cart(x,y,C.cyan,kind==='net-force-example'?'2 kg':'台車')+line(150,320,1070,320)+arrow(x,y-90,x+250*scale,y-90,C.red)+arrow(x-62,y,x-62-100*scale,y,C.purple)+text('右向き 5 N',735,155,31,C.red)+text('左向き 2 N',250,245,31,C.purple)+text('力の矢印：同じ大きさなら同じ長さ',245,55,30)+text('右をプラスとする →',710,440,29,C.dim)+(kind==='force-lengths'?[0,1,2,3,4].map(i=>circle(585+50*i,185,5,C.ink,.2+.8*clamp(u*5-i))).join(''):'');
 }
 if(kind==='force-head-tail'){
  const a=clamp(u*2),b=clamp(u*2-1),x=245,end=720;
  const guide=(x,y1,y2)=>`<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="${C.dim}" stroke-width="2" stroke-dasharray="5 7"/>`;
  return text('同じ台車の力を、矢印の先へつなぐ',220,35,31)+text('上下の段は表示の都合。点線は横位置を比べる目印',230,76,24,C.dim)+arrow(x,165,x+475*a,165,C.red)+arrow(end,260,end-190*b,260,C.purple)+guide(end,165,260)+text('右へ 5 N',390,136,29,C.red)+text('左へ 2 N',750,255,29,C.purple)+arrow(x,380,x+285*u,380,C.gold)+guide(x,165,380)+guide(530,260,380)+text('最初の根元から最後の先端へ：右へ 3 N',265,455,29,C.gold);
 }
 if(kind==='mass-response')return text('同じ合力 3 N を、静止した二台に加える',100,40,28)+[1,2].map((m,i)=>{const y=150+i*220,a=3/m,x=190+.5*a*t*t*110;return line(110,y+45,1100,y+45)+cart(x,y,i?C.purple:C.cyan,`${m} kg`)+arrow(x,y-65,x+90,y-65,C.red)+text(`速度 ${(a*t).toFixed(1)} m/s`,600,y+100,29,i?C.purple:C.cyan);}).join('')+text(`共通の時間 ${t.toFixed(1)} s`,830,45,27);
 if(['mass-versus-weight','balance-box','box-floor-pair','box-earth-pair'].includes(kind)){
  const x=420,y=230;
  let out=`<rect x="340" y="150" width="160" height="110" rx="8" fill="${C.cyan}" fill-opacity=".2" stroke="${C.cyan}" stroke-width="3"/>`+text('箱',390,220,35,C.cyan);
  if(kind==='box-earth-pair')return out+circle(x,410,65,C.purple,.35)+text('地球',385,420,30,C.purple)+arrow(480,260,480,260+75*u,C.red)+arrow(355,350,355,350-75*u,C.gold)+text('地球 → 箱：下へ引く',660,170,30,C.red)+text('箱 → 地球：上へ引く',660,270,30,C.gold)+text('矢印は同じ力の大きさを表す',625,390,27,C.dim)+text('物体の大きさ・距離は模式図',625,450,25,C.dim);
  out+=line(200,270,1020,270,C.dim,9);
  if(kind==='box-floor-pair')return out+arrow(420,230,420,230-110*u,C.gold)+arrow(540,275,540,275+110*u,C.purple)+text('床 → 箱：上へ押す',655,160,31,C.gold)+text('箱 → 床：下へ押す',655,365,31,C.purple)+text('二つの力の受け手が違う',290,465,32);
  out+=arrow(385,215,385,215-110*u,C.gold)+arrow(465,215,465,215+110*u,C.red)+text('床から箱へ：上向き',645,140,30,C.gold)+text('地球から箱へ：下向き',645,325,30,C.red);
  return out+text(kind==='balance-box'?'二つとも箱が受ける力。箱の加速度はゼロ':'質量の単位は kg ／ 重力の単位は N',200,455,30);
 }
 if(['inertia-cart','inertia-balanced','force-changes-velocity'].includes(kind)){
  const changing=kind==='force-changes-velocity',x=190+(changing?180*u+350*u*u:660*u),y=280,v=changing?2+3*u:4;
  let out=line(100,325,1110,325)+cart(x,y,C.cyan,'台車')+arrow(x,y-105,x+v*26,y-105,C.cyan)+text('青：速度',120,55,31,C.cyan)+text(changing?'赤：右向きの合力':'横方向の力はゼロ。摩擦なし',640,55,29,changing?C.red:C.dim);
  if(changing)out+=arrow(x,365,x+110,365,C.red)+text('速度の矢印が長くなる',360,460,31);
  else if(kind==='inertia-balanced')out+=arrow(x-30,y,x-30,y-85,C.gold)+arrow(x+35,y,x+35,y+85,C.red)+text('上下の力はつり合い、合力もゼロ',320,465,31);
  else out+=[0,1,2,3,4].map(i=>line(190+i*165,330,190+i*165,347,C.dim,2)).join('')+text('同じ時間ごとに、同じ距離だけ進む',315,445,31);
  return out;
 }
 if(kind==='rest-and-uniform')return [0,1].map(i=>{const y=160+i*220,x=240+(i?620*u:0);return line(120,y+45,1110,y+45)+cart(x,y,i?C.cyan:C.dim)+text(i?'一定の速度で進む':'止まり続ける',170,y-90,30)+text('加速度 0',900,y-75,29,C.gold)+(i?arrow(x,y-55,x+90,y-55,C.cyan):'');}).join('');
 if(['choose-cart','choose-hand'].includes(kind)){
  const box=kind==='choose-cart';
  return cart(700,280,C.cyan,'台車')+`<rect x="255" y="225" width="140" height="85" rx="30" fill="${C.purple}" fill-opacity=".25"/>`+text('手',300,280,32,C.purple)+line(390,267,635,267,C.dim,4)+border(box?590:225,155,box?280:260,260)+arrow(box?700:325,355,(box?700:325)+(box?140:-140)*u,355,box?C.red:C.purple)+text(box?'手 → 台車：台車が受ける力':'台車 → 手：手が受ける力',245,75,34,box?C.red:C.purple)+text('点線の内側の物体だけを調べる',330,480,29,C.gold);
 }
 if(['same-acceleration-opposite-velocities','initial-conditions'].includes(kind)){
  return text('赤：同じ右向きの合力 ／ 青・紫：速度',205,45,30)+[0,1].map(i=>{const y=160+i*225,v0=kind==='initial-conditions'?(i?2:0):(i?-4:4),x0=kind==='initial-conditions'?220+i*170:(i?820:160),v=v0+1.5*t,x=x0+65*(v0*t+.75*t*t);return line(100,y+45,1120,y+45)+cart(x,y,i?C.purple:C.cyan)+arrow(x,y-55,x+v*23,y-55,i?C.purple:C.cyan)+arrow(1010,y+4,1100,y+4,C.red)+text(`最初 ${v0} m/s → 今 ${v.toFixed(1)} m/s`,130,y+100,28,i?C.purple:C.cyan);}).join('');
 }
 // This is a free-body diagram of the contact instant, not two separated
 // bodies mysteriously pushing at a distance. Space is added for readability.
 const xa=430,xb=740,y=270;
 let out=line(100,325,1110,325)+cart(xa,y,C.cyan,'A')+cart(xb,y,C.purple,'B');
 const showA=kind!=='isolate-b',showB=kind!=='isolate-a';
 if(showA)out+=arrow(xa,y-95,xa-120*u,y-95,C.red);
 if(showB)out+=arrow(xb,y-95,xb+120*u,y-95,C.gold);
 if(kind==='force-recipients')out+=`<g opacity="${1-u}">${border(335,210,190,135,C.cyan)}</g><g opacity="${u}">${border(645,210,190,135,C.purple)}</g>`;
 if(kind==='isolate-a'||kind==='isolate-b')out+=border(kind==='isolate-a'?300:610,110,260,260)+text(kind==='isolate-a'?'Aだけ：B → A の力を受ける':'Bだけ：A → B の力を受ける',290,60,34,C.gold);
 else if(['system-boundary','system-boundary-advanced'].includes(kind)){
  const width=260+360*u;out+=border(300,100,width,280)+text(u<.05?'Aだけを囲む':u<.98?'囲みをBまで広げる':'AとBの両方を囲む',420,55,34,C.gold)+text('内側・外側は、選んだ囲みで決まる',300,470,31);
  if(kind==='system-boundary-advanced')out+=arrow(125,270,365,270,C.cyan)+text('外からの力',110,225,25,C.cyan);
 }else out+=text('赤：B → A の力',180,65,30,C.red)+text('黄：A → B の力',715,65,30,C.gold)+text(kind==='both-accelerate'?'合計がゼロでも、各台車は加速する':'同じ大きさ・逆向き。ただし受け手が違う',245,465,31);
 out+=text('押し合う瞬間の力の図：二台を離して描いています',230,420,24,C.dim);
 if(kind==='both-accelerate')out+=arrow(xa,365,xa-70*u,365,C.cyan)+arrow(xb,365,xb+70*u,365,C.purple)+text('加速度',515,372,23,C.ink);
 return out;
}
export function forceFrame(c,s,t){return c.visualPilot==='force-storyboards-v1'?authoredMotionFrame(c,s,t,forceDiagram):null;}

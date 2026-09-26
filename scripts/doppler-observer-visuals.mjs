import {C,text,line,circle,arrow,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const person=(x,y)=>circle(x,y,14,C.gold)+line(x,y+15,x,y+60,C.gold,5)+line(x,y+30,x-25,y+50,C.gold,4)+line(x,y+30,x+25,y+50,C.gold,4);
const bracket=(a,b,y,label,c=C.cyan)=>line(a,y,b,y,c,3)+line(a,y-7,a,y+7,c,3)+line(b,y-7,b,y+7,c,3)+text(label,(a+b)/2-70,y-18,27,c);
const crests=(y,spacing,shift,key)=>`<defs><clipPath id="${key}"><rect x="150" y="${y-65}" width="920" height="140"/></clipPath></defs><g clip-path="url(#${key})">`+Array.from({length:14},(_,i)=>line(80+i*spacing+shift,y-60,80+i*spacing+shift,y+70,C.cyan,3)).join('')+'</g>';
export const dopplerObserverKinds=['dopplerobserver-fixed-wavelength','dopplerobserver-closing-distance','dopplerobserver-two-causes','dopplerobserver-numeric-comparison'];
export function dopplerObserverDiagram(kind,p){
 if(!dopplerObserverKinds.includes(kind))throw Error(kind);const u=clamp(p),q=clamp(p);
 if(kind==='dopplerobserver-fixed-wavelength'){const x=980-150*u;return text('聞く人が動いても、空気中の山の間隔は同じ',140,35,31)+crests(270,160,180*u,'observer-fixed')+person(x,270)+bracket(240+180*u,400+180*u,150,'一定の波長')+arrow(250,415,410,415,C.cyan)+text('山は右へ進む',245,475,28,C.cyan)+arrow(x+40,415,x-80,415,C.gold)+text('聞く人は左へ',x-110,475,28,C.gold)+text('縦の線は、同じ時刻の音の山の位置',240,100,28);}
 if(kind==='dopplerobserver-closing-distance'){const a=240+420*q,b=900-240*q;return text('山と人の間隔は、両方が進んだ距離だけ縮む',140,35,31)+line(180,260,1060,260,C.dim,2)+line(a,180,a,325,C.cyan,5)+person(b,250)+line(240,165,240,405,C.dim,2,'7 6')+line(900,165,900,405,C.dim,2,'7 6')+arrow(240,400,a,400,C.cyan)+arrow(900,400,b,400,C.gold)+text('山の移動',285,455,28,C.cyan)+text('人の移動',755,455,28,C.gold)+bracket(a,b,135,q<1?'残りの間隔':'山と出会う',C.purple)+text('空気を基準に、右向きの音と左向きの人を比べる',170,505,27);}
 if(kind==='dopplerobserver-two-causes')return text('音源が動く場合と、聞く人が動く場合を分ける',130,35,31)+crests(185,120,180*u,'source-case')+crests(395,160,180*u,'listener-case')+person(990,185)+person(990-150*u,395)+text('上：音源が近づく → 山の間隔が狭まる',170,95,29,C.cyan)+text('下：聞く人が近づく → 山と出会う速さが増す',170,305,29,C.gold)+arrow(990,480,910,480,C.gold)+text('山自体の速さは、どちらも空気に対して同じ',180,505,27);
 if(kind==='dopplerobserver-numeric-comparison'){const x=950-22*u;return text('止まった音源の山へ、聞く人だけが近づく',160,35,31)+crests(265,190,220*u,'numeric-observer')+person(x,265)+arrow(270,125,470,125,C.cyan)+text('音の山：340 m/s',260,90,29,C.cyan)+arrow(x+30,405,x-85,405,C.gold)+text('聞く人：34 m/s',x-125,460,29,C.gold)+text('二つの移動が、山と人の間の距離を縮める',230,505,28);}
}
export function dopplerObserverFrame(c,s,t){return c.visualPilot==='doppler-observer-v1'?authoredMotionFrame(c,s,t,dopplerObserverDiagram):null;}

import {C,text,line,circle,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const ease=p=>{p=clamp(p/.8);return p*p*(3-2*p);};
const pt=(x,y,r,a)=>[x+r*Math.cos(a),y-r*Math.sin(a)];
const arc=(x,y,r,a,c=C.gold)=>path(Array.from({length:81},(_,i)=>pt(x,y,r,a*i/80)),c,4);
const polygon=(pts,c,a=.3)=>`<polygon points="${pts.map(p=>p.join(',')).join(' ')}" fill="${c}" fill-opacity="${a}" stroke="${c}" stroke-width="2"/>`;
const sector=(x,y,r,h,c,a)=>polygon([[x,y],...Array.from({length:81},(_,i)=>pt(x,y,r,h*i/80))],c,a);
export const sineDerivativeKinds=['sine-unit-sector','sine-nested-areas','sine-ratio-limit'];
export function sineDerivativeDiagram(kind,p){
 if(!sineDerivativeKinds.includes(kind))throw Error('Unknown '+kind);const u=ease(p);
 if(kind==='sine-unit-sector'){
  const x=300,y=360,r=270,h=.2+.5*u,P=pt(x,y,r,h);
  return text('半径1の円：ラジアンの角度hは、弧の長さと同じ値',100,35,30)+arc(x,y,r,Math.PI/2,C.dim)+line(x,y,x+r,y)+line(x,y,...P,C.cyan,3)+arc(x,y,r,h,C.gold)+arc(x,y,60,h,C.purple)+circle(...P,9,C.gold)+text('半径 1',400,405,31,C.cyan)+text(`角度 h = ${h.toFixed(2)} rad`,720,210,30,C.purple)+text(`弧の長さ ${h.toFixed(2)}`,720,295,30,C.gold)+text('0 < h < π/2 の範囲で、面積を比べる',285,490,30);
 }
 if(kind==='sine-nested-areas'){
  const h=.7;
  return text('同じ角度・同じ半径で、三つの面積を比較',230,35,31)+[0,1,2].map(i=>{const x=95+i*385,y=365,r=220,P=pt(x,y,r,h),B=[x+r,y],T=[x+r,y-r*Math.tan(h)],O=[x,y],c=[C.cyan,C.purple,C.gold][i],alpha=.12+.35*u;return (i===0?polygon([O,B,P],c,alpha):i===1?sector(x,y,r,h,c,alpha):polygon([O,B,T],c,alpha))+path([O,B,T,O],C.dim,2)+arc(x,y,r,h,C.dim)+line(...O,...P,C.dim,2)+line(...B,...P,C.dim,2)+text(['内側の三角形','円の扇形','外側の三角形'][i],x-15,130,29,c)+text('底辺（半径）1',x+10,425,26)+(i===0?line(P[0],P[1],P[0],y,C.cyan,3,'5 5')+text('sin h',P[0]+10,(P[1]+y)/2,24,C.cyan):i===2?text('tan h',B[0]+10,(T[1]+y)/2,24,C.gold):'');}).join('')+text('内側の三角形 ＜ 扇形 ＜ 外側の三角形',275,495,30,C.gold);
 }
 if(kind==='sine-ratio-limit'){
  const left=160,right=840,zero=(left+right)/2,bottom=385,top=125,X=h=>zero+h*(right-left)/2,Y=q=>bottom-(q-.4)/.6*(bottom-top),h=.9*(1-u)+.025;
  let out=text('プラス側もマイナス側も、比は同じ値へ近づく',170,35,30)+line(left,bottom,right+30,bottom)+line(left,bottom,left,top-25)+line(left,top,right,top,C.gold,2,'7 7')+line(zero,bottom,zero,top,C.dim,2,'5 5');
  for(const sign of [-1,1])out+=path(Array.from({length:101},(_,i)=>{const q=sign*(.005+.995*i/100);return[X(q),Y(Math.sin(q)/q)];}),C.cyan,4)+path(Array.from({length:101},(_,i)=>{const q=sign*i/100;return[X(q),Y(Math.cos(q))];}),C.purple,3)+circle(X(sign*h),Y(Math.sin(h)/h),8,C.cyan);
  return out+`<circle cx="${zero}" cy="${top}" r="7" fill="#0b1122" stroke="${C.cyan}" stroke-width="3"/>`+text('1',left-35,top+10,28,C.gold)+text('0.4',left-55,bottom+10,25)+text('−1',left-15,bottom+40,25)+text('0',zero-8,bottom+40,25)+text('1',right-10,bottom+40,25)+text('角度 h [rad]',750,475,27)+text('青：sin h / h',890,180,27,C.cyan)+text('紫：cos h',890,240,27,C.purple)+text('黄：1',890,300,27,C.gold)+text('h=0では比は未定義。点に穴を残し、極限を調べる',125,505,28);
 }
}
export function sineDerivativeFrame(c,s,t){return c.visualPilot==='sine-derivative-v1'?authoredMotionFrame(c,s,t,sineDerivativeDiagram):null;}

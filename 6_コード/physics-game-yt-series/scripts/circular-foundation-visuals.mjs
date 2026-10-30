import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const ease=p=>{p=clamp(p/.8);return p*p*(3-2*p);};
const ring=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${C.dim}" stroke-width="2"/>`;
const point=(x,y,r,a)=>[x+r*Math.cos(a),y-r*Math.sin(a)];
const arc=(x,y,r,a,b,c=C.gold)=>path(Array.from({length:61},(_,i)=>point(x,y,r,a+(b-a)*i/60)),c,4);
export const circularFoundationKinds=['circular-tangent','circular-release','circular-velocity-difference','circular-limit-direction','circular-similarity','circular-arc-chord','circular-gravity-radius'];
export function circularFoundationDiagram(kind,p){
 if(!circularFoundationKinds.includes(kind))throw Error('Unknown '+kind);const u=ease(p);
 if(kind==='circular-tangent'){
  const x=430,y=270,r=160,a=.2+1.4*u,[X,Y]=point(x,y,r,a);
  return text('青：物体の速度。向きは円周の接線方向',220,35,31)+ring(x,y,r)+line(x,y,X,Y,C.dim,3)+circle(X,Y,11,C.gold)+arrow(X,Y,X-100*Math.sin(a),Y-100*Math.cos(a),C.cyan)+path([point(X,Y,25,a+Math.PI),[X-25*Math.cos(a)-25*Math.sin(a),Y+25*Math.sin(a)-25*Math.cos(a)],point(X,Y,25,a+Math.PI/2)],C.ink,2)+text('速度は半径と直角',755,240,31,C.cyan)+text('矢印の長さ（速さ）は同じ。向きが変わる',235,490,29);
 }
 if(kind==='circular-release'){
  const x=340,y=275,r=155,a=.7,start=point(x,y,r,a),q=u*100,X=start[0]-q*Math.sin(a),Y=start[1]-q*Math.cos(a);
  return text('ひもが切れた後、ほかに力が働かない場合',225,35,30)+ring(x,y,r)+line(x,y,...start,C.dim,2,'6 6')+line(...start,X,Y,C.cyan,4)+circle(...start,6,C.dim)+circle(X,Y,11,C.gold)+arrow(X,Y,X-65*Math.sin(a),Y-65*Math.cos(a),C.cyan)+text('切れた瞬間の速度の向きへ直進',640,245,30,C.cyan)+text('中心から外向きに飛ぶのではない',315,490,30);
 }
 if(kind==='circular-velocity-difference'){
  const d=.8,x=800,y=365,V=200,A=[x,y-V],B=[x-V*Math.sin(d),y-V*Math.cos(d)],merge=clamp(u/.4),root=[x+120*(1-merge),y-70*(1-merge)],end=[root[0]-V*Math.sin(d),root[1]-V*Math.cos(d)],draw=clamp((u-.4)/.6);
  return text('矢印を平行移動して、根元をそろえる',250,35,31)+arrow(x,y,...A,C.cyan)+arrow(...root,...end,C.purple)+arrow(...A,A[0]+(B[0]-A[0])*draw,A[1]+(B[1]-A[1])*draw,C.gold)+text('前の速度',870,185,29,C.cyan)+text('後の速度',575,310,29,C.purple)+text('速度の変化',400,155,30,C.gold)+text('前の先端 → 後の先端',265,225,28,C.gold)+text('前の速度に黄色の変化を足すと、後の速度になる',175,490,29);
 }
 if(kind==='circular-limit-direction'){
  const d=1.2*(1-u)+.06,x=385,y=270,r=165,P=point(x,y,r,0),Q=point(x,y,r,d),a=d/2;
  return text('二つの時刻を近づける。黄色は変化の向きだけ拡大',105,35,29)+ring(x,y,r)+circle(x,y,6,C.ink)+circle(...P,10,C.cyan)+circle(...Q,10,C.purple)+line(x,y,...P,C.dim,2)+line(x,y,...Q,C.dim,2)+arrow(...P,P[0]-140*Math.cos(a),P[1]+140*Math.sin(a),C.gold)+arrow(...P,x,y,C.red)+text('赤：最初の位置から中心へ',690,225,29,C.red)+text('黄：速度変化の向き',690,305,29,C.gold)+text('時間を短くするほど、黄色の向きは赤へ近づく',180,490,29);
 }
 if(kind==='circular-similarity'){
  const d=.3+.5*u,r=200,left=[250,330],right=[850,390],A=point(...left,r,0),B=point(...left,r,d),V=point(...right,r,Math.PI/2),W=point(...right,r,Math.PI/2+d);
  return text('同じ頂角の二等辺三角形 → 対応する辺の比が等しい',110,35,29)+arrow(...left,...A,C.cyan)+arrow(...left,...B,C.cyan)+line(...A,...B,C.gold,5)+arrow(...right,...V,C.purple)+arrow(...right,...W,C.purple)+line(...V,...W,C.gold,5)+arc(...left,55,0,d)+arc(...right,55,Math.PI/2,Math.PI/2+d)+text('半径 r',285,385,30,C.cyan)+text('速さ v',900,285,30,C.purple)+text('直線距離 ℓ',465,260,29,C.gold)+text('速度変化の大きさ',605,135,28,C.gold)+text('黄色の辺どうしが対応。両側とも、残る二本の辺は等しい',145,490,29);
 }
 if(kind==='circular-arc-chord'){
  const d=1.4*(1-u)+.12,x=355,y=265,r=180,A=point(x,y,r,-d/2),B=point(x,y,r,d/2),ratio=2*Math.sin(d/2)/d;
  return text('時間を短くして、二点を近づける',300,35,31)+ring(x,y,r)+arc(x,y,r,-d/2,d/2,C.cyan)+line(...A,...B,C.gold,4)+circle(...A,7,C.ink)+circle(...B,7,C.ink)+text('青：円周に沿う弧',690,190,30,C.cyan)+text('黄：二点を結ぶ直線',690,255,30,C.gold)+text(`直線の長さ ÷ 弧の長さ = ${ratio.toFixed(4)}`,605,365,27)+text('長さの比が1へ近づく。有限の角度では、直線の方が短い',95,490,29);
 }
 if(kind==='circular-gravity-radius'){
  const x=410,y=270,r=190,a=.2+.65*u,P=point(x,y,r,a);
  return text('地球の中心から測った半径で、円軌道を考える',165,35,30)+ring(x,y,r)+circle(x,y,85,C.cyan,.3)+circle(x,y,5,C.ink)+line(x,y,...P,C.gold,3)+circle(...P,12,C.purple)+arrow(...P,P[0]-105*Math.cos(a),P[1]+105*Math.sin(a),C.red)+text('地球',365,305,30)+text('r：地球の中心から衛星まで',670,245,29,C.gold)+text('赤：地球が衛星を引く力',670,330,29,C.red)+text('rは地表からの高さではない',315,490,31);
 }
}
export function circularFoundationFrame(c,s,t){return c.visualPilot==='circular-foundations-v1'?authoredMotionFrame(c,s,t,circularFoundationDiagram):null;}

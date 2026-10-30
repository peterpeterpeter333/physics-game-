import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const ease=p=>{p=clamp(p/.8);return p*p*(3-2*p);};
const rect=(x,y,w,h,c,alpha=.4)=>`<rect x="${x}" y="${y}" width="${Math.max(0,w)}" height="${Math.max(0,h)}" fill="${c}" fill-opacity="${alpha}"/>`;
const origin=620;
const spring=(x,y)=>line(130,y-60,130,y+55,C.dim,5)+path(Array.from({length:121},(_,i)=>{const q=i/120;return[130+(x-180)*q,y+16*Math.sin(q*20*Math.PI)];}),C.cyan,3)+rect(x-50,y-35,100,70,C.cyan)+line(110,y+40,1060,y+40,C.dim,2);
const zero=(y)=>`<path d="M ${origin} ${y-80} V ${y+80}" stroke="${C.dim}" stroke-width="2" stroke-dasharray="6 7"/>`+text('位置0',origin-35,y+115,28,C.dim);
const graph=(numeric=false)=>line(190,385,1010,385)+line(190,385,190,55)+text(numeric?'手の力 [N]':'手の力',205,35,29)+text(numeric?'伸び [m]':'伸び',960,435,28)+text('0',165,420,25)+line(190,385,910,85,C.cyan,4);
const triangle=(alpha=.25)=>`<path d="M190 385 L910 85 L910 385 Z" fill="${C.cyan}" fill-opacity="${alpha}"/>`;
const strips=(n,amount=1,curve=false)=>Array.from({length:n},(_,i)=>{const q=(i+1)/n,h=300*(curve?q*q:q);return rect(190+i*720/n,385-h,720/n-1,h,C.gold,i/n<amount?.35:0);}).join('');
export const springEnergyKinds=['spring-origin','spring-displacement','spring-restoring','spring-hooke-compare','spring-hand-work','spring-area-preview','spring-area-labels','spring-through-origin','spring-oscillation','spring-work-question','spring-overcount','spring-work-strips','spring-strips-limit','spring-energy-transfer','spring-area-to-curve','spring-integral-preview','spring-numeric-area'];
export function springEnergyDiagram(kind,p){
 if(!springEnergyKinds.includes(kind))throw Error('Unknown spring diagram '+kind);
 const u=ease(p);
 if(kind==='spring-origin')return spring(origin,260)+zero(260)+circle(origin,260,60+8*u,C.cyan,.07)+text('伸ばしも縮めもしない長さを、自然長という',210,60,29)+text('水平な床。ばねの質量と摩擦・空気抵抗は無視',190,490,27);
 if(['spring-displacement','spring-restoring','spring-through-origin','spring-oscillation'].includes(kind)){
  const clock=clamp(p/.8);
  const a=kind==='spring-oscillation'?Math.PI+2*Math.PI*clock:kind==='spring-through-origin'?.6*Math.PI*clock:Math.PI*u,d=180*Math.cos(a),x=origin+d,y=260;
  let out=spring(x,y)+zero(y)+text('右向きを正にする →',725,55,29);
  if(kind==='spring-displacement')out+=arrow(origin,430,x,430,C.gold)+text(d>1?'右へずれた位置：正':d< -1?'左へずれた位置：負':'自然長の位置：0',350,95,31,C.gold);
  else {
   out+=arrow(x,y-75,x-d*.6,y-75,C.red)+text('赤：ばねが物体に加える力',185,95,29,C.red);
   if(kind!=='spring-restoring')out+=arrow(x,y+80,x-130*Math.sin(a),y+80,C.purple)+text('紫：物体の速度',185,485,29,C.purple)+text('力0でも、速度0とは限らない',675,485,27);
   else out+=text('変位と戻す力は、逆向き',375,485,31);
  }
  return out;
 }
 if(kind==='spring-hooke-compare')return text('同じばねを、別々の伸びで比べる',305,35,31)+[1,2].map((n,i)=>{const y=170+i*220,x=origin+70*n*u;return spring(x,y)+arrow(x,y-65,x-60*n*u,y-65,C.red)+text(i?'伸び2倍 → 力の大きさ2倍':'伸び1倍 → 力の大きさ1倍',720,y+85,25,C.red);}).join('');
 if(kind==='spring-hand-work'||kind==='spring-work-question'){
  const x=origin+170*u,y=285;
  return spring(x,y)+zero(y)+arrow(x,y-95,x-120*u,y-95,C.red)+arrow(x+65,y,x+65+120*u,y,C.gold)+text('赤：ばねの戻す力',150,65,30,C.red)+text('黄：手が伸ばす力',680,65,30,C.gold)+text(kind==='spring-hand-work'?'ゆっくり伸ばす → 二つの力の大きさはほぼ同じ':'伸ばすほど、手に必要な力も大きくなる',200,485,29)+(kind==='spring-work-question'?text('一定の力 × 距離だけでは、どの力を使う？',260,125,28):rect(870,385,180*u*u,30,C.gold)+text('ばねのエネルギー',850,450,24,C.gold));
 }
 if(kind==='spring-energy-transfer'){
  const a=Math.PI*clamp(p/.8)/2,d=180*Math.cos(a),x=origin+d,y=160,U=Math.cos(a)**2;
  return spring(x,y)+arrow(x,y-65,x-100*Math.sin(a),y-65,C.purple)+text('自然長へ戻るまでを追う',350,35,30)+text('ばねの位置エネルギー',185,300,28,C.gold)+rect(185,325,350*U,50,C.gold)+text('物体の運動エネルギー',680,300,28,C.purple)+rect(680,325,350*(1-U),50,C.purple)+text('二つの合計は一定。摩擦なし',345,465,30);
 }
 if(kind==='spring-area-to-curve'||kind==='spring-integral-preview'){
  const n=kind==='spring-integral-preview'?4+Math.floor(28*u):8,power=kind==='spring-integral-preview'?2:1+u;
  let out=line(190,385,1010,385)+line(190,385,190,55)+text('力',205,35,30)+text('移動距離',950,435,28)+path(Array.from({length:81},(_,i)=>{const q=i/80;return[190+720*q,385-300*q**power];}),C.cyan,4);
  if(kind==='spring-integral-preview')out+=strips(n,1,true)+text(`区間の数 ${n}：細く分けて、仕事を合計する`,265,490,28,C.gold);
  else out+=text('曲線の場合も、短い区間の仕事を足す',300,490,30)+circle(190+720*u,385-300*u**power,9,C.gold);
  return out;
 }
 let out=graph(kind==='spring-numeric-area');
 if(kind==='spring-area-labels')return out+triangle(.25)+arrow(190,430,190+720*u,430,C.gold)+arrow(975,385,975,385-300*u,C.purple)+text('底辺：伸び x',390,475,30,C.gold)+text('高さ：最後の力 kx',680,50,29,C.purple);
 if(kind==='spring-overcount')out+=rect(190,85,720*u,300,C.red,.15)+triangle()+text('赤の長方形は、途中の力を大きく数えすぎる',245,490,29,C.red);
 else if(kind==='spring-work-strips')out+=strips(6,u)+text('各長方形：短い移動 × その区間の力',310,490,29,C.gold)+text('高さは区間の終わりの力で近似',430,55,27,C.gold);
 else if(kind==='spring-strips-limit'){const n=4+Math.floor(28*u);out+=strips(n)+triangle(.1)+text(`区間の数 ${n}：合計は三角形の面積へ近づく`,220,490,29,C.gold);}
 else if(kind==='spring-numeric-area')out+=triangle(.25+.15*u)+`<path d="M190 85 H910 V385" fill="none" stroke="${C.red}" stroke-width="3" stroke-dasharray="8 8"/>`+text('20',125,95,28,C.red)+text('0.2',875,425,28,C.gold)+text('三角形 2 J',440,330,31,C.cyan)+text('長方形 4 J',380,135,31,C.red)+text('最後の力で作る長方形は、三角形の2倍',260,490,28);
 else out+=triangle(u*.35)+text('直線の下の三角形を、次に詳しく計算する',260,490,28);
 return out;
}
export function springEnergyFrame(c,s,t){return c.visualPilot==='spring-energy-v1'?authoredMotionFrame(c,s,t,springEnergyDiagram):null;}

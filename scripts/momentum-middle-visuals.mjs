import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const rect=(x,y,w,h,c,a=.3)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" fill-opacity="${a}"/>`;
const ease=p=>{p=clamp(p/.85);return p*p*(3-2*p);};
const axes=(x,y,w,h)=>line(x,y,x+w,y)+line(x,y,x,y-h)+text('時間 [s]',x+w-60,y+65,25)+text('合力 [N]',x-25,y-h-22,25);
export const momentumMiddleKinds=['cushion-stop','cushion-equal-area','cushion-average-rectangle','cushion-peak-average','cushion-peak-warning','cushion-contact-net'];
export function momentumMiddleDiagram(kind,p){
 if(!momentumMiddleKinds.includes(kind))throw Error('Unknown diagram '+kind);
 const u=ease(p);
 if(kind==='cushion-stop'){
  const t=.1*clamp(p/.85);
  return text('同じ質量・同じ落下速度から、跳ね返らずに停止',190,35,30)+text(`接触後 ${t.toFixed(3)} s`,460,90,30,C.gold)+[.01,.1].map((T,i)=>{const ox=180+i*555,q=Math.min(t/T,1),depth=(i?120:12)*(2*q-q*q),y=210+depth;return rect(ox-60,252+depth,290,(i?150:27)-depth,i?C.purple:C.dim)+`<ellipse cx="${ox+80}" cy="${y}" rx="30" ry="42" fill="${C.ink}"/>`+arrow(ox+150,y,ox+150,y+90*(1-q),C.cyan)+text(i?'クッション':'硬い床',ox,435,31,i?C.purple:C.cyan)+text(`${T} s で停止`,ox,485,29,C.gold);}).join('');
 }
 if(kind==='cushion-equal-area'){
  const ox=190,oy=390,w=780,H=260;
  return text('面積はどちらも 0.3 N s（合力の力積）',240,40,32,C.gold)+axes(ox,oy,w+40,H+25)+path([[ox,oy],[ox+39,oy-H],[ox+78,oy]],C.cyan,4,C.cyan)+path([[ox,oy],[ox+390,oy-H*.1],[ox+780,oy]],C.purple,4,C.purple)+text('0.01',ox+60,oy+40,26,C.cyan)+text('0.1',ox+w-20,oy+40,26,C.purple)+text('60',ox-60,oy-H+10,27,C.cyan)+text('6',ox-45,oy-H*.1+8,27,C.purple)+text('短い時間・高い山 ↔ 長い時間・低い山',230,495,30)+circle(ox+w*u,oy-H*.1*(1-Math.abs(2*u-1)),6,C.ink);
 }
 if(kind==='cushion-average-rectangle'){
  const x=210,y=390,w=140+600*u,h=250*140/w;
  return text('横幅 × 高さは一定：平均の合力 × 時間',220,40,31)+axes(x,y,830,270)+rect(x,y-h,w,h,C.gold)+line(x,y-h,x+w,y-h,C.gold,4)+text('平均の合力',x+w+25,y-h+8,29,C.gold)+text('同じ運動量の変化なら、時間を延ばすと平均の合力は減る',120,495,29);
 }
 if(kind==='cushion-peak-average'||kind==='cushion-peak-warning'){
  const ox=200,oy=385,w=740,H=90;
  const peak=kind==='cushion-peak-warning'?H*(2+u):H*2;
  const half=H*w/peak;
  return text(kind==='cushion-peak-warning'?'平均だけでは、一瞬の最大値は決まらない':'同じ時間・同じ面積でも、力の最大値は違う',160,35,30)+axes(ox,oy,w+60,275)+rect(ox,oy-H,w*u,H,C.gold)+path([[ox,oy],[ox+w/2-half,oy],[ox+w/2,oy-peak],[ox+w/2+half,oy],[ox+w,oy]],C.cyan,4)+line(ox,oy-H,ox+w,oy-H,C.gold,3)+text('黄色：平均の合力',735,150,28,C.gold)+text('青：途中で変わる合力',735,100,28,C.cyan)+text(kind==='cushion-peak-warning'?'割れるかどうかは、力のかかり方も関係する':'青い山の面積と、黄色の長方形の面積は同じ',170,495,29);
 }
 if(kind==='cushion-contact-net')return text('卵に働く力を整理する（平均値で比較）',230,35,31)+circle(540,255,46,C.ink)+rect(440,305,200,30,C.purple)+arrow(540,245,540,245-165*u,C.cyan)+arrow(555,260,555,260+110*u,C.red)+text('接触面からの力：上向き',650,155,30,C.cyan)+text('重力：下向き',650,355,30,C.red)+text('上向きを正：合力 ＝ 接触面の力 − 重力',220,475,31,C.gold);
}
export function momentumMiddleFrame(c,s,t){return c.visualPilot==='momentum-middle-v1'?authoredMotionFrame(c,s,t,momentumMiddleDiagram):null;}

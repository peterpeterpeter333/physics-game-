import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const ease=p=>{p=clamp(p/.75);return p*p*(3-2*p);};
const poly=(pts,color,opacity=.3)=>`<polygon points="${pts.map(p=>p.join(',')).join(' ')}" fill="${color}" fill-opacity="${opacity}" stroke="${color}" stroke-width="2"/>`;
const rect=(x,y,w,h,c,o=.3)=>poly([[x,y],[x+w,y],[x+w,y+h],[x,y+h]],c,o);
const car=(x,y)=>`<rect x="${x-38}" y="${y-30}" width="76" height="35" rx="7" fill="${C.cyan}"/>`+circle(x-25,y+12,11,C.dim)+circle(x+25,y+12,11,C.dim);
const axes=()=>line(150,390,1030,390)+line(150,390,150,35)+text('速度 [m/s]',145,28,28)+text('経過時間 [s]',860,450,27);
const graph=()=>axes()+path([[150,320],[850,110]],C.purple,5);
function area(kind,p){
 const u=ease(p);
 if(['area-constant','area-rectangle'].includes(kind))return axes()+rect(150,215,700*u,175,C.cyan)+line(150,215,850,215,C.cyan,5)+text('一定の速度',885,225,27,C.cyan)+text('経過時間',395,435,26,C.gold)+text(kind==='area-constant'?'速度 × 時間 が、位置の変化':'縦：m/s　横：s　面積：m',225,500,29);
 if(['area-strips','area-limit'].includes(kind)){
  const n=kind==='area-strips'?5:Math.round(5+45*u),w=700/n;
  return graph()+Array.from({length:n},(_,i)=>rect(150+i*w,320-210*i/n,w,70+210*i/n,C.cyan,.28)).join('')+text(`時間を ${n} 個に分ける`,760,60,28,C.gold)+text('各区間の初めの速度で、移動量を近似する',180,490,27);
 }
 if(kind==='area-signed')return line(130,245,1070,245)+line(130,455,130,40)+text('速度',75,30,28)+text('時間',1050,290,28)+text('0',90,252,25)+rect(200,100,300*u,145,C.cyan)+rect(650,245,300*u,145,C.red)+line(200,100,500,100,C.cyan,5)+line(650,390,950,390,C.red,5)+text('正の速度：位置は増える',175,65,27,C.cyan)+text('負の速度：位置は減る',650,450,27,C.red)+text('位置の変化 = 上の面積 − 下の面積',275,505,28);
 if(kind==='area-average-numbers')return graph()+rect(150,215,700,175,C.cyan,.13)+line(150,215,850,215,C.gold,4)+poly([[150,320],[150,215],[500,215]],C.cyan,.5*u)+poly([[500,215],[850,215],[850,110]],C.gold,.5*u)+text('平均速度 5 m/s',875,225,24,C.gold)+text('下側の不足と上側の余りが、同じ三角形',180,500,27);
 let out=graph()+rect(150,320,700,70,C.cyan)+poly([[150,320],[850,320],[850,110]],C.gold,.15+.3*u);
 if(kind==='area-half')out+=`<rect x="150" y="110" width="700" height="210" fill="none" stroke="${C.gold}" stroke-width="3" stroke-dasharray="12 8"/>`+text('増加分だけが、この長方形の半分',220,75,29,C.gold)+text('最初の速度の長方形は、半分にしない',200,500,27,C.cyan);
 else if(kind==='area-numbers')out+=text('初速度 2 m/s',160,365,27,C.cyan)+text('増加分 6 m/s',870,235,25,C.gold)+text('2 s',795,430,26)+text('加速度 3 m/s² ／ 最後の速度 8 m/s',215,500,27);
 else if(kind==='area-triangle')out+=arrow(910,320,910,110,C.gold)+text('高さ：at',950,220,26,C.gold)+text('底辺：t',460,355,28,C.gold)+text('黄色：速度が増えたことによる位置の変化',180,500,27,C.gold);
 else out+=text('最初の速度 v₀',180,365,26,C.cyan)+text('増えた速度の分',520,275,27,C.gold)+text('長方形 + 三角形',330,500,30);
 return out;
}
function trapezoid(kind,p){
 const u=ease(p),pts=[[370,375],[730,375],[730,183],[370,327]];
 let out=poly(pts,C.cyan,.4)+text('元の台形',445,355,28,C.cyan);
 if(kind==='trapezoid-double'||kind==='trapezoid-whole'){
  const angle=kind==='trapezoid-double'?180*u:180;
  out+=`<g transform="rotate(${angle} 550 255)">${poly(pts,C.gold,.38)}</g>`;
  out+=text('黄色：元と同じ台形を半回転',160,30,29,C.gold);
  if(kind==='trapezoid-whole')out+=arrow(790,375,790,135,C.purple)+text('高さ：v₀ + v',830,255,29,C.purple)+text('横幅：t',475,430,29)+text('二つ分の面積。元の台形は、その半分。',210,490,28);
  else out+=text('回転角 '+Math.round(angle)+'°',805,445,27);
 }else{
  out+=line(330,375,800,375)+text('時間',805,405,24)+line(370,405,370,100)+text('速度',320,75,24);
  out+=text('左の辺：v₀',175,330,29,C.cyan)+text('右の辺：v',770,260,29,C.gold)+text('辺の間隔：t',415,460,29);
  if(kind==='trapezoid-labels')out+=line(370,327,370,375,C.cyan,7)+line(730,183,730,375,C.gold,7);
 }
 return out;
}
function braking(kind,p){
 const u=ease(p),t=4*u,v=20-5*t,x=150+(20*t-2.5*t*t)*20;
 return text('車は右へ進みながら減速する →',110,45,30)+line(100,285,1080,285)+car(x,265)+arrow(x,175,x+v*6,175,C.purple)+arrow(x,325,x-95,325,C.red)+text(kind==='braking-goal'?'知りたい量：止まるまでに進む距離':'初速度 20 m/s ／ 一定の加速度 −5 m/s²',110,420,29)+text(`速度 ${v.toFixed(1)} m/s`,120,110,29,C.purple)+text('赤：加速度の向き',110,370,25,C.red)+arrow(150,460,950,460,C.gold)+text(kind==='braking-forty'?'停止までの距離 40 m':'停止までの距離 d',450,505,28,C.gold);
}
export const uniformContinuationKinds=['area-constant','area-rectangle','area-strips','area-limit','area-signed','area-split','area-triangle','area-half','area-numbers','area-average-numbers','trapezoid-original','trapezoid-labels','trapezoid-double','trapezoid-whole','braking-goal','braking-result','braking-numbers','braking-forty'];
export function uniformContinuationDiagram(kind,p){
 if(!uniformContinuationKinds.includes(kind))throw Error('Unknown uniform continuation diagram '+kind);
 if(kind.startsWith('area-'))return area(kind,p);
 if(kind.startsWith('trapezoid-'))return trapezoid(kind,p);
 return braking(kind,p);
}
export function uniformContinuationFrame(c,s,t){return c.visualPilot==='uniform-continuation-v1'?authoredMotionFrame(c,s,t,uniformContinuationDiagram):null;}

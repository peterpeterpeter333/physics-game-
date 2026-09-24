import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const ease=p=>{p=clamp(p/.8);return p*p*(3-2*p);};
const box=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${c}" opacity=".22" stroke="${c}" stroke-width="3"/>`;
const vessel=(x,y,w,h,temp,label)=>box(x,y,w,h,C.cyan)+text(label,x,y-25,30)+text(`${temp}℃`,x+w/2-45,y+h/2+12,34,C.gold);
export const heatFoundationKinds=['heatintro-same-temperature','heatintro-heater-transfer','heatintro-mass-energy','heatintro-three-conditions','heatprep-contact','heatprep-one-gram','heatmiddle-proportional','heatmiddle-specific-comparison'];
export function heatFoundationDiagram(kind,p){
 if(!heatFoundationKinds.includes(kind))throw Error(kind);const u=ease(p);
 if(kind==='heatintro-same-temperature'){
  return text('水の量は違っても、温度計の値は同じ',255,35,31)+vessel(160,210,200,170,'20','少ない水')+vessel(620,150,420,230,'20','多い水')+[260,830].map(x=>line(x,400,x,465,C.gold,4)+circle(x,470,9+4*u,C.gold)).join('')+text('温度だけでは、水の量までは分からない',255,510,29);
 }
 if(kind==='heatintro-heater-transfer'){
  return text('熱い物体から、水へエネルギーが移る',235,35,31)+box(140,200,230,160,C.red)+text('熱い物体',185,245,30,C.red)+text('80℃',205,305,36,C.red)+vessel(760,200,230,160,(20+u).toFixed(1),'水')+arrow(410,280,700,280,C.gold)+circle(420+270*u,280,10,C.gold)+text('矢印：熱の移動方向',420,380,28,C.gold)+text('ジュール[J]は、移ったエネルギーの量の単位',210,495,29);
 }
 if(kind==='heatintro-mass-energy'){
  return text('同じ水を20℃から21℃へ：水の質量だけを変える',100,35,30)+[100,1000].map((m,i)=>{const x=170+i*560;return vessel(x,150,250,150,(20+u).toFixed(1),`${m} g の水`)+text('水へ渡した熱量',x,365,28)+box(x,395,(i?400:40)*u,35,i?C.purple:C.cyan)+text(`${Math.round(m*4.2*u)} J`,x,475,31,C.gold);}).join('');
 }
 if(kind==='heatintro-three-conditions'){
  const labels=['物質の種類','質量','温度の変化'];
  return text('温める条件を、一つずつ分けて考える',250,35,31)+labels.map((label,i)=>{const x=70+i*395,active=Math.min(2,Math.floor(u*3))===i,c=active?C.gold:C.dim;return box(x,150,350,245,c)+text(label,x+75,205,32,c)+text(['水か、金属か','何グラムか','何度上げるか'][i],x+70,285,28)+text(['同じ量でも違う','多いほど熱が要る','大きいほど熱が要る'][i],x+35,355,26);}).join('')+text('ここでは、融解・沸騰などの状態変化がない範囲',180,490,29);
 }
 if(kind==='heatprep-contact'){
  return text('温度差がある二つの物体を接触させる',230,35,31)+box(210,180,280,220,C.red)+box(710,180,280,220,C.cyan)+text('初めは60℃',255,135,29,C.red)+text('初めは20℃',755,135,29,C.cyan)+text(`${(60-20*u).toFixed(0)}℃`,285,275,42,C.red)+text(`${(20+20*u).toFixed(0)}℃`,780,275,42,C.cyan)+(u<.999?arrow(510,320,685,320,C.gold):text('同じ温度',530,335,26,C.gold))+text('温度：℃　／　移ったエネルギーの量：J',225,475,29)+text('同じ物質・同じ質量。外への熱の出入りなし',270,505,25);
 }
 if(kind==='heatprep-one-gram'){
  return text('水1 gを、1℃だけ温める',370,35,32)+vessel(220,150,260,235,(20+u).toFixed(1),'水 1 g')+text('水が受け取った熱量',700,190,29)+text(`${(4.2*u).toFixed(1)} J`,760,270,48,C.gold)+box(680,325,360*u,35,C.gold)+text('20℃ → 21℃ に必要な熱量は約4.2 J',260,485,30);
 }
 if(kind==='heatmiddle-proportional'){
  return text('水の状態を変えず、質量だけを変えて比べる',190,35,31)+line(160,430,1100,430)+line(160,100,160,450)+text('受け取る熱量 Q [J]',60,90,29,C.gold)+text('温度の変化 ΔT [K]',800,485,29)+[1,2].map((m,i)=>{const end=880*u;return line(160,430,160+end,430-end*.16*m,i?C.purple:C.cyan,4)+circle(160+end,430-end*.16*m,8,i?C.purple:C.cyan)+text(i?'質量2倍の水':'元の質量の水',720,i?135:365,28,i?C.purple:C.cyan);}).join('')+text('同じ温度の変化なら、質量2倍で熱量も2倍',260,505,27);
 }
 if(kind==='heatmiddle-specific-comparison'){
  return text('同じ質量・同じ熱量で、比熱だけを変える',225,35,30)+[1,2].map((c,i)=>{const x=180+i*560,d=10*u/c;return text(i?'比熱が2倍の物質':'基準の物質',x,125,30,i?C.purple:C.cyan)+box(x,175,240,180,i?C.purple:C.cyan)+text(`${(20+d).toFixed(1)}℃`,x+40,255,40,C.gold)+text(`温度の上昇 ${d.toFixed(1)}℃`,x,415,29)+text('初めは20℃',x+35,475,27);}).join('')+text('両方へ同じ熱量を、同じ割合で与える',315,505,26);
 }
}
export function heatFoundationFrame(c,s,t){return c.visualPilot==='heat-foundations-v1'?authoredMotionFrame(c,s,t,heatFoundationDiagram):null;}

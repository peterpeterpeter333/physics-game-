import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const ease=p=>{p=clamp(p/.8);return p*p*(3-2*p);};
const rect=(x,y,w,h,c=C.dim)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${c}" stroke-width="3"/>`;
const fold=(q,L)=>{q=((q%(2*L))+2*L)%(2*L);return q<=L?q:2*L-q;};
const gas=(x,y,w,h,t,n=16)=>rect(x,y,w,h)+Array.from({length:n},(_,i)=>{const X=8+fold(19+i*29+(48+i%4*12)*t,w-16),Y=8+fold(10+i*17+(i%2?-1:1)*(37+i%3*8)*t,h-16);return circle(x+X,y+Y,6,C.cyan);}).join('');
export const gasFoundationKinds=['gasintro-wall-collisions','gasintro-compressed-comparison','gasintro-isothermal-condition','gasprep-force-area','gasprep-collision-average','gasinsert-density','gasinsert-collision-rate'];
export function gasFoundationDiagram(kind,p){
 if(!gasFoundationKinds.includes(kind))throw Error(kind);const u=ease(p);
 if(kind==='gasintro-wall-collisions'){
  return text('動く分子が壁に当たり、壁を押す',290,35,31)+gas(200,130,660,290,p*6,24)+line(860,130,860,420,C.gold,7)+[190,275,360].map((y,i)=>arrow(880,y,955,y,C.gold)).join('')+text('気体の分子（模式図）',290,480,28,C.cyan)+text('壁が受ける力',900,110,27,C.gold);
 }
 if(kind==='gasintro-compressed-comparison'){
  return text('同じ温度・同じ分子数で、幅だけ半分にする',180,35,31)+gas(130,170,380,240,p*7)+gas(750,170,190,240,p*7)+text('元の幅',255,130,29)+text('半分の幅',760,130,29)+text('体積V',265,460,29,C.cyan)+text('体積V/2',775,460,29,C.purple)+text('高さ・奥行きは同じ。二つの容器の分子の速さも同じ',140,510,28);
 }
 if(kind==='gasintro-isothermal-condition'){
  return text('体積を半分にしても、温度の条件が違えば別の比較',115,35,30)+[0,1].map(i=>{const x=120+i*575,w=350*(1-.5*u);return rect(x,190,w,190,i?C.red:C.cyan)+text(i?'温度も上がる場合':'温度を保つ場合',x,125,30,i?C.red:C.cyan)+text(i?`温度 ${(20+40*u).toFixed(0)}℃`:'温度 20℃',x,440,30)+text(i?'体積の比だけでは圧力は決まらない':'ボイルの法則の条件を満たす',x-10,505,25);}).join('');
 }
 if(kind==='gasprep-force-area'){
  return text('合計の力は同じ。押される面積だけを変える',200,35,30)+[0,1].map(i=>{const x=325+i*555,w=i?280*(1-.5*u):280;return rect(x-w/2,280,w,65,i?C.purple:C.cyan)+arrow(x,150,x,265,C.gold)+text('同じ力F',x-60,120,30,C.gold)+text(i?`面積：元の${(1-.5*u).toFixed(2)}倍`:'面積S',x-130,395,27,i?C.purple:C.cyan)+text(i?`圧力：${(1/(1-.5*u)).toFixed(2)}倍`:'元の圧力',x-70,465,30);}).join('')+`<g opacity="${.3+.7*u}">`+text('面積は、幅×同じ奥行き。矢印は面に垂直な力',190,505,27)+'</g>';
 }
 if(kind==='gasprep-collision-average'){
  const X=t=>170+t*85,end=10*u,pts=[[170,405]];for(let j=0;j<=300;j++){const t=end*j/300,h=t%1<.3?160:0;pts.push([X(t),405-h]);}
  return text('一回ずつの衝突を、時間全体でならす',255,35,31)+line(150,405,1080,405)+line(170,135,170,430)+path(pts,C.cyan,3)+line(170,357,1020,357,C.gold,3,'8 6')+text('壁を押す力',70,105,28)+text('時間',1010,465,28)+text('青：個々の衝突',360,150,29,C.cyan)+text('黄：平均の力',750,150,29,C.gold)+text('衝突を見やすい短い山で表した模式図',280,505,28);
 }
 if(kind==='gasinsert-density'){
  const w=620*(1-.5*u);
  return text('分子を減らさずに、入る空間だけ半分にする',185,35,31)+gas(200,170,w,220,p*4)+line(820,145,820,410,C.dim,2,'6 6')+text('元の右の壁',790,450,27,C.dim)+text('分子16個：変わらない',230,115,30,C.cyan)+text(`体積：元の${(1-.5*u).toFixed(2)}倍`,230,450,29,C.gold)+text('各幅での状態の模式図。圧縮中の運動を再現したものではない',100,510,26);
 }
 if(kind==='gasinsert-collision-rate'){
  return text('同じ壁を往復する時間が半分なら、回数は2倍',140,35,30)+[380,190].map((w,i)=>{const y=200+i*190,t=p*7.6,x=160+fold(120*t,w);return line(150,y,150+w+20,y,C.dim,2)+line(160,y-45,160,y+45,C.dim,4)+line(160+w,y-45,160+w,y+45,C.gold,6)+circle(x,y,13,C.cyan)+text(i?'幅が半分':'元の幅',50,y-65,28)+text(i?'平均の衝突回数：2倍':'平均の衝突回数：1倍',660,y,29,C.gold);}).join('')+text('同じ分子の壁に垂直な動きだけを比較。速さは同じ',190,505,27);
 }
}
export function gasFoundationFrame(c,s,t){return c.visualPilot==='gas-foundations-v1'?authoredMotionFrame(c,s,t,gasFoundationDiagram):null;}

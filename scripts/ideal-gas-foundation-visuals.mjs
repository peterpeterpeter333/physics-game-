import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const box=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" fill-opacity=".09" stroke="${c}" stroke-width="3"/>`;
const bounce=t=>{t=((t%2)+2)%2;return t<1?t:2-t;};
const particles=(x,y,w,h,n,p,c)=>Array.from({length:n},(_,i)=>circle(x+12+(w-24)*bounce(i*.37+p*600/(w-24)),y+12+(h-24)*bounce(i*.63+p*400/(h-24)),5,c)).join('');
export const idealGasFoundationKinds=['ideal-model','ideal-fixed-volume','ideal-collision-count','ideal-mole-groups','ideal-mole-mass','ideal-known-quantities','ideal-litre-cube','ideal-state-snapshot','ideal-amount-volume'];
export function idealGasFoundationDiagram(kind,p){
 if(!idealGasFoundationKinds.includes(kind))throw Error(kind);const u=clamp(p/.8);
 if(kind==='ideal-model')return text('分子を、離れて動く小さな点として考える',230,35,32)+box(160,100,700,310,C.cyan)+particles(160,100,700,310,8,p,C.cyan)+text('図の点は、見えるように大きく描いている',190,455,28)+text('分子自体の体積は無視',875,190,25,C.gold)+text('引き合う力も無視',875,245,25,C.gold)+text('実際の気体を調べるための、単純化したモデル',175,505,28);
 if(kind==='ideal-fixed-volume')return text('同じ気体、同じ温度、同じ体積で比較',230,35,32)+[0,1].map(i=>{const x=120+i*610,n=i?24:12;return box(x,130,350,260,C.cyan)+particles(x,130,350,260,n,p,C.cyan)+text(i?'粒子数：2倍':'粒子数：基準',x+50,100,30)+text(i?'圧力：2倍':'圧力：基準',x+70,440,31,C.gold);}).join('')+text('粒の個数は模式図。温度が同じなので、速さの分布は同じ',135,500,27);
 if(kind==='ideal-collision-count'){
  return text('分子が増えると、壁が受ける衝突も増える',195,35,31)+[0,1].map(i=>{const y=180+i*190,n=i?8:4;return line(960,y-65,960,y+65,C.dim,6)+Array.from({length:n},(_,j)=>{const q=bounce(p*2+j/n);return circle(200+754*q,y+(j%4-1.5)*26,6,i?C.gold:C.cyan);}).join('')+text(i?'粒子数2倍':'基準の個数',25,y,28)+text(i?'衝突：平均2倍':'衝突：平均の基準',740,y+110,27,i?C.gold:C.cyan);}).join('');
 }
 if(kind==='ideal-mole-groups'){
  return text('一モルは、決まった個数をひとまとめにした量',160,35,31)+[0,1,2].map(i=>{const x=120+i*350,a=clamp(u*3-i);return `<g opacity="${a}">`+box(x,155,270,210,C.gold)+Array.from({length:12},(_,j)=>circle(x+45+(j%4)*60,195+Math.floor(j/4)*60,9,C.cyan)).join('')+text('1 mol',x+75,415,36,C.gold)+'</g>';}).join('')+text('一つの箱の12個は省略図。実際は約6.02×10²³個',210,495,28);
 }
 if(kind==='ideal-mole-mass'){
  return text('同じ個数でも、一個の質量が違えば全体の質量も違う',75,35,30)+[0,1].map(i=>{const x=120+i*600,c=i?C.gold:C.cyan;return box(x,125,350,235,c)+Array.from({length:12},(_,j)=>circle(x+55+j%4*80,170+Math.floor(j/4)*75+Math.sin(p*6+j)*3,i?13:8,c)).join('')+text(i?'粒子B：一個が重い':'粒子A：一個が軽い',x+10,105,27,c)+text('同じ1 mol（同じ個数）',x+15,405,28)+text(i?'全体の質量：大きい':'全体の質量：小さい',x+20,465,28,c);}).join('');
 }
 if(kind==='ideal-known-quantities'){
  return text('分かっている三つの量から、体積を求める',190,35,31)+['物質量 n','温度 T','圧力 p'].map((s,i)=>box(120,110+i*125,300,90,C.cyan)+text(s,195,165+i*125,33,C.cyan)+arrow(450,155+i*125,770,280,C.gold)+circle(450+(770-450)*u,(155+i*125)*(1-u)+280*u,7,C.gold)).join('')+box(810,205,280,150,C.gold)+text('体積 V',885,292,38,C.gold)+text('次は、三つの情報を計算で結ぶ',400,500,29);
 }
 if(kind==='ideal-litre-cube'){
  const X=(a,b,c)=>[290+a*34+c*18,425-b*25-c*12],pts=[[0,0,0],[10,0,0],[10,10,0],[0,10,0],[0,0,10],[10,0,10],[10,10,10],[0,10,10]],edges=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  const count=1+Math.floor(u*9),polys=[];for(let a=0;a<=10;a++){polys.push(line(...X(a,0,0),...X(a,0,count),C.cyan,1));polys.push(line(...X(0,a,0),...X(0,a,count),C.cyan,1));}for(let k=0;k<=count;k++){polys.push(line(...X(0,0,k),...X(10,0,k),C.cyan,1));polys.push(line(...X(0,0,k),...X(0,10,k),C.cyan,1));}for(let k=0;k<count;k++)for(let j=0;j<10;j++)for(let i=0;i<10;i++){if(k===0||k===count-1)polys.push(path([X(i,j,k),X(i+1,j,k),X(i+1,j+1,k),X(i,j+1,k),X(i,j,k)],C.cyan,1));}
  return text('一辺1 mの箱を、10 cmの箱に分ける',235,35,32)+polys.join('')+edges.map(([a,b])=>line(...X(...pts[a]),...X(...pts[b]),C.dim,2)).join('')+text('横：10個',355,465,29,C.gold)+text('高さ：10個',90,280,29,C.gold)+text('奥行き：10個',825,240,29,C.gold)+text('各方向に10個 → 全部で1000個',365,505,28)+text('小さい箱一つが1 L',780,370,29,C.cyan);
 }
 if(kind==='ideal-state-snapshot')return text('状態の写真だけでは、過去の熱の受け渡しは分からない',100,35,30)+box(435,125,335,285,C.cyan)+['圧力 p','体積 V','物質量 n','温度 T'].map((s,i)=>text(s,535,175+i*65,30,C.cyan)).join('')+path([[80,180],[230,95],[390,235]],C.gold,3)+path([[80,390],[250,465],[390,320]],C.purple,3)+circle(u<.5?80+300*u:230+320*(u-.5),u<.5?180-170*u:95+280*(u-.5),8,C.gold)+circle(u<.5?80+340*u:250+280*(u-.5),u<.5?390+150*u:465-290*(u-.5),8,C.purple)+text('異なる変化の道筋',50,285,26)+text('受け取った熱は？',825,255,29,C.gold)+text('別に調べる必要がある',795,315,28)+text('状態方程式と、熱の収支は区別する',320,495,29);
 if(kind==='ideal-amount-volume')return text('同じ温度・同じ圧力なら、気体の量と体積が比例',100,35,30)+[0,1].map(i=>{const x=100+i*490,w=i?490:245,n=i?24:12;return box(x,160,w,230,C.cyan)+particles(x,160,w,230,n,p,C.cyan)+line(x+w,145,x+w,410,C.gold,6)+text(i?'物質量2倍 → 体積2倍':'基準の物質量と体積',x,115,28,C.gold);}).join('')+text('同じ高さ・奥行き。分子の密度を保ったまま、容器が長くなる',125,480,27);
}
export function idealGasFoundationFrame(c,s,t){return c.visualPilot==='ideal-gas-foundations-v1'?authoredMotionFrame(c,s,t,idealGasFoundationDiagram):null;}

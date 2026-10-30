// 高校編「原子核と放射線・深く学ぶ 1/3」(ys-hs-a-nucleus-1) — 図。Stage 1200×515.
// 色：陽子・Z 赤、中性子・N 灰、電子 青、質量数 A 黄、γ線（光子）黄、エネルギー 橙。
// 2/3・3/3・要点でも使う部品は export する（カード・タグ・表は力学の部品、電子は電流の部品、γ線の波は光子の部品を読み込む）。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,poly,clamp,mix} from './anim.mjs';
import {card} from './yt1-hs-m1-velocity-1-diagrams.mjs';
import {tag,T2,table} from './yt1-hs-m-energy-1-diagrams.mjs';
import {electron} from './yt1-hs-e-current-1-diagrams.mjs';
import {wavy} from './yt1-hs-a-photon-1-diagrams.mjs';
import {rng} from './yt1-hs-a-bohr-1-diagrams.mjs';
export {card,tag,T2,table,electron,wavy,rng};

const K='hs-a-nucleus-1:';
const PI=Math.PI;
export const PC=C.a, NUC='#a7b1c4', NEG='#7fb3ff', AC=C.hi, EC=C.E, GC=C.hi, BAD=C.a, OK=C.F;
export const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
export const Zt=cs(PC,'Z'), Nt=cs(NUC,'N'), At=cs(AC,'A');
export const U=s=>`\\,\\mathrm{${s}}`;
export const TX=(src,x,y,o={})=>tex(src,x,y,{size:46,auto:false,...o});
export const fcard=(x,y,w,h,src,{g=1,size=48,col=C.hi,dy=0}={})=>card(x,y,w,h,TX(src,x+w/2,y+h/2+size*.3+dy,{size}),g,col);
export const sceneT=(p,ctx)=>ctx&&ctx.scene&&ctx.scene.captions?ctx.t+(ctx.scene.captions[ctx.k]?.start||0):p*8;
// ---- small marks ----------------------------------------------------------------------------------
export const cross=(x,y,r=22,g=1)=>fade(g,line(x-r,y-r,x+r,y+r,{color:BAD,w:5})+line(x-r,y+r,x+r,y-r,{color:BAD,w:5}));
export const okMark=(x,y,g=1)=>fade(g,draw([[x-18,y],[x-4,y+14],[x+20,y-16]],1,{color:OK,w:5}));
// ---- nucleons -------------------------------------------------------------------------------------
export const proton=(x,y,r=15,op=1)=>fade(op,dot(x,y,r,'#c9485a')+dot(x-r*.3,y-r*.3,r*.35,'#ffb3bd',.6)+label('＋',x,y+r*.42,{size:Math.max(14,r*1.1),color:'#fff',anchor:'middle',weight:700}));
export const neutron=(x,y,r=15,op=1)=>fade(op,dot(x,y,r,'#6f7a8f')+dot(x-r*.3,y-r*.3,r*.35,'#d4dae6',.55));
// nucleus of Z protons and N neutrons packed on a sunflower spiral. kinds: array of 'p'/'n' (optional)
export function mixKinds(Z,N,seed=3){const a=[...Array(Z).fill('p'),...Array(N).fill('n')];const R=rng(seed);for(let i=a.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function nucBalls(cx,cy,kinds,{r=15,g=1,turn=null,turnU=0}={}){
 const s=r*1.75;let out='';
 const pos=kinds.map((k,i)=>{const rr=s*Math.sqrt(i+.5)*.9,a=i*2.39996;return [cx+rr*Math.cos(a),cy+rr*Math.sin(a)];});
 // draw from outside in so the centre is on top
 for(let i=kinds.length-1;i>=0;i--){const [x,y]=pos[i];
  if(turn===i){out+=neutron(x,y,r,1-turnU)+proton(x,y,r,turnU);}
  else out+=kinds[i]==='p'?proton(x,y,r):neutron(x,y,r);}
 return fade(g,out);
}
export const nucPos=(cx,cy,i,r=15)=>{const s=r*1.75,rr=s*Math.sqrt(i+.5)*.9,a=i*2.39996;return [cx+rr*Math.cos(a),cy+rr*Math.sin(a)];};
// nuclide symbol with A (top-left, yellow) and Z (bottom-left, red)
export const nucl=(A,Z,sym)=>`{}^{${cs(AC,A)}}_{${cs(PC,Z)}}\\mathrm{${sym}}`;
export const Esym=`{}^{${cs(AC,'0')}}_{${cs(NEG,'-1')}}\\mathrm{e}`;
export function bigNuc(x,y,R,{g=1,text='',sub=''}={}){ // a heavy nucleus drawn as a blob of many balls
 let s='';const R0=rng(11);
 for(let i=0;i<60;i++){const rr=R*Math.sqrt(R0()),a=R0()*2*PI;const xx=x+rr*.82*Math.cos(a),yy=y+rr*.82*Math.sin(a);s+=R0()<.4?proton(xx,yy,R*.17):neutron(xx,yy,R*.17);}
 if(text)s+=label(text,x,y+R+40,{size:26,color:C.ink,anchor:'middle',weight:700});
 if(sub)s+=label(sub,x,y+R+74,{size:24,color:C.dim,anchor:'middle'});
 return fade(g,s);
}
export const alphaKinds=['p','n','n','p'];
export const alphaP=(x,y,{g=1,r=13}={})=>nucBalls(x,y,alphaKinds,{r,g});
export function legend(x,y,{g=1,e=0}={}){
 let s=proton(x,y,13)+label('陽子（＋）',x+24,y+9,{size:24,color:PC,weight:700})+neutron(x+190,y,13)+label('中性子（電気なし）',x+214,y+9,{size:24,color:NUC,weight:700});
 if(e)s+=electron(x+470,y,{r:13})+label('電子（−）',x+494,y+9,{size:24,color:NEG,weight:700});
 return fade(g,s);
}
// ---- penetration figure -----------------------------------------------------------------------------
export const PEN={x0:150,ys:[140,270,400],paper:400,metal:620,lead:840};
export function shields({g=1,o=PEN,lab=1}={}){
 let s=rect(o.paper-3,60,6,400,{fill:'#f3f0e6',fo:.95,stroke:'#f3f0e6',rx:2})
  +rect(o.metal-10,60,20,400,{fill:'#9aa6b8',fo:.85,stroke:C.dim,rx:3})
  +rect(o.lead-36,60,72,400,{fill:'#4b5468',fo:.95,stroke:C.dim,rx:4});
 if(lab)s+=label('紙',o.paper,500,{size:24,color:C.ink,anchor:'middle',weight:700})+label('薄い 金属板',o.metal,500,{size:24,color:C.ink,anchor:'middle',weight:700})+label('厚い 鉛・コンクリート',o.lead+40,500,{size:24,color:C.ink,anchor:'middle',weight:700});
 return fade(g,s);
}
export function rays({g=1,o=PEN,t=0,stop=1,full=0}={}){
 const [ya,yb,yg]=o.ys;let s='';
 s+=label('α',o.x0-60,ya+10,{size:32,color:PC,anchor:'middle',weight:700})+label('β',o.x0-60,yb+10,{size:32,color:NEG,anchor:'middle',weight:700})+label('γ',o.x0-60,yg+10,{size:32,color:GC,anchor:'middle',weight:700});
 s+=arrow(o.x0,ya,o.paper-8,ya,{color:PC,w:7,head:20});
 s+=arrow(o.x0,yb,o.metal-14,yb,{color:NEG,w:5,head:18});
 s+=wavy(o.x0,yg,full?1110:o.lead-40,yg,{color:GC,amp:10,lam:36,ph:t*1.2,w:4,head:full?14:0});
 if(!full)s+=fade(stop,wavy(o.lead+40,yg,1110,yg,{color:GC,amp:5,lam:36,ph:t*1.2,w:2,head:14}));
 return fade(g,s);
}
// ---- scene helpers ----------------------------------------------------------------------------------
const C12=mixKinds(6,6,5), C13=mixKinds(6,7,8), C14=mixKinds(6,8,4);
export {C12,C14};
const nTurn=C14.indexOf('n');
function atomPic(cx,cy,R,{g=1,t=0,nuc=1}={}){
 let s='';for(let k=6;k>=1;k--)s+=dot(cx,cy,R*k/6,'#8fa3c4',.07);
 s+=ring(cx,cy,R,{color:C.faint,w:2,dash:'6 7'});
 for(let i=0;i<3;i++){const a=t*.8+i*2.1;s+=electron(cx+R*.8*Math.cos(a),cy+R*.8*Math.sin(a),{r:11});}
 if(nuc)s+=dot(cx,cy,5,PC);
 return fade(g,s);
}
function ledgerA(rows,{reveal=[1,1],hl=[],x=330,y=230,size=34}={}){
 return table({x,y,cols:[{h:'',color:C.ink,w:200},{h:'前',color:C.ink,w:120},{h:'',color:C.dim,w:50},{h:'後ろの 核',color:C.ink,w:150},{h:'',color:C.dim,w:50},{h:'出た 粒',color:C.ink,w:130}],rows,reveal,hl,rh:64,size});
}
const AEQ=`${nucl(238,92,'U')}\\ \\longrightarrow\\ ${nucl(234,90,'Th')}+${nucl(4,2,'He')}`;
const BEQ=`${nucl(14,6,'C')}\\ \\longrightarrow\\ ${nucl(14,7,'N')}+${Esym}`;
function aEq(y=110,{g=1,size=60,names=1}={}){
 let s=TX(AEQ,600,y,{size});
 if(names)s+=label('ウラン',395,y+58,{size:24,color:C.dim,anchor:'middle'})+label('トリウム',700,y+58,{size:24,color:C.dim,anchor:'middle'})+label('ヘリウム（α線）',915,y+58,{size:24,color:C.dim,anchor:'middle'});
 return fade(g,s);
}
function bEq(y=110,{g=1,size=60,names=1}={}){
 let s=TX(BEQ,600,y,{size});
 if(names)s+=label('炭素',420,y+58,{size:24,color:C.dim,anchor:'middle'})+label('窒素',690,y+58,{size:24,color:C.dim,anchor:'middle'})+label('電子（β線）',880,y+58,{size:24,color:C.dim,anchor:'middle'});
 return fade(g,s);
}
export {AEQ,BEQ};
function person(x,y){return ring(x,y-120,18,{color:C.ink,w:3})+line(x,y-100,x,y-40,{color:C.ink,w:3})+line(x,y-40,x-18,y,{color:C.ink,w:3})+line(x,y-40,x+18,y,{color:C.ink,w:3})+line(x-22,y-80,x+22,y-80,{color:C.ink,w:3});}

export const hsANucleus1Diagrams={
 // ================= S1 前回の問い =================
 [K+'q1']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=atomPic(330,260,190,{t});
  s+=fade(seg(p,.4,.55),ring(330,260,24,{color:C.hi,w:3})+line(352,250,700,120,{color:C.hi,w:2,dash:'6 6'})+line(352,270,700,400,{color:C.hi,w:2,dash:'6 6'}));
  s+=card(700,100,320,320,'',seg(p,.4,.55),C.hi);
  s+=nucBalls(860,260,C12,{r:22,g:seg(p,.55,.7)});
  s+=fade(seg(p,.55,.7),label('原子の 中心',860,460,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'q2']:(p)=>{
  let s=nucBalls(300,250,C12,{r:26});
  s+=card(600,90,520,130,label('何で できている？',860,170,{size:40,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.ink);
  s+=card(600,270,520,130,label('なぜ 放射線を 出す？',860,350,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'size']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=atomPic(330,260,200,{t,nuc:0});
  s+=dot(330,260,3,PC);
  s+=fade(seg(p,.05,.2),label('原子',330,40,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.25),arrow(330,260,250,175,{color:PC,w:2,head:10})+label('原子核',230,160,{size:26,color:PC,anchor:'middle',weight:700}));
  s+=card(640,70,500,130,label('大きさ： 約 10万分の1',890,150,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.35),C.hi);
  s+=card(640,240,500,200,label('原子 ＝ 100 m の 競技場',890,310,{size:30,color:C.ink,anchor:'middle',weight:700})+label('→ 原子核 ＝ 1 mm の 粒',890,385,{size:30,color:PC,anchor:'middle',weight:700}),seg(p,.55,.7),C.ink);
  return s;
 },
 [K+'plan']:(p)=>card(150,70,900,150,label('今回',600,120,{size:28,color:C.dim,anchor:'middle'})+label('原子核を 粒の 個数で 数える',600,190,{size:40,color:AC,anchor:'middle',weight:700}),seg(p,.05,.2),AC)
  +card(250,270,700,130,label('放射線を 出すと、個数は どう 変わる？',600,347,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi),
 // ================= S2 核を数える =================
 [K+'c1']:(p)=>{
  let s=nucBalls(330,250,C12,{r:28,g:seg(p,.02,.15)});
  s+=fade(seg(p,.4,.55),proton(720,170,22)+label('陽子：＋の 電気',760,180,{size:32,color:PC,weight:700}));
  s+=fade(seg(p,.6,.75),neutron(720,320,22)+label('中性子：電気 なし',760,330,{size:32,color:NUC,weight:700}));
  return s;
 },
 [K+'c2']:(p)=>{
  let s=nucBalls(330,250,C12,{r:28});
  s+=card(660,80,460,150,TX(`${Zt}=6`,760,175,{size:60})+label('原子番号',960,170,{size:30,color:PC,anchor:'middle',weight:700}),seg(p,.05,.2),PC);
  s+=card(660,280,460,150,TX(`${Nt}=6`,760,375,{size:60})+label('中性子の 数',960,370,{size:30,color:NUC,anchor:'middle',weight:700}),seg(p,.55,.7),NUC);
  return s;
 },
 [K+'c3']:(p)=>{
  let s='';
  [[C12,'中性子 6',200],[C13,'中性子 7',600],[C14,'中性子 8',1000]].forEach(([k,txt,x],i)=>{const g=i===0?1:seg(p,.25+i*.1,.4+i*.1);
   s+=nucBalls(x,220,k,{r:22,g})+fade(g,label(txt,x,400,{size:26,color:NUC,anchor:'middle',weight:700}));});
  s+=fade(seg(p,.05,.2),TX(`${Zt}=6`,600,60,{size:46}));
  s+=fade(seg(p,.6,.75),label('どれも 炭素',600,480,{size:38,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'c4']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=nucBalls(330,260,C12,{r:16});
  for(let i=0;i<6;i++){const a=t*.5+i*PI/3,R=i%2?220:165;s+=electron(330+R*Math.cos(a),260+R*.8*Math.sin(a),{r:13,op:seg(p,.05,.2)});}
  s+=card(640,80,500,140,label('電子も',860,165,{size:32,color:NEG,anchor:'end',weight:700})+TX(Zt,895,175,{size:54})+label('個',925,165,{size:32,color:NEG,weight:700}),seg(p,.05,.2),NEG);
  s+=card(640,280,500,140,label('化学的な 性質を 決める',890,365,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'c5']:(p)=>{
  let s=nucBalls(220,260,C12,{r:24});
  s+=tag('定義',600,70,{color:C.hi,size:28,g:seg(p,.05,.2)});
  s+=fcard(420,110,660,160,`${At}=${Zt}+${Nt}`,{size:70,col:AC,g:seg(p,.1,.25)});
  s+=fade(seg(p,.6,.75),TX(`${cs(AC,'12')}=${cs(PC,'6')}+${cs(NUC,'6')}`,750,360,{size:56}));
  s+=fade(seg(p,.6,.75),label('質量数',750,450,{size:28,color:AC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'c6']:(p)=>{
  let s=fade(.6,TX(`${At}=${Zt}+${Nt}`,600,70,{size:44}));
  s+=card(150,130,420,280,label('質量数',360,200,{size:30,color:AC,anchor:'middle',weight:700})+TX(cs(AC,'12'),360,300,{size:80})+label('個数（整数）',360,380,{size:28,color:C.ink,anchor:'middle',weight:700})+okMark(500,370,1),seg(p,.05,.2),AC);
  s+=card(630,130,420,280,label('kg で 測る 質量',840,200,{size:30,color:C.ink,anchor:'middle',weight:700})+TX(`\\approx2.0\\times10^{-26}${U('kg')}`,840,300,{size:44})+label('炭素12 の 核',840,380,{size:26,color:C.dim,anchor:'middle'}),seg(p,.4,.55),C.ink);
  s+=fade(seg(p,.6,.75),label('別の もの',600,470,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'c7']:(p)=>{
  let s=card(240,80,720,300,'',seg(p,.02,.15),C.faint);
  s+=fade(seg(p,.02,.15),TX(nucl(12,6,'C'),600,290,{size:150}));
  s+=fade(seg(p,.2,.35),arrow(420,150,530,175,{color:AC,w:4,head:14})+label('質量数 A',400,145,{size:30,color:AC,anchor:'end',weight:700}));
  s+=fade(seg(p,.35,.5),arrow(420,330,530,300,{color:PC,w:4,head:14})+label('原子番号 Z',400,345,{size:30,color:PC,anchor:'end',weight:700}));
  s+=fade(seg(p,.6,.75),label('炭素12',820,350,{size:32,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'c8']:(p)=>{
  let s=nucBalls(270,220,C12,{r:22})+TX(nucl(12,6,'C'),270,420,{size:56})+label('中性子 6',270,480,{size:26,color:NUC,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.2),nucBalls(780,220,C14,{r:22})+TX(nucl(14,6,'C'),780,420,{size:56})+label('中性子 8',780,480,{size:26,color:NUC,anchor:'middle',weight:700}));
  s+=card(960,150,220,130,label('同位体',1070,228,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  s+=fade(seg(p,.55,.7),label('Z が 同じ、N が 違う',1070,330,{size:22,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'c9']:(p)=>{
  let s=bigNuc(280,240,120,{g:seg(p,.02,.15),text:'ウラン238'});
  s+=fcard(560,70,560,170,nucl(238,92,'U'),{size:90,col:C.faint,g:seg(p,.1,.25)});
  s+=card(560,290,560,140,TX(`${Nt}=\\ ?`,840,380,{size:64}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'c10']:(p)=>{
  let s=fade(.6,TX(`${At}=${Zt}+${Nt}`,600,70,{size:44}));
  s+=fade(seg(p,.05,.2),label('両辺から Z を 引く',600,140,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fcard(170,180,860,170,`${Nt}=${cs(AC,'238')}-${cs(PC,'92')}=146`,{size:64,col:NUC,g:seg(p,.2,.35)});
  s+=fade(seg(p,.6,.75),label('中性子 146 個',600,430,{size:34,color:NUC,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S3 放射線の正体 =================
 [K+'r1']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s='';
  const pos=[[160,150],[400,140],[640,160],[880,130],[1060,190],[260,360],[520,370],[780,350],[1020,380]];
  pos.forEach(([x,y],i)=>{const shake=i===6?seg(p,.5,.65)*4*Math.sin(t*25):0;s+=nucBalls(x+shake,y,i%2?C12:C13,{r:12});});
  s+=fade(seg(p,.5,.65),ring(520,370,70,{color:C.hi,w:3,dash:'8 6'})+label('不安定',520,480,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'r2']:(p,ctx)=>{
  const t=sceneT(p,ctx),u=seg(p,.15,.45);
  let s=nucBalls(330,260,C14,{r:22,turn:nTurn,turnU:u});
  s+=fade(seg(p,.4,.5),arrow(470,250,800,170,{color:C.hi,w:5,head:16})+label('粒や 電磁波',650,160,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.5),wavy(470,290,820,350,{color:GC,amp:8,lam:30,ph:t,w:3,head:14}));
  s+=fade(seg(p,.6,.75),label('別の 核に 変わる ＝ 崩壊',330,460,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=card(850,140,300,200,label('出てくる もの',1000,215,{size:26,color:C.ink,anchor:'middle'})+label('＝ 放射線',1000,285,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.7,.85),C.hi);
  return s;
 },
 [K+'r3']:(p)=>{
  let s=tag('実験で 見つかった 事実',600,70,{color:C.hi,size:28,g:seg(p,.02,.15)});
  const cols=[['α線',PC,250],['β線',NEG,600],['γ線',GC,950]];
  cols.forEach(([txt,col,x],i)=>{s+=card(x-150,140,300,300,label(txt,x,210,{size:44,color:col,anchor:'middle',weight:700})+label('正体は？',x,330,{size:30,color:C.dim,anchor:'middle'}),seg(p,.4+i*.1,.55+i*.1),col);});
  return s;
 },
 [K+'r4']:(p)=>{
  let s=card(100,140,300,300,label('α線',250,210,{size:44,color:PC,anchor:'middle',weight:700}),1,PC);
  s+=alphaP(250,330,{r:24,g:seg(p,.05,.2)});
  s+=fade(seg(p,.05,.2),label('ヘリウムの 原子核',750,170,{size:36,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),TX(nucl(4,2,'He'),640,330,{size:90})+label('陽子 2',880,300,{size:30,color:PC,anchor:'middle',weight:700})+label('中性子 2',880,360,{size:30,color:NUC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'r5']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=card(450,140,300,300,label('β線',600,210,{size:44,color:NEG,anchor:'middle',weight:700}),1,NEG);
  s+=electron(600,330,{r:24,op:seg(p,.05,.2)});
  s+=fade(seg(p,.05,.2),label('電子',600,410,{size:30,color:NEG,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),atomPic(980,290,150,{t,nuc:0})+nucBalls(980,290,C12,{r:8}));
  s+=cross(980,290,90,seg(p,.6,.72));
  s+=fade(seg(p,.6,.72),label('まわりの 電子 ではない',980,490,{size:26,color:BAD,anchor:'middle',weight:700}));
  return s;
 },
 [K+'r6']:(p)=>{
  const u=seg(p,.15,.45),f=seg(p,.4,.8);
  let s=nucBalls(380,260,C14,{r:30,turn:nTurn,turnU:u});
  const [x0,y0]=nucPos(380,260,nTurn,30);
  s+=fade(seg(p,.1,.2),ring(x0,y0,40,{color:C.hi,w:3}));
  s+=fade(seg(p,.1,.2),label('中性子 → 陽子',380,70,{size:32,color:C.hi,anchor:'middle',weight:700}));
  s+=electron(mix(x0,1000,f),mix(y0,250,f),{r:16,op:seg(p,.4,.5)});
  s+=arrow(mix(x0,1000,f)+22,mix(y0,250,f),mix(x0,1000,f)+80,mix(y0,250,f),{color:NEG,w:4,head:14,g:seg(p,.45,.55)});
  s+=fade(seg(p,.7,.85),TX(`\\beta^{-}`,960,340,{size:44,color:NEG})+label('崩壊',1040,350,{size:36,color:NEG,anchor:'middle',weight:700})+label('電子は 新しく 生まれる',1000,410,{size:26,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'r7']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=card(800,140,300,300,label('γ線',950,210,{size:44,color:GC,anchor:'middle',weight:700}),1,GC);
  s+=fade(seg(p,.05,.2),wavy(830,330,1070,330,{color:GC,amp:12,lam:30,ph:t*1.5,w:4,head:16}));
  s+=fade(seg(p,.05,.2),label('エネルギーの 大きい 電磁波',420,180,{size:32,color:C.ink,anchor:'middle',weight:700}));
  s+=card(170,250,500,150,label('光子',300,335,{size:36,color:GC,anchor:'middle',weight:700})+TX(`E=h\\nu`,500,345,{size:50}),seg(p,.45,.6),GC);
  return s;
 },
 // ================= S4 崩壊の帳簿 =================
 [K+'a1']:(p)=>{
  const f=seg(p,.45,.8);
  let s=bigNuc(260,300,110,{g:seg(p,.02,.15),text:'ウラン238'});
  s+=alphaP(mix(260,900,f),mix(300,240,f),{r:16,g:seg(p,.45,.55)});
  s+=fade(seg(p,.45,.55),label('α線',mix(260,900,f),mix(300,240,f)-50,{size:28,color:PC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('→ トリウム234',260,140,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.75,.9),TX(AEQ,800,420,{size:44}));
  return s;
 },
 [K+'a2']:(p)=>aEq()+ledgerA([['質量数 A','238','＝','234','＋','4']],{reveal:[seg(p,.1,.3)],hl:[0]})
  +fade(seg(p,.5,.65),label('238 ＝ 234 ＋ 4',600,440,{size:34,color:AC,anchor:'middle',weight:700})),
 [K+'a3']:(p)=>aEq()+ledgerA([['質量数 A','238','＝','234','＋','4'],['原子番号 Z','92','＝','90','＋','2']],{reveal:[1,seg(p,.1,.3)],hl:[1]}),
 [K+'a4']:(p)=>{
  let s=fade(.55,aEq(80,{size:50,names:0}));
  s+=card(180,170,380,150,label('A：4 減る',370,260,{size:40,color:AC,anchor:'middle',weight:700}),seg(p,.05,.2),AC);
  s+=card(640,170,380,150,label('Z：2 減る',830,260,{size:40,color:PC,anchor:'middle',weight:700}),seg(p,.2,.35),PC);
  s+=fade(seg(p,.55,.7),label('Z＝92 ウラン → Z＝90 トリウム（別の 元素）',600,400,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'b1']:(p)=>{
  const f=seg(p,.45,.8);
  let s=nucBalls(300,280,C14,{r:26,g:seg(p,.02,.15),turn:nTurn,turnU:seg(p,.35,.5)});
  s+=fade(seg(p,.02,.15),label('炭素14',300,460,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=electron(mix(420,900,f),mix(280,230,f),{r:15,op:seg(p,.45,.55)});
  s+=fade(seg(p,.7,.85),label('→ 窒素14',300,110,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.75,.9),TX(BEQ,820,400,{size:46}));
  return s;
 },
 [K+'b2']:(p)=>{
  let s=fade(.6,bEq(80,{size:50,names:0}));
  s+=nucBalls(220,320,C14,{r:20})+label('陽子 6・中性子 8',220,480,{size:24,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.2),arrow(360,320,470,320,{color:C.hi,w:5,head:16}));
  s+=nucBalls(610,320,C14,{r:20,turn:nTurn,turnU:seg(p,.05,.25)})+fade(seg(p,.1,.25),label('陽子 7・中性子 7',610,480,{size:24,color:C.ink,anchor:'middle',weight:700}));
  s+=card(800,170,360,120,label('A：14 のまま',980,245,{size:36,color:AC,anchor:'middle',weight:700}),seg(p,.3,.45),AC);
  s+=card(800,320,360,120,label('Z：6 → 7',980,395,{size:36,color:PC,anchor:'middle',weight:700}),seg(p,.6,.75),PC);
  return s;
 },
 [K+'b3']:(p)=>bEq()+ledgerA([['質量数 A','14','＝','14','＋','0'],['電気','＋6','＝','＋7','＋','−1']],{reveal:[1,seg(p,.1,.3)],hl:[1]})
  +fade(seg(p,.6,.75),label('電子の 電気 −1 が 合わせる',600,470,{size:28,color:NEG,anchor:'middle',weight:700})),
 [K+'b4']:(p,ctx)=>{
  const t=sceneT(p,ctx),f=(t*.35)%1;
  let s=fade(.6,bEq(80,{size:50,names:0}));
  s+=nucBalls(300,320,C14.map((k,i)=>i===nTurn?'p':k),{r:20});
  s+=electron(400+280*f,300-120*f,{r:14});
  s+=fade(seg(p,.05,.2),dot(400+280*f,340+110*f,7,'#cfd6e4',.8)+ring(400+280*f,340+110*f,12,{color:'#cfd6e4',w:1.5}));
  s+=card(720,180,440,180,label('反ニュートリノ',940,240,{size:32,color:'#cfd6e4',anchor:'middle',weight:700})+label('電気 なし・軽い',940,290,{size:26,color:C.ink,anchor:'middle'})+label('A：0、Z：0',940,335,{size:26,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),'#cfd6e4');
  return s;
 },
 [K+'g1']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  const LV=(y,txt,c)=>line(700,y,1000,y,{color:c,w:5})+label(txt,1020,y+9,{size:26,color:c,weight:700});
  let s=nucBalls(300,260,C14.map((k,i)=>i===nTurn?'p':k),{r:24});
  s+=fade(seg(p,.05,.2),wavy(450,240,640,160,{color:GC,amp:9,lam:30,ph:t*1.5,w:4,head:16})+label('γ線',560,140,{size:30,color:GC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.05,.2),label('A も Z も そのまま',300,460,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),LV(140,'高い',EC)+LV(360,'低い',EC)+arrow(850,150,850,350,{color:EC,w:5,head:16})+label('核の エネルギー',850,440,{size:28,color:EC,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S5 通り抜けやすさと安全 =================
 [K+'p1']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=rays({t,g:seg(p,.02,.15),full:1});
  s+=fade(seg(p,.5,.65),label('通り抜けやすさ：α ＜ β ＜ γ',600,40,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'p2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  return shields({g:seg(p,.02,.15)})+rays({t,stop:seg(p,.5,.65)})+fade(seg(p,.5,.65),label('弱まって 通る',1110,PEN.ys[2]-30,{size:24,color:GC,anchor:'end',weight:700}));
 },
 [K+'p3']:(p)=>{
  const X=d=>200+d*90,Y=v=>440-v*3.2;let s='';
  s+=fade(seg(p,.02,.15),line(200,440,1100,440,{color:C.dim,w:3})+line(200,440,200,90,{color:C.dim,w:3})+label('鉛の 厚さ',1100,480,{size:26,color:C.dim,anchor:'end'})+label('γ線の 強さ',210,70,{size:26,color:GC,weight:700}));
  const pts=[];for(let d=0;d<=9.6;d+=.1)pts.push([X(d),Y(100*Math.pow(.5,d/1.6))]);
  s+=draw(pts,seg(p,.1,.5),{color:GC,w:5});
  s+=fade(seg(p,.5,.65),line(200,Y(0),1100,Y(0),{color:C.a,w:2,dash:'8 6'})+label('ちょうど 0 には ならない',1090,Y(0)-75,{size:28,color:C.hi,anchor:'end',weight:700}));
  s+=tag('紙・金属板・鉛の 図は 目安',600,130,{color:C.ink,size:26,g:seg(p,.02,.15)});
  return s;
 },
 [K+'p4']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s=line(80,430,700,430,{color:C.dim,w:3})+person(390,430);
  const R=rng(21);for(let i=0;i<14;i++){const x0=100+R()*560,up=R()<.5,ph=(t*.6+R())%1;const y=up?430-ph*300:60+ph*300;s+=dot(x0,y,4,C.hi,.75);}
  s=fade(seg(p,.02,.15),s+label('自然の 放射線（地面・空・食べ物 など）',390,490,{size:24,color:C.dim,anchor:'middle'}));
  s+=card(760,160,400,200,label('大切なのは',960,235,{size:30,color:C.ink,anchor:'middle'})+label('受ける 量',960,310,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'p5']:(p)=>{
  let s=fade(.35,shields({lab:0})+rays({}));
  s+=card(200,120,800,260,label('安全か どうか',600,190,{size:32,color:C.ink,anchor:'middle'})+cross(380,280,22,seg(p,.15,.3))+label('図だけで 決める',540,292,{size:30,color:BAD,anchor:'middle',weight:700})+okMark(700,280,seg(p,.55,.7))+label('量を 測る',830,292,{size:34,color:OK,anchor:'middle',weight:700}),seg(p,.02,.15),C.hi);
  return s;
 },
 // ================= S6 まとめと次の問い =================
 [K+'e1']:(p)=>{
  let s=nucBalls(250,260,C12,{r:26});
  s+=legend(520,90,{g:seg(p,.05,.2)});
  s+=fcard(520,180,600,170,`${At}=${Zt}+${Nt}`,{size:68,col:AC,g:seg(p,.3,.45)});
  return s;
 },
 [K+'e2']:(p)=>{
  let s=card(80,80,500,240,label('α 崩壊',330,140,{size:34,color:PC,anchor:'middle',weight:700})+label('A −4、Z −2',330,230,{size:36,color:C.ink,anchor:'middle',weight:700}),seg(p,.02,.15),PC);
  s+=card(620,80,500,240,TX(`\\beta^{-}`,830,130,{size:42,color:NEG})+label('崩壊',905,140,{size:34,color:NEG,anchor:'middle',weight:700})+label('A そのまま、Z ＋1',870,230,{size:36,color:C.ink,anchor:'middle',weight:700}),seg(p,.3,.45),NEG);
  s+=fade(seg(p,.6,.75),label('前後で 帳簿は 必ず 合う',600,410,{size:36,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'x']:(p,ctx)=>{
  const GONE=seg(p,.15,.85);let s='';const R=rng(41);
  for(let i=0;i<40;i++){const x=90+(i%8)*72,y=100+Math.floor(i/8)*80,die=R();s+=fade(die<.5*GONE?.12:1,nucBalls(x,y,C12,{r:6}));}
  s+=card(680,90,470,130,label('1個 → いつ 崩壊するか 決まらない',915,165,{size:26,color:C.ink,anchor:'middle',weight:700}),seg(p,.02,.15),C.faint);
  s+=card(680,260,470,180,label('たくさんの 核は',915,325,{size:30,color:C.ink,anchor:'middle'})+label('どんな 決まりで 減る？',915,395,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'bye']:(p,ctx)=>{
  const GONE=1;let s='';const R=rng(41);
  for(let i=0;i<40;i++){const x=90+(i%8)*72,y=100+Math.floor(i/8)*80,die=R();s+=fade(die<.5*GONE?.12:1,nucBalls(x,y,C12,{r:6}));}
  return s+card(680,260,470,180,label('たくさんの 核は',915,325,{size:30,color:C.ink,anchor:'middle'})+label('どんな 決まりで 減る？',915,395,{size:36,color:C.hi,anchor:'middle',weight:700}),1,C.hi);
 },
};

// 高校編「円運動と万有引力・要点」(ys-hs-m-circular-summary) — 図。Stage 1200×515.
// 深く学ぶ 1/3〜3/3 と同じ部品・数値（半径 2.0 m・4.0 m/s → 8.0 m/s²、0.50 kg → 4.0 N、月 2.7×10⁻³、衛星 7.9 km/s・85 分）。
import {C,seg,fade,label,line,dot,arrow,draw,rect} from './anim.mjs';
import {card,orbit,O,P,U,arcPts,TF,V,A,earth,moon} from './yt1-hs-m-circular-1-diagrams.mjs';
import {FA,Ft,cross,emScene,EM} from './yt1-hs-m-circular-2-diagrams.mjs';

const K='hs-m-circular-summary:';
const RX=900;
const pull=(phi,{g=1,txt=''}={})=>{const [x,y]=P(phi);return orbit({phi,vel:1})+FA(x,y,x+(O.x-x)*.6,y+(O.y-y)*.6,{g,text:txt,size:26,dx:26,dy:-4,anchor:'start'});};
// velocity fan (common tail) used for the "why" step
function fan({g=1,dv=1,ox=330,oy=440,L=260,deg=40}={}){
 const d=deg*Math.PI/180,a1=Math.PI/2-d/2,a2=Math.PI/2+d/2,t1=[ox+L*Math.cos(a1),oy-L*Math.sin(a1)],t2=[ox+L*Math.cos(a2),oy-L*Math.sin(a2)];
 let s=fade(g,draw(arcPts(ox,oy,L,Math.PI*.25,Math.PI*.75),1,{color:C.v,w:2,dash:'5 7'}));
 s+=arrow(ox,oy,t1[0],t1[1],{color:C.v,w:5,head:16,g})+arrow(ox,oy,t2[0],t2[1],{color:C.v,w:5,head:16,g});
 s+=fade(g,label('A',t1[0]+14,t1[1]+30,{size:26,color:C.v,weight:700})+label('B',t2[0]-30,t2[1]+30,{size:26,color:C.v,weight:700}));
 s+=arrow(t1[0],t1[1],t2[0],t2[1],{color:C.hi,w:5,head:16,g:g*dv});
 s+=fade(g*dv,label('Δv',(t1[0]+t2[0])/2,t1[1]-20,{size:28,color:C.hi,anchor:'middle',weight:700}));
 return s;
}

export const hsCircularSummaryDiagrams={
 [K+'point']:(p)=>{
  let s=orbit({phi:.4+1.8*p,vel:1,acc:seg(p,.3,.5)});
  s+=card(680,80,460,230,label('等速円運動の 加速度',RX+10,125,{size:26,color:C.dim,anchor:'middle'})+TF(A+'=\\dfrac{'+V+'^2}{r}',RX+10,245,{size:54}),seg(p,.1,.25),C.a);
  s+=fade(seg(p,.5,.65),label('向き：円の 中心',RX+10,370,{size:32,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'force']:(p)=>{
  let s=pull(1.0+1.2*p,{g:seg(p,.3,.5)});
  s+=card(680,80,460,230,label('中心向きの 合力',RX+10,125,{size:26,color:C.dim,anchor:'middle'})+TF(Ft+'=\\dfrac{m'+V+'^2}{r}',RX+10,245,{size:54}),seg(p,.1,.25),C.F);
  return s;
 },
 [K+'role']:(p)=>{
  let s=card(150,70,900,130,label('中心向きの 合力の 役',600,150,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.02,.15));
  ['張力','摩擦力','重力'].forEach((t,i)=>{s+=card(170+i*300,250,260,110,label(t,300+i*300,318,{size:36,color:C.F,anchor:'middle',weight:700}),seg(p,.2+i*.12,.3+i*.12),C.F);});
  s+=fade(seg(p,.6,.75),label('ふつうの 力が 受け持つ',600,440,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'why']:(p)=>{
  let s=orbit({phi:null});
  [0.3,1.9,3.5,5.0].forEach((phi,i)=>{const g=seg(p,.3+i*.08,.4+i*.08),[x,y]=P(phi),[ux,uy]=U(phi);s+=fade(g,dot(x,y,9,C.hi))+arrow(x,y,x+O.LV*ux,y+O.LV*uy,{color:C.v,w:5,head:16,g});});
  s+=card(680,110,460,230,label('速さは 同じ',RX+10,180,{size:30,color:C.ink,anchor:'middle'})+label('向きが 変わり続ける',RX+10,260,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'dv']:(p)=>{
  let s=orbit({phi:null});const pA=-.4,pB=.4,L=O.LV;
  [[pA,'A'],[pB,'B']].forEach(([ph,n])=>{const [x,y]=P(ph),[ux,uy]=U(ph);s+=dot(x,y,10,C.hi)+arrow(x,y,x+L*ux,y+L*uy,{color:C.v,w:5,head:16})+label(n,x+16,y+(n==='A'?32:-12),{size:26,color:C.ink,weight:700});});
  const [mx,my]=P(0),len=2*L*Math.sin(.4);
  s+=fade(seg(p,.35,.55),line(mx,my,O.x,O.y,{color:C.hi,w:2,dash:'5 7'}))+arrow(mx,my,mx-len,my,{color:C.hi,w:5,head:16,g:seg(p,.35,.55)});
  s+=fade(seg(p,.4,.55),label('Δv',mx-len/2,my-16,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.05,.2),fan({ox:880,oy:470,L:150,deg:46,dv:1}))+fade(seg(p,.05,.2),label('根元を そろえる',980,460,{size:22,color:C.dim}));
  s+=card(660,60,500,150,label('差の 矢印 Δv',RX+10,115,{size:28,color:C.ink,anchor:'middle'})+label('円の 中心 向き',RX+10,175,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'limit']:(p)=>{
  let s=fan({deg:40-24*seg(p,.1,.6)});
  s+=card(660,110,500,230,label('Δv ÷ Δt で、Δt を 小さく',RX+10,180,{size:28,color:C.ink,anchor:'middle'})+TF('\\rightarrow\\ \\dfrac{'+V+'^2}{r}',RX+10,265,{size:50}),seg(p,.3,.45),C.a);
  return s;
 },
 [K+'ex']:(p)=>{
  let s=orbit({phi:-.3+1.4*p,vel:1,rlab:1,vlab:1});
  s+=card(680,120,460,200,label('r ＝ 2.0 m',RX+10,195,{size:34,color:C.ink,anchor:'middle',weight:700})+label('v ＝ 4.0 m/s',RX+10,260,{size:34,color:C.v,anchor:'middle',weight:700}),seg(p,.05,.2));
  return s;
 },
 [K+'a']:(p)=>{
  let s=orbit({phi:1.2+1.4*p,vel:1,acc:1});
  s+=card(680,90,460,150,TF(A+'=\\dfrac{4.0^2}{2.0}',RX+10,170,{size:48}),seg(p,.05,.2),C.a);
  s+=card(680,280,460,120,TF('=8.0\\ \\mathrm{m/s^2}',RX+10,345,{size:48,color:C.a}),seg(p,.3,.45),C.a);
  return s;
 },
 [K+'f']:(p)=>{
  let s=pull(1.3+.5*p,{g:seg(p,.4,.55),txt:'張力 4.0 N'});
  s+=card(680,90,460,150,TF(Ft+'=0.50\\times 8.0',RX+10,170,{size:46}),seg(p,.05,.2),C.F);
  s+=card(680,280,460,120,TF('=4.0\\ \\mathrm{N}',RX+10,345,{size:48,color:C.F}),seg(p,.3,.45),C.F);
  return s;
 },
 [K+'moon']:(p)=>{
  let s=emScene({ph:.35+.3*p,vel:1,F:seg(p,.1,.3),ftxt:'重力'});
  s+=card(680,110,460,230,label('万有引力（法則）',RX+10,170,{size:28,color:C.dim,anchor:'middle'})+TF(Ft+'=\\dfrac{GMm}{r^2}',RX+10,260,{size:52}),seg(p,.4,.55),C.F);
  return s;
 },
 [K+'moon2']:(p)=>{
  let s=card(80,90,480,220,label('月の 円運動 から',320,150,{size:26,color:C.dim,anchor:'middle'})+TF('2.72\\times 10^{-3}',320,240,{size:44,color:C.a}),seg(p,.05,.2),C.a);
  s+=card(640,90,480,220,label('地表の 重力 ÷ 60.3²',880,150,{size:26,color:C.dim,anchor:'middle'})+TF('2.70\\times 10^{-3}',880,240,{size:44,color:C.a}),seg(p,.25,.4),C.a);
  s+=fade(seg(p,.45,.6),label('≈',600,215,{size:60,color:C.hi,anchor:'middle',weight:700})+label('どちらも 約',470,410,{size:32,color:C.hi,anchor:'end',weight:700})+TF('2.7\\times 10^{-3}\\ \\mathrm{m/s^2}',490,400,{size:40,color:C.hi,anchor:'start'}));
  return s;
 },
 [K+'sat']:(p)=>{
  const ex=300,ey=262,R=130,ph=1.0+2*Math.PI*p*.6,sx=ex+(R+22)*Math.cos(ph),sy=ey-(R+22)*Math.sin(ph);
  let s=earth(ex,ey,R).replace(/opacity=".8[05]?"/g,'opacity=".45"')+fade(1,draw(arcPts(ex,ey,R+22,0,2*Math.PI,80),1,{color:C.faint,w:2,dash:'6 7'}));
  s+=rect(sx-13,sy-8,26,16,{fill:'#c9d3e6',fo:1,stroke:'none',rx:3})+rect(sx-32,sy-5,16,10,{fill:'#4a7bd0',fo:1,stroke:'none',rx:1})+rect(sx+16,sy-5,16,10,{fill:'#4a7bd0',fo:1,stroke:'none',rx:1});
  s+=card(660,90,500,150,TF(V+'=\\sqrt{{\\color{'+C.a+'}g}R}\\approx 7.9\\ \\mathrm{km/s}',RX+10,170,{size:44}),seg(p,.05,.2),C.v);
  s+=card(660,280,500,120,label('1周 約 85 分',RX+10,355,{size:40,color:C.t,anchor:'middle',weight:700}),seg(p,.45,.6),C.t);
  return s;
 },
 [K+'mis']:(p)=>{
  let s=fade(.5,orbit({phi:2.0+.8*p,vel:1}));
  s+=card(300,130,600,200,label('速さ 一定 だから',600,195,{size:30,color:C.ink,anchor:'middle'})+label('加速度は 0？',600,275,{size:44,color:C.a,anchor:'middle',weight:700})+cross(800,262,16,seg(p,.5,.65)),seg(p,.05,.2),C.a);
  return s;
 },
 [K+'mis2']:(p)=>{
  let s=orbit({phi:2.6+1.2*p,vel:1,acc:1});
  s+=card(680,90,460,150,label('加速度 ＝ 速度の 変化',RX+10,150,{size:28,color:C.ink,anchor:'middle'})+label('向きの 変化も 含む',RX+10,200,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=card(680,280,460,120,label('0 ではなく 中心向き',RX+10,350,{size:34,color:C.a,anchor:'middle',weight:700}),seg(p,.45,.6),C.a);
  return s;
 },
 [K+'mis3']:(p)=>{
  const by=280;
  let s=card(60,70,420,380,label('正しい',270,120,{size:28,color:C.F,anchor:'middle',weight:700}),seg(p,.02,.15));
  s+=fade(seg(p,.02,.15),dot(120,by,6,C.dim)+line(120,by,260,by,{color:C.dim,w:2})+dot(260,by,16,C.hi))+FA(260,by,150,by,{g:seg(p,.05,.2),text:'張力',size:26,dy:-20});
  s+=card(620,70,520,380,label('まちがい',830,120,{size:28,color:C.a,anchor:'middle',weight:700})+cross(930,110,16),seg(p,.3,.45));
  s+=fade(seg(p,.3,.45),dot(700,by,6,C.dim)+line(700,by,840,by,{color:C.dim,w:2})+dot(840,by,16,C.hi))+FA(840,by,730,by,{g:seg(p,.3,.45),text:'張力',size:26,dy:-20});
  s+=FA(840,by+30,730,by+30,{g:seg(p,.45,.6),text:'向心力',size:26,dy:40,color:C.a});
  s+=fade(seg(p,.65,.8),label('別に 描き足さない',880,410,{size:28,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sum']:(p)=>{
  let s=pull(.6+1.6*p,{g:1});
  s+=card(680,110,460,230,label('向きを 変え続ける ために',RX+10,180,{size:28,color:C.ink,anchor:'middle'})+label('中心へ 引く 力',RX+10,260,{size:40,color:C.F,anchor:'middle',weight:700}),seg(p,.05,.2),C.F);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=emScene({ph:.5+.5*p,vel:1,F:1,ftxt:'重力'});
  s+=card(680,110,460,230,label('リンゴを 落とす 重力が',RX+10,180,{size:28,color:C.ink,anchor:'middle'})+label('月や 衛星を 回す',RX+10,260,{size:38,color:C.F,anchor:'middle',weight:700}),seg(p,.05,.2),C.F);
  return s;
 },
 [K+'deep']:(p)=>card(200,120,800,220,label('なぜ そうなるかは',600,200,{size:32,color:C.ink,anchor:'middle'})+label('深く学ぶ版 1/3〜3/3 で',600,275,{size:42,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

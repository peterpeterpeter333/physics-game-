// 特別編 v3「疑問20連発」Q7 (ys-sp-gpsq-07) — 図。Stage 1200×515。担当B。
// v1 パート2の衛星・時計、v2 パート2の「エネルギーの段」を import して再利用（どちらも編集しない。キーは再エクスポートしない）。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,mix} from './anim.mjs';
import {card,okMark,sceneT} from './yt1-hs-a-nucleus-1-diagrams.mjs';
import {sat,clock,GOLD} from './yt1-sp-gps-2-diagrams.mjs';
import {spGps22Diagrams as V2} from './yt1-sp-gps2-2-diagrams.mjs';
import {qCard,wrapQ} from './yt1-sp-gpsq-B-common.mjs';

const K='sp-gpsq-07:';
const TC=C.t, HC=C.hi;

// 一定の間隔で振動する波（左から右へ流れる）。gate：数える場所
function rhythm(t,{x0=80,x1=1120,y=200,amp=46,lam=110,speed=150,g=1,gate=820,count=0}={}){
 const sh=(t*speed)%lam;
 let pts=[];for(let x=x0;x<=x1;x+=3)pts.push([x,y-amp*Math.sin(2*Math.PI*(x-x0-sh)/lam)]);
 let s=draw(pts,1,{color:HC,w:4});
 // 山の位置に印（間隔はいつも同じ）
 for(let k=-1;k<12;k++){const X=x0+sh+lam*(k+.25);if(X<x0||X>x1)continue;s+=dot(X,y-amp,5,HC,.9);}
 if(count>0){
  s+=fade(count,line(gate,y-amp-40,gate,y+amp+30,{color:TC,w:3,dash:'8 6'}));
  // 山が gate を通るたびに光る
  const ph=((gate-x0-sh)/lam-.25)%1,near=Math.min(Math.abs(ph),Math.abs(1-ph));
  if(near<.06)s+=fade(count,ring(gate,y-amp,14+60*near,{color:TC,w:3}));
 }
 return fade(g,s);
}

export const spGpsq07Diagrams=wrapQ(7,{
 [K+'card']:(p)=>qCard(7,['衛星の 時計は、どうして','そんなに 正確なのでしょうか？'],p),
 [K+'onboard']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=sat(210,270,3.3,{a:0});
  s+=fade(seg(p,.12,.3),ring(210,270,40,{color:HC,w:3})+line(245,245,420,150,{color:HC,w:2,dash:'6 6'})+line(245,295,420,410,{color:HC,w:2,dash:'6 6'}));
  s+=card(420,70,330,380,clock(585,215,100,{sec:t})+label('原子時計',585,395,{size:36,color:HC,anchor:'middle',weight:700}),seg(p,.18,.32),HC);
  // 後半：何万年たっても、ずれは 1秒 未満
  const u=seg(p,.5,.9),yrs=Math.round(u*30000);
  s+=card(800,80,360,150,label('経過',980,125,{size:26,color:C.dim,anchor:'middle'})+label(`${yrs.toLocaleString('en-US')} 年`,980,195,{size:46,color:TC,anchor:'middle',weight:700}),seg(p,.45,.55),TC);
  s+=card(800,270,360,150,label('ずれ',980,315,{size:26,color:C.dim,anchor:'middle'})+label('1 秒 未満',980,385,{size:46,color:HC,anchor:'middle',weight:700}),seg(p,.62,.75),HC);
  return s;
 },
 [K+'levels']:(p,ctx)=>V2['sp-gps2-2:levels'](p,ctx),
 [K+'rhythm']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=label('自然が 決めた リズム',80,70,{size:32,color:HC,weight:700});
  s+=rhythm(t,{g:seg(p,0,.1),count:seg(p,.45,.6)});
  // 「狂わない」：山と山の間隔が、どこでも同じ
  const lam=110,sh=(t*150)%lam,g1=seg(p,.12,.3);
  for(let k=0;k<3;k++){const X=80+sh+lam*(k+1.25);if(X+lam>760)break;s+=fade(g1,line(X,300,X+lam,300,{color:C.x,w:3})+line(X,290,X,310,{color:C.x,w:3})+line(X+lam,290,X+lam,310,{color:C.x,w:3}));}
  s+=fade(g1,label('間隔は いつも 同じ ＝ 狂わない',80,355,{size:28,color:C.x,weight:700}));
  // 「数える」：門を通った山の数
  const n=Math.floor(Math.max(0,t-.45*ctx.dur)*150/lam);
  s+=card(780,330,380,150,label('数えた 回数',970,375,{size:26,color:C.dim,anchor:'middle'})+label(`${n.toLocaleString('en-US')}`,970,450,{size:54,color:TC,anchor:'middle',weight:700}),seg(p,.45,.6),TC);
  s+=fade(seg(p,.6,.75),label('（本物は 目で 追えないほど 速い）',80,470,{size:24,color:C.dim}));
  return s;
 },
 [K+'bridge']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=rhythm(t,{y:150,amp:30,count:0,g:.6});
  s+=card(150,250,360,180,clock(250,340,60,{sec:t,col:GOLD})+label('時計',400,355,{size:38,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.faint);
  s+=okMark(470,290,seg(p,.2,.3));
  s+=card(620,250,300,180,label('ほかにも？',770,358,{size:44,color:HC,anchor:'middle',weight:700}),seg(p,.4,.55),HC);
  s+=fade(seg(p,.4,.55),arrow(530,340,600,340,{color:HC,w:4,head:14}));
  return s;
 },
});

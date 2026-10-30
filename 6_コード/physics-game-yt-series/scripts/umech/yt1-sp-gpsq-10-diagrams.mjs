// 特別編 v3「疑問20連発」Q10 (ys-sp-gpsq-10) — 図。Stage 1200×515。担当B。
// v2 パート2の「予想 → 両方 → 速さ・高さ → 綱引き」（quiz2a〜quiz2d）を import して再利用（編集しない）。
// 10-1：問いを読む前半は Q カード、後半で v2 の予想の画面（＋速く進む？／−遅れる？）と同じ配置に変わり、pause でカウントダウン。
import {C,seg,fade,label,line,rect,dot,arrow,clamp,mix} from './anim.mjs';
import {card,sceneT} from './yt1-hs-a-nucleus-1-diagrams.mjs';
import {clock,SLOW,FAST,GOLD} from './yt1-sp-gps-2-diagrams.mjs';
import {spGps22Diagrams as V2} from './yt1-sp-gps2-2-diagrams.mjs';
import {qCard,wrapQ,qBadge,countdown} from './yt1-sp-gpsq-B-common.mjs';

const K='sp-gpsq-10:';
const VC=C.v, HC=C.hi;
const V=k=>V2['sp-gps2-2:'+k];
const slowArrow=(x,y,L,{g=1,size=40}={})=>fade(g,arrow(x,y-L/2,x,y+L/2,{color:SLOW,w:8,head:24})+label('−',x+30,y+size*.35,{size,color:SLOW,weight:700}));
const fastArrow=(x,y,L,{g=1,size=40}={})=>fade(g,arrow(x,y+L/2,x,y-L/2,{color:FAST,w:8,head:24})+label('＋',x+26,y+size*.35,{size,color:FAST,weight:700}));

export const spGpsq10Diagrams=wrapQ(10,{
 [K+'card']:(p,ctx)=>{
  const pause=ctx?.cue?.pause||0,dur=ctx?.dur||1,pv=clamp(1-pause/dur,.3,1);
  const out=seg(p,.4*pv,.5*pv);
  let s=fade(1-out,qCard(10,['宇宙に 上げた 原子時計は、地上の 時計より、','速く 進むでしょうか、それとも 遅れるでしょうか？'],p));
  // v2 の予想の画面と同じ配置（次の cue「両方」へ、そのままつながる）
  s+=fade(out,qBadge(70,58)+label('衛星の 時計は、地上より…',120,70,{size:32,color:C.ink,weight:700}));
  s+=card(110,110,430,290,fastArrow(220,265,150)+label('速く',410,245,{size:44,color:FAST,anchor:'middle',weight:700})+label('進む？',410,305,{size:44,color:FAST,anchor:'middle',weight:700}),seg(p,.5*pv,.6*pv),FAST);
  s+=card(660,110,430,290,slowArrow(770,265,150)+label('遅れる？',960,280,{size:44,color:SLOW,anchor:'middle',weight:700}),seg(p,.75*pv,.85*pv),SLOW);
  s+=countdown(600,465,ctx,{off:.1,g:seg(p,pv-.02,pv+.03)})+fade(seg(p,pv-.02,pv+.03),label('考えて みて',550,476,{size:24,color:C.dim,anchor:'end'}));
  return s;
 },
 [K+'both']:(p,ctx)=>V('quiz2a')(p,ctx),
 // 前の文「速く動く時計は、遅れます」→ 速さ（青・下向き）、後の文「高い所の時計は、速く進みます」→ 高さ（赤・上向き）
 [K+'two']:(p,ctx)=>p<.42?V('quiz2b')(p/.42,ctx):V('quiz2c')((p-.42)/.58,ctx),
 [K+'tug']:(p,ctx)=>V('quiz2d')(p,ctx),
 [K+'bridge']:(p,ctx)=>{
  const t=sceneT(p,ctx),x=130+((t*80)%300);
  let s=line(80,330,640,330,{color:C.faint,w:2,dash:'8 8'});
  s+=clock(x,220,70,{sec:t*3,col:GOLD})+arrow(x+90,220,x+170,220,{color:VC,w:6,head:18})+slowArrow(x,395,70,{size:32});
  s+=card(700,50,460,190,label('速く 動くだけで',930,115,{size:32,color:C.ink,anchor:'middle',weight:700})+label('なぜ 遅れる？',930,195,{size:48,color:SLOW,anchor:'middle',weight:700}),seg(p,.05,.2),SLOW);
  // 鍵は 光：光の点が尾を引いて走る
  const g=seg(p,.55,.68),u=(t*.9)%1,X=mix(660,1200,u),Y=290;
  for(let i=10;i>=1;i--)if(X-i*20>660)s+=fade(g,dot(X-i*20,Y,Math.max(2,10-i*.8),HC,.07*(11-i)));
  s+=fade(g,dot(X,Y,20,HC,.25)+dot(X,Y,11,'#fffbe6'));
  s+=card(700,320,460,110,label('鍵は',830,392,{size:36,color:C.ink,anchor:'middle',weight:700})+label('光',960,398,{size:60,color:HC,anchor:'middle',weight:700}),seg(p,.62,.75),HC);
  return s;
 },
});

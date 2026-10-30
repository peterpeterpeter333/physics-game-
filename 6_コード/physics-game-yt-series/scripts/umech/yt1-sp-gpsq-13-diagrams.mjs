// 特別編 v3「疑問20連発」Q13（ys-sp-gpsq-13）動く時計が遅れる証拠は、どこにある？ — 図。Stage 1200×515。
// v2 パート3（yt1-sp-gps2-3）r18〜r22（ミューオンの雨）を呼んで再利用（編集しない）。上に Q 点列。
import {C,seg,fade,label,line,rect,dot,ring,arrow} from './anim.mjs';
import {HI,MU,SLOW,B,sT,card,shift,qRow,qCard,nextQ,plane,xf} from './yt1-sp-gpsq-C-common.mjs';
import {clockFace} from './yt1-sp-gps-3-diagrams.mjs';
import {spGps2_3Diagrams as V2} from './yt1-sp-gps2-3-diagrams.mjs';

const N=13,K='sp-gpsq-13:';
const v2=k=>V2['sp-gps2-3:'+k];
const W=f=>(p,ctx)=>f(p,ctx)+qRow(N,{t:sT(p,ctx)});
const Wb=f=>(p,ctx)=>{const t=sT(p,ctx);return f(p,ctx)+qRow(N,{t,solve:seg(p,.05,.25)})+nextQ(seg(p,.3,.45),t);};
const hash=(i,k)=>{const v=Math.sin(i*12.9898+k*78.233)*43758.5453;return v-Math.floor(v);};

export const spGpsq13Diagrams={
 // 13-1 Q カード（後ろで、空から粒が降る）
 [K+'q']:W((p,ctx)=>{
  const t=sT(p,ctx);let s='';
  for(let i=0;i<26;i++){const x=40+1120*hash(i,1),sp=90+60*hash(i,2),y=((t*sp+515*hash(i,3))%560)-30;s+=line(x,y-24,x,y,{color:MU,w:3,opacity:.3})+dot(x,y,5,MU,.7);}
  s+=qCard(N,'動く時計が遅れる証拠は、どこにある？');
  s+=fade(seg(p,.3,.5),B('証拠は … 空から？',600,420,{size:32,color:MU}));
  return s;
 }),
 // 13-2 宇宙からの粒が空気にぶつかって、ミューオンが生まれる（v2 r18）
 [K+'born']:W(v2('r18')),
 // 13-3 平均 100万分の2秒で消える → 光の速さでも 約660 m（v2 r19 → r20）
 [K+'short']:W((p,ctx)=>shift(0,14,xf(v2('r19'),v2('r20'),.4,.44)(p,ctx))),
 // 13-4 ところが地上まで届く → ミューオンの時計がゆっくり（v2 r21 → r22）
 [K+'reach']:W(xf(v2('r21'),v2('r22'),.48,.52,{pa:[0,.45]})),
 // 13-5 橋：人間が作った時計でも？
 [K+'bridge']:Wb((p,ctx)=>{
  const t=sT(p,ctx);
  let s=card(80,80,420,330,'',1,C.t);
  s+=clockFace(290,210,90,{ang:t*.1,name:'原子時計'});
  s+=fade(seg(p,.1,.25),B('人間が 作った 時計',290,390,{size:28,color:C.t}));
  const x=560+((t*120)%560);
  s+=fade(seg(p,.2,.35),line(560,200,1140,200,{color:C.faint,w:2,dash:'6 10'})+plane(x,200-8*Math.sin(t*1.5),0,{col:'#ffd27a',s:1.6}));
  s+=fade(seg(p,.35,.5),B('同じことが 確かめられる？',850,320,{size:34,color:HI}));
  return s;
 }),
};

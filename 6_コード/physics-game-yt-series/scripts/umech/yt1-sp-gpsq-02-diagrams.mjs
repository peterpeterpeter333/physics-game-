// 特別編 v3「疑問20連発」Q2 (ys-sp-gpsq-02) — 図。Stage 1200×515。★1。
// 「届くまでの時間から、なぜ距離が分かる？」 雷の図は v2 パート1（p11・p13）の描き方を写して使う（yt1-sp-gpsq-A-common.mjs）。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,scaleAt} from './anim.mjs';
import {qwrap,qcard,cueT,durOf,voiceEnd,card,thunder,flashAt,quizFull,answer,QT,tower,circPts,clip,HC,TC,XC,RADIO,PI} from './yt1-sp-gpsq-A-common.mjs';

const K='sp-gpsq-02:', N=2;
export const spGpsq02Diagrams={
 [K+'q']:qwrap(N,(p,ctx)=>qcard(N,['届くまでの 時間から、','なぜ 距離が 分かる？'],p,cueT(p,ctx)),{fadeIn:false}),
 // 雷：ピカッ → 1, 2, 3 秒 → ゴロゴロ
 [K+'thunder']:qwrap(N,(p,ctx)=>{
  const t=cueT(p,ctx),ve=voiceEnd(ctx),t0=.3*ve,ws=Math.max(0,(t-t0)/Math.max(.5,(ve-t0-.1))*3);
  const n=Math.min(3,Math.floor(ws));
  let s=thunder(t,{flash:flashAt(t,t0),ws,id:'q2a'});
  s+=card(760,110,360,100,label('雷で 考える',940,175,{size:38,color:HC,anchor:'middle',weight:700}),seg(p,0,.08)*(1-seg(t,t0-.3,t0)),HC);
  s+=fade(seg(t,t0+.2,t0+.5),label('ピカッ',250,170,{size:34,color:'#fff6b0',weight:700}));
  let c=label('光ってから',770,140,{size:26,color:C.dim,anchor:'middle'});
  for(let i=1;i<=3;i++){const on=n>=i,pop=on?1+.35*Math.exp(-(ws-i)*6):1;c+=scaleAt(660+i*110-110,205,pop,label(String(i),660+i*110-110,222,{size:52,color:on?TC:C.faint,anchor:'middle',weight:700}));}
  c+=label('秒',1010,220,{size:34,color:TC,anchor:'middle',weight:700});
  s+=card(620,90,440,160,c,seg(t,t0,t0+.3),TC);
  return s;
 }),
 [K+'quiz']:qwrap(N,(p,ctx)=>{
  const t=cueT(p,ctx);
  return fade(.5,thunder(t,{ws:3.3,id:'q2b'}))+quizFull(p,t,ctx,{...QT,ans:-1,g:seg(p,0,.08)});
 }),
 [K+'answer']:qwrap(N,(p,ctx)=>{
  const t=cueT(p,ctx),ws=3.15*lin(p,.3,.8);
  let body=thunder(t,{flash:p>.3?flashAt(p*durOf(ctx),.3*durOf(ctx)):0,ws,marks:1,id:'q2c'});
  body+=card(700,110,440,84,label('340 m × 3 ≈ 1 km',920,166,{size:38,color:HC,anchor:'middle',weight:700}),seg(p,.8,.9),HC);
  body+=fade(seg(p,.3,.4),label('1秒に 約340 m',440,180,{size:28,color:C.ink,anchor:'middle',weight:700}));
  return answer(p,t,ctx,QT,body);
 },{fadeIn:false}),
 // 速さ × 時間 → 距離
 [K+'rule']:qwrap(N,(p,ctx)=>{
  const t=cueT(p,ctx);
  let s=fade(.3,thunder(t,{ws:3.3,marks:1,id:'q2d',listener:0}));
  let c=label('時間',300,190,{size:52,color:TC,anchor:'middle',weight:700});
  c+=fade(seg(p,.1,.25),label('× 速さ',560,150,{size:34,color:RADIO,anchor:'middle',weight:700})+arrow(440,175,700,175,{color:C.ink,w:6,head:20}));
  c+=fade(seg(p,.35,.5),label('距離',860,195,{size:60,color:HC,anchor:'middle',weight:700}));
  s+=card(120,70,960,190,c,seg(p,0,.1),HC);
  s+=card(330,300,540,80,label('3 秒 × 340 m/秒 ≈ 1 km',600,354,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.55,.7),C.faint);
  return s;
 }),
 // 橋：距離が一つだけでは、方向が分からない
 [K+'bridge']:qwrap(N,(p,ctx)=>{
  const t=cueT(p,ctx),cx=420,cy=275,r=190,u=seg(p,.1,.4);
  let s=clip('gpsqB2',0,40,1200,475,draw(circPts(cx,cy,r),u,{color:XC,w:4})+fade(u,`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${XC}" fill-opacity=".05"/>`));
  s+=tower(cx,cy,1,XC,{t});
  s+=fade(seg(p,.1,.25),line(cx,cy,cx+r*Math.cos(-.6),cy+r*Math.sin(-.6),{color:XC,w:3,dash:'8 6'})+label('1 km',cx+r*.5*Math.cos(-.6)-34,cy+r*.5*Math.sin(-.6)-30,{size:30,color:XC,anchor:'middle',weight:700}));
  [[2.2,.4],[.9,.5],[3.6,.6],[5.2,.7]].forEach(([a,p0],i)=>{const g=seg(p,p0,p0+.08),x=cx+r*Math.cos(a+.15*Math.sin(t*1.5+i)),y=cy+r*Math.sin(a+.15*Math.sin(t*1.5+i));
   s+=fade(g,dot(x,y,11,'#4c8dff')+ring(x,y,18,{color:C.ink,w:2})+label('？',x+22,y-12,{size:34,color:C.ink,weight:700}));});
  s+=card(720,140,420,130,label('距離 1つ だけ',930,190,{size:32,color:C.ink,anchor:'middle',weight:700})+label('方向が 分からない',930,245,{size:36,color:HC,anchor:'middle',weight:700}),seg(p,.4,.55),HC);
  return s;
 },{bridge:true}),
};

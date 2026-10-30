// 特別編 v3「疑問20連発」Q4 (ys-sp-gpsq-04) — 図。Stage 1200×515。★1。
// 「光は、どれくらい速い？」 クイズと地球7周半は v2 パート1（p21・p22）の描き方を写して使う。
// 衛星までの図は縮尺ほぼそのまま：地球の半径 約6400 km（150 px）、高さ 約2万 km（470 px）。
import {C,seg,lin,fade,label,line,rect,dot,ring,arrow,mix} from './anim.mjs';
import {qwrap,qcard,cueT,card,earth,sat,phone,clock,quizFull,answer,QL,HC,TC,XC,BAD,RADIO,PI} from './yt1-sp-gpsq-A-common.mjs';

const K='sp-gpsq-04:', N=4;
// Earth centre, phone on the surface, satellite 20,000 km above it
const EC=[230,380],ER=150,ANG=-.42,SAT=[EC[0]+620*Math.cos(ANG),EC[1]+620*Math.sin(ANG)],PH=[EC[0]+(ER+4)*Math.cos(ANG),EC[1]+(ER+4)*Math.sin(ANG)];
export const spGpsq04Diagrams={
 [K+'q']:qwrap(N,(p,ctx)=>qcard(N,['光は、どれくらい 速い？'],p,cueT(p,ctx),{y0:230}),{fadeIn:false}),
 [K+'quiz']:qwrap(N,(p,ctx)=>{
  const t=cueT(p,ctx);
  return fade(.4,earth(600,700,400))+quizFull(p,t,ctx,{...QL,ans:-1,g:seg(p,0,.08)});
 }),
 [K+'answer']:qwrap(N,(p,ctx)=>{
  const t=cueT(p,ctx),laps=7.5*lin(p,.28,.74),cx=330,cy=300,R=165;
  let body=earth(cx,cy,118)+ring(cx,cy,R,{color:C.faint,w:2,dash:'4 8'});
  const a=-PI/2+2*PI*laps;
  if(laps>0){for(let i=14;i>=0;i--){const b=a-i*.07;body+=dot(cx+R*Math.cos(b),cy+R*Math.sin(b),9-i*.5,RADIO,1-i/15);}
   body+=dot(cx+R*Math.cos(a),cy+R*Math.sin(a),16,'#fff',.35);}
  body+=label('地球 1周 ＝ 約4万 km',cx,505,{size:24,color:C.dim,anchor:'middle'});
  body+=card(640,130,500,170,label(`${laps.toFixed(1)} 周`,890,220,{size:60,color:HC,anchor:'middle',weight:700})+label(`経過 ${(laps/7.5).toFixed(2)} 秒`,890,272,{size:28,color:TC,anchor:'middle',weight:700}),seg(p,.22,.3),C.faint);
  body+=card(640,330,500,110,label('1秒に 約30万 km',890,400,{size:40,color:HC,anchor:'middle',weight:700}),seg(p,.76,.86),HC);
  return answer(p,t,ctx,QL,body);
 },{fadeIn:false}),
 // 衛星まで 約2万 km → 約0.07 秒
 [K+'sat']:qwrap(N,(p,ctx)=>{
  const t=cueT(p,ctx),u=lin(p,.3,.75);
  let s=earth(EC[0],EC[1],ER)+phone(PH[0],PH[1]-14,52)+sat(SAT[0],SAT[1],1.3,{glow:.5+.5*Math.sin(t*3)});
  s+=line(SAT[0],SAT[1]+20,PH[0]+6,PH[1]-42,{color:RADIO,w:2.5,dash:'3 8'});
  const x=mix(SAT[0],PH[0]+6,u),y=mix(SAT[1]+20,PH[1]-42,u);
  if(u>0&&u<1)s+=dot(x,y,22,RADIO,.25)+dot(x,y,10,RADIO);
  if(u>=1)s+=fade(clamp01((p-.75)*8),ring(PH[0],PH[1]-14,44,{color:HC,w:4}));
  const mx=(SAT[0]+PH[0])/2,my=(SAT[1]+PH[1])/2;
  s+=fade(seg(p,.05,.2),label('約 2万 km',mx-20,my-50,{size:34,color:XC,anchor:'middle',weight:700}));
  s+=card(760,250,390,170,label('届くまで',955,300,{size:28,color:C.dim,anchor:'middle',weight:700})+label(`${(0.067*u).toFixed(3)} 秒`,955,375,{size:54,color:TC,anchor:'middle',weight:700}),seg(p,.2,.3),TC);
  s+=fade(seg(p,.8,.9),label('わずか 約0.07 秒',955,465,{size:32,color:HC,anchor:'middle',weight:700}));
  return s;
 }),
 // 橋：速すぎて、時間を測るのが大変
 [K+'bridge']:qwrap(N,(p,ctx)=>{
  const t=cueT(p,ctx);
  let s=clock(240,240,110,{t:t*8,g:seg(p,0,.15)});
  for(let k=0;k<3;k++){const q=((t*1.6+k/3)%1),x=mix(400,1160,q);
   s+=line(Math.max(400,x-160),200+k*40,x,200+k*40,{color:RADIO,w:5,opacity:.25+.5*(1-k/3)})+dot(x,200+k*40,8,RADIO);}
  s+=card(470,330,560,110,label('時間を 測るのは',650,397,{size:32,color:C.ink,anchor:'middle',weight:700})+label('大変！',890,402,{size:44,color:BAD,anchor:'middle',weight:700}),seg(p,.4,.55),BAD);
  return s;
 },{bridge:true}),
};
function clamp01(x){return Math.max(0,Math.min(1,x));}

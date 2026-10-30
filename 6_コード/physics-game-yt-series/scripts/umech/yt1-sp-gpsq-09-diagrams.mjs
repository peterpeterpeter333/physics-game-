// 特別編 v3「疑問20連発」Q9 (ys-sp-gpsq-09) — 図。Stage 1200×515。担当B。
// v1 パート2のニュートンの山（cannon）、v2 パート2の「速さ・高さ」2枚のカード（two）を import して再利用（編集しない）。
// 日本地図は v2 パート2と同じデータ（共通部品 yt1-sp-gpsq-B-common.mjs）。
import {C,seg,fade,label,line,rect,dot,ring,draw,mix} from './anim.mjs';
import {card,sceneT} from './yt1-hs-a-nucleus-1-diagrams.mjs';
import {spGps2Diagrams as V1} from './yt1-sp-gps-2-diagrams.mjs';
import {spGps22Diagrams as V2} from './yt1-sp-gps2-2-diagrams.mjs';
import {qCard,wrapQ,japanMap,TOKYO,OSAKA} from './yt1-sp-gpsq-B-common.mjs';

const K='sp-gpsq-09:';
const VC=C.v, TC=C.t, XC=C.x, HC=C.hi;

export const spGpsq09Diagrams=wrapQ(9,{
 [K+'card']:(p)=>qCard(9,['その前に、衛星は、宇宙を','どれくらいの 速さで 飛んでいるのでしょうか？'],p),
 [K+'cannon']:(p,ctx)=>V1['sp-gps-2:cannon'](p,ctx),
 // 秒速 約3.9 km → 東京から大阪（直線 約400 km）を 1分43秒（2分かからない）
 [K+'japan']:(p,ctx)=>{
  // 時間で合わせる：前の文（秒速）の後、「東京から大阪まで」で横切り、声の終わりの少し後に着く
  const t=ctx?ctx.t:p*8,vE=ctx?ctx.dur-(ctx.cue?.pause||0):5,T=(a,b)=>seg(t,a,b);
  const u=Math.min(1,Math.max(0,(t-.48*vE)/(.52*vE+.3)));
  let s=japanMap(1,'gpsq09map');
  s+=dot(TOKYO[0],TOKYO[1],9,C.ink)+label('東京',TOKYO[0]+16,TOKYO[1]+30,{size:26,color:C.ink,weight:700});
  s+=dot(OSAKA[0],OSAKA[1],9,C.ink)+label('大阪',OSAKA[0]-14,OSAKA[1]+36,{size:26,color:C.ink,weight:700,anchor:'end'});
  s+=fade(T(.38*vE,.48*vE),line(TOKYO[0],TOKYO[1],OSAKA[0],OSAKA[1],{color:C.dim,w:2,dash:'6 8'})+label('直線 約 400 km',(TOKYO[0]+OSAKA[0])/2-60,(TOKYO[1]+OSAKA[1])/2-40,{size:24,color:XC,anchor:'middle',weight:700}));
  const sx=mix(TOKYO[0],OSAKA[0],u),sy=mix(TOKYO[1],OSAKA[1],u),ang=Math.atan2(OSAKA[1]-TOKYO[1],OSAKA[0]-TOKYO[0]);
  if(u>0)s+=draw([[TOKYO[0],TOKYO[1]],[sx,sy]],1,{color:VC,w:6,opacity:.85});
  if(u>0&&u<1)for(let i=1;i<=4;i++)s+=dot(sx-Math.cos(ang)*i*14,sy-Math.sin(ang)*i*14,10-i*2,VC,.5);
  if(u>0)s+=dot(sx,sy,13,HC)+ring(sx,sy,20,{color:HC,w:3});
  // 右：秒速 → 経過時間
  s+=card(760,50,400,150,label('秒速',960,100,{size:28,color:C.dim,anchor:'middle'})+label('約 3.9 km',960,170,{size:52,color:VC,anchor:'middle',weight:700}),T(0,.4),VC);
  const sec=Math.round(u*103);
  s+=card(760,230,400,150,label('東京 → 大阪',960,280,{size:28,color:C.dim,anchor:'middle'})+label(`${Math.floor(sec/60)}分 ${String(sec%60).padStart(2,'0')}秒`,960,350,{size:52,color:TC,anchor:'middle',weight:700}),T(.4*vE,.5*vE),TC);
  s+=fade(T(vE+.3,vE+.7),label('2分 かからない',960,440,{size:40,color:HC,anchor:'middle',weight:700}));
  s+=fade(T(vE+.5,vE+.9),label('（400 ÷ 3.9 ≒ 103 秒）',960,490,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 // v2 の「この2つが、この後の主役」の札を隠し、「時計を 狂わせる 犯人」にする
 [K+'bridge']:(p,ctx)=>{
  let s=V2['sp-gps2-2:two'](p,ctx);
  s+=rect(0,425,1200,90,{fill:C.bg,fo:1,stroke:C.bg,rx:0});
  s+=fade(seg(p,.55,.7),label('時計を 狂わせる 犯人',470,478,{size:36,color:HC,anchor:'middle',weight:700}));
  return s;
 },
});

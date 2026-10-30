// 大学編「剛体の回転・上級・要点」(ys-uc-rigid2-summary) — 図。Stage 1200×515.
// 詳しい動画 uc-rigid2-1・2 の図をそのまま呼び出す（同じ数値・同じ色）。締めのカードだけ ここで描く。
import {C,seg,label} from './anim.mjs';
import {card} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {ytUcRigid21Diagrams as A1} from './yt1-uc-rigid2-1-diagrams.mjs';
import {ytUcRigid22Diagrams as A2} from './yt1-uc-rigid2-2-diagrams.mjs';

const K='uc-rigid2-summary:';
const get=(A,id)=>k=>{const f=A[id+':'+k];if(!f)throw new Error('missing '+id+':'+k);return f;};
const u1=get(A1,'uc-rigid2-1'),u2=get(A2,'uc-rigid2-2');

export const ytUcRigid2SummaryDiagrams={
 [K+'goal']:u1('sum3'),
 [K+'goal2']:u1('vform'),
 [K+'goal3']:u1('KL2'),
 [K+'goal4']:u2('result'),
 [K+'vform']:u2('vform'),
 [K+'seesaw']:u2('seesaw'),
 [K+'race']:u1('race'),
 [K+'race2']:u1('race2'),
 [K+'num1']:u1('num1'),
 [K+'num2']:u1('num2'),
 [K+'K2']:u1('K2'),
 [K+'Weq']:u1('Weq'),
 [K+'diskG']:u2('diskG'),
 [K+'diskP2']:u2('diskP2'),
 [K+'wrong']:u2('wrong'),
 [K+'wrong2']:(p,ctx)=>u2('wrong')(1,ctx),
 [K+'sum']:u2('sum'),
 // この要点版には冒頭の予想がないので、1/2 の back（冒頭の予想のカード）ではなく K＝L²/(2I) の完成した式を出す。
 [K+'back']:(p,ctx)=>u1('KL2')(1,ctx),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

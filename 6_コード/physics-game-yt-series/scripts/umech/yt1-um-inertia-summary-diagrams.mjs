// 大学編「慣性モーメント・中級・要点」(ys-um-inertia-summary) — 図。Stage 1200×515.
// 詳しい動画 1/2・2/2 の図をそのまま呼び出す（同じ数値・同じ色）。よくある間違い・締めのカードだけ ここで描く。
import {C,seg,fade,label,tex} from './anim.mjs';
import {card} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {ytUmInertia1Diagrams as M1} from './yt1-um-inertia-1-diagrams.mjs';
import {ytUmInertia2Diagrams as M2} from './yt1-um-inertia-2-diagrams.mjs';

const K='um-inertia-summary:';
const get=(M,id)=>k=>{const f=M[id+':'+k];if(!f)throw new Error('missing '+id+':'+k);return f;};
const u1=get(M1,'um-inertia-1'),u2=get(M2,'um-inertia-2');
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
const RR=`{\\color{${C.x}}r}`,WW=`{\\color{${C.p}}\\omega}`,KK=`{\\color{${C.E}}K}`,VV=`{\\color{${C.v}}v}`;
// 理由の図：v＝rω を ½mv² に入れると r が2回（1/2 の twice の式部分だけ。数値の棒グラフは使わない）
function why(p){
 let s=T(`${VV}=${RR}${WW}`,600,90,{size:46});
 s+=fade(seg(p,.15,.3),T(`${KK}=\\tfrac12 m${VV}^2=\\tfrac12 m(${RR}${WW})^2`,600,210,{size:50}));
 s+=fade(seg(p,.45,.6),T(`=\\tfrac12 m\\,{\\color{${C.hi}}${RR}^2}\\,${WW}^2`,600,330,{size:54}));
 s+=fade(seg(p,.65,.8),label('r が 2回 効く',600,450,{size:34,color:C.hi,anchor:'middle',weight:700}));
 return s;
}

export const ytUmInertiaSummaryDiagrams={
 [K+'goal']:u1('sum1'),
 [K+'rot']:u1('sum2'),
 [K+'cont']:u2('sum2'),
 [K+'why']:why,
 [K+'factor']:u1('factor'),
 [K+'name']:u1('name'),
 [K+'rod']:u2('rod'),
 [K+'four']:u2('four'),
 [K+'sum4']:u2('sum4'),
 [K+'eight']:u2('eight'),
 [K+'dx']:u2('dx'),
 [K+'Idef']:u2('Idef'),
 [K+'result']:u2('result'),
 [K+'plug']:u2('plug'),
 [K+'wrong']:(p)=>card(200,100,800,270,label('よくある間違い',600,170,{size:30,color:C.a,anchor:'middle',weight:700})+label('I も 質量 m のように',600,250,{size:34,color:C.ink,anchor:'middle'})+label('物体だけで 決まる？',600,315,{size:34,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.a),
 [K+'perp']:u2('perp'),
 [K+'quizA']:u2('quizA'),
 [K+'quizB']:u2('quizB'),
 [K+'sum']:(p)=>u2('sum1')(.3+.7*p),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

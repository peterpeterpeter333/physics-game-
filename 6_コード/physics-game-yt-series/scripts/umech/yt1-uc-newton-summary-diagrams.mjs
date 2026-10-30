// 大学編「運動方程式・上級・要点」(ys-uc-newton-summary) — 図。Stage 1200×515.
// 詳しい動画 1/1 の図をそのまま呼び出す（同じ数値・同じ色）。よくある間違い・締めのカードだけ ここで描く。
import {C,seg,label} from './anim.mjs';
import {card} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {ytUcNewton1Diagrams as U1} from './yt1-uc-newton-1-diagrams.mjs';

const K='uc-newton-summary:';
const u=k=>{const f=U1['uc-newton-1:'+k];if(!f)throw new Error('missing uc-newton-1:'+k);return f;};

export const ytUcNewtonSummaryDiagrams={
 [K+'goal']:u('film'),
 [K+'goal2']:u('film2'),
 [K+'kinds']:u('kinds'),
 [K+'force']:u('force'),
 [K+'indep']:u('indep'),
 [K+'setup']:u('init'),
 [K+'combine']:u('combine'),
 [K+'top']:u('top'),
 [K+'land']:u('land'),
 [K+'sub']:u('sub'),
 [K+'d2']:u('d2'),
 [K+'t0']:u('t0'),
 [K+'wrong']:(p)=>card(220,100,760,270,label('よくある間違い',600,170,{size:30,color:C.a,anchor:'middle',weight:700})+label('方程式を 満たせば、正しい 解？',600,270,{size:36,color:C.ink,anchor:'middle'}),seg(p,.03,.18),C.a),
 [K+'three']:u('three'),
 [K+'recipe']:u('recipe'),
 [K+'notconst']:u('notconst'),
 [K+'cannot']:u('cannot'),
 [K+'model']:u('model'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

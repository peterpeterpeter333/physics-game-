// 大学編「剛体の回転・中級・要点」(ys-um-rotation-summary) — 図。Stage 1200×515.
// 詳しい動画 um-rotation-1・2 の図をそのまま呼び出す（同じ数値・同じ色）。よくある間違い・まとめ・締めのカードだけ ここで描く。
import {C,seg,label,fade} from './anim.mjs';
import {card,T} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {ytUmRotation1Diagrams as A1} from './yt1-um-rotation-1-diagrams.mjs';
import {ytUmRotation2Diagrams as A2} from './yt1-um-rotation-2-diagrams.mjs';

const K='um-rotation-summary:';
const get=(A,id)=>k=>{const f=A[id+':'+k];if(!f)throw new Error('missing '+id+':'+k);return f;};
const u1=get(A1,'um-rotation-1'),u2=get(A2,'um-rotation-2');

export const ytUmRotationSummaryDiagrams={
 [K+'goal']:u1('pair'),
 [K+'goal2']:u1('sum2'),
 [K+'goal3']:u2('sum1'),
 [K+'goal4']:u2('sum2'),
 [K+'why']:u1('why'),
 [K+'mulr']:u1('mulr'),
 [K+'iaN']:u1('iaN'),
 [K+'sum']:u1('sum'),
 [K+'bottom']:u2('bottom'),
 [K+'exA']:u1('exA'),
 [K+'num']:u2('num'),
 [K+'box']:u2('box'),
 [K+'race']:u2('race'),
 [K+'bars']:u2('bars'),
 [K+'wrong']:(p)=>card(200,100,800,270,label('よくある間違い',600,170,{size:30,color:C.a,anchor:'middle',weight:700})+label('接地点の速度が 0 だから',600,250,{size:34,color:C.ink,anchor:'middle'})+label('車輪は 丸ごと 止まっている？',600,315,{size:34,color:C.ink,anchor:'middle'}),seg(p,.03,.18),C.a),
 [K+'instant']:u2('instant'),
 [K+'friction']:u2('friction'),
 [K+'sum2']:(p)=>card(150,80,900,330,label('固定した軸',600,145,{size:28,color:C.dim,anchor:'middle'})+T(`I{\\color{${C.a}}\\alpha}=N`,520,205,{size:40})+label('（回転版の ma ＝ F）',640,215,{size:28,color:C.ink})
   +fade(seg(p,.3,.45),label('転がり ＝ 並進 ＋ 回転',600,280,{size:32,color:C.ink,anchor:'middle'})+T(`{\\color{${C.E}}K}=\\tfrac12 M{\\color{${C.v}}v}^2+\\tfrac12 I{\\color{${C.p}}\\omega}^2`,600,350,{size:40})),seg(p,.03,.18),C.hi),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

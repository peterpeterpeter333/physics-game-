// 大学編「運動量・初級・要点」(ys-ui-momentum-summary) — 図。Stage 1200×515.
// 詳しい動画 1/1 の図をそのまま呼び出す（同じ数値・同じ色）。よくある間違い・締めのカードだけ ここで描く。
import {C,seg,label} from './anim.mjs';
import {card} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {ytUiMomentum1Diagrams as M1} from './yt1-ui-momentum-1-diagrams.mjs';

const K='ui-momentum-summary:';
const u=k=>{const f=M1['ui-momentum-1:'+k];if(!f)throw new Error('missing ui-momentum-1:'+k);return f;};

export const ytUiMomentumSummaryDiagrams={
 [K+'goal']:(p)=>u('sum')(.2+.8*p),
 [K+'frame']:u('frame'),
 [K+'law']:u('law'),
 [K+'derive']:u('derive'),
 [K+'derive2']:u('derive2'),
 [K+'calc']:u('calc'),
 [K+'sign']:u('sign'),
 [K+'push']:u('push'),
 [K+'name']:u('name'),
 [K+'check']:u('check'),
 [K+'graph']:u('graph'),
 [K+'shapes']:u('shapes'),
 [K+'same']:u('same'),
 [K+'wrong']:(p)=>card(200,100,800,270,label('よくある間違い',600,170,{size:30,color:C.a,anchor:'middle',weight:700})+label('運動量と 運動エネルギーは',600,250,{size:34,color:C.ink,anchor:'middle'})+label('同じような量？',600,315,{size:34,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.a),
 [K+'ke']:u('ke'),
 [K+'quizans']:u('quizans'),
 [K+'ke2']:u('ke2'),
 [K+'sum']:u('sum'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

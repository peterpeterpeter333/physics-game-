// 大学編「運動量・上級・要点」(ys-uc-momentum-summary) — 図。Stage 1200×515.
// 詳しい動画 1/2・2/2 の図をそのまま呼び出す（同じ数値・同じ色）。よくある間違い・締めのカードだけ ここで描く。
import {C,seg,label} from './anim.mjs';
import {card} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {ytUcMomentum1Diagrams as M1} from './yt1-uc-momentum-1-diagrams.mjs';
import {ytUcMomentum2Diagrams as M2} from './yt1-uc-momentum-2-diagrams.mjs';

const K='uc-momentum-summary:';
const get=(M,id)=>k=>{const f=M[id+':'+k];if(!f)throw new Error('missing '+id+':'+k);return f;};
const u1=get(M1,'uc-momentum-1'),u2=get(M2,'uc-momentum-2');

export const ytUcMomentumSummaryDiagrams={
 [K+'goal']:(p)=>u1('sum')(.2+.8*p),
 [K+'cons']:u1('sum2'),
 [K+'collide']:(p)=>u2('sum')(.2+.8*p),
 [K+'cancel']:u1('cancel'),
 [K+'result']:u1('result'),
 [K+'ex']:u1('ex'),
 [K+'calc']:u1('calc'),
 [K+'unk2']:u2('unk2'),
 [K+'def']:u2('def'),
 [K+'num2']:u2('num2'),
 [K+'tab']:u2('tab'),
 [K+'wrong']:(p)=>card(200,100,800,270,label('よくある間違い',600,170,{size:30,color:C.a,anchor:'middle',weight:700})+label('運動量が 保存するなら',600,250,{size:34,color:C.ink,anchor:'middle'})+label('運動エネルギーも 保存する？',600,315,{size:34,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.a),
 [K+'ke']:u1('ke'),
 [K+'heat']:u1('heat'),
 [K+'work']:u1('work'),
 [K+'kin']:u2('kin'),
 [K+'sum']:(p)=>u2('sum')(.2+.8*p),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

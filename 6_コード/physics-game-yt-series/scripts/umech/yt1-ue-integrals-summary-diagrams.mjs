// 大学編「線積分と面積分・上級・要点」(ys-ue-integrals-summary) — 図。Stage 1200×515.
// 詳しい動画 1/4〜4/4 の図をそのまま呼び出す（同じ数値・同じ色：𝐄 水色、∂𝐬/∂u 黄、∂𝐬/∂v 紫、法線 桃）。
// よくある間違い・締めのカードだけ ここで描く。
import {C,seg,fade,label} from './anim.mjs';
import {card} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {T,cc} from './yt1-ue-integrals-1-diagrams.mjs';
import {ytUeIntegrals1Diagrams as M1} from './yt1-ue-integrals-1-diagrams.mjs';
import {ytUeIntegrals3Diagrams as M3} from './yt1-ue-integrals-3-diagrams.mjs';
import {ytUeIntegrals4Diagrams as M4} from './yt1-ue-integrals-4-diagrams.mjs';

const K='ue-integrals-summary:';
const get=(M,id)=>k=>{const f=M[id+':'+k];if(!f)throw new Error('missing '+id+':'+k);return f;};
const u1=get(M1,'ue-integrals-1'),u3=get(M3,'ue-integrals-3'),u4=get(M4,'ue-integrals-4');

export const ytUeIntegralsSummaryDiagrams={
 [K+'goal']:u1('dr'),
 // 4/4 の dA の図に、𝐬ᵤ・𝐬ᵥ が偏微分の略記であることを足す（字幕は ∂𝐬/∂u の形で読むため）
 [K+'face']:(p)=>u4('dA')(p)+fade(seg(p,.7,.85),T(`${cc(C.hi,'\\mathbf{s}_u')}=\\partial\\mathbf{s}/\\partial u,\\quad ${cc(C.v,'\\mathbf{s}_v')}=\\partial\\mathbf{s}/\\partial v`,890,395,30)),
 [K+'pot']:u3('any'),
 [K+'why1']:u1('dr'),
 [K+'why2']:u4('sv'),
 [K+'why3']:u3('sum'),
 [K+'promise']:u1('promise'),
 [K+'tangent2']:u1('tangent2'),
 [K+'dot3']:u1('dot3'),
 [K+'int']:u1('int'),
 [K+'result']:u1('result'),
 [K+'coords']:u4('coords'),
 [K+'sphere']:u4('dAs'),
 [K+'area']:u4('result'),
 [K+'wrong']:(p)=>card(200,100,800,270,label('よくある間違い',600,170,{size:30,color:C.a,anchor:'middle',weight:700})+label('場所で 変わる 電場の 電気束を',600,250,{size:34,color:C.ink,anchor:'middle'})+label('一番強い値 × 面積 で？',600,315,{size:34,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.a),
 [K+'dot']:u4('dot'),
 [K+'stack']:u4('stack'),
 [K+'num']:u4('num'),
 [K+'tri']:u4('tri'),
 [K+'sum']:u4('sum'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

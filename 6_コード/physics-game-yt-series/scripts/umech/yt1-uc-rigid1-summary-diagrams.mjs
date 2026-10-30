// 大学編「慣性モーメント・上級・要点」(ys-uc-rigid1-summary) — 図。Stage 1200×515.
// 詳しい動画 1/3・2/3・3/3 の図をそのまま呼び出す（同じ数値・同じ色）。よくある間違い・締めのカードだけ ここで描く。
import {C,seg,fade,label} from './anim.mjs';
import {card,T,cc} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {L,boxT} from './yt1-uc-shm-1-diagrams.mjs';
import {ytUcRigid11Diagrams as M1} from './yt1-uc-rigid1-1-diagrams.mjs';
import {ytUcRigid12Diagrams as M2} from './yt1-uc-rigid1-2-diagrams.mjs';
import {ytUcRigid13Diagrams as M3} from './yt1-uc-rigid1-3-diagrams.mjs';

const K='uc-rigid1-summary:';
const get=(M,id)=>k=>{const f=M[id+':'+k];if(!f)throw new Error('missing '+id+':'+k);return f;};
const u1=get(M1,'uc-rigid1-1'),u2=get(M2,'uc-rigid1-2'),u3=get(M3,'uc-rigid1-3');

// 理由の図：中央の項 2d×Σmᵢxᵢ は、重心が原点なので 0（3/3 の second・zero と同じ式。画面に下線表記を出さない）
const mi='m_i',xi=cc(C.x,'x_i');
function zero(p){
 let s=T(`I=I_G+${cc(C.a,`2d\\sum ${mi}${xi}`)}+Md^2`,600,100,{size:46});
 s+=fade(seg(p,.15,.3),L('中央の 項',600,190,{size:28,color:C.a,weight:700}));
 s+=fade(seg(p,.45,.6),L('重心を 原点に とる →',600,290,{size:30,color:C.hi}));
 s+=fade(seg(p,.6,.75),boxT(`\\sum ${mi}${xi}=0`,600,410,50,1,C.a));
 return s;
}
// 数値例：端の軸は 重心から d＝1 m（3/3 の rodnum と同じ式。「最初の問い」の文言は使わない）
function endnum(p){
 let s=L('端の 軸 ： 重心から d ＝ 1 m',600,110,{size:32,color:C.ink});
 s+=fade(seg(p,.25,.4),T(`I=1+3\\times1^2=4\\,\\mathrm{kg\\cdot m^2}`,600,250,{size:52}));
 s+=fade(seg(p,.55,.7),L('重心の 軸の I ＋ Md²',600,380,{size:30,color:C.hi,weight:700}));
 return s;
}

// 数値例：円板と球（1/3 num・2/3 num と同じ数値。字幕の順に 円板 → 球）
function num(p){
 let s=L('M ＝ 2 kg、 R ＝ 0.3 m',600,80,{size:30,color:C.dim});
 s+=card(250,120,700,130,L('円板',600,165,{size:26,color:C.dim})+T(`I=\\tfrac12\\times2\\times0.3^2=0.09\\,\\mathrm{kg\\cdot m^2}`,600,225,{size:40}),seg(p,.05,.2),C.x);
 s+=card(250,280,700,130,L('球',600,325,{size:26,color:C.dim})+T(`I=0.4\\times2\\times0.3^2=0.072\\,\\mathrm{kg\\cdot m^2}`,600,385,{size:40}),seg(p,.35,.5),C.E);
 return s;
}

export const ytUcRigid1SummaryDiagrams={
 [K+'goal']:u1('table'),
 [K+'sphere']:u2('sum2'),
 [K+'parallel']:u3('result'),
 [K+'steps']:u1('steps'),
 [K+'coef']:u2('bars'),
 [K+'zero']:zero,
 [K+'rings']:u1('rings'),
 [K+'subst']:u1('subst'),
 [K+'half']:u1('half'),
 [K+'frac']:u2('frac'),
 [K+'res']:u2('res'),
 [K+'rodnum']:u1('rodnum'),
 [K+'endnum']:endnum,
 [K+'match']:u3('rodcalc'),
 [K+'num']:num,
 [K+'wrong']:(p)=>card(200,100,800,270,label('よくある間違い',600,170,{size:30,color:C.a,anchor:'middle',weight:700})+label('平行軸の定理を',600,250,{size:34,color:C.ink,anchor:'middle'})+label('重心を 通らない 軸の 値から？',600,315,{size:34,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.a),
 [K+'caution']:u3('caution'),
 [K+'caution2']:u3('caution2'),
 [K+'sum']:(p)=>u3('sum1')(.3+.7*p),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

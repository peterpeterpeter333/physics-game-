// 大学編「運動量・中級・要点」(ys-um-momentum-change-summary) — 図。Stage 1200×515.
// 詳しい動画 1/2・2/2 の図をそのまま呼び出す（同じ数値・同じ色）。平均の力のカード・よくある間違い・締めのカードだけ ここで描く。
import {C,seg,label} from './anim.mjs';
import {card} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {ytUmMomentumChange1Diagrams as M1} from './yt1-um-momentum-change-1-diagrams.mjs';
import {ytUmMomentumChange2Diagrams as M2} from './yt1-um-momentum-change-2-diagrams.mjs';

const K='um-momentum-change-summary:';
const get=(M,id)=>k=>{const f=M[id+':'+k];if(!f)throw new Error('missing '+id+':'+k);return f;};
const u1=get(M1,'um-momentum-change-1'),u2=get(M2,'um-momentum-change-2');

// 2/2 のまとめカードの下2行（平均の力・時間を延ばす）と同じ書き方。数値は出さない。
function avgCards(p){
 const R=[['平均の力','F平均 ＝ Δp/Δt（面積 ÷ 幅）',C.F,seg(p,.0,.12)],['時間を延ばす','同じ Δp なら 力が 小さい',C.t,seg(p,.4,.55)]];
 return R.map(([h,b,c,g],i)=>card(90,120+i*140,1020,105,label(h,130,183+i*140,{size:32,color:c,weight:700})+label(b,380,183+i*140,{size:32,color:C.ink}),g,c)).join('');
}

export const ytUmMomentumChangeSummaryDiagrams={
 [K+'goal']:u1('derive3'),
 [K+'area']:u1('area'),
 [K+'avg']:(p)=>avgCards(p),
 [K+'leak']:u1('leak'),
 [K+'dt']:u1('dt'),
 [K+'integral']:u1('integral'),
 [K+'setup']:u2('setup'),
 [K+'vi']:u2('vi'),
 [K+'numline']:u2('numline'),
 [K+'dp']:u2('dp'),
 [K+'avgcalc']:u2('avgcalc'),
 [K+'softA']:u2('softA'),
 [K+'two']:u2('two'),
 [K+'airbag']:u2('airbag'),
 [K+'wrongcard']:(p)=>card(200,100,800,270,label('よくある間違い',600,170,{size:30,color:C.a,anchor:'middle',weight:700})+label('跳ね返りの 速度の変化を',600,250,{size:34,color:C.ink,anchor:'middle'})+label('速さだけで 20 − 20 ＝ 0？',600,315,{size:34,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.a),
 [K+'wrong']:u2('wrong'),
 [K+'sign']:u2('sum1'),
 [K+'sum']:(p)=>M2['um-momentum-change-2:sum2'](1),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

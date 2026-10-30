// 大学編「剛体の回転・初級・要点」(ys-ui-rotation-summary) — 図。Stage 1200×515.
// 詳しい動画 ui-rotation-1 の図をそのまま呼び出す（同じ数値・同じ色）。締めのカードだけ ここで描く。
import {C,seg,label} from './anim.mjs';
import {card} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {ytUiRotation1Diagrams as A1} from './yt1-ui-rotation-1-diagrams.mjs';

const K='ui-rotation-summary:';
const u=k=>{const f=A1['ui-rotation-1:'+k];if(!f)throw new Error('missing ui-rotation-1:'+k);return f;};

export const ytUiRotationSummaryDiagrams={
 [K+'goal']:u('sum'),
 // 結論の時点では数値例（0.5 m×4 rad/s）をまだ出さないので、sum2 の数値の行が出る前で止める。
 [K+'goal2']:(p,ctx)=>u('sum2')(Math.min(p,.38),ctx),
 // 結論では「mgh＝½mv² だけで求めない」の行（間違いの節で話す）をまだ出さない。
 [K+'goal3']:(p,ctx)=>u('sum3')(Math.min(p,.44),ctx),
 [K+'paint']:u('paint'),
 [K+'trace']:u('trace'),
 [K+'center']:u('center'),
 [K+'omegaT']:u('omegaT'),
 [K+'derive']:u('derive'),
 [K+'wheel']:u('wheel'),
 [K+'calc']:u('calc'),
 [K+'unit']:u('unit'),
 [K+'check']:u('check'),
 [K+'quiz2']:u('quiz2'),
 [K+'warn']:u('warn'),
 [K+'U']:u('U'),
 [K+'slide']:u('slide'),
 [K+'split']:u('split'),
 [K+'share']:u('share'),
 [K+'sum']:u('sum2'),
 [K+'sum3']:u('sum3'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

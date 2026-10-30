// 大学編「角運動量・中級・要点」(ys-um-angular-summary) — 図。Stage 1200×515.
// 詳しい動画 um-angular-1 / um-angular-2 の図をそのまま呼び出す（同じ数値・同じ色）。よくある間違い・締めのカードだけ ここで描く。
import {C,seg,label} from './anim.mjs';
import {card} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {ytUmAngular1Diagrams as M1} from './yt1-um-angular-1-diagrams.mjs';
import {ytUmAngular2Diagrams as M2} from './yt1-um-angular-2-diagrams.mjs';

const K='um-angular-summary:';
const g=(T,id)=>k=>{const f=T[id+':'+k];if(!f)throw new Error('missing '+id+':'+k);return f;};
const u1=g(M1,'um-angular-1'),u2=g(M2,'um-angular-2');

export const ytUmAngularSummaryDiagrams={
 [K+'goal']:u2('def'),
 [K+'size']:u2('size'),
 [K+'basept']:u1('three'),
 [K+'fix']:u1('fix'),
 [K+'why']:u1('nowork'),
 [K+'perangle']:u1('perangle'),
 [K+'so']:u1('so'),
 [K+'circle']:u2('circle'),
 [K+'perp']:u2('perp'),
 [K+'mrv']:u2('mrv'),
 [K+'big']:u2('three'),
 [K+'wrongcard']:(p)=>card(200,100,800,270,label('よくある間違い',600,170,{size:30,color:C.a,anchor:'middle',weight:700})+label('𝐫 と 𝐯 が 直角でなくても',600,250,{size:34,color:C.ink,anchor:'middle'})+label('L ＝ mrv ？',600,315,{size:36,color:C.ink,anchor:'middle'}),seg(p,.03,.18),C.a),
 [K+'tilt']:u2('tilt'),
 [K+'split']:u2('split'),
 [K+'calc']:u2('calc'),
 [K+'wrong']:u2('wrong'),
 [K+'ellipse']:u2('ellipse'),
 [K+'sum1']:u2('sum1'),
 [K+'sum2']:u2('sum2'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

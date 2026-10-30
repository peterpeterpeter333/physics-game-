// 大学編「角運動量・上級・要点」(ys-uc-angular-summary) — 図。Stage 1200×515.
// 詳しい動画 uc-angular-1 / uc-angular-2 の図をそのまま呼び出す（同じ数値・同じ色）。よくある間違い・締めのカードだけ ここで描く。
import {C,seg,label} from './anim.mjs';
import {card} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {ytUcAngular1Diagrams as U1} from './yt1-uc-angular-1-diagrams.mjs';
import {ytUcAngular2Diagrams as U2} from './yt1-uc-angular-2-diagrams.mjs';

const K='uc-angular-summary:';
const g=(T,id)=>k=>{const f=T[id+':'+k];if(!f)throw new Error('missing '+id+':'+k);return f;};
const u1=g(U1,'uc-angular-1'),u2=g(U2,'uc-angular-2');
const two=(f,h,s)=>(p,ctx)=>p<s?f(p/s,ctx):h((p-s)/(1-s),ctx);

export const ytUcAngularSummaryDiagrams={
 [K+'goal']:u1('pair'),
 [K+'cond']:u1('cond'),
 [K+'many']:u1('sum2'),
 [K+'central']:u2('Lconst'),
 [K+'why']:u1('result'),
 [K+'terms']:two(u1('para'),u1('NN'),.45),
 [K+'sin']:u2('sin'),
 [K+'area']:two(u2('area'),u2('Lm'),.5),
 [K+'const']:u2('const'),
 [K+'ex']:u1('ex'),
 [K+'Lval']:u1('Lval2'),
 [K+'Nval']:two(u1('push'),u1('Nval'),.45),
 [K+'pred']:u1('pred'),
 [K+'check']:u1('check'),
 [K+'check2']:u1('check2'),
 [K+'wrongcard']:(p)=>card(200,100,800,270,label('よくある間違い',600,170,{size:30,color:C.a,anchor:'middle',weight:700})+label('トルクが 0 なら 力も 0？',600,250,{size:34,color:C.ink,anchor:'middle'})+label('まっすぐ 同じ速さで 進む？',600,315,{size:34,color:C.ink,anchor:'middle'}),seg(p,.03,.18),C.a),
 [K+'notzero']:u2('notzero'),
 [K+'ellipse']:u2('ellipse'),
 [K+'sum']:two(u1('sum'),u2('sum2'),.4),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

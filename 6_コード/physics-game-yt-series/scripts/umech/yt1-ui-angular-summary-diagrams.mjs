// 大学編「角運動量・初級・要点」(ys-ui-angular-summary) — 図。Stage 1200×515.
// 詳しい動画 ui-angular-1 の図をそのまま呼び出す（同じ数値・同じ色）。よくある間違い・締めのカードだけ ここで描く。
import {C,seg,label} from './anim.mjs';
import {card} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {ytUiAngular1Diagrams as A1} from './yt1-ui-angular-1-diagrams.mjs';

const K='ui-angular-summary:';
const u=k=>{const f=A1['ui-angular-1:'+k];if(!f)throw new Error('missing ui-angular-1:'+k);return f;};
// 押す位置が動く途中（0.3 m・0.6 m など）で N の表示が丸められて式と合わなくなるので、移動の途中は飛ばして 0.2→0.4→0.8 m の3点だけ見せる。
const slideJump=p=>p>=.3&&p<.4?(p<.35?.299:.4):p>=.6&&p<.72?(p<.66?.599:.72):p;
const two=(f,g,s)=>(p,ctx)=>p<s?f(p/s,ctx):g((p-s)/(1-s),ctx);

export const ytUiAngularSummaryDiagrams={
 [K+'goal']:u('sum'),
 [K+'sum2']:u('sum2'),
 [K+'vec']:u('vec'),
 [K+'screw']:u('screw'),
 [K+'why']:two(u('same'),u('arc'),.5),
 [K+'perrad2']:u('perrad2'),
 [K+'door']:u('door'),
 [K+'fix']:u('fix'),
 [K+'slide']:(p,ctx)=>u('slide')(slideJump(p),ctx),
 [K+'prop']:u('prop'),
 [K+'inv']:u('inv'),
 [K+'inv2']:u('inv2'),
 [K+'wrong']:(p)=>card(200,100,800,270,label('よくある間違い',600,170,{size:30,color:C.a,anchor:'middle',weight:700})+label('斜めに 押しても',600,250,{size:34,color:C.ink,anchor:'middle'})+label('r と F を そのまま 掛ける？',600,315,{size:34,color:C.ink,anchor:'middle'}),seg(p,.03,.18),C.a),
 [K+'ex']:u('ex'),
 [K+'ex2']:u('ex2'),
 [K+'zero']:u('zero'),
 [K+'L']:u('L'),
 [K+'L2']:u('L2'),
 [K+'sum']:u('sum'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

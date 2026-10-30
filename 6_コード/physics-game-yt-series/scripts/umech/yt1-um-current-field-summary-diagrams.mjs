// 大学編「アンペールの法則・中級・要点」(ys-um-current-field-summary) — 図。Stage 1200×515.
// 詳しい動画 1/2・2/2 の図をそのまま呼び出す（同じ数値・同じ色：𝐁 橙、I 緑、一歩 d𝐫 金、r 白、沿う部分 黄、半径の向きの部分 桃）。
// 結論の法則カード・よくある間違い・まとめ・締めのカードだけ ここで描く。
import {C,seg,fade,label} from './anim.mjs';
import {CB,CI,cs,T,card,LAW,Ic} from './yt1-um-current-field-1-diagrams.mjs';
import {ytUmCurrentField1Diagrams as M1} from './yt1-um-current-field-1-diagrams.mjs';
import {ytUmCurrentField2Diagrams as M2} from './yt1-um-current-field-2-diagrams.mjs';

const K='um-current-field-summary:';
const get=(M,id)=>k=>{const f=M[id+':'+k];if(!f)throw new Error('missing '+id+':'+k);return f;};
const u1=get(M1,'um-current-field-1'),u2=get(M2,'um-current-field-2');
const RES=`${cs(CB,'B')}=\\dfrac{\\mu_0${Ic}}{2\\pi r}`;

export const ytUmCurrentFieldSummaryDiagrams={
 [K+'goal']:(p)=>card(200,80,800,320,
   label('定常電流のとき',600,140,{size:28,color:C.dim,anchor:'middle'})
   +T(LAW,600,250,{size:64})
   +fade(seg(p,.4,.6),label('アンペールの法則',600,360,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,.03,.2),C.hi),
 [K+'split']:u1('split'),
 [K+'sum']:u1('sum'),
 [K+'surface']:u1('surface'),
 [K+'mu']:u1('mu'),
 [K+'ccw']:u1('ccw'),
 [K+'result']:u2('hs'),
 [K+'choose']:u2('choose'),
 [K+'rdl']:u2('rdl'),
 [K+'out']:u2('out'),
 [K+'div']:u2('div'),
 [K+'mu2pi']:u2('mu2pi'),
 [K+'calc']:u2('calc'),
 [K+'ans']:u2('ans'),
 [K+'compare2']:u2('compare2'),
 [K+'wrong']:(p)=>card(200,100,800,270,label('よくある間違い',600,170,{size:30,color:C.a,anchor:'middle',weight:700})
   +label('対称な道で ないと',600,250,{size:34,color:C.ink,anchor:'middle'})+label('法則が 成り立たない？',600,315,{size:34,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.a),
 [K+'still']:u2('still'),
 [K+'splitstep']:u2('splitstep'),
 [K+'condition']:u2('condition'),
 [K+'summary']:(p)=>{
  const rows=[['法則（実験に支えられた）',T(LAW,760,0,{size:40}),C.ink],['定めた定数',T('\\mu_0\\approx 4\\pi\\times10^{-7}\\ \\mathrm{T\\cdot m/A}',760,0,{size:36}),C.ink],['導いた結果（対称性）',T(RES,760,0,{size:32}),C.hi]];
  let s='';
  rows.forEach(([a,b,c],i)=>{const y=60+i*135;s+=card(80,y,1040,112,label(a,120,y+66,{size:28,color:C.dim,weight:700})+`<g transform="translate(0,${y+56})">${b}</g>`,seg(p,.05+i*.2,.2+i*.2),i===2?C.hi:C.faint);});
  return s;
 },
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

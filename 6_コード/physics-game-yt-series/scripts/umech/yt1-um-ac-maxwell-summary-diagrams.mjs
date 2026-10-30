// 大学編「マクスウェル方程式・中級・要点」(ys-um-ac-maxwell-summary) — 図。Stage 1200×515.
// 詳しい動画 um-ac-maxwell-1・-2 の図をそのまま呼び出す（同じ向き・同じ数値・同じ色）。
// 100 Hz の比較・よくある間違い・まとめ・締めのカードだけ ここで描く（数値は詳しい動画の 63 Ω・16 Ω）。
import {C,seg,label,fade} from './anim.mjs';
import {card} from './yt1-ui-ac-waves-1-diagrams.mjs';
import {T,L,tI,tV,tC,tV0,tI0,HI} from './yt1-um-ac-maxwell-1-diagrams.mjs';
import {PH,VC} from './yt1-ui-ac-waves-1-diagrams.mjs';
import {ytUmAcMaxwell1Diagrams as M1} from './yt1-um-ac-maxwell-1-diagrams.mjs';
import {ytUmAcMaxwell2Diagrams as M2} from './yt1-um-ac-maxwell-2-diagrams.mjs';

const K='um-ac-maxwell-summary:';
const get=(M,id)=>k=>{const f=M[id+':'+k];if(!f)throw new Error('missing '+id+':'+k);return f;};
const a=get(M1,'um-ac-maxwell-1'),b=get(M2,'um-ac-maxwell-2');

const base={
 [K+'goal']:a('setup'),
 [K+'coil']:a('sum2'),
 [K+'cap']:(p)=>{// 詳しい動画 1/2 'sum2' と同じ並び：コンデンサ版（2/2 'ratio'・'lag' の内容）
  let s=card(90,90,480,280,L('振幅の比',330,155,{size:30,weight:700})+T(`\\dfrac{${tV0}}{${tI0}}=\\dfrac{1}{\\omega ${tC}}`,330,265,{size:56}),seg(p,.02,.18),HI);
  s+=card(630,90,480,280,L('位相',870,155,{size:30,color:PH,weight:700})+L('電圧が 電流より',870,235,{size:28,color:VC})+L('π/2 遅れる',870,300,{size:38,color:PH,weight:700}),seg(p,.3,.45),PH);
  return s;
 },
 [K+'imp']:a('imp'),
 [K+'four']:b('sum2'),
 [K+'added']:b('added'),
 [K+'diff']:a('diff'),
 [K+'lead']:a('lead'),
 [K+'divide']:b('divide'),
 [K+'fill']:b('fill'),
 [K+'disp']:b('disp'),
 [K+'w']:a('w'),
 [K+'V']:a('V'),
 [K+'num2']:b('num'),
 [K+'double']:(p)=>{
  let s=label('100 Hz（周波数 2倍）',600,70,{size:32,color:C.hi,anchor:'middle',weight:700});
  s+=card(110,130,460,250,label('コイル',340,190,{size:30,color:C.dim,anchor:'middle',weight:700})+T(`\\omega L\\approx 63\\,\\Omega`,340,280,{size:46})+label('2倍',340,350,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.25));
  s+=card(630,130,460,250,label('コンデンサ',860,190,{size:30,color:C.dim,anchor:'middle',weight:700})+T(`\\dfrac{1}{\\omega ${tC}}\\approx 16\\,\\Omega`,860,280,{size:46})+label('半分',860,350,{size:28,color:C.ink,anchor:'middle'}),seg(p,.3,.5));
  s+=label('50 Hz では 約31 Ω と 約32 Ω',600,450,{size:28,color:C.dim,anchor:'middle'});
  return s;
 },
 [K+'contrast']:b('contrast'),
 [K+'wrong']:(p)=>card(200,100,800,270,label('よくある間違い',600,170,{size:30,color:C.a,anchor:'middle',weight:700})
   +label('ωL の単位は Ω だから',600,250,{size:34,color:C.ink,anchor:'middle'})+label('コイルも 熱を出す？',600,315,{size:34,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.a),
 [K+'heat']:a('heat'),
 [K+'summary']:(p)=>sumCard(p,0),
 [K+'summary2']:(p)=>sumCard(1,seg(p,.02,.25)),
};
function sumCard(p,q){
  const rows=[['基本の法則','4本（実験と 電荷の保存に合う。証明ではない）',C.ink,null],
   ['導いた結果',null,C.hi,null]];
  let s='';
  rows.forEach(([h,t,c,tx],i)=>{const y=90+i*170;if(i===1&&q<=0)return;
   s+=card(80,y,1040,140,label(h,120,y+82,{size:28,color:C.dim,weight:700})+(t?label(t,330,y+84,{size:30,color:c,weight:700}):''),(i===1?q:seg(p,.05,.2)),i===1?C.hi:C.faint);});
  const g=q;
  if(g>0){s+=fade(g,T(`\\omega L`,420,90+170+64,{size:42})+label('π/2 進む',560,90+170+84,{size:28,color:C.ink})
   +T(`\\dfrac{1}{\\omega ${tC}}`,800,90+170+64,{size:42})+label('π/2 遅れる',900,90+170+84,{size:28,color:C.ink}));}
  return s;
}
const extra={
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
export const ytUmAcMaxwellSummaryDiagrams={...base,...extra};

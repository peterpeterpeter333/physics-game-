// 大学編「交流と波・初級・要点」(ys-ui-ac-waves-summary) — 図。Stage 1200×515.
// 詳しい動画 ui-ac-waves-1・-2 の図をそのまま呼び出す（同じ向き・同じ数値・同じ色）。
// よくある間違い・まとめ・締めのカードだけ ここで描く。
import {C,seg,label,tex} from './anim.mjs';
import {card,cs,TC,WC} from './yt1-ui-ac-waves-1-diagrams.mjs';
import {ytUiAcWaves1Diagrams as M1} from './yt1-ui-ac-waves-1-diagrams.mjs';
import {ytUiAcWaves2Diagrams as M2} from './yt1-ui-ac-waves-2-diagrams.mjs';

const K='ui-ac-waves-summary:';
const get=(M,id)=>k=>{const f=M[id+':'+k];if(!f)throw new Error('missing '+id+':'+k);return f;};
const a=get(M1,'ui-ac-waves-1'),b=get(M2,'ui-ac-waves-2');
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});

export const ytUiAcWavesSummaryDiagrams={
 [K+'goal']:a('acgraph'),
 [K+'shadow']:a('shadow'),
 [K+'formula']:a('formula'),
 [K+'ampdef']:a('ampdef'),
 [K+'Tdef']:a('Tdef'),
 [K+'hz']:a('hz'),
 [K+'rule']:b('rule'),
 [K+'lambda']:b('lambda'),
 [K+'v']:b('v'),
 [K+'EB']:b('EB'),
 [K+'f1T']:a('f1T'),
 [K+'const']:b('const'),
 [K+'moved']:b('moved'),
 [K+'strip']:a('strip'),
 [K+'calc']:a('calc'),
 [K+'dt']:b('dt'),
 [K+'pi2']:b('pi2'),
 [K+'ex']:b('ex'),
 [K+'wrong']:(p)=>card(200,100,800,270,label('よくある間違い',600,170,{size:30,color:C.a,anchor:'middle',weight:700})
   +label('50 Hz の周期は',600,250,{size:34,color:C.ink,anchor:'middle'})+label('50 秒？',600,315,{size:34,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.a),
 [K+'mistake']:a('mistake'),
 [K+'a60']:a('a60'),
 [K+'summary']:(p)=>{
  const rows=[['決めた量','周期 T・振動数 f・位相差・波長 λ',C.ink,null],
   ['導いた関係',null,C.hi,`${cs(WC,'f')}=\\dfrac{1}{${cs(TC,'T')}},\\qquad v=\\dfrac{\\lambda}{${cs(TC,'T')}}`]];
  let s='';
  rows.forEach(([h,t,c,tx],i)=>{const y=90+i*170;
   s+=card(80,y,1040,140,label(h,120,y+82,{size:28,color:C.dim,weight:700})+(t?label(t,400,y+84,{size:32,color:c,weight:700}):T(tx,720,y+70,{size:40})),seg(p,.05+i*.25,.2+i*.25),i===1?C.hi:C.faint);});
  return s;
 },
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

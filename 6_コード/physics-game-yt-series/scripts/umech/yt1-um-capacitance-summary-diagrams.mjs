// 大学編「コンデンサ・中級・要点」(ys-um-capacitance-summary) — 図。Stage 1200×515.
// 詳しい動画 um-capacitance-1（1/2）・um-capacitance-2（2/2）の図をそのまま呼び出す（同じ回路の向き・同じ数値・同じ色）。
// 字幕にない文が出ないよう、一部は進み p の上限を切って使う。よくある間違い・締めのカードだけ ここで描く。
import {C,seg,label} from './anim.mjs';
import {card} from './yt1-um-capacitance-1-diagrams.mjs';
import {ytUmCapacitance1Diagrams as M1} from './yt1-um-capacitance-1-diagrams.mjs';
import {ytUmCapacitance2Diagrams as M2} from './yt1-um-capacitance-2-diagrams.mjs';

const K='um-capacitance-summary:';
const get=(M,id)=>k=>{const f=M[id+':'+k];if(!f)throw new Error('missing '+id+':'+k);return f;};
const a=get(M1,'um-capacitance-1'),b=get(M2,'um-capacitance-2');
const cap=(f,m)=>(p,ctx)=>f(Math.min(p,m),ctx);
// 詳しい動画の「前回」（＝1/2 の回）という札は、単独で見る要点版では意味が通らないので、言い換える／消す。
const re=(f,pairs)=>(p,ctx)=>pairs.reduce((s,[a,b])=>s.split('>'+a+'<').join('>'+b+'<'),f(p,ctx));

export const ytUmCapacitanceSummaryDiagrams={
 [K+'setup']:a('setup'),
 [K+'formula']:a('formula'),
 [K+'box']:a('box'),
 [K+'cancel']:b('cancel'),
 [K+'eps']:a('eps'),
 [K+'result']:a('result'),
 [K+'between']:a('between'),
 [K+'subst']:re(b('subst'),[['前回','']]),
 [K+'meaning']:re(b('meaning'),[['E ∝ Q（前回）','E ∝ Q']]),
 [K+'numC']:b('numC'),
 [K+'numC2']:b('numC2'),
 [K+'numQ']:cap(b('numQ'),.58),      // 「前回の Q の 正体」は字幕にないので出さない
 [K+'sigma']:cap(a('num2'),.7),      // 「Q の出どころは 次回」は出さない
 [K+'check']:re(b('check'),[['前回','']]),
 [K+'wrong']:(p)=>card(200,100,800,270,label('よくある間違い',600,170,{size:30,color:C.a,anchor:'middle',weight:700})+label('Q を増やせば',600,250,{size:34,color:C.ink,anchor:'middle'})+label('容量 C も 増える？',600,315,{size:34,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.a),
 [K+'shape']:b('shape'),
 [K+'sameE']:b('sameE'),
 [K+'doubleV']:b('doubleV'),
 [K+'halfC']:b('halfC'),
 [K+'summary']:re(b('summary2'),[['前回の結果','板の間の電場']]),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

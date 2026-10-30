// 大学編「電位・中級・要点」(ys-um-electrostatic-potential-path-summary) — 図。Stage 1200×515.
// 詳しい動画 1/3・2/3・3/3 の図をそのまま呼び出す（同じ数値・同じ色：𝐄 水色、電位 V 紫、電荷 q 桃、仕事・U 橙、強調 黄、負 赤）。
// 字幕にない文が出ないよう、一部は進み p の上限を切って使う。結論・間違い・まとめ・締めのカードだけ ここで描く。
import {C,seg,fade,label} from './anim.mjs';
import {EC,VC,cs,T,card,L,vE,dr,Vt,IAB} from './yt1-um-electrostatic-potential-path-1-diagrams.mjs';
import {ytUmElectrostaticPotentialPath1Diagrams as M1} from './yt1-um-electrostatic-potential-path-1-diagrams.mjs';
import {ytUmElectrostaticPotentialPath2Diagrams as M2} from './yt1-um-electrostatic-potential-path-2-diagrams.mjs';
import {ytUmElectrostaticPotentialPath3Diagrams as M3} from './yt1-um-electrostatic-potential-path-3-diagrams.mjs';

const K='um-electrostatic-potential-path-summary:';
const get=(M,id)=>k=>{const f=M[id+':'+k];if(!f)throw new Error('missing '+id+':'+k);return f;};
const m1=get(M1,'um-electrostatic-potential-path-1'),m2=get(M2,'um-electrostatic-potential-path-2'),m3=get(M3,'um-electrostatic-potential-path-3');
const cap=(f,m)=>(p,ctx)=>f(Math.min(p,m),ctx);
const VB=Vt('V_{\\mathrm{B}}'),VA=Vt('V_{\\mathrm{A}}'),INT=`${IAB}${vE}\\cdot${dr}`,E=cs(EC,'E'),V=Vt('V'),dx=`d${cs(C.x,'x')}`;

export const ytUmElectrostaticPotentialPathSummaryDiagrams={
 [K+'goal']:(p)=>{
  let s=fade(seg(p,.05,.25),T(`${VB}-${VA}=-${INT}`,600,190,{size:76}));
  s+=fade(seg(p,.4,.6),L('電位差 ＝ 電場の 線積分 に マイナス',600,350,{size:32,color:VC,weight:700}));
  return s;
 },
 [K+'slope']:m3('meaning'),
 [K+'point']:m3('sum1'),
 [K+'why']:cap(m1('sum2'),.45),
 [K+'dU']:m2('dUe'),
 [K+'div']:m2('div'),
 [K+'cancel']:m2('cancel'),
 [K+'setup']:m1('setup'),
 [K+'paths']:m1('sum1'),
 [K+'val']:m2('val'),
 [K+'direct']:m2('direct'),
 [K+'check']:m3('check'),
 [K+'wrong']:(p)=>card(200,100,800,270,label('よくある間違い',600,170,{size:30,color:C.a,anchor:'middle',weight:700})+label('正の 電荷は いつも',600,250,{size:34,color:C.ink,anchor:'middle'})+label('電位の 低い 方へ 動く？',600,315,{size:34,color:C.ink,anchor:'middle'}),seg(p,.03,.18),C.a),
 [K+'notalways']:m2('notalways'),
 [K+'ball']:m2('ball'),
 [K+'sum']:(p)=>{
  let s=card(60,60,520,290,L('足し上げると 電位',320,115,{size:26,color:VC,weight:700})+T(`${VB}-${VA}=-${INT}`,320,230,{size:40}),1,VC);
  s+=card(620,60,520,290,L('傾きを とると 電場',880,115,{size:26,color:EC,weight:700})+T(`${E}=-\\dfrac{d${V}}{${dx}}`,880,235,{size:52}),seg(p,.15,.3),EC);
  s+=fade(seg(p,.55,.7),L('使えるのは 一周の 線積分が 0 の 静電場',600,430,{size:32,color:C.hi,weight:700}));
  return s;
 },
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

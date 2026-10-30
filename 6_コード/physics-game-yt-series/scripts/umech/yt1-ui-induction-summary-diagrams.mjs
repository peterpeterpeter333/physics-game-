// 大学編「電磁誘導・初級・要点」(ys-ui-induction-summary) — 図。Stage 1200×515.
// 詳しい動画 ui-induction-1（1/2）・ui-induction-2（2/2）の図をそのまま呼び出す（同じ数値・同じ色・同じ向き）。
// 結論の表・よくある間違い・締めのカード・数値例の「＝ 2 V」の札だけ ここで描く。
// 色（詳しい動画と同じ）：磁場 𝐁 橙(C.E)、磁束 Φ 黄(C.hi)、電流 I 緑(C.F)、起電力 ℰ 紫(C.v)、誘導の磁場 赤。
import {C,seg,fade,label,rect,tex} from './anim.mjs';
import {ytUiInduction1Diagrams as B1} from './yt1-ui-induction-1-diagrams.mjs';
import {ytUiInduction2Diagrams as B2} from './yt1-ui-induction-2-diagrams.mjs';

const K='ui-induction-summary:';
const get=(M,id)=>k=>{const f=M[id+':'+k];if(!f)throw new Error('missing '+id+':'+k);return f;};
const a=get(B1,'ui-induction-1'),b=get(B2,'ui-induction-2');
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const BC=C.E,HI=C.hi,CI=C.F,EMF=C.v,IND='#ff6b6b';
const EM=cs(EMF,'\\mathcal{E}');
const T=(s,x,o={})=>tex(s,x,14,{auto:false,size:40,...o});
const L=(s,x,o={})=>label(s,x,12,{size:30,color:C.ink,anchor:'start',weight:700,...o});

const ROWS=[
 [()=>T(`\\Phi=${cs(HI,'B_{\\perp}')}\\,A`,250,{size:40})+L('磁束 ＝ 面を貫く 磁場の量',400,{color:HI}),'定義（Wb）'],
 [()=>L('起電力の 大きさ ＝ 磁束の 変化率',170,{color:EMF})+L('（単位 V）',700,{color:C.dim,size:26}),'実験の法則'],
 [()=>L('誘導電流の 磁場 ＝ 磁束の 変化を 妨げる向き',170,{color:IND}),'実験の法則'],
];
function results(p,n,{title='結論',fresh=true}={}){
 let s=label(title,600,55,{size:28,color:C.dim,anchor:'middle'});
 ROWS.forEach(([f,note],i)=>{
  if(i>=n)return;
  const y=80+i*135,g=fresh&&i===n-1?seg(p,.03,.2):1;
  s+=card(60,y,1080,115,label(['①','②','③'][i],110,y+70,{size:36,color:C.hi,anchor:'middle',weight:700})
   +`<g transform="translate(0 ${y+58})">${f()}</g>`+label(note,1040,y+70,{size:24,color:C.dim,anchor:'middle'}),g,fresh&&i===n-1?C.hi:C.faint);
 });
 return s;
}

export const ytUiInductionSummaryDiagrams={
 [K+'intro']:(p)=>results(p,0)+fade(seg(p,.1,.3),label('面を貫く 磁場を どう数え、',600,250,{size:34,color:C.ink,anchor:'middle',weight:700})
  +label('それが 変わると 何が起こる？',600,320,{size:34,color:C.hi,anchor:'middle',weight:700})),
 [K+'c1']:(p)=>results(p,1),
 [K+'c2']:(p)=>results(p,2),
 [K+'c3']:(p)=>results(p,3),
 [K+'r1']:a('why'),
 [K+'r2']:b('parked'),
 [K+'r3']:(p,ctx)=>b('work')(.36*p,ctx),
 [K+'r3b']:(p,ctx)=>b('work')(.36+.64*p,ctx),
 [K+'r4']:b('energy'),
 [K+'ex1']:a('perp'),
 [K+'ex2']:a('sixty2'),
 [K+'ex3']:(p,ctx)=>b('calc')(p,ctx)+fade(seg(p,.75,.88),tex(`=${cs(EMF,'2\\,\\mathrm{V}')}`,1060,452,{auto:false,size:34})),
 [K+'ex4']:b('calc2'),
 [K+'m1']:(p)=>card(200,100,800,270,label('よくある間違い',600,170,{size:30,color:C.a,anchor:'middle',weight:700})+label('誘導の磁場は',600,250,{size:34,color:C.ink,anchor:'middle'})+label('いつも 元の磁場と 逆向き？',600,315,{size:34,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.a),
 [K+'m2']:b('inccur'),
 [K+'m3']:b('deccur'),
 [K+'m4']:b('answer'),
 [K+'sum']:(p)=>results(p,3,{title:'まとめ',fresh:false}),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

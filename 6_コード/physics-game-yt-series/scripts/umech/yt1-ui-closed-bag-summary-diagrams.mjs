// 大学編「閉じた面（ガウスの法則）・初級・要点」(ys-ui-closed-bag-summary) — 図。Stage 1200×515.
// 詳しい動画 ui-closed-bag-1／-2 の図をそのまま呼び出す（同じ数値・同じ色）。結論の表と締めのカードだけ ここで描く。
// 色（詳しい動画と同じ）：電場 𝐄・電気力線 水色、外向き法線 桃、＋・合計 黄、− 赤、正電荷 赤、負電荷 青。
import {C,seg,fade,label,rect,tex,texWidth} from './anim.mjs';
import {ytUiClosedBag1Diagrams as B1,EC,NC} from './yt1-ui-closed-bag-1-diagrams.mjs';
import {ytUiClosedBag2Diagrams as B2} from './yt1-ui-closed-bag-2-diagrams.mjs';

const K='ui-closed-bag-summary:';
const u1=k=>{const f=B1['ui-closed-bag-1:'+k];if(!f)throw new Error('missing ui-closed-bag-1:'+k);return f;};
const u2=k=>{const f=B2['ui-closed-bag-2:'+k];if(!f)throw new Error('missing ui-closed-bag-2:'+k);return f;};
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const TF=(s,x,maxW,size)=>{const w=texWidth(s,size,false);return tex(s,x,0,{size:w>maxW?size*maxW/w:size,auto:false});};
const L=(s,x,o={})=>label(s,x,12,{size:32,color:C.ink,anchor:'middle',weight:700,...o});

const ROWS=[
 [()=>L('1枚の面の電気束 ＝ 法線方向の成分 × 面積',540),'数え方'],
 [()=>L('閉じた面：法線は外向き、出る＋ 入る−',540),'符号の約束'],
 [()=>L('合計 ∝ 中の正味の電荷（ガウスの法則）',540),'合計が語ること'],
];
function results(p,n,{title='結論',fresh=true}={}){
 let s=label(title,600,55,{size:28,color:C.dim,anchor:'middle'});
 ROWS.forEach(([f,note],i)=>{
  if(i>=n)return;
  const y=80+i*135,g=fresh&&i===n-1?seg(p,.03,.2):1;
  s+=card(60,y,1080,115,label(['①','②','③'][i],110,y+70,{size:36,color:C.hi,anchor:'middle',weight:700})
   +`<g transform="translate(0 ${y+58})">${f()}</g>`+label(note,1035,y+70,{size:24,color:C.dim,anchor:'middle'}),g,fresh&&i===n-1?C.hi:C.faint);
 });
 return s;
}

export const ytUiClosedBagSummaryDiagrams={
 [K+'intro']:(p)=>results(p,0)+fade(seg(p,.1,.3),label('閉じた袋を貫く矢印を数えると、何が分かる？',600,280,{size:34,color:C.ink,anchor:'middle',weight:700})),
 [K+'c1']:(p)=>results(p,1),
 [K+'c2']:(p)=>results(p,2),
 [K+'c3']:(p)=>results(p,3),
 [K+'r1']:u2('lines'),
 [K+'r2']:u2('square'),
 [K+'r3']:u2('wavy'),
 [K+'r4']:u2('big'),
 [K+'r5']:u2('cancel'),
 [K+'ex1']:u1('perp'),
 [K+'ex2']:u1('sixty'),
 [K+'ex3']:u1('reverse'),
 // 「予想してみよう」の行（詳しい動画の問いかけ）は出さない。
 [K+'m1']:(p,ctx)=>u1('predict')(Math.min(p,.39),ctx),
 [K+'m2']:u1('total'),
 [K+'m3']:u1('answer'),
 [K+'m4']:u1('words'),
 [K+'m5']:u2('nottell'),
 [K+'sum']:(p)=>results(p,3,{title:'まとめ',fresh:false}),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

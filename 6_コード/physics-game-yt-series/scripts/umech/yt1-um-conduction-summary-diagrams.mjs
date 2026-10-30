// 大学編「電流・中級・要点」(ys-um-conduction-summary) — 図。Stage 1200×515.
// 詳しい動画 um-conduction-1／-2 の図をそのまま呼び出す（同じ数値・同じ色・同じ向き：𝐄 右、電子 左、電流 右）。結論の表と締めのカードだけ ここで描く。
// 色（詳しい動画と同じ）：電流 I 緑、e 桃、n 白、S 金、v 紫、電子 青、𝐄 水色、電位・電圧 紫、合図 黄。
import {C,seg,fade,label,rect} from './anim.mjs';
import {ytUmConduction1Diagrams as B1,T,It,ENSV} from './yt1-um-conduction-1-diagrams.mjs';
import {ytUmConduction2Diagrams as B2} from './yt1-um-conduction-2-diagrams.mjs';

const K='um-conduction-summary:';
const u1=k=>{const f=B1['um-conduction-1:'+k];if(!f)throw new Error('missing um-conduction-1:'+k);return f;};
const u2=k=>{const f=B2['um-conduction-2:'+k];if(!f)throw new Error('missing um-conduction-2:'+k);return f;};
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const L=(s,x,o={})=>label(s,x,12,{size:30,color:C.ink,anchor:'start',weight:700,...o});

const ROWS=[
 [()=>T(`${It}=${ENSV}`,260,14,{size:42})+L('長さ vΔt の円柱の中の電子を数える',400),'導いた結果'],
 [()=>L('電子は遅い・合図は速い → 電球はすぐ点く',170),'2つの速さ'],
 [()=>L('分岐点：入る和 ＝ 出る和',170,{color:C.F})+L('一周：上り下りの和 ＝ 0',560,{color:C.v}),'キルヒホッフ'],
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

export const ytUmConductionSummaryDiagrams={
 [K+'intro']:(p)=>results(p,0)+fade(seg(p,.1,.3),label('電子の数と速さから 電流を数えるには？',600,250,{size:34,color:C.ink,anchor:'middle',weight:700})
  +label('分かれ道と一周の 決まりは？',600,320,{size:34,color:C.hi,anchor:'middle',weight:700})),
 [K+'c1']:(p)=>results(p,1),
 [K+'c2']:(p)=>results(p,2),
 [K+'c3']:(p)=>results(p,3),
 [K+'r1']:u1('reach'),
 [K+'r2']:u1('count'),
 [K+'r3']:u1('divide'),
 [K+'r4']:u2('balance'),
 [K+'r5']:u2('law1'),
 [K+'r6']:u2('why2'),
 [K+'ex1']:u1('copper'),
 [K+'ex2']:u1('given'),
 [K+'ex3']:u1('enS'),
 [K+'ex4']:u1('vres'),
 [K+'ex5']:u1('slow'),
 // 詳しい動画の「旅は不要」の札は答えなので、同じ位置に間違いの札を重ねて隠す（回路と「この電子が電球まで？」はそのまま）。
 [K+'m1']:(p,ctx)=>u2('notravel')(Math.min(p,.32),ctx)+card(790,90,380,320,'',1)+card(790,90,380,320,
   label('よくある間違い',980,150,{size:26,color:C.dim,anchor:'middle'})+label('電池から出た電子が',980,225,{size:28,color:C.a,anchor:'middle',weight:700})
   +label('電球まで 走って',980,275,{size:28,color:C.a,anchor:'middle',weight:700})+label('点く？',980,345,{size:32,color:C.a,anchor:'middle',weight:700}),seg(p,.1,.3),C.a),
 [K+'m2']:u2('switch'),
 [K+'m3']:u2('local'),
 [K+'m4']:u2('twospeed'),
 [K+'sum']:(p)=>results(p,3,{title:'まとめ',fresh:false}),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

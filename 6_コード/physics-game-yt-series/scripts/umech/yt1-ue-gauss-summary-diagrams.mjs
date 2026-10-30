// 大学編「ガウスの法則・上級・要点」(ys-ue-gauss-summary) — 図。Stage 1200×515.
// 詳しい動画 ue-gauss-1〜6 の図をそのまま呼び出す（同じ数値・同じ色）。結論の表と締めのカードだけ ここで描く。
// 色（詳しい動画と同じ）：𝐄 水色、法線 𝐧 桃、面積 金、Φ・強調 黄、立体角 dΩ 黄緑、電荷 Q 桃。
import {C,seg,fade,label,rect} from './anim.mjs';
import {ytUeGauss1Diagrams as A1,qin,FLUX} from './yt1-ue-gauss-1-diagrams.mjs';
import {ytUeGauss3Diagrams as A3} from './yt1-ue-gauss-3-diagrams.mjs';
import {ytUeGauss4Diagrams as A4} from './yt1-ue-gauss-4-diagrams.mjs';
import {ytUeGauss5Diagrams as A5} from './yt1-ue-gauss-5-diagrams.mjs';
import {ytUeGauss6Diagrams as A6} from './yt1-ue-gauss-6-diagrams.mjs';

const K='ue-gauss-summary:';
const SRC={1:A1,3:A3,4:A4,5:A5,6:A6};
const u=(n,k)=>{const f=SRC[n]['ue-gauss-'+n+':'+k];if(!f)throw new Error('missing ue-gauss-'+n+':'+k);return f;};
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const L=(s,x,o={})=>label(s,x,12,{size:32,color:C.ink,anchor:'middle',weight:700,...o});

const ROWS=[
 [()=>qin(FLUX,480,14,{size:40}),'クーロン＋重ね合わせ'],
 [()=>L('ずれた球 → 立体角 → 重ね合わせ',480),'証明の道順'],
 [()=>L('点 1/r²　　線 1/r　　面 σ/(2ε₀)',480),'対称性で E を取り出す'],
];
function results(p,n,{title='結論',fresh=true}={}){
 let s=label(title,600,55,{size:28,color:C.dim,anchor:'middle'});
 ROWS.forEach(([f,note],i)=>{
  if(i>=n)return;
  const y=80+i*135,g=fresh&&i===n-1?seg(p,.03,.2):1;
  s+=card(60,y,1080,115,label(['①','②','③'][i],110,y+70,{size:36,color:C.hi,anchor:'middle',weight:700})
   +`<g transform="translate(0 ${y+58})">${f()}</g>`+label(note,990,y+70,{size:24,color:C.dim,anchor:'middle'}),g,fresh&&i===n-1?C.hi:C.faint);
 });
 return s;
}

export const ytUeGaussSummaryDiagrams={
 [K+'intro']:(p)=>results(p,0)+fade(seg(p,.1,.3),label('中心の球の計算を、どんな閉じた面・何個の電荷へ',600,280,{size:34,color:C.ink,anchor:'middle',weight:700})),
 [K+'c1']:(p)=>results(p,1),
 [K+'c2']:(p)=>results(p,2),
 [K+'c3']:(p)=>results(p,3),
 [K+'r1']:u(4,'def'),
 [K+'r2']:u(4,'why'),
 [K+'r3']:u(4,'res'),
 // 前半（内側の電荷）は inside2、後半の文（外の電荷）で outside に切り替える。
 [K+'r4']:(p,ctx)=>p<.6?u(4,'inside2')(p/.6,ctx):u(4,'outside')(.3+.7*(p-.6)/.4,ctx),
 [K+'r5']:u(4,'result'),
 [K+'ex1']:u(1,'Enum'),
 [K+'ex3']:u(3,'diff'),
 [K+'ex4']:u(3,'eps'),
 [K+'ex5']:u(3,'numout'),
 [K+'m1']:u(3,'wrong'),
 [K+'m2']:u(3,'inout'),
 [K+'m3']:u(6,'shellsolve'),
 [K+'m4']:u(6,'cond4'),
 [K+'sum']:(p)=>results(p,3,{title:'まとめ',fresh:false}),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

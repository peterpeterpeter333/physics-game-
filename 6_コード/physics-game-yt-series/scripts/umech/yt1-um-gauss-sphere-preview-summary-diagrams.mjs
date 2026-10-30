// 大学編「ガウスの法則・中級・要点」(ys-um-gauss-sphere-preview-summary) — 図。Stage 1200×515.
// 詳しい動画 um-gauss-sphere-preview-1／-2 の図をそのまま呼び出す（同じ数値・同じ色）。結論の表と締めのカードだけ ここで描く。
// 色（詳しい動画と同じ）：𝐄 水色、法線 𝐧 桃、面積 金、Φ・強調 黄、電荷 Q 桃。
import {C,seg,fade,label,rect,tex,texWidth} from './anim.mjs';
import {ytUmGaussSphere1Diagrams as G1,FLUX,EE,QQ,cs,GC} from './yt1-um-gauss-sphere-preview-1-diagrams.mjs';
import {ytUmGaussSphere2Diagrams as G2} from './yt1-um-gauss-sphere-preview-2-diagrams.mjs';

const K='um-gauss-sphere-preview-summary:';
const u1=k=>{const f=G1['um-gauss-sphere-preview-1:'+k];if(!f)throw new Error('missing um-gauss-sphere-preview-1:'+k);return f;};
const u2=k=>{const f=G2['um-gauss-sphere-preview-2:'+k];if(!f)throw new Error('missing um-gauss-sphere-preview-2:'+k);return f;};
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const TF=(s,x,maxW,size)=>{const w=texWidth(s,size,false);return tex(s,x,0,{size:w>maxW?size*maxW/w:size,auto:false});};
const RR=cs(GC.hi,'r');

const ROWS=[
 [()=>TF(FLUX,540,560,44),'タイルの寄与の和'],
 [()=>TF(`${FLUX}=${EE}\\times4\\pi r^2`,540,560,40),'中心に電荷がある球面'],
 [()=>TF(`4\\pi k${QQ}=\\frac{${QQ}}{\\varepsilon_0}\\quad\\big(\\varepsilon_0=\\frac{1}{4\\pi k}\\big)`,540,560,40),'半径によらない'],
];
function results(p,n,{title='結論',fresh=true}={}){
 let s=label(title,600,55,{size:28,color:C.dim,anchor:'middle'});
 ROWS.forEach(([f,note],i)=>{
  if(i>=n)return;
  const y=80+i*135,g=fresh&&i===n-1?seg(p,.03,.2):1;
  s+=card(60,y,1080,115,label(['①','②','③'][i],110,y+70,{size:36,color:C.hi,anchor:'middle',weight:700})
   +`<g transform="translate(-60 ${y+58})">${f()}</g>`+label(note,960,y+70,{size:24,color:C.dim,anchor:'middle'}),g,fresh&&i===n-1?C.hi:C.faint);
 });
 return s;
}

export const ytUmGaussSpherePreviewSummaryDiagrams={
 [K+'intro']:(p)=>results(p,0)+fade(seg(p,.1,.3),label('閉じた面の電気束を積分で書き、球面で計算する',600,280,{size:34,color:C.ink,anchor:'middle',weight:700})),
 [K+'c1']:(p)=>results(p,1),
 [K+'c2']:(p)=>results(p,2),
 [K+'c3']:(p)=>results(p,3),
 [K+'r1']:u1('normal'),
 [K+'r2']:u1('cos1'),
 [K+'r3']:u1('sameE'),
 [K+'r3b']:u1('factor'),
 [K+'r4']:u2('cancel'),
 [K+'r5']:u2('rewrite'),
 [K+'ex1']:u2('num'),
 [K+'ex2']:u2('r1'),
 [K+'ex3']:u2('r2'),
 [K+'m1']:u2('answer'),
 [K+'m2']:u2('range'),
 [K+'m3']:u2('cant'),
 [K+'m4']:u2('symm'),
 [K+'sum']:(p)=>results(p,3,{title:'まとめ',fresh:false}),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

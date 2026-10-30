// 大学編「内積・上級・要点」(ys-um-dot-summary) — 図。Stage 1200×515.
// 詳しい動画（um-dot-1）の図を関数として再利用し、結論の表と締めのカードだけをここで描く。
// 色（詳しい動画と同じ）：𝐀 黄、𝐁 紫、𝐂 桃、力 𝐅 緑、移動 Δ𝐫 水色。ベクトルは太字、長さは細字。
import {C,seg,fade,label,rect,tex,texWidth} from './anim.mjs';
import {ytUmDot1Diagrams as U} from './yt1-um-dot-1-diagrams.mjs';

const K='um-dot-summary:';
const u=k=>U['um-dot-1:'+k];
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const bf=(c,s)=>`{\\color{${c}}{\\mathbf{${s}}}}`;
const A=bf(C.hi,'A'),B=bf(C.v,'B'),Cc=bf(C.p,'C');
const TF=(s,x,maxW,size)=>{const w=texWidth(s,size,false);return tex(s,x,0,{size:w>maxW?size*maxW/w:size,auto:false});};

const ROWS=[
 [()=>TF(`${A}\\cdot${B}=A\\times(B\\cos\\theta)`,520,620,44),'符号付きの影'],
 [()=>TF(`${A}\\cdot(${B}+${Cc})=${A}\\cdot${B}+${A}\\cdot${Cc}`,520,640,42),'定義から導く'],
 [()=>label('仕事：移動の向き ／ 磁束：法線の向き',520,12,{size:32,color:C.ink,anchor:'middle',weight:700}),'取り出す成分'],
];
function results(p,n,{title='結論',fresh=true}={}){
 let s=label(title,600,55,{size:28,color:C.dim,anchor:'middle'});
 ROWS.forEach(([f,note],i)=>{
  if(i>=n)return;
  const y=80+i*135,g=fresh&&i===n-1?seg(p,.03,.2):1;
  s+=card(80,y,1040,115,label(['①','②','③'][i],130,y+70,{size:36,color:C.hi,anchor:'middle',weight:700})
   +`<g transform="translate(0 ${y+58})">${f()}</g>`+label(note,1000,y+70,{size:26,color:C.dim,anchor:'middle'}),g,fresh&&i===n-1?C.hi:C.faint);
 });
 return s;
}

export const ytUmDotSummaryDiagrams={
 [K+'intro']:(p)=>results(p,0)+fade(seg(p,.1,.3),label('分配法則を影で導き、仕事と磁束に使う',600,280,{size:34,color:C.ink,anchor:'middle',weight:700})),
 [K+'c1']:(p)=>results(p,1),
 [K+'c2']:(p)=>results(p,2),
 [K+'c3']:(p)=>results(p,3),
 [K+'r1']:u('add'),
 [K+'r2']:u('num'),
 [K+'r3']:u('neg'),
 [K+'r4']:u('mult'),
 [K+'r5']:u('vanish'),
 [K+'ex1']:u('three'),
 [K+'ex2']:u('num3'),
 [K+'ex3']:u('len'),
 [K+'ex4']:u('angle'),
 [K+'m1']:u('curve'),
 [K+'m2']:u('factor2'),
 [K+'m3']:u('vary'),
 [K+'m4']:u('lineint'),
 [K+'sum']:(p)=>results(p,3,{title:'まとめ',fresh:false}),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

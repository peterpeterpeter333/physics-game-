// YouTube シリーズ「積分・初級 2/2」(ys-ui-area-is-distance-2) — 図。Stage 1200×515.
// 色：距離・変位 x 水色、速さ・速度 v 紫、時間 t 金、Σ（全部足す）黄、負の寄与 赤、正しい 緑。
import {C,clamp,mix,seg,fade,label,line,rect,dot,arrow,highlight,axes,tex,texWidth} from './anim.mjs';
import {cV,cT,cX,card,vt,bar,steps,road,car} from './yt1-ui-area-is-distance-1-diagrams.mjs';

const K='ui-area-is-distance-2:';
const cH=s=>`{\\color{${C.hi}}{${s}}}`;
const ok=C.F,bad=C.a;
const P3=[[0,1,2],[1,2,3],[2,3,4]];
const vt3=(o={})=>vt({x:110,y:430,w:470,h:300,xmax:3.7,ymax:4.8,xticks:[1,2,3],yticks:[1,2,3,4],...o});
const vt3s=(o={})=>vt({x:90,y:440,w:300,h:190,xmax:3.6,ymax:4.8,xticks:[1,2,3],yticks:[2,4],...o});
const bars3=(A,o={})=>P3.map(([a,b,v])=>bar(A,a,b,v,o)).join('')+steps(A,P3,{w:4});
// signed velocity graph: +3 on 0–2 s, −2 on 2–3 s
const vtS=(o={})=>axes({x:110,y:440,w:470,h:330,xmax:3.7,ymin:-3,ymax:4,xticks:[1,2,3],yticks:[-2,-1,1,2,3],grid:true,xlabel:'時刻 t [s]',ylabel:'速度 v [m/s]',xcolor:C.t,ycolor:C.v,...o});
const PS=[[0,2,3],[2,3,-2]];
// the Σ with its limits, placed so that we know where the parts are
function sigmaBlock(x,y,{size=90,top='3',bottom='i=1',body='a_i',bodyTex=null}={}){
 return tex(`\\sum_{${bottom}}^{${top}}`,x,y,{size,auto:false,color:C.hi})+tex(bodyTex??body,x+size*.85,y-size*.18,{size:size*.8,anchor:'start',color:C.ink,auto:false});
}

export const ytUiArea2Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  const A=vt3();let s=A.svg;
  P3.forEach(([a,b,v],i)=>{s+=bar(A,a,b,v,{g:seg(p,.1+i*.12,.22+i*.12)})+fade(seg(p,.2+i*.12,.3+i*.12),label(String(v),(A.X(a)+A.X(b))/2,A.Y(v/2)+10,{size:32,color:C.x,anchor:'middle',weight:700}));});
  s+=steps(A,P3);
  s+=fade(seg(p,.1,.25),label('前回',760,150,{size:26,color:C.dim}));
  s+=fade(seg(p,.55,.75),tex(cX('2')+'+'+cX('3')+'+'+cX('4')+'='+cX('9\\,\\mathrm{m}'),940,250,{size:50,auto:false,color:C.ink}));
  s+=fade(seg(p,.7,.85),label('長方形の面積を 足した',940,330,{size:28,color:C.x,anchor:'middle'}));
  return s;
 },
 [K+'question']:(p)=>{
  let s=label('今回の問い',600,75,{size:28,color:C.dim,anchor:'middle'});
  s+=card(140,110,920,120,label('① 長い足し算を どう短く書く？',600,183,{size:36,color:C.ink,anchor:'middle',weight:700}),seg(p,.1,.25),C.t);
  s+=card(140,270,920,120,label('② 面積が 距離になるのは なぜ？',600,343,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'long']:(p)=>{
  const A=vt({x:90,y:300,w:520,h:200,xmax:105,ymax:4.8,xticks:[50,100],yticks:[2,4]});
  let s=A.svg;const n=Math.round(mix(3,100,seg(p,.05,.35)));
  for(let i=0;i<n;i++)s+=bar(A,i,i+1,2+2*(i+.5)/100,{sw:.8,fo:.35});
  s+=fade(seg(p,.05,.2),label(`区間：${n} 個`,700,150,{size:30,color:C.t}));
  const t='Δx₁ ＋ Δx₂ ＋ Δx₃ ＋ Δx₄ ＋ Δx₅ ＋ … ＋ Δx₁₀₀';
  s+=fade(seg(p,.4,.6),label(t,600,400,{size:30,color:C.x,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),label('100 個 並べる',600,460,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.75,.9),label('大変！',900,250,{size:34,color:bad,weight:700}));
  return s;
 },
 // ===== S2 Σ の読み方 =====
 [K+'sigma']:(p)=>{
  let s=fade(seg(p,.05,.2),label('全部足す という 指示',600,110,{size:34,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),tex('\\Sigma',600,330,{size:180,auto:false,color:C.hi}));
  s+=fade(seg(p,.6,.75),label('シグマ（ギリシャ文字）',600,470,{size:30,color:C.hi,anchor:'middle'}));
  return s;
 },
 [K+'limits']:(p)=>{
  let s=sigmaBlock(420,300,{size:100});
  s+=fade(seg(p,.05,.25),highlight(360,330,140,70,1)+arrow(560,370,510,365,{color:C.hi,w:3,head:12})+label('i ＝ 1：番号 i を 1 から始める',575,378,{size:28,color:C.t}));
  s+=fade(seg(p,.55,.75),highlight(390,90,80,66,1)+arrow(560,120,480,120,{color:C.hi,w:3,head:12})+label('3：3 で終わる',575,130,{size:28,color:C.t}));
  return s;
 },
 [K+'expand']:(p)=>{
  let s=sigmaBlock(260,230,{size:90});
  s+=fade(seg(p,.05,.2),label('a：足すもの（i 番目）',160,420,{size:26,color:C.dim}));
  const terms=['a_1','a_2','a_3'];let x=500;
  s+=fade(seg(p,.1,.2),tex('=',x,210,{size:60,auto:false}));x+=50;
  terms.forEach((t,i)=>{const g=seg(p,.2+i*.15,.32+i*.15);s+=fade(g,(i?tex('+',x,210,{size:60,auto:false}):'')+tex(t,x+(i?40:0),210,{size:60,anchor:'start',auto:false})+label(`i ＝ ${i+1}`,x+(i?40:0)+30,300,{size:24,color:C.t,anchor:'middle'}));x+=(i?40:0)+texWidth(t,60,false)+30;});
  s+=fade(seg(p,.75,.9),label('並べて 全部足す',760,390,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sigdx']:(p)=>{
  const A=vt3s();let s=A.svg+bars3(A);
  P3.forEach(([a,b,v],i)=>{s+=fade(seg(p,.4,.6),label(`Δx${'₁₂₃'[i]}`,(A.X(a)+A.X(b))/2,A.Y(v)-12,{size:24,color:C.x,anchor:'middle'}));});
  s+=fade(seg(p,.05,.2),sigmaBlock(620,250,{size:90,body:'\\Delta x_i',bodyTex:cX('\\Delta x_i')}));
  s+=fade(seg(p,.5,.7),label('足すもの ＝ 区間ごとの距離',560,440,{size:28,color:C.x}));
  return s;
 },
 [K+'sigdx2']:(p)=>{
  let s=tex(`\\sum_{i=1}^{3}`,200,200,{size:70,auto:false,color:C.hi})+tex(cX('\\Delta x_i'),245,190,{size:56,anchor:'start',auto:false});
  s+=fade(seg(p,.05,.3),tex('='+cX('\\Delta x_1')+'+'+cX('\\Delta x_2')+'+'+cX('\\Delta x_3'),370,190,{size:56,anchor:'start',auto:false,color:C.ink}));
  s+=fade(seg(p,.45,.65),tex('='+cX('2')+'+'+cX('3')+'+'+cX('4'),370,310,{size:56,anchor:'start',auto:false,color:C.ink})+label('数を入れる',900,310,{size:24,color:C.hi}));
  s+=fade(seg(p,.7,.88),tex('='+cX('9\\,\\mathrm{m}'),370,420,{size:60,anchor:'start',auto:false,color:C.ink})+highlight(360,378,200,80,1));
  return s;
 },
 [K+'sig100']:(p)=>{
  let s=tex(`\\sum_{i=1}^{3}`,300,200,{size:70,auto:false,color:C.hi})+tex(cX('\\Delta x_i'),345,190,{size:56,anchor:'start',auto:false});
  s+=label('区間 3 個',300,330,{size:26,color:C.t,anchor:'middle'});
  s+=fade(seg(p,.1,.3),arrow(520,190,640,190,{color:C.dim,w:4}));
  s+=fade(seg(p,.2,.45),tex(`\\sum_{i=1}^{${cH('100')}}`,800,200,{size:70,auto:false,color:C.hi})+tex(cX('\\Delta x_i'),845,190,{size:56,anchor:'start',auto:false})+label('区間 100 個',800,330,{size:26,color:C.t,anchor:'middle'}));
  s+=fade(seg(p,.5,.7),card(250,380,700,90,label('上の数を 変えるだけ。式の長さは 同じ',600,435,{size:30,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
  return s;
 },
 // ===== S3 言葉と記号（補助線①：文と記号を同じ色で上下に）=====
 ...wordsScene(),
 // ===== S4 面積が距離になる理由 =====
 ...whyScene(),
 // ===== S5 戻るとき：変位と道のり =====
 ...backScene(),
 // ===== S6 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  let s=fade(seg(p,.05,.2),tex(`\\sum`,280,160,{size:80,auto:false,color:C.hi})+label('＝ 並んだものを 全部足す',340,175,{size:32,color:C.hi}));
  s+=fade(seg(p,.4,.6),tex(cX('\\Delta x')+'\\approx'+cH('\\sum_i')+cV('v_i')+cT('\\,\\Delta t_i'),600,330,{size:64,auto:false,color:C.ink}));
  s+=fade(seg(p,.6,.75),label('距離 ≈ 速さ × 時間 を 全部足す',600,450,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'sum2']:(p)=>{
  const A=vtS({x:90,y:420,w:380,h:300});let s=A.svg;
  s+=bar(A,0,2,3)+bar(A,2,3,-2,{color:bad})+steps(A,PS,{w:4});
  s+=label('高さ ＝ 速さ、幅 ＝ 時間 → 面積 ＝ 距離',660,150,{size:26,color:C.ink});
  s+=fade(seg(p,.45,.6),label('変位：符号をつけて 6 ＋（−2）＝ 4 m',660,250,{size:28,color:C.x}));
  s+=fade(seg(p,.6,.75),label('道のり：大きさで 6 ＋ 2 ＝ 8 m',660,370,{size:28,color:C.x}));
  return s;
 },
 [K+'next1']:(p)=>{
  let s=card(150,120,400,200,label('微分',350,175,{size:28,color:C.dim,anchor:'middle'})+label('位置の式',350,230,{size:32,color:C.x,anchor:'middle',weight:700})+label('→ 速さ',350,285,{size:32,color:C.v,anchor:'middle',weight:700}),seg(p,.05,.2));
  s+=card(650,120,400,200,label('積分',850,175,{size:28,color:C.dim,anchor:'middle'})+label('速さ',850,230,{size:32,color:C.v,anchor:'middle',weight:700})+label('→ 距離',850,285,{size:32,color:C.x,anchor:'middle',weight:700}),seg(p,.1,.25));
  s+=fade(seg(p,.55,.75),label('次は：式が 少し込み入ったとき',600,420,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next2']:(p)=>{
  const box=(x,txt,c,g)=>fade(g,rect(x-90,150,180,90,{fill:'#131f38',fo:.96,stroke:c,sw:2,rx:12})+label(txt,x,207,{size:32,color:c,anchor:'middle',weight:700}));
  let s=box(200,'t',C.t,seg(p,0,.15))+fade(seg(p,.1,.25),arrow(300,195,420,195,{color:C.dim,w:4})+label('3倍',360,175,{size:24,color:C.dim,anchor:'middle'}));
  s+=box(520,'3t',C.ink,seg(p,.15,.3))+fade(seg(p,.25,.4),arrow(620,195,740,195,{color:C.dim,w:4})+label('2乗',680,175,{size:24,color:C.dim,anchor:'middle'}));
  s+=box(850,'(3t)²',C.x,seg(p,.3,.45));
  s+=fade(seg(p,.4,.55),label('式の中に 式',520,300,{size:28,color:C.dim,anchor:'middle'}));
  s+=card(250,340,700,110,label('変化の倍率は どうなる？',600,408,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
};

function wordsScene(){
 // Japanese sentence (row y=150) and the symbols under each part (row y=280), same colours.
 const CH=[{t:'その区間の速さ',x:230,c:C.v,sym:'v_i'},{t:'×',x:410,c:C.ink},{t:'その区間の時間',x:590,c:C.t,sym:'\\Delta t_i'},{t:'を',x:735,c:C.ink},{t:'全部足す',x:870,c:C.hi,sym:'\\Sigma'}];
 const sentence=(g=1)=>fade(g,CH.map(q=>label(q.t,q.x,150,{size:34,color:q.c,anchor:'middle',weight:q.sym?700:400})).join(''));
 const sym=(i,g)=>{const q=CH[i];return fade(g,arrow(q.x,175,q.x,225,{color:q.c,w:3,head:12})+tex(q.sym,q.x,290,{size:60,auto:false,color:q.c}));};
 return {
  [K+'words']:(p)=>{let s='';CH.forEach((q,i)=>{s+=fade(seg(p,.35+i*.1,.45+i*.1),label(q.t,q.x,150,{size:34,color:q.c,anchor:'middle',weight:q.sym?700:400}));});
   return fade(seg(p,.05,.2),label('距離の求め方を 日本語で',600,70,{size:26,color:C.dim,anchor:'middle'}))+s;},
  [K+'vi']:(p)=>sentence()+sym(0,seg(p,.05,.25))+fade(seg(p,.45,.65),label('i 番目の区間の 速さ',230,380,{size:26,color:C.v,anchor:'middle'})),
  [K+'ti']:(p)=>sentence()+sym(0,1)+label('i 番目の区間の 速さ',230,380,{size:26,color:C.v,anchor:'middle'})+sym(2,seg(p,.05,.25))+fade(seg(p,.4,.6),label('i 番目の区間の 幅',590,380,{size:26,color:C.t,anchor:'middle'})),
  [K+'sig']:(p)=>{
   let s=sentence()+sym(0,1)+sym(2,1)+sym(4,seg(p,.05,.2));
   s+=fade(seg(p,.4,.6),tex(cX('\\Delta x')+'\\approx'+cH('\\sum_i')+cV('v_i')+cT('\\,\\Delta t_i'),600,440,{size:60,auto:false,color:C.ink}));
   return s;
  },
  [K+'approx']:(p)=>{
   // a slowly changing speed (curve) vs the flat tops of the rectangles
   const A=vt({x:110,y:430,w:470,h:300,xmax:3.7,ymax:4.8,xticks:[1,2,3],yticks:[1,2,3,4]});
   const f=t=>2+.7*t;let s=A.svg;
   for(let i=0;i<3;i++)s+=bar(A,i,i+1,f(i+.5));
   s+=fade(seg(p,.5,.7),A.plot(f,{from:0,to:3,color:C.v,w:4}));
   s+=fade(seg(p,.05,.2),tex('\\approx',860,170,{size:80,auto:false,color:C.hi})+label('ほぼ 等しい',940,185,{size:30,color:C.hi}));
   s+=fade(seg(p,.25,.45),label('区間の中で 速さ一定 とみなした',700,280,{size:28,color:C.ink}));
   s+=fade(seg(p,.6,.8),label('速さが 少しずつ変わると',700,350,{size:28,color:C.v})+label('少し ずれる',700,395,{size:30,color:bad,weight:700}));
   return s;
  },
  [K+'one']:(p)=>{
   const A=vt({x:110,y:430,w:470,h:300,xmax:4.6,ymax:4.8,xticks:[1,2,3,4],yticks:[1,2,3,4]});
   let s=A.svg+bar(A,0,4,3,{g:seg(p,.3,.5)})+A.plot(()=>3,{from:0,to:4.3,color:C.v,w:5});
   s+=fade(seg(p,.45,.6),label('12',A.X(2),A.Y(1.5)+14,{size:40,color:C.x,anchor:'middle',weight:700}));
   s+=fade(seg(p,.05,.2),label('区間が 一つだけ',760,130,{size:28,color:C.t}));
   s+=fade(seg(p,.1,.3),tex(cH('\\sum_i')+cV('v_i')+cT('\\,\\Delta t_i')+'='+cV('v_1')+cT('\\,\\Delta t_1'),930,220,{size:46,auto:false,color:C.ink}));
   s+=fade(seg(p,.45,.6),tex(cV('3')+'\\times'+cT('4')+'='+cX('12\\,\\mathrm{m}'),930,310,{size:44,auto:false,color:C.ink}));
   s+=fade(seg(p,.7,.85),tex('\\Delta x=v\\,\\Delta t',930,410,{size:50})+label('に戻る',1080,420,{size:26,color:C.hi}));
   return s;
  },
  [K+'exact']:(p)=>{
   const A=vt3();let s=A.svg+bars3(A);
   s+=fade(seg(p,.05,.2),label('区間の中で ちょうど一定 → ずれなし',720,150,{size:26,color:ok}));
   const rows=[['2','1','2'],['3','1','3'],['4','1','4']];
   rows.forEach(([v,t,x],i)=>{s+=fade(seg(p,.35+i*.1,.45+i*.1),tex(cV(v)+'\\times'+cT(t)+'='+cX(x),800,230+i*60,{size:40,auto:false,color:C.ink,anchor:'start'}));});
   s+=fade(seg(p,.7,.85),label('合計  9 m',800,440,{size:36,color:C.x,weight:700})+label('✓',1000,440,{size:34,color:ok,weight:700}));
   return s;
  },
 };
}

function whyScene(){
 // one big bar: height v_i (purple), width Δt_i (gold)
 const X0=200,X1=560,Y0=430,Y1=140;
 const big=(g=1)=>fade(g,rect(X0,Y1,X1-X0,Y0-Y1,{fill:C.x,fo:.28,stroke:C.x,rx:2})+line(X0-40,Y0,X1+60,Y0,{color:C.dim,w:2.5})+line(X0,Y1,X1,Y1,{color:C.v,w:5}));
 const hLab=(g)=>fade(g,line(X0-24,Y0,X0-24,Y1,{color:C.v,w:5})+tex(cV('v_i'),X0-40,(Y0+Y1)/2+10,{size:44,auto:false,anchor:'end'})+label('[m/s]',X0-40,(Y0+Y1)/2+55,{size:22,color:C.v,anchor:'end'}));
 const wLab=(g)=>fade(g,line(X0,Y0+24,X1,Y0+24,{color:C.t,w:5})+tex(cT('\\Delta t_i'),(X0+X1)/2-30,Y0+68,{size:40,auto:false,anchor:'end'})+label('[s]',(X0+X1)/2-20,Y0+66,{size:22,color:C.t}));
 return {
  [K+'why']:(p)=>big(seg(p,.4,.6))+fade(seg(p,.05,.2),label('長方形 1本の 中身',860,200,{size:32,color:C.ink,anchor:'middle',weight:700})),
  [K+'hw']:(p)=>big()+hLab(seg(p,.05,.25))+wLab(seg(p,.5,.7))
    +fade(seg(p,.1,.3),label('高さ ＝ 速さ',720,200,{size:30,color:C.v}))+fade(seg(p,.55,.75),label('幅 ＝ 時間',720,270,{size:30,color:C.t})),
  [K+'prod']:(p)=>{
   let s=big()+hLab(1)+wLab(1)+label('高さ ＝ 速さ',720,170,{size:28,color:C.v})+label('幅 ＝ 時間',720,215,{size:28,color:C.t});
   s+=fade(seg(p,.1,.3),tex(cV('v_i')+'\\times'+cT('\\Delta t_i')+'='+cX('\\Delta x_i'),(X0+X1)/2,(Y0+Y1)/2+15,{size:44,auto:false,color:C.ink}));
   s+=fade(seg(p,.3,.5),label('その区間で 進んだ距離',720,300,{size:30,color:C.x,weight:700}));
   s+=fade(seg(p,.6,.8),tex(cV('\\mathrm{\\tfrac{m}{s}}')+'\\times'+cT('\\mathrm{s}')+'='+cX('\\mathrm{m}'),870,390,{size:46,auto:false,color:C.ink}));
   return s;
  },
  [K+'total']:(p)=>{
   const A=vt3s({y:470});let s=A.svg+bars3(A);
   const c1='面積 ＝ 長方形₁ ＋ 長方形₂ ＋ 長方形₃',c2='距離 ＝ Δx₁ ＋ Δx₂ ＋ Δx₃';
   s+=fade(seg(p,.05,.25),label(c1,470,180,{size:32,color:C.ink}));
   s+=fade(seg(p,.5,.7),label(c2,470,320,{size:32,color:C.x}));
   s+=fade(seg(p,.75,.9),label('各項が 同じもの',700,255,{size:26,color:C.hi})+arrow(680,210,680,285,{color:C.hi,w:3,head:12}));
   return s;
  },
  [K+'same']:(p)=>{
   const A=vt3s({y:470});let s=A.svg+bars3(A);
   s+=label('面積 ＝ 長方形₁ ＋ 長方形₂ ＋ 長方形₃',470,180,{size:32,color:C.ink})+label('距離 ＝ Δx₁ ＋ Δx₂ ＋ Δx₃',470,320,{size:32,color:C.x});
   s+=label('各項が 同じもの',700,255,{size:26,color:C.hi})+arrow(680,210,680,285,{color:C.hi,w:3,head:12});
   s+=card(570,370,580,100,label('だから 面積 ＝ 距離（たまたまではない）',860,430,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.5),C.hi);
   return s;
  },
  [K+'caution']:(p)=>{
   const A=vt({x:90,y:400,w:380,h:260,xmax:3.6,ymax:4.8,xticks:[1,2,3],yticks:[2,4]});
   let s=A.svg+bars3(A)+fade(seg(p,.05,.2),label('縦軸が 速さ：面積 ＝ 距離 ✓',90,480,{size:26,color:ok}));
   const B=axes({x:680,y:400,w:380,h:260,xmax:3.6,ymax:10,xticks:[1,2,3],yticks:[5],grid:true,xlabel:'時刻 t [s]',ylabel:'位置 x [m]',xcolor:C.t,ycolor:C.x,g:seg(p,.45,.6)});
   s+=B.svg;
   const pts=[];for(let i=0;i<=30;i++){const t=3*i/30;pts.push([B.X(t),B.Y(t*t)]);}
   s+=fade(seg(p,.5,.65),`<polygon points="${pts.map(q=>q.join(',')).join(' ')} ${B.X(3)},${B.Y(0)} ${B.X(0)},${B.Y(0)}" fill="${C.faint}" fill-opacity=".5"/>`+B.plot(t=>t*t,{from:0,to:3,color:C.x,w:4}));
   s+=fade(seg(p,.65,.8),label('縦軸が 位置：面積 ≠ 距離 ✕',680,480,{size:26,color:bad}));
   return s;
  },
 };
}

function backScene(){
 const A0=()=>vtS();
 const lab=(A,a,b,v,txt,c=C.x)=>label(txt,(A.X(a)+A.X(b))/2,A.Y(v/2)+10,{size:30,color:c,anchor:'middle',weight:700});
 // road 0..6 m on the right; path out to 6 then back to 4
 const RD=(y=250)=>road(770,1130,y,7,{labels:[0,2,4,6]});
 const pathSvg=(X,y,u,{show=true}={})=>{
  // u in [0,1]: first 0..6 (u<.75), then 6..4
  let s='';const a=clamp(u/.75),b=clamp((u-.75)/.25);
  s+=arrow(X(0),y-40,X(6*a),y-40,{color:C.x,w:5,head:14});
  if(b>0)s+=arrow(X(6),y-70,X(6-2*b),y-70,{color:bad,w:5,head:14});
  const m=u<.75?6*a:6-2*b;return s+(show?car(X(m),y-90+0):'');
 };
 return {
  [K+'back']:(p)=>{
   const {svg,X}=road(160,1040,330,7,{labels:[0,2,4,6]});
   const u=seg(p,.35,.95);const a=clamp(u/.75),b=clamp((u-.75)/.25),m=u<.75?6*a:6-2*b;
   return svg+car(X(m),330)+fade(seg(p,.05,.2),label('一方向',X(3),150,{size:28,color:C.x,anchor:'middle'})+arrow(X(1),175,X(5),175,{color:C.x,w:4}))
    +fade(seg(p,.55,.75),label('戻ったら？',X(5),230,{size:30,color:C.hi,anchor:'middle',weight:700})+arrow(X(6),255,X(4),255,{color:bad,w:4}));
  },
  [K+'sign']:(p)=>{
   const {svg,X}=road(160,1040,330,7,{labels:[0,2,4,6]});
   let s=svg+car(X(3),330);
   s+=fade(seg(p,.05,.25),arrow(X(3)+60,200,X(3)+260,200,{color:C.v,w:5})+label('右向き：＋（正）',X(3)+70,170,{size:28,color:C.v}));
   s+=fade(seg(p,.3,.5),card(160,60,500,70,label('速度 ＝ 向きを符号で表した速さ',410,106,{size:28,color:C.v,anchor:'middle',weight:700})));
   s+=fade(seg(p,.6,.8),arrow(X(3)-60,200,X(3)-260,200,{color:bad,w:5})+label('左向き：−（負）',X(3)-70,170,{size:28,color:bad,anchor:'end'}));
   return s;
  },
  [K+'ex']:(p)=>{
   const A=A0();let s=A.svg+steps(A,PS,{p:seg(p,.1,.8)});
   s+=fade(seg(p,.15,.3),label('+3 m/s（右へ）',A.X(1),A.Y(3)-14,{size:24,color:C.v,anchor:'middle'}));
   s+=fade(seg(p,.55,.7),label('−2 m/s（左へ）',A.X(2.5)+20,A.Y(-2)+36,{size:24,color:bad,anchor:'middle'}));
   const {svg,X}=RD();s+=svg+pathSvg(X,250,seg(p,.2,.9));
   return s;
  },
  [K+'up']:(p)=>{
   const A=A0();let s=A.svg+bar(A,0,2,3,{g:seg(p,.1,.35)})+steps(A,PS);
   s+=fade(seg(p,.3,.45),line(A.X(0),A.Y(0),A.X(2),A.Y(0),{color:C.t,w:7})+label('幅 2',A.X(1),A.Y(0)+30,{size:22,color:C.t,anchor:'middle'}));
   s+=fade(seg(p,.55,.7),lab(A,0,2,3,'6'));
   s+=fade(seg(p,.5,.7),tex(cV('3')+'\\times'+cT('2')+'='+cX('6\\,\\mathrm{m}'),900,200,{size:44,auto:false,color:C.ink}));
   s+=fade(seg(p,.05,.2),label('横軸の 上',900,120,{size:28,color:C.x,anchor:'middle'}));
   return s;
  },
  [K+'down']:(p)=>{
   const A=A0();let s=A.svg+bar(A,0,2,3)+lab(A,0,2,3,'6')+bar(A,2,3,-2,{color:bad,g:seg(p,.1,.35)})+steps(A,PS);
   s+=tex(cV('3')+'\\times'+cT('2')+'='+cX('6\\,\\mathrm{m}'),900,200,{size:44,auto:false,color:C.ink});
   s+=fade(seg(p,.05,.2),label('横軸の 下',A.X(2.5)+120,A.Y(-1)+10,{size:26,color:bad}));
   s+=fade(seg(p,.5,.7),tex(cV('(-2)')+'\\times'+cT('1')+'='+`{\\color{${bad}}{-2\\,\\mathrm{m}}}`,900,300,{size:44,auto:false,color:C.ink}));
   s+=fade(seg(p,.6,.75),lab(A,2,3,-2,'−2',bad));
   return s;
  },
  [K+'disp']:(p)=>{
   const A=vtS({x:90,y:440,w:380,h:330});let s=A.svg+bar(A,0,2,3)+lab(A,0,2,3,'6')+bar(A,2,3,-2,{color:bad})+lab(A,2,3,-2,'−2',bad)+steps(A,PS,{w:4});
   s+=fade(seg(p,.05,.3),tex(cX('6')+'+'+`{\\color{${bad}}{(-2)}}`+'='+cX('4\\,\\mathrm{m}'),950,100,{size:46,auto:false,color:C.ink}));
   const {svg,X}=RD(330);s+=svg+pathSvg(X,330,1,{show:false})+car(X(4),330-90);
   s+=fade(seg(p,.4,.6),line(X(0),380-12,X(4),380-12,{color:C.hi,w:0})+arrow(X(0),410,X(4),410,{color:C.hi,w:6})+label('変位 4 m',X(2),455,{size:30,color:C.hi,anchor:'middle',weight:700}));
   s+=fade(seg(p,.7,.85),label('出発点から 右へ 4 m',950,150,{size:26,color:C.dim,anchor:'middle'}));
   return s;
  },
  [K+'dist']:(p)=>{
   const {svg,X}=road(160,1040,250,7,{labels:[0,2,4,6]});
   let s=svg+pathSvg(X,250,1,{show:false})+car(X(4),160);
   s+=label('6 m',X(3),195,{size:24,color:C.x,anchor:'middle'})+label('2 m',X(5),165,{size:24,color:bad,anchor:'middle'});
   // unrolled path length
   const Y=400,g=seg(p,.35,.6);
   s+=fade(g,line(X(0),Y,X(6),Y,{color:C.x,w:8})+line(X(6),Y,X(8)-40,Y,{color:bad,w:8})+label('6',X(3),Y-16,{size:26,color:C.x,anchor:'middle'})+label('2',X(7)-20,Y-16,{size:26,color:bad,anchor:'middle'}));
   s+=fade(seg(p,.55,.75),label('道のり ＝ 6 ＋ 2 ＝ 8 m',X(4),Y+50,{size:32,color:C.hi,anchor:'middle',weight:700}));
   s+=fade(seg(p,.1,.3),label('進んだ道の長さ',160,120,{size:28,color:C.ink}));
   return s;
  },
  [K+'compare']:(p)=>{
   const {svg,X}=road(160,1040,300,7,{labels:[0,2,4,6]});
   let s=svg+car(X(4),300);
   // trail (path) above: out 6 then back 2
   s+=fade(seg(p,.4,.6),arrow(X(0),200,X(6),200,{color:C.hi,w:5,head:14})+arrow(X(6),170,X(4),170,{color:C.hi,w:5,head:14})+label('道のり：跡の全長 6 ＋ 2 ＝ 8 m',X(0),140,{size:28,color:C.hi,weight:700}));
   s+=fade(seg(p,.1,.3),arrow(X(0),380,X(4),380,{color:C.x,w:6})+label('変位：出発点 → 今いる所 ＝ 4 m',X(0),430,{size:28,color:C.x,weight:700}));
   return s;
  },
  [K+'abs']:(p)=>{
   const A=A0();const f=seg(p,.4,.7);
   let s=A.svg+bar(A,0,2,3)+lab(A,0,2,3,'6');
   // lower bar flips up: height −2 → +2
   const h=mix(-2,2,f);s+=bar(A,2,3,h,{color:f<.5?bad:C.x});
   s+=fade(1-seg(p,.4,.5),bar(A,2,3,-2,{color:bad,fo:.1}));
   s+=steps(A,PS,{w:3,color:C.faint});
   s+=fade(seg(p,.7,.85),lab(A,2,3,2,'2'));
   s+=fade(seg(p,.05,.25),tex('|v|',960,140,{size:56,auto:false,color:C.v})+label('速度の 大きさ（絶対値）',960,210,{size:28,color:C.v,anchor:'middle'}));
   s+=fade(seg(p,.5,.7),label('下の長方形を 上に 折り返す',960,300,{size:28,color:C.ink,anchor:'middle'}));
   s+=fade(seg(p,.75,.9),label('6 ＋ 2 ＝ 8 m',960,380,{size:34,color:C.x,anchor:'middle',weight:700}));
   return s;
  },
  [K+'choose']:(p)=>{
   let s=card(110,110,460,260,label('変位',340,170,{size:34,color:C.x,anchor:'middle',weight:700})+label('符号をつけて 足す',340,230,{size:28,color:C.ink,anchor:'middle'})+label('6 ＋（−2）＝ 4 m',340,300,{size:32,color:C.x,anchor:'middle',weight:700}),seg(p,.05,.2));
   s+=card(630,110,460,260,label('道のり',860,170,{size:34,color:C.hi,anchor:'middle',weight:700})+label('大きさで 足す',860,230,{size:28,color:C.ink,anchor:'middle'})+label('6 ＋ 2 ＝ 8 m',860,300,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.35));
   s+=fade(seg(p,.55,.75),label('何を求めるかで 足し方を決める',600,440,{size:30,color:C.ink,anchor:'middle',weight:700}));
   return s;
  },
  [K+'quiz']:(p)=>{
   const Q=[[0,1,4],[1,3,-1]];const A=vtS({ymin:-2,ymax:5,yticks:[-1,1,2,3,4]});
   let s=A.svg+steps(A,Q,{p:seg(p,.1,.6)});
   s+=fade(seg(p,.15,.3),label('+4',A.X(.5),A.Y(4)-14,{size:24,color:C.v,anchor:'middle'}))+fade(seg(p,.35,.5),label('−1',A.X(2),A.Y(-1)+34,{size:24,color:bad,anchor:'middle'}));
   s+=card(770,130,380,190,label('確認',960,180,{size:26,color:C.dim,anchor:'middle'})+label('変位は？',960,235,{size:32,color:C.x,anchor:'middle',weight:700})+label('道のりは？',960,290,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
   return s;
  },
  [K+'quiz2']:(p)=>{
   const Q=[[0,1,4],[1,3,-1]];const A=vtS({ymin:-2,ymax:5,yticks:[-1,1,2,3,4]});
   let s=A.svg+bar(A,0,1,4,{g:seg(p,.02,.12)})+bar(A,1,3,-1,{color:bad,g:seg(p,.15,.28)})+steps(A,Q);
   s+=fade(seg(p,.05,.15),lab(A,0,1,4,'4'))+fade(seg(p,.2,.3),label('−2',A.X(2),A.Y(-1)+32,{size:28,color:bad,anchor:'middle',weight:700}));
   s+=fade(seg(p,.02,.15),tex(cV('4')+'\\times'+cT('1')+'='+cX('4'),780,150,{size:38,auto:false,color:C.ink,anchor:'start'}));
   s+=fade(seg(p,.15,.3),tex(cV('(-1)')+'\\times'+cT('2')+'='+`{\\color{${bad}}{-2}}`,780,215,{size:38,auto:false,color:C.ink,anchor:'start'}));
   s+=fade(seg(p,.4,.6),label('変位：4 ＋（−2）＝ 2 m',780,390,{size:30,color:C.x,weight:700}));
   s+=fade(seg(p,.7,.85),label('道のり：4 ＋ 2 ＝ 6 m',780,450,{size:30,color:C.hi,weight:700}));
   return s;
  },
 };
}

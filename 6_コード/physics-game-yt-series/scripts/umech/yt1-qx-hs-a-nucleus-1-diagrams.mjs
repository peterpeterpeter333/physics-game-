// 問題編 解説「トリウム232 の帳簿」(ys-qx-hs-a-nucleus-1) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/503_原子核と放射線.md の q-hs-a-nucleus-1（解説 20 行）。
// 色（正本）：陽子・原子番号 赤、中性子 灰、電子 青、質量数 黄、合う・答え 緑、誤り 赤。
// 核の粒は 232 個描かない（38 個で描き、「粒の 数は 省略して 描いています」と注記）。
// 元の単元動画（yt1-hs-a-nucleus-1）の部品（陽子・中性子・電子・α線・まとめの画面 e2）を読み込んで使う（そのファイルは編集しない）。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
import {C,seg,fade,label,line,rect,ring,arrow,clamp,mix} from './anim.mjs';
import {proton,neutron,nucPos,mixKinds,electron,alphaP,TX,cs,okMark,PC,NUC,NEG,AC,OK,hsANucleus1Diagrams} from './yt1-hs-a-nucleus-1-diagrams.mjs';
import {card,goalTag,answerTag,answerRow,wrongSeq,kindTag,note,sentWin,voiceEnd,cueT} from './yt1-qx-common.mjs';

const K='qx-hs-a-nucleus-1:';
const BAD='#ff6b6b';
const G1='中性子の数 N',G2='質量数と原子番号',G3='α と β⁻ の回数';
const A1=g=>answerTag(1,'A','142',{g}),A2=g=>answerTag(2,'D','質量数 228、原子番号 89',{g}),A3=g=>answerTag(3,'B','α 3回、β⁻ 2回',{g});
const At=cs(AC,'A'),Zt=cs(PC,'Z'),Nt=cs(NUC,'N');
// 読みの中で、ある言葉が始まる所（cue の進み 0〜1）
const atR=(ctx,str)=>{const r=(ctx?.cue?.reading??'').replace(/\s/g,'');const i=r.indexOf(str);return i<0?.5:i/Math.max(1,r.length)*voiceEnd(ctx);};
const s2=ctx=>sentWin(ctx)[1]?.[0]??.5;   // 2文目の始まり
const PNOTE=(g=1)=>note('（粒の 数は 省略して 描いています）',600,505,{g});

// ---- 粒のかたまり（kinds：'p'/'n' の並び）。sortU で陽子と中性子を左右の2つにまとめる ----------------------------
function blob(cx,cy,kinds,{r=10,sortU=0,pc,nc,turn=-1,turnU=0,skip=null,g=1,hiN=0}={}){
 let ip=0,inn=0;
 const pos=kinds.map((k,i)=>{const [x0,y0]=nucPos(cx,cy,i,r);if(!sortU)return [x0,y0];
  const [x1,y1]=k==='p'?nucPos(pc[0],pc[1],ip++,r):nucPos(nc[0],nc[1],inn++,r);return [mix(x0,x1,sortU),mix(y0,y1,sortU)];});
 let out='',ni=0;const nOrder=kinds.map((k,i)=>k==='n'?ni++:-1);
 for(let i=kinds.length-1;i>=0;i--){if(skip&&skip.has(i))continue;const [x,y]=pos[i];
  if(i===turn)out+=neutron(x,y,r,1-turnU)+proton(x,y,r,turnU);
  else out+=kinds[i]==='p'?proton(x,y,r):neutron(x,y,r);
  if(kinds[i]==='n'&&hiN>0&&nOrder[i]<hiN)out+=ring(x,y,r+3,{color:C.hi,w:2.5});}
 return fade(g,out);
}
const TH=mixKinds(15,23,7);
const outer=(kinds,k,n)=>kinds.map((x,i)=>[x,i]).filter(([x])=>x===k).slice(-n).map(([,i])=>i);
const ALPHA=new Set([...outer(TH,'p',2),...outer(TH,'n',2)]);
const TURN=TH.findIndex((k,i)=>k==='n'&&i>6&&!ALPHA.has(i));
// 質量数（左上・黄）と原子番号（左下・赤）
const numA=(v,x,y,{g=1,size=44}={})=>fade(g,label(String(v),x,y,{size,color:AC,anchor:'middle',weight:700}));
const numZ=(v,x,y,{g=1,size=44}={})=>fade(g,label(String(v),x,y,{size,color:PC,anchor:'middle',weight:700}));
// 入れ替わる数（old → new）
const swapNum=(f,a,b,x,y,u,o={})=>f(a,x,y,{...o,g:(o.g??1)*(1-u)})+f(b,x,y,{...o,g:(o.g??1)*u});
// 元素の札
const elem=(sym,name,x,y,g=1)=>fade(g,label(sym,x,y,{size:56,color:C.ink,anchor:'middle',weight:700})+label(name,x,y+40,{size:24,color:C.dim,anchor:'middle',weight:700}));

// ---- 出題中の図（小問1・2）：トリウム232 の核、α崩壊 →、β⁻ 崩壊 →、「？」の核 -----------------------------
const Q0={x:250,y:240};
function setup0(p,{g=1,arrows=1}={}){
 const gn=seg(p,0,.35);
 let s=blob(Q0.x,Q0.y,TH,{g:gn});
 s+=numA(232,Q0.x-150,Q0.y-90,{g:gn})+numZ(90,Q0.x-150,Q0.y+110,{g:gn});
 s+=fade(gn,label('トリウム232',Q0.x,Q0.y+150,{size:26,color:C.ink,anchor:'middle',weight:700}));
 const a1=seg(p,.4,.58)*arrows,a2=seg(p,.6,.78)*arrows,a3=seg(p,.8,.95)*arrows;
 s+=arrow(410,Q0.y,610,Q0.y,{color:PC,w:5,head:16,g:a1})+fade(a1,label('α崩壊',510,Q0.y-24,{size:28,color:PC,anchor:'middle',weight:700}));
 s+=arrow(650,Q0.y,850,Q0.y,{color:NEG,w:5,head:16,g:a2})+fade(a2,label('β⁻ 崩壊',750,Q0.y-24,{size:28,color:NEG,anchor:'middle',weight:700}));
 s+=fade(a3,ring(990,Q0.y,80,{color:C.dim,w:3,dash:'10 8'})+label('？',990,Q0.y+24,{size:64,color:C.dim,anchor:'middle',weight:700}));
 return fade(g,s);
}
// ---- 小問1：陽子と中性子に分ける ------------------------------------------------------------------------
const PCL=[170,225],NCL=[420,225];
function split(u,{hiN=0,g=1,rings=1}={}){
 let s=blob(Q0.x,Q0.y,TH,{sortU:u,pc:PCL,nc:NCL,hiN,g});
 s+=fade(g*rings,ring(PCL[0],PCL[1],80,{color:PC,w:3,dash:'8 6'})+ring(NCL[0],NCL[1],98,{color:NUC,w:3,dash:'8 6'}));
 s+=fade(g*rings,label('陽子 Z 個',PCL[0],112,{size:28,color:PC,anchor:'middle',weight:700})+label('中性子 N 個',NCL[0],112,{size:28,color:NUC,anchor:'middle',weight:700}));
 return s;
}
const defEq=(g=1,op=1)=>fade(g,kindTag('定義',880,112)+fade(op,TX(`${At}=${Zt}+${Nt}`,880,185,{size:54})));
const nEq=(g=1)=>fade(g,TX(`${Nt}=${At}-${Zt}=${cs(AC,'232')}-${cs(PC,'90')}`,880,255,{size:44}));
const nRes=(g=1)=>fade(g,TX(`=${cs(NUC,'142')}`,880,318,{size:46}));
function counter(k,g=1){return fade(g,label(`${Math.round(k)} 個`,NCL[0],355,{size:30,color:NUC,anchor:'middle',weight:700}));}
// ---- 小問2：α崩壊・β⁻ 崩壊 ------------------------------------------------------------------------------
const N2={x:300,y:225},NA=[110,140],NZ=[110,330],EL=[560,235];
function nuc2({alphaU=0,alphaGone=0,turnU=0,eU=0,eGone=0,A=[232],Z=[90],el=[['Th','トリウム']],g=1}={}){
 let s=blob(N2.x,N2.y,TH,{skip:alphaU>0?ALPHA:null,turn:TURN,turnU,g});
 // α線（陽子2・中性子2）が右へ飛び出す
 if(alphaU>0){const x=mix(N2.x+60,900,alphaU),y=mix(N2.y-80,110,alphaU);s+=alphaP(x,y,{r:13,g:1-alphaGone})+fade((1-alphaGone)*seg(alphaU,.5,1),label('α線（陽子 2・中性子 2）',x,y+72,{size:24,color:PC,anchor:'middle',weight:700}));}
 if(eU>0){const [x0,y0]=nucPos(N2.x,N2.y,TURN,10);const x=mix(x0,900,eU),y=mix(y0,380,eU);s+=electron(x,y,{r:13,op:1-eGone})+fade((1-eGone)*seg(eU,.5,1),label('電子（β線）',x,y+46,{size:24,color:NEG,anchor:'middle',weight:700}));}
 const [a0,a1,au=0,ag=1]=A,[z0,z1,zu=0,zg=1]=Z;
 s+=a1===undefined?numA(a0,...NA,{g:g*ag}):swapNum(numA,a0,a1,...NA,au,{g:g*ag});
 s+=z1===undefined?numZ(z0,...NZ,{g:g*zg}):swapNum(numZ,z0,z1,...NZ,zu,{g:g*zg});
 s+=fade(g,label('質量数',NA[0],NA[1]-48,{size:22,color:AC,anchor:'middle'})+label('原子番号',NZ[0],NZ[1]+34,{size:22,color:PC,anchor:'middle'}));
 const [e0,e1,eu=0]=el;
 s+=e1?elem(...e0,...EL,g*(1-eu))+elem(...e1,...EL,g*eu):elem(...e0,...EL,g);
 return s;
}
// ---- 小問3：帳簿の棒（左端は省略）---------------------------------------------------------------------
const MX=v=>260+(v-200)*16, ZX=v=>260+(v-76)*38, MB=130, ZB=290, BH=46;
function bars({noteG=1,m=238,z=92,mT=1,zT=1,gap12=0,zGap=0,okM=0,okZ=0,g=1,zg=1}={}){
 let s=fade(g,label('質量数',60,MB+33,{size:28,color:AC,weight:700}));
 s+=fade(g,rect(260,MB,MX(m)-260,BH,{fill:AC,fo:.4,stroke:AC,rx:4})+label(String(Math.round(m)),MX(m)-12,MB+33,{size:28,color:C.ink,anchor:'end',weight:700}));
 s+=fade(g*mT,line(MX(226),MB-22,MX(226),MB+BH+22,{color:C.ink,w:2.5,dash:'7 6'})+label('ラジウム 226',MX(226),MB+BH+50,{size:24,color:C.ink,anchor:'middle',weight:700}));
 if(gap12)s+=fade(g*gap12,rect(MX(226),MB-8,MX(238)-MX(226),BH+16,{fill:'none',fo:0,stroke:C.hi,sw:3.5,rx:6})+label('差 12',(MX(226)+MX(238))/2,MB-16,{size:26,color:C.hi,anchor:'middle',weight:700}));
 s+=fade(g*zg,label('原子番号',60,ZB+33,{size:28,color:PC,weight:700}));
 s+=fade(g*zg,rect(260,ZB,ZX(z)-260,BH,{fill:PC,fo:.4,stroke:PC,rx:4})+label(String(Math.round(z)),ZX(z)-12,ZB+33,{size:28,color:C.ink,anchor:'end',weight:700}));
 s+=fade(g*zg*zT,line(ZX(88),ZB-22,ZX(88),ZB+BH+22,{color:C.ink,w:2.5,dash:'7 6'})+label('ラジウム 88',ZX(88),ZB+BH+50,{size:24,color:C.ink,anchor:'middle',weight:700}));
 if(zGap)s+=fade(g*zGap,rect(ZX(86),ZB-8,ZX(88)-ZX(86),BH+16,{fill:BAD,fo:.15,stroke:BAD,sw:3.5,rx:6})+label('2 足りない',ZX(87),ZB-16,{size:26,color:BAD,anchor:'middle',weight:700}));
 s+=fade(g,okMark(810,MB+23,okM))+fade(g*zg,okMark(810,ZB+23,okZ));
 s+=note('（棒の 左端は 省略）',150,470,{g:g*zg*noteG});
 return s;
}
// α線・電子の小さな印（飛んだ後に並ぶ）
const aIcon=(i,g=1)=>fade(g,alphaP(940+i*80,MB+23,{r:9}));
const eIcon=(i,g=1)=>fade(g,electron(940+i*80,ZB+23,{r:12}));
function flyA(u,i){const x=mix(MX(238-4*i)+24,940+i*80,u),y=mix(MB+23,MB+23-60*Math.sin(Math.PI*u),1);return u>0&&u<1?alphaP(x,y,{r:9}):'';}
function flyE(u,i){const x=mix(ZX(86+i)+24,940+i*80,u),y=ZB+23-60*Math.sin(Math.PI*u);return u>0&&u<1?electron(x,y,{r:12}):'';}
// 小問3 の出題の図：ウラン238 とラジウム226
const U238=mixKinds(15,24,3),RA226=mixKinds(14,23,9);
function q3fig(p,{g=1}={}){
 const a=seg(p,0,.35),b=seg(p,.3,.65),c=seg(p,.6,.95);
 let s=blob(220,250,U238,{g:a})+numA(238,70,165,{g:a})+numZ(92,70,345,{g:a})+fade(a,label('ウラン238',220,400,{size:26,color:C.ink,anchor:'middle',weight:700}));
 s+=blob(1030,250,RA226,{g:b})+numA(226,890,165,{g:b})+numZ(88,890,345,{g:b})+fade(b,label('ラジウム226',1030,400,{size:26,color:C.ink,anchor:'middle',weight:700}));
 s+=arrow(360,250,850,250,{color:C.dim,w:4,head:16,g:c});
 s+=card(420,150,370,80,label('α崩壊 ？回',605,203,{size:30,color:PC,anchor:'middle',weight:700}),c,PC);
 s+=card(420,280,370,80,label('β⁻ 崩壊 ？回',605,333,{size:30,color:NEG,anchor:'middle',weight:700}),c,NEG);
 return fade(g,s+PNOTE(a));
}

export const qxHsANucleus1Diagrams={
 // ================= 問題アニメ =================
 // 出題（小問1・2）：核（粒のかたまり・232・90）→「α崩壊 →」「β⁻ 崩壊 →」→「？」の核。粒の出入り・中性子の数・帳簿の増減は描かない。
 [K+'q0']:(p)=>setup0(p)+PNOTE(seg(p,0,.35)),
 // 小問3：ウラン238 とラジウム226、間に「α崩壊 ？回」「β⁻ 崩壊 ？回」
 [K+'q3']:(p)=>q3fig(p),
 // ================= S1 小問1：中性子の数 =================
 // 1. 出題中の図で始め、求めるもの
 [K+'goal1']:(p)=>setup0(1)+PNOTE()+goalTag(G1,{g:seg(p,.05,.2)}),
 // 2. 赤い粒を Z、灰の粒を N でまとめて囲む → A＝Z＋N（定義）
 [K+'def']:(p)=>{
  const out=seg(p,0,.12),u=seg(p,.1,.4);
  let s=fade(1-out,setup0(1,{arrows:1}))+fade(out,split(u,{rings:seg(p,.35,.5)}));
  s+=defEq(seg(p,.55,.7));
  return s+PNOTE()+goalTag(G1);
 },
 // 3. N＝A−Z＝232−90、灰の粒を数えて 142 で止まる → 答え A
 [K+'ans1']:(p,ctx)=>{
  const a=s2(ctx),cu=seg(p,.12,a-.04),k=142*cu;
  let s=split(1,{hiN:Math.ceil(23*cu-1e-9)})+defEq(1,.45)+nEq(seg(p,.02,.12))+counter(k,seg(p,.1,.16))+nRes(seg(p,a-.06,a));
  return s+PNOTE()+goalTag(G1)+A1(seg(p,a,a+.05));
 },
 // 4. 誤答 B・C（1枚ずつ）
 [K+'wrongBC']:(p,ctx)=>{
  const c=atR(ctx,'スィーは');
  let s=fade(.5,split(1,{hiN:23})+defEq(1,.45)+nEq()+nRes());
  return s+goalTag(G1)+A1(1)+wrongSeq(p,ctx,[['B','232','質量数を そのまま 使った'],['C','90','陽子の 数と 取り違えた']],{win:[[0,c],[c,1]]});
 },
 // 5. 誤答 D
 [K+'wrongD']:(p,ctx)=>{
  let s=fade(.5,split(1,{hiN:23})+defEq(1,.45)+nEq()+nRes());
  return s+goalTag(G1)+A1(1)+wrongSeq(p,ctx,[['D','322','N＝A＋Z と 逆にした']]);
 },
 // ================= S2 小問2：2回の崩壊 =================
 // 6. トリウム232 の核
 [K+'goal2']:(p)=>nuc2({g:seg(p,0,.15)})+PNOTE(seg(p,0,.15))+goalTag(G2,{g:seg(p,.05,.2)}),
 // 7. α線（陽子2・中性子2）が飛び出す → 質量数 −4、原子番号 −2
 [K+'alpha']:(p,ctx)=>{
  const a=s2(ctx),u=seg(p,.08,a-.05);
  let s=nuc2({alphaU:Math.max(u,1e-4)});
  const g2=seg(p,a+.05,a+.18),g3=seg(p,a+.3,a+.45);
  s+=fade(g2,label('−4',NA[0]+80,NA[1],{size:40,color:AC,anchor:'middle',weight:700}))+fade(g3,label('−2',NZ[0]+80,NZ[1],{size:40,color:PC,anchor:'middle',weight:700}));
  return s+PNOTE()+goalTag(G2);
 },
 // 8. 232→228、90→88、Th→Ra
 [K+'ra']:(p,ctx)=>{
  const a=s2(ctx),u=seg(p,.05,.3),v=seg(p,a+.1,a+.3);
  let s=nuc2({alphaU:1,alphaGone:seg(p,.6,.8),A:[232,228,u],Z:[90,88,u],el:[['Th','トリウム'],['Ra','ラジウム'],v]});
  s+=fade(1-u,label('−4',NA[0]+80,NA[1],{size:40,color:AC,anchor:'middle',weight:700})+label('−2',NZ[0]+80,NZ[1],{size:40,color:PC,anchor:'middle',weight:700}));
  return s+PNOTE()+goalTag(G2);
 },
 // 9. 中性子1個 → 陽子、電子が飛び出す
 [K+'beta']:(p)=>{
  const t=seg(p,.15,.45),e=seg(p,.4,.85);
  let s=nuc2({alphaU:1,alphaGone:1,turnU:t,eU:Math.max(e,1e-4),A:[228],Z:[88],el:[['Ra','ラジウム']]});
  const [x0,y0]=nucPos(N2.x,N2.y,TURN,10);
  s+=fade(seg(p,.05,.15)*(1-seg(p,.85,.95)),ring(x0,y0,20,{color:C.hi,w:3}));
  s+=fade(seg(p,.1,.2),label('中性子 → 陽子',N2.x,N2.y+150,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s+PNOTE()+goalTag(G2);
 },
 // 10. 228 のまま（緑の印）、88→89、Ra→Ac
 [K+'ac']:(p,ctx)=>{
  const a=s2(ctx),z=seg(p,a+.1,a+.3);
  let s=nuc2({alphaU:1,alphaGone:1,turnU:1,eU:1,eGone:seg(p,.0,.15),A:[228],Z:[88,89,z],el:[['Ra','ラジウム'],['Ac','アクチニウム'],z]});
  s+=okMark(NA[0]+80,NA[1]-14,seg(p,.2,.3))+fade(seg(p,.2,.3),label('そのまま',NA[0]+80,NA[1]+30,{size:22,color:OK,anchor:'middle',weight:700}));
  s+=fade(seg(p,a+.15,a+.3),label('＋1',NZ[0]+80,NZ[1],{size:40,color:PC,anchor:'middle',weight:700}));
  return s+PNOTE()+goalTag(G2);
 },
 // 11. 答え D → 誤答 A
 [K+'ans2']:(p,ctx)=>{
  const a=s2(ctx);
  let s=fade(1-.5*seg(p,a,a+.05),nuc2({alphaU:1,alphaGone:1,turnU:1,A:[228],Z:[89],el:[['Ac','アクチニウム']]}));
  return s+goalTag(G2)+A2(seg(p,.03,.1))+wrongSeq(p,ctx,[['A','228、87','β⁻ で 原子番号は 1 増える']],{win:[[a,1]],opts:{x:220}});
 },
 // 12. 誤答 B
 [K+'wrong2B']:(p,ctx)=>fade(.5,nuc2({alphaU:1,alphaGone:1,turnU:1,A:[228],Z:[89],el:[['Ac','アクチニウム']]}))+goalTag(G2)+A2(1)
  +wrongSeq(p,ctx,[['B','227、89','電子の 質量数は 0']],{win:[[0,1]],opts:{x:220}}),
 // 13. 誤答 C
 [K+'wrong2C']:(p,ctx)=>fade(.5,nuc2({alphaU:1,alphaGone:1,turnU:1,A:[228],Z:[89],el:[['Ac','アクチニウム']]}))+goalTag(G2)+A2(1)
  +wrongSeq(p,ctx,[['C','230、89','α線は 陽子 2 ＋ 中性子 2（質量数 4）']],{win:[[0,1]],opts:{x:220}}),
 // ================= S3 小問3：崩壊の回数 =================
 // 14. 暗転してウラン238 とラジウム226
 [K+'goal3']:(p)=>q3fig(Math.min(1,p*3))+goalTag(G3,{g:seg(p,.05,.2)}),
 // 15. 質量数の帳簿：差 12 → α線が3個、1個ごとに棒が 4 縮む → 12÷4＝3
 [K+'massA']:(p,ctx)=>{
  const a=s2(ctx),k=[0,1,2].map(i=>seg(p,a+.08+i*.15,a+.2+i*.15));
  const m=238-4*(k[0]+k[1]+k[2]);
  let s=bars({m,zg:0,gap12:seg(p,.1,.25)});
  k.forEach((u,i)=>{s+=flyA(u,i)+aIcon(i,u>=.999?1:0);});
  s+=fade(seg(p,.88,.96),label('12 ÷ 4 ＝ 3 回',1020,MB+110,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s+goalTag(G3);
 },
 // 16. 原子番号の棒：92 から 2 ずつ3回縮んで 86 → 88 との差 2（赤）
 [K+'zA']:(p,ctx)=>{
  const a=s2(ctx),k=[0,1,2].map(i=>seg(p,.05+i*.13,.15+i*.13));
  const z=92-2*(k[0]+k[1]+k[2]);
  let s=bars({m:226,z,zg:seg(p,0,.06),zGap:seg(p,a+.1,a+.25)});
  [0,1,2].forEach(i=>{s+=aIcon(i);});
  s+=fade(.6,label('12 ÷ 4 ＝ 3 回',1020,MB+110,{size:32,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.05,.15),label('α崩壊 1回で −2',1020,ZB+110,{size:26,color:PC,anchor:'middle',weight:700}));
  return s+goalTag(G3);
 },
 // 17. 電子が2個 → 86 から 88 へ。答え B
 [K+'ans3']:(p,ctx)=>{
  const a=s2(ctx),k=[0,1].map(i=>seg(p,.1+i*.2,.28+i*.2));
  const z=86+k[0]+k[1];
  let s=bars({m:226,z,zGap:1-seg(p,.4,.5)});
  [0,1,2].forEach(i=>{s+=aIcon(i);});
  k.forEach((u,i)=>{s+=flyE(u,i)+eIcon(i,u>=.999?1:0);});
  s+=fade(.6,label('12 ÷ 4 ＝ 3 回',1020,MB+110,{size:32,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.6),label('β⁻ 崩壊 2 回',1020,ZB+110,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s+goalTag(G3)+A3(seg(p,a,a+.05));
 },
 // 18. 確かめ：238−12＝226、92−6＋2＝88。2本の棒に緑の印
 [K+'check']:(p,ctx)=>{
  const a=atR(ctx,'げんしばんごうは'),b=s2(ctx);
  let s=bars({m:226,z:88,mT:1,zT:1,okM:seg(p,b,b+.08),okZ:seg(p,b,b+.08)});
  [0,1,2].forEach(i=>{s+=aIcon(i,1-seg(p,0,.05));});[0,1].forEach(i=>{s+=eIcon(i,1-seg(p,0,.05));});
  s+=card(880,MB-20,300,86,label('238 − 12 ＝ 226',1030,MB+35,{size:30,color:AC,anchor:'middle',weight:700}),seg(p,.05,.15),AC);
  s+=card(880,ZB-20,300,86,label('92 − 6 ＋ 2 ＝ 88',1030,ZB+35,{size:30,color:PC,anchor:'middle',weight:700}),seg(p,a,a+.1),PC);
  return s+goalTag(G3)+A3(1);
 },
 // 19. 誤答 A・C・D（1枚ずつ）
 [K+'wrong3']:(p,ctx)=>{
  const c=atR(ctx,'スィーは'),d=atR(ctx,'ディーは');
  let s=fade(.45,bars({m:226,z:88,okM:1,okZ:1,zg:1,zT:0,noteG:0}));
  return s+goalTag(G3)+A3(1)+wrongSeq(p,ctx,[['A','α2・β⁻0','質量数が 230 で 合わない'],['C','α3・β⁻0','原子番号が 86 で 合わない'],['D','α6・β⁻0','質量数が 214 で 合わない']],{win:[[0,c],[c,d],[d,1]],opts:{y:350}});
 },
 // ================= S4 まとめ：元の単元動画のまとめの画面（e2）=================
 [K+'sum']:(p,ctx)=>{
  const ve=voiceEnd(ctx);
  return hsANucleus1Diagrams['hs-a-nucleus-1:e2'](p,ctx)+answerRow([[1,'A',''],[2,'D',''],[3,'B','']],{g:seg(p,ve,Math.min(1,ve+.06))});
 },
};

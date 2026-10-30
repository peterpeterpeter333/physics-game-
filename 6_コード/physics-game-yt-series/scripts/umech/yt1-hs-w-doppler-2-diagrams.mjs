// 高校編「ドップラー効果・深く学ぶ 2/3」(ys-hs-w-doppler-2) — 図。Stage 1200×515.
// 1/3 の部品（円の山の図、コマ送り、カード）を使う。後方のコマ送りは dir＝−1（山1は左の聞き手へ、音源は右へ）。
// 周波数のグラフ：一直線の通過は段差（425 Hz → 約378 Hz）。道路の脇を通る場合はなめらかな曲線（形だけ。数値は出さない）。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,poly,clamp,mix,axes} from './anim.mjs';
import {card,tag,T2,tSince,LC,TCOL,FC,VCOL,MK,Lt,Tt,ft,HZ,MS,MM,SS,
 SC,WF,Vt,vst,fp,eqRow,LF,LB,siren,listener,WP,srcX,fronts,crestEdges,dbl,plate,dopplerScene,frameBy,FB,train} from './yt1-hs-w-doppler-1-diagrams.mjs';

const K='hs-w-doppler-2:';
const FBB={...FB,x0:880};          // back side: emission point on the right, crest 1 travels left
const back=(o={})=>frameBy({o:FBB,dir:-1,lis:80,...o});
// listener behind the receding source
const recede=(t,o={})=>{const xs0=o.xs0??520;let s=fronts(t,{xs0})+siren(srcX(t,WP,WP.k,xs0),WP.y,{lab:''})+listener(130,WP.y-40,{lab:'聞き手'});return s;};
// both gaps on the wavefront picture
function bothGaps(t,{xs0=600,g=1,nums=1}={}){
 let s='';const f=crestEdges(t,{xs0,side:1,count:2}).sort((a,b)=>a-b),b=crestEdges(t,{xs0,side:-1,count:2}).sort((a,b)=>a-b);
 s+=dbl(f[0],f[1],WP.y+112,LC)+plate(nums?'0.80 m':'詰まる',(f[0]+f[1])/2,WP.y+152,{color:LC});
 s+=dbl(b[0],b[1],WP.y+112,LC)+plate(nums?'0.90 m':'広がる',(b[0]+b[1])/2,WP.y+152,{color:LC});
 return fade(g,s);
}
// ---- frequency vs time graph ------------------------------------------------------------------
const GA={x:150,y:430,w:880,h:330,xmin:-1,xmax:1,ymin:350,ymax:450};
const Y=f=>GA.y-GA.h*(f-GA.ymin)/(GA.ymax-GA.ymin), X=u=>GA.x+GA.w*(u-GA.xmin)/(GA.xmax-GA.xmin);
const F1=425,F2=400*340/360;
function graph({g=1,step=1,u=1,smooth=0,ref=1,labels=1,mark=0}={}){
 let s=line(GA.x,GA.y,GA.x+GA.w+20,GA.y,{color:C.dim,w:3})+line(GA.x,GA.y,GA.x,GA.y-GA.h-10,{color:C.dim,w:3});
 s+=label('時刻',GA.x+GA.w+20,GA.y+40,{size:24,color:TCOL,anchor:'end',weight:700})+label('聞こえる 振動数',GA.x+10,GA.y-GA.h-20,{size:24,color:FC,weight:700});
 if(ref)s+=line(GA.x,Y(400),GA.x+GA.w,Y(400),{color:C.faint,w:2,dash:'6 8'})+label('400 Hz',GA.x-12,Y(400)+8,{size:22,color:C.dim,anchor:'end'});
 s+=line(X(0),GA.y,X(0),GA.y-GA.h,{color:C.faint,w:2,dash:'4 6'})+label('通過',X(0),GA.y+34,{size:24,color:C.dim,anchor:'middle'});
 if(step){const ue=mix(-1,1,u);
  s+=line(X(-1),Y(F1),X(Math.min(0,ue)),Y(F1),{color:FC,w:5});
  if(ue>0)s+=line(X(0),Y(F1),X(0),Y(F2),{color:FC,w:5})+line(X(0),Y(F2),X(ue),Y(F2),{color:FC,w:5});
  if(labels)s+=label('425 Hz',GA.x-12,Y(F1)+8,{size:24,color:FC,anchor:'end',weight:700})+(ue>0?label('約378 Hz',GA.x-12,Y(F2)+8,{size:24,color:FC,anchor:'end',weight:700}):'');}
 if(smooth){const d=.18,f=x=>400*340/(340-20*(-x/Math.hypot(x,d)));const pts=[];for(let x=-1;x<=1.0001;x+=.01)pts.push([X(x),Y(f(x))]);s+=draw(pts,smooth,{color:C.hi,w:4});}
 if(mark)s+=fade(mark,arrow(X(0)+60,Y(F1)+6,X(0)+60,Y(F2)-6,{color:C.hi,w:4,head:14})+plate('約 47 Hz',X(0)+80,(Y(F1)+Y(F2))/2+8,{size:26,color:C.hi,anchor:'start'}));
 return fade(g,s);
}
// ---- roadside, seen from above ------------------------------------------------------------------
const RD={y:150,lx:600,ly:400};
function roadside(xc,{g=1,comp=1,lab=1}={}){
 let s=line(40,RD.y+40,1160,RD.y+40,{color:C.dim,w:3})+line(40,RD.y-40,1160,RD.y-40,{color:C.dim,w:3});
 for(let x=60;x<1160;x+=90)s+=line(x,RD.y,x+40,RD.y,{color:C.faint,w:3});
 s+=dot(RD.lx,RD.ly,20,'#e9c7a6')+label('聞き手（上から 見た 図）',RD.lx,RD.ly+56,{size:24,color:C.dim,anchor:'middle',weight:700});
 s+=siren(xc,RD.y,{lab:'',s:.8});
 s+=arrow(xc+50,RD.y-62,xc+190,RD.y-62,{color:VCOL,w:5,head:16})+tex(vst,xc+120,RD.y-88,{size:32});
 if(comp){const dx=RD.lx-xc,dy=RD.ly-RD.y,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,c=140*ux; // projection of (140,0) on u
  s+=fade(comp,line(xc,RD.y,RD.lx,RD.ly,{color:C.faint,w:2,dash:'6 8'}));
  if(Math.abs(c)>4)s+=arrow(xc,RD.y,xc+c*ux,RD.y+c*uy,{color:c>0?C.hi:SC,w:6,head:16,g:comp});
  if(lab)s+=plate(Math.abs(c)<8?'聞き手に 向かう 部分：0':c>0?'聞き手に 向かう 部分':'聞き手から 離れる 部分',xc+(c>0?40:-40),RD.y+120,{size:24,color:Math.abs(c)<8?C.dim:c>0?C.hi:SC,anchor:c>0?'start':'end',g:comp});}
 return fade(g,s);
}

export const hsWDoppler2Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p)=>{
  let s=recede(0);
  s+=plate('後ろ側の 波長は？',250,470,{size:30,color:LC,g:seg(p,.3,.45)});
  s+=plate('聞こえる 振動数は？',820,470,{size:30,color:FC,g:seg(p,.6,.75)});
  return s;
 },
 [K+'q2']:(p)=>card(200,110,800,200,label('通り過ぎると、なぜ ガクッと 下がる？',600,222,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
 [K+'recap']:(p)=>{
  let s=frameBy({u:1,vt:1,vst:1,c2:1,gap:1,nums:1,g:.9});
  s+=card(200,4,800,132,label('前回：近づく 音源の 前方',600,52,{size:26,color:C.dim,anchor:'middle'})+label('0.85 m → 0.80 m、425 Hz',600,108,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'cond']:(p)=>{
  let s=fade(.4,dopplerScene(0,{note:0}));
  s+=card(150,30,900,170,label('空気は 静止・同じ 一直線上',600,90,{size:32,color:C.ink,anchor:'middle',weight:700})+T2(`${Vt}=340${MS},\\ \\ ${ft}=400${HZ},\\ \\ ${vst}=20${MS}`,600,155,{size:38}),seg(p,.05,.2),C.dim);
  s+=tag('仮定',1080,60,{color:C.dim,g:seg(p,.3,.45)});
  return s;
 },
 [K+'pred']:(p)=>{
  let s=fade(.55,recede(0));
  s+=card(250,20,700,150,label('後方の 波長は 0.85 m より',600,80,{size:32,color:C.ink,anchor:'middle',weight:700})+label('長い？　短い？',600,140,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 // ================= S2 後方の山の間隔 =================
 [K+'setup']:(p)=>{
  let s=back({u:0});
  s+=arrow(FBB.x0+60,FB.y-80,FBB.x0+200,FB.y-80,{color:VCOL,w:5,head:16,g:seg(p,.45,.6)})+fade(seg(p,.45,.6),label('離れる',FBB.x0+130,FB.y-100,{size:26,color:VCOL,anchor:'middle',weight:700}));
  s+=fade(seg(p,.05,.2),label('聞き手は 後ろ',80,FB.y+160,{size:26,color:C.ink,anchor:'start',weight:700}));
  return s;
 },
 [K+'f1']:(p)=>{
  const u=lin(p,.2,.8);
  return back({u,vt:seg(p,.2,.35)});
 },
 [K+'f2']:(p)=>back({u:1,vt:1,vst:seg(p,.1,.3),c2:seg(p,.6,.75)}),
 [K+'gap']:(p)=>back({u:1,vt:1,vst:1,c2:1,gap:seg(p,.15,.35)}),
 [K+'form']:(p)=>{
  const o=seg(p,.5,.65);
  return back({u:1,vt:1,vst:1,c2:1,gap:1,g:.65})+card(250,4,700,132,fade(1-o,eqRow([...LB,`=${Vt}${Tt}+${vst}${Tt}`],600,72,{size:46}))+fade(o,eqRow([...LB,`=(${Vt}+${vst})${Tt}`],600,72,{size:46})),seg(p,.05,.2),LC);
 },
 [K+'subst']:(p)=>{
  const o=seg(p,.1,.3);
  let s=back({u:1,vt:1,vst:1,c2:1,gap:1,g:.65});
  s+=card(250,4,700,132,fade(1-o,eqRow([...LB,`=(${Vt}+${vst})${Tt}`],600,72,{size:46}))+fade(o,eqRow([...LB,`=\\dfrac{${Vt}+${vst}}{${ft}}`],600,84,{size:42})),1,LC);
  s+=fade(o,label('T＝1/f を 代入',1060,66,{size:24,color:TCOL,anchor:'middle',weight:700}));
  s+=tag('導いた 結果',1060,160,{color:C.hi,g:seg(p,.6,.75)});
  return s;
 },
 [K+'num']:(p)=>{
  let s=back({u:1,vt:1,vst:1,c2:1,gap:1,nums:1,vtLab:1});
  s+=card(250,4,700,132,eqRow([...LB,'=0.85+0.050=0.90\\ \\mathrm{m}'],600,72,{size:42}),seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.6,.75),label('長くなる',1060,90,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'chase']:(p)=>{
  let s=back({u:1,vt:1,vst:1,c2:1,gap:1,g:.5});
  s+=card(120,10,450,110,label('前方：山を 追いかける',345,60,{size:28,color:C.ink,anchor:'middle',weight:700})+label('→ 詰まる',345,98,{size:24,color:LC,anchor:'middle',weight:700}),seg(p,.05,.2),C.dim);
  s+=card(630,10,450,110,label('後方：山から 逃げる',855,60,{size:28,color:C.hi,anchor:'middle',weight:700})+label('→ 広がる',855,98,{size:24,color:LC,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'both']:(p)=>{
  let s=dopplerScene(0,{xs0:600,lis:0,note:0});
  s+=bothGaps(0,{xs0:600,g:seg(p,.1,.3)});
  s+=card(70,10,330,90,label('後ろ：足し算',235,66,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  s+=card(800,10,330,90,label('前：引き算',965,66,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 // ================= S3 聞こえる振動数 =================
 [K+'pass']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'pass');
  let s=train(-t,{sp:93,lx:250});
  s+=arrow(700,140,500,140,{color:VCOL,w:6,head:18,g:seg(p,.2,.35)})+fade(seg(p,.2,.35),tex(Vt,600,110,{size:40}));
  s+=fade(seg(p,.4,.55),label('山の 間隔 0.90 m',800,430,{size:28,color:LC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'num1']:(p)=>{
  let s=card(200,40,800,140,T2(`${fp}=340\\div 0.90\\approx 378${HZ}`,600,120,{size:50}),seg(p,.05,.2),FC);
  s+=card(300,260,600,110,T2(`400${HZ}\\ \\rightarrow\\ \\approx 378${HZ}`,600,325,{size:44}),seg(p,.5,.65),FC);
  s+=fade(seg(p,.6,.75),label('低く 聞こえる',600,430,{size:30,color:FC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'gen']:(p)=>{
  let s=card(200,40,800,130,eqRow([`${fp}=${Vt}\\div`,...LB],600,108,{size:50}),seg(p,.05,.2),FC);
  s+=card(200,240,800,130,eqRow([...LB,`=\\dfrac{${Vt}+${vst}}{${ft}}`],600,322,{size:44}),seg(p,.45,.6),LC);
  s+=fade(seg(p,.6,.75),label('↑ ここへ 代入',600,215,{size:24,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'div']:(p)=>{
  let s=card(150,40,900,150,T2(`${fp}=${Vt}\\div\\dfrac{${Vt}+${vst}}{${ft}}`,600,132,{size:48}),1,FC);
  s+=fade(seg(p,.1,.25),label('分数で 割る ＝ 逆数を 掛ける',600,250,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=card(150,300,900,150,T2(`${fp}=${ft}\\times\\dfrac{${Vt}}{${Vt}+${vst}}`,600,392,{size:50}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'den']:(p)=>{
  let s=card(150,40,900,150,T2(`${fp}=${ft}\\times\\dfrac{${Vt}}{${Vt}+${vst}}`,600,132,{size:50}),1,C.hi);
  s+=fade(seg(p,.1,.25),label('分母 V＋vs は V より 大きい',600,260,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=card(300,316,600,134,T2(`\\dfrac{${Vt}}{${Vt}+${vst}}<1`,600,400,{size:44}),seg(p,.35,.5),C.hi);
  s+=fade(seg(p,.6,.75),label('→ f′ ＜ f（低く 聞こえる）',600,485,{size:28,color:FC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'chk']:(p)=>{
  let s=card(150,40,900,150,T2(`${fp}=${ft}\\times\\dfrac{${Vt}}{${Vt}+${vst}}`,600,132,{size:50}),1,C.hi);
  s+=card(150,260,900,150,T2(`400\\times\\dfrac{340}{340+20}=400\\times\\dfrac{340}{360}\\approx 378${HZ}`,600,348,{size:42}),seg(p,.05,.2),FC);
  s+=fade(seg(p,.6,.75),label('波長から 求めた 値と 一致',600,470,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'cmp']:(p)=>{
  let s=card(80,60,500,170,T2(`${ft}\\times\\dfrac{${Vt}}{${Vt}-${vst}}`,330,160,{size:50}),1,C.dim)+card(620,60,500,170,T2(`${ft}\\times\\dfrac{${Vt}}{${Vt}+${vst}}`,870,160,{size:50}),1,C.dim);
  s+=label('前方（近づく）',330,40,{size:24,color:C.dim,anchor:'middle'})+label('後方（遠ざかる）',870,40,{size:24,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.3,.45),arrow(368,290,368,238,{color:C.hi,w:4,head:14})+arrow(914,290,914,238,{color:C.hi,w:4,head:14}));
  s+=fade(seg(p,.5,.65),label('違いは 分母の 符号 だけ',600,330,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'zero']:(p)=>{
  let s=card(80,40,500,150,T2(`${ft}\\times\\dfrac{${Vt}}{${Vt}-${vst}}`,330,132,{size:46}),1,C.dim)+card(620,40,500,150,T2(`${ft}\\times\\dfrac{${Vt}}{${Vt}+${vst}}`,870,132,{size:46}),1,C.dim);
  s+=fade(seg(p,.05,.2),label('前方',330,30,{size:24,color:C.dim,anchor:'middle'})+label('後方',870,30,{size:24,color:C.dim,anchor:'middle'}));
  s+=card(300,260,600,120,T2(`${vst}=0\\ \\Rightarrow\\ ${fp}=${ft}\\times\\dfrac{${Vt}}{${Vt}}=${ft}`,600,330,{size:40}),seg(p,.15,.3),C.hi);
  s+=fade(seg(p,.6,.75),label('止まった 音源：高さは 変わらない',600,450,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S4 通り過ぎる瞬間 =================
 [K+'pass1']:(p,ctx)=>{
  const d=ctx?ctx.dur:8,t=(ctx?ctx.t:p*8)-d-3,xs0=600;
  let s=dopplerScene(t,{xs0,lis:600,note:0});
  return s;
 },
 [K+'ask']:(p)=>{
  let s=fade(.45,dopplerScene(-3,{xs0:600,lis:600,note:0}));
  s+=card(250,20,700,150,label('通り過ぎるとき、高さは',600,80,{size:32,color:C.ink,anchor:'middle',weight:700})+label('なめらかに？　一度に？',600,140,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'switch']:(p,ctx)=>{
  const d=ctx?ctx.dur:8,t=(ctx?ctx.t:p*8)-d*.5,xs0=600,x=srcX(t,WP,WP.k,xs0);
  let s=dopplerScene(t,{xs0,lis:600,note:0});
  s+=plate(x<600?'前方：425 Hz':'後方：約 378 Hz',600,70,{size:34,color:x<600?C.hi:LC});
  return s;
 },
 [K+'graph']:(p)=>graph({u:lin(p,.2,.9),labels:1,g:seg(p,0,.15)}),
 [K+'jump']:(p)=>graph({u:1,mark:seg(p,.6,.75)}),
 [K+'gaku']:(p)=>graph({u:1,mark:1})+card(700,40,420,90,label('これが「ガクッ」',910,98,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi),
 [K+'mis']:(p)=>{
  let s=graph({u:1});
  const pts=[];for(let x=-1;x<=0;x+=.02)pts.push([X(x),Y(mix(402,440,(x+1)))]);
  s+=fade(seg(p,.05,.2),draw(pts,1,{color:C.a,w:4,dash:'8 8'})+label('× だんだん 高くなる',X(-.55),Y(440)-4,{size:28,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),plate('○ 近づくあいだは ずっと 425 Hz',X(-.5),Y(F2)+60,{size:26,color:FC}));
  return s;
 },
 // ================= S5 実際の道路では =================
 [K+'road']:(p,ctx)=>roadside(mix(150,350,lin(p,0,1)),{comp:0}),
 [K+'comp']:(p)=>roadside(350,{comp:seg(p,.2,.4)}),
 [K+'change']:(p)=>{const u=lin(p,.05,.9);return roadside(mix(350,940,u),{comp:1});},
 [K+'side']:(p)=>roadside(RD.lx,{comp:1})+plate('元の 高さの まま',RD.lx+250,RD.ly-30,{size:28,color:C.hi,g:seg(p,.4,.55)}),
 [K+'smooth']:(p)=>graph({u:1,smooth:seg(p,.1,.5),labels:1})+fade(seg(p,.6,.75),plate('黄：道路の 脇を 通る 場合（形だけ）',830,Y(445),{size:24,color:C.hi})),
 // ================= S6 まとめと次 =================
 [K+'sum']:(p)=>{
  let s=dopplerScene(0,{xs0:600,lis:0,note:0});
  s+=bothGaps(0,{xs0:600,nums:0});
  s+=card(400,10,400,80,label('V は どちらも 同じ',600,62,{size:28,color:VCOL,anchor:'middle',weight:700}),seg(p,.55,.7),VCOL);
  return s;
 },
 [K+'mis2']:(p)=>{
  let s=fade(.4,dopplerScene(0,{xs0:600,lis:0,note:0})+bothGaps(0,{xs0:600,nums:0}));
  s+=card(150,20,900,150,label('× 遠ざかるときも V − vs',600,80,{size:32,color:C.a,anchor:'middle',weight:700})+label('毎回、詰まるか 広がるかの 図から 作る',600,140,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.a);
  return s;
 },
 [K+'ans']:(p,ctx)=>{
  const d=ctx?ctx.dur:8,t=(ctx?ctx.t:p*8)-d*.4,xs0=600,x=srcX(t,WP,WP.k,xs0);
  let s=dopplerScene(t,{xs0,lis:600,note:0});
  s+=plate(x<600?'前方：0.80 m':'後方：0.90 m',600,70,{size:34,color:LC});
  return s;
 },
 [K+'ans2']:(p)=>graph({u:1,mark:1})+card(700,40,420,90,label('425 Hz → 約 378 Hz',910,98,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi),
 [K+'next1']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'next1'),lx=1050-60*clamp(t/8);
  let s=fronts(t,{k:0,xs0:300})+siren(300,WP.y,{lab:''})+plate('止まった 音源',300,WP.y+90,{size:24,color:C.dim})+listener(lx,WP.y-40,{lab:''});
  s+=arrow(lx-30,WP.y-90,lx-150,WP.y-90,{color:VCOL,w:5,head:16,g:seg(p,.2,.35)})+plate('聞き手が 近づく',lx-90,WP.y-110,{size:24,color:VCOL,g:seg(p,.2,.35)});
  s+=plate('波長は 変わる？',600,480,{size:30,color:LC,g:seg(p,.5,.65)});
  return s;
 },
 [K+'next2']:(p)=>card(200,110,800,200,label('聞き手が 動くと、何が 変わる？',600,222,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
 [K+'bye']:(p)=>{
  let s=card(200,110,800,200,label('次の回',600,170,{size:26,color:C.dim,anchor:'middle'})+label('聞き手が 動く 場合',600,250,{size:42,color:C.hi,anchor:'middle',weight:700}),1,C.hi);
  s+=fade(seg(p,.3,.5),label('ドップラー効果・深く学ぶ 3/3 へ',1080,470,{size:26,color:C.dim,anchor:'end'}));
  return s;
 },
};

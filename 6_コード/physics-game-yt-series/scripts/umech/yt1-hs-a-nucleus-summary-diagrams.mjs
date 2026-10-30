// 高校編「原子核と放射線・要点」(ys-hs-a-nucleus-summary) — 図。Stage 1200×515.
// 深く学ぶ 1/3〜3/3 の部品と数値例（1000 個の表、8 日・16 日・24 日、重水素 0.12 %・2.2 MeV・70 万倍）をそのまま使う。
import {C,seg,fade,label,line,arrow} from './anim.mjs';
import {card,tag,TX,fcard,cs,cross,okMark,nucBalls,C12,legend,At,Zt,Nt} from './yt1-hs-a-nucleus-1-diagrams.mjs';
import {grid,RUN1,counter,htable,hgraph,GA,wordFormula,days,HALF,Tt,LIVE,HC,BAD,OK} from './yt1-hs-a-nucleus-2-diagrams.mjs';
import {balance,logBars,DMC2,MC2,EC} from './yt1-hs-a-nucleus-3-diagrams.mjs';

const K='hs-a-nucleus-summary:';

export const hsANucleusSummaryDiagrams={
 // ================= 結論 =================
 [K+'k1']:(p)=>nucBalls(250,260,C12,{r:26})+legend(520,90,{g:seg(p,.1,.25)})+fcard(520,180,600,170,`${At}=${Zt}+${Nt}`,{size:68,col:C.hi,g:seg(p,.5,.65)}),
 [K+'k2']:(p)=>htable({dec:0,x:120,y:90})+hgraph({pts:4,curve:seg(p,.1,.5)})+fade(seg(p,.5,.65),label('T ごとに ×½',290,440,{size:32,color:HC,anchor:'middle',weight:700})),
 [K+'k3']:(p)=>balance(600,170,{u:seg(p,.1,.4),g:.5})+fcard(300,40,600,130,DMC2,{size:60,col:EC,g:seg(p,.45,.6)}),
 // ================= なぜ？ =================
 [K+'k1b']:(p)=>{
  let s=nucBalls(250,260,C12,{r:26});
  s+=card(520,90,600,140,TX(`${Zt}`,600,175,{size:56})+label('元素の 種類を 決める',880,170,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=card(520,280,600,140,TX(`${At}`,600,365,{size:56})+label('個数（kg では ない）',880,360,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'w2b']:(p)=>htable({reveal:[1,seg(p,.1,.25),seg(p,.3,.45),seg(p,.5,.65)],hl:[1,2,3].filter(i=>seg(p,.1+(i-1)*.2,.25+(i-1)*.2)>.5)})+fade(seg(p,.1,.25),label('（平均の 数）',760,150,{size:30,color:LIVE,weight:700})),
 [K+'m2b']:(p)=>hgraph({o:{...GA,x:150,w:900},pts:4,curve:1})+card(620,90,460,120,label('同じ 割合（½）ずつ',850,165,{size:34,color:HC,anchor:'middle',weight:700}),seg(p,.1,.25),HC),
 [K+'w1']:(p)=>{
  let s='';for(let i=0;i<5;i++){const x=160+i*220,g=seg(p,.02+i*.05,.15+i*.05);s+=nucBalls(x,190,C12,{r:12,g})+fade(g,label('同じ 確率',x,300,{size:24,color:HC,anchor:'middle',weight:700}));}
  s+=fade(seg(p,.55,.7),label('できてからの 時間に よらない',600,420,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'w2']:(p)=>htable({reveal:[1,1,seg(p,.3,.45),seg(p,.45,.6)]})+fade(seg(p,.05,.2),label('核は 年を とらない',900,200,{size:32,color:C.hi,anchor:'middle',weight:700})),
 [K+'w3']:(p)=>card(100,140,1000,170,wordFormula(560,240,{size:36}),seg(p,.3,.45),LIVE),
 // ================= 数値例 =================
 [K+'n1']:(p)=>fade(seg(p,.05,.2),label('半減期 8 日',600,200,{size:44,color:C.t,anchor:'middle',weight:700})),
 [K+'n2']:(p)=>days(p,3),
 [K+'n3']:(p)=>balance(600,150,{u:seg(p,.2,.5)})+fade(seg(p,.55,.7),label('約 0.12 % 軽い',950,40,{size:30,color:HC,anchor:'middle',weight:700})),
 [K+'n4']:(p)=>logBars({g:seg(p,.02,.2)})+fade(seg(p,.5,.65),label('約 70万 倍',1000,220,{size:36,color:HC,anchor:'middle',weight:700})),
 // ================= よくある間違い =================
 [K+'m1']:(p)=>hgraph({o:{...GA,x:150,w:900},pts:1,curve:0,lin:seg(p,.1,.3)})+cross(150+2/4.3*900,440,30,seg(p,.5,.65)),
 [K+'m2']:(p)=>hgraph({o:{...GA,x:150,w:900},pts:2,curve:seg(p,.05,.4)})+fade(seg(p,.55,.7),label('2T 後： 4分の1',150+2/4.3*900+20,440-250/1100*340-24,{size:30,color:HC,weight:700})),
 [K+'m3']:(p)=>card(150,100,420,260,label('1個の 寿命',360,215,{size:38,color:BAD,anchor:'middle',weight:700})+cross(360,200,70,seg(p,.1,.25)),seg(p,.02,.15),BAD)
  +card(630,100,420,260,label('たくさんの 核の',840,200,{size:30,color:OK,anchor:'middle',weight:700})+label('平均の 決まり',840,260,{size:36,color:OK,anchor:'middle',weight:700})+okMark(840,320,1),seg(p,.5,.65),OK),
 // ================= まとめ =================
 [K+'end']:(p)=>card(100,90,480,180,label('半減期 ごとに',340,165,{size:30,color:C.ink,anchor:'middle'})+label('半分ずつ 減る',340,225,{size:36,color:LIVE,anchor:'middle',weight:700}),seg(p,.05,.2),LIVE)
  +card(620,90,480,180,TX(DMC2,860,195,{size:54}),seg(p,.4,.55),EC),
 [K+'deep']:(p)=>card(100,90,480,180,label('半減期 ごとに',340,165,{size:30,color:C.ink,anchor:'middle'})+label('半分ずつ 減る',340,225,{size:36,color:LIVE,anchor:'middle',weight:700}),1,LIVE)
  +card(620,90,480,180,TX(DMC2,860,195,{size:54}),1,EC)
  +fade(seg(p,.2,.35),label('なぜ？ → 深く 学ぶ 版で',600,400,{size:34,color:C.hi,anchor:'middle',weight:700})),
};

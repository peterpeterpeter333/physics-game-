// 高校編「音波・要点」(ys-hs-w-sound-summary) — 図。深1/3・2/3 の部品をそのまま使う。
import {C,seg,lin,fade,label,line,rect,dot,draw,tex} from './anim.mjs';
import {card,tag,T2,tSince,sceneT,LC,FC,VCOL,ROPE,MK,HZ,MM,MS,Vt,air,AIR} from './yt1-hs-w-sound-1-diagrams.mjs';
import {beatPanels,BG} from './yt1-hs-w-sound-2-diagrams.mjs';

const K='hs-w-sound-summary:';
const PI=Math.PI;
const BX=t=>BG.x0+(BG.x1-BG.x0)*t;
const ph=(p,ctx)=>sceneT(p,ctx)/AIR.T;
const F12=`|{\\color{${FC}}f_1}-{\\color{${FC}}f_2}|`;
function tbl(g1=1,g2=1){
 return card(240,40,720,230,'',1,C.hi)+fade(g1,label('高い 音 ↔ 振動数 f が 大きい',600,132,{size:34,color:FC,anchor:'middle',weight:700}))+fade(g2,label('大きい 音 ↔ 振幅 A が 大きい',600,222,{size:34,color:C.ink,anchor:'middle',weight:700}));
}
const W1='#8fd3ff', W2='#ff9fd2';

export const hsWSoundSummaryDiagrams={
 [K+'c1']:(p,ctx)=>air(ph(p,ctx),{dense:seg(p,.3,.5),earG:1})+fade(seg(p,.4,.6),label('音 ＝ 空気の 縦波',600,380,{size:38,color:C.hi,anchor:'middle',weight:700})),
 [K+'c2']:(p,ctx)=>air(ph(p,ctx),{dense:1,sparse:1,earG:1,hl:16,track:seg(p,.05,.2)})+fade(seg(p,.4,.55),label('印の 粒は 左右に 往復するだけ',600,340,{size:28,color:MK,anchor:'middle',weight:700}))+fade(seg(p,.6,.75),label('密と 疎の 模様が 約 340 m/s で 進む',600,410,{size:30,color:VCOL,anchor:'middle',weight:700})),
 [K+'c2b']:(p,ctx)=>air(ph(p,ctx),{dense:1,sparse:1,earG:1,press:1})+fade(seg(p,.1,.25),label('耳に 届くのは 圧力の 変化',600,370,{size:32,color:C.hi,anchor:'middle',weight:700})),
 [K+'c3']:(p)=>tbl(seg(p,.05,.2),seg(p,.45,.6)),
 [K+'c4']:(p)=>tbl()+card(240,310,720,150,label('うなりの 回数（1秒あたり）',600,360,{size:28,color:C.ink,anchor:'middle'})+T2(`=${F12}`,600,425,{size:50,auto:false}),seg(p,.1,.25),C.hi),
 [K+'w1']:(p)=>beatPanels({g1:1,g2:1,gs:seg(p,.3,.45),us:lin(p,.3,.9),axis:0,note:seg(p,.05,.2)}),
 [K+'w2']:(p)=>beatPanels({g1:1,g2:1,gs:1,axis:1,weak:seg(p,.2,.4)})+fade(seg(p,.3,.45),label('ずれが たまる',BX(.25),BG.ys[0]-50+6,{size:24,color:C.dim,anchor:'middle',weight:700})),
 [K+'w3']:(p)=>beatPanels({g1:1,g2:1,gs:1,axis:1,weak:1,marks:seg(p,.05,.25),env:seg(p,.4,.6)}),
 [K+'x1']:(p)=>{
  const rows=[['0.5 秒で','440 Hz：220 回',W1],['','442 Hz：221 回',W2]];
  let s=card(200,40,800,230,label('0.5 秒の あいだの 振動の 回数',600,95,{size:28,color:C.dim,anchor:'middle'}),1,C.dim);
  s+=fade(seg(p,.3,.45),label('440 Hz：220 回',600,165,{size:34,color:W1,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('442 Hz：221 回',600,230,{size:34,color:W2,anchor:'middle',weight:700}));
  return s;
 },
 [K+'x2']:(p)=>{
  let s=card(200,40,800,230,label('0.5 秒の あいだの 振動の 回数',600,95,{size:28,color:C.dim,anchor:'middle'})+label('440 Hz：220 回',600,165,{size:34,color:W1,anchor:'middle',weight:700})+label('442 Hz：221 回',600,230,{size:34,color:W2,anchor:'middle',weight:700}),1,C.dim);
  s+=fade(seg(p,.05,.2),label('ずれ 1回 → 強め合い',600,340,{size:32,color:C.hi,anchor:'middle',weight:700}));
  s+=card(300,380,600,100,label('うなり：1秒に 2回',600,442,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'x3']:(p)=>card(200,30,800,180,T2(`${`{\\color{${LC}}\\lambda}`}=\\dfrac{${Vt}}{{\\color{${FC}}f}}`,600,128,{size:50,auto:false}),seg(p,.05,.2),LC)+card(200,250,800,160,T2(`\\dfrac{340}{440}\\approx 0.77${MM}`,600,338,{size:46,auto:false}),seg(p,.5,.65),LC),
 [K+'x4']:(p)=>{
  const fn=d=>t=>(Math.cos(2*PI*20*t)+Math.cos(2*PI*(20+d)*t))/2;let s='';
  [[2,'差 2 Hz',150],[.5,'差 0.5 Hz',290],[0,'差 0',430]].forEach(([d,t,y],i)=>{const g=seg(p,.05+i*.2,.2+i*.2),pts=[];for(let k=0;k<=1200;k++){const u=k/1200;pts.push([BX(u),y-34*fn(d)(u)]);}
   s+=fade(g,draw(pts,1,{color:ROPE,w:2.5})+label(t,BG.x0-16,y+8,{size:24,color:C.ink,anchor:'end',weight:700}));});
  s+=fade(seg(p,.7,.85),label('うなり なし ＝ そろった',1090,385,{size:26,color:C.F,anchor:'end',weight:700}));
  return s;
 },
 [K+'x3b']:(p)=>card(200,30,800,180,T2(`{\\color{${LC}}\\lambda}=\\dfrac{${Vt}}{{\\color{${FC}}f}}`,600,128,{size:50,auto:false}),1,LC)+card(200,250,800,160,T2(`\\dfrac{340}{170}=2.0${MM}`,600,338,{size:46,auto:false}),seg(p,.05,.2),LC)+fade(seg(p,.5,.65),label('高い 音ほど 波長は 短い',600,460,{size:30,color:C.hi,anchor:'middle',weight:700})),
 [K+'m1']:(p)=>card(160,60,880,130,label('✕ うなり ＝ 2 Hz の 低い 音',600,142,{size:38,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a),
 [K+'m2']:(p)=>beatPanels({g1:0,g2:0,gs:1,env:seg(p,.3,.5),axis:1})+card(250,30,700,140,label('高さ：約 441 Hz の まま',600,90,{size:34,color:ROPE,anchor:'middle',weight:700})+label('変わるのは 強さ',600,145,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),ROPE),
 [K+'m3']:(p)=>card(160,60,880,130,label('✕ 大きい 音・高い 音ほど 速く 届く',600,142,{size:34,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a)+card(160,250,880,120,label('速さは 媒質で 決まる（空気なら 約 340 m/s）',600,322,{size:30,color:C.F,anchor:'middle',weight:700}),seg(p,.5,.65),C.F),
 [K+'s1']:(p)=>tbl(),
 [K+'s2']:(p)=>tbl()+card(240,310,720,150,label('うなりの 回数（1秒あたり）',600,360,{size:28,color:C.ink,anchor:'middle'})+T2(`=${F12}`,600,425,{size:50,auto:false}),seg(p,.05,.2),C.hi),
 [K+'s3']:(p)=>card(200,150,800,160,label('なぜ そうなるかは、',600,215,{size:32,color:C.ink,anchor:'middle'})+label('深く学ぶ版で',600,275,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi),
};

// 高校編「ドップラー効果・深く学ぶ 3/3」(ys-hs-w-doppler-3) — 図。Stage 1200×515.
// 音源は静止（同心円）。聞き手が左の音源へ vₒ で近づく。山は右向きに V、聞き手は左向きに vₒ → 出会う速さ V＋vₒ。
// 1秒間に出会う山の列：止まっていれば 340 m 分（400 個）、近づけば 360 m 分（約 423.5 個）。帯の長さは m に比例、区切りの数は省略して描く。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,poly,clamp,mix} from './anim.mjs';
import {card,tag,T2,tSince,LC,TCOL,FC,VCOL,MK,Lt,Tt,ft,HZ,MS,MM,SS,
 SC,WF,Vt,vst,vot,fp,eqRow,siren,listener,WP,fronts,crestEdges,dbl,plate,strip} from './yt1-hs-w-doppler-1-diagrams.mjs';

const K='hs-w-doppler-3:';
const SX=300;
// stationary source on the left, listener approaching from the right
function scene(t,{lx=1000,arrowG=0,g=1,lab=1}={}){
 let s=fronts(t,{k:0,xs0:SX})+siren(SX,WP.y,{lab:''})+plate('止まった 音源',SX,WP.y+90,{size:24,color:C.dim});
 s+=listener(lx,WP.y-40,{lab:''});
 if(lab)s+=plate('聞き手',lx,WP.y+98,{size:24,color:C.dim});
 if(arrowG)s+=arrow(lx-30,WP.y-90,lx-150,WP.y-90,{color:VCOL,w:5,head:16,g:arrowG})+fade(arrowG,tex(vot,lx-90,WP.y-118,{size:34}));
 return fade(g,s);
}
// 1D: crests moving right at V, listener moving left at vo
function meet(t,{lx0=900,vo=1,g=1,lab=1,sp=93}={}){
 const lx=vo?Math.max(720,lx0+100-20*t):lx0;let s='';
 const off=((150*t)%sp+sp)%sp;
 for(let x=60-sp+off;x<1150;x+=sp)if(x>=60)s+=line(x,WP.y-70,x,WP.y+70,{color:WF,w:4});
 s+=listener(lx,WP.y-30,{lab:''});
 if(lab){s+=arrow(280,130,450,130,{color:VCOL,w:6,head:18})+tex(Vt,365,100,{size:38})+plate('山',200,138,{size:26,color:WF});
  if(vo)s+=arrow(lx-20,130,lx-160,130,{color:VCOL,w:6,head:18})+tex(vot,lx-90,100,{size:38});}
 return fade(g,s);
}
const PX=850/340; // px per metre for the 1-second strips
function strips({g=1,second=0,count1=0,count2=0,L2=360,lab2='近づく：340＋20＝360 m',c2txt='→ 約 423.5 個'}={}){
 let s=strip({x:120,w:340*PX,y:170,pieces:12,col:LC})+label('止まっている：340 m',120,120,{size:26,color:C.ink,weight:700});
 if(count1)s+=fade(count1,label('→ 400 個',120+340*PX+10,180,{size:26,color:FC,weight:700}));
 if(second){const w=L2*PX,pieces=12*L2/340;let t=rect(120,354,w,52,{fill:LC,fo:.12,stroke:LC,sw:2,rx:6});
  for(let i=1;i<pieces;i++)t+=line(120+i*850/12,354,120+i*850/12,406,{color:LC,w:2});
  t+=label(lab2,120,320,{size:26,color:C.hi,weight:700});
  s+=fade(second,t);}
 if(count2)s+=fade(count2,label(c2txt,120+L2*PX-120,460,{size:26,color:FC,weight:700}));
 s+=label('（区切りの 数は 省略して 描いています）',600,500,{size:22,color:C.dim,anchor:'middle'});
 return fade(g,s);
}
// light: a wave whose wavelength is stretched
function lightWave({stretch=0,g=1,y=300}={}){
 const lam=mix(90,130,stretch),col=stretch>.5?'#ff7a7a':'#7fb6ff';const pts=[];
 for(let x=200;x<=1100;x+=4)pts.push([x,y-40*Math.sin(2*Math.PI*(x-200)/lam)]);
 let s=dot(130,y,26,'#ffe9b0')+ring(130,y,40,{color:'#ffe9b0',w:2,dash:'4 6'})+label('遠い 銀河',130,y+80,{size:24,color:C.dim,anchor:'middle',weight:700});
 s+=draw(pts,1,{color:col,w:4});
 return fade(g,s);
}

export const hsWDoppler3Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p,ctx)=>{const t=tSince(p,ctx,K+'q');return scene(t,{lx:1040-6*t,arrowG:seg(p,.2,.35)})+plate('波長は 変わる？',600,480,{size:30,color:LC,g:seg(p,.55,.7)});},
 [K+'q2']:(p)=>card(200,110,800,200,label('変わらないなら、なぜ 高さが 変わる？',600,222,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
 [K+'recall']:(p)=>{
  let s=card(100,60,450,160,label('1/3・2/3',325,115,{size:26,color:C.dim,anchor:'middle'})+label('音源が 動く',325,180,{size:36,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.dim);
  s+=card(650,60,450,160,label('3/3（今回）',875,115,{size:26,color:C.dim,anchor:'middle'})+label('聞き手が 動く',875,180,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'pred']:(p)=>{
  let s=label('同じ 20 m/s で 近づくなら',600,90,{size:34,color:C.ink,anchor:'middle',weight:700});
  s+=card(150,170,400,150,label('音源が 動く',350,232,{size:30,color:C.ink,anchor:'middle',weight:700})+label('425 Hz',350,288,{size:34,color:FC,anchor:'middle',weight:700}),seg(p,.15,.3),C.dim);
  s+=card(650,170,400,150,label('聞き手が 動く',850,232,{size:30,color:C.ink,anchor:'middle',weight:700})+label('？',850,290,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 // ================= S2 音源は止まっている =================
 [K+'setup']:(p,ctx)=>{const t=tSince(p,ctx,K+'setup');return scene(t,{lx:1040-6*t,arrowG:seg(p,.15,.3)})+card(380,10,440,80,label('空気に 対する 速さ',600,62,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,.55,.7),C.dim);},
 [K+'lam']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'setup');let s=scene(t,{lx:1040-6*t,arrowG:1});
  const e=crestEdges(t,{k:0,xs0:SX,side:1,count:2}).sort((a,b)=>a-b);
  s+=fade(seg(p,.3,.45),dbl(e[0],e[1],WP.y+112,LC))+plate('0.85 m のまま',(e[0]+e[1])/2,WP.y+160,{size:28,color:LC,g:seg(p,.45,.6)});
  return s;
 },
 [K+'nochg']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'setup');let s=scene(t,{lx:1040-6*t,arrowG:1});
  s+=card(250,10,700,90,label('聞き手が 動いても 山の 並びは 同じ',600,66,{size:30,color:LC,anchor:'middle',weight:700}),seg(p,.05,.2),LC);
  return s;
 },
 [K+'cond']:(p)=>{
  let s=fade(.4,scene(0,{lx:1000,arrowG:1}));
  s+=card(150,30,900,170,label('同じ 一直線上・空気は 静止',600,90,{size:32,color:C.ink,anchor:'middle',weight:700})+T2(`${vot}<${Vt},\\quad ${vot}=20${MS}`,600,155,{size:40}),seg(p,.05,.2),C.dim);
  s+=tag('仮定',1080,60,{color:C.dim,g:seg(p,.3,.45)});
  return s;
 },
 [K+'nums']:(p)=>{
  let s=fade(.4,scene(0,{lx:1000,arrowG:1}));
  s+=card(200,30,800,120,T2(`${Vt}=340${MS},\\quad ${ft}=400${HZ}`,600,98,{size:44}),seg(p,.05,.2),C.dim);
  s+=fade(seg(p,.5,.65),label('これまでと 同じ',600,190,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ask2']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'ask2');
  return meet(t,{vo:1,lab:0,g:.5})+card(200,330,800,130,label('1秒間に 出会う 山の 数を 数える',600,408,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
 },
 // ================= S3 山と出会う速さ =================
 [K+'still']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'still');
  let s=meet(t,{vo:0,g:seg(p,0,.1)});
  s+=plate('聞き手：止まっている',900,WP.y+120,{size:26,color:C.dim});
  return s;
 },
 [K+'s1']:(p)=>strips({count1:seg(p,.4,.55)}),
 [K+'move']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'move');
  return meet(t,{vo:1})+plate('聞き手：近づく',700,WP.y+120,{size:26,color:C.dim});
 },
 [K+'rel']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'move');
  let s=meet(t,{vo:1,g:.55});
  s+=card(250,330,700,150,T2(`${Vt}+${vot}`,600,400,{size:56})+label('聞き手から 見た 山の 速さ',600,460,{size:24,color:C.dim,anchor:'middle'}),seg(p,.1,.25),C.hi);
  s+=tag('向かい合う → 速さの 和',600,30,{color:C.hi,g:seg(p,.55,.7)});
  return s;
 },
 [K+'s2']:(p)=>strips({count1:1,second:seg(p,.1,.35)}),
 [K+'count']:(p)=>{
  let s=strips({count1:1,second:1,count2:seg(p,.1,.25)});
  s+=card(650,20,520,90,T2(`360\\div 0.85\\approx 423.5`,910,72,{size:40}),seg(p,.05,.2),FC);
  return s;
 },
 [K+'f1']:(p)=>{
  let s=card(200,40,800,130,T2(`${fp}=(${Vt}+${vot})\\div ${Lt}`,600,108,{size:50}),seg(p,.05,.2),FC);
  s+=card(300,240,600,130,T2(`${Lt}=\\dfrac{${Vt}}{${ft}}`,600,322,{size:46}),seg(p,.45,.6),LC);
  s+=fade(seg(p,.6,.75),label('↑ ここへ 代入',600,215,{size:24,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'f2']:(p)=>{
  let s=card(150,40,900,150,T2(`${fp}=(${Vt}+${vot})\\div\\dfrac{${Vt}}{${ft}}`,600,132,{size:48}),1,FC);
  s+=fade(seg(p,.1,.25),label('分数で 割る ＝ 逆数を 掛ける',600,250,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=card(150,300,900,150,T2(`${fp}=${ft}\\times\\dfrac{${Vt}+${vot}}{${Vt}}`,600,392,{size:50}),seg(p,.4,.55),C.hi);
  s+=tag('導いた 結果',1080,272,{color:C.hi,g:seg(p,.7,.85)});
  return s;
 },
 [K+'chk']:(p)=>{
  let s=card(150,40,900,150,T2(`${fp}=${ft}\\times\\dfrac{${Vt}+${vot}}{${Vt}}`,600,132,{size:50}),1,C.hi);
  s+=card(150,260,900,150,T2(`400\\times\\dfrac{340+20}{340}=400\\times\\dfrac{360}{340}\\approx 423.5${HZ}`,600,348,{size:40}),seg(p,.05,.2),FC);
  s+=fade(seg(p,.6,.75),label('数えた 結果と 一致（約 424 Hz）',600,470,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'zero']:(p)=>{
  let s=card(150,40,900,150,T2(`${fp}=${ft}\\times\\dfrac{${Vt}+${vot}}{${Vt}}`,600,132,{size:50}),1,C.hi);
  s+=card(150,260,900,130,T2(`${vot}=0\\ \\Rightarrow\\ ${fp}=${ft}\\times\\dfrac{${Vt}}{${Vt}}=${ft}`,600,336,{size:42}),seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.6,.75),label('止まった 聞き手：400 Hz',600,460,{size:28,color:FC,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S4 遠ざかる聞き手 =================
 [K+'away']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'away');let s='';const sp=93,off=((150*t)%sp+sp)%sp,lx=700+20*t;
  for(let x=60-sp+off;x<1150;x+=sp)if(x>=60)s+=line(x,WP.y-70,x,WP.y+70,{color:WF,w:4});
  s+=listener(lx,WP.y-30,{lab:''});
  s+=arrow(380,130,560,130,{color:VCOL,w:6,head:18})+tex(Vt,470,100,{size:38})+arrow(lx+20,130,lx+160,130,{color:VCOL,w:6,head:18})+tex(vot,lx+90,100,{size:38});
  s+=card(250,350,700,120,T2(`${Vt}-${vot}`,600,410,{size:52})+label('追いつかれる 速さ',600,458,{size:22,color:C.dim,anchor:'middle'}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'away2']:(p)=>strips({count1:1,second:seg(p,.1,.35),L2:320,lab2:'遠ざかる：340−20＝320 m',count2:0}),
 [K+'awayf']:(p)=>{
  let s=card(150,40,900,150,T2(`${fp}=${ft}\\times\\dfrac{${Vt}-${vot}}{${Vt}}`,600,132,{size:50}),seg(p,.05,.2),C.hi);
  s+=card(150,260,900,150,T2(`400\\times\\dfrac{320}{340}\\approx 376.5${HZ}`,600,348,{size:42}),seg(p,.4,.55),FC);
  s+=fade(seg(p,.7,.85),label('約 377 Hz',600,470,{size:30,color:FC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'rule']:(p)=>{
  let s=card(100,80,460,170,label('近づく',330,140,{size:32,color:C.ink,anchor:'middle',weight:700})+label('出会う 山が 増える → 高い',330,205,{size:26,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=card(640,80,460,170,label('遠ざかる',870,140,{size:32,color:C.ink,anchor:'middle',weight:700})+label('出会う 山が 減る → 低い',870,205,{size:26,color:LC,anchor:'middle',weight:700}),seg(p,.45,.6),LC);
  return s;
 },
 // ================= S5 比べる =================
 [K+'cmp']:(p)=>{
  let s=card(100,60,460,170,label('音源が 20 m/s で 近づく',330,120,{size:28,color:C.ink,anchor:'middle',weight:700})+label('425 Hz',330,195,{size:40,color:FC,anchor:'middle',weight:700}),seg(p,.05,.2),C.dim);
  s+=card(640,60,460,170,label('聞き手が 20 m/s で 近づく',870,120,{size:28,color:C.ink,anchor:'middle',weight:700})+label('約 424 Hz',870,195,{size:40,color:FC,anchor:'middle',weight:700}),seg(p,.35,.5),C.dim);
  s+=fade(seg(p,.65,.8),label('わずかに 違う',600,320,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'where']:(p)=>{
  let s=card(100,60,460,190,T2(`${ft}\\times\\dfrac{${Vt}}{${Vt}-${vst}}`,330,165,{size:50}),1,C.dim)+card(640,60,460,190,T2(`${ft}\\times\\dfrac{${Vt}+${vot}}{${Vt}}`,870,165,{size:50}),1,C.dim);
  s+=label('音源が 動く',330,40,{size:24,color:C.dim,anchor:'middle'})+label('聞き手が 動く',870,40,{size:24,color:C.dim,anchor:'middle'});
  s+=plate('分母が 変わる',330,310,{size:30,color:C.hi,g:seg(p,.1,.25)})+plate('分子が 変わる',870,310,{size:30,color:C.hi,g:seg(p,.45,.6)});
  return s;
 },
 [K+'grow']:(p)=>{
  let s=hsWDoppler3Diagrams[K+'where'](1);
  s+=card(250,370,700,110,label('速く 動くほど、違いが 大きく なる',600,438,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'why']:(p)=>{
  let s=card(100,60,460,190,label('音源が 動く',330,120,{size:30,color:C.ink,anchor:'middle',weight:700})+label('波長 そのものが 変わる',330,195,{size:30,color:LC,anchor:'middle',weight:700}),seg(p,.05,.2),LC);
  s+=card(640,60,460,190,label('聞き手が 動く',870,120,{size:30,color:C.ink,anchor:'middle',weight:700})+label('出会う 速さが 変わる',870,195,{size:30,color:VCOL,anchor:'middle',weight:700}),seg(p,.45,.6),VCOL);
  s+=fade(seg(p,.6,.75),label('（波長は そのまま）',870,290,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'table']:(p)=>{
  const rows=[['音源が 近づく','波長が 短い','425 Hz'],['音源が 遠ざかる','波長が 長い','約 378 Hz'],['聞き手が 近づく','出会う 速さ V＋vo','約 424 Hz'],['聞き手が 遠ざかる','出会う 速さ V−vo','約 377 Hz']];
  let s=card(80,20,1040,470,'',1,C.dim);
  s+=label('変わるもの',640,70,{size:24,color:C.dim,anchor:'middle'})+label('聞こえる 振動数',950,70,{size:24,color:C.dim,anchor:'middle'});
  rows.forEach(([a,b,c],i)=>{const y=150+i*90,o=seg(p,.05+i*.12,.17+i*.12),col=i<2?LC:VCOL;s+=fade(o,label(a,120,y,{size:30,color:C.ink,weight:700})+label(b,640,y,{size:28,color:col,anchor:'middle',weight:700})+label(c,950,y,{size:30,color:FC,anchor:'middle',weight:700}));});
  return s;
 },
 [K+'mis']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'mis');let s=fade(.45,scene(t,{lx:1000-6*t,arrowG:1}));
  s+=card(150,20,900,140,label('× 聞き手が 動くと 波長が 縮む',600,80,{size:32,color:C.a,anchor:'middle',weight:700})+label('空気の 中の 山の 間隔は 変わらない',600,135,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.a);
  return s;
 },
 [K+'mis2']:(p)=>{
  let s=fade(.5,hsWDoppler3Diagrams[K+'cmp'](1).replace(/translate\(0 0\)/,''));
  s=`<g transform="translate(0 160)">${s}</g>`;
  s+=card(150,20,900,140,label('× どちらが 動いても 同じ',600,80,{size:32,color:C.a,anchor:'middle',weight:700})+label('しくみが 違う → 425 Hz と 約 424 Hz',600,135,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.a);
  return s;
 },
 // ================= S6 光と次の単元 =================
 [K+'light']:(p)=>lightWave({g:seg(p,0,.2)})+fade(seg(p,.4,.55),label('光も 波',600,120,{size:34,color:C.hi,anchor:'middle',weight:700})),
 [K+'noair']:(p)=>{
  let s=fade(.35,lightWave({}));
  s+=card(150,20,900,150,label('光には 基準に なる 媒質が ない',600,80,{size:32,color:C.ink,anchor:'middle',weight:700})+label('× 音の 式に c を 入れる だけ',600,140,{size:28,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.dim);
  return s;
 },
 [K+'relt']:(p)=>{
  let s=fade(.35,lightWave({}));
  s+=card(300,40,600,110,label('相対性理論で 扱う',600,108,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'red']:(p)=>{
  let s=lightWave({stretch:seg(p,.15,.45)});
  s+=card(650,20,500,90,label('赤方偏移',900,78,{size:36,color:'#ff7a7a',anchor:'middle',weight:700}),seg(p,.5,.65),'#ff7a7a');
  s+=fade(seg(p,.2,.4),label('波長が 長い 側へ',600,450,{size:28,color:'#ff7a7a',anchor:'middle',weight:700}));
  return s;
 },
 [K+'expand']:(p)=>{
  let s=lightWave({stretch:1});
  s+=card(150,20,900,110,label('届くまでに 宇宙が 膨張 → 波長が 伸びる',600,88,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.dim);
  s+=tag('宇宙膨張の 証拠の 一つ',600,470,{color:C.hi,g:seg(p,.55,.7)});
  return s;
 },
 [K+'next1']:(p)=>{
  let s=rect(560,180,400,250,{fill:'#7fb6ff',fo:.15,stroke:'#7fb6ff',rx:8})+label('ガラス・水',760,420,{size:26,color:'#7fb6ff',anchor:'middle',weight:700});
  s+=line(150,120,560,260,{color:'#ffe9b0',w:5})+fade(seg(p,.3,.5),label('？',760,320,{size:60,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.7),label('光の 何が 変わる？',600,90,{size:36,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'bye']:(p)=>{
  let s=card(200,110,800,200,label('次の単元',600,170,{size:26,color:C.dim,anchor:'middle'})+label('光波',600,255,{size:46,color:C.hi,anchor:'middle',weight:700}),1,C.hi);
  s+=fade(seg(p,.3,.5),label('光波・深く学ぶ 1/3 へ',1080,470,{size:26,color:C.dim,anchor:'end'}));
  return s;
 },
};

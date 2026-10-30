// 問題編 解説「すべり台をすべる子ども」(ys-qx-hs-m-energy-3) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/107_仕事とエネルギー.md の q-hs-m-energy-3（解説 18 行）。
// 色（単元動画 ys-hs-m-energy-3 と同じ）：K 濃い橙、U 薄い橙、K＋U の合計の線 黄、高さ・落差 水色、速度 紫、力 緑、熱 灰色の箱。
// すべり台：高さ h(s)＝5.0(1−s)² m（s＝0 上端、s＝1 下端）、1 m＝60 px。1.8 m の地点は s＝0.4。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
import {C,seg,lin,fade,label,line,rect,arrow,tex,texWidth,draw,ground,clamp} from './anim.mjs';
import {KC,UC,FA,VA} from './yt1-hs-m-energy-1-diagrams.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,note,cueT,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-hs-m-energy-3:';
const G1='下端での速さ v（摩擦なし）',G2='高さ 1.8 m での速さ',G3='減った K＋U';
const A1=g=>answerTag(1,'C','10 m/s',{g}),A2=g=>answerTag(2,'A','8.0 m/s',{g}),A3=g=>answerTag(3,'B','960 J',{g});
function wAt(ctx,word,fb=.5){
 const r=(ctx?.cue?.reading??'').replace(/\s/g,''),i=r.indexOf(word.replace(/\s/g,''));
 return i<0||!r.length?fb:i/r.length*voiceEnd(ctx);
}
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,...o});
const HC=C.x,TOT=C.hi,HEAT='#8a93a6';
// ---- すべり台 ----------------------------------------------------------------------------------
const SB=450,PM=60,X0=170,XW=430;
const hS=s=>5*(1-s)**2, xS=s=>X0+XW*s, yS=s=>SB-PM*hS(s);
const sOfH=h=>1-Math.sqrt(h/5);
const S18=sOfH(1.8);
function nrm(s){const dx=XW,dy=PM*10*(1-s),L=Math.hypot(dx,dy);return {tx:dx/L,ty:dy/L,nx:dy/L,ny:-dx/L};}
// 面から r だけ浮かせた点（子どもの中心）
function onS(s,r=13){const {nx,ny}=nrm(s);return [xS(s)+nx*r,yS(s)+ny*r];}
function slide({g=1,red=0,ruler=1,m18=0,m18hi=0}={}){
 const pts=[];for(let i=0;i<=60;i++){const s=i/60;pts.push([xS(s),yS(s)]);}
 let s=ground(40,680,SB);
 s+=line(X0-60,yS(0),X0,yS(0),{color:C.dim,w:6})+line(X0-50,yS(0),X0-50,SB,{color:C.faint,w:4})+line(X0-10,yS(0),X0-10,SB,{color:C.faint,w:4});
 for(let k=1;k<6;k++)s+=line(X0-50,yS(0)+k*50,X0-10,yS(0)+k*50,{color:C.faint,w:3});
 s+=line(xS(.45),yS(.45)+6,xS(.45),SB,{color:C.faint,w:3})+line(xS(.8),yS(.8)+6,xS(.8),SB,{color:C.faint,w:3});
 s+=draw(pts,1,{color:C.dim,w:6})+line(xS(1),SB,xS(1)+50,SB,{color:C.dim,w:6});
 if(red)s+=fade(red,draw(pts,1,{color:'#e07a6a',w:7}));
 if(ruler){s+=line(92,SB,92,yS(0),{color:HC,w:3})+line(84,SB,100,SB,{color:HC,w:3})+line(84,yS(0),100,yS(0),{color:HC,w:3})
  +label('0',80,SB+8,{size:22,color:HC,anchor:'end',weight:700})+label('5.0 m',80,yS(0)+8,{size:22,color:HC,anchor:'end',weight:700});}
 if(m18){const x=xS(S18),y=yS(S18);
  s+=fade(m18,line(92,y,x,y,{color:C.ink,w:2,dash:'5 7'})+line(x-12,y,x+12,y,{color:m18hi>.5?C.hi:C.ink,w:5})+label('1.8 m',80,y+8,{size:22,color:m18hi>.5?C.hi:C.ink,anchor:'end',weight:700}));
  if(m18hi)s+=fade(m18hi,`<circle cx="${x}" cy="${y}" r="20" fill="none" stroke="${C.hi}" stroke-width="3"/>`);
 }
 return fade(g,s);
}
function kid(s,{g=1,lab=1,big=0,col='#ffe6b0'}={}){
 const r=big?19:13,[x,y]=onS(s,r);
 let o=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${col}" stroke="${C.bg}" stroke-width="2"/>`;
 if(lab)o+=label(lab===1?'30 kg':lab,x+r+8,y-r-4,{size:22,color:C.ink,weight:700});
 return fade(g,o);
}
const gCard=(g=1)=>card(1010,92,170,50,label('g＝10 m/s²',1095,126,{size:24,color:C.ink,anchor:'middle',weight:700}),g);
// ---- 棒グラフ（S1・S2：1本、U を下に K を上に積む。黄の線＝合計）----------------------------
const BX=790,BB=440,BKJ=220/1500;
function barFrame(g=1){
 let s=card(700,180,230,300,'',g,KC);
 s+=fade(g,label('K＋U',760,214,{size:24,color:C.ink,anchor:'middle',weight:700})+line(735,BB,845,BB,{color:C.dim,w:3}));
 s+=fade(g,rect(860,236,22,22,{fill:KC,fo:.8,stroke:'none',rx:4})+label('K',890,256,{size:22,color:KC,weight:700})
  +rect(860,276,22,22,{fill:UC,fo:.8,stroke:'none',rx:4})+label('U',890,296,{size:22,color:UC,weight:700})
  +line(858,326,884,326,{color:TOT,w:4})+label('計',890,334,{size:22,color:TOT,weight:700}));
 return s;
}
function stack(x,base,U,Kv,{w=70,tot=1,nums=0,hiU=0,k=BKJ,totV=null}={}){
 let s='';
 if(U>0)s+=rect(x-w/2,base-U*k,w,U*k,{fill:UC,fo:.65,stroke:UC,sw:2,rx:3});
 if(Kv>0)s+=rect(x-w/2,base-(U+Kv)*k,w,Kv*k,{fill:KC,fo:.75,stroke:KC,sw:2,rx:3});
 if(hiU&&U>0)s+=fade(hiU,rect(x-w/2-6,base-U*k-6,w+12,U*k+12,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:6}));
 if(nums){
  if(U*k>34)s+=label(`U ${Math.round(U)}`,x,base-U*k/2+8,{size:22,color:C.bg,anchor:'middle',weight:700});
  if(Kv*k>34)s+=label(`K ${Math.round(Kv)}`,x,base-U*k-Kv*k/2+8,{size:22,color:C.bg,anchor:'middle',weight:700});
 }
 const T0=totV??(U+Kv);
 if(tot)s+=fade(tot,line(x-w/2-16,base-T0*k,x+w/2+16,base-T0*k,{color:TOT,w:4}));
 return s;
}
// 高さ h の子どもの所の棒（摩擦なし、合計 1500）
const barAt=(h,o={})=>stack(BX,BB,1500*h/5,1500*(1-h/5),o);
// 上の式の帯
const strip=(inner,g=1,col=C.hi)=>card(290,90,640,80,inner,g,col);
const SX=610;

export const qxHsMEnergy3Diagrams={
 // ================= 問題アニメ：出題中（5 秒＋静止）=================
 // 0〜2 s すべり台・高さの目盛り・上端の子ども 30 kg・g＝10。2〜3 s 1.8 m の印。3〜4 s 棒グラフの枠だけ。4〜5 s 右下に「実際のすべり台（小問3）」と「実際：6.0 m/s」。
 [K+'q0']:(p)=>{
  const t=5*p;
  let s=fade(seg(t,0,.6),slide({m18:seg(t,2,2.6)}))+kid(0,{g:seg(t,.4,1)})+gCard(seg(t,1,1.5));
  s+=fade(seg(t,3,3.5),barFrame());
  s+=miniReal(seg(t,4,4.5));
  return s;
 },
 // ================= S1 小問1 =================
 // 1. 出題中の図（小問3 の枠なし）。U の棒だけが出る（数値なし）
 [K+'setup']:(p)=>slide({m18:1})+kid(0)+gCard()+barFrame()+fade(seg(p,.4,.6),barAt(5,{tot:0})),
 // 2. 求めるもの。下端を黄の丸で
 [K+'goal1']:(p)=>{
  let s=slide({m18:1})+kid(0)+gCard()+barFrame()+barAt(5,{tot:0});
  s+=fade(seg(p,.3,.45),`<circle cx="${xS(1)}" cy="${SB-12}" r="26" fill="none" stroke="${C.hi}" stroke-width="4"/>`+label('下端',xS(1),SB+44,{size:24,color:C.hi,anchor:'middle',weight:700}));
  return s+goalTag(G1,{g:seg(p,.03,.15)});
 },
 // 3. 子どもが途中へ。垂直抗力と動きの向きに直角の印。U が減った分 K が伸び、合計の線は動かない
 [K+'cons']:(p,ctx)=>{
  const u=seg(p,.05,.4),sp=.55*u,h=hS(sp);
  let s=slide({m18:1})+kid(sp,{lab:seg(p,.4,.5)>0?0:1})+gCard()+barFrame()+barAt(h,{tot:seg(p,.6,.7)});
  const [x,y]=onS(sp,13),{tx,ty,nx,ny}=nrm(sp),ar=seg(p,.4,.5);
  s+=fade(ar,FA(x+nx*16,y+ny*16,x+nx*110,y+ny*110,{w:7,head:18})+label('垂直抗力',x+nx*110+10,y+ny*110-6,{size:22,color:C.F,weight:700}));
  s+=fade(ar,arrow(x+tx*20,y+ty*20,x+tx*120,y+ty*120,{color:C.ink,w:4,head:14})+label('動き',x+tx*120+8,y+ty*120+20,{size:22,color:C.ink,weight:700}));
  s+=fade(ar,`<path d="M${x+nx*30} ${y+ny*30} L${x+nx*30+tx*16} ${y+ny*30+ty*16} L${x+tx*16} ${y+ty*16}" fill="none" stroke="${C.hi}" stroke-width="2.5" transform="translate(${nx*-14} ${ny*-14})"/>`);
  s+=fade(seg(p,.62,.72),label('K＋U 一定',810,170,{size:26,color:TOT,anchor:'middle',weight:700}));
  return s+goalTag(G1);
 },
 // 4. 落差 5.0 m の物差し。mgh＝½mv²、両辺の m に印
 [K+'eq']:(p,ctx)=>{
  const b=wAt(ctx,'エムジーエイチイコール',.6);
  let s=slide({m18:1})+kid(0,{g:.4,lab:0})+gCard()+barFrame()+barAt(5,{tot:1});
  s+=fade(seg(p,.05,.2),line(xS(0),yS(0),660,yS(0),{color:HC,w:2,dash:'6 6'})+arrow(650,yS(0),650,SB,{color:HC,w:4,head:14})+label('落差 5.0 m',640,300,{size:24,color:HC,anchor:'end',weight:700}));
  const src=`{\\color{${C.hi}}m}gh=\\tfrac12 {\\color{${C.hi}}m}v^2`;
  s+=strip(fade(1-seg(p,b+.15,b+.25),T(`mgh=\\tfrac12 mv^2`,SX,132,40))+fade(seg(p,b+.15,b+.25),T(src,SX,132,40,{auto:false})),seg(p,b-.05,b+.05));
  return s+goalTag(G1);
 },
 // 5. 【式】m に打ち消し線 → v²＝2gh＝100 → v＝10。【図】下端の子どもに 10 m/s。答え C
 [K+'ans1']:(p,ctx)=>{
  const a=wAt(ctx,'しょうもん',.75),b1=wAt(ctx,'ブイにじょう',.15),b2=wAt(ctx,'にかけるじゅう',.35),b3=wAt(ctx,'ブイはじゅう',.55);
  let s=slide({m18:1})+gCard()+barFrame()+barAt(0,{tot:1});
  const cancel=`\\cancel{m}gh=\\tfrac12 \\cancel{m}v^2`;
  let e=fade(1-seg(p,b1,b1+.04),T(cancel,SX,132,40));
  e+=fade(seg(p,b1,b1+.04)*(1-seg(p,b2,b2+.04)),T(`v^2=2gh`,SX,132,42));
  e+=fade(seg(p,b2,b2+.04)*(1-seg(p,b3,b3+.04)),T(`v^2=2\\times 10\\times 5.0=100`,SX,132,40));
  e+=fade(seg(p,b3,b3+.04),T(`v=\\sqrt{100}=10\\ \\mathrm{m/s}`,SX,132,40));
  s+=strip(e,1);
  const kg=seg(p,b3,b3+.06);
  s+=kid(1,{g:kg});
  s+=fade(kg,VA(xS(1)-50,SB-60,xS(1)-50+120,SB-60)+label('10 m/s',xS(1)+10,SB-74,{size:26,color:C.v,anchor:'middle',weight:700}));
  return s+goalTag(G1)+A1(seg(p,a,a+.05));
 },
 // 6. 誤答 A・B（1枚ずつ）
 [K+'wrongAB']:(p,ctx)=>{
  const b=wAt(ctx,'ビーの',.5);
  let s=slide({m18:1})+gCard()+barFrame()+barAt(0,{tot:1})+kid(1)+VA(xS(1)-50,SB-60,xS(1)+70,SB-60)+label('10 m/s',xS(1)+10,SB-74,{size:26,color:C.v,anchor:'middle',weight:700});
  s+=wrongSeq(p,ctx,[['A','7.1 m/s','v²＝gh と した（2 を 落とした）',{mid:`\\sqrt{10\\times 5.0}=\\sqrt{50}`}],['B','100 m/s','√ を 忘れた（単位 m²/s²）']],{win:[[0,b],[b,1]],opts:{x:280,w:410,y:92,whySize:22}});
  return s+goalTag(G1)+A1(1);
 },
 // 7. 誤答 D。2文目で子どもと大人の点が並んで同じようにすべる
 [K+'wrongD']:(p,ctx)=>{
  const b=wAt(ctx,'しつりょうは',.55),u=lin(p,b,b+.3),sp=u;
  let s=slide({m18:1})+gCard()+barFrame()+barAt(0,{tot:1});
  s+=wrongCard('D','55 m/s','m を 消さなかった',{x:280,w:410,y:92,whySize:22,mid:`v^2=2mgh`,g:seg(p,.03,.1)*(1-seg(p,b-.02,b+.03))});
  const ad=seg(p,b,b+.05);
  if(ad>0){
   const [x1,y1]=onS(sp,19);
   s+=fade(ad*.85,`<circle cx="${(x1-16).toFixed(1)}" cy="${(y1-14).toFixed(1)}" r="19" fill="#b7d3ff" stroke="${C.bg}" stroke-width="2"/>`+label('大人',x1-46,y1-40,{size:22,color:'#b7d3ff',anchor:'end',weight:700}));
   s+=kid(sp,{lab:'子ども'});
   s+=fade(seg(p,b+.3,b+.36),label('どちらも 10 m/s',xS(1)-20,SB-130,{size:26,color:C.v,anchor:'middle',weight:700}));
  }else s+=kid(1);
  return s+goalTag(G1)+A1(1);
 },
 // ================= S2 小問2 =================
 // 8. 求めるもの。1.8 m の印を黄で
 [K+'goal2']:(p)=>slide({m18:1,m18hi:seg(p,.3,.45)})+kid(0)+gCard()+barFrame()+barAt(5,{tot:1})+goalTag(G2,{g:seg(p,.03,.15)}),
 // 9. 上端から 1.8 m まで落差の物差し。地面から 1.8 m の高さの物差しは薄く
 [K+'drop']:(p,ctx)=>{
  const b=wAt(ctx,'じょうたん',.7);
  let s=slide({m18:1,m18hi:1})+kid(0)+gCard()+barFrame()+barAt(5,{tot:1});
  const x=xS(S18),y=yS(S18);
  s+=fade(.35*seg(p,.45,.55),arrow(x+40,SB,x+40,y,{color:C.dim,w:3,head:12})+label('高さ',x+48,(SB+y)/2+8,{size:22,color:C.dim,weight:700}));
  s+=fade(seg(p,b,b+.08),line(xS(0),yS(0),x+120,yS(0),{color:HC,w:2,dash:'6 6'})+arrow(x+110,yS(0),x+110,y,{color:HC,w:5,head:16})+label('落差',x+122,(yS(0)+y)/2+8,{size:26,color:HC,weight:700}));
  return s+goalTag(G2);
 },
 // 10. 落差 3.2 m、v²＝64 → 8.0。1.8 m の子どもに 8.0 m/s。棒は U が一部残り K が伸びる。答え A
 [K+'ans2']:(p,ctx)=>{
  const a=wAt(ctx,'しょうもん',.8),b1=wAt(ctx,'ブイにじょう',.3),b2=wAt(ctx,'ハヤサは',.6);
  const x=xS(S18),y=yS(S18),ks=seg(p,b2,b2+.08);
  let s=slide({m18:1})+gCard()+barFrame();
  s+=line(xS(0),yS(0),x+120,yS(0),{color:HC,w:2,dash:'6 6'})+arrow(x+110,yS(0),x+110,y,{color:HC,w:5,head:16})+label('3.2 m',x+122,(yS(0)+y)/2+8,{size:26,color:HC,weight:700});
  let e=fade(1-seg(p,b1,b1+.04),T(`5.0-1.8=3.2\\ \\mathrm{m}`,SX,132,40));
  e+=fade(seg(p,b1,b1+.04)*(1-seg(p,b2,b2+.04)),T(`v^2=2\\times 10\\times 3.2=64`,SX,132,40));
  e+=fade(seg(p,b2,b2+.04),T(`v=\\sqrt{64}=8.0\\ \\mathrm{m/s}`,SX,132,40));
  s+=strip(e,1);
  const hb=5-3.2*ks;
  s+=barAt(hb,{tot:1});
  s+=kid(S18*ks,{g:1});
  const {tx,ty}=nrm(S18),[cx,cy]=onS(S18,13);
  s+=fade(ks,VA(cx+tx*20,cy+ty*20-24,cx+tx*116,cy+ty*116-24)+label('8.0 m/s',cx+tx*116+10,cy+ty*116-30,{size:26,color:C.v,weight:700}));
  return s+goalTag(G2)+A2(seg(p,a,a+.05));
 },
 // 11. 誤答 B・C（1枚ずつ）。C の間、棒の残った U を黄で
 [K+'wrongBC']:(p,ctx)=>{
  const c=wAt(ctx,'スィーの',.5),inC=seg(p,c,c+.05);
  let s=slide({m18:1})+gCard()+barFrame()+barAt(1.8,{tot:1,hiU:inC})+kid(S18);
  s+=fade(inC,label('残った U',BX,BB+32,{size:22,color:C.hi,anchor:'middle',weight:700}));
  s+=wrongSeq(p,ctx,[['B','6.0 m/s','高さ 1.8 m を 使った',{mid:`\\sqrt{2\\times 10\\times 1.8}`}],['C','10 m/s','U が 残る 分、K は 小さい']],{win:[[0,c],[c,1]],opts:{x:280,w:410,y:92,whySize:22}});
  return s+goalTag(G2)+A2(1);
 },
 // 12. 誤答 D（v ではなく v² が落差に比例）
 [K+'wrongD2']:(p)=>{
  let s=slide({m18:1})+gCard()+barFrame()+barAt(1.8,{tot:1})+kid(S18);
  s+=wrongCard('D','6.4 m/s','v ではなく v² が 落差に 比例',{x:280,w:410,y:92,whySize:22,mid:`10\\times\\tfrac{3.2}{5.0}`,g:seg(p,.03,.1)});
  return s+goalTag(G2)+A2(1);
 },
 // ================= S3 小問3（実際のすべり台）=================
 // 13. 暗転して実際のすべり台へ。下端に「実際：6.0 m/s」
 [K+'goal3']:(p)=>real()+fade(seg(p,.2,.35),label('実際：6.0 m/s',xS(1),SB-60,{size:26,color:C.v,anchor:'middle',weight:700}))+bars3({g:seg(p,.3,.45)})+goalTag(G3,{g:seg(p,.03,.15)}),
 // 14. はじめの棒：U 1500 J、合計の線 1500
 [K+'u0']:(p)=>{
  let s=real()+lab6()+bars3({U0:seg(p,.3,.55),tot0:seg(p,.55,.65)});
  s+=card(290,90,560,80,T(`30\\times 10\\times 5.0=1500\\ \\mathrm{J}`,540,132,38),seg(p,.1,.2),UC);
  return s+goalTag(G3);
 },
 // 15. 下端の棒：K 540 J、U 0。合計の線が 540 まで
 [K+'k1']:(p)=>{
  let s=real()+lab6()+bars3({U0:1,tot0:1,K1:seg(p,.35,.6),tot1:seg(p,.6,.7)});
  s+=card(290,90,560,80,T(`K=\\tfrac12\\times 30\\times 6.0^2=540\\ \\mathrm{J}`,540,132,36),seg(p,.1,.2),KC);
  return s+goalTag(G3);
 },
 // 16. 差 960 J が灰色の「熱」の箱へ。すべり台の面が赤みを帯びる。答え B
 [K+'ans3']:(p,ctx)=>{
  const a=wAt(ctx,'しょうもん',.4),b=wAt(ctx,'まさつが',.55);
  let s=real({red:seg(p,b,b+.1)})+lab6()+bars3({U0:1,tot0:1,K1:1,tot1:1,diff:seg(p,.08,.2),heat:seg(p,b,b+.15)});
  s+=card(290,90,560,80,T(`1500-540=960\\ \\mathrm{J}`,540,132,38),seg(p,.03,.12),C.hi);
  return s+goalTag(G3)+A3(seg(p,a,a+.05));
 },
 // 17. 誤答 A・D（1枚ずつ）
 [K+'wrongAD']:(p,ctx)=>{
  const d=wAt(ctx,'ディーの',.5);
  let s=real({red:1})+lab6()+bars3({U0:1,tot0:1,K1:1,tot1:1,diff:1,heat:1,g:.5});
  s+=wrongSeq(p,ctx,[['A','540 J','下端の K を 答えた'],['D','1500 J','K が 残っている']],{win:[[0,d],[d,1]],opts:{x:290,w:560,y:92}});
  return s+goalTag(G3)+A3(1);
 },
 // 18. 誤答 C。2文目でまとめ：落差と速さ、1500−540＝960 J → 熱、「K＋U 一定の条件」
 [K+'wrongC']:(p,ctx)=>{
  const b=wAt(ctx,'いっていなのは',.45),sm=seg(p,b,b+.06);
  let s=fade(1-sm,real({red:1})+lab6()+bars3({U0:1,tot0:1,K1:1,tot1:1,diff:1,heat:1,g:.5}));
  s+=wrongCard('C','0 J','保存の 条件を 見落とした',{x:290,w:560,y:92,g:seg(p,.03,.1)*(1-sm)});
  // まとめ
  let m=slide({m18:1})+kid(S18,{lab:0})+kid(1,{lab:0});
  m+=line(xS(0),yS(0),660,yS(0),{color:HC,w:2,dash:'6 6'});
  m+=arrow(650,yS(0),650,SB,{color:HC,w:4,head:14})+arrow(xS(S18)+110,yS(0),xS(S18)+110,yS(S18),{color:HC,w:4,head:14});
  m+=label('5.0 m',640,330,{size:22,color:HC,anchor:'end',weight:700})+label('3.2 m',xS(S18)+118,250,{size:22,color:HC,weight:700});
  const rows=[['落差 5.0 m → 10 m/s',C.v,yS(1)-10,650],['落差 3.2 m → 8.0 m/s',C.v,yS(S18),xS(S18)+130],['実際：1500−540＝960 J → 熱',HEAT,0,0]];
  rows.forEach(([t,col,ty,tx],i)=>{const y=150+i*78;m+=card(700,y-34,480,58,label(t,940,y+6,{size:26,color:col===HEAT?C.ink:col,anchor:'middle',weight:700}),seg(p,b+.04+i*.05,b+.1+i*.05),col);
   if(ty)m+=fade(seg(p,b+.04+i*.05,b+.1+i*.05),line(tx,ty,700,y-4,{color:col,w:2,dash:'6 6'}));});
  m+=card(700,384,490,64,label('K＋U 一定：重力・ばねの力だけが仕事',945,425,{size:24,color:C.hi,anchor:'middle',weight:700}),seg(p,b+.2,b+.28),C.hi);
  m+=answerRow([[1,'C','10 m/s'],[2,'A','8.0 m/s'],[3,'B','960 J']],{g:seg(p,b+.3,b+.38)});
  s+=fade(sm,m);
  return s+(sm<1?fade(1-sm,goalTag(G3)+A3(1)):'');
 },
};
// ---- 実際のすべり台（S3）--------------------------------------------------------------------
const real=(o={})=>slide({...o})+label('実際の すべり台',440,230,{size:26,color:C.ink,anchor:'middle',weight:700})+kid(0,{g:.5,lab:0});
const lab6=()=>kid(1,{lab:0})+label('実際：6.0 m/s',xS(1),SB-60,{size:26,color:C.v,anchor:'middle',weight:700});
// 2本の棒（はじめ・下端）と熱の箱。枠は x 700〜1190
const B3={x0:790,x1:930,hx:1090,base:450,k:250/1500};
function bars3({g=1,U0=0,tot0=0,K1=0,tot1=0,diff=0,heat=0}={}){
 const {x0,x1,hx,base,k}=B3;
 let s=card(700,190,490,315,'',1,KC);
 s+=line(730,base,1000,base,{color:C.dim,w:3});
 s+=label('はじめ',x0,base+34,{size:22,color:C.ink,anchor:'middle',weight:700})+label('下端',x1,base+34,{size:22,color:C.ink,anchor:'middle',weight:700});
 if(U0)s+=fade(U0,stack(x0,base,1500*U0,0,{k,tot:0,w:100})+label('U',x0,base-1500*k/2-6,{size:22,color:C.bg,anchor:'middle',weight:700})+label('1500 J',x0,base-1500*k/2+22,{size:22,color:C.bg,anchor:'middle',weight:700}));
 if(tot0)s+=fade(tot0,line(x0-56,base-1500*k,x1+56,base-1500*k,{color:TOT,w:3,dash:tot1?'8 6':''}));
 if(K1)s+=fade(K1,stack(x1,base,0,540*K1,{k,tot:0,w:100})+label('K',x1,base-540*k/2-6,{size:22,color:C.bg,anchor:'middle',weight:700})+label('540 J',x1,base-540*k/2+22,{size:22,color:C.bg,anchor:'middle',weight:700}));
 if(tot1)s+=fade(tot1,line(x1-56,base-540*k,x1+56,base-540*k,{color:TOT,w:4}));
 if(diff){const y0=base-1500*k,y1=base-540*k;
  s+=fade(diff*(1-heat),rect(x1-40,y0,80,y1-y0,{fill:HEAT,fo:.35,stroke:HEAT,sw:2,rx:3})+label('960 J',x1,(y0+y1)/2+8,{size:24,color:C.ink,anchor:'middle',weight:700}));
  if(heat){const u=heat,hx0=x1+(hx-x1)*u,hy0=y0+(base-160*k*0-(y1-y0)-y0)*0;
   s+=rect(hx-62,base-(y1-y0),124,y1-y0,{fill:HEAT,fo:.12+.38*u,stroke:HEAT,sw:2,rx:6});
   s+=fade(u,label('熱',hx,base-(y1-y0)-14,{size:26,color:C.ink,anchor:'middle',weight:700})+label('960 J',hx,base-(y1-y0)/2+8,{size:24,color:C.ink,anchor:'middle',weight:700}));
   if(u<1)s+=fade(1-u,rect(hx0-40,y0,80,y1-y0,{fill:HEAT,fo:.35,stroke:HEAT,sw:2,rx:3}));
  }
 }
 if(!heat)s+=label('熱',B3.hx,base+34,{size:22,color:C.dim,anchor:'middle',weight:700});
 return fade(g,s);
}
// 出題中の図の右下の小さな枠「実際のすべり台（小問3）」
function miniReal(g=1){
 if(g<=0)return '';
 let s=card(945,300,245,205,'',g);
 const P=[];for(let i=0;i<=20;i++){const t=i/20;P.push([975+150*t,400+80*(1-(1-t)**2)]);}
 s+=fade(g,label('実際の すべり台',1067,330,{size:22,color:C.ink,anchor:'middle',weight:700})+label('（小問3）',1067,358,{size:22,color:C.dim,anchor:'middle'})
  +draw(P,1,{color:C.dim,w:4})+line(1125,480,1160,480,{color:C.dim,w:4})+label('実際：6.0 m/s',1067,500,{size:22,color:C.v,anchor:'middle',weight:700}));
 return s;
}

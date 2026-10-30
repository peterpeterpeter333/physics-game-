// 問題編 解説「準位の値そのものは、光子にならない」(ys-qx-hs-a-photon-3) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/501_光子と電子.md の q-hs-a-photon-3（解説 18 行）。
// 色（正本の冒頭）：準位・段差 橙、ν 桃、λ 水色、c 紫、h 白、光子 黄、電子 青、強調 黄、誤り 赤。
// 図：左に縦3段の階段（準位 3・2・1、エネルギーの縮尺どおり 55 px/eV）、右下に光の色帯（200〜720 nm、左が紫外線）。
// 元の単元動画（yt1-hs-a-photon-1・3）の部品を読み込んで使う（そのファイルは編集しない）。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,clamp,mix} from './anim.mjs';
import {electron,EC,NC,LC,CC,PH,UV,GRN,cs,Et,nut,lt,ct,ht,U,TX,photon,cross,check,cl} from './yt1-hs-a-photon-1-diagrams.mjs';
import {wl,hsAPhoton3Diagrams} from './yt1-hs-a-photon-3-diagrams.mjs';
import {card,goalTag,answerTag,wrongSeq,wrongCard,kindTag,note,tAt,cueT,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-hs-a-photon-3:';
const PI=Math.PI;
const G1='3→2 の光の波長',G2='波長が最短の移り方',G3='ありえない光子のエネルギー';
const A1=g=>answerTag(1,'D','620 nm',{g}),A2=g=>answerTag(2,'A','3→1',{g}),A3=g=>answerTag(3,'C','3.0 eV',{g});
const LV=[[3,-1.0,'−1.0'],[2,-3.0,'−3.0'],[1,-6.1,'−6.1']];
const EHC=`${Et}=\\dfrac{${ht}${ct}}{${lt}}`,LHC=`${lt}=\\dfrac{${ht}${ct}}{${Et}}`;
function commaWin(ctx,mark,{from=0}={}){
 const r=(ctx?.cue?.reading??'').replace(/\s/g,''),ve=voiceEnd(ctx),i=r.indexOf(mark);
 const b=from+(ve-from)*(i<0?.5:(i+mark.length)/r.length);return [[from,b],[b,1]];
}
// ---- 階段 --------------------------------------------------------------------------------------------
// L＝{x0,x1,y0,k}：準位 E の高さ y＝y0−E·k（E＜0 なので下へ）
const BIG={x0:300,x1:560,y0:100,k:55}, SMALL={x0:300,x1:520,y0:92,k:36};
const yL=(L,E)=>L.y0-E*L.k;
function ladder(L=BIG,{g=1,hl=[],size=26,labels=1}={}){
 let s='';
 for(const [n,E,t] of LV){const h=hl.includes(n),y=yL(L,E);
  s+=line(L.x0,y,L.x1,y,{color:h?C.hi:EC,w:h?6:4});
  if(labels)s+=label(`準位 ${n}：${t} eV`,L.x0-16,y+9,{size,color:h?C.hi:EC,anchor:'end',weight:700});}
 return fade(g,s);
}
// 準位 a から b への下向きの矢印（x の位置）
const ARX={32:370,21:440,31:510};
function jump(L,a,b,{g=1,col=EC,w=5,lab='',labCol=null,size=26,x=null,both=0,left=null}={}){
 const Ea=LV.find(v=>v[0]===a)[1],Eb=LV.find(v=>v[0]===b)[1],xx=x??ARX[`${a}${b}`];
 let s=both?arrow(xx,yL(L,Eb)-4,xx,yL(L,Ea)+6,{color:col,w,head:14}):'';
 s+=arrow(xx,yL(L,Ea)+4,xx,yL(L,Eb)-6,{color:col,w,head:14});
 const lf=left??(a===2&&b===1);
 if(lab)s+=label(lab,lf?xx-12:xx+12,(yL(L,Ea)+yL(L,Eb))/2+9,{size,color:labCol??col,weight:700,anchor:lf?'end':'start'});
 return fade(g,s);
}
// ---- 光の色帯（200〜720 nm。左の 200〜380 nm は紫外線）--------------------------------------------------
const BAND={x:640,y:430,w:520,h:40};
const bX=n=>BAND.x+BAND.w*(n-200)/520;
function band({g=1,dark=0,marks=[],lamTag=0,ticks=1}={}){
 const {x,y,w,h}=BAND;let s='';
 s+=fade(1-dark*.8,rect(x,y,bX(380)-x,h,{fill:'#3a2a66',fo:.9,stroke:UV,sw:2,rx:4}));
 for(let q=x+8;q<bX(380)-6;q+=16)s+=fade(1-dark*.8,line(q,y+h-6,q+10,y+6,{color:UV,w:2,opacity:.6}));
 for(let n=380;n<720;n+=4)s+=fade(1-dark*.85,rect(bX(n),y,bX(n+4)-bX(n)+.6,h,{fill:wl(n),fo:1,stroke:'none',rx:0}));
 s+=rect(bX(380),y,bX(720)-bX(380),h,{fill:'none',fo:0,stroke:C.dim,sw:1.5,rx:2});
 s+=label('紫外線',(x+bX(380))/2,y-12,{size:22,color:UV,anchor:'middle',weight:700})+label('見える 光',(bX(380)+bX(720))/2,y-12,{size:22,color:C.dim,anchor:'middle'});
 if(ticks)for(const n of [300,400,500,600,700])s+=line(bX(n),y+h,bX(n),y+h+8,{color:LC,w:2})+label(String(n),bX(n),y+h+30,{size:22,color:LC,anchor:'middle'});
 if(ticks)s+=label('nm',x+w+8,y+h+30,{size:22,color:LC});
 if(lamTag)s+=fade(lamTag,label('λ：波長',x-12,y+h/2+9,{size:26,color:LC,anchor:'end',weight:700}));
 for(const [n,mg,txt,col,dy=0] of marks){if(mg<=0.001)continue;const xx=bX(n);
  s+=fade(mg,line(xx,y-6,xx,y+h+6,{color:'#fff',w:4})+arrow(xx,y-58+dy,xx,y-10,{color:col??C.hi,w:3,head:10})+label(txt,xx,y-64+dy,{size:24,color:col??C.hi,anchor:'middle',weight:700}));}
 return fade(g,s);
}
// 出題の図：階段・電子（準位 3 → 2）・光子
function setup(u,{g=1,ph=1,bandG=1,e=1}={}){
 const L=BIG;let s=ladder(L)+band({g:bandG});
 const ey=mix(yL(L,-1.0),yL(L,-3.0),seg(u,.15,.6))-16;
 if(e)s+=electron(340,ey,{r:14});
 const v=seg(u,.6,1);
 if(ph&&v>0)s+=photon(mix(400,620,v),mix(yL(L,-3.0)-20,yL(L,-3.0)-120,v),{r:11});
 return fade(g,s);
}

export const qxHsAPhoton3Diagrams={
 // ================= 問題アニメ =================
 // 出題（小問1）：0〜4秒、電子が準位 3 から準位 2 へ落ち、黄の光子が1個出る。段差・波長の値・色帯の印は描かない。
 [K+'q1']:(p)=>setup(p),
 // 小問2：小問1 の電子と光子を消してから、3→2、2→1、3→1 の3本の矢印を順に描く。値・長さの比べ合わせは描かない。
 [K+'q2']:(p)=>{
  let s=ladder(BIG)+band();
  [['32',3,2],['21',2,1],['31',3,1]].forEach(([k,a,b],i)=>{const g=seg(p,.1+i*.25,.3+i*.25);s+=jump(BIG,a,b,{g})+fade(g,label(`${a}→${b}`,ARX[k],yL(BIG,LV.find(v=>v[0]===a)[1])-14,{size:26,color:C.ink,anchor:'middle',weight:700}));});
  return s;
 },
 // ================= S1 小問1：3→2 の波長 =================
 [K+'goal1']:(p)=>setup(1)+goalTag(G1,{g:seg(p,.03,.15)}),
 // 2. 記号の札（E高・E低・hν）を先に置き、そのあとで hν＝E高−E低。「差」を光らせる
 [K+'diff']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,L=BIG;
  let s=ladder(L,{hl:seg(p,.05,.12)>.5&&seg(p,b,b+.02)<.5?[3,2,1]:[]})+band({g:1-seg(p,b,b+.06)});
  const pu=seg(p,0,.12);s+=electron(340,yL(L,-3.0)-16,{r:14})+photon(mix(620,760,pu),mix(yL(L,-3.0)-120,118,pu),{r:11});
  s+=fade(seg(p,b+.02,b+.1),label('E高：移る前の 準位',580,yL(L,-1.0)+9,{size:26,color:EC,weight:700})+label('E低：移った後の 準位',580,yL(L,-3.0)+34,{size:26,color:EC,weight:700}));
  s+=fade(seg(p,b+.12,b+.2),label('hν：光子 1個の エネルギー',786,127,{size:26,color:PH,weight:700}));
  s+=card(720,330,440,90,label('hν ＝ E高 − E低',940,388,{size:40,color:EC,anchor:'middle',weight:700}),seg(p,b+.3,b+.4),EC);
  s+=fade(seg(p,b+.5,b+.58),label('↑ 差 が 光子 1個に なる',940,462,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=goalTag(G1);
  return s;
 },
 // 3. 3→2：−1.0−(−3.0)＝2.0 eV（橙の両矢印）
 [K+'d32']:(p)=>{
  const L=BIG;let s=ladder(L,{hl:[3,2]})+electron(340,yL(L,-3.0)-16,{r:14});
  s+=jump(L,3,2,{g:seg(p,.05,.2),both:1,lab:'2.0 eV',size:30});
  s+=card(720,140,440,90,label('hν ＝ E高 − E低',940,198,{size:36,color:EC,anchor:'middle',weight:700}),1,EC);
  s+=cl(`-1.0-(-3.0)=${cs(EC,'2.0'+U('eV'))}`,700,320,seg(p,.25,.4),{size:42});
  s+=goalTag(G1);
  return s;
 },
 // 4. 札を先に（E＝hν・λ）→ E＝hc/λ → Eλ＝hc → λ＝hc/E（一操作ずつ）→ 1240÷2.0＝620 nm、色帯の 620 nm に印
 [K+'lam']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,a=b;
  let s=fade(seg(p,.02,.08),photon(90,130,{r:11})+label('E（＝hν）：光子 1個の エネルギー',120,139,{size:26,color:EC,weight:700}));
  s+=band({lamTag:seg(p,.02,.08),marks:[[620,seg(p,a+.35,a+.45),'620 nm',C.hi]]});
  s+=cl(EHC,80,240,seg(p,.1,.18),{size:44});
  s+=fade(seg(p,.22,.28),label('両辺に λ を 掛ける',360,232,{size:24,color:C.dim,weight:700}));
  s+=cl(`${Et}\\,${lt}=${ht}${ct}`,80,320,seg(p,.28,.36),{size:44});
  s+=fade(seg(p,.4,.46),label('両辺を E で 割る',360,312,{size:24,color:C.dim,weight:700}));
  s+=card(60,350,300,110,TX(LHC,210,418,{size:44}),seg(p,.46,.54),LC);
  s+=cl(`${lt}=\\dfrac{1240}{2.0}=${cs(LC,'620'+U('nm'))}`,660,250,seg(p,a+.05,a+.18),{size:42});
  s+=fade(seg(p,a+.45,a+.55),label('橙に 近い 赤',bX(620)+40,BAND.y-100,{size:26,color:'#ff7a45',anchor:'middle',weight:700}));
  s+=goalTag(G1);
  return s;
 },
 // 5. 小問1 の答え D。誤答 A（準位 3 の値）→ 誤答 B（準位 2 の値）
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,L=SMALL;
  let s=ladder(L,{size:24})+jump(L,3,2,{both:1,lab:'2.0 eV → 620 nm',size:24});
  s+=wrongSeq(p,ctx,[['A','1240 nm','準位 3 の 値 1.0 eV を 使った',{mid:'1240\\div 1.0=1240',midSize:30}],['B','413 nm','準位 2 の 値 3.0 eV を 使った',{mid:'1240\\div 3.0\\approx 413',midSize:30}]],{win:commaWin(ctx,'でんしボルト、',{from:b})});
  s+=goalTag(G1)+A1(seg(p,.03,.1));
  return s;
 },
 // 6. 誤答 C（1.0＋3.0）。「光子になるのは差」で 2.0 eV の矢印を光らせる
 [K+'wrongC']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,L=SMALL,h=seg(p,b,b+.05);
  let s=ladder(L,{size:24})+jump(L,3,2,{both:1,lab:'2.0 eV（差）',size:24,col:h>.5?C.hi:EC,w:5+3*h});
  s+=wrongCard('C','310 nm','1.0＋3.0 を 使った',{mid:'1240\\div 4.0=310',midSize:30,g:seg(p,.02,.08)});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // ================= S2 小問2：いちばん短い波長 =================
 [K+'goal2']:(p)=>{
  let s=qxHsAPhoton3Diagrams[K+'q2'](1);
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 8. 2→1：3.1 eV、400 nm（紫）
 [K+'d21']:(p)=>{
  const L=BIG;let s=ladder(L,{hl:[2,1]});
  s+=fade(.35,jump(L,3,2,{lab:'2.0 eV'})+jump(L,3,1));
  s+=jump(L,2,1,{lab:'3.1 eV',size:28,col:C.hi,w:6});
  s+=band({marks:[[620,.5,'620',C.dim],[400,seg(p,.6,.7),'400 nm',UV]]});
  s+=cl(`-3.0-(-6.1)=${cs(EC,'3.1'+U('eV'))}`,640,150,seg(p,.05,.18),{size:40});
  s+=cl(`${lt}=\\dfrac{1240}{3.1}=${cs(LC,'400'+U('nm'))}`,640,270,seg(p,.35,.48),{size:40});
  s+=goalTag(G2);
  return s;
 },
 // 9. 3→1：5.1 eV、約243 nm（紫外線の側）
 [K+'d31']:(p)=>{
  const L=BIG;let s=ladder(L,{hl:[3,1]});
  s+=fade(.35,jump(L,3,2,{lab:'2.0 eV'})+jump(L,2,1,{lab:'3.1 eV'}));
  s+=jump(L,3,1,{lab:'5.1 eV',size:28,col:C.hi,w:6});
  s+=band({marks:[[620,.5,'620',C.dim],[400,.5,'400',C.dim],[243,seg(p,.6,.7),'243 nm',UV]]});
  s+=cl(`-1.0-(-6.1)=${cs(EC,'5.1'+U('eV'))}`,640,150,seg(p,.05,.18),{size:40});
  s+=cl(`${lt}=\\dfrac{1240}{5.1}\\approx ${cs(LC,'243'+U('nm'))}`,640,270,seg(p,.35,.48),{size:40});
  s+=goalTag(G2);
  return s;
 },
 // 10. 段差（2.0、3.1、5.1）と波長（620、400、243）を左右に並べ、黄の線で結ぶ。答え A
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  const rows=[['3→2',2.0,620],['2→1',3.1,400],['3→1',5.1,243]];
  let s=card(40,96,1120,330,'',seg(p,0,.08),C.faint);
  s+=fade(seg(p,0,.08),label('段差',190,136,{size:24,color:EC,anchor:'middle',weight:700})+label('波長',900,136,{size:24,color:LC,anchor:'middle',weight:700}));
  rows.forEach(([t,E,n],i)=>{const y=190+i*90,g=seg(p,.05+i*.08,.13+i*.08),hl=i===2?seg(p,b,b+.05):0;
   let r=label(t,90,y+9,{size:28,color:hl>.5?C.hi:C.ink,weight:700})+rect(170,y-16,E*70,32,{fill:EC,fo:.55,stroke:hl>.5?C.hi:EC,sw:2+2*hl,rx:4})+label(`${E.toFixed(1)} eV`,180+E*70,y+9,{size:26,color:EC,weight:700});
   const lam=n/9,pts=[];for(let x=720;x<=1000;x+=3)pts.push([x,y-14*Math.sin(2*PI*(x-720)/lam)]);
   r+=draw(pts,1,{color:wl(n<380?380:n),w:3})+label(`${n} nm`,1020,y+9,{size:26,color:LC,weight:700});
   r+=fade(seg(p,.35+i*.05,.42+i*.05),line(280+E*70,y,710,y,{color:C.hi,w:3,dash:'8 6'}));
   s+=fade(g,r);});
  s+=fade(seg(p,.55,.65),label('段差が 大きい ほど 波長は 短い',600,465,{size:30,color:C.hi,anchor:'middle',weight:700})+TX(LHC,1050,470,{size:36}));
  s+=goalTag(G2)+A2(seg(p,b,b+.06));
  return s;
 },
 // 11. 誤答 B（分母と分子を逆）→ 誤答 C（最後の段への移り方）
 [K+'wrongBC']:(p,ctx)=>{
  const L=SMALL;let s=ladder(L,{size:24})+jump(L,3,2,{lab:'2.0',size:24})+jump(L,2,1,{lab:'3.1',size:24})+jump(L,3,1,{lab:'5.1 eV',size:24});
  s+=wrongSeq(p,ctx,[['B','3→2','段差が 小さいほど 短いと 逆に 考えた'],['C','2→1','決めるのは 段差の 大きさ（2→1 は 3.1 eV）']],{win:commaWin(ctx,'かんがえ、')});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // 12. 誤答 D（どれも同じ）
 [K+'wrongD']:(p)=>{
  const L=SMALL;let s=ladder(L,{size:24})+jump(L,3,2,{lab:'2.0',size:24})+jump(L,2,1,{lab:'3.1',size:24})+jump(L,3,1,{lab:'5.1 eV',size:24});
  s+=wrongCard('D','どれも 同じ','段差ごとに 色が 違う',{g:seg(p,.02,.08)});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // ================= S3 小問3：ありえない値 =================
 [K+'goal3']:(p)=>{
  const L=BIG;let s=ladder(L)+jump(L,3,2)+jump(L,2,1)+jump(L,3,1);
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 14. 3本の矢印から札「2.0 eV」「3.1 eV」「5.1 eV」が出て一列に並ぶ
 [K+'three']:(p)=>{
  const L=BIG;let s=ladder(L)+jump(L,3,2)+jump(L,2,1)+jump(L,3,1);
  const tags=[[32,2.0,-1.0,-3.0],[21,3.1,-3.0,-6.1],[31,5.1,-1.0,-6.1]];
  tags.forEach(([k,E,a,b],i)=>{const u=seg(p,.1+i*.15,.3+i*.15),x0=ARX[k]+60,y0=(yL(L,a)+yL(L,b))/2,x1=740+i*150,y1=200;
   s+=card(mix(x0,x1,u)-62,mix(y0,y1,u)-30,124,56,label(`${E.toFixed(1)} eV`,mix(x0,x1,u),mix(y0,y1,u)+9,{size:28,color:EC,anchor:'middle',weight:700}),seg(p,.08+i*.15,.14+i*.15),EC);});
  s+=fade(seg(p,.7,.8),label('準位の 差は この 3つ だけ',890,300,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=goalTag(G3);
  return s;
 },
 // 15. 「3.0 eV」の札を準位 2 の値と重ね、赤の線で消す。答え C
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,L=BIG;
  let s=ladder(L,{hl:[2]})+jump(L,3,2)+jump(L,2,1)+jump(L,3,1);
  [2.0,3.1,5.1].forEach((E,i)=>{s+=card(740+i*150-62,170,124,56,label(`${E.toFixed(1)} eV`,740+i*150,209,{size:28,color:EC,anchor:'middle',weight:700}),1,EC);});
  const u=seg(p,.08,.3),x=mix(890,170,u),y=mix(330,yL(L,-3.0)+56,u);
  s+=card(x-62,y-28,124,56,label('3.0 eV',x,y+10,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,.03,.1),C.dim);
  s+=fade(seg(p,.3,.4),label('準位 2 の 値の 大きさ',170,yL(L,-3.0)+116,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.42,.5),line(x-70,y+24,x+70,y-24,{color:'#ff6b6b',w:5}));
  s+=fade(seg(p,.42,.5),label('どの 差にも ならない',890,300,{size:28,color:'#ff6b6b',anchor:'middle',weight:700}));
  s+=goalTag(G3)+A3(seg(p,b,b+.06));
  return s;
 },
 // 16. A・B・D の値を対応する矢印に戻して緑の○。誤答 A・B・D のカード（1枚）
 [K+'wrongABD']:(p)=>{
  const L=SMALL;let s=ladder(L,{size:24})+jump(L,3,2)+jump(L,2,1)+jump(L,3,1);
  [[32,'A 2.0 eV（3→2）',-1.0,-3.0,130],[31,'D 5.1 eV（3→1）',-1.0,-6.1,205],[21,'B 3.1 eV（2→1）',-3.0,-6.1,280]].forEach(([k,t,a,b,ty],i)=>{const g=seg(p,.05+i*.12,.15+i*.12),x=820,y=(yL(L,a)+yL(L,b))/2;
   s+=fade(g,line(ARX[k]+8,y,x-130,ty,{color:GRN,w:2,dash:'6 6'})+card(x-125,ty-24,250,48,label(t,x,ty+9,{size:24,color:EC,anchor:'middle',weight:700}),1,GRN)+ring(x+150,ty,16,{color:GRN,w:4}));});
  s+=wrongCard('A・B・D','2.0・3.1・5.1 eV','段差なので 出る',{g:seg(p,.45,.52)});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // ================= S4 まとめ =================
 // 17. 色帯が暗くなり、620 nm と 400 nm の2本の線だけが光る。243 nm は帯の外（紫外線の側）に印
 [K+'line']:(p)=>{
  const d=seg(p,.05,.25),gl=seg(p,.25,.4);
  let s=band({dark:d,marks:[[620,gl,'620 nm','#ff7a45'],[400,gl,'400 nm',UV],[243,seg(p,.45,.55),'243 nm',UV]]});
  s+=fade(gl,rect(bX(620)-4,BAND.y,8,BAND.h,{fill:wl(620),fo:1,stroke:'none',rx:1})+rect(bX(400)-4,BAND.y,8,BAND.h,{fill:wl(400),fo:1,stroke:'none',rx:1}));
  const L=BIG;s+=ladder(L)+jump(L,3,2,{lab:'2.0'})+jump(L,2,1,{lab:'3.1'})+jump(L,3,1,{lab:'5.1 eV'});
  s+=fade(seg(p,.6,.72),label('線スペクトル',900,200,{size:36,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // 18. 元の単元動画の水素の赤い線の画面に戻る
 [K+'sum']:(p,ctx)=>hsAPhoton3Diagrams['hs-a-photon-3:c7'](p,ctx)+card(150,380,900,110,TX(`${LHC}=\\dfrac{1240}{1.89}\\approx 656${U('nm')}`,600,448,{size:40}),seg(p,.45,.58),LC),
};

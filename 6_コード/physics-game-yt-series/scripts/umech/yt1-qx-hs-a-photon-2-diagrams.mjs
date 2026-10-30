// 問題編 解説「仕事関数 2.1 eV の金属」(ys-qx-hs-a-photon-2) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/501_光子と電子.md の q-hs-a-photon-2（解説 20 行）。
// 色（正本の冒頭）：hν の棒 橙、W₀ 灰、Kmax 薄い橙、振動数 ν 桃、h 白、光子 黄、電子 青、強調 黄。
// 図：左上の光源から金属の板へ光（8.0×10¹⁴ Hz）。家計簿の棒（hν＝W₀＋残り）、Kmax–ν グラフ（ν₀ から傾き h）。
// 元の単元動画（yt1-hs-a-photon-1・2）の部品を読み込んで使う（そのファイルは編集しない）。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,axes,clamp,mix} from './anim.mjs';
import {electron,NEG,EC,NC,LC,PH,W0C,KC,UV,cs,Et,nut,ht,Wt,Kt,n0t,U,TX,P10,H_,E19,photon,ebar,metal,wavy,emit,source,cl} from './yt1-hs-a-photon-1-diagrams.mjs';
import {hsAPhoton2Diagrams} from './yt1-hs-a-photon-2-diagrams.mjs';
import {card,goalTag,answerTag,wrongSeq,wrongCard,kindTag,pauseBadge,note,tAt,cueT,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-hs-a-photon-2:';
const PI=Math.PI;
const G1='Kmax  ',G2='ν₀  ',G3='電子の数と Kmax  ';
const A1=g=>answerTag(1,'C','1.2 eV',{g}),A2=g=>answerTag(2,'A','約5.1×10¹⁴ Hz',{g}),A3=g=>answerTag(3,'B','',{g});
const LCOL='#c9a6ff';   // 光（8.0×10¹⁴ Hz、紫に近い光）
const hn=`${ht}${nut}`,hn0=`${ht}${n0t}`;
function commaWin(ctx,mark){
 const r=(ctx?.cue?.reading??'').replace(/\s/g,''),ve=voiceEnd(ctx),i=r.indexOf(mark);
 const b=ve*(i<0?.5:(i+mark.length)/r.length);return [[0,b],[b,1]];
}
// ---- 出題中の図：光源・光・金属の板・札 ------------------------------------------------------------
const SRC={x:200,y:190};
function setup(t,{g=1,emitOn=0,knobs=0,kb=.25,hb=0,rays=1,photons=1,ePause=null}={}){
 let s=metal(330,410,620,{text:'金属'});
 s+=label('W₀ ＝ 2.1 eV',970,442,{size:30,color:W0C,weight:700})+label('（仕事関数）',970,478,{size:22,color:C.dim});
 s+=source(SRC.x,SRC.y,{knobs,col:LCOL,kb,hb});
 s+=label('8.0×10¹⁴ Hz',SRC.x+120,SRC.y-78,{size:30,color:NC,weight:700});
 const ends=[[470,405],[600,405],[730,405]];
 if(rays)ends.forEach(([x1,y1],i)=>{s+=wavy(SRC.x+120,SRC.y+i*14-14,x1,y1,{color:LCOL,ph:t*1.2,amp:7,lam:26,w:3,g:rays});});
 if(photons){ends.forEach(([x1,y1],i)=>{const x0=SRC.x+120,y0=SRC.y+i*14-14;for(let k=0;k<2;k++){const u=((t*.55+k*.5+i*.17)%1);s+=photon(mix(x0,x1,u),mix(y0,y1,u),{r:8,g:photons});}});}
 if(emitOn)s+=emit(t,{x0:480,x1:760,y:410,n:6,period:1.8,speed:200,start:0,g:emitOn}).svg;
 return fade(g,s);
}
// ---- 家計簿の棒 ---------------------------------------------------------------------------------------
function budget(x,b0,hv,w0,k,{w=120,g=1,lab=1,hvLab=1,kLab='Kmax',size=26,gW=1,gK=1}={}){
 const r=Math.max(0,hv-w0);let s='';
 s+=fade(gW,rect(x-w/2,b0-w0*k,w,w0*k,{fill:W0C,fo:.4,stroke:W0C,sw:2.5,rx:4}));
 if(r>0.005)s+=fade(gK,rect(x-w/2,b0-hv*k,w,r*k,{fill:KC,fo:.55,stroke:KC,sw:2.5,rx:4}));
 s+=rect(x-w/2,b0-hv*k,w,hv*k,{fill:'none',fo:0,stroke:EC,sw:3,rx:4});
 if(hvLab)s+=TX(hn,x,b0-hv*k-20,{size:36});
 if(lab){s+=fade(gW,label('W₀',x+w/2+16,b0-w0*k/2+9,{size:size,color:W0C,weight:700}));
  if(r>0.005)s+=fade(gK,label(kLab,x+w/2+16,b0-w0*k-r*k/2+9,{size:size,color:KC,weight:700}));}
 return fade(g,s+line(x-w,b0,x+w,b0,{color:C.dim,w:3}));
}
// ---- Kmax–ν グラフ ------------------------------------------------------------------------------------
function graph({x=170,y=440,w=760,h=240,g=1,line1=1,pt=0,lineP=1,mark0=1,ext=0,e12=0}={}){
 const A=axes({x,y,w,h,xmax:10,ymax:2,g,xcolor:NC,ycolor:KC});
 const X=A.X,Y=A.Y,sl=.4125;   // eV / (10¹⁴ Hz)
 let s=A.svg+fade(g,TX(nut,x+w+62,y+12,{size:38})+TX(Kt,x-10,y-h-46,{size:34})+label('（eV）',x+52,y-h-40,{size:22,color:C.dim})+label('（×10¹⁴ Hz）',x+w-30,y+44,{size:22,color:C.dim}));
 if(line1)s+=fade(line1,line(X(0),Y(0)-3,X(5.09),Y(0)-3,{color:KC,w:5})+label('出ない → 0',X(2.5),Y(0)-16,{size:24,color:C.dim,anchor:'middle',weight:700}));
 if(pt)s+=fade(pt,dot(X(5.09),Y(0),11,C.hi)+TX(n0t,X(5.09),y+46,{size:34})+label('5.1',X(5.09)+40,y+44,{size:24,color:NC,weight:700}));
 if(ext>0){const v1=mix(5.09,10,ext);s+=draw([[X(5.09),Y(0)],[X(v1),Y(sl*(v1-5.09))]],1,{color:KC,w:5});
  s+=fade(seg(ext,.5,.8),label('傾き h',X(9.3),Y(sl*4.3)+40,{size:24,color:C.ink,weight:700}));}
 if(e12>0)s+=fade(e12,line(X(8),Y(0),X(8),Y(1.2),{color:NC,w:2,dash:'6 6'})+dot(X(8),Y(1.2),10,C.hi)+label('1.2 eV',X(8)-16,Y(1.2)-8,{anchor:'end',size:26,color:KC,weight:700})+label('8.0',X(8),y+44,{size:24,color:NC,anchor:'middle',weight:700}));
 return fade(g,s);
}
// ---- 明るさの比べ：上から光子が落ちて、板に当たると電子が1個出る ------------------------------------
function panel(x,t,{n=1,txt='',g=1,emitOn=0,bars=1}={}){
 let s=card(x,100,540,405,'',1)+metal(x+40,390,460,{text:''});
 const per=1.2,xs=[x+170,x+330];
 for(let i=0;i<n;i++){
  const k0=Math.floor(t/per)-3;
  for(let k=k0;k<k0+5;k++){const t0=k*per+i*per*.5,tt=t-t0;if(tt<0)continue;const u=tt/1.3;
   const px=xs[i];
   if(u<1){const py=mix(222,380,u);s+=photon(px,py,{r:8})+(bars?ebar(px+26,py+12,3.3,12,{w:12,fo:.6}):'');}
   else if(emitOn){const a=(u-1)*1.3;if(a<1.6)s+=electron(px+70*a,380-14-130*a+40*a*a,{r:12,op:clamp(1.8-a)});}}
 }
 s+=label(txt,x+270,145,{size:28,color:C.hi,anchor:'middle',weight:700});
 s+=label('1個の 棒 ＝ 3.3 eV',x+270,182,{size:24,color:EC,anchor:'middle',weight:700});
 return fade(g,s);
}

export const qxHsAPhoton2Diagrams={
 // ================= 問題アニメ =================
 // 出題（小問1・2）：0〜2秒 板と札、2〜5秒 光が当たり電子がいくつか飛び出す（速さは描き分けない）、約5秒で映像を一時停止。
 //   家計簿の棒・グラフは描かない。
 [K+'q0']:(p,ctx)=>{
  const tc=cueT(ctx),t=Math.min(Math.max(0,tc-2),3);
  let s=setup(t,{rays:seg(tc,1.8,2.2),photons:seg(tc,1.8,2.2),emitOn:tc>=2?1:0});
  s+=pauseBadge({g:seg(tc,5,5.3),x:640,size:22});
  return s;
 },
 // 小問3：前の光子・電子を消し、同じ色のまま明るさのつまみを ×2 へ回すだけ（電子の数・Kmax の変化は描かない）
 [K+'q3']:(p,ctx)=>{
  const u=seg(p,.25,.75);
  let s=setup(0,{rays:1,photons:0,knobs:1,kb:mix(.25,.6,u),hb:1});
  s+=label(`明るさ ×${u>.5?2:1}`,SRC.x+50,SRC.y+200,{size:28,color:C.hi,anchor:'middle',weight:700});
  s+=label('色は そのまま',SRC.x-50,SRC.y+240,{size:22,color:C.dim,anchor:'middle'});
  return s;
 },
 // ================= S1 小問1：Kmax =================
 [K+'goal1']:(p)=>setup(3,{emitOn:1})+goalTag(G1,{g:seg(p,.03,.15)}),
 // 2. 光子のエネルギー hν（橙の棒）。6.6×10⁻³⁴×8.0×10¹⁴＝5.28×10⁻¹⁹ J
 [K+'hv']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=fade(seg(p,.03,.15),photon(950,170,{r:11})+ebar(950,470,3.3,75,{w:110,fo:.5})+TX(hn,1050,350,{size:40}));
  s+=cl(`${Et}=${hn}`,60,170,seg(p,.05,.15),{size:42});
  s+=cl(`=${H_}\\times ${cs(NC,P10('8.0','14'))}`,140,260,seg(p,b+.02,b+.12),{size:42});
  s+=cl(`=${P10('5.28','-19')}${U('J')}`,140,350,seg(p,b+.4,b+.5),{size:42});
  s+=goalTag(G1);
  return s;
 },
 // 3. J → eV：5.28÷1.6＝3.3 eV
 [K+'eV']:(p)=>{
  let s=photon(950,170,{r:11})+ebar(950,470,3.3,75,{w:110,fo:.5})+TX(hn,1050,350,{size:40});
  s+=fade(.45,cl(`${Et}=${P10('5.28','-19')}${U('J')}`,60,150,1,{size:38}));
  s+=card(60,200,560,64,label('J → eV：1.6×10⁻¹⁹ で 割る',340,242,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.03,.14),C.hi);
  s+=cl(`\\dfrac{5.28}{1.6}=${cs(EC,'3.3'+U('eV'))}`,60,380,seg(p,.3,.45),{size:46});
  s+=fade(seg(p,.6,.72),label('3.3 eV',1015,200,{size:32,color:EC,weight:700}));
  s+=goalTag(G1);
  return s;
 },
 // 4. 費用 W₀＝2.1 eV（最小の費用）を灰で区切る。定義タグ
 [K+'w0']:(p)=>{
  let s=budget(330,340,3.3,2.1,68,{gW:seg(p,.3,.45),gK:0,lab:0});
  s+=fade(seg(p,.3,.45),label('W₀ ＝ 2.1 eV（最小の 費用）',410,340-2.1*68/2+10,{size:28,color:W0C,weight:700}));
  s+=label('3.3 eV',410,340-3.3*68+30,{size:28,color:EC,weight:700});
  s+=kindTag('定義',840,120,{text:'仕事関数 W₀',g:seg(p,.55,.68)});
  s+=goalTag(G1);
  return s;
 },
 // 5. 残りが一番大きい電子：Kmax＝3.3−2.1＝1.2 eV。式 Kmax＝hν−W₀
 [K+'kmax']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=budget(330,340,3.3,2.1,68,{gK:seg(p,.1,.25),lab:0});
  s+=label('W₀ ＝ 2.1 eV',410,340-2.1*68/2+10,{size:28,color:W0C,weight:700});
  s+=fade(seg(p,.1,.25),label('残り（最大）',410,340-2.1*68-1.2*68/2+10,{size:26,color:KC,weight:700}));
  s+=card(660,110,500,96,TX(`${Kt}=${hn}-${Wt}`,910,172,{size:44}),seg(p,b-.02,b+.08),KC);
  s+=cl(`=3.3-2.1=${cs(KC,'1.2'+U('eV'))}`,700,280,seg(p,b+.25,b+.38),{size:42});
  s+=goalTag(G1);
  return s;
 },
 // 6. 小問1 の答え C。誤答 A（W₀ を引き忘れた）
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=budget(330,320,3.3,2.1,60,{lab:0});
  s+=label('W₀ ＝ 2.1 eV',410,320-2.1*60/2+10,{size:26,color:W0C,weight:700})+label('Kmax ＝ 1.2 eV',410,320-2.1*60-1.2*60/2+10,{size:26,color:KC,weight:700});
  s+=card(660,110,500,96,TX(`${Kt}=${hn}-${Wt}`,910,172,{size:44}),1,KC);
  s+=wrongCard('A','3.3 eV','W₀ を 引き忘れた（hν そのもの）',{g:seg(p,b+.02,b+.08)});
  s+=goalTag(G1)+A1(seg(p,.03,.1));
  return s;
 },
 // 7. 誤答 B（W₀ を足した）→ 誤答 D（W₀ と Kmax を混同）
 [K+'wrongBD']:(p,ctx)=>{
  let s=budget(330,320,3.3,2.1,60,{lab:0});
  s+=label('W₀ ＝ 2.1 eV',410,320-2.1*60/2+10,{size:26,color:W0C,weight:700})+label('Kmax ＝ 1.2 eV',410,320-2.1*60-1.2*60/2+10,{size:26,color:KC,weight:700});
  s+=card(660,110,500,96,TX(`${Kt}=${hn}-${Wt}`,910,172,{size:44}),1,KC);
  s+=wrongSeq(p,ctx,[['B','5.4 eV','W₀ を 足した',{mid:'3.3+2.1=5.4',midSize:30}],['D','2.1 eV','W₀ と Kmax を 混同']],{win:commaWin(ctx,'しまい、')});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // ================= S2 小問2：限界振動数 =================
 [K+'goal2']:(p)=>{
  let s=budget(330,400,3.3,2.1,80,{lab:1});
  s+=card(660,150,500,96,TX(`${Kt}=${hn}-${Wt}`,910,212,{size:44}),1,KC);
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 9. hν の棒を短くしていき、W₀ と同じ長さで Kmax が消える → hν₀＝W₀ → 両辺を h で割って ν₀＝W₀/h
 [K+'edge']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,u=seg(p,.08,b-.12),hv=mix(3.3,2.1,u);
  let s=budget(330,400,hv,2.1,80,{lab:1,hvLab:0});
  s+=TX(u>.98?hn0:hn,330,400-hv*80-20,{size:36});
  s+=fade(seg(p,.05,.12)*(1-seg(p,b-.12,b-.06)),label('hν を 下げる ↓',460,120,{size:26,color:NC,weight:700}));
  s+=fade(seg(p,b-.12,b-.04),label('Kmax ＝ 0（ぎりぎり 飛び出す）',420,400-2.1*80-14,{size:24,color:C.hi,weight:700}));
  s+=card(800,150,370,90,TX(`${hn0}=${Wt}`,985,208,{size:44}),seg(p,b-.06,b+.02),C.hi);
  s+=fade(seg(p,b+.08,b+.16),label('両辺を h で 割る',985,290,{size:24,color:C.dim,anchor:'middle',weight:700}));
  s+=card(800,320,370,120,TX(`${n0t}=\\dfrac{${Wt}}{${ht}}`,985,392,{size:46}),seg(p,b+.2,b+.3),NC);
  s+=goalTag(G2);
  return s;
 },
 // 10. eV → J：1.6×10⁻¹⁹ を掛ける。W₀＝2.1×1.6×10⁻¹⁹＝3.36×10⁻¹⁹ J
 [K+'w0J']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=card(60,110,620,64,label('h の 単位は J·s → W₀ を J に',370,152,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,.03,.12),C.dim);
  s+=card(60,200,620,64,label('eV → J：1.6×10⁻¹⁹ を 掛ける',370,242,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.4),C.hi);
  s+=fade(seg(p,.3,.4),rect(48,190,644,84,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:14}));
  s+=cl(`${Wt}=2.1\\times ${E19}=${cs(W0C,P10('3.36','-19')+U('J'))}`,60,370,seg(p,b+.02,b+.14),{size:44});
  s+=goalTag(G2);
  return s;
 },
 // 11. ν₀＝3.36×10⁻¹⁹÷(6.6×10⁻³⁴)≈5.1×10¹⁴ Hz。グラフの横軸に ν₀。答え A
 [K+'nu0']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=cl(`${n0t}=\\dfrac{${P10('3.36','-19')}}{${H_}}\\approx ${cs(NC,P10('5.1','14')+U('Hz'))}`,60,140,seg(p,.03,.14),{size:40});
  s+=graph({y:470,h:200,g:seg(p,.4,.5),line1:seg(p,.45,.55),pt:seg(p,.55,.65)});
  s+=goalTag(G2)+A2(seg(p,b,b+.06));
  return s;
 },
 // 12. 誤答 B（eV のまま h で割った）→ 誤答 C（Kmax を h で割った）
 [K+'wrongBC']:(p,ctx)=>{
  let s=graph({y:272,h:140,pt:1});
  s+=wrongSeq(p,ctx,[['B','3.2×10³³ Hz','eV のまま h で 割った',{mid:`2.1\\div(${H_})\\approx ${P10('3.2','33')}`,midSize:30}],['C','2.9×10¹⁴ Hz','Kmax を h で 割った',{mid:`${P10('1.92','-19')}\\div(${H_})\\approx ${P10('2.9','14')}`,midSize:30}]]);
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // 13. 誤答 D（当てた光の振動数）。グラフの ν₀ から傾き h の直線、8.0×10¹⁴ Hz の点に 1.2 eV
 [K+'wrongD']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=graph({y:272,h:140,pt:1,ext:seg(p,b,b+.25),e12:seg(p,b+.25,b+.35)});
  s+=wrongCard('D','8.0×10¹⁴ Hz','当てた 光の 振動数',{g:seg(p,.02,.08)});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // ================= S3 小問3：明るさを2倍に =================
 [K+'goal3']:(p)=>{
  let s=setup(0,{rays:1,photons:0,knobs:1,kb:.6,hb:1});
  s+=label('明るさ ×2',SRC.x+50,SRC.y+200,{size:28,color:C.hi,anchor:'middle',weight:700});
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 15. 届く粒が2倍。各粒の棒（3.3 eV）は同じ長さ
 [K+'same']:(p,ctx)=>{
  const t=tAt(ctx,K+'same'),W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=panel(40,t,{n:1,txt:'明るさ ×1'})+panel(620,t,{n:2,txt:'明るさ ×2（同じ 振動数）',g:seg(p,.03,.12)});
  s+=goalTag(G3);
  return s;
 },
 // 16. 飛び出す電子の数が約2倍
 [K+'count']:(p,ctx)=>{
  const t=tAt(ctx,K+'same');
  let s=panel(40,t,{n:1,txt:'明るさ ×1',emitOn:1})+panel(620,t,{n:2,txt:'明るさ ×2（同じ 振動数）',emitOn:1});
  s+=card(140,444,340,52,label('電子の 数 ×1',310,480,{size:28,color:NEG,anchor:'middle',weight:700}),seg(p,.3,.4),NEG);
  s+=card(720,444,340,52,label('電子の 数 ×2',890,480,{size:28,color:NEG,anchor:'middle',weight:700}),seg(p,.4,.5),NEG);
  s+=goalTag(G3);
  return s;
 },
 // 17. 家計簿の棒（3.3＝2.1＋1.2）は明るさ ×1 と ×2 で同じ。答え B
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=budget(330,440,3.3,2.1,80,{lab:1,g:seg(p,.03,.12)})+budget(830,440,3.3,2.1,80,{lab:1,g:seg(p,.1,.2)});
  s+=fade(seg(p,.03,.12),label('明るさ ×1',330,480,{size:26,color:C.hi,anchor:'middle',weight:700}))+fade(seg(p,.1,.2),label('明るさ ×2',830,480,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.25,.35),label('Kmax ＝ 1.2 eV の まま',580,140,{size:30,color:KC,anchor:'middle',weight:700}));
  s+=goalTag(G3)+A3(seg(p,b,b+.06));
  return s;
 },
 // 18. 誤答 A（数も Kmax も2倍）→ 誤答 C（Kmax が2倍）
 [K+'wrongAC']:(p,ctx)=>{
  let s=budget(330,310,3.3,2.1,55,{lab:1,size:24})+budget(830,310,3.3,2.1,55,{lab:1,size:24});
  s+=label('明るさ ×1',240,230,{size:26,color:C.hi,anchor:'end',weight:700})+label('明るさ ×2',740,230,{size:26,color:C.hi,anchor:'end',weight:700});
  s+=wrongSeq(p,ctx,[['A','数も Kmax も 2倍','1個の エネルギーは 増えない'],['C','Kmax が 2倍','電子は 速く ならない']],{win:commaWin(ctx,'あかるくすると、')});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 19. 誤答 D（数も Kmax も同じ）
 [K+'wrongD3']:(p)=>{
  let s=budget(330,310,3.3,2.1,55,{lab:1,size:24})+budget(830,310,3.3,2.1,55,{lab:1,size:24});
  s+=label('明るさ ×1',240,230,{size:26,color:C.hi,anchor:'end',weight:700})+label('明るさ ×2',740,230,{size:26,color:C.hi,anchor:'end',weight:700});
  s+=wrongCard('D','数も Kmax も 同じ','明るさ ＝ 毎秒の 光子の 数',{g:seg(p,.03,.1)});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // ================= S4 まとめ：元の単元動画のまとめの画面 =================
 [K+'sum']:(p,ctx)=>hsAPhoton2Diagrams['hs-a-photon-2:ans2'](p,ctx),
};

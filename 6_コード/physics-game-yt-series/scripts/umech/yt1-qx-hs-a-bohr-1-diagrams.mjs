// 問題編 解説「400 V で加速した電子の波長」(ys-qx-hs-a-bohr-1) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/502_物質波とボーア模型.md の q-hs-a-bohr-1（解説 21 行）。
// 色（正本の 502 冒頭）：波長 λ 水色、速さ v・電圧 紫、運動量 p 桃、エネルギー 橙、電子 青、強調 黄、誤り 赤。
// 図：左右2枚の板（左 −、右 ＋）。電子は左の板の近くから右の板へ加速（x∝t²、矢印の長さ∝t）。波は電子のうしろに重ねる（目盛りなし）。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 元の単元動画（yt1-hs-a-bohr-1）の部品（電子・波・色・TeX の記号・電子線の干渉）を読み込んで使う（そのファイルは編集しない）。
import {C,seg,lin,fade,label,line,rect,dot,ring,arrow,clamp,mix,scaleAt} from './anim.mjs';
import {electron,LC,VC,PC,EC,NEG,POS,BAD,OK,cs,lam,pt,vt,Kt,U,TX,wave,slitBase,eDots,flyer,cross,okMark} from './yt1-hs-a-bohr-1-diagrams.mjs';
import {QC,card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,note,pauseBadge,sentWin,voiceEnd,textW} from './yt1-qx-common.mjs';

const K='qx-hs-a-bohr-1:';
const PI=Math.PI;
const F=(s,x,y,size=40,o={})=>TX(s,x,y,{size,...o});
const G1='速さ v',G2='λ',G3='波長の 倍率';
const A1=g=>answerTag(1,'B','約 1.2×10⁷ m/s',{g}),A2=g=>answerTag(2,'D','約 6.1×10⁻¹¹ m',{g}),A3=g=>answerTag(3,'A','1/2 倍',{g});
const W2=(ctx,d=.45)=>{const W=sentWin(ctx);return W[1]?W[1][0]:d;};
const mt=s=>`m${vt}`;

// ---- 板と電子 ------------------------------------------------------------------------------------------
const XL=180,XR=700,YT=135,YB=385,YE=260,X0=XL+28,X1=XR-42,BX=440;
function plates({g=1,volt='400 V',vg=1,v2='',v2g=0}={}){
 let s=rect(XL-16,YT,16,YB-YT,{fill:'#4f7fe0',fo:.9,stroke:C.dim,rx:3})+rect(XR,YT,16,YB-YT,{fill:'#e05252',fo:.9,stroke:C.dim,rx:3});
 s+=label('−',XL-8,YT-14,{size:30,color:NEG,anchor:'middle',weight:700})+label('＋',XR+8,YT-14,{size:30,color:POS,anchor:'middle',weight:700});
 s+=line(XL-8,YB,XL-8,462,{color:C.dim,w:3})+line(XR+8,YB,XR+8,462,{color:C.dim,w:3})+line(XL-8,462,BX-20,462,{color:C.dim,w:3})+line(BX+20,462,XR+8,462,{color:C.dim,w:3});
 s+=line(BX-20,437,BX-20,487,{color:C.ink,w:4})+line(BX+20,449,BX+20,475,{color:C.ink,w:7});
 s+=fade(vg,label(volt,BX,425,{size:30,color:VC,anchor:'middle',weight:700}));
 if(v2)s+=fade(v2g,label(v2,BX,425,{size:30,color:VC,anchor:'middle',weight:700}));
 return fade(g,s);
}
const ex=u=>mix(X0,X1,u*u);
// 電子と速さの矢印（u＝0→1 で左の板→右の板。矢印の長さは速さ∝u）
function eArrow(u,{g=1,val='',valG=1,arr=1}={}){
 const x=ex(u),L=18+102*u;
 let s=electron(x,YE,{r:14,op:g});
 if(arr&&u>.02)s+=arrow(x,YE-40,x+L,YE-40,{color:VC,w:5,head:14,g:g*arr*clamp(u*6)});
 if(val)s+=fade(g*valG,label(val,Math.max(x+L+10,XR+34),YE-32,{size:26,color:VC,anchor:'start',weight:700}));
 return s;
}
// 電子のうしろの水色の波（目盛りなし）
const trail=(u,{g=1,ph=0}={})=>wave(XL+12,ex(u)-22,YE,46,20,{g,ph});
// 出題中の図（t 秒）
function q0Pic(t,{badge=1}={}){
 const u=clamp(t/4),wg=seg(t,4,5.1);
 let s=plates()+trail(u,{g:wg})+eArrow(u);
 s+=note('粒が 波の 形に 進むのでは ない',(XL+XR)/2,350,{g:seg(t,4.6,5.4)});
 if(badge)s+=pauseBadge({g:seg(t,5.8,6.3),x:440});
 return s;
}
// 電圧のつまみ（u＝0 で 400 V、u＝1 で 1600 V）
function dial(u,{cx=930,cy=300,g=1}={}){
 const a=mix(150,30,u)*PI/180,R=72;
 let s=ring(cx,cy,R,{color:C.dim,w:4,fill:'#16223a'});
 for(const d of [150,30])s+=line(cx+(R+6)*Math.cos(d*PI/180),cy-(R+6)*Math.sin(d*PI/180),cx+(R+20)*Math.cos(d*PI/180),cy-(R+20)*Math.sin(d*PI/180),{color:VC,w:4});
 s+=label('400 V',cx-96,cy-62,{size:26,color:u<.5?VC:C.dim,anchor:'end',weight:700})+label('1600 V',cx+96,cy-62,{size:26,color:u>=.5?VC:C.dim,anchor:'start',weight:700});
 s+=line(cx,cy,cx+(R-12)*Math.cos(a),cy-(R-12)*Math.sin(a),{color:VC,w:7})+dot(cx,cy,9,VC);
 s+=label('電圧',cx,cy+R+44,{size:26,color:C.dim,anchor:'middle',weight:700});
 return fade(g,s);
}
// 波の行（電子が右へ、うしろに波。目盛り＝山から山）
function waveRow(y,lamPx,{g=1,x0=170,elx=930,vlen=80,tag='',tagCol=C.ink,span='',spanSrc='',spanCol=LC,gray=0,ph=0}={}){
 const col=gray?C.dim:LC,vc=gray?C.dim:VC;
 let s=wave(x0,elx-24,y,lamPx,20,{color:col,ph})+electron(elx,y,{r:14})+arrow(elx+18,y,elx+18+vlen,y,{color:vc,w:5,head:14});
 if(tag)s+=label(tag,x0-14,y+9,{size:26,color:tagCol,anchor:'end',weight:700});
 if(span||spanSrc){const a=x0+lamPx*(1/4-ph),b=a+lamPx,yy=y+44,sc=gray?C.dim:spanCol;
  s+=line(a,y-20,a,yy+8,{color:sc,w:2,dash:'5 5'})+line(b,y-20,b,yy+8,{color:sc,w:2,dash:'5 5'})+arrow(a,yy,b,yy,{color:sc,w:3,head:12})+arrow(b,yy,a,yy,{color:sc,w:3,head:12});
  if(span)s+=label(span,(a+b)/2,yy+34,{size:26,color:sc,anchor:'middle',weight:700});
  if(spanSrc)s+=F(spanSrc,(a+b)/2,yy+34,30,{color:sc});}
 return fade(gray?g*.55:g,s);
}
// 手順の矢印と注記（式の段の間）
const step=(t,x,y,g)=>fade(g,arrow(x,y,x,y+40,{color:C.hi,w:4,head:14})+label(t,x+24,y+30,{size:26,color:C.hi,weight:700}));
const yBox=(x,y,w,h,g)=>fade(g,rect(x,y,w,h,{fill:C.hi,fo:.08,stroke:C.hi,sw:3,rx:10}));

export const qxHsABohr1Diagrams={
 // ================= 問題アニメ =================
 // 出題（小問1・2 共通）：0〜4 秒 加速（矢印が伸びる。値なし）、4〜6 秒 電子のうしろに波と注記、約 6 秒で「映像を 一時停止」。
 [K+'q0']:(p,ctx)=>q0Pic(ctx?.t??p*6.5),
 // 小問3：400 V の電子・矢印・波・注記を消してから、つまみを 400 V → 1600 V に回す（1600 V の電子と波は描かない）
 [K+'q3']:(p,ctx)=>{
  const t=ctx?.t??p*3,o=1-seg(t,.1,.7),u=seg(t,1.1,2.5);
  let s=plates({volt:'400 V',vg:1-seg(u,.45,.6),v2:'1600 V',v2g:seg(u,.45,.6)});
  s+=fade(o,trail(1)+eArrow(1)+note('粒が 波の 形に 進むのでは ない',(XL+XR)/2,350));
  s+=dial(u,{g:seg(t,.6,1)});
  return s;
 },
 // ================= S1 小問1 電子の速さ =================
 // 1. 出題中の図（板・電子・紫の矢印）。求めるもの：速さ v
 [K+'goal1']:(p,ctx)=>{const t=ctx?.t??p*4;return plates()+eArrow(clamp(t/3.5))+goalTag(G1,{g:seg(p,.03,.15)});},
 // 2. 電子が板の間を進み、橙の札 K＝400 eV。前提タグ
 [K+'K']:(p,ctx)=>{
  const b=W2(ctx);let s=plates()+eArrow(lin(p,.02,Math.min(.9,b+.25)));
  s+=card(830,110,350,170,label('1 V で 1 eV',1005,160,{size:26,color:C.dim,anchor:'middle',weight:700})+F(`${Kt}=400${U('eV')}`,1005,235,44),seg(p,b,b+.08),EC);
  s+=kindTag('前提',990,340,{text:'全部が 運動エネルギーに',g:seg(p,b+.15,b+.25)});
  return s+goalTag(G1);
 },
 // 3. eV → J（黄の枠）。400×1.6×10⁻¹⁹＝6.4×10⁻¹⁷ J
 [K+'J']:(p)=>{
  let s=fade(.6,F(`${Kt}=400${U('eV')}`,600,140,40));
  s+=yBox(310,180,580,72,seg(p,.05,.15))+fade(seg(p,.05,.15),label('eV → J：1.6×10⁻¹⁹ を 掛ける',600,228,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=card(170,290,860,130,F(`${Kt}=400\\times1.6\\times10^{-19}=6.4\\times10^{-17}${U('J')}`,600,370,42),seg(p,.3,.4),EC);
  return s+goalTag(G1);
 },
 // 4. 先に記号（m・v・K）を図に置き、そのあと図を消して ½mv²＝K → 2倍 → m で割る
 [K+'sym']:(p)=>{
  const a=1-seg(p,.36,.44),b=seg(p,.42,.5);
  let s=fade(a,plates()+eArrow(1)
   +fade(seg(p,.04,.12),label('m：電子の 質量',ex(1)-24,YE+52,{size:26,color:C.ink,anchor:'end',weight:700}))
   +fade(seg(p,.12,.2),label('v：速さ',XR+34,YE-62,{size:26,color:VC,anchor:'start',weight:700}))
   +card(870,140,310,150,F(`${Kt}=400${U('eV')}`,1025,200,38)+fade(seg(p,.2,.28),label('K：運動エネルギー',1025,258,{size:26,color:EC,anchor:'middle',weight:700})),1,EC));
  s+=fade(b,F(`\\tfrac{1}{2}m${vt}^2=${Kt}`,600,140,48));
  s+=step('両辺を 2倍',560,170,seg(p,.52,.58))+fade(seg(p,.56,.64),F(`m${vt}^2=2${Kt}`,600,270,48));
  s+=step('m で 割る',560,300,seg(p,.66,.72))+card(370,350,460,150,F(`${vt}^2=\\dfrac{2${Kt}}{m}`,600,432,50),seg(p,.7,.78),VC);
  return s+goalTag(G1);
 },
 // 5. 数値を入れて v²≈1.4×10¹⁴ m²/s²。黄の札「ここで止めない」
 [K+'v2']:(p)=>{
  let s=fade(.6,F(`${vt}^2=\\dfrac{2${Kt}}{m}`,600,135,40));
  s+=card(100,200,1000,150,F(`${vt}^2=\\dfrac{2\\times6.4\\times10^{-17}}{9.1\\times10^{-31}}\\approx1.4\\times10^{14}${U('m^2/s^2')}`,600,290,42),seg(p,.03,.12),VC);
  s+=fade(seg(p,.7,.8),rect(450,390,300,60,{fill:C.hi,fo:.12,stroke:C.hi,sw:3,rx:14})+label('ここで 止めない',600,431,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s+goalTag(G1);
 },
 // 6. √ が v² を包む → v≈1.2×10⁷ m/s。2文目で図に戻り、右の板に着いたときの矢印に値。答えの札
 [K+'sqrt']:(p,ctx)=>{
  const b=W2(ctx,.55),f=1-seg(p,b-.04,b+.02),g=seg(p,b-.02,b+.05);
  let e=F(`${vt}^2\\approx1.4\\times10^{14}`,600,150,44);
  e+=fade(seg(p,.15,.3),F(`${vt}=\\sqrt{1.4\\times10^{14}}`,600,265,48));
  e+=card(330,330,540,110,F(`${vt}\\approx1.2\\times10^{7}${U('m/s')}`,600,398,46),seg(p,.32,.42),VC);
  let s=fade(f,e);
  s+=fade(g,plates()+eArrow(1,{val:'1.2×10⁷ m/s'})+label('右の板に 着いたとき',ex(1)-24,YE+52,{size:24,color:C.dim,anchor:'end',weight:700}));
  return s+goalTag(G1)+A1(seg(p,b+.02,b+.08));
 },
 // 7. 誤答 A（v² のまま）→ 誤答 C（2倍し忘れ）。1枚ずつ
 [K+'wAC']:(p,ctx)=>{
  let s=fade(.75,F(`${vt}=\\sqrt{\\dfrac{2${Kt}}{m}}\\approx1.2\\times10^{7}${U('m/s')}`,600,150,40));
  s+=wrongSeq(p,ctx,[
   ['A','1.4×10¹⁴ m/s','√ を とり忘れた（単位 m²/s²）',{mid:`${vt}^2\\approx1.4\\times10^{14}${U('m^2/s^2')}`}],
   ['C','8.4×10⁶ m/s','両辺の 2倍を 忘れた',{mid:`\\sqrt{${Kt}/m}\\approx8.4\\times10^{6}`,midSize:28}],
  ],{opts:{y:225}});
  return s+goalTag(G1)+A1(1);
 },
 // 8. 誤答 D（eV のまま）
 [K+'wD']:(p)=>{
  let s=fade(.75,F(`${vt}=\\sqrt{\\dfrac{2${Kt}}{m}}\\approx1.2\\times10^{7}${U('m/s')}`,600,150,40));
  s+=wrongCard('D','3.0×10¹⁶ m/s','eV のまま 使った（光速を 超える）',{y:225,g:seg(p,.03,.1),mid:`\\sqrt{2\\times400/m}\\approx3.0\\times10^{16}`,midSize:28});
  return s+goalTag(G1)+A1(1);
 },
 // ================= S2 小問2 電子の波長 =================
 // 9. 図に戻る（右の板に着いた電子）。求めるもの：λ
 [K+'goal2']:(p)=>plates()+eArrow(1,{val:'1.2×10⁷ m/s'})+goalTag(G2,{g:seg(p,.03,.15)}),
 // 10. 先に電子に「p：運動量」。そのあと p＝mv の数値（丸める前の値）
 [K+'p']:(p,ctx)=>{
  const b=W2(ctx),a=1-seg(p,b-.02,b+.04);
  let s=fade(a,plates()+eArrow(1,{val:'1.2×10⁷ m/s'})+fade(seg(p,.03,.1),label('p：運動量',ex(1)-24,YE+52,{size:28,color:PC,anchor:'end',weight:700})));
  s+=card(830,300,340,110,F(`${pt}=m${vt}`,1000,365,46),seg(p,.12,.2)*(1-seg(p,b-.02,b+.04)),PC);
  s+=card(60,190,1080,150,F(`${pt}=9.1\\times10^{-31}\\times1.19\\times10^{7}\\approx1.08\\times10^{-23}${U('kg\\cdot m/s')}`,600,275,40),seg(p,b,b+.08),PC);
  s+=note('1.19×10⁷：丸める 前の 値',600,390,{g:seg(p,b+.1,b+.18),size:24});
  return s+goalTag(G2);
 },
 // 11. λ＝h/p（p が分母）。2文目で数値と、電子のうしろの波に波長の目盛り 6.1×10⁻¹¹ m
 [K+'lam']:(p,ctx)=>{
  const b=W2(ctx),f=1-seg(p,b-.04,b+.02);
  let s=fade(f,card(400,150,400,200,F(`${lam}=\\dfrac{h}{${pt}}`,600,270,64),seg(p,.03,.12),LC)+yBox(634,256,60,62,seg(p,.06,.12)));
  s+=fade(seg(p,b,b+.06),F(`${lam}=\\dfrac{6.6\\times10^{-34}}{1.08\\times10^{-23}}\\approx6.1\\times10^{-11}${U('m')}`,600,150,40));
  s+=waveRow(320,150,{g:seg(p,b+.12,b+.2),span:'6.1×10⁻¹¹ m',elx:960});
  return s+goalTag(G2);
 },
 // 12. 答えの札。2文目で単位の約分 J·s÷(kg·m/s)＝m
 [K+'ans2']:(p,ctx)=>{
  const b=W2(ctx,.35),f=1-seg(p,b-.02,b+.04);
  let s=fade(f,F(`${lam}=\\dfrac{6.6\\times10^{-34}}{1.08\\times10^{-23}}\\approx6.1\\times10^{-11}${U('m')}`,600,150,40)+waveRow(320,150,{span:'6.1×10⁻¹¹ m',elx:960}));
  const g=seg(p,b,b+.06);
  s+=fade(g,label('単位',600,150,{size:30,color:C.dim,anchor:'middle',weight:700}));
  s+=fade(g,F(`\\mathrm{J\\cdot s}\\div(\\mathrm{kg\\cdot m/s})`,600,230,44));
  s+=fade(seg(p,b+.15,b+.25),F(`=\\mathrm{kg\\cdot m^2/s}\\div(\\mathrm{kg\\cdot m/s})`,600,320,44));
  s+=card(480,370,240,100,F(`=\\mathrm{m}`,600,430,50),seg(p,b+.35,b+.45),LC);
  return s+goalTag(G2)+A2(seg(p,.03,.1));
 },
 // 13. 誤答 A（逆）→ 誤答 B（h÷v）。1枚ずつ（声が B に移るところで切り替え）
 [K+'wAB']:(p,ctx)=>{
  const W=sentWin(ctx),m=W[0][0]+(W[0][1]-W[0][0])*.48;
  let s=fade(.75,F(`${lam}=\\dfrac{h}{${pt}}\\approx6.1\\times10^{-11}${U('m')}`,600,150,40));
  s+=wrongSeq(p,ctx,[
   ['A','1.6×10¹⁰ m','p/h と 逆に した（単位 1/m）',{mid:`${pt}/h=1.08\\times10^{-23}/(6.6\\times10^{-34})\\approx1.6\\times10^{10}`}],
   ['B','5.6×10⁻⁴¹ m','h÷v と した（単位 kg·m）',{mid:`h/${vt}=6.6\\times10^{-34}/(1.19\\times10^{7})\\approx5.6\\times10^{-41}`}],
  ],{win:[[0,m],[m,1]],opts:{y:225}});
  return s+goalTag(G2)+A2(1);
 },
 // 14. 誤答 C（光子の式）。「光子：λ＝hc/E」に赤の×、「電子：λ＝h/p」に緑の○
 [K+'wC']:(p,ctx)=>{
  const b=W2(ctx);
  let s=fade(seg(p,.03,.1),label('光子：',250,160,{size:30,color:C.hi,anchor:'end',weight:700})+F(`${lam}=\\dfrac{hc}{E}`,340,150,40)+cross(470,145,22,1));
  s+=fade(seg(p,b,b+.06),label('電子：',750,160,{size:30,color:NEG,anchor:'end',weight:700})+F(`${lam}=\\dfrac{h}{${pt}}`,840,150,40)+okMark(960,145,1));
  s+=wrongCard('C','3.1×10⁻⁹ m','光子の 式を 使った',{y:255,g:seg(p,.03,.1),mid:`1240${U('eV\\cdot nm')}\\div400${U('eV')}=3.1${U('nm')}`});
  return s+goalTag(G2)+A2(1);
 },
 // ================= S3 小問3 電圧4倍 =================
 // 15. 400 V の波・目盛り・矢印を灰色にして「400 V のとき」。電圧のつまみが 1600 V へ（1600 V の波はまだ描かない）
 [K+'goal3']:(p)=>{
  let s=waveRow(150,150,{gray:1,span:'6.1×10⁻¹¹ m',tag:'',x0:150,elx:880})+label('400 V のとき',150,110,{size:26,color:C.dim,weight:700});
  s+=dial(seg(p,.35,.75),{cx:600,cy:370,g:seg(p,.2,.3)});
  return s+goalTag(G3,{g:seg(p,.03,.15)});
 },
 // 16. 札を順に「K：4倍」→「速さ：√4＝2倍」（√4＝2 に黄の枠）
 [K+'x4']:(p,ctx)=>{
  const b=W2(ctx);
  let s=fade(.6,waveRow(150,150,{gray:1,span:'6.1×10⁻¹¹ m',x0:150,elx:880})+label('400 V のとき',150,110,{size:26,color:C.dim,weight:700}));
  s+=card(150,300,380,110,label('K：4倍',340,370,{size:38,color:EC,anchor:'middle',weight:700}),seg(p,.05,.12),EC);
  s+=fade(seg(p,b,b+.06),F(`${vt}=\\sqrt{\\dfrac{2${Kt}}{m}}`,860,260,36));
  s+=card(620,320,480,110,label('速さ：√4＝2倍',860,390,{size:38,color:VC,anchor:'middle',weight:700}),seg(p,b+.15,b+.22),VC);
  s+=yBox(828,340,174,72,seg(p,b+.3,b+.38));
  return s+goalTag(G3);
 },
 // 17. 「λ の分母：2倍」→「λ：1/2」。2文目で 400 V と 1600 V の波長の目盛りを上下に並べ、答えの札
 [K+'half']:(p,ctx)=>{
  const b=W2(ctx,.6),f=1-seg(p,b-.04,b+.02);
  let s=fade(f,F(`${lam}=\\dfrac{h}{m${vt}}`,600,170,56)+yBox(608,160,90,58,seg(p,.1,.18))
   +card(170,320,380,100,label('λ の 分母：2倍',360,382,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.12,.2),C.hi)
   +card(650,320,380,100,label('λ：1/2',840,382,{size:38,color:LC,anchor:'middle',weight:700}),seg(p,.4,.48),LC)
   +fade(seg(p,.38,.44),arrow(560,370,640,370,{color:C.hi,w:4,head:14})));
  const g=seg(p,b,b+.06);
  s+=fade(g,waveRow(170,160,{span:'6.1×10⁻¹¹ m',tag:'400 V',tagCol:VC,x0:200,elx:900,vlen:60}));
  s+=fade(seg(p,b+.05,b+.11),waveRow(370,80,{span:'1/2',tag:'1600 V',tagCol:VC,x0:200,elx:900,vlen:120}));
  return s+goalTag(G3)+A3(seg(p,b+.02,b+.08));
 },
 // 18. 誤答 B（K に反比例）→ 誤答 D（K の2乗に反比例）。1枚ずつ
 [K+'wBD']:(p,ctx)=>{
  let s=fade(.75,label('K 4倍 → 速さ 2倍（√4） → λ 1/2',600,160,{size:32,color:C.ink,anchor:'middle',weight:700}));
  s+=wrongSeq(p,ctx,[['B','1/4 倍','速さは √ で 効く'],['D','1/16 倍','2乗に 反比例と した']],{opts:{y:240}});
  return s+goalTag(G3)+A3(1);
 },
 // 19. 誤答 C（逆）
 [K+'wC3']:(p)=>{
  let s=fade(.75,F(`${lam}=\\dfrac{h}{${pt}}`,600,160,50));
  s+=wrongCard('C','2 倍','p は 分母（速いほど 短い）',{y:260,g:seg(p,.03,.1)});
  return s+goalTag(G3)+A3(1);
 },
 // ================= S4 まとめ =================
 // 20. 100 V（約 1.2×10⁻¹⁰ m）と 400 V（約 6.1×10⁻¹¹ m）の目盛り。電圧4倍 → 1/2
 [K+'cmp']:(p,ctx)=>{
  const b=W2(ctx);
  let s=waveRow(160,180,{span:'約 1.2×10⁻¹⁰ m',tag:'100 V',tagCol:VC,x0:220,elx:900,vlen:50,g:seg(p,.03,.12)});
  s+=waveRow(355,90,{span:'約 6.1×10⁻¹¹ m',tag:'400 V',tagCol:VC,x0:220,elx:900,vlen:100,g:seg(p,b,b+.08)});
  s+=fade(seg(p,b+.2,b+.3),card(960,250,220,90,label('電圧4倍',1070,288,{size:26,color:C.ink,anchor:'middle',weight:700})+label('→ 1/2',1070,325,{size:28,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
  return s+answerRow([[1,'B',''],[2,'D',''],[3,'A','']],{g:seg(p,.03,.12)});
 },
 // 21. 元の単元動画の電子線の干渉縞の画面に戻る
 [K+'sum']:(p,ctx)=>{
  const t=ctx?.t??p*8;
  let s=slitBase({src:'e'})+eDots(300+2600*seg(p,0,.8));
  for(let i=0;i<5;i++)s+=flyer((t*1.3+i/5)%1,(i*37+Math.floor(t*1.3+i/5)*11)%3000);
  s=scaleAt(600,515,.8,s);
  s+=card(170,130,280,120,F(`${lam}=\\dfrac{h}{${pt}}`,310,205,46),seg(p,.1,.2),LC);
  return s+answerRow([[1,'B',''],[2,'D',''],[3,'A','']]);
 },
};

// 問題編 解説「8.3 L の容器の圧力」(ys-qx-hs-t-ideal-1) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/203_状態方程式.md の q-hs-t-ideal-1（解説 19 行）。
// 色（正本）：圧力 P 緑、体積 V 水色、絶対温度 T 黄緑、強調 黄、誤り 赤（×）、答えの札 黄枠。分子の点は白。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 分子の飛び回る動きは、気体の法則（yt1-hs-t-gas-1-diagrams.mjs）の gasBox、温度計は熱と温度（yt1-hs-t-heat-1）の thermo を使う。
import {C,seg,lin,fade,label,line,rect,dot,arrow,tex,clamp,mix} from './anim.mjs';
import {gasBox} from './yt1-hs-t-gas-1-diagrams.mjs';
import {thermo} from './yt1-hs-t-heat-1-diagrams.mjs';
import {QC,card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,cueT,tAt,sentWin,voiceEnd,isProblem} from './yt1-qx-common.mjs';

const K='qx-hs-t-ideal-1:';
const PC=QC.F,VC=QC.x,TC=QC.T,MOLC='#eef3fb';
const TX=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const Pt=`{\\color{${PC}}P}`,Vt=`{\\color{${VC}}V}`,Tt=`{\\color{${TC}}T}`;
const G1='物質量 n（mol）',G2='圧力 P',G3='変えた後の圧力';
const A1=g=>answerTag(1,'A','0.50 mol',{g}),A2=g=>answerTag(2,'D','1.5×10⁵ Pa',{g}),A3=g=>answerTag(3,'B','1.0×10⁵ Pa',{g});
// ナレーションの読みの中で、語 s が読まれる位置（cue の進み 0〜1。読みのかなの長さで割り振る）
function at(ctx,s,fb=.5){
 const r=(ctx?.cue?.reading??'').replace(/\s/g,''),i=r.indexOf(s.replace(/\s/g,''));
 return i<0||!r.length?fb:i/r.length*voiceEnd(ctx);
}

// ---- 容器（立方体の線画）と、中を飛び回る白い分子 -----------------------------------------------------
// 前の面 (x,y,w,h)、奥行き d（右上へ）。n＝分子の数、t＝時間（秒）。
const BX={x:120,y:150,w:220,h:220,d:66};
function vessel({w=BX.w,t=0,n=34,g=1,mg=1,x=BX.x,y=BX.y,h=BX.h,d=BX.d}={}){
 const o=d,R=C.dim;
 let s=`<polygon points="${x},${y} ${x+w},${y} ${x+w+o},${y-o} ${x+o},${y-o}" fill="#0f1a30" fill-opacity=".7" stroke="${R}" stroke-width="2"/>`;
 s+=`<polygon points="${x+w},${y} ${x+w+o},${y-o} ${x+w+o},${y+h-o} ${x+w},${y+h}" fill="#0f1a30" fill-opacity=".7" stroke="${R}" stroke-width="2"/>`;
 s+=rect(x,y,w,h,{fill:'#0f1a30',fo:.85,stroke:R,sw:2.5,rx:0});
 if(n>0)s+=fade(mg,gasBox({x,y,w,h,n,dist:150*t,seed:7,r:7,color:MOLC,frame:false}));
 return fade(g,s);
}
// 圧力の表示（右の壁から外向きの緑の矢印と、値の札）
function pLabel(xw,text,{g=1,y=BX.y+BX.h/2-BX.d/2}={}){
 const x=xw+BX.d+8;
 return fade(g,arrow(x,y+30,x+64,y+30,{color:PC,w:5,head:16})+label(text,x+4,y-6,{size:30,color:PC,weight:700}));
}
// 温度計と温度の札
const TH={x:1100,top:130,bot:330};
function therm(level,text,{g=1}={}){
 return fade(g,thermo(TH.x,TH.top,TH.bot,level,{color:TC,w:22})+label(text,TH.x,TH.bot+78,{size:32,color:TC,anchor:'middle',weight:700}));
}
// 出題中の図（gV＝体積の札、gN＝個数の札、gT＝温度の札、gP＝圧力の札）
function setup({t=0,w=BX.w,n=34,mg=1,gV=1,gN=1,gT=1,gP=1,vol='8.3 L',temp='27℃',lev=70,ptext='P ＝ ？',g=1}={}){
 let s=vessel({w,t,n,mg});
 const cx=BX.x+(w+BX.d)/2;
 s+=fade(gV,line(BX.x,BX.y+BX.h+22,BX.x+w,BX.y+BX.h+22,{color:VC,w:2})+line(BX.x,BX.y+BX.h+12,BX.x,BX.y+BX.h+32,{color:VC,w:2})+line(BX.x+w,BX.y+BX.h+12,BX.x+w,BX.y+BX.h+32,{color:VC,w:2})
  +label(vol,BX.x+w/2,BX.y+BX.h+66,{size:32,color:VC,anchor:'middle',weight:700}));
 s+=fade(gN,label('分子 3.0×10²³ 個',BX.x+w/2,BX.y+BX.h+112,{size:28,color:C.ink,anchor:'middle',weight:700}));
 s+=therm(lev,temp,{g:gT});
 s+=pLabel(BX.x+w,ptext,{g:gP});
 return fade(g,s);
}

// ---- 1 mol の箱（6.0×10²³ 個 ＝ 1 mol）。fill＝箱を埋めた割合（0〜1） ----------------------------------
const TR={x:110,y:150,w:400,h:190,cols:10,rows:6};
const slot=i=>{const c=i%TR.cols,r=Math.floor(i/TR.cols);return [TR.x+20+(TR.w-40)*(c+.5)/TR.cols,TR.y+TR.h-16-(TR.h-32)*(r+.5)/TR.rows];};
function tray({g=1,fill=0,flow=-1,hiLab=0,half=0}={}){
 let s=rect(TR.x,TR.y,TR.w,TR.h,{fill:'#0f1a30',fo:.85,stroke:C.hi,sw:3,rx:10});
 s+=label('6.0×10²³ 個 ＝ 1 mol',TR.x+TR.w/2,TR.y-22,{size:30,color:C.hi,anchor:'middle',weight:700});
 if(hiLab)s+=fade(hiLab,rect(TR.x+18,TR.y-58,TR.w-36,48,{fill:C.hi,fo:.12,stroke:C.hi,sw:2.5,rx:10}));
 const N=TR.cols*TR.rows;
 if(flow<0){const k=Math.round(N*fill);for(let i=0;i<k;i++){const [x,y]=slot(i);s+=dot(x,y,8,MOLC);}}
 else{ // 30 個の点が、右の山から箱へ流れ込む
  for(let i=0;i<N/2;i++){const [x1,y1]=slot(i),u=clamp((flow-i/N*.9)/.55),uu=u*u*(3-2*u);
   const x0=570+((i*37)%9)*16,y0=400+((i*53)%5)*14;
   s+=dot(mix(x0,x1,uu),mix(y0,y1,uu)-Math.sin(Math.PI*uu)*60,8,MOLC);}
 }
 if(half)s+=fade(half,line(TR.x-14,TR.y+TR.h/2,TR.x+TR.w+14,TR.y+TR.h/2,{color:C.hi,w:3,dash:'10 8'})+label('半分',TR.x+TR.w+24,TR.y+TR.h/2+9,{size:28,color:C.hi,weight:700}));
 return fade(g,s);
}
const nDef=(g=1,hi=0)=>card(600,140,560,210,
 TX(`{\\color{${hi>.5?C.hi:C.ink}}n}=\\dfrac{{\\color{${hi>.5?C.hi:C.ink}}N}}{6.0\\times10^{23}}`,880,232,52)
 +label('N：個数（大文字）',625,322,{size:22,color:C.dim,weight:700})+label('n：物質量 mol（小文字）',860,322,{size:22,color:C.dim,weight:700}),g,C.hi);

// ---- 式 ----------------------------------------------------------------------------------------------
const PVnRT=`${Pt}${Vt}=nR${Tt}`,PnRTV=`${Pt}=\\dfrac{nR${Tt}}{${Vt}}`;
// 1 m³ の立方体の中に 1 L の小さな立方体
function cubes({g=1,small=1}={}){
 const x=150,y=210,s=210,o=80;
 const cube=(x,y,s,o,col,fo)=>`<polygon points="${x},${y} ${x+s},${y} ${x+s+o},${y-o} ${x+o},${y-o}" fill="${col}" fill-opacity="${fo*.6}" stroke="${col}" stroke-width="2"/>`
  +`<polygon points="${x+s},${y} ${x+s+o},${y-o} ${x+s+o},${y+s-o} ${x+s},${y+s}" fill="${col}" fill-opacity="${fo*.8}" stroke="${col}" stroke-width="2"/>`+rect(x,y,s,s,{fill:col,fo,stroke:col,sw:2.5,rx:0});
 let q=cube(x,y,s,o,VC,.08)+label('1 m³',x+s/2,y+s+40,{size:28,color:VC,anchor:'middle',weight:700});
 const ss=s/10;
 q+=fade(small,cube(x+12,y+s-ss-12,ss,ss*.38,C.hi,.6)+arrow(x+s*.42,y+s*.62,x+30,y+s-ss-6,{color:C.hi,w:3,head:12})+label('1 L',x+s*.45,y+s*.58,{size:28,color:C.hi,weight:700}));
 return fade(g,q);
}
// 単位 Pa×m³ → J を一操作ずつ（k＝何段目まで）
function unitRow(k,{y=330,g=1}={}){
 const st=[`\\mathrm{Pa}\\times\\mathrm{m^3}`,`=\\dfrac{\\mathrm{N}}{{\\color{${C.hi}}\\mathrm{m^2}}}\\times{\\color{${C.hi}}\\mathrm{m^3}}`,`=\\mathrm{N\\cdot m}`,`=\\mathrm{J}`];
 const xs=[250,520,780,960];
 let s='';st.forEach((t,i)=>{s+=fade(clamp(k-i),TX(t,xs[i],y,40));});
 s+=fade(clamp(k-1.4),label('m³ ÷ m² ＝ m',520,y+78,{size:24,color:C.hi,anchor:'middle',weight:700}));
 return fade(g,s);
}
// 小問3 の「変えた後」の図。u＝広がり（0→1）、v＝温度の上がり（0→1）
function setup3(t,u,v,{back=1}={}){
 const w=mix(BX.w,3*BX.w,u),lev=mix(70,112,v);
 let s=setup({t,w,lev,vol:u<.5?'8.3 L':'24.9 L',temp:v<.5?'27℃':'327℃',gV:1-.9*Math.abs(Math.sin(Math.PI*u)),gT:1-.9*Math.abs(Math.sin(Math.PI*v)),ptext:'P ＝ ？',gP:back});
 return s;
}
// 鍵の印
const lock=(x,y,col=C.hi)=>`<path d="M${x-9} ${y-8} v-8 a9 9 0 0 1 18 0 v8" fill="none" stroke="${col}" stroke-width="3.5"/>`+rect(x-14,y-8,28,22,{fill:col,fo:.9,stroke:'none',rx:4});

export const qxHsTIdeal1Diagrams={
 // ================= 問題アニメ：出題中（小問1・2、5 秒＋静止）=================
 // 0〜2 秒：容器が現れる。2〜5 秒：分子の点が増えて飛び回り、札（8.3 L・3.0×10²³ 個・27℃）が順に付く。圧力は緑の「？」。
 // 出さないもの：1 mol の箱、圧力の値、単位の換算。
 [K+'q0']:(p,ctx)=>{
  const t=cueT(ctx),n=Math.round(34*lin(t,2,4.2));
  return setup({t,n,g:seg(t/5,0,.3),gV:seg(t/5,.48,.58),gN:seg(t/5,.62,.72),gT:seg(t/5,.76,.86),gP:seg(t/5,.88,.98)});
 },
 // 小問3 の出題（約3秒）：容器が横に3倍に広がり（24.9 L）、温度計が上がって 327℃ に。圧力は「？」のまま。
 [K+'q3']:(p,ctx)=>{
  const t=5+cueT(ctx);
  return setup3(t,seg(p,.08,.65),seg(p,.3,.85));
 },
 // ================= S1 小問1：物質量 =================
 [K+'goal1']:(p,ctx)=>setup({t:5+cueT(ctx)})+goalTag(G1,{g:seg(p,.05,.2)}),
 // 2. 6.0×10²³ 個＝1 mol の箱（定義）→ 2文目で n＝N÷(6.0×10²³)、N と n を黄で光らせる
 [K+'def']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=tray({g:seg(p,.03,.15),fill:seg(p,.12,.35)});
  s+=kindTag('定義',TR.x+TR.w/2,TR.y+TR.h+52,{g:seg(p,.15,.25)});
  s+=nDef(seg(p,b,b+.08),seg(p,b+.2,b+.25)*(1-seg(p,.94,.99))+0);
  return s+goalTag(G1);
 },
 // 3. 3.0×10²³÷(6.0×10²³)＝0.50 mol。点の山が箱へ流れ込み、半分で止まる
 [K+'calc']:(p)=>{
  let s=tray({flow:lin(p,.08,.6),half:seg(p,.62,.72)});
  s+=card(600,140,560,210,TX(`n=\\dfrac{3.0\\times10^{23}}{6.0\\times10^{23}}`,880,215,44)+fade(seg(p,.5,.6),TX(`=0.50\\ \\mathrm{mol}`,880,305,46)),seg(p,.02,.12),C.hi);
  return s+goalTag(G1);
 },
 // 4. 答え A（1文目）→ 誤答 B、C を1枚ずつ（2文目）
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,m=(b+1)/2;
  let s=fade(1-.5*seg(p,b-.03,b),tray({fill:.5,half:1}));
  s+=answerTag(1,'A','0.50 mol',{g:seg(p,.03,.12)});
  s+=wrongSeq(p,ctx,[['B','2.0 mol','6.0÷3.0 と 逆に 割った'],['C','1.8×10⁴⁷ mol','割らずに 掛けた']],{win:[[b,m],[m,1]]});
  return s+goalTag(G1);
 },
 // 5. 誤答 D（個数と物質量の混同）。2文目で箱の札「6.0×10²³ 個 ＝ 1 mol」を光らせる
 [K+'wrongD']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=fade(.6,tray({fill:.5,half:1,hiLab:seg(p,b,b+.06)}));
  s+=wrongCard('D','3.0×10²³ mol','個数 N と 物質量 n を 混同',{g:seg(p,.02,.08)});
  return s+goalTag(G1)+A1(1);
 },
 // ================= S2 小問2：圧力 =================
 [K+'goal2']:(p,ctx)=>setup({t:5+cueT(ctx)})+goalTag(G2,{g:seg(p,.05,.2)}),
 // 7. PV＝nRT（法則）→ 両辺を V で割る → P＝nRT/V（左辺の V が右辺の分母へ）
 [K+'law']:(p,ctx)=>{
  const u=seg(p,.45,.7);
  let s=card(250,96,700,120,TX(PVnRT,600,166,56),seg(p,.03,.12),C.faint);
  s+=kindTag('法則',1040,160,{g:seg(p,.08,.18),text:'状態方程式'});
  s+=fade(seg(p,.35,.45),label('両辺を V で 割る',640,262,{size:28,color:VC,weight:700})+arrow(600,232,600,290,{color:VC,w:4,head:14}));
  // 動く V：上の式の V の位置 → 下の式の分母
  const V0=[528,158],V1=[648,402];
  s+=fade(seg(p,.42,.48)*(1-seg(p,.7,.74)),TX(Vt,mix(V0[0],V1[0],u),mix(V0[1],V1[1],u)-Math.sin(Math.PI*u)*30,56));
  s+=card(350,300,500,180,TX(PnRTV,600,392,60),seg(p,.66,.76),PC);
  return s+goalTag(G2);
 },
 // 8. 単位をそろえる。T＝27＋273＝300 K → 1 m³ の中の 1 L、8.3 L＝0.0083 m³（黄の枠）
 [K+'unit']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.2,tv=at(ctx,'ブイは',.6);
  let s=card(560,96,600,90,label('T ＝ 27 ＋ 273 ＝ 300 K',860,155,{size:36,color:TC,anchor:'middle',weight:700}),seg(p,b,b+.06),TC);
  s+=cubes({g:seg(p,tv-.04,tv+.04),small:seg(p,tv+.02,tv+.1)});
  s+=fade(seg(p,tv+.06,tv+.14),label('1 L ＝ 0.001 m³',860,260,{size:34,color:VC,anchor:'middle',weight:700}));
  s+=card(600,300,520,92,label('8.3 L ＝ 0.0083 m³',860,360,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,tv+.16,tv+.24),C.hi);
  return s+goalTag(G2);
 },
 // 9. 0.50×8.3＝4.15、×300＝1245、÷0.0083＝150000＝1.5×10⁵ Pa。容器の「？」が値に替わる
 [K+'calc2']:(p,ctx)=>{
  let s=fade(seg(p,.02,.1),TX(`${Pt}=\\dfrac{nR${Tt}}{${Vt}}=\\dfrac{0.50\\times8.3\\times300}{0.0083}`,600,130,40));
  s+=fade(seg(p,.12,.2),label('0.50 × 8.3 ＝ 4.15',330,250,{size:34,color:C.ink,weight:700}));
  s+=fade(seg(p,.25,.33),label('4.15 × 300 ＝ 1245',330,310,{size:34,color:C.ink,weight:700}));
  s+=fade(seg(p,.48,.56),label('1245 ÷ 0.0083 ＝ 150000',330,370,{size:34,color:C.ink,weight:700}));
  s+=card(300,400,600,80,label('＝ 1.5×10⁵ Pa',600,454,{size:40,color:PC,anchor:'middle',weight:700}),seg(p,.66,.74),PC);
  return s+goalTag(G2);
 },
 // 10. 答え D（容器の「？」が 1.5×10⁵ Pa に）→ 2文目：Pa×m³＝N/m²×m³＝N·m＝J を一操作ずつ
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.35,t=tAt(ctx,K+'ans2')+5;
  let s=fade(1-seg(p,b-.04,b),setup({t,ptext:'P ＝ 1.5×10⁵ Pa',gP:1}));
  s+=fade(seg(p,b,b+.05),label('P が Pa、V が m³ のとき',600,170,{size:32,color:C.ink,anchor:'middle',weight:700}));
  s+=unitRow(lin(p,b+.08,.9)*3.99,{g:seg(p,b+.04,b+.1)});
  return s+goalTag(G2)+A2(seg(p,.03,.12));
 },
 // 11. 誤答 A（L のまま）、B（27℃ のまま）を1枚ずつ
 [K+'wrongAB']:(p,ctx)=>{
  let s=card(200,110,800,150,TX(`${Pt}=\\dfrac{0.50\\times8.3\\times{\\color{${TC}}300}}{{\\color{${VC}}0.0083}}`,600,186,46),1,C.faint);
  s+=wrongSeq(p,ctx,[['A','150 Pa','L の まま 割った（1000倍 ずれ）'],['B','1.4×10⁴ Pa','27℃ の まま 入れた']]);
  return s+goalTag(G2)+A2(1);
 },
 // 12. 誤答 C（小問1 の誤り 2.0 mol を使った）
 [K+'wrongC']:(p)=>{
  let s=card(200,110,800,150,TX(`${Pt}=\\dfrac{{\\color{${C.hi}}0.50}\\times8.3\\times300}{0.0083}`,600,186,46),1,C.faint);
  s+=wrongCard('C','6.0×10⁵ Pa','n＝2.0 mol（小問1 の 誤り）を 使った',{g:seg(p,.02,.08)});
  return s+goalTag(G2)+A2(1);
 },
 // ================= S3 小問3：体積と温度を変える =================
 // 13. 「1.5×10⁵ Pa」を「？」に戻してから、容器が3倍に広がり、温度計が上がる
 [K+'goal3']:(p,ctx)=>{
  const t=5+cueT(ctx),back=seg(p,.1,.16);
  let s=fade(1-back,setup({t,ptext:'P ＝ 1.5×10⁵ Pa',gP:1-seg(p,.04,.1)}))+fade(back,setup3(t,seg(p,.22,.6),seg(p,.4,.75)));
  return s+goalTag(G3,{g:seg(p,.03,.12)});
 },
 // 14. n は 0.50 mol のまま（鍵の印）。327＋273＝600、600÷300＝2
 [K+'lock']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=card(300,100,600,100,label('n ＝ 0.50 mol の まま',570,165,{size:38,color:C.ink,anchor:'middle',weight:700})+fade(seg(p,.2,.3),lock(840,160)),seg(p,.03,.12),C.hi);
  s+=fade(seg(p,b,b+.06),label('327 ＋ 273 ＝ 600 K',600,290,{size:38,color:TC,anchor:'middle',weight:700}));
  s+=fade(seg(p,b+.25,b+.32),label('600 ÷ 300 ＝ 2',600,370,{size:38,color:TC,anchor:'middle',weight:700})+label('（2倍）',780,370,{size:30,color:C.hi,weight:700}));
  return s+goalTag(G3);
 },
 // 15. P＝nRT/V。T に「×2」、V に「×3」を言葉に合わせて付ける
 [K+'ratio']:(p,ctx)=>{
  const a=at(ctx,'ティーが',.3),b=at(ctx,'ブイが',.6);
  let s=card(300,96,600,250,TX(PnRTV,560,236,64),seg(p,.02,.1),PC);
  s+=fade(seg(p,a,a+.05),rect(710,140,90,56,{fill:TC,fo:.18,stroke:TC,sw:2.5,rx:10})+label('×2',755,180,{size:34,color:TC,anchor:'middle',weight:700}));
  s+=fade(seg(p,b,b+.05),rect(710,222,90,56,{fill:VC,fo:.18,stroke:VC,sw:2.5,rx:10})+label('×3',755,262,{size:34,color:VC,anchor:'middle',weight:700}));
  s+=fade(seg(p,a+.08,a+.14),label('圧力 × 2',420,400,{size:34,color:PC,anchor:'middle',weight:700}));
  s+=fade(seg(p,b+.1,b+.16),label('圧力 × 1/3',780,400,{size:34,color:PC,anchor:'middle',weight:700}));
  return s+goalTag(G3);
 },
 // 16. 1.5×10⁵×2÷3＝1.0×10⁵ Pa。2文目で答え B。下に小さく検算
 [K+'calc3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=card(200,120,800,120,TX(`1.5\\times10^{5}\\times2\\div3=1.0\\times10^{5}\\ \\mathrm{Pa}`,600,192,48),seg(p,.03,.12),PC);
  s+=fade(seg(p,b+.1,b+.2),label('検算：0.50 × 8.3 × 600 ÷ 0.0249 ＝ 100000',600,310,{size:26,color:C.dim,anchor:'middle',weight:700}));
  return s+goalTag(G3)+A3(seg(p,b,b+.08));
 },
 // 17. 誤答 A（体積の3倍も掛けた）。2文目で、分母の V を光らせる
 [K+'wrongA3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=card(350,96,500,210,TX(PnRTV,600,206,64),1,C.faint);
  s+=fade(seg(p,b,b+.06),rect(622,186,80,70,{fill:C.hi,fo:.12,stroke:C.hi,sw:3,rx:10})+label('分母',716,232,{size:28,color:C.hi,weight:700}));
  s+=wrongCard('A','9.0×10⁵ Pa','体積の 3倍を 掛けた（反比例が 正しい）',{y:340,g:seg(p,.02,.08)});
  return s+goalTag(G3)+A3(1);
 },
 // 18. 誤答 C（327/300）、D（温度の変化を入れ忘れ）を1枚ずつ
 [K+'wrongCD']:(p,ctx)=>{
  let s=card(200,110,800,120,TX(`1.5\\times10^{5}\\times2\\div3=1.0\\times10^{5}\\ \\mathrm{Pa}`,600,182,44),1,C.faint);
  s+=wrongSeq(p,ctx,[['C','5.5×10⁴ Pa','比を 327/300 と した'],['D','5.0×10⁴ Pa','温度の 変化を 入れ忘れ']]);
  return s+goalTag(G3)+A3(1);
 },
 // ================= S4 まとめ：PV/T＝nR =================
 [K+'sum']:(p)=>{
  let s=card(250,90,700,220,TX(`\\dfrac{${Pt}${Vt}}{${Tt}}=nR`,600,226,70),seg(p,.03,.15),C.hi);
  s+=fade(seg(p,.25,.4),label('一定の 値 ＝ nR',600,370,{size:36,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('決めるのは 物質量 n（分子の 数）',600,436,{size:34,color:C.ink,anchor:'middle',weight:700}));
  s+=answerRow([[1,'A','0.50 mol'],[2,'D','1.5×10⁵ Pa'],[3,'B','1.0×10⁵ Pa']],{size:22,g:seg(p,.03,.12)});
  return s;
 },
};

// 問題編 解説「明るい緑と、弱い紫外線」(ys-qx-hs-a-photon-1) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/501_光子と電子.md の q-hs-a-photon-1（解説 20 行）。
// 色（正本の冒頭）：エネルギー（hν・段）橙、振動数 ν 桃、波長 λ 水色、c 紫、h 白、光子 黄の粒、電子 青、段（出るのに必要）灰、強調 黄。
// 図：右に金属の板、その手前に灰色の段（3.0 eV）。上の段＝光P（緑・明るい）、下の段＝光Q（紫外線・弱い）。
//   光子は左から右へ進む黄の粒。解説では、粒の下に「光子1個のエネルギー」の橙の棒（30 px/eV）を立て、段の高さ（3.0 eV）と比べる。
//   棒が段より高い粒（光Q）は板まで届き、そのたびに青い電子が1個飛び出す。低い粒（光P）は段の手前で止まって消える。
// 元の単元動画（yt1-hs-a-photon-1）の部品を読み込んで使う（そのファイルは編集しない）。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,clamp,mix} from './anim.mjs';
import {electron,NEG,EC,NC,LC,CC,PH,W0C,GRN,UV,cs,Et,nut,lt,ct,ht,U,TX,P10,H_,E19,photon,ebar,cross,cl,hsAPhoton1Diagrams} from './yt1-hs-a-photon-1-diagrams.mjs';
import {card,goalTag,answerTag,wrongSeq,wrongCard,kindTag,pauseBadge,note,tAt,cueT,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-hs-a-photon-1:';
const PI=Math.PI;
const G1='光P の光子1個のエネルギー',G2='電子が出る光',G3='出ない理由';
const A1=g=>answerTag(1,'B','約2.5 eV',{g}),A2=g=>answerTag(2,'D','光Q だけ',{g}),A3=g=>answerTag(3,'A','',{g});
// ---- 段・板・道 ------------------------------------------------------------------------------------
const LN={x0:300,foot:820,sx1:980,px1:1020,k:30,v:80,step:3.0};
const LP={y:270,E:2.5,col:GRN,lam:50,s:60,t0:0,lines:['光P','緑・500 nm','とても明るい']};
const LQ={y:470,E:5.0,col:UV,lam:25,s:200,t0:3,lines:['光Q','紫外線・1.2×10¹⁵ Hz','とても弱い']};
const T_STOP=6;
// 文の中の「、」までの読みの割合で、区間を2つに分ける（1文に誤答が2つあるとき）
function commaWin(ctx,mark,{from=0}={}){
 const r=(ctx?.cue?.reading??'').replace(/\s/g,''),ve=voiceEnd(ctx),i=r.indexOf(mark);
 const f=i<0?.5:(i+mark.length)/r.length;const a=from,b=from+(ve-from)*f;
 return [[a,b],[b,1]];
}
function plate(g=1){
 let s=rect(LN.sx1,105,LN.px1-LN.sx1,370,{fill:'#8795ad',fo:.35,stroke:C.dim,sw:2.5,rx:4});
 for(let y=120;y<465;y+=30)s+=line(LN.sx1+8,y+14,LN.px1-8,y,{color:'#5b6780',w:2});
 s+=label('金属',(LN.sx1+LN.px1)/2,505,{size:26,color:C.dim,anchor:'middle',weight:700});
 return fade(g,s);
}
function laneBase(L,{g=1,hlStep=0,hlLine=-1,hlAll=0,wave=1,t=0}={}){
 const hS=LN.step*LN.k;
 let s=line(LN.x0,L.y,LN.sx1,L.y,{color:C.dim,w:3});
 s+=rect(LN.foot,L.y-hS,LN.sx1-LN.foot,hS,{fill:W0C,fo:.28,stroke:hlStep>.5?C.hi:W0C,sw:2.5+2*hlStep,rx:4});
 s+=label('3.0 eV',(LN.foot+LN.sx1)/2,L.y-hS/2+10,{size:28,color:hlStep>.5?C.hi:C.ink,anchor:'middle',weight:700});
 // 左の札（3行）
 const ys=[L.y-112,L.y-74,L.y-38];
 L.lines.forEach((tx,i)=>{s+=label(tx,24,ys[i],{size:i===0?30:24,color:i===0?L.col:C.ink,weight:700});});
 if(hlLine>=0)s+=fade(1,rect(14,ys[hlLine]-26,textWpx(L.lines[hlLine],24)+34,36,{fill:C.hi,fo:.12,stroke:C.hi,sw:3,rx:8}));
 if(hlAll)s+=fade(hlAll,rect(12,L.y-148,272,128,{fill:C.hi,fo:.10,stroke:C.hi,sw:3,rx:10}));
 if(wave){const pts=[];for(let x=LN.x0;x<=LN.foot-30;x+=3)pts.push([x,L.y-120-10*Math.sin(2*PI*((x-LN.x0)/L.lam-t*.6))]);s+=fade(.55*wave,draw(pts,1,{color:L.col,w:3}));}
 return fade(g,s);
}
const textWpx=(s,size)=>{let w=0;for(const ch of String(s))w+=ch===' '?.34:/[!-~]/.test(ch)?.64:1.02;return w*size;};
// 粒の流れ。tau＝この段の中の時刻（光P は 0、光Q は 3 から出る）。dens＝[×2 の粒の濃さ, ×3 の粒の濃さ]（光P の明るさを上げるとき）
// bars＝橙の棒を立てる。move＝段の手前・板での振る舞いを描く（止まる／越えて電子が出る）
function stream(L,tau,{bars=0,dens=[0,0],g=1,stopFade=.7}={}){
 let s='';const hS=LN.step*LN.k,over=L.E>=LN.step,base=10,m1=Math.round(L.s/base);
 const nMax=Math.floor(Math.max(0,tau-L.t0)*LN.v/base)+1;
 for(let j=0;j<nMax;j++){
  let w;if(j%m1===0)w=1;else if(L===LP&&j%(m1/2)===0)w=dens[0];else if(L===LP&&j%(m1/3)===0)w=dens[1];else continue;
  if(w<=0.001)continue;
  const tj=L.t0+j*base/LN.v;if(tau<tj)continue;const x=LN.x0+LN.v*(tau-tj);
  let op=1,xx=x;
  if(!over&&bars&&x>LN.foot-12){xx=LN.foot-12;const tArr=(LN.foot-12-LN.x0)/LN.v+tj;op=1-clamp((tau-tArr)/stopFade);}
  if(!over&&!bars&&x>LN.foot-12)xx=LN.foot-12;
  if(over&&x>LN.sx1){ // 板に届いた：電子が1個飛び出す
   const a=(x-LN.sx1)/LN.v/1.0;if(a<1.3)s+=electron(mix(LN.px1+22,1150,a/1.3),L.y-40-150*(a/1.3)+30*(a/1.3)**2,{r:14,op:clamp(1.6-a)});
   continue;}
  if(op<=0.01)continue;
  const h=L.E*LN.k*bars,yTop=L.y-h;
  let q='';
  const bw=dens[0]>0||dens[1]>0?8:16,pr=dens[0]>0||dens[1]>0?6:9;
  if(bars>0.01)q+=rect(xx-bw/2,yTop,bw,h,{fill:EC,fo:.55,stroke:EC,sw:2,rx:3});
  const py=(bars>0.01?yTop:L.y)-16+(9-pr);q+=pr<9?dot(xx,py+4,7,PH):photon(xx,py,{r:pr});
  s+=fade(op*w,q);
 }
 return fade(g,s);
}
function scene({tauP=T_STOP,tauQ=T_STOP,showQ=1,bars=0,hlStep=0,hlP=-1,hlQ=-1,hlQall=0,wave=1,t=0,dens=[0,0],gP=1}={}){
 let s=plate();
 s+=laneBase(LP,{hlStep,hlLine:hlP,wave:wave*(1-bars),t,g:gP})+stream(LP,tauP,{bars,dens,g:gP});
 if(showQ>0.01)s+=fade(showQ,laneBase(LQ,{hlStep,hlLine:hlQ,hlAll:hlQall,wave:wave*(1-bars),t})+stream(LQ,tauQ,{bars}));
 return s;
}
// 2本の棒（光P と 光Q のエネルギーを並べる）
function twoBars(x1,x2,b0,k,{gQ=1,g=1}={}){
 let s=ebar(x1,b0,2.5,k,{w:70,top:'2.5 eV',tcol:EC,size:28})+label('光P',x1,b0+36,{size:26,color:GRN,anchor:'middle',weight:700});
 s+=fade(gQ,ebar(x2,b0,5.0,k,{w:70,top:'5.0 eV',tcol:EC,size:28})+label('光Q',x2,b0+36,{size:26,color:UV,anchor:'middle',weight:700}));
 return fade(g,line(x1-70,b0,x2+70,b0,{color:C.dim,w:3})+s);
}
// 光P の光子1個と棒（小問1 の結果）
function pBar(x,b0,{g=1,k=60,txt='約2.5 eV'}={}){
 return fade(g,ebar(x,b0,2.5,k,{w:70})+photon(x,b0-2.5*k-24,{r:10})+label(txt,x+56,b0-2.5*k/2+10,{size:30,color:EC,weight:700})+label('光P の 光子 1個',x,b0+38,{size:26,color:GRN,anchor:'middle',weight:700}));
}
// つまみ（明るさ・振動数）
function knob(x,y,u,txt,{hl=0}={}){
 const a=(-135+270*u)*PI/180;
 return (hl?ring(x,y,40,{color:C.hi,w:3}):'')+ring(x,y,30,{color:C.ink,w:3,fill:'#24324f'})+line(x,y,x+22*Math.sin(a),y-22*Math.cos(a),{color:C.hi,w:5})+label(txt,x,y+66,{size:26,color:C.ink,anchor:'middle',weight:700});
}

export const qxHsAPhoton1Diagrams={
 // ================= 問題アニメ：出題中（小問1〜3 共通、6 秒で一時停止＋静止）=================
 // 段・板・2つの光の札。0〜3秒は光P の粒が次々に、3〜6秒は光Q の粒がまばらに、板へ向かう。
 // 粒が段に届く手前で映像を一時停止（隅に「映像を 一時停止」）。光子のエネルギーの棒・越えるか・電子は描かない。
 [K+'q0']:(p,ctx)=>{
  const t=Math.min(cueT(ctx),T_STOP);
  let s=scene({tauP:t,tauQ:t,t});
  s+=pauseBadge({g:seg(cueT(ctx),T_STOP,T_STOP+.3),x:640,size:22});
  return s;
 },
 // ================= S1 小問1：光P の光子1個 =================
 // 1. 出題中の図（一時停止の状態）。求めるもの
 [K+'goal1']:(p)=>scene({t:T_STOP})+goalTag(G1,{g:seg(p,.03,.15)}),
 // 2. 記号の札を図に先に置き、そのあとで E＝hν、c＝νλ。光P の札の「500 nm」を光らせる
 [K+'sym']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,gs=seg(p,.02,.12);
  let s=scene({showQ:1-gs,t:T_STOP,hlP:seg(p,b+.1,b+.16)>.5?1:-1});
  const lead=LN.x0+LN.v*T_STOP;
  s+=fade(seg(p,.12,.2),label('h：プランク定数',24,412,{size:26,color:C.ink,weight:700})+label('c：光の 速さ',24,456,{size:26,color:CC,weight:700}));
  s+=fade(gs,line(LN.x0,LP.y-142,LN.x0+LP.lam,LP.y-142,{color:LC,w:3})+line(LN.x0,LP.y-152,LN.x0,LP.y-132,{color:LC,w:3})+line(LN.x0+LP.lam,LP.y-152,LN.x0+LP.lam,LP.y-132,{color:LC,w:3}));
  s+=fade(gs,label('λ：波長',LN.x0+LP.lam+14,LP.y-136,{size:26,color:LC,weight:700})+label('ν：1秒に 振動する 回数（振動数）',500,LP.y-136,{size:24,color:NC,weight:700}));
  s+=fade(gs,arrow(lead,LP.y+26,lead,LP.y-4,{color:EC,w:3,head:12})+label('E：光子 1個の エネルギー',lead,LP.y+56,{size:26,color:EC,anchor:'middle',weight:700}));
  s+=card(330,370,300,100,TX(`${Et}=${ht}\\,${nut}`,480,438,{size:50}),seg(p,.3,.4),EC);
  s+=card(680,370,300,100,TX(`${ct}=${nut}\\,${lt}`,830,438,{size:50}),seg(p,b+.02,b+.1),CC);
  s+=goalTag(G1);
  return s;
 },
 // 3. 500 nm＝5.0×10⁻⁷ m（黄の枠）→ ν＝c/λ＝6.0×10¹⁴ Hz
 [K+'nu']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=cl(`500${U('nm')}=${cs(LC,P10('5.0','-7')+U('m'))}`,110,170,seg(p,.03,.15),{size:42});
  s+=fade(seg(p,.2,.3)*(1-seg(p,b,b+.05)*.6),rect(96,118,520,76,{fill:C.hi,fo:.08,stroke:C.hi,sw:3,rx:10}));
  s+=note('1 nm ＝ 10⁻⁹ m',1000,170,{g:seg(p,.12,.25),size:26});
  s+=cl(`${nut}=\\dfrac{${ct}}{${lt}}=\\dfrac{${P10('3.0','8')}}{${P10('5.0','-7')}}=${cs(NC,P10('6.0','14')+U('Hz'))}`,110,320,seg(p,b+.02,b+.14),{size:42});
  s+=goalTag(G1);
  return s;
 },
 // 4. E＝6.6×10⁻³⁴×6.0×10¹⁴＝3.96×10⁻¹⁹ J≈4.0×10⁻¹⁹ J。光P の光子の横に J の値の札
 [K+'EJ']:(p)=>{
  let s=fade(.4,cl(`${nut}=${cs(NC,P10('6.0','14')+U('Hz'))}`,110,140,1,{size:38}));
  s+=cl(`${Et}=${ht}${nut}=${H_}\\times ${P10('6.0','14')}`,110,250,seg(p,.03,.15),{size:42});
  s+=cl(`=${P10('3.96','-19')}${U('J')}`,190,350,seg(p,.4,.52),{size:42});
  s+=cl(`\\approx ${cs(EC,P10('4.0','-19')+U('J'))}`,190,440,seg(p,.68,.8),{size:42});
  s+=fade(seg(p,.75,.88),photon(860,420,{r:11})+label('光P の 光子 1個',900,430,{size:26,color:GRN,weight:700})+card(840,460,320,50,label('約4.0×10⁻¹⁹ J',1000,495,{size:28,color:EC,anchor:'middle',weight:700}),1,EC));
  s+=goalTag(G1);
  return s;
 },
 // 5. J → eV：1.6×10⁻¹⁹ で割る。3.96÷1.6≈2.5。橙の棒「2.5 eV」。答えの札
 [K+'eV']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=fade(.45,cl(`${Et}=${P10('3.96','-19')}${U('J')}`,110,150,1,{size:38}));
  s+=card(100,190,560,64,label('J → eV：1.6×10⁻¹⁹ で 割る',380,232,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.03,.14),C.hi);
  s+=cl(`\\dfrac{3.96}{1.6}\\approx ${cs(EC,'2.5'+U('eV'))}`,110,360,seg(p,.25,.4),{size:46});
  s+=note('（丸める 前の 3.96 で 割る）',380,450,{g:seg(p,.12,.25)});
  s+=pBar(900,470,{g:seg(p,.45,.6)});
  s+=goalTag(G1)+A1(seg(p,b,b+.06));
  return s;
 },
 // 6. 誤答 A（J のまま）→ 誤答 C（nm のまま）。1枚ずつ
 [K+'wrongAC']:(p,ctx)=>{
  let s=pBar(600,300,{k:56});
  s+=wrongSeq(p,ctx,[['A','4.0×10⁻¹⁹ eV','J のまま eV と 書いた'],['C','2.5×10⁻⁹ eV','nm を m に 直し忘れた',{mid:`${P10('3.0','8')}\\div 500\\ \\rightarrow\\ ${P10('2.5','-9')}${U('eV')}`,midSize:30}]],{win:commaWin(ctx,'なおしわすれ、')});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // 7. 誤答 D（光Q の値）→「光Q も計算」で、図に戻って光Q の札を光らせる
 [K+'wrongD']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,sw=seg(p,b-.02,b+.04);
  let s=fade(1-sw,pBar(600,300,{k:56})+wrongCard('D','5.0 eV','光Q の 値と 取り違えた',{g:seg(p,.02,.08)}));
  s+=fade(sw,scene({t:T_STOP,hlQall:sw*(.6+.4*Math.sin(cueT(ctx)*6)**2)}));
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // 8. 光Q：6.6×10⁻³⁴×1.2×10¹⁵≈7.9×10⁻¹⁹ J、7.92÷1.6≈5.0 eV。棒を並べる（光P の約2倍）
 [K+'EQ']:(p,ctx)=>{
  const W=sentWin(ctx);
  let s=cl(`${Et}=${H_}\\times ${cs(NC,P10('1.2','15'))}`,60,150,seg(p,.03,.14),{size:40});
  s+=cl(`\\approx ${P10('7.9','-19')}${U('J')}`,140,240,seg(p,.3,.42),{size:40});
  s+=cl(`\\dfrac{7.92}{1.6}\\approx ${cs(EC,'5.0'+U('eV'))}`,60,370,seg(p,.55,.66),{size:44});
  s+=label('光Q（紫外線）',60,470,{size:26,color:UV,weight:700,opacity:seg(p,.03,.14)});
  s+=twoBars(860,1060,450,50,{g:seg(p,.05,.15),gQ:seg(p,.68,.8)});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // ================= S2 小問2：電子が出る光 =================
 [K+'goal2']:(p)=>scene({t:T_STOP})+goalTag(G2,{g:seg(p,.03,.15)}),
 // 10. 前提「1個ずつ丸ごと」。段の高さ 3.0 eV を光らせ、粒に棒を立てる
 [K+'one']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=scene({t:T_STOP,bars:seg(p,b,b+.1),hlStep:seg(p,b+.05,b+.1)});
  s+=kindTag('前提',600,118,{text:'光子 1個ずつ 丸ごと',g:seg(p,.05,.15)});
  s+=goalTag(G2);
  return s;
 },
 // 11. 粒が動き出す：光Q の粒は段を越え、板に届くたびに電子が1個。光P の粒は段の手前で止まって消える
 [K+'cross']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,tc=tAt(ctx,K+'cross'),tau=T_STOP+1.5*tc;
  let s=scene({tauP:tau,tauQ:tau,bars:1,hlStep:1});
  s+=fade(seg(p,.25,.35),label('→ 越えて 電子が 出る',24,LQ.y+2,{size:24,color:GRN,weight:700}));
  s+=fade(seg(p,b,b+.08),label('段の 手前で 止まる（越えない）',560,118,{size:26,color:C.a,anchor:'middle',weight:700}));
  s+=goalTag(G2);
  return s;
 },
 // 12. 小問2 の答え D。誤答 A（明るさで判断）→ 誤答 C（弱さで判断）
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,tc=tAt(ctx,K+'cross'),tau=T_STOP+1.5*tc;
  let s=fade(1-.55*seg(p,b,b+.05),scene({tauP:tau,tauQ:tau,bars:1,hlStep:1}));
  s+=wrongSeq(p,ctx,[['A','光P だけ','明るさで 判断した'],['C','どちらも 出ない','弱さで 判断した']],{win:commaWin(ctx,'あかるさで、',{from:b})});
  s+=goalTag(G2)+A2(seg(p,.03,.1));
  return s;
 },
 // 13. 誤答 B（両方）：光P の光子2個を重ねようとして、赤の ×
 [K+'wrongB']:(p)=>{
  const b0=320,k=40,hS=3*k;
  let s=line(200,b0,1000,b0,{color:C.dim,w:3});
  s+=rect(640,b0-hS,260,hS,{fill:W0C,fo:.28,stroke:W0C,sw:2.5,rx:4})+label('3.0 eV',770,b0-hS/2+10,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=line(330,b0-hS,640,b0-hS,{color:W0C,w:2.5,dash:'8 8'});
  s+=ebar(400,b0,2.5,k,{w:70})+label('2.5 eV',450,b0-2.5*k/2+10,{size:26,color:EC,weight:700});
  const u=seg(p,.12,.35);
  s+=fade(u,ebar(400,mix(b0-40,b0-2.5*k,u),2.5,k,{w:70,fo:.35})+label('2.5 eV',450,b0-2.5*k*1.5+10,{size:26,color:EC,weight:700}));
  s+=cross(400,b0-5*k-26,{s:26,g:seg(p,.4,.5)});
  s+=fade(seg(p,.4,.5),label('2個を 合わせて 受け取れない',540,b0-5*k-14,{size:26,color:C.a,weight:700}));
  s+=wrongCard('B','両方','2個を 合わせられない',{g:seg(p,.05,.12)});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // ================= S3 小問3：明るくしても出ない理由 =================
 [K+'goal3']:(p)=>{
  let s=plate()+laneBase(LP,{wave:0})+stream(LP,T_STOP,{bars:1});
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 15. 明るさ ×1 → ×2 → ×3：粒の数が増える。棒の長さ（2.5 eV）は変わらない
 [K+'more']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,tc=tAt(ctx,K+'more'),tau=T_STOP+tc;
  const d2=seg(p,.12,.2),d3=seg(p,.32,.4),lev=d3>.5?3:d2>.5?2:1;
  let s=plate()+laneBase(LP,{wave:0})+stream(LP,tau,{bars:1,dens:[d2,d3]});
  s+=card(440,96,300,58,label(`明るさ ×${lev}`,590,136,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.02,.1),C.hi);
  s+=fade(seg(p,b,b+.08),label('1個の 棒は 2.5 eV の まま',560,350,{size:30,color:EC,anchor:'middle',weight:700}));
  s+=note('（粒の 数は 省略して 描いています）',560,395,{g:seg(p,.12,.2)});
  s+=goalTag(G3);
  return s;
 },
 // 16. 何個来ても段の手前で止まる。小問3 の答え A
 [K+'never']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,tau=T_STOP+tAt(ctx,K+'more');
  let s=plate()+laneBase(LP,{wave:0,hlStep:1})+stream(LP,tau,{bars:1,dens:[1,1]});
  s+=card(440,96,300,58,label('明るさ ×3',590,136,{size:30,color:C.hi,anchor:'middle',weight:700}),1,C.hi);
  s+=fade(seg(p,.03,.12),label('何個 来ても 越えられない',560,350,{size:30,color:C.a,anchor:'middle',weight:700}));
  s+=goalTag(G3)+A3(seg(p,b,b+.06));
  return s;
 },
 // 17. 誤答 B（振動数が下がる）→ 誤答 C（光子が減る）。1枚ずつ
 [K+'wrongBC']:(p,ctx)=>{
  let s=plate()+laneBase(LP,{wave:0})+stream(LP,T_STOP+2.2,{bars:1,dens:[1,1]});
  s+=wrongSeq(p,ctx,[['B','振動数が 下がる','明るさと 色の つまみを 混同'],['C','光子が 減る','明るいほど 光子は 多い']]);
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 18. 誤答 D（明るい光は波だけ）
 [K+'wrongD3']:(p)=>{
  let s=plate()+laneBase(LP,{wave:0})+stream(LP,T_STOP+2.2,{bars:1,dens:[1,1]});
  s+=wrongCard('D','明るい 光は 波だけ','同じ 光が 波と 粒の 両方の 性質を 持つ',{g:seg(p,.03,.1)});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // ================= S4 まとめ =================
 // 19. 2つのつまみ：明るさ＝個数（粒が増える）、振動数＝1個のエネルギー（棒が伸びる）
 [K+'knobs']:(p)=>{
  const u1=seg(p,.12,.45),u2=seg(p,.5,.85),k=36,b0=470;
  let s=card(30,90,560,420,'',seg(p,0,.08))+card(610,90,560,420,'',seg(p,.02,.1));
  s+=fade(seg(p,0,.08),knob(110,180,.15+.6*u1,'明るさ',{hl:u1>0&&u1<1})+label('明るさ ＝ 個数',380,175,{size:30,color:PH,anchor:'middle',weight:700}));
  const n=1+Math.floor(4.99*u1);
  for(let i=0;i<5;i++)s+=fade(i<n?1:0,ebar(110+i*100,b0,2.5,k,{w:36})+photon(110+i*100,b0-2.5*k-20,{r:9}));
  s+=fade(seg(p,0,.08),line(70,b0,560,b0,{color:C.dim,w:3}));
  s+=fade(seg(p,.02,.1),knob(690,180,.15+.6*u2,'振動数',{hl:u2>0&&u2<1})+label('振動数 ＝ 1個の エネルギー',960,175,{size:28,color:NC,anchor:'middle',weight:700}));
  const E=mix(2.5,5.0,u2);
  s+=fade(seg(p,.02,.1),line(650,b0,1130,b0,{color:C.dim,w:3})+ebar(890,b0,E,k,{w:60})+photon(890,b0-E*k-22,{r:10})+label(`${E.toFixed(1)} eV`,940,b0-E*k/2+10,{size:28,color:EC,weight:700}));
  return s;
 },
 // 20. 元の単元動画の段と光子の画面に戻る
 [K+'sum']:(p,ctx)=>hsAPhoton1Diagrams['hs-a-photon-1:uvstep'](p,ctx)+card(800,96,340,96,TX(`${Et}=${ht}\\,${nut}`,970,162,{size:50}),seg(p,.05,.15),EC),
};

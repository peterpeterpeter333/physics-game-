// 問題編 解説「負の点電荷のそばの電子」(ys-qx-hs-e-field-2) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/404_電場とクーロンの法則.md の q-hs-e-field-2（解説 21 行）。
// 色（正本）：電場 𝐄 水色、力 𝐅 緑、電荷 q・Q 桃、正電荷 赤、負電荷・電子 青、距離 r 白、強調 黄。右下に凡例「正 赤・負 青・距離 白」。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 元の単元動画（yt1-hs-e-field-1・2）の部品（chg・dist・FA・EA・fieldMap・色）を読み込んで使う（そのファイルは編集しない）。
import {C,seg,lin,fade,label,line,rect,ring,tex,texWidth,clamp,mix} from './anim.mjs';
import {POS,NEG,FA,cs,chg,dist,vE,vF,qt,Qt} from './yt1-hs-e-field-1-diagrams.mjs';
import {EA,fieldMap} from './yt1-hs-e-field-2-diagrams.mjs';
import {QC,card,textW,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,legend,sentWin,voiceEnd,isProblem} from './yt1-qx-common.mjs';

const K='qx-hs-e-field-2:';
const PQ=QC.q,WH=C.ink,FG=QC.F,EC=QC.E,HI=C.hi;
const G1='P の電場の強さと向き',G2='電子が受ける力',G3='P の電場';
const A1=g=>answerTag(1,'C','5.0×10⁵ N/C、Q に向かう',{g}),A2=g=>answerTag(2,'A','8.0×10⁻¹⁴ N、遠ざかる',{g}),A3=g=>answerTag(3,'B','',{g});
const LEG=(g=1)=>legend([['正 赤',POS],['負 青',NEG],['距離 白',WH]],1062,410,{g,size:22});
const T=(s,x,y,o={})=>label(s,x,y,{size:28,color:WH,anchor:'middle',weight:700,...o});
const M=(s,x,y,o={})=>tex(s,x,y,{size:40,auto:false,color:WH,...o});
const win=(ctx,i)=>{const W=sentWin(ctx);return W[Math.min(i,W.length-1)];};
const box=(x,y,w,h,g=1,col=HI)=>fade(g,rect(x,y,w,h,{fill:col,fo:.08,stroke:col,sw:3,rx:8}));
// 背景つきの文字（電場の矢印の上でも読めるように）
const BT=(s,x,y,col=WH,size=26,anchor='middle')=>{const w=textW(s,size)+16,x0=anchor==='middle'?x-w/2:anchor==='end'?x-w:x-8;
 return rect(x0,y-size*.9,w,size*1.25,{fill:C.bg,fo:.85,stroke:'none',rx:6})+label(s,anchor==='start'?x:x,y,{size,color:col,anchor,weight:700});};

// ---- Q・P・距離。0.30 m ＝ 300 px ---------------------------------------------------------------
const XQ=160,XP=560,Y=280,RQ=32;
function ptP(x,y,{g=1,hi=0}={}){
 let s=line(x-11,y,x+11,y,{color:WH,w:3})+line(x,y-11,x,y+11,{color:WH,w:3})+label('P',x+4,y-22,{size:28,color:WH,weight:700});
 if(hi>0)s+=fade(hi,ring(x,y,24,{color:HI,w:4}));
 return fade(g,s);
}
function base({y=Y,qg=1,pg=1,dg=1,phi=0,qlab=1,field=0,earrow=0,elab=0,ehi=0,g=1}={}){
 let s='';
 if(field>0)s+=fade(field,fieldMap(XQ,y,{sign:-1,rings:[[80,8],[125,12]],L0:44,r0:80}));
 s+=chg(XQ,y,{sign:-1,r:RQ,g:qg});
 if(qlab)s+=fade(qg*qlab,BT('Q＝−5.0 μC',XQ,y-RQ-20,PQ,28));
 s+=ptP(XP,y,{g:pg,hi:phi});
 s+=dist(XQ,XP,y+90,{text:'r＝0.30 m',g:dg});
 if(earrow>0)s+=EA(XP,y,XP-90,y,{g:earrow,w:7,head:20});
 if(elab>0)s+=fade(elab,M(vE,XP-62,y-26,{size:34,color:EC})+label('5.0×10⁵ N/C',XP-62,y-62,{size:24,color:EC,anchor:'middle',weight:700}));
 if(ehi>0)s+=box(XP-104,y-26,112,52,ehi);
 return fade(g,s);
}
const KS='k＝9.0×10⁹ N·m²/C²（丸めた値）';
function kchip({g=1,cx=330}={}){const w=textW(KS,26)+36;return card(cx-w/2,90,w,58,label(KS,cx,128,{size:26,color:WH,anchor:'middle',weight:700}),g,C.faint);}
// P に置く電荷（電子 青・正の電荷 赤）
const elec=(g=1,{y=Y,lab=1}={})=>fade(g,chg(XP,y,{sign:-1,r:16})+(lab?BT('電子 −1.6×10⁻¹⁹ C',XP+20,y+50,NEG,24,'start'):''));
const posq=(g=1,{y=Y,dy=0,lab=1}={})=>fade(g,chg(XP,y+dy,{sign:1,r:16})+(lab?BT('＋2.0×10⁻⁹ C',XP+20,y+50+dy,POS,24,'start'):''));
// 分数
function frac(num,den,cx,cy,{size=42,ncol=WH,dcol=WH}={}){
 const wn=texWidth(num,size,false),wd=texWidth(den,size,false),w=Math.max(wn,wd)+24;
 return {svg:tex(num,cx,cy-size*.62,{size,auto:false,color:ncol})+line(cx-w/2,cy-size*.12,cx+w/2,cy-size*.12,{color:WH,w:3})+tex(den,cx,cy+size*.95,{size,auto:false,color:dcol}),w,wn,wd,ny:cy-size*.62,dy:cy+size*.95};
}
const strike=(x1,x2,y,g=1)=>fade(g,line(x1-4,y+18,x2+4,y-18,{color:HI,w:4}));
// E＝k|Q|/r²（Q と r を囲める）
function eform(cx,cy,{size=40,hiQ=0,hiR=0,lhs=true}={}){
 const L=lhs?`${cs(EC,'E')}=k`:'k',wl=texWidth(L,size,false),num=`|${Qt}|`,den='r^2',F=frac(num,den,0,0,{size});
 const x0=cx-(wl+12+F.w)/2,fx=x0+wl+12+F.w/2,F2=frac(num,den,fx,cy,{size,ncol:WH});
 let s=tex(L,x0+wl/2,cy+size*.1,{size,auto:false,color:WH})+F2.svg;
 if(hiQ>0)s+=box(fx-F2.wn/2-10,F2.ny-size*.75,F2.wn+20,size*1.2,hiQ);
 if(hiR>0)s+=box(fx-F2.wd/2-10,F2.dy-size*.8,F2.wd+20,size*1.25,hiR);
 return s;
}
// 誤答のときの小さな図（上に寄せる）
const mini=(o={})=>base({y:165,qlab:1,dg:0,earrow:1,elab:1,g:.6,...o});

const D0={
 // ================= 問題アニメ =================
 // 出題（小問1）：0〜3 s で Q、P、距離の線の順に現れ、k の札。3 s で静止。出さないもの：電場の矢印、力の矢印、値。
 [K+'q0']:(p)=>base({qg:seg(p,.02,.3),pg:seg(p,.35,.6),dg:seg(p,.65,.9)})+kchip({g:seg(p,.65,.95)})+LEG(seg(p,.2,.4)),
 // 小問2：P に青い電子を置く（1 s）
 [K+'q2']:(p)=>base()+kchip()+elec(seg(p,.1,.8))+LEG(),
 // 小問3：電子を消し、P に小さな赤い電荷 ＋2.0×10⁻⁹ C を置き直す（1 s）
 [K+'q3']:(p)=>base()+kchip()+elec(1-seg(p,0,.35))+posq(seg(p,.45,.95))+LEG(),
 // ================= S1 小問1：P の電場 =================
 // 1. 出題中の図＋求めるもの。P を黄の枠で囲む
 [K+'goal1']:(p)=>base({phi:seg(p,.4,.55)})+kchip()+LEG()+goalTag(G1,{g:seg(p,.03,.15)}),
 // 2. 記号の札：P に試しの電荷「q：置いた電荷」、「𝐅：その電荷が受ける力」（緑の文字）、「𝐄：P の電場」（水色の文字）→「定義」と 𝐄＝𝐅/q。試しの電荷は終わりに消す
 [K+'def']:(p,ctx)=>{
  const ve=voiceEnd(ctx),out=1-seg(p,ve-.04,ve+.04);
  let s=base({phi:1-seg(p,.02,.1)});
  s+=fade(seg(p,.05,.14)*out,chg(XP,Y,{sign:1,r:13})+BT('q：置いた電荷',XP,Y+52,PQ,24));
  s+=fade(seg(p,.16,.25),BT('𝐅：その電荷が受ける力',XP,Y-108,FG,24));
  s+=fade(seg(p,.27,.36),BT('𝐄：P の電場',XP,Y-66,EC,24));
  s+=card(760,170,280,170,kindTag('定義',900,210)+M(`${vE}=\\dfrac{${vF}}{${qt}}`,900,290,{size:46}),seg(p,.45,.58),HI);
  s+=kchip()+LEG()+goalTag(G1);
  return s;
 },
 // 3. 式だけの画面：F＝k|Q|q/r² を q で割る → 分子と分母の q に打ち消し線 → E＝k|Q|/r²
 [K+'point']:(p,ctx)=>{
  const [a,b]=win(ctx,0),[c,d]=win(ctx,1),at=f=>a+f*(b-a);
  let s=fade(seg(p,at(.02),at(.12)),M(`${cs(FG,'F')}=k\\dfrac{|${Qt}|\\,${qt}}{r^2}`,330,175,{size:44}));
  s+=fade(seg(p,at(.25),at(.35)),label('q で 割る',560,180,{size:28,color:HI,weight:700}));
  const cx=640,cy=330,F=frac(`k|${Qt}|\\,${qt}`,`r^2\\,${qt}`,cx,cy,{size:44}),wq=texWidth(qt,44,false);
  const L=`${cs(EC,'E')}=\\dfrac{${cs(FG,'F')}}{${qt}}=`,wl=texWidth(L,44,false);
  s+=fade(seg(p,at(.35),at(.48)),M(L,cx-F.w/2-wl/2-10,cy+6,{size:44})+F.svg);
  s+=strike(cx+F.wn/2-wq,cx+F.wn/2,F.ny,seg(p,at(.55),at(.62)))+strike(cx+F.wd/2-wq,cx+F.wd/2,F.dy,seg(p,at(.6),at(.67)));
  s+=fade(seg(p,at(.7),at(.82)),M('=',cx+F.w/2+30,cy+6,{size:44})+eform(cx+F.w/2+110,cy,{size:44,lhs:false}));
  s+=fade(seg(p,c+.05,c+.15),T('置く 電荷 q は 消える',cx,cy+120,{color:HI}));
  s+=LEG()+goalTag(G1);
  return s;
 },
 // 4. 分子の計算 9.0×10⁹×5.0×10⁻⁶＝4.5×10⁴
 [K+'calc']:(p)=>{
  let s=fade(seg(p,.03,.15),label('分子',200,185,{size:30,color:C.dim,anchor:'end',weight:700})+M(`9.0\\times10^{9}\\times5.0\\times10^{-6}`,450,180,{size:42}));
  s+=fade(seg(p,.5,.65),M(`=4.5\\times10^{4}`,830,180,{size:42,color:HI}));
  s+=LEG()+goalTag(G1);
  return s;
 },
 // 4（続き）. 分母に黄の「2乗」→ 割り算 → 5.0×10⁵ N/C
 [K+'calc2']:(p)=>{
  let s=label('分子',200,185,{size:30,color:C.dim,anchor:'end',weight:700})+M(`9.0\\times10^{9}\\times5.0\\times10^{-6}`,450,180,{size:42})+M(`=4.5\\times10^{4}`,830,180,{size:42,color:HI});
  const F1=frac(`4.5\\times10^{4}`,`0.30^2`,380,340,{size:44,dcol:HI});
  s+=fade(seg(p,.03,.15),M(`${cs(EC,'E')}=`,380-F1.w/2-50,345,{size:44})+F1.svg);
  s+=fade(seg(p,.12,.22),label('2乗',380+F1.w/2+10,400,{size:26,color:HI,weight:700}));
  const F2=frac(`4.5\\times10^{4}`,`0.090`,640,340,{size:44,dcol:HI});
  s+=fade(seg(p,.3,.42),M('=',640-F2.w/2-30,345,{size:44})+F2.svg);
  s+=fade(seg(p,.55,.68),M(`=5.0\\times10^{5}\\ \\mathrm{N/C}`,640+F2.w/2+170,345,{size:44,color:EC}));
  s+=LEG()+goalTag(G1);
  return s;
 },
 // 5. 図に戻る。Q の「−」を光らせ、Q のまわりに水色の電場（すべて Q に向かう）。P の矢印を黄の枠で囲む
 [K+'dir']:(p,ctx)=>{
  const [a,b]=win(ctx,0),[c,d]=win(ctx,1);
  let s=base({field:seg(p,b*.45,b*.75),earrow:seg(p,c,c+.12*(d-c)),elab:seg(p,c+.1*(d-c),c+.2*(d-c)),ehi:seg(p,c+.5*(d-c),c+.6*(d-c))});
  s+=fade(seg(p,.03,.1)*(1-seg(p,b*.9,b)),ring(XQ,Y,RQ+10,{color:HI,w:4}));
  s+=card(760,170,280,130,T('Q が 正 → 外向き',900,222,{size:26,color:C.dim})+T('Q が 負 → 内向き',900,268,{size:26,color:HI}),seg(p,.1,.2),C.faint);
  s+=kchip()+LEG()+goalTag(G1);
  return s;
 },
 // 6. 答えの札（図はそのまま）
 [K+'ans1']:(p)=>base({field:1,earrow:1,elab:1,ehi:1})+card(760,170,280,130,T('Q が 正 → 外向き',900,222,{size:26,color:C.dim})+T('Q が 負 → 内向き',900,268,{size:26,color:HI}),1,C.faint)+kchip()+LEG()+goalTag(G1)+A1(seg(p,.05,.15)),
 // 7. 誤答 A（r で割った）・B（外向き）。1枚ずつ
 [K+'wrongAB']:(p,ctx)=>{
  let s=mini();
  s+=wrongSeq(p,ctx,[['A','1.5×10⁵ N/C','r で 割った（N·m/C）',{mid:`4.5\\times10^{4}\\div0.30=1.5\\times10^{5}`}],['B','遠ざかる 向き','Q が 負なら 内向き']],{opts:{y:310}});
  s+=LEG()+goalTag(G1)+A1(1);
  return s;
 },
 // 8. 誤答 D（決められない）。打ち消し線の q を指す
 [K+'wrongD']:(p,ctx)=>{
  const [c,d]=win(ctx,1);
  let s=mini();
  const cx=860,cy=165,F=frac(`k|${Qt}|\\,${qt}`,`r^2\\,${qt}`,cx,cy,{size:36}),wq=texWidth(qt,36,false);
  s+=card(690,95,340,150,'',seg(p,c,c+.08),C.faint)+fade(seg(p,c,c+.08),M(`${cs(EC,'E')}=`,cx-F.w/2-40,cy+5,{size:36})+F.svg
   +strike(cx+F.wn/2-wq,cx+F.wn/2,F.ny,1)+strike(cx+F.wd/2-wq,cx+F.wd/2,F.dy,1));
  s+=fade(seg(p,c+.1,c+.2),box(cx+F.wn/2-wq-10,F.ny-28,wq+20,44)+box(cx+F.wd/2-wq-10,F.dy-28,wq+20,44));
  s+=wrongCard('D','決められない','𝐄 は 場所で 決まる',{y:310,g:seg(p,.03,.1)});
  s+=LEG()+goalTag(G1)+A1(1);
  return s;
 },
 // ================= S2 小問2：電子が受ける力 =================
 // 9. カードを消す。P に青い電子
 [K+'goal2']:(p)=>base({earrow:1,elab:1})+elec(seg(p,.2,.35))+LEG()+goalTag(G2,{g:seg(p,.03,.15)}),
 // 10. 𝐅＝q𝐄。P の水色の矢印を黄の枠で囲む
 [K+'fqe']:(p)=>base({earrow:1,elab:1,ehi:seg(p,.45,.55)})+elec(1)+card(760,170,280,120,M(`${vF}=${qt}${vE}`,900,240,{size:48}),seg(p,.1,.22),HI)+LEG()+goalTag(G2),
 // 11. 式だけの画面：1.6×10⁻¹⁹×5.0×10⁵＝8.0×10⁻¹⁴ N
 [K+'calcF']:(p)=>{
  let s=fade(seg(p,.03,.15),M(`${cs(FG,'F')}=${qt}${cs(EC,'E')}`,600,170,{size:46}));
  s+=fade(seg(p,.15,.3),M(`=1.6\\times10^{-19}\\times5.0\\times10^{5}`,600,260,{size:44}));
  s+=fade(seg(p,.6,.72),M(`=8.0\\times10^{-14}\\ \\mathrm{N}`,600,350,{size:46,color:FG}));
  s+=LEG()+goalTag(G2);
  return s;
 },
 // 12. 図に戻る。水色の矢印（Q に向かう）と逆向きの緑の矢印が電子から出る。答えの札
 [K+'ans2']:(p,ctx)=>{
  const [a,b]=win(ctx,0),[c,d]=win(ctx,1);
  let s=base({earrow:1,elab:1})+elec(1);
  s+=FA(XP+22,Y,XP+132,Y,{g:seg(p,.3,b*.85),w:8,head:22});
  s+=fade(seg(p,b*.6,b*.85),BT('8.0×10⁻¹⁴ N',XP+150,Y+9,FG,24,'start'));
  s+=fade(seg(p,b*.7,b*.9),BT('𝐄 と 逆',XP+84,Y-56,HI,24));
  s+=LEG()+goalTag(G2)+A2(seg(p,c+.3*(d-c),c+.4*(d-c)));
  return s;
 },
 // 13. 右下に、二つの青い電荷が反発する小さな図
 [K+'coul']:(p)=>{
  let s=base({earrow:1,elab:1})+elec(1)+FA(XP+22,Y,XP+132,Y,{w:8,head:22})+BT('8.0×10⁻¹⁴ N',XP+150,Y+9,FG,24,'start');
  const g=seg(p,.1,.25),cx=890,cy=410;
  s+=card(740,340,300,130,chg(cx-60,cy,{sign:-1,r:20})+chg(cx+60,cy,{sign:-1,r:20})+FA(cx-86,cy,cx-150,cy,{w:6,head:16})+FA(cx+86,cy,cx+150,cy,{w:6,head:16})
   +T('同じ 符号どうし：反発',cx,cy-36,{size:24,color:C.dim}),g,C.faint);
  s+=LEG()+goalTag(G2)+A2(1);
  return s;
 },
 // 14. 誤答 B（Q に向かう）
 [K+'wrongB2']:(p)=>{
  let s=mini({})+fade(.6,elec(1,{y:165,lab:0})+FA(XP+22,165,XP+132,165,{w:8,head:22}));
  s+=wrongCard('B','Q に 向かう','負の 電荷は 𝐄 と 逆',{y:310,g:seg(p,.03,.1)});
  s+=LEG()+goalTag(G2)+A2(1);
  return s;
 },
 // 15. 誤答 C（電場の値）・D（q÷E）。1枚ずつ
 [K+'wrongCD2']:(p,ctx)=>{
  let s=mini({})+fade(.6,elec(1,{y:165,lab:0})+FA(XP+22,165,XP+132,165,{w:8,head:22}));
  s+=wrongSeq(p,ctx,[['C','5.0×10⁵ N','それは 電場（N/C）'],['D','3.2×10⁻²⁵ N','q÷E を 計算した',{mid:`1.6\\times10^{-19}\\div(5.0\\times10^{5})=3.2\\times10^{-25}`}]],{opts:{y:310}});
  s+=LEG()+goalTag(G2)+A2(1);
  return s;
 },
 // ================= S3 小問3：置く電荷を変える =================
 // 16. カードを消す。電子と緑の力の矢印を消し、赤い小さな電荷が P に入る（力の矢印はまだ描かない）
 [K+'goal3']:(p)=>{
  const u=seg(p,.3,.6);
  let s=base({earrow:1,elab:1})+elec(1-seg(p,.1,.25))+FA(XP+22,Y,XP+132,Y,{w:8,head:22,g:1-seg(p,.1,.25)});
  s+=posq(u,{dy:-120*(1-u)});
  s+=LEG()+goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 17. P の水色の矢印はそのまま。E＝k|Q|/r² の Q と r を黄の枠で囲む
 [K+'same']:(p,ctx)=>{
  const [a,b]=win(ctx,0);
  let s=base({earrow:1,elab:1})+posq(1);
  s+=card(760,150,280,160,eform(900,215,{size:42,hiQ:seg(p,b*.15,b*.3),hiR:seg(p,b*.3,b*.45)}),seg(p,.03,.12),C.faint);
  s+=fade(seg(p,b*.6,b*.8),T('置いた 電荷に よらない',900,350,{size:26,color:HI}));
  s+=LEG()+goalTag(G3);
  return s;
 },
 // 18. 答えの札 → 赤い電荷から Q に向かう緑の矢印「1.0×10⁻³ N」
 [K+'ans3']:(p,ctx)=>{
  const [a,b]=win(ctx,0),[c,d]=win(ctx,1);
  let s=base({earrow:1,elab:1})+posq(1);
  s+=card(730,150,320,150,T('F ＝ qE',890,200,{size:30,color:FG})+T('＝ 2.0×10⁻⁹ × 5.0×10⁵',890,240,{size:24})+T('＝ 1.0×10⁻³ N',890,280,{size:28,color:FG}),seg(p,c+.05,c+.15),FG);
  s+=FA(XP-6,Y+34,XP-110,Y+34,{g:seg(p,c+.35*(d-c),c+.55*(d-c)),w:8,head:22});
  s+=fade(seg(p,c+.5*(d-c),c+.65*(d-c)),BT('1.0×10⁻³ N',XP-150,Y+40,FG,24,'end'));
  s+=LEG()+goalTag(G3)+A3(seg(p,.04,.12));
  return s;
 },
 // 19. 誤答 A（遠ざかる向きになる）
 [K+'wrongA3']:(p)=>{
  let s=mini({})+fade(.6,posq(1,{y:165,lab:0}));
  s+=wrongCard('A','遠ざかる 向きに なる','𝐄 の 向きは Q で 決まる',{y:310,g:seg(p,.03,.1)});
  s+=LEG()+goalTag(G3)+A3(1);
  return s;
 },
 // 20. 誤答 C（弱くなる）・D（2.0×10⁻⁹ 倍）。1枚ずつ
 [K+'wrongCD3']:(p,ctx)=>{
  let s=mini({})+fade(.6,posq(1,{y:165,lab:0}));
  s+=wrongSeq(p,ctx,[['C','弱くなる','𝐄 は 置く 電荷に よらない'],['D','2.0×10⁻⁹ 倍','それは 力 F＝qE の 話']],{opts:{y:310}});
  s+=LEG()+goalTag(G3)+A3(1);
  return s;
 },
 // ================= まとめ =================
 // 21. Q に向かう 𝐄（5.0×10⁵ N/C）を中心に、電子の力（外向き）と正の電荷の力（内向き）を並べ、𝐅＝q𝐄 で結ぶ。声の後に答えの札
 [K+'sum']:(p,ctx)=>{
  const ve=voiceEnd(ctx),at=f=>ve+f*(1-ve);
  let s=base({earrow:1,elab:1,dg:1,g:seg(p,.02,.1)});
  const row=(y,ico,dir,lab,val,g)=>{let r=card(640,y,410,104,'',1,C.faint)+ico(680,y+52);
   r+=dir>0?FA(702,y+52,782,y+52,{w:7,head:18}):FA(782,y+52,702,y+52,{w:7,head:18});
   r+=label(lab,800,y+40,{size:22,color:C.dim,weight:700})+label(val,800,y+80,{size:26,color:FG,weight:700});return fade(g,r);};
  s+=row(110,(x,y)=>chg(x,y,{sign:-1,r:16}),1,'電子：遠ざかる 向き','8.0×10⁻¹⁴ N',seg(p,.2,.3));
  s+=row(230,(x,y)=>chg(x,y,{sign:1,r:16}),-1,'正の 電荷：Q に 向かう','1.0×10⁻³ N',seg(p,.3,.4));
  s+=card(740,350,210,70,M(`${vF}=${qt}${vE}`,845,392,{size:40}),seg(p,.5,.6),HI);
  s+=LEG()+answerRow([[1,'C',''],[2,'A',''],[3,'B','']],{g:seg(p,at(.15),at(.3))});
  return s;
 },
};
export const qxHsEField2Diagrams=D0;

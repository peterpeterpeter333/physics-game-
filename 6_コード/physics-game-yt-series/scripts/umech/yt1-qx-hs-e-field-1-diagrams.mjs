// 問題編 解説「2倍離すと、引き合う力は？」(ys-qx-hs-e-field-1) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/404_電場とクーロンの法則.md の q-hs-e-field-1（解説 17 行）。
// 色（正本）：力 F 緑、電荷 q 桃、正電荷 赤、負電荷 青、距離 r 白、強調 黄。右下に凡例「正 赤・負 青・距離 白」。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 元の単元動画（yt1-hs-e-field-1）の部品（chg・dist・FA・色）を読み込んで使う（そのファイルは編集しない）。
import {C,seg,lin,fade,label,line,rect,ring,tex,texWidth,clamp,mix} from './anim.mjs';
import {POS,NEG,FA,cs,Ft,q1,q2,chg,dist} from './yt1-hs-e-field-1-diagrams.mjs';
import {QC,card,textW,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,legend,note,sentWin,voiceEnd,cueT,isProblem} from './yt1-qx-common.mjs';

const K='qx-hs-e-field-1:';
const PQ=QC.q,WH=C.ink,FG=QC.F,HI=C.hi;
const G1='力の大きさと向き',G2='0.60 m での力';
const A1=g=>answerTag(1,'D','0.60 N、引き合う',{g}),A2=g=>answerTag(2,'B','0.15 N',{g});
const LEG=(g=1)=>legend([['正 赤',POS],['負 青',NEG],['距離 白',WH]],1062,410,{g,size:22});
const T=(s,x,y,o={})=>label(s,x,y,{size:28,color:WH,anchor:'middle',weight:700,...o});
const M=(s,x,y,o={})=>tex(s,x,y,{size:40,auto:false,color:WH,...o});
// 幅に収まるように TeX の大きさを縮める
const MF=(s,x,y,maxW,o={})=>{const sz=o.size??40,w=texWidth(s,sz,false);return M(s,x,y,{...o,size:w>maxW?sz*maxW/w:sz});};
const win=(ctx,i)=>{const W=sentWin(ctx);return W[Math.min(i,W.length-1)];};
const box=(x,y,w,h,g=1,col=HI)=>fade(g,rect(x,y,w,h,{fill:col,fo:.08,stroke:col,sw:3,rx:8}));

// ---- 二つの電荷（左 ＋3.0 μC、右 −2.0 μC）。0.30 m ＝ 300 px ---------------------------------------
const X1=170,X2A=470,X2B=770,Y=240,R=30;
function pic({x2=X2A,y=Y,qg=1,lab=1,labs=['＋3.0 μC','−2.0 μC'],dg=1,dtext,alen=0,ag=1,ftext='',signHi=0,distHi=0,g=1}={}){
 let s=chg(X1,y,{sign:1,r:R,g:qg})+chg(x2,y,{sign:-1,r:R,g:qg});
 if(signHi>0)s+=fade(signHi,ring(X1,y,R+10,{color:HI,w:4})+ring(x2,y,R+10,{color:HI,w:4}));
 if(lab)s+=fade(qg*lab,T(labs[0],X1,y+R+42,{color:PQ})+T(labs[1],x2,y+R+42,{color:PQ}));
 const dy=y+R+82,dt=dtext??(x2===X2A?'r＝0.30 m':'r＝0.60 m');
 if(dg>0)s+=dist(X1,x2,dy,{text:dt,g:dg});
 if(distHi>0)s+=box(X1-16,dy-22,x2-X1+32,80,distHi);
 if(alen>0&&ag>0){
  const hd=Math.min(22,alen*.55);
  s+=FA(X1+R+6,y,X1+R+6+alen,y,{g:ag,w:8,head:hd})+FA(x2-R-6,y,x2-R-6-alen,y,{g:ag,w:8,head:hd});
  if(ftext)s+=fade(ag,T(ftext,(X1+x2)/2,y-44,{color:FG}));
 }
 return fade(g,s);
}
// k の定数の札（丸めた値）
const KS='k＝9.0×10⁹ N·m²/C²（丸めた値）';
function kchip({g=1,hi=0,cx=320}={}){
 const w=textW(KS,26)+36;
 return card(cx-w/2,90,w,58,label(KS,cx,128,{size:26,color:WH,anchor:'middle',weight:700}),g,hi>.5?HI:C.faint)+(hi>0?box(cx-w/2-8,82,w+16,74,hi):'');
}
// クーロンの法則 F＝k|q₁q₂|/r²（分母を囲めるように、左辺と分数を別々に描く）
function coul(cx,cy,{size=44,num=`|${q1}${q2}|`,den='r^2',denHi=0,g=1}={}){
 const L=`${Ft}=k`,wl=texWidth(L,size,false),wn=texWidth(num,size,false),wd=texWidth(den,size,false),fw=Math.max(wn,wd)+20;
 const x0=cx-(wl+12+fw)/2,fx=x0+wl+12+fw/2;
 let s=tex(L,x0+wl/2,cy+size*.1,{size,auto:false,color:WH});
 s+=tex(num,fx,cy-size*.62,{size,auto:false,color:WH})+line(fx-fw/2,cy-size*.12,fx+fw/2,cy-size*.12,{color:WH,w:3})+tex(den,fx,cy+size*.95,{size,auto:false,color:WH});
 if(denHi>0)s+=box(fx-wd/2-14,cy+size*.05,wd+28,size*1.25,denHi);
 return fade(g,s);
}
// 分数（分子・分母）
function frac(num,den,cx,cy,{size=42,ncol=WH,dcol=WH}={}){
 const wn=texWidth(num,size,false),wd=texWidth(den,size,false),w=Math.max(wn,wd)+24;
 return {svg:tex(num,cx,cy-size*.62,{size,auto:false,color:ncol})+line(cx-w/2,cy-size*.12,cx+w/2,cy-size*.12,{color:WH,w:3})+tex(den,cx,cy+size*.95,{size,auto:false,color:dcol}),w,wn,wd};
}
// 右の説明の枠（小問1 の行 2〜5）
const PX=600,PW=440,PCX=PX+PW/2;
const panel=(y,h,inner,g=1,col=C.faint)=>card(PX,y,PW,h,inner,g,col);

const D0={
 // ================= 問題アニメ =================
 // 出題（小問1）：0〜2 s 二つの電荷が現れる。2〜4 s 白い距離の線「r＝0.30 m」と k の札。4 s で静止。
 // 出さないもの：力の矢印と値、r² の値。
 [K+'q0']:(p)=>{
  let s=pic({qg:seg(p,.02,.4),dg:seg(p,.5,.72)});
  s+=kchip({g:seg(p,.72,.95)});
  s+=LEG(seg(p,.3,.5));
  return s;
 },
 // 小問2：小問1 の図から、右の電荷を右へ動かし、距離の線を「0.60 m」に描き直して静止（2 s）。
 [K+'q2']:(p)=>{
  const u=seg(p,.05,.6),x2=mix(X2A,X2B,u);
  let s=pic({x2,dg:0});
  s+=dist(X1,X2A,Y+R+82,{text:'r＝0.30 m',g:1-seg(p,0,.2)});
  s+=dist(X1,X2B,Y+R+82,{text:'r＝0.60 m',g:seg(p,.65,.95)});
  s+=kchip()+LEG();
  return s;
 },
 // ================= S1 小問1：力の大きさと向き =================
 // 1. 出題中の図＋求めるもの
 [K+'goal1']:(p)=>pic()+kchip()+LEG()+goalTag(G1,{g:seg(p,.03,.15)}),
 // 2. 記号の札（q₁・q₂ 桃、r 白、「F：力の大きさ」緑の文字だけ）→ k の札を光らせる →「法則」と式 →「大きさ：式」「向き：符号」
 [K+'law']:(p,ctx)=>{
  const [a,b]=win(ctx,0),[c,d]=win(ctx,1),at=f=>a+f*(b-a);
  let s=pic();
  s+=fade(seg(p,at(.03),at(.12)),M(q1,X1,Y-R-22,{size:36,color:PQ})+M(q2,X2A,Y-R-22,{size:36,color:PQ}));
  s+=fade(seg(p,at(.1),at(.2)),M('r',(X1+X2A)/2,Y+R+64,{size:34}));
  s+=fade(seg(p,at(.16),at(.26)),T('F：力の大きさ',(X1+X2A)/2,Y+9,{color:FG,size:24}));
  s+=kchip({hi:seg(p,at(.28),at(.36))*(1-seg(p,at(.9),c+.02))});
  s+=panel(165,190,kindTag('法則',PCX,205)+coul(PCX,282,{size:42}),seg(p,at(.42),at(.55)),C.F);
  s+=card(PX,372,210,60,T('大きさ：式',PX+105,412,{size:26,color:HI}),seg(p,c+.02,c+.1),HI);
  s+=card(PX+230,372,210,60,T('向き：符号',PX+335,412,{size:26,color:HI}),seg(p,c+.35*(d-c),c+.45*(d-c)),HI);
  s+=LEG()+goalTag(G1);
  return s;
 },
 // 3. μC を C に直す。札「μ ＝ 10⁻⁶」→ 電荷の札が 3.0×10⁻⁶ C・2.0×10⁻⁶ C に書き換わる
 [K+'micro']:(p,ctx)=>{
  const [a,b]=win(ctx,0),[c,d]=win(ctx,1),u1=seg(p,c+.05*(d-c),c+.2*(d-c)),u2=seg(p,c+.55*(d-c),c+.7*(d-c));
  let s=pic({lab:0});
  s+=fade(1-u1,T('＋3.0 μC',X1,Y+R+42,{color:PQ}))+fade(u1,T('＋3.0×10⁻⁶ C',X1,Y+R+42,{color:PQ}));
  s+=fade(1-u2,T('−2.0 μC',X2A,Y+R+42,{color:PQ}))+fade(u2,T('−2.0×10⁻⁶ C',X2A,Y+R+42,{color:PQ}));
  s+=fade(seg(p,a+.02,a+.1)*(1-u1)*.9,box(X1+16,Y+R+12,58,42)+box(X2A+16,Y+R+12,58,42));
  s+=panel(165,250,'',1);
  s+=fade(seg(p,a+.05,a+.2),T('μ（マイクロ）＝ 10⁻⁶',PCX,225,{color:HI}));
  s+=fade(u1,T('3.0 μC ＝ 3.0×10⁻⁶ C',PCX,295,{color:PQ}));
  s+=fade(u2,T('2.0 μC ＝ 2.0×10⁻⁶ C',PCX,360,{color:PQ}));
  s+=kchip()+LEG()+goalTag(G1);
  return s;
 },
 // 4. 大きさだけを使う：−2.0 の符号が外れ、絶対値の縦線の中に入る → 積 6.0×10⁻¹² C²
 [K+'prod']:(p)=>{
  let s=pic({labs:['＋3.0×10⁻⁶ C','−2.0×10⁻⁶ C'],g:.55});
  s+=panel(165,250,'',1);
  s+=M(`|${q1}${q2}|`,PCX,212,{size:38});
  const u=seg(p,.25,.45);
  s+=fade(1-u,MF(`=|(3.0\\times10^{-6})\\times(-2.0\\times10^{-6})|`,PCX,282,PW-30,{size:32}));
  s+=fade(seg(p,.15,.25)*(1-u),box(PCX+18,258,46,40));
  s+=fade(u,MF(`=(3.0\\times10^{-6})\\times(2.0\\times10^{-6})`,PCX,282,PW-30,{size:32}));
  s+=fade(seg(p,.5,.65),M(`=6.0\\times10^{-12}\\ \\mathrm{C^2}`,PCX,355,{size:36,color:PQ}));
  s+=fade(seg(p,.3,.45),T('マイナスを 外す',PCX,400,{size:24,color:HI}));
  s+=kchip()+LEG()+goalTag(G1);
  return s;
 },
 // 5. 距離の線を黄の枠で囲み、r²＝0.30²＝0.090 m²
 [K+'r2']:(p)=>{
  let s=pic({labs:['＋3.0×10⁻⁶ C','−2.0×10⁻⁶ C'],distHi:seg(p,.05,.18)});
  s+=panel(165,190,'',1);
  s+=fade(seg(p,.15,.3),M(`r^2=0.30^2`,PCX,232,{size:40}));
  s+=fade(seg(p,.4,.55),M(`=0.090\\ \\mathrm{m^2}`,PCX,300,{size:40,color:HI}));
  s+=kchip()+LEG()+goalTag(G1);
  return s;
 },
 // 6. 式だけの画面：F＝9.0×10⁹×6.0×10⁻¹²÷0.090 → 分子 5.4×10⁻² → 0.60 N
 [K+'calc']:(p,ctx)=>{
  const [c,d]=win(ctx,1);
  const F1=frac(`9.0\\times10^{9}\\times6.0\\times10^{-12}`,`0.090`,640,175,{size:42,dcol:HI});
  let s=fade(seg(p,.02,.12),M(`${Ft}=`,640-F1.w/2-50,180,{size:44})+F1.svg);
  s+=fade(seg(p,c,c+.08),box(640-F1.wn/2-12,108,F1.wn+24,62));
  const F2=frac(`5.4\\times10^{-2}`,`0.090`,520,365,{size:42,dcol:HI});
  s+=fade(seg(p,c+.1*(d-c),c+.25*(d-c)),M('=',520-F2.w/2-40,370,{size:44})+F2.svg);
  s+=fade(seg(p,c+.55*(d-c),c+.7*(d-c)),M(`=0.60\\ \\mathrm{N}`,520+F2.w/2+130,370,{size:46,color:FG}));
  s+=LEG()+goalTag(G1);
  return s;
 },
 // 7. 図に戻る。赤と青の符号を光らせ、緑の力の矢印が向き合う向きに出る。答えの札
 [K+'ans1']:(p,ctx)=>{
  const [c,d]=win(ctx,1),[a,b]=win(ctx,0);
  let s=pic({labs:['＋3.0×10⁻⁶ C','−2.0×10⁻⁶ C'],signHi:seg(p,.03,.12)*(1-seg(p,b-.05,b)),alen:110,ag:seg(p,.2,b*.9),ftext:'0.60 N'});
  s+=fade(seg(p,.35,.5),T('引き合う',(X1+X2A)/2,Y+R+130+60,{color:FG,size:26}));
  s+=kchip()+LEG()+goalTag(G1)+A1(seg(p,c+.3*(d-c),c+.4*(d-c)));
  return s;
 },
 // 8. 誤答 A（反発）・B（μ を 10⁻³）。1枚ずつ
 [K+'wrongAB']:(p,ctx)=>{
  let s=pic({y:150,labs:['＋3.0×10⁻⁶ C','−2.0×10⁻⁶ C'],alen:110,ftext:'0.60 N',g:.6});
  s+=wrongSeq(p,ctx,[['A','0.60 N で 反発','＋と−は 引き合う'],['B','6.0×10⁵ N','μ は 10⁻⁶']],{opts:{y:330}});
  s+=LEG()+goalTag(G1)+A1(1);
  return s;
 },
 // 9. 誤答 C（r で割った。単位 N·m）
 [K+'wrongC']:(p)=>{
  let s=pic({y:150,labs:['＋3.0×10⁻⁶ C','−2.0×10⁻⁶ C'],alen:110,ftext:'0.60 N',g:.6});
  s+=wrongCard('C','0.18 N','r² でなく r で 割った（N·m）',{y:330,mid:`5.4\\times10^{-2}\\div0.30=0.18`,g:seg(p,.03,.1)});
  s+=LEG()+goalTag(G1)+A1(1);
  return s;
 },
 // ================= S2 小問2：距離を2倍に =================
 // 10. カード・力の矢印・0.60 N を消す。右の電荷が右へ動き、距離が 0.60 m になる
 [K+'goal2']:(p)=>{
  const u=seg(p,.3,.65),x2=mix(X2A,X2B,u);
  let s=pic({x2,labs:['＋3.0×10⁻⁶ C','−2.0×10⁻⁶ C'],dg:0});
  s+=dist(X1,X2A,Y+R+82,{text:'r＝0.30 m',g:1-seg(p,.2,.32)});
  s+=dist(X1,X2B,Y+R+82,{text:'r＝0.60 m',g:seg(p,.66,.8)});
  s+=kchip()+LEG()+goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 11. 0.60 m は 0.30 m の2倍（区切りの印）→ 式の r² を黄の枠で囲む（電荷の札はそのまま）
 [K+'twice']:(p,ctx)=>{
  const [c,d]=win(ctx,1),[a,b]=win(ctx,0);
  let s=pic({x2:X2B,labs:['＋3.0×10⁻⁶ C','−2.0×10⁻⁶ C']});
  const dy=Y+R+82,gh=seg(p,.05,.2)*(1-seg(p,c-.04,c));
  s+=fade(gh,line(X2A,dy-16,X2A,dy+16,{color:HI,w:4})+label('0.30 m',(X1+X2A)/2,dy-14,{size:24,color:HI,anchor:'middle',weight:700})+label('0.30 m',(X2A+X2B)/2,dy-14,{size:24,color:HI,anchor:'middle',weight:700}));
  s+=fade(seg(p,b*.5,b*.7)*(1-seg(p,c-.04,c)),T('2倍',(X1+X2B)/2,Y-50,{color:HI,size:30}));
  s+=card(330,88,340,140,coul(500,148,{size:38,denHi:seg(p,c+.4*(d-c),c+.5*(d-c))}),seg(p,c,c+.08),C.faint);
  s+=LEG()+goalTag(G2);
  return s;
 },
 // 12. 式だけの画面：分母 (2r)²＝4r² → 0.090 が 0.36 に変わる。「×4」
 [K+'four']:(p,ctx)=>{
  const [c,d]=win(ctx,1);
  let s=fade(seg(p,.03,.12),label('分母',300,195,{size:32,color:C.dim,anchor:'end',weight:700})+M(`(2r)^2`,410,190,{size:48}));
  s+=fade(seg(p,.2,.32),M(`=4r^2`,590,190,{size:48,color:HI}));
  s+=fade(seg(p,.35,.45),T('4倍',800,200,{color:HI,size:34}));
  const u=seg(p,c+.15*(d-c),c+.45*(d-c));
  s+=fade(seg(p,c,c+.06),card(240,300,260,80,T('0.090 m²',370,352,{size:34}),1,WH));
  s+=fade(u,line(520,340,660,340,{color:HI,w:5})+`<polygon points="680,340 660,330 660,350" fill="${HI}"/>`+T('×4',590,318,{color:HI,size:30}));
  s+=fade(u,card(700,300,260,80,T('0.36 m²',830,352,{size:34,color:HI}),1,HI));
  s+=LEG()+goalTag(G2);
  return s;
 },
 // 13. 図に戻る。新しい距離での矢印は小問1の 1/4（小問1 の長さを灰色の点線で横に添える）。答えの札
 [K+'ans2']:(p,ctx)=>{
  const [a,b]=win(ctx,0),[c,d]=win(ctx,1);
  let s=card(380,90,440,62,T('0.60 N ÷ 4 ＝ 0.15 N',600,131,{size:30,color:FG}),seg(p,.05,.15),FG);
  s+=pic({x2:X2B,labs:['＋3.0×10⁻⁶ C','−2.0×10⁻⁶ C'],alen:27.5,ag:seg(p,.25,.5),ftext:''});
  const cy=Y-48,gg=seg(p,.3,.45);
  s+=fade(gg,line(X1+R+6,cy,X1+R+116,cy,{color:'#8795ad',w:3,dash:'6 6'})+line(X2B-R-6,cy,X2B-R-116,cy,{color:'#8795ad',w:3,dash:'6 6'})
   +label('小問1 の長さ',X1+R+6,cy-14,{size:22,color:C.dim})+label('小問1 の長さ',X2B-R-6,cy-14,{size:22,color:C.dim,anchor:'end'}));
  s+=fade(seg(p,.45,.6),T('0.15 N',(X1+X2B)/2,Y+8,{color:FG}));
  s+=LEG()+goalTag(G2)+A2(seg(p,c+.3*(d-c),c+.4*(d-c)));
  return s;
 },
 // 14. 誤答 A（1/2）・D（1/8）。1枚ずつ
 [K+'wrongAD']:(p,ctx)=>{
  let s=pic({y:150,x2:X2B,labs:['＋3.0×10⁻⁶ C','−2.0×10⁻⁶ C'],alen:27.5,g:.6})+fade(.6,T('0.15 N',(X1+X2B)/2,158,{color:FG}));
  s+=wrongSeq(p,ctx,[['A','0.30 N','1/2 ではなく 1/4',{mid:`0.60\\div2=0.30`}],['D','0.075 N','3乗ではなく 2乗',{mid:`0.60\\div8=0.075`}]],{opts:{y:330}});
  s+=LEG()+goalTag(G2)+A2(1);
  return s;
 },
 // 15. 誤答 C（r² は分母）
 [K+'wrongC2']:(p)=>{
  let s=pic({y:150,x2:X2B,labs:['＋3.0×10⁻⁶ C','−2.0×10⁻⁶ C'],alen:27.5,g:.6})+fade(.6,T('0.15 N',(X1+X2B)/2,158,{color:FG}));
  s+=wrongCard('C','2.4 N','r² は 分母',{y:330,mid:`0.60\\times4=2.4`,g:seg(p,.03,.1)});
  s+=LEG()+goalTag(G2)+A2(1);
  return s;
 },
 // 16. 短い緑の矢印が互いに向き合う向きなことを黄の枠で示す
 [K+'dir']:(p)=>{
  let s=pic({x2:X2B,labs:['＋3.0×10⁻⁶ C','−2.0×10⁻⁶ C'],alen:27.5})+T('0.15 N',(X1+X2B)/2,Y+8,{color:FG});
  const g=seg(p,.15,.3);
  s+=box(X1-R-12,Y-R-14,2*R+24+40,2*R+28,g)+box(X2B-R-12-40,Y-R-14,2*R+24+40,2*R+28,g);
  s+=fade(seg(p,.3,.45),T('引き合う 向きの まま',(X1+X2B)/2,Y-70,{color:HI}));
  s+=LEG()+goalTag(G2)+A2(1);
  return s;
 },
 // ================= まとめ =================
 // 17. 引き合う2つの電荷と 0.60 N、距離2倍の図と 0.15 N（1/4）を並べ、式の r² に黄の枠。声の後に答えの札を並べる
 [K+'sum']:(p,ctx)=>{
  const ve=voiceEnd(ctx),at=f=>ve+f*(1-ve);
  let s=card(400,84,400,130,coul(600,140,{size:36,denHi:seg(p,.55,.7)}),seg(p,.02,.1),C.faint);
  const mini=(x0,dpx,len,ft,dt,g)=>{
   const y=318,xa=x0,xb=x0+dpx;let m=chg(xa,y,{sign:1,r:22})+chg(xb,y,{sign:-1,r:22});
   const hd=Math.min(18,len*.55);m+=FA(xa+28,y,xa+28+len,y,{w:7,head:hd})+FA(xb-28,y,xb-28-len,y,{w:7,head:hd});
   m+=T(ft,(xa+xb)/2,y-42,{color:FG})+dist(xa,xb,y+52,{text:dt,size:26});return fade(g,m);};
  s+=card(40,226,470,206,'',seg(p,.1,.2),C.faint)+mini(140,210,70,'0.60 N','0.30 m',seg(p,.1,.2));
  s+=card(540,226,500,206,'',seg(p,.3,.4),C.faint)+mini(580,420,17.5,'0.15 N（1/4）','0.60 m（2倍）',seg(p,.3,.4));
  s+=LEG()+answerRow([[1,'D',''],[2,'B','']],{g:seg(p,at(.15),at(.3))});
  return s;
 },
};
export const qxHsEField1Diagrams=D0;

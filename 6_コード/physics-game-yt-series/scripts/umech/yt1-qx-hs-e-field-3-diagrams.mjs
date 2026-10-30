// 問題編 解説「斜めに運んだら、電位差は？」(ys-qx-hs-e-field-3) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/404_電場とクーロンの法則.md の q-hs-e-field-3（解説 22 行）。
// 色（正本）：電場 𝐄 水色、電位 V 紫、位置エネルギー U 橙、電荷 q 桃、力 F 緑、負電荷 青、距離 d 白、強調 黄。右下に凡例「正 赤・負 青・距離 白」。
// 左に電場と点1・2・3（1 m ＝ 700 px）、右の列に電位の坂のグラフ・式の札・誤答カード。札の帯（y＜78）には図を描かない。
// 元の単元動画（yt1-hs-e-field-1・2）の部品（chg・FA・EA・色）を読み込んで使う（そのファイルは編集しない）。
import {C,seg,lin,fade,label,line,rect,ring,dot,tex,texWidth,clamp,mix} from './anim.mjs';
import {POS,NEG,FA,cs,chg,vE,qt} from './yt1-hs-e-field-1-diagrams.mjs';
import {EA} from './yt1-hs-e-field-2-diagrams.mjs';
import {QC,card,textW,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,legend,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-hs-e-field-3:';
const PQ=QC.q,WH=C.ink,FG=QC.F,EC=QC.E,VC=QC.V,UC=QC.U,HI=C.hi;
const G1='点1と点2の電位の差と高い方',G2='点1と点3の電位差',G3='位置エネルギーの変化';
const A1=g=>answerTag(1,'B','点1が 60 V 高い',{g}),A2=g=>answerTag(2,'D','60 V',{g}),A3=g=>answerTag(3,'A','1.8×10⁻⁴ J 増える',{g});
const LEG=(g=1)=>legend([['正 赤',POS],['負 青',NEG],['距離 白',WH]],1062,410,{g,size:22});
const T=(s,x,y,o={})=>label(s,x,y,{size:28,color:WH,anchor:'middle',weight:700,...o});
const M=(s,x,y,o={})=>tex(s,x,y,{size:40,auto:false,color:WH,...o});
const win=(ctx,i)=>{const W=sentWin(ctx);return W[Math.min(i,W.length-1)];};
const box=(x,y,w,h,g=1,col=HI)=>fade(g,rect(x,y,w,h,{fill:col,fo:.08,stroke:col,sw:3,rx:8}));
const BT=(s,x,y,col=WH,size=24,anchor='middle')=>{const w=textW(s,size)+16,x0=anchor==='middle'?x-w/2:anchor==='end'?x-w+8:x-8;
 return rect(x0,y-size*.9,w,size*1.25,{fill:C.bg,fo:.85,stroke:'none',rx:6})+label(s,x,y,{size,color:col,anchor,weight:700});};

// ---- 電場と点 ----------------------------------------------------------------------------------
const P1=[220,410],P2=[430,410],P3=[430,130],ROWS=[180,265,350],FX1=80,FX2=600;
function field(g=1,{grow=1,op=.6,lab=1}={}){
 let s='';for(const y of ROWS)s+=EA(FX1,y,mix(FX1,FX2,grow),y,{w:4,head:16,opacity:op});
 if(lab)s+=fade(lab,M(vE,FX2-90,150,{size:32,color:EC})+label('200 V/m',FX2-66,158,{size:26,color:EC,weight:700}));
 return fade(g,s);
}
const ptLab=(p,t,dx,dy,g=1,col=WH)=>fade(g,ring(p[0],p[1],9,{color:col,w:3,fill:C.bg})+label(t,p[0]+dx,p[1]+dy,{size:28,color:col,anchor:'middle',weight:700}));
function pts({g1=1,g2=1,g3=1,l12=1,l23=1,l13=1,lab=1,h12=0,h23=0,h13=0,c12=WH,c23=WH}={}){
 let s='';
 const L=(a,b,g,h,col)=>g>0?fade(g,line(a[0],a[1],mix(a[0],b[0],g),mix(a[1],b[1],g),{color:h>.5?HI:col,w:3+3*h})):'';
 s+=L(P1,P2,l12,h12,c12)+L(P2,P3,l23,h23,c23)+L(P1,P3,l13,h13,WH);
 if(lab){s+=fade(l12*lab,T('0.30 m',(P1[0]+P2[0])/2,P1[1]+40,{size:26}));
  s+=fade(l23*lab,label('0.40 m',P2[0]+18,228,{size:26,color:WH,weight:700}));
  s+=fade(l13*lab,label('0.50 m',336,228,{size:26,color:WH,anchor:'end',weight:700}));}
 s+=ptLab(P1,'1',-24,36,g1)+ptLab(P2,'2',24,36,g2)+ptLab(P3,'3',26,10,g3);
 return s;
}
const base=(o={})=>field(1)+pts(o);
// 等電位線（点2と点3を通る縦の紫の点線）
const equi=(g=1)=>fade(g,line(P2[0],100,P2[0],470,{color:VC,w:3,dash:'10 8'})+label('等電位線',P2[0]+60,100,{size:24,color:VC,anchor:'start',weight:700}));
// 負の電荷 −3.0 μC
const qneg=(x,y,{g=1,lab=1,hi=0}={})=>fade(g,chg(x,y,{sign:-1,r:18})+(hi>0?fade(hi,ring(x,y,30,{color:HI,w:4})):'')+(lab?BT('−3.0 μC',x-30,y+8,PQ,24,'end'):''));
// ---- 右の列：電位の坂のグラフ --------------------------------------------------------------------
const GX0=740,GY0=282,GTOP=108,gx=x=>790+(x-P1[0])*.81,VY1=140,VY2=225;
function graph({g=1,three=0,drop=1,dlab='60 V',slopeHi=0,mv=-1}={}){
 let s=line(GX0,GY0,1035,GY0,{color:C.dim,w:2})+line(GX0,GY0,GX0,GTOP,{color:VC,w:3});
 s+=label('電位',GX0+10,GTOP+6,{size:24,color:VC,weight:700});
 const ly=x=>VY1+(VY2-VY1)*(x-gx(P1[0]))/(gx(P2[0])-gx(P1[0]));
 s+=line(760,ly(760),1025,ly(1025),{color:VC,w:5});
 for(const [x,t] of [[gx(P1[0]),'点1'],[gx(P2[0]),three?'点2・点3':'点2']]){s+=line(x,GY0-8,x,GY0+8,{color:WH,w:2})+label(t,x,GY0+32,{size:22,color:WH,anchor:'middle',weight:700})+dot(x,ly(x),6,VC)+line(x,ly(x),x,GY0,{color:C.faint,w:2,dash:'4 4'});}
 if(drop>0){const x2=gx(P2[0]);s+=fade(drop,line(x2+16,VY1,x2+16,VY2,{color:VC,w:3})+line(gx(P1[0]),VY1,x2+24,VY1,{color:VC,w:2,dash:'6 5'})+label(dlab,x2+26,(VY1+VY2)/2+8,{size:26,color:VC,weight:700}));}
 if(slopeHi>0)s+=box(gx(P1[0])-16,VY1-30,gx(P2[0])-gx(P1[0])+32,VY2-VY1+60,slopeHi);
 if(mv>=0)s+=chg(mix(gx(P1[0]),gx(P2[0]),mv),ly(mix(gx(P1[0]),gx(P2[0]),mv)),{sign:-1,r:12});
 return fade(g,s);
}
// V＝Ed の札（かっこの中を囲める）
function vedCard(x,y,{g=1,hi=0,w=320}={}){
 let s=M(`${cs(VC,'V')}=${cs(EC,'E')}d`,x+w/2,y+52,{size:44});
 s+=T('（d は 電場の 向きに',x+w/2,y+100,{size:24})+T('測った 距離）',x+w/2,y+132,{size:24});
 s+=box(x+16,y+74,w-32,70,hi);
 return card(x,y,w,160,s,g,HI);
}
const RX=720,RW=320;   // 右の列
const WC=(o={})=>({x:618,w:432,y:328,...o});   // 誤答カードの置き場（右の列の下）

const D0={
 // ================= 問題アニメ =================
 // 出題：0〜2 s 電場の矢印が左から伸びて並ぶ（200 V/m）。2〜5 s 点1・2・3 と、1→2・2→3・1→3 の線と長さ。5 s で静止。
 // 出さないもの：等電位線、電位の坂のグラフ、電位差の値、力の矢印。
 [K+'q0']:(p)=>{
  let s=field(1,{grow:seg(p,0,.38),lab:seg(p,.3,.4)});
  s+=pts({g1:seg(p,.42,.48),g2:seg(p,.5,.56),g3:seg(p,.58,.64),l12:lin(p,.66,.76),l23:lin(p,.77,.87),l13:lin(p,.88,.98)});
  s+=LEG(seg(p,.3,.4));
  return s;
 },
 // 小問3：点1に青い電荷「−3.0 μC」を置く（1 s）
 [K+'q3']:(p)=>base()+qneg(...P1,{g:seg(p,.1,.8)})+LEG(),
 // ================= S1 小問1 =================
 [K+'goal1']:(p)=>base()+LEG()+goalTag(G1,{g:seg(p,.03,.15)}),
 // 2. 記号の札（E・V：2点の電位の差・d：電場の向きに進んだ距離）→ V＝Ed（d は電場の向きに測った距離）。かっこの中を黄の枠
 [K+'ved']:(p)=>{
  let s=field(1)+pts({l23:.25,l13:.25,lab:0});
  s+=fade(seg(p,.04,.12),box(FX2-112,124,150,46));
  s+=fade(seg(p,.12,.2),BT('V：2点の 電位の 差',(P1[0]+P2[0])/2,P1[1]-24,VC,24));
  s+=fade(seg(p,.2,.28),BT('d：電場の 向きに 進んだ 距離',(P1[0]+P2[0])/2,P1[1]+84,WH,24));
  s+=vedCard(RX,110,{g:seg(p,.35,.45),hi:seg(p,.6,.7)});
  s+=LEG()+goalTag(G1);
  return s;
 },
 // 3. 1→2 の線を黄でなぞり、電場の矢印と同じ向きだと並べる → d＝0.30 m
 [K+'d12']:(p,ctx)=>{
  const [c,d]=win(ctx,1);
  let s=field(1)+pts({h12:seg(p,.05,.15),l23:.25,l13:.25});
  s+=fade(seg(p,.2,.32),EA(P1[0],P1[1]-46,P2[0],P1[1]-46,{w:6,head:18})+BT('電場と 同じ 向き',(P1[0]+P2[0])/2,P1[1]-64,EC,24));
  s+=vedCard(RX,110,{hi:0});
  s+=card(RX,300,RW,70,T('d ＝ 0.30 m',RX+RW/2,346,{size:32,color:HI}),seg(p,c,c+.1),HI);
  s+=LEG()+goalTag(G1);
  return s;
 },
 // 4. 右に電位の坂のグラフ。点1から点2へ 60 V 下がる。答えの札
 [K+'ans1']:(p,ctx)=>{
  const [c,d]=win(ctx,1),[a,b]=win(ctx,0);
  let s=field(1)+pts({h12:1,l23:.25,l13:.25});
  s+=card(RX,330,RW,64,T('200 × 0.30 ＝ 60 V',RX+RW/2,372,{size:28,color:VC}),seg(p,.03,.12),VC);
  s+=graph({g:seg(p,.12,.25),drop:seg(p,.3,.45)});
  s+=fade(seg(p,b*.7,b),BT('点1 が 高い',gx(P1[0])+40,VY1-14,HI,24,'start'));
  s+=LEG()+goalTag(G1)+A1(seg(p,c+.3*(d-c),c+.4*(d-c)));
  return s;
 },
 // 5. 誤答 A（向き逆）
 [K+'wrongA']:(p)=>{
  let s=fade(.55,field(1)+pts({h12:1,l23:.25,l13:.25}))+graph({g:.6});
  s+=wrongCard('A','点2が 60 V 高い','電場の 向きに 進むと 下がる',{...WC(),g:seg(p,.03,.1)});
  s+=LEG()+goalTag(G1)+A1(1);
  return s;
 },
 // 6. 誤答 C（E÷d）→ 誤答 D（等しい）。D では坂のグラフの傾きを黄の枠で囲む
 [K+'wrongCD']:(p,ctx)=>{
  const [a,b]=win(ctx,0),m=a+(b-a)*.42,[c,d]=win(ctx,1);
  let s=fade(.55,field(1)+pts({h12:1,l23:.25,l13:.25}))+graph({g:.6,slopeHi:seg(p,c,c+.08)});
  s+=fade(seg(p,c,c+.08),BT('一様なのは 傾き',900,GTOP+8,HI,24));
  s+=wrongSeq(p,ctx,[['C','667 V','E÷d（単位 V/m²）',{mid:`200\\div0.30\\approx667`}],['D','等しい','一様なのは 傾き']],{win:[[a,m],[m,1]],opts:WC()});
  s+=LEG()+goalTag(G1)+A1(1);
  return s;
 },
 // ================= S2 小問2 =================
 // 7. カード・グラフを消す
 [K+'goal2']:(p)=>base()+LEG()+goalTag(G2,{g:seg(p,.03,.15)}),
 // 8. 斜めの線に「d には使えない」。V＝Ed の札のかっこの中をもう一度光らせる
 [K+'diag']:(p,ctx)=>{
  const [c,d]=win(ctx,1);
  let s=field(1)+pts({h13:seg(p,.05,.15)*(1-seg(p,c+.3*(d-c),c+.5*(d-c)))});
  s+=fade(seg(p,.2,.3),BT('d には 使えない',(P1[0]+P3[0])/2-24,(P1[1]+P3[1])/2+34,QC.bad,24,'end'));
  s+=vedCard(RX,110,{g:seg(p,c-.05,c+.05),hi:seg(p,c+.3*(d-c),c+.45*(d-c))});
  s+=LEG()+goalTag(G2);
  return s;
 },
 // 9. 斜めの線を、1→2（電場の向き）と 2→3（電場と直角）の階段の道に分ける
 [K+'split']:(p)=>{
  let s=field(1)+pts({l13:1-.7*seg(p,.05,.2),c12:EC,c23:HI,h12:0});
  s+=fade(seg(p,.15,.3),line(...P1,...P2,{color:EC,w:6}));
  s+=fade(seg(p,.2,.3),BT('電場の 向き',(P1[0]+P2[0])/2,P1[1]+76,EC,24));
  s+=fade(seg(p,.5,.6),line(...P2,...P3,{color:HI,w:6})+BT('電場と 直角',P2[0]+18,(P2[1]+P3[1])/2+46,HI,24,'start'));
  s+=LEG()+goalTag(G2);
  return s;
 },
 // 10. 点2と点3を通る縦の紫の点線（等電位線）
 [K+'equi']:(p,ctx)=>{
  const [c,d]=win(ctx,1);
  let s=field(1)+pts({l13:.3,c12:EC,c23:HI});
  s+=fade(seg(p,.05,.2),BT('仕事 0',P2[0]+18,(P2[1]+P3[1])/2+46,HI,24,'start'));
  s+=equi(seg(p,c,c+.12));
  s+=card(RX,300,RW,70,T('点2 と 点3 は 同じ 電位',RX+RW/2,344,{size:26,color:VC}),seg(p,c+.15,c+.25),VC);
  s+=LEG()+goalTag(G2);
  return s;
 },
 // 11. V₁−V₃＝60 V。答えの札
 [K+'ans2']:(p,ctx)=>{
  const [c,d]=win(ctx,1);
  let s=field(1)+pts({l13:.3,c12:EC,c23:HI})+equi(1);
  s+=graph({three:1,g:seg(p,.03,.12)});
  s+=card(RX,330,RW,70,M(`${cs(VC,'V_1')}-${cs(VC,'V_3')}=60\\ \\mathrm{V}`,RX+RW/2,374,{size:36}),seg(p,.15,.25),HI);
  s+=LEG()+goalTag(G2)+A2(seg(p,c+.3*(d-c),c+.4*(d-c)));
  return s;
 },
 // 12. 誤答 A（0.50 m）・B（0.70 m）。1枚ずつ
 [K+'wrongAB2']:(p,ctx)=>{
  let s=fade(.55,field(1)+pts({l13:.3,c12:EC,c23:HI})+equi(1))+graph({three:1,g:.6});
  s+=wrongSeq(p,ctx,[['A','100 V','斜めの 0.50 m を 使った',{mid:`200\\times0.50=100`}],['B','140 V','0.70 m を 使った',{mid:`200\\times0.70=140`}]],{opts:WC()});
  s+=LEG()+goalTag(G2)+A2(1);
  return s;
 },
 // 13. 誤答 C（0.40 m）
 [K+'wrongC2']:(p)=>{
  let s=fade(.55,field(1)+pts({l13:.3,c12:EC,c23:HI})+equi(1))+graph({three:1,g:.6});
  s+=wrongCard('C','80 V','直角な 向きでは 電位は 一定',{...WC(),mid:`200\\times0.40=80`,g:seg(p,.03,.1)});
  s+=LEG()+goalTag(G2)+A2(1);
  return s;
 },
 // ================= S3 小問3 =================
 // 14. 点1の青い電荷を黄の枠で囲む
 [K+'goal3']:(p)=>base()+equi(1)+qneg(...P1,{g:seg(p,.1,.25),hi:seg(p,.3,.45)})+LEG()+goalTag(G3,{g:seg(p,.03,.15)}),
 // 15. 記号の札（q 桃・ΔV 紫・ΔU 橙）→「定義」と ΔU＝q×ΔV
 [K+'du']:(p)=>{
  let s=base()+equi(1)+qneg(...P1,{lab:0});
  s+=fade(seg(p,.04,.12),BT('q：運ぶ 電荷 −3.0 μC',P1[0]-10,P1[1]+80,PQ,24));
  s+=fade(seg(p,.14,.22),BT('ΔV：電位の 変化（点3−点1）',95,118,VC,24,'start'));
  s+=card(RX,110,RW,190,label('ΔU：位置エネルギーの 変化',RX+RW/2,148,{size:22,color:UC,anchor:'middle',weight:700})
   +fade(seg(p,.38,.48),kindTag('定義',RX+RW/2,200)+M(`\\Delta ${cs(UC,'U')}=${qt}\\times\\Delta ${cs(VC,'V')}`,RX+RW/2,262,{size:40})),seg(p,.24,.32),UC);
  s+=LEG()+goalTag(G3);
  return s;
 },
 // 16. 青い電荷が点1から点3へ動く。坂のグラフに ΔV＝−60 V
 [K+'dv']:(p)=>{
  const u=seg(p,.05,.5);
  let s=base()+equi(1)+qneg(mix(P1[0],P3[0],u),mix(P1[1],P3[1],u),{lab:0});
  s+=graph({three:1,dlab:'ΔV＝−60 V',drop:seg(p,.45,.6),mv:u});
  s+=card(RX,330,RW,70,M(`\\Delta ${cs(UC,'U')}=${qt}\\times\\Delta ${cs(VC,'V')}`,RX+RW/2,374,{size:34}),1,UC);
  s+=LEG()+goalTag(G3);
  return s;
 },
 // 17. 式だけの画面：符号の掛け算を一つずつ。「−×−＝＋」を黄の枠 → ＋1.8×10⁻⁴ J。答えの札
 [K+'ans3']:(p,ctx)=>{
  const [c,d]=win(ctx,1),[a,b]=win(ctx,0);
  let s=fade(seg(p,.02,.1),M(`\\Delta ${cs(UC,'U')}=(-3.0\\times10^{-6})\\times(-60)`,560,170,{size:44}));
  s+=fade(seg(p,b*.3,b*.45),card(420,220,280,64,M(`(-)\\times(-)=(+)`,560,256,{size:36,color:HI}),1,HI));
  s+=fade(seg(p,b*.55,b*.7),M(`=+1.8\\times10^{-4}\\ \\mathrm{J}`,560,350,{size:46,color:UC}));
  s+=fade(seg(p,b*.8,b),T('1.8×10⁻⁴ J 増える',560,430,{color:UC,size:30}));
  s+=LEG()+goalTag(G3)+A3(seg(p,c+.3*(d-c),c+.4*(d-c)));
  return s;
 },
 // 18. 電荷に左向きの緑の力の矢印と、右へ運ぶ手（黄の矢印）
 [K+'hand']:(p,ctx)=>{
  const [c,d]=win(ctx,1),u=lin(p,c,Math.min(.95,c+.75*(d-c))),x=mix(P1[0]+30,P2[0]-30,u);
  let s=field(1)+pts({l13:.3,c12:EC,c23:WH})+equi(.6);
  s+=qneg(x,P1[1]-60,{lab:0});
  s+=FA(x-22,P1[1]-60,x-122,P1[1]-60,{g:seg(p,.05,.2),w:8,head:22});
  s+=fade(seg(p,.15,.25),BT('電場からの 力（左向き）',x-70,P1[1]-100,FG,24));
  s+=fade(seg(p,c,c+.08),`<path d="M${x+22},${P1[1]-60} L${x+110},${P1[1]-60}" stroke="${HI}" stroke-width="8"/><polygon points="${x+130},${P1[1]-60} ${x+108},${P1[1]-72} ${x+108},${P1[1]-48}" fill="${HI}"/>`+BT('手が 右へ 運ぶ',x+76,P1[1]-20,HI,24));
  s+=card(RX,140,RW,120,T('手が した 仕事',RX+RW/2,186,{size:26,color:HI})+T('→ U が 増える',RX+RW/2,226,{size:28,color:UC}),seg(p,c+.4*(d-c),c+.5*(d-c)),UC);
  s+=LEG()+goalTag(G3)+A3(1);
  return s;
 },
 // 19. 誤答 B（減る）。坂の絵に「負の電荷：坂のたとえと逆」
 [K+'wrongB3']:(p,ctx)=>{
  const [c,d]=win(ctx,1);
  let s=fade(.55,base()+equi(1))+graph({three:1,g:.7});
  s+=fade(seg(p,c,c+.08),BT('負の 電荷：坂の たとえと 逆',812,GTOP+8,HI,24,'start'));
  s+=wrongCard('B','減る','負の 電荷では 逆',{...WC(),g:seg(p,.03,.1)});
  s+=LEG()+goalTag(G3)+A3(1);
  return s;
 },
 // 20. 誤答 C（100 V）・D（ΔV÷q）。1枚ずつ
 [K+'wrongCD3']:(p,ctx)=>{
  let s=fade(.55,base()+equi(1))+graph({three:1,g:.6});
  s+=wrongSeq(p,ctx,[['C','3.0×10⁻⁴ J','100 V を 使った',{mid:`(-3.0\\times10^{-6})\\times(-100)=3.0\\times10^{-4}`,midSize:24}],['D','2.0×10⁷ J','ΔV÷q（単位 V/C）',{mid:`60\\div(3.0\\times10^{-6})=2.0\\times10^{7}`,midSize:26}]],{opts:WC()});
  s+=LEG()+goalTag(G3)+A3(1);
  return s;
 },
 // ================= まとめ =================
 // 21. 等電位線の図に、1→2 の 0.30 m を黄の枠で強調
 [K+'sum1']:(p)=>{
  let s=base({h12:seg(p,.15,.3)})+equi(1);
  s+=box(P1[0]-20,P1[1]-24,P2[0]-P1[0]+40,76,seg(p,.2,.35));
  s+=LEG();
  return s;
 },
 // 22. 点1・2・3 と電位の坂を重ね、「d＝電場の向きの 0.30 m → 60 V」と「ΔU＝(−3.0 μC)×(−60 V)＝＋1.8×10⁻⁴ J」をつないで並べる。声の後に答えの札
 [K+'sum2']:(p,ctx)=>{
  const ve=voiceEnd(ctx),at=f=>ve+f*(1-ve);
  let s=base({h12:1})+equi(1)+box(P1[0]-20,P1[1]-24,P2[0]-P1[0]+40,76,1);
  s+=graph({three:1,g:seg(p,.03,.12)});
  s+=card(RX-100,320,RW+100,64,T('d ＝ 電場の 向きの 0.30 m → 60 V',RX-100+(RW+100)/2,362,{size:24,color:VC}),seg(p,.15,.25),VC);
  s+=card(RX-100,396,RW+100,96,T('ΔU ＝ (−3.0 μC)×(−60 V)',RX-100+(RW+100)/2,434,{size:24,color:UC})+T('＝ ＋1.8×10⁻⁴ J',RX-100+(RW+100)/2,472,{size:26,color:UC}),seg(p,.55,.65),UC);
  s+=answerRow([[1,'B',''],[2,'D',''],[3,'A','']],{g:seg(p,at(.15),at(.3))});
  return s;
 },
};
export const qxHsEField3Diagrams=D0;

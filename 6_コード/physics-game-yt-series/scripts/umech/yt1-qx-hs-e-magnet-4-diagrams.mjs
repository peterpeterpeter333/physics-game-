// 問題編 解説「磁束のグラフから、起電力を読む」(ys-qx-hs-e-magnet-4) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/403_磁場と電磁誘導.md の q-hs-e-magnet-4（解説 21 行）。
// 色（正本）：磁束 Φ 黄、時間 t 金、起電力 ℰ 紫、誘導電流がつくる磁場 橙の点線、法線 桃。Φ の黄と強調の黄が重なるので、強調は黄の「枠」だけ。
//   右下に凡例「Φ 黄」「法線 桃」を全画面で出す。巻数 N は、いつも「巻数 N」と書く。
// 配置：左に Φ–t グラフ（t＝0〜0.80 s）、その真下に区間ごとの ℰ の棒（区間ごとに分けて置く。上向き＝0〜0.20 s の向き）。右に札・式・誤答カード。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 元の単元動画（yt1-hs-e-magnet-4・yt1-hs-e-magnet-1）の部品を読み込んで使う（そのファイルは編集しない）。
import {C,seg,lin,fade,label,line,rect,draw,arrow,mix,tex,texWidth} from './anim.mjs';
import {axes2} from './yt1-hs-e-magnet-4-diagrams.mjs';
import {PHI,TC,EMF,BC,NC,T,EMt,Phit,tt,cs} from './yt1-hs-e-magnet-1-diagrams.mjs';
import {QC,card,textW,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,legend,note,sentWin,voiceEnd,isProblem} from './yt1-qx-common.mjs';

const K='qx-hs-e-magnet-4:';
const WH=C.ink;
const G1='0〜0.20 s の起電力',G2='0.20〜0.50 s の起電力',G3='大きさと向き';
const A1=g=>answerTag(1,'A','30 V',{g}),A2=g=>answerTag(2,'D','0 V',{g}),A3=g=>answerTag(3,'B','20 V、逆向き',{g});
const LEG=(g=1)=>legend([['Φ 黄',PHI],['法線 桃',NC]],1078,470,{g,size:22,gap:10});
const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:WH,anchor:'middle',weight:700,...o});
const win=(ctx,i,d=.5)=>{const W=sentWin(ctx);return W[i]??[d,1];};
// i 番目の文を、読みの「、」で2つに分けた区間（誤答カードを文の途中で切り替える）
function splitSent(ctx,i){
 const [a,b]=win(ctx,i,0);const r=(ctx?.cue?.reading??'').split('。').map(x=>x.replace(/\s/g,'')).filter(Boolean)[i]??'';
 const k=r.indexOf('、'),f=k<0?.5:(k+1)/r.length,m=a+(b-a)*f;return [[a,m],[m,b]];
}
// ---- Φ–t グラフ ---------------------------------------------------------------------------------------
const X0=150,KX=750,Y0=250,KY=130/0.030;
const X=t=>X0+KX*t,Y=f=>Y0-KY*f;
const PTS=[[X(0),Y(0)],[X(.2),Y(.03)],[X(.5),Y(.03)],[X(.8),Y(0)]];
const IV=[[0,.2],[.2,.5],[.5,.8]];
function graph({line:lp=1,g=1,ticks=1}={}){
 let s=axes2({x:X0,y:Y0,w:620,h:125});
 s+=fade(ticks,[.2,.5,.8].map(u=>line(X(u),Y0-6,X(u),Y0+6,{color:C.dim,w:2})+label(`${u.toFixed(2)} s`,X(u),Y0+32,{size:24,color:TC,anchor:'middle'})).join('')
  +line(X0-6,Y(.03),X0+6,Y(.03),{color:C.dim,w:2})+line(X0,Y(.03),X(.2),Y(.03),{color:C.faint,w:1.5,dash:'5 6'})
  +label('0.030 Wb',X0-12,Y(.03)+8,{size:24,color:PHI,anchor:'end'})+label('0',X0-12,Y0+8,{size:24,color:C.dim,anchor:'end'}));
 s+=draw(PTS,lp,{color:PHI,w:5});
 return fade(g,s);
}
// 区間 i（0,1,2）を囲む黄の枠
const frame=(i,g=1)=>{const [a,b]=IV[i];return fade(g,rect(X(a)-8,112,X(b)-X(a)+16,144,{fill:'none',fo:0,stroke:C.hi,sw:3.5,rx:8}));};
// 傾きの三角形。i＝0（上向き）、2（下向き）。lab：0＝ラベルなし、1＝値つき、2＝短い値
function triangle(i,{g=1,lab=1}={}){
 let s='';
 if(i===0){
  s+=line(X(0),Y0,X(.2),Y0,{color:TC,w:6})+line(X(.2),Y0,X(.2),Y(.03),{color:PHI,w:5,dash:'10 6'});
  if(lab)s+=label(lab===1?'Δt＝0.20 s':'Δt 0.20 s',(X(0)+X(.2))/2,314,{size:24,color:TC,anchor:'middle',weight:700})
   +label(lab===1?'ΔΦ＝0.030 Wb':'0.030 Wb',X(.2)+12,198,{size:24,color:PHI,weight:700});
 }else{
  s+=line(X(.5),Y(.03),X(.8),Y(.03),{color:TC,w:6})+line(X(.8),Y(.03),X(.8),Y0,{color:PHI,w:5,dash:'10 6'});
  if(lab===1)s+=label('Δt＝0.30 s',(X(.5)+X(.8))/2,104,{size:24,color:TC,anchor:'middle',weight:700})+label('ΔΦ＝−0.030 Wb',X(.8)+12,198,{size:24,color:PHI,weight:700});
  if(lab===2)s+=label('Δt 0.30 s',(X(.5)+X(.8))/2,104,{size:24,color:TC,anchor:'middle',weight:700})+label('0.030 Wb',X(.8)-10,160,{size:24,color:PHI,weight:700,anchor:'end'});
 }
 return fade(g,s);
}
// ---- ℰ の棒（区間ごと）。h＝[0〜1,…] 伸び、lab＝値の札、wide＝棒を区間いっぱいに ----------------------------
const EY=410,EK=2.4,CX=IV.map(([a,b])=>(X(a)+X(b))/2);
function bars({g=1,h=[0,0,0],lab=[0,0,0],wide=0,zero=0}={}){
 let s=line(X0,EY,X(.8)+40,EY,{color:C.dim,w:2.5})+T(EMt,X0-14,EY+10,{size:30,anchor:'end'});
 s+=[.2,.5,.8].map(u=>line(X(u),Y0+44,X(u),EY+70,{color:C.faint,w:1.5,dash:'5 7'})).join('');
 const bw=i=>mix(60,X(IV[i][1])-X(IV[i][0])-14,wide);
 if(h[0]>0)s+=rect(CX[0]-bw(0)/2,EY-30*EK*h[0],bw(0),30*EK*h[0],{fill:EMF,fo:.55,stroke:EMF,sw:2.5,rx:3});
 if(h[2]>0)s+=rect(CX[2]-bw(2)/2,EY,bw(2),20*EK*h[2],{fill:EMF,fo:.55,stroke:EMF,sw:2.5,rx:3});
 s+=fade(zero,line(CX[1]-bw(1)/2,EY,CX[1]+bw(1)/2,EY,{color:EMF,w:7}));
 if(wide>.5){
  s+=fade(lab[0],label('30 V',CX[0],EY-26,{size:26,color:WH,anchor:'middle',weight:700}));
  s+=fade(lab[1],label('0 V',CX[1],EY-16,{size:26,color:EMF,anchor:'middle',weight:700}));
  s+=fade(lab[2],label('20 V',CX[2],EY+34,{size:26,color:WH,anchor:'middle',weight:700})+label('逆向き',CX[2],EY+76,{size:22,color:EMF,anchor:'middle',weight:700}));
 }else{
 s+=fade(lab[0],label('30 V',CX[0]+bw(0)/2+8,EY-26,{size:26,color:EMF,weight:700}));
 s+=fade(lab[1],label('0 V',CX[1],EY-16,{size:26,color:EMF,anchor:'middle',weight:700}));
 s+=fade(lab[2],label('20 V',CX[2]+bw(2)/2+8,EY+32,{size:26,color:EMF,weight:700})+label('逆向き',CX[2]+bw(2)/2+8,EY+62,{size:22,color:EMF,weight:700}));
 }
 return fade(g,s);
}
// ---- 右の札 ------------------------------------------------------------------------------------------
const RX=830,RW=360,RC=RX+RW/2;
const nTag=(g=1)=>card(RX+60,90,240,54,L('巻数 N＝200',RC,127,{size:28}),g,WH);
// ℰ＝巻数 N×ΔΦ/Δt（「巻数」は文字、残りは TeX）。fr＝ΔΦ/Δt の黄の枠
function lawEq(cx,cy,{size=36,fr=0}={}){
 const a=`${EMt}=`,c=`${cs(WH,'N')}\\times`,d=`\\dfrac{\\Delta${Phit}}{\\Delta${tt}}`;
 const wa=texWidth(a,size,false),wb=textW('巻数',size*.8)+12,wc=texWidth(c,size,false)+6,wd=texWidth(d,size,false);
 let x=cx-(wa+wb+wc+wd)/2,s='';
 s+=T(a,x,cy,{size,anchor:'start'});x+=wa+6;
 s+=label('巻数',x,cy+size*.08,{size:size*.8,color:WH,weight:700});x+=wb;
 s+=T(c,x,cy,{size,anchor:'start'});x+=wc;
 s+=T(d,x,cy,{size,anchor:'start'});
 s+=fade(fr,rect(x-8,cy-size*1.25,wd+16,size*2.2,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:8}));
 return s;
}
const lawCard=(y,g=1,fr=0)=>card(RX,y,RW,150,kindTag('法則',RX+56,y+34)+lawEq(RC,y+100,{fr}),g,EMF);
// 小さなコイル（横から見た輪 3〜5 個）
function coil(cx,cy,{n=4,rx=42,ry=11,gap=15,g=1}={}){
 let s='';for(let i=0;i<n;i++){const y=cy+(i-(n-1)/2)*gap;s+=`<ellipse cx="${cx}" cy="${y}" rx="${rx}" ry="${ry}" fill="none" stroke="${C.dim}" stroke-width="3.5"/>`;}
 return fade(g,s);
}
// 式・計算の札（文字）
const calc=(y,h,rows,g=1,col=WH)=>card(RX,y,RW,h,rows.map(([t,c,sz],i)=>L(t,RC,y+46+i*48,{size:sz??32,color:c??WH})).join(''),g,col);
// 誤答カードの置き場所（右の列）
const WO={x:RX,y:165,w:RW,size:26,whySize:24,midSize:26};
// 基本の画面：グラフ＋棒＋巻数＋凡例
const base=({h=[0,0,0],lab=[0,0,0],bg=1,zero=0,wide=0}={})=>graph()+bars({g:bg,h,lab,zero,wide})+nTag()+LEG();

// ---- 問題文の表（問題アニメ） -------------------------------------------------------------------------
function table(g=1){
 const x0=90,c0=140,cw=300,y0=302,rh=54,cols=[x0,x0+c0,x0+c0+cw,x0+c0+2*cw,x0+c0+3*cw];
 let s=rect(x0,y0,c0+3*cw,2*rh,{fill:'#131f38',fo:.9,stroke:C.faint,sw:2,rx:6});
 s+=line(x0,y0+rh,x0+c0+3*cw,y0+rh,{color:C.faint,w:2});
 for(let i=1;i<4;i++)s+=line(cols[i],y0,cols[i],y0+2*rh,{color:C.faint,w:2});
 const cell=(i,r,t,col=WH)=>label(t,(cols[i]+cols[i+1])/2,y0+r*rh+35,{size:22,color:col,anchor:'middle',weight:700});
 s+=cell(0,0,'時刻 t',TC)+cell(1,0,'0〜0.20 s',TC)+cell(2,0,'0.20〜0.50 s',TC)+cell(3,0,'0.50〜0.80 s',TC);
 s+=cell(0,1,'磁束 Φ',PHI)+cell(1,1,'0 から 0.030 Wb へ増える')+cell(2,1,'0.030 Wb のまま')+cell(3,1,'0.030 Wb から 0 へ減る');
 s+=label('各区間で、磁束は 一定の 割合で 変わる',x0,y0+2*rh+40,{size:24,color:C.dim,weight:700});
 return fade(g,s);
}

const D0={
 // ================= 問題アニメ：出題中（小問1〜3 共通、5 秒＋静止）=================
 // 0〜0.3 s：軸・目盛り・問題文の表。0.2〜4.0 s：Φ の線を左から描く。4.1〜4.75 s：右上に「巻数 N＝200」。5 s で静止。
 // 出さないもの（正本）：傾きの三角形、ℰ の棒とその値、増減を示す矢印。
 [K+'q0']:(p)=>{
  let s=graph({line:lin(p,.04,.8),ticks:1,g:seg(p,0,.06)});
  s+=table(seg(p,0,.06))+nTag(seg(p,.82,.95))+LEG();
  return s;
 },
 // ================= S1 小問1：増える区間 =================
 // 1. 出題中のグラフ。0〜0.20 s の区間を黄の枠。求めるもの
 [K+'goal1']:(p)=>base()+frame(0,seg(p,.3,.45))+goalTag(G1,{g:seg(p,.03,.15)}),
 // 2. 記号の札（Φ・ΔΦ・Δt・ℰ）→「法則」と ℰ＝巻数 N×ΔΦ/Δt → ΔΦ/Δt を黄の枠
 [K+'law']:(p)=>{
  let s=base()+frame(0,1-seg(p,.02,.1));
  s+=fade(seg(p,.04,.12),label('Φ：コイルを 貫く 磁束',X0+14,100,{size:24,color:PHI,weight:700}));
  s+=fade(seg(p,.12,.2),line(X(.2)+12,Y(.03),X(.2)+12,Y0,{color:PHI,w:3})+line(X(.2)+6,Y(.03),X(.2)+18,Y(.03),{color:PHI,w:3})+line(X(.2)+6,Y0,X(.2)+18,Y0,{color:PHI,w:3})
   +label('ΔΦ：磁束の 変化',X(.2)+26,198,{size:24,color:PHI,weight:700}));
  s+=fade(seg(p,.2,.28),line(X(0),Y0+52,X(.2),Y0+52,{color:TC,w:3})+line(X(0),Y0+44,X(0),Y0+60,{color:TC,w:3})+line(X(.2),Y0+44,X(.2),Y0+60,{color:TC,w:3})
   +label('Δt：かかった 時間',(X(0)+X(.2))/2,Y0+86,{size:24,color:TC,anchor:'middle',weight:700}));
  s+=coil(1050,205,{g:seg(p,.28,.36)})+fade(seg(p,.3,.38),line(1092,182,1130,182,{color:C.dim,w:3})+line(1092,228,1130,228,{color:C.dim,w:3})
   +T(EMt,900,216,{size:30,anchor:'end'})+label('：起電力',902,214,{size:26,color:EMF,weight:700}));
  s+=lawCard(296,seg(p,.45,.55),seg(p,.7,.8));
  s+=goalTag(G1);
  return s;
 },
 // 3. 最初の区間の傾き。2文目で三角形（横 Δt＝0.20 s 金、縦 ΔΦ＝0.030 Wb 黄）
 [K+'slope1']:(p,ctx)=>{
  const [a]=win(ctx,1,.45);
  let s=base()+frame(0,1-seg(p,a,a+.06));
  s+=fade(seg(p,.08,.18)*(1-seg(p,a,a+.06)),L('傾き',215,236,{size:26}));
  s+=triangle(0,{g:seg(p,a+.02,a+.14)});
  s+=lawCard(296);
  s+=goalTag(G1);
  return s;
 },
 // 4. 0.030÷0.20＝0.15 Wb/s。2文目で「Wb/s＝V」と「1巻きあたり 0.15 V」
 [K+'rate1']:(p,ctx)=>{
  const [a]=win(ctx,1,.55);
  let s=base()+triangle(0);
  s+=card(RX,170,RW,250,L('0.030 ÷ 0.20',RC,220,{size:32})+fade(seg(p,.2,.3),L('＝ 0.15 Wb/s',RC,270,{size:32,color:PHI}))
   +fade(seg(p,a,a+.08),L('Wb/s ＝ V',RC,326,{size:24,color:C.dim}))+fade(seg(p,a+.1,a+.18),L('1巻きあたり 0.15 V',RC,384,{size:30,color:EMF})),seg(p,.02,.1),PHI);
  s+=goalTag(G1);
  return s;
 },
 // 5. 200個の小さな電池（紫）が一列に並び、まとめて一つの棒になる（20個で代表）
 [K+'series']:(p)=>{
  const n=20,cw=36,y=228,hh=58,m=seg(p,.5,.72),gap=mix(14,0,m),W=n*cw+(n-1)*gap,x0=600-W/2;
  let s='';
  for(let i=0;i<n;i++){const x=x0+i*(cw+gap),g=seg(p,.05+i*.016,.09+i*.016);
   s+=fade(g,rect(x,y,cw,hh,{fill:EMF,fo:.3,stroke:EMF,sw:2,rx:3})+line(x+cw-6,y+14,x+cw-6,y+hh-14,{color:WH,w:3})+line(x+8,y+22,x+8,y+hh-22,{color:WH,w:2}));}
  s+=fade(seg(p,.05,.12)*(1-m),label('1巻き',x0+cw/2,y-40,{size:24,color:EMF,anchor:'middle',weight:700})+label('0.15 V',x0+cw/2,y-12,{size:24,color:EMF,anchor:'middle',weight:700}));
  s+=fade(seg(p,.72,.82),rect(x0-6,y-6,W+12,hh+12,{fill:EMF,fo:.35,stroke:EMF,sw:4,rx:6}));
  s+=fade(seg(p,.74,.86),L('巻数 N＝200 個ぶんが 直列 → 一つの 棒',600,y+hh+60,{size:30,color:EMF}));
  s+=note('（200個を 省略して 描いています）',600,y+hh+108);
  s+=nTag()+LEG()+goalTag(G1);
  return s;
 },
 // 6. ℰ＝200×0.15＝30 V。0〜0.20 s の真下に ℰ の棒が 30 V まで伸びる。2文目で答えの札
 [K+'ans1']:(p,ctx)=>{
  const [a]=win(ctx,1,.6),h=seg(p,.12,.4);
  let s=graph()+triangle(0,{g:.45,lab:0})+bars({g:seg(p,.02,.1),h:[h,0,0],lab:[seg(p,.38,.46),0,0]})+nTag()+LEG();
  s+=card(RX,170,RW,90,T(`${EMt}=200\\times0.15=30\\,\\mathrm{V}`,RC,228,{size:32}),seg(p,.02,.1),EMF);
  s+=goalTag(G1)+A1(seg(p,a,a+.06));
  return s;
 },
 // 7. 誤答 B → C → D を1枚ずつ（ナレーションが移ったら前のカードを消す）
 [K+'wrong1']:(p,ctx)=>{
  const W0=win(ctx,0,0),[w1,w2]=splitSent(ctx,1);
  let s=base({h:[1,0,0],lab:[1,0,0]})+triangle(0,{g:.45,lab:0});
  s+=wrongSeq(p,ctx,[['B','0.15 V','巻数の 掛け忘れ',{mid:`0.030\\div0.20=0.15`}],['C','6.0 V','Δt で 割り忘れ（Wb）',{mid:`200\\times0.030=6.0`}],
   ['D','1.2 V','Δt を 掛けた（Wb·s）',{mid:`200\\times0.030\\times0.20=1.2`}]],{win:[W0,w1,[w2[0],1]],opts:WO});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // ================= S2 小問2：一定の区間 =================
 // 8. カードを消す。0.20〜0.50 s を黄の枠。30 V の棒は残す
 [K+'goal2']:(p)=>base({h:[1,0,0],lab:[1,0,0]})+frame(1,seg(p,.3,.45))+goalTag(G2,{g:seg(p,.05,.18)}),
 // 9. 水平な線に「ΔΦ＝0」（1文目）と「傾き 0」（2文目）
 [K+'flat']:(p,ctx)=>{
  const [a]=win(ctx,1,.55);
  let s=base({h:[1,0,0],lab:[1,0,0]})+frame(1);
  s+=fade(seg(p,.25,.35),L('ΔΦ＝0',CX[1],172,{size:28,color:PHI}));
  s+=fade(seg(p,a+.05,a+.15),L('傾き 0',CX[1],218,{size:28}));
  s+=goalTag(G2);
  return s;
 },
 // 10. 0.20〜0.50 s の真下は棒が伸びず、高さ0の線に「0 V」。2文目で答えの札
 [K+'ans2']:(p,ctx)=>{
  const [a]=win(ctx,1,.6),z=seg(p,a-.12,a-.02);
  let s=base({h:[1,0,0],lab:[1,z,0],zero:z})+frame(1)+L('ΔΦ＝0',CX[1],172,{size:28,color:PHI})+L('傾き 0',CX[1],218,{size:28});
  s+=goalTag(G2)+A2(seg(p,a,a+.06));
  return s;
 },
 // 11. 誤答 A → C を1枚ずつ（文の「、」で切り替える）
 [K+'wrong2']:(p,ctx)=>{
  const [w1,w2]=splitSent(ctx,0);
  let s=base({h:[1,0,0],lab:[1,1,0],zero:1})+frame(1,.6);
  s+=wrongSeq(p,ctx,[['A','6.0 V','大きさではなく 変化を 見る',{mid:`200\\times0.030=6.0`}],['C','20 V','ΔΦ＝0 なのに 割った',{mid:`200\\times0.030\\div0.30=20`}]],{win:[w1,[w2[0],1]],opts:WO});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // 12. 誤答 B（前の区間の 30 V が続く）
 [K+'wrong2b']:(p)=>{
  let s=base({h:[1,0,0],lab:[1,1,0],zero:1})+frame(1,.6);
  s+=wrongCard('B','30 V','変化が 止まれば 0',{...WO,g:seg(p,.03,.1)});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // ================= S3 小問3：減る区間 =================
 // 13. カードを消す。0.50〜0.80 s を黄の枠
 [K+'goal3']:(p)=>base({h:[1,0,0],lab:[1,1,0],zero:1})+frame(2,seg(p,.3,.45))+goalTag(G3,{g:seg(p,.05,.18)}),
 // 14. 下向きの三角形（横 Δt＝0.30 s、縦 ΔΦ＝−0.030 Wb）→ 2文目で 0.030÷0.30＝0.10 Wb/s
 [K+'slope3']:(p,ctx)=>{
  const [a]=win(ctx,1,.45);
  let s=base({h:[1,0,0],lab:[1,1,0],zero:1})+frame(2,1-seg(p,.03,.1))+triangle(2,{g:seg(p,.05,.15)});
  s+=calc(240,110,[['0.030 ÷ 0.30'],['＝ 0.10 Wb/s',PHI]],seg(p,a,a+.08),PHI);
  s+=goalTag(G3);
  return s;
 },
 // 15. 200×0.10＝20 V
 [K+'emf3']:(p)=>{
  let s=base({h:[1,0,0],lab:[1,1,0],zero:1})+triangle(2);
  s+=calc(240,110,[['0.030 ÷ 0.30'],['＝ 0.10 Wb/s',PHI]],1,PHI);
  s+=card(RX,366,RW,80,T(`200\\times0.10=20\\,\\mathrm{V}`,RC,414,{size:34,color:EMF}),seg(p,.15,.25),EMF);
  s+=goalTag(G3);
  return s;
 },
 // 16. レンツの法則。増える区間と減る区間のコイルに、逆向きの橙の点線の磁場
 [K+'lenz']:(p,ctx)=>{
  const [a]=win(ctx,1,.35),g1=seg(p,a+.02,a+.1),g2=seg(p,a+.35,a+.45);
  let s=base({h:[1,0,0],lab:[1,1,0],zero:1})+frame(0,g1)+frame(2,g2);
  s+=kindTag('法則',RC,184,{text:'レンツの 法則',g:seg(p,.05,.12)});
  const one=(cx,up,lab,why,g)=>{const cy=322;
   let q=coil(cx,cy,{n:3,rx:40,gap:16})+arrow(cx-12,cy+62,cx-12,cy-62,{color:PHI,w:5,head:16});
   q+=up?arrow(cx+14,cy+56,cx+14,cy-56,{color:BC,w:4,head:16}):arrow(cx+14,cy-56,cx+14,cy+56,{color:BC,w:4,head:16});
   q=q.replace(`stroke="${BC}" stroke-width="4"`,`stroke="${BC}" stroke-width="4" stroke-dasharray="8 6"`);
   q+=label(lab,cx,cy-82,{size:24,color:PHI,anchor:'middle',weight:700})+label(why,cx,cy+96,{size:24,color:BC,anchor:'middle',weight:700});
   return card(cx-82,226,164,210,q,g,C.faint);};
  s+=one(RX+85,0,'Φ 増える','妨げる',g1)+one(RX+RW-85,1,'Φ 減る','補う',g2);
  s+=goalTag(G3);
  return s;
 },
 // 17. 0.50〜0.80 s の真下に、ℰ の棒が横軸の下側へ 20 V。2文目で答えの札
 [K+'ans3']:(p,ctx)=>{
  const [a]=win(ctx,1,.6),h=seg(p,.1,.35);
  let s=base({h:[1,0,h],lab:[1,1,seg(p,.33,.42)],zero:1});
  s+=calc(190,130,[['大きさ 20 V',EMF,30],['向き：最初の 区間と 逆',WH,28]],seg(p,.15,.25),EMF);
  s+=goalTag(G3)+A3(seg(p,a,a+.06));
  return s;
 },
 // 18. 誤答 A（同じ向き）
 [K+'wrong3a']:(p)=>{
  let s=base({h:[1,0,1],lab:[1,1,1],zero:1});
  s+=wrongCard('A','20 V、同じ向き','減るときは 逆向き',{...WO,g:seg(p,.03,.1)});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 19. 誤答 C（30 V、逆向き）。2文目で最初と最後の三角形を並べ、傾きを比べる
 [K+'wrong3c']:(p,ctx)=>{
  const [a]=win(ctx,1,.45);
  let s=base({h:[1,0,1],lab:[1,1,1],zero:1});
  s+=triangle(0,{g:seg(p,a,a+.08),lab:2})+triangle(2,{g:seg(p,a+.06,a+.14),lab:2});
  s+=wrongCard('C','30 V、逆向き','Δt が 0.30 s',{...WO,g:seg(p,.03,.1)});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 20. 誤答 D（0 V）。減っている区間を黄の枠
 [K+'wrong3d']:(p,ctx)=>{
  const [a]=win(ctx,1,.5);
  let s=base({h:[1,0,1],lab:[1,1,1],zero:1})+frame(2,seg(p,a,a+.08));
  s+=wrongCard('D','0 V','減っている 間は 変化が ある',{...WO,g:seg(p,.03,.1)});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 21a. まとめ（1文目）：カードを消し、「一定の割合」の札、棒を区間いっぱいに
 [K+'sum']:(p)=>{
  let s=base({h:[1,0,1],lab:[1,1,1],zero:1,wide:seg(p,.15,.45)});
  s+=card(RX+40,366,RW-80,60,L('一定の 割合',RC,405,{size:28,color:C.hi}),seg(p,.05,.12),C.hi);
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 21b. まとめ（2文目）：ℰ＝巻数 N×ΔΦ/Δt を上に、各区間の傾きを棒とそろえて並べる。声の後に答えの札を並べる
 [K+'sum2']:(p,ctx)=>{
  const ve=voiceEnd(ctx),r=1-ve,out=seg(p,ve,ve+.04);
  let s=base({h:[1,0,1],lab:[1,1,1],zero:1,wide:1});
  s+=card(RX+40,366,RW-80,60,L('一定の 割合',RC,405,{size:28,color:C.hi}),1,C.hi);
  s+=lawCard(184,seg(p,.03,.12));
  s+=fade(seg(p,.35,.5),label('傾き 0.15 Wb/s',CX[0],314,{size:22,color:PHI,anchor:'middle',weight:700})+label('傾き 0',CX[1],314,{size:22,color:PHI,anchor:'middle',weight:700})
   +label('傾き −0.10 Wb/s',CX[2],314,{size:22,color:PHI,anchor:'middle',weight:700}));
  s+=goalTag(G3,{g:1-out})+A3(1-out);
  s+=answerRow([[1,'A','30 V'],[2,'D','0 V'],[3,'B','20 V、逆向き']],{g:seg(p,ve+.02,ve+.02+.12*r)});
  return s;
 },
};
export const qxHsEMagnet4Diagrams=D0;

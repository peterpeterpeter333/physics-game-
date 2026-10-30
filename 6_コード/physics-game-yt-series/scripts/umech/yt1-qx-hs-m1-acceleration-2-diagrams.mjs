// 問題編 解説「止まって、折り返す台車」(ys-qx-hs-m1-acceleration-2) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/102_加速度.md の q-hs-m1-acceleration-2（解説 20 行）。
// 正本の「上段：坂／下段：v-t グラフ」を、横長のステージに合わせて「左：坂と台車／右：v-t グラフ」に並べる。
// 色（01_共通の約束）：速度 v 紫、加速度 a 赤、時間 t 金、強調 黄。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 運動：坂に沿って上向き（右）が正。v＝12−4t、s＝12t−2t²（3 s で 18 m 上って止まり、6 s で出発点へ戻る）。
import {C,seg,lin,fade,label,line,rect,dot,ring,arrow,tex,texWidth,clamp,poly} from './anim.mjs';
import {textW,QC,card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,pauseBadge,cueT,voiceEnd,sentWin} from './yt1-qx-common.mjs';

const K='qx-hs-m1-acceleration-2:';
const G1='台車の加速度',G2='3 s 後の加速度',G3='3〜6 s の台車の様子';
const A1=g=>answerTag(1,'C','−4 m/s²',{g}),A2=g=>answerTag(2,'D','−4 m/s²',{g}),A3=g=>answerTag(3,'B','速くなる',{g});
const VC=QC.v,AC=QC.a,TC=QC.t,HI=QC.hi,BAD=QC.bad;
const vel=t=>12-4*t,pos=t=>12*t-2*t*t;

// ---- 時間の道具：読みの中で、ある言葉が読まれ始める所（cue の進み 0〜1）------------------------------
function wordAt(ctx,word,nth=0){
 const r=(ctx?.cue?.reading??'').replace(/\s/g,''),w=word.replace(/\s/g,'');
 let i=-1;for(let k=0;k<=nth;k++){i=r.indexOf(w,i+1);if(i<0)break;}
 return i<0||!r.length?.5:i/r.length*voiceEnd(ctx);
}
const glow=(p,a,b)=>seg(p,a,a+.03)*(1-seg(p,b,b+.04));

// ---- 坂と台車（左）-------------------------------------------------------------------------------------
const TH=26*Math.PI/180,P0=[150,452],SL=480,KS=20,KV=9,KA=20;
const U=[Math.cos(TH),-Math.sin(TH)],N=[-Math.sin(TH),-Math.cos(TH)];
const onS=(d,h=0)=>[P0[0]+U[0]*d+N[0]*h,P0[1]+U[1]*d+N[1]*h];
const baseD=s=>22+KS*s;
function hill(g=1){
 const P1=onS(SL);
 return fade(g,poly([P0,P1,[P1[0],P0[1]]],{fill:C.faint,fo:.35,stroke:'none'})+line(P0[0],P0[1],P1[0],P1[1],{color:C.dim,w:3})+line(P0[0]-30,P0[1],P1[0]+10,P0[1],{color:C.dim,w:3}));
}
function cartBody(s,{dashed=false,g=1}={}){
 const [x,y]=onS(baseD(s)),deg=-26;
 const st=dashed?`fill="none" stroke="${C.ink}" stroke-width="3" stroke-dasharray="7 6"`:`fill="#5b6b8c" fill-opacity=".92" stroke="#9aabc7" stroke-width="2"`;
 const wh=dashed?`fill="none" stroke="${C.ink}" stroke-width="3" stroke-dasharray="5 5"`:`fill="${C.ink}"`;
 return fade(g,`<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${deg})"><rect x="-36" y="-50" width="72" height="34" rx="8" ${st}/><circle cx="-20" cy="-9" r="9" ${wh}/><circle cx="20" cy="-9" r="9" ${wh}/></g>`);
}
// 速度の矢印（紫）：台車の上 72px、坂に沿って v×KV。加速度の矢印（赤）：上 112px、坂に沿って −4×KA
function vArrow(s,v,{g=1,lab=0}={}){
 if(Math.abs(v)<.3)return '';
 const d=baseD(s),[x0,y0]=onS(d,74),[x1,y1]=onS(d+v*KV,74);
 return arrow(x0,y0,x1,y1,{color:VC,w:6,head:16,g})+(lab?fade(lab*g,label('速度',(x0+x1)/2+N[0]*26,(y0+y1)/2+N[1]*26+8,{size:22,color:VC,anchor:'middle',weight:700})):'');
}
function aArrow(s,{g=1,lab=0}={}){
 const d=baseD(s),[x0,y0]=onS(d,134),[x1,y1]=onS(d-4*KA,134);
 return arrow(x0,y0,x1,y1,{color:AC,w:6,head:16,g})+(lab?fade(lab*g,label('加速度',(x0+x1)/2+N[0]*26,(y0+y1)/2+N[1]*26+8,{size:22,color:AC,anchor:'middle',weight:700})):'');
}
function slopeScene(t,{g=1,v=1,a=0,lab=0,cartG=1}={}){
 const s=pos(t);
 return fade(g,hill()+cartBody(s,{g:cartG})+fade(cartG,vArrow(s,vel(t),{g:v,lab})+(a?aArrow(s,{g:a,lab}):'')));
}

// ---- v-t グラフ（右）-----------------------------------------------------------------------------------
const GX0=690,TS=70,GY0=300,VS=12.5;
const X=t=>GX0+TS*t,Y=v=>GY0-VS*v;
function axesVT(g=1){
 let s=line(GX0-12,GY0,X(6.7),GY0,{color:C.dim,w:2.5})+arrow(X(6.5),GY0,X(6.8),GY0,{color:C.dim,w:2.5,head:12});
 s+=line(GX0,Y(-14),GX0,Y(13.5),{color:C.dim,w:2.5})+arrow(GX0,Y(13.5),GX0,Y(15),{color:C.dim,w:2.5,head:12});
 for(const v of [12,-12])s+=line(GX0,Y(v),X(6),Y(v),{color:C.grid,w:1.5,dash:'6 6'})+line(GX0-6,Y(v),GX0+6,Y(v),{color:C.dim,w:2})+label(v>0?'12':'−12',GX0-12,Y(v)+8,{size:22,color:VC,anchor:'end',weight:700});
 s+=label('0',GX0-12,GY0+24,{size:22,color:C.dim,anchor:'end'});
 for(const t of [3,6])s+=line(X(t),Y(12),X(t),Y(-12),{color:C.grid,w:1.5,dash:'6 6'})+line(X(t),GY0-6,X(t),GY0+6,{color:C.dim,w:2})+label(String(t),X(t)-12,GY0+28,{size:22,color:TC,anchor:'middle',weight:700});
 s+=label('v [m/s]',GX0,Y(15)-12,{size:24,color:VC,anchor:'middle',weight:700})+label('t [s]',X(6.75),GY0+34,{size:24,color:TC,anchor:'middle',weight:700});
 return fade(g,s);
}
function vtLine(t1=6,{t0=0,color=VC,w=5,g=1,dash=''}={}){
 if(t1<=t0+1e-3)return '';
 return fade(g,line(X(t0),Y(vel(t0)),X(t1),Y(vel(t1)),{color,w,dash}));
}
function graph(t1=6,{g=1,shade=null,dotEnd=1}={}){
 let s='';
 if(shade)s+=fade(shade[2],rect(X(shade[0]),Y(13),X(shade[1])-X(shade[0]),Y(-13)-Y(13),{fill:HI,fo:.12,stroke:'none',rx:0}));
 s+=axesVT()+vtLine(t1);
 if(dotEnd&&t1>0)s+=dot(X(t1),Y(vel(t1)),6,VC);
 return fade(g,s);
}
const ptGlow=(t,o)=>o>0?fade(o,dot(X(t),Y(vel(t)),11,HI)+ring(X(t),Y(vel(t)),18,{color:HI,w:3})):'';
// 傾きの三角形：(ta, v(ta)) から横へ (tb, v(ta))、縦へ (tb, v(tb))
function tri(ta,tb,{color=AC,g=1,fo=.12}={}){
 const A=[X(ta),Y(vel(ta))],B=[X(tb),Y(vel(ta))],Cc=[X(tb),Y(vel(tb))];
 return fade(g,poly([A,B,Cc],{fill:color,fo,stroke:color,sw:3}));
}
const lbl=(t,x,y,col,{g=1,size=26,anchor='middle'}={})=>fade(g,label(t,x,y,{size,color:col,anchor,weight:700}));
const LCARD={x:20,w:610,y:330};
// 日本語（label）と式（tex）を1行に並べる。parts＝['文字', {tex:'…'}, …]（日本語は tex に入れない）
function mixRow(parts,cx,y,{size=36,color=C.ink}={}){
 const ws=parts.map(q=>typeof q==='string'?textW(q,size*.9)+8:texWidth(q.tex,size,false)+8),tot=ws.reduce((a,b)=>a+b,0);
 let x=cx-tot/2,s='';
 parts.forEach((q,i)=>{s+=typeof q==='string'?label(q,x+4,y+size*.32,{size:size*.9,color:q.color??color,weight:700}):tex(q.tex,x+ws[i]/2,y,{size,auto:false});x+=ws[i];});
 return s;
}
const DV=`{\\color{${VC}}\\Delta v}\\div{\\color{${TC}}\\Delta t}`;


export const qxHsM1Acceleration2Diagrams={
 // ================= 問題アニメ：出題中（小問1〜3 共通、約6秒＋静止）=================
 // 左：坂を台車が上り、止まり、下りて戻る（紫の速度の矢印だけ）。右：v-t グラフを (0,12) から (6,−12) まで描き足す。
 // 赤の加速度の矢印・傾きの三角形・加速度の数値は出さない。
 [K+'q0']:(p)=>{
  const t=6*lin(p,.03,.93);
  return slopeScene(t)+graph(t);
 },
 // ================= S1 小問1：台車の加速度 =================
 // 1. 出題中の図を再生して静止。(0,12)、(3,0)、(6,−12) を言葉に合わせて黄の点で
 [K+'setup']:(p,ctx)=>{
  const w0=wordAt(ctx,'じゅうにメートルから'),w3=wordAt(ctx,'とまり'),w6=wordAt(ctx,'じゅうにメートルに');
  const t=p<w3?3*lin(p,.02,w3):3+3*lin(p,w3,w6);
  let s=slopeScene(t)+graph(t);
  s+=ptGlow(0,glow(p,w0,w3))+ptGlow(3,glow(p,w3,w6))+ptGlow(6,seg(p,w6,w6+.04));
  return s;
 },
 // 2. 求めるもの：台車の加速度
 [K+'goal1']:(p)=>slopeScene(6)+graph(6)+goalTag(G1,{g:seg(p,.03,.15)}),
 // 3. 傾き＝Δv÷Δt＝加速度（定義）。縦÷横＝速度の変化÷時間
 [K+'slope']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=graph(6);
  s+=card(30,120,600,110,mixRow(['傾き ＝',{tex:DV},'＝ 加速度'],330,175,{size:40}),seg(p,.03,.12),C.dim);
  s+=kindTag('定義',330,270,{g:seg(p,.08,.18)});
  s+=fade(seg(p,b,b+.08),label('縦 ÷ 横',330,345,{size:34,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,b+.12,b+.2),label('＝',330,392,{size:34,color:C.ink,anchor:'middle',weight:700})+label('速度の変化',245,440,{size:30,color:VC,anchor:'middle',weight:700})+label('÷',345,440,{size:30,color:C.ink,anchor:'middle',weight:700})+label('時間',420,440,{size:30,color:TC,anchor:'middle',weight:700}));
  s+=goalTag(G1);
  return s;
 },
 // 4. 大きな傾きの三角形（横 6・縦 −24）。縦の辺に −12−12＝−24
 [K+'dv']:(p)=>{
  let s=graph(6)+tri(0,6,{g:seg(p,.1,.25)});
  s+=lbl('横 6',X(3),Y(12)-14,TC,{g:seg(p,.2,.3)});
  s+=lbl('−12−12＝−24',X(6)-12,Y(4),AC,{g:seg(p,.55,.68),anchor:'end',size:28});
  s+=card(30,92,600,76,mixRow(['傾き ＝',{tex:DV}],330,130,{size:36}),1,C.dim);
  s+=fade(seg(p,.55,.68),tex(`{\\color{${VC}}\\Delta v}=-12-12=-24\\ \\mathrm{m/s}`,330,215,{size:36,auto:false}));
  s+=goalTag(G1);
  return s;
 },
 // 5. −24÷6＝−4。答えの札
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=graph(6)+tri(0,6)+lbl('横 6',X(3),Y(12)-14,TC)+lbl('−12−12＝−24',X(6)-12,Y(4),AC,{anchor:'end',size:28});
  s+=card(30,92,600,76,mixRow(['傾き ＝',{tex:DV}],330,130,{size:36}),1,C.dim);
  s+=tex(`{\\color{${VC}}\\Delta v}=-12-12=-24\\ \\mathrm{m/s}`,330,215,{size:36,auto:false});
  s+=fade(seg(p,.05,.18),tex(`-24\\div 6=-4`,330,272,{size:38,auto:false}));
  s+=fade(seg(p,.2,.32),tex(`{\\color{${AC}}a}=-4\\ \\mathrm{m/s^2}`,330,326,{size:40,auto:false,color:AC}));
  s+=goalTag(G1)+A1(seg(p,b,b+.08));
  return s;
 },
 // 6. 誤答 A（−2）、B（＋4）、D（−24）を1枚ずつ
 [K+'wrong1']:(p,ctx)=>{
  const b=wordAt(ctx,'プラスよん'),d=wordAt(ctx,'マイナスにじゅうよんは');
  let s=graph(6)+tri(0,6)+lbl('横 6',X(3),Y(12)-14,TC)+lbl('−12−12＝−24',X(6)-12,Y(4),AC,{anchor:'end',size:28});
  s+=card(30,92,600,76,mixRow(['傾き ＝',{tex:DV}],330,130,{size:36}),1,C.dim);
  s+=tex(`{\\color{${VC}}\\Delta v}=-12-12=-24\\ \\mathrm{m/s}`,330,215,{size:36,auto:false});
  s+=tex(`{\\color{${AC}}a}=-24\\div 6=-4\\ \\mathrm{m/s^2}`,330,272,{size:36,auto:false});
  s+=goalTag(G1)+A1(1);
  s+=wrongSeq(p,ctx,[['A','−2','−12÷6（はじめを 引いていない）'],['B','＋4','はじめ − あと の 順で 引いた',{mid:`(12-(-12))\\div 6=+4`,midSize:26}],['D','−24','時間で 割っていない']],{win:[[0,b],[b,d],[d,1]],opts:{...LCARD,y:312}});
  return s;
 },
 // 7. 小さな三角形（横 3・縦 −12）を重ねて −12÷3＝−4。坂の台車に赤の加速度の矢印（いつも同じ長さ）
 [K+'half']:(p,ctx)=>{
  const tt=6*lin(p,.35,.95);
  let s=graph(6)+tri(0,6,{g:.55})+tri(0,3,{color:HI,g:seg(p,.05,.18),fo:.18});
  s+=lbl('−12÷3＝−4',X(3)+14,Y(7),HI,{anchor:'start',size:28,g:seg(p,.2,.32)});
  s+=fade(seg(p,.35,.5),slopeScene(tt,{a:1,lab:1}));
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // ================= S2 小問2：3 s 後の加速度 =================
 // 8. 求めるもの。グラフの (3,0) に「？」。台車が坂の上で止まった所で「映像を一時停止」
 [K+'goal2']:(p,ctx)=>{
  const t=Math.min(3,cueT(ctx)*1.1);
  let s=slopeScene(t)+graph(6);
  s+=fade(seg(p,.3,.4),dot(X(3),GY0,9,HI)+label('？',X(3)+10,GY0-22,{size:40,color:HI,weight:700}));
  s+=pauseBadge({x:330,g:t>=2.99?seg(cueT(ctx),3/1.1,3/1.1+.3):0});
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 9. 止まっている＝v＝0。直線の傾きはそこでも −4：(3,0) を通る直線を黄でなぞり、前後に同じ三角形
 [K+'through']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=slopeScene(3)+graph(6)+pauseBadge({x:330});
  s+=fade(seg(p,.05,.15),label('v ＝ 0',onS(baseD(18))[0]+70,onS(baseD(18),60)[1]-20,{size:30,color:VC,weight:700}));
  const u=lin(p,b+.02,b+.3);
  s+=vtLine(1.5+3*u,{t0:1.5,color:HI,w:8,g:seg(p,b,b+.03)});
  s+=tri(2,3,{g:seg(p,b+.3,b+.4)})+tri(3,4,{g:seg(p,b+.36,b+.46)});
  s+=lbl('−4',X(3)+22,Y(2)+8,AC,{anchor:'start',size:24,g:seg(p,b+.3,b+.4)})+lbl('−4',X(4)+22,Y(-2)+8,AC,{anchor:'start',size:24,g:seg(p,b+.36,b+.46)});
  s+=goalTag(G2);
  return s;
 },
 // 10. もし加速度が 0 なら：坂の途中で止まり続ける台車（点線）に赤の×、グラフに横軸に沿う点線と赤の×
 [K+'ifzero']:(p)=>{
  const o=seg(p,.05,.18),x2=seg(p,.55,.65);
  let s=hill()+cartBody(18,{dashed:true,g:o});
  const [cx,cy]=onS(baseD(18),40);
  s+=lbl('止まり続ける？',cx+30,cy-60,C.ink,{g:o,size:26});
  s+=fade(x2,label('×',cx-16,cy+22,{size:72,color:BAD,anchor:'middle',weight:700}));
  s+=graph(3,{dotEnd:0})+vtLine(6,{t0:3,g:.3});
  s+=fade(seg(p,.25,.4),line(X(3),GY0,X(6),GY0,{color:C.ink,w:5,dash:'10 8'}));
  s+=fade(x2,label('×',X(4.6),GY0-18,{size:64,color:BAD,anchor:'middle',weight:700}));
  s+=goalTag(G2);
  return s;
 },
 // 11. t＝3：v＝0、a＝−4。答えの札
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=slopeScene(3)+graph(6)+tri(2,3,{g:.5})+tri(3,4,{g:.5});
  s+=card(30,92,600,76,tex(`t=3:\\ v=0,\\ a=-4`,330,130,{size:40}),seg(p,.05,.18),HI);
  s+=goalTag(G2)+A2(seg(p,b,b+.08));
  return s;
 },
 // 12. 誤答 A（速度 0）、C（交点）を1枚ずつ
 [K+'wrongAC2']:(p,ctx)=>{
  const c=wordAt(ctx,'スィーは');
  let s=slopeScene(3)+graph(6)+tri(2,3,{g:.5})+tri(3,4,{g:.5});
  s+=card(30,92,600,76,tex(`t=3:\\ v=0,\\ a=-4`,330,130,{size:40}),1,HI);
  s+=fade(seg(p,c,c+.05),ring(X(3),GY0,16,{color:HI,w:3}));
  s+=goalTag(G2)+A2(1);
  s+=wrongSeq(p,ctx,[['A','0（速度が 0）','v＝0 と a＝0 は 別'],['C','0（交点）','交点は v＝0 の 点、傾きは −4']],{win:[[0,c],[c,1]],opts:LCARD});
  return s;
 },
 // 13. 速度の矢印は右→左に替わり、加速度の矢印は左のまま。誤答 B
 [K+'wrongB2']:(p,ctx)=>{
  const t=Math.min(6,cueT(ctx)*1.0);
  let s=graph(6)+slopeScene(t,{a:1,lab:1,g:1-seg(p,.55,.62)});
  const cmp=(()=>{
   let c=label('上り（0〜3 s）',200,140,{size:24,color:C.dim,anchor:'middle',weight:700})+label('下り（3〜6 s）',450,140,{size:24,color:C.dim,anchor:'middle',weight:700});
   c+=label('速度',70,198,{size:26,color:VC,weight:700})+arrow(150,190,250,190,{color:VC,w:7,head:18})+arrow(500,190,400,190,{color:VC,w:7,head:18});
   c+=label('加速度',70,262,{size:26,color:AC,weight:700})+arrow(250,254,150,254,{color:AC,w:7,head:18})+arrow(500,254,400,254,{color:AC,w:7,head:18});
   return card(30,100,580,190,c,1,C.dim);})();
  s+=fade(seg(p,.6,.68),cmp);
  s+=goalTag(G2)+A2(1);
  s+=wrongCard('B','＋4','向きが 変わるのは 速度だけ',{...LCARD,g:seg(p,.7,.78)});
  return s;
 },
 // ================= S3 小問3：3〜6 s =================
 // 14. 求めるもの。グラフの 3〜6 s を黄で塗る
 [K+'goal3']:(p)=>slopeScene(3)+graph(6,{shade:[3,6,seg(p,.3,.45)]})+goalTag(G3,{g:seg(p,.03,.15)}),
 // 15. 速さ 0、4、8、12 を紫で順に。坂を下る台車の紫の矢印が長くなる
 [K+'speeds']:(p,ctx)=>{
  const ws=['ゼロ、','よん、','ハチ、','じゅうにと'].map(w=>wordAt(ctx,w));
  const t=3+3*lin(p,ws[0],ws[3]+.04);
  let s=slopeScene(t)+graph(6,{shade:[3,6,1]});
  [0,4,8,12].forEach((v,k)=>{const tt=3+k,o=seg(p,ws[k]-.01,ws[k]+.03);s+=fade(o,dot(X(tt),Y(vel(tt)),7,VC)+label(String(v),X(tt)+14,Y(vel(tt))-12,{size:28,color:VC,weight:700}));});
  s+=fade(seg(p,.02,.1),label('速さ',X(6)+26,Y(-6),{size:24,color:VC,weight:700}));
  s+=goalTag(G3);
  return s;
 },
 // 16. 速度も加速度も左向き → 速くなる。答えの札
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  const t=4.5,sp=pos(t),d=baseD(sp);
  let s=graph(6,{shade:[3,6,1]});
  [0,4,8,12].forEach((v,k)=>{const tt=3+k;s+=dot(X(tt),Y(vel(tt)),7,VC)+label(String(v),X(tt)+14,Y(vel(tt))-12,{size:28,color:VC,weight:700});});
  s+=slopeScene(t,{a:seg(p,.05,.15),lab:1});
  const [bx,by]=onS(d-40,172),[bx2,by2]=onS(d+30,52);
  const g=seg(p,.25,.35);
  s+=fade(g,`<g transform="translate(${((bx+bx2)/2).toFixed(1)} ${((by+by2)/2).toFixed(1)}) rotate(-26)"><rect x="-110" y="-72" width="220" height="144" rx="12" fill="${HI}" fill-opacity=".08" stroke="${HI}" stroke-width="3"/></g>`);
  s+=lbl('向きが 同じ → 速くなる',330,106,HI,{g:seg(p,.3,.4),size:30});
  s+=goalTag(G3)+A3(seg(p,b,b+.08));
  return s;
 },
 // 17. 誤答 A（a が負）、C（v が負）を1枚ずつ
 [K+'wrongAC3']:(p,ctx)=>{
  const c=wordAt(ctx,'スィーは');
  let s=graph(6,{shade:[3,6,1]});
  [0,4,8,12].forEach((v,k)=>{const tt=3+k;s+=dot(X(tt),Y(vel(tt)),7,VC)+label(String(v),X(tt)+14,Y(vel(tt))-12,{size:28,color:VC,weight:700});});
  s+=slopeScene(4.5,{a:1,lab:1});
  s+=goalTag(G3)+A3(1);
  s+=wrongSeq(p,ctx,[['A','遅くなる（a が負）','a の 符号だけで 決めた'],['C','遅くなる（v が負）','負は 逆向き']],{win:[[0,c],[c,1]],opts:LCARD});
  return s;
 },
 // 18. 誤答 D（速さは変わらない）。直線の傾きを黄でなぞる
 [K+'wrongD3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=graph(6,{shade:[3,6,1-seg(p,b,b+.06)]});
  s+=slopeScene(4.5,{a:1,lab:1});
  s+=vtLine(6*lin(p,b+.02,b+.3),{color:HI,w:8,g:seg(p,b,b+.03)});
  s+=lbl('傾き −4（どこでも 同じ）',X(3.6),Y(-12)+46,HI,{g:seg(p,b+.3,b+.38),size:26});
  s+=goalTag(G3)+A3(1);
  s+=wrongCard('D','速さは 変わらない','一定なのは 傾き（変わり方）',{...LCARD,g:seg(p,.03,.1)});
  return s;
 },
 // ================= S4 まとめ =================
 // 19. 0〜3 s：速度は右、加速度は左 → 遅くなる
 [K+'upward']:(p)=>{
  let s=graph(6,{shade:[0,3,seg(p,.05,.18)]});
  s+=slopeScene(1.5,{a:1,lab:1});
  s+=lbl('向きが 逆 → 遅くなる',330,140,HI,{g:seg(p,.55,.65),size:30});
  return s;
 },
 // 20. 4通りの表を黄で囲む
 [K+'table']:(p)=>{
  const rows=[[1,1,'速く'],[1,-1,'遅く'],[-1,-1,'速く'],[-1,1,'遅く']];
  let s=label('速度 v',420,120,{size:28,color:VC,anchor:'middle',weight:700})+label('加速度 a',640,120,{size:28,color:AC,anchor:'middle',weight:700})+label('速さは',860,120,{size:28,color:C.ink,anchor:'middle',weight:700});
  rows.forEach(([v,a,r],i)=>{const y=180+i*78,o=seg(p,.05+i*.12,.15+i*.12);
   const ar=(cx,d,col)=>arrow(cx-55*d,y-8,cx+55*d,y-8,{color:col,w:7,head:18});
   s+=fade(o,ar(420,v,VC)+ar(640,a,AC)+label(r,860,y+2,{size:32,color:r==='速く'?QC.F:C.dim,anchor:'middle',weight:700})+label(v===a?'同じ向き':'逆向き',1040,y+2,{size:24,color:C.dim,anchor:'middle',weight:700}));});
  s+=fade(seg(p,.6,.72),rect(300,84,860,410,{fill:HI,fo:.05,stroke:HI,sw:4,rx:16}));
  s+=answerRow([[1,'C','−4 m/s²'],[2,'D','−4 m/s²'],[3,'B','速くなる']],{g:seg(p,.75,.88),size:22});
  return card(300,84,860,410,'',1,C.dim)+s;
 },
};

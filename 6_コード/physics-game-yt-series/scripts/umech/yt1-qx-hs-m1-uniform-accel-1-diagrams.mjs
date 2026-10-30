// 問題編 解説「v-t グラフの面積で、行って戻る」(ys-qx-hs-m1-uniform-accel-1) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/103_等加速度運動.md の q-hs-m1-uniform-accel-1（解説 18 行）。
// 配置：左に v-t グラフ（0〜7 s）、右に式の枠・数直線・誤答カード。札（求めるもの・答え・誤答）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 色（01_共通の約束）：変位・面積・数直線 水色、速度 v 紫、加速度 a 赤、時間 t 金、強調 黄、横軸より下の面積 赤の斜線。
import {C,clamp,seg,fade,move,label,line,rect,dot,draw,arrow,axes,tex,poly} from './anim.mjs';
import {QC,card,goalTag,answerTag,wrongSeq,kindTag,sentWin} from './yt1-qx-common.mjs';

const K='qx-hs-m1-uniform-accel-1:';
const G1='2 s 後の速度',G2='0〜5 s の変位',G3='0〜7 s の変位と道のり';
const A1=g=>answerTag(1,'C','6 m/s',{g}),A2=g=>answerTag(2,'D','24 m',{g}),A3=g=>answerTag(3,'A','変位 16 m、道のり 32 m',{g});
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,...o});

// ---- v-t グラフ ---------------------------------------------------------------------------------
const AX={x:120,y:480,w:600,h:330,xmin:0,xmax:7.6,ymin:-5.5,ymax:8};
const A=axes({...AX,xlabel:'t [s]',ylabel:'速度 v [m/s]',xticks:[],yticks:[],xcolor:QC.t,ycolor:QC.v});
const X=A.X,Y=A.Y,O=Y(0);
const vOf=t=>t<2?3*t:t<5?6:-4;
const P1=[[X(0),Y(0)],[X(2),Y(6)]],P2=[[X(2),Y(6)],[X(5),Y(6)]],P3=[[X(5),Y(-4)],[X(7),Y(-4)]];
function frame(g=1,{q=1,qhi=0,six=0}={}){
 let s=A.svg;
 for(let k=1;k<=7;k++){const up=k>=5;
  s+=line(X(k),O-6,X(k),O+6,{color:C.dim})+label(String(k),k===5?X(k)-12:X(k),up?O-14:O+32,{size:22,color:QC.t,anchor:'middle'});}
 s+=label('0',X(0)-14,O+8,{size:22,color:QC.v,anchor:'end'});
 s+=line(X(0)-6,Y(-4),X(0)+6,Y(-4),{color:C.dim})+label('−4',X(0)-14,Y(-4)+8,{size:22,color:QC.v,anchor:'end'});
 if(q){
  s+=fade(q,line(X(0),Y(6),X(2),Y(6),{color:C.faint,w:2,dash:'6 6'})+line(X(0)-6,Y(6),X(0)+6,Y(6),{color:C.dim}));
  s+=fade(q*(1-six),label('？',X(0)-14,Y(6)+9,{size:28,color:qhi?C.hi:QC.v,anchor:'end',weight:700}));
  s+=fade(q*six,label('6',X(0)-14,Y(6)+9,{size:28,color:QC.v,anchor:'end',weight:700}));
  if(qhi)s+=fade(qhi,rect(X(0)-52,Y(6)-26,46,46,{fill:C.hi,fo:.12,stroke:C.hi,sw:3,rx:10}));
 }
 return fade(g,s);
}
// d＝描いた割合（3区間）、hl＝黄で光らせる強さ
function vline({d=[1,1,1],hl=[0,0,0],g=1}={}){
 let s='';
 const one=(pts,u,h)=>draw(pts,u,{color:QC.v,w:6})+(h>0?fade(h,draw(pts,u,{color:C.hi,w:9})):'');
 s+=one(P1,d[0],hl[0])+one(P2,d[1],hl[1]);
 if(d[2]>0)s+=line(X(5),Y(6),X(5),Y(-4),{color:QC.v,w:2,dash:'4 8',opacity:clamp(d[2]*4)});
 s+=one(P3,d[2],hl[2]);
 return fade(g,s);
}
const hatchDef=`<defs><pattern id="qxua1h" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="14" stroke="${QC.a}" stroke-width="4"/></pattern></defs>`;
const triArea=(g=1,c=QC.x,fo=.32)=>fade(g,poly([[X(0),O],[X(2),Y(6)],[X(2),O]],{fill:c,fo,stroke:c,sw:2}));
const rectArea=(g=1,c=QC.x,fo=.32)=>fade(g,poly([[X(2),O],[X(2),Y(6)],[X(5),Y(6)],[X(5),O]],{fill:c,fo,stroke:c,sw:2}));
const negArea=(g=1)=>fade(g,hatchDef+rect(X(5),O,X(7)-X(5),Y(-4)-O,{fill:QC.a,fo:.12,stroke:QC.a,sw:2,rx:0})+`<rect x="${X(5)}" y="${O}" width="${X(7)-X(5)}" height="${Y(-4)-O}" fill="url(#qxua1h)" opacity=".55"/>`);
// 基本の絵：軸＋折れ線（6 が分かった後は six＝1）
const pic=(o={})=>frame(1,o)+vline(o);

// 右の枠
const RX=815,RW=375,RC=RX+RW/2;
const rpanel=(y,h,inner,g=1,stroke=C.faint)=>card(RX,y,RW,h,inner,g,stroke);
const WOPT={x:RX,w:RW,y:250,size:28,whySize:22};
const WOPT3={x:RX,w:RW,y:380,size:26,whySize:22};

// ---- 数直線（小問3）：0〜24 m ----------------------------------------------------------------------
const NX=m=>845+m*13.2,NY=230;
function nline(g=1){
 let s=line(NX(-1.5),NY,NX(25.5),NY,{color:C.dim,w:3})+arrow(NX(25),NY,NX(26.5),NY,{color:C.dim,w:3,head:12});
 for(const m of [0,8,16,24])s+=line(NX(m),NY-8,NX(m),NY+8,{color:C.dim,w:2})+label(String(m),NX(m),NY+34,{size:22,color:QC.x,anchor:'middle'});
 s+=label('x [m]',NX(24),NY+66,{size:22,color:QC.x,anchor:'middle'});
 return fade(g,s);
}
function trips({a1=1,a2=1,disp=0,path=0,turn=0,labs=1}={}){
 let s='';
 s+=arrow(NX(0),NY-80,NX(24),NY-80,{color:QC.x,w:5,head:16,g:a1});
 if(labs)s+=fade(seg(a1,.7,1),label('＋24',NX(12),NY-94,{size:24,color:QC.x,anchor:'middle',weight:700}));
 s+=fade(clamp(a2*5),line(NX(24),NY-80,NX(24),NY-40,{color:C.faint,w:2,dash:'4 6'}));
 s+=arrow(NX(24),NY-40,NX(16),NY-40,{color:QC.a,w:5,head:16,g:a2});
 if(labs)s+=fade(seg(a2,.7,1),label('−8',NX(20),NY-50,{size:24,color:QC.a,anchor:'middle',weight:700}));
 if(path)s+=fade(path,line(NX(0),NY-80,NX(24),NY-80,{color:C.hi,w:10,opacity:.55})+line(NX(24),NY-80,NX(24),NY-40,{color:C.hi,w:10,opacity:.55})+line(NX(24),NY-40,NX(16),NY-40,{color:C.hi,w:10,opacity:.55}));
 if(disp)s+=arrow(NX(0),NY+96,NX(16),NY+96,{color:C.hi,w:6,head:18,g:disp})+fade(seg(disp,.6,1),line(NX(0),NY+86,NX(0),NY+106,{color:C.hi,w:3}));
 if(turn)s+=fade(turn,dot(NX(24),NY-80,11,C.hi)+label('向きを 変えた 所',NX(24)-6,NY-112,{size:22,color:C.hi,anchor:'end',weight:700}));
 return s;
}

export const qxHsM1UA1Diagrams={
 // ================= 問題アニメ：出題中（約5秒＋静止）=================
 // 軸 → 0〜2 s の右上がり → 2〜5 s の水平 → 5〜7 s の −4。縦軸の目盛りは 0 と −4 だけ、2 s の高さは「？」。面積・数値は出さない。
 [K+'q0']:(p)=>{
  let s=frame(seg(p,0,.1),{q:seg(p,.32,.4)});
  s+=vline({d:[lin(p,.1,.36),lin(p,.4,.64),lin(p,.68,.94)]});
  return move(180,0,s);
 },
 // ================= S1 小問1 =================
 // 1. グラフを区間ごとに描き、言葉に合わせて3つの区間を順に黄で光らせる
 [K+'setup']:(p)=>{
  const w=[[0,.36],[.36,.6],[.6,.97]];
  const d=w.map(([a,b])=>lin(p,a+.02,a+.6*(b-a)));
  const hl=w.map(([a,b])=>seg(p,a+.02,a+.08)*(1-seg(p,b,b+.06)));
  return frame(1)+vline({d,hl});
 },
 // 2. 求めるもの：2 s 後の速度。「？」を黄で囲む
 [K+'goal1']:(p)=>pic({qhi:seg(p,.2,.35)})+goalTag(G1,{g:seg(p,.03,.15)}),
 // 3. 第1式と「前提：加速度一定」。at を赤（a）と金（t）で
 [K+'eq1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=pic({qhi:1})+goalTag(G1);
  s+=rpanel(110,210,T('v=v_0+at',RC,180,48)+fade(seg(p,b,b+.08),label('毎秒 a ずつ、t 秒ぶん',RC,272,{size:26,color:C.ink,anchor:'middle',weight:700})),seg(p,.05,.15),C.hi);
  s+=kindTag('前提',RC,370,{text:'加速度一定',g:seg(p,.18,.28)});
  return s;
 },
 // 4. 0、3、2 を一つずつ入れる → 0＋3×2＝6。直線の上に 0、3、6。「？」→「6」。答え C
 [K+'sub1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  const st=[seg(p,.05,.1),seg(p,.15,.2),seg(p,.25,.3),seg(p,.36,.42)];
  const six=seg(p,.45,.52);
  let s=pic({six,qhi:1-six});
  const sub=['v=v_0+at','v={\\color{#ffe28a}0}+at','v=0+{\\color{#ffe28a}3}\\,t','v=0+3\\times{\\color{#ffe28a}2}'];
  const k=st.filter(x=>x>.5).length;
  let eq=T(sub[Math.min(k,3)],RC,165,44);
  eq+=fade(st[3],T('=6\\ \\mathrm{m/s}',RC+20,245,44));
  s+=rpanel(110,190,eq,1,C.hi);
  [[0,0],[1,3],[2,6]].forEach(([t,v],i)=>{s+=fade(seg(p,.1+i*.1,.16+i*.1),dot(X(t),Y(v),7,QC.v)+label(String(v),X(t)+(i?-6:28),Y(v)-(i?16:4),{size:26,color:QC.v,anchor:i?'end':'start',weight:700}));});
  s+=goalTag(G1)+A1(seg(p,b,b+.08));
  return s;
 },
 // 5. 誤答 A・B・D を1枚ずつ
 [K+'wrong1']:(p,ctx)=>pic({six:1,q:1})+goalTag(G1)+A1(1)
  +wrongSeq(p,ctx,[['A','1.5 m/s','3÷2（単位が m/s³）'],['B','5 m/s','3＋2（単位の違う量を足した）'],['D','3 m/s','加速度を速度とした']],{opts:WOPT}),
 // ================= S2 小問2 =================
 // 6. 求めるもの：0〜5 s の変位。0〜5 s を金の括弧で
 [K+'goal2']:(p)=>{
  let s=pic({six:1})+goalTag(G2,{g:seg(p,.03,.15)});
  s+=fade(seg(p,.3,.45),line(X(0),O+52,X(5),O+52,{color:QC.t,w:4})+line(X(0),O+42,X(0),O+62,{color:QC.t,w:4})+line(X(5),O+42,X(5),O+62,{color:QC.t,w:4})+label('0〜5 s',X(2.5),O+90,{size:24,color:QC.t,anchor:'middle',weight:700}));
  return s;
 },
 // 7. 面積＝変位。短冊に分け、1本を光らせて v×Δt、短冊を消す
 [K+'area']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=pic({six:1})+goalTag(G2);
  s+=rpanel(110,90,label('面積 ＝ 変位',RC,168,{size:34,color:QC.x,anchor:'middle',weight:700}),seg(p,.05,.15),QC.x);
  const n=20,dt=5/n,gS=seg(p,b,b+.1)*(1-seg(p,.9,.97));
  let st='';for(let i=0;i<n;i++){const a=i*dt,v=vOf(a+dt/2);st+=fade(seg(p,b+i*.008,b+.04+i*.008),rect(X(a),Y(v),X(a+dt)-X(a),O-Y(v),{fill:QC.x,fo:.3,stroke:QC.x,sw:1.5,rx:0}));}
  const hi=11,ha=hi*dt,hv=vOf(ha+dt/2),gh=seg(p,b+.22,b+.3)*(1-seg(p,.9,.97));
  st+=fade(gh,rect(X(ha),Y(hv),X(ha+dt)-X(ha),O-Y(hv),{fill:C.hi,fo:.6,stroke:C.hi,sw:3,rx:0}));
  s+=fade(gS,st);
  s+=fade(gh,arrow(X(ha+dt/2)+60,Y(hv)-70,X(ha+dt/2)+6,Y(hv)-8,{color:C.hi,w:4,head:14})+T('v\\times\\Delta t',X(ha+dt/2)+110,Y(hv)-84,34));
  return s;
 },
 // 8. 三角形 ½×2×6＝6、長方形 6×3＝18
 [K+'parts']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  const g1=seg(p,.05,.15),g2=seg(p,b,b+.1);
  let s=frame(1,{six:1})+triArea(g1)+rectArea(g2)+vline();
  s+=fade(g1,label('6',X(1.4),O-30,{size:30,color:C.ink,anchor:'middle',weight:700}))+fade(g2,label('18',X(3.5),Y(3)+10,{size:34,color:C.ink,anchor:'middle',weight:700}));
  s+=rpanel(110,200,fade(g1,T('\\tfrac12\\times2\\times6=6',RC,175,40))+fade(g2,T('6\\times3=18',RC,260,40)),1,QC.x);
  s+=goalTag(G2);
  return s;
 },
 // 9. 6＋18＝24。答え D
 [K+'sum2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=frame(1,{six:1})+triArea()+rectArea()+vline();
  s+=label('6',X(1.4),O-30,{size:30,color:C.ink,anchor:'middle',weight:700})+label('18',X(3.5),Y(3)+10,{size:34,color:C.ink,anchor:'middle',weight:700});
  s+=rpanel(110,280,T('\\tfrac12\\times2\\times6=6',RC,175,40)+T('6\\times3=18',RC,250,40)+fade(seg(p,.05,.15),T('6+18=24\\ \\mathrm{m}',RC,335,42)),1,QC.x);
  s+=goalTag(G2)+A2(seg(p,b,b+.08));
  return s;
 },
 // 10. 誤答 A・B・C を1枚ずつ。A のあいだ、0〜2 s を長方形にした図と三角形との差を黄で
 [K+'wrong2']:(p,ctx)=>{
  const W=[[0,.36],[.36,.64],[.64,1]];
  const gA=seg(p,.02,.08)*(1-seg(p,.32,.36));
  let s=frame(1,{six:1})+triArea()+rectArea()+vline();
  s+=fade(gA,rect(X(0),Y(6),X(2)-X(0),O-Y(6),{fill:'none',fo:0,stroke:C.hi,sw:3,rx:0})+poly([[X(0),O],[X(0),Y(6)],[X(2),Y(6)]],{fill:C.hi,fo:.35,stroke:C.hi,sw:2}));
  s+=goalTag(G2)+A2(1);
  s+=wrongSeq(p,ctx,[['A','30 m','0〜2 s も 6 m/s とした'],['B','18 m','三角形を落とした'],['C','6 m','高さ（速度）を変位とした']],{win:W,opts:WOPT});
  return s;
 },
 // ================= S3 小問3 =================
 // 11. 求めるもの：0〜7 s の変位と道のり
 [K+'goal3']:(p)=>pic({six:1})+goalTag(G3,{g:seg(p,.03,.15)}),
 // 12. 横軸の下の長方形 −4×2＝−8
 [K+'neg']:(p)=>{
  const g=seg(p,.35,.5);
  let s=frame(1,{six:1})+negArea(g)+vline({hl:[0,0,seg(p,.05,.15)*(1-seg(p,.3,.4))]});
  s+=fade(g,label('−8',X(6),Y(-2)+10,{size:34,color:C.ink,anchor:'middle',weight:700}));
  s+=rpanel(110,110,T('-4\\times2=-8',RC,175,42),seg(p,.4,.5),QC.a);
  s+=goalTag(G3);
  return s;
 },
 // 13. 数直線：右へ 24、左へ 8、始点から終点へ「変位 16 m」
 [K+'disp']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=frame(1,{six:1})+triArea(1,QC.x,.25)+rectArea(1,QC.x,.25)+negArea(1)+vline();
  s+=nline(seg(p,.02,.1));
  s+=trips({a1:seg(p,.08,.2),a2:seg(p,.22,.36),disp:seg(p,b+.15,b+.3)});
  s+=fade(seg(p,b+.28,b+.36),label('変位 16 m',NX(8),NY+136,{size:28,color:C.hi,anchor:'middle',weight:700})+T('24-8=16',NX(8),NY+180,32));
  s+=goalTag(G3);
  return s;
 },
 // 14. 通った線を全部黄でなぞる「道のり 32 m」
 [K+'path']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=frame(1,{six:1})+triArea(1,QC.x,.25)+rectArea(1,QC.x,.25)+negArea(1)+vline();
  s+=nline()+trips({path:seg(p,.08,.25),disp:1-seg(p,.02,.08)});
  s+=fade(1-seg(p,.02,.08),label('変位 16 m',NX(8),NY+136,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,b+.1,b+.2),label('道のり 32 m',NX(12),NY+136,{size:28,color:C.hi,anchor:'middle',weight:700})+T('24+8=32',NX(12),NY+180,32));
  s+=goalTag(G3);
  return s;
 },
 // 15. 「16」と「32」を並べる。答え A
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55;
  let s=frame(1,{six:1})+triArea(1,QC.x,.25)+rectArea(1,QC.x,.25)+negArea(1)+vline();
  s+=nline()+trips({disp:1,path:.6});
  s+=label('変位 16 m',NX(5),NY+140,{size:28,color:C.hi,anchor:'middle',weight:700})+label('道のり 32 m',NX(19),NY+140,{size:28,color:C.hi,anchor:'middle',weight:700});
  s+=goalTag(G3)+A3(seg(p,b,b+.08));
  return s;
 },
 // 16. 誤答 B・C・D を1枚ずつ（数直線の下）
 [K+'wrong3']:(p,ctx)=>{
  let s=frame(1,{six:1})+triArea(1,QC.x,.25)+rectArea(1,QC.x,.25)+negArea(1)+vline();
  s+=nline()+trips({disp:1,path:.6});
  s+=goalTag(G3)+A3(1);
  s+=wrongSeq(p,ctx,[['B','32 m・16 m','変位と道のりを入れ替えた'],['C','32 m・32 m','変位でも下を足した'],['D','16 m・16 m','道のりでも下を引いた']],{opts:WOPT3});
  return s;
 },
 // 17. 折り返し点（24 m）を黄で光らせる
 [K+'turn']:(p)=>{
  let s=frame(1,{six:1})+triArea(1,QC.x,.25)+rectArea(1,QC.x,.25)+negArea(1)+vline({hl:[0,0,seg(p,.3,.45)]});
  s+=nline()+trips({disp:1,turn:seg(p,.2,.35),labs:0});
  s+=fade(seg(p,.3,.45),dot(X(5),Y(6),9,C.hi));
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // ================= S4 まとめ =================
 // 18. 「高さ＝速度」「面積＝変位」。上は水色、下は赤の斜線
 [K+'sum']:(p,ctx)=>{
  const W=sentWin(ctx);
  let s=frame(1,{six:1,q:1})+triArea(seg(p,.4,.55))+rectArea(seg(p,.4,.55))+negArea(seg(p,.5,.65))+vline({hl:[seg(p,.05,.15),seg(p,.05,.15),seg(p,.05,.15)].map(x=>x*(1-seg(p,.35,.42)))});
  s+=rpanel(130,90,label('高さ ＝ 速度',RC,188,{size:34,color:QC.v,anchor:'middle',weight:700}),seg(p,.05,.15),QC.v);
  s+=rpanel(250,130,label('面積 ＝ 変位',RC,302,{size:34,color:QC.x,anchor:'middle',weight:700})+label('（横軸の下は 負）',RC,350,{size:24,color:QC.a,anchor:'middle',weight:700}),seg(p,.4,.5),QC.x);
  return s;
 },
};
function lin(p,a,b){return clamp((p-a)/Math.max(1e-6,b-a));}

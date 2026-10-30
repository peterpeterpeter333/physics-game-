// 問題編 解説「熱が入り、外へ仕事をする」(ys-qx-hs-t-firstlaw-1) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/204_熱力学第一法則.md の q-hs-t-firstlaw-1（解説 18 行）。
// 色（正本の指定）：熱 Q の矢印 橙、仕事 W の矢印 薄い橙、内部エネルギー U 橙（濃いめ）、温度 T 黄緑、強調 黄、誤り 赤。
//   単元動画（U 薄い橙・W 濃い橙）と仕事・U の濃さが逆なので、符号の約束の cue で凡例を出す。
// 系の線：気体だけを白の点線で囲む。札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 2・3 問目でも使う部品（容器・矢印・温度計・W外へ）は export する。
import {C,seg,lin,fade,label,line,rect,arrow,tex,texWidth,clamp,mix} from './anim.mjs';
import {gasBox,thermo} from './yt1-hs-t-firstlaw-1-diagrams.mjs';
import {QX,card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,legend,note,cueT,tAt,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-hs-t-firstlaw-1:';
// ---- 色と記号 --------------------------------------------------------------------------------------
export const QH=C.E, WL='#ffd6a0', UO='#ff9440', TG='#b8f06a', PG=C.F, VA=C.x, OK=C.F, BAD='#ff6b6b';
export const Qs=`{\\color{${QH}}Q}`, Ws=`{\\color{${WL}}W}`, dUs=`\\Delta {\\color{${UO}}U}`, Us=`{\\color{${UO}}U}`, dTs=`\\Delta {\\color{${TG}}T}`;
export const JJ='\\ \\mathrm{J}', KK='\\ \\mathrm{K}';
export const T2=(src,x,y,o={})=>tex(src,x,y,{size:46,auto:false,...o});
// W外へ（tex に日本語を入れないので「外へ」は label で添える）。x は左端（anchor:'start'）か中央。
export function wOut(x,y,{size=44,anchor='start',color=WL}={}){
 const w=texWidth(`{\\color{${color}}W}`,size,false)+size*.62*2+4,l=anchor==='middle'?x-w/2:anchor==='end'?x-w:x;
 return tex(`{\\color{${color}}W}`,l,y,{size,anchor:'start',auto:false})+label('外へ',l+texWidth(`{\\color{${color}}W}`,size,false)+2,y+size*.42,{size:Math.round(size*.62),color,weight:700});
}
export const wOutW=(size=44)=>texWidth(`{\\color{${WL}}W}`,size,false)+size*.62*2+4;
// TeX の並び（'@' は W外へ）を左から置く
export function row(parts,x,y,{size=44,anchor='middle',g=1}={}){
 const ws=parts.map(q=>q==='@'?wOutW(size):texWidth(q,size,false)),gap=size*.1,W=ws.reduce((a,b)=>a+b,0)+gap*(parts.length-1);
 let cx=anchor==='middle'?x-W/2:anchor==='end'?x-W:x,s='';
 parts.forEach((q,i)=>{s+=q==='@'?wOut(cx,y,{size}):tex(q,cx,y,{size,anchor:'start',auto:false});cx+=ws[i]+gap;});
 return fade(g,s);
}
// ナレーションの読みの中で、mk が読まれ始める所（cue の進み 0〜1）
export function markAt(ctx,mk,fb=.5){
 const r=(ctx?.cue?.reading??'').replace(/[\s。]/g,''),i=r.indexOf(mk.replace(/\s/g,''));
 return i<0?fb:i/r.length*voiceEnd(ctx);
}
const s2=(ctx,fb=.5)=>{const W=sentWin(ctx);return W[1]?W[1][0]:fb;};
// 2文目の中の位置：W＋d（d は 2文目を 0.5 とみたときの割合）を、2文目の実際の長さに合わせて伸び縮みさせる
export function ws(ctx,d){const W=s2(ctx),E=Math.max(voiceEnd(ctx),W+.1);return W+(E-W)*Math.min(1,d/.5);}
// ---- 容器（左が閉じた横向きの筒、右にピストンと取っ手）---------------------------------------------
export const PT={x0:150,yc:300,h:180,rod:260};
export function pot({xp=430,t=0,sys=1,g=1,yc=PT.yc,h=PT.h,x0=PT.x0,len=450,n=16,seed=4,rod=PT.rod}={}){
 const top=yc-h/2,bot=yc+h/2;let s='';
 s+=gasBox({x:x0,y:top,w:xp-x0,h,n,dist:200*t,seed,frame:true,stroke:'none'});
 s+=`<path d="M${x0+len} ${top-5} L${x0-5} ${top-5} L${x0-5} ${bot+5} L${x0+len} ${bot+5}" fill="none" stroke="${C.dim}" stroke-width="5"/>`;
 s+=rect(xp,top,22,h,{fill:'#7d8aa3',fo:1,stroke:'#c9d2e3',sw:2,rx:3});
 s+=rect(xp+22,yc-10,rod-22,20,{fill:'#7d8aa3',fo:1,stroke:'none',rx:3});
 s+=rect(xp+rod,yc-50,18,100,{fill:'#7d8aa3',fo:1,stroke:'#c9d2e3',sw:2,rx:4});
 if(sys)s+=fade(sys,rect(x0+9,top+9,xp-x0-18,h-18,{fill:'none',fo:0,stroke:C.ink,sw:2.5,rx:8}).replace('<rect','<rect stroke-dasharray="4 8"'));
 return fade(g,s);
}
export const handle=(xp,rod=PT.rod)=>xp+rod+18;
export const flameAt=(x,y,{g=1,s=1}={})=>fade(g,`<path d="M${x-30*s} ${y} q${10*s} ${-40*s} ${30*s} ${-50*s} q${20*s} ${10*s} ${30*s} ${50*s} z" fill="${QH}" fill-opacity=".85"/>`+`<path d="M${x-12*s} ${y} q${6*s} ${-22*s} ${12*s} ${-28*s} q${8*s} ${8*s} ${12*s} ${28*s} z" fill="${C.hi}"/>`);
export const QA=(x,y,X,Y,o={})=>arrow(x,y,X,Y,{color:QH,w:10,head:24,...o});
export const WA=(x,y,X,Y,o={})=>arrow(x,y,X,Y,{color:WL,w:10,head:24,...o});
// 温度計と「？」
export function thermoQ({x=1090,top=170,bot=380,level=90,q=1,g=1,col=TG}={}){
 return fade(g,thermo(x,top,bot,level,{color:col})+fade(q,label('？',x+40,top+70,{size:44,color:col,weight:700}))+label('温度',x,bot+66,{size:24,color:col,anchor:'middle',weight:700}));
}
// ---- 出題中の図（小問1・2）：t は秒。xp は 0〜4 秒で 430、4〜6 秒で 430→510 ---------------------------
const HX=300;
function scene1({t=8,gSys=1,gQ=1,gW=1,xp=510,qLab=null,wLab=null,mol=1,th=1}={}){
 let s=pot({xp,t,sys:gSys});
 s+=fade(mol,label('単原子分子 2.0 mol',PT.x0+10,PT.yc-PT.h/2-22,{size:28,color:C.ink,weight:700}));
 s+=flameAt(HX,505,{g:gQ,s:.8})+fade(gQ,QA(HX,462,HX,PT.yc+40));
 s+=fade(gQ,qLab??label('熱 250 J',HX+34,448,{size:30,color:QH,weight:700}));
 const hx=handle(xp);
 s+=fade(gW,WA(hx+16,PT.yc,hx+150,PT.yc));
 s+=fade(gW,wLab??label('仕事 100 J（外へ）',hx+140,PT.yc-40,{size:28,color:WL,anchor:'middle',weight:700}));
 if(th)s+=thermoQ({g:th});
 return s;
}
const xpAt=t=>t<4?430:mix(430,510,clamp((t-4)/2));
// ---- 小問3 の図：押し込まれるピストン、内向きの仕事 80 J・外向きの熱 80 J -----------------------------
function scene3({t=6,xp=450,gW=1,gQ=1,wLab=null,qLab=null,th=1,level=90,q=1,mol=1}={}){
 let s=pot({xp,t});
 if(mol)s+=label('同じ 気体',PT.x0+10,PT.yc-PT.h/2-22,{size:28,color:C.ink,weight:700});
 const hx=handle(xp);
 s+=fade(gW,WA(hx+150,PT.yc,hx+16,PT.yc));
 s+=fade(gW,wLab??label('仕事 80 J',hx+110,PT.yc-40,{size:30,color:WL,anchor:'middle',weight:700}));
 s+=fade(gQ,QA(HX,PT.yc+40,HX,470));
 s+=fade(gQ,qLab??label('熱 80 J',HX+34,448,{size:30,color:QH,weight:700}));
 if(th)s+=thermoQ({g:th,level,q});
 return s;
}
const xp3=t=>mix(530,450,clamp((t-.8)/2.4));
// 符号つきの札（矢印の横）
const signLab=(src,x,y,{g=1,size=40}={})=>fade(g,tex(src,x,y,{size,anchor:'start',auto:false}));
const minusHi=`{\\color{${C.hi}}-}`;
// ---- 式の場面の小道具 ------------------------------------------------------------------------------
const eqCard=(inner,{x=150,y=96,w=900,h=110,g=1,col=C.hi}={})=>card(x,y,w,h,inner,g,col);
function uBar(val,{x=980,base=430,k=1.2,g=1,lab=''}={}){
 const h=val*k;
 return fade(g,rect(x-60,base-h,120,h,{fill:UO,fo:.55,stroke:UO,sw:2.5,rx:6})+line(x-100,base,x+100,base,{color:C.dim,w:2})+(lab?label(lab,x,base-h-16,{size:30,color:UO,anchor:'middle',weight:700}):''));
}
const G1='ΔU',G2='ΔT',G3='温度の変化';
const A1=g=>answerTag(1,'B','150 J',{g}),A2=g=>answerTag(2,'A','約6.0 K',{g}),A3=g=>answerTag(3,'D','変わらない',{g});
// (3/2)nR を動かす式（ΔU＝(3/2)nRΔT → ΔT＝ΔU÷(3/2)nR）
const B32=hi=>`{\\color{${hi?C.hi:C.ink}}\\tfrac{3}{2}nR}`;
function moveEq(u,{y=250,hi=0,g=1}={}){
 const sz=52,P=(a,b)=>[mix(a[0],b[0],u),mix(a[1],b[1],u)];
 const a=P([420,y],[660,y-48]),b=P([610,y],[660,y+52]),c=P([740,y],[430,y]);
 let s=tex(dUs,a[0],a[1],{size:sz,auto:false})+tex('=',520,y,{size:sz,auto:false});
 s+=tex(B32(hi),b[0],b[1],{size:sz,auto:false})+tex(dTs,c[0],c[1],{size:sz,auto:false});
 s+=fade(seg(u,.7,1),line(590,y+2,730,y+2,{color:C.ink,w:3.5}));
 return fade(g,s);
}

export const qxHsTFirstlaw1Diagrams={
 // ================= 問題アニメ：出題（小問1・2）約6秒＋静止 =================
 // 0〜2 秒 容器と系の線、2〜4 秒 熱 250 J（下から内向き）、4〜6 秒 ピストンが右へ・仕事 100 J（外へ）。温度計は「？」。
 // 符号つきの Q・W、ΔU・温度変化の値は描かない。
 [K+'q0']:(p,ctx)=>{
  const t=cueT(ctx);
  return scene1({t,xp:xpAt(t),gSys:clamp(t/1.2),mol:clamp((t-.4)/1),gQ:clamp((t-2)/1),gW:clamp((t-4.6)/1),th:clamp((t-.6)/1)});
 },
 // ================= 問題アニメ：小問3（約4秒＋静止）=================
 [K+'q3']:(p,ctx)=>{
  const t=cueT(ctx);
  return scene3({t,xp:xp3(t),gW:clamp((t-.3)/.8),gQ:clamp((t-1.8)/.8)});
 },
 // ================= S1 小問1 =================
 // 1. 出題中の図で始める。求めるもの：ΔU
 [K+'goal1']:(p,ctx)=>scene1({t:6+cueT(ctx)})+goalTag(G1,{g:seg(p,.05,.2)}),
 // 2. 符号の約束：内向きに「＋」。Q・W の2枚の札と「定義」。凡例
 [K+'sign']:(p,ctx)=>{
  const t=6+tAt(ctx,K+'goal1'),W=s2(ctx);
  let s=scene1({t,th:1-seg(p,0,.1)});
  s+=fade(seg(p,W,ws(ctx,.08)),label('＋',HX-40,PT.yc+60,{size:40,color:C.hi,weight:700})+label('＋',470,PT.yc-30,{size:40,color:C.hi,weight:700}));
  s+=card(300,92,300,64,label('Q：入る 熱が 正',450,135,{size:30,color:QH,anchor:'middle',weight:700}),seg(p,ws(ctx,.04),ws(ctx,.14)),QH);
  s+=card(620,92,400,64,label('W：外から された 仕事が 正',820,135,{size:26,color:WL,anchor:'middle',weight:700}),seg(p,ws(ctx,.3),ws(ctx,.4)),WL);
  s+=kindTag('定義',1090,128,{g:seg(p,ws(ctx,.45),ws(ctx,.55))});
  s+=legend([['熱 Q',QH],['仕事 W',WL],['内部エネルギー U',UO]],900,400,{g:seg(p,.02,.12),size:22,gap:8});
  s+=goalTag(G1);
  return s;
 },
 // 3. Q＝＋250、W外へ＝100 → W＝−100（− を黄で光らせる）
 [K+'val']:(p,ctx)=>{
  const t=6+tAt(ctx,K+'goal1'),W=s2(ctx),q=seg(p,.08,.2),w1=seg(p,W,ws(ctx,.08)),w2=seg(p,ws(ctx,.32),ws(ctx,.42));
  const qLab=fade(1-q,label('熱 250 J',HX+34,448,{size:30,color:QH,weight:700}))+signLab(`${Qs}=+250${JJ}`,HX+34,440,{g:q});
  const hx=handle(510);
  const wLab=fade(1-w1,label('仕事 100 J（外へ）',hx+140,PT.yc-40,{size:28,color:WL,anchor:'middle',weight:700}))
   +fade(w1*(1-w2),row(['@','=100\\ \\mathrm{J}'],hx+125,PT.yc-38,{size:38}))
   +fade(w2,tex(`${Ws}=${minusHi}100${JJ}`,hx+125,PT.yc-38,{size:40,auto:false}));
  let s=scene1({t,th:0,qLab,wLab});
  s+=fade(w2,label('向きが 外 → 負',hx+110,PT.yc+76,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=goalTag(G1);
  return s;
 },
 // 4. ΔU＝Q＋W（法則）→ 250＋(−100)（かっこを黄）→ ΔU＝150 J と橙の棒
 [K+'law']:(p,ctx)=>{
  const W=s2(ctx);
  let s=eqCard(T2(`${dUs}=${Qs}+${Ws}`,420,170,{size:54}),{x:150,y:100,w:540,h:120,g:seg(p,.03,.12)});
  s+=kindTag('法則',780,162,{g:seg(p,.1,.2)});
  const pa=`{\\color{${C.hi}}(-100)}`;
  s+=fade(seg(p,W,ws(ctx,.1)),T2(`${dUs}=250+${pa}`,420,300,{size:50}));
  s+=fade(seg(p,ws(ctx,.35),ws(ctx,.45)),T2(`${dUs}=150${JJ}`,420,400,{size:54}));
  s+=uBar(150*seg(p,ws(ctx,.4),ws(ctx,.6)),{x:960,base:440,g:seg(p,ws(ctx,.38),ws(ctx,.45)),lab:seg(p,ws(ctx,.55),ws(ctx,.6))>.5?'ΔU ＝ 150 J':''});
  s+=goalTag(G1);
  return s;
 },
 // 5. 答え B。誤答 A（2文目）
 [K+'ans1']:(p,ctx)=>{
  const W=s2(ctx);
  let s=eqCard(T2(`${dUs}=250+(-100)=150${JJ}`,600,165,{size:46}),{x:200,y:105,w:800,h:110});
  s+=goalTag(G1)+A1(seg(p,.04,.14));
  s+=wrongCard('A','350 J','外へ した 仕事を 正として 足した',{g:seg(p,W,ws(ctx,.06)),mid:'250+100=350'});
  return s;
 },
 // 6. 誤答 C、誤答 D（1枚ずつ）
 [K+'wrongCD']:(p,ctx)=>{
  const a=markAt(ctx,'ディーは');
  let s=eqCard(T2(`${dUs}=250+(-100)=150${JJ}`,600,165,{size:46}),{x:200,y:105,w:800,h:110});
  s+=goalTag(G1)+A1(1);
  s+=wrongSeq(p,ctx,[['C','−150 J','符号を 両方 逆に した',{mid:'-250+100=-150'}],['D','250 J','仕事の 出入りを 忘れた',{mid:'250+0=250'}]],{win:[[0,a],[a,1]]});
  return s;
 },
 // ================= S2 小問2 =================
 // 7. 求めるもの：ΔT。温度計（黄緑）に「？」。ΔU＝150 J は小問1 の結果
 [K+'goal2']:(p,ctx)=>{
  const t=8+cueT(ctx);
  let s=pot({xp:510,t});
  s+=label('単原子分子 2.0 mol',PT.x0+10,PT.yc-PT.h/2-22,{size:28,color:C.ink,weight:700});
  s+=card(740,100,260,80,T2(`${dUs}=150${JJ}`,870,150,{size:40}),seg(p,.1,.25),UO);
  s+=thermoQ({x:1090,g:seg(p,.05,.2)});
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 8. ΔU＝(3/2)nRΔT（前提：単原子分子）→ (3/2)nR が左辺の分母へ
 [K+'formula']:(p,ctx)=>{
  const W=s2(ctx),u=seg(p,ws(ctx,.12),ws(ctx,.42));
  let s=moveEq(u,{y:260,hi:seg(p,W,ws(ctx,.06))>.5?1:0,g:seg(p,.03,.12)});
  s+=kindTag('前提',600,140,{text:'単原子分子',g:seg(p,.12,.22)});
  s+=fade(seg(p,ws(ctx,.02),ws(ctx,.1))*(1-seg(p,ws(ctx,.4),ws(ctx,.46))),label('両辺を (3/2)nR で 割る',600,400,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=goalTag(G2);
  return s;
 },
 // 9. 1.5×2.0×8.3＝24.9、150÷24.9＝6.02…≈6.0。温度計が 6.0 K 上がる
 [K+'calc']:(p,ctx)=>{
  const W=s2(ctx),r=seg(p,ws(ctx,.4),ws(ctx,.75));
  let s=fade(.6,T2(`${dTs}=\\dfrac{${dUs}}{\\tfrac{3}{2}nR}`,520,150,{size:40}));
  s+=fade(seg(p,.05,.15),T2('\\tfrac{3}{2}nR=1.5\\times2.0\\times8.3=24.9',520,270,{size:44}));
  s+=fade(seg(p,W,ws(ctx,.1)),T2(`${dTs}=150\\div24.9=6.02\\cdots\\approx6.0${KK}`,520,380,{size:46}));
  s+=thermo(1080,150,390,70+60*r,{color:TG});
  s+=fade(r,line(1050,320,1110,320,{color:C.dim,w:2,dash:'5 5'})+label('＋6.0 K',1080,470,{size:30,color:TG,anchor:'middle',weight:700}));
  s+=fade(seg(p,ws(ctx,.4),ws(ctx,.5)),note('（温度計の 上がり幅は 大きく 誇張）',1000,505));
  s+=goalTag(G2);
  return s;
 },
 // 10. 答え A。確かめ 24.9×6.0≈149 J
 [K+'ans2']:(p,ctx)=>{
  const W=s2(ctx);
  let s=fade(.6,T2(`${dTs}=150\\div24.9\\approx6.0${KK}`,600,170,{size:44}));
  s+=card(250,240,700,110,T2(`24.9\\times6.0\\approx149${JJ}\\approx150${JJ}`,600,300,{size:44}),seg(p,ws(ctx,.02),ws(ctx,.12)),OK);
  s+=fade(seg(p,ws(ctx,.5),ws(ctx,.6)),label('○ ΔU に 戻る',600,410,{size:30,color:OK,anchor:'middle',weight:700}));
  s+=goalTag(G2)+A2(seg(p,.04,.14));
  return s;
 },
 // 11. 誤答 B・C・D（1枚ずつ）
 [K+'wrongBCD']:(p,ctx)=>{
  const a=markAt(ctx,'スィーは'),b=markAt(ctx,'ディーは');
  let s=fade(.6,T2(`${dTs}=\\dfrac{${dUs}}{\\tfrac{3}{2}nR}=6.0${KK}`,600,190,{size:42}));
  s+=goalTag(G2)+A2(1);
  s+=wrongSeq(p,ctx,[['B','9.0 K','3/2 を 忘れた',{mid:'150\\div(2.0\\times8.3)\\approx9.0'}],['C','12 K','n を 1.0 mol と した',{mid:'150\\div(1.5\\times1.0\\times8.3)\\approx12'}],['D','14 K','小問1の 誤り 350 J を 使った',{mid:'350\\div24.9\\approx14'}]],{win:[[0,a],[a,b],[b,1]]});
  return s;
 },
 // ================= S3 小問3 =================
 // 12. 暗転して小問3 の図。求めるもの：温度の変化
 [K+'goal3']:(p,ctx)=>scene3({t:4+cueT(ctx)})+goalTag(G3,{g:seg(p,.05,.2)}),
 // 13. W＝＋80（内向き）、Q＝−80（外向き）。2本は同じ太さ
 [K+'vals']:(p,ctx)=>{
  const t=4+tAt(ctx,K+'goal3'),W=s2(ctx,markAt(ctx,'ねつが')),w=seg(p,.05,.15),q=seg(p,W,W+.08),hx=handle(450);
  const wLab=fade(1-w,label('仕事 80 J',hx+110,PT.yc-40,{size:30,color:WL,anchor:'middle',weight:700}))+fade(w,tex(`${Ws}=+80${JJ}`,hx+125,PT.yc-38,{size:40,auto:false}));
  const qLab=fade(1-q,label('熱 80 J',HX+34,448,{size:30,color:QH,weight:700}))+signLab(`${Qs}=${minusHi}80${JJ}`,HX+34,440,{g:q});
  let s=scene3({t,wLab,qLab});
  s+=fade(w,label('入る → 正',hx+110,PT.yc+76,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(q,label('出る → 負',HX-110,440,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=goalTag(G3);
  return s;
 },
 // 14. ΔU＝(−80)＋80＝0。温度計の「？」が外れ、目盛りは動かない
 [K+'zero']:(p,ctx)=>{
  const t=4+tAt(ctx,K+'goal3'),W=s2(ctx);
  let s=fade(.35,scene3({t,th:0,wLab:'',qLab:'',mol:0}));
  s+=card(110,96,860,100,T2(`${dUs}=(-80)+80=0`,540,150,{size:50}),seg(p,.04,.14),UO);
  s+=thermoQ({x:1090,q:1-seg(p,W,ws(ctx,.1))});
  s+=fade(seg(p,ws(ctx,.1),ws(ctx,.2)),label('変わらない',1090,130,{size:28,color:TG,anchor:'middle',weight:700})+line(1060,290,1120,290,{color:C.hi,w:3}));
  s+=goalTag(G3);
  return s;
 },
 // 15. 答え D。誤答 A・B（1枚ずつ）
 [K+'ans3']:(p,ctx)=>{
  const W=s2(ctx),b=markAt(ctx,'ビーは');
  let s=card(250,96,700,90,T2(`${dUs}=(-80)+80=0`,600,145,{size:44}),1,UO);
  s+=goalTag(G3)+A3(seg(p,.04,.14));
  s+=wrongSeq(p,ctx,[['A','上がる','出ていった 熱を 忘れた'],['B','下がる','された 仕事を 忘れた']],{win:[[W,b],[b,1]]});
  return s;
 },
 // 16. 誤答 C
 [K+'wrongC']:(p)=>{
  let s=card(250,96,700,90,T2(`${dUs}=(-80)+80=0`,600,145,{size:44}),1,UO);
  s+=goalTag(G3)+A3(1);
  s+=wrongCard('C','上がる','出ていく 熱を 正の まま 足した',{g:seg(p,.03,.1),mid:'(+80)+80=160'});
  return s;
 },
 // 17. 帳簿：入 仕事 80、出 熱 80、残高 U は変わらない
 [K+'ledger']:(p,ctx)=>{
  const W=s2(ctx);
  let s=card(200,96,800,330,'',seg(p,.02,.1),C.dim);
  s+=fade(seg(p,.02,.1),label('内部エネルギーの 帳簿',600,140,{size:28,color:C.dim,anchor:'middle',weight:700})+line(240,160,960,160,{color:C.faint,w:2}));
  s+=fade(seg(p,.06,.16),label('入：仕事',260,215,{size:32,color:WL,weight:700})+label('＋80 J',880,215,{size:32,color:WL,anchor:'end',weight:700}));
  s+=fade(seg(p,.2,.3),label('出：熱',260,275,{size:32,color:QH,weight:700})+label('−80 J',880,275,{size:32,color:QH,anchor:'end',weight:700}));
  s+=fade(seg(p,.32,.42),line(240,305,960,305,{color:C.dim,w:2})+label('残高 U の 変化',260,365,{size:32,color:UO,weight:700})+label('0',880,365,{size:40,color:UO,anchor:'end',weight:700}));
  s+=fade(seg(p,ws(ctx,.05),ws(ctx,.15)),label('どちらの 入口から 入ったかは 残らない',600,480,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // ================= S4 まとめ：ΔU＝Q＋W の画面 =================
 [K+'sum']:(p,ctx)=>{
  const t=cueT(ctx);
  let s=pot({xp:440,t});
  s+=flameAt(HX,505,{s:.8})+QA(HX,462,HX,PT.yc+40)+label('熱 Q',HX+34,448,{size:30,color:QH,weight:700});
  const hx=handle(440);
  s+=WA(hx+150,PT.yc,hx+16,PT.yc)+label('仕事 W',hx+110,PT.yc-40,{size:30,color:WL,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.15),label('どちらも 系の 線を 横切る 入口',480,140,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=card(900,170,290,190,T2(`${dUs}=${Qs}+${Ws}`,1045,250,{size:40})+label('符号を そろえて',1045,320,{size:24,color:C.dim,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  s+=answerRow([[1,'B','150 J'],[2,'A','約6.0 K'],[3,'D','変わらない']],{g:seg(p,.02,.12)});
  return s;
 },
};

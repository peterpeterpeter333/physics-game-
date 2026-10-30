// 問題編 解説「圧力一定で、50 L から 55 L へ」(ys-qx-hs-t-firstlaw-2) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/204_熱力学第一法則.md の q-hs-t-firstlaw-2（解説 21 行）。
// 色（正本の指定）：熱 Q 橙、仕事 W 薄い橙、U 橙（濃いめ）、温度 T 黄緑、圧力 P 緑、体積 V 水色、分子の速さ 紫、強調 黄、誤り 赤。
// 左に筒とピストン、右に P–V グラフ（体積軸は 44〜58 L を描き、0 からの省略の印を付ける。圧力軸は 0 から）。
// 部品（筒・矢印・温度計・W外へ・式の並び）は 1 問目の図（yt1-qx-hs-t-firstlaw-1-diagrams.mjs）から読み込む。
import {C,seg,lin,fade,label,line,rect,dot,arrow,tex,clamp,mix,poly} from './anim.mjs';
import {QH,WL,UO,TG,PG,VA,OK,Qs,Ws,dUs,dTs,JJ,KK,T2,wOut,row,markAt,ws,pot,handle,flameAt,QA,WA,thermoQ} from './yt1-qx-hs-t-firstlaw-1-diagrams.mjs';
import {thermo} from './yt1-hs-t-firstlaw-1-diagrams.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,legend,note,cueT,tAt,sentWin} from './yt1-qx-common.mjs';

const K='qx-hs-t-firstlaw-2:';
const s2=(ctx,fb=.5)=>{const W=sentWin(ctx);return W[1]?W[1][0]:fb;};
const Ps=`{\\color{${PG}}P}`, Vs=`{\\color{${VA}}V}`, dVs=`\\Delta {\\color{${VA}}V}`, Ts=`{\\color{${TG}}T}`;
const E5='1.0\\times10^{5}', PA='\\ \\mathrm{Pa}', M3='\\ \\mathrm{m^3}', LL='\\ \\mathrm{L}';
// ---- 筒（左）-------------------------------------------------------------------------------------
const CY={x0:70,yc:330,h:140,len:340,rod:140};
const xpV=V=>CY.x0+260*V/50;            // 50 L → 330、55 L → 356
const cyl=(V,t,o={})=>pot({xp:xpV(V),t,x0:CY.x0,yc:CY.yc,h:CY.h,len:CY.len,rod:CY.rod,n:14,seed:7,...o});
const hX=V=>handle(xpV(V),CY.rod);
function given({g=1,gray=0}={}){
 return fade(g,label('単原子分子 2.0 mol',70,128,{size:26,color:C.ink,weight:700})
  +label('はじめ 300 K',70,168,{size:26,color:gray?C.faint:TG,weight:700})
  +label('圧力 約1.0×10⁵ Pa（一定）',70,208,{size:26,color:PG,weight:700}));
}
const readout=(V,{g=1}={})=>fade(g,label(`体積 ${V.toFixed(0)} L`,250,465,{size:28,color:VA,weight:700}));
const fire=(g=1)=>flameAt(160,505,{g,s:.75})+fade(g,QA(160,468,160,CY.yc+CY.h/2+12,{w:8,head:20}));
// ---- P–V グラフ（右）-----------------------------------------------------------------------------
const GR={x:700,y:430,w:450,h:290,v0:44,v1:58,pmax:1.5};
const gX=v=>GR.x+GR.w*(v-GR.v0)/(GR.v1-GR.v0), gY=q=>GR.y-GR.h*q/GR.pmax;
function axes({g=1}={}){
 let s=arrow(GR.x-10,GR.y,GR.x+GR.w+20,GR.y,{color:C.dim,w:2.5,head:14})+arrow(GR.x,GR.y+10,GR.x,GR.y-GR.h-20,{color:C.dim,w:2.5,head:14});
 s+=`<path d="M${GR.x+14} ${GR.y-10} l8 20 M${GR.x+24} ${GR.y-10} l8 20" stroke="${C.dim}" stroke-width="2.5"/>`;
 for(const v of [50,55])s+=line(gX(v),GR.y-6,gX(v),GR.y+6,{color:C.dim})+label(String(v),gX(v),GR.y+30,{size:22,color:C.dim,anchor:'middle'});
 s+=line(GR.x-6,gY(1),GR.x+6,gY(1),{color:C.dim})+label('1.0',GR.x-12,gY(1)+8,{size:22,color:C.dim,anchor:'end'});
 s+=label('体積 V [L]',GR.x+GR.w+20,GR.y+56,{size:24,color:VA,anchor:'end',weight:700});
 s+=label('圧力 P [×10⁵ Pa]',GR.x+10,GR.y-GR.h-30,{size:24,color:PG,weight:700});
 return fade(g,s);
}
const pLine=(u,{g=1,w=5}={})=>fade(g,u>.001?line(gX(50),gY(1),gX(50+5*u),gY(1),{color:PG,w}):'')+fade(g,dot(gX(50),gY(1),7,PG));
const pRect=(g=1,col=WL)=>fade(g,rect(gX(50),gY(1),gX(55)-gX(50),gY(0)-gY(1),{fill:col,fo:.35,stroke:col,sw:2.5,rx:0}));
// ---- 出題中の図 ------------------------------------------------------------------------------------
// t：0〜2 秒 筒と軸、2〜6 秒 炎・ピストン・水平な線。止まると静止。
function scene1(t,{th=1}={}){
 const u=clamp((t-2.3)/3.5),V=50+5*u;
 let s=cyl(V,t,{g:clamp(t/1)})+given({g:clamp((t-.3)/1),gray:t>2.4?1:0});
 s+=fire(clamp((t-2)/.6))+readout(V,{g:clamp((t-.6)/1)});
 s+=thermoQ({x:575,top:150,bot:380,level:80,g:clamp((t-.6)/1)});
 s+=axes({g:clamp((t-.3)/1)})+pLine(u,{g:clamp((t-2)/.4)});
 return s;
}
// 断熱の筒（小問3）：外側に断熱材、札「熱の出入りなし」
function insul({g=1}={}){
 const x0=CY.x0,top=CY.yc-CY.h/2,bot=CY.yc+CY.h/2,R=x0+CY.len;
 let s=rect(x0-26,top-26,R-x0+26,20,{fill:'#5d6680',fo:.85,stroke:'none',rx:4})+rect(x0-26,bot+6,R-x0+26,20,{fill:'#5d6680',fo:.85,stroke:'none',rx:4})+rect(x0-26,top-26,20,bot-top+52,{fill:'#5d6680',fo:.85,stroke:'none',rx:4});
 for(let x=x0-20;x<R;x+=22)s+=line(x,top-8,x+12,top-24,{color:'#8b95ad',w:2})+line(x,bot+24,x+12,bot+8,{color:'#8b95ad',w:2});
 return fade(g,s);
}
const noHeat=(g=1,x=230,y=200)=>card(x-150,y-34,300,52,label('熱の出入りなし',x,y+2,{size:28,color:C.ink,anchor:'middle',weight:700}),g,C.dim);
function scene3(t,{V=null,th=1,level=80,q=1,arrowG=0}={}){
 const VV=V??50+5*clamp((t-.6)/3);
 let s=cyl(VV,t)+insul();
 s+=label('同じ 気体',70,128,{size:26,color:C.ink,weight:700});
 s+=noHeat(1,500,128);
 if(arrowG)s+=fade(arrowG,WA(hX(VV)+20,CY.yc,hX(VV)+140,CY.yc));
 if(th)s+=thermoQ({x:1000,top:150,bot:380,level,q});
 return s;
}
const G1='W（外からされた仕事）',G2='Q',G3='温度の変化';
const A1=g=>answerTag(1,'A','−500 J',{g}),A2=g=>answerTag(2,'D','約1250 J',{g}),A3=g=>answerTag(3,'C','下がる',{g});
// 帯の図：1250 が 500（外への仕事）と 750（ΔU）に分かれる
function bands({g=1,split=1,y=150}={}){
 const k=.12,hIn=1250*k,hW=500*k,hU=750*k,x0=170,x1=470,x2=760;
 let s=rect(x0,y,x1-x0,hIn,{fill:QH,fo:.6,stroke:'none',rx:0});
 s+=label('熱 Q 1250 J',x0,y-14,{size:28,color:QH,weight:700});
 s+=fade(split,poly([[x1,y],[x1,y+hW],[x2,y-24+hW],[x2,y-24]],{fill:WL,fo:.65})+poly([[x1,y+hW],[x1,y+hIn],[x2,y+24+hIn],[x2,y+24+hW]],{fill:UO,fo:.6}));
 s+=fade(split,label('外への 仕事 500 J',x2+16,y-24+hW/2+9,{size:28,color:WL,weight:700})+label('ΔU 750 J（温度を 上げる）',x2+16,y+24+hW+hU/2+9,{size:28,color:UO,weight:700}));
 return fade(g,s);
}
// 拡大：遠ざかるピストンの面に当たる分子（紫の矢印が短くなる）
function zoom(p){
 const y=290,pc=.45,u=520,w=90,wx0=760;
 const wx=wx0+w*p;
 // 当たる所
 const xc=260+u*.95,uo=u-2*w*1.6;
 const x=p<pc?mix(260,xc,p/pc):xc-(p-pc)/(1-pc)*uo*.9;
 let s=line(150,y+30,1100,y+30,{color:C.faint,w:2});
 s+=rect(wx,y-120,26,220,{fill:'#7d8aa3',fo:1,stroke:'#c9d2e3',sw:2,rx:3})+rect(wx+26,y-12,220,24,{fill:'#7d8aa3',fo:1,stroke:'none',rx:3});
 s+=arrow(wx+90,y-150,wx+190,y-150,{color:C.dim,w:5,head:16})+label('ピストンが 遠ざかる',wx+60,y-170,{size:26,color:C.ink,anchor:'middle',weight:700});
 s+=dot(Math.min(x,wx-20),y,20,'#a9d8ff');
 const before=p<pc;
 s+=arrow(before?x:330,y+80,(before?x:330)+200,y+80,{color:C.v,w:7,head:18,opacity:before?1:.4})+label('当たる 前',(before?x:330)+100,y+120,{size:24,color:C.v,anchor:'middle',opacity:before?1:.6});
 if(!before){const bx2=Math.min(x,wx-20);s+=arrow(bx2,y-60,bx2-110,y-60,{color:C.v,w:7,head:18})+label('はね返った 後（遅い）',bx2-55,y-82,{size:24,color:C.v,anchor:'middle',weight:700});}
 return s;
}

export const qxHsTFirstlaw2Diagrams={
 // ================= 問題アニメ：出題（小問1・2）約6秒＋静止 =================
 // 筒とグラフの軸 → 炎、ピストンが右へ、体積 50→55 L、水平な線が 50→55 L。はじめ 300 K の札は動き始めたら灰色。温度計は「？」。
 // 線の下の塗り・面積の値・温度の値・熱の帯の図は描かない。
 [K+'q0']:(p,ctx)=>scene1(cueT(ctx)),
 // ================= 問題アニメ：小問3（約4秒＋静止）：断熱の筒でピストンがゆっくり右へ。温度計は「？」 =================
 [K+'q3']:(p,ctx)=>scene3(cueT(ctx)),
 // ================= S1 小問1 =================
 [K+'goal1']:(p,ctx)=>scene1(7+cueT(ctx))+goalTag(G1,{g:seg(p,.05,.2)}),
 // 2. W外へ＝PΔV。線の下を「面積」に合わせて塗る
 [K+'area']:(p,ctx)=>{
  const W=s2(ctx),t=7+tAt(ctx,K+'goal1');
  let s=fade(1-seg(p,0,.1),cyl(55,t)+given({gray:1})+readout(55)+thermoQ({x:575,top:150,bot:380,level:80}));
  s+=card(60,110,560,120,row(['@',`=${Ps}${dVs}`],340,180,{size:54}),seg(p,.08,.2),WL);
  s+=fade(seg(p,.12,.22),label('圧力 一定',340,270,{size:28,color:PG,anchor:'middle',weight:700}));
  s+=axes()+pLine(1)+pRect(seg(p,markAt(ctx,'めんせき',ws(ctx,.3)),markAt(ctx,'めんせき',ws(ctx,.3))+.1));
  s+=fade(seg(p,markAt(ctx,'めんせき',ws(ctx,.3)),markAt(ctx,'めんせき',ws(ctx,.3))+.1),label('面積',(gX(50)+gX(55))/2,gY(.5)+10,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=goalTag(G1);
  return s;
 },
 // 3. ΔV＝5.0 L＝0.0050 m³、1.0×10⁵×0.0050＝500 J
 [K+'num']:(p,ctx)=>{
  const W=s2(ctx);
  let s=axes()+pLine(1)+pRect();
  s+=card(60,96,560,96,T2(`${dVs}=5.0${LL}=0.0050${M3}`,340,152,{size:40}),seg(p,.03,.12),VA);
  s+=fade(seg(p,.1,.2),label('1 L ＝ 0.001 m³',340,230,{size:26,color:VA,anchor:'middle',weight:700}));
  s+=fade(seg(p,.12,.22),label('0.0050 m³',(gX(50)+gX(55))/2,GR.y+80,{size:26,color:VA,anchor:'middle',weight:700}));
  s+=fade(seg(p,W,ws(ctx,.08)),label('1.0×10⁵ Pa',gX(50)-12,gY(.5)+8,{size:26,color:PG,anchor:'end',weight:700}));
  s+=card(60,280,560,110,row([`${E5}\\times0.0050=500${JJ}`],340,345,{size:40}),seg(p,ws(ctx,.12),ws(ctx,.22)),WL);
  s+=fade(seg(p,ws(ctx,.3),ws(ctx,.4)),label('面積',(gX(50)+gX(55))/2,gY(.5)-10,{size:26,color:C.ink,anchor:'middle',weight:700})+label('500 J',(gX(50)+gX(55))/2,gY(.5)+26,{size:28,color:WL,anchor:'middle',weight:700}));
  s+=fade(seg(p,ws(ctx,.3),ws(ctx,.4)),row(['@','=500\\ \\mathrm{J}'],340,450,{size:40}));
  s+=goalTag(G1);
  return s;
 },
 // 4. W外へ＝500 → W＝−500。ピストンの動き（外へ）と「外から」の向き（内へ）
 [K+'sign']:(p,ctx)=>{
  const W=s2(ctx),t=cueT(ctx),m=seg(p,.12,.3);
  let s=cyl(55,7+t);
  const hx=hX(55);
  s+=fade(seg(p,.05,.15),arrow(hx+24,CY.yc-40,hx+170,CY.yc-40,{color:C.ink,w:6,head:18})+label('ピストンの 動き（外へ）',hx+30,CY.yc-62,{size:24,color:C.ink,weight:700}));
  s+=fade(seg(p,.15,.25),WA(hx+170,CY.yc+40,hx+24,CY.yc+40)+label('外から 押す 向き',hx+30,CY.yc+96,{size:24,color:WL,weight:700}));
  s+=fade(seg(p,.25,.35),label('逆 向き',hx+250,CY.yc+8,{size:28,color:C.hi,weight:700}));
  s+=card(600,96,520,110,fade(1-m,row(['@','=500\\ \\mathrm{J}'],860,160,{size:46}))+fade(m,T2(`${Ws}={\\color{${C.hi}}-}500${JJ}`,860,160,{size:48})),seg(p,0,.08),WL);
  s+=fade(seg(p,W,ws(ctx,.1)),label('膨張 → 負',1000,420,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=goalTag(G1);
  return s;
 },
 // 5. 答え A。誤答 B
 [K+'ans1']:(p,ctx)=>{
  const W=s2(ctx);
  let s=card(250,96,700,100,T2(`${Ws}=-500${JJ}`,600,150,{size:48}),1,WL);
  s+=goalTag(G1)+A1(seg(p,.04,.14));
  s+=wrongCard('B','＋500 J','W外へ を そのまま W と した',{g:seg(p,W,ws(ctx,.06))});
  return s;
 },
 // 6. 誤答 C、D（1枚ずつ）
 [K+'wrongCD']:(p,ctx)=>{
  const a=markAt(ctx,'ディーは');
  let s=card(250,96,700,100,T2(`${Ws}=-500${JJ}`,600,150,{size:48}),1,WL);
  s+=goalTag(G1)+A1(1);
  s+=wrongSeq(p,ctx,[['C','−5.0×10⁵ J','L の まま 掛けた',{mid:`${E5}\\times5.0=5.0\\times10^{5}`}],['D','0 J','0 は 体積が 変わらない とき']],{win:[[0,a],[a,1]]});
  return s;
 },
 // ================= S2 小問2 =================
 [K+'goal2']:(p,ctx)=>scene1(7+cueT(ctx))+goalTag(G2,{g:seg(p,.05,.2)}),
 // 8. 圧力一定 → T は V に比例。55/50＝1.1、300 K → 330 K
 [K+'temp']:(p,ctx)=>{
  const W=s2(ctx),r=seg(p,ws(ctx,.35),ws(ctx,.7));
  let s=card(60,96,800,90,label('圧力 一定 → 温度は 体積に 比例',460,153,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.03,.12),PG);
  s+=fade(seg(p,W,ws(ctx,.1)),T2('\\dfrac{55}{50}=1.1',460,270,{size:46}));
  s+=fade(seg(p,ws(ctx,.15),ws(ctx,.25)),T2(`${Ts}=300\\times\\dfrac{55}{50}=330${KK}`,460,390,{size:46}));
  s+=thermo(1000,130,390,90+50*r,{color:TG});
  s+=label(r<.5?'300 K':'330 K',1040,390-90-50*r+10,{size:30,color:TG,weight:700});
  s+=goalTag(G2);
  return s;
 },
 // 9. 330−300＝30。ΔU＝(3/2)nRΔT＝24.9×30＝747≈750 J。橙の棒
 [K+'du']:(p,ctx)=>{
  const W=s2(ctx);
  let s=T2(`\\Delta ${Ts}=330-300=30${KK}`,420,140,{size:42});
  s+=fade(seg(p,W,ws(ctx,.08)),T2(`${dUs}=\\tfrac{3}{2}nR\\,\\Delta ${Ts}`,420,235,{size:44}));
  s+=fade(seg(p,ws(ctx,.15),ws(ctx,.25)),T2('=1.5\\times2.0\\times8.3\\times30',420,320,{size:42}));
  s+=fade(seg(p,ws(ctx,.35),ws(ctx,.45)),T2(`=24.9\\times30=747\\approx750${JJ}`,420,410,{size:42}));
  const h=seg(p,ws(ctx,.5),ws(ctx,.75));
  s+=fade(seg(p,ws(ctx,.48),ws(ctx,.52)),rect(950,440-750*.32*h,120,750*.32*h,{fill:UO,fo:.55,stroke:UO,sw:2.5,rx:6})+line(900,440,1120,440,{color:C.dim,w:2}));
  s+=fade(seg(p,ws(ctx,.7),ws(ctx,.75)),label('ΔU ≈ 750 J',1010,180,{size:30,color:UO,anchor:'middle',weight:700}));
  s+=goalTag(G2);
  return s;
 },
 // 10. ΔU＝Q＋W → Q＝ΔU−W。750−(−500)＝750＋500≈1250 J
 [K+'solve']:(p,ctx)=>{
  const W=s2(ctx),m=seg(p,W*.45,W*.75),hl=seg(p,ws(ctx,.25),ws(ctx,.3)),pl=seg(p,ws(ctx,.45),ws(ctx,.55));
  let s=card(200,96,800,100,fade(1-m,T2(`${dUs}=${Qs}+${Ws}`,600,152,{size:50}))+fade(m,T2(`${Qs}=${dUs}-${Ws}`,600,152,{size:50})),1,C.hi);
  s+=fade(seg(p,W*.3,W*.45)*(1-seg(p,W*.8,W*.9)),label('W を 左辺へ 移す（符号が 変わる）',600,240,{size:28,color:C.hi,anchor:'middle',weight:700}));
  const neg=`{\\color{${hl>.5?C.hi:C.ink}}-(-500)}`;
  s+=fade(seg(p,W,ws(ctx,.1)),T2(`${Qs}=750${neg}`,600,300,{size:48}));
  s+=fade(pl,T2(`=750{\\color{${C.hi}}+500}\\approx1250${JJ}`,600,400,{size:48}));
  s+=goalTag(G2);
  return s;
 },
 // 11. 答え D。帯の図：1250 → 外への仕事 500 と ΔU 750
 [K+'ans2']:(p,ctx)=>{
  const W=s2(ctx);
  let s=bands({g:seg(p,W,ws(ctx,.08)),split:seg(p,ws(ctx,.2),ws(ctx,.45))});
  s+=fade(1-seg(p,W-.05,W),T2(`${Qs}\\approx1250${JJ}`,600,250,{size:54}));
  s+=goalTag(G2)+A2(seg(p,.04,.14));
  return s;
 },
 // 12. 誤答 A、C（1枚ずつ）
 [K+'wrongAC']:(p,ctx)=>{
  const a=markAt(ctx,'スィーは');
  let s=fade(.45,bands({y:110}));
  s+=goalTag(G2)+A2(1);
  s+=wrongSeq(p,ctx,[['A','750 J','Q＝ΔU と した'],['C','500 J','仕事の 分だけを 熱と した']],{win:[[0,a],[a,1]]});
  return s;
 },
 // 13. 誤答 B
 [K+'wrongB']:(p)=>{
  let s=fade(.45,bands({y:110}));
  s+=goalTag(G2)+A2(1);
  s+=wrongCard('B','250 J','Q＝ΔU＋W と した',{g:seg(p,.03,.1),mid:'750+(-500)=250'});
  return s;
 },
 // ================= S3 小問3 =================
 [K+'goal3']:(p,ctx)=>scene3(5+cueT(ctx))+goalTag(G3,{g:seg(p,.05,.2)}),
 // 15. 熱の出入りなし → Q＝0、ΔU＝0＋W＝W
 [K+'q0eq']:(p,ctx)=>{
  const t=5+tAt(ctx,K+'goal3');
  let s=scene3(t,{th:0});
  s+=fade(seg(p,.05,.15),ring2(500,128));
  s+=card(620,200,520,110,T2(`${dUs}=0+${Ws}=${Ws}`,880,258,{size:48}),seg(p,.4,.5),UO);
  s+=fade(seg(p,.15,.25),label('Q ＝ 0',880,170,{size:32,color:QH,anchor:'middle',weight:700}));
  s+=goalTag(G3);
  return s;
 },
 // 16. ピストンが右へ動き、外向きの矢印。W＜0、ΔU＜0
 [K+'neg']:(p,ctx)=>{
  const t=cueT(ctx),V=50+8*seg(p,.05,.6);
  let s=scene3(5+t,{V,th:0,arrowG:seg(p,.1,.2)});
  s+=fade(seg(p,.1,.2),label('外へ 仕事',hX(V)+80,CY.yc-30,{size:26,color:WL,anchor:'middle',weight:700}));
  s+=card(760,200,170,70,T2(`${Ws}<0`,845,240,{size:42}),seg(p,.4,.5),WL);
  s+=card(960,200,200,70,T2(`${dUs}<0`,1060,240,{size:42}),seg(p,.6,.7),UO);
  s+=goalTag(G3);
  return s;
 },
 // 17. 温度計が下がる。答え C（2文目）
 [K+'down']:(p,ctx)=>{
  const W=s2(ctx),d=seg(p,.05,.4);
  let s=scene3(5+cueT(ctx),{V:58,th:0});
  s+=thermoQ({x:1000,top:150,bot:380,level:90-45*d,q:1-seg(p,0,.06)});
  s+=fade(d,label('下がる',1000,120,{size:30,color:TG,anchor:'middle',weight:700}));
  s+=goalTag(G3)+A3(seg(p,W,ws(ctx,.08)));
  return s;
 },
 // 18. 拡大：遠ざかるピストンに当たった分子が遅くなってはね返る（大きく誇張）
 [K+'zoom']:(p)=>{
  let s=zoom(seg(p,.05,.85));
  s+=note('（大きく 誇張）',600,500);
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 19. 誤答 A
 [K+'wrongA']:(p)=>{
  let s=fade(.35,scene3(9,{V:58,th:0}));
  s+=goalTag(G3)+A3(1);
  s+=wrongCard('A','変わらない','断熱（Q＝0）と 等温（ΔU＝0）を 混同',{g:seg(p,.03,.1)});
  return s;
 },
 // 20. 誤答 B、D（1枚ずつ）
 [K+'wrongBD']:(p,ctx)=>{
  const a=markAt(ctx,'ディーも');
  let s=fade(.35,scene3(9,{V:58,th:0}));
  s+=goalTag(G3)+A3(1);
  s+=wrongSeq(p,ctx,[['B','上がる','V と T の 比例は 圧力一定の とき'],['D','速さしだい','W＜0 なので 必ず 下がる']],{win:[[0,a],[a,1]]});
  return s;
 },
 // ================= S4 まとめ：P–V グラフの線の下の面積と第一法則 =================
 [K+'sum']:(p)=>{
  let s=axes()+pLine(1)+pRect(seg(p,.05,.2));
  s+=fade(seg(p,.1,.25),label('面積',(gX(50)+gX(55))/2,gY(.5)+10,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=card(60,110,560,110,row(['@',`=${Ps}${dVs}`],340,175,{size:48}),seg(p,.1,.25),WL);
  s+=card(60,260,560,110,T2(`${dUs}=${Qs}+${Ws}`,340,325,{size:50}),seg(p,.5,.65),C.hi);
  s+=fade(seg(p,.7,.8),label('→ 熱も 温度も 勘定できる',340,430,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=answerRow([[1,'A','−500 J'],[2,'D','約1250 J'],[3,'C','下がる']],{g:seg(p,.02,.12)});
  return s;
 },
};
// 「熱の出入りなし」の札を囲む黄の枠（言葉に合わせて光らせる）
function ring2(x,y){return rect(x-160,y-42,320,68,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:12});}

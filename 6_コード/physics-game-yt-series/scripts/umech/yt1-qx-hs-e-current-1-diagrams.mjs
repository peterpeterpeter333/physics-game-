// 問題編 解説「電子の列は、1秒に何 mm 進む？」(ys-qx-hs-e-current-1) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/401_電流とオームの法則.md の q-hs-e-current-1（解説 20 行）。
// 色（正本）：電流 I 緑、電荷 Q 桃、時間 t 金、電子 青、R 白、正電荷 赤、強調 黄。右下に凡例「R 白・電子 青・正電荷 赤」。
// 導線は灰色の円柱、門は白い枠（「門」の語で黄に光る）。電子（青）は左へ、電流（緑の矢印）は右へ。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 元の単元動画（yt1-hs-e-current-1）の部品を読み込んで使う（そのファイルは編集しない）。
import {C,seg,lin,fade,label,line,rect,dot,ring,arrow,draw,tex,texWidth,clamp,mix} from './anim.mjs';
import {IC,TC,NEG,POS,tube,edot,battery,bulb,loopPath,along,pathLen} from './yt1-hs-e-current-1-diagrams.mjs';
import {QC,card,textW,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,pauseBadge,legend,note,sentWin,voiceEnd,cueT,tAt,durOf,isProblem} from './yt1-qx-common.mjs';

const K='qx-hs-e-current-1:';
const QQ=QC.q,WH=C.ink,GRAY='#8795ad';
const G1='1秒に門を通る電子の数',G2='電子の列が1秒に進む長さ',G3='すぐ明かりがつく理由';
const A1=g=>answerTag(1,'C','1.0×10¹⁹ 個',{g}),A2=g=>answerTag(2,'B','1.0×10⁻⁴ m',{g}),A3=g=>answerTag(3,'D','',{g});
const LEG=(g=1)=>legend([['R 白',WH],['電子 青',NEG],['正電荷 赤',POS]],1068,430,{g,size:22});
const T=(s,x,y,o={})=>label(s,x,y,{size:28,color:WH,anchor:'middle',weight:700,...o});
const M=(s,x,y,o={})=>tex(s,x,y,{size:40,auto:false,color:WH,...o});
const win=(ctx,i,d=.5)=>{const W=sentWin(ctx);return W[i]??[d,1];};
// ---- 導線・電子・門 -----------------------------------------------------------------------------
const WY=200,HH=40,GX=700,X1=60,X2=1140;
function elecs(t,{x1=X1,x2=X2,y=WY,hh=HH,v=34,sp=48,g=1}={}){
 let s='';[-.55,0,.55].forEach((f,j)=>{const off=((j*sp/3+j*7-v*t)%sp+sp)%sp;for(let x=x1+16+off;x<x2-14;x+=sp)s+=edot(x,y+f*hh,6);});
 return fade(g,s);
}
function gate(x,y,{hh=HH,hi=0,lab=1}={}){
 const col=hi>.5?C.hi:WH;
 let s=rect(x-15,y-hh-18,30,2*hh+36,{fill:C.hi,fo:.12*hi,stroke:col,sw:4,rx:6});
 if(hi>0)s+=fade(hi,rect(x-24,y-hh-27,48,2*hh+54,{fill:'none',fo:0,stroke:C.hi,sw:2,rx:10}));
 if(lab)s+=label('門',x,y+hh+52,{size:28,color:col,anchor:'middle',weight:700});
 return s;
}
function wire(t,{y=WY,gx=GX,x1=X1,x2=X2,hh=HH,hi=0,cur=1,ilab='電流',g=1,lab=1}={}){
 let s=tube(x1,x2,y,{hh,fill:GRAY})+elecs(t,{x1,x2,y,hh});
 s+=gate(gx,y,{hh,hi,lab});
 if(cur>0)s+=fade(cur,arrow(gx-300,y-hh-34,gx-40,y-hh-34,{color:IC,w:6,head:18})+label(ilab,gx-318,y-hh-24,{size:26,color:IC,anchor:'end',weight:700}));
 return fade(g,s);
}
// 札（値の入った小さな枠）
const chip=(x,y,w,inner,col,g=1)=>card(x,y,w,60,inner,g,col);
function setupChips(o=[1,1,1,1]){
 let s='';
 s+=chip(70,312,300,T('I ＝ 1.6 A',220,353,{color:IC}),IC,o[0]);
 s+=chip(400,312,620,T('断面積 2.0 mm² ＝ 2.0×10⁻⁶ m²',710,353),WH,o[1]);
 s+=chip(70,400,500,T('1 m³ あたり 5.0×10²⁸ 個',320,441,{color:NEG}),NEG,o[2]);
 s+=chip(600,400,400,T('e ＝ 1.6×10⁻¹⁹ C',800,441,{color:QQ}),QQ,o[3]);
 return s;
}
// ---- 分数（分子・分母を別々に描き、約分の線や丸を正確に置く） -------------------------------------
function fracParts(num,den,cx,cy,{size=46,ncol=WH,dcol=WH}={}){
 const wn=texWidth(num,size,false),wd=texWidth(den,size,false),w=Math.max(wn,wd)+24;
 const ny=cy-size*.72,dy=cy+size*.8;
 return {svg:tex(num,cx,ny,{size,color:ncol,auto:false})+line(cx-w/2,cy,cx+w/2,cy,{color:WH,w:3})+tex(den,cx,dy,{size,color:dcol,auto:false}),w,wn,wd,ny,dy};
}
const strike=(x1,x2,y,g=1,col=C.hi)=>fade(g,line(x1-4,y+16,x2+4,y-16,{color:col,w:4}));
// ---- 時計（金）と、電荷の箱（桃） ---------------------------------------------------------------------
function timer(cx,cy,u,{r=58,g=1}={}){
 const a=-Math.PI/2+2*Math.PI*clamp(u),big=u>.5?1:0,ex=cx+r*Math.cos(a),ey=cy+r*Math.sin(a);
 let s=ring(cx,cy,r,{color:TC,w:4,fill:'#1d1a10'});
 if(u>.001&&u<.999)s+=`<path d="M${cx},${cy} L${cx},${cy-r} A${r},${r} 0 ${big} 1 ${ex.toFixed(1)},${ey.toFixed(1)} Z" fill="${TC}" fill-opacity=".35"/>`;
 else if(u>=.999)s+=dot(cx,cy,r-2,TC,.35);
 s+=line(cx,cy,ex,ey,{color:TC,w:4})+label(`${u>=.999?'1.0':u.toFixed(1)} s`,cx,cy+r+38,{size:28,color:TC,anchor:'middle',weight:700});
 return fade(g,s);
}
function qbox(x,y,w,h,u,{g=1}={}){
 let s=card(x,y,w,h,'',1,QQ);
 s+=rect(x+20,y+h-44,(w-40)*clamp(u),24,{fill:QQ,fo:.55,stroke:'none',rx:4})+rect(x+20,y+h-44,w-40,24,{fill:'none',fo:0,stroke:QQ,sw:1.5,rx:4});
 s+=label(`${(1.6*clamp(u)).toFixed(1)} C`,x+w/2,y+100,{size:40,color:QQ,anchor:'middle',weight:700});
 return fade(g,s);
}
// ---- 1 m の柱（行 9・10） ------------------------------------------------------------------------
const PX1=300,PX2=1000,PY=232,PH=70;
function rnd(seed){let s=seed*9301+49297;return()=>{s=(s*9301+49297)%233280;return s/233280;};}
const PTS=(()=>{const R=rnd(7),a=[];for(let i=0;i<140;i++)a.push([PX1+20+(PX2-PX1-40)*R(),PY-PH+14+(2*PH-28)*R()]);return a;})();
function pillar({secHi=0,lenHi=0,fill=0,g=1}={}){
 let s=tube(PX1,PX2,PY,{hh:PH,fill:GRAY});
 const n=Math.round(PTS.length*clamp(fill));for(let i=0;i<n;i++)s+=edot(PTS[i][0],PTS[i][1],6);
 const sc=secHi>.5?C.hi:WH;
 s+=`<ellipse cx="${PX1}" cy="${PY}" rx="30" ry="${PH}" fill="${C.hi}" fill-opacity="${(.1+.25*secHi).toFixed(2)}" stroke="${sc}" stroke-width="${3+3*secHi}"/>`;
 s+=label('断面積',PX1-50,PY-PH-48,{size:26,color:sc,anchor:'start',weight:700})+label('2.0×10⁻⁶ m²',PX1-50,PY-PH-14,{size:28,color:sc,weight:700});
 const lc=lenHi>.5?C.hi:WH,yb=PY+PH+28;
 s+=line(PX1,yb,PX2,yb,{color:lc,w:3+3*lenHi})+line(PX1,yb-12,PX1,yb+12,{color:lc,w:3})+line(PX2,yb-12,PX2,yb+12,{color:lc,w:3})+label('長さ 1 m',(PX1+PX2)/2,yb+40,{size:28,color:lc,anchor:'middle',weight:700});
 return fade(g,s);
}
// ---- ものさし（大きく拡大。0〜0.20 mm） -----------------------------------------------------------
const RX=180,RK=4000,RY=300;   // 0.10 mm ＝ 400 px
function ruler(head,{g=1,hi=0}={}){
 let s=line(RX,RY,RX+800,RY,{color:WH,w:3});
 for(let i=0;i<=20;i++)s+=line(RX+40*i,RY,RX+40*i,RY-(i%5?14:28),{color:WH,w:2});
 for(const [v,t] of [[0,'0'],[.05,'0.05 mm'],[.1,'0.10 mm'],[.15,'0.15 mm'],[.2,'0.20 mm']])s+=label(t,RX+RK*v,RY+38,{size:24,color:C.dim,anchor:'middle'});
 const hx=RX+RK*head;
 for(let x=hx;x>40;x-=24)s+=edot(x,RY-62,7,x<RX?.45:1);
 s+=fade(hi,rect(hx-14,RY-80,28,36,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:6}));
 return fade(g,s);
}
// ---- 回路（行 15〜20）。電池は下、電球は上、スイッチは左 -------------------------------------------
const O={L:200,R:760,T:142,B:430,bx:480,ex:480};
const SW1=O.T+100,SW2=O.T+170;
function cdots(t,{n=66,ev=16,g=1}={}){
 const P=loopPath(O.L,O.R,O.T,O.B,O.bx),Lp=pathLen(P);let s='';
 for(let k=0;k<n;k++){const [x,y]=along(P,k/n-ev*t/Lp);
  if(Math.abs(y-O.T)<2&&Math.abs(x-O.ex)<44)continue;
  if(Math.abs(x-O.L)<2&&y>SW1-8&&y<SW2+8)continue;
  s+=edot(x,y,7);}
 return fade(g,s);
}
function cir({sw=0,on=0,t=0,dots=0,ev=16,g=1}={}){
 const {L,R,T:Tt,B,bx,ex}=O;let s='';
 s+=line(bx+11,B,R,B,{color:C.dim,w:4})+line(R,B,R,Tt,{color:C.dim,w:4})+line(L,B,bx-11,B,{color:C.dim,w:4});
 s+=line(L,Tt,ex-34,Tt,{color:C.dim,w:4})+line(ex+34,Tt,R,Tt,{color:C.dim,w:4});
 s+=line(L,Tt,L,SW1,{color:C.dim,w:4})+line(L,SW2,L,B,{color:C.dim,w:4})+dot(L,SW1,6,WH)+dot(L,SW2,6,WH);
 const a=mix(-0.75,0,clamp(sw));s+=line(L,SW2,L+Math.sin(a)*(SW2-SW1),SW2-Math.cos(a)*(SW2-SW1),{color:WH,w:5});
 s+=label('スイッチ',L-62,(SW1+SW2)/2+8,{size:24,color:C.dim,anchor:'end'});
 s+=bulb(ex,Tt,{on})+battery(bx,B,{text:''});
 if(dots>0)s+=cdots(t,{ev,g:dots});
 return fade(g,s);
}
// 小問3：スイッチを入れた時刻からの秒数（go の cue の 15% で閉じる）
const SWP=.15;
function sinceClose(ctx){const d=durOf(ctx,K+'go',8);return Math.max(0,tAt(ctx,K+'go')-SWP*d);}
// ---- 満水のホース（小さく） ----------------------------------------------------------------------
function hose(push,{x1=870,x2=1120,y=232,g=1}={}){
 let s=rect(x1,y-26,x2-x1,52,{fill:'#4a90d9',fo:.35,stroke:'#9fd0ff',sw:3,rx:8});
 const px=x1-30+34*push;s+=rect(px-10,y-23,20,46,{fill:C.dim,fo:.85,stroke:WH,sw:2,rx:3})+line(px-10,y,px-70,y,{color:C.dim,w:7});
 if(push>.05){const n=Math.round(8*push);for(let i=0;i<n;i++)s+=dot(x2+14+i*11,y+(i%3-1)*9+i*i*.5,5,'#9fd0ff');}
 s+=label('満水の ホース',(x1+x2)/2,y-44,{size:24,color:'#9fd0ff',anchor:'middle',weight:700});
 return fade(g,s);
}
// ---- まとめの鎖 ----------------------------------------------------------------------------------
function chain(g=[1,1,1]){
 const box=(x,w,a,b,col,o)=>card(x,170,w,150,T(a,x+w/2,228,{size:26,color:C.dim})+T(b,x+w/2,285,{size:32,color:col}),o,col);
 let s=box(40,300,'1秒に 門を 通る','1.0×10¹⁹ 個',NEG,g[0]);
 s+=fade(g[1],arrow(350,245,400,245,{color:C.hi,w:5,head:14}))+box(410,320,'1 m あたり','1.0×10²³ 個',WH,g[1]);
 s+=fade(g[2],arrow(740,245,790,245,{color:C.hi,w:5,head:14}))+box(800,240,'1秒に','0.10 mm',C.hi,g[2]);
 return s;
}

// 上付きの数字（¹⁹・⁻⁶ など）は、文字の「⁻」がほとんど見えないので、文字の中で小さな数字を上にずらして描き直す（全部の図に通す）。
const SUP={'⁻':'−','⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9'};
const fixSup=svg=>svg.replace(/(<text[^>]*font-size="([\d.]+)"[^>]*>)([^<]*)(<\/text>)/g,(m,open,fs,body,close)=>{
 if(!/[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]/.test(body))return m;const f=+fs;
 return open+body.replace(/[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+/g,r=>`<tspan baseline-shift="${(.42*f).toFixed(1)}" font-size="${(.66*f).toFixed(1)}">${[...r].map(c=>SUP[c]).join('')}</tspan>`)+close;});
const D0={
 // ================= 問題アニメ：出題中（小問1〜3 共通、5 秒＋静止）=================
 // 灰色の導線と白い門。0〜2 s：青い電子が左へゆっくり流れ、緑の電流の矢印（右向き）が現れる。2〜5 s：札を一枚ずつ。
 // 5 s で映像を一時停止（隅に小さく）。出さないもの：門を通った電子のカウンター、1 m の枠、電子の列の長さ。
 [K+'q0']:(p,ctx)=>{
  const t=cueT(ctx);
  let s=wire(t,{cur:seg(p,.1,.35)});
  s+=setupChips([seg(p,.4,.48),seg(p,.54,.62),seg(p,.68,.76),seg(p,.82,.9)]);
  s+=LEG();
  if(isProblem(ctx))s+=pauseBadge({g:seg(p,.97,1),x:1060,y:8,size:22});
  return s;
 },
 // ================= S1 小問1：1秒に門を通る電子の数 =================
 // 1. 出題中の図＋求めるもの。「門」の語で門を黄に
 [K+'goal1']:(p,ctx)=>{
  const t=5+cueT(ctx),hi=seg(p,.42,.5)*(1-seg(p,.85,.95));
  let s=wire(t,{hi})+setupChips()+LEG();
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 2. 記号の札（Δt 金・ΔQ 桃・I 緑）→「定義」と I＝ΔQ/Δt → 1秒の時計が一周し、箱が 1.6 C
 [K+'def']:(p,ctx)=>{
  const t=5+tAt(ctx,K+'goal1')+cueT(ctx),[a,b]=win(ctx,0,.5),u=lin(p,b+.04,Math.min(.97,b+.72*(1-b)));
  let s=wire(t,{y:180,gx:520,x1:60,x2:780,cur:1,ilab:'I：電流',lab:1});
  s+=timer(170,360,u,{g:seg(p,.06,.14)})+fade(seg(p,.06,.14),T('Δt：かかった時間',170,288,{size:26,color:TC}));
  s+=qbox(320,300,360,170,u,{g:seg(p,.16,.24)})+fade(seg(p,.16,.24),T('ΔQ：門を通った電荷',500,334,{size:26,color:QQ}));
  s+=card(720,290,300,180,kindTag('定義',870,334,{g:1})+M(`{\\color{${IC}}I}=\\dfrac{\\Delta {\\color{${QQ}}Q}}{\\Delta {\\color{${TC}}t}}`,870,410,{size:46}),seg(p,a+.6*(b-a),a+.75*(b-a)),C.hi);
  s+=LEG()+goalTag(G1);
  return s;
 },
 // 3. 1.6 C の箱を、電子1個ぶんの小さな箱に区切る。式 1.6÷(1.6×10⁻¹⁹) を上に
 [K+'divide']:(p)=>{
  const bx=150,bw=880,by=250,bh=80,cell=14;
  let s=card(bx-20,by-74,bw+40,bh+170,'',1,QQ);
  s+=T('1.6 C',bx,by-30,{color:QQ,anchor:'start',size:32});
  s+=rect(bx,by,bw,bh,{fill:QQ,fo:.3,stroke:QQ,sw:3,rx:4});
  s+=fade(seg(p,.05,.15),rect(bx,by,cell,bh,{fill:QQ,fo:.85,stroke:C.hi,sw:3,rx:2})+line(bx+cell/2,by+bh,bx+cell/2,by+bh+34,{color:QQ,w:2})
   +label('電子1個の 電荷の 大きさ 1.6×10⁻¹⁹ C',bx,by+bh+66,{size:26,color:QQ,weight:700}));
  const u=lin(p,.38,.72),n=Math.floor((bw/cell)*u);
  let ls='';for(let i=1;i<n;i++)ls+=line(bx+i*cell,by+4,bx+i*cell,by+bh-4,{color:'#ffd0f0',w:1.2,opacity:.8});s+=ls;
  s+=fade(seg(p,.4,.5),note('（区切りは 省略して 描いています）',bx+bw,by+bh+66,{anchor:'end'}));
  s+=card(300,92,600,72,M(`1.6\\div(1.6\\times10^{-19})`,600,128,{size:40}),seg(p,.6,.72),C.hi);
  s+=LEG()+goalTag(G1);
  return s;
 },
 // 4. 分子と分母の 1.6 に打ち消し線 → 1.0×10¹⁹ 個。門の横のカウンター。答えの札
 [K+'ans1']:(p,ctx)=>{
  const [a,b]=win(ctx,0,.6),cx=430,cy=165;
  const F=fracParts('1.6','1.6\\times10^{-19}',cx,cy,{size:44,ncol:QQ,dcol:QQ});
  let s=card(150,86,900,170,'',1,C.hi)+F.svg;
  const w16=texWidth('1.6',44,false),dl=cx-F.wd/2;
  s+=strike(cx-F.wn/2,cx+F.wn/2,F.ny,seg(p,.08,.16))+strike(dl,dl+w16,F.dy,seg(p,.16,.24));
  s+=fade(seg(p,.3,.4),M('=1.0\\times10^{19}',cx+F.w/2+170,cy+4,{size:44})+label('個',cx+F.w/2+330,cy+18,{size:34,color:WH,weight:700}));
  const t=cueT(ctx),m=lin(p,.3,b*.95);
  s+=wire(t,{y:385,gx:380,x1:60,x2:640,hh:36,cur:0,lab:0})+label('門',380,350-26,{size:26,color:WH,anchor:'middle',weight:700});
  s+=card(680,330,330,110,T('門を 通った 電子',845,368,{size:24,color:C.dim})+T(`${m.toFixed(1)}×10¹⁹ 個`,845,418,{size:32,color:NEG}),seg(p,.25,.32),NEG);
  s+=LEG()+goalTag(G1)+A1(seg(p,b,b+.08));
  return s;
 },
 // 5. 誤答 A（割らずに掛けた）、誤答 B（1 A のときの個数）。1枚ずつ
 [K+'wrongAB']:(p,ctx)=>{
  let s=card(200,90,800,80,M(`1.6\\div(1.6\\times10^{-19})=1.0\\times10^{19}`,560,130,{size:36})+label('個',890,142,{size:30,color:WH,weight:700}),.5,C.faint);
  s+=wrongSeq(p,ctx,[['A','2.6×10⁻¹⁹ 個','割らずに 掛けた（単位 A·C）',{mid:`1.6\\times(1.6\\times10^{-19})\\approx2.6\\times10^{-19}`}],
   ['B','6.25×10¹⁸ 個','1 A の ときの 個数',{mid:`1\\div(1.6\\times10^{-19})=6.25\\times10^{18}`}]],{opts:{y:220}});
  s+=LEG()+goalTag(G1)+A1(1);
  return s;
 },
 // 6. 誤答 D（分母の 1.6 を落とした）。分母の 1.6 に赤い丸
 [K+'wrongD']:(p)=>{
  const cx=600,cy=160,F=fracParts('1.6','1.6\\times10^{-19}',cx,cy,{size:42,ncol:QQ,dcol:QQ});
  const w16=texWidth('1.6',42,false),dl=cx-F.wd/2;
  let s=card(380,86,440,160,'',.8,C.faint)+F.svg;
  s+=fade(seg(p,.15,.25),`<ellipse cx="${dl+w16/2}" cy="${F.dy}" rx="${w16/2+14}" ry="30" fill="none" stroke="${QC.bad}" stroke-width="4"/>`);
  s+=wrongCard('D','1.6×10¹⁹ 個','分母の 1.6 を 落とした',{y:280,mid:`1.6\\div10^{-19}=1.6\\times10^{19}`,g:seg(p,.05,.12)});
  s+=LEG()+goalTag(G1)+A1(1);
  return s;
 },
 // ================= S2 小問2：電子の列の進む長さ =================
 // 7. 誤答カードとカウンターを消す。導線と門の図に戻る
 [K+'goal2']:(p,ctx)=>{
  let s=wire(tAt(ctx,K+'goal2'))+LEG();
  s+=goalTag(G2,{g:seg(p,.05,.18)});
  return s;
 },
 // 8. 1秒に門を通った電子が導線の何 m ぶんか → 門から左へ 1 m の白い枠と「1 m あたり？ 個」
 [K+'per1m']:(p,ctx)=>{
  const t=tAt(ctx,K+'goal2'),[a,b]=win(ctx,1,.5);
  let s=wire(t);
  s+=card(735,300,320,140,T('1秒に 門を 通る 電子',895,338,{size:24,color:C.dim})+T('1.0×10¹⁹ 個',895,382,{size:30,color:NEG})+T('→ 導線の 何 m ぶん？',895,424,{size:24,color:C.hi}),seg(p,.05,.15),NEG);
  const g2=seg(p,a+.05,a+.15),fx=GX-440;
  s+=fade(g2,rect(fx,WY-HH-12,440,2*HH+24,{fill:WH,fo:.05,stroke:WH,sw:3,rx:6})+line(fx,WY+HH+30,GX,WY+HH+30,{color:WH,w:3})
   +line(fx,WY+HH+18,fx,WY+HH+42,{color:WH,w:3})+label('1 m',fx+220,WY+HH+70,{size:28,color:WH,anchor:'middle',weight:700}));
  s+=chip(fx+40,WY+HH+92,360,T('1 m あたり？ 個',fx+220,WY+HH+133),WH,seg(p,a+.2,a+.3));
  s+=LEG()+goalTag(G2);
  return s;
 },
 // 9. 1 m の柱。「断面積」で断面を、「1 m」で柱の長さを黄で光らせる。体積 2.0×10⁻⁶ m³
 [K+'vol']:(p)=>{
  const sh=seg(p,.24,.3)*(1-seg(p,.4,.46)),lh=seg(p,.4,.46)*(1-seg(p,.55,.6));
  let s=pillar({secHi:sh,lenHi:lh});
  s+=card(170,385,820,84,T('2.0×10⁻⁶ m² × 1 m ＝ 2.0×10⁻⁶ m³',580,438,{size:32}),seg(p,.55,.68),WH);
  s+=LEG()+goalTag(G2);
  return s;
 },
 // 10. 柱の中に青い点が満ちる → 5.0×10²⁸×2.0×10⁻⁶＝1.0×10²³。「1 m あたり 1.0×10²³ 個」
 [K+'count']:(p)=>{
  let s=pillar({fill:lin(p,.05,.5)});
  s+=card(170,385,820,84,T('5.0×10²⁸ × 2.0×10⁻⁶ ＝ 1.0×10²³',580,438,{size:32,color:NEG}),seg(p,.3,.42),NEG);
  s+=chip(600,96,400,T('1 m あたり 1.0×10²³ 個',800,137,{size:28}),WH,seg(p,.75,.86));
  s+=LEG()+goalTag(G2);
  return s;
 },
 // 11. 割り算：分子（門のカウンターの色 青）÷ 分母（柱の札の色 白）。単位 個÷(個/m)＝m
 [K+'div']:(p)=>{
  const cx=600,cy=250;
  let s=fade(seg(p,.04,.14),label('1秒に 通る 個数',cx-330,cy-68,{size:26,color:NEG,anchor:'end',weight:700})
   +rect(cx-210,cy-118,420,86,{fill:NEG,fo:.08,stroke:NEG,sw:3,rx:10})+T('1.0×10¹⁹ 個',cx,cy-62,{size:40,color:NEG}));
  s+=fade(seg(p,.04,.14),line(cx-240,cy,cx+240,cy,{color:WH,w:3}));
  s+=fade(seg(p,.3,.4),label('1 m あたりの 個数',cx-330,cy+70,{size:26,color:WH,anchor:'end',weight:700})
   +rect(cx-210,cy+28,420,86,{fill:WH,fo:.05,stroke:WH,sw:3,rx:10})+T('1.0×10²³ 個/m',cx,cy+84,{size:40}));
  s+=fade(seg(p,.62,.72),T('＝ 列の 長さ',cx+330,cy+12,{size:34,color:C.hi,anchor:'start'}));
  s+=fade(seg(p,.72,.82),label('単位：個 ÷ (個/m) ＝ m',cx,cy+190,{size:26,color:C.dim,anchor:'middle',weight:700}));
  s+=LEG()+goalTag(G2);
  return s;
 },
 // 12. ものさしを大きく拡大。電子の列の先頭が 0.10 mm 進んで止まる。答えの札
 [K+'ans2']:(p,ctx)=>{
  const [a,b]=win(ctx,0,.6),head=.1*lin(p,.08,b*.9);
  let s=card(250,90,700,72,T('1.0×10⁻⁴ m ＝ 0.10 mm',600,138,{size:34,color:C.hi}),seg(p,.03,.12),C.hi);
  s+=ruler(head,{hi:seg(p,b*.9,b)});
  s+=fade(seg(p,b*.85,b),T('1秒で 0.10 mm',RX+400,RY-104,{size:28,color:NEG}));
  s+=note('（大きく 拡大）',RX+800,RY+84,{anchor:'end'});
  s+=LEG()+goalTag(G2)+A2(seg(p,b,b+.08));
  return s;
 },
 // 13. 誤答 A（1 m³ あたりで割った → 単位 m³）。札「1 m³ あたり ≠ 1 m あたり」
 [K+'wrongA2']:(p)=>{
  let s=card(200,90,800,74,T('1.0×10¹⁹ ÷ (1.0×10²³ 個/m) ＝ 1.0×10⁻⁴ m',600,137,{size:30}),.5,C.faint);
  s+=chip(330,180,540,T('1 m³ あたり ≠ 1 m あたり',600,221,{color:C.hi}),C.hi,seg(p,.3,.4));
  s+=wrongCard('A','2.0×10⁻¹⁰ m','1 m³ あたりで 割った（単位 m³）',{y:270,mid:`1.0\\times10^{19}\\div(5.0\\times10^{28})=2.0\\times10^{-10}`,g:seg(p,.05,.12)});
  s+=LEG()+goalTag(G2)+A2(1);
  return s;
 },
 // 14. 誤答 C（逆に割った → 単位 1/m）、誤答 D（光の速さ）。1枚ずつ
 [K+'wrongCD2']:(p,ctx)=>{
  let s=card(200,90,800,74,T('1.0×10¹⁹ ÷ (1.0×10²³ 個/m) ＝ 1.0×10⁻⁴ m',600,137,{size:30}),.5,C.faint);
  s+=wrongSeq(p,ctx,[['C','1.0×10⁴ m','逆に 割った（単位 1/m）',{mid:`1.0\\times10^{23}\\div(1.0\\times10^{19})=1.0\\times10^{4}`}],
   ['D','3.0×10⁸ m','光の 速さと 取り違えた']],{opts:{y:200}});
  s+=LEG()+goalTag(G2)+A2(1);
  return s;
 },
 // ================= S3 小問3：明かりがすぐつく理由 =================
 // 15. 暗転して、電池・スイッチ・電球の回路
 [K+'goal3']:(p)=>{
  let s=cir({sw:0,on:0})+LEG();
  s+=goalTag(G3,{g:seg(p,.05,.18)});
  return s;
 },
 // 16. スイッチを入れる前から、導線じゅうに止まった電子がすき間なく並ぶ
 [K+'full']:(p)=>{
  let s=cir({sw:0,on:0,dots:seg(p,.1,.35),t:0});
  s+=fade(seg(p,.35,.5),T('止まった 電子で いっぱい',990,250,{size:26,color:NEG}));
  s+=LEG()+goalTag(G3);
  return s;
 },
 // 17. スイッチが閉じた瞬間、電気の力の変化（黄）が導線に沿って広がり、すべての電子が同時に少しずつ動き出し、電球が光る。答えの札
 [K+'go']:(p,ctx)=>{
  const [a,b]=win(ctx,1,.6),sw=seg(p,SWP-.06,SWP),tt=sinceClose(ctx);
  let s=cir({sw,on:seg(p,SWP+.03,SWP+.05),dots:1,t:tt});
  // 2026-10-16（PQ-053）：スイッチを閉じた所から、電気の力の変化（黄）が導線に沿って両方へ速く広がる
  const spread=lin(p,SWP,SWP+.06),glowOut=1-seg(p,SWP+.2,SWP+.3);
  if(spread>0&&glowOut>0){const P=loopPath(O.L,O.R,O.T,O.B,O.bx),Lp=pathLen(P);
   let f0=0,acc=0;for(let i=1;i<P.length;i++){const d=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);if(i===4){f0=(acc+(SW2+SW1)/2-O.T)/Lp;break;}acc+=d;}
   const pts=f=>{const a=[];for(let k=0;k<=60;k++)a.push(along(P,f0+f*k/60));return a;};
   const w=.5*spread;
   s+=fade(glowOut,draw(pts(w),1,{color:C.hi,w:9,opacity:.75})+draw(pts(-w),1,{color:C.hi,w:9,opacity:.75}));}
  s+=fade(seg(p,SWP+.02,SWP+.08)*(1-seg(p,SWP+.3,SWP+.36)),T('電気の 力の 変化が',990,200,{size:26,color:C.hi})+T('導線に 沿って 速く 伝わる',990,240,{size:26,color:C.hi}));
  s+=fade(seg(p,SWP+.36,SWP+.42),T('全部が 同時に 動き出す',990,250,{size:26,color:NEG}));
  s+=LEG()+goalTag(G3)+A3(seg(p,a,a+.08));
  return s;
 },
 // 18. 右に満水のホース。押すと反対の口から水。→「たとえと違う所：押すのは電気の力」→ ホースを消す
 [K+'hose']:(p,ctx)=>{
  const [a,b]=win(ctx,1,.5),ve=voiceEnd(ctx);
  let s=cir({sw:1,on:1,dots:1,t:sinceClose(ctx)});
  s+=hose(seg(p,.12,.3),{g:seg(p,.02,.1)*(1-seg(p,ve-.02,ve+.06))});
  s+=card(830,300,350,110,T('たとえと 違う所',1005,342,{size:26,color:C.dim})+T('押すのは 電気の 力',1005,388,{size:28,color:C.hi}),seg(p,a+.05,a+.15),C.hi);
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 19. 誤答 A（電流はどこでも同じ）、誤答 B（0.10 mm と矛盾）。1枚ずつ
 [K+'wrongAB3']:(p,ctx)=>{
  let s=fade(.4,cir({sw:1,on:1,dots:1,t:sinceClose(ctx)}));
  s+=wrongSeq(p,ctx,[['A','電球の 近くで 急に 速くなる','電流は どこでも 同じ'],['B','光の 速さで 届く','1秒に 0.10 mm と 矛盾']],{opts:{y:300}});
  s+=LEG()+goalTag(G3)+A3(1);
  return s;
 },
 // 20. 誤答 C（移るのはエネルギー）→ カードを消し、1.0×10¹⁹ 個 → 1 m あたり 1.0×10²³ 個 → 1秒に 0.10 mm
 [K+'wrongC3']:(p,ctx)=>{
  const ve=voiceEnd(ctx),[a,b]=win(ctx,1,.5),out=seg(p,ve,ve+.05);
  let s=fade((.4+.6*seg(p,a,a+.06))*(1-out),cir({sw:1,on:1,dots:1,t:sinceClose(ctx)}));
  // 電球のまわりに橙の光（エネルギー）
  const rays=seg(p,a,a+.08)*(1-out);
  if(rays>0){let r='';for(let i=0;i<8;i++){const an=Math.PI*2*i/8,r0=50,r1=72;r+=line(O.ex+r0*Math.cos(an),O.T+r0*Math.sin(an),O.ex+r1*Math.cos(an),O.T+r1*Math.sin(an),{color:QC.U,w:4});}
   s+=fade(rays,r+label('エネルギー',O.ex+70,O.T-44,{size:26,color:QC.U,weight:700}));}
  s+=wrongCard('C','電荷が 消えて 光になる','移るのは エネルギー',{y:300,g:seg(p,.02,.08)*(1-out)});
  const r=1-ve,at=f=>ve+f*r;
  s+=chain([seg(p,at(.12),at(.24)),seg(p,at(.28),at(.4)),seg(p,at(.44),at(.56))]);
  s+=LEG()+goalTag(G3,{g:1-out});
  s+=A3(1-out)+answerRow([[1,'C',''],[2,'B',''],[3,'D','']],{g:seg(p,at(.6),at(.72))});
  return s;
 },
};
export const qxHsECurrent1Diagrams=Object.fromEntries(Object.entries(D0).map(([k,f])=>[k,(p,ctx)=>fixSup(f(p,ctx))]));

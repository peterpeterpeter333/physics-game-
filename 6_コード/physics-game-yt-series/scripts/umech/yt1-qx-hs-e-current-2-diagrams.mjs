// 問題編 解説「9.0 V の電池は、何を渡す？」(ys-qx-hs-e-current-2) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/401_電流とオームの法則.md の q-hs-e-current-2（解説 19 行）。
// 色：電流 I 緑、電荷 Q 桃、電圧 V 紫、エネルギー W 橙、抵抗 R 白、電子 青、正電荷 赤、強調 黄。右下に凡例（R 白・電子 青・正電荷 赤）。
// 回路：電池は下の導線（長い線＝＋極が右）、電球は上の導線。電流は ＋極 → 右 → 上を左へ（電球を右から左へ）→ 左 → −極。
//   だから電球の右端が「高い」側、左端が「低い」側。拡大図も同じ向き（右が高い）で描く。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 単元動画（yt1-hs-e-current-1）の部品を読み込んで使う（そのファイルは編集しない）。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,axes,clamp,mix,move,scaleAt} from './anim.mjs';
import {IC,VC,QC as QCOL,WC,NEG,POS,RC,Vt,Wt,Qt,qtok,electron,battery,bulb,loopPath,along,pathLen,circuit,fcard} from './yt1-hs-e-current-1-diagrams.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,legend,sentWin,voiceEnd,cueT,tAt,textW} from './yt1-qx-common.mjs';

const K='qx-hs-e-current-2:';
const G1='電池が渡したエネルギー',G2='電球の両端の電圧',G3='電球の中の電子の向き';
const A1=g=>answerTag(1,'A','3.6 J',{g}),A2=g=>answerTag(2,'D','9.0 V',{g}),A3=g=>answerTag(3,'B','',{g});
const LG=(g=1)=>legend([['R 白',RC],['電子 青',NEG],['正電荷 赤',POS]],830,508,{dir:'row',size:22,g});
const TX=(src,x,y,o={})=>tex(src,x,y,{size:44,auto:false,...o});
const U=s=>`\\ \\mathrm{${s}}`;
// 読み（かな）の中で word が始まる所（cue の進み 0〜1）。誤答カードの切り替えに使う。
function atWord(ctx,word,fb=.5){
 const r=(ctx?.cue?.reading??'').replace(/\s/g,''),i=r.indexOf(word.replace(/\s/g,''));
 return i<0||!r.length?fb:i/r.length*voiceEnd(ctx);
}
// ---- 回路 ----------------------------------------------------------------------------------------
const CQ={L:300,R:900,T:140,B:400,bx:600,ex:600};   // 出題中の図（大きい回路）
const CL={L:60,R:520,T:140,B:400,bx:290,ex:290};    // 左に寄せた回路（小問1 の定義）
const CS={L:70,R:450,T:150,B:330,bx:260,ex:260};    // グラフと並べる小さい回路（小問2）
const mixO=(a,b,u)=>Object.fromEntries(Object.keys(a).map(k=>[k,mix(a[k],b[k],u)]));
// ＋極から出る向きに、電流の矢印を1本ずつ（u＝0→1）
function curArrows(o,u=1){
 const {L,R,T,B,bx,ex}=o;
 const A=[[bx+50,B,R-40,B],[R,B-40,R,T+40],[R-40,T,ex+70,T],[ex-70,T,L+40,T],[L,T+40,L,B-40],[L+30,B,bx-50,B]];
 return A.map((a,i)=>arrow(...a,{color:IC,w:6,head:18,g:seg(u,i/6,(i+1)/6)})).join('');
}
const V9=(o,g=1)=>fade(g,label('9.0 V',o.bx-50,o.B+60,{size:32,color:VC,anchor:'end',weight:700}));
const Q04=(o,g=1)=>fade(g,label('送り出した電荷 0.40 C',o.bx,o.B-80,{size:28,color:QCOL,anchor:'middle',weight:700}));
function setup(o=CQ,{g=1,cu=1,v=1,q=1,on=1,batt='電池'}={}){
 return fade(g,circuit({o,on,batt})+curArrows(o,cu)+V9(o,v)+Q04(o,q));
}
// ---- 電気の高さのグラフ（回路 CS を一周）-------------------------------------------------------
const P2=loopPath(CS.L,CS.R,CS.T,CS.B,CS.bx),LP2=pathLen(P2);
const fAt=(x,y)=>{let L=0;for(let i=1;i<P2.length;i++){const [a,b]=[P2[i-1],P2[i]],d=Math.hypot(b[0]-a[0],b[1]-a[1]);
 if(Math.abs(a[1]-b[1])<1&&Math.abs(a[1]-y)<1&&(x-a[0])*(x-b[0])<=0)return (L+Math.abs(x-a[0]))/LP2;L+=d;}return 0;};
const FB1=fAt(CS.ex+34,CS.T),FB2=fAt(CS.ex-34,CS.T),SB=.15,SEND=1+SB;
const hAt=s=>s<=SB?9*s/SB:(()=>{const f=s-SB;return f<FB1?9:f<FB2?9*(1-(f-FB1)/(FB2-FB1)):0;})();
function posAt(s){if(s<=SB)return [mix(CS.bx-11,CS.bx+11,s/SB),CS.B];return along(P2,Math.min(.9999,s-SB));}
const GX={x:560,y:330,w:540,h:180};
// upto＝どこまで描くか、dotAt＝黄の点、marks＝区間の名前、hiFlat＝導線の区間を黄で光らせる、steps＝段の数値
function hGraph({upto=SEND,g=1,dotAt=null,marks=1,hiFlat=0,up=0,down=0,flat=0,ax=GX,zero=1}={}){
 const A=axes({...ax,xmin:0,xmax:SEND,ymin:0,ymax:12,ylabel:'電気の 高さ',ycolor:VC});
 let s=A.svg;
 s+=label('9.0 V',A.X(0)-14,A.Y(9)+8,{size:22,color:VC,anchor:'end',weight:700})+line(A.X(0)-6,A.Y(9),A.X(0)+6,A.Y(9),{color:C.dim,w:2});
 if(zero)s+=label('0 V',A.X(0)-14,A.Y(0)+8,{size:22,color:VC,anchor:'end',weight:700});
 s+=label('回路の 道のり',A.X(SEND)-10,A.Y(0)-14,{size:22,color:C.dim,anchor:'end'});
 s+=line(A.X(0),A.Y(9),A.X(SEND),A.Y(9),{color:C.grid,w:1.5});
 if(upto>.001)s+=A.plot(hAt,{from:0,to:upto,color:VC,w:5,steps:300});
 if(hiFlat){s+=fade(hiFlat,line(A.X(SB),A.Y(9),A.X(SB+FB1),A.Y(9),{color:C.hi,w:10})+line(A.X(SB+FB2),A.Y(0),A.X(SEND),A.Y(0),{color:C.hi,w:10}));}
 if(marks){
  const m=(a,b,t,col,w=700)=>label(t,(A.X(a)+A.X(b))/2,A.Y(0)+34,{size:22,color:col,anchor:'middle',weight:w});
  s+=fade(marks,m(0,SB,'電池',C.ink)+m(SB,SB+FB1,'導線',C.dim,400)+m(SB+FB1,SB+FB2,'電球',C.hi)+m(SB+FB2,SEND,'導線',C.dim,400));
 }
 if(up)s+=fade(up,label('＋9.0 V',A.X(SB)+12,A.Y(4.5)+8,{size:26,color:VC,weight:700}));
 if(flat)s+=fade(flat,label('導線：平ら',(A.X(SB)+A.X(SB+FB1))/2,A.Y(9)-14,{size:24,color:C.ink,anchor:'middle',weight:700}));
 if(down){const xm=(A.X(SB+FB1)+A.X(SB+FB2))/2;s+=fade(down,label('−9.0 V',xm+18,A.Y(4.5)+8,{size:26,color:VC,weight:700}));}
 if(dotAt!==null)s+=dot(A.X(dotAt),A.Y(hAt(dotAt)),10,C.hi);
 return fade(g,s);
}
function smallCircuit({o=CS,dotAt=null,hlL=0,ends=0,minus=0,batt=''}={}){
 let s=circuit({o,on:1,batt})+curArrows(o,1);
 if(dotAt!==null){const [x,y]=posAt(dotAt);s+=dot(x,y,10,C.hi);}
 if(hlL)s+=fade(hlL,ring(o.ex,o.T,50,{color:C.hi,w:3}));
 if(ends)s+=fade(ends,dot(o.ex-34,o.T,9,C.hi)+dot(o.ex+34,o.T,9,C.hi));
 if(minus)s+=fade(minus,label('0 V',o.bx-30,o.B+50,{size:28,color:VC,anchor:'end',weight:700}));
 return s;
}
// ---- 1 C あたりの箱（小問1）--------------------------------------------------------------------
function boxes(p,ctx){
 const W=sentWin(ctx),a2=W[1]?W[1][0]:.5,b2=W[1]?W[1][1]:1;
 const x0=110,w=560,cut=seg(p,a2+.04,a2+.16),lab2=seg(p,a2+.18,a2+.3);
 const bar=(y,col,txt,g)=>{let s=rect(x0,y,w*.4,70,{fill:col,fo:.45,stroke:col,sw:2.5,rx:6})+fade(1-.75*cut,rect(x0+w*.4,y,w*.6,70,{fill:col,fo:.45,stroke:col,sw:2.5,rx:6}));
  s+=fade(1-cut,label(txt,x0+w/2,y+46,{size:32,color:C.ink,anchor:'middle',weight:700}));return fade(g,s);};
 let s=fade(seg(p,.02,.1),label('9.0 V の 電池',x0,112,{size:26,color:VC,weight:700}));
 s+=bar(140,QCOL,'1 C',seg(p,.02,.1));
 const yo=mix(300,214,seg(p,.12,.3));
 s+=bar(yo,WC,'9.0 J',seg(p,.1,.2));
 s+=fade(seg(p,.25,.35)*(1-cut),label('1 C ごとに 9.0 J',x0+w+20,250,{size:26,color:WC,weight:700}));
 for(let i=1;i<10;i++)s+=fade(seg(p,.02,.1)*.6,line(x0+w*i/10,140,x0+w*i/10,150,{color:C.ink,w:2}));
 s+=fade(cut,line(x0+w*.4,124,x0+w*.4,300,{color:C.hi,w:4,dash:'10 7'}));
 s+=fade(lab2,label('0.40 C',x0+w*.2,186,{size:30,color:C.ink,anchor:'middle',weight:700})+label('0.40 × 9.0 J',x0+w*.2,260,{size:26,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(lab2,label('同じ 割合で 切る',x0+w*.4,340,{size:24,color:C.hi,anchor:'middle',weight:700}));
 const gF=seg(p,a2+.5*(b2-a2),a2+.5*(b2-a2)+.08);
 s+=fcard(760,140,400,150,`${Wt}=${Qt}${Vt}`,{size:64,col:WC,g:gF});
 return s;
}
// 単位の確かめ「0.40 C × 9.0 J/C ＝ 3.6 J」。C に打ち消し線（st＝0→1 で、線のない式から線のある式へ）
function unitRow(cx,y,{g=1,st=0,size=40}={}){
 const c=k=>k?`{\\color{${C.hi}}\\cancel{\\color{${QCOL}}\\mathrm{C}}}`:`{\\color{${QCOL}}\\mathrm{C}}`;
 const row=k=>`0.40\\ ${c(k)}\\times9.0\\ \\mathrm{J}/${c(k)}={\\color{${WC}}3.6\\ \\mathrm{J}}`;
 return fade(g,fade(1-st,TX(row(0),cx,y,{size}))+fade(st,TX(row(1),cx,y,{size})));
}
const W1=`${Wt}=${Qt}${Vt}=0.40${U('C')}\\times9.0${U('V')}=3.6${U('J')}`;
// ---- 電球の拡大（小問3）。右が高い側、左が低い側 -------------------------------------------------
const ZB={x:600,y:215,r:115};
function zoomBulb(t,{g=1,lv=1,cur=0,el=0,hiLab=0,tag=1}={}){
 const {x,y,r}=ZB;
 let s=line(300,y,x-r,y,{color:C.dim,w:5})+line(x+r,y,900,y,{color:C.dim,w:5});
 s+=ring(x,y,r,{color:C.ink,w:3,fill:'#2a2a20'})+dot(x,y,r+24,'#ffe9a0',.08);
 const fil=[[x-r,y]];for(let i=1;i<12;i++)fil.push([x-r*.75+r*1.5*i/12,y+(i%2?-16:16)]);fil.push([x+r,y]);
 s+=draw([[x-r,y],[x-r*.75,y],...fil.slice(1,-1),[x+r*.75,y],[x+r,y]],1,{color:C.hi,w:3});
 const lab=(t2,X)=>{const col=hiLab>.5?C.hi:VC;return fade(lv,(hiLab?fade(hiLab,rect(X-50,y-108,100,46,{fill:C.hi,fo:.12,stroke:C.hi,sw:2.5,rx:10})):'')+label(t2,X,y-75,{size:30,color:col,anchor:'middle',weight:700}));};
 s+=lab('低い',360)+lab('高い',840);
 if(tag)s+=label('電球（拡大）',x,y+r+38,{size:22,color:C.dim,anchor:'middle'});
 if(cur)s+=fade(cur,arrow(x+90,y-48,x-90,y-48,{color:IC,w:6,head:18})+label('電流',x,y-62,{size:26,color:IC,anchor:'middle',weight:700}));
 if(el){let e='';const sp=95,v=70;for(let k=0;k<8;k++){const X=310+(((v*t+k*sp)%(8*sp))+8*sp)%(8*sp);if(X>890)continue;e+=electron(X,y+52);}
  s+=fade(el,e+arrow(x-90,y+92,x+90,y+92,{color:NEG,w:5,head:16})+label('電子',x+110,y+101,{size:24,color:NEG,weight:700}));}
 return fade(g,s);
}

export const qxHsECurrent2Diagrams={
 // ================= 問題アニメ：出題中（小問1〜3 共通、4 秒＋静止）=================
 // 0〜2 秒：回路（電池・電球・導線）、緑の電流の矢印が ＋極から出る向きに1本ずつ。2〜4 秒：「9.0 V」（紫）、「送り出した電荷 0.40 C」（桃）。
 // 出さないもの：電子の動く向き、電気の高さのグラフ、エネルギーの値、電球の両端の電圧。
 [K+'q0']:(p)=>setup(CQ,{g:seg(p,0,.2),cu:lin(p,.2,.5),v:seg(p,.5,.62),q:seg(p,.72,.85),on:seg(p,.1,.25)})+LG(),
 // ================= S1 小問1：電池が渡すエネルギー =================
 // 1. 出題中の回路。求めるもの
 [K+'goal1']:(p)=>setup(CQ)+goalTag(G1,{g:seg(p,.03,.15)})+LG(),
 // 2. 記号の札（Q・W・V）を図の上に置いてから、定義タグと V＝W/Q、1 V＝1 J/C
 [K+'def']:(p)=>{
  const u=seg(p,.02,.14),o=mixO(CQ,CL,u);
  let s=circuit({o,on:1,batt:''})+curArrows(o,1-u)+V9(o,1-u)+Q04(o,1-u);
  const tx=mix(o.bx-110,o.bx+110,seg(p,.16,.42)),B=o.B,gq=seg(p,.15,.22),gw=seg(p,.28,.36),gv=seg(p,.42,.5);
  s+=fade(gq,qtok(tx,B)+label('Q：運ぶ電荷',tx+20,B+44,{size:24,color:QCOL,anchor:'middle',weight:700}));
  s+=fade(gw,rect(tx-28,B-108,56,44,{fill:WC,fo:.5,stroke:WC,sw:2,rx:6})+label('W',tx,B-77,{size:26,color:C.ink,anchor:'middle',weight:700})+line(tx,B-64,tx,B-56,{color:WC,w:2})
   +label('W：電気の力がする仕事',o.bx,B-122,{size:24,color:WC,anchor:'middle',weight:700}));
  s+=fade(gv,ring(o.bx,B,40,{color:VC,w:3})+label('V：電圧',o.bx-30,B+80,{size:26,color:VC,anchor:'end',weight:700}));
  s+=kindTag('定義',890,128,{g:seg(p,.54,.6)});
  s+=fcard(640,160,500,150,`${Vt}=\\dfrac{${Wt}}{${Qt}}`,{size:56,col:VC,g:seg(p,.58,.66)});
  s+=fcard(640,330,500,110,`1${U('V')}=1${U('J/C')}`,{size:46,col:VC,g:seg(p,.7,.78)});
  s+=goalTag(G1);
  return s+LG();
 },
 // 3. 1 C の桃の箱に 9.0 J の橙の箱。0.40 個ぶんに切る → W＝QV
 [K+'wqv']:(p,ctx)=>boxes(p,ctx)+goalTag(G1)+LG(),
 // 4. W＝0.40 C×9.0 V＝3.6 J、単位の C に打ち消し線。答え A
 [K+'calc']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=card(110,96,980,120,TX(W1,600,156,{size:44}),seg(p,.02,.12),WC);
  s+=fade(seg(p,.2,.28),label('9.0 V ＝ 9.0 J/C',600,262,{size:26,color:VC,anchor:'middle',weight:700}));
  s+=unitRow(600,316,{g:seg(p,.22,.3),st:seg(p,.34,.46)});
  s+=goalTag(G1)+A1(seg(p,b,b+.06));
  return s+LG();
 },
 // 5. 誤答 B（V÷C）、誤答 C（C÷V）を1枚ずつ
 [K+'wrongBC']:(p,ctx)=>{
  const c=atWord(ctx,'スィーは');
  let s=card(110,96,980,120,TX(W1,600,156,{size:44}),.5,WC);
  s+=wrongSeq(p,ctx,[['B','22.5 J','V÷C は J ではない',{mid:'9.0\\div0.40=22.5'}],['C','0.044 J','C÷V は J ではない',{mid:'0.40\\div9.0\\approx0.044'}]],{win:[[0,c],[c,1]],opts:{y:276}});
  s+=goalTag(G1)+A1(1);
  return s+LG();
 },
 // 6. 誤答 D（足した）。2文目で「1 C ごとに 9.0 J → 掛け算」
 [K+'wrongD']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=card(110,96,980,120,TX(W1,600,156,{size:44}),.5+.5*seg(p,b,b+.06),WC);
  s+=fade(seg(p,b,b+.08),label('1 C ごとに 9.0 J　→　0.40 C なら 掛け算',600,252,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=wrongCard('D','9.4 J','V と C を足した',{y:276,mid:'9.0+0.40=9.4',g:seg(p,.02,.08)});
  s+=goalTag(G1)+A1(1);
  return s+LG();
 },
 // ================= S2 小問2：電球の両端の電圧 =================
 // 7. 出題中の回路。電球の両端に黄の点
 [K+'goal2']:(p)=>{
  let s=setup(CQ,{q:0})+fade(seg(p,.25,.4),dot(CQ.ex-34,CQ.T,10,C.hi)+dot(CQ.ex+34,CQ.T,10,C.hi));
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s+LG();
 },
 // 8. 回路を左に縮め、右に空のグラフ。−極に「0 V」
 [K+'graph']:(p)=>{
  const u=seg(p,.03,.22),o=mixO(CQ,CS,u);
  let s=circuit({o,on:1,batt:''})+curArrows(o,1)+V9(o,1-u)+fade(1-u,dot(o.ex-34,o.T,10,C.hi)+dot(o.ex+34,o.T,10,C.hi));
  s+=hGraph({upto:0,g:seg(p,.22,.34),marks:seg(p,.3,.42),zero:0});
  s+=fade(seg(p,.58,.68),label('0 V',CS.bx-30,CS.B+50,{size:28,color:VC,anchor:'end',weight:700})+line(CS.bx-28,CS.B+38,CS.bx-14,CS.B+16,{color:VC,w:2}));
  s+=fade(seg(p,.6,.7),dot(CS.bx-11,CS.B,10,C.hi)+label('0 V',GX.x-14,GX.y+8,{size:22,color:VC,anchor:'end',weight:700})+dot(GX.x,GX.y,10,C.hi));
  s+=goalTag(G2);
  return s+LG();
 },
 // 9. 電池の中で 9.0 V 上がる（1文目）→ 導線の区間は平ら（2文目）
 [K+'up']:(p,ctx)=>{
  const W=sentWin(ctx),a1=W[0][0],b1=W[0][1],b=W[1]?W[1][0]:.5,b2=W[1]?W[1][1]:1;
  const s0=b<.99?(p<b?SB*seg(p,a1+.05,b1-.05):mix(SB,SB+FB1,seg(p,b+.15*(b2-b),b+.75*(b2-b)))):SB*p;
  let s=smallCircuit({dotAt:s0,minus:1});
  s+=hGraph({upto:s0,dotAt:s0,up:seg(p,b1-.12,b1-.04),flat:seg(p,b+.6*(b2-b),b+.7*(b2-b))});
  s+=goalTag(G2);
  return s+LG();
 },
 // 10. 電球の区間で 9.0 V 下がって 0 に戻る
 [K+'down']:(p)=>{
  const s0=p<.6?mix(SB+FB1,SB+FB2,seg(p,.12,.55)):mix(SB+FB2,SEND-.001,seg(p,.6,.78));
  let s=smallCircuit({dotAt:s0,minus:1,hlL:seg(p,.05,.15)});
  s+=hGraph({upto:s0,dotAt:s0,up:1,flat:1,down:seg(p,.5,.6)});
  return s+goalTag(G2)+LG();
 },
 // 11. 電圧計を電球の両端に当てて 9.0 V。答え D
 [K+'meter']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6,o=CS,mx=o.ex,my=o.T+96,gm=seg(p,.05,.2);
  let s=smallCircuit({minus:1})+hGraph({up:1,flat:1,down:1});
  s+=fade(gm,draw([[o.ex-40,o.T],[o.ex-40,my],[mx-30,my]],1,{color:VC,w:3})+draw([[o.ex+40,o.T],[o.ex+40,my],[mx+30,my]],1,{color:VC,w:3})
   +ring(mx,my,30,{color:VC,w:3,fill:'#1b1838'})+label('V',mx,my+11,{size:30,color:VC,anchor:'middle',weight:700})+dot(o.ex-40,o.T,7,VC)+dot(o.ex+40,o.T,7,VC));
  s+=fade(seg(p,.2,.3),label('9.0 V',mx+58,my+12,{size:32,color:VC,weight:700}));
  s+=goalTag(G2)+A2(seg(p,b,b+.06));
  return s+LG();
 },
 // 12. 誤答 A（0 V）
 [K+'wrongA']:(p)=>{
  let s=smallCircuit({minus:1})+hGraph({up:1,flat:1,down:1});
  s+=wrongCard('A','0 V','電圧は流れる量ではない',{y:385,g:seg(p,.02,.08)});
  return s+goalTag(G2)+A2(1)+LG();
 },
 // 13. 誤答 B（半分ずつ：導線の区間は平ら、を光らせる）→ 誤答 C（J と V）
 [K+'wrongBC2']:(p,ctx)=>{
  const c=atWord(ctx,'スィーは');
  let s=smallCircuit({minus:1})+hGraph({up:1,flat:1,down:1,hiFlat:seg(p,.04,.12)*(1-seg(p,c-.04,c))});
  s+=wrongSeq(p,ctx,[['B','4.5 V','導線の区間は平ら'],['C','3.6 V','J と V の取り違え']],{win:[[0,c],[c,1]],opts:{y:385}});
  return s+goalTag(G2)+A2(1)+LG();
 },
 // ================= S3 小問3：電子の向き =================
 // 14. 電球を拡大
 [K+'goal3']:(p)=>zoomBulb(0,{g:seg(p,.05,.2),lv:0})+goalTag(G3,{g:seg(p,.03,.15)})+LG(),
 // 15. 「高い」「低い」、電流（緑）は高い → 低い。2文目で逆向きの電子（青）
 [K+'flow']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,t=Math.max(0,cueT(ctx)-(ctx?.dur??8)*b);
  let s=zoomBulb(t,{lv:seg(p,.03,.12),cur:seg(p,.15,.3),el:seg(p,b+.12,b+.25)});
  return s+goalTag(G3)+LG();
 },
 // 16. 電子は低い → 高い。札を黄で光らせる。答え B
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6,t=tAt(ctx,K+'flow');
  let s=zoomBulb(t,{cur:.35,el:1,hiLab:seg(p,.1,.2)});
  return s+goalTag(G3)+A3(seg(p,b,b+.06))+LG();
 },
 // 17. 誤答 A（それは電流の向き）
 [K+'wrong3A']:(p,ctx)=>{
  const t=tAt(ctx,K+'flow');
  let s=zoomBulb(t,{cur:1,el:1});
  s+=wrongCard('A','高い側から低い側','それは電流の向き',{y:350,g:seg(p,.02,.08)});
  return s+goalTag(G3)+A3(1)+LG();
 },
 // 18. 誤答 C・D（1文目 C、2文目 D）。電子が回路を回り続ける。2文目で電球からエネルギー（橙）
 [K+'wrong3CD']:(p,ctx)=>{
  const t=cueT(ctx),W=sentWin(ctx),b=W[1]?W[1][0]:.5,o={L:330,R:870,T:130,B:300,bx:600,ex:600};
  let s=circuit({o,on:1,elec:1,t,ev:70,n:24,batt:''});
  const ge=seg(p,b+.05,b+.15);
  for(let i=0;i<6;i++){const a=-Math.PI*(i+.5)/6;s+=fade(ge,line(o.ex+48*Math.cos(a),o.T+48*Math.sin(a),o.ex+80*Math.cos(a),o.T+80*Math.sin(a),{color:WC,w:4}));}
  s+=fade(ge,label('電球で 移るのは エネルギー',1035,190,{size:22,color:WC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.03,.12),label('電子は 回り続ける',180,215,{size:24,color:NEG,anchor:'middle',weight:700}));
  s+=wrongSeq(p,ctx,[['C','止まっている','電荷は減らない'],['D','中心へ集まる','電荷は減らない']],{opts:{y:350}});
  return s+goalTag(G3)+A3(1)+LG();
 },
 // ================= S4 まとめ =================
 [K+'sum']:(p,ctx)=>{
  const t=cueT(ctx);
  let s=answerRow([[1,'A','3.6 J'],[2,'D','9.0 V'],[3,'B','']],{g:seg(p,.02,.1)});
  s+=card(200,88,800,84,TX(`0.40${U('C')}\\times9.0${U('V')}=3.6${U('J')}`,600,130,{size:40}),seg(p,.05,.15),WC);
  s+=fade(seg(p,.2,.32),hGraph({ax:{x:110,y:420,w:420,h:150},up:1,down:1,flat:0}));
  s+=fade(seg(p,.4,.52),move(300,125,scaleAt(600,215,.65,zoomBulb(t,{cur:0,el:1,tag:0}))));
  s+=fade(seg(p,.4,.52),label('電子：低い側 → 高い側',900,454,{size:24,color:NEG,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.72),label('電池 ＝ 1 C ごとに 9.0 J を 渡す ポンプ',600,214,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s+LG();
 },
};

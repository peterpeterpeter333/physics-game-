// 問題編 解説「線電荷を円筒面が包む」（q-ue-gauss、大学編 21 ガウスの法則・上級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/21_ガウスの法則.md の q-ue-gauss（解説 21 行）。
// 色：電場 𝐄 水色、法線 桃、面積 金、Φ・強調 黄、線電荷 λ₁ 紫、円筒面 λ₂（負）青、誤り 赤（単元動画 ue-gauss-5 と同じ）。
// 左：斜めから見た図（縦の軸＝線電荷、円筒面は縦の円筒、ふたは横長の楕円で奥の半分は点線）。右：軸に垂直に切った断面図。
// 長さの縮尺：左の図 0.30 m＝100 px、断面図 0.30 m＝90 px。札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
import {C,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,move} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,sentWin,cueT,voiceEnd} from './yt1-qx-common.mjs';
import {charge} from './yt1-ui-closed-bag-1-diagrams.mjs';
import {T,cs} from './yt1-ui-closed-bag-1-diagrams.mjs';

const K='qx-ue-gauss:';
const LAM=C.v,CYL='#7fb3ff',EC=C.x,BAD='#ff6b6b',AREA='#ffcf67',HI=C.hi;
const G1='r ＝ 0.15 m の E',G2='r ＝ 0.60 m の E',G3='E ＝ 0 と 言えた 理由';
const ANS1=g=>answerTag(1,'D','600 N/C',{g}),ANS2=g=>answerTag(2,'B','0 N/C',{g}),ANS3=g=>answerTag(3,'B','',{g});
const blink=ctx=>.5+.5*Math.sin(cueT(ctx)*7);
const inWin=(p,[a,b],last=false)=>seg(p,a+.005,a+.04)*(last?1:1-seg(p,b-.03,b));
const L1=cs(LAM,'\\lambda_1'),EE=cs(EC,'E');

// ---- 左：斜めから見た図 ----
const AX=240,KX=333,SQ=.28;// 0.30 m → 100 px、楕円の縦横比
const TOP=128,BOT=478;     // 円筒面を描く範囲（実際は無限に長い）
function ellipse(cx,cy,rx,{col=CYL,w=3,g=1,fill=null,fo=.08,back=1}={}){
 const ry=rx*SQ,n=40;const fr=[],bk=[];
 for(let i=0;i<=n;i++){const a=Math.PI*i/n;fr.push([cx+rx*Math.cos(a),cy+ry*Math.sin(a)]);bk.push([cx+rx*Math.cos(a),cy-ry*Math.sin(a)]);}
 let s='';if(fill)s+=`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" fill-opacity="${fo}"/>`;
 s+=draw(fr,1,{color:col,w})+(back?draw(bk,1,{color:col,w:Math.max(1.5,w-1),dash:'6 6',opacity:.7}):'');
 return fade(g,s);
}
function lineCharge({g=1,y0=84,y1=512,lbl=1}={}){return fade(g,line(AX,y0,AX,y1,{color:LAM,w:7})+(lbl?label('λ₁ ＝ +5 nC/m',AX+16,104,{size:26,color:LAM,weight:700}):''));}
function shell({g=1,grow=1,lbl=1,op=1}={}){
 const rx=.30*KX,yt=mix(300,TOP,grow),yb=mix(300,BOT,grow);
 let s=`<rect x="${AX-rx}" y="${yt}" width="${2*rx}" height="${yb-yt}" fill="${CYL}" fill-opacity=".07"/>`;
 s+=line(AX-rx,yt,AX-rx,yb,{color:CYL,w:3})+line(AX+rx,yt,AX+rx,yb,{color:CYL,w:3});
 s+=ellipse(AX,yt,rx,{col:CYL})+ellipse(AX,yb,rx,{col:CYL});
 if(lbl)s+=fade(seg(grow,.7,1),label('λ₂ ＝ −5 nC/m',AX+rx+14,yt+12,{size:26,color:CYL,weight:700}));
 return fade(g*op,s);
}
// ガウスの円筒（点線）。r は m、y は上のふた・下のふた
const GY0=210,GY1=400;
function gcyl(r,{g=1,col=HI,lbl=1}={}){
 const rx=r*KX;let s=line(AX-rx,GY0,AX-rx,GY1,{color:col,w:3,dash:'8 7'})+line(AX+rx,GY0,AX+rx,GY1,{color:col,w:3,dash:'8 7'});
 s+=ellipse(AX,GY0,rx,{col,w:3})+ellipse(AX,GY1,rx,{col,w:3});
 if(lbl)s+=label('L',AX-rx-14,(GY0+GY1)/2+8,{size:28,color:col,weight:700,anchor:'end'});
 return fade(g,s);
}
// ふたの上の電場（ふたの面に沿う）と、側面の電場（外向き）
function capArrows(r,{g=1}={}){let s='';const rx=r*KX;
 for(const y of [GY0,GY1])for(const a of [0,Math.PI]){const x0=AX+18*Math.cos(a),x1=AX+(rx+34)*Math.cos(a);s+=arrow(x0,y,x1,y,{color:EC,w:4,head:12});}
 return fade(g,s);}
function sideArrows(r,{g=1}={}){let s='';const rx=r*KX;
 for(const y of [255,305,355])for(const sg of [-1,1])s+=arrow(AX+sg*(rx+4),y,AX+sg*(rx+50),y,{color:EC,w:4,head:12});
 return fade(g,s);}
const leftFig=({g=1,shellOp=1}={})=>fade(g,shell({op:shellOp})+lineCharge());

// ---- 右：断面図 ----
const SX=870,SY=300,SK=300;// 1 m → 300 px
const P15=[SX+.15*SK,SY],P60=[SX+.60*SK,SY];
function section({g=1,marks=1,hl15=0,hl60=0,rot=0,lblA=1,shellOp=1}={}){
 let s=label('断面図（軸に 垂直に 切る）',SX,108,{size:22,color:C.dim,anchor:'middle'});
 s+=fade(shellOp,ring(SX,SY,.30*SK,{color:CYL,w:4})+(lblA?label('−5 nC/m',SX-.30*SK*.72-6,SY-.30*SK*.72-8,{size:24,color:CYL,weight:700,anchor:'end'})+line(SX,SY,SX,SY-.30*SK,{color:C.ink,w:2})+label('a ＝ 0.30 m',SX+10,SY-.30*SK*.5,{size:22,color:C.ink,weight:700}):''));
 // 回転が見える小さな印（円筒面の上）
 if(rot)s+=dot(SX+.30*SK*Math.cos(rot),SY-.30*SK*Math.sin(rot),6,CYL);
 s+=dot(SX,SY,9,LAM)+label('+5 nC/m',SX-.30*SK-10,SY+.30*SK*.8,{size:24,color:LAM,weight:700,anchor:'end'})+line(SX-.30*SK-6,SY+.30*SK*.8-8,SX-6,SY+6,{color:LAM,w:1.5,dash:'3 5'});
 if(marks){
  s+=line(SX,SY,P60[0],SY,{color:C.dim,w:2,dash:'4 6'});
  s+=dot(...P15,7,C.ink)+fade(hl15,ring(...P15,16,{color:HI,w:4}))+label('0.15 m',P15[0]+4,SY+34,{size:24,color:hl15>.5?HI:C.ink,weight:700,anchor:'middle'});
  s+=dot(...P60,7,C.ink)+fade(hl60,ring(...P60,16,{color:HI,w:4}))+label('0.60 m',P60[0],SY+34,{size:24,color:hl60>.5?HI:C.ink,weight:700,anchor:'middle'});
 }
 return fade(g,s);
}
function radialSec({g=1,r0=22,len=52,n=8}={}){let s='';for(let i=0;i<n;i++){const a=Math.PI/8+2*Math.PI*i/n;s+=arrow(SX+r0*Math.cos(a),SY-r0*Math.sin(a),SX+(r0+len)*Math.cos(a),SY-(r0+len)*Math.sin(a),{color:EC,w:4,head:12});}return fade(g,s);}
const secGauss=(r,{g=1,col=HI}={})=>fade(g,ring(SX,SY,r*SK,{color:col,w:3,dash:'8 7'}));
// 側面を切り開いた長方形（金）。r で横幅が変わる
function sideRect(r,{g=1,x=640,y=150,h=170,k=1000,lbl=1}={}){
 const w=r*k;// 0.30 m で 300 px
 let s=rect(x,y,w,h,{fill:AREA,fo:.22,stroke:AREA,sw:3,rx:2});
 if(lbl)s+=label('L',x-12,y+h/2+8,{size:28,color:AREA,weight:700,anchor:'end'})+label('2πr',x+w/2,y+h+34,{size:28,color:AREA,weight:700,anchor:'middle'});
 return fade(g,s);
}
const scard=(x,y,w,h,inner,g=1,stroke=C.faint)=>card(x,y,w,h,inner,g,stroke);
// 対称性の小さなカード（i：0 ずらす、1 回す、2 鏡）
function symCard(i,x,y,{g=1,w=540,h=120,act=0,ok=0}={}){
 const t=['線に 沿って ずらす','軸の 周りに 回す','鏡に 映す'][i];
 let icon='';const ix=x+70,iy=y+h/2;
 if(i===0){const d=24*Math.sin(act*Math.PI);icon=line(ix,iy-46,ix,iy+46,{color:LAM,w:5})+dot(ix,iy-20+d,6,HI)+dot(ix,iy+20+d,6,HI);}
 if(i===1){icon=ring(ix,iy,34,{color:CYL,w:3})+dot(ix,iy,6,LAM);const a=act*Math.PI*2/3;icon+=dot(ix+34*Math.cos(a),iy-34*Math.sin(a),6,HI);}
 if(i===2){icon=ring(ix,iy,34,{color:CYL,w:3})+dot(ix,iy,6,LAM)+line(ix-46,iy,ix+46,iy,{color:C.dim,w:2,dash:'5 5'});const sy=mix(1,-1,act);icon+=dot(ix+24,iy-24*sy,6,HI);}
 return scard(x,y,w,h,icon+label(t,x+140,y+h/2+10,{size:28,color:C.ink,weight:700})+(ok?label('→ 同じ',x+w-24,y+h/2+10,{size:26,color:C.F,weight:700,anchor:'end'}):''),g,ok?C.F:C.faint);
}

export const ytQxUeGaussDiagrams={
 // ===================== 問題アニメ =====================
 // 出題：線電荷（紫）→ 半径 0.30 m の円筒面（青）→ 断面図と2点（0.15 m・0.60 m）。電場の矢印・ガウスの面・値は出さない。
 [K+'q1']:(p,ctx)=>{
  const t=cueT(ctx);
  let s=lineCharge({g:seg(t,0,.8)})+fade(seg(t,.8,1.6),label('斜めから 見た図',40,104,{size:22,color:C.dim}));
  if(t>2)s=shell({grow:seg(t,2,3.6)})+s;
  s+=section({g:seg(t,4,4.8),marks:t>5.2?1:0});
  return s;
 },

 // ===================== 小問1 =====================
 // 1. 出題図（左に斜めから見た軸と円筒面、右に断面図）
 [K+'setup']:(p)=>leftFig({g:seg(p,0,.15)})+section({g:seg(p,.2,.35)}),
 // 2. 求めるもの。断面図の r＝0.15 m の印を黄で点滅
 [K+'goal1']:(p,ctx)=>leftFig()+section({hl15:blink(ctx)*seg(p,.2,.3)})+goalTag(G1,{g:seg(p,.03,.12)}),
 // 3. 対称性のカード3枚を順に：ずらす（左の図が上下にすべる）・回す・鏡に映す
 [K+'sym']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.25,e=W[1]?W[1][1]:.9,step=(e-b)/3;
  const a=[0,1,2].map(i=>seg(p,b+step*i,b+step*(i+.8)));
  const slide=Math.sin(a[0]*Math.PI)*40;
  let s=move(0,slide,leftFig());
  [0,1,2].forEach(i=>{s+=symCard(i,620,100+i*135,{g:seg(p,b+step*i-.03,b+step*i+.03),act:a[i],ok:a[i]>.95?1:0});});
  return s+goalTag(G1);
 },
 // 4. 断面図に放射状の水色の矢印。同じ半径の円の上では同じ長さ。矢印は青い円の内側（r＜0.30 m）だけ
 [K+'radial']:(p)=>{
  let s=leftFig()+section({marks:1})+radialSec({g:seg(p,.15,.35)});
  s+=fade(seg(p,.45,.6),ring(SX,SY,50,{color:HI,w:2,dash:'4 6'})+label('同じ r → 同じ 長さ',SX,500,{size:24,color:HI,weight:700,anchor:'middle'}));
  return s+goalTag(G1);
 },
 // 5. 半径 0.15 m・長さ L の点線の円筒（ガウスの面）。ふたの上で電場はふたの面に沿う → ふた Φ＝0
 [K+'gcyl']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=leftFig({shellOp:.6})+gcyl(.15,{g:seg(p,.1,.3)});
  s+=capArrows(.15,{g:seg(p,b+.05,b+.2)});
  s+=fade(seg(p,b+.25,b+.35),label('ふた Φ ＝ 0',AX+120,GY0-28,{size:26,color:HI,weight:700})+label('ふた Φ ＝ 0',AX+120,GY1+50,{size:26,color:HI,weight:700}));
  s+=section({marks:1,hl15:1})+secGauss(.15,{g:seg(p,.1,.3)});
  return s+goalTag(G1);
 },
 // 6. ①側面を切り開いて L × 2πr の長方形（金）→ ②断面図で、点線の円の中は紫の点だけ、青い円は外
 [K+'side']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,cA=1-seg(p,b-.03,b),cB=seg(p,b-.01,b+.05);
  let s=leftFig({shellOp:.6})+gcyl(.15)+sideArrows(.15,{g:seg(p,.05,.15)*cA});
  s+=fade(cA,label('側面を 切り開く',830,120,{size:24,color:C.dim,anchor:'middle'})+sideRect(.15,{g:seg(p,.04,.12),x:760,y:160})+fade(seg(p,.12,.2),label('側面の 電気束',870,420,{size:24,color:C.dim,anchor:'middle'})+T(`${EE}\\times 2\\pi r L`,870,475,{size:40})));
  s+=fade(cB,section({marks:1,hl15:1})+secGauss(.15)+label('中：λ₁L だけ',SX,500,{size:26,color:LAM,weight:700,anchor:'middle'})+label('円筒面は 外',SX+.30*SK+10,SY+.30*SK+10,{size:24,color:CYL,weight:700}));
  return s+goalTag(G1);
 },
 // 7. 式を一行ずつ。両辺の L に打ち消し線
 [K+'eq']:(p)=>{
  const cn=seg(p,.4,.5)>.5,Lc=cn?'\\cancel{L}':'L';
  let s=T(`${EE}\\times 2\\pi r ${Lc}=\\dfrac{${L1}${Lc}}{\\varepsilon_0}`,600,190,{size:52});
  s+=fade(seg(p,.25,.35),label('両辺の L を 約分',600,280,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.55,.68),T(`${EE}=\\dfrac{${L1}}{2\\pi\\varepsilon_0 r}`,600,390,{size:56}));
  return s+goalTag(G1);
 },
 // 8. 数値 5×10⁻⁹÷(2π×8.85×10⁻¹²×0.15)≈600。「小問1 の答えは D」で答えの札
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55;
  let s=T(`${EE}=\\dfrac{${L1}}{2\\pi\\varepsilon_0 r}`,600,160,{size:48});
  s+=fade(seg(p,.05,.2),T(`=\\dfrac{5\\times10^{-9}}{2\\pi\\times8.85\\times10^{-12}\\times0.15}`,600,285,{size:44}));
  s+=fade(seg(p,.25,.4),T(`\\approx ${cs(HI,'600')}\\,\\mathrm{N/C}`,600,410,{size:52}));
  return s+goalTag(G1)+ANS1(seg(p,b,b+.06));
 },
 // 9. 誤答 A（2π を 4π と書いた）→ 誤答 C（外の円筒面まで数えた）。1枚ずつ
 [K+'wrongAC']:(p,ctx)=>{
  const W=sentWin(ctx),wA=[0,W[0][1]],wC=[W[1]?W[1][0]:.5,1],inA=inWin(p,wA),inC=inWin(p,wC,true);
  let a=T(`${EE}\\times {\\color{${HI}}\\boxed{2\\pi}}\\, r L`,600,170,{size:52})+fade(seg(p,.12,.25),T(`${EE}\\times {\\color{${BAD}}4\\pi}\\, r L`,600,260,{size:44,color:C.dim})+label('（誤り）',800,268,{size:24,color:BAD,weight:700}));
  let s=fade(inA,a);
  s+=fade(inC,leftFig({shellOp:.4})+section({marks:1,hl15:1})+secGauss(.15)+ring(SX,SY,.30*SK,{color:BAD,w:5}));
  s+=wrongCard('A','300',['2π を 4π と 書いた'],{x:300,w:600,y:330,size:28,whySize:24,g:inA});
  s+=wrongCard('C','0',['外の 円筒面まで 数えた'],{x:600,w:560,y:405,size:28,whySize:24,g:inC});
  return s+goalTag(G1)+ANS1(1);
 },
 // 10. ①誤答 B（点電荷の 1/r²）→ ②点線の円筒の半径を、円筒面より内側で大きくする。中の電荷は同じで、側面の横幅だけが伸びる
 [K+'wrongB']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,cB=seg(p,b-.01,b+.05),r=mix(.08,.28,Math.sin(seg(p,b+.05,1)*Math.PI*.5+0)*1);
  let s=wrongCard('B','2000',['点電荷の 1/r² を 使った'],{x:300,w:600,y:180,size:28,whySize:24,g:seg(p,.02,.08)*(1-cB)});
  s+=fade(cB,leftFig({shellOp:.6})+gcyl(r)+label(`r ＝ ${r.toFixed(2)} m`,AX,GY1+56,{size:26,color:HI,weight:700,anchor:'middle'})
   +label('中の 電荷 λ₁L：同じ',840,120,{size:26,color:LAM,weight:700,anchor:'middle'})+sideRect(r,{x:600,y:170})+label('側面の 横幅だけが r に 比例',840,450,{size:26,color:AREA,weight:700,anchor:'middle'})+label('→ E は 1/r',840,495,{size:28,color:HI,weight:700,anchor:'middle'}));
  return s+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 // 11. 求めるもの。0.60 m の印を黄で点滅
 [K+'goal2']:(p,ctx)=>leftFig()+section({hl60:blink(ctx)*seg(p,.2,.3)})+goalTag(G2,{g:seg(p,.03,.12)}),
 // 12. 大きい点線の円筒（半径 0.60 m）が、青い円筒面ごと包む。断面図で点線の円の中に紫の点と青い円の両方
 [K+'big']:(p)=>{
  const u=seg(p,.1,.4);
  let s=leftFig()+gcyl(mix(.31,.60,u),{g:seg(p,.05,.15)});
  s+=section({marks:1,hl60:1})+secGauss(mix(.31,.60,u),{g:seg(p,.05,.15)});
  s+=fade(seg(p,.5,.62),label('中：線 と 円筒面',SX,505,{size:26,color:HI,weight:700,anchor:'middle'}));
  return s+goalTag(G2);
 },
 // 13. 紫の +5 と青の −5 を足して 0（黄）
 [K+'net']:(p)=>{
  let s=leftFig()+gcyl(.60);
  s+=scard(620,120,540,300,label('中の 正味の 電荷（長さ L あたり）',890,170,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.1,.25),T(`(${cs(LAM,'+5')}${cs(CYL,'-5')})\\times L`,890,270,{size:48}))
   +fade(seg(p,.4,.55),T(`=${cs(HI,'0')}`,890,370,{size:56})),1,HI);
  return s+goalTag(G2);
 },
 // 14. E×2πrL＝0 → E＝0（黄）。「小問2 の答えは B」で答えの札
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=leftFig()+gcyl(.60);
  s+=scard(620,110,540,320,T(`${EE}\\times 2\\pi r L=0`,890,200,{size:48})
   +fade(seg(p,.25,.4),label('側面の 面積 2πrL ≠ 0',890,280,{size:26,color:AREA,weight:700,anchor:'middle'}))
   +fade(seg(p,.4,.55),T(`${EE}=${cs(HI,'0')}`,890,375,{size:56})),1,HI);
  return s+goalTag(G2)+ANS2(seg(p,b,b+.06));
 },
 // 15. 誤答 A（線だけ）→ 誤答 C（符号を無視）。1枚ずつ
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),wA=[0,W[0][1]],wC=[W[1]?W[1][0]:.5,1],inA=inWin(p,wA),inC=inWin(p,wC,true);
  let s=leftFig()+gcyl(.60);
  s+=wrongCard('A','150',['円筒面の 電荷を 落とした'],{x:620,w:540,y:150,size:28,whySize:24,g:inA});
  s+=wrongCard('C','300',['符号を 無視して 足した'],{x:620,w:540,y:150,size:28,whySize:24,g:inC});
  return s+goalTag(G2)+ANS2(1);
 },
 // 16. 誤答 D。対称性のカード3枚を小さく再表示
 [K+'wrongD2']:(p)=>{
  let s=wrongCard('D','決められない',['対称性を 使っていない'],{x:300,w:600,y:96,size:28,whySize:24,g:seg(p,.02,.08)});
  [0,1,2].forEach(i=>{s+=symCard(i,340,215+i*100,{g:seg(p,.2+.08*i,.28+.08*i),w:520,h:86,act:1,ok:1});});
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 // 17. 求めるもの
 [K+'goal3']:(p)=>leftFig()+gcyl(.60)+section({marks:1,hl60:1})+secGauss(.60)+goalTag(G3,{g:seg(p,.03,.12)}),
 // 18. 「正味の電荷 0」と「対称性で側面の E が一定・垂直」の2枚。両方に丸。答えの札 B
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.65;
  const o=(x,y,g)=>fade(g,label('○',x,y,{size:44,color:C.F,weight:700,anchor:'middle'}));
  let s=scard(50,130,480,260,label('正味の 電荷',290,210,{size:32,color:C.ink,weight:700,anchor:'middle'})+T(`(+5-5)\\times L=${cs(HI,'0')}`,290,300,{size:40})+o(290,370,seg(p,.2,.3)),seg(p,.02,.1),C.F);
  s+=fade(seg(p,.25,.32),label('しかも',600,270,{size:28,color:HI,weight:700,anchor:'middle'}));
  s+=scard(670,130,480,260,label('対称性で 側面の E が',910,210,{size:30,color:C.ink,weight:700,anchor:'middle'})+label('一定・面に 垂直',910,265,{size:30,color:C.ink,weight:700,anchor:'middle'})+o(910,370,seg(p,.4,.5)),seg(p,.18,.26),C.F);
  s+=fade(seg(p,.5,.6),label('→ E ＝ 0 と 言える',600,450,{size:32,color:HI,weight:700,anchor:'middle'}));
  return s+goalTag(G3)+ANS3(seg(p,b,b+.06));
 },
 // 19. 小さな図：球の外に電荷1つ。球の上の矢印は長さも向きもばらばら（点電荷の電場を計算）。「Φ＝0 でも E≠0」
 [K+'wrongA3']:(p)=>{
  const cx=330,cy=300,R=130,qx=cx-260,qy=cy;let s=ring(cx,cy,R,{color:'#c9d6ee',w:3})+charge(qx,qy,1,20)+label('外の 電荷',qx,qy+48,{size:22,color:C.dim,anchor:'middle'});
  for(let i=0;i<12;i++){const a=2*Math.PI*i/12,x=cx+R*Math.cos(a),y=cy-R*Math.sin(a),dx=x-qx,dy=y-qy,d=Math.hypot(dx,dy),L=Math.min(80,1.6e6/(d*d));
   s+=fade(seg(p,.1+.02*i,.2+.02*i),dot(x,y,4,C.ink)+arrow(x,y,x+L*dx/d,y+L*dy/d,{color:EC,w:4,head:12}));}
  s+=fade(seg(p,.4,.5),label('Φ ＝ 0 でも E ≠ 0',cx,cy+R+60,{size:30,color:HI,weight:700,anchor:'middle'}));
  s+=wrongCard('A','どんな 場合でも E ＝ 0',['電気束 0 でも E ≠ 0 の 例が ある'],{x:600,w:560,y:170,size:28,whySize:24,g:seg(p,.05,.12)});
  return s+goalTag(G3)+ANS3(1);
 },
 // 20. 誤答 C（静電平衡と混同）→ 誤答 D（円筒面は描いた円筒の中）。「対称性」と「静電平衡」を並べ、前者に丸
 [K+'wrongCD3']:(p,ctx)=>{
  const W=sentWin(ctx),r=(ctx?.cue?.reading??'').replace(/\s/g,''),k=r.indexOf('、'),sp=k>0?k/r.length*W[0][1]:.45;
  const inC=inWin(p,[0,sp]),inD=inWin(p,[sp,1],true);
  let s=fade(inC,scard(80,110,500,180,label('対称性',330,175,{size:32,color:C.F,weight:700,anchor:'middle'})+label('こちらで E ＝ 0',330,235,{size:26,color:C.ink,anchor:'middle'})+label('○',540,165,{size:40,color:C.F,weight:700,anchor:'middle'}),1,C.F)
   +scard(620,110,500,180,label('静電平衡',870,175,{size:32,color:C.dim,weight:700,anchor:'middle'})+label('導体の 中 だけの 話',870,235,{size:26,color:C.dim,anchor:'middle'}),1));
  s+=fade(inD,section({marks:1,hl60:1})+secGauss(.60)+ring(SX,SY,.30*SK,{color:BAD,w:5})+label('描いた 円筒（点線）の 中に 円筒面',SX,505,{size:24,color:HI,weight:700,anchor:'middle'}));
  s+=wrongCard('C','静電平衡で 打ち消す',['静電平衡（導体の 中）と 混同'],{x:250,w:700,y:330,size:28,whySize:24,g:inC});
  s+=wrongCard('D','ガウスの面の 外',['円筒面は 描いた 円筒の 中に ある'],{x:40,w:560,y:200,size:28,whySize:24,g:inD});
  return s+goalTag(G3)+ANS3(1);
 },
 // 21. カードと札を消す。∯𝐄·d𝐀＝Q/ε₀ と、円筒の側面 E×2πrL を並べる。最後に答えの札3枚
 [K+'sum']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,ve=voiceEnd(ctx);
  const OI='\\displaystyle\\mathop{\\iint\\mkern-23.5mu\\bigcirc\\mkern2mu}\\nolimits_S';
  let s=scard(70,110,500,300,label('どんな 閉じた面 でも',320,165,{size:26,color:C.dim,anchor:'middle'})+T(`${OI}${cs(EC,'\\mathbf{E}')}\\cdot d\\mathbf{A}=\\dfrac{Q}{\\varepsilon_0}`,320,270,{size:44})+label('Q：ガウスの面の 中の 正味の 電荷',320,375,{size:22,color:C.dim,anchor:'middle'}),seg(p,.02,.12));
  s+=scard(630,110,500,300,label('対称性で E を 外に 出せる とき',880,165,{size:26,color:HI,anchor:'middle',weight:700})+T(`${EE}\\times 2\\pi r L`,880,270,{size:48})+label('円筒の 側面',880,375,{size:24,color:AREA,anchor:'middle',weight:700}),seg(p,b,b+.1),HI);
  s+=answerRow([[1,'D','600 N/C'],[2,'B','0 N/C'],[3,'B','']],{g:seg(p,ve,ve+.05)});
  return s;
 },
};

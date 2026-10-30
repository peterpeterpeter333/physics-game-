// 問題編 解説「電球にも、オームの法則は使える？」(ys-qx-hs-e-current-3) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/401_電流とオームの法則.md の q-hs-e-current-3（解説 21 行）。
// 色（正本）：電流 I 緑、電圧 V 紫、抵抗 R 白、電子 青、正電荷（原子）赤、温度 黄緑、強調 黄。右下に小さな凡例（R 白・電子 青・正電荷 赤）を毎画面に出す。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 元の単元動画（yt1-hs-e-current-1・3）の部品を読み込んで使う（それらのファイルは編集しない）。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,axes,clamp,mix} from './anim.mjs';
import {IC,VC,NEG,POS,RC,It,Vt,Rt,resistor} from './yt1-hs-e-current-1-diagrams.mjs';
import {lattice} from './yt1-hs-e-current-3-diagrams.mjs';
import {QC,card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,legend,note,cueT,sentWin} from './yt1-qx-common.mjs';

const K='qx-hs-e-current-3:';
const BAD='#ff6b6b',REF='#9aabc7',TMP=QC.T;
const G1='抵抗 R',G2='9.0 V のときの電流',G3='100 V での電流';
const A1=g=>answerTag(1,'B','5.0 Ω',{g}),A2=g=>answerTag(2,'A','1.8 A',{g}),A3=g=>answerTag(3,'C','',{g});
const LEG=(g=1)=>legend([['R 白',RC],['電子 青',NEG],['正電荷 赤',POS]],1064,440,{g,size:22,gap:6});
const b2=(W,i,d=.5)=>W[i]?W[i][0]:d;      // i 番目の文が始まる所（cue の進み）
const T=(src,x,y,size=40)=>tex(src,x,y,{size,auto:false});
const U=s=>`\\ \\mathrm{${s}}`;

// ---- 金属線の絵と「温度 一定」の札（表の上）---------------------------------------------------------
function wire({g=1,rlab=0,tmpHi=0}={}){
 let s=line(46,112,72,112,{color:C.dim,w:4})+resistor(72,184,112,{n:5,amp:12})+line(184,112,206,112,{color:C.dim,w:4});
 s+=label('金属線',218,121,{size:24,color:C.ink,weight:700});
 if(rlab)s+=fade(rlab,label('R：抵抗',310,121,{size:26,color:RC,weight:700}));
 const tw=150,tx=190-tw/2;   // 表の下
 s+=rect(tx,410,tw,42,{fill:TMP,fo:.12+.2*tmpHi,stroke:tmpHi>.01?C.hi:TMP,sw:2.5+2*tmpHi,rx:20})+label('温度 一定',190,440,{size:24,color:tmpHi>.5?C.hi:TMP,anchor:'middle',weight:700});
 return fade(g,s);
}
// ---- 表（縦に3行）。rows＝各行の濃さ、hl＝各行の光り、ratio＝V÷I の欄（0〜1）、five＝「＝5.0」の濃さ ----------
const DATA=[['2.0','0.40'],['4.0','0.80'],['6.0','1.20']];
const TB={x:40,y:150,rh:58,c:150,c3:270};
function table({rows=[1,1,1],hl=[0,0,0],ratio=0,div=[0,0,0],five=0,box5=0,hdr=0,cellHi=null,g=1}={}){
 const {x,y,rh,c,c3}=TB,w=2*c+c3*ratio;
 let s=rect(x,y,w,rh*4+10,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:14});
 s+=line(x+c,y+10,x+c,y+rh*4,{color:C.faint,w:1.5})+line(x+12,y+rh+4,x+w-12,y+rh+4,{color:C.faint,w:1.5});
 if(hdr)s+=fade(hdr,rect(x+8,y+8,c-16,rh-10,{fill:VC,fo:.18,stroke:VC,sw:2.5,rx:10})+rect(x+c+8,y+8,c-16,rh-10,{fill:IC,fo:.18,stroke:IC,sw:2.5,rx:10}));
 s+=label('電圧 V',x+c/2,y+40,{size:28,color:VC,anchor:'middle',weight:700})+label('電流 I',x+c*1.5,y+40,{size:28,color:IC,anchor:'middle',weight:700});
 if(ratio>0){s+=fade(ratio,line(x+2*c,y+10,x+2*c,y+rh*4,{color:C.faint,w:1.5})+label('V ÷ I',x+2*c+c3/2,y+40,{size:28,color:C.hi,anchor:'middle',weight:700}));}
 DATA.forEach(([v,i],k)=>{const yy=y+rh*(k+1)+40,o=rows[k]??0;if(o<=0)return;
  if(hl[k]>0)s+=fade(hl[k]*o,rect(x+6,yy-34,w-12,rh-8,{fill:C.hi,fo:.16,stroke:C.hi,sw:2.5,rx:10}));
  if(cellHi&&cellHi[k]>0)s+=fade(cellHi[k],rect(x+c+12,yy-34,c-24,rh-8,{fill:C.hi,fo:.2,stroke:C.hi,sw:3,rx:10}));
  s+=fade(o,label(`${v} V`,x+c/2,yy,{size:30,color:C.ink,anchor:'middle',weight:700})+label(`${i} A`,x+c*1.5,yy,{size:30,color:C.ink,anchor:'middle',weight:700}));
  if(ratio>0&&div[k]>0){const cx=x+2*c+c3/2;
   s+=fade(div[k]*(1-five),label(`${v}÷${i}`,cx,yy,{size:28,color:C.ink,anchor:'middle',weight:700}));
   s+=fade(div[k]*five,label(`${v}÷${i} ＝`,cx-48,yy,{size:28,color:C.ink,anchor:'middle',weight:700}));
   s+=fade(div[k]*five,label('5.0',cx+82,yy,{size:28,color:C.hi,anchor:'middle',weight:700}));}
 });
 if(box5>0){const cx=x+2*c+c3/2+82;s+=fade(box5,rect(cx-36,y+rh+12,72,rh*3-14,{fill:'none',stroke:C.hi,sw:3.5,rx:12}));}
 return fade(g,s);
}
// ---- 金属線の V–I グラフ（横 0〜10 V、縦 0〜2.0 A）---------------------------------------------------
const GM={x:620,y:380,w:420,h:240};
const axM=(o=GM)=>axes({x:o.x,y:o.y,w:o.w,h:o.h,xmax:10,ymax:2,xticks:[2,4,6,8,10],yticks:['0.40','0.80','1.20','1.60','2.00'],grid:true,xlabel:'V [V]',ylabel:'電流 I [A]',xcolor:VC,ycolor:IC});
function graphM({pts=[1,1,1],ph=[0,0,0],ln=0,ext=0,extHi=0,g=1,nine=0,p9=0,tri=0,maxHi=0,lnCol=IC,o=GM}={}){
 const A=axM(o);let s=A.svg+label('電圧',o.x+o.w+36,o.y+30,{size:22,color:VC,weight:700});
 if(ln)s+=A.plot(v=>v/5,{from:0,to:6,p:ln,color:lnCol,w:4});
 if(ext){s+=A.plot(v=>v/5,{from:6,to:9.8,p:ext,color:extHi>.5?C.hi:IC,w:4+2*extHi,dash:'10 8'});}
 if(tri)s+=fade(tri,line(A.X(2),A.Y(.4),A.X(4),A.Y(.4),{color:VC,w:3,dash:'6 5'})+line(A.X(4),A.Y(.4),A.X(4),A.Y(.8),{color:IC,w:3,dash:'6 5'}));
 DATA.forEach(([v,i],k)=>{const a=pts[k]??0;if(a<=0)return;const X=A.X(+v),Y=A.Y(+i);
  if(ph[k]>0)s+=fade(ph[k],dot(X,Y,20,C.hi,.3));s+=fade(a,dot(X,Y,9,C.hi));});
 if(maxHi)s+=fade(maxHi,ring(A.X(6),A.Y(1.2),18,{color:C.hi,w:3})+label('表の 最大',A.X(6)+24,A.Y(1.2)+30,{size:24,color:C.hi,weight:700}));
 if(nine)s+=fade(nine,line(A.X(9),o.y-8,A.X(9),o.y+8,{color:VC,w:4})+label('9.0 V',A.X(9),o.y+62,{size:24,color:VC,anchor:'middle',weight:700}));
 if(p9)s+=fade(p9,line(A.X(9),o.y,A.X(9),A.Y(1.8),{color:VC,w:2.5,dash:'6 6'})+line(o.x,A.Y(1.8),A.X(9),A.Y(1.8),{color:IC,w:2.5,dash:'6 6'})
  +dot(A.X(9),A.Y(1.8),10,C.hi)+label('1.8 A',o.x+10,A.Y(1.8)-10,{size:26,color:IC,weight:700}));
 return {A,svg:fade(g,s)};
}
// ---- 電球（フィラメントの色：heat 0 橙 → 1 白に近い）-------------------------------------------------
const hex=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16));
const mixHex=(a,b,u)=>'#'+hex(a).map((x,i)=>Math.round(mix(x,hex(b)[i],clamp(u))).toString(16).padStart(2,'0')).join('');
function bulbPic(x,y,{r=60,on=1,heat=0,g=1}={}){
 const fc=mixHex('#ff9a3c','#fff4dc',heat),glow=mixHex('#ffcf80','#fff6e8',heat);
 let s='';
 if(on>0)s+=fade(on,dot(x,y,r+34+16*heat,glow,.12+.08*heat)+dot(x,y,r+14,glow,.22+.1*heat));
 s+=ring(x,y,r,{color:C.ink,w:3,fill:on>.5?mixHex('#4a3a20','#6a6248',heat):'#131f38'});
 s+=rect(x-r*.42,y+r*.86,r*.84,r*.5,{fill:'#8a96ad',fo:.9,stroke:C.dim,sw:2,rx:4});
 s+=line(x-r*.3,y+r*.9,x-r*.3,y+r*.2,{color:C.dim,w:2.5})+line(x+r*.3,y+r*.9,x+r*.3,y+r*.2,{color:C.dim,w:2.5});
 s+=draw([[x-r*.3,y+r*.2],[x-r*.55,y-r*.1],[x-r*.25,y-r*.3],[x,y-r*.05],[x+r*.25,y-r*.3],[x+r*.55,y-r*.1],[x+r*.3,y+r*.2]],1,{color:on>.3?fc:C.dim,w:4+2*heat});
 return fade(g,s);
}
const bulbCard=(x,y,g=1,w=330)=>card(x,y,w,52,label('50 V で 0.25 A（点灯）',x+w/2,y+35,{size:26,color:C.ink,anchor:'middle',weight:700}),g,C.faint);
// ---- 電球の V–I グラフ（横 0〜120 V、縦 0〜0.60 A）。曲線は模式図 I＝0.25(V/50)^0.6 ------------------
const GB={x:600,y:380,w:440,h:250};
const bI=v=>.25*Math.pow(Math.max(0,v)/50,.6);
function graphB({pt=1,refl=0,refCol=REF,refW=3,hollow=0,crv=0,hi100=0,band=0,o=GB,g=1,notes=1}={}){
 const A=axes({x:o.x,y:o.y,w:o.w,h:o.h,xmax:120,ymax:.6,xticks:[50,100],yticks:['0.25','0.50'],grid:true,xlabel:'V [V]',ylabel:'電流 I [A]',xcolor:VC,ycolor:IC});
 let s=A.svg+label('電圧',o.x+o.w+36,o.y+30,{size:22,color:VC,weight:700});
 if(refl){s+=A.plot(v=>v/200,{from:0,to:104,p:refl,color:refCol,w:refW,dash:'10 8'});
  if(notes)s+=fade(clamp(refl*2-1),label('R 一定 なら',A.X(68),A.Y(.43),{size:24,color:refCol===REF?C.ink:refCol,anchor:'end',weight:700}));}
 if(hollow)s+=fade(hollow,ring(A.X(100),A.Y(.5),11,{color:C.ink,w:3,fill:C.bg})+label('0.50 A',A.X(100)+18,A.Y(.5)-14,{size:24,color:C.ink,weight:700}));
 if(crv){s+=A.plot(bI,{from:0,to:108,p:crv,color:IC,w:5});
  if(notes)s+=fade(clamp(crv*2-1),label('電球',A.X(108)+8,A.Y(bI(108))+30,{size:24,color:IC,weight:700}));}
 if(band){const y1=A.Y(.25),y2=A.Y(.5),xb=A.X(100);
  s+=fade(band,line(o.x,y1,xb,y1,{color:C.hi,w:2.5,dash:'6 6'})+line(o.x,y2,xb,y2,{color:C.hi,w:2.5,dash:'6 6'})
   +line(xb+30,y1,xb+30,y2,{color:C.hi,w:4})+line(xb+22,y1,xb+38,y1,{color:C.hi,w:4})+line(xb+22,y2,xb+38,y2,{color:C.hi,w:4}));}
 if(hi100)s+=fade(hi100,dot(A.X(100),A.Y(bI(100)),20,C.hi,.35)+dot(A.X(100),A.Y(bI(100)),10,C.hi));
 if(pt)s+=fade(pt,dot(A.X(50),A.Y(.25),10,IC)+(notes?label('（50 V, 0.25 A）',A.X(50)+10,A.Y(.25)+36,{size:22,color:C.ink,weight:700}):''));
 return {A,svg:fade(g,s)};
}
const modelNote=(g=1)=>note('（曲線の 形は 模式図）',820,478,{g});

export const qxHsECurrent3Diagrams={
 // ================= 問題アニメ：出題中（小問1〜3 共通、5 秒＋静止）=================
 // 左に金属線の表と「温度 一定」、右に空の V–I グラフ。0〜3 秒で表の行が一つずつ光り、グラフに点を一つずつ打つ。
 // 3〜5 秒でグラフの下に電球の絵と「50 V で 0.25 A（点灯）」。出さないもの：V÷I の値、直線とその延長、電球の点と曲線。
 [K+'q0']:(p)=>{
  const rows=[0,1,2].map(k=>seg(p,k*.2,k*.2+.06)),hl=[0,1,2].map(k=>seg(p,k*.2,k*.2+.04)*(1-seg(p,k*.2+.16,k*.2+.2)));
  let s=wire()+table({rows,hl});
  s+=graphM({pts:rows,ph:hl}).svg;
  s+=bulbPic(600,468,{r:24,on:seg(p,.62,.72),g:seg(p,.6,.68)})+bulbCard(650,442,seg(p,.68,.8));
  s+=LEG();
  return s;
 },
 // ================= S1 小問1：金属線の抵抗 =================
 // 1. 出題中の表とグラフ。電球の絵と札は、小問1・2 では使わないので消す
 [K+'goal1']:(p)=>{
  let s=wire()+table()+graphM().svg;
  s+=fade(1-seg(p,.55,.7),bulbPic(600,468,{r:24})+bulbCard(650,442));
  s+=goalTag(G1,{g:seg(p,.03,.15)})+LEG();
  return s;
 },
 // 2. 金属線に「R：抵抗」、表の見出し 電圧 V・電流 I を光らせる → 「定義」タグと R＝V/I（グラフは消す）
 [K+'def']:(p)=>{
  let s=wire({rlab:seg(p,.05,.15)})+table({hdr:seg(p,.15,.25)*(1-seg(p,.8,.95))});
  s+=graphM({g:1-seg(p,.02,.12)}).svg;
  s+=kindTag('定義',900,170,{g:seg(p,.45,.55),size:26});
  s+=card(690,210,420,150,T(`${Rt}=\\dfrac{${Vt}}{${It}}`,900,295,60),seg(p,.5,.62),C.ink);
  s+=goalTag(G1)+LEG();
  return s;
 },
 // 3. 表の右に「V÷I」の欄。2文目で各行を順に光らせ、割り算を書く
 [K+'ratio']:(p,ctx)=>{
  const W=sentWin(ctx),a=b2(W,1,.4),d=(1-a)/3;
  const div=[0,1,2].map(k=>seg(p,a+k*d,a+k*d+.05)),hl=[0,1,2].map(k=>seg(p,a+k*d,a+k*d+.03)*(1-seg(p,a+(k+1)*d-.02,a+(k+1)*d+.02)));
  let s=wire({rlab:1})+table({ratio:seg(p,.05,.2),div,hl});
  s+=kindTag('定義',900,170,{size:26})+card(690,210,420,150,T(`${Rt}=\\dfrac{${Vt}}{${It}}`,900,295,60),1,C.ink);
  s+=goalTag(G1)+LEG();
  return s;
 },
 // 4. 3つとも 5.0 → 黄で囲む。R＝5.0 Ω と単位 V/A＝Ω。2文目で答えの札
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=b2(W,1);
  let s=wire({rlab:1})+table({ratio:1,div:[1,1,1],five:seg(p,.03,.12),box5:seg(p,.12,.22)});
  s+=card(690,150,420,150,T(`${Rt}=5.0${U('\\Omega')}`,900,240,54),seg(p,.25,.38),C.hi);
  s+=fade(seg(p,.35,.48),label('単位',760,358,{size:26,color:C.dim,weight:700})+T(`\\mathrm{V/A}=\\Omega`,930,350,36));
  s+=goalTag(G1)+A1(seg(p,b,b+.08))+LEG();
  return s;
 },
 // 5. 誤答 A：グラフに原点からの直線、傾きの三角形に I/V＝0.20＝1/R
 [K+'wrongA']:(p)=>{
  const {A,svg}=graphM({ln:seg(p,.08,.3),tri:seg(p,.35,.45)});
  let s=svg+fade(seg(p,.4,.52),T(`\\dfrac{${It}}{${Vt}}=0.20=\\dfrac{1}{${Rt}}`,A.X(4.6),A.Y(1.55),34));
  s+=fade(seg(p,.4,.52),label('傾き',A.X(.5),A.Y(1.55)+10,{size:24,color:C.ink,weight:700}));
  s+=wrongCard('A','0.20 Ω','I/V（傾き 1/R）を 求めた',{x:30,y:150,w:500,mid:`0.40\\div 2.0=0.20`,g:seg(p,.03,.1)});
  s+=goalTag(G1)+A1(1)+LEG();
  return s;
 },
 // 6. 誤答 C（表の電流を読んだ）→ 誤答 D（V×I）。1枚ずつ
 [K+'wrongCD']:(p,ctx)=>{
  const W=sentWin(ctx),w=W.length===2?W:[[0,.48],[.48,1]];
  const cHi=seg(p,w[0][0]+.04,w[0][0]+.1)*(1-seg(p,w[1][0]-.03,w[1][0]));
  const dHi=seg(p,w[1][0]+.02,w[1][0]+.08);
  let s=wire({rlab:1})+table({cellHi:[0,0,cHi],hl:[dHi,0,0]});
  s+=wrongSeq(p,ctx,[['C','1.2 Ω','表の 電流を 読んだ'],['D','0.80 Ω','V×I（単位 V·A）',{mid:`2.0\\times 0.40=0.80`}]],{win:w,opts:{x:400,y:170,w:640}});
  s+=goalTag(G1)+A1(1)+LEG();
  return s;
 },
 // ================= S2 小問2：9.0 V での電流 =================
 // 7. 求めるもの：9.0 V のときの電流。表・直線（0〜6 V）・横軸の 9.0 V
 [K+'goal2']:(p)=>{
  let s=wire({rlab:1})+table()+graphM({ln:1,nine:seg(p,.3,.45)}).svg;
  s+=goalTag(G2,{g:seg(p,.03,.15)})+LEG();
  return s;
 },
 // 8. 「温度 一定」を黄で光らせ、「法則」タグ オームの法則（温度一定）
 [K+'law']:(p,ctx)=>{
  const t=cueT(ctx),hi=seg(p,.05,.15)*(.6+.4*Math.sin(t*5)**2);
  let s=wire({rlab:1,tmpHi:hi})+table({g:1-seg(p,.05,.15)})+graphM({ln:1,nine:1}).svg;
  s+=fade(seg(p,.15,.25),label('R ＝ 5.0 Ω の まま',290,250,{size:32,color:RC,anchor:'middle',weight:700}));
  s+=kindTag('法則',290,340,{text:'オームの法則（温度一定）',g:seg(p,.5,.62),size:26});
  s+=goalTag(G2)+LEG();
  return s;
 },
 // 9. I＝V/R に入れる → 9.0÷5.0＝1.8 A。直線を点線で延ばし、9.0 V の点と縦軸の 1.8 A
 [K+'calc2']:(p,ctx)=>{
  const W=sentWin(ctx),b=b2(W,1);
  let s=wire({rlab:1})+graphM({ln:1,nine:1,ext:lin(p,b+.05,b+.35),p9:seg(p,b+.35,b+.45)}).svg;
  s+=card(40,170,500,230,T(`${It}=\\dfrac{${Vt}}{${Rt}}`,290,250,50)+fade(seg(p,b,b+.1),T(`=\\dfrac{9.0}{5.0}=1.8${U('A')}`,290,355,42)),seg(p,.05,.15),IC);
  s+=goalTag(G2)+LEG();
  return s;
 },
 // 10. 小問2 の答え A
 [K+'ans2']:(p)=>{
  let s=wire({rlab:1})+graphM({ln:1,nine:1,ext:1,p9:1}).svg;
  s+=card(40,170,500,230,T(`${It}=\\dfrac{${Vt}}{${Rt}}`,290,250,50)+T(`=\\dfrac{9.0}{5.0}=1.8${U('A')}`,290,355,42),1,IC);
  s+=goalTag(G2)+A2(seg(p,.05,.2))+LEG();
  return s;
 },
 // 11. 誤答 B（V×R）→ 誤答 D（R÷V）。1枚ずつ。式の枠は消す
 [K+'wrongBD']:(p,ctx)=>{
  let s=wire({rlab:1})+graphM({ln:1,nine:1,ext:1,p9:1}).svg;
  s+=wrongSeq(p,ctx,[['B','45 A','V×R を 計算',{mid:`9.0\\times 5.0=45`}],['D','0.56 A','R÷V を 計算',{mid:`5.0\\div 9.0\\approx 0.56`}]],{opts:{x:30,y:170,w:500}});
  s+=goalTag(G2)+A2(1)+LEG();
  return s;
 },
 // 12. 誤答 C（表の最大 1.20 A で止めた）。延長した点線を黄で光らせる
 [K+'wrongC']:(p,ctx)=>{
  const W=sentWin(ctx),b=b2(W,1);
  let s=wire({rlab:1})+graphM({ln:1,nine:1,ext:1,p9:1,maxHi:seg(p,.05,.15)*(1-seg(p,b,b+.06)),extHi:seg(p,b,b+.06)}).svg;
  s+=wrongCard('C','1.2 A','表の 外も 直線は 続く',{x:30,y:170,w:500,g:seg(p,.03,.1)});
  s+=goalTag(G2)+A2(1)+LEG();
  return s;
 },
 // ================= S3 小問3：電球に 100 V =================
 // 13. 暗転して電球のグラフへ。電球の絵と「50 V で 0.25 A（点灯）」
 [K+'goal3']:(p)=>{
  let s=bulbPic(260,200,{r:62})+bulbCard(95,320,1);
  s+=graphB({pt:0}).svg;
  s+=goalTag(G3,{g:seg(p,.03,.15)})+LEG();
  return s;
 },
 // 14. 電球の点（50 V、0.25 A）を打つ。R＝50÷0.25＝200 Ω（50 V のとき）
 [K+'pt50']:(p)=>{
  let s=bulbPic(260,200,{r:62})+bulbCard(95,320,1);
  s+=graphB({pt:seg(p,.05,.18)}).svg;
  s+=card(40,392,480,104,T(`${Rt}=50\\div 0.25=200${U('\\Omega')}`,280,440,34)+label('（50 V の とき）',280,484,{size:22,color:C.dim,anchor:'middle'}),seg(p,.3,.42),C.ink);
  s+=goalTag(G3)+LEG();
  return s;
 },
 // 15. 定義：R＝V/I（いつも書ける）／実験の事実：R 一定（条件つき）。左右に分けた札
 [K+'two']:(p,ctx)=>{
  const W=sentWin(ctx),b=b2(W,1);
  let s=card(70,110,500,290,'',seg(p,.03,.12),C.hi)+fade(seg(p,.03,.12),kindTag('定義',320,160,{size:28})+T(`${Rt}=\\dfrac{${Vt}}{${It}}`,320,265,58)+label('いつも 書ける',320,370,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=card(630,110,500,290,'',seg(p,b,b+.1),C.ink)+fade(seg(p,b,b+.1),kindTag('実験',880,160,{size:28})+label('実験の 事実：R 一定',880,262,{size:34,color:C.ink,anchor:'middle',weight:700})+label('（条件つき）',880,370,{size:28,color:C.dim,anchor:'middle',weight:700}));
  s+=goalTag(G3)+LEG();
  return s;
 },
 // 16. フィラメントが橙から白へ。拡大図で、揺れる赤い原子に青い電子がぶつかる（揺れが激しくなる）
 [K+'heat']:(p,ctx)=>{
  const W=sentWin(ctx),b=b2(W,1),t=cueT(ctx);
  const heat=seg(p,.08,b-.02),amp=mix(3,11,seg(p,b,b+.25));
  let s=bulbPic(230,230,{r:80,heat});
  s+=fade(seg(p,.05,.15),label('フィラメント',230,390,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.03,.12)*(1-heat),label('橙',230,430,{size:24,color:'#ff9a3c',anchor:'middle',weight:700}))+fade(heat,label('白に 近づく（もっと 熱い）',230,430,{size:24,color:'#fff4dc',anchor:'middle',weight:700}));
  const lg=seg(p,b-.1,b);
  s+=fade(lg,lattice(t,{x:520,y:96,w:500,h:290,nx:6,ny:3,amp,ne:10,drift:60}));
  s+=fade(lg,label('拡大',1030,120,{size:22,color:C.dim})+line(330,200,520,140,{color:C.faint,w:2,dash:'6 6'})+line(330,260,520,386,{color:C.faint,w:2,dash:'6 6'}));
  s+=fade(seg(p,b+.05,b+.15),label('原子（激しく 揺れる）',640,428,{size:24,color:POS,anchor:'middle',weight:700})+label('電子',900,428,{size:24,color:NEG,anchor:'middle',weight:700}));
  s+=goalTag(G3)+LEG();
  return s;
 },
 // 17. R 一定なら：原点と電球の点を結ぶ点線を 100 V まで延ばし、0.50 A の白い空の丸。その下を通る、寝ていく電球の曲線
 [K+'curve']:(p)=>{
  let s=bulbPic(260,200,{r:62,heat:.8});
  s+=fade(seg(p,.05,.15),label('R ＞ 200 Ω',260,345,{size:34,color:RC,anchor:'middle',weight:700}));
  s+=graphB({refl:seg(p,.05,.3),hollow:seg(p,.3,.4),crv:seg(p,.45,.8)}).svg+modelNote(seg(p,.5,.6));
  s+=goalTag(G3)+LEG();
  return s;
 },
 // 18. 曲線上の 100 V の点を黄で光らせ、0.25 A と 0.50 A の間を縦の目盛りで示す。2文目で答えの札
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=b2(W,1);
  let s=bulbPic(260,200,{r:62,heat:.8})+label('R ＞ 200 Ω',260,345,{size:34,color:RC,anchor:'middle',weight:700});
  s+=graphB({refl:1,hollow:1,crv:1,hi100:seg(p,.05,.15),band:seg(p,.2,.35)}).svg+modelNote();
  s+=goalTag(G3)+A3(seg(p,b,b+.08))+LEG();
  return s;
 },
 // 19. 誤答 A：点線（R 一定なら）を赤でなぞる
 [K+'wrongA3']:(p)=>{
  const red=seg(p,.1,.35);
  let s=bulbPic(260,170,{r:56,heat:.8});
  const {A,svg}=graphB({refl:1,hollow:1,crv:1});
  s+=svg+modelNote()+A.plot(v=>v/200,{from:0,to:104,p:red,color:BAD,w:5,dash:'10 8'});
  s+=wrongCard('A','ちょうど 0.50 A','R 一定を 電球に 使った',{x:30,y:290,w:500,g:seg(p,.03,.1)});
  s+=goalTag(G3)+A3(1)+LEG();
  return s;
 },
 // 20. 誤答 B（0.25 A のまま）→ 誤答 D（0.50 A より大きい）。1枚ずつ
 [K+'wrongBD3']:(p,ctx)=>{
  let s=bulbPic(260,170,{r:56,heat:.8});
  s+=graphB({refl:1,hollow:1,crv:1}).svg+modelNote();
  s+=wrongSeq(p,ctx,[['B','0.25 A の まま','電圧を 上げれば 電流は 増える'],['D','0.50 A より 大きい','熱いほど R は 大きい']],{opts:{x:30,y:290,w:500}});
  s+=goalTag(G3)+A3(1)+LEG();
  return s;
 },
 // ================= S4 まとめ =================
 // 21. 金属線の直線（R＝5.0 Ω、9.0 V で 1.8 A）と電球の曲線（100 V で 0.50 A に届かない）を左右に並べる。答えの札を横に並べる
 [K+'sum']:(p)=>{
  const gl=seg(p,.03,.15),gr=seg(p,.3,.42);
  let s=card(14,84,560,420,'',gl,C.faint)+fade(gl,label('金属線（温度 一定）',294,122,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(gl,graphM({ln:1,ext:1,p9:1,pts:[1,1,1],o:{x:90,y:390,w:380,h:200}}).svg);
  s+=fade(gl,label('R ＝ 5.0 Ω（一定）',294,456,{size:24,color:RC,anchor:'middle',weight:700})+label('9.0 V で 1.8 A',294,488,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=card(600,84,450,420,'',gr,C.faint)+fade(gr,label('電球',825,122,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(gr,graphB({refl:1,hollow:1,crv:1,notes:0,o:{x:650,y:390,w:290,h:200}}).svg);
  s+=fade(gr,label('100 V で 0.50 A に 届かない',825,472,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=answerRow([[1,'B','5.0 Ω'],[2,'A','1.8 A'],[3,'C','']],{g:seg(p,.5,.6)})+LEG();
  return s;
 },
};

// 問題編 解説「3秒で 12 C」（q-ui-conduction、大学編 24 電流・初級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/24_電流.md の q-ui-conduction（解説 16 行）。
// 配置：左（x＜640）に導線・金の断面・時計・カウンター、右（x 660〜1180）に式の枠・誤答カード。札の帯（y＜78）には図を描かない。
// 色（正本）：電流 I 緑、電荷 桃、時間 金、電子 青、正電荷 赤、𝐄 水色、電子の速度 𝐯 紫、強調 黄。
// 電子・導線の描き方は 電流・初級（yt1-ui-conduction-1-diagrams.mjs）の形を写して使う（あちらは編集しない）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,scaleAt} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongSeq,sentWin,cueT,tAt,durOf,isProblem} from './yt1-qx-common.mjs';

const K='qx-ui-conduction:';
const NEG='#7fb3ff',POS=C.a,EC=C.x,QCOL=C.p,TC=C.t,IC=C.F,VC=C.v;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,color:C.ink,...o});
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const U=s=>`\\,\\mathrm{${s}}`;
const PX=660,PW=520,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,y:200,size:28,whySize:24};
const G1='電流の大きさ I',G2='1秒に通る電子の数',G3='電子の向きと電流の向き';
const ANS1=g=>answerTag(1,'D','4 A',{g}),ANS2=g=>answerTag(2,'A','2.5×10¹⁹ 個',{g}),ANS3=g=>answerTag(3,'C','電子 右、電流 左',{g});

// ---- 導線・断面・電子 ---------------------------------------------------------------------------
const WX1=40,WX2=620,WY=305,HH=45,GX=330;
const wire=(g=1,{y=WY,hh=HH,x1=WX1,x2=WX2}={})=>fade(g,rect(x1,y-hh,x2-x1,2*hh,{fill:'#8795ad',fo:.16,stroke:C.dim,sw:2.5,rx:hh-4}));
// 金の断面（楕円）と「断面」の文字（導線の下）
const section=(g=1,{x=GX,y=WY,hh=HH,text=true,glow=0}={})=>fade(g,`<ellipse cx="${x}" cy="${y}" rx="20" ry="${hh+6}" fill="${TC}" fill-opacity="${.14+.2*glow}" stroke="${TC}" stroke-width="${3.5+2*glow}"/>`
 +(text?label('断面',x,y+hh+40,{size:24,color:TC,anchor:'middle',weight:700}):''));
const electron=(x,y,{r=12,op=1}={})=>fade(op,ring(x,y,r,{color:NEG,w:2.5,fill:'#1b2a48'})+label('−',x,y+7,{size:22,color:NEG,anchor:'middle',weight:700}));
const plusQ=(x,y,{r=14,op=1}={})=>fade(op,ring(x,y,r,{color:POS,w:2.5,fill:'#3a1d2a'})+label('＋',x,y+8,{size:22,color:POS,anchor:'middle',weight:700}));
// 導線の中の電子（3段）。shift＞0 で右へずれる（端で回り込む）。
const EROWS=[-24,0,24],ESP=58;
function electrons(shift=0,{g=1,y=WY,x1=WX1,x2=WX2}={}){
 let s='';const L=x2-x1-40;
 EROWS.forEach((dy,r)=>{for(let k=0;k<9;k++){const x0=(k*L/9+r*L/27)%L;const x=x1+20+(((x0+shift)%L)+L)%L;s+=electron(x,y+dy,{r:11});}});
 return fade(g,s);
}
// 時計（金）：1目盛り＝1 s、1周＝4 s。t 秒の所まで針が回る。左に「時間 t s」。
const CKX=GX,CKY=150,CKR=50;
function clock(t,{g=1,ticksHi=0,read=1}={}){
 let s=ring(CKX,CKY,CKR,{color:TC,w:4,fill:'#1a1a10'});
 for(let i=0;i<4;i++){const a=2*Math.PI*i/4;s+=line(CKX+CKR*.72*Math.sin(a),CKY-CKR*.72*Math.cos(a),CKX+CKR*Math.sin(a),CKY-CKR*Math.cos(a),{color:TC,w:3+3*ticksHi});}
 const a=2*Math.PI*t/4;
 if(t>.01){const n=Math.max(2,Math.ceil(30*t/4)),pts=Array.from({length:n+1},(_,i)=>{const b=a*i/n;return [CKX+CKR*.6*Math.sin(b),CKY-CKR*.6*Math.cos(b)];});
  s+=draw([[CKX,CKY],...pts,[CKX,CKY]],1,{color:TC,w:0,fill:TC,opacity:.28});}
 s+=line(CKX,CKY,CKX+CKR*.8*Math.sin(a),CKY-CKR*.8*Math.cos(a),{color:TC,w:5})+dot(CKX,CKY,6,TC);
 if(read)s+=label('時間',CKX-CKR-20,CKY-8,{size:24,color:C.dim,anchor:'end'})+label(`${t.toFixed(1)} s`,CKX-CKR-20,CKY+26,{size:30,color:TC,anchor:'end',weight:700});
 return fade(g,s);
}
// カウンター「通った電荷」（桃）
function counter(q,{g=1,txt=null}={}){
 const x=420,y=100,w=200,h=104;
 return fade(g,rect(x,y,w,h,{fill:'#2a1530',fo:.9,stroke:QCOL,sw:2.5,rx:12})
  +label('通った電荷',x+w/2,y+36,{size:24,color:C.dim,anchor:'middle'})
  +label(txt??`${q} C`,x+w/2,y+84,{size:36,color:QCOL,anchor:'middle',weight:700}));
}
// 𝐄 の矢印（左向き、導線の上）
const eArrow=(g=1)=>fade(g,arrow(250,232,70,232,{color:EC,w:5,head:16})+T(cs(EC,'\\mathbf{E}'),275,240,34));
// 空欄の枠 𝐯（紫）・I（緑）。dirV/dirI＝0 で空欄、±1 で向きの矢印を入れる（g は矢印の現れ方）
const BY=430;
function blanks({g=1,v=0,i=0,gv=1,gi=1}={}){
 let s=T(cs(VC,'\\mathbf{v}'),85,BY+10,36)+rect(115,BY-28,170,56,{fill:'#1a1530',fo:.7,stroke:VC,sw:2.5,rx:8});
 s+=T(cs(IC,'I'),385,BY+10,36)+rect(410,BY-28,170,56,{fill:'#13261e',fo:.7,stroke:IC,sw:2.5,rx:8});
 if(v)s+=fade(gv,v>0?arrow(140,BY,262,BY,{color:VC,w:6,head:18}):arrow(262,BY,140,BY,{color:VC,w:6,head:18}));
 if(i)s+=fade(gi,i>0?arrow(435,BY,557,BY,{color:IC,w:6,head:18}):arrow(557,BY,435,BY,{color:IC,w:6,head:18}));
 return fade(g,s);
}
// 時間の帯（0〜3 s）と、1 秒ごとの桃の束（1つ＝1 C、1 秒に 4 個）
const TLX=70,TLW=540,TLY=490,sx=t=>TLX+TLW*t/3;
function timeline({g=1,fill=1,frames=0,four=0,split=0}={}){
 let s=line(TLX,TLY-22,TLX+TLW,TLY-22,{color:TC,w:3});
 for(let k=0;k<=3;k++)s+=line(sx(k),TLY-32,sx(k),TLY-12,{color:TC,w:3})+label(k?`${k} s`:'0',sx(k),TLY+8,{size:22,color:TC,anchor:'middle'});
 for(let k=0;k<3;k++){
  const cx=sx(k+.5)+(k-1)*split*14,top=402;
  for(let j=0;j<4;j++){const n=k*4+j,op=clamp(fill*12-n);const x=cx+(j%2?16:-16),y=top+(j<2?14:42);s+=fade(op,ring(x,y,11,{color:QCOL,w:2.5,fill:'#3a2140'})+dot(x,y,4,QCOL));}
  s+=fade(frames,rect(cx-36,top-6,72,68,{fill:'none',fo:0,stroke:QCOL,sw:2.5,rx:10}));
  if(k===0)s+=fade(four,label('4 C',cx+44,top+38,{size:26,color:QCOL,weight:700}));
 }
 return fade(g,s);
}
const legendQ=(g=1)=>fade(g,ring(PX+30,476,11,{color:QCOL,w:2.5,fill:'#3a2140'})+dot(PX+30,476,4,QCOL)+label('1つ ＝ 1 C',PX+52,484,{size:24,color:QCOL}));

// 小問1 の図：導線・断面・電子・時計・カウンター（t 秒まで進んだ所）
function fig1(t,{g=1,ticksHi=0,cnt=null,stext=true}={}){
 return fade(g,wire()+electrons(0)+section(1,{text:stext})+clock(t,{ticksHi})+counter(Math.floor(4*t+1e-9),{txt:cnt}));
}
// 式の枠：Ī ＝ ΔQ/Δt
const IB=cs(IC,'\\bar{I}'),DQ=cs(QCOL,'\\Delta Q'),DT=cs(TC,'\\Delta t');

// ---- 小問2：電子の束（1 C 分） ------------------------------------------------------------------
function bundle(x,y,r,{g=1}={}){
 let s=ring(x,y,r,{color:NEG,w:2.5,dash:'6 5',fill:'#121c33'});
 const n=r>45?13:7;
 for(let i=0;i<n;i++){const a=i*2.4,rr=r*.62*Math.sqrt((i+.5)/n);s+=electron(x+rr*Math.cos(a),y+rr*Math.sin(a),{r:r>45?10:8});}
 return fade(g,s);
}
const BXS=[78,146,214,282];   // 4つの束の初めの位置（断面の左）

// ---- 小問3：断面の拡大（行13） --------------------------------------------------------------------
function zoom(p,ctx){
 const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
 const u1=seg(p,.05,b-.12),u2=seg(p,b+.02,b+.25),fr=seg(p,b+.3,b+.42);
 const cx=600,y1=180,y2=395;
 let s='';
 // 上段：電子1個が右へ通る
 s+=label('電子 1個が 右へ 通る',cx,y1-70,{size:26,color:NEG,anchor:'middle',weight:700});
 s+=`<ellipse cx="${cx}" cy="${y1}" rx="22" ry="58" fill="${TC}" fill-opacity=".14" stroke="${TC}" stroke-width="3.5"/>`;
 s+=electron(mix(cx-110,cx+110,u1),y1,{r:16});
 s+=fade(seg(p,b-.18,b-.08),T(`-(-${cs(QCOL,'e')})=+${cs(QCOL,'e')}`,cx-300,y1+12,38)+T(`+(-${cs(QCOL,'e')})`,cx+300,y1+12,38));
 s+=label('左側',cx-300,y1-50,{size:24,color:C.dim,anchor:'middle'})+label('右側',cx+300,y1-50,{size:24,color:C.dim,anchor:'middle'});
 // 下段：＋e が左へ通る
 s+=fade(seg(p,b-.02,b+.05),label('＋e が 左へ 通った 場合',cx,y2-70,{size:26,color:POS,anchor:'middle',weight:700})
  +`<ellipse cx="${cx}" cy="${y2}" rx="22" ry="58" fill="${TC}" fill-opacity=".14" stroke="${TC}" stroke-width="3.5"/>`
  +plusQ(mix(cx+110,cx-110,u2),y2,{r:16})
  +fade(seg(p,b+.22,b+.3),T(`+${cs(QCOL,'e')}`,cx-300,y2+12,38)+T(`-${cs(QCOL,'e')}`,cx+300,y2+12,38)));
 // 同じ変化を同じ色の枠で結ぶ
 s+=fade(fr,highlight(cx-300-130,y1-30,260,84,1,C.hi)+highlight(cx-300-130,y2-30,260,84,1,C.hi)+line(cx-300,y1+56,cx-300,y2-32,{color:C.hi,w:3,dash:'7 6'})
  +highlight(cx+300-130,y1-30,260,84,1,EC)+highlight(cx+300-130,y2-30,260,84,1,EC)+line(cx+300,y1+56,cx+300,y2-32,{color:EC,w:3,dash:'7 6'})
  +label('同じ 変化',cx-300-140,(y1+y2)/2+10,{size:26,color:C.hi,weight:700,anchor:'end'})+label('同じ 変化',cx+300+140,(y1+y2)/2+10,{size:26,color:EC,weight:700}));
 return s;
}
const DRIFT=40; // 電子のずれる速さ（px/s、絵のため）

export const ytQxUiConductionDiagrams={
 // ===================== 問題アニメ（6 秒＋静止） =====================
 // 0〜2 s：導線・金の断面・時計。2〜5 s：時計が 0→3 s、カウンター 0→12 C。電子は両側に（動かさない）。5〜6 s：𝐄 と空欄の枠。
 [K+'q0']:(p,ctx)=>{
  const t=cueT(ctx),tc=clamp(t-2,0,3);
  let s=wire(seg(p,0,.12))+section(seg(p,.08,.2))+electrons(0,{g:seg(p,.12,.28)});
  const M=x=>`<g transform="translate(270 0)">${x}</g>`;
  s+=clock(tc,{g:seg(p,.15,.3)})+counter(Math.floor(4*tc+1e-9),{g:seg(p,.2,.33)});
  s+=eArrow(seg(p,.84,.92))+blanks({g:seg(p,.88,.97)});
  s+=fade(seg(p,.88,.97),label('電子の 速度',100,BY+62,{size:22,color:VC})+label('電流',410,BY+62,{size:22,color:IC}));
  return M(s);
 },

 // ===================== 小問1 =====================
 // 1. 時計が 3 秒進む間に、カウンターが 12 C まで増える（実時間）
 [K+'count']:(p,ctx)=>{
  const t=clamp(cueT(ctx)-1.2,0,3);
  return fig1(t);
 },
 // 2. 求めるもの
 [K+'goal1']:(p)=>fig1(3)+goalTag(G1,{g:seg(p,.03,.15)}),
 // 3. 記号を図に（ΔQ・Δt）→ 右の式カード Ī＝ΔQ/Δt、1秒ごとの目盛りと桃の束
 [K+'rate']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=fig1(3,{ticksHi:seg(p,b+.1,b+.2),stext:1-seg(p,b+.05,b+.1)>.5});
  s+=fade(seg(p,.1,.22),label('ΔQ ＝ 通った電荷',520,238,{size:24,color:QCOL,anchor:'middle',weight:700}));
  s+=fade(seg(p,.22,.34),label('Δt ＝ かかった時間',WX1,238,{size:24,color:TC,weight:700}));
  s+=timeline({g:seg(p,b+.1,b+.2),fill:seg(p,b+.12,b+.4),frames:seg(p,b+.45,b+.55)});
  s+=legendQ(seg(p,b+.1,b+.2));
  s+=panel(95,230,label('電流 ＝ 1秒 あたりに 通る 電荷',PC,140,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,b,b+.1),T(`${IB}=\\dfrac{${DQ}}{${DT}}`,PC,250,56)),seg(p,.02,.12),C.faint);
  return s+goalTag(G1);
 },
 // 4. 12 C の束が3つ、1つ分に「4 C」。式 12÷3＝4 C/s＝4 A。2文目で答えの札
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55;
  let s=fig1(3,{stext:false});
  s+=timeline({fill:1,frames:1,split:seg(p,.05,.2),four:seg(p,.2,.3)})+legendQ();
  s+=panel(95,330,T(`${IB}=\\dfrac{${DQ}}{${DT}}`,PC,165,40)
   +fade(seg(p,.08,.2),T(`=\\dfrac{12${U('C')}}{3${U('s')}}`,PC,265,40))
   +fade(seg(p,.25,.38),T(cs(IC,`=4${U('C/s}=4\\,\\mathrm{A')}`),PC,370,44)),1,C.faint);
  return s+goalTag(G1)+ANS1(seg(p,b,b+.08));
 },
 // 5. 誤答 A・B（1文目を半分ずつ）→ C（2文目）
 [K+'wrong1']:(p,ctx)=>{
  const W=sentWin(ctx),m=W[0][1]*.5,w=[[0,m],[m,W[0][1]],[W[1]?W[1][0]:.6,1]];
  let s=fig1(3,{stext:false})+timeline({fill:1,frames:1,split:1,four:1});
  s+=wrongSeq(p,ctx,[['A','36 A','12×3 と掛けた（単位 C·s）'],['B','0.25 A','3÷12 と逆に割った'],['C','12 A','時間で割っていない']],{win:w,opts:WOPT});
  return s+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 // 6. 導線と断面、カウンター「1 秒に 4 C」。求めるもの
 [K+'goal2']:(p)=>{
  let s=wire()+electrons(0)+section()+clock(1,{read:1})+counter(0,{txt:'4 C'});
  s+=fade(seg(p,.1,.25),label('1 秒に 4 C',PC,240,{size:34,color:QCOL,anchor:'middle',weight:700}));
  return s+goalTag(G2,{g:seg(p,.03,.15)});
 },
 // 7. 1 C ＝ 電子 6.25×10¹⁸ 個の束 → 束が4つ（1 秒に 4 C）
 [K+'bundle']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,f=seg(p,b,b+.12);
  let s=fade(1-f,bundle(240,300,70,{g:seg(p,.03,.15)})+fade(seg(p,.08,.2),label('1 C',240,410,{size:30,color:QCOL,anchor:'middle',weight:700})
   +label('6.25×10¹⁸ 個',240,205,{size:30,color:NEG,anchor:'middle',weight:700})));
  s+=fade(f,BXS.map((x,i)=>bundle(x,WY,30,{g:seg(p,b+.03*i,b+.06+.03*i)})+label('1 C',x,WY+66,{size:22,color:QCOL,anchor:'middle'})).join('')
   +fade(seg(p,b+.15,b+.25),label('1 秒に 4 C',180,200,{size:30,color:QCOL,anchor:'middle',weight:700})+label('→ 4 束',320,200,{size:30,color:NEG,weight:700})));
  s+=panel(95,200,label('電子 1個の 電荷は e',PC,140,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.1,.22),T(`\\dfrac{1}{1.6\\times10^{-19}}=6.25\\times10^{18}`,PC,225,32)),seg(p,.05,.15),C.faint);
  return s+goalTag(G2);
 },
 // 8. 4つの束が断面を通り抜ける（1 秒）→「2.5×10¹⁹ 個」、2文目で答えの札
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55;
  const t=clamp(cueT(ctx)-.4,0,2.2)/2.2;
  let s=wire(seg(p,0,.08),{hh:44})+section(1,{hh:44})+clock(t,{read:1});
  s+=BXS.map(x=>bundle(x+300*t,WY,30)).join('');
  s+=fade(seg(p,b-.15,b-.05),label('およそ 2.5×10¹⁹ 個',WX1+290,450,{size:32,color:NEG,anchor:'middle',weight:700}));
  s+=panel(95,230,label('1 秒に 通る 電子の 数',PC,140,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.05,.18),T(`4\\times6.25\\times10^{18}`,PC,205,36))
   +fade(seg(p,.2,.32),T(`\\approx2.5\\times10^{19}`,PC,280,40,{color:NEG})),1,C.faint);
  return s+goalTag(G2)+ANS2(seg(p,b,b+.08));
 },
 // 9. 誤答 B・C（1文目）→ D（2文目）
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),m=W[0][1]*.45,w=[[0,m],[m,W[0][1]],[W[1]?W[1][0]:.6,1]];
  let s=wire(1,{hh:44})+section(1,{hh:44})+clock(1)+BXS.map(x=>bundle(x+300,WY,30)).join('');
  s+=label('およそ 2.5×10¹⁹ 個',WX1+290,450,{size:32,color:NEG,anchor:'middle',weight:700});
  s+=wrongSeq(p,ctx,[['B','6.4×10⁻¹⁹ 個','e を掛けた（単位 C²/s）'],['C','6.25×10¹⁸ 個','1 C 分のまま'],['D','7.5×10¹⁹ 個','3 秒分の個数']],{win:w,opts:WOPT});
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 // 10. 導線の上に左向きの 𝐄、空欄の枠 𝐯・I。求めるもの
 [K+'goal3']:(p)=>{
  let s=wire()+electrons(0)+section(1,{text:false});
  s+=eArrow(seg(p,.05,.2))+blanks({g:seg(p,.1,.25)});
  return s+goalTag(G3,{g:seg(p,.03,.15)});
 },
 // 11. 電子が右へ動き出す。𝐯 の枠に右向きの紫の矢印
 [K+'push']:(p,ctx)=>{
  const t=cueT(ctx);
  let s=wire()+electrons(DRIFT*Math.max(0,t-.8)*seg(p,.1,.3))+section(1,{text:false})+eArrow()+blanks({v:1,gv:seg(p,.35,.5)});
  s+=panel(110,200,label('電子：負の 電荷',PC,170,{size:28,color:NEG,anchor:'middle',weight:700})
   +label('→ 𝐄 と 逆向き（右）に 押される',PC,235,{size:26,color:C.ink,anchor:'middle'}),seg(p,.15,.3),C.faint);
  return s+goalTag(G3);
 },
 // 12. 約束のカード（緑枠）
 [K+'rule']:(p,ctx)=>{
  const t=tAt(ctx,K+'push');
  let s=wire()+electrons(DRIFT*Math.max(0,t-.8))+section(1,{text:false})+eArrow()+blanks({v:1});
  s+=panel(110,200,label('約束',PC,165,{size:28,color:IC,anchor:'middle',weight:700})
   +label('電流の 向き ＝',PC,220,{size:28,color:C.ink,anchor:'middle',weight:700})+label('正の 電荷が 動く 向き',PC,265,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),IC);
  return s+goalTag(G3);
 },
 // 13. 断面の拡大：電子1個が右へ通る ＝ ＋e が左へ通る
 [K+'same']:(p,ctx)=>zoom(p,ctx)+goalTag(G3),
 // 14. I の枠に左向きの緑の矢印。𝐄・𝐯・I の3本を縦に並べる。2文目で答えの札
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6,t=cueT(ctx);
  let s=wire()+electrons(DRIFT*t)+section(1,{text:false})+eArrow()+blanks({v:1,i:-1,gi:seg(p,.05,.18)});
  const row=(y,tx,col,dir,txt,g)=>fade(g,T(tx,PX+70,y+12,36)+(dir<0?arrow(PX+260,y,PX+120,y,{color:col,w:6,head:18}):arrow(PX+120,y,PX+260,y,{color:col,w:6,head:18}))+label(txt,PX+290,y+9,{size:26,color:col,weight:700}));
  s+=panel(95,290,row(150,cs(EC,'\\mathbf{E}'),EC,-1,'左',seg(p,.2,.3))+row(240,cs(VC,'\\mathbf{v}'),VC,1,'右（電子）',seg(p,.3,.4))+row(330,cs(IC,'I'),IC,-1,'左（電流）',seg(p,.4,.5)),seg(p,.18,.28),C.faint);
  return s+goalTag(G3)+ANS3(seg(p,b,b+.08));
 },
 // 15. 誤答 A・B（1文目）→ D（2文目）
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),m=W[0][1]*.45,w=[[0,m],[m,W[0][1]],[W[1]?W[1][0]:.6,1]],t=tAt(ctx,K+'ans3');
  let s=wire()+electrons(DRIFT*t)+section(1,{text:false})+eArrow()+blanks({v:1,i:-1});
  s+=wrongSeq(p,ctx,[['A','電子 左、電流 左','電子も 電場の 向きと 考えた'],['B','電子 右、電流 右','電流を 電子と 同じ 向きに した'],['D','電子 左、電流 右','両方とも 逆']],{win:w,opts:WOPT});
  return s+goalTag(G3)+ANS3(1);
 },

 // ===================== まとめ =====================
 [K+'sum']:(p)=>{
  let s=wire()+electrons(0)+section()+clock(1)+counter(0,{txt:'4 C'});
  s+=panel(110,200,label('1 秒に 断面を 通る 電荷',PC,170,{size:26,color:C.dim,anchor:'middle'})
   +T(cs(IC,`4${U('C/s}=4\\,\\mathrm{A')}`),PC,250,50),seg(p,.05,.2),IC);
  return s+answerRow([[1,'D',''],[2,'A',''],[3,'C','']],{g:seg(p,.3,.4)});
 },
};

// 問題編 解説「注射器を 5分の2 に押し縮める」(ys-qx-hs-t-gas-1) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/202_気体の法則.md の q-hs-t-gas-1（解説 21 行）。
// 色（正本の指示）：圧力 P 緑、体積 V 水色、絶対温度 T 黄緑、力 F 緑、強調 黄、誤り 赤（×印）、答えの札 黄色の枠。分子の点は白。
// 注射器は、先（左端）をふさぎ、ピストンは右。目盛りは 1 mL＝10 px（50 mL と 20 mL の比は正しい）。分子の点は最後まで 20 個。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 元の単元動画（yt1-hs-t-gas-1）の部品（分子の箱 gasBox・当たった回数 hitCount・式の一歩 step）を読み込んで使う（そのファイルは編集しない）。
import {C,seg,lin,fade,label,line,rect,dot,ring,arrow,tex,clamp,mix} from './anim.mjs';
import {T2,FA,TC,sceneT,PC,VC,Pt,Vt,P1,P2,V1,V2,PA,E5,gasBox,hitCount,step} from './yt1-hs-t-gas-1-diagrams.mjs';
import {QC,card,goalTag,answerTag,answerRow,wrongSeq,wrongCard,kindTag,note,textW,cueT,tAt,sentWin} from './yt1-qx-common.mjs';

const K='qx-hs-t-gas-1:';
const MOLW='#eef3fb';                    // 分子の点（白）
const G1='押した後の圧力',G2='2.5 倍になる理由',G3='ピストンを押す力';
const A1=g=>answerTag(1,'C','2.5×10⁵ Pa',{g}),A2=g=>answerTag(2,'B','',{g}),A3=g=>answerTag(3,'B','50 N',{g});
const at=(W,i,d=.5)=>W[i]?W[i][0]:d;     // i 番目の文が始まる所（cue の進み）

// ---- 注射器（先を左でふさぐ。x0＝0 mL の所、1 mL＝8 px）-----------------------------------------
const SY={x0:200,k:10,yc:340,h:160,rod:410};
const xOf=v=>SY.x0+SY.k*v;
function plateBox(text,cx,cy,{size=26,color=C.ink,stroke,g=1,fill='#131f38'}={}){
 const w=textW(text,size)+28,h=size+20;
 return fade(g,rect(cx-w/2,cy-h/2,w,h,{fill,fo:.96,stroke:stroke??color,sw:2.5,rx:10})+label(text,cx,cy+size*.36,{size,color,anchor:'middle',weight:700}));
}
function lock(x,y,col){
 return `<path d="M${x-7} ${y-4} v-6 a7 7 0 0 1 14 0 v6" fill="none" stroke="${col}" stroke-width="3"/>`+rect(x-11,y-5,22,17,{fill:col,fo:.9,stroke:'none',rx:3});
}
export function syr(V,{t=0,hit=0,seal=0,scale=1,g=1,n=20,seed=3}={}){
 const {x0,yc,h,k}=SY,xp=xOf(V),xB=xOf(55),top=yc-h/2-4,bot=yc+h/2+4;
 let s='';
 // 先（ふさいだ口）
 s+=rect(x0-60,yc-20,60,40,{fill:'#0f1a30',fo:.9,stroke:C.dim,sw:2,rx:4});
 s+=rect(x0-92,yc-28,34,56,{fill:'#c9d2e3',fo:.9,stroke:'#eef3fb',sw:2,rx:6});
 if(seal)s+=fade(seal,ring(x0-75,yc,48,{color:C.hi,w:5}));
 // 気体と分子
 s+=gasBox({x:x0,y:yc-h/2,w:xp-x0,h,n,dist:220*t,seed,hit,color:MOLW,frame:true,stroke:'none'});
 // 筒
 s+=line(x0,top,xB,top,{color:C.dim,w:4})+line(x0,bot,xB,bot,{color:C.dim,w:4});
 s+=line(x0,top,x0,yc-20,{color:C.dim,w:4})+line(x0,yc+20,x0,bot,{color:C.dim,w:4});
 s+=line(xB,top-14,xB,top,{color:C.dim,w:4})+line(xB,bot,xB,bot+14,{color:C.dim,w:4});
 // 目盛り（水色）
 if(scale){let m='';
  for(let v=0;v<=50;v+=5){const X=xOf(v),big=v%10===0;m+=line(X,top-(big?16:9),X,top,{color:VC,w:big?3:2});if(big&&v>0)m+=label(String(v),X,top-24,{size:22,color:VC,anchor:'middle',weight:700});}
  m+=label('mL',xOf(50)+40,top-24,{size:22,color:VC,weight:700});
  s+=fade(scale,m);}
 // ピストン・棒・持ち手
 s+=rect(xp,yc-h/2,20,h,{fill:'#7d8aa3',fo:1,stroke:'#c9d2e3',sw:2,rx:3});
 s+=rect(xp+20,yc-10,SY.rod,20,{fill:'#7d8aa3',fo:1,stroke:'none',rx:3});
 s+=rect(xp+20+SY.rod,yc-56,20,112,{fill:'#7d8aa3',fo:1,stroke:'#c9d2e3',sw:2,rx:4});
 return fade(g,s);
}
// 「押す前 1.0×10⁵ Pa」の札。m＝0 で注射器の上・緑、m＝1 で左上へ寄せて灰色
function p0Plate(m,{g=1}={}){
 const x=mix(450,200,m),y=mix(150,118,m),col=m<.5?PC:C.dim;
 return plateBox('押す前 1.0×10⁵ Pa',x,y,{size:mix(28,24,m),color:col,stroke:col,g});
}
const qPlate=(g=1,x=600,y=128)=>plateBox('押した後の 圧力 ？',x,y,{size:28,color:PC,g});
function areaPlate(V,g=1){
 const xp=xOf(V)+10,yb=SY.yc+SY.h/2+4;
 return fade(g,line(xp,yb+4,xp,yb+28,{color:C.ink,w:2})+plateBox('ピストンの 断面積 2.0 cm²',xp+40,yb+52,{size:24,color:C.ink,stroke:C.dim}));
}
const vPlate=(V,g=1)=>plateBox(`${V} mL`,xOf(V)+10,SY.yc-SY.h/2-72,{size:24,color:VC,g});
// 内側からピストンを押す緑の矢印
function pushArrow(V,{g=1,text='？'}={}){
 const xp=xOf(V);
 return fade(g,FA(xp-120,SY.yc,xp-2,SY.yc,{w:9,head:24})+plateBox(text,xp-64,SY.yc-58,{size:28,color:C.F}));
}
// 押す前・押した後の分子の箱（同じ数・同じ動き。中心の動ける幅を 50：20 にする）
const RB=8,BS=46;   // BS：当たった回数の比が、数える区間で 2.5 に近くなる種（qx-hs-t-gas-1 の音声の長さで確かめた）
function twoBoxes({t=0,hit=0,x1=120,x2=740,y=150,h=250,scale=8,n=14,g=1,wall=0,heads=1}={}){
 const w1=50*scale+2*RB,w2=20*scale+2*RB;
 let s=gasBox({x:x1,y,w:w1,h,n,dist:200*t,seed:BS,hit,color:MOLW});
 s+=gasBox({x:x2,y,w:w2,h,n,dist:200*t,seed:BS,hit,color:MOLW});
 if(heads)s+=label('押す前（50 mL）',x1+w1/2,y-16,{size:26,color:VC,anchor:'middle',weight:700})+label('押した後（20 mL）',x2+w2/2,y-16,{size:26,color:VC,anchor:'middle',weight:700});
 if(wall)s+=fade(wall,rect(x1+w1-6,y-4,14,h+8,{fill:C.hi,fo:.15,stroke:C.hi,sw:3,rx:4})+rect(x2+w2-6,y-4,14,h+8,{fill:C.hi,fo:.15,stroke:C.hi,sw:3,rx:4}));
 return fade(g,s);
}
const hits2=(scale,n,t0,t1)=>[hitCount({w:50*scale+2*RB,n,seed:BS,r:RB,d0:200*t0,d1:200*t1}),hitCount({w:20*scale+2*RB,n,seed:BS,r:RB,d0:200*t0,d1:200*t1})];
function clock(x,y,t,{g=1,r=30}={}){
 const a=t*2.2;
 return fade(g,ring(x,y,r,{color:C.t,w:3,fill:'#0f1a30'})+line(x,y,x+r*.8*Math.sin(a),y-r*.8*Math.cos(a),{color:C.t,w:3})+dot(x,y,3,C.t));
}
// P₁V₁＝P₂V₂（前・後の札つき）
function boyle(cx,cy,{size=60,g=1,labs=1}={}){
 const L=`${P1}${V1}`,R=`${P2}${V2}`,wl=58*size/60*2.3,gap=size*.9;
 let s=tex(L,cx-gap-wl/2,cy,{size,auto:false})+tex('=',cx,cy,{size,auto:false})+tex(R,cx+gap+wl/2,cy,{size,auto:false});
 if(labs)s+=fade(labs,label('前',cx-gap-wl/2,cy+size*1.15,{size:28,color:C.dim,anchor:'middle',weight:700})+label('後',cx+gap+wl/2,cy+size*1.15,{size:28,color:C.dim,anchor:'middle',weight:700}));
 return fade(g,s);
}
// 分数「50 mL / 20 mL」（mL に打ち消し線）
function mlFrac(cx,cy,{strike=0,g=1}={}){
 const sz=44,a='50 mL',b='20 mL',wa=textW(a,sz),num=textW('50 ',sz),mlw=textW('mL',sz);
 let s=label(a,cx,cy-24,{size:sz,color:VC,anchor:'middle',weight:700})+line(cx-wa/2-10,cy,cx+wa/2+10,cy,{color:C.ink,w:3})+label(b,cx,cy+52,{size:sz,color:VC,anchor:'middle',weight:700});
 const xs=cx-wa/2+num-4,xe=xs+mlw;
 s+=fade(strike,line(xs,cy-24-8,xe,cy-24-30,{color:C.hi,w:4})+line(xs,cy+52-8,xe,cy+52-30,{color:C.hi,w:4}));
 return fade(g,s);
}

export const qxHsTGas1Diagrams={
 // ================= 問題アニメ：出題中（小問1・2、6秒＋静止）=================
 // 0〜2秒：50 mL で止まっている（分子は動く）。2秒から：押す前の札を灰色にして左上へ寄せ、ピストンが 20 mL まで動く。
 // 押した後の圧力は「？」だけ。壁が光る回数・力の値は出さない。
 [K+'q0']:(p,ctx)=>{
  const t=sceneT(p,ctx),u=seg(t,2,5.6),V=mix(50,20,u);
  let s=syr(V,{t});
  s+=p0Plate(seg(t,2,2.6));
  s+=areaPlate(V);
  s+=vPlate(50,1-seg(t,1.9,2.1))+vPlate(20,seg(t,5.5,5.8));
  s+=qPlate(seg(t,5.4,5.9));
  return s;
 },
 // 小問3：押し縮めた後の注射器に、内側からピストンを押す緑の矢印（「？」）を加える
 [K+'q3']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=syr(20,{t:6+t})+p0Plate(1)+areaPlate(20)+vPlate(20);
  s+=pushArrow(20,{g:seg(t,.3,1.2)});
  return s;
 },
 // ================= S1 小問1 =================
 // 1. 出題中の図（20 mL・？）で始め、求めるもの
 [K+'goal1']:(p,ctx)=>{
  const t=6+sceneT(p,ctx);
  return syr(20,{t})+p0Plate(1)+areaPlate(20)+vPlate(20)+qPlate()+goalTag(G1,{g:seg(p,.03,.15)});
 },
 // 2. 先をふさいだ → 分子の数（鍵）。温度は問題の条件で一定（鍵）。前提タグ
 [K+'fix']:(p,ctx)=>{
  const t=6+sceneT(p,ctx),W=sentWin(ctx),b=at(W,1);
  let s=syr(20,{t,seal:seg(p,.03,.12)})+p0Plate(1)+vPlate(20);
  s+=fade(1-seg(p,0,.08),qPlate()+areaPlate(20));
  s+=card(880,150,300,270,'',seg(p,.05,.15),C.dim);
  s+=fade(seg(p,.12,.22),lock(912,212,C.ink)+label('分子の 数',937,222,{size:30,color:C.ink,weight:700}));
  s+=fade(seg(p,b,b+.08),lock(912,292,TC)+label('温度',937,302,{size:30,color:TC,weight:700})+label('問題の 条件：等温',902,350,{size:24,color:TC,weight:700}));
  s+=kindTag('前提',1030,395,{g:seg(p,b+.1,b+.18)});
  s+=fade(seg(p,.05,.15),label('先を ふさいだ',95,430,{size:24,color:C.hi,anchor:'middle',weight:700}));
  return s+goalTag(G1);
 },
 // 3. ボイルの法則 P₁V₁＝P₂V₂（前・後）。法則タグ
 [K+'law']:(p)=>{
  let s=card(250,140,700,220,boyle(600,240,{labs:seg(p,.5,.65)}),seg(p,.05,.2),PC);
  s+=kindTag('法則',600,420,{g:seg(p,.3,.45)});
  s+=fade(seg(p,.2,.35),label('分子の 数・温度 一定',600,120,{size:26,color:C.dim,anchor:'middle',weight:700}));
  return s+goalTag(G1);
 },
 // 4. 両辺を V₂ で割って P₂＝P₁V₁/V₂（黄の枠）
 [K+'solve']:(p)=>step(p,`${P1}${V1}=${P2}${V2}`,`${P2}=\\dfrac{${P1}${V1}}{${V2}}`,'両辺 ÷ V₂',{size:52,y0:110,col:C.hi})+goalTag(G1),
 // 5. 代入 → 2.5×10⁵ Pa（50/20＝2.5）。2文目で注射器に戻り、？ が 2.5×10⁵ Pa に替わる。答えの札
 [K+'num']:(p,ctx)=>{
  const W=sentWin(ctx),b=at(W,1),sw=seg(p,b-.02,b+.04);
  let e=fade(.6,T2(`${P2}=\\dfrac{${P1}${V1}}{${V2}}`,600,130,{size:36}));
  e+=card(150,200,900,150,fade(seg(p,.04,.14),T2(`${P2}=\\dfrac{${E5}\\times{\\color{${VC}}50}}{{\\color{${VC}}20}}`,450,275,{size:44,auto:false}))+fade(seg(p,.28,.4),T2(`=2.5\\times10^{5}${PA}`,820,275,{size:44,auto:false})),1,PC);
  e+=fade(seg(p,.18,.28),label('50 ／ 20 ＝ 2.5',600,410,{size:30,color:C.hi,anchor:'middle',weight:700}));
  let s=fade(1-sw,e);
  const t=6+cueT(ctx);
  s+=fade(sw,syr(20,{t})+p0Plate(1)+areaPlate(20)+vPlate(20)+plateBox('押した後 2.5×10⁵ Pa',600,128,{size:28,color:PC}));
  return s+goalTag(G1)+A1(seg(p,b+.02,b+.1));
 },
 // 6. mL どうしに打ち消し線（比だけを使う）
 [K+'unit']:(p,ctx)=>{
  const W=sentWin(ctx),b=at(W,1);
  let s=card(330,120,540,240,mlFrac(520,230,{strike:seg(p,.3,.45)})+fade(seg(p,.45,.55),label('＝ 2.5',720,250,{size:44,color:C.hi,anchor:'middle',weight:700})),seg(p,.03,.15),VC);
  s+=fade(seg(p,b,b+.08),label('比 だけを 使う → 単位は 消える',600,430,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s+goalTag(G1)+A1(1);
 },
 // 7. 誤答 A・B（1枚ずつ）
 [K+'wrongAB']:(p,ctx)=>{
  let s=card(300,96,600,120,T2(`${P2}=\\dfrac{${P1}${V1}}{${V2}}=2.5\\times10^{5}${PA}`,600,158,{size:38,auto:false}),.55,C.faint);
  s+=wrongSeq(p,ctx,[['A','4.0×10⁴ Pa','体積に 比例 と した（反比例が 正しい）',{mid:`${E5}\\times 20/50=4.0\\times10^{4}${PA}`}],['B','1.0×10⁵ Pa','一定 なのは 温度、圧力は 変わる']],{opts:{y:250}});
  return s+goalTag(G1)+A1(1);
 },
 // 8. 誤答 D（差 30 mL から倍率）
 [K+'wrongD']:(p)=>{
  let s=card(300,96,600,120,T2(`${P2}=\\dfrac{${P1}${V1}}{${V2}}=2.5\\times10^{5}${PA}`,600,158,{size:38,auto:false}),.55,C.faint);
  s+=wrongCard('D','1.5×10⁵ Pa','差 30 mL から 倍率を 作った',{y:250,mid:`${E5}\\times 30/20=1.5\\times10^{5}${PA}`,g:seg(p,.02,.08)});
  return s+goalTag(G1)+A1(1);
 },
 // ================= S2 小問2 =================
 // 9. 求めるもの：2.5 倍になる理由。押す前・押した後の箱（分子の数は同じ）
 [K+'goal2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=twoBoxes({t,g:seg(p,.05,.2)});
  s+=fade(seg(p,.3,.45),label('分子 14 個',328,445,{size:26,color:C.ink,anchor:'middle'})+label('分子 14 個',828,445,{size:26,color:C.ink,anchor:'middle'}));
  return s+goalTag(G2,{g:seg(p,.03,.15)});
 },
 // 10. 密度 2.5倍、右の壁に当たる回数（同じ時間で数える）
 [K+'hits']:(p,ctx)=>{
  const t=sceneT(p,ctx),t0=t-cueT(ctx);
  let s=twoBoxes({t,hit:seg(p,.3,.4),wall:seg(p,.3,.4)});
  s+=fade(seg(p,.05,.18),arrow(560,250,700,250,{color:C.hi,w:5,head:16})+label('密度 ×2.5',630,232,{size:26,color:C.hi,anchor:'middle',weight:700}));
  const c0=t0+(p>.3?durStart(ctx,.3):0);
  if(p>=.3){const [a,b]=hits2(8,14,c0,t);
   s+=label(`当たった 回数 ${a} 回`,328,445,{size:28,color:C.hi,anchor:'middle',weight:700})+label(`${b} 回`,828,445,{size:28,color:C.hi,anchor:'middle',weight:700});}
  s+=clock(630,330,t,{g:seg(p,.3,.4)})+fade(seg(p,.3,.4),label('同じ 時間',630,385,{size:22,color:C.t,anchor:'middle',weight:700}));
  s+=note('（動きは ゆっくり 描いています）',600,500,{g:seg(p,.3,.4)});
  return s+goalTag(G2);
 },
 // 11. 1個の速さの矢印（紫）は前後で同じ。小問2 の答え B
 [K+'ans2']:(p,ctx)=>{
  const t=sceneT(p,ctx),W=sentWin(ctx),b=at(W,1);
  let s=fade(.35,twoBoxes({t,hit:1}));
  s+=card(250,180,700,180,'',seg(p,.03,.12),C.v);
  s+=fade(seg(p,.05,.15),label('押す前',330,240,{size:26,color:C.ink,anchor:'middle',weight:700})+arrow(410,232,690,232,{color:C.v,w:6,head:18})+label('押した後',330,310,{size:26,color:C.ink,anchor:'middle',weight:700})+arrow(410,302,690,302,{color:C.v,w:6,head:18}));
  s+=fade(seg(p,.15,.25),label('平均の 速さ',810,240,{size:26,color:C.v,anchor:'middle',weight:700})+label('同じ',810,310,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s+goalTag(G2)+A2(seg(p,b+.02,b+.1));
 },
 // 12. 誤答 A・C（1枚ずつ）
 [K+'wrongAC2']:(p,ctx)=>{
  let s=card(200,96,800,120,label('密度 2.5倍 → 当たる 回数 2.5倍',600,146,{size:30,color:C.ink,anchor:'middle',weight:700})+label('1回の 強さ（温度で 決まる）：同じ',600,192,{size:26,color:C.dim,anchor:'middle',weight:700}),.8,C.faint);
  s+=wrongSeq(p,ctx,[['A','分子が 速くなる','温度一定 なので 平均の 速さは 同じ'],['C','分子が 増える','先を ふさいでいる']],{opts:{y:260}});
  return s+goalTag(G2)+A2(1);
 },
 // 13. 誤答 D。2文目：同じ面積（黄の枠）・同じ時間（時計）で当たる回数を比べる
 [K+'wrongD2']:(p,ctx)=>{
  const t=sceneT(p,ctx),W=sentWin(ctx),b=at(W,1),o=seg(p,b,b+.06);
  let s=wrongCard('D','分子どうしが 押し返す','ここでは 考えない',{y:86,size:26,whySize:22,g:seg(p,.02,.08)});
  s+=fade(o,twoBoxes({t,hit:1,y:235,h:170,scale:8,n:14,wall:1,heads:0,x1:140,x2:760}));
  s+=fade(o,label('押す前',348,226,{size:24,color:VC,anchor:'middle',weight:700})+label('押した後',848,226,{size:24,color:VC,anchor:'middle',weight:700}));
  s+=clock(650,320,t,{g:o})+fade(o,label('同じ 時間',650,375,{size:22,color:C.t,anchor:'middle',weight:700}));
  if(p>b+.02){const t0=t-cueT(ctx)+durStart(ctx,b+.02);const [x,y]=hits2(8,14,t0,t);
   s+=label(`${x} 回`,348,445,{size:28,color:C.hi,anchor:'middle',weight:700})+label(`${y} 回`,848,445,{size:28,color:C.hi,anchor:'middle',weight:700});}
  s+=plateBox('同じ 面積・同じ 時間なら、当たる 回数が 多いほど 圧力が 大きい',600,492,{size:24,color:C.hi,g:seg(p,b+.15,b+.22)});
  return s+goalTag(G2)+A2(1);
 },
 // ================= S3 小問3 =================
 // 14. 注射器に戻り、ピストンの面に緑の矢印（？）
 [K+'goal3']:(p,ctx)=>{
  const t=6+sceneT(p,ctx);
  let s=syr(20,{t})+p0Plate(1)+areaPlate(20)+vPlate(20);
  s+=pushArrow(20,{g:seg(p,.1,.25)});
  return s+goalTag(G3,{g:seg(p,.03,.15)});
 },
 // 15. P＝F/A（定義）→ 両辺 × A → F＝PA
 [K+'fpa']:(p,ctx)=>{
  const W=sentWin(ctx),b=at(W,1);
  let s=card(380,110,440,150,T2(`${Pt}=\\dfrac{F}{A}`,600,190,{size:56}),seg(p,.03,.15),PC);
  s+=kindTag('定義',900,190,{g:seg(p,.12,.22)});
  s+=fade(seg(p,.03,.15),label('圧力 ＝ 面積 1 m² あたりの 力',600,300,{size:26,color:C.dim,anchor:'middle',weight:700}));
  s+=fade(seg(p,b,b+.06),label('両辺 × 面積 A',600,350,{size:28,color:C.hi,anchor:'middle',weight:700})+arrow(600,362,600,392,{color:C.hi,w:4,head:12}));
  s+=card(400,400,400,100,T2(`F=${Pt}A`,600,452,{size:50}),seg(p,b+.08,b+.18),C.hi);
  return s+goalTag(G3);
 },
 // 16. 1 m 四方の中に 1 cm 四方が 100×100 個 → 1 cm²＝1.0×10⁻⁴ m²、2.0 cm²＝2.0×10⁻⁴ m²
 [K+'area']:(p,ctx)=>{
  const W=sentWin(ctx),b=at(W,1),c=at(W,2,.75),X=110,Y=110,L=300,d=L/100;
  let g='';for(let i=1;i<100;i++){g+=line(X+i*d,Y,X+i*d,Y+L,{color:C.faint,w:.5})+line(X,Y+i*d,X+L,Y+i*d,{color:C.faint,w:.5});}
  let s=fade(seg(p,b,b+.08),rect(X,Y,L,L,{fill:PC,fo:.08,stroke:PC,sw:3,rx:0})+g+label('1 m',X+L/2,Y+L+34,{size:26,color:C.ink,anchor:'middle',weight:700})+label('1 m',X-14,Y+L/2+8,{size:26,color:C.ink,anchor:'end',weight:700}));
  s+=fade(seg(p,b+.05,b+.12),rect(X,Y+L-d,d,d,{fill:C.hi,fo:1,stroke:C.hi,sw:1,rx:0})+line(X+d,Y+L-d,520,250,{color:C.hi,w:2})+ring(560,250,48,{color:C.hi,w:3,fill:'#0f1a30'})+rect(536,226,48,48,{fill:C.hi,fo:.25,stroke:C.hi,sw:2,rx:0})+label('1 cm',560,320,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,b+.12,b+.2),label('1 m 四方に 1 cm 四方が 100×100 個',X+L/2+60,Y+L+80,{size:24,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.03,.12)*(1-seg(p,b-.03,b)),plateBox('2.0 cm² ＝ ？ m²',600,260,{size:36,color:C.ink,stroke:C.dim}));
  s+=card(660,120,500,110,T2('\\mathrm{1\\ cm^2 = 1.0\\times10^{-4}\\ m^2}',910,178,{size:36,auto:false}),seg(p,b+.2,b+.3),C.hi);
  s+=card(660,280,500,110,T2('\\mathrm{2.0\\ cm^2 = 2.0\\times10^{-4}\\ m^2}',910,338,{size:36,auto:false}),seg(p,c,c+.08),PC);
  return s+goalTag(G3);
 },
 // 17. F＝2.5×10⁵×2.0×10⁻⁴＝50 N。2文目で注射器の矢印に 50 N、答えの札
 [K+'force']:(p,ctx)=>{
  const W=sentWin(ctx),b=at(W,1),sw=seg(p,b-.02,b+.04);
  let e=fade(.6,T2(`F=${Pt}A`,600,130,{size:38}));
  e+=card(130,190,940,140,T2(`F=2.5\\times10^{5}\\times2.0\\times10^{-4}`,520,262,{size:42,auto:false})+fade(seg(p,.3,.42),T2('=50\\ \\mathrm{N}',920,262,{size:46,auto:false,color:C.F})),seg(p,.03,.14),C.F);
  let s=fade(1-sw,e);
  const t=6+cueT(ctx);
  s+=fade(sw,syr(20,{t})+p0Plate(1)+areaPlate(20)+vPlate(20)+pushArrow(20,{text:'50 N'}));
  return s+goalTag(G3)+A3(seg(p,b+.02,b+.1));
 },
 // 18. 誤答 A・C（1枚ずつ）
 [K+'wrongAC3']:(p,ctx)=>{
  let s=card(250,96,700,110,T2(`F=${Pt}A=2.5\\times10^{5}\\times2.0\\times10^{-4}=50\\ \\mathrm{N}`,600,152,{size:34,auto:false}),.55,C.faint);
  s+=wrongSeq(p,ctx,[['A','20 N','押す前の 1.0×10⁵ Pa を 使った',{mid:`${E5}\\times2.0\\times10^{-4}=20\\ \\mathrm{N}`}],['C','5.0×10³ N','1 cm²＝10⁻² m² と した',{mid:'2.5\\times10^{5}\\times2.0\\times10^{-2}=5.0\\times10^{3}\\ \\mathrm{N}'}]],{opts:{y:240}});
  return s+goalTag(G3)+A3(1);
 },
 // 19. 誤答 D（cm² のまま掛けた、1万倍）
 [K+'wrongD3']:(p)=>{
  let s=card(250,96,700,110,T2(`F=${Pt}A=2.5\\times10^{5}\\times2.0\\times10^{-4}=50\\ \\mathrm{N}`,600,152,{size:34,auto:false}),.55,C.faint);
  s+=wrongCard('D','5.0×10⁵ N','cm² の まま 掛けた（1万倍）',{y:240,mid:'2.5\\times10^{5}\\times2.0=5.0\\times10^{5}\\ \\mathrm{N}',g:seg(p,.02,.08)});
  return s+goalTag(G3)+A3(1);
 },
 // 20. ピストンにはたらく力（長さは力に比例、2.6 px/N）：中の空気 50 N（右向き）、外の空気 20 N（左向き）、手 30 N（左向き）。
 //     1文目で中の空気の矢印。2文目で外の空気 → 手 → 「約3 kg」のおもりと「50 N − 20 N ＝ 30 N ≈ 3 kg の 重さ」。（点検 PQ-034 で変更）
 [K+'kg']:(p,ctx)=>{
  const W=sentWin(ctx),b=at(W,1),L=n=>n*2.6,yc=SY.yc,xp=xOf(20);
  const gO=seg(p,b,b+.05),gH=seg(p,b+(1-b)*.3,b+(1-b)*.36),gM=seg(p,b+(1-b)*.55,b+(1-b)*.62),gP=seg(p,b+(1-b)*.75,b+(1-b)*.82);
  const t=6+sceneT(p,ctx),y=mix(110,150,gM);
  let s=syr(20,{t,scale:0})+areaPlate(20);
  s+=FA(xp-2-L(50),yc,xp-2,yc,{w:9,head:24,g:seg(p,.03,.1)})+plateBox('中の 空気 50 N',xp-110,yc-118,{size:26,color:C.F,g:seg(p,.03,.1)});
  s+=FA(xp+22+L(20),yc-50,xp+22,yc-50,{w:7,head:20,g:gO})+plateBox('外の 空気 20 N',xp+130,yc-118,{size:26,color:C.F,g:gO});
  const xh=xp+20+SY.rod+20;
  s+=FA(xh+2+L(30),yc,xh+2,yc,{w:9,head:24,g:gH})+plateBox('手 30 N',xh+60,yc-60,{size:26,color:C.F,g:gH});
  s+=fade(gM,rect(940,y,130,100,{fill:'#8c97ad',fo:.95,stroke:'#d5dbe6',sw:2,rx:10})+label('約3 kg',1005,y+62,{size:32,color:C.bg,anchor:'middle',weight:700}));
  s+=plateBox('50 N − 20 N ＝ 30 N ≈ 3 kg の 重さ',900,472,{size:28,color:C.hi,g:gP});
  return s+goalTag(G3)+A3(1);
 },
 // ================= まとめ =================
 // 21. 元の単元動画の、分子が箱の壁に当たる絵
 [K+'sum']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=gasBox({x:120,y:110,w:480,h:330,n:22,dist:220*t,seed:2,hit:1,color:MOLW,wallR:C.hi});
  s+=card(660,140,480,240,label('壁を 叩く 力',900,180,{size:30,color:C.ink,anchor:'middle',weight:700})+T2(`${Pt}=\\dfrac{F}{A}`,900,268,{size:44})+label('当たる 回数が 多いほど 大きい',900,352,{size:26,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),PC);
  s+=answerRow([[1,'C','2.5×10⁵ Pa'],[2,'B',''],[3,'B','50 N']],{g:seg(p,.3,.45)});
  return s;
 },
};
// この cue の進み q（0〜1）が、cue の何秒目か
function durStart(ctx,q){return (ctx?.dur??8)*q;}

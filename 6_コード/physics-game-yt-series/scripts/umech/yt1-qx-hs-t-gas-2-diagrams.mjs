// 問題編 解説「圧力計の値と、絶対温度」(ys-qx-hs-t-gas-2) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/202_気体の法則.md の q-hs-t-gas-2（解説 19 行）。
// 色（正本の指示）：圧力 P 緑、体積 V 水色、絶対温度 T 黄緑、強調 黄、誤り 赤（×印）、答えの札 黄色の枠。分子の点は白。
// 出題中の図：ピストンは押し込まれるが、正しい体積の比（4.5/6.0）では描かない（目安の位置。注記を出す）。
//   大気圧の帯・絶対温度の値・2段に分けた箱・体積と温度のグラフは出さない。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 元の単元動画（yt1-hs-t-gas-1/2）の部品（分子の箱 gasBox・温度計 thermo・色）を読み込んで使う（そのファイルは編集しない）。
import {C,seg,lin,fade,label,line,rect,dot,ring,arrow,tex,draw,clamp,mix} from './anim.mjs';
import {T2,FA,TC,sceneT,thermo,PC,VC,Pt,Vt,Tt,P1,P2,V1,V2,T1,T2t,PA,LL,KK,gasBox} from './yt1-hs-t-gas-1-diagrams.mjs';
import {card,goalTag,answerTag,answerRow,wrongSeq,wrongCard,kindTag,note,textW,cueT,sentWin} from './yt1-qx-common.mjs';

const K='qx-hs-t-gas-2:';
const MOLW='#eef3fb';
const G1='P₁ と P₂',G2='後の体積',G3='℃ のまま比にできない理由';
const A1=g=>answerTag(1,'D','',{g}),A2=g=>answerTag(2,'C','4.5 L',{g}),A3=g=>answerTag(3,'A','',{g});
const at=(W,i,d=.5)=>W[i]?W[i][0]:d;
const endOf=(W,i,d=.5)=>W[i]?W[i][1]:d;
const E5b='2.0\\times10^{5}',E5d='4.0\\times10^{5}';
const BC=`\\dfrac{${P1}${V1}}{${T1}}=\\dfrac{${P2}${V2}}{${T2t}}`;
function plateBox(text,cx,cy,{size=26,color=C.ink,stroke,g=1,fill='#131f38'}={}){
 const w=textW(text,size)+28,h=size+20;
 return fade(g,rect(cx-w/2,cy-h/2,w,h,{fill,fo:.96,stroke:stroke??color,sw:2.5,rx:10})+label(text,cx,cy+size*.36,{size,color,anchor:'middle',weight:700}));
}
// 2行の札（前・後の状態）
function state2(a,b,cx,cy,{color=C.ink,g=1,size=26}={}){
 const w=Math.max(textW(a,size),textW(b,size))+36,h=2*size+34;
 return fade(g,rect(cx-w/2,cy-h/2,w,h,{fill:'#131f38',fo:.96,stroke:color,sw:2.5,rx:12})+label(a,cx,cy-6,{size,color,anchor:'middle',weight:700})+label(b,cx,cy+size+4,{size,color,anchor:'middle',weight:700}));
}

// ---- 出題中の図：ピストン付きの容器・圧力計・温度計・炎 -------------------------------------------
const VS={x:560,w:220,gy:440,k:38};      // 体積 1 L＝38 px（出題中の図だけ。ピストンの位置は目安）
const GA={x:860,y:300,r:78};
// 圧力計（上乗せ分）。v＝針の値（×10⁵ Pa）。0〜5 の目盛り
function gauge(v,{g=1,x=GA.x,y=GA.y,r=GA.r,tube=1}={}){
 const ang=u=>(225-54*u)*Math.PI/180;
 let s='';
 if(tube)s+=line(VS.x+VS.w/2+6,y+r-10,x-r*.55,y+r*.72,{color:C.dim,w:6});
 s+=ring(x,y,r,{color:C.dim,w:4,fill:'#0f1a30'});
 for(let u=0;u<=5;u+=.5){const a=ang(u),big=u%1===0;s+=line(x+(r-4)*Math.cos(a),y-(r-4)*Math.sin(a),x+(r-(big?18:11))*Math.cos(a),y-(r-(big?18:11))*Math.sin(a),{color:C.ink,w:big?3:2});
  if(big)s+=label(String(u),x+(r-34)*Math.cos(a),y-(r-34)*Math.sin(a)+8,{size:22,color:C.dim,anchor:'middle',weight:700});}
 const a=ang(v);s+=line(x,y,x+(r-22)*Math.cos(a),y-(r-22)*Math.sin(a),{color:C.a,w:5})+dot(x,y,7,C.ink);
 return fade(g,s);
}
function vessel(V,{t=0,heat=0,flame=0,lev=40,needle=1,push=0,g=1}={}){
 const {x,w,gy,k}=VS,top=gy-k*V;
 let s=`<path d="M${x-w/2-6} ${gy-262} L${x-w/2-6} ${gy+6} L${x+w/2+6} ${gy+6} L${x+w/2+6} ${gy-262}" fill="none" stroke="${C.dim}" stroke-width="4"/>`;
 s+=gasBox({x:x-w/2,y:top,w,h:k*V,n:16,dist:t,seed:5,color:MOLW,fill:'#0f1a30',stroke:'none'});
 s+=rect(x-w/2,top-18,w,18,{fill:'#7d8aa3',fo:1,stroke:'#c9d2e3',sw:2,rx:3});
 s+=rect(x-10,top-70,20,52,{fill:'#7d8aa3',fo:1,stroke:'none',rx:3});
 if(push)s+=FA(x,top-160,x,top-78,{g:push,text:'押す',dx:52,dy:6});
 if(flame)s+=fade(flame,`<path d="M${x-34} ${gy+62} q12 -44 34 -54 q22 12 34 54 z" fill="${C.E}" fill-opacity=".85"/>`+`<path d="M${x-14} ${gy+62} q7 -24 14 -30 q9 8 14 30 z" fill="${C.hi}"/>`);
 s+=thermo(380,250,410,lev)+label('温度計',380,480,{size:22,color:TC,anchor:'middle',weight:700});
 s+=gauge(needle)+label('圧力計 [×10⁵ Pa]',GA.x,GA.y+GA.r+34,{size:24,color:C.ink,anchor:'middle',weight:700});
 s+=plateBox('大気圧からの 上乗せ分',GA.x,GA.y+GA.r+76,{size:22,color:C.dim,stroke:C.faint});
 return fade(g,s);
}
// 出題中の図の時刻 t（秒）での状態。0〜2 s：前。2〜5 s：温めながら押す。5.3 s から後の札
const Q0={V0:6,V1:5.2};
function q0Pic(t,{cards=1}={}){
 const u=seg(t,2,5),dist=200*t+130*(t<2?0:t<5?(t-2)**2/6:1.5+(t-5)),V=mix(Q0.V0,Q0.V1,u);
 let s=vessel(V,{t:dist,flame:seg(t,1.9,2.3),lev:mix(40,150,u),needle:mix(1,3,u),push:seg(t,2,2.4)});
 const m=seg(t,2,2.6);
 if(cards){
  s+=state2('前：27℃・6.0 L','圧力計 1.0×10⁵ Pa',mix(560,190,m),130,{color:m<.5?C.ink:C.dim});
  s+=state2('後：177℃・体積 ？','圧力計 3.0×10⁵ Pa',1010,130,{color:C.hi,g:seg(t,5.3,5.9)});
  s+=note('（図の 体積は 目安）',190,200,{g:seg(t,5.3,5.9)});
 }
 return s;
}

// ---- 圧力の柱（真空＝0、1.0×10⁵ Pa＝70 px）------------------------------------------------------
const PL={ax:700,y0:455,k:70,xs:[840,1040],cw:120};
const pY=v=>PL.y0-PL.k*v;
function ladder({zero=0,band=[0,0],gaugeP=[0,0],tot=[0,0],heads=1,g=1}={}){
 let s=arrow(PL.ax,PL.y0+8,PL.ax,pY(4.6),{color:C.dim,w:2.5,head:14});
 s+=line(PL.ax-10,PL.y0,1160,PL.y0,{color:C.dim,w:2.5});
 for(const v of [1,2,3,4])s+=line(PL.ax-8,pY(v),PL.ax+8,pY(v),{color:C.dim,w:2})+label(`${v}.0`,PL.ax-14,pY(v)+8,{size:22,color:C.dim,anchor:'end'});
 s+=label('0',PL.ax-14,PL.y0+8,{size:22,color:C.dim,anchor:'end'});
 s+=label('圧力 [×10⁵ Pa]',PL.ax+10,pY(4.6)-8,{size:22,color:PC,weight:700});
 if(zero)s+=fade(zero,ring(PL.ax,PL.y0,16,{color:C.hi,w:4})+label('真空 ＝ 0',PL.ax-22,PL.y0+44,{size:24,color:C.hi,anchor:'middle',weight:700}));
 const gv=[1,3],nm=['前','後'];
 PL.xs.forEach((cx,i)=>{const x=cx-PL.cw/2;
  if(heads)s+=label(nm[i],cx,PL.y0+36,{size:26,color:C.ink,anchor:'middle',weight:700});
  if(band[i])s+=fade(band[i],rect(x,pY(1),PL.cw,PL.k,{fill:PC,fo:.4,stroke:PC,sw:2,rx:2})+label('大気圧',cx,pY(.5)+8,{size:22,color:C.ink,anchor:'middle',weight:700}));
  if(gaugeP[i]){const h=PL.k*gv[i],yb=pY(1),yy=mix(yb-h-70,yb-h,gaugeP[i]);
   s+=fade(Math.min(1,gaugeP[i]*3),rect(x,yy,PL.cw,h,{fill:PC,fo:.12,stroke:PC,sw:2.5,rx:2})+label(`圧力計 ${gv[i]}.0`,cx,yy+h/2+8,{size:22,color:PC,anchor:'middle',weight:700}));}
  if(tot[i])s+=fade(tot[i],label(i?'4.0×10⁵ Pa':'2.0×10⁵ Pa',cx,pY(1+gv[i])-14,{size:24,color:C.hi,anchor:'middle',weight:700}));
 });
 return fade(g,s);
}
// ---- 2段に分ける箱（体積 1 L＝36 px、正しい比）----------------------------------------------------
const BX={xs:[200,600,1000],w:170,gy:418,k:34};
function vbox(i,V,{dash=0,g=1,lab='',col=VC}={}){
 const cx=BX.xs[i],h=BX.k*V,x=cx-BX.w/2,y=BX.gy-h;
 return fade(g,rect(x,y,BX.w,h,{fill:col,fo:dash?.05:.14,stroke:col,sw:3,rx:4}).replace('/>',dash?' stroke-dasharray="10 8"/>':'/>')+(lab?label(lab,cx,y+h/2+12,{size:30,color:col,anchor:'middle',weight:700}):''));
}
function boxState(i,a,b,{g=1,col=C.ink}={}){return state2(a,b,BX.xs[i],138,{g,color:col,size:24});}
function stepArrow(i,a,b,{g=1,col=TC}={}){
 const x0=BX.xs[i]+BX.w/2+14,x1=BX.xs[i+1]-BX.w/2-14,cx=(x0+x1)/2;
 return fade(g,arrow(x0,380,x1,380,{color:col,w:5,head:16})+label(a,cx,300,{size:24,color:col,anchor:'middle',weight:700})+label(b,cx,334,{size:22,color:C.dim,anchor:'middle',weight:700}));
}
// ---- 体積と温度のグラフ（横軸 ℃ −300〜200）-------------------------------------------------------
const CG={x0:120,y0:410,kx:1.7,kv:.55};
const cX=c=>CG.x0+(c+300)*CG.kx, cY=c=>CG.y0-(c+273)*CG.kv;
function cgraph({ext=1,zeroArrow=0,kRow=0,cRow=1,origin=0,lineHi=0,g=1,pts=1}={}){
 let s=arrow(CG.x0-10,CG.y0,cX(210),CG.y0,{color:C.dim,w:2.5,head:14})+arrow(cX(0),CG.y0+10,cX(0),cY(225),{color:C.dim,w:2.5,head:14});
 s+=label('体積 V',cX(0)+14,cY(225)+10,{size:24,color:VC,weight:700});
 for(const c of [-273,0,27,177])s+=line(cX(c),CG.y0-6,cX(c),CG.y0+6,{color:C.dim});
 s+=fade(cRow,[-273,0,27,177].map(c=>label(c<0?'−273':String(c),cX(c)+(c===27?10:c===0?-14:0),CG.y0+30,{size:22,color:C.ink,anchor:'middle'})).join('')+label('[℃]',cX(210)+8,CG.y0+30,{size:22,color:C.ink,weight:700}));
 if(kRow)s+=fade(kRow,[[-273,'0'],[0,'273'],[27,'300'],[177,'450']].map(([c,k])=>label(k,cX(c)+(c===27?14:c===0?-18:0),CG.y0+62,{size:24,color:TC,anchor:'middle',weight:700})).join('')+label('[K]',cX(210)+8,CG.y0+62,{size:24,color:TC,weight:700}));
 const col=lineHi?C.hi:VC;
 s+=draw([[cX(27),cY(27)],[cX(177),cY(177)]],1,{color:col,w:4});
 if(ext)s+=draw([[cX(27),cY(27)],[cX(-273),cY(-273)]],ext,{color:col,w:3,dash:'8 8'});
 if(pts)s+=fade(pts,dot(cX(27),cY(27),10,C.hi)+dot(cX(177),cY(177),10,C.hi));
 if(ext>=.99)s+=ring(cX(-273),cY(-273),15,{color:C.hi,w:4})+label('体積 0',cX(-273)+4,cY(-273)-26,{size:24,color:C.hi,anchor:'middle',weight:700});
 if(zeroArrow)s+=fade(zeroArrow,arrow(cX(0)+150,cY(0)+70,cX(0)+12,cY(0)+6,{color:C.hi,w:5,head:16})+label('0℃ では 体積は 0 でない',cX(0)+160,cY(0)+96,{size:24,color:C.hi,weight:700}));
 if(origin)s+=fade(origin,dot(cX(-273),cY(-273),9,C.hi)+label('原点',cX(-273)+26,cY(-273)-56,{size:24,color:C.hi,weight:700}));
 return fade(g,s);
}
// ---- ℃ と K の目盛り（同じ幅、0 が 273 ずれる）----------------------------------------------------
const RU={y0:340,k:.45,xs:[250,560]};
const rY=c=>RU.y0-(c+273)*RU.k;
function rulers({g=1,diff=0,same=0}={}){
 let s='';
 RU.xs.forEach((x,i)=>{
  s+=rect(x-14,rY(190),28,rY(-273)-rY(190)+12,{fill:'#0f1a30',fo:1,stroke:C.dim,sw:2,rx:14});
  for(let c=-250;c<=150;c+=50)s+=line(x-14,rY(c),x+2,rY(c),{color:C.faint,w:2});
  for(const c of [-273,0,27,177]){s+=line(x-20,rY(c),x+20,rY(c),{color:C.ink,w:3});
   const lf=c===27;s+=label(i===0?`${c<0?'−273':c}℃`:`${c+273} K`,lf?x-30:x+30,rY(c)+(lf?-2:12),{size:22,color:i===0?C.ink:TC,anchor:lf?'end':'start',weight:700});}
  s+=label(i===0?'セ氏温度':'絶対温度',x,rY(190)-14,{size:24,color:i===0?C.ink:TC,anchor:'middle',weight:700});
 });
 s+=fade(same,line(RU.xs[0]+120,rY(-273),RU.xs[1]-30,rY(-273),{color:C.dim,w:2,dash:'6 6'})+line(RU.xs[0]+120,rY(0),RU.xs[1]-30,rY(0),{color:C.dim,w:2,dash:'6 6'})+label('0 の 位置が 273 ずれる',920,rY(-150),{size:24,color:C.hi,anchor:'middle',weight:700})+label('目盛りの 幅は 同じ',920,rY(-80),{size:24,color:C.ink,anchor:'middle',weight:700}));
 if(diff){for(const x of RU.xs)s+=fade(diff,rect(x-10,rY(177),20,rY(27)-rY(177),{fill:C.hi,fo:.45,stroke:C.hi,sw:2,rx:6}));
  s+=fade(diff,label('177 − 27 ＝ 450 − 300 ＝ 150',920,rY(100),{size:26,color:C.hi,anchor:'middle',weight:700}));}
 return fade(g,s);
}

export const qxHsTGas2Diagrams={
 // ================= 問題アニメ：出題中（小問1〜3 共通、6秒＋静止）=================
 [K+'q0']:(p,ctx)=>q0Pic(sceneT(p,ctx)),
 // ================= S1 小問1 =================
 // 1. 出題中の図で始める
 [K+'goal1']:(p,ctx)=>q0Pic(6+sceneT(p,ctx))+goalTag(G1,{g:seg(p,.03,.15)}),
 // 2. 法則（P V T の色）と、真空＝0 の縦の目盛り
 [K+'law']:(p)=>{
  let s=card(40,110,560,170,T2(BC,320,195,{size:50}),seg(p,.03,.15),C.hi);
  s+=kindTag('法則',320,320,{g:seg(p,.1,.2)});
  s+=ladder({zero:seg(p,.45,.6),heads:0,g:seg(p,.3,.42)});
  return s+goalTag(G1);
 },
 // 3. 圧力計は上乗せ分だけ → 大気圧（緑の帯）を足す
 [K+'atm']:(p,ctx)=>{
  const W=sentWin(ctx),b=at(W,1);
  let s=gauge(1,{x:300,y:250,tube:0,g:seg(p,.03,.12)})+fade(seg(p,.03,.12),label('圧力計 [×10⁵ Pa]',300,362,{size:22,color:C.ink,anchor:'middle',weight:700}))+plateBox('大気圧からの 上乗せ分',300,400,{size:24,color:C.ink,stroke:C.dim,g:seg(p,.08,.18)});
  s+=ladder({zero:1,band:[seg(p,b,b+.1),seg(p,b,b+.1)]});
  s+=fade(seg(p,b+.12,b+.22),label('＋ 大気圧',300,470,{size:28,color:PC,anchor:'middle',weight:700}));
  return s+goalTag(G1);
 },
 // 4. 前：帯 1.0 の上に 1.0、後：帯 1.0 の上に 3.0
 [K+'stack']:(p,ctx)=>{
  const W=sentWin(ctx),c=voiceMid(W);
  let s=ladder({zero:1,band:[1,1],gaugeP:[seg(p,.02,.2),seg(p,c,c+.18)],tot:[seg(p,.2,.28),seg(p,c+.18,c+.26)]});
  s+=fade(seg(p,.08,.2),T2('1.0+1.0=2.0',300,200,{size:40,auto:false})+label('前（×10⁵ Pa）',300,140,{size:24,color:C.dim,anchor:'middle',weight:700}));
  s+=fade(seg(p,c+.06,c+.18),T2('3.0+1.0=4.0',300,330,{size:40,auto:false})+label('後（×10⁵ Pa）',300,270,{size:24,color:C.dim,anchor:'middle',weight:700}));
  return s+goalTag(G1);
 },
 // 5. 小問1 の答え D。誤答 A・B・C を1枚ずつ（2文目の間）
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),a=endOf(W,0),b=at(W,1),e=endOf(W,1),d=(e-b)/3;
  let s=ladder({zero:1,band:[1,1],gaugeP:[1,1],tot:[1,1]});
  s+=fade(1-seg(p,b,b+.04),T2('1.0+1.0=2.0',300,200,{size:40,auto:false})+T2('3.0+1.0=4.0',300,330,{size:40,auto:false}));
  s+=wrongSeq(p,ctx,[['A','両方とも 足し忘れ','P₁＝1.0×10⁵、P₂＝3.0×10⁵ Pa'],['B','後に 足し忘れ','P₁＝2.0×10⁵、P₂＝3.0×10⁵ Pa'],['C','前に 足し忘れ','P₁＝1.0×10⁵、P₂＝4.0×10⁵ Pa']],{win:[[b,b+d],[b+d,b+2*d],[b+2*d,1]],opts:{x:40,y:170,w:580}});
  return s+goalTag(G1)+A1(seg(p,a-.04,a+.02));
 },
 // ================= S2 小問2 =================
 // 6. 求めるもの：後の体積。27＋273＝300、177＋273＝450
 [K+'goal2']:(p,ctx)=>{
  const W=sentWin(ctx),b=at(W,1);
  let s=plateBox('前：27℃',360,200,{size:34,color:TC,g:seg(p,.05,.15)})+plateBox('後：177℃',840,200,{size:34,color:TC,g:seg(p,.05,.15)});
  s+=fade(seg(p,b,b+.08),arrow(360,240,360,300,{color:TC,w:4,head:14})+arrow(840,240,840,300,{color:TC,w:4,head:14})+label('＋273',400,280,{size:24,color:TC,weight:700})+label('＋273',880,280,{size:24,color:TC,weight:700}));
  s+=card(170,320,380,100,T2(`27+273=300${KK}`,360,372,{size:40,auto:false,color:TC}),seg(p,b+.08,b+.18),TC);
  s+=card(650,320,380,100,T2(`177+273=450${KK}`,840,372,{size:40,auto:false,color:TC}),seg(p,b+.18,b+.28),TC);
  return s+goalTag(G2,{g:seg(p,.03,.12)});
 },
 // 7. 2段に分ける。1段目：温度 300 K のまま、圧力を 4.0×10⁵ Pa に（ボイル）
 [K+'step1']:(p,ctx)=>{
  const W=sentWin(ctx),b=at(W,1);
  let s=vbox(0,6,{lab:'6.0 L',g:seg(p,.03,.12)})+boxState(0,'2.0×10⁵ Pa','300 K',{g:seg(p,.03,.12)});
  s+=fade(seg(p,.15,.3)*(1-seg(p,b,b+.06)),vbox(1,6,{dash:1,col:C.dim})+vbox(2,6,{dash:1,col:C.dim})+label('1段目',BX.xs[1],120,{size:26,color:C.dim,anchor:'middle',weight:700})+label('2段目',BX.xs[2],120,{size:26,color:C.dim,anchor:'middle',weight:700}));
  s+=vbox(1,6,{dash:1,lab:'V*',g:seg(p,b,b+.08)})+boxState(1,'4.0×10⁵ Pa','300 K',{g:seg(p,b+.04,b+.12),col:C.hi});
  s+=stepArrow(0,'温度 一定','（ボイル）',{g:seg(p,b+.1,b+.2)});
  return s+goalTag(G2);
 },
 // 8. 圧力 ×2 → 体積は半分。V*＝…＝3.0 L
 [K+'vstar']:(p,ctx)=>{
  const W=sentWin(ctx),b=at(W,1),u=seg(p,.12,.4);
  let s=vbox(0,6,{lab:'6.0 L'})+boxState(0,'2.0×10⁵ Pa','300 K')+boxState(1,'4.0×10⁵ Pa','300 K',{col:C.hi})+stepArrow(0,'温度 一定','（ボイル）');
  s+=fade(seg(p,.03,.12),plateBox('圧力 ×2',BX.xs[1],218,{size:26,color:PC}));
  s+=vbox(1,mix(6,3,u),{dash:1,lab:u>.98?'3.0 L':'V*'});
  s+=fade(seg(p,.35,.45),label('体積 半分',BX.xs[1]+150,BX.gy-50,{size:24,color:VC,anchor:'middle',weight:700}));
  s+=fade(seg(p,b,b+.08),T2(`{\\color{${VC}}V^{*}}=\\dfrac{${E5b}\\times6.0}{${E5d}}=3.0${LL}`,600,478,{size:32,auto:false}));
  return s+goalTag(G2);
 },
 // 9. 2段目：圧力そのまま 450 K に（シャルル）。3.0×450÷300＝4.5 L
 [K+'step2']:(p,ctx)=>{
  const W=sentWin(ctx),b=at(W,1),u=seg(p,b+.1,b+.4);
  let s=vbox(0,6,{lab:'6.0 L',g:.6})+boxState(0,'2.0×10⁵ Pa','300 K',{g:.6})+fade(.6,stepArrow(0,'温度 一定','（ボイル）'));
  s+=vbox(1,3,{dash:1,lab:'3.0 L'})+boxState(1,'4.0×10⁵ Pa','300 K');
  s+=boxState(2,'4.0×10⁵ Pa','450 K',{g:seg(p,.03,.12),col:C.hi})+stepArrow(1,'圧力 一定','（シャルル）',{g:seg(p,.08,.18),col:PC});
  s+=vbox(2,mix(3,4.5,u),{dash:u<.98?1:0,lab:u>.98?'4.5 L':'',g:seg(p,.12,.2)});
  s+=fade(seg(p,b+.02,b+.1),plateBox('450 ／ 300 ＝ 1.5',BX.xs[2],218,{size:26,color:C.hi}));
  s+=fade(seg(p,b+.4,b+.48),T2(`${V2}=3.0\\times\\dfrac{450}{300}=4.5${LL}`,600,478,{size:32,auto:false}));
  return s+goalTag(G2);
 },
 // 10. 小問2 の答え C（4.5 L）。2文目：前と後の PV/T がどちらも 4000
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),a=endOf(W,0),b=at(W,1),sw=seg(p,b,b+.05);
  let s=fade(1-seg(p,b-.04,b),vbox(0,6,{lab:'6.0 L'})+boxState(0,'2.0×10⁵ Pa','300 K')+vbox(1,3,{dash:1,lab:'3.0 L'})+boxState(1,'4.0×10⁵ Pa','300 K')+vbox(2,4.5,{lab:'4.5 L'})+boxState(2,'4.0×10⁵ Pa','450 K')+stepArrow(0,'温度 一定','（ボイル）')+stepArrow(1,'圧力 一定','（シャルル）',{col:PC}));
  let e=label('1本の 式で 確かめる：PV／T',600,130,{size:28,color:C.ink,anchor:'middle',weight:700});
  e+=card(130,160,940,100,label('前',190,222,{size:28,color:C.dim,anchor:'middle',weight:700})+T2(`\\dfrac{${E5b}\\times6.0}{300}=4000`,640,210,{size:38,auto:false}),seg(p,b+.04,b+.14),C.faint);
  e+=card(130,280,940,100,label('後',190,342,{size:28,color:C.dim,anchor:'middle',weight:700})+T2(`\\dfrac{${E5d}\\times4.5}{450}=4000`,640,330,{size:38,auto:false}),seg(p,b+.16,b+.26),C.faint);
  e+=fade(seg(p,b+.3,b+.4),label('一致（単位 Pa·L／K）',600,440,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(sw,e);
  return s+goalTag(G2)+A2(seg(p,a-.04,a+.02));
 },
 // 11. 誤答 B（3.0 L：圧力計の値のまま）
 [K+'wrongB']:(p)=>{
  let s=card(200,96,800,110,label('式に 入れる 圧力：P₁＝2.0×10⁵ Pa、P₂＝4.0×10⁵ Pa',600,145,{size:26,color:C.ink,anchor:'middle',weight:700})+label('（大気圧を 足した 値）',600,184,{size:22,color:C.dim,anchor:'middle'}),.8,C.faint);
  s+=wrongCard('B','3.0 L','圧力計の 値の まま 使った',{y:230,mid:`\\dfrac{1.0\\times10^{5}\\times6.0}{300}\\times\\dfrac{450}{3.0\\times10^{5}}=3.0\\ \\mathrm{L}`,midSize:32,g:seg(p,.02,.08)});
  return s+goalTag(G2)+A2(1);
 },
 // 12. 誤答 A（温度の比が逆）、誤答 D（圧力の比が逆）。1枚ずつ
 [K+'wrongAD']:(p,ctx)=>{
  let s=card(250,96,700,110,T2(`${V2}=6.0\\times\\dfrac{2.0}{4.0}\\times\\dfrac{450}{300}=4.5${LL}`,600,151,{size:32,auto:false}),.6,C.faint);
  s+=wrongSeq(p,ctx,[['A','2.0 L','温度の 比が 逆（×300/450）',{mid:`6.0\\times\\dfrac{2.0}{4.0}\\times\\dfrac{300}{450}=2.0\\ \\mathrm{L}`,midSize:30}],['D','18 L','圧力の 比が 逆（体積が 圧力に 比例）',{mid:`6.0\\times\\dfrac{4.0}{2.0}\\times\\dfrac{450}{300}=18\\ \\mathrm{L}`,midSize:30}]],{opts:{y:228}});
  return s+goalTag(G2)+A2(1);
 },
 // ================= S3 小問3 =================
 // 13. 求めるもの。グラフの軸を出す
 [K+'goal3']:(p)=>cgraph({ext:0,pts:seg(p,.3,.45),g:seg(p,.1,.25)})+goalTag(G3,{g:seg(p,.03,.12)}),
 // 14. 直線をのばすと −273℃ で体積 0。0℃ では 0 でない。実験タグ
 [K+'graph']:(p,ctx)=>{
  const W=sentWin(ctx),b=at(W,1);
  let s=cgraph({ext:seg(p,.12,.5),zeroArrow:seg(p,b,b+.08)});
  s+=kindTag('実験',1080,130,{g:seg(p,.03,.12)});
  s+=fade(seg(p,.03,.12),label('圧力 一定 で 測った 点',cX(170),cY(177)+66,{size:22,color:C.hi,anchor:'middle',weight:700}));
  return s+goalTag(G3);
 },
 // 15. 目盛りを K に読み替える（−273℃＝0 K）。直線は原点を通る。小問3 の答え A
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=at(W,1);
  let s=cgraph({kRow:seg(p,.05,.2),cRow:mix(1,.4,seg(p,.05,.2)),origin:seg(p,.2,.3),lineHi:p>.25?1:0});
  s+=fade(seg(p,.3,.4),plateBox('V は T（K）に 比例',cX(-80),cY(100),{size:26,color:C.hi}));
  return s+goalTag(G3)+A3(seg(p,b+.02,b+.1));
 },
 // 16. 誤答 B（目盛りの幅）。℃ と K の目盛りを並べる
 [K+'wrongB3']:(p,ctx)=>{
  const W=sentWin(ctx),b=at(W,1);
  let s=rulers({same:seg(p,b,b+.1)});
  s+=wrongCard('B','目盛りの 幅が 違う','幅は 同じ、0 の 位置が 違う',{y:362,size:26,whySize:22,g:seg(p,.02,.08)});
  return s+goalTag(G3)+A3(1);
 },
 // 17. 誤答 C（誤差の話ではない）
 [K+'wrongC3']:(p)=>{
  let s=rulers({g:.4,same:1});
  s+=wrongCard('C','誤差が 大きくなる','問題は 比例の 原点',{y:362,size:26,whySize:22,g:seg(p,.02,.08)});
  return s+goalTag(G3)+A3(1);
 },
 // 18. 誤答 D（使うのは比。差なら同じ）。177−27＝450−300＝150
 [K+'wrongD3']:(p,ctx)=>{
  const W=sentWin(ctx),b=at(W,1);
  let s=rulers({g:.75,diff:seg(p,b,b+.1)});
  s+=wrongCard('D','差が 変わる','使うのは 比。差なら 同じ',{y:362,size:26,whySize:22,g:seg(p,.02,.08)});
  return s+goalTag(G3)+A3(1);
 },
 // ================= まとめ =================
 [K+'sum']:(p)=>{
  let s=card(150,110,900,120,label('注意 1：T は 絶対温度（K）',600,185,{size:36,color:TC,anchor:'middle',weight:700}),seg(p,.05,.15),TC);
  s+=card(150,260,900,120,label('注意 2：P は 真空を 0 と した 圧力',600,335,{size:36,color:PC,anchor:'middle',weight:700}),seg(p,.2,.3),PC);
  s+=fade(seg(p,.45,.55),T2(BC,600,450,{size:36}));
  s+=answerRow([[1,'D',''],[2,'C','4.5 L'],[3,'A','']],{g:seg(p,.6,.7)});
  return s;
 },
};
// 2文の cue で、2文目が始まる所（文が1つなら声の中ほど）
function voiceMid(W){return W.length>1?W[1][0]:W[0][1]/2;}

// 問題編 解説「半減期 6.0 時間の核」(ys-qx-hs-a-nucleus-2) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/503_原子核と放射線.md の q-hs-a-nucleus-2（解説 21 行）。
// 2026-10-13 作り直し（以前の試作の図の部品を引き継ぎ、札を共通部品にし、図を札の帯 y＜78 の下へ下げた）。
// 色（正本）：時間 t・半減期 T 金、残りの核 水色（崩壊した核は暗い灰）、掛ける数 ½・□ 黄、誤り 赤、合う・答え 緑。
// 「同じ種類の核」「残りの数の平均」を画面でも一貫させる：表・棒・グラフ・札の見出しは「残り（平均）」。
// 元の単元動画 ys-hs-a-nucleus-2 の部品（粒の並び・シミュレーション・最後の表の画面 e1）は import して使う（編集しない）。
import {C,seg,fade,label,line,rect,dot,ring,arrow,brace,axes,draw,mix} from './anim.mjs';
import {tag,TX,fcard,cs} from './yt1-hs-a-nucleus-1-diagrams.mjs';
import {TC,LIVE,HC,OK,HALF,sim,grid,hsANucleus2Diagrams} from './yt1-hs-a-nucleus-2-diagrams.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-hs-a-nucleus-2:';
const BAD='#ff6b6b';
const P10=(m,e)=>`${m}\\times10^{${e}}`;
const H2=cs(HC,HALF);
const gold=s=>cs(TC,s);
const jp=(s,x,y,o={})=>label(s,x,y,{size:30,color:C.ink,anchor:'middle',weight:700,...o});
const G1='18 時間後の残りの数（平均）',G2='3.0 時間後の残りの数（平均）',G3='この物質の半減期';
const A1=g=>answerTag(1,'C','2.0×10³ 個・平均',{g}),A2=g=>answerTag(2,'D','約 1.1×10⁴ 個・平均',{g}),A3=g=>answerTag(3,'B','半減期 5.0 日',{g});
const s2=ctx=>sentWin(ctx)[1]?.[0]??.5;
const atR=(ctx,str)=>{const r=(ctx?.cue?.reading??'').replace(/\s/g,'');const i=r.indexOf(str);return i<0?.5:i/Math.max(1,r.length)*voiceEnd(ctx);};

// ---- 出題中の図：粒の核・時計・札 ------------------------------------------------------------------
const RUNQ=sim(41,160);
export function clock(x,y,r,hours,{g=1}={}){
 let s=ring(x,y,r,{color:TC,w:4,fill:'#131f38'});
 for(let i=0;i<12;i++){const a=i*Math.PI/6;s+=line(x+r*.82*Math.sin(a),y-r*.82*Math.cos(a),x+r*.95*Math.sin(a),y-r*.95*Math.cos(a),{color:TC,w:i%3?2:4});}
 const ah=hours/12*2*Math.PI,am=(hours%1)*2*Math.PI;
 s+=line(x,y,x+r*.5*Math.sin(ah),y-r*.5*Math.cos(ah),{color:TC,w:6})+line(x,y,x+r*.78*Math.sin(am),y-r*.78*Math.cos(am),{color:TC,w:3})+dot(x,y,6,TC);
 s+=label(`${hours.toFixed(1)} 時間`,x,y+r+40,{size:28,color:TC,anchor:'middle',weight:700});
 return fade(g,s);
}
function setupFig(tau,{gGrid=1,gClock=1,gT1=1,gT2=1}={}){
 let s=fade(gGrid,label('粒 1つ ＝ 核（暗い 粒 ＝ 崩壊した 核）',70,112,{size:24,color:C.dim}));
 s+=grid(RUNQ,tau,{x0:80,y0:150,dx:22,dy:22,cols:16,r:8,g:gGrid});
 s+=clock(520,215,62,tau*6,{g:gClock});
 s+=card(650,120,490,110,jp('半減期 6.0 時間',895,188,{size:38,color:TC}),gT1,TC);
 s+=card(650,270,490,110,jp('はじめ 1.6×10⁴ 個',895,338,{size:38,color:LIVE}),gT2,LIVE);
 return s;
}
// 小問3 の出題：別の物質
function fig3({gTag=1,gCard=1}={}){
 return tag('別の 物質',600,112,{color:C.dim,size:26,g:gTag})
  +card(300,140,600,140,jp('残り（平均）が',600,188,{size:28,color:LIVE})+jp('20 日 で',520,252,{size:38,color:TC})+jp('1/16',740,252,{size:42,color:LIVE}),gCard,TC);
}

// ---- 残りの数（平均）の表（横向き）。card は y−55〜y＋195 ------------------------------------------
// cols: [{t, v (TeX) or null, vg, hl, dim}], arr: [{i, txt (TeX), g, color}]
function qtab(cols,arr=[],{y=150,g=1,xs=null,vs=36}={}){
 const X=xs||cols.map((_,i)=>400+i*220);
 let s=card(40,y-55,1120,250,'',g,C.faint);
 s+=fade(g,label('時間',70,y+8,{size:28,color:TC,weight:700})+label('残り（平均）',70,y+88,{size:28,color:LIVE,weight:700}));
 s+=fade(g,line(60,y+30,1140,y+30,{color:C.faint,w:2}));
 cols.forEach((c,i)=>{const o=g*(c.dim?.4:1);
  if(c.hl)s+=fade(g*c.hl,rect(X[i]-85,y-40,170,150,{fill:HC,fo:.1,stroke:HC,sw:2.5,rx:10}));
  s+=fade(o,label(c.t,X[i],y+8,{size:30,color:TC,anchor:'middle',weight:700}));
  const vg=c.vg??1;
  if(c.v)s+=fade(o*vg,TX(c.v,X[i],y+88,{size:vs,color:LIVE}))+fade(o*Math.max(0,1-vg*4),label('？',X[i],y+92,{size:34,color:C.dim,anchor:'middle',weight:700}));
  else s+=fade(o,label('？',X[i],y+92,{size:34,color:C.dim,anchor:'middle',weight:700}));
 });
 arr.forEach(a=>{const x0=X[a.i]+18,x1=X[a.i+1]-18,col=a.color||HC,o=g*(a.g??1);
  s+=fade(o,arrow(x0,y+128,x1,y+128,{color:col,w:3,head:12})+TX(a.txt,(x0+x1)/2,y+172,{size:38,color:col}));});
 return s;
}
const T4=['0 h','6.0 h','12 h','18 h'];
const V4=[P10('1.6','4'),P10('8.0','3'),P10('4.0','3'),P10('2.0','3')];
const HALVES=(g=[1,1,1])=>[0,1,2].map(i=>({i,txt:`\\times${H2}`,g:g[i]}));
const tabFull=(o={})=>qtab(T4.map((t,i)=>({t,v:V4[i],hl:i===3?1:0})),HALVES(),o);
// 棒（残りの割合など）
function bar(x,base,frac,{w=90,hmax=210,color=LIVE,g=1,top='',bot='',fo=.45}={}){
 const h=frac*hmax;return fade(g,rect(x-w/2,base-h,w,h,{fill:color,fo,stroke:color,rx:4})+(top?label(top,x,base-h-14,{size:26,color,anchor:'middle',weight:700}):'')+(bot?label(bot,x,base+36,{size:26,color:TC,anchor:'middle',weight:700}):''));
}
// 小問2 の3本の棒（0・3.0・6.0 h）。棒の上端は y≧190
const B3={base:400};
function bars3(){
 const base=B3.base;
 let s=line(150,base,950,base,{color:C.dim,w:3})+label('残り（平均）',150,124,{size:24,color:LIVE,weight:700});
 s+=bar(250,base,1,{top:'1.6×10⁴',bot:'0 h'})+bar(850,base,.5,{top:'8.0×10³',bot:'6.0 h'});
 s+=rect(505,base-210,90,210,{fill:'none',fo:0,stroke:C.dim,rx:4})+label('3.0 h',550,base+36,{size:26,color:TC,anchor:'middle',weight:700});
 s+=label('？',550,base-90,{size:50,color:C.hi,anchor:'middle',weight:700});
 return s;
}
// 残り（平均）の割合の棒（小問2 の誤答）
const RB={base:420,h:260};
function ratioBars(){
 const {base,h}=RB;
 let s=line(70,base,560,base,{color:C.dim,w:3})+label('残り（平均）の 割合',90,118,{size:24,color:LIVE,weight:700});
 s+=bar(130,base,1,{w:80,hmax:h,top:'1',bot:'0 h'})+bar(290,base,.71,{w:80,hmax:h,bot:'3.0 h'})+label('0.71',290,base-.71*h+40,{size:24,color:C.ink,anchor:'middle',weight:700})+bar(450,base,.5,{w:80,hmax:h,bot:'6.0 h'});
 return s;
}
const redLine=(x,v,txt,g=1,{side='right'}={})=>fade(g,line(x-55,RB.base-v*RB.h,x+55,RB.base-v*RB.h,{color:BAD,w:4})+label(txt,side==='right'?x+62:x-62,RB.base-v*RB.h+8,{size:24,color:BAD,weight:700,anchor:side==='right'?'start':'end'}));
// 小問3 の時間の線
const TL={X:d=>150+d*45,Y:230};
function timeline(p,{grow=1}={}){
 const {X,Y}=TL;
 let s=line(X(0),Y,X(20),Y,{color:C.dim,w:4})+label('残り（平均）',60,130,{size:24,color:LIVE,weight:700});
 const fr=['1','1/2','1/4','1/8','1/16'],tl=['0','5.0','10','15','20 日'];
 for(let i=0;i<=4;i++){const d=5*i,g=(i===0||i===4)?1:seg(p,.12+i*.06,.2+i*.06)*grow+(1-grow);
  s+=fade(g,line(X(d),Y-16,X(d),Y+16,{color:TC,w:3})+label(tl[i],X(d),Y+52,{size:28,color:TC,anchor:'middle',weight:700}));
  s+=fade(g,label(fr[i],X(d),Y-62,{size:28,color:LIVE,anchor:'middle',weight:700}));
  if(i<4)s+=fade(grow?seg(p,.12+(i+1)*.06,.2+(i+1)*.06):1,TX(`\\times${H2}`,X(d+2.5),Y-22,{size:34,color:HC}));}
 return s;
}
// 4個の核のやり直し（半減期 1 回ぶん たったときに 残る核：1＝残る）
const TRIALS=[[1,0,0,1],[1,1,0,1],[0,0,1,0],[0,1,1,0],[1,0,0,0],[1,1,1,0]];
const DECAY=[[0,.55,.25,0],[0,0,.7,0],[.2,.6,0,.85],[.4,0,0,.15],[0,.3,.75,.5],[0,0,0,.45]];
const DEADC='#28324a';
function trialsFig(p){
 let s=tag('半分に なるのは 平均',600,110,{color:C.hi,size:28,g:seg(p,.02,.1)});
 s+=fade(seg(p,.1,.18),label('核 4 個 → 半減期 1 回 たったときの 残り',600,165,{size:28,color:C.ink,anchor:'middle',weight:700}));
 TRIALS.forEach((tr,k)=>{const x0=110+k*172,a=.18+k*.075,g=seg(p,a,a+.04);
  let b=label(`${k+1}回目`,x0+50,205,{size:24,color:C.dim,anchor:'middle'});
  tr.forEach((alive,j)=>{const dead=!alive&&p>a+.02+DECAY[k][j]*.06;const cx=x0+25+(j%2)*50,cy=240+Math.floor(j/2)*50;b+=dot(cx,cy,19,dead?DEADC:LIVE);});
  const n=tr.reduce((u,v)=>u+v,0);
  b+=fade(seg(p,a+.07,a+.09),label(`残り ${n} 個`,x0+50,350,{size:26,color:n===2?OK:HC,anchor:'middle',weight:700}));
  s+=fade(g,b);});
 return s;
}

export const qxHsANucleus2Diagrams={
 // ================= 問題アニメ =================
 // 出題（小問1・2）：粒の格子 → 時計（0.0 時間）→ 2枚の札。粒は暗くしない。表・×½・曲線は描かない。
 [K+'q0']:(p)=>setupFig(0,{gGrid:seg(p,0,.3),gClock:seg(p,.33,.6),gT1:seg(p,.66,.8),gT2:seg(p,.83,.97)}),
 // 小問3：暗転して「別の 物質」と「残り（平均）が 20 日 で 1/16」
 [K+'q3']:(p)=>fig3({gTag:seg(p,.05,.4),gCard:seg(p,.4,.85)}),
 // ================= S1 小問1：18 時間後 =================
 // 1. 出題中の図で始め、求めるもの
 [K+'goal1']:(p)=>setupFig(0)+goalTag(G1,{g:seg(p,.03,.2)}),
 // 2. 時計 0.0 → 3.6 時間、粒がばらばらに暗くなる。くじの札、「核は 年を とらない」
 [K+'law']:(p,ctx)=>{
  const tau=mix(0,.6,seg(p,.03,.98)),b=s2(ctx);
  let s=setupFig(tau,{gT1:1-seg(p,0,.08),gT2:1-seg(p,0,.08)});
  s+=card(650,95,500,215,rect(675,165,90,70,{fill:HC,fo:.12,stroke:HC,rx:8})+line(700,175,740,175,{color:HC,w:4})+label('くじ',720,222,{size:26,color:HC,anchor:'middle',weight:700})
   +jp('同じ 種類の 核なら',955,150,{size:28,color:C.hi})+jp('同じ 長さの 時間に',955,210,{size:28})+jp('同じ 確率で 崩壊',955,270,{size:30,color:HC}),seg(p,.08,.18),HC);
  s+=card(650,330,500,100,jp('核は 年を とらない',900,393,{size:36,color:C.hi}),seg(p,b,b+.08),C.hi);
  return s+goalTag(G1);
 },
 // 3. 表（0〜18 h）、定義の札、「半減期 6.0 時間 ごとに 残り（平均）に ×½」、×½ を左から1つずつ
 [K+'def']:(p,ctx)=>{
  const b=s2(ctx),ve=voiceEnd(ctx);
  let s=qtab(T4.map((t,i)=>({t,v:i?null:V4[0]})),HALVES([0,1,2].map(i=>seg(p,b+.2+i*.08,b+.28+i*.08))));
  s+=card(150,355,900,62,kindTag('定義',225,394)+jp('半減期 ＝ 残りの 数の 平均が 半分に なる 時間',650,397,{size:28}),seg(p,.03,.12),C.faint);
  s+=card(200,428,800,72,jp('半減期 6.0 時間 ごとに 残り（平均）に',560,475,{size:28,color:TC})+TX(`\\times${H2}`,905,470,{size:40}),seg(p,b+.02,b+.12),TC);
  return s+goalTag(G1);
 },
 // 4. 18 h の列を強調、18÷6.0＝3 回、(½)³＝1/8
 [K+'times']:(p,ctx)=>{
  const b=s2(ctx);
  let s=qtab(T4.map((t,i)=>({t,v:i?null:V4[0],hl:i===3?seg(p,.02,.1):0})),HALVES(),{g:.55});
  s+=card(60,355,500,140,TX(`${gold('18')}\\div${gold('6.0')}=3`,250,438,{size:46})+jp('回',440,436,{size:34}),seg(p,.05,.15),TC);
  s+=fcard(620,355,520,140,`\\left(${H2}\\right)^{3}=\\tfrac{1}{8}`,{size:50,col:HC,g:seg(p,b,b+.1)});
  return s+goalTag(G1);
 },
 // 5. 「？」が左から埋まる → 1.6×10⁴÷8＝2.0×10³ → 答え C
 [K+'ans1']:(p,ctx)=>{
  const b=s2(ctx),vg=[1,seg(p,.05,.13),seg(p,.15,.23),seg(p,.25,.33)];
  let s=qtab(T4.map((t,i)=>({t,v:V4[i],vg:vg[i],hl:i===3?seg(p,.33,.4):0})),HALVES());
  s+=card(40,355,620,130,TX(`${P10('1.6','4')}\\div8=${P10('2.0','3')}`,350,433,{size:40}),seg(p,.3,.4),LIVE);
  return s+goalTag(G1)+A1(seg(p,b,b+.05));
 },
 // 6. 誤答 A：毎回 8.0×10³ 個ずつ → 12 h で 0。正しい曲線と、減る数が小さくなる段
 [K+'wrongA']:(p,ctx)=>{
  const b=s2(ctx);
  const A=axes({x:120,y:440,w:430,h:320,xmax:20,ymax:1.8e4});
  const X=A.X,Y=A.Y,f=t=>1.6e4*Math.pow(.5,t/6);
  let s=A.svg+label('時間',580,448,{size:24,color:TC})+label('残り（平均）',130,104,{size:24,color:LIVE,weight:700});
  [6,12,18].forEach(t=>{s+=line(X(t),434,X(t),446,{color:C.dim,w:2})+label(t===6?'6.0 h':`${t} h`,X(t),476,{size:24,color:TC,anchor:'middle',weight:700});});
  [[1.6e4,'1.6×10⁴'],[8e3,'8.0×10³']].forEach(([v,l])=>{s+=line(114,Y(v),126,Y(v),{color:C.dim,w:2})+label(l,108,Y(v)+8,{size:22,color:C.dim,anchor:'end'});});
  s+=draw([[X(0),Y(1.6e4)],[X(12),Y(0)]],seg(p,.06,.3),{color:BAD,w:3,dash:'10 8'});
  s+=fade(seg(p,.26,.34),dot(X(12),Y(0),9,BAD))+fade(seg(p,.26,.34)*(1-seg(p,b-.04,b)),label('12 h で 0 個',X(12)+14,Y(0)-34,{size:24,color:BAD,weight:700}));
  const P=[];for(let t=0;t<=19.5;t+=.25)P.push([X(t),Y(f(t))]);
  s+=draw(P,seg(p,b,b+.2),{color:LIVE,w:4});
  [0,6,12,18].forEach((t,i)=>{s+=fade(seg(p,b+i*.05,b+.05+i*.05),dot(X(t),Y(f(t)),8,HC));});
  ['8.0×10³','4.0×10³','2.0×10³'].forEach((l,i)=>{const t0=6*i,t1=6*(i+1),g=seg(p,b+.22+i*.06,b+.28+i*.06);
   s+=fade(g,line(X(t0),Y(f(t0)),X(t1),Y(f(t0)),{color:HC,w:2,dash:'5 5'})+arrow(X(t1),Y(f(t0)),X(t1),Y(f(t1))-4,{color:HC,w:3,head:10})+label(`−${l}`,X(t1)+10,(Y(f(t0))+Y(f(t1)))/2+8,{size:22,color:HC,weight:700}));});
  s+=wrongCard('A','0 個','毎回 8.0×10³ 個ずつ 減ると 考えた',{x:650,y:95,w:530,g:seg(p,.03,.12)});
  s+=card(650,300,530,170,jp('減る 数の 平均も',915,358,{size:30,color:HC})+jp('残りの 数に 比例して',915,405,{size:30,color:HC})+jp('小さく なる',915,452,{size:30,color:HC}),seg(p,b+.25,b+.35),HC);
  return s+goalTag(G1)+A1(1);
 },
 // 7. 誤答 B・D（1枚ずつ）。グラフは消し、表を薄く
 [K+'wrongBD']:(p,ctx)=>{
  const d=atR(ctx,'ディーは');
  return fade(.45,tabFull())+goalTag(G1)+A1(1)
   +wrongSeq(p,ctx,[['B','5.3×10³ 個','回数 3 で 割った（½ を 3回 掛けるのが 正しい）'],['D','8.9×10² 個','時間 18 で 割った']],{win:[[0,d],[d,1]],opts:{y:355}});
 },
 // ================= S2 小問2：3.0 時間後 =================
 // 8. 棒（0 h・6.0 h）と、3.0 h の空の枠「？」。後半で「3.0 h ＝ 半減期の 半分」
 [K+'goal2']:(p,ctx)=>{
  const b=s2(ctx);
  let s=fade(seg(p,.02,.15),bars3());
  s+=fade(seg(p,b,b+.12),brace(250,550,B3.base+48,{color:TC})+label('3.0 h ＝ 半減期の 半分',400,B3.base+100,{size:26,color:TC,anchor:'middle',weight:700}));
  return s+goalTag(G2,{g:seg(p,.03,.15)});
 },
 // 9. 「核は 年を とらない → 同じ 数」、前半・後半の矢印 ×□
 [K+'same']:(p)=>{
  let s=bars3();
  s+=fade(seg(p,.3,.42),arrow(305,150,495,150,{color:HC,w:4,head:14})+TX(`\\times\\square`,400,128,{size:40,color:HC})+label('前半 3.0 時間',400,96,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.4,.52),arrow(605,150,795,150,{color:HC,w:4,head:14})+TX(`\\times\\square`,700,128,{size:40,color:HC})+label('後半 3.0 時間',700,96,{size:24,color:C.dim,anchor:'middle'}));
  s+=card(960,190,220,180,jp('核は',1070,245,{size:26})+jp('年を とらない',1070,285,{size:26})+jp('→ 同じ 数',1070,340,{size:30,color:HC}),seg(p,.12,.25),HC);
  return s+goalTag(G2);
 },
 // 10. □×□＝½
 [K+'sq']:(p)=>fade(.6,label('2回 掛けると 半減期',600,112,{size:28,color:C.dim,anchor:'middle'}))+fcard(250,130,700,120,`\\square\\times\\square=${H2}`,{size:56,col:HC,g:seg(p,.03,.15)})+goalTag(G2),
 // 11. □＝1/√2 ≈ 0.71、0.71×0.71≈0.50 確かに半分
 [K+'root']:(p,ctx)=>{
  const b=s2(ctx);
  let s=fade(.6,label('2回 掛けると 半減期',600,112,{size:28,color:C.dim,anchor:'middle'}));
  s+=fcard(250,130,700,120,`\\square\\times\\square=${H2}`,{size:56,col:HC});
  s+=fade(seg(p,.03,.12),arrow(600,258,600,292,{color:C.hi,w:4,head:14})+label('同じ 数を 2回 掛けて ½',630,284,{size:24,color:C.dim}));
  s+=card(250,300,700,120,TX(`\\square=\\dfrac{1}{\\sqrt{2}}`,480,362,{size:46,color:HC})+fade(seg(p,.25,.35),TX(`\\approx0.71`,760,360,{size:50,color:HC})),seg(p,.05,.15),HC);
  s+=fade(seg(p,b,b+.1),TX(`0.71\\times0.71\\approx0.50`,520,470,{size:36,color:OK})+label('確かに 半分',780,474,{size:28,color:OK,weight:700}));
  return s+goalTag(G2);
 },
 // 12. 5列の表、×□ ×□ ×½ ×½、1.6×10⁴×0.71≈1.1×10⁴ → 答え D
 [K+'ans2']:(p,ctx)=>{
  const b=s2(ctx),xs=[340,520,700,880,1060];
  let s=qtab([{t:'0 h',v:V4[0]},{t:'3.0 h',v:P10('1.1','4'),vg:seg(p,.3,.4),hl:seg(p,.3,.4)},{t:'6.0 h',v:V4[1]},{t:'12 h',v:V4[2],dim:1},{t:'18 h',v:V4[3],dim:1}],
   [{i:0,txt:`\\times\\square`,g:seg(p,.05,.15)},{i:1,txt:`\\times\\square`,g:seg(p,.05,.15)},{i:2,txt:`\\times${H2}`,g:.4},{i:3,txt:`\\times${H2}`,g:.4}],{xs,vs:32});
  s+=card(40,355,640,130,TX(`${P10('1.6','4')}\\times0.71\\approx${P10('1.1','4')}`,360,433,{size:38}),seg(p,.05,.15),LIVE);
  return s+goalTag(G2)+A2(seg(p,b,b+.05));
 },
 // 13. 誤答 A：0.75 を2回掛けると 0.5625（½ より多い）
 [K+'wrong2A']:(p)=>{
  let s=ratioBars();
  s+=redLine(290,.75,'0.75',seg(p,.05,.15));
  s+=redLine(450,.5625,'0.5625',seg(p,.35,.45))+fade(seg(p,.35,.45),label('0.5',515,RB.base-.5*RB.h+30,{size:24,color:LIVE,weight:700}));
  s+=fade(seg(p,.82,.92),label('正しくは 0.71 × 0.71 ≈ 0.50',300,496,{size:26,color:OK,anchor:'middle',weight:700}));
  s+=wrongCard('A','1.2×10⁴ 個',['半分の 時間なら 減る数も 半分','→ 3/4 残る と 考えた'],{x:640,y:95,w:540,g:seg(p,.03,.12)});
  s+=card(640,250,540,90,TX(`0.75\\times0.75=0.5625`,910,300,{size:40,color:BAD}),seg(p,.3,.4),BAD);
  s+=card(640,355,540,80,jp('½ より 多く 残る → 合わない',890,405,{size:28,color:BAD})+label('×',1150,410,{size:36,color:BAD,anchor:'middle',weight:700}),seg(p,.6,.7),BAD);
  return s+goalTag(G2)+A2(1);
 },
 // 14. 誤答 B・C（1枚ずつ）。3.0 h の棒に赤い線 0.5・0.25
 [K+'wrong2BC']:(p,ctx)=>{
  const c=atR(ctx,'スィーは');
  let s=ratioBars();
  s+=redLine(290,.5,'0.5',seg(p,.03,.1),{side:'left'})+redLine(290,.25,'0.25',seg(p,c,c+.07),{side:'left'});
  return s+goalTag(G2)+A2(1)
   +wrongSeq(p,ctx,[['B','8.0×10³ 個','3.0 h で ½ とした（それは 6.0 h）'],['C','4.0×10³ 個','3.0 h で ¼ とした（それは 12 h）']],{win:[[0,c],[c,1]],opts:{x:640,y:130,w:540}});
 },
 // ================= S3 小問3：半減期を求める =================
 // 15. 別の物質、残り（平均）が 20 日 で 1/16 → ½×½×½×½＝1/16、½ を 4 回
 [K+'goal3']:(p,ctx)=>{
  const b=s2(ctx);
  let s=fig3({gTag:seg(p,.02,.1),gCard:seg(p,.04,.14)});
  s+=fcard(150,300,900,130,`${H2}\\times${H2}\\times${H2}\\times${H2}=\\tfrac{1}{16}`,{size:50,col:HC,g:seg(p,b,b+.1)});
  s+=fade(seg(p,b+.25,b+.35),label('½ を 4 回',600,475,{size:30,color:HC,anchor:'middle',weight:700}));
  return s+goalTag(G3,{g:seg(p,.03,.15)});
 },
 // 16. 時間の線 0〜20 日、5.0・10・15 日の目盛りと 1/2・1/4・1/8、20÷4＝5.0 日 → 答え B
 [K+'ans3']:(p,ctx)=>{
  const b=s2(ctx);
  let s=timeline(p);
  s+=card(60,320,520,130,TX(`${gold('20')}\\div4=${gold('5.0')}`,280,398,{size:48})+jp('日',470,396,{size:34,color:TC}),seg(p,.48,.58),TC);
  return s+goalTag(G3)+A3(seg(p,b,b+.05));
 },
 // 17. 誤答 A・C（1枚ずつ）。C のとき 10 日の「1/4」を赤で囲む
 [K+'wrong3AC']:(p,ctx)=>{
  const c=atR(ctx,'スィーは');
  let s=timeline(1,{grow:0});
  s+=fade(seg(p,c,c+.06),ring(TL.X(10),TL.Y-70,34,{color:BAD,w:3.5}));
  return s+goalTag(G3)+A3(1)+wrongSeq(p,ctx,[['A','1.25 日','16 で 割った（割るのは 回数 4）'],['C','10 日','10 日で 残るのは 1/4']],{win:[[0,c],[c,1]],opts:{y:320}});
 },
 // 18. 誤答 D
 [K+'wrong3D']:(p,ctx)=>timeline(1,{grow:0})+goalTag(G3)+A3(1)+wrongSeq(p,ctx,[['D','80 日','回数 4 を 掛けた']],{opts:{y:320}}),
 // ================= S4 平均の話 =================
 [K+'avg1']:(p,ctx)=>{
  const b=s2(ctx);
  return trialsFig(Math.min(1,p/Math.max(.3,b+.05)*.95))+card(200,380,800,125,jp('1回 1回の 残りは ばらつく',600,430,{size:30,color:LIVE})+jp('ちょうど 半分（2 個）とは 限らない',600,480,{size:30,color:BAD}),seg(p,b+.05,b+.15),C.faint);
 },
 [K+'avg2']:(p)=>trialsFig(1)+card(150,380,900,125,jp('何回も くり返して 平均すると',600,430,{size:30,color:LIVE})+jp('(2+3+1+2+1+3)÷6 ＝ 2 個 ＝ 4 個の 半分',600,480,{size:30,color:C.hi}),seg(p,.03,.15),C.hi),
 // ================= S5 まとめ：元の単元動画の最後の表の画面（e1）=================
 [K+'sum']:(p,ctx)=>{
  const ve=voiceEnd(ctx);
  return hsANucleus2Diagrams['hs-a-nucleus-2:e1'](p,ctx)+tag('残り ＝ 平均の 数',960,110,{color:C.hi,size:26,g:seg(p,.3,.42)})
   +answerRow([[1,'C',''],[2,'D',''],[3,'B','']],{g:seg(p,ve,Math.min(1,ve+.06))});
 },
};

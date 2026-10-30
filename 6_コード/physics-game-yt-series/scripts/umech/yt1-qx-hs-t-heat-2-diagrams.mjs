// 問題編 解説「熱い水を多めに混ぜると」(ys-qx-hs-t-heat-2) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/201_熱と温度.md の q-hs-t-heat-2（解説 22 行、行13 は 2 cue）。
// 色（正本の指定）：温度 T・ΔT 黄緑、熱 Q 橙、質量 白、強調 黄、誤り 赤。熱い水＝赤み、冷たい水＝青み（単元動画と同じ慣習色）。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 元の単元動画（yt1-hs-t-heat-1／-2）の部品（温度計・ビーカー）を読み込んで使う（そのファイルは編集しない）。
// 出題中の図には、混ぜた後の温度・天びん・熱の量の棒を描かない（答えにつながるため）。混ぜた後の温度計は「？」で隠す。
import {C,seg,lin,fade,label,line,rect,dot,ring,arrow,tex,clamp,mix} from './anim.mjs';
import {TC,Tt,Qt,DT,HOT,COLD,thermo,beaker,T2} from './yt1-hs-t-heat-1-diagrams.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,note,sentWin,voiceEnd,cueT} from './yt1-qx-common.mjs';

const K='qx-hs-t-heat-2:';
const EC=C.E,MIX='#b98fb8',GRAY='#6f7d96';
const G1='最後の温度',G2='90℃ 側に寄る理由',G3='熱い水が失った熱';
const A1=g=>answerTag(1,'C','70℃',{g}),A2=g=>answerTag(2,'B','',{g}),A3=g=>answerTag(3,'B','12600 J',{g});
const QF=`${Qt}=mc${DT}`;
// ナレーションの読みの中で、語 word が読まれ始める所（cue の進み 0〜1。読みのかなの長さで見積もる）
function at(ctx,word,fb=.5){
 const r=(ctx?.cue?.reading??'').replace(/\s/g,''),i=r.indexOf(word.replace(/\s/g,''));
 return i<0?fb:i/Math.max(1,r.replace(/。/g,'').length)*voiceEnd(ctx);
}
const sw2=(ctx,fb=.5)=>{const W=sentWin(ctx);return W[1]?W[1][0]:fb;};
const tagCard=(t,x,y,col,{g=1,w=230,size=28}={})=>card(x-w/2,y-30,w,54,label(t,x,y+6,{size,color:col,anchor:'middle',weight:700}),g,col);

// ---- 出題中の図：2つのビーカー → 中央のビーカーへ注ぐ ----------------------------------------------
// t＝秒。0〜2 s 並ぶ、2〜5 s 注ぐ（2〜3 s 持ち上げ、3〜5 s 傾ける）、5〜6 s 温度計「？」。
function pourScene(t,{q=1}={}){
 const lift=seg(t,2,2.9),tilt=seg(t,2.9,4.4),drain=lin(t,3.3,5),gray=seg(t,2,2.4);
 let s='';
 // 中央のビーカー（混ぜる先）
 const fill=drain;
 s+=fade(seg(t,.2,.8),beaker(600,470,220,190,{water:MIX,fo:.32,level:.78*fill}));
 // 熱い水（左）：持ち上げて右へ傾ける
 const hx=mix(220,375,lift),hy=mix(440,330,lift),ha=50*tilt;
 const hb=beaker(hx,hy,150,150,{water:HOT,fo:.38,level:.72*(1-.85*drain)});
 s+=`<g transform="rotate(${ha.toFixed(2)} ${hx+75} ${hy-150})">${hb}</g>`;
 // 冷たい水（右）：持ち上げて左へ傾ける
 const cx=mix(980,825,lift),cy=mix(440,330,lift),ca=-50*tilt;
 const cb=beaker(cx,cy,100,100,{water:COLD,fo:.42,level:.72*(1-.85*drain)});
 s+=`<g transform="rotate(${ca.toFixed(2)} ${cx-50} ${cy-100})">${cb}</g>`;
 // 注ぐ流れ
 const st=seg(t,3.6,3.9)*(1-seg(t,4.8,5.1));
 if(st>0){const lip=(x0,y0,a,dx)=>{const r=a*Math.PI/180;return [x0,y0];};
  s+=fade(st,`<path d="M${hx+80} ${hy-148} Q${hx+110} ${hy-120} ${540} ${470-190*.78*fill}" fill="none" stroke="${HOT}" stroke-opacity=".7" stroke-width="8"/>`);
  s+=fade(st,`<path d="M${cx-55} ${cy-98} Q${cx-85} ${cy-70} ${660} ${470-190*.78*fill}" fill="none" stroke="${COLD}" stroke-opacity=".7" stroke-width="6"/>`);}
 // 熱い水から冷たい水へ、橙の矢印（注ぐ間）
 const ar=seg(t,3.4,3.8)*(1-seg(t,5,5.4));
 s+=arrow(470,120,730,120,{color:EC,w:7,head:20,g:ar});
 // 札と温度計（左右の外側）。注ぎ始めたら灰色にして「注ぐ前」
 const tk=(x,top,bot,lev,col)=>thermo(x,top,bot,lev,{color:col});
 const lab=(c)=>fade(1-gray,c[0])+fade(gray*.8,c[1]);
 s+=fade(seg(t,.4,1),lab([tagCard('90℃・150 g',140,120,C.ink,{w:230})+tk(60,190,400,170,TC),tagCard('90℃・150 g',140,120,GRAY,{w:230})+tk(60,190,400,170,GRAY)]));
 s+=fade(seg(t,.4,1),lab([tagCard('10℃・50 g',1060,120,C.ink,{w:220})+tk(1140,190,400,40,TC),tagCard('10℃・50 g',1060,120,GRAY,{w:220})+tk(1140,190,400,40,GRAY)]));
 s+=fade(gray,label('注ぐ前',140,180,{size:24,color:GRAY,anchor:'middle',weight:700})+label('注ぐ前',1060,180,{size:24,color:GRAY,anchor:'middle',weight:700}));
 // 混ぜた後の温度計は「？」で隠す
 const qq=seg(t,5,5.6);
 s+=fade(qq,thermo(650,250,440,0,{color:TC})+card(612,300,76,70,label('？',650,350,{size:44,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
 return s;
}
// 混ぜた後のビーカー（解説用）。val＝0→1 で「？」を外して 70℃
function mixed(x,{val=0,g=1}={}){
 let s=beaker(x,470,220,190,{water:MIX,fo:.32,level:.78});
 s+=thermo(x+50,250,440,mix(0,130,val),{color:TC});
 s+=fade(1-val,card(x+12,300,76,70,label('？',x+50,350,{size:44,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
 s+=fade(val,label('70℃',x+80,240,{size:34,color:C.hi,weight:700}));
 return fade(g,s);
}
// 混ぜる前の2つのビーカー（左 熱い、右 冷たい）
function twoBeakers({g=1,xh=300,xc=900,gy=400,labels=1}={}){
 let s=beaker(xh,gy,150,150,{water:HOT,fo:.38,level:.72})+beaker(xc,gy,100,100,{water:COLD,fo:.42,level:.72});
 if(labels)s+=label('90℃・150 g',xh,gy+40,{size:28,color:C.ink,anchor:'middle',weight:700})+label('10℃・50 g',xc,gy+40,{size:28,color:C.ink,anchor:'middle',weight:700});
 return fade(g,s);
}
// 1本の温度計の上の 283・T・363（K）
const yK=k=>440-(k-275)*3.6;
function widthsPic(p,{bH=1,bC=1,lab=1}={}){
 const x=300;let s=thermo(x,yK(375),yK(275),yK(275)-yK(343),{color:TC});
 for(const [k,l,c] of [[363,'363 K',HOT],[343,'T',TC],[283,'283 K',COLD]]){
  s+=line(x+14,yK(k),x+44,yK(k),{color:c,w:3});
  s+=k===343?tex(`${Tt}`,x+66,yK(k),{size:34,anchor:'start'}):label(l,x+56,yK(k)+9,{size:26,color:c,weight:700});}
 s+=fade(bH,rect(x-60,yK(363),36,yK(343)-yK(363),{fill:HOT,fo:.55,stroke:HOT,sw:2,rx:4}));
 s+=fade(bC,rect(x-60,yK(343),36,yK(283)-yK(343),{fill:COLD,fo:.55,stroke:COLD,sw:2,rx:4}));
 s+=fade(bH*lab,tex(`363-${Tt}`,x-80,(yK(363)+yK(343))/2,{size:32,anchor:'end',auto:false}));
 s+=fade(bC*lab,tex(`${Tt}-283`,x-80,(yK(343)+yK(283))/2,{size:32,anchor:'end',auto:false}));
 return s;
}
// 式
const E0=`150\\times4.2\\times(363-${Tt})=50\\times4.2\\times(${Tt}-283)`;
const E0a=`150\\times\\cancel{4.2}\\times(363-${Tt})=50\\times\\cancel{4.2}\\times(${Tt}-283)`;
const E0b=`\\cancelto{3}{150}\\times\\cancel{4.2}\\times(363-${Tt})=\\cancelto{1}{50}\\times\\cancel{4.2}\\times(${Tt}-283)`;
const E1=`3\\times(363-${Tt})=${Tt}-283`;
const E2=`1089-3${Tt}=${Tt}-283`;
const E3=`1372=4${Tt}`;
// 天びん：目盛り 10〜90（℃）、おもり 150（90）と 50（10）、支点 fx
const BX=c=>150+(c-10)*11.25;   // 10 → 150、90 → 1050
function balance({fx=50,g=1,w1lab='150',w2lab='50',arms=0,yb=330,mcTag=0,swing=0}={}){
 const tq=150*(90-fx)-50*(fx-10),ang=clamp(tq/3000,-1,1)*6;
 let b=line(BX(10),yb,BX(90),yb,{color:C.dim,w:6});
 const box=(c,h,col,t,w)=>rect(BX(c)-w/2,yb-h-4,w,h,{fill:col,fo:.5,stroke:col,sw:2,rx:6})+label(t,BX(c),yb-h-16,{size:28,color:col,anchor:'middle',weight:700});
 b+=box(90,120,HOT,w1lab,110)+box(10,40,COLD,w2lab,90);
 let s=`<g transform="rotate(${ang.toFixed(2)} ${BX(fx)} ${yb})">${b}</g>`;
 s+=`<polygon points="${BX(fx)},${yb+4} ${BX(fx)-24},${yb+44} ${BX(fx)+24},${yb+44}" fill="${C.hi}" fill-opacity=".9"/>`;
 for(const c of [10,30,50,70,90])s+=line(BX(c),yb+50,BX(c),yb+60,{color:C.dim,w:2})+label(String(c),BX(c),yb+88,{size:24,color:Math.abs(c-fx)<1?C.hi:C.dim,anchor:'middle',weight:700});
 if(arms){
  s+=fade(arms,arrow(BX(90),yb+112,BX(fx),yb+112,{color:HOT,w:5,head:14})+label(`変化幅 ${90-fx}`,(BX(90)+BX(fx))/2,yb+148,{size:24,color:HOT,anchor:'middle',weight:700}));
  s+=fade(arms,arrow(BX(10),yb+112,BX(fx),yb+112,{color:COLD,w:5,head:14})+label(`変化幅 ${fx-10}`,(BX(10)+BX(fx))/2,yb+148,{size:24,color:COLD,anchor:'middle',weight:700}));
 }
 if(mcTag)s+=fade(mcTag,tagCard('mc',BX(90)-115,yb-50,C.hi,{w:90})+tagCard('mc',BX(10)+105,yb-50,C.hi,{w:90}));
 return fade(g,s);
}
// 橙の棒（熱の量）。h＝高さ px
const bar=(x,base,h,t1,t2,g=1)=>fade(g,rect(x-50,base-h,100,h,{fill:EC,fo:.55,stroke:EC,sw:2,rx:6})+label(t1,x,base+32,{size:24,color:EC,anchor:'middle',weight:700})+label(t2,x,base-h-14,{size:26,color:EC,anchor:'middle',weight:700}));
// 温度計（℃、0〜100）で 70〜90 を塗る
const yCel=c=>440-c*3.2;
function thermo7090({band=1,g=1}={}){
 const x=250;let s=thermo(x,yCel(100),yCel(0),yCel(0)-yCel(70),{color:TC});
 for(const c of [10,70,90])s+=line(x+14,yCel(c),x+40,yCel(c),{color:C.ink,w:3})+label(`${c}℃`,x+52,yCel(c)+9,{size:26,color:C.ink,weight:700});
 s+=fade(band,rect(x-70,yCel(90),40,yCel(70)-yCel(90),{fill:C.hi,fo:.4,stroke:C.hi,sw:2,rx:4})+label('20 K',x-80,(yCel(90)+yCel(70))/2+9,{size:28,color:C.hi,anchor:'end',weight:700}));
 return fade(g,s);
}

export const qxHsTHeat2Diagrams={
 // ================= 問題アニメ：出題中（小問1〜3 共通、約6 s ＋静止）=================
 [K+'q0']:(p,ctx)=>pourScene(cueT(ctx)||p*6),
 // ================= S1 小問1：最後の温度 =================
 // 1. 出題中の図で始める
 [K+'goal1']:(p)=>pourScene(6)+goalTag(G1,{g:seg(p,.03,.15)}),
 // 2. 混ぜる前に戻す。失った熱 ＝ 得た熱。前提：外へ熱は逃げない
 [K+'cons']:(p)=>{
  let s=twoBeakers();
  s+=arrow(420,320,800,320,{color:EC,w:9,head:26,g:seg(p,.05,.18)});
  s+=fade(seg(p,.3,.42),label('失った 熱',300,150,{size:32,color:HOT,anchor:'middle',weight:700})+label('＝',600,150,{size:40,color:EC,anchor:'middle',weight:700})+label('得た 熱',900,150,{size:32,color:COLD,anchor:'middle',weight:700}));
  s+=kindTag('前提',600,230,{text:'外へ 熱は 逃げない',g:seg(p,.08,.2)});
  return s+goalTag(G1);
 },
 // 3. 1 g・1 K → 4.2 J に ×m、×ΔT を掛けて Q＝mcΔT（定義）
 [K+'qmc']:(p,ctx)=>{
  const b=sw2(ctx),m=seg(p,at(ctx,'しつりょう'),at(ctx,'しつりょう')+.05),d=seg(p,at(ctx,'おんどさ'),at(ctx,'おんどさ')+.05),q=seg(p,at(ctx,'キュー'),at(ctx,'キュー')+.05);
  let s=card(60,150,330,140,label('1 g・1 K',225,205,{size:32,color:C.ink,anchor:'middle',weight:700})+label('→ 4.2 J',225,258,{size:32,color:EC,anchor:'middle',weight:700}),seg(p,.05,.15),C.dim);
  s+=fade(seg(p,.05,.15),label('比熱 c',225,330,{size:26,color:C.dim,anchor:'middle',weight:700}));
  s+=fade(m,label('× m',470,232,{size:40,color:C.ink,anchor:'middle',weight:700})+label('質量の 分',470,290,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(d,T2(`\\times${DT}`,630,222,{size:40})+label('温度差の 分',630,290,{size:24,color:C.dim,anchor:'middle'}));
  s+=card(760,150,380,140,T2(QF,950,222,{size:50}),q,EC);
  s+=kindTag('定義',950,340,{g:q});
  return s+goalTag(G1);
 },
 // 4. 最後の温度を T（K）とおく。90℃→363 K、10℃→283 K
 [K+'setT']:(p,ctx)=>{
  const b=sw2(ctx);
  let s=card(330,92,540,72,label('最後の 温度 ＝',520,140,{size:30,color:C.ink,anchor:'middle',weight:700})+tex(`${Tt}`,665,128,{size:46})+label('（K）',700,140,{size:28,color:TC,weight:700}),seg(p,.05,.15),TC);
  s+=twoBeakers({gy:380});
  s+=card(150,440,300,64,T2('90+273=363',300,470,{size:34,auto:false}),seg(p,b,b+.06),HOT);
  s+=card(750,440,300,64,T2('10+273=283',900,470,{size:34,auto:false}),seg(p,at(ctx,'じゅう どは'),at(ctx,'じゅう どは')+.06),COLD);
  return s+goalTag(G1);
 },
 // 5. 1本の温度計の上で、T〜363 を赤み、283〜T を青み
 [K+'widths']:(p,ctx)=>{
  const b=sw2(ctx);
  let s=widthsPic(p,{bH:seg(p,.05,.15),bC:seg(p,at(ctx,'つめたい'),at(ctx,'つめたい')+.06)});
  s+=card(640,200,460,90,label('どちらも 正の 量',870,258,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,b,b+.06),C.hi);
  return s+goalTag(G1);
 },
 // 6. 等号で結ぶ（失った熱＝得た熱）
 [K+'eqn']:(p)=>{
  let s=card(30,170,1140,120,T2(E0,600,232,{size:38}),seg(p,.05,.18),EC);
  s+=fade(seg(p,.2,.32),label('失った 熱',320,340,{size:28,color:HOT,anchor:'middle',weight:700})+label('得た 熱',900,340,{size:28,color:COLD,anchor:'middle',weight:700}));
  return s+goalTag(G1);
 },
 // 7. 両辺 ÷4.2（打ち消し線）→ 150→3、50→1 → 3×(363−T)＝T−283
 [K+'s1']:(p,ctx)=>{
  const a1=at(ctx,'さらに'),k1=seg(p,.06,.14),k2=seg(p,a1,a1+.06),r=seg(p,a1+.12,a1+.2);
  let s=card(30,110,1140,130,fade(1-k1,T2(E0,600,175,{size:38}))+fade(k1*(1-k2),T2(E0a,600,175,{size:38}))+fade(k2,T2(E0b,600,175,{size:38})),1,EC);
  s+=fade(k1*(1-k2),label('両辺 ÷ 4.2',600,280,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(k2,label('両辺 ÷ 50',600,280,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=card(250,320,700,110,T2(E1,600,375,{size:44}),r,C.hi);
  return s+goalTag(G1);
 },
 // 8. かっこを外す（3×363＝1089）→ 両辺に 3T と 283 を足す → 1372＝4T
 [K+'s2']:(p,ctx)=>{
  const a1=at(ctx,'うつして');
  let s=fade(.55,T2(E1,600,120,{size:36}));
  s+=fade(seg(p,.05,.12),label('3 × 363 ＝ 1089',1000,128,{size:26,color:C.dim,anchor:'middle',weight:700}));
  s+=card(250,170,700,100,T2(E2,600,220,{size:44}),seg(p,.12,.22),C.ink);
  s+=fade(seg(p,a1,a1+.06),label('両辺に 3T と 283 を 足す',600,320,{size:28,color:C.hi,anchor:'middle',weight:700})+arrow(600,335,600,370,{color:C.hi,w:4,head:12}));
  s+=card(350,380,500,100,T2(E3,600,430,{size:46}),seg(p,a1+.1,a1+.18),C.hi);
  return s+goalTag(G1);
 },
 // 9. 1372÷4＝343 → 343−273＝70。「？」が外れて 70℃。小問1 の答え C
 [K+'solve']:(p,ctx)=>{
  const b=sw2(ctx),a2=at(ctx,'にひゃく ななじゅう'),v=seg(p,a2+.08,a2+.16);
  let s=card(80,110,520,90,T2(`1372\\div4=343\\ \\mathrm{K}`,340,155,{size:38,auto:false}),seg(p,.03,.1),TC);
  s+=card(80,240,520,90,T2('343-273=70\\,{}^{\\circ}\\mathrm{C}',340,285,{size:38,auto:false}),seg(p,a2,a2+.06),C.hi);
  s+=mixed(850,{val:v});
  return s+goalTag(G1)+A1(seg(p,b+.15,b+.25));
 },
 // 10. 誤答 D（343℃）、B（50℃）。1枚ずつ
 [K+'wrongDB']:(p,ctx)=>{
  let s=fade(.3,mixed(850,{val:1}));
  s+=wrongSeq(p,ctx,[['D','343℃','K を ℃ に 直し忘れた'],['B','50℃','質量の 違いを 無視']],{opts:{x:100,w:620,y:200}});
  return s+goalTag(G1)+A1(1);
 },
 // 11. 誤答 A（30℃）
 [K+'wrongA']:(p)=>{
  let s=fade(.3,mixed(850,{val:1}));
  s+=wrongCard('A','30℃','質量を 逆の 側に 掛けた',{x:100,w:620,y:200,g:seg(p,.02,.08)});
  return s+goalTag(G1)+A1(1);
 },
 // ================= S2 小問2：理由 =================
 // 12. 求めるもの。10℃〜90℃ の線の上で 70℃ は 90℃ 側
 [K+'goal2']:(p)=>{
  let s=line(BX(10),300,BX(90),300,{color:C.dim,w:4});
  for(const [c,col] of [[10,COLD],[70,C.hi],[90,HOT]])s+=line(BX(c),286,BX(c),314,{color:col,w:4})+label(`${c}℃`,BX(c),360,{size:30,color:col,anchor:'middle',weight:700});
  s+=fade(seg(p,.3,.45),dot(BX(70),300,12,C.hi)+label('最後の 温度',BX(70),250,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s+goalTag(G2,{g:seg(p,.03,.15)});
 },
 // 13a. 天びん：目盛り 90 に 150、10 に 50 のおもり（支点は真ん中の 50 で、熱い側へ傾く）
 [K+'bal0']:(p)=>{
  let s=balance({fx:50,g:seg(p,.02,.12)});
  s+=note('（目盛りは ℃、おもりの 重さは g の 数）',600,120,{g:seg(p,.1,.2)});
  return s+goalTag(G2);
 },
 // 13b. 支点が 70 へ滑ってつり合う。150×20＝50×60＝3000
 [K+'bal']:(p)=>{
  const fx=mix(50,70,seg(p,.05,.4));
  let s=balance({fx,arms:seg(p,.42,.52)});
  s+=card(330,96,540,70,T2('150\\times20=50\\times60=3000',600,131,{size:34,auto:false}),seg(p,.5,.6),C.hi);
  return s+goalTag(G2);
 },
 // 14. おもりの札を 150×4.2、50×4.2 に書き換えて mc。変化幅 20 は短く、60 は長い
 [K+'mc']:(p,ctx)=>{
  const k=seg(p,.05,.15),b=sw2(ctx);
  let s=fade(1-k,balance({fx:70,arms:1}))+fade(k,balance({fx:70,arms:1,w1lab:'150×4.2',w2lab:'50×4.2',mcTag:seg(p,.15,.25)}));
  s+=fade(seg(p,b,b+.06),label('mc が 大きいほど、温度が 変わりにくい',600,130,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s+goalTag(G2);
 },
 // 15. 小問2 の答え B。誤答 A・D（1枚ずつ）
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=sw2(ctx),m=(b+1)/2;
  let s=fade(1-seg(p,b,b+.05)*.7,balance({fx:70,arms:1,w1lab:'150×4.2',w2lab:'50×4.2',mcTag:1}));
  s+=wrongSeq(p,ctx,[['A','熱い 水は 比熱が 大きい','同じ 水なので 比熱は 同じ'],['D','冷たい 水は 受け取りにくい','同じ 水なので 温まりやすさは 同じ']],{win:[[b,m],[m,1]],opts:{x:100,w:820,y:110}});
  return s+goalTag(G2)+A2(seg(p,W[0][1]-.12,W[0][1]-.04));
 },
 // 16. 誤答 C
 [K+'wrongC']:(p)=>{
  let s=fade(.3,balance({fx:70,arms:1,w1lab:'150×4.2',w2lab:'50×4.2',mcTag:1}));
  s+=wrongCard('C','熱は 高温→低温','向きは 正しいが、寄る 理由では ない',{x:100,w:820,y:110,g:seg(p,.02,.08)});
  return s+goalTag(G2)+A2(1);
 },
 // ================= S3 小問3：失った熱 =================
 // 17. 温度計の 70〜90 を黄で塗り「20 K」
 [K+'goal3']:(p,ctx)=>{
  const b=sw2(ctx);
  let s=thermo7090({band:seg(p,b,b+.08)});
  s+=card(560,200,520,90,T2('90-70=20\\ \\mathrm{K}',820,245,{size:40,auto:false}),seg(p,b+.1,b+.18),C.hi);
  return s+goalTag(G3,{g:seg(p,.03,.15)});
 },
 // 18. 150×4.2×20＝12600 J（途中 150×4.2＝630）。橙の棒「失った熱」
 [K+'Qhot']:(p)=>{
  let s=card(40,96,680,130,T2('150\\times4.2\\times20=12600\\ \\mathrm{J}',380,140,{size:36,auto:false})+fade(seg(p,.3,.4),T2('(150\\times4.2=630)',380,195,{size:28,auto:false,color:C.dim})),seg(p,.03,.12),HOT);
  s+=bar(850,450,220,'失った 熱','12600 J',seg(p,.55,.7));
  return s+goalTag(G3);
 },
 // 19. 50×4.2×60＝12600 J。橙の棒「得た熱」を同じ高さで並べる
 [K+'Qcold']:(p,ctx)=>{
  let s=card(40,96,680,130,T2('150\\times4.2\\times20=12600\\ \\mathrm{J}',380,140,{size:36,auto:false})+T2('(150\\times4.2=630)',380,195,{size:28,auto:false,color:C.dim}),1,HOT);
  s+=card(40,250,680,90,T2('50\\times4.2\\times60=12600\\ \\mathrm{J}',380,293,{size:36,auto:false}),seg(p,.05,.15),COLD);
  s+=bar(850,450,220,'失った 熱','12600 J')+bar(1050,450,220,'得た 熱','12600 J',seg(p,.3,.45));
  s+=fade(seg(p,sw2(ctx),sw2(ctx)+.06),line(780,230,1120,230,{color:C.hi,w:3,dash:'8 6'})+label('一致',950,210,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s+goalTag(G3);
 },
 // 20. 小問3 の答え B。誤答 A（12.6 J）と「kg なら比熱は 4200 J/(kg·K)」
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=sw2(ctx);
  let s=fade(1-seg(p,b,b+.05)*.7,bar(850,450,220,'失った 熱','12600 J')+bar(1050,450,220,'得た 熱','12600 J')+card(40,96,680,130,T2('150\\times4.2\\times20=12600\\ \\mathrm{J}',380,140,{size:36,auto:false}),1,HOT));
  s+=wrongCard('A','12.6 J','kg と g 用の 比熱を 混ぜた（1000倍 ずれ）',{x:60,w:700,y:250,mid:'0.15\\times4.2\\times20=12.6',midSize:30,g:seg(p,b,b+.05)});
  s+=card(60,430,700,64,label('kg なら 比熱は 4200 J/(kg·K)',410,472,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,b+.3,b+.36),C.dim);
  return s+goalTag(G3)+A3(seg(p,W[0][1]-.12,W[0][1]-.04));
 },
 // 21. 誤答 C（37800 J）、D（44100 J）。1枚ずつ
 [K+'wrongCD']:(p,ctx)=>{
  const b=at(ctx,'ディーは');
  let s=fade(.3,bar(850,450,220,'失った 熱','12600 J')+bar(1050,450,220,'得た 熱','12600 J'));
  s+=wrongSeq(p,ctx,[['C','37800 J','冷たい 水の 上がり幅 60 K を 使った',{mid:'150\\times4.2\\times60=37800'}],['D','44100 J','ΔT に 70 を 入れた',{mid:'150\\times4.2\\times70=44100'}]],{win:[[0,b],[b,1]],opts:{x:60,w:700,y:120,midSize:30}});
  return s+goalTag(G3)+A3(1);
 },
 // ================= S4 まとめ：単元動画の天びんの画面 =================
 [K+'sum']:(p)=>{
  let s=balance({fx:70,arms:1,w1lab:'150×4.2',w2lab:'50×4.2',mcTag:1,g:seg(p,.02,.12)});
  s+=card(400,96,400,74,T2(QF,600,133,{size:42}),seg(p,.4,.5),EC);
  s+=answerRow([[1,'C',''],[2,'B',''],[3,'B','']],{g:seg(p,.6,.7)});
  return s;
 },
};

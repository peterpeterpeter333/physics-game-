// 問題編 解説「床の上を引かれる箱」(ys-qx-hs-m-force-3) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/106_力と運動方程式.md の q-hs-m-force-3（解説 18 行）。
// 色（単元動画と同じ）：力 緑の太い矢印（ペアの相手の力は濃い緑 #5fc39b、単元動画 3/3 と同じ）、加速度 a 赤、強調 黄。右向きが正。
// 配置：左に「箱・床・地球・手を少し離した図」、右の列（x≥750）に式・誤答カード。札の帯（y＜78）には図を描かない。
// 矢印の長さ：横 1 N ＝ 5 px（30 N、9.8 N、20.2 N）、縦 1 N ＝ 2.5 px（N・mg 49 N）。出題中の図では f・N・mg に数値を付けない。
import {C,seg,lin,fade,label,line,rect,arrow,tex,clamp} from './anim.mjs';
import {FA,T2,MG,NN} from './yt1-hs-m-force-1-diagrams.mjs';
import {card,goalTag,answerTag,answerRow,wrongSeq,wrongCard,pauseBadge,cueT,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-hs-m-force-3:';
const F2='#5fc39b';
const G1='摩擦の大きさ f',G2='加速度 a',G3='摩擦のペアの力';
const ATAG=[['D','9.8 N'],['B','約4.0 m/s²'],['C','']];
const ans=(n,g=1)=>ATAG.slice(0,n).map(([l,v],i)=>answerTag(i+1,l,v,{y:8+62*i,g:i===n-1?g:1})).join('');
function at(ctx,marker,fb=.5){
 const r=(ctx?.cue?.reading??'').replace(/\s/g,''),m=marker.replace(/\s/g,''),i=r.indexOf(m);
 return i<0||!r.length?fb:i/r.length*voiceEnd(ctx);
}
const BX=420,BT=240,BB=330;            // 箱の中心 x、上端、下端
const PH=5,PV=2.5;
function hand(x,y,{g=1}={}){return fade(g,rect(x,y-18,46,36,{fill:'#e9c7a6',fo:1,stroke:'none',rx:14})+rect(x+40,y-10,64,20,{fill:'#e9c7a6',fo:.9,stroke:'none',rx:9}));}
const boxAt=(x,{g=1}={})=>fade(g,rect(x-70,BT,140,BB-BT,{fill:'#c9a46a',fo:.55,stroke:'#c9a46a',rx:8})+label('5.0 kg',x,BT+56,{size:26,color:C.ink,anchor:'middle',weight:700}));
const hl=(x1,y1,x2,y2,g)=>g?fade(g,line(x1,y1,x2,y2,{color:C.hi,w:20})):'';
// 出題中の前半：床の上の箱（x）と手
function floorView(x,{g=1,handG=0,mu=1}={}){
 let s=line(60,BB,1100,BB,{color:C.dim,w:3});for(let q=70;q<1100;q+=26)s+=line(q,BB+2,q-14,BB+18,{color:C.faint,w:2});
 s+=boxAt(x);
 if(mu)s+=label('μ＝0.20',x+40,BB+46,{size:24,color:C.dim,weight:700});
 if(handG)s+=fade(handG,line(x+70,285,x+100,285,{color:C.dim,w:5})+hand(x+100,285));
 return fade(g,s);
}
// 離して描いた図。o＝各矢印の濃さ、lab＝各矢印の札、vals＝数値を付けるか
function apart({g=1,o={},labs={},len={},hi={},pull=1,floorPair=0,pairLab=0,muLab=1,same=0}={}){
 const O=k=>o[k]??1;
 const Lp=len.p??150,Lf=len.f??60,Ln=len.n??100,Lg=len.g??100;
 let s='';
 // floor slab, earth, hand (drawn apart)
 s+=rect(160,352,540,20,{fill:'#5a6680',fo:.85,stroke:'none',rx:4})+label('床',176,406,{size:24,color:C.dim,weight:700});
 s+=`<path d="M 40 515 Q 420 470 800 515" fill="#2a6f9e" fill-opacity=".55" stroke="none"/>`+label('地球',110,508,{size:24,color:C.ink,weight:700});
 s+=hand(660,285)+label('手',708,320,{size:24,color:C.dim,anchor:'middle',weight:700});
 if(muLab)s+=label('μ＝0.20',220,406,{size:24,color:C.dim,weight:700});
 s+=boxAt(BX);
 // forces on the box
 s+=fade(O('n'),hl(380,BT,380,BT-Ln,hi.n)+FA(380,BT,380,BT-Ln,{w:8,head:20})+label(labs.n??'N（床→箱）',364,BT-Ln+22,{size:24,color:C.F,anchor:'end',weight:700}));
 s+=fade(O('g'),hl(470,285,470,285+Lg,hi.g)+FA(470,285,470,285+Lg,{w:8,head:20})+label(labs.g??'mg（地球→箱）',486,Math.max(285+Lg-6,406),{size:24,color:C.F,weight:700}));
 s+=fade(O('f'),hl(350,318,350-Lf,318,hi.f)+FA(350,318,350-Lf,318,{w:8,head:20})+label(labs.f??'f（床→箱）',350-Lf-10,326,{size:24,color:hi.fl?C.hi:C.F,anchor:'end',weight:700}));
 s+=fade(O('p')*pull,hl(490,285,490+Lp,285,hi.p)+FA(490,285,490+Lp,285,{w:8,head:20})+label(labs.p??'30 N（手→箱）',500,262,{size:24,color:C.F,weight:700}));
 if(same)s+=fade(same,rect(230,300,60,30,{fill:'none',fo:0,stroke:'none'})+label('同じ 物体',570,232,{size:24,color:C.hi,anchor:'middle',weight:700})+label('同じ 物体',250,290,{size:24,color:C.hi,anchor:'middle',weight:700}));
 // the partner on the floor (box → floor, right, 9.8 N)
 if(floorPair){
  s+=fade(floorPair,`<rect x="150" y="342" width="560" height="40" rx="10" fill="none" stroke="${F2}" stroke-width="3" stroke-dasharray="9 7"/>`+FA(300,362,349,362,{color:F2,w:8,head:18}));
  s+=fade(floorPair*pairLab,label('箱→床 9.8 N（床の 側）',150,442,{size:24,color:F2,weight:700})+line(330,330,330,350,{color:C.hi,w:2,dash:'4 4'}));
 }
 return fade(g,s);
}
const VAL={n:'N 49 N',g:'mg 49 N',f:'f 9.8 N',p:'30 N'};
const LV={p:150,f:49,n:122.5,g:122.5};
function setupAt(t){
 const tp=clamp((t-2)/2,0,1),x=250+170*tp*tp,sw=seg(t,4,4.6);
 let s=floorView(x,{g:seg(t,0,.6)*(1-sw),handG:seg(t,1.8,2.2)});
 s+=apart({g:sw,o:{n:seg(t,4.6,5),g:seg(t,4.6,5),f:seg(t,4.4,4.8),p:seg(t,4.2,4.6)}});
 s+=fade(seg(t,.4,1),arrow(1000,130,1090,130,{color:C.ink,w:4,head:14})+label('＋',1045,170,{size:28,color:C.ink,anchor:'middle',weight:700}));
 s+=pauseBadge({g:seg(t,5.5,5.8),x:760,y:86});
 return s;
}
const RC=(inner,g=1,{y=100,h=150,col=C.F}={})=>card(750,y,430,h,inner,g,col);
const WR={x:750,w:430,size:26,whySize:22};

export const qxHsMForce3Diagrams={
 // ================= 問題アニメ：出題中（小問1〜3 共通、6 秒＋静止）=================
 // 0〜2 s：床の上の箱（5.0 kg）、μ＝0.20、右向きの「＋」。2〜4 s：手が右へ引き、箱がすべり始める。
 // 4〜6 s：箱・床・地球・手を離して描き直し、箱が受ける力だけを緑で（手→箱 30 N、床→箱 f、地球→箱 mg、床→箱 N。f・N・mg は数値なし）。一時停止。
 [K+'q0']:(p)=>setupAt(6*p),
 // ================= S1 小問1：摩擦 =================
 [K+'setup']:(p,ctx)=>setupAt(Math.min(6,2+cueT(ctx))),
 // 2. 求めるもの：摩擦 f。f を黄で縁取る
 [K+'goal1']:(p)=>apart({hi:{f:seg(p,.35,.5)}})+goalTag(G1,{g:seg(p,.03,.15)}),
 // 3. f＝μN → まず N。N を黄で、N の矢印へ線
 [K+'fmu']:(p)=>{
  let s=apart({hi:{n:seg(p,.6,.72)}});
  s+=RC(T2(`f=\\mu ${NN}`,965,190,{size:48})+fade(seg(p,.55,.65),rect(1020,150,50,62,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:8})),seg(p,.03,.12));
  s+=fade(seg(p,.62,.72),line(750,160,400,BT-60,{color:C.hi,w:2,dash:'6 6'}));
  return s+goalTag(G1);
 },
 // 4. 縦の合力 0 → N＝mg＝5.0×9.8＝49 N。N と mg を同じ長さに
 [K+'N']:(p,ctx)=>{
  const c=at(ctx,'エヌイコール',.45),e=seg(p,c,c+.08);
  let s=apart({len:{n:100+22.5*e,g:100+22.5*e},labs:{n:e>.5?'N 49 N':'N（床→箱）',g:e>.5?'mg 49 N':'mg（地球→箱）'},hi:{n:seg(p,.1,.2)*.7,g:seg(p,.1,.2)*.7}});
  s+=RC(fade(seg(p,.05,.15),label('縦の 合力 ＝ 0',965,140,{size:26,color:C.dim,anchor:'middle',weight:700}))+fade(seg(p,c,c+.06),T2(`${NN}=${MG}`,965,190,{size:40}))+fade(seg(p,c+.15,c+.22),T2('=5.0\\times 9.8=49\\ \\mathrm{N}',965,236,{size:34})),1,{h:170});
  s+=RC(T2(`f=\\mu ${NN}`,965,330,{size:40}),1,{y:290,h:80});
  return s+goalTag(G1);
 },
 // 5. f＝0.20×49＝9.8 N。答え D
 [K+'ans1']:(p,ctx)=>{
  const d=at(ctx,'しょうもんいちの',.7),v=seg(p,.4,.46);
  let s=apart({len:{n:122.5,g:122.5,f:60-11*v},labs:{n:'N 49 N',g:'mg 49 N',f:v>.5?'f 9.8 N':'f（床→箱）'}});
  let o=fade(1-seg(p,.12,.16),T2(`f=\\mu ${NN}`,965,170,{size:44}));
  o+=fade(seg(p,.14,.18),T2('f=0.20\\times 49',965,160,{size:40}));
  o+=fade(seg(p,.4,.46),T2('=9.8\\ \\mathrm{N}',965,220,{size:42}));
  s+=RC(o,1,{h:160});
  return s+goalTag(G1)+ans(1,seg(p,d,d+.05));
 },
 // 6. 誤答 A（μ×5.0）、誤答 B（μ×30）を1枚ずつ。μ×N に○
 [K+'wrongAB']:(p,ctx)=>{
  const b=at(ctx,'ビーの',.3),W=sentWin(ctx),c=W[1]?W[1][0]:.6;
  let s=apart({len:{n:122.5,g:122.5,f:49},labs:VAL});
  const row=(t,y,mark,col,g)=>fade(g,T2(t,930,y,{size:34})+label(mark,1110,y+10,{size:34,color:col,anchor:'middle',weight:700}));
  let o=row('\\mu\\times 5.0',120,'×','#ff6b6b',seg(p,.03,.1))+row('\\mu\\times 30',175,'×','#ff6b6b',seg(p,b,b+.05))+row(`\\mu\\times ${NN}`,230,'○',C.F,seg(p,c,c+.05));
  s+=card(750,86,430,190,o,1,C.dim);
  s+=wrongSeq(p,ctx,[['A','1.0 N','μ×5.0 kg と した'],['B','6.0 N','μ×30 N と した']],{win:[[0,b],[b,1]],opts:{...WR,y:290}});
  return s+goalTag(G1)+ans(1);
 },
 // 7. 誤答 C（49 N）
 [K+'wrongC']:(p)=>{
  let s=apart({len:{n:122.5,g:122.5,f:49},labs:VAL,hi:{n:seg(p,.2,.3)*.6}});
  s+=card(750,86,430,190,T2(`f=\\mu ${NN}=9.8\\ \\mathrm{N}`,965,190,{size:36}),1,C.dim);
  s+=wrongCard('C','49 N','N の 値を そのまま 摩擦と した',{...WR,y:290,g:seg(p,.03,.08)});
  return s+goalTag(G1)+ans(1);
 },
 // ================= S2 小問2：加速度 =================
 // 8. 縦の N と mg を薄くし、横の 30 N と 9.8 N を残す
 [K+'goal2']:(p)=>apart({len:LV,labs:VAL,o:{n:1-.8*seg(p,.3,.5),g:1-.8*seg(p,.3,.5)}})+goalTag(G2,{g:seg(p,.03,.15)})+ans(1),
 // 9. F は合力：30−9.8＝20.2 N（右向き 30 から左向き 9.8 の分が打ち消され、20.2 が残る）
 [K+'net']:(p,ctx)=>{
  const a=at(ctx,'さんじゅうマイナス',.5),u=seg(p,a,a+.15);
  let s=apart({len:LV,labs:VAL,o:{n:.2,g:.2}});
  const x0=790,y=200,k=9;
  let o=FA(x0,y,x0+30*k,y,{w:8,head:20})+label('右 30',x0+15*k,y-18,{size:24,color:C.F,anchor:'middle',weight:700});
  o+=fade(seg(p,a-.05,a),FA(x0+30*k,y+30,x0+20.2*k,y+30,{w:8,head:18})+label('左 9.8',x0+25*k,y+70,{size:24,color:C.F,anchor:'middle',weight:700}));
  o+=fade(u,line(x0+20.2*k,y,x0+30*k-6,y,{color:C.bg,w:12})+line(x0+20.2*k,y,x0+30*k,y,{color:C.faint,w:4,dash:'5 5'}));
  o+=fade(seg(p,a+.15,a+.22),label('合力 右 20.2 N',x0+10*k,y+110,{size:28,color:C.F,anchor:'middle',weight:700}));
  s+=card(750,140,430,190,o,seg(p,.03,.1),C.F);
  s+=fade(seg(p,.1,.2),label('F ＝ 合力',965,370,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s+goalTag(G2)+ans(1);
 },
 // 10. a＝20.2÷5.0＝4.04 → a≈4.0 m/s²。「≈」を黄で囲む。答え B
 [K+'ans2']:(p,ctx)=>{
  const d=at(ctx,'しょうもんにの',.75),c=at(ctx,'やく',.5);
  let s=apart({len:{...LV,p:101},labs:{...VAL,p:'合力 20.2 N'},o:{n:.2,g:.2,f:.25}});
  let o=T2('a=\\dfrac{20.2}{5.0}=4.04',965,210,{size:38});
  o+=fade(seg(p,c,c+.06),T2(`a{\\color{${C.hi}}\\approx} 4.0\\ \\mathrm{m/s^2}`,965,290,{size:40}));
  s+=card(750,140,430,190,o,seg(p,.03,.1),C.a);
  return s+goalTag(G2)+ans(2,seg(p,d,d+.05));
 },
 // 11. 誤答 A（6.0）、誤答 C（約8.0）を1枚ずつ
 [K+'wrongAC']:(p,ctx)=>{
  const b=at(ctx,'スィーの',.45);
  let s=apart({len:{...LV,p:101},labs:{...VAL,p:'合力 20.2 N'},o:{n:.2,g:.2,f:.25}});
  s+=card(750,140,430,100,T2(`a=\\dfrac{30-9.8}{5.0}\\approx 4.0`,965,195,{size:34}),1,C.a);
  s+=wrongSeq(p,ctx,[['A','6.0 m/s²','30÷5.0（摩擦を 忘れた）'],['C','8.0 m/s²',['(30＋9.8)÷5.0≈8.0','（逆向きを 足した）']]],{win:[[0,b],[b,1]],opts:{...WR,y:256}});
  return s+goalTag(G2)+ans(2);
 },
 // 12. 誤答 D（5.8）
 [K+'wrongD']:(p)=>{
  let s=apart({len:{...LV,p:101},labs:{...VAL,p:'合力 20.2 N'},o:{n:.2,g:.2,f:.25}});
  s+=card(750,140,430,100,T2(`a=\\dfrac{30-9.8}{5.0}\\approx 4.0`,965,195,{size:34}),1,C.a);
  s+=wrongCard('D','5.8 m/s²',['(30−1.0)÷5.0','（摩擦を μm と した）'],{...WR,y:256,g:seg(p,.03,.08)});
  return s+goalTag(G2)+ans(2);
 },
 // ================= S3 小問3：作用・反作用のペア =================
 // 13. 左向きの摩擦と「床→箱」を黄で
 [K+'goal3']:(p)=>apart({len:LV,labs:{...VAL,f:'f 9.8 N（床→箱）'},hi:{f:seg(p,.4,.55),fl:seg(p,.4,.55)}})+goalTag(G3,{g:seg(p,.03,.15)})+ans(2),
 // 14. 主語と相手を入れかえる：「床→箱」→「箱→床」
 [K+'swap']:(p,ctx)=>{
  const a=at(ctx,'ゆかがはこにを',.55),u=seg(p,a+.05,a+.3);
  let s=apart({len:LV,labs:{...VAL,f:'f 9.8 N（床→箱）'},hi:{f:.6,fl:1}});
  let o=label('主語',870,236,{size:22,color:C.dim,anchor:'middle'})+label('相手',1060,236,{size:22,color:C.dim,anchor:'middle'});
  o+=label('床',870+190*u,284,{size:40,color:C.hi,anchor:'middle',weight:700})+label('箱',1060-190*u,284+0,{size:40,color:F2,anchor:'middle',weight:700})+label('→',965,284,{size:36,color:C.ink,anchor:'middle',weight:700});
  s+=card(750,200,430,110,o,seg(p,.03,.1),C.hi);
  s+=fade(seg(p,.03,.12),label('入れかえる',965,350,{size:26,color:C.dim,anchor:'middle',weight:700}));
  return s+goalTag(G3)+ans(2);
 },
 // 15. 箱→床 右向き 9.8 N（床の側）。摩擦の矢印と線で結ぶ。答え C
 [K+'ans3']:(p,ctx)=>{
  const d=at(ctx,'しょうもんさんの',.5);
  let s=apart({len:LV,labs:{...VAL,f:'f 9.8 N（床→箱）'},floorPair:seg(p,.05,.2),pairLab:seg(p,.15,.25)});
  s+=card(750,200,430,110,label('箱',870,284,{size:40,color:F2,anchor:'middle',weight:700})+label('→',965,284,{size:36,color:C.ink,anchor:'middle',weight:700})+label('床',1060,284,{size:40,color:C.hi,anchor:'middle',weight:700}),1,F2);
  return s+goalTag(G3)+ans(3,seg(p,d,d+.05));
 },
 // 16. 誤答 A（手が箱を引く力）。箱の 30 N と 9.8 N に「同じ 物体」
 [K+'wrongA3']:(p)=>{
  let s=apart({len:LV,labs:{...VAL,f:'f 9.8 N（床→箱）'},floorPair:1,pairLab:1,o:{n:.3,g:.3},hi:{p:seg(p,.1,.2)*.5,f:seg(p,.1,.2)*.5},same:seg(p,.3,.4)});
  s+=wrongCard('A','手が 箱を 引く力','同じ 箱が 受ける 力どうし',{...WR,y:220,g:seg(p,.03,.08)});
  return s+goalTag(G3)+ans(3);
 },
 // 17. 誤答 B（重力）、誤答 D（垂直抗力）を1枚ずつ
 [K+'wrongBD3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=apart({len:LV,labs:{...VAL,f:'f 9.8 N（床→箱）'},floorPair:1,pairLab:1,hi:{g:seg(p,.05,.12)*(1-seg(p,b-.04,b))*.6,n:seg(p,b,b+.06)*.6}});
  s+=wrongSeq(p,ctx,[['B','重力','ペアは 箱→地球'],['D','垂直抗力','向きも 主語も 違う']],{opts:{...WR,y:220}});
  return s+goalTag(G3)+ans(3);
 },
 // ================= S4 まとめ =================
 [K+'sum']:(p)=>{
  let s=apart({len:LV,labs:{...VAL,f:'f 9.8 N（床→箱）'},floorPair:seg(p,.25,.35),pairLab:seg(p,.25,.35)});
  s+=card(750,90,430,120,fade(seg(p,.05,.15),label('N＝49 → f＝9.8 N',965,138,{size:26,color:C.ink,anchor:'middle',weight:700})+label('→ 合力 20.2 N → a≈4.0',965,184,{size:26,color:C.ink,anchor:'middle',weight:700})),seg(p,.05,.15),C.F);
  s+=card(750,224,430,100,fade(seg(p,.25,.35),label('床→箱 左 9.8 N',965,264,{size:26,color:C.F,anchor:'middle',weight:700})+label('箱→床 右 9.8 N',965,302,{size:26,color:F2,anchor:'middle',weight:700})),seg(p,.25,.35),F2);
  s+=card(750,340,430,60,label('つり合い：1つの 物体',965,380,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.55),C.hi);
  s+=card(750,412,430,60,label('作用・反作用：2つの 物体',965,452,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.62,.72),C.hi);
  return s+answerRow([[1,'D','9.8 N'],[2,'B','約4.0 m/s²'],[3,'C','']]);
 },
};

// YouTube シリーズ「ガウスの法則・上級 6/6」(ys-ue-gauss-6) — 図。Stage 1200×515.
// 色：𝐄 水色、法線 𝐧 桃、面積 A 金、面電荷 σ 紫、正電荷 赤、電子 青、Φ・強調 黄、誤り 赤。
// 板（横から見た図）：帯電面は y＝SY の水平の帯。箱は x＝BX0〜BX1、上面 y＝SY−BH、下面 y＝SY+BH。
//   σ>0：面より上の 𝐄 は上向き、下は下向き。上面の外向き法線は上、下面は下 → どちらも ＋EA。側面は 𝐄 に平行で 0。
// 2枚（中級 23）：上の板 ＋σ、下の板 −σ。間では ＋板の場（離れる向き＝下）と −板の場（近づく向き＝下）が同じ向き → 1500＋1500≈3000 V/m。外では打ち消して 0。
// 導体：外の電場は右向き。電子（負）は左へ力 → 左の面に −、右の面に ＋。表面電荷の電場は中で ＋ → −（左向き）で、外の電場を打ち消す。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,poly,axes,texWidth,brace} from './anim.mjs';
import {G1,cs,card,T,L,TF,qin,ok,bad,strike,PHI,vE,vn,dA,OI,xsec} from './yt1-ue-gauss-1-diagrams.mjs';
import {charge,blobPts,closedPath} from './yt1-ui-closed-bag-1-diagrams.mjs';

const K='ue-gauss-6:';
const SIG=C.v,NEGC='#7fb3ff';
const SY=270,BX0=430,BX1=690,BH=95;
function sheet({g=1,x0=40,x1=1160,y=SY,sign=1,lab=true}={}){
 let s=rect(x0,y-7,x1-x0,14,{fill:SIG,fo:.55,stroke:SIG,sw:2,rx:3});
 for(let x=x0+40;x<x1-20;x+=80)s+=label(sign>0?'＋':'−',x,y+9,{size:24,color:sign>0?C.a:NEGC,anchor:'middle',weight:700});
 if(lab)s+=label(sign>0?'σ':'−σ',x0+4,y-18,{size:30,color:SIG,weight:700});
 return fade(g,s);
}
function fieldArrows({g=1,xs=[120,240,780,900,1040],len=70,y=SY,gap=22,dirUp=1}={}){
 let s='';for(const x of xs){s+=arrow(x,y-gap,x,y-gap-len*dirUp,{color:G1.E,w:4,head:12})+arrow(x,y+gap,x,y+gap+len*dirUp,{color:G1.E,w:4,head:12});}return fade(g,s);
}
function box({g=1,bh=BH,hlTop=0,hlBot=0,hlSide=0,hlA=0}={}){
 let s=rect(BX0,SY-bh,BX1-BX0,2*bh,{fill:'#9aabc7',fo:.05,stroke:'none'});
 s+=line(BX0,SY-bh,BX0,SY+bh,{color:hlSide?G1.hi:C.dim,w:hlSide?4:3})+line(BX1,SY-bh,BX1,SY+bh,{color:hlSide?G1.hi:C.dim,w:hlSide?4:3});
 s+=line(BX0,SY-bh,BX1,SY-bh,{color:G1.A,w:hlTop?7:4})+line(BX0,SY+bh,BX1,SY+bh,{color:G1.A,w:hlBot?7:4});
 if(hlA)s+=fade(hlA,rect(BX0,SY-9,BX1-BX0,18,{fill:SIG,fo:.0,stroke:G1.hi,sw:3,rx:3}));
 return fade(g,s);
}
const topE=(g=1,bh=BH)=>fade(g,arrow((BX0+BX1)/2-50,SY-bh,(BX0+BX1)/2-50,SY-bh-80,{color:G1.E,w:6,head:15})+label('𝐄',(BX0+BX1)/2-90,SY-bh-50,{size:28,color:G1.E,weight:700}));
const topN=(g=1,bh=BH)=>fade(g,arrow((BX0+BX1)/2+50,SY-bh,(BX0+BX1)/2+50,SY-bh-70,{color:G1.n,w:5,head:14})+label('𝐧',(BX0+BX1)/2+62,SY-bh-44,{size:28,color:G1.n,weight:700}));
const botE=(g=1,bh=BH)=>fade(g,arrow((BX0+BX1)/2-50,SY+bh,(BX0+BX1)/2-50,SY+bh+80,{color:G1.E,w:6,head:15})+label('𝐄',(BX0+BX1)/2-90,SY+bh+60,{size:28,color:G1.E,weight:700}));
const botN=(g=1,bh=BH)=>fade(g,arrow((BX0+BX1)/2+50,SY+bh,(BX0+BX1)/2+50,SY+bh+70,{color:G1.n,w:5,head:14})+label('𝐧',(BX0+BX1)/2+62,SY+bh+50,{size:28,color:G1.n,weight:700}));
const sideCard=(inner,g=1,stroke)=>card(800,50,380,420,inner,g,stroke);
// spherical shell with charges
function shell(cx,cy,R,{g=1,n=12,inner=0,ri=0}={}){
 let s=ring(cx,cy,R,{color:SIG,w:6});
 for(let i=0;i<n;i++){const a=i*2*Math.PI/n;s+=label('＋',cx+R*Math.cos(a),cy+R*Math.sin(a)+8,{size:22,color:C.a,anchor:'middle',weight:700});}
 if(inner)s+=fade(inner,ring(cx,cy,ri,{color:G1.A,w:3,dash:'8 6'}));
 return fade(g,s);
}
const elec=(x,y,r=13)=>ring(x,y,r,{color:NEGC,w:3,fill:'#1b2a48'})+label('−',x,y+r*.4,{size:r*1.2,color:NEGC,anchor:'middle',weight:700});
const MX0=360,MX1=760,MY0=120,MY1=400; // conductor block
function block(){return rect(MX0,MY0,MX1-MX0,MY1-MY0,{fill:'#7f8fa8',fo:.22,stroke:'#c9d6ee',sw:3,rx:8})+label('導体',MX0,MY0-14,{size:26,color:'#c9d6ee'});}
function extField(g=1){let s='';for(const y of [160,260,360]){s+=arrow(60,y,MX0-20,y,{color:G1.E,w:4,head:12})+arrow(MX1+20,y,1140,y,{color:G1.E,w:4,head:12});}return fade(g,s)+fade(g,label('外の 電場',60,130,{size:24,color:G1.E}));}

export const ytUeGauss6Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  let s=sheet({x0:60,x1:740})+fieldArrows({xs:[140,300,460,620],g:seg(p,.1,.3)});
  s+=card(800,90,370,300,L('広い 板',985,150,{size:28,weight:700})+TF('E=\\frac{\\sigma}{2\\varepsilon_0}',985,250,{size:44,frac:true})+L('なぜ 2？',985,350,{size:34,color:G1.hi,weight:700}),seg(p,.2,.4),G1.hi);
  return s;
 },
 [K+'ask2']:(p)=>{
  let s=sheet({x0:60,x1:740,g:1-seg(p,.4,.55)})+fieldArrows({xs:[140,300,460,620],g:1-seg(p,.4,.55)});
  s+=fade(seg(p,.45,.6),shell(230,262,150)+label('E ＝ 0 ？',230,272,{size:30,color:G1.hi,weight:700,anchor:'middle'})+rect(470,130,260,260,{fill:'#7f8fa8',fo:.22,stroke:'#c9d6ee',sw:3,rx:8})+label('E ＝ 0 ？',600,272,{size:30,color:G1.hi,weight:700,anchor:'middle'})+L('球殻',230,470,{size:26})+L('導体',600,470,{size:26}));
  s+=card(800,90,370,300,L('σ/(2ε₀) を',985,190,{size:30,weight:700})+L('導けるか？',985,260,{size:30,color:G1.hi,weight:700}),1-seg(p,.4,.55),G1.hi);
  s+=fade(seg(p,.55,.7),card(800,90,370,300,L('中が 0 に',985,190,{size:30,weight:700})+L('なるのは なぜ？',985,260,{size:30,color:G1.hi,weight:700}),1,G1.hi));
  return s;
 },
 [K+'recap']:(p)=>{
  let s=sheet({x0:60,x1:740})+fieldArrows({xs:[140,300,460,620]});
  s+=card(780,50,400,420,L('中級 23（結果として 使った）',980,105,{size:24,color:C.dim})+TF('E=\\frac{\\sigma}{2\\varepsilon_0}',980,200,{size:44,frac:true})
   +fade(seg(p,.4,.55),L('10 cm 四方の 板',980,300,{size:26})+L('約 1500 V/m',980,370,{size:32,color:G1.hi,weight:700}))
   +fade(seg(p,.6,.75),L('導出は 上級へ',980,435,{size:24,color:C.dim})),1);
  return s;
 },
 [K+'tools']:(p)=>{
  let s=card(80,70,500,370,L('ガウスの法則',330,135,{size:30,color:G1.hi,weight:700})+qin(`${OI}${vE}\\cdot${vn}\\,${dA}`,330,270,{size:40}),1,G1.hi);
  s+=card(620,70,500,370,L('対称性',870,135,{size:30,color:G1.E,weight:700})+L('E を 積分の 外へ',870,240,{size:28})+L('点：1/r²　線：1/r',870,320,{size:28,color:C.dim})+fade(seg(p,.5,.65),L('今回：面',870,395,{size:30,color:SIG,weight:700})),seg(p,.15,.3),G1.E);
  return s;
 },
 // ===== S2 広い板 =====
 [K+'sheet']:(p)=>{
  let s=poly([[120,350],[700,350],[880,190],[300,190]],{fill:SIG,fo:.22,stroke:SIG,sw:3});
  for(const [x,y] of [[330,220],[470,220],[610,220],[740,220],[260,280],[400,280],[540,280],[680,280],[200,330],[340,330],[480,330],[620,330]])s+=label('＋',x,y+8,{size:24,color:C.a,anchor:'middle',weight:700});
  s+=label('…',100,355,{size:30,color:SIG,anchor:'end'})+label('…',900,195,{size:30,color:SIG});
  s+=card(880,250,300,210,L('面密度 σ（シグマ）',1030,310,{size:24,weight:700})+L('面積1 あたりの 電荷',1030,360,{size:22})+L('単位 C/m²',1030,410,{size:24,color:C.dim}),seg(p,.4,.55));
  s+=fade(seg(p,.05,.2),L('無限に 広い・一様・薄い',500,450,{size:26,color:C.dim}));
  return s;
 },
 [K+'sym']:(p)=>{
  let s=sheet()+L('横から 見た 図',600,70,{size:24,color:C.dim});
  s+=fade(seg(p,.05,.3),arrow(300,SY+130,520,SY+130,{color:C.dim,w:3,head:12})+label('ずらしても 同じ',540,SY+140,{size:24,color:C.dim}));
  s+=fieldArrows({g:seg(p,.5,.7),xs:[120,280,440,600,760,920,1080]});
  s+=fade(seg(p,.6,.75),label('面に 垂直',1000,120,{size:28,color:G1.E,weight:700}));
  return s;
 },
 [K+'sym2']:(p)=>{
  let s=sheet()+fieldArrows({xs:[120,280,440,600,760]});
  s+=fade(seg(p,.05,.25),line(40,SY,1160,SY,{color:G1.hi,w:2,dash:'10 8'})+label('鏡（上下を 入れ替える）',860,SY-30,{size:24,color:G1.hi}));
  s+=fade(seg(p,.3,.45),label('同じ 強さ・逆向き',600,90,{size:28,color:G1.E,weight:700,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),label('σ > 0：面から 離れる 向き',600,470,{size:28,color:G1.hi,weight:700,anchor:'middle'}));
  return s;
 },
 [K+'box']:(p)=>{
  let s=sheet()+fieldArrows({xs:[120,260,860,1000,1120]});
  s+=box({g:seg(p,.05,.25)});
  s+=fade(seg(p,.25,.4),label('上の 面：面積 A',BX1+14,SY-BH-10,{size:24,color:G1.A})+label('下の 面：面積 A',BX1+14,SY+BH+30,{size:24,color:G1.A}));
  s+=fade(seg(p,.55,.7),box({hlA:1})+label('中の 電荷 σA',BX0+20,SY-20,{size:26,color:G1.hi,weight:700}));
  return s;
 },
 [K+'top']:(p)=>{
  let s=sheet()+box({hlTop:1});
  s+=topE(seg(p,.05,.25))+topN(seg(p,.25,.45));
  s+=sideCard(L('上の 面',990,110,{size:28,color:G1.A,weight:700})+L('𝐄：上向き',990,190,{size:26,color:G1.E})+L('𝐧：上向き（外）',990,245,{size:26,color:G1.n})+TF(`${PHI}_{\\uparrow}=+EA`,990,350,{size:42,box:true,g:seg(p,.55,.7)}),1);
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=sheet()+box({hlBot:1})+topE()+topN();
  s+=botE(seg(p,.05,.25));
  s+=sideCard(L('下の 面',990,110,{size:28,color:G1.A,weight:700})+L('𝐄：下向き',990,190,{size:26,color:G1.E})+L('プラス？ マイナス？',990,320,{size:32,color:G1.hi,weight:700}),seg(p,.2,.35),G1.hi);
  return s;
 },
 [K+'bottom']:(p)=>{
  let s=sheet()+box({hlBot:1})+topE()+topN()+botE()+botN(seg(p,.05,.25));
  s+=sideCard(L('下の 面',990,110,{size:28,color:G1.A,weight:700})+L('𝐄：下向き',990,190,{size:26,color:G1.E})+L('𝐧：下向き（外）',990,245,{size:26,color:G1.n})+TF(`${PHI}_{\\downarrow}=+EA`,990,340,{size:42,box:true,g:seg(p,.2,.35)})+fade(seg(p,.55,.7),L('符号は 外向きの 法線で 決まる',990,430,{size:22,color:G1.hi})),1);
  return s;
 },
 [K+'sides']:(p)=>{
  let s=sheet()+box({hlSide:seg(p,.0,.2)})+topE()+botE();
  s+=fade(seg(p,.05,.2),arrow(BX0+30,SY-40,BX0+30,SY-90,{color:G1.E,w:4,head:12})+arrow(BX1-30,SY+40,BX1-30,SY+90,{color:G1.E,w:4,head:12})+label('側面：𝐄 は 面に 沿う → 0',60,SY+BH+90,{size:24,color:C.dim}));
  s+=sideCard(TF('+EA',990,120,{size:36})+TF('+EA',990,190,{size:36})+TF('+0',990,260,{size:36})+line(880,300,1100,300,{color:C.dim,w:2})+TF(`${PHI}=2EA`,990,370,{size:44,box:true,g:seg(p,.45,.6)}),1);
  return s;
 },
 [K+'solve']:(p)=>{
  let s=TF('2EA=\\frac{\\sigma A}{\\varepsilon_0}',600,110,{size:52,frac:true});
  s+=fade(seg(p,.25,.4),L('両辺 ÷ 2A',600,215,{size:28,color:G1.hi,weight:700}));
  s+=TF('E=\\frac{\\sigma\\cancel{A}}{2\\varepsilon_0\\cancel{A}}',380,350,{size:52,frac:true,g:seg(p,.35,.55)});
  s+=TF('=\\frac{\\sigma}{2\\varepsilon_0}',800,350,{size:58,frac:true,box:true,g:seg(p,.6,.75)});
  return s;
 },
 [K+'two']:(p)=>{
  let s=sheet()+box({hlTop:1,hlBot:1});
  s+=fade(seg(p,.05,.2),rect(BX0,SY-10,BX1-BX0,20,{fill:SIG,fo:.0,stroke:G1.hi,sw:4,rx:3})+label('電荷を 数える 面積：A',BX0-20,SY+40,{size:24,color:SIG,weight:700,anchor:'end'}));
  s+=fade(seg(p,.35,.5),label('電気束が 出る 面積：A ＋ A ＝ 2A',BX0-20,SY-BH-20,{size:24,color:G1.A,weight:700,anchor:'end'}));
  s+=topE(seg(p,.35,.5))+botE(seg(p,.35,.5));
  s+=sideCard(TF('E=\\frac{\\sigma A}{\\varepsilon_0\\,(2A)}',990,200,{size:40,frac:true})+L('分母の 2 ＝ 上と 下の 2面',990,350,{size:24,color:G1.hi,weight:700}),seg(p,.6,.75));
  return s;
 },
 [K+'dist']:(p)=>{
  const bh=BH*(1+.8*Math.sin(Math.PI*seg(p,.05,.9)));
  let s=sheet()+box({bh})+topE(1,bh)+botE(1,bh);
  s+=sideCard(L('箱の 高さを 変えても',990,140,{size:26})+L('面積 A：同じ',990,220,{size:26,color:G1.A})+L('中の 電荷 σA：同じ',990,280,{size:26,color:SIG})+L('E は 距離に よらない',990,380,{size:28,color:G1.hi,weight:700}),seg(p,.3,.45));
  return s;
 },
 [K+'ideal']:(p)=>{
  let s=rect(150,330,300,14,{fill:SIG,fo:.55,stroke:SIG,sw:2,rx:3})+label('有限の 板',300,385,{size:26,color:SIG,anchor:'middle'});
  for(let i=0;i<9;i++){const a=-Math.PI/2+(i-4)*0.3;s+=arrow(300+30*Math.cos(a),322+30*Math.sin(a),300+190*Math.cos(a),322+190*Math.sin(a),{color:G1.E,w:3,head:10,g:seg(p,.3,.5)});}
  s+=fade(seg(p,.35,.5),label('遠くでは 広がって 弱まる',300,460,{size:24,color:C.dim,anchor:'middle'}));
  s+=card(620,90,550,320,L('E ＝ σ/(2ε₀) は',895,170,{size:28})+L('無限に 広い 面の 理想化',895,240,{size:28,color:G1.hi,weight:700})+fade(seg(p,.55,.7),L('板から 十分 遠くでは 使えない',895,330,{size:26,color:G1.bad,weight:700})),1);
  return s;
 },
 [K+'num']:(p)=>{
  let s=card(60,50,1080,420,L('中級 23 の 板',380,110,{size:28,color:C.dim})+TF('\\sigma=2.66\\times10^{-8}\\ \\mathrm{C/m^2}',730,110,{size:34})
   +TF('E=\\frac{2.66\\times10^{-8}}{2\\times 8.85\\times10^{-12}}',600,240,{size:46,frac:true,g:seg(p,.1,.3)})
   +TF('\\approx 1500\\ \\mathrm{V/m}',600,385,{size:50,box:true,g:seg(p,.5,.65)})
   +fade(seg(p,.65,.8),label('中級と 一致',880,395,{size:28,color:G1.ok,weight:700})),1);
  return s;
 },
 [K+'num2']:(p)=>{
  const y1=170,y2=370;
  let s=sheet({y:y1,x0:80,x1:760,lab:false})+sheet({y:y2,x0:80,x1:760,sign:-1,lab:false});
  s+=label('＋σ',790,y1+10,{size:28,color:SIG,weight:700})+label('−σ',790,y2+10,{size:28,color:SIG,weight:700});
  // between: both downward
  for(const x of [180,420,660])s+=fade(seg(p,.1,.3),arrow(x,y1+20,x,y2-20,{color:G1.E,w:6,head:15}));
  s+=fade(seg(p,.1,.3),label('1500 ＋ 1500',300,275,{size:26,color:G1.E,weight:700,anchor:'middle'}));
  s+=fade(seg(p,.4,.55),label('外：打ち消して 0',420,70,{size:26,color:C.dim,anchor:'middle'})+label('外：打ち消して 0',420,470,{size:26,color:C.dim,anchor:'middle'}));
  s+=card(880,130,300,250,L('板の 間',1030,190,{size:26})+L('約 3000 V/m',1030,270,{size:32,color:G1.hi,weight:700})+L('中級の コンデンサ',1030,340,{size:22,color:C.dim}),seg(p,.3,.45));
  return s;
 },
 // ===== S3 球殻 =====
 [K+'shell']:(p)=>{
  let s=shell(330,262,190,{inner:seg(p,.45,.65),ri:110});
  s+=fade(seg(p,.5,.65),line(330,262,330+110*Math.cos(-.6),262+110*Math.sin(-.6),{color:G1.A,w:2})+label('r',395,215,{size:26,color:G1.A,weight:700}));
  s+=card(700,110,470,290,L('一様な 薄い 球殻',935,180,{size:28,weight:700})+L('外に ほかの 電荷は ない',935,245,{size:26,color:C.dim})+fade(seg(p,.5,.65),L('内側に 同じ 中心の 球',935,320,{size:26,color:G1.A,weight:700})),1);
  return s;
 },
 [K+'shell0']:(p)=>{
  let s=shell(330,262,190,{inner:1,ri:110});
  s+=card(700,110,470,290,L('中の 電荷 ＝ 0',935,190,{size:30,weight:700})+TF(`${PHI}=0`,935,300,{size:48,box:true,g:seg(p,.3,.45)}),1);
  return s;
 },
 [K+'notenough']:(p)=>{
  let s=xsec(250,190,110,{dr:2.0,ths:[0,Math.PI/4,Math.PI/2,3*Math.PI/4,Math.PI,-Math.PI/4,-Math.PI/2,-3*Math.PI/4],kE:60,axis:false,labC:false,labO:false});
  s+=L('3本目：外の 電荷の 球',250,480,{size:24,color:C.dim});
  s+=card(560,80,610,350,TF(`${PHI}=0`,865,170,{size:46})+fade(seg(p,.2,.35),TF('\\not\\Rightarrow',865,250,{size:46}))+fade(seg(p,.2,.35),TF(`${vE}=\\mathbf{0}`,865,330,{size:46}))+strike(760,250,970,250,seg(p,.4,.55))+fade(seg(p,.55,.7),L('𝐄 は 0 ではなかった',865,405,{size:28,color:G1.bad,weight:700})),1);
  return s;
 },
 [K+'symadd']:(p)=>{
  let s=shell(330,262,190,{inner:1,ri:110});
  for(let i=0;i<8;i++){const a=i*Math.PI/4;s+=arrow(330+110*Math.cos(a),262+110*Math.sin(a),330+150*Math.cos(a),262+150*Math.sin(a),{color:G1.E,w:4,head:12,g:seg(p,.3,.5)*.6});}
  s+=fade(seg(p,.3,.5),label('？',330,275,{size:40,color:G1.E,anchor:'middle',weight:700}));
  s+=card(700,110,470,290,L('＋ 球対称性',935,180,{size:30,color:G1.hi,weight:700})+L('電場が あれば 半径方向',935,250,{size:26})+L('同じ r なら 同じ 強さ',935,310,{size:26}),seg(p,.05,.2),G1.hi);
  return s;
 },
 [K+'shellsolve']:(p)=>{
  let s=shell(330,262,190,{inner:1,ri:110});
  s+=card(660,70,510,370,TF('E\\times 4\\pi r^2=0',915,160,{size:44})+fade(seg(p,.3,.45),L('4πr² ≠ 0',915,250,{size:28,color:C.dim}))+TF('E=0',915,350,{size:52,box:true,g:seg(p,.5,.65)}),1);
  return s;
 },
 [K+'shellcond']:(p)=>{
  let s=shell(330,262,190,{inner:1,ri:110});
  s+=card(660,70,510,190,L('中の 電荷 0 ✓',915,140,{size:28,color:G1.ok})+L('球対称 ✓',915,200,{size:28,color:G1.ok}),1);
  s+=fade(seg(p,.5,.65),charge(380,230,1,16)+card(660,290,510,150,L('中に 別の 電荷 → 使えない',915,375,{size:28,color:G1.bad,weight:700}),1,G1.bad));
  return s;
 },
 [K+'shellout']:(p)=>{
  let s=shell(330,262,110);
  s+=fade(seg(p,.05,.2),ring(330,262,200,{color:G1.A,w:3,dash:'8 6'}));
  for(let i=0;i<8;i++){const a=i*Math.PI/4+Math.PI/8;s+=arrow(330+200*Math.cos(a),262+200*Math.sin(a),330+250*Math.cos(a),262+250*Math.sin(a),{color:G1.E,w:4,head:12,g:seg(p,.2,.4)});}
  s+=card(660,70,510,370,TF('E\\times 4\\pi r^2=\\frac{Q}{\\varepsilon_0}',915,170,{size:42,frac:true,g:seg(p,.2,.35)})+TF('E=\\frac{Q}{4\\pi\\varepsilon_0 r^2}',915,310,{size:42,frac:true,box:true,g:seg(p,.45,.6)})+fade(seg(p,.6,.75),L('中心の 点電荷と 同じ',915,410,{size:26,color:G1.hi,weight:700})),1);
  return s;
 },
 [K+'gravity']:(p)=>{
  let s=`<circle cx="300" cy="262" r="150" fill="#5a7bb5" fill-opacity=".35" stroke="#9fc0ff" stroke-width="3"/>`+label('天体（球）',300,445,{size:26,anchor:'middle'});
  s+=fade(seg(p,.4,.55),dot(300,262,8,G1.hi)+label('全質量 M',300,240,{size:24,color:G1.hi,anchor:'middle',weight:700}));
  s+=dot(620,170,10,C.ink)+arrow(608,175,500,212,{color:C.F,w:5,head:14,g:seg(p,.1,.3)})+label('引力',560,240,{size:24,color:C.F});
  s+=card(720,90,450,330,L('万有引力も 逆2乗',945,160,{size:28,weight:700})+L('同じ 計算が できる',945,225,{size:26})+fade(seg(p,.4,.55),L('外では 中心に',945,310,{size:28,color:G1.hi,weight:700})+L('全質量が あるように 引く',945,365,{size:28,color:G1.hi,weight:700})),1);
  return s;
 },
 // ===== S4 導体 =====
 [K+'cond']:(p)=>{
  let s=block();
  const es=[[430,200],[560,300],[680,180],[470,340],[640,350],[520,170]];
  for(const [x,y] of es)s+=elec(x,y);
  s+=card(800,90,370,330,L('静電平衡',985,160,{size:30,color:G1.hi,weight:700})+L('自由に 動ける 電子の',985,240,{size:26})+L('移動が 落ち着いた 状態',985,290,{size:26}),seg(p,.3,.45),G1.hi);
  s+=fade(seg(p,.05,.2),L('自由に 動ける 電子',560,460,{size:24,color:NEGC}));
  return s;
 },
 [K+'cond2']:(p)=>{
  let s=extField()+block();
  for(const y of [190,330])s+=arrow(420,y,700,y,{color:G1.E,w:4,head:12,g:seg(p,.05,.2)});
  s+=fade(seg(p,.05,.2),label('もし 中に 𝐄 が 残ったら',MX0+20,MY1+40,{size:24,color:G1.E}));
  for(const [x,y] of [[500,260],[640,260]]){s+=elec(x,y)+arrow(x-16,y,x-80,y,{color:C.F,w:4,head:12,g:seg(p,.3,.45)});}
  s+=fade(seg(p,.35,.5),label('電子は 逆向きに 力',560,232,{size:24,color:C.F,anchor:'middle'}));
  return s;
 },
 [K+'cond3']:(p)=>{
  let s=extField()+block();
  const m=seg(p,.0,.35);
  for(const y of [150,210,270,330,380])s+=elec(MX0+18+(1-m)*120,y,11);
  for(const y of [150,210,270,330,380])s+=fade(m,label('＋',MX1-18,y+9,{size:24,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),arrow(680,300,440,300,{color:C.v,w:5,head:14})+label('表面の 電荷の 電場',560,340,{size:24,color:C.v,anchor:'middle'}));
  s+=fade(seg(p,.4,.55)*(1-seg(p,.7,.85)),arrow(440,230,680,230,{color:G1.E,w:5,head:14}));
  s+=fade(seg(p,.7,.85),label('打ち消し 終わった ＝ 静電平衡',560,MY1+45,{size:26,color:G1.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'cond4']:(p)=>{
  let s=extField(.5)+block();
  for(const y of [150,210,270,330,380])s+=elec(MX0+18,y,11)+label('＋',MX1-18,y+9,{size:24,color:C.a,anchor:'middle',weight:700});
  s+=label('E ＝ 0',560,280,{size:40,color:G1.hi,weight:700,anchor:'middle'});
  s+=fade(seg(p,.3,.45),card(60,420,1080,80,label('球殻：対称性から',140,470,{size:26,color:SIG,weight:700})+label('導体：電子の 動きから',520,470,{size:26,color:NEGC,weight:700})+label('結論は 同じ・理由は 別',870,470,{size:26,color:G1.hi,weight:700}),1));
  return s;
 },
 [K+'cond5']:(p)=>{
  let s=rect(260,200,520,110,{fill:'#7f8fa8',fo:.22,stroke:'#c9d6ee',sw:3,rx:8})+label('電流が 流れる 抵抗',520,180,{size:26,anchor:'middle'});
  s+=line(80,255,260,255,{color:C.F,w:5})+line(780,255,1000,255,{color:C.F,w:5})+arrow(100,225,220,225,{color:C.F,w:4,head:12})+label('I',150,212,{size:26,color:C.F,weight:700});
  s+=arrow(330,255,710,255,{color:G1.E,w:6,head:16,g:seg(p,.1,.3)})+fade(seg(p,.1,.3),label('𝐄 ≠ 0',520,290,{size:28,color:G1.E,weight:700,anchor:'middle'}));
  s+=fade(seg(p,.4,.55),card(300,360,600,110,L('静電平衡 ではない → E ＝ 0 は 使えない',600,425,{size:28,color:G1.bad,weight:700}),1,G1.bad));
  return s;
 },
 // ===== S5 まとめ =====
 [K+'sum1']:(p)=>{
  const bx=(x,t1,t2,n,g)=>fade(g,rect(x-170,110,340,250,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:14})+L(t1,x,190,{size:30,weight:700})+L(t2,x,260,{size:26,color:C.dim})+L(n,x,330,{size:24,color:G1.hi}));
  let s=bx(210,'ずれた 球','面を 取り替えず 積分','1〜3本目',1)+fade(seg(p,.15,.25),arrow(385,235,425,235,{color:C.dim,w:3,head:12}))+bx(600,'立体角','どんな 形の 面へ','4本目',seg(p,.15,.3));
  s+=fade(seg(p,.35,.45),arrow(775,235,815,235,{color:C.dim,w:3,head:12}))+bx(990,'重ね合わせ','何個の 電荷へ','5本目',seg(p,.35,.5));
  s+=fade(seg(p,.6,.75),L('出発点：クーロンの法則 ＋ 重ね合わせ',600,440,{size:28,color:G1.hi,weight:700}));
  return s;
 },
 [K+'sum2']:(p)=>{
  const A=axes({x:110,y:440,w:560,h:330,xmax:4,ymax:4,g:1});
  let s=A.svg+A.plot(r=>1/(r*r),{from:.5,to:4,color:C.a,w:4})+fade(seg(p,.2,.35),A.plot(r=>1/r,{from:.25,to:4,color:C.v,w:4}))+fade(seg(p,.4,.55),A.plot(r=>1,{from:0,to:4,color:G1.hi,w:4}));
  s+=label('r',A.X(4)+40,A.Y(0)+8,{size:26,color:C.dim})+label('E',A.X(0)+10,A.Y(4)-6,{size:26,color:C.dim});
  s+=card(720,60,450,400,L('点：1/r²',945,140,{size:30,color:C.a,weight:700})+fade(seg(p,.2,.35),L('線：1/r',945,240,{size:30,color:C.v,weight:700}))+fade(seg(p,.4,.55),L('面：距離に よらない',945,340,{size:30,color:G1.hi,weight:700}))+L('対称性で E を 取り出す',945,420,{size:24,color:C.dim}),1);
  return s;
 },
 [K+'sum3']:(p)=>{
  let s=card(60,60,520,300,L('球殻の 中',320,120,{size:30,weight:700})+L('対称性 → E ＝ 0',320,220,{size:28,color:SIG})+shell(320,300,0,{g:0}),1);
  s+=card(620,60,520,300,L('導体の 中',880,120,{size:30,weight:700})+L('静電平衡 → E ＝ 0',880,220,{size:28,color:NEGC}),seg(p,.15,.3));
  s+=fade(seg(p,.45,.6),card(160,390,880,100,TF(`${PHI}=0\\ \\not\\Rightarrow\\ ${vE}=\\mathbf{0}`,600,450,{size:40}),1,G1.bad));
  return s;
 },
 [K+'next0']:(p)=>{
  let s=charge(300,262,1,22)+charge(560,262,-1,22);
  for(let i=0;i<8;i++){const a=i*Math.PI/4+Math.PI/8;s+=arrow(300+30*Math.cos(a),262+30*Math.sin(a),300+100*Math.cos(a),262+100*Math.sin(a),{color:G1.E,w:4,head:12,g:seg(p,.2,.5)});}
  s+=card(760,140,410,230,L('電荷の 配置',965,210,{size:28})+L('↓',965,260,{size:28,color:C.dim})+L('電場',965,315,{size:30,color:G1.E,weight:700}),1);
  return s;
 },
 [K+'next']:(p)=>{
  let s='';
  const cx=330,cy=262;
  for(const [r,v] of [[60,'4 V'],[110,'3 V'],[165,'2 V'],[225,'1 V']])s+=`<ellipse cx="${cx}" cy="${cy}" rx="${r*1.25}" ry="${r*.85}" fill="none" stroke="${C.v}" stroke-width="3" opacity=".8"/>`+label(v,cx+r*1.25+6,cy-6,{size:22,color:C.v});
  s+=fade(seg(p,.3,.5),label('？',cx+70,cy-120,{size:44,color:G1.E,weight:700,anchor:'middle'}));
  s+=card(760,110,410,290,L('電位の 地図',965,180,{size:28,color:C.v,weight:700})+L('↓',965,235,{size:28,color:C.dim})+L('3次元の 各点の 電場',965,290,{size:28,color:G1.E,weight:700})+L('どう 取り出す？',965,355,{size:30,color:G1.hi,weight:700}),seg(p,.2,.35),G1.hi);
  return s;
 },
};

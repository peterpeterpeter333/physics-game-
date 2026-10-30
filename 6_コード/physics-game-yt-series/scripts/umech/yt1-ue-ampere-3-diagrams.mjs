// YouTube シリーズ「アンペールの法則・上級 3/3」(ys-ue-ampere-3) — 図。Stage 1200×515.
// 色：𝐁 橙、電流 I 緑、一歩 d𝐫 金、長方形の辺 下＝黄・右＝桃・上＝灰・左＝桃、L 白、強調 黄。
// 断面図：コイルの軸は画面の横（y＝AY）。上の列（y＝TY）は ⊙、下の列（y＝BY）は ⊗。内側の 𝐁 は右向き。
//   ⊙ の磁場は反時計回り（circ sense +1）→ そのすぐ下で右向き。⊗ は時計回り（sense −1）→ そのすぐ上で右向き。
//   長方形は反時計回り：下の辺 右向き、右の辺 上向き、上の辺 左向き、左の辺 下向き → 親指は手前 → ⊙ が正。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,texWidth,highlight} from './anim.mjs';
import {CB,CI,RAD,RH,HI,BAD,INK,DIM,cs,T,card,outSym,inSym,wire,head,circ,L,TF,mixed,bOut} from './yt1-ue-ampere-1-diagrams.mjs';

const K='ue-ampere-3:';
const SC=C.t,GR='#8da0bf',NC=C.x;
const Bv=cs(CB,'\\mathbf{B}'),Bs=cs(CB,'B'),dr=cs(SC,'d\\mathbf{r}'),Ic=cs(CI,'I'),nn=cs(NC,'n');
const TY=170,BY=400,AY=285,X0=70,DX=45,NW=13;
const wx=i=>X0+i*DX;
const RX0=235,RX1=415,RB=240,RT=95;// rectangle
function rows({g=1,gTop=1,gBot=1,axis=1,lab=0}={}){
 let s='';
 if(axis)s+=line(40,AY,640,AY,{color:DIM,w:2,dash:'10 8'})+label('軸',650,AY+8,{size:22,color:DIM});
 for(let i=0;i<NW;i++){s+=outSym(wx(i),TY,15,CI,gTop)+inSym(wx(i),BY,15,CI,gBot);}
 if(lab)s+=fade(gTop,label('⊙ 手前向き',640,TY-26,{size:22,color:CI,anchor:'end'}))+fade(gBot,label('⊗ 奥向き',640,BY+44,{size:22,color:CI,anchor:'end'}));
 return fade(g,s);
}
function insideB(g=1,n=4){let s='';for(const y of [212,325,365]){for(let k=0;k<n;k++){const x=95+k*140;s+=arrow(x,y,x+95,y,{color:CB,w:4,head:14});}}return fade(g,s);}
function rectC({g=1,hl=-1,dim=0,bottom=RB,heads=1,labs=0}={}){
 const cols=[HI,RH,GR,RH];
 const sides=[[[RX0,bottom],[RX1,bottom]],[[RX1,bottom],[RX1,RT]],[[RX1,RT],[RX0,RT]],[[RX0,RT],[RX0,bottom]]];
 let s='';
 sides.forEach(([a,b],i)=>{const on=hl<0||hl===i;const op=on?1:1-.65*dim;
  s+=fade(op,line(a[0],a[1],b[0],b[1],{color:cols[i],w:on&&hl===i?7:4.5}));
  if(heads){const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;s+=fade(op,head(mx+(b[0]-a[0])*.06,my+(b[1]-a[1])*.06,b[0]-a[0],b[1]-a[1],{color:cols[i],L:18}));}
 });
 if(labs){s+=label('下',(RX0+RX1)/2,bottom+30,{size:22,color:HI,anchor:'middle'})+label('右',RX1+12,RT+30,{size:22,color:RH})+label('上',(RX0+RX1)/2,RT-12,{size:22,color:GR,anchor:'middle'})+label('左',RX0-12,RT+30,{size:22,color:RH,anchor:'end'});}
 return fade(g,s);
}
function enclosed(g=1){let s='';for(let i=0;i<NW;i++){const x=wx(i);if(x>RX0&&x<RX1)s+=ring(x,TY,24,{color:HI,w:3});}return fade(g,s);}
const cardR=(inner,g=1,stroke=C.faint)=>card(680,60,480,400,inner,g,stroke);
const LAW=`\\oint ${Bv}\\cdot${dr}=\\mu_0${Ic}`;

export const ytUeAmpere3Diagrams={
 // ===== S1 =====
 [K+'prev']:(p)=>{
  let s=arrow(60,330,600,330,{color:CI,w:6,head:18})+label('I',585,310,{size:28,color:CI,weight:700})+bOut(330,170,22)+line(330,192,330,330,{color:INK,w:2.5,dash:'8 7'})+label('r',340,270,{size:28,color:INK,weight:700});
  for(let i=0;i<10;i++)s+=line(90+i*50,320,90+i*50,340,{color:INK,w:2});
  s+=card(680,110,480,280,L('前回：欠片を 足して',920,160,{size:26,color:DIM})+TF(`${Bs}=\\dfrac{\\mu_0${Ic}}{2\\pi r}`,920,275,{size:54,box:true,frac:true}),seg(p,.1,.3));
  return s;
 },
 [K+'ask']:(p)=>{
  let s='';const x0=80,yt=150,yb=380;
  for(let i=0;i<11;i++){const x=x0+20+i*45;s+=`<ellipse cx="${x}" cy="${(yt+yb)/2}" rx="15" ry="${(yb-yt)/2}" fill="none" stroke="${CI}" stroke-width="3.5"/>`;}
  s+=fade(seg(p,.3,.5),draw([[x0+150,yb-60],[x0+330,yb-60],[x0+330,yt-55],[x0+150,yt-55],[x0+150,yb-60]],1,{color:SC,w:3.5,dash:'9 7'}));
  s+=card(680,90,480,330,L('前回の 最後の 問い',920,140,{size:24,color:DIM})+L('密に 巻いた 長い コイル',920,215,{size:28,color:INK})+L('中の 磁場は？',920,285,{size:34,color:CB,weight:700})+L('長方形の 輪で',920,360,{size:28,color:SC,weight:700}),1,HI);
  return s;
 },
 [K+'recall']:(p)=>{
  let s=rows({lab:1,gTop:seg(p,.45,.6),gBot:seg(p,.25,.4),axis:seg(p,.05,.2)});
  s+=cardR(L('中級：軸に 沿って 切る',920,110,{size:26,color:DIM})+fade(seg(p,.25,.4),L('片側の 列：奥向き ⊗',920,200,{size:28,color:INK}))+fade(seg(p,.45,.6),L('反対側の 列：手前向き ⊙',920,270,{size:28,color:INK})),1);
  return s;
 },
 [K+'count0']:(p)=>{
  let s=rows({})+rectC({heads:0,g:seg(p,.05,.2)})+enclosed(seg(p,.2,.35));
  s+=cardR(L('囲む 本数',920,110,{size:26,color:DIM})+mixed(['長さ',`$\\times${nn}$`],920,200,{size:40,weight:700})
   +fade(seg(p,.55,.7),mixed([`$${nn}$`,'：1 m あたりの 巻数'],920,320,{size:28,color:NC,weight:700})),1);
  return s;
 },
 [K+'plan']:(p)=>{
  const items=['① コイルの 中と 外の 磁場','② 長方形の 4辺を 1辺ずつ','③ 貫く 電流を 数える','④ 数で 確かめる・限界'];
  let s=card(200,40,800,340,L('今回の 道筋',600,90,{size:26,color:DIM}),1);
  items.forEach((t,i)=>{s+=fade(seg(p,.05+i*.1,.15+i*.1),label(t,290,165+i*58,{size:30,color:INK,weight:700}));});
  s+=TF(`${Bs}=\\mu_0${nn}${Ic}\\ \\ ?`,600,450,{size:46,g:seg(p,.5,.7)});
  return s;
 },
 // ===== S2 中と外 =====
 [K+'cut']:(p)=>{
  let s=rows({lab:1,gTop:seg(p,.45,.6),gBot:seg(p,.7,.85)});
  s+=cardR(L('軸を 含む 面で 切った 断面',920,110,{size:26,color:DIM})+fade(seg(p,.45,.6),L('上の 列：⊙ 手前向き',920,210,{size:30,color:CI,weight:700}))+fade(seg(p,.7,.85),L('下の 列：⊗ 奥向き',920,290,{size:30,color:CI,weight:700})),1);
  return s;
 },
 [K+'top']:(p)=>{
  const i=6,x=wx(i);
  let s=rows({});
  s+=circ(x,TY,36,1,{g:seg(p,.1,.35),w:3.5,nh:4,phase:45});
  s+=fade(seg(p,.5,.7),arrow(x-40,TY+70,x+40,TY+70,{color:CB,w:6,head:16})+label('右向き',x+50,TY+78,{size:24,color:CB,weight:700}));
  s+=fade(.9,ring(x,TY,22,{color:HI,w:3}));
  s+=cardR(L('上の 列の 1本（⊙）',920,110,{size:26,color:DIM})+L('磁場：反時計回りの 円',920,200,{size:28,color:CB,weight:700})+fade(seg(p,.5,.7),L('すぐ 下（内側）：右向き',920,280,{size:28,color:HI,weight:700})),1);
  return s;
 },
 [K+'bot']:(p)=>{
  const i=6,x=wx(i);
  let s=rows({})+fade(.5,arrow(x-40,TY+70,x+40,TY+70,{color:CB,w:5,head:14}));
  s+=circ(x,BY,36,-1,{g:seg(p,.1,.35),w:3.5,nh:4,phase:45});
  s+=fade(seg(p,.5,.7),arrow(x-40,BY-70,x+40,BY-70,{color:CB,w:6,head:16})+label('右向き',x+50,BY-62,{size:24,color:CB,weight:700}));
  s+=ring(x,BY,22,{color:HI,w:3});
  s+=cardR(L('下の 列の 1本（⊗）',920,110,{size:26,color:DIM})+L('磁場：時計回りの 円',920,200,{size:28,color:CB,weight:700})+fade(seg(p,.5,.7),L('すぐ 上（内側）：右向き',920,280,{size:28,color:HI,weight:700})),1);
  return s;
 },
 [K+'inside']:(p)=>{
  let s=rows({})+insideB(seg(p,.1,.4));
  s+=cardR(L('内側',920,110,{size:26,color:DIM})+L('上下の 列の 磁場が',920,200,{size:28,color:INK})+L('同じ 右向きに 重なる',920,260,{size:30,color:CB,weight:700})+fade(seg(p,.5,.7),L('→ 強め合う',920,340,{size:30,color:HI,weight:700})),1);
  return s;
 },
 [K+'outside']:(p)=>{
  const x=330,y=95;
  let s=rows({})+insideB(.4);
  s+=dot(x,y,7,INK);
  s+=fade(seg(p,.25,.4),arrow(x,y,x-80,y,{color:CB,w:5,head:14})+label('上の 列から',x-90,y-16,{size:22,color:CB,anchor:'end'}));
  s+=fade(seg(p,.45,.6),arrow(x,y+14,x+60,y+14,{color:CB,w:4,head:12,opacity:.75})+label('下の 列から',x+70,y+22,{size:22,color:CB}));
  s+=cardR(L('外側（上の 列の すぐ 上）',920,110,{size:26,color:DIM})+fade(seg(p,.25,.4),L('上の 列：左向き',920,200,{size:28,color:INK}))+fade(seg(p,.45,.6),L('下の 列：右向き',920,260,{size:28,color:INK}))+fade(seg(p,.65,.8),L('→ 打ち消し合う 向き',920,340,{size:30,color:HI,weight:700})),1);
  return s;
 },
 [K+'approx']:(p)=>{
  let s=rows({})+insideB(1);
  s+=fade(seg(p,.55,.7),label('𝐁 ≈ 0',330,100,{size:30,color:CB,anchor:'middle',weight:700})+label('𝐁 ≈ 0',330,470,{size:30,color:CB,anchor:'middle',weight:700}));
  s+=cardR(L('近似（十分 長い・端から 遠い）',920,110,{size:24,color:DIM})+fade(seg(p,.4,.55),L('内側：𝐁 は 軸に 平行',920,210,{size:30,color:CB,weight:700}))+fade(seg(p,.55,.7),L('外側：𝐁 ≈ 0',920,290,{size:30,color:CB,weight:700})),1,HI);
  return s;
 },
 // ===== S3 4辺 =====
 [K+'rect']:(p)=>{
  let s=rows({})+insideB(.5)+rectC({g:seg(p,.05,.3),heads:0});
  s+=fade(seg(p,.3,.45),label('中',RX0-60,RB+8,{size:24,color:HI}))+fade(seg(p,.45,.6),label('外',RX0-60,RT+8,{size:24,color:GR}));
  s+=cardR(L('輪 C：長方形',920,110,{size:28,color:SC,weight:700})+fade(seg(p,.3,.45),L('下の 辺：コイルの 中',920,200,{size:28,color:HI}))+fade(seg(p,.45,.6),L('上の 辺：コイルの 外',920,260,{size:28,color:GR}))+fade(seg(p,.65,.8),L('上の 列の 導線を またぐ',920,340,{size:28,color:INK})),1);
  return s;
 },
 [K+'dir']:(p)=>{
  let s=rows({})+insideB(.5)+rectC({labs:1});
  s+=cardR(L('たどる 向き',920,110,{size:26,color:DIM})+L('反時計回り',920,190,{size:32,color:SC,weight:700})+fade(seg(p,.4,.55),L('親指は 手前',920,270,{size:28,color:INK}))+fade(seg(p,.6,.75),L('⊙ の 電流が 正',920,345,{size:32,color:HI,weight:700})),1);
  return s;
 },
 [K+'L']:(p)=>{
  let s=rows({})+insideB(.5)+rectC({});
  s+=fade(seg(p,.1,.3),line(RX0,RT-28,RX1,RT-28,{color:INK,w:2.5})+line(RX0,RT-38,RX0,RT-18,{color:INK,w:2.5})+line(RX1,RT-38,RX1,RT-18,{color:INK,w:2.5})+label('L',(RX0+RX1)/2,RT-40,{size:30,color:INK,anchor:'middle',weight:700}));
  s+=cardR(L('辺の 長さ L',920,110,{size:30,color:INK,weight:700})+fade(seg(p,.4,.6),L('輪の 辺の 長さ',920,210,{size:28,color:HI}))+fade(seg(p,.55,.75),L('コイル 全体の 長さ ではない',920,280,{size:28,color:BAD})),1);
  return s;
 },
 [K+'split']:(p)=>{
  let s=rows({})+insideB(.5)+rectC({labs:1});
  s+=cardR(T(`\\oint ${Bv}\\cdot${dr}`,920,140,{size:44})+L('＝ 下 ＋ 右 ＋ 上 ＋ 左',920,230,{size:30,color:INK,weight:700})+fade(seg(p,.5,.7),mixed(['一歩',`$${dr}$`,'と',`$${Bv}$`,'の 向き'],920,320,{size:28,color:HI})),1);
  return s;
 },
 [K+'side1']:(p)=>{
  let s=rows({})+insideB(.35)+rectC({hl:0,dim:1});
  const y=RB;s+=fade(seg(p,.1,.3),arrow(290,y,380,y,{color:SC,w:7,head:16})+T(dr,335,y+32,{size:28}));
  s+=fade(seg(p,.25,.4),arrow(290,212,380,212,{color:CB,w:6,head:15})+T(Bv,452,220,{size:28,anchor:'start'}));
  s+=cardR(L('下の 辺（コイルの 中）',920,110,{size:26,color:HI,weight:700})+L('一歩も 𝐁 も 右向き → 平行',920,190,{size:26,color:INK})+fade(seg(p,.5,.65),T(`${Bv}\\cdot${dr}=B\\,d\\ell`,920,290,{size:44}))+fade(seg(p,.7,.85),L('dℓ：一歩の 長さ',920,380,{size:26,color:SC})),1);
  return s;
 },
 [K+'side1b']:(p)=>{
  let s=rows({})+insideB(.35)+rectC({hl:0,dim:1});
  s+=cardR(L('下の 辺',920,110,{size:26,color:HI,weight:700})+T(`\\int B\\,d\\ell=B\\int d\\ell`,920,200,{size:42})+fade(seg(p,.4,.6),T(`=B\\times L`,920,310,{size:48}))+fade(seg(p,.6,.75),L('B 一定 → 外へ',920,395,{size:26,color:DIM})),1);
  return s;
 },
 [K+'side2']:(p)=>{
  let s=rows({})+insideB(.35)+rectC({hl:1,dim:1});
  const x=RX1;s+=fade(seg(p,.1,.25),arrow(x,215,x,165,{color:SC,w:6,head:14}));
  s+=fade(seg(p,.25,.4),arrow(x-80,215,x-15,215,{color:CB,w:4,head:12}));
  s+=fade(seg(p,.55,.7),label('𝐁 ≈ 0',x+14,115,{size:24,color:CB}));
  s+=cardR(L('右の 辺（一歩は 上向き）',920,110,{size:26,color:RH,weight:700})+fade(seg(p,.25,.45),L('中：𝐁 と 直角 → 0',920,200,{size:28,color:INK}))+fade(seg(p,.55,.7),L('外：𝐁 ≈ 0 → 0',920,270,{size:28,color:INK}))+fade(seg(p,.75,.9),L('寄与 0',920,360,{size:34,color:RH,weight:700})),1);
  return s;
 },
 [K+'side3']:(p)=>{
  let s=rows({})+insideB(.35)+rectC({hl:2,dim:1})+fade(seg(p,.2,.4),label('𝐁 ≈ 0',(RX0+RX1)/2,RT-20,{size:26,color:CB,anchor:'middle',weight:700}));
  s+=cardR(L('上の 辺（コイルの 外）',920,110,{size:26,color:GR,weight:700})+L('𝐁 ≈ 0',920,210,{size:30,color:CB,weight:700})+fade(seg(p,.5,.7),L('寄与 0',920,300,{size:34,color:GR,weight:700})),1);
  return s;
 },
 [K+'side4']:(p)=>{
  let s=rows({})+insideB(.35)+rectC({hl:3,dim:1});
  s+=cardR(L('左の 辺（一歩は 下向き）',920,110,{size:26,color:RH,weight:700})+L('右の 辺と 同じ 理由',920,210,{size:28,color:INK})+fade(seg(p,.4,.6),L('寄与 0',920,300,{size:34,color:RH,weight:700})),1);
  return s;
 },
 [K+'total']:(p)=>{
  let s=rows({})+insideB(.35)+rectC({labs:1});
  s+=cardR(T(`\\oint ${Bv}\\cdot${dr}`,920,130,{size:42})
   +T(`=${cs(HI,'BL')}+${cs(RH,'0')}+${cs(GR,'0')}+${cs(RH,'0')}`,920,230,{size:42})
   +fade(seg(p,.5,.7),T(`=BL`,920,330,{size:52})),1);
  return s;
 },
 [K+'reason']:(p)=>{
  let s=card(60,60,520,360,L('右・左の 辺',320,110,{size:28,color:RH,weight:700})+L('一歩 ⊥ 磁場',320,210,{size:32,color:INK,weight:700})+L('→ 内積 0',320,290,{size:28,color:DIM}),1);
  s+=card(620,60,520,360,L('上の 辺',880,110,{size:28,color:GR,weight:700})+L('磁場 そのものが ほぼ 0',880,210,{size:30,color:INK,weight:700})+L('→ 寄与 0',880,290,{size:28,color:DIM}),seg(p,.4,.55));
  s+=fade(seg(p,.7,.85),L('0 に なる 理由が 違う',600,480,{size:30,color:HI,weight:700}));
  return s;
 },
 // ===== S4 貫く電流 =====
 [K+'right']:(p)=>{
  let s=rows({})+insideB(.35)+rectC({})+enclosed(seg(p,.4,.6));
  s+=cardR(T(LAW,920,140,{size:40})+L('I ＝ 長方形を 貫く 電流の 合計',920,240,{size:26,color:INK})+fade(seg(p,.5,.7),L('通るのは 上の 列の 導線',920,320,{size:28,color:HI,weight:700})),1);
  return s;
 },
 [K+'count']:(p)=>{
  let s=rows({})+insideB(.35)+rectC({})+enclosed(1);
  s+=line(RX0,RT-28,RX1,RT-28,{color:INK,w:2})+label('L',(RX0+RX1)/2,RT-40,{size:26,color:INK,anchor:'middle',weight:700});
  s+=cardR(mixed(['1 m あたり',`$${nn}$`,'本'],920,130,{size:28,color:INK})+fade(seg(p,.4,.6),mixed(['長さ L の 中に',`$${nn}L$`,'本'],920,230,{size:30,color:HI,weight:700})),1);
  return s;
 },
 [K+'sumI']:(p)=>{
  let s=rows({})+insideB(.35)+rectC({})+enclosed(1);
  s+=cardR(L('1本 あたり I・すべて ⊙（正）',920,130,{size:26,color:INK})+fade(seg(p,.4,.6),mixed(['貫く 電流',`$=${nn}L\\times${Ic}$`],920,250,{size:36,weight:700})),1);
  return s;
 },
 [K+'law']:(p)=>{
  let s=card(80,50,1040,180,T(LAW,600,150,{size:48}),1);
  s+=fade(seg(p,.2,.4),T(`${cs(HI,'BL')}=\\mu_0\\,(${nn}L)\\,${Ic}`,600,340,{size:60}));
  return s;
 },
 [K+'divide']:(p)=>{
  const g=seg(p,.2,.35)>.5;
  let s=T(`${Bs}${g?'\\cancel{L}':'L'}=\\mu_0\\,${nn}${g?'\\cancel{L}':'L'}\\,${Ic}`,600,130,{size:56});
  s+=fade(seg(p,.05,.2),L('両辺を L で 割る',600,230,{size:28,color:DIM}));
  s+=TF(`${Bs}=\\mu_0${nn}${Ic}`,600,370,{size:70,box:true,g:seg(p,.4,.6)});
  return s;
 },
 [K+'anyL']:(p)=>{
  const w=mix(180,320,.5-.5*Math.cos(2*Math.PI*clamp(p*1.2)));
  let s=rows({})+insideB(.35);
  const x1=RX0+w;
  s+=draw([[RX0,RB],[x1,RB],[x1,RT],[RX0,RT],[RX0,RB]],1,{color:SC,w:4});
  for(let i=0;i<NW;i++){const x=wx(i);if(x>RX0&&x<x1)s+=ring(x,TY,24,{color:HI,w:3});}
  s+=cardR(L('L を 変えても',920,130,{size:28,color:INK})+T(`${Bs}=\\mu_0${nn}${Ic}`,920,240,{size:52})+L('同じ B',920,340,{size:32,color:HI,weight:700}),1);
  return s;
 },
 [K+'uniform']:(p)=>{
  const yb=mix(RB,365,.5-.5*Math.cos(2*Math.PI*clamp(p*1.15)));
  let s=rows({})+insideB(.3)+rectC({bottom:yb,heads:0})+enclosed(1);
  s+=cardR(L('下の 辺を 上下に 動かす',920,120,{size:26,color:DIM})+L('囲む 本数は 同じ',920,200,{size:30,color:INK,weight:700})+fade(seg(p,.5,.65),L('→ B も 同じ',920,270,{size:30,color:CB,weight:700}))+fade(seg(p,.7,.85),L('中の 磁場は 一様',920,350,{size:34,color:HI,weight:700})),1);
  return s;
 },
 [K+'noR']:(p)=>{
  const coil=(x,y,ry,g)=>{let s='';for(let i=0;i<8;i++)s+=`<ellipse cx="${x+i*28}" cy="${y}" rx="10" ry="${ry}" fill="none" stroke="${CI}" stroke-width="3"/>`;return fade(g,s+arrow(x-10,y,x+220,y,{color:CB,w:4,head:13}));};
  let s=coil(110,170,90,1)+coil(110,400,40,seg(p,.3,.5));
  s+=label('太い',380,178,{size:26,color:INK})+fade(seg(p,.3,.5),label('細い',380,408,{size:26,color:INK}));
  s+=cardR(L('式に 半径が ない',920,130,{size:30,color:INK,weight:700})+T(`${Bs}=\\mu_0${nn}${Ic}`,920,240,{size:52})+fade(seg(p,.5,.7),mixed([`$${nn}$`,'と',`$${Ic}$`,'が 同じ → 同じ B'],920,340,{size:28,color:HI,weight:700})),1);
  return s;
 },
 [K+'nN']:(p)=>{
  let s=mixed([`$${nn}=N\\div$`,'（コイル 全体の 長さ）'],600,180,{size:44,weight:700});
  s+=fade(seg(p,.3,.5),L('N：全巻数',600,340,{size:30,color:INK}));
  return s;
 },
 // ===== S5 数・限界 =====
 [K+'num1']:(p)=>{
  let s=card(60,60,1080,180,L('n ＝ 200 /m，I ＝ 2 A（中級の 例）',600,105,{size:28,color:DIM})+T(`${Bs}=4\\pi\\times10^{-7}\\times200\\times2`,600,190,{size:46}),1);
  return s;
 },
 [K+'num2']:(p)=>{
  let s=card(60,40,1080,150,T(`${Bs}=4\\pi\\times10^{-7}\\times400=1.6\\pi\\times10^{-4}\\approx5.0\\times10^{-4}\\,\\mathrm{T}`,600,125,{size:40}),1);
  const x0=160,sc=12;
  s+=L('単位：',x0+640,470,{size:24,color:DIM})+T(`10^{-5}\\,\\mathrm{T}`,x0+730,466,{size:30,color:DIM});
  s+=line(x0,230,x0,450,{color:DIM,w:2});
  s+=fade(seg(p,.2,.4),rect(x0,250,50.3*sc,60,{fill:CB,fo:.55,stroke:CB})+label('コイルの 中：約 50',x0+50.3*sc+16,290,{size:26,color:CB,weight:700}));
  s+=fade(seg(p,.4,.6),rect(x0,350,4.5*sc,60,{fill:DIM,fo:.35,stroke:DIM})+label('地磁気（日本）：約 4.5',x0+4.5*sc+16,390,{size:26,color:INK,weight:700}));
  s+=fade(seg(p,.7,.85),L('約 11 倍',760,390,{size:34,color:HI,weight:700}));
  return s;
 },
 [K+'mri']:(p)=>{
  let s=card(60,60,1080,170,L('MRI：約 1.5 T',600,105,{size:28,color:DIM})+T(`${nn}${Ic}=\\dfrac{B}{\\mu_0}=\\dfrac{1.5}{4\\pi\\times10^{-7}}`,600,185,{size:42}),1);
  s+=fade(seg(p,.5,.7),TF(`${nn}${Ic}\\approx1.2\\times10^{6}\\,\\mathrm{A/m}`,600,350,{size:50,box:true}));
  return s;
 },
 [K+'mri2']:(p)=>{
  let s=card(60,60,1080,170,L('1 m あたり 1000 回 巻くと',600,105,{size:28,color:DIM})+T(`${Ic}=\\dfrac{1.2\\times10^{6}}{1000}\\approx1200\\,\\mathrm{A}`,600,185,{size:44}),1);
  s+=fade(seg(p,.55,.75),L('→ 電気抵抗 0 の 超伝導の 導線',600,340,{size:32,color:HI,weight:700}));
  return s;
 },
 [K+'limit']:(p)=>{
  // short coil, field lines spreading at the ends
  let s='';const cx=330,cy=270;
  for(let i=0;i<6;i++)s+=`<ellipse cx="${cx-100+i*40}" cy="${cy}" rx="12" ry="70" fill="none" stroke="${CI}" stroke-width="3.5"/>`;
  for(const dy of [-40,0,40]){s+=arrow(cx-140,cy+dy,cx+140,cy+dy,{color:CB,w:3.5,head:12});}
  for(const sgn of [-1,1])for(const a of [60,110]){const pts=Array.from({length:41},(_,k)=>{const t=k/40;return [cx+mix(150,-150,t),cy+sgn*(40+a*Math.sin(Math.PI*t))];});s+=fade(seg(p,.2,.5),draw(pts,1,{color:CB,w:2.5,dash:'7 6'}));}
  s+=cardR(L('この 式が ずれる 所',920,110,{size:26,color:DIM})+L('端の 近く：外へ 広がる',920,200,{size:28,color:INK})+fade(seg(p,.4,.6),L('短い コイル：外も 無視 できない',920,270,{size:26,color:INK})),1);
  return s;
 },
 [K+'iron']:(p)=>{
  let s=rect(150,225,360,90,{fill:GR,fo:.45,stroke:GR,rx:6})+label('鉄心',330,400,{size:28,color:INK,anchor:'middle',weight:700});
  for(let i=0;i<9;i++)s+=`<ellipse cx="${170+i*40}" cy="270" rx="12" ry="80" fill="none" stroke="${CI}" stroke-width="3.5"/>`;
  s+=cardR(L('鉄心入り',920,110,{size:28,color:INK,weight:700})+L('磁場が ずっと 強く なる',920,200,{size:28,color:CB,weight:700})+fade(seg(p,.4,.6),L('→ 別の 扱いが 要る',920,280,{size:28,color:HI})),1);
  return s;
 },
 // ===== S6 まとめ =====
 [K+'sum1']:(p)=>{
  let s=rows({})+insideB(.35)+rectC({labs:1});
  s+=cardR(L('4辺の うち 効くのは',920,120,{size:26,color:DIM})+L('中の 辺 だけ',920,190,{size:30,color:HI,weight:700})+T(`\\oint ${Bv}\\cdot${dr}=BL`,920,300,{size:44}),1);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=T(`BL=\\mu_0\\,${nn}L\\,${Ic}`,600,120,{size:52});
  s+=TF(`${Bs}=\\mu_0${nn}${Ic}`,600,280,{size:68,box:true,g:seg(p,.35,.55)});
  s+=fade(seg(p,.65,.8),L('中の 磁場は 一様',600,440,{size:32,color:HI,weight:700}));
  return s;
 },
 [K+'tools']:(p)=>{
  let s=card(40,60,540,360,L('ビオ・サバールの 法則',310,110,{size:28,color:CI,weight:700})+L('欠片を 足す',310,200,{size:30,color:INK,weight:700})+L('どんな 形にも 使える',310,270,{size:26,color:DIM}),1);
  s+=card(620,60,540,360,L('アンペールの 法則',890,110,{size:28,color:SC,weight:700})+L('一周の 和',890,200,{size:30,color:INK,weight:700})+L('対称性が あれば 速い',890,270,{size:26,color:DIM}),seg(p,.45,.6));
  return s;
 },
 [K+'next1']:(p)=>{
  // I(t) rising and the coil
  let s='';for(let i=0;i<7;i++)s+=`<ellipse cx="${130+i*40}" cy="250" rx="12" ry="80" fill="none" stroke="${CI}" stroke-width="3.5"/>`;
  s+=fade(seg(p,.2,.4),arrow(100,250,420,250,{color:CB,w:5,head:16})+label('B ＝ μ₀nI',260,380,{size:28,color:CB,anchor:'middle',weight:700}));
  s+=cardR(L('電流 I を 変えると',920,120,{size:28,color:CI,weight:700})+fade(seg(p,.35,.5),L('磁束が 変わる',920,200,{size:28,color:CB}))+fade(seg(p,.55,.7),L('→ コイル 自身に 起電力',920,280,{size:30,color:C.v,weight:700})),1);
  return s;
 },
 [K+'next2']:(p)=>{
  let s=card(200,90,800,320,L('次の 問い',600,150,{size:26,color:DIM})+L('コイルが 持つ',600,240,{size:32,color:INK})+L('「電流の 慣性」とは？',600,320,{size:40,color:HI,weight:700}),seg(p,.05,.2),HI);
  return s;
 },
};

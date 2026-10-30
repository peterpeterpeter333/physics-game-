// 問題編 解説「ヘリウム4 の核ができるときのエネルギー」(ys-qx-hs-a-nucleus-3) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/503_原子核と放射線.md の q-hs-a-nucleus-3（解説 20 行）。
// 色（正本）：陽子 赤、中性子 灰、エネルギー（E・ΔE）橙、光速 c 紫、質量 白、γ線（光子）黄、誤り 赤、合う・答え 緑。
// 元の単元動画（yt1-hs-a-nucleus-1／-3）の部品（陽子・中性子・α の粒の並び・波・E＝mc² の式・まとめの画面 d7）を読み込んで使う（編集しない）。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
import {C,seg,fade,label,line,rect,poly,arrow,mix,move} from './anim.mjs';
import {proton,neutron,nucBalls,alphaKinds,TX,fcard,cs,wavy} from './yt1-hs-a-nucleus-1-diagrams.mjs';
import {EC,CC,MC2,DMC2,hsANucleus3Diagrams} from './yt1-hs-a-nucleus-3-diagrams.mjs';
import {card,goalTag,answerTag,answerRow,wrongSeq,kindTag,note,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-hs-a-nucleus-3:';
const HC=C.hi,OK=C.F,BAD='#ff6b6b',GC=C.hi;
const P10=(m,e)=>`${m}\\times10^{${e}}`;
const KG='\\,\\mathrm{kg}',JJ='\\,\\mathrm{J}',EV='\\,\\mathrm{eV}',MEV='\\,\\mathrm{MeV}';
const G1='出てくるエネルギー',G2='MeV の値',G3='正しい説明';
const A1=g=>answerTag(1,'C','約 4.5×10⁻¹² J',{g}),A2=g=>answerTag(2,'C','約 28 MeV',{g}),A3=g=>answerTag(3,'C','',{g});
const s2=ctx=>sentWin(ctx)[1]?.[0]??.5;
const atR=(ctx,str)=>{const r=(ctx?.cue?.reading??'').replace(/\s/g,'');const i=r.indexOf(str);return i<0?.5:i/Math.max(1,r.length)*voiceEnd(ctx);};
const jp=(s,x,y,o={})=>label(s,x,y,{size:28,color:C.ink,anchor:'middle',weight:700,...o});
const Ec=s=>cs(EC,s);

// ---- 出題中の図：陽子2・中性子2（質量の札）→ ヘリウム4 の核 ----------------------------------------------
const P0=[[450,170],[515,170]],N0=[[450,320],[515,320]];
const HE={x:930,y:250};
const heKinds=alphaKinds;
// ヘリウム4 の核（2×2 にまとめた粒）
function heNuc(x,y,{r=24,g=1}={}){const d=r*.92;return fade(g,proton(x-d,y-d,r)+neutron(x+d,y-d,r)+neutron(x-d,y+d,r)+proton(x+d,y+d,r));}
function heTarget(i){const pos=[[-1,-1],[1,-1],[-1,1],[1,1]];return [HE.x+pos[i][0]*22,HE.y+pos[i][1]*22];}
function setup0(p,{g=1}={}){
 const a=seg(p,0,.45),u=seg(p,.5,.92),lab=1-.35*u;
 let s=fade(a*lab,label('陽子',230,120,{size:26,color:'#e0707e',anchor:'middle',weight:700})+TX(`${P10('1.67262','-27')}${KG}`,230,182,{size:30})
  +label('中性子',230,270,{size:26,color:'#a7b1c4',anchor:'middle',weight:700})+TX(`${P10('1.67493','-27')}${KG}`,230,332,{size:30}));
 s+=fade(a*lab,label('（1個あたり）',230,225,{size:22,color:C.dim,anchor:'middle'}));
 // 粒（右へ集まる）
 const kinds=['p','p','n','n'],start=[...P0,...N0],ti=[0,3,1,2];
 kinds.forEach((k,i)=>{const [x0,y0]=start[i],[x1,y1]=heTarget(ti[i]);const x=mix(x0,x1,u),y=mix(y0,y1,u);s+=fade(a,k==='p'?proton(x,y,24):neutron(x,y,24));});
 s+=fade(seg(p,.88,1),label('ヘリウム4 の核',HE.x,HE.y+90,{size:26,color:C.ink,anchor:'middle',weight:700})+TX(`${P10('6.64466','-27')}${KG}`,HE.x,HE.y+140,{size:30}));
 return fade(g,s);
}
const setupFinal=()=>setup0(1);

// ---- 天びん：左の皿＝反応の前（陽子2・中性子2）、右の皿＝反応の後（ヘリウム4 の核）。u で左が下がる（大きく誇張）----
const BL={cx:330,cy:190,L:210};
function balance({u=0,g=1,dmOut=0}={}){
 const {cx,cy,L}=BL,a=.07*u;
 const lx=cx-L*Math.cos(a),ly=cy+L*Math.sin(a),rx=cx+L*Math.cos(a),ry=cy-L*Math.sin(a);
 let s=poly([[cx-36,cy+215],[cx+36,cy+215],[cx,cy]],{fill:'#56627a',fo:1,stroke:C.dim});
 s+=line(lx,ly,rx,ry,{color:C.ink,w:5});
 const pan=(px,py)=>line(px,py,px-65,py+90,{color:C.dim,w:2})+line(px,py,px+65,py+90,{color:C.dim,w:2})+line(px-75,py+90,px+75,py+90,{color:C.ink,w:5});
 s+=pan(lx,ly)+pan(rx,ry);
 s+=proton(lx-48,ly+72,15)+proton(lx-16,ly+72,15)+neutron(lx+16,ly+72,15)+neutron(lx+48,ly+72,15);
 s+=heNuc(rx,ry+68,{r:14});
 s+=label('反応の 前',lx,ly+126,{size:24,color:C.ink,anchor:'middle',weight:700})+label('反応の 後',rx,ry+126,{size:24,color:C.ink,anchor:'middle',weight:700});
 if(u>0)s+=note('（傾きは 大きく 誇張）',cx,cy+250,{g:seg(u,.3,1)});
 return fade(g,s);
}
// 白い小さな箱 Δm（左の皿から取り出す）→ 橙の棒（静止エネルギー）
function dmBox(k,{toBar=0,g=1}={}){
 const {cx,cy,L}=BL,a=.07;
 const x0=cx-L*Math.cos(a),y0=cy+L*Math.sin(a)+40,x1=cx-40,y1=105;
 const x=mix(x0,x1,k),y=mix(y0,y1,k);
 let s=fade(1-toBar,rect(x-34,y-22,68,44,{fill:C.ink,fo:.18,stroke:C.ink,sw:2.5,rx:6})+TX('\\Delta m',x,y+8,{size:28,color:C.ink}));
 s+=fade(toBar,rect(x1-34,y1-20,34+toBar*240,40,{fill:EC,fo:.6,stroke:EC,rx:6})+label('静止エネルギー（差の 分）',x1+240*toBar+12,y1+9,{size:22,color:EC,weight:700}));
 return fade(g,s);
}
// 右側の式の列（x 中央 900）
const RX=900;
const sumRows=(g=[1,1,1],y0=130)=>fade(g[0],TX(`2\\times1.67262+2\\times1.67493`,RX,y0,{size:34}))+fade(g[1],TX(`=3.34524+3.34986`,RX+20,y0+58,{size:34}))+fade(g[2],TX(`=6.69510\\times10^{-27}${KG}`,RX+20,y0+118,{size:36}));
const preRow=(y,g=1)=>fade(g,label('前',650,y+10,{size:26,color:C.dim,weight:700})+TX(`${P10('6.69510','-27')}${KG}`,RX+30,y,{size:34}));
const postRow=(y,g=1)=>fade(g,label('後',650,y+10,{size:26,color:C.dim,weight:700})+TX(`${P10('6.64466','-27')}${KG}`,RX+30,y,{size:34}));
// 計算の画面
const c2Card=(g=1,y=110)=>card(220,y,760,96,TX(`${cs(CC,'c')}^2=(3.0\\times10^{8})^2=9.0\\times10^{16}`,600,y+60,{size:40}),g,HC);
const calcRow=(g=1,y=300)=>fade(g,TX(`${Ec('\\Delta E')}=5.044\\times10^{-29}\\times9.0\\times10^{16}`,600,y,{size:40}));
const resRow=(g=1,y=380)=>fade(g,TX(`\\approx${Ec('4.54\\times10^{-12}')}${JJ}`,640,y,{size:44}));
const unitCard=(g=1,y=250)=>card(150,y,900,96,TX(`\\mathrm{kg}\\times(\\mathrm{m/s})^2=\\mathrm{kg\\cdot m^2/s^2}=\\mathrm{J}`,600,y+60,{size:40}),g,EC);
const deTop=(g=1,y=130)=>fade(g,TX(`${Ec('\\Delta E')}\\approx${Ec('4.54\\times10^{-12}')}${JJ}`,600,y,{size:40}));
// 小問2 の計算
const jevLab=(g=1)=>fade(g,label('J → eV：1.6×10⁻¹⁹ で 割る',600,200,{size:28,color:C.ink,anchor:'middle',weight:700}));
const jevEq=(g=1)=>fade(g,TX(`\\dfrac{4.54\\times10^{-12}}{1.6\\times10^{-19}}\\approx2.8\\times10^{7}${EV}`,600,275,{size:40}));
const mevLab=(g=1)=>fade(g,TX(`10^{6}${EV}=1${MEV}`,600,375,{size:38}));
const mevEq=(g=1)=>fade(g,TX(`2.8\\times10^{7}${EV}=${Ec('28')}${MEV}`,600,445,{size:42}));
const mevShort=(g=1)=>fade(g,TX(`\\approx2.8\\times10^{7}${EV}=${Ec('28')}${MEV}`,600,210,{size:40}));
// エネルギーの棒（重水素とヘリウム4）
function eBars(p){
 const x0=330,k=25;
 let s=line(x0,140,x0,380,{color:C.dim,w:3});
 s+=fade(seg(p,.03,.15),label('重水素',x0-20,205,{size:28,color:C.ink,anchor:'end',weight:700})+rect(x0,180,2.2*k,46,{fill:EC,fo:.6,stroke:EC,rx:4})+label('2.2 MeV',x0+2.2*k+14,212,{size:30,color:EC,weight:700}));
 const w=28*k*seg(p,.15,.45);
 s+=fade(seg(p,.15,.25),label('ヘリウム4',x0-20,305,{size:28,color:C.ink,anchor:'end',weight:700})+rect(x0,280,w,46,{fill:EC,fo:.6,stroke:EC,rx:4}))+fade(seg(p,.4,.5),label('28 MeV',x0+28*k+14,312,{size:30,color:EC,weight:700}));
 s+=fade(seg(p,.6,.72),label('できる 核に よって 質量の 差が 違う',600,450,{size:30,color:HC,anchor:'middle',weight:700}));
 return s;
}
// 橙の棒 → 光子（黄）と粒の運動（速さの矢印）
function splitBar(k,t){
 const y=150;
 let s=label('減った 静止エネルギー',880,y-40,{size:24,color:EC,anchor:'middle',weight:700});
 s+=fade(1-k,rect(760,y-20,240,40,{fill:EC,fo:.6,stroke:EC,rx:6}));
 s+=fade(k,wavy(700,y+30,880,y+30,{color:GC,amp:9,lam:30,ph:t*1.5,w:4,head:14})+label('光（γ線）',790,y+80,{size:24,color:GC,anchor:'middle',weight:700}));
 s+=fade(k,heNuc(975,y+30,{r:11})+arrow(1010,y+30,1110,y+30,{color:C.v,w:4,head:14})+label('粒の 運動',1040,y+82,{size:24,color:C.v,anchor:'middle',weight:700}));
 s+=fade(k,label('全体の エネルギーは 保存',900,y+130,{size:26,color:OK,anchor:'middle',weight:700}));
 return s;
}

export const qxHsANucleus3Diagrams={
 // ================= 問題アニメ（小問1〜3 共通）=================
 // 陽子2・中性子2（質量の札）が現れ、右へ集まってヘリウム4 の核になる。光・速さ・天びん・Δm・エネルギーの棒は描かない。
 [K+'q0']:(p)=>setup0(p),
 // ================= S1 小問1 =================
 [K+'goal1']:(p)=>setupFinal()+goalTag(G1,{g:seg(p,.05,.2)}),
 // 2. E＝mc²（m 白、c 紫、E 橙）。「原理」の札と「実験」タグ
 [K+'emc2']:(p,ctx)=>{
  const b=s2(ctx);
  let s=fcard(300,120,600,160,MC2,{size:80,col:EC,g:seg(p,.03,.15)});
  s+=fade(seg(p,.1,.2),label('止まっていても 持つ エネルギー（静止エネルギー）',600,330,{size:28,color:EC,anchor:'middle',weight:700}));
  s+=card(330,375,540,80,label('原理 として 使う',520,427,{size:32,color:HC,anchor:'middle',weight:700})+kindTag('実験',760,425),seg(p,b,b+.08),HC);
  return s+goalTag(G1);
 },
 // 3. 天びんの左の皿に4個の粒。足し算を一つずつ
 [K+'before']:(p)=>balance({g:seg(p,0,.1)})+sumRows([seg(p,.1,.2),seg(p,.3,.4),seg(p,.55,.65)])+goalTag(G1),
 // 4. 右の皿にヘリウム4 の核（6.64466×10⁻²⁷ kg）。天びんが左にわずかに傾く（誇張の注記）
 [K+'after']:(p,ctx)=>{
  const b=s2(ctx);
  let s=balance({u:seg(p,b,b+.25)});
  s+=preRow(130)+postRow(200,seg(p,.05,.15));
  s+=fade(seg(p,b+.2,b+.3),label('後の ほうが 少し 軽い',RX,280,{size:30,color:HC,anchor:'middle',weight:700}));
  return s+goalTag(G1);
 },
 // 5. 引き算 → Δm＝5.044×10⁻²⁹ kg（白い箱）、約 0.75 %
 [K+'dm']:(p)=>{
  let s=balance({u:1})+preRow(130)+postRow(190);
  s+=fade(seg(p,.03,.12),TX(`6.69510-6.64466=0.05044`,RX,260,{size:34}));
  s+=card(660,290,480,80,TX(`\\Delta m=5.044\\times10^{-29}${KG}`,RX,343,{size:36}),seg(p,.15,.25),C.ink);
  s+=dmBox(seg(p,.2,.45));
  s+=fade(seg(p,.6,.7),label('前の 質量の 約 0.75 %',RX,420,{size:30,color:HC,anchor:'middle',weight:700}));
  return s+goalTag(G1);
 },
 // 6. 白い箱だけが橙の棒に変わる。ΔE＝Δm c²。質量が全部消えるわけではない
 [K+'de']:(p,ctx)=>{
  const b=s2(ctx);
  let s=balance({u:1})+dmBox(1,{toBar:seg(p,.05,.25)});
  s+=fade(.6,TX(`\\Delta m=5.044\\times10^{-29}${KG}`,RX,240,{size:32}));
  s+=fcard(660,280,480,100,DMC2,{size:46,col:EC,g:seg(p,.25,.35)});
  s+=fade(seg(p,b,b+.08),label('質量が 全部 消える わけでは ない',RX,430,{size:28,color:HC,anchor:'middle',weight:700}));
  return s+goalTag(G1);
 },
 // 7. c²＝9.0×10¹⁶（黄の枠）→ 掛け算を一つずつ → ≈4.54×10⁻¹² J
 [K+'calc']:(p,ctx)=>{
  const b=s2(ctx);
  return c2Card(seg(p,.03,.12))+calcRow(seg(p,b,b+.08))+resRow(seg(p,b+.35,b+.45))+goalTag(G1);
 },
 // 8. 答え C。単位 kg×(m/s)²＝kg·m²/s²＝J
 [K+'ans1']:(p,ctx)=>{
  const b=s2(ctx);
  return deTop()+unitCard(seg(p,b,b+.1))+fade(seg(p,b+.3,b+.4),label('エネルギーの 単位 J',600,410,{size:30,color:EC,anchor:'middle',weight:700}))+goalTag(G1)+A1(seg(p,.03,.1));
 },
 // 9. 誤答 A
 [K+'wrongA']:(p,ctx)=>fade(.5,deTop())+goalTag(G1)+A1(1)
  +wrongSeq(p,ctx,[['A','6.0×10⁻¹⁰ J','前の 質量を 全部 使った',{mid:`6.69510\\times10^{-27}\\times9.0\\times10^{16}`}]],{win:[[0,1]],opts:{y:200}}),
 // 10. 誤答 B → D（1枚ずつ）
 [K+'wrongBD']:(p,ctx)=>{
  const d=atR(ctx,'ディーは');
  return fade(.5,deTop())+goalTag(G1)+A1(1)
   +wrongSeq(p,ctx,[['B','1.5×10⁻²⁰ J','c を 2乗し 忘れ（単位 kg·m/s）',{mid:`5.044\\times10^{-29}\\times3.0\\times10^{8}`}],['D','4.5×10⁻¹² eV','J を eV と 書いた']],{win:[[0,d],[d,1]],opts:{y:200}});
 },
 // ================= S2 小問2 =================
 [K+'goal2']:(p)=>deTop(seg(p,0,.12))+goalTag(G2,{g:seg(p,.05,.2)}),
 // 12. J → eV：1.6×10⁻¹⁹ で割る → 2.8×10⁷ eV。10⁶ eV＝1 MeV → 28 MeV
 [K+'mev']:(p,ctx)=>{
  const m=atR(ctx,'じゅうのろくじょうでんしボルトが');
  return fade(.6,deTop())+jevLab(seg(p,.02,.1))+jevEq(seg(p,.12,.22))+mevLab(seg(p,m,m+.06))+mevEq(seg(p,m+.15,m+.25))+goalTag(G2);
 },
 // 13. 答え C → 誤答 A → B（1枚ずつ）
 [K+'ans2']:(p,ctx)=>{
  const b=s2(ctx),c=atR(ctx,'ビーは');
  const keep=1-seg(p,b-.04,b);
  let s=fade(.6,deTop())+fade(keep,jevLab()+jevEq()+mevLab()+mevEq())+fade(1-keep,mevShort());
  return s+goalTag(G2)+A2(seg(p,.03,.1))+wrongSeq(p,ctx,[['A','2.8 MeV','桁を 1つ 取り違えた'],['B','2.8×10⁷ MeV','eV の 値を MeV と 書いた']],{win:[[b,c],[c,1]],opts:{y:300}});
 },
 // 14. 誤答 D
 [K+'wrong2D']:(p,ctx)=>fade(.6,deTop())+mevShort()+goalTag(G2)+A2(1)
  +wrongSeq(p,ctx,[['D','7.3×10⁻³⁷ MeV','1.6×10⁻¹⁹ を 掛けた（J から eV へは 割る）']],{win:[[0,1]],opts:{y:300}}),
 // 15. 重水素 2.2 MeV とヘリウム4 28 MeV の棒
 [K+'compare']:(p)=>eBars(p)+goalTag(G2)+A2(1),
 // ================= S3 小問3 =================
 [K+'goal3']:(p)=>balance({g:seg(p,0,.12)})+goalTag(G3,{g:seg(p,.05,.2)}),
 // 17. 天びんの傾き、Δm の箱 → 橙の棒を再生。答え C
 [K+'ans3']:(p,ctx)=>{
  const b=s2(ctx);
  let s=balance({u:seg(p,.03,.25)})+dmBox(seg(p,.25,.4),{toBar:seg(p,.42,.55),g:seg(p,.25,.3)});
  s+=fade(seg(p,.2,.3),label('後の ほうが 少し 軽い',RX,250,{size:30,color:HC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.6),label('差の 分の エネルギーが 出た',RX,310,{size:30,color:EC,anchor:'middle',weight:700}));
  return s+goalTag(G3)+A3(seg(p,b,b+.05));
 },
 // 18. 誤答 A → D（1枚ずつ）
 [K+'wrongAD']:(p,ctx)=>{
  const d=atR(ctx,'ディーは');
  let s=fade(.55,balance({u:1})+dmBox(1,{toBar:1}));
  return s+goalTag(G3)+A3(1)+wrongSeq(p,ctx,[['A','全部 消えた','消えたのは 差の 分だけ'],['D','質量は 同じ','後の ほうが 約 0.75 % 軽い']],{win:[[0,d],[d,1]],opts:{x:640,y:330,w:540}});
 },
 // 19. 誤答 B。橙の棒が、黄の光子と粒の運動（速さの矢印）に分かれる
 [K+'wrongB']:(p,ctx)=>{
  const t=(ctx?.t??p*8);
  let s=fade(.55,balance({u:1}))+splitBar(seg(p,.35,.55),t);
  return s+goalTag(G3)+A3(1)+wrongSeq(p,ctx,[['B','新しく 生まれた','静止エネルギーが 形を 変えただけ']],{win:[[0,1]],opts:{x:640,y:330,w:540}});
 },
 // ================= S4 まとめ：元の単元動画の「ΔE＝Δm c²」の画面（d7、札の帯の下へずらす）=================
 [K+'sum']:(p,ctx)=>{
  const ve=voiceEnd(ctx);
  return move(0,30,hsANucleus3Diagrams['hs-a-nucleus-3:d7'](p,ctx))+answerRow([[1,'C',''],[2,'C',''],[3,'C','']],{g:seg(p,ve,Math.min(1,ve+.06))});
 },
};

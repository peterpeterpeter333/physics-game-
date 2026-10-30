// YouTube シリーズ「コンデンサ・上級 1/2」(ys-ue-capacitor-1) — 図。Stage 1200×515.
// 板は横から見た図（中級と同じ部品）：左の板 ＋Q、右の板 −Q、𝐄 は右向き（＋ → −）。
// 色：電場 𝐄 水色、電圧 V 紫、電荷 q・Q 桃（正電荷 赤、負電荷 青）、容量 C 黄、エネルギー U・u 橙、面積 S 金、ε₀・d 白、強調 黄、誤り 赤。
// 2/2 でも使う部品は export する（関数の export は図の登録に入らない）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,axes,texWidth,poly} from './anim.mjs';
import {POS,NEG,EC,QC,VC,CC,SC,WC,cs,T,card,L,G,plates,fieldIn,battery,plus,minus} from './yt1-um-capacitance-1-diagrams.mjs';
export {POS,NEG,EC,QC,VC,CC,SC,WC,cs,T,card,L,G,plates,fieldIn,battery,plus,minus};

const K='ue-capacitor-1:';
export const BAD=C.a,OK=C.F;
export const Qt=cs(QC,'Q'),qt=cs(QC,'q'),dq=cs(QC,'dq'),Ct=cs(CC,'C'),Vt=cs(VC,'V'),Et=cs(EC,'E'),Ut=cs(WC,'U'),ut=cs(WC,'u'),St=cs(SC,'S');
export const eps='\\varepsilon_0',U_=s=>`\\,\\mathrm{${s}}`;
export function TF(s,x,y,{size=44,maxW=1100,g=1,box=false,col=C.hi,frac=false}={}){
 const w0=texWidth(s,size,false),sz=w0>maxW?size*maxW/w0:size,w=w0*sz/size;
 let o=T(s,x,y,{size:sz});
 if(box){const top=frac?1.95:1.5,h=frac?3.0:2.45;o+=highlight(x-w/2-20,y-sz*top,w+40,sz*h,1,col);}
 return fade(g,o);
}
// V–q graph: q from 0 to Qmax (=1), voltage = q (C = 1 in graph units)
export function VQ({x=90,y=440,w=470,h=330,g=1,line_=1,strips=0,n=8,hl=-1,tri=0,rectAll=0,lab=1}={}){
 const A=axes({x,y,w,h,xmin:0,xmax:1.15,ymin:0,ymax:1.15,xticks:[],yticks:[],g});
 let s=A.svg;
 if(tri)s+=fade(tri,poly([[A.X(0),A.Y(0)],[A.X(1),A.Y(0)],[A.X(1),A.Y(1)]],{fill:WC,fo:.3,stroke:WC,sw:2}));
 if(rectAll)s+=fade(rectAll,rect(A.X(0),A.Y(1),A.X(1)-A.X(0),A.Y(0)-A.Y(1),{fill:BAD,fo:.12,stroke:BAD,sw:2,rx:0}));
 if(strips>0){for(let i=0;i<n;i++){const q0=i/n,hh=q0;const on=i===hl;s+=fade(strips,rect(A.X(q0),A.Y(hh),A.X(q0+1/n)-A.X(q0),A.Y(0)-A.Y(hh),{fill:on?C.hi:WC,fo:on?.5:.3,stroke:on?C.hi:WC,sw:1.5,rx:0}));}}
 if(line_)s+=A.plot(q=>q,{from:0,to:1.05,color:VC,w:4,p:line_});
 if(lab){s+=label('q',A.X(1.15)+26,A.Y(0)+8,{size:26,color:QC,weight:700})+label('電圧',A.X(0),A.Y(1.15)-36,{size:24,color:VC,anchor:'middle'});
  s+=line(A.X(1),A.Y(0)-6,A.X(1),A.Y(0)+6,{color:C.dim})+label('Q',A.X(1),A.Y(0)+32,{size:24,color:QC,anchor:'middle',weight:700})
   +line(A.X(0)-6,A.Y(1),A.X(0)+6,A.Y(1),{color:C.dim})+label('Q/C',A.X(0)-10,A.Y(1)+8,{size:22,color:VC,anchor:'end'});}
 return {svg:fade(g,s),A};
}
// label for the field arrows between the plates (𝐄 水色, ＋ → − の右向き)
function eLab({g=1,y=128}={}){return fade(g,label('電場 𝐄',(G.LX+G.RX)/2,y,{size:24,color:EC,anchor:'middle',weight:700}));}
// plates with the gap shaded as energy (orange)
export function gapFill(g=1,{lx=G.LX,rx=G.RX,pt=G.PT,pb=G.PB,fo=.28}={}){return fade(g,rect(lx,pt,rx-lx,pb-pt,{fill:WC,fo,stroke:'none',rx:0}));}

export const ytUeCapacitor1Diagrams={
 // ===== S1 =====
 [K+'prev']:(p)=>{
  let s=card(150,90,900,320,L('電位・上級 2/2',600,140,{size:24,color:C.dim})
   +L('静電平衡の 導体：内部 𝐄 ＝ 0',600,220,{size:32,color:EC,weight:700})
   +L('→ 全体が 同じ 電位（等電位）',600,300,{size:30,color:VC,weight:700}),seg(p,0,.15));
  return s;
 },
 [K+'ask']:(p)=>{
  let s=plates({qlab:1})+fieldIn({g:seg(p,.1,.3)});
  s+=card(760,90,400,330,L('前回の 最後の 問い',960,140,{size:24,color:C.dim})
   +L('ためるのに 使った',960,215,{size:28,color:C.ink})+L('仕事は',960,260,{size:28,color:C.ink})
   +L('どこに、どれだけ',960,330,{size:32,color:C.hi,weight:700})+L('蓄えられる？',960,380,{size:32,color:C.hi,weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'recall']:(p)=>{
  let s=plates({qlab:1,n:7})+fieldIn({});
  // d and S labels
  s+=line(G.LX,G.PB+30,G.RX,G.PB+30,{color:C.ink,w:2})+line(G.LX,G.PB+22,G.LX,G.PB+38,{color:C.ink,w:2})+line(G.RX,G.PB+22,G.RX,G.PB+38,{color:C.ink,w:2})+label('d',(G.LX+G.RX)/2,G.PB+62,{size:26,color:C.ink,anchor:'middle'});
  s+=card(760,80,400,350,L('中級',960,125,{size:24,color:C.dim})
   +T(`${Ct}=\\dfrac{${eps}${St}}{d}`,960,215,{size:48})
   +fade(seg(p,.45,.6),L('S ＝ 0.01 m²，d ＝ 1 mm',960,300,{size:24,color:C.ink})+T(`${Ct}=88.5${U_('pF')}`,960,365,{size:40})),seg(p,0,.15));
  return s;
 },
 [K+'recall2']:(p)=>{
  const {svg}=VQ({tri:1});
  let s=svg;
  s+=card(640,80,520,350,L('初級：2 μF，6 μC，3 V',900,125,{size:24,color:C.dim})
   +T(`\\tfrac12\\times 6${U_('\\mu C')}\\times 3${U_('V')}=9${U_('\\mu J')}`,900,215,{size:38})
   +L('三角形の 面積',900,285,{size:26,color:WC})
   +fade(seg(p,.55,.7),L('→ 今回は 積分で 一般に',900,365,{size:30,color:C.hi,weight:700})),seg(p,0,.15));
  return s;
 },
 // ===== S2 =====
 [K+'carry']:(p)=>{
  let s=plates({qlab:0,cop:.35})+fieldIn({g:.35});
  const u=seg(p,.2,.8),x=mix(G.RX+40,G.LX-50,u),y=60+90*Math.sin(Math.PI*u);
  s+=draw([[G.RX+40,G.PT-10],[G.RX+40,60],[G.LX-50,60],[G.LX-50,G.PT-10]],1,{color:C.faint,w:2,dash:'6 6'});
  const cx=G.RX+40+mix(0,G.LX-50-G.RX-40,u);
  s+=dot(cx,60,10,POS)+label('dq',cx,42,{size:22,color:QC,anchor:'middle'});
  // 外力（緑 = 力の色）：運ぶ向き（左）に、電荷に加える
  s+=fade(seg(p,.15,.25),arrow(cx-14,60,cx-74,60,{color:C.F,w:4,head:14})+label('外力',cx-44,90,{size:22,color:C.F,anchor:'middle',weight:700}));
  s+=card(760,100,400,300,L('外から 少しずつ',960,155,{size:28,color:C.ink,weight:700})+L('右の 板 → 左の 板',960,225,{size:26,color:C.ink})+L('ゆっくり 運ぶ',960,290,{size:26,color:C.dim})+L('（運動エネルギーは 持たせない）',960,340,{size:22,color:C.dim}),seg(p,0,.15));
  return s;
 },
 [K+'qQ']:(p)=>{
  let s=plates({qlab:0,cop:.6})+T(cs(POS,'+q'),G.LX-G.PW-44,(G.PT+G.PB)/2,{size:36})+T(cs(NEG,'-q'),G.RX+G.PW+46,(G.PT+G.PB)/2,{size:36})+fieldIn({k:.6})+eLab();
  s+=card(760,90,400,330,L('2つの 電荷を 書き分ける',960,140,{size:24,color:C.dim})
   +T(qt,822,238,{size:56})+L('小文字：途中の 電荷',995,232,{size:26})
   +fade(seg(p,.4,.55),T(Qt,822,348,{size:56})+L('大文字：最後の 電荷',995,342,{size:26})),seg(p,0,.15));
  return s;
 },
 [K+'mid']:(p)=>{
  let s=plates({qlab:0,cop:.6,lq:'+q',rq:'-q'})+T(cs(POS,'+q'),G.LX-G.PW-44,(G.PT+G.PB)/2,{size:36})+T(cs(NEG,'-q'),G.RX+G.PW+46,(G.PT+G.PB)/2,{size:36})+fieldIn({k:.6})+eLab();
  s+=card(760,90,400,330,L('途中の 電荷 q の とき',960,140,{size:26,color:C.dim})
   +T(`${Ct}=\\dfrac{${Qt}}{${Vt}}\\ \\Rightarrow\\ ${Vt}=\\dfrac{${qt}}{${Ct}}`,960,230,{size:36})
   +fade(seg(p,.2,.35),L('Q を q に 置きかえる',960,295,{size:22,color:C.dim}))
   +fade(seg(p,.6,.75),L('最後の 電荷 Q の 電圧では ない',960,360,{size:24,color:BAD,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'dw']:(p)=>{
  // potential ladder: right plate low, left plate high, difference q/C
  // 𝐄（水色）は ＋ → −（右向き）。電荷は 右 → 左 に運ぶので、外力（緑）は左向き＝𝐄 に逆らう。
  // 電荷の通り道（y＝LANE）を空けるため、𝐄 の矢は上下2本ずつ。
  const LANE=258;
  let s=plates({qlab:0,cop:.6})+fieldIn({k:.6,g:.85,rows:[132,192,324,384]})+eLab({y:120});
  s+=fade(seg(p,.1,.3),label('電位 高い',G.LX-G.PW/2,G.PT-18,{size:24,color:VC,anchor:'middle',weight:700})+label('電位 低い',G.RX+G.PW/2,G.PT-18,{size:24,color:VC,anchor:'middle',weight:700}));
  const u=seg(p,.3,.7),cx=mix(G.RX-24,G.LX+78,u);
  s+=dot(cx,LANE,10,POS)+label('dq',cx,LANE-18,{size:22,color:QC,anchor:'middle'});
  s+=fade(seg(p,.2,.3),arrow(cx-14,LANE,cx-66,LANE,{color:C.F,w:4,head:14})+label('外力',cx-40,LANE+38,{size:22,color:C.F,anchor:'middle',weight:700}));
  s+=card(760,90,400,330,L('電位差 q/C を 上る',960,140,{size:26,color:C.ink})
   +fade(seg(p,.5,.65),T(`dW=\\dfrac{${qt}}{${Ct}}\\,${dq}`,960,250,{size:46}))
   +fade(seg(p,.7,.85),L('（電位差 × 電荷）',960,345,{size:24,color:C.dim})),seg(p,0,.15));
  return s;
 },
 [K+'strip']:(p)=>{
  const n=8,hl=5;const {svg,A}=VQ({strips:seg(p,.2,.5),n,hl});
  let s=svg;
  const q0=hl/n;s+=fade(seg(p,.4,.6),label('q/C',A.X(q0)-8,A.Y(q0/2),{size:22,color:VC,anchor:'end'})+label('dq',A.X(q0+.5/n),A.Y(0)+30,{size:22,color:QC,anchor:'middle'}));
  s+=card(640,90,520,330,L('細い 短冊 1本',900,140,{size:26,color:C.dim})
   +T(`\\dfrac{${qt}}{${Ct}}\\times ${dq}`,900,240,{size:46})
   +L('高さ × 幅 ＝ 仕事',900,340,{size:28,color:WC,weight:700}),seg(p,0,.15));
  return s;
 },
 [K+'sum']:(p)=>{
  const n=Math.round(mix(8,40,seg(p,.1,.5)));const {svg}=VQ({strips:1,n,tri:seg(p,.5,.7)});
  let s=svg;
  s+=card(640,90,520,330,L('0 から Q まで 足す',900,140,{size:26,color:C.dim})
   +T(`${Ut}=\\int_0^{${Qt}}\\dfrac{${qt}}{${Ct}}\\,${dq}`,900,240,{size:44})
   +fade(seg(p,.55,.7),T(`=\\dfrac{1}{${Ct}}\\int_0^{${Qt}}${qt}\\,${dq}`,900,350,{size:40})+label('C は 定数',1100,410,{size:22,color:CC,anchor:'end'})),seg(p,0,.15));
  return s;
 },
 [K+'anti']:(p)=>{
  let s=TF(`${Ut}=\\dfrac{1}{${Ct}}\\Big[\\dfrac{${qt}^2}{2}\\Big]_0^{${Qt}}`,600,95,{size:48});
  s+=fade(seg(p,.1,.25),L('q の 原始関数：q²/2',600,190,{size:26,color:C.dim}));
  s+=TF(`=\\dfrac{1}{${Ct}}\\Big(\\dfrac{${Qt}^2}{2}-0\\Big)`,600,265,{size:44,g:seg(p,.3,.5)});
  s+=TF(`${Ut}=\\dfrac{${Qt}^2}{2${Ct}}`,600,420,{size:50,box:true,frac:true,g:seg(p,.55,.75)});
  return s;
 },
 [K+'half']:(p)=>{
  const {svg}=VQ({tri:1,rectAll:seg(p,.35,.55)});
  let s=svg;
  s+=card(640,90,520,330,L('½ ＝ 三角形の ½',900,150,{size:32,color:WC,weight:700})
   +fade(seg(p,.4,.55),L('最後の 電圧で 全部 運ぶと',900,235,{size:26,color:BAD}))
   +fade(seg(p,.5,.65),L('長方形 ＝ 2倍（多すぎ）',900,290,{size:28,color:BAD,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'check']:(p)=>{
  const {svg}=VQ({tri:1});
  let s=svg;
  s+=card(640,80,520,350,L('C ＝ 2 μF，Q ＝ 6 μC',900,125,{size:26,color:C.dim})
   +T(`\\dfrac{(6${U_('\\mu C')})^2}{2\\times 2${U_('\\mu F')}}=\\dfrac{36}{4}=9${U_('\\mu J')}`,900,225,{size:36})
   +fade(seg(p,.5,.65),L('初級の 三角形と 一致 ✓',900,345,{size:30,color:OK,weight:700})),seg(p,0,.15));
  return s;
 },
 // ===== S3 =====
 [K+'cv2']:(p)=>{
  let s=TF(`${Ut}=\\dfrac{${Qt}^2}{2${Ct}}`,600,90,{size:46});
  s+=fade(seg(p,.1,.25),L('Q ＝ CV を 入れる',980,100,{size:26,color:C.dim}));
  const two=seg(p,.45,.6)>.5;
  s+=TF(`=\\dfrac{${Ct}${two?`^{\\color{${BAD}}{\\cancel{2}}}`:'^2'}${Vt}^2}{2${two?`{\\color{${BAD}}{\\cancel{${Ct}}}}`:Ct}}`,600,240,{size:50,g:seg(p,.2,.4)});
  s+=TF(`${Ut}=\\tfrac12\\,${Ct}${Vt}^2`,600,400,{size:58,box:true,g:seg(p,.6,.8)});
  return s;
 },
 [K+'qv']:(p)=>{
  let s='';
  const xs=[230,600,970];
  [`\\dfrac{${Qt}^2}{2${Ct}}`,`\\tfrac12${Ct}${Vt}^2`,`\\tfrac12${Qt}${Vt}`].forEach((e,i)=>{s+=fade(i<2?1:seg(p,.1,.3),T(`${Ut}=${e}`,xs[i],190,{size:46}));});
  s+=fade(seg(p,.1,.3),L('V ＝ Q/C を 1つ 使う',970,270,{size:22,color:C.dim}));
  s+=fade(seg(p,.5,.7),L('同じ エネルギーの 別の 書き方',600,380,{size:32,color:C.hi,weight:700}));
  return s;
 },
 [K+'num']:(p)=>{
  let s=plates({qlab:1})+fieldIn({})+battery({volt:'3 V'});
  s+=card(760,90,400,330,L('中級の 板',960,140,{size:26,color:C.dim})
   +T(`${Ut}=\\tfrac12\\times 88.5${U_('pF')}\\times(3${U_('V')})^2`,960,230,{size:28})
   +fade(seg(p,.4,.6),T(`\\approx 3.98\\times10^{-10}${U_('J')}`,960,320,{size:38})),seg(p,0,.15));
  return s;
 },
 // ===== S4 =====
 [K+'where']:(p)=>{
  let s=plates({qlab:1})+fieldIn({});
  s+=fade(seg(p,.2,.4),ring(G.LX-G.PW/2,(G.PT+G.PB)/2,170*.0+60,{color:QC,w:3,dash:'6 6'})+label('板の 電荷？',G.LX-150,G.PT-20,{size:26,color:QC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.7),gapFill(1)+label('板の 間の 空間？',(G.LX+G.RX)/2,G.PT-20,{size:26,color:WC,anchor:'middle',weight:700}));
  s+=card(760,140,400,220,L('エネルギーは',960,215,{size:30,color:C.ink})+L('どこに ある？',960,275,{size:34,color:C.hi,weight:700}),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'subC']:(p)=>{
  let s=TF(`${Ut}=\\tfrac12\\,${Ct}\\,${Vt}^2`,600,90,{size:46});
  s+=TF(`=\\tfrac12\\cdot\\dfrac{${eps}${St}}{d}\\cdot${Vt}^2`,600,240,{size:50,g:seg(p,.25,.45)});
  s+=fade(seg(p,.2,.35),L('C ＝ ε₀S/d を 代入',980,100,{size:26,color:CC}));
  return s;
 },
 [K+'subV']:(p)=>{
  let s=TF(`${Ut}=\\tfrac12\\cdot\\dfrac{${eps}${St}}{d}\\cdot${Vt}^2`,600,90,{size:46});
  s+=fade(seg(p,.1,.25),L('V ＝ Ed を 代入',990,100,{size:26,color:VC}));
  s+=TF(`=\\tfrac12\\cdot\\dfrac{${eps}${St}}{d}\\cdot${Et}^2d^2`,600,240,{size:50,g:seg(p,.3,.5)});
  return s;
 },
 [K+'cancel']:(p)=>{
  const c=seg(p,.15,.3)>.5;
  let s=TF(`${Ut}=\\tfrac12\\cdot\\dfrac{${eps}${St}}{${c?`{\\color{${BAD}}{\\cancel{d}}}`:'d'}}\\cdot${Et}^2d^{${c?`{\\color{${BAD}}{\\cancel{2}}}`:'2'}}`,600,90,{size:46});
  s+=fade(seg(p,.15,.3),L('d を 1つ 約分',990,100,{size:26,color:BAD}));
  s+=TF(`${Ut}=\\tfrac12${eps}${Et}^2\\times ${St}d`,600,260,{size:56,box:true,g:seg(p,.4,.6)});
  return s;
 },
 [K+'vol']:(p)=>{
  let s=plates({qlab:1})+fieldIn({g:.6})+gapFill(seg(p,.1,.3));
  // depth to suggest volume: parallelogram on top
  s+=fade(seg(p,.1,.3),poly([[G.LX,G.PT],[G.LX+60,G.PT-40],[G.RX+60,G.PT-40],[G.RX,G.PT]],{fill:WC,fo:.18,stroke:WC,sw:1.5}));
  s+=card(760,100,400,300,L('S d',960,170,{size:40,color:C.ink,weight:700})
   +L('面積 × 間隔',960,240,{size:28,color:C.ink})+fade(seg(p,.4,.6),L('＝ 電場が ある 体積',960,310,{size:28,color:WC,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'density']:(p)=>{
  let s=TF(`${Ut}=\\tfrac12${eps}${Et}^2\\times ${St}d`,600,90,{size:46});
  s+=fade(seg(p,.1,.25),L('体積 Sd で 割る',990,100,{size:26,color:C.dim}));
  s+=TF(`${ut}=\\dfrac{${Ut}}{${St}d}=\\tfrac12${eps}${Et}^2`,600,265,{size:62,box:true,frac:true,g:seg(p,.25,.45)});
  s+=fade(seg(p,.6,.75),L('エネルギー 密度（1 m³ あたり）',600,430,{size:30,color:WC,weight:700}));
  return s;
 },
 [K+'onlyE']:(p)=>{
  let s=TF(`${ut}=\\tfrac12${eps}${Et}^2`,600,110,{size:62,box:true});
  const items=[['面積 S',SC],['間隔 d',C.ink],['電荷 Q',QC]];
  items.forEach(([t,c],i)=>{const x=330+i*270;s+=fade(seg(p,.1+i*.1,.2+i*.1),label(t,x,300,{size:32,color:c,anchor:'middle',weight:700})+line(x-70,290,x+70,310,{color:BAD,w:4}));});
  s+=fade(seg(p,.5,.7),L('その 場所の 電場 E だけで 決まる',600,420,{size:32,color:EC,weight:700}));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=TF(`\\dfrac{\\mathrm{C^2}}{\\mathrm{N\\cdot m^2}}\\times\\Big(\\dfrac{\\mathrm{N}}{\\mathrm{C}}\\Big)^2`,600,120,{size:50});
  s+=TF(`=\\dfrac{\\mathrm{N}}{\\mathrm{m^2}}`,600,270,{size:50,g:seg(p,.25,.45)});
  s+=TF(`=\\dfrac{\\mathrm{N\\cdot m}}{\\mathrm{m^3}}=\\dfrac{\\mathrm{J}}{\\mathrm{m^3}}`,600,410,{size:50,g:seg(p,.5,.7)});
  return s;
 },
 [K+'unum']:(p)=>{
  let s=plates({qlab:1})+fieldIn({})+gapFill(.25);
  s+=label('3000 V/m',(G.LX+G.RX)/2,G.PB+40,{size:26,color:EC,anchor:'middle',weight:700});
  s+=card(740,80,420,350,L('例の 板（3 V，d ＝ 1 mm）',950,125,{size:24,color:C.dim})
   +T(`${ut}=\\tfrac12\\times8.85\\times10^{-12}\\times3000^2`,950,215,{size:26})
   +fade(seg(p,.4,.6),T(`\\approx 3.98\\times10^{-5}${U_('J/m^3')}`,950,315,{size:36})),seg(p,0,.15));
  return s;
 },
 [K+'match']:(p)=>{
  let s=plates({qlab:1})+fieldIn({g:.5})+gapFill(.3);
  s+=card(740,70,420,370,L('体積を 掛ける',950,115,{size:24,color:C.dim})
   +T(`0.01\\times0.001=10^{-5}${U_('m^3')}`,950,190,{size:30})
   +fade(seg(p,.3,.5),T(`3.98\\times10^{-5}\\times10^{-5}`,950,270,{size:30}))
   +fade(seg(p,.5,.65),T(`=3.98\\times10^{-10}${U_('J')}`,950,345,{size:34}))
   +fade(seg(p,.7,.85),L('½CV² と 一致 ✓',950,410,{size:28,color:OK,weight:700})),seg(p,0,.15));
  return s;
 },
 // ===== S5 =====
 [K+'box']:(p)=>{
  let s=plates({qlab:0})+fieldIn({})+gapFill(1,{fo:.3});
  s+=fade(seg(p,.1,.3),label('E ＝ 0',G.LX-110,(G.PT+G.PB)/2+12,{size:32,color:C.hi,anchor:'middle',weight:700})+label('E ＝ 0',G.RX+110,(G.PT+G.PB)/2+12,{size:32,color:C.hi,anchor:'middle',weight:700})+label('外',G.LX-110,(G.PT+G.PB)/2-34,{size:24,color:C.dim,anchor:'middle'})+label('外',G.RX+110,(G.PT+G.PB)/2-34,{size:24,color:C.dim,anchor:'middle'}));
  s+=card(790,110,370,280,L('エネルギーは',975,170,{size:28,color:C.ink})+L('電場の ある 板の 間に',975,240,{size:28,color:WC,weight:700})+L('一様に 詰まっている',975,300,{size:28,color:WC})+L('と 見なせる',975,350,{size:24,color:C.dim}),seg(p,.3,.45));
  return s;
 },
 [K+'wave']:(p)=>{
  // sine-like E wave travelling, no charges
  const pts=Array.from({length:121},(_,i)=>{const x=80+i*8.5;return [x,260-80*Math.sin(i/120*4*Math.PI-p*6)];});
  let s=draw(pts,1,{color:EC,w:4});
  for(let i=0;i<12;i++){const x=80+i*85,y=260-80*Math.sin(i*85/8.5/120*4*Math.PI-p*6);s+=arrow(x,260,x,y,{color:EC,w:3,head:10,opacity:.6});}
  s+=line(70,260,1130,260,{color:C.dim,w:2});
  s+=arrow(980,420,1120,420,{color:C.hi,w:4,head:14})+label('電磁波（予告）',900,428,{size:28,color:C.hi,anchor:'end',weight:700});
  s+=label('電荷の ない 空間でも、電場の ある 所に エネルギー',600,90,{size:28,color:WC,anchor:'middle',weight:700});
  return s;
 },
 [K+'widen']:(p)=>widenFig(p,{d2:seg(p,.3,.6),q:1}),
 [K+'widen2']:(p)=>widenFig(p,{d2:1,eq:1,step:2}),
 [K+'widen3']:(p)=>widenFig(p,{d2:1,eq:1,step:3}),
 [K+'widen4']:(p)=>widenFig(p,{d2:1,eq:1,step:4,pull:seg(p,.1,.4)}),
 // ===== S6 =====
 [K+'sum1']:(p)=>{
  let s=card(100,50,1000,420,'',1);
  s+=T(`${Ut}=\\int_0^{${Qt}}\\dfrac{${qt}}{${Ct}}\\,${dq}=\\dfrac{${Qt}^2}{2${Ct}}=\\tfrac12${Ct}${Vt}^2`,600,160,{size:42});
  s+=fade(seg(p,.4,.6),T(`${ut}=\\dfrac{${Ut}}{${St}d}=\\tfrac12${eps}${Et}^2`,600,330,{size:46}));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=plates({qlab:1})+fieldIn({})+gapFill(1,{fo:.3});
  s+=card(760,140,400,220,L('エネルギーは',960,210,{size:28,color:C.ink})+L('電場の ある 空間に',960,270,{size:32,color:WC,weight:700}),seg(p,0,.15));
  return s;
 },
 [K+'next']:(p)=>{
  let s=plates({qlab:1})+fieldIn({k:.6});
  // dielectric slab between plates
  s+=fade(seg(p,.1,.3),rect(G.LX+20,G.PT+10,G.RX-G.LX-40,G.PB-G.PT-20,{fill:'#9ad6a0',fo:.18,stroke:'#9ad6a0',sw:2,rx:6})+label('絶縁体',(G.LX+G.RX)/2,G.PB+40,{size:26,color:'#9ad6a0',anchor:'middle',weight:700}));
  s+=card(760,90,400,330,L('次の 問い',960,140,{size:24,color:C.dim})
   +L('絶縁体を 挟むと',960,210,{size:28,color:C.ink})+L('何が 変わる？',960,260,{size:32,color:C.hi,weight:700})
   +fade(seg(p,.5,.65),L('電池に つないだまま',960,330,{size:24,color:C.ink})+L('／ 外したら？',960,370,{size:24,color:C.ink})),seg(p,.05,.2),C.hi);
  return s;
 },
};
// ---- widening the gap at fixed Q --------------------------------------------------------------------
function widenFig(p,{d2=0,eq=0,step=1,q=1,pull=0}={}){
 const lx=150,rx0=lx+110,rx=mix(rx0,lx+220,d2),pt=G.PT,pb=G.PB;
 let s=plates({lx,rx,qlab:0,n:7});
 s+=fade(.28,rect(lx,pt,rx-lx,pb-pt,{fill:WC,fo:1,stroke:'none',rx:0}));
 s+=fieldIn({lx,rx,k:1});
 s+=label(d2>.5?'2 mm':'1 mm',(lx+rx)/2,pb+40,{size:24,color:C.ink,anchor:'middle'});
 if(pull)s+=fade(pull,arrow(rx+G.PW+10,(pt+pb)/2,rx+G.PW+90,(pt+pb)/2,{color:C.F,w:5,head:14})+label('外から 引く',rx+G.PW+14,(pt+pb)/2-18,{size:22,color:C.F}));
 let c=L('電池を 外す：Q 一定',940,120,{size:26,color:QC,weight:700});
 if(step>=2)c+=fade(step>2?1:seg(p,.05,.2),T(`${Et}=\\dfrac{${Qt}}{${eps}${St}}\\ \\text{→ 同じ}`.replace('\\text{→ 同じ}',''),860,195,{size:34})+label('同じ',1000,205,{size:26,color:EC,weight:700}))
  +fade(step>2?1:seg(p,.3,.45),T(`${ut}=\\tfrac12${eps}${Et}^2`,860,265,{size:32})+label('同じ',1000,275,{size:26,color:WC,weight:700}))
  +fade(step>2?1:seg(p,.55,.7),label('体積 2倍 → U 2倍',940,340,{size:28,color:WC,weight:700,anchor:'middle'}));
 if(step>=3)c+=fade(step>3?1:seg(p,.1,.3),T(`\\tfrac12\\cdot\\dfrac{${Ct}}{2}\\cdot(2${Vt})^2=2\\times\\tfrac12${Ct}${Vt}^2`,940,410,{size:28}));
 if(step===1)c+=fade(seg(p,.6,.75),L('間隔 1 mm → 2 mm',940,220,{size:28,color:C.ink})+L('U は どうなる？',940,290,{size:32,color:C.hi,weight:700}));
 s+=card(680,70,500,380,c,1);
 if(step>=4)s+=fade(seg(p,.4,.6),label('増えた 分 ＝ 引き離す 仕事',940,480,{size:26,color:C.F,anchor:'middle',weight:700}));
 return s;
}

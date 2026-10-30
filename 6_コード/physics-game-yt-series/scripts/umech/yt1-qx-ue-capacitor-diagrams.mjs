// 問題編 解説「10 V の板に κ＝3 を入れる」（q-ue-capacitor、大学編 23 コンデンサ・上級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/23_コンデンサ.md の q-ue-capacitor（解説 20 行）。
// 配置：左に板の断面（左の板＝電池の＋極側で ＋Q、右の板 −Q、𝐄 は右向き）、右に説明の枠。間隔は大きく誇張（1.0 mm を 160 px）。
// 絶縁体は上から板の間へ滑り込む（断面図なので、板に沿う向き＝上下が「横から」にあたる）。札の帯（y＜82）には描かない。
// 行11〜18 は、右に横向きの棒（緑＝電池の仕事、橙＝エネルギーの増加。長さは同じ尺度）、左に小さなグラフ・表。誤答カードは下の中央に1枚ずつ。
// 色：電場 𝐄 水色、電圧 V 紫、電荷 Q 桃（正電荷 赤、負電荷 青）、容量 C 黄、エネルギー U・u 橙、面積 S 金、ε₀・d 白、絶縁体 薄緑、電池の仕事 緑、誤り 赤。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,poly} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,note,sentWin,cueT} from './yt1-qx-common.mjs';

const K='qx-ue-capacitor:';
const POS=C.a,NEG='#7fb3ff',EC=C.x,QCOL=C.p,VCOL=C.v,CCOL=C.hi,UCOL=C.E,SCOL=C.t,BCOL=C.F,DIEL='#9fe0b0',BAD='#ff6b6b';
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const Et=cs(EC,'E'),Vt=cs(VCOL,'V'),Ct=cs(CCOL,'C'),Ut=cs(UCOL,'U'),ut=cs(UCOL,'u'),Qt=cs(QCOL,'Q'),St=cs(SCOL,'S'),eps='\\varepsilon_0';
const HALF='\\tfrac{1}{2}';
const G1='エネルギー密度 u（J/m³）',G2='電池の仕事と、エネルギーの増加',G3='残りの行き先';
const ANS1=g=>answerTag(1,'A','4.4×10⁻⁴ J/m³',{g}),ANS2=g=>answerTag(2,'B','',{g}),ANS3=g=>answerTag(3,'A','',{g});
const PX=700,PW=480,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);

// ---- 板の断面・電池・絶縁体 ----
const F={LIN:240,GP:160,PW:22,T:130,B:360,WY:440,BX:320,CLIP:126};
const R=F.LIN+F.GP;
function plates({g=1,n=3,lin=F.LIN,gp=F.GP,t=F.T,b=F.B}={}){
 const r=lin+gp;let s=rect(lin-F.PW,t,F.PW,b-t,{fill:'#8795ad',fo:.3,stroke:C.dim,sw:2,rx:3})+rect(r,t,F.PW,b-t,{fill:'#8795ad',fo:.3,stroke:C.dim,sw:2,rx:3});
 for(let i=0;i<n;i++){const y=t+(b-t)*(i+.5)/n;
  s+=label('＋',lin-F.PW/2,y+9,{size:24,color:POS,anchor:'middle',weight:700})+label('−',r+F.PW/2,y+11,{size:34,color:NEG,anchor:'middle',weight:700});}
 return fade(g,s);
}
function battery({g=1,lab='電池 10 V'}={}){
 const a=F.LIN-F.PW/2,b=R+F.PW/2;
 let s=draw([[a,F.B],[a,F.WY],[F.BX-10,F.WY]],1,{color:C.dim,w:4})+draw([[F.BX+10,F.WY],[b,F.WY],[b,F.B]],1,{color:C.dim,w:4});
 s+=line(F.BX-10,F.WY-30,F.BX-10,F.WY+30,{color:C.ink,w:5})+line(F.BX+10,F.WY-16,F.BX+10,F.WY+16,{color:C.ink,w:9});
 s+=label('＋',F.BX-30,F.WY-16,{size:24,color:POS,anchor:'middle',weight:700})+label('−',F.BX+30,F.WY-16,{size:26,color:NEG,anchor:'middle',weight:700});
 if(lab)s+=label(lab,F.BX+48,F.WY+44,{size:26,color:VCOL,weight:700});
 return fade(g,s);
}
const dimLine=(g=1)=>fade(g,line(F.LIN,112,R,112,{color:C.ink,w:2.5})+line(F.LIN,103,F.LIN,121,{color:C.ink,w:2.5})+line(R,103,R,121,{color:C.ink,w:2.5})
 +label('d ＝ 1.0 mm',(F.LIN+R)/2,100,{size:26,color:C.ink,anchor:'middle',weight:700}));
const sLab=(g=1)=>fade(g,label('S ＝ 0.02 m²',F.LIN-F.PW-14,200,{size:26,color:SCOL,anchor:'end',weight:700}));
const c0Lab=(g=1,txt='C₀ ＝ 177 pF')=>fade(g,label(txt,R+F.PW+18,150,{size:26,color:CCOL,weight:700}));
const exag=(g=1)=>note('（間隔は 大きく 誇張）',40,505,{g,anchor:'start'});
const gapFill=(g=1,fo=.28)=>fade(g,rect(F.LIN,F.T,F.GP,F.B-F.T,{fill:UCOL,fo,stroke:'none',rx:0}));
// 絶縁体（薄緑）：ins＝0〜1 で上から板の間へ入る。y＜CLIP は描かない
function dielectric(ins,{g=1,lab=1}={}){
 if(g<=.001||ins<=0)return '';
 const h=F.B-F.T,top=F.T-(1-ins)*h,y0=Math.max(top,F.CLIP),y1=top+h;
 if(y1<=y0)return '';
 let s=rect(F.LIN+2,y0,F.GP-4,y1-y0,{fill:DIEL,fo:.35,stroke:DIEL,sw:2,rx:2});
 if(lab&&y1-y0>40)s+=label('κ ＝ 3',(F.LIN+R)/2,Math.min(y1-14,(y0+y1)/2+10),{size:26,color:DIEL,anchor:'middle',weight:700});
 return fade(g,s);
}
// 小さな立方体（取り出した 1 m³ の見本）
function cube(x,y,s,{g=1,glow=0,txt='',txtColor=UCOL}={}){
 const o=s*.35;
 let c=poly([[x,y],[x+s,y],[x+s+o,y-o],[x+o,y-o]],{fill:UCOL,fo:.45,stroke:UCOL,sw:2})+poly([[x+s,y],[x+s+o,y-o],[x+s+o,y+s-o],[x+s,y+s]],{fill:UCOL,fo:.3,stroke:UCOL,sw:2})
  +rect(x,y,s,s,{fill:UCOL,fo:.55,stroke:UCOL,sw:2,rx:0});
 if(glow)c+=fade(glow,ring(x+s/2+o/2,y+s/2-o/2,s*.95,{color:C.hi,w:4}));
 if(txt)c+=label(txt,x+s/2,y+s+40,{size:26,color:txtColor,anchor:'middle',weight:700});
 return fade(g,c);
}
const CUBE_FROM=[F.LIN+55,215,46],CUBE_TO=[500,250,90];
function cubeAt(u,o={}){const [x0,y0,s0]=CUBE_FROM,[x1,y1,s1]=CUBE_TO;return cube(mix(x0,x1,u),mix(y0,y1,u),mix(s0,s1,u),o);}
function fieldIn({g=1,k=1}={}){if(g<=.001)return '';let s='';for(const y of [170,245,320])s+=arrow(F.LIN+35,y,F.LIN+35+90*k,y,{color:EC,w:4,head:13});return fade(g,s);}
// 棒の枠（問題アニメと行8〜10：右下、長さなし）
function barFrames({g=1}={}){
 const x0=760,w=380;
 return fade(g,label('電池の仕事',x0,345,{size:26,color:BCOL,weight:700})+rect(x0,358,w,44,{fill:'none',fo:0,stroke:BCOL,sw:2.5,rx:4})
  +label('エネルギーの増加',x0,440,{size:26,color:UCOL,weight:700})+rect(x0,453,w,44,{fill:'none',fo:0,stroke:UCOL,sw:2.5,rx:4}));
}
// 棒（行11〜18：右半分。同じ尺度で 3.54×10⁻⁸ J ＝ 440 px）
const BX0=660,BL=440,BY1=130,BY2=250,BH=60;
function bars({g=1,b1=1,b2=1,diff=0,diffLab=0,lab1=1,lab2=1}={}){
 let s=label('電池の仕事',BX0,BY1-14,{size:26,color:BCOL,weight:700})+fade(lab1*seg(b1,.9,1),label('3.54×10⁻⁸ J',BX0+BL,BY1-14,{size:26,color:BCOL,anchor:'end',weight:700}));
 s+=rect(BX0,BY1,BL,BH,{fill:'none',fo:0,stroke:BCOL,sw:2,rx:4})+rect(BX0,BY1,BL*b1,BH,{fill:BCOL,fo:.45,stroke:BCOL,sw:2.5,rx:4});
 s+=label('エネルギーの増加',BX0,BY2-14,{size:26,color:UCOL,weight:700})+fade(lab2*seg(b2,.9,1),label('1.77×10⁻⁸ J',BX0+BL/4,BY2+BH+32,{size:26,color:UCOL,anchor:'middle',weight:700}));
 s+=rect(BX0,BY2,BL,BH,{fill:'none',fo:0,stroke:UCOL,sw:2,rx:4})+rect(BX0,BY2,BL/2*b2,BH,{fill:UCOL,fo:.5,stroke:UCOL,sw:2.5,rx:4});
 s+=fade(diff,rect(BX0+BL/2,BY1-6,BL/2,BY2+BH-BY1+12,{fill:C.hi,fo:.05,stroke:C.hi,sw:2.5,rx:6}).replace('<rect','<rect stroke-dasharray="9 7"')
  +line(BX0+BL/2,BY1+BH+4,BX0+BL/2,BY2-4,{color:C.dim,w:2,dash:'6 6'}));
 s+=fade(diffLab,label('引き込む',BX0+BL*3/4,BY2+BH/2-4,{size:24,color:C.hi,anchor:'middle',weight:700})+label('仕事など',BX0+BL*3/4,BY2+BH/2+24,{size:24,color:C.hi,anchor:'middle',weight:700}));
 return fade(g,s);
}
const WCARD={x:150,w:900,y:385};

export const ytQxUeCapacitorDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（4 秒）：0〜2 s 平行板・電池・S・d・C₀ → 2〜4 s 板の間を薄い橙で満たし、立方体を1つ取り出して横に置く「1 m³ あたり u＝？」。静止。
 [K+'q1']:(p)=>{
  let s=plates({g:seg(p,0,.2)})+battery({g:seg(p,.1,.3)})+sLab(seg(p,.25,.42))+dimLine(seg(p,.3,.47))+c0Lab(seg(p,.35,.5))+exag(seg(p,.3,.47));
  s+=gapFill(seg(p,.5,.65));
  const u=seg(p,.68,.9);
  if(p>.62)s+=cubeAt(u,{g:seg(p,.62,.68),txt:u>.95?'1 m³ あたり u ＝ ？':''});
  return s;
 },
 // 小問2（5 秒）：立方体を消す → 絶縁体 κ＝3 が上から板の間へゆっくり入り、すき間なく埋まって止まる → 右下に棒の枠（長さなし）。
 [K+'q2']:(p)=>{
  let s=plates()+battery()+sLab()+dimLine()+c0Lab()+exag();
  s+=gapFill(1-seg(p,0,.12));
  s+=cubeAt(1,{g:1-seg(p,0,.12),txt:'1 m³ あたり u ＝ ？'});
  s+=dielectric(seg(p,.15,.75));
  s+=barFrames({g:seg(p,.78,.95)});
  return s;
 },

 // ===================== 小問1 =====================
 [K+'intro']:(p)=>plates()+battery()+sLab()+dimLine()+c0Lab()+exag()+gapFill()+cubeAt(1,{txt:'1 m³ あたり u ＝ ？'}),
 // 2. 求めるもの。板の間の橙と立方体を光らせる
 [K+'goal1']:(p)=>{
  const gl=seg(p,.3,.45)*(1-seg(p,.8,.95));
  let s=plates()+battery()+sLab()+dimLine()+c0Lab()+exag()+gapFill(1,.28+.25*gl)+cubeAt(1,{glow:gl,txt:'1 m³ あたり u ＝ ？'});
  return s+goalTag(G1,{g:seg(p,.03,.15)});
 },
 // 3. 一様な電場の矢印「1.0×10⁴ V/m」と E＝V/d の計算
 [K+'field']:(p)=>{
  let s=plates()+battery()+sLab()+dimLine()+exag()+gapFill(1,.15)+fieldIn({g:seg(p,.05,.2)});
  s+=fade(seg(p,.15,.3),label('1.0×10⁴ V/m',R+F.PW+18,250,{size:26,color:EC,weight:700}));
  s+=panel(100,240,T(`${Et}=\\dfrac{${Vt}}{d}=\\dfrac{10}{0.001}`,PC,185,40)
   +fade(seg(p,.45,.6),T(`=${cs(EC,'1.0\\times10^{4}\\,\\mathrm{V/m}')}`,PC,285,40)),seg(p,.05,.15));
  return s+goalTag(G1);
 },
 // 4. u＝½ε₀E²（1文目）→ ½CV²÷(Sd) に C＝ε₀S/d、V＝Ed を入れ、S と d に打ち消し線（2文目）
 [K+'form']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.35;
  const target=`${ut}=${HALF}${eps}${Et}^2`;
  let s=fade(seg(p,.03,.12),T(target,600,150,52)+highlight(600-150,95,300,85,1,UCOL));
  s+=fade(seg(p,b,b+.08),T(`${ut}=\\dfrac{${HALF}${Ct}${Vt}^2}{${St}d}`,330,290,40));
  s+=fade(seg(p,b+.12,b+.2),label('C ＝ ε₀S/d、V ＝ Ed を 入れる',330,400,{size:26,color:C.dim,anchor:'middle'}));
  const cn=seg(p,b+.3,b+.38)>.5;
  const Sx=cn?`{\\color{${BAD}}\\cancel{${St}}}`:St,dx=cn?`{\\color{${BAD}}\\cancel{d}}`:'d',d2=cn?`{\\color{${BAD}}\\cancel{d^2}}`:'d^2';
  s+=fade(seg(p,b+.2,b+.28),T(`=\\dfrac{${HALF}\\cdot\\dfrac{${eps}${Sx}}{${dx}}\\cdot${Et}^2${d2}}{${Sx}\\,${dx}}`,860,290,40));
  s+=fade(seg(p,b+.45,b+.55),T(`=${HALF}${eps}${Et}^2`,860,430,44));
  return s+goalTag(G1);
 },
 // 5. E²＝10⁸ を黄で。u≈4.4×10⁻⁴ J/m³（立方体に橙）。2文目で答えの札
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=plates()+battery()+sLab()+dimLine()+exag()+gapFill()+cubeAt(1,{txt:seg(p,.5,.6)>0?'u ≈ 4.4×10⁻⁴ J/m³':'1 m³ あたり u ＝ ？'});
  s+=panel(100,260,T(`${ut}=${HALF}\\times8.85\\times10^{-12}\\times${cs(C.hi,'10^{8}')}`,PC,175,32)
   +label('E² ＝ (10⁴)² ＝ 10⁸',PC,240,{size:26,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.3,.45),T(`\\approx${cs(UCOL,'4.4\\times10^{-4}\\,\\mathrm{J/m^3}')}`,PC,315,36)),seg(p,.03,.12));
  return s+goalTag(G1)+ANS1(seg(p,b,b+.08));
 },
 // 6. 立方体が並んで板の間を埋める。u×体積 と ½CV² が一致
 [K+'check']:(p)=>{
  let s=plates()+battery()+sLab()+dimLine()+exag();
  const n=5,m=2,cw=F.GP/m,ch=(F.B-F.T)/n,fill=seg(p,.05,.35);
  for(let i=0;i<n;i++)for(let j=0;j<m;j++){const k=i*m+j,g=clamp(fill*n*m-k);s+=fade(g,rect(F.LIN+j*cw+2,F.T+i*ch+2,cw-4,ch-4,{fill:UCOL,fo:.45,stroke:UCOL,sw:1.5,rx:2}));}
  s+=panel(100,330,label('u × 体積（体積 2×10⁻⁵ m³）',PC,150,{size:24,color:C.dim,anchor:'middle'})
   +T(`=${cs(UCOL,'8.85\\times10^{-9}\\,\\mathrm{J}')}`,PC,205,36)
   +fade(seg(p,.4,.55),label('½CV²',PC,270,{size:24,color:C.dim,anchor:'middle'})+T(`=${HALF}\\times177\\times10^{-12}\\times100`,PC,320,30)+T(`=${cs(UCOL,'8.85\\times10^{-9}\\,\\mathrm{J}')}`,PC,385,36)),1);
  s+=fade(seg(p,.6,.72),label('一致',PC,470,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s+goalTag(G1)+ANS1(1);
 },
 // 7. 誤答 B → C（1文目）→ D（2文目）
 [K+'wrong1']:(p,ctx)=>{
  const W=sentWin(ctx),e0=W[0][1],wB=[0,e0*.45],wC=[e0*.45,e0],wD=[W[1]?W[1][0]:.6,1];
  let s=card(300,100,600,170,T(`${ut}=${HALF}${eps}${Et}^2\\approx${cs(UCOL,'4.4\\times10^{-4}\\,\\mathrm{J/m^3}')}`,600,195,40),1,UCOL);
  s+=wrongSeq(p,ctx,[['B','8.9×10⁻⁴','½ を掛け忘れ'],['C','4.4×10⁻¹⁰','E の代わりに 10 V（単位 J/m）'],['D','4.4×10⁻⁸','2乗し忘れ']],{win:[wB,wC,wD],opts:{y:310}});
  return s+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 // 8. カードと立方体を消す。右下に緑と橙の棒の枠
 [K+'goal2']:(p)=>plates()+battery()+sLab()+dimLine()+c0Lab()+exag()+barFrames({g:seg(p,.2,.4)})+goalTag(G2,{g:seg(p,.03,.15)}),
 // 9. 「V を固定」（紫枠）。絶縁体が滑り込む。C：177 pF → 531 pF
 [K+'fixV']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,ins=seg(p,b-.1,b+.3);
  let s=plates()+battery()+sLab()+dimLine()+exag()+dielectric(ins);
  s+=c0Lab(1-seg(p,b+.3,b+.36))+c0Lab(seg(p,b+.34,b+.42),'C ＝ 531 pF');
  s+=panel(100,120,label('電池に つないだ まま',PC,145,{size:26,color:C.dim,anchor:'middle'})+label('V を 固定',PC,198,{size:34,color:VCOL,anchor:'middle',weight:700}),seg(p,.05,.15),VCOL);
  s+=fade(seg(p,b+.3,b+.42),panel(250,110,T(`${Ct}:177\\,\\mathrm{pF}\\ \\to\\ ${cs(CCOL,'531\\,\\mathrm{pF}')}`,PC,300,34)+label('κ 倍',PC,345,{size:24,color:C.dim,anchor:'middle'}),1,CCOL));
  return s+goalTag(G2);
 },
 // 10. 電池から板へ電荷が流れ込み、＋−の印が3倍に。ΔQ＝2Q₀
 [K+'charge']:(p,ctx)=>{
  const flow=seg(p,.05,.6),n=3+Math.round(6*flow);
  let s=plates({n})+battery()+sLab()+dimLine()+exag()+dielectric(1)+c0Lab(1,'C ＝ 531 pF');
  if(flow>0&&flow<1){const a=F.LIN-F.PW/2,b=R+F.PW/2;
   for(let i=0;i<3;i++){const u=((cueT(ctx)*.9)+i/3)%1,y=mix(F.WY,F.B,u);s+=dot(a,y,8,QCOL)+dot(b,y,8,NEG);}}
  s+=panel(100,300,T(`${Qt}=${Ct}${Vt}`,PC,150,36)
   +fade(seg(p,.1,.25),T(`1.77\\times10^{-9}\\,\\mathrm{C}\\ \\to\\ ${cs(QCOL,'5.31\\times10^{-9}\\,\\mathrm{C}')}`,PC,225,30))
   +fade(seg(p,.6,.75),line(PX+40,265,PX+PW-40,265,{color:C.faint,w:2})+label('増えた 電荷',PC,305,{size:24,color:C.dim,anchor:'middle'})
    +T(`\\Delta ${Qt}=2${cs(QCOL,'Q_0')}=3.54\\times10^{-9}\\,\\mathrm{C}`,PC,360,30)),1);
  return s+goalTag(G2);
 },
 // 11. 左に電池の V–q グラフ（10 V の水平な線、下の長方形を緑）、右に緑の棒が 3.54×10⁻⁸ J まで伸びる
 [K+'batt']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55,gin=seg(p,0,.06);
  const x0=110,y0=420,w=440,h=240,X=q=>x0+w*q/6,Y=v=>y0-h*v/12;
  let g=arrow(x0,y0,x0+w+26,y0,{color:C.dim,w:3,head:12})+arrow(x0,y0,x0,y0-h-26,{color:C.dim,w:3,head:12});
  g+=label('q',x0+w+34,y0+8,{size:26,color:QCOL,weight:700})+label('電池の 電圧',x0,y0-h-40,{size:24,color:VCOL,anchor:'middle',weight:700});
  g+=line(x0-8,Y(10),x0,Y(10),{color:C.dim,w:2})+label('10 V',x0-12,Y(10)+8,{size:24,color:VCOL,anchor:'end'});
  g+=line(X(1.77),y0,X(1.77),y0+8,{color:C.dim,w:2})+line(X(5.31),y0,X(5.31),y0+8,{color:C.dim,w:2});
  g+=label('Q₀',X(1.77),y0+34,{size:24,color:QCOL,anchor:'middle',weight:700})+label('3Q₀',X(5.31),y0+34,{size:24,color:QCOL,anchor:'middle',weight:700});
  g+=line(x0,Y(10),x0+w,Y(10),{color:VCOL,w:5});
  const rg=seg(p,.15,.35);
  g+=fade(rg,rect(X(1.77),Y(10),X(5.31)-X(1.77),y0-Y(10),{fill:BCOL,fo:.4,stroke:BCOL,sw:2.5,rx:0})+label('10 V × ΔQ',(X(1.77)+X(5.31))/2,Y(5)+10,{size:26,color:C.ink,anchor:'middle',weight:700}));
  g+=fade(seg(p,b,b+.08),label('電圧は 一定 → 長方形、½ は 付かない',330,500,{size:26,color:C.hi,anchor:'middle',weight:700}));
  let s=fade(gin,g);
  s+=fade(gin,bars({b1:seg(p,.3,.55),b2:0,lab2:0}));
  s+=fade(seg(p,.3,.45),T(`10\\times3.54\\times10^{-9}=${cs(BCOL,'3.54\\times10^{-8}\\,\\mathrm{J}')}`,BX0+BL/2,400,30));
  return s+goalTag(G2);
 },
 // 12. U：8.85×10⁻⁹ → 2.66×10⁻⁸ J。橙の棒が 1.77×10⁻⁸ J（緑のちょうど半分）。2文目で答えの札
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=bars({b2:seg(p,.3,.55)});
  s+=card(40,110,560,250,label('コンデンサの エネルギー（½CV²）',320,155,{size:24,color:C.dim,anchor:'middle'})
   +T(`${Ut}:8.85\\times10^{-9}\\ \\to\\ 2.66\\times10^{-8}\\,\\mathrm{J}`,320,215,28)
   +label('（3倍）',320,260,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.2,.35),T(`2${cs(UCOL,'U_0')}=${cs(UCOL,'1.77\\times10^{-8}\\,\\mathrm{J}')}`,320,320,32)),seg(p,.02,.1));
  s+=fade(seg(p,.55,.68),label('緑の ちょうど 半分',BX0+BL/4,BY2+BH+70,{size:26,color:UCOL,anchor:'middle',weight:700}));
  return s+goalTag(G2)+ANS2(seg(p,b,b+.08));
 },
 // 13. 誤答 A → C
 [K+'wrongAC']:(p,ctx)=>{
  let s=bars();
  s+=wrongSeq(p,ctx,[['A','電池の仕事が全部たまると考えた',[]],['C','電池の仕事に ½ を付けた',[]]],{opts:WCARD});
  return s+goalTag(G2)+ANS2(1);
 },
 // 14. 誤答 D（1文目）→ Q 一定と V 一定の表（2文目）
 [K+'wrongD']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=wrongCard('D','電池を外した場合（Q 一定）と取り違え',[],{x:150,w:900,y:110,g:seg(p,.02,.08)});
  const x0=250,y0=230,cw=[300,400],rh=70;
  const rows=[['','U の 変わり方'],['Q 一定（電池を 外す）','1/3 に 減る'],['V 一定（つないだ まま）','3倍に 増える']];
  rows.forEach((r,i)=>{let xx=x0;const g=seg(p,b+.05*i,b+.05*i+.08);r.forEach((c,j)=>{const w=cw[j];
   s+=fade(g,rect(xx,y0+i*rh,w,rh,{fill:i===0?'#1a2744':'#131f38',fo:.95,stroke:C.faint,sw:2,rx:0})+label(c,xx+w/2,y0+i*rh+rh/2+10,{size:i===0?24:26,color:i===0?C.dim:j===0?(i===1?QCOL:VCOL):C.ink,anchor:'middle',weight:700}));xx+=w;});});
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 // 15. 緑と橙の棒を残し、差の部分を点線で囲む
 [K+'goal3']:(p)=>bars({diff:seg(p,.3,.5)})+goalTag(G3,{g:seg(p,.03,.15)}),
 // 16. 絶縁体を途中まで入れた状態。分極の電荷（＋の板側に −、−の板側に ＋）と、引き込む向きの力
 [K+'pol']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=plates({n:9})+battery()+sLab()+exag()+dielectric(.5,{lab:0});
  const h=F.B-F.T,top=F.T-.5*h,y1=top+h,pg=seg(p,.1,.25);
  for(let i=0;i<4;i++){const y=F.T+12+(y1-F.T-24)*(i+.5)/4;
   s+=fade(pg,label('−',F.LIN+16,y+10,{size:30,color:NEG,anchor:'middle',weight:700})+label('＋',R-16,y+8,{size:24,color:POS,anchor:'middle',weight:700}));}
  s+=fade(pg,label('κ ＝ 3',(F.LIN+R)/2,F.T+40,{size:26,color:DIEL,anchor:'middle',weight:700}));
  s+=fade(seg(p,b,b+.1),arrow((F.LIN+R)/2,F.T+70,(F.LIN+R)/2,F.T+190,{color:C.dim,w:7,head:20}));
  s+=panel(100,150,label('分極の 電荷',PC,150,{size:28,color:C.ink,anchor:'middle',weight:700})+label('板と 逆の 符号',PC,200,{size:26,color:C.dim,anchor:'middle'}),seg(p,.15,.25));
  s+=panel(280,120,label('引き込まれる 向きの 力',PC,330,{size:28,color:C.ink,anchor:'middle',weight:700})+label('（灰色の 矢印）',PC,370,{size:24,color:C.dim,anchor:'middle'}),seg(p,b+.05,b+.15));
  s+=note('（途中まで 入れた ところ）',PC,450,{g:seg(p,.1,.2)});
  return s+goalTag(G3);
 },
 // 17. 棒の差に「引き込む仕事など」。2文目で答えの札
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=bars({diff:1,diffLab:seg(p,.2,.35)});
  s+=fade(seg(p,.35,.5),label('電池の 仕事の 残り 半分 → 絶縁体を 引き込む 仕事など',600,430,{size:28,color:C.ink,anchor:'middle',weight:700}));
  return s+goalTag(G3)+ANS3(seg(p,b,b+.08));
 },
 // 18. 誤答 B → C
 [K+'wrongBC']:(p,ctx)=>bars({diff:1,diffLab:1})+wrongSeq(p,ctx,[['B','分極で電荷は消えない',[]],['C','端を無視、外の電場は 0',[]]],{opts:WCARD})+goalTag(G3)+ANS3(1),
 // 19. 誤答 D。絶縁体を入れる前後で、水色の矢印の長さが同じ
 [K+'wrongD3']:(p,ctx)=>{
  const mini=(ox,diel,txt)=>{const lin=ox,gp=130,t=150,b=350;
   let s=plates({lin,gp,t,b,n:diel?9:3});
   if(diel)s+=rect(lin+2,t,gp-4,b-t,{fill:DIEL,fo:.3,stroke:DIEL,sw:2,rx:2});
   for(const y of [190,250,310])s+=arrow(lin+20,y,lin+110,y,{color:EC,w:4,head:13});
   s+=label(txt,lin+gp/2,b+44,{size:26,color:C.ink,anchor:'middle',weight:700});return s;};
  let s=fade(seg(p,.02,.12),mini(130,0,'入れる 前')+mini(430,1,'入れた 後'));
  s+=fade(seg(p,.15,.3),label('矢印の 長さは 同じ',345,460,{size:28,color:EC,anchor:'middle',weight:700}));
  s+=wrongCard('D','V 一定なら E＝V/d も一定',[],{x:PX,w:PW,y:200,size:26,g:seg(p,.02,.08)});
  return s+goalTag(G3)+ANS3(1);
 },

 // ===================== まとめ =====================
 [K+'sum']:(p)=>{
  let s=fade(seg(p,.03,.15),label('電場の ある 空間に、1 m³ あたり u の 密度で 蓄えられる',600,180,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.15,.3),T(`${ut}=${HALF}${eps}${Et}^2`,600,320,64)+highlight(600-170,250,340,130,1,UCOL));
  s+=answerRow([[1,'A','4.4×10⁻⁴ J/m³'],[2,'B',''],[3,'A','']],{g:seg(p,.6,.72)});
  return s;
 },
};

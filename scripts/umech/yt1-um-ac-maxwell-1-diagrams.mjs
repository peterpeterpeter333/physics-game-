// YouTube シリーズ「マクスウェル方程式・中級 1/2」(ys-um-ac-maxwell-1) — 図。Stage 1200×515.
// 色：電流 I 緑、電圧 V 紫、時間 t・周期 T 金、位相・位相差 橙、中身の倍率 ω の枠・強調 黄、電荷 q 桃、容量 C 黄、誤り 赤。ω・L・R は白。
// グラフ：横軸は周期 T を単位にした時刻（u＝t/T）。I＝sin 2πu（緑）、コイルの V＝cos 2πu（紫）。V の山 u＝0, 1、I の山 u＝1/4 → V が T/4 先。
// 回路：交流電源は左の辺、コイルは右の辺。上の導線で右向きを電流の正（交流と波・初級と同じ）。電流はコイルの上の端から入る → 上の端が ＋。
// 部品は export して 2/2 でも使う（関数・定数の export は図の登録に入らない）。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,tex,texWidth} from './anim.mjs';
import {IC,VC,TC,PH,cs,card,ok,ng,P,TAU} from './yt1-ui-ac-waves-1-diagrams.mjs';

const K='um-ac-maxwell-1:';
export const QC=C.p,CC=C.hi,HI=C.hi,BAD=C.a;
export const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});
export const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
// TeX pieces
export const tI=cs(IC,'I'),tI0=cs(IC,'I_0'),tV=cs(VC,'V'),tV0=cs(VC,'V_0'),tt=cs(TC,'t'),tT=cs(TC,'T');
export const wt=`\\omega ${tt}`,tq=cs(QC,'q'),tC=cs(CC,'C');
export const Isin=`${tI0}\\sin ${wt}`;
export const dIdt=`\\dfrac{d${tI}}{d${tt}}`;
const U=s=>`\\,\\mathrm{${s}}`;

// ---- symbols ------------------------------------------------------------------------------------
// vertical coil from (x,y1) to (x,y2), bumps to the right
export function coilV(x,y1,y2,{n=5,color=C.ink,w=4}={}){const r=(y2-y1)/(2*n);let d=`M${x} ${y1}`;for(let i=0;i<n;i++)d+=` a${r} ${r} 0 0 1 0 ${2*r}`;return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}"/>`;}
export function capV(x,ym,{gap=22,wp=70,color=C.ink,w=6}={}){return line(x-wp/2,ym-gap/2,x+wp/2,ym-gap/2,{color,w})+line(x-wp/2,ym+gap/2,x+wp/2,ym+gap/2,{color,w});}
export function acSource(x,y,{r=40}={}){return ring(x,y,r,{color:C.ink,w:3,fill:C.bg})+draw(Array.from({length:41},(_,i)=>[x-24+48*i/40,y-12*Math.sin(TAU*i/40)]),1,{color:C.ink,w:3});}
// loop: AC source on the left side, element on the right side ('coil' | 'cap' | 'R'); I>0 → rightward on the top wire
export function circuit({x1=150,x2=470,y1=110,y2=410,el='coil',I=1,g=1,signs=0,lab=1}={}){
 const my=(y1+y2)/2;let o='';
 o+=draw([[x1,my-40],[x1,y1],[x2,y1],[x2,my-75]],1,{color:C.dim,w:4})+draw([[x2,my+75],[x2,y2],[x1,y2],[x1,my+40]],1,{color:C.dim,w:4});
 if(el==='coil')o+=coilV(x2,my-75,my+75,{n:5})+(lab?label('コイル L',x2+44,my+8,{size:24,color:C.dim}):'');
 else if(el==='cap')o+=line(x2,my-75,x2,my-11,{color:C.dim,w:4})+line(x2,my+11,x2,my+75,{color:C.dim,w:4})+capV(x2,my)+(lab?label('コンデンサ C',x2+44,my+120,{size:24,color:C.dim}):'');
 else{const zz=[[x2,my-75]];for(let i=1;i<=6;i++)zz.push([x2+(i%2?16:-16),my-75+25*i-12]);zz.push([x2,my+75]);o+=draw(zz,1,{color:C.ink,w:3})+(lab?label('抵抗 R',x2+34,my+8,{size:24,color:C.dim}):'');}
 o+=acSource(x1,my)+(lab?label('交流電源',x1-50,my+8,{size:24,color:C.dim,anchor:'end'}):'');
 if(Math.abs(I)>.05){const cx=(x1+x2)/2,len=130*I;o+=arrow(cx-len/2,y1-30,cx+len/2,y1-30,{color:IC,w:6,head:18})+label('I',cx,y1-50,{size:28,color:IC,anchor:'middle',weight:700});}
 if(signs)o+=fade(signs,label('＋',x2-22,my-70,{size:30,color:VC,anchor:'end',weight:700})+label('−',x2-22,my+92,{size:34,color:VC,anchor:'end',weight:700})+arrow(x2,y1+2,x2,my-80,{color:IC,w:4,head:14}));
 return fade(g,o);
}

// ---- stacked time graphs (u = t/T) ----------------------------------------------------------------
export const X0=150,XW=600,UMAX=1.2,XU=u=>X0+XW*u/UMAX;
export const TOP=130,BOT=355,AMP=75;
export function panel(cy,{amp=AMP,name='',col=IC,g=1}={}){
 let s=arrow(X0-10,cy,XU(UMAX)+30,cy,{color:C.dim,w:2.5,head:14})+line(X0,cy-amp-20,X0,cy+amp+20,{color:C.dim,w:2.5});
 s+=label('t',XU(UMAX)+44,cy+8,{size:26,color:TC});
 if(name)s+=label(name,X0-18,cy+9,{size:30,color:col,anchor:'end',weight:700});
 return fade(g,s);
}
export function tgrid({g=1,y1=TOP-AMP-20,y2=BOT+AMP+20,labels=['T/4','T/2','3T/4','T']}={}){
 let s='';[.25,.5,.75,1].forEach((u,i)=>{s+=line(XU(u),y1,XU(u),y2,{color:C.grid,w:1.5})+label(labels[i],XU(u),y2+30,{size:22,color:TC,anchor:'middle'});});
 return fade(g,s);
}
export function curve(cy,f,{amp=AMP,p=1,color=IC,w=5,from=0,to=1.15,dash=''}={}){
 return draw(Array.from({length:181},(_,i)=>{const u=from+(to-from)*i/180;return [XU(u),cy-amp*f(u)];}),p,{color,w,dash});
}
export const sI=u=>Math.sin(TAU*u),cV=u=>Math.cos(TAU*u);
// tangent segment on a panel curve
export function tangent(cy,f,df,u,{amp=AMP,h=.07,color=HI,w=5}={}){
 const y=cy-amp*f(u),k=amp*df(u);return draw([[XU(u-h),y+k*h],[XU(u+h),y-k*h]],1,{color,w})+dot(XU(u),y,9,color);
}
export function stack({g=1,pi=1,pv=1,showV=1,grid=1,vname='V',iname='I',vf=cV,vcol=VC}={}){
 let s=tgrid({g:grid*g})+panel(TOP,{name:iname,col:IC,g})+curve(TOP,sI,{p:pi,color:IC});
 if(showV)s+=panel(BOT,{name:vname,col:vcol,g})+curve(BOT,vf,{p:pv,color:vcol});
 return s;
}
// rotating point on a circle; angle arc in orange
export function phaseCircle(u,{cx=960,cy=260,R=120,g=1,lab=1,arcR=46}={}){
 const [px,py]=P(cx,cy,R,u);
 let s=line(cx-R-20,cy,cx+R+20,cy,{color:C.faint,w:2})+line(cx,cy+R+20,cx,cy-R-20,{color:C.faint,w:2})+ring(cx,cy,R,{color:C.dim,w:3});
 const um=u%TAU;if(um>.03)s+=draw(Array.from({length:61},(_,i)=>P(cx,cy,arcR,um*i/60)),1,{color:PH,w:5});
 s+=line(cx,cy,px,py,{color:IC,w:4})+dot(px,py,11,IC);
 if(lab)s+=T(cs(PH,'\\omega t'),cx+arcR+34,cy-14,{size:30})+label('I₀',(cx+px)/2-18,(cy+py)/2-10,{size:26,color:IC,anchor:'end',weight:700});
 return fade(g,s);
}

export const ytUmAcMaxwell1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  const A=axes({x:110,y:440,w:600,h:320,xmax:5.4,ymax:1.2,xlabel:'t',ylabel:'電荷 q',xcolor:TC,ycolor:QC,g:seg(p,0,.12)});
  let s=A.svg+line(A.X(0),A.Y(1),A.X(5.3),A.Y(1),{color:QC,w:2,dash:'8 8'});
  s+=A.plot(t=>1-Math.exp(-t),{from:0,to:5.2,p:seg(p,.08,.7),color:QC,w:5});
  [1,2,3,4,5].forEach(k=>{s+=fade(seg(p,.3,.45),line(A.X(k),A.Y(0)-6,A.X(k),A.Y(0)+6,{color:TC,w:2})+label(k===1?'τ':`${k}τ`,A.X(k),A.Y(0)+32,{size:22,color:TC,anchor:'middle'}));});
  s+=card(800,110,360,250,L('一定の 電池 V₀',980,170,{size:28,color:VC,weight:700})+T(`\\tau=R${tC}`,980,250,{size:48})+L('ごとに 行き先へ',980,320,{size:24,color:C.dim}),seg(p,.2,.35),VC);
  return s;
 },
 [K+'lastq']:(p)=>{
  const A=axes({x:110,y:430,w:980,h:300,xmax:3,ymin:-1.3,ymax:1.3,xlabel:'t',xcolor:TC});
  let s=fade(.35,A.svg+A.plot(t=>Math.sin(TAU*t),{from:0,to:2.9,color:VC,w:4}));
  s+=card(200,110,800,290,L('前回の 最後の問い',600,165,{color:C.dim})+L('電圧が 正弦波で 揺れ続けたら？',600,240,{size:34,color:VC,weight:700})+L('コイルと コンデンサは どう応じる？',600,320,{size:34,color:HI,weight:700}),seg(p,0,.15),HI);
  return s;
 },
 [K+'hs']:(p)=>{
  let s=fade(.55,stack({grid:1}));
  s+=fade(seg(p,.1,.25),line(XU(0),BOT-AMP,XU(.25),BOT-AMP,{color:PH,w:7})+label('π/2',XU(.125),BOT-AMP-14,{size:26,color:PH,anchor:'middle',weight:700}));
  s+=card(830,90,340,300,L('初級：傾きから',1000,145,{size:26,color:C.dim})+L('電圧が π/2 進む',1000,200,{size:30,color:VC,weight:700})
   +fade(seg(p,.5,.65),L('式の 微分で',1000,280,{size:28})+L('導くのは 中級',1000,330,{size:30,color:HI,weight:700})),seg(p,.05,.2),HI);
  return s;
 },
 [K+'ask']:(p)=>{
  let s=fade(.3,circuit({I:.8}));
  s+=card(250,100,700,320,L('今回の問い',600,155,{color:C.dim})+L('コイルの 電圧は なぜ',600,225,{size:32})+L('1/4 周期 進む？',600,280,{size:36,color:PH,weight:700})
   +fade(seg(p,.35,.5),L('振幅の比は なぜ',520,360,{size:32})+T(`\\omega L\\,?`,740,352,{size:44,color:HI})),seg(p,0,.15),HI);
  return s;
 },

 // ===== S2 振幅と位相を分けて比べる =====
 [K+'setup']:(p)=>{
  let s=circuit({I:.9*Math.cos(TAU*2*p)});
  s+=card(650,80,500,170,T(`${tI}=${Isin}`,900,165,{size:52}),seg(p,.05,.2),IC);
  s+=fade(seg(p,.45,.6),card(650,290,500,130,L('理想的な コイル',900,340,{size:28,weight:700})+L('導線の 抵抗は 無視',900,390,{size:26,color:C.dim}),1));
  return s;
 },
 [K+'parts']:(p)=>{
  const f=`${tI}=${tI0}\\sin(${cs(PH,'\\omega t')})`;
  let s=T(f,370,170,{size:72});
  const w=texWidth(f,72,false),x0=370-w/2;
  // I0 sits after "I=" ; place braces by proportion
  s+=fade(seg(p,.05,.2),brace(x0+w*.34,x0+w*.52,215,{dir:1,text:'振幅 I₀',size:28,color:IC})+L('最大の 大きさ',x0+w*.43,310,{size:24,color:IC}));
  s+=fade(seg(p,.5,.65),brace(x0+w*.78,x0+w*.97,215,{dir:1,text:'位相 ωt',size:28,color:PH})+L('1周の どこか',x0+w*.875,310,{size:24,color:PH}));
  s+=phaseCircle(TAU*(.12+.5*p),{g:seg(p,.4,.55)});
  return s;
 },
 [K+'omega']:(p)=>{
  let s=phaseCircle(TAU*(.62+.6*p),{cx:300,cy:260,R:140});
  s+=card(560,70,600,370,L('角振動数 ω',860,125,{size:30,weight:700})+L('1秒に 進む 位相',860,180,{size:26,color:C.dim})
   +fade(seg(p,.3,.45),L('1周 ＝ 2π，1秒に f 周',860,250,{size:28,color:PH})+T('\\omega=2\\pi f',860,330,{size:52}))
   +fade(seg(p,.6,.75),L('単位 rad/s',860,405,{size:28,color:HI,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'t0']:(p)=>{
  let s=panel(260,{amp:110,name:'I'})+curve(260,sI,{amp:110,p:seg(p,0,.4)});
  s+=fade(seg(p,.15,.3),dot(XU(0),260,11,HI)+arrow(XU(0)+18,248,XU(.09),178,{color:HI,w:4,head:14})+label('t＝0：0 から 増え始める',XU(0)+20,440,{size:26,color:HI,weight:700}));
  s+=card(830,90,340,300,T(`${tI0}\\sin(\\omega ${tt}+${cs(PH,'\\varphi')})`,1000,165,{size:36})+L('φ：初期位相',1000,235,{size:26,color:PH})
   +fade(seg(p,.55,.7),L('基準の選び方で',1000,300,{size:26,color:C.dim})+L('φ ＝ 0',1000,355,{size:34,color:HI,weight:700})),seg(p,.3,.45),PH);
  return s;
 },
 [K+'two']:(p)=>{
  let s=tgrid({g:.8})+panel(TOP,{name:'I'})+curve(TOP,sI)+panel(BOT,{name:'V',col:VC});
  s+=fade(seg(p,.05,.2),L('同じ 周期で 揺れる',XU(.6),BOT+55,{size:30,color:VC,weight:700})+L('？',XU(.6),BOT-40,{size:40,color:VC,weight:700}));
  s+=card(820,70,350,150,L('① どれだけ 大きいか',995,125,{size:26,weight:700})+L('→ 振幅の比',995,180,{size:28,color:HI,weight:700}),seg(p,.35,.5),HI);
  s+=card(820,250,350,150,L('② いつ 山が来るか',995,305,{size:26,weight:700})+L('→ 位相差',995,360,{size:28,color:PH,weight:700}),seg(p,.6,.75),PH);
  return s;
 },
 [K+'ratio']:(p)=>{
  let s=panel(TOP+40,{name:'I'})+curve(TOP+40,sI);
  s+=fade(seg(p,.05,.2),line(XU(.25),TOP+40,XU(.25),TOP+40-AMP,{color:IC,w:3,dash:'5 5'})+label('I₀',XU(.25)+12,TOP+40-AMP/2+8,{size:28,color:IC,weight:700}));
  s+=card(170,300,560,190,T(`\\dfrac{${tV0}}{${tI0}}`,300,408,{size:52})+L('電圧の 振幅 ÷ 電流の 振幅',540,405,{size:24}),seg(p,.25,.4),VC);
  s+=card(820,130,340,220,L('単位',990,190,{size:26,color:C.dim})+L('V/A',990,255,{size:36,weight:700})+fade(seg(p,.6,.75),L('＝ Ω',990,320,{size:38,color:HI,weight:700})),seg(p,.5,.65));
  return s;
 },
 [K+'phase']:(p)=>{
  const sh=.1;
  let s=tgrid({g:.6})+panel(TOP,{name:'I'})+curve(TOP,sI)+panel(BOT,{name:'V',col:VC})+curve(BOT,u=>Math.sin(TAU*(u-sh)),{color:VC,w:4,dash:'10 8'});
  s+=label('（例）',XU(1.05),BOT-AMP-10,{size:24,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.1,.25),line(XU(.25),TOP-AMP,XU(.25),BOT-AMP,{color:IC,w:2,dash:'6 6'})+line(XU(.25+sh),BOT-AMP,XU(.25+sh),BOT+AMP,{color:VC,w:2,dash:'6 6'})+line(XU(.25),BOT-AMP-6,XU(.25+sh),BOT-AMP-6,{color:PH,w:7})+label('Δt',XU(.3),BOT-AMP-18,{size:26,color:PH,anchor:'middle',weight:700}));
  s+=card(820,120,350,250,L('位相差',995,175,{size:30,color:PH,weight:700})+T(`2\\pi\\times\\dfrac{${cs(PH,'\\Delta t')}}{${tT}}`,995,265,{size:44})+L('1周期の ずれ ＝ 2π',995,340,{size:24,color:C.dim}),seg(p,.3,.45),PH);
  return s;
 },
 [K+'R']:(p)=>{
  let s=stack({vf:sI,pv:seg(p,.15,.5),vname:'V'});
  s+=fade(seg(p,.55,.7),line(XU(.25),TOP-AMP-10,XU(.25),BOT+AMP,{color:HI,w:3,dash:'6 6'})+dot(XU(.25),TOP-AMP,10,IC)+dot(XU(.25),BOT-AMP,10,VC)+label('同時に 山',XU(.25)+14,BOT+AMP+6,{size:26,color:HI,weight:700}));
  s+=card(820,70,350,370,L('抵抗 R',995,120,{size:30,weight:700})+T(`${tV}=R${tI}`,995,190,{size:40})+fade(seg(p,.1,.25),T(`=R${tI0}\\sin\\omega ${tt}`,995,260,{size:36}))
   +fade(seg(p,.4,.55),L('振幅の比 ＝ R',995,335,{size:28,color:HI,weight:700}))+fade(seg(p,.55,.7),L('位相差 ＝ 0',995,395,{size:28,color:PH,weight:700})),seg(p,0,.12));
  return s;
 },

 // ===== S3 コイルの電圧を微分で求める =====
 [K+'law']:(p)=>{
  let s=circuit({I:1,lab:1});
  s+=card(620,80,540,190,T(`${tV}=L\\,${dIdt}`,890,175,{size:60}),seg(p,.05,.2),VC);
  s+=fade(seg(p,.35,.5),L('L：インダクタンス［H］',890,320,{size:26})+L('初級の 結果（理想コイル）',890,365,{size:24,color:C.dim}));
  s+=fade(seg(p,.6,.75),L('値ではなく 変わる速さ',890,440,{size:30,color:HI,weight:700}));
  return s;
 },
 [K+'sign']:(p)=>{
  let s=circuit({I:1,signs:seg(p,.05,.25),lab:0});
  s+=label('電流が 入る側を ＋',520,160,{size:26,color:VC,weight:700});
  s+=card(620,200,540,260,L('逆起電力で 書くと',890,245,{size:26,color:C.dim})+T(`-L\\,${dIdt}`,890,335,{size:44})+L('向きの 約束が 違うだけ',890,430,{size:26,color:HI,weight:700}),seg(p,.45,.6));
  return s;
 },
 [K+'sub']:(p)=>{
  let s=T(`${tV}=L\\,\\dfrac{d}{d${tt}}\\Big(${Isin}\\Big)`,600,150,{size:58});
  s+=fade(seg(p,.05,.2),L('I に 代入',600,250,{size:26,color:IC}));
  s+=fade(seg(p,.4,.55),T(`${tV}=${cs(HI,'L')}\\,${cs(HI,'I_0')}\\,\\dfrac{d}{d${tt}}\\big(\\sin\\omega ${tt}\\big)`,600,360,{size:58}));
  s+=fade(seg(p,.55,.7),L('L と I₀ は 一定 → 外へ',600,470,{size:28,color:HI,weight:700}));
  return s;
 },
 [K+'diff']:(p)=>{
  const f=`\\dfrac{d}{d${tt}}\\sin\\omega ${tt}=\\cos\\omega ${tt}\\times ${cs(HI,'\\omega')}`;
  let s=T(f,560,190,{size:66});
  const w=texWidth(f,66,false);
  s+=fade(seg(p,.25,.4),highlight(560+w/2-62,130,70,100,1,HI)+L('中身の 倍率',560+w/2-27,275,{size:28,color:HI,weight:700}));
  s+=card(250,340,700,140,L('微分の法則の回：連鎖律',600,390,{size:26,color:C.dim})+L('外側の 微分 × 中身の 倍率',600,445,{size:30,weight:700}),seg(p,.55,.7));
  return s;
 },
 [K+'result']:(p)=>{
  let s=T(`${tV}=L\\times ${tI0}\\times ${cs(HI,'\\omega')}\\cos\\omega ${tt}`,600,160,{size:58});
  s+=fade(seg(p,.4,.55),arrow(600,215,600,285,{color:C.dim,w:3,head:14})+L('一定の 数を 前へ',720,262,{size:24,color:C.dim,anchor:'start'}));
  s+=fade(seg(p,.5,.65),T(`${tV}=${cs(HI,'\\omega')} L\\,${tI0}\\cos\\omega ${tt}`,600,370,{size:64}));
  return s;
 },
 [K+'where']:(p)=>{
  const A=axes({x:110,y:440,w:620,h:320,xmax:1.05,ymin:-1.3,ymax:1.3,xlabel:'t',ylabel:'I',xcolor:TC,ycolor:IC});
  let s=A.svg+A.plot(t=>Math.sin(TAU*t),{from:0,to:1,color:IC,w:4,dash:'10 8'})+A.plot(t=>Math.sin(2*TAU*t),{from:0,to:1,color:IC,w:5});
  const sl=(k)=>{const h=.07,y0=A.Y(0),dy=A.Y(0)-A.Y(k*TAU*h);return draw([[A.X(-h*0+0),y0],[A.X(h),y0-dy]],1,{color:HI,w:5});};
  s+=fade(seg(p,.35,.5),sl(1)+sl(2)+dot(A.X(0),A.Y(0),9,HI));
  s+=fade(seg(p,.35,.5),label('ゆっくり',A.X(.3),A.Y(1.15),{size:24,color:IC})+label('速い',A.X(.14),A.Y(1.15),{size:24,color:IC,weight:700,anchor:'middle'}));
  s+=card(800,90,360,300,T(cs(HI,'\\omega'),900,160,{size:40})+L('は 中身から',1010,168,{size:28,color:HI,weight:700})+L('同じ 振幅でも',980,240,{size:26})+L('速く揺れるほど',980,290,{size:26})+L('変わる速さが 大きい',980,345,{size:28,color:HI,weight:700}),seg(p,.05,.2),HI);
  return s;
 },
 [K+'V0']:(p)=>{
  let s=T(`${tV}=\\omega L\\,${tI0}\\cos\\omega ${tt}`,600,75,{size:50});
  s+=fade(seg(p,.05,.2),L('cos の 最大 ＝ 1',600,140,{size:26,color:C.dim}));
  s+=fade(seg(p,.15,.3),T(`${tV0}=\\omega L\\,${tI0}`,600,215,{size:54}));
  s+=fade(seg(p,.45,.6),L('I₀ で 割る',600,285,{size:26,color:C.dim}));
  const f=`\\dfrac{${tV0}}{${tI0}}=\\omega L`,w=texWidth(f,62,false);
  s+=fade(seg(p,.55,.7),T(f,600,425,{size:58})+highlight(600-w/2-24,300,w+48,200,1,HI));
  return s;
 },
 [K+'unit']:(p)=>{
  const X=`{\\color{${BAD}}\\cancel{\\mathrm{s}}}`;
  let s=T(`\\mathrm{rad/s}\\times\\mathrm{H}`,600,90,{size:48});
  s+=fade(seg(p,.1,.25),L('H ＝ V·s/A',600,160,{size:26,color:C.dim}));
  s+=fade(seg(p,.25,.4),T(`\\dfrac{1}{\\mathrm{s}}\\times\\dfrac{\\mathrm{V\\cdot s}}{\\mathrm{A}}`,600,260,{size:52}));
  s+=fade(seg(p,.45,.6),T(`\\dfrac{1}{${X}}\\times\\dfrac{\\mathrm{V}\\cdot ${X}}{\\mathrm{A}}=\\dfrac{\\mathrm{V}}{\\mathrm{A}}=\\Omega`,600,400,{size:52}));
  s+=fade(seg(p,.7,.85),L('rad は 数としては 1 とみなす',1150,490,{size:22,color:C.dim,anchor:'end'}));
  return s;
 },

 // ===== S4 山は1/4周期先に来る =====
 [K+'graphs']:(p)=>{
  let s=stack({pi:seg(p,.05,.45),pv:seg(p,.3,.7)});
  s+=card(830,90,340,300,T(`${tI}=${tI0}\\sin\\omega ${tt}`,1000,160,{size:34})+fade(seg(p,.3,.45),T(`${tV}=\\omega L${tI0}\\cos\\omega ${tt}`,1000,280,{size:32})),seg(p,0,.15));
  return s;
 },
 [K+'steep']:(p)=>{
  let s=stack();
  s+=fade(seg(p,.05,.2),tangent(TOP,sI,u=>TAU*Math.cos(TAU*u),0,{h:.05})+label('傾き 最大',XU(.07),TOP+AMP-4,{size:26,color:HI,weight:700}));
  s+=fade(seg(p,.5,.65),dot(XU(0),BOT-AMP,12,VC)+label('山',XU(0)+18,BOT-AMP-12,{size:28,color:VC,weight:700}));
  s+=card(830,120,340,230,L('t ＝ 0',1000,175,{size:30,color:TC,weight:700})+L('電流 0，でも 一番 急',1000,240,{size:26,color:IC})+fade(seg(p,.5,.65),L('→ 電圧は 山',1000,300,{size:30,color:VC,weight:700})),seg(p,0,.15),HI);
  return s;
 },
 [K+'peak']:(p)=>{
  let s=stack();
  s+=fade(seg(p,.05,.2),tangent(TOP,sI,u=>TAU*Math.cos(TAU*u),.25,{h:.08})+label('傾き 0',XU(.25)+20,TOP-AMP-12,{size:26,color:HI,weight:700}));
  s+=fade(seg(p,.4,.55),dot(XU(.25),BOT,12,VC)+label('0',XU(.25)+16,BOT-14,{size:28,color:VC,weight:700}));
  s+=card(830,120,340,230,L('t ＝ T/4',1000,175,{size:30,color:TC,weight:700})+L('電流の 山：傾き 0',1000,240,{size:26,color:IC})+fade(seg(p,.4,.55),L('→ 電圧も 0',1000,300,{size:30,color:VC,weight:700})),seg(p,0,.15),HI);
  return s;
 },
 [K+'lead']:(p)=>{
  let s=stack();
  s+=fade(seg(p,.05,.2),dot(XU(0),BOT-AMP,11,VC)+dot(XU(1),BOT-AMP,11,VC)+dot(XU(.25),TOP-AMP,11,IC)+line(XU(.25),TOP-AMP,XU(.25),BOT+AMP+10,{color:IC,w:2,dash:'6 6'})+line(XU(0),BOT-AMP,XU(0),BOT+AMP+10,{color:VC,w:2,dash:'6 6'}));
  s+=fade(seg(p,.2,.35),line(XU(0),BOT+AMP+8,XU(.25),BOT+AMP+8,{color:PH,w:7})+label('T/4',XU(.125),BOT+AMP-4,{size:24,color:PH,anchor:'middle',weight:700}));
  s+=card(830,120,340,240,L('電圧の 山が',1000,175,{size:28,color:VC,weight:700})+L('T/4 早い',1000,230,{size:32,color:PH,weight:700})+fade(seg(p,.5,.65),L('＝ π/2 の 進み',1000,300,{size:32,color:PH,weight:700})),seg(p,.1,.25),PH);
  return s;
 },
 [K+'formula']:(p)=>{
  const u=TAU*(.05+.35*p),cx=250,cy=270,R=150;
  const [ix,iy]=P(cx,cy,R,u),[vx,vy]=P(cx,cy,R,u+Math.PI/2);
  let s=line(cx-R-20,cy,cx+R+20,cy,{color:C.faint,w:2})+line(cx,cy+R+20,cx,cy-R-20,{color:C.faint,w:2})+ring(cx,cy,R,{color:C.dim,w:3});
  s+=draw(Array.from({length:41},(_,i)=>P(cx,cy,60,u+Math.PI/2*i/40)),1,{color:PH,w:6});
  s+=line(cx,cy,ix,iy,{color:IC,w:4})+line(cx,cy,vx,vy,{color:VC,w:4})+dot(ix,iy,11,IC)+dot(vx,vy,11,VC)+label('I',cx+(R+28)*Math.cos(u)-8,cy-(R+28)*Math.sin(u)+10,{size:28,color:IC,weight:700})+label('V',cx+(R+28)*Math.cos(u+Math.PI/2)-8,cy-(R+28)*Math.sin(u+Math.PI/2)+10,{size:28,color:VC,weight:700});
  s+=T(`\\cos\\omega ${tt}=\\sin\\!\\Big(\\omega ${tt}+${cs(PH,'\\dfrac{\\pi}{2}')}\\Big)`,820,170,{size:52});
  s+=fade(seg(p,.4,.55),L('中身に π/2 を 足した分',820,300,{size:30,color:PH,weight:700})+L('電圧が 先を 回る',820,360,{size:30,color:VC,weight:700}));
  return s;
 },
 [K+'kept']:(p)=>{
  let s=card(80,110,480,260,L('初級',320,165,{size:28,color:C.dim})+L('グラフの 傾きから',320,240,{size:30})+L('π/2 進む と 読んだ',320,300,{size:30,color:PH,weight:700}),seg(p,0,.15));
  s+=fade(seg(p,.25,.4),arrow(580,240,640,240,{color:HI,w:5,head:18}));
  s+=card(660,110,480,260,L('中級',900,165,{size:28,color:C.dim})+L('微分 1回で',900,235,{size:30})+T(`${tV}=\\omega L${tI0}\\cos\\omega ${tt}`,900,310,{size:34}),seg(p,.3,.45),HI);
  return s;
 },

 // ===== S5 数で確かめる =====
 [K+'num']:(p)=>{
  let s=circuit({I:.9*Math.cos(TAU*2*p)});
  s+=card(650,110,500,260,T(`L=0.1${U('H')}`,900,190,{size:48})+fade(seg(p,.3,.45),T(`f=50${U('Hz')}`,900,300,{size:48})),seg(p,.05,.2));
  return s;
 },
 [K+'w']:(p)=>{
  let s=T(`\\omega=2\\pi\\times 50\\approx 314${U('rad/s')}`,600,150,{size:56});
  s+=fade(seg(p,.45,.6),T(`\\omega L\\approx 314\\times 0.1\\approx 31${U('\\Omega')}`,600,330,{size:56}));
  return s;
 },
 [K+'V']:(p)=>{
  let s=stack({grid:0});
  s+=fade(seg(p,.1,.25),label('1 A',XU(.25)+20,TOP-AMP-4,{size:26,color:IC,weight:700})+label('約 31 V',XU(0)+24,BOT-AMP-10,{size:26,color:VC,weight:700}));
  s+=card(830,120,340,230,T(`${tV0}=\\omega L\\,${tI0}`,1000,180,{size:40})+fade(seg(p,.3,.45),T(`\\approx 31${U('\\Omega')}\\times 1${U('A')}`,1000,250,{size:34})+T(`\\approx 31${U('V')}`,1000,310,{size:40})),seg(p,0,.15),VC);
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=card(250,100,700,300,L('同じ コイル（L ＝ 0.1 H）',600,165,{size:30,color:C.dim})+L('周波数を 2倍：100 Hz',600,245,{size:36,color:PH,weight:700})+T(`\\omega L=\\ ?`,600,330,{size:44,color:HI}),seg(p,0,.15),HI);
  return s;
 },
 [K+'ans']:(p)=>{
  let s=T(`\\omega=2\\pi\\times100\\approx 628${U('rad/s')}`,600,90,{size:44});
  s+=fade(seg(p,.1,.25),T(`\\omega L\\approx 63${U('\\Omega')}`,600,180,{size:52}));
  const bar=(y,w,txt,g,c)=>fade(g,rect(260,y,w,50,{fill:c,fo:.35,stroke:c,rx:8})+label(txt,270+w,y+36,{size:28,color:c,weight:700}));
  s+=fade(seg(p,.3,.4),label('50 Hz',240,300,{size:26,color:C.dim,anchor:'end'})+label('100 Hz',240,380,{size:26,color:C.dim,anchor:'end'}));
  s+=bar(265,240,'31 Ω',seg(p,.3,.45),C.ink)+bar(345,480,'63 Ω（2倍）',seg(p,.4,.55),HI);
  s+=fade(seg(p,.6,.75),L('1 A には 約 63 V の 振幅',600,475,{size:28,color:VC,weight:700}));
  return s;
 },
 [K+'why']:(p)=>{
  let s=tgrid({g:.5})+panel(TOP,{name:'50'})+curve(TOP,sI)+panel(BOT,{name:'100'})+curve(BOT,u=>Math.sin(2*TAU*u));
  s+=label('Hz',X0-18,TOP+40,{size:22,color:C.dim,anchor:'end'})+label('Hz',X0-18,BOT+40,{size:22,color:C.dim,anchor:'end'});
  s+=fade(seg(p,.1,.25),tangent(TOP,sI,u=>TAU*Math.cos(TAU*u),0,{h:.05})+tangent(BOT,u=>Math.sin(2*TAU*u),u=>2*TAU*Math.cos(2*TAU*u),0,{h:.035}));
  s+=card(830,110,340,250,L('振幅は 同じ',1000,165,{size:28,color:IC})+L('揺れが 2倍 速い',1000,225,{size:28})+fade(seg(p,.35,.5),L('→ 傾きも 2倍',1000,300,{size:30,color:HI,weight:700})),seg(p,.05,.2),HI);
  return s;
 },
 [K+'imp']:(p)=>{
  let s=card(120,80,960,170,T(`|Z_L|=\\dfrac{${tV0}}{${tI0}}=\\omega L`,600,170,{size:56}),seg(p,0,.15),HI);
  s+=fade(seg(p,.15,.3),L('インピーダンスの 大きさ ＝ 振幅の比',600,300,{size:30,weight:700}));
  s+=card(250,340,700,130,L('ずれ（π/2 の 進み）は',600,390,{size:26,color:C.dim})+L('比とは 別に 位相差で 表す',600,440,{size:30,color:PH,weight:700}),seg(p,.5,.65),PH);
  return s;
 },
 [K+'heat']:(p)=>{
  let s=fade(.45,stack({grid:0}));
  s+=card(830,70,340,370,L('単位は Ω でも',1000,130,{size:28})+L('発熱 では ない',1000,190,{size:32,color:BAD,weight:700})
   +fade(seg(p,.4,.55),L('理想コイルは',1000,275,{size:26,color:C.dim})+L('π/2 ずれた 電圧で',1000,330,{size:28,color:VC,weight:700})+L('応じるだけ',1000,385,{size:28,color:VC,weight:700})),seg(p,.05,.2));
  return s;
 },

 // ===== S6 まとめと次の問い =====
 [K+'sum']:(p)=>{
  let s=T(`${tV}=L\\,${dIdt}`,230,200,{size:52});
  s+=fade(seg(p,.2,.35),arrow(380,190,520,190,{color:HI,w:5,head:18})+L('微分 1回',450,160,{size:24,color:HI}));
  s+=fade(seg(p,.3,.45),T(`\\sin\\omega ${tt}\\ \\to\\ ${cs(HI,'\\omega')}\\cos\\omega ${tt}`,840,200,{size:52}));
  s+=fade(seg(p,.5,.65),L('中身の 倍率 ω が 出る',840,300,{size:30,color:HI,weight:700}));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(90,90,480,280,L('振幅の比',330,155,{size:30,weight:700})+T(`\\dfrac{${tV0}}{${tI0}}=\\omega L`,330,265,{size:56}),seg(p,.02,.18),HI);
  s+=card(630,90,480,280,L('位相',870,155,{size:30,color:PH,weight:700})+L('電圧が 電流より',870,235,{size:28,color:VC})+L('π/2 進む',870,300,{size:38,color:PH,weight:700}),seg(p,.3,.45),PH);
  return s;
 },
 [K+'cap']:(p)=>{
  const x2cap=470;let s=circuit({el:'cap',I:.8});
  s+=fade(seg(p,.1,.25),label('＋q',x2cap+48,246,{size:28,color:QC,weight:700})+label('−q',x2cap+48,300,{size:28,color:QC,weight:700}));
  s+=card(680,120,480,220,L('コンデンサ',920,175,{size:28,weight:700})+T(`${tV}=\\dfrac{${tq}}{${tC}}`,920,275,{size:60}),seg(p,.2,.35),QC);
  return s;
 },
 [K+'next']:(p)=>{
  let s=card(200,50,800,400,L('次の問い',600,100,{color:C.dim})+L('電流 → 電荷 には 積分',600,165,{size:32})
   +T(`${tq}=\\int ${tI}\\,d${tt}`,600,265,{size:46})+L('振幅と 位相は どうなる？',600,395,{size:36,color:HI,weight:700}),seg(p,0,.15),HI);
  return s;
 },
};

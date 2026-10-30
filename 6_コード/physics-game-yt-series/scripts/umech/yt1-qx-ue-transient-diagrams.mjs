// 問題編 解説「RL の立ち上がりと LC 振動」（q-ue-transient、大学編 28 過渡現象・上級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/28_過渡現象.md の q-ue-transient（解説 20 行）。
// 色（正本・単元動画と同じ）：電流 I 緑、電圧 V₀ 紫、電荷 q・Q₀ 桃、差 I∞−I 橙、時間 t・τ 金、容量 C 黄、R・L 白、ω 桃、
//   エネルギー（電場の分 水色・磁場の分 橙）、強調 黄。
// RL 回路は 過渡現象・中級と同じ配置で、コンデンサの位置にコイル。LC 回路は 上級 2/2 と同じく、左の辺にコンデンサ（上の板 ＋）、右の辺にコイル。
// 電池・抵抗の記号は yt1-um-circuit-time-1 から import（あちらは編集しない）。
// 札は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。軸の目盛り数字は 22px（自前の軸）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,draw,arrow,highlight,axes,tex,texWidth} from './anim.mjs';
import {QC,card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,sentWin,voiceEnd,textW} from './yt1-qx-common.mjs';
import {battery,zig} from './yt1-um-circuit-time-1-diagrams.mjs';

const K='qx-ue-transient:';
const VC=QC.V,QQ=QC.q,IC=QC.I,TC=QC.t,CC=C.hi,UC=C.E,EC=C.x,BC=C.E,OC=C.p,POS=C.a,NEG='#7fb3ff';
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const I_=cs(IC,'I'),q_=cs(QQ,'q'),Q0=cs(QQ,'Q_0'),C_=cs(CC,'C'),V0=cs(VC,'V_0'),t_=cs(TC,'t'),TAU=cs(TC,'\\tau'),W=cs(OC,'\\omega'),II=cs(IC,'I_\\infty');
const DI=`\\dfrac{d${I_}}{d${t_}}`;
const G1='τ と t＝τ の電流',G2='振動数 f',G3='電流の最大値';
const ANS1=g=>answerTag(1,'A','50 ms、1.9 A',{g}),ANS2=g=>answerTag(2,'C','1.6 kHz',{g}),ANS3=g=>answerTag(3,'D','0.20 A',{g});
function atWord(ctx,word,def){
 const r=(ctx?.cue?.reading??'').replace(/\s/g,''),i=r.indexOf(word.replace(/\s/g,''));
 return i<0||!r.length?def:i/r.length*voiceEnd(ctx);
}
const pill=(t,x,y,color,{size=24,g=1}={})=>{const w=textW(t,size)+24,h=size+16;
 return fade(g,rect(x-w/2,y-h/2,w,h,{fill:'#131f38',fo:.96,stroke:color,sw:2.5,rx:h/2})+label(t,x,y+size*.36,{size,color,anchor:'middle',weight:700}));};
function ax({x,y,w,h,xmax,ymax,xt=[],yt=[],xl='',yl='',xc=C.dim,yc=C.dim,g=1,size=22}){
 const A=axes({x,y,w,h,xmax,ymax,g,xcolor:xc,ycolor:yc});
 let s=A.svg;
 s+=fade(g,xt.map(([u,t])=>line(A.X(u),y-6,A.X(u),y+6,{color:C.dim})+label(t,A.X(u),y+32,{size,color:xc,anchor:'middle'})).join('')
  +yt.map(([v,t])=>line(x-6,A.Y(v),x+6,A.Y(v),{color:C.dim})+label(t,x-12,A.Y(v)+8,{size,color:yc,anchor:'end'})).join(''));
 s+=fade(g,label(xl,x+w+40,y+8,{size:24,color:xc})+label(yl,x,y-h-42,{size:24,color:yc,anchor:'middle',weight:700}));
 return {...A,svg:s};
}
function coilH(x1,x2,y,{n=5,color=C.ink,w=4}={}){const d=(x2-x1)/n;let p=`<path d="M${x1} ${y}`;for(let i=0;i<n;i++)p+=` a${d/2} ${d*.75} 0 0 1 ${d} 0`;return p+`" fill="none" stroke="${color}" stroke-width="${w}"/>`;}
function coilV(x,y1,y2,{n=5,color=C.ink,w=4}={}){const d=(y2-y1)/n;let p=`<path d="M${x} ${y1}`;for(let i=0;i<n;i++)p+=` a${d*.75} ${d/2} 0 0 1 0 ${d}`;return p+`" fill="none" stroke="${color}" stroke-width="${w}"/>`;}

// ---- RL 回路（電池の＋極が左、抵抗は上の左、コイルは上の右）---------------------------------------
function rl({x0=60,y0=180,w=420,h=230,sw=1,dr=1,g=1}={}){
 const CL=x0,CR=x0+w,CT=y0,CB=y0+h,RA=x0+.1*w,RB=x0+.42*w,LA=x0+.55*w,LB=x0+.88*w,BX=x0+.58*w,SWA=x0+.1*w,SWB=x0+.24*w;
 const Wr=(pts,a,b)=>draw(pts,seg(dr,a,b),{color:C.dim,w:4});
 let s=Wr([[SWA,CB],[CL,CB],[CL,CT],[RA,CT]],0,.35)+Wr([[RB,CT],[LA,CT]],.3,.5)+Wr([[LB,CT],[CR,CT],[CR,CB],[BX+10,CB]],.45,.85)+Wr([[BX-10,CB],[SWB,CB]],.8,1);
 const ang=mix(-0.55,0,clamp(sw)),L=SWB-SWA;
 s+=fade(seg(dr,.5,1),zig(RA,RB,CT)+coilH(LA,LB,CT)+battery(BX,CB,{text:''})+label('12 V',BX,CB+62,{size:26,color:VC,anchor:'middle',weight:700})
  +label('4 Ω',(RA+RB)/2,CT-34,{size:26,color:C.ink,anchor:'middle',weight:700})+label('0.2 H',(LA+LB)/2,CT-40,{size:26,color:C.ink,anchor:'middle',weight:700})
  +dot(SWA,CB,6,C.ink)+dot(SWB,CB,6,C.ink)+line(SWA,CB,SWA+L*Math.cos(ang),CB+L*Math.sin(ang),{color:C.ink,w:4})+label('スイッチ',(SWA+SWB)/2,CB+44,{size:22,color:C.dim,anchor:'middle'}));
 return fade(g,s);
}
// ---- LC 回路（左の辺にコンデンサ、右の辺にコイル、上の導線にスイッチ）--------------------------------
function lc({x0=300,y0=130,w=300,h=280,dr=1,g=1,labs=1,sw=0}={}){
 const L=x0,R=x0+w,Tp=y0,B=y0+h,cy=(Tp+B)/2,pw=90,SA=x0+.35*w,SB=x0+.6*w,c1=cy-60,c2=cy+60;
 const Wr=(pts,a,b)=>draw(pts,seg(dr,a,b),{color:C.dim,w:4});
 let s=Wr([[SA,Tp],[L,Tp],[L,cy-16]],0,.3)+Wr([[L,cy+16],[L,B],[R,B],[R,c2]],.25,.65)+Wr([[R,c1],[R,Tp],[SB,Tp]],.6,.9);
 const gc=seg(dr,.45,1),ang=mix(-0.55,0,clamp(sw)),Ls=SB-SA;
 let c=rect(L-pw/2,cy-22,pw,8,{fill:CC,fo:.9,stroke:CC,sw:1,rx:2})+rect(L-pw/2,cy+14,pw,8,{fill:CC,fo:.9,stroke:CC,sw:1,rx:2});
 for(let k=0;k<4;k++){const x=L-33+k*22;c+=label('＋',x,cy-32,{size:20,color:POS,anchor:'middle',weight:700})+label('−',x,cy+50,{size:22,color:NEG,anchor:'middle',weight:700});}
 c+=coilV(R,c1,c2)+dot(SA,Tp,6,C.ink)+dot(SB,Tp,6,C.ink)+line(SA,Tp,SA+Ls*Math.cos(ang),Tp+Ls*Math.sin(ang),{color:C.ink,w:4});
 if(labs)c+=label('C＝2.5 μF',L-pw/2-14,cy-30,{size:26,color:CC,anchor:'end',weight:700})+pill('Q₀＝20 μC',L-pw/2-100,cy+36,QQ)
  +label('L＝4 mH',R+40,cy+8,{size:26,color:C.ink,weight:700})+label('スイッチ',(SA+SB)/2,Tp-44,{size:22,color:C.dim,anchor:'middle'});
 s+=fade(gc,c);
 return fade(g,s);
}
// ---- グラフ --------------------------------------------------------------------------------------
const Irl=t=>3*(1-Math.exp(-t/50));
function iG({x=100,y=460,w=470,h=300,g=1,ticks=1,xl='t [ms]',yl='電流 I [A]'}={}){
 return ax({x,y,w,h,xmax:250,ymax:3.6,xt:ticks?[[50,'50'],[100,'100'],[150,'150'],[200,'200']]:[],yt:ticks?[[3,'3']]:[],xl,yl,xc:TC,yc:IC,g});
}
const OM=2*Math.PI/0.628,TP=0.628; // 周期 0.628 ms（ω＝10⁴ rad/s）
// 振動のグラフ（中央に t 軸）。f(u)＝−1〜1 の形、u は ms
function osc({x=100,cy=300,w=520,amp=130,g=1,fn=u=>Math.cos(OM*u),to=1.9,color=QQ,lab='電荷 q',tick='',p=1}={}){
 const X=u=>x+w*u/1.9,Y=v=>cy-amp*v;
 let s=fade(g,arrow(x-10,cy,x+w+30,cy,{color:C.dim,w:2.5,head:14})+arrow(x,cy+amp+20,x,cy-amp-30,{color:C.dim,w:2.5,head:14})
  +label('t',x+w+40,cy+8,{size:24,color:TC})+label(lab,x+14,cy-amp-22,{size:24,color,weight:700}));
 if(tick)s+=fade(g,line(x-6,Y(1),x+6,Y(1),{color:C.dim})+label(tick,x-12,Y(1)+8,{size:22,color,anchor:'end'})+line(x-6,Y(-1),x+6,Y(-1),{color:C.dim})+label('−'+tick,x-12,Y(-1)+8,{size:22,color,anchor:'end'}));
 s+=fade(g,draw(Array.from({length:241},(_,i)=>{const u=to*i/240;return [X(u),Y(fn(u))];}),p,{color,w:5}));
 return {svg:s,X,Y};
}
const PX=700,PW=490,PC=PX+PW/2;
const WO={x:PX,w:PW,y:190,size:28,whySize:24};

export const ytQxUeTransientDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（6 s）：0〜3 s 左に RL 回路（開いたスイッチ）と下に I–t グラフの軸だけ。3〜6 s 右に LC 回路（上の板 ＋、下の板 −、Q₀・C・L の札、開いたスイッチ）。静止。
 [K+'q1']:(p)=>{
  let s=rl({x0:50,y0:90,w:420,h:180,sw:0,dr:seg(p,0,.35)});
  s+=fade(seg(p,.35,.48),iG({x:130,y:495,w:360,h:95,ticks:0,xl:'t',yl:''}).svg+label('電流 I',112,425,{size:24,color:IC,anchor:'end',weight:700}));
  s+=lc({x0:830,y0:100,w:200,h:300,dr:seg(p,.5,.85)});
  return s;
 },

 // ===================== 小問1 =====================
 [K+'goal1']:(p)=>rl({dr:seg(p,0,.3),sw:seg(p,.3,.4)})+iG({x:620,w:480,h:280,g:seg(p,.3,.45)}).svg+goalTag(G1,{g:seg(p,.03,.15)}),
 // 2. 法則と一周の式。右辺を 0 → I∞＝V₀/R＝3 A。行き先の点線、始めの接線（60 A/s）
 [K+'inf']:(p,ctx)=>{
  const b=atWord(ctx,'いきさきは',.5);
  const A=iG();
  let s=A.svg+fade(seg(p,b+.05,b+.15),line(A.X(0),A.Y(3),A.X(250),A.Y(3),{color:IC,w:2.5,dash:'10 8'})+label('I∞ ＝ 3 A',A.X(250),A.Y(3)-14,{size:24,color:IC,anchor:'end',weight:700}));
  s+=fade(seg(p,b+.2,b+.3),line(A.X(0),A.Y(0),A.X(50),A.Y(3),{color:IC,w:3,dash:'7 6'})+label('始めの傾き V₀/L ＝ 60 A/s',A.X(58),A.Y(1.4),{size:22,color:IC,weight:700}));
  const e=`L\\,${DI}=${V0}-R${I_}`,we=texWidth(e,38,false),wr=texWidth(`${V0}-R${I_}`,38,false);
  s+=card(PX,90,PW,410,kindTag('法則',PX+60,130,{g:seg(p,.02,.08)})+T(e,PC,200,38)
   +fade(seg(p,.25,.35),rect(PC+we/2-wr-8,165,wr+16,62,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:8})+label('＝ 0',PC+we/2+14,240,{size:28,color:C.hi,weight:700}))
   +fade(seg(p,b,b+.08),T(`${II}=\\dfrac{${V0}}{R}=\\dfrac{12}{4}`,PC,330,38))
   +fade(seg(p,b+.08,b+.15),T(`=${cs(IC,'3\\,\\mathrm{A}')}`,PC,440,40)),1);
  return s+goalTag(G1);
 },
 // 3. すき間 I∞−I（橙）。d(I∞−I)/dt＝−(R/L)(I∞−I)、L/R を τ。τ＝0.2÷4＝0.05 s＝50 ms
 [K+'tau']:(p,ctx)=>{
  const b=atWord(ctx,'タウ',.45);
  const A=iG();
  let s=A.svg+line(A.X(0),A.Y(3),A.X(250),A.Y(3),{color:IC,w:2.5,dash:'10 8'})+label('I∞ ＝ 3 A',A.X(250),A.Y(3)-14,{size:24,color:IC,anchor:'end',weight:700});
  s+=A.plot(Irl,{from:0,to:250,p:seg(p,.02,.2),color:IC,w:5});
  s+=fade(seg(p,.15,.25),line(A.X(25),A.Y(Irl(25)),A.X(25),A.Y(3),{color:UC,w:7})+label('I∞−I',A.X(25)-12,A.Y(2.5),{size:24,color:UC,weight:700,anchor:'end'}));
  s+=fade(seg(p,b+.15,b+.25),line(A.X(50),A.Y(0),A.X(50),A.Y(3.4),{color:TC,w:3,dash:'8 6'})+label('τ ＝ 50 ms',A.X(50)+10,A.Y(3.4)-8,{size:24,color:TC,weight:700}));
  const GAP=`(${II}-${I_})`,e=`\\dfrac{d${GAP}}{d${t_}}=-\\dfrac{R}{L}${GAP}`,we=texWidth(e,32,false),wl=texWidth(`\\dfrac{R}{L}${GAP}`,32,false),wf=texWidth('\\dfrac{R}{L}',32,false);
  s+=card(PX,90,PW,410,label('RC と 同じ 形',PC,135,{size:24,color:C.dim,anchor:'middle'})+T(e,PC,205,32)
   +fade(seg(p,b-.05,b),rect(PC+we/2-wl-6,168,wf+12,82,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:8})+label('1/τ',PC+we/2-wl+wf/2,282,{size:26,color:TC,anchor:'middle',weight:700}))
   +fade(seg(p,b,b+.08),T(`${TAU}=\\dfrac{L}{R}=\\dfrac{0.2}{4}`,PC,350,38))
   +fade(seg(p,b+.1,b+.18),T(`=0.05\\,\\mathrm{s}=${cs(TC,'50\\,\\mathrm{ms}')}`,PC,450,38)),1);
  return s+goalTag(G1);
 },
 // 4. 立ち上がりの曲線。τ で 63％、3×0.632≈1.9 A。答えの札
 [K+'ans1']:(p,ctx)=>{
  const b=atWord(ctx,'しょうもん',.7);
  const A=iG();
  let s=A.svg+line(A.X(0),A.Y(3),A.X(250),A.Y(3),{color:IC,w:2.5,dash:'10 8'})+label('I∞ ＝ 3 A',A.X(250),A.Y(3)-14,{size:24,color:IC,anchor:'end',weight:700});
  s+=A.plot(Irl,{from:0,to:250,color:IC,w:5})+line(A.X(50),A.Y(0),A.X(50),A.Y(3.4),{color:TC,w:3,dash:'8 6'})+label('τ',A.X(50),A.Y(3.4)-8,{size:26,color:TC,anchor:'middle',weight:700});
  s+=fade(seg(p,.3,.4),dot(A.X(50),A.Y(Irl(50)),9,IC)+label('63％',A.X(50)+16,A.Y(Irl(50))+32,{size:28,color:C.hi,weight:700}));
  s+=card(PX,90,PW,410,label('「1−指数」の 形',PC,140,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.15,.25),T(`${I_}(${TAU})=3\\times(1-0.368)`,PC,250,36))
   +fade(seg(p,.35,.45),T(`=3\\times0.632\\approx${cs(IC,'1.9\\,\\mathrm{A}')}`,PC,370,36)),1);
  return s+goalTag(G1)+ANS1(seg(p,b,b+.08));
 },
 [K+'wrongB']:(p)=>{
  const A=iG();
  let s=A.svg+A.plot(Irl,{from:0,to:250,color:IC,w:5})+line(A.X(50),A.Y(0),A.X(50),A.Y(3.4),{color:TC,w:3,dash:'8 6'})+label('τ',A.X(50),A.Y(3.4)-8,{size:26,color:TC,anchor:'middle',weight:700})+dot(A.X(50),A.Y(Irl(50)),9,IC);
  s+=wrongCard('B','τ＝0.8 s','R×L とした（単位 Ω·H）',{...WO,mid:'4\\times0.2=0.8',g:seg(p,.03,.1)});
  return s+goalTag(G1)+ANS1(1);
 },
 [K+'wrongCD']:(p,ctx)=>{
  const A=iG();
  let s=A.svg+A.plot(Irl,{from:0,to:250,color:IC,w:5})+line(A.X(50),A.Y(0),A.X(50),A.Y(3.4),{color:TC,w:3,dash:'8 6'})+label('τ',A.X(50),A.Y(3.4)-8,{size:26,color:TC,anchor:'middle',weight:700})+dot(A.X(50),A.Y(Irl(50)),9,IC);
  s+=wrongSeq(p,ctx,[['C','I≈1.1 A','37％（減衰の形）を使った',{mid:'3\\times0.368\\approx1.1'}],['D','I＝3.0 A','τ では行き先に届かない（63％）']],{opts:WO});
  return s+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 [K+'goal2']:(p)=>lc({x0:380,y0:110,w:300,h:300,dr:seg(p,0,.35)})+goalTag(G2,{g:seg(p,.03,.15)}),
 // 8. 前提「抵抗 0」。一周の式とばねの式を上下に、対応表、ω²＝k/m → 1/(LC)
 [K+'spring']:(p,ctx)=>{
  const b=atWord(ctx,'オメガ',.7);
  let s=kindTag('前提',90,120,{text:'抵抗 0',g:seg(p,.02,.08)});
  s+=label('回路',90,212,{size:26,color:C.dim,anchor:'middle'})+T(`L\\,\\dfrac{d^2${q_}}{d${t_}^2}+\\dfrac{${q_}}{${C_}}=0`,370,205,40);
  s+=fade(seg(p,.25,.35),label('ばね',90,322,{size:26,color:C.dim,anchor:'middle'})+T(`m\\,\\dfrac{d^2${cs(C.x,'x')}}{d${t_}^2}+k${cs(C.x,'x')}=0`,370,315,40));
  const rows=[['x','q',C.x,QQ],['v','I',C.v,IC],['m','L',C.ink,C.ink],['k','1/C',C.ink,CC]];
  let tb=label('ばね',800,140,{size:24,color:C.dim,anchor:'middle'})+label('回路',980,140,{size:24,color:C.dim,anchor:'middle'});
  rows.forEach(([a,c,ca,cc],i)=>{const y=190+i*56,g=seg(p,.4+.06*i,.46+.06*i);tb+=fade(g,label(a,800,y,{size:30,color:ca,anchor:'middle',weight:700})+label('↔',890,y,{size:28,color:C.dim,anchor:'middle'})+label(c,980,y,{size:30,color:cc,anchor:'middle',weight:700}));});
  s+=card(700,95,400,320,tb,seg(p,.38,.44));
  s+=fade(seg(p,b,b+.1),T(`${W}^2=\\dfrac{k}{m}\\ \\to\\ \\dfrac{1}{L${C_}}`,600,465,40));
  return s+goalTag(G2);
 },
 // 9. LC＝4×10⁻³×2.5×10⁻⁶＝1×10⁻⁸ s²、ω＝1×10⁴ rad/s（m と μ を枠で）
 [K+'calc']:(p)=>{
  const full=`L${C_}=4\\,\\mathrm{mH}\\times2.5\\,\\mu\\mathrm{F}`,sz=40,Wd=texWidth(full,sz,false),x0=600-Wd/2;
  const mx=x0+texWidth(`L${C_}=4\\,`,sz,false),mw=texWidth('\\mathrm{m}',sz,false),ux=x0+texWidth(`L${C_}=4\\,\\mathrm{mH}\\times2.5\\,`,sz,false),uw=texWidth('\\mu',sz,false);
  let s=T(full,600,135,sz);
  s+=fade(seg(p,.08,.16),rect(mx-9,102,mw+10,50,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:6})+label('×10⁻³',mx+mw/2,192,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.18,.26),rect(ux-9,102,uw+10,50,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:6})+label('×10⁻⁶',ux+uw/2,192,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.28,.36),T(`=4\\times10^{-3}\\times2.5\\times10^{-6}`,600,260,38));
  s+=fade(seg(p,.4,.48),T(`=1\\times10^{-8}\\,\\mathrm{s}^2`,600,345,38));
  s+=fade(seg(p,.6,.7),T(`${W}=\\dfrac{1}{\\sqrt{L${C_}}}=${cs(OC,'1\\times10^{4}\\,\\mathrm{rad/s}')}`,600,450,40));
  return s+goalTag(G2);
 },
 // 10. q（桃、cos の形）のグラフ。f＝ω/2π≈1592 Hz≈1.6 kHz。答えの札
 [K+'ans2']:(p,ctx)=>{
  const b=atWord(ctx,'しょうもん',.7);
  let s=osc({x:90,cy:300,w:520,amp:140,tick:'20',lab:'電荷 q [μC]',p:seg(p,.02,.35)}).svg;
  s+=card(PX,100,PW,330,T(`f=\\dfrac{${W}}{2\\pi}=\\dfrac{10^{4}}{2\\pi}`,PC,190,38)
   +fade(seg(p,.25,.35),T(`\\approx1592\\,\\mathrm{Hz}`,PC,290,38))+fade(seg(p,.35,.45),T(`\\approx${cs(OC,'1.6\\,\\mathrm{kHz}')}`,PC,380,40)),1);
  return s+goalTag(G2)+ANS2(seg(p,b,b+.08));
 },
 [K+'wrongAB2']:(p,ctx)=>{
  let s=osc({x:90,cy:300,w:520,amp:140,tick:'20',lab:'電荷 q [μC]'}).svg;
  s+=wrongSeq(p,ctx,[['A','10 kHz','ω（rad/s）をそのまま f とした'],['B','63 kHz','2π で割らずに掛けた',{mid:'2\\pi\\times10^{4}\\approx6.3\\times10^{4}'}]],{opts:WO});
  return s+goalTag(G2)+ANS2(1);
 },
 [K+'wrongD2']:(p)=>{
  let s=osc({x:90,cy:300,w:520,amp:140,tick:'20',lab:'電荷 q [μC]'}).svg;
  s+=wrongCard('D','16 MHz','1/(2πLC)（√ がない。単位 1/s²）',{...WO,mid:'\\dfrac{1}{2\\pi\\times10^{-8}}\\approx1.6\\times10^{7}',g:seg(p,.03,.1)});
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 [K+'goal3']:(p)=>osc({x:90,cy:300,w:520,amp:140,tick:'20',lab:'電荷 q [μC]'}).svg+goalTag(G3,{g:seg(p,.03,.15)}),
 // 14. 微分（ω を黄の枠）。q の下に I（−sin）を並べ、q＝0 の瞬間に縦線、I が最大
 [K+'deriv']:(p,ctx)=>{
  const b=atWord(ctx,'でんりゅうの',.6);
  const Q=osc({x:90,cy:185,w:520,amp:70,lab:'電荷 q'}),Ig=osc({x:90,cy:410,w:520,amp:70,lab:'電流 I',color:IC,fn:u=>-Math.sin(OM*u),p:seg(p,.3,.55)});
  let s=Q.svg+Ig.svg;
  const t3=.75*TP;
  s+=fade(seg(p,b,b+.08),line(Q.X(t3),Q.Y(1.2),Q.X(t3),Ig.Y(-1.2),{color:C.hi,w:3,dash:'8 6'})+label('q＝0',Q.X(t3)+10,Q.Y(1.1),{size:24,color:C.hi,weight:700})+dot(Ig.X(t3),Ig.Y(1),9,IC));
  const e2=`${I_}=-${W}${Q0}\\sin ${W}${t_}`;
  s+=card(PX,95,PW,410,T(`${q_}=${Q0}\\cos ${W}${t_}`,PC,160,38)+fade(seg(p,.15,.22),label('微分',PC,225,{size:24,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.2,.3),T(e2,PC,295,38))+fade(seg(p,.3,.38),highlight(PC-texWidth(e2,38,false)/2+texWidth(`${I_}=-`,38,false)+2,268,texWidth(W,38,false)+12,52,1,C.hi))
   +fade(seg(p,b+.08,b+.16),T(`|${I_}|_{\\max}=${W}${Q0}`,PC,420,40)),1);
  return s+goalTag(G3);
 },
 // 15. 1×10⁴×2×10⁻⁵＝0.20 A、I の山に「0.20 A」。答えの札
 [K+'ans3']:(p,ctx)=>{
  const b=atWord(ctx,'しょうもん',.6);
  const Q=osc({x:90,cy:185,w:520,amp:70,lab:'電荷 q'}),Ig=osc({x:90,cy:410,w:520,amp:70,lab:'電流 I',color:IC,fn:u=>-Math.sin(OM*u)});
  const t3=.75*TP;
  let s=Q.svg+Ig.svg+line(Q.X(t3),Q.Y(1.2),Q.X(t3),Ig.Y(-1.2),{color:C.hi,w:3,dash:'8 6'})+dot(Ig.X(t3),Ig.Y(1),9,IC);
  s+=fade(seg(p,.3,.4),label('0.20 A',Ig.X(t3)+14,Ig.Y(1)-8,{size:28,color:IC,weight:700}));
  s+=card(PX,95,PW,410,T(`|${I_}|_{\\max}=${W}${Q0}`,PC,170,38)+fade(seg(p,.05,.15),T(`=1\\times10^{4}\\times2\\times10^{-5}`,PC,290,36))
   +fade(seg(p,.2,.3),T(`=${cs(IC,'0.20\\,\\mathrm{A}')}`,PC,400,40)),1);
  return s+goalTag(G3)+ANS3(seg(p,b,b+.08));
 },
 // 16. エネルギーの棒（電場の分 水色、磁場の分 橙）。はじめ水色が満タン 80 μJ → q＝0 で橙が満タン。合計は一定
 [K+'energy']:(p,ctx)=>{
  const b=atWord(ctx,'キュー イコール ゼロ',.5),ph=Math.PI/2*seg(p,.25,b+.05);
  return eBars(Math.cos(ph)**2,{numE:seg(p,.12,.2)*(1-seg(p,.22,.26)),numB:seg(p,b+.02,b+.1)})
   +card(PX,95,PW,410,T(`\\dfrac{${Q0}^2}{2${C_}}=\\dfrac{(2\\times10^{-5})^2}{2\\times2.5\\times10^{-6}}`,PC,175,30)
   +fade(seg(p,.1,.18),T(`=${cs(EC,'80\\,\\mu\\mathrm{J}')}`,PC,285,36))
   +fade(seg(p,b,b+.08),label('q＝0 の瞬間に 全部',PC,370,{size:26,color:C.ink,anchor:'middle',weight:700})+T(`\\tfrac12 L${I_}^2`,PC,440,40,{color:BC})),1)+goalTag(G3)+ANS3(1);
 },
 // 17. ½×4×10⁻³×0.04＝80 μJ。合計の線を黄で
 [K+'energy2']:(p)=>eBars(0,{numB:1,total:seg(p,.4,.5)})
   +card(PX,95,PW,410,T(`\\tfrac12 L${I_}^2=\\tfrac12\\times4\\times10^{-3}\\times0.20^2`,PC,180,30)
   +fade(seg(p,.1,.2),T(`=\\tfrac12\\times4\\times10^{-3}\\times0.04`,PC,280,30))+fade(seg(p,.25,.35),T(`=${cs(BC,'80\\,\\mu\\mathrm{J}')}`,PC,380,36)),1)+goalTag(G3)+ANS3(1),
 // 18. 正しい式と誤式（右辺の ½ だけを消した）を並べ、I²＝0.04 → 0.20 A ○、I²＝0.02 → 0.14 A ×。そのあと誤答カード
 [K+'wrongB3']:(p)=>{
  const H=`{\\color{${C.hi}}\\tfrac12}`;
  let s=label('正しい 式',300,120,{size:26,color:IC,anchor:'middle',weight:700})+label('誤った 式',900,120,{size:26,color:QC.bad,anchor:'middle',weight:700});
  s+=T(`\\dfrac{${Q0}^2}{2${C_}}=${H}L${I_}^2`,300,185,36)+fade(seg(p,.05,.12),T(`\\dfrac{${Q0}^2}{2${C_}}=${H}L${I_}^2`,900,185,36));
  const hx=900+texWidth(`\\dfrac{${Q0}^2}{2${C_}}=${H}L${I_}^2`,36,false)/2-texWidth(`${H}L${I_}^2`,36,false)+texWidth(H,36,false)/2;
  s+=fade(seg(p,.12,.2),line(hx-18,165,hx+18,205,{color:QC.bad,w:4})+line(hx-18,205,hx+18,165,{color:QC.bad,w:4}));
  s+=fade(seg(p,.22,.3),T(`${I_}^2=0.04`,300,265,34))+fade(seg(p,.3,.38),T(`${I_}^2=0.02`,900,265,34));
  s+=fade(seg(p,.38,.46),T(`${I_}=0.20\\,\\mathrm{A}`,300,335,34)+label('○',420,345,{size:36,color:IC,weight:700}));
  s+=fade(seg(p,.46,.54),T(`${I_}\\approx0.14\\,\\mathrm{A}`,900,335,34)+label('×',1030,345,{size:36,color:QC.bad,weight:700}));
  s+=wrongCard('B','0.14 A','右辺の ½ だけを落とした',{x:300,w:600,y:390,size:28,whySize:24,g:seg(p,.6,.66)});
  return s+goalTag(G3)+ANS3(1);
 },
 [K+'wrongAC3']:(p,ctx)=>{
  let s=card(40,130,600,300,T(`|${I_}|_{\\max}=${W}${Q0}`,340,210,40)+T(`=1\\times10^{4}\\times2\\times10^{-5}`,340,300,34)+T(`=${cs(IC,'0.20\\,\\mathrm{A}')}`,340,380,38),1);
  s+=wrongSeq(p,ctx,[['A','0.032 A','fQ₀（ω でなく f）',{mid:'1592\\times2\\times10^{-5}\\approx0.032'}],['C','2.0×10⁻⁹ A','Q₀÷ω（単位 C·s）',{mid:'\\dfrac{2\\times10^{-5}}{10^{4}}=2\\times10^{-9}'}]],{opts:{...WO,x:680,w:510}});
  return s+goalTag(G3)+ANS3(1);
 },

 // ===================== まとめ =====================
 [K+'sum']:(p)=>{
  const A=iG({x:90,y:440,w:440,h:250,ticks:0,xl:'t',yl:'電流 I'});
  let s=fade(seg(p,.02,.12),A.svg+line(A.X(0),A.Y(3),A.X(250),A.Y(3),{color:IC,w:2.5,dash:'10 8'})+A.plot(Irl,{from:0,to:250,color:IC,w:5})+label('RL：「1−指数」で落ち着く',310,500,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.15,.25),osc({x:690,cy:300,w:420,amp:120,lab:'電荷 q'}).svg+label('LC：減衰せずに振動',900,500,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=answerRow([[1,'A','50 ms、1.9 A'],[2,'C','1.6 kHz'],[3,'D','0.20 A']],{g:seg(p,.5,.62),size:24,gap:8});
  return s;
 },
};
// エネルギーの棒。fe＝電場の分の割合（0〜1）。合計 80 μJ
function eBars(fe,{numE=0,numB=0,total=0}={}){
 const base=450,Hh=300,top=base-Hh,w=90,xE=140,xB=300,xT=480;
 let s=label('電場の分',xE+w/2,base+36,{size:24,color:EC,anchor:'middle',weight:700})+label('磁場の分',xB+w/2,base+36,{size:24,color:BC,anchor:'middle',weight:700})+label('合計',xT+w/2,base+36,{size:24,color:C.hi,anchor:'middle',weight:700});
 s+=line(110,base,610,base,{color:C.dim,w:3});
 for(const x of [xE,xB,xT])s+=rect(x,top,w,Hh,{fill:'none',fo:0,stroke:C.faint,sw:2,rx:4});
 const he=Hh*fe,hb=Hh*(1-fe);
 s+=rect(xE,base-he,w,he,{fill:EC,fo:.7,stroke:'none',rx:3})+rect(xB,base-hb,w,hb,{fill:BC,fo:.7,stroke:'none',rx:3});
 s+=rect(xT,base-he,w,he,{fill:EC,fo:.7,stroke:'none',rx:3})+rect(xT,top,w,hb,{fill:BC,fo:.7,stroke:'none',rx:3});
 s+=fade(numE,label('80 μJ',xE+w/2,top-14,{size:26,color:EC,anchor:'middle',weight:700}))+fade(numB,label('80 μJ',xB+w/2,top-14,{size:26,color:BC,anchor:'middle',weight:700}));
 s+=fade(total,line(110,top,610,top,{color:C.hi,w:4,dash:'10 7'})+label('合計 80 μJ',xT+w/2,top-14,{size:26,color:C.hi,anchor:'middle',weight:700}));
 return s;
}

// YouTube シリーズ「位置エネルギー・上級 2/2」(ys-uc-potential-2) — 図。Stage 1200×515.
// 色：位置 x・r 水色、力 F 緑、U 橙、K 薄橙、全エネルギー E 黄、速さ v 紫、入れない所・不安定 赤、安定 緑。
// U＝x³−3x（x は m、U は J）。折り返し点：E＝1 → −0.3473, 1.8794（と山の左 −1.5321）、E＝3 → 2.1038。
import {C,seg,fade,mix,label,line,rect,dot,ring,arrow,highlight,axes,texWidth,draw,poly} from './anim.mjs';
import {card,T,cc,cX,cH,cV,cT} from './yt1-um-sum-to-integral-1-diagrams.mjs';

const K='uc-potential-2:';
const ok=C.F,bad=C.a,CK='#ffd9b0',EARTH='#2f5f9e';
const cU=s=>cc(C.E,s),cF=s=>cc(C.F,s),cK=s=>cc(CK,s),cE=s=>cc(C.hi,s);
const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});

const U3=x=>x*x*x-3*x,dU=x=>3*x*x-3;
const XL=-0.3473,XR=1.8794,XF=-1.5321,XR3=2.1038;
const GU=(o={})=>axes({x:125,y:480,w:560,h:440,xmin:-2.3,xmax:2.5,ymin:-4.5,ymax:4.6,xticks:[-2,-1,1],yticks:[-4,-2,2,4],grid:true,...o});
function land(A,{p=1,marks=1}={}){
 let s=A.svg+label('x（m）',A.X(2.5)+8,A.Y(0)+40,{size:22,color:C.x,anchor:'end'})+label('U（J）',A.X(0)+12,A.Y(4.6)-8,{size:22,color:C.E});
 s+=A.plot(U3,{from:-2.12,to:2.22,p,color:C.E,w:5});
 s+=fade(marks,dot(A.X(1),A.Y(-2),8,C.E)+label('谷',A.X(1),A.Y(-2)+36,{size:24,color:C.ink,anchor:'middle',weight:700})
  +dot(A.X(-1),A.Y(2),8,C.E)+label('山',A.X(-1),A.Y(2)-18,{size:24,color:C.ink,anchor:'middle',weight:700}));
 return s;
}
const eline=(A,E,g=1,txt=null)=>fade(g,line(A.X(-2.25),A.Y(E),A.X(2.45),A.Y(E),{color:C.hi,w:4,dash:'10 7'})+label(txt??('E ＝ '+E+' J'),A.X(-2.3)-8,A.Y(E)+8,{size:24,color:C.hi,anchor:'end',weight:700}));
// light-orange fill between E line and curve on [a,b]
function kfill(A,E,a,b,g=1){
 const n=60,pts=[];for(let i=0;i<=n;i++){const x=a+(b-a)*i/n;pts.push([A.X(x),A.Y(Math.min(E,U3(x)))]);}
 for(let i=n;i>=0;i--){const x=a+(b-a)*i/n;pts.push([A.X(x),A.Y(E)]);}
 return fade(g,poly(pts,{fill:CK,fo:.35}));
}
// red hatching where U > E on [a,b]
function nogo(A,E,a,b,g=1){
 const n=60,pts=[];for(let i=0;i<=n;i++){const x=a+(b-a)*i/n;pts.push([A.X(x),A.Y(Math.max(E,U3(x)))]);}
 for(let i=n;i>=0;i--){const x=a+(b-a)*i/n;pts.push([A.X(x),A.Y(E)]);}
 return fade(g,poly(pts,{fill:bad,fo:.28}));
}
const ball=(A,x,g=1,onLine=null)=>fade(g,dot(A.X(x),A.Y(onLine??U3(x)),11,C.ink));
const farrow=(A,x,len,g=1,lbl='',dy=28)=>{const X=A.X(x),Y=A.Y(U3(x))-dy;return fade(g,arrow(X,Y,X+len,Y,{color:ok,w:5,head:14})+(lbl?label(lbl,X+len/2,Y-14,{size:24,color:ok,anchor:'middle',weight:700}):''));};

// ---- gravity graph (same as 1/2: r in R, U in GMm/R) ----
const GG=(o={})=>axes({x:90,y:480,w:560,h:420,xmin:0,xmax:6,ymin:-1.2,ymax:0.2,xticks:[],yticks:[],grid:false,...o});
function ggraph(A){
 let s=A.svg+rect(A.X(0),A.Y(0)+4,A.X(1)-A.X(0),A.Y(-1.2)-A.Y(0)-4,{fill:EARTH,fo:.25,stroke:'none'})+label('地球',A.X(0.5),A.Y(-0.55),{size:22,color:C.dim,anchor:'middle'});
 s+=[1,2,3,4,5].map(u=>line(A.X(u),A.Y(0)-6,A.X(u),A.Y(0)+6,{color:C.dim})+label(u===1?'R':u+'R',A.X(u),A.Y(0)-14,{size:22,color:C.x,anchor:'middle'})).join('');
 s+=label('r',A.X(6)+34,A.Y(0)+8,{size:26,color:C.x,weight:700})+label('U',A.X(0)+14,A.Y(0.2)-8,{size:28,color:C.E,weight:700});
 s+=A.plot(r=>-1/r,{from:1,to:6,color:C.E,w:5});
 return s;
}

export const ytUcPotential2Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  const A=GG();let s=ggraph(A);
  s+=fade(seg(p,.2,.35),line(A.X(1),A.Y(-0.5),A.X(6),A.Y(-0.5),{color:C.hi,w:4,dash:'10 7'})+label('E',A.X(6)+14,A.Y(-0.5)+8,{size:28,color:C.hi,weight:700}));
  s+=card(720,90,440,320,L('前回の 最後の 問い',940,140,{color:C.dim})
   +label('U の グラフ ＋ E の 横線',940,210,{size:28,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.35,.5),label('動ける 範囲は？',940,290,{size:32,color:C.hi,anchor:'middle',weight:700}))
   +fade(seg(p,.5,.65),label('折り返す 点は？',940,360,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,.02,.12),C.hi);
  return s;
 },
 [K+'recall']:(p)=>{
  let s=card(200,80,800,150,L('保存力 だけ（1/2 で 導いた）',600,125,{size:26,color:C.dim})+T(cK('K')+'+'+cU('U')+'='+cE('E'),600,190,{size:52}),seg(p,.02,.12),ok);
  s+=fade(seg(p,.4,.55),label('E：全エネルギー（運動の 初めに 決まり、変わらない）',600,330,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'land']:(p)=>{
  const A=GU();let s=land(A,{p:seg(p,.05,.4),marks:seg(p,.4,.6)});
  s+=card(720,90,440,330,T(cU('U')+'='+cX('x')+'^3-3'+cX('x'),940,150,{size:44})+label('近似・上級と 同じ 例',940,205,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.45,.6),label('谷 x ＝ 1：U ＝ −2 J',940,285,{size:28,color:C.ink,anchor:'middle',weight:700}))
   +fade(seg(p,.65,.8),label('山 x ＝ −1：U ＝ 2 J',940,350,{size:28,color:C.ink,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'launch']:(p)=>{
  const A=GU();let s=land(A);
  s+=ball(A,1)+fade(seg(p,.3,.45),arrow(A.X(1)+16,A.Y(-2)-26,A.X(1)+90,A.Y(-2)-26,{color:C.v,w:5,head:14}));
  s+=card(720,110,440,290,label('m ＝ 1.5 kg',940,170,{size:32,color:C.ink,anchor:'middle',weight:700})
   +label('谷の 底から',940,240,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.4,.55),label('K ＝ 3 J で 打ち出す',940,310,{size:32,color:CK,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 // ===== S2 動ける範囲 =====
 [K+'eline']:(p)=>{
  const A=GU();let s=land(A)+ball(A,1);
  s+=fade(seg(p,.05,.2),line(A.X(1),A.Y(-2),A.X(1),A.Y(1),{color:CK,w:7})+label('K',A.X(1)-12,A.Y(-0.5),{size:26,color:CK,anchor:'end',weight:700}));
  s+=eline(A,1,seg(p,.5,.65));
  s+=card(720,110,440,290,label('U ＝ −2 J、K ＝ 3 J',940,165,{size:26,color:C.dim,anchor:'middle'})+T(cE('E')+'='+cU('-2')+'+'+cK('3'),940,220,{size:48})
   +fade(seg(p,.3,.45),T('='+cE('1\\ \\mathrm{J}'),940,320,{size:52})),seg(p,.02,.12));
  return s;
 },
 [K+'gap']:(p)=>{
  const A=GU();let s=land(A)+eline(A,1);
  s+=kfill(A,1,XL,XR,seg(p,.3,.5));
  [-0.1,0.5,1].forEach((x,i)=>{s+=fade(seg(p,.5+i*.08,.6+i*.08),line(A.X(x),A.Y(U3(x)),A.X(x),A.Y(1),{color:CK,w:5}));});
  s+=card(720,110,440,290,T(cK('K')+'='+cE('E')+'-'+cU('U'),940,190,{size:50})
   +fade(seg(p,.45,.6),label('横線と 曲線の すき間',940,290,{size:30,color:CK,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'fast']:(p)=>{
  const A=GU();let s=land(A)+eline(A,1)+kfill(A,1,XL,XR)+ball(A,1);
  s+=line(A.X(1),A.Y(-2),A.X(1),A.Y(1),{color:CK,w:7})+label('3 J',A.X(1)-12,A.Y(-0.5),{size:24,color:CK,anchor:'end',weight:700});
  s+=card(720,90,440,340,T('\\tfrac12\\times1.5\\times'+cV('v')+'^2=3',940,160,{size:40})
   +fade(seg(p,.3,.45),T(cV('v')+'^2=4',940,250,{size:44}))
   +fade(seg(p,.5,.65),T(cV('v')+'=2\\ \\mathrm{m/s}',940,335,{size:48}))
   +fade(seg(p,.7,.85),label('いちばん 速い',940,400,{size:26,color:C.v,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'rule']:(p)=>{
  let s=card(200,50,800,140,T(cK('K')+'=\\tfrac12 m'+cV('v')+'^2\\ \\ge 0',600,125,{size:50}),seg(p,.02,.12));
  s+=fade(seg(p,.2,.35),label('2乗 なので 負に なれない',600,240,{size:28,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.4,.55),T(cE('E')+'-'+cU('U')+'\\ge 0',600,330,{size:52}));
  const e=cU('U')+'\\le '+cE('E'),w=texWidth(e,58,false);
  s+=fade(seg(p,.6,.75),T(e,600,450,{size:58})+highlight(600-w/2-28,395,w+56,95,1)+label('の 所 だけ 動ける',600+w/2+44,460,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'cross']:(p)=>{
  const A=GU();let s=land(A)+eline(A,1)+kfill(A,1,XL,XR,.6);
  s+=fade(seg(p,.2,.35),dot(A.X(XL),A.Y(1),10,C.hi)+dot(A.X(XR),A.Y(1),10,C.hi));
  s+=fade(seg(p,.6,.75),label('−0.347',A.X(XL)-8,A.Y(1)+36,{size:24,color:C.hi,anchor:'end',weight:700})+label('1.879',A.X(XR)-6,A.Y(1)+38,{size:24,color:C.hi,anchor:'end',weight:700}));
  s+=card(720,110,440,290,label('U ＝ E の 点',940,165,{size:30,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.35,.5),T(cX('x')+'^3-3'+cX('x')+'=1',940,240,{size:44}))
   +fade(seg(p,.6,.75),T(cX('x')+'\\approx -0.347,\\ \\ 1.879',940,330,{size:38})),seg(p,.02,.12));
  return s;
 },
 [K+'range']:(p)=>{
  const A=GU();let s=land(A)+eline(A,1)+kfill(A,1,XL,XR,.6);
  s+=dot(A.X(XL),A.Y(1),9,C.hi)+dot(A.X(XR),A.Y(1),9,C.hi);
  const ph=2*Math.PI*1.5*p,x=(XL+XR)/2+(XR-XL)/2*Math.sin(ph);
  s+=ball(A,x);
  s+=line(A.X(XL),A.Y(-3.3),A.X(XR),A.Y(-3.3),{color:C.x,w:6})+label('動ける 範囲',A.X((XL+XR)/2),A.Y(-3.3)-14,{size:24,color:C.x,anchor:'middle',weight:700});
  s+=card(720,110,440,290,label('−0.347 m 〜 1.879 m',940,180,{size:30,color:C.x,anchor:'middle',weight:700})
   +fade(seg(p,.45,.6),label('山の 2 J に 届かない',940,270,{size:30,color:C.ink,anchor:'middle',weight:700})+label('（E ＝ 1 J）',940,320,{size:26,color:C.hi,anchor:'middle'})),seg(p,.02,.12));
  return s;
 },
 [K+'forbid']:(p)=>{
  const A=GU();let s=land(A)+eline(A,1)+kfill(A,1,XL,XR,.6);
  s+=fade(seg(p,.05,.2),kfill(A,1,-2.12,XF,.6)+label('U ＜ E',A.X(-1.9),A.Y(0.35),{size:22,color:CK,anchor:'middle',weight:700}));
  s+=nogo(A,1,XF,XL,seg(p,.35,.5))+fade(seg(p,.4,.55),label('U ＞ E',A.X(-1),A.Y(2)+40,{size:24,color:bad,anchor:'middle',weight:700}));
  s+=card(720,110,440,290,label('山の 左にも 低い 所',940,170,{size:28,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.45,.6),label('間に U ＞ E の 山',940,250,{size:30,color:bad,anchor:'middle',weight:700}))
   +fade(seg(p,.65,.8),label('→ 入れない',940,320,{size:32,color:bad,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'wall']:(p)=>{
  const A=GU();let s=land(A)+eline(A,1)+kfill(A,1,XL,XR,.6)+nogo(A,1,XF,XL)+nogo(A,1,XR,2.22);
  s+=card(720,110,440,290,label('U ＞ E の 所',940,170,{size:30,color:bad,anchor:'middle',weight:700})
   +fade(seg(p,.2,.35),T(cK('K')+'='+cE('E')+'-'+cU('U')+'<0',940,250,{size:42}))
   +fade(seg(p,.5,.65),label('古典力学では 通れない 壁',940,330,{size:28,color:C.ink,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 // ===== S3 折り返し点 =====
 [K+'stop']:(p)=>{
  const A=GU();let s=land(A)+eline(A,1)+kfill(A,1,XL,XR,.6);
  const x=mix(1,XR,Math.sin(Math.PI/2*seg(p,.05,.5)));
  s+=ball(A,x,1,x>XR-0.01?1:null);
  s+=fade(seg(p,.5,.65),ring(A.X(XR),A.Y(1),26,{color:C.hi,w:3}));
  s+=card(720,110,440,290,label('x ≈ 1.879',940,170,{size:32,color:C.x,anchor:'middle',weight:700})
   +fade(seg(p,.3,.45),T(cK('K')+'=0,\\quad '+cV('v')+'=0',940,250,{size:42}))
   +fade(seg(p,.6,.75),label('一瞬 止まる',940,330,{size:30,color:C.ink,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'slope']:(p)=>{
  const A=GU();let s=land(A)+eline(A,1);
  const m=dU(XR),tl=x=>U3(XR)+m*(x-XR);
  s+=ball(A,XR);
  s+=fade(seg(p,.25,.45),A.plot(tl,{from:XR-0.45,to:XR+0.35,color:C.hi,w:3,dash:'8 6'}));
  s+=card(720,110,440,290,label('力は 0 ではない',940,170,{size:30,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.25,.4),T(cU("U'")+'=3'+cX('x')+'^2-3',940,245,{size:40}))
   +fade(seg(p,.55,.7),T('\\approx 7.6\\ \\mathrm{J/m}',940,325,{size:42})),seg(p,.02,.12));
  return s;
 },
 [K+'turn']:(p)=>{
  const A=GU();let s=land(A)+eline(A,1);
  const back=seg(p,.6,.95),x=mix(XR,1.3,back);
  s+=ball(A,x);
  s+=farrow(A,XR,-90,seg(p,.1,.25)*(1-back),'F');
  s+=card(720,90,440,340,T(cF('F')+'=-'+cU("U'"),940,150,{size:44})
   +fade(seg(p,.15,.3),T('\\approx -7.6\\ \\mathrm{N}',940,235,{size:44})+label('左向き',940,295,{size:28,color:ok,anchor:'middle',weight:700}))
   +fade(seg(p,.55,.7),label('止まった 瞬間に 押され、戻る',940,375,{size:26,color:C.ink,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'turn2']:(p)=>{
  const A=GU();let s=land(A)+eline(A,1);
  s+=ball(A,XL)+farrow(A,XL,70,seg(p,.4,.55));
  s+=card(720,90,440,340,label('x ≈ −0.347',940,145,{size:30,color:C.x,anchor:'middle',weight:700})
   +fade(seg(p,.15,.3),T(cU("U'")+'\\approx -2.64\\ \\mathrm{J/m}',940,225,{size:38}))
   +fade(seg(p,.4,.55),T(cF('F')+'\\approx +2.64\\ \\mathrm{N}',940,305,{size:40})+label('右向き → 谷の ほうへ',940,370,{size:26,color:ok,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'tp']:(p)=>{
  const A=GU();let s=land(A)+eline(A,1)+kfill(A,1,XL,XR,.6);
  s+=ring(A.X(XL),A.Y(1),24,{color:C.hi,w:3})+ring(A.X(XR),A.Y(1),24,{color:C.hi,w:3});
  s+=farrow(A,XL,60,1)+farrow(A,XR,-60,1);
  s+=card(720,110,440,290,label('折り返し点',940,170,{size:34,color:C.hi,anchor:'middle',weight:700})
   +label('E ＝ U → 速さ 0',940,250,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.4,.55),label('力に 押されて 戻る',940,320,{size:28,color:ok,anchor:'middle',weight:700})),seg(p,.02,.12),C.hi);
  return s;
 },
 [K+'e3']:(p)=>{
  const A=GU();let s=land(A)+ball(A,1);
  s+=fade(seg(p,.1,.25),line(A.X(1),A.Y(-2),A.X(1),A.Y(3),{color:CK,w:7})+label('K ＝ 5 J',A.X(1)-12,A.Y(0.8),{size:24,color:CK,anchor:'end',weight:700}));
  s+=eline(A,3,seg(p,.3,.45));
  s+=fade(seg(p,.55,.7),line(A.X(-1),A.Y(2),A.X(-1),A.Y(3),{color:CK,w:5}));
  s+=card(720,110,440,290,T(cE('E')+'=-2+5=3\\ \\mathrm{J}',940,180,{size:40})
   +fade(seg(p,.5,.65),label('山の 2 J より 上',940,270,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'e3b']:(p)=>{
  const A=GU();let s=land(A)+eline(A,3)+kfill(A,3,-2.12,XR3,.5);
  s+=fade(seg(p,.1,.25),dot(A.X(XR3),A.Y(3),10,C.hi)+label('2.104',A.X(XR3)-10,A.Y(3)-14,{size:24,color:C.hi,anchor:'end',weight:700}));
  const u=seg(p,.35,.95),x=u<.3?mix(1,XR3,Math.sin(Math.PI/2*u/.3)):mix(XR3,-0.6,(u-.3)/.7);
  s+=ball(A,x);
  s+=card(720,110,440,290,T(cX('x')+'^3-3'+cX('x')+'=3',940,170,{size:42})
   +fade(seg(p,.15,.3),T(cX('x')+'\\approx 2.104',940,250,{size:44}))
   +fade(seg(p,.5,.65),label('戻って 谷 → 山へ',940,330,{size:28,color:C.ink,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'e3c']:(p)=>{
  const A=GU();let s=land(A)+eline(A,3)+kfill(A,3,-2.12,XR3,.5);
  s+=line(A.X(-1),A.Y(2),A.X(-1),A.Y(3),{color:CK,w:6});
  const x=mix(-0.6,-2.1,seg(p,.1,.9));
  s+=ball(A,x);
  s+=fade(seg(p,.5,.65),arrow(A.X(-1.6),A.Y(-4),A.X(-2.2),A.Y(-4),{color:C.x,w:5,head:14})+label('左へ 去る',A.X(-1.9),A.Y(-4)-14,{size:24,color:C.x,anchor:'middle',weight:700}));
  s+=card(720,110,440,290,label('山頂でも K ＝ 1 J',940,170,{size:30,color:CK,anchor:'middle',weight:700})
   +fade(seg(p,.25,.4),label('→ 山を 越える',940,240,{size:30,color:C.ink,anchor:'middle',weight:700}))
   +fade(seg(p,.5,.65),label('左に U ＞ E の 所 なし',940,320,{size:28,color:C.ink,anchor:'middle'})),seg(p,.02,.12));
  return s;
 },
 // ===== S4 安定と不安定 =====
 [K+'eq']:(p)=>{
  const A=GU();let s=land(A);
  s+=fade(seg(p,.15,.3),A.plot(x=>-2,{from:0.6,to:1.4,color:C.hi,w:3,dash:'7 6'})+A.plot(x=>2,{from:-1.4,to:-0.6,color:C.hi,w:3,dash:'7 6'}));
  s+=fade(seg(p,.55,.7),ball(A,1)+ball(A,-1));
  s+=card(720,110,440,290,T(cU("U'")+'=0',940,170,{size:46})+label('傾き 0 ＝ 力 0',940,230,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.3,.45),T(cX('x')+'=1,\\ \\ '+cX('x')+'=-1',940,305,{size:40}))
   +fade(seg(p,.6,.75),label('静かに 置けば 止まったまま',940,365,{size:24,color:C.ink,anchor:'middle'})),seg(p,.02,.12));
  return s;
 },
 [K+'v1']:(p)=>{
  const A=GU();let s=land(A);
  s+=ball(A,1.1)+farrow(A,1.1,-70,seg(p,.4,.55),'F');
  s+=card(720,90,440,340,label('谷の 右 x ＝ 1.1',940,140,{size:28,color:C.x,anchor:'middle',weight:700})
   +fade(seg(p,.15,.3),T(cF('F')+'=-(3\\times1.21-3)',940,215,{size:38}))
   +fade(seg(p,.35,.5),T('=-0.63\\ \\mathrm{N}',940,290,{size:42}))
   +fade(seg(p,.55,.7),label('左向き → 谷へ 戻す',940,365,{size:28,color:ok,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'v2']:(p)=>{
  const A=GU();let s=land(A);
  s+=ball(A,1.1)+farrow(A,1.1,-70,1);
  s+=ball(A,0.9)+farrow(A,0.9,65,seg(p,.15,.3),'',62);
  s+=card(720,90,440,340,label('谷の 左 x ＝ 0.9',940,140,{size:28,color:C.x,anchor:'middle',weight:700})
   +fade(seg(p,.1,.25),T(cF('F')+'=-(3\\times0.81-3)=+0.57\\ \\mathrm{N}',940,215,{size:30}))
   +fade(seg(p,.3,.45),label('右向き → 谷へ 戻す',940,280,{size:28,color:ok,anchor:'middle',weight:700}))
   +fade(seg(p,.55,.7),label('谷 ＝ 安定',940,365,{size:40,color:ok,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'h1']:(p)=>{
  const A=GU();let s=land(A);
  s+=ball(A,-0.9)+farrow(A,-0.9,65,seg(p,.3,.45),'F');
  s+=card(720,90,440,340,label('山の 右 x ＝ −0.9',940,140,{size:28,color:C.x,anchor:'middle',weight:700})
   +fade(seg(p,.15,.3),T(cF('F')+'=-(3\\times0.81-3)=+0.57\\ \\mathrm{N}',940,215,{size:30}))
   +fade(seg(p,.45,.6),label('右向き → 山頂から 離れる',940,290,{size:26,color:bad,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'h2']:(p)=>{
  const A=GU();let s=land(A);
  s+=ball(A,-0.9)+farrow(A,-0.9,65,1);
  s+=ball(A,-1.1)+farrow(A,-1.1,-70,seg(p,.15,.3),'',62);
  s+=card(720,90,440,340,label('山の 左 x ＝ −1.1',940,140,{size:28,color:C.x,anchor:'middle',weight:700})
   +fade(seg(p,.1,.25),T(cF('F')+'=-(3\\times1.21-3)=-0.63\\ \\mathrm{N}',940,215,{size:30}))
   +fade(seg(p,.3,.45),label('左向き → 山頂から 離れる',940,280,{size:26,color:bad,anchor:'middle',weight:700}))
   +fade(seg(p,.55,.7),label('山頂 ＝ 不安定',940,365,{size:40,color:bad,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'lesson']:(p)=>{
  let s=card(150,60,420,330,label('谷 x ＝ 1',360,120,{size:30,color:C.ink,anchor:'middle',weight:700})+label('力 0',360,180,{size:28,color:C.dim,anchor:'middle'})
   +label('ずらすと 戻る',360,250,{size:30,color:ok,anchor:'middle',weight:700})+label('安定',360,330,{size:40,color:ok,anchor:'middle',weight:700}),seg(p,.02,.12),ok);
  s+=card(630,60,420,330,label('山 x ＝ −1',840,120,{size:30,color:C.ink,anchor:'middle',weight:700})+label('力 0',840,180,{size:28,color:C.dim,anchor:'middle'})
   +label('ずらすと 離れる',840,250,{size:30,color:bad,anchor:'middle',weight:700})+label('不安定',840,330,{size:40,color:bad,anchor:'middle',weight:700}),seg(p,.1,.2),bad);
  s+=fade(seg(p,.45,.6),label('力 0 だけでは 決まらない → ずらしたときの 力の 向き',600,460,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'shm']:(p)=>{
  const A=GU();let s=land(A);
  const x=1+0.25*Math.sin(2*Math.PI*2*p);
  s+=ball(A,x)+A.plot(x=>-2+3*(x-1)**2,{from:0.35,to:1.65,color:C.hi,w:3,dash:'8 6'});
  s+=card(720,110,440,290,label('谷の 近く ＝ ばね',940,170,{size:30,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.3,.45),T(cH("U''(1)")+'=6\\ \\mathrm{N/m}',940,250,{size:42}))
   +fade(seg(p,.5,.65),label('振動の 方程式・上級',940,325,{size:24,color:C.dim,anchor:'middle'})),seg(p,.02,.12));
  return s;
 },
 // ===== S5 同じ読み方を使う =====
 [K+'grav']:(p)=>{
  const A=GG();let s=ggraph(A);
  s+=fade(seg(p,.55,.7),line(A.X(1),A.Y(-0.5),A.X(6),A.Y(-0.5),{color:C.hi,w:4,dash:'10 7'})+label('E',A.X(6)+14,A.Y(-0.5)+8,{size:28,color:C.hi,weight:700}));
  s+=card(720,110,440,290,label('前回の 万有引力',940,165,{size:28,color:C.dim,anchor:'middle'})
   +T(cU('U')+'=-\\dfrac{GMm}{'+cX('r')+'}',940,255,{size:46})
   +fade(seg(p,.5,.65),label('E の 横線を 引く',940,345,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'grav2']:(p)=>{
  const A=GG();let s=ggraph(A);
  s+=line(A.X(1),A.Y(-0.5),A.X(6),A.Y(-0.5),{color:C.hi,w:4,dash:'10 7'})+label('E',A.X(6)+14,A.Y(-0.5)+8,{size:28,color:C.hi,weight:700});
  s+=card(680,90,480,340,label('真上に 打ち上げ',920,140,{size:28,color:C.ink,anchor:'middle',weight:700})
   +T(cV('v')+'=\\sqrt{gR}\\approx 7.9\\ \\mathrm{km/s}',920,215,{size:38})
   +fade(seg(p,.4,.55),T(cE('E')+'=\\tfrac12 m\\,gR-\\dfrac{GMm}{R}',920,320,{size:40})),seg(p,.02,.12));
  return s;
 },
 [K+'grav3']:(p)=>{
  let s=label('GM ＝ gR²（中級）',600,70,{size:28,color:C.hi,anchor:'middle',weight:700});
  s+=fade(seg(p,.1,.25),T('\\tfrac12 m\\,gR=\\dfrac{GMm}{2R}',600,180,{size:48}));
  s+=fade(seg(p,.4,.55),T(cE('E')+'=\\dfrac{GMm}{2R}-\\dfrac{GMm}{R}',600,310,{size:48}));
  const e='='+cE('-\\dfrac{GMm}{2R}'),w=texWidth(e,56,false);
  s+=fade(seg(p,.6,.75),T(e,560,440,{size:56})+label('負',560+w/2+30,452,{size:36,color:bad,weight:700}));
  return s;
 },
 [K+'grav4']:(p)=>{
  const A=GG();let s=ggraph(A);
  s+=line(A.X(1),A.Y(-0.5),A.X(6),A.Y(-0.5),{color:C.hi,w:4,dash:'10 7'})+label('E ＝ −GMm/(2R)',A.X(6),A.Y(-0.5)+34,{size:22,color:C.hi,anchor:'end',weight:700});
  s+=fade(seg(p,.15,.3),dot(A.X(2),A.Y(-0.5),10,C.hi)+line(A.X(2),A.Y(-0.5),A.X(2),A.Y(0),{color:C.faint,w:2,dash:'5 5'}));
  const u=seg(p,.3,.95),r=1+Math.sin(Math.PI*u);
  s+=fade(seg(p,.3,.35),dot(A.X(r),A.Y(-1/r),11,C.ink));
  s+=card(720,110,440,290,T('-\\dfrac{GMm}{'+cX('r')+'}=-\\dfrac{GMm}{2R}',940,185,{size:36})
   +fade(seg(p,.25,.4),T(cX('r')+'=2R',940,275,{size:46}))
   +fade(seg(p,.5,.65),label('地表から R の 高さで 戻る',940,355,{size:26,color:C.ink,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'grav5']:(p)=>{
  const A=GG();let s=ggraph(A);
  s+=line(A.X(1),A.Y(-0.5),A.X(6),A.Y(-0.5),{color:C.faint,w:3,dash:'10 7'})+dot(A.X(2),A.Y(-0.5),8,C.faint);
  s+=fade(seg(p,.1,.25),line(A.X(1),A.Y(0.17),A.X(6),A.Y(0.17),{color:C.hi,w:4,dash:'10 7'})+label('E ≥ 0',A.X(6),A.Y(0.17)-12,{size:24,color:C.hi,anchor:'end',weight:700}));
  s+=card(720,110,440,290,label('E ≥ 0',940,170,{size:34,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.25,.4),label('交わらない → 折り返し点 なし',940,250,{size:26,color:C.ink,anchor:'middle',weight:700}))
   +fade(seg(p,.5,.65),label('＝ 前回の 脱出',940,325,{size:30,color:ok,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'mol']:(p)=>{
  const A=axes({x:90,y:470,w:560,h:400,xmin:0.8,xmax:3,ymin:-1.3,ymax:1.6,xticks:[],yticks:[],grid:false});
  const LJ=r=>4*(Math.pow(r,-12)-Math.pow(r,-6));
  let s=A.svg+A.plot(LJ,{from:0.98,to:3,color:C.E,w:5})+label('原子の 間の 距離',A.X(3)-4,A.Y(0)+40,{size:22,color:C.x,anchor:'end'})+label('U',A.X(0.8)+14,A.Y(1.6)-8,{size:28,color:C.E,weight:700});
  const rm=Math.pow(2,1/6);
  s+=fade(seg(p,.15,.3),line(A.X(rm),A.Y(-1),A.X(rm),A.Y(0),{color:C.faint,w:2,dash:'5 5'})+label('結合の 長さ',A.X(rm)+8,A.Y(0)-14,{size:22,color:C.x}));
  const E=-0.5,r1=1.0267,r2=1.3775;
  s+=fade(seg(p,.4,.55),line(A.X(0.95),A.Y(E),A.X(3),A.Y(E),{color:C.hi,w:4,dash:'10 7'})+label('E',A.X(3)+12,A.Y(E)+8,{size:26,color:C.hi,weight:700}));
  const ph=2*Math.PI*1.5*p,r=(r1+r2)/2+(r2-r1)/2*Math.sin(ph);
  s+=fade(seg(p,.55,.65),dot(A.X(r),A.Y(LJ(r)),10,C.ink));
  s+=card(720,110,440,290,label('分子の 結合',940,170,{size:32,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.3,.45),label('U の 谷 ＝ 結合の 長さ',940,245,{size:28,color:C.x,anchor:'middle'}))
   +fade(seg(p,.6,.75),label('E が 谷の 中 → 結びついて 揺れる',940,320,{size:24,color:C.hi,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'apps']:(p)=>{
  const A=axes({x:90,y:450,w:520,h:330,xmin:0,xmax:4,ymin:-1.2,ymax:1.4,xticks:[],yticks:[],grid:false});
  const f=x=>-0.2*x+1.1*Math.exp(-((x-2)**2)/0.35)-0.8*Math.exp(-((x-0.8)**2)/0.25)-0.9*Math.exp(-((x-3.3)**2)/0.3);
  let s=A.svg+A.plot(f,{from:0.1,to:3.95,color:C.E,w:5})+label('反応の 進み',A.X(4)-4,A.Y(1.1),{size:22,color:C.dim,anchor:'end'});
  const xm=2,top=f(xm),xa=0.8,ya=f(xa);
  s+=fade(seg(p,.1,.25),line(A.X(xa),A.Y(ya),A.X(xa),A.Y(top),{color:C.hi,w:5})+line(A.X(xa)-10,A.Y(top),A.X(xm),A.Y(top),{color:C.faint,w:2,dash:'5 5'})
   +label('越えるのに 要る エネルギー',A.X(xa),A.Y(top)-16,{size:22,color:C.hi,weight:700}));
  s+=card(680,90,480,340,label('化学反応の 山',920,150,{size:30,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.45,.6),label('惑星の 軌道',920,240,{size:30,color:C.ink,anchor:'middle',weight:700})+label('有効ポテンシャル という 地形',920,290,{size:26,color:C.x,anchor:'middle'})+label('（ここでは 名前 だけ）',920,335,{size:24,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.7,.85),label('どれも 同じ 読み方',920,395,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'sum']:(p)=>{
  const A=GU({x:110,w:500});let s=land(A)+eline(A,1)+kfill(A,1,XL,XR,.6)+nogo(A,1,XF,XL,.8)+nogo(A,1,XR,2.22,.8);
  s+=dot(A.X(XL),A.Y(1),9,C.hi)+dot(A.X(XR),A.Y(1),9,C.hi);
  s+=card(660,90,500,330,T(cK('K')+'='+cE('E')+'-'+cU('U')+'\\ge0',910,160,{size:44})
   +fade(seg(p,.25,.4),label('U が E より 低い 所 だけ 動ける',910,245,{size:26,color:C.ink,anchor:'middle',weight:700}))
   +fade(seg(p,.5,.65),label('E ＝ U の 点 ＝ 折り返し点',910,325,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.02,.12),ok);
  return s;
 },
 [K+'sum2']:(p)=>{
  const A=GU({x:110,w:500});let s=land(A);
  s+=ball(A,1.1)+farrow(A,1.1,-60,1)+ball(A,0.9)+farrow(A,0.9,55,1,'',58)+ball(A,-0.9)+farrow(A,-0.9,55,1)+ball(A,-1.1)+farrow(A,-1.1,-60,1,'',58);
  s+=card(660,90,500,330,label('力 0 の 点',910,150,{size:28,color:C.dim,anchor:'middle'})
   +label('谷 → 安定',910,225,{size:34,color:ok,anchor:'middle',weight:700})+label('山 → 不安定',910,295,{size:34,color:bad,anchor:'middle',weight:700})
   +fade(seg(p,.5,.65),label('決めるのは ずらしたときの 力の 向き',910,375,{size:24,color:C.hi,anchor:'middle',weight:700})),seg(p,.02,.12),ok);
  return s;
 },
 [K+'bridge']:(p)=>{
  let s=card(250,120,700,200,label('ここまで',600,180,{size:28,color:C.dim,anchor:'middle'})+label('1つの 物体の エネルギー 保存',600,260,{size:36,color:C.E,anchor:'middle',weight:700}),seg(p,.02,.15));
  return s;
 },
 [K+'next']:(p)=>{
  const g=seg(p,.05,.3),d=mix(0,60,seg(p,.3,.6));
  let s=line(150,380,1050,380,{color:C.dim,w:3});
  s+=fade(g,rect(420-d-110,280,110,100,{fill:C.x,fo:.3,stroke:C.x,rx:8})+label('A',420-d-55,342,{size:30,color:C.ink,anchor:'middle',weight:700})
   +rect(420+d+40,300,90,80,{fill:C.p,fo:.3,stroke:C.p,rx:8})+label('B',420+d+85,350,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.25),arrow(420-d-10,260,420-d-90,260,{color:ok,w:5,head:14})+arrow(420+d+40,260,420+d+120,260,{color:ok,w:5,head:14})+label('押し合う',420,230,{size:26,color:ok,anchor:'middle',weight:700}));
  s+=card(720,90,440,250,label('次の 問い',940,140,{size:26,color:C.dim,anchor:'middle'})
   +label('運動量の 合計は',940,210,{size:30,color:C.p,anchor:'middle',weight:700})
   +fade(seg(p,.35,.5),label('なぜ 変わらない？',940,280,{size:34,color:C.hi,anchor:'middle',weight:700})),seg(p,.02,.12),C.hi);
  return s;
 },
};

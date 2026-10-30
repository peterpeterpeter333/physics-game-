// 問題編 解説「0.2 H のコイルと、6600 V の変圧器」（q-ue-faraday、大学編 27 電磁誘導・上級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/27_電磁誘導.md の q-ue-faraday（解説 21 行）。
// 画面の配置：左に図、右に説明の枠（紺の塗り・角の丸い枠）。誤答カードは右の枠の中・下。札の帯（y＜78）には図を描かない。
// 色（単元動画と同じ）：電流 I・i と巻き線 緑、起電力 ℰ・電圧 V 紫、磁束 Φ・鎖交磁束 Ψ・Li 黄、エネルギー U・電力 P 橙、時間 t 金、鉄心 灰、負・誤り 赤。
// 部品：長いコイルの絵は 電磁誘導・上級 1/2（yt1-ue-faraday-1-diagrams.mjs）の solenoid、軸とグラフは 中級 1/3 の graph を借りる（あちらは編集しない）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,poly} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,note,cueT,voiceEnd} from './yt1-qx-common.mjs';
import {head,graph,arcPts} from './yt1-um-induction-1-diagrams.mjs';
import {solenoid} from './yt1-ue-faraday-1-diagrams.mjs';

const K='qx-ue-faraday:';
const CI=C.F,EMF=C.v,PHI=C.hi,WC=C.E,TC=C.t,BAD='#ff6b6b',CORE='#8795ad',SURF='#c9d6ee';
const T=(s,x,y,size=36,o={})=>tex(s,x,y,{size,auto:false,...o});
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const PX=680,PW=500,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const LB=(s,x,y,size=26,color=C.ink,o={})=>label(s,x,y,{size,color,anchor:'middle',weight:700,...o});
const LN=(s,x,y,size=24,color=C.dim,o={})=>label(s,x,y,{size,color,anchor:'middle',...o});
const Ic=cs(CI,'I'),ic=cs(CI,'i'),Vt=cs(EMF,'V'),tt=cs(TC,'t'),Ut=cs(WC,'U'),I1=cs(CI,'I_1'),I2=cs(CI,'I_2'),V1=cs(EMF,'V_1'),V2=cs(EMF,'V_2'),E2=cs(EMF,'\\mathcal{E}_2'),P2=cs(PHI,'\\Psi_2');
const dIdt=`\\dfrac{d${Ic}}{d${tt}}`,dI1=`\\dfrac{d${I1}}{d${tt}}`;
const G1='端子電圧 V と エネルギー U',G2='コイル2の起電力（増やす間／保ったあと）',G3='N₂ と I₁';
const ANS1=g=>answerTag(1,'A','30 V、0.9 J',{g}),ANS2=g=>answerTag(2,'C','12 V、0 V',{g}),ANS3=g=>answerTag(3,'B','50、0.30 A',{g});

function atWord(ctx,frag,fb=.5){
 const r=(ctx?.cue?.reading??'').replace(/\s/g,''),f=frag.replace(/\s/g,''),i=r.indexOf(f);
 if(!r||i<0)return fb;return i/r.length*voiceEnd(ctx);
}
function wins(ctx,frags){const a=frags.map(f=>atWord(ctx,f));return [[0,a[0]],...a.map((x,i)=>[x,i===a.length-1?1:a[i+1]])];}

// ===== コイル（横から見た長いコイル：電流の矢印や磁場は描かない）=====
const coilPic=(x0,x1,cy,ry,n,o={})=>solenoid({x0,x1,cy,ry,rx:Math.min(14,ry*.16),n,Bg:0,curG:0,leads:0,heads:0,...o});
// 電流–時間のグラフ（前半：0〜0.03 s、0〜4 A、0.02 s で 3 A までの坂）
function iGraph1({x0=90,y0=470,w=440,h=220,g=1,prog=1,hl=0,tri=0,triLab=0}={}){
 const G=graph(x0,y0,w,h,{tmax:.03,fmin:0,fmax:4,tt:[[.02,'0.02']],ft:[[3,'3']],xl:'t［s］',yl:'I［A］',g,ycol:CI});
 const {X,Y}=G;let s=G.s+fade(g,line(x0,Y(3),X(.02),Y(3),{color:C.grid,w:1.5})+line(X(.02),Y(3),X(.02),Y(0),{color:C.grid,w:1.5}));
 if(prog>0)s+=fade(g,draw([[X(0),Y(0)],[X(.02*prog),Y(3*prog)]],1,{color:hl>0?PHI:CI,w:5+3*hl}));
 if(tri>0)s+=fade(tri,line(X(0),Y(0),X(.02),Y(0),{color:TC,w:5})+line(X(.02),Y(0),X(.02),Y(3),{color:CI,w:4,dash:'2 0'}));
 if(triLab>0)s+=fade(triLab,label('3 A',X(.02)+10,Y(1.5)+8,{size:26,color:CI,weight:700})+label('0.02 s',X(.01),Y(0)+52,{size:24,color:TC,anchor:'middle',weight:700}));
 return {svg:s,X,Y};
}
// 端子電圧のグラフ：0〜0.02 s で 30 V 一定
function vGraph1({x0=90,y0=470,w=440,h=110,g=1,prog=1}={}){
 const G=graph(x0,y0,w,h,{tmax:.03,fmin:0,fmax:40,tt:[],ft:[[30,'30']],xl:'',yl:'V［V］',g,ycol:EMF});
 const {X,Y}=G;let s=G.s;
 if(prog>0)s+=fade(g,draw([[X(0),Y(30)],[X(.02*prog),Y(30)]],1,{color:EMF,w:5}));
 return {svg:s,X,Y};
}
// Li–i のグラフ（i 0〜3.6 A、Li 0〜0.72 Wb）。I＝3 A、LI＝0.6 Wb
function liGraph({x0=110,y0=450,w=460,h=320,g=1,strips=0,n=8,hl=-1,tri=0,rectG=0,iLab=0,diLab=0,vals=0,hiH=0}={}){
 const X=i=>x0+w*i/3.6,Y=v=>y0-h*v/.72;
 let s=arrow(x0-6,y0,x0+w+20,y0,{color:C.dim,w:2.5,head:12})+arrow(x0,y0+6,x0,y0-h-20,{color:C.dim,w:2.5,head:12});
 s+=T(`${ic}`,x0+w+30,y0+8,30)+T(`L${ic}`,x0,y0-h-38,28);
 if(rectG>0)s+=fade(rectG,rect(X(0),Y(.6),X(3)-X(0),Y(0)-Y(.6),{fill:BAD,fo:.08,stroke:BAD,sw:3,rx:0})+line(X(0),Y(.6),X(3),Y(.6),{color:BAD,w:3,dash:'8 6'}));
 if(tri>0)s+=fade(tri,poly([[X(0),Y(0)],[X(3),Y(0)],[X(3),Y(.6)]],{fill:WC,fo:.35,stroke:WC,sw:2}));
 if(strips>0)for(let k=0;k<n;k++){const a=3*k/n,b=3*(k+1)/n,on=k===hl,gk=clamp(strips*n-k);
  if(gk>0)s+=fade(gk,rect(X(a),Y(.2*a),X(b)-X(a),Y(0)-Y(.2*a),{fill:on?PHI:WC,fo:on?.55:.3,stroke:on?PHI:WC,sw:1.5,rx:0}));}
 s+=line(X(0),Y(0),X(3.3),Y(.66),{color:C.ink,w:4});
 s+=line(X(3),y0-6,X(3),y0+6,{color:C.dim})+line(x0-6,Y(.6),x0+6,Y(.6),{color:C.dim});
 s+=vals?label('3 A',X(3),y0+32,{size:24,color:CI,anchor:'middle',weight:700})+label('0.6',x0-10,Y(.6)+8,{size:24,color:PHI,anchor:'end',weight:700})
  :T(Ic,X(3),y0+30,28)+T(`L${Ic}`,x0-30,Y(.6),26);
 if(hiH>0)s+=fade(hiH,line(X(3),Y(0),X(3),Y(.6),{color:PHI,w:8})+label('LI ＝ 0.6 Wb',X(3)-14,Y(.3)+8,{size:26,color:PHI,weight:700,anchor:'end'}));
 if(iLab>0){const xi=X(1.5);s+=fade(iLab,line(xi,y0,xi,Y(.3),{color:CI,w:2,dash:'5 5'})+dot(xi,y0,6,CI)+label('i ＝ 途中の 電流',xi,y0+34,{size:22,color:CI,anchor:'middle',weight:700}));}
 if(diLab>0){const xa=X(1.5),xb=X(1.5+3/n);s+=fade(diLab,rect(xa,Y(.3),xb-xa,Y(0)-Y(.3),{fill:PHI,fo:.5,stroke:PHI,sw:2,rx:0})+label('di ＝ 少しの 増加',xb+8,Y(.3)-18,{size:22,color:PHI,weight:700}));}
 return fade(g,s);
}
// 中盤：コイル1の電流（0〜0.03 s、0〜5 A。0.01 s で 4 A、そのあと平ら）と、コイル2の起電力
function i1Graph({x0=90,y0=300,w=440,h=150,g=1,prog=1,hlRamp=0,hlFlat=0}={}){
 const G=graph(x0,y0,w,h,{tmax:.032,fmin:0,fmax:5,tt:[[.01,'0.01']],ft:[[4,'4']],xl:'t［s］',yl:'I₁［A］',g,ycol:CI});
 const {X,Y}=G;let s=G.s;
 const pts=[[0,0],[.01,4],[.03,4]],u=prog*.03;let pp=[[X(0),Y(0)]];
 if(u<=.01)pp.push([X(u),Y(400*u)]);else pp.push([X(.01),Y(4)],[X(u),Y(4)]);
 s+=fade(g,draw(pp,1,{color:CI,w:5}));
 if(hlRamp>0)s+=fade(hlRamp,draw([[X(0),Y(0)],[X(.01),Y(4)]],1,{color:PHI,w:9}));
 if(hlFlat>0)s+=fade(hlFlat,draw([[X(.01),Y(4)],[X(.03),Y(4)]],1,{color:PHI,w:9}));
 return {svg:s,X,Y};
}
function e2Graph({x0=90,y0=480,w=440,h=110,g=1,ramp=0,flat=0}={}){
 const G=graph(x0,y0,w,h,{tmax:.032,fmin:0,fmax:15,tt:[],ft:[[12,'12']],xl:'',yl:'|ℰ₂|［V］',g,ycol:EMF});
 const {X,Y}=G;let s=G.s;
 if(ramp>0)s+=fade(g,draw([[X(0),Y(12)],[X(.01*ramp),Y(12)]],1,{color:EMF,w:5}));
 if(flat>0)s+=fade(flat,line(X(.01),Y(12),X(.01),Y(0),{color:EMF,w:3,dash:'5 5'})+draw([[X(.01),Y(0)],[X(.01+.02*flat),Y(0)]],1,{color:EMF,w:6}));
 return {svg:s,X,Y};
}
// 向かい合う2つのコイル（コイル1 左、コイル2 右）。link：コイル1の磁束（黄）がコイル2を貫く
function twoCoils({cx=310,cy=170,g=1,link=0,ry=60,lab=1}={}){
 let s=coilPic(cx-250,cx-30,cy,ry,6)+coilPic(cx+30,cx+250,cy,ry,6,{col:CI});
 if(link>0)s+=fade(link,[-.5,0,.5].map(f=>draw([[cx-260,cy+f*ry],[cx+260,cy+f*ry*1.1]],1,{color:PHI,w:3,dash:'10 7'})+head(cx+262,cy+f*ry*1.1,1,0,{color:PHI,L:14})).join(''));
 if(lab)s+=LB('コイル1',cx-140,cy+ry+38,24,CI)+LB('コイル2',cx+140,cy+ry+38,24,CI);
 return fade(g,s);
}
// 変圧器（鉄心 灰、1次 5 巻き・2次 3 巻きの絵）
const TR={x0:170,x1:470,y0:100,y1:440,w:60};
function legCoil(cx,ya,yb,n,{g=1,col=CI,hl=-1}={}){
 let s='';const rx=TR.w/2+20,ry=11;
 for(let i=0;i<n;i++){const y=ya+(yb-ya)*(i+.5)/n,on=i===hl;
  s+=draw(arcPts(cx,y,rx,ry,0,180,16),1,{color:on?PHI:col,w:3,opacity:.45})+draw(arcPts(cx,y,rx,ry,180,360,16),1,{color:on?PHI:col,w:on?7:5});}
 return fade(g,s);
}
function transformer({g=1,phi=0,hl=-1,labs=1,n2Lab='N₂ ＝ ？',load=1,src=1,txt=1}={}){
 const {x0,x1,y0,y1,w}=TR,xl=x0+w/2,xr=x1-w/2;
 let s=rect(x0,y0,x1-x0,y1-y0,{fill:CORE,fo:.35,stroke:CORE,sw:2,rx:8})+rect(x0+w,y0+w,x1-x0-2*w,y1-y0-2*w,{fill:C.bg,fo:1,stroke:CORE,sw:2,rx:4});
 if(txt)s+=label('鉄心',(x0+x1)/2,y0+w+30,{size:22,color:C.dim,anchor:'middle'});
 if(phi>0){const ct=y0+w/2,cb=y1-w/2;s+=fade(phi,draw([[xl,cb],[xl,ct],[xr,ct],[xr,cb],[xl,cb]],1,{color:PHI,w:3,dash:'14 10'})
  +head(xl,(ct+cb)/2-60,0,-1,{color:PHI,L:18})+head((xl+xr)/2,ct,1,0,{color:PHI,L:18})+head(xr,(ct+cb)/2+60,0,1,{color:PHI,L:18})+head((xl+xr)/2,cb,-1,0,{color:PHI,L:18})
  +label('Φ',(xl+xr)/2,y0+w+70,{size:30,color:PHI,anchor:'middle',weight:700}));}
 s+=legCoil(xl,y0+w+10,y1-w-10,5,{hl})+legCoil(xr,y0+w+60,y1-w-60,3,{hl});
 if(src){s+=draw([[xl-40,y0+w+40],[80,y0+w+40],[80,240]],1,{color:CI,w:3})+draw([[80,300],[80,y1-w-40],[xl-40,y1-w-40]],1,{color:CI,w:3});
  s+=ring(80,270,30,{color:EMF,w:3,fill:'#131f38'})+draw(Array.from({length:21},(_,i)=>[62+36*i/20,270-10*Math.sin(i/20*2*Math.PI)]),1,{color:EMF,w:3});}
 if(load){s+=draw([[xr+40,y0+w+90],[575,y0+w+90],[575,230]],1,{color:CI,w:3})+draw([[575,310],[575,y1-w-90],[xr+40,y1-w-90]],1,{color:CI,w:3});
  s+=rect(540,230,70,80,{fill:'#131f38',fo:1,stroke:C.ink,sw:2,rx:6})+(txt?label('器具',575,278,{size:22,color:C.ink,anchor:'middle'}):'');}
 if(labs){s+=LB('6600 V',80,378,24,EMF)+LB('N₁ ＝ 3300',xl,y1+34,24,CI);
  s+=LB('100 V',575,212,24,EMF)+LB('2000 W',575,342,24,WC)+LB(n2Lab,xr,y1+34,24,CI);
  s+=label('1次',xl,y0-10,{size:22,color:C.dim,anchor:'middle'})+label('2次',xr,y0-10,{size:22,color:C.dim,anchor:'middle'});}
 return fade(g,s);
}
// 電池（1巻き分 2 V）を縦に積む
function cells(x,y0,n,{g=1}={}){
 let s='';const h=34;
 for(let i=0;i<n;i++){const y=y0+i*h+12;s+=line(x-26,y-7,x+26,y-7,{color:EMF,w:4})+line(x-13,y+6,x+13,y+6,{color:EMF,w:8});}
 return fade(g,s);
}
// 電力の棒（橙）
function pbar(x,yb,hgt,lab,val,{g=1}={}){return fade(g,rect(x-45,yb-hgt,90,hgt,{fill:WC,fo:.55,stroke:WC,sw:2,rx:6})+LB(val,x,yb-hgt-14,26,WC)+LB(lab,x,yb+32,24,C.ink));}
function bars({g=1,i2=0,i1=0,line_=1}={}){
 let s=pbar(220,400,230,'1次 側','2000 W')+pbar(460,400,230,'2次 側','2000 W');
 if(line_)s+=line(150,170,530,170,{color:PHI,w:3,dash:'8 6'});
 s+=LN('電力 ＝ 電圧 × 電流',340,122,24,C.dim);
 if(i2>0)s+=fade(i2,LB('I₂ ＝ 20 A',460,480,28,CI));
 if(i1>0)s+=fade(i1,LB('I₁ ≈ 0.30 A',220,480,28,CI));
 return fade(g,s);
}

export const ytQxUeFaradayDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（8秒）：0〜2 s 前半（0.2 H のコイルと I の坂 0→3 A／0.02 s）、2〜5 s 中盤（向かい合う2つのコイル、M＝0.03 H、I₁ の坂 0→4 A／0.01 s のあと平ら）、
 //   5〜8 s 後半（鉄心と2つのコイル、6600 V・N₁＝3300・100 V・2000 W の器具）。最後は静止。
 [K+'q1']:(p)=>{
  let s=line(392,90,392,505,{color:C.faint,w:2})+line(797,90,797,505,{color:C.faint,w:2});
  const g1=seg(p,0,.06);
  s+=fade(g1,label('前半',20,92,{size:28,color:C.ink,weight:700}));
  s+=fade(g1,coilPic(70,330,190,55,7)+LB('L ＝ 0.2 H',200,280,26,C.ink));
  s+=iGraph1({x0:90,y0:478,w:250,h:140,g:seg(p,.04,.12),prog:seg(p,.1,.25)}).svg;
  const g2=seg(p,.25,.31);
  s+=fade(g2,label('中盤',405,92,{size:28,color:C.ink,weight:700}));
  s+=fade(g2,coilPic(415,580,180,48,5)+coilPic(610,775,180,48,5)+LB('コイル1',497,250,22,CI)+LB('コイル2',692,250,22,CI)+LB('M ＝ 0.03 H',595,290,26,C.ink));
  s+=i1Graph({x0:470,y0:478,w:270,h:140,g:seg(p,.3,.36),prog:seg(p,.36,.6)}).svg;
  const g3=seg(p,.62,.7);
  s+=fade(g3,label('後半',810,92,{size:28,color:C.ink,weight:700}));
  s+=fade(g3,`<g transform="translate(790 70) scale(.62)">${transformer({labs:0,txt:0})}</g>`);
  s+=fade(g3,LB('鉄心',990,205,22,C.dim)+LB('6600 V',845,330,24,EMF)+LB('N₁ ＝ 3300',935,385,24,CI)+LB('100 V',1147,200,24,EMF)+LB('2000 W',1147,292,22,WC)+LB('の 器具',1147,320,22,WC)+note('（巻数は 省略して 描いています）',1000,470));
  return s;
 },

 // ===================== 小問1 =====================
 // 1. コイルと電流のグラフ（坂）。右の枠に与えた量
 [K+'goal1']:(p)=>{
  let s=coilPic(80,520,150,60,10)+LB('L ＝ 0.2 H',300,240,26,C.ink);
  s+=iGraph1({x0:110,y0:470,w:420,h:170}).svg;
  s+=panel(90,300,LN('前半',PC,135,24)+LB('L ＝ 0.2 H の コイル',PC,195,28,C.ink)+LB('電流 0 → 3 A',PC,250,28,CI)+LB('0.02 s、一定の 割合',PC,300,28,TC)
   +fade(seg(p,.4,.5),line(PX+40,330,PX+PW-40,330,{color:C.faint,w:2})+LB('端子電圧 と エネルギー',PC,370,26,C.hi)),seg(p,.03,.15));
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 2. 「法則」V＝L dI/dt。dI/dt を黄の枠、電流のグラフの坂を黄で光らせる
 [K+'law1']:(p,ctx)=>{
  const b=atWord(ctx,'ブイ イコール',.5);
  let s=coilPic(80,520,150,60,10)+LB('L ＝ 0.2 H',300,240,26,C.ink);
  s+=iGraph1({x0:110,y0:470,w:420,h:170,hl:seg(p,b+.1,b+.2)}).svg;
  s+=panel(110,260,kindTag('法則',PC,165)+LN('端子電圧 ∝ 電流の 変化率',PC,220,24,C.ink)+fade(seg(p,b,b+.08),T(`${Vt}=L\\,{\\color{${PHI}}\\boxed{${dIdt}}}`,PC,310,48)),seg(p,.02,.12),C.F);
  s+=goalTag(G1);
  return s;
 },
 // 3. 坂に傾きの三角形。150 A/s → 0.2×150＝30 V。下に端子電圧（紫）30 V の一定の線
 [K+'volt']:(p,ctx)=>{
  const b=atWord(ctx,'たんし でんあつは',.55);
  let s=iGraph1({x0:110,y0:290,w:420,h:150,tri:seg(p,.03,.12),triLab:seg(p,.08,.16)}).svg;
  s+=vGraph1({x0:110,y0:480,w:420,h:110,g:seg(p,b,b+.06),prog:seg(p,b+.05,b+.2)}).svg;
  s+=panel(100,330,LN('変化率',PC,145,24)+T(`\\dfrac{3}{0.02}=150\\ \\mathrm{A/s}`,PC,215,38)
   +fade(seg(p,b,b+.08),line(PX+40,270,PX+PW-40,270,{color:C.faint,w:2})+LN('端子電圧',PC,312,24)+T(`0.2\\times150=${cs(EMF,'30\\ \\mathrm{V}')}`,PC,385,42)),seg(p,.02,.1));
  s+=goalTag(G1);
  return s;
 },
 // 4. 横軸 i、縦軸 Li。先に「i＝途中の電流」「di＝少しの増加」、帯を一本ずつ積み、三角形（橙）。底辺 I×高さ LI÷2
 [K+'energy']:(p,ctx)=>{
  const b=atWord(ctx,'たすと',.5),bu=atWord(ctx,'ユー イコール',.75);
  let s=liGraph({iLab:seg(p,.03,.1)*(1-seg(p,b-.04,b)),diLab:seg(p,.1,.17)*(1-seg(p,b-.04,b)),strips:seg(p,b,b+.2),tri:seg(p,b+.2,b+.28)});
  s+=panel(100,370,LN('i から di だけ 増やす 仕事',PC,145,24)+fade(seg(p,.15,.25),T(`L\\,${ic}\\,d${ic}`,PC,205,40))
   +fade(seg(p,b,b+.08),line(PX+40,250,PX+PW-40,250,{color:C.faint,w:2})+LN('足す ＝ 三角形の 面積',PC,290,24,WC)+LN('底辺 I × 高さ LI ÷ 2',PC,330,24,C.ink))
   +fade(seg(p,bu,bu+.08),T(`${Ut}=\\tfrac12 L${Ic}^2`,PC,410,46)),seg(p,.02,.1));
  s+=goalTag(G1);
  return s;
 },
 // 5. 三角形に「½×3×0.6＝0.9 J」。答えの札「小問1 の答え：A（30 V、0.9 J）」
 [K+'ans1']:(p,ctx)=>{
  const ba=atWord(ctx,'しょうもん',.6);
  let s=liGraph({tri:1,vals:1});
  s+=fade(seg(p,.05,.15),LB('½×3×0.6 ＝ 0.9 J',390,400,26,WC));
  s+=panel(100,250,T(`${Ut}=\\tfrac12\\times0.2\\times3^2`,PC,175,38)+T(`=${cs(WC,'0.9\\ \\mathrm{J}')}`,PC,265,42),seg(p,.02,.1),C.hi);
  s+=goalTag(G1)+ANS1(seg(p,ba,ba+.08));
  return s;
 },
 // 6. 三角形の上に点線の長方形（赤「1.8 J」）。誤答 B → D（1枚ずつ）
 [K+'wrongBD']:(p,ctx)=>{
  const W=wins(ctx,['ディーは']);
  let s=liGraph({tri:1,vals:1,rectG:seg(p,.03,.12)*(1-seg(p,W[1][0]-.03,W[1][0]))});
  s+=fade(seg(p,.05,.12)*(1-seg(p,W[1][0]-.03,W[1][0])),LB('長方形：1.8 J',260,190,26,BAD));
  s+=panel(90,150,LN('正しくは 三角形',PC,135,24)+T(`\\tfrac12 L${Ic}^2=0.9\\ \\mathrm{J}`,PC,195,34),1);
  s+=wrongSeq(p,ctx,[['B','30 V、1.8 J','½ を 付けず 長方形の 面積'],['D','30 V、0.3 J',['½LI（I を 2乗していない。','単位 Wb）']]],{win:W,opts:{...WOPT,y:262}});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },
 // 7. 三角形の高さ LI＝0.6 を黄で光らせ「Wb」。誤答 C
 [K+'wrongC']:(p)=>{
  let s=liGraph({tri:1,vals:1,hiH:seg(p,.03,.12)});
  s+=panel(90,150,LN('電圧 は 変化率',PC,135,24)+T(`${Vt}=L\\,${dIdt}`,PC,195,34),1);
  s+=wrongCard('C','0.6 V',['LI は 鎖交磁束（Wb）。','電圧は L dI/dt'],{...WOPT,y:262,g:seg(p,.12,.18)});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },

 // ===================== 小問2 =====================
 // 8. 2つのコイルとコイル1の電流のグラフ。右の枠に与えた量
 [K+'goal2']:(p)=>{
  let s=twoCoils({});
  s+=i1Graph({x0:110,y0:470,w:420,h:150}).svg;
  s+=panel(90,300,LN('中盤',PC,135,24)+LB('M ＝ 0.03 H',PC,195,28,C.ink)+LB('I₁：0 → 4 A（0.01 s）',PC,250,28,CI)+LB('そのあと 4 A に 保つ',PC,300,28,CI)
   +fade(seg(p,.4,.5),line(PX+40,330,PX+PW-40,330,{color:C.faint,w:2})+LB('コイル2の 起電力 は？',PC,370,26,C.hi)),seg(p,.03,.15));
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 9. コイル1の磁束（黄）がコイル2を貫く。Ψ₂＝MI₁ と ℰ₂＝−M dI₁/dt、dI₁/dt を黄の枠
 [K+'mut']:(p,ctx)=>{
  const b=atWord(ctx,'きでんりょくは',.5);
  let s=twoCoils({link:seg(p,.03,.15)});
  s+=i1Graph({x0:110,y0:470,w:420,h:150}).svg;
  s+=panel(100,330,LN('コイル2の 鎖交磁束',PC,145,24)+T(`${P2}=M${I1}`,PC,205,42)
   +fade(seg(p,b,b+.08),line(PX+40,250,PX+PW-40,250,{color:C.faint,w:2})+LN('起電力',PC,290,24)+T(`${E2}=-M\\,{\\color{${PHI}}\\boxed{${dI1}}}`,PC,375,42)),seg(p,.02,.1));
  s+=goalTag(G2);
  return s;
 },
 // 10. 坂の区間を光らせ、計算を一行ずつ。下にコイル2の起電力のグラフ（坂の区間に 12 V）
 [K+'ramp']:(p,ctx)=>{
  const b=atWord(ctx,'きでんりょくの',.55);
  let s=i1Graph({x0:110,y0:290,w:420,h:150,hlRamp:seg(p,.03,.12)}).svg;
  s+=e2Graph({x0:110,y0:480,w:420,h:110,g:seg(p,b,b+.06),ramp:seg(p,b+.05,b+.2)}).svg;
  s+=panel(100,330,LN('増やす 間',PC,145,24)+T(`${dI1}=\\dfrac{4}{0.01}=400\\ \\mathrm{A/s}`,PC,215,34)
   +fade(seg(p,b,b+.08),line(PX+40,275,PX+PW-40,275,{color:C.faint,w:2})+LN('起電力の 大きさ',PC,315,24)+T(`0.03\\times400=${cs(EMF,'12\\ \\mathrm{V}')}`,PC,385,40)),seg(p,.02,.1));
  s+=goalTag(G2);
  return s;
 },
 // 11. 平らな区間を光らせ、起電力のグラフが 0 に落ちる。答えの札
 [K+'ans2']:(p,ctx)=>{
  const ba=atWord(ctx,'しょうもん',.6);
  let s=i1Graph({x0:110,y0:290,w:420,h:150,hlFlat:seg(p,.03,.12)}).svg;
  s+=e2Graph({x0:110,y0:480,w:420,h:110,ramp:1,flat:seg(p,.1,.3)}).svg;
  s+=panel(100,250,LN('4 A に 保つ',PC,145,24)+T(`${dI1}=0`,PC,215,38)+fade(seg(p,.2,.3),T(`|${E2}|=${cs(EMF,'0')}`,PC,300,38)),seg(p,.02,.1));
  s+=goalTag(G2)+ANS2(seg(p,ba,ba+.08));
  return s;
 },
 // 12. 誤答 A
 [K+'wrongA2']:(p)=>{
  let s=i1Graph({x0:110,y0:290,w:420,h:150,hlFlat:1}).svg+e2Graph({x0:110,y0:480,w:420,h:110,ramp:1,flat:1}).svg;
  s+=panel(90,150,LB('効くのは 電流の 変化',PC,145,26,C.hi)+LN('一定 → 起電力 0',PC,195,24,C.ink),1);
  s+=wrongCard('A','12 V、12 V','効くのは 電流の 変化。一定なら 0',{...WOPT,y:262,g:seg(p,.03,.1)});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },
 // 13. Ψ₂＝0.12 Wb と ℰ₂＝12 V のカードを並べる。誤答 B → D（1枚ずつ）
 [K+'wrongBD2']:(p,ctx)=>{
  const W=wins(ctx,['しかも']);
  let s=i1Graph({x0:110,y0:290,w:420,h:150}).svg+e2Graph({x0:110,y0:480,w:420,h:110,ramp:1,flat:1}).svg;
  s+=card(PX,90,240,150,LN('鎖交磁束',PX+120,130,24)+T(`${P2}=0.12\\ \\mathrm{Wb}`,PX+120,195,28),1)+card(PX+260,90,240,150,LN('起電力',PX+380,130,24)+T(`${E2}=12\\ \\mathrm{V}`,PX+380,195,28),1);
  s+=wrongSeq(p,ctx,[['B','0.12 V、0 V','MI₁（Wb）を 起電力と した'],['D','0.12 V、0.12 V',['MI₁ を 起電力とし、','一定でも 残ると した']]],{win:W,opts:{...WOPT,y:262}});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },

 // ===================== 小問3 =====================
 // 14. 鉄心と2つのコイル、札「6600 V」「N₁＝3300」「100 V」「2000 W」
 [K+'goal3']:(p)=>{
  let s=transformer({});
  s+=note('（巻数は 省略して 描いています）',320,505);
  s+=panel(90,300,LN('後半（理想変圧器）',PC,135,24)+LB('1次：6600 V、N₁ ＝ 3300',PC,195,26,C.ink)+LB('2次：100 V',PC,250,26,EMF)+LB('100 V で 2000 W の 器具',PC,305,26,WC)
   +fade(seg(p,.4,.5),line(PX+40,335,PX+PW-40,335,{color:C.faint,w:2})+LB('2次の 巻数 と 1次の 電流',PC,372,26,C.hi)),seg(p,.03,.15));
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 15. 「前提」理想変圧器。鉄心の中を回る磁束（黄）。1巻きを電池1個に見立てる
 [K+'perturn']:(p,ctx)=>{
  const b=atWord(ctx,'ひとまき',.5);
  let s=transformer({phi:seg(p,.05,.2),hl:p>b?2:-1});
  s+=panel(90,330,kindTag('前提',PC,140,{text:'理想変圧器：同じ磁束、損失なし'})
   +fade(seg(p,b,b+.08),LN('1巻き ＝ 電池 1個',PC,215,26,EMF)+cells(PC,240,1)+LB('1巻き あたりの 電圧は 両側で 同じ',PC,330,24,C.hi)),seg(p,.02,.1));
  s+=goalTag(G3);
  return s;
 },
 // 16. 1次側に「1巻き 2 V」。2次側に電池（2 V）を積み、50 個で 100 V
 [K+'turns']:(p,ctx)=>{
  const b=atWord(ctx,'ひゃく ボルトには',.5);
  let s=transformer({phi:1,hl:2,n2Lab:p>b+.2?'N₂ ＝ 50':'N₂ ＝ ？'});
  s+=fade(seg(p,.05,.15),LB('1巻き 2 V',TR.x0+TR.w+8,335,24,EMF,{anchor:'start'}));
  s+=fade(seg(p,b,b+.06),cells(372,180,Math.min(5,Math.ceil(5*clamp((p-b)/.15))))+LB('…',372,375,26,EMF));
  s+=panel(100,330,LN('1巻き あたり',PC,145,24)+T(`\\dfrac{6600}{3300}=${cs(EMF,'2\\ \\mathrm{V}')}`,PC,215,38)
   +fade(seg(p,b,b+.08),line(PX+40,270,PX+PW-40,270,{color:C.faint,w:2})+LN('100 V に するには',PC,310,24)+T(`\\dfrac{100}{2}=${cs(CI,'50')}`,PC-30,385,40)+LB('巻き',PC+100,393,28,C.ink)),seg(p,.02,.1));
  s+=goalTag(G3);
  return s;
 },
 // 17. 両側に電力の棒（橙）同じ 2000 W。2次側に I₂＝20 A
 [K+'power']:(p,ctx)=>{
  const b=atWord(ctx,'にじがわの',.6);
  let s=bars({g:seg(p,.02,.12),i2:seg(p,b+.1,b+.2),line_:1});
  s+=panel(100,330,LN('損失 なし',PC,145,24)+T(`${V1}${I1}=${V2}${I2}`,PC,210,42)
   +fade(seg(p,b,b+.08),line(PX+40,265,PX+PW-40,265,{color:C.faint,w:2})+LN('2次側の 電流',PC,305,24)+T(`${I2}=\\dfrac{2000}{100}=${cs(CI,'20\\ \\mathrm{A}')}`,PC,380,38)),seg(p,.02,.1));
  s+=goalTag(G3);
  return s;
 },
 // 18. 1次側に I₁≈0.30 A。I₁ と I₂ を並べる。答えの札
 [K+'ans3']:(p,ctx)=>{
  const ba=atWord(ctx,'しょうもん',.6);
  let s=bars({i2:1,i1:seg(p,.1,.2)});
  s+=panel(100,250,LN('1次側の 電流',PC,140,24)+T(`${I1}=\\dfrac{2000}{6600}\\approx${cs(CI,'0.30\\ \\mathrm{A}')}`,PC,215,38)+LB('I₁ ≈ 0.30 A、I₂ ＝ 20 A',PC,305,26,CI),seg(p,.02,.1));
  s+=goalTag(G3)+ANS3(seg(p,ba,ba+.08));
  return s;
 },
 // 19. 誤答 A → C（1枚ずつ）
 [K+'wrongAC']:(p,ctx)=>{
  const W=wins(ctx,['スィーは']);
  let s=bars({i2:1,i1:1});
  s+=panel(90,150,LB('電圧 は 下がり、電流 は 増える',PC,145,24,C.ink)+LN('（電力が 同じ）',PC,195,24),1);
  s+=wrongSeq(p,ctx,[['A','50、1300 A','電流は 電圧と 逆に 変わる（電力が 同じ）'],['C','217800、0.30 A','巻数比を 逆に した']],{win:W,opts:{...WOPT,y:262}});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },
 // 20. 誤答 D
 [K+'wrongD3']:(p)=>{
  let s=bars({i2:1,i1:1});
  s+=panel(90,150,LN('電力の 保存',PC,135,24)+T(`${V1}${I1}=${V2}${I2}`,PC,195,34),1);
  s+=wrongCard('D','50、20 A','V₁I₁ ＝ V₂I₂ を 使っていない',{...WOPT,y:262,g:seg(p,.03,.1)});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },
 // 21. 自己誘導と相互誘導のカードを並べる。右上の答えの札3枚
 [K+'sum']:(p)=>{
  let s=card(90,140,480,260,LB('自己誘導',330,190,28,C.ink)+LN('自分の 電流の 変化 → 自分に',330,240,24)+T(`${Vt}=L\\,${dIdt}`,330,330,46),seg(p,.03,.15));
  s+=card(630,140,480,260,LB('相互誘導',870,190,28,C.ink)+LN('隣の 電流の 変化 → 隣に',870,240,24)+T(`${E2}=-M\\,${dI1}`,870,330,46),seg(p,.2,.32));
  s+=answerRow([[1,'A','30 V、0.9 J'],[2,'C','12 V、0 V'],[3,'B','50、0.30 A']],{g:seg(p,.5,.62),size:22});
  return s;
 },
};

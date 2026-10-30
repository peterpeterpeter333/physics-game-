// 問題編 解説「右向きの力で、道を比べる」（q-um-line-integral-entry、大学編 20 線積分と面積分・中級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/20_線積分と面積分.md の q-um-line-integral-entry（解説 21 行）。
// 色：力 𝐅 緑、沿う部分 黄、直角な部分 桃、仕事 橙、負 赤、一歩（移動）金、直線 C₀ 白、道1 青、道2 薔薇、Δ𝐫₁ 青・Δ𝐫₂ 紫、位置の矢印 灰色の点線。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 図のために決めた値：力の矢印は 1 N を 0.8 m 分の長さで描き、各段の矢印は x＝0.1 と 1.1 から出す。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,cueT,sentWin,note,textW} from './yt1-qx-common.mjs';

const K='qx-um-line-integral-entry:';
const FC=C.F,AL=C.hi,PP=C.p,WC=C.E,NG='#ff6b6b',ST=C.t,C0=C.ink,P1='#6f9dff',P2='#f06a8a',R1='#6f9dff',R2='#c49bff';
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const G1='W₂＝Σ 𝐅(𝐫ᵢ)·Δ𝐫ᵢ（2区間）',G2='道1と道2の仕事',G3='一周（道1で行き、道2で戻る）の仕事';
const ANS1=g=>answerTag(1,'B','1.0 J',{g}),ANS2=g=>answerTag(2,'D','道1 0 J、道2 2 J',{g}),ANS3=g=>answerTag(3,'C','−2 J',{g});
const PX=650,PW=530,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const FS=.8; // 1 N を 0.8 m の長さで描く

// 座標の板：原点 (ox,oy)、1 m＝sc px
const mk=(ox,oy,sc)=>({X:u=>ox+sc*u,Y:v=>oy-sc*v,ox,oy,sc});
const V=mk(80,440,220);
function board(v,{g=1,ticks=1,names=1,pts=1}={}){
 const {X,Y}=v;let s='';
 for(let k=0;k<=4;k++){const u=k*.5;s+=line(X(u),Y(0),X(u),Y(1),{color:k%2?'#16223a':'#22324f',w:k%2?1.5:2.5});}
 for(let k=0;k<=2;k++){const w=k*.5;s+=line(X(0),Y(w),X(2),Y(w),{color:k%2?'#16223a':'#22324f',w:k%2?1.5:2.5});}
 if(ticks){
  s+=label('x [m]',X(2)+40,Y(0)+8,{size:24,color:C.dim})+label('y [m]',X(0),Y(1)-46,{size:24,color:C.dim,anchor:'middle'});
  for(const u of [1,2])s+=label(String(u),X(u),Y(0)+34,{size:24,color:C.dim,anchor:'middle'});
  for(const w of [.5,1])s+=label(String(w),X(0)-14,Y(w)+8,{size:24,color:C.dim,anchor:'end'});
 }
 if(pts)s+=dot(X(0),Y(0),7,C.ink)+dot(X(2),Y(1),7,C.ink);
 if(names)s+=label('O',X(0)-18,Y(0)+30,{size:26,color:C.ink,anchor:'end',weight:700})+label('P(2, 1)',X(2)+14,Y(1)-14,{size:26,color:C.ink,weight:700});
 return fade(g,s);
}
// 力の段（y＝0, 0.5, 1）。glow＝[3] 段ごとの明るさ
function forces(v,{g=1,op=1,glow=[0,0,0],rows=[0,.5,1]}={}){
 const {X,Y,sc}=v;let s='';
 rows.forEach((w,k)=>{
  for(const x0 of [.1,1.1]){
   if(w===0)s+=dot(X(x0),Y(0),5,FC);
   else s+=arrow(X(x0),Y(w),X(x0)+w*FS*sc,Y(w),{color:FC,w:4,head:13});
  }
  if(glow[k]>0)s+=fade(glow[k],rect(X(0)-8,Y(w)-16,X(2)-X(0)+16,32,{fill:FC,fo:.12,stroke:FC,sw:2,rx:10}));
 });
 return fade(g*op,s);
}
const P=(v,a,b)=>[v.X(a),v.Y(b)];
// 道を描く（矢印つき）。kind 0＝C₀、1＝道1、2＝道2。p＝描く割合、rev＝逆向き（道2のみ）
function pathPts(kind){return kind===0?[[0,0],[2,1]]:kind===1?[[0,0],[2,0],[2,1]]:[[0,0],[0,1],[2,1]];}
function pathSvg(v,kind,{p=1,g=1,w=5,color,rev=0,arrows=1}={}){
 const col=color??[C0,P1,P2][kind];let pts=pathPts(kind).map(q=>P(v,...q));if(rev)pts=[...pts].reverse();
 let s=draw(pts,p,{color:col,w});
 if(arrows&&p>=.999)for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],mx=mix(a[0],b[0],.55),my=mix(a[1],b[1],.55),d=Math.hypot(b[0]-a[0],b[1]-a[1]);
  s+=arrow(mx-(b[0]-a[0])/d*14,my-(b[1]-a[1])/d*14,mx+(b[0]-a[0])/d*10,my+(b[1]-a[1])/d*10,{color:col,w,head:18});}
 return fade(g,s);
}
function pathNames(v,{g=1,only=null}={}){
 const {X,Y}=v;let s='';
 if(!only||only.includes(0))s+=label('直線 C₀',X(1)-40,Y(.5)-18,{size:26,color:C0,anchor:'end',weight:700});
 if(!only||only.includes(1))s+=label('道1',X(2)+16,Y(.45),{size:26,color:P1,weight:700});
 if(!only||only.includes(2))s+=label('道2',X(0)+12,Y(.78)+8,{size:26,color:P2,weight:700});
 return fade(g,s);
}
// 点が道に沿って動く（u＝0..1）
function along(v,kind,u,{rev=0}={}){
 let pts=pathPts(kind);if(rev)pts=[...pts].reverse();
 const L=[];let tot=0;for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);L.push(d);tot+=d;}
 let want=clamp(u)*tot;for(let i=1;i<pts.length;i++){if(want<=L[i-1]){const f=want/L[i-1];return [mix(pts[i-1][0],pts[i][0],f),mix(pts[i-1][1],pts[i][1],f)];}want-=L[i-1];}
 return pts[pts.length-1];
}
const glowDot=(x,y,col=C.hi)=>ring(x,y,14,{color:col,w:3})+dot(x,y,7,col);
// 1点の力（緑）と、一歩に沿う部分（黄）・直角な部分（桃）
function forceAt(v,[a,b],{g=1,comps=0,label:lab='',ldy=-14,sgnX=1}={}){
 const [x,y]=P(v,a,b),L=b*FS*v.sc;let s='';
 if(L<1)return fade(g,dot(x,y,6,FC));
 s+=arrow(x,y,x+L,y,{color:FC,w:5,head:14});
 if(comps>0){const ux=1/Math.sqrt(1.25),uy=-.5/Math.sqrt(1.25),al=L*ux;  // Δ𝐫 の向き (1, 0.5)
  const fx=x+al*ux,fy=y+al*uy;
  s+=fade(comps,arrow(x,y,fx,fy,{color:AL,w:4,head:11})+arrow(fx,fy,x+L,y,{color:PP,w:4,head:11}));}
 if(lab)s+=label(lab,x+L/2,y+ldy,{size:24,color:FC,anchor:'middle',weight:700});
 return fade(g,s);
}
// 直線 C₀ の2区間：区切り・Δ𝐫・代表点・位置の矢印
function c0parts(v,{brk=0,drs=0,reps=0,pos=0,labs=1,brkLab=1}={}){
 const {X,Y}=v;let s='';
 const m=P(v,1,.5),o=P(v,0,0),pp=P(v,2,1);
 s+=fade(drs,arrow(o[0],o[1],m[0],m[1],{color:R1,w:6,head:18})+arrow(m[0],m[1],pp[0],pp[1],{color:R2,w:6,head:18}));
 if(labs)s+=fade(drs,T(cs(R1,'\\Delta\\mathbf{r}_1'),X(.5)+34,Y(.25)+34,28)+T(cs(R2,'\\Delta\\mathbf{r}_2'),X(1.5)+34,Y(.75)+34,28));
 s+=fade(brk,dot(m[0],m[1],8,C.ink)+(brkLab?'':'')+fade(brkLab,label('(1, 0.5)',m[0]+16,m[1]+36,{size:24,color:C.ink,weight:700})));
 if(pos>0){s+=fade(pos,line(o[0],o[1],X(.5),Y(.25),{color:C.dim,w:2.5,dash:'5 6'})+line(o[0],o[1],X(1.5),Y(.75),{color:C.dim,w:2.5,dash:'5 6'}));}
 s+=fade(reps,glowDot(X(.5),Y(.25),R1)+glowDot(X(1.5),Y(.75),R2));
 return s;
}

export const ytQxUmLineIntegralEntryDiagrams={
 // ===================== 問題アニメ =====================
 // 0〜2 s 格子と右向きの力の段、2〜3 s O と P、3〜6 s 直線 C₀ → 道1 → 道2。静止。
 [K+'q1']:(p)=>{
  const v=mk(380,400,220);
  let s=board(v,{g:seg(p,0,.15),names:0,pts:0});
  s+=fade(seg(p,.33,.48),dot(v.X(0),v.Y(0),8,C.ink)+dot(v.X(2),v.Y(1),8,C.ink)+label('O',v.X(0)-18,v.Y(0)+30,{size:28,color:C.ink,anchor:'end',weight:700})+label('P(2, 1)',v.X(2)+14,v.Y(1)-16,{size:28,color:C.ink,weight:700}));
  s+=pathSvg(v,0,{p:seg(p,.5,.65)})+fade(seg(p,.6,.66),pathNames(v,{only:[0]}));
  s+=pathSvg(v,1,{p:seg(p,.66,.82)})+fade(seg(p,.78,.84),pathNames(v,{only:[1]}));
  s+=pathSvg(v,2,{p:seg(p,.83,.98)})+fade(seg(p,.95,1),pathNames(v,{only:[2]}));
  s+=forces(v,{g:seg(p,.12,.33)});
  return s;
 },

 // ===================== 小問1 =====================
 // 1. 格子と緑の矢印。「上へ行くほど」で段を下から順に光らせ、y＝0 に「力 0」。2文目で「説明用の力」と y の札
 [K+'force']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55,a=W[0][0];
  const gl=[0,1,2].map(k=>{const t=.2+k*.08;return seg(p,t,t+.05)*(1-seg(p,b-.02,b+.04));});
  let s=board(V)+forces(V,{glow:gl});
  s+=fade(seg(p,.2,.26),label('y ＝ 0 の 段：力 0',V.X(1.5),V.Y(0)+68,{size:24,color:FC,anchor:'middle',weight:700}));
  s+=panel(100,150,T(`${cs(FC,'\\mathbf{F}')}=(y,\\ 0)\\ \\mathrm{N}`,PC,155,46)+label('いつも 右向き、上ほど 強い',PC,215,{size:26,color:C.ink,anchor:'middle'}),seg(p,.02,.12),FC);
  s+=fade(seg(p,b,b+.08),card(PX,275,PW,150,label('y は m で 表した 座標の 数値',PC,320,{size:26,color:C.ink,anchor:'middle',weight:700})
   +label('（y ＝ 1 m の 所なら 右向きに 1 N）',PC,365,{size:24,color:C.dim,anchor:'middle'})+label('説明用の 力（静電場 ではない）',PC,405,{size:24,color:C.dim,anchor:'middle'}),1));
  return s;
 },
 // 2. 道1・道2 を薄く、直線 C₀ を強調
 [K+'goal1']:(p)=>{
  const d=seg(p,.1,.3);
  let s=board(V);
  s+=pathSvg(V,1,{g:mix(1,.2,d)})+pathSvg(V,2,{g:mix(1,.2,d)})+pathSvg(V,0,{w:6})+pathNames(V,{only:[0]})+forces(V,{op:mix(1,.35,d)});
  s+=fade(d,panel(100,170,label('直線 C₀ を 2区間に 分ける',PC,150,{size:28,color:C.ink,anchor:'middle',weight:700})+T(`W_2=\\sum_{i=1}^{2}${cs(FC,'\\mathbf{F}(\\mathbf{r}_i)')}\\cdot\\Delta\\mathbf{r}_i`,PC,225,36),1,C.hi));
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 3. 区切りの点 (1, 0.5)、Δ𝐫₁・Δ𝐫₂（成分 (1, 0.5)）
 [K+'split']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=board(V)+pathSvg(V,0,{w:3,g:.5,arrows:0})+forces(V,{op:.3});
  s+=c0parts(V,{brk:seg(p,.05,.15),drs:seg(p,b,b+.1)});
  s+=panel(100,200,label('区切りの 点',PX+40,150,{size:26,color:C.dim})+label('(1, 0.5)',PX+PW-40,150,{size:30,color:C.ink,anchor:'end',weight:700})
   +fade(seg(p,b,b+.1),T(`${cs(R1,'\\Delta\\mathbf{r}_1')}=${cs(R2,'\\Delta\\mathbf{r}_2')}=(1,\\ 0.5)`,PC,240,38)),1);
  s+=goalTag(G1);
  return s;
 },
 // 4. 代表点 𝐫₁・𝐫₂（区間の真ん中）。原点から灰色の点線で位置の矢印
 [K+'rep']:(p)=>{
  let s=board(V)+pathSvg(V,0,{w:3,g:.5,arrows:0})+forces(V,{op:.3});
  s+=c0parts(V,{brk:1,drs:1,reps:seg(p,.05,.2),pos:seg(p,.3,.45)});
  s+=fade(seg(p,.1,.22),label('𝐫₁',V.X(.5)-22,V.Y(.25)-14,{size:28,color:R1,anchor:'end',weight:700})+label('𝐫₂',V.X(1.5)-22,V.Y(.75)-14,{size:28,color:R2,anchor:'end',weight:700}));
  s+=panel(100,200,label('代表点（各区間の 真ん中）',PC,150,{size:26,color:C.dim,anchor:'middle'})
   +T(`${cs(R1,'\\mathbf{r}_1')}=(0.5,\\ 0.25)`,PC,210,36)+fade(seg(p,.4,.5),T(`${cs(R2,'\\mathbf{r}_2')}=(1.5,\\ 0.75)`,PC,265,36)),1);
  s+=fade(seg(p,.4,.5),note('点線 ＝ 位置の 矢印（一歩の 矢印とは 別）',PC,340));
  s+=goalTag(G1);
  return s;
 },
 // 5. 内積の式カード。図では 𝐫₁ の力を、Δ𝐫₁ に沿う部分（黄）と直角な部分（桃）に分ける
 [K+'dot']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=board(V)+pathSvg(V,0,{w:3,g:.5,arrows:0})+forces(V,{op:.25});
  s+=c0parts(V,{brk:1,drs:1,reps:1,labs:1});
  s+=forceAt(V,[.5,.25],{comps:seg(p,b,b+.12)})+forceAt(V,[1.5,.75],{});
  s+=panel(100,160,label('一歩ごとの 仕事 ＝ 内積',PC,145,{size:26,color:C.dim,anchor:'middle'})
   +T(`W_2=${cs(FC,'\\mathbf{F}(\\mathbf{r}_1)')}\\cdot${cs(R1,'\\Delta\\mathbf{r}_1')}+${cs(FC,'\\mathbf{F}(\\mathbf{r}_2)')}\\cdot${cs(R2,'\\Delta\\mathbf{r}_2')}`,PC,215,32),seg(p,.03,.12),C.hi);
  s+=fade(seg(p,b,b+.1),card(PX,285,PW,110,label('沿う 部分（黄） × 一歩の 長さ',PC,330,{size:26,color:AL,anchor:'middle',weight:700})+label('直角な 部分（桃）は 入らない',PC,372,{size:24,color:PP,anchor:'middle'}),1));
  s+=note('力の 矢印：1 N を 0.8 m 分の 長さで 描く',330,500);
  s+=goalTag(G1);
  return s;
 },
 // 6. 𝐫₁ の力 (0.25, 0)。内積 0.25×1＋0×0.5＝0.25 J
 [K+'r1']:(p)=>{
  let s=board(V)+pathSvg(V,0,{w:3,g:.5,arrows:0})+forces(V,{op:.25});
  s+=c0parts(V,{brk:1,drs:1,reps:1});
  s+=forceAt(V,[.5,.25],{label:'(0.25, 0)',ldy:-16});
  const h1=seg(p,.35,.42)*(1-seg(p,.55,.6)),h2=seg(p,.55,.6)*(1-seg(p,.72,.76));
  const a=`0.25\\times1`,b=`+0\\times0.5`,full=`${a}${b}`,w=texWidth(full,36,false),x0=PC-w/2,wa=texWidth(a,36,false);
  s+=panel(100,260,T(`${cs(FC,'\\mathbf{F}(\\mathbf{r}_1)')}=(0.25,\\ 0)\\ \\mathrm{N}`,PC,155,34)
   +fade(seg(p,.25,.35),T(`${cs(FC,'\\mathbf{F}(\\mathbf{r}_1)')}\\cdot${cs(R1,'\\Delta\\mathbf{r}_1')}=`,PC,215,30)+T(full,PC,268,36))
   +fade(h1,highlight(x0-6,240,wa+12,52,1))+fade(h2,highlight(x0+wa-4,240,w-wa+10,52,1))
   +fade(seg(p,.76,.86),T(`=${cs(WC,'0.25\\ \\mathrm{J}')}`,PC,328,40)),1);
  s+=goalTag(G1);
  return s;
 },
 // 7. 𝐫₂ の力 (0.75, 0) → 0.75 J。W₂＝1.0 J。答えの札 B
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,f=(W[1]?W[1][1]:1);
  let s=board(V)+pathSvg(V,0,{w:3,g:.5,arrows:0})+forces(V,{op:.25});
  s+=c0parts(V,{brk:1,drs:1,reps:1});
  s+=forceAt(V,[.5,.25],{label:'0.25 J',ldy:-16})+forceAt(V,[1.5,.75],{g:seg(p,.03,.12),label:'(0.75, 0)',ldy:-16});
  s+=panel(100,250,T(`${cs(FC,'\\mathbf{F}(\\mathbf{r}_2)')}\\cdot${cs(R2,'\\Delta\\mathbf{r}_2')}=0.75\\times1+0\\times0.5=${cs(WC,'0.75\\ \\mathrm{J}')}`,PC,160,28)
   +fade(seg(p,b,b+.1),line(PX+40,205,PX+PW-40,205,{color:C.faint,w:2})+T(`W_2=0.25+0.75=${cs(WC,'1.0\\ \\mathrm{J}')}`,PC,270,40)),seg(p,.05,.15),WC);
  s+=goalTag(G1)+ANS1(seg(p,b+(f-b)*.55,b+(f-b)*.55+.06));
  return s;
 },
 // 8. 誤答 A（始めの点で読む）→ C（終わりの点で読む）。灰色の点と灰色の力
 [K+'wrongAC']:(p,ctx)=>{
  const ve=sentWin(ctx)[0][1],wA=[0,ve*.5],wC=[ve*.5,1];
  const inA=seg(p,.02,.06)*(1-seg(p,wA[1]-.04,wA[1])),inC=seg(p,wC[0]+.01,wC[0]+.05);
  let s=board(V)+pathSvg(V,0,{w:3,g:.5,arrows:0})+forces(V,{op:.2});
  s+=c0parts(V,{brk:1,drs:1,reps:.35,labs:0,brkLab:0});
  const gray=(a,b2,lab)=>{const [x,y]=P(V,a,b2),L=b2*FS*V.sc;return ring(x,y,11,{color:C.dim,w:3})+(L>1?arrow(x,y,x+L,y,{color:C.dim,w:5,head:14}):'')+label(lab,x+(L>1?L/2:0),y+38,{size:24,color:C.dim,anchor:'middle',weight:700});};
  s+=fade(inA,gray(0,0,'0')+gray(1,.5,'(0.5, 0)'));
  s+=fade(inC,gray(1,.5,'(0.5, 0)')+gray(2,1,'(1, 0)'));
  s+=fade(inA,label('始めの 点で 読む',V.X(1),V.Y(0)+70,{size:24,color:C.dim,anchor:'middle',weight:700}))+fade(inC,label('終わりの 点で 読む',V.X(1),V.Y(0)+70,{size:24,color:C.dim,anchor:'middle',weight:700}));
  s+=panel(100,90,T(`W_2=0.25+0.75=${cs(WC,'1.0\\ \\mathrm{J}')}`,PC,150,34),1);
  s+=wrongSeq(p,ctx,[['A','0.50 J','始めの 点で 力を 読んだ',{mid:'0+0.5=0.5'}],['C','1.5 J','終わりの 点で 読んだ',{mid:'0.5+1=1.5'}]],{win:[wA,wC],opts:{...WOPT,y:215}});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },
 // 9. 誤答 D（大きさ×長さ）。直角な部分（桃）に赤い ×
 [K+'wrongD']:(p,ctx)=>{
  let s=board(V)+pathSvg(V,0,{w:3,g:.5,arrows:0})+forces(V,{op:.2});
  s+=c0parts(V,{brk:1,drs:1,reps:1,labs:0});
  s+=forceAt(V,[.5,.25],{comps:1})+forceAt(V,[1.5,.75],{comps:1});
  const ux=1/Math.sqrt(1.25),uy=-.5/Math.sqrt(1.25);
  const cross=(a,b2)=>{const [x,y]=P(V,a,b2),L=b2*FS*V.sc,al=L*ux,mx=(x+al*ux+x+L)/2,my=(y+al*uy+y)/2;return line(mx-12,my-12,mx+12,my+12,{color:NG,w:5})+line(mx-12,my+12,mx+12,my-12,{color:NG,w:5});};
  s+=fade(seg(p,.15,.25),cross(.5,.25)+cross(1.5,.75));
  s+=panel(100,90,T(`W_2=0.25+0.75=${cs(WC,'1.0\\ \\mathrm{J}')}`,PC,150,34),1);
  s+=wrongCard('D','1.1 J',['内積でなく 大きさ × 長さ','（直角な 部分まで 数えた）'],{...WOPT,y:215,mid:'(0.25+0.75)\\times\\sqrt{1.25}\\approx1.1',g:seg(p,.03,.1)});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },

 // ===================== 小問2 =====================
 // 10. 道1（青）と道2（薔薇）を元の明るさに
 [K+'goal2']:(p)=>{
  let s=board(V)+pathSvg(V,1,{p:seg(p,.1,.4)})+pathSvg(V,2,{p:seg(p,.3,.6)})+fade(seg(p,.5,.65),pathNames(V,{only:[1,2]}))+forces(V);
  s+=panel(100,170,label('両端は 同じ O → P',PC,155,{size:28,color:C.ink,anchor:'middle',weight:700})+label('道1 と 道2 で 力が する 仕事は？',PC,215,{size:26,color:C.hi,anchor:'middle'}),seg(p,.1,.25),C.hi);
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 11. 道1の前半 O→(2, 0)。足もとに緑の矢印がない。「0 J」
 [K+'p1a']:(p)=>{
  const u=seg(p,.1,.7)*(2/3);
  let s=board(V)+pathSvg(V,1,{w:3,g:.5,arrows:0})+pathSvg(V,2,{g:.2,arrows:0})+forces(V);
  const [a,b]=along(V,1,u);s+=glowDot(...P(V,a,b));
  s+=fade(seg(p,.2,.3),rect(V.X(0)-6,V.Y(0)-16,V.X(2)-V.X(0)+12,32,{fill:FC,fo:.08,stroke:FC,sw:2,rx:10})+label('y ＝ 0：力 0',V.X(1),V.Y(0)+70,{size:24,color:FC,anchor:'middle',weight:700}));
  s+=panel(100,150,label('道1 の 前半（右へ 2 m）',PC,150,{size:26,color:P1,anchor:'middle',weight:700})+fade(seg(p,.7,.8),T(`${cs(WC,'0\\ \\mathrm{J}')}`,PC,210,40)),1,P1);
  s+=goalTag(G2);
  return s;
 },
 // 12. 道1の後半 (2, 0)→P。右向きの力（緑）と上向きの一歩（金）に直角の印。「合計 0 J」
 [K+'p1b']:(p)=>{
  const u=2/3+seg(p,.05,.5)/3;
  let s=board(V)+pathSvg(V,1,{w:3,g:.5,arrows:0})+pathSvg(V,2,{g:.2,arrows:0})+forces(V,{op:.5});
  const [a,b]=along(V,1,u),[x,y]=P(V,a,b);
  if(b>.04){const L=b*FS*V.sc;s+=arrow(x-L,y,x,y,{color:FC,w:5,head:14});}
  s+=arrow(x,y,x,y-60,{color:ST,w:5,head:14})+draw([[x+16,y],[x+16,y-16],[x,y-16]],1,{color:C.ink,w:2.5});
  s+=glowDot(x,y);
  s+=fade(seg(p,.1,.2),label('一歩',x-14,y-40,{size:24,color:ST,anchor:'end',weight:700}));
  s+=panel(100,200,label('道1 の 後半（上へ 1 m）',PC,150,{size:26,color:P1,anchor:'middle',weight:700})+label('力 ⟂ 一歩 → 0',PC,205,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.6,.7),label('道1 の 合計',PX+60,270,{size:28,color:P1,weight:700})+T(cs(WC,'0\\ \\mathrm{J}'),PX+PW-90,262,40)),1,P1);
  s+=fade(seg(p,.6,.7),label('合計 0 J',V.X(2)+20,V.Y(.5)+40,{size:26,color:WC,weight:700}));
  s+=goalTag(G2);
  return s;
 },
 // 13. 道2の前半 O→(0, 1)。直角の印、「0 J」
 [K+'p2a']:(p)=>{
  const u=seg(p,.05,.55)/3;
  let s=board(V)+pathSvg(V,2,{w:3,g:.5,arrows:0})+pathSvg(V,1,{g:.2,arrows:0})+label('合計 0 J',V.X(2)+20,V.Y(.5)+40,{size:26,color:WC,weight:700})+forces(V,{op:.5});
  const [a,b]=along(V,2,u),[x,y]=P(V,a,b);
  if(b>.04){const L=b*FS*V.sc;s+=arrow(x,y,x+L,y,{color:FC,w:5,head:14});}
  s+=arrow(x,y,x,y-60,{color:ST,w:5,head:14})+draw([[x+16,y],[x+16,y-16],[x,y-16]],1,{color:C.ink,w:2.5})+glowDot(x,y,C.hi);
  s+=panel(100,150,label('道2 の 前半（上へ 1 m）',PC,150,{size:26,color:P2,anchor:'middle',weight:700})+fade(seg(p,.55,.65),label('力 ⟂ 一歩 → 0 J',PC,210,{size:28,color:C.ink,anchor:'middle'})),1,P2);
  s+=goalTag(G2);
  return s;
 },
 // 14. 道2の後半 (0, 1)→P。黄の沿う部分が全長に付く。1×2＝2 J、「合計 2 J」
 [K+'p2b']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,u=1/3+seg(p,.05,.45)*2/3;
  let s=board(V)+pathSvg(V,2,{w:3,g:.5,arrows:0})+pathSvg(V,1,{g:.2,arrows:0})+label('合計 0 J',V.X(2)+20,V.Y(.5)+40,{size:26,color:WC,weight:700})+forces(V,{op:.6,glow:[0,0,1]});
  const [a,bb]=along(V,2,u),[x,y]=P(V,a,bb);
  s+=line(V.X(0),V.Y(1),x,y,{color:AL,w:12,opacity:.45,cap:'butt'});
  s+=label('1 N',V.X(.5),V.Y(1)+40,{size:24,color:FC,anchor:'middle',weight:700});
  s+=glowDot(x,y);
  s+=panel(100,220,label('道2 の 後半（右へ 2 m）',PC,150,{size:26,color:P2,anchor:'middle',weight:700})+label('力が 一歩に 沿う',PC,200,{size:26,color:AL,anchor:'middle'})
   +fade(seg(p,b,b+.1),T(`1\\ \\mathrm{N}\\times2\\ \\mathrm{m}=${cs(WC,'2\\ \\mathrm{J}')}`,PC,265,38)),1,P2);
  s+=fade(seg(p,b+.15,b+.25),label('合計 2 J',V.X(1),V.Y(1)-26,{size:26,color:WC,anchor:'middle',weight:700}));
  s+=goalTag(G2);
  return s;
 },
 // 15. 道1「0 J」と道2「2 J」を並べ、両端の O・P を黄で囲む。答えの札 D
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=board(V)+pathSvg(V,1)+pathSvg(V,2)+pathNames(V,{only:[1,2]})+forces(V,{op:.4});
  s+=label('合計 0 J',V.X(2)+20,V.Y(.5)+40,{size:26,color:WC,weight:700})+label('合計 2 J',V.X(1),V.Y(1)-26,{size:26,color:WC,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.15),ring(V.X(0),V.Y(0),20,{color:C.hi,w:4})+ring(V.X(2),V.Y(1),20,{color:C.hi,w:4}));
  s+=panel(110,200,label('両端は 同じ',PC,160,{size:26,color:C.hi,anchor:'middle',weight:700})
   +label('道1',PX+90,230,{size:30,color:P1,weight:700})+label('0 J',PX+220,230,{size:34,color:WC,weight:700})
   +label('道2',PX+320,230,{size:30,color:P2,weight:700})+label('2 J',PX+430,230,{size:34,color:WC,weight:700}),1);
  s+=goalTag(G2)+ANS2(seg(p,b+.05,b+.12));
  return s;
 },
 // 16a. 誤答 A → C（1文を声の長さで半分ずつ）
 [K+'wrong2']:(p,ctx)=>{
  let s=board(V)+pathSvg(V,1)+pathSvg(V,2)+pathNames(V,{only:[1,2]})+forces(V);
  s+=label('合計 0 J',V.X(2)+20,V.Y(.5)+40,{size:26,color:WC,weight:700})+label('合計 2 J',V.X(1),V.Y(1)-26,{size:26,color:WC,anchor:'middle',weight:700});
  s+=panel(100,90,label('道1 0 J、道2 2 J',PC,158,{size:30,color:WC,anchor:'middle',weight:700}),1);
  s+=wrongSeq(p,ctx,[['A','2 J・2 J','両端が 同じなら 同じ と 考えた'],['C','3 J・3 J','1 N × 道の 長さ 3 m',{mid:'1\\times3=3'}]],{opts:{...WOPT,y:215}});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },
 // 16b. 誤答 B。灰色の上向きの矢印（力 (0, x) と読んだ場合）を一瞬重ねて消す
 [K+'wrong2b']:(p,ctx)=>{
  const inB=seg(p,.08,.18)*(1-seg(p,.8,.9));
  let s=board(V)+pathSvg(V,1)+pathSvg(V,2)+pathNames(V,{only:[1,2]})+forces(V,{op:1-.7*inB});
  s+=label('合計 0 J',V.X(2)+20,V.Y(.5)+40,{size:26,color:WC,weight:700})+label('合計 2 J',V.X(1),V.Y(1)-26,{size:26,color:WC,anchor:'middle',weight:700});
  let up='';for(const x of [.5,1,1.5,2])for(const yy of [.1,.6])up+=arrow(V.X(x),V.Y(yy),V.X(x),V.Y(yy)-x*FS*V.sc*.45,{color:C.dim,w:3,head:11});
  s+=fade(inB*.9,up+label('(0, x) と 読むと…',V.X(1),V.Y(0)+68,{size:24,color:C.dim,anchor:'middle',weight:700}));
  s+=panel(100,90,label('道1 0 J、道2 2 J',PC,158,{size:30,color:WC,anchor:'middle',weight:700}),1);
  s+=wrongCard('B','2 J・0 J',['力を (0, x)（上向きで','右ほど 強い）と 読み違えた'],{...WOPT,y:215,g:seg(p,.03,.1)});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },

 // ===================== 小問3 =====================
 // 17. 一周：道1は O→P、道2は P→O 向きに描き直す
 [K+'goal3']:(p)=>{
  const r=seg(p,.2,.45);
  let s=board(V)+pathSvg(V,1)+fade(1-r,pathSvg(V,2))+fade(r,pathSvg(V,2,{rev:1}))+pathNames(V,{only:[1,2]})+forces(V,{op:.6});
  s+=fade(seg(p,.4,.55),label('行き：道1',V.X(2)+20,V.Y(.2),{size:24,color:P1,weight:700})+label('戻り：道2 を 逆に',V.X(1),V.Y(1)-26,{size:24,color:P2,anchor:'middle',weight:700}));
  s+=panel(100,170,label('一周の 仕事',PC,155,{size:28,color:C.ink,anchor:'middle',weight:700})+label('O → P（道1） → O（道2 を 逆に）',PC,215,{size:24,color:C.dim,anchor:'middle'}),seg(p,.05,.15),C.hi);
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 18. 道2の一歩（金）が一斉に反転。力（緑）は動かさない。「2 J」→「−2 J」
 [K+'rev']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,fl=seg(p,.2,.4);
  let s=board(V)+pathSvg(V,1,{g:.4})+pathSvg(V,2,{rev:1,w:3,g:.6,arrows:0})+forces(V,{op:.35,rows:[0,.5]});
  for(const x of [.25,.75,1.25,1.75]){const [px,py]=P(V,x,1);const d=mix(1,-1,fl)*55;
   s+=arrow(px,py,px+FS*V.sc*.55,py,{color:FC,w:4,head:12,opacity:.95});
   if(Math.abs(d)>3)s+=arrow(px,py+26,px+d,py+26,{color:ST,w:5,head:14});}
  s+=label('力（緑）は そのまま',V.X(1),V.Y(1)-28,{size:24,color:FC,anchor:'middle',weight:700})+fade(seg(p,.2,.3),label('一歩（金）が 逆向き',V.X(1),V.Y(1)+80,{size:24,color:ST,anchor:'middle',weight:700}));
  const sw=seg(p,b+.1,b+.2);
  s+=panel(100,200,label('道2 の 後半の 各項',PC,150,{size:26,color:C.dim,anchor:'middle'})
   +T(`${cs(FC,'\\mathbf{F}')}\\cdot(-\\Delta\\mathbf{r})=-${cs(FC,'\\mathbf{F}')}\\cdot\\Delta\\mathbf{r}`,PC,210,34)
   +fade(1-sw,T(cs(WC,'2\\ \\mathrm{J}'),PC,275,42))+fade(sw,T(cs(NG,'-2\\ \\mathrm{J}'),PC,275,42)),1);
  s+=goalTag(G3);
  return s;
 },
 // 19. 光が閉じた道を一周。0＋(−2)＝−2 J。答えの札 C
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55,u=seg(p,.02,.5);
  let s=board(V)+pathSvg(V,1)+pathSvg(V,2,{rev:1})+forces(V,{op:.5});
  const loop=u<.5?along(V,1,u*2):along(V,2,(u-.5)*2,{rev:1});
  if(u>0&&u<1)s+=glowDot(...P(V,...loop));
  s+=label('0 J',V.X(2)+20,V.Y(.5)+40,{size:26,color:WC,weight:700})+label('−2 J',V.X(1),V.Y(1)-26,{size:26,color:NG,anchor:'middle',weight:700});
  s+=panel(110,150,label('一周の 仕事',PC,160,{size:26,color:C.dim,anchor:'middle'})+fade(seg(p,.3,.45),T(`0+(-2)=${cs(NG,'-2\\ \\mathrm{J}')}`,PC,225,42)),1,NG);
  s+=goalTag(G3)+ANS3(seg(p,b+.05,b+.12));
  return s;
 },
 // 20a. 誤答 A → B
 [K+'wrong3']:(p,ctx)=>{
  let s=board(V)+pathSvg(V,1)+pathSvg(V,2,{rev:1})+forces(V,{op:.5});
  s+=label('0 J',V.X(2)+20,V.Y(.5)+40,{size:26,color:WC,weight:700})+label('−2 J',V.X(1),V.Y(1)-26,{size:26,color:NG,anchor:'middle',weight:700});
  s+=panel(100,90,T(`0+(-2)=${cs(NG,'-2\\ \\mathrm{J}')}`,PC,150,36),1);
  s+=wrongSeq(p,ctx,[['A','0 J','一周なら 必ず 0 と 考えた'],['B','+2 J','逆に しても 符号 そのまま',{mid:'0+2=+2'}]],{opts:{...WOPT,y:215}});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },
 // 20b. 誤答 D。直線 C₀ を灰色の点線で一瞬重ねる
 [K+'wrong3b']:(p,ctx)=>{
  const inD=seg(p,.08,.18)*(1-seg(p,.8,.9));
  let s=board(V)+pathSvg(V,1)+pathSvg(V,2,{rev:1,g:1-.6*inD})+forces(V,{op:.5});
  s+=fade(inD,draw([P(V,2,1),P(V,0,0)],1,{color:C.dim,w:4,dash:'10 8'})+label('C₀ を 逆に（−1 J）',V.X(.95),V.Y(.45)+44,{size:24,color:C.dim,anchor:'end',weight:700}));
  s+=label('0 J',V.X(2)+20,V.Y(.5)+40,{size:26,color:WC,weight:700})+label('−2 J',V.X(1),V.Y(1)-26,{size:26,color:NG,anchor:'middle',weight:700});
  s+=panel(100,90,T(`0+(-2)=${cs(NG,'-2\\ \\mathrm{J}')}`,PC,150,36),1);
  s+=wrongCard('D','−1 J','戻りを C₀ の 逆で 置き換えた',{...WOPT,y:215,mid:'0+(-1)=-1',g:seg(p,.03,.1)});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },

 // ===================== まとめ =====================
 // 21. Σ の式と ∫_C 𝐅·d𝐫 を上下に並べ、C を黄で囲む。答えの札を並べる
 [K+'sum']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=card(250,92,700,378,'',seg(p,.02,.1));
  s+=fade(seg(p,.05,.15),label('区間に 分けて 内積を 足す',600,135,{size:26,color:C.dim,anchor:'middle'})+T(`\\textstyle\\sum_{i}${cs(FC,'\\mathbf{F}(\\mathbf{r}_i)')}\\cdot\\Delta\\mathbf{r}_i`,600,190,44));
  s+=fade(seg(p,.18,.28),label('↓ 区間の 幅を 0 に 近づけた とき、和が 近づく 値',600,250,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.25,.35)*(1-seg(p,b,b+.08)),T(`\\int_{C}${cs(FC,'\\mathbf{F}')}\\cdot d\\mathbf{r}`,600,345,52));
  s+=fade(seg(p,b,b+.08),T(`\\int_{${cs(C.hi,'\\boxed{C}')}}${cs(FC,'\\mathbf{F}')}\\cdot d\\mathbf{r}`,600,345,52)+label('道と 進む 向き（C）が 値を 決める',600,445,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=answerRow([[1,'B','1.0 J'],[2,'D','0 J、2 J'],[3,'C','−2 J']],{g:seg(p,.85,.93)});
  return s;
 },
};

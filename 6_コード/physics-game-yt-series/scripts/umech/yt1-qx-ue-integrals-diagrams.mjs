// 問題編 解説「目盛りで線積分、電位で確かめ、面で束を数える」（q-ue-integrals、大学編 20 線積分と面積分・上級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/20_線積分と面積分.md の q-ue-integrals（解説 22 行）。
// 色：電場 𝐄 水色、道（放物線）黄、接線 𝐫′ 黄、電位 V 紫、電子 青、法線 桃、x 向きの一歩 黄・y 向きの一歩 紫、面 薄い金、電気束・仕事 橙、負 赤。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 図のために決めた値：格子の電場の矢印は 1 V/m を 0.15 m、u＝0.5 の点の矢印は 1 V/m を 0.4 m、接線は 𝐫′ の 0.3 倍、
//   面の上の電場の矢印は 1 V/m を 0.18 m（z 方向）で描く。3次元は斜めから見た図。帯は 5 本。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,poly} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,cueT,sentWin,note,textW} from './yt1-qx-common.mjs';

const K='qx-ue-integrals:';
const EC=C.x,PATH=C.hi,VC=C.v,EL='#6f9dff',NC=C.p,WC=C.E,NG='#ff6b6b',GOLD='#d8b25a',UX=C.hi,VX='#c49bff';
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const G1='道 C に沿った ∫𝐄·d𝐫',G2='電子の ΔU（P→Q）',G3='電気束 Φ（上向き）';
const ANS1=g=>answerTag(1,'D','2 V',{g}),ANS2=g=>answerTag(2,'B','+e×2 V',{g}),ANS3=g=>answerTag(3,'A','4 V·m',{g});
const PX=440,PW=740,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const PX3=560,PW3=620,PC3=PX3+PW3/2;
const panel3=(y,h,inner,g=1,stroke=C.faint)=>card(PX3,y,PW3,h,inner,g,stroke);
const WOPT={x:PX+40,w:PW-80,size:26,whySize:22};

// ---- 平面（左）----
const mk=(ox,oy,sc)=>({X:u=>ox+sc*u,Y:v=>oy-sc*v,ox,oy,sc});
const V2=mk(130,470,165);
const r=u=>[u,2*u*u];
function plane(v,{g=1,ticks=1,field=1,fop=1}={}){
 const {X,Y,sc}=v;let s='';
 for(let k=0;k<=6;k++){const u=k*.2;s+=line(X(u),Y(0),X(u),Y(2.2),{color:'#1a2742',w:1.5});}
 for(let k=0;k<=11;k++){const w=k*.2;s+=line(X(0),Y(w),X(1.2),Y(w),{color:'#1a2742',w:1.5});}
 s+=arrow(X(0),Y(0),X(1.32),Y(0),{color:C.dim,w:2.5,head:12})+arrow(X(0),Y(0),X(0),Y(2.32),{color:C.dim,w:2.5,head:12});
 if(ticks){s+=label('x',X(1.32)+8,Y(0)+8,{size:24,color:C.dim})+label('y',X(0)-8,Y(2.32)-8,{size:24,color:C.dim,anchor:'end'});
  for(const u of [.5,1])s+=line(X(u),Y(0)-5,X(u),Y(0)+5,{color:C.dim})+label(String(u),X(u),Y(0)+30,{size:22,color:C.dim,anchor:'middle'});
  for(const w of [1,2])s+=line(X(0)-5,Y(w),X(0)+5,Y(w),{color:C.dim})+label(String(w),X(0)-12,Y(w)+8,{size:22,color:C.dim,anchor:'end'});}
 if(field){let f='';for(const x of [0,.4,.8,1.2])for(let k=0;k<=5;k++){const y=k*.4,ex=y,ey=x;
   if(ex*ex+ey*ey<1e-6){f+=dot(X(x),Y(y),3,EC);continue;}
   f+=arrow(X(x),Y(y),X(x)+.15*sc*ex,Y(y)-.15*sc*ey,{color:EC,w:2.5,head:9});}
  s+=fade(fop,f);}
 return fade(g,s);
}
function parab(v,{p=1,w=5,glow=0,g=1}={}){
 const pts=Array.from({length:61},(_,i)=>{const [x,y]=r(i/60);return [v.X(x),v.Y(y)];});
 return fade(g,(glow>0?fade(glow,draw(pts,p,{color:PATH,w:14,opacity:.35})):'')+draw(pts,p,{color:PATH,w}));
}
function electron(x,y,{g=1,lab=1}={}){return fade(g,ring(x,y,12,{color:EL,w:3,fill:'#13234a'})+label('−',x,y+8,{size:22,color:EL,anchor:'middle',weight:700})+(lab?label('電子 −e',x-16,y-22,{size:22,color:EL,anchor:'end',weight:700}):''));}
function pq(v,{g=1}={}){const {X,Y}=v;return fade(g,dot(X(0),Y(0),6,C.ink)+dot(X(1),Y(2),7,C.ink)+label('P',X(0)-14,Y(0)+28,{size:26,color:C.ink,anchor:'end',weight:700})+label('Q(1, 2)',X(1)+14,Y(2)+4,{size:26,color:C.ink,weight:700}));}
function uTicks(v,{g=[1,1,1],vals=0}={}){
 const {X,Y}=v;let s='';[0,.5,1].forEach((u,i)=>{const [x,y]=r(u);
  s+=fade(g[i],ring(X(x),Y(y),9,{color:PATH,w:3,fill:C.bg})+label(`u＝${u}`,X(x)+16,Y(y)+(i===2?28:-10),{size:22,color:PATH,weight:700})
   +(vals?fade(vals,label(['(0, 0)','(0.5, 0.5)','(1, 2)'][i],X(x)+16,Y(y)+(i===2?56:20),{size:22,color:C.ink,weight:700})):''));});
 return s;
}
// u の点での接線（黄）と電場（水色）
const tanAt=(v,u,{g=1,k=.3,lab=''}={})=>{const [x,y]=r(u),dx=1*k,dy=4*u*k;return fade(g,arrow(v.X(x),v.Y(y),v.X(x+dx),v.Y(y+dy),{color:UX,w:5,head:15})+(lab?label(lab,v.X(x+dx)+10,v.Y(y+dy)+6,{size:24,color:UX,weight:700}):''));};
const eAt=(v,u,{g=1,k=.4,lab=''}={})=>{const [x,y]=r(u),ex=y,ey=x;return fade(g,arrow(v.X(x),v.Y(y),v.X(x+k*ex),v.Y(y+k*ey),{color:EC,w:5,head:15})+(lab?label(lab,v.X(x+k*ex)+10,v.Y(y+k*ey)+22,{size:24,color:EC,weight:700}):''));};
// 等電位線 V＝−αxy＝c（紫）
function equip(v,{g=1}={}){
 const {X,Y}=v;let s='';
 for(const c of [.25,.5,1,1.5,2]){const pts=[];for(let i=0;i<=60;i++){const x=c/2.2+(1.2-c/2.2)*i/60,y=c/x;if(y<=2.2)pts.push([X(x),Y(y)]);}
  s+=draw(pts,1,{color:VC,w:2.5,opacity:.85});
  const xe=1.2,ye=c/xe;if(ye<=2.2)s+=label(`${-c}`,X(xe)+8,Y(ye)+8,{size:22,color:VC,weight:700});}
 return fade(g,s);
}
// ---- 3次元（斜めから見た図）----
const P3=(o)=>([x,y,z])=>[o.ox+o.ax*x+o.by*y,o.oy+o.ay*x-o.bz*y-o.cz*z];
const O3V={ox:60,oy:430,ax:170,ay:26,by:95,bz:70,cz:170};
function box3(o,{g=1,grid=0,strips=0,stripH=[0,0,0,0,0],normal=1,nFlip=0,steps=0,fieldUp=0,glowStrip=-1,axes=1,stack=0}={}){
 const S=P3(o);let s='';
 if(axes){s+=arrow(...S([0,0,0]),...S([2.45,0,0]),{color:C.dim,w:2.5,head:12})+arrow(...S([0,0,0]),...S([0,1.4,0]),{color:C.dim,w:2.5,head:12})+arrow(...S([0,0,0]),...S([0,0,1.25]),{color:C.dim,w:2.5,head:12});
  const lx=S([2.45,0,0]),ly=S([0,1.4,0]),lz=S([0,0,1.25]);
  s+=label('x',lx[0]+6,lx[1]+22,{size:24,color:C.dim})+label('y',ly[0]+8,ly[1]+4,{size:24,color:C.dim})+label('z',lz[0]-10,lz[1]-6,{size:24,color:C.dim,anchor:'end'});
  s+=label('2',S([2,0,0])[0],S([2,0,0])[1]+30,{size:22,color:C.dim,anchor:'middle'})+label('1',S([0,1,0])[0]-12,S([0,1,0])[1]+4,{size:22,color:C.dim,anchor:'end'});}
 const cor=[[0,0,0],[2,0,0],[2,1,0],[0,1,0]].map(S);
 s+=poly(cor,{fill:GOLD,fo:.22,stroke:GOLD,sw:2.5});
 if(grid>0){let gl='';for(let k=1;k<4;k++){const a=S([k*.5,0,0]),b=S([k*.5,1,0]);gl+=line(a[0],a[1],b[0],b[1],{color:UX,w:1.5,opacity:.6});}
  for(let k=1;k<4;k++){const a=S([0,k*.25,0]),b=S([2,k*.25,0]);gl+=line(a[0],a[1],b[0],b[1],{color:VX,w:1.5,opacity:.6});}
  s+=fade(grid,gl);}
 if(strips>0){let st='';for(let k=0;k<5;k++){const y0=k*.2,y1=y0+.2,q=[[0,y0,0],[2,y0,0],[2,y1,0],[0,y1,0]].map(S);
   st+=poly(q,{fill:k===glowStrip?WC:GOLD,fo:k===glowStrip?.45:.12,stroke:GOLD,sw:1.2});}
  s+=fade(strips,st);}
 if(fieldUp>0){let f='';for(let k=0;k<5;k++){const y=k*.2+.1,h=4*y*.18*stripH[k];for(const x of [.35,1,1.65]){const a=S([x,y,0]),b=S([x,y,h]);if(h>.01)f+=arrow(a[0],a[1],b[0],b[1],{color:EC,w:3,head:10});}}
  s+=fade(fieldUp,f);}
 if(stack>0){// 帯を手前から積み重ねる（右の小さな柱）
 }
 if(steps>0){const c=S([1,.5,0]),ax=S([1.5,.5,0]),ay=S([1,.85,0]);
  s+=fade(steps,arrow(c[0],c[1],ax[0],ax[1],{color:UX,w:5,head:14})+arrow(c[0],c[1],ay[0],ay[1],{color:VX,w:5,head:14}));}
 if(normal>0){const c=S([1,.5,0]),n=S([1,.5,mix(.8,-.8,nFlip)]);s+=fade(normal,arrow(c[0],c[1],n[0],n[1],{color:NC,w:6,head:16})+label('𝐧',n[0]+12,n[1]+(nFlip>.5?20:8),{size:28,color:NC,weight:700}));}
 return fade(g,s);
}

export const ytQxUeIntegralsDiagrams={
 // ===================== 問題アニメ =====================
 // 0〜2 s 左に格子と電場（水色）、2〜4 s 放物線（黄）P→Q、目盛り u＝0, 0.5, 1、電子（青）と P→Q の向きの灰色の矢印、
 // 4〜7 s 右に3次元の座標軸と長方形（薄い金）、真ん中から上向きの法線（桃）。静止。積分の値・電位・等電位線・面の上の電場は出さない。
 [K+'q1']:(p)=>{
  const v=mk(150,480,185);
  let s=plane(v,{g:seg(p,0,.12),fop:seg(p,.06,.28)});
  s+=parab(v,{p:seg(p,.3,.5)})+fade(seg(p,.32,.45),pq(v));
  s+=uTicks(v,{g:[seg(p,.45,.5),seg(p,.48,.53),seg(p,.51,.56)]});
  s+=electron(v.X(0),v.Y(0),{g:seg(p,.5,.56)});
  const pts=Array.from({length:21},(_,i)=>{const u=.3+.35*i/20,[x,y]=r(u);return [v.X(x)-40,v.Y(y)+16];});
  s+=fade(seg(p,.52,.58),draw(pts.slice(0,19),1,{color:C.dim,w:3})+arrow(pts[18][0],pts[18][1],pts[20][0],pts[20][1],{color:C.dim,w:3,head:12})+label('P → Q',pts[10][0]-14,pts[10][1],{size:22,color:C.dim,anchor:'end',weight:700}));
  s+=box3({ox:640,oy:420,ax:150,ay:22,by:95,bz:66,cz:150},{g:seg(p,.6,.78),normal:seg(p,.82,.95)});
  return s;
 },

 // ===================== 小問1 =====================
 [K+'intro']:(p)=>{
  let s=plane(V2)+parab(V2,{p:seg(p,.05,.35)})+pq(V2,{g:seg(p,.1,.2)})+electron(V2.X(0),V2.Y(0),{g:seg(p,.15,.25)})+uTicks(V2,{g:[seg(p,.3,.35),seg(p,.33,.38),seg(p,.36,.41)]});
  s+=panel(100,200,T(`${cs(EC,'\\mathbf{E}')}=(\\alpha y,\\ \\alpha x)`,PC,160,44)+label('α ＝ 1 V/m²、座標は m',PC,220,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.4,.5),label('電子（−e）を P → Q へ、放物線に 沿って',PC,270,{size:26,color:EL,anchor:'middle',weight:700})),seg(p,.03,.12));
  return s;
 },
 [K+'goal1']:(p)=>{
  let s=plane(V2,{fop:.6})+parab(V2,{glow:seg(p,.1,.25)*(1-seg(p,.6,.75))})+pq(V2)+electron(V2.X(0),V2.Y(0),{lab:0})+uTicks(V2);
  s+=panel(100,150,label('小問1',PC,145,{size:26,color:C.dim,anchor:'middle'})+T(`\\int_{C}${cs(EC,'\\mathbf{E}')}\\cdot d\\mathbf{r}`,PC,210,46),seg(p,.05,.15),C.hi);
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 3. 目盛りの点を順に光らせ、𝐫(u) の値。式カードに ∫₀¹（　）du の枠だけ
 [K+'param']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=plane(V2,{fop:.5})+parab(V2)+pq(V2)+uTicks(V2,{g:[1,1,1],vals:1});
  [0,.5,1].forEach((u,i)=>{const [x,y]=r(u),a=.1+i*.1;s+=fade(seg(p,a,a+.05)*(1-seg(p,a+.1,a+.14)),ring(V2.X(x),V2.Y(y),20,{color:C.hi,w:4}));});
  s+=panel(100,260,T(`\\mathbf{r}(u)=(u,\\ 2u^2)`,PC,160,44)
   +fade(seg(p,b,b+.1),line(PX+40,205,PX+PW-40,205,{color:C.faint,w:2})+T(`\\int_{C}${cs(EC,'\\mathbf{E}')}\\cdot d\\mathbf{r}=\\int_0^1\\Big(\\qquad\\qquad\\Big)\\,du`,PC,285,42)
    +label('u だけの 普通の 積分',PC,345,{size:24,color:C.dim,anchor:'middle'})),1);
  s+=goalTag(G1);
  return s;
 },
 // 4a. 2026-10-16 点検PQ-020：u と u＋Δu の2点と移動の矢印。文1 で Δ𝐫≈𝐫′(u)Δu（実際の移動＝白の点線、近似＝黄）、
 //   文2 で Δu を小さくして d𝐫＝𝐫′(u)du。最後に次の cue と同じ接線の矢印 (1, 2) に戻す。図の Δu は 0.3 から 0.06 へ（図のための値）。
 [K+'tangent']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,{X,Y}=V2;
  const du=mix(.3,.06,seg(p,b+.05,b+.3)),back=seg(p,b+.42,b+.5),gA=seg(p,.05,.14)*(1-back);
  const [x0,y0]=r(.5),[x1,y1]=r(.5+du),tx=.5+du,ty=.5+2*du;
  let s=plane(V2,{fop:.35})+parab(V2)+pq(V2)+uTicks(V2,{g:[1,1-gA,1]});
  s+=fade(gA,dot(X(x0),Y(y0),7,C.ink)+label('u',X(x0)+14,Y(y0)+24,{size:24,color:C.ink,weight:700})
   +dot(X(x1),Y(y1),7,C.ink)+label('u＋Δu',X(x1)-14,Y(y1)-4,{size:24,color:C.ink,anchor:'end',weight:700}));
  s+=fade(seg(p,.14,.22)*(1-back),line(X(x0),Y(y0),X(x1),Y(y1),{color:C.ink,w:3,dash:'6 6'})+(du>.2?label('実際の 移動',X(x0)-16,Y(y0)-24,{size:22,color:C.ink,anchor:'end'}):''));
  s+=fade(seg(p,.24,.34)*(1-back),arrow(X(x0),Y(y0),X(tx),Y(ty),{color:UX,w:5,head:Math.min(15,8+60*du)})+(du>.2?label("𝐫′(u)Δu",X(tx)+12,Y(ty)+14,{size:24,color:UX,weight:700}):''));
  s+=tanAt(V2,.5,{g:back,lab:'(1, 2)'});
  s+=panel(100,250,T(`\\Delta\\mathbf{r}\\approx${cs(UX,"\\mathbf{r}'(u)")}\\,\\Delta u`,PC,160,44)
   +fade(seg(p,b,b+.08),line(PX+40,205,PX+PW-40,205,{color:C.faint,w:2})+label('一歩を 限りなく 短く（Δu → du）',PC,250,{size:26,color:C.dim,anchor:'middle',weight:700}))
   +fade(seg(p,b+.3,b+.38),T(`d\\mathbf{r}=${cs(UX,"\\mathbf{r}'(u)")}\\,du`,PC,315,46)),1,UX);
  s+=goalTag(G1);
  return s;
 },
 // 4b. x 成分 1、y 成分 4u を一つずつ。枠に 𝐄(𝐫(u))·𝐫′(u) を入れる
 [K+'tangent2']:(p)=>{
  let s=plane(V2,{fop:.35})+parab(V2)+pq(V2)+uTicks(V2)+tanAt(V2,.5,{lab:'(1, 2)'});
  s+=panel(100,330,T(`x=u\\ \\to\\ \\dfrac{dx}{du}=${cs(UX,'1')}`,PC-170,165,32)+fade(seg(p,.25,.35),T(`y=2u^2\\ \\to\\ \\dfrac{dy}{du}=${cs(UX,'4u')}`,PC+170,165,32))
   +fade(seg(p,.45,.55),T(`${cs(UX,"\\mathbf{r}'")}=(1,\\ 4u)`,PC,255,42))
   +fade(seg(p,.65,.75),T(`\\int_0^1${cs(EC,'\\mathbf{E}(\\mathbf{r}(u))')}\\cdot${cs(UX,"\\mathbf{r}'(u)")}\\,du`,PC,355,40)),1,UX);
  s+=goalTag(G1);
  return s;
 },
 // 5. u＝0.5 に電場の矢印 (0.5, 0.5)。αy の y に 2u²、αx の x に u を代入
 [K+'field']:(p)=>{
  let s=plane(V2,{fop:.35})+parab(V2)+pq(V2)+uTicks(V2)+tanAt(V2,.5,{g:.5})+eAt(V2,.5,{g:seg(p,.05,.15),lab:'(0.5, 0.5)'});
  const h1=seg(p,.2,.3),h2=seg(p,.45,.55);
  s+=panel(100,240,T(`${cs(EC,'\\mathbf{E}')}=(\\alpha ${h1>.5?cs(C.hi,'(2u^2)'):'y'},\\ \\alpha ${h2>.5?cs(C.hi,'(u)'):'x'})`,PC,165,42)
   +fade(seg(p,.6,.7),T(`=(${cs(EC,'2\\alpha u^2')},\\ ${cs(EC,'\\alpha u')})`,PC,260,42)),1,EC);
  s+=note('u ＝ 0.5 の 矢印は 1 V/m を 0.4 m で 描く',PC,380);
  s+=goalTag(G1);
  return s;
 },
 // 6. 横どうし・縦どうしを同じ色の枠で結び、2αu²＋4αu²＝6αu²
 [K+'dot']:(p)=>{
  let s=plane(V2,{fop:.35})+parab(V2)+pq(V2)+uTicks(V2)+tanAt(V2,.5)+eAt(V2,.5);
  const a=`(${cs(EC,'2\\alpha u^2')},\\ ${cs(C.p,'\\alpha u')})\\cdot(${cs(EC,'1')},\\ ${cs(C.p,'4u')})`;
  s+=panel(100,300,T(a,PC,165,40)
   +fade(seg(p,.15,.3),T(`=${cs(EC,'2\\alpha u^2\\times1')}+${cs(C.p,'\\alpha u\\times4u')}`,PC,250,38))
   +fade(seg(p,.45,.6),T(`=2\\alpha u^2+4\\alpha u^2=${cs(C.hi,'6\\alpha u^2')}`,PC,335,40)),1);
  s+=fade(seg(p,.15,.3),label('横どうし',PX+60,250,{size:24,color:EC,weight:700})+label('縦どうし',PX+PW-60,250,{size:24,color:C.p,anchor:'end',weight:700}));
  s+=goalTag(G1);
  return s;
 },
 // 7. ∫₀¹6u²du＝6×1/3＝2 → 2 V。答えの札 D
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=plane(V2,{fop:.35})+parab(V2,{glow:.6})+pq(V2)+uTicks(V2);
  s+=panel(100,300,T(`\\int_0^1 6\\alpha u^2\\,du`,PC,165,42)
   +fade(seg(p,.1,.22),T(`=6\\alpha\\times\\dfrac{1}{3}=2\\alpha`,PC,255,40))
   +fade(seg(p,.3,.42),T(`=${cs(WC,'2\\ \\mathrm{V}')}`,PC,340,46)+label('（α ＝ 1 V/m²、V/m² × m² ＝ V）',PC,380,{size:22,color:C.dim,anchor:'middle'})),1,WC);
  s+=goalTag(G1)+ANS1(seg(p,b+.05,b+.12));
  return s;
 },
 // 8. 誤答 A → B
 [K+'wrongAB']:(p,ctx)=>{
  let s=plane(V2,{fop:.35})+parab(V2)+pq(V2)+uTicks(V2);
  s+=panel(100,90,T(`\\int_0^1 6\\alpha u^2\\,du=${cs(WC,'2\\ \\mathrm{V}')}`,PC,150,34),1);
  s+=wrongSeq(p,ctx,[['A','6 V','積分せず u＝1 を 代入',{mid:'6\\alpha u^2\\big|_{u=1}=6'}],['B','4/3 V','2u² の 微分を 2u とした',{mid:"\\mathbf{r}'=(1,\\,2u)\\to\\int_0^1 4u^2du=\\tfrac43"}]],{opts:{...WOPT,y:215}});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },
 // 9. 誤答 C：Q の電場 (2, 1) と P→Q の灰色の矢印 (1, 2)。途中の矢印を点滅
 [K+'wrongC']:(p,ctx)=>{
  const bl=.5+.5*Math.sin(cueT(ctx)*5);
  let s=plane(V2,{fop:.35+.65*bl*seg(p,.3,.4)})+parab(V2,{g:.5})+pq(V2);
  const {X,Y}=V2;
  s+=fade(seg(p,.05,.15),arrow(X(0),Y(0),X(1),Y(2),{color:C.dim,w:4,head:14})+label('(1, 2)',X(.5)-14,Y(1)+6,{size:24,color:C.dim,anchor:'end',weight:700}));
  s+=fade(seg(p,.1,.2),arrow(X(1),Y(2),X(1)+.3*V2.sc*2,Y(2)-.3*V2.sc*1,{color:EC,w:5,head:15})+label('Q の 電場 (2, 1)',X(1)-14,Y(2)-14,{size:24,color:EC,anchor:'end',weight:700}));
  s+=panel(100,90,T(`\\int_0^1 6\\alpha u^2\\,du=${cs(WC,'2\\ \\mathrm{V}')}`,PC,150,34),1);
  s+=wrongCard('C','4 V',['終点の 電場だけで 内積','（途中で 電場が 変わる 分を 入れていない）'],{...WOPT,y:215,mid:'(2,\\,1)\\cdot(1,\\,2)=4',g:seg(p,.03,.1)});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },

 // ===================== 小問2 =====================
 [K+'goal2']:(p)=>{
  let s=plane(V2,{fop:.6})+parab(V2)+pq(V2)+electron(V2.X(0),V2.Y(0));
  s+=panel(100,160,label('小問2',PC,145,{size:26,color:C.dim,anchor:'middle'})+label('電子の 位置エネルギーの 変化 ΔU（P → Q）',PC,205,{size:28,color:WC,anchor:'middle',weight:700}),seg(p,.05,.15),C.hi);
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 11. 等電位線（紫）。−∂V/∂x＝αy、−∂V/∂y＝αx
 [K+'pot']:(p)=>{
  let s=plane(V2,{fop:.35})+equip(V2,{g:seg(p,.05,.25)})+parab(V2,{g:.5})+pq(V2);
  s+=fade(seg(p,.05,.2),label('V の 値 [V]',V2.X(1.2),V2.Y(2.2)-8,{size:22,color:VC,anchor:'end',weight:700}));
  s+=panel(100,280,T(`${cs(VC,'V')}=-\\alpha xy`,PC,160,44)
   +fade(seg(p,.3,.42),T(`-\\dfrac{\\partial ${cs(VC,'V')}}{\\partial x}=\\alpha y`,PC-170,265,36))
   +fade(seg(p,.5,.62),T(`-\\dfrac{\\partial ${cs(VC,'V')}}{\\partial y}=\\alpha x`,PC+170,265,36))
   +fade(seg(p,.7,.8),label('→ 𝐄 ＝ (αy, αx) に 戻る',PC,350,{size:26,color:EC,anchor:'middle',weight:700})),1,VC);
  s+=goalTag(G2);
  return s;
 },
 // 12. P と Q の電位。小問1 の 2 V と「一致」。直線の道を白の点線で重ねる
 [K+'check']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=plane(V2,{fop:.3})+equip(V2,{g:.5})+parab(V2)+pq(V2);
  const {X,Y}=V2;
  s+=fade(seg(p,.05,.15),label('V(P) ＝ 0',X(0)+14,Y(0)-14,{size:24,color:VC,weight:700}))+fade(seg(p,.15,.25),label('V(Q) ＝ −2 V',X(1)-16,Y(2)-12,{size:24,color:VC,anchor:'end',weight:700}));
  s+=fade(seg(p,b+.2,b+.3),draw([[X(0),Y(0)],[X(1),Y(2)]],1,{color:C.ink,w:3,dash:'8 8'})+label('直線でも 同じ 値',X(.5)-14,Y(1.2),{size:22,color:C.ink,anchor:'end',weight:700}));
  s+=panel(100,260,T(`\\int${cs(EC,'\\mathbf{E}')}\\cdot d\\mathbf{r}=-\\{${cs(VC,'V(Q)')}-${cs(VC,'V(P)')}\\}`,PC,160,38)
   +fade(seg(p,b,b+.1),T(`=-\\{(-2)-0\\}=${cs(WC,'2\\ \\mathrm{V}')}`,PC,240,40))
   +fade(seg(p,b+.12,b+.22),label('小問1 の 2 V と 一致 ✓',PC,320,{size:28,color:C.F,anchor:'middle',weight:700})),1,VC);
  s+=goalTag(G2);
  return s;
 },
 // 13. (−e)×(−2 V)＝+e×2 V。符号の積を光らせる。答えの札 B
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=plane(V2,{fop:.3})+parab(V2)+pq(V2)+electron(V2.X(0),V2.Y(0));
  const {X,Y}=V2;s+=label('V(P) ＝ 0',X(0)+14,Y(0)-14,{size:24,color:VC,weight:700})+label('V(Q) ＝ −2 V',X(1)-16,Y(2)-12,{size:24,color:VC,anchor:'end',weight:700});
  const f=`=(${cs(EL,'-e')})\\times(${cs(VC,'-2\\ \\mathrm{V}')})`;
  s+=panel(100,260,T(`\\Delta U=q\\,\\Delta ${cs(VC,'V')}`,PC,160,42)+fade(seg(p,.1,.2),T(f,PC,240,40))
   +fade(seg(p,.25,.32)*(1-seg(p,b,b+.05)),label('負 × 負 ＝ 正',PC,300,{size:26,color:C.hi,anchor:'middle',weight:700}))
   +fade(seg(p,.32,.42),T(`=${cs(WC,'+e\\times2\\ \\mathrm{V}')}`,PC,325,42)),1,WC);
  s+=goalTag(G2)+ANS2(seg(p,b+.05,b+.12));
  return s;
 },
 // 14. 誤答 A（W と ΔU の取り違え）→ C（動画の別の電場の値）
 [K+'wrongAC']:(p,ctx)=>{
  let s=plane(V2,{fop:.3})+parab(V2)+pq(V2);
  s+=panel(100,90,T(`\\Delta U=${cs(WC,'+e\\times2\\ \\mathrm{V}')}`,PC-150,150,32)+label('W電 ＝ −ΔU',PC+150,158,{size:30,color:C.ink,anchor:'middle',weight:700}),1);
  s+=wrongSeq(p,ctx,[['A','−e×2 V',['電気力の 仕事 W と ΔU の 取り違え','（ΔU ＝ −W）']],['C','+e×1 V',['単元動画の 別の 電場の 値','（終点 (1, 1)、この 電場で 計算し直していない）']]],{opts:{...WOPT,y:215}});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },
 // 15. 誤答 D（0 J）。P と Q の電位の値を黄で囲む
 [K+'wrongD']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=plane(V2,{fop:.3})+parab(V2)+pq(V2);
  const {X,Y}=V2;s+=label('V(P) ＝ 0',X(0)+14,Y(0)-14,{size:24,color:VC,weight:700})+label('V(Q) ＝ −2 V',X(1)-16,Y(2)-12,{size:24,color:VC,anchor:'end',weight:700});
  const hb=seg(p,b,b+.08);
  s+=fade(hb,rect(X(0)+6,Y(0)-42,128,40,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:8})+rect(X(1)-176,Y(2)-42,168,40,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:8}));
  s+=panel(100,90,T(`\\Delta U=${cs(WC,'+e\\times2\\ \\mathrm{V}')}`,PC,150,34),1);
  s+=wrongCard('D','0 J',['外から 運んでも ΔU は','始点と 終点の 電位で 決まる'],{...WOPT,y:215,g:seg(p,.03,.1)});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },

 // ===================== 小問3 =====================
 [K+'goal3']:(p)=>{
  let s=box3(O3V,{g:seg(p,.03,.15)});
  s+=panel3(100,240,label('後半の 電場',PC3,145,{size:26,color:C.dim,anchor:'middle'})+T(`${cs(EC,'\\mathbf{E}')}=\\beta(0,\\ z,\\ y),\\ \\beta=4\\ \\mathrm{V/m^2}`,PC3,205,36)
   +label('面：z ＝ 0、0 ≤ x ≤ 2 m、0 ≤ y ≤ 1 m',PC3,265,{size:26,color:GOLD,anchor:'middle',weight:700})+label('法線は 上向き（+z）',PC3,310,{size:26,color:NC,anchor:'middle',weight:700}),seg(p,.1,.2),C.hi);
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 17. 2026-10-16 点検PQ-021：文1 で横の座標 u・縦の座標 v と 𝐬(u, v)、文2 で小さな長方形（横 du、縦 dv）と、外積で上向きの d𝐀。
 [K+'surf']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,S=P3(O3V);
  let s=box3(O3V,{grid:seg(p,.03,.12),normal:seg(p,b+.45,b+.55),steps:0});
  const lu=S([.5,0,0]),lv=S([0,1.4,0]);
  s+=fade(seg(p,.12,.22),label('横の 座標：u',lu[0],lu[1]+34,{size:24,color:UX,anchor:'middle',weight:700})+label('縦の 座標：v',lv[0]+30,lv[1]+6,{size:24,color:VX,weight:700}));
  const sp=S([.5,.75,0]);
  s+=fade(seg(p,.25,.35),dot(sp[0],sp[1],7,C.ink)+line(sp[0],sp[1],sp[0]+60,232,{color:C.ink,w:1.5})+label('𝐬(u, v)：面の 上の 点',sp[0]+60,222,{size:22,color:C.ink,weight:700}));
  const R0=[1.3,.15],D=.4,sq=[[R0[0],R0[1],0],[R0[0]+D,R0[1],0],[R0[0]+D,R0[1]+D,0],[R0[0],R0[1]+D,0]].map(S);
  const k=seg(p,b,b+.08);
  s+=fade(k,poly(sq,{fill:NC,fo:.3,stroke:NC,sw:2.5}));
  const eu=S([R0[0]+D/2,R0[1],0]),ev=S([R0[0]+D,R0[1]+D/2,0]);
  s+=fade(seg(p,b+.08,b+.16),line(sq[0][0],sq[0][1]+10,sq[1][0],sq[1][1]+10,{color:UX,w:4})+label('du',eu[0],eu[1]+36,{size:26,color:UX,anchor:'middle',weight:700}));
  s+=fade(seg(p,b+.16,b+.24),line(sq[1][0]+10,sq[1][1],sq[2][0]+10,sq[2][1],{color:VX,w:4})+label('dv',ev[0]+30,ev[1]+22,{size:26,color:VX,weight:700}));
  s+=panel3(100,300,T(`\\mathbf{s}(u,v)=(u,\\ v,\\ 0)`,PC3,155,38)
   +fade(seg(p,.12,.22),label('横の 座標 u、縦の 座標 v',PC3,205,{size:24,color:C.dim,anchor:'middle',weight:700}))
   +fade(seg(p,b+.08,b+.2),label('小さな 長方形：横 du、縦 dv',PC3,255,{size:26,color:NC,anchor:'middle',weight:700}))
   +fade(seg(p,b+.3,b+.4),T(`${cs(UX,'(1,0,0)')}\\times${cs(VX,'(0,1,0)')}=${cs(NC,'(0,0,1)')}`,PC3,315,32))
   +fade(seg(p,b+.45,b+.55),label('d𝐀 は 上向き、大きさ du dv',PC3,370,{size:26,color:NC,anchor:'middle',weight:700})),1);
  s+=goalTag(G3);
  return s;
 },
 // 18. 帯 5 本、上向きの水色の矢印（奥ほど長い）
 [K+'strips']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  const hs=[0,1,2,3,4].map(k=>seg(p,b+.05+k*.06,b+.12+k*.06));
  let s=box3(O3V,{strips:seg(p,b,b+.08),fieldUp:1,stripH:hs,normal:.4});
  s+=panel3(100,240,label('面の 上では z ＝ 0',PC3,150,{size:26,color:C.dim,anchor:'middle'})+T(`${cs(EC,'\\mathbf{E}')}=(0,\\ 0,\\ \\beta y)`,PC3,215,42)
   +fade(seg(p,b,b+.1),label('面に 垂直、奥（y が 大きい）ほど 強い',PC3,290,{size:26,color:EC,anchor:'middle',weight:700})),1,EC);
  s+=goalTag(G3);
  return s;
 },
 // 19. 帯を手前から1本ずつ足す。Φ＝∫₀¹ 2βy dy＝β×2×1/2＝4
 [K+'flux']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  const k=Math.min(4,Math.floor(seg(p,b,b+.35)*5));
  let s=box3(O3V,{strips:1,fieldUp:1,stripH:[1,1,1,1,1],normal:.4,glowStrip:p<b?0:k});
  s+=panel3(100,330,label('帯 1 本',PX3+80,168,{size:26,color:C.dim,anchor:'middle'})+T(`${cs(EC,'\\beta y')}\\times2\\ \\mathrm{m}\\times dy=2\\beta y\\,dy`,PC3+50,160,32)
   +fade(seg(p,b,b+.1),T(`\\Phi=\\int_0^1 2\\beta y\\,dy`,PC3,245,38))
   +fade(seg(p,b+.3,b+.4),T(`=\\beta\\times2\\times\\dfrac12=${cs(WC,'4\\ \\mathrm{V\\cdot m}')}`,PC3,335,38)),1,WC);
  s+=goalTag(G3);
  return s;
 },
 // 20. 答えの札 A。βy のグラフ：下の三角形（橙）と最大×幅の長方形（点線、上半分に赤い ×）。誤答 B
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.3;
  const x0=90,y0=420,gw=270,gh=280,X=u=>x0+gw*u,Y=v=>y0-gh*v/4;
  let s=arrow(x0-10,y0,x0+gw+30,y0,{color:C.dim,w:2.5,head:12})+arrow(x0,y0+10,x0,y0-gh-30,{color:C.dim,w:2.5,head:12});
  s+=label('y [m]',x0+gw+36,y0+8,{size:24,color:C.dim})+label('βy [V/m]',x0,y0-gh-42,{size:24,color:EC,anchor:'middle'});
  s+=label('1',X(1),y0+32,{size:24,color:C.dim,anchor:'middle'})+label('4',x0-14,Y(4)+8,{size:24,color:C.dim,anchor:'end'})+label('0',x0-14,y0+8,{size:24,color:C.dim,anchor:'end'});
  s+=line(X(1),y0-5,X(1),y0+5,{color:C.dim})+line(x0-5,Y(4),x0+5,Y(4),{color:C.dim});
  s+=fade(seg(p,.05,.15),poly([[X(0),y0],[X(1),y0],[X(1),Y(4)]],{fill:WC,fo:.45,stroke:WC,sw:2})+line(X(0),y0,X(1),Y(4),{color:EC,w:4}));
  s+=fade(seg(p,.08,.15),label('三角形の 面積 × x の 幅 2 m → 4 V·m',x0,y0+64,{size:22,color:C.ink,weight:700}));
  s+=fade(seg(p,b,b+.08),rect(X(0),Y(4),gw,gh,{fill:'none',fo:0,stroke:C.dim,sw:2.5,rx:2}));
  s+=fade(seg(p,b+.08,b+.15),line(X(.25)-16,Y(3)-16,X(.25)+16,Y(3)+16,{color:NG,w:5})+line(X(.25)-16,Y(3)+16,X(.25)+16,Y(3)-16,{color:NG,w:5}));
  const W2=W[1]?W[1]:[.5,1],half=W2[0]+(W2[1]-W2[0])*.55;
  s+=fade(seg(p,half,half+.06),line(X(0),Y(2),X(1),Y(2),{color:C.hi,w:3,dash:'8 6'})+label('平均 ＝ 最大の 半分（2）',X(.55),Y(2)-12,{size:22,color:C.hi,anchor:'middle',weight:700}));
  s+=panel3(100,90,T(`\\Phi=${cs(WC,'4\\ \\mathrm{V\\cdot m}')}`,PC3,150,36),1,WC);
  s+=wrongCard('B','8 V·m',['一番 強い βy（4 V/m）× 面積 2 m²','βy の 平均は 最大の 半分'],{x:PX3,w:PW3,size:26,whySize:22,y:215,mid:'4\\times1\\times2=8',g:seg(p,b,b+.06)});
  s+=goalTag(G3)+ANS3(seg(p,.02,.08));
  return s;
 },
 // 21. 誤答 C → D。D のとき法線が一瞬下向きに反転して戻る
 [K+'wrongCD']:(p,ctx)=>{
  const ve=sentWin(ctx)[0][1],wC=[0,ve*.5],wD=[ve*.5,1];
  const fl=seg(p,wD[0]+.05,wD[0]+.12)*(1-seg(p,.85,.92));
  let s=box3(O3V,{strips:1,fieldUp:1,stripH:[1,1,1,1,1],normal:1,nFlip:fl});
  s+=panel3(100,90,T(`\\Phi=${cs(WC,'4\\ \\mathrm{V\\cdot m}')}`,PC3,150,36),1,WC);
  s+=wrongSeq(p,ctx,[['C','2 V·m','x の 幅 2 m を 掛け忘れ',{mid:'4\\times\\tfrac12=2'}],['D','−4 V·m','外積の 順が 逆で 法線が 下向き',{mid:"\\tfrac{\\partial\\mathbf{s}}{\\partial v}\\times\\tfrac{\\partial\\mathbf{s}}{\\partial u}=(0,0,-1)"}]],{win:[wC,wD],opts:{x:PX3,w:PW3,size:26,whySize:22,y:215}});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },

 // ===================== まとめ =====================
 [K+'sum']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=card(60,110,520,260,label('道：目盛り 1 つ（u）',320,160,{size:28,color:PATH,anchor:'middle',weight:700})+T(`d\\mathbf{r}=${cs(UX,"\\mathbf{r}'(u)")}\\,du`,320,260,48),seg(p,.03,.12),PATH);
  s+=card(620,110,520,260,label('面：目盛り 2 つ（u, v）',880,160,{size:28,color:GOLD,anchor:'middle',weight:700})+T(`d\\mathbf{A}=\\Big(${cs(UX,'\\tfrac{\\partial\\mathbf{s}}{\\partial u}')}\\times${cs(VX,'\\tfrac{\\partial\\mathbf{s}}{\\partial v}')}\\Big)du\\,dv`,880,260,40),seg(p,.15,.25),GOLD);
  s+=fade(seg(p,b,b+.1),label('目盛りを 付ければ → 普通の 積分',600,440,{size:32,color:C.hi,anchor:'middle',weight:700}));
  s+=answerRow([[1,'D','2 V'],[2,'B','+e×2 V'],[3,'A','4 V·m']],{g:seg(p,.85,.93)});
  return s;
 },
};

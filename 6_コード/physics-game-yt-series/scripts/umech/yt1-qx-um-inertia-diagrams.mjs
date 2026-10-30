// 問題編 解説「おもりの付いた棒と、一様な棒」（q-um-inertia、大学編 17 慣性モーメント・中級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/17_慣性モーメント.md の q-um-inertia（解説 18 行）。
// 画面の配置：左に図（上から見た棒）、右に説明の枠。誤答カードは右の枠の下。札の帯（y＜78）には図を描かない。
// 色：距離 x・r 水色、速さ v 紫、ω 桃、運動エネルギー K 橙、dx・dm 金、強調 黄、物体（一様な棒）灰青。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,tex,texWidth,poly} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,cueT,tAt,sentWin} from './yt1-qx-common.mjs';

const K='qx-um-inertia:';
const CR=C.x,CV=C.v,CW=C.p,CK=C.E,GOLD=C.t,BODY='#8aa0c4',WOOD='#b99b73';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const RR=`{\\color{${CR}}r}`,XX=`{\\color{${CR}}x}`,WW=`{\\color{${CW}}\\omega}`,VV=`{\\color{${CV}}v}`,KK=`{\\color{${CK}}K}`,TH=`{\\color{${C.E}}\\theta}`,SS=`{\\color{${CR}}s}`;
const DX=`{\\color{${GOLD}}dx}`,DM=`{\\color{${GOLD}}dm}`,LL=`{\\color{${CR}}l}`;
const KGM2='\\ \\mathrm{kg\\cdot m^2}';
const PX=680,PW=500,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const G1='慣性モーメント I',G2='端の 軸の まわりの I',G3='回転の 運動エネルギー K';
const ANS1=g=>answerTag(1,'B','6.25 kg·m²',{g}),ANS2=g=>answerTag(2,'A','18 kg·m²',{g}),ANS3=g=>answerTag(3,'D','36 J',{g});
function rowT(parts,x,y,size,{gap=.12}={}){
 const ws=parts.map(q=>texWidth(q,size,false)),tot=ws.reduce((a,b)=>a+b,0)+size*gap*(parts.length-1);
 let X=x-tot/2;const pos=[];
 parts.forEach((q,i)=>{pos.push({x:X+ws[i]/2,w:ws[i]});X+=ws[i]+size*gap;});
 return {pos,w:tot,svg:(gs=parts.map(()=>1))=>parts.map((q,i)=>fade(gs[i],T(q,pos[i].x,y,size))).join('')};
}
function turnArc(cx,cy,r,a0,a1,{color=CW,w=4}={}){
 const pts=Array.from({length:31},(_,i)=>{const a=a0+(a1-a0)*i/30;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});
 const [x2,y2]=pts[30],sg=Math.sign(a1-a0),tx=-Math.sin(a1)*sg,ty=-Math.cos(a1)*sg,L=16;
 return draw(pts,1,{color,w})+poly([[x2+tx*6,y2+ty*6],[x2-tx*L+ty*L*.55,y2-ty*L-tx*L*.55],[x2-tx*L-ty*L*.55,y2-ty*L+tx*L*.55]],{fill:color,fo:1});
}
const axisDot=(x,y,lab=1)=>ring(x,y,12,{color:C.ink,w:3,fill:C.bg})+dot(x,y,4,C.ink)+(lab?label('軸',x-20,y+8,{size:24,color:C.dim,anchor:'end'}):'');

// ---- 小問1：軽い棒と3つのおもり（上から見た図、軸は左）----------------------------------------------------
const MS=[[.5,1,'1 kg'],[1,2,'2 kg'],[2,1,'1 kg']];
const RM=m=>m>1?23:17;
function massRod(phi,{ax=90,ay=360,ppm=230,show=[1,1,1],ticks=1,mlab=1,arcs=0,varr=0,vk=45,frames=0,bars=[0,0,0],bscale=40,klab=0,g=1,view=1}={}){
 const P=(r,a=phi)=>[ax+r*ppm*Math.cos(a),ay-r*ppm*Math.sin(a)];
 let s='';
 if(view)s+=label('上から 見た 図',ax-60,ay-250,{size:22,color:C.dim});
 if(ticks){const y=ay+52;s+=fade(ticks,line(ax,y,ax+2.05*ppm,y,{color:CR,w:2.5})+[0,.5,1,2].map(r=>line(ax+r*ppm,y-8,ax+r*ppm,y+8,{color:CR,w:2.5})+(r?label(`${r.toFixed(1)} m`,ax+r*ppm,y+32,{size:22,color:CR,anchor:'middle',weight:700}):label('0',ax,y+32,{size:22,color:CR,anchor:'middle'}))).join('')+label('軸からの 距離',ax+2.05*ppm,y-14,{size:22,color:CR,anchor:'end'}));}
 if(arcs>0&&phi>.02)for(const [r] of MS){const pts=Array.from({length:31},(_,i)=>P(r,phi*i/30));s+=fade(arcs,draw(pts,1,{color:CR,w:6}));}
 const [ex,ey]=P(2.1);s+=line(ax,ay,ex,ey,{color:WOOD,w:6});
 MS.forEach(([r,m,t],i)=>{if(!(show[i]>0))return;const [x,y]=P(r);
  s+=fade(show[i],ring(x,y,RM(m),{color:C.ink,w:3,fill:'#2a3550'})+(mlab?label(t,x,y-RM(m)-12,{size:22,color:C.ink,anchor:'middle',weight:700}):''));
  if(klab)s+=fade(klab,T(`${KK}_{${i+1}}`,x,y-RM(m)-48,30));
  if(varr>0){const L=r*vk*varr,ux=-Math.sin(phi),uy=-Math.cos(phi);s+=arrow(x+ux*RM(m),y+uy*RM(m),x+ux*(RM(m)+L),y+uy*(RM(m)+L),{color:CV,w:5,head:14});}
  if(frames>0||bars[i]>0){const v=m*r*r,h=v*bscale,base=y-RM(m)-44;
   if(frames>0)s+=fade(frames*(1-clamp(bars[i]*4)),rect(x-22,base-50,44,50,{fill:'none',fo:0,stroke:C.ink,sw:2,rx:3}));
   if(bars[i]>0){s+=rect(x-22,base-h*bars[i],44,h*bars[i],{fill:C.ink,fo:.75,stroke:C.ink,rx:3})+fade(clamp(bars[i]*3-2),label(String(v),x,base-h-12,{size:24,color:C.ink,anchor:'middle',weight:700}));}}
 });
 s+=axisDot(ax,ay);
 return fade(g,s);
}

// ---- 小問2：一様な棒（上から見た図、端の軸）----------------------------------------------------------
const RX=90,RY=300,RP=150; // 1 m = 150 px、l＝3 m → 450 px
function uRod({x0=RX,y=RY,ppm=RP,N=0,hi=-1,g=1,lab=1,axis=1,axLab=1,ghostAxis=null,h=26}={}){
 const L=3*ppm;let s=rect(x0,y-h/2,L,h,{fill:BODY,fo:.45,stroke:BODY,sw:2,rx:4});
 if(N)for(let i=1;i<N;i++){const X=x0+L*i/N;s+=line(X,y-h/2,X,y+h/2,{color:C.bg,w:2});}
 if(hi>=0&&N){const w=L/N;s+=rect(x0+w*hi,y-h/2,w,h,{fill:GOLD,fo:.8,stroke:GOLD,sw:2,rx:2});}
 if(lab)s+=label('M ＝ 6 kg',x0+L*.28,y-h/2-18,{size:26,color:C.ink,anchor:'middle',weight:700})+brace(x0,x0+L,y+h/2+12,{dir:1,color:CR,text:'l ＝ 3 m',size:26});
 if(axis)s+=axisDot(x0,y,axLab);
 if(ghostAxis!==null)s+=ring(ghostAxis,y,12,{color:C.a,w:3,dash:'4 4'})+dot(ghostAxis,y,4,C.a);
 return fade(g,s);
}
// 回る一様な棒（中心の軸、ppm 70）
function spinRod(a,{cx=300,cy=300,ppm=60,g=1,omega=0}={}){
 const L=3*ppm,ex=cx+L*Math.cos(a),ey=cy-L*Math.sin(a),nx=Math.sin(a)*12,ny=Math.cos(a)*12;
 let s=ring(cx,cy,L+16,{color:C.faint,w:2,dash:'6 8'});
 s+=poly([[cx-nx,cy-ny],[ex-nx,ey-ny],[ex+nx,ey+ny],[cx+nx,cy+ny]],{fill:BODY,fo:.45,stroke:BODY,sw:2});
 s+=axisDot(cx,cy,0);
 if(omega)s+=fade(omega,turnArc(cx,cy,L+28,a+.25,a+1.1,{color:CW,w:4}));
 return fade(g,s);
}

export const ytQxUmInertiaDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（約4秒）：軸と軽い棒、軸からの距離の目盛り。0〜3 秒で 1 kg・2 kg・1 kg が順に付く。静止。
 [K+'q1']:(p)=>massRod(0,{ax:320,ay:300,ppm:280,show:[seg(p,.05,.25),seg(p,.3,.5),seg(p,.55,.75)],view:1}),
 // 小問2（約4秒）：一様な棒（M＝6 kg、l＝3 m）が現れ、2〜4 秒で端の軸のまわりに一度回って止まる。
 [K+'q2']:(p,ctx)=>q2fig(cueT(ctx),0),
 // 小問3（約4.5秒）：小問2 の図に、右上の「ω＝2 rad/s」（桃）の札を足す。
 [K+'q3']:(p,ctx)=>q2fig(cueT(ctx),1),

 // ===================== 小問1 =====================
 [K+'goal1']:(p)=>{
  let s=massRod(0);
  s+=panel(90,260,label('小問1',PC,140,{size:28,color:C.dim,anchor:'middle'})
   +label('3つの おもりの 付いた 棒の',PC,205,{size:28,color:C.hi,anchor:'middle',weight:700})
   +label('軸の まわりの 慣性モーメント I',PC,255,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s+goalTag(G1,{g:seg(p,.03,.15)});
 },
 // 2. 棒を少し回す：円弧（水色）、速さ（紫、距離に比例）。s＝rθ → 時間で1回微分 → v＝r dθ/dt＝rω
 [K+'speed']:(p)=>{
  const ph=.35*seg(p,.03,.3);
  let s=massRod(ph,{ticks:1-seg(p,.03,.1),arcs:1,varr:seg(p,.6,.75)});
  s+=fade(seg(p,.62,.75),label('遠いほど 速い',360,470,{size:24,color:CV,anchor:'middle',weight:700}));
  let q=T(`${SS}=${RR}\\,${TH}`,PC,140,40);
  q+=fade(seg(p,.25,.35),arrow(PC,168,PC,206,{color:C.dim,w:3,head:12})+label('時間で 1回 微分',PC+20,196,{size:24,color:C.dim}));
  q+=fade(seg(p,.38,.5),T(`${VV}=${RR}\\,\\dfrac{d${TH}}{dt}`,PC,270,40));
  q+=fade(seg(p,.55,.65),T(`=${RR}${WW}`,PC,370,44)+highlight(PC-80,330,160,76,1));
  s+=panel(90,330,q,seg(p,.02,.1));
  return s+goalTag(G1);
 },
 // 3. 各おもりの K を縦に並べ、ω² を光らせて外へ出す（カット割り：式が主役）
 [K+'sum']:(p,ctx)=>{
  let s=massRod(0,{ticks:0,klab:seg(p,.05,.15),g:.9});
  const hiW=seg(p,.45,.55);
  const Wc=`{\\color{${hiW>.5?C.hi:CW}}\\omega}`;
  let q='';
  [[1,'0.5'],[2,'1.0'],[3,'2.0']].forEach(([i],k)=>{q+=fade(seg(p,.05+k*.1,.15+k*.1),T(`${KK}_${i}=\\tfrac12 m_${i}(${RR}_${i}${WW})^2=\\tfrac12 m_${i}${RR}_${i}^2${Wc}^2`,PC,135+k*62,30));});
  q+=fade(seg(p,.62,.72),line(PX+40,320,PX+PW-40,320,{color:C.faint,w:2})+label('全部 足す（ω² は 共通）',PC,355,{size:24,color:C.dim,anchor:'middle'}));
  const R=rowT([`${KK}=\\tfrac12`,`(\\textstyle\\sum_i m_i${RR}_i^2)`,`{\\color{${C.hi}}\\omega}^2`],PC,440,38,{gap:.1});
  q+=fade(seg(p,.72,.82),R.svg()+highlight(R.pos[1].x-R.pos[1].w/2-6,400,R.pos[1].w+12,70,seg(p,.82,.9)));
  s+=panel(86,422,q,1);
  return s+goalTag(G1);
 },
 // 4. かっこの中＝慣性モーメント I＝Σmᵢrᵢ²（定義）。図のおもりの上に空の枠（質量×距離²）
 [K+'define']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=massRod(0,{ticks:1,frames:seg(p,b,b+.1)});
  s+=fade(seg(p,b+.05,b+.15),label('質量 × 軸からの 距離²',330,105,{size:26,color:C.ink,anchor:'middle',weight:700}));
  let q=kindTag('定義',PC,128,{g:seg(p,.05,.15)});
  q+=fade(seg(p,.08,.2),T(`I=\\sum_i m_i${RR}_i^2`,PC,240,48)+highlight(PC-130,180,260,110,1));
  q+=fade(seg(p,.25,.35),T(`${KK}=\\tfrac12 I${WW}^2`,PC,350,40));
  q+=fade(seg(p,b,b+.1),label('各おもりの 質量×距離² を 足す',PC,435,{size:24,color:C.ink,anchor:'middle'}));
  s+=panel(90,380,q,1);
  return s+goalTag(G1);
 },
 // 5. 白い棒に 0.25・2・4 を入れ、積み上げて 6.25。答え B
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),e=W[0][1],b=W[1]?W[1][0]:.7;
  const g1=seg(p,.02,.18),g2=seg(p,.2,.38),g3=seg(p,.4,.58);
  let s=massRod(0,{ticks:1,frames:1,bars:[g1,g2,g3]});
  s+=label('質量 × 軸からの 距離²',330,105,{size:26,color:C.ink,anchor:'middle',weight:700});
  let q=fade(g1,T(`1\\times0.5^2=0.25`,PC-70,135,30))+fade(g2,T(`2\\times1.0^2=2`,PC-70,190,30))+fade(g3,T(`1\\times2.0^2=4`,PC-70,245,30));
  const st=seg(p,.62,e*.95),base=470,u=26,vals=[.25,2,4];let acc=0;
  vals.forEach((v,i)=>{const h=v*u*st;q+=rect(PX+390,base-acc-h,60,h,{fill:C.ink,fo:.75-.15*i,stroke:C.ink,rx:2});acc+=h;});
  q+=fade(seg(p,e*.85,e*.95),label('6.25',PX+420,base-6.25*u-14,{size:26,color:C.hi,anchor:'middle',weight:700}));
  q+=fade(seg(p,e*.8,e*.95),T(`I=6.25${KGM2}`,PC-70,350,34)+highlight(PX+30,310,300,76,1));
  s+=panel(86,422,q,1);
  return s+goalTag(G1)+ANS1(seg(p,b,b+.06));
 },
 // 6. 誤答 A → C
 [K+'wrong1']:(p,ctx)=>{
  let s=massRod(0,{ticks:1,frames:1,bars:[1,1,1]});
  s+=label('質量 × 軸からの 距離²',330,105,{size:26,color:C.ink,anchor:'middle',weight:700});
  s+=panel(90,150,label('小問1 の 式',PC,122,{size:22,color:C.dim,anchor:'middle'})+T(`I=\\sum m_i${RR}_i^2=6.25${KGM2}`,PC,190,32),1);
  s+=wrongSeq(p,ctx,[['A','4.5','0.5＋2＋2（2乗していない、kg·m）'],['C','16','4 kg を 全部 2.0 m に（4×2.0²）']],{opts:{...WOPT,y:262}});
  return s+goalTag(G1)+ANS1(1);
 },
 // 7. 誤答 D（真ん中から測った）→ 軸を黄の輪で「軸から測る」
 [K+'wrong1d']:(p,ctx)=>{
  const W=sentWin(ctx),e=W[0][1],b=W[1]?W[1][0]:.5;
  let s=massRod(0,{ticks:1,frames:1,bars:[1,1,1]});
  s+=label('質量 × 軸からの 距離²',330,105,{size:26,color:C.ink,anchor:'middle',weight:700});
  const mx=90+230,my=360;
  s+=fade(seg(p,.03,.1)*(1-seg(p,e-.04,e)),ring(mx,my,40,{color:C.a,w:3,dash:'6 5'})+label('1.0 m の 点から 測った',mx,my+135,{size:22,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,b,b+.08),ring(90,360,30,{color:C.hi,w:4})+label('軸から 測る',100,305,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=panel(90,150,label('小問1 の 式',PC,122,{size:22,color:C.dim,anchor:'middle'})+T(`I=\\sum m_i${RR}_i^2=6.25${KGM2}`,PC,190,32),1);
  s+=wrongCard('D','1.25','1.0 m の 点から 測った',{...WOPT,y:262,g:seg(p,.02,.07)});
  return s+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 [K+'goal2']:(p)=>{
  let s=uRod({g:seg(p,0,.12)});
  s+=panel(90,260,label('小問2',PC,140,{size:28,color:C.dim,anchor:'middle'})
   +label('一様な 棒の、端を 軸と した',PC,205,{size:28,color:C.hi,anchor:'middle',weight:700})
   +label('慣性モーメント I',PC,255,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s+goalTag(G2,{g:seg(p,.03,.15)});
 },
 // 9. 短い区間 dx に切る。1 m あたり 2 kg → dm＝2 dx
 [K+'slice']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=uRod({N:seg(p,.05,.2)>.5?12:0,hi:seg(p,.2,.3)>.5?7:-1});
  const x1=RX+1.75*RP,x2=RX+2*RP;
  s+=fade(seg(p,.2,.3),label('dx',(x1+x2)/2,RY-60,{size:28,color:GOLD,anchor:'middle',weight:700})+line((x1+x2)/2,RY-52,(x1+x2)/2,RY-16,{color:GOLD,w:2}));
  s+=fade(seg(p,.25,.35),arrow(RX,RY+125,x1,RY+125,{color:CR,w:4,head:14})+label('x',(RX+x1)/2,RY+115,{size:28,color:CR,anchor:'middle',weight:700}));
  let q=label('切れ目が ない',PC,135,{size:26,color:C.dim,anchor:'middle'})+fade(seg(p,.1,.2),label('→ 短い 区間 dx に 切る',PC,180,{size:28,color:GOLD,anchor:'middle',weight:700}));
  q+=fade(seg(p,b,b+.08),line(PX+40,215,PX+PW-40,215,{color:C.faint,w:2})+label('1 m あたり',PX+130,265,{size:26,color:C.ink,anchor:'middle'})+T(`\\dfrac{M}{${LL}}=\\dfrac{6}{3}=2\\ \\mathrm{kg/m}`,PX+340,260,32));
  {const e=`${DM}=\\dfrac{M}{${LL}}\\,${DX}=2\\,${DX}`,w=texWidth(e,40,false);q+=fade(seg(p,b+.2,b+.3),T(e,PC,380,40)+highlight(PC-w/2-14,330,w+28,100,1,GOLD));}
  s+=panel(90,380,q,1);
  return s+goalTag(G2);
 },
 // 10. 1切れの寄与 x² dm。Σ → ∫（0 から l）。切れを増やすと 17.7 → 17.9 → 18
 [K+'integral']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=uRod({N:12,hi:7});
  const x1=RX+1.75*RP,x2=RX+2*RP;
  s+=label('dx',(x1+x2)/2,RY-60,{size:28,color:GOLD,anchor:'middle',weight:700})+arrow(RX,RY+125,x1,RY+125,{color:CR,w:4,head:14})+label('x',(RX+x1)/2,RY+115,{size:28,color:CR,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.15),T(`${XX}^2\\,${DM}`,(x1+x2)/2,RY-110,32));
  s+=fade(seg(p,b+.15,b+.25),label('0',RX,RY+178,{size:28,color:CR,anchor:'middle',weight:700})+label('l',RX+3*RP,RY+178,{size:28,color:CR,anchor:'middle',weight:700})
   +line(RX,RY+150,RX,RY+20,{color:CR,w:2,dash:'5 5'})+line(RX+3*RP,RY+150,RX+3*RP,RY+20,{color:CR,w:2,dash:'5 5'}));
  let q=fade(1-seg(p,b,b+.08),T(`I=\\sum ${XX}^2\\,${DM}`,PC,150,40));
  q+=fade(seg(p,b,b+.08),T(`I=\\int_0^{${LL}} ${XX}^2\\,\\dfrac{M}{${LL}}\\,${DX}`,PC,160,40)+label('Σ → ∫（細かく 切って 足す）',PC,232,{size:22,color:C.dim,anchor:'middle'}));
  q+=fade(seg(p,b+.3,b+.4),line(PX+40,252,PX+PW-40,252,{color:C.faint,w:2})+label('切れの 数を 増やすと',PC,290,{size:24,color:C.dim,anchor:'middle'})
   +label('4本：約 17.7',PC,330,{size:26,color:C.ink,anchor:'middle'}));
  q+=fade(seg(p,b+.42,b+.5),label('8本：約 17.9',PC,375,{size:26,color:C.ink,anchor:'middle'}));
  q+=fade(seg(p,b+.52,b+.6),label('→ 18 に 近づく',PC,425,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=panel(90,380,q,1);
  return s+goalTag(G2);
 },
 // 11a. ∫₀ˡ x² dx＝l³/3（カット割り：図を消して式だけ）
 [K+'calc']:(p)=>calcScene(p,0),
 // 11b. I＝(M/l)×(l³/3)、l を約分して Ml²/3
 [K+'calc2']:(p)=>calcScene(p,1),
 // 12. 6×3²÷3＝18。答え A
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=uRod({N:12});
  let q=T(`I=\\dfrac{M${LL}^2}{3}`,PC,145,40);
  q+=fade(seg(p,.08,.18),T(`=\\dfrac{6\\times3^2}{3}`,PC,250,40));
  q+=fade(seg(p,.25,.35),T(`=18${KGM2}`,PC,355,42)+highlight(PC-150,315,300,76,1));
  s+=panel(90,330,q,1);
  return s+goalTag(G2)+ANS2(seg(p,b,b+.06));
 },
 // 13. 誤答 B（全部を先端に集めた 54）。本物の棒と比べて 1/3
 [K+'wrong2b']:(p)=>{
  let s=uRod({y:180,lab:0,g:1})+label('本物の 棒',RX+225,135,{size:24,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.15),line(RX,360,RX+450,360,{color:C.faint,w:4,dash:'8 6'})+axisDot(RX,360,0)+dot(RX+450,360,22,BODY)+label('6 kg を 全部 先端に',RX+225,320,{size:24,color:C.dim,anchor:'middle',weight:700}));
  const u=3,base=270;
  let q=fade(seg(p,.2,.3),rect(PX+90,base-54*u,70,54*u,{fill:C.ink,fo:.35,stroke:C.dim})+label('54',PX+125,base-54*u-10,{size:24,color:C.dim,anchor:'middle',weight:700})+label('先端に 集中',PX+125,base+28,{size:22,color:C.dim,anchor:'middle'}));
  q+=fade(seg(p,.35,.45),rect(PX+250,base-18*u,70,18*u,{fill:C.ink,fo:.75,stroke:C.ink})+label('18',PX+285,base-18*u-10,{size:24,color:C.ink,anchor:'middle',weight:700})+label('本物の 棒',PX+285,base+28,{size:22,color:C.ink,anchor:'middle'}));
  q+=fade(seg(p,.5,.6),label('1/3',PX+410,base-60,{size:34,color:C.hi,anchor:'middle',weight:700}));
  s+=panel(86,226,q,1);
  s+=wrongCard('B','54','Ml²（全部を 先端に 集めた）',{...WOPT,y:330,g:seg(p,.03,.1)});
  return s+goalTag(G2)+ANS2(1);
 },
 // 14. 誤答 C（真ん中の軸 4.5）：軸が真ん中へ動く影 → 誤答 D（∫x dm＝Ml/2＝9、単位 kg·m）
 [K+'wrong2cd']:(p,ctx)=>{
  const W=sentWin(ctx),wC=[0,W[0][1]],wD=[W[1]?W[1][0]:.5,1],inC=seg(p,.03,.08)*(1-seg(p,wC[1]-.04,wC[1]));
  const mv=seg(p,.12,.35);
  let s=uRod({N:12,ghostAxis:inC>.02?RX+225*mv:null});
  s+=fade(inC*mv,label('軸を 真ん中へ',RX+225,RY+130,{size:24,color:C.a,anchor:'middle',weight:700}));
  s+=panel(90,150,label('小問2 の 式',PC,122,{size:22,color:C.dim,anchor:'middle'})+T(`I=\\dfrac{M${LL}^2}{3}=18${KGM2}`,PC,192,32),1);
  s+=wrongSeq(p,ctx,[['C','4.5','Ml²/12（真ん中の 軸）'],['D','9','∫x dm＝Ml/2（単位 kg·m）']],{win:[wC,wD],opts:{...WOPT,y:262}});
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 // 15. 棒を ω＝2 rad/s で回す（実時間）。札「求めるもの」
 [K+'goal3']:(p,ctx)=>{
  const t=tAt(ctx,K+'goal3');
  let s=spinRod(2*t,{omega:1})+label('ω ＝ 2 rad/s',465,110,{size:26,color:CW,weight:700});
  s+=panel(90,260,label('小問3',PC,140,{size:28,color:C.dim,anchor:'middle'})
   +label('端を 軸に ω ＝ 2 rad/s で',PC,205,{size:28,color:C.hi,anchor:'middle',weight:700})
   +label('回すときの 運動エネルギー',PC,255,{size:28,color:C.hi,anchor:'middle',weight:700})+label('（I ＝ 18 kg·m²：小問2）',PC,315,{size:24,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.hi);
  return s+goalTag(G3,{g:seg(p,.03,.15)});
 },
 // 16. K＝½Iω²＝½×18×2²＝36 J。答え D
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6,t=tAt(ctx,K+'goal3');
  let s=spinRod(2*t,{omega:1})+label('ω ＝ 2 rad/s',465,110,{size:26,color:CW,weight:700});
  let q=T(`${KK}=\\tfrac12\\,I\\,${WW}^2`,PC-60,145,40);
  q+=fade(seg(p,.1,.2),label('I ＝ 18、ω ＝ 2',PC-60,215,{size:26,color:C.ink,anchor:'middle'}));
  q+=fade(seg(p,.22,.34),T(`=\\tfrac12\\times18\\times2^2`,PC-60,290,36));
  q+=fade(seg(p,.38,.5),T(`={\\color{${CK}}36\\ \\mathrm{J}}`,PC-60,380,42)+highlight(PC-160,340,200,76,1));
  const kb=seg(p,.4,.55);q+=rect(PX+400,470-144*kb,60,144*kb,{fill:CK,fo:.55,stroke:CK})+fade(kb,label('36 J',PX+430,470-144-12,{size:24,color:CK,anchor:'middle',weight:700}))+line(PX+380,470,PX+480,470,{color:C.dim,w:2});
  s+=panel(90,410,q,1);
  return s+goalTag(G3)+ANS3(seg(p,b,b+.06));
 },
 // 17. 誤答 A → B → C
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),e=W[0][1],wA=[0,e*.5],wB=[e*.5,e],wC=[W[1]?W[1][0]:e,1],t=tAt(ctx,K+'goal3');
  let s=spinRod(2*t,{omega:1})+label('ω ＝ 2 rad/s',465,110,{size:26,color:CW,weight:700});
  s+=panel(90,150,label('小問3 の 式',PC,122,{size:22,color:C.dim,anchor:'middle'})+T(`${KK}=\\tfrac12 I${WW}^2=\\tfrac12\\times18\\times2^2={\\color{${CK}}36\\ \\mathrm{J}}`,PC,190,30),1);
  s+=wrongSeq(p,ctx,[['A','72 J','½ を 落とした'],['B','18 J','ω² でなく ω（単位 kg·m²/s）'],['C','108 J','I＝54 を 使った']],{win:[wA,wB,wC],opts:{...WOPT,y:262}});
  return s+goalTag(G3)+ANS3(1);
 },

 // ===================== まとめ =====================
 [K+'summary']:(p)=>{
  let s='';
  const g1=seg(p,.02,.12),g2=seg(p,.18,.28),g3=seg(p,.36,.46);
  s+=card(20,90,370,330,'',g1)+card(415,90,370,330,'',g2)+card(810,90,370,330,'',g3,CK);
  // 1：3つのおもりの白い棒（合計 6.25）
  s+=fade(g1,massRod(0,{ax:55,ay:330,ppm:140,ticks:0,mlab:0,bars:[1,1,1],bscale:18,view:0})
   +T(`I=\\sum_i m_i${RR}_i^2`,205,140,30)+label('合計 6.25 kg·m²',205,400,{size:24,color:C.ink,anchor:'middle',weight:700}));
  // 2：dm に切った一様な棒
  s+=fade(g2,uRod({x0:470,y:250,ppm:95,N:12,hi:8,lab:0,h:22,axLab:0})+label('dm に 切る',600,170,{size:24,color:GOLD,anchor:'middle',weight:700})
   +T(`I=\\int ${RR}^2\\,${DM}`,600,330,32)+label('＝ 18 kg·m²',600,395,{size:24,color:C.ink,anchor:'middle',weight:700}));
  // 3：K＝½Iω²＝36 J
  s+=fade(g3,T(`${KK}=\\tfrac12 I${WW}^2`,995,190,36)+label('＝ 36 J',995,270,{size:30,color:CK,anchor:'middle',weight:700})+label('（ω ＝ 2 rad/s）',995,320,{size:22,color:C.dim,anchor:'middle'}));
  s+=fade(g2,arrow(392,255,412,255,{color:C.dim,w:3,head:10}))+fade(g3,arrow(787,255,807,255,{color:C.dim,w:3,head:10}));
  s+=fade(seg(p,.55,.65),label('I ＝ 質量 × 軸からの 距離² の 和',600,470,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=answerRow([[1,'B','6.25 kg·m²'],[2,'A','18 kg·m²'],[3,'D','36 J']],{g:seg(p,.8,.9),size:22});
  return s;
 },
};

// 小問2・3 の問題アニメ：棒が現れ（0〜2 s）、2〜4 s で一度回って止まる。小問3 は ω の札を足す
function q2fig(t,w){
 const a=2*Math.PI*clamp((t-2)/2);const ap=clamp(t/1.5);
 const still=t<2||t>=4;
 let s=spinRod(a,{cx:600,cy:290,ppm:70,g:ap});
 s+=fade(ap*(still?1:.0),label('M ＝ 6 kg',600+105,262,{size:26,color:C.ink,anchor:'middle',weight:700})+brace(600,810,310,{dir:1,color:CR,text:'l ＝ 3 m',size:26}));
 s+=fade(ap,label('一様な 細い 棒（上から 見た 図）',600,40,{size:24,color:C.dim,anchor:'middle'})+label('軸は 端を 通り、棒に 垂直',600,500,{size:24,color:C.dim,anchor:'middle'}));
 if(w)s+=fade(clamp((t-.5)/.6),rect(930,60,230,56,{fill:CW,fo:.12,stroke:CW,sw:2.5,rx:10})+label('ω ＝ 2 rad/s',1045,97,{size:28,color:CW,anchor:'middle',weight:700}));
 return s;
}
// 行11 の画面（図を消して式だけ）
function calcScene(p,k){
 let s=card(100,90,1000,415,'',1);
 s+=label('d(x³/3)/dx ＝ x²',600,135,{size:28,color:C.hi,anchor:'middle',weight:700});
 s+=fade(k?1:seg(p,.3,.45),T(`\\int_0^{${LL}} ${XX}^2\\,${DX}=\\dfrac{${LL}^3}{3}`,600,215,44));
 if(k){
  const cn=seg(p,.4,.5);
  const lc=cn>.5?`{\\color{${C.a}}\\cancel{\\color{${CR}}l}}`:LL;
  s+=fade(seg(p,.05,.15),T(`I=\\dfrac{M}{${lc}}\\times\\dfrac{${LL}^3}{3}`,470,340,44));
  s+=fade(seg(p,.4,.5),label('l³ ÷ l ＝ l²',470,445,{size:26,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.72),T(`=\\dfrac{M${LL}^2}{3}`,800,340,46)+highlight(720,290,160,100,1));
 }
 return s+goalTag(G2);
}

// 問題編 解説「990 Hz のサイレンが通り過ぎる」(ys-qx-hs-w-doppler-2) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/303_ドップラー効果.md の q-hs-w-doppler-2（解説 20 行）。
// 出題中の図に合わせ、車は左から右へ進み、聞き手は道の上に止まって立つ（通過後は車の後方＝左）。
// 色（01_共通の約束）：波長 λ 水色、周期 T・時間 金、振動数 f 桃、速さ V・vs 紫（山の進み VT も紫）、車の進み vsT 赤、強調 黄。
// 円の図は、車の速さを 0.25V に大げさに描く（注記を出す）。コマ送りの1次元の図は実際の比 34/340 で描く。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない（まとめの答えの札は除く）。
// 見た目は q-hs-w-doppler-1 の図にそろえ、その部品（門の図）と元の単元動画の部品を読み込んで使う（それらのファイルは編集しない）。
import {C,seg,lin,fade,label,line,rect,dot,arrow,tex,clamp,draw} from './anim.mjs';
import {T2,LC,TCOL,FC,VCOL,Tt,ft,HZ,SS,MM,SC,WF,Vt,vst,fp,eqRow,LB,listener,fronts,crestEdges,plate,dbl,siren} from './yt1-hs-w-doppler-1-diagrams.mjs';
import {gate} from './yt1-qx-hs-w-doppler-1-diagrams.mjs';
import {card,goalTag,answerTag,answerRow,wrongSeq,wrongCard,note,tAt,cueT,sentWin} from './yt1-qx-common.mjs';

const K='qx-hs-w-doppler-2:';
const BAD='#ff6b6b';
const G1='後方の波長 λ後',G2='遠ざかるときの f′',G3='振動数の変わり方';
const A1=g=>answerTag(1,'B','0.38 m',{g}),A2=g=>answerTag(2,'D','900 Hz',{g}),A3=g=>answerTag(3,'A','',{g});
const s2=(ctx,d=.5)=>{const W=sentWin(ctx);return W[1]?W[1][0]:d;};
// 答えの札：最初の文（「小問n の答えは X です。」）を言い終える所で出す
const ansG=(p,ctx)=>{const e=sentWin(ctx)[0][1]*.85;return seg(p,e,e+.05);};
let CLIP=0;const clipTo=(x,y,w,h,svg)=>{const id=`qxd2c${CLIP++}`;return `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#${id})">${svg}</g>`;};

// ---- 道（横長）--------------------------------------------------------------------------------------
const RQ={y:300,road:345,lx:420};
function road(y=RQ.road,{x0=40,x1=1160,g=1}={}){let s=line(x0,y,x1,y,{color:C.dim,w:3});for(let x=x0+20;x<x1;x+=90)s+=line(x,y+14,x+40,y+14,{color:C.faint,w:3});return fade(g,s);}
const standing=(x=RQ.lx,{g=1,lab=1,still=1}={})=>fade(g,listener(x,RQ.road-104,{lab:''})+(lab?label('聞き手',x,RQ.road+52,{size:24,color:C.dim,anchor:'middle',weight:700}):'')+(still?label('止まっている',x,RQ.road+86,{size:24,color:C.dim,anchor:'middle'}):''));
// 車の上の 990 Hz、前の右向きの紫の矢印と 34 m/s
function setupLabels(xs,g=1){
 return fade(g,plate('990 Hz',xs,RQ.y-58,{size:28,color:FC})+arrow(xs+64,RQ.y,xs+180,RQ.y,{color:VCOL,w:5,head:16})+plate('34 m/s',xs+122,RQ.y-34,{size:26,color:VCOL}));
}
const topCards=(g=1)=>card(240,90,380,62,label('近づく間は 1100 Hz',430,132,{size:28,color:FC,anchor:'middle',weight:700}),g,FC)
 +card(660,90,300,62,label('V ＝ 340 m/s',810,132,{size:28,color:VCOL,anchor:'middle',weight:700}),g,VCOL);
// ---- 円の図：車は右へ（大げさに 0.25V）、聞き手は左（車の後方）------------------------------------------
const WQ={y:RQ.y,Vd:150,Td:.55,k:.25};
const qX=(t,xs0)=>xs0+WQ.k*WQ.Vd*t;
const exagg=(g=1)=>plate('（図は、車の速さを 大げさに 描いています）',600,505,{size:22,color:C.dim,weight:400,g});
const XS_STOP=840;
function waveScene(t,{xs0=XS_STOP,g=1,circles=1,back=0,nt=1}={}){
 let s=road();
 s+=circles>0?fronts(t,{o:WQ,k:WQ.k,xs0,g:circles}):'';
 s+=standing(RQ.lx,{lab:0,still:0});
 s+=siren(qX(t,xs0),RQ.y,{lab:''});
 if(back){const e=crestEdges(t,{o:WQ,k:WQ.k,xs0,side:-1,count:2}).sort((a,b)=>a-b);
  if(e.length===2)s+=fade(back,dbl(e[0],e[1],RQ.y+112,LC)+plate('広がる',(e[0]+e[1])/2,RQ.y+152,{color:LC}));}
 if(nt)s+=exagg(nt);
 return fade(g,s);
}
// ---- コマ送り（実際の比 vs/V＝34/340）。山1は左の聞き手へ、車は右へ ------------------------------------
const FQ={y:370,x0:820,VT:640,k:34/340};
function frameB({u=1,c2=0,vt=0,vs=0,gap=0,nums=0,g=1,t0=0,gapHi=0}={}){
 const X0=FQ.x0,yA=FQ.y,xc=X0-FQ.VT*u,xs=X0+FQ.k*FQ.VT*u,ya=yA-130,yb=yA+86;
 let s=line(40,yA+46,1160,yA+46,{color:C.faint,w:2});
 s+=line(xc,yA-80,xc,yA+40,{color:WF,w:6})+label('山1',xc,yA-92,{size:26,color:WF,anchor:'middle',weight:700});
 if(c2)s+=fade(c2,line(xs,yA-80,xs,yA+40,{color:WF,w:6})+label('山2',xs+36,yA-92,{size:26,color:WF,anchor:'middle',weight:700}));
 s+=siren(xs,yA,{lab:'',s:.7});
 s+=dot(X0,yA+46,7,C.dim);
 if(t0)s+=fade(t0,label('時刻 0 に 出した 場所',X0,yA+86,{size:24,color:TCOL,anchor:'middle',weight:700}));
 if((vt||vs)&&u>.01)s+=line(X0,ya-14,X0,ya+14,{color:C.dim,w:2});
 if(vt&&u>.01){s+=arrow(X0,ya,xc,ya,{color:VCOL,w:5,head:16,g:vt});
  s+=fade(vt*seg(u,.6,.9),nums?label('0.343 m',(X0+xc)/2,ya-16,{size:28,color:VCOL,anchor:'middle',weight:700}):tex(`${Vt}${Tt}`,(X0+xc)/2,ya-26,{size:36}));}
 if(vs&&u>.01){s+=arrow(X0,ya,xs,ya,{color:SC,w:5,head:12,g:vs});
  s+=fade(vs*seg(u,.6,.9),nums?label('0.034 m',xs+12,ya-16,{size:26,color:SC,anchor:'middle',weight:700}):tex(`{\\color{${SC}}v_s}${Tt}`,(X0+xs)/2+8,ya-26,{size:32}));}
 if(gap){s+=fade(gap,dbl(xc,xs,yb,LC,{w:4+4*gapHi,head:14}));
  s+=fade(gap,nums?label('0.38 m',(xc+xs)/2,yb+40,{size:30,color:LC,anchor:'middle',weight:700}):eqRow(LB,(xc+xs)/2,yb+34,{size:40}));}
 s+=listener(90,yA-40,{lab:'',s:.75})+label('聞き手',90,yA+86,{size:24,color:C.dim,anchor:'middle',weight:700});
 return fade(g,s);
}
// ---- 物差し（行6・7）---------------------------------------------------------------------------------
function rulers(p,{hiRed=0}={}){
 const P=2400,x0=120,a=340/990*P,b=374/990*P;
 let s='';
 s+=fade(seg(p,.03,.18),label('止まっていれば ≈ 0.34 m',x0,126,{size:28,color:C.dim,weight:700})+dbl(x0,x0+a,160,C.dim,{w:4}));
 s+=fade(seg(p,.3,.45),label('車の 後方 ≈ 0.38 m',x0,222,{size:28,color:LC,weight:700})+dbl(x0,x0+b,256,LC,{w:5}));
 s+=fade(seg(p,.3,.45),line(x0,140,x0,276,{color:C.faint,w:2,dash:'6 6'})+line(x0+a,170,x0+a,240,{color:SC,w:2,dash:'5 5'}));
 s+=fade(seg(p,.5,.65),line(x0+a,206,x0+b,206,{color:SC,w:8+6*hiRed})+label('車の 進み 0.034 m',x0+b,300,{size:26,color:SC,anchor:'end',weight:700}));
 return s;
}
// ---- 聞き手の手前の山の列（q-hs-w-doppler-1 と同じ作り。山は左へ流れる）--------------------------------------
const WIN={x:150,L:940,y:340,sp:940/24};
function crestRow(sh,{bracket=1,mark=0,g=1}={}){
 const {x,L,y,sp}=WIN;let s=line(60,y+60,1180,y+60,{color:C.faint,w:2});
 for(let i=1;i<=30;i++){const X=x+sp*i-sh;if(X<60||X>1180)continue;
  const inW=x+sp*i<=x+L+1,passed=X<x-2,isM=i===24;
  const col=isM&&mark?C.hi:WF,op=passed?.35:inW?1:.4;
  s+=fade(op,line(X,y-60,X,y+50,{color:col,w:isM&&mark?7:4}));}
 s+=listener(x-50,y-40,{lab:'',s:.8})+label('聞き手',x-50,y+90,{size:24,color:C.dim,anchor:'middle',weight:700});
 if(bracket){s+=fade(bracket,line(x,y-110,x,y+60,{color:VCOL,w:2,dash:'6 6'})+line(x+L,y-110,x+L,y+60,{color:VCOL,w:2,dash:'6 6'})+dbl(x,x+L,y-90,VCOL,{w:4,head:14}));
  s+=plate('聞き手の 手前 340 m',x+L/2,y-104,{size:28,color:VCOL,g:bracket});}
 if(mark)s+=fade(mark,label('340 m 先に いた 山',Math.max(x+sp*24-sh,x+40),y+128,{size:24,color:C.hi,anchor:'middle',weight:700}));
 return fade(g,s);
}
// ---- 振動数のグラフ（行15〜20）。横軸 時刻 t（金）、縦軸 聞こえる振動数 f′（桃）。u＝−1〜1、通過は u＝0 ----------
const mkG=(x,base,w,h)=>({x,base,w,h,fmin:850,fmax:1150});
const gY=(G,f)=>G.base-G.h*(f-G.fmin)/(G.fmax-G.fmin),gX=(G,u)=>G.x+G.w*(u+1)/2;
function graph(G,{g=1,trace=0,ue=1,step200=0,ghost=null,ghostG=0,smooth=0,size=24}={}){
 let s=line(G.x,G.base,G.x+G.w+20,G.base,{color:C.dim,w:3})+line(G.x,G.base,G.x,G.base-G.h-10,{color:C.dim,w:3});
 s+=label('時刻 t',G.x+G.w+20,G.base+34,{size,color:TCOL,anchor:'end',weight:700})+label('聞こえる 振動数 f′',G.x+12,G.base-G.h-14,{size,color:FC,weight:700});
 s+=line(G.x,gY(G,990),G.x+G.w,gY(G,990),{color:C.dim,w:2,dash:'6 8'})+label('990',G.x-10,gY(G,990)+8,{size:22,color:C.dim,anchor:'end'});
 s+=line(gX(G,0),G.base,gX(G,0),G.base-G.h,{color:C.faint,w:2,dash:'4 6'})+label('通過',gX(G,0),G.base+30,{size:22,color:C.dim,anchor:'middle'});
 if(trace){const e=Math.max(-1,Math.min(1,ue)),c=FC,w=5;let t='';
  t+=line(gX(G,-1),gY(G,1100),gX(G,Math.min(0,e)),gY(G,1100),{color:c,w});
  if(e>=0)t+=line(gX(G,0),gY(G,1100),gX(G,0),gY(G,900),{color:c,w})+line(gX(G,0),gY(G,900),gX(G,e),gY(G,900),{color:c,w});
  t+=label('1100',G.x-10,gY(G,1100)+8,{size:22,color:FC,anchor:'end',weight:700})+(e>=0?label('900',G.x-10,gY(G,900)+8,{size:22,color:FC,anchor:'end',weight:700}):'');
  s+=fade(trace,t);}
 if(step200)s+=fade(step200,arrow(gX(G,0)+40,gY(G,1100)+4,gX(G,0)+40,gY(G,900)-4,{color:C.hi,w:4,head:12})+plate('200 Hz',gX(G,0)+60,(gY(G,1100)+gY(G,900))/2+9,{size:26,color:C.hi,anchor:'start'}));
 if(ghost&&ghostG){const pts=[];for(let u=-1;u<=1.0001;u+=.01)pts.push([gX(G,u),gY(G,ghost(u))]);s+=fade(ghostG,draw(pts,1,{color:C.dim,w:4,dash:'8 8'}));}
 if(smooth){const d=.07,f=u=>990*340/(340-34*(-u/Math.hypot(u,d)));const pts=[];for(let u=-1;u<=1.0001;u+=.005)pts.push([gX(G,u),gY(G,f(u))]);s+=fade(smooth,draw(pts,1,{color:C.hi,w:3,dash:'6 7'}));}
 return fade(g,s);
}
// 誤答の形（灰色の点線）：B だんだん上がる／C 990 へ戻る／D 通過の瞬間だけ高い
const ghostB=u=>u<0?990+110*(1+u)**2:1100-200*Math.min(1,u*6);
const ghostC=u=>u<0?1100:990+110*Math.exp(-u*5);
const ghostD=u=>990+110*Math.exp(-((u/.06)**2));
// ---- 通過の場面（上半分。円は上半分の中だけ）。車は左から右へ、u＝−1〜1 -----------------------------------------
const PQ={y:180,Vd:300,Td:.3,k:.25,lx:600};
const passX=t=>200+PQ.k*PQ.Vd*t;            // 75 px/s。t≈5.33 s で聞き手の前を通る
const passU=t=>clamp((passX(t)-600)/400,-1,1);
function passScene(t,{g=1,gapLab=1}={}){
 const o={y:PQ.y,Vd:PQ.Vd,Td:PQ.Td},xs=passX(t);
 let s=clipTo(40,84,1120,180,fronts(t,{o,k:PQ.k,xs0:200,tmin:-3,w:2}));
 s+=line(40,236,1160,236,{color:C.dim,w:3});
 s+=listener(PQ.lx,236-80,{lab:'',s:.75})+siren(xs,PQ.y+20,{lab:'',s:.75});
 if(gapLab){const ahead=xs<PQ.lx,sp=PQ.Vd*PQ.Td*(ahead?1-PQ.k:1+PQ.k);
  s+=dbl(PQ.lx-sp/2,PQ.lx+sp/2,254,LC,{w:4,head:10})+plate(ahead?'詰まった 間隔':'広い 間隔',PQ.lx+(ahead?-170:170),262,{size:24,color:LC});}
 s+=plate('（図は、車の速さを 大げさに 描いています）',930,110,{size:22,color:C.dim,weight:400});
 return fade(g,s);
}
const GB=mkG(200,462,800,140);      // 下半分のグラフ（行15・16）
const GT=mkG(200,300,800,180);      // 上に置くグラフ（行17〜19。誤答カードはその下）
// f′ ＝ f × V/(V±vs)（分母の ± を光らせる）
const fForm=(sign,hl=0)=>`${fp}=${ft}\\times\\dfrac{${Vt}}{${Vt}{\\color{${hl?C.hi:C.ink}}${sign}}${vst}}`;

export const qxHsWDoppler2Diagrams={
 // ================= 問題アニメ：出題中（小問1〜3 共通、約7秒＋静止）=================
 // 道、左から右へ進むサイレンの車（990 Hz 桃、右向きの紫の矢印と 34 m/s）、道の上に止まって立つ聞き手。
 // 車は聞き手に近づき、すぐそばを通り過ぎ、聞き手が車の後方になった所で止まる。上に「近づく間は 1100 Hz」「V＝340 m/s」。
 // 山の円・後方の波長・振動数のグラフは描かない。
 [K+'q0']:(p)=>{
  const xs=110+(XS_STOP-110)*(1-(1-clamp(p/.92))**1.6);
  let s=road()+standing()+siren(xs,RQ.y,{lab:''})+setupLabels(xs);
  s+=topCards();
  return s;
 },
 // ================= S1 小問1：後方の波長 =================
 // 1. 出題中の図から始め、車から山の円が広がる。後方（左）で間隔が広がる
 [K+'setup']:(p)=>{
  const tw=5*p,o=seg(p,.25,.4),xs=qX(tw,XS_STOP);
  let s=waveScene(tw,{circles:o,back:seg(p,.68,.8),nt:o});
  s+=setupLabels(xs,1-o)+topCards(1-seg(p,.2,.35));
  s+=fade(1-o,label('聞き手',RQ.lx,RQ.road+52,{size:24,color:C.dim,anchor:'middle',weight:700})+label('止まっている',RQ.lx,RQ.road+86,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(o,plate('聞き手（車の 後方）',RQ.lx,RQ.y-130,{size:24,color:C.dim}));
  return s;
 },
 // 2. 求めるもの：後方の波長。コマ送りの1次元の図へ。T＝1/990 s、山1
 [K+'goal1']:(p,ctx)=>{
  const b=s2(ctx);
  let s=frameB({u:0,t0:seg(p,b+.15,b+.3)});
  s+=card(40,90,330,92,T2(`${Tt}=\\dfrac{1}{990}${SS}`,205,140,{size:36}),seg(p,b,b+.12),TCOL);
  s+=fade(seg(p,b+.2,b+.35),plate('山1 を 出す',FQ.x0+80,FQ.y-130,{size:26,color:WF}));
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 3. 1周期のあいだに、山1は後方へ VT、車は前方へ vsT 進んで、山2を出す
 [K+'adv']:(p)=>{
  const u=lin(p,.12,.62);
  let s=frameB({u,vt:seg(p,.08,.2),vs:seg(p,.3,.45),c2:seg(p,.68,.82)});
  s+=card(40,90,330,92,T2(`${Tt}=\\dfrac{1}{990}${SS}`,205,140,{size:36}),1-seg(p,0,.1),TCOL);
  s+=card(900,90,260,62,label(`時間 ${u<.999?'…':'T'}`,1030,132,{size:28,color:TCOL,anchor:'middle',weight:700}),seg(p,0,.1),TCOL);
  s+=fade(seg(p,.62,.75),label('VT ＝ 山1が 進んだ 距離',40,505,{size:24,color:VCOL,weight:700})+label('vsT ＝ 車が 進んだ 距離',1160,505,{size:24,color:SC,anchor:'end',weight:700}));
  s+=goalTag(G1);
  return s;
 },
 // 4. 先の山（山1）は聞き手へ、次の山を出す車は反対へ進むので、間隔は和（PQ-039 の修正後。2文目は次の cue sumEq）
 [K+'sum']:(p)=>{
  let s=frameB({vt:1,vs:1,c2:1,gap:seg(p,.05,.2)});
  const out=1-seg(p,.94,1),gL=seg(p,.06,.14)*out,gR=seg(p,.3,.38)*out;
  s+=fade(gL,label('先の 山（山1）は 聞き手へ',40,172,{size:24,color:VCOL,weight:700})+arrow(330,192,150,192,{color:VCOL,w:5,head:14}));
  s+=fade(gR,label('車は 反対へ',1150,172,{size:24,color:SC,anchor:'end',weight:700})+arrow(910,192,1080,192,{color:SC,w:5,head:14}));
  s+=fade(seg(p,.55,.63)*out,label('→ 間隔は 和',600,150,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=goalTag(G1);
  return s;
 },
 // 4b. λ後＝VT＋vsT → T を光らせて ＝(V＋vs)T
 [K+'sumEq']:(p)=>{
  let s=frameB({vt:1,vs:1,c2:1,gap:1});
  const tT=seg(p,.3,.36)>.5?C.hi:TCOL,sw=.5;
  s+=card(420,86,740,96,fade(1-seg(p,sw,sw+.04),eqRow([...LB,`=${Vt}{\\color{${tT}}T}+${vst}{\\color{${tT}}T}`],790,134,{size:40}))+fade(seg(p,sw+.04,sw+.12),eqRow([...LB,`=(${Vt}+${vst})${Tt}`],790,134,{size:40})),seg(p,0,.1),LC);
  s+=goalTag(G1);
  return s;
 },
 // 5. T＝1/f を代入 → λ後＝(V＋vs)/f → (340＋34)/990＝374/990≈0.38 m。図の文字が数に変わる
 [K+'num']:(p,ctx)=>{
  const b=s2(ctx,.4),o3=seg(p,b+.3,b+.4);
  let s=frameB({vt:1,vs:1,c2:1,gap:1,nums:o3>.5?1:0});
  let eq=fade(1-seg(p,.04,.09),eqRow([...LB,`=(${Vt}+${vst})${Tt}`],790,134,{size:38}));
  eq+=fade(seg(p,.06,.12)*(1-seg(p,b-.04,b)),eqRow([...LB,`=\\dfrac{${Vt}+${vst}}{${ft}}`],790,134,{size:36}));
  eq+=fade(seg(p,b,b+.08),eqRow([...LB,`=\\dfrac{340+34}{990}=\\dfrac{374}{990}\\approx 0.38${MM}`],790,134,{size:34}));
  s+=card(420,86,740,96,eq,1,LC);
  s+=fade(seg(p,.04,.12)*(1-seg(p,b-.04,b)),label('T＝1/f を 代入',290,140,{size:24,color:TCOL,anchor:'middle',weight:700}));
  s+=goalTag(G1);
  return s;
 },
 // 6. 小問1 の答え B。止まっていれば ≈0.34 m → 後方 ≈0.38 m（物差しを上下に）
 [K+'ans1']:(p,ctx)=>{
  const b=s2(ctx);
  let s=fade(1-seg(p,b-.02,b+.05),frameB({vt:1,vs:1,c2:1,gap:1,nums:1,gapHi:seg(p,.05,.2)}));
  s+=rulers(lin(p,b+.02,1));
  s+=goalTag(G1)+A1(ansG(p,ctx));
  return s;
 },
 // 7a. 誤答 C（波長は変わらない）
 [K+'wrongC1']:(p)=>{
  let s=rulers(1);
  s+=wrongCard('C','0.34 m','音源が 動いても 波長は 変わらない、と した',{g:seg(p,.03,.1)});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // 7b. 誤答 A（V−vs、前方の波長）→ D（1周期に車が進む距離）。1枚ずつ。D の間、赤い太線を点滅
 [K+'wrongAD1']:(p,ctx)=>{
  const W=sentWin(ctx),ve=W[W.length-1][1],mid=ve*.5;
  const inD=seg(p,mid,mid+.03),bl=inD*(.5+.5*Math.sin(cueT(ctx)*7));
  let s=rulers(1,{hiRed:bl});
  s+=wrongSeq(p,ctx,[['A','0.31 m','後方なのに V−vs（前方の 波長）'],['D','0.034 m','車が 1周期に 進む 距離']],{win:[[0,mid],[mid,1]]});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // ================= S2 小問2：遠ざかるときの振動数 =================
 // 8a. 求めるもの：f′。門の図（山が左へ流れて門を通る）
 [K+'gate0']:(p,ctx)=>{
  let s=gate(tAt(ctx,K+'gate0'),{sp:60,y:310});
  s+=goalTag(G2,{g:seg(p,.05,.2)});
  return s;
 },
 // 8b. 後方でも、山が聞き手を通る速さは V＝340 m/s のまま
 [K+'gate']:(p,ctx)=>{
  let s=gate(tAt(ctx,K+'gate0'),{sp:60,y:310});
  s+=arrow(700,140,500,140,{color:VCOL,w:6,head:18,g:seg(p,.05,.18)})+fade(seg(p,.05,.18),label('V ＝ 340 m/s の まま',730,150,{size:30,color:VCOL,weight:700}));
  s+=fade(seg(p,.3,.45),label('山の 間隔 ≈ 0.38 m',800,450,{size:28,color:LC,anchor:'middle',weight:700})+label('（動きは ゆっくり 描いています）',800,495,{size:22,color:C.dim,anchor:'middle'}));
  s+=goalTag(G2);
  return s;
 },
 // 9. 1秒の間に通る山 ＝ 聞き手の手前 340 m までにある山
 [K+'window']:(p)=>{
  const u=lin(p,.5,.92),sh=WIN.L*u;
  let s=crestRow(sh,{bracket:seg(p,.18,.32),mark:seg(p,.4,.5)});
  s+=fade(seg(p,.03,.15),arrow(780,140,580,140,{color:VCOL,w:6,head:18})+label('山は 1秒に 340 m 進む',800,150,{size:28,color:VCOL,weight:700}));
  s+=card(30,96,190,60,label(u<.999?`時間 ${u<.01?'0':'…'}`:'1秒後',125,136,{size:28,color:TCOL,anchor:'middle',weight:700}),seg(p,.45,.52),TCOL);
  s+=fade(seg(p,.9,.97),plate('340 m の 中の 山が 全部 通った',600,505,{size:26,color:C.hi}));
  s+=goalTag(G2);
  return s;
 },
 // 10. 340 m の中に ≈0.38 m おき → 丸める前の値で割って 900 個
 [K+'count']:(p,ctx)=>{
  const b=s2(ctx);
  let s=crestRow(0,{bracket:1,mark:0});
  const x1=WIN.x+WIN.sp*3,x2=WIN.x+WIN.sp*4;
  s+=fade(seg(p,.05,.2),dbl(x1,x2,WIN.y+96,LC,{w:4,head:12})+label('≈ 0.38 m',(x1+x2)/2,WIN.y+136,{size:28,color:LC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.05,.2),label('（山の 数は 省略して 描いています）',850,WIN.y+136,{size:22,color:C.dim,anchor:'middle'}));
  s+=card(240,86,420,104,T2(`340\\div\\dfrac{374}{990}=900`,450,140,{size:36}),seg(p,b,b+.1),FC);
  s+=fade(seg(p,b+.1,b+.2),label('（0.38 は 丸めた 値。丸める前の 374/990 m で 割る）',600,505,{size:22,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,b+.2,b+.3),plate('1秒に 900個 の 山が 聞き手を 通る',930,146,{size:26,color:FC}));
  s+=goalTag(G2);
  return s;
 },
 // 11. 式 f′＝f×V/(V＋vs)＝990×340/374 → 340/374 を 34 で約分して 10/11 → 900 Hz
 [K+'formula']:(p,ctx)=>{
  const b=s2(ctx);
  let s=card(150,86,900,124,T2(fForm('+'),600,160,{size:44}),seg(p,.03,.12),C.hi);
  s+=card(150,226,900,124,T2(`=990\\times\\dfrac{340}{374}`,600,290,{size:42}),seg(p,.2,.3),FC);
  const c1=seg(p,b,b+.06),c2=seg(p,b+.1,b+.16),c3=seg(p,b+.26,b+.32);
  s+=card(150,366,900,124,fade(c1*(1-c3),T2(c2>.5?`\\dfrac{340}{374}=\\dfrac{\\cancel{34}\\times 10}{\\cancel{34}\\times 11}=\\dfrac{10}{11}`:`\\dfrac{340}{374}=\\dfrac{34\\times 10}{34\\times 11}`,600,430,{size:38}))
   +fade(c3,T2(`990\\times\\dfrac{10}{11}=900${HZ}`,600,430,{size:42})),c1,FC);
  s+=fade(c2*(1-c3),label('34 で 約分',1062,438,{size:24,color:C.hi,weight:700}));
  s+=goalTag(G2);
  return s;
 },
 // 12. 小問2 の答え D。誤答 B（990 Hz のまま）
 [K+'ans2']:(p,ctx)=>{
  const b=s2(ctx);
  let s=card(250,96,700,116,T2(`990${HZ}\\ \\rightarrow\\ 900${HZ}`,600,162,{size:48}),seg(p,.02,.12),FC);
  s+=label('サイレンの 振動数',430,250,{size:24,color:C.dim,anchor:'middle',opacity:seg(p,.05,.15)})+label('聞こえる 振動数',780,250,{size:24,color:FC,anchor:'middle',opacity:seg(p,.05,.15)});
  s+=wrongCard('B','990 Hz','1秒に 届く 山の 数が 減った ことを 見落とした',{g:seg(p,b,b+.05)});
  s+=goalTag(G2)+A2(ansG(p,ctx));
  return s;
 },
 // 13. 近づく間：990×340/306＝990×10/9＝1100 Hz（問題文の値）と、遠ざかる：990×340/374＝900 Hz。誤答 A
 [K+'two']:(p,ctx)=>{
  const b=s2(ctx),hl=seg(p,.25,.35);
  const L=(cx,head,sign,sub,col,o)=>card(cx-280,86,560,248,
   label(head,cx,128,{size:28,color:col,anchor:'middle',weight:700})+T2(fForm(sign,hl),cx,196,{size:36})+fade(o,T2(sub,cx,282,{size:32})),1,col);
  let s=fade(seg(p,.02,.1),L(310,'近づく 間','-',`990\\times\\dfrac{340}{306}=990\\times\\dfrac{10}{9}=1100${HZ}`,C.dim,seg(p,.08,.2)));
  s+=fade(seg(p,.12,.2),L(890,'遠ざかる','+',`990\\times\\dfrac{340}{374}=900${HZ}`,FC,seg(p,.18,.26)));
  s+=fade(seg(p,.3,.4)*(1-seg(p,b-.02,b)),label('1100 Hz は 問題文の 値',310,380,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=wrongCard('A','1100 Hz','遠ざかる ときにも V−vs を 使った',{g:seg(p,b,b+.05)});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // 14. 誤答 C（990−34＝956）
 [K+'wrongC']:(p)=>{
  let s=fade(.4,card(30,86,560,248,label('近づく 間',310,128,{size:28,color:C.dim,anchor:'middle',weight:700})+T2(`990\\times\\dfrac{340}{306}=1100${HZ}`,310,230,{size:34}),1,C.dim)
   +card(610,86,560,248,label('遠ざかる',890,128,{size:28,color:FC,anchor:'middle',weight:700})+T2(`990\\times\\dfrac{340}{374}=900${HZ}`,890,230,{size:34}),1,FC));
  s+=wrongCard('C','956 Hz','Hz から m/s を 引いた',{mid:`990-34=956`,midSize:32,g:seg(p,.03,.1)});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // ================= S3 小問3：振動数の変わり方 =================
 // 15. 求めるもの。上半分で車が近づき通過（聞き手の側の間隔が、詰まった間隔から広い間隔へ）。下半分にグラフの軸
 [K+'pass']:(p,ctx)=>{
  const t=tAt(ctx,K+'pass');
  let s=passScene(t,{gapLab:seg(p,.1,.2)>0?1:0,g:seg(p,0,.06)});
  s+=graph(GB,{g:seg(p,.15,.3)});
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 16. 速さが一定 → 近づく間 1100、通過後 900。通過の瞬間に 200 Hz 下がる（車の動きに合わせて線を引く）
 [K+'step']:(p,ctx)=>{
  const t=Math.max(0,cueT(ctx)-.3),b=s2(ctx);
  let s=passScene(t);
  s+=graph(GB,{trace:1,ue:passU(t),step200:seg(p,b+.05,b+.15)*(passU(t)>0?1:0)});
  s+=goalTag(G3);
  return s;
 },
 // 17. 小問3 の答え A。誤答 B（だんだん上がる）の形を灰色の点線で一瞬重ね、×
 [K+'ans3']:(p,ctx)=>{
  const b=s2(ctx),gh=seg(p,b+.05,b+.15);
  let s=graph(GT,{trace:1,ue:1,ghost:ghostB,ghostG:gh});
  s+=fade(gh,label('×',GT.x+GT.w*.38,gY(GT,1080),{size:56,color:BAD,anchor:'middle',weight:700}));
  s+=wrongCard('B','だんだん 上がる','一定の 速さなら、高さも 一定',{g:seg(p,b,b+.05)});
  s+=goalTag(G3)+A3(ansG(p,ctx));
  return s;
 },
 // 18. 誤答 C（990 Hz へ戻る）→ D（通過の瞬間だけ高い）。1枚ずつ。形を灰色の点線で
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,gc=seg(p,.03,.1)*(1-seg(p,b-.04,b)),gd=seg(p,b+.01,b+.06);
  let s=graph(GT,{trace:1,ue:1,ghost:ghostC,ghostG:gc})
  if(gd>0){const pts=[];for(let u=-1;u<=1.0001;u+=.01)pts.push([gX(GT,u),gY(GT,ghostD(u))]);s+=fade(gd,draw(pts,1,{color:C.dim,w:4,dash:'8 8'}));}
  s+=wrongSeq(p,ctx,[['C','990 Hz へ 戻る','遠ざかると 元より 低い'],['D','通過の 瞬間だけ 高い','高さは 距離で なく 速さで 決まる']]);
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 19. 実際の道路の脇では、段差の角が丸くなる（形だけ）
 [K+'real']:(p)=>{
  let s=graph(GT,{trace:1,ue:1,smooth:seg(p,.15,.35)});
  s+=fade(seg(p,.3,.45),label('（実際の 道路の 脇で、形だけ）',GT.x+GT.w*.72,gY(GT,1060),{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.45),label('横を 通るので、短い 時間で なめらかに 下がる',600,400,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // ================= S4 まとめ =================
 // 20. 前方（λ前≈0.31 m、1100 Hz）と後方（λ後≈0.38 m、900 Hz）を左右に。下に段差のグラフ。答えの札を横に並べる
 [K+'wrap']:(p,ctx)=>{
  const b=s2(ctx),t=cueT(ctx)*.6,o={y:180,Vd:150,Td:.55},xs0=600-37.5*t;
  let s=clipTo(330,84,540,206,fronts(t,{o,k:.25,xs0,tmin:-4,w:2})+siren(600,180,{lab:'',s:.7}));
  for(const sd of [-1,1]){const e=crestEdges(t,{o,k:.25,xs0,side:sd,count:2}).sort((a,b)=>a-b);if(e.length===2)s+=fade(seg(p,.03,.12),dbl(e[0],e[1],262,LC,{w:3,head:10}));}
  s+=plate('（車の 速さは 大げさ）',600,108,{size:22,color:C.dim,weight:400});
  const hi=seg(p,b,b+.1);
  s+=card(20,86,300,210,label('後ろ（遠ざかる）',170,124,{size:26,color:C.ink,anchor:'middle',weight:700})+label('λ後 ≈ 0.38 m',170,166,{size:28,color:LC,anchor:'middle',weight:700})
   +label('900 Hz',170,206,{size:30,color:FC,anchor:'middle',weight:700})+T2(`${ft}\\times\\dfrac{${Vt}}{${Vt}{\\color{${hi>.5?C.hi:C.ink}}+}${vst}}`,170,262,{size:28}),seg(p,.1,.2),LC);
  s+=card(880,86,300,210,label('前（近づく）',1030,124,{size:26,color:C.ink,anchor:'middle',weight:700})+label('λ前 ≈ 0.31 m',1030,166,{size:28,color:LC,anchor:'middle',weight:700})
   +label('1100 Hz',1030,206,{size:30,color:FC,anchor:'middle',weight:700})+T2(`${ft}\\times\\dfrac{${Vt}}{${Vt}{\\color{${hi>.5?C.hi:C.ink}}-}${vst}}`,1030,262,{size:28}),seg(p,.1,.2),LC);
  s+=graph(mkG(330,468,540,130),{g:seg(p,.25,.35),trace:1,ue:1,size:22});
  s+=answerRow([[1,'B','0.38 m'],[2,'D','900 Hz'],[3,'A','']],{g:seg(p,.5,.6),size:22});
  return s;
 },
};

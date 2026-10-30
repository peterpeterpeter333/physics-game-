// 問題編 解説「S 極を遠ざけると、コイルの電流は？」(ys-qx-hs-e-magnet-3) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/403_磁場と電磁誘導.md の q-hs-e-magnet-3（解説 22 行）。
// 色（正本）：𝐁 橙、誘導の磁場 橙の点線、電流 I 緑、法線 桃、磁束 Φ 黄。強調は黄の「枠」だけ（Φ の黄と重ならないように）。
//   右下に凡例「Φ 黄」「法線 桃」（解説動画のみ）。コイルの導線は白（電流の緑と区別する）。⊙ は丸付き。
// 小問1 の図：磁場は右向き（画面の中）。コイルの面は、画面の中の向き u（右下がり 30°）と奥行き（右上の斜め）で張る平行四辺形。
//   面の断面（白の点線「面」）と 𝐁 の角が 30°（白の弧）。法線は画面の中で u に垂直（右上がり 60°）→ 法線と 𝐁 の角 60°（桃の弧）。
// 小問2・3 の図：横から見た図。左に棒磁石（左 N 赤・右 S 青。S 極がコイル側）、右に軸を左右に向けたコイル。
//   磁力線は S 極へ入る（左向きの矢じり）。磁石が左へ遠ざかると、コイルの中を通る磁力線が 5 本 → 3 本に減る。
//   左から見た図（小窓）：左向き＝見る人へ向かう＝⊙。⊙ の磁場をつくる電流は反時計回り（画面の上で反時計回り）。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 元の単元動画（yt1-hs-e-magnet-1）の部品（色・⊙⊗・矢じり・棒磁石）を読み込んで使う（そのファイルは編集しない）。
import {C,seg,lin,smooth,fade,label,line,rect,dot,ring,arrow,tex,texWidth,clamp,mix,draw} from './anim.mjs';
import {BC,IC,PHI,NC,NP,SP,SURF,RAD,outSym,head,barMagnet} from './yt1-hs-e-magnet-1-diagrams.mjs';
import {QC,card,textW,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,pauseBadge,legend,note,sentWin,voiceEnd,cueT,tAt,durOf,isProblem} from './yt1-qx-common.mjs';

const K='qx-hs-e-magnet-3:';
const WH=C.ink,LB='#ffc890',SKIN='#e2b48f',SKE='#8a5a3c';
const G1='磁束 Φ',G2='左から見た電流の回る向き',G3='向きになる理由';
const A1=g=>answerTag(1,'C','0.012 Wb',{g}),A2=g=>answerTag(2,'B','反時計回り',{g}),A3=g=>answerTag(3,'A','',{g});
const LEG=(g=1)=>legend([['Φ 黄',PHI],['法線 桃',NC]],1078,458,{g,size:22,gap:10});
const T=(s,x,y,o={})=>label(s,x,y,{size:28,color:WH,anchor:'middle',weight:700,...o});
const M=(s,x,y,o={})=>tex(s,x,y,{size:44,auto:false,color:WH,...o});
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const win=(ctx,i,d=.5)=>{const W=sentWin(ctx);return W[i]??[d,1];};
// 1文に誤答が2つある行：読みの中の marker（例「ディーは」）の位置で区間を分ける
function splitAt(ctx,marker){
 const r=(ctx?.cue?.reading??'').replace(/\s/g,''),i=r.indexOf(marker),ve=voiceEnd(ctx),f=i>0?i/r.length:.5;
 return [[0,f*ve],[f*ve,1]];
}
const place=(svg,tx,ty,s)=>`<g transform="translate(${tx} ${ty}) scale(${s})">${svg}</g>`;
// 背景つきの文字（磁場の矢印の上でも読めるように）。frame>0 で黄の枠（強調）
function bgLab(s,x,y,{size=26,color=WH,anchor='start',g=1,frame=0,weight=700}={}){
 const w=textW(s,size)+14,x0=anchor==='middle'?x-w/2:anchor==='end'?x-w+7:x-7,y0=y-size*.86-4,h=size+14;
 let q=rect(x0,y0,w,h,{fill:C.bg,fo:.88,stroke:'none',rx:6});
 if(frame>0)q+=fade(frame,rect(x0-4,y0-4,w+8,h+8,{fill:'none',fo:0,stroke:C.hi,sw:3.5,rx:8}));
 return fade(g,q+label(s,x,y,{size,color,anchor,weight}));
}
const yFrame=(x,y,w,h,g=1)=>fade(g,rect(x,y,w,h,{fill:'none',fo:0,stroke:C.hi,sw:3.5,rx:10}));
const arcPts=(cx,cy,r,a0,a1,n=30)=>Array.from({length:n+1},(_,i)=>{const a=(a0+(a1-a0)*i/n)*RAD;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});

// ================= 小問1 の図（斜めのコイルと右向きの一様な磁場）=================
const F1={x:400,y:300};
const U1=[150*Math.cos(30*RAD),150*Math.sin(30*RAD)];     // 面の中の向き（画面で右下がり 30°）、半分の長さ（30 cm）
const W1=[50*Math.SQRT1_2,-50*Math.SQRT1_2];               // 奥行き（画面で右上の斜め）、半分の長さ（20 cm）
const NV=[Math.cos(60*RAD),-Math.sin(60*RAD)];             // 法線（画面で右上がり 60°）
const ROWS1=[120,180,240,300,360,420,480];
const P=(a,b,c=0,d=0)=>[F1.x+a*U1[0]+b*W1[0]+c,F1.y+a*U1[1]+b*W1[1]+d];
function rows1({g=1,grow=1}={}){
 let s='';
 ROWS1.forEach((y,i)=>{const gi=grow>=1?1:seg(grow,i*.07,i*.07+.5);
  let q=line(50,y,770,y,{color:BC,w:3});for(const x of [140,300,580,730])q+=head(x,y,1,0,{color:BC,L:17});
  s+=fade(gi*.85,q);});
 return fade(g,s);
}
// コイル（白い枠の平行四辺形）。face：面の断面の点線、arc30：面と 𝐁 の角 30°、area：面の札
function coil1({g=1,dims=1,hiDims=0,face=1,arc30=1,not=0,area=''}={}){
 const A=P(-1,-1),B=P(1,-1),Cc=P(1,1),Dd=P(-1,1);
 let s=fade(g,`<polygon points="${[A,B,Cc,Dd].map(q=>q.join(',')).join(' ')}" fill="${SURF}" fill-opacity=".13" stroke="${WH}" stroke-width="5" stroke-linejoin="round"/>`);
 // 寸法：前の辺（画面の中の向き）30 cm、左の辺（奥行き）20 cm
 s+=fade(dims*g,bgLab('30 cm',330,402,{size:28,anchor:'middle',frame:hiDims})+bgLab('20 cm',226,224,{size:28,anchor:'end',frame:hiDims}));
 if(face>0){const a=P(-1.28,0),b=P(1.28,0);
  s+=fade(face,line(a[0],a[1],b[0],b[1],{color:WH,w:3,dash:'10 8'})+bgLab('面',b[0]+10,b[1]+22,{size:26}));}
 if(arc30>0)s+=fade(arc30,draw(arcPts(F1.x,F1.y,88,0,-30),1,{color:WH,w:3.5})+bgLab('30°',F1.x+106,F1.y+36,{size:28,anchor:'start'})
  +fade(not,bgLab('（θ ではない）',F1.x+172,F1.y+36,{size:24,color:C.dim})));
 if(area)s+=bgLab(area,786,312,{size:26,color:WH});
 return s;
}
// 法線（桃）と、法線と 𝐁 の角（桃の弧）。lab＝'θ'｜'60°'。comp：𝐁 の法線方向の成分 B cosθ（薄い橙の細い矢印）
function normal1({g=1,grow=1,arc=1,lab='θ',hi=0,comp=0,bArrow=0,right=0}={}){
 const L=150,X=F1.x+L*NV[0],Y=F1.y+L*NV[1];
 let s=fade(g,arrow(F1.x,F1.y,X,Y,{color:NC,w:6,head:20,g:grow})+fade(seg(grow,.8,1),bgLab('法線',X+12,Y+6,{size:26,color:NC})));
 if(arc>0){s+=fade(arc,draw(arcPts(F1.x,F1.y,58,0,60),1,{color:NC,w:4})+bgLab(lab,F1.x+80,F1.y-48,{size:28,color:NC,anchor:'start',frame:hi}));}
 if(right>0){const r=22,a=[F1.x+r*NV[0],F1.y+r*NV[1]],c=[F1.x+r*U1[0]/150,F1.y+r*U1[1]/150],b=[a[0]+c[0]-F1.x,a[1]+c[1]-F1.y];
  s+=fade(right,draw([a,b,c],1,{color:WH,w:2.5}));}
 if(bArrow>0)s+=fade(bArrow,arrow(F1.x,F1.y,F1.x+150,F1.y,{color:BC,w:7,head:20})+bgLab('𝐁',F1.x+160,F1.y-14,{size:30,color:BC}));
 if(comp>0){const c=150*Math.cos(60*RAD),ox=-10,oy=-6,fx=F1.x+c*NV[0],fy=F1.y+c*NV[1];
  s+=fade(comp,line(F1.x+150,F1.y,fx,fy,{color:LB,w:2,dash:'6 6'})+arrow(F1.x+ox,F1.y+oy,fx+ox,fy+oy,{color:LB,w:4,head:14,g:seg(comp,.2,1)})
   +bgLab('B cosθ',fx-24,fy-4,{size:28,color:LB,anchor:'end'}));}
 return s;
}
const valB=(g=1)=>bgLab('0.40 T',786,130,{size:30,color:BC,g});
// 小問1 の図をまとめて（出題の最後の状態）
const fig1=(o={})=>rows1()+coil1(o)+valB();

// ================= 小問2・3 の図（横から見た図）=================
const SV={cy:330,X0:820,ry:92,turns:5,dx:24,hl:110,hh:30};
const MX0=430;
function coil2({g=1,part='all'}={}){
 const x0=SV.X0-(SV.turns-1)*SV.dx/2;let s='';
 const el=(cx,a0,a1)=>Array.from({length:31},(_,i)=>{const a=(a0+(a1-a0)*i/30)*RAD;return [cx+16*Math.cos(a),SV.cy-SV.ry*Math.sin(a)];});
 for(let i=0;i<SV.turns;i++){const cx=x0+i*SV.dx;
  if(part!=='front')s+=draw(el(cx,90,270),1,{color:SURF,w:3.5,opacity:.45});
  if(part!=='back')s+=draw(el(cx,-90,90),1,{color:SURF,w:5});}
 if(part!=='back')s+=label('コイル',SV.X0,SV.cy+SV.ry+40,{size:24,color:SURF,anchor:'middle'});
 return fade(g,s);
}
// 磁力線（S 極へ入る）。i＝−4〜4。y＝cy＋6i＋0.09i(x−F)、F＝S 極の面
const LN=[-4,-3,-2,-1,0,1,2,3,4];
function fieldLines(mx,{g=1,grow=1}={}){
 const F=mx+SV.hl,XE=940;let s='';
 for(const i of LN){const yAt=x=>SV.cy+6*i+.09*i*(x-F);
  let xe=XE;if(i!==0){const lim=i>0?505:92;xe=Math.min(XE,F+(lim-SV.cy-6*i)/(.09*i));}
  if(xe<=F+20)continue;
  const pts=[[F,yAt(F)],[xe,yAt(xe)]];
  let q=draw(pts,1,{color:BC,w:3});
  // 矢じり（左向き＝S 極へ）
  for(const x of [F+.45*(SV.X0-F),SV.X0+70])if(x<xe-10){const dir=[-1,-.09*i];q+=head(x,yAt(x),dir[0],dir[1],{color:BC,L:16});}
  s+=q;}
 // 外側から内側へ伸びる（grow）ように：S 極から右へ描き出す
 const clip=`<clipPath id="flc"><rect x="0" y="0" width="${(F+(XE-F)*clamp(grow)).toFixed(1)}" height="515"/></clipPath>`;
 return fade(g*.9,grow>=1?s:`<defs>${clip}</defs><g clip-path="url(#flc)">${s}</g>`);
}
// コイルを通る磁力線の量（磁石が S0 の位置のときを 1）
const phiFrac=mx=>{const d=SV.X0-(mx+SV.hl),d0=SV.X0-(MX0+SV.hl);return (6+.09*d0)/(6+.09*d);};
function phiBar(mx,{g=1}={}){
 const h=200*clamp(phiFrac(mx)),x=965,y0=440;
 let s=rect(x,y0-200,44,200,{fill:'none',fo:0,stroke:C.faint,sw:2,rx:4})+rect(x,y0-h,44,h,{fill:PHI,fo:.65,stroke:PHI,rx:4});
 s+=line(x-12,y0,x+56,y0,{color:C.dim,w:2})+label('Φ',x+22,y0-212,{size:30,color:PHI,anchor:'middle',weight:700})+label('左向き',x+22,y0+30,{size:22,color:PHI,anchor:'middle',weight:700});
 return fade(g,s);
}
// 誘導の磁場（橙の点線・左向き）
function indArrow({g=1,y=SV.cy+24}={}){
 return fade(g,arrow(SV.X0+120,y,SV.X0-120,y,{color:BC,w:6,head:20}).replace('<line','<line stroke-dasharray="14 10"')
  +bgLab('誘導の 磁場',SV.X0-140,y+6,{size:24,color:BC,anchor:'end'}));
}
// 磁石（左 N・右 S）と白い矢印「遠ざける」
function magnet2(mx,{g=1,push=1}={}){
 let s=barMagnet(mx,SV.cy,{hl:SV.hl,hh:SV.hh,dir:-1,size:32});
 if(push>0)s+=fade(push,arrow(mx+50,SV.cy+64,mx-90,SV.cy+64,{color:WH,w:5,head:18})+label('遠ざける',mx-20,SV.cy+104,{size:26,color:WH,anchor:'middle',weight:700}));
 return fade(g,s);
}
// 横から見た図（全部）
function side({mx,g=1,lines=0,grow=1,frame=0,phi=0,ind=0,push=1,look=1}={}){
 let s=coil2({part:'back'});
 if(lines>0)s+=fieldLines(mx,{g:lines,grow});
 s+=coil2({part:'front'})+magnet2(mx,{push});
 if(frame>0)s+=yFrame(SV.X0-78,SV.cy-SV.ry-14,156,2*SV.ry+28,frame);
 if(phi>0)s+=phiBar(mx,{g:phi});
 if(ind>0)s+=indArrow({g:ind});
 if(look>0)s+=fade(look,label('左から 見る →',30,488,{size:24,color:C.dim,weight:700}));
 return fade(g,s);
}
// 小問2 の場面の秒数 → 磁石の位置（行9・10 はゆっくり、行11 で大きく、その後もゆっくり左へ）
function magX(ctx){
 const ts=tAt(ctx,K+'goal2'),d9=durOf(ctx,K+'goal2',8),d10=durOf(ctx,K+'lines',8),d11=durOf(ctx,K+'away',8);
 const t1=Math.min(ts,d9+d10);
 return MX0-4*t1-150*smooth(lin(ts-(d9+d10),0,d11*.8))-1.2*Math.max(0,ts-(d9+d10+d11));
}
// 左から見た図（小窓）。cur：反時計回りの緑の矢印、hand：右手（親指が手前、指が反時計回り）
const LV={x:20,y:92,w:350,h:180,cx:112,cy:205,R:54};
function ccwRing(cx,cy,R,{cur=1,ind=1,w=6}={}){
 let s=ring(cx,cy,R,{color:SURF,w:w-1});
 if(cur>0){let q=draw(arcPts(cx,cy,R,0,360,60),1,{color:IC,w});for(const d of [45,135,225,315]){const t=d*RAD;q+=head(cx+R*Math.cos(t),cy-R*Math.sin(t),-Math.sin(t),-Math.cos(t),{color:IC,L:22});}s+=fade(cur,q);}
 if(ind>0)s+=fade(ind,outSym(cx,cy,R*.36,BC).replace('stroke-width="4"','stroke-width="4" stroke-dasharray="7 5"'));
 return s;
}
function rightHand(cx,cy,g=1){
 if(g<=0)return '';
 let s=draw(arcPts(cx,cy,30,-80,215,40),1,{color:SKE,w:20})+draw(arcPts(cx,cy,30,-80,215,40),1,{color:SKIN,w:15});
 const t=215*RAD;s+=head(cx+30*Math.cos(t)-10*Math.sin(t),cy-30*Math.sin(t)-10*Math.cos(t),-Math.sin(t),-Math.cos(t),{color:SKIN,L:20});
 s+=ring(cx,cy,13,{color:SKE,w:2.5,fill:SKIN})+ring(cx,cy,6,{color:SKE,w:1.5,fill:'#f3d3b8'});
 return fade(g,s);
}
function leftView({g=1,cur=0,hand=0,ind=1,curLab=0,zero=0}={}){
 const {x,y,w,h,cx,cy,R}=LV;
 let s=card(x,y,w,h,'',1,C.faint)+label('左から 見た図',x+w/2,y+30,{size:24,color:C.dim,anchor:'middle',weight:700});
 s+=ccwRing(cx,cy,R,{cur,ind});
 s+=fade(ind,label('⊙ 手前向き',cx+R+28,cy-8,{size:24,color:BC,weight:700}));
 s+=fade(curLab,label('反時計回り',cx+R+28,cy+40,{size:28,color:IC,weight:700}));
 s+=fade(zero,label('電流 0',cx+R+28,cy+40,{size:28,color:WH,weight:700}));
 s+=rightHand(cx,cy,hand);
 return fade(g,s);
}
// 小問3 の鎖の札（タイトル2行＋小さな絵）
function chainCard(x,y,w,h,lines,icon,{g=1,size=26,col=WH}={}){
 let s='';lines.forEach((t,i)=>{s+=label(t,x+w/2,y+40+i*(size+8),{size,color:col,anchor:'middle',weight:700});});
 return card(x,y,w,h,s+icon,g,C.faint);
}
const iconPhi=(cx,cy,u=1)=>{const h=mix(80,40,clamp(u));return rect(cx-22,cy+40-80,44,80,{fill:'none',fo:0,stroke:PHI,sw:2,rx:4})+rect(cx-22,cy+40-h,44,h,{fill:PHI,fo:.65,stroke:PHI,rx:4})
 +arrow(cx-40,cy+10,cx-110,cy+10,{color:BC,w:4,head:14})+head(cx+50,cy+16,0,1,{color:PHI,L:18})+line(cx+50,cy-24,cx+50,cy+4,{color:PHI,w:4});};
const iconInd=(cx,cy)=>arrow(cx+80,cy,cx-80,cy,{color:BC,w:6,head:20}).replace('<line','<line stroke-dasharray="14 10"');
const iconCCW=(cx,cy,r=40)=>ccwRing(cx,cy,r,{w:5});
const iconMag=(cx,cy)=>barMagnet(cx+10,cy-6,{hl:60,hh:20,dir:-1,size:22})+arrow(cx+30,cy+36,cx-60,cy+36,{color:WH,w:4,head:14});
const ARW=(x1,x2,y,g=1)=>fade(g,arrow(x1,y,x2,y,{color:C.dim,w:4,head:14}));
function chain3(g=[1,1,1],u=1){
 const y=120,w=330,h=230,xs=[45,435,825];
 let s=chainCard(xs[0],y,w,h,['左向きの Φ が','減る'],iconPhi(xs[0]+w/2+20,y+150,u),{g:g[0]});
 s+=ARW(xs[0]+w+6,xs[1]-6,y+h/2,g[1])+chainCard(xs[1],y,w,h,['補う 左向きの','磁場（点線）'],iconInd(xs[1]+w/2,y+160),{g:g[1]});
 s+=ARW(xs[1]+w+6,xs[2]-6,y+h/2,g[2])+chainCard(xs[2],y,w,h,['左から見て','反時計回り'],iconCCW(xs[2]+w/2,y+158,38),{g:g[2],col:WH});
 return s;
}

const D0={
 // ================= 問題アニメ：出題（小問1、4 秒＋静止）=================
 // 0〜2 s：右向きの磁場の矢印が並ぶ（「0.40 T」）。2〜4 s：コイルの面（30 cm×20 cm、白）と、面と磁場の角「30°」の白い弧。
 // 出さないもの：法線、法線と磁場の角 60°、θ。
 [K+'q1']:(p)=>{
  let s=rows1({grow:seg(p,0,.5)})+fade(seg(p,.35,.5),valB());
  s+=coil1({g:seg(p,.5,.68),dims:seg(p,.6,.75),face:seg(p,.7,.85),arc30:seg(p,.8,.95)});
  return s;
 },
 // ================= 問題アニメ：小問2（暗転して横から見た図、3 秒で映像を一時停止＋静止）=================
 // 左に棒磁石（S 極が右でコイル側）、右に軸を左右に向けたコイル。磁石が左へゆっくり動き出し、白い矢印「遠ざける」。
 // 出さないもの：磁力線、コイルの電流、誘導の磁場、コイルの極の文字、法線。
 [K+'q2']:(p,ctx)=>{
  const t=cueT(ctx),mx=MX0-8*Math.max(0,t-.6);
  let s=fade(seg(t,0,.6),coil2()+magnet2(mx,{push:seg(t,.6,1.1)}));
  if(isProblem(ctx))s+=pauseBadge({g:seg(p,.97,1),x:1060,y:8,size:22});
  return s;
 },
 // ================= S1 小問1：磁束 =================
 // 1. 出題中のコイルの図＋求めるもの
 [K+'goal1']:(p)=>fig1()+LEG()+goalTag(G1,{g:seg(p,.03,.15)}),
 // 2. 法線（桃）を立てる → 桃の弧と θ → 札「θ：法線と 𝐁 の角」「A：面積」「B：磁場の強さ」。2文目で 30° に「θ ではない」
 [K+'normal']:(p,ctx)=>{
  const [a]=win(ctx,1,.6);
  let s=rows1()+valB()+coil1({area:'',not:seg(p,a+.02,a+.1)});
  s+=normal1({grow:seg(p,.04,.18),arc:seg(p,.2,.3)});
  s+=bgLab('A：面積',786,312,{size:26,g:seg(p,.32,.4)});
  s+=bgLab('θ：法線と 𝐁 の角',786,192,{size:26,color:NC,g:seg(p,.26,.34)});
  s+=bgLab('B：磁場の強さ',786,252,{size:26,color:BC,g:seg(p,.4,.48)});
  return s+LEG()+goalTag(G1);
 },
 // 3. 𝐁 の矢印から、法線の向きの成分 B cosθ（薄い橙の細い矢印）→「定義」タグと Φ＝BA cosθ
 [K+'def']:(p)=>{
  let s=rows1({})+valB()+coil1({area:'A：面積'});
  s+=normal1({bArrow:seg(p,.04,.14),comp:seg(p,.12,.4)});
  s+=bgLab('θ：法線と 𝐁 の角',786,192,{size:26,color:NC})+bgLab('B：磁場の強さ',786,252,{size:26,color:BC});
  s+=card(786,340,396,96,kindTag('定義',846,394)+M(`${cs(PHI,'\\Phi')}=${cs(BC,'B')}\\,A\\cos${cs(NC,'\\theta')}`,1030,390,{size:38}),seg(p,.6,.72),C.faint);
  return s+LEG()+goalTag(G1);
 },
 // 4. 面と磁場の角 30°（白）と、法線と磁場の角 60°（桃）を並べる。直角の印。60° を黄の枠で囲む。90°−30°＝60°
 [K+'angle']:(p)=>{
  let s=rows1()+valB()+coil1({area:'A：面積'});
  s+=normal1({lab:'60°',hi:seg(p,.6,.7),right:seg(p,.08,.2)});
  s+=card(786,190,396,96,M('90^\\circ-30^\\circ=60^\\circ',984,238,{size:40}),seg(p,.3,.45),C.faint);
  return s+LEG()+goalTag(G1);
 },
 // 5. 30 cm→0.30 m、20 cm→0.20 m の換算 → 面に 0.060 m²
 [K+'area']:(p)=>{
  const hd=seg(p,.06,.14)*(1-seg(p,.5,.58));
  let s=rows1()+valB()+coil1({hiDims:hd});
  s+=normal1({lab:'60°'});
  s+=card(786,190,396,230,T('30 cm → 0.30 m',984,238,{size:28})+fade(seg(p,.2,.3),T('20 cm → 0.20 m',984,284,{size:28}))
   +fade(seg(p,.38,.48),T('0.30 m × 0.20 m',984,338,{size:28}))+fade(seg(p,.55,.65),T('＝ 0.060 m²',984,386,{size:30})),seg(p,.06,.16),C.faint);
  return s+LEG()+goalTag(G1);
 },
 // 6. 式に数を一つずつ入れる → cos60° のところに 1/2 → 0.012 Wb。答えの札
 [K+'ans1']:(p,ctx)=>{
  const [a,b]=win(ctx,0,.6),[a2]=win(ctx,1,.6),at=f=>a+f*(b-a);
  let s=M(`${cs(PHI,'\\Phi')}=${cs(BC,'B')}\\,A\\cos${cs(NC,'\\theta')}`,600,140,{size:48});
  // 2段目：数を一つずつ
  const pcs=['=',cs(BC,'0.40'),'\\times','0.060','\\times',`\\cos${cs(NC,'60^\\circ')}`];
  const ws=pcs.map(q=>texWidth(q,46,false)+10),tot=ws.reduce((x,y)=>x+y,0);let x=600-tot/2;
  pcs.forEach((q,i)=>{const gi=i===0?seg(p,at(0),at(.06)):seg(p,at(.06+.1*(i-1)),at(.12+.1*(i-1)));s+=fade(gi,M(q,x+ws[i]/2,228,{size:46}));x+=ws[i];});
  // 3段目：cos60° → 1/2（黄の枠）
  const g3=seg(p,at(.6),at(.7));
  s+=fade(g3,M(`=${cs(BC,'0.40')}\\times0.060\\times\\dfrac{1}{2}`,600,326,{size:46}));
  const wP=texWidth(`=${cs(BC,'0.40')}\\times0.060\\times`,46,false),wT=texWidth(`=${cs(BC,'0.40')}\\times0.060\\times\\dfrac{1}{2}`,46,false),wF=wT-wP;
  const fx=600-wT/2+wP+wF/2;
  s+=yFrame(fx-24,272,48,108,g3*seg(p,at(.68),at(.76)));
  s+=fade(seg(p,at(.82),at(.94)),M(`=${cs(PHI,'0.012')}\\,\\mathrm{Wb}`,600,436,{size:50}));
  return s+LEG()+goalTag(G1)+A1(seg(p,a2,a2+.06));
 },
 // 7. 誤答 B（面との角 30° を θ に）→ 誤答 A（cosθ の掛け忘れ）。1枚ずつ
 [K+'wrongBA']:(p,ctx)=>{
  let s=card(180,90,840,84,M(`\\Phi=0.40\\times0.060\\times\\cos60^\\circ=0.012\\,\\mathrm{Wb}`,600,132,{size:36}),.5,C.faint);
  s+=wrongSeq(p,ctx,[['B','0.021 Wb','θ に面との角 30° を使った',{mid:`0.40\\times0.060\\times\\cos30^\\circ\\approx0.021`}],
   ['A','0.024 Wb','cosθ の掛け忘れ',{mid:`0.40\\times0.060=0.024`}]],{opts:{y:210}});
  return s+LEG()+goalTag(G1)+A1(1);
 },
 // 8. 誤答 D（cm² のまま 600 を使った。単位は T·cm²）
 [K+'wrongD']:(p)=>{
  let s=card(180,90,840,84,M(`\\Phi=0.40\\times0.060\\times\\cos60^\\circ=0.012\\,\\mathrm{Wb}`,600,132,{size:36}),.5,C.faint);
  s+=wrongCard('D','1.2×10² Wb','cm² のまま（T·cm²）',{y:210,mid:`0.40\\times600\\times\\dfrac{1}{2}=120=1.2\\times10^{2}`,g:seg(p,.03,.1)});
  return s+LEG()+goalTag(G1)+A1(1);
 },
 // ================= S2 小問2：誘導電流の向き =================
 // 9. 暗転して横から見た図。磁石は左へゆっくり遠ざかっている
 [K+'goal2']:(p,ctx)=>side({mx:magX(ctx)})+LEG()+goalTag(G2,{g:seg(p,.03,.15)}),
 // 10. S 極に入っていく橙の磁力線 → 2文目でコイルの中を左向きに貫く部分を黄の枠で囲む
 [K+'lines']:(p,ctx)=>{
  const [a]=win(ctx,1,.5);
  return side({mx:magX(ctx),lines:1,grow:seg(p,.04,.4),frame:seg(p,a+.02,a+.1)})+LEG()+goalTag(G2);
 },
 // 11. 磁石が左へ動き、コイルを通る磁力線が減る。横に Φ の黄の棒が縮む
 [K+'away']:(p,ctx)=>side({mx:magX(ctx),lines:1,phi:seg(p,0,.08)})+LEG()+goalTag(G2),
 // 12. 「法則」タグ「レンツの法則：磁束の変化を妨げる向き」。「変化」を黄の枠で囲む
 [K+'lenz']:(p,ctx)=>{
  let s=side({mx:magX(ctx),lines:1,phi:1});
  const x0=330,y0=96,a='レンツの法則：磁束の ',b='変化',c=' を妨げる向き',sz=28,tx=x0+130;
  const wa=textW(a,sz)*.97,wb=textW(b,sz)*.97;
  let q=kindTag('法則',x0+60,y0+44)+label(a,tx,y0+48,{size:sz,color:WH,weight:700})+label(b,tx+wa,y0+48,{size:sz,color:WH,weight:700})+label(c,tx+wa+wb,y0+48,{size:sz,color:WH,weight:700});
  q+=yFrame(tx+wa-8,y0+12,wb+16,50,seg(p,.5,.6));
  s+=card(x0,y0,tx+wa+wb+textW(c,sz)-x0+10,72,q,seg(p,.04,.14),IC);
  return s+LEG()+goalTag(G2);
 },
 // 13. コイルの中に、左向きの橙の点線の矢印（減った分を補う誘導の磁場）
 [K+'ind']:(p,ctx)=>side({mx:magX(ctx),lines:1,phi:1,ind:seg(p,.45,.6)})+LEG()+goalTag(G2),
 // 14. 左上に「左から見た図」の小窓。中央に ⊙（左向き＝見る人へ向かう）
 [K+'view']:(p,ctx)=>side({mx:magX(ctx),lines:1,phi:1,ind:1})+leftView({g:seg(p,.06,.16),ind:seg(p,.45,.6)})+LEG()+goalTag(G2),
 // 15. 右手を小窓に重ねる（親指が手前、指が反時計回り）→ 緑の反時計回りの矢印。答えの札
 [K+'ans2']:(p,ctx)=>{
  const [a2]=win(ctx,1,.6),hd=seg(p,.06,.16)*(1-seg(p,.5,.58));
  return side({mx:magX(ctx),lines:1,phi:1,ind:1})+leftView({hand:hd,cur:seg(p,.4,.5),curLab:seg(p,.45,.55)})+LEG()+goalTag(G2)+A2(seg(p,a2,a2+.06));
 },
 // 16. 誤答 A。元の磁場（実線）と誘導の磁場（点線）が、どちらも左向きに並ぶ
 [K+'wrongA2']:(p,ctx)=>{
  const [a2]=win(ctx,1,.5);
  let s=fade(.3,side({mx:magX(ctx),lines:1,phi:1,ind:1})+leftView({cur:1,curLab:1}));
  let q=arrow(700,128,530,128,{color:BC,w:6,head:20})+label('元の 磁場',720,137,{size:26,color:BC,weight:700});
  q+=arrow(700,182,530,182,{color:BC,w:6,head:20}).replace('<line','<line stroke-dasharray="14 10"')+label('誘導の 磁場',720,191,{size:26,color:BC,weight:700});
  q+=fade(seg(p,a2,a2+.08),yFrame(510,100,206,108)+label('同じ 向き',470,165,{size:26,color:WH,anchor:'end',weight:700}));
  s+=card(380,92,520,130,q,seg(p,.03,.1),C.faint);
  s+=wrongCard('A','時計回り','いつも逆向きではない',{y:300,g:seg(p,.03,.1)});
  return s+LEG()+goalTag(G2)+A2(1);
 },
 // 17. 誤答 C（流れない）→ 誤答 D（交互に入れ替わる）。1枚ずつ
 [K+'wrongCD2']:(p,ctx)=>{
  let s=fade(.3,side({mx:magX(ctx),lines:1,phi:1,ind:1})+leftView({cur:1,curLab:1}));
  s+=wrongSeq(p,ctx,[['C','流れない','動いている間は Φ が減る'],['D','交互に入れ替わる','減り続けるので向きは一つ']],{win:splitAt(ctx,'ディーは'),opts:{y:300}});
  return s+LEG()+goalTag(G2)+A2(1);
 },
 // ================= S3 小問3：理由 =================
 // 18. カードを消す。小問2 の向き（左から見て反時計回り）を大きく
 [K+'goal3']:(p)=>{
  let s=ccwRing(600,300,100,{w:7})+label('小問2：左から見て 反時計回り',600,160,{size:30,color:WH,anchor:'middle',weight:700});
  s+=label('⊙ 誘導の 磁場（左向き）',760,310,{size:24,color:BC,weight:700});
  return s+LEG()+goalTag(G3,{g:seg(p,.03,.15)});
 },
 // 19. 「左向きの Φ が減る」→「補う左向きの点線の磁場」→「反時計回り」を矢印でつなぐ。答えの札
 [K+'ans3']:(p,ctx)=>{
  const [a,b]=win(ctx,0,.6),[a2]=win(ctx,1,.6),at=f=>a+f*(b-a);
  let s=chain3([seg(p,at(.02),at(.12)),seg(p,at(.45),at(.55)),seg(p,at(.85),at(.95))],seg(p,at(.1),at(.4)));
  return s+LEG()+goalTag(G3)+A3(seg(p,a2,a2+.06));
 },
 // 20. 誤答 B（打ち消す右向きの磁場）。逆らうのは変化
 [K+'wrongB3']:(p)=>{
  let s=fade(.45,place(chain3(),180,88,.7));
  s+=wrongCard('B','打ち消す右向きの磁場','逆らうのは変化',{y:350,g:seg(p,.03,.1)});
  return s+LEG()+goalTag(G3)+A3(1);
 },
 // 21. 誤答 C（S 極から N 極へ）→ 誤答 D（大きいほど減らす向き）。1枚ずつ
 [K+'wrongCD3']:(p,ctx)=>{
  let s=fade(.45,place(chain3(),180,88,.7));
  s+=wrongSeq(p,ctx,[['C','S 極から N 極へ','極で向きは決まらない'],['D','大きいほど減らす向き','大きさではなく変化']],{win:splitAt(ctx,'ディーは'),opts:{y:350}});
  return s+LEG()+goalTag(G3)+A3(1);
 },
 // 22. 1文目：磁石が止まる → 緑の矢印が消え、電流 0（Φ の棒は一定）。
 //     2文目：カードを消し、法線と 60° の図・Φ＝0.012 Wb と、遠ざかる S 極 → 減る左向きの磁束 → 左向きの点線の磁場 → 左から見て反時計回り を一列に。
 //     声の後に答えの札を横に並べる
 [K+'stop']:(p,ctx)=>{
  const [a,b]=win(ctx,0,.5),[a2]=win(ctx,1,.5),ve=voiceEnd(ctx),at=f=>a+f*(b-a);
  const out=seg(p,a2-.02,a2+.04),st=seg(p,at(.05),at(.35));
  const mx=200-30*st;
  let s='';
  if(out<1){
   let q=coil2({part:'back'})+fieldLines(mx)+coil2({part:'front'})+magnet2(mx,{push:1-st})+phiBar(mx);
   q+=fade(st,label('止まる',mx,SV.cy+104,{size:28,color:WH,anchor:'middle',weight:700}));
   q+=leftView({cur:1-seg(p,at(.35),at(.55)),ind:0,zero:seg(p,at(.55),at(.7))});
   s+=fade(1-out,q);
  }
  if(out>0){
   const g1=seg(p,a2+.02,a2+.1),gc=[0,1,2,3].map(i=>seg(p,a2+.08+i*.07,a2+.14+i*.07));
   let f=rows1()+coil1({dims:0,area:''})+normal1({lab:'60°'});
   s+=fade(g1,place(f,19,46,.42));
   s+=card(370,110,380,120,T('θ ＝ 60°',560,156,{size:28,color:NC})+M(`${cs(PHI,'\\Phi')}=0.012\\,\\mathrm{Wb}`,560,200,{size:38}),g1,C.faint);
   const y=262,w=245,h=170,xs=[40,317,594,871];
   s+=chainCard(xs[0],y,w,h,['遠ざかる','S 極'],iconMag(xs[0]+w/2,y+118),{g:gc[0]});
   s+=ARW(xs[0]+w+2,xs[1]-2,y+h/2,gc[1])+chainCard(xs[1],y,w,h,['減る','左向きの Φ'],`<g transform="translate(${xs[1]+w/2+20} ${y+112}) scale(.6) translate(${-(xs[1]+w/2+20)} ${-(y+112)})">${iconPhi(xs[1]+w/2+20,y+112)}</g>`,{g:gc[1]});
   s+=ARW(xs[1]+w+2,xs[2]-2,y+h/2,gc[2])+chainCard(xs[2],y,w,h,['左向きの','点線の 磁場'],`<g transform="translate(${xs[2]+w/2} ${y+125}) scale(.75) translate(${-(xs[2]+w/2)} ${-(y+125)})">${iconInd(xs[2]+w/2,y+125)}</g>`,{g:gc[2]});
   s+=ARW(xs[2]+w+2,xs[3]-2,y+h/2,gc[3])+chainCard(xs[3],y,w,h,['左から見て','反時計回り'],iconCCW(xs[3]+w/2,y+122,30),{g:gc[3]});
  }
  s+=LEG()+goalTag(G3,{g:1-out})+A3(1-out);
  s+=answerRow([[1,'C',''],[2,'B',''],[3,'A','']],{g:seg(p,ve+.02,ve+.08)});
  return s;
 },
};
export const qxHsEMagnet3Diagrams=D0;

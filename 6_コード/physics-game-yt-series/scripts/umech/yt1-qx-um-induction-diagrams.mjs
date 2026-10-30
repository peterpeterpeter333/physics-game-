// 問題編 解説「減る磁束、回る発電機、動く棒」（q-um-induction、大学編 27 電磁誘導・中級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/27_電磁誘導.md の q-um-induction（解説 21 行）。
// 画面の配置：左に図、右に説明の枠（紺の塗り・角の丸い枠）。誤答カードは右の枠の中・下。札の帯（y＜78）には図を描かない。
// 色（単元動画と同じ）：元の磁場 𝐁 橙、誘導の磁場 赤、電流 I・巻き線 緑、磁束 Φ 黄、法線 桃、起電力 ℰ・速度 𝐯 紫、時間 t 金、力 緑、仕事率 橙、面積の帯 金。
// 前半：正面から見たコイル（⊗＝奥向き）。画面上の回り方は、正面から見た回り方そのもの。時計回りの電流は輪の中に ⊗ を作る。
// 中盤：上から見た回るコイル（単元動画 2/3 と同じ。𝐁 は右向き、コイルは線分、法線はそれに垂直、ωt は 𝐁 から法線まで反時計回り）。
// 後半：上から見たレールと棒（⊗ 0.4 T）。電流は回路を反時計回り（棒の中は下→上）、棒への力 IℓB は左向き。
// 部品は 電磁誘導・中級 1/3（yt1-um-induction-1-diagrams.mjs）の export を借りる（あちらは編集しない）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,pauseBadge,note,cueT,tAt,voiceEnd} from './yt1-qx-common.mjs';
import {head,outSym,inSym,graph} from './yt1-um-induction-1-diagrams.mjs';

const K='qx-um-induction:';
const BC=C.E,IND='#ff6b6b',CI=C.F,PHI=C.hi,NC=C.p,EMF=C.v,TC=C.t,WC=C.E,SURF='#c9d6ee';
const RAD=Math.PI/180,TAU=2*Math.PI;
const T=(s,x,y,size=36,o={})=>tex(s,x,y,{size,auto:false,...o});
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const PX=680,PW=500,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const LB=(s,x,y,size=26,color=C.ink,o={})=>label(s,x,y,{size,color,anchor:'middle',weight:700,...o});
const LN=(s,x,y,size=24,color=C.dim,o={})=>label(s,x,y,{size,color,anchor:'middle',...o});
const EM=cs(EMF,'\\mathcal{E}'),PH=cs(PHI,'\\Phi'),tt=cs(TC,'t'),om=cs(NC,'\\omega');
const NLAW=`${EM}=-N\\dfrac{d${PH}}{d${tt}}`;
const G1='起電力の大きさと電流の向き',G2='磁束が最大の瞬間の ℰ と、ℰ の振幅',G3='手の仕事率';
const ANS1=g=>answerTag(1,'A','6 V、時計回り',{g}),ANS2=g=>answerTag(2,'C','0 V、24 V',{g}),ANS3=g=>answerTag(3,'B','0.08 W',{g});

function atWord(ctx,frag,fb=.5){
 const r=(ctx?.cue?.reading??'').replace(/\s/g,''),f=frag.replace(/\s/g,''),i=r.indexOf(f);
 if(!r||i<0)return fb;return i/r.length*voiceEnd(ctx);
}
function wins(ctx,frags){const a=frags.map(f=>atWord(ctx,f));return [[0,a[0]],...a.map((x,i)=>[x,i===a.length-1?1:a[i+1]])];}
const arcXY=(cx,cy,r,a0,a1,n=24)=>Array.from({length:n+1},(_,i)=>{const a=(a0+(a1-a0)*i/n)*RAD;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});

// ===== 前半：正面から見た 20 巻きのコイル（両端は抵抗）=====
const INP=[[0,0],[-.48,-.42],[.48,-.42],[-.48,.42],[.48,.42],[0,-.74],[0,.74],[-.74,0],[.74,0]];
function coil({cx=170,cy=240,R=90,g=1,inG=1,inFade=1,ind=0,cur=0,hl=-1,turnsLab=1,res=1,decG=0}={}){
 let s='';
 // 巻き線（5本の輪を少しずらして重ねる：20 巻きの束）
 for(let i=0;i<5;i++){const d=(i-2)*5;s+=ring(cx+d,cy+d*.6,R,{color:i===hl?PHI:CI,w:i===hl?6:3.5});}
 if(res){const yb=cy+R+44,xa=cx-R*.42,xb=cx+R*.42;
  s+=draw([[xa,cy+R*.9],[xa,yb],[cx-34,yb]],1,{color:CI,w:3.5})+draw([[xb,cy+R*.9],[xb,yb],[cx+34,yb]],1,{color:CI,w:3.5});
  const zz=[[cx-34,yb]];for(let i=1;i<8;i++)zz.push([cx-34+68*i/8,yb+(i%2?-10:10)]);zz.push([cx+34,yb]);s+=draw(zz,1,{color:SURF,w:4});}
 const k=R/100;
 INP.forEach(([dx,dy],i)=>{if(ind>0&&i===0)return;s+=inSym(cx+dx*R,cy+dy*R,13*Math.min(1,k*1.1),BC,inG*inFade);});
 if(ind>0)s+=fade(ind,inSym(cx,cy,30,IND)+LB('誘導の 磁場',cx,cy-R-20,22,IND));
 if(cur>0){let h='';for(const d of [45,135,225,315]){const t=d*RAD;h+=head(cx+R*Math.cos(t),cy-R*Math.sin(t),Math.sin(t),Math.cos(t),{color:CI,L:24});}s+=fade(cur,h);}
 if(turnsLab)s+=fade(turnsLab,label('20 巻き',cx-R,cy-R-14,{size:24,color:CI,anchor:'middle',weight:700}));
 if(decG>0)s+=fade(decG,rect(cx-R-10,cy+R+64,2*R+20,44,{fill:BC,fo:.12,stroke:BC,sw:2,rx:10})+LB('⊗ の 磁束が 減少',cx,cy+R+95,24,BC));
 return fade(g,s);
}
// 前半の Φ–t グラフ：t 0〜0.14 s、Φ 0〜0.06 Wb。0〜0.1 s で 0.05 → 0.02 の直線
function phi1({x0=330,y0=450,w=240,h=290,g=1,prog=1,tri=0,triLab=0}={}){
 const G=graph(x0,y0,w,h,{tmax:.14,fmin:0,fmax:.06,tt:[[.1,'0.1']],ft:[[.02,'0.02'],[.05,'0.05']],g});
 const {X,Y}=G;let s=G.s;
 s+=fade(g,line(x0,Y(.02),X(.1),Y(.02),{color:C.grid,w:1.5})+line(X(.1),Y(.02),X(.1),Y(0),{color:C.grid,w:1.5}));
 if(prog>0)s+=fade(g,draw([[X(0),Y(.05)],[X(.1*prog),Y(.05-.03*prog)]],1,{color:PHI,w:5}));
 if(tri>0)s+=fade(tri,line(X(0),Y(.05),X(.1),Y(.05),{color:TC,w:4})+line(X(.1),Y(.05),X(.1),Y(.02),{color:PHI,w:4}));
 if(triLab>0)s+=fade(triLab,label('0.1 s',X(.05),Y(.05)-14,{size:24,color:TC,anchor:'middle',weight:700})+label('−0.03 Wb',X(.1)+10,Y(.035)+8,{size:24,color:PHI,weight:700}));
 return {svg:s,X,Y};
}
// 電池（1巻き分）を縦に積む
function cells(x,y0,n,{g=1,hl=-1}={}){
 let s='';const h=46;
 s+=line(x,y0-20,x,y0+n*h+30,{color:CI,w:3});
 for(let i=0;i<n;i++){const y=y0+i*h+16,on=i===hl;s+=rect(x-40,y-14,80,30,{fill:C.bg,fo:1,stroke:'none',rx:0})
  +line(x-34,y-8,x+34,y-8,{color:on?PHI:EMF,w:4})+line(x-18,y+8,x+18,y+8,{color:on?PHI:EMF,w:9});}
 return fade(g,s);
}

// ===== 中盤：上から見た回るコイル =====
function rot(ang,{cx=250,cy=290,Lc=110,nL=110,g=1,Bg=1,x0=50,x1=460,ys=[150,215,365,430],arc=0,arcLab='ωt',labA=0,labB=0}={}){
 let s='';
 for(const y of ys)s+=fade(Bg*.6,arrow(x0,y,x1,y,{color:BC,w:3,head:12}));
 s+=fade(Bg,label('𝐁',x1+8,ys[0]+8,{size:28,color:BC,weight:700}));
 const ux=Math.cos(ang),uy=-Math.sin(ang),sx=-Math.sin(ang),sy=-Math.cos(ang);
 s+=line(cx-Lc*sx,cy-Lc*sy,cx+Lc*sx,cy+Lc*sy,{color:CI,w:9})+dot(cx,cy,7,C.ink);
 if(arc>0&&ang>.05){const A=Array.from({length:31},(_,i)=>{const t=ang*i/30;return [cx+58*Math.cos(t),cy-58*Math.sin(t)];});
  s+=fade(arc,draw(A,1,{color:PHI,w:3.5})+label(arcLab,cx+92*Math.cos(ang/2),cy-92*Math.sin(ang/2)+10,{size:28,color:PHI,anchor:'middle',weight:700}));}
 s+=arrow(cx,cy,cx+nL*ux,cy+nL*uy,{color:NC,w:5,head:16})+label('法線',cx+(nL+28)*ux,cy+(nL+28)*uy+8,{size:24,color:NC,anchor:'middle',weight:700});
 if(labA>0)s+=fade(labA,label('面積 A',cx-(Lc+10)*sx-6,cy-(Lc+10)*sy-8,{size:26,color:CI,anchor:'end',weight:700}));
 if(labB>0)s+=fade(labB,label('B',x0-6,ys[1]+8,{size:28,color:BC,anchor:'end',weight:700}));
 return fade(g,s);
}
// Φ（cos）と ℰ（sin）の波：ωt 0〜4π
function wave(x0,ym,w,amp,fn,{prog=1,color=PHI,wd=5}={}){
 const n=200,pts=[];for(let i=0;i<=n*prog;i++){const u=i/n;pts.push([x0+w*u,ym-amp*fn(u*2*TAU)]);}
 return pts.length>1?draw(pts,1,{color,w:wd}):'';
}
function waveAxes(x0,ym,w,amp,lab,col,{g=1}={}){
 return fade(g,arrow(x0-6,ym,x0+w+22,ym,{color:C.dim,w:2.5,head:12})+arrow(x0,ym+amp+16,x0,ym-amp-22,{color:C.dim,w:2.5,head:12})
  +label(lab,x0-14,ym-amp+6,{size:28,color:col,anchor:'end',weight:700})+label('t',x0+w+26,ym+30,{size:24,color:TC,anchor:'middle'}));
}

// ===== 後半：上から見たレールと棒 =====
const RL={x0:110,x1:640,yt:170,yb:400};
function field(xs,ys,avoid,{g=1,r=11}={}){
 let s='';const d=r*.62;
 for(const x of xs)for(const y of ys){let ok=1;for(const [a,b,c,e] of avoid){const dx=Math.max(a-x,0,x-c),dy=Math.max(b-y,0,y-e);if(Math.hypot(dx,dy)<r+6)ok=0;}
  if(ok)s+=ring(x,y,r,{color:BC,w:2.2})+line(x-d,y-d,x+d,y+d,{color:BC,w:2.2})+line(x-d,y+d,x+d,y-d,{color:BC,w:2.2});}
 return fade(g,s);
}
function rails(xr,{g=1,vG=1,lG=1,cur=0,curLab=0,fL=0,fLHi=0,fR=0,strip=0,stripW=110,bLab=1,rl=RL}={}){
 const {x0,x1,yt,yb}=rl,my=(yt+yb)/2;let s='';
 const avoid=[[x0-16,yt,x0+16,yb],[xr-8,yt-30,xr+8,yb+30],[x0,yt-3,x1,yt+3],[x0,yb-3,x1,yb+3]];
 if(vG>0)avoid.push([xr+10,yt+20,xr+140,yt+62]);
 if(lG>0)avoid.push([xr+22,yt,xr+30,yb],[xr+30,yb-70,xr+200,yb-30]);
 if(fL>0)avoid.push([xr-150,yb-100,xr,yb-30]);
 if(fR>0)avoid.push([xr,my-8,xr+185,my+62]);
 if(cur>0)avoid.push([xr+8,my-60,xr+120,my-20]);
 if(strip>0)avoid.push([xr-stripW-4,yt,xr,yb],[xr-stripW-70,yb+30,xr+50,yb+80]);
 const xs=[];for(let x=x0+50;x<=x1;x+=62)xs.push(x);
 s+=field(xs,[yt+45,my,yb-45,yb+42],avoid);
 if(bLab)s+=label('磁場 0.4 T（⊗ 奥向き）',x0-40,yt-28,{size:24,color:BC,weight:700});
 if(strip>0)s+=fade(strip,rect(xr-stripW,yt,stripW,yb-yt,{fill:TC,fo:.35,stroke:TC,sw:2,rx:0}));
 s+=line(x0,yt,x1,yt,{color:SURF,w:5})+line(x0,yb,x1,yb,{color:SURF,w:5});
 const zz=[[x0,yt],[x0,yt+60]];for(let i=1;i<8;i++)zz.push([x0+(i%2?-14:14),mix(yt+60,yb-60,i/8)]);zz.push([x0,yb-60],[x0,yb]);
 s+=draw(zz,1,{color:SURF,w:4})+label('0.5 Ω',x0-22,my+10,{size:26,color:SURF,anchor:'end',weight:700});
 s+=line(xr,yt-22,xr,yb+22,{color:CI,w:9});
 if(vG>0)s+=fade(vG,arrow(xr+12,yt+42,xr+120,yt+42,{color:EMF,w:5,head:16})+label('2 m/s',xr+66,yt+30,{size:24,color:EMF,anchor:'middle',weight:700}));
 if(lG>0)s+=fade(lG,line(xr+26,yt+4,xr+26,yb-4,{color:C.dim,w:2,dash:'6 5'})+label('ℓ ＝ 0.25 m',xr+36,yb-42,{size:24,color:C.ink,weight:700}));
 if(cur>0){s+=fade(cur,head(xr,my-12,0,-1,{color:CI,L:26})+head((x0+xr)/2-20,yt,-1,0,{color:CI,L:24})+head(x0,my+70,0,1,{color:CI,L:22})+head((x0+xr)/2+20,yb,1,0,{color:CI,L:24}));
  if(curLab>0)s+=fade(curLab,label('0.4 A',xr+14,my-28,{size:26,color:CI,weight:700}));}
 if(fL>0)s+=fade(fL,arrow(xr-6,yb-55,xr-130,yb-55,{color:C.F,w:9+5*fLHi,head:24})+label('0.04 N',xr-70,yb-74,{size:26,color:fLHi>0?PHI:C.F,anchor:'middle',weight:700})+(fLHi>0?fade(fLHi,ring(xr-68,yb-55,70,{color:PHI,w:3,dash:'8 6'})):''));
 if(fR>0)s+=fade(fR,arrow(xr+6,my+14,xr+130,my+14,{color:C.F,w:9,head:24})+rect(xr+134,my-4,46,36,{fill:'#2a3346',fo:1,stroke:C.ink,sw:2,rx:8})+label('手',xr+157,my+22,{size:24,color:C.ink,anchor:'middle',weight:700})
  +label('0.04 N',xr+70,my+50,{size:24,color:C.F,anchor:'middle',weight:700}));
 return fade(g,s);
}
// 小問3 の棒の位置（場面の始まりから一定の速さで右へ。画面では遅く描く）
const rodX=ctx=>260+2*tAt(ctx,K+'goal3');
// 仕事率の棒（橙）
function pbar(x,yb,hgt,lab,val,{g=1}={}){return fade(g,rect(x-40,yb-hgt,80,hgt,{fill:WC,fo:.55,stroke:WC,sw:2,rx:6})+LB(val,x,yb-hgt-12,26,WC)+LN(lab,x,yb+30,22,C.ink));}

export const ytQxUmInductionDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（8秒）：0〜2 s 前半（20 巻きのコイル・⊗・Φ–t の下がる直線）、2〜5 s 中盤（回るコイルを2回転、t＝0 の向きで映像を一時停止）、
 //   5〜8 s 後半（レール・棒・0.5 Ω・⊗ 0.4 T・2 m/s・ℓ＝0.25 m、棒が少し進んで映像を一時停止）。最後は静止。
 [K+'q1']:(p)=>{
  let s=line(392,90,392,505,{color:C.faint,w:2})+line(797,90,797,505,{color:C.faint,w:2});
  const g1=seg(p,0,.06);
  s+=fade(g1,label('前半',20,92,{size:28,color:C.ink,weight:700}));
  s+=coil({cx:190,cy:190,R:58,g:g1,res:1,turnsLab:1});
  s+=phi1({x0:90,y0:478,w:230,h:140,g:seg(p,.04,.12),prog:seg(p,.1,.25)}).svg;
  const g2=seg(p,.25,.31),u=seg(p,.31,.62);
  s+=fade(g2,label('中盤',405,92,{size:28,color:C.ink,weight:700}));
  s+=rot(2*TAU*u,{cx:595,cy:270,Lc:72,nL:70,g:g2,x0:420,x1:752,ys:[180,230,310,360]});
  s+=fade(g2,LB('150 巻、0.02 m²',595,405,24,CI)+LB('0.05 T、1秒に 25 回転',595,437,24,C.ink)+note('（見やすいように 遅く 再生）',595,470));
  s+=pauseBadge({g:seg(p,.62,.66),x:595,y:112});
  const g3=seg(p,.62,.68),xr=mix(955,995,seg(p,.7,.92));
  s+=fade(g3,label('後半',810,92,{size:28,color:C.ink,weight:700}));
  s+=rails(xr,{g:g3,rl:{x0:880,x1:1185,yt:200,yb:400},bLab:0,lG:1,vG:1});
  s+=fade(g3,label('磁場 0.4 T（⊗）',880,492,{size:24,color:BC,weight:700}));
  s+=pauseBadge({g:seg(p,.92,.96),x:1000,y:112});
  return s;
 },

 // ===================== 小問1 =====================
 // 1. 正面から見たコイルと ⊗、Φ–t のグラフ。右の枠に与えた量
 [K+'goal1']:(p)=>{
  let s=coil({cx:160,cy:240,R:90});
  s+=phi1({}).svg;
  s+=panel(90,300,LN('前半',PC,135,24)+LB('20 巻きの コイル（閉じている）',PC,195,26,CI)+LB('奥向き（⊗）の 磁束',PC,250,26,PHI)+LB('0.05 → 0.02 Wb（0.1 s）',PC,300,28,PHI)
   +fade(seg(p,.4,.5),line(PX+40,330,PX+PW-40,330,{color:C.faint,w:2})+LB('起電力の 大きさ と 電流の 向き',PC,368,26,C.hi)),seg(p,.03,.15));
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 2. 「法則」ℰ＝−N dΦ/dt。巻きを1巻きずつ光らせ、小さな電池が直列に積み重なる
 [K+'law1']:(p,ctx)=>{
  const b=atWord(ctx,'かくまきの',.4),k=clamp((p-b)/.4),hl=p>b&&k<1?Math.floor(k*5):-1;
  let s=coil({cx:160,cy:240,R:90,hl});
  s+=fade(seg(p,b,b+.05),LB('1巻き ＝ 電池 1個',440,118,24,EMF));
  s+=cells(440,150,Math.max(0,Math.min(5,Math.ceil(k*5))),{hl});
  s+=fade(seg(p,b+.38,b+.45),LB('…',440,420,28,EMF)+LB('20 巻き → 20 個 直列',440,470,24,EMF));
  s+=panel(110,250,kindTag('法則',PC,165)+T(NLAW,PC,265,46)+fade(seg(p,b+.4,b+.48),LB('巻数 N 倍',PC,335,28,C.hi)),seg(p,.02,.12),C.F);
  s+=goalTag(G1);
  return s;
 },
 // 3. Φ–t の直線に傾きの三角形（縦 −0.03 Wb、横 0.1 s）。−0.3 Wb/s → ×20 → 6 V
 [K+'calc1']:(p,ctx)=>{
  const b=atWord(ctx,'おおきさは',.6);
  let s=phi1({x0:110,y0:460,w:420,h:330,tri:seg(p,.03,.12),triLab:seg(p,.08,.16)}).svg;
  s+=panel(100,380,LN('1巻き あたり',PC,145,24)+fade(seg(p,.12,.22),T(`\\dfrac{0.02-0.05}{0.1}=-0.3\\ \\mathrm{Wb/s}`,PC,215,34))
   +fade(seg(p,b,b+.08),line(PX+40,275,PX+PW-40,275,{color:C.faint,w:2})+LN('大きさ（× 巻数 20）',PC,318,24)+T(`20\\times0.3=${cs(EMF,'6\\ \\mathrm{V}')}`,PC,395,44)),seg(p,.02,.1));
  s+=goalTag(G1);
  return s;
 },
 // 4. ⊗ が薄くなり「減少」。赤の ⊗（誘導の磁場）、緑の電流が時計回り
 [K+'dir1']:(p,ctx)=>{
  const bi=atWord(ctx,'へった ぶんを',.3),bc=atWord(ctx,'でんりゅうは',.65);
  let s=coil({cx:260,cy:250,R:130,inFade:mix(1,.35,seg(p,.03,.3)),ind:seg(p,bi,bi+.08),cur:seg(p,bc,bc+.08),decG:seg(p,.05,.15)});
  s+=panel(100,330,LB('⊗ の 磁束が 減る',PC,160,28,BC)+fade(seg(p,bi,bi+.06),LN('↓ 補う 向き',PC,215,26)+LB('誘導の 磁場も ⊗',PC,265,28,IND))
   +fade(seg(p,bc,bc+.06),LN('↓',PC,315,26)+LB('時計回り（正面から 見て）',PC,365,28,CI)),seg(p,.02,.12));
  s+=goalTag(G1);
  return s;
 },
 // 5. 小問1 の答え A
 [K+'ans1']:(p)=>{
  let s=coil({cx:260,cy:250,R:130,inFade:.35,ind:1,cur:1});
  s+=panel(100,250,T(`|${EM}|=${cs(EMF,'6\\ \\mathrm{V}')}`,PC,190,44)+LB('時計回り',PC,280,30,CI),1,C.hi);
  s+=goalTag(G1)+ANS1(seg(p,.03,.12));
  return s;
 },
 // 6. 誤答 B → C（1枚ずつ）
 [K+'wrongBC']:(p,ctx)=>{
  const W=wins(ctx,['スィーは']);
  let s=coil({cx:260,cy:250,R:130,inFade:.35,ind:1,cur:1});
  s+=panel(90,150,LB('⊗ が 減る → 誘導 ⊗',PC,145,26,IND)+LB('→ 時計回り、6 V',PC,195,26,CI),1);
  s+=wrongSeq(p,ctx,[['B','6 V、反時計回り',['減る 磁束を 補うので、','誘導の 磁場は 元と 同じ ⊗']],['C','0.3 V','巻数 20 を 掛けていない']],{win:W,opts:{...WOPT,y:262}});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },
 // 7. 誤答 D（はじめの 0.05 Wb を使った）
 [K+'wrongD']:(p)=>{
  let s=coil({cx:260,cy:250,R:130,inFade:.35,ind:1,cur:1});
  s+=panel(90,150,LN('変化した 量',PC,135,24)+T(`0.05-0.02=${cs(PHI,'0.03\\ \\mathrm{Wb}')}`,PC,195,34),1);
  s+=wrongCard('D','10 V',['はじめの 0.05 Wb を 使った','（変化は 0.03 Wb）'],{...WOPT,y:262,g:seg(p,.03,.1)});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },

 // ===================== 小問2 =====================
 // 8. 回るコイル（遅く再生）。右の枠に与えた量
 [K+'goal2']:(p,ctx)=>{
  const t=tAt(ctx,K+'goal2');
  let s=rot(TAU*t/4)+note('（見やすいように 遅く 再生）',250,495);
  s+=panel(90,330,LN('中盤（発電機）',PC,135,24)+LB('巻数 150、面積 0.02 m²',PC,195,28,CI)+LB('0.05 T の 一様な 磁場',PC,250,28,BC)+LB('1秒に 25 回転',PC,305,28,C.ink)
   +LB('t ＝ 0 で 法線 ∥ 磁場',PC,365,28,NC),seg(p,.03,.15));
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 9. 先に図に記号（ωt・A・B）。そのあと Φ＝BA cos ωt → 微分を一操作ずつ → ℰ＝NBAω sin ωt
 [K+'deriv']:(p,ctx)=>{
  const cA=1-seg(p,.24,.29),cB=seg(p,.27,.32);
  let a=rot(50*RAD,{arc:seg(p,.02,.08),labA:seg(p,.06,.12),labB:seg(p,.1,.16)});
  a+=panel(110,260,LB('ωt ＝ 法線と 磁場の 角',PC,175,26,PHI)+LN('ω ＝ 1秒あたりに 回る 角',PC,235,24,NC)+LN('A ＝ 面積、B ＝ 磁場',PC,290,24,C.ink),seg(p,.04,.12));
  let s=fade(cA,a);
  const r1=seg(p,.3,.36),r2=seg(p,.48,.56),r3=seg(p,.7,.78);
  let e=fade(r1,T(`${PH}=BA\\cos ${om}${tt}`,600,150,44));
  e+=fade(r2,LN('時間で 微分',250,262,24)+T(`\\dfrac{d${PH}}{d${tt}}=BA\\cdot\\left(-{\\color{${PHI}}\\boxed{${om}}}\\sin ${om}${tt}\\right)`,640,262,40));
  e+=fade(r3,LN('ℰ ＝ −N dΦ/dt',250,395,24)+T(`${EM}=NBA${om}\\sin ${om}${tt}`,640,395,48));
  s+=fade(cB,e);
  s+=goalTag(G2);
  return s;
 },
 // 10. 上に Φ（cos）、下に ℰ（sin）。Φ の山の頂上に水平な接線、縦線で ℰ＝0 の点と結ぶ
 [K+'peak']:(p)=>{
  const x0=110,w=900,y1=190,y2=400,A=75,xp=x0+w/2;
  let s=waveAxes(x0,y1,w,A,'Φ',PHI)+waveAxes(x0,y2,w,A,'ℰ',EMF);
  s+=wave(x0,y1,w,A,Math.cos,{prog:seg(p,.02,.2)})+wave(x0,y2,w,A,Math.sin,{prog:seg(p,.08,.26),color:EMF});
  s+=fade(seg(p,.28,.36),line(xp-90,y1-A,xp+90,y1-A,{color:PHI,w:4})+dot(xp,y1-A,8,PHI)+LB('cos の 山の 頂上',xp,y1-A-18,24,PHI));
  s+=fade(seg(p,.4,.5),line(xp,y1-A,xp,y2,{color:C.dim,w:2.5,dash:'7 6'})+dot(xp,y2,9,EMF));
  s+=fade(seg(p,.5,.6),label('傾き 0 → ℰ ＝ 0',xp-16,y2-30,{size:28,color:EMF,weight:700,anchor:'end'}));
  s+=goalTag(G2);
  return s;
 },
 // 11. ω＝2π×25≈157 を枠で強調。振幅の計算を一行で。ℰ のグラフの山に「約 24 V」
 [K+'amp']:(p,ctx)=>{
  const b=atWord(ctx,'しんぷくは',.45);
  const x0=90,w=520,ym=300,A=130;
  let s=waveAxes(x0,ym,w,A,'ℰ',EMF)+wave(x0,ym,w,A,Math.sin,{color:EMF});
  const xpk=x0+w/8;
  s+=fade(seg(p,b+.3,b+.4),dot(xpk,ym-A,8,EMF)+LB('約 24 V',xpk+40,ym-A-16,28,EMF,{anchor:'start'}));
  s+=panel(100,380,T(`${om}=2\\pi\\times25\\approx157\\ \\mathrm{rad/s}`,PC,175,34)+highlight(PX+30,130,PW-60,80,seg(p,.05,.15),NC)
   +fade(seg(p,b,b+.08),line(PX+40,240,PX+PW-40,240,{color:C.faint,w:2})+LN('振幅 NBAω',PC,285,24)+T(`150\\times0.05\\times0.02\\times157`,PC,345,32)
   +T(`\\approx${cs(EMF,'24\\ \\mathrm{V}')}`,PC,420,40)),seg(p,.02,.1));
  s+=goalTag(G2);
  return s;
 },
 // 12. 小問2 の答え C（0 V、24 V）
 [K+'ans2']:(p)=>{
  const x0=90,w=520,ym=300,A=130,xpk=x0+w/8;
  let s=waveAxes(x0,ym,w,A,'ℰ',EMF)+wave(x0,ym,w,A,Math.sin,{color:EMF})+dot(xpk,ym-A,8,EMF)+LB('約 24 V',xpk+40,ym-A-16,28,EMF,{anchor:'start'});
  s+=dot(x0,ym,9,PHI)+line(x0,ym,x0,ym+A+30,{color:PHI,w:2,dash:'6 5'})+label('Φ 最大の 瞬間（t ＝ 0）：ℰ ＝ 0 V',x0+10,ym+A+52,{size:24,color:PHI,weight:700});
  s+=panel(100,250,LB('Φ 最大の 瞬間 → ℰ ＝ 0 V',PC,170,28,EMF)+LB('振幅 ≈ 24 V',PC,250,30,EMF),1,C.hi);
  s+=goalTag(G2)+ANS2(seg(p,.03,.12));
  return s;
 },
 // 13. 「量」と「変化率」のカードを並べる。誤答 A
 [K+'wrongA2']:(p)=>{
  const x0=110,w=480,y1=170,y2=380,A=62,xp=x0+w/2;
  let s=waveAxes(x0,y1,w,A,'Φ',PHI)+waveAxes(x0,y2,w,A,'ℰ',EMF)+wave(x0,y1,w,A,Math.cos)+wave(x0,y2,w,A,Math.sin,{color:EMF});
  s+=dot(xp,y1-A,8,PHI)+line(xp,y1-A,xp,y2,{color:C.dim,w:2,dash:'7 6'})+dot(xp,y2,8,EMF);
  s+=card(PX,90,240,150,LN('量',PX+120,130,24)+LB('Φ は 最大',PX+120,190,26,PHI),1)+card(PX+260,90,240,150,LN('変化率',PX+380,130,24)+LB('dΦ/dt ＝ 0',PX+380,190,26,EMF),1);
  s+=wrongCard('A','24 V、24 V','磁束の 値と、その 変化率を 混同した',{...WOPT,y:262,g:seg(p,.03,.1)});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },
 // 14. 誤答 B → D（1枚ずつ）
 [K+'wrongBD2']:(p,ctx)=>{
  const W=wins(ctx,['ディーは']);
  const x0=90,w=520,ym=300,A=130,xpk=x0+w/8;
  let s=waveAxes(x0,ym,w,A,'ℰ',EMF)+wave(x0,ym,w,A,Math.sin,{color:EMF})+dot(xpk,ym-A,8,EMF)+LB('約 24 V',xpk+40,ym-A-16,28,EMF,{anchor:'start'});
  s+=panel(90,150,LN('振幅',PC,130,24)+T(`NBA${om}=150\\times0.05\\times0.02\\times157`,PC,195,28),1);
  s+=wrongSeq(p,ctx,[['B','0 V、3.8 V','ω で なく 25 を 掛けた'],['D','0 V、0.15 V','NBA（単位 Wb）の まま']],{win:W,opts:{...WOPT,y:262}});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },

 // ===================== 小問3 =====================
 // 15. レール・棒・抵抗の回路（棒は右へ一定の速さで動き続ける。画面では遅く）。右の枠に与えた量
 [K+'goal3']:(p,ctx)=>{
  let s=rails(rodX(ctx));
  s+=panel(90,300,LN('後半',PC,135,24)+LB('奥向き（⊗）0.4 T',PC,195,28,BC)+LB('棒 ℓ ＝ 0.25 m、右へ 2 m/s',PC,250,26,C.ink)+LB('左端に 0.5 Ω',PC,305,28,SURF)
   +fade(seg(p,.4,.5),line(PX+40,335,PX+PW-40,335,{color:C.faint,w:2})+LB('速さを 保つ 手の 仕事率 は？',PC,372,26,C.hi)),seg(p,.03,.15));
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 16. 1秒で増える面積の帯（金）。2026-10-16（PQ-049）：札を「面積が 増える 速さ」、単位を m²/s に。0.5 m²/s×0.4 T＝0.2 Wb/s → ℰ＝0.2 V
 [K+'blv']:(p,ctx)=>{
  const b=atWord(ctx,'ビーを',.55),xr=rodX(ctx);
  let s=rails(xr,{strip:seg(p,.05,.15),lG:1,vG:1});
  s+=fade(seg(p,.08,.18),LB('1 秒で 2 m 進む',xr-55,RL.yb+70,24,TC)+note('（横は 縮めて 描いています）',375,505));
  s+=panel(100,330,LN('面積が 増える 速さ',PC,145,24)+T(`0.25\\times2=${cs(TC,'0.5\\ \\mathrm{m^2/s}')}`,PC,205,36)
   +fade(seg(p,b,b+.08),line(PX+40,250,PX+PW-40,250,{color:C.faint,w:2})+T(`0.5\\ \\mathrm{m^2/s}\\times0.4\\ \\mathrm{T}=0.2\\ \\mathrm{Wb/s}`,PC,300,30))
   +fade(seg(p,b+.15,b+.23),T(`${EM}=${cs(BC,'B')}\\ell ${cs(EMF,'v')}=${cs(EMF,'0.2\\ \\mathrm{V}')}`,PC,385,40)),seg(p,.02,.1));
  s+=goalTag(G3);
  return s;
 },
 // 17. 棒の中を下から上へ流れる電流 0.4 A。棒に左向きの太い緑の矢印 0.04 N
 [K+'force']:(p,ctx)=>{
  const b=atWord(ctx,'ぼうは',.5);
  let s=rails(rodX(ctx),{vG:1,lG:0,cur:seg(p,.05,.15),curLab:seg(p,.1,.18),fL:seg(p,b,b+.08)});
  s+=panel(100,300,LN('電流',PC,140,24)+T(`${cs(CI,'I')}=\\dfrac{0.2}{0.5}=${cs(CI,'0.4\\ \\mathrm{A}')}`,PC,205,36)
   +fade(seg(p,b,b+.08),line(PX+40,255,PX+PW-40,255,{color:C.faint,w:2})+LN('棒が 受ける 力（動きと 逆向き）',PC,295,24)+T(`I\\ell B=0.4\\times0.25\\times0.4=${cs(C.F,'0.04\\ \\mathrm{N}')}`,PC,360,30)),seg(p,.02,.1));
  s+=goalTag(G3);
  return s;
 },
 // 18. 手が棒を右へ押す 0.04 N。手の仕事率の棒（橙）0.08 W。答えの札「小問3 の答え：B（0.08 W）」
 [K+'ans3']:(p,ctx)=>{
  const bp=atWord(ctx,'しごとりつは',.5),ba=atWord(ctx,'しょうもん',.8);
  let s=rails(rodX(ctx),{vG:1,lG:0,cur:1,fL:1,fR:seg(p,.05,.15)});
  s+=panel(100,380,LN('速さを 保つ → 手で 0.04 N',PC,140,24)+fade(seg(p,bp,bp+.08),T(`P=0.04\\times2=${cs(WC,'0.08\\ \\mathrm{W}')}`,PC,205,36))
   +pbar(PC,440,160,'手の 仕事率','0.08 W',{g:seg(p,bp+.05,bp+.15)}),seg(p,.02,.1));
  s+=goalTag(G3)+ANS3(seg(p,ba,ba+.08));
  return s;
 },
 // 19. 電気の仕事率の棒 0.08 W を手の棒の横に並べ、同じ高さを黄の横線で結ぶ
 [K+'elec']:(p,ctx)=>{
  let s=rails(rodX(ctx),{vG:1,lG:0,cur:1,fL:1,fR:1});
  s+=panel(100,380,T(`0.2\\ \\mathrm{V}\\times0.4\\ \\mathrm{A}=${cs(WC,'0.08\\ \\mathrm{W}')}`,PC,150,32)
   +pbar(PC-110,440,160,'手の 仕事率','0.08 W')+pbar(PC+110,440,160,'電気の 仕事率','0.08 W',{g:seg(p,.1,.2)})
   +fade(seg(p,.3,.4),line(PC-170,280,PC+170,280,{color:PHI,w:3,dash:'8 6'})),1);
  s+=goalTag(G3)+ANS3(1);
  return s;
 },
 // 20. 左向きの力の矢印を黄で光らせる。誤答 A
 [K+'wrongA3']:(p,ctx)=>{
  let s=rails(rodX(ctx),{vG:1,lG:0,cur:1,fL:1,fLHi:seg(p,.05,.15)});
  s+=panel(90,150,LB('磁気力 IℓB（動きと 逆向き）',PC,140,26,C.F)+LB('0.04 N',PC,190,28,C.F),1);
  s+=wrongCard('A','0 W','棒は 動きと 逆向きに 0.04 N を 受ける',{...WOPT,y:262,g:seg(p,.03,.1)});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },
 // 21. 誤答 C → D（1枚ずつ）。右上の答えの札3枚を並べて終わる
 [K+'wrongCD3']:(p,ctx)=>{
  const W=wins(ctx,['ディーは']),ve=voiceEnd(ctx),gr=seg(p,ve+.02,ve+.1);
  let s=rails(rodX(ctx),{vG:1,lG:0,cur:1,fL:1,fR:1});
  s+=panel(90,150,LN('仕事率 ＝ 力 × 速さ',PC,135,24)+T(`0.04\\ \\mathrm{N}\\times2\\ \\mathrm{m/s}=0.08\\ \\mathrm{W}`,PC,195,30),1);
  s+=wrongSeq(p,ctx,[['C','0.04 W',['力の 数の まま','（速さを 掛けていない。単位 N）']],['D','0.01 W','0.04×0.25（単位 N·m）']],{win:W,opts:{...WOPT,y:262}});
  s+=fade(1-gr,goalTag(G3)+ANS3(1));
  s+=answerRow([[1,'A','6 V、時計回り'],[2,'C','0 V、24 V'],[3,'B','0.08 W']],{g:gr,size:22});
  return s;
 },
};

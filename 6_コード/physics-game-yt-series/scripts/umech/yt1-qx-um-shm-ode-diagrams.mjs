// 問題編 解説「でこぼこの谷の小さな揺れ」（q-um-shm-ode、大学編 09 振動の方程式・上級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/09_振動の方程式.md の q-um-shm-ode（解説 15 行）。
// 画面の配置：左に U–x グラフ（谷の拡大・s–U の放物線）、右に説明の枠。誤答カードは右の枠の下に1枚ずつ。
// 札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 色（正本の単元の色）：位置 x・ずれ s 水色、速度 紫、ω 桃、周期 T 金、U 橙（K は濃い橙、U は薄い橙）、近似の放物線 黄、誤り 赤。
import {C,clamp,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,pauseBadge,note,cueT,tAt,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-um-shm-ode:';
const CX=C.x,CV=C.v,CT=C.t,CW=C.p,CU=C.E,CK='#ff8a3d',CUL='#ffd2a6',CD='#ff6b6b';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const WW=`{\\color{${CW}}\\omega}`;
const PX=680,PW=500,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const G1='ω と T',G2='s＝0.04 m での速さ',G3='正しい説明';
const ANS1=g=>answerTag(1,'A','ω＝4 rad/s、T＝π/2 s',{g}),ANS2=g=>answerTag(2,'B','0.12 m/s',{g}),ANS3=g=>answerTag(3,'D','',{g});
const U=x=>16/x+4*x,PAR=x=>16+2*(x-2)**2;
const WD=2;   // 揺れを描く角振動数（ゆっくり。実際は 4 rad/s）
const SLOW=(x,y,g=1)=>note('動きは ゆっくり 描いています',x,y,{g});
function atWord(ctx,word,fb=.5){
 const r=(ctx?.cue?.reading??'').replace(/\s/g,''),i=r.indexOf(word.replace(/\s/g,''));
 return i<0?fb:i/Math.max(1,r.length)*voiceEnd(ctx);
}

// ---- U–x グラフ（目盛りは端の値だけ。谷底の値は出さない）----
function ugraph({x0=80,y0=460,w=480,h=320,xmin=0,xmax=5.2,umin=12,umax=36,g=1,ends=1,from=.5,to=5,p=1,ylab='U [J]',xlab='x [m]'}={}){
 const X=x=>x0+w*(x-xmin)/(xmax-xmin),Y=u=>y0-h*(u-umin)/(umax-umin);
 let s=arrow(x0-6,y0,x0+w+24,y0,{color:CX,w:2.5,head:14})+arrow(x0,y0+6,x0,y0-h-18,{color:C.dim,w:2.5,head:14});
 s+=label(xlab,x0+w+30,y0+8,{size:24,color:CX})+label(ylab,x0,y0-h-30,{size:24,color:CU,anchor:'middle'});
 if(ends)for(const u of [.5,5])if(u>=xmin&&u<=xmax)s+=line(X(u),y0-6,X(u),y0+6,{color:CX})+label(String(u),X(u),y0+30,{size:22,color:CX,anchor:'middle'});
 const plot=(fn,{a=from,b=to,pp=p,color=CU,lw=4.5,dash=''}={})=>draw(Array.from({length:181},(_,i)=>{const u=a+(b-a)*i/180;return [X(u),Y(fn(u))];}),pp,{color,w:lw,dash});
 return {svg:fade(g,s),X,Y,plot};
}
const ball=(G,x,{r=14,g=1,color=C.dim}={})=>fade(g,ring(G.X(x),G.Y(U(x))-r,r,{color:C.ink,w:2.5,fill:color}));
// 谷の拡大（x 1〜3）
const ZG=(o={})=>ugraph({x0:80,y0:440,w:480,h:300,xmin:1,xmax:3,umin:15.5,umax:20.5,ends:0,from:1.05,to:3,...o});
// s–U の放物線（単振動の近似。U は谷底から測る）
function sgraph({g=1,x0=80,y0=440,w=520,h=320}={}){
 const X=s=>x0+w/2+s*(w/2)/.07,Y=u=>y0-h*u/.012;
 let s=arrow(x0-6,y0,x0+w+20,y0,{color:CX,w:2.5,head:14})+arrow(X(0),y0+6,X(0),y0-h-18,{color:C.dim,w:2.5,head:14});
 s+=label('s [m]',x0+w+26,y0+8,{size:24,color:CX})+label('谷底から 測った U [J]',X(0),y0-h-30,{size:24,color:CU,anchor:'middle'});
 for(const v of [-.05,.05])s+=line(X(v),y0-6,X(v),y0+6,{color:CX})+label(v>0?'0.05':'−0.05',X(v),y0+30,{size:22,color:CX,anchor:'middle'});
 s+=draw(Array.from({length:121},(_,i)=>{const v=-.065+.13*i/120;return [X(v),Y(2*v*v)];}),1,{color:C.hi,w:4.5});
 return {svg:fade(g,s),X,Y};
}
const sball=(S,v,{g=1,r=13}={})=>fade(g,ring(S.X(v),S.Y(2*v*v)-r,r,{color:C.ink,w:2.5,fill:C.dim}));
// K と U の棒（1本に積む。下が U・上が K。合計はいつも同じ高さ）
function bars(Uv,{x=PX+50,base=455,hpj=46000,g=1,vals=0}={}){
 const tot=.005,uh=Uv*hpj,kh=(tot-Uv)*hpj,w=100;
 let s=rect(x,base-uh,w,uh,{fill:CUL,fo:.9,stroke:'none',rx:3})+rect(x,base-uh-kh,w,kh,{fill:CK,fo:.9,stroke:'none',rx:3});
 s+=line(x-12,base-tot*hpj,x+w+12,base-tot*hpj,{color:C.ink,w:2,dash:'6 5'})+line(x-12,base,x+w+12,base,{color:C.dim,w:2});
 s+=label('K',x+w+16,base-uh-kh/2+9,{size:26,color:CK,weight:700})+label('U',x+w+16,base-uh/2+9,{size:26,color:CUL,weight:700});
 if(vals)s+=fade(vals,label(Uv.toFixed(4),x+w/2,base-uh/2+8,{size:22,color:'#3a2410',anchor:'middle',weight:700})+(kh>30?label((tot-Uv).toFixed(4),x+w/2,base-uh-kh/2+8,{size:22,color:'#3a2410',anchor:'middle',weight:700}):''));
 return fade(g,s);
}

export const ytQxUmShmOdeDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（6 s）：0〜2 s 軸と U の曲線（左から右へ）。2〜5 s 谷の少し横に玉を置き、谷底のまわりを小さく往復（大きく誇張）。
 // 5〜6 s 札「0.25 kg」「振幅 0.05 m」「摩擦なし」。6 s で映像を一時停止（玉は止まっていない）。谷底の値・接線・放物線・ω・周期は出さない。
 [K+'q1']:(p,ctx)=>{
  const t=cueT(ctx),G=ugraph({x0:250,y0:480,w:700,h:400,g:seg(t,0,.5),p:seg(t,.3,2)});
  let s=G.svg+G.plot(U,{pp:seg(t,.3,2)});
  s+=fade(seg(t,1.6,2),T(`{\\color{${CU}}U}=\\dfrac{16}{x}+4x`,640,150,34));
  const xbb=t<2.2?2.35:2+.35*Math.cos(2.4*(Math.min(t,5)-2.2));
  s+=ball(G,xbb,{g:seg(t,2,2.3)})+note('往復の 幅は 大きく 誇張',G.X(2),G.Y(16)+60,{g:seg(t,2.3,2.7)});
  [['0.25 kg',0],['振幅 0.05 m',1],['摩擦なし',2]].forEach(([tx,i])=>{s+=card(960,170+i*70,220,56,label(tx,1070,207+i*70,{size:26,color:C.ink,anchor:'middle',weight:700}),seg(t,5+.15*i,5.3+.15*i));});
  s+=pauseBadge({g:seg(t,5.8,5.95),x:600,y:8});
  return s;
 },

 // ===================== 小問1 =====================
 // 1. 出題の最後の画面（U–x グラフと玉、札）。「求めるもの」
 [K+'goal1']:(p)=>{
  const G=ugraph({x0:250,y0:480,w:700,h:400});
  let s=G.svg+G.plot(U)+T(`{\\color{${CU}}U}=\\dfrac{16}{x}+4x`,640,150,34);
  s+=ball(G,2+.35*Math.cos(2.4*2.8))+note('往復の 幅は 大きく 誇張',G.X(2),G.Y(16)+60);
  [['0.25 kg',0],['振幅 0.05 m',1],['摩擦なし',2]].forEach(([tx,i])=>{s+=card(960,170+i*70,220,56,label(tx,1070,207+i*70,{size:26,color:C.ink,anchor:'middle',weight:700}),1);});
  s+=pauseBadge({x:600,y:8});
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 2. 近似。谷の拡大に放物線（黄）。先に a と U″(a) の札、そのあと ω²＝U″(a)/m。2文目で「ばね定数＝U″(a)」
 [K+'formula']:(p,ctx)=>{
  const G=ZG(),W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=G.svg+G.plot(U)+fade(seg(p,.05,.2),G.plot(PAR,{a:1.2,b:2.8,color:C.hi,lw:3.5}));
  s+=fade(seg(p,.03,.12),line(G.X(2),G.Y(16),G.X(2),440,{color:C.dim,w:2,dash:'6 6'})+label('a',G.X(2),470,{size:28,color:CX,anchor:'middle',weight:700}));
  s+=fade(seg(p,.05,.2),label('放物線（近似）',G.X(2.45),G.Y(19.6),{size:24,color:C.hi,weight:700}));
  s+=panel(90,380,kindTag('近似',PC,135)
   +fade(seg(p,.03,.12),label('a ＝ 谷底の 位置',PC,195,{size:26,color:CX,anchor:'middle',weight:700}))
   +fade(seg(p,.08,.17),label('U″(a) ＝ 谷底での U の 2回微分',PC,240,{size:26,color:CU,anchor:'middle',weight:700})+label('（曲がりの 強さ）',PC,276,{size:24,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.2,.3),T(`${WW}^2=\\dfrac{U''(a)}{m}`,PC,345,36))
   +fade(seg(p,b+.05,b+.12),label('ばね定数 ＝ U″(a)',PC,445,{size:28,color:C.hi,anchor:'middle',weight:700})),1,C.faint);
  s+=goalTag(G1);
  return s;
 },
 // 3. 16/x＝16x⁻¹ → 肩が −1→−2→−3。U′(2)＝0（水平な接線）、U″(2)＝32/8＝4（正 → 谷）
 [K+'deriv']:(p,ctx)=>{
  const G=ugraph({}),b=atWord(ctx,'ユーツーダッシュ',.5);
  let s=G.svg+G.plot(U);
  s+=fade(seg(p,b-.1,b),line(G.X(1.3),G.Y(16),G.X(2.7),G.Y(16),{color:C.hi,w:4})+dot(G.X(2),G.Y(16),8,C.hi)+label('x ＝ 2',G.X(2),G.Y(16)+40,{size:26,color:CX,anchor:'middle',weight:700})+label('U′ ＝ 0',G.X(2.75),G.Y(16)+8,{size:24,color:C.hi,weight:700}));
  const e=(n,c)=>`{\\color{${c}}${n}}`;
  s+=panel(90,385,T(`\\dfrac{16}{x}=16x^{${e(-1,C.hi)}}`,PC,145,34)
   +fade(seg(p,.08,.18),T(`U'=-16x^{${e(-2,C.hi)}}+4`,PC,210,34))
   +fade(seg(p,b,b+.08),T(`U''=32x^{${e(-3,C.hi)}}=\\dfrac{32}{x^3}`,PC,280,34))
   +fade(seg(p,.25,.35),line(PX+40,320,PX+PW-40,320,{color:C.faint,w:2})+T(`U'(2)=-\\dfrac{16}{4}+4=0`,PC,365,32))
   +fade(seg(p,b+.15,b+.25),T(`U''(2)=\\dfrac{32}{8}=4`,PC,435,32)+label('（正 → 谷）',PC+135,442,{size:24,color:C.F,weight:700})),1,C.faint);
  s+=goalTag(G1);
  return s;
 },
 // 4. ω²＝16、ω＝4。谷で揺れる玉と、ω で回る点の円。T＝π/2≈1.57 s（金）。答えの札
 [K+'ans1']:(p,ctx)=>{
  const t=tAt(ctx,K+'ans1'),G=ZG(),W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=G.svg+G.plot(U)+ball(G,2+.6*Math.cos(WD*t))+note('揺れの 幅は 大きく 誇張',G.X(2),475);
  const cx=520,cy=170,r=50,a=WD*t;
  s+=ring(cx,cy,r,{color:C.faint,w:2.5})+line(cx,cy,cx+r*Math.cos(a),cy-r*Math.sin(a),{color:CW,w:3})+dot(cx+r*Math.cos(a),cy-r*Math.sin(a),9,CW)+label('ω ＝ 4 rad/s',cx,cy+r+30,{size:22,color:CW,anchor:'middle',weight:700});
  s+=SLOW(330,505);
  s+=panel(90,380,T(`${WW}^2=\\dfrac{4}{0.25}=16`,PC,150,36)
   +fade(seg(p,.2,.3),T(`${WW}=4\\ \\mathrm{rad/s}`,PC,225,36))
   +fade(seg(p,.32,.42),line(PX+40,265,PX+PW-40,265,{color:C.faint,w:2})+T(`{\\color{${CT}}T}=\\dfrac{2\\pi}{4}=\\dfrac{\\pi}{2}`,PC,325,36))
   +fade(seg(p,.42,.5),T(`\\approx{\\color{${CT}}1.57\\ \\mathrm{s}}`,PC,410,36)),1,C.faint);
  s+=goalTag(G1)+ANS1(seg(p,b,b+.06));
  return s;
 },
 // 5. 誤答 B（ω＝16）→ C（ω＝1）
 [K+'wrongBC']:(p,ctx)=>{
  const t=tAt(ctx,K+'ans1'),G=ZG(),m=atWord(ctx,'エムで',.5);
  let s=G.svg+G.plot(U)+ball(G,2+.6*Math.cos(WD*t))+note('揺れの 幅は 大きく 誇張',G.X(2),475)+SLOW(330,505);
  s+=panel(90,150,T(`${WW}^2=\\dfrac{U''(2)}{m}=\\dfrac{4}{0.25}=16`,PC,165,32),1,C.faint);
  s+=wrongSeq(p,ctx,[['B','ω＝16','16 は ω²。単位が 1/s²'],['C','ω＝1','U″ を m で割らずに掛けた']],{win:[[0,m],[m,1]],opts:{...WOPT,y:265}});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },
 // 6. 誤答 D（32/x² とした）。肩の −3 を光らせる
 [K+'wrongD']:(p,ctx)=>{
  const t=tAt(ctx,K+'ans1'),G=ZG();
  let s=G.svg+G.plot(U)+ball(G,2+.6*Math.cos(WD*t))+note('揺れの 幅は 大きく 誇張',G.X(2),475)+SLOW(330,505);
  const f=`U''=\\dfrac{32}{x^{\\color{${C.hi}}3}}`;
  s+=panel(90,150,T(f,PC,150,34)+label('微分の たびに 肩が 1つ 下がる',PC,222,{size:22,color:C.hi,weight:700,anchor:'middle'}),1,C.faint);
  s+=wrongCard('D','ω≈5.7','32/x² とした。肩が 1 つ下がって 32/x³',{...WOPT,y:265,g:seg(p,.03,.1)});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },

 // ===================== 小問2 =====================
 // 7. 単振動の近似（放物線）。s＝0.04 の位置に印
 [K+'goal2']:(p)=>{
  const S=sgraph();
  let s=S.svg+kindTag('近似',190,140,{text:'単振動'});
  s+=fade(seg(p,.3,.45),line(S.X(.04),440,S.X(.04),S.Y(.0032),{color:CX,w:3,dash:'6 6'})+dot(S.X(.04),S.Y(.0032),9,CX)+label('s ＝ 0.04',S.X(.04)+12,S.Y(.0032)-14,{size:24,color:CX,weight:700}));
  s+=panel(90,250,label('小問2',PC,140,{size:28,color:C.dim,anchor:'middle'})+label('s ＝ 0.04 m での 速さ は？',PC,205,{size:30,color:C.hi,anchor:'middle',weight:700})
   +label('（単振動と みなす。振幅 0.05 m）',PC,265,{size:24,color:C.dim,anchor:'middle'}),seg(p,.05,.2),C.hi);
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 8. K＋U は一定（棒の合計の高さは同じ）。½×4×0.05²＝0.005 J。端では全部 U
 [K+'energy']:(p,ctx)=>{
  const t=tAt(ctx,K+'energy'),S=sgraph(),v=.05*Math.cos(WD*t);
  let s=S.svg+sball(S,v)+kindTag('近似',190,140,{text:'単振動'})+SLOW(330,505);
  s+=panel(90,385,bars(2*v*v)
   +label('K ＋ U ＝ 一定',PC+70,140,{size:28,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.35,.45),T(`\\tfrac12\\times4\\times0.05^2`,PC+70,215,32))
   +fade(seg(p,.5,.6),T(`=0.005\\ \\mathrm{J}`,PC+70,285,34,{color:CU}))
   +fade(seg(p,.6,.7),label('端（s ＝ 0.05）では 全部 U',PC+70,365,{size:24,color:CUL,anchor:'middle',weight:700})),1,C.faint);
  s+=goalTag(G2);
  return s;
 },
 // 9. s＝0.04 を通る瞬間で映像を一時停止。U＝0.0032 J、K＝0.0018 J
 [K+'split']:(p,ctx)=>{
  const S=sgraph(),b=atWord(ctx,'のこりの',.5);
  let s=S.svg+sball(S,.04)+kindTag('近似',190,140,{text:'単振動'});
  s+=line(S.X(.04),440,S.X(.04),S.Y(.0032),{color:CX,w:3,dash:'6 6'})+label('s ＝ 0.04',S.X(.04)+12,S.Y(.0032)+8,{size:24,color:CX,weight:700});
  s+=pauseBadge({x:490,y:150});
  s+=panel(90,385,bars(.0032,{vals:seg(p,b,b+.08)})
   +T(`{\\color{${CUL}}U}=\\tfrac12\\times4\\times0.04^2`,PC+70,160,30)+T(`=0.0032\\ \\mathrm{J}`,PC+70,225,32,{color:CUL})
   +fade(seg(p,b,b+.08),line(PX+170,265,PX+PW-30,265,{color:C.faint,w:2})+T(`{\\color{${CK}}K}=0.005-0.0032`,PC+70,315,30)+T(`=0.0018\\ \\mathrm{J}`,PC+70,385,32,{color:CK})),1,C.faint);
  s+=goalTag(G2);
  return s;
 },
 // 10. ½×0.25×v²＝0.0018 → v＝0.12 m/s。玉に速度の矢印（紫）。答えの札
 [K+'ans2']:(p,ctx)=>{
  const S=sgraph(),W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=S.svg+sball(S,.04)+kindTag('近似',190,140,{text:'単振動'})+pauseBadge({x:490,y:150});
  s+=fade(seg(p,.35,.45),arrow(S.X(.04),S.Y(.0032)-13,S.X(.04)-110,S.Y(.0032)-13-110*.33,{color:CV,w:6,head:16})+label('v',S.X(.04)-125,S.Y(.0032)-60,{size:28,color:CV,weight:700}));
  s+=panel(90,385,T(`\\tfrac12\\times0.25\\times{\\color{${CV}}v}^2=0.0018`,PC,150,32)
   +fade(seg(p,.12,.2),T(`{\\color{${CV}}v}^2=0.0144`,PC,220,32))
   +fade(seg(p,.22,.32),T(`{\\color{${CV}}v}=0.12\\ \\mathrm{m/s}`,PC,290,38,{color:CV}))
   +fade(seg(p,.4,.5),line(PX+40,330,PX+PW-40,330,{color:C.faint,w:2})+label('同じ 値：',PC,375,{size:22,color:C.dim,anchor:'middle'})+T(`${WW}\\sqrt{A^2-s^2}=4\\times0.03=0.12`,PC,425,30)),1,C.faint);
  s+=goalTag(G2)+ANS2(seg(p,b,b+.06));
  return s;
 },
 // 11. 誤答 A → C → D を1枚ずつ
 [K+'wrong2']:(p,ctx)=>{
  const S=sgraph(),W=sentWin(ctx),m=atWord(ctx,'れいてんいちろくは',.25);
  let s=S.svg+sball(S,.04)+kindTag('近似',190,140,{text:'単振動'});
  s+=arrow(S.X(.04),S.Y(.0032)-13,S.X(.04)-110,S.Y(.0032)-13-110*.33,{color:CV,w:6,head:16});
  s+=panel(90,150,T(`{\\color{${CV}}v}=${WW}\\sqrt{A^2-s^2}=0.12\\ \\mathrm{m/s}`,PC,165,30),1,C.faint);
  s+=wrongSeq(p,ctx,[['A','0.2 m/s','谷底での最大の速さ ω×0.05'],['C','0.16 m/s',['ω×0.04。','速さは √(A²−s²) に比例']],['D','0.03 m/s','ω を掛け忘れた。単位が m']],{win:[[0,m],[m,W[0][1]],[W[1]?W[1][0]:.6,1]],opts:{...WOPT,y:265}});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },

 // ===================== 小問3 =====================
 // 12. U–x グラフ全体に戻す
 [K+'goal3']:(p)=>{
  const G=ugraph({});
  let s=G.svg+G.plot(U)+ball(G,2.15);
  s+=panel(90,250,label('小問3',PC,140,{size:28,color:C.dim,anchor:'middle'})+label('この 揺れに ついて',PC,200,{size:30,color:C.hi,anchor:'middle',weight:700})
   +label('正しい 説明 は？',PC,248,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 13. ずれを 0.05、0.5、1.0 m と大きくすると、放物線（黄）と U（橙）が離れる。左右で離れ方が違う。答えの札
 [K+'big']:(p,ctx)=>{
  const G=ugraph({}),W=sentWin(ctx),b=W[1]?W[1][0]:.55;
  let s=G.svg+G.plot(U)+G.plot(PAR,{a:.95,b:3.4,color:C.hi,lw:3.5});
  const ds=[.05,.5,1];
  ds.forEach((d,i)=>{const g=seg(p,.05+.08*i,.12+.08*i),gl=i===2?1:1-seg(p,.13+.08*i,.18+.08*i);
   s+=fade(g*Math.max(.35,gl),line(G.X(2-d),G.Y(12),G.X(2-d),G.Y(PAR(2-d)),{color:CX,w:2,dash:'5 6'})+line(G.X(2+d),G.Y(12),G.X(2+d),G.Y(PAR(2+d)),{color:CX,w:2,dash:'5 6'}));
   s+=fade(g*gl,label(`ずれ ${d} m`,G.X(2),G.Y(12)-14-30*0,{size:22,color:CX,anchor:'middle',weight:700}));});
  const hl=seg(p,.32,.4);
  s+=fade(hl,line(G.X(1),G.Y(PAR(1)),G.X(1),G.Y(U(1)),{color:CD,w:6})+line(G.X(3),G.Y(PAR(3)),G.X(3),G.Y(U(3)),{color:CD,w:6})
   +label('左：U が 上',G.X(1)+14,G.Y(26),{size:22,color:CD,weight:700})+label('右：U が 下',G.X(3)+12,G.Y(U(3))+30,{size:22,color:CD,weight:700}));
  s+=fade(seg(p,.4,.48),card(G.X(.6),95,290,52,label('ここから 単振動 ではない',G.X(.6)+145,130,{size:24,color:CD,anchor:'middle',weight:700}),1,CD));
  s+=panel(90,385,label('大きな ずれ',PC,135,{size:26,color:C.dim,anchor:'middle'})
   +T(`U=16+2s^2{\\color{${CD}}-s^3+\\cdots}`,PC,200,34)
   +fade(seg(p,.2,.3),label('捨てた 3次 以上の 項 が 効く',PC,265,{size:26,color:CD,anchor:'middle',weight:700}))
   +fade(seg(p,.3,.4),label('力が ずれに 比例 しない',PC,320,{size:26,color:C.ink,anchor:'middle',weight:700}))
   +fade(seg(p,b,b+.08),label('周期は 振幅で 変わりうる',PC,400,{size:28,color:C.hi,anchor:'middle',weight:700})),1,C.faint);
  s+=goalTag(G3)+ANS3(seg(p,b+.15,b+.22));
  return s;
 },
 // 14. 誤答 A（等時性）→ B（摩擦）。B のとき、だんだん小さくなる揺れ
 [K+'wrongAB']:(p,ctx)=>{
  const G=ugraph({}),m=atWord(ctx,'まさつが',.5),inB=seg(p,m+.01,m+.05);
  let s=G.svg+G.plot(U)+G.plot(PAR,{a:.95,b:3.4,color:C.hi,lw:3.5});
  s+=card(G.X(.6),95,290,52,label('ここから 単振動 ではない',G.X(.6)+145,130,{size:24,color:CD,anchor:'middle',weight:700}),1,CD);
  s+=fade(1-inB,panel(90,150,label('等時性 ＝ 小さな 揺れ だけ',PC,175,{size:28,color:C.ink,anchor:'middle',weight:700}),1,C.faint));
  // 小さくなる揺れ（摩擦あり）
  const x0=PX+30,y0=165,w=PW-60,dec=draw(Array.from({length:161},(_,i)=>{const u=i/160;return [x0+w*u,y0-55*Math.exp(-2.6*u)*Math.cos(18*u)];}),seg(p,m+.02,m+.25),{color:CX,w:3});
  s+=fade(inB,panel(90,150,dec+label('摩擦あり：揺れは 小さくなる',PC,232,{size:22,color:C.dim,anchor:'middle'}),1,C.faint));
  s+=wrongSeq(p,ctx,[['A','振幅によらず π/2 s','等時性は小さな揺れのときだけ'],['B','摩擦でも K＋U 一定','摩擦でエネルギーは周りへ移る']],{win:[[0,m],[m,1]],opts:{...WOPT,y:265}});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },
 // 15. 谷底 x＝2 に静止した物体。誤答 C。声のあと、まとめの図と答えの札3枚で静止
 [K+'wrongC']:(p,ctx)=>{
  const ve=voiceEnd(ctx),sum=seg(p,ve+.02,ve+.08),pre=1-sum;
  let s='';
  if(pre>0){
   const G=ugraph({});
   let a=G.svg+G.plot(U)+ball(G,2,{color:'#4a5a78'});
   a+=panel(90,150,label('谷底に 静かに 置く（x ＝ 2、v ＝ 0）',PC,145,{size:26,color:C.ink,anchor:'middle',weight:700})+label('力 ＝ 0 → ずっと 止まった まま',PC,200,{size:26,color:C.hi,anchor:'middle',weight:700}),1,C.faint);
   a+=wrongCard('C','x＝2 でも π/2 s で振動','位置も速度も谷底のままなら止まったまま',{...WOPT,y:265,g:seg(p,.03,.1)});
   a+=goalTag(G3)+ANS3(1);
   s+=fade(pre,a);
  }
  if(sum>0){
   const G=ugraph({x0:70,w:470});
   let z=G.svg+G.plot(U)+G.plot(PAR,{a:.95,b:3.4,color:C.hi,lw:3.5})+dot(G.X(2),G.Y(16),9,C.hi)+label('谷 x ＝ 2',G.X(2),G.Y(16)+38,{size:24,color:CX,anchor:'middle',weight:700});
   z+=card(G.X(.6),95,290,52,label('ここから 単振動 ではない',G.X(.6)+145,130,{size:24,color:CD,anchor:'middle',weight:700}),1,CD);
   z+=arrow(G.X(2)+20,G.Y(16)-10,640,170,{color:C.dim,w:3,head:12})+arrow(G.X(2)+20,G.Y(16)+10,640,380,{color:C.dim,w:3,head:12});
   z+=card(650,100,520,140,T(`U''(2)=4\\ \\rightarrow\\ ${WW}=4\\ \\mathrm{rad/s}`,910,150,30)+T(`{\\color{${CT}}T=\\dfrac{\\pi}{2}\\ \\mathrm{s}}`,910,210,30),1);
   z+=card(650,300,520,140,T(`K+U=0.005\\ \\mathrm{J}`,910,350,30,{color:CU})+T(`\\rightarrow\\ {\\color{${CV}}v=0.12\\ \\mathrm{m/s}}\\ (s=0.04)`,910,410,28),1);
   z+=answerRow([[1,'A',''],[2,'B','0.12 m/s'],[3,'D','']],{g:seg(p,ve+.1,ve+.16)});
   s+=fade(sum,z);
  }
  return s;
 },
};

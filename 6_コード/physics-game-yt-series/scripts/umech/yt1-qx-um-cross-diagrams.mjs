// 問題編 解説「斜めのトルクと、曲げられる負電荷」（q-um-cross、大学編 07 外積・上級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/07_外積.md の q-um-cross（解説 15 行）。
// 画面：左に斜め上から見た3次元の図（x 右・y 奥・z 上、軸の先に x・y・z）、右に説明の枠（2段の表とたすき掛け）。誤答カードは枠の下に1枚ずつ。
// 色：𝐫 水色、𝐅₁ 緑、𝐍 黄、𝐫 と 𝐅₁ の面 薄い黄、𝐯 紫、𝐁 橙、q 桃（粒子は負電荷なので青）、𝐯×𝐁 灰、𝐅₂ 緑、誤り 赤。
// 図のために決めた長さ（向きは成分どおり、長さは見やすさのため縮めた）：𝐫・𝐅₁ は成分×0.45、𝐍 は成分×0.12、𝐯 は成分×0.3、𝐯×𝐁 と 𝐅₂ は成分×0.16。
//   斜投影なので、画面の上では直角が直角に見えない（直角の印は「⊥」の札で示す）。
import {C,clamp,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,texWidth,poly} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongSeq,cueT,sentWin,voiceEnd} from './yt1-qx-common.mjs';
import {RAD,T,cs,view,V3,L3,axes3,ball,sceneTag} from './yt1-qx-um-cross-parts.mjs';

const K='qx-um-cross:';
const CR=C.x,CF=C.F,CN=C.hi,CV=C.v,CB=C.E,CQ=C.p,CG=C.dim,CD='#ff6b6b';
const PX=640,PW=540,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const P=view({ox:230,oy:360,u:120,ky:.6,ay:25*RAD});
const AX=(g=1)=>axes3(P,{xl:2.4,yl:2.6,zl:1.8,xn:.5,yn:.6,zn:.8,g});
const br=cs(CR,'\\mathbf{r}'),bF1=cs(CF,'\\mathbf{F}_1'),bF2=cs(CF,'\\mathbf{F}_2'),bN=cs(CN,'\\mathbf{N}'),bv=cs(CV,'\\mathbf{v}'),bB=cs(CB,'\\mathbf{B}'),q=cs(CQ,'q');
const TAG1='設定(1)：斜めの力のトルク',TAG2='設定(2)：磁気力（設定(1) とは別の場面）';
const G1='𝐍＝𝐫×𝐅₁',G2='トルクの大きさ',G3='磁気力 𝐅₂＝q𝐯×𝐁';
const ANS1=g=>answerTag(1,'D','(8, 3, −6) N·m',{g}),ANS2=g=>answerTag(2,'B','約 10.4 N·m',{g}),ANS3=g=>answerTag(3,'C','(0, −3, 4) N',{g});
const r0=[0,2,1],F0=[3,0,4],N0=[8,3,-6],v0=[0,4,3],B0=[2,0,0],X0=[0,6,-8],F20=[0,-3,4];
const sc=(a,k)=>a.map(x=>x*k);

// ---- 設定(1)：𝐫・𝐅₁（・𝐍・面）----
function set1({g=1,gR=1,gF=1,gN=0,plane=0,labs=1,perp=0}={}){
 const R=sc(r0,.45),F=sc(F0,.45),N=sc(N0,.12);
 let s=fade(plane*.9,poly([P(0,0,0),P(...R),P(R[0]+F[0],R[1]+F[1],R[2]+F[2]),P(...F)],{fill:C.hi,fo:.13,stroke:C.hi,sw:1.5}));
 s+=fade(gR,V3(P,[0,0,0],R,{color:CR,w:6,head:18}));
 const [rx,ry]=P(...R);s+=fade(gR*labs,T(br,rx+18,ry+10,34));
 s+=fade(gF,V3(P,[0,0,0],F,{color:CF,w:6,head:18}));
 const [fx,fy]=P(...F);s+=fade(gF*labs,T(bF1,fx+30,fy+12,34));
 if(gN>.001){s+=V3(P,[0,0,0],sc(N,gN),{color:CN,w:7,head:20});const [nx,ny]=P(...N);s+=fade(seg(gN,.7,1),T(bN,nx+22,ny+8,34));}
 if(perp>.001){const [nx,ny]=P(...sc(N,.5));s+=fade(perp,label('⊥ 𝐫、⊥ 𝐅₁',nx-14,ny+40,{size:24,color:CN,weight:700,anchor:'end'}));}
 return fade(g,s);
}
// ---- 設定(2)：粒子・𝐯・𝐁（・𝐯×𝐁 → 𝐅₂）----
function set2({g=1,gP=1,gV=1,gB=1,gQ=1,qOff=0,gG=0,flip=0,labs=1}={}){
 let s=fade(gB,[[-.5,.55],[-.5,-.55],[.8,.3]].map(([y,z])=>V3(P,[-.4,y,z],[2.1,y,z],{color:CB,w:3,head:13})).join(''));
 const [bx,by]=P(2.1,-.5,.55);s+=fade(gB*labs,T(bB,bx+22,by+10,32));
 const V=sc(v0,.3);s+=fade(gV,V3(P,[0,0,0],V,{color:CV,w:6,head:18}));
 const [vx,vy]=P(...V);s+=fade(gV*labs,T(bv,vx+20,vy+4,32));
 if(gG>.001){
  const k=flip>0?-.16*(1-.5*flip):.16,vec=sc(X0,k),col=flip>.5?CF:CG;
  s+=fade(gG,V3(P,[0,0,0],vec,{color:col,w:6+flip,head:18}));
  const [ex,ey]=P(...vec);
  if(flip<.05)s+=fade(gG,T(`${bv}\\times${bB}`,ex+44,ey+10,28));
  if(flip>.95)s+=T(bF2,ex-30,ey-4,32);
 }
 const [px,py]=P(0,0,0);
 s+=ball(px,py,{g:gP});
 const dx=-40*qOff,dy=34*qOff;
 s+=fade(gQ,`<g transform="translate(${dx.toFixed(1)} ${dy.toFixed(1)})">`+label('q ＝ −0.5 C',px-26,py+44,{size:26,color:CQ,anchor:'end',weight:700})+(qOff>.02?rect(px-188,py+16,170,40,{fill:CQ,fo:.08,stroke:CQ,sw:2.5,rx:8}):'')+'</g>');
 if(qOff>.5)s+=fade(seg(qOff,.6,1),label('後で 掛ける',px-143,py+108,{size:22,color:CQ,anchor:'middle'}));
 return fade(g,s);
}
// 問題アニメの右の札（与えた量）
function given(k,{g=1}={}){
 const rows=k===1?[`${br}=(0,\\ 2,\\ 1)\\ \\mathrm{m}`,`${bF1}=(3,\\ 0,\\ 4)\\ \\mathrm{N}`]:[`${q}=-0.5\\ \\mathrm{C}`,`${bv}=(0,\\ 4,\\ 3)\\ \\mathrm{m/s}`,`${bB}=(2,\\ 0,\\ 0)\\ \\mathrm{T}`];
 return card(740,150,420,60+rows.length*62,rows.map((r,i)=>T(r,950,205+i*62,34)).join(''),g);
}
// ---- 2段の表（x y z x y）とたすき掛け ----
const COLS=['x','y','z','x','y'];
function strip(top,bot,{x0=PX+40,y0=128,cw=82,rh=48,ct=CR,cb=CF,nt=br,nb=bF1,pair=-1,pairG=1,tasuki=0,rev=0,g=1}={}){
 const idx=[0,1,2,0,1];
 let s=T(nt,x0+18,y0+rh+8,30)+T(nb,x0+18,y0+2*rh+8,30);
 COLS.forEach((c,j)=>{const x=x0+60+cw*(j+.5);s+=label(c,x,y0+10,{size:24,color:j>2?C.faint:C.dim,anchor:'middle',weight:700});
  s+=label(String(top[idx[j]]).replace('-','−'),x,y0+rh+18,{size:30,color:j>2?C.dim:ct,anchor:'middle',weight:700});
  s+=label(String(bot[idx[j]]).replace('-','−'),x,y0+2*rh+18,{size:30,color:j>2?C.dim:cb,anchor:'middle',weight:700});});
 s+=line(x0+60,y0+22,x0+60+cw*5,y0+22,{color:C.faint,w:2});
 if(pair>=0){const a=pair+1,xa=x0+60+cw*a,col=rev?CD:C.hi;
  s+=fade(pairG,rect(xa+4,y0+rh-12,cw*2-8,2*rh+4,{fill:col,fo:.08,stroke:col,sw:2.5,rx:8}));
  if(tasuki){const xl=xa+cw*.5,xr=xa+cw*1.5,yt=y0+rh+8,yb=y0+2*rh+8;
   s+=fade(pairG*seg(tasuki,0,.5),line(xl+14,yt+4,xr-14,yb-14,{color:rev?CD:C.ink,w:3}));
   s+=fade(pairG*seg(tasuki,.5,1),line(xr-14,yt+4,xl+14,yb-14,{color:rev?CD:C.dim,w:3,dash:'6 5'}));}
 }
 return fade(g,s);
}
// たすき掛けの1行
function crossLine(k,expr,res,x,y,{g=1,gr=1,size=32,color=CN}={}){
 return fade(g,label(`${k} 成分：`,x,y,{size:26,color:C.dim,weight:700})+label(expr,x+130,y,{size:28,color:C.ink,weight:700}))+fade(gr*g,label(`＝ ${res}`,x+380,y,{size:30,color,weight:700}));
}
const R1=[['x','2 × 4 − 1 × 0','8'],['y','1 × 3 − 0 × 4','3'],['z','0 × 0 − 2 × 3','−6']];
const R2=[['x','4 × 0 − 3 × 0','0'],['y','3 × 2 − 0 × 0','6'],['z','0 × 0 − 4 × 2','−8']];

export const ytQxUmCrossDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（設定(1)、約6秒）：0〜2 s 軸と設定(1) の札、2〜4 s 𝐫、4〜6 s 𝐅₁。静止。たすき掛け・𝐍・大きさ・設定(2) は出さない。
 [K+'q1']:(p)=>AX(seg(p,0,.25))+sceneTag(TAG1,{g:seg(p,.15,.3),y:8})+set1({gR:seg(p,.34,.6),gF:seg(p,.68,.95)})+given(1,{g:seg(p,.4,.95)}),
 // 小問3（設定(2)、約5秒）：0〜1 s 設定(1) を消す（軸だけ残す）、1〜2 s 設定(2) の札、2〜5 s 粒子・𝐯・𝐁。静止。𝐯×𝐁 と力は出さない。
 [K+'q3']:(p)=>AX()+fade(1-seg(p,0,.18),sceneTag(TAG1,{y:8})+set1()+given(1))+sceneTag(TAG2,{g:seg(p,.22,.38),y:8})
  +set2({gP:seg(p,.42,.6),gQ:seg(p,.5,.66),gV:seg(p,.6,.8),gB:seg(p,.72,.95)})+given(2,{g:seg(p,.5,.95)}),

 // ===================== 小問1 =====================
 [K+'goal1']:(p)=>{
  let s=AX()+set1()+sceneTag(TAG1);
  s+=panel(90,220,label('設定(1)',PC,135,{size:24,color:C.dim,anchor:'middle'})+T(`${br}=(0,\\ 2,\\ 1)\\ \\mathrm{m}`,PC,190,34)+T(`${bF1}=(3,\\ 0,\\ 4)\\ \\mathrm{N}`,PC,250,34),seg(p,.05,.2));
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 2. 2段の表（𝐫 上・𝐅₁ 下、x y z x y）。隣り合う2列の組を順に枠で
 [K+'strip']:(p)=>{
  let s=AX()+set1({labs:.4})+sceneTag(TAG1);
  const k=p<.45?-1:p<.62?0:p<.79?1:2;
  const lab=['x 成分は y・z の列','y 成分は z・x の列','z 成分は x・y の列'];
  s+=panel(90,300,label('x y z の後に もう一度 x y',PC,116,{size:22,color:C.dim,anchor:'middle'})
   +strip(r0,F0,{y0:150,g:seg(p,.05,.2),pair:k,pairG:1})+(k>=0?label(lab[k],PC,345,{size:26,color:C.hi,anchor:'middle',weight:700}):''),1);
  s+=goalTag(G1);
  return s;
 },
 // 3. 一行ずつたすき掛け：8、3、−6（左上×右下 → 右上×左下）
 [K+'cross1']:(p)=>{
  let s=AX()+set1({labs:.4})+sceneTag(TAG1);
  const k=p<.36?0:p<.66?1:2,t0=[.04,.36,.66][k],tk=clamp((p-t0)/.2);
  let pin=strip(r0,F0,{y0:112,pair:k,tasuki:tk});
  R1.forEach(([c,e,r],i)=>{const st=[.04,.36,.66][i];pin+=crossLine(c,e,r,PX+40,300+i*52,{g:seg(p,st+.08,st+.14),gr:seg(p,st+.16,st+.22)});});
  s+=panel(90,410,pin,1);
  s+=goalTag(G1);
  return s;
 },
 // 4. 𝐍＝(8, 3, −6)（黄）。𝐫・𝐅₁ の面（薄い黄）に立つ 𝐍。「D です」で答えの札
 [K+'ansN']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55;
  let s=AX()+set1({labs:.4,plane:seg(p,.1,.3),gN:seg(p,.2,.5)})+sceneTag(TAG1);
  s+=panel(90,200,R1.map(([c,e,r],i)=>crossLine(c,e,r,PX+40,140+i*44,{size:26})).join('')+T(`${bN}=(8,\\ 3,\\ -6)\\ \\mathrm{N\\cdot m}`,PC,272,36,{color:CN}),1);
  s+=goalTag(G1)+ANS1(seg(p,b+.02,b+.1));
  return s;
 },
 // 5. 𝐍·𝐫＝0、𝐍·𝐅₁＝0 → 両方に垂直
 [K+'dot1']:(p)=>{
  let s=AX()+set1({labs:.4,plane:1,gN:1,perp:seg(p,.55,.7)})+sceneTag(TAG1);
  s+=panel(90,250,T(`${bN}=(8,\\ 3,\\ -6)`,PC,135,32,{color:CN})
   +fade(seg(p,.1,.25),T(`${bN}\\cdot${br}=0+6-6=0`,PC,200,32))
   +fade(seg(p,.3,.45),T(`${bN}\\cdot${bF1}=24+0-24=0`,PC,255,32))
   +fade(seg(p,.55,.7),label('→ 𝐫 にも 𝐅₁ にも 垂直',PC,310,{size:26,color:C.hi,anchor:'middle',weight:700})),1);
  s+=goalTag(G1)+ANS1(1);
  return s;
 },
 // 6. 誤答 A・B（1文目）→ C（2文目、y 成分の行を赤で）
 // 行6 は字幕の折り返しで「𝐅₁×｜𝐫」と割れるので、3 cue（a：A、m：B、b：C）に分けた。カードは cue ごとに1枚
 [K+'wrong1a']:(p,ctx)=>ytQxUmCrossDiagrams[K+'_wrong1'](p,ctx,0),
 [K+'wrong1m']:(p,ctx)=>ytQxUmCrossDiagrams[K+'_wrong1'](p,ctx,1),
 [K+'wrong1b']:(p,ctx)=>ytQxUmCrossDiagrams[K+'_wrong1'](p,ctx,2),
 [K+'_wrong1']:(p,ctx,part=0)=>{
  const OFF=[2,3],W3=[0,1,2].map(i=>i===part?[0,1]:OFF),inC=part===2?seg(p,.01,.05):0;
  let s=AX()+set1({labs:.4,plane:1,gN:1})+sceneTag(TAG1);
  s+=panel(90,180,R1.map(([c,ex,r],i)=>crossLine(c,ex,r,PX+40,138+i*46,{size:26})).join('')
   +fade(inC,rect(PX+28,166,PW-56,40,{fill:CD,fo:.1,stroke:CD,sw:2.5,rx:8})),1);
  s+=wrongSeq(p,ctx,[['A','(0, 0, 4)','同じ 軸どうしを 掛けた。内積の 作り方'],['B','(−8, −3, 6)','𝐅₁×𝐫 を 計算した。全成分が 反転'],['C','(8, −3, −6)',['y 成分の 引く 順が 逆','（0×4 − 1×3 ＝ −3）']]],{win:W3,opts:{...WOPT,y:285}});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },

 // ===================== 小問2 =====================
 [K+'goal2']:(p)=>{
  let s=AX()+set1({labs:.4,plane:1,gN:1})+sceneTag(TAG1);
  s+=panel(90,150,label('小問1 の 結果',PC,130,{size:22,color:C.dim,anchor:'middle'})+T(`${bN}=(8,\\ 3,\\ -6)\\ \\mathrm{N\\cdot m}`,PC,195,36,{color:CN}),seg(p,0,.1));
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 8. 成分の2乗の和 → √109 ≈ 10.4。「B です」で答えの札
 [K+'mag']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.7;
  let s=AX()+set1({labs:.4,plane:1,gN:1})+sceneTag(TAG1);
  const N=sc(N0,.12),[nx,ny]=P(...N);
  s+=fade(seg(p,.55,.65),label('約 10.4 N·m',nx+20,ny+44,{size:26,color:CN,weight:700}));
  s+=panel(90,250,T(`|${bN}|^2=8^2+3^2+(-6)^2`,PC,140,32)
   +fade(seg(p,.15,.3),T(`=64+9+36=109`,PC,200,32))
   +fade(seg(p,.35,.5),T(`|${bN}|=\\sqrt{109}\\approx10.4\\ \\mathrm{N\\cdot m}`,PC,270,34,{color:CN})),1);
  s+=goalTag(G2)+ANS2(seg(p,b+.02,b+.1));
  return s;
 },
 // 9. 文1：5・25・4 がどの量か（札を横に）。文2：長さの式 r²F₁²−(𝐫·𝐅₁)²＝125−16＝109。両方の 109 を黄で（2026-10-16 PQ-009）
 [K+'check2']:(p,ctx)=>{
  const W=sentWin(ctx),a1=W[0][1]*.12,a2=W[0][1]*.42,a3=W[0][1]*.72,b=W[1]?W[1][0]:.55;
  let s=AX()+set1({labs:.4,plane:1,gN:1})+sceneTag(TAG1);
  const row=(y,tx,lab,col,g)=>fade(seg(p,g,g+.06),T(tx,PX+130,y,30)+label(lab,PX+255,y+9,{size:24,color:col,weight:700}));
  s+=panel(90,330,T(`|${bN}|^2={\\color{${C.hi}}109}`,PC,135,30)
   +row(190,`r^2=5`,'← 𝐫 の 長さの 2乗',CR,a1)
   +row(237,`F_1^{\\,2}=25`,'← 𝐅₁ の 長さの 2乗',CF,a2)
   +row(284,`${br}\\cdot${bF1}=4`,'← 二つの 内積',C.ink,a3)
   +fade(seg(p,b+.02,b+.12),T(`r^2F_1^{\\,2}-(${br}\\cdot${bF1})^2=125-16={\\color{${C.hi}}109}`,PC,345,30))
   +fade(seg(p,b+.3,b+.4),label('二つの 109 が 一致',PC,400,{size:28,color:C.hi,anchor:'middle',weight:700})),1);
  s+=goalTag(G2)+ANS2(1);
  return s;
 },
 // 10. 誤答 A（1文目）→ C・D（2文目）
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),e=W[0][1],c0=W[1]?W[1][0]:e,m=c0+(1-c0)*.4;
  let s=AX()+set1({labs:.4,plane:1,gN:1})+sceneTag(TAG1);
  s+=panel(90,150,T(`|${bN}|=\\sqrt{109}\\approx10.4\\ \\mathrm{N\\cdot m}`,PC,165,34,{color:CN}),1);
  s+=wrongSeq(p,ctx,[['A','約 11.2 N·m',['√5×5。直角ではないので','sinθ ≈ 0.93 の 分だけ 小さい']],['C','4 N·m','内積 𝐫·𝐅₁ を 答えた'],['D','約 11.9 N·m','√(125＋16)。引くのが 正しい']],{win:[[0,e],[c0,m],[m,1]],opts:{...WOPT,y:255}});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },

 // ===================== 小問3 =====================
 // 11. 暗転して設定(2)。粒子・q・𝐯・𝐁。求めるもの
 [K+'goal3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=AX()+sceneTag(TAG2,{g:seg(p,.05,.15)})+set2({gP:seg(p,.12,.22),gQ:seg(p,.18,.28),gV:seg(p,.24,.36),gB:seg(p,.3,.42)});
  s+=panel(90,250,label('設定(2)',PC,135,{size:24,color:C.dim,anchor:'middle'})+label('q ＝ −0.5 C',PC,188,{size:30,color:CQ,anchor:'middle',weight:700})
   +T(`${bv}=(0,\\ 4,\\ 3)\\ \\mathrm{m/s}`,PC,240,32)+T(`${bB}=(2,\\ 0,\\ 0)\\ \\mathrm{T}`,PC,292,32),seg(p,.35,.45));
  s+=goalTag(G3,{g:seg(p,b,b+.08)});
  return s;
 },
 // 12. q を脇へ。𝐯（上段）・𝐁（下段）の表でたすき掛け → 𝐯×𝐁＝(0, 6, −8)。灰の矢印
 [K+'vxb3']:(p)=>{
  const k=p<.36?0:p<.56?1:2,t0=[.16,.36,.56][k],tk=clamp((p-t0)/.15);
  let s=AX()+sceneTag(TAG2)+set2({qOff:seg(p,.02,.14),labs:.5,gG:seg(p,.78,.9)});
  let pin=label('符号は 後回し：先に 𝐯×𝐁',PC,118,{size:22,color:C.dim,anchor:'middle'})+strip(v0,B0,{y0:140,ct:CV,cb:CB,nt:bv,nb:bB,pair:p<.16?-1:k,tasuki:tk});
  R2.forEach(([c,e,r],i)=>{const st=[.16,.36,.56][i];pin+=crossLine(c,e,r,PX+40,318+i*48,{g:seg(p,st+.06,st+.12),gr:seg(p,st+.13,st+.19),color:C.ink});});
  pin+=fade(seg(p,.76,.86),T(`${bv}\\times${bB}=(0,\\ 6,\\ -8)`,PC,470,32));
  s+=panel(90,415,pin,1);
  s+=goalTag(G3);
  return s;
 },
 // 13. q＝−0.5 を掛ける：灰が反転し半分の長さの緑 𝐅₂＝(0, −3, 4) N。「C です」で答えの札
 [K+'mulq3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55,fl=seg(p,.15,.45);
  let s=AX()+sceneTag(TAG2)+set2({qOff:1-seg(p,.05,.15),labs:.5,gG:1,flip:fl});
  s+=panel(90,220,label('q ＝ −0.5 を 掛ける',PC,128,{size:24,color:CQ,anchor:'middle',weight:700})
   +T(`${bF2}=${q}\\,(${bv}\\times${bB})=(-0.5)(0,\\ 6,\\ -8)`,PC,195,30)
   +fade(seg(p,.4,.5),T(`=(0,\\ -3,\\ 4)\\ \\mathrm{N}`,PC,262,38,{color:CF})),1);
  s+=goalTag(G3)+ANS3(seg(p,b+.02,b+.1));
  return s;
 },
 // 14. |𝐅₂|＝5、𝐯·𝐁＝0、|q|vB＝0.5×5×2＝5、𝐅₂·𝐯＝0
 [K+'mag3']:(p)=>{
  let s=AX()+sceneTag(TAG2)+set2({labs:.5,gG:1,flip:1});
  s+=panel(90,300,T(`|${bF2}|=\\sqrt{9+16}=5`,PC,140,32)
   +fade(seg(p,.2,.32),T(`${bv}\\cdot${bB}=0\\ \\ (\\perp)`,PC,200,30))
   +fade(seg(p,.35,.5),T(`|q|\\,vB=0.5\\times5\\times2=5`,PC,260,32))
   +fade(seg(p,.6,.72),T(`${bF2}\\cdot${bv}=-12+12=0`,PC,330,30)),1);
  s+=goalTag(G3)+ANS3(1);
  return s;
 },
 // 15. 誤答 A・B（1文目）→ D（2文目）。声の後（間）でまとめ：二つの場面を左右に、どちらも「内積 0 → 元の矢印に垂直」
 // 行15 は「z｜成分」と割れるので、文の区切りで2 cue（a：A・B、b：D とまとめ）に分けた
 [K+'wrong3a']:(p,ctx)=>ytQxUmCrossDiagrams[K+'_wrong3'](p,ctx,0),
 [K+'wrong3b']:(p,ctx)=>ytQxUmCrossDiagrams[K+'_wrong3'](p,ctx,1),
 [K+'_wrong3']:(p,ctx,part=0)=>{
  const m=part?0:.5,e=part?0:1,c0=part?0:2,ve=part?voiceEnd(ctx):2,sw=seg(p,ve+.01,ve+.05);
  let s=AX()+sceneTag(TAG2)+set2({labs:.5,gG:1,flip:1});
  s+=panel(90,150,T(`${bF2}=(-0.5)(0,\\ 6,\\ -8)=(0,\\ -3,\\ 4)\\ \\mathrm{N}`,PC,165,28),1);
  s+=wrongSeq(p,ctx,[['A','(0, 3, −4)','負の 符号を 掛け忘れた'],['B','(0, −6, 8)',['|q| ＝ 0.5 を 掛け忘れた。','単位も N に ならない']],['D','(0, −3, −4)','z 成分の 引く 順が 逆']],{win:[[0,m],[m,e],[c0,1]],opts:{...WOPT,y:255}});
  s+=goalTag(G3)+ANS3(1);
  // まとめ（暗転なし）
  const tS=cueT(ctx)-ve*(ctx?.dur??10),qk=k=>clamp((tS-.3-k*.5)/.4);
  const Pl=view({ox:150,oy:330,u:95,ky:.6,ay:25*RAD}),Pr=view({ox:760,oy:290,u:95,ky:.6,ay:25*RAD});
  let L=axes3(Pl,{xl:2,yl:2,zl:1.6,xn:.3,yn:.3,zn:.6})+V3(Pl,[0,0,0],sc(r0,.45),{color:CR,w:5,head:15})+V3(Pl,[0,0,0],sc(F0,.45),{color:CF,w:5,head:15})+V3(Pl,[0,0,0],sc(N0,.12),{color:CN,w:6,head:17});
  L+=T(`${bN}=(8,\\ 3,\\ -6)\\ \\mathrm{N\\cdot m}`,440,170,28,{color:CN})+label('約 10.4 N·m',440,225,{size:26,color:CN,anchor:'middle',weight:700});
  let Rr=axes3(Pr,{xl:2,yl:2,zl:1.6,xn:.3,yn:.3,zn:.6})+V3(Pr,[0,0,0],sc(v0,.3),{color:CV,w:5,head:15})+V3(Pr,[-.3,-.4,.5],[1.8,-.4,.5],{color:CB,w:2.5,head:11})+V3(Pr,[0,0,0],sc(F20,.16),{color:CF,w:6,head:17});
  { const [bx,by]=Pr(0,0,0);Rr+=ball(bx,by,{r:12}); }
  Rr+=T(`${bF2}=(0,\\ -3,\\ 4)\\ \\mathrm{N}`,1030,200,28,{color:CF});
  let mm=card(20,90,570,300,fade(qk(0),L),1)+card(610,90,570,300,fade(qk(1),Rr),1);
  mm+=fade(qk(2),line(600,100,600,380,{color:C.faint,w:2}));
  mm+=fade(qk(2),rect(250,410,700,70,{fill:C.hi,fo:.1,stroke:C.hi,sw:2.5,rx:12})+label('どちらも 内積 0 → 元の 矢印に 垂直',600,455,{size:28,color:C.hi,anchor:'middle',weight:700})
   +line(305,390,400,410,{color:C.hi,w:2.5,dash:'6 6'})+line(895,390,800,410,{color:C.hi,w:2.5,dash:'6 6'}));
  mm+=answerRow([[1,'D','(8, 3, −6) N·m'],[2,'B','約 10.4 N·m'],[3,'C','(0, −3, 4) N']],{g:qk(3),size:20,gap:6});
  return fade(1-sw,s)+fade(sw,mm);
 },
};

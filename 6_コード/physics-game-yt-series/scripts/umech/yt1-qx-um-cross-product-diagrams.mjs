// 問題編 解説「表だけで向きを決める」（q-um-cross-product、大学編 07 外積・中級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/07_外積.md の q-um-cross-product（解説 14 行）。
// 画面：左に斜め上から見た3次元の図（x 右・y 奥・z 上、軸の先に x・y・z）、左下の隅に巡回の円（ずっと置く）。右に説明の枠、誤答カードは枠の下に1枚ずつ。
// 色（この単元）：𝐫 水色、𝐅₁ 緑、トルク 𝐍 黄、𝐯 紫、𝐁 橙、q 桃（粒子は負電荷なので青）、𝐯×𝐁（q を掛ける前）灰、磁気力 𝐅₂ 緑、𝐏 水色、𝐐 紫、答えの矢印 ẑ−x̂ 黄、逆向きの組・誤り 赤。
// 図のために決めた長さ（見やすさのため。問題文の数値とは比例させていない）：𝐫 2目盛、𝐅₁ 1.4目盛、𝐍 1.2目盛、𝐯 1.2目盛、𝐯×𝐁 1.4目盛、𝐅₂ 2.8目盛（𝐯×𝐁 の2倍）、𝐏・𝐐・ẑ−x̂ 各成分 1.3目盛。
import {C,clamp,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,texWidth,poly} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongSeq,cueT,sentWin,voiceEnd} from './yt1-qx-common.mjs';
import {RAD,T,cs,hx,hy,hz,view,V3,L3,axes3,hats3,cycle,cyclePath,table3,cellXY,ball,EL,sceneTag} from './yt1-qx-um-cross-parts.mjs';

const K='qx-um-cross-product:';
const CR=C.x,CF=C.F,CN=C.hi,CV=C.v,CB=C.E,CQ=C.p,CG=C.dim,CD='#ff6b6b';
const PX=680,PW=500,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const P=view({ox:250,oy:360,u:120,ky:.6,ay:25*RAD});
const CYX=85,CYY=420;
const cyc=(g=1)=>cycle(CYX,CYY,{R:50,node:21,size:24,g});
const cycNote=(g=1)=>fade(g,label('円の向き ＝ ＋、逆 ＝ −',158,505,{size:22,color:C.dim}));
const AX=(g=1)=>axes3(P,{xl:2.1,yl:3.0,zl:1.7,zn:.9,g});
const bN=cs(CN,'\\mathbf{N}'),br=cs(CR,'\\mathbf{r}'),bF1=cs(CF,'\\mathbf{F}_1'),bF2=cs(CF,'\\mathbf{F}_2'),bv=cs(CV,'\\mathbf{v}'),bB=cs(CB,'\\mathbf{B}'),bP=cs(CR,'\\mathbf{P}'),bQ=cs(CV,'\\mathbf{Q}'),q=cs(CQ,'q');
const TAG1='設定(1)：トルク',TAG2='設定(2)：磁気力（設定(1) とは別の場面）',TAG3='設定(3)：矢印だけの計算（磁場とは関係がない）';
const G1='𝐍＝𝐫×𝐅₁',G2='磁気力 𝐅₂＝q𝐯×𝐁',G3='𝐏×𝐐';
const ANS1=g=>answerTag(1,'A','−2ẑ N·m',{g}),ANS2=g=>answerTag(2,'B','−4ŷ N',{g}),ANS3=g=>answerTag(3,'D','ẑ−x̂',{g});
// TeX を部品ごとに左から並べる（各部品の左端・右端を返す）
function seqT(parts,x,y,size){const ws=parts.map(s=>texWidth(s,size,false)),W=ws.reduce((a,b)=>a+b,0);let cx=x-W/2,svg='';const box=[];
 parts.forEach((s,i)=>{svg+=T(s,cx,y,size,{anchor:'start'});box.push([cx,cx+ws[i]]);cx+=ws[i];});return {svg,box,W};}

// ---- 設定(1)：回転軸・柄・𝐫・𝐅₁（矢印の横は短い名前だけ。値は右の枠／問題アニメでは右の札）----
const R1=[0,2,0],F1E=[1.4,2,0];
function set1({g=1,gAxis=1,gR=1,gF=1,gN=0,labs=1}={}){
 let s=fade(gAxis,L3(P,[0,0,-.7],[0,0,1.3],{color:'#56627c',w:10})+L3(P,[0,0,0],R1,{color:'#3a4660',w:14}));
 s+=fade(gR,V3(P,[0,0,0],R1,{color:CR,w:6,head:18}));
 const [rx,ry]=P(0,1.1,0);s+=fade(gR*labs,T(br,rx-4,ry-22,34));
 s+=fade(gF,V3(P,R1,F1E,{color:CF,w:6,head:18}));
 const [fx,fy]=P(...F1E);s+=fade(gF*labs,T(bF1,fx+28,fy+8,34));
 if(gN>.001){s+=V3(P,[0,0,0],[0,0,-1.2*gN],{color:CN,w:7,head:20});const [nx,ny]=P(0,0,-1.1);s+=fade(seg(gN,.7,1),T(bN,nx-28,ny,34));}
 return fade(g,s);
}
// ---- 設定(2)：粒子・𝐯・𝐁 ----
const PA=[1,.8,.8];
function set2({g=1,gP=1,gV=1,gB=1,gQ=1,qOff=0,gG=0,flip=0,labs=1}={}){
 let s='';
 s+=fade(gB,[[0,-.45],[0,.45],[1.2,0]].map(([dy,dz])=>V3(P,[-.2,PA[1]+dy,PA[2]+dz],[1.9,PA[1]+dy,PA[2]+dz],{color:CB,w:3,head:13})).join(''));
 const [bx,by]=P(1.9,PA[1],PA[2]+.45);s+=fade(gB*labs,T(bB,bx+22,by+10,32));
 const [px,py]=P(...PA);
 s+=fade(gV,V3(P,PA,[PA[0],PA[1],1.65],{color:CV,w:6,head:18}));
 const [vx,vy]=P(PA[0],PA[1],1.65);s+=fade(gV*labs,T(bv,vx+22,vy+16,32));
 // 𝐯×𝐁（灰、+y に 1.4）→ q を掛けて 𝐅₂（緑、−y に 2.8）
 if(gG>.001){
  const L=flip>0?-1.4*(1+flip):1.4,col=flip>.5?CF:CG;
  s+=fade(gG,V3(P,PA,[PA[0],PA[1]+L,PA[2]],{color:col,w:6+flip,head:18}));
  if(flip<.05){const [ex,ey]=P(PA[0],PA[1]+1.4,PA[2]);s+=fade(gG,T(`${bv}\\times${bB}`,ex+14,ey+34,28,{anchor:'start'}));}
  if(flip>.95){const [ex,ey]=P(PA[0],PA[1]-2.8,PA[2]);s+=T(bF2,ex-6,ey+44,32);}
 }
 s+=ball(px,py,{g:gP});
 s+=fade(gQ,move2(qOff,label('q ＝ −2 C',px-28,py+9,{size:26,color:CQ,anchor:'end',weight:700})+(qOff>.02?rect(px-164,py-20,146,40,{fill:CQ,fo:.08,stroke:CQ,sw:2.5,rx:8}):'')));
 if(qOff>.5)s+=fade(seg(qOff,.6,1),label('後で 掛ける',px-131,py+84,{size:22,color:CQ,anchor:'middle'}));
 return fade(g,s);
}
function move2(k,svg){return k<=.001?svg:`<g transform="translate(${(-40*k).toFixed(1)} ${(30*k).toFixed(1)})">${svg}</g>`;}
// ---- 設定(3)：𝐏＝x̂＋ẑ と 𝐐＝ŷ（𝐏 は x–z の面の中。面を薄く描く）----
const U3=1.3;
function set3({g=1,gP=1,gQ=1,split=0,gA=0,labs=1}={}){
 let s=fade(gP*.6,poly([P(-1.5,0,0),P(1.6,0,0),P(1.6,0,1.55),P(-1.5,0,1.55)],{fill:'#24324f',fo:.35,stroke:'#33415e',sw:1.5}));
 s+=fade(gP*(1-.5*split),V3(P,[0,0,0],[U3,0,U3],{color:CR,w:6,head:18}));
 const [ppx,ppy]=P(U3,0,U3);s+=fade(gP*labs,T(bP,ppx+20,ppy-4,34));
 if(split>.001)s+=fade(split,V3(P,[0,0,0],[U3,0,0],{color:CR,w:3,head:12})+V3(P,[0,0,0],[0,0,U3],{color:CR,w:3,head:12})+L3(P,[U3,0,0],[U3,0,U3],{color:CR,w:2,dash:'5 6'})+L3(P,[0,0,U3],[U3,0,U3],{color:CR,w:2,dash:'5 6'}));
 s+=fade(gQ,V3(P,[0,0,0],[0,1.5,0],{color:CV,w:6,head:18}));
 const [qx,qy]=P(0,1.5,0);s+=fade(gQ*labs,T(bQ,qx+14,qy+30,34));
 if(gA>.001){s+=V3(P,[0,0,0],[-U3*gA,0,U3*gA],{color:CN,w:7,head:20});const [ax,ay]=P(-U3,0,U3);s+=fade(seg(gA,.7,1),T(`${hz}-${hx}`,ax+10,ay-26,32,{color:CN}));}
 return fade(g,s);
}
// 問題アニメの右の札（与えた量）
function given(k,{g=1}={}){
 const rows=k===1?[`${br}=0.4\\,${hy}\\ \\mathrm{m}`,`${bF1}=5\\,${hx}\\ \\mathrm{N}`]:k===2?[`{\\color{${CQ}}q=-2\\ \\mathrm{C}}`,`${bv}=4\\,${hz}\\ \\mathrm{m/s}`,`${bB}=0.5\\,${hx}\\ \\mathrm{T}`]:[`${bP}=${hx}+${hz}`,`${bQ}=${hy}`];
 return card(760,150,380,60+rows.length*62,rows.map((r,i)=>T(r,950,205+i*62,34)).join(''),g);
}
function topInset(cx,cy,{g=1,arcG=1}={}){
 let s=label('真上から 見た 図',cx,cy-92,{size:22,color:C.dim,anchor:'middle'});
 s+=arrow(cx,cy,cx,cy-70,{color:CR,w:5,head:15})+T(br,cx-20,cy-60,28)+arrow(cx,cy-70,cx+70,cy-70,{color:CF,w:5,head:15})+T(bF1,cx+86,cy-62,26);
 const pts=Array.from({length:21},(_,i)=>{const a=Math.PI/2-Math.PI/2*i/20*arcG;return [cx+34*Math.cos(a),cy-34*Math.sin(a)];});
 if(arcG>.05){s+=draw(pts.slice(0,-1),1,{color:C.ink,w:3.5});const [x2,y2]=pts[20],[x1,y1]=pts[18],an=Math.atan2(y2-y1,x2-x1),h=13;
  s+=`<polygon points="${x2+Math.cos(an)*3},${y2+Math.sin(an)*3} ${x2-h*Math.cos(an)+h*.55*Math.sin(an)},${y2-h*Math.sin(an)-h*.55*Math.cos(an)} ${x2-h*Math.cos(an)-h*.55*Math.sin(an)},${y2-h*Math.sin(an)+h*.55*Math.cos(an)}" fill="${C.ink}"/>`;}
 s+=fade(arcG,label('時計回り → 右ねじは 下へ',cx,cy+38,{size:22,color:C.ink,anchor:'middle',weight:700}));
 return fade(g,s);
}
// まとめの小さな場面
function mini(k,x,y,w,h,g=1){
 const Pm=view({ox:x+70,oy:y+h-62,u:40});
 let s=axes3(Pm,{xl:1.9,yl:2.1,zl:1.6,xn:.2,yn:.2,zn:.3});
 if(k===1){s+=V3(Pm,[0,0,0],[0,2,0],{color:CR,w:4,head:12})+V3(Pm,[0,2,0],[1.4,2,0],{color:CF,w:4,head:12})+V3(Pm,[0,0,0],[0,0,-1.1],{color:CN,w:5,head:14});}
 if(k===2){const A=[.8,1,0];s+=V3(Pm,A,[.8,1,1.2],{color:CV,w:4,head:12})+V3(Pm,[-.2,1.5,.6],[1.6,1.5,.6],{color:CB,w:2.5,head:10})+V3(Pm,A,[.8,-.9,0],{color:CF,w:5,head:14});const [bx,by]=Pm(...A);s+=ball(bx,by,{r:10});}
 if(k===3){s+=V3(Pm,[0,0,0],[1.1,0,1.1],{color:CR,w:4,head:12})+V3(Pm,[0,0,0],[0,1.4,0],{color:CV,w:4,head:12})+V3(Pm,[0,0,0],[-1.1,0,1.1],{color:CN,w:5,head:14});}
 const ttl=['','設定(1) トルク','設定(2) 磁気力','設定(3) 矢印だけ'][k],res=['',`-2\\,${hz}\\ \\mathrm{N\\cdot m}`,`-4\\,${hy}\\ \\mathrm{N}`,`${hz}-${hx}`][k];
 s+=label(ttl,x+w/2,y+32,{size:22,color:C.dim,anchor:'middle'})+T(res,x+w-80,y+h/2+16,30,{color:CN});
 return card(x,y,w,h,s,g);
}

export const ytQxUmCrossProductDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（設定(1)、約6秒）：0〜2 s 軸と巡回の円・設定(1) の札、2〜4 s 回転軸・柄・𝐫、4〜6 s 𝐅₁。静止。𝐍・回る向き・設定(2)(3) は出さない。
 [K+'q1']:(p)=>AX(seg(p,0,.2))+cyc(seg(p,0,.2))+cycNote(seg(p,.1,.3))+sceneTag(TAG1,{g:seg(p,.15,.3),y:8})
  +set1({gAxis:seg(p,.34,.5),gR:seg(p,.5,.66),gF:seg(p,.7,.92)})+given(1,{g:seg(p,.55,.95)}),
 // 小問2（設定(2)、約5秒）：0〜1 s 設定(1) を消す（軸と巡回の円だけ残す）、1〜2 s 設定(2) の札、2〜5 s 粒子・𝐯・𝐁。静止。𝐯×𝐁 と力は出さない。
 [K+'q2']:(p)=>AX()+cyc()+cycNote()+fade(1-seg(p,0,.18),sceneTag(TAG1,{y:8})+set1()+given(1))+sceneTag(TAG2,{g:seg(p,.22,.38),y:8})
  +set2({gP:seg(p,.42,.6),gQ:seg(p,.5,.66),gV:seg(p,.6,.8),gB:seg(p,.75,.95)})+given(2,{g:seg(p,.5,.95)}),
 // 小問3（設定(3)、約4秒）：0〜1 s 設定(2) を消す、1〜2 s 設定(3) の札、2〜4 s 𝐏 と 𝐐。静止。展開・表・答えの矢印は出さない。
 [K+'q3']:(p)=>AX()+cyc()+cycNote()+fade(1-seg(p,0,.22),sceneTag(TAG2,{y:8})+set2()+given(2))+sceneTag(TAG3,{g:seg(p,.27,.45),y:8})
  +set3({gP:seg(p,.52,.75),gQ:seg(p,.72,.95)})+given(3,{g:seg(p,.6,.95)}),

 // ===================== 小問1 =====================
 [K+'goal1']:(p)=>{
  let s=AX()+cyc()+set1()+sceneTag(TAG1);
  s+=panel(90,250,label('設定(1)',PC,135,{size:24,color:C.dim,anchor:'middle'})
   +T(`${br}=0.4\\,${hy}\\ \\mathrm{m}`,PC,190,34)+T(`${bF1}=5\\,${hx}\\ \\mathrm{N}`,PC,245,34)
   +fade(seg(p,.4,.55),T(`${bN}=${br}\\times${bF1}`,PC,305,38)),seg(p,.05,.2));
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 2. 軸の上に x̂・ŷ・ẑ。𝐍＝0.4ŷ×5x̂ → 2(ŷ×x̂)。ŷ が左、x̂ が右
 [K+'prod1']:(p)=>{
  let s=AX()+cyc()+set1({labs:.35})+hats3(P,{g:seg(p,.02,.15)})+sceneTag(TAG1);
  const L1=seqT([`${bN}=`,`0.4`,`\\,${hy}\\times`,`5`,`\\,${hx}`],PC,175,38);
  const g2=seg(p,.4,.52);
  const L2=seqT(['=(0.4\\times5)(',hy,'\\times',hx,')=2(',hy,'\\times',hx,')'],PC,262,34);
  let pin=L1.svg+fade(seg(p,.25,.32)*(1-g2*.6),highlight(L1.box[1][0]-6,140,L1.box[1][1]-L1.box[1][0]+12,58,1,C.hi)+highlight(L1.box[3][0]-6,140,L1.box[3][1]-L1.box[3][0]+12,58,1,C.hi));
  pin+=fade(g2,L2.svg);
  const g3=seg(p,.65,.75),[a0,a1]=L2.box[5],[b0,b1]=L2.box[7];
  pin+=fade(g3,highlight(a0-5,228,a1-a0+10,58,1,CV)+highlight(b0-5,228,b1-b0+10,58,1,CR)+label('左（先）',a1-2,316,{size:22,color:CV,anchor:'end',weight:700})+label('右（後）',b0+2,316,{size:22,color:CR,anchor:'start',weight:700}));
  s+=panel(90,250,label('数を 前に 出す',PC,124,{size:22,color:C.dim,anchor:'middle'})+pin,1);
  s+=goalTag(G1);
  return s;
 },
 // 3. 1文目：巡回の円を逆向き（y→x、赤）→ ŷ×x̂＝−ẑ。2文目：𝐍（黄）が下向きに伸びる、真上から見た図。「A です」で答えの札
 // 行3 は字幕の折り返しで「小問｜1」と割れるので、文の区切りで2 cue（a：巡回の円、b：𝐍 と答え）に分けた。1つの関数を前半・後半で使う
 [K+'rev1a']:(p,ctx)=>ytQxUmCrossProductDiagrams[K+'rev1'](p*.43,ctx),
 [K+'rev1b']:(p,ctx)=>ytQxUmCrossProductDiagrams[K+'rev1'](.45+.55*p,ctx),
 [K+'rev1']:(p,ctx)=>{
  const b=.45,s2=seg(p,b-.02,b+.04);
  let s=AX()+cyc()+cyclePath(CYX,CYY,50,'y','x',-1,{color:CD,w:4,g:seg(p,.08,.3)})+set1({labs:.35,gN:seg(p,b+.02,b+.25)})+sceneTag(TAG1);
  const big=cycle(PC,215,{R:72,node:26,size:30})+cyclePath(PC,215,72,'y','x',-1,{color:CD,w:6,g:seg(p,.08,.32)})+fade(seg(p,.3,.38),label('−',PC+112,150,{size:44,color:CD,anchor:'middle',weight:700}));
  const p1=fade(1-s2,big+fade(seg(p,.32,.42),T(`${hy}\\times${hx}=-${hz}`,PC,370,40)));
  const p2=fade(s2,T(`${bN}=2(${hy}\\times${hx})=-2\\,${hz}\\ \\mathrm{N\\cdot m}`,PC,150,32,{})+topInset(PC,320,{arcG:seg(p,b+.3,b+.5)}));
  s+=panel(90,330,p1+p2,1);
  s+=goalTag(G1)+ANS1(seg(p,b+(1-b)*.55,b+(1-b)*.62));
  return s;
 },
 // 4. 誤答 B・C（1文目）→ D（2文目）を1枚ずつ
 [K+'wrong1']:(p,ctx)=>{
  const W=sentWin(ctx),e=W[0][1],m=e*.55;
  let s=AX()+cyc()+set1({labs:.35,gN:1})+sceneTag(TAG1);
  s+=panel(90,150,label('小問1',PC,128,{size:22,color:C.dim,anchor:'middle'})+T(`${hy}\\times${hx}=-${hz}\\quad ${bN}=-2\\,${hz}\\ \\mathrm{N\\cdot m}`,PC,190,30),1);
  s+=wrongSeq(p,ctx,[['B','2ẑ N·m','順序を 入れ替えた。ŷ×x̂ ＝ −ẑ'],['C','0 N·m','ŷ と x̂ は 直角。外積は 最大'],['D','2 N·m','答えは 矢印。回る 軸と 向きが ある']],{win:[[0,m],[m,e],[W[1]?W[1][0]:e,1]],opts:{...WOPT,y:260}});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },

 // ===================== 小問2 =====================
 // 5. 暗転して設定(2)。粒子・q・𝐯・𝐁 が順に出る。求めるもの
 [K+'goal2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=AX()+cyc()+sceneTag(TAG2,{g:seg(p,.05,.15)})+set2({gP:seg(p,.12,.22),gQ:seg(p,.18,.28),gV:seg(p,.24,.36),gB:seg(p,.3,.42)});
  s+=panel(90,250,label('設定(2)',PC,135,{size:24,color:C.dim,anchor:'middle'})
   +label('q ＝ −2 C',PC,188,{size:30,color:CQ,anchor:'middle',weight:700})+T(`${bv}=4\\,${hz}\\ \\mathrm{m/s}`,PC,240,32)+T(`${bB}=0.5\\,${hx}\\ \\mathrm{T}`,PC,292,32),seg(p,.35,.45));
  s+=goalTag(G2,{g:seg(p,b,b+.08)});
  return s;
 },
 // 6. q を桃の枠で囲んで脇へ（後で掛ける）。4ẑ×0.5x̂＝2(ẑ×x̂)
 [K+'vxb']:(p)=>{
  let s=AX()+cyc()+sceneTag(TAG2)+set2({qOff:seg(p,.05,.25),labs:.5});
  s+=panel(90,220,label('符号は 後回し：先に 𝐯×𝐁',PC,128,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.25,.4),T(`${bv}\\times${bB}=4\\,${hz}\\times0.5\\,${hx}`,PC,195,34))
   +fade(seg(p,.45,.6),T(`=2(${hz}\\times${hx})`,PC,262,36)),1);
  s+=goalTag(G2);
  return s;
 },
 // 7. 巡回の円を z→x（円の向き、白）→ ŷ。粒子から奥向きの灰の矢印 𝐯×𝐁＝2ŷ
 [K+'zx']:(p)=>{
  let s=AX()+cyc()+cyclePath(CYX,CYY,50,'z','x',1,{color:C.ink,w:4,g:seg(p,.05,.3)})+sceneTag(TAG2)+set2({qOff:1,labs:.5,gG:seg(p,.45,.6)});
  s+=panel(90,330,cycle(PC,205,{R:72,node:26,size:30})+cyclePath(PC,205,72,'z','x',1,{color:C.ink,w:6,g:seg(p,.05,.3)})
   +fade(seg(p,.28,.36),label('＋',PC+112,140,{size:40,color:C.ink,anchor:'middle',weight:700}))
   +fade(seg(p,.3,.42),T(`${hz}\\times${hx}=${hy}`,PC,345,34))+fade(seg(p,.45,.58),T(`${bv}\\times${bB}=2\\,${hy}`,PC,395,34)),1);
  s+=goalTag(G2);
  return s;
 },
 // 8. q＝−2 を掛ける：灰が反転し、長さ2倍の緑（手前向き）𝐅₂＝−4ŷ N。「B です」で答えの札
 [K+'mulq']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55,fl=seg(p,.15,.45);
  let s=AX()+cyc()+sceneTag(TAG2)+set2({qOff:1-seg(p,.05,.15),labs:.5,gG:1,flip:fl});
  s+=panel(90,220,label('q ＝ −2 を まるごと 掛ける',PC,128,{size:24,color:CQ,anchor:'middle',weight:700})
   +T(`${bF2}=${q}\\,(${bv}\\times${bB})=(-2)(2\\,${hy})`,PC,195,30)
   +fade(seg(p,.4,.5),T(`=-4\\,${hy}\\ \\mathrm{N}`,PC,262,38,{color:CF})),1);
  s+=goalTag(G2)+ANS2(seg(p,b+.02,b+.1));
  return s;
 },
 // 9. 誤答 A・C（1文目）→ D（2文目）
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),e=W[0][1],m=e*.5;
  let s=AX()+cyc()+sceneTag(TAG2)+set2({labs:.5,gG:1,flip:1});
  s+=panel(90,150,label('小問2',PC,128,{size:22,color:C.dim,anchor:'middle'})+T(`${bF2}=(-2)(2\\,${hy})=-4\\,${hy}\\ \\mathrm{N}`,PC,190,30),1);
  s+=wrongSeq(p,ctx,[['A','4ŷ N','負の 符号を 掛け忘れた'],['C','−2ŷ N',['|q| ＝ 2 を 掛け忘れた。単位も N に ならない']],['D','4x̂ N',['磁場の 向きと 取り違えた。','力は 𝐯 にも 𝐁 にも 垂直']]],{win:[[0,m],[m,e],[W[1]?W[1][0]:e,1]],opts:{...WOPT,y:260}});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },

 // ===================== 小問3 =====================
 // 10. 暗転して設定(3)。𝐏 と 𝐐。求めるもの
 [K+'goal3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=AX()+cyc()+sceneTag(TAG3,{g:seg(p,.05,.15)})+set3({gP:seg(p,.12,.25),gQ:seg(p,.22,.35)});
  s+=panel(90,200,label('設定(3)',PC,135,{size:24,color:C.dim,anchor:'middle'})+T(`${bP}=${hx}+${hz}`,PC,195,34)+T(`${bQ}=${hy}`,PC,250,34),seg(p,.3,.4));
  s+=goalTag(G3,{g:seg(p,b,b+.08)});
  return s;
 },
 // 11. 𝐏 を x̂ と ẑ に分ける。(x̂＋ẑ)×ŷ＝x̂×ŷ＋ẑ×ŷ。左（x̂・ẑ）と右（ŷ）に固定の枠
 [K+'dist']:(p)=>{
  let s=AX()+cyc()+sceneTag(TAG3)+set3({split:seg(p,.05,.25),labs:.5});
  const cx=`{\\color{${CR}}${hx}}`,cz=`{\\color{${CR}}${hz}}`,cy=`{\\color{${CV}}${hy}}`;
  const gf=seg(p,.5,.62);
  s+=panel(90,250,label('分配法則（左右の 順序は そのまま）',PC,135,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.2,.35),T(`(${hx}+${hz})\\times${hy}`,PC,195,38)+T(`=${hx}\\times${hy}+${hz}\\times${hy}`,PC,255,38))
   +fade(gf,T(`(${cx}+${cz})\\times${cy}`,PC,195,38)+T(`=${cx}\\times${cy}+${cz}\\times${cy}`,PC,255,38)
    +label('左（水色）は 左のまま',PC-120,312,{size:22,color:CR,anchor:'middle',weight:700})+label('右（紫）は 右のまま',PC+125,312,{size:22,color:CV,anchor:'middle',weight:700})),1);
  s+=goalTag(G3);
  return s;
 },
 // 12. x̂×ŷ は円の向き（白）→ ẑ、ẑ×ŷ は逆（赤）→ −x̂。表の2マスが光る
 [K+'terms']:(p)=>{
  let s=AX()+cyc()+sceneTag(TAG3)+set3({split:1,labs:.5});
  const a=seg(p,.05,.25),b=seg(p,.5,.7);
  s+=cyclePath(CYX,CYY,50,'x','y',1,{color:C.ink,w:4,g:a})+cyclePath(CYX,CYY,50,'z','y',-1,{color:CD,w:4,g:b});
  let pin=cycle(PC-120,215,{R:64,node:24,size:28})+cyclePath(PC-120,215,64,'x','y',1,{color:C.ink,w:5,g:a})+cyclePath(PC-120,215,64,'z','y',-1,{color:CD,w:5,g:b});
  pin+=fade(seg(p,.22,.32),T(`${hx}\\times${hy}=${hz}`,PC+120,180,34));
  pin+=fade(seg(p,.68,.78),T(`${hz}\\times${hy}=-${hx}`,PC+120,250,34,{color:C.ink}));
  pin+=table3(PC-170,340,{cw:84,rh:42,size:26,hl:[['x','y']],hlG:seg(p,.25,.32)})+fade(seg(p,.7,.78),table3(PC-170,340,{cw:84,rh:42,size:26,hl:[['z','y']],hlColor:CD}));
  s+=panel(90,420,pin,1);
  s+=goalTag(G3);
  return s;
 },
 // 13. 原点から ẑ−x̂（黄、左上向き）。内積 0 の札。「D です」で答えの札
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=AX()+cyc()+sceneTag(TAG3)+set3({labs:.5,gA:seg(p,.05,.3)});
  s+=panel(90,250,T(`${bP}\\times${bQ}=${hx}\\times${hy}+${hz}\\times${hy}`,PC,140,30)+T(`=${hz}-${hx}`,PC,200,40,{color:CN})
   +fade(seg(p,.3,.42),line(PX+40,240,PX+PW-40,240,{color:C.faint,w:2})+label('(1, 0, 1)·(−1, 0, 1) ＝ 0',PC,282,{size:26,color:C.ink,anchor:'middle',weight:700})+label('→ 𝐏 に 垂直',PC,320,{size:26,color:C.hi,anchor:'middle',weight:700})),1);
  s+=goalTag(G3)+ANS3(seg(p,b+.02,b+.1));
  return s;
 },
 // 14. 誤答 A・B（1文目）→ C（2文目）。声の後（間）でまとめ：三つの場面を並べ、表のマスから答えへ線
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),e=W[0][1],m=e*.5,ve=voiceEnd(ctx),sw=seg(p,ve+.01,ve+.05);
  let s=AX()+cyc()+sceneTag(TAG3)+set3({labs:.5,gA:1});
  s+=panel(90,150,label('小問3',PC,128,{size:22,color:C.dim,anchor:'middle'})+T(`${hx}\\times${hy}+${hz}\\times${hy}=${hz}-${hx}`,PC,190,30),1);
  s+=wrongSeq(p,ctx,[['A','x̂−ẑ','ŷ×x̂、ŷ×ẑ と 左右を 入れ替えた'],['B','x̂＋ẑ','ẑ×ŷ を ＋x̂ と した'],['C','0','向きの 違う 2本は 消し合わない']],{win:[[0,m],[m,e],[W[1]?W[1][0]:e,1]],opts:{...WOPT,y:260}});
  s+=goalTag(G3)+ANS3(1);
  // まとめ（暗転なし）
  const tS=cueT(ctx)-ve*(ctx?.dur??10),q=k=>clamp((tS-.3-k*.5)/.4);
  let mm=mini(1,30,92,360,215,q(0))+mini(2,420,92,360,215,q(1))+mini(3,810,92,360,215,q(2));
  mm+=fade(q(0),line(405,100,405,300,{color:C.faint,w:2})+line(795,100,795,300,{color:C.faint,w:2}));
  const tx=428,ty=352;
  mm+=fade(q(3),table3(tx,ty,{cw:86,rh:44,size:26,hl:[['y','x'],['z','x'],['z','y']]}));
  const cells=[['y','x',210],['z','x',600],['z','y',990]];
  cells.forEach(([r,c,X],i)=>{const [cx,cy]=cellXY(tx,ty,r,c,{cw:86,rh:44});mm+=fade(q(4+i*.5),line(cx,cy-14,X,307,{color:C.hi,w:2.5,dash:'6 6'}));});
  mm+=answerRow([[1,'A','−2ẑ N·m'],[2,'B','−4ŷ N'],[3,'D','ẑ−x̂']],{g:q(6),size:22,gap:8});
  return fade(1-sw,s)+fade(sw,mm);
 },
};

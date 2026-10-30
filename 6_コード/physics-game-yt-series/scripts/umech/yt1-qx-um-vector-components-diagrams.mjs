// 問題編 解説「ドローンの移動と押す力」（q-um-vector-components、大学編 05 ベクトル・中級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/05_ベクトル.md の q-um-vector-components（解説 17 行）。
// 画面の配置（正本どおり）：3次元の図を左〜中央、右に式と札（紺の枠）。誤答カードは右の枠の下。札の帯（y＜78）には図を描かない。
// 色：位置 𝐫₁・𝐫₂（細線）と移動 Δ𝐫（太線）水色、力 緑、単位ベクトル・強調 黄、誤り 赤。x 東、y 北、z 上。
// 3次元の見え方：真上から東→北へ約 66° 回った所から、20° 見下ろす正射影（図のために決めた）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,poly} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,note,cueT,sentWin} from './yt1-qx-common.mjs';

const K='qx-um-vector-components:';
const CX=C.x,CF=C.F,CH=C.hi,CD='#ff6b6b';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const cc=(c,s)=>`{\\color{${c}}${s}}`;
const R1T=cc(CX,'\\mathbf{r}_1'),R2T=cc(CX,'\\mathbf{r}_2'),DR=cc(CX,'\\Delta\\mathbf{r}'),FT=cc(CF,'\\mathbf{F}');
const PX=640,PW=540,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const G1='変位の大きさ |Δ𝐫|',G2='12 N の力の矢印',G3='新しい位置と移動';
const ANS1=g=>answerTag(1,'D','6 m',{g}),ANS2=g=>answerTag(2,'A','(4, 8, 8) N',{g}),ANS3=g=>answerTag(3,'B','',{g});

// ---- 3次元の正射影：方位 a（度）、見下ろし e（度）。anchor の点を screen の位置に置く ----
function view(a=-66,e=20,u=50,anchor=[0,0,0],screen=[150,455]){
 const A=a*Math.PI/180,E=e*Math.PI/180;
 const R=[-Math.sin(A),Math.cos(A),0],U=[-Math.cos(A)*Math.sin(E),-Math.sin(A)*Math.sin(E),Math.cos(E)];
 const dotp=(v,w)=>v[0]*w[0]+v[1]*w[1]+v[2]*w[2];
 const ox=screen[0]-u*dotp(anchor,R),oy=screen[1]+u*dotp(anchor,U);
 const P=(x,y,z)=>[ox+u*dotp([x,y,z],R),oy-u*dotp([x,y,z],U)];
 P.u=u;return P;
}
const VF=view();                                   // 全体の図
const VQ=view(-66,20,52,[0,0,0],[380,462]);        // 問題アニメの図（右の枠がないので中央寄り）
const VB=view(-66,20,72,[2,-1,3],[200,470]);       // 直方体の拡大
const O3=[0,0,0],P1=[2,-1,3],P2=[4,3,7];
const add=(a,b,k=1)=>[a[0]+k*b[0],a[1]+k*b[1],a[2]+k*b[2]];
const L3=(P,a,b,o={})=>{const A=P(...a),B=P(...b);return line(A[0],A[1],B[0],B[1],o);};
const A3=(P,a,b,o={})=>{const A=P(...a),B=P(...b);return arrow(A[0],A[1],B[0],B[1],o);};
const at=(P,q)=>P(...q);

function axes3(P,{g=1,o=O3,len=[5,4.5,7.6],labs=1,color=C.dim,dash='',w=2.5,neg=1}={}){
 let s=A3(P,o,add(o,[len[0],0,0]),{color,w,head:13})+A3(P,o,add(o,[0,len[1],0]),{color,w,head:13})+A3(P,o,add(o,[0,0,len[2]]),{color,w,head:13});
 if(neg)s+=L3(P,o,add(o,[0,-1.6,0]),{color,w:2,dash:'5 6'})+L3(P,o,add(o,[-.6,0,0]),{color,w:2,dash:'5 6'});
 if(dash)s=`<g stroke-dasharray="${dash}">${s}</g>`;
 if(labs){const X=at(P,add(o,[len[0],0,0])),Y=at(P,add(o,[0,len[1],0])),Z=at(P,add(o,[0,0,len[2]]));
  s+=label('x（東）',X[0]+12,X[1]-6,{size:22,color})+label('y（北）',Y[0]+12,Y[1]+4,{size:22,color})+label('z（上）',Z[0]+14,Z[1]+10,{size:22,color});}
 return fade(g,s);
}
// ドローン（真上から見た小さな絵）
function drone(x,y,g=1){
 let s='';for(const [dx,dy] of [[-16,-7],[16,-7],[-16,7],[16,7]])s+=line(x,y,x+dx,y+dy,{color:C.ink,w:3})+ring(x+dx,y+dy,7,{color:C.ink,w:2,fill:'#2a3346'});
 s+=rect(x-9,y-6,18,12,{fill:C.ink,fo:.9,stroke:C.ink,sw:1,rx:3});
 return fade(g,s);
}
function box3(P,lo,hi,{g=1,color=C.dim,w=2,dash='6 6'}={}){
 const c=(i,j,k)=>[i?hi[0]:lo[0],j?hi[1]:lo[1],k?hi[2]:lo[2]];let s='';
 for(const [a,b] of [[[0,0,0],[1,0,0]],[[0,1,0],[1,1,0]],[[0,0,1],[1,0,1]],[[0,1,1],[1,1,1]],[[0,0,0],[0,1,0]],[[1,0,0],[1,1,0]],[[0,0,1],[0,1,1]],[[1,0,1],[1,1,1]],[[0,0,0],[0,0,1]],[[1,0,0],[1,0,1]],[[0,1,0],[0,1,1]],[[1,1,0],[1,1,1]]])
  s+=L3(P,c(...a),c(...b),{color,w,dash});
 return fade(g,s);
}
// 全体の図：座標軸・𝐫₁・𝐫₂（細線）・Δ𝐫（太線）・点の札
function scene(P,{ax=1,r1=1,r2=1,dr=1,drW=7,labs=1,box=0,pts=1,fly=1,droneAt=null,r2c=CX,r2w=3,r1lab=1}={}){
 let s=axes3(P,{g:ax})+fade(ax,label('O',at(P,O3)[0]-24,at(P,O3)[1]+8,{size:22,color:C.dim}));
 s+=box3(P,P1,P2,{g:box});
 s+=fade(r1,A3(P,O3,P1,{color:CX,w:3,head:14}))+fade(r2,A3(P,O3,P2,{color:r2c,w:r2w,head:14}));
 if(fly>0&&dr>0){const E=add(P1,[2,4,4],fly);s+=fade(dr,fly>.05?A3(P,P1,E,{color:CX,w:drW,head:22}):'');}
 if(pts)s+=dot(...at(P,P1),6,CX)+dot(...at(P,P2),6,CX);
 if(labs){const a=at(P,P1),b=at(P,P2);
  s+=fade(labs*r1*r1lab,T(`${R1T}\\,(2,\\,-1,\\,3)`,a[0]-22,a[1]+8,26,{anchor:'end'}));
  s+=fade(labs*r2,T(`${R2T}\\,(4,\\,3,\\,7)`,b[0]+34,b[1]+8,26,{anchor:'start'}));
  s+=fade(labs*dr*(fly>.9?1:0),T(DR,(a[0]+b[0])/2+20,(a[1]+b[1])/2+10,30,{anchor:'start'}));}
 if(droneAt){s+=drone(droneAt[0],droneAt[1]);}
 return s;
}
const DIR=[1/3,2/3,2/3];
// 拡大した直方体（辺の長さ・影・三角形）
function boxScene({g=1,edges=1,shadow=0,tri1=0,tri2=0,lenLab='',hiShadow=0,shadowLab='影'}={}){
 const P=VB,Q=[4,-1,3],S=[4,3,3];
 let s=box3(P,P1,P2,{color:C.dim,w:2,dash:'6 6'});
 // 向きの目印
 const tri=view(-66,20,38,[0,0,0],[70,170]);
 s+=A3(tri,O3,[1,0,0],{color:C.dim,w:2,head:10})+A3(tri,O3,[0,1,0],{color:C.dim,w:2,head:10})+A3(tri,O3,[0,0,1],{color:C.dim,w:2,head:10});
 s+=label('x',...[at(tri,[1.25,0,0])[0],at(tri,[1.25,0,0])[1]+8],{size:22,color:C.dim})+label('y',at(tri,[0,1.3,0])[0]+4,at(tri,[0,1.3,0])[1]+6,{size:22,color:C.dim})+label('z',at(tri,[0,0,1.3])[0]-6,at(tri,[0,0,1.3])[1],{size:22,color:C.dim});
 if(tri1)s+=fade(tri1,poly([at(P,P1),at(P,Q),at(P,S)],{fill:CH,fo:.18}));
 if(tri2)s+=fade(tri2,poly([at(P,P1),at(P,S),at(P,P2)],{fill:CH,fo:.18}));
 s+=fade(edges,L3(P,P1,Q,{color:CH,w:4})+L3(P,Q,S,{color:CH,w:4})+L3(P,S,P2,{color:CH,w:4}));
 const q=at(P,Q),r=at(P,S),a=at(P,P1),b=at(P,P2);
 s+=fade(edges,label('横 2',(a[0]+q[0])/2-6,(a[1]+q[1])/2+34,{size:24,color:CH,anchor:'middle',weight:700})
  +label('奥 4',(q[0]+r[0])/2+18,(q[1]+r[1])/2+18,{size:24,color:CH,weight:700})
  +label('高さ 4',(r[0]+b[0])/2+16,(r[1]+b[1])/2+8,{size:24,color:CH,weight:700}));
 if(shadow)s+=fade(shadow,L3(P,P1,S,{color:CX,w:4+3*hiShadow,dash:'9 7'})+label('影',300,418,{size:24,color:CX,anchor:'middle',weight:700}));
 s+=A3(P,P1,P2,{color:CX,w:7,head:22})+T(DR,(a[0]+b[0])/2-18,(a[1]+b[1])/2-4,30,{anchor:'end'});
 if(lenLab)s+=label(lenLab,(a[0]+b[0])/2+18,(a[1]+b[1])/2+10,{size:28,color:CX,weight:700});
 s+=dot(...a,6,CX)+dot(...b,6,CX);
 return fade(g,s);
}
// 式を中央にそろえて並べる枠
const eqPanel=(y,h,rows,g=1,stroke=C.faint)=>panel(y,h,rows.map(([s,yy,size,o])=>fade(o??1,T(s,PC,yy,size??36))).join(''),g,stroke);
// 力の矢印（1 N を 0.25 m の長さで描く。Δ𝐫 と重ならないよう、画面上で右下へ少しずらす）
const FSH=[34,16];
function farrow(P,vec,{g=1,color=CF,w=7,dash='',lab=''}={}){
 const a=at(P,P1),b=at(P,add(P1,vec,.25));
 let s=arrow(a[0]+FSH[0],a[1]+FSH[1],b[0]+FSH[0],b[1]+FSH[1],{color,w,head:20});
 if(dash)s=`<g stroke-dasharray="${dash}">${s}</g>`;
 if(lab)s+=label(lab,b[0]+FSH[0]+14,b[1]+FSH[1]+6,{size:24,color,weight:700});
 return fade(g,s);
}
const flyPt=(P,f)=>at(P,add(P1,[2,4,4],f));

export const ytQxUmVectorComponentsDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（約5秒）：座標軸と 𝐫₁、𝐫₂（細線）。ドローンが 𝐫₁ の点から 𝐫₂ の点へ飛び、跡に Δ𝐫（太線）。
 //   座標軸が 58°→66° ゆっくり回って止まり、直方体の輪郭だけ（辺の長さ・影は出さない）。
 [K+'q1']:(p)=>{
  const P=view(mix(-58,-66,seg(p,.05,.85)),20,52,[0,0,0],[380,462]);
  const f=seg(p,.2,.6);
  return scene(P,{fly:f,box:seg(p,.8,.95),droneAt:flyPt(P,f)})+note('（東→北へ 少し 回って、斜め上から 見た 図）',880,400,{g:seg(p,.1,.25)});
 },
 // 小問2（約3秒）：同じ図に、Δ𝐫 の向きに沿う長さ未定の力の矢印（緑の点線）
 [K+'q2']:(p)=>{
  const P=VQ;
  let s=scene(P,{box:1,droneAt:at(P,P2)});
  s+=farrow(P,[4,8,8],{g:seg(p,.2,.6),dash:'10 8',w:5});
  const b=at(P,add(P1,[4,8,8],.25)),bx=at(P,[4,3,5])[0]+40;
  s+=fade(seg(p,.5,.8),line(b[0]+FSH[0]+8,b[1]+FSH[1],bx-8,b[1]+FSH[1]+40,{color:CF,w:2,dash:'4 5'})+label('力の 大きさ 12 N',bx,b[1]+FSH[1]+48,{size:26,color:CF,weight:700})+label('（Δ𝐫 の 向き。矢印の 長さは 決めていない）',bx,b[1]+FSH[1]+80,{size:22,color:C.dim}));
  return s;
 },
 // 小問3（約4秒）：原点の印を (2, −1, 3) へ動かす前後の座標軸だけ（矢印の付け替えは見せない）
 [K+'q3']:(p)=>{
  const P=VQ,m=seg(p,.15,.55),o=add(O3,P1,m),om=at(P,o);
  let s=axes3(P,{g:mix(1,.35,m)});
  s+=dot(...at(P,P1),7,CX)+dot(...at(P,P2),7,CX);
  const a=at(P,P1),b=at(P,P2);
  s+=label('出発点',a[0]-18,a[1]+40,{size:24,color:CX,anchor:'end',weight:700})+label('到着点',b[0]+16,b[1]+8,{size:24,color:CX,weight:700});
  s+=ring(om[0],om[1],13,{color:CH,w:4})+dot(om[0],om[1],5,CH);
  s+=axes3(P,{g:seg(p,.55,.8),o:P1,len:[2.6,2.6,2.6],labs:0,color:CH,w:2.5,dash:'8 6',neg:0});
  s+=fade(seg(p,.6,.85),label('新しい 原点',om[0]-18,om[1]-16,{size:24,color:CH,anchor:'end',weight:700}));
  s+=fade(seg(p,.1,.3),label('原点を (2, −1, 3) へ 取り直す',860,200,{size:28,color:CH,anchor:'middle',weight:700}));
  return s;
 },

 // ===================== 問題の設定 =====================
 // 1. ドローンが飛んで Δ𝐫 の跡。文2で Δ𝐫＝𝐫₂−𝐫₁
 [K+'setup']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,f=clamp((cueT(ctx)-.4)/2);
  let s=scene(VF,{fly:f,droneAt:flyPt(VF,f)});
  s+=panel(110,200,label('移動',PC,160,{size:28,color:C.dim,anchor:'middle'})+fade(seg(p,b,b+.1),T(`${DR}=${R2T}-${R1T}`,PC,245,48)),seg(p,b-.05,b+.05),CX);
  return s;
 },

 // ===================== 小問1 =====================
 // 2. 成分ごとの引き算（3行）→ Δ𝐫＝(2, 4, 4) m
 [K+'goal1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,d=(1-b)/5;
  let s=scene(VF,{droneAt:at(VF,P2)});
  s+=eqPanel(90,410,[[`${DR}=${R2T}-${R1T}`,140,36],
   ['x:\\ 4-2=2',215,34,seg(p,b,b+d*.6)],['y:\\ 3-(-1)=4',280,34,seg(p,b+d,b+d*1.6)],['z:\\ 7-3=4',345,34,seg(p,b+2*d,b+2*d*1.3)],
   [`${DR}=(2,\\,4,\\,4)\\ \\mathrm{m}`,440,42,seg(p,b+3*d,b+3.6*d)]],1);
  s+=goalTag(G1,{g:seg(p,.02,.12)});
  return s;
 },
 // 3. 直方体の対角線（横 2、奥 4、高さ 4）。文2で床の影
 [K+'box']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=boxScene({edges:seg(p,.1,.3),shadow:seg(p,b,b+.12)});
  s+=panel(110,250,label('長さ ＝ 直方体の 対角線',PC,165,{size:28,color:C.ink,anchor:'middle',weight:700})+T(`${DR}=(2,\\,4,\\,4)`,PC,235,38)
   +fade(seg(p,b,b+.1),label('まず 床の 影 を 見る',PC,310,{size:28,color:CX,anchor:'middle',weight:700})),1);
  s+=goalTag(G1);
  return s;
 },
 // 4. 床の直角三角形（2、4、影）。2²＋4²＝20、影 √20≈4.5
 [K+'shadow']:(p)=>{
  let s=boxScene({shadow:1,tri1:seg(p,.05,.2)});
  s+=panel(110,250,label('影の 長さの 2乗',PC,160,{size:26,color:CX,anchor:'middle',weight:700})+fade(seg(p,.1,.25),T('2^2+4^2',PC,225,38))+fade(seg(p,.35,.5),T('=4+16=20',PC,295,38)),1);
  s+=fade(seg(p,.6,.75),label('影 ＝ √20 ≈ 4.5',PC,340,{size:28,color:CX,anchor:'middle',weight:700}));
  s+=goalTag(G1);
  return s;
 },
 // 5. 影・高さ 4・Δ𝐫 の縦の直角三角形。20＋4²＝36 → √36＝6
 [K+'height']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=boxScene({shadow:1,tri2:seg(p,.05,.2),lenLab:seg(p,b+.35,b+.45)>.5?'6 m':''});
  s+=panel(110,330,label('影 と 高さは 直角 → 三平方 を もう一度',PC,160,{size:26,color:CH,anchor:'middle',weight:700})
   +fade(seg(p,b,b+.1),T(`|${DR}|^2=20+4^2=36`,PC,250,38))
   +fade(seg(p,b+.2,b+.3),T(`|${DR}|=\\sqrt{36}=6\\ \\mathrm{m}`,PC,340,40)),1);
  s+=goalTag(G1);
  return s;
 },
 // 6. 答え D（6 m）。誤答 A → B を一枚ずつ（B の間、影を光らせる）
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.35,m=b+(1-b)*.45;
  const inB=seg(p,m+.01,m+.05);
  let s=boxScene({shadow:1,hiShadow:inB,lenLab:'6 m'});
  s+=panel(90,120,T(`|${DR}|=\\sqrt{2^2+4^2+4^2}=6\\ \\mathrm{m}`,PC,155,32),1);
  s+=wrongSeq(p,ctx,[['A','10 m',['2 ＋ 4 ＋ 4 と、成分を 足した だけ','（対角線より 長すぎる）']],['B','約 4.5 m',['床の 影 √(2² ＋ 4²) で 止めた','（高さの 分が 抜けた）']]],{win:[[b,m],[m,1]],opts:{...WOPT,y:230}});
  s+=goalTag(G1)+ANS1(seg(p,.03,.1));
  return s;
 },
 // 7. 誤答 C（約 8.6 m）：原点からの 𝐫₂ を赤で光らせ、Δ𝐫 と並べる
 [K+'wrong1c']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55,blink=.5+.5*Math.sin(cueT(ctx)*6);
  const g2=seg(p,b,b+.08);
  let s=scene(VF,{r2:0,dr:mix(.3,1,g2),drW:7+4*g2});
  s+=fade(mix(1,.35,g2),A3(VF,O3,P2,{color:CD,w:4+3*blink,head:16}))+fade(1-g2,label('|𝐫₂| ≈ 8.6',at(VF,[2,1.5,3.5])[0]-12,at(VF,[2,1.5,3.5])[1],{size:24,color:CD,anchor:'end',weight:700}));
  s+=fade(seg(p,b,b+.1),panel(90,110,label('移動 ＝ 2点の 差（𝐫₂ − 𝐫₁）',PC,155,{size:28,color:CX,anchor:'middle',weight:700}),1,CX));
  s+=wrongCard('C','約 8.6 m',['あとの 位置 𝐫₂ の 長さ','|𝐫₂| ＝ √(16 ＋ 9 ＋ 49) ＝ √74'],{...WOPT,y:230,g:seg(p,.03,.1)});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },

 // ===================== 小問2 =====================
 // 8. 𝐅＝12 N ×（Δ𝐫 の向きの単位ベクトル）。文2で「長さ」と「向き」を分ける
 [K+'goal2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=scene(VF,{droneAt:at(VF,P2)});
  s+=farrow(VF,[4,8,8],{g:seg(p,.08,.2),dash:'10 8',w:5});
  { const q=at(VF,add(P1,[4,8,8],.25)); s+=fade(seg(p,.15,.25),label('12 N',q[0]+FSH[0]+14,q[1]+FSH[1]+8,{size:26,color:CF,weight:700})); }
  s+=panel(90,410,label('Δ𝐫 の 向きに 12 N で 押す',PC,140,{size:28,color:CF,anchor:'middle',weight:700})
   +fade(seg(p,b,b+.08),line(PX+30,175,PX+PW-30,175,{color:C.faint,w:2})
    +label('長さ（大きさ）',PX+140,230,{size:26,color:CF,anchor:'middle',weight:700})+label('向き',PX+400,230,{size:26,color:CH,anchor:'middle',weight:700})
    +label('12 N',PX+140,285,{size:30,color:CF,anchor:'middle',weight:700})+label('単位ベクトル',PX+400,285,{size:28,color:CH,anchor:'middle',weight:700}))
   +fade(seg(p,b+.2,b+.3),label('𝐅 ＝ 12 N ×（単位ベクトル）',PC,380,{size:30,color:C.ink,anchor:'middle',weight:700})
    +label('（向きが 同じで、長さ 1 の 矢印）',PC,430,{size:22,color:C.dim,anchor:'middle'})),1,CF);
  s+=goalTag(G2,{g:seg(p,.02,.12)});
  return s;
 },
 // 9. Δ𝐫 が長さ1に縮む（黄）。(2, 4, 4)÷6＝(1/3, 2/3, 2/3)、1/9＋4/9＋4/9＝1
 [K+'unit']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,k=mix(6,1,seg(p,.1,.4));
  let s=scene(VF,{dr:mix(1,.3,seg(p,.1,.3)),labs:1});
  const a=at(VF,P1),e=at(VF,add(P1,DIR,k));
  s+=arrow(a[0],a[1],e[0],e[1],{color:CH,w:7,head:20});
  s+=fade(seg(p,.4,.5),label('長さ 1',e[0]+14,e[1]+6,{size:24,color:CH,weight:700}));
  s+=eqPanel(90,410,[['(2,\\,4,\\,4)\\div 6',150,36,seg(p,.05,.15)],['=\\left(\\tfrac13,\\,\\tfrac23,\\,\\tfrac23\\right)',235,40,seg(p,.2,.35)],
   ['\\tfrac19+\\tfrac49+\\tfrac49=1',345,38,seg(p,b,b+.12)]],1);
  s+=fade(seg(p,b+.15,b+.25),label('2乗の和 ＝ 1 → 長さ 1',PC,435,{size:26,color:CH,anchor:'middle',weight:700}));
  s+=goalTag(G2);
  return s;
 },
 // 10. 12 倍した力の矢印（緑）(4, 8, 8)。16＋64＋64＝144 → √144＝12。答えの札 A
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,e1=W[0][1];
  let s=scene(VF,{dr:.3});
  const a=at(VF,P1),e=at(VF,add(P1,DIR,1));
  s+=fade(1-seg(p,.3,.4),arrow(a[0],a[1],e[0],e[1],{color:CH,w:7,head:20}));
  s+=farrow(VF,[4,8,8],{g:seg(p,.1,.35),lab:seg(p,.3,.4)>.5?'(4, 8, 8) N':''});
  s+=note('力の 矢印は 1 N ＝ 0.25 m の 目盛りで 描く',PC,490,{g:seg(p,.1,.2)});
  s+=eqPanel(90,330,[[`${FT}=12\\times\\left(\\tfrac13,\\,\\tfrac23,\\,\\tfrac23\\right)`,150,34,seg(p,.03,.12)],[`=(4,\\,8,\\,8)\\ \\mathrm{N}`,230,38,seg(p,e1*.5,e1*.7)],
   ['16+64+64=144',310,34,seg(p,b,b+.08)],['\\sqrt{144}=12\\ \\mathrm{N}',375,36,seg(p,b+.12,b+.2)]],1,CF);
  s+=goalTag(G2)+ANS2(seg(p,b+.4,b+.5));
  return s;
 },
 // 11. 誤答 B → C を一枚ずつ
 [K+'wrong2']:(p,ctx)=>{
  let s=scene(VF,{dr:.3})+farrow(VF,[4,8,8],{lab:'(4, 8, 8) N'});
  s+=panel(90,110,label('長さ 1 の 矢印 × 12 ＝ 長さ 12',PC,155,{size:28,color:CF,anchor:'middle',weight:700}),1,CF);
  s+=wrongSeq(p,ctx,[['B','(24, 48, 48) N',['単位ベクトルにせず、Δ𝐫 に 12 を 掛けた','（長さ 12 × 6 ＝ 72）']],
   ['C','(2.4, 4.8, 4.8) N',['成分の和 10 で 割った','（(0.2, 0.4, 0.4) の 長さは 0.6 で、1 でない）']]],{opts:{...WOPT,y:230}});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },
 // 12. 誤答 D（(12, 12, 12) N）：赤の矢印が Δ𝐫 の向きからずれる
 [K+'wrong2d']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=scene(VF,{dr:.3})+farrow(VF,[4,8,8]);
  s+=farrow(VF,[12,12,12],{g:seg(p,b,b+.12),color:CD,w:6});
  const rt=at(VF,add(P1,[12,12,12],.25));
  s+=fade(seg(p,b+.1,b+.2),label('(12, 12, 12) N',rt[0]+FSH[0]-30,rt[1]+FSH[1]-22,{size:22,color:CD,weight:700}));
  s+=note('力の 矢印は 1 N ＝ 0.25 m の 目盛りで 描く',PC,490);
  s+=wrongCard('D','(12, 12, 12) N',['大きさ 12 を 各成分に 配った','（向きも Δ𝐫 と 違う）'],{...WOPT,y:100,g:seg(p,.03,.1),mid:'|(12,\\,12,\\,12)|=12\\sqrt{3}\\approx20.8\\ \\mathrm{N}',midSize:30});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },

 // ===================== 小問3 =====================
 // 13. 原点の印が (2, −1, 3) へ動く。新しい座標軸（黄の点線）
 [K+'goal3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55,m=seg(p,.15,b),o=add(O3,P1,m),om=at(VF,o);
  let s=scene(VF,{ax:mix(1,.35,m),r1lab:1-seg(p,.1,.2)});
  s+=ring(om[0],om[1],13,{color:CH,w:4})+dot(om[0],om[1],5,CH);
  s+=axes3(VF,{g:seg(p,b-.05,b+.08),o:P1,len:[2.6,2.6,2.6],labs:0,color:CH,dash:'8 6',neg:0});
  s+=fade(seg(p,b-.05,b+.08),label('新しい 原点',om[0]-16,om[1]+42,{size:24,color:CH,anchor:'end',weight:700}));
  s+=panel(110,260,label('原点を (2, −1, 3) に 取り直す',PC,165,{size:28,color:CH,anchor:'middle',weight:700})
   +fade(seg(p,b,b+.1),line(PX+30,200,PX+PW-30,200,{color:C.faint,w:2})+label('位置 ＝ 原点からの 矢印',PC,260,{size:30,color:CX,anchor:'middle',weight:700})),1,CH);
  s+=goalTag(G3,{g:seg(p,.02,.12)});
  return s;
 },
 // 14. 位置の矢印が新しい原点から付け替わる。出発点 (0, 0, 0)、到着点 (2, 4, 4)
 [K+'newpos']:(p,ctx)=>{
  const W=sentWin(ctx),gOld=1-seg(p,.03,.2);
  let s=axes3(VF,{g:.35})+axes3(VF,{o:P1,len:[2.6,2.6,2.6],labs:0,color:CH,dash:'8 6',neg:0});
  s+=fade(gOld,A3(VF,O3,P1,{color:CX,w:3,head:14})+A3(VF,O3,P2,{color:CX,w:3,head:14}));
  s+=A3(VF,P1,P2,{color:CX,w:7,head:22,opacity:.45});
  const a=at(VF,P1),b=at(VF,P2);
  s+=fade(seg(p,.5,.65),A3(VF,P1,P2,{color:'#dff6ff',w:3,head:14}));
  s+=dot(...a,7,CX)+dot(...b,7,CX);
  s+=fade(seg(p,.15,.3),label('出発点',a[0]-16,a[1]-30,{size:24,color:CX,anchor:'end',weight:700})+T('(0,\\,0,\\,0)',a[0]-16,a[1]+8,28,{anchor:'end',color:CX}));
  s+=fade(seg(p,.5,.65),label('到着点',b[0]+16,b[1]-4,{size:24,color:CX,weight:700})+T('(2,\\,4,\\,4)',b[0]+16,b[1]+34,28,{anchor:'start',color:CX}));
  s+=panel(110,250,label('新しい 原点 から 見た 位置',PC,160,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.15,.3),label('出発点',PX+120,240,{size:28,color:CX,anchor:'middle',weight:700})+T('(0,\\,0,\\,0)',PX+340,232,36))
   +fade(seg(p,.5,.65),label('到着点',PX+120,315,{size:28,color:CX,anchor:'middle',weight:700})+T('(2,\\,4,\\,4)',PX+340,307,36)),1,CH);
  s+=goalTag(G3);
  return s;
 },
 // 15. Δ𝐫 だけが動かずに光る。(2, 4, 4)−(0, 0, 0)＝(2, 4, 4)。答えの札 B
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6,blink=.5+.5*Math.sin(cueT(ctx)*5);
  let s=axes3(VF,{g:.35})+axes3(VF,{o:P1,len:[2.6,2.6,2.6],labs:0,color:CH,dash:'8 6',neg:0});
  const a=at(VF,P1),c=at(VF,P2);
  s+=A3(VF,P1,P2,{color:CX,w:7+3*blink*seg(p,.05,.15),head:22})+T(DR,(a[0]+c[0])/2+20,(a[1]+c[1])/2+10,30,{anchor:'start'});
  s+=dot(...a,7,CX)+dot(...c,7,CX)+T('(0,\\,0,\\,0)',a[0]-16,a[1]+8,28,{anchor:'end',color:CX})+T('(2,\\,4,\\,4)',c[0]+16,c[1]+34,28,{anchor:'start',color:CX});
  s+=eqPanel(110,250,[[`${DR}=(2,\\,4,\\,4)-(0,\\,0,\\,0)`,170,34,seg(p,.05,.15)],['=(2,\\,4,\\,4)',245,38,seg(p,.2,.3)]],1,CX);
  s+=fade(seg(p,.3,.4),label('もとの Δ𝐫 と 同じ',PC,320,{size:28,color:CX,anchor:'middle',weight:700}));
  s+=goalTag(G3)+ANS3(seg(p,b+.15,b+.25));
  return s;
 },
 // 16. 誤答 A → C → D を一枚ずつ
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),e0=W[0][1],b1=W[1]?W[1][0]:.4,m=b1+(1-b1)*.45;
  let s=axes3(VF,{g:.35})+axes3(VF,{o:P1,len:[2.6,2.6,2.6],labs:0,color:CH,dash:'8 6',neg:0});
  const a=at(VF,P1),c=at(VF,P2);
  s+=A3(VF,P1,P2,{color:CX,w:7,head:22})+T(DR,(a[0]+c[0])/2+20,(a[1]+c[1])/2+10,30,{anchor:'start'});
  s+=dot(...a,7,CX)+dot(...c,7,CX)+T('(0,\\,0,\\,0)',a[0]-16,a[1]+8,28,{anchor:'end',color:CX})+T('(2,\\,4,\\,4)',c[0]+16,c[1]+34,28,{anchor:'start',color:CX});
  s+=panel(90,110,label('位置は 変わる、移動 Δ𝐫 は 変わらない',PC,155,{size:26,color:CX,anchor:'middle',weight:700}),1,CX);
  s+=wrongSeq(p,ctx,[['A','位置は そのまま','位置は 原点からの 矢印（原点で 変わる）'],
   ['C','Δ𝐫 ＝ (0, 0, 0)','原点に 重なるのは 出発点の 位置で、移動 ではない'],
   ['D','Δ𝐫 も 変わる','両方の 位置が 同じだけ ずれるので、差は 同じ']],{win:[[0,e0],[b1,m],[m,1]],opts:{...WOPT,y:230}});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },

 // ===================== まとめ =====================
 // 17. Δ𝐫＝(2, 4, 4) から3つの札へ線
 [K+'sum']:(p)=>{
  let s=scene(VF,{r1:.35,r2:.35,labs:0});
  const a=at(VF,P1),c=at(VF,P2),mx=(a[0]+c[0])/2,my=(a[1]+c[1])/2;
  s+=T(`${DR}=(2,\\,4,\\,4)`,c[0]+20,c[1]+40,30,{anchor:'start'});
  const items=[['長さ 6 m（三平方 を 2回）',130,CH],['(1/3, 2/3, 2/3) × 12 ＝ (4, 8, 8) N',250,CF],['原点を 動かしても Δ𝐫 は 同じ',370,CX]];
  items.forEach(([t,y,col],i)=>{const g=seg(p,.1+.12*i,.2+.12*i);
   s+=fade(g,line(mx+10,my,PX,y+30,{color:CH,w:2.5,dash:'6 6'}))+card(PX,y,PW,70,label(t,PC,y+46,{size:26,color:col,anchor:'middle',weight:700}),g,col);});
  s+=answerRow([[1,'D','6 m'],[2,'A','(4, 8, 8) N'],[3,'B','']],{g:seg(p,.7,.8)});
  return s;
 },
};

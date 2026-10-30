// 問題編 解説「曲がって速くなったパック」（q-ui-vector-map、大学編 05 ベクトル・初級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/05_ベクトル.md の q-ui-vector-map（解説 17 行）。
// 画面の配置（正本どおり）：左に方眼の矢印図（1マス＝1 m/s）、右にパックのアニメ（氷の面を真上から）と式。誤答カードは右側。
// 札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 色：速度 𝐯₁・𝐯₂ 紫、Δ𝐯 黄、押す力 緑、誤り 赤。右が x の正、上（氷の奥）が y の正。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,pauseBadge,note,cueT,tAt,sentWin} from './yt1-qx-common.mjs';

const K='qx-ui-vector-map:';
const CV=C.v,CH=C.hi,CF=C.F,CD='#ff6b6b';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const cc=(c,s)=>`{\\color{${c}}${s}}`;
const V1=cc(CV,'\\mathbf{v}_1'),V2=cc(CV,'\\mathbf{v}_2'),DV=cc(CH,'\\Delta\\mathbf{v}');
// 右の説明の枠
const PX=500,PW=680,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const G1='速度の変化 Δ𝐯',G2='Δ𝐯 の大きさ |Δ𝐯|',G3='スティックが押した向き';
const ANS1=g=>answerTag(1,'C','(−3, 4) m/s',{g}),ANS2=g=>answerTag(2,'A','5 m/s',{g}),ANS3=g=>answerTag(3,'B','左上、Δ𝐯 の向き',{g});
const check=(x,y,sz=18,color=CF)=>draw([[x-sz,y],[x-sz*.3,y+sz*.7],[x+sz,y-sz*.8]],1,{color,w:6});

// ---- 方眼（1マス＝1 m/s）----
const GO={ox:105,oy:450,u:56};
const X=a=>GO.ox+GO.u*a,Y=b=>GO.oy-GO.u*b;
function grid(g=1){
 let s='';
 for(let a=-1;a<=5;a++)s+=line(X(a),Y(-.6),X(a),Y(6.3),{color:C.grid,w:1.5});
 for(let b=0;b<=6;b++)s+=line(X(-1.3),Y(b),X(5.4),Y(b),{color:C.grid,w:1.5});
 s+=arrow(X(-1.3),Y(0),X(5.6),Y(0),{color:C.dim,w:2.5,head:13})+arrow(X(0),Y(-.6),X(0),Y(6.45),{color:C.dim,w:2.5,head:13});
 for(let a=-1;a<=5;a++)if(a)s+=label(String(a).replace('-','−'),X(a),Y(0)+27,{size:22,color:C.dim,anchor:'middle'});
 for(let b=1;b<=6;b++)s+=label(String(b),X(0)-10,Y(b)+8,{size:22,color:C.dim,anchor:'end'});
 s+=label('x',X(5.6)+6,Y(0)+8,{size:24,color:C.dim})+label('y',X(0)+14,Y(6.2)+8,{size:24,color:C.dim});
 s+=label('1マス ＝ 1 m/s',X(2.4),Y(0)+56,{size:22,color:C.dim,anchor:'middle'});
 return fade(g,s);
}
const vec=(a,b,c,d,{color=CV,g=1,w=6,head=20,opacity=1}={})=>arrow(X(a),Y(b),X(c),Y(d),{color,g,w,head,opacity});
// 𝐯₁、𝐯₂（紫）と、先端の札
function v12({g1=1,g2=1,op1=1,op2=1,lab=1,w1=6,w2=6}={}){
 let s=fade(op1,vec(0,0,4,1,{g:g1,w:w1}))+fade(op2,vec(0,0,1,5,{g:g2,w:w2}));
 if(lab){s+=fade(Math.min(g1,op1)*lab,T(`${V1}=(4,\\,1)`,X(4)+14,Y(1)+10,30,{anchor:'start'}));
  s+=fade(Math.min(g2,op2)*lab,T(`${V2}=(1,\\,5)`,X(1)+14,Y(5)-12,30,{anchor:'start'}));}
 return s;
}
// Δ𝐯（黄）：𝐯₁ の先端から 𝐯₂ の先端へ
const dv=({g=1,lab=1,w=7,op=1,txt=DV}={})=>fade(op,vec(4,1,1,5,{color:CH,g,w,head:22})+fade(g*lab,T(txt,X(2.5)+30,Y(3)-14,30,{anchor:'start'})));
// 階段（左へ 3、上へ 4）
function stairs({g1=1,g2=1,labs=1,ra=0,short=0}={}){
 let s=fade(g1,line(X(4),Y(1),X(1),Y(1),{color:CH,w:3,dash:'6 6'}))+fade(g2,line(X(1),Y(1),X(1),Y(5),{color:CH,w:3,dash:'6 6'}));
 if(labs)s+=fade(g1*labs,label(short?'横 3':'左へ 3',X(2.5),Y(1)-14,{size:24,color:CH,anchor:'middle',weight:700}))
  +fade(g2*labs,label(short?'縦 4':'上へ 4',X(1)+14,Y(2.2)+8,{size:24,color:CH,weight:700}));
 if(ra){const q=14;s+=fade(ra,draw([[X(1)+q,Y(1)],[X(1)+q,Y(1)-q],[X(1),Y(1)-q]],1,{color:C.ink,w:2.5}));}
 return s;
}

// ---- 氷の面（真上から）とパック ----
const IX=510,IY=92,IW=670,IH=405;
const HP=[830,330],KS=40,TH=1.7,TA=1.0;   // 当たる点、1 m/s ＝ 毎秒 40 px、当たるまで 1.7 s、当たってから 1.0 s
const puckAt=t=>t<TH?[HP[0]-4*KS*(TH-t),HP[1]+1*KS*(TH-t)]:[HP[0]+1*KS*(Math.min(t,TH+TA)-TH),HP[1]-5*KS*(Math.min(t,TH+TA)-TH)];
function ice(t,{g=1,labs=1,burst=1,hitLab=1}={}){
 let s=rect(IX,IY,IW,IH,{fill:'#0f2238',fo:.9,stroke:'#3a5a7a',sw:2,rx:16});
 s+=label('氷の面（真上から 見る）',IX+18,IY+34,{size:22,color:C.dim});
 // 小さな座標軸（右が x、上が y）
 const ax=IX+IW-120,ay=IY+IH-36;
 s+=arrow(ax,ay,ax+70,ay,{color:C.dim,w:2.5,head:12})+arrow(ax,ay,ax,ay-70,{color:C.dim,w:2.5,head:12})
  +label('x',ax+78,ay+8,{size:22,color:C.dim})+label('y（奥）',ax+8,ay-76,{size:22,color:C.dim});
 const t0=Math.max(0,t),P0=puckAt(0),P=puckAt(t0);
 // 通った跡（点線）
 if(t0>0)s+=draw(t0<TH?[P0,P]:[P0,HP,P],1,{color:C.dim,w:2.5,dash:'5 8'});
 if(labs&&t0>TH*.6)s+=fade(clamp((t0-TH*.6)/.4)*labs,T(`${V1}=(4,\\,1)`,690,410,28));
 if(labs&&t0>TH+.5)s+=fade(clamp((t0-TH-.5)/.4)*labs,T(`${V2}=(1,\\,5)`,875,215,28,{anchor:'start'}));
 // 当たった瞬間の光（向きを持たない放射状の線）
 if(burst&&t0>=TH-.05){const u=clamp((t0-TH+.05)/.35),r1=22+10*u,r2=34+18*u,o=t0>TH+.8?.35:1;
  let b='';for(let i=0;i<10;i++){const a=i*Math.PI/5+.3;b+=line(HP[0]+r1*Math.cos(a),HP[1]+r1*Math.sin(a),HP[0]+r2*Math.cos(a),HP[1]+r2*Math.sin(a),{color:CH,w:3});}
  s+=fade(o,b)+fade(hitLab,label('スティックで 打つ',HP[0]-30,HP[1]-46,{size:22,color:C.dim,anchor:'end'}));}
 s+=ring(P[0],P[1],17,{color:C.dim,w:3,fill:'#04060c'});
 return fade(g,s);
}

// 式を中央にそろえて並べる枠
const eqPanel=(y,h,rows,g=1,stroke=C.faint)=>panel(y,h,rows.map(([s,yy,size,o])=>fade(o??1,T(s,PC,yy,size??38))).join(''),g,stroke);
// 長さの棒（右の枠の中）
function bar(x,y,len,col,txt,{g=1,unit=60}={}){
 return fade(g,rect(x,y-16,len*unit,22,{fill:col,fo:.75,stroke:col,sw:1,rx:4})+label(txt,x+len*unit+14,y+2,{size:24,color:col,weight:700}));
}

export const ytQxUiVectorMapDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（約6秒）：0〜2.7 s でパックが左から来て、当たって右上へ（速さの変わり方以外の情報は出さない）。
 //   3〜5 s で方眼に 𝐯₁、𝐯₂ を順に描く。Δ𝐯・成分・長さ・押す力は描かない。
 [K+'q1']:(p,ctx)=>{
  const t=cueT(ctx);
  let s=ice(t,{labs:1})+grid(seg(p,0,.08));
  s+=v12({g1:seg(p,.5,.64),g2:seg(p,.7,.84)});
  return s;
 },

 // ===================== 問題の設定 =====================
 // 1. パックのアニメ（文1）→ 方眼に同じ根元から 𝐯₁、𝐯₂（文2）
 [K+'setup']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=ice(cueT(ctx)-.3)+grid(seg(p,b-.06,b));
  s+=v12({g1:seg(p,b+.02,b+.2),g2:seg(p,b+.22,b+.4)});
  s+=fade(seg(p,b+.02,b+.12),dot(X(0),Y(0),8,C.ink)+label('同じ 根元',X(0)+14,Y(0)-34,{size:22,color:C.ink}));
  return s;
 },

 // ===================== 小問1 =====================
 // 2. Δ𝐯＝𝐯₂−𝐯₁。「あと」で 𝐯₂、「前」で 𝐯₁ を光らせる
 [K+'goal1']:(p,ctx)=>{
  const W=sentWin(ctx),[a,b]=W[1]??[.45,.95],m=(a+b)/2;
  const h2=seg(p,a+.02,a+.08)*(1-seg(p,m-.03,m)),h1=seg(p,m,m+.06);
  let s=grid()+v12({w2:6+4*h2,w1:6+4*h1});
  s+=fade(h2,label('あと',X(1)-16,Y(4.2),{size:26,color:CH,anchor:'end',weight:700}))+fade(h1,label('前',X(3),Y(.75)-18,{size:26,color:CH,anchor:'middle',weight:700}));
  const e=`${DV}=${V2}-${V1}`,w=texWidth(e,60,false),x0=PC-w/2,w2=texWidth(`${DV}=`,60,false),w3=texWidth(`${DV}=${V2}`,60,false),w4=texWidth(`${DV}=${V2}-`,60,false),wv1=texWidth(V1,60,false);
  s+=panel(110,300,label('速度の 変化',PC,165,{size:28,color:C.dim,anchor:'middle'})+T(e,PC,260,60)
   +highlight(x0+w2-8,215,w3-w2+16,90,h2)+highlight(x0+w-wv1-8,215,wv1+16,90,h1)
   +fade(h2,label('あとの 速度',x0+(w2+w3)/2,350,{size:24,color:CH,anchor:'middle',weight:700}))
   +fade(h1,label('前の 速度',x0+w-wv1/2,350,{size:24,color:CH,anchor:'middle',weight:700})),seg(p,.03,.15),CH);
  s+=goalTag(G1,{g:seg(p,.02,.12)});
  return s;
 },
 // 3. 成分ごとの引き算（文1：x、文2：y）。方眼で先端から軸へ点線
 [K+'comp']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,gx=seg(p,.03,.15),gy=seg(p,b,b+.1);
  let s=grid()+v12();
  s+=fade(gx*(1-.6*gy),line(X(4),Y(1),X(4),Y(0),{color:C.x,w:3,dash:'5 6'})+line(X(1),Y(5),X(1),Y(0),{color:C.x,w:3,dash:'5 6'})+ring(X(4),Y(0),14,{color:C.x,w:3})+ring(X(1),Y(0),14,{color:C.x,w:3}));
  s+=fade(gy,line(X(4),Y(1),X(0),Y(1),{color:C.x,w:3,dash:'5 6'})+line(X(1),Y(5),X(0),Y(5),{color:C.x,w:3,dash:'5 6'})+ring(X(0),Y(1),14,{color:C.x,w:3})+ring(X(0),Y(5),14,{color:C.x,w:3}));
  s+=panel(110,330,T(`${DV}=${V2}-${V1}`,PC,170,40)+line(PX+40,215,PX+PW-40,215,{color:C.faint,w:2})
   +fade(gx,label('x：',PX+130,290,{size:32,color:C.ink,weight:700})+T('1-4=-3',PX+330,282,44))
   +fade(gy,label('y：',PX+130,390,{size:32,color:C.ink,weight:700})+T('5-1=4',PX+330,382,44)),1);
  s+=goalTag(G1);
  return s;
 },
 // 4. Δ𝐯＝(−3, 4)。𝐯₁ の先端から 𝐯₂ の先端へ黄の矢印。階段（点線）。答えの札 C
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),[a0,b0]=W[0],b=W[1]?W[1][0]:.5;
  let s=grid()+v12()+dv({g:seg(p,.04,.2)});
  s+=fade(seg(p,b,b+.06)*(1-seg(p,b+.2,b+.26)),ring(X(4),Y(1),18,{color:CH,w:4}));
  s+=fade(seg(p,b+.2,b+.26),ring(X(1),Y(5),18,{color:CH,w:4}));
  s+=stairs({g1:seg(p,b+.3,b+.4),g2:seg(p,b+.4,b+.5)});
  s+=panel(110,200,label('小問1',PC,155,{size:24,color:C.dim,anchor:'middle'})+T(`${DV}=(-3,\\,4)\\ \\mathrm{m/s}`,PC,245,50),seg(p,.03,.15),CH);
  s+=goalTag(G1)+ANS1(seg(p,a0+(b0-a0)*.7,a0+(b0-a0)*.8));
  return s;
 },
 // 5. 点が階段をたどる (4, 1) → (1, 1) → (1, 5)。緑の ✓
 [K+'check']:(p,ctx)=>{
  const W=sentWin(ctx),e0=W[0][1],u1=seg(p,.12,e0*.55),u2=seg(p,e0*.55,e0*.95);
  let s=grid()+v12()+dv()+stairs({g1:1,g2:1});
  const px=mix(X(4),X(1),u1),py=mix(Y(1),Y(5),u2);
  s+=dot(px,py,11,C.ink)+ring(px,py,16,{color:C.ink,w:2});
  s+=fade(seg(p,e0,e0+.06),check(X(1)-30,Y(5)+34));
  s+=panel(110,250,label('確かめ',PC,155,{size:24,color:C.dim,anchor:'middle'})
   +T('(4,\\,1)',PX+140,250,38)+fade(seg(p,.12,.2),T('\\to(1,\\,1)',PX+330,250,38))+fade(seg(p,e0*.6,e0*.7),T('\\to(1,\\,5)',PX+540,250,38))
   +fade(seg(p,e0,e0+.06),label(`𝐯₂ の 先端に 着く`,PC,320,{size:28,color:CF,anchor:'middle',weight:700})),1);
  s+=goalTag(G1)+ANS1(1);
  return s;
 },
 // 6. 誤答 A → B → D を一枚ずつ（A の間：逆向きの矢印を赤、B の間：(5, 6) の赤い矢印）
 [K+'wrong1']:(p,ctx)=>{
  const W=sentWin(ctx),e0=W[0][1],b1=W[1]?W[1][0]:.45,m=b1+(1-b1)*.42;
  const wA=[0,e0],wB=[b1,m],wD=[m,1];
  const inA=seg(p,.02,.06)*(1-seg(p,e0-.04,e0)),inB=seg(p,wB[0]+.01,wB[0]+.05)*(1-seg(p,m-.04,m));
  let s=grid()+v12()+dv();
  s+=fade(inA,vec(1,5,4,1,{color:CD,w:6,head:20}));
  s+=fade(inB,vec(0,0,5,6,{color:CD,w:6,head:20})+label('(5, 6)',X(5)-10,Y(6)+8,{size:24,color:CD,anchor:'end',weight:700}));
  s+=panel(90,120,T(`${DV}=${V2}-${V1}=(-3,\\,4)`,PC,155,40),1);
  s+=wrongSeq(p,ctx,[
   ['A','(3, −4) m/s','引く 順番が 逆（𝐯₁ − 𝐯₂ を 計算した）'],
   ['B','(5, 6) m/s','引き算 ではなく、足し算 をした（𝐯₁ ＋ 𝐯₂）'],
   ['D','(−3, −4) m/s','y の 符号を 取り違えた',{mid:'5-1=+4'}],
  ],{win:[wA,wB,wD],opts:{...WOPT,y:240}});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },

 // ===================== 小問2 =====================
 // 7. Δ𝐯 を斜辺とする直角三角形（横 3、縦 4）と直角の印
 [K+'goal2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=grid()+v12({op1:.35,op2:.35,lab:0})+dv();
  s+=stairs({g1:seg(p,b,b+.1),g2:seg(p,b+.08,b+.18),labs:1,short:1,ra:seg(p,b+.2,b+.3)});
  s+=panel(110,300,label('小問2',PC,155,{size:24,color:C.dim,anchor:'middle'})+T(`|${DV}|`,PC,235,54)+label('＝ 斜辺の 長さ',PC,310,{size:28,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,b+.3,b+.4),label('横 と 縦が 直角 → 三平方',PC,375,{size:28,color:CH,anchor:'middle',weight:700})),seg(p,.03,.15),CH);
  s+=goalTag(G2,{g:seg(p,.02,.12)});
  return s;
 },
 // 8. 3²＋4²＝9＋16＝25 → √25＝5。斜辺に「5」。答えの札 A
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),e0=W[0][1],b=W[1]?W[1][0]:.6;
  let s=grid()+v12({op1:.35,op2:.35,lab:0})+dv({lab:0})+stairs({labs:1,short:1,ra:1});
  s+=fade(seg(p,e0*.8,e0),T('5',X(2.5)+30,Y(3)-14,40,{anchor:'start',color:CH}));
  s+=eqPanel(110,300,[[`3^2+4^2=9+16=25`,200,44,seg(p,.03,.12)],[`|${DV}|=\\sqrt{25}=5\\ \\mathrm{m/s}`,320,48,seg(p,e0*.6,e0*.75)]],1);
  s+=goalTag(G2)+ANS2(seg(p,b+.12,b+.2));
  return s;
 },
 // 9. 誤答 B → C（一枚ずつ）。文2で、2辺の和 7 と斜辺 5 を棒で並べる
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),e0=W[0][1],b=W[1]?W[1][0]:.5,m=e0*.5;
  const g2=seg(p,b,b+.08);
  let s=grid()+v12({op1:.35,op2:.35,lab:0})+dv({lab:0})+stairs({labs:1,short:1,ra:1})+T('5',X(2.5)+30,Y(3)-14,40,{anchor:'start',color:CH});
  s+=panel(90,150,label('2辺の和',PX+30,140,{size:24,color:CD,weight:700})+bar(PX+150,140,7,CD,'3 ＋ 4 ＝ 7',{unit:48})
   +label('斜辺',PX+30,200,{size:24,color:CH,weight:700})+bar(PX+150,200,5,CH,'5',{unit:48}),g2);
  s+=wrongSeq(p,ctx,[['B','1 m/s','−3 と 4 を そのまま 足した（−3 ＋ 4）'],['C','7 m/s','3 と 4 を 足した（直角な 2辺の 和）']],{win:[[0,m],[m,1]],opts:{...WOPT,y:260}});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },
 // 10. 誤答 D（約 0.98 m/s）。文2で |𝐯₁|＝√17≈4.1、|𝐯₂|＝√26≈5.1 の棒
 [K+'wrong2d']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,m=b+(1-b)*.5;
  let s=grid()+v12({w1:6+3*seg(p,b,b+.06),w2:6+3*seg(p,m,m+.06)})+dv({op:.35,lab:0});
  s+=fade(seg(p,b,b+.06),T('\\sqrt{17}',X(2.3),Y(.6)-26,30,{color:CV}))+fade(seg(p,m,m+.06),T('\\sqrt{26}',X(1.1)+16,Y(3.6),30,{color:CV,anchor:'start'}));
  s+=wrongCard('D','約 0.98 m/s',['速さの 差 |𝐯₂| − |𝐯₁| を 計算した','（向きの 変化を 数えていない）'],{...WOPT,y:300,g:seg(p,.03,.1)});
  s+=panel(90,190,label('|𝐯₁|',PX+30,140,{size:26,color:CV,weight:700})+bar(PX+110,140,4.123,CV,'√17 ≈ 4.1',{unit:60,g:seg(p,b,b+.08)})
   +label('|𝐯₂|',PX+30,200,{size:26,color:CV,weight:700})+bar(PX+110,200,5.099,CV,'√26 ≈ 5.1',{unit:60,g:seg(p,m,m+.08)})
   +fade(seg(p,m+.15,m+.25),label('差 ≈ 0.98',PX+110+4.6*60,255,{size:26,color:CD,anchor:'middle',weight:700})+line(PX+110+4.123*60,226,PX+110+5.099*60,226,{color:CD,w:5})),seg(p,b-.04,b+.04));
  s+=goalTag(G2)+ANS2(1);
  return s;
 },
 // 11. 𝐯₁ から 𝐯₂ へ矢印が回る。速さの差 0.98 と |Δ𝐯|＝5 を並べる
 [K+'turn']:(p,ctx)=>{
  const t=cueT(ctx),u=clamp(((t%4)-.5)/2.2);
  const a1=Math.atan2(1,4),a2=Math.atan2(5,1),L1=Math.hypot(4,1),L2=Math.hypot(1,5);
  const an=mix(a1,a2,u),L=mix(L1,L2,u);
  let s=grid()+v12({op1:.4,op2:.4})+dv({op:.6});
  s+=vec(0,0,L*Math.cos(an),L*Math.sin(an),{color:C.ink,w:5,head:18});
  s+=fade(.6,draw(Array.from({length:21},(_,i)=>{const q=mix(a1,an,i/20),r=1.6;return [X(r*Math.cos(q)),Y(r*Math.sin(q))];}),1,{color:CH,w:3}));
  s+=panel(110,300,label('速さの 差',PX+40,190,{size:26,color:CV,weight:700})+bar(PX+180,190,.976,CV,'0.98 m/s',{unit:66})
   +label('|Δ𝐯|',PX+40,280,{size:26,color:CH,weight:700})+bar(PX+180,280,5,CH,'5 m/s',{unit:66})
   +fade(seg(p,.35,.5),label('向きが 大きく 変わった',PC,370,{size:28,color:CH,anchor:'middle',weight:700})),1);
  s+=goalTag(G2)+ANS2(1);
  return s;
 },
 // 12. 単元の動画の、壁で跳ね返る球（右向き 3 m/s → 左向き 3 m/s）を右下に小さく再掲
 [K+'bounce']:(p,ctx)=>{
  const t=cueT(ctx),wx=1150,by=360,x0=560,sp=160;
  const tt=Math.min(t,8),hit=(wx-24-x0)/sp,bx=tt<hit?x0+sp*tt:Math.max(x0,wx-24-sp*(tt-hit));
  let s=grid()+v12({op1:.4,op2:.4,lab:0})+dv({op:.6,lab:0});
  s+=card(PX,180,PW,320,label('単元の 動画より',PX+20,214,{size:22,color:C.dim})
   +line(wx,240,wx,470,{color:C.dim,w:4})+line(PX+30,420,wx,420,{color:C.faint,w:2})
   +ring(bx,by,22,{color:C.ink,w:3,fill:'#2a3346'})
   +(tt<hit?arrow(bx+26,by-46,bx+26+3*28,by-46,{color:CV,w:5,head:14})+label('＋3 m/s',bx,by-62,{size:24,color:CV,weight:700}):
     arrow(bx-26,by-46,bx-26-3*28,by-46,{color:CV,w:5,head:14})+label('−3 m/s',bx-30,by-62,{size:24,color:CV,anchor:'end',weight:700}))
   +fade(clamp((tt-hit-.8)/.5),label('速さは 同じ 3 m/s',PX+40,460,{size:24,color:C.ink,weight:700})
    +T(`\\Delta v=-3-3=-6\\ \\mathrm{m/s}`,PX+470,452,30,{color:CH}))
   ,seg(p,.02,.1));
  s+=fade(seg(p,.02,.1),label('速度の 変化は 0 ではない',PC,140,{size:30,color:CH,anchor:'middle',weight:700}));
  s+=goalTag(G2)+ANS2(1);
  return s;
 },

 // ===================== 小問3 =====================
 // 13. パックのアニメを、当たる瞬間で映像を一時停止。摩擦なし → 速度を変えたのはスティックの力だけ
 [K+'goal3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,t=Math.min(cueT(ctx),TH),stop=cueT(ctx)>=TH?1:0;
  let s=grid()+v12({lab:0})+dv();
  s+=ice(t,{labs:0});
  s+=fade(stop,pauseBadge({x:960,y:86}));
  s+=fade(seg(p,b,b+.08),rect(IX+20,IY+IH-84,420,66,{fill:'#131f38',fo:.95,stroke:C.faint,sw:2,rx:10})
   +label('摩擦なし →',IX+36,IY+IH-58,{size:22,color:C.dim})+label('速度を 変えたのは スティックの 力 だけ',IX+36,IY+IH-28,{size:22,color:C.ink,weight:700}));
  s+=goalTag(G3,{g:seg(p,.02,.12)});
  return s;
 },
 // 14. 押す力（緑）を Δ𝐯（黄）と同じ向きに。答えの札 B
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=grid()+v12({lab:0,op1:.5,op2:.5})+dv({w:7+3*seg(p,.05,.15)});
  s+=ice(TH,{labs:0,hitLab:0})+pauseBadge({x:960,y:86});
  const ux=-.6,uy=-.8,Lf=120;
  s+=arrow(HP[0],HP[1],HP[0]+ux*Lf,HP[1]+uy*Lf,{color:CF,w:7,head:22,g:seg(p,.1,.3)});
  s+=fade(seg(p,.25,.35),label('押す力',HP[0]+ux*Lf-10,HP[1]+uy*Lf-6,{size:26,color:CF,anchor:'end',weight:700}));
  const ox=-.8*40,oy=.6*40;
  s+=fade(seg(p,.3,.42),arrow(HP[0]+ox,HP[1]+oy,HP[0]+ox+ux*Lf,HP[1]+oy+uy*Lf,{color:CH,w:4,head:16})+T(DV,HP[0]+ox+ux*Lf*.5-20,HP[1]+oy+uy*Lf*.5+18,26,{anchor:'end'}));
  s+=fade(seg(p,.35,.45),label('同じ 向き（左上）',HP[0]-150,HP[1]+120,{size:24,color:CH,weight:700}));
  s+=goalTag(G3)+ANS3(seg(p,b+.15,b+.23));
  return s;
 },
 // 15. 𝐯₁＋Δ𝐯＝𝐯₂ の継ぎ足し（文1）→ 成分ごとの足し算（文2）
 [K+'add']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  const h1=seg(p,.02,.06)*(1-seg(p,b*.33,b*.37)),hd=seg(p,b*.33,b*.38)*(1-seg(p,b*.66,b*.7)),h2=seg(p,b*.66,b*.72);
  let s=grid()+v12({w1:6+4*h1,w2:6+4*h2})+dv({w:7+4*hd});
  s+=panel(110,330,''
   +label('右向き',PX+110,170,{size:28,color:CV,anchor:'middle',weight:700})+fade(seg(p,b*.33,b*.38),label('＋　左上の 変化',PX+330,170,{size:28,color:CH,anchor:'middle',weight:700}))
   +fade(seg(p,b*.66,b*.72),label('→　右上',PX+560,170,{size:28,color:CV,anchor:'middle',weight:700}))
   +fade(seg(p,b,b+.08),line(PX+40,215,PX+PW-40,215,{color:C.faint,w:2})+T(`${V1}+${DV}=${V2}`,PC,270,40))
   +fade(seg(p,b+.1,b+.18),T('(4,\\,1)+(-3,\\,4)',PC,345,38))
   +fade(seg(p,b+.22,b+.3),T('=(4-3,\\ 1+4)=(1,\\,5)',PC,410,38)),1);
  s+=goalTag(G3)+ANS3(1);
  return s;
 },
 // 16. 誤答 A → C → D を一枚ずつ（A の間 𝐯₂、C の間 𝐯₁ を光らせる）
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),e0=W[0][1],b1=W[1]?W[1][0]:.5,m=e0*.5;
  const inA=seg(p,.02,.06)*(1-seg(p,m-.04,m)),inC=seg(p,m+.01,m+.05)*(1-seg(p,e0-.04,e0)),inD=seg(p,b1+.01,b1+.05);
  let s=grid()+v12({w1:6+4*inC,w2:6+4*inA})+dv({w:7+4*inD});
  s+=panel(90,120,label('押した 向き ＝ Δ𝐯 の 向き（左上）',PC,160,{size:28,color:CH,anchor:'middle',weight:700}),1);
  s+=wrongSeq(p,ctx,[
   ['A','右上（𝐯₂ の向き）','打った後の 進む向きと、押した向きを 混同した'],
   ['C','右（𝐯₁ の向き）','打つ前の 進む向きを 答えた'],
   ['D','押していない','速さの 差だけを 見た（|Δ𝐯| は 5 m/s ある）'],
  ],{win:[[0,m],[m,b1],[b1,1]],opts:{...WOPT,y:240}});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },

 // ===================== まとめ =====================
 // 17. 方眼の 𝐯₁、𝐯₂、Δ𝐯＝(−3, 4)。右に 3・4・5 の三角形と押す力の矢印。黄の線でつなぐ。答えの札を並べる
 [K+'sum']:(p)=>{
  let s=grid()+v12()+dv({txt:`${DV}=(-3,\\,4)`});
  const g1=seg(p,.1,.2),g2=seg(p,.25,.35);
  // 3・4・5 の三角形
  const tx=600,ty=400,su=40;
  s+=card(PX,110,320,330,line(tx+3*su,ty,tx,ty,{color:CH,w:4})+line(tx,ty,tx,ty-4*su,{color:CH,w:4})
   +line(tx+3*su,ty,tx,ty-4*su,{color:CH,w:6})+label('3',tx+1.5*su,ty+30,{size:24,color:CH,anchor:'middle',weight:700})
   +label('4',tx-14,ty-2*su+8,{size:24,color:CH,anchor:'end',weight:700})+label('5',tx+1.8*su+16,ty-2.4*su,{size:28,color:CH,weight:700})
   +label('|Δ𝐯| ＝ 5 m/s',PX+160,150,{size:26,color:CH,anchor:'middle',weight:700}),g1,CH);
  // 押す力
  const fx=990,fy=380;
  s+=card(PX+360,110,320,330,arrow(fx+40,fy,fx+40-.6*150,fy-.8*150,{color:CF,w:7,head:22})+label('押す力',fx+10,fy+50,{size:26,color:CF,anchor:'middle',weight:700})
   +label('Δ𝐯 と 同じ 向き',PX+520,150,{size:26,color:CF,anchor:'middle',weight:700}),g2,CF);
  s+=fade(g1,line(X(3.1),Y(2.2),PX,Y(2.2),{color:CH,w:3}));
  s+=fade(g2,line(PX+320,Y(2.2),PX+360,Y(2.2),{color:CH,w:3}));
  s+=fade(seg(p,.45,.55),label('向きの 変化も 数える',PC,480,{size:28,color:CH,anchor:'middle',weight:700}));
  s+=answerRow([[1,'C','(−3, 4) m/s'],[2,'A','5 m/s'],[3,'B','左上']],{g:seg(p,.7,.8)});
  return s;
 },
};

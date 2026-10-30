// 問題編 解説「斜めの面と、上から近づく N 極」（q-ui-induction、大学編 27 電磁誘導・初級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/27_電磁誘導.md の q-ui-induction（解説 18 行）。
// 画面の配置：左に図、右に説明の枠（紺の塗り・角の丸い枠）。誤答カードは右の枠の中・下。札の帯（y＜78）には図を描かない。
// 色（単元動画と同じ）：元の磁場 𝐁 橙、誘導の磁場 赤、電流 I・輪 緑、磁束 Φ 黄、法線 桃、起電力 ℰ 紫、時間 t 金、強調 黄。
// 前半の図は「真横から見た図」（面は線に見える。𝐁 は右向き、法線は 𝐁 から 60°）。後半：横から見た輪の上から N 極（下）が近づく。
// 真上から見た図では、上向きが ⊙（手前）、下向きが ⊗（奥）。画面上の回り方は、真上から見た回り方そのもの。
// 部品は 電磁誘導・中級 1/3（yt1-um-induction-1-diagrams.mjs）の export を借りる（あちらは編集しない）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,cueT,tAt,sentWin,voiceEnd} from './yt1-qx-common.mjs';
import {head,outSym,inSym,arcPts,graph} from './yt1-um-induction-1-diagrams.mjs';

const K='qx-ui-induction:';
const BC=C.E,IND='#ff6b6b',CI=C.F,PHI=C.hi,NC=C.p,EMF=C.v,TC=C.t,SURF='#c9d6ee',CD='#ff6b6b';
const RAD=Math.PI/180;
const T=(s,x,y,size=36,o={})=>tex(s,x,y,{size,auto:false,...o});
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const PX=680,PW=500,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const LB=(s,x,y,size=26,color=C.ink,o={})=>label(s,x,y,{size,color,anchor:'middle',weight:700,...o});
const LN=(s,x,y,size=24,color=C.dim,o={})=>label(s,x,y,{size,color,anchor:'middle',...o});
const G1='面を貫く磁束 Φ',G2='電流の向き（真上から見て）',G3='電流の大きさ I';
const ANS1=g=>answerTag(1,'D','0.15 Wb',{g}),ANS2=g=>answerTag(2,'B','反時計回り',{g}),ANS3=g=>answerTag(3,'A','0.2 A',{g});

// ナレーションの読み（かな）の中で、語 frag が読まれ始める所（cue の進み 0〜1）
function atWord(ctx,frag,fb=.5){
 const r=(ctx?.cue?.reading??'').replace(/\s/g,''),f=frag.replace(/\s/g,''),i=r.indexOf(f);
 if(!r||i<0)return fb;return i/r.length*voiceEnd(ctx);
}
// 語の並び → 誤答カードの区間 [[0,a],[a,b],…,[z,1]]
function wins(ctx,frags){const a=frags.map(f=>atWord(ctx,f));return [[0,a[0]],...a.map((x,i)=>[x,i===a.length-1?1:a[i+1]])].slice(0,frags.length+1);}

// ===== 前半：真横から見た面（線）、𝐁（右向き）、法線（60°）=====
const NA=60,EA=-30; // 法線の角、面の向き（𝐁 から反時計回りに測る）
const U=(a,r=1)=>[r*Math.cos(a*RAD),-r*Math.sin(a*RAD)];
function arcDeg(cx,cy,r,a0,a1){return Array.from({length:25},(_,i)=>{const a=(a0+(a1-a0)*i/24)*RAD;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});}
function slab({cx=300,cy=300,g=1,fieldG=1,x0=50,x1=620,plate=1,area=1,areaTxt='0.6 m²',nG=1,arc60=1,arc60Hi=0,LB_=170,bMain=0,sh=0,shTxt='',shLab=0,arc30=0,mark=0,bLab=1,view=1}={}){
 let s='';
 // 背景の磁場（右向き・一様）
 let f='';for(const y of [140,205,400,470])for(let x=x0;x+70<=x1;x+=125)f+=arrow(x,y,x+70,y,{color:BC,w:4,head:14});
 s+=fade(fieldG*.55,f);
 if(bLab)s+=fade(fieldG,label('磁場 0.5 T（右向き）',x0,122,{size:24,color:BC,weight:700}));
 if(view)s+=fade(fieldG,label('真横から 見た図',x1,505,{size:22,color:C.dim,anchor:'end'}));
 // 面（線に見える）
 const [ex,ey]=U(EA,140);
 s+=fade(plate,line(cx-ex,cy-ey,cx+ex,cy+ey,{color:SURF,w:11}));
 s+=fade(plate*area,label(areaTxt,cx+ex+16,cy+ey+8,{size:28,color:SURF,weight:700}));
 // 𝐁 の代表の矢印（中心から）と影
 const [bx,by]=[cx+LB_,cy],par=LB_*Math.cos(NA*RAD),[px,py]=[cx+U(NA,par)[0],cy+U(NA,par)[1]];
 if(sh>0){s+=fade(sh,line(bx,by,px,py,{color:PHI,w:2.5,dash:'7 6'}));s+=fade(sh,line(cx,cy,px,py,{color:PHI,w:12,cap:'butt'}));}
 // 法線
 const [nx,ny]=U(NA,140);
 s+=fade(nG,arrow(cx,cy,cx+nx,cy+ny,{color:NC,w:6,head:18})+label('法線',cx+nx+10,cy+ny-6,{size:26,color:NC,weight:700}));
 if(bMain>0)s+=fade(bMain,arrow(cx,cy,bx,by,{color:BC,w:7,head:20})+label('𝐁',bx+8,by+10,{size:28,color:BC,weight:700}));
 if(sh>0&&shLab>0)s+=fade(shLab,label('B⊥',px-16,py+2,{size:28,color:PHI,anchor:'end',weight:700}));
 if(sh>0&&shTxt)s+=fade(sh,label(shTxt,px+18,py-22,{size:26,color:PHI,weight:700}));
 // 角 60°（法線から測る）
 if(arc60>0){const col=arc60Hi>0?PHI:C.ink;s+=fade(arc60,draw(arcDeg(cx,cy,58,0,NA),1,{color:col,w:3+3*arc60Hi})+label('60°',cx+U(NA/2,92)[0],cy+U(NA/2,92)[1]+10,{size:28,color:col,anchor:'middle',weight:700}));}
 // 面から測る角 30°（誤答 A の説明だけ）
 if(arc30>0)s+=fade(arc30,draw(arcDeg(cx,cy,118,EA,0),1,{color:CD,w:4})+label('30°',cx+U(EA/2,150)[0],cy+U(EA/2,150)[1]+10,{size:28,color:CD,anchor:'middle',weight:700}));
 if(mark>0){s+=fade(mark,label('✕',cx+U(EA/2,150)[0]+52,cy+U(EA/2,150)[1]+12,{size:32,color:CD,anchor:'middle',weight:700})
  +label('○',cx+U(NA/2,92)[0]+50,cy+U(NA/2,92)[1]-2,{size:32,color:C.F,anchor:'middle',weight:700}));}
 return fade(g,s);
}

// ===== 後半：横から見た輪（3 Ω の抵抗つき）と、上から近づく棒磁石（N 極が下）=====
function rig({cx=200,cy=340,rx=110,ry=26,u=.5,g=1,fieldG=1,res=1,moveG=0,mb0=200,mb1=cy-ry-22}={}){
 let s='';
 const mb=mix(mb0,mb1,clamp(u)),k=mix(.3,1,clamp(u));
 s+=draw(arcPts(cx,cy,rx,ry,0,180),1,{color:CI,w:4,opacity:.55});
 [-.72,-.36,0,.36,.72].forEach((d,i)=>{const on=(i===0||i===4)?seg(u,.35,.8):1;const x0=cx+d*30,x1=cx+d*rx*.95,y1=cy+ry+mix(30,70,u);
  s+=fade(fieldG*on*k,draw([[x0,mb+6],[mix(x0,x1,.6),cy-ry],[x1,y1]],1,{color:BC,w:3.5})+head(x1,y1,x1-mix(x0,x1,.6),y1-(cy-ry),{color:BC,L:14}));});
 // 手前の弧（下側）。抵抗は手前の真ん中に入れる
 if(res){s+=draw(arcPts(cx,cy,rx,ry,180,258),1,{color:CI,w:6})+draw(arcPts(cx,cy,rx,ry,282,360),1,{color:CI,w:6});
  const xa=cx+rx*Math.cos(258*RAD),xb=cx+rx*Math.cos(282*RAD),yz=cy+ry*.98,zz=[[xa,yz]];
  for(let i=1;i<8;i++)zz.push([mix(xa,xb,i/8),yz+(i%2?-9:9)]);zz.push([xb,yz]);
  s+=draw(zz,1,{color:SURF,w:4})+line(cx+14,cy+ry+8,cx+rx+4,cy+ry+22,{color:C.dim,w:1.5})+label('3 Ω',cx+rx+10,cy+ry+30,{size:26,color:SURF,weight:700});}
 else s+=draw(arcPts(cx,cy,rx,ry,180,360),1,{color:CI,w:6});
 // 磁石（下が N 赤、上が S 青）
 s+=rect(cx-28,mb-56,56,56,{fill:'#e05252',fo:.92,stroke:'#e05252',rx:4})+label('N',cx,mb-17,{size:28,color:C.bg,anchor:'middle',weight:700});
 s+=rect(cx-28,mb-112,56,56,{fill:'#4f7fe0',fo:.92,stroke:'#4f7fe0',rx:4})+label('S',cx,mb-73,{size:28,color:C.bg,anchor:'middle',weight:700});
 if(moveG>0)s+=fade(moveG,arrow(cx+50,mb-100,cx+50,mb-40,{color:C.ink,w:4,head:14})+label('近づける',cx+62,mb-64,{size:22,color:C.ink}));
 return fade(g,s);
}
// 真上から見た輪：⊗（元の磁場、増える）、赤い ⊙（誘導の磁場）、緑の電流（反時計回り）
const TPOS=[[0,0],[-48,-42],[48,-42],[-48,42],[48,42],[0,-70],[0,70],[-74,0],[74,0]];
function topView(cx,cy,R,{g=1,nIn=1,inG=1,ind=0,cur=0,curLab=0,inHi=0}={}){
 let s=ring(cx,cy,R,{color:CI,w:6});
 const n=Math.round(mix(3,TPOS.length,clamp(nIn)));
 TPOS.slice(0,n).forEach(([dx,dy],i)=>{if(ind>0&&i===0)return;s+=inSym(cx+dx*R/110,cy+dy*R/110,13,BC,inG);});
 if(inHi>0)s+=fade(inHi,ring(cx,cy,R-14,{color:PHI,w:3,dash:'8 6'}));
 if(ind>0)s+=fade(ind,outSym(cx,cy,28,IND)+label('誘導の 磁場',cx,cy-R-16,{size:22,color:IND,anchor:'middle',weight:700}));
 if(cur>0){let h='';for(const d of [45,135,225,315]){const t=d*RAD;h+=head(cx+R*Math.cos(t),cy-R*Math.sin(t),-Math.sin(t),-Math.cos(t),{color:CI,L:26});}s+=fade(cur,h);}
 if(curLab>0)s+=fade(curLab,LB('反時計回り',cx,cy+R+44,28,CI));
 return fade(g,s);
}
// 右手の絵（親指が手前 ⊙、4本の指が反時計回りに曲がる）
function hand(cx,cy,{g=1}={}){
 let s=LB('右手',cx,cy-118,26,C.ink);
 s+=outSym(cx,cy,26,IND)+LB('親指：⊙（手前）',cx,cy+120,24,IND);
 const A=arcDeg(cx,cy,78,-70,200);s+=draw(A,1,{color:CI,w:5})+head(A.at(-1)[0],A.at(-1)[1],A.at(-1)[0]-A.at(-2)[0],A.at(-1)[1]-A.at(-2)[1],{color:CI,L:22});
 s+=LB('指の 向き ＝ 電流（反時計回り）',cx,cy+160,24,CI);
 return fade(g,s);
}
// Φ–t のグラフ：t 0〜0.8 s、Φ 0〜0.5 Wb。0〜0.5 s で 0.1→0.4 の直線、そのあと（磁石が止まる）平ら
function phiGraph({x0=90,y0=450,w=420,h=310,g=1,prog=1,flat=0,tri=0,triLab=0,dot_=0}={}){
 const G=graph(x0,y0,w,h,{tmax:.8,fmin:0,fmax:.5,tt:[[.5,'0.5']],ft:[[.1,'0.1'],[.4,'0.4']],g});
 const {X,Y}=G;let s=G.s;
 s+=fade(g,line(x0,Y(.4),X(.5),Y(.4),{color:C.grid,w:1.5})+line(X(.5),Y(.4),X(.5),Y(0),{color:C.grid,w:1.5}));
 if(prog>0)s+=fade(g,draw([[X(0),Y(.1)],[X(.5*prog),Y(.1+.3*prog)]],1,{color:PHI,w:5}));
 if(flat>0)s+=fade(g,draw([[X(.5),Y(.4)],[X(.5+.3*flat),Y(.4)]],1,{color:PHI,w:5}));
 if(tri>0)s+=fade(tri,line(X(0),Y(.1),X(.5),Y(.1),{color:TC,w:4})+line(X(.5),Y(.1),X(.5),Y(.4),{color:PHI,w:4,dash:'2 0'}));
 if(triLab>0)s+=fade(triLab,label('0.5 s',X(.25),Y(.1)+32,{size:26,color:TC,anchor:'middle',weight:700})+label('0.4−0.1 ＝ 0.3 Wb',X(.5)+14,Y(.25)+8,{size:26,color:PHI,weight:700}));
 return {svg:s,X,Y};
}
// 電流計（目盛り 0〜0.3 A）
function meter(cx,cy,R,val,{g=1,txt=''}={}){
 const ang=v=>(150-120*clamp(v/.3))*RAD,P=(v,r)=>[cx+r*Math.cos(ang(v)),cy-r*Math.sin(ang(v))];
 let s=ring(cx,cy,R,{color:SURF,w:3,fill:'#172238'});
 for(const v of [0,.1,.2,.3]){const [a,b]=P(v,R-6),[c,d]=P(v,R-18);s+=line(a,b,c,d,{color:C.dim,w:2.5});}
 for(const [v,t] of [[0,'0'],[.3,'0.3']]){const [a,b]=P(v,R+22);s+=label(t,a,b+8,{size:22,color:C.dim,anchor:'middle'});}
 const [nx,ny]=P(val,R-12);s+=line(cx,cy+R*.25,nx,ny,{color:PHI,w:4})+dot(cx,cy+R*.25,6,PHI);
 s+=label('A',cx,cy+R*.25+34,{size:22,color:C.dim,anchor:'middle'});
 if(txt)s+=LB(txt,cx,cy+R+38,30,CI);
 return fade(g,s);
}
// 回路：左に輪（起電力 ℰ）、右に 3 Ω、上に電流計
function circuit(cx,cy,{g=1,val=0,txt='',w=380,h=230}={}){
 const xl=cx-w/2,xr=cx+w/2,yt=cy-h/2,yb=cy+h/2;
 let s=draw([[xl,cy-50],[xl,yt],[cx-62,yt]],1,{color:CI,w:4})+draw([[cx+62,yt],[xr,yt],[xr,cy-55]],1,{color:CI,w:4})+draw([[xr,cy+55],[xr,yb],[xl,yb],[xl,cy+50]],1,{color:CI,w:4});
 // 輪（縦に描いた楕円）
 s+=draw(arcPts(xl,cy,26,50,0,360,50),1,{color:CI,w:5})+label('輪',xl-40,cy-4,{size:26,color:CI,anchor:'end',weight:700})+T(cs(EMF,'\\mathcal{E}'),xl-52,cy+32,30);
 const zz=[[xr,cy-55]];for(let i=1;i<10;i++)zz.push([xr+(i%2?-14:14),cy-55+110*i/10]);zz.push([xr,cy+55]);
 s+=draw(zz,1,{color:SURF,w:4})+label('3 Ω',xr+28,cy+10,{size:28,color:SURF,weight:700});
 s+=meter(cx,yt,60,val,{txt:''});
 if(txt)s+=LB(txt,cx,yt+100,30,CI);
 return fade(g,s);
}

export const ytQxUiInductionDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（7秒）：0〜3 s 前半（磁場・面・法線・60°）、3〜7 s 後半（輪と 3 Ω、N 極が下りる、Φ–t の直線が伸びる）。最後は静止。
 [K+'q1']:(p)=>{
  let s=fade(seg(p,0,.06),label('前半',30,92,{size:28,color:C.ink,weight:700}))+line(585,90,585,500,{color:C.faint,w:2});
  s+=slab({cx:255,cy:300,x0:30,x1:560,LB_:150,fieldG:seg(p,0,.1),plate:seg(p,.1,.2),area:seg(p,.14,.24),nG:seg(p,.22,.32),arc60:seg(p,.32,.42),view:0});
  s+=fade(seg(p,.43,.5),label('後半',610,92,{size:28,color:C.ink,weight:700}));
  const u=seg(p,.5,.95);
  s+=rig({cx:700,cy:350,rx:88,ry:22,u,g:seg(p,.44,.52),mb0:205});
  s+=phiGraph({x0:930,y0:450,w:200,h:280,g:seg(p,.46,.54),prog:u}).svg;
  return s;
 },

 // ===================== 小問1 =====================
 // 1. 前半の図（磁場、斜めの面、法線、60°）。右の枠に与えた量
 [K+'goal1']:(p)=>{
  let s=slab({});
  s+=panel(90,300,LN('前半',PC,135,24)+LB('磁場 0.5 T（一様）',PC,195,28,BC)+LB('面積 0.6 m²',PC,255,28,SURF)+LB('法線と 磁場の 角 60°',PC,315,28,NC)
   +fade(seg(p,.4,.5),line(PX+40,345,PX+PW-40,345,{color:C.faint,w:2})+LB('面を 貫く 磁束 は？',PC,375,28,PHI)),seg(p,.03,.15));
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 2. 先に図で影（B⊥）、面の札を A＝0.6 m² に。そのあと「定義」と Φ＝B⊥A
 [K+'def']:(p,ctx)=>{
  const b=atWord(ctx,'じばの かげ',.55);
  let s=slab({bMain:seg(p,.05,.15),sh:seg(p,b,b+.12),shLab:seg(p,b+.08,b+.16),areaTxt:'A ＝ 0.6 m²',arc60:.5});
  s+=panel(90,330,LN('磁束 ＝ 垂直に 貫く 成分 × 面積',PC,140,24,C.ink)
   +fade(seg(p,b+.12,b+.2),LB('影 ＝ 法線方向の 成分',PC,205,26,PHI))
   +fade(seg(p,b+.2,b+.3),kindTag('定義',PC,280)+T(`${cs(PHI,'\\Phi')}=${cs(PHI,'B_{\\perp}')}A`,PC,360,48)),seg(p,.02,.12));
  s+=goalTag(G1);
  return s;
 },
 // 3. 影に「0.5×cos60°＝0.25 T」、下に「0.25×0.6＝0.15 Wb」。60° の弧を黄で光らせ「法線から測る」
 [K+'calc']:(p,ctx)=>{
  const b=atWord(ctx,'れいてんにご かける',.55);
  let s=slab({bMain:1,sh:1,shLab:1,areaTxt:'A ＝ 0.6 m²',arc60:1,arc60Hi:seg(p,.05,.15)});
  s+=fade(seg(p,.08,.18),label('法線から 測る',280,190,{size:24,color:PHI,weight:700,anchor:'end'}));
  s+=panel(90,330,LN('影の 長さ',PC,140,24)+T(`0.5\\times\\cos 60^\\circ=${cs(PHI,'0.25\\ \\mathrm{T}')}`,PC,205,38,{opacity:1})
   +fade(seg(p,b,b+.1),line(PX+40,255,PX+PW-40,255,{color:C.faint,w:2})+LN('× 面積',PC,300,24)+T(`0.25\\times0.6=${cs(PHI,'0.15\\ \\mathrm{Wb}')}`,PC,370,40)),seg(p,.02,.12),PHI);
  s+=goalTag(G1);
  return s;
 },
 // 4. 小問1 の答え D
 [K+'ans1']:(p)=>{
  let s=slab({bMain:1,sh:1,shLab:1,areaTxt:'A ＝ 0.6 m²',arc60:1,arc60Hi:1});
  s+=panel(90,250,LN('前半の 面を 貫く 磁束',PC,140,24)+T(`${cs(PHI,'\\Phi')}=0.5\\times\\cos60^\\circ\\times0.6`,PC,215,32)+T(`=${cs(PHI,'0.15\\ \\mathrm{Wb}')}`,PC,290,40),1,PHI);
  s+=goalTag(G1)+ANS1(seg(p,.03,.12));
  return s;
 },
 // 5. 面から測る角 30° に ✕、法線から測る角 60° に ○。誤答 A → B を1枚ずつ
 [K+'wrongAB']:(p,ctx)=>{
  const W=wins(ctx,['ビーの']);
  let s=slab({bMain:1,arc60:1,arc30:seg(p,.03,.12),mark:seg(p,.1,.18),areaTxt:'A ＝ 0.6 m²'});
  s+=panel(90,150,LN('磁束',PC,130,24)+T(`${cs(PHI,'\\Phi')}=B\\cos60^\\circ\\times A`,PC,195,34),1);
  s+=wrongSeq(p,ctx,[['A','0.26 Wb','角を 面から 測った（sin60° を 掛けた）'],['B','0.3 Wb','cos60° を 掛けていない']],{win:W,opts:{...WOPT,y:265}});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },
 // 6. 60°（90° より小さい）の弧：法線と磁場は同じ側。誤答 C
 [K+'wrongC']:(p)=>{
  let s=slab({bMain:1,arc60:1,arc60Hi:seg(p,.1,.2),areaTxt:'A ＝ 0.6 m²',nG:1});
  s+=fade(seg(p,.12,.22),label('60° ＜ 90°',60,350,{size:28,color:PHI,weight:700}));
  s+=panel(90,150,LB('法線と 同じ側 → Φ ＞ 0',PC,175,28,PHI),seg(p,.15,.25),PHI);
  s+=wrongCard('C','−0.15 Wb','法線と 同じ側を 向くので 正',{...WOPT,y:265,g:seg(p,.3,.36)});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },

 // ===================== 小問2 =====================
 // 7. 横から見た磁石と輪（磁石は下りてくる）。右の枠に後半の与えた量
 [K+'goal2']:(p,ctx)=>{
  const u=.1+.75*clamp(tAt(ctx,K+'goal2')/40);
  let s=label('横から 見た図',190,495,{size:24,color:C.dim,anchor:'middle'});
  s+=rig({cx:190,u,moveG:1});
  s+=panel(90,300,LN('後半',PC,135,24)+LB('N 極を 上から 近づける',PC,195,28,C.ink)+LB('下向きの 磁束',PC,255,28,PHI)+LB('0.1 → 0.4 Wb（0.5 s）',PC,300,28,PHI)+LB('輪に 3 Ω の 抵抗',PC,360,28,SURF),seg(p,.03,.15));
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 8. 横の図の横に、真上から見た図。⊗ が増えていく。札「⊗ の磁束が増加」
 [K+'top']:(p,ctx)=>{
  const u=.1+.75*clamp(tAt(ctx,K+'goal2')/40),b=atWord(ctx,'その',.55);
  let s=label('横から 見た図',190,495,{size:24,color:C.dim,anchor:'middle'})+fade(seg(p,.02,.12),label('真上から 見た図',520,495,{size:24,color:C.dim,anchor:'middle'}));
  s+=rig({cx:190,u,moveG:1});
  s+=topView(520,300,100,{g:seg(p,.03,.15),nIn:u});
  s+=panel(90,260,LN('真上から 見ると',PC,140,24)+LB('下向き ＝ 奥向き（⊗）',PC,200,28,BC)
   +fade(seg(p,b,b+.1),rect(PX+90,240,PW-180,56,{fill:PHI,fo:.12,stroke:PHI,sw:2.5,rx:10})+LB('⊗ の 磁束が 増加',PC,278,28,PHI)),seg(p,.03,.15));
  s+=goalTag(G2);
  return s;
 },
 // 9. 「法則」レンツの法則。輪の中に赤の ⊙。「変化を」で「増加」の札を黄で光らせる
 [K+'lenz']:(p,ctx)=>{
  const u=.1+.75*clamp(tAt(ctx,K+'goal2')/40),bc=atWord(ctx,'へんかを',.3),bi=atWord(ctx,'わの なかに',.6);
  const glow=seg(p,bc,bc+.05)*(1-seg(p,bc+.22,bc+.3));
  let s=label('横から 見た図',190,495,{size:24,color:C.dim,anchor:'middle'})+label('真上から 見た図',520,495,{size:24,color:C.dim,anchor:'middle'});
  s+=rig({cx:190,u,moveG:1});
  s+=topView(520,300,100,{nIn:u,ind:seg(p,bi,bi+.1)});
  s+=panel(90,330,kindTag('法則',PC,135,{text:'レンツの法則：変化を妨げる向き'})
   +rect(PX+90,180,PW-180,56,{fill:PHI,fo:.12+.3*glow,stroke:PHI,sw:2.5+3*glow,rx:10})+LB('⊗ の 磁束が 増加',PC,218,28,PHI)
   +fade(seg(p,bi,bi+.1),label('↓ 妨げる',PC,282,{size:26,color:C.dim,anchor:'middle'})+LB('輪の 中に ⊙（手前向き）',PC,340,28,IND)),1);
  s+=goalTag(G2);
  return s;
 },
 // 10. 右手（親指が手前）と、反時計回りの緑の電流。答えの札「小問2 の答え：B（反時計回り）」
 [K+'ans2']:(p,ctx)=>{
  const u=.1+.75*clamp(tAt(ctx,K+'goal2')/40),ba=atWord(ctx,'しょうもん',.7);
  let s=label('横から 見た図',190,495,{size:24,color:C.dim,anchor:'middle'})+label('真上から 見た図',520,495,{size:24,color:C.dim,anchor:'middle'});
  s+=rig({cx:190,u,moveG:1});
  s+=topView(520,300,100,{nIn:u,ind:1,cur:seg(p,.25,.4),curLab:seg(p,.35,.45)});
  s+=panel(90,400,hand(PC,280,{g:seg(p,.05,.2)}),1);
  s+=goalTag(G2)+ANS2(seg(p,ba,ba+.08));
  return s;
 },
 // 11. 誤答 A → D（1枚ずつ）
 [K+'wrongAD']:(p,ctx)=>{
  const u=.1+.75*clamp(tAt(ctx,K+'goal2')/40),W=wins(ctx,['ディーは']);
  let s=label('横から 見た図',190,495,{size:24,color:C.dim,anchor:'middle'})+label('真上から 見た図',520,495,{size:24,color:C.dim,anchor:'middle'});
  s+=rig({cx:190,u,moveG:1});
  s+=topView(520,300,100,{nIn:u,ind:1,cur:1,curLab:1});
  s+=panel(90,150,LB('⊗ 増加 → 誘導 ⊙',PC,145,28,IND)+LB('→ 反時計回り',PC,195,28,CI),1);
  s+=wrongSeq(p,ctx,[['A','時計回り','誘導の 磁場を 元と 同じ ⊗ に した'],['D','止まってから 流れる','流れるのは 磁束が 変わっている 間だけ']],{win:W,opts:{...WOPT,y:265}});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },
 // 12. 誤答 C（向きは決まらない）。「量」と「変化率」
 [K+'wrongC2']:(p,ctx)=>{
  const u=.1+.75*clamp(tAt(ctx,K+'goal2')/40),b=atWord(ctx,'きめるのは',.5);
  let s=label('横から 見た図',190,495,{size:24,color:C.dim,anchor:'middle'})+label('真上から 見た図',520,495,{size:24,color:C.dim,anchor:'middle'});
  s+=rig({cx:190,u,moveG:1});
  s+=topView(520,300,100,{nIn:u,ind:1,cur:1,curLab:1});
  s+=panel(90,150,LB('量（磁束の 大きさ）',PC,140,26,C.dim)+fade(seg(p,b,b+.08),LB('効くのは 変化率',PC,195,28,PHI)),1,C.faint);
  s+=wrongCard('C','向きは 決まらない','効くのは 変化率。向きは レンツの 法則',{...WOPT,y:265,g:seg(p,.03,.1)});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },

 // ===================== 小問3 =====================
 // 13. Φ–t のグラフと、3 Ω の回路
 [K+'goal3']:(p)=>{
  let s=phiGraph({g:seg(p,.03,.15)}).svg;
  s+=circuit(930,320,{g:seg(p,.1,.25)});
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 14. 「法則」ℰ の大きさ＝磁束の変化率。グラフに傾きの三角形
 [K+'slope']:(p,ctx)=>{
  const b=atWord(ctx,'ファイ',.5);
  let s=phiGraph({tri:seg(p,b,b+.12)}).svg;
  s+=panel(110,280,kindTag('法則',PC,170,{text:'ℰ の大きさ＝磁束の変化率'})
   +fade(seg(p,b,b+.1),LB('Φ–t グラフの 傾き',PC,270,30,PHI)),seg(p,.03,.15));
  s+=goalTag(G3);
  return s;
 },
 // 15. 三角形の縦 0.3 Wb・横 0.5 s（①図）→ 図を消して式を一段ずつ（②）：0.6 Wb/s、単位の変形、ℰ＝0.6 V
 [K+'emf']:(p,ctx)=>{
  const b=atWord(ctx,'れいてんさん わる',.4),cA=1-seg(p,b-.03,b+.02),cB=seg(p,b,b+.06);
  let s=fade(cA,phiGraph({tri:1,triLab:seg(p,.03,.15)}).svg+panel(110,200,LN('0.5 秒で',PC,170,26)+LB('0.3 Wb 増えた',PC,230,30,PHI),seg(p,.05,.15)));
  const r1=seg(p,b+.02,b+.1),r2=seg(p,b+.2,b+.3),r3=seg(p,atWord(ctx,'きでんりょくは',.8),atWord(ctx,'きでんりょくは',.8)+.08);
  let e=fade(r1,T(`\\dfrac{${cs(PHI,'0.3\\ \\mathrm{Wb}')}}{${cs(TC,'0.5\\ \\mathrm{s}')}}=0.6\\ \\mathrm{Wb/s}`,600,170,46));
  e+=fade(r2,LN('単位',300,282,24)+T(`\\mathrm{Wb/s}=\\mathrm{T\\cdot m^2/s}\\ \\to\\ \\mathrm{J/C}=\\mathrm{V}`,640,272,36));
  e+=fade(r3,T(`${cs(EMF,'\\mathcal{E}')}=${cs(EMF,'0.6\\ \\mathrm{V}')}`,600,390,52));
  s+=fade(cB,e);
  s+=goalTag(G3);
  return s;
 },
 // 16. 電流計の針が 0.2 A。I＝ℰ/R＝0.6÷3＝0.2 A。答えの札「小問3 の答え：A（0.2 A）」
 [K+'ans3']:(p,ctx)=>{
  const ba=atWord(ctx,'しょうもん',.75),bm=atWord(ctx,'れいてんに アンペア',.6);
  let s=circuit(330,320,{val:.2*seg(p,bm-.1,bm),txt:seg(p,bm,bm+.02)>0?'0.2 A':''});
  s+=label('電流計',330,128,{size:22,color:C.dim,anchor:'middle'});
  s+=panel(110,280,LN('回路は 閉じている',PC,165,24)+T(`${cs(CI,'I')}=\\dfrac{${cs(EMF,'\\mathcal{E}')}}{R}=\\dfrac{0.6}{3}`,PC,250,42)+fade(seg(p,bm-.05,bm+.03),T(`=${cs(CI,'0.2\\ \\mathrm{A}')}`,PC,345,46)),seg(p,.03,.12),CI);
  s+=goalTag(G3)+ANS3(seg(p,ba,ba+.08));
  return s;
 },
 // 17. 誤答 B → C → D（1枚ずつ）
 [K+'wrong3']:(p,ctx)=>{
  const W=wins(ctx,['スィーは','ディーは']);
  let s=circuit(330,320,{val:.2,txt:'0.2 A'});
  s+=panel(90,150,LN('正しくは',PC,125,24)+T(`${cs(EMF,'\\mathcal{E}')}=\\dfrac{0.3}{0.5}=0.6\\ \\mathrm{V},\\ \\ ${cs(CI,'I')}=\\dfrac{0.6}{3}`,PC,190,30),1);
  s+=wrongSeq(p,ctx,[['B','0.13 A','0.4 Wb÷3 Ω（変化でなく 値。単位 C）'],['C','0.27 A','最後の 0.4 Wb を 時間で 割った'],['D','1.8 A','0.6×3 と 掛けた（単位 V·Ω）']],{win:W,opts:{...WOPT,y:265}});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },

 // ===================== まとめ =====================
 // 18. 磁石が止まり、グラフが平らになり、電流計の針が 0 に戻る。答えの札3枚
 [K+'sum']:(p)=>{
  const u=mix(.75,1,seg(p,0,.2)),fl=seg(p,.2,.45),back=seg(p,.22,.4);
  let s=label('横から 見た図',150,495,{size:24,color:C.dim,anchor:'middle'});
  s+=rig({cx:150,rx:95,ry:24,u,mb0:200});
  s+=fade(seg(p,0,.15)*(1-seg(p,.15,.22)),label('近づける',210,220,{size:22,color:C.ink}));
  s+=fade(seg(p,.22,.3),label('止める',210,220,{size:26,color:C.ink,weight:700}));
  s+=phiGraph({x0:420,y0:440,w:380,h:290,flat:fl}).svg;
  s+=meter(1000,280,80,.2*(1-back),{txt:back>.95?'0 A':''});
  s+=label('電流計',1000,165,{size:22,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.45,.55),LB('傾き 0 → 電流 0',1000,470,28,PHI));
  s+=answerRow([[1,'D','0.15 Wb'],[2,'B','反時計回り'],[3,'A','0.2 A']],{g:seg(p,.6,.72)});
  return s;
 },
};

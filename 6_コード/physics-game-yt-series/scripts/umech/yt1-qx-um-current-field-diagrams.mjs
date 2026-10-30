// 問題編 解説「時計回りにたどる輪と、25 A の導線」（q-um-current-field、大学編 26 アンペールの法則・中級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/26_アンペールの法則.md の q-um-current-field（解説 21 行）。
// 色（中級の単元動画 yt1-um-current-field-1/2 と同じ）：𝐁 橙、電流 I 緑、一歩 d𝐫 金、膜 水色、r・距離 白、正の符号 黄、負 赤、強調 黄。
// 斜めから見た図：画面の中の輪を、上から斜めに見下ろす（輪は楕円、導線は縦の線）。⊙ は上向き、⊗ は下向きの矢印。
//   面の座標 (u,w)：u 右、w 奥。上から見て反時計回り＝角 t が増える向き。時計回りにたどる＝手前の辺が左へ進む。
// 記号・円の矢じりは 中級の単元動画（yt1-um-current-field-1-diagrams.mjs）の部品を import して使う（あちらは編集しない）。
// 札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth} from './anim.mjs';
import {CB,CI,DC,AL,NG,CR,cs,outSym,inSym,head,circ} from './yt1-um-current-field-1-diagrams.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,note,textW,sentWin,cueT,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-um-current-field:';
const RAD=Math.PI/180,MEM=C.x,BAD='#ff6b6b';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const vB=cs(CB,'\\mathbf{B}'),dr=cs(DC,'d\\mathbf{r}'),Ic=cs(CI,'I'),Bs=cs(CB,'B');
const LAW=`\\oint ${vB}\\cdot${dr}=\\mu_0${Ic}`;
// 「求めるもの：一周の和 ∮𝐁·d𝐫」：∮ の字が小さく出るので、式の部分は TeX で重ねて描く（札の枠は goalTag のまま）
const G1T=`\\oint ${vB}\\cdot${dr}`;
const goal1=(o={})=>goalTag('一周の和　　　　　',o)+fade(o.g??1,T(G1T,10+16+textW('求めるもの：一周の和 ',26)+texWidth(G1T,28,false)/2,8+28+9,28));
const G1='一周の和',G2='磁場の強さ B',G3='B を外へ出せた理由';
const A1=g=>answerTag(1,'C','5.0×10⁻⁶ T·m',{g}),A2=g=>answerTag(2,'B','1.0×10⁻⁴ T',{g}),A3=g=>answerTag(3,'C','',{g});

// ===================== 斜めから見た輪（前半）=====================
const OB={cx:290,cy:300,rx:200,ry:80};
const kk=OB.ry/OB.rx;
const P=(u,w)=>[OB.cx+u,OB.cy-w*kk];
const loopPt=t=>P(OB.rx*Math.cos(t),OB.rx*Math.sin(t));
// 導線：u,w（面の上の位置）、kind out＝⊙（上向き）、in＝⊗（下向き）
const WIRES=[{u:-90,w:25,kind:'in',I:'7 A',sym:'⊗'},{u:70,w:-40,kind:'out',I:'3 A',sym:'⊙'},{u:250,w:10,kind:'in',I:'5 A',sym:'⊗'}];
const TOPY=118,BOTY=478;
function wireBack(q,g=1){const [x,y]=P(q.u,q.w);return fade(g,line(x,y,x,BOTY,{color:CI,w:6,opacity:.45}));}
function wireFront(q,{g=1,lab=1,anchor}={}){
 const [x,y]=P(q.u,q.w),a=anchor??'start';
 let s=line(x,TOPY,x,y,{color:CI,w:6})+dot(x,y,5,CI);
 s+=q.kind==='in'?arrow(x,TOPY+40,x,TOPY+140,{color:CI,w:6,head:20}):arrow(x,TOPY+140,x,TOPY+40,{color:CI,w:6,head:20});
 if(lab)s+=label(`${q.I} ${q.sym}`,x+(a==='end'?-14:14),TOPY+22,{size:28,color:CI,anchor:a,weight:700});
 return fade(g,s);
}
function loopOb({g=1,membrane=1,heads=1,col=C.ink,w=4,colorSign=0,edge=0}={}){
 const n=120,pts=Array.from({length:n+1},(_,i)=>loopPt(2*Math.PI*i/n));
 let s='';
 if(membrane)s+=fade(membrane,`<ellipse cx="${OB.cx}" cy="${OB.cy}" rx="${OB.rx}" ry="${OB.ry}" fill="${MEM}" fill-opacity=".16" stroke="none"/>`);
 s+=draw(pts,1,{color:col,w});
 if(edge>0)s+=fade(edge,`<ellipse cx="${OB.cx}" cy="${OB.cy}" rx="${OB.rx}" ry="${OB.ry}" fill="none" stroke="${C.hi}" stroke-width="8" opacity=".6"/>`);
 if(colorSign>0){
  // 外の 5 A（⊗）が輪の上に作る 𝐁 と、時計回りの一歩 d𝐫 の内積の符号で塗り分ける
  const o=WIRES[2];const m=90;
  for(let k=0;k<m;k++){const t0=2*Math.PI*k/m,t1=2*Math.PI*(k+1)/m,tm=(t0+t1)/2;
   const dx=OB.rx*Math.cos(tm)-o.u,dy=OB.rx*Math.sin(tm)-o.w,d=dy*Math.sin(tm)+dx*Math.cos(tm);
   const [a,b]=[loopPt(t0),loopPt(t1)];s+=fade(colorSign,line(a[0],a[1],b[0],b[1],{color:d>=0?AL:NG,w:10,cap:'butt'}));}
 }
 // 時計回り（上から見て）：t が減る向きの矢じり
 if(heads)for(const t of [-90,90,0,180].map(d=>d*RAD)){const [x,y]=loopPt(t),[x2,y2]=loopPt(t-.05);s+=head(x2,y2,x2-x,y2-y,{color:col,L:20});}
 return fade(g,s);
}
// 輪・膜・3本の導線（後ろ → 膜 → 前）
function obScene({g=1,membrane=1,heads=1,sign=0,count5=0,edge=0,colorSign=0,wireG=[1,1,1],lab=1,noteG=1}={}){
 let s=WIRES.map((q,i)=>wireBack(q,wireG[i])).join('');
 s+=loopOb({membrane,heads,edge,colorSign});
 s+=WIRES.map((q,i)=>wireFront(q,{g:wireG[i],lab})).join('');
 if(sign>0){const [x1]=P(WIRES[0].u,0),[x2]=P(WIRES[1].u,0);
  s+=fade(sign,label('＋7',x1-14,TOPY+80,{size:34,color:AL,anchor:'end',weight:700})+label('−3',x2+14,TOPY+80,{size:34,color:NG,weight:700}));}
 if(count5>0){const [x]=P(WIRES[2].u,0);s+=fade(count5,rect(x+14,TOPY+52,136,46,{fill:C.dim,fo:.15,stroke:C.dim,sw:2,rx:12})+label('数えない',x+82,TOPY+84,{size:26,color:C.dim,anchor:'middle',weight:700}));}
 s+=note('斜めから 見た 図：⊙ は 上向き、⊗ は 下向き',OB.cx,505,{g:noteG});
 return fade(g,s);
}
// 輪の上の一点の一歩 d𝐫（金）と、そこの 𝐁（橙）
function stepB(g=1,{lab=1}={}){
 const t=-55*RAD,[x,y]=loopPt(t),[x2,y2]=loopPt(t-.28);
 let s=arrow(x,y,x2,y2,{color:DC,w:6,head:16});
 s+=arrow(x,y,x+70,y+18,{color:CB,w:5,head:16})+T(vB,x+86,y+40,30);
 if(lab)s+=label('d𝐫＝たどる向きの一歩',x2-6,y2+44,{size:24,color:DC,anchor:'middle',weight:700});
 return fade(g,s);
}
// 右手（単元動画 ui-current-field-1 の hand を写し、180° 回して親指を下に向ける）
function ellArc(cx,cy,rx,ry,a0,a1,n=40){return Array.from({length:n+1},(_,i)=>{const a=(a0+(a1-a0)*i/n)*RAD;return [cx+rx*Math.cos(a),cy+ry*Math.sin(a)];});}
function handDown(hx,hy,g=1){
 const skin='#e2b48f',edge='#8a5a3c',dy=hy-290;
 let s=rect(hx-92,212+dy,70,150,{fill:skin,fo:1,stroke:edge,sw:2.5,rx:26});
 for(let i=0;i<4;i++){const y=236+i*32+dy;
  s+=draw(ellArc(hx,y,62,17,160,20,30),1,{color:edge,w:27})+draw(ellArc(hx,y,62,17,160,20,30),1,{color:skin,w:22});
  const [tx,ty]=ellArc(hx,y,62,17,20,20,1)[0];s+=dot(tx,ty,11,skin);}
 s+=draw([[hx-40,228+dy],[hx-22,170+dy],[hx-14,138+dy]],1,{color:edge,w:30})+draw([[hx-40,228+dy],[hx-22,170+dy],[hx-14,138+dy]],1,{color:skin,w:25});
 return fade(g,`<g transform="rotate(180 ${hx} ${hy})">${s}</g>`);
}

// ===================== 上から見た直線電流（後半）=====================
const TW={x:300,y:290},RP=160;   // 0.05 m → 160 px（画面の都合）
function topWire({g=1,sym=0,lab=1}={}){
 let s=sym>0?fade(sym,outSym(TW.x,TW.y,20,CI)):'';
 s+=fade(1-sym,dot(TW.x,TW.y,18,CI));
 if(lab)s+=label('25 A',TW.x-28,TW.y-30,{size:28,color:CI,anchor:'end',weight:700});
 return fade(g,s);
}
function pointR({g=1,lab=1,ang=0}={}){
 const x=TW.x+RP*Math.cos(ang*RAD),y=TW.y-RP*Math.sin(ang*RAD);
 return fade(g,line(TW.x+20*Math.cos(ang*RAD),TW.y-20*Math.sin(ang*RAD),x,y,{color:CR,w:3,dash:'10 7'})+dot(x,y,8,CR)+(lab?label('0.05 m',(TW.x+x)/2+10,(TW.y+y)/2+36,{size:26,color:CR,anchor:'middle',weight:700}):''));
}
function circR({g=1,lab2pi=0}={}){
 let s=ring(TW.x,TW.y,RP,{color:CR,w:3,dash:'10 8'});
 if(lab2pi>0)s+=fade(lab2pi,label('円周 2πr',TW.x-RP*.72-12,TW.y-RP*.72-14,{size:28,color:CR,anchor:'end',weight:700}));
 return fade(g,s);
}
// 円の上の 𝐁（⊙ の電流 → 反時計回り）。n 本を等間隔、len の長さ
function bTangents({g=1,n=8,len=70,phase=22.5,rot=0,glow=0}={}){
 let s='';
 for(let i=0;i<n;i++){const a=(phase+rot+360*i/n)*RAD,x=TW.x+RP*Math.cos(a),y=TW.y-RP*Math.sin(a),tx=-Math.sin(a),ty=-Math.cos(a);
  s+=arrow(x-tx*len/2,y-ty*len/2,x+tx*len/2,y+ty*len/2,{color:CB,w:5+2*glow,head:16});}
 return fade(g,s);
}
const dirNote=(g=1)=>note('電流を 手前向き（⊙）として 描いています',TW.x,505,{g});

// 右の枠
const PX=650,PW=530,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WR={x:PX,w:PW,size:26,whySize:22};

// 1/r と 1/r² のグラフ（自前の軸：数字は出さない、文字は 24px）
function graph(x0,y0,w,h,fn,{color=CB,g=1,title='',lab=''}={}){
 let s=arrow(x0,y0,x0+w,y0,{color:C.dim,w:2.5,head:12})+arrow(x0,y0,x0,y0-h,{color:C.dim,w:2.5,head:12});
 s+=label('r',x0+w+12,y0+8,{size:26,color:C.ink});
 const pts=[];for(let i=0;i<=160;i++){const r=.1+3.9*i/160,v=(h-20)*fn(r)/4;if(v<=h-14)pts.push([x0+(w-20)*r/4,y0-v]);}
 s+=draw(pts,1,{color,w:5});
 if(title)s+=label(title,x0+w/2,y0-h-14,{size:26,color:C.ink,anchor:'middle',weight:700});
 if(lab)s+=T(lab,x0+w*.6,y0-h*.45,44,{color});
 return fade(g,s);
}

export const ytQxUmCurrentFieldDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（約6秒）：0〜4 s 前半（斜めから見た輪と膜、たどる矢印が時計回りに一周、3本の導線と札）、4〜6 s 後半（上から見た導線 25 A と 0.05 m の点）。静止。
 //   右手・＋−の符号・円の道・磁場の矢印は出さない。
 [K+'q0']:(p)=>{
  const gA=seg(p,0,.12),gW=seg(p,.12,.28),gB=seg(p,.66,.78);
  let s=fade(gA,label('前半',OB.cx,100,{size:26,color:C.dim,anchor:'middle',weight:700}));
  s+=fade(gA,obScene({heads:1,wireG:[gW,gW,gW],noteG:gW}));
  const u=seg(p,.3,.62);
  if(u>0&&u<1){const t=-90*RAD-2*Math.PI*u,[x,y]=loopPt(t),[x2,y2]=loopPt(t-.06);s+=head(x2,y2,x2-x,y2-y,{color:C.hi,L:30});}
  // 後半：上から見た導線と点（画面の右）
  const cx=960,cy=300;
  s+=fade(gB,label('後半（上から 見た 図）',cx,100,{size:26,color:C.dim,anchor:'middle',weight:700})
   +dot(cx-90,cy,18,CI)+label('25 A',cx-118,cy-30,{size:28,color:CI,anchor:'end',weight:700})
   +line(cx-70,cy,cx+70,cy,{color:CR,w:3,dash:'10 7'})+dot(cx+70,cy,8,CR)+label('0.05 m',cx-10,cy+40,{size:26,color:CR,anchor:'middle',weight:700}));
  return s;
 },

 // ===================== 小問1 =====================
 // 1. 斜めから見た輪と膜、3本の導線
 [K+'goal1']:(p)=>obScene({g:seg(p,.03,.15)})+goal1({g:seg(p,.03,.12)}),
 // 2. 先に図の上に記号（d𝐫・𝐁）→「法則」タグと ∮𝐁·d𝐫＝μ₀I。I を黄で光らせ、矢印で膜を指す
 [K+'law']:(p)=>{
  let s=obScene()+stepB(seg(p,.05,.2));
  const gL=seg(p,.28,.4),gI=seg(p,.55,.65);
  const w=texWidth(LAW,46,false),x0=PC-w/2,wI=texWidth(Ic,46,false);
  const LAWI=`\\oint ${vB}\\cdot${dr}=\\mu_0{\\color{${C.hi}}I}`;
  s+=panel(95,230,kindTag('法則',PC,140,{g:gL})+fade(gL*(1-gI),T(LAW,PC,215,46))+fade(gI,T(LAWI,PC,215,46))
   +fade(gI,label('↑',x0+w-wI/2,268,{size:26,color:C.hi,anchor:'middle',weight:700})+label('膜を 貫く 電流の 和',PC,302,{size:26,color:C.hi,anchor:'middle',weight:700})),gL);
  s+=fade(gI,arrow(PX-10,270,OB.cx+40,OB.cy+10,{color:C.hi,w:4,head:16}));
  s+=goal1();
  return s;
 },
 // 3. 「約束」：右手の4本の指がたどる向き（時計回り）に曲がり、親指が奥（⊗＝下向き）。札「⊗＝＋」
 [K+'hand']:(p)=>{
  let s=obScene();
  const hx=1010,hy=270,g=seg(p,.05,.2);
  let h=`<ellipse cx="${hx}" cy="${hy+5}" rx="125" ry="44" fill="none" stroke="${C.ink}" stroke-width="3.5" stroke-dasharray="9 7"/>`
   +head(hx-14,hy+49,-1,0,{color:C.ink,L:20})+fade(.75,head(hx+14,hy-39,1,0,{color:C.ink,L:18}));
  h+=handDown(hx,hy)+arrow(hx+2,hy+120,hx+2,hy+190,{color:CI,w:6,head:18});
  s+=panel(95,400,kindTag('約束',PX+70,135,{color:C.ink})+fade(seg(p,.15,.3),label('指 ＝ たどる 向き（時計回り）',PX+PW-20,140,{size:24,color:C.ink,anchor:'end',weight:700}))+h
   +fade(seg(p,.45,.55),label('親指 ＝ 下',PX+24,300,{size:26,color:CI,weight:700})+label('（⊗ の 向き）',PX+24,340,{size:26,color:CI,weight:700})),g);
  s+=fade(seg(p,.7,.8),rect(PX+24,400,130,56,{fill:AL,fo:.14,stroke:AL,sw:3,rx:12})+label('⊗＝＋',PX+89,438,{size:30,color:AL,anchor:'middle',weight:700}));
  s+=goal1();
  return s;
 },
 // 4. 7 A に「＋7」（黄）、3 A に「−3」（赤）。5 A は膜の外：膜の縁を光らせ「数えない」（灰）
 [K+'signs']:(p,ctx)=>{
  const ve=voiceEnd(ctx);
  let s=obScene({sign:seg(p,.05,.3),edge:seg(p,ve*.6,ve*.66)*(1-seg(p,ve*.9,ve*.98)*.5),count5:seg(p,ve*.75,ve*.85)});
  s+=goal1();
  return s;
 },
 // 5. 計算を一行ずつ（図を消して式だけ）
 [K+'calc1']:(p)=>{
  let s=card(180,95,840,390,'',1);
  s+=fade(seg(p,.03,.15),T(`${Ic}=7-3=4\\ \\mathrm{A}`,600,170,46));
  s+=fade(seg(p,.3,.42),T(`\\mu_0${Ic}=4\\pi\\times10^{-7}\\times4`,600,280,46));
  s+=fade(seg(p,.6,.72),T(`\\approx5.0\\times10^{-6}\\ \\mathrm{T\\cdot m}`,600,395,46,{color:C.hi}));
  s+=goal1();
  return s;
 },
 // 6. 小問1 の答え C
 [K+'ans1']:(p)=>{
  let s=card(180,95,840,390,T(`${Ic}=7-3=4\\ \\mathrm{A}`,600,170,46)+T(`\\mu_0${Ic}=4\\pi\\times10^{-7}\\times4`,600,280,46)+T(`\\approx5.0\\times10^{-6}\\ \\mathrm{T\\cdot m}`,600,395,46,{color:C.hi}),1);
  s+=goal1()+A1(seg(p,.03,.12));
  return s;
 },
 // 7. 誤答 A → 誤答 D（図に戻る。符号の付いた導線）
 [K+'wrong1AD']:(p,ctx)=>{
  let s=obScene({sign:1,lab:1});
  s+=wrongSeq(p,ctx,[['A','−5.0×10⁻⁶ T·m','反時計回りの約束（⊙ が正）を使った'],['D','1.3×10⁻⁵ T·m','向きを無視して 7＋3＝10 A']],{opts:{...WR,y:150}});
  s+=goal1()+A1(1);
  return s;
 },
 // 8. 外の 5 A が輪の上に作る 𝐁·d𝐫 を、正の所（黄）と負の所（赤）で塗り分ける。誤答 B
 [K+'wrong1B']:(p,ctx)=>{
  const ve=voiceEnd(ctx),gC=seg(p,ve*.5,ve*.62);
  let s=obScene({colorSign:gC,wireG:[.35,.35,1],sign:0});
  s+=fade(gC,label('𝐁·d𝐫 ＞ 0',PX+20,350,{size:26,color:AL,weight:700})+label('𝐁·d𝐫 ＜ 0',PX+20,392,{size:26,color:NG,weight:700})
   +label('（外の 5 A の 𝐁）',PX+200,371,{size:22,color:C.dim}));
  s+=fade(seg(p,ve*.8,ve*.9),label('一周 足すと 0',PX+20,440,{size:28,color:C.ink,weight:700}));
  s+=wrongCard('B','1.1×10⁻⁵ T·m','輪の外の 5 A も数えた（9 A）',{...WR,y:150,g:seg(p,.03,.1)});
  s+=goal1()+A1(1);
  return s;
 },

 // ===================== 小問2 =====================
 // 9. 上から見た導線（緑、25 A）と、0.05 m の点
 [K+'goal2']:(p)=>topWire({g:seg(p,.03,.15)})+pointR({g:seg(p,.1,.25)})+label('上から 見た 図',TW.x,470,{size:24,color:C.dim,anchor:'middle'})+goalTag(G2,{g:seg(p,.03,.12)}),
 // 10. 点を通る、導線を中心とする円（白の破線）。円周に「2πr」。「理由は小問3」の小さな札
 [K+'circle']:(p,ctx)=>{
  const ve=voiceEnd(ctx);
  let s=topWire()+pointR({lab:0})+fade(seg(p,.05,.3),circR({lab2pi:seg(p,.3,.42)}));
  s+=fade(seg(p,.2,.3),label('r',TW.x+RP/2,TW.y-12,{size:30,color:CR,anchor:'middle',weight:700}));
  s+=panel(110,170,label('一周の 和',PC,160,{size:26,color:C.dim,anchor:'middle'})+fade(seg(p,.4,.52),T(`${Bs}\\times2\\pi r`,PC,225,46)),seg(p,.35,.45));
  s+=fade(seg(p,ve*.82,ve*.9),rect(PC-90,305,180,48,{fill:C.dim,fo:.12,stroke:C.dim,sw:2,rx:12})+label('理由は 小問3',PC,338,{size:24,color:C.dim,anchor:'middle',weight:700}));
  s+=goalTag(G2);
  return s;
 },
 // 11. B×2πr＝μ₀I → 両辺を 2πr で割る → B＝μ₀I/(2πr)。μ₀/(2π) の π に打ち消し線 → 2×10⁻⁷
 [K+'solve']:(p)=>{
  let s=card(120,90,960,400,'',1);
  s+=fade(seg(p,.02,.1),T(`${Bs}\\times2\\pi r=\\mu_0${Ic}`,600,150,44));
  s+=fade(seg(p,.12,.2),label('両辺を 2πr で 割る',940,160,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.2,.3),T(`${Bs}=\\dfrac{\\mu_0${Ic}}{2\\pi r}`,600,250,44));
  const cn=seg(p,.62,.7),gR=seg(p,.72,.82);
  const PIc=`{\\color{${C.a}}\\cancel{\\color{${C.ink}}\\pi}}`;
  const eqA=`\\dfrac{\\mu_0}{2\\pi}=\\dfrac{4\\pi\\times10^{-7}}{2\\pi}`;
  const eqB=`\\dfrac{\\mu_0}{2\\pi}=\\dfrac{4${PIc}\\times10^{-7}}{2${PIc}}=${`{\\color{${C.hi}}2\\times10^{-7}\\ \\mathrm{T\\cdot m/A}}`}`;
  s+=fade(seg(p,.45,.55)*(1-seg(p,.6,.63)),T(eqA,600,385,42));
  s+=fade(seg(p,.63,.68),T(eqB,600,385,42,{opacity:1}));
  s+=goalTag(G2);
  return s;
 },
 // 12. 25 と 0.05 を一つずつ入れて計算。小問2 の答え B
 [K+'calc2']:(p,ctx)=>{
  const ve=voiceEnd(ctx);
  let s=card(120,90,960,400,'',1);
  s+=T(`${Bs}=\\dfrac{\\mu_0${Ic}}{2\\pi r}=2\\times10^{-7}\\times\\dfrac{${Ic}}{r}`,600,170,42);
  const s1=seg(p,.05,.13),s2=seg(p,.17,.25);
  s+=fade(s1*(1-s2),T(`=2\\times10^{-7}\\times\\dfrac{{\\color{${CI}}25}}{r}`,600,300,42));
  s+=fade(s2,T(`=2\\times10^{-7}\\times\\dfrac{{\\color{${CI}}25}}{{\\color{${CR}}0.05}}`,600,300,42));
  s+=fade(seg(p,.3,.42),T(`=1.0\\times10^{-4}\\ \\mathrm{T}`,600,420,44,{color:C.hi}));
  s+=goalTag(G2)+A2(seg(p,ve*.62,ve*.7));
  return s;
 },
 // 13. 誤答 A → 誤答 D（図に戻る）
 [K+'wrong2AD']:(p,ctx)=>{
  let s=topWire()+pointR({lab:1})+circR({lab2pi:1});
  s+=wrongSeq(p,ctx,[['A','6.3×10⁻⁴ T','μ₀I/r（2π で割っていない）'],['D','5.0×10⁻⁵ T','距離を直径 0.10 m にした']],{opts:{...WR,y:150}});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // 14. 誤答 C
 [K+'wrong2C']:(p)=>{
  let s=topWire()+pointR({lab:1})+circR({lab2pi:1});
  s+=wrongCard('C','2.0×10⁻³ T','距離の2乗で割った（単位 T/m）',{...WR,y:150,g:seg(p,.03,.1)});
  s+=goalTag(G2)+A2(1);
  return s;
 },

 // ===================== 小問3 =====================
 // 15. 白の破線の円と導線。誤答カードは消す
 [K+'goal3']:(p)=>topWire()+pointR({lab:0,g:1-seg(p,.05,.2)})+circR()+goalTag(G3,{g:seg(p,.03,.12)}),
 // 16. 対称性：①図ごと導線のまわりに回す ②横から見た図で、円を導線に沿ってずらす → 円の上に接線向きの橙の矢印を等間隔に
 [K+'sym']:(p,ctx)=>{
  // 2026-10-16（PQ-025）：1文目＝対称性 → 同じ円の上で B の大きさは同じ。2文目＝右ねじの関係で、向きは円の接線（右の枠を右ねじの小さな絵に替える）
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55,e2=W[1]?Math.min(W[1][1],1):.95,d2=e2-b,q=x=>x*b;
  const rot=90*seg(p,q(.05),q(.3))*(1-seg(p,q(.3),q(.4)));   // 回してもどす
  let s=topWire({sym:1})+circR();
  const a=(30+rot)*RAD;s+=fade(1-seg(p,b,b+.04),dot(TW.x+RP*Math.cos(a),TW.y-RP*Math.sin(a),9,C.hi));
  s+=fade(seg(p,q(.05),q(.12))*(1-seg(p,q(.35),q(.42))),label('導線の まわりに 回す',TW.x,TW.y-RP-22,{size:24,color:C.hi,anchor:'middle',weight:700}));
  // 横から見た図（右の枠）
  const sx=PC,sh=36*Math.sin(Math.PI*2*seg(p,q(.42),q(.7)));
  let side=line(sx,140,sx,395,{color:CI,w:6})+arrow(sx,250,sx,170,{color:CI,w:6,head:18});
  side+=`<ellipse cx="${sx}" cy="${300+sh}" rx="150" ry="34" fill="none" stroke="${CR}" stroke-width="3" stroke-dasharray="9 7"/>`;
  side+=label('横から 見た 図',PX+20,128,{size:22,color:C.dim});
  side+=fade(seg(p,q(.42),q(.5))*(1-seg(p,q(.72),q(.78))),label('導線に 沿って ずらす',sx,430,{size:24,color:C.hi,anchor:'middle',weight:700}));
  side+=fade(seg(p,q(.72),q(.8)),label('様子は 変わらない',sx,432,{size:26,color:C.ink,anchor:'middle',weight:700}));
  side+=fade(seg(p,q(.82),q(.92)),label('同じ 円の 上では、B の 大きさは 同じ',sx,470,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=panel(95,390,side,seg(p,q(.35),q(.42))*(1-seg(p,b,b+.04)));
  // 右ねじの小さな絵（2文目）：ねじが進む向き＝電流（上向き）、回す向き＝𝐁
  const sc=seg(p,b+.02,b+.02+.12*d2);
  let scr=label('右ねじの 関係',PX+20,128,{size:24,color:C.hi,weight:700});
  const ey=262;
  scr+=line(sx,150,sx,350,{color:CI,w:6})+arrow(sx,190,sx,150,{color:CI,w:6,head:18})+label('ねじの 進む 向き',sx+24,172,{size:22,color:CI})+label('＝ 電流 I',sx+24,204,{size:24,color:CI,weight:700});
  scr+=`<ellipse cx="${sx}" cy="${ey}" rx="110" ry="28" fill="none" stroke="${CB}" stroke-width="4"/>`;
  scr+=rect(sx-16,200,32,112,{fill:'#3a4252',fo:1,stroke:C.dim,sw:2,rx:3});
  for(let k=0;k<6;k++){const yy=208+k*17;scr+=line(sx-16,yy+8,sx+16,yy,{color:C.dim,w:2});}
  scr+=rect(sx-34,312,68,18,{fill:'#3a4252',fo:1,stroke:C.dim,sw:2,rx:4});
  scr+=`<path d="M ${sx-110} ${ey} A 110 28 0 0 0 ${sx+110} ${ey}" fill="none" stroke="${CB}" stroke-width="5"/>`;
  scr+=head(sx+60,ey+23.5,92,-15.3,{color:CB,L:22})+head(sx-60,ey-23.5,-92,15.3,{color:CB,L:22});
  scr+=label('回す 向き ＝ 𝐁 の 向き',sx,385,{size:24,color:CB,anchor:'middle',weight:700});
  scr+=fade(seg(p,b+.55*d2,b+.7*d2),label('→ 円の 接線の 向き',sx,435,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=panel(95,390,scr,sc,C.hi);
  s+=bTangents({g:seg(p,b+.55*d2,b+.75*d2)});
  s+=goalTag(G3)+dirNote();
  return s;
 },
 // 17. チェック1：一歩 d𝐫（金）を円の上に描き、橙の 𝐁 と重ねる（平行）。𝐁·d𝐫＝B dℓ
 [K+'check1']:(p)=>{
  let s=topWire({sym:1})+circR()+bTangents({g:.45});
  const a=-30*RAD,x=TW.x+RP*Math.cos(a),y=TW.y-RP*Math.sin(a),tx=-Math.sin(a),ty=-Math.cos(a),ox=Math.cos(a)*16,oy=-Math.sin(a)*16;
  s+=fade(seg(p,.05,.18),arrow(x+ox-tx*45,y+oy-ty*45,x+ox+tx*45,y+oy+ty*45,{color:DC,w:7,head:18})
   +arrow(x-ox-tx*45,y-oy-ty*45,x-ox+tx*45,y-oy+ty*45,{color:CB,w:7,head:18})+T(vB,x-ox-tx*45-30,y-oy-ty*45-4,32));
  s+=fade(seg(p,.05,.18),label('一歩 d𝐫',x+60,y+64,{size:24,color:DC,weight:700}));
  s+=panel(95,330,label('チェック1　平行',PX+30,150,{size:30,color:C.hi,weight:700})+fade(seg(p,.4,.52),T(`${vB}\\cdot${dr}=${Bs}\\,d\\ell`,PC,225,44))
   +line(PX+30,280,PX+PW-30,280,{color:C.faint,w:2})+label('チェック2',PX+30,335,{size:30,color:C.faint,weight:700}),seg(p,.15,.25),C.hi);
  s+=goalTag(G3)+dirNote();
  return s;
 },
 // 18. チェック2：円の上の橙の矢印がすべて同じ長さ。∮B dℓ の B を積分の外へ。小問3 の答え C
 [K+'check2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.7;
  const gl=seg(p,.05,.15)*(1-seg(p,.4,.5));
  let s=topWire({sym:1})+circR()+bTangents({g:1,glow:gl});
  s+=fade(seg(p,.05,.15),label('どれも 距離 r',TW.x,TW.y-RP-22,{size:24,color:C.hi,anchor:'middle',weight:700}));
  const ex=seg(p,.35,.5);
  s+=panel(95,330,label('チェック1　平行',PX+30,150,{size:30,color:C.dim,weight:700})+T(`${vB}\\cdot${dr}=${Bs}\\,d\\ell`,PC,215,36,{opacity:.7})
   +line(PX+30,262,PX+PW-30,262,{color:C.faint,w:2})+label('チェック2　どこでも 同じ B',PX+30,315,{size:30,color:C.hi,weight:700})
   +fade(1-ex,T(`\\oint ${Bs}\\,d\\ell`,PC,385,44))+fade(ex,T(`=${Bs}\\oint d\\ell=${Bs}\\times2\\pi r`,PC,385,44)),1,C.hi);
  s+=goalTag(G3)+A3(seg(p,b,b+.06))+dirNote();
  return s;
 },
 // 19. 正方形の道と円の道。両方に「法則は成り立つ」、円に丸「計算しやすい」。誤答 A
 [K+'wrong3A']:(p)=>{
  let s='';
  const sq=(cx,cy)=>draw([[cx-95,cy-95],[cx+95,cy-95],[cx+95,cy+95],[cx-95,cy+95],[cx-95,cy-95]],1,{color:CR,w:3,dash:'10 8'})+outSym(cx,cy,16,CI);
  s+=fade(seg(p,.03,.15),sq(170,250)+label('法則は 成り立つ',170,395,{size:24,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.22),ring(440,250,95,{color:CR,w:3,dash:'10 8'})+outSym(440,250,16,CI)+label('法則は 成り立つ',440,395,{size:24,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.5),ring(440,250,122,{color:C.hi,w:4})+label('○ 計算しやすい',440,435,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=wrongCard('A','円でしか成り立たない','どんな閉じた道でも成り立つ',{...WR,y:150,g:seg(p,.03,.1)});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 20. 誤答 B → 誤答 D（円の上の 𝐁 は接線の向き）
 [K+'wrong3BD']:(p,ctx)=>{
  let s=topWire({sym:1})+circR()+bTangents({g:1});
  s+=wrongSeq(p,ctx,[['B','一歩に直角','𝐁 は接線の向きで、一歩と平行'],['D','円の上で 0','中心の電流が円の上に磁場を作る']],{opts:{...WR,y:150}});
  s+=goalTag(G3)+A3(1)+dirNote();
  return s;
 },
 // 21. 1/r と 1/r² のグラフを並べる。右上の答えの札3枚を並べて終わる
 [K+'sum']:(p)=>{
  let s=graph(110,450,420,300,r=>1/r,{g:seg(p,.03,.15),title:'直線電流の 磁場',lab:'\\dfrac{1}{r}'});
  s+=graph(680,450,420,300,r=>1/(r*r),{color:C.x,g:seg(p,.3,.45),title:'点電荷の 電場',lab:'\\dfrac{1}{r^2}'});
  s+=answerRow([[1,'C','5.0×10⁻⁶ T·m'],[2,'B','1.0×10⁻⁴ T'],[3,'C','']],{g:seg(p,.75,.85),size:24});
  return s;
 },
};

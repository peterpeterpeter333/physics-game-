// 問題編 解説「e＝0.5 の衝突と重心」（q-uc-momentum、大学編 14 運動量・上級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/14_運動量.md の q-uc-momentum（解説 19 行）。
// 色（単元動画 ys-uc-momentum-1/2 と同じ）：運動量 P 桃、内力 緑・外力 赤（凡例を出す）、速度 v 紫、運動エネルギー K 橙、反発係数 e・重心 黄。右向きが正。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。文字は 22px 以上。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,ground,tex,texWidth,poly} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,pauseBadge,legend,note,cueT,tAt,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-uc-momentum:';
const CP=C.p,CV=C.v,CF=C.F,CT=C.t,CK=C.E,HI=C.hi,EXT=C.a,BAD='#ff6b6b';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const cc=(c,s)=>`{\\color{${c}}{${s}}}`;
const V1=`${cc(CV,"v_1'")}`,V2=`${cc(CV,"v_2'")}`;
const G1='衝突後の (v₁′, v₂′)',G2='失われた K',G3='重心の速さ（前・後）';
const A1=g=>answerTag(1,'D','2.5, 4.5',{g}),A2=g=>answerTag(2,'B','4.5 J',{g}),A3=g=>answerTag(3,'B','',{g});
const LEG=(x=30,y=486,g=1)=>legend([['緑＝内力',CF],['赤＝外力',EXT]],x,y,{g,dir:'row'});
function atMark(ctx,mark,fb=.5){
 const r=(ctx?.cue?.reading??'').replace(/[\s。]/g,''),i=r.indexOf(mark.replace(/\s/g,''));
 return i<0?fb:i/r.length*voiceEnd(ctx);
}
const LX=30,LW=600,LC=LX+LW/2;   // 左の枠
const lcard=(y,h,inner,g=1,stroke=C.faint)=>card(LX,y,LW,h,inner,g,stroke);

// ---- 物体（箱）と矢印 --------------------------------------------------------------------------------
const BW={1:130,2:96},BH={1:70,2:58};
function blk(x,fy,i,{g=1,ghost=0,sc=1}={}){
 const w=BW[i]*sc,h=BH[i]*sc,m=i===1?'3 kg':'1 kg';
 if(ghost)return fade(g,`<rect x="${(x-w/2).toFixed(1)}" y="${fy-h}" width="${w}" height="${h}" rx="8" fill="none" stroke="${C.dim}" stroke-width="3" stroke-dasharray="8 6"/>`);
 return fade(g,rect(x-w/2,fy-h,w,h,{fill:'#9aabc7',fo:.3,stroke:'#9aabc7',sw:2,rx:8})
  +label(`物体${i}`,x,fy-h/2-4,{size:22,color:C.ink,anchor:'middle'})+label(m,x,fy-h/2+22,{size:22,color:C.ink,anchor:'middle'}));
}
const edgeR=(x,i,sc=1)=>x+BW[i]*sc/2,edgeL=(x,i,sc=1)=>x-BW[i]*sc/2;
function vUp(x,y,v,txt,{g=1,sc=25}={}){
 if(Math.abs(v)<1e-3)return fade(g,label(txt,x,y+6,{size:24,color:CV,anchor:'middle',weight:700}));
 const x1=x+v*sc;return fade(g,arrow(x,y,x1,y,{color:CV,w:6,head:16})+label(txt,(x+x1)/2,y-14,{size:24,color:CV,anchor:'middle',weight:700}));
}
function posDir(x=40,y=110,g=1){return fade(g,arrow(x,y,x+80,y,{color:HI,w:4,head:14})+label('右向きが正（＋）',x+94,y+8,{size:22,color:HI}));}
function dashBox(x,y,w,h,{color=HI,g=1}={}){return fade(g,`<rect x="${x.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="${h}" rx="14" fill="${color}" fill-opacity=".05" stroke="${color}" stroke-width="3" stroke-dasharray="12 9"/>`);}

// 静止した物体2の「0 m/s」（右横に）
const zeroLab=(x,fy,sc=1.15)=>label('0 m/s',x+BW[2]*sc/2+12,fy-BH[2]*sc/2+8,{size:24,color:CV,weight:700});
// 左下の小さな床（行3〜8、小問2・3）：fy＝470
const SFY=470;
function strip({x1=150,x2=430,v1=4,v2=0,vel=1,g=1,lab1,lab2,cm=0,cmV=0}={}){
 let s=ground(40,620,SFY)+blk(x1,SFY,1)+blk(x2,SFY,2);
 if(vel){s+=vUp(x1,SFY-BH[1]-22,v1,lab1??`${v1} m/s`)+vUp(x2,SFY-BH[2]-22,v2,lab2??`${v2} m/s`);}
 if(cm){const xg=(3*x1+x2)/4;s+=fade(cm,dot(xg,SFY-34,10,HI)+ring(xg,SFY-34,15,{color:HI,w:2}));if(cmV)s+=fade(cmV,arrow(xg,SFY-34,xg+3*25,SFY-34,{color:CV,w:5,head:14}));}
 return fade(g,s);
}

// ---- v₁′–v₂′ 平面（右） ------------------------------------------------------------------------------
const PO={x:720,y:470},PXs=100,PYs=50;
const PXv=v=>PO.x+PXs*v,PYv=v=>PO.y-PYs*v;
function plane({g=1}={}){
 let s=arrow(PO.x-10,PO.y,PO.x+450,PO.y,{color:CV,w:3,head:14})+arrow(PO.x,PO.y+10,PO.x,96,{color:CV,w:3,head:14});
 s+=label('v₁′',PO.x+455,PO.y+8,{size:26,color:CV,weight:700})+label('v₂′',PO.x+14,106,{size:26,color:CV,weight:700});
 for(const u of [1,2,3,4])s+=line(PXv(u),PO.y-6,PXv(u),PO.y+6,{color:C.dim,w:2})+label(String(u),PXv(u),PO.y+30,{size:22,color:C.dim,anchor:'middle'});
 for(const v of [2,4,6])s+=line(PO.x-6,PYv(v),PO.x+6,PYv(v),{color:C.dim,w:2})+label(String(v),PO.x-12,PYv(v)+8,{size:22,color:C.dim,anchor:'end'});
 s+=label('0',PO.x-12,PO.y+28,{size:22,color:C.dim,anchor:'end'});
 return fade(g,s);
}
function momLine(g=1,lab=1){
 return fade(g,draw([[PXv(5/3),PYv(7)],[PXv(4),PYv(0)]],1,{color:CP,w:5})+(lab?label("3v₁′＋v₂′＝12",PXv(1.6)-8,PYv(6.0),{size:22,color:CP,anchor:'end',weight:700}):''));
}
function resLine(e,g=1,lab=1){
 const c=4*e,u1=Math.min(4,7-c);
 return fade(g,draw([[PXv(0),PYv(c)],[PXv(u1),PYv(c+u1)]],1,{color:HI,w:4.5})+(lab?label(`e＝${e===.5?'0.5':Number(e.toFixed(2))}`,PXv(Math.min(u1,3.3))+12,PYv(c+Math.min(u1,3.3))+30,{size:24,color:HI,weight:700}):''));
}
function pt(u,v,{g=1,col=HI,txt='',r=10,dx=14,dy=-12,anchor='start'}={}){
 return fade(g,dot(PXv(u),PYv(v),r,col)+ring(PXv(u),PYv(v),r+6,{color:col,w:2})+(txt?label(txt,PXv(u)+dx,PYv(v)+dy,{size:24,color:col,anchor,weight:700}):''));
}

// ---- 運動エネルギーの棒（小問2） ---------------------------------------------------------------------
const KS=12; // 1 J あたり px
function kBars({g=1,after=1,split=1,lost=0,heat=0,x0=120,base=440}={}){
 let s=label('前',x0+50,base+34,{size:26,color:C.dim,anchor:'middle',weight:700})+label('後',x0+230,base+34,{size:26,color:C.dim,anchor:'middle',weight:700});
 s+=rect(x0,base-24*KS,100,24*KS,{fill:CK,fo:.55,stroke:CK,sw:2,rx:4})+label('24 J',x0+50,base-24*KS-12,{size:26,color:CK,anchor:'middle',weight:700});
 if(after){
  const h1=9.375*KS,h2=10.125*KS,xa=x0+180;
  s+=fade(after,rect(xa,base-h1,100,h1,{fill:CK,fo:.55,stroke:CK,sw:2,rx:4})+rect(xa,base-h1-h2,100,h2,{fill:CK,fo:.32,stroke:CK,sw:2,rx:4})
   +label('19.5 J',xa+112,base-h1-h2+20,{size:26,color:CK,weight:700}));
  if(split)s+=fade(after*split,label('物体1 9.375',xa+112,base-h1/2+8,{size:22,color:CK,weight:700})+label('物体2 10.125',xa+112,base-h1-h2/2+8,{size:22,color:CK,weight:700}));
 }
 if(lost){
  const top=base-24*KS,y2=base-19.5*KS;
  s+=fade(lost,`<rect x="${x0+180}" y="${top}" width="100" height="${(y2-top).toFixed(1)}" rx="4" fill="none" stroke="${BAD}" stroke-width="3" stroke-dasharray="7 6"/>`+label('4.5 J',x0+230,(top+y2)/2+9,{size:24,color:BAD,anchor:'middle',weight:700}));
 }
 if(heat){
  const hx=x0+400,hy=base-21*KS;
  s+=fade(heat,arrow(x0+290,base-21.75*KS,hx-14,hy,{color:BAD,w:4,head:14}));
  let w='';for(let k=0;k<3;k++){const pts=Array.from({length:21},(_,i)=>[hx+i*4,hy-16+k*16+6*Math.sin(i*.9)]);w+=draw(pts,1,{color:CK,w:3});}
  s+=fade(heat,w+label('熱・変形',hx+40,hy+50,{size:24,color:CK,anchor:'middle',weight:700}));
 }
 return fade(g,s);
}

export const ytQxUcMomentumDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（6 s）：物体1が右へ 4 m/s、静止した物体2「0 m/s」。ぶつける直前で映像を一時停止。4〜6 s 上に反発係数の定義と e＝0.5、隅に注記。
 // 衝突後の速度・エネルギー・重心の値は出さない。
 [K+'q1']:(p,ctx)=>{
  const t=cueT(ctx),FY=420,X2=820,stop=3.6,xs=300,xe=edgeL(X2,2)-12-BW[1]/2;
  const x1=mix(xs,xe,clamp(t/stop));
  let s=ground(40,1160,FY)+posDir(40,110)+blk(x1,FY,1,{sc:1.15})+blk(X2,FY,2,{sc:1.15});
  s+=vUp(x1,FY-BH[1]*1.15-24,4,'4 m/s',{sc:28})+zeroLab(X2,FY);
  s+=pauseBadge({x:1060,y:170,g:seg(t,stop,stop+.3)});
  const gd=seg(t,4,4.6);
  s+=fade(gd,card(300,96,600,160,kindTag('定義',370,136)+T(`e=\\dfrac{${V2}-${V1}}{${cc(CV,'v_1')}-${cc(CV,'v_2')}}`,560,190,40)
   +label('e ＝ 0.5',800,202,{size:34,color:HI,anchor:'middle',weight:700}),1,HI));
  s+=note('衝突の間の 外力の 力積は 無視',1180,480,{g:gd,anchor:'end'});
  return s;
 },

 // ===================== 小問1 =====================
 // 1. 出題中の図（ぶつかる直前で止めた所）。色の凡例「緑＝内力、赤＝外力」
 [K+'goal1']:(p)=>{
  const FY=420,X2=820,x1=edgeL(X2,2)-12-BW[1]/2;
  let s=ground(40,1160,FY)+posDir(40,110)+blk(x1,FY,1,{sc:1.15})+blk(X2,FY,2,{sc:1.15});
  s+=vUp(x1,FY-BH[1]*1.15-24,4,'4 m/s',{sc:28})+zeroLab(X2,FY);
  s+=card(330,110,700,150,label('小問1',680,155,{size:26,color:C.dim,anchor:'middle'})+label('ぶつかった 後の 2つの 速度（e ＝ 0.5）',680,215,{size:30,color:HI,anchor:'middle',weight:700}),seg(p,.05,.2),HI);
  s+=LEG(860,486,seg(p,.2,.35));
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 2. 2物体を点線の枠で囲む。内力の組（緑・同じ長さで逆向き）に打ち消し線。「外力の和＝0」。右に dP/dt＝F外 → P 一定
 [K+'box']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55,FY=400,sc=1.15;
  const x2=420,x1=x2-(BW[1]+BW[2])*sc/2;
  let s=ground(40,620,FY)+blk(x1,FY,1,{sc})+blk(x2,FY,2,{sc})+posDir(40,110);
  const bx0=edgeL(x1,1,sc)-24,bx1=edgeR(x2,2,sc)+24;
  s+=dashBox(bx0,170,bx1-bx0,FY-170+12,{g:seg(p,.03,.12)});
  const xi=edgeR(x1,1,sc),y=FY-BH[1]*sc-28;
  s+=fade(seg(p,.12,.22),arrow(xi+4,y,xi+110,y,{color:CF,w:7,head:20})+arrow(xi-4,y,xi-110,y,{color:CF,w:7,head:20}));
  s+=fade(seg(p,.28,.36),line(xi-125,y+22,xi+125,y-22,{color:HI,w:4})+label('内力の組は 消える',xi,y-40,{size:24,color:HI,anchor:'middle',weight:700}));
  s+=card(650,96,530,330,
   label('枠の中の 運動量の 合計',915,140,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.3,.42),T(`\\dfrac{d\\mathbf{${cc(CP,'P')}}}{dt}=\\mathbf{F}`,895,215,44)+label('外',975,240,{size:26,color:C.ink,weight:700}))
   +fade(seg(p,b,b+.1),kindTag('前提',915,300,{text:'外力の和 ＝ 0',color:C.dim}))
   +fade(seg(p,b+.18,b+.3),label('→ 𝐏 は 一定',915,375,{size:32,color:CP,anchor:'middle',weight:700})),seg(p,.02,.1),CP);
  s+=LEG(650,486,1);
  s+=goalTag(G1);
  return s;
 },
 // 3. 運動量保存 3×4＋1×0＝3v₁′＋v₂′ → 3v₁′＋v₂′＝12。右に v₁′–v₂′ 平面と桃の直線
 [K+'mom']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=lcard(96,250,label('運動量の 保存',LC,136,{size:26,color:CP,anchor:'middle',weight:700})
   +T(`3\\times4+1\\times0=3${V1}+${V2}`,LC,200,36)
   +fade(seg(p,.3,.42),T(`${cc(CP,`3${V1}+${V2}=12`)}`,LC,262,40))
   +fade(seg(p,b,b+.1),label('未知数 2つ・式は まだ 1本',LC,325,{size:26,color:HI,anchor:'middle',weight:700})),1,CP);
  s+=strip({g:seg(p,0,.1),x1:150,x2:430});
  s+=plane({g:seg(p,.05,.15)})+momLine(seg(p,.4,.55));
  s+=goalTag(G1);
  return s;
 },
 // 4. 反発係数の定義に数を入れる → v₂′＝v₁′＋2。平面に黄の直線
 [K+'rest']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.3;
  let s=lcard(96,250,kindTag('定義',LX+70,136)
   +T(`e=\\dfrac{${V2}-${V1}}{${cc(CV,'v_1')}-${cc(CV,'v_2')}}`,LC+40,190,32)
   +fade(seg(p,b,b+.12),T(`${V2}-${V1}=0.5\\times(4-0)=2`,LC,262,34))
   +fade(seg(p,b+.3,b+.42),T(`${cc(HI,`${V2}=${V1}+2`)}`,LC,318,36)),1,HI);
  s+=strip({x1:150,x2:430});
  s+=plane()+momLine(1)+resLine(.5,seg(p,b+.35,b+.5));
  s+=goalTag(G1);
  return s;
 },
 // 5. 代入 4v₁′＋2＝12 → v₁′＝2.5、v₂′＝4.5。交点を光らせ、衝突後の2物体に速度の矢印。答えの札 D
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.75;
  let s=lcard(96,250,T(`4${V1}+2=12`,LC,150,36)
   +fade(seg(p,.2,.32),T(`${V1}=${cc(CV,'2.5\\,\\mathrm{m/s}')}`,LC,215,36))
   +fade(seg(p,.35,.47),T(`${V2}=${cc(CV,'4.5\\,\\mathrm{m/s}')}`,LC,280,36)),1,CV);
  const af=seg(p,.45,.6);
  s+=fade(1-af,strip({x1:150,x2:430}))+fade(af,strip({x1:250,x2:470,v1:2.5,v2:4.5,lab1:'2.5',lab2:'4.5'}));
  s+=plane()+momLine(1)+resLine(.5,1)+pt(2.5,4.5,{g:seg(p,.2,.32),txt:'(2.5, 4.5)',dx:-16,dy:-14,anchor:'end'});
  s+=goalTag(G1)+A1(seg(p,b,b+.08));
  return s;
 },
 // 6. 確かめ：運動量 ✓、反発係数 ✓
 [K+'check']:(p)=>{
  let s=lcard(96,250,label('確かめ',LC,136,{size:26,color:C.dim,anchor:'middle'})
   +T('3\\times2.5+4.5=12',LC-40,200,36)+fade(seg(p,.15,.28),label('運動量 ✓',LC+170,212,{size:28,color:CP,weight:700}))
   +fade(seg(p,.35,.48),T('4.5-2.5=2',LC-40,280,36)+label('反発係数 ✓',LC+170,292,{size:28,color:HI,weight:700})),1,C.faint);
  s+=strip({x1:250,x2:470,v1:2.5,v2:4.5,lab1:'2.5',lab2:'4.5'});
  s+=plane()+momLine(1)+resLine(.5,1)+pt(2.5,4.5,{txt:'(2.5, 4.5)',dx:-16,dy:-14,anchor:'end'});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // 7. 誤答 A（e＝0）→ B（e＝1）を一枚ずつ。黄の直線を e＝0、0.5、1 と平行に動かし、交点を順に
 [K+'wrongAB']:(p,ctx)=>{
  const W=sentWin(ctx),bB=atMark(ctx,'ビーの',.3),b2=W[1]?W[1][0]:.6;
  const inA=p<bB,inB=p>=bB&&p<b2;
  let e=.5;if(inA)e=mix(.5,0,seg(p,.02,.12));else if(inB)e=mix(0,1,seg(p,bB,bB+.1));else{const u=clamp((p-b2)/(1-b2));e=u<.5?mix(1,0,seg(u,0,.45)):mix(0,1,seg(u,.5,.95));}
  const atRest=Math.abs(e*2-Math.round(e*2))<.01;
  let s=plane()+momLine(1)+fade(.35,resLine(.5,1,0))+resLine(e,1,atRest?1:0);
  s+=pt(2.5,4.5,{g:.6,txt:'',r:7});
  s+=pt(3,3,{g:seg(p,.06,.14),col:HI,txt:'(3, 3)',dx:14,dy:-6});
  s+=pt(2,6,{g:seg(p,bB+.06,bB+.12),col:HI,txt:'(2, 6)',dx:0,dy:-22,anchor:'middle'});
  s+=wrongSeq(p,ctx,[['A','(3.0, 3.0)','e＝0 として解いた'],['B','(2.0, 6.0)','e＝1 として解いた']],{win:[[0,bB],[bB,1]],opts:{x:LX,w:LW,y:150}});
  s+=fade(seg(p,b2,b2+.08),label('e を 変えると 黄の 直線が 平行に 動く',LC,360,{size:26,color:HI,anchor:'middle',weight:700}));
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // 8. 誤答 C（式の向きを逆に）：物体1が物体2を追い越す点線の動きに ×
 [K+'wrongC']:(p)=>{
  let s=plane()+momLine(1)+resLine(.5,1)+pt(2.5,4.5,{txt:'(2.5, 4.5)',dx:-16,dy:-14,anchor:'end'});
  s+=pt(3.5,1.5,{g:seg(p,.1,.2),col:BAD,txt:'(3.5, 1.5)',dx:14,dy:-6});
  s+=wrongCard('C','(3.5, 1.5)','v₂′＝v₁′−2 と向きを逆にした',{x:LX,w:LW,y:110,g:seg(p,.02,.08)});
  // 追い越し：後ろの物体1（3.5 m/s）が、前の物体2（1.5 m/s）をすり抜けて前に出る（点線）。物体2の上に ×
  const g1=seg(p,.3,.42),g2=seg(p,.45,.6),g3=seg(p,.62,.72),x2=420;
  s+=ground(40,620,SFY)+blk(x2,SFY,2)+blk(170,SFY,1,{ghost:1,g:g1})+vUp(x2,SFY-BH[2]-22,1.5,'1.5',{g:g1})+vUp(170,SFY-BH[1]-22,3.5,'3.5',{g:g1});
  s+=fade(g2,draw([[240,SFY-34],[470,SFY-34]],1,{color:C.dim,w:3,dash:'8 7'})+arrow(470,SFY-34,488,SFY-34,{color:C.dim,w:3,head:14})+blk(545,SFY,1,{ghost:1}));
  s+=fade(g3,line(515,SFY-75,575,SFY-10,{color:BAD,w:6})+line(515,SFY-10,575,SFY-75,{color:BAD,w:6})+label('すり抜けは 起きない',LC,SFY-170,{size:26,color:BAD,anchor:'middle',weight:700}));
  s+=goalTag(G1)+A1(1);
  return s;
 },

 // ===================== 小問2 =====================
 // 9. 衝突前後の2段（速度）。右の枠「小問2：失われた K」
 [K+'goal2']:(p)=>{
  let s=label('前',60,230,{size:28,color:C.dim,weight:700})+label('後',60,420,{size:28,color:C.dim,weight:700});
  s+=ground(100,620,260)+blk(220,260,1)+blk(420,260,2)+vUp(220,260-BH[1]-22,4,'4 m/s')+vUp(420,260-BH[2]-22,0,'0 m/s');
  s+=ground(100,620,450)+blk(260,450,1)+blk(450,450,2)+vUp(260,450-BH[1]-22,2.5,'2.5 m/s')+vUp(450,450-BH[2]-22,4.5,'4.5 m/s');
  s+=card(660,110,500,200,label('小問2',910,155,{size:26,color:C.dim,anchor:'middle'})+label('衝突で 失われた',910,215,{size:28,color:C.ink,anchor:'middle',weight:700})
   +label('運動エネルギー K',910,265,{size:30,color:CK,anchor:'middle',weight:700}),seg(p,.05,.2),HI);
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 10. K の棒（橙）：前 24 J、後 19.5 J（9.375＋10.125 の2段）。差 4.5 J が熱・変形へ。答えの札 B
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.75;
  let s=kBars({after:seg(p,.3,.42),split:seg(p,.38,.48),lost:seg(p,b,b+.08),heat:seg(p,b+.08,b+.18)});
  s+=card(660,96,520,300,T(`${cc(CK,'K_{\\mathrm{0}}')}=\\tfrac{1}{2}\\times3\\times16=${cc(CK,'24\\,\\mathrm{J}')}`.replace('K_{\\mathrm{0}}','K'),920,150,30)
   +fade(seg(p,.25,.38),T(`\\tfrac{1}{2}\\times3\\times2.5^2+\\tfrac{1}{2}\\times1\\times4.5^2`,920,220,28))
   +fade(seg(p,.38,.5),T(`=${cc(CK,'19.5\\,\\mathrm{J}')}`,920,280,32))
   +fade(seg(p,b,b+.1),T(`24-19.5=${cc(BAD,'4.5\\,\\mathrm{J}')}`,920,350,32)),1,CK);
  s+=label('前',700,150,{size:24,color:C.dim,weight:700})+fade(seg(p,.25,.38),label('後',700,220,{size:24,color:C.dim,weight:700}));
  s+=goalTag(G2)+A2(seg(p,atMark(ctx,'しょうもん にの',.85),atMark(ctx,'しょうもん にの',.85)+.06));
  return s;
 },
 // 11. 誤答 A（0 J）。2文目：K が保存するのは e＝1 だけ
 [K+'wrong2A']:(p,ctx)=>{
  let s=kBars({lost:1,heat:1});
  s+=wrongCard('A','0 J','K が保存するのは e＝1 だけ',{x:660,w:520,y:150,g:seg(p,.03,.1)});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // 12. 減少は 1−e² に比例：e＝0、0.5、1 の表（6、4.5、0 J）
 [K+'table']:(p)=>{
  let s=card(150,96,900,120,T(`\\text{}\\Delta ${cc(CK,'K')}\\propto 1-e^2`.replace('\\text{}',''),600,160,44),seg(p,.02,.12),CK);
  s+=label('減少',220,165,{size:28,color:CK,weight:700});
  const rows=[['e',['0','0.5','1'],HI],['減少',['6 J','4.5 J','0 J'],CK]],xs=[560,760,960],ys=[290,370];
  s+=fade(seg(p,.2,.3),line(220,320,1060,320,{color:C.faint,w:2})+line(460,250,460,400,{color:C.faint,w:2}));
  rows.forEach(([h,vals,col],r)=>{s+=fade(seg(p,.2,.3),label(h,340,ys[r]+10,{size:30,color:col,anchor:'middle',weight:700}));
   vals.forEach((v,i)=>{s+=fade(seg(p,.3+.12*i,.38+.12*i),label(v,xs[i],ys[r]+10,{size:32,color:r===1&&i===1?BAD:col,anchor:'middle',weight:700}));});});
  s+=fade(seg(p,.62,.75),T('6\\times0.75=4.5',600,460,38));
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // 13. 誤答 C → D（一枚ずつ）
 [K+'wrong2CD']:(p,ctx)=>{
  const b=atMark(ctx,'ディーの',.5);
  let s=card(150,96,900,110,T('\\Delta K\\propto 1-e^2',600,155,40),1,C.faint);
  s+=wrongSeq(p,ctx,[['C','6.0 J','e＝0（くっつく）の場合'],['D','12 J',['24×(1−e) とした。','正しくは 6×(1−e²)'],{mid:'24\\times(1-0.5)=12'}]],{win:[[0,b],[b,1]],opts:{x:150,w:900,y:225}});
  s+=goalTag(G2)+A2(1);
  return s;
 },

 // ===================== 小問3 =====================
 // 14. 2物体の間に重心の点（黄）
 [K+'goal3']:(p)=>{
  let s=strip({x1:150,x2:430,cm:seg(p,.3,.45)})+posDir(40,110);
  s+=fade(seg(p,.35,.5),label('重心',(3*150+430)/4,SFY+40,{size:24,color:HI,anchor:'middle',weight:700}));
  s+=card(660,110,500,200,label('小問3',910,155,{size:26,color:C.dim,anchor:'middle'})+label('重心の 速さ（衝突前・後）',910,215,{size:28,color:HI,anchor:'middle',weight:700})
   +label('と その 理由',910,265,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),HI);
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 15. M v_G ＝ P、v_G＝12÷4＝3.0。重心の点に速度の矢印（紫）
 [K+'vg']:(p)=>{
  let s=strip({x1:150,x2:430,cm:1,cmV:seg(p,.5,.62)})+posDir(40,110)+label('重心',(3*150+430)/4,SFY+40,{size:24,color:HI,anchor:'middle',weight:700});
  s+=fade(seg(p,.55,.65),label('3.0',(3*150+430)/4+40,SFY-50,{size:24,color:CV,anchor:'middle',weight:700}));
  s+=card(660,96,520,300,T(`M\\,${cc(CV,'\\mathbf{v}_G')}=${cc(CP,'\\mathbf{P}')}`,920,165,44)
   +fade(seg(p,.35,.5),label('衝突前',920,245,{size:24,color:C.dim,anchor:'middle'})+T(`${cc(CV,'v_G')}=\\dfrac{12}{4}=${cc(CV,'3.0\\,\\mathrm{m/s}')}`,920,310,38)),seg(p,.02,.12),CP);
  s+=goalTag(G3);
  return s;
 },
 // 16. 重心の点が、衝突の前・最中・後で同じ 3.0 m/s で進む（ゆっくり再生）。答えの札 B
 [K+'ans3']:(p,ctx)=>{
  const t=tAt(ctx,K+'ans3'),tc=(430-48-150-65)/(4*25),T8=7,tt=Math.min(t,T8);
  const x1=tt<tc?150+100*tt:150+100*tc+62.5*(tt-tc),x2=tt<tc?430:430+112.5*(tt-tc);
  const xg=(3*x1+x2)/4;
  let s=ground(40,1160,SFY)+blk(x1,SFY,1)+blk(x2,SFY,2)+posDir(40,280);
  s+=vUp(x1,SFY-BH[1]-22,tt<tc?4:2.5,tt<tc?'4':'2.5')+vUp(x2,SFY-BH[2]-22,tt<tc?0:4.5,tt<tc?'0':'4.5');
  s+=dot(xg,SFY-34,10,HI)+ring(xg,SFY-34,15,{color:HI,w:2})+arrow(xg,SFY-34,xg+75,SFY-34,{color:CV,w:5,head:14})+label('重心 3.0 m/s',xg,SFY-130,{size:24,color:HI,anchor:'middle',weight:700});
  s+=note('ゆっくり 再生',1180,SFY+36,{anchor:'end'});
  if(t>=T8)s+=pauseBadge({x:1000,y:300,g:clamp((t-T8)/.3)});
  s+=card(150,96,900,150,T(`\\dfrac{3\\times2.5+1\\times4.5}{4}=${cc(CV,'3.0\\,\\mathrm{m/s}')}`,600,170,40),seg(p,.02,.12),CP);
  s+=goalTag(G3)+A3(seg(p,atMark(ctx,'しょうもん さんの',.85),atMark(ctx,'しょうもん さんの',.85)+.06));
  return s;
 },
 // 17. 誤答 A → C（一枚ずつ）
 [K+'wrong3AC']:(p,ctx)=>{
  const b=atMark(ctx,'スィーは',.5);
  let s=card(150,96,900,140,label('重心の 速さ ＝ 質量の 重み付き 平均',600,135,{size:26,color:C.dim,anchor:'middle'})+T('\\dfrac{3\\times4+1\\times0}{4}=3.0',600,195,30),1,C.faint);
  s+=wrongSeq(p,ctx,[['A','2.0 → 3.5','(4＋0)÷2、(2.5＋4.5)÷2 と重みなし',{mid:'(4+0)\\div2=2.0'}],['C','3.0 → 3.5','衝突後だけ重みなし',{mid:'(2.5+4.5)\\div2=3.5'}]],{win:[[0,b],[b,1]],opts:{x:150,w:900,y:255}});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 18. 誤答 D：減る K の棒（橙）と、一定の P の棒（桃）
 [K+'wrong3D']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55;
  const base=440,KS2=9,PS2=14;
  let s=label('前',170,base+32,{size:24,color:C.dim,anchor:'middle',weight:700})+label('後',290,base+32,{size:24,color:C.dim,anchor:'middle',weight:700})
   +label('前',470,base+32,{size:24,color:C.dim,anchor:'middle',weight:700})+label('後',590,base+32,{size:24,color:C.dim,anchor:'middle',weight:700});
  s+=rect(130,base-24*KS2,80,24*KS2,{fill:CK,fo:.55,stroke:CK,sw:2,rx:4})+rect(250,base-19.5*KS2,80,19.5*KS2,{fill:CK,fo:.55,stroke:CK,sw:2,rx:4});
  s+=label('K は 減る',230,base-24*KS2-20,{size:26,color:CK,anchor:'middle',weight:700});
  s+=rect(430,base-12*PS2,80,12*PS2,{fill:CP,fo:.55,stroke:CP,sw:2,rx:4})+rect(550,base-12*PS2,80,12*PS2,{fill:CP,fo:.55,stroke:CP,sw:2,rx:4});
  s+=label('𝐏 は 一定（12）',530,base-12*PS2-20,{size:26,color:CP,anchor:'middle',weight:700});
  s+=wrongCard('D','遅くなる','K が減っても 𝐏 は一定',{x:660,w:520,y:150,g:seg(p,.03,.1)});
  s+=fade(seg(p,b,b+.1),label('重心の 速さを 決めるのは 運動量の 合計',920,360,{size:24,color:CP,anchor:'middle',weight:700}));
  s+=goalTag(G3)+A3(1);
  return s;
 },

 // ===================== まとめ =====================
 // 19. 2本の直線の交点と、枠の図を並べる。右上に答えの札3枚
 [K+'sum']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=card(30,96,555,400,label('作用・反作用 → 運動量保存',307,140,{size:26,color:C.ink,anchor:'middle',weight:700})
   +ground(60,560,400)+blk(250,400,1)+blk(363,400,2)
   +`<rect x="161" y="${300}" width="276" height="112" rx="14" fill="${HI}" fill-opacity=".05" stroke="${HI}" stroke-width="3" stroke-dasharray="12 9"/>`
   +arrow(318,282,398,282,{color:CF,w:6,head:16})+arrow(312,282,232,282,{color:CF,w:6,head:16})+line(222,296,408,268,{color:HI,w:3.5})
   +label('内力は 打ち消し合う',307,215,{size:24,color:CF,anchor:'middle',weight:700})+LEG(140,470,1),seg(p,.03,.15),CP);
  const ox=700,oy=440,sx=80,sy=40;
  let r=label('2本の 式の 交点で 決まる',892,140,{size:26,color:C.ink,anchor:'middle',weight:700});
  r+=arrow(ox-6,oy,ox+380,oy,{color:CV,w:2.5,head:12})+arrow(ox,oy+6,ox,180,{color:CV,w:2.5,head:12});
  r+=label('v₁′',ox+386,oy+8,{size:24,color:CV,weight:700})+label('v₂′',ox+12,192,{size:24,color:CV,weight:700});
  r+=draw([[ox+sx*5/3,oy-sy*7],[ox+sx*4,oy]],1,{color:CP,w:4})+draw([[ox,oy-sy*2],[ox+sx*4,oy-sy*6]],1,{color:HI,w:4});
  r+=dot(ox+sx*2.5,oy-sy*4.5,9,HI)+ring(ox+sx*2.5,oy-sy*4.5,15,{color:HI,w:2})+label('(2.5, 4.5)',ox+sx*2.5+20,oy-sy*4.5+30,{size:24,color:HI,weight:700});
  r+=label('運動量',ox+sx*3.4,oy-sy*1.2,{size:22,color:CP,weight:700})+label('反発係数',ox+sx*0.4,oy-sy*2.7,{size:22,color:HI,weight:700});
  s+=card(615,96,555,400,r,seg(p,b,b+.12),HI);
  s+=answerRow([[1,'D',''],[2,'B','4.5 J'],[3,'B','']],{g:seg(p,.8,.9)});
  return s;
 },
};

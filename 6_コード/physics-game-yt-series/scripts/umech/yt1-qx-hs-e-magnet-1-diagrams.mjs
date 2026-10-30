// 問題編 解説「導線の真上の方位磁針は、どちらへ振れる？」(ys-qx-hs-e-magnet-1) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/403_磁場と電磁誘導.md の q-hs-e-magnet-1（解説 18 行）。
// 色（正本）：電流 I 緑（⊙⊗ は丸付き）、磁場 𝐁 橙、方位磁針の N 極 赤・S 極 灰、コイルの極 N 赤・S 青、強調 黄。
// 机の図（斜め上から）：東 x・北 y・上 z。北は画面の奥（上）、東は右。方位磁針は導線の真上（台の上）。
// 正面の図（南から北を見る）：右＝東、左＝西、電流は奥向き ⊗。⊗ のまわりは時計回り（一番上で右＝東、一番下で左＝西）。
// コイルの図（横から）：軸は左右。巻き線の前の半分を右半分に太く描く。前の側の電流は上向き ⇒ 右から見て時計回り。
//   断面（軸を含む面で切る）：上の導線 ⊗、下の導線 ⊙。内側の磁場は左向き → 左端が N。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 単元動画（yt1-hs-e-magnet-1）の部品（⊙⊗・磁場の円・方位磁針・右手）を読み込んで使う（そのファイルは編集しない）。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,clamp} from './anim.mjs';
import {outSym,inSym,fieldCircle,head,fieldEllipse,hand,wireV,BC,IC,CN,CS,NP,SP,T,vB,RAD} from './yt1-hs-e-magnet-1-diagrams.mjs';
import {QC,card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,legend,note,sentWin,voiceEnd,cueT} from './yt1-qx-common.mjs';

const K='qx-hs-e-magnet-1:';
const WH=C.ink,DIM=C.dim,HI=C.hi,SKIN='#e2b48f',EDGE='#8a5a3c';
const G1='N 極の振れる向き',G2='N 極になる端';
const A1=g=>answerTag(1,'A','東へ',{g}),A2=g=>answerTag(2,'C','左端が N',{g});
const LEG=(g=1)=>legend([['N 極 赤',CN],['S 極 灰',CS]],1030,470,{g});
const frame=(x,y,w,h,g=1)=>fade(g,rect(x,y,w,h,{fill:HI,fo:0,stroke:HI,sw:4,rx:10}));
const n2=v=>Number(v.toFixed(2));
// 読み（かな）の中で、その語が読まれる所（cue の進み 0〜1）。
const at=(ctx,sub,d=.5)=>{const r=(ctx?.cue?.reading??'').replace(/\s/g,''),i=r.indexOf(sub.replace(/\s/g,''));return i<0?d:i/Math.max(1,r.length)*voiceEnd(ctx);};
const win=(ctx,i,d=[0,1])=>sentWin(ctx)[i]??d;

// ---- 机の図（斜め上から）------------------------------------------------------------------------------
const DK={cx:420,cy:300,ky:.6,X:320,Y:200};
const P=(x,y,z=0)=>{const f=1-.15*y/DK.Y;return [DK.cx+x*f,DK.cy-DK.ky*y-z];};
const CP={y:-60,z:90,r:80};   // 方位磁針：導線（x＝0）の真上、台の上
// 方位磁針（水平な面の中で、北から東へ th 度）
function compassH(th,{hl=0,g=1}={}){
 const [cx,cy]=P(0,CP.y,CP.z),r=CP.r,ry=r*DK.ky;
 let s=`<ellipse cx="${cx}" cy="${n2(cy+7)}" rx="${r}" ry="${n2(ry)}" fill="#0f1828" stroke="${DIM}" stroke-width="2"/>`;
 s+=`<ellipse cx="${cx}" cy="${n2(cy)}" rx="${r}" ry="${n2(ry)}" fill="#172238" stroke="${hl>.5?HI:DIM}" stroke-width="${hl>.5?4:2.5}"/>`;
 const a=th*RAD,ux=Math.sin(a),uy=Math.cos(a),px=Math.cos(a),py=-Math.sin(a),L=r*.84,w=r*.17;
 const S=(ex,ny)=>`${n2(cx+ex)},${n2(cy-DK.ky*ny)}`;
 s+=`<polygon points="${S(L*ux,L*uy)} ${S(w*px,w*py)} ${S(-w*px,-w*py)}" fill="${CN}"/>`;
 s+=`<polygon points="${S(-L*ux,-L*uy)} ${S(w*px,w*py)} ${S(-w*px,-w*py)}" fill="${CS}"/>`;
 s+=dot(cx,cy,4,'#172238');
 return fade(g,s);
}
function desk({cur=1,th=0,hl=0,pt=0,g=1,labels=1,stand=1}={}){
 const {X,Y}=DK,c=[P(-X,-Y),P(X,-Y),P(X,Y),P(-X,Y)];
 let s=`<polygon points="${c[0][0]},${c[0][1]} ${c[1][0]},${c[1][1]} ${c[1][0]},${c[1][1]+20} ${c[0][0]},${c[0][1]+20}" fill="#3a2d22" stroke="#7a5c40" stroke-width="2"/>`;
 s+=`<polygon points="${c.map(q=>`${n2(q[0])},${n2(q[1])}`).join(' ')}" fill="#4a3a2b" stroke="#8a6a4a" stroke-width="2.5"/>`;
 // 導線（南北）
 const [wx1,wy1]=P(0,-Y+8),[wx2,wy2]=P(0,Y-8);
 s+=line(wx1,wy1,wx2,wy2,{color:'#b9c3d6',w:6});
 if(labels)s+=label('北',...P(0,Y).map((v,i)=>i?v-14:v),{size:26,color:WH,anchor:'middle',weight:700})
  +label('南',P(0,-Y)[0],P(0,-Y)[1]+54,{size:26,color:WH,anchor:'middle',weight:700})
  +label('西',P(-X,0)[0]-30,P(-X,0)[1]+9,{size:26,color:WH,anchor:'middle',weight:700})
  +label('東',P(X,0)[0]+30,P(X,0)[1]+9,{size:26,color:WH,anchor:'middle',weight:700});
 // 台（透明な支え）
 if(stand){const [bx,by]=P(0,CP.y,0),[tx,ty]=P(0,CP.y,CP.z);
  s+=`<ellipse cx="${n2(bx)}" cy="${n2(by)}" rx="26" ry="9" fill="#9fb4d6" fill-opacity=".25" stroke="#9fb4d6" stroke-width="1.5"/>`;
  s+=line(bx-14,by,tx-14,ty+20,{color:'#9fb4d6',w:2.5,opacity:.7})+line(bx+14,by,tx+14,ty+20,{color:'#9fb4d6',w:2.5,opacity:.7});}
 // 電流の矢印（北向き。方位磁針より南の部分）
 if(cur>0){const [ax1,ay1]=P(0,-196),[ax2,ay2]=P(0,-98);
  s+=fade(cur,arrow(ax1,ay1,ax2,ay2,{color:IC,w:7,head:20})+label('I',ax1+18,ay1-22,{size:30,color:IC,weight:700})
   +label('電流：北向き',ax1+44,ay1-4,{size:24,color:IC,weight:700}));}
 s+=compassH(th,{hl});
 const [cx,cy]=P(0,CP.y,CP.z);
 if(hl>0)s+=frame(cx-CP.r-14,cy-CP.r*DK.ky-14,2*CP.r+28,2*CP.r*DK.ky+40,hl);
 if(pt>0)s+=fade(pt,dot(cx,cy,9,HI)+label('真上の点',cx+CP.r+22,cy+8,{size:26,color:HI,weight:700}));
 return fade(g,s);
}
const EARTH=(g=1)=>card(800,104,380,104,label('地球の 磁場より、',990,146,{size:26,color:WH,anchor:'middle',weight:700})+label('電流の 磁場が 十分に 強い',990,186,{size:26,color:WH,anchor:'middle',weight:700}),g,C.faint);
// 目の印（視点）
function eye(x,y,g=1){
 return fade(g,`<ellipse cx="${x}" cy="${y}" rx="22" ry="12" fill="#e8eef8" stroke="${WH}" stroke-width="2"/>`+dot(x,y,6,'#223'));
}

// ---- 正面の図（南から北を見る）-------------------------------------------------------------------------
const FV={x:420,y:300,R:140};
function front({circ=0,top=0,bot=0,east=0,g=1,x=FV.x,y=FV.y,R=FV.R,title=1,dir=1,circHi=0}={}){
 let s='';
 if(title)s+=label('南から 見た図',60,112,{size:24,color:DIM,weight:700});
 s+=label('西',x-R-110,y+10,{size:30,color:WH,anchor:'middle',weight:700});
 s+=label('東',x+R+110,y+10,{size:east>.5?36:30,color:east>.5?HI:WH,anchor:'middle',weight:700});
 if(east>0)s+=frame(x+R+84,y-26,52,48,east);
 if(circ>0)s+=fieldCircle(x,y,R,-1,{g:circ,nh:4,phase:45,w:circHi>.5?5:3.5,L:20});
 s+=inSym(x,y,24,IC)+label('I',x+30,y-22,{size:28,color:IC,weight:700});
 if(dir&&!top)s+=fade(dir,label('上',x,y-R-48,{size:22,color:DIM,anchor:'middle'}));
 // 一番上：方位磁針（横から見て平ら）と、右向きの磁場
 if(top>0){
  s+=fade(top,`<ellipse cx="${x}" cy="${y-R}" rx="36" ry="9" fill="#172238" stroke="${DIM}" stroke-width="2.5"/>`+dot(x,y-R,5,CN)+label('方位磁針',x-90,y-R+34,{size:24,color:DIM,anchor:'end',weight:700}));
 }
 if(bot>0){
  s+=fade(bot,dot(x,y+R,9,HI)+arrow(x+60,y+R,x-70,y+R,{color:BC,w:8,head:24})+label('真下の点：左（西）向き',x+80,y+R+10,{size:24,color:BC,weight:700}));
 }
 return fade(g,s);
}
const topArrow=(g=1,x=FV.x,y=FV.y,R=FV.R)=>fade(g,arrow(x-62,y-R-28,x+74,y-R-28,{color:BC,w:8,head:24})+T(vB,x+100,y-R-18,{size:32,anchor:'start'})+frame(x-80,y-R-56,180,58,1));

// ---- 右手の約束（単元動画の右手）-----------------------------------------------------------------------
function lawPanel({hd=1,curl=1,ring=1,g=1}={}){
 let s=wireV(330,{top:96,bot:480,ay:[250,116],text:false})+label('I（北向き）',354,140,{size:26,color:IC,weight:700});
 s+=hand(330,{g:hd,fingers:curl});
 s+=fieldEllipse(330,412,112,30,{g:ring,sense:1});
 return fade(g,s);
}

// ---- コイル（横から。軸は左右）--------------------------------------------------------------------------
const CO={x0:250,x1:550,cy:300,ry:110,turns:7,rx:26};
function ellArc(cx,cy,rx,ry,a0,a1,n=36){return Array.from({length:n+1},(_,i)=>{const a=(a0+(a1-a0)*i/n)*RAD;return [cx+rx*Math.cos(a),cy+ry*Math.sin(a)];});}
function coil({g=1,field=0,poles=0,lab=1,dim=1}={}){
 const {x0,x1,cy,ry,turns,rx}=CO,dx=(x1-x0)/(turns-1);
 let s='';
 for(let i=0;i<turns;i++)s+=draw(ellArc(x0+i*dx,cy,rx,ry,90,270),1,{color:IC,w:4,opacity:.4});
 if(field>0){
  let f='';
  for(const d of [-55,0,55])f+=arrow(x1+50,cy+d,x0-60,cy+d,{color:BC,w:d===0?8:5,head:22});
  const mid=(x0+x1)/2,half=(x1-x0)/2;
  for(const sg of [-1,1]){const pts=[];for(let i=0;i<=40;i++){const a=Math.PI*i/40;pts.push([mid+(half+80)*Math.cos(a),cy+sg*(ry+20+55*Math.sin(a))]);}
   f+=draw(pts,1,{color:BC,w:3.5,opacity:.85});const k=20;f+=head(pts[k][0],pts[k][1],pts[k-2][0]-pts[k][0],pts[k-2][1]-pts[k][1],{color:BC,L:18});}
  s+=fade(field,f);
 }
 for(let i=0;i<turns;i++)s+=draw(ellArc(x0+i*dx,cy,rx,ry,-90,90),1,{color:IC,w:5});
 // 導線の端（電源へ）
 s+=line(x0,cy+ry,x0,cy+ry+40,{color:IC,w:4,opacity:.7})+line(x1,cy+ry,x1,cy+ry+40,{color:IC,w:4,opacity:.7});
 if(lab)s+=label('コイル（軸は 左右）',(x0+x1)/2,cy+ry+76,{size:24,color:DIM,anchor:'middle',weight:700});
 if(poles>0)s+=fade(poles,label('N',x0-120,cy+16,{size:48,color:NP,anchor:'middle',weight:700})+label('S',x1+120,cy+16,{size:48,color:SP,anchor:'middle',weight:700}));
 return fade(g*dim,s);
}
const viewArrow=(g=1)=>fade(g,arrow(740,300,640,300,{color:DIM,w:4,head:16})+eye(770,300)+label('右から 見る',700,262,{size:22,color:DIM,anchor:'middle',weight:700}));
// 右から見た小窓：時計回りの緑の電流
const WN={x:820,y:96,w:340,h:340,cx:990,cy:290,r:100};
function rightWin({g=1,arr=1,hl=0,hd=0,thumb=0}={}){
 const {x,y,w,h,cx,cy,r}=WN;
 let s=card(x,y,w,h,'',1,C.faint)+label('右から 見た図',cx,y+36,{size:24,color:WH,anchor:'middle',weight:700});
 s+=ring(cx,cy,r,{color:IC,w:5});
 if(arr>0)s+=fieldCircle(cx,cy,r,-1,{g:arr,color:IC,w:5,nh:4,phase:45,L:24})+fade(arr,label('I',cx+r*.78+10,cy-r*.78-6,{size:28,color:IC,weight:700}));
 if(hd>0){
  // 4本の指：時計回りに曲がる（120° から −150° へ）
  const R=58,a0=120,a1=a0-270*clamp(hd),pts=[];for(let i=0;i<=40;i++){const t=(a0+(a1-a0)*i/40)*RAD;pts.push([cx+R*Math.cos(t),cy-R*Math.sin(t)]);}
  s+=draw(pts,1,{color:EDGE,w:26})+draw(pts,1,{color:SKIN,w:21});
  if(hd>.05){const t=a1*RAD;s+=head(cx+R*Math.cos(t),cy-R*Math.sin(t),Math.sin(t),Math.cos(t),{color:SKIN,L:24});}
  s+=label('4本の 指',x+16,y+70,{size:22,color:SKIN,anchor:'start',weight:700});
 }
 if(thumb>0)s+=fade(thumb,inSym(cx,cy,22,SKIN)+label('親指：奥向き',cx,y+h-18,{size:22,color:SKIN,anchor:'middle',weight:700}));
 if(hl>0)s+=frame(x-8,y-8,w+16,h+16,hl);
 return fade(g,s);
}

// ---- 断面（軸を含む面で切る）---------------------------------------------------------------------------
function crossSec({g=1,x=420,yt=180,yb=420,R=70,circ=1,ins=0,lab=1,title=1,size=24,insLab=1}={}){
 let s='';
 if(title)s+=label('コイルを 軸に 沿って 切った 断面',560,492,{size:24,color:DIM,weight:700});
 s+=line(x-170,yt,x+170,yt,{color:IC,w:2,dash:'6 8',opacity:.35})+line(x-170,yb,x+170,yb,{color:IC,w:2,dash:'6 8',opacity:.35});
 s+=fieldCircle(x,yt,R,-1,{g:circ,nh:4,phase:0,w:3.5,L:18})+fieldCircle(x,yb,R,1,{g:circ,nh:4,phase:0,w:3.5,L:18});
 s+=inSym(x,yt,size)+outSym(x,yb,size);
 if(lab)s+=label('上の 導線：奥向き',x+R+40,yt+9,{size:24,color:IC,weight:700})+label('下の 導線：手前向き',x+R+40,yb+9,{size:24,color:IC,weight:700});
 if(ins>0){const ym1=yt+R,ym2=yb-R;
  s+=fade(ins,arrow(x+56,ym1,x-56,ym1,{color:BC,w:8,head:22})+arrow(x+56,ym2,x-56,ym2,{color:BC,w:8,head:22})+frame(x-80,ym1-30,160,ym2-ym1+60,1)
   +fade(insLab,label('内側：どちらも 左向き',x-100,(ym1+ym2)/2+9,{size:24,color:HI,anchor:'end',weight:700})));}
 return fade(g,s);
}

export const qxHsEMagnet1Diagrams={
 // ================= 問題アニメ：出題中（小問1）4 秒＋静止 =================
 // 0〜2 秒：机・導線・方位磁針・方位の文字。2〜4 秒：北向きの緑の電流の矢印、「電流の磁場が十分に強い」の札。針は動かさない。
 [K+'q1']:(p)=>{
  let s=desk({g:seg(p,0,.45),cur:seg(p,.5,.72)});
  s+=EARTH(seg(p,.72,.92))+LEG(seg(p,0,.45));
  return s;
 },
 // ================= 問題アニメ：小問2 3 秒＋静止 =================
 // 暗転から、軸を左右に向けたコイル（横から）、右から見た小窓、時計回りの緑の電流。磁場・極の文字は描かない。
 [K+'q2']:(p)=>{
  let s=coil({g:seg(p,0,.35)});
  s+=viewArrow(seg(p,.35,.55));
  s+=rightWin({g:seg(p,.35,.55),arr:seg(p,.6,.9)});
  return s;
 },
 // ================= S1 小問1：真上の方位磁針 =================
 // 1. 出題中の机の図＋求めるもの。「真上」の語で方位磁針を黄の枠で囲む
 [K+'goal1']:(p,ctx)=>{
  const a=at(ctx,'まうえ',.4),hl=seg(p,a,a+.06);
  return desk({hl})+EARTH()+LEG()+goalTag(G1,{g:seg(p,.02,.12)});
 },
 // 2. 「針の N 極＝磁場の向き」の札 → 2文目で真上の点に黄の印
 [K+'point']:(p,ctx)=>{
  const [a]=win(ctx,1,[.5,1]);
  let s=desk({pt:seg(p,a,a+.08)})+LEG();
  s+=card(800,104,380,104,label('針の N 極',990,146,{size:28,color:CN,anchor:'middle',weight:700})+label('＝ 磁場の 向き',990,188,{size:28,color:BC,anchor:'middle',weight:700}),seg(p,.03,.12),HI);
  return s+goalTag(G1);
 },
 // 3. 法則：右手の親指を北向きの電流に合わせ、指の曲がる向きに橙の円い矢印
 [K+'law']:(p,ctx)=>{
  const [a]=win(ctx,1,[.5,1]);
  let s=lawPanel({hd:seg(p,a,a+.08),curl:seg(p,a+.12,a+.25),ring:seg(p,.12,.25)});
  s+=kindTag('法則',880,130,{g:seg(p,.02,.1)});
  s+=card(620,180,520,92,label('導線を 中心に 回る 円い 磁場',880,236,{size:28,color:BC,anchor:'middle',weight:700}),seg(p,.05,.14),BC);
  s+=card(620,300,520,140,label('親指 ＝ 電流の 向き',880,355,{size:28,color:IC,anchor:'middle',weight:700})+label('指の 曲がる 向き ＝ 磁場',880,405,{size:28,color:BC,anchor:'middle',weight:700}),seg(p,a+.05,a+.14),C.faint);
  return s+goalTag(G1);
 },
 // 4. 視点を南側に回す（目の印）→ 2文目で正面の図：⊗（緑）、左右に「西」「東」
 [K+'south']:(p,ctx)=>{
  const [a]=win(ctx,1,[.45,1]),out=seg(p,a-.04,a+.02);
  let s=fade(1-out,desk()+fade(seg(p,.05,.15),eye(560,476)+arrow(540,468,445,430,{color:HI,w:4,head:14})+label('南から 見る',590,484,{size:24,color:HI,weight:700})));
  s+=front({g:seg(p,a,a+.06),circ:0});
  s+=card(800,180,370,104,label('北向きの 電流',985,222,{size:26,color:IC,anchor:'middle',weight:700})+label('＝ 奥向き（⊗）',985,262,{size:26,color:IC,anchor:'middle',weight:700}),seg(p,a+.2,a+.3),IC);
  return s+goalTag(G1);
 },
 // 5. ⊗ のまわりに時計回りの橙の円
 [K+'cw']:(p)=>{
  let s=front({circ:seg(p,.15,.45)});
  s+=fade(seg(p,.45,.6),label('時計回り',FV.x+FV.R+40,FV.y+FV.R-10,{size:30,color:BC,weight:700}));
  return s+goalTag(G1);
 },
 // 6. 円の一番上に方位磁針 → 2文目で右向きの橙の矢印を黄の枠で囲み、「東」を光らせる
 [K+'top']:(p,ctx)=>{
  const [a]=win(ctx,1,[.4,1]),e=at(ctx,'ひがしむき',.85);
  let s=front({circ:1,top:seg(p,.04,.14),east:seg(p,e,e+.06)});
  s+=topArrow(seg(p,a+.1,a+.2));
  return s+goalTag(G1);
 },
 // 7. 机の図に戻り、針が北から東へ振れる。答えの札
 [K+'ans1']:(p,ctx)=>{
  const [a,b]=win(ctx,0,[0,.5]),an=at(ctx,'エーです',.9);
  let s=desk({th:80*seg(p,.08,Math.max(.2,b*.9))});
  s+=fade(seg(p,b*.8,b),label('北 → 東へ 振れる',800,250,{size:30,color:HI,weight:700}));
  s+=EARTH()+LEG();
  return s+goalTag(G1)+A1(seg(p,an,an+.06));
 },
 // 8. 正面の図に戻り、円の一番下の点に左向きの矢印。誤答 B
 [K+'wrongB']:(p,ctx)=>{
  const [a]=win(ctx,1,[.5,1]);
  let s=front({circ:1,bot:seg(p,a,a+.08)});
  s+=wrongCard('B','西へ','それは 真下の 場合',{x:780,w:400,y:200,g:seg(p,.03,.1)});
  return s+goalTag(G1)+A1(1);
 },
 // 9. 誤答 C → 誤答 D（1枚ずつ）。2文目で円い磁場を強める
 [K+'wrongCD']:(p,ctx)=>{
  const [a]=win(ctx,1,[.5,1]);
  let s=front({circ:1,circHi:seg(p,a,a+.05)});
  s+=fade(seg(p,a,a+.08),label('導線の まわりを 回る',FV.x+FV.R+30,FV.y+FV.R+30,{size:26,color:BC,weight:700}));
  s+=wrongSeq(p,ctx,[['C','振れない','磁場は 導線の まわりを 回る'],['D','南を 向く','磁場は 導線の まわりを 回る']],{opts:{x:780,w:400,y:160}});
  return s+goalTag(G1)+A1(1);
 },
 // ================= S2 小問2：コイルの極 =================
 // 10. 暗転してコイルの図（小問2 の図と同じ）
 [K+'goal2']:(p)=>coil()+viewArrow()+rightWin()+goalTag(G2,{g:seg(p,.03,.14)}),
 // 11. 「右から見て」の語で小窓を黄の枠で囲む
 [K+'view']:(p)=>coil()+viewArrow()+rightWin({hl:seg(p,.02,.1)})+goalTag(G2),
 // 12. 右手を小窓に重ね、指を時計回りに → 親指は奥（コイルの図では左）
 [K+'hand2']:(p,ctx)=>{
  const o=at(ctx,'おやゆびは',.5),b=at(ctx,'おくむき',.8);
  let s=coil()+rightWin({hd:lin(p,.06,Math.max(.1,o-.02)),thumb:seg(p,o,o+.06)});
  s+=fade(seg(p,b,b+.08),arrow(640,170,240,170,{color:SKIN,w:9,head:26})+label('親指の 向き（左）',440,150,{size:24,color:SKIN,anchor:'middle',weight:700}));
  return s+goalTag(G2);
 },
 // 13. コイルの中に、左向きの太い橙の矢印
 [K+'inside']:(p)=>{
  const u=seg(p,.35,.7);
  let s=coil()+rightWin({hd:1,thumb:1,g:.6});
  s+=fade(1-seg(p,.1,.3),arrow(640,170,240,170,{color:SKIN,w:9,head:26}));
  s+=fade(u,arrow(600,CO.cy,600-400*u,CO.cy,{color:BC,w:14,head:34}));
  s+=fade(seg(p,.6,.75),T(vB,230,CO.cy-40,{size:40})+label('内側：左向き',400,170,{size:28,color:BC,anchor:'middle',weight:700}));
  return s+goalTag(G2);
 },
 // 14. 断面：上に ⊗ と時計回り、下に ⊙ と反時計回り。内側の2本の左向きの矢印を黄の枠で囲む
 [K+'cross']:(p,ctx)=>{
  const [a]=win(ctx,1,[.35,1]),i=at(ctx,'うちがわでは',.7);
  let s=crossSec({circ:seg(p,a+.05,a+.25),ins:seg(p,i,i+.08)});
  return s+goalTag(G2);
 },
 // 15. 左端から磁力線が出ていく。左端に「N」、右端に「S」。答えの札
 [K+'ans2']:(p,ctx)=>{
  const [a,b]=win(ctx,0,[0,.5]),an=at(ctx,'スィーです',.9);
  let s=coil({field:seg(p,.05,.3),poles:seg(p,.3,.45),lab:0});
  return s+goalTag(G2)+A2(seg(p,an,an+.06));
 },
 // 16. 誤答 A（右端が N）
 [K+'wrongA2']:(p)=>{
  let s=coil({field:1,poles:1,dim:.55,lab:0});
  s+=wrongCard('A','右端が N','親指を 逆に 向けた',{x:780,w:400,y:160,g:seg(p,.03,.1)});
  return s+goalTag(G2)+A2(1);
 },
 // 17. 誤答 B → 誤答 D（1枚ずつ。「D は」で切り替える）
 [K+'wrongBD2']:(p,ctx)=>{
  const d=at(ctx,'ディーは',.4);
  let s=coil({field:1,poles:1,dim:.55,lab:0});
  s+=wrongSeq(p,ctx,[['B','両端とも N','磁場は 一方の 端から 出る'],['D','極は できない','内側は 強め合う']],{win:[[0,d],[d,1]],opts:{x:780,w:400,y:160}});
  return s+goalTag(G2)+A2(1);
 },
 // ================= S3 まとめ =================
 // 18. 2026-10-16（PQ-043）：1文目で直線の電流（⊗ と時計回りの円。親指＝電流、指の曲がる向き＝磁場）、
 //     2文目でコイルの断面（内側が左向き。4本の指＝電流、親指＝内側の磁場）を順に出す。声の後に答えの札
 [K+'sum']:(p,ctx)=>{
  const ve=voiceEnd(ctx),r=1-ve,W=sentWin(ctx),b=(W[1]??[.5,1])[0];
  const g1=seg(p,.03,.12),g2=seg(p,b,b+.08);
  let s=fade(g1,front({x:270,y:270,R:105,circ:1,top:1,title:0,dir:0})+topArrow(1,270,270,105)
   +label('直線の 電流：親指 → 電流',300,440,{size:28,color:IC,anchor:'middle',weight:700})+label('指の 曲がる 向き → 磁場',300,484,{size:28,color:BC,anchor:'middle',weight:700}));
  s+=fade(g1,line(600,110,600,500,{color:C.faint,w:2}));
  s+=fade(g2,crossSec({x:880,yt:165,yb:335,R:48,circ:1,ins:1,lab:0,title:0,size:20,insLab:0})
   +label('コイル：4本の 指 → 電流',900,440,{size:28,color:IC,anchor:'middle',weight:700})+label('親指 → 内側の 磁場',900,484,{size:28,color:BC,anchor:'middle',weight:700}));
 s+=answerRow([[1,'A','東へ'],[2,'C','左端が N']],{g:seg(p,ve+.1*r,ve+.25*r)});
  return s;
 },
};

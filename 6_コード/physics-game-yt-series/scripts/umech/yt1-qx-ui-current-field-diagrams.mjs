// 問題編 解説「奥向きの電流と、時計回りの輪」（q-ui-current-field、大学編 26 アンペールの法則・初級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/26_アンペールの法則.md の q-ui-current-field（解説 19 行）。
// 色（初級の単元動画 yt1-ui-current-field-1 に合わせる）：電流 I 青、磁場 𝐁 橙、N 極 赤・S 極 灰、強調 黄、誤り 赤。
//   電流が共通の約束（緑）と違うので、全場面の右下に凡例「電流 I＝青／磁場 𝐁＝橙／N 極＝赤」を出す。
// 向き：⊙＝画面の手前向き、⊗＝奥向き。⊗ の電流 → 𝐁 は画面上で時計回り。
// 方位磁針・右手・コイルの描き方は 初級の単元動画（yt1-ui-current-field-1-diagrams.mjs）のヘルパーを写して使う（あちらは編集しない）。
// 札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,legend,note,textW,sentWin,cueT,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-ui-current-field:';
const CB=C.E,CI='#6f9dff',CN='#ff6b6b',CS='#c9d3e3',BAD='#ff6b6b';
const RAD=Math.PI/180;
const n2=v=>Number(v.toFixed(2));
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const G1='真上の N 極の向き',G2='中心の磁場の向き',G3='1 m あたりの巻数 n';
const A1=g=>answerTag(1,'A','右向き',{g}),A2=g=>answerTag(2,'B','奥向き ⊗',{g}),A3=g=>answerTag(3,'C','240 /m',{g});

// ---- 凡例（右下に常に出す）--------------------------------------------------------------------------
const LEGI=[['電流 I＝青',CI],['磁場 𝐁＝橙',CB],['N 極＝赤',CN]],LS=22,LG=14;
const LW=LEGI.reduce((a,[t])=>a+LS*1.3+textW(t,LS)+LG*2,-LG*2),LX=1190-LW,LY=503;
function LEG(hl=0){
 let s=legend(LEGI,LX,LY,{dir:'row',size:LS,gap:LG});
 if(hl>0)s+=fade(hl,rect(LX-8,LY-LS-6,LS*1.3+textW(LEGI[0][0],LS)+16,LS+16,{fill:C.hi,fo:.15,stroke:C.hi,sw:3,rx:8}));
 return s;
}

// ---- 記号（単元動画から写す）--------------------------------------------------------------------------
function outSym(x,y,r=20,color=CI,g=1,w=4){return fade(g,ring(x,y,r,{color,w,fill:'#101a30'})+dot(x,y,r*.3,color));}
function inSym(x,y,r=20,color=CI,g=1,w=4){const d=r*.6;return fade(g,ring(x,y,r,{color,w,fill:'#101a30'})+line(x-d,y-d,x+d,y+d,{color,w})+line(x-d,y+d,x+d,y-d,{color,w}));}
function head(x,y,dx,dy,{color=CB,L=18}={}){
 const m=Math.hypot(dx,dy)||1,ux=dx/m,uy=dy/m,bx=x-L*ux,by=y-L*uy;
 return `<polygon points="${n2(x)},${n2(y)} ${n2(bx-L*.5*uy)},${n2(by+L*.5*ux)} ${n2(bx+L*.5*uy)},${n2(by-L*.5*ux)}" fill="${color}"/>`;
}
// 円と矢じり。sense +1＝画面上で反時計回り、−1＝時計回り。
function circ(cx,cy,R,sense,{g=1,color=CB,w=3.5,nh=4,phase=45,L=18,dash=''}={}){
 if(g<=0)return '';
 let s=ring(cx,cy,R,{color,w,dash});
 for(let i=0;i<nh;i++){const t=(phase+360*i/nh)*RAD;const x=cx+R*Math.cos(t),y=cy-R*Math.sin(t);s+=head(x,y,-Math.sin(t)*sense,-Math.cos(t)*sense,{color,L});}
 return fade(g,s);
}
// 方位磁針：a（ラジアン、0＝右、π/2＝上）は N 極の向き。needle=0 なら針なし（灰色の丸だけ）。
function compass(x,y,a,{r=24,g=1,hl=0,needle=1}={}){
 const ux=Math.cos(a),uy=-Math.sin(a),px=-uy,py=ux,L=r*.86,wd=r*.3;
 let s=ring(x,y,r,{color:hl?C.hi:C.dim,w:hl?4:2.5,fill:'#172238'});
 if(needle){
  s+=`<polygon points="${n2(x+L*ux)},${n2(y+L*uy)} ${n2(x+wd*px)},${n2(y+wd*py)} ${n2(x-wd*px)},${n2(y-wd*py)}" fill="${CN}"/>`;
  s+=`<polygon points="${n2(x-L*ux)},${n2(y-L*uy)} ${n2(x+wd*px)},${n2(y+wd*py)} ${n2(x-wd*px)},${n2(y-wd*py)}" fill="${CS}"/>`;
  s+=dot(x,y,3,'#172238');
 }
 return fade(g,s);
}
const angLerp=(a,b,u)=>{let d=((b-a)%(2*Math.PI)+3*Math.PI)%(2*Math.PI)-Math.PI;return a+d*u;};
const NORTH=Math.PI/2;

// ===================== 小問1 の図：⊗ の導線と、まわりの磁針 =====================
const W1={x:330,y:300},R1=150,CANG=[0,45,90,135,180,225,270,315];
// turn：0＝全部北、1＝時計回りの接線。top＝真上の磁針だけ出す（針なし）
function compassRing({turn=0,g=1,hlTop=0,others=1}={}){
 let s='';
 CANG.forEach(d=>{const t=d*RAD,x=W1.x+R1*Math.cos(t),y=W1.y-R1*Math.sin(t);
  const a=angLerp(NORTH,t-Math.PI/2,turn);
  if(d===90)s+=compass(x,y,a,{hl:0});else s+=fade(others,compass(x,y,a));});
 if(hlTop>0)s+=fade(hlTop,ring(W1.x,W1.y-R1,40,{color:C.hi,w:4}));
 return fade(g,s);
}
const wire1=(g=1)=>fade(g,inSym(W1.x,W1.y,24,CI)+label('I',W1.x+34,W1.y-26,{size:30,color:CI,weight:700}));
// 円（橙の破線）と時計回りの矢じり
const fieldCirc=(g=1)=>circ(W1.x,W1.y,R1,-1,{g,dash:'10 8',nh:4,phase:22.5,w:3});
// 拡大した真上の磁針（右の空き）
function bigCompass(g=1,a=0){
 const x=880,y=290,r=95;
 let s=ring(x,y,r+16,{color:C.hi,w:3,dash:'6 6'})+compass(x,y,a,{r});
 s+=label('真上の 磁針（拡大）',x,y-r-34,{size:24,color:C.dim,anchor:'middle'});
 return fade(g,s);
}

// ---- 右手（正面から見た図：親指は奥、指は時計回りに曲がる）----
function fist(cx,cy,{g=1}={}){
 const skin='#e2b48f',edge='#8a5a3c',R=62;
 const arc=(a0,a1,r)=>Array.from({length:31},(_,i)=>{const a=(a0+(a1-a0)*i/30)*RAD;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});
 let s='';
 // 手のひら（左下から）
 s+=rect(cx-150,cy+10,92,64,{fill:skin,fo:1,stroke:edge,sw:2.5,rx:26});
 // 曲げた指（時計回り：左 → 上 → 右 → 下）
 s+=draw(arc(200,-70,R),1,{color:edge,w:44})+draw(arc(200,-70,R),1,{color:skin,w:38});
 for(const r of [R-9.5,R,R+9.5])s+=draw(arc(185,-62,r),1,{color:edge,w:1.4,opacity:.55});
 const [tx,ty]=arc(-70,-70,R)[0];s+=dot(tx,ty,19,skin)+ring(tx,ty,19,{color:edge,w:2});
 // 親指（奥向き：付け根の丸に ⊗）
 s+=ring(cx,cy,34,{color:edge,w:3,fill:skin})+inSym(cx,cy,22,CI);
 return fade(g,s);
}
// 曲げた指に沿う時計回りの弧の矢印（橙）
function curlArrow(cx,cy,g=1,R=112){
 const pts=Array.from({length:41},(_,i)=>{const a=(160-200*i/40)*RAD;return [cx+R*Math.cos(a),cy-R*Math.sin(a)];});
 const e=pts[40],f=pts[38];
 return fade(g,draw(pts.slice(0,g>=1?41:Math.max(2,Math.round(41*g))),1,{color:CB,w:5})+(g>=.99?head(e[0],e[1],e[0]-f[0],e[1]-f[1],{color:CB,L:22}):''));
}

// ===================== 小問2 の図：時計回りの輪 =====================
const L2={x:330,y:290,R:150};
const PIECES=[{c:0,name:'右'},{c:90,name:'上'},{c:180,name:'左'},{c:270,name:'下'}];
function arcPts(c,half=40,R=L2.R){return Array.from({length:25},(_,i)=>{const a=(c+half-2*half*i/24)*RAD;return [L2.x+R*Math.cos(a),L2.y-R*Math.sin(a)];});}
function loop2({g=1,hl=[0,0,0,0],ticks=0,names=0,curArr=[0,0,0,0],dimOthers=0}={}){
 let s=ring(L2.x,L2.y,L2.R,{color:CI,w:6});
 for(const d of [45,135,225,315]){const t=d*RAD;s+=head(L2.x+L2.R*Math.cos(t),L2.y-L2.R*Math.sin(t),Math.sin(t),Math.cos(t),{color:CI,L:22});}
 PIECES.forEach((q,i)=>{if(hl[i]>0)s+=fade(hl[i],draw(arcPts(q.c),1,{color:C.hi,w:16,opacity:.55}));});
 if(ticks>0)for(const d of [45,135,225,315]){const t=d*RAD;s+=fade(ticks,line(L2.x+(L2.R-22)*Math.cos(t),L2.y-(L2.R-22)*Math.sin(t),L2.x+(L2.R+22)*Math.cos(t),L2.y-(L2.R+22)*Math.sin(t),{color:C.ink,w:4}));}
 if(names>0)PIECES.forEach(q=>{const t=q.c*RAD,r=L2.R+44;s+=fade(names,label(q.name,L2.x+r*Math.cos(t),L2.y-r*Math.sin(t)+9,{size:28,color:C.ink,anchor:'middle',weight:700}));});
 // 各部分の電流の向きを大きな矢印で（時計回り：右 下向き、上 右向き、左 上向き、下 左向き）
 PIECES.forEach((q,i)=>{if(curArr[i]<=0)return;const t=q.c*RAD,x=L2.x+L2.R*Math.cos(t),y=L2.y-L2.R*Math.sin(t),dx=Math.sin(t),dy=Math.cos(t);
  s+=fade(curArr[i],arrow(x-dx*55,y-dy*55,x+dx*55,y+dy*55,{color:CI,w:9,head:24}));});
 s+=label('I',L2.x+L2.R*.72+18,L2.y-L2.R*.72-14,{size:30,color:CI,weight:700});
 s+=ring(L2.x,L2.y,16,{color:C.dim,w:2.5});
 return fade(g,s);
}
// 中心の ⊗（橙）：k 個重なると太く大きくなる
function centerIn(k,g=1){if(k<=0||g<=0)return '';const kk=Math.min(4,k);return inSym(L2.x,L2.y,18+4*kk,CB,g,3+1.5*kk);}
// 右手（単元動画の hand を写し、180° 回して親指を下に向ける）
function ellArc(cx,cy,rx,ry,a0,a1,n=40){return Array.from({length:n+1},(_,i)=>{const a=(a0+(a1-a0)*i/n)*RAD;return [cx+rx*Math.cos(a),cy+ry*Math.sin(a)];});}
function handDown(hx,hy,g=1){
 const skin='#e2b48f',edge='#8a5a3c',dy=hy-290;
 let s='';
 s+=rect(hx-92,212+dy,70,150,{fill:skin,fo:1,stroke:edge,sw:2.5,rx:26});
 for(let i=0;i<4;i++){const y=236+i*32+dy;
  s+=draw(ellArc(hx,y,62,17,160,20,30),1,{color:edge,w:27})+draw(ellArc(hx,y,62,17,160,20,30),1,{color:skin,w:22});
  const [tx,ty]=ellArc(hx,y,62,17,20,20,1)[0];s+=dot(tx,ty,11,skin);}
 s+=draw([[hx-40,228+dy],[hx-22,170+dy],[hx-14,138+dy]],1,{color:edge,w:30})+draw([[hx-40,228+dy],[hx-22,170+dy],[hx-14,138+dy]],1,{color:skin,w:25});
 return fade(g,`<g transform="rotate(180 ${hx} ${hy})">${s}</g>`);
}
// 右の枠：下向きの導線を右手で握る図
function handPanel(g=1,gIn=0){
 const x0=650,y0=95,w=530,h=365,hx=950,hy=280;
 let s=card(x0,y0,w,h,'',1,C.faint);
 s+=line(hx,y0+80,hx,y0+h-20,{color:CI,w:7})+arrow(hx,hy-40,hx,hy+170,{color:CI,w:7,head:24});
 s+=handDown(hx,hy);
 s+=label('親指：下（電流の 向き）',x0+w/2,y0+48,{size:26,color:CI,anchor:'middle',weight:700});
 s+=fade(gIn,inSym(745,hy,24,CB)+label('中心の 側：奥',745,hy+64,{size:24,color:CB,anchor:'middle',weight:700}));
 return fade(g,s);
}

// ===================== 小問3 の図：コイル =====================
const CO={x0:150,len:900,y:210,h:90,turns:75};   // 2.5 m → 900 px（1 m＝360 px）
const PXM=CO.len/2.5;
function coil(x0,len,turns,y,{h=70,g=1,w=1.8,color=CI}={}){
 let s=rect(x0,y-h/2,len,h,{fill:'#24324e',fo:.7,stroke:C.faint,sw:1.5,rx:8});
 let d='';const dx=len/turns;
 for(let i=0;i<turns;i++){const x=x0+dx*(i+.5);d+=`M${n2(x-dx*.3)} ${n2(y+h/2)} L${n2(x+dx*.3)} ${n2(y-h/2)} `;}
 s+=`<path d="${d}" stroke="${color}" stroke-width="${w}" fill="none"/>`;
 return fade(g,s);
}
function ruler(x0,len,y,text,{g=1,color=C.dim,size=26}={}){
 return fade(g,line(x0,y,x0+len,y,{color,w:2.5})+line(x0,y-10,x0,y+10,{color,w:2.5})+line(x0+len,y-10,x0+len,y+10,{color,w:2.5})+label(text,x0+len/2,y+34,{size,color,anchor:'middle',weight:700}));
}
function coilScene({g=1,ruler0=1,metres=0,last=0,count=0,lab=1}={}){
 let s=coil(CO.x0,CO.len,CO.turns,CO.y,{h:CO.h});
 s+=fade(lab,label('600 巻',CO.x0,CO.y-CO.h/2-20,{size:30,color:CI,weight:700}));
 s+=note('巻き線は 省略して 描いています',CO.x0+CO.len,CO.y-CO.h/2-20,{anchor:'end'});
 s+=fade(ruler0,ruler(CO.x0,CO.len,CO.y+CO.h/2+30,'2.5 m'));
 if(metres>0){
  for(const k of [1,2])s+=fade(metres,line(CO.x0+k*PXM,CO.y-CO.h/2-12,CO.x0+k*PXM,CO.y+CO.h/2+12,{color:C.ink,w:4}));
  for(const k of [0,1])s+=fade(metres*(1-ruler0),label('1 m',CO.x0+(k+.5)*PXM,CO.y+CO.h/2+40,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(metres*(1-ruler0),label('0.5 m',CO.x0+2.25*PXM,CO.y+CO.h/2+40,{size:26,color:C.dim,anchor:'middle',weight:700}));
 }
 if(last>0)s+=fade(last,rect(CO.x0+2*PXM,CO.y-CO.h/2,.5*PXM,CO.h,{fill:C.bg,fo:.55,stroke:'none',rx:0}));
 if(count>0)for(const k of [0,1])s+=fade(count,label('240 巻',CO.x0+(k+.5)*PXM,CO.y+8,{size:30,color:C.hi,anchor:'middle',weight:700}));
 return fade(g,s);
}
const NN=`{\\color{${C.hi}}n}=\\dfrac{N}{L}`;

// 誤答カードの置き場所（右の空き／コイルの下）
const WR={x:610,w:570,size:26,whySize:22};
const WC={x:150,w:900,size:28,whySize:24,y:330};

export const ytQxUiCurrentFieldDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（約6秒）：0〜2 s 前半（⊗ の導線と、針のない磁針）、2〜4 s 中盤（時計回りの輪。矢印が一周）、4〜6 s 後半（600 巻・2.5 m のコイル）。静止。
 //   磁針の回転・磁場の矢印・中心の ⊙⊗ の印・1 m あたりの数・右手は出さない。
 [K+'q0']:(p)=>{
  const gA=seg(p,0,.12),gB=seg(p,.33,.43),gC=seg(p,.67,.77);
  let s='';
  // 前半
  s+=fade(gA,label('前半',200,115,{size:26,color:C.dim,anchor:'middle',weight:700})
   +compass(200,215,0,{r:32,needle:0})+label('方位磁針',200,275,{size:22,color:C.dim,anchor:'middle'})
   +inSym(200,350,26,CI)+label('I',236,326,{size:30,color:CI,weight:700}));
  // 中盤：時計回りの輪。矢印が一周する
  const cx=600,cy=320,R=115;
  let m=ring(cx,cy,R,{color:CI,w:6})+ring(cx,cy,14,{color:C.dim,w:2.5});
  for(const d of [45,135,225,315]){const t=d*RAD;m+=head(cx+R*Math.cos(t),cy-R*Math.sin(t),Math.sin(t),Math.cos(t),{color:CI,L:22});}
  const u=seg(p,.4,.64);
  if(u>0&&u<1){const a=(90-360*u)*RAD,x=cx+R*Math.cos(a),y=cy-R*Math.sin(a);m+=head(x+Math.sin(a)*14,y+Math.cos(a)*14,Math.sin(a),Math.cos(a),{color:C.ink,L:30});}
  s+=fade(gB,label('中盤',cx,115,{size:26,color:C.dim,anchor:'middle',weight:700})+m+label('I',cx+R*.72+18,cy-R*.72-14,{size:30,color:CI,weight:700}));
  // 後半：コイル
  const x0=830,len=330;
  s+=fade(gC,label('後半',x0+len/2,115,{size:26,color:C.dim,anchor:'middle',weight:700})
   +coil(x0,len,34,300,{h:80})+label('600 巻',x0,235,{size:28,color:CI,weight:700}));
  s+=fade(seg(p,.75,.85),ruler(x0,len,372,'2.5 m'));
  s+=fade(seg(p,.8,.9),note('巻き線は 省略して 描いています',x0+len/2,450));
  s+=LEG();
  return s;
 },

 // ===================== 小問1 =====================
 // 1. ⊗ の導線（青）と、真上の針のない磁針。凡例の「電流 I＝青」を一度だけ黄で光らせる
 [K+'goal1']:(p)=>{
  let s=wire1(seg(p,.03,.15))+compass(W1.x,W1.y-R1,0,{needle:0,g:seg(p,.1,.22)});
  s+=fade(seg(p,.1,.22),label('真上',W1.x+40,W1.y-R1+10,{size:24,color:C.dim}));
  const fl=seg(p,.3,.38)*(1-seg(p,.62,.7));
  s+=goalTag(G1,{g:seg(p,.03,.12)})+LEG(fl);
  return s;
 },
 // 2. 「約束」：右手が導線を握る（正面から見た図、親指は奥 ⊗）。曲げた指に沿って時計回りの弧（橙）
 [K+'hand']:(p,ctx)=>{
  let s=kindTag('約束',W1.x,112,{g:seg(p,.02,.1),color:C.ink});
  s+=fist(W1.x,W1.y+10,{g:seg(p,.05,.25)});
  s+=curlArrow(W1.x,W1.y+10,seg(p,.5,.75),118);
  s+=fade(seg(p,.05,.25),label('右手（正面から 見た 図）',W1.x,W1.y+175,{size:22,color:C.dim,anchor:'middle'}));
  s+=card(650,110,520,250,
   fade(seg(p,.15,.3),inSym(700,175,20,CI)+label('親指 ＝ 電流の 向き（奥）',735,184,{size:26,color:CI,weight:700}))
   +fade(seg(p,.5,.65),line(680,225,1140,225,{color:C.faint,w:2})+label('曲げた 指 ＝ 時計回り',700,290,{size:28,color:CB,weight:700})
    +label('（正面から 見て）',700,330,{size:22,color:C.dim})),seg(p,.1,.2));
  s+=goalTag(G1)+LEG();
  return s;
 },
 // 3. 円（橙の破線）に沿って磁針 8 個。N 極（赤）が時計回りの接線の向きに回る。「一番上」で真上の磁針を黄で囲み、拡大して右向き
 [K+'ring']:(p)=>{
  const turn=seg(p,.12,.42);
  let s=fieldCirc(seg(p,.03,.12))+wire1()+compassRing({turn,hlTop:seg(p,.5,.58)});
  s+=bigCompass(seg(p,.58,.68),angLerp(NORTH,0,seg(p,.62,.8)));
  s+=fade(seg(p,.78,.88),label('N 極 → 右',880,460,{size:32,color:CN,anchor:'middle',weight:700}));
  s+=goalTag(G1)+LEG();
  return s;
 },
 // 4. 小問1 の答え A（右向き）
 [K+'ans1']:(p)=>{
  let s=fieldCirc()+wire1()+compassRing({turn:1,hlTop:1})+bigCompass(1,0)+label('N 極 → 右',880,460,{size:32,color:CN,anchor:'middle',weight:700});
  s+=goalTag(G1)+A1(seg(p,.03,.12))+LEG();
  return s;
 },
 // 5. 誤答 B → 誤答 D（1枚ずつ）
 [K+'wrong1BD']:(p,ctx)=>{
  let s=fieldCirc()+wire1()+compassRing({turn:1,hlTop:1});
  s+=wrongSeq(p,ctx,[['B','左向き','⊙ の電流（反時計回り）と取り違えた'],['D','奥向き','磁場は電流と同じ向きではない']],{opts:{...WR,y:200}});
  s+=goalTag(G1)+A1(1)+LEG();
  return s;
 },
 // 6. 誤答 C：真上の磁針から上へ伸びる点線の矢印に赤い ×
 [K+'wrong1C']:(p)=>{
  let s=fieldCirc()+wire1()+compassRing({turn:1,hlTop:1});
  const g=seg(p,.05,.15),x=W1.x,y=W1.y-R1;
  s+=fade(g,line(x,y-28,x,y-62,{color:C.dim,w:4,dash:'5 6'})+head(x,y-74,0,-1,{color:C.dim,L:16}));
  s+=fade(seg(p,.15,.25),line(x-14,y-62,x+14,y-38,{color:BAD,w:5})+line(x-14,y-38,x+14,y-62,{color:BAD,w:5}));
  s+=wrongCard('C','上向き','磁場は導線を囲む円の接線の向き',{...WR,y:200,g:seg(p,.05,.12)});
  s+=goalTag(G1)+A1(1)+LEG();
  return s;
 },

 // ===================== 小問2 =====================
 // 7. 時計回りの電流（青）の輪と、中心の空の円
 [K+'goal2']:(p)=>loop2({g:seg(p,.03,.15)})+fade(seg(p,.1,.2),label('中心',L2.x+26,L2.y+40,{size:24,color:C.dim}))+goalTag(G2,{g:seg(p,.03,.12)})+LEG(),
 // 8. 輪を4つの弧に区切る（白の区切りの印）。「足します」で中心の横に「＋」の札
 [K+'split']:(p)=>{
  let s=loop2({ticks:seg(p,.1,.25),names:seg(p,.2,.4)});
  const g=seg(p,.72,.8);
  s+=fade(g,rect(L2.x+30,L2.y-68,56,52,{fill:C.hi,fo:.14,stroke:C.hi,sw:2.5,rx:10})+label('＋',L2.x+58,L2.y-30,{size:34,color:C.hi,anchor:'middle',weight:700}));
  s+=goalTag(G2)+LEG();
  return s;
 },
 // 9. 右の弧を黄で光らせ、下向きの電流を強調。右手の親指が下。中心に橙の ⊗ を1つ
 [K+'right']:(p)=>{
  let s=loop2({ticks:1,names:1,hl:[seg(p,.03,.12),0,0,0],curArr:[seg(p,.08,.18),0,0,0]});
  s+=handPanel(seg(p,.25,.4),seg(p,.62,.72));
  s+=centerIn(1,seg(p,.72,.82));
  s+=goalTag(G2)+LEG();
  return s;
 },
 // 10. 上・左・下の弧を順に光らせ、中心の ⊗ を1つずつ重ねる（太くなる）。右の枠に4つの向き
 [K+'others']:(p)=>{
  const a=[1,seg(p,.05,.12),seg(p,.2,.27),seg(p,.35,.42)];
  const hl=[.35,a[1]*(1-seg(p,.2,.25)*.65),a[2]*(1-seg(p,.35,.4)*.65),a[3]];
  let s=loop2({ticks:1,names:1,hl,curArr:[.6,a[1],a[2],a[3]]});
  const k=1+(a[1]>.5)+(a[2]>.5)+(a[3]>.5);
  s+=centerIn(k);
  let rows='';
  PIECES.forEach((q,i)=>{const y=150+i*62;rows+=fade(a[i],label(`${q.name} の 部分`,700,y+10,{size:28,color:C.ink,weight:700})+label('→ 奥',880,y+10,{size:28,color:CB,weight:700})+inSym(990,y,18,CB));});
  rows+=fade(seg(p,.6,.7),line(680,385,1150,385,{color:C.faint,w:2})+label('向きが そろう → 強まる',915,430,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=card(650,95,530,365,rows,1);
  s+=goalTag(G2)+LEG();
  return s;
 },
 // 11. 小問2 の答え B。横に単元動画の反時計回りの輪（中心 ⊙）を小さく並べ、「逆回りなら逆向き」
 [K+'ans2']:(p,ctx)=>{
  let s=loop2({ticks:1,names:0})+centerIn(4);
  const g=seg(p,.35,.5),cx=880,cy=300,R=95;
  let m=ring(cx,cy,R,{color:CI,w:5});
  for(const d of [45,135,225,315]){const t=d*RAD;m+=head(cx+R*Math.cos(t),cy-R*Math.sin(t),-Math.sin(t),-Math.cos(t),{color:CI,L:18});}
  m+=outSym(cx,cy,22,CB)+label('単元動画の 輪（反時計回り）',cx,cy-R-30,{size:24,color:C.dim,anchor:'middle'});
  m+=rect(cx-130,cy+R+26,260,52,{fill:C.hi,fo:.12,stroke:C.hi,sw:2.5,rx:12})+label('逆回りなら 逆向き',cx,cy+R+61,{size:26,color:C.hi,anchor:'middle',weight:700});
  s+=fade(g,m);
  s+=goalTag(G2)+A2(seg(p,.03,.12))+LEG();
  return s;
 },
 // 12. 誤答 A → 誤答 C（C の間、上の弧の右向きの電流を黄で）
 [K+'wrong2AC']:(p,ctx)=>{
  const ve=voiceEnd(ctx),inC=seg(p,ve*.5+.01,ve*.5+.05);
  let s=loop2({ticks:1,hl:[0,inC,0,0],curArr:[0,inC,0,0]})+centerIn(4);
  s+=wrongSeq(p,ctx,[['A','手前向き（⊙）','反時計回りの輪の向きと取り違えた'],['C','右向き','上の部分の電流の向き（右）をそのまま使った']],{opts:{...WR,y:200}});
  s+=goalTag(G2)+A2(1)+LEG();
  return s;
 },
 // 13. 誤答 D：右と左の弧を同時に光らせ、電流は逆向きでも中心の ⊗ は同じ向き
 [K+'wrong2D']:(p)=>{
  const g=seg(p,.03,.12);
  let s=loop2({ticks:1,hl:[g,0,g,0],curArr:[g,0,g,0]})+centerIn(4);
  s+=fade(seg(p,.2,.3),label('逆向き の 電流',L2.x,L2.y+L2.R+60,{size:24,color:CI,anchor:'middle',weight:700}));
  s+=wrongCard('D','0 になる','中心では、どの部分も奥向きにそろう',{...WR,y:200,g:seg(p,.05,.12)});
  s+=goalTag(G2)+A2(1)+LEG();
  return s;
 },

 // ===================== 小問3 =====================
 // 14. 600 巻・2.5 m のコイル
 [K+'goal3']:(p)=>coilScene({g:seg(p,.03,.15)})+goalTag(G3,{g:seg(p,.03,.12)})+LEG(),
 // 15. 「定義」と n＝N/L。1 m ごとの区切り（白の縦線）、最後の 0.5 m を薄く
 [K+'def']:(p,ctx)=>{
  const m=seg(p,.55,.68);
  let s=coilScene({ruler0:1-m,metres:m,last:seg(p,.65,.75)});
  s+=card(330,335,540,140,kindTag('定義',430,410,{g:seg(p,.1,.2)})+fade(seg(p,.35,.48),T(NN,690,412,42,{color:C.ink})),seg(p,.05,.15),C.hi);
  s+=goalTag(G3)+LEG();
  return s;
 },
 // 16. 600÷2.5＝240。1 m の区切りごとに「240 巻」。小問3 の答え C
 [K+'calc']:(p,ctx)=>{
  let s=coilScene({ruler0:0,metres:1,last:1,count:seg(p,.3,.42)});
  s+=card(330,330,540,140,T('600\\div2.5=240',600,400,48),seg(p,.03,.12),C.hi);
  s+=goalTag(G3)+A3(seg(p,.42,.5))+LEG();
  return s;
 },
 // 17. 誤答 A → 誤答 D（1枚ずつ）
 [K+'wrong3AD']:(p,ctx)=>{
  let s=coilScene({ruler0:0,metres:1,last:1,count:1});
  s+=wrongSeq(p,ctx,[['A','1500 /m','600×2.5 と掛けた（単位 巻×m）'],['D','0.0042 /m','2.5÷600 と逆に割った（1巻あたりの m）']],{opts:WC});
  s+=goalTag(G3)+A3(1)+LEG();
  return s;
 },
 // 18. 誤答 B
 [K+'wrong3B']:(p)=>{
  let s=coilScene({ruler0:0,metres:1,last:1,count:1});
  s+=wrongCard('B','600 /m','全巻数 N を長さで割っていない',{...WC,g:seg(p,.03,.1)});
  s+=goalTag(G3)+A3(1)+LEG();
  return s;
 },
 // 19. N（白）と n（黄）のカード。右上の答えの札3枚を並べて終わる
 [K+'sum']:(p)=>{
  let s=coilScene({ruler0:0,metres:1,last:1,count:1,g:1});
  s+=card(200,320,800,160,
   T('N',250,370,40,{color:C.ink})+label('：全部の 巻数（単位なし）',280,382,{size:30,color:C.ink,weight:700})
   +fade(seg(p,.35,.45),T(`{\\color{${C.hi}}n}`,250,440,40,{color:C.hi})+label('：1 m あたりの 巻数（/m）',280,452,{size:30,color:C.hi,weight:700})),seg(p,.03,.12));
  s+=answerRow([[1,'A','右向き'],[2,'B','奥向き ⊗'],[3,'C','240 /m']],{g:seg(p,.75,.85)});
  s+=LEG();
  return s;
 },
};

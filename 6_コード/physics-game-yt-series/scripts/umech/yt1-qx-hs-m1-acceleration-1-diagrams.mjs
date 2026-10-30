// 問題編 解説「最後に速いのは、どっち？」(ys-qx-hs-m1-acceleration-1) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/102_加速度.md の q-hs-m1-acceleration-1（解説 18 行）。
// 色（01_共通の約束）：速度 v 紫、加速度 a 赤、時間 t 金、強調 黄、位置の移動 水色。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 画面の組み立て：
//   道の図（行1・2・8）：上に X の道、下に Y の道、右上に金の時計（0〜4 s の目盛り）。
//   X の矢印の図（行3〜7）：はじめ 6 と あと 18 の紫の矢印を左端をそろえて重ね、はみ出した 12 を赤で塗る。
//   2台の比べ（行9〜12）：左に X・Y の矢印と計算、右に 1秒あたりの増え方（赤）・比べ・誤答カード。
//   時計と Y（行13〜17）：左に大きな時計（目盛りに紫の速度）、下に Y の道、右に単位・誤答カード。
import {C,seg,lin,fade,label,line,rect,dot,ring,arrow,tex,texWidth,clamp} from './anim.mjs';
import {QC,card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,pauseBadge,cueT,voiceEnd,sentWin} from './yt1-qx-common.mjs';

const K='qx-hs-m1-acceleration-1:';
const G1='X の加速度',G2='加速度が大きいのはどちらか',G3='Y の 2 s〜3 s の変化';
const A1=g=>answerTag(1,'D','3 m/s²',{g}),A2=g=>answerTag(2,'B','Y、毎秒 4 増える',{g}),A3=g=>answerTag(3,'C','8→12 m/s',{g});
const VC=QC.v,AC=QC.a,TC=QC.t,HI=QC.hi;

// ---- 時間の道具：読みの中で、ある言葉が読まれ始める所（cue の進み 0〜1）------------------------------
function wordAt(ctx,word,from=0){
 const r=(ctx?.cue?.reading??'').replace(/\s/g,''),w=word.replace(/\s/g,'');
 const i=r.indexOf(w,from?r.indexOf(from.replace(/\s/g,'')):0);
 return i<0||!r.length?.5:i/r.length*voiceEnd(ctx);
}
const glow=(p,a,b)=>seg(p,a,a+.03)*(1-seg(p,b,b+.04));

// ---- 車・道・矢印 -----------------------------------------------------------------------------------
function car(x,y,name,{g=1}={}){
 const s=rect(x-36,y-46,72,34,{fill:'#5b6b8c',fo:.9,stroke:'#9aabc7',sw:2,rx:8})
  +dot(x-20,y-9,8,C.ink)+dot(x+20,y-9,8,C.ink)
  +label(name,x,y-20,{size:24,color:C.ink,anchor:'middle',weight:700});
 return fade(g,s);
}
function road(y,{x0=120,x1=1000,g=1}={}){return fade(g,line(x0,y,x1,y,{color:C.dim,w:3}));}
const varrow=(x,y,v,k,{g=1,w=6}={})=>v<.05?'':arrow(x,y,x+v*k,y,{color:VC,w,head:16,g});
const hlBox=(x,y,w,h,g=1,col=HI)=>fade(g,rect(x,y,w,h,{fill:col,fo:.12,stroke:col,sw:3,rx:8}));
const vlab=(t,x,y,{g=1,size=28,anchor='start'}={})=>fade(g,label(t,x,y,{size,color:VC,anchor,weight:700}));
const tlab=(t,x,y,{g=1,size=24,anchor='start'}={})=>fade(g,label(t,x,y,{size,color:TC,anchor,weight:700}));

// ---- 金の時計（0〜4 s の目盛り。0 は左下、2 は真上、4 は右下）------------------------------------------
const ang=tau=>(210-60*tau)*Math.PI/180;
const pt=(cx,cy,r,tau)=>[cx+r*Math.cos(ang(tau)),cy-r*Math.sin(ang(tau))];
function wedge(cx,cy,r,a,b,col,fo){
 const [x1,y1]=pt(cx,cy,r,a),[x2,y2]=pt(cx,cy,r,b);
 return `<path d="M ${cx} ${cy} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z" fill="${col}" fill-opacity="${fo}" stroke="none"/>`;
}
function gauge(cx,cy,r,{tau=null,g=1,fill=null,fillG=0,size=24,nums=null,box=null,out=false}={}){
 const [ax,ay]=pt(cx,cy,r,0),[bx,by]=pt(cx,cy,r,4);
 let s=`<path d="M ${ax.toFixed(1)} ${ay.toFixed(1)} A ${r} ${r} 0 1 1 ${bx.toFixed(1)} ${by.toFixed(1)}" fill="none" stroke="${TC}" stroke-width="5" stroke-linecap="round"/>`;
 if(fill)s+=fade(fillG,wedge(cx,cy,r-3,fill[0],fill[1],TC,.38));
 for(let k=0;k<=4;k++){const [x1,y1]=pt(cx,cy,r,k),[x2,y2]=pt(cx,cy,r-14,k),[lx,ly]=pt(cx,cy,out?r+size*.85:r-size*1.1,k);
  s+=line(x1,y1,x2,y2,{color:TC,w:4})+label(`${k}`,lx,ly+size*.36,{size,color:TC,anchor:'middle',weight:700});}
 s+=label('s',cx,cy+r*(out?.62:.45),{size,color:TC,anchor:'middle',weight:700});
 if(nums)nums.forEach(([v,o],k)=>{if(o<=0)return;const [x,y]=pt(cx,cy,r+size*1.6,k);s+=fade(o,label(String(v),x,y+size*.4,{size:size*1.15,color:VC,anchor:'middle',weight:700}));});
 if(box)for(const [a,b,col,o] of box){if(o<=0)continue;const R=r+size*1.6,[x1,y1]=pt(cx,cy,R,a),[x2,y2]=pt(cx,cy,R,b);
  s+=fade(o,ring(x1,y1,size*1.05,{color:col,w:3.5})+ring(x2,y2,size*1.05,{color:col,w:3.5}));}
 if(tau!==null){const [hx,hy]=pt(cx,cy,r-20,tau);s+=line(cx,cy,hx,hy,{color:TC,w:5})+dot(cx,cy,7,TC);}
 return fade(g,s);
}

// ---- 道の図（出題中の図と、行1・2・8）---------------------------------------------------------------
const RX={x0:170,k:13,kv:11,yX:230,yY:400,gx:1100,gy:212,gr:58};
const posX=t=>6*t+1.5*t*t,posY=t=>2*t*t,velX=t=>6+3*t,velY=t=>4*t;
// tau＝時刻（0〜4 s）。end＝4 s の数字の濃さ。hl＝[X0,X4,Y0,Y4] の黄の印。dimY＝Y の道の濃さ
function roads(tau,{end=0,hl=[0,0,0,0],dimY=1,clock=1,clockG=1}={}){
 const xX=RX.x0+RX.k*posX(tau),xY=RX.x0+RX.k*posY(tau);
 let s=road(RX.yX)+car(xX,RX.yX,'X')+varrow(xX,RX.yX-64,velX(tau),RX.kv);
 s+=tlab('0 s',RX.x0-12,RX.yX+42,{anchor:'end'})+vlab('6 m/s',RX.x0,RX.yX+42);
 s+=vlab('18 m/s',xX+velX(tau)*RX.kv/2,RX.yX-82,{g:end,anchor:'middle'});
 let y=road(RX.yY)+car(xY,RX.yY,'Y')+varrow(xY,RX.yY-64,velY(tau),RX.kv);
 y+=tlab('0 s',RX.x0-12,RX.yY+42,{anchor:'end'})+vlab('0 m/s',RX.x0,RX.yY+42);
 y+=vlab('16 m/s',xY+velY(tau)*RX.kv/2,RX.yY-82,{g:end,anchor:'middle'});
 s+=fade(dimY,y);
 // 黄の印（言葉に合わせて）
 const bx=[[RX.x0-6,RX.yX+14,104,38],[xX+velX(tau)*RX.kv/2-60,RX.yX-110,120,38],[RX.x0-6,RX.yY+14,104,38],[xY+velY(tau)*RX.kv/2-60,RX.yY-110,120,38]];
 hl.forEach((o,i)=>{if(o>0)s+=hlBox(...bx[i],o);});
 if(clock)s+=gauge(RX.gx,RX.gy,RX.gr,{tau,g:clockG,size:22,out:true});
 return s;
}
const tauRun=(p,a,b)=>4*lin(p,a,b);

// ---- X の矢印の図（行3〜7）---------------------------------------------------------------------------
const BX={x0:150,k:34,y0:210,y1:272};
function formulaTex(size=40){
 return `{\\color{${AC}}a}={\\color{${VC}}(v-v_0)}\\div{\\color{${TC}}t}`;
}
function xArrows({g=1,red=0,redLab=0,six=0,calc=[0,0,0]}={}){
 const x6=BX.x0+6*BX.k,x18=BX.x0+18*BX.k;
 let s=label('X',60,BX.y1-30,{size:34,color:C.ink,anchor:'middle',weight:700});
 s+=tlab('0 s',BX.x0-12,BX.y0+8,{anchor:'end'})+tlab('4 s',BX.x0-12,BX.y1+8,{anchor:'end'});
 s+=fade(red,rect(x6,BX.y1-20,x18-x6,40,{fill:AC,fo:.55,stroke:'none',rx:4}));
 s+=arrow(BX.x0,BX.y0,x6,BX.y0,{color:VC,w:7,head:18})+vlab('6',x6+14,BX.y0+10);
 s+=arrow(BX.x0,BX.y1,x18,BX.y1,{color:VC,w:7,head:18})+vlab('18',x18+14,BX.y1+10);
 s+=fade(Math.max(red,six),line(x6,BX.y0-24,x6,BX.y1+24,{color:C.dim,w:2,dash:'6 6'}));
 s+=fade(redLab,label('増えたぶん 12',(x6+x18)/2,BX.y1+52,{size:28,color:AC,anchor:'middle',weight:700}));
 if(six)s+=hlBox(BX.x0-8,BX.y1-28,x6-BX.x0+16,56,six);
 const cx=990;
 s+=fade(calc[0],tex(`18-6=12\\ \\mathrm{m/s}`,cx,BX.y0-6,{size:36,auto:false,color:VC}));
 s+=fade(calc[1],tex(`12\\div 4=3`,cx,BX.y1-6,{size:36,auto:false}));
 s+=fade(calc[2],tex(`{\\color{${AC}}a}=3\\ \\mathrm{m/s^2}`,cx,BX.y1+50,{size:38,auto:false,color:AC}));
 return fade(g,s);
}
const fCard=(g=1)=>card(400,88,400,74,tex(formulaTex(),600,125,{size:36,auto:false}),g,C.dim)+kindTag('定義',870,132,{g});

// ---- 2台の比べ（行9〜12）------------------------------------------------------------------------------
const CB={x0:150,k:22};
function bothArrows({g=1,calcX=1,calcY=0,hiY=0}={}){
 const X6=CB.x0+6*CB.k,X18=CB.x0+18*CB.k,Y16=CB.x0+16*CB.k;
 let s=label('X',56,160,{size:34,color:C.ink,anchor:'middle',weight:700})+label('Y',56,330,{size:34,color:C.ink,anchor:'middle',weight:700});
 s+=tlab('0 s',CB.x0-12,128,{anchor:'end'})+tlab('4 s',CB.x0-12,180,{anchor:'end'});
 s+=arrow(CB.x0,120,X6,120,{color:VC,w:6,head:16})+vlab('6',X6+12,130,{size:26});
 s+=arrow(CB.x0,172,X18,172,{color:VC,w:6,head:16})+vlab('18',X18+12,182,{size:26});
 s+=fade(calcX,tex(`(18-6)\\div 4=3`,CB.x0+150,230,{size:32,auto:false}));
 s+=tlab('0 s',CB.x0-12,298,{anchor:'end'})+tlab('4 s',CB.x0-12,350,{anchor:'end'});
 s+=dot(CB.x0,290,7,VC)+vlab('0',CB.x0+16,300,{size:26});
 s+=arrow(CB.x0,342,Y16,342,{color:VC,w:6,head:16})+vlab('16',Y16+12,352,{size:26});
 s+=fade(calcY,tex(`(16-0)\\div 4=4`,CB.x0+150,400,{size:32,auto:false}));
 if(hiY)s+=hlBox(CB.x0-6,370,312,58,hiY);
 return fade(g,s);
}
function perSec({g=1,mark=0}={}){
 let s=label('1秒あたりの 増え方',880,128,{size:26,color:AC,anchor:'middle',weight:700});
 s+=label('X',700,190,{size:30,color:C.ink,anchor:'middle',weight:700})+arrow(730,180,730+3*50,180,{color:AC,w:7,head:18})+label('3',730+3*50+20,192,{size:30,color:AC,weight:700});
 s+=label('Y',700,262,{size:30,color:C.ink,anchor:'middle',weight:700})+arrow(730,252,730+4*50,252,{color:AC,w:7,head:18})+label('4',730+4*50+20,264,{size:30,color:AC,weight:700});
 s+=hlBox(680,222,310,60,mark);
 return fade(g,s);
}
function compare({g=1,a=1,b=1}={}){
 let s=fade(a,label('最後の 速度',700,150,{size:26,color:C.dim,weight:700})+label('X 18 ＞ Y 16',880,150,{size:32,color:VC,weight:700}));
 s+=fade(b,label('加速度',700,214,{size:26,color:C.dim,weight:700})+label('X 3 ＜ Y 4',880,214,{size:32,color:AC,weight:700}));
 return fade(g,s);
}
const RCARD={x:600,w:580,y:276};

// ---- 時計と Y（行13〜17）------------------------------------------------------------------------------
const GY={cx:300,cy:262,r:112,ry:470,x0:150,k:26};
function yRoad({g=1,show2=0,show3=0,bracket=0,car0=1}={}){
 let s=road(GY.ry,{x0:110,x1:1180});
 const x2=GY.x0+GY.k*8,x3=GY.x0+GY.k*18;
 s+=fade(car0*(1-show3),car(GY.x0,GY.ry,'Y'));
 s+=fade(show2*.45,car(x2,GY.ry,'Y'))+tlab('2 s',x2,GY.ry+32,{g:show2,anchor:'middle'});
 s+=fade(show3,car(x3,GY.ry,'Y'))+tlab('3 s',x3,GY.ry+32,{g:show3,anchor:'middle'});
 if(bracket)s+=fade(bracket,line(x2,GY.ry-80,x2,GY.ry-60,{color:QC.x,w:3})+arrow(x2,GY.ry-70,x3,GY.ry-70,{color:QC.x,w:5,head:14})+label('8 m 以上',(x2+x3)/2,GY.ry-84,{size:28,color:QC.x,anchor:'middle',weight:700}));
 return fade(g,s);
}
function unitCard(p0,{g=1}={}){
 const a=1-p0,b=p0;
 let s=fade(a,tex(`\\mathrm{m/s^2}`,880,160,{size:46,auto:false,color:AC}));
 s+=fade(b,tex(`{\\color{${VC}}(\\mathrm{m/s})}{\\color{${TC}}\\div\\mathrm{s}}`,880,160,{size:46,auto:false}));
 s+=fade(b,label('速度',808,224,{size:24,color:VC,anchor:'middle',weight:700})+label('1秒ごと',960,224,{size:24,color:TC,anchor:'middle',weight:700}));
 return card(660,100,440,148,s,g,C.dim);
}
const YV=[0,4,8,12,16];

export const qxHsM1Acceleration1Diagrams={
 // ================= 問題アニメ：出題中（小問1〜3 共通、約5秒＋静止）=================
 // 2本の道、X（上）と Y（下）、右上に金の時計 0〜4 s。紫の速度の矢印がだんだん長くなる。
 // 速度の数字は 0 s（道の左端に残す）と 4 s（最後）だけ。最後は 4 s で「映像を 一時停止」（2台は止まっていない）。
 [K+'q0']:(p)=>{
  const tau=tauRun(p,.04,.84);
  return roads(tau,{end:seg(p,.84,.9)})+pauseBadge({g:seg(p,.88,.95)});
 },
 // ================= S1 小問1：X の加速度 =================
 // 1. 出題中の図を再生して静止。言葉に合わせて 6・18・0・16 を順に黄で
 [K+'setup']:(p,ctx)=>{
  const w6=wordAt(ctx,'ろくメートル'),w18=wordAt(ctx,'じゅうハチメートル'),w0=wordAt(ctx,'とまった'),w16=wordAt(ctx,'じゅうろくメートル');
  const tau=tauRun(p,.02,Math.max(.1,w18-.03));
  let s=roads(tau,{end:seg(p,w18-.05,w18-.02),hl:[glow(p,w6,w18),glow(p,w18,w0),glow(p,w0,w16),glow(p,w16,1.2)]});
  s+=pauseBadge({g:seg(p,w18,w18+.04)});
  return s;
 },
 // 2. 求めるもの：X の加速度。Y の道を薄く
 [K+'goal1']:(p)=>roads(4,{end:1,dimY:1-.7*seg(p,.1,.3)})+goalTag(G1,{g:seg(p,.03,.15)}),
 // 3. 定義：加速度＝1秒あたりの速度の変化 → a＝(v−v₀)÷t（分子 紫、分母 金）
 [K+'def']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=card(250,110,700,90,label('加速度 ＝ 1秒あたりの 速度の変化',600,168,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.03,.12),C.dim);
  s+=kindTag('定義',1040,160,{g:seg(p,.08,.18)});
  s+=fade(seg(p,b,b+.08),tex(formulaTex(),600,300,{size:64,auto:false}));
  s+=fade(seg(p,b+.1,b+.2),label('速度の 変化',575,380,{size:28,color:VC,anchor:'middle',weight:700})+label('かかった 時間',800,380,{size:28,color:TC,anchor:'middle',weight:700}));
  s+=goalTag(G1);
  return s;
 },
 // 4. X の矢印 6 と 18 を左端をそろえて重ね、はみ出した 12 を赤 → 18−6＝12
 [K+'dv']:(p)=>{
  let s=fCard();
  s+=xArrows({red:seg(p,.3,.45),redLab:seg(p,.4,.5),calc:[seg(p,.6,.72),0,0]});
  s+=goalTag(G1);
  return s;
 },
 // 5. 12÷4＝3、単位 m/s²。答えの札
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=fCard()+xArrows({red:1,redLab:1,calc:[1,seg(p,.05,.2),seg(p,.3,.45)]});
  s+=goalTag(G1)+A1(seg(p,b,b+.08));
  return s;
 },
 // 6. 誤答 A（18÷4＝4.5）。矢印の「6」の部分を黄で囲む
 [K+'wrongA']:(p)=>{
  let s=fCard()+xArrows({red:1,redLab:1,six:seg(p,.3,.42),calc:[1,1,1]});
  s+=goalTag(G1)+A1(1);
  s+=wrongCard('A','4.5 m/s²','はじめの 6 を 引いていない',{y:340,mid:`18\\div 4=4.5`,midSize:28,g:seg(p,.03,.1)});
  return s;
 },
 // 7. 誤答 B（(18＋6)÷4＝6）、誤答 C（12、時間で割っていない）。1枚ずつ
 [K+'wrongBC']:(p,ctx)=>{
  const c=wordAt(ctx,'じゅうには');
  let s=fCard()+xArrows({red:1,redLab:1,calc:[1,1,1]});
  s+=goalTag(G1)+A1(1);
  s+=wrongSeq(p,ctx,[['B','6 m/s²','18＋6 を 割った',{mid:`(18+6)\\div 4=6`,midSize:28}],['C','12 m/s²','時間で 割っていない（単位は m/s）']],{win:[[0,c],[c,1]],opts:{y:340}});
  return s;
 },
 // ================= S2 小問2：加速度が大きいのは =================
 // 8. 道の図に戻り、Y の道を元の濃さに。求めるもの
 [K+'goal2']:(p)=>roads(4,{end:1})+goalTag(G2,{g:seg(p,.05,.18)}),
 // 9. Y の 16 の矢印の下に (16−0)÷4＝4
 [K+'aY']:(p)=>{
  let s=bothArrows({calcY:seg(p,.45,.6),hiY:seg(p,.6,.72)*(1-seg(p,.9,.98))});
  s+=goalTag(G2);
  return s;
 },
 // 10. 1秒あたりの増え方 X 3、Y 4（赤の短い矢印）。Y に黄の印。答えの札
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=bothArrows({calcY:1})+perSec({g:seg(p,.05,.15),mark:seg(p,b-.12,b-.04)});
  s+=goalTag(G2)+A2(seg(p,b,b+.08));
  return s;
 },
 // 11. 紫の 18＞16 と 赤の 3＜4。誤答 A（最後が速い）
 [K+'wrongA2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=bothArrows({calcY:1})+fade(1-seg(p,0,.05),perSec({mark:1}));
  s+=compare({a:seg(p,.05,.12),b:seg(p,wordAt(ctx,'かそくどは')-.02,wordAt(ctx,'かそくどは')+.04)});
  s+=goalTag(G2)+A2(1);
  s+=wrongCard('A','X（最後が速い）','速い ≠ 加速度が大きい',{...RCARD,g:seg(p,b,b+.06)});
  return s;
 },
 // 12. 誤答 C（18÷4）、誤答 D（同じ）。1枚ずつ
 [K+'wrongCD']:(p,ctx)=>{
  const d=wordAt(ctx,'ディーは');
  let s=bothArrows({calcY:1})+compare();
  s+=goalTag(G2)+A2(1);
  s+=wrongSeq(p,ctx,[['C','X（18÷4）','はじめの 6 を 引き忘れた'],['D','同じ','時間が 同じでも 増え方が 違う']],{win:[[0,d],[d,1]],opts:RCARD});
  return s;
 },
 // ================= S3 小問3：Y の 2 s〜3 s =================
 // 13. X を消し、Y と時計だけ。時計の 2 と 3 の間を金で塗る
 [K+'goal3']:(p)=>{
  let s=gauge(GY.cx,GY.cy,GY.r,{fill:[2,3],fillG:seg(p,.45,.6)})+yRoad();
  s+=fade(seg(p,.5,.62),label('2 s → 3 s',GY.cx,GY.cy+GY.r*.9,{size:28,color:TC,anchor:'middle',weight:700}));
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 14. m/s² を (m/s)÷s と書き直す
 [K+'unit']:(p)=>{
  let s=gauge(GY.cx,GY.cy,GY.r,{fill:[2,3],fillG:1})+yRoad();
  s+=label('2 s → 3 s',GY.cx,GY.cy+GY.r*.9,{size:28,color:TC,anchor:'middle',weight:700});
  s+=unitCard(seg(p,.3,.42),{g:seg(p,.03,.12)});
  s+=goalTag(G3);
  return s;
 },
 // 15. 時計の各秒に紫の 0、4、8、12、16。「8→12」を黄で囲む。答えの札
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  const ws=['ゼロ、','よん、','ハチ、','じゅうに、','じゅうろくと'].map(w=>wordAt(ctx,w));
  const w8=wordAt(ctx,'ハチから');
  const nums=YV.map((v,k)=>[v,seg(p,ws[k]-.01,ws[k]+.03)]);
  let s=gauge(GY.cx,GY.cy,GY.r,{fill:[2,3],fillG:1,nums,box:[[2,3,HI,seg(p,w8-.02,w8+.04)]]})+yRoad();
  s+=label('2 s → 3 s',GY.cx,GY.cy+GY.r*.9,{size:28,color:TC,anchor:'middle',weight:700});
  s+=unitCard(1);
  s+=card(700,270,360,70,label('8 → 12 m/s',880,318,{size:34,color:VC,anchor:'middle',weight:700}),seg(p,w8,w8+.05),HI);
  s+=goalTag(G3)+A3(seg(p,b,b+.08));
  return s;
 },
 // 16. 誤答 A（位置が 4 m）。道の上に、この1秒の移動を水色で「8 m 以上」
 [K+'wrongA3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  const nums=YV.map(v=>[v,1]);
  let s=gauge(GY.cx,GY.cy,GY.r,{fill:[2,3],fillG:1,nums,box:[[2,3,HI,1]]});
  s+=yRoad({car0:1-seg(p,b,b+.05),show2:seg(p,b,b+.06),show3:seg(p,b+.04,b+.1),bracket:seg(p,b+.1,b+.18)});
  s+=goalTag(G3)+A3(1);
  s+=wrongCard('A','位置が 4 m 進む','4 ずつ 増えるのは 速度',{x:620,w:560,y:120,g:seg(p,.03,.1)});
  return s;
 },
 // 17. 誤答 B（4 m/s のまま）、誤答 D（4→8）。D の間、数字の「4→8」を赤の枠
 [K+'wrongBD3']:(p,ctx)=>{
  const d=wordAt(ctx,'ディーは');
  const nums=YV.map(v=>[v,1]);
  let s=gauge(GY.cx,GY.cy,GY.r,{fill:[2,3],fillG:1,nums,box:[[2,3,HI,1],[1,2,QC.bad,seg(p,d+.02,d+.08)]]});
  s+=yRoad({car0:0,show2:1,show3:1,bracket:1});
  s+=goalTag(G3)+A3(1);
  s+=wrongSeq(p,ctx,[['B','4 m/s のまま','加速度の 4 を 速度と した'],['D','4→8','1 s〜2 s の 区間（1つ ずれ）']],{win:[[0,d],[d,1]],opts:{x:620,w:560,y:120}});
  return s;
 },
 // ================= S4 まとめ =================
 // 18. 誤答カードを消し、定義の式 a＝(v−v₀)÷t を黄で囲む
 [K+'sum']:(p)=>{
  let s=card(300,150,600,150,tex(formulaTex(),600,225,{size:60,auto:false}),seg(p,.03,.15),C.dim);
  s+=fade(seg(p,.25,.4),rect(300,150,600,150,{fill:HI,fo:.08,stroke:HI,sw:4,rx:14}));
  s+=kindTag('定義',600,345,{g:seg(p,.15,.25)});
  s+=fade(seg(p,.4,.55),label('1秒あたりの 速度の 変わり方',600,410,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=answerRow([[1,'D','3 m/s²'],[2,'B','Y'],[3,'C','8→12 m/s']],{g:seg(p,.6,.75)});
  return s;
 },
};

// 問題編 解説「小さなばね振り子」（q-ui-oscillation-equation、大学編 09 振動の方程式・初級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/09_振動の方程式.md の q-ui-oscillation-equation（解説 15 行）。
// 画面の配置：左にばね振り子（床・壁・ばね・おもり・x の数直線）、右に説明の枠。誤答カードは右の枠の下に1枚ずつ。
// 札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 色（正本の単元の色）：位置 x・ずれ 水色、速度 紫、加速度 赤、力 緑、時刻 t・周期 T 金、ω 桃、強調 黄、誤り 赤。
// 図のために決めた値：振幅 0.06 m（問題文になし）。振動はゆっくり描く（注記を出す）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,wall,ground,block,spring} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,pauseBadge,note,cueT,tAt,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-ui-oscillation-equation:';
const CX=C.x,CA=C.a,CF=C.F,CT=C.t,CW=C.p,CD='#ff6b6b';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const XX=`{\\color{${CX}}x}`,WW=`{\\color{${CW}}\\omega}`,TT=`{\\color{${CT}}T}`;
const XDD=`\\dfrac{d^2${XX}}{dt^2}`;
const TAU=2*Math.PI;
const PX=680,PW=500,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const G1='x＝0.04 m での加速度',G2='周期 T',G3='周期は何倍か';
const ANS1=g=>answerTag(1,'B','−4 m/s²',{g}),ANS2=g=>answerTag(2,'C','約 0.63 s',{g}),ANS3=g=>answerTag(3,'A','3 倍',{g});
const WD=2;                      // 解説の図で振動を描く角振動数（ゆっくり。実際は 10 rad/s）
const SLOW=(x=330,y=500,g=1)=>note('動きは ゆっくり 描いています',x,y,{g});
const L=(s,x,y,o={})=>label(s,x,y,{size:28,color:C.ink,anchor:'middle',...o});

// ---- ばね振り子：d＝ずれ [m]（右が正）----
function rig(d,{ox=360,wx=60,y=380,sc=2500,bw=120,bh=80,mtext='0.25 kg',kTag=1,axis=1,tick04=0,g=1,x1=640,xArr=0,aArr=0,fArr=0,aLab='',fLab='',kText='ばね定数 25 N/m',bcol=C.x}={}){
 const bx=ox+d*sc;
 let s=ground(wx-10,x1,y)+wall(wx,y-150,y);
 s+=line(ox,y-bh-40,ox,y,{color:C.faint,w:2,dash:'7 7'});
 s+=spring(wx,bx-bw/2,y-bh/2,{coils:10,amp:14,color:C.dim,w:3});
 s+=block(bx,y,bw,bh,{color:bcol,text:mtext,size:24,fo:.22});
 if(kTag)s+=fade(kTag,label(kText,(wx+ox-bw/2)/2+20,y-bh-30,{size:24,color:C.dim,anchor:'middle'}));
 if(axis){
  const ay=y+40;
  s+=fade(axis,arrow(wx+10,ay,x1,ay,{color:CX,w:3,head:14})+label('x',x1+10,ay+9,{size:28,color:CX,weight:700})
   +line(ox,ay-9,ox,ay+9,{color:CX,w:3})+label('x ＝ 0',ox,ay+38,{size:24,color:CX,anchor:'middle'}));
  if(tick04)s+=fade(tick04,line(ox+.04*sc,ay-9,ox+.04*sc,ay+9,{color:CX,w:3})+label('0.04',ox+.04*sc,ay+38,{size:24,color:CX,anchor:'middle'}));
 }
 if(xArr&&Math.abs(d)>.003)s+=fade(xArr,arrow(ox,y-bh-14,bx,y-bh-14,{color:CX,w:5,head:14})+label(`${(Math.abs(d)).toFixed(2)} m`,(ox+bx)/2,y-bh-28,{size:24,color:CX,anchor:'middle',weight:700}));
 if(aArr&&Math.abs(d)>.002){const la=-d*sc*1.1;s+=fade(aArr,arrow(bx,y-bh-70,bx+la,y-bh-70,{color:CA,w:6,head:16})+(aLab?label(aLab,bx+la/2,y-bh-84,{size:24,color:CA,anchor:'middle',weight:700}):''));}
 if(fArr&&Math.abs(d)>.002){const lf=-d*sc*.9;s+=fade(fArr,arrow(bx,y-bh-70,bx+lf,y-bh-70,{color:CF,w:6,head:16})+(fLab?label(fLab,bx+lf/2,y-bh-84,{size:24,color:CF,anchor:'middle',weight:700}):''));}
 return fade(g,s);
}
// 周期の時計（金）：u＝0〜1 で針が一周
function clock(cx,cy,r,u,{g=1,txt=''}={}){
 let s=ring(cx,cy,r,{color:CT,w:4,fill:'#1a1a10'});
 for(let i=0;i<8;i++){const a=TAU*i/8;s+=line(cx+r*.84*Math.sin(a),cy-r*.84*Math.cos(a),cx+r*Math.sin(a),cy-r*Math.cos(a),{color:CT,w:3});}
 const a=TAU*clamp(u);
 if(u>.01){const n=Math.max(2,Math.ceil(36*u)),pts=Array.from({length:n+1},(_,i)=>{const b=a*i/n;return [cx+r*.6*Math.sin(b),cy-r*.6*Math.cos(b)];});
  s+=draw([[cx,cy],...pts,[cx,cy]],1,{color:CT,w:0,fill:CT,opacity:.28});}
 s+=line(cx,cy,cx+r*.78*Math.sin(a),cy-r*.78*Math.cos(a),{color:CT,w:5})+dot(cx,cy,6,CT);
 if(txt)s+=label(txt,cx,cy-r-14,{size:26,color:CT,anchor:'middle',weight:700});
 return fade(g,s);
}
// 円を回る点と、その影（おもり）。th＝点の角（右から反時計回り）
function circleShadow(th,{ox=360,cy=185,R=100,y=380,g=1,ang=1,rig1=1}={}){
 const sc=R/.06,d=.06*Math.cos(th),px=ox+R*Math.cos(th),py=cy-R*Math.sin(th);
 let s=ring(ox,cy,R,{color:C.faint,w:2.5})+line(ox-R-20,cy,ox+R+20,cy,{color:C.grid,w:1.5});
 if(ang){const a1=((th%TAU)+TAU)%TAU,n=Math.max(2,Math.ceil(30*a1/TAU)),pts=Array.from({length:n+1},(_,i)=>{const b=a1*i/n;return [ox+34*Math.cos(b),cy-34*Math.sin(b)];});
  s+=fade(ang,draw(pts,1,{color:CW,w:4})+label('ωt',ox-56,cy-10,{size:26,color:CW,weight:700,anchor:'middle'}));}
 s+=line(ox,cy,px,py,{color:CW,w:3})+dot(px,py,10,CW);
 s+=line(px,py,px,y-80,{color:C.hi,w:2.5,dash:'6 6'});
 if(rig1)s+=rig(d,{ox,sc,kTag:0,axis:0,mtext:''});
 return fade(g,s);
}

export const ytQxUiOscillationEquationDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（6 s）：0〜2 s 床・壁・ばね・おもり・x の数直線・x＝0。2〜5 s 右へ引いて放し、2往復ほど（ゆっくり）。
 // 5 s で x＝0 を通る瞬間に映像を一時停止し、「F＝−kx、ma＝F」の札。加速度・ω・周期は出さない。
 [K+'q1']:(p,ctx)=>{
  const t=cueT(ctx),wq=TAU*2.25/2.6;
  const d=t<2?0:t<2.4?.06*seg(t,2,2.4):t<5?.06*Math.cos(wq*(t-2.4)):0;
  let s=rig(d,{ox:600,wx:290,x1:960,g:seg(t,0,.8),kTag:seg(t,.6,1.4),axis:seg(t,1,1.8)});
  s+=note('動きは ゆっくり 描いています',600,505,{g:seg(t,2.4,2.8)});
  s+=pauseBadge({g:seg(t,5,5.2),x:600,y:90});
  s+=card(830,150,330,80,T(`F=-k${XX},\\ \\ ma=F`,995,197,34),seg(t,5.2,5.6),C.hi);
  return s;
 },
 // 小問3（3 s）：おもりは止めたまま（振動は描かない）。おもりの札 0.25 kg → 2.25 kg（9倍）、引く幅の札「振幅 2倍」。
 [K+'q3']:(p,ctx)=>{
  const t=cueT(ctx),sw=seg(t,1,1.6);
  let s=rig(0,{ox:600,wx:290,x1:960,mtext:sw<.5?'0.25 kg':'2.25 kg',g:seg(t,0,.6)});
  s+=card(690,110,480,70,label('おもり 0.25 kg → 2.25 kg（9倍）',930,155,{size:26,color:C.hi,anchor:'middle',weight:700}),seg(t,1,1.6),C.hi);
  s+=card(690,195,480,70,label('振幅 2倍',930,240,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(t,1.8,2.4),C.hi);
  return s;
 },

 // ===================== 小問1 =====================
 // 1. x＝0.04 m を通る瞬間で映像を一時停止。ずれの矢印（水色）
 [K+'goal1']:(p)=>{
  let s=rig(.04,{tick04:1,xArr:seg(p,.2,.35)});
  s+=pauseBadge({x:360,y:90});
  s+=panel(90,300,label('小問1',PC,140,{size:28,color:C.dim,anchor:'middle'})
   +label('x ＝ 0.04 m での 加速度 は？',PC,205,{size:30,color:C.hi,anchor:'middle',weight:700})
   +line(PX+40,245,PX+PW-40,245,{color:C.faint,w:2})
   +label('m ＝ 0.25 kg',PC,300,{size:28,color:C.ink,anchor:'middle'})+label('k ＝ 25 N/m',PC,350,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.hi);
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 2. 法則 ma＝F。F＝−kx を入れて、両辺を m で割る
 [K+'eom']:(p,ctx)=>{
  const v=voiceEnd(ctx),q=u=>seg(p,u*v,u*v+.08);
  let s=kindTag('法則',600,125,{text:'ma ＝ F',g:q(0)});
  s+=fade(q(.05),label('ばねの 力',330,200,{size:26,color:CF,anchor:'end'})+T(`{\\color{${CF}}F}=-k${XX}`,470,192,40));
  s+=fade(q(.4),T(`m\\,${XDD}=-k${XX}`,600,290,46));
  const dv=q(.65);
  s+=fade(dv,label('両辺を m で 割る',940,295,{size:24,color:C.hi,weight:700}));
  s+=fade(q(.8),T(`${XDD}=-\\dfrac{k}{m}\\,${XX}`,600,420,50));
  s+=goalTag(G1);
  return s;
 },
 // 3. k/m＝25/0.25＝100（＝ω²）→ a＝−100×0.04＝−4 m/s²。左向きの加速度の矢印（赤）
 [K+'calc1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,e=W[1]?W[1][1]:.9;
  let s=rig(.04,{tick04:1,xArr:1,aArr:seg(p,e-.12,e-.02),aLab:'4 m/s²'});
  s+=pauseBadge({x:360,y:90});
  s+=panel(90,330,T(`\\dfrac{k}{m}=\\dfrac{25}{0.25}=100`,PC,165,38)
   +fade(seg(p,.25,.35),label('＝ ω²',PC+170,240,{size:28,color:CW,anchor:'middle',weight:700}))
   +fade(seg(p,b,b+.08),line(PX+40,265,PX+PW-40,265,{color:C.faint,w:2})+T(`{\\color{${CA}}a}=-100\\times0.04`,PC,315,36))
   +fade(seg(p,b+.2,b+.3),T(`=-4\\ \\mathrm{m/s^2}`,PC,385,40,{color:CA})),1,C.faint);
  s+=goalTag(G1);
  return s;
 },
 // 4. 加速度はいつも中心向き（おもりを振動させ、赤の矢印が x＝0 を向く）。2文目で答えの札
 [K+'ans1']:(p,ctx)=>{
  const t=cueT(ctx),W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  const d=.04*Math.cos(WD*t);
  let s=rig(d,{xArr:1,aArr:1});
  s+=SLOW(330,505);
  s+=panel(90,250,T(`{\\color{${CA}}a}=-4\\ \\mathrm{m/s^2}`,PC,150,40)
   +line(PX+40,185,PX+PW-40,185,{color:C.faint,w:2})
   +label('マイナス ＝ ずれと 逆向き',PC,240,{size:28,color:C.ink,anchor:'middle',weight:700})
   +label('（中心 x ＝ 0 を 向く）',PC,290,{size:26,color:CA,anchor:'middle',weight:700}),1,C.faint);
  s+=goalTag(G1)+ANS1(seg(p,b,b+.06));
  return s;
 },
 // 5. 誤答 A（力のまま）→ C（符号を落とした）。枠に F＝−25×0.04＝−1 N → a＝F/m
 [K+'wrong1']:(p,ctx)=>{
  let s=rig(.04,{tick04:1,xArr:1,fArr:1,fLab:'1 N'});
  s+=panel(90,215,T(`{\\color{${CF}}F}=-25\\times0.04=-1\\ \\mathrm{N}`,PC,140,32)
   +T(`{\\color{${CA}}a}=\\dfrac{{\\color{${CF}}F}}{m}=\\dfrac{-1}{0.25}=-4\\ \\mathrm{m/s^2}`,PC,240,32),1,C.faint);
  s+=wrongSeq(p,ctx,[['A','−1 m/s²','力 −1 N のまま。m で割っていない'],['C','＋4 m/s²','符号を落とした。加速度は中心向き']],{opts:{...WOPT,y:330}});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },
 // 6. 誤答 D（ω を掛けた）
 [K+'wrong1d']:(p)=>{
  let s=rig(.04,{tick04:1,xArr:1,aArr:1,aLab:'4 m/s²'});
  s+=panel(90,215,T(`${WW}^2=100\\ \\ \\rightarrow\\ \\ {\\color{${CA}}a}=-${WW}^2${XX}`,PC,150,34)
   +label('ω ＝ 10 ではなく ω² ＝ 100 を 掛ける',PC,245,{size:24,color:C.ink,anchor:'middle'}),1,C.faint);
  s+=wrongCard('D','−0.4 m/s²','ω＝10 を掛けた。ω×x の単位は m/s',{...WOPT,y:330,g:seg(p,.03,.1)});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },

 // ===================== 小問2 =====================
 // 7. 誤答カードと矢印を消し、おもりを振動させる
 [K+'goal2']:(p,ctx)=>{
  const t=tAt(ctx,K+'goal2');
  let s=rig(.06*Math.cos(WD*t));
  s+=SLOW(330,505);
  s+=panel(90,250,label('小問2',PC,140,{size:28,color:C.dim,anchor:'middle'})
   +label('この 振動の 周期 T は？',PC,205,{size:30,color:C.hi,anchor:'middle',weight:700})
   +line(PX+40,240,PX+PW-40,240,{color:C.faint,w:2})
   +label('T ＝ 1 往復に かかる 時間',PC,295,{size:26,color:CT,anchor:'middle'}),seg(p,.05,.2),C.hi);
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 8. 円を回る点の影がおもり。点は 1 秒に ω＝10 rad、一周は 2π
 [K+'circle']:(p,ctx)=>{
  const t=tAt(ctx,K+'circle'),W=sentWin(ctx);
  let s=circleShadow(WD*t);
  s+=SLOW(330,505);
  s+=panel(90,300,label('円を 回る 点 の 影 ＝ 振動',PC,140,{size:28,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.3,.4),line(PX+40,175,PX+PW-40,175,{color:C.faint,w:2})+label('点は 1 秒に ω ＝ 10 rad',PC,230,{size:30,color:CW,anchor:'middle',weight:700}))
   +fade(seg(p,.62,.72),label('一周 ＝ 2π rad',PC,300,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.03,.12),CW);
  s+=goalTag(G2);
  return s;
 },
 // 9. 点が一周する間に時計の針（金）が一周 → T。ωT＝2π → T＝2π/10≈0.63 s。2文目で答えの札
 [K+'ans2']:(p,ctx)=>{
  const t=tAt(ctx,K+'circle'),t9=cueT(ctx),W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  const u=clamp((t9-.3)/(TAU/WD));   // 点は回し続け、時計は 0.3 s から一周（点の一周と同じ時間）
  let s=circleShadow(WD*t,{ox:300});
  s+=clock(555,215,72,u,{txt:u>=1?'T ≈ 0.63 s':'T'});
  s+=SLOW(330,505);
  s+=panel(90,300,T(`${WW}${TT}=2\\pi`,PC,150,40)
   +fade(seg(p,.25,.35),T(`${TT}=\\dfrac{2\\pi}{${WW}}=\\dfrac{2\\pi}{10}`,PC,250,40))
   +fade(seg(p,.4,.48),T(`\\approx{\\color{${CT}}0.63\\ \\mathrm{s}}`,PC,345,40)),1,CT);
  s+=goalTag(G2)+ANS2(seg(p,b,b+.06));
  return s;
 },
 // 10. 誤答 A（1/ω）→ B（2π×10）
 [K+'wrong2']:(p,ctx)=>{
  const t=tAt(ctx,K+'circle');
  let s=circleShadow(WD*t,{ox:300})+clock(555,215,72,1,{txt:'T ≈ 0.63 s'});
  s+=SLOW(330,505);
  s+=panel(90,150,T(`${TT}=\\dfrac{2\\pi}{${WW}}\\approx{\\color{${CT}}0.63\\ \\mathrm{s}}`,PC,165,38),1,CT);
  s+=wrongSeq(p,ctx,[['A','約 0.1 s','1/ω。一周の 2π を掛けていない'],['B','約 62.8 s','2π×10。単位が 1/s']],{opts:{...WOPT,y:265}});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },
 // 11. 誤答 D（ω をそのまま秒）
 [K+'wrong2d']:(p,ctx)=>{
  const t=tAt(ctx,K+'circle');
  let s=circleShadow(WD*t,{ox:300})+clock(555,215,72,1,{txt:'T ≈ 0.63 s'});
  s+=SLOW(330,505);
  s+=panel(90,150,label('ω ＝ 10 rad/s',PC,140,{size:28,color:CW,anchor:'middle',weight:700})+label('（1 秒に 進む 角度。時間 ではない）',PC,195,{size:24,color:C.ink,anchor:'middle'}),1,C.faint);
  s+=wrongCard('D','10 s','ω＝10 rad/s をそのまま秒とした',{...WOPT,y:265,g:seg(p,.03,.1)});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },

 // ===================== 小問3 =====================
 // 12. 円・カードを消す。条件（質量 9 倍・振幅 2 倍）と T＝2π√(m/k)
 [K+'goal3']:(p)=>{
  let s=rig(0,{mtext:'2.25 kg'});
  s+=card(60,100,520,70,label('おもり 0.25 kg → 2.25 kg（9倍）',320,145,{size:26,color:C.hi,anchor:'middle',weight:700}),1,C.hi);
  s+=card(60,185,520,60,label('振幅 2倍',320,225,{size:26,color:C.hi,anchor:'middle',weight:700}),1,C.hi);
  s+=panel(90,250,label('小問3',PC,140,{size:28,color:C.dim,anchor:'middle'})
   +label('周期は 何倍 か',PC,195,{size:30,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.4,.55),line(PX+40,230,PX+PW-40,230,{color:C.faint,w:2})+T(`${TT}=2\\pi\\sqrt{\\dfrac{m}{k}}`,PC,295,42)),seg(p,.05,.2),C.hi);
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 13. 振幅 1 倍と 2 倍のばね振り子を上下に並べ、同じ時刻に中心を通る（金の縦線）。2文目で力の矢印（緑、2倍）
 [K+'amp']:(p,ctx)=>{
  const t=cueT(ctx),W=sentWin(ctx),b=W[1]?W[1][0]:.5,c=Math.cos(WD*t);
  const fa=seg(p,b,b+.06);
  let s=label('振幅 1 倍',70,110,{size:26,color:C.ink,weight:700})+label('振幅 2 倍',70,300,{size:26,color:C.ink,weight:700});
  s+=rig(.03*c,{y:240,bh:70,bw:100,sc:2000,mtext:'',kTag:0,axis:0,fArr:fa});
  s+=rig(.06*c,{y:430,bh:70,bw:100,sc:2000,mtext:'',kTag:0,axis:0,fArr:fa});
  const near=1-clamp(Math.abs(c)/.12);
  s+=fade(.25+.75*near,line(360,120,360,440,{color:CT,w:near>.5?6:3}));
  s+=fade(near,label('同時に 中心',360,470+0,{size:24,color:CT,anchor:'middle',weight:700}));
  s+=SLOW(560,505);
  const f=`${TT}=2\\pi\\sqrt{\\dfrac{m}{k}}`,fw=texWidth(f,44,false);
  s+=panel(90,330,T(f,PC,175,44)+highlight(PC-fw/2-14,115,fw+28,115,seg(p,.2,.3))
   +fade(seg(p,.25,.35),label('振幅は 式に 入らない',PC,270,{size:28,color:C.hi,anchor:'middle',weight:700}))
   +fade(fa,line(PX+40,305,PX+PW-40,305,{color:C.faint,w:2})+label('振幅 2 倍 → 力も 2 倍',PC,355,{size:28,color:CF,anchor:'middle',weight:700})
    +label('→ 同じ 時間で 一周',PC,400,{size:28,color:C.ink,anchor:'middle'})),1,C.faint);
  s+=goalTag(G3);
  return s;
 },
 // 14. 0.25 kg と 2.25 kg の振動を並べ、周期 0.63 s と 1.88 s を金の目盛りで比べる（3 目盛り分）
 [K+'ans3']:(p,ctx)=>{
  const t=cueT(ctx),W=sentWin(ctx),b=W[1]?W[1][0]:.5,wd=2.4;
  let s=label('0.25 kg',70,110,{size:26,color:C.ink,weight:700})+label('2.25 kg（振幅 2 倍）',70,255,{size:26,color:C.ink,weight:700});
  s+=rig(.03*Math.cos(wd*t),{y:215,bh:60,bw:90,sc:2000,mtext:'',kTag:0,axis:0});
  s+=rig(.06*Math.cos(wd*t/3),{y:360,bh:60,bw:90,sc:2000,mtext:'',kTag:0,axis:0,bcol:C.dim});
  const ux=150,x0=110,ry=420,gs=seg(p,.15,.3);
  let r='';
  for(let i=0;i<=3;i++)r+=line(x0+i*ux,ry-12,x0+i*ux,ry+12,{color:CT,w:3});
  r+=rect(x0,ry-28,ux,12,{fill:CT,fo:.8,stroke:'none',rx:3})+label('0.63 s',x0+ux+12,ry-14,{size:22,color:CT});
  r+=rect(x0,ry+16,3*ux*seg(p,.25,.45),12,{fill:CT,fo:.45,stroke:CT,sw:1.5,rx:3})+fade(seg(p,.4,.5),label('1.88 s（3 目盛り）',x0+3*ux+12,ry+30,{size:22,color:CT}));
  s+=fade(gs,r);
  s+=panel(90,340,T(`${TT}=2\\pi\\sqrt{\\dfrac{2.25}{25}}\\approx{\\color{${CT}}1.88\\ \\mathrm{s}}`,PC,160,34)
   +fade(seg(p,.2,.3),line(PX+40,215,PX+PW-40,215,{color:C.faint,w:2})+label('振幅 2 倍 → ×1',PC,265,{size:28,color:C.ink,anchor:'middle',weight:700}))
   +fade(seg(p,.3,.4),label('質量 9 倍 → ×3（√9）',PC,320,{size:28,color:C.ink,anchor:'middle',weight:700}))
   +fade(seg(p,.4,.5),label('合わせて 3 倍',PC,390,{size:32,color:C.hi,anchor:'middle',weight:700})),1,C.faint);
  s+=note('動きは ゆっくり 描いています',330,505);
  s+=goalTag(G3)+ANS3(seg(p,b,b+.06));
  return s;
 },
 // 15. 誤答 B → C → D を1枚ずつ。声のあと、まとめの図（k/m＝100 → ω＝10 → a と T、2.25 kg の 1.88 s）と答えの札3枚で静止
 [K+'wrong3']:(p,ctx)=>{
  const t=tAt(ctx,K+'ans3'),W=sentWin(ctx),ve=voiceEnd(ctx),m=W[0][1];
  const sum=seg(p,ve+.02,ve+.08),pre=1-sum,wd=2.4;
  let s='';
  if(pre>0){
   let a=label('0.25 kg',70,110,{size:26,color:C.ink,weight:700})+label('2.25 kg（振幅 2 倍）',70,255,{size:26,color:C.ink,weight:700});
   a+=rig(.03*Math.cos(wd*t),{y:215,bh:60,bw:90,sc:2000,mtext:'',kTag:0,axis:0});
   a+=rig(.06*Math.cos(wd*t/3),{y:360,bh:60,bw:90,sc:2000,mtext:'',kTag:0,axis:0,bcol:C.dim});
   a+=note('動きは ゆっくり 描いています',330,505);
   a+=panel(90,140,label('振幅 2 倍 → ×1',PC,140,{size:28,color:C.ink,anchor:'middle',weight:700})+label('質量 9 倍 → ×3（√9）',PC,195,{size:28,color:C.ink,anchor:'middle',weight:700}),1,C.faint);
   a+=wrongSeq(p,ctx,[['B','6 倍',['振幅でも 2 倍とした。','周期は振幅によらない']],['C','18 倍','2×9。質量は √ の中'],['D','1 倍','質量が大きいとゆっくりになる']],
    {win:[[0,m*.5],[m*.5,m],[W[1]?W[1][0]:m,ve+.04]],keepLast:false,opts:{...WOPT,y:250}});
   a+=goalTag(G3)+ANS3(1);
   s+=fade(pre,a);
  }
  if(sum>0){
   let z=card(70,150,260,90,T(`\\dfrac{k}{m}=100`,200,200,36),1);
   z+=arrow(340,195,420,195,{color:C.dim,w:3,head:12});
   z+=card(430,150,230,90,T(`${WW}=10\\ \\mathrm{rad/s}`,545,200,32),1,CW);
   z+=arrow(670,180,760,130,{color:C.dim,w:3,head:12})+arrow(670,215,760,290,{color:C.dim,w:3,head:12});
   z+=card(770,90,360,115,T(`{\\color{${CA}}a}=-4\\ \\mathrm{m/s^2}`,950,135,32)+label('（x ＝ 0.04 m で）',950,185,{size:22,color:C.dim,anchor:'middle'}),1,CA);
   z+=card(770,250,360,90,T(`{\\color{${CT}}T\\approx0.63\\ \\mathrm{s}}`,950,300,32),1,CT);
   z+=card(770,370,360,90,label('2.25 kg：T ≈ 1.88 s',950,425,{size:28,color:CT,anchor:'middle',weight:700}),1,CT);
   z+=label('（3 倍。振幅に よらない）',950,488,{size:24,color:C.dim,anchor:'middle'});
   z+=answerRow([[1,'B','−4 m/s²'],[2,'C','約 0.63 s'],[3,'A','3 倍']],{g:seg(p,ve+.1,ve+.16)});
   s+=fade(sum,z);
  }
  return s;
 },
};

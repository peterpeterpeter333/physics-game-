// 問題編 解説「橋の上から小石を落とす」(ys-qx-hs-m-freefall-1) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/104_落体の運動.md の q-hs-m-freefall-1（解説 20 行）。
// 色（01_共通の約束・単元動画と同じ）：変位 y 水色、速度 v 紫、加速度 g 赤、時間 t 金、強調 黄、誤り 赤（×）。
// 左：橋・水面・縦の物差し（下向きに y、1 m＝4.4 px、0〜78.4 m）。右：v-t グラフ（t 0〜4.6 s、v 0〜45 m/s）。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない（手は出題の場面だけ）。
// 元の単元動画（yt1-hs-m-freefall-1）の部品（ball・hand・Gt・Yt）を読み込んで使う（そのファイルは編集しない）。
import {C,seg,lin,fade,label,line,rect,dot,ring,arrow,axes,tex,poly,clamp,mix} from './anim.mjs';
import {Gt,Yt,ball,hand,ironBall} from './yt1-hs-m-freefall-1-diagrams.mjs';
import {card,goalTag,answerTag,wrongSeq,wrongCard,kindTag,note,cueT,sentWin,voiceEnd} from './yt1-qx-common.mjs';
// 読点「、」で区切った句ごとの区間（cue の進み 0〜1）。groups＝カードごとの句の番号の並び。最後のカードは cue の終わりまで。
export function partWin(ctx,groups){
 const r=(ctx?.cue?.reading??'').split(/[、。]/).map(x=>x.replace(/\s/g,'')).filter(Boolean);
 const ve=voiceEnd(ctx),tot=r.reduce((a,x)=>a+x.length,0)||1,st=[];let acc=0;
 for(const x of r){st.push([acc/tot*ve,(acc+x.length)/tot*ve]);acc+=x.length;}
 return groups.map((g,i)=>[st[g[0]]?.[0]??i/groups.length,i===groups.length-1?1:(st[g.at(-1)]?.[1]??(i+1)/groups.length)]);
}

const K='qx-hs-m-freefall-1:';
const G1='水面に 着くまでの 時間',G2='着く 直前の 速さ',G3='3〜4 s に 落ちる 距離';
const A1=g=>answerTag(1,'C','4 s',{g}),A2=g=>answerTag(2,'B','39.2 m/s',{g}),A3=g=>answerTag(3,'D','34.3 m',{g});
const H=78.4,GG=9.8;
// ---- 橋・水面・物差し -----------------------------------------------------------------------------
const P={sx:300,y0:120,k:4.4,rx:380,wx0:10,wx1:600};
const Ym=m=>P.y0+P.k*m, YW=Ym(H);
const fallM=t=>GG*t*t/2;
function bridge(){
 let s=rect(20,Ym(0)+6,P.sx-36,16,{fill:'#6b7894',fo:1,stroke:'#8d9ab5',sw:2,rx:3});
 s+=line(24,Ym(0)-18,P.sx-20,Ym(0)-18,{color:'#8d9ab5',w:3});
 for(let x=34;x<P.sx-20;x+=34)s+=line(x,Ym(0)-18,x,Ym(0)+6,{color:'#8d9ab5',w:2.5});
 s+=rect(120,Ym(0)+22,40,YW-Ym(0)-22,{fill:'#4a5570',fo:.9,stroke:'none',rx:2});
 return s;
}
function water(){
 let s=rect(P.wx0,YW,P.wx1-P.wx0,515-YW,{fill:'#2a6fb0',fo:.45,stroke:'none',rx:0});
 for(let x=P.wx0+10;x<P.wx1-30;x+=60)s+=`<path d="M${x} ${YW+14} q10 -6 20 0 t20 0" fill="none" stroke="#9fd0ff" stroke-width="2" opacity=".6"/>`;
 s+=line(P.wx0,YW,P.wx1,YW,{color:'#9fd0ff',w:2.5});
 return s;
}
// 縦の物差し（0〜78.4 m）。hiW＝水面の目盛りを黄で光らせる強さ
function ruler({g=1,hiW=0,labs=1}={}){
 let s=line(P.rx,Ym(0),P.rx,YW,{color:C.x,w:4});
 for(let m=0;m<=78;m+=10)s+=line(P.rx-8,Ym(m),P.rx+8,Ym(m),{color:C.x,w:2});
 s+=line(P.rx-14,YW,P.rx+14,YW,{color:hiW>0?C.hi:C.x,w:3+4*hiW});
 if(labs){s+=label('0',P.rx+18,Ym(0)+8,{size:24,color:C.x,weight:700});
  s+=label('78.4 m',P.rx+18,YW-10,{size:24,color:hiW>.5?C.hi:C.x,weight:700});}
 return fade(g,s);
}
// y の向き（下向き 正）
const yDir=(g=1)=>fade(g,arrow(P.rx+110,Ym(8),P.rx+110,Ym(30),{color:C.x,w:4,head:14})+tex(Yt,P.rx+138,Ym(19)+4,{size:34,auto:false})+label('下向き 正',P.rx+90,Ym(36)+4,{size:22,color:C.dim}));
function scene({stone=0,hand0=0,open=0,g=1,water0=1,hiW=0,dir=1,labs=1}={}){
 let s=water()+bridge()+ruler({hiW,labs})+(dir?yDir(dir):'');
 if(hand0)s+=fade(hand0,hand(P.sx,Ym(0)-14,open));
 if(stone!==null)s+=ball(P.sx,Ym(stone),{r:13});
 return fade(g,s);
}
// 1 s ごとの位置（ストロボ）。n＝表示する点の数（1〜4）、o＝濃さ
function strobe(n,{o=1,lab=1,cur=-1}={}){
 let s='';
 for(let i=0;i<=Math.min(4,n);i++){const y=Ym(fallM(i));
  s+=fade(o*(i===cur?1:.55),ball(P.sx,y,{r:11}));
  if(lab)s+=fade(o,label(`${i} s`,P.sx+26,y+(i===0?-16:8),{size:22,color:C.t,weight:700}));}
 return s;
}
// ---- v-t グラフ -----------------------------------------------------------------------------------
function vt({g=1,x=690,y=445,w=400,h=320}={}){return axes({x,y,w,h,xmax:4.6,ymax:45,xlabel:'t [s]',ylabel:'速度 v [m/s]',xticks:[1,2,3,4],yticks:[10,20,30,40],grid:true,g,xcolor:C.t,ycolor:C.v});}
function vLine(A,{p=1,dots=1,labs=1,hi4=0,lab3=0}={}){
 let s=A.plot(t=>GG*t,{from:0,to:4,p,color:C.v,w:4,steps:2});
 const vs=['9.8','19.6','29.4','39.2'];
 for(let i=1;i<=4;i++){const o=clamp((p-(i-1)/4)*4);if(o<=0)continue;
  s+=fade(o*dots,dot(A.X(i),A.Y(GG*i),7,i===4&&hi4>.5?C.hi:C.v));
  if(labs)s+=fade(o,label(vs[i-1],A.X(i)-12,A.Y(GG*i)-14,{size:22,color:i===4&&hi4>.5?C.hi:C.v,anchor:'end',weight:700}));}
 if(hi4)s+=fade(hi4,line(A.X(0),A.Y(39.2),A.X(4),A.Y(39.2),{color:C.hi,w:2,dash:'6 6'})+line(A.X(4),A.Y(0),A.X(4),A.Y(39.2),{color:C.hi,w:2,dash:'6 6'}));
 if(lab3)s+=fade(lab3,ring(A.X(3),A.Y(29.4),14,{color:C.hi,w:3})+label('3 s 後',A.X(3)+20,A.Y(29.4)+30,{size:24,color:C.hi,weight:700}));
 return s;
}
const T=(src,x,y,o={})=>tex(src,x,y,{size:40,...o});
const half='\\tfrac12';

export const qxHsMFreefall1Diagrams={
 // ================= 問題アニメ：出題中（小問1〜3 共通、約3秒＋静止）=================
 // 橋・水面・物差し（0〜78.4 m、下向きに y）。手が開いて小石を静かに離す瞬間まで。右に v-t グラフの軸だけ。
 // 出さないもの：落ちる途中の点・着く時刻・グラフの直線。
 [K+'q0']:(p)=>{
  let s=scene({stone:0,hand0:1,open:seg(p,.45,.8)});
  s+=vt().svg;
  return s;
 },
 // ================= S1 小問1 =================
 // 1. 出題中の図を再生して静止。前提タグ、g＝9.8 m/s²
 [K+'setup']:(p,ctx)=>{
  const t=cueT(ctx),pp=clamp(t/3);
  let s=scene({stone:0,hand0:1,open:seg(pp,.45,.8)})+vt().svg;
  s+=kindTag('前提',860,40,{text:'空気抵抗なし',g:seg(p,.45,.55)});
  s+=fade(seg(p,.6,.7),tex(Gt+'=9.8\\ \\mathrm{m/s^2}',1110,36,{size:30,auto:false}));
  return s;
 },
 // 2. 求めるもの：水面に着くまでの時間。水面の目盛りを黄、横に金の「？ s」
 [K+'goal1']:(p,ctx)=>{
  const hi=seg(p,.3,.45)*(.6+.4*Math.sin(cueT(ctx)*5)**2);
  let s=scene({stone:0,hand0:1-seg(p,0,.15),open:1,hiW:hi})+vt().svg;
  s+=fade(seg(p,.35,.5),label('？ s',P.rx+120,YW-12,{size:34,color:C.t,weight:700}));
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 3. 下向き正：v₀＝0、a＝g → 第2式の v₀t を消して y＝½gt²
 [K+'law']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=scene({stone:0});
  s+=card(560,100,620,120,label('v₀ ＝ 0',730,175,{size:38,color:C.v,anchor:'middle',weight:700})+label('a ＝ g',1000,175,{size:38,color:C.a,anchor:'middle',weight:700}),seg(p,.1,.22),C.faint);
  const k1=seg(p,b+.02,b+.1),k2=seg(p,b+.3,b+.4),k3=seg(p,b+.5,b+.6);
  let eq=fade(1-k3,fade(1-k2,T(Yt+'=v_0t+'+half+'at^2',870,300))+fade(k2,T(Yt+'={\\color{#ff6b6b}\\cancel{\\color{#9aabc7}v_0t}}+'+half+Gt+'t^2',870,300)));
  eq+=fade(k3,T(Yt+'='+half+Gt+'t^2',870,300,{size:50}));
  s+=card(560,240,620,130,eq,k1,k3>.5?C.hi:C.faint);
  s+=fade(k1,label('第2式',580,400,{size:24,color:C.dim}));
  s+=fade(k2*(1-k3),label('v₀ ＝ 0 で 消える',870,400,{size:24,color:C.v,anchor:'middle',weight:700}));
  s+=goalTag(G1);
  return s;
 },
 // 4. 水面は y＝78.4 → 78.4＝½×9.8×t²（一つずつ入れる）
 [K+'sub']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=scene({stone:0,hiW:seg(p,.05,.2)});
  s+=fade(seg(p,.1,.25),label('y ＝ 78.4',P.rx+20,YW-46,{size:28,color:C.hi,weight:700}));
  const k1=seg(p,b+.05,b+.15),k2=seg(p,b+.3,b+.4);
  let eq=fade(1-k1,T(Yt+'='+half+Gt+'t^2',870,200,{size:46}));
  eq+=fade(k1*(1-k2),T('{\\color{#ffe28a}78.4}='+half+Gt+'t^2',870,200,{size:46}));
  eq+=fade(k2,T('78.4='+half+'\\times{\\color{#ffe28a}9.8}\\times t^2',870,200,{size:46}));
  s+=card(560,120,620,150,eq,seg(p,.02,.12),C.faint);
  s+=goalTag(G1);
  return s;
 },
 // 5. 両辺を2倍 → 9.8 で割る → t²＝16 → t＝±4 のうち 時間は正 で t＝4 s
 [K+'solve']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55;
  let s=fade(.35,scene({stone:0,dir:0}));
  s+=card(560,96,620,370,'',1,C.faint);
  s+=T('78.4='+half+'\\times 9.8\\times t^2',870,150,{size:38});
  s+=fade(seg(p,.05,.15),T('156.8=9.8\\,t^2',870,225,{size:38})+label('両辺を 2倍',1170,232,{size:22,color:C.hi,anchor:'end'}));
  s+=fade(seg(p,b*.55,b*.55+.08),T('t^2=16',870,300,{size:40})+label('9.8 で 割る',1170,307,{size:22,color:C.hi,anchor:'end'}));
  const m=seg(p,b+.02,b+.1),x=seg(p,b+.2,b+.28),f=seg(p,b+.45,b+.55);
  s+=fade(m*(1-x*.6),T('t=-4',720,390,{size:40}));
  s+=fade(x,line(670,382,780,382,{color:'#ff6b6b',w:4})+label('時間は 正',725,440,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(m,T('t=4\\ \\mathrm{s}',990,390,{size:44,color:C.t,auto:false}));
  s+=fade(f,rect(915,350,150,64,{fill:C.t,fo:.12,stroke:C.t,sw:3,rx:10}));
  s+=goalTag(G1);
  return s;
 },
 // 6. 小問1 の答え C。誤答 A（16 s）
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),a=W[0][1]*.7,b=W[1]?W[1][0]:.5;
  let s=scene({stone:0,dir:0});
  s+=card(560,100,620,110,T('t^2=16\\ \\rightarrow\\ t=4\\ \\mathrm{s}',870,165,{size:42}),1,C.t);
  s+=goalTag(G1)+A1(seg(p,a,a+.08));
  s+=wrongCard('A','16 s','t² で 止めた（単位は s²）',{x:560,w:620,y:250,mid:'t^2=16\\ \\mathrm{s^2}',midSize:32,g:seg(p,b,b+.05)});
  return s;
 },
 // 7. 誤答 B（8 s）、誤答 D（約 2.8 s）。1枚ずつ
 [K+'wrongBD']:(p,ctx)=>{
  let s=scene({stone:0,dir:0});
  s+=card(560,100,620,110,T('t^2=16\\ \\rightarrow\\ t=4\\ \\mathrm{s}',870,165,{size:42}),1,C.t);
  s+=wrongSeq(p,ctx,[['B','8 s','速さ 一定 9.8 m/s と した',{mid:'78.4\\div 9.8=8'}],['D','約 2.8 s','½ を 落として t²＝8',{mid:'78.4=9.8\\,t^2\\ \\rightarrow\\ t^2=8'}]],{opts:{x:560,w:620,y:250,midSize:30}});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // 8. 実際の小石：1 s ごとの位置に点を残して落ちる（実時間 4 s）
 [K+'strobe']:(p,ctx)=>{
  const t=clamp(cueT(ctx)-.5,0,4);
  let s=scene({stone:null,dir:0});
  s+=strobe(Math.floor(t+1e-6),{o:1,lab:1});
  s+=ball(P.sx,Ym(fallM(t)),{r:13});
  s+=fade(seg(p,.05,.15),label('1 s ごとの 位置',P.rx+40,Ym(50),{size:24,color:C.t,weight:700}));
  s+=fade(clamp((cueT(ctx)-1.6)/.4),label('間隔が 広がる',P.rx+40,Ym(60),{size:28,color:C.hi,weight:700}));
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // ================= S2 小問2 =================
 // 9. 求めるもの：着く直前の速さ。水面すれすれの小石に紫の「？ m/s」
 [K+'goal2']:(p)=>{
  let s=scene({stone:null})+strobe(3,{o:.5,lab:0});
  s+=ball(P.sx,YW-14,{r:13});
  s+=arrow(P.sx-40,YW-60,P.sx-40,YW-10,{color:C.v,w:5,head:14,g:seg(p,.3,.45)});
  s+=fade(seg(p,.35,.5),label('？ m/s',P.sx-56,YW-30,{size:30,color:C.v,anchor:'end',weight:700}));
  s+=vt().svg;
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 10. v＝gt の直線（ここで初めて描く）。t＝1〜4 に 9.8、19.6、29.4、39.2。t＝4 の高さを黄
 [K+'vt']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  const A=vt();
  let s=scene({stone:null})+strobe(3,{o:.5,lab:0})+ball(P.sx,YW-14,{r:13});
  s+=A.svg+vLine(A,{p:lin(p,.08,b-.02),hi4:seg(p,b+.3,b+.4)});
  s+=fade(seg(p,.05,.15),tex('v='+Gt+'t',770,215,{size:38}));
  s+=fade(seg(p,.25,.35),label('毎秒 ＋9.8',770,262,{size:24,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,b+.1,b+.2),tex('9.8\\times 4=39.2\\ \\mathrm{m/s}',505,380,{size:28,auto:false,color:C.hi}));
  s+=goalTag(G2);
  return s;
 },
 // 11. 小問2 の答え B。誤答 A（9.8 m/s）
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),a=W[0][1]*.7,b=W[1]?W[1][0]:.5,A=vt(),cd=seg(p,b,b+.05);
  let s=fade(1-.8*cd,scene({stone:null})+strobe(3,{o:.5,lab:0})+ball(P.sx,YW-14,{r:13}));
  s+=A.svg+vLine(A,{hi4:1});
  s+=goalTag(G2)+A2(seg(p,a,a+.08));
  s+=wrongCard('A','9.8 m/s','g（m/s²）を 速さと した',{x:20,w:620,y:180,g:cd});
  return s;
 },
 // 12. 誤答 C（19.6：平均の速さ）、誤答 D（29.4：3 s 後）。D の間、グラフの t＝3 に「3 s 後」
 [K+'wrongCD']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,A=vt();
  let s=fade(.2,scene({stone:null})+strobe(3,{o:.5,lab:0})+ball(P.sx,YW-14,{r:13}));
  s+=A.svg+vLine(A,{hi4:1,lab3:seg(p,b+.02,b+.1)});
  s+=wrongSeq(p,ctx,[['C','19.6 m/s','平均の 速さ',{mid:'78.4\\div 4=19.6'}],['D','29.4 m/s','3 s 後の 速さ（着くのは 4 s）',{mid:'9.8\\times 3=29.4'}]],{opts:{x:20,w:620,y:180,midSize:30}});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // ================= S3 小問3 =================
 // 13. 求めるもの：3〜4 s に落ちる距離。グラフの 3〜4 s を金で
 [K+'goal3']:(p)=>{
  const A=vt();
  let s=scene({stone:null})+strobe(4,{o:1,lab:1});
  s+=A.svg+vLine(A,{labs:0});
  const g=seg(p,.3,.45);
  s+=fade(g,rect(A.X(3),A.Y(45),A.X(4)-A.X(3),A.Y(0)-A.Y(45),{fill:C.t,fo:.16,stroke:C.t,sw:2,rx:2})+label('3〜4 s',(A.X(3)+A.X(4))/2,A.Y(0)+62,{size:26,color:C.t,anchor:'middle',weight:700}));
  s+=fade(g,rect(P.sx-28,Ym(fallM(3))-16,62,YW-Ym(fallM(3))+16,{fill:'none',fo:0,stroke:C.t,sw:3,rx:10}));
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 14. 3 秒後までに落ちた距離：½×9.8×3²＝44.1 m（物差しに点）
 [K+'d3']:(p)=>{
  const A=vt(),go=1-seg(p,0,.12);
  let s=scene({stone:null,dir:0})+strobe(4,{o:1,lab:1,cur:3});
  s+=fade(go,A.svg+vLine(A,{labs:0}));
  const y3=Ym(44.1),g=seg(p,.35,.5);
  s+=fade(g,dot(P.rx,y3,9,C.hi)+line(P.sx+64,y3,P.rx,y3,{color:C.hi,w:2,dash:'5 5'})+label('44.1 m',P.rx+18,y3+8,{size:26,color:C.hi,weight:700}));
  s+=card(640,140,540,130,tex(half+'\\times 9.8\\times 3^2=44.1\\ \\mathrm{m}',910,210,{size:38,auto:false}),seg(p,.1,.25),C.x);
  s+=fade(seg(p,.1,.25),label('t ＝ 3 s',910,128,{size:26,color:C.t,anchor:'middle',weight:700}));
  s+=goalTag(G3);
  return s;
 },
 // 15. 44.1 から 78.4 までの水色の帯「34.3」。小問3 の答え D
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6,y3=Ym(44.1);
  let s=scene({stone:null,dir:0})+strobe(4,{o:1,lab:1});
  s+=dot(P.rx,y3,9,C.hi)+label('44.1 m',P.rx+18,y3+8,{size:26,color:C.hi,weight:700});
  const g=seg(p,.15,.3);
  s+=fade(g,rect(P.rx+120,y3,26,YW-y3,{fill:C.x,fo:.4,stroke:C.x,sw:2,rx:3})+label('34.3 m',P.rx+160,(y3+YW)/2+10,{size:30,color:C.x,weight:700}));
  s+=card(640,140,540,130,tex('78.4-44.1=34.3\\ \\mathrm{m}',910,210,{size:40,auto:false}),seg(p,.05,.2),C.x);
  s+=goalTag(G3)+A3(seg(p,b+.12,b+.2));
  return s;
 },
 // 16. 1 秒ごとの区間 4.9、14.7、24.5、34.3。比 1：3：5：7（黄）
 [K+'ratio']:(p,ctx)=>{
  const W=sentWin(ctx);
  let s=scene({stone:null,labs:0,dir:0})+strobe(4,{o:1,lab:1});
  s+=bands((i)=>seg(p,.05+i*.1,.13+i*.1));
  s+=card(700,120,480,190,label('4.9 ： 14.7 ： 24.5 ： 34.3',940,185,{size:30,color:C.x,anchor:'middle',weight:700})+fade(seg(p,.6,.7),label('＝ 1 ： 3 ： 5 ： 7',940,260,{size:38,color:C.hi,anchor:'middle',weight:700})),seg(p,.45,.55),C.x);
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 17. 誤答 A（44.1：0〜3 s）、誤答 C（24.5：3 s 目の区間）。該当する帯を赤の枠で
 [K+'wrongAC']:(p,ctx)=>{
  // 文は1つ（「、」で区切って誤答 A・C）。句の読みの長さで区間を決める
  const wins=partWin(ctx,[[0],[1,2]]),c0=wins[1][0];
  const ra=seg(p,.01,.05)*(1-seg(p,c0-.04,c0-.005)),rc=seg(p,c0+.01,c0+.05);
  let s=scene({stone:null,labs:0,dir:0})+strobe(4,{o:1,lab:1});
  s+=bands(()=>1);
  s+=fade(ra,rect(P.rx+110,Ym(0)-4,140,Ym(44.1)-Ym(0)+8,{fill:'none',fo:0,stroke:'#ff6b6b',sw:4,rx:6}));
  s+=fade(rc,rect(P.rx+110,Ym(19.6)-4,140,Ym(44.1)-Ym(19.6)+8,{fill:'none',fo:0,stroke:'#ff6b6b',sw:4,rx:6}));
  s+=wrongSeq(p,ctx,[['A','44.1 m','0〜3 s の 距離'],['C','24.5 m','1：3：5 の 5 で 止めた']],{win:wins,opts:{x:640,w:540,y:200}});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 18. 誤答 B（39.2 m）。v-t グラフの 3〜4 s：長方形（39.2×1）と台形（34.3）、はみ出す三角形を赤
 [K+'wrongB']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  const A=axes({x:90,y:470,w:520,h:330,xmax:4.6,ymax:45,xlabel:'t [s]',ylabel:'速度 v [m/s]',xticks:[1,2,3,4],yticks:[10,20,30,40],grid:true,xcolor:C.t,ycolor:C.v});
  let s=A.svg+A.plot(t=>GG*t,{from:0,to:4,color:C.v,w:4,steps:2});
  const X3=A.X(3),X4=A.X(4),Y0=A.Y(0),Y29=A.Y(29.4),Y39=A.Y(39.2);
  const r=seg(p,.05,.15),tz=seg(p,b+.02,b+.12),tri=seg(p,b+.3,b+.4);
  s+=fade(r,rect(X3,Y39,X4-X3,Y0-Y39,{fill:'none',fo:0,stroke:C.dim,sw:3,rx:0})+label('39.2',X3-10,Y39+8,{size:22,color:C.v,anchor:'end',weight:700}));
  s+=fade(tz,poly([[X3,Y0],[X4,Y0],[X4,Y39],[X3,Y29]],{fill:C.x,fo:.35,stroke:C.x,sw:2})+label('29.4',X3-10,Y29+8,{size:22,color:C.v,anchor:'end',weight:700}));
  s+=fade(tri,poly([[X3,Y29],[X3,Y39],[X4,Y39]],{fill:'#ff6b6b',fo:.45,stroke:'#ff6b6b',sw:2}));
  s+=card(650,96,530,110,tex('\\dfrac{29.4+39.2}{2}\\times 1=34.3',915,152,{size:34,auto:false}),tz,C.x);
  s+=fade(tri,label('はみ出した 分だけ 多い',915,240,{size:26,color:'#ff6b6b',anchor:'middle',weight:700}));
  s+=wrongCard('B','39.2 m','直前の 速さで 1秒 落ちた と した',{x:650,w:530,y:280,mid:'39.2\\times 1=39.2',midSize:30,g:seg(p,.12,.18)});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // ================= S4 まとめ =================
 // 19. 大小2つの石を並べて落とす（実時間 4 s）。同時に水面に着く
 [K+'same']:(p,ctx)=>{
  const t=clamp(cueT(ctx)-.4,0,4),y=Ym(fallM(t));
  let s=water()+bridge()+ruler({labs:1});
  s+=ironBall(P.sx-6,y-10,24)+ball(P.sx+66,y,{r:11});
  s+=fade(seg(p,.03,.12),label('重い',P.sx-6,Ym(0)-44,{size:24,color:C.ink,anchor:'middle',weight:700})+label('軽い',P.sx+66,Ym(0)-44,{size:24,color:C.ink,anchor:'middle',weight:700}));
  for(const x of [P.sx-6,P.sx+66])s+=arrow(x+40,Ym(4),x+40,Ym(16),{color:C.a,w:4,head:12,g:seg(p,.05,.15)});
  s+=fade(seg(p,.05,.15),label('同じ g',P.sx+150,Ym(12),{size:26,color:C.a,weight:700}));
  s+=card(680,120,460,90,label(`t ＝ ${t.toFixed(1)} s`,910,178,{size:36,color:C.t,anchor:'middle',weight:700}),seg(p,.02,.1),C.t);
  s+=fade(clamp((cueT(ctx)-4.4)/.4),label('同じ 4 秒で 水面に 着く',910,290,{size:32,color:C.hi,anchor:'middle',weight:700}));
  s+=note('（空気抵抗 なし）',910,340,{g:seg(p,.05,.15)});
  return s;
 },
 // 20. 二つの式を黄で囲む
 [K+'sum']:(p)=>{
  let s=card(150,90,900,110,label('自由落下：v₀ ＝ 0、a ＝ g の 等加速度運動',600,158,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.02,.15));
  s+=card(150,250,420,140,tex('v='+Gt+'t',360,325,{size:54}),seg(p,.5,.62),C.hi);
  s+=card(630,250,420,140,tex(Yt+'='+half+Gt+'t^2',840,325,{size:54}),seg(p,.6,.72),C.hi);
  return s;
 },
};
// 1 秒ごとの区間の帯（物差しの右）。gi(i)＝i 本目の濃さ
function bands(gi){
 const ms=[0,4.9,19.6,44.1,78.4],ds=['4.9','14.7','24.5','34.3'];let s='';
 for(let i=0;i<4;i++){const y1=Ym(ms[i]),y2=Ym(ms[i+1]),g=gi(i);
  s+=fade(g,rect(P.rx+120,y1+1,26,y2-y1-2,{fill:C.x,fo:.4,stroke:C.x,sw:2,rx:3})+label(`${ds[i]} m`,P.rx+160,(y1+y2)/2+9+(i===0?4:0),{size:26,color:C.x,weight:700}));}
 return s;
}

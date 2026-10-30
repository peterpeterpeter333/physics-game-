// 問題編 解説「押すのをやめた台車」(ys-qx-hs-m-force-1) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/106_力と運動方程式.md の q-hs-m-force-1（解説 18 行）。
// 色（単元動画と同じ）：力 F 緑の太い矢印、加速度 a 赤、速度 v 紫、時間 t 金、床の目盛り 水色、強調 黄。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。答えの札は右上に積む（y＝8, 70, 132）。
// 元の単元動画（yt1-hs-m-force-1）の部品（FA, VA, cartF, T2）を読み込んで使う（そのファイルは編集しない）。
import {C,seg,lin,fade,label,line,rect,dot,ring,arrow,tex,clamp} from './anim.mjs';
import {FA,VA,cartF,box,T2} from './yt1-hs-m-force-1-diagrams.mjs';
import {card,goalTag,answerTag,wrongSeq,wrongCard,pauseBadge,note,cueT,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-hs-m-force-1:';
const G1='引いている間の加速度 a',G2='3.0 秒後の速さ v',G3='手を離した後の速さ';
const ATAG=[['C','2.5 m/s²'],['A','7.5 m/s'],['D','7.5 m/s のまま']];
// 小問 n までの答えの札（右上に積む）。最後の札だけ g で出す
const ans=(n,g=1)=>ATAG.slice(0,n).map(([l,v],i)=>answerTag(i+1,l,v,{y:8+62*i,g:i===n-1?g:1})).join('');
// 読みの中の言葉 marker が読まれ始める所（cue の進み 0〜1）
function at(ctx,marker,fb=.5){
 const r=(ctx?.cue?.reading??'').replace(/\s/g,''),m=marker.replace(/\s/g,''),i=r.indexOf(m);
 return i<0||!r.length?fb:i/r.length*voiceEnd(ctx);
}
// ---- the cart on the floor --------------------------------------------------------------------------
const PX=35,X0=200;                               // 1 m ＝ 35 px（引いている間は実時間で動かす）
export const xPull=t=>t<=3?X0+PX*.5*2.5*t*t:X0+PX*(11.25+7.5*(t-3));
function ruler(GY,{x0=40,x1=1160,lit=[],off=0}={}){
 let s=line(x0,GY,x1,GY,{color:C.dim,w:3});
 for(let x=x0+((off%40)+40)%40;x<x1;x+=40){const big=Math.round((x-x0-off)/40)%5===0;s+=line(x,GY+4,x,GY+(big?24:14),{color:C.x,w:big?3:2});}
 for(const [x,g] of lit)s+=fade(g,rect(x-14,GY+2,28,28,{fill:C.hi,fo:.25,stroke:C.hi,sw:2,rx:6}));
 return s;
}
function hand(x,y,{g=1}={}){   // the hand holding the handle at the front of the cart; (x,y) ＝ the cart's front edge
 return fade(g,line(x,y,x+34,y,{color:C.dim,w:5})+rect(x+30,y-18,46,36,{fill:'#e9c7a6',fo:1,stroke:'none',rx:14})+rect(x+70,y-10,60,20,{fill:'#e9c7a6',fo:.9,stroke:'none',rx:9}));
}
// x＝台車の中心、GY＝床。force＝緑の矢印、handG＝手、sel＝点線の囲み（selHi で黄）
function cartScene(x,{x1=1160,GY=400,force=0,forceHi=0,handG=0,handOff=0,sel=1,selHi=0,dimOut=0,vel=0,vLen=0,vLab='',flo=1,lit=[],rulerOff=0,ghosts=[]}={}){
 let s=fade(flo*(1-.65*dimOut),ruler(GY,{lit,off:rulerOff,x1}));
 for(const [gx,go] of ghosts)s+=fade(go,cartF(gx,GY,{text:''}));
 s+=cartF(x,GY,{text:'4.0 kg',size:26});
 if(sel)s+=fade(sel,`<rect x="${x-92}" y="${GY-104}" width="184" height="112" rx="16" fill="none" stroke="${selHi>.5?C.hi:C.dim}" stroke-width="${selHi>.5?3.5:2.5}" stroke-dasharray="9 8"/>`);
 if(handG)s+=fade(1-.65*dimOut,hand(x+75+handOff,GY-26,{g:handG*(1-clamp(handOff/60))}));
 if(force){
  if(forceHi)s+=fade(forceHi,line(x+80,GY-62,x+230,GY-62,{color:C.hi,w:20,cap:'round'}));
  s+=FA(x+80,GY-62,x+230,GY-62,{g:force,text:'10 N',size:28,dy:-22});
 }
 if(vel&&vLen>2){s+=VA(x-40,GY-128,x-40+vLen,GY-128,{g:vel,w:6,head:18});
  if(vLab)s+=fade(vel,label(vLab,x-40+vLen/2,GY-146,{size:28,color:C.v,anchor:'middle',weight:700}));}
 return s;
}
// 金の時計（左上の札の下）
function clock(t,{g=1,hi=0,x=30,y=92,txt}={}){
 const s=txt??(t<=0?'0 s':`${t.toFixed(1)} s`),cx=x+36,cy=y+31,ang=2*Math.PI*(t/3)-Math.PI/2;
 let o=ring(cx,cy,20,{color:C.t,w:3})+line(cx,cy,cx+15*Math.cos(ang),cy+15*Math.sin(ang),{color:C.t,w:3});
 o+=label(s,x+70,y+41,{size:30,color:hi>.5?C.hi:C.t,weight:700});
 return card(x,y,210,62,o,g,C.t)+(hi?fade(hi*g,rect(x-6,y-6,222,74,{fill:'none',fo:0,stroke:C.hi,sw:3.5,rx:16})):'');
}
// 出題中の図（時刻 t 秒、0〜6）。0〜1 床と台車、1〜2 手と 10 N と時計 0 s、2〜5 時計 0→3.0 s で動く、5〜6 手が離れ矢印が消えて一時停止
function setupAt(t){
 const tp=clamp(t-2,0,3),x=xPull(tp),rel=seg(t,5,5.4);
 let s=fade(seg(t,0,.6),cartScene(x,{force:seg(t,1,1.5)*(1-rel),handG:seg(t,1,1.4),handOff:70*rel,sel:1}));
 s+=clock(tp,{g:seg(t,1.2,1.6)});
 s+=pauseBadge({g:seg(t,5.4,5.7)});
 return s;
}
// ---- 式の札 ------------------------------------------------------------------------------------------
const eqCard=(inner,g=1,{x=640,y=100,w=540,h=200,col=C.a}={})=>card(x,y,w,h,inner,g,col);
const strike=(x1,y1,x2,y2,g=1)=>fade(g,line(x1,y1,x2,y2,{color:C.a,w:4}));
// 速さの数字の並び（行9〜11）
function vList(t,{g=1,hi0=0,x=250,y=150}={}){
 const vals=['0','2.5','5.0','7.5'];let o='';
 vals.forEach((v,i)=>{const X=x+60+i*150,on=seg(t,i-.05,i+.15);
  o+=fade(on,label(v,X,y+42,{size:32,color:C.v,anchor:'middle',weight:700})+label(`${i} s`,X,y+76,{size:22,color:C.t,anchor:'middle'}));
  if(i<3)o+=fade(seg(t,i+.85,i+1),label('→',X+75,y+40,{size:28,color:C.dim,anchor:'middle'}));});
 o+=fade(seg(t,2.9,3),label('m/s',x+560,y+42,{size:26,color:C.v,weight:700}));
 if(hi0)o+=fade(hi0,ring(x+60,y+31,30,{color:C.hi,w:3.5}));
 return card(x,y,640,96,o,g,C.v);
}
// v-t グラフ（行12）
function vtGraph({g=1,mid=0}={}){
 const ox=300,oy=310,W=360,Hh=180,X=t=>ox+W*t/3,Y=v=>oy-Hh*v/7.5;
 let o=arrow(ox,oy,ox+W+50,oy,{color:C.dim,w:3,head:12})+arrow(ox,oy,ox,oy-Hh-46,{color:C.dim,w:3,head:12});
 o+=label('t',ox+W+64,oy+8,{size:28,color:C.t,weight:700})+label('v',ox-10,oy-Hh-56,{size:28,color:C.v,weight:700,anchor:'end'});
 o+=line(X(0),Y(0),X(3),Y(7.5),{color:C.v,w:5});
 o+=line(X(3),oy,X(3),Y(7.5),{color:C.faint,w:2,dash:'5 6'})+label('3.0 s',X(3),oy+30,{size:24,color:C.t,anchor:'middle',weight:700});
 o+=dot(X(3),Y(7.5),9,C.hi)+label('7.5',X(3)+18,Y(7.5)+8,{size:28,color:C.hi,weight:700});
 o+=label('0',ox-14,oy+8,{size:24,color:C.dim,anchor:'end'});
 if(mid){o+=fade(mid,line(ox,Y(3.75),X(3),Y(3.75),{color:C.dim,w:3,dash:'8 7'})+label('3.8',ox-14,Y(3.75)+8,{size:26,color:C.dim,anchor:'end',weight:700}));
  const cx=X(3),cy=Y(3.75);o+=fade(mid,line(cx-14,cy-14,cx+14,cy+14,{color:'#ff6b6b',w:5})+line(cx-14,cy+14,cx+14,cy-14,{color:'#ff6b6b',w:5}));}
 return fade(g,o);
}
// 床をすべって止まる箱（行16〜17 の小さな枠）
function slideBox(t,{g=1,x=640,y=200,w=530,h=135}={}){
 const T=2.2,tt=t%(T+1.4),u=Math.min(tt,T),bx=x+80+260*(u/T-.5*(u/T)**2)*2*0.5,moving=tt<T;
 let o=line(x+20,y+h-22,x+w-20,y+h-22,{color:C.dim,w:3});
 for(let q=x+30;q<x+w-20;q+=22)o+=line(q,y+h-20,q-10,y+h-10,{color:C.faint,w:2});
 o+=rect(bx-38,y+h-82,76,60,{fill:'#c9a46a',fo:.55,stroke:'#c9a46a',rx:6})+label('箱',bx,y+h-43,{size:24,color:C.ink,anchor:'middle',weight:700});
 if(moving)o+=FA(bx-40,y+h-28,bx-110,y+h-28,{w:6,head:16});
 o+=label(moving?'摩擦が 速度を 減らす':'止まった',x+w-24,y+34,{size:24,color:moving?C.F:C.dim,anchor:'end',weight:700});
 return card(x,y,w,h,o,g,C.dim);
}

export const qxHsMForce1Diagrams={
 // ================= 問題アニメ：出題中（小問1〜3 共通、6 秒＋静止）=================
 // 床・水色の目盛り・台車（4.0 kg）・点線の囲み → 手と緑の 10 N・金の時計 0 s → 時計 0→3.0 s で右へ動く（速度・加速度は出さない）
 // → 3.0 s で手が離れ、緑の矢印が消えた瞬間で「映像を一時停止」（台車は止まっていない。手を離した後の動きは見せない）。
 [K+'q0']:(p)=>setupAt(6*p),
 // ================= S1 小問1：加速度 =================
 // 1. 出題中の図を再生（実時間）。3.0 s で手が離れ、一時停止
 [K+'setup']:(p,ctx)=>setupAt(Math.min(6,cueT(ctx)*1.0)),
 // 2. 時計を 0 s に戻し、手が引いている場面。求めるもの
 [K+'goal1']:(p)=>cartScene(X0,{force:1,handG:1})+clock(0)+goalTag(G1,{g:seg(p,.03,.15)}),
 // 3. 台車の点線の囲みを黄、外を薄く。「10ニュートンだけ」で矢印を黄で縁取る
 [K+'sel']:(p,ctx)=>{
  const a=at(ctx,'じゅうニュートン',.6);
  return cartScene(X0,{force:1,handG:1,selHi:seg(p,.05,.15),dimOut:seg(p,.05,.2),forceHi:seg(p,a,a+.06)})+clock(0)+goalTag(G1);
 },
 // 4. ma＝F → 両辺を m で割る → a＝F/m
 [K+'eq']:(p,ctx)=>{
  const a=at(ctx,'エーイコールエムぶんの',.6);
  let s=cartScene(X0,{force:1,handG:1})+clock(0);
  let o=fade(1-seg(p,a-.02,a+.02),T2('ma=F',910,180,{size:52}));
  o+=fade(seg(p,a,a+.04)*(1-seg(p,a+.2,a+.24)),T2('\\dfrac{\\cancel{m}a}{\\cancel{m}}=\\dfrac{F}{m}',910,190,{size:48}));
  o+=fade(seg(p,a+.24,a+.28),T2('a=\\dfrac{F}{m}',910,190,{size:56}));
  o+=fade(seg(p,a,a+.04)*(1-seg(p,a+.2,a+.24)),label('両辺を m で 割る',910,275,{size:24,color:C.dim,anchor:'middle',weight:700}));
  s+=eqCard(o,seg(p,.05,.15));
  return s+goalTag(G1);
 },
 // 5. a＝F/m に 10 と 4.0 → 2.5 m/s²。「答えはC」で札
 [K+'ans1']:(p,ctx)=>{
  const b=at(ctx,'しょうもんいちの',.6);
  let s=cartScene(X0,{force:1,handG:1})+clock(0);
  let o=fade(1-seg(p,.12,.16),T2('a=\\dfrac{F}{m}',910,190,{size:56}));
  o+=fade(seg(p,.14,.18)*(1-seg(p,.4,.44)),T2(`a=\\dfrac{{\\color{${C.F}}10}}{4.0}`,910,190,{size:54}));
  o+=fade(seg(p,.42,.46),T2(`a=\\dfrac{{\\color{${C.F}}10}}{4.0}={\\color{${C.a}}2.5\\ \\mathrm{m/s^2}}`,910,190,{size:46}));
  s+=eqCard(o,1);
  return s+goalTag(G1)+ans(1,seg(p,b,b+.06));
 },
 // 6. 誤答 A（F×m）、誤答 B（m÷F）を1枚ずつ。単位：N＝kg·m/s²、N÷kg で kg が消えて m/s²
 [K+'wrongAB']:(p,ctx)=>{
  const b=at(ctx,'ビーの',.45),c=at(ctx,'どちらも',.75);
  let s=card(200,92,800,236,'',seg(p,.03,.12),C.dim);
  s+=fade(seg(p,.03,.12),T2('\\mathrm{N}=\\mathrm{kg\\cdot m/s^2}',600,138,{size:38}));
  s+=fade(seg(p,c,c+.06),T2('\\dfrac{\\mathrm{N}}{\\mathrm{kg}}=\\dfrac{\\cancel{\\mathrm{kg}}\\cdot\\mathrm{m/s^2}}{\\cancel{\\mathrm{kg}}}=\\mathrm{m/s^2}',600,262,{size:34}));
  s+=wrongSeq(p,ctx,[['A','40 m/s²','F×m にした（単位 kg·N）'],['B','0.40 m/s²','m÷F にした（単位 kg/N）']],{win:[[0,b],[b,1]]});
  return s+goalTag(G1)+ans(1);
 },
 // 7. 誤答 D（10 m/s²）。緑の「10 N」と赤の「a」の間に「≠」
 [K+'wrongD']:(p,ctx)=>{
  let s=card(300,110,600,170,'',1,C.dim);
  s+=fade(seg(p,.05,.15),label('10 N',470,215,{size:52,color:C.F,anchor:'middle',weight:700})+label('≠',600,215,{size:56,color:C.ink,anchor:'middle',weight:700})+label('a',730,215,{size:56,color:C.a,anchor:'middle',weight:700}));
  s+=wrongCard('D','10 m/s²','力の値を そのまま 使った',{g:seg(p,.04,.1)});
  return s+goalTag(G1)+ans(1);
 },
 // ================= S2 小問2：3.0 秒後の速さ =================
 // 8. 求めるもの。時計の 3.0 s を黄で
 [K+'goal2']:(p)=>cartScene(xPull(3),{GY:470,force:1,handG:1})+clock(3,{hi:seg(p,.3,.45)})+goalTag(G2,{g:seg(p,.03,.15)})+ans(1),
 // 9. 1 秒ごとに速度が 2.5 m/s ずつ増える（時計が進むと紫の矢印が同じ長さずつ伸びる）
 [K+'grow']:(p,ctx)=>{
  const t=clamp(cueT(ctx)-.8,0,3);
  let s=cartScene(xPull(t),{GY:470,force:1,handG:1,vel:1,vLen:30*2.5*t});
  s+=clock(t)+vList(t+.0001);
  return s+goalTag(G2)+ans(1);
 },
 // 10. 「止まっていた」で 0 を黄で囲む。v＝0＋2.5×3.0＝7.5。矢印に 7.5 m/s。答え A
 [K+'ans2']:(p,ctx)=>{
  const b=at(ctx,'しょうもんにの',.6),c=at(ctx,'なな',.4);
  let s=cartScene(xPull(3),{GY:470,force:1,handG:1,vel:1,vLen:225,vLab:seg(p,c,c+.04)>.5?'7.5 m/s':''});
  s+=clock(3)+vList(3.2,{hi0:seg(p,.03,.12)});
  s+=card(40,262,460,62,T2('v=0+2.5\\times 3.0=7.5',270,304,{size:36}),seg(p,.18,.28),C.v);
  return s+goalTag(G2)+ans(2,seg(p,b,b+.06));
 },
 // 11. 誤答 B（2.5 m/s）、誤答 D（30 m/s）を1枚ずつ
 [K+'wrongBD']:(p,ctx)=>{
  const b=at(ctx,'ディーの',.5);
  let s=vList(3.2,{x:280,y:140})+card(370,252,460,62,T2('v=0+2.5\\times 3.0=7.5',600,294,{size:36}),1,C.v);
  s+=wrongSeq(p,ctx,[['B','2.5 m/s','加速度の 値を そのまま 使った'],['D','30 m/s','10×3.0 で 止めた（単位 N·s）']],{win:[[0,b],[b,1]]});
  return s+goalTag(G2)+ans(2);
 },
 // 12. 誤答 C（3.8 m/s）。v-t グラフ：終点 7.5 を黄の点、真ん中 3.8 に点線と×
 [K+'wrongC']:(p,ctx)=>{
  let s=vtGraph({g:seg(p,.02,.1),mid:seg(p,.12,.25)});
  s+=fade(seg(p,.3,.4),label('3.0 秒後の 速さ',720,160,{size:24,color:C.hi,weight:700}));
  s+=fade(seg(p,.12,.25),label('平均の 速さ',720,224,{size:24,color:C.dim,weight:700}));
  s+=wrongCard('C','3.8 m/s','平均の 速さを 答えた',{g:seg(p,.45,.5)});
  return s+goalTag(G2)+ans(2);
 },
 // ================= S3 小問3：手を離した後 =================
 // 13. 求めるもの。時計が 2.0→3.0 s と進み、3.0 s で手が離れて矢印が消える（一時停止）
 [K+'goal3']:(p,ctx)=>{
  const t=clamp(2+cueT(ctx)*.5,2,3),rel=seg(cueT(ctx),2.1,2.6);
  let s=cartScene(xPull(t),{force:1-rel,handG:1,handOff:70*rel});
  s+=clock(t)+pauseBadge({g:seg(cueT(ctx),2.6,2.9),x:600,y:96});
  return s+goalTag(G3,{g:seg(p,.03,.15)})+ans(2);
 },
 // 14. 横の力 0 → ma＝0 → a＝0
 [K+'f0']:(p,ctx)=>{
  let s=cartScene(xPull(3),{force:0})+clock(3);
  const b=at(ctx,'エムエーイコールゼロ',.5),c=at(ctx,'かそくども',.75);
  let o=fade(1-seg(p,.12,.16),T2('ma=F',870,220,{size:52}));
  o+=fade(seg(p,.14,.18)*(1-seg(p,c-.02,c+.02)),T2(`ma={\\color{${C.F}}0}`,870,220,{size:52}));
  o+=fade(seg(p,c,c+.04),T2(`a=0`,870,220,{size:56}));
  s+=card(640,150,460,140,o,seg(p,.03,.1),C.a);
  s+=fade(seg(p,.03,.1),label('横の 力 0',420,180,{size:28,color:C.F,anchor:'middle',weight:700}));
  return s+goalTag(G3)+ans(2);
 },
 // 15. 速度は 7.5 m/s のまま、右へ進む。同じ時間に同じ距離（目盛りが等間隔に光る）。答え D
 [K+'coast']:(p,ctx)=>{
  const t=cueT(ctx),b=at(ctx,'しょうもんさんの',.6),sp=720/Math.max(4,ctx?.dur??10),x=150+sp*t;
  const lit=[];for(let k=0;k<=t+1e-6;k++)lit.push([150+sp*k,1]);
  let s=cartScene(x,{sel:0,vel:1,vLen:225,vLab:'7.5 m/s',lit});
  s+=fade(seg(t,2,2.6),label('同じ 時間に 同じ 距離',150,200,{size:28,color:C.hi,weight:700}));
  s+=note('（動きは ゆっくり 描いています）',300,490);
  return s+goalTag(G3)+ans(3,seg(p,b,b+.06));
 },
 // 16. 誤答 A。右に小さな枠：床をすべる箱が摩擦で止まる。この問題の床に摩擦の矢印を描き、×を付けて消す
 [K+'wrongA']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,fr=seg(p,.08,.14)*(1-seg(p,b-.06,b-.01));
  let s=cartScene(330,{GY:300,x1:600,sel:0,vel:1,vLen:225,vLab:'7.5 m/s'});
  s+=fade(fr,FA(250,288,160,288,{w:7,head:18})+line(185,268,225,308,{color:'#ff6b6b',w:5})+line(185,308,225,268,{color:'#ff6b6b',w:5}));
  s+=fade(seg(p,.08,.14),label('摩擦の ない 床',425,290,{size:24,color:C.dim,weight:700}));
  s+=slideBox(tAtLocal(ctx),{g:seg(p,b,b+.06)});
  s+=wrongCard('A','だんだん 遅くなる','止まるのは 摩擦の ため',{g:seg(p,.03,.08)});
  return s+goalTag(G3)+ans(3);
 },
 // 17. 誤答 B、誤答 C を1枚ずつ。小さな枠を消す
 [K+'wrongBC']:(p,ctx)=>{
  let s=cartScene(330,{GY:300,x1:600,sel:0,vel:1,vLen:225,vLab:'7.5 m/s'});
  s+=slideBox(cueT(ctx)+4,{g:1-seg(p,0,.08)});
  s+=fade(seg(p,.03,.1),label('摩擦の ない 床',425,290,{size:24,color:C.dim,weight:700}));
  s+=wrongSeq(p,ctx,[['B','すぐ 止まる','力は 速度を 変えるもの'],['C','速くなり 続ける','力 0 なら a＝0']]);
  return s+goalTag(G3)+ans(3);
 },
 // ================= S4 まとめ =================
 [K+'sum']:(p)=>{
  let s=fade(seg(p,.02,.1),ruler(270,{x1:1160})+cartF(140,270,{text:'4.0 kg',size:24})+FA(220,223,350,223,{text:'10 N',size:26,dy:-20}));
  s+=fade(seg(p,.05,.15),label('緑 10 N → a＝2.5 m/s² → 3.0 秒で 7.5 m/s',380,234,{size:28,color:C.ink,weight:700}));
  s+=fade(seg(p,.2,.3),ruler(410,{x1:1160})+cartF(140,410,{text:'4.0 kg',size:24})+VA(222,363,447,363,{w:6,head:18})+label('7.5 m/s',334,345,{size:26,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,.22,.32),label('力 0 → a＝0 → 7.5 m/s の まま',470,374,{size:28,color:C.ink,weight:700}));
  s+=card(250,448,700,58,label('力 → 速度の 変化（加速度）',600,488,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.58),C.hi);
  return s+ans(3);
 },
};
// 行16 の小さな枠の箱は、2文目が始まってから動かす
function tAtLocal(ctx){const W=sentWin(ctx),b=W[1]?W[1][0]:.5;return Math.max(0,cueT(ctx)-b*(ctx?.dur??10));}

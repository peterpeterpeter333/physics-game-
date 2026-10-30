// 高校編「音波・深く学ぶ 3/3」(ys-hs-w-sound-3) — 図。Stage 1200×515.
// やまびこ：崖までの距離 d（弦の長さ L と文字を分ける）、往復時間 t 金、音の速さ V 紫。
// 共鳴：ブランコ（力 F 緑、速度 v 紫）。弦の定常波：長さ L 水色、節 黄の点、腹 白の矢印、弦を伝わる波の速さ v（小文字）紫。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,poly,clamp} from './anim.mjs';
import {card,tag,T2,tSince,LC,TCOL,FC,VCOL,ROPE,MK,HZ,MS,MM,SS,Vt,span,spanT} from './yt1-hs-w-sound-1-diagrams.mjs';

const K='hs-w-sound-3:';
const PI=Math.PI;
const dt=`{\\color{${LC}}d}`, Lt=`{\\color{${LC}}L}`, lam=`{\\color{${LC}}\\lambda}`, ft=`{\\color{${FC}}f}`;
const W1='#8fd3ff', W2='#ff9fd2';
// ---- echo ------------------------------------------------------------------------------------------
function person(x,y,{g=1,color='#d6deec'}={}){return fade(g,dot(x,y-118,16,color)+line(x,y-100,x,y-48,{color,w:6})+line(x,y-48,x-16,y,{color,w:6})+line(x,y-48,x+16,y,{color,w:6})+line(x,y-86,x+26,y-104,{color,w:6})+line(x,y-86,x-22,y-58,{color,w:6}));}
function cliff(x,y,g=1){return fade(g,poly([[x,y],[x+20,y-240],[x+70,y-300],[x+180,y-310],[x+180,y]],{fill:'#56627a',fo:.9,stroke:C.dim,sw:2}));}
const EY=430;
function echo({g=1,go=0,back=0,cl=1,dist=0}={}){
 let s=fade(g,line(60,EY,1140,EY,{color:C.dim,w:3}))+person(150,EY,{g})+cliff(960,EY,g*cl);
 s+=arrow(190,250,950,250,{color:W1,w:5,head:18,g:g*go})+arrow(950,320,190,320,{color:W2,w:5,head:18,g:g*back});
 if(go)s+=fade(g*go,label('行き',570,234,{size:26,color:W1,anchor:'middle',weight:700}));
 if(back)s+=fade(g*back,label('帰り',570,360,{size:26,color:W2,anchor:'middle',weight:700}));
 if(dist)s+=fade(g*dist,span(150,960,EY+40,'',LC,1));
 return s;
}
// ---- swing ------------------------------------------------------------------------------------------
const SW={x:600,y:40,L:250,T:2.4};
function swing(th,thd,{g=1,push=0,bad=0,vel=0}={}){
 const X=SW.x+SW.L*Math.sin(th),Y=SW.y+SW.L*Math.cos(th);
 let s=fade(g,line(SW.x-120,SW.y,SW.x+120,SW.y,{color:C.dim,w:4})+line(SW.x,SW.y,X,Y,{color:C.dim,w:3})+rect(X-40,Y-6,80,14,{fill:'#c9a46a',fo:.9,stroke:'#c9a46a',rx:4})+dot(X,Y-40,26,'#8fa3c4'));
 s+=fade(g*.6,line(SW.x,SW.y,SW.x,SW.y+SW.L+20,{color:C.faint,w:2,dash:'5 6'}));
 const dir=thd>0?1:-1,tx=Math.cos(th),ty=-Math.sin(th);
 if(vel&&Math.abs(thd)>.05)s+=fade(g*vel,arrow(X,Y+30,X+dir*tx*90*Math.min(1,Math.abs(thd)),Y+30+dir*ty*90*Math.min(1,Math.abs(thd)),{color:C.v,w:5,head:14}));
 if(push)s+=fade(g*push,arrow(X-130,Y-40,X-40,Y-40,{color:bad?C.a:C.F,w:8,head:20})+label('押す',X-150,Y-34,{size:24,color:bad?C.a:C.F,anchor:'end',weight:700}));
 return s;
}
// θ(t)＝Θ(t) sin(2πt/T): push (to the right) while moving right near the bottom
function swingAt(t,Th,{g=1,bad=false,vel=1,np=false}={}){
 const w=2*PI/SW.T,th=Th*Math.sin(w*t),thd=Th*w*Math.cos(w*t)/1.0;
 const c=Math.cos(w*t),push=np?0:bad?(c<-.75?1:0):(c>.75?1:0);
 return swing(th,thd/ (Th*w||1),{g,push:seg(Math.abs(c),.75,.85)*push,bad,vel});
}
// ---- string ------------------------------------------------------------------------------------------
export const ST={x0:200,x1:1000,y:280,A:80};
const SU=x=>(x-ST.x0)/(ST.x1-ST.x0);
function posts(g=1,{o=ST}={}){return fade(g,rect(o.x0-16,o.y-110,16,220,{fill:'#56627a',fo:1,stroke:C.dim,rx:3})+rect(o.x1,o.y-110,16,220,{fill:'#56627a',fo:1,stroke:C.dim,rx:3})+line(o.x0,o.y,o.x1,o.y,{color:C.faint,w:2,dash:'6 8'}));}
function curve(fn,{g=1,color=ROPE,w=5,o=ST,from=o.x0,to=o.x1,dash=''}={}){const pts=[];for(let x=from;x<=to+.1;x+=4)pts.push([x,o.y-fn(x)]);return fade(g,draw(pts,1,{color,w,dash}));}
const stand=(n,ph,o=ST)=>x=>o.A*Math.sin(n*PI*(x-o.x0)/(o.x1-o.x0))*Math.cos(ph);
const comp1=(n,ph,o=ST)=>x=>o.A/2*Math.sin(n*PI*(x-o.x0)/(o.x1-o.x0)-ph);
const comp2=(n,ph,o=ST)=>x=>o.A/2*Math.sin(n*PI*(x-o.x0)/(o.x1-o.x0)+ph);
function nodes(n,{g=1,o=ST}={}){let s='';for(let k=0;k<=n;k++)s+=dot(o.x0+(o.x1-o.x0)*k/n,o.y,11,MK);return fade(g,s);}
function anti(n,{g=1,o=ST}={}){let s='';for(let k=0;k<n;k++){const x=o.x0+(o.x1-o.x0)*(k+.5)/n;s+=arrow(x,o.y,x,o.y-o.A-6,{color:C.ink,w:3,head:12})+arrow(x,o.y,x,o.y+o.A+6,{color:C.ink,w:3,head:12});}return fade(g,s);}
function envl(n,{g=1,o=ST}={}){return curve(x=>o.A*Math.abs(Math.sin(n*PI*SU(x))),{g:g*.5,color:C.dim,w:2,dash:'6 6'})+curve(x=>-o.A*Math.abs(Math.sin(n*PI*SU(x))),{g:g*.5,color:C.dim,w:2,dash:'6 6'});}
const STW=2*PI/1.6; // display angular frequency of the standing wave
// ---- ambulance ---------------------------------------------------------------------------------------
function ambulance(x,y,g=1){return fade(g,rect(x-90,y-80,180,70,{fill:'#e9eef7',fo:.95,stroke:C.dim,rx:10})+rect(x-30,y-58,60,26,{fill:C.a,fo:.0,stroke:C.a,sw:0})+line(x-12,y-45,x+12,y-45,{color:C.a,w:6})+line(x,y-57,x,y-33,{color:C.a,w:6})+rect(x-14,y-98,28,18,{fill:C.a,fo:1,rx:4})+ring(x-55,y-8,16,{color:C.dim,w:4,fill:C.bg})+ring(x+55,y-8,16,{color:C.dim,w:4,fill:C.bg}));}

export const hsWSound3Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p)=>{
  let s=fade(seg(p,.05,.2),rect(980,90,40,280,{fill:'#56627a',fo:.9,stroke:C.dim,rx:4})+label('壁',1000,410,{size:26,color:C.dim,anchor:'middle'}));
  s+=arrow(200,190,960,190,{color:W1,w:5,head:18,g:seg(p,.1,.45)})+arrow(960,250,200,250,{color:W2,w:5,head:18,g:seg(p,.45,.8)});
  s+=fade(seg(p,.15,.3),label('もとの 音',580,170,{size:26,color:W1,anchor:'middle',weight:700}))+fade(seg(p,.5,.65),label('跳ね返った 音',580,300,{size:26,color:W2,anchor:'middle',weight:700}));
  return s;
 },
 [K+'q2']:(p)=>{
  let s=rect(980,90,40,280,{fill:'#56627a',fo:.9,stroke:C.dim,rx:4})+arrow(200,190,960,190,{color:W1,w:5,head:18})+arrow(960,250,200,250,{color:W2,w:5,head:18});
  s+=card(200,330,800,110,label('重なると、何が 起こる？',600,400,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'plan']:(p)=>card(200,120,800,200,label('その前に：',600,190,{size:30,color:C.dim,anchor:'middle'})+label('跳ね返りで 距離を 測る',600,265,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi),
 // ================= S2 やまびこ =================
 [K+'e1']:(p)=>echo({go:seg(p,.1,.4),back:seg(p,.45,.75)})+fade(seg(p,.05,.2),label('ヤッホー',230,140,{size:28,color:C.ink,weight:700}))+fade(seg(p,.75,.9),label('やまびこ',570,140,{size:32,color:C.hi,anchor:'middle',weight:700})),
 [K+'e2']:(p)=>{
  let s=echo({go:1,back:1});
  s+=fade(seg(p,.1,.25),label('2.0 秒後に 返ってきた',570,110,{size:30,color:TCOL,anchor:'middle',weight:700}));
  s+=span(150,960,EY+40,'',LC,seg(p,.5,.65))+fade(seg(p,.6,.75),label('d ＝ ？',555,EY+76,{size:28,color:LC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'e3']:(p)=>echo({go:1,back:1,g:.5})+card(220,40,760,120,T2(`340\\times 2.0=680${MM}`,600,112,{size:48,auto:false}),seg(p,.1,.25),VCOL)+fade(seg(p,.4,.55),label('音が 進んだ 道のり',600,182,{size:28,color:VCOL,anchor:'middle',weight:700})),
 [K+'e4']:(p)=>{
  let s=echo({go:1,back:1});
  s+=fade(seg(p,.05,.2),rect(180,215,790,140,{fill:C.hi,fo:.06,stroke:C.hi,sw:2,rx:12}));
  s+=fade(seg(p,.45,.6),label('680 m ＝ 行き ＋ 帰り',570,120,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'e5']:(p)=>{
  let s=echo({go:1,back:1,dist:seg(p,.05,.2)});
  s+=card(270,60,660,110,T2(`${dt}=680\\div 2=340${MM}`,600,130,{size:46,auto:false}),seg(p,.3,.45),LC);
  return s;
 },
 [K+'e6']:(p)=>{
  let s='';
  s+=fade(seg(p,.05,.2),label('往復の 時間 t、崖までの 距離 d',600,80,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=card(300,140,600,120,T2(`${Vt}t=2${dt}`,600,212,{size:56,auto:true}),seg(p,.45,.6),VCOL);
  s+=fade(seg(p,.6,.75),label('進んだ 道のり ＝ 往復',600,320,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'e7']:(p)=>{
  let s=card(300,40,600,110,T2(`${Vt}t=2${dt}`,600,108,{size:50}),1,VCOL);
  s+=fade(seg(p,.05,.2),label('両辺を 2 で 割る',600,200,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=card(300,230,600,150,T2(`${dt}=\\dfrac{${Vt}t}{2}`,600,318,{size:60}),seg(p,.2,.35),LC);
  s+=tag('導いた 結果',600,450,{color:C.hi,g:seg(p,.6,.75)});
  return s;
 },
 [K+'e8']:(p)=>{
  let s=card(160,40,880,110,label('✕ 2 で 割り 忘れる（680 m）',600,110,{size:34,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=card(160,210,880,150,label('コウモリ・魚群探知機',600,270,{size:32,color:C.ink,anchor:'middle',weight:700})+label('往復の 時間 → 距離',600,330,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  return s;
 },
 // ================= S3 共鳴 =================
 [K+'r1']:(p,ctx)=>swingAt(tSince(p,ctx,K+'r1'),.22,{vel:0,np:true})+fade(seg(p,.3,.45),label('ブランコ',600,470,{size:30,color:C.ink,anchor:'middle',weight:700})),
 [K+'r2']:(p,ctx)=>swingAt(tSince(p,ctx,K+'r1'),.22,{vel:0,np:true})+fade(seg(p,.1,.25),label('ひとりでに 揺れる 周期 T',600,470,{size:30,color:TCOL,anchor:'middle',weight:700})),
 [K+'r3']:(p,ctx)=>swingAt(tSince(p,ctx,K+'r1'),.22,{vel:0,np:true})+card(700,330,480,120,label('揺れやすい 振動数',940,380,{size:28,color:C.ink,anchor:'middle'})+label('＝ 固有振動数',940,428,{size:32,color:FC,anchor:'middle',weight:700}),seg(p,.3,.45),FC)+tag('定義',940,480,{color:FC,g:seg(p,.5,.6)}),
 [K+'r4']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'r4');
  let s=swingAt(t,.25,{vel:seg(p,.05,.2)});
  s+=fade(seg(p,.4,.55),label('力と 動きが 同じ 向き → 正の 仕事',600,490,{size:28,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'r5']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'r4'),Th=.25+.25*lin(p,.05,.95);
  let s=swingAt(t,Th);
  s+=fade(seg(p,.1,.25),label('押すたびに エネルギーが 増える → 揺れが 育つ',600,490,{size:28,color:C.E,anchor:'middle',weight:700}));
  return s;
 },
 [K+'r6']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'r6'),Th=.5-.2*lin(p,.05,.95);
  let s=swingAt(t,Th,{bad:true});
  s+=fade(seg(p,.1,.25),label('戻る ときに 押す → 負の 仕事 → 小さく なる',600,490,{size:28,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'r7']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'r7'),Th=.3+.25*lin(p,.05,.9);
  let s=swingAt(t,Th);
  s+=card(760,330,420,110,label('周期が 合う → 共鳴（共振）',970,395,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'r8']:(p)=>{
  const x0=160,y0=440,w=880,h=300,pts=[];for(let i=0;i<=200;i++){const u=i/200;pts.push([x0+w*u,y0-h*(1-Math.exp(-u*5))]);}
  let s=fade(1,line(x0,y0,x0+w+20,y0,{color:C.dim,w:2.5})+line(x0,y0,x0,y0-h-30,{color:C.dim,w:2.5})+label('振幅',x0,y0-h-44,{size:24,color:C.ink,anchor:'middle'})+label('時間',x0+w+30,y0+8,{size:24,color:TCOL}));
  s+=fade(1,draw(pts,lin(p,.05,.6),{color:C.ink,w:4}));
  s+=fade(seg(p,.6,.75),line(x0,y0-h,x0+w,y0-h,{color:C.hi,w:2,dash:'6 6'})+label('入る エネルギー ＝ 失う エネルギー',x0+w,y0-h-18,{size:26,color:C.hi,anchor:'end',weight:700}));
  return s;
 },
 [K+'r9']:(p)=>{
  const x=600;let s=fade(seg(p,.05,.2),rect(x-200,330,400,120,{fill:'#c9a46a',fo:.45,stroke:'#c9a46a',rx:8})+label('共鳴箱',x,400,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.05,.2),rect(x-24,150,16,150,{fill:W1,fo:.7,stroke:W1,rx:6})+rect(x+8,150,16,150,{fill:W1,fo:.7,stroke:W1,rx:6})+rect(x-24,292,48,22,{fill:W1,fo:.7,stroke:W1,rx:6})+rect(x-8,310,16,22,{fill:W1,fo:.7,stroke:W1,rx:4}));
  s+=fade(seg(p,.35,.5),label('音叉',x+60,200,{size:26,color:W1,weight:700})+label('箱の 中の 空気も 同じ 振動数で 大きく 揺れる',x,500,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S4 弦の定常波 =================
 [K+'s1']:(p)=>posts(seg(p,.4,.55))+fade(seg(p,.4,.55),line(ST.x0,ST.y,ST.x1,ST.y,{color:ROPE,w:5}))+fade(seg(p,.6,.75),label('両端を 固定',600,ST.y+150,{size:28,color:C.ink,anchor:'middle',weight:700})),
 [K+'s2']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'s2'),c=ST.x0+60+230*t,G=u=>70*Math.exp(-((u/45)**2));
  let s=posts()+curve(x=>G(x-c)-G(x-(2*ST.x1-c)),{});
  s+=fade(seg(p,.6,.75),label('端で 反射 → ひっくり返って 戻る',600,ST.y+150,{size:28,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'s3']:(p,ctx)=>{
  const ph=STW*tSince(p,ctx,K+'s3'),n=2;
  let s=posts()+curve(comp1(n,ph),{color:W1,w:3})+curve(comp2(n,ph),{color:W2,w:3,g:seg(p,.05,.2)});
  s+=fade(seg(p,.05,.2),label('行きの 波',ST.x0,ST.y-130,{size:24,color:W1,weight:700})+label('反射した 波',ST.x1,ST.y-130,{size:24,color:W2,anchor:'end',weight:700}));
  s+=curve(stand(n,ph),{g:seg(p,.5,.65)})+fade(seg(p,.5,.65),label('足した 形',600,ST.y+150,{size:28,color:ROPE,anchor:'middle',weight:700}));
  return s;
 },
 [K+'s4']:(p,ctx)=>{
  const ph=STW*tSince(p,ctx,K+'s3'),n=2;
  let s=posts()+fade(.35,curve(comp1(n,ph),{color:W1,w:2})+curve(comp2(n,ph),{color:W2,w:2}))+curve(stand(n,ph))+envl(n,{g:seg(p,.2,.4)});
  s+=fade(seg(p,.5,.65),label('形が 進まない ＝ 定常波',600,ST.y+150,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'s5']:(p,ctx)=>{
  const ph=STW*tSince(p,ctx,K+'s3'),n=2;
  let s=posts()+curve(stand(n,ph))+envl(n)+nodes(n,{g:seg(p,.05,.2)})+anti(n,{g:seg(p,.3,.45)});
  s+=fade(seg(p,.05,.2),label('節',ST.x0+(ST.x1-ST.x0)/2,ST.y+50,{size:28,color:MK,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.45),label('腹',ST.x0+(ST.x1-ST.x0)/4,ST.y-ST.A-24,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('両端は 必ず 節',600,ST.y+150,{size:28,color:MK,anchor:'middle',weight:700}));
  return s;
 },
 [K+'s6']:(p,ctx)=>{
  const ph=STW*tSince(p,ctx,K+'s6'),n=1;
  let s=posts()+curve(stand(n,ph))+envl(n)+nodes(n)+anti(n,{g:seg(p,.3,.45)});
  s+=fade(seg(p,.5,.65),label('いちばん 単純な 揺れ方',600,ST.y+150,{size:28,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'s7']:(p)=>{
  const o=ST,n=1,fn=x=>o.A*Math.sin(PI*SU(x));
  let s=posts()+curve(fn)+nodes(n);
  s+=curve(fn,{from:o.x1,to:Math.min(1180,o.x1+(o.x1-o.x0)*seg(p,.05,.35)*0.22),color:C.dim,w:3,dash:'8 7'});
  s+=curve(fn,{from:Math.max(20,o.x0-(o.x1-o.x0)*seg(p,.05,.35)*0.22),to:o.x0,color:C.dim,w:3,dash:'8 7'});
  s+=spanT(o.x0,o.x1,o.y+o.A+50,'L',LC,seg(p,.4,.55),34,-18);
  s+=fade(seg(p,.6,.75),label('弦に 入るのは 山 1つ ＝ 半波長',600,40,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'s8']:(p)=>{
  const o=ST,fn=x=>o.A*Math.sin(PI*SU(x));
  let s=fade(.45,posts()+curve(fn)+nodes(1));
  s+=card(200,330,800,140,T2(`${Lt}=\\dfrac{${lam}}{2}\\quad\\Rightarrow\\quad ${lam}=2${Lt}`,600,410,{size:50,auto:false}),seg(p,.05,.2),LC);
  return s;
 },
 [K+'s9']:(p)=>{
  let s=fade(seg(p,.05,.2),label('弦を 伝わる 波の 速さ：v（小文字）',600,60,{size:30,color:VCOL,anchor:'middle',weight:700}));
  s+=card(200,110,800,110,T2(`v=${ft}${lam}`,600,175,{size:50}),seg(p,.2,.35),VCOL);
  s+=card(200,270,800,150,T2(`${ft}=\\dfrac{v}{${lam}}=\\dfrac{v}{2${Lt}}`,600,355,{size:56}),seg(p,.5,.65),FC);
  return s;
 },
 // ================= S5 数で確かめる =================
 [K+'n1']:(p,ctx)=>{
  const ph=STW*tSince(p,ctx,K+'n1');
  let s=posts()+curve(stand(1,ph))+nodes(1);
  s+=spanT(ST.x0,ST.x1,ST.y+ST.A+50,'L=0.50\\ \\mathrm{m}',LC,seg(p,.05,.2),30,-18);
  s+=fade(seg(p,.4,.55),label('弦を 伝わる 波の 速さ v ＝ 220 m/s',600,50,{size:30,color:VCOL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'n2']:(p,ctx)=>{
  const ph=STW*tSince(p,ctx,K+'n1');
  let s=fade(.4,posts()+curve(stand(1,ph))+nodes(1));
  s+=card(150,40,900,110,T2(`${lam}=2\\times 0.50=1.0${MM}`,600,108,{size:46,auto:false}),seg(p,.05,.2),LC);
  s+=card(150,330,900,120,T2(`${ft}=\\dfrac{220}{1.0}=220${HZ}`,600,400,{size:46,auto:false}),seg(p,.45,.6),FC);
  return s;
 },
 [K+'n3']:(p,ctx)=>{
  const ph=STW*2*tSince(p,ctx,K+'n3');
  let s=posts()+curve(stand(2,ph))+envl(2)+nodes(2,{g:seg(p,.3,.45)});
  s+=spanT(ST.x0,ST.x1,ST.y+ST.A+50,'\\lambda=0.50\\ \\mathrm{m}',LC,seg(p,.55,.7),30,-18);
  s+=fade(seg(p,.05,.2),label('半波長 2個',600,50,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'n4']:(p,ctx)=>{
  const ph=STW*2*tSince(p,ctx,K+'n3');
  let s=fade(.4,posts()+curve(stand(2,ph))+nodes(2));
  s+=card(150,40,900,120,T2(`${ft}=\\dfrac{220}{0.50}=440${HZ}`,600,112,{size:46,auto:false}),seg(p,.05,.2),FC);
  s+=fade(seg(p,.5,.65),label('1本目の ラの 音',600,450,{size:30,color:FC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'n5']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'n5');let s='';
  [1,2,3].forEach((n,i)=>{const o={x0:150,x1:650,y:95+i*150,A:42},g=seg(p,.05+i*.1,.15+i*.1);
   s+=fade(g,line(o.x0,o.y,o.x1,o.y,{color:C.faint,w:2,dash:'6 8'})+curve(x=>o.A*Math.sin(n*PI*(x-o.x0)/(o.x1-o.x0))*Math.cos(STW*n*t),{o,w:4})+nodes(n,{o})+label(`n＝${n}`,o.x0-20,o.y+8,{size:26,color:C.ink,anchor:'end',weight:700})+label(`${220*n} Hz`,o.x1+30,o.y+8,{size:26,color:FC,weight:700}));});
  s+=card(820,170,340,150,T2(`${ft}=\\dfrac{nv}{2${Lt}}`,990,255,{size:50}),seg(p,.45,.6),FC);
  s+=fade(seg(p,.65,.8),label('飛び飛びの 値',990,370,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'n6']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'n6'),u=seg(p,.2,.5),x1=ST.x1-200*u,o={...ST,x1};
  let s=fade(1,rect(ST.x0-16,ST.y-110,16,220,{fill:'#56627a',fo:1,stroke:C.dim,rx:3})+rect(ST.x1,ST.y-110,16,220,{fill:'#56627a',fo:1,stroke:C.dim,rx:3}));
  s+=fade(u,line(x1,ST.y,ST.x1,ST.y,{color:C.dim,w:4})+dot(x1,ST.y-20,18,'#e9c7a6')+label('指で 押さえる',x1,ST.y-60,{size:24,color:C.ink,anchor:'middle'}));
  s+=curve(x=>o.A*Math.sin(PI*(x-o.x0)/(o.x1-o.x0))*Math.cos(STW*(1+u*.33)*t),{o});
  s+=spanT(ST.x0,x1,ST.y+ST.A+50,'L',LC,1,34,-18);
  s+=fade(seg(p,.55,.7),label('L 短く → f 大きく → 高い 音',600,40,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'n7']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'n7');
  const o={x0:120,x1:420,y:200,A:50};
  let s=fade(1,rect(o.x0-12,o.y-70,12,140,{fill:'#56627a',fo:1,rx:3})+rect(o.x1,o.y-70,12,140,{fill:'#56627a',fo:1,rx:3}))+curve(x=>o.A*Math.sin(PI*(x-o.x0)/(o.x1-o.x0))*Math.cos(STW*t),{o,w:4});
  s+=fade(seg(p,.05,.2),label('弦 220 Hz',270,320,{size:28,color:FC,anchor:'middle',weight:700}));
  for(let j=0;j<5;j++){const r=40+((t*120+j*90)%450);s+=fade(seg(p,.2,.35)*(1-r/500),`<path d="M${270+r*Math.cos(.6)} ${200-r*Math.sin(.6)} A ${r} ${r} 0 0 1 ${270+r*Math.cos(.6)} ${200+r*Math.sin(.6)}" fill="none" stroke="#a9d8ff" stroke-width="3"/>`);}
  s+=fade(seg(p,.45,.6),label('耳に 届く 音も 220 Hz',900,200,{size:30,color:FC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'n8']:(p)=>{
  let s=card(120,50,460,150,label('弦を 伝わる 波',350,100,{size:28,color:C.ink,anchor:'middle'})+T2(`v=220${MS}`,350,165,{size:42,auto:true}),seg(p,.05,.2),VCOL);
  s+=card(620,50,460,150,label('空気中の 音',850,100,{size:28,color:C.ink,anchor:'middle'})+T2(`${Vt}=340${MS}`,850,165,{size:42,auto:false}),seg(p,.25,.4),VCOL);
  s+=fade(seg(p,.6,.75),label('別の 量',600,280,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'n9']:(p)=>{
  const px=420,x0=200,wv=(y,l,g,c)=>{const pts=[];for(let x=x0;x<=x0+l*px+.1;x+=3)pts.push([x,y-36*Math.sin(2*PI*(x-x0)/(l*px))]);return fade(g,draw(pts,1,{color:c,w:4})+line(x0,y,x0+l*px,y,{color:C.faint,w:2,dash:'6 8'}));};
  let s=wv(130,1.0,seg(p,.05,.2),ROPE)+fade(seg(p,.05,.2),label('弦の 上',x0-20,138,{size:26,color:C.ink,anchor:'end',weight:700}));
  s+=span(x0,x0+1.0*px,195,'1.0 m',LC,seg(p,.05,.2),26,36);
  s+=wv(330,340/220,seg(p,.3,.45),'#a9d8ff')+fade(seg(p,.3,.45),label('空気中',x0-20,338,{size:26,color:C.ink,anchor:'end',weight:700}));
  s+=span(x0,x0+340/220*px,395,'約 1.5 m',LC,seg(p,.3,.45),26,36);
  s+=fade(seg(p,.65,.8),label('同じなのは 振動数 220 Hz',600,500,{size:28,color:FC,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'a1']:(p)=>{
  let s=card(200,20,800,190,label('跳ね返りの 時間 → 距離',600,70,{size:30,color:C.ink,anchor:'middle',weight:700})+T2(`${dt}=\\dfrac{${Vt}t}{2}`,600,155,{size:44}),seg(p,.05,.2),LC);
  return s;
 },
 [K+'a2']:(p)=>{
  let s=card(200,20,800,190,label('跳ね返りの 時間 → 距離',600,70,{size:30,color:C.ink,anchor:'middle',weight:700})+T2(`${dt}=\\dfrac{${Vt}t}{2}`,600,155,{size:44}),1,LC);
  s+=card(200,240,800,210,label('行き ＋ 反射 → 定常波 → 音の 高さ',600,290,{size:30,color:C.ink,anchor:'middle',weight:700})+T2(`${ft}=\\dfrac{nv}{2${Lt}}`,600,385,{size:46}),seg(p,.1,.25),FC);
  return s;
 },
 [K+'x1']:(p)=>{
  const x=150+800*lin(p,.05,.95);
  let s=fade(1,line(60,420,1140,420,{color:C.dim,w:3}))+person(600,420,{g:1})+ambulance(x,420);
  s+=fade(x<520?1:0,label('近づく：高く 聞こえる',600,180,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(x>680?1:0,label('遠ざかる：低く 聞こえる',600,180,{size:30,color:W1,anchor:'middle',weight:700}));
  return s;
 },
 [K+'x2']:(p)=>{
  let s=fade(.5,line(60,420,1140,420,{color:C.dim,w:3})+person(600,420)+ambulance(950,420));
  s+=card(150,60,900,170,label('サイレンの 振動数は 同じ なのに、',600,125,{size:30,color:C.ink,anchor:'middle'})+label('なぜ 高さが 変わる？',600,190,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'bye']:(p)=>fade(.5,line(60,420,1140,420,{color:C.dim,w:3})+person(600,420)+ambulance(950,420))+card(200,80,800,120,label('次の 単元：ドップラー効果',600,155,{size:36,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.dim),
};

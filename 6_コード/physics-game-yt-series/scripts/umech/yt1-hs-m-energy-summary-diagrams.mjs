// 高校編「仕事とエネルギー・要点」(ys-hs-m-energy-summary) — 図。Stage 1200×515.
// 深く学ぶ版と同じ記号・色・数値例（1.0 kg・20 m・g＝10 → 200 J・20 m/s、2.0 kg → 400 J）。
import {C,seg,fade,label,line,rect,dot,arrow,tex,ground} from './anim.mjs';
import {card,ball,WC,KC,UC,Wt,Kt,Ut,MG,Gt,Ht,T2,FA,box,handUp,tag,lane} from './yt1-hs-m-energy-1-diagrams.mjs';

const K='hs-m-energy-summary:';
const UH=`${MG}${Ht}`;
const DX=230,DG=465,DK_=18; const yh=h=>DG-DK_*h;
function dropCol({h=20,g=1,trail=0,r=16}={}){
 let s=fade(g,ground(DX-120,DX+120,DG)+line(DX-90,DG,DX-90,yh(20),{color:C.x,w:2})+line(DX-100,yh(20),DX-80,yh(20),{color:C.x,w:2})+label('20 m',DX-106,yh(20)+8,{size:22,color:C.x,anchor:'end'}));
 if(trail)s+=fade(g*.5,line(DX,yh(20),DX,yh(h),{color:C.faint,w:2,dash:'5 6'}));
 s+=fade(g,ball(DX,yh(h)-r,{r}));
 return s;
}
function stack(x,base,U,Kv,{k=1.2,w=110,g=1}={}){
 let s=fade(g,rect(x-w/2,base-U*k,w,U*k,{fill:UC,fo:.6,stroke:UC,sw:2,rx:4})+rect(x-w/2,base-(U+Kv)*k,w,Kv*k,{fill:KC,fo:.7,stroke:KC,sw:2,rx:4}));
 if(U>8)s+=fade(g,label(`U ${Math.round(U)}`,x,base-U*k/2+8,{size:22,color:C.bg,anchor:'middle',weight:700}));
 if(Kv>8)s+=fade(g,label(`K ${Math.round(Kv)}`,x,base-U*k-Kv*k/2+8,{size:22,color:C.bg,anchor:'middle',weight:700}));
 return s+fade(g,line(x-w/2-20,base,x+w/2+20,base,{color:C.dim,w:3}));
}

export const hsEnergySummaryDiagrams={
 // ================= 結論 =================
 [K+'w']:(p)=>{
  const u=seg(p,.05,.5),x=260+300*u;
  let s=ground(80,760,400)+box(x,400,{w:110,h:90})+FA(x-55,285,x+55,285,{text:'F',size:30,dy:-18});
  s+=fade(seg(p,.3,.45),line(260,440,560,440,{color:C.x,w:3})+label('x',410,480,{size:28,color:C.x,anchor:'middle',weight:700}));
  s+=card(800,130,340,160,T2(Wt+'=Fx',970,215,{size:58}),seg(p,.5,.65),WC);
  return s;
 },
 [K+'k']:(p)=>{
  let s=lane({gy:300,x0:150,k:100,d:5,p:seg(p,.02,.5),F:'F',m:'m',v:''});
  s+=fade(seg(p,.45,.55),arrow(150+500+86,254,150+500+166,254,{color:C.v,w:5,head:16})+label('速さ',150+500+180,262,{size:26,color:C.v,weight:700}));
  s+=card(300,360,600,120,T2(Kt+'=\\tfrac12 mv^2',600,422,{size:52}),seg(p,.5,.65),KC);
  return s;
 },
 [K+'u']:(p)=>{
  const u=seg(p,.02,.5),y=440-220*u;
  let s=ground(150,550,460)+box(350,y+20,{w:100,h:76})+handUp(350,y+20);
  s+=fade(seg(p,.3,.45),line(200,460,200,240,{color:C.x,w:3})+label('h',185,350,{size:30,color:C.x,anchor:'end',weight:700}));
  s+=card(660,150,460,150,T2(Ut+'='+UH,890,230,{size:56}),seg(p,.5,.65),UC);
  return s;
 },
 [K+'c']:(p)=>{
  let s=card(200,90,800,200,label('重力・ばね の 力 だけが 仕事を する とき',600,155,{size:30,color:C.ink,anchor:'middle',weight:700})+T2(Kt+'+'+Ut,520,235,{size:52})+label('＝ 一定',700,250,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  s+=fade(seg(p,.4,.55),stack(450,470,150,50,{k:.8})+stack(600,470,100,100,{k:.8})+stack(750,470,30,170,{k:.8}));
  return s;
 },
 // ================= なぜ？ =================
 [K+'why']:(p)=>{
  let s=T2(Wt+'=Fx',600,90,{size:48});
  s+=fade(seg(p,.25,.4),label('ma ＝ F',880,100,{size:28,color:C.F,weight:700}));
  s+=card(400,180,400,120,T2('Fx=max',600,245,{size:54}),seg(p,.5,.65),C.F);
  return s;
 },
 [K+'why2']:(p)=>{
  let s=T2('Fx=max',360,80,{size:42})+T2('v^2=2ax',840,80,{size:42});
  s+=fade(seg(p,.1,.25),label('第3式',840,135,{size:24,color:C.dim,anchor:'middle'})+T2('ax=\\dfrac{v^2}{2}',840,210,{size:44}));
  s+=card(380,290,440,130,T2('Fx=\\tfrac12 mv^2',600,360,{size:56}),seg(p,.5,.65),KC);
  s+=fade(seg(p,.7,.85),label('½ は 第3式の 2 から',600,470,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'why3']:(p)=>{
  let s=ground(150,550,460)+box(350,240,{w:100,h:76})+handUp(350,240)+FA(250,220,250,120,{text:'mg',size:24,dx:-14,dy:0,anchor:'end'});
  s+=line(450,460,450,240,{color:C.x,w:3})+label('h',465,350,{size:30,color:C.x,weight:700});
  s+=card(640,90,500,130,label('持ち上げる 仕事',890,140,{size:28,color:WC,anchor:'middle',weight:700})+T2(MG+'\\times '+Ht+'='+UH,890,195,{size:42}),seg(p,0,.15),WC);
  s+=card(640,260,500,120,label('手を 離す → K として 取り出せる',890,328,{size:26,color:KC,anchor:'middle',weight:700}),seg(p,.55,.7),KC);
  return s;
 },
 [K+'why4']:(p)=>{
  let s=card(150,90,420,150,label('重力の 仕事',360,140,{size:28,color:WC,anchor:'middle',weight:700})+label('＝ U の 減った 量',360,200,{size:28,color:UC,anchor:'middle',weight:700}),seg(p,0,.15),UC);
  s+=card(630,90,420,150,label('重力の 仕事',840,140,{size:28,color:WC,anchor:'middle',weight:700})+label('＝ K の 増えた 量',840,200,{size:28,color:KC,anchor:'middle',weight:700}),seg(p,.2,.35),KC);
  s+=card(300,300,600,120,T2(Kt+'+'+Ut,520,365,{size:50})+label('は 変わらない',720,378,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 // ================= 数値例 =================
 [K+'g10']:(p)=>{
  let s=dropCol({h:20})+fade(seg(p,.4,.55),label('1.0 kg',DX+30,yh(20)-30,{size:24,color:C.ink,weight:700}));
  s+=card(520,120,620,150,label('計算を 見やすく するため',830,175,{size:28,color:C.ink,anchor:'middle'})+tex(Gt+'=10\\ \\mathrm{m/s^2}',830,240,{size:46,auto:false}),seg(p,0,.15),C.a);
  return s;
 },
 [K+'u200']:(p)=>{
  let s=dropCol({h:20})+stack(700,450,200,0,{g:seg(p,.3,.45)});
  s+=card(800,100,380,140,tex(Ut+'=1.0\\times 10\\times 20',990,150,{size:30,auto:false})+tex('=200\\ \\mathrm{J}',990,205,{size:36,auto:false,color:UC}),seg(p,0,.15),UC);
  s+=fade(seg(p,.55,.7),tex(Kt+'=0',990,300,{size:40,auto:false}));
  return s;
 },
 [K+'k200']:(p)=>{
  const u=seg(p,.02,.5),h=20-20*u*u;
  let s=dropCol({h,trail:1})+stack(700,450,10*h,200-10*h);
  s+=card(800,120,380,140,tex(Ut+'=0',990,170,{size:36,auto:false})+tex(Kt+'=200\\ \\mathrm{J}',990,225,{size:38,auto:false}),seg(p,.5,.65),KC);
  return s;
 },
 [K+'v']:(p)=>{
  let s=T2(UH+'=\\tfrac12 mv^2',600,80,{size:44});
  s+=fade(seg(p,.15,.3),T2('v=\\sqrt{2'+Gt+Ht+'}',600,180,{size:48}));
  s+=card(330,250,540,130,T2('\\sqrt{2\\times 10\\times 20}=\\sqrt{400}',600,300,{size:36,auto:false})+T2('=20\\ \\mathrm{m/s}',600,355,{size:40,auto:false,color:C.v}),seg(p,.5,.65),C.v);
  return s;
 },
 [K+'match']:(p)=>{
  let s=card(120,110,460,200,label('落体の運動',350,170,{size:28,color:C.dim,anchor:'middle'})+tex('t=2\\ \\mathrm{s}:\\ '+Gt+'t=20\\ \\mathrm{m/s}',350,240,{size:34}),seg(p,0,.15),C.t);
  s+=card(620,110,460,200,label('エネルギー',850,170,{size:28,color:C.dim,anchor:'middle'})+tex('v=20\\ \\mathrm{m/s}',850,240,{size:38}),seg(p,0,.15),KC);
  s+=fade(seg(p,.4,.55),label('一致',600,410,{size:44,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= よくある間違い =================
 [K+'mis']:(p)=>{
  let s=ground(250,950,440)+dot(450,330,30,'#8c97ad')+label('重い 球',450,270,{size:24,color:C.ink,anchor:'middle'})+ball(750,330,{r:14})+label('軽い 球',750,270,{size:24,color:C.ink,anchor:'middle'});
  s+=card(300,90,600,110,label('重い 方が 速く 着く？',600,160,{size:36,color:C.a,anchor:'middle',weight:700}),seg(p,.1,.25),C.a);
  return s;
 },
 [K+'mis2']:(p)=>{
  let s=T2('{\\color{#ffe28a}m}{\\color{#83ecc0}g}'+Ht+'=\\tfrac12 {\\color{#ffe28a}m}v^2',600,110,{size:54});
  s+=fade(seg(p,.2,.35),line(470,95,510,125,{color:C.a,w:4})+line(660,95,700,125,{color:C.a,w:4}));
  s+=card(330,230,540,130,label('m が 消える',600,285,{size:32,color:C.hi,anchor:'middle',weight:700})+label('→ 速さは 質量に よらない',600,335,{size:28,color:C.v,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'mis3']:(p)=>{
  let s=stack(350,440,0,200,{k:.8})+label('1.0 kg：200 J',350,470,{size:24,color:C.ink,anchor:'middle'});
  s+=stack(650,440,0,400,{k:.8,g:seg(p,.05,.25)})+fade(seg(p,.05,.25),label('2.0 kg：400 J',650,470,{size:24,color:C.ink,anchor:'middle'}));
  s+=card(820,140,340,160,label('速さ は 同じ',990,200,{size:30,color:C.ink,anchor:'middle',weight:700})+tex('v=20\\ \\mathrm{m/s}',990,260,{size:38,auto:false,color:C.v}),seg(p,.5,.65),C.v);
  return s;
 },
 // ================= まとめ =================
 [K+'sum']:(p)=>{
  let s=card(400,70,400,110,label('仕事 W ＝ Fx',600,140,{size:36,color:WC,anchor:'middle',weight:700}),seg(p,0,.12),WC);
  s+=fade(seg(p,.2,.35),arrow(520,190,330,270,{color:C.hi,w:4,head:14})+arrow(680,190,870,270,{color:C.hi,w:4,head:14}));
  s+=card(150,280,380,130,label('速さ として',340,330,{size:26,color:C.ink,anchor:'middle'})+T2(Kt+'=\\tfrac12 mv^2',340,380,{size:40}),seg(p,.3,.45),KC);
  s+=card(670,280,380,130,label('高さ として',860,330,{size:26,color:C.ink,anchor:'middle'})+T2(Ut+'='+UH,860,380,{size:40}),seg(p,.45,.6),UC);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(200,80,800,140,label('重力・ばね だけが 仕事 → K＋U ＝ 一定',600,165,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.12),C.hi);
  s+=card(200,270,800,120,label('摩擦 → 減った 分は 熱 へ',600,342,{size:34,color:WC,anchor:'middle',weight:700}),seg(p,.5,.65),WC);
  return s;
 },
 [K+'bye']:(p)=>card(200,120,800,220,label('なぜ そうなるかは',600,200,{size:32,color:C.ink,anchor:'middle'})+label('深く学ぶ版 1/3〜3/3 で',600,275,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

// 高校編「運動量と力積・要点」(ys-hs-m-momentum-summary) — 図。Stage 1200×515.
// 深く学ぶ 1/2・2/2 の部品と数値例（2.0 kg・3.0 m/s ＋ 静止 1.0 kg → 2.0 m/s、0.010 s → 600 N、0.20 s → 30 N、K 9.0 → 6.0 J）をそのまま使う。
import {C,seg,fade,label,line,ground,wall,rect} from './anim.mjs';
import {card,FA,VA,table,T2,Fc,KC,ebar,tag,PC,Pt,DP,PA,PK,VK,mcart,posDir,movingCart} from './yt1-hs-m-momentum-1-diagrams.mjs';
import {ball1,ball2,P1,P2,F12,F21} from './yt1-hs-m-momentum-2-diagrams.mjs';

const K='hs-m-momentum-summary:';
const GY=420,T1=544,T2x=642,F2='#5fc39b';

export const hsMomentumSummaryDiagrams={
 // ================= 結論 =================
 [K+'def']:(p)=>{
  let s=card(380,50,440,150,T2(`${Pt}=mv`,600,130,{size:70}),seg(p,.1,.25),PC);
  s+=tag('定義',900,90,{g:seg(p,.3,.45)});
  s+=fade(seg(p,.3,.45),label('質量 × 速度',600,260,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.65,.8),T2('\\mathrm{kg\\cdot m/s}',600,350,{size:46,auto:false,color:PC}));
  return s;
 },
 [K+'dir']:(p)=>{
  let s=ground(60,1140,420)+posDir(470,60);
  s+=movingCart(300,420,3,{vl:'3.0 m/s',pl:'＋6.0',g:seg(p,.1,.25)})+movingCart(900,420,-3,{vl:'−3.0 m/s',pl:'−6.0',g:seg(p,.45,.6)});
  return s;
 },
 [K+'imp']:(p)=>{
  let s=card(330,50,540,150,T2(`F\\Delta t=${DP}`,600,130,{size:66}),seg(p,.05,.2),PC);
  s+=fade(seg(p,.25,.4),label('力積（力 × 時間）',450,270,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('運動量の 変化',800,270,{size:30,color:PC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'cons']:(p)=>{
  const u=seg(p,.05,.45);
  let s=ground(100,1100,GY)+ball1(250+(T1-250)*u)+ball2(T2x);
  s+=card(250,40,700,150,label('外力が なければ',600,95,{size:28,color:C.ink,anchor:'middle'})+T2(`${P1}+${P2}`,520,155,{size:44,auto:false})+label('は 変わらない',730,165,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),PC);
  return s;
 },
 // ================= なぜ？ =================
 [K+'why']:(p)=>{
  let s=ground(100,1100,GY)+ball1(T1)+ball2(T2x);
  s+=FA(T1-20,GY-160,T1-160,GY-160,{g:seg(p,.2,.35),w:8,head:22})+FA(T2x+20,GY-160,T2x+160,GY-160,{g:seg(p,.2,.35),w:8,head:22,color:F2});
  s+=fade(seg(p,.3,.45),label('同じ 大きさ・逆向き',600,130,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('作用・反作用',600,80,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'why2']:(p)=>{
  let s=T2(`\\Delta ${Pt}_1=${F12}\\Delta t`,380,110,{size:44});
  s+=T2(`\\Delta ${Pt}_2=${F21}\\Delta t`,820,110,{size:44,auto:false});
  s+=fade(seg(p,.1,.25),label('同じ Δt',600,190,{size:28,color:C.t,anchor:'middle',weight:700}));
  s+=card(300,260,600,120,T2(`\\Delta ${Pt}_1+\\Delta ${Pt}_2=0`,600,320,{size:48,auto:false}),seg(p,.5,.65),PC);
  return s;
 },
 [K+'why3']:(p)=>{
  const k=60,g1=seg(p,.05,.2),g2=seg(p,.35,.5);
  let s=fade(g1,label('衝突前',230,180,{size:28,color:C.ink,anchor:'end',weight:700})+PA(260,170,260+6*k,170,{w:9,head:22}));
  s+=fade(g2,label('衝突後',230,320,{size:28,color:C.ink,anchor:'end',weight:700})+PA(260,310,260+4*k,310,{w:9,head:22})+PA(260+4*k,310,260+6*k,310,{w:9,head:22,color:'#ffc9f1'}));
  s+=fade(seg(p,.6,.75),line(260+6*k,130,260+6*k,350,{color:C.hi,w:3,dash:'8 8'})+label('合計は 同じ',260+6*k+30,250,{size:30,color:C.hi,weight:700}));
  return s;
 },
 // ================= 数値例 =================
 [K+'ex']:(p)=>{
  const u=seg(p,.05,.9),xa=240+150*u;
  let s=ground(100,1100,GY)+posDir(80,60)+ball1(xa,{sub:'2.0 kg'})+ball2(T2x+120,{sub:'1.0 kg'});
  s+=VA(xa-40,GY-150,xa-40+3*VK,GY-150)+label('3.0 m/s',xa-40+1.5*VK,GY-168,{size:24,color:C.v,anchor:'middle',weight:700});
  s+=fade(seg(p,.5,.65),label('止まって いる',T2x+120,GY-110,{size:24,color:C.dim,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ex2']:(p)=>card(160,120,880,130,T2('2.0\\times 3.0+1.0\\times 0=6.0\\ \\mathrm{kg\\cdot m/s}',600,185,{size:42,auto:false}),seg(p,.1,.25),PC)+fade(seg(p,.1,.25),label('衝突前の 合計',600,90,{size:28,color:C.dim,anchor:'middle'})),
 [K+'ex3']:(p)=>{
  let s=card(160,40,880,100,T2('2.0\\times 3.0+1.0\\times 0=6.0',600,92,{size:38,auto:false}),1,C.faint);
  s+=fade(seg(p,.1,.25),T2('6.0=3.0\\,u',600,210,{size:50,auto:false}));
  s+=card(400,270,400,110,T2('u=2.0\\ \\mathrm{m/s}',600,328,{size:50,auto:false,color:C.v}),seg(p,.55,.7),C.v);
  return s;
 },
 [K+'stop']:(p)=>{
  let s=card(60,50,500,330,label('0.010 s で 止める',310,110,{size:32,color:C.t,anchor:'middle',weight:700}),seg(p,.05,.2));
  s+=fade(seg(p,.05,.2),wall(470,170,330)+ground(110,470,330)+mcart(380,330,{text:'2.0 kg'}));
  s+=FA(300,220,170,220,{g:seg(p,.5,.65),w:12,head:28})+fade(seg(p,.5,.65),label('600 N',235,195,{size:28,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,.05,.2),label('Δp の 大きさ 6.0',600,450,{size:28,color:PC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'stop2']:(p)=>{
  let s=card(60,50,500,330,label('0.010 s で 止める',310,110,{size:32,color:C.t,anchor:'middle',weight:700}),1);
  s+=wall(470,170,330)+ground(110,470,330)+mcart(380,330,{text:'2.0 kg'})+FA(300,220,170,220,{w:12,head:28})+label('600 N',235,195,{size:28,color:C.F,anchor:'middle',weight:700});
  s+=card(640,50,500,330,label('0.20 s かけて 止める',890,110,{size:32,color:C.t,anchor:'middle',weight:700}),seg(p,.05,.2));
  s+=fade(seg(p,.05,.2),rect(980,170,80,160,{fill:'#ffd6a0',fo:.45,stroke:'#ffd6a0',rx:36})+ground(690,1100,330)+mcart(870,330,{text:'2.0 kg'}));
  s+=FA(810,220,760,220,{g:seg(p,.2,.35),w:6,head:18})+fade(seg(p,.2,.35),label('30 N',785,195,{size:28,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('エアバッグ：時間を 長く → 力を 小さく',600,450,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= よくある間違い =================
 [K+'mis']:(p)=>card(150,120,900,200,label('よくある 間違い',600,185,{size:28,color:C.dim,anchor:'middle'})+label('運動エネルギーも 保存する？',600,260,{size:40,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a),
 [K+'k1']:(p)=>{
  let s=card(560,40,600,130,T2('\\tfrac12\\times 2.0\\times 3.0^2',860,90,{size:40,auto:false})+fade(seg(p,.5,.65),T2('=9.0\\ \\mathrm{J}',860,145,{size:40,auto:false,color:KC})),seg(p,.1,.25),KC);
  s+=line(100,440,520,440,{color:C.dim,w:2})+ebar(220,440,9,28,{g:seg(p,.6,.75),w:110,top:'9.0 J',text:'衝突前'});
  return s;
 },
 [K+'k2']:(p)=>{
  let s=card(560,40,600,130,T2('\\tfrac12\\times 3.0\\times 2.0^2',860,90,{size:40,auto:false})+fade(seg(p,.3,.45),T2('=6.0\\ \\mathrm{J}',860,145,{size:40,auto:false,color:KC})),seg(p,.05,.2),KC);
  s+=line(100,440,520,440,{color:C.dim,w:2})+ebar(220,440,9,28,{w:110,top:'9.0 J',text:'衝突前'});
  s+=ebar(420,440,6,28,{g:seg(p,.35,.5),w:110,text:'衝突後'})+fade(seg(p,.35,.5),label('6.0 J',420,440-6*28-12,{size:26,color:KC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),`<rect x="365" y="${440-9*28}" width="110" height="${3*28}" rx="6" fill="none" stroke="${C.a}" stroke-width="2.5" stroke-dasharray="7 7"/>`+label('3.0 J 減る',600,440-7.5*28,{size:28,color:C.a,weight:700}));
  return s;
 },
 [K+'k3']:(p)=>{
  const cols=[{h:'',color:C.ink,w:200},{h:'衝突前',color:C.ink,w:220},{h:'衝突後',color:C.ink,w:220}];
  let s=table({x:270,y:60,cols,rows:[['運動量','6.0','6.0'],['K','9.0 J','6.0 J']],size:32,rh:72,reveal:[seg(p,.05,.2),seg(p,.2,.35)]});
  s+=fade(seg(p,.5,.65),label('運動量 と 運動エネルギーは 別の 量',600,330,{size:32,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.45),label('減った 3.0 J → 変形・熱',600,400,{size:26,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'mis2']:(p)=>{
  let s=card(150,60,900,110,label('保存するのは 合計 p₁ ＋ p₂',600,128,{size:34,color:PC,anchor:'middle',weight:700}),seg(p,.05,.2),PC);
  s+=card(150,220,900,110,label('1個の 運動量は 変わる（球1：6.0 → 4.0）',600,288,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.45,.6));
  return s;
 },
 // ================= まとめ =================
 [K+'end']:(p)=>{
  let s=card(80,60,320,140,label('力積',240,120,{size:34,color:C.hi,anchor:'middle',weight:700})+label('が 運動量を 変える',240,170,{size:24,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.2,.3),label('→',440,140,{size:40,color:C.dim,anchor:'middle'}));
  s+=card(480,60,320,140,label('打ち消し合う',640,120,{size:32,color:C.hi,anchor:'middle',weight:700})+label('ぶつかり合う 力積',640,170,{size:24,color:C.ink,anchor:'middle'}),seg(p,.25,.4),C.hi);
  s+=fade(seg(p,.5,.6),label('→',840,140,{size:40,color:C.dim,anchor:'middle'}));
  s+=card(880,60,280,140,label('合計は 保存',1020,120,{size:32,color:PC,anchor:'middle',weight:700})+label('外力が なければ',1020,170,{size:24,color:C.ink,anchor:'middle'}),seg(p,.6,.75),PC);
  return s;
 },
 [K+'deep']:(p)=>card(200,120,800,200,label('なぜ そう なるかは',600,190,{size:30,color:C.ink,anchor:'middle'})+label('深く学ぶ版 で',600,265,{size:46,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

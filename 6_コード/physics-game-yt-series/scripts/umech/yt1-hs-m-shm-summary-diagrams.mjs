// 高校編「単振動・要点」(ys-hs-m-shm-summary) — 図。Stage 1200×515. 深1〜3/3 の部品を使う。
import {C,seg,fade,label,line,rect,arrow,tex} from './anim.mjs';
import {card,table,tag,T2,springBig,osc,five,SB} from './yt1-hs-m-shm-1-diagrams.mjs';
import {circ,shadow,sbox,G} from './yt1-hs-m-shm-2-diagrams.mjs';
import {pend,PP} from './yt1-hs-m-shm-3-diagrams.mjs';

const K='hs-m-shm-summary:';
const PI=Math.PI;
const TT=`{\\color{${C.t}}T}`, W=`{\\color{${C.p}}\\omega}`;
const O2={...SB,y:330};

export const hsShmSummaryDiagrams={
 [K+'c1']:(p)=>{
  let s=osc(p*2.4*PI,{o:O2,Fg:1,Vg:1,axis:1});
  s+=card(300,30,600,110,T2('F=-kx',600,90,{size:52}),seg(p,.1,.25),C.F);
  return s;
 },
 [K+'c2']:(p)=>{
  let s=fade(.45,osc(p*2*PI,{o:O2,axis:0}));
  s+=card(250,20,700,220,label('単振動の 周期',600,62,{size:26,color:C.dim,anchor:'middle'})+T2(TT+'=2\\pi\\sqrt{\\dfrac{m}{k}}',600,165,{size:52}),seg(p,0,.15),C.t);
  s+=fade(seg(p,.55,.7),label('振幅に よらない',600,290,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'w1']:(p)=>{
  const ph=PI/2-.4+seg(p,0,.9)*1.6;
  let s=osc(ph,{o:O2,Fg:1,Vg:1});
  s+=card(80,30,500,110,label('中心：力 0、速さ 最大',330,98,{size:32,color:C.v,anchor:'middle',weight:700}),seg(p,.05,.2),C.v);
  s+=card(640,30,480,110,label('慣性で 行き過ぎる',880,98,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'w2']:(p)=>{
  const th=p*2*PI;
  return circ({th,proj:1})+shadow({th,lab:seg(p,.1,.25)})+sbox({x:.1*Math.cos(th)})+card(800,60,360,110,label('円運動の 影',980,128,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
 },
 [K+'w3']:(p)=>{
  let s=card(80,80,480,180,label('影',320,125,{size:26,color:C.p,anchor:'middle',weight:700})+T2('a=-\\omega^2 x',320,200,{size:46}),seg(p,0,.15),C.p);
  s+=card(640,80,480,180,label('ばね',880,125,{size:26,color:C.F,anchor:'middle',weight:700})+T2('a=-\\dfrac{k}{m}\\,x',880,205,{size:46}),seg(p,.2,.35),C.F);
  s+=card(400,320,400,110,T2(W+'^2=\\dfrac{k}{m}',600,378,{size:48}),seg(p,.6,.75),C.p);
  return s;
 },
 [K+'w4']:(p)=>{
  const th=seg(p,0,.6)*2*PI;
  let s=circ({th,proj:1,ang:1})+shadow({th});
  s+=card(760,30,400,310,label('影 1往復 ＝ 点 1周',960,75,{size:26,color:C.hi,anchor:'middle',weight:700})+fade(seg(p,.4,.55),T2(TT+'=\\dfrac{2\\pi}{'+W+'}',960,160,{size:44}))+fade(seg(p,.65,.8),T2('=2\\pi\\sqrt{\\dfrac{m}{k}}',960,270,{size:44})),seg(p,0,.15),C.t);
  return s;
 },
 [K+'w5']:(p)=>{
  const th=p*2*PI;
  let s=circ({th,o:{...G,cx:430,cy:150,R:120},proj:0,plate:0})+circ({th,o:{...G,cx:430,cy:150,R:48},proj:0,plate:0});
  s+=card(720,60,440,200,label('振幅 A は 出てこない',940,120,{size:28,color:C.x,anchor:'middle',weight:700})+label('道のり 長い ＝ 速さも 大きい',940,190,{size:24,color:C.v,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'n1']:(p)=>{
  let s=springBig({x:.1,o:O2,axis:0,mass:'1.0 kg'});
  s+=fade(seg(p,.05,.2),label('k ＝ 100 N/m',300,200,{size:28,color:C.F,anchor:'middle',weight:700}));
  s+=card(640,40,520,110,T2(W+'=\\sqrt{100}=10\\ \\mathrm{rad/s}',900,98,{size:40}),seg(p,.45,.6),C.p);
  return s;
 },
 [K+'n2']:(p)=>{
  let s=fade(.4,springBig({x:.1,o:O2,axis:0,mass:'1.0 kg'}));
  s+=card(300,40,600,120,T2(TT+'=2\\pi\\div 10\\approx 0.63\\ \\mathrm{s}',600,102,{size:46,auto:false}),seg(p,.05,.2),C.t);
  return s;
 },
 [K+'n3']:(p)=>{
  const th=p*3.2*PI;
  const o1={...G,cx:430,by:170,wall:170},o2={...G,cx:430,by:400,wall:170};
  let s=sbox({x:.1*Math.cos(th),o:o1})+sbox({x:.05*Math.cos(th),o:o2});
  s+=fade(seg(p,.05,.2),label('0.10 m',760,178,{size:26,color:C.x,weight:700})+label('0.050 m',760,408,{size:26,color:C.x,weight:700}));
  s+=card(960,230,210,80,label('T ≈ 0.63 s',1065,282,{size:30,color:C.t,anchor:'middle',weight:700}),seg(p,.3,.45),C.t);
  return s;
 },
 [K+'n4']:(p)=>{
  let s=osc(PI/2,{o:O2,Vg:1,Vtext:'1.0 m/s'});
  s+=card(300,40,600,110,T2('A\\omega=0.10\\times 10=1.0\\ \\mathrm{m/s}',600,98,{size:40,auto:false}),seg(p,.1,.25),C.v);
  return s;
 },
 [K+'m1']:(p)=>{
  let s=card(200,90,800,200,label('よくある 間違い',600,145,{size:28,color:C.a,anchor:'middle',weight:700})+label('大きく 揺らすと 周期が 長く なる',600,225,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=fade(seg(p,.6,.75),line(300,218,900,236,{color:C.a,w:4}));
  return s;
 },
 ...Object.fromEntries([['m2',0],['m3',1]].map(([k,st])=>[K+k,(p)=>{
  const rows=[['1.0','100','0.63'],['1.0','400','0.31'],['4.0','100','1.26']];
  const cols=[{h:'m [kg]',color:C.ink,w:170},{h:'k [N/m]',color:C.F,w:190},{h:'T [s]',color:C.t,w:170}];
  let s=table({x:100,y:90,cols,rows,reveal:st?[1,seg(p,.05,.2),seg(p,.45,.6)]:[seg(p,0,.15),0,0],hl:st?[1,2]:[],rh:72,size:32});
  s+=card(760,90,400,150,label(st?'m・k で 決まる':'振幅を 変えても',960,150,{size:28,color:C.ink,anchor:'middle',weight:700})+label(st?'k 4倍 → 半分、m 4倍 → 2倍':'T は 同じ',960,205,{size:st?24:32,color:C.t,anchor:'middle',weight:700}),seg(p,.2,.35),C.t);
  return s;
 }])),
 [K+'m4']:(p)=>{
  let s=five({acc:1,tableG:1,hlEnd:seg(p,.55,.7)});
  return s;
 },
 [K+'s1']:(p)=>{
  const th=.3*Math.cos(p*2*PI);
  let s=pend({th,o:{...PP,x:300}});
  s+=card(620,60,540,170,T2(TT+'\\approx 2\\pi\\sqrt{\\dfrac{l}{g}}',890,145,{size:50}),seg(p,.05,.2),C.t);
  s+=fade(seg(p,.5,.65),label('l ＝ 1.0 m → 約 2.0 s',890,300,{size:30,color:C.t,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('小さい 振れ・質量に よらない',890,360,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'s2']:(p)=>{
  let s=card(200,60,800,140,label('ずれに 比例して 戻す 力 → 単振動',600,140,{size:34,color:C.F,anchor:'middle',weight:700}),seg(p,0,.15),C.F);
  s+=card(300,260,600,110,label('周期は 振幅に よらない',600,325,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'s3']:(p)=>five({tableG:1,hlEnd:seg(p,.5,.65),hlMid:seg(p,.1,.25)}),
 [K+'bye']:(p)=>card(200,110,800,230,label('なぜ そう なるかは',600,190,{size:30,color:C.ink,anchor:'middle'})+label('深く 学ぶ 版で',600,275,{size:46,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

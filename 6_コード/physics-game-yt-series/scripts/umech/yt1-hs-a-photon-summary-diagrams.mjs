// 高校編「光子と電子・要点」(ys-hs-a-photon-summary) — 図。Stage 1200×515.
// 深く学ぶ版と同じ部品・色（エネルギー 橙、ν 桃、W₀ 灰、Kmax 薄い橙、光子 黄、電子 青）。
import {C,seg,lin,fade,label,line,rect,dot,arrow,mix} from './anim.mjs';
import {card,tag,sceneT,electron,NEG,EC,NC,PH,W0C,KC,RED,UV,GRN,WHITE,cs,Et,nut,ht,Wt,Kt,U,TX,H_,E19,bigL,
 metal,wavy,photon,emit,ebar,stepBlock,base,cross,check,counter,cl} from './yt1-hs-a-photon-1-diagrams.mjs';

const K='hs-a-photon-summary:';
const fc=(x,y,w,h,src,{g=1,size=46,col=C.hi}={})=>card(x,y,w,h,TX(src,x+w/2,y+h/2+size*.3,{size}),g,col);
const KEQ=`${Kt}=${ht}${nut}-${Wt}`;
function stack(x,b0,hv,w0,k,{g=1,w=100}={}){
 const r=Math.max(0,hv-w0);
 return fade(g,rect(x-w/2,b0-w0*k,w,w0*k,{fill:W0C,fo:.4,stroke:W0C,sw:2.5,rx:4})+(r>0?rect(x-w/2,b0-hv*k,w,r*k,{fill:KC,fo:.55,stroke:KC,sw:2.5,rx:4}):'')
  +label('W₀',x+w/2+12,b0-w0*k/2+9,{size:26,color:W0C,weight:700})+(r>0?label('Kmax',x+w/2+12,b0-(w0+r/2)*k+9,{size:26,color:KC,weight:700}):''));
}
function pe(t,{g=1,col=UV,on=1}={}){
 let s=metal(160,420,520,{text:'金属'});
 for(let i=0;i<2;i++)s+=wavy(160+i*60,90,330+i*80,410,{color:col,ph:t*1.2,w:4});
 if(on)s+=emit(t,{x0:450,x1:640,y:420,n:4}).svg;
 return fade(g,s);
}
const steps=(p,k)=>{
 const b0=450,kk=70;let s=base(60,1140,b0)+stepBlock(660,1100,b0,2.3,kk,{x0:100,text:'W₀＝2.3 eV'});
 if(k>=1)s+=ebar(220,b0,1.8,kk,{w:70,stroke:RED,top:'1.8 eV',tcol:RED,g:k===1?seg(p,.1,.3):1})+fade(k===1?seg(p,.1,.3):1,label('赤 700 nm',220,b0+36,{size:24,color:RED,anchor:'middle',weight:700}));
 if(k>=2)s+=cross(220,b0-2.3*kk-40,{s:28,g:k===2?seg(p,.2,.4):1});
 if(k>=3)s+=ebar(440,b0,4.1,kk,{w:70,stroke:UV,top:'4.1 eV',tcol:UV,g:k===3?seg(p,.1,.3):1})+fade(k===3?seg(p,.1,.3):1,label('紫外線',440,b0+36,{size:24,color:UV,anchor:'middle',weight:700}));
 if(k>=4){s+=check(540,b0-4.1*kk+20,{g:seg(p,0,.2)});s+=fade(seg(p,.4,.6),line(400,b0-2.3*kk,480,b0-2.3*kk,{color:C.ink,w:3})+label('1.8',500,b0-3.2*kk+9,{size:26,color:KC,weight:700}));
  s+=card(700,40,460,100,TX(`${Kt}=4.1-2.3=${cs(KC,'1.8'+U('eV'))}`,930,102,{size:36}),seg(p,.4,.6),KC);}
 return s;
};
export const hsAPhotonSummaryDiagrams={
 [K+'c1']:(p,ctx)=>{const t=sceneT(p,ctx);return fc(380,40,440,130,`${Et}=${ht}${nut}`,{g:seg(p,0,.15),col:EC,size:60})+fade(seg(p,.4,.55),(()=>{let s='';for(let i=0;i<5;i++){const x=200+((t*160+i*180)%800);s+=photon(x,330);}return s;})())+bigL('光子',600,420,{size:30,color:PH,g:seg(p,.4,.55)});},
 [K+'c2']:(p)=>{
  let s=fc(380,40,440,130,`${Et}=${ht}${nut}`,{col:EC,size:60});
  s+=fade(seg(p,0,.2),TX(`${ht}=${H_}${U('J\\cdot s')}`,600,260,{size:42})+label('プランク定数',600,310,{size:24,color:C.dim,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),TX(`${nut}`,520,410,{size:46})+label('＝ 波の回の',620,408,{size:28,color:C.ink,anchor:'middle',weight:700})+TX(cs(NC,'f'),730,410,{size:46}));
  return s;
 },
 [K+'c3']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s=pe(t,{g:seg(p,0,.15)});
  s+=card(760,140,400,200,label('決めるのは',960,190,{size:28,color:C.ink,anchor:'middle',weight:700})+label('明るさ',880,270,{size:32,color:C.dim,anchor:'middle',weight:700})+label('振動数',1050,270,{size:32,color:NC,anchor:'middle',weight:700}),seg(p,.15,.3),C.hi);
  s+=fade(seg(p,.3,.45),line(830,258,930,258,{color:C.a,w:5}))+fade(seg(p,.45,.6),rect(985,232,130,56,{fill:'none',fo:0,stroke:GRN,sw:4,rx:12}));
  s+=bigL('光電効果',420,60,{size:34,color:C.hi,g:seg(p,.7,.85)});
  return s;
 },
 [K+'c4']:(p)=>{
  let s=fc(80,60,560,130,KEQ,{g:seg(p,0,.15),col:KC,size:50})+stack(900,470,4.1,2.3,80,{g:seg(p,.1,.3)});
  s+=fade(seg(p,.1,.3),label('hν',900,470-4.1*80-14,{size:28,color:EC,anchor:'middle',weight:700}));
  s+=card(80,280,560,120,label('W₀：出るのに 必要な',360,330,{size:28,color:W0C,anchor:'middle',weight:700})+label('最小の エネルギー（仕事関数）',360,375,{size:28,color:W0C,anchor:'middle',weight:700}),seg(p,.5,.65),W0C);
  return s;
 },
 [K+'r1']:(p)=>{
  const u=lin(p,.1,.5);let s=metal(100,400,1000,{text:''})+electron(650,380,{r:16});
  if(u<1)s+=photon(mix(250,630,u),mix(120,370,u))+ebar(mix(250,630,u),mix(95,345,u),1.8,60,{w:34});
  s+=ebar(710,385,1.8,60,{w:34,g:seg(p,.5,.6)})+bigL('1個を 丸ごと 受け取る',600,80,{size:32,color:C.hi,g:seg(p,.3,.45)});
  return s;
 },
 [K+'r2']:(p)=>{
  let s=card(40,40,540,420,'',1)+card(620,40,540,420,'',1);
  s+=bigL('明るさ ↑ → 個数が 増える',310,90,{size:28,color:PH});
  for(let i=0;i<4;i++)s+=photon(120+i*110,380)+ebar(120+i*110,350,1.8,45,{w:34});
  s+=fade(seg(p,.1,.25),line(80,350-2.3*45,540,350-2.3*45,{color:W0C,w:3,dash:'8 6'})+label('W₀',90,350-2.3*45-12,{size:26,color:W0C,weight:700}));
  s+=bigL('1個ずつ 足りない → 出ない',310,440,{size:26,color:C.a,g:seg(p,.2,.35)});
  s+=bigL('振動数 ↑ → 1個の エネルギー',890,90,{size:28,color:EC,g:seg(p,.5,.65)});
  s+=fade(seg(p,.5,.65),photon(890,380,{color:UV})+ebar(890,350,4.1,45,{w:50}));
  return s;
 },
 [K+'n0']:(p)=>card(150,150,900,140,TX(`1${U('eV')}=${E19}${U('J')}`,600,240,{size:52,color:EC}),seg(p,.2,.4),EC)+bigL('電子ボルト',600,350,{size:28,color:C.dim,g:seg(p,.3,.5)}),
 [K+'n1']:(p)=>steps(p,1),
 [K+'n2']:(p)=>steps(p,2),
 [K+'n2b']:(p)=>{let s=steps(1,2);for(let i=1;i<4;i++)s+=ebar(220+i*90,450,1.8,70,{w:50,stroke:RED,g:seg(p,.1+i*.1,.2+i*.1)});return s;},
 [K+'n3']:(p)=>steps(p,3),
 [K+'n4']:(p)=>steps(p,4),
 [K+'m1']:(p)=>card(200,120,800,120,label('明るくすると 電子が 速く 飛び出す',600,192,{size:32,color:C.a,anchor:'middle',weight:700}),seg(p,0,.15),C.a)+cross(600,180,{s:50,g:seg(p,.5,.65)}),
 [K+'m2']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s='';
  const pan=(x,n,txt)=>{let q=metal(x+30,400,440,{text:''});for(let i=0;i<n;i++)q+=wavy(x+40+i*34,80,x+150+i*40,390,{color:UV,ph:t*1.2,w:3,amp:6});q+=emit(t,{x0:x+260,x1:x+430,y:400,n:n+1}).svg+label(txt,x+250,480,{size:28,color:C.ink,anchor:'middle',weight:700})+ebar(x+30,360,1.8,50,{w:40,stroke:KC,fill:KC,top:'Kmax 1.8',tcol:KC});return q;};
  s+=fade(seg(p,0,.15),pan(40,2,'弱い 紫外線')+pan(640,6,'明るい 紫外線'));
  s+=bigL('数は 増える、1個の Kmax は 同じ',600,40,{size:30,color:C.hi,g:seg(p,.3,.45)});
  return s;
 },
 [K+'m3']:(p)=>{
  const b0=450,k=70;let s=base(60,1140,b0)+stepBlock(560,1100,b0,2.3,k,{text:'W₀＝2.3 eV',x0:100});
  s+=ebar(300,b0,1.8,k,{w:70,stroke:RED})+ebar(300,b0-1.8*k,1.8,k,{w:70,stroke:RED,g:seg(p,.1,.3)});
  s+=label('1.8 eV',350,b0-1.8*k/2+10,{size:26,color:RED,weight:700})+fade(seg(p,.1,.3),label('1.8 eV',350,b0-1.8*k*1.5+10,{size:26,color:RED,weight:700}));
  s+=cross(300,b0-1.8*k*2-50,{s:34,g:seg(p,.45,.6)});
  return s;
 },
 [K+'s1']:(p)=>fc(330,40,540,130,`${Et}=${ht}${nut}`,{g:seg(p,0,.15),col:EC,size:60}),
 [K+'s1b']:(p)=>fc(330,40,540,130,`${Et}=${ht}${nut}`,{col:EC,size:60})+bigL('出るか どうか → 振動数',600,250,{size:32,color:NC,g:seg(p,0,.15)})+fc(330,300,540,130,KEQ,{g:seg(p,.45,.6),col:KC,size:50}),
 [K+'s2']:(p)=>card(330,170,540,150,label('なぜ？ は',600,230,{size:30,color:C.dim,anchor:'middle'})+label('深く 学ぶ 版で',600,290,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.2),C.hi),
};

// 高校編「力と運動方程式・深く学ぶ 2/3」(ys-hs-m-force-2) — 図。Stage 1200×515.
// 合力（右 5 N・左 3 N）、つり合い、重力 mg（ばねばかり）、a＝g、垂直抗力 N、エレベーター。g＝9.8。
import {C,seg,fade,label,line,rect,dot,ring,arrow,tex,texWidth,ground,spring} from './anim.mjs';
import {card,ball,FA,VA,box,table,T2,MG,NN,Gt,Fc} from './yt1-hs-m-force-1-diagrams.mjs';

const K='hs-m-force-2:';
const U=40; // px per newton (horizontal tug)
// ---- tug: box (2 kg) pulled right R N and left L N ---------------------------------------------
export function tug(R,L,{g=1,gr=1,gl=1,x=600,y=330,labels=1,m='2 kg',vx=0}={}){
 let s=fade(g,ground(120,1080,y)+box(x,y,{w:130,h:90,text:m,size:28}));
 s+=FA(x+65,y-45,x+65+R*U,y-45,{g:g*gr,text:labels?`${R} N`:'',dy:-20});
 s+=FA(x-65,y-45,x-65-L*U,y-45,{g:g*gl,text:labels?`${L} N`:'',dy:-20});
 if(vx)s+=fade(vx*g,VA(x-40,y-130,x+80,y-130)+label('3 m/s',x+20,y-150,{size:26,color:C.v,anchor:'middle',weight:700}));
 return s;
}
const posAxis=(g=1,y=110)=>fade(g,arrow(850,y,1050,y,{color:C.dim,w:3,head:14})+label('正',1065,y+9,{size:28,color:C.ink,weight:700})+label('右向き',950,y-18,{size:24,color:C.dim,anchor:'middle'}));
// ---- spring scale with hanging weight --------------------------------------------------------
function hang(kg,N,{x=330,g=1,fa=1,len=0}={}){
 const top=70,L=90+len,by=top+L+40;
 let s=fade(g,line(x-90,top,x+90,top,{color:C.dim,w:4})+line(x,top,x,top+20,{color:C.dim,w:3})+`<g transform="rotate(90 ${x} ${top+20})">`+spring(x,x+L,top+20,{coils:8,amp:14,color:C.dim,w:3})+`</g>`);
 s+=fade(g,rect(x-50,by-20,100,80,{fill:'#8c97ad',fo:.7,rx:8})+label(kg,x,by+30,{size:26,color:C.ink,anchor:'middle',weight:700}));
 s+=FA(x+70,by+20,x+70,by+20-N*7,{g:g*fa,text:'ばねが 引く',size:24,dx:12,dy:0,anchor:'start'});
 s+=FA(x+70,by+20,x+70,by+20+N*7,{g:g*fa,text:'重力',size:24,dx:12,dy:10,anchor:'start'});
 return s;
}
// ---- desk with book ---------------------------------------------------------------------------
const DK={x:330,top:330};
export function desk({g=1,mg=0,nn=0,lab=1,y0=DK.top,x=DK.x}={}){
 let s=fade(g,rect(x-190,y0,380,22,{fill:'#9b7a52',fo:.9,stroke:'none',rx:4})+rect(x-170,y0+22,18,120,{fill:'#9b7a52',fo:.9,stroke:'none',rx:2})+rect(x+152,y0+22,18,120,{fill:'#9b7a52',fo:.9,stroke:'none',rx:2}));
 s+=fade(g,rect(x-70,y0-50,140,50,{fill:'#6a8fd8',fo:.8,stroke:'#a9c2f0',rx:4})+label('本',x,y0-17,{size:26,color:C.ink,anchor:'middle',weight:700}));
 s+=FA(x+30,y0-25,x+30,y0-25+118,{g:mg,w:8});
 if(lab&&mg>.1)s+=fade(mg,label('重力 mg',x+45,y0+110,{size:26,color:C.F,weight:700}));
 s+=FA(x-30,y0,x-30,y0-118,{g:nn,w:8});
 if(lab&&nn>.1)s+=fade(nn,label('垂直抗力 N',x-45,y0-100,{size:26,color:C.F,weight:700,anchor:'end'}));
 return s;
}
export function elevator({g=1,acc=1}={}){
 const x=330;
 let s=fade(g,rect(x-150,70,300,380,{fill:'#1a2540',fo:1,stroke:C.dim,sw:3,rx:6})+line(x,20,x,70,{color:C.dim,w:3}));
 s+=fade(g,rect(x-50,390,100,40,{fill:'#6a8fd8',fo:.8,stroke:'#a9c2f0',rx:4})+label('本',x,418,{size:24,color:C.ink,anchor:'middle',weight:700}));
 s+=FA(x+25,410,x+25,500,{g,w:7,head:18})+fade(g,label('mg',x+40,495,{size:24,color:C.F,weight:700}));
 s+=FA(x-25,390,x-25,280,{g,w:7,head:18})+fade(g,label('N',x-40,300,{size:26,color:C.F,weight:700,anchor:'end'}));
 s+=arrow(110,300,110,180,{color:C.a,w:5,head:16,g:acc})+fade(acc,label('a',130,250,{size:28,color:C.a,weight:700})+label('1.0 m/s²',110,340,{size:24,color:C.a,weight:700,anchor:'middle'}));
 return s;
}

export const hsForce2Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p)=>{
  let s=box(600,400,{text:'物体',w:130})+FA(535,345,400,345,{g:seg(p,.05,.2)})+FA(665,345,850,345,{g:seg(p,.1,.25)})+FA(600,310,600,190,{g:seg(p,.15,.3)});
  s+=card(760,90,400,120,label('F に 何を 入れる？',960,162,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'tug']:(p)=>tug(5,3,{gr:seg(p,.3,.5),gl:seg(p,.45,.65)}),
 [K+'guess']:(p)=>tug(5,3)+card(330,60,540,110,label('加速度は どちら向きに いくつ？',600,128,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi),
 // ================= S2 F は合力 =================
 [K+'sign']:(p)=>{
  let s=tug(5,3)+posAxis(seg(p,.05,.25));
  s+=fade(seg(p,.4,.55),label('＋5',600+65+5*U/2,205,{size:32,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('−3',600-65-3*U/2,205,{size:32,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sum']:(p)=>{
  let s=fade(.45,tug(5,3,{y:470,labels:0}));
  s+=fade(seg(p,.1,.3),T2('F=5+(-3)',600,110,{size:52,auto:true}));
  s+=card(420,170,360,110,T2('=2\\ \\mathrm{N}',600,230,{size:52,auto:false,color:Fc}),seg(p,.55,.7),C.F);
  return s;
 },
 [K+'name']:(p)=>{
  let s=card(300,60,600,130,label('すべての 力の 合計 ＝ 合力',600,140,{size:36,color:C.F,anchor:'middle',weight:700}),seg(p,.05,.2),C.F);
  s+=card(400,240,400,120,T2('ma=F',600,300,{size:56})+label('F ＝ 合力',600,345,{size:24,color:C.F,anchor:'middle'}),seg(p,.4,.55),C.F);
  return s;
 },
 [K+'arrows']:(p)=>{
  const X0=300,u=80;
  let s=label('右へ 5',X0-30,138,{size:26,color:C.F,anchor:'end',weight:700})+FA(X0,130,X0+5*u,130,{g:seg(p,.02,.15)});
  s+=fade(seg(p,.2,.35),label('左へ 3',X0-30,238,{size:26,color:C.F,anchor:'end',weight:700})+FA(X0+5*u,230,X0+2*u,230));
  s+=fade(seg(p,.4,.55),rect(X0+2*u,110,3*u,40,{fill:C.a,fo:.18,stroke:C.a,sw:2,rx:6})+label('打ち消す',X0+3.5*u,95,{size:24,color:C.a,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),label('合力',X0-30,348,{size:26,color:C.hi,anchor:'end',weight:700})+FA(X0,340,X0+2*u,340,{color:C.hi})+label('右へ 2 N',X0+2*u+30,350,{size:30,color:C.hi,weight:700}));
  for(let i=0;i<=5;i++)s+=line(X0+i*u,400,X0+i*u,410,{color:C.dim,w:2})+label(String(i),X0+i*u,440,{size:22,color:C.dim,anchor:'middle'});
  s+=line(X0,405,X0+5*u,405,{color:C.dim,w:2});
  return s;
 },
 [K+'calc']:(p)=>{
  let s=T2('a=\\dfrac{F}{m}',350,140,{size:52});
  s+=fade(seg(p,.1,.3),T2('=\\dfrac{2}{2}',350,290,{size:52,auto:false}));
  s+=card(620,150,480,140,tex('a=1\\ \\mathrm{m/s^2}',860,210,{size:48,auto:false,color:C.a})+label('右向き',860,265,{size:26,color:C.a,anchor:'middle',weight:700}),seg(p,.5,.65),C.a);
  return s;
 },
 [K+'wrong']:(p)=>{
  let s=card(150,90,420,170,label('5 ＋ 3 ＝ 8 N',360,165,{size:40,color:C.a,anchor:'middle',weight:700})+label('×',360,225,{size:36,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=card(630,90,420,170,label('5 ＋（−3）＝ 2 N',840,165,{size:38,color:C.F,anchor:'middle',weight:700})+label('逆向きは 引き算',840,225,{size:26,color:C.ink,anchor:'middle'}),seg(p,.5,.65),C.F);
  return s;
 },
 // ================= S3 つり合い =================
 [K+'bal']:(p)=>{
  let s=tug(5,5,{y:420,gl:seg(p,.05,.2)});
  s+=fade(seg(p,.3,.5),T2('F=5+(-5)=0\\ \\mathrm{N}',600,130,{size:50}));
  return s;
 },
 [K+'a0']:(p)=>{
  let s=tug(5,5,{y:420});
  s+=fade(seg(p,.05,.2),T2('ma=0\\ \\ \\to\\ \\ a=0',600,110,{size:48}));
  s+=card(400,170,400,90,label('力が つり合っている',600,228,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'rest']:(p)=>{
  let s=tug(5,5,{y:420});
  s+=card(250,80,700,180,label('a ＝ 0 ＝ 速度が 変わらない',600,145,{size:34,color:C.a,anchor:'middle',weight:700})+label('止まっていた → 止まったまま',600,215,{size:30,color:C.v,anchor:'middle',weight:700}),seg(p,.05,.2));
  return s;
 },
 [K+'move']:(p)=>tug(5,5,{y:420,vx:seg(p,.05,.2)})+card(760,80,400,110,label('動いていたら？',960,148,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi),
 [K+'move2']:(p)=>{
  const x=420+300*seg(p,.05,.9);
  let s=tug(5,5,{y:420,x,vx:1});
  s+=card(200,40,800,110,label('つり合い でも 止まっているとは 限らない',600,108,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 // ================= S4 重力 mg と落体 =================
 [K+'grav']:(p)=>{
  let s=`<circle cx="300" cy="620" r="300" fill="#2a6f9e" fill-opacity=".55"/>`+label('地球',300,470,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=ball(300,180,{r:22})+FA(300,206,300,300,{g:seg(p,.1,.3)})+fade(seg(p,.1,.3),label('重力',320,270,{size:28,color:C.F,weight:700}));
  s+=card(620,120,500,150,label('重力の 大きさは',870,180,{size:30,color:C.ink,anchor:'middle'})+label('どう 決まる？',870,240,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'scale']:(p)=>{
  let s=hang('1 kg',9.8,{fa:seg(p,.4,.6)});
  s+=card(640,110,480,190,label('止まったまま → a ＝ 0',880,170,{size:30,color:C.a,anchor:'middle',weight:700})+label('ばねが 引く 力 ＝ 重力',880,240,{size:32,color:C.F,anchor:'middle',weight:700}),seg(p,.6,.75),C.F);
  return s;
 },
 [K+'scale2']:(p)=>{
  let s=hang('1 kg',9.8,{x:200})+fade(seg(p,.4,.55),hang('2 kg',19.6,{x:470,len:40}));
  s+=table({x:700,y:90,cols:[{h:'質量',color:C.ink,w:180},{h:'重力',color:C.F,w:200}],rows:[['1 kg','9.8 N'],['2 kg','19.6 N']],reveal:[seg(p,.05,.2),seg(p,.4,.55)]});
  s+=fade(seg(p,.7,.85),label('質量に 比例（実験）',890,330,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'mg']:(p)=>{
  let s=card(150,80,900,110,label('1 kg あたり 9.8 N',600,150,{size:38,color:C.F,anchor:'middle',weight:700}),1,C.F);
  s+=fade(seg(p,.25,.4),label('9.8 を g と 書く',600,250,{size:30,color:C.ink,anchor:'middle'}));
  s+=card(400,290,400,130,label('重力 ＝',540,368,{size:32,color:C.ink,anchor:'end'})+T2(MG,620,365,{size:62,auto:false}),seg(p,.55,.7),C.F);
  return s;
 },
 [K+'ex']:(p)=>{
  let s=T2(MG+'=5.0\\times 9.8',600,130,{size:52,auto:false});
  s+=card(420,220,360,120,T2('=49\\ \\mathrm{N}',600,285,{size:56,auto:false,color:Fc}),seg(p,.4,.55),C.F);
  return s;
 },
 [K+'moon']:(p)=>{
  let s=card(100,70,480,330,label('地球',340,130,{size:32,color:C.ink,anchor:'middle',weight:700})+label('重力 49 N',340,220,{size:36,color:C.F,anchor:'middle',weight:700})+label('質量 5.0 kg',340,310,{size:34,color:C.ink,anchor:'middle',weight:700}),1);
  s+=card(620,70,480,330,label('月面',860,130,{size:32,color:C.ink,anchor:'middle',weight:700})+label('重力 約 8.2 N',860,220,{size:36,color:C.F,anchor:'middle',weight:700})+fade(seg(p,.55,.7),label('質量 5.0 kg',860,310,{size:34,color:C.ink,anchor:'middle',weight:700})),seg(p,.05,.2));
  s+=fade(seg(p,.2,.35),label('約 6分の1',600,450,{size:28,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('変わらない',860,370,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'massw']:(p)=>{
  let s=card(100,90,480,250,label('質量',340,155,{size:36,color:C.ink,anchor:'middle',weight:700})+label('単位 kg',340,220,{size:30,color:C.ink,anchor:'middle'})+label('物体 そのものの 量',340,285,{size:28,color:C.dim,anchor:'middle'}),seg(p,.05,.2));
  s+=card(620,90,480,250,label('重さ',860,155,{size:36,color:C.F,anchor:'middle',weight:700})+label('単位 N',860,220,{size:30,color:C.F,anchor:'middle'})+label('重力の 大きさ',860,285,{size:28,color:C.dim,anchor:'middle'}),seg(p,.45,.6),C.F);
  s+=fade(seg(p,.7,.85),label('別の 量',600,420,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'fall']:(p)=>{
  const y=110+200*seg(p,.1,.9)**2;
  let s=ball(300,y,{r:22})+FA(300,y+26,300,y+120,{text:''})+label('mg',325,y+100,{size:28,color:C.F,weight:700});
  s+=card(620,120,500,170,label('落ちる 物体が 受ける 力',870,180,{size:30,color:C.ink,anchor:'middle'})+label('重力 mg だけ',870,245,{size:38,color:C.F,anchor:'middle',weight:700}),seg(p,.4,.55),C.F);
  s+=fade(seg(p,.2,.35),label('空気抵抗 なし',870,340,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'eq']:(p)=>{
  let s=T2('ma=F',600,110,{size:52});
  s+=fade(seg(p,.15,.3),label('F に mg を 入れる',900,120,{size:26,color:C.hi}));
  s+=card(400,200,400,130,T2('ma='+MG,600,265,{size:58}),seg(p,.4,.55),C.F);
  return s;
 },
 [K+'cancel']:(p)=>{
  const st=seg(p,.15,.35);
  let s=T2('ma='+MG,600,110,{size:58});
  s+=fade(st,label('両辺を m で 割る',920,120,{size:26,color:C.hi}));
  {const W=texWidth('ma='+MG,58),L=600-W/2,wm=texWidth('m',58,false),x2=L+texWidth('ma=',58);
   s+=fade(st,line(L-2,128,L+wm+2,92,{color:C.hi,w:4})+line(x2-2,128,x2+wm+2,92,{color:C.hi,w:4}));}
  s+=card(400,220,400,130,T2('a='+Gt,600,285,{size:62,auto:false}),seg(p,.4,.55),C.a);
  s+=fade(seg(p,.65,.8),label('質量に よらない',600,420,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'table']:(p)=>{
  let s=table({x:250,y:120,cols:[{h:'質量 m',color:C.ink,w:220},{h:'重力 mg',color:C.F,w:220},{h:'加速度 a',color:C.a,w:240}],rows:[['10 kg','98 N','?'],['0.10 kg','0.98 N','?']],reveal:[seg(p,.15,.3),seg(p,.5,.65)],rh:70,size:34});
  return s;
 },
 [K+'table2']:(p)=>{
  let s=table({x:250,y:60,cols:[{h:'質量 m',color:C.ink,w:220},{h:'重力 mg',color:C.F,w:220},{h:'加速度 a',color:C.a,w:240}],rows:[['10 kg','98 N','9.8 m/s²'],['0.10 kg','0.98 N','9.8 m/s²']],rh:70,size:34,hl:seg(p,.05,.2)>.5?[0,1]:[]});
  s+=fade(seg(p,.05,.2),label('98 ÷ 10 ＝ 9.8',380,330,{size:30,color:C.a,anchor:'middle',weight:700})+label('0.98 ÷ 0.10 ＝ 9.8',820,330,{size:30,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('強く 引かれる ＝ 加速しにくい 分',600,430,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S5 垂直抗力 N =================
 [K+'desk']:(p)=>desk({mg:seg(p,.3,.45),nn:seg(p,.6,.75)})+fade(seg(p,.6,.75),card(680,120,460,120,label('机が 本を 上向きに 押す 力',910,190,{size:28,color:C.F,anchor:'middle',weight:700}),1,C.F)),
 [K+'nname']:(p)=>{
  let s=desk({mg:1,nn:1});
  s+=card(680,90,460,140,label('面に 垂直',910,145,{size:28,color:C.ink,anchor:'middle'})+label('垂直抗力 N',910,205,{size:38,color:C.F,anchor:'middle',weight:700}),seg(p,.05,.2),C.F);
  s+=card(680,270,460,150,label('記号 N：垂直抗力',910,325,{size:28,color:C.F,anchor:'middle',weight:700})+label('単位 N：ニュートン',910,385,{size:28,color:C.ink,anchor:'middle'}),seg(p,.55,.7));
  return s;
 },
 [K+'neq']:(p)=>{
  let s=desk({mg:1,nn:1});
  s+=fade(seg(p,.05,.2),arrow(1100,330,1100,230,{color:C.dim,w:3,head:12})+label('正',1100,215,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=card(640,120,420,90,label('縦の 合力 ＝ 0',850,178,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  s+=card(640,250,420,120,T2(NN+'-'+MG+'=0',850,312,{size:52,auto:false}),seg(p,.5,.65),C.F);
  return s;
 },
 [K+'nmg']:(p)=>{
  let s=desk({mg:1,nn:1});
  s+=T2(NN+'-'+MG+'=0',850,100,{size:46,auto:false});
  s+=fade(seg(p,.05,.15),label('両辺に mg を 足す',850,165,{size:26,color:C.hi,anchor:'middle'}));
  s+=card(660,190,380,100,T2(NN+'='+MG,850,242,{size:54,auto:false}),seg(p,.1,.25),C.F);
  s+=card(620,320,460,120,label('2.0 × 9.8 ＝ 19.6',850,370,{size:30,color:C.ink,anchor:'middle',weight:700})+label('垂直抗力 N は 19.6 N',850,420,{size:30,color:C.F,anchor:'middle',weight:700}),seg(p,.5,.65),C.F);
  return s;
 },
 [K+'elev']:(p)=>elevator({acc:seg(p,.2,.4)})+card(640,120,480,160,label('上向きに 加速する',880,180,{size:30,color:C.ink,anchor:'middle'})+label('N は？',880,245,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi),
 [K+'elev2']:(p)=>{
  let s=elevator();
  s+=card(640,60,480,90,label('縦の 合力 ＝ ma（0 ではない）',880,118,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.02,.15),C.hi);
  s+=fade(seg(p,.25,.4),T2(NN+'-'+MG+'=ma',880,225,{size:48,auto:false}));
  s+=fade(seg(p,.55,.65),label('両辺に mg を 足す',880,290,{size:24,color:C.hi,anchor:'middle'}));
  s+=card(660,320,440,110,T2(NN+'='+MG+'+ma',880,378,{size:50,auto:false}),seg(p,.7,.85),C.F);
  return s;
 },
 [K+'elev3']:(p)=>{
  let s=elevator();
  s+=T2(NN+'='+MG+'+ma',880,90,{size:46,auto:false});
  s+=fade(seg(p,.05,.2),T2('=19.6+2.0\\times 1.0',880,180,{size:44,auto:false}));
  s+=card(680,230,400,100,T2('=21.6\\ \\mathrm{N}',880,282,{size:50,auto:false,color:Fc}),seg(p,.3,.45),C.F);
  s+=fade(seg(p,.6,.75),label('N ＝ mg は いつでも ではない',880,400,{size:30,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p)=>{
  let s=card(150,70,900,130,label('ma ＝ F の F ＝ 合力',600,135,{size:40,color:C.F,anchor:'middle',weight:700})+label('物体が 受ける すべての 力の 合計',600,180,{size:26,color:C.ink,anchor:'middle'}),seg(p,.02,.15),C.F);
  s+=fade(seg(p,.4,.55),tug(5,3,{y:420}));
  return s;
 },
 [K+'bal2']:(p)=>{
  let s=card(150,70,900,130,label('つり合い ＝ 1つの 物体の 合力が 0',600,148,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.02,.15),C.hi);
  s+=card(150,250,900,110,label('止まっているとは 限らない（速度が 変わらない）',600,318,{size:30,color:C.v,anchor:'middle',weight:700}),seg(p,.5,.65),C.v);
  return s;
 },
 [K+'mis']:(p)=>{
  let s=desk({mg:1,nn:1});
  s+=card(640,150,500,170,T2(NN+'='+MG,890,215,{size:50,auto:false})+label('縦に 加速しない ときだけ',890,285,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'next']:(p)=>{
  let s=desk({mg:0,nn:1,lab:0});
  s+=fade(seg(p,.05,.2),label('机が 本を 押す',330-50,200,{size:26,color:C.F,anchor:'end',weight:700}));
  s+=FA(380,334,380,450,{g:seg(p,.5,.65),color:'#5fc39b'})+fade(seg(p,.5,.65),label('本が 机を 押す',520,440,{size:26,color:'#5fc39b',weight:700}));
  return s;
 },
 [K+'next2']:(p)=>{
  let s=fade(.35,desk({mg:0,nn:1,lab:0})+FA(380,334,380,450,{color:'#5fc39b'}));
  s+=card(600,110,560,200,label('この 2つの 力は',880,175,{size:30,color:C.ink,anchor:'middle'})+label('つり合いの 2力 と 同じ？',880,250,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'bye']:(p)=>card(200,110,800,230,label('次回',600,175,{size:28,color:C.dim,anchor:'middle'})+label('力と運動方程式',600,255,{size:52,color:C.hi,anchor:'middle',weight:700})+label('深く学ぶ 3/3',600,315,{size:30,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.hi),
};

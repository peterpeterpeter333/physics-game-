// YouTube シリーズ「電位・中級 2/3」(ys-um-electrostatic-potential-path-2) — 図。Stage 1200×515.
// 例は 1/3 と同じ：𝐄＝(4, 0) N/C、A(0, 0)→B(3, 2) m、q＝2 C、W＝24 J → ΔU＝−24 J → ΔV＝−12 V。地図 V＝−4x [V]。
// 部品は 1/3（yt1-um-electrostatic-potential-path-1-diagrams.mjs）から使う。
// 色：電場 𝐄 水色、電位 V 紫、電荷 q 桃、仕事・位置エネルギー 橙、強調 黄、負・誤り 赤、d𝐫 金、力 F 緑。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,highlight} from './anim.mjs';
import {EC,VC,QP,WC,AL,NG,DC,FC,QC,PA,PB,cs,T,card,cross,L,vE,q,dr,Wt,Vt,IAB,charge,PL,P,plane,AB,polyPath,PATH1,PATH2,BL} from './yt1-um-electrostatic-potential-path-1-diagrams.mjs';

const K='um-electrostatic-potential-path-2:';
const WAB=Wt('W_{\\mathrm{AB}}'),dU=Wt('\\Delta U'),dV=Vt('\\Delta V'),VB=Vt('V_{\\mathrm{B}}'),VA=Vt('V_{\\mathrm{A}}');
const INT=`${IAB}${vE}\\cdot${dr}`;
// horizontal box [left,width] of `part` following `pre` inside `full` centred at x
const hb=(full,pre,part,x,size)=>{const W=texWidth(full,size,false),l=x-W/2+(pre?texWidth(pre,size,false):0);return [l,texWidth(part,size,false)];};
// potential map: V = -4x, colour bands, equipotential lines
function vmap({g=1,lines=1,vals=1,field=1,o=PL}={}){
 let s='';
 for(let k=0;k<3;k++){const a=P([k,0],o),b=P([k+1,2.2],o);s+=fade(g,`<rect x="${a[0]}" y="${b[1]}" width="${b[0]-a[0]}" height="${a[1]-b[1]}" fill="${VC}" fill-opacity="${(.32-.1*k).toFixed(2)}"/>`);}
 s+=plane({field,fop:.55,o,rows:[.5,1.5]});
 for(let k=0;k<=3;k++){const a=P([k,0],o),b=P([k,2.2],o);s+=fade(lines,line(a[0],a[1],b[0],b[1],{color:VC,w:3,dash:k?'8 6':''}));
  s+=fade(vals,label(`${k?'−':''}${4*k} V`,a[0]+(k?0:18),b[1]-12,{size:22,color:VC,anchor:'middle',weight:700}));}
 return s;
}

// ΔV = (−q∫𝐄·d𝐫)/q laid out by hand so the two q's can be marked. y: fraction bar.
function qfrac(y,{size=58,x=640}={}){
 const pre='-\\;',num=`${pre}${q}\\;\\;${INT}`,lhs=`${dV}=`,Wn=texWidth(num,size,false),Wl=texWidth(lhs,size,false);
 const cx=x+Wl/2,left=cx-Wn/2;
 let svg=T(lhs,cx-Wn/2-18,y+size*.02,{size,anchor:'end'})+T(num,cx,y-size*.78,{size})+line(left-6,y,left+Wn+6,y,{color:C.ink,w:3})+T(q,cx,y+size*.78,{size});
 const qn=[left+texWidth(pre,size,false)+texWidth(q,size,false)*.5+6,y-size*.78-size*.36],qd=[cx,y+size*.78-size*.15];
 return {svg,qn,qd};
}

export const ytUmElectrostaticPotentialPath2Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=plane({})+AB({})+polyPath(PATH1,{color:PA})+polyPath(PATH2,{color:PB})+draw([P([0,0]),P([3,2])],1,{color:C.ink,w:4});
  s+=card(680,120,470,240,L('前回',915,175,{size:24,color:C.dim})+T(`${q}=2\\ \\mathrm{C},\\;${vE}=(4,\\;0)\\ \\mathrm{N/C}`,915,245,{size:36})+L('どの道でも 24 J',915,320,{size:32,color:WC,weight:700}),seg(p,.2,.4),C.faint);
  return s;
 },
 [K+'lastq']:(p)=>{
  let s=card(100,90,1000,170,L('道に よらない なら',600,160,{size:28})+T(`${WAB}=(\\ \\text{?}\\ )_{\\mathrm{A}}-(\\ \\text{?}\\ )_{\\mathrm{B}}`,600,225,{size:48}),1,C.faint);
  s+=card(300,300,600,130,L('位置 だけで 決まる 量 は？',600,380,{size:34,color:C.hi,weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'ask']:(p)=>{
  let s=card(100,90,1000,180,L('電位の 差 を',600,160,{size:30,color:VC,weight:700})+L('線積分 から どう 定義 する？',600,225,{size:36,color:C.hi,weight:700}),1,C.hi);
  s+=fade(seg(p,.4,.6),T(`${q}${INT}\\;\\longrightarrow\\;${Vt('V')}\\ ?`,600,380,{size:56}));
  return s;
 },
 // ===== S2 仕事から位置エネルギーへ =====
 [K+'Wab']:(p)=>{
  let s=T(`${WAB}=${q}\\int_C${vE}\\cdot${dr}`,600,150,{size:70});
  s+=fade(seg(p,.3,.5),L('A から B へ 運ぶ 間に 電場が する 仕事',600,300,{size:28,color:WC,weight:700}));
  return s;
 },
 [K+'limits']:(p)=>{
  const u=seg(p,.2,.55);
  let s=fade(1-u,T(`${WAB}=${q}\\int_C${vE}\\cdot${dr}`,600,150,{size:70}));
  s+=fade(u,T(`${WAB}=${q}${INT}`,600,150,{size:70}));
  s+=fade(seg(p,.55,.7),card(250,290,700,150,L('静電場：道に よらない',600,345,{size:28,color:EC,weight:700})+L('→ 始点 A と 終点 B だけ 書けば よい',600,405,{size:28}),1,C.faint));
  return s;
 },
 [K+'dU']:(p)=>{
  let s=card(120,70,960,200,L('位置エネルギー・中級',600,120,{size:24,color:C.dim})+T(`d${Wt('U')}=-${cs(FC,'F')}\\,d${cs(C.x,'x')}`,600,205,{size:60}),1,C.faint);
  s+=fade(seg(p,.3,.5),L('力が する 仕事 の 符号を 変えた もの ＝ U の 増加（定義）',600,340,{size:28,color:C.ink}));
  return s;
 },
 [K+'dUe']:(p)=>{
  let s=T(`${dU}=${Wt('U_{\\mathrm{B}}')}-${Wt('U_{\\mathrm{A}}')}=-${WAB}`,600,150,{size:66});
  s+=fade(seg(p,.1,.3),label('電気 でも 同じ',600,50,{size:26,color:C.dim,anchor:'middle'}));
  s+=card(200,290,800,150,L('電場が 仕事を した 分 だけ',600,350,{size:28})+L('位置エネルギー が 減る',600,405,{size:32,color:WC,weight:700}),seg(p,.3,.45),C.faint);
  return s;
 },
 [K+'num']:(p)=>{
  let s=plane({})+AB({})+charge(...P([0,0]),{text:'2 C'})+charge(...P([3,2]),{text:'',g:.6});
  s+=fade(seg(p,.05,.2),draw([P([0,0]),P([3,2])],1,{color:C.ink,w:3,dash:'8 7'}));
  s+=card(680,90,470,300,T(`${WAB}=24\\ \\mathrm{J}`,915,160,{size:42})+fade(seg(p,.2,.35),T(`${dU}=${cs(NG,'-24\\ \\mathrm{J}')}`,915,240,{size:42}))
   +fade(seg(p,.5,.65),L('B では A より 24 J 低い',915,330,{size:28,color:WC,weight:700})),1,C.faint);
  return s;
 },
 [K+'why']:(p)=>{
  let s=card(80,90,500,320,L('静電場',330,145,{size:28,color:EC,weight:700})+L('W は 道に よらない',330,215,{size:28})+L('→ ΔU は 一つに 決まる',330,285,{size:30,color:C.hi,weight:700}),1,C.hi);
  s+=card(620,90,500,320,L('道で 値が 変わる 力',870,145,{size:28,color:FC,weight:700})+L('W が 道ごとに 違う',870,215,{size:28})+L('→ ΔU は 決められない',870,285,{size:30,color:NG,weight:700}),seg(p,.4,.55),NG);
  return s;
 },
 // ===== S3 電荷で割る =====
 [K+'prop']:(p)=>{
  const rows=[['1 C','−12 J'],['2 C','−24 J']];
  let body=label('運ぶ 電荷',340,160,{size:26,color:C.dim,anchor:'middle'})+label('ΔU',820,160,{size:26,color:C.dim,anchor:'middle'})+line(180,178,1020,178,{color:C.faint,w:2});
  rows.forEach(([a,b],i)=>{const y=240+i*70;body+=fade(seg(p,.1+i*.25,.25+i*.25),label(a,340,y,{size:34,color:QP,anchor:'middle',weight:700})+label(b,820,y,{size:34,color:NG,anchor:'middle',weight:700}));});
  body+=fade(seg(p,.6,.75),label('電荷に 比例',600,420,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return card(150,100,900,360,body,1,C.faint);
 },
 [K+'div']:(p)=>{
  let s=T(`${dV}=\\dfrac{${dU}}{${q}}`,600,160,{size:80});
  s+=fade(seg(p,.1,.3),label('1 C あたりに 直す',900,150,{size:26,color:QP,weight:700}));
  s+=fade(seg(p,.35,.5),label('電位差（定義）',600,300,{size:32,color:VC,anchor:'middle',weight:700}));
  s+=card(300,340,600,120,T(`\\mathrm{J/C}=${Vt('\\mathrm{V}')}`,500,405,{size:48})+label('ボルト',760,415,{size:30,color:VC,anchor:'middle',weight:700}),seg(p,.6,.75),VC);
  return s;
 },
 [K+'elem']:(p)=>{
  let s=T(`${dV}=\\dfrac{${dU}}{${q}}`,600,160,{size:70});
  s+=card(200,300,800,150,L('初級：電位 ＝ 1 C あたりの 位置エネルギー',600,360,{size:28})+L('同じ 直し方',600,415,{size:30,color:C.hi,weight:700}),seg(p,.1,.25),C.faint);
  return s;
 },
 [K+'volt']:(p)=>{
  let s=card(80,100,500,300,T(`1\\ ${Vt('\\mathrm{V}')}=1\\ \\mathrm{J/C}`,330,200,{size:52})+L('1 C あたり 1 J の 差',330,300,{size:28,color:C.ink}),1,VC);
  // a battery
  const bx=760,by=170;
  let bat=rect(bx,by,240,110,{fill:'#3a4a66',fo:.5,stroke:C.dim,rx:14})+rect(bx+240,by+35,20,40,{fill:C.dim,fo:.8,stroke:C.dim,rx:4})
   +label('1.5 V',bx+120,by+68,{size:34,color:VC,anchor:'middle',weight:700})+label('+',bx+220,by-12,{size:28,color:QC,anchor:'middle',weight:700})+label('−',bx+20,by-12,{size:28,color:'#6f9dff',anchor:'middle',weight:700});
  s+=fade(seg(p,.35,.5),bat);
  s+=fade(seg(p,.6,.75),L('1 C を 運ぶと 1.5 J',880,360,{size:28,color:WC,weight:700}));
  return s;
 },
 [K+'sub1']:(p)=>{
  let s=T(`${dV}=\\dfrac{${dU}}{${q}}`,600,110,{size:56});
  s+=fade(seg(p,.1,.25),label(`ΔU ＝ −W を 入れる`,900,110,{size:26,color:WC,weight:700}));
  s+=fade(seg(p,.35,.55),T(`${dV}=\\dfrac{-${WAB}}{${q}}`,600,320,{size:66}));
  return s;
 },
 [K+'sub2']:(p)=>{
  let s=T(`${dV}=\\dfrac{-${WAB}}{${q}}`,600,110,{size:56});
  s+=fade(seg(p,.1,.25),label(`W ＝ q∫𝐄·d𝐫 を 入れる`,890,110,{size:26,color:WC,weight:700}));
  const F=qfrac(330,{size:58});
  s+=fade(seg(p,.3,.5),F.svg);
  s+=fade(seg(p,.6,.75),ring(F.qn[0],F.qn[1],24,{color:C.hi,w:3})+ring(F.qd[0],F.qd[1],24,{color:C.hi,w:3}));
  return s;
 },
 [K+'cancel']:(p)=>{
  const F=qfrac(170,{size:58});
  let s=fade(1-seg(p,.4,.6),F.svg+fade(seg(p,.05,.25),cross(F.qn[0],F.qn[1],18,NG)+cross(F.qd[0],F.qd[1],18,NG)));
  s+=fade(seg(p,.4,.6),T(`${VB}-${VA}=-${INT}`,600,150,{size:72}));
  s+=card(250,300,700,140,L('運ぶ 電荷 q が 消えた',600,355,{size:30,color:QP,weight:700})+L('→ 電場 だけで 決まる',600,410,{size:30,color:EC,weight:700}),seg(p,.65,.8),C.hi);
  return s;
 },
 [K+'meaning']:(p)=>{
  let s=vmap({lines:0,vals:0,g:0})+AB({});
  s+=arrow(...P([.2,1]),...P([2.8,1]),{color:DC,w:5,head:16,g:seg(p,.05,.3)});
  s+=card(680,90,470,300,T(`${INT}>0`,915,160,{size:40})+L('電場の 向きに 進む',915,230,{size:26})+fade(seg(p,.35,.5),T(`${VB}-${VA}<0`,915,300,{size:40}))+fade(seg(p,.6,.75),L('負号 ＝ 電位が 下がる 向き',915,365,{size:26,color:C.hi,weight:700})),seg(p,.1,.25),C.faint);
  return s;
 },
 [K+'base']:(p)=>{
  let s=plane({})+AB({lab:0})+BL('A',P([0,0])[0]-22,P([0,0])[1]+34,{size:26,color:C.ink,anchor:'end',weight:700})+BL('B',P([3,2])[0]+14,P([3,2])[1]-12,{size:26,color:C.ink,weight:700});
  s+=fade(seg(p,.1,.3),ring(...P([0,0]),18,{color:VC,w:3})+BL('V ＝ 0（基準）',P([0,0])[0]+30,P([0,0])[1]-30,{size:24,color:VC,weight:700}));
  s+=card(680,120,470,240,L('決めたのは 差 だけ',915,180,{size:28})+fade(seg(p,.35,.5),L('V(A) ＝ 0 と 選べば',915,255,{size:28,color:VC}))+fade(seg(p,.6,.75),L('V(B) ＝ B の 電位',915,320,{size:32,color:VC,weight:700})),seg(p,.02,.15),C.faint);
  return s;
 },
 // ===== S4 単位と読み方 =====
 [K+'unit1']:(p)=>{
  let s=T(`${INT}`,600,90,{size:50});
  s+=fade(seg(p,.1,.3),T(`\\mathrm{\\tfrac{N}{C}}\\times\\mathrm{m}`,340,260,{size:60}));
  s+=fade(seg(p,.45,.6),arrow(470,250,560,250,{color:C.hi,w:4,head:14})+T(`\\mathrm{\\tfrac{N\\cdot m}{C}}`,700,260,{size:60}));
  return s;
 },
 [K+'unit2']:(p)=>{
  let s=T(`\\mathrm{\\tfrac{N}{C}}\\times\\mathrm{m}=\\mathrm{\\tfrac{N\\cdot m}{C}}`,600,90,{size:48});
  s+=fade(seg(p,.05,.25),T(`=\\mathrm{\\tfrac{${'J'}}{C}}`,450,230,{size:56})+label('N·m ＝ J',450,300,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.3,.45),T(`=${Vt('\\mathrm{V}')}`,720,230,{size:56}));
  s+=card(250,340,700,120,T(`\\mathrm{N/C}=${Vt('\\mathrm{V}')}/\\mathrm{m}`,600,405,{size:50}),seg(p,.6,.75),EC);
  return s;
 },
 [K+'val']:(p)=>{
  let s=T(`${dV}=\\dfrac{${dU}}{${q}}=\\dfrac{-24\\ \\mathrm{J}}{2\\ \\mathrm{C}}=${Vt('-12\\ \\mathrm{V}')}`,600,140,{size:56});
  s+=card(250,300,700,130,L('B は A より 12 V 低い',600,375,{size:34,color:VC,weight:700}),seg(p,.45,.6),VC);
  return s;
 },
 [K+'direct']:(p)=>{
  let s=T(`${VB}-${VA}=-${INT}`,600,90,{size:50});
  s+=fade(seg(p,.1,.3),T(`=-(4\\times3+0\\times2)`,600,220,{size:54}));
  s+=fade(seg(p,.35,.5),T(`=${Vt('-12\\ \\mathrm{V}')}`,600,330,{size:58}));
  s+=fade(seg(p,.6,.75),L('電荷を 使わずに 同じ 値',600,440,{size:28,color:C.hi,weight:700}));
  return s;
 },
 [K+'rev']:(p)=>{
  let s=vmap({})+AB({bdx:16,bdy:34});
  s+=arrow(...P([2.9,1.9]),...P([.15,.1]),{color:DC,w:5,head:16,g:seg(p,.05,.35)});
  s+=card(680,120,470,230,L('B → A なら',915,185,{size:30,color:C.ink,weight:700})+T(`${VA}-${VB}=\\ ?`,915,270,{size:48}),seg(p,.2,.35),C.hi);
  return s;
 },
 [K+'revans']:(p)=>{
  let s=vmap({})+AB({bdx:16,bdy:34});
  s+=arrow(...P([2.9,1.9]),...P([.15,.1]),{color:DC,w:5,head:16});
  s+=card(680,120,470,250,L('始点と 終点が 入れ替わる',915,180,{size:26})+fade(seg(p,.1,.3),T(`${VA}-${VB}=${Vt('+12\\ \\mathrm{V}')}`,915,260,{size:46}))+fade(seg(p,.5,.65),L('高い A へ 12 V 上る',915,335,{size:28,color:VC,weight:700})),1,C.faint);
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=plane({})+AB({})+charge(...P([0,0]),{text:'3 C'});
  s+=card(680,120,470,230,L('3 C を A → B',915,185,{size:30,color:QP,weight:700})+L('ΔU は？',915,270,{size:38,color:C.hi,weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'qans']:(p)=>{
  let s=T(`${dU}=${q}\\,${dV}`,600,90,{size:56});
  s+=fade(seg(p,.1,.3),T(`=3\\times(-12)=${cs(NG,'-36\\ \\mathrm{J}')}`,600,210,{size:56}));
  s+=card(250,300,700,150,L('電位差は 電荷に よらない',600,355,{size:28,color:VC,weight:700})+L('→ 電荷を 掛ける だけ',600,410,{size:28}),seg(p,.5,.65),C.faint);
  return s;
 },
 [K+'map']:(p)=>{
  let s=vmap({g:seg(p,.05,.3),lines:seg(p,.3,.5),vals:seg(p,.3,.5)})+AB({bdx:16,bdy:34});
  s+=card(680,120,470,250,L('A を 基準（0 V）',915,175,{size:26,color:C.dim})+L('右へ 1 m ごとに 4 V 下がる',915,240,{size:28,color:VC,weight:700})+fade(seg(p,.6,.75),L('上下に 動いても 変わらない',915,305,{size:28})),seg(p,.1,.25),VC);
  return s;
 },
 [K+'contour']:(p)=>{
  let s=vmap({})+AB({bdx:16,bdy:34});
  s+=fade(seg(p,.05,.2),highlight(P([1,0])[0]-12,P([1,2.2])[1],24,P([0,0])[1]-P([1,2.2])[1],1,VC));
  s+=card(680,120,470,250,L('同じ 電位の 線 ＝ 縦の 直線',915,180,{size:26,color:VC,weight:700})+fade(seg(p,.4,.55),L('𝐄 は この線と 直角',915,245,{size:28,color:EC,weight:700}))+fade(seg(p,.55,.7),L('高い 電位 → 低い 電位',915,305,{size:28,color:EC})),seg(p,.1,.25),C.faint);
  return s;
 },
 [K+'hill']:(p)=>{
  // slope picture: height = V along x
  const X=u=>150+u*140,Y=v=>140+(-v)*20;// V from 0 to -12
  let s=draw([[X(0),Y(0)],[X(3),Y(-12)]],1,{color:VC,w:5})+line(X(0),Y(-12),X(3),Y(-12),{color:C.faint,w:2});
  s+=label('0 V',X(0)-14,Y(0)+8,{size:24,color:VC,anchor:'end',weight:700})+label('−12 V',X(3)+14,Y(-12)+8,{size:24,color:VC,weight:700});
  s+=label('A',X(0),Y(0)-18,{size:26,color:C.ink,anchor:'middle',weight:700})+label('B 側',X(3),Y(-12)-40,{size:26,color:C.ink,anchor:'middle',weight:700});
  const bx=X(1.2),by=Y(-4.8)-14;s+=ring(bx,by,13,{color:QC,w:3,fill:'#3a1d2a'})+label('+',bx,by+6,{size:20,color:QC,anchor:'middle',weight:700});
  s+=fade(seg(p,.4,.6),arrow(bx,by,bx+80,by+32,{color:FC,w:5,head:14})+label('力：低い 方へ',bx+90,by+64,{size:24,color:FC,weight:700}));
  s+=card(720,110,430,250,L('電位 ＝ 標高',935,175,{size:30,color:VC,weight:700})+L('（初級と 同じ 比喩）',935,225,{size:24,color:C.dim})+fade(seg(p,.4,.6),L('正の電荷への力 → 低い方',935,295,{size:26,color:FC,weight:700})),seg(p,.05,.2),C.faint);
  return s;
 },
 [K+'notalways']:(p)=>{
  const X=u=>150+u*140,Y=v=>140+(-v)*20;
  let s=draw([[X(0),Y(0)],[X(3),Y(-12)]],1,{color:VC,w:5});
  s+=label('0 V',X(0)-14,Y(0)+8,{size:24,color:VC,anchor:'end',weight:700})+label('−12 V',X(3)+14,Y(-12)+8,{size:24,color:VC,weight:700});
  const k=seg(p,.1,.9),u=1.8-1.2*Math.sin(Math.PI*k);// goes up then comes back
  const bx=X(u),by=Y(-4*u)-14;s+=ring(bx,by,13,{color:QC,w:3,fill:'#3a1d2a'})+label('+',bx,by+6,{size:20,color:QC,anchor:'middle',weight:700});
  s+=arrow(bx,by,bx+70,by+28,{color:FC,w:4,head:12});
  s+=fade(seg(p,.05,.2)*(1-seg(p,.45,.55)),arrow(bx-10,by-20,bx-90,by-52,{color:C.v,w:4,head:12})+label('左向きの 速さ',bx-40,by-92,{size:24,color:C.v,anchor:'middle',weight:700}));
  s+=card(720,110,430,260,L('力の 向き：低い方',935,175,{size:26,color:FC,weight:700})+L('動く 向き：初速 しだい',935,240,{size:26,color:C.v,weight:700})+L('しばらく 高い方へ 上る',935,305,{size:26,color:C.ink}),seg(p,.3,.45),C.faint);
  return s;
 },
 [K+'ball']:(p)=>{
  let s=card(60,80,520,380,L('対応する',320,135,{size:28,color:C.hi,weight:700})+L('・高さ ↔ 電位',320,205,{size:26})+L('・下る向き ↔ 正の電荷への力',320,265,{size:26})+L('・力の向き ≠ 動く向き（両方）',320,325,{size:26}),1,C.hi);
  s+=card(620,80,520,380,L('対応しない',880,135,{size:28,color:NG,weight:700})+L('・負の電荷は 上りへ 押される',880,205,{size:26})+L('・電位は 高さでなく',880,265,{size:26})+L('1 C あたりの エネルギー',880,310,{size:26}),seg(p,.4,.55),NG);
  return s;
 },
 [K+'table']:(p)=>{
  const rows=[['力',`${cs(FC,'F')}`,`${q}${vE}`],['位置エネルギー',`${Wt('U')}`,`${q}${Vt('V')}`],['一歩の 変化',`d${Wt('U')}=-${cs(FC,'F')}\\,dx`,`d${Vt('V')}=-${cs(EC,'E')}\\,dx`]];
  let body=label('力学',560,140,{size:26,color:C.dim,anchor:'middle'})+label('電気',900,140,{size:26,color:C.dim,anchor:'middle'})+line(120,160,1080,160,{color:C.faint,w:2});
  rows.forEach(([n,a,b],i)=>{const y=225+i*80,g=i<2?seg(p,.1+i*.3,.25+i*.3):0;body+=fade(g,label(n,150,y+8,{size:26,color:C.ink})+T(a,560,y,{size:40})+T(b,900,y,{size:40}));});
  return card(100,80,1000,360,body,1,C.faint);
 },
 [K+'table2']:(p)=>{
  const rows=[['力',`${cs(FC,'F')}`,`${q}${vE}`],['位置エネルギー',`${Wt('U')}`,`${q}${Vt('V')}`],['一歩の 変化',`d${Wt('U')}=-${cs(FC,'F')}\\,dx`,`d${Vt('V')}=-${cs(EC,'E')}\\,dx`]];
  let body=label('力学',560,140,{size:26,color:C.dim,anchor:'middle'})+label('電気',900,140,{size:26,color:C.dim,anchor:'middle'})+line(120,160,1080,160,{color:C.faint,w:2});
  rows.forEach(([n,a,b],i)=>{const y=225+i*80,g=i<2?1:seg(p,.05,.25);body+=fade(g,label(n,150,y+8,{size:26,color:C.ink})+T(a,560,y,{size:40})+T(b,900,y,{size:40}));});
  body+=fade(seg(p,.35,.5),label('q で 割る',900,470,{size:24,color:QP,anchor:'middle',weight:700}));
  return card(100,80,1000,410,body,1,C.faint)+fade(seg(p,.3,.45),highlight(770,355,260,70,1,C.hi));
 },
 // ===== S5 まとめ =====
 [K+'sum1']:(p)=>{
  let s=T(`${dU}=-${WAB}`,300,90,{size:46})+fade(seg(p,.2,.35),T(`${dV}=\\dfrac{${dU}}{${q}}`,850,100,{size:46}));
  s+=fade(seg(p,.5,.7),T(`${VB}-${VA}=-${INT}`,600,300,{size:70}));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=T(`${VB}-${VA}=-${INT}`,600,110,{size:56});
  s+=card(80,230,500,200,L('位置 だけで 決まる',330,290,{size:28,color:VC,weight:700})+L('← 静電場で 道に よらない',330,350,{size:26}),seg(p,.05,.2),C.faint);
  s+=card(620,230,500,200,L('単位 V',870,290,{size:30,color:VC,weight:700})+L('電場は V/m とも',870,350,{size:28,color:EC,weight:700}),seg(p,.45,.6),C.faint);
  return s;
 },
 [K+'next1']:(p)=>{
  let s=vmap({})+AB({bdx:16,bdy:34});
  s+=card(680,120,470,250,L('電場 → 電位（今回）',915,185,{size:28})+fade(seg(p,.4,.55),L('電位の 地図 → 電場？',915,270,{size:34,color:C.hi,weight:700})),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'next']:(p)=>{
  let s=card(80,110,500,300,L('点電荷の 電位は',330,210,{size:30})+L('どんな 形？',330,280,{size:36,color:C.hi,weight:700}),seg(p,.02,.15),C.hi);
  s+=card(620,110,500,300,L('この 作り方が',870,210,{size:30})+L('使えない のは？',870,280,{size:36,color:C.hi,weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
};

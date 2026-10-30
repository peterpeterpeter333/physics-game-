// 高校編「電流とオームの法則・深く学ぶ 3/4」(ys-hs-e-current-3) — 図。Stage 1200×515.
// 色：電圧 V 紫、電流 I 緑、抵抗 R 白、電子 青、原子 赤、エネルギー 橙。V–I グラフは横軸 電圧、縦軸 電流。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,poly,axes,brace,clamp,mix} from './anim.mjs';
import {card,tag,T2,sceneT,IC,VC,QC,TC,WC,NEG,POS,EC,CU,It,Qt,Vt,Rt,Wt,U,electron,edot,plus,tube,battery,bulb,resistor,circuit,CIR,fcard} from './yt1-hs-e-current-1-diagrams.mjs';

const K='hs-e-current-3:';
const DATA=[[1.5,.5],[3,1],[4.5,1.5]];
const f1=v=>v.toFixed(1),f2=v=>v.toFixed(2),fI=v=>v<1?v.toFixed(2):v.toFixed(1);
// ---- measuring circuit: resistor on top, ammeter on the right, voltmeter across the resistor ----
const MC={L:90,R:560,T:190,B:430,bx:320,rx:325};
function meter(x,y,ch,col,val,{g=1}={}){return fade(g,ring(x,y,30,{color:col,w:3,fill:'#14203a'})+label(ch,x,y+10,{size:28,color:col,anchor:'middle',weight:700})+(val?label(val,x,y+(ch==='V'?-44:62),{size:28,color:col,anchor:'middle',weight:700}):''));}
function meterCircuit({V=null,I=null,g=1,cur=0}={}){
 const {L,R,T,B,bx,rx}=MC;let s='';
 s+=line(L,T,rx-80,T,{color:C.dim,w:4})+line(rx+80,T,R,T,{color:C.dim,w:4})+resistor(rx-80,rx+80,T)+label('金属線',rx,T+52,{size:24,color:C.ink,anchor:'middle',weight:700});
 s+=line(R,T,R,(T+B)/2-30,{color:C.dim,w:4})+line(R,(T+B)/2+30,R,B,{color:C.dim,w:4})+meter(R,(T+B)/2,'A',IC,'')+(I!==null?label(`${fI(I)} A`,R-44,(T+B)/2+10,{size:28,color:IC,anchor:'end',weight:700}):'');
 s+=line(L,T,L,B,{color:C.dim,w:4})+line(R,B,bx+11,B,{color:C.dim,w:4})+line(L,B,bx-11,B,{color:C.dim,w:4})+battery(bx,B,{text:'電池'});
 // voltmeter above
 const vy=T-95;s+=draw([[rx-110,T],[rx-110,vy],[rx-30,vy]],1,{color:VC,w:3})+draw([[rx+110,T],[rx+110,vy],[rx+30,vy]],1,{color:VC,w:3})+dot(rx-110,T,6,VC)+dot(rx+110,T,6,VC)+meter(rx,vy,'V',VC,'');
 if(V!==null)s+=label(`${f1(V)} V`,rx+150,vy+10,{size:28,color:VC,weight:700});
 if(cur)s+=fade(cur,arrow(R+0,B-20,R,(T+B)/2+44,{color:IC,w:5,head:16}));
 return fade(g,s);
}
// ---- the table -----------------------------------------------------------------------------------
function table(n,{g=1,ratio=0,x=680,y=70,hl=-1}={}){
 const w=ratio?500:340,rh=72;let s=rect(x,y,w,rh*(DATA.length+1)+10,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:14});
 s+=label('電圧',x+85,y+48,{size:28,color:VC,anchor:'middle',weight:700})+label('電流',x+255,y+48,{size:28,color:IC,anchor:'middle',weight:700});
 if(ratio)s+=fade(ratio,label('電圧 ÷ 電流',x+420,y+48,{size:26,color:C.hi,anchor:'middle',weight:700}));
 for(let i=0;i<DATA.length;i++){const yy=y+rh*(i+1)+48,[V,I]=DATA[i];const a=clamp(n-i);if(a<=0)continue;
  s+=fade(a,label(`${f1(V)} V`,x+85,yy,{size:30,color:i===hl?C.hi:C.ink,anchor:'middle',weight:700})+label(`${fI(I)} A`,x+255,yy,{size:30,color:i===hl?C.hi:C.ink,anchor:'middle',weight:700}));
  if(ratio)s+=fade(Math.min(a,clamp(ratio*3-i)),label('3.0',x+420,yy,{size:30,color:C.hi,anchor:'middle',weight:700}));}
 return fade(g,s);
}
// ---- V–I graph -----------------------------------------------------------------------------------
const VIA=()=>axes({x:130,y:430,w:560,h:340,xmax:6.6,ymax:2.3,xticks:[1.5,3,4.5,6],yticks:[.5,1,1.5,2],grid:true,xlabel:'V [V]',ylabel:'I [A]',xcolor:VC,ycolor:IC});
export function viGraph({pts=3,ln=0,g=1,six=0,slopeMark=0}={}){
 const A=VIA();let s=A.svg;
 if(ln)s+=A.plot(v=>v/3,{from:0,to:6.4,p:ln,color:IC,w:4});
 if(six)s+=A.plot(v=>v/6,{from:0,to:6.4,p:six,color:'#9aabc7',w:4,dash:'10 8'});
 for(let i=0;i<DATA.length;i++){const a=clamp(pts-i);if(a>0)s+=fade(a,dot(A.X(DATA[i][0]),A.Y(DATA[i][1]),10,C.hi));}
 if(slopeMark)s+=fade(slopeMark,line(A.X(3),A.Y(1),A.X(4.5),A.Y(1),{color:VC,w:3,dash:'6 5'})+line(A.X(4.5),A.Y(1),A.X(4.5),A.Y(1.5),{color:IC,w:3,dash:'6 5'}));
 return {A,svg:fade(g,s)};
}
// ---- bulb V–I curve (schematic): I = 0.40 (V/100)^0.55 ---------------------------------------
const bulbI=v=>.4*Math.pow(Math.max(0,v)/100,.55);
// ---- lattice with vibrating atoms and electrons bouncing through ----------------------------------
function rnd(seed){let s=seed*9301+49297;return()=>{s=(s*9301+49297)%233280;return s/233280;};}
export function lattice(t,{x=100,y=70,w=640,h=360,nx=8,ny=4,amp=4,ne=14,g=1,drift=50,hit=0}={}){
 let s=rect(x,y,w,h,{fill:CU,fo:.08,stroke:C.faint,sw:2,rx:12});
 for(let i=0;i<nx;i++)for(let j=0;j<ny;j++){const cx=x+w*(i+.5)/nx+amp*Math.sin(t*9+i*1.3+j*2.1),cy=y+h*(j+.5)/ny+amp*Math.cos(t*8+i*.7+j*1.9);s+=plus(cx,cy,{r:15});}
 const R=rnd(7);
 for(let k=0;k<ne;k++){const u=R(),v=R(),ph=R()*6.28;
  // zig-zag path: drifts leftward (electrons move opposite to the current) with bounces
  const L=w-40,pos=((u*L-drift*t)%L+L)%L;
  const ex=x+20+pos,ey=y+20+(h-40)*(.5+.45*Math.sin(t*2.2+ph+pos*.03));
  s+=edot(ex,ey,8);}
 return fade(g,s);
}

export const hsECurrent3Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p)=>{
  let s=circuit({elem:'res',cur:1});
  s+=card(850,130,310,250,label('電圧を',1005,195,{size:30,color:C.ink,anchor:'middle'})+label('2 倍',1005,250,{size:40,color:VC,anchor:'middle',weight:700})+label('→ 電流は？',1005,320,{size:34,color:IC,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'recap']:(p)=>{
  let s=fcard(330,70,540,170,`${Vt}=\\dfrac{${Wt}}{${Qt}}`,{size:58,col:VC});
  s+=fade(seg(p,.4,.55),label('差が 大きい ほど 強く 押す？',600,330,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'guess']:(p)=>{
  let s='';const opts=[['2 倍',IC],['4 倍',C.ink],['変わらない',C.ink]];
  opts.forEach(([t,c],i)=>{s+=card(140+i*330,170,260,130,label(t,270+i*330,250,{size:38,color:C.ink,anchor:'middle',weight:700}),seg(p,.05+i*.12,.17+i*.12),C.faint);});
  s+=fade(seg(p,.05,.2),label('電圧 2 倍 → 電流は？',600,110,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'setup']:(p)=>{
  let s=meterCircuit({g:1});
  s+=fade(seg(p,.3,.45),label('電圧計（2点に 当てる）',700,90,{size:26,color:VC,weight:700}));
  s+=fade(seg(p,.55,.7),label('電流計（1列に 入れる）',620,330,{size:26,color:IC,weight:700}));
  return s;
 },
 // ================= S2 実験で比べる =================
 [K+'t1']:(p)=>meterCircuit({V:1.5,I:seg(p,.3,.4)>0?.5:null})+table(seg(p,.4,.6)),
 [K+'t2']:(p)=>{
  let s=meterCircuit({V:3,I:1})+table(1+seg(p,.05,.25),{hl:1});
  s+=fade(seg(p,.5,.65),label('2倍 → 2倍',850,425,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'t3']:(p)=>{
  let s=meterCircuit({V:4.5,I:1.5})+table(2+seg(p,.05,.25),{hl:2});
  s+=fade(seg(p,.5,.65),label('3倍 → 3倍',850,425,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ratio']:(p)=>table(3,{ratio:seg(p,.15,.85),x:350,y:80}),
 [K+'ratio2']:(p)=>{
  let s=table(3,{ratio:1,x:350,y:80});
  s+=highlight(700,140,140,230,seg(p,.1,.25));
  s+=fade(seg(p,.35,.5),label('比が 一定',880,265,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'graph']:(p)=>{
  const {svg}=viGraph({pts:3*seg(p,.2,.8)});
  return svg+table(3,{x:800,y:80});
 },
 [K+'line']:(p)=>{
  const {A,svg}=viGraph({pts:3,ln:seg(p,.05,.4)});
  let s=svg+table(3,{x:800,y:80});
  s+=fade(seg(p,.5,.65),label('原点を 通る 直線',A.X(3.5),A.Y(2.05),{size:28,color:IC,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S3 抵抗 R の定義 =================
 [K+'def']:(p)=>{
  let s=fcard(330,60,540,190,`${Rt}=\\dfrac{${Vt}}{${It}}`,{size:66,col:C.ink,g:seg(p,.3,.45)});
  s+=fade(seg(p,.05,.2),label('電圧と 電流の 比',600,40,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.45),label('抵抗',230,170,{size:36,color:C.ink,anchor:'middle',weight:700}));
  s+=tag('定義',600,320,{color:C.hi,g:seg(p,.7,.85),size:28});
  return s;
 },
 [K+'unit']:(p)=>{
  let s=fcard(330,60,540,150,`${Rt}=\\dfrac{${Vt}}{${It}}`,{size:50,col:C.ink});
  s+=fcard(300,260,600,140,`1\\ \\Omega=1\\ \\mathrm{V/A}`,{size:56,col:C.ink,g:seg(p,.05,.2)});
  s+=fade(seg(p,.45,.6),label('オーム',600,450,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'r3']:(p)=>{
  let s=table(3,{ratio:1,x:60,y:80});
  s+=card(620,150,520,170,T2(`${Rt}=\\dfrac{3.0\\ \\mathrm{V}}{1.0\\ \\mathrm{A}}=3.0\\ \\Omega`,880,248,{size:46,auto:false}),seg(p,.1,.25),C.ink);
  return s;
 },
 [K+'meaning']:(p)=>{
  let s=card(100,90,460,320,label('R が 小さい',330,150,{size:30,color:C.ink,anchor:'middle',weight:700})+resistor(230,430,240,{n:3,amp:14})+arrow(220,320,440,320,{color:IC,w:12,head:28})+label('大きな 電流',330,380,{size:26,color:IC,anchor:'middle',weight:700}),seg(p,.05,.2),C.faint);
  s+=card(640,90,460,320,label('R が 大きい',870,150,{size:30,color:C.ink,anchor:'middle',weight:700})+resistor(770,970,240,{n:9,amp:22})+arrow(790,320,950,320,{color:IC,w:5,head:16})+label('小さな 電流',870,380,{size:26,color:IC,anchor:'middle',weight:700}),seg(p,.3,.45),C.faint);
  s+=fade(seg(p,.05,.2),label('同じ 電圧',600,470,{size:28,color:VC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'slope']:(p)=>{
  const {A,svg}=viGraph({pts:3,ln:1,slopeMark:seg(p,.1,.3)});
  let s=svg+fade(seg(p,.1,.3),label('ΔV',A.X(3.75),A.Y(1)+30,{size:24,color:VC,anchor:'middle',weight:700})+label('ΔI',A.X(4.5)+12,A.Y(1.25)+8,{size:24,color:IC,weight:700}));
  s+=card(780,90,380,170,label('傾き',830,200,{size:30,color:C.ink,weight:700})+T2(`=\\dfrac{${It}}{${Vt}}=\\dfrac{1}{${Rt}}`,1010,190,{size:44,auto:false}),seg(p,.3,.45),IC);
  s+=fade(seg(p,.6,.75),label('急な ほど 流れやすい',970,320,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'compare']:(p)=>{
  const {A,svg}=viGraph({pts:3,ln:1,six:seg(p,.1,.4)});
  let s=svg+fade(seg(p,.4,.55),dot(A.X(3),A.Y(.5),10,'#9aabc7'));
  s+=label('3.0 Ω',A.X(6.2),A.Y(2.07)-14,{size:26,color:IC,anchor:'end',weight:700});
  s+=fade(seg(p,.3,.45),label('6.0 Ω',A.X(6.4),A.Y(1.07)-14,{size:26,color:'#9aabc7',anchor:'end',weight:700}));
  s+=card(780,140,380,170,label('6.0 Ω に 3.0 V',970,200,{size:28,color:C.ink,anchor:'middle',weight:700})+label('→ 0.50 A',970,262,{size:34,color:IC,anchor:'middle',weight:700}),seg(p,.45,.6),C.faint);
  s+=fade(seg(p,.7,.85),label('傾きは 半分',970,370,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S4 オームの法則とその条件 =================
 [K+'law']:(p)=>{
  const {svg}=viGraph({pts:3,ln:1});
  let s=fade(.5,svg);
  s+=card(720,110,440,230,label('温度 一定の 金属など',940,170,{size:28,color:C.ink,anchor:'middle',weight:700})+label('V と I が 比例',940,230,{size:30,color:C.hi,anchor:'middle',weight:700})+label('R が 一定',940,290,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=tag('オームの法則（実験の 法則）',940,400,{color:C.hi,g:seg(p,.6,.75),size:24});
  return s;
 },
 [K+'vri']:(p)=>{
  let s=fade(.55,T2(`${Rt}=\\dfrac{${Vt}}{${It}}`,600,80,{size:40}));
  s+=fade(seg(p,.1,.25),label('両辺に I を 掛ける',600,170,{size:28,color:C.hi,anchor:'middle',weight:700})+arrow(600,185,600,230,{color:C.hi,w:4,head:14}));
  s+=fcard(350,250,500,160,`${Vt}=${Rt}${It}`,{size:72,col:C.hi,g:seg(p,.4,.55)});
  return s;
 },
 [K+'vri2']:(p)=>{
  const it=(src,x,g)=>card(x,150,320,170,T2(src,x+160,250,{size:50}),g,C.faint);
  let s=it(`${Vt}=${Rt}${It}`,60,seg(p,.05,.2))+it(`${It}=\\dfrac{${Vt}}{${Rt}}`,440,seg(p,.2,.35))+it(`${Rt}=\\dfrac{${Vt}}{${It}}`,820,seg(p,.35,.5));
  s+=fade(seg(p,.6,.75),label('同じ 関係の 書き直し',600,400,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'two']:(p)=>{
  let s=card(80,90,500,300,T2(`${Rt}=\\dfrac{${Vt}}{${It}}`,330,200,{size:56})+tag('定義',330,300,{color:C.hi,size:28})+label('どんな 物にも 書ける',330,360,{size:26,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'two2']:(p)=>{
  let s=card(80,90,500,300,T2(`${Rt}=\\dfrac{${Vt}}{${It}}`,330,200,{size:56})+tag('定義',330,300,{color:C.hi,size:28})+label('どんな 物にも 書ける',330,360,{size:26,color:C.ink,anchor:'middle',weight:700}),1,C.hi);
  s+=card(620,90,500,300,label('R が 一定',870,195,{size:40,color:C.ink,anchor:'middle',weight:700})+tag('法則（実験）',870,300,{color:C.F,size:28})+label('成り立つ 物と 条件が 限られる',870,360,{size:24,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.F);
  return s;
 },
 [K+'bulb']:(p)=>{
  let s=bulb(330,240,{on:seg(p,.1,.3),r:80});
  s+=fade(seg(p,.1,.25),label('フィラメント',330,380,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=card(620,140,480,190,label('熱くなると',860,205,{size:30,color:C.ink,anchor:'middle'})+label('R が 大きくなる',860,270,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.35,.5),C.hi);
  s+=tag('反例',860,90,{color:C.a,g:seg(p,.05,.2),size:26});
  return s;
 },
 [K+'bulb2']:(p)=>{
  let s=bulb(200,240,{on:1,r:70})+label('点灯中',200,360,{size:26,color:C.ink,anchor:'middle',weight:700});
  s+=card(380,80,760,120,label('100 V で 0.40 A',760,155,{size:36,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.faint);
  s+=card(380,250,760,160,T2(`${Rt}=\\dfrac{100\\ \\mathrm{V}}{0.40\\ \\mathrm{A}}=250\\ \\Omega`,760,342,{size:48,auto:false}),seg(p,.5,.65),C.ink);
  return s;
 },
 [K+'bulb3']:(p)=>{
  let s=bulb(250,200,{on:1,r:60})+label('熱い：250 Ω',250,320,{size:28,color:C.hi,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.2),bulb(700,200,{on:0,r:60})+label('冷たい：ずっと 小さい',700,320,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('電圧に よって 比 V/I が 変わる',600,440,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'bulbgraph']:(p)=>{
  const A=axes({x:130,y:430,w:560,h:340,xmax:110,ymax:.6,xticks:[50,100],yticks:[.2,.4],grid:true,xlabel:'V [V]',ylabel:'I [A]',xcolor:VC,ycolor:IC});
  let s=A.svg+A.plot(bulbI,{from:0,to:105,p:seg(p,.05,.5),color:C.hi,w:5});
  s+=fade(seg(p,.4,.55),dot(A.X(100),A.Y(.4),9,C.hi)+label('100 V・0.40 A',A.X(100),A.Y(.4)-24,{size:24,color:C.hi,anchor:'end',weight:700}));
  s+=card(780,140,380,200,label('電球',970,200,{size:30,color:C.hi,anchor:'middle',weight:700})+label('直線に ならない',970,260,{size:30,color:C.ink,anchor:'middle',weight:700})+label('（寝ていく 曲線）',970,310,{size:26,color:C.dim,anchor:'middle'}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'cond']:(p)=>{
  let s=card(200,90,800,170,label('オームの法則',600,150,{size:32,color:C.ink,anchor:'middle',weight:700})+T2(`${Vt}=${Rt}${It}`,600,220,{size:48}),1,C.hi);
  s+=card(300,300,600,110,label('条件：温度が 一定',600,368,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'semi']:(p)=>{
  let s=card(200,90,800,170,label('オームの法則',600,150,{size:32,color:C.ink,anchor:'middle',weight:700})+T2(`${Vt}=${Rt}${It}`,600,220,{size:48}),1,C.hi);
  s+=card(300,300,600,110,label('ダイオード など：R 一定 ではない',600,368,{size:30,color:C.a,anchor:'middle',weight:700}),seg(p,.1,.25),C.a);
  return s;
 },
 [K+'mis']:(p)=>{
  let s=card(150,100,900,180,label('✕ 電圧を 上げると',600,170,{size:34,color:C.a,anchor:'middle',weight:700})+label('R も 大きくなる？',600,235,{size:34,color:C.a,anchor:'middle',weight:700}),seg(p,.3,.45),C.a);
  s+=fade(seg(p,.05,.2),T2(`${Rt}=\\dfrac{${Vt}}{${It}}`,600,400,{size:46}));
  return s;
 },
 [K+'mis2']:(p)=>{
  let s=table(3,{ratio:1,x:60,y:80});
  s+=card(620,120,520,230,label('V が 2倍 → I も 2倍',880,190,{size:30,color:C.ink,anchor:'middle',weight:700})+label('比は 変わらない',880,250,{size:32,color:C.hi,anchor:'middle',weight:700})+label('R は 物の 性質',880,310,{size:30,color:C.F,anchor:'middle',weight:700}),seg(p,.05,.2),C.F);
  return s;
 },
 // ================= S5 使ってみる・抵抗の正体 =================
 [K+'use']:(p)=>{
  let s=circuit({elem:'res',cur:0,batt:''});
  s+=label('2.0 Ω',CIR.ex,CIR.T-40,{size:30,color:C.ink,anchor:'middle',weight:700})+label('6.0 V',CIR.bx,CIR.B+70,{size:30,color:VC,anchor:'middle',weight:700});
  s+=card(850,150,310,170,label('電流は？',1005,245,{size:40,color:IC,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'use2']:(p)=>{
  let s=circuit({elem:'res',cur:seg(p,.5,.65),batt:''});
  s+=label('2.0 Ω',CIR.ex,CIR.T-40,{size:30,color:C.ink,anchor:'middle',weight:700})+label('6.0 V',CIR.bx,CIR.B+70,{size:30,color:VC,anchor:'middle',weight:700});
  s+=card(820,60,360,400,T2(`${It}=\\dfrac{${Vt}}{${Rt}}`,1000,150,{size:46})+fade(seg(p,.25,.4),T2(`=\\dfrac{6.0}{2.0}`,1000,280,{size:40,auto:false}))+fade(seg(p,.45,.6),T2(`=3.0\\ \\mathrm{A}`,1000,400,{size:40,auto:false,color:IC})),seg(p,.05,.2),IC);
  return s;
 },
 [K+'use3']:(p)=>{
  let s=resistor(250,550,230,{n:6})+line(150,230,250,230,{color:C.dim,w:4})+line(550,230,650,230,{color:C.dim,w:4})+label('10 Ω',400,180,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=arrow(300,300,500,300,{color:IC,w:6,head:18})+label('0.50 A',400,345,{size:28,color:IC,anchor:'middle',weight:700});
  s+=fade(seg(p,.4,.55),line(250,400,550,400,{color:VC,w:3})+line(250,385,250,415,{color:VC,w:3})+line(550,385,550,415,{color:VC,w:3})+label('両端の 電圧 ？',400,450,{size:26,color:VC,anchor:'middle',weight:700}));
  s+=card(720,140,440,200,T2(`${Vt}=${Rt}${It}=10\\times0.50`,940,215,{size:38,auto:false})+fade(seg(p,.6,.75),T2(`=5.0\\ \\mathrm{V}`,940,290,{size:42,auto:false,color:VC})),seg(p,.4,.55),VC);
  return s;
 },
 [K+'micro']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=tube(70,1130,220,{fill:CU})+fade(seg(p,.1,.3),ring(600,220,120,{color:C.hi,w:4,fill:'#0f1a30'})+label('？',600,244,{size:64,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.05,.2),label('なぜ 流れにくい？',600,420,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'collide']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=lattice(t,{amp:4});
  s+=fade(seg(p,.05,.2),label('振動する 原子',960,150,{size:28,color:POS,anchor:'middle',weight:700})+label('電子が ぶつかる',960,220,{size:28,color:NEG,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.25),arrow(1060,330,860,330,{color:NEG,w:5,head:16})+label('電子の 進む 向き',960,380,{size:24,color:NEG,anchor:'middle'}));
  return s;
 },
 [K+'collide2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=lattice(t,{amp:4});
  s+=card(800,120,360,240,label('ぶつかって',980,185,{size:28,color:C.ink,anchor:'middle'})+label('勢いを 失う',980,235,{size:30,color:C.ink,anchor:'middle',weight:700})+label('→ ゆっくり 一定の',980,295,{size:26,color:NEG,anchor:'middle',weight:700})+label('速さで 進む',980,335,{size:26,color:NEG,anchor:'middle',weight:700}),seg(p,.1,.25),NEG);
  return s;
 },
 [K+'collide3']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=lattice(t,{amp:4});
  s+=card(800,120,360,240,label('ぶつかりやすい',980,190,{size:28,color:C.ink,anchor:'middle',weight:700})+label('→ 電流が 小さい',980,250,{size:28,color:IC,anchor:'middle',weight:700})+label('→ R が 大きい',980,310,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.1,.25),C.faint);
  return s;
 },
 [K+'temp']:(p,ctx)=>{
  const t=sceneT(p,ctx),hot=seg(p,.1,.35);
  let s=lattice(t,{amp:mix(4,11,hot)});
  s+=card(800,120,360,240,label('温度が 上がる',980,185,{size:30,color:'#ff9a7a',anchor:'middle',weight:700})+label('→ 振動が 激しい',980,245,{size:28,color:POS,anchor:'middle',weight:700})+label('→ R が 大きい',980,305,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.2,.35),'#ff9a7a');
  s+=fade(seg(p,.6,.75),label('（電球の R が 大きくなる 理由）',980,410,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p)=>{
  const {svg}=viGraph({pts:3,ln:1});
  let s=svg+card(780,120,380,200,label('電圧 2倍',970,190,{size:32,color:VC,anchor:'middle',weight:700})+label('→ 電流も 2倍',970,260,{size:32,color:IC,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  s+=fade(seg(p,.05,.2),label('（オームの法則が 成り立つ 物）',970,370,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'ans2']:(p)=>{
  let s=card(80,90,500,300,T2(`${Rt}=\\dfrac{${Vt}}{${It}}`,330,210,{size:56})+tag('定義',330,320,{color:C.hi,size:28}),1,C.hi);
  s+=card(620,90,500,300,label('R が 一定',870,205,{size:40,color:C.ink,anchor:'middle',weight:700})+tag('実験で 確かめる',870,320,{color:C.F,size:28}),seg(p,.35,.5),C.F);
  return s;
 },
 [K+'next']:(p)=>{
  const R2=(x,y)=>resistor(x-60,x+60,y,{n:4,amp:14});
  let s=card(80,90,480,300,label('1列に つなぐ',320,150,{size:30,color:C.ink,anchor:'middle',weight:700})+line(110,260,150,260,{color:C.dim,w:4})+R2(210,260)+line(270,260,370,260,{color:C.dim,w:4})+R2(430,260)+line(490,260,530,260,{color:C.dim,w:4})+label('？',320,350,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.faint);
  s+=card(640,90,480,300,label('枝分かれ させる',880,150,{size:30,color:C.ink,anchor:'middle',weight:700})+line(680,250,760,250,{color:C.dim,w:4})+line(760,210,760,290,{color:C.dim,w:4})+line(760,210,820,210,{color:C.dim,w:4})+R2(880,210)+line(940,210,1000,210,{color:C.dim,w:4})+line(760,290,820,290,{color:C.dim,w:4})+R2(880,290)+line(940,290,1000,290,{color:C.dim,w:4})+line(1000,210,1000,290,{color:C.dim,w:4})+line(1000,250,1080,250,{color:C.dim,w:4})+label('？',880,355,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.faint);
  s+=fade(seg(p,.05,.2),label('全体の 通りにくさは？',600,460,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'bye']:(p)=>card(300,170,600,140,label('深く学ぶ 4/4 へ',600,255,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi),
};
function highlight(x,y,w,h,g){return fade(g,rect(x,y,w,h,{fill:C.hi,fo:.08,stroke:C.hi,sw:3,rx:10}));}

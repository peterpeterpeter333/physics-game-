// YouTube シリーズ 仕事・上級 3/3（ステージ uc-work 本10〜本13）— 図。Stage 1200×515.
// 色：力 F 緑、速度 v 紫、位置・移動 水色、仕事・仕事率 橙、強調 黄、負 赤、磁場 B 橙（⊗ 奥向き）、電荷 q 桃。
// 補助線①：𝐅 と 𝐯 の角度ダイヤル（P＝Fv cosθ、100 N・2 m/s）。②坂の車（角は見やすく大きく描く。計算は sinθ＝0.05）。③往復の表。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,arrow,brace,highlight,axes,tex,texWidth,poly,draw,ground,cart} from './anim.mjs';

const K='uc-work-3:';
const CE=C.E,CH=C.hi,CX=C.x,CV=C.v,CF=C.F,CT=C.t,CA=C.a,CQ=C.p;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const cE=s=>cs(CE,s),cH=s=>cs(CH,s),cA=s=>cs(CA,s);
const T=(s,x,y,size=44,o={})=>tex(s,x,y,{size,...o});
const TF=(s,x,y,maxW,size=44,o={})=>{const w=texWidth(s,size);return T(s,x,y,w>maxW?size*maxW/w:size,o);};
const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:36,color:C.F,weight:700}));
const bv='\\mathbf{v}',bF='\\mathbf{F}',br='\\mathbf{r}';
const Kv=cE('K'),Wv=cE('W'),Pv=cE('P');

// ---- 台車 ----
function cartScene({F=1,v=1,dir=1,fl='100 N',vl='2 m/s',g=1}={}){
 let s=fade(g,ground(60,600,400)+cart(330,400,{w:150,h:70,color:CX}));
 s+=fade(v*g,arrow(280,290,420,290,{color:CV,w:6,head:18})+label(`𝐯 ${vl}`,430,300,{size:26,color:CV,weight:700}));
 if(dir>0)s+=fade(F*g,arrow(120,350,245,350,{color:CF,w:6,head:18})+label(`𝐅 ${fl}`,110,330,{size:26,color:CF,weight:700}));
 else s+=fade(F*g,arrow(250,375,125,375,{color:CA,w:6,head:18})+label(`摩擦 ${fl}`,110,355,{size:26,color:CA,weight:700}));
 return s;
}
// ---- 角度ダイヤル ----
function dial(th,{g=1,gauge=1}={}){
 const cx=250,cy=290,Lv=200,Lf=150,r=th*Math.PI/180;
 let s=fade(g,arrow(cx,cy,cx+Lv,cy,{color:CV,w:6,head:18})+label('𝐯',cx+Lv+10,cy+10,{size:30,color:CV,weight:700}));
 s+=fade(g,arrow(cx,cy,cx+Lf*Math.cos(r),cy-Lf*Math.sin(r),{color:CF,w:6,head:18})+label('𝐅',cx+(Lf+22)*Math.cos(r),cy-(Lf+22)*Math.sin(r)+8-(th<20?26:0),{size:30,color:CF,weight:700,anchor:'middle'}));
 if(th>2){const arc=Array.from({length:21},(_,i)=>{const u=r*i/20;return [cx+50*Math.cos(u),cy-50*Math.sin(u)];});s+=fade(g,draw(arc,1,{color:C.ink,w:2})+label('θ',cx+72*Math.cos(r/2),cy-72*Math.sin(r/2)+8,{size:26,color:C.ink,anchor:'middle'}));}
 const c=Math.cos(r),Fv=100*c;
 if(Math.abs(c)>.02)s+=fade(g,line(cx,cy+22,cx+Lf*c,cy+22,{color:c>0?CH:CA,w:8}))+fade(g,line(cx+Lf*c,cy-Lf*Math.sin(r),cx+Lf*c,cy+22,{color:C.dim,w:2,dash:'5 5'}));
 const P=200*c,bx=560,by=470,bw=40,sc=1.6;
 if(gauge)s+=fade(g,line(bx-30,by-160,bx+70,by-160,{color:C.dim,w:2})+label('0',bx-40,by-153,{size:22,color:C.dim,anchor:'end'})
  +rect(bx,P>=0?by-160-P*.6:by-160,bw,Math.abs(P)*.6,{fill:P>=0?CE:CA,fo:.6,stroke:P>=0?CE:CA})
  +label(`${Math.round(P)} W`.replace('-','−'),bx+bw/2,P>=0?by-170-P*.6:by-160-P*.6+30,{size:24,color:P>=0?CE:CA,anchor:'middle',weight:700}));
 return s;
}
// ---- 円運動 ----
function circleScene({g=1,ang=.9,force=1,right=1,m='0.5 kg',showSpeed=1,B=0,charge=0}={}){
 const cx=300,cy=270,R=150;
 let s='';
 if(B){for(let i=0;i<5;i++)for(let j=0;j<4;j++){const x=110+i*95,y=120+j*105;s+=fade(B*g,ring(x,y,13,{color:CE,w:2.5})+line(x-8,y-8,x+8,y+8,{color:CE,w:2.5})+line(x-8,y+8,x+8,y-8,{color:CE,w:2.5}));}
  s+=fade(B*g,label('𝐁（奥向き ⊗）',97,72,{size:24,color:CE,weight:700}));}
 s+=fade(g,ring(cx,cy,R,{color:C.dim,w:3,dash:'8 8'})+dot(cx,cy,5,C.dim));
 const P=[cx+R*Math.cos(ang),cy-R*Math.sin(ang)],t=[-Math.sin(ang),-Math.cos(ang)],n=[-Math.cos(ang),Math.sin(ang)];
 s+=fade(g,arrow(P[0],P[1],P[0]+t[0]*130,P[1]+t[1]*130,{color:CV,w:6,head:18})+label('𝐯',P[0]+t[0]*130-26,P[1]+t[1]*130,{size:30,color:CV,weight:700}));
 s+=fade(force*g,arrow(P[0],P[1],P[0]+n[0]*110,P[1]+n[1]*110,{color:CF,w:6,head:18})+label('𝐅',P[0]+n[0]*110-4,P[1]+n[1]*110+34,{size:30,color:CF,weight:700}));
 if(right){const a=[P[0]+t[0]*22,P[1]+t[1]*22],b=[a[0]+n[0]*22,a[1]+n[1]*22],c=[P[0]+n[0]*22,P[1]+n[1]*22];s+=fade(right*g,draw([a,b,c],1,{color:CH,w:3}));}
 s+=fade(g,dot(P[0],P[1],13,charge?CQ:C.ink));
 if(charge)s+=fade(g,label('q',P[0]+18,P[1]+24,{size:26,color:CQ,weight:700}));
 if(showSpeed)s+=fade(g,label('半径 2 m',cx,cy+R+40,{size:22,color:C.dim,anchor:'middle'}));
 return s;
}
// ---- 坂の車（角は大きく描く） ----
const SL={x0:70,y0:440,x1:600,y1:240};
function slope({g=1,mg=0,split=0,car=1,v=1,pg=0}={}){
 const {x0,y0,x1,y1}=SL,dx=x1-x0,dy=y1-y0,Ls=Math.hypot(dx,dy),u=[dx/Ls,dy/Ls],nn=[u[1],-u[0]];
 let s=fade(g,poly([[x0,y0],[x1,y0],[x1,y1]],{fill:C.dim,fo:.12,stroke:C.dim,sw:2})+label('θ',x0+80,y0-12,{size:26,color:C.ink}));
 const c=[x0+dx*.55,y0+dy*.55],h=50,w=90;
 const corner=(a,b)=>[c[0]+u[0]*a+nn[0]*b,c[1]+u[1]*a+nn[1]*b];
 if(car)s+=fade(g,poly([corner(-w/2,0),corner(w/2,0),corner(w/2,h),corner(-w/2,h)],{fill:CX,fo:.35,stroke:CX,sw:2}));
 const m=corner(0,h/2);
 if(v)s+=fade(v*g,arrow(m[0]+nn[0]*40,m[1]+nn[1]*40,m[0]+nn[0]*40+u[0]*140,m[1]+nn[1]*40+u[1]*140,{color:CV,w:5,head:16})+label('𝐯 20 m/s',m[0]+nn[0]*40+u[0]*150+8,m[1]+nn[1]*40+u[1]*150,{size:24,color:CV,weight:700}));
 if(mg){s+=fade(mg*g,arrow(m[0],m[1],m[0],m[1]+150,{color:CF,w:5,head:16})+label('m𝐠',m[0]+12,m[1]+160,{size:26,color:CF,weight:700}));}
 if(split){const G=150,sa=Math.abs(dy)/Ls,ca=dx/Ls;
  const along=[m[0]-u[0]*G*sa,m[1]-u[1]*G*sa],perp=[m[0]-nn[0]*G*ca,m[1]-nn[1]*G*ca];
  s+=fade(split*g,arrow(m[0],m[1],along[0],along[1],{color:CA,w:6,head:16})+label('坂に沿う 成分',along[0]-10,along[1]+40,{size:22,color:CA,weight:700,anchor:'end'}));
  s+=fade(split*g,arrow(m[0],m[1],perp[0],perp[1],{color:C.dim,w:4,head:14})+label('垂直な 成分',perp[0]+14,perp[1]+4,{size:22,color:C.dim}));}
 s+=fade(g,label('（角は 大きく 描いています）',x0,140,{size:22,color:C.dim}));
 return s;
}
// ---- 往復 ----
const TP={ox:90,oy:430,s:95};
const TX=x=>TP.ox+TP.s*x,TY=y=>TP.oy-TP.s*y;
function tripScene({g=1,up=0,down=0,fric=0,box=1,labs=1}={}){
 let s=fade(g,arrow(TX(-.2),TY(0),TX(4.7),TY(0),{color:C.dim,w:2.5,head:12})+arrow(TX(0),TY(-.2),TX(0),TY(3.6),{color:C.dim,w:2.5,head:12})
  +label('x（m）',TX(4.7),TY(0)+40,{size:22,color:C.dim,anchor:'end'})+label('y（m）',TX(0)+12,TY(3.6)+6,{size:22,color:C.dim}));
 [1,2,3,4].forEach(u=>{s+=fade(g,line(TX(u),TY(0)-5,TX(u),TY(0)+5,{color:C.dim})+label(String(u),TX(u),TY(0)+28,{size:21,color:C.dim,anchor:'middle'}));});
 [1,2,3].forEach(v=>{s+=fade(g,line(TX(0)-5,TY(v),TX(0)+5,TY(v),{color:C.dim})+label(String(v),TX(0)-12,TY(v)+7,{size:21,color:C.dim,anchor:'end'}));});
 s+=fade(g,line(TX(4),TY(0),TX(0),TY(3),{color:C.dim,w:4}));
 if(up)s+=fade(up,arrow(TX(3.6),TY(0.3)-30,TX(0.6),TY(2.55)-30,{color:CX,w:5,head:16})+fade(labs,label('上り Δ𝐫 ＝ (−4, 3)',TX(2.3),TY(2.7),{size:22,color:CX,weight:700})));
 if(down)s+=fade(down,arrow(TX(0.6),TY(2.55)+30,TX(3.6),TY(0.3)+30,{color:CT,w:5,head:16})+fade(labs,label('下り Δ𝐫 ＝ (4, −3)',TX(0.3),TY(0.4),{size:22,color:CT,weight:700})));
 if(box){const bx=TX(3.0),by=TY(0.8);s+=fade(g,poly([[bx-14,by-26],[bx+14,by-5],[bx-2,by+16],[bx-30,by-5]],{fill:CE,fo:.5,stroke:CE,sw:2})+arrow(bx-8,by-5,bx-8,by+38,{color:CF,w:4,head:12})+label('20 N',bx+4,by+36,{size:22,color:CF}));}
 return s;
}

export const ytUcWork3Diagrams={
 // ===== S1 前回の問いと仕事率 =====
 [K+'ask']:(p)=>card(200,80,800,350,L('前回の 最後の問い',600,135,{size:24,color:C.dim})
   +L('仕事率 は 力と 速度から どう 決まる？',600,220,{size:32,color:CE,weight:700})
   +fade(seg(p,.4,.6),L('力が 速度と 直角 なら？',600,310,{size:32,color:CH,weight:700}))
   +fade(seg(p,.4,.6),T(`${bF}\\perp${bv}`,600,385,44)),seg(p,0,.15),CH),
 [K+'recap']:(p)=>{
  const f=`\\dfrac{d${Kv}}{dt}=${bF}\\cdot${bv}`,w=texWidth(f,64),wr=texWidth(`${bF}\\cdot${bv}`,64),xr=300+w/2;
  let s=T(f,300,190,64)+fade(seg(p,.1,.25),arrow(xr+40,190,xr+170,190,{color:C.dim,w:4,head:14})+label('積分',xr+105,160,{size:24,color:C.dim,anchor:'middle'})+T(`\\Delta ${Kv}=${Wv}`,xr+320,190,56));
  s+=fade(seg(p,.5,.65),highlight(xr-wr-20,120,wr+40,120,1,CH)+L('今回は ここを 読む',xr-wr/2,320,{size:28,color:CH,weight:700}));
  return s;
 },
 [K+'def']:(p)=>{
  let s=L('1秒 あたりの 仕事 ＝ 仕事率',600,110,{size:32,color:CE,weight:700});
  s+=fade(seg(p,.4,.6),T(`${Pv}=\\dfrac{d${Wv}}{dt}`,600,280,76)+L('（定義）',800,290,{size:26,color:C.dim}));
  return s;
 },
 [K+'dw']:(p)=>{
  let s=T(`${Pv}=\\dfrac{d${Wv}}{dt}`,250,120,48,{color:C.dim});
  s+=fade(seg(p,.1,.3),L('d𝐫 ＝ 𝐯 dt（1本目）',600,210,{size:26,color:CX,weight:700}));
  s+=fade(seg(p,.3,.55),T(`d${Wv}=${bF}\\cdot d${br}=${bF}\\cdot${bv}\\,dt`,600,330,60));
  return s;
 },
 [K+'p']:(p)=>{
  let s=T(`d${Wv}=${bF}\\cdot${bv}\\,dt`,600,100,50,{color:C.dim});
  s+=fade(seg(p,.1,.3),label('÷ dt',600,190,{size:34,color:CH,anchor:'middle',weight:700}));
  const f=`${Pv}=${bF}\\cdot${bv}`,w=texWidth(f,90);
  s+=fade(seg(p,.4,.55),highlight(600-w/2-30,240,w+60,150,1,CH))+fade(seg(p,.3,.5),T(f,600,340,90));
  s+=fade(seg(p,.6,.8),L('仕事率 ＝ 力と 速度の 内積（導いた 結果）',600,460,{size:26,color:CH}));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=T(`${Pv}=${bF}\\cdot${bv}`,600,90,52);
  s+=fade(seg(p,.1,.3),T('\\mathrm{J/s}=\\mathrm{W}',600,220,64)+L('ワット',850,228,{size:28,color:CE,weight:700}));
  s+=card(250,330,700,120,L('仕事の 記号 W（斜体）と 単位の ワット W は 別物',600,400,{size:26,color:CH}),seg(p,.5,.65),CH);
  return s;
 },
 [K+'unit2']:(p)=>{
  let s=T('1\\ \\mathrm{W}=1\\ \\mathrm{J/s}=1\\ \\mathrm{N\\cdot m/s}',600,110,56);
  s+=fade(seg(p,.4,.6),T(`\\dfrac{d${Kv}}{dt}=${bF}\\cdot${bv}`,600,300,60)
   +L('合力の 仕事率 ＝ K の 増える 速さ',600,420,{size:28,color:CE,weight:700}));
  return s;
 },

 // ===== S2 数と符号で読む =====
 [K+'push']:(p)=>{
  let s=cartScene({F:seg(p,.05,.3),v:seg(p,.4,.6)});
  s+=card(660,110,500,240,L('運動の 向きに 押す',910,165,{size:26,color:C.dim})+fade(seg(p,.1,.3),T('F=100\\ \\mathrm{N}',910,235,44))+fade(seg(p,.45,.6),T('v=2\\ \\mathrm{m/s}',910,305,44)),seg(p,0,.15));
  return s;
 },
 [K+'push2']:(p)=>{
  let s=cartScene({});
  s+=card(660,90,500,300,T(`${Pv}=100\\times2`,910,165,48)+fade(seg(p,.15,.3),T(`=${cE('200\\ \\mathrm{W}')}`,910,250,52))
   +fade(seg(p,.5,.7),L('1秒に 200 J を 渡す',910,340,{size:28,color:CE,weight:700})),1);
  return s;
 },
 [K+'fric']:(p)=>{
  let s=cartScene({dir:-1});
  s+=card(660,90,500,300,L('逆向きの 摩擦 100 N',910,140,{size:26,color:CA,weight:700})+fade(seg(p,.1,.3),T(`${Pv}=(-100)\\times2=${cA('-200\\ \\mathrm{W}')}`,910,225,38))
   +fade(seg(p,.5,.7),L('1秒に 200 J を 取り去る',910,320,{size:28,color:CA,weight:700})),seg(p,0,.15),CA);
  return s;
 },
 [K+'dial']:(p)=>{
  let s=dial(mix(0,50,seg(p,.1,.5)),{gauge:0});
  s+=card(660,110,500,260,fade(seg(p,.05,.25),T(`${Pv}=F\\,v\\cos\\theta`,910,200,52))+fade(seg(p,.5,.7),L('θ：力と 速度の 間の 角',910,300,{size:26})),1);
  return s;
 },
 [K+'dial2']:(p)=>{
  const b=[.08,.3,.5,.7],stops=[0,60,90,180];let k=0;for(let i=1;i<4;i++)if(p>=b[i])k=i;
  const th=k===0?0:mix(stops[k-1],stops[k],seg(p,b[k],b[k]+.08));
  let s=dial(th);
  const rows=['0°：200 W','60°：100 W','90°：0','180°：−200 W'];
  rows.forEach((r,i)=>{s+=fade(i<=k?1:0,L(r,950,140+i*80,{size:30,color:i===3?CA:i===2?CH:CE,weight:700}));});
  return s;
 },
 [K+'predict']:(p)=>{
  let s=dial(90);
  s+=card(660,130,500,220,L('90° の 力は',910,190,{size:30})+L('何も しない？',910,255,{size:34,color:CH,weight:700})+fade(seg(p,.3,.5),L('予想してみよう',910,315,{size:24,color:CH})),seg(p,.05,.2),CH);
  return s;
 },

 // ===== S3 速さを変えない力 =====
 [K+'perp']:(p)=>{
  let s=circleScene({showSpeed:0});
  s+=card(640,80,520,360,T(`${bF}\\perp${bv}`,900,150,48)+fade(seg(p,.15,.35),T(`${Pv}=${bF}\\cdot${bv}=0`,900,240,48))
   +fade(seg(p,.5,.7),T(`\\dfrac{d${Kv}}{dt}=0`,900,345,48)+L('（合力なら）',1070,350,{size:22,color:C.dim}))
   +fade(seg(p,.7,.85),L('K も 速さも 一定',900,420,{size:28,color:CH,weight:700})),1);
  return s;
 },
 [K+'perp2']:(p)=>{
  let s=circleScene({ang:mix(.9,2.2,seg(p,.1,.9)),showSpeed:0});
  s+=card(640,110,520,280,L('力 ≠ 0',900,175,{size:34,color:CF,weight:700})+fade(seg(p,.3,.5),L('速さは 変えずに',900,250,{size:28}))+fade(seg(p,.4,.6),L('速度の 向きを 変える',900,310,{size:30,color:CV,weight:700})),1);
  return s;
 },
 [K+'circle']:(p)=>{
  let s=circleScene({ang:mix(.3,1.2,p),force:0,right:0});
  s+=card(640,90,520,320,L('ベクトル・上級の 等速円運動',900,140,{size:24,color:C.dim})+T(`${br}=(2\\cos3t,\\;2\\sin3t)\\ \\mathrm{m}`,900,220,36)
   +fade(seg(p,.4,.6),T('|\\mathbf{v}|=6\\ \\mathrm{m/s}',900,320,48)),seg(p,0,.15));
  return s;
 },
 [K+'circle2']:(p)=>{
  let s=circleScene({force:seg(p,.3,.5),right:seg(p,.5,.7)});
  s+=card(640,90,520,320,L('加速度は 中心向き',900,150,{size:28,color:CA,weight:700})+fade(seg(p,.1,.3),T(`${br}\\cdot${bv}=0`,900,230,46))
   +fade(seg(p,.5,.7),L('ひもの 力 ⊥ 速度',900,320,{size:30,color:CF,weight:700})),1);
  return s;
 },
 [K+'circle3']:(p)=>{
  let s=circleScene({});
  s+=card(640,70,520,370,L('m ＝ 0.5 kg',900,120,{size:26,color:C.dim})+fade(seg(p,.05,.25),T('F=0.5\\times18=9\\ \\mathrm{N}',900,195,40))
   +fade(seg(p,.4,.6),T(`${Pv}=0`,900,285,48))+fade(seg(p,.6,.8),L('速さは 6 m/s の まま',900,370,{size:28,color:CV,weight:700})),1);
  return s;
 },
 [K+'diff']:(p)=>{
  let s=card(80,90,500,320,L('仕事 ＝ 0',330,170,{size:36,color:CE,weight:700})+L('速さが 変わらない',330,240,{size:26})+L('（𝐅 ⊥ 𝐯）',330,300,{size:26,color:C.dim}),seg(p,0,.15),CE);
  s+=fade(seg(p,.1,.25),L('≠',600,265,{size:60,color:CA,weight:700}));
  s+=card(620,90,500,320,L('力 ＝ 0',870,170,{size:36,color:CF,weight:700})+L('速度が 変わらない',870,240,{size:26})+L('（向きも 一定）',870,300,{size:26,color:C.dim}),seg(p,.15,.3),CF);
  s+=fade(seg(p,.6,.8),L('直角な力 → 速さは そのまま、道を 曲げる',600,470,{size:28,color:CH,weight:700}));
  return s;
 },
 [K+'lorentz']:(p)=>{
  let s=circleScene({B:seg(p,0,.2),charge:1,showSpeed:0,ang:mix(.9,2.4,seg(p,.2,1))});
  s+=card(640,90,520,320,L('電磁気：ローレンツ力',900,150,{size:28,color:CQ,weight:700})+fade(seg(p,.2,.4),L('いつも 速度と 直角',900,230,{size:28}))
   +fade(seg(p,.5,.7),L('磁場は 速さを 変えない',900,310,{size:30,color:CH,weight:700})),seg(p,.05,.2));
  return s;
 },

 // ===== S4 坂を上る車 =====
 [K+'car']:(p)=>{
  let s=slope({v:seg(p,.1,.3)});
  s+=card(660,70,500,330,T('m=1000\\ \\mathrm{kg}',910,130,40)+fade(seg(p,.15,.3),T('v=20\\ \\mathrm{m/s}',910,200,40))
   +fade(seg(p,.4,.6),T('\\sin\\theta=0.05',910,275,40))+fade(seg(p,.7,.85),L('空気抵抗などは 考えない',910,350,{size:24,color:C.dim})),seg(p,0,.15));
  return s;
 },
 [K+'split']:(p)=>{
  let s=slope({mg:seg(p,0,.2),split:seg(p,.3,.5)});
  s+=card(660,90,500,280,L('垂直な 成分 ⊥ 𝐯',910,170,{size:28,color:C.dim,weight:700})+fade(seg(p,.6,.8),T(`${Pv}=0`,910,260,48)),seg(p,.5,.65));
  return s;
 },
 [K+'along']:(p)=>{
  let s=slope({mg:1,split:1});
  s+=card(640,70,520,370,L('坂に 沿う 成分',900,120,{size:26,color:CA,weight:700})
   +fade(seg(p,.05,.25),T('mg\\sin\\theta=1000\\times9.8\\times0.05',900,200,32))
   +fade(seg(p,.35,.55),T('=490\\ \\mathrm{N}',900,280,48))+fade(seg(p,.65,.85),L('速度と 逆向き',900,360,{size:28,color:CA,weight:700})),1);
  return s;
 },
 [K+'pg']:(p)=>{
  let s=slope({mg:1,split:1});
  s+=card(640,70,520,370,L('重力の 仕事率',900,120,{size:26,color:C.dim})
   +fade(seg(p,.05,.25),T(`${Pv}=-490\\times20`,900,200,44))
   +fade(seg(p,.3,.5),T(`=${cA('-9800\\ \\mathrm{W}')}`,900,285,50))
   +fade(seg(p,.6,.8),L('1秒に 9.8 kJ ずつ K を 奪う',900,370,{size:26,color:CA,weight:700})),1);
  return s;
 },
 [K+'engine']:(p)=>{
  let s=L('合わせた 仕事率',600,60,{size:28,color:C.dim});
  s+=fade(seg(p,.05,.25),T(`\\dfrac{d${Kv}}{dt}=${Pv}_{\\mathrm{E}}+(-9800\\ \\mathrm{W})`,600,170,52));
  s+=fade(seg(p,.05,.25),T(`${Pv}_{\\mathrm{E}}`,470,265,34)+label('：エンジンが 車を 押す 仕事率',500,272,{size:24,color:C.dim}));
  s+=card(200,320,800,130,T(`${Pv}_{\\mathrm{E}}<9.8\\ \\mathrm{kW}\\ \\Rightarrow\\ \\dfrac{d${Kv}}{dt}<0`,600,380,36)+L('坂で 車が 遅くなる',600,435,{size:26}),seg(p,.4,.6),CA);
  return s;
 },
 [K+'engine2']:(p)=>{
  let s=T(`\\dfrac{d${Kv}}{dt}=${Pv}_{\\mathrm{E}}+(-9800\\ \\mathrm{W})`,600,100,44,{color:C.dim});
  s+=fade(seg(p,.05,.25),T(`${Pv}_{\\mathrm{E}}=8\\ \\mathrm{kW}=8000\\ \\mathrm{W}`,600,195,40));
  s+=fade(seg(p,.3,.55),T(`\\dfrac{d${Kv}}{dt}=8000-9800=${cA('-1800\\ \\mathrm{W}')}`,600,330,52));
  return s;
 },
 [K+'engine3']:(p)=>{
  let s=T(`\\dfrac{d${Kv}}{dt}=m\\,v\\dfrac{dv}{dt}`,600,95,46);
  s+=fade(seg(p,.0,.15),L('（1本目：d(½mv²)/dt ＝ mv dv/dt）',940,95,{size:22,color:C.dim}));
  s+=fade(seg(p,.2,.45),T('\\dfrac{dv}{dt}=\\dfrac{-1800}{1000\\times20}',600,250,52));
  s+=fade(seg(p,.5,.7),T(`=${cA('-0.09\\ \\mathrm{m/s^2}')}`,600,390,52));
  return s;
 },

 // ===== S5 往復で符号を見る =====
 [K+'trip']:(p)=>{
  let s=tripScene({up:seg(p,.4,.6),down:seg(p,.7,.9)});
  s+=card(640,90,520,300,L('重力 𝐅 ＝ (0, −20) N',900,160,{size:28,color:CF,weight:700})+L('(4, 0) m ⇄ (0, 3) m',900,240,{size:28,color:CX})+L('まっすぐな 坂',900,310,{size:26,color:C.dim}),seg(p,0,.15));
  return s;
 },
 [K+'trip2']:(p)=>{
  let s=tripScene({up:1,down:seg(p,.5,.65)});
  s+=card(640,60,520,400,L('上り',900,105,{size:26,color:CX,weight:700})+fade(seg(p,.05,.25),T(`${Wv}=0\\times(-4)+(-20)\\times3`,900,170,34))
   +fade(seg(p,.25,.4),T(`=${cA('-60\\ \\mathrm{J}')}`,900,235,44))
   +fade(seg(p,.5,.65),L('下り',900,300,{size:26,color:CT,weight:700})+T(`${Wv}=0\\times4+(-20)\\times(-3)`,900,355,34))
   +fade(seg(p,.7,.85),T(`=${cE('+60\\ \\mathrm{J}')}`,900,420,44)),1);
  return s;
 },
 [K+'trip3']:(p)=>{
  let s=tripScene({up:1,down:1});
  s+=card(640,90,520,330,L('d𝐫 が 逆向き、𝐅 は 同じ',900,150,{size:26})+fade(seg(p,.3,.5),L('→ 仕事の 符号が 逆',900,220,{size:28,color:CH,weight:700}))
   +fade(seg(p,.6,.8),T(`-60+60=0`,900,310,48)+L('往復で 0',900,380,{size:28,color:CF,weight:700})),1);
  return s;
 },
 [K+'fric2']:(p)=>{
  let s=tripScene({up:1,down:1,box:0,labs:0});
  const a=[TX(1.5),TY(1.875)-30],b=[TX(2.6),TY(1.05)+30];
  s+=fade(seg(p,.1,.3),arrow(a[0],a[1],a[0]+56,a[1]+42,{color:CA,w:6,head:15})+label('上りの 摩擦',a[0]+30,a[1]-28,{size:22,color:CA,weight:700}));
  s+=fade(seg(p,.35,.55),arrow(b[0],b[1],b[0]-56,b[1]-42,{color:CA,w:6,head:15})+label('下りの 摩擦',b[0]-10,b[1]+44,{size:22,color:CA,weight:700,anchor:'end'}));
  s+=card(640,90,520,330,L('摩擦は 運動と 逆向き',900,160,{size:28,color:CA,weight:700})+fade(seg(p,.4,.6),L('運動を 逆にすると 摩擦も 逆',900,230,{size:26}))
   +fade(seg(p,.65,.85),T(`${bF}\\cdot d${br}<0`,900,320,48)+L('いつも 負',900,390,{size:28,color:CA,weight:700})),1);
  return s;
 },
 [K+'fric3']:(p)=>{
  let s=tripScene({up:1,down:1,box:0,labs:0});
  s+=card(640,70,520,370,L('坂の 長さ',900,120,{size:26,color:C.dim})+T('\\sqrt{4^2+3^2}=5\\ \\mathrm{m}',900,180,38)
   +fade(seg(p,.2,.4),T(`-4\\times5=${cA('-20\\ \\mathrm{J}')}`,900,260,40)+L('（上り・下り とも）',1060,300,{size:22,color:C.dim}))
   +fade(seg(p,.55,.75),T(`-20-20=${cA('-40\\ \\mathrm{J}')}`,900,380,44)),1);
  return s;
 },
 [K+'table']:(p)=>{
  const x0=180,y0=110,cw=[240,200,200,200],rh=90,rows=[['','上り','下り','往復'],['重力','−60 J','＋60 J','0'],['摩擦','−20 J','−20 J','−40 J']];
  let s='';let x=x0;
  rows.forEach((r,i)=>{x=x0;r.forEach((c,j)=>{const g=seg(p,.05+i*.2,.2+i*.2);
   s+=fade(g,rect(x,y0+i*rh,cw[j],rh,{fill:i===0?'#1d2e4f':'#131f38',fo:1,stroke:C.faint,sw:2,rx:4}));
   const col=i===0?C.dim:j===0?(i===1?CF:CA):c.startsWith('−')?CA:c.startsWith('＋')?CE:CH;
   s+=fade(g,L(c,x+cw[j]/2,y0+i*rh+rh/2+10,{size:30,color:col,weight:i===0?400:700}));x+=cw[j];});});
  s+=fade(seg(p,.7,.85),L('場所で 決まる 力は 往復 0、摩擦は 0 に 戻らない',600,450,{size:26,color:CH}));
  return s;
 },

 // ===== S6 まとめと次の問い =====
 [K+'sum']:(p)=>{
  let s=card(80,60,500,330,T(`${Pv}=${bF}\\cdot${bv}`,330,170,56)+L('単位：W ＝ J/s',330,270,{size:28,color:CE}),seg(p,0,.15),CE);
  s+=card(620,60,500,330,T(`${bF}\\perp${bv}\\Rightarrow ${Pv}=0`,870,170,44)+L('速さは そのまま',870,260,{size:28})+L('道を 曲げる',870,320,{size:28,color:CH,weight:700}),seg(p,.4,.55),CH);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(80,60,500,330,L('摩擦',330,130,{size:30,color:CA,weight:700})+L('往復とも 負',330,210,{size:30})+T('-40\\ \\mathrm{J}',330,300,44),seg(p,0,.15),CA);
  s+=card(620,60,500,330,L('重力',870,130,{size:30,color:CF,weight:700})+L('往復で 0',870,210,{size:30})+L('道に よらず 始点と 終点で 決まる',870,300,{size:24,color:CH,weight:700}),seg(p,.3,.45),CF);
  return s;
 },
 [K+'next']:(p)=>{
  let s=card(200,80,800,300,L('初級：重力の 仕事 → 位置だけで 決まる エネルギー',600,150,{size:26,color:C.dim})+T('U=mgh',600,260,64,{color:CE}),seg(p,0,.15),CE);
  return s;
 },
 [K+'next2']:(p)=>{
  const cx=260,cy=270;
  let s=fade(seg(p,0,.2),ring(cx,cy,60,{color:CX,w:3,fill:'#1d2e4f'})+label('地球',cx,cy+9,{size:24,color:C.ink,anchor:'middle'}));
  for(let i=0;i<4;i++){const r=110+i*60;s+=fade(seg(p,.05+i*.05,.2+i*.05),arrow(cx+r,cy,cx+r-(46-i*9),cy,{color:CF,w:5-i*0.6,head:14}));}
  s+=fade(seg(p,.1,.3),label('遠いほど 弱い',cx+200,cy+60,{size:24,color:CF,anchor:'middle'}));
  s+=card(600,80,560,350,L('次の 問い',880,130,{size:26,color:C.dim})+L('距離で 弱まる 万有引力でも',880,205,{size:28})+L('位置エネルギーは 作れる？',880,260,{size:32,color:CE,weight:700})
   +fade(seg(p,.5,.7),L('その U は なぜ 負？',880,350,{size:34,color:CH,weight:700})),seg(p,.05,.2),CH);
  return s;
 },
};

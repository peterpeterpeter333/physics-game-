// YouTube シリーズ「運動量・上級 1/2」(ys-uc-momentum-1) — 図。Stage 1200×515.
// 色：運動量 p 桃、内力 緑、外力 赤（初級と同じ）、速度 v 紫、位置 r 水色、時間 t 金、運動エネルギー K 橙、重心 黄。
// 記号：𝐅₁₂＝2が1に及ぼす力、𝐅₂₁＝1が2に及ぼす力、𝐅₁・𝐅₂＝それぞれが受ける外力の和、𝐅外＝𝐅₁＋𝐅₂（「外」は tex に入れず label）。
// 衝突（右向きを正）：2 kg・3 m/s → 静止 1 kg、一体化後 2 m/s。p₁ 6→4、p₂ 0→2、K 9→6 J、v_G＝2 m/s（前後とも）。
// 衝突のアニメ（画面 px）：x₁＝150＋800u（u≤0.4）、接触 u＝0.4、その後 2台とも 533.3 px/単位（＝速度比 3:2）。重心 (2x₁＋x₂)/3 は一定の速さ。
import {C,seg,fade,clamp,label,line,rect,dot,ring,arrow,brace,highlight,axes,tex,texWidth,draw,cart} from './anim.mjs';

const K='uc-momentum-1:';
const CP=C.p,CF=C.F,CX=C.a,CV=C.v,CR=C.x,CT=C.t,CK=C.E,CH=C.hi,CD=C.dim,OK=C.F,BAD=C.a,CG=C.hi;
const cc=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});
const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const check=(x,y,sz=14,color=OK)=>draw([[x-sz,y],[x-sz*.3,y+sz*.7],[x+sz,y-sz*.8]],1,{color,w:5});
const cross=(x,y,sz=14,color=BAD)=>line(x-sz,y-sz,x+sz,y+sz,{color,w:5})+line(x-sz,y+sz,x+sz,y-sz,{color,w:5});
const dashRect=(x,y,w,h,{color=CH,g=1,sw=3}={})=>fade(g,`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${color}" fill-opacity=".04" stroke="${color}" stroke-width="${sw}" stroke-dasharray="12 9"/>`);

// ---- symbols ----
const t=cc(CT,'t');
const p1=cc(CP,'\\mathbf p_1'),p2=cc(CP,'\\mathbf p_2'),P=cc(CP,'\\mathbf P');
const F12=cc(CF,'\\mathbf F_{12}'),F21=cc(CF,'\\mathbf F_{21}'),E1=cc(CX,'\\mathbf F_1'),E2=cc(CX,'\\mathbf F_2'),FX=cc(CX,'\\mathbf F');
const dd=q=>`\\dfrac{d${q}}{d${t}}`;
const PH='\\vphantom{\\dfrac{d\\mathbf P}{dt}\\int_{t_1}^{t_2}}';
// A row of TeX pieces with Japanese tags (e.g. 外) placed as subscripts on the shared baseline.
function seq(parts,x,y,size=44,{anchor='middle'}={}){
 const ws=parts.map(q=>q.j?size*.6*q.j.length+4:texWidth(PH+q.t,size,false));
 const tot=ws.reduce((a,b)=>a+b,0);let cx=anchor==='middle'?x-tot/2:anchor==='end'?x-tot:x,base=y,s='';
 parts.forEach((q,i)=>{
  if(q.t!==undefined){const g=T(PH+q.t,cx,y,{size,anchor:'start'});const m=g.match(/translate\(([-\d.]+) ([-\d.]+)\)/);if(m)base=+m[2];s+=g;}
  else s+=label(q.j,cx+1,base+size*.22,{size:Math.round(size*.6),color:q.c??CX,weight:700});
  cx+=ws[i];
 });
 return s;
}
const FOUT=(pre,size=44)=>[{t:pre+FX},{j:'外'}];

// ---- two bodies inside the system box (S2, S3) ----
const B1={x:215,y:330,r:42},B2={x:420,y:235,r:32};
function bodies({g=1,box=1,intl=0,ext=0,dimInt=0,small=0}={}){
 let s=dashRect(40,95,530,385,{g:box})+fade(box,label('系',68,135,{size:30,color:CH,weight:700}));
 s+=fade(g,ring(B1.x,B1.y,B1.r,{color:CD,w:3,fill:'#2b3d63'})+L('1',B1.x,B1.y+10,{size:30,weight:700})+ring(B2.x,B2.y,B2.r,{color:CD,w:3,fill:'#2b3d63'})+L('2',B2.x,B2.y+10,{size:28,weight:700}));
 // unit vector from 1 to 2
 const dx=B2.x-B1.x,dy=B2.y-B1.y,d=Math.hypot(dx,dy),ux=dx/d,uy=dy/d,Lf=62;
 if(intl>0){
  const a1x=B1.x-ux*B1.r,a1y=B1.y-uy*B1.r,a2x=B2.x+ux*B2.r,a2y=B2.y+uy*B2.r,op=dimInt?.35:1;
  s+=fade(intl*op,arrow(a1x,a1y,a1x-ux*Lf,a1y-uy*Lf,{color:CF,w:6,head:16})+T(F12,a1x-ux*Lf-10,a1y-uy*Lf+44,{size:30,anchor:'end'}));
  s+=fade(intl*op,arrow(a2x,a2y,a2x+ux*Lf,a2y+uy*Lf,{color:CF,w:6,head:16})+T(F21,a2x+ux*Lf+6,a2y+uy*Lf+30,{size:30,anchor:'start'}));
 }
 if(ext>0){
  s+=fade(ext,arrow(B1.x,B1.y+B1.r,B1.x+30,B1.y+B1.r+95,{color:CX,w:6,head:16})+T(E1,B1.x+44,B1.y+B1.r+80,{size:30,anchor:'start'}));
  s+=fade(ext,arrow(B2.x-8,B2.y-B2.r,B2.x-50,B2.y-B2.r-90,{color:CX,w:6,head:16})+T(E2,B2.x-60,B2.y-B2.r-70,{size:30,anchor:'end'}));
 }
 return s;
}

// ---- carts on a track (S4, S5) ----
const GY=430,W1=150,W2=110,H1=64,H2=52;
function collide(u){u=clamp(u);if(u<=.4)return {x1:150+800*u,x2:600};return {x1:470+533.33*(u-.4),x2:600+533.33*(u-.4)};}
function carts(x1,x2,{g=1,label1='2 kg',label2='1 kg'}={}){
 return fade(g,cart(x1,GY,{w:W1,h:H1,color:'#9aabc7',text:label1,size:24})+cart(x2,GY,{w:W2,h:H2,color:'#9aabc7',text:label2,size:24}));
}
function track(g=1){let s=line(40,GY,1170,GY,{color:CD,w:3});return fade(g,s);}
function posDir(x=50,y=70,g=1){return fade(g,arrow(x,y,x+80,y,{color:CH,w:4,head:14})+label('右向きを 正',x+94,y+8,{size:22,color:CH}));}
function vArrow(x,y,len,txt,{g=1}={}){return fade(g,arrow(x,y,x+len,y,{color:CV,w:6,head:16})+label(txt,x+len/2,y-14,{size:24,color:CV,anchor:'middle',weight:700}));}
function gMark(x,g=1,y=GY-110){return fade(g,line(x,y-18,x,GY-2,{color:CG,w:2,dash:'5 5'})+dot(x,y,9,CG)+label('G',x,y-18,{size:24,color:CG,anchor:'middle',weight:700}));}

// ---- bar chart of signed values ----
function bars(items,{x=120,y0=300,sc=22,w=70,gap=40,g=1}={}){
 let s='';items.forEach((it,i)=>{const bx=x+i*(w+gap),h=it.v*sc;
  s+=fade(it.g??g,rect(bx,h>=0?y0-h:y0,w,Math.abs(h),{fill:it.c,fo:.5,stroke:it.c,sw:2,rx:4})+label(it.n,bx+w/2,y0+34,{size:22,color:CD,anchor:'middle'})+label(it.t??String(it.v),bx+w/2,h>=0?y0-h-10:y0-h+28,{size:24,color:it.c,anchor:'middle',weight:700}));});
 return s;
}

export const ytUcMomentum1Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  const u=.32*seg(p,0,.6),{x1,x2}=collide(u);
  let s=track()+carts(x1,x2)+vArrow(x1-40,GY-110,90,'3 m/s');
  s+=fade(seg(p,.2,.35),arrow(x1-60,GY-185,x1+80,GY-185,{color:CP,w:7,head:18})+label('p₁',x1-70,GY-177,{size:26,color:CP,anchor:'end',weight:700}));
  s+=card(720,90,440,170,L('押し合っても',940,145,{size:28})+L('運動量の 合計は',940,195,{size:30,color:CP,weight:700})+L('なぜ 変わらない？',940,240,{size:30,color:CH,weight:700}),seg(p,.3,.45),CH);
  return s;
 },
 [K+'recap1']:(p)=>{
  let s=track()+cart(330,GY,{w:120,h:56,color:'#9aabc7',text:'A',size:24})+cart(470,GY,{w:120,h:56,color:'#9aabc7',text:'B',size:24});
  s+=dashRect(230,240,340,215,{g:seg(p,.05,.2)});
  s+=fade(seg(p,.3,.45),arrow(388,300,320,300,{color:CF,w:6,head:16})+arrow(412,300,480,300,{color:CF,w:6,head:16})+L('押し合う 力',400,280,{size:22,color:CF}));
  s+=card(680,110,460,240,L('初級',910,160,{size:24,color:CD})+fade(seg(p,.35,.5),L('枠の 中の 押し合う 力',910,215,{size:28,color:CF})+L('→ 打ち消し合う',910,260,{size:28,color:CF,weight:700}))+fade(seg(p,.6,.75),L('合計の 運動量は 変わらない',910,320,{size:28,color:CP,weight:700})),1);
  return s;
 },
 [K+'recap2']:(p)=>{
  const A=axes({x:110,y:450,w:460,h:300,xmin:0,xmax:1,ymin:0,ymax:1.1,xticks:[],yticks:[],xlabel:'t',ylabel:'力 F',xcolor:CT,ycolor:CF});
  const f=u=>4*u*(1-u);
  let s=A.svg+A.plot(f,{from:0,to:1,color:CF,w:4});
  const pts=[[A.X(0),A.Y(0)],...Array.from({length:41},(_,i)=>[A.X(i/40),A.Y(f(i/40))]),[A.X(1),A.Y(0)]];
  s+=fade(seg(p,.45,.6),`<polygon points="${pts.map(q=>q.join(',')).join(' ')}" fill="${CP}" fill-opacity=".3"/>`+L('面積 ＝ Δp',A.X(.5),A.Y(.35),{size:26,color:CP,weight:700}));
  s+=card(660,90,480,150,L('中級：力は 運動量の 変化率',900,122,{size:24,color:CD})+T(`${cc(CF,'\\mathbf F')}=${dd(cc(CP,'\\mathbf p'))}`,900,205,{size:42}),1);
  s+=card(660,270,480,150,L('時間で 積むと',900,300,{size:24,color:CD})+T(`\\Delta ${cc(CP,'\\mathbf p')}=\\int ${cc(CF,'\\mathbf F')}\\,d${t}`,900,385,{size:42}),seg(p,.4,.55));
  return s;
 },
 [K+'hook']:(p)=>{
  const A=axes({x:110,y:450,w:460,h:300,xmin:0,xmax:1,ymin:0,ymax:1.2,xticks:[],yticks:[],xlabel:'t',ylabel:'押し合う 力',xcolor:CT,ycolor:CF});
  const f=u=>Math.max(0,4*u*(1-u)*(1+.25*Math.sin(23*u)+.12*Math.sin(51*u)));
  let s=A.svg+A.plot(f,{from:0,to:1,color:CF,w:4,p:seg(p,0,.3)});
  s+=fade(seg(p,.25,.4),L('一瞬で 大きく 変わる',A.X(.45),118,{size:24,color:CF}));
  s+=fade(seg(p,.3,.45),L('中身は よく 分からない',340,495,{size:24,color:BAD,weight:700}));
  s+=card(660,110,480,260,L('それでも',900,160,{size:26,color:CD})+fade(seg(p,.55,.7),L('前の 合計 ＝ 後の 合計',900,240,{size:34,color:CP,weight:700})+L('（運動量）',900,295,{size:24,color:CP})),seg(p,.5,.6),CP);
  return s;
 },
 [K+'today']:(p)=>{
  let s=L('今回 導く もの',600,90,{size:28,color:CD});
  s+=card(80,130,500,260,L('①',130,180,{size:30,color:CH,weight:700})+L('作用・反作用 から',330,190,{size:28})+L('運動量の 保存',330,260,{size:36,color:CP,weight:700})+L('（中級で 予告）',330,330,{size:24,color:CD}),seg(p,.05,.2),CP);
  s+=card(620,130,500,260,L('②',670,180,{size:30,color:CH,weight:700})+L('重心の 式',870,190,{size:28})+seq([{t:`M\\,${cc(C.a,'\\mathbf a_G')}=${FX}`},{j:'外'}],870,270,46)+L('（中級で 結果として 使用）',870,330,{size:24,color:CD}),seg(p,.45,.6),CX);
  return s;
 },
 [K+'dist']:(p)=>{
  let s=card(70,90,500,330,L('実験に 支えられた 法則',320,140,{size:28,color:CH,weight:700})+T(`${cc(CF,'\\mathbf F')}=${dd(cc(CP,'\\mathbf p'))}`,320,230,{size:44})+fade(seg(p,.15,.3),T(`${F12}=-${F21}`,320,330,{size:44})+L('作用・反作用',320,385,{size:24,color:CD})),1,CH);
  s+=card(630,90,500,330,L('そこから 導く 結果',880,140,{size:28,color:OK,weight:700})+fade(seg(p,.5,.65),L('運動量 保存則',880,230,{size:32,color:CP,weight:700}))+fade(seg(p,.6,.75),L('重心の 式',880,320,{size:30})+seq([{t:`M\\,${cc(C.a,'\\mathbf a_G')}=${FX}`},{j:'外'}],880,375,36)),seg(p,.45,.55),OK);
  s+=fade(seg(p,.5,.65),arrow(580,255,620,255,{color:CD,w:4,head:14}));
  return s;
 },
 // ===== S2 内力と外力 =====
 [K+'sys']:(p)=>{
  let s=bodies({box:seg(p,.2,.4)});
  s+=card(600,130,540,220,L('物体 1 と 2 を 一つの 枠で 囲む',870,190,{size:28})+fade(seg(p,.5,.65),L('枠の 中身 ＝ 系',870,270,{size:36,color:CH,weight:700})),1);
  return s;
 },
 [K+'internal']:(p)=>{
  let s=bodies({intl:seg(p,.1,.3)});
  s+=card(600,100,550,300,L('内力：枠の 中どうしで 押し合う 力',875,150,{size:26,color:CF,weight:700})
   +fade(seg(p,.35,.5),T(F12,680,230,{size:38})+L('2 が 1 に 及ぼす 力',920,240,{size:26}))
   +fade(seg(p,.6,.75),T(F21,680,320,{size:38})+L('1 が 2 に 及ぼす 力',920,330,{size:26})),1,CF);
  return s;
 },
 [K+'external']:(p)=>{
  let s=bodies({intl:1,ext:seg(p,.1,.3)});
  s+=card(600,100,550,300,L('外力：枠の 外から 働く 力',875,150,{size:26,color:CX,weight:700})+L('（重力・床の 力 など）',875,190,{size:22,color:CD})
   +fade(seg(p,.4,.55),T(E1,680,255,{size:38})+L('1 が 受ける 外力の 和',920,265,{size:26}))
   +fade(seg(p,.6,.75),T(E2,680,335,{size:38})+L('2 が 受ける 外力の 和',920,345,{size:26})),1,CX);
  return s;
 },
 [K+'eq1']:(p)=>{
  let s=bodies({intl:1,ext:1});
  s+=fade(seg(p,.05,.2),ring(B1.x,B1.y,B1.r+12,{color:CH,w:3,dash:'6 5'}));
  s+=fade(seg(p,.1,.25),L('物体 1 が 受ける 力',870,130,{size:26,color:CD})+T(`${F12}\\;,\\;\\;${E1}`,870,190,{size:40}));
  s+=fade(seg(p,.55,.7),T(`${dd(p1)}=${F12}+${E1}`,870,320,{size:50}));
  return s;
 },
 [K+'eq2']:(p)=>{
  let s=bodies({intl:1,ext:1});
  s+=fade(seg(p,.05,.2),ring(B2.x,B2.y,B2.r+12,{color:CH,w:3,dash:'6 5'}));
  s+=T(`${dd(p1)}=${F12}+${E1}`,870,170,{size:46});
  s+=fade(seg(p,.1,.3),T(`${dd(p2)}=${F21}+${E2}`,870,290,{size:46}));
  s+=fade(seg(p,.55,.7),L('質量の 出入りが ない 物体',870,400,{size:26,color:CD}));
  return s;
 },
 [K+'ar']:(p)=>{
  let s=bodies({intl:1,ext:1});
  s+=card(600,110,550,280,L('作用・反作用の 法則',875,160,{size:28,color:CF,weight:700})+fade(seg(p,.3,.45),T(`${F12}=-${F21}`,875,250,{size:58}))+fade(seg(p,.55,.7),L('どの 瞬間も 同じ 大きさ・逆向き',875,340,{size:26})),1,CF);
  return s;
 },
 [K+'arexp']:(p)=>{
  const A=axes({x:120,y:290,w:520,h:180,xmin:0,xmax:1,ymin:-1.1,ymax:1.1,xticks:[],yticks:[],xlabel:'t',ylabel:'センサーの 力',xcolor:CT,ycolor:CF});
  const f=u=>u<.15||u>.85?0:Math.sin(Math.PI*(u-.15)/.7)*(1+.2*Math.sin(19*u));
  let s=A.svg;
  s+=A.plot(f,{from:0,to:1,color:CF,w:4,p:seg(p,.3,.6)})+A.plot(u=>-f(u),{from:0,to:1,color:'#4fbf8f',w:4,dash:'9 6',p:seg(p,.3,.6)});
  s+=fade(seg(p,.45,.6),T(F21,A.X(.9),A.Y(.45),{size:30,anchor:'start'})+T(F12,A.X(.9),A.Y(-.45),{size:30,anchor:'start'}));
  s+=card(720,90,430,330,L('これは 導いた 式ではない',935,140,{size:26,color:BAD,weight:700})+L('実験に 支えられた 法則',935,190,{size:28,color:CH,weight:700})
   +fade(seg(p,.35,.5),L('力センサーで ぶつけると',935,265,{size:26})+L('どの 瞬間も',935,315,{size:26})+L('同じ 大きさで 逆向き',935,365,{size:28,color:CF,weight:700})),1,CH);
  return s;
 },
 // ===== S3 足して内力を消す =====
 [K+'add']:(p)=>{
  let s=bodies({intl:1,ext:1});
  s+=T(`${dd(p1)}=${F12}+${E1}`,880,130,{size:44})+T(`${dd(p2)}=${F21}+${E2}`,880,240,{size:44});
  s+=fade(seg(p,.2,.35),L('＋',610,248,{size:44,color:CH,weight:700})+line(630,300,1140,300,{color:CH,w:3}));
  s+=fade(seg(p,.4,.55),L('左どうし',730,350,{size:26,color:CP})+L('右どうし',1010,350,{size:26,color:CF}));
  return s;
 },
 [K+'left']:(p)=>{
  let s=bodies({intl:1,ext:1,g:.6,box:.6});
  s+=L('左の 辺',870,110,{size:26,color:CP});
  s+=T(`${dd(p1)}+${dd(p2)}`,870,190,{size:46});
  s+=fade(seg(p,.4,.55),L('和の 微分 ＝ 微分の 和',890,292,{size:26,color:CH,anchor:'start'})+arrow(870,250,870,320,{color:CH,w:4,head:12}));
  s+=fade(seg(p,.55,.7),T(`=\\dfrac{d(${p1}+${p2})}{d${t}}`,870,390,{size:50}));
  return s;
 },
 [K+'P']:(p)=>{
  let s=bodies({intl:1,ext:1,g:.6,box:.6});
  s+=T(`${p1}+${p2}=${P}`,870,160,{size:52});
  s+=fade(seg(p,.1,.25),L('系 全体の 運動量',870,235,{size:28,color:CP,weight:700}));
  s+=fade(seg(p,.55,.7),L('左の 辺',730,345,{size:26,color:CD})+T(`=${dd(P)}`,900,350,{size:52}));
  return s;
 },
 [K+'right']:(p)=>{
  let s=bodies({intl:1,ext:1,g:.6,box:.6});
  const src=`${dd(P)}=${F12}+${F21}+${E1}+${E2}`;
  s+=T(src,870,170,{size:44});
  const w=texWidth(src,44,false),x0=870-w/2,wl=texWidth(`${dd(P)}=`,44,false),wi=texWidth(`${F12}+${F21}`,44,false);
  s+=fade(seg(p,.5,.65),brace(x0+wl,x0+wl+wi,215,{dir:1,color:CF,text:'内力の 組',size:26}));
  s+=fade(seg(p,.55,.7),brace(x0+wl+wi+texWidth('+',44,false),x0+w,215,{dir:1,color:CX,text:'外力',size:26}));
  return s;
 },
 [K+'cancel']:(p)=>{
  let s=bodies({intl:1-seg(p,.6,.8)*.8,ext:1,g:.6,box:.6});
  s+=T(`${dd(P)}=${F12}+${F21}+${E1}+${E2}`,870,120,{size:40});
  s+=fade(seg(p,.1,.25),L(`作用・反作用：F₂₁ → −F₁₂`,870,195,{size:26,color:CF}));
  s+=fade(seg(p,.2,.35)*(1-seg(p,.55,.65)),T(`=${F12}-${F12}+${E1}+${E2}`,870,290,{size:44}));
  s+=fade(seg(p,.55,.65),T(`=\\cancel{${F12}-${F12}}+${E1}+${E2}`,870,290,{size:44})+L('＝ 0',700,370,{size:34,color:CF,weight:700}));
  s+=fade(seg(p,.7,.85),L('内力の 組が 消える',1000,370,{size:28,color:CH,weight:700}));
  return s;
 },
 [K+'result']:(p)=>{
  let s=bodies({intl:.2,ext:1,g:.6,box:.6});
  s+=T(`${dd(P)}=${E1}+${E2}`,870,150,{size:52});
  {const w=texWidth(`${dd(P)}=${E1}+${E2}`,52,false),x0=870-w/2,wl=texWidth(`${dd(P)}=`,52,false);
   s+=fade(seg(p,.4,.55),brace(x0+wl,x0+w,205,{dir:1,color:CX,text:'外力の 和',size:26}));}
  s+=fade(seg(p,.6,.75),seq([{t:`${dd(P)}=${FX}`},{j:'外'}],870,350,56));
  return s;
 },
 [K+'cons']:(p)=>{
  let s=seq([{t:`${dd(P)}=${FX}`},{j:'外'}],330,140,48);
  s+=fade(seg(p,.1,.25),seq([{t:FX},{j:'外'},{t:'=\\mathbf 0\\;\\;\\Rightarrow\\;\\;'+dd(P)+'=\\mathbf 0'}],600,260,46));
  const A=axes({x:200,y:470,w:520,h:120,xmin:0,xmax:1,ymin:0,ymax:1.3,xticks:[],yticks:[],xlabel:'t',ylabel:'',xcolor:CT});
  s+=fade(seg(p,.3,.45),A.svg+A.plot(()=>.8,{from:0,to:1,color:CP,w:5})+label('P',A.X(0)-14,A.Y(.8)+8,{size:26,color:CP,anchor:'end',weight:700}));
  s+=card(800,330,360,150,L('運動量 保存則',980,385,{size:30,color:CP,weight:700})+L('（導いた 結果）',980,435,{size:24,color:OK}),seg(p,.5,.65),CP);
  return s;
 },
 [K+'integ']:(p)=>{
  let s=seq([{t:`${dd(P)}=${FX}`},{j:'外'}],600,110,44);
  s+=fade(seg(p,.05,.2),L('時間で 積分',600,180,{size:24,color:CH})+arrow(600,190,600,225,{color:CH,w:4,head:12}));
  s+=fade(seg(p,.1,.3),seq([{t:`${P}(${cc(CT,'t_2')})-${P}(${cc(CT,'t_1')})=\\int_{${cc(CT,'t_1')}}^{${cc(CT,'t_2')}}${FX}`},{j:'外'},{t:`\\,d${t}`}],600,290,48));
  {const parts=[{t:`${P}(${cc(CT,'t_2')})-${P}(${cc(CT,'t_1')})=\\int_{${cc(CT,'t_1')}}^{${cc(CT,'t_2')}}${FX}`},{j:'外'},{t:`\\,d${t}`}];
   const W=q=>texWidth(PH+q,48,false),tot=W(parts[0].t)+48*.6+4+W(parts[2].t),x0=600-tot/2;
   const wA=W(`${P}(${cc(CT,'t_2')})`),wB=W(`${P}(${cc(CT,'t_2')})-${P}(${cc(CT,'t_1')})`),wC=W(`${P}(${cc(CT,'t_2')})-${P}(${cc(CT,'t_1')})=`);
   s+=fade(seg(p,.2,.35),L('後',x0+wA/2,365,{size:24,color:CD})+L('前',x0+(wA+W('-')+wB)/2,365,{size:24,color:CD})+L('外力の 力積',(x0+wC+x0+tot)/2,365,{size:24,color:CX}));}
  s+=card(250,395,700,90,L('外力の 力積が 0 か、無視できる 間だけ 一定',600,450,{size:28,color:CH,weight:700}),seg(p,.5,.65),CH);
  return s;
 },
 [K+'floor']:(p)=>{
  let s=line(80,GY,620,GY,{color:CD,w:3})+L('なめらかな 床',170,GY+40,{size:24,color:CD});
  s+=cart(350,GY,{w:150,h:64,color:'#9aabc7',text:'',size:24});
  s+=fade(seg(p,.1,.25),arrow(380,GY-48,380,GY+62,{color:CX,w:6,head:16})+label('重力',398,GY+56,{size:24,color:CX}));
  s+=fade(seg(p,.2,.35),arrow(300,GY-6,300,GY-140,{color:CX,w:6,head:16})+label('床の 力',290,GY-150,{size:24,color:CX,anchor:'middle'}));
  s+=fade(seg(p,.3,.45),L('上下で 打ち消し合う',350,150,{size:26,color:CX,weight:700}));
  s+=card(700,120,450,260,L('横向きの 外力：なし',925,180,{size:28,color:CX})+fade(seg(p,.55,.7),arrow(820,260,1030,260,{color:CP,w:6,head:16})+L('横向きの 運動量が 保存',925,330,{size:30,color:CP,weight:700})),seg(p,.5,.6));
  return s;
 },
 [K+'three']:(p)=>{
  const Pt=[[200,380],[480,380],[340,160]],nm=['1','2','3'];
  let s=dashRect(80,100,520,360);
  const pr=[[0,1],[1,2],[2,0]];
  pr.forEach(([i,j],k)=>{const [ax,ay]=Pt[i],[bx,by]=Pt[j],dx=bx-ax,dy=by-ay,d=Math.hypot(dx,dy),ux=dx/d,uy=dy/d;
   const sx=ax+ux*36,sy=ay+uy*36,ex=bx-ux*36,ey=by-uy*36;
   const op=1-.75*seg(p,.35+k*.15,.45+k*.15);
   s+=fade(op,arrow(sx,sy,sx+ux*70,sy+uy*70,{color:CF,w:5,head:14})+arrow(ex,ey,ex-ux*70,ey-uy*70,{color:CF,w:5,head:14}));
   const mx=(ax+bx)/2,my=(ay+by)/2;s+=fade(seg(p,.35+k*.15,.45+k*.15),cross(mx,my,14));
  });
  Pt.forEach(([x,y],i)=>{s+=ring(x,y,34,{color:CD,w:3,fill:'#2b3d63'})+L(nm[i],x,y+10,{size:28,weight:700});});
  s+=card(680,110,470,300,L('内力は 1組ずつ 消える',915,165,{size:28,color:CF,weight:700})+fade(seg(p,.35,.45),L('1 と 2',915,225,{size:26}))+fade(seg(p,.5,.6),L('2 と 3',915,270,{size:26}))+fade(seg(p,.65,.75),L('3 と 1',915,315,{size:26}))+fade(seg(p,.8,.9),L('残るのは 外力だけ',915,375,{size:28,color:CX,weight:700})),1,CF);
  return s;
 },
 // ===== S4 衝突で確かめる =====
 [K+'ex']:(p)=>{
  const {x1,x2}=collide(.4*seg(p,.1,.9));
  let s=posDir()+track()+carts(x1,x2)+vArrow(x1-50,GY-110,100,'3 m/s',{g:1-seg(p,.85,.95)});
  s+=fade(seg(p,.3,.45),label('止まっている',x2,GY-90,{size:22,color:CD,anchor:'middle'}));
  s+=fade(seg(p,.88,.98),L('くっつく',(x1+x2)/2+20,GY-130,{size:28,color:CH,weight:700}));
  return s;
 },
 [K+'calc']:(p)=>{
  const {x1,x2}=collide(.7);
  let s=posDir()+track()+carts(x1,x2,{g:.5});
  s+=fade(seg(p,.55,.7),vArrow(x2+70,GY-60,70,'2 m/s'));
  s+=card(80,90,1040,220,
   L('前',150,160,{size:26,color:CD})+T(`2\\times 3+1\\times 0=6\\;\\mathrm{kg\\cdot m/s}`,520,155,{size:42})
   +fade(seg(p,.45,.6),L('後',150,250,{size:26,color:CD})+T(`(2+1)\\,${cc(CV,'v')}=6\\;\\;\\Rightarrow\\;\\;${cc(CV,'v')}=6\\div 3=2\\;\\mathrm{m/s}`,600,245,{size:42})),1);
  return s;
 },
 [K+'imp']:(p)=>{
  let s=posDir();
  const it=[{n:'p₁ 前',v:6,c:CP},{n:'p₁ 後',v:4,c:CP,g:seg(p,.15,.3)},{n:'p₂ 前',v:0,c:CP,t:'0'},{n:'p₂ 後',v:2,c:CP,g:seg(p,.5,.65)}];
  s+=bars(it,{x:110,y0:400,sc:40,w:80,gap:45});
  s+=fade(seg(p,.2,.35),L('−2',275,182,{size:30,color:BAD,weight:700}));
  s+=fade(seg(p,.55,.7),L('＋2',505,262,{size:30,color:OK,weight:700}));
  s+=card(680,110,470,280,L('合計の 運動量',915,165,{size:28,color:CP})+L('前：6 ＋ 0 ＝ 6',915,240,{size:30})+fade(seg(p,.6,.75),L('後：4 ＋ 2 ＝ 6',915,300,{size:30})+check(1060,292,12))+L('単位 kg·m/s',915,360,{size:22,color:CD}),seg(p,.05,.15));
  return s;
 },
 [K+'imp2']:(p)=>{
  const A=axes({x:110,y:270,w:520,h:200,xmin:0,xmax:1,ymin:-1.15,ymax:1.15,xticks:[],yticks:[],xlabel:'t',ylabel:'力',xcolor:CT,ycolor:CF});
  const f=u=>u<.15||u>.85?0:Math.sin(Math.PI*(u-.15)/.7)*(1+.25*Math.sin(17*u));
  const area=(sg,col)=>{const pts=[[A.X(.15),A.Y(0)],...Array.from({length:61},(_,i)=>{const u=.15+.7*i/60;return [A.X(u),A.Y(sg*f(u))];}),[A.X(.85),A.Y(0)]];return `<polygon points="${pts.map(q=>q.join(',')).join(' ')}" fill="${col}" fill-opacity=".3"/>`;};
  let s=A.svg+A.plot(u=>-f(u),{from:0,to:1,color:CF,w:4})+A.plot(f,{from:0,to:1,color:'#4fbf8f',w:4,dash:'9 6'});
  s+=fade(seg(p,.1,.25),area(-1,CP)+L('台車1 が 受ける：−2 N·s',A.X(.5),A.Y(-1.15)+40,{size:24,color:CP,weight:700}));
  s+=fade(seg(p,.3,.45),area(1,CP)+L('台車2 が 受ける：＋2 N·s',A.X(.5),A.Y(1.15)-14,{size:24,color:CP,weight:700}));
  s+=card(720,110,430,280,T(`\\Delta ${cc(CP,'\\mathbf p')}=\\int ${cc(CF,'\\mathbf F')}\\,d${t}`,935,170,{size:40})+fade(seg(p,.5,.65),L('中身が 分からなくても',935,260,{size:26})+L('同じ 大きさ・逆向き',935,315,{size:30,color:CF,weight:700})),1);
  return s;
 },
 [K+'ke']:(p)=>{
  let s=bars([{n:'前',v:9,c:CK,t:'9 J'},{n:'後',v:6,c:CK,t:'6 J',g:seg(p,.55,.7)}],{x:160,y0:430,sc:30,w:110,gap:90});
  s+=card(580,90,580,300,L('運動エネルギー K ＝ ½ m v²',870,140,{size:26,color:CK})
   +fade(seg(p,.15,.3),T(`\\tfrac12\\times 2\\times 3^2=9\\;\\mathrm{J}`,870,215,{size:42}))+fade(seg(p,.1,.25),L('前',640,222,{size:24,color:CD}))
   +fade(seg(p,.55,.7),T(`\\tfrac12\\times 3\\times 2^2=6\\;\\mathrm{J}`,870,315,{size:42})+L('後',640,322,{size:24,color:CD})),1);
  return s;
 },
 [K+'heat']:(p)=>{
  let s=bars([{n:'前',v:9,c:CK,t:'9 J'},{n:'後',v:6,c:CK,t:''}],{x:160,y0:430,sc:30,w:110,gap:90})+L('6 J',415,320,{size:26,color:C.ink,weight:700});
  s+=fade(seg(p,.05,.2),rect(360,430-270,110,90,{fill:BAD,fo:.18,stroke:BAD,sw:2,rx:4})+L('3 J',415,220,{size:26,color:BAD,weight:700})+L('変形・熱・音',415,145,{size:22,color:BAD}));
  s+=card(580,110,580,250,L('運動量：6 → 6',870,180,{size:30,color:CP,weight:700})+check(1060,172,12)
   +fade(seg(p,.5,.65),L('運動エネルギー：9 → 6 J',870,260,{size:30,color:CK,weight:700})+cross(1100,252,12)),1);
  return s;
 },
 [K+'work']:(p)=>{
  const y=250;
  let s=line(60,y+60,660,y+60,{color:CD,w:3});
  const a=seg(p,.15,.6);
  // during contact: cart1 moves 150 px, cart2 moves 90 px; the bumper spring between them is squeezed (70 → 10 px)
  const x1=180+150*a,x2=380+90*a;
  s+=cart(x1,y+60,{w:150,h:64,color:'#9aabc7',text:'1',size:26})+cart(x2,y+60,{w:110,h:52,color:'#9aabc7',text:'2',size:26});
  {const sx=x1+75,ex=x2-55,n=8,pts=[];for(let k=0;k<=n;k++)pts.push([sx+(ex-sx)*k/n,y+20+(k%2?-12:12)*(k>0&&k<n)]);s+=draw(pts,1,{color:CD,w:3});}
  s+=fade(seg(p,.1,.25),arrow(x1+20,y-20,x1-50,y-20,{color:CF,w:6,head:14})+arrow(x2-20,y-20,x2+50,y-20,{color:CF,w:6,head:14}));
  s+=fade(seg(p,.6,.75),line(180,y+110,330,y+110,{color:CR,w:4})+label('1 が 進む',255,y+145,{size:22,color:CR,anchor:'middle'})+line(380,y+170,470,y+170,{color:CR,w:4})+label('2 が 進む（短い）',425,y+205,{size:22,color:CR,anchor:'middle'}));
  s+=card(690,90,470,350,L('力の 和',925,140,{size:26,color:CD})+T(`${F12}+${F21}=\\mathbf 0`,925,195,{size:38})+check(1100,190,12)
   +fade(seg(p,.35,.5),L('仕事の 和',925,270,{size:26,color:CD})+L('（−力×1の距離）＋（力×2の距離）',925,320,{size:22,color:CK}))
   +fade(seg(p,.7,.85),L('1 の 方が 長い → 和は 負',925,385,{size:28,color:BAD,weight:700})),1);
  return s;
 },
 // ===== S5 重心 =====
 [K+'rg0']:(p)=>{
  const O=[120,420],r1=[330,250],r2=[690,250],G=[(2*r1[0]+r2[0])/3,250];
  let s=dot(O[0],O[1],6,C.ink)+label('O',O[0]-12,O[1]+26,{size:24,color:CD});
  s+=ring(r1[0],r1[1],38,{color:CD,w:3,fill:'#2b3d63'})+L('2 kg',r1[0],r1[1]+9,{size:22,weight:700})+ring(r2[0],r2[1],32,{color:CD,w:3,fill:'#2b3d63'})+L('1 kg',r2[0],r2[1]+8,{size:22,weight:700});
  s+=fade(seg(p,.1,.25),arrow(O[0],O[1],r1[0]-22,r1[1]+30,{color:CR,w:4,head:14})+T(cc(CR,'\\mathbf r_1'),220,320,{size:32})+arrow(O[0],O[1],r2[0]-20,r2[1]+20,{color:CR,w:4,head:14})+T(cc(CR,'\\mathbf r_2'),520,370,{size:32}));
  s+=fade(seg(p,.45,.6),line(r1[0],r1[1],r2[0],r2[1],{color:CD,w:2,dash:'6 6'})+dot(G[0],G[1],11,CG)+label('G',G[0],G[1]-20,{size:28,color:CG,anchor:'middle',weight:700}));
  s+=card(800,110,360,250,L('重心 G',980,165,{size:30,color:CG,weight:700})+L('質量で 重みを つけた',980,230,{size:26})+L('位置の 平均',980,275,{size:26})+fade(seg(p,.6,.75),L('→ 重い 側に 寄る',980,330,{size:24,color:CD})),seg(p,.4,.55),CG);
  return s;
 },
 [K+'rg']:(p)=>{
  let s=T(`${cc(CR,'\\mathbf r_G')}=\\dfrac{m_1${cc(CR,'\\mathbf r_1')}+m_2${cc(CR,'\\mathbf r_2')}}{M}`,600,170,{size:60});
  s+=fade(seg(p,.5,.65),T(`M=m_1+m_2`,600,330,{size:50})+L('全質量',830,338,{size:26,color:CD,anchor:'start'}));
  return s;
 },
 [K+'vg']:(p)=>{
  let s=T(`${cc(CR,'\\mathbf r_G')}=\\dfrac{m_1${cc(CR,'\\mathbf r_1')}+m_2${cc(CR,'\\mathbf r_2')}}{M}`,600,120,{size:46});
  s+=fade(seg(p,.1,.25),L('m₁、m₂、M は 一定 → 時間で 微分',600,215,{size:26,color:CH})+arrow(600,228,600,262,{color:CH,w:4,head:12}));
  s+=fade(seg(p,.4,.55),T(`${cc(CV,'\\mathbf v_G')}=\\dfrac{m_1${cc(CV,'\\mathbf v_1')}+m_2${cc(CV,'\\mathbf v_2')}}{M}`,600,360,{size:56}));
  return s;
 },
 [K+'mvg']:(p)=>{
  let s=T(`${cc(CV,'\\mathbf v_G')}=\\dfrac{m_1${cc(CV,'\\mathbf v_1')}+m_2${cc(CV,'\\mathbf v_2')}}{M}`,600,110,{size:44});
  s+=fade(seg(p,.05,.2),L('両辺 × M',600,200,{size:24,color:CH})+arrow(600,210,600,240,{color:CH,w:4,head:12}));
  s+=fade(seg(p,.15,.35),T(`M${cc(CV,'\\mathbf v_G')}=m_1${cc(CV,'\\mathbf v_1')}+m_2${cc(CV,'\\mathbf v_2')}`,520,300,{size:48}));
  s+=fade(seg(p,.4,.55),T(`=${p1}+${p2}`,520,390,{size:48}));
  s+=card(860,330,280,120,T(`=${P}`,1000,395,{size:56}),seg(p,.65,.8),CP);
  return s;
 },
 [K+'mag']:(p)=>{
  let s=T(`M${cc(CV,'\\mathbf v_G')}=${P}`,600,90,{size:44});
  s+=fade(seg(p,.05,.2),L('もう一度 微分',620,160,{size:24,color:CH,anchor:'start'})+arrow(600,135,600,175,{color:CH,w:4,head:12}));
  s+=fade(seg(p,.15,.3),T(`M${cc(C.a,'\\mathbf a_G')}=${dd(P)}`,600,250,{size:50}));
  s+=fade(seg(p,.45,.6),L('dP/dt ＝ F外 を 入れる',600,345,{size:24,color:CH}));
  s+=card(330,375,540,110,seq([{t:`M${cc(C.a,'\\mathbf a_G')}=${FX}`},{j:'外'}],600,435,56),seg(p,.6,.75),CX);
  return s;
 },
 [K+'mean']:(p)=>{
  // a dumbbell flying: centre on a parabola, rotating
  const N=6;let s='';
  const Gp=u=>[110+u*560,430-4*260*u*(1-u)];
  s+=draw(Array.from({length:61},(_,i)=>Gp(i/60)),seg(p,.1,.5),{color:CG,w:3,dash:'8 7'});
  for(let i=0;i<N;i++){const u=i/(N-1),g=seg(p,.1+i*.07,.17+i*.07),[gx,gy]=Gp(u),th=i*1.1;
   const ax=gx-40*Math.cos(th),ay=gy-40*Math.sin(th),bx=gx+80*Math.cos(th),by=gy+80*Math.sin(th);
   s+=fade(g*(.4+.6*(i===N-1||i===0)),line(ax,ay,bx,by,{color:CD,w:4})+dot(ax,ay,16,'#9aabc7')+dot(bx,by,11,'#9aabc7')+dot(gx,gy,7,CG));}
  s+=card(760,100,400,300,L('中級の 式を 導けた',960,155,{size:26,color:OK,weight:700})+L('重心は',960,220,{size:26})+L('全質量が 1点に 集まり',960,265,{size:26,color:CG})+L('外力の 和だけを 受ける',960,310,{size:26,color:CX})+L('ように 動く',960,355,{size:26}),seg(p,.5,.65),CG);
  return s;
 },
 [K+'vgnum']:(p)=>{
  const {x1,x2}=collide(.15);
  let s=posDir()+track()+carts(x1,x2)+gMark((2*x1+x2)/3);
  s+=card(80,90,1040,170,T(`${cc(CV,'v_G')}=\\dfrac{2\\times 3+1\\times 0}{3}=2\\;\\mathrm{m/s}`,600,150,{size:44})+fade(seg(p,.55,.7),L('後：くっついた 2台と 同じ 2 m/s',600,230,{size:28,color:CV,weight:700})),1);
  return s;
 },
 [K+'anim']:(p)=>{
  const u=seg(p,.05,.9),{x1,x2}=collide(u),xg=(2*x1+x2)/3;
  let s=posDir()+track()+carts(x1,x2);
  // equally spaced trail of G
  for(let k=0;k<=10;k++){const uu=k/10;if(uu>u)break;const c=collide(uu);s+=dot((2*c.x1+c.x2)/3,GY-110,5,CG,.6);}
  s+=gMark(xg);
  s+=fade(seg(p,.4,.5),L('ぶつかる 前も 最中も 後も',600,130,{size:28,color:CG,weight:700})+L('重心は 同じ 速さ 2 m/s',600,180,{size:28,color:CG}));
  return s;
 },
 // ===== S6 まとめ・次 =====
 [K+'sum']:(p)=>{
  let s=L('まとめ',600,80,{size:30,color:CD});
  s+=fade(seg(p,.05,.2),check(90,150,10)+L('2本の 運動方程式を 足す',120,160,{anchor:'start',size:28}));
  s+=fade(seg(p,.25,.4),check(90,230,10)+L('作用・反作用で 内力が 組ごとに 消える',120,240,{anchor:'start',size:28,color:CF}));
  s+=fade(seg(p,.5,.65),check(90,350,10)+L('残るのは',120,360,{anchor:'start',size:28})+seq([{t:`${dd(P)}=${FX}`},{j:'外'}],260,355,42,{anchor:'start'}));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=L('まとめ',600,80,{size:30,color:CD});
  s+=check(90,150,10)+L('外力の 和が 0 → P は 一定（運動量 保存）',120,160,{anchor:'start',size:28,color:CP});
  s+=fade(seg(p,.15,.3),check(90,250,10)+L('重心：',120,260,{anchor:'start',size:28})+seq([{t:`M\\,${cc(C.a,'\\mathbf a_G')}=${FX}`},{j:'外'}],230,255,42,{anchor:'start'}));
  s+=fade(seg(p,.5,.65),check(90,350,10,BAD)+L('運動エネルギーは 別に 調べる（9 J → 6 J）',120,360,{anchor:'start',size:28,color:CK}));
  return s;
 },
 [K+'next1']:(p)=>{
  // bounce (e=0.5, video 2): after contact v1'=1.5, v2'=3 m/s (px: 400 and 800 per unit; before 3 m/s = 800)
  const u=seg(p,.05,.95);let x1,x2;
  if(u<=.4){x1=150+800*u;x2=600;}else{x1=470+400*(u-.4);x2=600+800*(u-.4);}
  let s=track()+carts(x1,x2);
  s+=fade(seg(p,.5,.65),L('くっつかずに 跳ね返る ことも',600,140,{size:30,color:CH,weight:700}));
  return s;
 },
 [K+'next2']:(p)=>{
  let s=card(100,90,1000,330,L('跳ね返る 衝突の 後の 2つの 速度',600,145,{size:28,color:CD})
   +T(`2${cc(CV,"v_1'")}+1\\,${cc(CV,"v_2'")}=6`,600,230,{size:48})+L('運動量 保存：1本',600,290,{size:26,color:CP})
   +fade(seg(p,.35,.5),L('未知数は 2つ → もう 1本は？',600,370,{size:34,color:CH,weight:700})),1,CH);
  return s;
 },
};

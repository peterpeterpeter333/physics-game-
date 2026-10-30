// YouTube シリーズ「積分・中級 3/3」(ys-um-sum-to-integral-3) — 図。Stage 1200×515.
// 色：高さ f 紫、幅 dx・時刻 t 金、たまった面積 A・原始関数 F・位置 x 水色、積分定数 C 黄、増えた短冊 黄、誤差の小三角形 赤、正しい 緑。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,arrow,brace,highlight,axes,tex,texWidth,poly,draw} from './anim.mjs';
import {G,fline,strips,bigTri,widthMark,card,T,cc,cV,cT,cX,cH} from './yt1-um-sum-to-integral-1-diagrams.mjs';

const K='um-sum-to-integral-3:';
const ok=C.F,bad=C.a,cA=s=>cc(C.a,s);
const areaTo=(A,x,o={})=>x>1e-3?poly([[A.X(0),A.Y(0)],[A.X(x),A.Y(0)],[A.X(x),A.Y(x)]],{fill:C.x,fo:.3,stroke:'none',...o}):'';
const edge=(A,x,text='x',g=1)=>fade(g,line(A.X(x),A.Y(0)+14,A.X(x),A.Y(4.5),{color:C.hi,w:2,dash:'6 6'})+label(text,A.X(x),A.Y(4.5)-10,{size:26,color:C.hi,anchor:'middle',weight:700}));
// the new strip between x and x+d (top follows the line), with its small top triangle
function newStrip(A,x,d,{g=1,tri=0}={}){
 let s=rect(A.X(x),A.Y(x),A.X(x+d)-A.X(x),A.Y(0)-A.Y(x),{fill:C.hi,fo:.35,stroke:C.hi,sw:2,rx:0});
 s+=fade(tri,poly([[A.X(x),A.Y(x)],[A.X(x+d),A.Y(x)],[A.X(x+d),A.Y(x+d)]],{fill:bad,fo:.7,stroke:bad,sw:1.5}));
 return fade(g,s);
}
// y = x²/2 + c family on an x–y plane
const FA=(o={})=>axes({x:110,y:450,w:470,h:360,xmax:4.6,ymin:0,ymax:12.5,xticks:[1,2,3,4],yticks:[2,4,6,8,10,12],grid:true,xlabel:'x',ylabel:'',xcolor:C.t,...o});
const par=(A,c,o={})=>A.plot(x=>x*x/2+c,{from:0,to:Math.min(4.4,Math.sqrt(2*(12.3-c))),color:C.x,w:3,...o});

export const ytUmSumInt3Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  const A=G();let s=A.svg+bigTri(A)+fline(A);
  s+=fade(seg(p,.05,.3),T(cH('\\int_0^4')+cV('x')+'\\,'+cT('dx'),860,170,{size:52})+T('=\\lim_{n\\to\\infty}\\left(8-\\dfrac{8}{n}\\right)',900,280,{size:44})+T('='+cX('8'),900,380,{size:52}));
  return s;
 },
 [K+'question']:(p)=>{
  const A=G({x:90,y:470,w:330,h:230,xmax:4.6,yticks:[2,4],xticks:[2,4]});
  let s=A.svg+strips(A,16,{fo:.3})+fline(A,1,{w:3});
  s+=fade(seg(p,.3,.45),line(A.X(0),A.Y(4.2),A.X(4.2),A.Y(0),{color:bad,w:5})+line(A.X(0),A.Y(0),A.X(4.2),A.Y(4.2),{color:bad,w:5}));
  s+=card(520,140,640,240,label('今回の問い',840,195,{size:26,color:C.dim,anchor:'middle'})+label('短冊を 数えずに',840,265,{size:32,color:C.ink,anchor:'middle'})+label('8 を 出せる？',840,325,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  return s;
 },
 // ===== S2 たまった面積の増え方 =====
 [K+'A']:(p)=>{
  const A=G();const x=mix(1.2,2.5,seg(p,.1,.5));
  let s=A.svg+areaTo(A,x)+fline(A)+edge(A,x,'x');
  s+=fade(seg(p,.1,.3),label('A(x)',A.X(x*.68),A.Y(x*.22)+10,{size:30,color:C.x,anchor:'middle',weight:700}));
  s+=card(720,120,440,270,T(cX('A(x)')+'='+cH('\\int_0^{x}')+cV('f(s)')+'\\,'+cT('ds'),940,200,{size:48})
   +label('0 から x までの 面積',940,290,{size:28,color:C.x,anchor:'middle'})+fade(seg(p,.55,.7),label('上端を 変数にした 積分',940,345,{size:26,color:C.hi,anchor:'middle'})),seg(p,.02,.15));
  return s;
 },
 [K+'grow']:(p)=>{
  const A=G();const x=2.5,d=.35*seg(p,.1,.45);
  let s=A.svg+areaTo(A,x)+(d>.01?newStrip(A,x,d):'')+fline(A)+edge(A,x,'x');
  s+=fade(seg(p,.4,.55),widthMark(A,x,x+.35,'dx'));
  s+=card(720,150,440,200,label('右端を dx だけ 右へ',940,215,{size:30,color:C.ink,anchor:'middle'})+fade(seg(p,.55,.7),label('短冊 1本分 だけ 増える',940,285,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.02,.15));
  return s;
 },
 [K+'grow2']:(p)=>{
  const A=G();const x=2.5,d=.35;
  let s=A.svg+areaTo(A,x)+newStrip(A,x,d,{tri:seg(p,.6,.75)})+fline(A)+edge(A,x,'x')+widthMark(A,x,x+d,'dx');
  s+=fade(seg(p,.05,.2),line(A.X(x)-10,A.Y(x),A.X(x)-10,A.Y(0),{color:C.v,w:5})+label('f(x)',A.X(x)-18,A.Y(x/2),{size:26,color:C.v,anchor:'end',weight:700}));
  s+=fade(seg(p,.25,.45),T('\\approx'+cV('f(x)')+'\\,'+cT('dx'),960,200,{size:52}));
  s+=fade(seg(p,.25,.45),label('増え',760,212,{size:30,color:C.hi,weight:700}));
  s+=fade(seg(p,.65,.8),label('上の小さな三角形の分だけ ずれる',940,320,{size:26,color:bad,anchor:'middle'})+label('→ ほぼ（≈）',940,365,{size:28,color:bad,anchor:'middle',weight:700}));
  return s;
 },
 [K+'num']:(p)=>{
  const A=G();let s=A.svg+areaTo(A,2)+fline(A)+edge(A,2,'2');
  s+=fade(seg(p,.3,.5),newStrip(A,2,.1)+edge(A,2.1,'',1));
  s+=card(720,110,440,320,T(cX('A(x)')+'=\\tfrac12 x^2',940,165,{size:40})+label('（三角形の面積）',940,205,{size:22,color:C.dim,anchor:'middle'})
   +fade(seg(p,.2,.35),T(cX('A(2)')+'=2',790,265,{size:40,anchor:'start'}))
   +fade(seg(p,.4,.55),T(cX('A(2.1)')+'=2.205',790,330,{size:40,anchor:'start'}))
   +fade(seg(p,.65,.8),label('増え ＝ 0.205',940,405,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.02,.15));
  return s;
 },
 [K+'num2']:(p)=>{
  // schematic magnification of the strip from 2 to 2.1 (not to scale)
  const x0=260,y0=440,w=160,h=260,th=60;
  let s=label('2 〜 2.1 の短冊（拡大・模式図）',340,90,{size:24,color:C.dim,anchor:'middle'});
  s+=rect(x0,y0-h,w,h,{fill:C.hi,fo:.3,stroke:C.hi,sw:2,rx:0});
  s+=fade(seg(p,.5,.65),poly([[x0,y0-h],[x0+w,y0-h],[x0+w,y0-h-th]],{fill:bad,fo:.7,stroke:bad,sw:2}));
  s+=draw([[x0-40,y0-h+15],[x0+w+40,y0-h-th-15]],1,{color:C.v,w:4});
  s+=label('高さ f(2) ＝ 2',x0-14,y0-h/2,{size:24,color:C.v,anchor:'end'})+label('幅 0.1',x0+w/2,y0+32,{size:24,color:C.t,anchor:'middle'});
  s+=card(620,120,540,300,T(cV('f(2)')+'\\times'+cT('0.1')+'=0.2',890,190,{size:44})+label('短冊の見積もり（ほぼ同じ）',890,245,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.5,.65),T('0.205-0.2='+cA('0.005'),890,320,{size:44})+label('＝ ½ × 0.1 × 0.1（上の三角形）',890,380,{size:24,color:bad,anchor:'middle'})),seg(p,.02,.15));
  return s;
 },
 [K+'rate']:(p)=>{
  let s=fade(seg(p,.02,.2),T('\\dfrac{0.205}{0.1}=2.05',330,180,{size:56}));
  const rows=[['0.1','2.05'],['0.01','2.005'],['0.001','2.0005']];
  s+=card(640,90,500,300,label('幅',720,140,{size:26,color:C.t,anchor:'middle'})+label('増え ÷ 幅',960,140,{size:26,color:C.hi,anchor:'middle'})
   +rows.map(([a,b],i)=>fade(i===0?1:seg(p,.3+i*.12,.4+i*.12),label(a,720,195+i*55,{size:30,color:C.t,anchor:'middle'})+label(b,960,195+i*55,{size:30,color:C.ink,anchor:'middle'}))).join('')
   +fade(seg(p,.7,.85),label('→ f(2) ＝ 2',960,365,{size:32,color:ok,anchor:'middle',weight:700})),seg(p,.25,.35));
  s+=fade(seg(p,.7,.85),label('幅を 0 に 近づけた 行き先',330,330,{size:28,color:C.hi,anchor:'middle'}));
  return s;
 },
 [K+'ftc']:(p)=>{
  const A=G();const x=mix(1,3.6,seg(p,.02,.9));
  let s=A.svg+areaTo(A,x)+newStrip(A,x,.2)+fline(A)+edge(A,x,'x');
  s+=card(720,120,440,300,T(cX("A'(x)")+'='+cV('f(x)'),940,200,{size:60})
   +fade(seg(p,.35,.5),label('たまった面積の 増える速さ',940,290,{size:28,color:C.x,anchor:'middle'})+label('＝ 今の 右端の 高さ',940,340,{size:30,color:C.v,anchor:'middle',weight:700})),seg(p,.02,.15));
  return s;
 },
 [K+'honest']:(p)=>{
  let s=card(200,110,800,130,label('A′(x) ＝ f(x)：図で 納得した 関係',600,188,{size:32,color:C.ink,anchor:'middle'}),seg(p,.02,.15));
  s+=card(200,280,800,130,label('証明ではない → 証明は 上級で',600,358,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 // ===== S3 微分の表を逆から読む =====
 [K+'reverse']:(p)=>{
  let s=T(cX('F'),330,220,{size:80})+T(cV('f'),870,220,{size:80});
  s+=arrow(400,180,800,180,{color:C.dim,w:4,head:16,g:seg(p,.02,.2)})+fade(seg(p,.02,.2),label('微分',600,160,{size:28,color:C.dim,anchor:'middle'}));
  s+=arrow(800,270,400,270,{color:C.hi,w:5,head:18,g:seg(p,.3,.5)})+fade(seg(p,.35,.5),label('積分：微分すると f になる F を 探す',600,320,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('（面積 A も、そういう関数の一つ）',600,420,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'table']:(p)=>{
  let s=fade(seg(p,.02,.15),label('微分・中級',180,150,{size:26,color:C.dim}));
  s+=fade(seg(p,.05,.25),T(cT('t')+'^2\\;\\longrightarrow\\;2'+cT('t'),600,150,{size:56}));
  s+=fade(seg(p,.45,.65),T(cT('x')+'^2\\;\\longrightarrow\\;2'+cT('x'),600,320,{size:56})+label('文字を x に',180,330,{size:26,color:C.dim}));
  s+=fade(seg(p,.05,.25),label('微分',600,105,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'half']:(p)=>{
  let s=T(cT('x')+'^2\\;\\longrightarrow\\;2'+cT('x'),600,130,{size:50});
  s+=fade(seg(p,.05,.3),label('× ½',330,230,{size:30,color:C.hi,anchor:'middle',weight:700})+label('× ½',870,230,{size:30,color:C.hi,anchor:'middle',weight:700})+arrow(420,165,420,280,{color:C.hi,w:3,head:12})+arrow(780,165,780,280,{color:C.hi,w:3,head:12}));
  s+=fade(seg(p,.4,.6),T('\\dfrac{'+cT('x')+'^2}{2}\\;\\longrightarrow\\;'+cT('x'),600,350,{size:60}));
  s+=fade(seg(p,.4,.55),label('微分',600,300,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.1,.25),label('全体を半分 → 傾きも半分',600,480,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'prim']:(p)=>{
  let s=card(150,90,900,170,label('微分すると f になる 関数 F',600,150,{size:32,color:C.ink,anchor:'middle'})+label('＝ f の 原始関数',600,215,{size:36,color:C.x,anchor:'middle',weight:700}),seg(p,.02,.15));
  s+=fade(seg(p,.5,.65),T('\\dfrac{'+cT('x')+'^2}{2}',470,370,{size:60})+label('は',560,382,{size:30,color:C.ink})+T(cT('x'),620,370,{size:56})+label('の 原始関数の 一つ',650,382,{size:30,color:C.ink}));
  return s;
 },
 [K+'plus7']:(p)=>{
  const A=axes({x:110,y:450,w:470,h:360,xmax:4.6,ymin:0,ymax:16,xticks:[1,2,3,4],yticks:[4,8,12,16],grid:true,xlabel:'x',xcolor:C.t});
  let s=A.svg+A.plot(x=>x*x/2,{from:0,to:4.4,color:C.x,w:3.5})+fade(seg(p,.02,.25),A.plot(x=>x*x/2+7,{from:0,to:4.1,color:C.hi,w:3.5}));
  s+=label('x²/2',A.X(4.4)+8,A.Y(9.7),{size:24,color:C.x})+fade(seg(p,.02,.25),label('x²/2 ＋ 7',A.X(3.2),A.Y(14.4),{size:24,color:C.hi,anchor:'end'}));
  const tg=(c)=>line(A.X(1),A.Y(2+c-2),A.X(3),A.Y(2+c+2),{color:C.v,w:3,dash:'8 6'});
  s+=fade(seg(p,.3,.45),tg(0)+tg(7)+dot(A.X(2),A.Y(2),8,C.v)+dot(A.X(2),A.Y(9),8,C.v));
  s+=card(680,130,480,240,label('x ＝ 2 での 傾き',920,185,{size:28,color:C.ink,anchor:'middle'})+label('どちらも 2（平行）',920,240,{size:30,color:C.v,anchor:'middle',weight:700})
   +fade(seg(p,.55,.7),label('定数 7 は 変化しない',920,305,{size:26,color:C.dim,anchor:'middle'})+label('→ 微分すると 0',920,345,{size:28,color:C.hi,anchor:'middle'})),seg(p,.3,.45));
  return s;
 },
 [K+'lose']:(p)=>{
  const A=axes({x:110,y:450,w:470,h:360,xmax:3.6,ymin:0,ymax:12,xticks:[1,2,3],yticks:[5,10],grid:true,xlabel:'時刻 t [s]',ylabel:'位置 x [m]',xcolor:C.t,ycolor:C.x});
  let s=A.svg+A.plot(t=>2*t,{from:0,to:3.3,color:C.x,w:3.5})+A.plot(t=>5+2*t,{from:0,to:3.3,color:C.hi,w:3.5});
  s+=label('x ＝ 2t',A.X(3.3)+8,A.Y(6.6)+8,{size:24,color:C.x})+label('x ＝ 5 ＋ 2t',A.X(2.2),A.Y(11),{size:24,color:C.hi,anchor:'end'});
  s+=card(680,120,480,270,label('初級（微分方程式の回）',920,160,{size:24,color:C.dim,anchor:'middle'})+T('\\dfrac{d'+cX('x')+'}{d'+cT('t')+'}=2',920,250,{size:40})+label('どちらも 満たす',920,315,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.6,.75),label('微分は 出発点の情報を 消す',920,365,{size:28,color:bad,anchor:'middle',weight:700})),seg(p,.02,.15));
  return s;
 },
 [K+'family']:(p)=>{
  const A=FA();let s=A.svg;
  [-2,0,2,4,6].forEach((c,i)=>{s+=fade(seg(p,.02+i*.06,.1+i*.06),A.plot(x=>x*x/2+c,{from:Math.sqrt(Math.max(0,-2*c)),to:Math.min(4.4,Math.sqrt(2*(12.3-c))),color:C.x,w:3}));});
  s+=fade(seg(p,.3,.45),label('F ＋ C（C をいろいろ）',A.X(2.3),A.Y(12.5)-6,{size:24,color:C.x,anchor:'middle'}));
  s+=card(660,110,500,300,label('不定積分 ＝ 原始関数の 家族',910,165,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.5,.65),T(cH('\\int')+cV('f(x)')+'\\,'+cT('dx')+'='+cX('F(x)')+'+'+cH('C'),910,265,{size:46})),seg(p,.3,.45));
  return s;
 },
 [K+'C']:(p)=>{
  const src=cH('\\int')+cV('f(x)')+'\\,'+cT('dx')+'='+cX('F(x)')+'+'+cH('C'),w=texWidth(src,64,false),xr=600+w/2;
  let s=T(src,600,170,{size:64});
  s+=fade(seg(p,.05,.2),highlight(xr-52,118,64,80,1)+arrow(xr-20,330,xr-20,215,{color:C.hi,w:3,head:12}));
  s+=fade(seg(p,.1,.25),label('積分定数',xr-20,370,{size:34,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('初級：名前だけ出した（微分方程式の回）',600,450,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },

 // ===== S4 定積分＝F(b)−F(a) =====
 [K+'Aprim']:(p)=>{
  const A=G({x:90,y:450,w:380,h:300});let s=A.svg+areaTo(A,3)+fline(A)+edge(A,3,'x');
  const B=FA({x:620,w:430,h:330,xlabel:'x'});
  s+=fade(seg(p,.05,.25),B.svg+par(B,0)+label('A(x) ＝ x²/2',B.X(3.7),B.Y(11.5),{size:24,color:C.x,anchor:'end'}));
  s+=fade(seg(p,.3,.45),label('微分すると f → 原始関数の一つ',840,60,{size:26,color:C.x,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),dot(B.X(0),B.Y(0),10,C.hi)+label('A(0) ＝ 0',B.X(0.25),B.Y(2.2),{size:26,color:C.hi,weight:700}));
  return s;
 },
 [K+'shift']:(p)=>{
  const A=FA();let s=A.svg+par(A,0)+fade(seg(p,.02,.15),par(A,3,{color:C.hi}));
  s+=label('C ＝ 0',A.X(2.3),A.Y(2.6)+34,{size:24,color:C.x})+fade(seg(p,.02,.15),label('C ＝ 3',A.X(1.4),A.Y(4)-18,{size:24,color:C.hi,anchor:'end'}));
  const bar=(c,col,g,dx)=>fade(g,dot(A.X(0),A.Y(c),8,col)+dot(A.X(4),A.Y(8+c),8,col)+line(A.X(4)+dx,A.Y(c),A.X(4)+dx,A.Y(8+c),{color:col,w:5})+line(A.X(0),A.Y(c),A.X(4)+dx,A.Y(c),{color:col,w:1.5,dash:'5 6'}));
  s+=bar(0,C.x,seg(p,.25,.4),24)+bar(3,C.hi,seg(p,.5,.65),48);
  s+=card(680,130,480,260,label('x：0 → 4',920,180,{size:26,color:C.t,anchor:'middle'})
   +fade(seg(p,.25,.4),label('C ＝ 0：0 → 8（＋8）',920,250,{size:30,color:C.x,anchor:'middle'}))
   +fade(seg(p,.5,.65),label('C ＝ 3：3 → 11（＋8）',920,310,{size:30,color:C.hi,anchor:'middle'}))
   +fade(seg(p,.75,.9),label('増え方は 同じ',920,365,{size:28,color:ok,anchor:'middle',weight:700})),seg(p,.02,.15));
  return s;
 },
 [K+'FbFa']:(p)=>{
  let s=fade(seg(p,.02,.2),T(cX('A(4)-A(0)')+'='+cX('F(4)-F(0)'),600,110,{size:48}));
  s+=fade(seg(p,.3,.5),T('('+cX('F(b)')+'+'+cH('C')+')-('+cX('F(a)')+'+'+cH('C')+')='+cX('F(b)-F(a)'),600,230,{size:46}));
  s+=fade(seg(p,.5,.65),label('同じ C を引くので 消える',600,300,{size:26,color:C.hi,anchor:'middle'}));
  const src=cH('\\int_a^b')+cV('f(x)')+'\\,'+cT('dx')+'='+cX('F(b)-F(a)'),w=texWidth(src,58,false);
  s+=fade(seg(p,.6,.8),T(src,600,405,{size:58})+highlight(600-w/2-26,340,w+52,125,1));
  return s;
 },

 [K+'calc']:(p)=>{
  const a=cH('\\int_0^4')+cV('x')+'\\,'+cT('dx'),b='=\\dfrac{4^2}{2}-\\dfrac{0^2}{2}',c='=8-0='+cX('8');
  const wa=texWidth(a,56,false),wb=texWidth(b,56,false),wc=texWidth(c,56,false),x0=600-(wa+wb+wc+30)/2;
  let s=T(a,x0,210,{size:56,anchor:'start'});
  s+=fade(seg(p,.05,.25),T(b,x0+wa+15,210,{size:56,anchor:'start'}));
  s+=fade(seg(p,.3,.45),T(c,x0+wa+wb+30,210,{size:56,anchor:'start'}));
  s+=fade(seg(p,.55,.7),label('短冊を数えずに、前回と 同じ 8',600,390,{size:32,color:ok,anchor:'middle',weight:700}));
  return s;
 },

 [K+'quiz']:(p)=>{
  let s=label('確認',600,90,{size:30,color:C.hi,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.2),T(cH('\\int_2^4')+cV('x')+'\\,'+cT('dx')+'=\\;?',600,260,{size:70}));
  return s;
 },
 [K+'quiz2']:(p)=>{
  let s=label('確認',600,80,{size:30,color:C.hi,anchor:'middle',weight:700});
  s+=T(cH('\\int_2^4')+cV('x')+'\\,'+cT('dx')+'=\\dfrac{4^2}{2}-\\dfrac{2^2}{2}=8-2='+cX('6'),600,210,{size:56});
  s+=fade(seg(p,.5,.65),label('上端の値 − 下端の値（下端を 必ず引く）',600,380,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'check']:(p)=>{
  const A=G();let s=A.svg+fade(seg(p,.02,.2),poly([[A.X(2),A.Y(0)],[A.X(4),A.Y(0)],[A.X(4),A.Y(4)],[A.X(2),A.Y(2)]],{fill:C.x,fo:.35,stroke:C.x,sw:2}))+fline(A);
  s+=fade(seg(p,.1,.25),label('2',A.X(2)-12,A.Y(1)+8,{size:26,color:C.v,anchor:'end',weight:700})+label('4',A.X(4)+12,A.Y(2)+8,{size:26,color:C.v,weight:700})+widthMark(A,2,4,'幅 2'));
  s+=card(720,150,440,200,label('台形',940,185,{size:28,color:C.dim,anchor:'middle'})+T('\\dfrac{2+4}{2}\\times2='+cX('6'),940,290,{size:44}),seg(p,.25,.4));
  s+=fade(seg(p,.6,.75),label('○ 一致',940,410,{size:32,color:ok,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S5 物理に戻る：初期条件 =====
 [K+'phys']:(p)=>{
  const A=G({mode:0});let s=A.svg+fline(A)+T(cV('v')+'='+cT('t'),A.X(1.6),A.Y(3.9),{size:44});
  s+=card(720,150,440,200,label('t：時刻 [s]',760,215,{size:30,color:C.t})+label('x：位置 [m]',760,275,{size:30,color:C.x})+label('（ここから 物理の文字）',760,325,{size:22,color:C.dim}),seg(p,.1,.25));
  return s;
 },
 [K+'xt']:(p)=>{
  let s=fade(seg(p,.02,.2),T('\\dfrac{'+cT('t')+'^2}{2}\\;\\longrightarrow\\;'+cT('t'),600,150,{size:56})+label('t で微分',420,160,{size:26,color:C.dim,anchor:'end'}));
  s+=fade(seg(p,.4,.6),T(cX('x')+'=\\dfrac{'+cT('t')+'^2}{2}+'+cH('C'),600,340,{size:70}));
  return s;
 },
 [K+'undecided']:(p)=>{
  const A=FA({xlabel:'時刻 t [s]',ylabel:'位置 x [m]',ycolor:C.x});let s=A.svg;
  [0,1.5,3,4.5,6].forEach((c,i)=>{s+=fade(seg(p,.02+i*.06,.1+i*.06),par(A,c,{w:2.5}));});
  s+=card(680,150,480,200,label('どの C でも 速度は t',920,210,{size:30,color:C.v,anchor:'middle'})+fade(seg(p,.45,.6),label('速度だけでは 1本に 決まらない',920,280,{size:28,color:bad,anchor:'middle',weight:700})),seg(p,.3,.45));
  return s;
 },
 [K+'ic']:(p)=>{
  const A=FA({xlabel:'時刻 t [s]',ylabel:'位置 x [m]',ycolor:C.x});let s=A.svg;
  [0,1.5,4.5,6].forEach(c=>{s+=fade(1-.75*seg(p,.2,.4),par(A,c,{w:2.5}));});
  s+=par(A,3,{color:C.hi,w:4})+fade(seg(p,.05,.2),dot(A.X(0),A.Y(3),11,C.hi)+label('t ＝ 0 で x ＝ 3 m',A.X(0.15),A.Y(1.2),{size:24,color:C.hi,weight:700}));
  s+=card(680,120,480,300,T(cH('C')+'=3',920,185,{size:48})+fade(seg(p,.35,.5),T(cX('x')+'=\\dfrac{'+cT('t')+'^2}{2}+3',920,290,{size:44}))
   +fade(seg(p,.6,.75),label('出発の値 ＝ 初期条件',920,390,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.2,.35));
  return s;
 },
 [K+'ic2']:(p)=>{
  const A=FA({xlabel:'時刻 t [s]',ylabel:'位置 x [m]',ycolor:C.x});let s=A.svg+par(A,3,{color:C.hi,w:4})+dot(A.X(0),A.Y(3),10,C.hi);
  s+=fade(seg(p,.05,.2),dot(A.X(4),A.Y(11),10,C.hi)+label('4 s で 11 m',A.X(4)-14,A.Y(11)-4,{size:24,color:C.hi,anchor:'end'}));
  s+=fade(seg(p,.3,.45),line(A.X(4)+24,A.Y(3),A.X(4)+24,A.Y(11),{color:C.x,w:5})+line(A.X(0),A.Y(3),A.X(4)+24,A.Y(3),{color:C.x,w:1.5,dash:'5 6'})+label('8 m',A.X(4)+34,A.Y(7)+8,{size:26,color:C.x,weight:700}));
  s+=card(680,140,480,230,T('11-3='+cX('8\\,\\mathrm{m}'),920,205,{size:44})+label('変位は C によらない',920,275,{size:28,color:C.x,anchor:'middle'})
   +fade(seg(p,.6,.75),label('＝ 定積分の 8',920,335,{size:30,color:ok,anchor:'middle',weight:700})),seg(p,.3,.45));
  return s;
 },
 [K+'roles']:(p)=>{
  let s=card(110,130,470,260,T(cH('C'),345,210,{size:60})+label('積分定数',345,290,{size:30,color:C.hi,anchor:'middle',weight:700})+label('出発点を表す（初期条件で決まる）',345,340,{size:24,color:C.dim,anchor:'middle'}),seg(p,.02,.15),C.hi);
  s+=card(620,130,470,260,T(cH('\\int_a^b'),855,200,{size:46})+label('上端・下端',855,290,{size:30,color:C.t,anchor:'middle',weight:700})+label('集計する範囲を表す',855,340,{size:24,color:C.dim,anchor:'middle'}),seg(p,.3,.45));
  s+=fade(seg(p,.6,.75),label('役割が 違う 二つ',600,460,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  let s=label('まとめ',600,70,{size:30,color:C.hi,anchor:'middle',weight:700});
  s+=card(150,105,900,110,label('面積の増える速さ ＝ 今の高さ（A′ ＝ f）',600,172,{size:30,color:C.x,anchor:'middle'}),seg(p,.02,.15));
  s+=card(150,240,900,110,label('→ 微分の表を 逆から読んで 計算',600,307,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'sum2']:(p)=>{
  const rows=[['不定積分','∫f(x)dx ＝ F(x) ＋ C',C.x],['定積分','∫ₐᵇ f(x)dx ＝ F(b) − F(a)',C.x],['C の決め方','初期条件（出発の値）',C.hi]];
  let s=label('まとめ',600,70,{size:30,color:C.hi,anchor:'middle',weight:700});
  rows.forEach(([a,b,col],i)=>{s+=card(150,105+i*110,900,90,label(a,190,160+i*110,{size:28,color:C.ink})+label(b,1010,160+i*110,{size:30,color:col,anchor:'end',weight:700}),seg(p,.02+i*.2,.12+i*.2));});
  return s;
 },
 [K+'next1']:(p)=>{
  let s=card(200,120,800,200,label('ここまでの微分',600,160,{size:28,color:C.dim,anchor:'middle'})+T(cT('t')+'^2,\\;\\;\\dfrac{'+cT('t')+'^2}{2}',600,270,{size:48}),seg(p,.02,.15));
  s+=fade(seg(p,.5,.65),label('簡単な式',600,390,{size:30,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'next2']:(p)=>{
  let s=label('次の問い',600,80,{size:28,color:C.dim,anchor:'middle'});
  s+=card(120,120,450,230,label('中に式が入った関数',345,175,{size:28,color:C.ink,anchor:'middle'})+T('(2'+cT('t')+'+1)^2',345,270,{size:52}),seg(p,.05,.2));
  s+=card(630,120,450,230,label('掛け算の関数',855,175,{size:28,color:C.ink,anchor:'middle'})+T('f\\,g',855,270,{size:56}),seg(p,.3,.45));
  s+=fade(seg(p,.55,.7),label('傾きは どう求める？',600,440,{size:36,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
};

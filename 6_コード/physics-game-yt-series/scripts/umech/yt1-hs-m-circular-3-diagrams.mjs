// 高校編「円運動と万有引力・深く学ぶ 3/3」(ys-hs-m-circular-3) — 図。Stage 1200×515.
// v＝√(GM/r)、GM＝gR²、地表すれすれ 7.9 km/s・約 85 分、ISS 7.7 km/s・約 93 分、T²＝(4π²/GM)r³、月 60 倍 → 465 倍 → 27.3 日。
// 色：力 F 緑、速度 v 紫、周期 T 金、半径 水色、強調 黄、誤り 赤。g＝9.8、R＝6.4×10⁶ m。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,tex} from './anim.mjs';
import {card,TF,V,earth,moon} from './yt1-hs-m-circular-1-diagrams.mjs';
import {FA,Ft,cross,okMark,cannonScene} from './yt1-hs-m-circular-2-diagrams.mjs';
import {table} from './yt1-hs-m-force-1-diagrams.mjs';

const K='hs-m-circular-3:';
const RX=900;
const TT=`{\\color{${C.t}}T}`, RR=`{\\color{${C.x}}R}`, Rr=`{\\color{${C.x}}r}`, Gg=`{\\color{${C.a}}g}`;
const dim=src=>`{\\color{${C.faint}}${src}}`;
// ---- earth + satellite on a circular orbit (top-down, not to scale) --------------------------------
const E={x:300,y:262,R:140};
function sat(x,y){return rect(x-13,y-8,26,16,{fill:'#c9d3e6',fo:1,stroke:'none',rx:3})+rect(x-32,y-5,16,10,{fill:'#4a7bd0',fo:1,stroke:'none',rx:1})+rect(x+16,y-5,16,10,{fill:'#4a7bd0',fo:1,stroke:'none',rx:1});}
function satScene({g=1,ph=1.2,ro=190,vel=0,F=0,rl=0,ftxt='万有引力',eR=110,orbit=1}={}){
 const sx=E.x+ro*Math.cos(ph),sy=E.y-ro*Math.sin(ph),u=[-Math.sin(ph),-Math.cos(ph)];
 let s=fade(g,earth(E.x,E.y,eR).replace(/opacity=".8[05]?"/g,'opacity=".45"'))+fade(g*orbit,ring(E.x,E.y,ro,{color:C.faint,w:2,dash:'6 7'}));
 if(rl)s+=fade(g*rl,line(E.x,E.y,sx,sy,{color:C.x,w:3})+dot(E.x,E.y,5,C.ink)+label('r',(E.x+sx)/2+12,(E.y+sy)/2+22,{size:28,color:C.x,weight:700}));
 if(vel)s+=arrow(sx,sy,sx+100*u[0],sy+100*u[1],{color:C.v,w:5,head:16,g:g*vel});
 if(F)s+=FA(sx,sy,sx+(E.x-sx)*.35,sy+(E.y-sy)*.35,{g:g*F,text:ftxt,size:24,dx:0,dy:36,anchor:'middle'});
 s+=fade(g,sat(sx,sy));
 return s;
}
// formula column helpers
const step=(src,y,g,o={})=>fade(g,TF(src,o.x??600,y,{size:o.size??46,...o}));
const note=(t,y,g,x=600,color=C.hi)=>fade(g,label(t,x,y,{size:26,color,anchor:'middle'}));

export const hsCircular3Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p)=>{
  let s=satScene({ph:1.3+1.4*p,vel:1});
  s+=card(680,110,460,230,label('地球の すぐ外を 回るには',RX+10,180,{size:28,color:C.ink,anchor:'middle'})+label('どれだけの 速さ？',RX+10,260,{size:40,color:C.v,anchor:'middle',weight:700}),seg(p,.05,.2),C.v);
  return s;
 },
 [K+'recap']:(p)=>{
  let s=cannonScene({paths:[.62,.78,1.0],ps:[1,1,seg(p,.1,.7)]});
  s+=card(680,110,460,230,label('ニュートンの 大砲',RX+10,180,{size:28,color:C.dim,anchor:'middle'})+label('ある 速さで 一周',RX+10,260,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'plan']:(p)=>{
  let s=card(150,70,900,150,label('万有引力 ＋ 円運動の 式',600,130,{size:30,color:C.ink,anchor:'middle',weight:700})+label('→ 速さ v を 求める',600,185,{size:30,color:C.v,anchor:'middle',weight:700}),seg(p,.05,.2),C.v);
  s+=card(300,270,600,130,label('1周の 時間（周期 T）も',600,345,{size:32,color:C.t,anchor:'middle',weight:700}),seg(p,.5,.65),C.t);
  return s;
 },
 [K+'cond']:(p)=>{
  let s=card(150,60,900,170,label('仮定',600,110,{size:26,color:C.dim,anchor:'middle'})+label('軌道は 円、地球の 重力 だけ',600,180,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.02,.2));
  s+=card(300,270,600,150,TF(Gg+'=9.8\\ \\mathrm{m/s^2}',600,350,{size:50}),seg(p,.45,.6),C.a);
  return s;
 },
 // ================= S2 衛星の速さの式 =================
 [K+'role']:(p)=>{
  let s=satScene({ph:.15+.3*p,vel:1,F:seg(p,.2,.4)});
  s+=card(680,110,460,230,label('衛星の 向心力の 役',RX+10,180,{size:28,color:C.ink,anchor:'middle'})+label('地球が 引く 万有引力',RX+10,260,{size:34,color:C.F,anchor:'middle',weight:700}),seg(p,.3,.45),C.F);
  return s;
 },
 [K+'eq']:(p)=>{
  let s=satScene({ph:.3,vel:1,F:1,g:.6});
  s+=card(640,90,520,170,TF('\\dfrac{GMm}{'+Rr+'^2}=\\dfrac{m'+V+'^2}{'+Rr+'}',RX,180,{size:46}),seg(p,.05,.2),C.F);
  s+=fade(seg(p,.4,.55),label('万有引力',RX-110,300,{size:26,color:C.F,anchor:'middle',weight:700})+label('円運動に 必要な 力',RX+110,300,{size:26,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'cancel']:(p)=>{
  let s=TF('\\dfrac{GMm}{'+Rr+'^2}=\\dfrac{m'+V+'^2}{'+Rr+'}',600,100,{size:50});
  s+=note('両辺を 衛星の 質量 m で 割る',200,seg(p,.1,.25));
  s+=card(370,260,460,160,TF('\\dfrac{GM}{'+Rr+'^2}=\\dfrac{'+V+'^2}{'+Rr+'}',600,345,{size:52}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'mulr']:(p)=>{
  let s=TF('\\dfrac{GM}{'+Rr+'^2}=\\dfrac{'+V+'^2}{'+Rr+'}',600,100,{size:50});
  s+=note('両辺に r を 掛ける',200,seg(p,.1,.25));
  s+=card(370,260,460,160,TF(V+'^2=\\dfrac{GM}{'+Rr+'}',600,345,{size:56}),seg(p,.35,.5),C.v);
  return s;
 },
 [K+'sqrt']:(p)=>{
  let s=TF(V+'^2=\\dfrac{GM}{'+Rr+'}',600,100,{size:50});
  s+=note('v は 正 → 平方根を とる',200,seg(p,.1,.25));
  s+=card(370,250,460,180,TF(V+'=\\sqrt{\\dfrac{GM}{'+Rr+'}}',600,345,{size:58}),seg(p,.35,.5),C.v);
  s+=fade(seg(p,.6,.75),label('（結果）',600,470,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'mass']:(p)=>{
  let s=card(80,80,480,200,TF(V+'=\\sqrt{\\dfrac{GM}{'+Rr+'}}',320,190,{size:50}),1,C.v);
  s+=fade(seg(p,.1,.25),label('m が ない',320,320,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=card(640,80,480,330,label('重い 衛星',880,140,{size:28,color:C.ink,anchor:'middle'})+sat(880,190)+label('軽い 衛星',880,260,{size:28,color:C.ink,anchor:'middle'})+sat(880,310)+label('同じ 半径 → 同じ 速さ',880,385,{size:28,color:C.v,anchor:'middle',weight:700}),seg(p,.4,.55),C.v);
  return s;
 },
 [K+'radius']:(p)=>{
  let s=card(80,80,480,200,TF(V+'=\\sqrt{\\dfrac{GM}{'+Rr+'}}',320,190,{size:50}),1,C.v);
  s+=fade(seg(p,.1,.25),label('r が 大きい → v は 小さい',320,330,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=card(640,110,480,220,label('遠くを 回る 衛星ほど',880,190,{size:28,color:C.ink,anchor:'middle'})+label('ゆっくり 進む',880,260,{size:36,color:C.v,anchor:'middle',weight:700}),seg(p,.45,.6),C.v);
  return s;
 },
 // ================= S3 地表すれすれの速さ =================
 [K+'GM']:(p)=>{
  let s=card(150,70,900,150,label('G と M の 値は 使わない',600,160,{size:36,color:C.ink,anchor:'middle',weight:700}),seg(p,.02,.15));
  s+=card(300,270,600,140,label('代わりに 地表の 重力 mg',600,350,{size:34,color:C.F,anchor:'middle',weight:700}),seg(p,.45,.6),C.F);
  return s;
 },
 [K+'surface']:(p)=>{
  const ex=300,ey=270,R=160,bx=ex+(R+14)*Math.cos(1.1),by=ey-(R+14)*Math.sin(1.1);
  let s=earth(ex,ey,R).replace(/opacity=".8[05]?"/g,'opacity=".45"')+dot(ex,ey,5,C.ink);
  s+=fade(seg(p,.5,.65),line(ex,ey,ex+R*Math.cos(1.1),ey-R*Math.sin(1.1),{color:C.x,w:3})+label('R',ex+R*.5*Math.cos(1.1)+14,ey-R*.5*Math.sin(1.1)+20,{size:30,color:C.x,weight:700}));
  s+=dot(bx,by,12,C.hi)+FA(bx,by,bx-60*Math.cos(1.1),by+60*Math.sin(1.1),{g:seg(p,.05,.2),text:'mg',size:26,dx:-30,dy:0});
  s+=card(640,100,520,180,TF('m'+Gg+'=\\dfrac{GMm}{'+RR+'^2}',RX,195,{size:50}),seg(p,.15,.3),C.F);
  s+=fade(seg(p,.6,.75),label('R：地球の 半径',RX,340,{size:30,color:C.x,anchor:'middle',weight:700}));
  return s;
 },
 [K+'gdiv']:(p)=>{
  let s=TF('m'+Gg+'=\\dfrac{GMm}{'+RR+'^2}',600,100,{size:50});
  s+=note('両辺を m で 割る',200,seg(p,.1,.25));
  s+=card(370,260,460,160,TF(Gg+'=\\dfrac{GM}{'+RR+'^2}',600,345,{size:54}),seg(p,.35,.5),C.a);
  return s;
 },
 [K+'gm']:(p)=>{
  let s=TF(Gg+'=\\dfrac{GM}{'+RR+'^2}',600,90,{size:50});
  s+=note('両辺に R² を 掛ける',180,seg(p,.05,.2));
  s+=card(370,220,460,140,TF('GM='+Gg+RR+'^2',600,295,{size:56}),seg(p,.25,.4),C.hi);
  s+=fade(seg(p,.55,.7),label('測りやすい g と R で 表せた',600,430,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'low']:(p)=>{
  let s=label('地表すれすれ：r ＝ R',600,70,{size:30,color:C.x,anchor:'middle',weight:700});
  s+=step(V+'^2=\\dfrac{GM}{'+Rr+'}',150,seg(p,.3,.42));
  s+=note('GM ＝ gR² を 入れる',235,seg(p,.4,.5));
  s+=step('=\\dfrac{'+Gg+RR+'^2}{'+RR+'}',310,seg(p,.5,.62));
  s+=card(400,370,400,110,TF(V+'^2='+Gg+RR,600,430,{size:50}),seg(p,.7,.82),C.v);
  return s;
 },
 [K+'num']:(p)=>{
  let s=card(140,60,920,130,TF(V+'=\\sqrt{'+Gg+RR+'}=\\sqrt{9.8\\times 6.4\\times 10^6}',600,130,{size:46}),seg(p,.05,.2),C.v);
  s+=card(300,250,600,150,TF('\\approx 7.9\\times 10^3\\ \\mathrm{m/s}',600,330,{size:56,color:C.v}),seg(p,.5,.65),C.v);
  return s;
 },
 [K+'kms']:(p)=>{
  let s=satScene({ph:1.0+1.2*p,ro:150,eR:122,vel:1,F:1,ftxt:''});
  s+=card(680,110,460,230,label('1秒間に 約',RX+10,180,{size:28,color:C.ink,anchor:'middle'})+label('7.9 km',RX+10,260,{size:52,color:C.v,anchor:'middle',weight:700})+label('落ちても 地面に 届かない',RX+10,320,{size:24,color:C.dim,anchor:'middle'}),seg(p,.05,.2),C.v);
  return s;
 },
 [K+'period']:(p)=>{
  let s=satScene({ph:1.0+2*Math.PI*seg(p,.05,.9),ro:150,eR:122,vel:1});
  s+=card(640,80,520,150,TF(TT+'=\\dfrac{2\\pi '+RR+'}{'+V+'}\\approx 5.08\\times 10^3\\ \\mathrm{s}',RX,160,{size:40}),seg(p,.05,.2),C.t);
  s+=card(640,270,520,120,label('約 85 分',RX,350,{size:48,color:C.t,anchor:'middle',weight:700}),seg(p,.45,.6),C.t);
  return s;
 },
 [K+'kmh']:(p)=>{
  let s=satScene({ph:2.2+1.0*p,ro:150,eR:122,vel:1});
  s+=card(640,90,520,140,TF('7.9\\ \\mathrm{km/s}\\times 3600\\ \\mathrm{s}',RX,160,{size:42,color:C.v}),seg(p,.05,.2),C.v);
  s+=card(640,270,520,130,label('時速 約 2万8千 km',RX,350,{size:40,color:C.v,anchor:'middle',weight:700}),seg(p,.45,.6),C.v);
  return s;
 },
 // ================= S4 半径が大きいと =================
 [K+'iss']:(p)=>{
  let s=satScene({ph:1.4+.8*p,ro:180,eR:140,rl:seg(p,.3,.45),vel:1});
  s+=fade(seg(p,.1,.25),label('地上 約 400 km',E.x+40,E.y-150,{size:22,color:C.dim}));
  s+=card(660,110,500,230,label('国際宇宙ステーション',RX+10,180,{size:30,color:C.ink,anchor:'middle',weight:700})+TF(Rr+'\\approx 6.8\\times 10^6\\ \\mathrm{m}',RX+10,265,{size:42}),seg(p,.05,.2),C.x);
  return s;
 },
 [K+'iss2']:(p)=>{
  let s=card(80,70,500,170,TF(V+'^2=\\dfrac{'+Gg+RR+'^2}{'+Rr+'}',330,160,{size:48}),seg(p,.02,.15),C.v);
  s+=card(640,70,480,170,label('速さ',880,125,{size:26,color:C.dim,anchor:'middle'})+label('約 7.7 km/s',880,195,{size:42,color:C.v,anchor:'middle',weight:700}),seg(p,.2,.35),C.v);
  s+=card(640,280,480,170,label('1周',880,335,{size:26,color:C.dim,anchor:'middle'})+label('約 93 分',880,405,{size:42,color:C.t,anchor:'middle',weight:700}),seg(p,.55,.7),C.t);
  s+=card(80,280,500,170,label('地表すれすれ',330,335,{size:26,color:C.dim,anchor:'middle'})+label('7.9 km/s・85 分',330,405,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.7,.82));
  return s;
 },
 [K+'iss3']:(p)=>{
  let s=table({x:250,y:90,cols:[{h:'',color:C.ink,w:220},{h:'r [m]',color:C.x,w:160},{h:'速さ',color:C.v,w:160},{h:'1周',color:C.t,w:150}],rows:[['地表すれすれ','6.4×10⁶','7.9 km/s','約 85 分'],['宇宙ステーション','6.8×10⁶','7.7 km/s','約 93 分']],reveal:[1,seg(p,.1,.25)],size:28,rh:64});
  s+=fade(seg(p,.4,.55),label('半径 約 6% 大 → 少し 遅く、1周 約 8分 長い',600,400,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'three']:(p)=>{
  const t=p*6;let s=earth(E.x,E.y,60);
  [[110,'#c9d3e6'],[165,'#c9d3e6'],[230,'#c9d3e6']].forEach(([r],i)=>{const w=1.6*Math.pow(110/r,1.5),ph=.5+w*t;
   s+=ring(E.x,E.y,r,{color:C.faint,w:2,dash:'6 7'});const x=E.x+r*Math.cos(ph),y=E.y-r*Math.sin(ph);
   if(y>-10&&y<525)s+=dot(x,y,9,C.hi);});
  s+=card(680,110,460,230,label('内側 ほど',RX+10,180,{size:30,color:C.ink,anchor:'middle'})+label('速く、1周が 短い',RX+10,255,{size:36,color:C.v,anchor:'middle',weight:700}),seg(p,.4,.55),C.v);
  return s;
 },
 [K+'mis']:(p)=>{
  const bx=300,by=200;
  let s=rect(bx-150,by-70,300,140,{fill:'#c9d3e6',fo:.18,stroke:'#c9d3e6',rx:16})+dot(bx-40,by,22,C.hi)+rect(bx+30,by-14,50,28,{fill:C.E,fo:.8,stroke:'none',rx:6});
  s+=FA(bx+120,by+70,bx+120,by+160,{g:seg(p,.5,.65),text:'',size:24})+FA(bx-40,by+26,bx-40,by+110,{g:seg(p,.5,.65)});
  s+=fade(seg(p,.6,.75),label('一緒に 落ち続ける',bx,by+200,{size:30,color:C.F,anchor:'middle',weight:700}));
  s+=card(680,90,460,140,label('重力が ない',RX+10,170,{size:32,color:C.a,anchor:'middle',weight:700})+cross(RX+150,160,14),seg(p,.05,.2),C.a);
  s+=card(680,270,460,150,label('ステーションも 中の 人も',RX+10,330,{size:26,color:C.ink,anchor:'middle'})+label('一緒に 落ち続けている',RX+10,385,{size:30,color:C.F,anchor:'middle',weight:700}),seg(p,.5,.65),C.F);
  return s;
 },
 // ================= S5 周期と半径の関係 =================
 [K+'T']:(p)=>{
  let s=label('周期 ＝ 1周の 長さ ÷ 速さ',600,90,{size:28,color:C.dim,anchor:'middle'});
  s+=card(370,170,460,170,TF(TT+'=\\dfrac{2\\pi '+Rr+'}{'+V+'}',600,265,{size:58}),seg(p,.3,.45),C.t);
  return s;
 },
 [K+'sq']:(p)=>{
  let s=TF(TT+'=\\dfrac{2\\pi '+Rr+'}{'+V+'}',600,100,{size:50});
  s+=note('両辺を 2乗',200,seg(p,.1,.25));
  s+=card(370,260,460,160,TF(TT+'^2=\\dfrac{4\\pi^2'+Rr+'^2}{'+V+'^2}',600,345,{size:52}),seg(p,.3,.45),C.t);
  return s;
 },
 [K+'subv']:(p)=>{
  let s=TF(TT+'^2=\\dfrac{4\\pi^2'+Rr+'^2}{'+V+'^2}',600,100,{size:50});
  s+=note('v² ＝ GM ÷ r を 入れる',200,seg(p,.1,.25));
  s+=card(320,250,560,180,TF(TT+'^2=4\\pi^2'+Rr+'^2\\div\\dfrac{GM}{'+Rr+'}',600,345,{size:50}),seg(p,.35,.5),C.t);
  return s;
 },
 [K+'r3']:(p)=>{
  let s=TF(TT+'^2=4\\pi^2'+Rr+'^2\\div\\dfrac{GM}{'+Rr+'}',600,90,{size:46});
  s+=fade(seg(p,.1,.25),label('÷ (GM ÷ r)  ＝  × r ÷ GM',600,190,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=card(340,250,520,180,TF(TT+'^2=\\dfrac{4\\pi^2}{GM}\\,'+Rr+'^3',600,345,{size:58}),seg(p,.5,.65),C.t);
  s+=fade(seg(p,.7,.85),label('（結果）',600,470,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'kepler']:(p)=>{
  let s=card(40,80,370,160,TF(TT+'^2\\propto '+Rr+'^3',225,175,{size:54}),seg(p,.02,.15),C.t);
  s+=table({x:440,y:70,cols:KCOLS,rows:KROWS,reveal:[seg(p,.15,.25),seg(p,.25,.35),seg(p,.35,.45)],size:26,rh:58});
  s+=fade(seg(p,.55,.7),label('ケプラーが 惑星の 観測から 見つけた 法則と 同じ 形',600,450,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S6 月で確かめる =================
 [K+'moon']:(p)=>{
  const ex=110,ey=300,mx=600;
  let s=earth(ex,ey,34)+moon(mx,ey,16)+label('地球',ex,ey+70,{size:22,color:C.dim,anchor:'middle'})+label('月',mx,ey+50,{size:22,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.1,.25),line(ex,ey-70,mx,ey-70,{color:C.x,w:3})+line(ex,ey-82,ex,ey-58,{color:C.x,w:3})+line(mx,ey-82,mx,ey-58,{color:C.x,w:3})+label('3.84×10⁸ m',(ex+mx)/2,ey-90,{size:26,color:C.x,anchor:'middle',weight:700}));
  s+=card(680,110,460,220,label('3.84×10⁸ ÷ 6.4×10⁶',RX+10,185,{size:30,color:C.ink,anchor:'middle'})+label('＝ 60 倍',RX+10,260,{size:44,color:C.x,anchor:'middle',weight:700}),seg(p,.4,.55),C.x);
  return s;
 },
 [K+'ratio']:(p)=>{
  let s=card(80,70,500,170,TF(TT+'^2\\propto '+Rr+'^3',330,130,{size:44})+TF('\\rightarrow\\ '+TT+'\\propto '+Rr+'^{1.5}',330,200,{size:44}),seg(p,.02,.15),C.t);
  s+=card(640,70,500,170,label('r が 60 倍 なら',890,125,{size:26,color:C.dim,anchor:'middle'})+label('T は 60 の 1.5 乗 倍',890,190,{size:30,color:C.t,anchor:'middle',weight:700}),seg(p,.3,.45),C.t);
  s+=card(300,290,600,140,TF('60^{1.5}=60\\times\\sqrt{60}\\approx 465',600,365,{size:46}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'calc']:(p)=>{
  let s=card(150,60,900,130,TF('5.08\\times 10^3\\ \\mathrm{s}\\times 465\\approx 2.36\\times 10^6\\ \\mathrm{s}',600,130,{size:44}),seg(p,.05,.2),C.t);
  s+=fade(seg(p,.25,.4),label('地表すれすれの 周期 × 465',600,240,{size:26,color:C.dim,anchor:'middle'}));
  s+=card(350,290,500,140,label('約 27.3 日',600,380,{size:52,color:C.t,anchor:'middle',weight:700}),seg(p,.5,.65),C.t);
  return s;
 },
 [K+'match']:(p)=>{
  let s=card(80,90,480,200,label('式から',320,150,{size:26,color:C.dim,anchor:'middle'})+label('約 27.3 日',320,235,{size:44,color:C.t,anchor:'middle',weight:700}),seg(p,.02,.15),C.t);
  s+=card(640,90,480,200,label('実際の 月の 周期',880,150,{size:26,color:C.dim,anchor:'middle'})+label('27.3 日',880,235,{size:44,color:C.t,anchor:'middle',weight:700}),seg(p,.1,.25),C.t);
  s+=okMark(600,190,seg(p,.25,.4));
  s+=fade(seg(p,.5,.65),label('衛星も 月も、同じ 1つの 式',600,400,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ans']:(p)=>{
  let s=satScene({ph:1.6+1.2*p,ro:150,eR:122,vel:1,F:1,ftxt:''});
  s+=card(680,100,460,250,label('地表すれすれの 衛星',RX+10,165,{size:28,color:C.ink,anchor:'middle'})+label('横に 約 7.9 km/s',RX+10,245,{size:40,color:C.v,anchor:'middle',weight:700})+label('地面に 届かず 回り続ける',RX+10,310,{size:24,color:C.dim,anchor:'middle'}),seg(p,.05,.2),C.v);
  return s;
 },
 [K+'univ']:(p)=>{
  let s=card(200,110,800,230,label('大学編',600,175,{size:28,color:C.dim,anchor:'middle'})+label('楕円の 軌道も、同じ 万有引力の 法則で',600,255,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25));
  s+=fade(seg(p,.3,.6),`<ellipse cx="600" cy="420" rx="160" ry="60" fill="none" stroke="${C.faint}" stroke-width="2.5" stroke-dasharray="6 7"/>`+dot(520,420,10,'#2f6fd0'));
  return s;
 },
 [K+'next']:(p)=>{
  const wx=120,y=300,x0=520,A=150,x=x0+A*Math.cos(Math.PI*2*Math.max(0,p-.25)*1.2);
  let s=line(wx,y-80,wx,y+60,{color:C.dim,w:4});
  const n=14,pts=[[wx,y]];for(let i=1;i<n;i++)pts.push([wx+(x-30-wx)*i/n,y+(i%2?-18:18)]);pts.push([x-30,y]);
  s+=draw(pts,1,{color:C.dim,w:3})+rect(x-30,y-30,60,60,{fill:C.x,fo:.5,stroke:C.x,rx:8});
  s+=line(x0,y+50,x0,y+80,{color:C.hi,w:3})+label('つり合いの 位置',x0,y+110,{size:22,color:C.hi,anchor:'middle'});
  s+=card(720,110,420,200,label('引いて 離すと',930,180,{size:28,color:C.ink,anchor:'middle'})+label('中心で 止まらず 行き過ぎる',930,250,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'next2']:(p)=>{
  const wx=120,y=300,x0=520,A=150,x=x0+A*Math.cos(Math.PI*2*p*1.5);
  let s=line(wx,y-80,wx,y+60,{color:C.dim,w:4});
  const n=14,pts=[[wx,y]];for(let i=1;i<n;i++)pts.push([wx+(x-30-wx)*i/n,y+(i%2?-18:18)]);pts.push([x-30,y]);
  s+=draw(pts,1,{color:C.dim,w:3})+rect(x-30,y-30,60,60,{fill:C.x,fo:.5,stroke:C.x,rx:8});
  s+=line(x0,y+50,x0,y+80,{color:C.hi,w:3});
  s+=card(720,110,420,200,label('なぜ 行き過ぎて',930,180,{size:30,color:C.ink,anchor:'middle'})+label('また 戻る？',930,250,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'bye']:(p)=>{
  let s=card(200,110,800,230,label('次の 単元',600,175,{size:28,color:C.dim,anchor:'middle'})+label('単振動',600,260,{size:52,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
};
const KCOLS=[{h:'軌道',color:C.ink,w:220},{h:'r [m]',color:C.x,w:150},{h:'T [s]',color:C.t,w:150},{h:'T² ÷ r³',color:C.hi,w:170}];
const KROWS=[['地表すれすれ','6.4×10⁶','5.08×10³','9.8×10⁻¹⁴'],['宇宙ステーション','6.8×10⁶','5.56×10³','9.8×10⁻¹⁴'],['月','3.84×10⁸','2.36×10⁶','9.8×10⁻¹⁴']];

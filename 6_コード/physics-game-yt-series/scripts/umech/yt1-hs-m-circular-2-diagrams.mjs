// 高校編「円運動と万有引力・深く学ぶ 2/3」(ys-hs-m-circular-2) — 図。Stage 1200×515.
// 向心力 mv²/r（張力 4.0 N、車の摩擦 2000 N）、糸が切れると接線の向き、ニュートンの大砲、万有引力 GMm/r²、月の確認。
// 色：力 F 緑（太い矢印）、速度 v 紫、加速度 a 赤、強調 黄、誤り 赤。地面（地球の中心）から見た図だけ。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,poly} from './anim.mjs';
import {card,ball,orbit,O,P,U,arcPts,TF,V,A,earth,moon} from './yt1-hs-m-circular-1-diagrams.mjs';
import {FA} from './yt1-hs-m-force-1-diagrams.mjs';
export {FA};

const K='hs-m-circular-2:';
const RX=900;
export const Ft=`{\\color{${C.F}}F}`, Gc='G';
export const cross=(x,y,r=22,g=1)=>fade(g,line(x-r,y-r,x+r,y+r,{color:C.a,w:5})+line(x-r,y+r,x+r,y-r,{color:C.a,w:5}));
export const okMark=(x,y,g=1)=>fade(g,draw([[x-18,y],[x-4,y+14],[x+20,y-16]],1,{color:C.F,w:5}));
// a ball on the circle with the string pulling it (green, toward the centre)
function pull(phi,{g=1,txt='',vel=1,str=1,len=.62,tdx=0,tdy=-18,anchor='middle'}={}){
 const [x,y]=P(phi);
 let s=orbit({phi,vel,str});
 s+=FA(x,y,x+(O.x-x)*len,y+(O.y-y)*len,{g,text:txt,size:26,dx:tdx,dy:tdy,anchor});
 return s;
}
// ---- Newton's cannon: GM=1, launch radius 1, earth radius .82, scale 200 px ----------------------
export const CN={x:300,y:262,S:195,Rg:.66};
const pathCache=new Map();
export function cannonPath(v){
 if(pathCache.has(v))return pathCache.get(v);
 let x=0,y=1,vx=v,vy=0;const dt=.002,pts=[[0,1]];
 for(let i=0;i<4000;i++){const r=Math.hypot(x,y),a=-1/(r*r*r);vx+=a*x*dt;vy+=a*y*dt;x+=vx*dt;y+=vy*dt;if(i%10===0)pts.push([x,y]);if(Math.hypot(x,y)<CN.Rg)break;if(i*dt>2*Math.PI+.02)break;}
 pathCache.set(v,pts);return pts;
}
const scr=([x,y])=>[CN.x+CN.S*x,CN.y-CN.S*y];
export function cannonScene({g=1,paths=[],ps=[],circ=0,ghost=1}={}){
 let s=fade(g,earth(CN.x,CN.y,CN.S*CN.Rg).replace(/opacity=".8[05]?"/g,'opacity=".45"'));
 const top=CN.y-CN.S*CN.Rg;
 s+=fade(g,poly([[CN.x-46,top+12],[CN.x,CN.y-CN.S+4],[CN.x+46,top+12]],{fill:'#7b6a55',fo:1}));
 paths.forEach((v,i)=>{const pts=cannonPath(v).map(scr);s+=fade(g*ghost,draw(pts,ps[i]??1,{color:v>=1?C.hi:'#d8c27a',w:v>=1?4:3,dash:v>=1?'':'6 7'}));});
 s+=fade(g,ball(CN.x,CN.y-CN.S,{r:11}));
 return s;
}
// ---- earth & moon (not to scale) -------------------------------------------------------------------
export const EM={x:270,y:262,R:190};
export function emScene({g=1,ph=1.0,vel=0,F=0,fall=0,orbitG=1,mr=22,er=40,ftxt=''}={}){
 const mx=EM.x+EM.R*Math.cos(ph),my=EM.y-EM.R*Math.sin(ph),u=[-Math.sin(ph),-Math.cos(ph)];
 let s=fade(g*orbitG,ring(EM.x,EM.y,EM.R,{color:C.faint,w:2.5,dash:'8 8'}))+fade(g,earth(EM.x,EM.y,er)+moon(mx,my,mr));
 if(fall){s+=fade(g*fall,line(mx,my,mx+150*u[0],my+150*u[1],{color:C.dim,w:2,dash:'5 7'})+label('重力が なければ',mx+150*u[0]+(u[0]>0?8:-8),my+150*u[1]-10,{size:22,color:C.dim,anchor:u[0]>0?'start':'end'}));}
 if(vel)s+=arrow(mx,my,mx+110*u[0],my+110*u[1],{color:C.v,w:5,head:16,g:g*vel});
 if(F){const k=.42;s+=FA(mx,my,mx+(EM.x-mx)*k,my+(EM.y-my)*k,{g:g*F,text:ftxt,size:24,dx:ftxt?-20:0,dy:-14,anchor:'end'});}
 return s;
}
// ---- car on a curve (top view) --------------------------------------------------------------------
function carScene({g=1,F=0,lab=0}={}){
 const cx=300,cy=470,R=300;
 let s=fade(g,draw(arcPts(cx,cy,R+40,Math.PI*.2,Math.PI*.8),1,{color:'#5a6680',w:3})+draw(arcPts(cx,cy,R-40,Math.PI*.2,Math.PI*.8),1,{color:'#5a6680',w:3})+draw(arcPts(cx,cy,R,Math.PI*.2,Math.PI*.8),1,{color:C.faint,w:2,dash:'14 14'}));
 const [x,y]=[cx,cy-R];
 s+=fade(g,`<g transform="translate(${x} ${y})">`+rect(-34,-18,68,36,{fill:C.x,fo:.55,stroke:C.x,rx:8})+rect(6,-14,18,28,{fill:'#bfe9ff',fo:.6,stroke:'none',rx:3})+'</g>');
 s+=arrow(x+38,y,x+150,y,{color:C.v,w:5,head:16,g});
 s+=FA(x,y+22,x,y+130,{g:g*F,text:lab?'摩擦力':'',size:26,dx:16,dy:10,anchor:'start'});
 s+=fade(g*F,dot(cx,cy,5,C.dim)+label('カーブの 中心',cx,cy-12,{size:22,color:C.dim,anchor:'middle'}));
 return s;
}
const sphere=(x,y,r,color)=>dot(x,y,r,color)+ring(x,y,r,{color:'#ffffff',w:1.5})+dot(x-r*.3,y-r*.3,r*.25,'#ffffff',.35);

export const hsCircular2Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p)=>{
  let s=orbit({phi:.5+1.8*p,vel:1,acc:1});
  s+=card(680,110,460,230,label('中心向きの 加速度を',RX+10,180,{size:28,color:C.ink,anchor:'middle'})+label('作る 力は？',RX+10,260,{size:42,color:C.F,anchor:'middle',weight:700}),seg(p,.05,.2),C.F);
  return s;
 },
 [K+'q2']:(p)=>{
  let s=emScene({ph:.6+1.0*p});
  s+=card(680,110,460,230,label('月の 場合',RX+10,180,{size:28,color:C.ink,anchor:'middle'})+label('何が その 役を？',RX+10,260,{size:40,color:C.F,anchor:'middle',weight:700}),seg(p,.05,.2),C.F);
  return s;
 },
 [K+'recap']:(p)=>{
  let s=orbit({phi:2.2+1.6*p,vel:1,acc:seg(p,.1,.3)});
  s+=card(680,90,460,170,label('前回：等速円運動',RX+10,135,{size:24,color:C.dim,anchor:'middle'})+TF(A+'=\\dfrac{'+V+'^2}{r}',RX+10,205,{size:50}),seg(p,.15,.3),C.a);
  s+=card(680,290,460,110,label('向き：円の 中心',RX+10,355,{size:30,color:C.a,anchor:'middle',weight:700}),seg(p,.45,.6),C.a);
  return s;
 },
 [K+'frame']:(p)=>{
  let s=orbit({phi:3.0+1.4*p,vel:1,acc:1});
  s+=card(680,130,460,190,label('地面に 止まっている 人',RX+10,200,{size:30,color:C.ink,anchor:'middle',weight:700})+label('から 見て 考える',RX+10,260,{size:28,color:C.dim,anchor:'middle'}),seg(p,.05,.2));
  return s;
 },
 // ================= S2 円運動に必要な力 =================
 [K+'ma']:(p)=>{
  let s=card(330,70,540,170,TF('m'+A+'='+Ft,600,165,{size:66}),seg(p,.02,.15),C.F);
  s+=card(330,290,540,130,label('F：物体が 受ける 力の 合計（合力）',600,365,{size:28,color:C.F,anchor:'middle',weight:700}),seg(p,.45,.6),C.F);
  return s;
 },
 [K+'need']:(p)=>{
  let s=pull(1.0+0.8*p,{g:seg(p,.6,.75),vel:1});
  s+=TF('m'+A+'='+Ft,RX+10,90,{size:44});
  s+=fade(seg(p,.1,.25),label('a に v² ÷ r を 入れる',RX+10,165,{size:26,color:C.hi,anchor:'middle'}));
  s+=card(680,210,460,150,TF(Ft+'=\\dfrac{m'+V+'^2}{r}',RX+10,290,{size:52}),seg(p,.3,.45),C.F);
  s+=fade(seg(p,.6,.75),label('中心向きの 合力が 必要',RX+10,410,{size:30,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'derived']:(p)=>{
  let s=card(200,60,800,150,TF('m'+A+'='+Ft,420,140,{size:44})+label('＋',560,150,{size:36,color:C.ink,anchor:'middle'})+TF(A+'=\\dfrac{'+V+'^2}{r}',720,140,{size:44}),seg(p,.05,.2));
  s+=fade(seg(p,.25,.4),label('↓ 導いた 式（結果）',600,265,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=card(350,300,500,150,TF(Ft+'=\\dfrac{m'+V+'^2}{r}',600,360,{size:46})+label('新しい 法則 ではない',600,428,{size:26,color:C.dim,anchor:'middle'}),seg(p,.45,.6),C.F);
  return s;
 },
 [K+'ex']:(p)=>{
  let s=orbit({phi:-.3+1.4*p,vel:1,rlab:1,vlab:1});
  s+=card(680,100,460,260,label('例',RX+10,150,{size:26,color:C.dim,anchor:'middle'})+label('m ＝ 0.50 kg',RX+10,210,{size:32,color:C.ink,anchor:'middle',weight:700})+label('r ＝ 2.0 m',RX+10,265,{size:32,color:C.ink,anchor:'middle',weight:700})+label('v ＝ 4.0 m/s',RX+10,320,{size:32,color:C.v,anchor:'middle',weight:700}),seg(p,.05,.25));
  return s;
 },
 [K+'tension']:(p)=>{
  let s=pull(1.1+1.0*p,{g:seg(p,.5,.65),txt:'張力 4.0 N',tdx:26,tdy:-4,anchor:'start'});
  s+=card(680,80,460,140,TF(Ft+'=\\dfrac{0.50\\times 4.0^2}{2.0}',RX+10,150,{size:42}),seg(p,.05,.2),C.F);
  s+=card(680,250,460,110,TF('=4.0\\ \\mathrm{N}',RX+10,315,{size:46,color:C.F}),seg(p,.3,.45),C.F);
  s+=fade(seg(p,.6,.75),label('糸が おもりを 引く 張力',RX+10,410,{size:28,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'name']:(p)=>{
  let s=pull(2.3+1.0*p,{txt:'張力',tdx:-14,tdy:-14});
  s+=card(680,90,460,150,label('中心向きに 必要な 合力',RX+10,140,{size:24,color:C.dim,anchor:'middle'})+label('向心力',RX+10,205,{size:44,color:C.F,anchor:'middle',weight:700}),seg(p,.05,.2),C.F);
  s+=card(680,280,460,130,label('役割の 名前',RX+10,335,{size:32,color:C.hi,anchor:'middle',weight:700})+label('（力の 種類 ではない）',RX+10,385,{size:24,color:C.dim,anchor:'middle'}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'car']:(p)=>{
  let s=carScene({F:seg(p,.3,.5),lab:1});
  s+=card(720,120,420,200,label('カーブ を 曲がる 車',930,180,{size:28,color:C.ink,anchor:'middle'})+label('摩擦力 が',930,240,{size:30,color:C.F,anchor:'middle',weight:700})+label('向心力の 役',930,290,{size:30,color:C.F,anchor:'middle',weight:700}),seg(p,.4,.55),C.F);
  return s;
 },
 [K+'car2']:(p)=>{
  let s=carScene({F:1,lab:1});
  s+=card(720,100,420,250,label('m ＝ 1000 kg',930,165,{size:32,color:C.ink,anchor:'middle',weight:700})+label('r ＝ 50 m',930,230,{size:32,color:C.ink,anchor:'middle',weight:700})+label('v ＝ 10 m/s',930,295,{size:32,color:C.v,anchor:'middle',weight:700}),seg(p,.05,.25));
  return s;
 },
 [K+'car3']:(p)=>{
  let s=carScene({F:1,lab:1});
  s+=card(720,90,420,150,TF(Ft+'=\\dfrac{1000\\times 10^2}{50}',930,165,{size:40}),seg(p,.05,.2),C.F);
  s+=card(720,270,420,120,TF('=2000\\ \\mathrm{N}',930,340,{size:46,color:C.F}),seg(p,.4,.55),C.F);
  return s;
 },
 [K+'noadd']:(p)=>{
  const bx=260,by=280;
  let s=card(60,70,420,380,label('正しい',270,120,{size:28,color:C.F,anchor:'middle',weight:700})+okMark(350,112),seg(p,.02,.15));
  s+=fade(seg(p,.02,.15),dot(bx-140,by,6,C.dim)+line(bx-140,by,bx,by,{color:C.dim,w:2})+ball(bx,by))+FA(bx,by,bx-110,by,{g:seg(p,.05,.2),text:'張力',size:26,dy:-20});
  const cx=840;
  s+=card(620,70,520,380,label('まちがい',830,120,{size:28,color:C.a,anchor:'middle',weight:700})+cross(930,110,16),seg(p,.3,.45));
  s+=fade(seg(p,.3,.45),dot(cx-140,by,6,C.dim)+line(cx-140,by,cx,by,{color:C.dim,w:2})+ball(cx,by))+FA(cx,by,cx-110,by,{g:seg(p,.3,.45),text:'張力',size:26,dy:-20});
  s+=FA(cx,by+30,cx-110,by+30,{g:seg(p,.45,.6),text:'向心力',size:26,dy:40,color:C.a});
  s+=fade(seg(p,.65,.8),label('同じ 力を 2回 数える',880,410,{size:28,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'cut']:(p)=>{
  let s=orbit({phi:-.4+1.2*p,vel:1});
  s+=card(680,110,460,230,label('回している おもりの',RX+10,180,{size:28,color:C.ink,anchor:'middle'})+label('糸が 切れたら？',RX+10,260,{size:42,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'cut2']:(p)=>{
  const phi0=-.5,[x0,y0]=P(phi0),u=U(phi0),cutAt=.15,d=Math.max(0,p-cutAt)/(1-cutAt);
  const phi=p<cutAt?phi0-0.4+0.4*p/cutAt:phi0;
  let s;
  if(p<cutAt)s=orbit({phi,vel:1});
  else{const x=x0+u[0]*200*d,y=y0+u[1]*200*d;
   s=orbit({phi:null})+fade(.5,line(O.x,O.y,O.x+(x0-O.x)*.6,O.y+(y0-O.y)*.6,{color:C.dim,w:2}));
   s+=draw([[x0,y0],[x0+u[0]*200,y0+u[1]*200]],1,{color:C.hi,w:2.5,dash:'7 8'});
   s+=arrow(x,y,x+O.LV*u[0],y+O.LV*u[1],{color:C.v,w:5,head:16})+ball(x,y);}
  s+=card(720,100,420,230,label('中心へ 引く 力が なくなる',930,165,{size:26,color:C.dim,anchor:'middle'})+label('慣性の 法則',930,230,{size:30,color:C.ink,anchor:'middle',weight:700})+label('→ その 速度の まま 直進',930,290,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45));
  return s;
 },
 [K+'cut3']:(p)=>{
  const phi0=-.5,[x0,y0]=P(phi0),u=U(phi0),ro=[(x0-O.x)/O.R,(y0-O.y)/O.R];
  let s=orbit({phi:null})+ball(x0,y0,{r:13});
  s+=fade(seg(p,.05,.2),draw([[x0,y0],[x0+ro[0]*170,y0+ro[1]*170]],1,{color:C.a,w:3,dash:'7 8'})+label('外向き',x0+ro[0]*170+10,y0+ro[1]*170-14,{size:24,color:C.a})+cross(x0+ro[0]*120,y0+ro[1]*120,16));
  s+=fade(seg(p,.25,.4),draw([[x0,y0],[x0+u[0]*170,y0+u[1]*170]],1,{color:C.hi,w:3})+label('接線の 向き',x0+u[0]*170-16,y0+u[1]*170+4,{size:24,color:C.hi,weight:700})+okMark(x0+u[0]*120+34,y0+u[1]*120));
  s+=card(720,110,420,230,label('円を 描き続ける には',930,180,{size:28,color:C.ink,anchor:'middle'})+label('中心へ 引き続ける',930,245,{size:30,color:C.F,anchor:'middle',weight:700})+label('力が 要る',930,295,{size:30,color:C.F,anchor:'middle',weight:700}),seg(p,.5,.65),C.F);
  return s;
 },
 // ================= S3 ニュートンの大砲 =================
 [K+'cannon']:(p)=>{
  let s=cannonScene({});
  s+=arrow(CN.x+14,CN.y-CN.S,CN.x+90,CN.y-CN.S,{color:C.v,w:5,head:16,g:seg(p,.4,.55)});
  s+=card(680,110,460,220,label('高い 山の 上から',RX+10,180,{size:30,color:C.ink,anchor:'middle'})+label('水平に 投げる',RX+10,250,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2));
  return s;
 },
 [K+'c1']:(p)=>{
  let s=cannonScene({paths:[.62,.78],ps:[seg(p,.05,.4),seg(p,.4,.75)]});
  s+=card(680,110,460,220,label('横に 進みながら 落ちる',RX+10,180,{size:28,color:C.ink,anchor:'middle'})+label('速く 投げるほど 遠く',RX+10,250,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45));
  return s;
 },
 [K+'c2']:(p)=>{
  let s=cannonScene({paths:[.62,.78,.9],ps:[1,1,seg(p,.05,.5)]});
  s+=fade(seg(p,.5,.65),draw(arcPts(CN.x,CN.y,CN.S*CN.Rg+8,Math.PI/2-.1,Math.PI/2-1.3),1,{color:C.x,w:6}));
  s+=card(680,110,460,220,label('地面は 丸い',RX+10,180,{size:30,color:C.ink,anchor:'middle',weight:700})+label('飛ぶ 間に 地面も 下へ 曲がる',RX+10,250,{size:26,color:C.x,anchor:'middle',weight:700}),seg(p,.4,.55),C.x);
  return s;
 },
 [K+'c3']:(p)=>{
  let s=cannonScene({paths:[.62,.78,.9,1.0],ps:[1,1,1,seg(p,.05,.7)],ghost:1});
  s+=card(680,110,460,230,label('落ちる 分 ＝ 地面が 曲がる 分',RX+10,180,{size:26,color:C.ink,anchor:'middle'})+label('地面に 届かず 一周',RX+10,255,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'moon']:(p)=>{
  let s=emScene({ph:.35+.1*p,vel:1,F:seg(p,.3,.45),fall:seg(p,.1,.25)});
  s+=card(680,110,460,230,label('月は 地球に 向かって',RX+10,175,{size:28,color:C.ink,anchor:'middle'})+label('落ち続けながら',RX+10,235,{size:32,color:C.F,anchor:'middle',weight:700})+label('横に 進む',RX+10,295,{size:32,color:C.v,anchor:'middle',weight:700}),seg(p,.4,.55));
  return s;
 },
 [K+'moon2']:(p)=>{
  let s=emScene({ph:.45+.3*p,vel:1,F:1,ftxt:'重力'});
  s+=card(680,110,460,230,label('月の 向心力の 役',RX+10,180,{size:28,color:C.ink,anchor:'middle'})+label('地球が 月を 引く 重力',RX+10,260,{size:34,color:C.F,anchor:'middle',weight:700}),seg(p,.1,.25),C.F);
  return s;
 },
 // ================= S4 万有引力の法則 =================
 [K+'law']:(p)=>{
  const g=seg(p,.05,.25);
  let s=fade(g,sphere(330,280,60,'#6f86b8')+sphere(760,280,30,'#b9a27a'));
  s+=FA(390,280,520,280,{g:seg(p,.3,.45)})+FA(730,280,600,280,{g:seg(p,.3,.45)});
  s+=fade(seg(p,.05,.2),label('質量 M',330,380,{size:26,color:C.ink,anchor:'middle'})+label('質量 m',760,350,{size:26,color:C.ink,anchor:'middle'}));
  s+=card(250,60,700,110,label('すべての 物体は 互いに 引き合う',600,128,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.15,.3));
  s+=fade(seg(p,.6,.75),label('万有引力の 法則',600,460,{size:36,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'formula']:(p)=>{
  let s=sphere(200,300,50,'#6f86b8')+sphere(560,300,26,'#b9a27a')+label('M',200,390,{size:28,color:C.ink,anchor:'middle',weight:700})+label('m',560,370,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=FA(250,300,350,300,{})+FA(534,300,434,300,{});
  s+=fade(seg(p,.5,.65),line(200,200,560,200,{color:C.x,w:3})+line(200,188,200,212,{color:C.x,w:3})+line(560,188,560,212,{color:C.x,w:3})+label('r（中心 どうし）',380,182,{size:24,color:C.x,anchor:'middle',weight:700})+line(200,212,200,300,{color:C.x,w:1.5,dash:'4 5'})+line(560,212,560,300,{color:C.x,w:1.5,dash:'4 5'}));
  s+=card(680,110,460,200,TF(Ft+'=\\dfrac{GMm}{r^2}',RX+10,215,{size:58}),seg(p,.05,.2),C.F);
  return s;
 },
 [K+'G']:(p)=>{
  let s=card(680,90,460,170,TF(Ft+'=\\dfrac{GMm}{r^2}',RX+10,180,{size:50}),1,C.F);
  s+=card(150,90,460,280,label('G',380,175,{size:56,color:C.hi,anchor:'middle',weight:700})+label('万有引力定数',380,245,{size:32,color:C.ink,anchor:'middle',weight:700})+label('実験で 測って 決まる',380,310,{size:28,color:C.dim,anchor:'middle'}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'lawonly']:(p)=>{
  let s=card(680,90,460,170,TF(Ft+'=\\dfrac{GMm}{r^2}',RX+10,180,{size:50}),1,C.F);
  s+=card(80,80,540,170,label('法則',350,140,{size:34,color:C.hi,anchor:'middle',weight:700})+label('観測と 実験に 支えられる',350,205,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.hi);
  s+=card(80,290,540,130,label('式変形 では 証明 できない',350,365,{size:30,color:C.a,anchor:'middle',weight:700}),seg(p,.45,.6),C.a);
  return s;
 },
 [K+'inv']:(p)=>{
  const g2=seg(p,.3,.5);
  let s=sphere(130,150,34,'#6f86b8')+sphere(330,150,18,'#b9a27a')+FA(312,150,152+0*0,150,{})+label('r',230,110,{size:28,color:C.x,anchor:'middle',weight:700});
  s+=label('F',230,205,{size:30,color:C.F,anchor:'middle',weight:700});
  s+=fade(g2,sphere(130,360,34,'#6f86b8')+sphere(530,360,18,'#b9a27a')+label('2r',330,320,{size:28,color:C.x,anchor:'middle',weight:700})+label('F ÷ 4',470,420,{size:30,color:C.F,anchor:'middle',weight:700}));
  s+=FA(512,360,472,360,{g:g2});
  s+=card(680,90,460,150,label('距離 2倍 → r² は 4倍',RX+10,145,{size:28,color:C.ink,anchor:'middle'})+label('力は 4分の1',RX+10,205,{size:34,color:C.F,anchor:'middle',weight:700}),seg(p,.4,.55),C.F);
  s+=card(680,280,460,110,label('逆2乗の 法則',RX+10,345,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.65,.8),C.hi);
  return s;
 },
 [K+'center']:(p)=>{
  const ex=300,ey=270,R=170;
  let s=earth(ex,ey,R).replace(/opacity=".8[05]?"/g,'opacity=".45"')+dot(ex,ey,6,C.ink);
  s+=fade(seg(p,.05,.2),line(ex,ey,ex+R*Math.cos(1.0),ey-R*Math.sin(1.0),{color:C.x,w:3})+label('r',ex+R*.5*Math.cos(1.0)+10,ey-R*.5*Math.sin(1.0)+24,{size:30,color:C.x,weight:700}));
  s+=fade(seg(p,.5,.65),ball(ex+(R+12)*Math.cos(1.0),ey-(R+12)*Math.sin(1.0),{r:12})+label('地表の 物体',ex+(R+30)*Math.cos(1.0)+10,ey-(R+30)*Math.sin(1.0)-6,{size:24,color:C.ink}));
  s+=card(680,110,460,230,label('r ＝ 地球の 中心 から',RX+10,180,{size:28,color:C.ink,anchor:'middle'})+label('地表 なら',RX+10,240,{size:26,color:C.dim,anchor:'middle'})+label('r ＝ 地球の 半径',RX+10,295,{size:32,color:C.x,anchor:'middle',weight:700}),seg(p,.3,.45),C.x);
  return s;
 },
 // ================= S5 月で確かめる =================
 [K+'check']:(p)=>{
  let s=emScene({ph:1.0});
  const ax=EM.x+30,ay=EM.y-62;
  s+=fade(seg(p,.05,.2),dot(ax,ay-10*seg(p,.2,.6),9,'#e2504b')+line(ax,ay-19,ax+3,ay-26,{color:'#7a5a2a',w:2})+label('リンゴ',ax+16,ay-20,{size:22,color:C.dim}));
  s+=card(680,110,460,230,label('リンゴを 落とす 重力',RX+10,175,{size:28,color:C.ink,anchor:'middle'})+label('＝ 月を 回す 力？',RX+10,250,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'data']:(p)=>{
  let s=emScene({ph:.25});
  s+=fade(seg(p,.1,.25),line(EM.x,EM.y,EM.x+EM.R*Math.cos(.25),EM.y-EM.R*Math.sin(.25),{color:C.x,w:3})+label('r',EM.x+100,EM.y-40,{size:30,color:C.x,weight:700}));
  s+=card(640,70,520,360,label('月の 軌道を 円と みなす（近似）',RX+10,115,{size:24,color:C.dim,anchor:'middle'})
   +TF('r=3.84\\times 10^8\\ \\mathrm{m}',RX+10,190,{size:40,color:C.x})
   +fade(seg(p,.4,.55),TF(TT2+'=27.3',RX-40,270,{size:40})+label('日',RX+50,282,{size:34,color:C.t,weight:700}))
   +fade(seg(p,.65,.8),TF('=2.36\\times 10^6\\ \\mathrm{s}',RX+10,360,{size:40,color:C.t})),seg(p,.15,.3),C.x);
  return s;
 },
 [K+'v']:(p)=>{
  let s=emScene({ph:.25+.5*p,vel:1,orbitG:1});
  s+=card(600,50,560,160,label('速さ ＝ 1周の 長さ ÷ 周期',880,90,{size:26,color:C.dim,anchor:'middle'})+TF(V+'=\\dfrac{2\\pi r}{'+TT2+'}',880,165,{size:36}),seg(p,.02,.15),C.v);
  s+=card(600,230,560,130,TF('=\\dfrac{2\\pi\\times 3.84\\times 10^8}{2.36\\times 10^6}',880,300,{size:38}),seg(p,.25,.4),C.v);
  s+=card(600,390,560,100,TF('\\approx 1.022\\times 10^3\\ \\mathrm{m/s}',880,445,{size:40,color:C.v}),seg(p,.6,.75),C.v);
  return s;
 },
 [K+'a']:(p)=>{
  let s=emScene({ph:.75+.4*p,vel:1,F:0});
  const [mx,my]=[EM.x+EM.R*Math.cos(.75+.4*p),EM.y-EM.R*Math.sin(.75+.4*p)];
  s+=arrow(mx,my,mx+(EM.x-mx)*.35,my+(EM.y-my)*.35,{color:C.a,w:5,head:16,g:seg(p,.05,.2)});
  s+=card(600,70,560,170,TF(A+'=\\dfrac{'+V+'^2}{r}=\\dfrac{(1.022\\times 10^3)^2}{3.84\\times 10^8}',880,160,{size:36}),seg(p,.05,.2),C.a);
  s+=card(600,290,560,130,TF('\\approx 2.72\\times 10^{-3}\\ \\mathrm{m/s^2}',880,360,{size:42,color:C.a}),seg(p,.45,.6),C.a);
  return s;
 },
 [K+'ratio']:(p)=>{
  const ex=110,ey=330,mx=560;
  let s=earth(ex,ey,34)+moon(mx,ey,16);
  s+=fade(seg(p,.05,.2),line(ex,ey-70,mx,ey-70,{color:C.x,w:3})+line(ex,ey-82,ex,ey-58,{color:C.x,w:3})+line(mx,ey-82,mx,ey-58,{color:C.x,w:3})+label('地球の 半径の 約 60.3 倍',(ex+mx)/2,ey-90,{size:26,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.05,.2),label('地球',ex,ey+70,{size:22,color:C.dim,anchor:'middle'})+label('月',mx,ey+50,{size:22,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.5,.65),arrow(ex,ey-34,ex,ey-10,{color:C.a,w:4,head:12})+label('地表：g ＝ 9.8 m/s²',ex-20,ey+110,{size:26,color:C.a,weight:700}));
  s+=card(680,110,460,190,label('月までの 距離',RX+10,170,{size:26,color:C.dim,anchor:'middle'})+label('≈ 地球の 半径 × 60.3',RX+10,240,{size:32,color:C.x,anchor:'middle',weight:700}),seg(p,.15,.3),C.x);
  return s;
 },
 [K+'inv2']:(p)=>{
  let s=card(150,50,900,190,label('逆2乗：距離が 60.3 倍 → 重力は 60.3² 分の1',600,100,{size:28,color:C.ink,anchor:'middle'})+TF('\\dfrac{9.8}{60.3^2}',600,180,{size:40}),seg(p,.05,.2),C.F);
  s+=card(300,270,600,140,TF('\\approx 2.70\\times 10^{-3}\\ \\mathrm{m/s^2}',600,345,{size:46,color:C.a}),seg(p,.45,.6),C.a);
  return s;
 },
 [K+'match']:(p)=>{
  let s=card(80,90,480,220,label('月の 円運動 から',320,150,{size:26,color:C.dim,anchor:'middle'})+TF('v^2/r',320,205,{size:38})+TF('2.72\\times 10^{-3}',320,270,{size:42,color:C.a}),seg(p,.02,.15),C.a);
  s+=card(640,90,480,220,label('地表の 重力 から',880,150,{size:26,color:C.dim,anchor:'middle'})+TF('9.8/60.3^2',880,205,{size:38})+TF('2.70\\times 10^{-3}',880,270,{size:42,color:C.a}),seg(p,.02,.15),C.a);
  s+=fade(seg(p,.1,.25),label('≈',600,205,{size:60,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.2,.35),label('違いは およそ 1%',600,370,{size:32,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('リンゴを 落とす 重力 ＝ 月を 回す 力',600,440,{size:32,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p)=>{
  let s=card(150,70,900,130,label('中心向きの 加速度を 作る 力',600,150,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.02,.15));
  ['張力','摩擦力','重力'].forEach((t,i)=>{s+=card(170+i*300,250,260,110,label(t,300+i*300,318,{size:36,color:C.F,anchor:'middle',weight:700}),seg(p,.3+i*.12,.4+i*.12),C.F);});
  s+=fade(seg(p,.7,.82),label('ふつうの 力が、向心力の 役をする',600,440,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ans2']:(p)=>{
  let s=emScene({ph:.35+.1*p,vel:1,F:1,ftxt:'重力',fall:.6});
  s+=card(680,110,460,230,label('月は',RX+10,180,{size:28,color:C.ink,anchor:'middle'})+label('地球に 向かって',RX+10,235,{size:30,color:C.ink,anchor:'middle'})+label('落ち続けている',RX+10,295,{size:36,color:C.F,anchor:'middle',weight:700}),seg(p,.3,.45),C.F);
  return s;
 },
 [K+'mis']:(p)=>{
  let s=emScene({ph:.5+.3*p,vel:1,F:1,ftxt:'重力'});
  s+=card(680,90,460,140,label('重力が 届いて いない',RX+10,170,{size:30,color:C.a,anchor:'middle',weight:700})+cross(RX+190,160,14),seg(p,.02,.15),C.a);
  s+=card(680,270,460,150,label('届いている から',RX+10,330,{size:30,color:C.ink,anchor:'middle'})+label('まっすぐ 行かずに 回る',RX+10,385,{size:30,color:C.F,anchor:'middle',weight:700}),seg(p,.45,.6),C.F);
  return s;
 },
 [K+'next']:(p)=>{
  const ex=300,ey=262,R=150,ph=1.2+2.4*p,sx=ex+(R+22)*Math.cos(ph),sy=ey-(R+22)*Math.sin(ph);
  let s=earth(ex,ey,R).replace(/opacity=".8[05]?"/g,'opacity=".45"')+ring(ex,ey,R+22,{color:C.faint,w:2,dash:'6 7'});
  s+=rect(sx-14,sy-8,28,16,{fill:'#c9d3e6',fo:1,stroke:'none',rx:3})+rect(sx-34,sy-5,16,10,{fill:'#4a7bd0',fo:1,stroke:'none',rx:1})+rect(sx+18,sy-5,16,10,{fill:'#4a7bd0',fo:1,stroke:'none',rx:1});
  s+=fade(seg(p,.2,.35),label('人工衛星',sx+(Math.cos(ph)>0?40:-40),sy-20,{size:24,color:C.ink,anchor:Math.cos(ph)>0?'start':'end'}));
  s+=card(680,110,460,230,label('地球の すぐ外を 回るには',RX+10,180,{size:28,color:C.ink,anchor:'middle'})+label('どれだけの 速さ？',RX+10,260,{size:40,color:C.v,anchor:'middle',weight:700}),seg(p,.05,.2),C.v);
  return s;
 },
 [K+'bye']:(p)=>{
  let s=card(200,110,800,230,label('次回',600,175,{size:28,color:C.dim,anchor:'middle'})+label('人工衛星の 速さと 周期',600,255,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  s+=fade(seg(p,.5,.7),label('円運動と万有引力・深く学ぶ 3/3 へ',1080,470,{size:26,color:C.dim,anchor:'end'}));
  return s;
 },
};
const TT2=`{\\color{${C.t}}T}`;

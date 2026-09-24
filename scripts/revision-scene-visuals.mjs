// Added numerical scenes have their own diagrams; an old scene is never repeated
// merely because the newly appended scene shares the same topic ID.
import {C,text,line,rect,circle,path,arrow,fmt,clamp,graph} from './all-film-visuals.mjs';

export function revisionSceneDiagram(clip,scene,p){
 if(clip.id==='t-heat-advanced'&&scene.index===1){
  return text('融けている間は温度が変わらない',105,35,28)
   +rect(160,120,250,180,C.cyan,.15)
   +rect(170,130,230*(1-p),160,C.ink,.3)
   +text('氷 → 水',220,340,27)+text('m：融ける質量 [g]',520,150,26)
   +text('L：1 g あたりの融解熱 [J/g]',520,205,24)
   +text('熱量 Q：m と L の積 [J]',520,260,25,C.gold)
   +arrow(130,380,130,265,C.red,'加える熱');
 }
 if(clip.id==='t-firstlaw-middle'&&scene.index===1){
  const X=410+130*p;
  return text('ゆっくり動かし、気体の圧力がいつもそろう変化',70,35,25)
   +rect(110,110,X-110,170,C.cyan,.15)+line(X,95,X,295,C.gold,8)
   +line(410,95,410,295,C.dim,2,'6 5')+arrow(X+15,200,X+120,200,C.gold,'力 pS')
   +text('圧力 p：一定',170,175,27)+text('ピストンの面積 S',140,240,26)
   +line(410,340,X,340,C.green,3)+text('移動距離 Δx',440,380,26,C.green)
   +text('増えた体積 ΔV = SΔx',80,375,25,C.cyan);
 }
 if(clip.id==='prep-pressure'&&scene.index===1){
  return graph(x=>x,{x:130,y:300,w:650,h:200,xmax:3,ymax:3,xlabel:'面積 S [m²]',ylabel:'面を押す力 F [N]'})
   +[1,2,3].map(n=>circle(130+650*n/3,300-200*n/3,5,C.gold)+text(String(n),120+650*n/3,330,20)+text(String(n),95,306-200*n/3,20)).join('')
   +circle(130+650*p,300-200*p,8,C.gold)+text('圧力 1 Pa を一定にした場合',340,45,27)
   +text('面積 1 m² を押す力は 1 N',260,380,25,C.cyan);
 }
 if(clip.id==='prep-pressure'&&scene.index===2){
  const X=v=>120+180*v,Y=v=>300-110*v,v=.5+3.5*p;
  return line(120,300,870,300)+line(120,300,120,55)
   +path(Array.from({length:201},(_,i)=>{const x=.5+3.5*i/200;return[X(x),Y(1/x)];}),C.cyan,4)
   +circle(X(v),Y(1/v),8,C.gold)
   +[.5,1,2,4].map(n=>line(X(n),300,X(n),307)+text(String(n),X(n)-10,335,21)).join('')
   +[.5,1,2].map(n=>line(113,Y(n),120,Y(n))+text(String(n),65,Y(n)+7,21)).join('')
   +text('体積の比',700,375,25)+text('圧力の比',80,40,25)
   +text('気体の量と温度は一定',410,55,26)+text('体積 × 圧力 の比は 1',420,105,25,C.gold);
 }
 if(scene.index!==3)return null;
 p=clamp(p);
 if(clip.id==='t-firstlaw-intro'){
  const rigid=p>=.5,work=rigid?0:40,internal=100-work;
  return text(rigid?'硬い容器：体積は変わらない':'気体が膨らみ、外へ仕事をする',80,40,28)
   +rect(100,105,180,150,C.red,.15)+text('受け取る熱',110,145)+text('100 J',135,205,36,C.red)
   +arrow(290,175,390,175,C.red)
   +rect(415,90,210,190,C.cyan,.12)+text('気体',490,135,30)
   +text(`内部エネルギー +${internal} J`,400,330,27,C.cyan)
   +(rigid?line(415,80,625,80,C.dim,9)+text('仕事 0 J',705,180,28,C.dim):arrow(640,175,760,175,C.gold)+text('外への仕事',765,130,23,C.gold)+text('40 J',790,200,34,C.gold))
   +rect(415,260-internal,210,internal,C.cyan,.45)
   +circle(300+80*((p*6)%1),175,6,C.red);
 }
 if(clip.id==='m-projectile-middle'){
  const T=12/9.8,t=T*p,x=8*t,y=6*t-4.9*t*t;
  const X=v=>100+70*v,Y=v=>300-100*v;
  return text('初速度：水平 8 m/s、上向き 6 m/s',100,35,27)
   +line(100,300,850,300)+line(100,300,100,65)
   +text('水平位置 x [m]',360,350)+text('高さ y [m]',10,65)
   +path(Array.from({length:101},(_,i)=>{const q=T*i/100;return[X(8*q),Y(6*q-4.9*q*q)];}),C.dim)
   +circle(X(x),Y(y),10,C.gold)+arrow(X(x),Y(y),X(x)+70,Y(y),C.cyan)
   +text(`経過時間 ${fmt(t,2)} s`,400,80,25)+text('同じ高さに着地：約 1.22 s 後',340,265,23)
   +line(X(8*T),300,X(8*T),310,C.gold,3)+text('約 9.8 m',X(8*T)-45,340,22,C.gold)
   +text('空気抵抗なし・重力加速度 9.8 m/s²',110,390,22,C.dim);
 }
 if(clip.id==='m-momentum-middle'){
  return text('同じ卵を止める：運動量の変化の大きさは 0.3 kg·m/s',80,40,26)
   +[.01,.1].map((dt,i)=>{
    const x=90+i*465,w=dt*2700,h=.3/dt*5;
    return line(x,295,x+365,295)+line(x,295,x,75)
     +rect(x,295-h,w,h,i?C.cyan:C.gold,.4)
     +text(`止まる時間 ${dt} s`,x,340,24)
     +text(`平均の合力 ${fmt(.3/dt)} N`,x+45,100,25,i?C.cyan:C.gold)
     +text('時間 [s]',x+250,380,20)+text('力の大きさ [N]',x,65,20)
     +line(x+w*p,295,x+w*p,295-h,C.ink,2);
   }).join('');
 }
 return null;
}

export function revisionSceneEquation(clip,scene,p,captionIndex=0){
 if(scene.index!==3)return null;
 if(clip.id==='t-firstlaw-intro')return p<.5?'ΔU = Q − W = 100 − 40 = 60 J':'W = 0 → ΔU = Q = 100 J';
 if(clip.id==='m-projectile-middle')return captionIndex<2?'v₀x = 10 × 0.8 = 8 m/s　v₀y = 10 × 0.6 = 6 m/s':captionIndex===2?'t = 2 × 6 / 9.8 ≈ 1.22 s':'x = 8 × 1.22 ≈ 9.8 m';
 if(clip.id==='m-momentum-middle')return '|Δp| = 0.06 × 5 = 0.3 kg·m/s　 |F平均| = |Δp| / Δt';
 return null;
}

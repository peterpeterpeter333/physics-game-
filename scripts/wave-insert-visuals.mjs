import {C,text,line,circle,path,arrow,rect,clamp} from './all-film-visuals.mjs';
export const waveInsertIds=['hw-why-01','hw-why-02','hw-why-03','hw-why-04','hw-why-13'];
const curve=(f,a,b,n=160)=>Array.from({length:n+1},(_,j)=>{const x=a+(b-a)*j/n;return f(x);});
export function waveInsertVisual(clip,scene,time){
 if(!waveInsertIds.includes(clip.id))return null;
 const i=Math.max(0,scene.captions.findLastIndex(c=>c.start<=time)),t=time-scene.start;
 if(clip.id==='hw-why-13'){
  const tau=t*.35,X=x=>110+100*x,Y=x=>215-65*Math.sin(Math.PI/2*(x-2*tau));
  const crest=(2*tau+1)%4;
  return {diagram:text('印を付けた点の横位置は、変わらない',160,35,27)
   +line(80,215,940,215,C.dim,2,'5 5')+path(curve(x=>[X(x),Y(x)],0,8),C.cyan)
   +line(X(3),90,X(3),345,C.red,2,'5 5')+circle(X(3),Y(3),9,C.red)
   +arrow(X(3)+30,160,X(3)+30,270,C.red)+arrow(X(3)+30,270,X(3)+30,160,C.red)+text('印は上下に動く',X(3)+60,125,23,C.red)
   +arrow(X(crest),75,X(crest)+100,75,C.gold)+text('波の形は右へ',630,75,24,C.gold)
   +line(X(0),355,X(8),355)+Array.from({length:9},(_,j)=>line(X(j),350,X(j),363)+text(String(j),X(j)-6,390,22,j===3?C.red:C.dim)).join('')
   +text('横の位置 x [m]',690,430,22)+text('赤い印：x = 3 m のまま',125,430,25,C.red),equation:''};
 }
 if(clip.id==='hw-why-01'){
  const tau=(t*.2)%1,X=x=>130+110*x;
  return {diagram:text('周期 0.5 s → 1秒に2回 → 1秒に6 m進む',105,35,26)
   +text('時間をゆっくり表示：0〜1秒を繰り返す',240,78,21,C.dim)
   +text(`時刻 ${tau.toFixed(2)} s`,120,125,25,C.gold)
   +line(105,225,875,225,C.dim,2)+path(curve(x=>[X(x),225-60*Math.cos(2*Math.PI*(x/3-2*tau))],0,6),C.cyan)
   +circle(X(6*tau),165,8,C.gold)+line(X(6*tau),170,X(6*tau),330,C.gold,2,'4 4')
   +line(X(0),330,X(6),330)+[0,3,6].map(x=>line(X(x),322,X(x),340)+text(`${x} m`,X(x)-18,375,23)).join('')
   +line(X(0),410,X(3),410,C.cyan,3)+line(X(3),410,X(6),410,C.cyan,3)
   +text('波長 3 m',220,450,23,C.cyan)+text('波長 3 m',550,450,23,C.cyan),
   equation:i===0?String.raw`T=0.5\ \mathrm s`:i===1?String.raw`f=\frac1T=\frac1{0.5}=2\ \mathrm{Hz}`:String.raw`v=f\lambda=2\times3=6\ \mathrm{m/s}`};
 }
 if(clip.id==='hw-why-02'){
  const tau=(t*.2)%4,X=x=>130+160*x,signal=z=>z<0?0:Math.sin(Math.PI*z/2);
  return {diagram:text('4 m先の点は、原点より2秒遅れて揺れる',140,35,26)
   +text(`時刻 ${tau.toFixed(2)} s（ゆっくり繰り返し）`,240,78,22,C.dim)
   +line(110,190,850,190,C.dim,2)
   +path(curve(x=>[X(x),190-50*signal(tau-x/2)],0,4),C.cyan)
   +circle(X(0),190-50*signal(tau),8,C.green)+circle(X(4),190-50*signal(tau-2),8,C.gold)
   +text('原点：0 m',80,285,23,C.green)+text('観測点：4 m',700,285,23,C.gold)
   +arrow(180,105,405,105,C.cyan,'波の速さ 2 m/s')
   +line(130,375,810,375,C.dim,2)
   +path(curve(z=>[130+160*z,375-38*signal(z)],0,4),C.green)
   +path(curve(z=>[130+160*z,375-38*signal(z-2)],0,4),C.gold)
   +line(X(tau),318,X(tau),420,C.dim,2,'4 4')
   +text('0 s',110,410,20)+text('2 s',430,410,20)+text('4 s',750,410,20)
   +text('同じ揺れが2秒後に届く',295,450,24)+text('時間 →',820,395,20),
   equation:i<2?String.raw`\text{届くまでの時間}=\frac{x}{v}=\frac{4}{2}=2\ \mathrm s`:String.raw`y(4,t)=y(0,t-2)`};
 }
 if(clip.id==='hw-why-03'){
  const phase=t*.85;
  function tube(y,closed){
   const shape=x=>closed?Math.sin(Math.PI*x/2):Math.cos(Math.PI*x);
   return line(100,y-20,700,y-20,C.cyan)+line(100,y+20,700,y+20,C.cyan)
    +(closed?line(100,y-25,100,y+25,C.gold,6):'')
    +Array.from({length:19},(_,k)=>{const x=k/18;return circle(100+600*x+12*shape(x)*Math.cos((closed?1:2)*phase),y,4,C.cyan);}).join('')
    +[-1,1].map(sign=>path(curve(x=>[100+600*x,y+75+sign*30*shape(x)],0,1),C.dim,1).replace('<path ','<path stroke-dasharray="4 5" ')).join('')
    +path(curve(x=>[100+600*x,y+75-30*shape(x)*Math.cos((closed?1:2)*phase)],0,1),C.green)
    +line(100,y+75,700,y+75,C.dim,1,'3 3')
    +text(closed?'閉じた端：節':'開いた端：腹',65,y-38,21,C.gold)
    +text('開いた端：腹',585,y-38,21,C.gold)
    +text(closed?'L = λ/4':'L = λ/2',750,y,25,C.green)
    +(i>=3?text(closed?'170 Hz':'340 Hz',750,y+50,25,C.gold):'');
  }
  return {diagram:text('同じ長さ L = 0.5 m、音速 340 m/sで比べる',130,30,25)
   +tube(110,true)+tube(290,false)
   +text('点：空気は左右に動く。破線：変位の最大幅',150,415,21,C.dim)
   +text('曲線：横方向の変位を、縦の高さで表したグラフ',150,450,21,C.dim),
   equation:i<=1?String.raw`\lambda_{\text{片閉}}=4L`:i===2?String.raw`\lambda_{\text{両開}}=2L`:String.raw`f_{\text{片閉}}=\frac{340}{4\times0.5}=170\ \mathrm{Hz},\quad f_{\text{両開}}=\frac{340}{2\times0.5}=340\ \mathrm{Hz}`};
 }
 // 440 Hz is far above the video frame rate. Show relative phase explicitly,
 // rather than falsely animating 440 oscillations at an aliased slow rate.
 const tau=(t*.15)%1,angle=4*Math.PI*tau;
 return {diagram:text('440回の分を引いて、余分な進み具合を比べる',110,35,25)
  +text('音1：440 Hz',130,90,26,C.cyan)+text('音2：442 Hz',620,90,26,C.gold)
  +`<circle cx="275" cy="220" r="85" fill="none" stroke="${C.dim}" stroke-width="2"/>`+arrow(275,220,355,220,C.cyan)
  +arrow(275,220,275+80*Math.cos(angle),220-80*Math.sin(angle),C.gold)
  +text(`経過 ${tau.toFixed(2)} s（ゆっくり繰り返し）`,485,185,23)
  +text('1秒で、黄色は余分に2周する',485,245,24,C.gold)
  +text('重なった揺れの大きさ',480,300,22,C.green)
  +line(140,415,880,415,C.dim,2)
  +path(curve(x=>[140+700*x,410-70*Math.abs(Math.cos(2*Math.PI*x))],0,1),C.green)
  +line(140+700*tau,320,140+700*tau,420,C.gold,2)
  +text('強め合う',95,325,20,C.green)+text('強め合う',440,325,20,C.green)
  +text('0秒',120,452,20)+text('0.5秒',465,452,20)+text('1秒',820,452,20),
  equation:i<4?String.raw`442-440=2\quad\text{（1秒あたりの振動回数の差）}`:String.raw`f_{\text{うなり}}=|442-440|=2\ \mathrm{Hz}`};
}

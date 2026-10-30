import {C,text,line,circle,path,arrow,rect} from './all-film-visuals.mjs';
const samples=(f,a,b)=>Array.from({length:161},(_,i)=>f(a+(b-a)*i/160));
export function waveRevisionDiagram(c,s,p){
 if(c.id==='w-sound-middle'){
  return text('同じ長さ L の管。曲線は空気の横方向の変位',75,30,25)
   +[false,true].map((open,j)=>{
    const x0=70+470*j,phase=p*4*Math.PI*(open?2:1);
    return line(x0,80,x0+330,80,C.dim,2)+line(x0,280,x0+330,280,C.dim,2)
     +(open?'':line(x0,80,x0,280,C.gold,6))
     +path(samples(x=>[x0+330*x,180-60*Math.sin(phase)*(open?Math.cos(Math.PI*x):Math.sin(Math.PI*x/2))],0,1),C.cyan)
     +text(open?'両端が開いた管':'片端が閉じた管',x0,65,23)
     +text(open?'腹 → 節 → 腹':'節 → 腹',x0+50,320,25,C.gold)
     +text(open?'L = λ/2':'L = λ/4',x0+100,365,25,C.green);
   }).join('')+text('同じ音速なら、右の振動数は左の2倍（ゆっくり表示）',130,395,20,C.dim);
 }
 if(c.id==='prep-sin-wave'&&s.index===0){
  const a=2*Math.PI*p,x=230+95*Math.cos(a),y=210-95*Math.sin(a);
  return text('円の上の点 → 縦の位置を取り出す → サインのグラフ',80,30,25)
   +`<circle cx="230" cy="210" r="95" fill="none" stroke="${C.dim}" stroke-width="2"/>`
   +line(100,210,350,210,C.dim)+line(230,80,230,340,C.dim)
   +arrow(230,210,x,y,C.gold)+circle(x,y,8,C.gold)
   +line(x,y,500+380*p,y,C.gold,2,'5 5')
   +line(490,210,925,210,C.dim)+line(500,100,500,320,C.dim)
   +path(samples(z=>[500+380*z/(2*Math.PI),210-95*Math.sin(z)],0,a),C.cyan)
   +circle(500+380*p,y,7,C.cyan)
   +text('半径 A',100,365,24,C.gold)+text('縦の位置 A sin θ',500,80,24,C.cyan)
   +text('角度 θ：0 → 2π',620,350,23)+text('点の縦位置と、グラフの高さは同じ',245,395,23);
 }
 if(c.id==='prep-superposition'&&s.index===1){
  const phase=p*2*Math.PI,Y=210;
  return text('同じ場所の「上へのずれ」と「下へのずれ」を足す',85,35,25)
   +line(100,Y,900,Y,C.dim,2)
   +path(samples(x=>[100+200*x,Y-70*Math.sin(Math.PI*x/2-phase)],0,4),C.cyan)
   +path(samples(x=>[100+200*x,Y+70*Math.sin(Math.PI*x/2-phase)],0,4),C.gold)
   +line(100,Y,900,Y,C.green,4)
   +text('青：波1',110,95,24,C.cyan)+text('黄：半周期ずれた波2',540,95,24,C.gold)
   +text('緑：どの位置でも合計は0',300,330,27,C.green)
   +text('上向きを正、下向きを負として足す',210,395,24);
 }
 if(c.id==='prep-sound-boundary'&&s.index<2){
  const X=x=>140+650*x,Y=x=>300-160*Math.sin(Math.PI*x/2);
  return text(s.index===0?'閉じた端では空気が動けない':'開いた端では空気が大きく揺れる',140,35,27)
   +line(140,300,845,300,C.dim)+line(140,320,140,90,C.gold,5)
   +path(samples(x=>[X(x),Y(x)],0,1),C.cyan)
   +circle(X(p),Y(p),7,C.cyan)
   +text('閉じた端：節',80,360,24,C.gold)+text('開いた端：腹',670,360,24,C.gold)
   +text('横軸：管の中の位置',355,395,24)
   +text('空気の変位の最大幅',390,90,25,C.cyan);
 }
 return null;
}

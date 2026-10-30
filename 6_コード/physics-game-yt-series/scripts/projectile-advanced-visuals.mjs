import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const ease=p=>{p=clamp(p/.78);return p*p*(3-2*p);};
const rad=a=>a*Math.PI/180;
export const projectileAdvancedKinds=['landing-time-graph','landing-roots','sine-height','range-angles','double-angle-height','range-lower-ground','range-drag','range-number-comparison','equal-sines','complementary-trajectories'];
export function projectileAdvancedDiagram(kind,p){
 if(!projectileAdvancedKinds.includes(kind))throw Error('Unknown projectile advanced '+kind);
 const u=ease(p);
 if(kind.startsWith('landing-')){
  const X=t=>180+t*650,Y=y=>405-y*150,T=12/9.8,t=T*u;
  let out=line(120,405,1100,405)+line(180,450,180,65)+text('高さ y [m]',135,45,29)+text('時間 t [s]',960,470,29)+path(Array.from({length:81},(_,i)=>{const q=T*i/80;return[X(q),Y(6*q-4.9*q*q)];}),C.cyan,4)+circle(X(t),Y(6*t-4.9*t*t),13,C.gold);
  if(kind==='landing-roots')out+=circle(X(0),405,21,C.purple,.5)+circle(X(T),405,21,C.gold,.5)+text('投げた瞬間：t = 0',110,498,27,C.purple)+text('戻った瞬間：t > 0',770,498,27,C.gold);
  else out+=text('投げた高さを y = 0 とする',600,90,29)+text('球の道筋ではなく、時刻と高さのグラフ',400,45,25,C.dim);
  return out;
 }
 if(['sine-height','double-angle-height','equal-sines'].includes(kind)){
  const ox=380,oy=290,r=190,P=a=>[ox+r*Math.cos(rad(a)),oy-r*Math.sin(rad(a))];
  let out=`<circle cx="${ox}" cy="${oy}" r="${r}" fill="none" stroke="${C.dim}" stroke-width="2"/>`+line(140,oy,620,oy)+line(ox,500,ox,60)+text('半径 1',190,85,29)+text('高さ 1',390,90,26,C.gold);
  if(kind==='equal-sines'){
   const A=P(60),B=P(120);out+=line(ox,oy,...A,C.cyan,3)+line(ox,oy,...B,C.purple,3)+circle(...A,12,C.cyan)+circle(...B,12,C.purple)+line(B[0],A[1],B[0]+(A[0]-B[0])*u,A[1],C.gold,5)+text('60°',A[0]+10,A[1]-15,28,C.cyan)+text('120°',B[0]-90,B[1]-15,28,C.purple)+text('二点の高さが同じ',700,180,32)+text('サインの値が同じ',700,250,32,C.gold)+text('投げる角度：30° と 60°',650,365,29);
  }else{
   const a=90*u,P1=P(a);out+=arrow(ox,oy,...P1,C.cyan)+line(P1[0],oy,...P1,C.purple,5)+circle(...P1,12,C.gold)+line(ox,oy-r,620,oy-r,C.dim,2)+text(kind==='sine-height'?`角度 ${Math.round(a)}°`:`投げる角度 θ = ${(a/2).toFixed(1)}°`,660,170,31)+text(kind==='sine-height'?'縦の高さ = サイン':`円で見る角度 2θ = ${Math.round(a)}°`,660,250,31,C.purple)+text('点が真上に来ると、高さは最大の 1',610,365,27,C.gold);
  }return out;
 }
 const ox=155,oy=420,scale=76;
 let out=line(100,oy,1120,oy)+line(ox,460,ox,60)+text('横の位置 [m]',915,490,27)+text('縦の位置 [m]',110,40,27);
 const traj=(a,color,endY=0,drag=false)=>{
  const vx=10*Math.cos(rad(a)),vy=10*Math.sin(rad(a)),T=(vy+Math.sqrt(vy*vy-19.6*endY))/9.8;
  // Drag diagram is explicitly qualitative; all non-drag paths use g=9.8.
  const X=t=>ox+scale*(drag?vx*(1-Math.exp(-.55*t))/.55:vx*t),Y=t=>oy-scale*(vy*t-4.9*t*t);
  const t=T*u;let s=path(Array.from({length:81},(_,i)=>{const q=T*i/80;return[X(q),Y(q)];}),color,4)+circle(X(t),Y(t),13,color);
  if(drag)s+=arrow(X(t),Y(t)-40,X(t)+70*Math.exp(-.55*t),Y(t)-40,color);
  return s;
 };
 if(kind==='range-lower-ground'){
  return `<g transform="translate(0 -110)">${traj(40,C.cyan,-1)}</g>`+line(110,310,1100,310,C.dim,2)+line(110,386,1100,386,C.gold,4)+text('投げた高さ y = 0',155,290,27,C.dim)+text('着地の高さ y = −1 m',680,435,29,C.gold)+text('高さが変われば、着地までの時間も変わる',230,45,30);
 }
 if(kind==='range-drag')return out+traj(40,C.dim)+traj(40,C.red,0,true)+text('灰：抵抗なし',690,110,29,C.dim)+text('赤：横の速度が小さくなる例',580,175,29,C.red)+text('抵抗は模式図：最適角の数値はここでは求めない',350,45,25,C.dim);
 if(kind==='range-number-comparison')return out+traj(Math.asin(.6)*180/Math.PI,C.cyan)+traj(45,C.gold)+text('中級：横 8・縦 6 m/s → 約9.8 m',430,90,29,C.cyan)+text('45°：初速 10 m/s → 約10.2 m',430,150,29,C.gold);
 if(kind==='complementary-trajectories')return out+traj(30,C.cyan)+traj(60,C.purple)+text('30°：低い軌道・短い時間',680,85,29,C.cyan)+text('60°：高い軌道・長い時間',680,145,29,C.purple)+text('初速 10 m/s は同じ。着地点も同じ',370,35,26);
 return out+traj(25,C.cyan)+traj(45,C.gold)+traj(65,C.purple)+text('初速はすべて 10 m/s',650,80,31)+text('25°',220,360,27,C.cyan)+text('45°',730,235,27,C.gold)+text('65°',480,95,27,C.purple);
}
export function projectileAdvancedFrame(c,s,t){return c.visualPilot==='projectile-advanced-v1'?authoredMotionFrame(c,s,t,projectileAdvancedDiagram):null;}

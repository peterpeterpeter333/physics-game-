import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const tau=2*Math.PI;
const sine=(x,y,w,a,fn,c=C.cyan)=>path(Array.from({length:201},(_,i)=>{const z=i/200;return[x+w*z,y-a*fn(z)];}),c,4);
const point=(x,y,c=C.gold)=>circle(x,y,11,c);
export const travelingWaveKinds=['travelprep-source-history','travelprep-delay-transport','travelprep-two-axes','traveladvanced-delayed-points','traveladvanced-snapshot-history','traveladvanced-follow-crest','travelinsert-two-seconds'];
export function travelingWaveDiagram(kind,p){
 if(!travelingWaveKinds.includes(kind))throw Error(kind);const u=clamp(p/.9);
 if(kind==='travelprep-source-history')return text('まず、一つの場所の振動だけを記録する',235,35,31)+line(130,280,1090,280,C.dim,2)+sine(130,280,960,105,t=>Math.sin(4*Math.PI*t))+[0,.5,1].map(t=>line(130+960*t,155,130+960*t,405,C.dim,2,'7 6')+text(t+' s',115+960*t,445,28)).join('')+point(130+960*u,280-105*Math.sin(4*Math.PI*u),C.red)+text('原点の上下のずれ',145,110,29,C.red)+text('横軸：時刻',880,110,28)+text('1秒で二回の振動。波の形のグラフではない',215,505,27);
 if(kind==='travelprep-delay-transport'){const x0=150,x1=790,Y=x=>285-90*Math.sin(tau*(u-(x-x0)/800));return text('形を変えずに進む波：右の点ほど遅れて揺れる',120,35,31)+line(120,285,1130,285,C.dim,2)+sine(x0,285,960,90,z=>Math.sin(tau*(u-960*z/800)))+point(x0,Y(x0),C.red)+point(x1,Y(x1),C.gold)+[x0,x1].map(x=>line(x,130,x,425,C.dim,2,'7 6')).join('')+text('原点の波源',x0-70,465,28,C.red)+text('離れた点',x1-65,465,28,C.gold)+arrow(430,130,740,130,C.gold)+text('揺れが伝わる向き',430,95,28,C.gold)+text('右の点の「今」は、原点の「少し前」に対応',250,505,27);}
 if(kind==='travelprep-two-axes'){
  return text('波の形と、一点の振動記録では、横軸が違う',145,35,31)+line(130,205,1090,205,C.dim,2)+sine(130,205,960,58,x=>-Math.sin(tau*x*1.5))+point(130,205,C.red)+text('時刻を固定：この瞬間の形',150,105,29,C.cyan)+text('横軸：位置',900,290,27,C.cyan)+line(130,405,1090,405,C.dim,2)+sine(130,405,960,52,t=>Math.sin(tau*t*1.5),C.red)+point(130+960*u,405-52*Math.sin(tau*u*1.5),C.gold)+text('原点を固定：同じ点の振動を記録',150,330,28,C.red)+text('横軸：時刻',900,495,27,C.red);
 }
 if(kind==='traveladvanced-delayed-points'){const X=x=>150+160*x,t=3*u,y=x=>290-90*Math.sin(tau*(t-x/2)/4);return text('形を変えずに進む波では、遠い点ほど同じ動きが遅れる',60,35,30)+line(120,290,1140,290,C.dim,2)+sine(150,290,960,90,z=>Math.sin(tau*(t-3*z)/4))+[0,2,4].map((x,i)=>line(X(x),170,X(x),420,C.dim,2,'7 6')+point(X(x),y(x),[C.red,C.gold,C.purple][i])+text(['原点','途中の点','さらに右の点'][i],X(x)-55,460,27,[C.red,C.gold,C.purple][i])).join('')+arrow(380,120,910,120,C.gold)+text('同じ振動の状態が伝わる向き',390,90,28,C.gold)+text('ここで追うのは、ひもの横移動ではなく揺れの伝達',170,505,27);}
 if(kind==='traveladvanced-snapshot-history'){
  const q=clamp((u-.45)/.55);
  return text('二つの見方を、同じ波に使える',315,35,32)+line(140,205,1100,205,C.dim,2)+sine(140,205,900,60,z=>Math.sin(tau*(.25-z)))+point(140,145,C.red)+text('ある瞬間の写真：横へ見渡す',140,105,29,C.cyan)+arrow(200,290,200+800*u,290,C.cyan)+text('横軸は位置',890,318,26,C.cyan)+line(140,410,1100,410,C.dim,2)+sine(140,410,900,50,z=>Math.sin(tau*(.25+z)),C.red)+point(140+900*q,410-50*Math.sin(tau*(.25+q)),C.gold)+text('赤い点の振動：時刻を追う',140,345,29,C.red)+text('横軸は時刻',890,495,26,C.red);
 }
 if(kind==='traveladvanced-follow-crest'){const start=300,end=start+520*u,phase=(x)=>(x-end)/520;return text('同じ山を追うと、時刻が進むほど右へ進む',145,35,32)+sine(110,285,1020,95,z=>Math.cos(tau*phase(110+1020*z)))+point(end,190)+line(start,145,start,405,C.dim,2,'7 6')+line(end,150,end,405,C.gold,2,'7 6')+arrow(start,425,end,425,C.gold)+text('同じ高さの山',end-80,125,29,C.gold)+text('最初の位置',start-75,465,27,C.dim)+text('経過時間が増えるほど、移動距離も増える',300,505,26);}
 if(kind==='travelinsert-two-seconds'){const travel=4*u,X=x=>190+190*x;return text('原点のある動きが、2秒かけて4 m先へ伝わる',130,35,31)+line(X(0),300,X(4),300,C.dim,3)+[0,1,2,3,4].map(x=>line(X(x),290,X(x),310,C.dim,3)+text(x+' m',X(x)-18,350,28)).join('')+point(X(travel),300)+arrow(X(0),180,X(4),180,C.gold)+text('波の速さ：毎秒2 m',410,140,30,C.gold)+text('原点',X(0)-25,400,30,C.red)+text('受け取る点',X(4)-70,400,30,C.cyan)+text('経過時間：'+(2*u).toFixed(2)+' 秒',420,465,30)+text('黄色の印は、空気やひもの粒ではなく、伝わる振動の目印',80,505,26);}
}
export function travelingWaveFrame(c,s,t){return c.visualPilot==='traveling-wave-v1'?authoredMotionFrame(c,s,t,travelingWaveDiagram):null;}

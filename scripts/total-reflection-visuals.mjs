import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const deg=Math.PI/180,critical=Math.asin(1/1.33);
const arc=(x,y,r,a,b,c)=>path(Array.from({length:41},(_,i)=>{const q=a+(b-a)*i/40;return[x+r*Math.cos(q),y+r*Math.sin(q)];}),c,3);
function diagram(a,u,reflect=false){const O=[590,255],r=220,A=[O[0]-r*Math.sin(a),O[1]+r*Math.cos(a)],b=Math.asin(Math.min(1,1.33*Math.sin(a))),B=reflect?[O[0]+r*Math.sin(a),O[1]+r*Math.cos(a)]:[O[0]+r*Math.sin(b),O[1]-r*Math.cos(b)],s=u*2,pos=!reflect||s<1?[A[0]+(O[0]-A[0])*(reflect?s:u),A[1]+(O[1]-A[1])*(reflect?s:u)]:[O[0]+(B[0]-O[0])*(s-1),O[1]+(B[1]-O[1])*(s-1)];return `<rect x="100" y="255" width="1000" height="225" fill="${C.cyan}" fill-opacity=".09"/>`+line(100,255,1100,255,C.dim,3)+line(590,85,590,475,C.purple,2,'7 6')+text('空気：屈折率1',110,120,28)+text('水：屈折率1.33',110,455,28,C.cyan)+text('法線',605,110,27,C.purple)+arrow(...A,...O,C.gold)+arrow(...O,...B,reflect?C.gold:C.cyan)+circle(...pos,9,C.gold)+arc(...O,80,Math.PI/2,Math.PI/2+a,C.gold)+text(`入射角 ${(a/deg).toFixed(1)}°`,210,350,27,C.gold)+(reflect?text('水の中へ反射',795,410,27,C.gold):text(`屈折角 ${(b/deg).toFixed(1)}°`,805,150,27,C.cyan));}
export const totalReflectionKinds=['totalreflection-angle-sweep','totalreflection-grazing','totalreflection-sine-bound','totalreflection-reflected-path','totalreflection-water-example'];
export function totalReflectionDiagram(kind,p){
 if(!totalReflectionKinds.includes(kind))throw Error(kind);const u=clamp(p/.8);
 if(kind==='totalreflection-angle-sweep')return text('水から空気へ進むと、法線との角度が大きくなる',95,35,31)+diagram((20+23*u)*deg,u)+text('水の中の入射角を、少しずつ大きくする',250,505,28);
 if(kind==='totalreflection-grazing')return text('屈折角90度：空気側の光線が境界に沿う限界',130,35,31)+diagram(critical,u)+text('このときの水側の入射角が、臨界角',280,505,28);
 if(kind==='totalreflection-sine-bound'){const a=(15+65*u)*deg,A=[300,430],B=[300+300*Math.cos(a),430],Q=[B[0],430-300*Math.sin(a)];return text('向かい側の辺は、斜めの辺より長くならない',165,35,31)+line(...A,...B,C.dim,3)+line(...A,...Q,C.gold,5)+line(...B,...Q,C.cyan,5)+path([[B[0]-18,B[1]],[B[0]-18,B[1]-18],[B[0],B[1]-18]],C.dim,2)+arc(...A,65,-a,0,C.purple)+text('斜めの辺：長さを固定',125,105,28,C.gold)+text('向かい側の辺',625,300,28,C.cyan)+text(`辺の比：${Math.sin(a).toFixed(2)}`,785,195,31,C.ink)+text('角度を大きくしても、比は1を超えない',240,505,28);}
 if(kind==='totalreflection-reflected-path')return text('臨界角より大きい入射角では、水の中へ全反射',100,35,31)+diagram(60*deg,u,true)+text('空気中へ進む屈折光はない。吸収のない境界を考える',95,505,27);
 if(kind==='totalreflection-water-example'){const a=(35+25*u)*deg,total=a>critical;return text('約49度の境目を、水側の入射角で確かめる',150,35,31)+diagram(a,u,total)+text(total?'臨界角を超えた → 水の中へ反射':'臨界角より小さい → 空気へ進む屈折光がある',200,505,27,total?C.gold:C.cyan);}
}
export function totalReflectionFrame(c,s,t){return c.visualPilot==='total-reflection-v1'?authoredMotionFrame(c,s,t,totalReflectionDiagram):null;}

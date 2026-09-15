export type V3=[number,number,number];
export const add=(a:V3,b:V3):V3=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
export const mul=(a:V3,s:number):V3=>[a[0]*s,a[1]*s,a[2]*s];
export const dot=(a:V3,b:V3)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
export const norm=(a:V3)=>Math.hypot(...a);
export const unit=(a:V3):V3=>mul(a,1/Math.max(norm(a),1e-9));
export function spherePoint(theta:number,phi:number,R=1):V3{return [R*Math.sin(theta)*Math.cos(phi),R*Math.sin(theta)*Math.sin(phi),R*Math.cos(theta)];}
export function rotate(p:V3,yaw:number,pitch:number):V3{
 const a=p[0]*Math.cos(yaw)-p[1]*Math.sin(yaw),b=p[0]*Math.sin(yaw)+p[1]*Math.cos(yaw);
 return [a,b*Math.sin(pitch)+p[2]*Math.cos(pitch),b*Math.cos(pitch)-p[2]*Math.sin(pitch)];
}
/** Orthographic camera: rotating the camera never changes any physics values. */
export function project(p:V3,yaw:number,pitch:number):V3{const q=rotate(p,yaw,pitch);return [240+q[0]*92,175-q[1]*92,q[2]];}
export function electricAt(p:V3,q:V3=[0,0,0]):V3{const r=add(p,mul(q,-1)),d=norm(r);return d<1e-8?[0,0,0]:mul(r,1/d**3);}
export function sphereFlux(d:number,R:number){return Math.abs(Math.abs(d)-R)<1e-6?null:Math.abs(d)<R?1:0;}
// Torus: a ray starting inside one tube can exit, enter the far tube, and exit again.
export function torusSignedDistance(p:V3){return Math.hypot(Math.hypot(p[0],p[1])-1,p[2])-.36;}
export function torusCrossings(origin:V3,direction:V3){
 const d=unit(direction),out:{point:V3;sign:number}[]=[];
 for(let t=.005;t<3.5;t+=.005){const a=torusSignedDistance(add(origin,mul(d,t-.005))),b=torusSignedDistance(add(origin,mul(d,t)));
  if(a*b<0){let lo=t-.005,hi=t;for(let k=0;k<18;k++){const mid=(lo+hi)/2;if(torusSignedDistance(add(origin,mul(d,lo)))*torusSignedDistance(add(origin,mul(d,mid)))<=0)hi=mid;else lo=mid;}out.push({point:add(origin,mul(d,(lo+hi)/2)),sign:a<0?1:-1});}
 }return out;
}
export type Scene3D='plane'|'square'|'sphere-area'|'sphere'|'offset'|'outside'|'solid-angle'|'crossings'|'superposition'|'wire'|'shell'|'conductor';
export function scene3DFor(cycle:string,phase:number):Scene3D|undefined{
 if(cycle==='surface')return 'plane';if(cycle==='double')return 'square';if(cycle==='sphere-area')return 'sphere-area';
 if(cycle==='sphere-flux')return 'sphere';if(['offset','substitute'].includes(cycle))return 'offset';
 if(cycle==='evaluate')return phase===3?'outside':'offset';if(cycle==='angle')return 'solid-angle';
 if(cycle==='closed')return phase===3?'superposition':'crossings';if(cycle==='apply')return phase===0?'sphere':'wire';
 if(cycle==='zero')return phase===0?'outside':phase===3?'conductor':'shell';
}

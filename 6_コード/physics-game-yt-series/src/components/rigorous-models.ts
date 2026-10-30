/** Dimensionless display example: L=H=1m, alpha=1 V/m^2, q=-e. */
export function electronState(u:number,straight=false){
 const x=u,y=straight?u:u*u;
 return {x,y,ex:x,ey:y,tx:1,ty:straight?1:2*u,fx:-x,fy:-y,
  workPerE:straight?-u*u:-(u*u+u**4)/2,
  ratePerE:straight?-2*u:-(u+2*u**3)};
}
/** Polar integrand of flux / (4 pi k Q), after azimuth integration. */
export function offsetDensity(theta:number,d:number,R=1){
 const r2=R*R+d*d+2*R*d*Math.cos(theta);
 return R*R*(R+d*Math.cos(theta))*Math.sin(theta)/(2*r2**1.5);
}
export function midpointIntegral(f:(x:number)=>number,a:number,b:number,n=2000){
 const h=(b-a)/n;let s=0;for(let i=0;i<n;i++)s+=f(a+(i+.5)*h);return s*h;
}

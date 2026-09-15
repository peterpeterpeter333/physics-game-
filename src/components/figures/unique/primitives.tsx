import type { ReactNode } from 'react';
export const ink = { cyan:'#4ee1ff', gold:'#ffd166', purple:'#bb9aff', red:'#ff8a8a', green:'#7bffb2', dim:'#9aa3c7' };
export type Shot = { heading:string; observe:string; draw:(p:number, yaw:number)=>ReactNode; spatial?:boolean };
export const label = (x:number,y:number,text:string,color=ink.dim,size=12) => <text x={x} y={y} fill={color} fontSize={size} textAnchor="middle">{text}</text>;
export const line = (x:number,y:number,a:number,b:number,color=ink.dim,dash=false) => <line x1={x} y1={y} x2={a} y2={b} stroke={color} strokeWidth={2} strokeDasharray={dash?'4 4':undefined}/>;
export const arrow = (x:number,y:number,a:number,b:number,color=ink.cyan) => {
  const t=Math.atan2(b-y,a-x),len=Math.hypot(a-x,b-y);
  return <g>{line(x,y,a,b,color)}{len>2&&<polygon points={`${a},${b} ${a-7*Math.cos(t)+3*Math.sin(t)},${b-7*Math.sin(t)-3*Math.cos(t)} ${a-7*Math.cos(t)-3*Math.sin(t)},${b-7*Math.sin(t)+3*Math.cos(t)}`} fill={color}/>}</g>;
};
export const ball=(x:number,y:number,r=7,color=ink.gold)=><circle cx={x} cy={y} r={r} fill={color}/>;
export const box=(x:number,y:number,w:number,h:number,color=ink.cyan)=><rect x={x} y={y} width={w} height={h} rx={5} stroke={color} fill={color} fillOpacity={.07}/>;
export const ring=(x:number,y:number,r:number,color=ink.cyan)=><circle cx={x} cy={y} r={r} stroke={color} fill="none" strokeWidth={2}/>;
export const poly=(points:number[][],color=ink.cyan,fill=false)=><polygon points={points.map(p=>p.join(',')).join(' ')} stroke={color} strokeWidth={2} fill={fill?color:'none'} fillOpacity={fill?.1:0}/>;
export const curve=(f:(x:number)=>number,x0=30,x1=290,color=ink.cyan)=><polyline points={Array.from({length:81},(_,i)=>{const x=x0+(x1-x0)*i/80;return `${x},${f(x)}`;}).join(' ')} fill="none" stroke={color} strokeWidth={2.4}/>;
export const many=(n:number,f:(i:number)=>ReactNode)=>Array.from({length:n},(_,i)=><g key={i}>{f(i)}</g>);
export const project=(x:number,y:number,z:number,yaw:number):[number,number]=>{
  const X=x*Math.cos(yaw)+z*Math.sin(yaw), Z=-x*Math.sin(yaw)+z*Math.cos(yaw);
  return [160+X,112-y*.9+Z*.42];
};
export const plane=(normalAngle:number,yaw:number,size=48,color=ink.gold)=>{
  const u=[Math.cos(normalAngle),Math.sin(normalAngle),0],v=[0,0,1];
  return poly([[-1,-1],[1,-1],[1,1],[-1,1]].map(([a,b])=>project(size*(a*u[0]+b*v[0]),size*(a*u[1]+b*v[1]),size*(a*u[2]+b*v[2]),yaw)),color,true);
};

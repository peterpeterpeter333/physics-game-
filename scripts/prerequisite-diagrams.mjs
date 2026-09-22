import {text,C as palette} from './all-film-visuals.mjs';
const C={...palette,yellow:palette.gold};
const fit=(s,x,y,size,width,color=C.ink)=>text(s,x,y,Math.min(size,width/Math.max(1,[...s].reduce((n,c)=>n+(/[\u0020-\u007e]/.test(c)?.58:1),0))),color);
const line=(x,y,a,b,color=C.cyan,width=3)=>`<line x1="${x}" y1="${y}" x2="${a}" y2="${b}" stroke="${color}" stroke-width="${width}"/>`;
const arrow=(x,y,a,b,color)=>line(x,y,a,b,color,5)+`<path d="M -12 -6 L 0 0 L -12 6" fill="none" stroke="${color}" stroke-width="4" transform="translate(${a},${b}) rotate(${Math.atan2(b-y,a-x)*180/Math.PI})"/>`;
export function prerequisiteDiagram(c,s,p){
 const d=s.diagram;if(!d)return null;
 const q=Math.min(1,p*3), ease=.5-.5*Math.cos(Math.PI*q);
 if(d.kind==='numberline'){
  const X=x=>100+x*140,pos=d.from+(d.to-d.from)*ease;
  let svg=text('位置の基準：0 m ／ 右向きをプラス',80,50,26)+line(80,240,900,240,C.dim);
  for(let x=0;x<=5;x++)svg+=line(X(x),230,X(x),250,C.dim)+text(`${x} m`,X(x)-15,290,22);
  svg+=`<circle cx="${X(pos)}" cy="210" r="19" fill="${C.cyan}"/>`+arrow(X(d.from),155,X(pos),155,C.gold)+text(`位置 ${pos.toFixed(2)} m`,80,350,25,C.cyan)+text(`時計 ${(d.t0+(d.t1-d.t0)*ease).toFixed(2)} s`,570,350,25,C.green);
  return svg;
 }
 if(d.kind==='plot'){
  const pts=d.points;const xmin=Math.min(0,...pts.map(v=>v[0])),xmax=Math.max(1,...pts.map(v=>v[0]));
  const ymin=Math.min(0,...pts.map(v=>v[1])),ymax=Math.max(1,...pts.map(v=>v[1]));
  const X=x=>100+740*(x-xmin)/(xmax-xmin),Y=y=>305-220*(y-ymin)/(ymax-ymin);
  let svg=fit(d.yLabel,70,35,23,840)+fit(d.xLabel,610,375,23,370)+line(X(xmin),Y(0),880,Y(0),C.dim)+line(X(0),330,X(0),60,C.dim);
  for(let i=0;i<=4;i++){const x=xmin+(xmax-xmin)*i/4,y=ymin+(ymax-ymin)*i/4;svg+=text(Number(x.toFixed(2)).toString(),X(x)-8,345,17,C.dim)+text(Number(y.toFixed(2)).toString(),35,Y(y)+5,17,C.dim);}
  const segment=Math.min(pts.length-2,Math.floor(ease*(pts.length-1))),frac=ease*(pts.length-1)-segment;
  const live=[pts[segment][0]+(pts[segment+1][0]-pts[segment][0])*frac,pts[segment][1]+(pts[segment+1][1]-pts[segment][1])*frac];
  const shown=[...pts.slice(0,segment+1),live];
  if(d.area){svg+=`<path d="M ${X(shown[0][0])} ${Y(0)} ${shown.map(v=>`L ${X(v[0])} ${Y(v[1])}`).join(' ')} L ${X(live[0])} ${Y(0)} Z" fill="${C.green}" opacity=".17"/>`;}
  if(d.tiles){const n=d.tileCount??(4+Math.floor(ease*16));for(let i=0;i<n;i++){const x=xmin+(xmax-xmin)*i/n,sample=x+(d.right?(xmax-xmin)/n:0);let j=pts.findIndex((v,k)=>k<pts.length-1&&sample>=v[0]&&sample<=pts[k+1][0]);j=Math.max(0,j);const a=pts[j],b=pts[j+1],y=a[1]+(b[1]-a[1])*(sample-a[0])/(b[0]-a[0]||1);svg+=`<rect x="${X(x)}" y="${Math.min(Y(y),Y(0))}" width="${740/n}" height="${Math.abs(Y(y)-Y(0))}" fill="${C.green}" opacity=".18" stroke="${C.green}"/>`;}}
  if(d.breakAt){
   const safe=segment===d.breakAt-1?shown.slice(0,-1):shown;
   svg+=`<path d="${safe.map((v,i)=>`${i===0||i===d.breakAt?'M':'L'} ${X(v[0])} ${Y(v[1])}`).join(' ')}" stroke="${C.cyan}" stroke-width="5" fill="none"/>`;
  }else svg+=`<polyline points="${shown.map(v=>`${X(v[0])},${Y(v[1])}`).join(' ')}" stroke="${C.cyan}" stroke-width="5" fill="none"/><circle cx="${X(live[0])}" cy="${Y(live[1])}" r="8" fill="${C.yellow}"/>`;
  if(d.slope){const a=pts[0],b=live;svg+=line(X(a[0]),Y(a[1]),X(b[0]),Y(a[1]),C.yellow)+line(X(b[0]),Y(a[1]),X(b[0]),Y(b[1]),C.yellow)+text('横の変化',400,395,20,C.yellow)+text('縦の変化',865,180,20,C.yellow);}
  return svg;
 }
 if(d.kind==='vectors'){
  const max=Math.max(1,...d.vectors.flatMap(v=>[Math.abs(v[0]),Math.abs(v[1])]));const k=130/max,ox=650,oy=215;
  let svg=line(460,oy,830,oy,C.dim)+line(ox,385,ox,65,C.dim)+text('横（右が正）',840,oy+8,18,C.dim)+text('縦（上が正）',ox+20,45,20,C.dim);
  d.vectors.forEach(([x,y,label],i)=>{const color=[C.cyan,C.yellow,C.green][i%3],xx=ox+x*k*ease,yy=oy-y*k*ease;svg+=arrow(ox,oy,xx,yy,color)+fit(label,30,55+i*45,22,370,color);if(d.components)svg+=line(xx,oy,xx,yy,C.dim)+line(ox,yy,xx,yy,C.dim)+text(`横 ${x} ／ 縦 ${y}`,40,265+i*35,22,color);});
  if(d.difference){const [a,b]=d.vectors;svg+=arrow(ox+a[0]*k*ease,oy-a[1]*k*ease,ox+b[0]*k*ease,oy-b[1]*k*ease,C.green)+text('緑：後 − 前',40,165,23,C.green);}
  return svg;
 }
 if(d.kind==='bars'){
  const max=Math.max(1,...d.values.map(Math.abs));let svg=fit(`比較する値：${d.unit}`,60,35,23,880);
  d.values.forEach((v,i)=>{const value=d.transfer?(i===0?v*(1-ease):d.values[0]*ease):v*ease;const y=80+i*75;svg+=fit(d.labels[i],30,y+28,22,265)+`<rect x="310" y="${y}" width="${Math.abs(value)/max*510}" height="40" rx="5" fill="${[C.cyan,C.yellow,C.green][i%3]}"/>`+text(Number(value.toFixed(3)).toString(),845,y+29,23);});return svg;
 }
 throw Error(`Unknown prerequisite diagram ${d.kind}`);
}

// Isolated S4 helper (2026-10-27); original S3 files remain unchanged.
// Claude-authorized S4 additions only. This module does not write files.
export function makeS4({W,card,ARW,n,textWidth}){
 const point=(ctx,name)=>{const p=ctx.anchor(name);return p?.length===3&&p[2]&&p.slice(0,2).every(Number.isFinite)?p:null;};
 const scaleIcon=(svg,x,y)=>`<g data-s4-primary="row28-icon" transform="translate(${x} ${y}) scale(1.3) translate(${-x} ${-y})">${svg}</g>`;
 function pin(ctx,name,label,x,y,op=1){
  const p=point(ctx,name);if(!p||op<=.003)return '';
  const width=Math.min(1000,textWidth(label,42)+52),x0=Math.max(40,Math.min(1040-width,x)),left=p[0]<x0+width/2;
  const edge=left?x0:x0+width,elbow=left?Math.min(edge,p[0]-24):Math.max(edge,p[0]+24);
  return `<g opacity="${n(op)}"><path d="M${n(edge)} ${n(y)} L${n(elbow)} ${n(y)} L${n(p[0])} ${n(p[1])}" fill="none" stroke="#f4e8cc" stroke-width="5"/><circle cx="${n(p[0])}" cy="${n(p[1])}" r="7" fill="#ffd23f"/></g>`+card(label,x0,y,{size:42,op});
 }
 function flow(ctx,a,b,{color='#328dff',op=1,bend=0}={}){
  const p=point(ctx,a),q=point(ctx,b);if(!p||!q||op<=.003||Math.hypot(q[0]-p[0],q[1]-p[1])<8)return '';
  const x0=p[0]+bend,x1=q[0]+bend,y0=p[1],y1=q[1],ang=Math.atan2(y1-y0,x1-x0),h=25;
  return `<g opacity="${n(op)}"><path d="M${n(x0)} ${n(y0)} L${n(x1)} ${n(y1)}" fill="none" stroke="#10253b" stroke-width="17" stroke-linecap="round"/><path d="M${n(x0)} ${n(y0)} L${n(x1)} ${n(y1)}" fill="none" stroke="${color}" stroke-width="11" stroke-linecap="round"/><path d="M${n(x1)} ${n(y1)} L${n(x1-h*Math.cos(ang-.55))} ${n(y1-h*Math.sin(ang-.55))} L${n(x1-h*Math.cos(ang+.55))} ${n(y1-h*Math.sin(ang+.55))} Z" fill="${color}" stroke="#10253b" stroke-width="2"/></g>`;
 }
 function waterMark(ctx,op=1){
  const p=point(ctx,'pumpwater');if(!p||op<=.003)return '';
  return `<g opacity="${n(op)}"><path d="M${n(p[0]-46)} ${n(p[1])} H${n(p[0]+46)}" stroke="#1c5672" stroke-width="12" stroke-linecap="round"/><path d="M${n(p[0]-46)} ${n(p[1])} H${n(p[0]+46)}" stroke="#fff" stroke-width="6" stroke-linecap="round"/></g>`;
 }
 function addedS4(ctx,k,on){
  let svg='';const t=ctx.t;
  if(k==='pump:rod'){const a=W(k,'弁が一つずつ');svg+=pin(ctx,'pistonvalve','ふたの弁',40,450,on(a))+pin(ctx,'footvalve','底の弁',820,1050,on(a));}
  if(k==='pump:down')svg+=flow(ctx,'pumpbelow','pumpabove',{op:on(W(k,'開きます')+.08)})+waterMark(ctx);
  if(k==='pump:up')svg+=flow(ctx,'pumpabove','pumpwater',{op:on(W(k,'閉じます')+.15),bend:45})+waterMark(ctx);
  if(k==='pump:refill')svg+=flow(ctx,'pumpoutside','pumpinlet',{op:on(W(k,'底の弁が開き')+.10)});
  if(k==='pump:novalve'){
   const up=W(k,'ふたが上がっても'),back=W(k,'一方にしか開かない弁'),up2=W(k,'上へしか進めない')-.2;
   if(t>=up&&t<back+.3)svg+=flow(ctx,'pumpabove','pumpbelow',{color:'#ed5b52',op:on(up)});
   if(t>=up2)svg+=flow(ctx,'pumpbelow','pumpabove',{op:on(up2)});
   svg+=waterMark(ctx);
  }
  if(k==='next:spread')svg+=pin(ctx,'britain','イギリス',40,330,on(W(k,'イギリス')));
  return svg;
 }
 return {pin,addedS4,scaleIcon};
}


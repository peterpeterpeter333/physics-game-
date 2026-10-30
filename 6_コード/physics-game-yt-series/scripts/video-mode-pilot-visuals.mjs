const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const text=(x,y,s,color='#dce9ff',size=18)=>`<text x="${x}" y="${y}" fill="${color}" font-size="${size}">${esc(s)}</text>`;
const line=(x,y,a,b,color='#69dfff',width=2)=>`<line x1="${x}" y1="${y}" x2="${a}" y2="${b}" stroke="${color}" stroke-width="${width}"/>`;
const arrow=(x,y,a,b,color='#69dfff')=>{const t=Math.atan2(b-y,a-x);return line(x,y,a,b,color)+`<path d="M ${a-8*Math.cos(t-.4)} ${b-8*Math.sin(t-.4)} L ${a} ${b} L ${a-8*Math.cos(t+.4)} ${b-8*Math.sin(t+.4)}" fill="none" stroke="${color}" stroke-width="2"/>`;};
const circle=(x,y,r,c)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
export function pilotDiagram(clip,scene,t,captionIndex){
 if(!clip.id.startsWith('ue-why-'))return null;
 let body='';
 if(clip.id==='ue-why-08'){
  // Three different enclosing surfaces; a shared ray convention makes counts comparable.
  for(let j=0;j<3;j++){
   const cx=105+j*200,cy=159,r=45+j*12,pts=[];
   for(let i=0;i<=120;i++){const a=i/120*Math.PI*2,rr=r*(j===2?1+.20*Math.sin(3*a+t*.3):1);pts.push(`${cx+rr*Math.cos(a)},${cy+rr*Math.sin(a)}`);}
   body+=`<polygon points="${pts.join(' ')}" fill="#69dfff12" stroke="#69dfff" stroke-width="2"/>`;
   for(let i=0;i<8;i++){const a=i*Math.PI/4;body+=arrow(cx+14*Math.cos(a),cy+14*Math.sin(a),cx+86*Math.cos(a),cy+86*Math.sin(a),'#ffd36a');const rr=20+(t*12%58);body+=circle(cx+rr*Math.cos(a),cy+rr*Math.sin(a),2,'#fff');}
   body+=circle(cx,cy,9,'#ffd36a')+text(cx-6,cy+6,'+','#0b1122')+text(cx-38,275,['小さい面','大きい面','ゆがんだ面'][j]);
  }
  body+=text(35,30,'同じ電荷・同じ線の描き方で、囲む面だけを変える',undefined,19)+text(85,318,'どの面も、外へ出る線を同じ本数だけ横切る','#ffd36a',18);
 }else if(clip.id==='ue-why-09'){
  const cx=172,cy=170,r=102;
  body+=text(24,30,'同じクーロンの法則を、定数の書き方だけ変える',undefined,19);
  for(let k=-3;k<=3;k++){const lat=k*Math.PI/8,z=r*Math.sin(lat),rad=r*Math.cos(lat);body+=`<ellipse cx="${cx}" cy="${cy+z*.85}" rx="${rad}" ry="${rad*.28}" fill="none" stroke="#69dfff" opacity=".55"/>`;}
  for(let k=0;k<6;k++){const a=k*Math.PI/6+t*.09;body+=`<ellipse cx="${cx}" cy="${cy}" rx="${Math.max(1,Math.abs(r*Math.cos(a)))}" ry="${r}" fill="none" stroke="#69dfff" opacity=".35"/>`;}
  body+=circle(cx,cy,8,'#ffd36a')+text(cx-6,cy+6,'+','#0b1122')+arrow(cx,cy,cx+r,cy,'#ffd36a')+text(cx+45,cy-12,'r','#ffd36a');
  body+=text(325,117,'球の表面積：4πr²','#69dfff',23)+text(325,175,'電場の強さ：kQ/r²','#ffd36a',23)+text(325,233,'掛けると：4πkQ','#9ae8b5',23)+text(60,315,'k = 1 / (4πε₀) と書けば、4πk = 1 / ε₀',undefined,22);
 }else if(clip.id==='ue-why-10'){
  const angle=captionIndex===0?0:captionIndex>=3?Math.PI/3:Math.min(1,(t%10)/5)*Math.PI/3;
  const cx=320,cy=165,len=160,dx=len/2*Math.sin(angle),dy=len/2*Math.cos(angle);
  body+=text(25,28,'線は同じまま。面を傾けて、通り抜ける本数を比べる',undefined,18);
  for(let k=-3;k<=3;k++){const y=cy+(k+.5)*40;if(y<45||y>285)continue;const hit=Math.abs(y-cy)<dy;body+=arrow(50,y,560,y,hit?'#69dfff':'#42526d');}
  body+=line(cx-dx,cy-dy,cx+dx,cy+dy,'#ffd36a',6)+line(425,cy-dy,425,cy+dy,'#9ae8b5',4)+arrow(cx,cy,cx+70*Math.cos(angle),cy-70*Math.sin(angle),'#ffa5c4');
  body+=text(260,302,'面の長さ：4','#ffd36a')+text(440,cy+5,`正面からの幅：${(4*Math.cos(angle)).toFixed(1)}`,'#9ae8b5',16)+text(30,330,`傾き：${Math.round(angle*180/Math.PI)}°　／　線をさえぎる幅 = 4 cos θ`,undefined,19);
 }
 return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="350" viewBox="0 0 640 350">${body}</svg>`;
}
export function pilotEquation(clip,scene,captionIndex){
 if(clip.id==='ue-why-10')return captionIndex>=3?scene.equations[0]:'';
 if(clip.id!=='ue-gauss-01'||!clip.revision)return undefined;
 const r=String.raw;
 const equations=[
  [r`\vec r=(R\sin\theta\cos\varphi,R\sin\theta\sin\varphi,a+R\cos\theta)`,r`\vec E=kQ\vec r/r^3`],
  [r`\vec n=(\sin\theta\cos\varphi,\sin\theta\sin\varphi,\cos\theta)`],
  [r`\vec r\cdot\vec n=R\sin^2\theta+(a+R\cos\theta)\cos\theta`,r`\sin^2\theta+\cos^2\theta=1`,r`\vec r\cdot\vec n=R+a\cos\theta`],
  [r`\vec E\cdot\vec n=kQ\frac{R+a\cos\theta}{(R^2+a^2+2Ra\cos\theta)^{3/2}}`,r`r^2=R^2+a^2+2Ra\cos\theta,\quad (r^2)^{3/2}=r^3`]
 ];
 const selected=equations[scene.index];return selected[Math.min(captionIndex,selected.length-1)];
}

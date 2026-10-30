// Diagrams for the v2 Maxwell film, part p34 (chapter 3 magnets / Gauss's law for B,
// chapter 4 current → magnetic field / Ampère's law). Keys: 'mx3-n-*', 'mx4-n-*'.
// Stage 1200×515; the compact progress bar uses y 0–72, pictures use y 85–515.
// Chapter 3 base: one bar magnet (S left, N right). Its field is modelled by pole sheets on the
// two end faces; closed loops are completed through the interior from S to N.
// Chapter 4 base: a vertical wire (current up) through a horizontal plate seen obliquely
// (plate coordinates X right, Z toward the viewer). B = ŷ × r̂ → horizontal direction (Z,−X):
// counter-clockwise seen from above, so on the front of a ring it points to the right.
import {MX,clamp,mix,smooth,fade,label,line,dot,ring,draw,arrow,tex,texWidth,stage,word,callout,causal,check,charge,compass,fieldLines,fit,evidenceCard} from './mx-common.mjs';

// ---- timing: elements appear when the narration reaches a word of the reading ----------
const VE=ctx=>Math.max(.6,ctx.dur-(ctx.cue?.pause??0)-.12);
function at(ctx,kw,n=1){const r=ctx.cue?.reading??'';let i=-1;for(let k=0;k<n;k++){i=r.indexOf(kw,i+1);if(i<0)throw Error(`mx2p34: "${kw}" not in reading: ${r}`);}return VE(ctx)*i/r.length;}
const on=(ctx,kw,d=.45,n=1)=>smooth(clamp((ctx.t-at(ctx,kw,n))/d));
const since=(ctx,kw,n=1)=>ctx.t-at(ctx,kw,n);
const hexRGB=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const mixC=(a,b,u)=>{const A=hexRGB(a),B=hexRGB(b);return '#'+A.map((v,i)=>Math.round(mix(v,B[i],clamp(u))).toString(16).padStart(2,'0')).join('');};
const head=(x,y,a,color=MX.B,s=13)=>`<polygon points="${x+s*Math.cos(a)},${y+s*Math.sin(a)} ${x-s*.7*Math.cos(a)+s*.6*Math.sin(a)},${y-s*.7*Math.sin(a)-s*.6*Math.cos(a)} ${x-s*.7*Math.cos(a)-s*.6*Math.sin(a)},${y-s*.7*Math.sin(a)+s*.6*Math.cos(a)}" fill="${color}"/>`;
const cB=v=>`{\\color{${MX.B}}${v}}`,cI=v=>`{\\color{${MX.I}}${v}}`;
const DIM='#56637d';
const panel=(g,inner,{x=740,y=95,w=440,h=405}={})=>callout(x,y,w,h,inner,g);

// =====================================================================================
// Chapter 3: bar magnet
// =====================================================================================
const M={x:600,y:322,w:280,h:80};const ML=M.x-M.w/2,MR=M.x+M.w/2,MT=M.y-M.h/2,MB=M.y+M.h/2;
const POLES=[];for(let i=0;i<9;i++){const y=MT+4+(M.h-8)*i/8;POLES.push([MR,y,1/9],[ML,y,-1/9]);}
function Bf(x,y){let bx=0,by=0;for(const [px,py,q] of POLES){const dx=x-px,dy=y-py,r2=dx*dx+dy*dy+4,r3=r2*Math.sqrt(r2);bx+=q*dx/r3;by+=q*dy/r3;}return [bx,by];}
const inMag=(x,y,m=1)=>x>=ML-m&&x<=MR+m&&y>=MT-m&&y<=MB+m;
function trace(x,y){const pts=[[x,y]];for(let i=0;i<3000;i++){let [bx,by]=Bf(x,y);let m=Math.hypot(bx,by);const hx=x+1.5*bx/m,hy=y+1.5*by/m;[bx,by]=Bf(hx,hy);m=Math.hypot(bx,by);x+=3*bx/m;y+=3*by/m;pts.push([x,y]);
 if(inMag(x,y))return {pts,closed:x<M.x};if(x<-60||x>1260||y<40||y>580)return {pts,closed:false};}return {pts,closed:false};}
const LOOP_X=[736,714,688];
const LOOPS=[];
LOOP_X.forEach((x0,i)=>{for(const s of [-1,1]){
 const r=trace(x0,s<0?MT-1:MB+1);if(!r.closed)continue;
 const out=r.pts.map(([x,y])=>[x,y]),end=out[out.length-1],yi=M.y+s*(8+i*14);
 const inner=[[end[0],s<0?MT:MB],[end[0]+6,yi],[x0-6,yi],[x0,s<0?MT:MB]];
 LOOPS.push({out,inner,all:[...out,...inner.slice(1)]});
}});
const OPEN0=[M.y-30,M.y-20,M.y+20,M.y+30].map(y0=>trace(MR+2,y0).pts);
const OPEN=[...OPEN0,...OPEN0.map(pts=>pts.map(([x,y])=>[2*M.x-x,y]).reverse())];
const len=pts=>{let L=0;for(let i=1;i<pts.length;i++)L+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);return L;};
function pointAt(pts,u){const L=len(pts)*(((u%1)+1)%1);let a=0;for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);if(a+d>=L){const v=(L-a)/Math.max(d,1e-6);return [mix(pts[i-1][0],pts[i][0],v),mix(pts[i-1][1],pts[i][1],v),Math.atan2(pts[i][1]-pts[i-1][1],pts[i][0]-pts[i-1][0])];}a+=d;}const q=pts[pts.length-1];return [q[0],q[1],0];}
const clipDef=`<defs><clipPath id="mx34stage"><rect x="0" y="84" width="1200" height="431"/></clipPath></defs>`;
function lines3({p=1,op=1,heads=0,flow=0,w=4,open=true}={}){
 let s='';const all=[...LOOPS.map(l=>l.out),...(open?OPEN:[])];
 for(const pts of all){s+=draw(pts,p,{color:MX.B,w,opacity:op});
  if(heads>0){for(const u of [.3,.7]){const [x,y,a]=pointAt(pts,u+flow*.04);if(y>92)s+=fade(heads*op,head(x,y,a));}}}
 return `<g clip-path="url(#mx34stage)">${clipDef}${s}</g>`;
}
// Iron filings on a jittered grid (deterministic).
let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const FIL=[];for(let y=104;y<506;y+=22)for(let x=18;x<1190;x+=24){const px=x+rnd()*14,py=y+rnd()*12;if(inMag(px,py,10))continue;const [bx,by]=Bf(px,py);FIL.push({x:px,y:py,a0:rnd()*Math.PI,a1:Math.atan2(by,bx),str:Math.hypot(bx,by),d:rnd()});}
function filings(fall,align,op=1){if(fall<=0||op<=0)return '';let s='';
 for(const f of FIL){const g=clamp(fall*1.6-f.d*.6);if(g<=0)continue;let da=f.a1-f.a0;da=((da+Math.PI/2)%Math.PI+Math.PI)%Math.PI-Math.PI/2;
  const a=f.a0+da*clamp(align*1.4-f.d*.4),y=f.y-40*(1-g),L=7,c=Math.cos(a)*L,sn=Math.sin(a)*L,o=g*op*(.35+.65*clamp(f.str*9000));
  s+=`<line x1="${(f.x-c).toFixed(1)}" y1="${(y-sn).toFixed(1)}" x2="${(f.x+c).toFixed(1)}" y2="${(y+sn).toFixed(1)}" stroke="#c9d1de" stroke-width="3" stroke-linecap="round" opacity="${o.toFixed(2)}"/>`;}
 return s;}
function bar(x,y,w,h,{op=1,left=MX.minus,right=MX.plus,labels=true,size=34}={}){
 return fade(op,`<rect x="${x-w/2}" y="${y-h/2}" width="${w/2}" height="${h}" fill="${left}" rx="5"/><rect x="${x}" y="${y-h/2}" width="${w/2}" height="${h}" fill="${right}" rx="5"/>`
  +(labels?label('S',x-w/4,y+size*.36,{size,color:'#fff',anchor:'middle',weight:700})+label('N',x+w/4,y+size*.36,{size,color:'#fff',anchor:'middle',weight:700}):''));}
const magBase=(op=1)=>bar(M.x,M.y,M.w,M.h,{op});
const paper=g=>fade(g,`<rect x="40" y="${mix(-300,95,g)}" width="1120" height="412" rx="6" fill="${MX.paper}" fill-opacity=".10" stroke="${MX.paper}" stroke-opacity=".35" stroke-width="2"/>`);
function magTranslucent(op){return fade(op,`<rect x="${ML}" y="${MT}" width="${M.w/2}" height="${M.h}" fill="${MX.minus}" fill-opacity=".45" rx="5"/><rect x="${M.x}" y="${MT}" width="${M.w/2}" height="${M.h}" fill="${MX.plus}" fill-opacity=".45" rx="5"/>`);}
const poleLabels=()=>label('S',ML-26,M.y+12,{size:34,color:MX.minus,anchor:'middle',weight:700})+label('N',MR+26,M.y+12,{size:34,color:MX.plus,anchor:'middle',weight:700});
// Loops with the interior drawn and dots circulating along B (S→N inside, N→S outside).
function loops3({inner=1,dots=0,T=0,op=1,glow=0,only=-1,heads=0}={}){let s='';
 LOOPS.forEach((l,i)=>{const o=only<0||only===i?op:op*.22;
  if(glow>0&&(only<0||only===i))s+=draw(l.all,1,{color:MX.B,w:12,opacity:.18*glow});
  s+=draw(l.out,1,{color:MX.B,w:4,opacity:o});
  if(inner>0)s+=draw(l.inner,inner,{color:MX.B,w:4,opacity:o});
  if(heads>0)for(const u of [.25,.6]){const [x,y,a]=pointAt(l.out,u);s+=fade(heads*o,head(x,y,a));}
  if(dots>0&&(only<0||only===i)){const L=len(l.all);for(let k=0;k<3;k++){const [x,y]=pointAt(l.all,k/3+T*110/L);s+=fade(dots,dot(x,y,6,MX.hi));}}});
 return s;}
// Pieces after cutting. level L: 2^L pieces; u = split progress; cu = colour of the new faces.
function pieces(L,u,cu){const n=2**L,w=M.w/n,gaps=[0,46,26,14],G=gaps[L];let s='';
 const pg=gaps[L-1]??0,np=n/2,pw=M.w/np;
 for(let j=0;j<np;j++){const pc=M.x+(j-(np-1)/2)*(pw+pg);
  for(const side of [-1,1]){
   const x=pc+side*(w/2)+side*u*G/2;
   const l=side<0?MX.minus:mixC(MX.plus,MX.minus,cu),r=side<0?mixC(MX.minus,MX.plus,cu):MX.plus;
   const lab=L<=2,size=L===1?30:24;
   s+=bar(x,M.y,w,M.h,{left:l,right:r,labels:false});
   if(lab){s+=label('S',x-w/4,M.y+size*.36,{size,color:'#fff',anchor:'middle',weight:700,opacity:side<0?1:cu})+label('N',x+w/4,M.y+size*.36,{size,color:'#fff',anchor:'middle',weight:700,opacity:side<0?cu:1});}
  }}
 return s;}
// Closed bag (Gaussian surface) centred at (cx,cy); wobble changes its shape.
const BR=86;
const bagR=(a,ph,wob)=>BR*(1+wob*(.2*Math.sin(3*a+ph)+.12*Math.sin(2*a-1.7*ph+1)));
function bagPath(cx,cy,ph,wob){const pts=[];for(let i=0;i<=120;i++){const a=2*Math.PI*i/120,r=bagR(a,ph,wob);pts.push([cx+r*Math.cos(a),cy+r*Math.sin(a)]);}return pts;}
function crossings(cx,cy,ph,wob,only=-1){const res=[];const ins=([x,y])=>Math.hypot(x-cx,y-cy)<bagR(Math.atan2(y-cy,x-cx),ph,wob);
 LOOPS.forEach((l,li)=>{if(only>=0&&li!==only)return;const P=l.all;for(let i=1;i<P.length;i++){const a=ins(P[i-1]),b=ins(P[i]);if(a!==b){let lo=0,hi=1;for(let k=0;k<12;k++){const m=(lo+hi)/2,q=[mix(P[i-1][0],P[i][0],m),mix(P[i-1][1],P[i][1],m)];if(ins(q)===a)lo=m;else hi=m;}
  res.push({x:mix(P[i-1][0],P[i][0],lo),y:mix(P[i-1][1],P[i][1],lo),a:Math.atan2(P[i][1]-P[i-1][1],P[i][0]-P[i-1][0]),out:a&&!b});}}});
 const ang=c=>((Math.atan2(c.y-cy,c.x-cx)+Math.PI/2)%(2*Math.PI)+2*Math.PI)%(2*Math.PI);
 return res.sort((a,b)=>ang(a)-ang(b));}
const OUTC=MX.good,INC='#ff9ce6';
// Crossing marks: a short field arrow through the surface + a coloured dot (green out, pink in).
function marks(cr,g,{arrows=true}={}){return fade(g,cr.map(c=>(arrows?arrow(c.x-20*Math.cos(c.a),c.y-20*Math.sin(c.a),c.x+26*Math.cos(c.a),c.y+26*Math.sin(c.a),{color:MX.B,w:4,head:12}):'')+`<circle cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="8" fill="${c.out?OUTC:INC}" stroke="#0d1526" stroke-width="2"/>`).join(''));}
function bagSvg(cx,cy,ph,wob,g=1){const bp=bagPath(cx,cy,ph,wob);return draw(bp,g,{color:'#ffffff',w:4,dash:'12 7'})+fade(g,`<polygon points="${bp.map(q=>q.map(v=>v.toFixed(1)).join(',')).join(' ')}" fill="#ffffff" fill-opacity=".06"/>`);}
const BAG0=[MR-5,M.y];
// Compass positions on the paper for chapter 3.
const CMP=[[MR+80,M.y],[ML-80,M.y],[M.x,MT-80],[M.x,MB+80],[MR+60,MT-70],[ML-60,MT-70],[MR+60,MB+70],[ML-60,MB+70],[M.x+170,MT-150],[M.x-170,MT-150],[M.x+170,MB+130],[M.x-170,MB+130],[MR+170,M.y],[ML-170,M.y]];
const bAng=(x,y)=>{const [bx,by]=Bf(x,y);return Math.atan2(-by,bx)*180/Math.PI;};
function swing(a0,a1,t,t0){if(t<t0)return a0;const u=t-t0;let d=a1-a0;d=((d+180)%360+360)%360-180;return a1-d*Math.exp(-2.6*u)*Math.cos(7*u);}

// =====================================================================================
// Chapter 4: wire through a plate
// =====================================================================================
const P4={cx:400,cy:390,rx:300,k:.367};
const pj=(X,Z)=>[P4.cx+X,P4.cy+P4.k*Z];
const RC=170,PHI=[0,1,2,3,4,5,6].map(i=>Math.PI/2+i*2*Math.PI/7);
function plate(){return `<ellipse cx="${P4.cx}" cy="${P4.cy}" rx="${P4.rx}" ry="${P4.rx*P4.k}" fill="#1b2a4a" fill-opacity=".85" stroke="#3b4f78" stroke-width="3"/>`;}
function wireLower(c){return line(P4.cx,P4.cy,P4.cx,510,{color:mixC('#6c7a94',MX.I,c),w:12,opacity:.45});}
function wireUpper(c,T,{glow=0,I=1,top=150}={}){const col=mixC('#6c7a94',MX.I,c);let s='';
 if(glow>0)s+=line(P4.cx,top,P4.cx,P4.cy,{color:MX.I,w:34,opacity:.25*glow});
 s+=`<ellipse cx="${P4.cx}" cy="${P4.cy}" rx="11" ry="4" fill="#0d1526"/>`+line(P4.cx,top,P4.cx,P4.cy,{color:col,w:12*(I>1?1.4:1)});
 if(c>0){for(let k=0;k<4;k++){const y=P4.cy-((T*90+k*60)%240);if(y>top+10)s+=fade(c,line(P4.cx,y,P4.cx,y-18,{color:'#fff7c2',w:4}));}
  s+=fade(c,`<polygon points="${P4.cx},${top-22} ${P4.cx-17},${top+8} ${P4.cx+17},${top+8}" fill="${MX.I}"/>`+tex('I',P4.cx+34,top+8,{size:36,color:MX.I,auto:false}));}
 return s;}
// Needle angle at plate point (X,Z): current field (Z,−X) plus a weak earth field (0,−1).
function needle(X,Z,c,ratio=12){const r=Math.hypot(X,Z),bw=c*ratio*RC/r;const bx=bw*Z/r,bz=-bw*X/r-1;return Math.atan2(-P4.k*bz,bx)*180/Math.PI;}
function compassAt(phi,ang,g=1,r=24,R=RC){const [x,y]=pj(R*Math.cos(phi),R*Math.sin(phi));return compass(x,y,ang,{r,g});}
function ringPlate(r,{p=1,color=MX.B,w=4,op=1,heads=0,flow=0,dash=''}={}){const pts=[];for(let i=0;i<=96;i++){const a=Math.PI/2-2*Math.PI*i/96;pts.push(pj(r*Math.cos(a),r*Math.sin(a)));}
 let s=draw(pts,p,{color,w,opacity:op,dash});
 if(heads>0)for(let k=0;k<3;k++){const a=Math.PI/2+.5-2*Math.PI*(k/3+flow);const [x,y]=pj(r*Math.cos(a),r*Math.sin(a));const dx=Math.sin(a),dy=-P4.k*Math.cos(a);s+=fade(heads*op,head(x,y,Math.atan2(dy,dx),color,15));}
 return s;}
function base4(ctx,{c=1,T=0,rings=null,glow=0,I=1,top=150}={}){return wireLower(c)+plate()+(rings??'')+wireUpper(c,T,{glow,I,top});}
// Screen direction of B (unit, in screen px) at plate angle phi.
const bDir=phi=>{const dx=Math.sin(phi),dy=-P4.k*Math.cos(phi),n=Math.hypot(dx,dy);return [dx/n,dy/n];};
const FORM=`${cB('B')}=\\dfrac{\\mu_0 ${cI('I')}}{2\\pi r}`;
// The walker (a small figure) at screen point (x,y).
const walker=(x,y,g=1)=>fade(g,`<circle cx="${x}" cy="${y-30}" r="9" fill="${MX.good}"/>`+line(x,y-21,x,y-2,{color:MX.good,w:6}));
// Right hand gripping the wire: thumb up along the current, fingers curling round the front
// from left to right (= counter-clockwise seen from above = the field direction).
function fist(x,y0,g){const skin='#e8b58c',edge='#a8744f';let s='';
 s+=`<rect x="${x-64}" y="${y0-4}" width="40" height="92" rx="16" fill="${mixC(skin,'#000000',.18)}" stroke="${edge}" stroke-width="2"/>`;
 for(let i=0;i<4;i++){const yc=y0+10+i*22;
  s+=`<path d="M ${x-40} ${yc} A 44 15 0 0 0 ${x+40} ${yc}" fill="none" stroke="${edge}" stroke-width="22" stroke-linecap="round"/>`
   +`<path d="M ${x-40} ${yc} A 44 15 0 0 0 ${x+40} ${yc}" fill="none" stroke="${skin}" stroke-width="18" stroke-linecap="round"/>`;}
 s+=`<rect x="${x-12}" y="${y0-66}" width="24" height="86" rx="12" fill="${skin}" stroke="${edge}" stroke-width="2"/>`;
 return fade(g,s);}

// =====================================================================================
export const mx2p34Diagrams={
 // ---------------------------------------------------------------- chapter 3
 // 砂鉄の模様（まず観察）
 'mx3-n-sand':(p,ctx)=>{
  const pg=on(ctx,'かみを',.7),fall=clamp(since(ctx,'さてつ')/1.2),align=clamp(since(ctx,'すると')/1.6);
  let s=magBase()+paper(pg)+filings(fall,align,1);
  s+=word('砂鉄',70,150,{size:30,g:on(ctx,'さてつ')*(1-on(ctx,'すると'))});
  s+=word('模様が 浮かぶ',600,480,{size:28,anchor:'middle',g:on(ctx,'もようが')});
  return stage(ctx,p,s);
 },
 // 模様だけでは向きが分からない → 方位磁針の N が指す向きを矢印に（26）
 'mx3-n-compass':(p,ctx)=>{const T=ctx.t,cg=at(ctx,'ちいさな'),ag=on(ctx,'やじるしに',.6);
  let s=fade(1-on(ctx,'ちいさな',.8),paper(1))+filings(1,1,1-.6*on(ctx,'ちいさな',.6))+magBase();
  s+=word('向きは？',600,130,{size:30,anchor:'middle',color:MX.hi,g:on(ctx,'どちら')*(1-on(ctx,'ちいさな'))});
  CMP.forEach(([x,y],i)=>{const t0=cg+i*.12,g=clamp((T-t0)/.3);if(g<=0)return;const a1=bAng(x,y),a=swing(a1+140-i*37,a1,T,t0+.2);
   s+=compass(x,y,a,{r:22,g:g*(1-.55*ag)});
   const r=a1*Math.PI/180;s+=arrow(x-24*Math.cos(r),y+24*Math.sin(r),x+30*Math.cos(r),y-30*Math.sin(r),{color:MX.B,w:5,head:14,g:ag});});
  s+=fade(on(ctx,'はりの',.5),callout(830,95,340,62,`<polygon points="860,126 900,116 900,136" fill="${MX.plus}"/><polygon points="940,126 900,116 900,136" fill="#dfe6f2"/>`+label('赤＝針の N極',955,137,{size:26,color:MX.ink,weight:700})));
  return stage(ctx,p,s);
 },
 // 矢印をつなぐと N から S への線 = 磁力線、電気力線と似ている
 'mx3-n-lines':(p,ctx)=>{const T=ctx.t,lp=clamp(since(ctx,'つなぐと')/1.6);
  let s=filings(1,1,.25)+lines3({p:lp,heads:clamp(lp*2-1),flow:T*.9})+magBase();
  CMP.forEach(([x,y])=>{const r=bAng(x,y)*Math.PI/180;s+=arrow(x-24*Math.cos(r),y+24*Math.sin(r),x+30*Math.cos(r),y-30*Math.sin(r),{color:MX.B,w:5,head:14,opacity:1-lp});});
  s+=word('N極から出て S極へ',600,490,{size:26,anchor:'middle',color:MX.B,g:on(ctx,'エヌきょくから')*(1-on(ctx,'でんきりきせん'))});
  s+=word('磁力線',60,140,{size:32,color:MX.B,g:on(ctx,'じりょくせん')});
  const g=on(ctx,'でんきりきせん',.6),ib=[900,95,1185,300];
  if(g>0){const ch=[{x:1105,y:180,q:1},{x:980,y:180,q:-1}];const fl=fieldLines(ch,{n:10,step:3,bounds:[ib[0]+4,ib[1]+4,ib[2]-4,ib[3]-50]});
   s+=callout(ib[0],ib[1],ib[2]-ib[0],ib[3]-ib[1],fl.map(l=>draw(l,1,{color:MX.E,w:2.5})).join('')+charge(1105,180,1,{r:18})+charge(980,180,-1,{r:18})+label('電気力線',1042,285,{size:24,color:MX.E,anchor:'middle',weight:700}),g);}
  return stage(ctx,p,s);
 },
 // 予想：真ん中で切ったら右半分は N だけ？（① ⑦）
 'mx3-n-predict':(p,ctx)=>{const T=ctx.t,pul=.5+.5*Math.sin(T*6);
  const eg=on(ctx,'プラス',.5),kg=on(ctx,'まんなかで',.6),rg=on(ctx,'みぎはんぶん',.5);
  let s=lines3({op:mix(.9,.3,smooth(clamp(T/.8))),heads:1})+magBase();
  s+=fade(eg*(1-kg*.6),callout(60,110,230,110,charge(120,165,1,{r:24})+label('だけ',160,176,{size:30,color:MX.ink,weight:700})));
  if(kg>0){const y=mix(100,MT-14,kg);s+=fade(kg,line(M.x,MT-12,M.x,MB+30,{color:'#ffffff',w:3,dash:'10 8'})+`<polygon points="${M.x-24},${y-26} ${M.x+24},${y-26} ${M.x},${y}" fill="#dfe6f2"/>`);}
  s+=fade(rg*(.6+.4*pul),`<rect x="${M.x+4}" y="${MT-8}" width="${M.w/2+6}" height="${M.h+16}" rx="9" fill="none" stroke="${MX.hi}" stroke-width="4"/>`);
  s+=fade(rg,label('？',M.x+28,M.y+14,{size:40,color:MX.hi,anchor:'middle',weight:700}));
  s+=word('右半分は N極だけ？',M.x+M.w/4,490,{size:30,anchor:'middle',color:MX.hi,g:rg});
  return stage(ctx,p,s);
 },
 // 切ると断面に新しい極。何回切っても N だけにはならない（④ 予想を裏切る）
 'mx3-n-cut':(p,ctx)=>{const t=ctx.t;
  const u1=clamp(t/.8),c1=clamp(since(ctx,'あたらしい')/1.0),u2=clamp(since(ctx,'なんかい')/.9),u3=clamp(since(ctx,'エヌきょく',2)/.9);
  let s=lines3({op:.3*(1-smooth(clamp(t/.6))),heads:1});
  if(u2<=0)s+=pieces(1,smooth(u1),smooth(c1));
  else if(u3<=0)s+=pieces(2,smooth(u2),smooth(u2));
  else s+=pieces(3,smooth(u3),smooth(u3));
  if(u2<=0&&c1>0){const pul=.5+.5*Math.sin(t*9),G=46,w=M.w/4;s+=fade(c1*(.6+.4*pul),`<rect x="${M.x-G/2-w-5}" y="${MT-7}" width="${w+10}" height="${M.h+14}" rx="9" fill="none" stroke="${MX.hi}" stroke-width="4"/><rect x="${M.x+G/2-5}" y="${MT-7}" width="${w+10}" height="${M.h+14}" rx="9" fill="none" stroke="${MX.hi}" stroke-width="4"/>`)+word('新しい N と S',M.x,190,{size:30,anchor:'middle',g:c1*(1-on(ctx,'なんかい'))});}
  s+=word('予想',150,150,{size:26,color:MX.dim,g:1-on(ctx,'なんかい')})+fade(1-on(ctx,'なんかい'),label('右半分は N だけ',150,205,{size:26,color:MX.dim})+line(140,196,345,196,{color:MX.plus,w:4}));
  s+=word('何回 切っても',M.x,190,{size:30,anchor:'middle',g:on(ctx,'なんかい')*(1-on(ctx,'できません'))});
  const e=on(ctx,'できません');
  s+=fade(e,word('N極だけ',M.x-40,470,{size:32,anchor:'middle',color:MX.plus})+line(M.x+48,448,M.x+92,488,{color:MX.plus,w:6})+line(M.x+92,448,M.x+48,488,{color:MX.plus,w:6}));
  return stage(ctx,p,s);
 },
 // 観測の事実 → それに合う描き方：磁石の中を S→N へ戻る閉じた輪（27）
 'mx3-n-loops':(p,ctx)=>{const T=ctx.t;
  const fg=on(ctx,'かんそく',.5),tr=on(ctx,'なかを',.8),ip=clamp(since(ctx,'エスきょくから')/1.4),lg=on(ctx,'とじた');
  let s=magTranslucent(1)+bar(M.x,M.y,M.w,M.h,{op:1-.7*tr,labels:false});
  s+=loops3({inner:ip,dots:clamp(ip*2-1),T:Math.max(0,since(ctx,'エスきょくから')),glow:lg,heads:1});
  s+=fade(1-tr,label('S',M.x-M.w/4,M.y+12,{size:34,color:'#fff',anchor:'middle',weight:700})+label('N',M.x+M.w/4,M.y+12,{size:34,color:'#fff',anchor:'middle',weight:700}))+fade(tr,poleLabels());
  // observation card: a row of cut pieces, each S|N
  let pcs='';for(let i=0;i<4;i++){const x=905+i*62;pcs+=bar(x,185,52,30,{labels:false});}
  s+=fade(fg,callout(860,100,300,165,label('観測の事実',1010,142,{size:28,color:MX.hi,anchor:'middle',weight:700})+pcs+label('どこで切っても S と N',1010,245,{size:22,color:MX.dim,anchor:'middle'})));
  s+=word('中は S → N',150,340,{size:28,color:MX.B,g:on(ctx,'エスきょくから')});
  s+=word('閉じた輪として描く',60,140,{size:28,color:MX.B,g:lg});
  return stage(ctx,p,s);
 },
 // 電気束と同じ作りで磁束：垂直につき抜ける磁場 × 面積 の合計
 'mx3-n-bag':(p,ctx)=>{const T=ctx.t,bg=on(ctx,'じそくを',.7),pg=on(ctx,'すいちょくに',.5);
  let s=magTranslucent(1)+bar(M.x,M.y,M.w,M.h,{op:.3,labels:false})+loops3({dots:1,T,heads:1})+poleLabels();
  s+=bagSvg(BAG0[0],BAG0[1],0,0,bg);
  const cr=crossings(BAG0[0],BAG0[1],0,0);
  s+=marks(cr,pg);
  // one surface patch, enlarged in a card
  if(pg>0){const c=cr.find(q=>q.out&&q.y<M.y)??cr[0];
   s+=fade(pg,ring(c.x,c.y,20,{color:MX.hi,w:3})+line(c.x+18,c.y-12,875,190,{color:MX.hi,w:2,dash:'6 6'}));
   const px=1020,py=300,ng=on(ctx,'つきぬける',.5);
   s+=callout(860,110,320,340,
     line(px-110,py,px+110,py,{color:'#ffffff',w:4})+line(px-40,py,px+40,py,{color:MX.hi,w:10})+label('面積',px-40,py+40,{size:24,color:MX.hi,anchor:'middle',weight:700})
    +arrow(px,py,px+70,py-120,{color:MX.B,w:6,head:16})+label('磁場',px+80,py-110,{size:24,color:MX.B,weight:700})
    +fade(ng,line(px,py,px,py-112,{color:MX.good,w:5,dash:'8 6'})+line(px+70,py-120,px+8,py-120,{color:MX.good,w:2,dash:'4 5'})+label('垂直な成分',px-14,py-132,{size:24,color:MX.good,anchor:'end',weight:700}))
    +label('垂直な成分 × 面積',1020,395,{size:24,color:MX.ink,anchor:'middle'})+label('を袋全体で合計',1020,430,{size:24,color:MX.ink,anchor:'middle'}),pg);}
  s+=word('磁束',60,140,{size:32,color:MX.B,g:bg});
  s+=word('電気束と 同じ作り',60,200,{size:26,color:MX.E,g:on(ctx,'でんきそく')*(1-on(ctx,'すいちょく'))});
  return stage(ctx,p,s);
 },
 // 1本の線：入る −1、出る +1 → 対になって 0（28）
 'mx3-n-one':(p,ctx)=>{const T=ctx.t,fg=on(ctx,'いっぽんの',.6),ig=on(ctx,'マイナス',.4),og=on(ctx,'プラス',.4),zg=on(ctx,'ゼロ',.5);
  let s=magTranslucent(1)+bar(M.x,M.y,M.w,M.h,{op:.3,labels:false})+loops3({dots:1,T,heads:1,only:fg>0?0:-1,glow:fg})+poleLabels();
  s+=bagSvg(BAG0[0],BAG0[1],0,0,1);
  const cr=crossings(BAG0[0],BAG0[1],0,0,0);
  const cin=cr.find(c=>!c.out),cout=cr.find(c=>c.out);
  s+=fade(ig,marks([cin],1)+word('−1',cin.x,MB+48,{size:30,color:INC,anchor:'middle'}));
  s+=fade(og,marks([cout],1)+word('+1',cout.x+30,cout.y-10,{size:30,color:OUTC}));
  s+=fade(on(ctx,'ついに',.5),callout(860,120,300,120,fit(`{\\color{${OUTC}}+1}\\;{\\color{${INC}}-1}`+(zg>0?`\\;=\\;0`:''),1010,190,250,48,{auto:false,color:MX.ink})));
  s+=word('入る −1　出る +1',60,140,{size:26,g:ig});
  return stage(ctx,p,s);
 },
 // 袋の形・場所を変えても 出る磁束 − 入る磁束 = 0（28・29：矢印は残す）
 'mx3-n-any':(p,ctx)=>{const T=ctx.t,mv=on(ctx,'ばしょを',1.2),wob=on(ctx,'かたちや',.8);
  const cx=mix(BAG0[0],ML+30,mv*(.5+.5*Math.sin(T*.8-1.2))),ph=T*.9,dg=on(ctx,'さは',.5);
  let s=magTranslucent(1)+bar(M.x,M.y,M.w,M.h,{op:.3,labels:false})+loops3({dots:1,T,heads:1})+poleLabels();
  s+=bagSvg(cx,M.y,ph,wob,1);
  const cr=crossings(cx,M.y,ph,wob);s+=marks(cr,1);
  const nin=cr.filter(c=>!c.out).length,nout=cr.length-nin;
  s+=callout(880,110,290,170,label(`出る ${nout}`,905,165,{size:30,color:OUTC,weight:700})+label(`入る ${nin}`,905,215,{size:30,color:INC,weight:700})
   +fade(dg,label(`差 ${nout-nin}`,905,265,{size:30,color:MX.hi,weight:700})+check(1120,200,dg)));
  s+=fade(dg,callout(740,420,430,70,label('出る磁束 − 入る磁束 ＝ 0',955,466,{size:28,color:MX.hi,anchor:'middle',weight:700})));
  return stage(ctx,p,s);
 },
 // 二つ目の式。面の上の磁場は残っている、ゼロなのは出入りの差（29 ⑥）
 'mx3-n-law':(p,ctx)=>{const T=ctx.t,eg=on(ctx,'ふたつめ',.6),mg=on(ctx,'めんの',.5),zg=on(ctx,'でる',.5);
  const X=-230;
  let body=magTranslucent(1)+bar(M.x,M.y,M.w,M.h,{op:.3,labels:false})+loops3({dots:1,T,heads:1})+poleLabels()+bagSvg(BAG0[0],BAG0[1],1.2,1,1);
  const cr=crossings(BAG0[0],BAG0[1],1.2,1);body+=marks(cr,1);
  let s=`<g transform="translate(${X} 0)">${body}</g>`;
  s+=fade(mg,word('面の上に 磁場はある',505,112,{size:24,color:MX.B,anchor:'middle'}));
  const lc=zg>0?DIM:MX.ink,src=`{\\color{${lc}}\\oint {\\color{${zg>0?'#8a6a3a':MX.B}}\\vec B}\\cdot d\\vec A}={\\color{${zg>0?MX.hi:MX.ink}}0}`;
  s+=fade(mg,marks(cr.map(c=>({...c,x:c.x+X})),1)+cr.map(c=>ring(c.x+X,c.y,16+3*Math.sin(T*6),{color:MX.B,w:3})).join(''));
  s+=panel(eg,label('磁場のガウスの法則',960,160,{size:28,color:MX.hi,anchor:'middle',weight:700})+fit(src,960,300,360,60,{auto:false,color:MX.ink})
   +fade(eg*(1-zg),label('袋の表面で 磁束を合計',900,400,{size:24,color:MX.dim,anchor:'middle'}))
   +fade(zg,label('出る磁束 − 入る磁束',960,410,{size:26,color:MX.hi,anchor:'middle',weight:700})+arrow(1060,382,1085,338,{color:MX.hi,w:3,head:12})));
  return stage(ctx,p,s);
 },
 // 電気と磁気は別の世界？ → 1820年
 'mx3-n-to-oersted':(p,ctx)=>{
  const sl=smooth(clamp(ctx.t/1.2)),mx=mix(M.x,880,sl),yg=on(ctx,'せんはっぴゃく',.6);
  let s='';const ch=[{x:180,y:M.y,q:1},{x:400,y:M.y,q:-1}];
  const fl=fieldLines(ch,{n:14,step:4,bounds:[20,95,570,505]});
  s+=fade(sl,fl.map(l=>draw(l,1,{color:MX.E,w:3})).join('')+charge(180,M.y,1)+charge(400,M.y,-1));
  const sc=mix(1,.85,sl);
  s+=`<g transform="translate(${mx.toFixed(1)} ${M.y}) scale(${sc.toFixed(3)}) translate(${-M.x} ${-M.y})">${fade(1-sl,lines3({heads:1}))+fade(sl,lines3({heads:1,open:false}))+magBase()}</g>`;
  s+=fade(on(ctx,'べつべつ',.5),line(600,100,600,505,{color:MX.dim,w:3,dash:'10 10'}));
  s+=word('電気',70,140,{size:32,color:MX.E,g:on(ctx,'でんきと')})+word('磁気',1130,140,{size:32,color:MX.B,anchor:'end',g:on(ctx,'じきは')});
  s+=fade(yg,callout(470,420,260,80,label('1820年',600,475,{size:40,color:MX.hi,anchor:'middle',weight:700})));
  return stage(ctx,p,s);
 },

 // ---------------------------------------------------------------- chapter 4
 // エルステッド：電流を流すと方位磁針が回る
 'mx4-n-oersted':(p,ctx)=>{const T=ctx.t,c=on(ctx,'ながすと',.3),t0=at(ctx,'ながすと');
  const a=swing(90,needle(0,RC,1),T,t0);
  let s=base4(ctx,{c,T})+compassAt(Math.PI/2,a,1,30);
  s+=word('方位磁針',P4.cx+50,505,{size:26,g:on(ctx,'ほういじしん')*(1-on(ctx,'デンマーク'))});
  s+=word('電流',P4.cx+40,200,{size:28,color:MX.I,g:c});
  s+=fade(on(ctx,'デンマーク',.6),callout(780,190,380,190,label('エルステッド',970,260,{size:36,color:MX.ink,anchor:'middle',weight:700})+label('デンマーク・1820年',970,325,{size:28,color:MX.dim,anchor:'middle'})));
  return stage(ctx,p,s);
 },
 // 同じ道具（方位磁針）が磁石にも電流にも反応した（30）
 'mx4-n-same':(p,ctx)=>{const T=ctx.t,mg=on(ctx,'じしゃくの',.6),t0=at(ctx,'じしゃくの');
  let s=base4(ctx,{c:1,T})+compassAt(Math.PI/2,needle(0,RC,1),1,30);
  // inset: magnet brought to a compass; the needle's N turns away from the magnet's N
  const mx=mix(820,862,smooth(clamp((T-t0)/1.2)));
  let ins=bar(mx,200,150,44,{size:24})+compass(1030,200,swing(90,0,T,t0+.9),{r:30});
  s+=fade(mg,callout(740,110,440,160,ins)+label('磁石',790,255,{size:22,color:MX.dim}));
  const sg=on(ctx,'おなじ',.5);
  s+=fade(sg,draw([[1030,236],[1030,300],[620,300],[P4.cx+30,436]],1,{color:MX.hi,w:3,dash:'8 7'})+word('同じ道具',850,300,{size:28,color:MX.hi,anchor:'middle'}));
  s+=fade(on(ctx,'でんりゅうの',.5),callout(740,360,440,130,causal('電流','まわりに磁場',960,410,{ca:MX.I,cb:MX.B,size:30})+fade(on(ctx,'つながって',.5),label('電気と磁気が つながる',960,465,{size:26,color:MX.hi,anchor:'middle',weight:700}))));
  return stage(ctx,p,s);
 },
 // 方位磁針を並べる → 円に沿ってそろう
 'mx4-n-ring':(p,ctx)=>{const T=ctx.t,off=clamp(T/.5),cOn=on(ctx,'かこむ',.3),t1=at(ctx,'かこむ'),t0=at(ctx,'ならべて');
  const c=cOn>0?cOn:1-off;
  let s=base4(ctx,{c,T});
  s+=fade(on(ctx,'えんに',.6),ringPlate(RC,{color:'#ffffff',w:2.5,op:.55,p:clamp(since(ctx,'えんに')/.9)}));
  PHI.forEach((ph,i)=>{const g=i===0?1:clamp((T-t0-i*.18)/.3);if(g<=0)return;
   const target=needle(RC*Math.cos(ph),RC*Math.sin(ph),1);
   const a=i===0?(T<t1?swing(needle(0,RC,1),90,T,0):swing(90,target,T,t1)):swing(90,target,T,t1);
   s+=compassAt(ph,a,g);});
  s+=word('電流 オフ',P4.cx+40,200,{size:28,color:MX.dim,g:(1-cOn)*off})+word('電流 オン',P4.cx+40,200,{size:28,color:MX.I,g:cOn});
  return stage(ctx,p,s);
 },
 // 右手：親指＝電流、4本の指の巻く向き＝磁場（31）
 'mx4-n-hand':(p,ctx)=>{const T=ctx.t,hg=on(ctx,'みぎてで',.6),tg=on(ctx,'おやゆびを',.5),fg=on(ctx,'よんほんの',.5),bg=on(ctx,'じばの',.6);
  const rings=ringPlate(RC,{op:.35+.65*bg,heads:bg,flow:T*.12})+PHI.map(ph=>compassAt(ph,needle(RC*Math.cos(ph),RC*Math.sin(ph),1),1-.8*hg)).join('');
  let s=base4(ctx,{c:1,T,rings});
  s+=fist(P4.cx,240,hg);
  if(tg>0)s+=fade(tg,ring(P4.cx,176,26,{color:MX.I,w:4}));
  if(fg>0){const pts=[];const A0=Math.PI*.95,A1=Math.PI*.1;for(let i=0;i<=40;i++){const a=mix(A0,A1,i/40);pts.push([P4.cx+78*Math.cos(a),330+22*Math.sin(a)]);}
   s+=draw(pts,clamp(since(ctx,'よんほんの')/.8),{color:MX.B,w:6});
   if(since(ctx,'よんほんの')>.8){const a=A1;s+=head(pts[40][0],pts[40][1],Math.atan2(-22*Math.cos(a),78*Math.sin(a)),MX.B,18);}}
  s+=panel(hg,label('右手',960,150,{size:30,color:MX.ink,anchor:'middle',weight:700})
   +fade(tg,label('親指',790,240,{size:28,color:MX.I,weight:700})+label('→ 電流の向き',880,240,{size:28,color:MX.ink}))
   +fade(fg,label('4本の指',790,320,{size:28,color:MX.B,weight:700})+label('→ 磁場の向き',910,320,{size:28,color:MX.ink}))
   +fade(bg,label('上から見て 反時計回り',960,410,{size:24,color:MX.dim,anchor:'middle'})),{h:350});
  return stage(ctx,p,s);
 },
 // B ∝ I、∝ 1/r。記号 B, I, r を図に（32）
 'mx4-n-formula':(p,ctx)=>{const T=ctx.t;
  const i2=on(ctx,'ひれい',.6)*(1-on(ctx,'きょり',.6)),rG=on(ctx,'はんぴれい',1.0),I=1+i2,r=mix(110,220,rG),fg=on(ctx,'こうこう',.6);
  const L=100*I*110/r;const [x,y]=pj(0,r);
  let s=base4(ctx,{c:1,T,I,rings:ringPlate(r,{op:.45,w:3})});
  s+=line(P4.cx,P4.cy,x,y,{color:'#ffffff',w:3,dash:'7 6'})+tex('r',P4.cx-18,mix(P4.cy,y,.6)+8,{size:34,color:'#ffffff',auto:false})+dot(x,y,8,'#ffffff')+arrow(x,y,x+L,y,{color:MX.B,w:7,head:20})+tex('B',x+L/2,y-18,{size:34,color:MX.B,auto:false});
  s+=fade(i2,label('電流 ×2',P4.cx+30,225,{size:28,color:MX.I,weight:700})+label('×2',x+L+14,y+10,{size:28,color:MX.B,weight:700}));
  s+=fade(rG,label('距離 r ×2',110,490,{size:26,color:MX.ink,weight:700})+fade(rG>0.95?1:0,label('×½',x+L+14,y+10,{size:28,color:MX.B,weight:700})));
  s+=panel(fg,fit(FORM,960,300,380,64,{auto:false,color:MX.ink})+label('高校の式',960,170,{size:26,color:MX.dim,anchor:'middle'}),{y:110,h:330});
  return stage(ctx,p,s);
 },
 // 適用条件：十分長くまっすぐ・一定の電流・真空（32）
 'mx4-n-cond':(p,ctx)=>{const T=ctx.t,lg=on(ctx,'ながく',.6),ig=on(ctx,'いってい',.5),vg=on(ctx,'しんくう',.5);
  const top=mix(150,108,lg);
  let s=base4(ctx,{c:1,T,top,rings:ringPlate(RC,{op:.45,w:3,heads:1,flow:T*.12})});
  s+=fade(lg,line(P4.cx,top-26,P4.cx,top-44,{color:MX.I,w:5,dash:'3 7'}));
  s+=panel(1,fit(FORM,960,175,300,46,{auto:false,color:MX.ink})
   +fade(lg,word('十分に長く まっすぐな電線',775,285,{size:24,color:MX.ink}))
   +fade(ig,word('一定の電流',775,355,{size:24,color:MX.I}))
   +fade(vg,word('まわりは 真空',775,425,{size:24,color:MX.E})),{y:95,h:380});
  s+=fade(ig,label('I は 一定',P4.cx+40,250,{size:26,color:MX.I,weight:700}));
  return stage(ctx,p,s);
 },
 // μ0 = 二つ目の数。冒頭の実験カードにバッジ（② ⑨）
 'mx4-n-mu':(p,ctx)=>{const T=ctx.t,mg=on(ctx,'ミューゼロが',.5),cg=on(ctx,'さいしょに',.6),bgd=on(ctx,'きまります',.6),pul=.5+.5*Math.sin(T*5);
  let s=base4(ctx,{c:1,T,rings:ringPlate(RC,{op:.45,w:3,heads:1,flow:T*.12})});
  const fw=texWidth(FORM,46,false);
  s+=callout(740,95,440,110,fit(FORM,960,172,290,44,{auto:false,color:MX.ink}),1);
  s+=fade(mg*(1-cg*.5),`<rect x="${976-3*pul}" y="${110-3*pul}" width="${54+6*pul}" height="${44+6*pul}" rx="9" fill="none" stroke="${MX.hi}" stroke-width="3"/>`);
  s+=fade(mg*(1-cg),label('二つ目の数',960,262,{size:30,color:MX.hi,anchor:'middle',weight:700}));
  s+=fade(cg,evidenceCard(1,715,212,{gn:bgd,glow:bgd*(.5+.5*pul),t:T,title:true}));
  return stage(ctx,p,s);
 },
 // 円を一周歩き、一歩ごとに「道に沿った成分 × 一歩の長さ」を足していく（33 ③）
 'mx4-n-walk':(p,ctx)=>{const T=ctx.t,R=180,N=12,wg=since(ctx,'いっしゅう');
  const u=clamp(wg/Math.max(1.5,VE(ctx)-at(ctx,'いっしゅう')-.2)),ph=Math.PI/2-2*Math.PI*u,k=Math.floor(u*N+1e-6);
  const pts=[];for(let i=0;i<=96*u;i++){const a=Math.PI/2-2*Math.PI*i/96;pts.push(pj(R*Math.cos(a),R*Math.sin(a)));}
  let rings=ringPlate(R,{color:'#ffffff',w:2.5,op:.35})+draw(pts,1,{color:MX.good,w:6});
  const sg=on(ctx,'いっぽ',.5);
  for(let i=0;i<Math.min(k,N);i++){const a0=Math.PI/2-2*Math.PI*i/N,a1=Math.PI/2-2*Math.PI*(i+1)/N;const [x0,y0]=pj(R*Math.cos(a0),R*Math.sin(a0)),[x1,y1]=pj(R*Math.cos(a1),R*Math.sin(a1));rings+=fade(sg,dot(x0,y0,5,'#ffffff'));}
  let s=base4(ctx,{c:1,T,rings});
  const [x,y]=pj(R*Math.cos(ph),R*Math.sin(ph)),[bx,by]=bDir(ph);
  s+=fade(on(ctx,'みちに',.5),arrow(x,y,x+70*bx,y+70*by,{color:MX.B,w:6,head:18}));
  s+=walker(x,y,clamp(wg/.4));
  // running total: one block per completed step
  let blocks='';for(let i=0;i<Math.min(k,N);i++)blocks+=`<rect x="${770+i*32}" y="330" width="28" height="44" rx="4" fill="${MX.B}" fill-opacity=".85"/>`;
  s+=panel(sg,label('一歩ごとに',960,160,{size:28,color:MX.ink,anchor:'middle',weight:700})
   +label('道に沿った 磁場の成分',960,215,{size:26,color:MX.B,anchor:'middle'})+label('× 一歩の長さ',960,255,{size:26,color:MX.good,anchor:'middle'})
   +fade(on(ctx,'たして',.4),blocks+label('足していく',960,420,{size:26,color:MX.dim,anchor:'middle'})));
  return stage(ctx,p,s);
 },
 // 足すのは矢印そのものではない：矢印の和は 0、沿う成分 × 長さ はどれもプラス（34）
 'mx4-n-notvec':(p,ctx)=>{const T=ctx.t,R=180,vg=on(ctx,'やじるし',.5),cg=on(ctx,'うちけし',.8),pg=on(ctx,'せいぶん',.6);
  const four=[Math.PI/2,0,-Math.PI/2,Math.PI];
  let rings=ringPlate(R,{color:MX.good,w:4,op:.6});
  for(const ph of four){const [x,y]=pj(R*Math.cos(ph),R*Math.sin(ph)),[bx,by]=bDir(ph);rings+=arrow(x,y,x+60*bx,y+60*by,{color:MX.B,w:6,head:16});}
  let s=base4(ctx,{c:1,T,rings});
  // left: tip-to-tail sum of the four arrows returns to the start (= 0) — not this
  const ox=800,oy=340,Ls=90,sq=[[1,0],[0,-1],[-1,0],[0,1]];let q=[ox,oy],vec='';
  sq.forEach(([dx,dy],i)=>{const g=clamp(cg*4-i);const X=q[0]+Ls*dx,Y=q[1]+Ls*dy;vec+=arrow(q[0],q[1],X,Y,{color:MX.B,w:5,head:14,g});q=[X,Y];});
  let inner=label('矢印を足す',850,150,{size:26,color:MX.ink,anchor:'middle',weight:700})+fade(vg,vec+dot(ox,oy,6,'#ffffff'))
   +fade(cg,label('元の点に戻る：和は 0',850,420,{size:20,color:MX.dim,anchor:'middle'})+line(780,210,920,370,{color:MX.plus,w:4,opacity:.7})+line(920,210,780,370,{color:MX.plus,w:4,opacity:.7}));
  let bars='';for(let i=0;i<4;i++){const g=clamp(pg*4-i);bars+=fade(g,`<rect x="${1010+i*36}" y="${300-8}" width="30" height="44" rx="4" fill="${MX.B}" fill-opacity=".85"/>`+label('+',1025+i*36,280,{size:26,color:MX.good,anchor:'middle',weight:700}));}
  inner+=line(960,130,960,470,{color:MX.faint,w:2})+fade(pg,label('沿う成分 × 長さ',1075,150,{size:24,color:MX.ink,anchor:'middle',weight:700})+bars+label('どれも プラス',1075,430,{size:24,color:MX.good,anchor:'middle'}));
  s+=panel(vg,fade(vg,inner));
  return stage(ctx,p,s);
 },
 // 「一周の足し算」と名付ける。円では B が一定 → B × 2πr（33）
 'mx4-n-sum':(p,ctx)=>{const T=ctx.t,R=180,ng=on(ctx,'たしざんと',.5),eg=on(ctx,'どこも',.5),fg=on(ctx,'かける',.5);
  let rings=ringPlate(R,{color:MX.good,w:5,op:1});
  for(let i=0;i<8;i++){const ph=Math.PI/2+i*Math.PI/4;const [x,y]=pj(R*Math.cos(ph),R*Math.sin(ph)),[bx,by]=bDir(ph);rings+=fade(eg,arrow(x,y,x+55*bx,y+55*by,{color:MX.B,w:5,head:14}));}
  let s=base4(ctx,{c:1,T,rings});
  s+=fade(eg,word('どこも 同じ強さ',140,140,{size:26,color:MX.B}));
  s+=panel(1,label('一周の足し算',960,150,{size:34,color:MX.hi,anchor:'middle',weight:700})
   +fade(ng,fit(`\\oint ${cB('\\vec B')}\\cdot d\\vec r`,960,250,300,50,{auto:false,color:MX.dim}))
   +label('道に沿う成分 × 短い長さ を一周',960,320,{size:22,color:MX.dim,anchor:'middle'})
   +fade(fg,fit(`=\\;${cB('B')}\\times{\\color{${MX.good}}2\\pi r}`,960,400,320,54,{auto:false,color:MX.ink})));
  return stage(ctx,p,s);
 },
 // 確認：電線から真っすぐ遠ざかる一歩は？（③ ①）
 'mx4-n-check':(p,ctx)=>{const T=ctx.t,R=180,sg=on(ctx,'とおざかる',.6),pul=.5+.5*Math.sin(T*6);
  const [x0,y0]=pj(R,0),[x1,y1]=pj(R+100,0);
  let rings=ringPlate(R,{color:'#ffffff',w:2.5,op:.35});
  let s=base4(ctx,{c:1,T,rings});
  s+=arrow(x0,y0,x0,y0-62,{color:MX.B,w:6,head:16})+tex('B',x0-22,y0-40,{size:30,color:MX.B,auto:false});
  s+=arrow(x0,y0,mix(x0,x1,sg),y1,{color:MX.good,w:7,head:18,g:sg>0?1:0});
  s+=fade(sg,label('一歩',x1-30,y1+40,{size:26,color:MX.good,weight:700}));
  s+=panel(sg,label('この一歩は',960,200,{size:30,color:MX.ink,anchor:'middle',weight:700})+label('いくつ 足される？',960,250,{size:30,color:MX.ink,anchor:'middle',weight:700})+label('？',960,390,{size:80+8*pul,color:MX.hi,anchor:'middle',weight:700}),{y:120,h:340});
  return stage(ctx,p,s);
 },
 // 答え 0：道と直角で沿う成分がない
 'mx4-n-zero':(p,ctx)=>{const T=ctx.t,R=180,zg=on(ctx,'ゼロ',.4),rg=on(ctx,'ちょっかく',.5);
  const [x0,y0]=pj(R,0),[x1,y1]=pj(R+100,0);
  let s=base4(ctx,{c:1,T,rings:ringPlate(R,{color:'#ffffff',w:2.5,op:.35})});
  s+=arrow(x0,y0,x0,y0-62,{color:MX.B,w:6,head:16})+tex('B',x0-22,y0-40,{size:30,color:MX.B,auto:false});
  s+=arrow(x0,y0,x1,y1,{color:MX.good,w:7,head:18})+label('一歩',x1-30,y1+40,{size:26,color:MX.good,weight:700});
  s+=fade(rg,draw([[x0+16,y0],[x0+16,y0-16],[x0,y0-16]],1,{color:'#ffffff',w:3})+label('直角',x0+24,y0-28,{size:24,color:MX.ink}));
  s+=panel(1,label('この一歩は',960,200,{size:30,color:MX.ink,anchor:'middle',weight:700})+fade(zg,label('0',960,370,{size:96,color:MX.hi,anchor:'middle',weight:700})+check(1060,340,zg))
   +fade(on(ctx,'そう',.5),label('道に沿う成分が ない',960,430,{size:26,color:MX.dim,anchor:'middle'})),{y:120,h:340});
  return stage(ctx,p,s);
 },
 // 計算：B = μ0 I / 2πr を入れると 2πr が約分で消える
 'mx4-n-cancel':(p,ctx)=>{const T=ctx.t,R=180,ig=on(ctx,'いれると',.5),sk=clamp(since(ctx,'やくぶん')/.6),rg=on(ctx,'のこります',.5);
  const [x,y]=pj(0,R);
  let s=base4(ctx,{c:1,T,rings:ringPlate(R,{color:MX.good,w:5})});
  s+=arrow(x,y,x+90,y,{color:MX.B,w:6,head:18});
  const size=46,cx=960,y1=290,f1=`\\dfrac{\\mu_0 ${cI('I')}}{2\\pi r}`,w1=texWidth(f1,size,false),w2=texWidth('\\times',size,false),w3=texWidth('2\\pi r',size,false),gap=14,tot=w1+w2+w3+2*gap,x0=cx-tot/2;
  let pn=label('一周の足し算',cx,160,{size:28,color:MX.hi,anchor:'middle',weight:700})+fade(1-ig,fit(`${cB('B')}\\times{\\color{${MX.good}}2\\pi r}`,cx,y1,300,50,{auto:false,color:MX.ink}));
  pn+=fade(ig,tex(f1,x0+w1/2,y1,{size,auto:false,color:MX.ink})+tex('\\times',x0+w1+gap+w2/2,y1,{size,auto:false,color:MX.ink})+tex('2\\pi r',x0+w1+w2+2*gap+w3/2,y1,{size,auto:false,color:MX.good}));
  const wd=texWidth('2\\pi r',size*.72,false);
  if(sk>0){pn+=line(x0+w1/2-wd/2-4,y1+30,mix(x0+w1/2-wd/2-4,x0+w1/2+wd/2+4,sk),y1+14,{color:MX.plus,w:5})+line(x0+w1+w2+2*gap-4,y1+8,mix(x0+w1+w2+2*gap-4,x0+tot+4,sk),y1-14,{color:MX.plus,w:5});}
  pn+=fade(rg,fit(`=\\;\\mu_0 ${cI('I')}`,cx,400,300,64,{auto:false,color:MX.hi}));
  s+=panel(1,pn);
  return stage(ctx,p,s);
 },
 // 2πr が消えた意味：遠い円ほど磁場は弱いが、道はそのぶん長い（⑧）
 'mx4-n-meaning':(p,ctx)=>{const T=ctx.t,R1=110,R2=220,fg=on(ctx,'とおい',.6),wg=on(ctx,'よわく',.5),lg=on(ctx,'ながい',.5),sg=on(ctx,'おおきさ',.5),ig=on(ctx,'かこんだ',.5);
  const [x1,y1]=pj(0,R1),[x2,y2]=pj(0,R2);
  let rings=ringPlate(R1,{color:MX.good,w:5})+fade(fg,ringPlate(R2,{color:MX.good,w:5,p:clamp(since(ctx,'とおい')/.8)}));
  rings+=arrow(x1,y1,x1+100,y1,{color:MX.B,w:6,head:16})+fade(wg,arrow(x2,y2,x2+50,y2,{color:MX.B,w:6,head:16}));
  let s=base4(ctx,{c:1,T,rings,glow:ig*(.6+.4*Math.sin(T*6))});
  s+=panel(1,label('小さい円',860,170,{size:26,color:MX.ink,anchor:'middle',weight:700})+label('大きい円',1070,170,{size:26,color:MX.ink,anchor:'middle',weight:700})
   +label('磁場',760,240,{size:24,color:MX.B})+label('1',860,240,{size:30,color:MX.B,anchor:'middle',weight:700})+fade(wg,label('½',1070,240,{size:30,color:MX.B,anchor:'middle',weight:700}))
   +label('道',760,305,{size:24,color:MX.good})+label('1',860,305,{size:30,color:MX.good,anchor:'middle',weight:700})+fade(lg,label('×2',1070,305,{size:30,color:MX.good,anchor:'middle',weight:700}))
   +line(760,330,1160,330,{color:MX.faint,w:2})
   +label('積',760,375,{size:24,color:MX.ink})+label('1',860,375,{size:30,color:MX.ink,anchor:'middle',weight:700})+fade(lg,label('1',1070,375,{size:30,color:MX.hi,anchor:'middle',weight:700})+check(1130,365,lg))
   +fade(sg,label('答えは 囲んだ電流 だけで決まる',960,450,{size:24,color:MX.hi,anchor:'middle',weight:700})));
  return stage(ctx,p,s);
 },
 // ゆがんだ道：遠ざかる所 0、弧は角度の割合（¾ と ¼）→ 合計 μ0 I（35）
 'mx4-n-bent':(p,ctx)=>{const T=ctx.t,r1=110,r2=230,q=Math.PI/4;
  const dg=on(ctx,'ゆがんだ',.8),zg=on(ctx,'とおざかる',.5),ag=on(ctx,'この',.5),fg=on(ctx,'よんぶんの',.5),tg=on(ctx,'あわせて',.5);
  // path: inner arc r1 over φ ∈ [q, 2π−q], radial out at φ=−q, outer arc r2 over φ ∈ [−q, q], radial in at φ=q
  const P=(r,a)=>pj(r*Math.cos(a),r*Math.sin(a));
  const inner=[],outer=[];for(let i=0;i<=72;i++){inner.push(P(r1,q+(2*Math.PI-2*q)*i/72));}for(let i=0;i<=24;i++){outer.push(P(r2,-q+2*q*i/24));}
  const rad1=[P(r1,-q),P(r2,-q)],rad2=[P(r2,q),P(r1,q)];
  const glow=(pts,g,col)=>g>0?draw(pts,1,{color:col,w:14,opacity:.3*g}):'';
  let rings=ringPlate(RC,{color:'#ffffff',w:2,op:.15*(1-dg)});
  rings+=draw([...inner,...rad1.slice(1),...outer.slice(1),...rad2.slice(1)],dg,{color:MX.good,w:5});
  rings+=glow(rad1,zg*(1-tg),'#ffffff')+glow(rad2,zg*(1-tg),'#ffffff')+glow(inner,ag*(1-tg),MX.B)+glow(outer,ag*(1-tg),MX.B);
  // field arrows: tangential on the arcs, perpendicular to the radial segments
  for(const [r,a] of [[r1,Math.PI/2],[r1,Math.PI],[r1,3*Math.PI/2],[r2,0],[r1+60,q],[r1+60,-q]]){const [x,y]=P(r,a),[bx,by]=bDir(a),Ls=r===r2?30:55;rings+=fade(dg,arrow(x,y,x+Ls*bx,y+Ls*by,{color:MX.B,w:5,head:14}));}
  let s=base4(ctx,{c:1,T,rings});
  const [ra,rb]=P(r1+60,-q),[rc,rd]=P(r1+60,q);
  s+=fade(zg,word('0',ra+34,rb+26,{size:26,color:'#ffffff'})+word('0',rc+34,rd-6,{size:26,color:'#ffffff'}));
  const [ia,ib]=P(r1,Math.PI*1.1),[oa,ob]=P(r2,0);
  const tl=(src,x,y)=>`<rect x="${x-58}" y="${y-30}" width="116" height="50" rx="10" fill="${MX.bg}" fill-opacity=".9" stroke="${MX.B}" stroke-opacity=".6" stroke-width="2"/>`+tex(src,x,y,{size:30,color:MX.B,auto:false});
  s+=fade(fg,tl(`\\tfrac34\\mu_0 I`,ia-80,ib+6)+tl(`\\tfrac14\\mu_0 I`,650,250)+line(640,275,oa-10,ob-40,{color:MX.B,w:2,dash:'5 5'}));
  s+=panel(zg,label('ゆがんだ道',960,160,{size:30,color:MX.ink,anchor:'middle',weight:700})
   +fade(zg,label('遠ざかる所：0',960,230,{size:26,color:MX.ink,anchor:'middle'}))
   +fade(ag,label('弧：半径によらず 角度の割合',960,285,{size:24,color:MX.B,anchor:'middle'}))
   +fade(fg,fit(`\\tfrac34\\mu_0 ${cI('I')}+\\tfrac14\\mu_0 ${cI('I')}`,960,355,380,44,{auto:false,color:MX.ink}))
   +fade(tg,fit(`=\\mu_0 ${cI('I')}`,960,430,220,50,{auto:false,color:MX.hi})+check(1110,420,tg)));
  return stage(ctx,p,s);
 },
 // 一定の電流なら、どんな閉じた道でも：アンペールの法則（④の前半）（35 ⑥ 49の準備）
 'mx4-n-law':(p,ctx)=>{const T=ctx.t,cg=on(ctx,'いっていの',.5),dg=on(ctx,'どんな',.8),lg=on(ctx,'いっしゅうの',.5),ig=on(ctx,'かこんだ',.5),ag=on(ctx,'アンペール',.5);
  const pts=[];for(let i=0;i<=120;i++){const a=2*Math.PI*i/120,r=175*(1+.22*Math.sin(3*a+T*.8)+.1*Math.sin(2*a-1));pts.push(pj(r*Math.cos(a),r*Math.sin(a)));}
  let rings=draw(pts,dg,{color:MX.good,w:5});
  let s=base4(ctx,{c:1,T,rings,glow:ig*(.6+.4*Math.sin(T*6))});
  s+=word('一定の電流',P4.cx+40,215,{size:26,color:MX.I,g:cg});
  const fL=lg>0&&ig<=0?1:ig>0?.4:1,fR=ig>0?1:lg>0?.4:1,cl=u=>u<1?DIM:MX.ink;
  const src=`{\\color{${cl(fL)}}\\oint {\\color{${fL<1?'#8a6a3a':MX.B}}\\vec B}\\cdot d\\vec r}={\\color{${cl(fR)}}\\mu_0 {\\color{${fR<1?'#8a7a3a':MX.I}}I}}`;
  s+=panel(1,fit(src,960,300,380,56,{auto:false,color:MX.ink})
   +fade(cg,word('一定の電流のとき',960,170,{size:24,color:MX.I,anchor:'middle'}))
   +fade(lg,label('一周の足し算',860,395,{size:22,color:MX.hi,anchor:'middle',weight:700}))
   +fade(ig,label('囲んだ電流 × μ₀',1052,395,{size:22,color:MX.hi,anchor:'middle',weight:700}))
   +fade(ag,label('アンペールの法則',960,460,{size:30,color:MX.hi,anchor:'middle',weight:700})));
  return stage(ctx,p,s);
 },
 // 電流 → 磁場。逆に 磁場 → 電流 は？
 'mx4-n-to-faraday':(p,ctx)=>{const T=ctx.t;
  let s=base4(ctx,{c:1,T,rings:[100,RC,240].map(r=>ringPlate(r,{op:.6,heads:1,flow:T*.12})).join('')});
  s+=fade(on(ctx,'でんりゅうが',.5),callout(760,140,420,110,causal('電流','磁場',970,208,{ca:MX.I,cb:MX.B,size:36})));
  const q=on(ctx,'ぎゃくに',.6),pul=.5+.5*Math.sin(T*6);
  s+=fade(q,callout(760,320,420,110,causal('磁場','電流',940,388,{ca:MX.B,cb:MX.I,size:36})+label('？',1120,396,{size:44+6*pul,color:MX.hi,anchor:'middle',weight:700})));
  s+=fade(q,arrow(970,262,970,310,{color:MX.dim,w:4,head:12})+label('逆は？',1000,295,{size:24,color:MX.dim}));
  return stage(ctx,p,s);
 },
};

// Diagrams for the Maxwell film, group B: chapter 3 (magnets, Gauss's law for B) and
// chapter 4 (Ørsted, field around a wire, Ampère's law).
// Chapter 3 base: one bar magnet (S left, N right) at the stage centre. Its field is
// modelled by pole sheets on the two end faces (exact enough outside the magnet); the
// closed loops are completed through the interior from S to N.
// Chapter 4 base: a vertical wire through a horizontal plate seen obliquely (plate
// coordinates X right, Z toward the viewer). Compasses are drawn face-on (billboard)
// with the needle along the projected direction of the horizontal field.
import {MX,clamp,mix,smooth,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,stage,word,callout,causal,check,charge,magnet,compass,fieldLines,fit} from './mx-common.mjs';

// ---- timing: elements appear when the narration reaches a word of the reading ----------
const VE=ctx=>Math.max(.6,ctx.dur-(ctx.cue?.pause??0)-.12);
function at(ctx,kw,n=1){const r=ctx.cue?.reading??'';let i=-1;for(let k=0;k<n;k++){i=r.indexOf(kw,i+1);if(i<0)throw Error(`mxB: "${kw}" not in reading: ${r}`);}return VE(ctx)*i/r.length;}
const on=(ctx,kw,d=.45,n=1)=>smooth(clamp((ctx.t-at(ctx,kw,n))/d));
const since=(ctx,kw,n=1)=>ctx.t-at(ctx,kw,n);
const hexRGB=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const mixC=(a,b,u)=>{const A=hexRGB(a),B=hexRGB(b);return '#'+A.map((v,i)=>Math.round(mix(v,B[i],clamp(u))).toString(16).padStart(2,'0')).join('');};
const SLOT=[150,450,750,1050];
// Dashed link from a point of the picture to an equation slot in the bar.
function link(x,y,slot,g){if(g<=0)return '';const X=SLOT[slot-1],Y=118,px=mix(x,X,g),py=mix(y,Y,g);
 return line(x,y,px,py,{color:MX.hi,w:4,dash:'10 8'})+(g>.95?dot(X,Y,7,MX.hi):'');}

// =====================================================================================
// Chapter 3: bar magnet
// =====================================================================================
const M={x:600,y:322,w:280,h:80};const ML=M.x-M.w/2,MR=M.x+M.w/2,MT=M.y-M.h/2,MB=M.y+M.h/2;
const POLES=[];for(let i=0;i<9;i++){const y=MT+4+(M.h-8)*i/8;POLES.push([MR,y,1/9],[ML,y,-1/9]);}
function Bf(x,y){let bx=0,by=0;for(const [px,py,q] of POLES){const dx=x-px,dy=y-py,r2=dx*dx+dy*dy+4,r3=r2*Math.sqrt(r2);bx+=q*dx/r3;by+=q*dy/r3;}return [bx,by];}
const inMag=(x,y,m=1)=>x>=ML-m&&x<=MR+m&&y>=MT-m&&y<=MB+m;
function trace(x,y){const pts=[[x,y]];for(let i=0;i<3000;i++){let [bx,by]=Bf(x,y);let m=Math.hypot(bx,by);const hx=x+1.5*bx/m,hy=y+1.5*by/m;[bx,by]=Bf(hx,hy);m=Math.hypot(bx,by);x+=3*bx/m;y+=3*by/m;pts.push([x,y]);
 if(inMag(x,y))return {pts,closed:x<M.x};if(x<-60||x>1260||y<60||y>580)return {pts,closed:false};}return {pts,closed:false};}
// Closed loops: leave the top/bottom surface near N, come back near S (mirror point),
// then run through the magnet from S to N. `inner` is that interior path.
const LOOP_X=[736,714,688];
const LOOPS=[];
LOOP_X.forEach((x0,i)=>{for(const s of [-1,1]){
 const r=trace(x0,s<0?MT-1:MB+1);if(!r.closed)continue;
 const out=r.pts.map(([x,y])=>[x,y]),end=out[out.length-1],yi=M.y+s*(8+i*14);
 const inner=[[end[0],s<0?MT:MB],[end[0]+6,yi],[x0-6,yi],[x0,s<0?MT:MB]];
 LOOPS.push({out,inner,all:[...out,...inner.slice(1)]});
}});
// Open lines leaving the N face (they close far outside the picture).
const OPEN0=[M.y-30,M.y-20,M.y+20,M.y+30].map(y0=>trace(MR+2,y0).pts);
const OPEN=[...OPEN0,...OPEN0.map(pts=>pts.map(([x,y])=>[2*M.x-x,y]).reverse())];
const len=pts=>{let L=0;for(let i=1;i<pts.length;i++)L+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);return L;};
function pointAt(pts,u){const L=len(pts)*(((u%1)+1)%1);let a=0;for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);if(a+d>=L){const v=(L-a)/Math.max(d,1e-6);return [mix(pts[i-1][0],pts[i][0],v),mix(pts[i-1][1],pts[i][1],v),Math.atan2(pts[i][1]-pts[i-1][1],pts[i][0]-pts[i-1][0])];}a+=d;}const q=pts[pts.length-1];return [q[0],q[1],0];}
const head=(x,y,a,color=MX.B,s=13)=>`<polygon points="${x+s*Math.cos(a)},${y+s*Math.sin(a)} ${x-s*.7*Math.cos(a)+s*.6*Math.sin(a)},${y-s*.7*Math.sin(a)-s*.6*Math.cos(a)} ${x-s*.7*Math.cos(a)-s*.6*Math.sin(a)},${y-s*.7*Math.sin(a)+s*.6*Math.cos(a)}" fill="${color}"/>`;
const clip=`<defs><clipPath id="mxBstage"><rect x="0" y="118" width="1200" height="397"/></clipPath></defs>`;
// All field lines (outside parts), drawn on progressively from N; arrowheads along them.
function lines3({p=1,op=1,heads=0,flow=0,w=4,open=true}={}){
 let s='';const all=[...LOOPS.map(l=>l.out),...(open?OPEN:[])];
 for(const pts of all){s+=draw(pts,p,{color:MX.B,w,opacity:op});
  if(heads>0){for(const u of [.3,.7]){const [x,y,a]=pointAt(pts,u+flow*.04);if(y>125)s+=fade(heads*op,head(x,y,a));}}}
 return `<g clip-path="url(#mxBstage)">${clip}${s}</g>`;
}
const LEAD=pointAt(LOOPS[0].out,.72);
// Iron filings on a jittered grid (deterministic).
let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const FIL=[];for(let y=138;y<508;y+=22)for(let x=18;x<1190;x+=24){const px=x+rnd()*14,py=y+rnd()*12;if(inMag(px,py,10))continue;const [bx,by]=Bf(px,py);FIL.push({x:px,y:py,a0:rnd()*Math.PI,a1:Math.atan2(by,bx),str:Math.hypot(bx,by),d:rnd()});}
function filings(fall,align,op=1){if(fall<=0||op<=0)return '';let s='';
 for(const f of FIL){const g=clamp(fall*1.6-f.d*.6);if(g<=0)continue;let da=f.a1-f.a0;da=((da+Math.PI/2)%Math.PI+Math.PI)%Math.PI-Math.PI/2;
  const a=f.a0+da*clamp(align*1.4-f.d*.4),y=f.y-40*(1-g),L=7,c=Math.cos(a)*L,sn=Math.sin(a)*L,o=g*op*(.35+.65*clamp(f.str*9000));
  s+=`<line x1="${(f.x-c).toFixed(1)}" y1="${(y-sn).toFixed(1)}" x2="${(f.x+c).toFixed(1)}" y2="${(y+sn).toFixed(1)}" stroke="#c9d1de" stroke-width="3" stroke-linecap="round" opacity="${o.toFixed(2)}"/>`;}
 return s;}
function bar(x,y,w,h,{op=1,left=MX.minus,right=MX.plus,labels=true,size=34}={}){
 return fade(op,`<rect x="${x-w/2}" y="${y-h/2}" width="${w/2}" height="${h}" fill="${left}" rx="5"/><rect x="${x}" y="${y-h/2}" width="${w/2}" height="${h}" fill="${right}" rx="5"/>`
  +(labels?label('S',x-w/4,y+size*.36,{size,color:'#fff',anchor:'middle',weight:700})+label('N',x+w/4,y+size*.36,{size,color:'#fff',anchor:'middle',weight:700}):''));}
const magBase=(op=1)=>bar(M.x,M.y,M.w,M.h,{op});
const paper=g=>fade(g,`<rect x="40" y="${mix(-300,132,g)}" width="1120" height="376" rx="6" fill="${MX.paper}" fill-opacity=".10" stroke="${MX.paper}" stroke-opacity=".35" stroke-width="2"/>`);

// Bag around the N end; wobble changes its shape ("any bag").
const BAG={x:MR-5,y:M.y,r:86};
const bagR=(a,ph,wob)=>BAG.r*(1+wob*(.2*Math.sin(3*a+ph)+.12*Math.sin(2*a-1.7*ph+1)));
function bagPath(ph,wob){const pts=[];for(let i=0;i<=120;i++){const a=2*Math.PI*i/120,r=bagR(a,ph,wob);pts.push([BAG.x+r*Math.cos(a),BAG.y+r*Math.sin(a)]);}return pts;}
function crossings(ph,wob){const res=[];const ins=([x,y])=>Math.hypot(x-BAG.x,y-BAG.y)<bagR(Math.atan2(y-BAG.y,x-BAG.x),ph,wob);
 for(const l of LOOPS){const P=l.all;for(let i=1;i<P.length;i++){const a=ins(P[i-1]),b=ins(P[i]);if(a!==b){let lo=0,hi=1;for(let k=0;k<12;k++){const m=(lo+hi)/2,q=[mix(P[i-1][0],P[i][0],m),mix(P[i-1][1],P[i][1],m)];if(ins(q)===a)lo=m;else hi=m;}
  res.push({x:mix(P[i-1][0],P[i][0],lo),y:mix(P[i-1][1],P[i][1],lo),a:Math.atan2(P[i][1]-P[i-1][1],P[i][0]-P[i-1][0]),out:a&&!b});}}}
 // clockwise order around the bag, starting at the top
 const ang=c=>((Math.atan2(c.y-BAG.y,c.x-BAG.x)+Math.PI/2)%(2*Math.PI)+2*Math.PI)%(2*Math.PI);
 return res.sort((a,b)=>ang(a)-ang(b));}
const OUTC=MX.good,INC='#ff9ce6';
// Crossing dots: green = line leaves the bag, pink = line enters. `lit` dots are counted (ring).
function marks(cr,g,{lit=-1,pulse=0}={}){return fade(g,cr.map((c,i)=>(i<lit?ring(c.x,c.y,15+(i===lit-1?4*pulse:0),{color:c.out?OUTC:INC,w:3}):'')+`<circle cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="9" fill="${c.out?OUTC:INC}" stroke="#0d1526" stroke-width="2"/>`).join(''));}
// Loops with the interior drawn and dots circulating S→N inside, N→S outside.
function loops3({inner=1,dots=0,T=0,op=1,glow=0}){let s='';
 for(const l of LOOPS){if(glow>0)s+=draw(l.all,1,{color:MX.B,w:12,opacity:.18*glow});s+=draw(l.out,1,{color:MX.B,w:4,opacity:op});
  if(inner>0)s+=draw(l.inner,inner,{color:MX.B,w:4,opacity:op});
  if(dots>0){const L=len(l.all);for(let k=0;k<3;k++){const [x,y]=pointAt(l.all,k/3+T*110/L);s+=fade(dots,dot(x,y,6,MX.hi));}}}
 return s;}
function magTranslucent(op){return fade(op,`<rect x="${ML}" y="${MT}" width="${M.w/2}" height="${M.h}" fill="${MX.minus}" fill-opacity=".45" rx="5"/><rect x="${M.x}" y="${MT}" width="${M.w/2}" height="${M.h}" fill="${MX.plus}" fill-opacity=".45" rx="5"/>`);}
const poleLabels=()=>label('S',ML-26,M.y+12,{size:34,color:MX.minus,anchor:'middle',weight:700})+label('N',MR+26,M.y+12,{size:34,color:MX.plus,anchor:'middle',weight:700});

// Pieces after cutting. level L: 2^L pieces; u = progress of the split into level L.
function pieces(L,u,cu){const n=2**L,w=M.w/n,gaps=[0,46,26,14],G=gaps[L];let s='';
 const pg=gaps[L-1]??0,np=n/2,pw=M.w/np;
 for(let j=0;j<np;j++){const pc=M.x+(j-(np-1)/2)*(pw+pg);
  for(const side of [-1,1]){
   const x=pc+side*(w/2)+side*u*G/2;
   // left child: left half S (blue), right half turns red at the new face; right child mirrored
   const l=side<0?MX.minus:mixC(MX.plus,MX.minus,cu),r=side<0?mixC(MX.minus,MX.plus,cu):MX.plus;
   const lab=L<=2,size=L===1?30:24;
   s+=bar(x,M.y,w,M.h,{left:l,right:r,labels:false});
   if(lab){s+=label('S',x-w/4,M.y+size*.36,{size,color:'#fff',anchor:'middle',weight:700,opacity:side<0?1:cu})+label('N',x+w/4,M.y+size*.36,{size,color:'#fff',anchor:'middle',weight:700,opacity:side<0?cu:1});}
  }}
 return s;}

// ---- chapter 4 base: wire through a plate ------------------------------------------------
const P4={cx:400,cy:390,rx:300,k:.367};
const pj=(X,Z)=>[P4.cx+X,P4.cy+P4.k*Z];
const RC=170,PHI=[0,1,2,3,4,5,6].map(i=>Math.PI/2+i*2*Math.PI/7);
function plate(){return `<ellipse cx="${P4.cx}" cy="${P4.cy}" rx="${P4.rx}" ry="${P4.rx*P4.k}" fill="#1b2a4a" fill-opacity=".85" stroke="#3b4f78" stroke-width="3"/>`;}
function wireLower(c){return line(P4.cx,P4.cy,P4.cx,508,{color:mixC('#6c7a94',MX.I,c),w:12,opacity:.45});}
function wireUpper(c,T,{glow=0,I=1}={}){const col=mixC('#6c7a94',MX.I,c);let s='';
 if(glow>0)s+=line(P4.cx,140,P4.cx,P4.cy,{color:MX.I,w:34,opacity:.25*glow});
 s+=`<ellipse cx="${P4.cx}" cy="${P4.cy}" rx="11" ry="4" fill="#0d1526"/>`+line(P4.cx,150,P4.cx,P4.cy,{color:col,w:12*(I>1?1.4:1)});
 if(c>0){for(let k=0;k<4;k++){const y=P4.cy-((T*90+k*60)%240);if(y>160)s+=fade(c,line(P4.cx,y,P4.cx,y-18,{color:'#fff7c2',w:4}));}
  s+=fade(c,`<polygon points="${P4.cx},128 ${P4.cx-17},158 ${P4.cx+17},158" fill="${MX.I}"/>`+tex('I',P4.cx+34,158,{size:36,color:MX.I,auto:false}));}
 return s;}
// Horizontal field direction at plate point (X,Z) for current up: B ∝ (Z,-X); earth field (0,-1).
function needle(X,Z,c,ratio=12){const r=Math.hypot(X,Z),bw=c*ratio*RC/r;const bx=bw*Z/r,bz=-bw*X/r-1;return Math.atan2(-P4.k*bz,bx)*180/Math.PI;}
function compassAt(phi,ang,g=1,r=24){const [x,y]=pj(RC*Math.cos(phi),RC*Math.sin(phi));return compass(x,y,ang,{r,g});}
// Damped swing from a0 to a1 starting at time t0.
function swing(a0,a1,t,t0){if(t<t0)return a0;const u=t-t0;let d=a1-a0;d=((d+180)%360+360)%360-180;return a1-d*Math.exp(-2.6*u)*Math.cos(7*u);}
function ringPlate(r,{p=1,color=MX.B,w=4,op=1,heads=0,flow=0}={}){const pts=[];for(let i=0;i<=96;i++){const a=Math.PI/2-2*Math.PI*i/96;pts.push(pj(r*Math.cos(a),r*Math.sin(a)));}
 let s=draw(pts,p,{color,w,opacity:op});
 if(heads>0)for(let k=0;k<3;k++){const a=Math.PI/2+.5-2*Math.PI*(k/3+flow);const [x,y]=pj(r*Math.cos(a),r*Math.sin(a));const dx=Math.sin(a),dy=-P4.k*Math.cos(a);s+=fade(heads*op,head(x,y,Math.atan2(dy,dx),color,15));}
 return s;}
function base4(ctx,{c=0,T=0,rings=null,glow=0,I=1}={}){return wireLower(c)+plate()+(rings??'')+wireUpper(c,T,{glow,I});}
const panel=(g,inner,{x=740,y=140,w=440,h=360}={})=>callout(x,y,w,h,inner,g);
const cB=v=>`{\\color{${MX.B}}${v}}`,cI=v=>`{\\color{${MX.I}}${v}}`;
const FORM=`${cB('B')}=\\dfrac{\\mu_0 ${cI('I')}}{2\\pi r}`;

// =====================================================================================
export const mxBDiagrams={
 // 27 棒磁石・紙・砂鉄 → N から S へ線が浮かぶ
 'mx3-sand':(p,ctx)=>{const t=ctx.t;
  const pg=on(ctx,'かみを',.7),fall=clamp(since(ctx,'さてつ')/1.2),align=clamp(since(ctx,'すると')/1.4),lp=clamp(since(ctx,'エヌきょく')/Math.max(.8,at(ctx,'うかびあがります')-at(ctx,'エヌきょく')+.6));
  let s=magBase()+paper(pg)+filings(fall,align,1-.35*lp);
  s+=lines3({p:lp,op:.95,heads:clamp(lp*2-1)});
  s+=word('砂鉄',70,190,{size:30,g:on(ctx,'さてつ')*(1-on(ctx,'すると'))});
  s+=word('N極から出て S極へ',600,480,{size:28,anchor:'middle',g:on(ctx,'エヌきょく'),color:MX.B});
  return stage(ctx,p,s);
 },
 // 28 磁力線＝磁場の向き。電気力線と似ている
 'mx3-lines':(p,ctx)=>{const T=ctx.t;
  let s=filings(1,1,.35)+lines3({heads:1,flow:T*.9})+magBase();
  s+=word('磁力線',150,210,{size:34,color:MX.B,g:on(ctx,'じりょくせん')})+fade(on(ctx,'じりょくせん'),line(260,226,LEAD[0],LEAD[1],{color:MX.B,w:3,dash:'6 6'})+dot(LEAD[0],LEAD[1],6,MX.B));
  s+=word('向き',470,480,{size:28,color:MX.B,g:on(ctx,'むき')});
  const g=on(ctx,'でんきりきせん',.6),ib=[930,150,1170,330];
  if(g>0){const ch=[{x:990,y:250,q:1},{x:1110,y:250,q:-1}];const fl=fieldLines(ch,{n:10,step:3,bounds:[ib[0]+4,ib[1]+4,ib[2]-4,ib[3]-4]});
   s+=callout(ib[0],ib[1],ib[2]-ib[0],ib[3]-ib[1],fl.map(l=>draw(l,1,{color:MX.E,w:2.5})).join('')+charge(990,250,1,{r:18})+charge(1110,250,-1,{r:18})+label('電気力線',1050,318,{size:24,color:MX.E,anchor:'middle',weight:700}),g);}
  return stage(ctx,p,s);
 },
 // 29 N極だけ取り出せる？ 半分に切る
 'mx3-cut':(p,ctx)=>{const cutG=clamp(since(ctx,'きって')/1.0);
  let s=lines3({op:mix(.9,.3,smooth(clamp(ctx.t/.8))),heads:1})+magBase();
  s+=word('N極だけ？',MR+10,215,{size:34,color:MX.plus,g:on(ctx,'エヌきょく')})+fade(on(ctx,'エヌきょく'),line(MR+60,240,MR-40,MT-6,{color:MX.plus,w:3,dash:'6 6'}));
  if(cutG>0){const y=mix(150,MB+30,cutG);s+=line(M.x,150,M.x,y,{color:'#ffffff',w:4,dash:'12 8'})+`<polygon points="${M.x-26},${y-8} ${M.x+26},${y-8} ${M.x},${y+14}" fill="#dfe6f2"/>`;}
  return stage(ctx,p,s);
 },
 // 30 断面に新しい N と S。何回切っても N だけにはならない
 'mx3-cut:many':(p,ctx)=>{const t=ctx.t;
  const u1=clamp(t/.8),c1=clamp(since(ctx,'あたらしい')/1.2),u2=clamp(since(ctx,'なんかい')/.9),u3=clamp(since(ctx,'エヌきょく',2)/.9);
  let s=lines3({op:.3*(1-smooth(clamp(t/.6))),heads:1});
  if(u2<=0)s+=pieces(1,smooth(u1),smooth(c1));
  else if(u3<=0)s+=pieces(2,smooth(u2),smooth(u2));
  else s+=pieces(3,smooth(u3),smooth(u3));
  if(u2<=0&&c1>0){const pul=.5+.5*Math.sin(t*9),G=46,w=M.w/4;s+=fade(c1*(.6+.4*pul),`<rect x="${M.x-G/2-w-5}" y="${MT-7}" width="${w+10}" height="${M.h+14}" rx="9" fill="none" stroke="${MX.hi}" stroke-width="4"/><rect x="${M.x+G/2-5}" y="${MT-7}" width="${w+10}" height="${M.h+14}" rx="9" fill="none" stroke="${MX.hi}" stroke-width="4"/>`)+word('新しい N と S',M.x,205,{size:30,anchor:'middle',g:c1*(1-on(ctx,'なんかい'))});}
  s+=word('何回 切っても',M.x,205,{size:30,anchor:'middle',g:on(ctx,'なんかい')*(1-on(ctx,'できません'))});
  const e=on(ctx,'できません');
  s+=fade(e,word('N極だけ',M.x-40,470,{size:32,anchor:'middle',color:MX.plus})+line(M.x+48,448,M.x+92,488,{color:MX.plus,w:6})+line(M.x+92,448,M.x+48,488,{color:MX.plus,w:6}));
  return stage(ctx,p,s);
 },
 // 31 磁石の中までたどると、線は S→N へ戻り閉じた輪
 'mx3-loops':(p,ctx)=>{const T=ctx.t;
  const tr=on(ctx,'なかまで',.8),ip=clamp(since(ctx,'たどると')/1.4),dg=on(ctx,'エスきょくから'),lg=on(ctx,'わに');
  let s=magTranslucent(1)+bar(M.x,M.y,M.w,M.h,{op:1-.7*tr,labels:false});
  s+=loops3({inner:ip,dots:dg,T:Math.max(0,since(ctx,'エスきょくから')),glow:lg});
  s+=fade(1-tr,label('S',M.x-M.w/4,M.y+12,{size:34,color:'#fff',anchor:'middle',weight:700})+label('N',M.x+M.w/4,M.y+12,{size:34,color:'#fff',anchor:'middle',weight:700}))+fade(tr,poleLabels());
  s+=word('中では S → N',M.x,480,{size:28,anchor:'middle',color:MX.B,g:dg});
  s+=word('閉じた輪',160,200,{size:32,color:MX.B,g:lg});
  return stage(ctx,p,s);
 },
 // 32 始まりも終わりもない → どんな袋でも 入る数 = 出る数
 'mx3-bag':(p,ctx)=>{const T=ctx.t;
  const bg=on(ctx,'ふくろ',.6),wob=bg*1,ph=T*.9,cg=on(ctx,'ハイル',.4),eq=on(ctx,'おなじ');
  let s=magTranslucent(1)+bar(M.x,M.y,M.w,M.h,{op:.3,labels:false})+loops3({dots:1,T})+poleLabels();
  s+=word('始まりも 終わりもない',60,190,{size:28,color:MX.B,g:on(ctx,'しゅっぱつてん')});
  if(bg>0){const bp=bagPath(ph,wob);s+=draw(bp,bg,{color:'#ffffff',w:4,dash:'12 7'})+fade(bg,`<polygon points="${bp.map(q=>q.map(v=>v.toFixed(1)).join(',')).join(' ')}" fill="#ffffff" fill-opacity=".06"/>`);
   const cr=crossings(ph,wob);s+=marks(cr,cg);
   const nin=cr.filter(c=>!c.out).length,nout=cr.length-nin;
   s+=callout(920,150,260,130,label(`入る ${nin}`,945,200,{size:32,color:INC,weight:700})+label(`出る ${nout}`,945,255,{size:32,color:OUTC,weight:700})+check(1130,228,eq),cg);}
  return stage(ctx,p,s);
 },
 // 33 袋の表面で全部足すと 0 → 二つ目の式
 'mx3-gauss':(p,ctx)=>{const T=ctx.t;const ph=1.2;
  const t0=at(ctx,'ぜんぶ'),t1=at(ctx,'かならず'),zg=on(ctx,'ゼロに',.5),lg=clamp(since(ctx,'ふたつめ')/.8);
  const cr=crossings(ph,1),n=cr.length,k=Math.round(clamp((T-t0)/Math.max(.5,t1-t0))*n);
  const po=cr.slice(0,k).filter(c=>c.out).length,ne=k-po,pul=.5+.5*Math.sin(T*12);
  let s=magTranslucent(1)+bar(M.x,M.y,M.w,M.h,{op:.3,labels:false})+loops3({dots:.6,T})+poleLabels();
  const bp=bagPath(ph,1);s+=draw(bp,1,{color:'#ffffff',w:4,dash:'12 7'})+marks(cr,1,{lit:k,pulse:pul});
  s+=callout(90,150,370,120,fit(`{\\color{${OUTC}}+${po}}\\;{\\color{${INC}}-\\,${ne}}`+(zg>0?`\\;=\\;0`:''),275,222,320,52,{auto:false,color:MX.ink}),clamp((T-t0)/.4));
  s+=fade(clamp((T-t0)/.4)*(1-zg),label('出る +1　入る −1',275,305,{size:24,color:MX.dim,anchor:'middle'}));
  s+=link(430,150,2,lg);
  return stage(ctx,p,s);
 },
 // 34 電気と磁気は別の世界？ → 1820年
 'mx3-to-oersted':(p,ctx)=>{
  const sl=smooth(clamp(ctx.t/1.2)),mx=mix(M.x,880,sl),yg=on(ctx,'せんはっぴゃく',.6);
  let s='';const ch=[{x:180,y:M.y,q:1},{x:400,y:M.y,q:-1}];
  const fl=fieldLines(ch,{n:14,step:4,bounds:[20,130,570,505]});
  s+=fade(sl,fl.map(l=>draw(l,1,{color:MX.E,w:3})).join('')+charge(180,M.y,1)+charge(400,M.y,-1));
  const sc=mix(1,.85,sl);
  s+=`<g transform="translate(${mx.toFixed(1)} ${M.y}) scale(${sc.toFixed(3)}) translate(${-M.x} ${-M.y})">${fade(1-sl,lines3({heads:1}))+fade(sl,lines3({heads:1,open:false}))+magBase()}</g>`;
  s+=fade(on(ctx,'べつの',.5),line(600,140,600,505,{color:MX.dim,w:3,dash:'10 10'}));
  s+=word('電気',70,180,{size:32,color:MX.E,g:on(ctx,'でんきと')})+word('磁気',1130,180,{size:32,color:MX.B,anchor:'end',g:on(ctx,'じきは')});
  s+=fade(yg,callout(470,420,260,80,label('1820年',600,475,{size:40,color:MX.hi,anchor:'middle',weight:700})));
  return stage(ctx,p,s);
 },

 // 35 電流を流すと方位磁針が回る（エルステッド）
 'mx4-compass':(p,ctx)=>{const T=ctx.t,c=on(ctx,'ながすと',.3),t0=at(ctx,'ながすと');
  const a=swing(90,needle(0,RC,1),T,t0);
  let s=base4(ctx,{c,T})+compassAt(Math.PI/2,a,1,30);
  s+=word('方位磁針',P4.cx+50,500,{size:26,g:on(ctx,'ほういじしん')*(1-on(ctx,'デンマーク'))});
  s+=word('電流',P4.cx+40,200,{size:28,color:MX.I,g:c});
  s+=fade(on(ctx,'デンマーク',.6),callout(780,190,380,190,label('エルステッド',970,260,{size:36,color:MX.ink,anchor:'middle',weight:700})+label('デンマーク・1820年',970,325,{size:28,color:MX.dim,anchor:'middle'})));
  return stage(ctx,p,s);
 },
 // 36 電気が磁石を動かした → 別の世界ではない
 'mx4-link':(p,ctx)=>{const T=ctx.t;
  let s=base4(ctx,{c:1,T})+compassAt(Math.PI/2,needle(0,RC,1),1,30);
  s+=fade(on(ctx,'でんきが'),callout(760,170,420,110,causal('電流','磁石が動く',970,238,{ca:MX.I,cb:MX.B,size:34})));
  const j=on(ctx,'なかった',.8),gx=mix(160,70,j);
  s+=fade(on(ctx,'べつの'),word('電気',970-gx,400,{size:34,color:MX.E,anchor:'end'})+word('磁気',970+gx,400,{size:34,color:MX.B})+fade(j,line(970-gx,388,970+gx,388,{color:MX.hi,w:6})));
  s+=fade(j,label('ひとつながり',970,470,{size:30,color:MX.hi,anchor:'middle',weight:700}));
  return stage(ctx,p,s);
 },
 // 37 電線のまわりに方位磁針を並べる → 円に沿ってそろう
 'mx4-ring':(p,ctx)=>{const T=ctx.t,off=clamp(T/.5),cOn=on(ctx,'かこむ',.3),t1=at(ctx,'かこむ'),t0=at(ctx,'ならべて');
  const c=cOn>0?cOn:1-off;
  let s=base4(ctx,{c,T});
  s+=fade(on(ctx,'えんに',.6),ringPlate(RC,{color:'#ffffff',w:2.5,op:.55,p:clamp(since(ctx,'えんに')/.9)}));
  PHI.forEach((ph,i)=>{const g=i===0?1:clamp((T-t0-i*.18)/.3);if(g<=0)return;
   const target=needle(RC*Math.cos(ph),RC*Math.sin(ph),1);
   const a=i===0?(T<t1?swing(needle(0,RC,1),90,T,0):swing(90,target,T,t1)):swing(90,target,T,t1);
   s+=compassAt(ph,a,g);});
  s+=word('電流オン',P4.cx+40,200,{size:28,color:MX.I,g:cOn});
  return stage(ctx,p,s);
 },
 // 38 輪の磁場。向きは右ねじを回す向き
 'mx4-screw':(p,ctx)=>{const T=ctx.t,rg=on(ctx,'わの',.8),hg=on(ctx,'むきは',.5),sg=on(ctx,'みぎねじ',.6);
  const rings=[100,RC,240].map(r=>ringPlate(r,{p:clamp(since(ctx,'わの')/1.2),heads:hg,flow:T*.12})).join('');
  let s=base4(ctx,{c:1,T,rings})+PHI.map(ph=>compassAt(ph,needle(RC*Math.cos(ph),RC*Math.sin(ph),1),1-.75*rg)).join('');
  if(sg>0){const x=P4.cx,y0=175,y1=285,w=22,sh=(T*28)%16;let sc=`<rect x="${x-w}" y="${y0}" width="${2*w}" height="${y1-y0}" rx="6" fill="#9fb0cc" fill-opacity=".85"/>`;
   for(let y=y1+8-sh;y>y0+8;y-=16)sc+=line(x+w,y,x-w,y-9,{color:'#475572',w:3});
   sc+=`<polygon points="${x},${y0-30} ${x-w-4},${y0} ${x+w+4},${y0}" fill="#9fb0cc"/>`;
   // rotation arrow around the screw: front part moves to the right (counter-clockwise seen from above)
   const A0=Math.PI*1.05,A1=Math.PI*.08,pts=[];for(let i=0;i<=40;i++){const a=mix(A0,A1,i/40);pts.push([x+62*Math.cos(a),y1-10+18*Math.sin(a)]);}
   sc+=draw(pts,1,{color:MX.B,w:6});
   s+=fade(sg,sc+head(pts[40][0],pts[40][1],Math.atan2(-18*Math.cos(A1),62*Math.sin(A1)),MX.B,18));
   s+=fade(sg,arrow(x+62,y1-50,x+62,y0-6,{color:MX.I,w:6,head:18})+word('右ねじ',x+95,200,{size:30,color:MX.ink}));}
  s+=word('輪の磁場',720,260,{size:32,color:MX.B,g:rg});
  return stage(ctx,p,s);
 },
 // 39 B は I に比例、r に反比例。B = μ0 I / 2πr
 'mx4-formula':(p,ctx)=>{const T=ctx.t;
  const i2=on(ctx,'でんりゅうに',.6)*(1-on(ctx,'でんせんからの',.6)),rG=on(ctx,'きょりに',1.0),I=1+i2,r=mix(110,220,rG),fg=on(ctx,'こうこう',.6);
  const L=100*I*110/r;const [x,y]=pj(0,r);
  let s=base4(ctx,{c:1,T,I,rings:ringPlate(r,{op:.45,w:3})});
  s+=line(P4.cx,P4.cy,x,y,{color:'#ffffff',w:3,dash:'7 6'})+tex('r',P4.cx+16,mix(P4.cy,y,.6)+8,{size:34,color:'#ffffff',auto:false})+dot(x,y,8,'#ffffff')+arrow(x,y,x+L,y,{color:MX.B,w:7,head:20});
  s+=fade(i2,label('電流 ×2',P4.cx+30,215,{size:28,color:MX.I,weight:700})+label('×2',x+L+14,y+10,{size:28,color:MX.B,weight:700}));
  s+=fade(rG*(1-fg*0),label('距離 ×2',x-24,y+8,{size:26,color:MX.ink,anchor:'end',weight:700})+fade(rG>0.95?1:0,label('×½',x+L+14,y+10,{size:28,color:MX.B,weight:700})));
  s+=panel(fg,fit(FORM,960,330,380,64,{auto:false,color:MX.ink})+label('高校の式',960,215,{size:26,color:MX.dim,anchor:'middle'}));
  return stage(ctx,p,s);
 },
 // 40 μ0 = 二つ目の数（実験で測る）
 'mx4-card-mu':(p,ctx)=>{const T=ctx.t,cg=on(ctx,'ふたつめ',.6),pul=.5+.5*Math.sin(T*5);
  const [x,y]=pj(0,110);
  let s=base4(ctx,{c:1,T,rings:ringPlate(110,{op:.45,w:3})})+dot(x,y,8,'#ffffff')+arrow(x,y,x+100,y,{color:MX.B,w:7,head:20});
  s+=panel(1,fit(FORM,960,245,340,56,{auto:false,color:MX.ink}),{h:190});
  s+=fade(on(ctx,'ミューゼロ',.5),`<rect x="${980-3*pul}" y="${163-3*pul}" width="${60+6*pul}" height="${50+6*pul}" rx="10" fill="none" stroke="${MX.hi}" stroke-width="3"/>`);
  s+=fade(cg,callout(740,350,440,150,label('二つ目の数',770,392,{size:26,color:MX.hi,weight:700})+fit(`\\mu_0\\approx 1.26\\times 10^{-6}\\ \\mathrm{N/A^2}`,960,455,400,44,{auto:false,color:MX.ink})));
  s+=word('実験で 測った',60,200,{size:28,color:MX.hi,g:on(ctx,'じっけん')});
  return stage(ctx,p,s);
 },
 // 41 円を一周歩く：道に沿った B は一定、一周 2πr を掛ける
 'mx4-walk':(p,ctx)=>{const T=ctx.t,R=180,wg=since(ctx,'いっしゅう');
  const u=clamp(wg/Math.max(1.5,VE(ctx)-at(ctx,'いっしゅう')-.3));const ph=Math.PI/2-2*Math.PI*u;
  const pts=[];for(let i=0;i<=96*u;i++){const a=Math.PI/2-2*Math.PI*i/96;pts.push(pj(R*Math.cos(a),R*Math.sin(a)));}
  let s=base4(ctx,{c:1,T,rings:ringPlate(R,{color:'#ffffff',w:2.5,op:.35})+draw(pts,1,{color:MX.good,w:6})});
  const [x,y]=pj(R*Math.cos(ph),R*Math.sin(ph)),bx=Math.sin(ph),bz=-Math.cos(ph),n=Math.hypot(bx,P4.k*bz);
  const bg=on(ctx,'みちに',.5);
  s+=fade(bg,arrow(x,y,x+70*bx/n,y+70*P4.k*bz/n,{color:MX.B,w:6,head:18}));
  s+=`<circle cx="${x}" cy="${y-16}" r="9" fill="${MX.good}"/>`+line(x,y-8,x,y+8,{color:MX.good,w:6});
  s+=panel(on(ctx,'みちに',.5),label('道に沿った磁場',960,200,{size:28,color:MX.B,anchor:'middle',weight:700})+label('どこでも 同じ',960,245,{size:28,color:MX.ink,anchor:'middle'})
   +fade(on(ctx,'ながさ',.5),fit(`${cB('B')}\\times {\\color{${MX.good}}2\\pi r}\\;=\\;?`,960,370,360,56,{auto:false,color:MX.ink})));
  s+=word('一周 2πr',140,480,{size:28,color:MX.good,g:on(ctx,'ながさ')});
  return stage(ctx,p,s);
 },
 // 42 2πr が約分で消えて μ0 I。円の大きさによらない
 'mx4-cancel':(p,ctx)=>{const T=ctx.t,sk=clamp(since(ctx,'やくぶん')/.6),rg=on(ctx,'ミューゼロ',.5),szg=on(ctx,'おおきさ',.5),wg=on(ctx,'かこんだ',.5);
  const R=mix(180,180+70*Math.sin((T-at(ctx,'おおきさ'))*2.2),szg*(szg>0?1:0));
  const L=90*180/R;const [x,y]=pj(0,R);
  let s=base4(ctx,{c:1,T,glow:wg*(.6+.4*Math.sin(T*6)),rings:ringPlate(R,{color:MX.good,w:5})});
  s+=arrow(x,y,x+L,y,{color:MX.B,w:6,head:18});
  const size=46,cx=960,y1=275,f1=`\\dfrac{\\mu_0 ${cI('I')}}{2\\pi r}`,w1=texWidth(f1,size,false),w2=texWidth('\\times',size,false),w3=texWidth('2\\pi r',size,false),gap=14,tot=w1+w2+w3+2*gap,x0=cx-tot/2;
  let pn=tex(f1,x0+w1/2,y1,{size,auto:false,color:MX.ink})+tex('\\times',x0+w1+gap+w2/2,y1,{size,auto:false,color:MX.ink})+tex('2\\pi r',x0+w1+w2+2*gap+w3/2,y1,{size,auto:false,color:MX.good});
  const wd=texWidth('2\\pi r',size*.72,false);
  if(sk>0){pn+=line(x0+w1/2-wd/2-4,y1+30,mix(x0+w1/2-wd/2-4,x0+w1/2+wd/2+4,sk),y1+14,{color:MX.plus,w:5})+line(x0+w1+w2+2*gap-4,y1+8,mix(x0+w1+w2+2*gap-4,x0+tot+4,sk),y1-14,{color:MX.plus,w:5});}
  pn+=fade(rg,fit(`=\\;\\mu_0 ${cI('I')}`,cx,370,300,64,{auto:false,color:MX.ink}))+fade(rg,label('残る',cx,445,{size:28,color:MX.hi,anchor:'middle',weight:700}));
  s+=panel(1,label('磁場 × 一周',cx,180,{size:26,color:MX.dim,anchor:'middle'})+pn);
  s+=word('大きさ によらない',120,200,{size:28,color:MX.good,g:szg});
  s+=word('囲んだ電流',P4.cx+40,215,{size:28,color:MX.I,g:wg});
  return stage(ctx,p,s);
 },
 // 43 道に沿って一周足す = μ0 × 囲んだ電流 → アンペールの法則（④の前半）
 'mx4-ampere':(p,ctx)=>{const T=ctx.t,R=180,N=16,ag=clamp(since(ctx,'みちに')/Math.max(1.5,at(ctx,'かこんだ')-at(ctx,'みちに')+1));
  let rings='';const segs=[];for(let i=0;i<N;i++){const a0=Math.PI/2-2*Math.PI*i/N,a1=Math.PI/2-2*Math.PI*(i+1)/N;segs.push([pj(R*Math.cos(a0),R*Math.sin(a0)),pj(R*Math.cos(a1),R*Math.sin(a1))]);}
  rings=ringPlate(R,{color:'#ffffff',w:2.5,op:.35});
  segs.forEach(([a,b],i)=>{const g=clamp(ag*N-i);if(g>0)rings+=arrow(a[0],a[1],mix(a[0],b[0],.92),mix(a[1],b[1],.92),{color:MX.B,w:6,head:14,g});});
  let s=base4(ctx,{c:1,T,rings});
  s+=fade(on(ctx,'いっしゅう',.4),label('一周 足す',160,200,{size:30,color:MX.B,weight:700}));
  const eg=on(ctx,'ミューゼロばい',.6),lg=clamp(since(ctx,'アンペール')/.8);
  s+=panel(eg,fit(`\\oint ${cB('\\vec B')}\\cdot d\\vec r=\\mu_0 ${cI('I')}`,960,300,390,60,{auto:false,color:MX.ink})+label('アンペールの法則',960,420,{size:30,color:MX.hi,anchor:'middle',weight:700}));
  s+=link(1050,140,4,lg);
  return stage(ctx,p,s);
 },
 // 44 電流 → 磁場。逆に 磁場 → 電流 は？
 'mx4-to-faraday':(p,ctx)=>{const T=ctx.t;
  let s=base4(ctx,{c:1,T,rings:[100,RC,240].map(r=>ringPlate(r,{op:.6,heads:1,flow:T*.12})).join('')});
  s+=fade(on(ctx,'でんりゅうが',.5),callout(760,160,420,110,causal('電流','磁場',970,228,{ca:MX.I,cb:MX.B,size:36})));
  const q=on(ctx,'ぎゃくに',.6),pul=.5+.5*Math.sin(T*6);
  s+=fade(q,callout(760,320,420,110,causal('磁場','電流',940,388,{ca:MX.B,cb:MX.I,size:36})+label('？',1120,396,{size:44+6*pul,color:MX.hi,anchor:'middle',weight:700})));
  s+=fade(q,arrow(970,285,970,312,{color:MX.dim,w:4,head:12})+label('逆は？',1010,305,{size:24,color:MX.dim}));
  return stage(ctx,p,s);
 },
};

// YouTube シリーズ「慣性モーメント・上級 1/3」(ys-uc-rigid1-1) — 図。Stage 1200×515.
// 色：距離 r・x 水色、密度 σ・λ（DEN）砂色、1切れ dm 黄、物体 灰青、結果の枠 黄。
// 数値：円板 ½MR²（M＝2、R＝0.3 → 0.09）、輪 0.18。輪3本 ≈0.47、6本 ≈0.49。棒 M＝3、l＝2 → Ml²/12＝1、端 4。
import {C,seg,lin,fade,mix,clamp,label,line,rect,dot,ring,arrow,highlight,draw,poly,texWidth,brace} from './anim.mjs';
import {card,T,cc} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {cX,cH,cA,L,boxT} from './yt1-uc-shm-1-diagrams.mjs';

const K='uc-rigid1-1:';
const TAU=2*Math.PI;
export const DEN='#e6c98f';          // density σ・λ・ρ
export const BODY='#8aa0c4';         // body material
const n2=v=>Number(v.toFixed(2));
export const tr=cX('r'),tx=cX('x'),tz=cX('z'),tdm=cH('dm'),sg=cc(DEN,'\\sigma'),lm=cc(DEN,'\\lambda'),rh=cc(DEN,'\\rho');
export const KGM2='\\ \\mathrm{kg\\cdot m^2}';

// ---------- shared pieces ----------
// axis perpendicular to the screen (⊙)
export function axisDot(cx,cy,{lab='軸',dx=18,dy=-18,col=C.ink,size=24}={}){
 return ring(cx,cy,11,{color:col,w:3,fill:C.bg})+dot(cx,cy,4,col)+(lab?label(lab,cx+dx,cy+dy,{size,color:C.dim}):'');
}
// vertical dashed axis (in the screen)
export const vAxis=(x,y1,y2,lab='軸')=>line(x,y1,x,y2,{color:C.dim,w:2.5,dash:'8 7'})+(lab?label(lab,x+12,y1+20,{size:24,color:C.dim}):'');
// thin ring (top view)
export const ringTop=(cx,cy,R,{w=12,col=BODY,o=1}={})=>`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${n2(R)}" fill="none" stroke="${col}" stroke-width="${w}" stroke-opacity="${o}"/>`;
// disc (top view), optionally cut into N concentric rings
export function discTop(cx,cy,R,{N=0,g=1,fo=.3,col=BODY}={}){
 let s=`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${n2(R)}" fill="${col}" fill-opacity="${n2(fo*(N?1-g:1))}" stroke="${col}" stroke-width="2"/>`;
 if(N){const dr=R/N;for(let i=N;i>=1;i--)s+=fade(g,`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${n2(i*dr-dr/2)}" fill="none" stroke="${i%2?'#7f95ba':'#5d7299'}" stroke-opacity=".75" stroke-width="${n2(dr-2.5)}"/>`);}
 return s;
}
export const hiRing=(cx,cy,r,w,g=1,col=C.hi)=>fade(g,`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${n2(r)}" fill="none" stroke="${col}" stroke-width="${n2(w)}" stroke-opacity=".9"/>`);
// rod side view
export function rodBar(x0,x1,y,{h=24,N=0,col=BODY,fo=.4,hi=-1}={}){
 let s=rect(x0,y-h/2,x1-x0,h,{fill:col,fo,stroke:col,sw:2,rx:4});
 if(N)for(let i=1;i<N;i++){const X=x0+(x1-x0)*i/N;s+=line(X,y-h/2,X,y+h/2,{color:C.bg,w:2.5});}
 if(hi>=0&&N){const w=(x1-x0)/N;s+=rect(x0+w*hi,y-h/2,w,h,{fill:C.hi,fo:.6,stroke:C.hi,sw:2,rx:2});}
 return s;
}
// perspective disc / sphere for the overview
export function discPersp(cx,cy,R,{ph=0,col=BODY,axis=true}={}){
 const ry=R*.3;let s='';
 if(axis)s+=line(cx,cy-R*.9,cx,cy,{color:C.dim,w:2.5,dash:'8 7'});
 s+=`<ellipse cx="${n2(cx)}" cy="${n2(cy+10)}" rx="${n2(R)}" ry="${n2(ry)}" fill="${col}" fill-opacity=".18" stroke="${col}" stroke-width="2"/>`;
 s+=`<ellipse cx="${n2(cx)}" cy="${n2(cy)}" rx="${n2(R)}" ry="${n2(ry)}" fill="${col}" fill-opacity=".35" stroke="${col}" stroke-width="2"/>`;
 s+=dot(cx+R*Math.cos(ph),cy+ry*Math.sin(ph),7,C.hi);
 if(axis)s+=line(cx,cy,cx,cy+R*.9,{color:C.dim,w:2.5,dash:'8 7'});
 return s;
}
export function spherePersp(cx,cy,R,{ph=0,col=BODY,axis=true}={}){
 let s=`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${n2(R)}" fill="${col}" fill-opacity=".22" stroke="${col}" stroke-width="2"/>`;
 s+=`<ellipse cx="${n2(cx)}" cy="${n2(cy)}" rx="${n2(R)}" ry="${n2(R*.22)}" fill="none" stroke="${col}" stroke-width="1.5" stroke-dasharray="6 6"/>`;
 // a meridian that turns with ph
 const c=Math.cos(ph);s+=`<ellipse cx="${n2(cx)}" cy="${n2(cy)}" rx="${n2(Math.abs(R*c))}" ry="${n2(R)}" fill="none" stroke="${C.hi}" stroke-width="2" stroke-opacity=".6"/>`;
 if(axis)s+=line(cx,cy-R-40,cx,cy+R+40,{color:C.dim,w:2.5,dash:'8 7'});
 return s;
}
export function rodPersp(cx,cy,L,{ph=0,col=BODY,axis=true}={}){
 const c=Math.cos(ph),s_=Math.sin(ph);
 let s=axis?line(cx,cy-150,cx,cy+150,{color:C.dim,w:2.5,dash:'8 7'}):'';
 s+=line(cx-L*c,cy-L*s_*.25,cx+L*c,cy+L*s_*.25,{color:col,w:16});
 return s+dot(cx,cy,6,C.ink);
}
// tex pieces laid out left-to-right; returns svg and piece centres
export function rowT(parts,x,y,size,{gap=.14,anchor='middle'}={}){
 const ws=parts.map(q=>texWidth(q,size,false)),tot=ws.reduce((a,b)=>a+b,0)+size*gap*(parts.length-1);
 let X=anchor==='middle'?x-tot/2:x;const pos=[];let s='';
 parts.forEach((q,i)=>{pos.push({x:X+ws[i]/2,w:ws[i]});s+=T(q,X+ws[i]/2,y,{size});X+=ws[i]+size*gap;});
 return {svg:s,pos,w:tot};
}
export const strike=(x,y,w,size,g=1)=>fade(g,line(x-w/2-4,y+size*.12,x+w/2+4,y-size*.42,{color:C.a,w:4}));
// horizontal bars of I/(MR²)
export function ratioBars(rows,{x=330,y=110,unit=520,gap=88,g=1}={}){
 let s=line(x,y-40,x,y+gap*rows.length-30,{color:C.dim,w:2});
 rows.forEach(([name,v,col,txt,gi=1],i)=>{const Y=y+i*gap;s+=fade(gi,label(name,x-20,Y+10,{size:28,color:col,anchor:'end',weight:700})+rect(x,Y-22,unit*v,44,{fill:col,fo:.55,stroke:col,sw:2,rx:4})+label(txt,x+unit*v+16,Y+10,{size:28,color:C.ink}));});
 return fade(g,s);
}

// disc rings (midpoint approximation)
function discApprox(cx,cy,R,n,{g=1}={}){
 let s=discTop(cx,cy,R,{N:n,g:1});
 for(let k=1;k<=n;k++){const rm=R*(k-.5)/n;s+=fade(g,`<circle cx="${cx}" cy="${cy}" r="${n2(rm)}" fill="none" stroke="${C.hi}" stroke-width="2.5" stroke-dasharray="5 5"/>`);}
 return s+axisDot(cx,cy,{lab:''});
}

// rod graph (x from −1 to 1 m) with λx² above
const RG={x0:300,x1:900,y:420,ys:230};
const RXg=x=>600+300*x;
function rodGraph({g=1,shade=0,left=1,right=1,slice=null}={}){
 let s=rodBar(RG.x0,RG.x1,RG.y,{h:22})+vAxis(600,120,470,'');
 s+=line(260,RG.y-40,940,RG.y-40,{color:C.faint,w:2});
 const pts=Array.from({length:121},(_,i)=>{const x=-1+i/60;return [RXg(x),RG.y-40-RG.ys*x*x];});
 if(shade){
  const area=(a,b)=>poly([[RXg(a),RG.y-40],...Array.from({length:61},(_,i)=>{const x=a+(b-a)*i/60;return [RXg(x),RG.y-40-RG.ys*x*x];}),[RXg(b),RG.y-40]],{fill:C.x,fo:.28});
  s+=fade(shade*left,area(-1,0))+fade(shade*right,area(0,1));
 }
 s+=fade(g,draw(pts,1,{color:C.x,w:3.5}))+fade(g,label('λx²',RXg(1)+10,RG.y-40-RG.ys+6,{size:26,color:C.x,weight:700}));
 s+=label('−l/2',RXg(-1),RG.y+44,{size:24,color:C.dim,anchor:'middle'})+label('0',600,RG.y+44,{size:24,color:C.dim,anchor:'middle'})+label('l/2',RXg(1),RG.y+44,{size:24,color:C.dim,anchor:'middle'});
 return s;
}

// slope race (中級 18-2 の数値：v² 円板 8、輪 6)
function slope(p){
 const x0=120,y0=110,x1=760,y1=440,Lp=Math.hypot(x1-x0,y1-y0),ux=(x1-x0)/Lp,uy=(y1-y0)/Lp,nx=uy,ny=-ux;
 let s=poly([[x0,y0],[x1,y1],[x0,y1]],{fill:'#24314b',fo:1,stroke:C.dim,sw:2});
 const u=clamp(p/.75),dD=Lp*.86*u*u,dR=Lp*.86*u*u*.75;// a_disc : a_ring = 2/3 : 1/2
 const put=(d,R,isRing)=>{const cx=x0+ux*(d+30)+nx*R,cy=y0+uy*(d+30)+ny*R,th=(d)/R;
  let q=isRing?ringTop(cx,cy,R-5,{w:8,col:'#c9a7ff'}):`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${R}" fill="${C.x}" fill-opacity=".35" stroke="${C.x}" stroke-width="2.5"/>`;
  q+=line(cx,cy,cx+R*Math.cos(th),cy+R*Math.sin(th),{color:C.ink,w:2.5});return q;};
 s+=put(dR,34,true)+put(dD,34,false);
 return s;
}

export const ytUcRigid11Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  const ph=TAU*1.2*p;
  let s=rodPersp(200,250,130,{ph})+discPersp(600,250,150,{ph})+spherePersp(1000,250,130,{ph});
  s+=L('棒',200,470,{size:30,weight:700})+L('円板',600,470,{size:30,weight:700})+L('球',1000,470,{size:30,weight:700});
  s+=fade(seg(p,.35,.5),L('回しにくさ I ＝ ？',600,48,{size:32,color:C.hi,weight:700}));
  return s;
 },
 [K+'recap']:(p)=>{
  const x0=330,x1=930,y=440,N=8;
  let s=vAxis(x0,200,500,'')+rodBar(x0,x1,y,{N});
  for(let i=0;i<N;i++){const xm=(i+.5)/N,h=200*xm*xm,gi=seg(p,.1+i*.04,.25+i*.04);s+=fade(gi,rect(x0+(x1-x0)*i/N+4,y-20-h,(x1-x0)/N-8,h,{fill:C.x,fo:.35,stroke:C.x,sw:1.5,rx:2}));}
  s+=label('端の 軸',x0-20,y+8,{size:24,color:C.dim,anchor:'end'});
  s+=card(320,5,560,185,L('慣性モーメント・中級',600,42,{size:24,color:C.dim})+T(`I=\\int ${tx}^2\\,${tdm}=\\dfrac{Ml^2}{3}`,600,138,{size:42}),seg(p,0,.1),C.hi);
  return s;
 },
 [K+'promise']:(p)=>{
  let s=ringTop(230,270,130)+axisDot(230,270,{lab:''})+L('輪',230,460,{size:30,weight:700});
  s+=T('I=MR^2',230,80,{size:40});
  s+=discTop(620,270,130)+axisDot(620,270,{lab:''})+L('円板',620,460,{size:30,weight:700});
  s+=fade(seg(p,.15,.3),T('I=\\dfrac{1}{2}MR^2',620,80,{size:40}));
  s+=fade(seg(p,.45,.6),card(820,200,340,140,L('値 だけ 使った',990,250,{size:26,color:C.dim})+L('→ 上級で 積分',990,305,{size:30,color:C.hi,weight:700}),1,C.hi));
  return s;
 },
 [K+'plan']:(p)=>{
  let s='';
  const items=[[220,'① 輪'],[600,'② 円板'],[980,'③ 棒（真ん中の 軸）']];
  s+=fade(seg(p,.05,.2),ringTop(220,240,120)+axisDot(220,240,{lab:''}));
  s+=fade(seg(p,.25,.4),discTop(600,240,120)+axisDot(600,240,{lab:''}));
  s+=fade(seg(p,.45,.6),rodBar(840,1120,240)+vAxis(980,120,370,''));
  items.forEach(([X,t],i)=>{s+=fade(seg(p,.05+i*.2,.2+i*.2),L(t,X,430,{size:28,weight:700}));});
  s+=fade(seg(p,.2,.3),arrow(370,240,430,240,{color:C.dim,w:4,head:14}))+fade(seg(p,.4,.5),arrow(750,240,810,240,{color:C.dim,w:4,head:14}));
  s+=L('平らな ものから',600,50,{size:30,color:C.hi,weight:700});
  return s;
 },
 [K+'steps']:(p)=>{
  const box=(X,i,title,tx_,g)=>fade(g,rect(X-170,90,340,230,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:14})+L(title,X,150,{size:28,weight:700,color:C.hi})+T(tx_,X,250,{size:46}));
  let s=box(220,0,'① 1切れの 質量',tdm,seg(p,.0,.12))+box(600,1,'② 距離² を 掛ける',`${tr}^2\\,${tdm}`,seg(p,.3,.42))+box(980,2,'③ 全部 足す',`\\int ${tr}^2\\,${tdm}`,seg(p,.55,.67));
  s+=fade(seg(p,.28,.35),arrow(395,205,425,205,{color:C.dim,w:4,head:12}))+fade(seg(p,.53,.6),arrow(775,205,805,205,{color:C.dim,w:4,head:12}));
  s+=fade(seg(p,.7,.82),boxT(`I=\\int ${tr}^2\\,${tdm}`,600,430,46,1,C.hi));
  return s;
 },
 // ===== S2 輪 =====
 [K+'def']:(p)=>{
  let s=boxT(`I=\\int ${tr}^2\\,${tdm}`,330,120,58,1,C.hi);
  const cx=330,cy=360;
  s+=`<ellipse cx="${cx}" cy="${cy}" rx="230" ry="120" fill="${BODY}" fill-opacity=".25" stroke="${BODY}" stroke-width="2"/>`+axisDot(cx,cy,{lab:'軸',dx:-50,dy:-14});
  const px=cx+150,py=cy-50;
  s+=fade(seg(p,.15,.3),line(cx,cy,px,py,{color:C.x,w:4})+label('r',(cx+px)/2-6,(cy+py)/2-14,{size:30,color:C.x,weight:700}));
  s+=fade(seg(p,.3,.45),rect(px-12,py-12,24,24,{fill:C.hi,fo:.8,stroke:C.hi,rx:3})+label('dm',px+20,py+8,{size:28,color:C.hi,weight:700}));
  s+=card(650,170,500,250,label('r',690,240,{size:32,color:C.x,weight:700})+label('軸からの 垂直な 距離',730,240,{size:28})
   +fade(seg(p,.45,.6),label('dm',690,340,{size:32,color:C.hi,weight:700})+label('細かく 切った 1切れの 質量',760,340,{size:28})),seg(p,.15,.25));
  return s;
 },
 [K+'ring']:(p)=>{
  const cx=360,cy=260,R=180;
  let s=ringTop(cx,cy,R)+axisDot(cx,cy,{lab:'軸',dx:-50,dy:-16});
  s+=fade(seg(p,.2,.35),line(cx,cy,cx+R*Math.cos(-.5),cy+R*Math.sin(-.5),{color:C.ink,w:3,dash:'7 6'})+label('R',cx+R*.55,cy-R*.35-14,{size:32,color:C.ink,weight:700}));
  s+=label('上から 見た 図',cx,40,{size:24,color:C.dim,anchor:'middle'});
  // side view inset: ring with axis perpendicular to its face
  const sx=880,sy=250;
  s+=card(660,70,440,330,L('横から 見ると',sx,115,{size:24,color:C.dim})+vAxis(sx,150,340,'')+`<ellipse cx="${sx}" cy="${sy}" rx="160" ry="40" fill="none" stroke="${BODY}" stroke-width="9"/>`+label('軸は 輪の 面に 垂直',sx,382,{size:24,color:C.dim,anchor:'middle'}),seg(p,.4,.55));
  return s;
 },
 [K+'ringcut']:(p)=>{
  const cx=360,cy=260,R=180,N=16;
  let s='';
  for(let i=0;i<N;i++){const a0=TAU*i/N+.04,a1=TAU*(i+1)/N-.04;s+=draw(Array.from({length:9},(_,j)=>{const a=mix(a0,a1,j/8);return [cx+R*Math.cos(a),cy+R*Math.sin(a)];}),1,{color:BODY,w:12});}
  s+=axisDot(cx,cy,{lab:''});
  for(let i=0;i<N;i+=2){const a=TAU*(i+.5)/N,gi=seg(p,.1+i*.025,.2+i*.025);s+=fade(gi,line(cx,cy,cx+R*Math.cos(a),cy+R*Math.sin(a),{color:C.x,w:2.5})+dot(cx+R*Math.cos(a),cy+R*Math.sin(a),7,C.hi));}
  s+=card(660,140,460,200,L('どの 1切れも',890,200,{size:30})+L('軸から 距離 R',890,270,{size:34,color:C.hi,weight:700}),seg(p,.3,.45));
  return s;
 },
 [K+'ringout']:(p)=>{
  let s=ringTop(200,260,120)+axisDot(200,260,{lab:''});
  s+=T(`I=\\int R^2\\,${tdm}`,720,130,{size:50});
  s+=fade(seg(p,.15,.3),L('R² は どこでも 同じ → 外へ',720,240,{size:28,color:C.dim}));
  s+=fade(seg(p,.35,.5),boxT(`I=R^2\\int ${tdm}`,720,370,54,1,C.hi));
  return s;
 },
 [K+'ringM']:(p)=>{
  let s=ringTop(200,260,120)+axisDot(200,260,{lab:''})+L('全質量 M',200,430,{size:28});
  s+=T(`I=R^2\\int ${tdm}`,720,110,{size:48,opacity:.85});
  s+=fade(seg(p,.05,.2),T(`\\int ${tdm}=M`,720,220,{size:46})+L('1切れを 全部 足すと 全質量',720,290,{size:26,color:C.dim}));
  s+=fade(seg(p,.5,.65),boxT('I=MR^2',720,410,56,1,C.hi));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=ringTop(300,240,150)+axisDot(300,240,{lab:''})+L('輪',300,440,{size:30,weight:700})+T('I=MR^2',300,490,{size:34});
  s+=discTop(900,240,150)+axisDot(900,240,{lab:''})+L('円板',900,440,{size:30,weight:700})+T('I=\\;?',900,490,{size:34});
  s+=L('同じ M、同じ R',600,60,{size:28,color:C.dim});
  s+=fade(seg(p,.3,.45),L('回しにくい？',600,210,{size:30,color:C.hi,weight:700})+L('回しやすい？',600,280,{size:30,color:C.hi,weight:700}));
  return s;
 },
 // ===== S3 円板 =====
 [K+'idea']:(p)=>{
  const cx=330,cy=260,R=200;
  let s=discTop(cx,cy,R)+axisDot(cx,cy,{lab:''});
  const pts=[[60,.6],[60,2.6],[130,1.3],[130,3.9],[190,.2],[190,4.6]];
  pts.forEach(([r,a],i)=>{const g=seg(p,.05+i*.04,.15+i*.04),col=r===60?C.x:r===130?C.hi:C.a;s+=fade(g,line(cx,cy,cx+r*Math.cos(a),cy+r*Math.sin(a),{color:col,w:2.5})+dot(cx+r*Math.cos(a),cy+r*Math.sin(a),8,col));});
  [[60,C.x],[130,C.hi],[190,C.a]].forEach(([r,col])=>{s+=fade(seg(p,.5,.65),ring(cx,cy,r,{color:col,w:3,dash:'7 6'}));});
  s+=card(660,110,480,280,L('距離が 場所で 違う',900,175,{size:30})+fade(seg(p,.5,.65),L('→ 同じ 距離を まとめる',900,250,{size:30,color:C.hi,weight:700})+L('（同じ 円の 上）',900,310,{size:26,color:C.dim})),seg(p,0,.1));
  return s;
 },
 [K+'rings']:(p)=>{
  const cx=330,cy=260,R=200,N=10,dr=R/N,ri=5.5*dr;
  let s=discTop(cx,cy,R,{N,g:seg(p,.0,.3)})+axisDot(cx,cy,{lab:''});
  s+=hiRing(cx,cy,ri,dr-2,seg(p,.45,.6));
  s+=fade(seg(p,.5,.65),line(cx,cy,cx+ri*Math.cos(-2.3),cy+ri*Math.sin(-2.3),{color:C.x,w:3.5})+label('r',cx+ri*.5*Math.cos(-2.3)-26,cy+ri*.5*Math.sin(-2.3),{size:32,color:C.x,weight:700}));
  s+=card(660,110,480,280,L('中心が 同じ 細い 輪',900,170,{size:28})+fade(seg(p,.5,.65),label('半径',740,250,{size:28})+label('r',820,250,{size:32,color:C.x,weight:700})+label('幅',740,320,{size:28})+label('dr',790,320,{size:32,color:C.x,weight:700})),seg(p,0,.1));
  return s;
 },
 [K+'rR']:(p)=>{
  const cx=330,cy=260,R=200,N=10,dr=R/N;
  const rr=p<.6?mix(dr/2,R-dr/2,lin(p,.05,.6)):mix(R-dr/2,5.5*dr,seg(p,.6,.75));
  let s=discTop(cx,cy,R,{N})+axisDot(cx,cy,{lab:''});
  s+=hiRing(cx,cy,rr,dr-2,1);
  s+=line(cx,cy,cx+rr*Math.cos(-2.3),cy+rr*Math.sin(-2.3),{color:C.x,w:3.5})+label('r',cx+rr*.5*Math.cos(-2.3)-26,cy+rr*.5*Math.sin(-2.3),{size:32,color:C.x,weight:700});
  s+=line(cx,cy,cx+R,cy,{color:C.ink,w:3,dash:'7 6'})+label('R',cx+R+14,cy+10,{size:32,color:C.ink,weight:700});
  s+=card(660,110,480,280,label('r',700,190,{size:34,color:C.x,weight:700})+label('0 から R まで 動く',740,190,{size:28})
   +fade(seg(p,.5,.62),label('R',700,290,{size:34,color:C.ink,weight:700})+label('円板 全体の 半径（一定）',740,290,{size:28})),seg(p,0,.08));
  return s;
 },
 [K+'sigma']:(p)=>{
  const cx=330,cy=260,R=200;
  let s=discTop(cx,cy,R)+axisDot(cx,cy,{lab:''});
  // equal little squares
  for(let i=-4;i<=4;i++)for(let j=-4;j<=4;j++){const X=cx+i*42,Y=cy+j*42;if(Math.hypot(i*42,j*42)<R-30){const g=seg(p,.05+((i+4)*9+(j+4))*.002,.2+((i+4)*9+(j+4))*.002);s+=fade(g,rect(X-15,Y-15,30,30,{fill:DEN,fo:.4,stroke:DEN,sw:1.2,rx:2}));}}
  s+=card(660,70,480,370,L('どの 1 m² も 同じ 質量',900,130,{size:28})+fade(seg(p,.3,.45),T(`${sg}=\\dfrac{M}{\\pi R^2}`,900,240,{size:52}))
   +fade(seg(p,.3,.45),L('全質量 ÷ 全面積',900,320,{size:24,color:C.dim}))+fade(seg(p,.6,.75),L('面密度（1 m² あたりの 質量）',900,395,{size:26,color:DEN,weight:700})),seg(p,0,.08));
  return s;
 },
 [K+'strip']:(p)=>{
  const cx=230,cy=250,R=170,N=10,dr=R/N,ri=5.5*dr;
  let s=discTop(cx,cy,R,{N})+axisDot(cx,cy,{lab:''});
  const u=seg(p,.1,.55),Lr=TAU*ri,sx=470,sy=400,M=120;
  const pts=Array.from({length:M+1},(_,i)=>{const f=i/M,ang=-Math.PI/2+TAU*f;const c=[cx+ri*Math.cos(ang),cy+ri*Math.sin(ang)],t=[sx+Lr*f,sy];return [mix(c[0],t[0],u),mix(c[1],t[1],u)];});
  s+=draw(pts,1,{color:C.hi,w:dr-2});
  s+=fade(seg(p,.55,.7),line(sx,sy+30,sx+Lr,sy+30,{color:C.x,w:3})+line(sx,sy+22,sx,sy+38,{color:C.x,w:3})+line(sx+Lr,sy+22,sx+Lr,sy+38,{color:C.x,w:3})+T(`2\\pi ${tr}`,sx+Lr/2,sy+66,{size:32})+T(`d${tr}`,sx+Lr+40,sy+8,{size:30}));
  s+=fade(seg(p,.7,.85),label('細い 帯の 面積',sx+40,200,{size:28})+T(`2\\pi ${tr}\\,d${tr}`,sx+420,200,{size:42}));
  s+=fade(seg(p,0,.12),label('1本の 輪を 切り開く',sx+40,90,{size:28,color:C.dim}));
  return s;
 },
 [K+'dm']:(p)=>{
  const sx=250,sy=110,Lr=700;
  let s=rect(sx,sy-9,Lr,18,{fill:C.hi,fo:.8,stroke:C.hi,rx:2})+T(`2\\pi ${tr}`,sx+Lr/2,sy+50,{size:30})+T(`d${tr}`,sx+Lr+36,sy+6,{size:28});
  const R=rowT([`${tdm}`,'=',`${sg}`,'\\times',`2\\pi ${tr}\\,d${tr}`],600,300,54);
  s+=R.svg;
  s+=fade(seg(p,.1,.25),label('面密度',R.pos[2].x,380,{size:26,color:DEN,anchor:'middle',weight:700}))+fade(seg(p,.3,.45),label('面積',R.pos[4].x,380,{size:26,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.05,.2),L('輪の 質量 ＝ 面密度 × 面積',600,450,{size:28,color:C.dim}));
  return s;
 },
 [K+'subst']:(p)=>{
  let s=T(`${tdm}=${sg}\\times 2\\pi ${tr}\\,d${tr}`,600,70,{size:42,opacity:.8});
  // manual layout so that both π can be struck
  const size=52,y=230;
  const pieces=[`${tdm}=`,'FRAC','\\times 2','\\pi',`${tr}\\,d${tr}`];
  const wNum=texWidth('M',size,false),wDen=texWidth('\\pi R^2',size,false),wPi=texWidth('\\pi',size,false),wF=Math.max(wNum,wDen)+20;
  const ws=pieces.map(q=>q==='FRAC'?wF:texWidth(q,size,false)),gap=size*.16,tot=ws.reduce((a,b)=>a+b,0)+gap*4;
  let X=600-tot/2;const pos=[];ws.forEach(w=>{pos.push(X+w/2);X+=w+gap;});
  const g1=seg(p,.05,.2);
  let row=T(pieces[0],pos[0],y,{size})+T('M',pos[1],y-size*.62,{size})+line(pos[1]-wF/2,y-size*.25,pos[1]+wF/2,y-size*.25,{color:C.ink,w:3})+T('\\pi R^2',pos[1],y+size*.62,{size})
   +T(pieces[2],pos[2],y,{size})+T(pieces[3],pos[3],y,{size})+T(pieces[4],pos[4],y,{size});
  s+=fade(g1,row);
  s+=fade(g1,label('σ に 代入',pos[1],y-size*1.35,{size:24,color:DEN,anchor:'middle'}));
  const g2=seg(p,.3,.42),denPiX=pos[1]-wDen/2+wPi/2;
  s+=strike(denPiX,y+size*.62,wPi,size,g2)+strike(pos[3],y,wPi,size,g2);
  s+=fade(seg(p,.35,.48),label('π が 約分',pos[3]+70,y-size*.9,{size:26,color:C.a,weight:700}));
  s+=fade(seg(p,.5,.62),boxT(`${tdm}=\\dfrac{2M}{R^2}\\,${tr}\\,d${tr}`,600,420,50,1,C.hi,true));
  return s;
 },
 [K+'check']:(p)=>{
  let s=T(`\\int_0^{R}\\dfrac{2M}{R^2}\\,${tr}\\,d${tr}`,600,90,{size:46});
  s+=fade(seg(p,.2,.32),L('r の 原始関数は r²/2 → 0 から R で R²/2',600,190,{size:26,color:C.dim}));
  s+=fade(seg(p,.35,.48),T(`=\\dfrac{2M}{R^2}\\times\\dfrac{R^2}{2}`,600,290,{size:46}));
  s+=fade(seg(p,.55,.68),boxT('=M',520,430,52,1,C.F)+label('全質量に 戻る ✓',620,440,{size:30,color:C.F,weight:700}));
  return s;
 },
 // ===== S4 円板の積分 =====
 [K+'contrib']:(p)=>{
  const cx=250,cy=260,R=190,N=10,dr=R/N,ri=5.5*dr;
  let s=discTop(cx,cy,R,{N})+axisDot(cx,cy,{lab:''})+hiRing(cx,cy,ri,dr-2,1);
  s+=line(cx,cy,cx+ri*Math.cos(-2.3),cy+ri*Math.sin(-2.3),{color:C.x,w:3.5})+label('r',cx+ri*.5*Math.cos(-2.3)-26,cy+ri*.5*Math.sin(-2.3),{size:32,color:C.x,weight:700});
  s+=T(`${tr}^2\\times ${tdm}`,800,120,{size:46});
  s+=fade(seg(p,.2,.35),boxT(`=\\dfrac{2M}{R^2}\\,${tr}^3\\,d${tr}`,800,280,50,1,C.hi,true));
  s+=fade(seg(p,.55,.7),L('輪の 中は どこも 距離 r',800,440,{size:28,color:C.dim}));
  return s;
 },
 [K+'int']:(p)=>{
  const cx=250,cy=260,R=190,N=10,dr=R/N;
  const k=Math.min(N-1,Math.floor(lin(p,.1,.8)*N));
  let s=discTop(cx,cy,R,{N})+axisDot(cx,cy,{lab:''});
  for(let i=0;i<=k;i++)s+=hiRing(cx,cy,(i+.5)*dr,dr-2,i===k?1:.45);
  s+=boxT(`I=\\int_0^{R}\\dfrac{2M}{R^2}\\,${tr}^3\\,d${tr}`,800,200,48,1,C.hi,true);
  s+=fade(seg(p,.3,.45),L('r ＝ 0 から R まで 輪を 足す',800,380,{size:28,color:C.dim}));
  return s;
 },
 [K+'out']:(p)=>{
  let s=T(`I=\\int_0^{R}\\dfrac{2M}{R^2}\\,${tr}^3\\,d${tr}`,600,100,{size:44,opacity:.8});
  s+=fade(seg(p,.1,.25),L('2M/R² は r に よらない 定数 → 外へ',600,215,{size:28,color:C.dim}));
  s+=fade(seg(p,.4,.55),boxT(`I=\\dfrac{2M}{R^2}\\int_0^{R}${tr}^3\\,d${tr}`,600,360,52,1,C.hi,true));
  return s;
 },
 [K+'prim']:(p)=>{
  let s=card(150,20,900,170,L('積分・上級：tⁿ の 原始関数は',600,62,{size:26,color:C.dim})+T(`t^n\\ \\to\\ \\dfrac{t^{n+1}}{n+1}`,420,135,{size:36})+T(`n=3:\\ \\ ${tr}^3\\ \\to\\ \\dfrac{${tr}^4}{4}`,790,135,{size:36}),seg(p,0,.08));
  s+=fade(seg(p,.4,.55),boxT(`\\int_0^{R}${tr}^3\\,d${tr}=\\dfrac{R^4}{4}-0=\\dfrac{R^4}{4}`,600,330,50,1,C.hi,true));
  return s;
 },
 [K+'sub']:(p)=>{
  let s=T(`I=\\dfrac{2M}{R^2}\\int_0^{R}${tr}^3\\,d${tr}`,600,100,{size:44,opacity:.8});
  s+=fade(seg(p,.1,.25),label('∫ を R⁴/4 に',600,210,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.25,.4),boxT('I=\\dfrac{2M}{R^2}\\times\\dfrac{R^4}{4}',600,350,52,1,C.hi,true));
  return s;
 },
 [K+'half']:(p)=>{
  let s=T('I=\\dfrac{2M}{R^2}\\times\\dfrac{R^4}{4}',600,90,{size:46});
  s+=fade(seg(p,.05,.2),T('\\dfrac{R^4}{R^2}=R^2',380,240,{size:44}))+fade(seg(p,.25,.4),T('\\dfrac{2}{4}=\\dfrac{1}{2}',820,240,{size:44}));
  s+=fade(seg(p,.5,.62),boxT('I=\\dfrac{1}{2}MR^2',600,415,54,1,C.hi,true));
  return s;
 },
 [K+'bars']:(p)=>{
  let s=ratioBars([['輪',1,'#c9a7ff','1'],['円板',.5,C.x,'½',seg(p,.1,.25)]],{x:330,y:170,unit:600,gap:120});
  s+=L('I ÷ (MR²)',600,60,{size:30,color:C.dim});
  s+=fade(seg(p,.45,.6),L('円板は 輪の ちょうど 半分',600,450,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'approx']:(p)=>{
  let s=discApprox(250,260,190,3,{g:seg(p,.05,.2)});
  s+=label('各輪の 真ん中に 質量を 集める',250,40,{size:24,color:C.dim,anchor:'middle'});
  const rows=[['\\tfrac19M','\\tfrac16R'],['\\tfrac13M','\\tfrac12R'],['\\tfrac59M','\\tfrac56R']];
  s+=card(520,60,640,300,label('輪の 質量',620,110,{size:24,color:C.dim,anchor:'middle'})+label('真ん中の 半径',900,110,{size:24,color:C.dim,anchor:'middle'})
   +rows.map(([m,r],i)=>fade(seg(p,.15+i*.1,.25+i*.1),T(m,620,175+i*62,{size:36})+T(r,900,175+i*62,{size:36}))).join(''),seg(p,0,.08));
  s+=fade(seg(p,.5,.62),boxT('I\\approx 0.47\\,MR^2',840,440,46,1,C.hi));
  return s;
 },
 [K+'approx2']:(p)=>{
  let s=discApprox(250,260,190,6,{g:1});
  s+=ratioBars([['3本',.4722,C.dim,'≈ 0.47'],['6本',.4931,C.dim,'≈ 0.49',seg(p,.05,.2)],['積分',.5,C.x,'＝ 0.5',seg(p,.45,.6)]],{x:640,y:150,unit:700,gap:110});
  s+=line(640+350,90,640+350,440,{color:C.hi,w:2,dash:'6 6'});
  s+=L('I ÷ (MR²)',840,60,{size:26,color:C.dim});
  return s;
 },
 [K+'why']:(p)=>{
  const cx=270,cy=250,R=190,N=5,dr=R/N;
  let s=discTop(cx,cy,R,{N})+axisDot(cx,cy,{lab:''});
  s+=hiRing(cx,cy,dr*.5,dr-3,seg(p,.3,.45),C.x)+hiRing(cx,cy,dr*4.5,dr-3,seg(p,.3,.45),C.a);
  s+=card(560,60,600,170,L('内側の 輪',860,110,{size:28,color:C.x,weight:700})+L('短くて 軽い ・ 軸に 近い',860,180,{size:28}),seg(p,.3,.42));
  s+=card(560,260,600,170,L('外側の 輪',860,310,{size:28,color:C.a,weight:700})+L('長くて 重い ・ 軸から 遠い',860,380,{size:28}),seg(p,.4,.52));
  s+=fade(seg(p,0,.15),L('質量が 内側にも ある',cx,480,{size:28,color:C.hi,weight:700}));
  return s;
 },
 [K+'num']:(p)=>{
  let s=card(100,50,1000,190,L('円板　M ＝ 2 kg、R ＝ 0.3 m',600,100,{size:28,color:C.dim})+T(`I=\\dfrac{1}{2}\\times 2\\times 0.3^2=0.09${KGM2}`,600,180,{size:44}),seg(p,0,.08),C.x);
  s+=card(100,280,1000,170,L('同じ M、R の 輪',600,325,{size:28,color:C.dim})+T(`I=2\\times 0.3^2=0.18${KGM2}`,600,400,{size:44}),seg(p,.55,.65),'#c9a7ff');
  return s;
 },
 // ===== S5 棒 =====
 [K+'rod']:(p)=>{
  const ph=TAU*.5*seg(p,.5,1);
  let s=rodBar(250,950,300)+vAxis(600,110,470);
  s+=brace(250,950,330,{size:28,color:C.dim})+label('l ＝ 2 m',780,395,{size:28,color:C.dim,anchor:'middle'});
  s+=label('M ＝ 3 kg',780,250,{size:28,color:C.ink});
  s+=fade(seg(p,.3,.45),label('真ん中が 軸',620,190,{size:26,color:C.hi,weight:700}));
  s+=`<path d="M 540 220 A 60 18 0 0 0 660 220" fill="none" stroke="${C.F}" stroke-width="4"/>`+arrow(650,224,664,218,{color:C.F,w:4,head:14});
  return s+'';
 },
 [K+'lambda']:(p)=>{
  let s=rect(250,288,350,24,{fill:DEN,fo:.45,stroke:DEN,sw:2,rx:4})+rect(600,288,350,24,{fill:BODY,fo:.45,stroke:BODY,sw:2,rx:4})+vAxis(600,110,470);
  s+=brace(250,600,330,{text:'1 m → 1.5 kg',size:26,color:DEN})+brace(600,950,330,{text:'1 m → 1.5 kg',size:26,color:C.dim});
  s+=card(230,40,740,170,L('線密度（1 m あたりの 質量）',600,85,{size:26,color:DEN,weight:700})+T(`${lm}=\\dfrac{M}{l}=\\dfrac{3}{2}=1.5\\ \\mathrm{kg/m}`,600,160,{size:44}),seg(p,.05,.18));
  return s;
 },
 [K+'coord']:(p)=>{
  let s=rodBar(300,900,260)+vAxis(600,110,470,'');
  s+=arrow(260,360,950,360,{color:C.dim,w:2.5,head:14})+label('x',960,368,{size:28,color:C.x,weight:700});
  [[-1,'−l/2'],[0,'0'],[1,'l/2']].forEach(([x,t])=>{s+=line(RXg(x),352,RXg(x),368,{color:C.dim,w:2})+label(t,RXg(x),402,{size:26,color:C.dim,anchor:'middle'});});
  const xs=.55,g=seg(p,.45,.6);
  s+=fade(g,rect(RXg(xs)-12,248,24,24,{fill:C.hi,fo:.85,stroke:C.hi,rx:2})+line(RXg(xs),285,RXg(xs),352,{color:C.x,w:2,dash:'5 5'})+label('x',RXg(xs),342,{size:26,color:C.x,anchor:'middle',weight:700}));
  s+=fade(g,card(700,60,420,120,T(`${tdm}=${lm}\\,d${tx}`,910,125,{size:46}),1,C.hi));
  return s;
 },
 [K+'dist']:(p)=>{
  let s=rodGraph({g:seg(p,.3,.5)});
  const xs=.6;
  for(const sg_ of [1,-1]){const X=RXg(sg_*xs),gi=sg_>0?seg(p,0,.15):seg(p,.1,.25);
   s+=fade(gi,rect(X-12,RG.y-12,24,24,{fill:C.hi,fo:.85,stroke:C.hi,rx:2})+rect(X-14,RG.y-40-RG.ys*xs*xs,28,RG.ys*xs*xs,{fill:C.x,fo:.45,stroke:C.x,rx:2}));}
  s+=fade(seg(p,.1,.25),label('x ＜ 0',RXg(-xs),RG.y+80,{size:26,color:C.x,anchor:'middle',weight:700})+label('x ＞ 0',RXg(xs),RG.y+80,{size:26,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.35,.5),label('x² は どちらも 正',600,90,{size:30,color:C.hi,weight:700,anchor:'middle'}));
  return s;
 },
 [K+'rodint']:(p)=>{
  let s=rodGraph({shade:seg(p,.2,.4)});
  s+=boxT(`I=\\int_{-l/2}^{\\,l/2}${tx}^2\\,${lm}\\,d${tx}`,600,80,44,1,C.hi,true);
  return s;
 },
 [K+'sym']:(p)=>{
  let s=rodGraph({shade:1,left:1-.6*seg(p,.15,.3)});
  s+=fade(seg(p,.15,.3),label('左 ＝ 右',RXg(-.5),RG.y-120,{size:28,color:C.dim,anchor:'middle'})+label('右 × 2',RXg(.5),RG.y-120,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),boxT(`I=2${lm}\\int_0^{\\,l/2}${tx}^2\\,d${tx}`,600,80,44,1,C.hi,true));
  return s;
 },
 [K+'calc']:(p)=>{
  let s=T(`\\int_0^{\\,l/2}${tx}^2\\,d${tx}`,330,120,{size:48});
  s+=fade(seg(p,.05,.2),L('x² の 原始関数は x³/3',330,240,{size:26,color:C.dim}));
  s+=fade(seg(p,.3,.45),T(`=\\dfrac{(l/2)^3}{3}`,730,120,{size:48}));
  s+=fade(seg(p,.55,.7),boxT('=\\dfrac{l^3}{24}',730,330,52,1,C.hi,true));
  s+=fade(seg(p,.55,.7),L('(l/2)³ ＝ l³/8、 8 × 3 ＝ 24',730,460,{size:26,color:C.dim}));
  return s;
 },
 [K+'res']:(p)=>{
  let s=T(`I=2${lm}\\times\\dfrac{l^3}{24}`,600,110,{size:50});
  s+=fade(seg(p,.2,.35),L('2/24 ＝ 1/12',600,240,{size:28,color:C.dim}));
  s+=fade(seg(p,.35,.5),boxT(`I=\\dfrac{${lm}\\,l^3}{12}`,600,370,54,1,C.hi,true));
  return s;
 },
 [K+'back']:(p)=>{
  let s=T(`I=\\dfrac{${lm}\\,l^3}{12}`,330,120,{size:50})+fade(seg(p,.05,.2),T(`${lm}=\\dfrac{M}{l}`,800,120,{size:46}));
  s+=fade(seg(p,.25,.4),T('I=\\dfrac{M}{l}\\times\\dfrac{l^3}{12}',600,260,{size:46}));
  s+=fade(seg(p,.5,.62),boxT('I=\\dfrac{Ml^2}{12}',600,420,54,1,C.hi,true));
  return s;
 },
 [K+'rodnum']:(p)=>{
  let s=T(`I=\\dfrac{3\\times 2^2}{12}=1${KGM2}`,600,110,{size:52});
  s+=card(230,230,740,200,L('慣性モーメント・中級',600,280,{size:24,color:C.dim})+L('半分の 棒（1.5 kg、1 m）2本：',600,335,{size:28})+T(`1.5\\times 1^2\\div 3\\times 2=1${KGM2}`,600,395,{size:38}),seg(p,.35,.48),C.F);
  return s;
 },
 // ===== S6 まとめ =====
 [K+'table']:(p)=>{
  const col=(X,icon,name,f,g)=>fade(g,rect(X-170,60,340,400,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:14})+icon+L(name,X,330,{size:28,weight:700})+T(f,X,410,{size:44}));
  let s=col(220,ringTop(220,190,90)+axisDot(220,190,{lab:''}),'輪','MR^2',seg(p,0,.12));
  s+=col(600,discTop(600,190,90)+axisDot(600,190,{lab:''}),'円板','\\dfrac{1}{2}MR^2',seg(p,.2,.32));
  s+=col(980,rodBar(860,1100,190)+vAxis(980,110,270,''),'棒（真ん中）','\\dfrac{1}{12}Ml^2',seg(p,.45,.57));
  return s;
 },
 [K+'same']:(p)=>{
  let s=L('① dm を 作る → ② 距離² を 掛ける → ③ 足す',600,60,{size:30,color:C.hi,weight:700});
  s+=card(80,120,500,320,L('棒',330,175,{size:30,weight:700})+T(`${tdm}=${lm}\\,d${tx}`,330,280,{size:48})+L('線密度 × 長さ',330,380,{size:26,color:C.dim}),seg(p,.25,.37));
  s+=card(620,120,500,320,L('円板',870,175,{size:30,weight:700})+T(`${tdm}=${sg}\\times 2\\pi ${tr}\\,d${tr}`,870,280,{size:44})+L('面密度 × 面積',870,380,{size:26,color:C.dim}),seg(p,.45,.57));
  return s;
 },
 [K+'roll']:(p)=>{
  let s=slope(p);
  s+=card(800,70,360,330,L('中級：同じ 坂',980,115,{size:24,color:C.dim})+label('円板',840,190,{size:28,color:C.x,weight:700})+T('v^2=8',1050,190,{size:36})+label('輪',840,270,{size:28,color:'#c9a7ff',weight:700})+T('v^2=6',1050,270,{size:36})+L('（単位 m²/s²）',980,330,{size:22,color:C.dim})+fade(seg(p,.5,.65),L('円板の ½ が 効く',980,380,{size:26,color:C.hi,weight:700})),seg(p,0,.08));
  return s;
 },
 [K+'next']:(p)=>{
  const cx=330,cy=260,R=200;
  let s=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="${BODY}" fill-opacity=".12" stroke="${BODY}" stroke-width="2"/>`+vAxis(cx,cy-R-40,cy+R+40);
  const Kc=12,g=seg(p,.35,.8);
  for(let i=0;i<Kc;i++){const z=-1+(i+.5)*2/Kc,rr=R*Math.sqrt(1-z*z),y=cy-z*R,gi=clamp((g*Kc-i)/1.5);if(gi<=0)continue;
   s+=fade(gi,`<ellipse cx="${cx}" cy="${n2(y)}" rx="${n2(rr)}" ry="${n2(rr*.16)}" fill="${BODY}" fill-opacity=".3" stroke="${C.x}" stroke-width="1.5"/>`);}
  s+=fade(seg(p,0,.15),L('平ら → 立体',850,120,{size:30,color:C.dim}));
  s+=fade(seg(p,.35,.5),L('薄い 円板を 積み重ねる',850,220,{size:30}));
  s+=fade(seg(p,.6,.75),T('I=\\dfrac{2}{5}MR^2\\ ?',850,350,{size:50}));
  return s;
 },
};

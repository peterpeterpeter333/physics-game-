// YouTube シリーズ「線積分と面積分・中級 2/2」(ys-um-line-integral-entry-2) — 図。Stage 1200×515.
// 部品は 1/2（yt1-um-line-integral-entry-1-diagrams.mjs）と初級 20 の道（yt1-ui-electric-work-path-1-diagrams.mjs）から使う。
// 新しい例：力 𝐅＝(0, x) N（上向き、右ほど強い。静電場ではない）、原点→(1, 1) m。放物線 y＝x²：W_N＝(4N²−1)/(6N²) → 2/3。
//   道 A（先に右→上）1 J、道 B（先に上→右）0 J。
// 色：力 𝐅 緑、電場 𝐄 水色、電荷 q 桃、沿う部分 黄、仕事 橙、負 赤、Σ・∫ 黄、Δ𝐫ᵢ・d𝐫 金、道 A 青・道 B 薔薇・放物線 白。
import {C,clamp,mix,seg,fade,move,label,line,rect,dot,ring,draw,arrow,tex,texWidth,poly,highlight} from './anim.mjs';
import {SCOL,SEGS,VERT,curveAt,view,curveSvg,charge} from './yt1-ui-electric-work-path-1-diagrams.mjs';
import {FC,AL,PP,WC,NG,DC,EC,cs,T,card,cross,vF,Fri,dri,SIG,WNsum,hb,ov,VALS,O1} from './yt1-um-line-integral-entry-1-diagrams.mjs';

const K='um-line-integral-entry-2:';
const QP=C.p;// charge q
const PA='#6f9dff',PB='#f06a8a';
const vE=cs(EC,'\\mathbf{E}'),q=cs(QP,'q'),dr=cs(DC,'d\\mathbf{r}'),IC=cs(AL,'\\int_C');
const rad=d=>d*Math.PI/180;

// ---- the (0, x) force on the unit square -------------------------------------------------------------
const SQ={x0:120,y0:450,S:320};
const P=([u,v],o=SQ)=>[o.x0+o.S*u,o.y0-o.S*v];
function square({g=1,field=1,fop=.45,o=SQ}={}){
 let s=fade(g,arrow(o.x0-10,o.y0,o.x0+o.S+50,o.y0,{color:C.dim,w:2.5,head:13})+arrow(o.x0,o.y0+10,o.x0,o.y0-o.S-45,{color:C.dim,w:2.5,head:13})
  +label('x [m]',o.x0+o.S+56,o.y0+8,{size:22,color:C.dim})+label('y [m]',o.x0,o.y0-o.S-54,{size:22,color:C.dim,anchor:'middle'})
  +label('1',o.x0+o.S,o.y0+30,{size:22,color:C.dim,anchor:'middle'})+label('1',o.x0-14,o.y0-o.S+8,{size:22,color:C.dim,anchor:'end'})
  +line(o.x0+o.S,o.y0,o.x0+o.S,o.y0-o.S,{color:C.grid,w:1.5})+line(o.x0,o.y0-o.S,o.x0+o.S,o.y0-o.S,{color:C.grid,w:1.5})
  +label('0',o.x0-12,o.y0+26,{size:22,color:C.dim,anchor:'end'}));
 let f='';for(const u of [.25,.5,.75,1])for(const v of [.08,.38,.68]){const [x,y]=P([u,v],o);f+=arrow(x,y,x,y-u*o.S*.28,{color:FC,w:3,head:10,opacity:fop});}
 return s+fade(g*field,f);
}
const para=u=>[u,u*u];
function parabola({p=1,color=C.ink,w=4,o=SQ,opacity=1}={}){return draw(Array.from({length:81},(_,k)=>P(para(k/80),o)),p,{color,w,opacity});}
function chords(N,{g=1,o=SQ,mids=1,color=DC}={}){
 let s='';for(let i=1;i<=N;i++){const a=P(para((i-1)/N),o),b=P(para(i/N),o);s+=line(a[0],a[1],b[0],b[1],{color,w:N>8?3:4});
  if(mids){const m=[(a[0]+b[0])/2,(a[1]+b[1])/2];s+=dot(m[0],m[1],N>8?3:4.5,C.ink);}}
 for(let i=0;i<=N;i++)s+=dot(...P(para(i/N),o),N>8?2.5:4,color);
 return fade(g,s);
}
const WN=N=>(4*N*N-1)/(6*N*N);
function table(k,{x=640,y=80,g=1}={}){
 const rows=[[4,'0.656'],[8,'0.664'],[16,'0.666']];
 let s=label('区間の数 N',x+40,y+50,{size:24,color:C.dim})+label('和 [J]',x+330,y+50,{size:24,color:C.dim})+line(x+20,y+66,x+500,y+66,{color:C.faint,w:2});
 rows.forEach(([N,v],i)=>{s+=fade(clamp(k-i),label(String(N),x+110,y+112+i*56,{size:32,color:C.ink,anchor:'middle',weight:700})+label(v,x+360,y+112+i*56,{size:32,color:WC,anchor:'middle',weight:700}));});
 s+=fade(clamp(k-3),label('↓',x+360,y+112+3*52,{size:30,color:C.hi,anchor:'middle'})+label('0.667 ＝ 2/3',x+360,y+112+3*56+34,{size:32,color:C.hi,anchor:'middle',weight:700}));
 return card(x,y,520,300+120*clamp(k-3),s,g,C.faint);
}
// the Σ ↔ ∫ columns
function map(p,stage){
 const cols=[300,560,720,860],yT=150,yB=390;
 let s=label('有限の和',80,yT+10,{size:26,color:C.dim})+label('行き先',80,yB+10,{size:26,color:C.dim});
 s+=T(SIG(),cols[0],yT,{size:66})+T(Fri(),cols[1],yT,{size:58})+T('\\cdot',cols[2],yT,{size:58})+T(dri(),cols[3],yT,{size:58});
 s+=T(IC,cols[0],yB,{size:66})+T(vF,cols[1],yB,{size:58})+T('\\cdot',cols[2],yB,{size:58})+T(dr,cols[3],yB,{size:58});
 const g=stage===1?[seg(p,.1,.25),seg(p,.3,.45),0,seg(p,.5,.65)]:[1,1,seg(p,.05,.25),1];
 s+=arrow(cols[0],yT+78,cols[0],yB-100,{color:AL,w:4,head:14,g:g[0]});
 s+=arrow(cols[1],yT+50,cols[1],yB-60,{color:FC,w:4,head:14,g:g[1]});
 s+=arrow(cols[2],yT+30,cols[2],yB-50,{color:C.ink,w:4,head:14,g:g[2]});
 s+=arrow(cols[3],yT+50,cols[3],yB-60,{color:DC,w:4,head:14,g:g[3]});
 if(stage===1)s+=fade(seg(p,.7,.85),card(960,200,220,130,label('i と N は',1070,250,{size:26,color:C.ink,anchor:'middle'})+label('消える',1070,300,{size:30,color:C.hi,anchor:'middle',weight:700}),1,C.faint));
 if(stage===2)s+=fade(seg(p,.25,.4),card(960,200,220,130,label('内積の「·」は',1070,250,{size:24,color:C.ink,anchor:'middle'})+label('残る',1070,300,{size:30,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
 return s;
}
const LINE=`W=${IC}${vF}\\cdot${dr}`;
function curvy(V,{g=1,p=1}={}){return fade(g,curveSvg(V,{p,color:C.dim,w:5}));}
function eArrows(V,{g=1,sc=16}={}){let s='';[.5,1.5,2.5,3.5].forEach((t,i)=>{const [x,y]=V(curveAt(t));const qq=SEGS[i];s+=fade(seg(g,i*.1,i*.1+.5),arrow(x,y,x+Math.cos(rad(qq.edir))*qq.mag*sc,y-Math.sin(rad(qq.edir))*qq.mag*sc,{color:EC,w:4.5,head:13}));});return s;}
// reversed chords of the 4-segment path, with (optionally) reversed value labels
function ovRev({g=1,vals=0}={}){
 const V=view(O1.ox,O1.oy,O1.sc);let s=curveSvg(V,{color:C.dim,w:5,opacity:.4});
 const off=[[0,54],[44,44],[-78,0],[-14,-52]],txt=['−3 J','−2 J','0 J','+2 J'];
 SEGS.forEach((qq,i)=>{const a=V(VERT[i]),b=V(VERT[i+1]);s+=fade(g,arrow(b[0],b[1],a[0],a[1],{color:SCOL[i],w:5,head:15}));
  const m=[(a[0]+b[0])/2,(a[1]+b[1])/2];s+=fade(vals,label(txt[i],m[0]+off[i][0],m[1]+off[i][1]+10,{size:26,color:qq.dW>0?NG:WC,anchor:'middle',weight:700}));});
 return s;
}
function pathA(o=SQ,{g=1,w=5}={}){const a=P([0,0],o),b=P([1,0],o),c=P([1,1],o);return fade(g,draw([a,b,c],1,{color:PA,w})+arrow(mix(a[0],b[0],.45),a[1],mix(a[0],b[0],.6),a[1],{color:PA,w,head:14})+arrow(b[0],mix(b[1],c[1],.45),b[0],mix(b[1],c[1],.6),{color:PA,w,head:14}));}
function pathB(o=SQ,{g=1,w=5}={}){const a=P([0,0],o),b=P([0,1],o),c=P([1,1],o);return fade(g,draw([a,b,c],1,{color:PB,w})+arrow(a[0],mix(a[1],b[1],.45),a[0],mix(a[1],b[1],.6),{color:PB,w,head:14})+arrow(mix(b[0],c[0],.45),b[1],mix(b[0],c[0],.6),b[1],{color:PB,w,head:14}));}
function sphere(cx,cy,R,{g=1,E=1}={}){
 let s=ring(cx,cy,R,{color:C.dim,w:3,fill:'#9aabc7'})+`<ellipse cx="${cx}" cy="${cy}" rx="${R}" ry="${R*.28}" fill="none" stroke="${C.dim}" stroke-width="2" stroke-dasharray="6 6" opacity=".7"/>`;
 s=s.replace('fill="#9aabc7"','fill="#9aabc7" fill-opacity="0.08"');
 let e='';for(let k=0;k<12;k++){const a=k*Math.PI/6+.2;e+=arrow(cx+Math.cos(a)*(R-6),cy-Math.sin(a)*(R-6),cx+Math.cos(a)*(R+60),cy-Math.sin(a)*(R+60),{color:EC,w:4,head:12});}
 return fade(g,s+fade(E,e)+ring(cx,cy,20,{color:C.a,w:3,fill:'#3a1d2a'})+label('+',cx,cy+9,{size:28,color:C.a,anchor:'middle',weight:700}));
}

export const ytUmLineIntegralEntry2Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=ov({ox:130,oy:440,sc:100,Fsc:16,chords:1,F:1,rep:1,idx:1,curveOp:.4,org:[70,490]});
  s+=card(600,110,570,230,T(WNsum(),885,210,{size:50})+label('前回',885,300,{size:24,color:C.dim,anchor:'middle'}),seg(p,.1,.3),C.faint);
  return s;
 },
 [K+'recap2']:(p)=>{
  let s=ov({chords:1,chordCol:C.hi,curveOp:1,vals:1,valsText:VALS});
  s+=card(790,110,370,200,T(`W${cs(C.hi,'\\approx')}W_4=3\\,\\mathrm{J}`,975,195,{size:46})+label('近似',975,260,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.6),C.hi);
  return s;
 },
 [K+'ask']:(p)=>{
  let s=card(80,70,1040,190,T(`W_N=${SIG()}${Fri()}\\cdot${dri()}\\;\\xrightarrow{\\;N\\to\\infty\\;}\\;?`,600,172,{size:52}),1,C.hi);
  s+=card(80,290,500,170,label('逆向きなら？',330,390,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  s+=card(620,290,500,170,label('別の道なら？',870,390,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 // ===== S2 分割を増やす =====
 [K+'newex']:(p)=>{
  let s=square({g:seg(p,.05,.3),field:0});
  s+=card(640,140,480,190,label('新しい例',880,200,{size:26,color:C.dim,anchor:'middle'})+label('分割の数 だけを 変えて 比べる',880,260,{size:28,color:C.hi,anchor:'middle',weight:700})+label('（前の 3 J とは 別の計算）',880,305,{size:22,color:C.dim,anchor:'middle'}),seg(p,.2,.4),C.faint);
  return s;
 },
 [K+'field']:(p)=>{
  let s=square({field:seg(p,.05,.45)});
  s+=card(640,110,480,260,T(`${vF}=(0,\\;x)\\ \\mathrm{N}`,880,190,{size:50})+label('いつも 上向き・右ほど 強い',880,265,{size:26,color:FC,anchor:'middle',weight:700})
   +fade(seg(p,.6,.75),label('説明用の力（静電場 ではない）',880,325,{size:24,color:C.dim,anchor:'middle'})),seg(p,.1,.25),C.faint);
  return s;
 },
 [K+'path']:(p)=>{
  let s=square({})+parabola({p:seg(p,.1,.6)});
  s+=fade(seg(p,.1,.3),dot(...P([0,0]),7,C.ink)+dot(...P([1,1]),7,C.ink)+label('(1, 1)',P([1,1])[0]+14,P([1,1])[1]-10,{size:24,color:C.ink}));
  s+=fade(seg(p,.4,.6),T('C',P([.62,.38])[0]+30,P([.62,.38])[1]+30,{size:40,color:C.ink})+T('y=x^2',P([.35,.12])[0]+40,P([.35,.12])[1]+60,{size:32,color:C.ink}));
  return s;
 },
 [K+'n4']:(p)=>{
  let s=square({fop:.3})+parabola({opacity:.6})+chords(4,{g:seg(p,.05,.3)});
  s+=table(seg(p,.4,.6)*1,{});
  return s;
 },
 [K+'n8']:(p)=>{
  const u=seg(p,.02,.15),v=seg(p,.4,.55);
  let s=square({fop:.3})+parabola({opacity:.6})+chords(4,{g:1-u,mids:0})+chords(8,{g:u*(1-v),mids:0})+chords(16,{g:v,mids:0});
  s+=table(1+seg(p,.05,.2)+seg(p,.42,.57),{});
  s+=fade(seg(p,.4,.55),label('N ＝ 16',P([.5,1])[0],P([.5,1])[1]-20,{size:26,color:DC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'settle']:(p)=>{
  let s=square({fop:.3})+parabola({opacity:.6})+chords(16,{mids:0});
  s+=table(3,{});
  s+=fade(seg(p,.1,.3),label('1区間の 寄与 → 小さく',900,430,{size:24,color:C.ink,anchor:'middle'})+label('区間の数 → 多く',900,470,{size:24,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'gap']:(p)=>{
  let s=square({fop:.3})+parabola({})+chords(16,{mids:0,g:.6});
  s+=table(3+seg(p,.05,.25),{});
  return s;
 },
 [K+'exact']:(p)=>{
  let s=square({fop:.3})+parabola({});
  s+=table(4,{});
  s+=fade(seg(p,.1,.3),label('分割せずに 出す計算 → 上級',880,50,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 // ===== S3 行き先に名前を付ける =====
 [K+'lim']:(p)=>{
  let s=T(`W_N=${SIG()}${Fri()}\\cdot${dri()}`,600,110,{size:52});
  s+=fade(seg(p,.05,.15),label('有限の和 は ≈',1150,60,{size:24,color:C.dim,anchor:'end'}));
  s+=fade(seg(p,.2,.45),T(`W${cs(C.hi,'=')}\\lim_{N\\to\\infty}${SIG()}${Fri()}\\cdot${dri()}`,600,330,{size:62}));
  s+=fade(seg(p,.55,.7),label('行き先は ＝ で結べる',600,480,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'name']:(p)=>{
  let s=T(`W=\\lim_{N\\to\\infty}${SIG()}${Fri()}\\cdot${dri()}`,600,130,{size:56});
  s+=fade(seg(p,.1,.35),T(`=${IC}${vF}\\cdot${dr}`,600,320,{size:78}));
  s+=fade(seg(p,.45,.6),label('曲線 C に沿った 線積分（定義）',600,460,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'map1']:(p)=>map(p,1),
 [K+'map2']:(p)=>map(p,2),
 [K+'dr']:(p)=>{
  const V=view(O1.ox,O1.oy,O1.sc);let s=curveSvg(V,{color:C.dim,w:5});
  const t=1.7,[x,y]=V(curveAt(t)),[x2,y2]=V(curveAt(t+.02));const d=Math.hypot(x2-x,y2-y),ux=(x2-x)/d,uy=(y2-y)/d;
  s+=fade(seg(p,.05,.2),ring(x,y,46,{color:C.hi,w:3})+line(x+34,y-32,770,200,{color:C.hi,w:2,opacity:.6}));
  s+=fade(seg(p,.2,.4),ring(930,260,150,{color:C.hi,w:3,fill:'#0f1830'})+line(930-150*ux*.9,260-150*uy*.9,930+150*ux*.9,260+150*uy*.9,{color:C.dim,w:4})
   +arrow(930,260,930+ux*80,260+uy*80,{color:DC,w:6,head:16})+T(dr,930+ux*80+10,260+uy*80+44,{size:34,anchor:'start'}));
  s+=fade(seg(p,.5,.7),label('各点で 曲線に 接する向きの 小さな一歩',930,470,{size:26,color:DC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'C1']:(p)=>{
  let s=card(60,90,520,330,T(cs(AL,'\\int_a^b'),320,170,{size:58})+line(110,300,530,300,{color:C.dim,w:3})+line(180,300,470,300,{color:C.t,w:7})
   +dot(180,300,7,C.t)+dot(470,300,7,C.t)+label('a',180,340,{size:26,color:C.t,anchor:'middle'})+label('b',470,340,{size:26,color:C.t,anchor:'middle'})+label('数直線の 区間',320,395,{size:26,color:C.ink,anchor:'middle'}),seg(p,.4,.55),C.faint);
  const V=view(700,370,70);
  s+=card(620,90,520,330,T(IC,880,170,{size:58})+curveSvg(V,{color:C.ink,w:4})+dot(...V(VERT[0]),6,C.ink)+dot(...V(VERT[4]),6,C.ink)
   +T('C',V(curveAt(2.2))[0]+34,V(curveAt(2.2))[1]+14,{size:32,color:C.ink})+label('空間の中の 曲線',880,395,{size:26,color:C.ink,anchor:'middle'}),seg(p,.02,.15),C.hi);
  return s;
 },
 [K+'C2']:(p)=>{
  let s=square({field:0})+parabola({});
  s+=fade(seg(p,.1,.35),draw(Array.from({length:41},(_,k)=>{const u=k/40;return P([u,Math.sqrt(u)]);}),1,{color:C.hi,w:4}));
  s+=fade(seg(p,.1,.3),label('道 1',P([.7,.35])[0]+20,P([.7,.35])[1]+20,{size:24,color:C.ink,weight:700})+label('道 2',P([.25,.6])[0]-20,P([.25,.6])[1]-10,{size:24,color:C.hi,anchor:'end',weight:700}));
  s+=card(640,140,480,200,label('始点・終点が 同じでも',880,205,{size:26,color:C.ink,anchor:'middle'})+label('道が違えば 別の範囲',880,265,{size:30,color:C.hi,anchor:'middle',weight:700})+label('→ C で 道そのものを 指定',880,315,{size:24,color:C.ink,anchor:'middle'}),seg(p,.4,.55),C.hi);
  return s;
 },
 // ===== S4 電場の式に直す =====
 [K+'promise']:(p)=>{
  let s=card(80,80,500,330,label('初級 20 の 予告',330,130,{size:26,color:C.dim,anchor:'middle'})+label('「中級では',330,190,{size:30,color:C.ink,anchor:'middle'})+T(`${q}\\int${vE}\\cdot d\\mathbf{r}`,330,285,{size:46})+label('と書きます」',330,380,{size:30,color:C.ink,anchor:'middle'}),seg(p,0,.15),C.faint);
  s+=arrow(600,245,700,245,{color:C.hi,w:4,head:14,g:seg(p,.45,.6)});
  s+=card(720,145,420,200,label('ここで',930,210,{size:28,color:C.ink,anchor:'middle'})+label('定義 する',930,275,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'sub']:(p)=>{
  let s=T(LINE,600,110,{size:60});
  s+=fade(seg(p,.1,.3),T(`${vF}=${q}${vE}`,600,230,{size:52})+label('電荷 q が 受ける力',850,242,{size:24,color:C.dim}));
  s+=fade(seg(p,.45,.65),T(`W=${IC}${q}${vE}\\cdot${dr}`,600,380,{size:64}));
  return s;
 },
 [K+'out']:(p)=>{
  const f=`W=${IC}${q}${vE}\\cdot${dr}`;let s=T(f,600,130,{size:64});
  const [l,w]=hb(f,`W=${IC}`,q,600,64);
  s+=fade(seg(p,.1,.3),label('運ぶ電荷は 1つ → 道のどこでも 同じ 定数',600,230,{size:26,color:QP,anchor:'middle'}));
  s+=fade(seg(p,.4,.6),T(`W=${q}${IC}${vE}\\cdot${dr}`,600,360,{size:76}));
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=T(`W=${q}${IC}${vE}\\cdot${dr}`,600,130,{size:70});
  s+=card(330,260,540,160,T(`${vE}`,470,345,{size:56})+label('も 外へ 出せる？',650,355,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'ans']:(p)=>{
  const V=view(130,440,100);
  let s=curveSvg(V,{color:C.dim,w:5})+eArrows(V,{g:seg(p,.1,.6),sc:18});
  s+=card(620,110,520,280,T(`${vE}\\,${IC}\\cdots`,780,200,{size:48})+cross(900,190,20)
   +label('𝐄 は 場所ごとに 変わる',880,280,{size:28,color:EC,anchor:'middle',weight:700})+label('→ 各点で 一歩と 内積してから 足す',880,335,{size:24,color:C.ink,anchor:'middle'}),seg(p,.02,.15),NG);
  return s;
 },
 [K+'unit']:(p)=>{
  let s=T(`${IC}${vE}\\cdot${dr}`,600,100,{size:56});
  s+=fade(seg(p,.1,.3),T(`\\mathrm{\\tfrac{N}{C}}\\times\\mathrm{m}=\\mathrm{\\tfrac{J}{C}}`,600,240,{size:56}));
  s+=fade(seg(p,.3,.45),label('1 C あたりの 仕事',900,250,{size:26,color:C.ink}));
  s+=fade(seg(p,.55,.75),T(`\\mathrm{\\tfrac{J}{C}}\\times${cs(QP,'\\mathrm{C}')}=${cs(WC,'\\mathrm{J}')}`,600,390,{size:56}));
  return s;
 },
 // ===== S5 向きと道 =====
 [K+'rev']:(p)=>{
  let s=ov({chords:1-seg(p,.3,.55),curveOp:.5});
  s+=ovRev({g:seg(p,.4,.7)});
  s+=card(800,130,360,160,label('逆向きに たどると？',980,220,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'rev2']:(p)=>{
  let s=ovRev({})+ov({curve:0,F:seg(p,.05,.25),rep:1});
  s+=card(760,110,400,260,T(`${Fri()}`,960,180,{size:44})+label('同じ（同じ場所）',960,230,{size:24,color:FC,anchor:'middle'})
   +fade(seg(p,.45,.6),T(`${dri()}\\;\\to\\;-${dri()}`,960,300,{size:44})+label('全部 逆向き',960,350,{size:24,color:DC,anchor:'middle'})),seg(p,0,.12),C.faint);
  return s;
 },
 [K+'rev3']:(p)=>{
  let s=ovRev({vals:seg(p,.05,.3)});
  s+=card(760,110,400,230,T(`3+2+0-2=3\\,\\mathrm{J}`,960,180,{size:38})+fade(seg(p,.4,.6),T(`${cs(NG,'-3')}${cs(NG,'-2')}+0${cs(WC,'+2')}=${cs(NG,'-3\\,\\mathrm{J}')}`,960,270,{size:38})),seg(p,.3,.45),C.faint);
  s+=fade(seg(p,.6,.75),label('大きさ 同じ・符号 だけ 反転',960,390,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'rev4']:(p)=>{
  let s=card(80,110,500,240,label('積分・中級',330,165,{size:24,color:C.dim,anchor:'middle'})+T(`${cs(AL,'\\int_b^a')}f(x)\\,dx=-${cs(AL,'\\int_a^b')}f(x)\\,dx`,330,260,{size:40}),1,C.faint);
  s+=card(620,110,500,240,label('線積分',870,165,{size:24,color:C.dim,anchor:'middle'})+label('逆向きの C ＝ 符号が反転',870,260,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  s+=fade(seg(p,.55,.7),label('C には 進む向き まで 含める',600,430,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'paths']:(p)=>{
  let s=square({})+parabola({opacity:.35});
  s+=pathA(SQ,{g:seg(p,.3,.5)})+pathB(SQ,{g:seg(p,.45,.65)});
  s+=fade(seg(p,.3,.5),label('道 A：先に 右',P([1,.5])[0]+24,P([1,.5])[1],{size:24,color:PA,weight:700}));
  s+=fade(seg(p,.45,.65),label('道 B：先に 上',P([.5,1])[0],P([.5,1])[1]-22,{size:24,color:PB,anchor:'middle',weight:700}));
  s+=card(700,140,440,160,T(`${vF}=(0,\\;x)\\ \\mathrm{N}`,920,205,{size:42})+label('原点 → (1, 1) m',920,265,{size:26,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.faint);
  return s;
 },
 [K+'pA1']:(p)=>{
  let s=square({fop:.25})+pathA(SQ,{w:4})+pathB(SQ,{g:.25,w:3});
  const k=seg(p,.1,.9);
  for(const u of [.25,.5,.75]){const [x,y]=P([u,0]);s+=fade(seg(p,.15,.35),arrow(x,y,x,y-u*110,{color:FC,w:5,head:14})+`<path d="M${x+12} ${y} v-12 h-12" fill="none" stroke="${C.ink}" stroke-width="2"/>`);}
  s+=dot(...P([k,0]),9,C.hi);
  s+=card(700,130,440,220,label('右へ 進む間',920,190,{size:26,color:PA,anchor:'middle',weight:700})+label('力（上向き） ⊥ 一歩',920,250,{size:28,color:C.ink,anchor:'middle'})+label('→ 仕事 0',920,310,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),PA);
  return s;
 },
 [K+'pA2']:(p)=>{
  let s=square({fop:.25})+pathA(SQ,{w:4})+pathB(SQ,{g:.25,w:3});
  const k=seg(p,.1,.9);const [x,y]=P([1,k]);
  s+=fade(seg(p,.1,.3),arrow(x,y,x,y-110,{color:FC,w:6,head:16})+line(x,y,x,y-110,{color:AL,w:14,cap:'butt',opacity:.4}));
  s+=dot(x,y,9,C.hi);
  s+=card(700,130,440,250,label('x ＝ 1 m で 上へ 1 m',920,190,{size:26,color:PA,anchor:'middle',weight:700})+label('力 1 N（上向き）が 一歩に 沿う',920,245,{size:24,color:C.ink,anchor:'middle'})
   +fade(seg(p,.4,.55),T(`0+1\\times1=${cs(WC,'1\\,\\mathrm{J}')}`,920,320,{size:42})),seg(p,.05,.2),PA);
  return s;
 },
 [K+'pB']:(p)=>{
  let s=square({fop:.25})+pathA(SQ,{g:.25,w:3})+pathB(SQ,{w:4});
  s+=fade(seg(p,.05,.25),label('x ＝ 0：𝐅 ＝ 0',P([0,.5])[0]+18,P([0,.5])[1],{size:24,color:FC,weight:700}));
  for(const u of [.25,.5,.75]){const [x,y]=P([u,1]);s+=fade(seg(p,.4,.6),arrow(x,y,x,y-u*80,{color:FC,w:5,head:14}));}
  const k=seg(p,.05,.95),pt=k<.5?P([0,k*2]):P([(k-.5)*2,1]);s+=dot(...pt,9,C.hi);
  s+=card(700,130,440,250,label('上る間：力 0 → 0',920,195,{size:26,color:PB,anchor:'middle',weight:700})+fade(seg(p,.4,.55),label('右へ：力 ⊥ 一歩 → 0',920,255,{size:26,color:PB,anchor:'middle',weight:700}))
   +fade(seg(p,.65,.8),T(`0+0=${cs(WC,'0\\,\\mathrm{J}')}`,920,330,{size:42})),seg(p,.02,.15),PB);
  return s;
 },
 [K+'compare']:(p)=>{
  let s=square({fop:.2})+pathA(SQ,{w:4})+pathB(SQ,{w:4})+parabola({});
  const row=(y,c,t,v,g)=>fade(g,line(720,y-8,770,y-8,{color:c,w:5})+label(t,790,y,{size:26,color:c,weight:700})+label(v,1110,y,{size:30,color:WC,anchor:'end',weight:700}));
  s+=card(700,90,440,300,row(160,PA,'道 A（2 m）','1 J',seg(p,.02,.15))+row(230,PB,'道 B（2 m）','0 J',seg(p,.15,.3))+row(300,C.ink,'放物線','2/3 J',seg(p,.3,.45))
   +fade(seg(p,.55,.7),label('両端は 同じ',920,360,{size:24,color:C.dim,anchor:'middle'})),1,C.faint);
  return s;
 },
 [K+'general']:(p)=>{
  let s=card(100,90,1000,200,label('線積分の値は、一般には',600,160,{size:30,color:C.ink,anchor:'middle'})+label('両端 だけでなく、道 C にも 依存する',600,230,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  s+=card(250,330,700,120,label('道の長さ を 足している のでもない',600,400,{size:28,color:C.ink,anchor:'middle'}),seg(p,.5,.65),C.faint);
  return s;
 },
 [K+'static']:(p)=>{
  let s=card(100,90,1000,200,label('線積分の値は、一般には',600,160,{size:30,color:C.ink,anchor:'middle'})+label('両端 だけでなく、道 C にも 依存する',600,230,{size:36,color:C.hi,anchor:'middle',weight:700}),1,C.hi);
  s+=card(250,330,700,140,label('道に よらない 特別な力 も ある',600,385,{size:28,color:C.ink,anchor:'middle'})+label('静電場 → 電位の回で 確かめる',600,435,{size:28,color:EC,anchor:'middle',weight:700}),seg(p,.1,.25),EC);
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'summary']:(p)=>{
  let s=T(`W=\\lim_{N\\to\\infty}${SIG()}${Fri()}\\cdot${dri()}=${IC}${vF}\\cdot${dr}`,600,120,{size:48});
  s+=fade(seg(p,.35,.6),T(`${vF}=${q}${vE}\\;\\Rightarrow\\;W=${q}${IC}${vE}\\cdot${dr}`,600,300,{size:52}));
  return s;
 },
 [K+'summary2']:(p)=>{
  let s=T(`W=${q}${IC}${vE}\\cdot${dr}`,600,110,{size:52});
  s+=card(80,210,500,200,label('逆向き',330,270,{size:28,color:C.ink,anchor:'middle'})+label('→ 符号が 反転',330,335,{size:32,color:NG,anchor:'middle',weight:700}),seg(p,.05,.2),NG);
  s+=card(620,210,500,200,label('別の道',870,270,{size:28,color:C.ink,anchor:'middle'})+label('→ 値が 変わりうる',870,335,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'face']:(p)=>{
  const V=view(110,440,90);
  let s=curveSvg(V,{color:C.dim,w:5})+label('線に 沿って 足す',260,470,{size:24,color:C.dim,anchor:'middle'});
  const cx=860,cy=260,R=150;
  let bag='';const pts=Array.from({length:120},(_,i)=>{const t=2*Math.PI*i/120,r=R*(1+.1*Math.sin(2*t+.6)+.07*Math.cos(3*t));return [cx+r*Math.cos(t),cy-r*Math.sin(t)];});
  bag+=poly(pts,{fill:'#9aabc7',fo:.07,stroke:C.dim,sw:4});
  for(let k=0;k<120;k+=10)bag+=line(pts[k][0],pts[k][1],pts[(k+10)%120][0],pts[(k+10)%120][1],{color:C.ink,w:2,opacity:.5})+dot(pts[k][0],pts[k][1],4,C.ink);
  for(let k=0;k<5;k++){const y=cy-120+k*60;bag+=arrow(cx-260,y,cx-190,y,{color:EC,w:4,head:12})+arrow(cx+190,y,cx+260,y,{color:EC,w:4,head:12});}
  s+=fade(seg(p,.35,.6),bag+label('初級：閉じた袋の 面を 小さく分ける',cx,480,{size:24,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'next']:(p)=>{
  let s=sphere(330,270,130,{E:seg(p,.1,.4)});
  s+=card(640,120,500,250,label('閉じた面の上で 𝐄 を足す',890,185,{size:28,color:C.ink,anchor:'middle'})+label('電気束',890,245,{size:34,color:EC,anchor:'middle',weight:700})+label('点電荷を 囲む球 なら？',890,315,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.5),C.hi);
  return s;
 },
};

// 高校編「コンデンサー・深く学ぶ 1/2」(ys-hs-e-capacitor-1) — 図。Stage 1200×515.
// 色：電荷 Q・q 桃、電圧 V 紫、電場 𝐄 水色、容量 C 黄、エネルギー 橙、正電荷 赤、電子 青、面積 A・間隔 d 白。
// 回路：上の板 ─ 右の導線 ─ 電池（上が長い線＝＋極、下が短い太い線＝−極）─ 下の板。
// 電子は 上の板 → 導線 → 電池の＋極 → 電池の中 → −極 → 導線 → 下の板（電池の外では −極 → ＋極 の向きに動く）。上が ＋Q、下が −Q。
// 2/2・要点でも使う部品は export する（カード・タグ・T2・電子は電流の回の部品を読み込む）。
import {C,clamp,mix,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,poly,axes,brace} from './anim.mjs';
import {card,tag,T2,sceneT,fcard,U,electron,POS,NEG,QC,VC,EC,WC,CU} from './yt1-hs-e-current-1-diagrams.mjs';
export {card,tag,T2,sceneT,fcard,U,electron,POS,NEG,QC,VC,EC,WC};

const K='hs-e-capacitor-1:';
export const CC=C.hi;
export const Qt=`{\\color{${QC}}Q}`, qt=`{\\color{${QC}}q}`, Vt=`{\\color{${VC}}V}`, Ct=`{\\color{${CC}}C}`, Et=`{\\color{${EC}}E}`, vEt=`{\\color{${EC}}\\mathbf{E}}`, Ut=`{\\color{${WC}}U}`;
export const EPS='\\varepsilon_0';
export const QCV=`${Qt}=${Ct}${Vt}`, CDEF=`${Ct}=\\dfrac{${Qt}}{${Vt}}`, VED=`${Vt}=${Et}d`, CEPS=`${Ct}=\\dfrac{${EPS}A}{d}`;
const pl=(x,y,op=1,size=26)=>fade(op,label('＋',x,y+9,{size,color:POS,anchor:'middle',weight:700}));
export const emark=(x,y,op=1,r=11)=>electron(x,y,{r,op});
// ---- the circuit -------------------------------------------------------------------------------
export const CAP={L:180,R:540,T:100,TH:40,B:320,WX:660};      // plates: x L..R ; top plate y T..T+TH ; bottom plate y B..B+TH ; wire x WX
const yT=CAP.T+CAP.TH/2, yB=CAP.B+CAP.TH/2;                   // plate centre lines (also wire heights)
export const SL=k=>220+k*56;                                  // 6 charge slots, x
const ePath=k=>[[SL(k),yT],[CAP.WX,yT],[CAP.WX,yB],[SL(k),yB]];
function along(pts,f){let L=0;const d=[];for(let i=1;i<pts.length;i++){const s=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);d.push(s);L+=s;}
 let w=L*clamp(f);for(let i=1;i<pts.length;i++){if(w<=d[i-1]){const u=w/d[i-1];return [mix(pts[i-1][0],pts[i][0],u),mix(pts[i-1][1],pts[i][1],u)];}w-=d[i-1];}return pts[pts.length-1];}
export function plates({g=1,o=CAP,hlT=0,hlB=0}={}){
 let s=rect(o.L,o.T,o.R-o.L,o.TH,{fill:'#8795ad',fo:.3,stroke:C.dim,sw:2.5,rx:4})+rect(o.L,o.B,o.R-o.L,o.TH,{fill:'#8795ad',fo:.3,stroke:C.dim,sw:2.5,rx:4});
 if(hlT)s+=fade(hlT,rect(o.L-6,o.T-6,o.R-o.L+12,o.TH+12,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:8}));
 if(hlB)s+=fade(hlB,rect(o.L-6,o.B-6,o.R-o.L+12,o.TH+12,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:8}));
 return fade(g,s);
}
export function wires({g=1,o=CAP,text='電池',volt=''}={}){
 const x=o.WX,yp=(yT+yB)/2-12,ym=(yT+yB)/2+12;
 let s=line(o.R,yT,x,yT,{color:C.dim,w:4})+line(x,yT,x,yp,{color:C.dim,w:4})+line(x,ym,x,yB,{color:C.dim,w:4})+line(x,yB,o.R,yB,{color:C.dim,w:4});
 s+=line(x-36,yp,x+36,yp,{color:C.ink,w:5})+line(x-19,ym,x+19,ym,{color:C.ink,w:10});
 s+=label('＋',x-50,yp+2,{size:26,color:POS,anchor:'middle',weight:700})+label('−',x-50,ym+20,{size:28,color:NEG,anchor:'middle',weight:700});
 s+=label(text,x+50,yp+8,{size:24,color:C.dim})+(volt?label(volt,x+50,ym+30,{size:26,color:VC,weight:700}):'');
 return fade(g,s);
}
// moved: electrons carried so far (0..6; a fraction = one in transit). order: slot 5 first.
export function charges(moved,{g=1,pairs=1,glow=0}={}){
 let s='';
 for(let j=0;j<6;j++){const k=5-j,f=clamp(moved-j),x=SL(k);
  if(f<=0){s+=pl(x-11,yT,.55*pairs)+emark(x+11,yT,pairs,10);}
  else{s+=pl(x,yT,1);if(glow)s+=fade(glow,ring(x,yT,17,{color:POS,w:2}));
   if(f<1){const [ex,ey]=along(ePath(k),f);s+=emark(ex,ey);}else s+=emark(x,yB);}
 }
 return fade(g,s);
}
export function fieldArrows(g=1,{o=CAP,n=4,len=1,lbl=true}={}){
 if(g<=.001)return '';
 let s='';const y1=o.T+o.TH+12,y2=o.B-12;
 for(let i=0;i<n;i++){const x=o.L+(o.R-o.L)*(i+.5)/n;s+=arrow(x,y1,x,mix(y1,y2,clamp(len)),{color:EC,w:4,head:14});}
 if(lbl)s+=T2(vEt,o.L-50,(y1+y2)/2+14,{size:40});
 return fade(g,s);
}
export const capCircuit=(moved,o={})=>plates(o)+wires(o)+charges(moved,o);
// right-hand panel
const PX=780,PWD=380;
function counter(n,{g=1,y=90,h=280}={}){
 const cx=PX+PWD/2;
 return card(PX,y,PWD,h,label('運んだ 電子',cx,y+50,{size:26,color:C.dim,anchor:'middle'})+label(`${n} 個`,cx,y+105,{size:40,color:NEG,anchor:'middle',weight:700})
  +label('上の 板',PX+95,y+170,{size:26,color:C.dim,anchor:'middle'})+label(`＋${n}`,PX+95,y+230,{size:42,color:POS,anchor:'middle',weight:700})
  +label('下の 板',PX+PWD-95,y+170,{size:26,color:C.dim,anchor:'middle'})+label(`−${n}`,PX+PWD-95,y+230,{size:42,color:NEG,anchor:'middle',weight:700}),g,C.faint);
}
const side=(lines,{g=1,y=130,h=220,col=C.hi}={})=>card(PX,y,PWD,h,lines.map((l,i)=>label(l[0],PX+PWD/2,y+h/2-(lines.length-1)*26+i*52+10,{size:l[2]||30,color:l[1]||C.ink,anchor:'middle',weight:700})).join(''),g,col);
// ---- a plate pair for the comparisons (side view) --------------------------------------------
// centre x, top y0, width w, gap d; 6 charges per plate; 6 field lines (lines ∝ Q); V bar at the right.
export function pair(cx,y0,w,d,{g=1,field=1,vbar=1,vh=150,lab='',n=6,th=26,vtext=''}={}){
 const L=cx-w/2,R=cx+w/2,yb=y0+th+d;
 let s=rect(L,y0,w,th,{fill:'#8795ad',fo:.3,stroke:C.dim,sw:2,rx:3})+rect(L,yb,w,th,{fill:'#8795ad',fo:.3,stroke:C.dim,sw:2,rx:3});
 for(let i=0;i<n;i++){const x=L+w*(i+.5)/n;s+=pl(x,y0+th/2,1,22)+label('−',x,yb+th/2+8,{size:24,color:NEG,anchor:'middle',weight:700});}
 if(field>0)for(let i=0;i<n;i++){const x=L+w*(i+.5)/n;s+=fade(field,arrow(x,y0+th+8,x,yb-8,{color:EC,w:3.5,head:12}));}
 if(vbar>0){const bx=R+46;s+=fade(vbar,rect(bx-14,yb+th-vh,28,vh,{fill:VC,fo:.55,stroke:VC,sw:2,rx:3})+T2(Vt,bx,yb+th-vh-16,{size:34})+(vtext?label(vtext,bx+26,yb+th-vh/2+8,{size:26,color:VC,weight:700}):''));}
 if(lab)s+=label(lab,cx,yb+th+46,{size:28,color:C.ink,anchor:'middle',weight:700});
 return fade(g,s);
}
// ---- table -------------------------------------------------------------------------------------
function qvTable(rows,{g=1,ratio=0,hl=-1,x=170,y=60}={}){
 const cw=[260,260,300],rh=62,W=cw.reduce((a,b)=>a+b);
 let s=card(x,y,W,rh*(rows.length+1)+16,'',g,C.faint);
 const cx=i=>x+cw.slice(0,i).reduce((a,b)=>a+b,0)+cw[i]/2;
 s+=fade(g,label('電圧 V',cx(0),y+46,{size:28,color:VC,anchor:'middle',weight:700})+label('電荷 Q',cx(1),y+46,{size:28,color:QC,anchor:'middle',weight:700}));
 s+=fade(g*ratio,label('Q ÷ V',cx(2),y+46,{size:28,color:CC,anchor:'middle',weight:700}));
 rows.forEach((r,i)=>{const yy=y+rh*(i+1)+46,op=g*(r[3]??1);
  if(i===hl)s+=fade(op,rect(x+8,yy-40,W-16,54,{fill:C.hi,fo:.08,stroke:C.hi,sw:2,rx:10}));
  s+=fade(op,label(r[0],cx(0),yy,{size:30,color:C.ink,anchor:'middle'})+label(r[1],cx(1),yy,{size:30,color:C.ink,anchor:'middle'}));
  s+=fade(op*ratio,label(r[2],cx(2),yy,{size:30,color:CC,anchor:'middle',weight:700}));});
 return s;
}
const ROWS=[['1.0 V','2.0 μC','2.0 μC/V'],['2.0 V','4.0 μC','2.0 μC/V'],['3.0 V','6.0 μC','2.0 μC/V']];
// camera with a flash
function camera(x,y,flash=0){
 let s=rect(x-120,y-70,240,140,{fill:'#2a3550',fo:1,stroke:C.dim,sw:3,rx:14})+ring(x+10,y+5,46,{color:C.dim,w:4,fill:'#131f38'})+ring(x+10,y+5,26,{color:C.faint,w:3})+rect(x-100,y-60,50,24,{fill:'#ffe9a0',fo:.25+.75*flash,stroke:C.dim,sw:2,rx:4});
 if(flash>0)for(let i=0;i<8;i++){const a=-Math.PI+i*Math.PI/7,r0=40,r1=40+70*flash;s+=fade(flash,line(x-75+r0*Math.cos(a),y-48+r0*Math.sin(a),x-75+r1*Math.cos(a),y-48+r1*Math.sin(a),{color:'#ffe9a0',w:4}));}
 return s;
}

export const hsECapacitor1Diagrams={
 // ================= S1 電場からの問い =================
 [K+'q']:(p)=>{
  let s=plates({g:seg(p,0,.15)})+wires({g:seg(p,.1,.25)});
  s+=fieldArrows(seg(p,.25,.4));
  s+=side([['2枚の 板は',C.ink],['電荷を どれだけ',C.ink],['ためられる？',C.hi,34]],{g:seg(p,.55,.7),y:110,h:240});
  return s;
 },
 [K+'recall']:(p)=>{
  let s=plates()+fieldArrows(1);
  s+=fade(seg(p,.15,.3),line(CAP.R+40,CAP.T+CAP.TH,CAP.R+40,CAP.B,{color:C.ink,w:3})+line(CAP.R+28,CAP.T+CAP.TH,CAP.R+52,CAP.T+CAP.TH,{color:C.ink,w:3})+line(CAP.R+28,CAP.B,CAP.R+52,CAP.B,{color:C.ink,w:3})+T2('d',CAP.R+70,(CAP.T+CAP.TH+CAP.B)/2+14,{size:38}));
  s+=fcard(780,150,360,150,VED,{size:54,col:VC,g:seg(p,.45,.6)});
  return s;
 },
 [K+'flash']:(p)=>{
  let s=fade(seg(p,0,.12),plates({o:{...CAP,L:150,R:450}}));
  s+=fade(seg(p,.1,.25),label('コンデンサー',300,420,{size:34,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),camera(880,250,seg(p,.7,.78)*(1-seg(p,.86,.98))));
  s+=fade(seg(p,.55,.7),label('ためて 一瞬で 出す',880,420,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'plan']:(p)=>{
  let s=card(180,100,840,120,label('① 電荷が たまる 仕組み',230,175,{size:36,color:C.hi,weight:700}),seg(p,.05,.2),C.hi);
  s+=card(180,270,840,120,label('② 1 V あたりに ためる 電荷',230,345,{size:36,color:C.hi,weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 // ================= S2 電荷がたまる仕組み =================
 [K+'plates']:(p)=>{
  let s=plates({g:seg(p,0,.15)});
  s+=fade(seg(p,.1,.25),label('金属の 板',CAP.R+30,yT+8,{size:28,color:C.dim})+label('金属の 板',CAP.R+30,yB+8,{size:28,color:C.dim}));
  s+=fade(seg(p,.5,.65),rect(CAP.L,CAP.T+CAP.TH,CAP.R-CAP.L,CAP.B-CAP.T-CAP.TH,{fill:C.hi,fo:.06,stroke:'none',sw:0,rx:0})+label('すき間（電気を 通さない）',(CAP.L+CAP.R)/2,(yT+yB)/2+10,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'connect']:(p)=>{
  let s=plates()+charges(0,{g:seg(p,.0,.1)})+wires({g:seg(p,.1,.3)});
  s+=fade(seg(p,.45,.6),line(CAP.R,yT,CAP.WX,yT,{color:C.hi,w:6})+label('上の 板 → ＋極',800,yT+8,{size:28,color:POS,weight:700}));
  s+=fade(seg(p,.7,.85),line(CAP.R,yB,CAP.WX,yB,{color:C.hi,w:6})+label('下の 板 → −極',800,yB+8,{size:28,color:NEG,weight:700}));
  return s;
 },
 [K+'pull']:(p)=>{
  const m=lin(p,.15,.8);
  let s=capCircuit(m);
  s+=fade(seg(p,.05,.15),label('電子 1個',SL(5),yT-38,{size:26,color:NEG,anchor:'middle',weight:700}));
  s+=fade(seg(p,.25,.4),arrow(CAP.WX+18,yT+30,CAP.WX+18,yB-30,{color:NEG,w:4,head:14})+label('電池を 通して',CAP.WX+34,(yT+yB)/2+60,{size:24,color:NEG}));
  return s;
 },
 [K+'pair']:(p)=>{
  let s=capCircuit(1,{glow:seg(p,.1,.25)});
  s+=fade(seg(p,.05,.2),ring(SL(5),yT,22,{color:C.hi,w:3}));
  s+=fade(seg(p,.5,.65),ring(SL(5),yB,22,{color:C.hi,w:3}));
  s+=counter(1,{g:seg(p,.2,.35)});
  return s;
 },
 [K+'many']:(p)=>{
  const m=1+5*lin(p,.05,.85);
  return capCircuit(m)+counter(Math.floor(m+1e-6));
 },
 [K+'gap']:(p)=>{
  let s=capCircuit(6);
  const x=SL(2),ya=CAP.T+CAP.TH+16,yb2=CAP.B-16;
  s+=fade(seg(p,.05,.2),draw([[x,ya],[x,yb2]],1,{color:NEG,w:3,dash:'8 7'})+label('✕',x+44,(ya+yb2)/2+14,{size:44,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),draw([[CAP.R-10,yT-26],[CAP.WX+26,yT-26],[CAP.WX+26,yB+26],[CAP.R-10,yB+26]],seg(p,.5,.8),{color:C.hi,w:4,dash:'10 7'}));
  s+=side([['飛び越えない',C.a],['導線と 電池を',C.ink],['回って 運ぶ',C.hi]],{g:seg(p,.3,.45),y:120,h:240});
  return s;
 },
 [K+'Q']:(p)=>{
  let s=capCircuit(6);
  s+=fade(seg(p,.05,.2),brace(CAP.L,CAP.R,CAP.T-12,{dir:-1,color:POS}));
  s+=card(780,90,380,120,T2(`+${Qt}`,970,165,{size:56}),seg(p,.4,.55),POS);
  s+=card(780,250,380,120,T2(`-${Qt}`,970,325,{size:56}),seg(p,.65,.8),NEG);
  s+=fade(seg(p,.05,.2),label('片方の 大きさ',(CAP.L+CAP.R)/2,CAP.T-48,{size:26,color:QC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'Qsum']:(p)=>{
  let s=capCircuit(6);
  s+=card(780,100,380,260,T2(`(+${Qt})+(-${Qt})=0`,970,175,{size:40})
   +fade(seg(p,.4,.55),label('合計 ではない',970,265,{size:32,color:C.a,anchor:'middle',weight:700})+label('Q ＝ 片方の 大きさ',970,320,{size:28,color:QC,anchor:'middle',weight:700})),seg(p,.05,.2),QC);
  return s;
 },
 [K+'field']:(p)=>{
  let s=capCircuit(6);
  for(let k=0;k<3;k++){const x=SL(k*2+1);s+=fade(seg(p,.05,.2)*(1-seg(p,.45,.55)),draw([[x,yT+26],[x,yB-26]],1,{color:C.hi,w:2,dash:'4 6'}));}
  s+=fade(seg(p,.05,.2)*(1-seg(p,.45,.55)),label('引き合う',(CAP.L+CAP.R)/2,(yT+yB)/2+10,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=fieldArrows(seg(p,.5,.65));
  s+=side([['＋の 板 → −の 板',C.ink,28],['電場',EC,34]],{g:seg(p,.6,.75),y:140,h:180,col:EC});
  return s;
 },
 [K+'grow']:(p)=>{
  const m=6*lin(p,.05,.7);
  let s=capCircuit(m);
  s+=fieldArrows(clamp(m/2),{len:1});
  const vh=180*m/6,bx=CAP.L-110;
  s+=rect(bx-14,yB-vh,28,vh,{fill:VC,fo:.55,stroke:VC,sw:2,rx:3})+label('電圧',bx,yB+52,{size:24,color:VC,anchor:'middle',weight:700});
  s+=counter(Math.floor(m+1e-6),{g:1});
  return s;
 },
 [K+'stop']:(p)=>{
  let s=capCircuit(6)+fieldArrows(1);
  const bx=CAP.L-110;s+=rect(bx-14,yB-180,28,180,{fill:VC,fo:.55,stroke:VC,sw:2,rx:3})+label('電圧',bx,yB+52,{size:24,color:VC,anchor:'middle',weight:700});
  s+=card(780,90,380,280,label('板の間の 電圧',970,150,{size:28,color:VC,anchor:'middle',weight:700})+label('＝',970,200,{size:32,color:C.ink,anchor:'middle'})+label('電池の 電圧',970,250,{size:28,color:VC,anchor:'middle',weight:700})
   +fade(seg(p,.5,.65),label('→ 移動が 止まる',970,325,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.1,.25),VC);
  return s;
 },
 // ================= S3 電気容量 =================
 [K+'exp']:(p)=>{
  let s=capCircuit(6)+wires({volt:'V ？'});
  s+=side([['電圧を 変えると',C.ink],['電荷は どう 変わる？',C.hi,32]],{g:seg(p,.15,.3),y:140,h:200});
  return s;
 },
 [K+'table']:(p)=>{
  const r=ROWS.map((x,i)=>[...x,seg(p,.08+i*.18,.18+i*.18)]);
  let s=qvTable(r);
  s+=fade(seg(p,.75,.88),T2(`1${U('\\mu C')}=10^{-6}${U('C')}`,1010,470,{size:36,auto:false,color:C.hi}));
  return s;
 },
 [K+'prop']:(p)=>{
  let s=qvTable(ROWS);
  s+=fade(seg(p,.1,.25),label('×2',90,248,{size:28,color:C.hi,anchor:'middle',weight:700})+label('×3',90,310,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.25),label('×2',1030,248,{size:28,color:C.hi,anchor:'middle',weight:700})+label('×3',1030,310,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=tag('実験の 事実：比例',600,470,{color:C.hi,g:seg(p,.55,.7),size:28});
  return s;
 },
 [K+'ratio']:(p)=>{
  let s=qvTable(ROWS,{ratio:seg(p,.1,.4)});
  s+=fade(seg(p,.55,.7),label('どの 行も 同じ ＝ この 板で 決まる',600,470,{size:30,color:CC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'def']:(p)=>{
  let s=fcard(360,60,480,200,CDEF,{size:64,col:CC,g:seg(p,.3,.45)});
  s+=fade(seg(p,.05,.2),label('電気容量',600,40,{size:28,color:CC,anchor:'middle',weight:700}));
  s+=tag('定義',600,330,{color:C.hi,g:seg(p,.65,.8),size:30});
  return s;
 },
 [K+'qcv']:(p)=>{
  let s=fcard(120,60,440,190,CDEF,{size:58,col:CC});
  s+=fade(seg(p,.05,.2),label('1 V あたりに ためる 電荷',340,300,{size:28,color:CC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),arrow(590,155,660,155,{color:C.hi,w:5,head:16})+label('両辺 × V',625,120,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=fcard(690,60,400,190,QCV,{size:62,col:QC,g:seg(p,.55,.7)});
  return s;
 },
 [K+'unit']:(p)=>{
  let s=fcard(200,40,800,150,`1${U('F')}=1${U('C/V')}`,{size:60,col:CC,g:seg(p,.05,.2)});
  s+=fade(seg(p,.2,.35),label('ファラド',600,235,{size:30,color:CC,anchor:'middle',weight:700}));
  s+=card(250,290,700,150,T2(`${Ct}=\\dfrac{6.0${U('\\mu C')}}{3.0${U('V')}}=2.0${U('\\mu F')}`,600,380,{size:46}),seg(p,.55,.7),CC);
  return s;
 },
 [K+'twoC']:(p)=>{
  let s=card(150,80,900,190,T2(`${Ct}=\\dfrac{6.0${U('\\mu C')}}{3.0${U('V')}}`,600,195,{size:58}),1,C.faint);
  s+=fade(seg(p,.2,.35),ring(462,180,36,{color:CC,w:3})+label('容量（斜め）',380,330,{size:30,color:CC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),ring(738,138,28,{color:QC,w:3})+label('クーロン（まっすぐ）',800,330,{size:30,color:QC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'check']:(p)=>{
  let s=fcard(400,30,400,150,QCV,{size:54,col:QC});
  s+=card(200,230,800,170,label('2.0 μF に 6.0 V',600,295,{size:36,color:C.ink,anchor:'middle',weight:700})+label('電荷は 何 μC？',600,365,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'check2']:(p)=>{
  let s=fcard(400,30,400,150,QCV,{size:54,col:QC});
  s+=card(120,220,960,170,T2(`${Qt}=2.0${U('\\mu F')}\\times6.0${U('V')}`,450,315,{size:48})+fade(seg(p,.2,.35),T2(`=12${U('\\mu C')}`,860,312,{size:50,color:QC,auto:false})),1,QC);
  s+=fade(seg(p,.65,.8),label('3.0 V の ときの 2倍',600,450,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S4 板の形と容量 =================
 [K+'shape']:(p)=>{
  let s=pair(380,110,240,180,{vbar:0,field:0,g:seg(p,0,.15)});
  s+=side([['容量 C は',CC],['何で 決まる？',C.hi,34]],{g:seg(p,.3,.45),y:140,h:190,col:CC});
  return s;
 },
 [K+'rule']:(p)=>{
  let s=card(150,50,900,120,label('固定：電荷 Q',300,125,{size:34,color:QC,weight:700})+label('比べる：電圧 V',650,125,{size:34,color:VC,weight:700}),seg(p,.05,.2),C.faint);
  s+=fcard(210,220,360,190,CDEF,{size:56,col:CC,g:seg(p,.45,.6)});
  s+=card(630,250,400,130,label('V が 小さい',830,305,{size:32,color:VC,anchor:'middle',weight:700})+label('→ C が 大きい',830,355,{size:32,color:CC,anchor:'middle',weight:700}),seg(p,.7,.85),CC);
  return s;
 },
 [K+'area1']:(p)=>{
  let s=pair(270,110,240,180,{vbar:0,field:0,lab:'元の 板'});
  s+=pair(800,110,480,180,{vbar:0,field:0,lab:'面積 A を 2倍',g:seg(p,.1,.3)});
  s+=fade(seg(p,.5,.65),label('同じ Q が 薄く 広がる',800,470,{size:30,color:QC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'area2']:(p)=>{
  let s=pair(270,110,240,180,{vbar:seg(p,.45,.6),vh:150,lab:'元の 板'});
  s+=pair(800,110,480,180,{vbar:seg(p,.45,.6),vh:75,lab:'面積 A を 2倍'});
  s+=fade(seg(p,.05,.2),label('電場が 弱い',800,95,{size:28,color:EC,anchor:'middle',weight:700})+label('電場',270,95,{size:28,color:EC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('V ＝ Ed も 小さい',800,470,{size:30,color:VC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'area3']:(p)=>{
  let s=pair(270,110,240,180,{vh:150,lab:'元の 板'});
  s+=pair(800,110,480,180,{vh:75,lab:'面積 A を 2倍'});
  s+=card(560,410,480,80,label('同じ Q で V が 小さい → C が 大きい',800,460,{size:26,color:CC,anchor:'middle',weight:700}),seg(p,.1,.25),CC);
  return s;
 },
 [K+'gap1']:(p)=>{
  let s=pair(270,110,240,180,{vbar:0,lab:'元の 板'});
  s+=pair(800,200,240,90,{vbar:0,lab:'間隔 d を 半分',g:seg(p,.1,.3)});
  s+=fade(seg(p,.55,.7),label('電荷の 混み具合 同じ → 電場も 同じ',600,470,{size:30,color:EC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'gap2']:(p)=>{
  let s=pair(270,110,240,180,{vbar:seg(p,.05,.2),vh:150,lab:'元の 板'});
  s+=pair(800,200,240,90,{vbar:seg(p,.05,.2),vh:75,lab:'間隔 d を 半分'});
  s+=fade(seg(p,.3,.45),label('d が 半分 → V も 半分',800,95,{size:30,color:VC,anchor:'middle',weight:700}));
  s+=card(560,410,480,80,label('同じ Q で V が 小さい → C が 大きい',800,460,{size:26,color:CC,anchor:'middle',weight:700}),seg(p,.6,.75),CC);
  return s;
 },
 [K+'sum']:(p)=>{
  let s=pair(200,150,240,150,{vbar:0,field:0});
  s+=fade(seg(p,.1,.25),label('広い',640,125,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=pair(640,150,440,150,{vbar:0,field:0,g:seg(p,.1,.25)});
  s+=pair(1000,195,240,60,{vbar:0,field:0,g:seg(p,.35,.5),n:6});
  s+=fade(seg(p,.35,.5),label('せまい',1000,170,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=card(300,400,600,90,label('容量 C が 大きく なる',600,458,{size:34,color:CC,anchor:'middle',weight:700}),seg(p,.6,.75),CC);
  return s;
 },
 // ================= S5 C＝ε₀A/d =================
 [K+'formula']:(p)=>{
  let s=pair(270,130,300,170,{vbar:0,field:0,g:seg(p,0,.15)});
  s+=fade(seg(p,.1,.25),brace(120,420,118,{dir:-1,color:C.ink})+label('面積 A',270,70,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.25),line(450,156,450,300,{color:C.ink,w:3})+label('間隔 d',470,236,{size:28,color:C.ink,weight:700}));
  s+=fcard(640,110,460,210,CEPS,{size:64,col:CC,g:seg(p,.45,.6)});
  s+=fade(seg(p,.5,.65),label('真空の 平行な 板',870,370,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'match']:(p)=>{
  let s=fcard(370,40,460,210,CEPS,{size:64,col:CC});
  s+=fade(seg(p,.05,.2),ring(705,102,34,{color:C.hi,w:3}));
  s+=card(120,300,460,150,label('A が 分子',350,360,{size:30,color:C.ink,anchor:'middle',weight:700})+label('広い ほど 大きい',350,415,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.35,.5),ring(665,192,30,{color:C.hi,w:3}));
  s+=card(620,300,460,150,label('d が 分母',850,360,{size:30,color:C.ink,anchor:'middle',weight:700})+label('せまい ほど 大きい',850,415,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.35,.5),C.hi);
  return s;
 },
 [K+'eps']:(p)=>{
  let s=fcard(370,30,460,180,CEPS,{size:56,col:CC});
  s+=card(160,250,880,170,T2(`${EPS}\\approx8.85\\times10^{-12}${U('C^2/(N\\cdot m^2)')}`,600,345,{size:46,auto:false}),seg(p,.05,.2),C.faint);
  s+=tag('クーロンの 法則の 回で 決めた 定数',600,470,{color:C.hi,g:seg(p,.4,.55),size:24});
  return s;
 },
 [K+'honest']:(p)=>{
  let s=fcard(80,60,440,200,CEPS,{size:56,col:CC});
  s+=fade(seg(p,.25,.4),arrow(680,160,560,160,{color:C.hi,w:5,head:16})+label('ここから 出る',620,125,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=fcard(700,60,420,200,`${Et}=\\dfrac{${Qt}}{${EPS}A}`,{size:56,col:EC,g:seg(p,.1,.25)});
  s+=fade(seg(p,.1,.25),label('板の 間の 電場',910,310,{size:28,color:EC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'honest2']:(p)=>{
  let s=fcard(80,60,440,200,CEPS,{size:56,col:CC});
  s+=fcard(700,60,420,200,`${Et}=\\dfrac{${Qt}}{${EPS}A}`,{size:56,col:EC});
  s+=tag('ここでは 結果だけ 示す',910,330,{color:C.hi,g:seg(p,.3,.45),size:28});
  s+=tag('導き方は 大学編',910,420,{color:C.dim,g:seg(p,.65,.8),size:28});
  s+=fade(seg(p,.1,.25),label('電気力線の 考え方から',910,40,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'num']:(p)=>{
  let s=pair(300,150,300,120,{vbar:0,field:0,n:6,g:seg(p,0,.15)});
  s+=fade(seg(p,.05,.2),brace(150,450,138,{dir:-1,color:C.ink})+label('10 cm 四方',300,90,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.05,.2),line(480,176,480,270,{color:C.ink,w:3})+label('1.0 mm',500,232,{size:28,color:C.ink,weight:700}));
  s+=card(660,90,480,130,T2(`A=0.010${U('m^2')}`,900,170,{size:44}),seg(p,.4,.55),C.faint);
  s+=card(660,260,480,130,T2(`d=1.0\\times10^{-3}${U('m')}`,900,340,{size:44}),seg(p,.65,.8),C.faint);
  return s;
 },
 [K+'num2']:(p)=>{
  let s=card(60,40,1080,170,T2(`${Ct}=\\dfrac{8.85\\times10^{-12}\\times0.010}{1.0\\times10^{-3}}`,600,140,{size:46}),seg(p,.02,.15),CC);
  s+=card(200,250,800,130,T2(`=8.85\\times10^{-11}${U('F')}`,600,330,{size:50,auto:false,color:CC}),seg(p,.4,.55),CC);
  s+=fade(seg(p,.7,.85),label('約 89 pF（ピコファラド）',600,450,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'pico']:(p)=>{
  let s=card(200,50,800,130,T2(`1${U('pF')}=10^{-12}${U('F')}`,600,130,{size:50,auto:false}),seg(p,.02,.15),C.faint);
  s+=card(200,240,800,150,label('1 F は とても 大きい',600,330,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'big']:(p)=>{
  // a square 11 km on a side vs. the 10 cm plate (not to scale: the plate is a dot)
  const g=seg(p,.15,.5),sz=mix(6,300,g);
  let s=rect(260-sz/2,250-sz/2,sz,sz,{fill:'#8795ad',fo:.25,stroke:C.dim,sw:2.5,rx:2});
  s+=fade(seg(p,.45,.6),label('一辺 約 11 km',260,450,{size:32,color:C.hi,anchor:'middle',weight:700}));
  s+=card(560,90,560,260,label('間隔 1.0 mm のまま',840,160,{size:30,color:C.ink,anchor:'middle'})+label('1 F に するには',840,215,{size:30,color:CC,anchor:'middle',weight:700})
   +fade(seg(p,.4,.55),T2(`A\\approx1.1\\times10^{8}${U('m^2')}`,840,295,{size:42})),seg(p,.02,.15),CC);
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p)=>{
  let s=capCircuit(6)+fieldArrows(1);
  s+=fcard(780,120,380,170,QCV,{size:60,col:QC,g:seg(p,.3,.45)});
  s+=fade(seg(p,.3,.45),label('1 V あたり C',970,340,{size:30,color:CC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ans2']:(p)=>{
  let s=fcard(370,40,460,200,CEPS,{size:60,col:CC});
  s+=card(250,300,700,120,label('広く、近い ほど 大きい',600,375,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'next']:(p)=>{
  let s=capCircuit(6)+fieldArrows(1)+wires({});
  s+=fade(seg(p,.05,.2),label('電池が 仕事',CAP.WX,yB+60,{size:28,color:WC,anchor:'middle',weight:700}));
  s+=card(780,140,380,200,label('エネルギーは',970,205,{size:30,color:WC,anchor:'middle',weight:700})+T2(`${Qt}${Vt}\\ ?`,970,290,{size:56}),seg(p,.4,.55),WC);
  return s;
 },
 [K+'bye']:(p)=>{
  let s=fade(.35,capCircuit(6)+fieldArrows(1));
  s+=card(300,170,600,140,label('深く学ぶ 2/2 へ',600,255,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
};

// 問題編 解説「押される玉と、彗星の速さ」（q-uc-angular、大学編 15 角運動量・上級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/15_角運動量.md の q-uc-angular（解説 21 行）。
// 画面：左に真上から見た図（糸の玉の円／太陽と楕円の軌道）、右に説明の枠。誤答カードは枠の下に1枚ずつ。右下に色の凡例。
//   行2〜4（積の微分）は式だけの画面（図を消す）。
// 色（単元動画と同じ）：𝐫 水色、𝐅 緑、トルク 𝐍・𝐩 桃、𝐋・v⊥ 黄、𝐯 紫、時間 金、加速度 赤、太陽 金、誤り 赤。強調は塗りのない太い枠線。
// 図のために決めた長さ：円 1 m＝90 px、速さ 1 m/s＝30 px、押す力 1 N＝100 px、糸の力 60 px（値なし）、𝐋 の棒 1 kg·m²/s＝40 px。
//   楕円 1.0×10¹¹ m＝90 px（a＝2.5、b＝2.0、焦点距離 1.5）。速さの矢印 1 km/s＝2 px。彗星の動きはケプラーの方程式（周期 7 s）。
import {C,clamp,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,poly,esc} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,legend,kindTag,pauseBadge,note,textW,cueT,tAt,sentWin} from './yt1-qx-common.mjs';

const K='qx-uc-angular:';
const CR=C.x,CF=C.F,CN=C.p,CL=C.hi,CV=C.v,CT=C.t,CA=C.a,CD='#ff6b6b',CSUN='#ffcf67';
const PX=680,PW=500,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const T=(s,x,y,size=34,o={})=>tex(s,x,y,{size,auto:false,...o});
const cs=(c,s)=>`{\\color{${c}}${s}}`;
const bv=(c,n)=>cs(c,`\\mathbf{${n}}`);
const L_=bv(CL,'L'),R_=bv(CR,'r'),P_=bv(CN,'p'),V_=bv(CV,'v'),F_=bv(CF,'F'),N_=bv(CN,'N');
const G1='0.5 s 後の L',G2='最も遠い点での速さ v',G3='r と v の積が等しい理由';
const ANS1=g=>answerTag(1,'C','3.6 kg·m²/s',{g}),ANS2=g=>answerTag(2,'A','11.5 km/s',{g}),ANS3=g=>answerTag(3,'B','',{g});
const LEG=(g=1)=>legend([['トルク N',CN],['𝐋・v⊥',CL]],PX+14,500,{g,dir:'row'});

function row(parts,cx,y,size=30,anchor='middle'){
 const sp=parts.map(([t,c,w,o])=>`<tspan fill="${c??C.ink}" font-weight="${w??700}"${o!=null&&o<1?` fill-opacity="${Math.max(0,o).toFixed(3)}"`:''}>${esc(t)}</tspan>`).join('');
 return `<text x="${cx}" y="${y}" font-size="${size}" text-anchor="${anchor}" xml:space="preserve">${sp}</text>`;
}
// TeX を部品ごとに左から並べる（各部品の [左端,右端] を返す）
function seqT(parts,cx,y,size){const ws=parts.map(s=>texWidth(s,size,false)),W=ws.reduce((a,b)=>a+b,0);let x=cx-W/2,svg='';const box=[];
 parts.forEach((s,i)=>{svg+=T(s,x,y,size,{anchor:'start'});box.push([x,x+ws[i]]);x+=ws[i];});return {svg,box,W};}
function rightMark(x,y,ux,uy,vx,vy,q=14,color=C.dim,w=2.5){return line(x+ux*q,y+uy*q,x+ux*q+vx*q,y+uy*q+vy*q,{color,w})+line(x+vx*q,y+vy*q,x+ux*q+vx*q,y+uy*q+vy*q,{color,w});}
function outSym(x,y,r=20,color=CN,g=1){return fade(g,ring(x,y,r,{color,w:4,fill:'#1a1030'})+dot(x,y,r*.28,color));}
const strike=(x1,y1,x2,y2,g=1)=>fade(g,line(x1,y1,x2,y2,{color:CA,w:4}));
// 「× 誤答 X」だけのカード（値なし。見た目は共通部品の wrongCard と同じ）
function wrongCardNV(letter,why,{g=1,x=PX,y=262,w=PW,size=26,whySize=22}={}){
 const rows=[].concat(why),h=size+30+rows.length*(whySize+12)+10,head=`誤答 ${letter}`;
 let s=rect(x,y,w,h,{fill:'#1f1622',fo:.96,stroke:'#8a4a55',sw:2.5,rx:12});
 const hx=x+w/2-(textW(head,size)+size*1.1)/2;
 s+=label('×',hx,y+size+12,{size:size*1.1,color:CD,weight:700})+label(head,hx+size*1.1,y+size+12,{size,color:'#c9d2e0',weight:700});
 rows.forEach((r,i)=>{s+=label(r,x+w/2,y+size+24+(i+1)*(whySize+12)-4,{size:whySize,color:C.dim,anchor:'middle'});});
 return fade(g,s);
}
function underline(why,part,{x=PX,w=PW,y,whySize=22,size=26,g=1}={}){
 const full=textW(why,whySize),i=why.indexOf(part),x0=x+w/2-full/2+textW(why.slice(0,i),whySize),yy=y+size+24+(whySize+12)-4+8;
 return fade(g,line(x0,yy,x0+textW(part,whySize)-4,yy,{color:CD,w:3.5}));
}

// ===================== 小問1：糸の玉 =====================
const C1={cx:250,cy:290,R:180,Lx:575,Ly:470},C1P={cx:470,cy:290,R:180,Lx:880,Ly:470};
const ballXY=(o,ph)=>[o.cx+o.R*Math.cos(ph),o.cy-o.R*Math.sin(ph)];
function circle1(o,{g=1}={}){
 return fade(g,ring(o.cx,o.cy,o.R,{color:C.dim,w:2,dash:'8 8'})+ring(o.cx,o.cy,8,{color:C.ink,w:3,fill:C.bg})+label('O（固定）',o.cx,o.cy+40,{size:24,color:C.ink,anchor:'middle',weight:700}));
}
function ball1(o,ph,{g=1}={}){const [x,y]=ballXY(o,ph);return fade(g,line(o.cx,o.cy,x,y,{color:C.faint,w:2})+ring(x,y,15,{color:C.ink,w:3,fill:'#2c3854'}));}
// 押し始めの図：𝐫・𝐯・押す力・糸の力（玉は右端 φ＝0）
function vecs1(o,{g=1,gr=1,gv=1,gp=1,gs=1,vLen=3,vLab='3 m/s',rLab='2 m',pLab='0.6 N',sLab=1,rightG=0,sGlow=0,pGlow=0}={}){
 const [x,y]=ballXY(o,0);
 let s=fade(gr,arrow(o.cx+8,o.cy,x-15,y,{color:CR,w:5,head:16})+T(R_,(o.cx+x)/2-20,o.cy-18,32)+(rLab?label(rLab,(o.cx+x)/2+20,o.cy-12,{size:24,color:CR,weight:700}):''));
 s+=fade(gs,(sGlow>0?fade(sGlow*.6,line(x-15,y,x-75,y,{color:CF,w:16,opacity:.4})):'')+arrow(x-15,y+10,x-75,y+10,{color:CF,w:5,head:14})+(sLab?label('糸の力',x-60,y+44,{size:22,color:CF,anchor:'middle',weight:700}):''));
 s+=fade(gv,arrow(x,y-15,x,y-15-vLen*30,{color:CV,w:6,head:16})+T(V_,x-22,y-15-vLen*30+10,30)+(vLab?label(vLab,x-34,y-15-vLen*15,{size:24,color:CV,anchor:'end',weight:700}):''));
 s+=fade(gp,(pGlow>0?fade(pGlow*.6,line(x+26,y,x+26,y-60,{color:CF,w:16,opacity:.4})):'')+arrow(x+26,y,x+26,y-60,{color:CF,w:5,head:14})+label('押す力',x+40,y-34,{size:22,color:CF,weight:700})+(pLab?label(pLab,x+40,y-8,{size:22,color:CF,weight:700}):''));
 if(rightG>0)s+=fade(rightG,rightMark(x,y,-1,0,0,-1,16,C.ink));
 return fade(g,s);
}
// 𝐋 の棒（黄）。値 L（kg·m²/s）、1＝40 px
function Lbar(o,L,{g=1,val='',plus=0}={}){
 const h=L*40,w=40;
 let s=rect(o.Lx-w/2,o.Ly-h,w,h,{fill:CL,fo:.5,stroke:CL,sw:2,rx:4})+T(L_,o.Lx,o.Ly-h-22,30);
 if(plus>0)s+=fade(plus,rect(o.Lx-w/2,o.Ly-h,w,.6*40,{fill:'none',fo:0,stroke:C.ink,sw:2.5,rx:3})+label('＋0.6',o.Lx+28,o.Ly-h+18,{size:24,color:CL,weight:700}));
 if(val)s+=label(val,o.Lx,o.Ly+28,{size:24,color:CL,anchor:'middle',weight:700});
 return fade(g,s);
}

// ===================== 小問2・3：太陽と楕円 =====================
const EA=2.5,EB=2.0,EC=1.5,EE=.6;
const E2={cx:298,cy:280,s:90},E2P={cx:560,cy:290,s:90};
const sunXY=o=>[o.cx+EC*o.s,o.cy];
const ePt=(o,E)=>[o.cx+EA*o.s*Math.cos(E),o.cy-EB*o.s*Math.sin(E)];
function keplerE(M){let E=M;for(let i=0;i<30;i++)E-=(E-EE*Math.sin(E)-M)/(1-EE*Math.cos(E));return E;}
const PERIOD=7;
function ellipse2(o,{g=1,labels=1,noteG=1}={}){
 const pts=Array.from({length:121},(_,i)=>ePt(o,2*Math.PI*i/120));
 const [sx,sy]=sunXY(o),[px,py]=ePt(o,0),[ax,ay]=ePt(o,Math.PI);
 let s=draw(pts,1,{color:C.dim,w:2.5});
 s+=`<circle cx="${sx}" cy="${sy}" r="17" fill="${CSUN}"/>`+label('太陽',sx,sy-28,{size:24,color:CSUN,anchor:'middle',weight:700});
 if(labels){
  s+=line(sx+18,sy,px-6,py,{color:C.ink,w:2})+label('1.0×10¹¹ m',px+8,sy+30,{size:22,color:C.ink,weight:700});
  s+=line(sx-18,sy,ax+6,ay,{color:C.ink,w:2,dash:'6 6'})+label('4.0×10¹¹ m',(sx+ax)/2,sy+32,{size:22,color:C.ink,anchor:'middle',weight:700});
  s+=label('最も近い点',px+14,py+64,{size:22,color:C.dim})+label('最も遠い点',ax+16,ay-30,{size:22,color:C.dim});
 }
 if(noteG)s+=note('楕円は 大きく誇張',o.cx,o.cy+212,{g:noteG});
 return fade(g,s);
}
const comet=(x,y,g=1)=>fade(g,ring(x,y,11,{color:C.ink,w:3,fill:'#3a4766'}));
const peri46=(o,g=1)=>{const [px,py]=ePt(o,0);return fade(g,label('46 km/s',px+16,py-14,{size:24,color:CV,weight:700}));};
function orbitAt(o,t){const M=2*Math.PI*((t/PERIOD)%1);return keplerE(M);}
// 等しい時間に掃く扇形（M0 から dM 分）
function sweep(o,M0,dM,{g=1,color=CL}={}){
 const [sx,sy]=sunXY(o),n=20,pts=[[sx,sy]];
 for(let i=0;i<=n;i++)pts.push(ePt(o,keplerE(M0+dM*i/n)));
 return fade(g,poly(pts,{fill:color,fo:.35,stroke:color,sw:2}));
}

export const ytQxUcAngularDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（約5秒）：0〜3 s で玉が円を反時計回りに 3 m/s で回る → 円の右端で映像を一時停止 → 𝐫・𝐯 3 m/s・押す力 0.6 N・糸の力・𝐋 の棒（値なし）
 [K+'q1']:(p,ctx)=>{
  const t=cueT(ctx),ph=t<3?-1.5*(3-t):0,stop=t>=3?1:0,ga=clamp((t-3.1)/.6);
  let s=circle1(C1P,{g:seg(p,0,.08)})+ball1(C1P,ph,{g:seg(p,0,.08)});
  s+=pauseBadge({g:stop*clamp((t-3)/.3)});
  s+=vecs1(C1P,{g:ga,gv:seg(ga,0,.4),gr:seg(ga,0,.4),gp:seg(ga,.3,.7),gs:seg(ga,.3,.7)})+Lbar(C1P,3,{g:seg(ga,.6,1)});
  return s;
 },
 // 小問2・3（約4秒）：小問1の図を消す → 太陽と楕円（大きく誇張）、近い点に 1.0×10¹¹ m と 46 km/s、遠い点に 4.0×10¹¹ m。彗星は近い点に置いた静止画。
 [K+'q2']:(p)=>{
  const out=1-seg(p,0,.15);
  let s=fade(out,circle1(C1P)+ball1(C1P,0)+vecs1(C1P)+Lbar(C1P,3)+pauseBadge());
  s+=ellipse2(E2P,{g:seg(p,.2,.45),labels:0,noteG:seg(p,.3,.5)});
  const [px,py]=ePt(E2P,0);
  s+=fade(seg(p,.45,.7),ellipse2(E2P,{labels:1,noteG:0}))+comet(px,py,seg(p,.5,.65))+peri46(E2P,seg(p,.65,.85));
  return s;
 },

 // ===================== 小問1 =====================
 [K+'goal1']:(p)=>{
  let s=circle1(C1)+ball1(C1,0)+vecs1(C1)+Lbar(C1,3)+LEG();
  s+=panel(92,230,label('小問1',PC,138,{size:26,color:C.dim,anchor:'middle'})+label('玉 0.5 kg、半径 2 m、3 m/s',PC,188,{size:26,color:C.ink,anchor:'middle',weight:700})
   +label('接線方向に 0.6 N で 押し続ける',PC,236,{size:26,color:CF,anchor:'middle',weight:700})+label('基準点 O（慣性系に 固定）',PC,284,{size:24,color:C.dim,anchor:'middle'}),seg(p,.05,.2));
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 2. 𝐋＝𝐫×𝐩 → 時間で微分 → 積の微分で2項（式だけの画面）
 [K+'diff']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=card(80,90,1040,400,'',1);
  s+=fade(seg(p,.03,.12),T(`${L_}=${R_}\\times${P_}`,600,150,44));
  s+=fade(seg(p,.15,.25),arrow(600,185,600,225,{color:C.dim,w:3,head:12})+label('時間で 微分',620,215,{size:26,color:C.dim}));
  const q=seqT([`\\dfrac{d${L_}}{dt}=`,`\\dfrac{d${R_}}{dt}`,`{}\\times${P_}+${R_}\\times{}`,`\\dfrac{d${P_}}{dt}`],600,300,44);
  s+=fade(seg(p,b,b+.12),q.svg);
  const bx=(i,c)=>rect(q.box[i][0]-8,250,q.box[i][1]-q.box[i][0]+16,100,{fill:'none',fo:0,stroke:c,sw:3,rx:10});
  s+=fade(seg(p,b+.15,b+.25),bx(1,CR)+label('𝐫 を 微分',(q.box[1][0]+q.box[1][1])/2,385,{size:24,color:CR,anchor:'middle',weight:700}));
  s+=fade(seg(p,b+.28,b+.38),bx(3,CN)+label('𝐩 を 微分',(q.box[3][0]+q.box[3][1])/2,385,{size:24,color:CN,anchor:'middle',weight:700}));
  s+=fade(seg(p,b+.45,b+.55),label('× の 左右の 順番は そのまま（𝐫 が 左）',600,450,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=goalTag(G1);
  return s;
 },
 // 3. d𝐫/dt → 𝐯、𝐩 → m𝐯、d𝐩/dt → 𝐅（運動方程式・法則）
 [K+'subst']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=card(80,90,1040,400,'',1);
  const q=seqT([`\\dfrac{d${L_}}{dt}=`,`\\dfrac{d${R_}}{dt}`,`{}\\times${P_}+${R_}\\times{}`,`\\dfrac{d${P_}}{dt}`],600,165,40);
  s+=q.svg;
  const c1=(q.box[1][0]+q.box[1][1])/2,c3=(q.box[3][0]+q.box[3][1])/2,cp=q.box[2][0]+texWidth(`{}\\times${P_}`,40,false)*.6;
  s+=fade(seg(p,.05,.15),arrow(c1,215,c1,262,{color:CV,w:3,head:12})+label('速度 𝐯',c1-14,250,{size:24,color:CV,anchor:'end',weight:700}));
  s+=fade(seg(p,.1,.2),arrow(cp,215,cp,262,{color:CN,w:3,head:12})+label('m𝐯',cp+12,250,{size:24,color:CN,weight:700}));
  s+=fade(seg(p,.25,.35),arrow(c3,215,c3,262,{color:CF,w:3,head:12})+kindTag('法則',c3+150,200)+label('運動方程式 d𝐩/dt ＝ 𝐅',c3+150,250,{size:24,color:CF,anchor:'middle',weight:700}));
  s+=fade(seg(p,b,b+.12),T(`\\dfrac{d${L_}}{dt}=${V_}\\times m${V_}+${R_}\\times${F_}`,600,340,44));
  s+=goalTag(G1);
  return s;
 },
 // 4. 𝐯 と m𝐯 の平行四辺形がつぶれて 0 → 第1項に打ち消し線 → d𝐋/dt＝𝐍（黄の枠）
 [K+'collapse']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,cl=seg(p,.08,.4);
  let s=card(80,90,1040,400,'',1);
  // 平行四辺形（左）：𝐯 と m𝐯 の間の角が 0 へ
  const ox=200,oy=300,ang=.9*(1-cl),L1=110,L2=150;
  const v1=[L1,0],v2=[L2*Math.cos(ang),-L2*Math.sin(ang)];
  s+=poly([[ox,oy],[ox+v1[0],oy+v1[1]],[ox+v1[0]+v2[0],oy+v1[1]+v2[1]],[ox+v2[0],oy+v2[1]]],{fill:CN,fo:.25*(1-cl)+.02,stroke:CN,sw:2});
  s+=arrow(ox,oy,ox+v1[0],oy+v1[1],{color:CV,w:6,head:16})+arrow(ox,oy,ox+v2[0],oy+v2[1],{color:CN,w:4,head:14})+T(V_,ox+v1[0]-10,oy+30,30)+label('m𝐯',ox+v2[0]+10,oy+v2[1]-8,{size:24,color:CN,weight:700});
  s+=fade(seg(p,.35,.45),label('同じ 向き → 面積 0',230,400,{size:26,color:C.hi,anchor:'middle',weight:700}));
  const q=seqT([`\\dfrac{d${L_}}{dt}=`,`${V_}\\times m${V_}`,`{}+${R_}\\times${F_}`],760,190,40);
  s+=q.svg+strike(q.box[1][0],215,q.box[1][1],165,seg(p,.42,.5))+fade(seg(p,.45,.52),label('0',(q.box[1][0]+q.box[1][1])/2,250,{size:30,color:CA,anchor:'middle',weight:700}));
  s+=fade(seg(p,b+.05,b+.15),label('残るのは 𝐫×𝐅 ＝ 𝐍',760,285,{size:28,color:CN,anchor:'middle',weight:700}));
  s+=fade(seg(p,b+.2,b+.3),rect(640,310,240,120,{fill:'none',fo:0,stroke:C.hi,sw:4,rx:12})+T(`\\dfrac{d${L_}}{dt}=${N_}`,760,372,40));
  s+=goalTag(G1);
  return s;
 },
 // 5. 𝐫 と 𝐯 に直角の印。L＝mrv＝0.5×2×3＝3.0（棒に「3.0」）
 [K+'L0']:(p)=>{
  const n=[seg(p,.3,.38),seg(p,.38,.46),seg(p,.46,.54)],r3=seg(p,.6,.7);
  let s=circle1(C1)+ball1(C1,0)+vecs1(C1,{rightG:seg(p,.05,.15),gp:.35,gs:.35})+Lbar(C1,3,{val:r3>.5?'3.0':''})+LEG();
  s+=panel(92,200,T(`L=mrv`,PC,145,34)+row([['＝ ',C.ink],['0.5',C.ink,700,n[0]],[' × ',C.ink,700,n[1]],['2',CR,700,n[1]],[' × ',C.ink,700,n[2]],['3',CV,700,n[2]]],PC,205,32)
   +fade(r3,row([['＝ ',C.ink],['3.0',CL],[' kg·m²/s',C.ink]],PC,262,32)),1);
  s+=goalTag(G1);
  return s;
 },
 // 6a. 糸の力は 𝐫 と同じ直線上 → トルク 0
 [K+'torque']:(p)=>{
  let s=circle1(C1)+ball1(C1,0)+vecs1(C1,{gp:.35,sGlow:seg(p,.15,.3)})+Lbar(C1,3,{val:'3.0'})+LEG();
  const [x,y]=ballXY(C1,0);
  s+=fade(seg(p,.3,.45),label('トルク 0',x-60,y+78,{size:26,color:CN,anchor:'middle',weight:700}));
  s+=panel(92,160,row([['糸の力 ∥ ',CF],['𝐫',CR]],PC,150,30)+fade(seg(p,.3,.45),row([['→ トルク 0',CN]],PC,205,30)),1);
  s+=goalTag(G1);
  return s;
 },
 // 6b. 押す力は 𝐫 に直角：N＝2×0.6＝1.2 N·m（⊙）
 [K+'torque2']:(p)=>{
  let s=circle1(C1)+ball1(C1,0)+vecs1(C1,{gs:.35,pGlow:seg(p,.05,.2)})+Lbar(C1,3,{val:'3.0'})+LEG();
  s+=outSym(C1.cx-110,C1.cy-60,20,CN,seg(p,.3,.4))+fade(seg(p,.3,.4),label('1.2 N·m',C1.cx-110,C1.cy-22,{size:26,color:CN,anchor:'middle',weight:700}));
  s+=panel(92,160,row([['押す力 ⟂ ',CF],['𝐫',CR]],PC,150,30)+fade(seg(p,.15,.3),row([['N ＝ ',CN],['2',CR],[' × ',C.ink],['0.6',CF],[' ＝ ',C.ink],['1.2 N·m',CN]],PC,205,30)),1);
  s+=goalTag(G1);
  return s;
 },
 // 7a. N が一定 → L は1秒に 1.2 ずつ増える
 [K+'grow']:(p)=>{
  let s=circle1(C1)+ball1(C1,0)+vecs1(C1,{gs:.35})+Lbar(C1,3,{val:'3.0'})+LEG()+outSym(C1.cx-110,C1.cy-60,20,CN)+label('1.2 N·m',C1.cx-110,C1.cy-22,{size:26,color:CN,anchor:'middle',weight:700});
  s+=panel(92,160,T(`\\dfrac{dL}{dt}=N=1.2`,PC,150,34)+fade(seg(p,.2,.35),label('1 秒に 1.2 ずつ 増える',PC,215,{size:28,color:CL,anchor:'middle',weight:700})),1);
  s+=goalTag(G1);
  return s;
 },
 // 7b. 時間の目盛り（金）0 → 0.5 s、棒が 3.0 → 3.6 へ一定の速さで伸びる。「＋0.6」
 [K+'grow2']:(p)=>{
  const u=seg(p,.1,.7),L=3+.6*u;
  let s=circle1(C1)+ball1(C1,0)+vecs1(C1,{gs:.35})+Lbar(C1,L,{val:u>.98?'3.6':'',plus:seg(p,.72,.8)})+LEG()+outSym(C1.cx-110,C1.cy-60,20,CN)+label('1.2 N·m',C1.cx-110,C1.cy-22,{size:26,color:CN,anchor:'middle',weight:700});
  // 時間の目盛り
  const x0=PX+60,x1=PX+PW-60,yt=290;
  let tt=line(x0,yt,x1,yt,{color:CT,w:3})+line(x0,yt-10,x0,yt+10,{color:CT,w:3})+line(x1,yt-10,x1,yt+10,{color:CT,w:3})
   +label('0',x0,yt+34,{size:24,color:CT,anchor:'middle',weight:700})+label('0.5 s',x1,yt+34,{size:24,color:CT,anchor:'middle',weight:700})+dot(x0+(x1-x0)*u,yt,9,CT);
  s+=panel(92,270,row([['ΔL ＝ 1.2 × 0.5 ＝ ',C.ink],['0.6',CL]],PC,150,30)+fade(seg(p,.72,.82),row([['L ＝ 3.0 ＋ 0.6 ＝ ',C.ink],['3.6',CL]],PC,210,30))+tt,1);
  s+=goalTag(G1);
  return s;
 },
 // 8. 確かめ：a＝F/m＝1.2、v＝3＋1.2×0.5＝3.6。𝐯 の矢印が伸びて札を「3.6 m/s（0.5 s 後）」に
 [K+'check']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[0][1]*.55,gv=seg(p,b+.15,b+.35);
  let s=circle1(C1)+ball1(C1,0)+vecs1(C1,{gs:.35,vLen:3+.6*gv,vLab:gv>.5?'3.6 m/s（0.5 s 後）':'3 m/s'})+Lbar(C1,3.6,{val:'3.6'})+LEG();
  s+=panel(92,300,label('角運動量で',PC,128,{size:22,color:C.dim,anchor:'middle'})+row([['L：3.0 → ',C.ink],['3.6',CL]],PC,170,30)
   +line(PX+40,196,PX+PW-40,196,{color:C.faint,w:2})+label('確かめ（速さで）',PC,226,{size:22,color:C.dim,anchor:'middle'})
   +fade(seg(p,.05,.2),row([['a ＝ F/m ＝ 0.6 ÷ 0.5 ＝ ',C.ink],['1.2',CA]],PC,272,28))
   +fade(seg(p,b,b+.15),row([['v ＝ 3 ＋ 1.2 × 0.5 ＝ ',C.ink],['3.6',CV]],PC,326,28)),1);
  s+=goalTag(G1);
  return s;
 },
 // 9. L＝0.5×2×3.6＝3.6。上下の 3.6 を黄で結ぶ。答えの札 C
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55;
  let s=circle1(C1)+ball1(C1,0)+vecs1(C1,{gs:.35,vLen:3.6,vLab:'3.6 m/s（0.5 s 後）'})+Lbar(C1,3.6,{val:'3.6'})+LEG();
  s+=panel(92,320,label('角運動量で',PC,128,{size:22,color:C.dim,anchor:'middle'})+row([['L：3.0 → ',C.ink],['3.6',CL]],PC,170,30)
   +line(PX+40,196,PX+PW-40,196,{color:C.faint,w:2})+label('確かめ（速さで）',PC,226,{size:22,color:C.dim,anchor:'middle'})
   +row([['v ＝ ',C.ink],['3.6',CV],[' m/s',C.ink]],PC,268,28)
   +fade(seg(p,.05,.25),row([['L ＝ 0.5 × 2 × 3.6 ＝ ',C.ink],['3.6',CL]],PC,320,30))
   +fade(seg(p,.25,.35),line(PC+120,178,PC+120,300,{color:CL,w:3,dash:'6 5'})+label('一致',PC+170,250,{size:26,color:CL,weight:700})),1);
  s+=goalTag(G1)+ANS1(seg(p,b,b+.06));
  return s;
 },
 // 10. 誤答 A（押す力のトルクを見落とした）。押す力のトルクを光らせる
 [K+'wrongA1']:(p,ctx)=>{
  const blink=.5+.5*Math.sin(cueT(ctx)*6),W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=circle1(C1)+ball1(C1,0)+vecs1(C1,{vLen:3.6,vLab:'',sGlow:seg(p,b,b+.05)*(1-seg(p,b+.3,b+.35)),pGlow:seg(p,b+.3,b+.35)*blink})+Lbar(C1,3.6,{val:'3.6'})+LEG();
  s+=outSym(C1.cx-110,C1.cy-60,20+4*seg(p,b+.3,b+.35)*blink,CN)+label('1.2 N·m',C1.cx-110,C1.cy-22,{size:26,color:CN,anchor:'middle',weight:700});
  s+=panel(92,150,label('小問1',PC,132,{size:24,color:C.dim,anchor:'middle'})+row([['L ＝ ',C.ink],['3.6 kg·m²/s',CL]],PC,195,32),1);
  s+=wrongCard('A','3.0','押す力のトルク 1.2 N·m を見落とした',{...WOPT,y:262,g:seg(p,.02,.06)});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },
 // 11. 誤答 B → D（1枚ずつ）。単位に赤の下線
 [K+'wrongBD1']:(p,ctx)=>{
  const W=sentWin(ctx),e1=W[0][1],m=e1*.5,b=W[1]?W[1][0]:e1;
  const gB=seg(p,.01,.05)*(1-seg(p,m-.04,m)),gD=seg(p,m+.01,m+.05),gu=seg(p,b,b+.05);
  let s=circle1(C1)+ball1(C1,0)+vecs1(C1,{vLen:3.6,vLab:''})+Lbar(C1,3.6,{val:'3.6'})+LEG();
  s+=panel(92,150,label('小問1',PC,132,{size:24,color:C.dim,anchor:'middle'})+row([['L ＝ ',C.ink],['3.6 kg·m²/s',CL]],PC,195,32),1);
  const wB='0.6×0.5＝0.3（単位 N·s）を足した',wD='1.2 N·m をそのまま足した';
  s+=wrongCard('B','3.3',wB,{...WOPT,y:262,g:gB})+underline(wB,'N·s',{y:262,g:gB});
  s+=wrongCard('D','4.2',wD,{...WOPT,y:262,g:gD})+underline(wD,'N·m',{y:262,g:gD*gu});
  s+=fade(gD*gu,label('L の 単位は kg·m²/s',PC,410,{size:26,color:CL,anchor:'middle',weight:700}));
  s+=goalTag(G1)+ANS1(1);
  return s;
 },

 // ===================== 小問2 =====================
 [K+'goal2']:(p)=>{
  const [px,py]=ePt(E2,0);
  let s=ellipse2(E2)+comet(px,py)+peri46(E2)+LEG();
  s+=panel(92,200,label('小問2',PC,138,{size:26,color:C.dim,anchor:'middle'})+label('太陽の 引力だけを 受ける 彗星',PC,188,{size:26,color:C.ink,anchor:'middle',weight:700})
   +label('太陽は 動かない 点とみなす',PC,236,{size:24,color:C.dim,anchor:'middle'}),seg(p,.05,.2));
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 13. 3〜4点で 𝐫（水色）と引力 𝐅（緑）が同じ直線上で逆向き。sin180°＝0、𝐍＝0
 [K+'central']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,[sx,sy]=sunXY(E2);
  let s=ellipse2(E2,{labels:0})+LEG();
  [.9,2.2,3.6,5.0].forEach((E,i)=>{const g=seg(p,.05+.08*i,.12+.08*i),[x,y]=ePt(E2,E),d=Math.hypot(sx-x,sy-y),ux=(sx-x)/d,uy=(sy-y)/d;
   s+=fade(g,line(sx,sy,x,y,{color:CR,w:3})+arrow(x,y,x+ux*55,y+uy*55,{color:CF,w:5,head:14})+comet(x,y));});
  s+=panel(92,220,row([['𝐅 は 太陽を 向く',CF]],PC,145,28)+row([['→ 𝐫 と 一直線（逆向き）',C.ink]],PC,192,26)
   +fade(seg(p,b,b+.1),line(PX+40,215,PX+PW-40,215,{color:C.faint,w:2})+row([['sin180° ＝ 0',C.ink]],PC,256,28)+row([['𝐍 ＝ 0',CN]],PC,296,30)),1);
  s+=goalTag(G2);
  return s;
 },
 // 14. 彗星が楕円に沿って動く（ケプラー：近い所で速く、遠い所で遅く）。𝐋 の棒は同じ長さ。「mr v⊥ 一定」
 [K+'const']:(p,ctx)=>{
  const t=tAt(ctx,K+'const'),E=orbitAt(E2,t),[x,y]=ePt(E2,E),[sx,sy]=sunXY(E2);
  let s=ellipse2(E2,{labels:0})+line(sx,sy,x,y,{color:CR,w:3})+comet(x,y)+LEG();
  const lx=PC,ly=330;
  s+=panel(92,300,row([['𝐍 ＝ 0 → 𝐋 一定',C.ink]],PC,142,28)+rect(lx-24,ly-120,48,120,{fill:CL,fo:.5,stroke:CL,sw:2,rx:4})+T(L_,lx,ly-142,30)
   +label('mr v⊥ 一定',lx,ly+40,{size:28,color:CL,anchor:'middle',weight:700}),1);
  s+=goalTag(G2);
  return s;
 },
 // 15. 最も近い点・遠い点で 𝐫 と 𝐯 に直角の印。v⊥＝v
 [K+'perp']:(p)=>{
  const [sx,sy]=sunXY(E2),[px,py]=ePt(E2,0),[ax,ay]=ePt(E2,Math.PI);
  let s=ellipse2(E2,{labels:0})+LEG();
  s+=line(sx,sy,px,py,{color:CR,w:3})+arrow(px,py,px,py-92,{color:CV,w:5,head:14})+comet(px,py)+fade(seg(p,.1,.25),rightMark(px,py,-1,0,0,-1,16,C.ink));
  s+=line(sx,sy,ax,ay,{color:CR,w:3})+arrow(ax,ay,ax,ay+40,{color:CV,w:5,head:14})+comet(ax,ay)+fade(seg(p,.2,.35),rightMark(ax,ay,1,0,0,1,16,C.ink));
  s+=peri46(E2);
  s+=panel(92,200,label('最も近い点・最も遠い点',PC,145,{size:26,color:C.dim,anchor:'middle'})+row([['𝐯 ⟂ 𝐫',C.ink]],PC,195,30)
   +fade(seg(p,.4,.55),row([['v⊥ ＝ v',CL]],PC,250,32)),1);
  s+=goalTag(G2);
  return s;
 },
 // 16. 1.0×46＝4.0×v（m は両辺で消える）→ v＝46÷4＝11.5。答えの札 A
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.7,[sx,sy]=sunXY(E2),[px,py]=ePt(E2,0),[ax,ay]=ePt(E2,Math.PI);
  let s=ellipse2(E2)+line(sx,sy,ax,ay,{color:CR,w:3})+arrow(ax,ay,ax,ay+40,{color:CV,w:5,head:14})+comet(ax,ay)+arrow(px,py,px,py-92,{color:CV,w:5,head:14})+comet(px,py)+peri46(E2)+LEG();
  s+=fade(seg(p,.6,.7),label('11.5 km/s',ax+14,ay+70,{size:24,color:CV,weight:700}));
  s+=panel(92,240,label('r と v の 積が 等しい',PC,128,{size:24,color:C.dim,anchor:'middle'})+fade(seg(p,.05,.2),T('1.0\\times46=4.0\\times '+cs(CV,'v'),PC,180,36))
   +fade(seg(p,.2,.3),label('（両辺の m は 消える）',PC,226,{size:22,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.35,.5),T(`${cs(CV,'v')}=46\\div4=${cs(CV,'11.5\\ \\mathrm{km/s}')}`,PC,282,36)),1);
  s+=goalTag(G2)+ANS2(seg(p,b,b+.06));
  return s;
 },
 // 17. 誤答 B → C → D（1枚ずつ）
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),e1=W[0][1],m=e1*.5;
  const gB=seg(p,.01,.05)*(1-seg(p,m-.04,m)),gC=seg(p,m+.01,m+.05)*(1-seg(p,e1-.04,e1)),gD=seg(p,e1+.01,e1+.05);
  let s=ellipse2(E2,{labels:0})+LEG();
  s+=panel(92,150,label('小問2',PC,132,{size:24,color:C.dim,anchor:'middle'})+T(`${cs(CV,'v')}=46\\div4=${cs(CV,'11.5\\ \\mathrm{km/s}')}`,PC,195,34),1);
  s+=wrongCard('B','23 km/s','46÷√4',{...WOPT,y:262,g:gB});
  s+=wrongCard('C','184 km/s','46×4（遠いほど速いとした）',{...WOPT,y:262,g:gC});
  s+=wrongCard('D','約 2.9 km/s','46÷16',{...WOPT,y:262,g:gD});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },

 // ===================== 小問3 =====================
 [K+'goal3']:(p)=>{
  let s=ellipse2(E2)+LEG();
  s+=panel(92,170,label('小問3',PC,138,{size:26,color:C.dim,anchor:'middle'})+row([['r₁v₁ ＝ r₂v₂',C.ink]],PC,192,30)+label('が 使えた 理由は？',PC,236,{size:26,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2));
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 19. 「中心を向く」→ 同じ時間に掃く三角形（近い点：短く幅広、遠い点：長く細い）を同じ色で。面積速度 L/(2m) 一定。答えの札 B
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.7;
  let s=ellipse2(E2,{labels:0})+LEG();
  s+=sweep(E2,-.28,.56,{g:seg(p,.2,.35)})+sweep(E2,Math.PI-.28,.56,{g:seg(p,.3,.45)});
  s+=panel(92,240,rect(PC-140,112,280,52,{fill:'none',fo:0,stroke:C.hi,sw:3.5,rx:10})+label('中心（太陽）を 向く',PC,147,{size:26,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.1,.2),row([['→ トルク 0 → ',C.ink],['mr v⊥ 一定',CL]],PC,205,26))
   +fade(seg(p,.4,.5),row([['面積速度 ',C.ink],['L/(2m)',CL],[' 一定',C.ink]],PC,265,28))
   +fade(seg(p,.45,.55),label('同じ 時間に 同じ 面積',PC,305,{size:22,color:C.dim,anchor:'middle'})),1);
  s+=goalTag(G3)+ANS3(seg(p,b,b+.06));
  return s;
 },
 // 20. 誤答 A → C → D（1枚ずつ。値のないカード）
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),e1=W[0][1],b=W[1]?W[1][0]:e1,m=b+(1-b)*.5;
  const gA=seg(p,.01,.05)*(1-seg(p,e1-.04,e1)),gC=seg(p,b+.01,b+.05)*(1-seg(p,m-.04,m)),gD=seg(p,m+.01,m+.05);
  let s=ellipse2(E2,{labels:0})+sweep(E2,-.28,.56,{g:.6})+sweep(E2,Math.PI-.28,.56,{g:.6})+LEG();
  s+=panel(92,150,label('小問3',PC,132,{size:24,color:C.dim,anchor:'middle'})+row([['中心を 向く → ',C.ink],['𝐋 一定',CL]],PC,195,30),1);
  s+=wrongCardNV('A',['中心を向くことだけを使った','（2乗は不要）'],{g:gA});
  s+=wrongCardNV('C','引力で 𝐩 は変わる（保存は 𝐋）',{g:gC});
  s+=wrongCardNV('D','速さは近い点ほど大きい',{g:gD});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },

 // ===================== まとめ =====================
 [K+'sum']:(p)=>{
  const g1=seg(p,.03,.15),g2=seg(p,.15,.27),g3=seg(p,.32,.42);
  const oc={cx:170,cy:250,R:80,Lx:330,Ly:330};
  let c1=ring(oc.cx,oc.cy,oc.R,{color:C.dim,w:2,dash:'6 6'})+dot(oc.cx,oc.cy,6,C.ink)+arrow(oc.cx,oc.cy,oc.cx+oc.R-10,oc.cy,{color:CR,w:4,head:12})+ring(oc.cx+oc.R,oc.cy,10,{color:C.ink,w:3,fill:'#2c3854'})
   +arrow(oc.cx+oc.R+16,oc.cy,oc.cx+oc.R+16,oc.cy-50,{color:CF,w:4,head:12});
  c1+=rect(oc.Lx-16,oc.Ly-3*30,32,3*30,{fill:CL,fo:.25,stroke:CL,sw:2,rx:3})+rect(oc.Lx-16,oc.Ly-3.6*30,32,.6*30,{fill:CL,fo:.6,stroke:CL,sw:2,rx:3})+label('3.0 → 3.6',oc.Lx+24,oc.Ly-60,{size:22,color:CL,weight:700});
  c1+=T(`\\dfrac{d${L_}}{dt}=${N_}`,290,135,34);
  let s=card(40,90,520,290,c1,g1);
  const oe={cx:800,cy:255,s:40};
  const pts=Array.from({length:81},(_,i)=>ePt(oe,2*Math.PI*i/80)),[sx,sy]=sunXY(oe);
  let c2=draw(pts,1,{color:C.dim,w:2})+`<circle cx="${sx}" cy="${sy}" r="10" fill="${CSUN}"/>`+T('1.0\\times46=4.0\\times '+cs(CV,'v'),860,135,30)+label('v ＝ 11.5 km/s',1000,330,{size:24,color:CV,anchor:'middle',weight:700});
  s+=card(600,90,560,290,c2,g2);
  s+=fade(g3,arrow(300,385,520,425,{color:C.dim,w:3,head:12})+arrow(880,385,680,425,{color:C.dim,w:3,head:12})
   +rect(330,420,540,62,{fill:'none',fo:0,stroke:CN,sw:3,rx:12})+label('O・太陽の まわりの トルクで 決まる',600,461,{size:28,color:CN,anchor:'middle',weight:700}));
  s+=answerRow([[1,'C','3.6 kg·m²/s'],[2,'A','11.5 km/s'],[3,'B','']],{g:seg(p,.6,.7),size:22});
  return s;
 },
};

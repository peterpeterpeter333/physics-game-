// YouTube シリーズ「ガウスの法則・上級 2/6」(ys-ue-gauss-2) — 図。Stage 1200×515.
// 色：1/6 と共通（𝐄 水色、𝐧 桃、Φ・強調 黄、θ 橙）＋ 置換の変数 u 黄緑（CU）。
// 数値：R＝2、d＝1 → u＝5＋4cosθ（θ＝0：9、π/2：5、π：1）。θ＝0 の分子 3＝(9＋3)/4。係数 πkQ/(2d)。
// 3/6 からも使う補助関数は export する（登録されるのは下の図オブジェクトだけ）。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight} from './anim.mjs';
import {G1,cs,card,T,L,TF,xsec,ptAt,thArc,ok,bad,strike,PHI,DEN,INTG,RN,vr,vn,seg2} from './yt1-ue-gauss-1-diagrams.mjs';

const K='ue-gauss-2:';
export const CU='#c6f07a';
export const uu=cs(CU,'u'),du=cs(CU,'du');
export const RD2='R^2-d^2';
export const UPP='(R+d)^2',LOW='(R-d)^2';
export const COEF='\\frac{\\pi kQ}{2d}',COEF1='\\frac{\\pi kQ}{d}';
export const SQ=`\\sqrt{${uu}}`;
export const GU=`${SQ}-\\frac{${RD2}}{${SQ}}`;
export const POW=`\\int_{${LOW}}^{${UPP}}\\Big[${uu}^{-1/2}+(${RD2})\\,${uu}^{-3/2}\\Big]\\,${du}`;
export const PHIG=`${PHI}=${COEF1}\\Big[G(${uu})\\Big]_{${LOW}}^{${UPP}}`;
const INTS=`\\int_0^{\\pi}\\frac{(R+d\\cos\\theta)\\,${cs(G1.ang,'\\sin\\theta\\,d\\theta')}}{${DEN}^{3/2}}`;
const XC=300,YC=262,RP=165;
// distance line O→P labelled u = r²
export function uLine(cx,cy,Rp,dr,t,{g=1,text=true}={}){
 const [x,y]=ptAt(cx,cy,Rp,t),ox=cx,oy=cy+dr*Rp;
 return fade(g,line(ox,oy,x,y,{color:CU,w:4})+dot(x,y,7,C.hi)+(text?label('距離 r',(ox+x)/2+14,(oy+y)/2+6,{size:24,color:CU,weight:700}):''));
}
// θ ↔ u correspondence (two number lines)
function mapLines(x0,y0,w,{g=1,num=false,p=1}={}){
 let s=line(x0,y0,x0+w,y0,{color:G1.ang,w:3})+line(x0,y0+150,x0+w,y0+150,{color:CU,w:3});
 s+=label('θ',x0-30,y0+8,{size:28,color:G1.ang,weight:700,anchor:'end'})+label('u',x0-30,y0+158,{size:28,color:CU,weight:700,anchor:'end'});
 s+=label('0',x0,y0-16,{size:26,color:G1.ang,anchor:'middle'})+label('π',x0+w,y0-16,{size:26,color:G1.ang,anchor:'middle'});
 s+=label(num?'9':'(R+d)²',x0,y0+192,{size:26,color:CU,anchor:'middle'})+label(num?'1':'(R−d)²',x0+w,y0+192,{size:26,color:CU,anchor:'middle'});
 s+=fade(seg(p,.2,.4),line(x0,y0,x0,y0+150,{color:C.dim,w:2,dash:'6 6'})+line(x0+w,y0,x0+w,y0+150,{color:C.dim,w:2,dash:'6 6'}));
 s+=fade(seg(p,.45,.6),arrow(x0+30,y0+115,x0+w-30,y0+115,{color:CU,w:3,head:12})+label('大 → 小',x0+w/2,y0+100,{size:24,color:CU,anchor:'middle'}));
 return fade(g,s);
}

export const ytUeGauss2Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  let s=L('前回の 最後の 問い',600,50,{size:24,color:C.dim});
  s+=TF(`${PHI}=2\\pi kQR^2${INTG}`,600,170,{size:50,frac:true});
  s+=TF(`${DEN}^{3/2}`,600,330,{size:42,box:true,g:seg(p,.2,.35)});
  s+=fade(seg(p,.4,.55),L('この 3/2 乗の 積分は どう 計算する？',600,450,{size:30,color:G1.hi,weight:700}));
  return s;
 },
 [K+'recap']:(p)=>{
  let s=xsec(XC,YC,RP,{dr:.5,ths:[0,Math.PI/4,Math.PI/2,3*Math.PI/4,Math.PI,-Math.PI/4,-Math.PI/2,-3*Math.PI/4]});
  s+=card(560,90,610,330,L('前回：ずれた 球を 面を 取り替えずに',865,150,{size:26,color:C.dim})+TF(`${PHI}=2\\pi kQR^2${INTG}`,865,280,{size:40,frac:true,maxW:570}),1);
  return s;
 },
 [K+'recap2']:(p)=>{
  let s=TF(`${PHI}=2\\pi kQR^2${INTG}`,600,110,{size:46,frac:true});
  s+=fade(seg(p,.05,.2),card(120,250,440,180,L('分子',340,300,{size:26,color:C.dim})+TF(`R+d\\cos\\theta=${RN}`,340,375,{size:38})));
  s+=fade(seg(p,.25,.4),card(640,250,440,180,L('分母',860,300,{size:26,color:C.dim})+TF(`${DEN}^{3/2}=r^3`,860,375,{size:34,maxW:400})));
  s+=fade(seg(p,.6,.75),L('θ を 変えると、どちらも 変わる',600,480,{size:28,color:G1.ang,weight:700}));
  return s;
 },
 [K+'idea']:(p)=>{
  let s=TF(`${PHI}=2\\pi kQR^2${INTG}`,600,110,{size:46,frac:true});
  s+=TF(`${uu}=R^2+d^2+2Rd\\cos\\theta`,600,310,{size:50,box:true,col:CU,g:seg(p,.15,.3)});
  s+=fade(seg(p,.35,.5),L('＝ 距離の 2乗 r²',600,400,{size:28,color:CU,weight:700}));
  s+=fade(seg(p,.6,.75),L('積分の 変数を θ から u へ',600,470,{size:30,color:G1.hi,weight:700}));
  return s;
 },
 [K+'same']:(p)=>{
  const t=Math.PI*.3;
  let s=xsec(XC,YC,RP,{dr:.5})+thArc(XC,YC,50,t)+line(XC,YC,...ptAt(XC,YC,RP,t),{color:G1.geo,w:2,dash:'6 6'})+uLine(XC,YC,RP,.5,t,{g:seg(p,.2,.35)});
  s+=card(600,90,560,330,L('面は 取り替えない',880,160,{size:30,weight:700})
   +fade(seg(p,.3,.45),L('同じ 点 P を',880,250,{size:28})+L('θ の 代わりに u で 数える',880,310,{size:28,color:CU,weight:700}))
   +fade(seg(p,.55,.7),L('（球も 電荷も そのまま）',880,380,{size:24,color:C.dim})),1);
  return s;
 },
 // ===== S2 u と du を決める =====
 [K+'udef']:(p)=>{
  const t=Math.PI*.3;
  let s=xsec(XC,YC,RP,{dr:.5})+uLine(XC,YC,RP,.5,t);
  s+=card(600,90,560,330,TF(`${uu}=R^2+d^2+2Rd\\cos\\theta`,880,175,{size:38,box:true,col:CU})
   +fade(seg(p,.4,.55),TF(`=r^2`,880,280,{size:44})+L('電荷から 点までの 距離の 2乗',880,360,{size:26,color:CU,weight:700})),1);
  return s;
 },
 [K+'notpath']:(p)=>{
  let s=card(60,70,520,380,L('線積分の u',320,125,{size:28,color:C.dim,weight:700}),1);
  const pts=[];for(let i=0;i<=40;i++){const u=i/40;pts.push([140+340*u,350-180*u*u]);}
  s+=draw(pts,1,{color:C.hi,w:4});
  for(const u of [0,.25,.5,.75,1]){const x=140+340*u,y=350-180*u*u;s+=dot(x,y,6,C.ink)+label(String(u),x+8,y+30,{size:22,color:C.dim});}
  s+=L('道の 目盛り（0〜1、単位なし）',320,430,{size:24,color:C.dim});
  s+=fade(seg(p,.25,.4),card(620,70,520,380,L('今回の u',880,125,{size:28,color:CU,weight:700})+TF(`${uu}=r^2`,880,240,{size:52})+L('距離の 2乗（単位 m²）',880,340,{size:28,color:CU,weight:700}),1,CU));
  s+=fade(seg(p,.45,.6),L('別の もの',600,490,{size:28,color:G1.bad,weight:700}));
  return s;
 },
 [K+'num']:(p)=>{
  let s=xsec(260,YC,150,{dr:.5,lab:true});
  const pts=[[0,'9'],[Math.PI/2,'5'],[Math.PI,'1']];
  pts.forEach(([t,v],i)=>{const [x,y]=ptAt(260,YC,150,t);s+=fade(seg(p,.25+.15*i,.35+.15*i),line(260,YC+75,x,y,{color:CU,w:3})+dot(x,y,6,C.hi)+label(`u＝${v}`,x+(t===0?-14:16),y+(t===Math.PI?28:t===0?-10:-12),{size:24,color:CU,weight:700,anchor:t===0?'end':'start'}));});
  s+=card(520,70,640,380,TF('R=2,\\ d=1',840,120,{size:34})+TF(`${uu}=5+4\\cos\\theta`,840,195,{size:40,box:true,col:CU})
   +label('θ',600,290,{size:28,color:G1.ang,weight:700})+label('u',600,370,{size:28,color:CU,weight:700})
   +[['0','9'],['π/2','5'],['π','1']].map(([a,b],i)=>fade(seg(p,.25+.15*i,.35+.15*i),label(a,720+i*150,290,{size:28,color:G1.ang,anchor:'middle'})+label(b,720+i*150,370,{size:30,color:CU,anchor:'middle',weight:700}))).join(''),1);
  return s;
 },
 [K+'chain']:(p)=>{
  let s=TF(`${uu}(\\theta)=R^2+d^2+2Rd\\cos\\theta`,600,110,{size:46});
  s+=fade(seg(p,.2,.35),L('θ を 少し 変えると、u は どれだけ 変わる？',600,250,{size:30,color:G1.hi,weight:700}));
  s+=TF(`\\frac{d${uu}}{d\\theta}=\\;?`,600,380,{size:48,g:seg(p,.45,.6),frac:true});
  return s;
 },
 [K+'du']:(p)=>{
  let s=TF('(\\cos\\theta)\'=-\\sin\\theta',600,80,{size:40});
  s+=TF(`\\frac{d${uu}}{d\\theta}=2Rd\\times(-\\sin\\theta)=-2Rd\\sin\\theta`,600,210,{size:42,frac:true,g:seg(p,.1,.25)});
  s+=TF(`${du}=-2Rd\\sin\\theta\\,d\\theta`,600,380,{size:50,box:true,col:CU,g:seg(p,.55,.7)});
  return s;
 },
 [K+'sind']:(p)=>{
  let s=TF(`${du}=-2Rd\\sin\\theta\\,d\\theta`,600,70,{size:38,opacity:.85});
  s+=TF(`${cs(G1.ang,'\\sin\\theta\\,d\\theta')}=-\\frac{${du}}{2Rd}`,600,200,{size:50,frac:true,box:true,g:seg(p,.05,.2)});
  s+=fade(seg(p,.45,.6),TF(`${INTS}\\,`,600,380,{size:40,frac:true})+L('積分の 中に ちょうど ある',600,490,{size:26,color:G1.ang,weight:700}));
  return s;
 },
 [K+'why']:(p)=>{
  let s=TF(`${INTS}`,600,120,{size:48,frac:true});
  s+=fade(seg(p,.2,.35),arrow(600,225,600,275,{color:G1.ang,w:3,head:14}));
  s+=TF(`-\\frac{${du}}{2Rd}`,600,365,{size:48,frac:true,g:seg(p,.3,.45),box:true,col:CU});
  s+=fade(seg(p,.6,.75),L('θ の 積分 → u の 積分',600,470,{size:30,color:G1.hi,weight:700}));
  return s;
 },
 // ===== S3 分子と上下限を取り替える =====
 [K+'cos']:(p)=>{
  let s=TF(`${uu}=R^2+d^2+2Rd\\cos\\theta`,600,80,{size:40});
  s+=TF(`2Rd\\cos\\theta=${uu}-R^2-d^2`,600,190,{size:40,g:seg(p,.15,.3)});
  s+=TF(`\\cos\\theta=\\frac{${uu}-R^2-d^2}{2Rd}`,600,340,{size:50,frac:true,box:true,g:seg(p,.45,.6)});
  return s;
 },
 [K+'num1']:(p)=>{
  let s=TF(`\\cos\\theta=\\frac{${uu}-R^2-d^2}{2Rd}`,600,70,{size:36,frac:true,opacity:.85});
  s+=TF(`R+d\\cos\\theta=R+\\cancel{d}\\,\\frac{${uu}-R^2-d^2}{2R\\cancel{d}}`,600,220,{size:46,frac:true,g:seg(p,.1,.25)});
  s+=TF(`=R+\\frac{${uu}-R^2-d^2}{2R}`,600,380,{size:46,frac:true,box:true,g:seg(p,.45,.6)});
  return s;
 },
 [K+'num2']:(p)=>{
  let s=TF(`R+d\\cos\\theta=R+\\frac{${uu}-R^2-d^2}{2R}`,600,80,{size:40,frac:true});
  s+=TF(`=\\frac{2R^2}{2R}+\\frac{${uu}-R^2-d^2}{2R}=\\frac{2R^2+${uu}-R^2-d^2}{2R}`,600,220,{size:40,frac:true,g:seg(p,.1,.25)});
  s+=TF(`R+d\\cos\\theta=\\frac{${uu}+R^2-d^2}{2R}`,600,380,{size:48,frac:true,box:true,g:seg(p,.45,.6)});
  return s;
 },
 [K+'numchk']:(p)=>{
  let s=TF(`R+d\\cos\\theta=\\frac{${uu}+R^2-d^2}{2R}`,600,80,{size:40,frac:true});
  s+=L('R＝2、d＝1、θ＝0（u＝9）',600,180,{size:28,color:C.dim});
  s+=card(120,220,440,200,L('左',340,270,{size:26,color:C.dim})+TF('2+1\\times\\cos 0=3',340,350,{size:40}),seg(p,.15,.3));
  s+=card(640,220,440,200,L('右',860,270,{size:26,color:C.dim})+TF('\\frac{9+4-1}{4}=\\frac{12}{4}=3',860,355,{size:38,frac:true}),seg(p,.35,.5));
  s+=ok(600,480,seg(p,.7,.8));
  return s;
 },
 [K+'limits']:(p)=>{
  let s=mapLines(260,140,520,{p:1});
  s+=card(860,80,300,370,L('R＝2、d＝1',1010,140,{size:26,color:C.dim})+label('θ＝0 → u＝9',1010,230,{size:26,anchor:'middle'})+label('θ＝π → u＝1',1010,310,{size:26,anchor:'middle'}),seg(p,.5,.65));
  s+=fade(seg(p,.7,.85),L('θ が 増えると u は 減る',520,480,{size:28,color:CU,weight:700}));
  return s;
 },
 [K+'den']:(p)=>{
  const row=(y,a,b,g)=>fade(g,TF(a,330,y,{size:32,maxW:420})+label('→',600,y+10,{size:30,color:C.dim,anchor:'middle'})+TF(b,860,y,{size:32,maxW:440}));
  let s=L('取り替え 一覧',600,50,{size:26,color:C.dim});
  s+=row(130,'\\sin\\theta\\,d\\theta',`-\\frac{${du}}{2Rd}`,1);
  s+=row(230,'R+d\\cos\\theta',`\\frac{${uu}+R^2-d^2}{2R}`,1);
  s+=row(330,'0\\sim\\pi',`${UPP}\\sim${LOW}`,1);
  s+=row(430,`${DEN}^{3/2}`,`${uu}^{3/2}`,seg(p,.05,.2));
  s+=fade(seg(p,.5,.65),highlight(80,375,1040,100,1,CU));
  return s;
 },
 // ===== S4 組み立てて、符号を整理する =====
 [K+'assemble']:(p)=>{
  let s=TF(`${PHI}=2\\pi kQR^2\\int_{${UPP}}^{${LOW}}\\frac{${uu}+R^2-d^2}{2R}\\cdot\\frac{1}{${uu}^{3/2}}\\cdot\\Big(-\\frac{${du}}{2Rd}\\Big)`,600,200,{size:46,frac:true,maxW:1120});
  s+=fade(seg(p,.4,.55),L('上下限も u の 値（θ＝0 が 下、θ＝π が 上）',600,380,{size:26,color:C.dim}));
  return s;
 },
 [K+'coef']:(p)=>{
  let s=TF(`2\\pi kQ\\cancel{R^2}\\times\\frac{1}{2R}\\times\\frac{1}{2Rd}=\\frac{2\\pi kQ}{4d}`,600,140,{size:46,frac:true});
  s+=TF(`=${COEF}`,600,300,{size:52,frac:true,box:true,g:seg(p,.45,.6)});
  s+=fade(seg(p,.1,.25),L('2R × 2Rd ＝ 4R²d の R² が 約分',600,440,{size:26,color:C.dim}));
  return s;
 },
 [K+'sign']:(p)=>{
  let s=TF(`${PHI}=-${COEF}\\int_{${UPP}}^{${LOW}}\\frac{${uu}+R^2-d^2}{${uu}^{3/2}}\\,${du}`,600,140,{size:46,frac:true});
  s+=mapLines(340,270,520,{p:1,g:seg(p,.2,.35)});
  return s;
 },
 [K+'flip']:(p)=>{
  let s=TF(`\\int_a^b f\\,du=-\\int_b^a f\\,du`,600,70,{size:38});
  s+=TF(`${PHI}=-${COEF}\\int_{${UPP}}^{${LOW}}\\frac{${uu}+R^2-d^2}{${uu}^{3/2}}\\,${du}`,600,200,{size:40,frac:true,opacity:.6});
  s+=TF(`${PHI}=${COEF}\\int_{${LOW}}^{${UPP}}\\frac{${uu}+R^2-d^2}{${uu}^{3/2}}\\,${du}`,600,370,{size:48,frac:true,box:true,g:seg(p,.35,.5)});
  s+=fade(seg(p,.6,.75),L('小さい 方 から 大きい 方へ',600,490,{size:26,color:CU,weight:700}));
  return s;
 },
 [K+'split']:(p)=>{
  let s=TF(`\\frac{${uu}+R^2-d^2}{${uu}^{3/2}}=\\frac{${uu}}{${uu}^{3/2}}+\\frac{${RD2}}{${uu}^{3/2}}`,600,130,{size:48,frac:true});
  s+=TF(`=${uu}^{-1/2}+(${RD2})\\,${uu}^{-3/2}`,600,320,{size:52,box:true,g:seg(p,.4,.55)});
  return s;
 },
 [K+'result']:(p)=>{
  let s=TF(`${PHI}=${COEF}${POW}`,600,200,{size:48,frac:true,box:true});
  s+=fade(seg(p,.4,.55),L('u の べき乗 2つの 積分',600,380,{size:30,color:CU,weight:700}));
  return s;
 },
 [K+'samevalue']:(p)=>{
  let s=xsec(XC,YC,RP,{dr:.5,ths:[0,Math.PI/4,Math.PI/2,3*Math.PI/4,Math.PI,-Math.PI/4,-Math.PI/2,-3*Math.PI/4]});
  s+=card(600,90,560,330,L('取り替えたのは',880,160,{size:28,color:C.dim})+L('積分の 変数（θ → u）',880,220,{size:30,color:CU,weight:700})
   +fade(seg(p,.35,.5),L('面・電荷・電場は そのまま',880,310,{size:28})+L('→ 値は 同じ',880,370,{size:30,color:G1.hi,weight:700})),1);
  return s;
 },
 // ===== S5 平方根の原始関数を確かめる =====
 [K+'need']:(p)=>{
  let s=card(80,90,480,300,L('微分すると',320,160,{size:28,color:C.dim})+TF(`(\\;?\\;)'=${uu}^{-1/2}`,320,270,{size:46}),1);
  s+=card(640,90,480,300,L('微分すると',880,160,{size:28,color:C.dim})+TF(`(\\;?\\;)'=${uu}^{-3/2}`,880,270,{size:46}),seg(p,.1,.25));
  s+=fade(seg(p,.5,.65),L('微分の 定義（差の商）から 確かめる',600,460,{size:28,color:G1.hi,weight:700}));
  return s;
 },
 [K+'sqrt1']:(p)=>{
  let s=TF(`\\frac{\\sqrt{${uu}+h}-\\sqrt{${uu}}}{h}`,600,110,{size:50,frac:true});
  s+=TF(`=\\frac{\\sqrt{${uu}+h}-\\sqrt{${uu}}}{h}\\times\\frac{\\sqrt{${uu}+h}+\\sqrt{${uu}}}{\\sqrt{${uu}+h}+\\sqrt{${uu}}}`,600,320,{size:46,frac:true,g:seg(p,.4,.55)});
  return s;
 },
 [K+'sqrt2']:(p)=>{
  let s=TF(`=\\frac{(${uu}+h)-${uu}}{h\\,(\\sqrt{${uu}+h}+\\sqrt{${uu}})}=\\frac{1}{\\sqrt{${uu}+h}+\\sqrt{${uu}}}`,600,130,{size:44,frac:true});
  s+=TF(`\\lim_{h\\to0}\\frac{1}{\\sqrt{${uu}+h}+\\sqrt{${uu}}}=\\frac{1}{2\\sqrt{${uu}}}`,600,330,{size:50,frac:true,box:true,g:seg(p,.5,.65)});
  return s;
 },
 [K+'int1']:(p)=>{
  let s=TF(`(\\sqrt{${uu}})'=\\frac{1}{2\\sqrt{${uu}}}`,600,90,{size:42,frac:true});
  s+=TF(`(2\\sqrt{${uu}})'=\\frac{1}{\\sqrt{${uu}}}=${uu}^{-1/2}`,600,220,{size:44,frac:true,g:seg(p,.1,.25)});
  s+=TF(`\\int ${uu}^{-1/2}\\,${du}=2\\sqrt{${uu}}`,600,380,{size:50,box:true,g:seg(p,.45,.6)});
  return s;
 },
 [K+'recip']:(p)=>{
  let s=TF(`f\\times\\frac{1}{f}=1`,600,80,{size:42,frac:true});
  s+=TF(`f'\\,\\frac{1}{f}+f\\,\\Big(\\frac{1}{f}\\Big)'=0`,600,210,{size:42,frac:true,g:seg(p,.2,.35)});
  s+=fade(seg(p,.2,.35),L('積の 微分',1000,215,{size:24,color:C.dim}));
  s+=TF(`\\Big(\\frac{1}{f}\\Big)'=-\\frac{f'}{f^2}`,600,380,{size:50,frac:true,box:true,g:seg(p,.5,.65)});
  return s;
 },
 [K+'recip2']:(p)=>{
  let s=TF(`f=\\sqrt{${uu}},\\quad f'=\\frac{1}{2\\sqrt{${uu}}},\\quad f^2=${uu}`,600,80,{size:38,frac:true});
  s+=TF(`\\Big(\\frac{1}{\\sqrt{${uu}}}\\Big)'=-\\frac{1}{2\\sqrt{${uu}}}\\div ${uu}=-\\frac{1}{2${uu}\\sqrt{${uu}}}`,600,230,{size:44,frac:true,g:seg(p,.1,.25)});
  s+=TF(`=-\\frac{1}{2}\\,${uu}^{-3/2}`,600,390,{size:48,frac:true,box:true,g:seg(p,.5,.65)});
  return s;
 },
 [K+'int2']:(p)=>{
  let s=TF(`\\Big(-\\frac{2}{\\sqrt{${uu}}}\\Big)'=-2\\times\\Big(-\\frac{1}{2}\\,${uu}^{-3/2}\\Big)=${uu}^{-3/2}`,600,130,{size:44,frac:true});
  s+=TF(`\\int ${uu}^{-3/2}\\,${du}=-\\frac{2}{\\sqrt{${uu}}}`,600,330,{size:50,frac:true,box:true,g:seg(p,.4,.55)});
  return s;
 },
 [K+'G']:(p)=>{
  let s=TF(`${PHI}=${COEF}\\Big[2\\sqrt{${uu}}-\\frac{2(${RD2})}{\\sqrt{${uu}}}\\Big]_{${LOW}}^{${UPP}}`,600,130,{size:44,frac:true});
  s+=TF(`=\\frac{\\pi kQ}{\\cancel{2}d}\\times\\cancel{2}\\Big[${GU}\\Big]_{${LOW}}^{${UPP}}`,600,330,{size:44,frac:true,g:seg(p,.45,.6)});
  return s;
 },
 [K+'Gdef']:(p)=>{
  let s=TF(`G(${uu})=${GU}`,600,110,{size:50,frac:true,box:true});
  s+=TF(`${PHI}=${COEF1}\\Big[G\\big(${UPP}\\big)-G\\big(${LOW}\\big)\\Big]`,600,320,{size:46,frac:true,g:seg(p,.35,.5)});
  s+=fade(seg(p,.6,.75),L('上端 − 下端',600,450,{size:28,color:G1.hi,weight:700}));
  return s;
 },
 [K+'Gchk']:(p)=>{
  let s=TF(`G(${uu})=${GU}`,600,70,{size:38,frac:true,opacity:.85});
  s+=TF(`G'(${uu})=\\frac{1}{2\\sqrt{${uu}}}+\\frac{${RD2}}{2${uu}\\sqrt{${uu}}}`,600,210,{size:44,frac:true,g:seg(p,.05,.2)});
  s+=TF(`=\\frac{1}{2}\\Big[${uu}^{-1/2}+(${RD2})\\,${uu}^{-3/2}\\Big]`,600,370,{size:46,frac:true,box:true,g:seg(p,.45,.6)});
  s+=fade(seg(p,.7,.85),L('中身の 半分 → 係数が 2倍（πkQ/d）で 合う',600,485,{size:26,color:G1.ok,weight:700}));
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'sum']:(p)=>{
  const row=(y,a,b,g)=>fade(g,TF(a,330,y,{size:32,maxW:420})+label('→',600,y+10,{size:30,color:C.dim,anchor:'middle'})+TF(b,860,y,{size:32,maxW:440}));
  let s=L('距離の 2乗を u と 置いて 取り替えた',600,50,{size:26,color:CU,weight:700});
  s+=row(130,'\\sin\\theta\\,d\\theta',`-\\frac{${du}}{2Rd}`,1);
  s+=row(230,'R+d\\cos\\theta',`\\frac{${uu}+R^2-d^2}{2R}`,seg(p,.15,.3));
  s+=row(330,'0\\sim\\pi',`${UPP}\\sim${LOW}`,seg(p,.3,.45));
  s+=row(430,`${DEN}^{3/2}`,`${uu}^{3/2}`,seg(p,.45,.6));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=TF(`G(${uu})=${GU}`,600,100,{size:42,frac:true});
  s+=TF(PHIG,600,290,{size:54,box:true,frac:true});
  s+=fade(seg(p,.4,.55),L('G は 微分して 確かめ済み',600,450,{size:26,color:G1.ok,weight:700}));
  return s;
 },
 [K+'next']:(p)=>{
  let s=TF(PHIG,600,100,{size:44});
  s+=card(80,190,500,290,L('上下限を 入れると',330,250,{size:28})+L('d と R は 残る？',330,320,{size:32,color:G1.hi,weight:700}),seg(p,.1,.25),G1.hi);
  s+=fade(seg(p,.5,.65),card(620,190,500,290,xsec(760,290,70,{dr:1.6,axis:false,lab:false,qr:12})+L('電荷が 外',990,310,{size:28})+L('なら？',990,370,{size:32,color:G1.hi,weight:700}),1,G1.hi));
  return s;
 },
};

// YouTube シリーズ「微分・初級 2/2」(ys-ui-average-to-now-b) — 図。Stage 1200×515.
// 旧3本構成（ui-average-to-now-2/-3）の図を関数として再利用し、2本構成用の新しい図だけをここで描く。
// 色（anim.mjs C）：位置 x 水色、速さ v 紫、時刻・幅 t,h 金、強調 黄、誤り 赤、正しい 緑。
import {C,seg,fade,label,line,rect,dot,arrow,tex,texWidth} from './anim.mjs';
import {ytUiAvg2Diagrams as O2} from './yt1-ui-average-to-now-2-diagrams.mjs';
import {ytUiAvgNow3Diagrams as O3} from './yt1-ui-average-to-now-3-diagrams.mjs';

const K='ui-average-to-now-b:';
const o2=k=>O2['ui-average-to-now-2:'+k],o3=k=>O3['ui-average-to-now-3:'+k];
// play picture f for the first part s of the cue, then picture g
const two=(f,g,s)=>p=>p<s?f(p/s):g((p-s)/(1-s));
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);

// last time's table and the number line of the averages heading to 10
const ROWS=[['1','15'],['0.5','12.5'],['0.1','10.5'],['0.01','10.05']];
function recapTable(p,x=60,y=90){
 let s=rect(x,y,440,330,{fill:'#131f38',fo:.96,stroke:C.faint,rx:14});
 s+=label('幅 [s]',x+110,y+48,{size:26,color:C.t,anchor:'middle'})+label('平均の速さ [m/s]',x+310,y+48,{size:26,color:C.v,anchor:'middle'});
 s+=line(x+20,y+70,x+420,y+70,{color:C.faint,w:2});
 ROWS.forEach(([h,v],i)=>{const yy=y+125+i*60;s+=fade(seg(p,.15+i*.1,.25+i*.1),label(h,x+110,yy,{size:30,color:C.t,anchor:'middle'})+label(v,x+310,yy,{size:32,color:C.v,anchor:'middle',weight:700}));});
 return s;
}
function numline(p,{x0=580,x1=1150,y=300}={}){
 const lo=9.5,hi=15.5,X=v=>x0+(x1-x0)*(v-lo)/(hi-lo);
 let s=line(x0,y,x1,y,{color:C.dim,w:3});
 for(let v=10;v<=15;v++)s+=line(X(v),y-8,X(v),y+8,{color:C.dim,w:2})+label(String(v),X(v),y+38,{size:22,color:C.dim,anchor:'middle'});
 s+=line(X(10),y-80,X(10),y+14,{color:C.hi,w:3,dash:'8 6'})+label('10',X(10),y-90,{size:28,color:C.hi,anchor:'middle',weight:700});
 [15,12.5,10.5,10.05].forEach((v,i)=>{s+=fade(seg(p,.15+i*.1,.25+i*.1),dot(X(v),y,10,C.v));});
 s+=arrow(X(15)+10,y+70,X(10)+14,y+70,{color:C.hi,w:4,g:seg(p,.55,.75)});
 return s;
}

export const ytUiAvgNowBDiagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>fade(seg(p,0,.1),label('前回',60,70,{size:24,color:C.dim}))+recapTable(p)+fade(seg(p,.1,.2),numline(p))
   +fade(seg(p,.7,.85),label('10 へ 寄っていく',865,440,{size:30,color:C.hi,anchor:'middle',weight:700})),
 [K+'question']:(p)=>{
  let s=label('今回の問い',600,75,{size:28,color:C.dim,anchor:'middle'});
  s+=card(120,105,960,130,label('① なぜ 10 に 寄るのか？',600,185,{size:38,color:C.ink,anchor:'middle',weight:700}),seg(p,0,.15),C.t);
  s+=card(120,265,960,130,label('② この 10 を「1秒ちょうどの速さ」と呼べる？',600,345,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'why']:o2('why'),
 // ===== S2 幅を h で書く =====
 [K+'hstrip']:o2('hstrip'),
 [K+'square']:o2('square'),
 [K+'times5']:o2('times5'),
 [K+'dx']:o2('dx'),
 [K+'cancel']:two(o2('divide'),o2('cancel'),.35),
 [K+'result']:o2('result'),
 [K+'check']:o2('check'),
 [K+'parts']:o2('parts'),
 [K+'quiz']:o3('quiz'),
 [K+'quiz2']:o3('quiz2'),
 // ===== S3 グラフの傾き =====
 [K+'tilt']:o2('tilt'),
 [K+'tangent']:o3('tangent'),
 [K+'zoom']:o3('zoom'),
 // ===== S4 0で割らずに近づける =====
 [K+'zeroask']:o2('zero'),
 [K+'merge']:two(o3('merge'),o3('zero2'),.4),
 [K+'check6']:o3('check'),
 [K+'checkbox']:two(o3('check2'),o3('check3'),.42),
 [K+'check4']:o3('check4'),
 [K+'approach']:o3('approach'),
 [K+'bar']:o3('bar'),
 [K+'limit']:o3('limit'),
 [K+'notsub']:o3('notsub'),
 [K+'left2']:o3('left2'),
 // ===== S5 v = dx/dt =====
 [K+'dxdt']:two(o3('delta'),o3('dxdt'),.35),
 [K+'dmean']:o3('dmean'),
 [K+'v1']:o3('v1'),
 [K+'t2']:o3('t2'),
 [K+'t2b']:o3('t2b'),
 [K+'tgen']:(p)=>{
  // any time t: the same steps give v = 10t (this is what the closing v-t graph shows)
  let s=label('どの時刻 t からでも 幅 h',120,90,{size:28,color:C.t});
  s+=fade(seg(p,.05,.25),tex('\\Delta x=5(t+h)^2-5t^2',150,180,{size:44,anchor:'start'}));
  s+=fade(seg(p,.25,.45),tex('=10th+5h^2',240,262,{size:44,anchor:'start',auto:false}));
  const A='\\bar v=\\dfrac{10th+5h^2}{h}=10t+5h';
  s+=fade(seg(p,.45,.6),tex(A,150,390,{size:46,anchor:'start'}));
  s+=fade(seg(p,.6,.72),tex('\\xrightarrow{\\;h\\,\\to\\,0\\;}\\;10t',150+texWidth(A,46)+20,390,{size:46,anchor:'start',auto:false,color:C.hi}));
  s+=fade(seg(p,.75,.9),label('瞬間の速さ  v ＝ 10t　（t ＝ 1 で 10、t ＝ 2 で 20）',600,485,{size:30,color:C.v,anchor:'middle',weight:700}));
  return s;
 },
 [K+'compare']:o3('compare'),
 // ===== S6 いまの速さと次の問い =====
 [K+'meter']:o3('meter'),
 [K+'sum']:o3('sum3'),
 [K+'next1']:o3('next1'),
 [K+'next2']:o3('next2'),
};

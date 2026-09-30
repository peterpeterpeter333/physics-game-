// YouTube シリーズ「微分・初級 1/2」(ys-ui-average-to-now-a) — 図。Stage 1200×515.
// 旧3本構成（ui-average-to-now-1/-2）の図を関数として再利用し、2本構成用の新しい図だけをここで描く。
// 色（anim.mjs C）：位置 x 水色、速さ v 紫、時刻・幅 t 金、強調 黄。
import {C,mix,seg,fade,label,line,rect,dot,arrow,tex} from './anim.mjs';
import {ytAverageToNow1 as O1} from './yt1-ui-average-to-now-1-diagrams.mjs';
import {ytUiAvg2Diagrams as O2} from './yt1-ui-average-to-now-2-diagrams.mjs';

const K='ui-average-to-now-a:';
const o1=k=>O1['ui-average-to-now-1:'+k],o2=k=>O2['ui-average-to-now-2:'+k];
// play picture f for the first part s of the cue, then picture g
const two=(f,g,s)=>p=>p<s?f(p/s):g((p-s)/(1-s));
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);

// the averages 15 → 12.5 → 10.5 → 10.05 on a number line, heading to 10
function sequence(p,{y=330,x0=150,x1=1050}={}){
 const lo=9,hi=15.5,X=v=>x0+(x1-x0)*(v-lo)/(hi-lo);
 let s=line(x0,y,x1,y,{color:C.dim,w:3});
 for(let v=9;v<=15;v++)s+=line(X(v),y-8,X(v),y+8,{color:C.dim,w:2})+label(String(v),X(v),y+38,{size:22,color:C.dim,anchor:'middle'});
 s+=line(X(10),y-70,X(10),y+14,{color:C.hi,w:3,dash:'8 6'})+label('10',X(10),y-80,{size:28,color:C.hi,anchor:'middle',weight:700});
 [[15,.1],[12.5,.2],[10.5,.3],[10.05,.4]].forEach(([v,a],i)=>{s+=fade(seg(p,a,a+.1),dot(X(v),y,10,C.v)+label(String(v),i===3?X(v)-12:X(v),y-24,{size:22,color:C.v,anchor:i===3?'end':'middle'}));});
 s+=arrow(X(15)+10,y+62,X(10)+14,y+62,{color:C.hi,w:4,g:seg(p,.45,.6)});
 return s;
}


// table of widths with the "10 を超えた分" column (copied from the 2/3 module, widened so "＝ h × 5" stays inside)
const ROWS=[[1,'15','5'],[0.5,'12.5','2.5'],[0.1,'10.5','0.5'],[0.01,'10.05','0.05']];
const exW=excess=>mix(460,820,excess);
function table({g=1,excess=0,five=0}={}){
 const x0=60,y0=70,w=exW(excess);
 let s=rect(x0,y0,w,340,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:14});
 s+=label('幅 Δt [s]',x0+110,y0+52,{size:26,color:C.t,anchor:'middle'})+label('平均の速さ [m/s]',x0+330,y0+52,{size:26,color:C.v,anchor:'middle'});
 s+=fade(excess,label('10 を超えた分',x0+560,y0+52,{size:26,color:C.a,anchor:'middle'}));
 s+=line(x0+20,y0+74,x0+w-20,y0+74,{color:C.faint,w:2});
 ROWS.forEach(([h,v,e],i)=>{const y=y0+130+i*66;
  s+=label(String(h),x0+110,y,{size:32,color:C.t,anchor:'middle'})+label(v,x0+330,y,{size:34,color:C.v,anchor:'middle',weight:700});
  s+=fade(excess,label(e,x0+560,y,{size:32,color:C.a,anchor:'middle'}));
  s+=fade(five,label(`＝ ${h} × 5`,x0+650,y,{size:26,color:C.hi}));});
 return fade(g,s);
}

export const ytUiAvgNowADiagrams={
 // ===== S1 いまの速さ =====
 [K+'meter']:o1('meter'),
 [K+'formula']:o1('formula'),
 [K+'zero']:o1('zero'),
 [K+'question']:o1('question'),
 [K+'series']:(p)=>{
  const items=[['1','平均の速さと','区間を縮める'],['2','0へ近づけた','行き先 ＝ いまの速さ']];
  let s=fade(seg(p,0,.12),label('微分を 組み立てる 2回',600,90,{size:34,color:C.ink,anchor:'middle',weight:700}));
  items.forEach(([n,a,b],i)=>{const x=150+i*480,g=seg(p,.12+i*.3,.3+i*.3),on=i===0&&p>.3;
   s+=card(x,150,420,230,label(n,x+210,225,{size:52,color:C.hi,anchor:'middle',weight:700})+label(a,x+210,295,{size:30,color:C.ink,anchor:'middle'})+label(b,x+210,345,{size:30,color:C.ink,anchor:'middle'}),g,on?C.hi:C.faint);
   if(i===0)s+=arrow(x+430,265,x+470,265,{color:C.dim,w:3,head:12,g:seg(p,.42,.5)});});
  s+=fade(seg(p,.2,.35),label('今回',360,138,{size:24,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.75,.9),label('ゴール：「いまの速さ」を 決める',600,450,{size:30,color:C.v,anchor:'middle'}));
  return s;
 },
 // ===== S2 平均の速さ =====
 [K+'road']:o1('road'),
 [K+'divide']:o1('divide'),
 [K+'symbols']:o1('symbols'),
 [K+'vbar']:(p)=>o1('vbar')(p)+fade(seg(p,.02,.2),label('Δ ＝ 差',960,260,{size:30,color:C.ink,anchor:'middle',weight:700})+label('（終わり − 始め）',960,305,{size:24,color:C.dim,anchor:'middle'})),
 [K+'slope']:o1('slope'),
 // ===== S3 平均で分からないこと =====
 [K+'doubt']:o1('doubt'),
 [K+'walker']:o1('walker'),
 [K+'runner']:two(o1('runner'),o1('runcalc'),.62),
 [K+'same']:o1('same'),
 [K+'at5']:o1('at5'),
 [K+'chord']:o1('chord'),
 [K+'level']:o1('level'),
 // ===== S4 速さが変わり続ける運動 =====
 [K+'curve']:o1('curve'),
 [K+'x12']:two(o1('x1'),o1('x2'),.45),
 [K+'steps']:o1('steps'),
 [K+'v15']:o1('v15'),
 [K+'ask15']:o1('ask15'),
 [K+'inside']:o1('inside'),
 [K+'between']:two(o1('v5'),o1('between'),.4),
 [K+'unknown']:o1('unknown'),
 // ===== S5 区間を縮める =====
 [K+'fix']:o2('fix'),
 [K+'predict']:o2('predict'),
 [K+'half']:two(o2('half'),o2('halfpos'),.35),
 [K+'halfv']:two(o2('halfdx'),o2('halfv'),.4),
 [K+'halves']:o2('halves'),
 [K+'tenth']:two(o2('tenth'),o2('tenthv'),.45),
 [K+'hund']:two(o2('hund'),o2('hundv'),.45),
 [K+'table']:o2('table'),
 [K+'excess']:(p)=>{
  const ex=seg(p,.05,.25),fv=seg(p,.6,.8);
  return table({excess:ex,five:fv})+fade(fv,card(60,430,820,70,label('10 を超えた分 ＝ 幅 × 5',470,477,{size:32,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
 },
 [K+'answer']:(p)=>{
  let s=fade(1-seg(p,0,.15)*.5,table({excess:1-seg(p,0,.15),five:1-seg(p,0,.15)}));
  s+=card(540,80,650,420,label('幅を縮めると 小さくなり、10 へ寄る',865,140,{size:30,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.05,.2),sequence((p-.05)/.7,{y:320,x0:570,x1:1160})),seg(p,.02,.15),C.hi);
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'summary']:(p)=>{
  let s=card(150,40,900,150,label('平均の速さ',330,105,{size:30,color:C.v,anchor:'middle',weight:700})+tex('\\bar v=\\dfrac{\\Delta x}{\\Delta t}',560,115,{size:48})
   +label('区間全体を ならした 一つの値',850,125,{size:26,color:C.ink,anchor:'middle'}),seg(p,0,.15));
  s+=fade(seg(p,.4,.5),label('1 s から 幅を縮めると…',150,240,{size:28,color:C.t}));
  s+=fade(seg(p,.4,.5),sequence((p-.4)/.6,{y:370}));
  return s;
 },
 ...Object.fromEntries([['next',0],['bye',1]].map(([k,done])=>[K+k,(p)=>{
  let s=label('次回の問い',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=card(120,100,960,120,label('① なぜ 10 に 寄るのか？',600,175,{size:36,color:C.ink,anchor:'middle',weight:700}),done?1:seg(p,0,.15),C.t);
  s+=card(120,245,960,120,label('② この 10 は「1秒ちょうどの速さ」？',600,320,{size:36,color:C.hi,anchor:'middle',weight:700}),done?1:seg(p,.35,.5),C.hi);
  s+=fade(done?seg(p,.1,.3):0,label('幅を 文字 h で書いて 確かめる',600,425,{size:30,color:C.t,anchor:'middle'}));
  s+=fade(done?seg(p,.5,.7):0,label('微分・初級 2/2 へ',1080,490,{size:26,color:C.dim,anchor:'end'}));
  return s;
 }])),
};

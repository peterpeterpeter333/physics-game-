// 問題編 解説「終端速度より速く投げ下ろすと」（q-uc-drag、大学編 11 空気抵抗・上級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/11_空気抵抗.md の q-uc-drag（解説 19 行）。
// 色：速度 v 紫、加速度 a 赤、力（重力・抵抗）緑、時間 t・τ 金、終端速度の線・強調 黄、差 w は薄い黄の塗り（正本の指定）。札は yt1-qx-common.mjs。
// 数値：v＝4＋6e^(−t/0.4)。cv² のモデル：dv/dt＝10−0.625v²（RK4 で解いた表、図だけに使う）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,poly} from './anim.mjs';
import {QC,card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,note,cueT,sentWin} from './yt1-qx-common.mjs';

const K='qx-uc-drag:';
const CF=QC.F,CV=QC.v,CA=QC.a,CT=QC.t,CH=QC.hi,CW='#f2e29b',CD='#ff6b6b';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const G1='v を t の式で（kv のモデル）',G2='差の大きさが 6 → 3 になる時刻',G3='v＝10 の加速度（kv、cv²）';
const ANS1=g=>answerTag(1,'D','',{g}),ANS2=g=>answerTag(2,'A','約 0.28 s',{g}),ANS3=g=>answerTag(3,'A','−15、−52.5',{g});
const WOPT={size:26,whySize:24};
const vk=t=>4+6*Math.exp(-t/.4);
const tc=s=>`{\\color{${CT}}${s}}`,wc=s=>`{\\color{${CW}}${s}}`;
const TAU=tc('\\tau'),W=wc('w');
// cv² のモデル（RK4）
const DT=.002,VC=(()=>{let v=10;const out=[v],f=u=>10-.625*u*u;for(let i=0;i<900;i++){const a=f(v),b=f(v+DT/2*a),c=f(v+DT/2*b),d=f(v+DT*c);v+=DT/6*(a+2*b+2*c+d);out.push(v);}return out;})();
const vc=t=>VC[clamp(Math.round(t/DT),0,VC.length-1)];

// ---- 球（矢印は向きだけ。重力・抵抗は同じ長さ） ----
function ball({x=220,y=300,g=1,res=1,vel=1}={}){
 let s=ring(x,y,32,{color:C.dim,w:3,fill:'#2b3d63'})+label('0.2 kg',x+44,y+8,{size:24,color:C.ink,weight:700});
 s+=arrow(x,y+32,x,y+112,{color:CF,w:6,head:16})+label('重力',x+14,y+108,{size:24,color:CF,weight:700});
 s+=fade(res,arrow(x,y-32,x,y-112,{color:CF,w:6,head:16})+label('抵抗 kv',x+14,y-90,{size:24,color:CF,weight:700}));
 s+=fade(vel,arrow(x-80,y-50,x-80,y+70,{color:CV,w:7,head:16})+label('10 m/s',x-92,y+70,{size:24,color:CV,anchor:'end',weight:700}));
 return fade(g,s);
}
const plusDown=(g=1)=>fade(g,arrow(60,100,60,170,{color:CH,w:4,head:14})+label('＋',76,150,{size:26,color:CH,weight:700})+label('下向きが正',62,200,{size:22,color:CH,anchor:'middle',weight:700}));
const givens=(g=1)=>fade(g,label('k ＝ 0.5 kg/s、g ＝ 10 m/s²',20,465,{size:24,color:C.ink,weight:700})+label('ln 2 ＝ 0.69',20,500,{size:24,color:C.ink,weight:700})
 +kindTag('前提（モデル）',380,120,{color:C.dim,size:22}));
// v–t グラフ
function gr({x=560,y=440,w=480,h=320,xmax=1.6,ymax=12,xt=[.4,.8,1.2],yt=[2,4,6,8,10],g=1,xl='t [s]',yl='v [m/s]',xcol=CT,ycol=CV}={}){
 const X=u=>x+w*u/xmax,Y=v=>y-h*v/ymax;
 let s=arrow(x-8,y,x+w+22,y,{color:C.dim,w:2.5,head:14})+arrow(x,y+8,x,y-h-22,{color:C.dim,w:2.5,head:14});
 for(const u of xt)s+=line(X(u),y-6,X(u),y+6,{color:C.dim})+label(String(u),X(u),y+32,{size:22,color:C.dim,anchor:'middle'});
 for(const v of yt)s+=line(x-6,Y(v),x+6,Y(v),{color:C.dim})+label(String(v),x-12,Y(v)+8,{size:22,color:C.dim,anchor:'end'});
 s+=label(xl,x+w+26,y+8,{size:24,color:xcol})+label(yl,x,y-h-32,{size:24,color:ycol,anchor:'middle'});
 const plot=(fn,{from=0,to=xmax,p=1,color=CV,w:ww=4,dash=''}={})=>draw(Array.from({length:161},(_,i)=>{const u=from+(to-from)*i/160;return [X(u),Y(fn(u))];}),p,{color,w:ww,dash});
 return {svg:fade(g,s),X,Y,plot};
}
const vline=(A,g=1,txt='v∞ ＝ 4')=>fade(g,line(A.X(0),A.Y(4),A.X(1.6),A.Y(4),{color:CH,w:3,dash:'10 7'})+(txt?label(txt,A.X(1.6),A.Y(4)+30,{size:24,color:CH,anchor:'end',weight:700}):''));
function gapFill(A,to=1.6,g=1){const n=60,top=[],bot=[];for(let i=0;i<=n;i++){const t=to*i/n;top.push([A.X(t),A.Y(vk(t))]);bot.push([A.X(t),A.Y(4)]);}return fade(g,poly([...top,...bot.reverse()],{fill:CW,fo:.28}));}
const start=(A,g=1)=>fade(g,dot(A.X(0),A.Y(10),8,CV));
// 抵抗–速さのグラフ
function rv(g=1){return gr({x:110,y:450,w:620,h:330,xmax:11,ymax:14,xt:[2,4,6,8,10],yt:[2,4,6,8,10,12],g,xl:'速さ v',yl:'抵抗 [N]',xcol:CV,ycol:CF});}

export const ytQxUcDragDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（約6秒）：0〜2 s 小球に重力と抵抗の矢印（向きだけ）、隅に k・g・ln 2 と「前提（モデル）」。2〜4 s 目盛りだけの v–t グラフと t＝0 の点（10 m/s）。4〜6 s 小問3 の予告の札。静止。
 [K+'q1']:(p)=>{
  let s=plusDown(seg(p,0,.1))+ball({g:seg(p,.02,.15),res:seg(p,.1,.25)})+givens(seg(p,.15,.3))+note('矢印は 向きだけ',220,438,{g:seg(p,.2,.3)});
  const A=gr({g:seg(p,.35,.5)});s+=A.svg+start(A,seg(p,.5,.62))+fade(seg(p,.5,.62),label('10',A.X(0)+14,A.Y(10)-10,{size:24,color:CV,weight:700}));
  s+=fade(seg(p,.7,.85),card(560,478,630,36,'',1)+label('小問3：抵抗を cv² に取りかえる（終端速度は同じ）',575,504,{size:22,color:C.dim}));
  return s;
 },
 // 小問3（約3.5秒）：前の図を消し、同じ小球（10 m/s で投げ下ろす）と、抵抗のモデルを cv² に取りかえた札。c の値・加速度は出さない。
 [K+'q3']:(p)=>{
  let s=plusDown()+ball({g:seg(p,0,.2),res:seg(p,.1,.3)}).replace('抵抗 kv','抵抗');
  s+=card(480,110,680,230,kindTag('前提（モデル）',1040,150,{color:C.dim,size:22})
   +label('抵抗 cv²（上向き）',520,215,{size:32,color:CF,weight:700})
   +label('終端速度が kv のモデル（k ＝ 0.5 kg/s）と',520,272,{size:26,color:C.ink})+label('同じに なるように c を選ぶ',520,312,{size:26,color:C.ink}),seg(p,.35,.6),CF);
  s+=fade(seg(p,.65,.85),label('g ＝ 10 m/s²',480,420,{size:26,color:C.ink,weight:700}));
  s+=note('矢印は 向きだけ',220,438,{g:seg(p,.2,.3)});
  return s;
 },

 // ===================== 小問1 =====================
 [K+'goal1']:(p)=>{const A=gr();return plusDown()+ball()+givens()+note('矢印は 向きだけ',220,438)+A.svg+start(A)+label('10',A.X(0)+14,A.Y(10)-10,{size:24,color:CV,weight:700})+goalTag(G1,{g:seg(p,.03,.15)});},
 // 2. v∞＝4（黄の水平線）、τ＝0.4 s（金）
 [K+'vinf']:(p,ctx)=>{
  const W2=sentWin(ctx),A=gr();
  let s=card(20,92,500,400,'',1);
  s+=T('v_\\infty=\\dfrac{mg}{k}=\\dfrac{2}{0.5}',270,160,36)+fade(seg(p,.15,.25),T('=4\\ \\mathrm{m/s}',270,235,38,{color:CH}));
  s+=fade(seg(p,.45,.55),T(`${TAU}=\\dfrac{m}{k}=\\dfrac{0.2}{0.5}`,270,340,36)+fade(seg(p,.6,.7),T('=0.4\\ \\mathrm{s}',270,420,38,{color:CT})));
  s+=A.svg+start(A)+vline(A,seg(p,.2,.3));
  s+=fade(seg(p,.6,.7),line(A.X(.4),A.Y(0),A.X(.4),A.Y(11),{color:CT,w:3,dash:'5 6'})+label('τ',A.X(.4)+10,A.Y(11)+8,{size:28,color:CT,weight:700}));
  return s+goalTag(G1);
 },
 // 3. 6段の帯（零解、w で割る、ln|w|、積分、指数、初期値）を上から順に光らせる
 [K+'sep']:(p)=>{
  const rows=[['零解',`${W}=0`],['w で割る',`(1/${W})\\,d${W}/dt=-1/${TAU}`],['ln|w|',`d(\\ln|${W}|)/dt=-1/${TAU}`],
   ['積分',`\\ln|${W}|=-t/${TAU}+C_1`],['指数',`|${W}|=e^{C_1}\\,e^{-t/${TAU}}`],['初期値',`${W}=${W}(0)\\,e^{-t/${TAU}}`]];
  let s=label('dw/dt ＝ −w/τ を 解く',600,112,{size:26,color:C.dim,anchor:'middle'});
  rows.forEach(([a,e],i)=>{const y=135+i*62,on=seg(p,.05+i*.13,.12+i*.13),cur=on*(1-seg(p,.18+i*.13,.22+i*.13)*(i<5?1:0));
   s+=fade(.25+.75*on,rect(170,y,860,56,{fill:i===5?CH:C.faint,fo:i===5?.12:.25,stroke:cur>.5?CH:C.faint,sw:2.5,rx:10})
    +label(`${i+1}　${a}`,190,y+38,{size:24,color:i===5?CH:C.ink,weight:700})+T(e,660,y+28,32));
   if(i===0)s+=fade(.25+.75*on,label('（w ＝ 0 も 解）',840,y+38,{size:22,color:C.dim}));});
  return s+goalTag(G1);
 },
 // 4. t＝0 の点（10）が 4 の線の上。すき間 6 を薄い黄で塗る。「w(0)＝−6」
 [K+'w0']:(p,ctx)=>{
  const W2=sentWin(ctx),b=W2[1]?W2[1][0]:.5,A=gr();
  let s=A.svg+vline(A)+start(A)+label('10',A.X(0)+14,A.Y(10)-10,{size:24,color:CV,weight:700});
  s+=fade(seg(p,.1,.2),rect(A.X(0)+4,A.Y(10),26,A.Y(4)-A.Y(10),{fill:CW,fo:.4,stroke:CW,sw:2,rx:3})+label('6',A.X(0)+40,A.Y(7)+8,{size:28,color:CW,weight:700}));
  s+=card(20,92,500,330,T(`${W}(0)=v_\\infty-v_0`,270,160,36)+fade(seg(p,.1,.2),T('=4-10',270,235,36))+fade(seg(p,.2,.3),T('=-6\\ \\mathrm{m/s}',270,305,38,{color:CW}))
   +fade(seg(p,b,b+.08),label('終端速度より 速い → 差は 負',270,385,{size:24,color:CH,anchor:'middle',weight:700})),1,CW);
  s+=fade(seg(p,.25,.35),card(A.X(.5),A.Y(10)-30,190,56,label('w(0) ＝ −6',A.X(.5)+95,A.Y(10)+8,{size:26,color:CW,anchor:'middle',weight:700}),1,CW));
  return s+goalTag(G1);
 },
 // 5. v＝v∞−w に戻す。マイナスを2つ重ねてプラスになる所を黄で。10 から下りて 4 に近づく曲線。答えの札 D
 [K+'ans1']:(p,ctx)=>{
  const W2=sentWin(ctx),b=W2[1]?W2[1][0]:.8,A=gr({x:640,w:440});
  let s=card(20,92,580,400,'',1);
  s+=T(`v=v_\\infty-${W}`,310,150,36);
  s+=fade(seg(p,.1,.2),T(`=4{\\color{${CH}}-(-6)}\\,e^{-t/0.4}`,310,240,36));
  s+=fade(seg(p,.35,.45),T(`=4{\\color{${CH}}+}6\\,e^{-t/0.4}`,310,340,40));
  s+=fade(seg(p,.3,.4),label('− と − で ＋',310,430,{size:26,color:CH,anchor:'middle',weight:700}));
  s+=A.svg+vline(A)+start(A)+A.plot(vk,{p:seg(p,.45,.8),color:CV,w:5});
  const ia=b+(1-b)*.55;
  return s+goalTag(G1)+ANS1(seg(p,ia,ia+.06));
 },
 // 6a. 初めの速度 ✓
 [K+'check']:(p)=>{
  const A=gr({x:640,w:440});
  let s=card(20,92,580,400,label('確かめ',310,140,{size:26,color:C.dim,anchor:'middle'})
   +T('t=0:\\ 4+6=10\\ \\mathrm{m/s}',310,215,34)+fade(seg(p,.3,.4),label('✓ 初めの速度',310,290,{size:30,color:CF,anchor:'middle',weight:700})),1);
  s+=A.svg+vline(A)+A.plot(vk,{color:CV,w:5})+start(A)+fade(seg(p,.3,.4),ring(A.X(0),A.Y(10),16,{color:CF,w:3}));
  return s+goalTag(G1)+ANS1(1);
 },
 // 6b. 方程式 ✓。左右の −15 を同じ色で並べる。出だしの接線
 [K+'check2']:(p)=>{
  const A=gr({x:640,w:440});
  let s=card(20,92,580,400,label('確かめ',310,140,{size:26,color:C.dim,anchor:'middle'})+label('✓ 初めの速度',310,195,{size:28,color:CF,anchor:'middle',weight:700})
   +fade(seg(p,.05,.15),label('出だしの 傾き',170,260,{size:24,color:C.dim,anchor:'middle'})+T(`{\\color{${CA}}-15}`,170,320,40))
   +fade(seg(p,.35,.45),label('右の辺',440,260,{size:24,color:C.dim,anchor:'middle'})+T(`10-2.5\\times10={\\color{${CA}}-15}`,440,320,28))
   +fade(seg(p,.6,.7),label('✓ 方程式',310,420,{size:30,color:CF,anchor:'middle',weight:700})),1);
  s+=A.svg+vline(A)+A.plot(vk,{color:CV,w:5})+start(A);
  s+=fade(seg(p,.1,.25),line(A.X(0),A.Y(10),A.X(.4),A.Y(4),{color:CA,w:3,dash:'7 6'})+label('傾き −15',A.X(.42),A.Y(4)-14,{size:24,color:CA,weight:700}));
  return s+goalTag(G1)+ANS1(1);
 },
 // 7. 誤答 A・B（文1を半分ずつ）→ C（文2）。各式の t＝0 の値を添える
 [K+'wrong1']:(p,ctx)=>{
  const W2=sentWin(ctx),e=W2[0][1],s2=W2[1]?W2[1][0]:e,A=gr({x:760,w:340,h:280,y:440});
  let s=A.svg+vline(A,1,'')+A.plot(vk,{color:CV,w:4})+start(A);
  const pt=(v,g,txt)=>fade(g,dot(A.X(0),A.Y(Math.max(v,0)),8,C.dim)+label(txt,A.X(0)+14,A.Y(Math.max(v,0))+(v<=0?-12:8),{size:24,color:C.dim,weight:700}));
  const inA=seg(p,.01,.05)*(1-seg(p,e*.5-.04,e*.5)),inB=seg(p,e*.5+.01,e*.5+.05)*(1-seg(p,s2-.04,s2)),inC=seg(p,s2+.01,s2+.05);
  s+=pt(0,inA,'−2（軸より下）')+pt(10,inB,'10')+pt(0,inC,'0');
  s+=wrongSeq(p,ctx,[['A','v＝4−6×(e の −t/0.4 乗)',['w(0) を ＋6 と符号を逆にした','t＝0 で −2（10 にならない）']],['B','v＝10×(e の −t/0.4 乗)',['重力（v∞）を入れていない','t＝0 では 10 だが、0 へ向かう']],['C','v＝4×(1−e の −t/0.4 乗)',['静止から落とす式のまま','t＝0 で 0（10 にならない）']]],{win:[[0,e*.5],[e*.5,s2],[s2,1]],opts:{...WOPT,x:20,w:700,y:150}});
  return s+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 [K+'goal2']:(p)=>{const A=gr({x:110,w:640});return A.svg+vline(A)+A.plot(vk,{color:CV,w:5})+gapFill(A,1.6,seg(p,.2,.35))+start(A)+goalTag(G2,{g:seg(p,.03,.15)});},
 // 9. すき間 w が 6 から 3 へ縮む所を黄で。式を一行ずつ
 [K+'half']:(p,ctx)=>{
  const W2=sentWin(ctx),b=W2[1]?W2[1][0]:.5,A=gr({x:110,w:600}),th=.4*Math.log(2);
  let s=A.svg+vline(A)+A.plot(vk,{color:CV,w:5})+gapFill(A)+start(A);
  s+=fade(seg(p,.05,.15),line(A.X(0)+3,A.Y(10),A.X(0)+3,A.Y(4),{color:CH,w:7})+label('6',A.X(0)+14,A.Y(7.5),{size:26,color:CH,weight:700}));
  s+=fade(seg(p,.15,.25),line(A.X(th),A.Y(7),A.X(th),A.Y(4),{color:CH,w:7})+label('3',A.X(th)+12,A.Y(5.5)+8,{size:26,color:CH,weight:700}));
  s+=card(780,92,400,400,T(`e^{-t/${TAU}}=\\dfrac{1}{2}`,980,160,36)
   +fade(seg(p,b,b+.08),label('両辺の ln',980,230,{size:24,color:C.dim,anchor:'middle'})+T(`-\\dfrac{t}{${TAU}}=-\\ln2`,980,290,34))
   +fade(seg(p,b+.2,b+.3),T(`t=${TAU}\\ln2`,980,400,40,{color:CT})),1,CH);
  return s+goalTag(G2);
 },
 // 10. t＝0.28 s に縦線（金）。答えの札 A
 [K+'ans2']:(p,ctx)=>{
  const W2=sentWin(ctx),b=W2[1]?W2[1][0]:.6,A=gr({x:110,w:600}),th=.4*Math.log(2);
  let s=A.svg+vline(A)+A.plot(vk,{color:CV,w:5})+gapFill(A)+start(A);
  s+=line(A.X(th),A.Y(7),A.X(th),A.Y(4),{color:CH,w:7})+label('3',A.X(th)+12,A.Y(5.5)+8,{size:26,color:CH,weight:700});
  s+=fade(seg(p,.1,.25),line(A.X(th),A.Y(0),A.X(th),A.Y(11.5),{color:CT,w:3,dash:'6 6'})+label('約 0.28 s',A.X(th)+10,A.Y(11.2),{size:26,color:CT,weight:700}));
  s+=card(780,92,400,400,T(`t=${TAU}\\ln2`,980,160,38)+fade(seg(p,.05,.15),T('=0.4\\times0.69',980,250,34))+fade(seg(p,.15,.25),T('\\approx0.28\\ \\mathrm{s}',980,340,40,{color:CT})),1,CT);
  return s+goalTag(G2)+ANS2(seg(p,b+.02,b+.1));
 },
 // 11. 誤答 B・C（文1を半分ずつ）。t＝0.40 s に2本目の縦線、すき間に「約 37％」
 [K+'wrong2']:(p,ctx)=>{
  const W2=sentWin(ctx),e=W2[0][1],A=gr({x:110,w:600}),th=.4*Math.log(2);
  let s=A.svg+vline(A)+A.plot(vk,{color:CV,w:5})+gapFill(A)+start(A);
  s+=line(A.X(th),A.Y(0),A.X(th),A.Y(11.5),{color:CT,w:3,dash:'6 6'})+label('約 0.28 s',A.X(th)+10,A.Y(11.2),{size:26,color:CT,weight:700});
  s+=fade(seg(p,e*.5,e*.5+.06),line(A.X(.4),A.Y(0),A.X(.4),A.Y(9.5),{color:C.dim,w:3,dash:'4 6'})+line(A.X(.4),A.Y(vk(.4)),A.X(.4),A.Y(4),{color:CW,w:7})
   +label('0.40 s',A.X(.4)+10,A.Y(9.3),{size:24,color:C.dim})+label('約 37%',A.X(.4)+14,A.Y(5.2),{size:26,color:CW,weight:700}));
  s+=wrongSeq(p,ctx,[['B','0.20 s','τ の半分とした'],['C','0.40 s',['τ では約 37％、','半分ではない']]],{win:[[0,e*.5],[e*.5,1]],opts:{...WOPT,x:780,w:400,y:150}});
  return s+goalTag(G2)+ANS2(1);
 },
 // 12. 誤答 D
 [K+'wrong2d']:(p)=>{
  const A=gr({x:110,w:600}),th=.4*Math.log(2);
  let s=A.svg+vline(A)+A.plot(vk,{color:CV,w:5})+gapFill(A)+start(A)+line(A.X(th),A.Y(0),A.X(th),A.Y(11.5),{color:CT,w:3,dash:'6 6'})+label('約 0.28 s',A.X(th)+10,A.Y(11.2),{size:26,color:CT,weight:700});
  s+=wrongCard('D','約 0.58 s','τ÷ln 2 にした',{...WOPT,x:780,w:400,y:150,mid:'\\dfrac{0.4}{0.69}\\approx0.58',g:seg(p,.02,.08)});
  s+=fade(seg(p,.45,.55),label('ln 2 ＜ 1 → 割ると 長くなる',980,420,{size:24,color:C.dim,anchor:'middle'}));
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 // 13. 横軸 速さ、縦軸 抵抗のグラフに切りかえる
 [K+'goal3']:(p)=>{const A=rv(seg(p,.1,.3));return A.svg+fade(seg(p,.3,.45),line(A.X(0),A.Y(2),A.X(11),A.Y(2),{color:CF,w:2,dash:'6 6'})+label('mg ＝ 2 N',A.X(.6),A.Y(2)-12,{size:24,color:CF,weight:700}))+goalTag(G3,{g:seg(p,.03,.15)});},
 // 14. 直線 kv と放物線 cv²。どちらも v∞＝4 で 2 N に達して交わる。c＝0.125
 [K+'cval']:(p,ctx)=>{
  const W2=sentWin(ctx),b=W2[1]?W2[1][0]:.45,A=rv();
  let s=A.svg+line(A.X(0),A.Y(2),A.X(11),A.Y(2),{color:CF,w:2,dash:'6 6'})+label('mg ＝ 2 N',A.X(.6),A.Y(2)-12,{size:24,color:CF,weight:700});
  s+=A.plot(v=>.5*v,{color:CF,w:3,p:seg(p,.05,.2)})+A.plot(v=>Math.min(14.5,.125*v*v),{to:10.7,color:CF,w:6,p:seg(p,.15,.35)});
  s+=fade(seg(p,.2,.3),label('kv',A.X(10.4),A.Y(5.2)+34,{size:26,color:CF,weight:700})+label('cv²',A.X(6.6),A.Y(8.5),{size:28,color:CF,weight:700}));
  s+=fade(seg(p,.3,.4),dot(A.X(4),A.Y(2),9,CH)+label('v∞ ＝ 4',A.X(4)+12,A.Y(2)+34,{size:24,color:CH,weight:700})+line(A.X(4),A.Y(0),A.X(4),A.Y(2),{color:CH,w:2,dash:'5 5'}));
  s+=card(790,92,390,250,T('mg=c\\,v_\\infty^{\\,2}',985,150,34)+fade(seg(p,b,b+.08),T('c=\\dfrac{mg}{v_\\infty^{\\,2}}=\\dfrac{2}{16}',985,230,36))+fade(seg(p,b+.15,b+.25),T('=0.125\\ \\mathrm{kg/m}',985,305,32,{color:CF})),1,CF);
  return s+goalTag(G3);
 },
 // 15. v＝10 の縦線で、直線の高さ 5 N と放物線の高さ 12.5 N に印
 [K+'r10']:(p,ctx)=>{
  const W2=sentWin(ctx),A=rv();
  let s=A.svg+line(A.X(0),A.Y(2),A.X(11),A.Y(2),{color:CF,w:2,dash:'6 6'})+A.plot(v=>.5*v,{color:CF,w:3})+A.plot(v=>Math.min(14.5,.125*v*v),{to:10.7,color:CF,w:6});
  s+=label('kv',A.X(10.4),A.Y(5.2)+34,{size:26,color:CF,weight:700})+label('cv²',A.X(6.6),A.Y(8.5),{size:28,color:CF,weight:700})+dot(A.X(4),A.Y(2),8,CH);
  s+=fade(seg(p,.05,.15),line(A.X(10),A.Y(0),A.X(10),A.Y(13.5),{color:CV,w:3,dash:'6 6'})+label('v ＝ 10',A.X(10),A.Y(0)-14,{size:24,color:CV,anchor:'middle',weight:700}));
  s+=fade(seg(p,.2,.3),dot(A.X(10),A.Y(5),9,CH)+label('5 N',A.X(10)-14,A.Y(5)+8,{size:26,color:CH,anchor:'end',weight:700}));
  s+=fade(seg(p,.55,.65),dot(A.X(10),A.Y(12.5),9,CH)+label('12.5 N',A.X(10)-14,A.Y(12.5)+8,{size:26,color:CH,anchor:'end',weight:700}));
  s+=card(790,92,390,250,label('v ＝ 10 の 抵抗',985,140,{size:26,color:C.dim,anchor:'middle'})+fade(seg(p,.2,.3),T('kv=0.5\\times10=5\\ \\mathrm{N}',985,210,28))+fade(seg(p,.55,.65),T('cv^2=0.125\\times100=12.5\\ \\mathrm{N}',985,290,26)),1,CF);
  return s+goalTag(G3);
 },
 // 16. 2本の v–t 曲線の出だしの傾きを比べる（cv² の方が急）。答えの札 A
 [K+'ans3']:(p,ctx)=>{
  const W2=sentWin(ctx),b=W2[1]?W2[1][0]:.75,A=gr({x:640,w:440,xmax:.8,xt:[.2,.4,.6],yt:[2,4,6,8,10]});
  let s=card(20,92,580,400,label('加速度 ＝ （重力 − 抵抗）÷ m',310,140,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.05,.15),label('kv',80,225,{size:28,color:CF,weight:700})+T(`\\dfrac{2-5}{0.2}={\\color{${CA}}-15}`,340,220,34))
   +fade(seg(p,.3,.4),label('cv²',80,345,{size:28,color:CF,weight:700})+T(`\\dfrac{2-12.5}{0.2}={\\color{${CA}}-52.5}`,340,340,34))
   +fade(seg(p,.45,.55),label('単位 m/s²',310,440,{size:24,color:C.dim,anchor:'middle'})),1);
  s+=A.svg+line(A.X(0),A.Y(4),A.X(.8),A.Y(4),{color:CH,w:3,dash:'10 7'})+start(A);
  s+=A.plot(vk,{to:.8,color:CV,w:4,p:seg(p,.1,.3)})+A.plot(vc,{to:.8,color:CV,w:6,p:seg(p,.35,.55)});
  s+=fade(seg(p,.15,.25),line(A.X(0),A.Y(10),A.X(.4),A.Y(4),{color:CA,w:2.5,dash:'6 6'}))+fade(seg(p,.4,.5),line(A.X(0),A.Y(10),A.X(6/52.5),A.Y(4),{color:CA,w:2.5,dash:'6 6'}));
  s+=fade(seg(p,.3,.4),label('kv',A.X(.5),A.Y(vk(.5))-14,{size:24,color:CV,weight:700}))+fade(seg(p,.55,.6),label('cv²（急）',A.X(.2)+6,A.Y(4)+34,{size:24,color:CV,weight:700}));
  return s+goalTag(G3)+ANS3(seg(p,b+.02,b+.1));
 },
 // 17. 誤答 B・C（文1を半分ずつ）→ D（文2）
 [K+'wrong3']:(p,ctx)=>{
  const W2=sentWin(ctx),e=W2[0][1],s2=W2[1]?W2[1][0]:e;
  let s=card(20,92,580,190,label('正しい 組',310,135,{size:24,color:C.dim,anchor:'middle'})+T(`kv:{\\color{${CA}}-15},\\quad cv^2:{\\color{${CA}}-52.5}`,310,210,32),1,CH);
  s+=wrongSeq(p,ctx,[['B','−15、−15','どの速さでも抵抗が同じとした'],['C','−15、−12.5','c×(10−4)²＝4.5 N とした',{mid:'0.125\\times(10-4)^2=4.5'}],['D','−25、−62.5','重力 2 N を入れていない',{mid:'-5\\div0.2,\\ -12.5\\div0.2'}]],{win:[[0,e*.5],[e*.5,s2],[s2,1]],opts:{...WOPT,x:620,w:560,y:120}});
  return s+goalTag(G3)+ANS3(1);
 },
 // 18. v∞ の左右で、直線と放物線の上下が入れかわる所を黄で
 [K+'cross']:(p,ctx)=>{
  const W2=sentWin(ctx),b=W2[1]?W2[1][0]:.5,A=rv();
  let s=A.svg+A.plot(v=>.5*v,{color:CF,w:3})+A.plot(v=>Math.min(14.5,.125*v*v),{to:10.7,color:CF,w:6});
  s+=label('kv',A.X(10.4),A.Y(5.2)+34,{size:26,color:CF,weight:700})+label('cv²',A.X(6.6),A.Y(8.5),{size:28,color:CF,weight:700});
  s+=line(A.X(4),A.Y(0),A.X(4),A.Y(13.5),{color:CH,w:3,dash:'8 6'})+label('v∞ ＝ 4',A.X(4),A.Y(13.5)-10,{size:24,color:CH,anchor:'middle',weight:700})+dot(A.X(4),A.Y(2),9,CH);
  s+=fade(seg(p,.05,.15),rect(A.X(0)+4,A.Y(3.5),A.X(4)-A.X(0)-8,A.Y(0)-A.Y(3.5)-4,{fill:CH,fo:.08,stroke:CH,sw:2,rx:8})+label('遅い側：cv² ＜ kv',A.X(0)+12,A.Y(5),{size:24,color:CH,weight:700}));
  s+=fade(seg(p,.25,.35),label('速い側：cv² ＞ kv',A.X(8),A.Y(2.2),{size:24,color:CH,anchor:'middle',weight:700}));
  s+=card(790,120,390,230,label('終端より 速いと',985,175,{size:28,color:C.ink,anchor:'middle',weight:700})+label('2乗の モデルの 方が',985,235,{size:28,color:CF,anchor:'middle',weight:700})+label('強く ブレーキ',985,295,{size:30,color:CA,anchor:'middle',weight:700}),seg(p,b,b+.08),CA);
  return s;
 },

 // ===================== まとめ =====================
 // 19. 手順の帯（モデル → 力 → ma＝F → 初期条件 → 解 → 確かめ）。右上に答えの札3枚
 [K+'sum']:(p)=>{
  const steps=['モデル','力','ma ＝ F','初期条件','解','確かめ'],bw=160,gap=34,x0=600-(6*bw+5*gap)/2,y=200;
  let s='';
  steps.forEach((t,i)=>{const x=x0+i*(bw+gap),g=seg(p,.05+i*.08,.12+i*.08);
   s+=card(x,y,bw,100,label(t,x+bw/2,y+60,{size:28,color:i===0?CF:C.ink,anchor:'middle',weight:700}),g,i===0?CF:C.faint);
   if(i)s+=fade(g,arrow(x-gap+4,y+50,x-4,y+50,{color:C.dim,w:3,head:10}));});
  s+=fade(seg(p,.55,.65),label('同じ 手順で 解く',600,380,{size:32,color:CH,anchor:'middle',weight:700}));
  return s+answerRow([[1,'D',''],[2,'A','約 0.28 s'],[3,'A','−15、−52.5']],{g:seg(p,.7,.8)});
 },
};

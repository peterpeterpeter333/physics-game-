// 問題編 解説「9 V・2 MΩ・3 μF と、0.4 H のコイル」（q-ui-circuit-time、大学編 28 過渡現象・初級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/28_過渡現象.md の q-ui-circuit-time（解説 20 行）。
// 色（正本・単元動画と同じ）：電圧 V 紫、電荷 q 桃、電流 I 緑、時間 t 金、容量 C 黄、変化率 dI/dt 赤、R・L 白、強調 黄。
// 回路の向きと部品は 回路の時間変化・初級（yt1-ui-circuit-time-1）と同じ配置。電池・抵抗の記号は 過渡現象・中級の図から import（あちらは編集しない）。
// 札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 軸の目盛り数字は 22px 以上（anim.mjs の axes の目盛り 21px は使わず、自前で描く）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,axes,tex,texWidth,poly} from './anim.mjs';
import {QC,card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,cueT,sentWin,voiceEnd,textW} from './yt1-qx-common.mjs';
import {battery,zig} from './yt1-um-circuit-time-1-diagrams.mjs';

const K='qx-ui-circuit-time:';
const VC=QC.V,QQ=QC.q,IC=QC.I,TC=QC.t,CC=C.hi,DC=C.a,BAD='#ff6b6b';
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const q_=cs(QQ,'q'),I_=cs(IC,'I'),C_=cs(CC,'C'),V_=cs(VC,'V'),t_=cs(TC,'t');
const DIDT=`\\dfrac{d${I_}}{d${t_}}`;
const G1='その瞬間の電流 I',G2='行き先の電荷',G3='コイルの電圧（増やす間／保ったあと）';
const ANS1=g=>answerTag(1,'C','2.5 μA',{g}),ANS2=g=>answerTag(2,'A','27 μC',{g}),ANS3=g=>answerTag(3,'B','2.4 V、0 V',{g});
const f1=v=>String(Number(v.toFixed(1)));
// ナレーションの読みの中で、語 word が読まれる所（cue の進み 0〜1）
function atWord(ctx,word,def){
 const r=(ctx?.cue?.reading??'').replace(/\s/g,''),i=r.indexOf(word.replace(/\s/g,''));
 return i<0||!r.length?def:i/r.length*voiceEnd(ctx);
}
const pill=(t,x,y,color,{size=24,g=1,fill='#131f38'}={})=>{const w=textW(t,size)+24,h=size+16;
 return fade(g,rect(x-w/2,y-h/2,w,h,{fill,fo:.96,stroke:color,sw:2.5,rx:h/2})+label(t,x,y+size*.36,{size,color,anchor:'middle',weight:700}));};

// ---- 自前の軸（目盛り数字 22px 以上）----------------------------------------------------------------
function ax({x,y,w,h,xmax,ymax,xt=[],yt=[],xl='',yl='',xc=C.dim,yc=C.dim,g=1,size=22}){
 const A=axes({x,y,w,h,xmax,ymax,g,xcolor:xc,ycolor:yc});
 let s=A.svg;
 s+=fade(g,xt.map(([u,t])=>line(A.X(u),y-6,A.X(u),y+6,{color:C.dim})+label(t,A.X(u),y+32,{size,color:xc,anchor:'middle'})).join('')
  +yt.map(([v,t])=>line(x-6,A.Y(v),x+6,A.Y(v),{color:C.dim})+label(t,x-12,A.Y(v)+8,{size,color:yc,anchor:'end'})).join(''));
 s+=fade(g,label(xl,x+w+40,y+8,{size:24,color:xc})+label(yl,x,y-h-42,{size:24,color:yc,anchor:'middle',weight:700}));
 return {...A,svg:s};
}

// ---- RC 回路（前半）--------------------------------------------------------------------------------
// 電池（長い線＝＋極が左）→ 下の導線を左へ → 左の辺を上へ → 抵抗 → コンデンサ → 右の辺を下へ → 電池の −極。
const CLx=50,CRx=470,CTy=180,CBy=420,SWA=95,SWB=155,BX=290,RA=110,RB=250,PL=338,PR=372;
function circuit({dr=1,sw=1,g=1,sym=0,vals=1,Iarr=0,qLab=0,hiR=0,hiC=0}={}){
 const W=(pts,a,b)=>draw(pts,seg(dr,a,b),{color:C.dim,w:4});
 let s='';
 s+=W([[SWA,CBy],[CLx,CBy],[CLx,CTy],[RA,CTy]],0,.35)+W([[RB,CTy],[PL,CTy]],.3,.5)+W([[PR+8,CTy],[CRx,CTy],[CRx,CBy],[BX+10,CBy]],.45,.85)+W([[BX-10,CBy],[SWB,CBy]],.8,1);
 const gc=seg(dr,.5,1);
 s+=fade(gc,zig(RA,RB,CTy)+rect(PL,CTy-45,8,90,{fill:CC,fo:.9,stroke:CC,sw:1,rx:2})+rect(PR,CTy-45,8,90,{fill:CC,fo:.9,stroke:CC,sw:1,rx:2})
  +battery(BX,CBy,{text:''})+label(sym?'V₀＝9 V':'9 V',BX,CBy+64,{size:26,color:VC,anchor:'middle',weight:700}));
 const ang=mix(-0.55,0,clamp(sw)),L=SWB-SWA;
 s+=fade(gc,dot(SWA,CBy,6,C.ink)+dot(SWB,CBy,6,C.ink)+line(SWA,CBy,SWA+L*Math.cos(ang),CBy+L*Math.sin(ang),{color:C.ink,w:4})
  +label('スイッチ',(SWA+SWB)/2,CBy+44,{size:22,color:C.dim,anchor:'middle'}));
 s+=fade(gc*vals,label(sym?'R＝2 MΩ':'2 MΩ',(RA+RB)/2,CTy-34,{size:26,color:C.ink,anchor:'middle',weight:700})
  +label(sym?'C＝3 μF':'3 μF',(PL+PR+8)/2,CTy-56,{size:26,color:CC,anchor:'middle',weight:700}));
 if(hiR)s+=highlight(RA-12,CTy-26,RB-RA+24,52,hiR,IC);
 if(hiC)s+=highlight(PL-16,CTy-52,PR-PL+40,104,hiC,QQ);
 if(Iarr)s+=fade(Iarr,arrow(CLx,330,CLx,250,{color:IC,w:5,head:16})+label('I＝電流',CLx+16,262,{size:24,color:IC,weight:700}));
 if(qLab)s+=fade(qLab,label('q＝たまった電荷',(PL+PR+8)/2,CTy+80,{size:24,color:QQ,anchor:'middle',weight:700}));
 return fade(g,s);
}
// 回路を一周する点線の矢印（回路の中、時計回り＝電流の向き）
function loopArrow(g=1,{cx=230,cy=330,r=44}={}){
 if(g<=0)return '';
 const n=40,a0=-Math.PI*.95,a1=a0+Math.PI*1.75*g,pts=Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy+r*Math.sin(a)];});
 let s=draw(pts,1,{color:C.hi,w:3.5,dash:'7 7'});
 const [x1,y1]=pts[n-2],[x2,y2]=pts[n];s+=arrow(x1,y1,x2,y2,{color:C.hi,w:3.5,head:14});
 return s;
}
// 9 V の棒（紫の枠）。下がコンデンサの分（桃）、上が抵抗の分（緑）
function bar(vc,{x=510,base=450,k=30,w=56,g=1,fc=1,fr=1,nums=1,words=1}={}){
 const top=base-9*k,yc=base-vc*k,hc=(base-yc)*fc;
 let s=rect(x,top,w,9*k,{fill:'none',fo:0,stroke:VC,sw:3,rx:4})+label('9 V',x+w/2,top-14,{size:26,color:VC,anchor:'middle',weight:700});
 if(fc>0)s+=rect(x+3,base-hc,w-6,hc,{fill:QQ,fo:.75,stroke:'none',rx:2});
 s+=fade(fr,rect(x+3,top,w-6,yc-top,{fill:IC,fo:.6,stroke:'none',rx:2}));
 const lx=x+w+12;
 if(words&&base-yc>=34)s+=fade(fc,label(nums?`コンデンサ ${f1(vc)} V`:'コンデンサ',lx,(base+yc)/2+8,{size:24,color:QQ,weight:700}));
 if(words&&yc-top>=34)s+=fade(fr,label(nums?`抵抗 ${f1(9-vc)} V`:'抵抗',lx,(top+yc)/2+8,{size:24,color:IC,weight:700}));
 return fade(g,s);
}
// 電流計（0〜5 μA の半円）。I は μA
function meter(I,{cx=980,cy=440,r=100,g=1,num='',title='電流計'}={}){
 let s=draw(Array.from({length:41},(_,i)=>{const a=Math.PI*(1-i/40);return [cx+r*Math.cos(a),cy-r*Math.sin(a)];}),1,{color:C.dim,w:4});
 s+=line(cx-r-10,cy,cx+r+10,cy,{color:C.faint,w:2});
 for(let v=0;v<=5;v++){const a=Math.PI*(1-v/5),c=Math.cos(a),sn=Math.sin(a);
  s+=line(cx+(r-12)*c,cy-(r-12)*sn,cx+r*c,cy-r*sn,{color:C.dim,w:3})+label(String(v),cx+(r+24)*c,cy-(r+24)*sn+8,{size:22,color:C.dim,anchor:'middle'});}
 const a=Math.PI*(1-clamp(I/5));
 s+=line(cx,cy,cx+(r-18)*Math.cos(a),cy-(r-18)*Math.sin(a),{color:IC,w:5})+dot(cx,cy,8,IC);
 if(title)s+=label(title,cx,cy-r-48,{size:24,color:C.dim,anchor:'middle'});
 s+=label('μA',cx+r-6,cy+34,{size:22,color:C.dim,anchor:'middle'});
 if(num)s+=label(num,cx-20,cy+40,{size:28,color:IC,anchor:'middle',weight:700});
 return fade(g,s);
}
// q–t グラフ（q＝27(1−e^(−t/6)) μC。t は s。目盛りの秒は出さない）
const qt=t=>27*(1-Math.exp(-t/6)),T12=6*Math.log(27/15);
function qGraph({x=90,y=460,w=440,h=310,to=T12,g=1,t27=0,line27=0,dotAt=null,tan=0}={}){
 const A=ax({x,y,w,h,xmax:36,ymax:30,yt:[[12,'12'],...(t27?[[27,'27']]:[])],xl:'t',yl:'電荷 q [μC]',xc:TC,yc:QQ,g});
 let s=A.svg;
 s+=fade(line27,line(A.X(0),A.Y(27),A.X(36),A.Y(27),{color:QQ,w:2.5,dash:'10 8'})+label('27 μC',A.X(36),A.Y(27)-14,{size:24,color:QQ,anchor:'end',weight:700}));
 s+=fade(g,A.plot(qt,{from:0,to:Math.max(.01,to),color:QQ,w:5}));
 if(tan){const a=T12-3,b=T12+3.5,sl=2.5;
  s+=fade(tan,line(A.X(a),A.Y(12+sl*(a-T12)),A.X(b),A.Y(12+sl*(b-T12)),{color:IC,w:4})+dot(A.X(T12),A.Y(12),8,QQ)
   +line(A.X(0),A.Y(12),A.X(T12),A.Y(12),{color:QQ,w:2,dash:'5 6'})
   +pill('傾き＝電流',A.X(b)+70,A.Y(12+sl*(b-T12))+6,IC));}
 if(dotAt!=null)s+=dot(A.X(dotAt),A.Y(qt(dotAt)),9,QQ);
 return {A,svg:s};
}

// ---- コイルと I–t グラフ（後半）--------------------------------------------------------------------
function coil(x1,x2,y,{n=5,color=C.ink,w=4,g=1,lab='L＝0.4 H',lsize=26}={}){
 const d=(x2-x1)/n;let p=`<path d="M${x1-30} ${y} L${x1} ${y}`;for(let i=0;i<n;i++)p+=` a${d/2} ${d*.75} 0 0 1 ${d} 0`;
 p+=` L${x2+30} ${y}" fill="none" stroke="${color}" stroke-width="${w}"/>`;
 return fade(g,p+(lab?label(lab,(x1+x2)/2,y+50,{size:lsize,color:C.ink,anchor:'middle',weight:700}):''));
}
const It=t=>t<.5?6*t:3;
function iGraph({x=100,y=310,w=470,h=150,g=1,to=1.5,tri=0,triTxt=0,flatHi=0,sz=22}={}){
 const A=ax({x,y,w,h,xmax:1.5,ymax:3.6,xt:[[.5,'0.5'],[1,'1.0']],yt:[[3,'3']],xl:'t [s]',yl:'電流 I [A]',xc:TC,yc:IC,g,size:sz});
 let s=A.svg+fade(g,A.plot(It,{from:0,to,color:IC,w:5,steps:150}));
 s+=fade(g*.8,line(A.X(0),A.Y(3),A.X(.5),A.Y(3),{color:C.faint,w:2,dash:'5 6'}));
 if(tri){const x0=A.X(0),x1=A.X(.5),y0=A.Y(0),y1=A.Y(3);
  s+=fade(tri,poly([[x0+4,y0],[x1,y0],[x1,y1]],{fill:DC,fo:.12})+line(x1,y0,x1,y1,{color:IC,w:3,dash:'6 5'})+line(x0,y0-2,x1,y0-2,{color:TC,w:3}));
  s+=fade(triTxt,label('3 A',x1+10,(y0+y1)/2+8,{size:24,color:IC,weight:700})+label('0.5 s',(x0+x1)/2+10,y0-12,{size:24,color:TC,anchor:'middle',weight:700}));}
 if(flatHi)s+=fade(flatHi,line(A.X(.5),A.Y(3),A.X(1.5),A.Y(3),{color:C.hi,w:10,opacity:.55})+highlight(A.X(.5)-6,A.Y(3)-24,A.X(1.5)-A.X(.5)+12,48,1,C.hi));
 return {A,svg:s};
}
// コイルの電圧の棒（I–t グラフの下、同じ時間の目盛り）
function vBars({x=100,y=490,w=470,h=100,g=1,r1=0,r2=0,n1=0,n2=0}={}){
 const A=ax({x,y,w,h,xmax:1.5,ymax:3,yt:n1?[[2.4,'2.4']]:[],xl:'',yl:'',g});
 let s=A.svg+fade(g,label('コイルの電圧 [V]',x+12,y-h-12,{size:24,color:VC,weight:700}));
 const hb=A.Y(0)-A.Y(2.4);
 s+=fade(r1,rect(A.X(0)+6,A.Y(0)-hb*r1,A.X(.5)-A.X(0)-12,hb*r1,{fill:VC,fo:.65,stroke:VC,sw:2,rx:3}));
 s+=fade(n1,label('2.4 V',(A.X(0)+A.X(.5))/2,A.Y(1.2)+9,{size:24,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(r2,line(A.X(.5)+6,A.Y(0)-2,A.X(1.5)-6,A.Y(0)-2,{color:VC,w:6}));
 s+=fade(n2,label('0 V',(A.X(.5)+A.X(1.5))/2,A.Y(0)-16,{size:24,color:VC,anchor:'middle',weight:700}));
 return s;
}
// 右の枠（後半）
const PX=680,PW=510,PC=PX+PW/2;
const coilTop=(g=1)=>coil(870,1000,130,{g,lab:'L＝0.4 H'});

// ---- 前半の右の枠（式）------------------------------------------------------------------------------
const QX1=770,QW1=420,QC1=QX1+QW1/2;
const LOOPEQ=`${cs(VC,'9')}=R${I_}+\\dfrac{${q_}}{${C_}}`;

export const ytQxUiCircuitTimeDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（6 s）：0〜3 s 回路が線で描かれ、スイッチが閉じ、札「12 μC になった瞬間」。3〜6 s 右にコイルと I–t グラフ（坂と平ら）。静止。
 [K+'q1']:(p)=>{
  let s=circuit({dr:seg(p,0,.32),sw:seg(p,.36,.42)});
  s+=pill('12 μC になった瞬間',300,300,QQ,{g:seg(p,.42,.5)});
  s+=coil(700,830,120,{g:seg(p,.5,.6)});
  const it=iGraph({x:660,y:440,w:430,h:200,g:seg(p,.56,.66),to:1.5*seg(p,.66,.95)});
  s+=it.svg;
  return s;
 },
 // 小問2（2 s）：同じ図。コンデンサの横の札を「十分に時間がたったとき」（金）に替える。電荷の値・グラフは出さない。
 [K+'q2']:(p)=>{
  let s=circuit({dr:1,sw:1});
  s+=pill('十分に時間がたったとき',300,300,TC,{g:seg(p,.2,.6)});
  s+=coil(700,830,120)+iGraph({x:660,y:440,w:430,h:200}).svg;
  return s;
 },
 // 小問3（2 s）：後半の図（コイルと I–t グラフ）を強調し、前半の回路図を 30% に薄くする。
 [K+'q3']:(p)=>{
  const d=seg(p,.1,.6);
  let s=fade(mix(1,.3,d),circuit({dr:1,sw:1}));
  s+=coil(700,830,120)+iGraph({x:660,y:440,w:430,h:200}).svg;
  s+=fade(d,rect(600,70,590,435,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:14}));
  return s;
 },

 // ===================== 小問1 =====================
 // 1. 回路図と札「12 μC」。求めるもの
 [K+'goal1']:(p)=>circuit({dr:seg(p,0,.3),sw:seg(p,.3,.4)})+pill('12 μC',(PL+PR+8)/2,CTy+130,QQ,{g:seg(p,.4,.5)})+goalTag(G1,{g:seg(p,.03,.15)}),
 // 2. 9 V の棒・一周の矢印。部品に R＝・C＝・I＝電流・q＝たまった電荷。そのあと式 9＝RI＋q/C
 [K+'loop']:(p)=>{
  let s=circuit({sym:1,Iarr:seg(p,.22,.32),qLab:seg(p,.3,.4)})+pill('12 μC',(PL+PR+8)/2,CTy+130,QQ);
  s+=fade(seg(p,.02,.12),loopArrow(seg(p,.02,.2)));
  s+=bar(4,{fc:0,fr:0,g:seg(p,.08,.18)});
  s+=card(QX1,90,QW1,300,label('一周で 電位は 元に 戻る',QC1,140,{size:26,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.5,.62),T(LOOPEQ,QC1,250,46))
   +fade(seg(p,.62,.74),label('抵抗の 電圧 ＋ コンデンサの 電圧',QC1,345,{size:22,color:C.dim,anchor:'middle'})),seg(p,.05,.15),C.hi);
  return s+goalTag(G1);
 },
 // 3. q/C＝12÷3＝4 V を桃、残り 5 V を緑で塗る
 [K+'split']:(p)=>{
  const a=seg(p,.25,.4),b=seg(p,.55,.7);
  let s=circuit({sym:1,Iarr:1,qLab:1,hiC:a*(1-b),hiR:b})+pill('12 μC',(PL+PR+8)/2,CTy+130,QQ);
  s+=bar(4,{fc:a,fr:b});
  s+=card(QX1,90,QW1,410,T(LOOPEQ,QC1,150,34)
   +fade(seg(p,.1,.25),T(`\\dfrac{${q_}}{${C_}}=\\dfrac{12}{3}=${cs(QQ,'4\\,\\mathrm{V}')}`,QC1,255,38))
   +fade(seg(p,.5,.62),T(`${cs(VC,'9')}-${cs(QQ,'4')}=${cs(IC,'5\\,\\mathrm{V}')}`,QC1,370,38))
   +fade(seg(p,.62,.72),label('抵抗に かかる',QC1,445,{size:24,color:IC,anchor:'middle',weight:700})),1);
  return s+goalTag(G1);
 },
 // 4. 5÷(2×10⁶)＝2.5×10⁻⁶ A。電流計の針が 2.5 μA。答えの札（①式 → ②結果と電流計）
 [K+'ans1']:(p,ctx)=>{
  const b=atWord(ctx,'しょうもん',.6),cut1=seg(p,b-.2,b-.15),cut2=seg(p,b-.15,b-.1);
  let s=fade(mix(1,.35,seg(p,.02,.1)),circuit({sym:1,Iarr:1,qLab:1,hiR:1})+pill('12 μC',(PL+PR+8)/2,CTy+130,QQ)+bar(4));
  let inner=fade(1-cut1,T(`${I_}=\\dfrac{${cs(IC,'5')}}{2\\times10^{6}}`,QC1,170,40)
   +fade(seg(p,.2,.32),T(`=2.5\\times10^{-6}\\,\\mathrm{A}`,QC1,290,38)));
  inner+=fade(cut2,T(`${I_}=2.5\\times10^{-6}\\,\\mathrm{A}`,QC1,150,34)+meter(2.5*seg(p,b-.1,b+.05),{cx:QC1,cy:420,r:100,num:seg(p,b,b+.05)>.5?'2.5':''}));
  s+=card(QX1,90,QW1,410,inner,1);
  return s+goalTag(G1)+ANS1(seg(p,b,b+.08));
 },
 // 5. 誤答 A（カード1枚）。電流計の針は 2.5 のまま
 [K+'wrongA']:(p)=>{
  let s=circuit({sym:1,Iarr:1,qLab:1})+pill('12 μC',(PL+PR+8)/2,CTy+130,QQ)+bar(4);
  s+=meter(2.5,{cx:QC1,cy:450,r:90,num:'2.5'});
  s+=wrongCard('A','4.5 μA',['9 V 全部を抵抗に','（入れた瞬間の値）'],{x:QX1,w:QW1,y:92,size:26,whySize:24,g:seg(p,.03,.1)});
  return s+goalTag(G1)+ANS1(1);
 },
 // 6. q–t グラフと 12 μC の点の接線「傾き＝電流」。誤答 B → D（1枚ずつ）
 [K+'wrongBD']:(p,ctx)=>{
  const W=sentWin(ctx);
  let s=qGraph({tan:seg(p,.05,.18)}).svg;
  s+=wrongSeq(p,ctx,[['B','2 μA','4 V（コンデンサの分）を抵抗で割った'],['D','0 μA',['電荷の値と、','傾き（電流）を混同']]],{opts:{x:640,w:550,y:200,size:28,whySize:24}});
  return s+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 // 7. 誤答カード・札「12 μC」・電流計の数値を消す。棒・針・グラフは 12 μC の状態のまま
 [K+'goal2']:(p)=>{
  let s=qGraph({dotAt:T12}).svg;
  s+=bar(4,{x:640,base:460,nums:0,g:seg(p,.02,.12)});
  s+=meter(2.5,{cx:1060,cy:440,r:90,g:seg(p,.02,.12)});
  return s+goalTag(G2,{g:seg(p,.03,.15)});
 },
 // 8. 時間がたつ：棒が桃へ、グラフが寝ていき、針が 0 へ
 [K+'approach']:(p)=>{
  const u=seg(p,.05,.85),t=mix(T12,30,u*u*.4+u*.6),q=qt(t),I=(9-q/3)/2;
  let s=qGraph({to:t,dotAt:t}).svg;
  s+=bar(q/3,{x:640,base:460,nums:0});
  s+=meter(I,{cx:1060,cy:440,r:90});
  return s+goalTag(G2);
 },
 // 9. 行き先：棒が全部桃「9 V」、点線「27 μC」。q∞＝CV₀＝3 μF×9 V＝27 μC
 [K+'final']:(p,ctx)=>{
  const b=atWord(ctx,'でんかは',.4);
  let s=qGraph({to:30,dotAt:30,t27:seg(p,b+.1,b+.2)>.5,line27:seg(p,b+.1,b+.2)}).svg;
  s+=bar(9,{x:640,base:460,nums:0,words:0});
  s+=fade(seg(p,.05,.15),label('コンデンサ 9 V',708,330,{size:24,color:QQ,weight:700}));
  s+=card(890,140,300,330,T(`${cs(QQ,'q_\\infty')}=${C_}${cs(VC,'V_0')}`,1040,200,36)
   +fade(seg(p,b,b+.08),T(`=3\\,\\mu\\mathrm{F}\\times${cs(VC,'9\\,\\mathrm{V}')}`,1040,300,30))
   +fade(seg(p,b+.12,b+.2),T(`=${cs(QQ,'27\\,\\mu\\mathrm{C}')}`,1040,400,36)),seg(p,b-.05,b+.03));
  return s+goalTag(G2);
 },
 // 10. 小問2 の答え A
 [K+'ans2']:(p)=>{
  let s=qGraph({to:30,dotAt:30,t27:1,line27:1}).svg;
  s+=bar(9,{x:640,base:460,nums:0,words:0})+label('コンデンサ 9 V',708,330,{size:24,color:QQ,weight:700});
  s+=card(890,140,300,330,T(`${cs(QQ,'q_\\infty')}=${C_}${cs(VC,'V_0')}`,1040,200,36)+T(`=3\\,\\mu\\mathrm{F}\\times${cs(VC,'9\\,\\mathrm{V}')}`,1040,300,30)+T(`=${cs(QQ,'27\\,\\mu\\mathrm{C}')}`,1040,400,36),1);
  return s+goalTag(G2)+ANS2(seg(p,.05,.15));
 },
 // 11. 誤答 B → D（1枚ずつ）
 [K+'wrongBD2']:(p,ctx)=>{
  let s=qGraph({to:30,dotAt:30,t27:1,line27:1}).svg;
  s+=wrongSeq(p,ctx,[['B','3 μC','容量 3 μF をそのまま電荷にした'],['D','13.5 μC','4.5 V（半分）で止まるとした']],{opts:{x:640,w:550,y:200,size:28,whySize:24}});
  return s+goalTag(G2)+ANS2(1);
 },
 // 12. 曲線が点線に近づき、追い越さない。誤答 C
 [K+'wrongC2']:(p)=>{
  const t=mix(30,36,seg(p,.05,.7));
  const {A,svg}=qGraph({to:t,dotAt:t,t27:1,line27:1});
  let s=svg+fade(seg(p,.3,.45),highlight(A.X(22),A.Y(27)-8,A.X(36)-A.X(22)+14,34,1,C.hi));
  s+=wrongCard('C','限りなく増える',['増える速さが 0 に近づき、','27 μC に近づく'],{x:640,w:550,y:200,size:28,whySize:24,g:seg(p,.03,.1)});
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 // 13. コイルと I–t グラフ
 [K+'goal3']:(p)=>{
  let s=iGraph({g:seg(p,.02,.15),to:1.5*seg(p,.1,.5)}).svg;
  s+=coilTop(seg(p,.05,.2));
  return s+goalTag(G3,{g:seg(p,.03,.15)});
 },
 // 14. 法則 V＝L dI/dt。dI/dt を赤で囲む。坂に傾きの三角形
 [K+'law']:(p,ctx)=>{
  const b=atWord(ctx,'でんりゅうの',.5);
  let s=iGraph({tri:seg(p,b,b+.12)}).svg+coilTop();
  const e=`${V_}=L\\,${cs(DC,'\\dfrac{dI}{dt}')}`,w=texWidth(e,48,false),wd=texWidth(cs(DC,'\\dfrac{dI}{dt}'),48,false);
  s+=card(PX,190,PW,300,kindTag('法則',PX+70,236,{g:seg(p,.03,.1)})+fade(seg(p,.05,.15),T(e,PC,320,48))
   +fade(seg(p,.2,.3),rect(PC+w/2-wd+2,268,wd+8,108,{fill:'none',fo:0,stroke:DC,sw:3,rx:8}))
   +fade(seg(p,b,b+.1),label('高さ では なく、傾き を 読む',PC,440,{size:26,color:C.hi,anchor:'middle',weight:700})),1);
  return s+goalTag(G3);
 },
 // 15. 3÷0.5＝6 A/s、0.4×6＝2.4 V。電圧の棒（坂の区間 2.4 V）
 [K+'ramp']:(p,ctx)=>{
  const b=atWord(ctx,'でんあつは',.5);
  let s=iGraph({tri:1,triTxt:seg(p,.05,.15)}).svg+coilTop();
  s+=vBars({g:seg(p,.02,.1),r1:seg(p,b,b+.15),n1:seg(p,b+.12,b+.2)});
  s+=card(PX,190,PW,300,label('坂の 区間（0〜0.5 s）',PC,232,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.12,.25),T(`${cs(DC,'\\dfrac{dI}{dt}')}=\\dfrac{${cs(IC,'3')}}{${cs(TC,'0.5')}}=${cs(DC,'6\\,\\mathrm{A/s}')}`,PC,310,36))
   +fade(seg(p,b,b+.12),T(`${V_}=0.4\\times${cs(DC,'6')}=${cs(VC,'2.4\\,\\mathrm{V}')}`,PC,430,36)),1);
  return s+goalTag(G3);
 },
 // 16. 平らな区間を黄で光らせ、その下の電圧 0
 [K+'flat']:(p,ctx)=>{
  const b=atWord(ctx,'さんアンペアが',.4);
  let s=iGraph({tri:.35,triTxt:.35,flatHi:seg(p,.05,.15)}).svg+coilTop();
  s+=vBars({r1:1,n1:1,r2:seg(p,b,b+.12),n2:seg(p,b+.1,b+.18)});
  s+=card(PX,190,PW,300,label('平らな 区間（0.5 s〜）',PC,232,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.12,.25),T(`${cs(DC,'\\dfrac{dI}{dt}')}=0`,PC,310,40))
   +fade(seg(p,b,b+.12),T(`${V_}=0.4\\times0=${cs(VC,'0\\,\\mathrm{V}')}`,PC,430,36)),1,C.hi);
  return s+goalTag(G3);
 },
 // 17. 小問3 の答え B
 [K+'ans3']:(p)=>{
  let s=iGraph({tri:.35,triTxt:.35}).svg+coilTop()+vBars({r1:1,n1:1,r2:1,n2:1});
  s+=card(PX,190,PW,300,label('坂の 区間',PC-120,250,{size:24,color:C.dim,anchor:'middle'})+label('平らな 区間',PC+120,250,{size:24,color:C.dim,anchor:'middle'})
   +label('2.4 V',PC-120,340,{size:40,color:VC,anchor:'middle',weight:700})+label('0 V',PC+120,340,{size:40,color:VC,anchor:'middle',weight:700})
   +label('電圧は 傾き で 決まる',PC,440,{size:26,color:C.hi,anchor:'middle',weight:700}),1);
  return s+goalTag(G3)+ANS3(seg(p,.05,.15));
 },
 // 18. 誤答 A（L×I。高さを読んだ。単位 Wb）
 [K+'wrongA3']:(p)=>{
  let s=iGraph({}).svg+coilTop()+vBars({r1:1,n1:1,r2:1,n2:1});
  s+=wrongCard('A','1.2 V、1.2 V',['L×I（高さを読んだ。単位 Wb）'],{x:PX,w:PW,y:220,size:28,whySize:24,mid:`0.4\\times${cs(IC,'3')}=1.2`,g:seg(p,.03,.1)});
  return s+goalTag(G3)+ANS3(1);
 },
 // 19. 誤答 C → D（1枚ずつ）
 [K+'wrongCD3']:(p,ctx)=>{
  let s=iGraph({}).svg+coilTop()+vBars({r1:1,n1:1,r2:1,n2:1});
  s+=wrongSeq(p,ctx,[['C','2.4 V、2.4 V','一定の電流でも電圧が要るとした'],['D','0.6 V、0 V','3×0.5＝1.5 を変化率にした',{mid:`0.4\\times(3\\times0.5)=0.6`}]],{opts:{x:PX,w:PW,y:220,size:28,whySize:24}});
  return s+goalTag(G3)+ANS3(1);
 },

 // ===================== まとめ =====================
 // 20. 3つの部品の表（抵抗 RI／コンデンサ q/C／コイル L dI/dt）。右上に答えの札3枚
 [K+'sum']:(p)=>{
  const x0=150,cw=[260,340,300],y0=110,rh=100;
  const xs=[x0,x0+cw[0],x0+cw[0]+cw[1]],tw=cw[0]+cw[1]+cw[2];
  let s=fade(seg(p,.02,.1),rect(x0,y0,tw,60,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:10})
   +label('部品',xs[0]+cw[0]/2,y0+40,{size:26,color:C.dim,anchor:'middle'})+label('読むもの',xs[1]+cw[1]/2,y0+40,{size:26,color:C.dim,anchor:'middle'})+label('電圧',xs[2]+cw[2]/2,y0+40,{size:26,color:C.dim,anchor:'middle'}));
  const rows=[['抵抗','電流の 高さ',`R${I_}`,IC],['コンデンサ','電荷',`\\dfrac{${q_}}{${C_}}`,QQ],['コイル','電流の 傾き',`L\\,${cs(DC,'\\dfrac{dI}{dt}')}`,DC]];
  rows.forEach(([a,b,e,col],i)=>{const y=y0+70+i*(rh+10),g=seg(p,.1+.12*i,.2+.12*i);
   s+=fade(g,rect(x0,y,tw,rh,{fill:'#131f38',fo:.96,stroke:col,sw:2,rx:12})+label(a,xs[0]+cw[0]/2,y+rh/2+10,{size:30,color:C.ink,anchor:'middle',weight:700})
    +label(b,xs[1]+cw[1]/2,y+rh/2+10,{size:30,color:col,anchor:'middle',weight:700})+T(e,xs[2]+cw[2]/2,y+rh/2+2,34));});
  s+=answerRow([[1,'C','2.5 μA'],[2,'A','27 μC'],[3,'B','2.4 V、0 V']],{g:seg(p,.6,.7),size:24,gap:8});
  return s;
 },
};

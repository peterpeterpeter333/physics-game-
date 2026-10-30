// 深掘りショート 08（ys-deep-08）「世界一正確な時計は、何を数えている？」— 図。縦長の舞台 1000×920（vert-v1）。
// 共通の形は yt1-sp-deep-common.mjs。値の検算は台本 docs/video-revision-20260924/ytseries/sp-deep-08.mjs の冒頭。
// 第3版。このファイルの中で作った形：予想のカード（cards）・カウントダウン（countdown）・難所の札（nansho）・セシウムの核と電子の磁石（csAtom）・二段のエネルギー（levelsFig）・原子の流れ（beamFig）・振動数とひとかたまり（quantaFig）・時計の文字盤（clockFace）・腕時計・太陽・地球（回る）・衛星・原子（atomIcon）・波（wave）・桁のそろった数字（digits）。
// 他の回の図ファイルには頼らない（06〜10 は同時に作っているため）。
import {C,seg,lin,clamp,mix,fade,label,line,rect,dot,ring,draw,arrow,poly,scaleAt} from './anim.mjs';
import {W,H,HC,LIGHT,WATER,SURF,cueT,voiceEnd,vseg,swin,sentWin,tag,note,plate,bigQ,finalCard} from './yt1-sp-deep-common.mjs';

const K='deep08-',DEG=Math.PI/180,TAU=Math.PI*2;
const TCOL=C.t,WAVEC=C.x,SUNC='#ffcf67',QUARTZ='#d9f1ff',PANEL='#3f8cff',GOLD='#e8b84a',BOX='#131f38';
const n1=v=>Number(v.toFixed(1));
const easeOut=u=>1-(1-clamp(u))**3;

// ================= 形 =================
// 桁の幅をそろえて数字を並べる（数字が回っても横に揺れない）
function digits(s,x,y,{size=80,color=C.ink,anchor='middle',weight=700}={}){
 const adv=c=>/[0-9]/.test(c)?.62:/[,.:]/.test(c)?.3:c===' '?.3:1;
 const ch=[...String(s)],w=ch.reduce((a,c)=>a+adv(c),0)*size;
 let x0=anchor==='middle'?x-w/2:anchor==='end'?x-w:x,out='';
 for(const c of ch){const cw=adv(c)*size;if(c!==' ')out+=label(c,x0+cw/2,y,{size,color,anchor:'middle',weight});x0+=cw;}
 return out;
}
const comma=v=>String(Math.floor(v)).replace(/\B(?=(\d{3})+(?!\d))/g,',');
// 時計の文字盤。角度は 12時から時計回り（度）
function clockFace(cx,cy,r,sec,{hour=300,min=60,face=BOX,secColor=C.a,ghost=null}={}){
 let s=dot(cx,cy,r,face)+ring(cx,cy,r,{color:C.ink,w:Math.max(4,r*.04)});
 for(let k=0;k<60;k++){const a=k*6*DEG,big=k%5===0,r1=r*(big?.8:.88);
  if(!big&&r<90)continue;
  s+=line(cx+r1*Math.sin(a),cy-r1*Math.cos(a),cx+r*.94*Math.sin(a),cy-r*.94*Math.cos(a),{color:big?C.ink:C.dim,w:big?Math.max(3,r*.025):2});}
 const hand=(ang,len,w,col,dash='')=>line(cx,cy,cx+len*Math.sin(ang*DEG),cy-len*Math.cos(ang*DEG),{color:col,w,dash});
 s+=hand(hour,r*.48,Math.max(6,r*.05),C.ink)+hand(min,r*.72,Math.max(4,r*.035),C.ink);
 if(ghost!=null)s+=hand(ghost,r*.84,4,C.dim,'8 7');
 s+=hand(sec,r*.84,Math.max(3,r*.022),secColor)+dot(cx,cy,Math.max(6,r*.05),secColor);
 return s;
}
// 1秒ずつ「カチ」と進む秒針の角度（t 秒で t 目盛り）
const tickAngle=t=>6*(Math.floor(t)+seg(t-Math.floor(t),0,.12));
function sunIcon(x,y,r,{g=1,color=SUNC}={}){
 let s=dot(x,y,r*1.45,color,.12)+dot(x,y,r,color);
 for(let k=0;k<12;k++){const a=k*30*DEG;s+=line(x+r*1.2*Math.cos(a),y+r*1.2*Math.sin(a),x+r*1.55*Math.cos(a),y+r*1.55*Math.sin(a),{color,w:Math.max(3,r*.09)});}
 return fade(g,s);
}
// 地球（横から見た形の大陸を、回す）
function earth(cx,cy,r,rot=0){
 const land=`<path d="M${cx-r*.55} ${cy-r*.35} q${r*.3} ${-r*.3} ${r*.6} ${-r*.05} q${r*.1} ${r*.3} ${-r*.15} ${r*.5} q${-r*.3} ${r*.1} ${-r*.45} ${-r*.45}Z" fill="#3fae6a"/>`+`<path d="M${cx+r*.15} ${cy+r*.1} q${r*.4} ${-r*.2} ${r*.6} ${r*.15} q${-r*.05} ${r*.4} ${-r*.35} ${r*.45} q${-r*.3} ${-r*.2} ${-r*.25} ${-r*.6}Z" fill="#3fae6a"/>`+`<path d="M${cx-r*.2} ${cy+r*.55} q${r*.25} ${-r*.1} ${r*.35} ${r*.12} q${-r*.15} ${r*.18} ${-r*.35} ${-r*.12}Z" fill="#3fae6a"/>`;
 return dot(cx,cy,r,'#2f6fd8')+`<g transform="rotate(${n1(rot)} ${n1(cx)} ${n1(cy)})">${land}</g>`+ring(cx,cy,r,{color:'#7fb2ff',w:3});
}
// 回る向きの矢印（円弧）
function arcArrow(cx,cy,r,a0,a1,{color=C.dim,w=5,head=20}={}){
 const pts=[];for(let k=0;k<=24;k++){const a=(a0+(a1-a0)*k/24)*DEG;pts.push([cx+r*Math.cos(a),cy+r*Math.sin(a)]);}
 const A=pts.at(-2),B=pts.at(-1);
 return draw(pts.slice(0,-1),1,{color,w})+arrow(A[0],A[1],B[0]+(B[0]-A[0])*1.5,B[1]+(B[1]-A[1])*1.5,{color,w,head});
}
// 衛星（本体・2枚の電池板・アンテナ）
function satellite(x,y,{s=1,g=1,inner=''}={}){
 const bw=96*s,bh=76*s,pw=150*s,ph=58*s;
 let o='';
 for(const sg of [-1,1]){const x0=sg<0?x-bw/2-14*s-pw:x+bw/2+14*s;
  o+=line(x+sg*bw/2,y,x0+(sg<0?pw:0),y,{color:'#c4cde0',w:Math.max(3,4*s)});
  o+=rect(x0,y-ph/2,pw,ph,{fill:PANEL,fo:.6,stroke:'#8ec0ff',sw:3,rx:4});
  for(let k=1;k<4;k++)o+=line(x0+pw*k/4,y-ph/2,x0+pw*k/4,y+ph/2,{color:'#8ec0ff',w:2});}
 o+=rect(x-bw/2,y-bh/2,bw,bh,{fill:GOLD,fo:.9,stroke:'#fff1b8',sw:3,rx:8});
 o+=line(x,y+bh/2,x,y+bh/2+22*s,{color:'#c4cde0',w:4})+`<path d="M${n1(x-22*s)} ${n1(y+bh/2+22*s)} Q${n1(x)} ${n1(y+bh/2+46*s)} ${n1(x+22*s)} ${n1(y+bh/2+22*s)}Z" fill="#c4cde0"/>`;
 return fade(g,o+inner);
}
// 原子：核と3つの軌道と電子（絵は簡単にしたもの）
function atomIcon(x,y,sc=1,t=0,{g=1,color=WAVEC}={}){
 let s='';
 for(const rot of [0,60,120])s+=`<ellipse cx="${n1(x)}" cy="${n1(y)}" rx="${n1(230*sc)}" ry="${n1(78*sc)}" transform="rotate(${rot} ${n1(x)} ${n1(y)})" fill="none" stroke="#8aa0c4" stroke-width="${Math.max(2,4*sc)}"/>`;
 const nuc=[[0,0],[1,0],[-1,0],[.5,.87],[-.5,.87],[.5,-.87],[-.5,-.87]];
 nuc.forEach(([u,v],i)=>{s+=dot(x+u*22*sc,y+v*22*sc,17*sc,i%2?'#ff8f9b':'#c4cde0');});
 [0,60,120].forEach((rot,i)=>{const a=t*1.6+i*2.1,ex=230*sc*Math.cos(a),ey=78*sc*Math.sin(a),c=Math.cos(rot*DEG),sn=Math.sin(rot*DEG);
  s+=dot(x+ex*c-ey*sn,y+ex*sn+ey*c,Math.max(6,15*sc),color);});
 return fade(g,s);
}
// 波（x0→x1、振幅 amp、波長 lam、位相 ph）
function wave(x0,x1,y,{amp=30,lam=80,ph=0,color=WAVEC,w=5,g=1,env=null}={}){
 if(x1-x0<2)return '';
 const pts=[];for(let x=x0;x<=x1+.1;x+=4){const e=env?env(x):1;pts.push([x,y-amp*e*Math.sin(TAU*(x-x0)/lam-ph)]);}
 return fade(g,draw(pts,1,{color,w}));
}
// 腕時計
function watch(x,y,r,t){
 return rect(x-r*.55,y-r*1.75,r*1.1,r*3.5,{fill:'#5c6f90',fo:.8,stroke:'#8aa0c4',sw:3,rx:r*.3})+clockFace(x,y,r,tickAngle(t),{hour:310,min:50});
}
// 水晶の板（震えは横の伸び縮みで描く）
function quartzPlate(x,y,w,h,{vib=0,t=0}={}){
 const k=1+.07*vib*Math.sin(TAU*3*t),ww=w*k;
 let s=rect(x-ww/2,y-h/2,ww,h,{fill:QUARTZ,fo:.3,stroke:QUARTZ,sw:3,rx:6});
 s+=rect(x-ww*.35,y-h/2-8,ww*.7,8,{fill:GOLD,fo:.9,stroke:GOLD,sw:1,rx:2})+rect(x-ww*.35,y+h/2,ww*.7,8,{fill:GOLD,fo:.9,stroke:GOLD,sw:1,rx:2});
 if(vib>0){for(const sg of [-1,1])for(let j=1;j<=2;j++){const xx=x+sg*(ww/2+14+j*16);s+=fade(vib*(.9-.3*j),`<path d="M${n1(xx)} ${n1(y-h*.45)} Q${n1(xx+sg*12)} ${n1(y)} ${n1(xx)} ${n1(y+h*.45)}" fill="none" stroke="${QUARTZ}" stroke-width="3"/>`);}}
 return s;
}
// 振り子
function pendulum(px,py,L,th,{bob=40,color=GOLD}={}){
 const bx=px+L*Math.sin(th),by=py+L*Math.cos(th);
 return line(px,py,bx,by,{color:'#c4cde0',w:6})+dot(bx,by,bob,color)+ring(bx,by,bob,{color:'#fff1b8',w:3})+dot(px,py,10,'#c4cde0');
}
const strike=(x0,x1,y,g=1)=>fade(g,line(x0,y,mix(x0,x1,g),y,{color:C.a,w:6}));

// ================= 場面ごとの形 =================
// 1〜2 時計と「1・2・3」
const CK={x:330,y:370,r:240};
function clockScene(tg,{numsG=1,dim=0}={}){
 let s=clockFace(CK.x,CK.y,CK.r,tickAngle(tg));
 const n=Math.min(6,Math.floor(tg));
 if(n>0){const txt=Array.from({length:n},(_,i)=>i+1).join('・');s+=fade(numsG,label(txt,90,800,{size:64,color:TCOL,weight:700}));
  const fr=tg-Math.floor(tg);if(tg<7)s+=fade(numsG*(1-seg(fr,.1,.6)),ring(CK.x,CK.y,CK.r+16,{color:TCOL,w:5}));}
 return dim>0?fade(1-.7*dim,s):s;
}
// 3 太陽と1日の円
const SD={x:440,y:400,r:250};
// 7〜8 地球
// 11 原子の段
const LV=[620,440,270],LX0=330,LX1=830,EX=560;
// 地面（地球の一部）。下の端だけに置く
const groundArc=()=>dot(500,1700,900,'#2f6fd8',.85)+ring(500,1700,900,{color:'#7fb2ff',w:3})+label('地球',500,880,{size:38,color:'#cfe2ff',weight:700,anchor:'middle'});
// 19〜20 打ち上げた時計
const GC={x:230,y:510,r:110};
const SAT0=[700,560],SAT1=[700,190];
function driftScene(p,ctx,tg,{t0}){
 // t0：ずれが始まる時刻（組の秒）
 const up=ctx.cue.diagram.endsWith('launch')?vseg(ctx,p,.36,.6):1;
 const sp=[mix(SAT0[0],SAT1[0],up),mix(SAT0[1],SAT1[1],up)];
 const drift=Math.min(55,7*Math.max(0,tg-t0));
 const base=6*tg;
 let s=groundArc();
 // 地上の時計
 s+=clockFace(GC.x,GC.y,GC.r,base)+label('地上の 時計',GC.x,GC.y-GC.r-26,{size:40,anchor:'middle',weight:700});
 // 打ち上げの跡
 if(up>0)s+=fade(1-seg(up,.85,1),draw([SAT0,sp],1,{color:C.dim,w:4,dash:'10 10'}));
 // 衛星と、その時計
 s+=satellite(sp[0],sp[1],{s:.8});
 const cc=[sp[0],sp[1]+170];
 s+=clockFace(cc[0],cc[1],85,base+drift,{ghost:drift>.5?base:null});
 s+=label('衛星の 時計',sp[0],sp[1]-60,{size:40,anchor:'middle',weight:700});
 if(drift>2){const g=clamp((drift-2)/8);
  const pts=[];for(let k=0;k<=16;k++){const a=(base+drift*k/16-90)*DEG;pts.push([cc[0]+100*Math.cos(a),cc[1]+100*Math.sin(a)]);}
  s+=fade(g,draw(pts,1,{color:HC,w:5})+label('ずれ',cc[0]+110,cc[1]-90,{size:40,color:HC,weight:700}));}
 return s;
}

// ================= 原子時計の選局（17〜20） =================
const TLAM=46;
const resp=d=>Math.exp(-((d/.28)**2)); // 反応の山（d＝振動数のずれ、0 で ぴったり）
// 18：前半はずれたまま、後半で 低い→高い→ぴったり と動かす
function tuneState(p,ctx){const a=swin(ctx,p,1,.05,.55),b=swin(ctx,p,1,.55,.85);
 const d=b>0?mix(1,0,b):mix(-.8,1,a);return {d,g:resp(d)};}
// 19：つまみ −1 → +0.8 → 0（頂上で止める）→ 小さくずれては戻す
function dialD(u,tg){if(u<.45)return mix(-1,.8,seg(u,0,.45));if(u<.8)return mix(.8,0,seg(u,.45,.8));return .05*Math.sin(tg*3)*seg(u,.85,1);}
function tuneSource(g){return fade(g,label('原子時計',170,160,{size:44,color:C.ink,anchor:'middle',weight:700})+rect(40,190,260,140,{fill:BOX,fo:.95,stroke:'#c4cde0',sw:4,rx:18})+label('電波を',170,250,{size:40,color:WAVEC,anchor:'middle',weight:700})+label('作る',170,300,{size:40,color:WAVEC,anchor:'middle',weight:700}));}
function tuneAtom(g,gl,tg){return fade(g,dot(770,260,80+30*gl,HC,.35*gl)+dot(770,260,60,HC,.35*gl)+atomIcon(770,260,.4,tg)+label('セシウム',770,440,{size:40,color:HC,anchor:'middle',weight:700}));}
// つまみ（d：−1〜1 を −120°〜120° に）
function knob(x,y,r,d){const a=(d*120-90)*DEG;let s=dot(x,y,r,'#1f2d4d')+ring(x,y,r,{color:'#c4cde0',w:5});
 for(let k=-4;k<=4;k++){const b=(k*30-90)*DEG;s+=line(x+(r+8)*Math.cos(b),y+(r+8)*Math.sin(b),x+(r+20)*Math.cos(b),y+(r+20)*Math.sin(b),{color:C.dim,w:3});}
 return s+line(x,y,x+r*.8*Math.cos(a),y+r*.8*Math.sin(a),{color:HC,w:8})+dot(x,y,10,HC);}
// ラジオの選局（小さな絵）。q：針が動く進み（−1→+0.6→0）、tuned：はっきりした音
function radio(g,q,tg,tuned){if(g<=0)return '';
 const dd=q<.6?mix(-1,.6,seg(q,0,.6)):mix(.6,0,seg(q,.6,1)),gl=resp(dd);
 let s=rect(60,600,420,240,{fill:'#5c6f90',fo:.55,stroke:'#c4cde0',sw:4,rx:24});
 s+=ring(150,740,60,{color:'#c4cde0',w:4});for(let k=1;k<4;k++)s+=ring(150,740,60*k/4,{color:'#8aa0c4',w:2});
 s+=rect(240,640,210,50,{fill:'#050a16',fo:1,stroke:'#8aa0c4',sw:2,rx:6});for(let k=0;k<=8;k++)s+=line(255+k*22.5,650,255+k*22.5,665,{color:C.dim,w:2});
 s+=line(345+dd*90,642,345+dd*90,688,{color:C.a,w:4});
 s+=knob(345,770,40,dd);
 for(let k=1;k<=3;k++){s+=fade(gl*(1-.2*k),`<path d="M${n1(70-k*0)} ${n1(740-30*k)} Q${n1(40-25*k)} 740 ${n1(70)} ${n1(740+30*k)}" fill="none" stroke="${HC}" stroke-width="4"/>`);}
 s+=label('ラジオの 選局',520,680,{size:40,color:C.ink,weight:700});
 s+=fade(tuned,label('音が 一番',520,760,{size:40,color:HC,weight:700})+label('はっきり',520,810,{size:40,color:HC,weight:700}));
 return fade(g,s);}
// 人影（顔なし）とアインシュタインの予言
function whoLayer(a,b,c){
 let s=fade(a,dot(300,420,62,'#c4cde0')+`<path d="M190 600 Q190 500 300 495 Q410 500 410 600 Z" fill="#c4cde0"/>`+label('アインシュタイン',300,660,{size:44,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(b,label('1905年 ・ 1915年',300,725,{size:40,color:TCOL,anchor:'middle',weight:700})+plate('100年以上 前',560,470,{size:48,color:C.ink}));
 s+=tag('予言',560,560,{color:'#ffb36b',size:44,g:c});
 return s;}

// ================= 第3版で足した形 =================
// 難所の札（橙の枠、山の印）。舞台の左上
const NAN='#ff9f43';
function nansho(g=1){if(g<=0)return '';
 const x=40,y=28,w=200,h=70;
 let s=rect(x,y,w,h,{fill:C.bg,fo:.9,stroke:'none',rx:16})+rect(x,y,w,h,{fill:NAN,fo:.12,stroke:NAN,sw:4,rx:16});
 s+=poly([[x+22,y+52],[x+44,y+20],[x+56,y+36],[x+64,y+28],[x+84,y+52]],{fill:NAN,fo:.85,stroke:'none'});
 s+=label('難所',x+142,y+50,{size:44,color:NAN,anchor:'middle',weight:700});
 return fade(g,s);}
// 予想のカード（A・B・C）。show：各カードの出る割合、hl：正解の番号、a：答え合わせの進み
function cards(items,{y0=330,h=120,gap=26,show=[],hl=-1,a=0}={}){
 let s='';
 items.forEach(([L,T],i)=>{const g=show[i]??1;if(g<=0)return;
  const y=y0+i*(h+gap),on=i===hl?a:0,op=hl>=0&&i!==hl?1-.65*a:1;
  let c=rect(60,y,800,h,{fill:'#131f38',fo:.95,stroke:'#8aa0c4',sw:4,rx:22});
  c+=fade(on,rect(52,y-8,816,h+16,{fill:HC,fo:.12,stroke:'none',rx:28})+rect(60,y,800,h,{fill:HC,fo:.1,stroke:HC,sw:7,rx:22}));
  c+=label(L,135,y+h/2+24,{size:68,color:HC,anchor:'middle',weight:700})+line(205,y+20,205,y+h-20,{color:C.faint,w:3});
  c+=label(T,235,y+h/2+16,{size:46,color:C.ink,weight:700});
  s+=fade(g*op,scaleAt(460,y+h/2,.94+.06*g,c));});
 return s;}
// 声の後の 3→2→1（各1秒）
function countdown(p,ctx,y=860){
 const dt=cueT(p,ctx)-voiceEnd(ctx);if(dt<0||dt>=3.1)return '';
 const k=Math.min(2,Math.floor(dt)),fr=Math.min(1,dt-k),n=3-k,cx=460,cy=y-38,r=62;
 const pts=[];for(let j=0;j<=40;j++){const a=(-90+360*(1-fr)*j/40)*DEG;pts.push([cx+r*Math.cos(a),cy+r*Math.sin(a)]);}
 return fade(seg(fr,0,.12)*(1-.5*seg(fr,.85,1)),ring(cx,cy,r,{color:C.faint,w:6})+draw(pts,1,{color:HC,w:6})+label(String(n),cx,y,{size:100,color:HC,anchor:'middle',weight:700}));}
const qhead=(l1,l2,g)=>fade(g,label(l1,460,170,{size:50,color:C.ink,anchor:'middle',weight:700})+label(l2,460,245,{size:50,color:C.ink,anchor:'middle',weight:700}));
const G1=[['A','変わらない'],['B','少しずつ 遅くなっている'],['C','少しずつ 速くなっている']];
const G2=[['A','少し 違う'],['B','まったく 同じ']];
// 振り子
const PT0=2;
function pendScene(px,py,L,ph,{bob=36}={}){return pendulum(px,py,L,22*DEG*Math.sin(ph),{bob});}
// 2：だんだん遅くなる振り子（1往復の時間 T＝2(1+k t)、k＝0.05/秒。大きく誇張）
const KS=.05,nSw=t=>Math.log(1+KS*t)/(2*KS);
function slowScene(tg,{bar=1,lab=1}={}){
 const n=nSw(tg),T=PT0*(1+KS*tg);
 let s=pendScene(230,100,330,TAU*n)+label('振り子',230,560,{size:40,color:GOLD,anchor:'middle',weight:700});
 s+=clockFace(690,300,150,120*n,{ghost:60*tg})+fade(lab,label('振り子で 進む 時計',690,115,{size:40,anchor:'middle',weight:700})+label('点線：本当の 時刻',690,510,{size:36,color:C.dim,anchor:'middle'}));
 s+=fade(bar,label('1往復に かかる 時間',60,660,{size:40,color:C.ink,weight:700})+rect(60,690,340,44,{fill:BOX,fo:1,stroke:TCOL,sw:3,rx:8})+rect(60,690,Math.min(560,340*T/PT0),44,{fill:TCOL,fo:.75,stroke:'none',rx:8}));
 return s;}
// セシウム原子の絵（核・内側・一番外側の電子一つ）
const NUC=[500,440],ORB=280,EA=-40*DEG,EP=[NUC[0]+ORB*Math.cos(EA),NUC[1]+ORB*Math.sin(EA)];
function nucleus(x,y,r){let s='';const pts=[[0,0],[.5,0],[-.5,0],[.25,.43],[-.25,.43],[.25,-.43],[-.25,-.43],[0,.8],[0,-.8],[.7,.4],[-.7,.4],[.7,-.4],[-.7,-.4]];
 pts.forEach(([u,v],i)=>{s+=dot(x+u*r*.75,y+v*r*.75,r*.32,i%2?'#ff8f9b':'#c4cde0');});return s;}
// 小さな磁石（矢印。先が赤）
function magnet(x,y,up,len,{g=1,w=12}={}){const d=up?-1:1,y0=y-d*len/2,y1=y+d*len/2;
 return fade(g,line(x,y0,x,y1-d*20,{color:'#9fc0ff',w,cap:'butt'})+poly([[x-w*1.4,y1-d*24],[x+w*1.4,y1-d*24],[x,y1+d*6]],{fill:'#ff6b6b',fo:1}));}
function csAtom({nucG=1,elG=1,inner=1,magG=0,eUp=true,tg=0}={}){
 let s=fade(inner*.6,[120,175,225].map(r=>ring(NUC[0],NUC[1],r,{color:C.faint,w:3,dash:'6 10'})).join('')+[0,1,2,3,4,5,6,7].map(k=>{const r=[120,175,225][k%3],a=k*.8+tg*.3;return dot(NUC[0]+r*Math.cos(a),NUC[1]+r*Math.sin(a),8,'#5c6f90');}).join(''));
 s+=fade(elG,ring(NUC[0],NUC[1],ORB,{color:'#8aa0c4',w:3})+dot(EP[0],EP[1],34,WAVEC,.25)+dot(EP[0],EP[1],22,WAVEC));
 s+=fade(nucG,nucleus(NUC[0],NUC[1],70));
 s+=magnet(NUC[0],NUC[1],true,170,{g:magG})+magnet(EP[0],EP[1],eUp,130,{g:magG,w:10});
 return s;}
// 二段のエネルギー
const LU=290,LL=640,LX=[200,600];
function combo(x,y,eUp,{g=1}={}){return fade(g,dot(x,y,26,'#c4cde0')+magnet(x,y,true,90,{w:9})+dot(x+80,y,16,WAVEC)+magnet(x+80,y,eUp,70,{w:7}));}
function levelsFig({cmb=1,lev=1,gap=0,gapLabel=0,axis=1,hlLevel=-1,hlG=0}={}){
 let s=fade(axis,arrow(110,760,110,170,{color:C.dim,w:5,head:22})+label('エネルギー',60,140,{size:38,color:C.dim,weight:700}));
 s+=draw([[LX[0],LU],[LX[1],LU]],lev,{color:'#c4cde0',w:7})+draw([[LX[0],LL],[LX[1],LL]],lev,{color:'#c4cde0',w:7});
 s+=combo(720,LU,true,{g:cmb})+fade(cmb,label('向きが そろう',760,LU+100,{size:38,color:C.ink,anchor:'middle',weight:700}));
 s+=combo(720,LL,false,{g:cmb})+fade(cmb,label('向きが 反対',760,LL+100,{size:38,color:C.ink,anchor:'middle',weight:700}));
 if(hlG>0){const y=hlLevel===0?LU:LL;s+=fade(hlG,rect(665,y-72,200,140,{fill:HC,fo:.1,stroke:HC,sw:5,rx:18}));}
 s+=fade(gap,line(400,LU+10,400,LL-10,{color:HC,w:5})+poly([[386,LU+34],[414,LU+34],[400,LU+8]],{fill:HC,fo:1})+poly([[386,LL-34],[414,LL-34],[400,LL-8]],{fill:HC,fo:1}));
 s+=fade(gapLabel,plate('差：ぴったり 決まった 大きさ',430,480,{size:40,color:HC}));
 return s;}
// 原子の流れ（左→右）。p：電波で ひっくり返る割合
const BY=360,BX0=210,BX1=770,BSP=120,BN=12,BGAP=(BX1-BX0)/BN;
const hsh=(i,c)=>{const v=Math.sin(i*12.9898+c*78.233)*43758.5453;return v-Math.floor(v);};
function beamFig(tg,{src=1,on=0,p=0,cnt=0,cntFrom=0,cntG=0}={}){
 let s=rect(40,BY-60,150,120,{fill:'#1f2d4d',fo:1,stroke:'#c4cde0',sw:4,rx:14})+label('セシウム',115,BY+110,{size:38,color:HC,anchor:'middle',weight:700})+label('原子',115,BY+14,{size:40,color:C.ink,anchor:'middle',weight:700});
 s+=rect(400,BY-80,200,160,{fill:'#1f2d4d',fo:.8,stroke:WAVEC,sw:4,rx:14})+fade(on,wave(410,590,BY-45,{amp:16,lam:30,ph:tg*8,w:4}));
 s+=fade(src,rect(390,90,220,90,{fill:BOX,fo:1,stroke:WAVEC,sw:4,rx:14})+label('電波を 作る',500,150,{size:38,color:WAVEC,anchor:'middle',weight:700})+line(500,180,500,BY-80,{color:WAVEC,w:4,dash:'8 8'}));
 s+=rect(770,BY-60,120,120,{fill:'#1f2d4d',fo:1,stroke:HC,sw:4,rx:14})+label('数える',830,BY+14,{size:38,color:HC,anchor:'middle',weight:700});
 for(let i=0;i<BN;i++){const z=tg*BSP+i*BGAP,c=Math.floor(z/(BX1-BX0)),x=BX0+z-c*(BX1-BX0);
  const fl=x>590&&hsh(i,c)<p;
  s+=fl?dot(x,BY,20,HC,.3)+dot(x,BY,13,HC):dot(x,BY,11,'#8aa0c4');}
 if(cntG>0){let n=0;for(let i=0;i<BN;i++){const L=BX1-BX0;for(let c=0;;c++){const t=(L*(c+1)-i*BGAP)/BSP;if(t>tg)break;if(t>cntFrom&&hsh(i,c)<p)n++;}}
  s+=fade(cntG,label('ひっくり返った 原子だけを 数える',60,560,{size:40,color:C.ink,weight:700})+rect(60,590,500,120,{fill:BOX,fo:.95,stroke:HC,sw:4,rx:16})+digits(String(n),310,675,{size:76,color:HC})+label('個',540,675,{size:44,color:HC,anchor:'end',weight:700}));}
 return s;}
// 20 磁石で、向きの組み合わせが同じ原子だけを選ぶ
const SY=470,SX0=190,SL=760,SN=14;
const atomDot=(x,y,keep,g=1)=>{const col=keep?WAVEC:C.a,d=keep?-1:1;return fade(g,dot(x,y,19,col)+line(x,y-d*10,x,y+d*4,{color:C.bg,w:4})+poly([[x-7,y+d*2],[x+7,y+d*2],[x,y+d*12]],{fill:C.bg,fo:1}));};
const selMini=g=>fade(g,rect(225,BY-62,110,22,{fill:'#ff6b6b',fo:.55,stroke:'#ff8f9b',sw:2,rx:5})+rect(225,BY+40,110,22,{fill:'#5c8cff',fo:.55,stroke:'#9fc0ff',sw:2,rx:5})+label('磁石',280,BY-80,{size:36,color:C.dim,anchor:'middle',weight:700}));
function selectFig(tg,{mag=1,flow=1,lab1=0,lab2=0,lab3=0}={}){
 let s=rect(40,SY-60,150,120,{fill:'#1f2d4d',fo:1,stroke:'#c4cde0',sw:4,rx:14})+label('原子',115,SY+14,{size:40,color:C.ink,anchor:'middle',weight:700})+label('セシウム',115,SY+110,{size:38,color:HC,anchor:'middle',weight:700});
 s+=fade(mag,rect(300,SY-230,220,50,{fill:'#ff6b6b',fo:.55,stroke:'#ff8f9b',sw:3,rx:8})+rect(300,SY+180,220,50,{fill:'#5c8cff',fo:.55,stroke:'#9fc0ff',sw:3,rx:8})+label('磁石',410,SY+290,{size:42,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(mag,rect(600,SY-230,22,195,{fill:'#5c6f90',fo:1,stroke:'none',rx:4})+rect(600,SY+35,22,195,{fill:'#5c6f90',fo:1,stroke:'none',rx:4}));
 if(flow>0){let a='';
  for(let i=0;i<SN;i++){const z=tg*110+i*SL/SN,c=Math.floor(z/SL),x=SX0+z-c*SL,keep=hsh(i,c+7)<.5;
   let y=SY;if(!keep&&x>300)y=SY-.0022*(x-300)**2;
   if(!keep&&x>596)continue;
   a+=atomDot(x,y,keep,!keep&&x>540?1-(x-540)/56:1);}
  s+=fade(flow,a);}
 s+=fade(lab1,label('向きが 違う 原子は',300,SY-330,{size:40,color:C.a,weight:700})+label('曲げられて 除かれる',300,SY-280,{size:40,color:C.a,weight:700}));
 s+=fade(lab2,label('同じ 向きの',650,SY+110,{size:40,color:WAVEC,weight:700})+label('原子だけ 先へ',650,SY+160,{size:40,color:WAVEC,weight:700}));
 s+=fade(lab3,plate('最初から ひっくり返った 原子は 混ざらない',460,820,{size:40,color:HC,anchor:'middle'}));
 s+=note('絵は 簡単に しています',560,900);
 return s;}
// 光や電波：振動数と、一度に渡せるエネルギー
function quantaFig({wv=1,fl=1,bl=1,pl=1,tg=0,dim=0}={}){
 let s=label('光や 電波が 一度に 渡せる エネルギー',460,140,{size:42,color:C.ink,anchor:'middle',weight:700});
 s+=fade(wv,wave(60,560,330,{amp:40,lam:150,ph:tg*3})+wave(60,560,580,{amp:40,lam:50,ph:tg*9,color:C.v}));
 s+=fade(fl,label('振動数 低い',60,250,{size:40,color:WAVEC,weight:700})+label('振動数 高い',60,500,{size:40,color:C.v,weight:700}));
 s+=fade(bl,rect(680,290,80,80,{fill:HC,fo:.8,stroke:'#fff1b8',sw:3,rx:8})+rect(660,500,160,160,{fill:HC,fo:.8,stroke:'#fff1b8',sw:3,rx:8})
  +label('ひとかたまり',720,250,{size:36,color:HC,anchor:'middle',weight:700}));
 s+=fade(bl,arrow(580,330,660,330,{color:C.dim,w:4,head:16})+arrow(580,580,645,580,{color:C.dim,w:4,head:16}));
 s+=fade(pl,plate('振動数で ひとかたまりの 大きさが 決まる',460,790,{size:40,color:HC,anchor:'middle'}));
 return dim>0?fade(1-dim,s):s;}

// ================= cue ごとの図 =================
export const deep08Diagrams={
 // 1 時計はくり返しを数える。振り子は往復、腕時計は水晶の震え
 [K+'tick:both']:(p,ctx)=>{const tg=ctx.tg,t2=tg-cueT(p,ctx)+sentWin(ctx)[1][0];
  let s=fade(swin(ctx,p,0,0,.3),clockFace(170,160,110,tickAngle(tg)));
  s+=fade(swin(ctx,p,0,.5,.85),label('くり返しを',330,140,{size:46,color:HC,weight:700})+label('数える 道具',330,205,{size:46,color:HC,weight:700}));
  const gP=swin(ctx,p,1,0,.25),gQ=swin(ctx,p,1,.5,.75);
  s+=fade(gP,pendScene(250,340,280,TAU*Math.max(0,tg-t2)/PT0)+label('振り子',250,720,{size:40,color:GOLD,anchor:'middle',weight:700}));
  const n=Math.min(5,Math.floor(Math.max(0,tg-t2)/PT0+.25));
  if(n>0)s+=fade(gP,label(Array.from({length:n},(_,i)=>i+1).join('・'),250,810,{size:52,color:TCOL,anchor:'middle',weight:700}));
  const tq=tg-t2-sentWin(ctx)[1].reduce((a,b)=>b-a)*.5;
  s+=fade(gQ,quartzPlate(700,500,220,80,{vib:1,t:tg})+label('腕時計の 水晶',700,420,{size:40,color:QUARTZ,anchor:'middle',weight:700}));
  if(tq>0)s+=fade(gQ,label(Array.from({length:Math.min(5,Math.floor(tq*6)+1)},(_,i)=>i+1).join('・')+(tq>.8?' …':''),700,810,{size:52,color:TCOL,anchor:'middle',weight:700}));
  return s;},
 // 2 くり返しの速さが変わると、時計はその分だけ狂う
 [K+'tick:slow']:(p,ctx)=>{const tg=ctx.tg;
  let s=slowScene(tg,{bar:vseg(ctx,p,.05,.3)});
  s+=fade(vseg(ctx,p,.1,.4),plate('往復が だんだん 遅くなる',60,800,{size:40,color:C.ink}));
  s+=fade(vseg(ctx,p,.75,.95),plate('その分 狂う',620,800,{size:48,color:C.a}));
  s+=note('遅れは 大きく 誇張',40,900);
  return s;},
 // 3 ぜったいに変わらないくり返しは？
 [K+'tick:q']:(p,ctx)=>{const tg=ctx.tg,d=vseg(ctx,p,0,.3);
  let s=fade(1-.75*d,slowScene(tg));
  s+=bigQ(460,560,vseg(ctx,p,.3,.6),260);
  s+=fade(vseg(ctx,p,.45,.8),plate('ぜったいに 変わらない くり返し？',460,790,{size:48,color:HC,anchor:'middle'}));
  return s;},
 // 4 昔は地球の自転：1日の 86400分の1 が 1秒（昔の定義）
 [K+'sun:day']:(p,ctx)=>{const {x,y,r}=SD;
  const g0=swin(ctx,p,0,0,.3),go=swin(ctx,p,0,.3,.95),day=swin(ctx,p,0,.8,1),tk=swin(ctx,p,1,0,.55),eq=swin(ctx,p,1,.35,.65),sec=swin(ctx,p,1,.6,.9);
  let s=ring(x,y,r,{color:'#8aa0c4',w:4});
  if(go>0){const pts=[];for(let k=0;k<=72*go;k++){const a=(-90+360*k/72)*DEG;pts.push([x+r*Math.cos(a),y+r*Math.sin(a)]);}
   s+=draw(pts,1,{color:SUNC,w:8,opacity:.6});}
  for(let k=0;k<96;k++){const gk=clamp(tk*96-k);if(gk<=0)break;const a=k*3.75*DEG;s+=fade(gk,line(x+(r-22)*Math.sin(a),y-(r-22)*Math.cos(a),x+r*Math.sin(a),y-r*Math.cos(a),{color:TCOL,w:k%4===0?4:2}));}
  const sa=(-90+360*go)*DEG;
  s+=sunIcon(x+r*Math.cos(sa),y+r*Math.sin(sa),38,{g:g0});
  s+=fade(g0*(1-day),label('太陽',x+70,y-r-14,{size:40,color:SUNC,weight:700}));
  s+=fade(g0*(1-day),label('地球の 自転',x,y+20,{size:44,color:C.dim,anchor:'middle',weight:700}));
  s+=fade(day,label('1日',x,y+28,{size:80,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(tk,label('86400 等分',x+r+24,y+14,{size:40,color:TCOL,weight:700}));
  s+=fade(eq,label('24 × 60 × 60 ＝ 86400',40,835,{size:40,color:C.dim,weight:700}));
  s+=fade(sec,label('1秒 ＝ 1日 ÷ 86400',40,765,{size:52,color:TCOL,weight:700}));
  s+=tag('定義',960,60,{anchor:'end',text:'昔の 1秒',g:sec});
  s+=fade(tk,note('目盛りは 減らして 描いています',40,900));
  return s;},
 // 5a 予想：地球の自転は変わらない？（A）
 [K+'guess1:ask']:(p,ctx)=>{
  let s=tag('予想',960,60,{anchor:'end',g:swin(ctx,p,0,0,.6)});
  s+=qhead('地球の 自転は','ぜったいに 変わらない？',swin(ctx,p,1,0,.4));
  s+=cards(G1,{show:[swin(ctx,p,1,.8,.97),0,0]});
  return s;},
 // 5b B・C → 3・2・1
 [K+'guess1:opts']:(p,ctx)=>{
  let s=tag('予想',960,60,{anchor:'end'})+qhead('地球の 自転は','ぜったいに 変わらない？',1);
  s+=cards(G1,{show:[1,swin(ctx,p,0,.05,.4),swin(ctx,p,1,.05,.4)]});
  s+=countdown(p,ctx,880);
  return s;},
 // 6a 答え B。潮の満ち引きがブレーキ
 [K+'guess1:ans']:(p,ctx)=>{const tg=ctx.tg,o=swin(ctx,p,1,0,.25),g=swin(ctx,p,1,.15,.45),br=swin(ctx,p,1,.5,.85);
  let s=fade(1-o,tag('予想',960,60,{anchor:'end'})+qhead('地球の 自転は','ぜったいに 変わらない？',1)+cards(G1,{hl:1,a:swin(ctx,p,0,.1,.45)}));
  const ex=300,ey=330,er=160;
  s+=fade(g,`<ellipse cx="${ex}" cy="${ey}" rx="${n1(er*1.22)}" ry="${n1(er*1.02)}" transform="rotate(-14 ${ex} ${ey})" fill="${WATER}" fill-opacity=".45" stroke="${SURF}" stroke-width="3"/>`+earth(ex,ey,er,45*tg)+arcArrow(ex,ey,er+50,-150,-70,{color:C.dim})
   +dot(820,330,40,'#c9d6ea')+label('月',820,415,{size:40,color:'#c9d6ea',anchor:'middle',weight:700})+label('潮の ふくらみ',ex+er*1.25+10,ey-er*.55,{size:38,color:SURF,weight:700}));
  s+=fade(br,arcArrow(ex,ey,er+50,-20,-95,{color:C.a,w:7,head:24})+label('ブレーキ',60,110,{size:46,color:C.a,weight:700})+plate('自転が 遅くなる',60,640,{size:46,color:HC}));
  s+=fade(g,note('潮の ふくらみは 大きく 誇張',40,900));
  return s;},
 // 6b 1日は 100年に 約2ミリ秒 長くなる
 [K+'tide:bars']:(p,ctx)=>{const tg=ctx.tg,ex=260,ey=240,er=130;
  let s=`<ellipse cx="${ex}" cy="${ey}" rx="${n1(er*1.22)}" ry="${n1(er*1.02)}" transform="rotate(-14 ${ex} ${ey})" fill="${WATER}" fill-opacity=".45" stroke="${SURF}" stroke-width="3"/>`+earth(ex,ey,er,45*tg);
  s+=arcArrow(ex,ey,er+50,-20,-95,{color:C.a,w:7,head:24})+dot(820,240,40,'#c9d6ea')+label('月',820,325,{size:40,color:'#c9d6ea',anchor:'middle',weight:700});
  s+=note('潮の ふくらみと 伸びは 大きく 誇張',40,470);
  const bars=vseg(ctx,p,.05,.35),ext=vseg(ctx,p,.45,.85),BX=240,BL=520,DX=45;
  s+=fade(bars,label('1日の 長さ',40,560,{size:38,color:C.dim,weight:700}));
  [['今',610,0],['100年後',690,1],['200年後',770,2]].forEach(([nm,y,k],i)=>{const g=seg(bars,i*.25,i*.25+.5);
   s+=fade(g,label(nm,40,y+14,{size:38,color:C.ink,weight:700})+rect(BX,y-23,BL,46,{fill:TCOL,fo:.35,stroke:TCOL,sw:3,rx:6})+label('86400 秒',BX+20,y+13,{size:36,color:C.ink}));
   if(k>0)s+=fade(g*ext,rect(BX+BL,y-23,DX*k*ext,46,{fill:HC,fo:.95,stroke:HC,sw:2,rx:4}));});
  s+=fade(ext,label('100年で 約2ミリ秒 長く',40,875,{size:44,color:HC,weight:700}));
  return s;},
 // 7 地震や地球の中の動きでも揺らぐ → 物差しが伸び縮み
 [K+'ruler:stretch']:(p,ctx)=>{const tg=ctx.tg,g0=swin(ctx,p,0,0,.3),g1=swin(ctx,p,0,.55,.9),g2=swin(ctx,p,1,0,.3),g3=swin(ctx,p,1,.6,.9);
  const wb=g1*14*Math.sin(TAU*tg/1.1);
  let s=fade(g0,earth(190,190,120,45*tg+wb)+arcArrow(190,190,160,-150,-60,{color:C.dim})+label('地震・地球の 中の 動き',360,150,{size:40,color:C.ink,weight:700}));
  s+=fade(g1,plate('自転が 揺らぐ',360,240,{size:46,color:HC}));
  const Lr=640*(1+.12*Math.sin(TAU*tg/2.4)*g2),X0=100,OBJ=500,Y=420;
  let r=label('測りたい 長さ（いつも 同じ）',X0,Y,{size:38,color:C.dim,weight:700})+rect(X0,Y+25,OBJ,40,{fill:C.v,fo:.55,stroke:C.v,sw:3,rx:6});
  r+=label('時間の 物差し',X0,Y+120,{size:38,color:C.ink,weight:700})+rect(X0,Y+140,Lr,60,{fill:'#d8c7a8',fo:.85,stroke:'#fff1b8',sw:2,rx:4});
  for(let k=0;k<=10;k++){const xx=X0+Lr*k/10;r+=line(xx,Y+140,xx,k%5===0?Y+186:Y+168,{color:BOX,w:3})+label(String(k),xx,Y+240,{size:36,color:C.ink,anchor:'middle'});}
  r+=line(X0+OBJ,Y+15,X0+OBJ,Y+205,{color:HC,w:3,dash:'8 7'});
  r+=label('読み',X0,Y+330,{size:40,color:C.dim,weight:700})+digits((OBJ/(Lr/10)).toFixed(1),X0+110,Y+335,{size:60,color:HC,anchor:'start'});
  s+=fade(g2,r)+fade(g3,plate('物差しが 伸び縮み',430,Y+330,{size:46,color:C.a}));
  s+=note('揺らぎ・伸び縮みは 大きく 誇張',40,900);
  return s;},
 // 8a 水晶は 1秒に 32768 回
 [K+'quartz:count']:(p,ctx)=>{const t=cueT(p,ctx),tg=ctx.tg;
  const a=swin(ctx,p,0,0,.4),b=swin(ctx,p,0,.3,.9),el=swin(ctx,p,1,0,.3),r=swin(ctx,p,1,.3,.85);
  let s=fade(a,watch(170,250,95,tg)+label('腕時計',170,470,{size:40,anchor:'middle',weight:700}));
  s+=fade(b,arrow(300,250,450,250,{color:C.dim,w:5,head:20})+quartzPlate(650,250,260,90,{vib:el,t})+label('水晶の 板',650,165,{size:42,color:QUARTZ,anchor:'middle',weight:700}));
  s+=fade(el,label('1秒',60,645,{size:44,color:TCOL,weight:700})+rect(160,610,600,46,{fill:BOX,fo:1,stroke:TCOL,sw:3,rx:8})+rect(160,610,600*r,46,{fill:TCOL,fo:.75,stroke:'none',rx:8}));
  s+=fade(el,label('震えた',60,750,{size:38,color:C.dim,weight:700})+label('回数',60,800,{size:38,color:C.dim,weight:700})+digits(r>=1?'32768':String(Math.floor(32768*r)),470,795,{size:96,color:C.ink})+label('回',660,795,{size:52,color:C.ink,weight:700}));
  s+=fade(el,note('震えは 大きく 誇張・動きは ゆっくり',40,900));
  return s;},
 // 8b 大きさ・形・温度で回数が少し変わる
 [K+'quartz:vary']:(p,ctx)=>{const t=cueT(p,ctx);
  const gs=[vseg(ctx,p,.25,.45),vseg(ctx,p,.4,.6),vseg(ctx,p,.6,.8)];
  let s=label('1秒に 震える 回数',460,110,{size:44,color:C.ink,anchor:'middle',weight:700});
  const Q=[[170,'大きい',230,90,'32766'],[480,'小さい',140,60,'32770'],[790,'温かい',180,74,'32769']];
  Q.forEach(([x,nm,w,h,n],i)=>{let q=label(nm,x,220,{size:40,color:QUARTZ,anchor:'middle',weight:700})+quartzPlate(x,320,w,h,{vib:1,t:t+i*.3})+digits(n,x,480,{size:64,color:C.ink})+label('回',x,540,{size:38,color:C.dim,anchor:'middle'});
   if(i===2)q+=rect(x+100,270,14,70,{fill:'#ffd0d0',fo:.8,stroke:'#ff8f9b',sw:2,rx:7})+dot(x+107,345,14,'#ff6b6b');
   s+=fade(gs[i],q);});
  s+=fade(vseg(ctx,p,.82,.97),plate('わずかに 違う',460,690,{size:52,color:HC,anchor:'middle'}));
  s+=note('違いは 大きく 誇張',40,900);
  return s;},
 // 9 まったく同じ回数の水晶は作れない：二つのカウンターがずれていく
 [K+'quartz:two']:(p,ctx)=>{const t=cueT(p,ctx),sim=t;
  const A=Math.floor(32768*sim),B=Math.floor(32771*sim);
  let s=label('水晶 A',250,130,{size:42,color:QUARTZ,anchor:'middle',weight:700})+label('水晶 B',700,130,{size:42,color:QUARTZ,anchor:'middle',weight:700});
  s+=quartzPlate(250,230,200,76,{vib:1,t})+quartzPlate(700,230,206,74,{vib:1,t:t+.2});
  s+=digits(String(A),250,400,{size:60,color:C.ink})+digits(String(B),700,400,{size:60,color:C.ink});
  s+=label('震えた 回数',460,470,{size:38,color:C.dim,anchor:'middle',weight:700});
  s+=label('差',300,640,{size:48,color:C.dim,weight:700})+digits(String(B-A),460,645,{size:90,color:C.a})+label('回',560,640,{size:48,color:C.a,weight:700});
  s+=fade(vseg(ctx,p,.55,.9),plate('まったく 同じ 水晶は 作れない',460,800,{size:46,color:HC,anchor:'middle'}));
  s+=note('違いは 大きく 誇張',40,900);
  return s;},
 // 10 原子。ここからが難所
 [K+'atom:intro']:(p,ctx)=>{const tg=ctx.tg;
  let s=atomIcon(460,410,1.2,tg,{g:swin(ctx,p,0,.3,.7)});
  s+=fade(swin(ctx,p,0,.6,.95),label('原子',460,790,{size:68,color:C.ink,anchor:'middle',weight:700}));
  s+=nansho(swin(ctx,p,1,0,.35));
  s+=note('絵は 簡単に しています',40,900);
  return s;},
 // 11a 予想してください
 [K+'guess2:ask']:(p,ctx)=>nansho(1)+tag('予想',960,60,{anchor:'end',g:vseg(ctx,p,0,.6)})+bigQ(460,560,vseg(ctx,p,.2,.8),240),
 // 11b 同じ種類の原子を二つ：A 少し違う／B まったく同じ → 3・2・1
 [K+'guess2:opts']:(p,ctx)=>{const w=sentWin(ctx);
  let s=nansho(1)+tag('予想',960,60,{anchor:'end'});
  s+=fade(1-vseg(ctx,p,0,.08),bigQ(460,560,1,240));
  s+=qhead('同じ 種類の 原子を 二つ','どこか 違う？',swin(ctx,p,0,.05,.4));
  s+=cards(G2,{y0:340,h:130,gap:34,show:[swin(ctx,p,0,.82,.97),swin(ctx,p,1,0,.5)]});
  s+=countdown(p,ctx,860);
  return s;},
 // 12a 答え B：まったく同じ。宇宙のどこでも
 [K+'guess2:ans']:(p,ctx)=>{const tg=ctx.tg,o=swin(ctx,p,1,0,.2),b=swin(ctx,p,1,.1,.5),c=swin(ctx,p,1,.6,.9);
  let s=nansho(1)+fade(1-o,tag('予想',960,60,{anchor:'end'})+qhead('同じ 種類の 原子を 二つ','どこか 違う？',1)+cards(G2,{y0:340,h:130,gap:34,hl:1,a:swin(ctx,p,0,.1,.5)}));
  if(b>0){
   s+=fade(b,earth(200,300,100,20*tg)+label('地球の そば',200,460,{size:40,color:'#8ec0ff',anchor:'middle',weight:700}));
   let st=sunIcon(730,300,40,{color:'#fff1b8'});[[640,240],[860,380],[660,390],[870,220]].forEach(([x,y])=>{st+=dot(x,y,5,'#fff1b8');});
   s+=fade(b,st+label('遠い 星の そば',730,460,{size:40,color:'#fff1b8',anchor:'middle',weight:700}));
   s+=fade(b,atomIcon(250,640,.36,tg)+atomIcon(680,640,.36,tg)+label('セシウム',250,770,{size:38,color:HC,anchor:'middle',weight:700})+label('セシウム',680,770,{size:38,color:HC,anchor:'middle',weight:700}));
   s+=fade(c,label('＝',465,670,{size:110,color:HC,anchor:'middle',weight:700})+label('まったく 同じ',465,870,{size:48,color:HC,anchor:'middle',weight:700}));
  }
  return s;},
 // 12b 水晶は1個ずつ違う／原子には作るときのばらつきがない
 [K+'atom:nospread']:(p,ctx)=>{const tg=ctx.tg,t=cueT(p,ctx),a=vseg(ctx,p,0,.3),b=vseg(ctx,p,.3,.6),c=vseg(ctx,p,.65,.95);
  let s=nansho(1);
  s+=fade(a,label('水晶',230,160,{size:46,color:QUARTZ,anchor:'middle',weight:700})+quartzPlate(230,260,210,74,{vib:.6,t})+quartzPlate(230,390,170,64,{vib:.6,t:t+.3})+quartzPlate(230,510,240,82,{vib:.6,t:t+.6})
   +label('1個ずつ 違う',230,640,{size:42,color:C.a,anchor:'middle',weight:700}));
  s+=fade(b,label('セシウム 原子',690,160,{size:46,color:HC,anchor:'middle',weight:700})+atomIcon(690,260,.24,tg)+atomIcon(690,390,.24,tg)+atomIcon(690,510,.24,tg)
   +label('どれも 同じ',690,640,{size:42,color:C.F,anchor:'middle',weight:700}));
  s+=fade(b,line(460,140,460,660,{color:C.faint,w:3}));
  s+=fade(c,plate('作るときの ばらつきが ない',460,790,{size:48,color:HC,anchor:'middle'}));
  return s;},
 // 13a セシウム：中心に原子核、一番外側に電子が一つ
 [K+'cs:parts']:(p,ctx)=>{const tg=ctx.tg,n=swin(ctx,p,0,.1,.35),e=swin(ctx,p,0,.5,.85);
  let s=nansho(1)+csAtom({nucG:n,elG:e,inner:e*.8,tg});
  s+=fade(n,label('原子核',NUC[0]-110,NUC[1]+14,{size:42,color:C.ink,anchor:'end',weight:700}));
  s+=fade(e,label('一番 外側の 電子',EP[0]-40,EP[1]-70,{size:40,color:WAVEC,anchor:'middle',weight:700}));
  s+=fade(e,label('（内側の 電子は うすく）',460,800,{size:36,color:C.dim,anchor:'middle'}));
  s+=note('絵は 簡単に しています',40,900);
  return s;},
 // 13b 原子核も電子も小さな磁石
 [K+'cs:magnets']:(p,ctx)=>{const tg=ctx.tg,m=vseg(ctx,p,.15,.5),pl=vseg(ctx,p,.55,.85);
  let s=nansho(1)+csAtom({magG:m,inner:.8,tg});
  s+=label('原子核',NUC[0]-110,NUC[1]+14,{size:42,color:C.ink,anchor:'end',weight:700})+label('一番 外側の 電子',EP[0]-40,EP[1]-70,{size:40,color:WAVEC,anchor:'middle',weight:700});
  s+=fade(pl,plate('どちらも 小さな 磁石',460,800,{size:48,color:HC,anchor:'middle'}));
  s+=note('絵は 簡単に しています',40,900);
  return s;},
 // 14 向きの組み合わせで二段のエネルギー。差はぴったり決まった大きさ
 [K+'cs:levels']:(p,ctx)=>{
  let s=nansho(1)+levelsFig({cmb:swin(ctx,p,0,.15,.5),lev:swin(ctx,p,0,.5,.85),axis:swin(ctx,p,0,.5,.8),gap:swin(ctx,p,1,0,.35),gapLabel:swin(ctx,p,1,.35,.75)});
  s+=note('絵は 簡単に しています',40,900);
  return s;},
 // 15 差にちょうど合う電波のときだけ、ひっくり返る
 [K+'cs:flip']:(p,ctx)=>{const tg=ctx.tg,w1=vseg(ctx,p,.05,.35),w2=vseg(ctx,p,.38,.65),fl=vseg(ctx,p,.66,.8);
  let s=nansho(1)+levelsFig({gap:1,hlLevel:fl>.5?0:1,hlG:1});
  const pk=(u,lam,col)=>{if(u<=0||u>=1)return '';const cx=mix(40,560,u),env=x=>Math.exp(-(((x-cx)/90)**2));return wave(Math.max(40,cx-200),Math.min(600,cx+200),470,{amp:36,lam,ph:tg*8,color:col,env});};
  s+=pk(w1,90,'#8aa0c4')+pk(w2,40,WAVEC);
  s+=fade(seg(w1,.1,.3)*(1-seg(w1,.9,1)),plate('差に 合わない → そのまま',60,860,{size:40,color:C.dim}));
  s+=fade(seg(w2,.1,.3),plate('ちょうど 差に 合う',60,860,{size:40,color:WAVEC}));
  // 原子の印：下の段 → 上の段
  const my=mix(LL,LU,fl);
  s+=dot(300,my,28,HC,.3)+dot(300,my,16,HC)+label('原子',300,my-40,{size:38,color:HC,anchor:'middle',weight:700});
  s+=fade(vseg(ctx,p,.78,.95),plate('ひっくり 返る',200,210,{size:48,color:HC}));
  s+=note('絵は 簡単に しています',560,900);
  return s;},
 // 16a 振動数が決まると、一度に渡せるエネルギーも決まる
 [K+'quanta:rule']:(p,ctx)=>{const tg=ctx.tg;
  return nansho(1)+quantaFig({wv:vseg(ctx,p,.05,.3),fl:vseg(ctx,p,.25,.5),bl:vseg(ctx,p,.55,.8),pl:vseg(ctx,p,.8,.97),tg});},
 // 16b 実験で分かった決まり。なぜかは大きな謎（いつか別の動画で）
 [K+'quanta:mystery']:(p,ctx)=>{const tg=ctx.tg;
  let s=nansho(1)+quantaFig({tg,pl:1-vseg(ctx,p,.35,.5),dim:.45*vseg(ctx,p,.4,.55)});
  s+=tag('実験で 分かった 決まり',960,60,{anchor:'end',color:'#edf4ff',size:40,g:vseg(ctx,p,.05,.3)});
  s+=fade(vseg(ctx,p,.45,.6),label('なぜ？',460,770,{size:96,color:HC,anchor:'middle',weight:700}));
  s+=fade(vseg(ctx,p,.78,.92),label('大きな 謎',720,770,{size:48,color:HC,weight:700}));
  s+=fade(vseg(ctx,p,.86,1),label('→ いつか 別の 動画で',460,880,{size:36,color:C.dim,anchor:'middle'}));
  return s;},
 // 17 段差＝電波のひとかたまり＝振動数。ただ一つ：1秒に 9,192,631,770 回
 [K+'cs:one']:(p,ctx)=>{const tg=ctx.tg,a=swin(ctx,p,0,.05,.3),b=swin(ctx,p,0,.3,.6),c=swin(ctx,p,0,.6,.9),d=swin(ctx,p,1,.2,.6);
  let s=nansho(1);
  s+=fade(a,line(80,170,300,170,{color:'#c4cde0',w:6})+line(80,330,300,330,{color:'#c4cde0',w:6})+line(190,180,190,320,{color:HC,w:5})+label('段差',190,400,{size:42,color:HC,anchor:'middle',weight:700}));
  s+=fade(b,label('＝',350,280,{size:64,color:C.dim,anchor:'middle',weight:700})+rect(410,180,200,140,{fill:HC,fo:.75,stroke:'#fff1b8',sw:3,rx:10})+label('電波の',510,400,{size:40,color:C.ink,anchor:'middle',weight:700})+label('ひとかたまり',510,450,{size:40,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(c,label('＝',660,280,{size:64,color:C.dim,anchor:'middle',weight:700})+wave(700,900,250,{amp:36,lam:40,ph:tg*8})+label('振動数',800,400,{size:40,color:WAVEC,anchor:'middle',weight:700})+label('ただ 一つ',800,450,{size:40,color:HC,anchor:'middle',weight:700}));
  s+=fade(d,label('1秒に',60,580,{size:48,color:C.ink,weight:700})+rect(40,610,840,140,{fill:BOX,fo:.95,stroke:HC,sw:4,rx:18})+digits('9,192,631,770',430,712,{size:84,color:HC})+label('回',850,712,{size:52,color:HC,anchor:'end',weight:700}));
  return s;},
 // 18a 1967年、1秒の決め方が変わった
 [K+'sec:year']:(p,ctx)=>{
  let s=nansho(1)+fade(vseg(ctx,p,0,.3),label('1967年',460,330,{size:140,color:TCOL,anchor:'middle',weight:700}));
  s+=fade(vseg(ctx,p,.45,.8),label('1秒の 決め方が 変わる',460,520,{size:52,color:C.ink,anchor:'middle',weight:700}));
  const g=vseg(ctx,p,.6,.95);
  s+=fade(g,label('地球の 自転',300,700,{size:46,color:C.dim,anchor:'middle',weight:700}))+strike(170,430,686,seg(g,.3,.8));
  s+=fade(seg(g,.5,1),arrow(480,690,600,690,{color:C.dim,w:5,head:20})+label('？',680,720,{size:96,color:HC,anchor:'middle',weight:700}));
  return s;},
 // 18b この電波が 9,192,631,770 回揺れる時間 ＝ 今の1秒（定義）
 [K+'sec:count']:(p,ctx)=>{const tg=ctx.tg,N=9192631770;
  const a=swin(ctx,p,0,0,.15),wv=swin(ctx,p,0,.05,.2),u=swin(ctx,p,0,.2,.92),s1=swin(ctx,p,1,0,.4),df=swin(ctx,p,1,.35,.7);
  let s=nansho(1)+atomIcon(150,230,.34,tg,{g:a})+fade(a,label('セシウム',150,360,{size:40,color:HC,anchor:'middle',weight:700}));
  s+=fade(wv,wave(290,900,230,{amp:38,lam:64,ph:tg*7})+label('電波の 揺れ',300,150,{size:40,color:WAVEC,weight:700}));
  const v=u>=1?N:Math.floor(N*easeOut(lin(u,0,1)));
  s+=fade(wv,label('揺れた 回数',60,450,{size:40,color:C.dim,weight:700})+rect(40,470,820,150,{fill:BOX,fo:.95,stroke:u>=1?HC:'#8aa0c4',sw:4,rx:18})
   +digits(comma(v),420,575,{size:82,color:u>=1?HC:C.ink})+label('回',820,575,{size:52,color:u>=1?HC:C.ink,anchor:'end',weight:700}));
  s+=fade(s1,label('この 時間 ＝ 今の 1秒',460,740,{size:60,color:TCOL,anchor:'middle',weight:700}));
  s+=tag('定義',960,60,{anchor:'end',text:'1967年から',g:df});
  s+=fade(wv,note('揺れは ゆっくりに 描いています',40,900));
  return s;},
 // 19 1秒に91億回の揺れを、どう数える？
 [K+'tune:q']:(p,ctx)=>{const tg=ctx.tg;
  let s=atomIcon(150,250,.34,tg)+label('セシウム',150,380,{size:40,color:HC,anchor:'middle',weight:700});
  s+=wave(280,960,250,{amp:42,lam:9,ph:tg*40,w:3});
  s+=fade(vseg(ctx,p,.12,.4),label('1秒に 91億回',300,150,{size:48,color:WAVEC,weight:700}));
  s+=fade(vseg(ctx,p,.35,.6),plate('速すぎて 見えない',620,390,{size:44,color:C.ink,anchor:'middle'}));
  s+=bigQ(450,760,vseg(ctx,p,.6,.9),240);
  s+=note('波は 本当より ずっと 少なく 描いています',40,900);
  return s;},
 // 20 まず磁石で、向きの組み合わせが同じ原子だけを選び出す
 [K+'beam:select']:(p,ctx)=>{const tg=ctx.tg;
  return selectFig(tg,{mag:vseg(ctx,p,.1,.35),flow:vseg(ctx,p,0,.15),lab1:vseg(ctx,p,.5,.75),lab2:vseg(ctx,p,.75,.95)});},
 // 20b 最初からひっくり返った原子は混ざらない
 [K+'beam:clean']:(p,ctx)=>selectFig(ctx.tg,{lab1:1,lab2:1,lab3:vseg(ctx,p,.3,.7)}),
 // 21 次に、電波を原子の流れに当て、ひっくり返った原子を数える

 [K+'beam:on']:(p,ctx)=>{const tg=ctx.tg,src=swin(ctx,p,0,.15,.4),on=swin(ctx,p,0,.5,.8),cg=swin(ctx,p,1,.3,.6);
  const from=tg-cueT(p,ctx)+sentWin(ctx)[1][0]+.3*(sentWin(ctx)[1][1]-sentWin(ctx)[1][0]);
  let s=beamFig(tg,{src,on,p:.85*on,cntG:cg,cntFrom:from})+selMini(1);
  s+=fade(swin(ctx,p,1,0,.3),plate('ひっくり返った 原子は 光る',60,800,{size:40,color:HC}));
  s+=note('絵は 簡単に しています',40,900);
  return s;},
 // 21a 振動数がずれると、ひっくり返る原子は減る
 [K+'beam:off']:(p,ctx)=>{const tg=ctx.tg,d=.75*vseg(ctx,p,.1,.6),pr=.85*resp(d),m=vseg(ctx,p,0,.15);
  let s=beamFig(tg,{src:1,on:1,p:pr});
  s+=selMini(1);
  s+=fade(m,label('電波の 振動数',60,560,{size:40,color:C.dim,weight:700})+rect(330,530,480,40,{fill:BOX,fo:1,stroke:'#8aa0c4',sw:3,rx:8})+line(570,520,570,580,{color:HC,w:4,dash:'6 6'})+dot(570+220*d,550,16,WAVEC)+label('ぴったり',570,630,{size:36,color:HC,anchor:'middle',weight:700}));
  s+=fade(m,label('ひっくり返る 数',60,720,{size:40,color:C.dim,weight:700})+rect(370,690,440,44,{fill:BOX,fo:1,stroke:HC,sw:3,rx:8})+rect(370,690,440*pr/.85,44,{fill:HC,fo:.85,stroke:'none',rx:8}));
  s+=fade(vseg(ctx,p,.6,.85),plate('ずれると 減る',60,830,{size:46,color:C.a}));
  s+=note('絵は 簡単に しています',560,900);
  return s;},
 // 21b ひっくり返る数が一番多くなるように合わせ続ける
 [K+'dial:peak']:(p,ctx)=>{const tg=ctx.tg,u=vseg(ctx,p,0,.95);
  return dialFig(tg,dialD(u,tg),{top:vseg(ctx,p,.75,.95),back:vseg(ctx,p,.85,1)});},
 // 21c ラジオの選局と同じ
 [K+'dial:radio']:(p,ctx)=>{const tg=ctx.tg;
  return dialFig(tg,.05*Math.sin(tg*3),{top:1,back:1})+radio(vseg(ctx,p,0,.15),vseg(ctx,p,.1,.7),tg,vseg(ctx,p,.5,.85));},
 // 22a 電子回路が数え、9,192,631,770 回ごとに 1秒の目盛り
 [K+'tune:count']:(p,ctx)=>{const tg=ctx.tg,t=cueT(p,ctx),N=9192631770,a=vseg(ctx,p,0,.12),b=vseg(ctx,p,.12,.3),u=vseg(ctx,p,.35,.72),tr=.72*voiceEnd(ctx);
  let s=fade(a,rect(40,110,260,180,{fill:BOX,fo:.95,stroke:'#c4cde0',sw:4,rx:18})+atomIcon(170,200,.3,tg)+dot(170,200,60,HC,.18)+label('合わせた 電波',170,330,{size:38,color:WAVEC,anchor:'middle',weight:700}));
  s+=fade(a,wave(305,520,200,{amp:28,lam:40,ph:tg*7}));
  s+=fade(b,rect(530,140,330,120,{fill:'#1f2d4d',fo:1,stroke:HC,sw:3,rx:12})+label('電子回路',695,195,{size:40,color:HC,anchor:'middle',weight:700})+label('数える',695,245,{size:40,color:HC,anchor:'middle',weight:700}));
  const cyc=t>tr?Math.floor((t-tr)/.9):0,ph=t>tr?((t-tr)/.9)%1:0;
  const v=u<1?Math.floor(N*easeOut(u)):Math.floor(N*Math.min(1,ph*1.15));
  s+=fade(b,label('数えた 回数',60,410,{size:40,color:C.dim,weight:700})+rect(40,425,820,150,{fill:BOX,fo:.95,stroke:'#8aa0c4',sw:4,rx:18})+digits(comma(u<1?v:(ph<.06?N:v)),420,530,{size:82,color:C.ink})+label('回',820,530,{size:52,color:C.ink,anchor:'end',weight:700}));
  // 1秒の目盛り
  const ticks=u>=1?1+cyc:0;
  s+=fade(vseg(ctx,p,.6,.75),line(60,760,860,760,{color:C.dim,w:4})+label('時間',60,720,{size:38,color:C.dim,weight:700}));
  for(let k=0;k<Math.min(4,ticks);k++){const x=160+k*200;s+=line(x,730,x,790,{color:TCOL,w:6})+label(`${k+1}秒`,x,850,{size:40,color:TCOL,anchor:'middle',weight:700});}
  s+=note('揺れは ゆっくりに 描いています',40,900);
  return s;},
 // 22b 何万年たっても 1秒も狂わない
 [K+'aclock:box']:(p,ctx)=>{const tg=ctx.tg,a=vseg(ctx,p,0,.15),b=vseg(ctx,p,.1,.6),c=vseg(ctx,p,.6,.95);
  let s=fade(a,rect(80,130,740,410,{fill:BOX,fo:.95,stroke:'#c4cde0',sw:5,rx:24})+atomIcon(220,280,.36,tg)+wave(330,560,280,{amp:26,lam:44,ph:tg*7})
   +rect(570,235,170,90,{fill:'#1f2d4d',fo:1,stroke:HC,sw:3,rx:10})+label('数える',655,293,{size:40,color:HC,anchor:'middle',weight:700})
   +rect(180,400,540,100,{fill:'#050a16',fo:1,stroke:'#8aa0c4',sw:3,rx:10}));
  const sec=Math.floor(tg)%60;
  s+=fade(a,digits(`12:00:${String(sec).padStart(2,'0')}`,450,475,{size:64,color:WAVEC}));
  s+=fade(a,label('原子時計',450,90,{size:56,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(b,label('何万年 たっても',60,640,{size:44,color:C.ink,weight:700})+rect(60,670,780,44,{fill:BOX,fo:1,stroke:TCOL,sw:3,rx:8})+rect(60,670,780*b,44,{fill:TCOL,fo:.7,stroke:'none',rx:8}));
  s+=fade(c,label('ずれは 1秒 未満',60,815,{size:56,color:HC,weight:700}));
  return s;},
 // 23 衛星には原子時計
 [K+'aclock:sat']:(p,ctx)=>{const tg=ctx.tg,g=vseg(ctx,p,0,.3),c=vseg(ctx,p,.4,.7);
  let s=fade(g,groundArc());
  const sx=450+12*Math.sin(tg*.8),sy=300;
  s+=satellite(sx,sy,{s:1.25,g,inner:atomIcon(sx,sy,.17,tg)});
  s+=fade(g,label('衛星',sx,170,{size:46,color:C.ink,anchor:'middle',weight:700}));
  for(let k=0;k<3;k++){const ph=((tg*.7+k/3)%1);s+=fade(g*(1-ph)*.8,`<path d="M${n1(sx-60-120*ph)} ${n1(sy+110+90*ph)} Q${n1(sx)} ${n1(sy+150+140*ph)} ${n1(sx+60+120*ph)} ${n1(sy+110+90*ph)}" fill="none" stroke="${WAVEC}" stroke-width="4"/>`);}
  s+=fade(c,line(sx+20,sy+20,560,500,{color:HC,w:3})+plate('原子時計',560,540,{size:48,color:HC}));
  return s;},
 // 24a 打ち上げると、地上の時計と毎日少しずつずれる
 [K+'drift:launch']:(p,ctx)=>{const tg=ctx.tg,t0=voiceEnd(ctx)*.75;
  let s=driftScene(p,ctx,tg,{t0});
  s+=fade(vseg(ctx,p,.75,.9),note('ずれは 大きく 誇張',40,60));
  return s;},
 // 24b 原子に、ばらつきはないはずなのに
 [K+'drift:but']:(p,ctx)=>{const tg=ctx.tg;
  let s=driftScene(p,ctx,tg,{t0:DRIFT_T0(ctx)})+note('ずれは 大きく 誇張',40,60);
  s+=fade(vseg(ctx,p,.1,.5),plate('原子に ばらつきは ない はず',60,700,{size:44,color:C.ink}));
  s+=fade(vseg(ctx,p,.5,.9),label('？',560,620,{size:120,color:HC,anchor:'middle',weight:700}));
  return s;},
 // 25 狂ったのは、時計？ それとも時間そのもの？
 [K+'drift:q']:(p,ctx)=>{const tg=ctx.tg,d=vseg(ctx,p,0,.2);
  let s=fade(1-.75*d,driftScene(p,ctx,tg,{t0:DRIFT_T0(ctx)}));
  const card=(x,txt,g)=>fade(g,scaleAt(x,330,.92+.08*g,rect(x-190,250,380,160,{fill:'#131f38',fo:.96,stroke:HC,sw:5,rx:22})+label(txt,x,355,{size:64,color:HC,anchor:'middle',weight:700})));
  s+=card(260,'時計？',swin(ctx,p,0,.3,.7))+card(680,'時間？',swin(ctx,p,1,.25,.65));
  s+=bigQ(460,720,vseg(ctx,p,.8,1),220);
  return s;},
};
// 反応の山（ひっくり返る数）とつまみ
function dialFig(tg,d,{top=0,back=0}={}){const gl=resp(d);
 let s=knob(170,300,80,d)+label('振動数の',170,430,{size:38,color:C.ink,anchor:'middle',weight:700})+label('つまみ',170,475,{size:38,color:C.ink,anchor:'middle',weight:700});
 const X0=360,X1=900,Y0=500,HH=320,xc=(X0+X1)/2,xs=v=>xc+v*230;
 s+=line(X0,Y0,X1,Y0,{color:C.dim,w:3})+line(X0,Y0,X0,Y0-HH-20,{color:C.dim,w:3});
 const pts=[];for(let k=0;k<=80;k++){const v=-1.17+2.34*k/80;pts.push([xs(v),Y0-HH*resp(v)]);}
 s+=draw(pts,1,{color:'#8aa0c4',w:4});
 s+=label('ひっくり返る 数',X0+14,Y0-HH-20,{size:38,color:HC,weight:700})+label('振動数',X1,Y0+50,{size:38,color:C.dim,anchor:'end',weight:700});
 s+=dot(xs(d),Y0-HH*gl,18,HC)+line(xs(d),Y0,xs(d),Y0-HH*gl,{color:HC,w:2,dash:'6 6'});
 s+=fade(top,plate('一番 上で 止める',xc+60,Y0-HH-80,{size:40,color:HC,anchor:'middle'}));
 s+=fade(back,label('ずれたら すぐ 戻す',X0+20,Y0+50,{size:38,color:C.dim,weight:700}));
 s+=note('山の 幅は 大きく 誇張',560,900);
 return s;}
// 24b・25 では、24a の声の 75% の時刻（組の秒）からずれを数え続ける。19 の長さは台本の caption から取る。
function DRIFT_T0(ctx){
 const sc=ctx.scene,i=sc.cues.findIndex(q=>q.diagram===K+'drift:launch');
 if(i<0||!sc.captions?.[i])return 0;
 const cap=sc.captions[i],q=sc.cues[i],ve=Math.max(.5,(cap.end-cap.start)-.12-(q.pause||0));
 return ve*.75;
}

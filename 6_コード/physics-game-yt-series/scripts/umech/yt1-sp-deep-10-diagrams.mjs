// 深掘りショート 10（ys-deep-10）「高い所の時計は、なぜ速く進む？」— 図。縦長の舞台 1000×920（vert-v1）。
// 共通の形は yt1-sp-deep-common.mjs。値の検算は台本 docs/video-revision-20260924/ytseries/sp-deep-10.mjs の冒頭。
// この回で作った形（他の回の図ファイルには頼らない）：地球（earth・groundArc）、衛星（sat）、時計（clock）、人（person）、
//  窓のない箱（liftBox）、塔（tower）、スカイツリー（skytree、簡単な形）、スマホ（phone）、地図のピン（pin）、ブラックホール（blackHole）。
// 色：＋（速く進む）は赤 RED の上向き、−（遅れる）は青 BLUE の下向き、差し引きは黄。重力の矢印は力の色（C.F）。時計の秒針は時間の色（C.t）。
import {C,seg,lin,clamp,mix,fade,label,line,rect,dot,ring,draw,arrow,poly,scaleAt} from './anim.mjs';
import {W,H,HC,LIGHT,cueT,voiceEnd,vseg,swin,tag,note,plate,bigQ,finalCard,eye} from './yt1-sp-deep-common.mjs';

const K='deep10-',PI=Math.PI;
const RED='#ff5a4e',BLUE='#4a95ff',GRAV=C.F,TC=C.t,RADIO=C.v;
const EARTHC='#2f6fd6',GOLD='#e3b341',PANEL='#3f78e0',SKY='#c9d3e6';
const PRED='#ffb36b';
const f1=v=>Number(v).toFixed(1);
const cs=Math.cos,sn=Math.sin;
// 場面（S）の中の時刻：i 番目の cue の始まり（秒）
const capStart=(ctx,i)=>ctx?.scene?.captions?.[i]?.start??0;
const sceneT=(p,ctx)=>capStart(ctx,ctx?.k??0)+cueT(p,ctx);

// ================= 形 =================
function earth(cx,cy,R,{g=1}={}){
 let s=`<defs><radialGradient id="d10E" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#4f8ef0"/><stop offset=".7" stop-color="${EARTHC}"/><stop offset="1" stop-color="#1d4594"/></radialGradient></defs>`;
 s+=ring(cx,cy,R+Math.min(9,R*.08),{color:'#7fb2ff',w:Math.min(7,R*.06)})+`<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(R)}" fill="url(#d10E)"/>`;
 s+=`<path d="M${f1(cx-R*.55)} ${f1(cy-R*.35)} q${f1(R*.3)} ${f1(-R*.3)} ${f1(R*.6)} ${f1(-R*.05)} q${f1(R*.1)} ${f1(R*.3)} ${f1(-R*.15)} ${f1(R*.5)} q${f1(-R*.3)} ${f1(R*.1)} ${f1(-R*.45)} ${f1(-R*.45)}Z" fill="#3fae6a" fill-opacity=".85"/>`;
 return fade(g,s);
}
// 舞台の下の大きな地面（地球の一部）。上の端 y＝820（x＝500）
const GA={cx:500,cy:2280,R:1460};
function groundArc({g=1}={}){
 return fade(g,ring(GA.cx,GA.cy,GA.R+8,{color:'#7fb2ff',w:6})+`<circle cx="${GA.cx}" cy="${GA.cy}" r="${GA.R}" fill="${EARTHC}" fill-opacity=".9"/>`
  +`<path d="M140 900 q120 -50 260 -62 q90 10 120 40 q-60 30 -380 22Z" fill="#3fae6a" fill-opacity=".7"/>`);
}
function sat(x,y,k=1,{g=1,glow=0}={}){
 const b=13*k,pw=34*k,ph=13*k;
 let s='';
 if(glow)s+=dot(x,y,34*k,GOLD,.18*glow);
 s+=line(x-b-pw-2,y,x+b+pw+2,y,{color:SKY,w:2*k});
 for(const sg of [-1,1]){const px=sg<0?x-b-4*k-pw:x+b+4*k;
  s+=rect(px,y-ph/2,pw,ph,{fill:PANEL,fo:1,stroke:'#9cc0ff',sw:1.5,rx:2});
  for(let i=1;i<3;i++)s+=line(px+pw*i/3,y-ph/2,px+pw*i/3,y+ph/2,{color:'#9cc0ff',w:1});}
 s+=rect(x-b,y-b,2*b,2*b,{fill:GOLD,fo:1,stroke:'#fff0b8',sw:1.5,rx:3});
 s+=line(x,y+b,x,y+b+8*k,{color:SKY,w:2*k})+dot(x,y+b+9*k,3*k,SKY);
 return fade(g,s);
}
// 時計。ph＝針の位置（秒。秒針は6秒で1周）。ghost＝点線の針（比べる相手の時刻）
function clock(x,y,R,{ph=0,g=1,col=C.ink,ghost=null,hands=true,sy=1}={}){
 let s=dot(x,y,R+6,'#0e1830')+ring(x,y,R,{color:col,w:R>50?5:3,fill:'#1a2745'});
 for(let i=0;i<12;i++){const a=i*PI/6;s+=line(x+R*.8*cs(a),y+R*.8*sn(a),x+R*.94*cs(a),y+R*.94*sn(a),{color:C.ink,w:i%3?2:4});}
 if(hands){
  const as=ph*2*PI/6-PI/2,am=ph*2*PI/72-PI/2,ah=ph*2*PI/864-PI/2-.9;
  if(ghost!==null){const ag=ghost*2*PI/6-PI/2;s+=line(x,y,x+R*.86*cs(ag),y+R*.86*sn(ag),{color:C.dim,w:R>50?4:3,dash:'7 6'});}
  s+=line(x,y,x+R*.5*cs(ah),y+R*.5*sn(ah),{color:C.ink,w:R>50?7:5});
  s+=line(x,y,x+R*.74*cs(am),y+R*.74*sn(am),{color:C.ink,w:R>50?5:4});
  s+=line(x,y,x+R*.86*cs(as),y+R*.86*sn(as),{color:TC,w:R>50?4:3})+dot(x,y,R>50?7:5,TC);
 }
 if(sy!==1)s=`<g transform="translate(${f1(x)} ${f1(y)}) scale(1 ${sy}) translate(${f1(-x)} ${f1(-y)})">${s}</g>`;
 return fade(g,s);
}
// 立っている人（yF＝足）
function person(x,yF,h,{col='#8fa3c7',g=1}={}){
 const hr=h*.1,hy=yF-h+hr;
 let s=dot(x,hy,hr,col);
 s+=rect(x-h*.13,yF-h*.78,h*.26,h*.4,{fill:col,fo:1,stroke:col,sw:1,rx:h*.08});
 for(const sg of [-1,1])s+=line(x+sg*h*.06,yF-h*.42,x+sg*h*.08,yF-h*.02,{color:col,w:h*.08});
 s+=line(x-h*.12,yF-h*.72,x-h*.2,yF-h*.45,{color:col,w:h*.055});
 s+=line(x+h*.12,yF-h*.72,x+h*.3,yF-h*.55,{color:col,w:h*.055}); // 前に出した手
 return fade(g,s);
}
// 東京スカイツリー（簡単な形）。yB＝根もと、h＝高さ（634 m）。展望台 350 m・450 m
function skytree(x,yB,h,{g=1}={}){
 const yT=yB-h,col=SKY,yd=v=>yB-h*v/634;
 let s=poly([[x-.12*h,yB],[x+.12*h,yB],[x+.014*h,yd(560)],[x-.014*h,yd(560)]],{fill:col,fo:.22,stroke:col,sw:3});
 for(let i=1;i<10;i++){const y=yB-i*.085*h,hw=mix(.12*h,.014*h,(yB-y)/(yB-yd(560)));s+=line(x-hw,y,x+hw,y,{color:col,w:2,opacity:.5});}
 s+=line(x,yd(560),x,yT,{color:col,w:4});
 s+=rect(x-.05*h,yd(350)-10,.1*h,20,{fill:col,fo:.9,stroke:col,rx:4});
 s+=rect(x-.035*h,yd(450)-8,.07*h,16,{fill:col,fo:.9,stroke:col,rx:4});
 return fade(g,s);
}
function phone(x,y,h,{g=1,dotOn=1,t=0,grid=true}={}){
 const w=h*.52;
 let s=rect(x-w/2,y-h/2,w,h,{fill:'#20283a',fo:1,stroke:SKY,sw:Math.max(3,h*.012),rx:h*.08});
 const sx=x-w/2+h*.03,sy=y-h/2+h*.07,sw=w-h*.06,sh=h*.86;
 s+=rect(sx,sy,sw,sh,{fill:'#13294d',fo:1,stroke:'#13294d',sw:1,rx:4});
 if(grid){
  s+=`<clipPath id="d10ph"><rect x="${f1(sx)}" y="${f1(sy)}" width="${f1(sw)}" height="${f1(sh)}"/></clipPath><g clip-path="url(#d10ph)">`;
  for(let k=-6;k<=6;k++){s+=line(x+k*h*.12,sy,x+k*h*.12+h*.1,sy+sh,{color:'#2c4a7a',w:Math.max(2,h*.012)});s+=line(sx,y+k*h*.13,sx+sw,y+k*h*.13-h*.05,{color:'#2c4a7a',w:Math.max(2,h*.012)});}
  s+=`<path d="M${f1(sx)} ${f1(y+h*.2)} q${f1(sw*.4)} ${f1(-h*.08)} ${f1(sw)} ${f1(-h*.02)}" stroke="#2f7a5a" stroke-width="${f1(h*.03)}" fill="none"/>`+'</g>';
 }
 if(dotOn){const pr=h*.05;s+=fade(dotOn,dot(x,y,pr*(2.2+.4*sn(t*4)),'#4c8dff',.25)+dot(x,y,pr,'#4c8dff')+ring(x,y,pr+2,{color:'#fff',w:Math.max(2,h*.008)}));}
 return fade(g,s);
}
function pin(x,y,r=30,{g=1,col=RED}={}){
 const cy=y-1.75*r,a=.55;
 let s=poly([[x,y],[x-r*cs(a),cy+r*sn(a)],[x+r*cs(a),cy+r*sn(a)]],{fill:col,fo:1,stroke:col});
 s+=dot(x,cy,r,col)+dot(x,cy,r*.4,'#fff');
 return fade(g,s);
}
const up=(x,y0,len,{color=RED,g=1,w=8,head=26}={})=>arrow(x,y0,x,y0-len,{color,g,w,head});
const down=(x,y0,len,{color=BLUE,g=1,w=8,head=26}={})=>arrow(x,y0,x,y0+len,{color,g,w,head});

// ================= 1〜3 疑問：地上と衛星 =================
const QG=[330,690],QS=[540,175],QSC=[820,205],TS=[200,620];
// 打ち上げ前の調整：声の 62% から つまみを回し、その後は 0.8 倍で進む（大きく誇張）。T＝組の中の秒、ve＝16 の声の長さ
const tunePh=(T,ve)=>{const k0=.62*ve,u=Math.max(0,T-k0);return T-.2*u*clamp(u/(ve*.25));};
// 衛星の時計は q:rate の始まりから速く進む（見えるように 1.35 倍、大きく誇張）
function qPhase(p,ctx){const tg=ctx?.tg??cueT(p,ctx),g0=sceneT(p,ctx)-tg,t2=capStart(ctx,1)-g0;return [tg,tg+.35*Math.max(0,tg-t2)];}
function qScene(p,ctx,{hgt=0,culprit=0,slow=0,fast=0,diff=0,grav=0}={}){
 const [pg,ps]=qPhase(p,ctx);
 let s=groundArc();
 s+=sat(QS[0],QS[1],2.2);
 s+=line(QG[0],QG[1]+86,QG[0],820,{color:SKY,w:6});
 s+=clock(QG[0],QG[1],80,{ph:pg})+label('地上の 時計',QG[0],QG[1]-104,{size:38,anchor:'middle',weight:700});
 s+=clock(QSC[0],QSC[1],80,{ph:ps})+label('衛星の 時計',QSC[0],QSC[1]+130,{size:38,anchor:'middle',weight:700});
 s+=fade(culprit*(1-hgt)*(1-grav),plate('犯人は？',500,470,{size:44,color:HC,anchor:'middle'}));
 s+=fade(grav,down(720,590,160,{color:GRAV,g:grav,w:8,head:26})+plate('重力',760,690,{size:48,color:GRAV}));
 if(hgt>0){
  s+=fade(hgt,arrow(110,800,110,200,{color:HC,w:7,head:28,g:hgt})+arrow(110,210,110,800,{color:HC,w:7,head:28,g:seg(hgt,.5,1)}));
  s+=fade(seg(hgt,.4,1),label('高さ',140,500,{size:52,color:HC,weight:700}));
 }
 if(slow>0){
  s+=fade(slow,plate('地面に 近い',QG[0]+100,QG[1]-20,{size:40}));
  s+=fade(seg(slow,.5,1),plate('ゆっくり',QG[0]+100,QG[1]+40,{size:40,color:BLUE}));
 }
 if(fast>0){
  s+=fade(fast,plate('地面から 遠い',QS[0]-20,300,{size:40,anchor:'end'}));
  s+=fade(seg(fast,.5,1),plate('速い',QSC[0],QSC[1]+190,{size:40,color:RED,anchor:'middle'}));
 }
 s+=fade(diff,plate('進み方の 差は 大きく誇張',40,893,{size:36,color:C.dim,weight:400}));
 return s;
}

// ================= 4 アインシュタイン =================
function bust(x,y,{g=1}={}){
 let s=dot(x,y,70,'#8fa3c7')+`<path d="M${x-140} ${y+230} q0 -130 140 -140 q140 10 140 140Z" fill="#8fa3c7"/>`;
 s+=`<path d="M${x-72} ${y-10} q-10 -80 70 -86 q84 0 78 86 q-14 -40 -30 -44 q-30 -6 -52 -2 q-40 4 -66 46Z" fill="#dfe6f2"/>`; // 白い髪（簡単な形）
 return fade(g,s);
}

// ================= 5〜6 窓のない箱 =================
const LB=[[60,200],[540,200]],LW=340,LH=380;
function liftBox(x0,y0,t,{g=1,ball=1,water=0,push=0}={}){
 let s=rect(x0,y0,LW,LH,{fill:'#16203a',fo:1,stroke:SKY,sw:7,rx:8});
 const px=x0+LW*.4,fy=y0+LH-6;
 s+=person(px,fy,LH*.62);
 const hx=px+LH*.62*.3+8,hy=fy-LH*.62*.55,u=clamp(((t%1.7))/1.05);
 s+=fade(ball,dot(hx,mix(hy,fy-16,u*u),16,C.E));
 const u2=clamp((((t+.5)%1.7))/1.05);
 s+=fade(water,`<path d="M${f1(hx+44)} ${f1(mix(hy,fy-20,u2*u2)-16)} q12 18 0 24 q-12 -6 0 -24Z" fill="${C.x}"/>`);
 s+=fade(push,down(px-10,fy-LH*.62-60,40,{color:HC,w:6,head:18})+down(px+40,fy-LH*.62-60,40,{color:HC,w:6,head:18}));
 return fade(g,s);
}
function liftPair(t,{boxes=1,ball=1,left=0,right=0,same=0,title=0,water=0,push=0}={}){
 let s='';
 s+=fade(title,label('窓のない 箱（エレベーター）',500,140,{size:40,anchor:'middle',weight:700}));
 // 左：地上で止まっている（地面と重力）
 s+=fade(left,rect(40,LB[0][1]+LH+6,420,22,{fill:'#5a6b52',fo:.9,stroke:'none',rx:0})+down(250,LB[0][1]+LH+60,90,{color:GRAV,g:left,w:7,head:22})
  +label('重力',290,LB[0][1]+LH+110,{size:40,color:GRAV,weight:700})+label('地上で 止まっている',250,LB[0][1]+LH+200,{size:38,anchor:'middle',weight:700}));
 // 右：宇宙で上へ加速（星とロケットの火）
 if(right>0){
  let r='';[[600,170],[930,240],[880,120],[530,520],[940,520],[620,700]].forEach(([x,y])=>{r+=dot(x,y,3,'#dfe6f2');});
  const fl=.85+.15*sn(t*30);
  r+=poly([[620,LB[1][1]+LH+6],[730,LB[1][1]+LH+6],[675,LB[1][1]+LH+6+70*fl]],{fill:'#ff9b3e',fo:.9})+poly([[650,LB[1][1]+LH+6],[700,LB[1][1]+LH+6],[675,LB[1][1]+LH+6+40*fl]],{fill:HC,fo:.9});
  r+=up(945,540,220,{color:HC,g:right,w:7,head:24})+label('加速',945,295,{size:40,color:HC,anchor:'middle',weight:700});
  r+=label('宇宙で 上へ 加速',730,LB[1][1]+LH+200,{size:38,anchor:'middle',weight:700});
  s+=fade(right,r);
 }
 s+=liftBox(LB[0][0],LB[0][1],t,{g:boxes,ball,water,push})+liftBox(LB[1][0],LB[1][1],t,{g:boxes,ball,water,push});
 s+=fade(same,label('＝',470,LB[0][1]+LH/2+30,{size:96,color:HC,anchor:'middle',weight:700}));
 return s;
}


// ================= 6〜9 宇宙で加速する箱と、光の合図 =================
// 外から（止まっている人から）見た図。光は画面の上をいつも同じ速さ CL で進む。箱は 組の始め（6）から一様に加速して上へ。
// 加速 a は、6 と 7 の長さ（tA）で箱が AH だけ上がるように決める。合図は 組の秒 TP0 から 間隔 PI2 ごとに床から出す（物語の「1秒」）。
// 値は見えるように大きく誇張（光を遅く、加速を大きく）：CL＝90 px/s、箱の高さ BH＝240 px。
const BX=[300,700],BH=240,FLOOR0=880,AH=400,CL=90,PI2=1.3,TP0=3.2;
// 箱が動くのは 7〜8 の間（組の始めから「予想」の cue の始めまで）
const accT=ctx=>{const cs=ctx?.scene?.cues;const i=cs?cs.findIndex(q=>q.diagram===K+'acc:q'):-1;if(i<0||!ctx?.scene?.captions)return 14;return Math.max(6,capStart(ctx,i)-(capStart(ctx,ctx.k)+ctx.t-ctx.tg));};
const accA=ctx=>{const tA=accT(ctx);return 2*AH/(tA*tA);};
const floorY=(t,a)=>FLOOR0-.5*a*Math.max(0,t)**2;
// te に床から出た合図が天井に届く時刻（二分法）
function arrive(te,a){const y0=floorY(te,a);let lo=te,hi=te+60;for(let k=0;k<60;k++){const m=(lo+hi)/2;const yp=y0-CL*(m-te),yc=floorY(m,a)-BH;if(yp>yc)lo=m;else hi=m;}return (lo+hi)/2;}
const STARS=[[80,120],[200,420],[130,700],[820,180],[900,460],[760,760],[260,250],[700,90],[60,520],[940,640],[300,860],[860,880]];
function accBox(t,a,{pulses=1,run=1,lab=1,g=1}={}){
 const yf=floorY(t,a),yc=yf-BH,PU=[];
 let s=STARS.map(([x,y])=>dot(x,y,3,'#dfe6f2')).join('');
 // 床から出た合図（光の粒）
 if(pulses>0)for(let k=0;k<40;k++){const te=TP0+k*PI2;if(te>t)break;const ta=arrive(te,a);if(t>ta+.15)continue;
  const yp=floorY(te,a)-CL*(t-te);s+=fade(pulses,'');PU.push(yp);}
 s=s+rect(BX[0],yc,BX[1]-BX[0],BH,{fill:'#16203a',fo:.55,stroke:SKY,sw:7,rx:6})+PU.map(yp=>fade(pulses,rect(477,yp-15,46,30,{fill:LIGHT,fo:1,stroke:LIGHT,rx:10}))).join('');
 s+=rect(470,yf-18,60,18,{fill:HC,fo:1,stroke:HC,rx:3})+rect(470,yc,60,16,{fill:C.x,fo:1,stroke:C.x,rx:3});
 const fl=.85+.15*sn(t*30);
 s+=poly([[450,yf+4],[550,yf+4],[500,yf+4+60*fl]],{fill:'#ff9b3e',fo:.9})+poly([[475,yf+4],[525,yf+4],[500,yf+4+34*fl]],{fill:HC,fo:.9});
 s+=fade(run,up(760,yf-20,120,{color:HC,w:7,head:24})+label('加速',790,yf-60,{size:40,color:HC,weight:700}));
 s+=fade(lab,label('天井',BX[0]-20,yc+40,{size:38,color:C.x,anchor:'end',weight:700})+label('床',BX[0]-20,yf-6,{size:38,color:HC,anchor:'end',weight:700}));
 return fade(g,s);
}
// 送った時刻と届いた時刻の目盛り（最初の5つ）
function gapScale(a,{g=1,send=1,arr=1,lines=1,brace1=0,brace2=0,y1=180,y2=390}={}){
 const te=[0,1,2,3,4].map(k=>TP0+k*PI2),ta=te.map(x=>arrive(x,a)),sc=760/(ta[4]-te[0]),X=t=>90+(t-te[0])*sc;
 let s=fade(send,label('床で 送った 時刻',880,y1-40,{size:38,color:HC,anchor:'end',weight:700})+line(70,y1,880,y1,{color:C.dim,w:3})+te.map(x=>line(X(x),y1-18,X(x),y1+18,{color:HC,w:6})).join(''));
 s+=te.map((x,k)=>draw([[X(x),y1+20],[X(ta[k]),y2-20]],lines*clamp(lines*5-k),{color:LIGHT,w:3,dash:'8 8'})).join('');
 s+=fade(arr,label('天井の 時計で 受けた 時刻',60,y2+66,{size:38,color:C.x,weight:700})+line(70,y2,880,y2,{color:C.dim,w:3})+ta.map(x=>line(X(x),y2-18,X(x),y2+18,{color:C.x,w:6})).join(''));
 s+=fade(brace1,line(X(te[0]),y1-28,X(te[1]),y1-28,{color:HC,w:3})+label('1秒',(X(te[0])+X(te[1]))/2,y1-40,{size:36,color:HC,anchor:'middle',weight:700}));
 s+=fade(brace2,line(X(ta[3]),y2+28,X(ta[4]),y2+28,{color:C.x,w:3})+label('1秒より 少し 長い',X(ta[4]),y2+122,{size:40,color:C.x,anchor:'end',weight:700}));
 return fade(g,s);
}
// 06 の小さな絵：遠ざかる衛星。後ろ（左の耳の側）の波の間隔が伸びる
function awaySat(t,{g=1}={}){
 let s=rect(40,610,840,300,{fill:'#131f38',fo:.95,stroke:C.faint,sw:2,rx:16})+label('06：遠ざかる 衛星',60,660,{size:38,color:C.dim,weight:700});
 const vx=45,T=.55,xs=t2=>380+vx*((t2%6));
 const now=t%6;s+=`<clipPath id="d10aw"><rect x="40" y="610" width="840" height="300" rx="16"/></clipPath><g clip-path="url(#d10aw)">`;
 for(let k=0;k<12;k++){const te=k*T;if(te>now)break;const r=(now-te)*120;s+=ring(380+vx*te,770,r,{color:RADIO,w:3});}
 s+='</g>'+sat(xs(t),770,1.3)+arrow(xs(t)+60,720,xs(t)+130,720,{color:C.dim,w:5,head:18});
 s+=eye(110,770,0,{size:40})+label('間隔が 伸びる',120,870,{size:38,color:RADIO,weight:700});
 return fade(g,s);
}
// 箱の中を止めて描く（9）：天井から見た床の時計
function boxStill(t,{g=1,slow=0}={}){
 let s=STARS.map(([x,y])=>dot(x,y,3,'#dfe6f2')).join('');
 s+=rect(200,110,500,520,{fill:'#16203a',fo:.6,stroke:SKY,sw:7,rx:8});
 s+=poly([[400,634],[500,634],[450,710]],{fill:'#ff9b3e',fo:.9})+up(120,620,150,{color:HC,w:7,head:24})+label('加速',120,440,{size:40,color:HC,anchor:'middle',weight:700});
 s+=clock(450,240,75,{ph:t})+label('天井の 時計',450,355,{size:36,anchor:'middle',weight:700});
 s+=eye(610,190,PI/2+.5,{size:36})+label('天井の 人',730,170,{size:38,weight:700});
 s+=clock(450,520,75,{ph:t*mix(1,.72,slow),ghost:slow>0?t:null})+label('床の 時計',450,425,{size:36,anchor:'middle',weight:700});
 return fade(g,s);
}
// 10b 地上の建物
function building(t,{g=1,bot=0,topc=0,tg2=0}={}){
 let s=rect(0,780,W,26,{fill:'#5a6b52',fo:.9,stroke:'none',rx:0});
 s+=rect(380,100,240,680,{fill:'#3a4560',fo:1,stroke:SKY,sw:4,rx:6});
 for(let y=140;y<760;y+=70)for(const x of [405,565])s+=rect(x,y,30,36,{fill:'#ffe9a8',fo:.3,stroke:'none',rx:3});
 s+=clock(500,660,70,{ph:t*mix(1,.8,bot)})+clock(500,220,70,{ph:t*mix(1,1.25,topc)});
 s+=fade(bot,plate('下：ゆっくり',640,676,{size:40,color:BLUE}));
 s+=fade(topc,plate('上：速い',640,236,{size:40,color:RED}));
 s+=down(300,300,140,{color:GRAV,w:7,head:24})+label('重力',260,280,{size:40,color:GRAV,anchor:'end',weight:700});
 return fade(g,s);
}

// ================= 7〜8 塔の実験 =================
const TW={x0:400,x1:540,top:150,bot:820};
function towerScene({g=1,draw:dr=1}={}){
 let s=rect(0,TW.bot,W,24,{fill:'#5a6b52',fo:.9,stroke:'none',rx:0});
 const hTop=mix(TW.bot,TW.top,dr);
 s+=rect(TW.x0,hTop,TW.x1-TW.x0,TW.bot-hTop,{fill:'#3a4560',fo:1,stroke:SKY,sw:4,rx:4});
 for(let y=TW.top+40;y<TW.bot-20;y+=70)if(y>hTop+10)for(const x of [TW.x0+22,TW.x1-50])s+=rect(x,y,28,36,{fill:'#ffe9a8',fo:.35,stroke:'none',rx:3});
 return fade(g,s);
}
function wavePath(x0,x1,y,lam,amp,ph=0){const pts=[];for(let x=x0;x<=x1;x+=4)pts.push([x,y+amp*sn(2*PI*(x-x0)/lam+ph)]);return pts;}

// ================= 9〜10 スカイツリー =================
const ST={x:360,yB:840,h:720},STD=ST.yB-ST.h*450/634; // 450 m の展望台の y（約329）
const SKC=[[650,290],[650,760]];

// ================= 11〜13 衛星の時計 =================
const SE={cx:470,cy:330,R:67,r:280},SANG=-PI/4;
const SP=[SE.cx+SE.r*cs(SANG),SE.cy+SE.r*sn(SANG)]; // 衛星（約668,132）
const SCK=[860,300];
function satTop(t,{g=1,clk=1,plus=0,minus=0,ph=0,dim=1}={}){
 let s=earth(SE.cx,SE.cy,SE.R)+ring(SE.cx,SE.cy,SE.r,{color:'#5c6f90',w:3,dash:'10 10'});
 const E=[SE.cx+(SE.R+12)*cs(SANG),SE.cy+(SE.R+12)*sn(SANG)],Q=[SP[0]-22*cs(SANG),SP[1]-22*sn(SANG)];
 s+=sat(SP[0],SP[1],1.6);
 s+=line(SP[0]+60,SP[1]+20,SCK[0]-40,SCK[1]-40,{color:C.dim,w:2,dash:'6 6'});
 s+=clock(SCK[0],SCK[1],55,{ph,g:clk});
 s+=fade(dim,draw([E,Q],dim,{color:HC,w:5})+dot(E[0],E[1],7,HC)+dot(Q[0],Q[1],7,HC)+fade(seg(dim,.6,1),plate('約2万 km',565,215,{size:42,color:HC,anchor:'end'})));
 s+=fade(plus,up(SCK[0],SCK[1]-66,110,{color:RED,g:plus}));
 s+=fade(minus,down(SCK[0],SCK[1]+66,26,{color:BLUE,g:minus,head:20}));
 return fade(g,s);
}
// 下の表：1日の ずれ（μs）
const COL=[170,430,770];
function satTable({hdr=1,a=0,b=0,c=0,net=0}={}){
 let s=fade(hdr,label('1日の ずれ（μs＝100万分の1秒）',60,655,{size:36,color:C.dim}));
 s+=fade(a,label('高さ（重力）',COL[0],705,{size:36,color:RED,anchor:'middle',weight:700})+up(COL[0],835,110,{color:RED,g:a})+label('＋45 μs',COL[0],900,{size:56,color:RED,anchor:'middle',weight:700}));
 s+=fade(b,label('速さ',COL[1],705,{size:36,color:BLUE,anchor:'middle',weight:700})+down(COL[1],760,28,{color:BLUE,g:b,head:20})+label('−7 μs',COL[1],900,{size:56,color:BLUE,anchor:'middle',weight:700}));
 s+=fade(c,label('差し引き',COL[2],705,{size:36,color:HC,anchor:'middle',weight:700})+up(COL[2],835,93,{color:HC,g:c})+label('＋38 μs',COL[2],900,{size:56,color:HC,anchor:'middle',weight:700}));
 s+=fade(net,label('＝',605,893,{size:56,color:HC,anchor:'middle',weight:700}));
 return s;
}

// ================= 15 地図 =================
const MP0=[200,720],MDIR=[560,-470],MKM=Math.hypot(...MDIR)/11.4; // 1 km＝約64 px
function mapBase(){
 let s=rect(40,40,860,840,{fill:'#13294d',fo:1,stroke:'#2c4a7a',sw:3,rx:16});
 s+=`<clipPath id="d10mp"><rect x="40" y="40" width="860" height="840" rx="16"/></clipPath><g clip-path="url(#d10mp)">`;
 for(let k=0;k<12;k++){s+=line(40+k*84,40,40+k*84-60,880,{color:'#2c4a7a',w:5});s+=line(40,60+k*80,900,40+k*80,{color:'#2c4a7a',w:5});}
 s+=`<path d="M40 560 q300 -80 520 -20 q200 50 340 -40" stroke="#2f7a5a" stroke-width="22" fill="none" opacity=".8"/>`;
 s+='</g>';
 return s;
}

// ================= 18 振り返り =================
const RY=[130,345,560,775];
function rowBox(i,g,num,icon,lines){
 const yc=RY[i];
 let s=rect(50,yc-95,220,190,{fill:'#131f38',fo:.95,stroke:C.faint,sw:2,rx:14})+icon+plate(num,258,yc-56,{size:36,color:C.dim,anchor:'end',weight:400});
 lines.forEach((L,j)=>{s+=label(L,300,yc+(lines.length===1?14:-12+j*56),{size:42,color:j===lines.length-1&&lines.length>1?HC:C.ink,weight:700});});
 return fade(g,s);
}
function atom(x,y,r,t=0){
 let s=dot(x,y,r*.18,'#ff8f9b');
 for(const a of [0,60,120])s+=`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${f1(r*.38)}" fill="none" stroke="${C.x}" stroke-width="3" transform="rotate(${a} ${x} ${y})"/>`;
 const a=t*2;s+=dot(x+r*cs(a),y+r*.38*sn(a),6,C.x);
 return s;
}

// ================= 20 ブラックホール =================
function blackHole(x,y,r,t){
 let s=`<defs><radialGradient id="d10bh" cx="50%" cy="50%" r="50%"><stop offset=".55" stop-color="#ff9b3e" stop-opacity="0"/><stop offset=".75" stop-color="#ff9b3e" stop-opacity=".45"/><stop offset="1" stop-color="#ff9b3e" stop-opacity="0"/></radialGradient></defs>`;
 s+=`<circle cx="${x}" cy="${y}" r="${f1(r*1.9)}" fill="url(#d10bh)"/>`;
 s+=`<ellipse cx="${x}" cy="${y}" rx="${f1(r*1.75)}" ry="${f1(r*.38)}" fill="none" stroke="#ffb36b" stroke-width="10" opacity=".75"/>`;
 s+=dot(x,y,r,'#000')+ring(x,y,r+3,{color:'#ffcf8a',w:3});
 return s;
}

// ================= cue ごとの図 =================
// ================= 第3版で足した形 =================
// 難所の札（橙の枠、小さな山の印）。舞台の左上に置き、その場面のあいだ残す。
const NAN='#ff9b3e';
function nanjo(g=1,x=40,y=22){const w=200,h=66;
 const s=rect(x,y,w,h,{fill:C.bg,fo:.92,stroke:NAN,sw:3,rx:16})+poly([[x+18,y+50],[x+38,y+20],[x+50,y+34],[x+60,y+24],[x+80,y+50]],{fill:NAN,fo:.85,stroke:'none'})+label('難所',x+96,y+49,{size:44,color:NAN,weight:700});
 return fade(g,s);}
// 予想のカード（縦に並べる。左に大きな A・B・C）。ans：正解の番号、rev：答え合わせの進み
const LET='ABC';
function cards(opts,{g=1,y0=430,h=96,gap=22,shown=[1,1,1],ans=-1,rev=0,x0=150,w=700}={}){
 let s='';
 opts.forEach((o,i)=>{const y=y0+i*(h+gap),ok=i===ans,dv=ans>=0&&!ok?1-.65*rev:1;
  let c='';
  if(ok&&rev>0)c+=rect(x0-8,y-8,w+16,h+16,{fill:HC,fo:.14*rev,stroke:'none',rx:28});
  c+=rect(x0,y,w,h,{fill:'#131f38',fo:.96,stroke:ok&&rev>0?HC:'#4a5c80',sw:ok&&rev>0?3+4*rev:3,rx:22});
  c+=dot(x0+58,y+h/2,34,'#24345a')+label(LET[i],x0+58,y+h/2+20,{size:56,color:HC,anchor:'middle',weight:700})+label(o,x0+124,y+h/2+15,{size:44,weight:700});
  s+=fade(g*(shown[i]??1)*dv,c);});
 return s;}
// 声の後の 3→2→1（各1秒）
function countdown(p,ctx,{y=880}={}){const tc=cueT(p,ctx)-voiceEnd(ctx)-.05;if(tc<0||tc>=3)return '';
 const n=3-Math.floor(tc),f=tc-Math.floor(tc),a=Math.min(1,f/.12)*(f>.85?(1-f)/.15:1);
 return fade(a,scaleAt(500,y-34,1.15-.15*Math.min(1,f/.2),label(String(n),500,y,{size:96,color:HC,anchor:'middle',weight:700})));}
// 2 頭と足の時計
function bodyClocks(t,{g=1,lab=0,life=0}={}){
 let s=rect(0,860,W,24,{fill:'#5a6b52',fo:.9,stroke:'none',rx:0})+person(200,860,680);
 s+=clock(640,240,62,{ph:t})+line(270,250,572,240,{color:C.dim,w:2,dash:'6 6'})+label('頭の 時計',720,250,{size:38,weight:700});
 s+=clock(640,780,62,{ph:t})+line(260,840,572,790,{color:C.dim,w:2,dash:'6 6'})+label('足の 時計',720,790,{size:38,weight:700});
 s+=fade(lab,plate('頭の 方が',480,420,{size:40,color:RED})+plate('ほんの わずかに 速い',480,475,{size:40,color:RED}));
 s+=fade(life,plate('一生で 約100万分の0.5秒',380,600,{size:40,color:HC}));
 return fade(g,s);}
// 3 りんごと重力
function apple(x,y){return dot(x,y,40,'#e8463c')+line(x,y-40,x+6,y-60,{color:'#7a4a2a',w:6})+`<ellipse cx="${x+22}" cy="${y-52}" rx="16" ry="8" fill="#3fae6a"/>`;}
// 16 二つの高さの箱（宇宙で加速）。光の粒は同じ速さで床から天井へ（高い箱ほど長くかかる）
const PB=[{x:120,h:160},{x:360,h:320}],PF=640,PV=110;
function propBoxes(t,{g=1}={}){
 let s=STARS.slice(0,8).map(([x,y])=>dot(x,y,3,'#dfe6f2')).join('');
 PB.forEach(({x,h},i)=>{const top=PF-h;
  s+=rect(x,top,180,h,{fill:'#16203a',fo:.6,stroke:SKY,sw:6,rx:6})+rect(x+60,PF-14,60,14,{fill:HC,fo:1,stroke:HC,rx:3})+rect(x+60,top,60,12,{fill:C.x,fo:1,stroke:C.x,rx:3});
  s+=poly([[x+60,PF+4],[x+120,PF+4],[x+90,PF+56]],{fill:'#ff9b3e',fo:.9});
  const per=h/PV+.6,ph=(t%per),yp=PF-14-Math.min(h-26,PV*ph);s+=fade(ph<h/PV?1:0,rect(x+75,yp-14,30,28,{fill:LIGHT,fo:1,stroke:LIGHT,rx:9}));
  s+=label(i?'高い 箱':'低い 箱',x+90,PF+100,{size:38,anchor:'middle',weight:700});});
 s+=up(80,PF,120,{color:HC,w:6,head:20})+label('加速',80,PF-140,{size:36,color:HC,anchor:'middle',weight:700});
 return fade(g,s);}
function propBars(title,y,g,{col=LIGHT}={}){
 let s=label(title,600,y,{size:38,color:col,weight:700});
 s+=label('低い',600,y+60,{size:36})+rect(670,y+30,75*g,40,{fill:col,fo:.8,stroke:col,rx:6});
 s+=label('高い',600,y+130,{size:36})+rect(670,y+100,150*g,40,{fill:col,fo:.8,stroke:col,rx:6});
 s+=fade(seg(g,.8,1),label('2倍',830,y+132,{size:38,color:col,weight:700}));
 return s;}
// 17 高さと進み方の差（直線）
const GO=[140,760],GX=860,GY=140;
function axes1({g=1,xl='高さ',yl='時計の 進み方の 差'}={}){
 let s=arrow(GO[0],GO[1],GX,GO[1],{color:C.dim,w:4,head:20})+arrow(GO[0],GO[1],GO[0],GY,{color:C.dim,w:4,head:20});
 s+=label(xl,GX-10,GO[1]+56,{size:38,anchor:'end',weight:700})+label(yl,GO[0]+20,GY+10,{size:38,weight:700});
 return fade(g,s);}
// 18〜19 2万 km までの図（上の方に小さく）。x：高さ 0〜2万 km、y：0〜200 μs
const G2={x0:150,x1:830,y0:430,k:1.5,H:20200};
const g2x=h=>G2.x0+(G2.x1-G2.x0)*h/G2.H,g2y=v=>G2.y0-G2.k*v;
function axes2({g=1}={}){
 let s=arrow(G2.x0,G2.y0,880,G2.y0,{color:C.dim,w:4,head:18})+arrow(G2.x0,G2.y0,G2.x0,110,{color:C.dim,w:4,head:18});
 s+=label('1日に 進む（μs）',270,128,{size:36,weight:700})+label('高さ',480,G2.y0+50,{size:36,anchor:'middle',weight:700});
 return fade(g,s);}
// 20 重力の強さ（中心からの距離の2乗に反比例）
const RE=6371,RS=26571;
// 21 段の積み上げ。素直な直線（重力が地上と同じなら）は 2万 km で 190、実際は R(1−R/r) に比例して 45 で止まる
const G3={x0:150,x1:830,y0:740,k:3,H:20200,N:8};
const g3x=h=>G3.x0+(G3.x1-G3.x0)*h/G3.H,g3y=v=>G3.y0-G3.k*v;
const naive=h=>190*h/G3.H,real=h=>190*(RE/G3.H)*(1-RE/(RE+h));
function stepsPts(n){ // 最初の n 段（中点の重力で）
 const d=G3.H/G3.N;let v=0;const pts=[[g3x(0),g3y(0)]];
 for(let i=0;i<n;i++){const rm=RE+(i+.5)*d,rise=190/G3.N*(RE/rm)**2;pts.push([g3x((i+1)*d),g3y(v)]);v+=rise;pts.push([g3x((i+1)*d),g3y(v)]);}
 return pts;}

export const deep10Diagrams={
 // ===== 第3版 =====
 // 1a 犯人は重力
 [K+'q:culprit']:(p,ctx)=>qScene(p,ctx,{culprit:swin(ctx,p,0,.3,.7),grav:swin(ctx,p,1,.2,.8)}),
 // 1b 地面に近い所ほどゆっくり、離れるほど速い
 [K+'q:rate3']:(p,ctx)=>qScene(p,ctx,{grav:1,slow:vseg(ctx,p,.05,.45),fast:vseg(ctx,p,.5,.9),diff:vseg(ctx,p,.7,.95)}),
 // 2 頭と足
 [K+'body:clocks']:(p,ctx)=>bodyClocks(ctx.tg,{lab:swin(ctx,p,0,.4,.8),life:swin(ctx,p,1,.2,.7)}),
 // 3 重力は力のはず。なぜ時間が？
 [K+'why:force']:(p,ctx)=>{const t=cueT(p,ctx),a=swin(ctx,p,0,0,.4),fall=clamp((t%2.2)/1.4);
  let s=rect(0,780,W,24,{fill:'#5a6b52',fo:.9,stroke:'none',rx:0});
  s+=fade(a,apple(300,mix(260,730,fall*fall))+down(380,300,160,{color:GRAV,w:8,head:26})+label('重力',410,400,{size:44,color:GRAV,weight:700}));
  s+=fade(swin(ctx,p,0,.4,.9),plate('重力 ＝ 物を 引っ張る 力',500,120,{size:46,color:GRAV,anchor:'middle'}));
  const b=swin(ctx,p,1,.1,.6);
  s+=fade(b,clock(680,440,90,{ph:t})+label('時間の 進み方',680,580,{size:40,anchor:'middle',weight:700}));
  s+=bigQ(680,760,swin(ctx,p,1,.5,.9),150);
  return s;},
 // 4a アインシュタイン
 [K+'ein:who']:(p,ctx)=>bust(500,320,{g:vseg(ctx,p,0,.5)})+fade(vseg(ctx,p,0,.5),label('アインシュタイン',500,650,{size:44,anchor:'middle',weight:700})),
 // 4b 出発点は窓のないエレベーター。一つ目の難所
 [K+'lift:start']:(p,ctx)=>nanjo(swin(ctx,p,1,0,.4))+fade(swin(ctx,p,0,0,.5),plate('出発点：窓のない エレベーター',500,140,{size:44,color:HC,anchor:'middle'}))+liftPair(ctx.tg,{boxes:swin(ctx,p,0,.3,.9),ball:0}),
 // 5a 予想：体が床に押しつけられている
 [K+'lift:push']:(p,ctx)=>nanjo()+liftPair(ctx.tg,{boxes:1,ball:0,title:vseg(ctx,p,0,.3),push:swin(ctx,p,1,.3,.8)})+fade(swin(ctx,p,1,.5,.9),plate('床に 押しつけられる',470,700,{size:42,color:HC,anchor:'middle'})),
 // 5b 地上？宇宙で加速？ → A できる／B できない
 [K+'lift:q']:(p,ctx)=>{const v=(a,b)=>vseg(ctx,p,a,b);
  let s=nanjo()+scaleAt(480,0,.5,liftPair(ctx.tg,{boxes:1,ball:0,push:1}));
  s+=fade(v(.05,.25),plate('地上？',355,350,{size:38,color:GRAV,anchor:'middle'}))+fade(v(.3,.5),plate('宇宙で 加速？',600,350,{size:38,color:HC,anchor:'middle'}));
  s+=fade(v(.55,.75),label('区別 できる？',480,450,{size:44,color:HC,anchor:'middle',weight:700}));
  s+=cards(['できる','できない'],{y0:500,shown:[v(.72,.82),v(.86,.96)]});
  return s+countdown(p,ctx);},
 // 6a 答え：できない。ボールも水も同じ
 [K+'lift:ans']:(p,ctx)=>{const rv=vseg(ctx,p,0,.12),m=swin(ctx,p,1,0,.25);
  let s=nanjo()+fade(1-m,cards(['できる','できない'],{y0:500,ans:1,rev:rv})+label('区別 できる？',480,450,{size:44,color:HC,anchor:'middle',weight:700})+plate('地上？',355,350,{size:38,color:GRAV,anchor:'middle'})+plate('宇宙で 加速？',600,350,{size:38,color:HC,anchor:'middle'}));
  s+=scaleAt(480,0,.5+.5*m,liftPair(ctx.tg,{boxes:1,ball:m>0?1:0,water:swin(ctx,p,1,.4,.6),push:1-m,left:seg(m,.8,1),right:seg(m,.8,1)}));
  s+=fade(swin(ctx,p,1,.85,1),label('＝',470,LB[0][1]+LH/2+30,{size:96,color:HC,anchor:'middle',weight:700}));
  return s;},
 // 6b 重力と加速は見分けがつかない
 [K+'lift:eq']:(p,ctx)=>nanjo()+liftPair(ctx.tg,{boxes:1,ball:1,water:1,left:1,right:1,same:1})+fade(vseg(ctx,p,.4,.75),plate('重力と 加速は 見分けが つかない',470,880,{size:42,color:HC,anchor:'middle'}))+tag('仮説',960,60,{anchor:'end',g:vseg(ctx,p,.7,.9)}),
 // 9a 予想：後の合図ほど届くまでの時間は？ A 短くなる
 [K+'acc:q']:(p,ctx)=>{const a=accA(ctx),tA=accT(ctx);
  let s=scaleAt(500,0,.45,accBox(tA,a,{lab:0,run:0}))+label('天井',350,130,{size:36,color:C.x,anchor:'end',weight:700})+label('床',350,215,{size:36,color:HC,anchor:'end',weight:700});
  s+=fade(swin(ctx,p,1,.3,.7),label('届くまでの 時間は？',500,330,{size:44,color:HC,anchor:'middle',weight:700}));
  s+=cards(['短くなる','同じ','長くなる'],{y0:400,shown:[swin(ctx,p,1,.85,1),0,0]});
  return s;},
 [K+'acc:q2']:(p,ctx)=>{const a=accA(ctx),tA=accT(ctx),v=(x,y)=>vseg(ctx,p,x,y);
  let s=scaleAt(500,0,.45,accBox(tA,a,{lab:0,run:0}))+label('天井',350,130,{size:36,color:C.x,anchor:'end',weight:700})+label('床',350,215,{size:36,color:HC,anchor:'end',weight:700});
  s+=label('届くまでの 時間は？',500,330,{size:44,color:HC,anchor:'middle',weight:700});
  s+=cards(['短くなる','同じ','長くなる'],{y0:400,shown:[1,v(0,.3),v(.5,.85)]});
  return s+countdown(p,ctx,{y:900});},
 // 10a 答え：長くなる → 二本の目盛り
 [K+'acc:ans']:(p,ctx)=>{const a=accA(ctx),rv=vseg(ctx,p,0,.1),o=swin(ctx,p,1,0,.15),v=(x,y)=>swin(ctx,p,1,x,y);
  let s=fade(1-o,cards(['短くなる','同じ','長くなる'],{y0:400,ans:2,rev:rv})+label('届くまでの 時間は？',500,330,{size:44,color:HC,anchor:'middle',weight:700}));
  s+=gapScale(a,{g:v(.05,.25),send:1,lines:v(.2,.7),arr:v(.55,.8)});
  return s;},
 // 10b 間隔は1秒より少し長い。06 の遠ざかる衛星
 [K+'acc:sound3']:(p,ctx)=>{const a=accA(ctx);
  return gapScale(a,{lines:1,brace1:swin(ctx,p,0,0,.3),brace2:swin(ctx,p,0,.4,.85)})+fade(swin(ctx,p,0,.6,.9),note('間隔の 差は 大きく誇張',60,575))+awaySat(ctx.t,{g:swin(ctx,p,1,0,.3)});},
 // 12b 予言（「はず」）
 [K+'lift2:pred3']:(p,ctx)=>{const t=cueT(p,ctx),o=vseg(ctx,p,0,.12);
  let s=fade(1-o,liftPair(ctx.tg,{boxes:1,ball:1,title:1,left:1,right:1,same:1}));
  s+=building(t,{g:vseg(ctx,p,.05,.22),bot:swin(ctx,p,0,.3,.55),topc:swin(ctx,p,0,.6,.85)});
  s+=tag('予言',500,880,{g:swin(ctx,p,1,.5,.9),color:PRED,anchor:'middle',size:44});
  s+=fade(swin(ctx,p,0,.6,.9),note('差は 大きく誇張',40,905));
  return s;},
 // 13 塔の実験（1つの cue）
 [K+'tower:all']:(p,ctx)=>{const t=ctx.tg,v=(a,b)=>vseg(ctx,p,a,b);
  let s=towerScene({draw:v(.05,.25)});
  s+=fade(v(0,.08)*(1-v(.42,.5)),label('1959年',600,240,{size:60,color:HC,weight:700}));
  s+=fade(v(.12,.25)*(1-v(.42,.5)),line(340,TW.top,340,TW.bot,{color:C.ink,w:3})+line(322,TW.top,358,TW.top,{color:C.ink,w:3})+line(322,TW.bot,358,TW.bot,{color:C.ink,w:3})+label('22.5 m',320,500,{size:44,anchor:'end',weight:700}));
  const up1=v(.25,.5),xm=(TW.x0+TW.x1)/2;
  const vp=[];for(let y=TW.bot-30;y>=TW.top+30;y-=4)vp.push([xm+14*sn(2*PI*(TW.bot-30-y)/60-t*6),y]);
  s+=draw(vp,up1,{color:LIGHT,w:5});
  s+=fade(v(.25,.3),dot(xm,TW.bot-24,14,HC))+fade(seg(up1,.9,1),ring(xm,TW.top+26,18,{color:HC,w:5}));
  s+=fade(v(.3,.4),label('上',TW.x0-20,TW.top+40,{size:40,anchor:'end',weight:700})+label('下',TW.x0-20,TW.bot-20,{size:40,anchor:'end',weight:700}));
  const cmp=v(.5,.65);
  s+=fade(cmp,label('上で 受けた 光',600,330,{size:38,weight:700})+draw(wavePath(600,880,390,80,26,-t*6*70/80),1,{color:LIGHT,w:5}));
  s+=fade(cmp,label('下で 出した 光',600,580,{size:38,weight:700})+draw(wavePath(600,880,645,70,26,-t*6),1,{color:LIGHT,w:5}));
  s+=fade(v(.68,.82),plate('振動数が',612,470,{size:40,color:HC})+plate('ずれていた',612,525,{size:40,color:HC}));
  s+=tag('実験',960,60,{anchor:'end',g:v(.3,.45)});
  s+=tag('結果',570,760,{text:'予言どおり',g:v(.8,.95)});
  s+=fade(v(.6,.8),note('ずれは 大きく誇張',570,895));
  return s;},
 // 14b スカイツリー：上が 1日に 10億分の4秒 速い（1文）
 [K+'tree:res3']:(p,ctx)=>{const t=ctx.tg,a=vseg(ctx,p,.15,.55),b=vseg(ctx,p,.7,.95);
  let s=rect(0,ST.yB,W,22,{fill:'#5a6b52',fo:.9,stroke:'none',rx:0})+skytree(ST.x,ST.yB,ST.h);
  s+=label('2020年',40,90,{size:56,color:HC,weight:700})+label('日本の 研究者',40,150,{size:38,weight:700});
  s+=line(230,STD,230,ST.yB,{color:C.ink,w:3})+line(212,STD,248,STD,{color:C.ink,w:3})+line(212,ST.yB,248,ST.yB,{color:C.ink,w:3})+label('約450 m',210,600,{size:40,anchor:'end',weight:700});
  s+=clock(SKC[1][0],SKC[1][1],70,{ph:t})+line(ST.x+60,ST.yB-10,SKC[1][0]-74,SKC[1][1]+20,{color:C.dim,w:2,dash:'6 6'})+label('地上',SKC[1][0]+90,SKC[1][1]+14,{size:40,weight:700});
  s+=clock(SKC[0][0],SKC[0][1],70,{ph:t})+line(ST.x+30,STD,SKC[0][0]-74,SKC[0][1],{color:C.dim,w:2,dash:'6 6'})+label('上',SKC[0][0]+90,SKC[0][1]+14,{size:40,weight:700});
  s+=fade(1-vseg(ctx,p,0,.1),plate('特に 正確な 時計',SKC[0][0],SKC[0][1]-110,{size:40,color:HC,anchor:'middle'}));
  s+=fade(a,label('1日に',SKC[0][0]+20,SKC[0][1]-160,{size:38,color:RED,anchor:'middle',weight:700})+label('＋10億分の4秒',SKC[0][0]+20,SKC[0][1]-102,{size:46,color:RED,anchor:'middle',weight:700}));
  s+=fade(a,up(SKC[0][0]-160,SKC[0][1]-90,80,{color:RED,g:a,head:22,w:7}));
  s+=tag('結果',SKC[0][0],520,{text:'予言どおり',g:b,anchor:'middle'});
  s+=tag('実験',960,60,{anchor:'end'});
  return s;},
 // 15 2万 km 上では？ 最後の難所
 [K+'satq:far']:(p,ctx)=>{const t=ctx.tg;
  let s=nanjo(swin(ctx,p,1,0,.4))+satTop(t,{ph:t,dim:vseg(ctx,p,.1,.4)});
  s+=fade(swin(ctx,p,0,.5,.9),plate('1日に どれだけ 速い？',470,700,{size:48,color:HC,anchor:'middle'}));
  s+=bigQ(470,880,swin(ctx,p,0,.7,1),130);
  return s;},
 // 16a まず地面の近く
 [K+'prop:near']:(p,ctx)=>nanjo()+fade(vseg(ctx,p,0,.4),plate('まず 地面の 近くで',500,140,{size:48,color:HC,anchor:'middle'}))+fade(vseg(ctx,p,.2,.7),propBoxes(ctx.tg)),
 // 16b 光が届くまでの時間は高さに比例
 [K+'prop:time']:(p,ctx)=>nanjo()+propBoxes(ctx.tg)+propBars('光が 届くまでの 時間',260,swin(ctx,p,0,.5,1)*.5+swin(ctx,p,1,.1,.9)*.5),
 // 16c 天井が増やす速さも高さに比例
 [K+'prop:speed']:(p,ctx)=>{const g=vseg(ctx,p,.1,.6);
  let s=nanjo()+propBoxes(ctx.tg)+propBars('光が 届くまでの 時間',260,1);
  s+=propBars('その間に 天井が 増やす 速さ',540,g,{col:C.x});
  s+=fade(vseg(ctx,p,.3,.6),plate('＝ 加速の 強さ × 時間',470,800,{size:44,color:C.x,anchor:'middle'}));
  PB.forEach(({x,h},i)=>{s+=fade(g,up(x+150,PF-h-6,(i+1)*34,{color:C.x,w:6,head:18}));});
  return s;},
 // 17b 地上なら、加速の強さ＝重力の強さ
 [K+'prop:grav']:(p,ctx)=>{const g=vseg(ctx,p,.3,.8);
  let s=nanjo()+propBoxes(ctx.tg)+propBars('光が 届くまでの 時間',260,1)+propBars('その間に 天井が 増やす 速さ',540,1,{col:C.x});
  s+=plate('＝ 加速の 強さ × 時間',470,800,{size:44,color:C.x,anchor:'middle'});
  s+=fade(g,plate('加速の 強さ → 地上では 重力の 強さ',470,875,{size:42,color:GRAV,anchor:'middle'}));
  return s;},
 // 17a 伸び（進み方の差）も高さに比例：直線
 [K+'graph:line']:(p,ctx)=>{const v=(a,b)=>vseg(ctx,p,a,b);
  let s=nanjo()+axes1({g:v(0,.2)});
  const P1=[GO[0]+220,GO[1]-180],P2=[GO[0]+440,GO[1]-360];
  s+=fade(v(.2,.35),dot(P1[0],P1[1],14,HC)+label('低い 箱',P1[0]+24,P1[1]+40,{size:36}))+fade(v(.3,.45),dot(P2[0],P2[1],14,HC)+label('高い 箱',P2[0]+24,P2[1]+40,{size:36}));
  s+=draw([GO,[GO[0]+660,GO[1]-540]],v(.5,.85),{color:HC,w:6});
  s+=fade(v(.75,.95),plate('重力の 強さ × 高さ に 比例',470,880,{size:44,color:HC,anchor:'middle'}));
  return s;},
 // 17b 450 m で 10億分の4秒
 [K+'graph:450']:(p,ctx)=>{const v=(a,b)=>vseg(ctx,p,a,b),P=[GO[0]+440,GO[1]-360];
  let s=nanjo()+axes1()+draw([GO,[GO[0]+660,GO[1]-540]],1,{color:HC,w:6})+plate('重力の 強さ × 高さ に 比例',470,880,{size:44,color:HC,anchor:'middle'});
  s+=fade(v(.05,.35),dot(P[0],P[1],16,RED)+line(P[0],P[1],P[0],GO[1],{color:RED,w:3,dash:'8 8'})+line(P[0],P[1],GO[0],P[1],{color:RED,w:3,dash:'8 8'})+label('450 m',P[0],GO[1]+56,{size:38,color:RED,anchor:'middle',weight:700}));
  s+=fade(v(.45,.8),plate('1日に 10億分の4秒',GO[0]+20,P[1]-30,{size:40,color:RED})+label('スカイツリー',P[0]+30,P[1]+50,{size:36,color:RED}));
  return s;},
 // 18a 予想：衛星はスカイツリーの約4万5000倍の高さ
 [K+'pred:far']:(p,ctx)=>{const v=(a,b)=>vseg(ctx,p,a,b);
  let s=nanjo()+axes2({g:v(.2,.4)});
  s+=fade(v(.3,.5),dot(g2x(.45),G2.y0,12,RED)+label('450 m',g2x(.45)+16,G2.y0-20,{size:36,color:RED,weight:700}));
  s+=fade(v(.55,.75),line(g2x(G2.H),G2.y0-14,g2x(G2.H),G2.y0+14,{color:C.ink,w:4})+label('2万 km',g2x(G2.H),G2.y0+50,{size:36,anchor:'middle',weight:700}));
  s+=fade(v(.6,.9),arrow(g2x(1000),G2.y0+90,g2x(G2.H)-20,G2.y0+90,{color:HC,w:5,head:18})+label('約4万5000倍',g2x(10000),G2.y0+150,{size:44,color:HC,anchor:'middle',weight:700}));
  return s;},
 // 18b 単純に比例すると 190。正しい？ A 正しい
 [K+'pred:q']:(p,ctx)=>{const a=swin(ctx,p,0,.2,.9);
  let s=nanjo()+axes2()+dot(g2x(.45),G2.y0,12,RED)+label('2万 km',g2x(G2.H),G2.y0+50,{size:36,anchor:'middle',weight:700});
  s+=draw([[g2x(0),g2y(0)],[g2x(G2.H),g2y(190)]],a,{color:HC,w:5,dash:'14 10'});
  s+=fade(seg(a,.85,1),dot(g2x(G2.H),g2y(190),12,HC)+plate('190 μs？',g2x(G2.H)-20,g2y(190)+12,{size:44,color:HC,anchor:'end'}));
  s+=cards(['正しい','大きすぎる','小さすぎる'],{y0:500,shown:[swin(ctx,p,1,.85,1),0,0]});
  return s;},
 [K+'pred:cd']:(p,ctx)=>{const v=(a,b)=>vseg(ctx,p,a,b);
  let s=nanjo()+axes2()+dot(g2x(.45),G2.y0,12,RED)+label('2万 km',g2x(G2.H),G2.y0+50,{size:36,anchor:'middle',weight:700});
  s+=draw([[g2x(0),g2y(0)],[g2x(G2.H),g2y(190)]],1,{color:HC,w:5,dash:'14 10'})+dot(g2x(G2.H),g2y(190),12,HC)+plate('190 μs？',g2x(G2.H)-20,g2y(190)+12,{size:44,color:HC,anchor:'end'});
  s+=cards(['正しい','大きすぎる','小さすぎる'],{y0:500,shown:[1,v(0,.35),v(.5,.9)]});
  return s+countdown(p,ctx,{y:900});},
 // 19a 答え：大きすぎる
 [K+'pred:ans']:(p,ctx)=>{const rv=vseg(ctx,p,0,.2);
  let s=nanjo()+axes2()+dot(g2x(.45),G2.y0,12,RED)+label('2万 km',g2x(G2.H),G2.y0+50,{size:36,anchor:'middle',weight:700});
  s+=draw([[g2x(0),g2y(0)],[g2x(G2.H),g2y(190)]],1,{color:HC,w:5,dash:'14 10'})+dot(g2x(G2.H),g2y(190),12,HC)+plate('190 μs？',g2x(G2.H)-20,g2y(190)+12,{size:44,color:HC,anchor:'end'});
  s+=cards(['正しい','大きすぎる','小さすぎる'],{y0:500,ans:1,rev:rv});
  return s;},
 // 19b 実際は 45。4倍の食い違い
 [K+'pred:bars']:(p,ctx)=>{const o=swin(ctx,p,0,0,.2),a=swin(ctx,p,0,.3,.8),b=swin(ctx,p,1,.2,.7);
  let s=nanjo()+axes2()+label('2万 km',g2x(G2.H),G2.y0+50,{size:36,anchor:'middle',weight:700});
  s+=draw([[g2x(0),g2y(0)],[g2x(G2.H),g2y(190)]],1,{color:C.dim,w:4,dash:'14 10'})+dot(g2x(G2.H),g2y(190),10,C.dim);
  s+=fade(1-o,cards(['正しい','大きすぎる','小さすぎる'],{y0:500,ans:1,rev:1}));
  s+=fade(a,dot(g2x(G2.H),g2y(45),14,RED)+plate('実際は 45 μs',g2x(G2.H)-24,g2y(45)+14,{size:44,color:RED,anchor:'end'}));
  s+=fade(o,label('単純な 比例',160,540,{size:38,color:C.dim,weight:700})+rect(160,565,190*3.5*o,56,{fill:C.dim,fo:.5,stroke:C.dim,rx:8})+label('190',160+190*3.5+12,608,{size:44,color:C.dim,weight:700}));
  s+=fade(a,label('実際',160,690,{size:38,color:RED,weight:700})+rect(160,715,45*3.5*a,56,{fill:RED,fo:.8,stroke:RED,rx:8})+label('45',160+45*3.5+12,758,{size:44,color:RED,weight:700}));
  s+=fade(b,plate('4倍も 食い違う',380,870,{size:48,color:HC}));
  return s;},
 // 20a 離れると重力そのものが弱くなる
 [K+'weak:earth']:(p,ctx)=>{const v=(a,b)=>swin(ctx,p,1,a,b),E=[180,280],R0=110;
  let s=nanjo()+earth(E[0],E[1],R0);
  [1,2,3,RS/RE].forEach((k,i)=>{const x=E[0]+R0*k+(i===0?14:0),L=Math.max(14,120/(k*k));s+=fade(v(.2+.12*i,.35+.12*i),arrow(x+L,E[1],x,E[1],{color:GRAV,w:7,head:16})+dot(x+L+6,E[1],7,C.ink));});
  s+=fade(v(.75,.95),sat(E[0]+R0*RS/RE+40,E[1]-70,1.3)+label('衛星の 高さ',E[0]+R0*RS/RE,E[1]+80,{size:36,anchor:'middle',weight:700}));
  s+=fade(v(.3,.6),label('地上',E[0]+R0+40,E[1]-40,{size:36,anchor:'middle',weight:700}));
  s+=fade(swin(ctx,p,1,.4,.9),plate('離れるほど 重力は 弱い',470,520,{size:46,color:GRAV,anchor:'middle'}));
  return s;},
 // 20b 中心からの距離と重力の強さ：衛星で約17分の1
 [K+'weak:graph']:(p,ctx)=>{const v=(a,b)=>vseg(ctx,p,a,b),E=[180,280],R0=110;
  let s=nanjo()+earth(E[0],E[1],R0);
  [1,2,3,RS/RE].forEach((k,i)=>{const x=E[0]+R0*k+(i===0?14:0),L=Math.max(14,120/(k*k));s+=arrow(x+L,E[1],x,E[1],{color:GRAV,w:7,head:16})+dot(x+L+6,E[1],7,C.ink);});
  s+=sat(E[0]+R0*RS/RE+40,E[1]-70,1.3)+label('衛星の 高さ',E[0]+R0*RS/RE,E[1]+80,{size:36,anchor:'middle',weight:700})+label('地上',E[0]+R0+40,E[1]-40,{size:36,anchor:'middle',weight:700});
  const X=k=>160+(840-160)*(k-1)/(RS/RE-1),Y=g=>830-300*g;
  s+=fade(v(0,.2),arrow(160,830,880,830,{color:C.dim,w:4,head:18})+arrow(160,830,160,430,{color:C.dim,w:4,head:18})+label('重力の 強さ',180,450,{size:36,color:GRAV,weight:700})+label('地球の 中心からの 距離',860,895,{size:36,anchor:'end',weight:700}));
  const pts=[];for(let i=0;i<=60;i++){const k=1+(RS/RE-1)*i/60;pts.push([X(k),Y(1/(k*k))]);}
  s+=draw(pts,v(.15,.7),{color:GRAV,w:6});
  s+=fade(v(.15,.3),dot(X(1),Y(1),12,GRAV)+label('地上：1',X(1)+20,Y(1)+10,{size:38,color:GRAV,weight:700}));
  s+=fade(v(.7,.9),dot(X(RS/RE),Y((RE/RS)**2),12,HC)+plate('衛星の 高さ：約17分の1',840,Y((RE/RS)**2)-50,{size:40,color:HC,anchor:'end'}));
  return s;},
 // 21a 細かく区切って、その場所の重力で足す（段を積み上げる）
 [K+'sum:steps']:(p,ctx)=>{const v=(a,b)=>vseg(ctx,p,a,b);
  let s=nanjo()+arrow(G3.x0,G3.y0,880,G3.y0,{color:C.dim,w:4,head:18})+arrow(G3.x0,G3.y0,G3.x0,110,{color:C.dim,w:4,head:18});
  s+=label('1日に 進む（μs）',270,128,{size:36,weight:700})+label('高さ',480,G3.y0+50,{size:36,anchor:'middle',weight:700})+label('2万 km',g3x(G3.H),G3.y0+50,{size:36,anchor:'middle',weight:700});
  s+=draw([[g3x(0),g3y(0)],[g3x(G3.H),g3y(190)]],1,{color:C.dim,w:4,dash:'14 10'})+label('点線：重力が 地上と 同じなら',180,200,{size:36,color:C.dim});
  for(let i=1;i<G3.N;i++)s+=fade(v(.1,.3),line(g3x(i*G3.H/G3.N),G3.y0,g3x(i*G3.H/G3.N),G3.y0-14,{color:C.dim,w:3}));
  const q=v(.3,.95)*G3.N,m=Math.ceil(q-1e-9);
  if(m>0)s+=draw(stepsPts(m),q/m,{color:HC,w:6});
  s+=fade(v(.05,.3),plate('区切りごとに 重力の 強さ × 区切りの 高さ',470,880,{size:40,color:HC,anchor:'middle'}));
  return s;},
 // 22b 上ほど重力が弱いので、増える差はだんだん小さい
 [K+'sum:less']:(p,ctx)=>{const v=(a,b)=>vseg(ctx,p,a,b);
  let s=nanjo()+arrow(G3.x0,G3.y0,880,G3.y0,{color:C.dim,w:4,head:18})+arrow(G3.x0,G3.y0,G3.x0,110,{color:C.dim,w:4,head:18});
  s+=label('1日に 進む（μs）',270,128,{size:36,weight:700})+label('高さ',480,G3.y0+50,{size:36,anchor:'middle',weight:700})+label('2万 km',g3x(G3.H),G3.y0+50,{size:36,anchor:'middle',weight:700});
  s+=draw([[g3x(0),g3y(0)],[g3x(G3.H),g3y(190)]],1,{color:C.dim,w:4,dash:'14 10'})+label('点線：重力が 地上と 同じなら',180,200,{size:36,color:C.dim});
  const P=stepsPts(G3.N);s+=draw(P,1,{color:HC,w:6});
  // 段ごとの積む量（縦の棒）
  for(let i=0;i<G3.N;i++){const a=P[2*i+1],b=P[2*i+2];s+=fade(v(.25+.05*i,.35+.05*i),line(a[0]+10,a[1],b[0]+10,b[1],{color:RED,w:10}));}
  const f=[(P[1][0]+10),(P[1][1]+P[2][1])/2],l=[(P[2*G3.N-1][0]+10),(P[2*G3.N-1][1]+P[2*G3.N][1])/2];
  s+=fade(v(.25,.45),line(260,330,f[0],f[1]-6,{color:RED,w:3,dash:'6 6'})+plate('下の 段：大きく 積む',190,320,{size:38,color:RED}));
  s+=fade(v(.65,.85),line(560,400,l[0],l[1]-8,{color:RED,w:3,dash:'6 6'})+plate('上の 段：少しだけ',190,410,{size:38,color:RED}));
  s+=fade(v(0,.3),plate('上へ 行くほど 重力が 弱い',470,880,{size:40,color:GRAV,anchor:'middle'}));
  return s;},
 // 21b 計算すると 45
 [K+'sum:result']:(p,ctx)=>{const v=(a,b)=>vseg(ctx,p,a,b);
  let s=nanjo()+arrow(G3.x0,G3.y0,880,G3.y0,{color:C.dim,w:4,head:18})+arrow(G3.x0,G3.y0,G3.x0,110,{color:C.dim,w:4,head:18});
  s+=label('1日に 進む（μs）',270,128,{size:36,weight:700})+label('高さ',480,G3.y0+50,{size:36,anchor:'middle',weight:700})+label('2万 km',g3x(G3.H),G3.y0+50,{size:36,anchor:'middle',weight:700});
  s+=draw([[g3x(0),g3y(0)],[g3x(G3.H),g3y(190)]],1,{color:C.dim,w:4,dash:'14 10'})+label('点線：重力が 地上と 同じなら',180,200,{size:36,color:C.dim});
  s+=fade(1-v(.1,.4)*.6,draw(stepsPts(G3.N),1,{color:HC,w:6}));
  const pts=[];for(let i=0;i<=60;i++){const h=G3.H*i/60;pts.push([g3x(h),g3y(real(h))]);}
  s+=draw(pts,v(.1,.5),{color:RED,w:7});
  s+=fade(v(.5,.8),dot(g3x(G3.H),g3y(real(G3.H)),14,RED)+plate('約45 μs',g3x(G3.H)-20,g3y(real(G3.H))-30,{size:52,color:RED,anchor:'end'}));
  s+=fade(v(.5,.8),plate('上へ 行くほど 寝ていく',830,700,{size:40,color:RED,anchor:'end'}));
  return s;},
 // 22a −7 と ＋45
 [K+'sat:pm']:(p,ctx)=>{const t=ctx.tg,b=swin(ctx,p,0,.3,.8),a=swin(ctx,p,1,.3,.8);
  let s=satTop(t,{ph:t,plus:a,minus:b});
  s+=satTable({hdr:vseg(ctx,p,0,.15),a,b});
  s+=fade(a,plate('速く 進む',SCK[0],445,{size:40,color:RED,anchor:'middle'}));
  return s;},
 // 22b 差し引き ＋38
 [K+'sat:net3']:(p,ctx)=>{const t=ctx.tg,c=vseg(ctx,p,.35,.7);
  let s=satTop(t,{ph:t,plus:1,minus:1});
  s+=satTable({a:1,b:1,c,net:c});
  s+=plate('速く 進む',SCK[0],445,{size:40,color:RED,anchor:'middle'});
  s+=fade(vseg(ctx,p,.75,.95),plate('地上より 速く 進む',60,560,{size:42,color:HC}));
  return s;},
 // 23 100万分の1秒で 300 m → 1日に 10 km 以上
 [K+'drift:map3']:(p,ctx)=>{const u=vseg(ctx,p,.35,.88),hrs=24*u,km=11.4*Math.floor(hrs)/24,t=ctx.tg;
  const P=[MP0[0]+MDIR[0]*u,MP0[1]+MDIR[1]*u];
  let s=mapBase()+pin(MP0[0],MP0[1],30,{col:'#ff8f9b'})+plate('本当の 場所',MP0[0],MP0[1]+70,{size:38,anchor:'middle'});
  if(u>0)s+=draw([MP0,P],1,{color:'#7fb2ff',w:4,dash:'10 10'});
  s+=dot(P[0],P[1],38*(1+.12*sn(t*4)),'#4c8dff',.25)+dot(P[0],P[1],18,'#4c8dff')+ring(P[0],P[1],20,{color:'#fff',w:3});
  s+=fade(vseg(ctx,p,0,.15),plate('100万分の1秒 → 300 m',70,110,{size:42,color:RADIO}));
  s+=fade(vseg(ctx,p,.3,.4),plate(`経過 ${Math.floor(hrs)}時間`,70,180,{size:42})+plate(`ずれ 約${km.toFixed(1)} km`,70,245,{size:42,color:'#7fb2ff'}));
  s+=line(700,850,700+MKM,850,{color:C.ink,w:5})+line(700,838,700,862,{color:C.ink,w:4})+line(700+MKM,838,700+MKM,862,{color:C.ink,w:4})+label('1 km',700+MKM+14,862,{size:36});
  s+=fade(vseg(ctx,p,.85,.98),plate('1日で 10 km 以上',470,480,{size:52,color:HC,anchor:'middle'}));
  s+=note('時間は 縮めて 見せています',40,912);
  return s;},

 // 1 もう一つの犯人は、高さ
 [K+'q:high']:(p,ctx)=>qScene(p,ctx,{culprit:swin(ctx,p,0,.4,.8),hgt:swin(ctx,p,1,.3,.9)}),
 // 2 重力の強い所はゆっくり、離れると速い
 [K+'q:rate']:(p,ctx)=>qScene(p,ctx,{hgt:1,slow:swin(ctx,p,0,.1,.7),fast:swin(ctx,p,1,.3,.85),diff:swin(ctx,p,1,.6,.9)}),
 // 3 本当？
 [K+'q:doubt']:(p,ctx)=>{const d=vseg(ctx,p,0,.3);
  return fade(1-.75*d,qScene(p,ctx,{hgt:1,slow:1,fast:1,diff:1}))+bigQ(500,560,vseg(ctx,p,.2,.6),220)+fade(vseg(ctx,p,.6,.9),label('本当？',560,740,{size:60,color:C.ink,anchor:'middle',weight:700}));},
 // 4 1915年、重力の正体についての理論
 [K+'ein:year']:(p,ctx)=>{const a=swin(ctx,p,0,0,.5),b=swin(ctx,p,1,0,.35),c=swin(ctx,p,1,.45,.85);
  let s=bust(240,300,{g:a})+fade(a,label('アインシュタイン',240,620,{size:40,anchor:'middle',weight:700}));
  s+=fade(a,label('1905年',480,180,{size:44,color:C.dim,weight:700})+label('速さと 時間',480,235,{size:38,color:C.dim}));
  s+=fade(b,label('1915年',480,350,{size:72,color:HC,weight:700}));
  s+=fade(c,rect(60,680,800,200,{fill:'#131f38',fo:.95,stroke:HC,sw:3,rx:18})+label('重力の 正体',460,765,{size:50,color:C.ink,anchor:'middle',weight:700})+label('についての 理論',460,840,{size:44,color:HC,anchor:'middle',weight:700}));
  return s;},
 // 5a ふしぎな思いつき
 [K+'lift:idea']:(p,ctx)=>{const g=vseg(ctx,p,.3,1);
  return fade(vseg(ctx,p,0,.4),plate('出発点：窓のない エレベーター',500,140,{size:44,color:HC,anchor:'middle'}))+liftPair(ctx.tg,{boxes:g,ball:0});},
 // 5b 窓のない箱：地上で止まっている／宇宙で上へ加速 → 区別がつかない
 [K+'lift:same']:(p,ctx)=>{const v=a=>vseg(ctx,p,a[0],a[1]);
  let s=liftPair(ctx.tg,{boxes:1,ball:v([.05,.2]),title:v([0,.15]),left:v([.3,.45]),right:v([.57,.72]),same:v([.83,.95])});
  s+=fade(v([.86,1]),plate('中の人には 区別が つかない',470,880,{size:42,color:HC,anchor:'middle'}));
  return s;},
 // 6 加速する箱の床から天井へ、1秒ごとに光の合図
 [K+'acc:send']:(p,ctx)=>{const a=accA(ctx),t=ctx.tg;
  let s=accBox(t,a,{pulses:1,lab:vseg(ctx,p,.3,.5)});
  s+=fade(vseg(ctx,p,0,.2),plate('宇宙で 上向きに 加速する 箱',40,70,{size:40,color:HC}));
  s+=fade(vseg(ctx,p,.55,.8),plate('1秒ごとに 光の 合図',40,135,{size:40,color:LIGHT}));
  s+=note('動きは ゆっくりに、加速は 大きく誇張',40,200);
  return s;},
 // 7 届くまでの間に、天井は逃げる
 [K+'acc:run']:(p,ctx)=>{const a=accA(ctx),t=ctx.tg,yc=floorY(t,a)-BH;
  let s=accBox(t,a);
  s+=plate('宇宙で 上向きに 加速する 箱',40,70,{size:40,color:HC})+plate('1秒ごとに 光の 合図',40,135,{size:40,color:LIGHT});
  s+=fade(vseg(ctx,p,.5,.75),up(BX[1]+40,yc+60,70,{color:C.x,w:6,head:20})+plate('天井が 逃げる',BX[1]+20,yc-10,{size:40,color:C.x}));
  s+=note('動きは ゆっくりに、加速は 大きく誇張',40,200);
  return s;},
 // 8a 後の合図ほど追いかける → 届く間隔は 1秒より少し長い
 [K+'acc:gap']:(p,ctx)=>{const a=accA(ctx),v=(x,y)=>vseg(ctx,p,x,y);
  let s=fade(1-v(0,.12),accBox(ctx.tg,a));
  s+=gapScale(a,{g:v(.05,.2),send:1,lines:v(.15,.55),arr:v(.4,.6),brace1:v(.55,.7),brace2:v(.75,.95)});
  s+=fade(v(.85,1),note('間隔の 差は 大きく誇張',60,575));
  return s;},
 // 8b 06 の遠ざかる衛星の音と同じ
 [K+'acc:sound']:(p,ctx)=>{const a=accA(ctx);
  return gapScale(a,{brace1:1,brace2:1,lines:1})+note('間隔の 差は 大きく誇張',60,575)+awaySat(ctx.t,{g:vseg(ctx,p,.05,.3)});},
 // 9 天井の人から見ると、床の時計はゆっくり
 [K+'acc:floor']:(p,ctx)=>{const t=cueT(p,ctx),sl=vseg(ctx,p,.35,.75);
  let s=boxStill(t,{slow:sl});
  s+=fade(seg(sl,.5,1),plate('ゆっくり',730,535,{size:42,color:BLUE}));
  s+=fade(seg(sl,.5,1),label('点線の針：天井の 時計',450,790,{size:36,color:C.dim,anchor:'middle'}));
  s+=fade(seg(sl,.5,1),note('差は 大きく誇張',40,905));
  return s;},
 // 10a 加速と重力は区別がつかない
 [K+'lift2:same']:(p,ctx)=>{
  let s=liftPair(ctx.tg,{boxes:1,ball:1,title:1,left:1,right:1,same:vseg(ctx,p,.2,.5)});
  s+=fade(vseg(ctx,p,.4,.7),plate('加速 ＝ 重力（区別が つかない）',470,880,{size:42,color:HC,anchor:'middle'}));
  return s;},
 // 10b 重力の中でも、下はゆっくり、上は速い → 予言
 [K+'lift2:predict']:(p,ctx)=>{const t=cueT(p,ctx),o=vseg(ctx,p,0,.15);
  let s=fade(1-o,liftPair(ctx.tg,{boxes:1,ball:1,title:1,left:1,right:1,same:1}));
  s+=building(t,{g:vseg(ctx,p,.05,.25),bot:swin(ctx,p,0,.3,.55),topc:swin(ctx,p,0,.6,.85)});
  s+=tag('予言',500,880,{g:swin(ctx,p,1,.5,.9),color:PRED,anchor:'middle',size:44});
  s+=fade(swin(ctx,p,0,.6,.9),note('差は 大きく誇張',40,905));
  return s;},
 // 7 1959年、22.5 m の塔の実験
 [K+'tower:year']:(p,ctx)=>{const v=(a,b)=>vseg(ctx,p,a,b);
  let s=towerScene({draw:v(.3,.6)});
  s+=fade(v(0,.06),label('1959年',600,260,{size:64,color:HC,weight:700}));
  s+=fade(v(.12,.3),label('アメリカの 大学',600,330,{size:40,weight:700}));
  s+=fade(v(.55,.75),line(340,TW.top,340,TW.bot,{color:C.ink,w:3})+line(322,TW.top,358,TW.top,{color:C.ink,w:3})+line(322,TW.bot,358,TW.bot,{color:C.ink,w:3})+label('22.5 m',320,500,{size:44,anchor:'end',weight:700}));
  s+=tag('実験',960,60,{anchor:'end',g:v(.8,.95)});
  return s;},
 // 8 塔の上と下で光をやりとり → 振動数がわずかにずれる
 [K+'tower:wave']:(p,ctx)=>{const t=ctx.tg,v=(a,b)=>vseg(ctx,p,a,b);
  let s=towerScene()+tag('実験',960,60,{anchor:'end'});
  s+=fade(1-v(0,.1),label('1959年',600,260,{size:64,color:HC,weight:700})+label('アメリカの 大学',600,330,{size:40,weight:700}));
  s+=fade(1-v(0,.1),line(340,TW.top,340,TW.bot,{color:C.ink,w:3})+label('22.5 m',320,500,{size:44,anchor:'end',weight:700}));
  // 塔の中を上へ進む光（下で出し、上で受ける）
  const up1=v(.05,.4),xm=(TW.x0+TW.x1)/2;
  const vp=[];for(let y=TW.bot-30;y>=TW.top+30;y-=4)vp.push([xm+14*sn(2*PI*(TW.bot-30-y)/60-t*6),y]);
  s+=draw(vp,up1,{color:LIGHT,w:5});
  s+=fade(v(.02,.1),dot(xm,TW.bot-24,14,HC))+fade(seg(up1,.9,1),ring(xm,TW.top+26,18,{color:HC,w:5}));
  s+=fade(v(.05,.2),label('上',TW.x0-20,TW.top+40,{size:40,anchor:'end',weight:700})+label('下',TW.x0-20,TW.bot-20,{size:40,anchor:'end',weight:700}));
  // 比べる：下で出した光／上で受けた光
  const cmp=v(.45,.65);
  s+=fade(cmp,label('下で 出した 光',600,580,{size:38,weight:700})+draw(wavePath(600,880,645,70,26,-t*6),1,{color:LIGHT,w:5}));
  s+=fade(cmp,label('上で 受けた 光',600,300,{size:38,weight:700})+draw(wavePath(600,880,360,80,26,-t*6*70/80),1,{color:LIGHT,w:5}));
  s+=fade(v(.7,.9),plate('振動数が',612,455,{size:40,color:HC})+plate('わずかに ずれた',612,510,{size:40,color:HC}));
  s+=tag('結果',570,760,{text:'予言どおり',g:v(.55,.7)});
  s+=fade(v(.6,.8),note('ずれは 大きく誇張',570,895));
  return s;},
 // 9 2020年、スカイツリーの地上と 450 m に時計
 [K+'tree:clocks']:(p,ctx)=>{const v=(a,b)=>vseg(ctx,p,a,b),t=ctx.tg;
  let s=rect(0,ST.yB,W,22,{fill:'#5a6b52',fo:.9,stroke:'none',rx:0})+skytree(ST.x,ST.yB,ST.h,{g:v(.15,.4)});
  s+=fade(v(0,.15),label('2020年',40,90,{size:56,color:HC,weight:700})+label('日本の 研究者',40,150,{size:38,weight:700}));
  s+=fade(v(.45,.6),line(230,STD,230,ST.yB,{color:C.ink,w:3})+line(212,STD,248,STD,{color:C.ink,w:3})+line(212,ST.yB,248,ST.yB,{color:C.ink,w:3})+label('約450 m',210,600,{size:40,anchor:'end',weight:700}));
  s+=clock(SKC[1][0],SKC[1][1],70,{ph:t,g:v(.3,.45)})+fade(v(.3,.45),line(ST.x+60,ST.yB-10,SKC[1][0]-74,SKC[1][1]+20,{color:C.dim,w:2,dash:'6 6'})+label('地上',SKC[1][0]+90,SKC[1][1]+14,{size:40,weight:700}));
  s+=clock(SKC[0][0],SKC[0][1],70,{ph:t,g:v(.5,.65)})+fade(v(.5,.65),line(ST.x+30,STD,SKC[0][0]-74,SKC[0][1],{color:C.dim,w:2,dash:'6 6'})+label('上',SKC[0][0]+90,SKC[0][1]+14,{size:40,weight:700}));
  s+=fade(v(.8,.95),plate('特に 正確な 時計',SKC[0][0],SKC[0][1]-110,{size:40,color:HC,anchor:'middle'}));
  s+=tag('実験',960,60,{anchor:'end',g:v(.85,1)});
  return s;},
 // 10 上の時計は 1日に 10億分の4秒 速い → 予言どおり
 [K+'tree:result']:(p,ctx)=>{const t=ctx.tg,a=swin(ctx,p,0,.35,.7),b=swin(ctx,p,1,.2,.7);
  let s=rect(0,ST.yB,W,22,{fill:'#5a6b52',fo:.9,stroke:'none',rx:0})+skytree(ST.x,ST.yB,ST.h);
  s+=label('2020年',40,90,{size:56,color:HC,weight:700})+label('日本の 研究者',40,150,{size:38,weight:700});
  s+=line(230,STD,230,ST.yB,{color:C.ink,w:3})+line(212,STD,248,STD,{color:C.ink,w:3})+line(212,ST.yB,248,ST.yB,{color:C.ink,w:3})+label('約450 m',210,600,{size:40,anchor:'end',weight:700});
  s+=clock(SKC[1][0],SKC[1][1],70,{ph:t})+line(ST.x+60,ST.yB-10,SKC[1][0]-74,SKC[1][1]+20,{color:C.dim,w:2,dash:'6 6'})+label('地上',SKC[1][0]+90,SKC[1][1]+14,{size:40,weight:700});
  s+=clock(SKC[0][0],SKC[0][1],70,{ph:t})+line(ST.x+30,STD,SKC[0][0]-74,SKC[0][1],{color:C.dim,w:2,dash:'6 6'})+label('上',SKC[0][0]+90,SKC[0][1]+14,{size:40,weight:700});
  s+=fade(1-vseg(ctx,p,0,.1),plate('特に 正確な 時計',SKC[0][0],SKC[0][1]-110,{size:40,color:HC,anchor:'middle'}));
  s+=fade(a,label('1日に',SKC[0][0]+20,SKC[0][1]-160,{size:38,color:RED,anchor:'middle',weight:700})+label('＋10億分の4秒',SKC[0][0]+20,SKC[0][1]-102,{size:46,color:RED,anchor:'middle',weight:700}));
  s+=fade(a,up(SKC[0][0]-160,SKC[0][1]-90,80,{color:RED,g:a,head:22,w:7}));
  s+=tag('結果',SKC[0][0],520,{text:'予言どおり',g:b,anchor:'middle'});
  s+=tag('実験',960,60,{anchor:'end'});
  return s;},
 // 11a 地面から2万 km 離れた衛星：効果はずっと大きい
 [K+'sat:far']:(p,ctx)=>{const v=(a,b)=>vseg(ctx,p,a,b),t=ctx.tg;
  let s=satTop(t,{ph:t,dim:v(.1,.45)});
  s+=fade(v(.45,.6),label('スカイツリーの 上：約450 m',60,700,{size:40,weight:700}));
  s+=fade(v(.5,.65),label('衛星：約2万 km',60,770,{size:40,color:HC,weight:700}));
  s+=fade(v(.75,.95),plate('効果は ずっと 大きい',60,860,{size:46,color:HC}));
  return s;},
 // 11b ＋45 μs／日（赤い上向き）
 [K+'sat:plus']:(p,ctx)=>{const t=ctx.tg,o=1-vseg(ctx,p,0,.12),a=vseg(ctx,p,.15,.65);
  let s=satTop(t,{ph:t,plus:a});
  s+=fade(o,label('スカイツリーの 上：約450 m',60,700,{size:40,weight:700})+label('衛星：約2万 km',60,770,{size:40,color:HC,weight:700})+plate('効果は ずっと 大きい',60,860,{size:46,color:HC}));
  s+=satTable({hdr:vseg(ctx,p,.1,.3),a});
  s+=fade(vseg(ctx,p,.7,.95),plate('速く 進む',SCK[0],445,{size:40,color:RED,anchor:'middle'}));
  return s;},
 // 12 −7 μs／日（青い下向き、09 の速さの分）
 [K+'sat:minus']:(p,ctx)=>{const t=ctx.tg,b=vseg(ctx,p,.3,.8);
  let s=satTop(t,{ph:t,plus:1,minus:b});
  s+=satTable({a:1,b});
  s+=plate('速く 進む',SCK[0],445,{size:40,color:RED,anchor:'middle'});
  s+=fade(vseg(ctx,p,0,.25),plate('前回：速さで 遅れる',60,560,{size:38,color:BLUE}));
  return s;},
 // 13 差し引き ＋38 μs／日
 [K+'sat:net']:(p,ctx)=>{const t=ctx.tg,c=vseg(ctx,p,.35,.7);
  let s=satTop(t,{ph:t,plus:1,minus:1});
  s+=satTable({a:1,b:1,c,net:c});
  s+=plate('速く 進む',SCK[0],445,{size:40,color:RED,anchor:'middle'});
  s+=fade(1-vseg(ctx,p,0,.15),plate('前回：速さで 遅れる',60,560,{size:38,color:BLUE}));
  s+=fade(vseg(ctx,p,.75,.95),plate('地上より 速く 進む',60,560,{size:42,color:HC}));
  return s;},
 // 14 たった 38 μs。でも 100万分の1秒で 300 m
 [K+'ruler:300']:(p,ctx)=>{const a=swin(ctx,p,0,0,.2),b=swin(ctx,p,1,0,.35),m=swin(ctx,p,1,.3,.95);
  let s=fade(a,label('たった 100万分の38秒',500,130,{size:52,color:HC,anchor:'middle',weight:700}));
  const X0=100,X1=860,Y=440;
  s+=fade(b,label('電波が 100万分の1秒で 進む 距離',480,340,{size:38,anchor:'middle',weight:700}));
  s+=fade(b,rect(X0,Y-18,X1-X0,36,{fill:'#131f38',fo:1,stroke:C.faint,sw:2,rx:6}));
  [0,100,200,300].forEach((d,i)=>{s+=fade(b,line(X0+(X1-X0)*d/300,Y-30,X0+(X1-X0)*d/300,Y+30,{color:C.dim,w:3})+label(`${d} m`,X0+(X1-X0)*d/300,Y+80,{size:36,color:C.dim,anchor:'middle'}));});
  s+=fade(b,rect(X0,Y-18,(X1-X0)*m,36,{fill:RADIO,fo:.75,stroke:RADIO,sw:2,rx:6})+dot(X0+(X1-X0)*m,Y,14,RADIO));
  s+=fade(seg(m,.85,1),label('300 m',480,640,{size:64,color:RADIO,anchor:'middle',weight:700}));
  return s;},
 // 15 直さないと 1日で 10 km 以上ずれる
 [K+'drift:map']:(p,ctx)=>{const u=vseg(ctx,p,.08,.85),hrs=24*u,km=11.4*Math.floor(hrs)/24,t=ctx.tg;
  const P=[MP0[0]+MDIR[0]*u,MP0[1]+MDIR[1]*u];
  let s=mapBase()+pin(MP0[0],MP0[1],30,{col:'#ff8f9b'})+plate('本当の 場所',MP0[0],MP0[1]+70,{size:38,anchor:'middle'});
  if(u>0)s+=draw([MP0,P],1,{color:'#7fb2ff',w:4,dash:'10 10'});
  s+=dot(P[0],P[1],38*(1+.12*sn(t*4)),'#4c8dff',.25)+dot(P[0],P[1],18,'#4c8dff')+ring(P[0],P[1],20,{color:'#fff',w:3});
  s+=fade(vseg(ctx,p,0,.1),plate(`経過 ${Math.floor(hrs)}時間`,70,110,{size:42})+plate(`ずれ 約${km.toFixed(1)} km`,70,175,{size:42,color:'#7fb2ff'}));
  s+=line(700,850,700+MKM,850,{color:C.ink,w:5})+line(700,838,700,862,{color:C.ink,w:4})+line(700+MKM,838,700+MKM,862,{color:C.ink,w:4})+label('1 km',700+MKM+14,862,{size:36});
  s+=fade(vseg(ctx,p,.82,.98),plate('1日で 10 km 以上',470,480,{size:52,color:HC,anchor:'middle'}));
  s+=note('時間は 縮めて 見せています',40,912);
  return s;},
 // 16 打ち上げる前に、わざとほんの少しゆっくりに合わせる
 [K+'tune:set']:(p,ctx)=>{const t=ctx.tg,ve=voiceEnd(ctx),k0=.62*ve,turn=clamp((cueT(p,ctx)-k0)/(ve*.25)),ph=tunePh(t,ve);
  let s=rect(0,820,W,26,{fill:'#5a6b52',fo:.9,stroke:'none',rx:0});
  s+=fade(vseg(ctx,p,0,.15),plate('打ち上げる 前（地上）',60,100,{size:42,color:HC}));
  s+=rect(110,700,180,120,{fill:'#3a4560',fo:1,stroke:SKY,sw:3,rx:6})+sat(TS[0],TS[1],2.6);
  const CX=580,CY=400,R=120;
  s+=fade(vseg(ctx,p,.1,.3),clock(CX,CY,R,{ph,ghost:vseg(ctx,p,.5,.6)>0?t:null})+label('衛星の 時計',CX,CY-R-30,{size:40,anchor:'middle',weight:700}));
  // つまみ
  const kx=CX+R+26,ka=turn*PI*1.2;
  s+=fade(vseg(ctx,p,.1,.3),rect(CX+R+4,CY-22,30,44,{fill:SKY,fo:1,stroke:SKY,rx:5})+line(kx,CY,kx+14*cs(ka-PI/2),CY+14*sn(ka-PI/2),{color:'#0e1830',w:4}));
  s+=fade(seg(turn,0,.2)*(1-seg(turn,.9,1)),`<path d="M${kx+40} ${CY-40} A 50 50 0 0 1 ${kx+40} ${CY+40}" fill="none" stroke="${HC}" stroke-width="5"/>`+arrow(kx+40,CY+30,kx+30,CY+44,{color:HC,w:5,head:18}));
  s+=fade(vseg(ctx,p,.5,.62),label('点線の針：地上の 時計',CX,CY+R+56,{size:36,color:C.dim,anchor:'middle'}));
  s+=fade(seg(turn,.3,.8),plate('ほんの わずかに 遅く',630,680,{size:42,color:BLUE,anchor:'middle'}));
  s+=fade(seg(turn,.3,.8),note('差は 大きく誇張',40,900));
  return s;},
 // 17 宇宙に上がると、ちょうど地上と同じ速さ
 [K+'tune:orbit']:(p,ctx)=>{const t=ctx.tg,ct=cueT(p,ctx),r=vseg(ctx,p,0,.35),b=vseg(ctx,p,.35,.6);
  let s=fade(1-r,rect(0,820,W,26,{fill:'#5a6b52',fo:.9,stroke:'none',rx:0}))+groundArc({g:r});
  const D0=capStart(ctx,ctx.k)-capStart(ctx,ctx.k-1),ve0=Math.max(.5,D0-.12-1.1);
  s+=fade(1-vseg(ctx,p,0,.15),clock(580,400,120,{ph:tunePh(D0+ct,ve0),ghost:D0+ct})+plate('ほんの わずかに 遅く',600,680,{size:42,color:BLUE,anchor:'middle'}));
  const sx=mix(TS[0],QS[0],r),sy=mix(TS[1],QS[1],r);
  s+=sat(sx,sy,mix(2.6,2.2,r));
  s+=fade(r*(1-seg(r,.9,1))+0,poly([[sx-12,sy+60],[sx+12,sy+60],[sx,sy+110]],{fill:'#ff9b3e',fo:.8}));
  s+=clock(QSC[0],QSC[1],80,{ph:ct,g:b})+fade(b,label('宇宙の 時計',QSC[0],QSC[1]+130,{size:38,anchor:'middle',weight:700}));
  s+=line(QG[0],QG[1]+86,QG[0],820,{color:SKY,w:6,opacity:b})+clock(QG[0],QG[1],80,{ph:ct,g:b})+fade(b,label('地上の 時計',QG[0],QG[1]-104,{size:38,anchor:'middle',weight:700}));
  s+=fade(vseg(ctx,p,.7,.9),plate('そろって 進む',500,470,{size:52,color:HC,anchor:'middle'}));
  return s;},
 // 18 振り返り：06〜10 の流れ
 [K+'recap:chain']:(p,ctx)=>{const t=ctx.tg,v=a=>vseg(ctx,p,a,a+.1);
  const i1=sat(120,80,1.2)+draw([[120,100],[205,150]],1,{color:RADIO,w:4,dash:'8 7'})+phone(215,175,60,{grid:false,t});
  const P=[165,345],cc=[[112,305],[218,312],[160,404]];
  const i2=cc.map((c,j)=>ring(c[0],c[1],Math.hypot(c[0]-P[0],c[1]-P[1]),{color:[C.x,C.E,C.F][j],w:3})).join('')+dot(P[0],P[1],9,HC);
  const i3=atom(160,560,62,t);
  const i4=clock(160,775,52,{ph:t})+up(232,800,60,{color:RED,head:16,w:5})+down(90,750,24,{color:BLUE,head:14,w:5});
  let s=`<clipPath id="d10r2"><rect x="50" y="250" width="220" height="190" rx="14"/></clipPath>`;
  s+=rowBox(0,v(0),'06',i1,['電波が 届く 時間','→ 距離']);
  s+=rowBox(1,v(.26),'07',`<g clip-path="url(#d10r2)">${i2}</g>`,['4機の 衛星で','場所と 時計の ずれ']);
  s+=rowBox(2,v(.6),'08',i3,['原子が 刻む 時間']);
  s+=rowBox(3,v(.77),'09・10',i4,['アインシュタインの','理論で 直す']);
  return s;},
 // 19 スマホの地図
 [K+'phone:map']:(p,ctx)=>{const t=ctx.tg;
  let s='';
  [[120,110],[860,90],[110,420],[880,380]].forEach(([x,y],j)=>{s+=fade(vseg(ctx,p,.05+.05*j,.2+.05*j),sat(x,y,1.3)+line(x,y+30,470,430,{color:RADIO,w:2,dash:'6 10'}));});
  s+=phone(470,430,620,{t});
  s+=fade(vseg(ctx,p,.45,.65),plate('アインシュタインの 二つの 理論',470,830,{size:46,color:HC,anchor:'middle'}));
  return s;},
 // 20a 重力がもっと強い所では？
 [K+'next:strong']:(p,ctx)=>{const t=ctx.tg,v=(a,b)=>vseg(ctx,p,a,b);
  const X=[170,470,770];
  let s=sat(X[0],120,1.6)+groundArc({g:0})+rect(X[1]-110,150,220,14,{fill:'#5a6b52',fo:.9,stroke:'none',rx:3})+person(X[1],150,90);
  s+=label('衛星',X[0],205,{size:36,anchor:'middle',weight:700})+label('地上',X[1],205,{size:36,anchor:'middle',weight:700});
  s+=clock(X[0],300,75,{ph:t*1.35})+clock(X[1],300,75,{ph:t});
  s+=down(X[0],400,30,{color:GRAV,head:18,w:6})+down(X[1],400,80,{color:GRAV,head:22,w:7});
  s+=label('重力 弱い',X[0],560,{size:38,color:GRAV,anchor:'middle',weight:700})+label('重力 強い',X[1],560,{size:38,color:GRAV,anchor:'middle',weight:700});
  s+=label('速い',X[0],650,{size:40,color:RED,anchor:'middle',weight:700})+label('ゆっくり',X[1],650,{size:40,color:BLUE,anchor:'middle',weight:700});
  const g3=v(.15,.45);
  s+=fade(g3,dot(X[2],110,40,'#3a3f52')+clock(X[2],300,75,{hands:false})+label('？',X[2],330,{size:90,color:HC,anchor:'middle',weight:700})+down(X[2],400,130,{color:GRAV,head:26,w:9,g:g3}));
  s+=fade(g3,label('もっと 強い',X[2],560,{size:38,color:GRAV,anchor:'middle',weight:700}));
  s+=fade(v(.6,.9),bigQ(X[2],800,1,140));
  return s;},
 // 25 ブラックホールのそばでは、遠くから見ると時計が止まって見えることさえある
 [K+'next:stop']:(p,ctx)=>{const t=ctx.tg,o=vseg(ctx,p,0,.12),g=vseg(ctx,p,.05,.25);
  let s=fade(1-o,deep10Diagrams[K+'next:strong'](1,{...ctx,t:99}));
  s+=fade(g,blackHole(420,520,120,t));
  const L=vseg(ctx,p,.08,.3);
  [[[40,330],[312,475]],[[40,690],[322,580]]].forEach(([A,B])=>{const pts=[];for(let k=0;k<=30;k++){const u=k/30;pts.push([mix(A[0],B[0],u),mix(A[1],B[1],u*u)]);}s+=draw(pts,L,{color:LIGHT,w:4});});
  s+=fade(vseg(ctx,p,.1,.3),plate('光さえ 抜け出せない',420,790,{size:40,color:LIGHT,anchor:'middle'}));
  // そばの時計（ほとんど止まる）と、遠くの時計
  const near=vseg(ctx,p,.45,.65);
  s+=fade(near,clock(620,420,56,{ph:(()=>{const ct=cueT(p,ctx),t1=.5*voiceEnd(ctx);return 4+.6*(ct<t1?ct:t1+(ct-t1)*.04);})()}));
  s+=fade(near,clock(830,140,56,{ph:t})+label('遠くの 時計',830,240,{size:36,anchor:'middle',weight:700}));
  s+=fade(vseg(ctx,p,.75,.95),plate('そばの 時計：ほとんど 止まって 見える',440,870,{size:40,color:HC,anchor:'middle'}));
  return s;},
 // 26 時間に、何が起きている？
 [K+'next:what']:(p,ctx)=>{const t=ctx.tg;
  let s=fade(.35,blackHole(420,560,120,t)+clock(610,440,56,{ph:4.3}));
  s+=finalCard(['そこで 時間に','何が 起きている？'],vseg(ctx,p,.2,.6),{y:80,size:58});
  s+=bigQ(500,820,vseg(ctx,p,.5,.9),160);
  return s;},
};

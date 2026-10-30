// 深掘りショート 11（ys-deep-11）「水の中の光は、本当に遅くなっている？」— 図。縦長の舞台 1000×920（vert-v1）。試作。
// このファイルで作った形：論理の筋の帯（logic、舞台の上 y 0–256）・事実①②の小さな札（facts、舞台の下 y 850–915、稲妻つき）・
//   大きな事実のカード（factCard）・山場の札（yamaba、07 の難所の札と同じ見た目）・波（wv）・電子（elec）・原子・霧の粒・景色（view）。
// 帯を出す場面では、絵は y 270–840 に描く。帯のない場面は y 0–840。
// 決めた値
//  - 光の波：波長 160px（帯の場面）。電子の並び：間隔 34px（波長の約5分の1、「ずっと細かい」の見せ方）。
//  - 横・前の足し算：8 本の波。横は位相 2πk/8（足すと 0）、前は位相そろい（足すと 8 倍）。図の和は実際に sin を足した。
//  - 出し直しの波：元の光より 1/4 周期遅れ、振幅 0.35。和の位相の遅れ δ＝atan2(0.35,1)＝19.3°（大きく誇張）。
//  - 層の積み重ね：8 層、1 層ごとに δ ずつ遅れる（大きく誇張）。速さの比較の山は 1 と 0.75。
//  - 速さの棒：空気 0.9997、水 0.75、ガラス 0.67、ダイヤモンド 0.41。
import {C,seg,clamp,mix,fade,label,line,rect,dot,ring,draw,arrow,poly,scaleAt} from './anim.mjs';
import {W,H,HC,LIGHT,WATER,SURF,cueT,voiceEnd,vseg,swin,tag,note,plate,bigQ} from './yt1-sp-deep-common.mjs';
import {strawScene} from './yt1-sp-deep-01-diagrams.mjs';

const K='deep11-',PI=Math.PI,DEG=PI/180;
const RED_='#ff6b6b',GREEN='#83ecc0',ORANGE='#ff9f43',ELEC='#6adfff',VIO='#a274ff',RED='#ff4b3e';
const jw=s=>[...String(s)].reduce((w,c)=>w+(/[ -~]/.test(c)?.55:1),0);
const hash=i=>{const s=Math.sin(i*127.1+311.7)*43758.5453;return s-Math.floor(s);};
const tg=(ctx,p)=>ctx&&typeof ctx.tg==='number'?ctx.tg:cueT(p,ctx);

// ================= 論理の筋（上の帯） =================
const BH=['仮説','もし正しいなら','予言','事実','判定'];
// v：[[文字, 出る割合, 色]…]（5つ）。act：光らせる行
function logic(v,{g=1,act=-1}={}){
 if(g<=0)return '';
 let s=rect(0,0,W,256,{fill:'#101a30',fo:.97,stroke:C.faint,sw:2,rx:16});
 BH.forEach((h,i)=>{const y=44+48*i,f=v[i]&&v[i][1]>0?v[i][1]:0;
  if(i===act)s+=rect(8,y-37,984,46,{fill:HC,fo:.12,stroke:HC,sw:2,rx:10});
  if(i>0)s+=line(36,y-50,36,y-38,{color:C.faint,w:3});
  s+=label(h,24,y,{size:36,color:i===act?HC:f>0?C.ink:C.dim,weight:700});
  if(f>0)s+=fade(f,label(v[i][0],310,y,{size:38,color:v[i][2]??C.ink,weight:700}));});
 return fade(g,s);
}
const L1=['ジグザグの 回り道','光の 向きが ばらばらに','白く にごる','透き通っている','×  捨てる'];
const L2=['電子が 受け渡す','あらゆる 向きに 光を出す','にごる','透き通っている','？'];
const L3=['電子が 出し直す（仮説2）','ずれが 積み重なる','同じ物なら 詰まるほど 遅い','水蒸気 ほぼ1 ／ 水 0.75','○ 遅くなる ことも 説明できる'];
const row=(L,i,g,col)=>[L[i],g,col];

// ================= 事実①② の小さな札（下） =================
function facts({g=1,glow1=0,glow2=0,bolt=0,ok=0}={}){
 if(g<=0)return '';
 const t1='① 水の中は 4分の3',t2='② 何もない所は いつも同じ',y=852,h=60;
 const w1=jw(t1)*36+36,w2=jw(t2)*36+36,x1=20,x2=x1+w1+52;
 const one=(x,w,t,gl)=>rect(x,y,w,h,{fill:C.bg,fo:.92,stroke:'none',rx:30})+rect(x,y,w,h,{fill:gl>0?HC:'#8aa0c4',fo:.10+.15*gl,stroke:gl>0?HC:'#8aa0c4',sw:2+3*gl,rx:30})+label(t,x+w/2,y+43,{size:36,color:gl>0?HC:C.ink,anchor:'middle',weight:700});
 let s=one(x1,w1,t1,glow1)+one(x2,w2,t2,glow2);
 const bx=x1+w1+26;
 if(bolt>0)s+=fade(bolt,poly([[bx+6,y+4],[bx-12,y+34],[bx,y+34],[bx-8,y+58],[bx+14,y+24],[bx+2,y+24],[bx+10,y+4]],{fill:ORANGE,fo:1,stroke:'none'}));
 if(ok>0)s+=fade(ok,label('＝',bx,y+44,{size:40,color:GREEN,anchor:'middle',weight:700}));
 return fade(g,s);
}
// 大きな事実のカード（行6）
function factCard(y,n,t,g,{glow=0}={}){
 const w=760,x=120;
 let s=rect(x,y,w,150,{fill:'#131f38',fo:.96,stroke:glow>0?HC:'#8aa0c4',sw:3+3*glow,rx:22});
 s+=tag('事実',x+30,y+62,{size:36,text:n,color:'#edf4ff'})+label(t,x+30,y+125,{size:46,color:C.ink,weight:700});
 return fade(g,s);
}
// 山場の札（07 の難所の札と同じ見た目、文字だけ「山場」）
function yamaba(g=1){
 if(g<=0)return '';
 const x=40,y=10,w=226,h=70;
 let o=rect(x,y,w,h,{fill:C.bg,fo:.92,stroke:ORANGE,sw:4,rx:16});
 o+=poly([[x+18,y+54],[x+40,y+22],[x+62,y+54]],{fill:ORANGE,fo:.85})+poly([[x+46,y+54],[x+64,y+32],[x+84,y+54]],{fill:ORANGE,fo:.5});
 o+=label('山場',x+100,y+51,{size:44,color:ORANGE,weight:700});
 return fade(g,o);
}

// ================= 波・電子 =================
// 波：x0→x1、中心 yc、波長 L、振幅 A、位相 ph（ラジアン、進む向きは +x、t で動く）
function wvPts(x0,x1,yc,L,A,ph,t,speed=60){const pts=[];for(let x=x0;x<=x1+.1;x+=4)pts.push([x,yc-A*Math.sin(2*PI*(x-x0-speed*t)/L+ph)]);return pts;}
const wv=(x0,x1,yc,L,A,ph,t,{color=LIGHT,w=4,u=1,opacity=1,speed=60}={})=>draw(wvPts(x0,x1,yc,L,A,ph,t,speed),u,{color,w,opacity});
const elec=(x,y,{r=9,g=1,col=ELEC}={})=>fade(g,dot(x,y,r+5,col,.25)+dot(x,y,r,col));
// 輪になって広がる光（一つの電子から）
function rings(x,y,t,{R=300,L=70,g=1,col=LIGHT}={}){
 if(g<=0)return '';let s='';
 for(let k=0;k<6;k++){const r=((t*70)%L)+k*L;if(r>R)continue;s+=ring(x,y,r,{color:col,w:3})+'';}
 return fade(g*1,`<g opacity=".8">${s}</g>`);
}
// 原子（点線の外形・小さな核・電子）
function atom(cx,cy,r,t,{g=1,nuc=6,ne=3}={}){
 let s=ring(cx,cy,r,{color:'#5f7398',w:2,dash:'8 8'})+dot(cx,cy,nuc,ORANGE);
 for(let k=0;k<ne;k++){const a=t*(1.2+.3*k)+k*2.1,rr=r*(.55+.15*k);s+=elec(cx+rr*Math.cos(a),cy+rr*.8*Math.sin(a),{r:Math.max(4,r*.05)});}
 return fade(g,s);
}
// 水の分子（O 赤・H 白）
function molecule(x,y,s=1,a=0){const r=22*s,h=12*s,d=30*s;const ha=[a+52.25*DEG,a-52.25*DEG].map(q=>[x+d*Math.cos(q),y+d*Math.sin(q)]);
 return ha.map(([u,v])=>dot(u,v,h,'#e8eef8')).join('')+dot(x,y,r,'#ff6b6b');}

// ================= 景色（ぼやける／くっきり） =================
function view(x,y,w,h,{haze=0,id='v'}={}){
 let sc=`<defs><linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a78d8"/><stop offset="1" stop-color="#9cc6f5"/></linearGradient><clipPath id="${id}c"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16"/></clipPath>${haze>0?`<filter id="${id}f"><feGaussianBlur stdDeviation="${(6*haze).toFixed(1)}"/></filter>`:''}</defs>`;
 let g=rect(x,y,w,h,{fill:`url(#${id}g)`,fo:1,stroke:'none',rx:0});
 g+=poly([[x,y+h*.75],[x+w*.25,y+h*.42],[x+w*.45,y+h*.68],[x+w*.7,y+h*.35],[x+w,y+h*.7],[x+w,y+h],[x,y+h]],{fill:'#3f6e58',fo:1});
 g+=rect(x,y+h*.85,w,h*.15,{fill:'#2c4a3a',fo:1,stroke:'none',rx:0});
 for(let k=0;k<4;k++){const tx=x+w*(.12+.22*k),ty=y+h*.86;g+=rect(tx-6,ty-40,12,40,{fill:'#5a3a22',fo:1,stroke:'none',rx:2})+dot(tx,ty-56,30,'#2f8a4e');}
 sc+=`<g clip-path="url(#${id}c)"><g${haze>0?` filter="url(#${id}f)"`:''}>${g}</g>${haze>0?rect(x,y,w,h,{fill:'#f4f6fa',fo:.62*haze,stroke:'none',rx:0}):''}</g>`;
 return sc+rect(x,y,w,h,{fill:'none',fo:0,stroke:'#8aa0c4',sw:3,rx:16});
}
// プールの底（タイルの線）
function poolFloor(x,y,w,h){
 let s=rect(x,y,w,h,{fill:'#5fb6e8',fo:.9,stroke:'none',rx:16});
 for(let u=x+40;u<x+w;u+=70)s+=line(u,y,u,y+h,{color:'#1f5f8a',w:5});
 for(let v=y+40;v<y+h;v+=70)s+=line(x,v,x+w,v,{color:'#1f5f8a',w:5});
 s+=rect(x,y,w,h,{fill:'#bfe6ff',fo:.18,stroke:'#8aa0c4',sw:3,rx:16});
 return s;
}

// ================= 仮説1：ジグザグ =================
const ZM=Array.from({length:14},(_,i)=>[160+hash(i)*680,330+hash(i+40)*420]);
function zigScene(u,{straight=0,dim=0,x=0}={}){
 let s=ZM.map(([a,b],i)=>molecule(a,b,.8,hash(i+7)*PI)).join('');
 const path=[[60,540],[250,380],[380,640],[560,420],[700,700],[940,560]];
 s+=fade(straight,line(60,540,940,560,{color:C.dim,w:3,dash:'12 10'})+plate('まっすぐ',820,500,{size:38,color:C.dim}));
 s+=draw(path,u,{color:LIGHT,w:6});
 if(u>.98)s+=arrow(820,630,940,560,{color:LIGHT,w:6,head:22});
 return fade(1-.6*dim,s);
}
function scatterScene(t,g){
 let s=ZM.slice(0,8).map(([a,b],i)=>molecule(a,b,.8,hash(i+7)*PI)).join('');
 for(let i=0;i<14;i++){const t0=i*.35,dt=t-t0;if(dt<0)break;const m=ZM[i%8],y0=360+hash(i+3)*380;
  if(dt<1){s+=dot(mix(40,m[0],dt),mix(y0,m[1],dt),8,LIGHT);}else{const d=dt-1,a=hash(i+11)*2*PI;if(d<1.6)s+=fade(1-d/1.6,line(m[0],m[1],m[0]+240*d*Math.cos(a),m[1]+240*d*Math.sin(a),{color:LIGHT,w:4})+dot(m[0]+240*d*Math.cos(a),m[1]+240*d*Math.sin(a),8,LIGHT));}}
 return fade(g,s);
}

// ================= 仮説2：電子が揺さぶられて光を出す =================
function shakeScene(t,{n=1,rg=0,wave=1}={}){
 let s=fade(wave,wv(40,960,560,160,40,0,t,{color:LIGHT,w:4,opacity:.6}));
 const xs=n===1?[500]:[260,500,740];
 xs.forEach((x,i)=>{const y=560-14*Math.sin(2*PI*(x-40-60*t)/160);s+=line(x,520,x,600,{color:C.faint,w:2})+elec(x,y,{r:12});
  if(rg>0)s+=rings(x,560,t-i*.4,{R:220,L:60,g:rg});});
 return s;
}
function antenna(t,g){
 let s=line(300,320,300,800,{color:'#c4cde0',w:10})+[0,1,2].map(k=>line(250,360+40*k,350,360+40*k,{color:'#c4cde0',w:6})).join('');
 for(let k=0;k<5;k++){const y=460+60*k+20*Math.sin(t*4);s+=elec(300,y,{r:8});}
 s+=wv(380,940,500,150,36,0,-t,{color:'#8ec0ff',w:4,speed:60});
 s+=arrow(560,600,420,600,{color:'#8ec0ff',w:4,head:18});
 s+=plate('アンテナ',230,860-50,{size:38,color:'#c4cde0',anchor:'middle'})+plate('電波',660,420,{size:38,color:'#8ec0ff',anchor:'middle'});
 return fade(g,s);
}

// ================= 山場：たくさんの電子 =================
const GX0=120,GX1=880,GY0=380,GY1=780,GS=34;
function grid(t,{g=1,y0=GY0,y1=GY1,shake=1,lit=-1}={}){
 let s='';
 for(let x=GX0;x<=GX1;x+=GS)for(let y=y0;y<=y1;y+=GS){const dy=4*shake*Math.sin(2*PI*(x-60*t)/160);
  const on=lit>=0&&x<=lit;s+=dot(x,y+dy,on?7:5,on?HC:ELEC,on?1:.85);}
 return fade(g,s);
}
// 8 本の波と、その和（実際に足す）
function sumPanel(x0,y0,w,h,phases,t,{g=1,title='',sumG=1,sumCol=GREEN,A=16,scaleSum=1}={}){
 if(g<=0)return '';
 const L=160,yc=y0+h/2;let s=rect(x0,y0,w,h,{fill:'#101a30',fo:.95,stroke:C.faint,sw:2,rx:14});
 phases.forEach((ph,i)=>{s+=wv(x0+20,x0+w-20,yc,L,A,ph,t,{color:['#ff8a7e','#ffb36b','#ffe28a','#83ecc0','#6adfff','#8ec0ff','#b49bff','#ff9ce6'][i%8],w:2.5,opacity:.85});});
 // 和
 const pts=[];for(let x=x0+20;x<=x0+w-20;x+=4){let v=0;for(const ph of phases)v+=A*Math.sin(2*PI*(x-x0-20-60*t)/L-ph);pts.push([x,yc-v*scaleSum]);}
 s+=fade(sumG,draw(pts,1,{color:sumCol,w:7}));
 if(title)s+=label(title,x0+20,y0-14,{size:38,color:C.ink,weight:700});
 return fade(g,s);
}
const PH_SIDE=Array.from({length:4},(_,k)=>2*PI*k/4),PH_FRONT=Array.from({length:4},()=>0);
const ROWC=['#ff8a7e','#ffe28a','#6adfff','#b49bff'];
// 波を1本ずつ別の行に描き（rowG：各行の出る割合）、下の行に実際の和を描く
function sumRows(x0,y0,phases,t,{rowG=[],sumG=0,A=18,rowH=50,sumY,sumText='',sumCol=GREEN}={}){
 const x1=x0+700,L=160;let s='';
 phases.forEach((ph,i)=>{const g=rowG[i]??1;if(g<=0)return;const yc=y0+i*rowH;
  s+=fade(g,label(`電子${i+1}`,x0-150,yc+12,{size:36,color:ROWC[i],weight:700})+wv(x0,x1,yc,L,A,ph,t,{color:ROWC[i],w:3.5}));});
 if(sumG>0){const yc=sumY,pts=[];for(let x=x0;x<=x1;x+=4){let v=0;for(const ph of phases)v+=A*Math.sin(2*PI*(x-x0-60*t)/L-ph);pts.push([x,yc-v]);}
  s+=fade(sumG,line(x0-150,yc-A*phases.length*.0-62,x1,yc-62,{color:C.faint,w:2})+label('足すと',x0-150,yc+12,{size:36,color:sumCol,weight:700})+draw(pts,1,{color:sumCol,w:6})+(sumText?plate(sumText,x1-10,yc+56,{size:38,color:sumCol,anchor:'end'}):''));}
 return s;
}

// ================= 霧 =================
const DROPS=Array.from({length:9},(_,i)=>[150+hash(i+70)*380,340+hash(i+90)*380,34+hash(i+30)*30]);
function fog(t,{g=1,sc=0}={}){
 let s='';
 DROPS.forEach(([x,y,r],i)=>{s+=`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${r.toFixed(1)}" ry="${(r*.85).toFixed(1)}" fill="#cfe2ff" fill-opacity=".35" stroke="#e8f2ff" stroke-width="3" transform="rotate(${(hash(i)*60).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;});
 if(sc>0)DROPS.forEach(([x,y,r],i)=>{for(let k=0;k<5;k++){const a=hash(i*5+k)*2*PI,d=r+20+((t*120+k*50)%160);s+=fade(sc*(1-((t*120+k*50)%160)/160),arrow(x+(r+8)*Math.cos(a),y+(r+8)*Math.sin(a),x+d*Math.cos(a),y+d*Math.sin(a),{color:LIGHT,w:3,head:12}));}});
 return fade(g,s);
}

// ================= 遅れ・和・層 =================
const LAG=PI/2,AR=.35,DELTA=Math.atan2(AR*Math.sin(LAG),1+AR*Math.cos(LAG)); // 19.3°
const AMP_SUM=Math.hypot(1+AR*Math.cos(LAG),AR*Math.sin(LAG));
const WL=240;
// 山の位置（x0 から見て、位相 ph の波で t のときの最初の山）
const crestX=(x0,ph,t)=>{let x=x0+60*t+(PI/2-ph)/(2*PI)*WL;while(x>x0+WL)x-=WL;while(x<x0)x+=WL;return x;};
function lagPanel(t,{orig=1,re=0,sum=0,showLag=0,crest=0,yo=430,yr=600,ys=760,x0=60,x1=900}={}){
 let s='';
 const A=60;
 s+=fade(orig,wv(x0,x1,yo,WL,A,0,t,{color:LIGHT,w:5})+plate('元の 光',x0,yo-80,{size:38,color:LIGHT}));
 s+=fade(re,wv(x0,x1,yr,WL,A*AR,LAG,t,{color:ELEC,w:5})+plate('出し直しの 光',x0,yr-50,{size:38,color:ELEC}));
 if(showLag>0){const c0=crestX(x0+200,0,t),c1=c0-LAG/(2*PI)*WL;
  s+=fade(showLag,line(c0,yo-A-14,c0,yr+30,{color:LIGHT,w:3,dash:'8 8'})+line(c1,yr-A*AR-20,c1,yr+30,{color:ELEC,w:3,dash:'8 8'})+arrow(c0,yr+50,c1,yr+50,{color:HC,w:4,head:14})+plate('少し 遅れる',Math.min(c0,c1)-10,yr+100,{size:36,color:HC}));}
 if(sum>0){const pts=[];for(let x=x0;x<=x1;x+=4){const ph=2*PI*(x-x0-60*t)/WL;pts.push([x,ys-A*(Math.sin(ph)+AR*Math.sin(ph+LAG))]);}
  s+=fade(sum,draw(pts,1,{color:GREEN,w:6})+wv(x0,x1,ys,WL,A,0,t,{color:LIGHT,w:2,opacity:.45})+plate('足し合わせた 光',x0,ys-A-34,{size:38,color:GREEN}));
  if(crest>0){const c0=crestX(x0+200,0,t),cs=c0-DELTA/(2*PI)*WL;
   s+=fade(crest,line(c0,ys-A*1.2,c0,ys+30,{color:LIGHT,w:3,dash:'8 8'})+line(cs,ys-A*AMP_SUM-10,cs,ys+30,{color:GREEN,w:4})+arrow(c0,ys+48,cs,ys+48,{color:HC,w:5,head:16})+plate('少し 後ろへ',cs-10,ys+96,{size:38,color:HC,anchor:'end'}));}}
 return s;
}
// 層ごとの積み重ね：上は空気（山の間隔そのまま）、下は水（層ごとに DELTA ずつ遅れる）
function layers(t,{g=1,speedCmp=0,labels=true}={}){
 let s='';const x0=60,x1=940,NL=8,lw=(x1-x0)/NL,A=46;
 // 水の層
 for(let k=0;k<NL;k++)s+=rect(x0+k*lw,560,lw-6,230,{fill:WATER,fo:.12+.04*(k%2),stroke:'none',rx:6});
 if(labels)s+=label('空気',x0,330,{size:38,color:C.dim,weight:700})+label('水',x0,600,{size:38,color:SURF,weight:700});
 // 空気の波
 s+=wv(x0,x1,420,WL,A,0,t,{color:LIGHT,w:4});
 // 水の波：層 k の中では位相が k*DELTA 遅れる（層の中でなめらかにつなぐ）
 const pts=[];for(let x=x0;x<=x1;x+=4){const lag=DELTA*(x-x0)/lw;pts.push([x,680-A*Math.sin(2*PI*(x-x0-60*t)/WL+lag)]);}
 s+=draw(pts,1,{color:GREEN,w:5});
 // 山の印：同じ時刻に出た山を、空気と水で並べる
 // 同じ時に入った山（同じ番号 m）を、空気と水で結ぶ。水の中の山は 1層ごとに DELTA ずつ遅れ、後ろに残る
 const kk=2*PI/WL+DELTA/lw;
 for(let m=-6;m<8;m++){const num=PI/2+2*PI*m+2*PI*60*t/WL;if(num<0)continue;const xa=x0+num/(2*PI/WL),xw=x0+num/kk;if(xa>x1)continue;
  s+=dot(xa,420-A,9,LIGHT)+dot(xw,680-A,9,GREEN)+fade(speedCmp,line(xa,420-A+14,xw,680-A-14,{color:HC,w:2,dash:'6 8'}));}
 if(labels)s+=note('ずれは 大きく 誇張',40,830);
 return fade(g,s);
}

// ================= 水蒸気と液体の水・押し縮めた空気 =================
function packBox(x,y,w,h,n,t,{g=1,seed=0}={}){let s=rect(x,y,w,h,{fill:'#101a30',fo:1,stroke:'#5f7398',sw:2,rx:12});
 for(let k=0;k<n;k++){const u=hash(k+seed),v=hash(k+seed+77);s+=molecule(x+22+u*(w-44)+4*Math.sin(t*2+k),y+22+v*(h-44)+4*Math.cos(t*2.2+k),.55,k);}return fade(g,s);}
function speedBar(y,label_,v,txt,g,col=WATER){return fade(g,label(label_,40,y+8,{size:38,color:C.ink,weight:700})+rect(300,y-30,560*v*seg(g,.1,.8),46,{fill:col,fo:.85,stroke:col,rx:6})+fade(seg(g,.6,1),label(txt,310+560*v,y+8,{size:38,color:col===LIGHT?LIGHT:SURF,weight:700})));}
// 水蒸気（まばら）と液体（ぎっしり）。速さの棒は 0.9997 と 0.75
function vaporLiquid(t,{gv=1,gl=0,bv=0,bl=0}={}){
 let s=packBox(60,300,400,330,6,t,{g:gv,seed:3})+fade(gv,label('水蒸気',260,680,{size:40,color:C.ink,anchor:'middle',weight:700}));
 s+=packBox(540,300,400,330,90,t,{g:gl,seed:9})+fade(gl,label('液体の 水',740,680,{size:40,color:C.ink,anchor:'middle',weight:700}));
 s+=speedBar(745,'水蒸気',.9997,'ほぼ 1',bv,LIGHT)+speedBar(810,'液体の 水',.75,'0.75',bl);
 return s;
}
// 押し縮めた空気：分子の数は同じで箱が狭くなる。棒は少しずつ短くなる（大きく誇張）
function pressAir(t,u,g=1){
 const w=mix(600,260,u),x=60;let s=rect(x,330,w,300,{fill:'#101a30',fo:1,stroke:'#5f7398',sw:3,rx:10})+rect(x+w,320,22,320,{fill:'#8aa0c4',fo:.9,stroke:'none',rx:4})+arrow(x+w+120,480,x+w+34,480,{color:HC,w:6,head:20});
 for(let k=0;k<14;k++)s+=dot(x+20+hash(k+5)*(w-40),350+hash(k+40)*260,9,'#c4cde0');
 s+=label('空気を 押し縮める',x,300,{size:38,color:C.ink,weight:700});
 const v=1-.25*u;s+=label('速さ',740,400,{size:36,color:C.dim})+rect(740,430,40,200,{fill:'none',fo:0,stroke:C.faint,sw:2,rx:4})+rect(740,630-200*v,40,200*v,{fill:LIGHT,fo:.85,stroke:LIGHT,rx:4});
 s+=label(u>.5?'少し 遅い':'',800,520,{size:36,color:LIGHT,weight:700});
 s+=note('棒の 変わり方は 大きく 誇張',40,700);
 return fade(g,s);
}
// ================= cue ごと =================
const D={};
// 1 事実①：ストロー、速さの棒
D[K+'fact:straw']=(p,ctx)=>strawScene({look:true})+fade(vseg(ctx,p,.5,.8),ring(600,400,40,{color:HC,w:5})+label('折れて 見える',656,360,{size:40,color:HC,weight:700}));
D[K+'fact:speed']=(p,ctx)=>{const a=vseg(ctx,p,.25,.6),b=vseg(ctx,p,.6,.9),m=vseg(ctx,p,1.05,1.3);
 let s=fade(1-m,rect(120,250,760,330,{fill:'#131f38',fo:.95,stroke:'#8aa0c4',sw:3,rx:22})+tag('事実',150,320,{size:40,text:'①',color:'#edf4ff'})
  +label('空気',150,420,{size:40,color:C.ink,weight:700})+rect(290,384,520*a,50,{fill:LIGHT,fo:.85,stroke:LIGHT,rx:6})+fade(a,label('1',820,422,{size:40,color:LIGHT,weight:700}))
  +label('水',150,520,{size:40,color:SURF,weight:700})+rect(290,484,520*.75*b,50,{fill:WATER,fo:.85,stroke:SURF,rx:6})+fade(b,label('0.75',700,522,{size:40,color:SURF,weight:700})));
 return s+fade(m,fact1Only());};
// 2 事実②：何もない空間
function space(t,{dotG=1,lbl=0}={}){
 let s='';for(let i=0;i<40;i++)s+=dot(hash(i)*W,40+hash(i+9)*760,1.8+hash(i+3)*1.5,'#c4cde0',.5);
 const x=60+((t*240)%880);s+=fade(dotG,line(60,430,x,430,{color:LIGHT,w:3,opacity:.35})+dot(x,430,12,LIGHT)+dot(x,430,22,LIGHT,.25));
 s+=fade(lbl,plate('いつも 30万 km/s',500,560,{size:52,color:LIGHT,anchor:'middle'})+plate('速くも 遅くも ならない',500,640,{size:40,color:C.ink,anchor:'middle'}));
 return s;
}
D[K+'space:one']=(p,ctx)=>space(cueT(p,ctx),{dotG:vseg(ctx,p,.2,.5)})+fade(vseg(ctx,p,.5,.8),tag('事実',500,260,{size:44,text:'②',color:'#edf4ff',anchor:'middle'}))+fact1Only();
function fact1Only(){const t1='① 水の中は 4分の3',w1=jw(t1)*36+36;return rect(20,852,w1,60,{fill:C.bg,fo:.92,stroke:'none',rx:30})+rect(20,852,w1,60,{fill:'#8aa0c4',fo:.1,stroke:'#8aa0c4',sw:2,rx:30})+label(t1,20+w1/2,895,{size:36,color:C.ink,anchor:'middle',weight:700});}
D[K+'space:c']=(p,ctx)=>{const m=vseg(ctx,p,1.02,1.25);
 return space(cueT(p,ctx)+3,{lbl:vseg(ctx,p,.15,.4)})+fade(1-m,tag('事実',500,260,{size:44,text:'②',color:'#edf4ff',anchor:'middle'}))+fade(1-m,fact1Only())+facts({g:m});};
// 3 水を拡大 → 分子
D[K+'zoom:water']=(p,ctx)=>{const t=cueT(p,ctx),z=vseg(ctx,p,.1,.5),c=[500,450];
 let s=rect(380,330,240,320,{fill:WATER,fo:.3,stroke:'#c9d6ea',sw:4,rx:10})+label('水',500,700,{size:40,color:SURF,anchor:'middle'});
 const R=40+300*z;let m='';for(let i=-4;i<=4;i++)for(let j=-4;j<=4;j++){const x=c[0]+i*92+(j%2)*46+8*Math.sin(t*2+i+j),y=c[1]+j*80+8*Math.cos(t*2.3+i*2);m+=molecule(x,y,1,(i*37+j*11)*DEG+t*.5);}
 s+=fade(z>0?1:0,`<clipPath id="d11z"><circle cx="${c[0]}" cy="${c[1]}" r="${R.toFixed(1)}"/></clipPath>`+dot(c[0],c[1],R,C.bg,.96)+`<g clip-path="url(#d11z)">${m}</g>`+ring(c[0],c[1],R,{color:'#c9d6ea',w:5}));
 s+=fade(vseg(ctx,p,.6,.85),plate('水の 分子の 集まり',500,820,{size:44,color:C.ink,anchor:'middle'}));
 return s+facts();};
// 4 原子：ほとんど何もない
D[K+'zoom:atom']=(p,ctx)=>{const t=cueT(p,ctx),z=vseg(ctx,p,0,.4);
 let s=fade(1-z,molecule(500,440,4,0));
 s+=fade(z,atom(500,440,330*z+10,t,{nuc:6}));
 s+=fade(vseg(ctx,p,.6,.85),plate('ほとんど 何もない',500,440,{size:48,color:HC,anchor:'middle'}));
 s+=fade(z,note('大きさの 比は 大きく 誇張',40,820));
 return s+facts();};
D[K+'zoom:nucleus']=(p,ctx)=>{const t=cueT(p,ctx)+3;
 let s=atom(500,440,340,t,{nuc:6});
 s+=fade(vseg(ctx,p,.05,.35),arrow(640,250,512,430,{color:ORANGE,w:4,head:16})+plate('原子核（とても 小さい）',560,220,{size:38,color:ORANGE}));
 s+=fade(vseg(ctx,p,.45,.8),plate('まわりに 電子',150,700,{size:38,color:ELEC}));
 s+=note('大きさの 比は 大きく 誇張',40,820);
 return s+facts();};
// 5 すき間を進む光
function atomsRow(t){let s='';for(let i=0;i<4;i++)for(let j=0;j<3;j++)s+=atom(150+i*240,240+j*200,90,t+i+j,{nuc:4,ne:2});return s;}
D[K+'gap:pass']=(p,ctx)=>{const t=cueT(p,ctx);let s=atomsRow(t);
 const x=40+((t*200)%920);s+=line(40,340,x,340,{color:LIGHT,w:3,opacity:.5})+dot(x,340,12,LIGHT);
 s+=fade(vseg(ctx,p,.5,.8),plate('ほとんど 何もない 所を 進む',500,760,{size:42,color:HC,anchor:'middle'}));
 return s+facts();};
D[K+'gap:c']=(p,ctx)=>{const t=cueT(p,ctx)+4;let s=atomsRow(t);
 const x=40+((t*200)%920);s+=line(40,340,x,340,{color:LIGHT,w:3,opacity:.5})+dot(x,340,12,LIGHT);
 s+=fade(vseg(ctx,p,.3,.6),plate('いつも 30万 km/s',500,760,{size:46,color:LIGHT,anchor:'middle'}));
 return s+facts({glow2:vseg(ctx,p,.2,.4)*(.6+.4*Math.sin(t*5))});};
// 6 ぶつかる
D[K+'clash:bolt']=(p,ctx)=>{const a=swin(ctx,p,1,0,.25),b=swin(ctx,p,1,.25,.5),c=swin(ctx,p,1,.5,.8);
 let s=fade(swin(ctx,p,0,.2,.6),label('光は どこで 遅くなる？',500,140,{size:46,color:C.ink,anchor:'middle',weight:700}));
 s+=factCard(230,'①','水の中は 4分の3',a,{glow:c})+factCard(560,'②','何もない所は いつも同じ',b,{glow:c});
 const bx=500,by=470;
 s+=fade(c,scaleAt(bx,by,1.3,poly([[bx+14,by-60],[bx-30,by+8],[bx,by+8],[bx-20,by+64],[bx+36,by-10],[bx+6,by-10],[bx+26,by-60]],{fill:ORANGE,fo:1,stroke:'none'}))+plate('ぶつかる',580,490,{size:44,color:ORANGE}));
 return s;};
// 7–12 仮説1
const BAND1=(f)=>logic([row(L1,0,f[0]),row(L1,1,f[1]),row(L1,2,f[2]),row(L1,3,f[3]),row(L1,4,f[4],RED_)],{act:f.act??-1});
const F=(...a)=>facts({bolt:1,...(a[0]||{})});
D[K+'h1:zig']=(p,ctx)=>BAND1(Object.assign([swin(ctx,p,1,.3,.7),0,0,0,0],{act:0}))+zigScene(swin(ctx,p,1,.1,.9))+F();
D[K+'h1:slow']=(p,ctx)=>BAND1(Object.assign([1,0,0,0,0],{act:0}))+zigScene(1,{straight:vseg(ctx,p,.1,.4)})+fade(vseg(ctx,p,.5,.8),plate('回り道 ＝ 時間が かかる',500,800,{size:42,color:HC,anchor:'middle'}))+F();
D[K+'h1:if']=(p,ctx)=>BAND1(Object.assign([1,0,0,0,0],{act:1}))+zigScene(1,{straight:1,dim:vseg(ctx,p,.2,.6)})+fade(vseg(ctx,p,.4,.8),plate('もし 正しいなら？',500,560,{size:48,color:HC,anchor:'middle'}))+F();
D[K+'h1:scatter']=(p,ctx)=>BAND1(Object.assign([1,swin(ctx,p,0,.4,.8),0,0,0],{act:1}))+scatterScene(cueT(p,ctx),1)+F();
D[K+'h1:cloudy']=(p,ctx)=>{const h=vseg(ctx,p,.5,.9);return BAND1(Object.assign([1,1,vseg(ctx,p,.6,.9),0,0],{act:2}))+view(100,300,800,480,{haze:h,id:'d11v1'})+fade(h,plate('白く にごる はず',500,560,{size:46,color:'#0b1122',anchor:'middle'}).replace('fill="#0b1122" fill-opacity=".8"','fill="#ffffff" fill-opacity=".8"'))+F();};
D[K+'h1:fog']=(p,ctx)=>BAND1(Object.assign([1,1,1,0,0],{act:2}))+view(100,300,800,480,{haze:1,id:'d11v2'})+fade(vseg(ctx,p,.1,.4),plate('霧の 中の 景色',120,350,{size:40,color:C.ink}))+F();
D[K+'h1:clear']=(p,ctx)=>{const a=swin(ctx,p,0,.3,.8),b=swin(ctx,p,1,.1,.6);
 return BAND1(Object.assign([1,1,1,a,0],{act:3}))+fade(1-b,view(100,300,800,480,{haze:1-a,id:'d11v3'}))+fade(b,poolFloor(100,300,800,480)+plate('くっきり',140,360,{size:42,color:'#ffffff'}))+tag('事実',880,820,{anchor:'end',size:40,g:a})+F();};
D[K+'h1:no']=(p,ctx)=>{const a=swin(ctx,p,0,.2,.6),b=swin(ctx,p,1,.1,.5);
 let s=BAND1(Object.assign([1,1,1,1,b],{act:4}))+scaleAt(500,560,.85,zigScene(1,{dim:.3}));
 s+=fade(a,plate('予言 ≠ 事実',500,560,{size:48,color:RED_,anchor:'middle'}));
 s+=fade(b,line(240,330,760,790,{color:RED_,w:14})+line(760,330,240,790,{color:RED_,w:14}));
 return s+F();};
// 13–16 仮説2
const BAND2=(f,j)=>logic([row(L2,0,f[0]),row(L2,1,f[1]),row(L2,2,f[2]),row(L2,3,f[3]),j??row(L2,4,f[4],HC)],{act:f.act??-1});
D[K+'h2:shake']=(p,ctx)=>BAND2(Object.assign([0,0,0,0,0],{act:0}))+shakeScene(cueT(p,ctx),{n:1})+fade(swin(ctx,p,1,.3,.7),plate('電子が 揺れる',540,460,{size:40,color:ELEC}))+F();
D[K+'h2:relay']=(p,ctx)=>{const t=cueT(p,ctx)+4;return BAND2(Object.assign([swin(ctx,p,1,.3,.7),0,0,0,0],{act:0}))+shakeScene(t,{n:3,rg:swin(ctx,p,0,.1,.5)})+fade(swin(ctx,p,0,.3,.7),plate('電子も 光を 出す',320,760,{size:40,color:LIGHT}))+F();};
D[K+'h2:antenna']=(p,ctx)=>BAND2(Object.assign([1,0,0,0,0],{act:0}))+antenna(cueT(p,ctx),1)+tag('事実',880,820,{anchor:'end',size:40,g:swin(ctx,p,1,.4,.8)})+F();
D[K+'h2:problem']=(p,ctx)=>BAND2(Object.assign([1,0,0,0,0],{act:1}))+shakeScene(cueT(p,ctx),{n:1})+fade(vseg(ctx,p,.3,.8),plate('もし 正しいなら？',500,760,{size:46,color:HC,anchor:'middle'}))+F();
D[K+'h2:rings']=(p,ctx)=>{const t=cueT(p,ctx)+2;return BAND2(Object.assign([1,vseg(ctx,p,.5,.85),0,0,0],{act:1}))+shakeScene(t,{n:1,rg:vseg(ctx,p,.2,.4),wave:.5})+fade(vseg(ctx,p,.4,.7),plate('あらゆる 向きへ',500,820,{size:42,color:LIGHT,anchor:'middle'}))+F();};
D[K+'h2:cloudy']=(p,ctx)=>{const h=vseg(ctx,p,.5,.9);return BAND2(Object.assign([1,1,vseg(ctx,p,.6,.9),0,0],{act:2}))+view(100,300,800,480,{haze:h,id:'d11v4'})+F();};
D[K+'h2:clash']=(p,ctx)=>{const a=swin(ctx,p,0,.2,.7),b=swin(ctx,p,1,.2,.6);
 return BAND2(Object.assign([1,1,1,a,b],{act:4}))+fade(1-a,view(100,300,800,480,{haze:1,id:'d11v5'}))+fade(a,poolFloor(100,300,800,480))+fade(b,plate('まだ ×に しない',500,560,{size:46,color:HC,anchor:'middle'}))+F({glow2:0});};
// 17–21 山場
D[K+'peak:many']=(p,ctx)=>{const t=tg(ctx,p),n=vseg(ctx,p,0,.5);
 let s=yamaba(swin(ctx,p,1,0,.4));
 s+=fade(1-n,elec(500,560,{r:14}));
 s+=grid(t,{g:n});
 s+=wv(40,960,250,160,30,0,t,{color:LIGHT,w:4,opacity:.7})+arrow(860,180,960,180,{color:LIGHT,w:4,head:16})+plate('光',60,200,{size:40,color:LIGHT});
 return s+F();};
D[K+'peak:fine']=(p,ctx)=>{const t=tg(ctx,p);
 let s=yamaba(1)+grid(t)+wv(40,960,250,160,30,0,t,{color:LIGHT,w:4,opacity:.7});
 const b=vseg(ctx,p,.2,.5),x0=200;s+=fade(b,line(x0,170,x0+160,170,{color:HC,w:4})+line(x0,158,x0,182,{color:HC,w:4})+line(x0+160,158,x0+160,182,{color:HC,w:4})+plate('波 一つの 長さ',x0+180,186,{size:38,color:HC}));
 const c=vseg(ctx,p,.6,.9);s+=fade(c,line(GX0,350,GX0+GS,350,{color:ELEC,w:4})+plate('電子の 間（ずっと 細かい）',GX0+GS+20,340,{size:38,color:ELEC}));
 s+=note('電子の 並びは 図に した もの',40,830);
 return s+F();};
D[K+'peak:side']=(p,ctx)=>{const t=tg(ctx,p),a=vseg(ctx,p,0,.2),c=vseg(ctx,p,.72,.95);
 let s=yamaba(1)+fade(1-.5*a,grid(t,{y0:650,y1:790}));
 s+=fade(a,arrow(500,650,500,590,{color:HC,w:5,head:18})+plate('横の 向き',520,632,{size:38,color:HC}));
 s+=fade(a,plate('横へ 出た 光（電子ごとに 山と 谷が ずれる）',40,130,{size:36,color:C.ink}));
 s+=sumRows(220,190,PH_SIDE,t,{rowG:[0,1,2,3].map(i=>vseg(ctx,p,.2+.1*i,.32+.1*i)),sumG:c,sumY:470,sumText:'0（打ち消し合う）'});
 return s+F();};
D[K+'peak:frontq']=(p,ctx)=>{const t=tg(ctx,p);
 return yamaba(1)+grid(t,{y0:600,y1:790})+fade(vseg(ctx,p,0,.4),arrow(GX1-120,560,GX1+40,560,{color:HC,w:6,head:22})+plate('前の 向き',GX1-330,570,{size:42,color:HC}))+F();};
D[K+'peak:front']=(p,ctx)=>{const t=tg(ctx,p),lit=GX0+(GX1-GX0)*swin(ctx,p,0,.05,.9),b=vseg(ctx,p,.45,.75),c=vseg(ctx,p,.75,.95);
 let s=yamaba(1)+grid(t,{y0:640,y1:790,lit});
 s+=arrow(GX1-120,600,GX1+40,600,{color:HC,w:6,head:22})+fade(swin(ctx,p,0,0,.4),plate('揺さぶられた 順に 光を 出す',40,612,{size:36,color:HC}));
 s+=fade(b,plate('前へ 出た 光（山が そろう）',40,130,{size:36,color:C.ink}));
 s+=sumRows(220,180,PH_FRONT,t,{rowG:[0,1,2,3].map(i=>seg(b,.1+.2*i,.3+.2*i)),sumG:c,A:14,rowH:40,sumY:440,sumText:'大きく 残る'});
 return s+F();};
D[K+'peak:clear']=(p,ctx)=>{const t=tg(ctx,p),j=vseg(ctx,p,.3,.6);
 let s=BAND2(Object.assign([1,1,1,1,0],{act:4}),[j>.5?'○ 透き通る ことは 説明できる':'？',1,j>.5?GREEN:HC])+grid(t,{y0:420,y1:700});
 s+=arrow(GX1-100,380,GX1+60,380,{color:HC,w:8,head:26})+plate('前は 残る',GX1-320,370,{size:40,color:HC});
 s+=fade(vseg(ctx,p,0,.3),[[300,740],[600,740]].map(([x,y])=>arrow(x,y-30,x,y+50,{color:C.dim,w:4,head:14})+line(x-24,y-4,x+24,y+40,{color:RED_,w:5})+line(x+24,y-4,x-24,y+40,{color:RED_,w:5})).join('')+plate('横は 消える',380,810,{size:38,color:C.dim}));
 return s+F();};
D[K+'fog:drops']=(p,ctx)=>{const t=cueT(p,ctx);
 let s=fog(t);
 const b=vseg(ctx,p,.3,.6);s+=fade(b,line(80,250,160,250,{color:HC,w:4})+line(80,238,80,262,{color:HC,w:4})+line(160,238,160,262,{color:HC,w:4})+plate('光の 波の 長さ（くらべる ため 大きく 描いた）',180,265,{size:36,color:HC}));
 s+=fade(vseg(ctx,p,.1,.4),plate('霧の 水の粒：大きく、ばらばら',60,130,{size:40,color:C.ink}));
 s+=note('粒は 本当は 波の 長さの 数倍〜百倍',40,830);
 return s+F();};
D[K+'fog:scatter']=(p,ctx)=>{const t=cueT(p,ctx)+3;
 let s=fog(t,{sc:vseg(ctx,p,0,.3)})+fade(vseg(ctx,p,.3,.6),plate('横の 光が 残って 散らばる',60,130,{size:40,color:LIGHT}));
 s+=fade(vseg(ctx,p,.5,.9),view(600,500,300,250,{haze:1,id:'d11v6'})+plate('白く かすむ',620,550,{size:36,color:'#0b1122'}).replace('fill="#0b1122" fill-opacity=".8"','fill="#ffffff" fill-opacity=".8"'));
 return s+F();};
// 22–26 遅くなるしくみ
D[K+'lag:yet']=(p,ctx)=>{const t=cueT(p,ctx),a=swin(ctx,p,1,.2,.7);
 let s=BAND2(Object.assign([1,1,1,1,0],{act:4}),[a>.5?'○ 透き通る・遅くなる 理由は まだ':'○ 透き通る ことは 説明できる',1,a>.5?HC:GREEN]);
 s+=grid(t,{y0:560,y1:790})+arrow(GX1-100,500,GX1+60,500,{color:HC,w:8,head:26})+plate('前に 残った 光',60,470,{size:42,color:LIGHT});
 s+=fade(a,plate('なぜ 遅くなる？',500,350,{size:48,color:HC,anchor:'middle'}));
 return s+F();};
D[K+'lag:two']=(p,ctx)=>{const t=tg(ctx,p);return lagPanel(t,{orig:1,re:vseg(ctx,p,.3,.6),yo:300,yr:520})+F();};
D[K+'lag:behind']=(p,ctx)=>{const t=tg(ctx,p);return lagPanel(t,{orig:1,re:1,showLag:vseg(ctx,p,.5,.85),yo:300,yr:520})+note('ずれは 大きく 誇張',40,830)+F();};
D[K+'lag:calc']=(p,ctx)=>{const t=tg(ctx,p);return lagPanel(t,{orig:1,re:1,showLag:1,yo:300,yr:520})+tag('計算の 結果',60,760,{size:40,color:GREEN,g:vseg(ctx,p,.3,.7)})+note('ずれは 大きく 誇張',40,830)+F();};
D[K+'lag:sum']=(p,ctx)=>{const t=tg(ctx,p);return lagPanel(t,{orig:1,re:1,sum:vseg(ctx,p,.2,.5),crest:vseg(ctx,p,.55,.85),yo:200,yr:390,ys:640})+note('ずれは 大きく 誇張',40,830)+F();};
D[K+'layer:stack']=(p,ctx)=>layers(tg(ctx,p),{g:1})+fade(vseg(ctx,p,.3,.7),plate('一層 ごとに 少し 後ろへ',60,130,{size:42,color:HC}))+F();
D[K+'layer:slow']=(p,ctx)=>layers(tg(ctx,p),{g:1,speedCmp:1})+fade(vseg(ctx,p,.3,.7),plate('山の 進み方が 遅い',60,130,{size:44,color:GREEN}))+F();
D[K+'solve:one']=(p,ctx)=>{const t=cueT(p,ctx);
 return space(t,{dotG:1})+fade(vseg(ctx,p,.3,.7),plate('一つ 一つの 光：いつも 30万 km/s',500,560,{size:40,color:LIGHT,anchor:'middle'}))+facts({bolt:1,glow2:vseg(ctx,p,.5,.8)});};
D[K+'solve:both']=(p,ctx)=>{const t=cueT(p,ctx),b=vseg(ctx,p,0,.3),c=vseg(ctx,p,.75,1);
 let s=fade(b,scaleAt(500,200,.62,layers(t+20,{labels:false}))+note('ずれは 大きく 誇張',40,610))+fade(vseg(ctx,p,.3,.6),plate('遅いのは 山の 並び',500,690,{size:46,color:GREEN,anchor:'middle'}));
 s+=fade(c,rect(150,735,700,90,{fill:C.bg,fo:.95,stroke:GREEN,sw:4,rx:20})+label('どちらも 正しかった',500,800,{size:52,color:GREEN,anchor:'middle',weight:700}));
 return s+facts({bolt:1-c,glow1:c,glow2:c,ok:c});};
// 27–29 確かめる
const BAND3=(f)=>logic([row(L3,0,f[0]),row(L3,1,f[1]),row(L3,2,f[2]),row(L3,3,f[3]),row(L3,4,f[4],GREEN)],{act:f.act??-1});
const G0=()=>facts({glow1:1,glow2:1,ok:1});
function density(g){let s='';[['まばら',8],['ぎっしり',40]].forEach(([t,n],i)=>{const x=150+i*400;s+=rect(x,360,300,300,{fill:'#101a30',fo:1,stroke:'#5f7398',sw:2,rx:12});for(let k=0;k<n;k++)s+=elec(x+20+hash(k+i*90)*260,380+hash(k+i*90+5)*260,{r:6});s+=label(`同じ物が ${t}`,x+150,720,{size:40,color:C.ink,anchor:'middle',weight:700});});
 s+=arrow(470,510,530,510,{color:HC,w:5,head:18})+plate('もっと 遅い',560,800,{size:42,color:HC});return fade(g,s);}
D[K+'h3:if']=(p,ctx)=>BAND3(Object.assign([vseg(ctx,p,0,.3),vseg(ctx,p,.3,.6),0,0,0],{act:1}))+fade(vseg(ctx,p,.5,.9),plate('もし 正しいなら？',500,560,{size:48,color:HC,anchor:'middle'}))+G0();
D[K+'h3:pred']=(p,ctx)=>BAND3(Object.assign([1,1,vseg(ctx,p,.6,.9),0,0],{act:2}))+density(vseg(ctx,p,0,.5))+G0();
D[K+'h3:vapor']=(p,ctx)=>{const t=cueT(p,ctx);return BAND3(Object.assign([1,1,1,0,0],{act:3}))+vaporLiquid(t,{gv:swin(ctx,p,1,0,.4),bv:swin(ctx,p,1,.6,1)})+G0();};
D[K+'h3:pct']=(p,ctx)=>{const t=cueT(p,ctx)+4;return BAND3(Object.assign([1,1,1,0,0],{act:3}))+vaporLiquid(t,{gv:1,bv:1})+fade(vseg(ctx,p,.2,.6),plate('遅くなるのは 約0.03%',520,470,{size:38,color:LIGHT}))+G0();};
D[K+'h3:liquid']=(p,ctx)=>{const t=cueT(p,ctx)+6;return BAND3(Object.assign([1,1,1,vseg(ctx,p,.8,1),0],{act:3}))+vaporLiquid(t,{gv:1,bv:1,gl:vseg(ctx,p,.1,.5),bl:vseg(ctx,p,.6,.9)})+G0();};
D[K+'h3:press']=(p,ctx)=>BAND3(Object.assign([1,1,1,1,0],{act:3}))+pressAir(cueT(p,ctx),vseg(ctx,p,.2,.9))+G0();
D[K+'h3:ok']=(p,ctx)=>{const t=cueT(p,ctx)+8;return BAND3(Object.assign([1,1,1,1,swin(ctx,p,0,.1,.6)],{act:4}))+vaporLiquid(t,{gv:1,gl:1,bv:1,bl:1})+fade(swin(ctx,p,1,.1,.6),rect(200,400,600,110,{fill:C.bg,fo:.95,stroke:GREEN,sw:4,rx:20})+label('ぶつかりは 解けた',500,475,{size:48,color:GREEN,anchor:'middle',weight:700}))+G0();};
// 30–31 次へ
function prism(t,g){
 const P=[[500,300],[340,600],[660,600]];let s=poly(P,{fill:'#cfe2ff',fo:.15,stroke:'#cfe2ff',sw:4});
 s+=line(40,520,420,470,{color:'#ffffff',w:7});
 const cols=['#ff4b3e','#ff9a3c','#ffe25a','#5ee07a','#3f8cff','#a274ff'];cols.forEach((c,i)=>{s+=line(560,480,960,430+i*36,{color:c,w:6});});
 s+=plate('赤',890,420,{size:38,color:RED})+plate('紫',890,660,{size:38,color:VIO});
 return fade(g,s);
}
D[K+'next:prism']=(p,ctx)=>prism(cueT(p,ctx),1)+fade(vseg(ctx,p,.4,.8),plate('紫は 少し 多く 遅くなる',500,780,{size:44,color:VIO,anchor:'middle'}));
function twoElectrons(t,{q=0}={}){
 let s='';
 [[RED,'赤い 光',260,1],[VIO,'紫の 光',740,1.75]].forEach(([c,n,x,f])=>{
  s+=wv(x-220,x+220,300,f===1?180:103,40,0,t*f,{color:c,w:5,speed:60});
  const y=560+40*Math.sin(t*3*f);s+=line(x,480,x,640,{color:C.faint,w:2})+elec(x,y,{r:16})+label(n,x,780,{size:42,color:c,anchor:'middle',weight:700});});
 s+=bigQ(500,620,q,160);
 return s;
}
D[K+'next:shake']=(p,ctx)=>twoElectrons(cueT(p,ctx),{q:0})+fade(vseg(ctx,p,.5,.9),plate('揺さぶられ方が 違う',500,180,{size:44,color:C.ink,anchor:'middle'}));
D[K+'next:q']=(p,ctx)=>twoElectrons(cueT(p,ctx)+4,{q:swin(ctx,p,0,.3,.8)})+fade(swin(ctx,p,1,.1,.6),plate('次は ここを 掘る',500,180,{size:44,color:HC,anchor:'middle'}));

export const deep11Diagrams=D;

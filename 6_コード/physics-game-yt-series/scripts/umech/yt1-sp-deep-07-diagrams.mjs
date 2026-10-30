// 深掘りショート 07（ys-deep-07）第3版「0.07秒の一瞬を、どうやって測る？」— 図。縦長の舞台 1000×920（vert-v1）。
// 共通の形は yt1-sp-deep-common.mjs。値の検算は台本 docs/video-revision-20260924/ytseries/sp-deep-07.mjs の冒頭。
// この回で作った形（他の回の図ファイルには頼らない）：衛星 sat・スマホ phone・地面の弧 earthArc・電波の粒 pulse・時計 clockFace・
//   懐中時計 pocketWatch・帆船 ship・岩場 rocks・霧 fog・地図 cityMap・人影 figure、
//   第3版：難所の札 nanjo・予想のカード predCards・カウントダウン countdown・0と1の模様 chipStrip／flipWave（m 系列）・
//   北極の上から見た地球 topEarth・星の輪 starRing・見上げた夜空の帯 skyStrip・北極星と三人 polarisScene・正午の図 noonScene。
import {C,seg,clamp,mix,fade,label,line,rect,dot,ring,draw,arrow,poly,scaleAt} from './anim.mjs';
import {W,H,HC,LIGHT,cueT,voiceEnd,vseg,swin,tag,note,plate,bigQ,finalCard} from './yt1-sp-deep-common.mjs';

const K='deep07-',DEG=Math.PI/180;
const TIME=C.t;                 // 時刻・時計の色（金）
const BLUE='#3f8cff';           // 地図の青い点
const PANEL='#2d5fb8',BODY='#c9d6ea',GOLD='#e8b84a',WOOD='#7a5232',SAIL='#e8dcc0',SEA='#12305a',ROCK='#3a4152';
const n1=v=>Number(v.toFixed(1));
const tv=(ctx,p)=>cueT(p,ctx)/voiceEnd(ctx);
const rot=(deg,x,y,svg)=>`<g transform="rotate(${n1(deg)} ${n1(x)} ${n1(y)})">${svg}</g>`;

// ================= 形 =================
// 衛星（太陽電池の板2枚＋本体）。clock：本体に時計の印
export function sat(x,y,{s=1,g=1,clock=0,glow=0}={}){
 let o='';
 if(glow>0)o+=fade(glow,dot(x,y,95*s,HC,.18)+ring(x,y,95*s,{color:HC,w:4}));
 for(const sg of [-1,1]){const x0=sg<0?x-150*s:x+45*s;
  o+=line(x+sg*30*s,y,x+sg*45*s,y,{color:BODY,w:5*s});
  o+=rect(x0,y-24*s,105*s,48*s,{fill:PANEL,fo:1,stroke:'#7fb2ff',sw:3,rx:3});
  for(let k=1;k<4;k++)o+=line(x0+k*26*s,y-24*s,x0+k*26*s,y+24*s,{color:'#7fb2ff',w:1.5});}
 o+=rect(x-30*s,y-40*s,60*s,80*s,{fill:BODY,fo:1,stroke:'#edf4ff',sw:3,rx:6});
 o+=line(x,y+40*s,x,y+58*s,{color:BODY,w:4})+`<ellipse cx="${n1(x)}" cy="${n1(y+62*s)}" rx="${n1(20*s)}" ry="${n1(7*s)}" fill="${BODY}"/>`;
 if(clock>0)o+=fade(clock,clockFace(x,y,22*s,{h:2,m:0,face:'#0b1122',color:TIME,w:3,ticks:false}));
 return fade(g,o);
}
// スマホ（地図と青い点）
export function phone(x,y,{s=1,g=1,dotG=1}={}){
 let o=rect(x-55*s,y-100*s,110*s,200*s,{fill:'#1b2540',fo:1,stroke:BODY,sw:4,rx:16*s});
 o+=rect(x-45*s,y-84*s,90*s,160*s,{fill:'#20385e',fo:1,stroke:'none',rx:6});
 o+=line(x-45*s,y-30*s,x+45*s,y-10*s,{color:'#3a5a8a',w:5*s})+line(x-10*s,y-84*s,x+5*s,y+76*s,{color:'#3a5a8a',w:5*s});
 o+=fade(dotG,dot(x,y-4*s,11*s,'#ffffff')+dot(x,y-4*s,8*s,BLUE));
 return fade(g,o);
}
// 地面（大きな地球の上の端）
export const earthArc=(top=760)=>dot(500,top+1500,1500,'#1d4a8f')+`<ellipse cx="300" cy="${top+70}" rx="220" ry="40" fill="#2f7d55" fill-opacity=".8"/>`+`<ellipse cx="760" cy="${top+110}" rx="180" ry="45" fill="#2f7d55" fill-opacity=".8"/>`+ring(500,top+1500,1500,{color:'#7fb2ff',w:4});
// 電波の粒（A→B の割合 u の所）
export function pulse(A,B,u,{color=LIGHT}={}){
 const x=mix(A[0],B[0],u),y=mix(A[1],B[1],u);
 return ring(x,y,30,{color,w:3})+ring(x,y,18,{color,w:4})+dot(x,y,9,color);
}
// 時計の文字盤。h・m は時刻（時・分）、sec（秒針の角度、度）
export function clockFace(x,y,r,{h=null,m=0,sec=null,face='#131f38',color=C.ink,w=5,ticks=true,ghostSec=null,secColor=TIME}={}){
 let o=dot(x,y,r,face)+ring(x,y,r,{color,w});
 if(ticks)for(let k=0;k<12;k++){const a=k*30*DEG;o+=line(x+Math.sin(a)*r*.82,y-Math.cos(a)*r*.82,x+Math.sin(a)*r*.94,y-Math.cos(a)*r*.94,{color,w:k%3?2:4});}
 const hand=(deg,L,ww,col,dash='')=>line(x,y,x+Math.sin(deg*DEG)*L,y-Math.cos(deg*DEG)*L,{color:col,w:ww,dash});
 if(h!==null){o+=hand((h%12)*30+m*.5,r*.5,Math.max(3,w*1.2),color)+hand(m*6,r*.75,Math.max(2,w*.8),color);}
 if(ghostSec!==null)o+=hand(ghostSec,r*.85,4,C.dim,'10 8');
 if(sec!==null)o+=hand(sec,r*.85,4,secColor);
 return o+dot(x,y,Math.max(3,r*.06),color);
}
// 懐中時計（金の縁・竜頭・鎖）
export function pocketWatch(x,y,r,{g=1,h=3,m=0,chain=true}={}){
 let o='';
 if(chain)o+=draw([[x,y-r-34],[x-r*.6,y-r-70],[x-r*1.2,y-r-40],[x-r*1.5,y-r+10]],1,{color:GOLD,w:4,dash:'3 9'});
 o+=ring(x,y-r-26,14,{color:GOLD,w:5})+rect(x-10,y-r-14,20,18,{fill:GOLD,fo:1,stroke:GOLD,rx:3});
 o+=dot(x,y,r+10,GOLD)+clockFace(x,y,r,{h,m,face:'#f4ecd8',color:'#2a2a2a',w:4});
 return fade(g,o);
}
// 帆船（tilt：傾き 度）
export function ship(x,y,{s=1,g=1,tilt=0,dim=1}={}){
 let o=poly([[x-150*s,y-30*s],[x+165*s,y-30*s],[x+120*s,y+28*s],[x-120*s,y+28*s]],{fill:WOOD,fo:1,stroke:'#a0764e',sw:3});
 for(const [mx,hh,ww] of [[-70,190,95],[25,230,110],[110,160,80]]){
  o+=line(x+mx*s,y-30*s,x+mx*s,y-(30+hh)*s,{color:'#a0764e',w:5});
  o+=poly([[x+(mx-ww/2)*s,y-(30+hh*.9)*s],[x+(mx+ww/2)*s,y-(30+hh*.9)*s],[x+(mx+ww/2-6)*s,y-(30+hh*.5)*s],[x+(mx-ww/2+6)*s,y-(30+hh*.5)*s]],{fill:SAIL,fo:.92*dim,stroke:'none'});
  o+=poly([[x+(mx-ww/2+6)*s,y-(30+hh*.45)*s],[x+(mx+ww/2-6)*s,y-(30+hh*.45)*s],[x+(mx+ww/2-12)*s,y-(30+hh*.1)*s],[x+(mx-ww/2+12)*s,y-(30+hh*.1)*s]],{fill:SAIL,fo:.92*dim,stroke:'none'});}
 return fade(g,rot(tilt,x,y,o));
}
function seaBg(top=600,t=0,{color=SEA}={}){
 let o=rect(0,top,W,H-top,{fill:color,fo:1,stroke:'none',rx:0})+line(0,top,W,top,{color:'#3f6fa8',w:3});
 for(let k=0;k<5;k++){const yy=top+40+k*55,ph=(t*40+k*90)%160;
  for(let x=-160+ph;x<W;x+=160)o+=draw([[x,yy],[x+30,yy-8],[x+60,yy]],1,{color:'#3f6fa8',w:3,opacity:.6});}
 return o;
}
function rocks(g=1){
 return fade(g,poly([[610,612],[660,540],[700,560],[735,500],[790,545],[830,520],[880,612]],{fill:ROCK,fo:1,stroke:'#6b7489',sw:3})+poly([[520,612],[545,585],[575,600],[590,612]],{fill:ROCK,fo:1,stroke:'#6b7489',sw:3}));
}
function fog(t,g=1){
 let o='';
 [[150,330,380,60],[620,260,420,70],[380,470,520,55],[820,430,300,50],[100,560,360,40]].forEach(([x,y,rx,ry],k)=>{const xx=x+Math.sin(t*.25+k)*40;o+=`<ellipse cx="${n1(xx)}" cy="${y}" rx="${rx}" ry="${ry}" fill="#c9d6ea" fill-opacity="${n1(.13+.03*(k%2))}"/>`;});
 return fade(g,o);
}
const stars=(g=1)=>fade(g,[[80,80],[230,140],[400,60],[560,120],[700,70],[860,150],[930,60],[320,220],[620,230]].map(([x,y],k)=>dot(x,y,k%3?2.5:4,'#edf4ff',.8)).join(''));
// 地図（道と川）
function cityMap(y0=230,y1=820,g=1){
 let o=rect(20,y0,960,y1-y0,{fill:'#13213a',fo:1,stroke:'#2a3d60',sw:3,rx:14});
 o+=draw([[20,y0+120],[300,y0+170],[620,y0+110],[980,y0+180]],1,{color:'#1e4a80',w:30});
 for(const x of [130,330,530,730,900])o+=line(x,y0+4,x+(x%3)*6,y1-4,{color:'#2a3d60',w:12});
 for(const y of [y0+260,y0+420,y1-40])o+=line(24,y,976,y-12,{color:'#2a3d60',w:12});
 return fade(g,o);
}
function blueDot(x,y,{g=1,ghost=false}={}){
 if(ghost)return fade(g,ring(x,y,22,{color:BLUE,w:4,dash:'7 6'}));
 return fade(g,dot(x,y,34,BLUE,.22)+dot(x,y,19,'#ffffff')+dot(x,y,14,BLUE));
}
// 地球儀（正面）
function globe(cx,cy,r,{lat=0,lon=0,latCol=C.dim,lonCol=C.dim}={}){
 let o=dot(cx,cy,r,'#1d4a8f')+`<path d="M${cx-r*.5} ${cy-r*.45} q${r*.35} ${-r*.3} ${r*.6} ${-r*.02} q${r*.05} ${r*.35} ${-r*.2} ${r*.55} q${-r*.32} ${r*.05} ${-r*.4} ${-r*.53}Z" fill="#2f7d55"/>`+`<path d="M${cx+r*.15} ${cy+r*.12} q${r*.42} ${-r*.18} ${r*.55} ${r*.2} q${-r*.05} ${r*.38} ${-r*.3} ${r*.45} q${-r*.3} ${-r*.2} ${-r*.25} ${-r*.65}Z" fill="#2f7d55"/>`;
 for(const ph of [-60,-30,0,30,60]){const yy=cy-r*Math.sin(ph*DEG),rx=r*Math.cos(ph*DEG);o+=`<ellipse cx="${cx}" cy="${n1(yy)}" rx="${n1(rx)}" ry="${n1(rx*.16)}" fill="none" stroke="${lat>0?latCol:C.dim}" stroke-width="${lat>0?4:2}" stroke-opacity="${n1(.45+.55*lat)}"/>`;}
 for(const la of [15,45,75]){const rx=r*Math.sin(la*DEG);o+=`<ellipse cx="${cx}" cy="${cy}" rx="${n1(rx)}" ry="${r}" fill="none" stroke="${lon>0?lonCol:C.dim}" stroke-width="${lon>0?4:2}" stroke-opacity="${n1(.45+.55*lon)}"/>`;}
 return o+ring(cx,cy,r,{color:'#7fb2ff',w:4});
}
// 人影（顔は描かない）
function figure(x,y,{s=1,color='#5d6f92'}={}){
 return dot(x,y-150*s,34*s,color)+`<path d="M${x-60*s} ${y} q0 ${-95*s} ${60*s} ${-102*s} q${60*s} ${7*s} ${60*s} ${102*s}Z" fill="${color}"/>`;
}
const bigX=(x,y,r,g=1)=>fade(g,line(x-r,y-r,x+r,y+r,{color:C.a,w:14})+line(x+r,y-r,x-r,y+r,{color:C.a,w:14}));
const card=(x,y,w,h,{stroke=C.faint,g=1,fill='#131f38'}={})=>fade(g,rect(x,y,w,h,{fill,fo:.95,stroke,sw:3,rx:16}));

// ================= 疑問：衛星→スマホ =================
const SAT1=[760,170],PH1=[300,660],SAT1B=[SAT1[0]-40,SAT1[1]+60],PH1T=[PH1[0]+20,PH1[1]-110];
function skyScene({wave=1,lab=1,time=0}={}){
 let o=earthArc(760)+sat(SAT1[0],SAT1[1])+phone(PH1[0],PH1[1]);
 o+=label('衛星',SAT1[0],SAT1[1]+120,{size:38,color:BODY,anchor:'middle',weight:700})+label('スマホ',PH1[0]+80,PH1[1]+40,{size:38,color:BODY,weight:700});
 o+=draw([SAT1B,PH1T],wave,{color:LIGHT,w:4,dash:'14 10'});
 if(wave>0&&wave<1)o+=pulse(SAT1B,PH1T,wave);
 o+=fade(lab,plate('約2万 km',560,330,{size:38,color:C.dim}));
 o+=fade(time,plate('0.07 秒',170,420,{size:60,color:TIME}));
 return o;
}

// ================= 地図：300 m のずれ =================
const MT=[300,560],MS=[600,560]; // 本当の場所と、ずれた場所（300 m ＝ 300 px）
function rulerTop(g,u=1){
 let o=label('100万分の1秒',40,92,{size:40,color:TIME,weight:700});
 o+=line(MT[0],128,MT[0],168,{color:LIGHT,w:4})+line(MS[0],128,MS[0],168,{color:LIGHT,w:4,opacity:u>.98?1:.4});
 o+=line(MT[0],148,mix(MT[0],MS[0],u),148,{color:LIGHT,w:8});
 if(u>0&&u<1)o+=pulse([MT[0],148],[MS[0],148],u);
 o+=fade(seg(u,.85,1),label('300 m',MS[0]+20,162,{size:44,color:LIGHT,weight:700}));
 return fade(g,o);
}

// ================= 経度：上から見た地球 =================
const NE=[400,470],NR=220,SUN=[880,300];
function noonEarth(theta,{port=1,shipP=1,flash=[0,0]}={}){
 let o=dot(SUN[0],SUN[1],70,'#ffcf67')+ring(SUN[0],SUN[1],92,{color:'#ffcf67',w:3,dash:'6 10'})+label('太陽',SUN[0],SUN[1]+140,{size:38,color:'#ffcf67',anchor:'middle',weight:700});
 o+=dot(NE[0],NE[1],NR,'#1d4a8f');
 for(let k=0;k<12;k++){const a=theta+k*30*DEG;o+=line(NE[0],NE[1],NE[0]+NR*Math.cos(a),NE[1]-NR*Math.sin(a),{color:'#3f6fa8',w:2});}
 // 夜の側（太陽と反対の半分）を暗く
 const sunA=Math.atan2(-(SUN[1]-NE[1]),SUN[0]-NE[0]);
 const nA=sunA+Math.PI/2;
 o+=`<path d="M${n1(NE[0]+NR*Math.cos(nA))} ${n1(NE[1]-NR*Math.sin(nA))} A${NR} ${NR} 0 0 0 ${n1(NE[0]-NR*Math.cos(nA))} ${n1(NE[1]+NR*Math.sin(nA))} Z" fill="#05080f" fill-opacity=".65"/>`;
 o+=ring(NE[0],NE[1],NR,{color:'#7fb2ff',w:4})+dot(NE[0],NE[1],8,C.ink)+label('北極',NE[0]+14,NE[1]+44,{size:36,color:C.dim});
 const place=(a,name,col,fl)=>{const x=NE[0]+NR*Math.cos(a),y=NE[1]-NR*Math.sin(a),lx=NE[0]+(NR+70)*Math.cos(a),ly=NE[1]-(NR+70)*Math.sin(a);
  return fade(fl,dot(x,y,30,HC,.3))+dot(x,y,14,col)+label(name,lx,ly+14,{size:38,color:col,anchor:'middle',weight:700});};
 if(port>0)o+=fade(port,place(theta+20*DEG,'港',HC,flash[0]));
 if(shipP>0)o+=fade(shipP,place(theta-25*DEG,'船',C.x,flash[1]));
 return o;
}
const portA=th=>th+20*DEG,shipA=th=>th-25*DEG;
const sunA0=Math.atan2(-(SUN[1]-NE[1]),SUN[0]-NE[0]);

// ================= GPS：時刻の札 =================
const SAT2=[740,170],PH2=[260,660],SAT2B=[SAT2[0]-40,SAT2[1]+60],PH2T=[PH2[0]+30,PH2[1]-110];
const stampTag=(x,y,g=1)=>fade(g,rect(x-150,y-34,300,60,{fill:'#2a2410',fo:.95,stroke:TIME,sw:3,rx:12})+label('12:00:00.000',x,y+8,{size:38,color:TIME,anchor:'middle',weight:700}));

// ================= 18：3つの円（時計のずれ d で、半径が全部 d だけ大きい） =================
const FA=[150,210],FB=[850,250],FC=[250,800],FP=[510,480];
const FCOL=[C.x,C.v,C.F],FCEN=[FA,FB,FC],FR=FCEN.map(c=>Math.hypot(c[0]-FP[0],c[1]-FP[1])); // 約436・423・417
const D0=80,FROT=[-35*DEG,35*DEG,-35*DEG]; // 増えた分の印は P から 35° はずした向きに描く（答えの点を先に示さない）
function cc(c1,r1,c2,r2){ // 2つの円の交点（P に近い方）
 const dx=c2[0]-c1[0],dy=c2[1]-c1[1],d=Math.hypot(dx,dy),a=(r1*r1-r2*r2+d*d)/(2*d),h=Math.sqrt(Math.max(0,r1*r1-a*a));
 const mx=c1[0]+a*dx/d,my=c1[1]+a*dy/d,p1=[mx+h*dy/d,my-h*dx/d],p2=[mx-h*dy/d,my+h*dx/d];
 return Math.hypot(p1[0]-FP[0],p1[1]-FP[1])<Math.hypot(p2[0]-FP[0],p2[1]-FP[1])?p1:p2;
}
function circleArc(c,r,g,col){const pts=[];for(let k=0;k<=120;k++){const a=-Math.PI/2+2*Math.PI*k/120;pts.push([c[0]+r*Math.cos(a),c[1]+r*Math.sin(a)]);}return draw(pts,g,{color:col,w:5});}
function fixScene(d,{circ=1,cross=0,arrows=0,meet=0,slider=1,knobG=1}={}){
 let o=`<clipPath id="d07fx"><rect width="${W}" height="${H}"/></clipPath><g clip-path="url(#d07fx)">`;
 FCEN.forEach((c,i)=>{o+=circleArc(c,FR[i]+d,circ,FCOL[i]);});
 o+='</g>';
 FCEN.forEach((c,i)=>{o+=sat(c[0],c[1],{s:.55});});
 // 半径の増えた分（同じ長さ d）を、各円の P に向かう線の上に示す
 if(arrows>0&&d>2)FCEN.forEach((c,i)=>{const a0=Math.atan2(FP[1]-c[1],FP[0]-c[0])+FROT[i],ux=Math.cos(a0),uy=Math.sin(a0),a=[c[0]+ux*FR[i],c[1]+uy*FR[i]],b=[c[0]+ux*(FR[i]+d),c[1]+uy*(FR[i]+d)];
  o+=fade(arrows,line(a[0],a[1],b[0],b[1],{color:HC,w:9})+line(a[0]-uy*14,a[1]+ux*14,a[0]+uy*14,a[1]-ux*14,{color:HC,w:4}));});
 if(cross>0&&d>1.5){const ps=[cc(FA,FR[0]+d,FB,FR[1]+d),cc(FB,FR[1]+d,FC,FR[2]+d),cc(FA,FR[0]+d,FC,FR[2]+d)];
  o+=fade(cross,ps.map(q=>dot(q[0],q[1],11,'#ffffff')+ring(q[0],q[1],18,{color:'#ffffff',w:2})).join(''));}
 o+=fade(meet,dot(FP[0],FP[1],40,HC,.25)+ring(FP[0],FP[1],34,{color:HC,w:6})+dot(FP[0],FP[1],12,HC));
 if(slider>0){const x0=420,x1=860,yy=872,kx=x0+(x1-x0)*d/D0;
  o+=fade(slider,label('時計の ずれ',x0,822,{size:38,color:TIME,weight:700})+line(x0,yy,x1,yy,{color:C.dim,w:5})+Array.from({length:9},(_,k)=>line(x0+k*(x1-x0)/8,yy-14,x0+k*(x1-x0)/8,yy+14,{color:C.dim,w:3})).join('')+fade(knobG,dot(kx,yy,20,TIME)+ring(kx,yy,20,{color:'#ffffff',w:3})));}
 return o;
}

// ================= 4機の衛星 =================
const S4=[[140,420],[370,320],[630,320],[860,420]],PH4=[500,690];
const UNK=['東西','南北','高さ','時計のずれ'];
function unkRow(gs,bang=[0,0,0,0],y=40){
 let o='';const xs=[40,250,460,670],ws=[190,190,190,290];
 UNK.forEach((u,i)=>{const g=gs[i];if(g<=0)return;const b=bang[i],col=i===3?TIME:C.ink;
  o+=fade(g,rect(xs[i],y,ws[i]-14,110,{fill:'#131f38',fo:.95,stroke:b>.5?HC:col,sw:3,rx:14})+label(u,xs[i]+(ws[i]-14)/2,y+48,{size:36,color:col,anchor:'middle',weight:700})
   +fade(1-b,label('？',xs[i]+(ws[i]-14)/2,y+98,{size:44,color:HC,anchor:'middle',weight:700}))+fade(b,label('！',xs[i]+(ws[i]-14)/2,y+98,{size:44,color:C.F,anchor:'middle',weight:700})));});
 return o;
}


// ================= 第3版の部品 =================
// 難所の札（左上、橙の枠、山の印）
const ORANGE='#ff9f43';
export function nanjo(g=1){
 if(g<=0)return '';
 const x=40,y=10,w=226,h=70;
 let o=rect(x,y,w,h,{fill:C.bg,fo:.92,stroke:ORANGE,sw:4,rx:16});
 o+=poly([[x+18,y+54],[x+40,y+22],[x+62,y+54]],{fill:ORANGE,fo:.85})+poly([[x+46,y+54],[x+64,y+32],[x+84,y+54]],{fill:ORANGE,fo:.5});
 o+=label('難所',x+100,y+51,{size:44,color:ORANGE,weight:700});
 return fade(g,o);
}
// 予想の札（右上）
const yosou=(g=1)=>tag('予想',960,60,{anchor:'end',size:40,g});
// 候補のカード（縦に並べる）。ans：正解の番号、ansG：答え合わせの進み
const LET=['A','B','C'];
function predCards(opts,{y0=360,h=112,gap=22,gs=[1,1,1],ans=-1,ansG=0}={}){
 let o='';
 opts.forEach((t,i)=>{const g=gs[i]??1;if(g<=0)return;const y=y0+i*(h+gap),ok=i===ans;
  const dim=ans>=0&&!ok?1-.65*ansG:1;
  let c=rect(110,y,780,h,{fill:'#131f38',fo:.95,stroke:ok&&ansG>0?HC:C.dim,sw:ok&&ansG>0?3+4*ansG:3,rx:22});
  if(ok&&ansG>0)c+=rect(110,y,780,h,{fill:HC,fo:.14*ansG,stroke:'none',rx:22});
  c+=label(LET[i],170,y+h/2+24,{size:68,color:HC,anchor:'middle',weight:700})+line(230,y+18,230,y+h-18,{color:C.faint,w:3});
  c+=label(t,262,y+h/2+16,{size:46,color:C.ink,weight:700});
  o+=fade(g*dim,c);});
 return o;
}
// 3→2→1（声の後、各1秒）
function countdown(p,ctx,y=830,x=500){
 const k=cueT(p,ctx)-voiceEnd(ctx);if(k<0||k>=3.05)return '';
 const n=3-Math.min(2,Math.floor(k)),f=k-Math.floor(k);
 const g=clamp(f/.06)*(n===1?1-clamp((k-2.9)/.15):1);
 return fade(g,ring(x,y-34,66,{color:C.faint,w:5})+draw(Array.from({length:41},(_,j)=>{const a=-Math.PI/2+2*Math.PI*j/40*(1-f);return [x+66*Math.cos(a),y-34+66*Math.sin(a)];}),1,{color:HC,w:5})+label(String(n),x,y,{size:96,color:HC,anchor:'middle',weight:700}));
}
const qPlate=(lines,g=1,y=170)=>fade(g,lines.map((L,i)=>label(L,500,y+i*62,{size:48,color:C.ink,anchor:'middle',weight:700})).join(''));

// 符号（0と1の模様）。31個（5段の m 系列）と 1023個（10段、GPS の G1 と同じ x^10+x^3+1）
function lfsr(n,taps,seed=1){const L=(1<<n)-1;let r=seed;const out=[];for(let i=0;i<L;i++){out.push(r&1);let b=0;for(const t of taps)b^=(r>>(n-t))&1;r=(r>>1)|(b<<(n-1));}return out;}
const C31=lfsr(5,[5,3]);            // 長さ 31
const C1023=lfsr(10,[10,3]);         // 長さ 1023
const SATCODE=[0,1,2].map(k=>Array.from({length:40},(_,i)=>C1023[(i*7+k*311)%1023]));
const md=(a,b)=>((a%b)+b)%b;
// 模様の帯：u=0..n の窓に、code[k] を [k+shift, k+1+shift) に描く
function chipStrip(code,x0,y,w,h,n,shift,{on=LIGHT,off='#1b2a48',stroke=C.faint,id='cs'}={}){
 let o=`<clipPath id="${id}"><rect x="${x0}" y="${y}" width="${n*w}" height="${h}"/></clipPath><g clip-path="url(#${id})">`;
 o+=rect(x0,y,n*w,h,{fill:off,fo:1,stroke:'none',rx:0});
 const k0=Math.floor(-shift)-1;
 for(let k=k0;k<k0+n+3;k++){const u=k+shift;if(u>=n||u+1<=0)continue;const v=code[md(k,code.length)];
  if(v)o+=rect(x0+u*w+1,y,w-2,h,{fill:on,fo:.92,stroke:'none',rx:0});}
 o+='</g>'+rect(x0,y,n*w,h,{fill:'none',fo:0,stroke,sw:2,rx:0});
 return o;
}
// 揺れ（向きの反転入り）：x0..x0+n*w、各区切りで code の値に合わせて上下を反転
function flipWave(code,x0,y,w,n,amp,shift,{cyc=2,color=LIGHT,marks=0,id='fw'}={}){
 const pts=[];const N=Math.round(n*w/3);
 for(let j=0;j<=N;j++){const x=x0+j*n*w/N,u=(x-x0)/w-shift,k=Math.floor(u),s=code[md(k,code.length)]?-1:1;pts.push([x,y-amp*s*Math.sin(2*Math.PI*cyc*(u-k))]);}
 let o=draw(pts,1,{color,w:4});
 if(marks>0){const k0=Math.floor(-shift);for(let k=k0;k<k0+n+2;k++){const u=k+shift;if(u<=0||u>=n)continue;
  if(code[md(k,code.length)]!==code[md(k-1,code.length)])o+=fade(marks,line(x0+u*w,y-amp-24,x0+u*w,y+amp+24,{color:HC,w:3,dash:'6 6'})+dot(x0+u*w,y,9,HC));}}
 return o;
}

// 北極の上から見た地球と星（反時計回り＝西から東。角 a は数学の向き、画面では (cx+r cos a, cy−r sin a)）
const SKYSTARS=[[12,250,5],[31,215,3],[47,265,4],[66,232,3],[88,258,6],[104,222,3],[121,248,4],[142,270,3],[158,230,5],[177,255,3],[199,220,4],[216,262,5],[238,236,3],[257,268,4],[279,226,3],[296,252,6],[318,236,3],[337,262,4],[352,228,3],[8,234,3],[72,270,3],[110,262,4],[185,233,6],[300,214,4]];
const P2=(cx,cy,r,aDeg)=>[cx+r*Math.cos(aDeg*DEG),cy-r*Math.sin(aDeg*DEG)];
function topEarth(cx,cy,r,rotDeg,{obs=null,obsCol=HC,ray=1,shipIcon=false}={}){
 let o=dot(cx,cy,r,'#1d4a8f');
 // 大陸（地球と一緒に回る）
 for(const [a,rr,sz] of [[30,.55,.32],[150,.5,.28],[250,.6,.3]]){const q=P2(cx,cy,r*rr,a+rotDeg);o+=`<ellipse cx="${n1(q[0])}" cy="${n1(q[1])}" rx="${n1(r*sz)}" ry="${n1(r*sz*.7)}" fill="#2f7d55" fill-opacity=".85"/>`;}
 o+=ring(cx,cy,r,{color:'#7fb2ff',w:3})+dot(cx,cy,5,C.ink);
 if(obs!==null){const q=P2(cx,cy,r,obs),q2=P2(cx,cy,r+(ray?r*1.05:0),obs);
  if(ray)o+=line(q[0],q[1],q2[0],q2[1],{color:obsCol,w:3,dash:'8 8'});
  o+=dot(q[0],q[1],shipIcon?9:10,obsCol)+ring(q[0],q[1],16,{color:obsCol,w:3});}
 return o;
}
function starRing(cx,cy,k=1,{g=1,hi=null}={}){
 return fade(g,SKYSTARS.map(([a,rr,sz])=>{const q=P2(cx,cy,rr*k,a);return dot(q[0],q[1],sz*Math.max(.7,k),'#edf4ff',.9);}).join(''));
}
// 見上げた夜空の帯：δ＝星の角−観測者の角。δ>0（東）を左に
function skyStrip(x0,y0,w,h,obsDeg,{g=1,span=60,label2=true,id='ss'}={}){
 const cx=x0+w/2,k=(w/2-20)/span;
 let o=rect(x0,y0,w,h,{fill:'#0d1830',fo:1,stroke:'#3a4a66',sw:3,rx:12});
 o+=`<clipPath id="${id}"><rect x="${x0}" y="${y0}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#${id})">`;
 for(const [a,rr,sz] of SKYSTARS){let d=md(a-obsDeg+180,360)-180;if(Math.abs(d)>span+8)continue;
  o+=dot(cx-d*k,y0+h*.18+(rr-210)/65*h*.62,sz+1.5,'#edf4ff',.95);}
 o+='</g>'+line(cx,y0+6,cx,y0+h-6,{color:C.faint,w:2,dash:'4 8'});
 if(label2)o+=label('東',x0+14,y0+h-14,{size:36,color:C.dim})+label('西',x0+w-14,y0+h-14,{size:36,color:C.dim,anchor:'end'});
 return fade(g,o);
}
// 北極星と三人
const GL={cx:420,cy:590,r:220};
function latPerson(phi,g,{lab='',labPos=null,angTxt='',side=1,labOff=null}={}){
 if(g<=0)return '';
 const {cx,cy,r}=GL,P=[cx+side*r*Math.cos(phi*DEG),cy-r*Math.sin(phi*DEG)],T=[-side*Math.sin(phi*DEG),-Math.cos(phi*DEG)];
 let o=line(P[0]-T[0]*110,P[1]-T[1]*110,P[0]+T[0]*130,P[1]+T[1]*130,{color:C.dim,w:3,dash:'10 8'});
 o+=rot(side*(90-phi),P[0],P[1],figure(P[0],P[1],{s:.32,color:'#c4cde0'}));
 o+=arrow(P[0],P[1],P[0],P[1]-150,{color:LIGHT,w:5,head:18});
 // 高さの角（地平線の北向き〜真上）
 const a0=Math.atan2(T[1],T[0]),a1=-Math.PI/2+(side<0&&a0<-Math.PI/2?0:0);const arc=[];for(let j=0;j<=20;j++){const a=a0+(a1-a0)*j/20;arc.push([P[0]+62*Math.cos(a),P[1]+62*Math.sin(a)]);}
 if(phi>1)o+=draw(arc,1,{color:HC,w:5});
 if(angTxt)o+=plate(angTxt,labPos?labPos[0]:P[0]+20,labPos?labPos[1]:P[1]-60,{size:40,color:HC});
 if(lab){const lo=labOff??[phi<10?24:phi>80?-20:34,phi<10?60:phi>80?-170:30];o+=label(lab,P[0]+lo[0],P[1]+lo[1],{size:38,color:C.ink,weight:700,anchor:lo[0]<0?'end':'start'});}
 return fade(g,o);
}
function polarisScene(g0,gN,gE,gM,{lab=1}={}){
 const {cx,cy,r}=GL;
 let o=fade(g0,dot(cx,cy,r,'#1d4a8f')+ring(cx,cy,r,{color:'#7fb2ff',w:3})+line(cx-r,cy,cx+r,cy,{color:'#7fb2ff',w:2,dash:'8 8'})+label('赤道',cx-r+14,cy-14,{size:36,color:'#8ec0ff'})+line(cx,cy-r-10,cx,cy+r+10,{color:C.dim,w:2,dash:'4 8'})
  +label('★',820,200,{size:64,color:LIGHT,anchor:'middle'})+label('北極星',820,260,{size:40,color:LIGHT,anchor:'middle',weight:700})+note('とても遠いので',740,310)+note('どこでも 同じ向き',740,355));
 o+=latPerson(90,gN,{lab:'北極',angTxt:lab?'真上 90°':'',labPos:[cx-250,cy-r-80]});
 o+=latPerson(0,gE,{lab:'赤道',angTxt:lab?'すれすれ 0°':'',labPos:[cx+r+20,cy-170]});
 o+=latPerson(45,gM,{lab:'中ほど',side:-1,labOff:[-60,40],angTxt:lab?'45°':'',labPos:[cx-r*Math.cos(45*DEG)-110,cy-r*Math.sin(45*DEG)-70]});
 return o;
}

// 港と船（正午の図）：北極の上から、地球は止めて、太陽の真下の点が東→西（時計回り）に動く
const NO={cx:440,cy:500,r:220},PORT_A=90,SHIP_A=75;
function noonScene(sig,{gPort=1,gShip=1,clockT=null,flashP=0,flashS=0,labs=1}={}){
 const {cx,cy,r}=NO;
 let o=dot(cx,cy,r,'#1d4a8f');
 // 夜の側
 const nA=sig+90;const a=P2(cx,cy,r,nA),b=P2(cx,cy,r,nA+180);
 o+=`<path d="M${n1(a[0])} ${n1(a[1])} A${r} ${r} 0 0 0 ${n1(b[0])} ${n1(b[1])} Z" fill="#05080f" fill-opacity=".62"/>`;
 o+=ring(cx,cy,r,{color:'#7fb2ff',w:4})+dot(cx,cy,6,C.ink)+label('北極',cx+12,cy+40,{size:36,color:C.dim});
 // 太陽と光
 const S=P2(cx,cy,r+120,sig),Q=P2(cx,cy,r,sig);
 o+=line(S[0],S[1],Q[0],Q[1],{color:'#ffcf67',w:3,dash:'8 8'})+dot(S[0],S[1],40,'#ffcf67')+dot(Q[0],Q[1],12,'#ffcf67');
 o+=fade(labs,label('太陽の 真下',S[0]+(S[0]<cx?-50:50),S[1]-50,{size:36,color:'#ffcf67',anchor:S[0]<cx?'end':'start',weight:700}));
 // 東西の向き
 o+=fade(labs,label('東',P2(cx,cy,r+46,140)[0],P2(cx,cy,r+46,140)[1],{size:40,color:C.dim,anchor:'middle',weight:700})+label('西',P2(cx,cy,r+46,30)[0]+10,P2(cx,cy,r+46,30)[1],{size:40,color:C.dim,anchor:'middle',weight:700}));
 const place=(A,name,col,g,fl)=>{const q=P2(cx,cy,r,A),l=P2(cx,cy,r-62,A===PORT_A?99:66);return fade(g,fade(fl,dot(q[0],q[1],34,HC,.35))+dot(q[0],q[1],14,col)+ring(q[0],q[1],20,{color:col,w:3})+label(name,l[0],l[1]+14,{size:40,color:col,anchor:'middle',weight:700}));};
 o+=place(PORT_A,'港',HC,gPort,flashP)+place(SHIP_A,'船',C.x,gShip,flashS);
 return o;
}


// 時計の目盛り（1000分の1秒ごと）。針が目盛りを越えるたびに光る。周期 2.4 秒で描く（ゆっくり）
const TICKP=2.4;
function tickClock(x,y,name,col,t,g=1){
 const ph=(t%TICKP)/TICKP,flash=clamp(1-ph*5);
 let o=ring(x,y,52,{color:col,w:4,fill:'#131f38'});
 for(let k=0;k<4;k++){const a=k*Math.PI/2;o+=line(x+Math.sin(a)*40,y-Math.cos(a)*40,x+Math.sin(a)*52,y-Math.cos(a)*52,{color:col,w:k?3:7});}
 o+=line(x,y,x+Math.sin(ph*2*Math.PI)*44,y-Math.cos(ph*2*Math.PI)*44,{color:col,w:4})+dot(x,y,5,col);
 o+=fade(flash,ring(x,y,64,{color:HC,w:5}));
 o+=label(name,x,y+92,{size:36,color:col,anchor:'middle',weight:700});
 return fade(g,o);
}
// 目盛りのたびに「始め」が出てくる帯：右へ流れる。始めの位置に黄の印
function startStrip(x0,y,t,col,id,g=1){
 const n=24,w=30,v=n/TICKP*.9; // 一周 ≈ 帯の幅の 0.9
 const sh=(t*v)%31;
 let o=chipStrip(C31,x0,y,w,60,n,sh,{on:col,id});
 // 始め（k ≡ 0 mod 31）の位置
 for(let m=-1;m<2;m++){const u=sh+31*m;if(u<0||u>n)continue;o+=line(x0+u*w,y-16,x0+u*w,y+76,{color:HC,w:5})+label('始め',x0+u*w,y+110,{size:36,color:HC,anchor:'middle',weight:700});}
 return fade(g,o);
}
// ================= cue ごとの図 =================
const SKYDEG=15; // 1時間に 15°
export const deep07Diagrams={
 // 1a 衛星→地上 0.07 秒
 [K+'sky:fly']:(p,ctx)=>{const w=vseg(ctx,p,.05,.6);
  return skyScene({wave:w,lab:vseg(ctx,p,.2,.4),time:vseg(ctx,p,.55,.8)})+note('距離・大きさは 縮めて 描いています',40,60,{g:vseg(ctx,p,.1,.3)});},
 // 1b 100万分の1秒より細かく測らないと、数百 m ずれる
 [K+'map:shift']:(p,ctx)=>{const u=vseg(ctx,p,.1,.45),m=vseg(ctx,p,.55,.85);
  let o=cityMap(230,820)+rulerTop(vseg(ctx,p,0,.1),u);
  o+=blueDot(MT[0],MT[1],{ghost:true,g:seg(m,.05,.3)});
  o+=blueDot(mix(MT[0],MS[0],m),MT[1]);
  o+=fade(seg(m,.1,.4),label('本当の 場所',MT[0],MT[1]+90,{size:36,color:C.dim,anchor:'middle'}));
  o+=fade(seg(m,.7,1),arrow(MT[0]+30,MT[1]-70,MS[0]-30,MT[1]-70,{color:C.a,w:6,head:22})+plate('数百 m ずれる',450,MT[1]-110,{size:44,color:C.a,anchor:'middle'}));
  return o;},
 // 2 「いつ出たか」「いつ着いたか」：札は衛星の側とスマホの側に
 [K+'sky:tags']:(p,ctx)=>{const first=ctx.cue?.subtitle?.startsWith('でも');
  const a=first?swin(ctx,p,1,.45,.6):1,b=first?swin(ctx,p,1,.62,.78):1;
  let o=skyScene({time:1,lab:1});
  o+=fade(a,line(SAT1[0],SAT1[1]-40,SAT1[0],SAT1[1]-62,{color:TIME,w:3})+rect(632,30,256,66,{fill:'#2a2410',fo:.95,stroke:TIME,sw:3,rx:14})+label('出た 時刻？',760,76,{size:40,color:TIME,anchor:'middle',weight:700}));
  o+=fade(b,line(PH1[0]+50,PH1[1]-60,430,560,{color:C.x,w:3})+rect(420,516,290,66,{fill:'#0f2a33',fo:.95,stroke:C.x,sw:3,rx:14})+label('着いた 時刻？',565,562,{size:40,color:C.x,anchor:'middle',weight:700}));
  if(!first){const q=vseg(ctx,p,.3,.6);
   o+=fade(q,rect(620,20,280,86,{fill:'none',fo:0,stroke:HC,sw:5,rx:18}))+bigQ(560,250,vseg(ctx,p,.55,.85),150);
   o+=fade(vseg(ctx,p,0,.2)*(1-q*.5),rect(416,512,298,74,{fill:C.bg,fo:.4,stroke:'none',rx:14}));}
  return o+note('距離・大きさは 縮めて 描いています',40,890);},
 // 4 300年前の船乗り
 [K+'sea:ship']:(p,ctx)=>{const t=cueT(p,ctx);
  let o=stars()+seaBg(600,t)+ship(420,610,{tilt:Math.sin(t*1.1)*2});
  o+=fade(vseg(ctx,p,.1,.3),pocketWatch(820,250,62)+label('？',820,140,{size:52,color:HC,anchor:'middle',weight:700}));
  o+=fade(vseg(ctx,p,.6,.8),plate('約300年前',40,90,{size:48,color:HC}));
  return o;},
 // 5a 北極星：北極では真上、赤道ではすれすれ
 [K+'star:polaris']:(p,ctx)=>{const first=ctx.cue?.subtitle?.startsWith('北と南');
  if(first){const g0=swin(ctx,p,0,0,.6),gN=swin(ctx,p,1,.05,.3),gE=swin(ctx,p,1,.5,.8);
   return polarisScene(g0,gN,gE,0)+fade(g0,plate('北と南は 星で 分かる',40,90,{size:44,color:C.ink}));}
  const gM=vseg(ctx,p,0,.3),z=vseg(ctx,p,.45,.8);
  let o=polarisScene(1,1,1,gM)+plate('北と南は 星で 分かる',40,90,{size:44,color:C.ink,g:1-z});
  o+=fade(z,rect(30,820,880,90,{fill:'#131f38',fo:.95,stroke:HC,sw:4,rx:16})+label('北極星の 高さ ＝ どれだけ 北か',470,880,{size:46,color:HC,anchor:'middle',weight:700}));
  return o;},
 // 6–7 予想：東西も星で分かる？（A 分かる／B 分からない）→ 答え B、難所
 [K+'pred1:q']:(p,ctx)=>{const s=ctx.cue?.subtitle??'';
  const opts=['分かる','分からない'];
  if(s.startsWith('予想'))return yosou(vseg(ctx,p,0,.4))+qPlate(['東西の 位置も、','星で 分かる？'],vseg(ctx,p,.2,.8),190);
  let o=yosou(1)+qPlate(['東西の 位置も、','星で 分かる？'],1,190);
  if(s.startsWith('東西')){
   o+=predCards(opts,{y0:400,gs:[swin(ctx,p,0,.8,.97),swin(ctx,p,1,0,.6)]});
   return o+countdown(p,ctx,830);}
  const ag=swin(ctx,p,0,.3,.7);
  o+=predCards(opts,{y0:400,ans:1,ansG:ag});
  o+=nanjo(swin(ctx,p,1,0,.5));
  return o;},
 // 8 地球は西→東に回る → 星は1時間に15°ずつ東→西
 [K+'sky:rot']:(p,ctx)=>{const t=cueT(p,ctx),ve=voiceEnd(ctx),cx=330,cy=420,r=105;
  const s1=swin(ctx,p,0,0,.3),s2=swin(ctx,p,1,0,.2);
  const obs=100+SKYDEG*Math.max(0,t-.3); // 1秒を1時間に見立てる
  let o=nanjo(1)+starRing(cx,cy,1,{g:s1})+topEarth(cx,cy,r,obs-100,{obs});
  // 回る向き
  const arc=[];for(let j=0;j<=24;j++)arc.push(P2(cx,cy,r+34,200+j*4));
  o+=fade(s1,draw(arc,1,{color:C.x,w:5})+arrow(...P2(cx,cy,r+34,292),...P2(cx,cy,r+34,300),{color:C.x,w:5,head:20}));
  o+=fade(swin(ctx,p,0,.3,.7),plate('地球：西 → 東',640,200,{size:42,color:C.x})+label('北極の 上から',640,140,{size:36,color:C.dim}));
  o+=fade(s2,label('この人が 見上げた 夜空',60,690,{size:38,color:HC,weight:700})+skyStrip(60,710,820,170,obs,{id:'d07s8'}));
  o+=fade(swin(ctx,p,1,.3,.6),plate('星：東 → 西',640,280,{size:42,color:'#edf4ff'}));
  o+=fade(swin(ctx,p,1,.6,.9),plate('1時間に 15°',640,360,{size:46,color:HC}));
  o+=note('動きは 速めて います',640,440,{g:s1});
  return o;},
 // 9–10 東へ15°移動 ＝ 同じ場所で1時間待つ
 [K+'sky:same']:(p,ctx)=>{const s=ctx.cue?.subtitle??'',first=s.startsWith('では');
  const cxL=235,cxR=685,cy=330,r=62,k=.62,A0=95;
  let mv,wt,gR,ov;
  if(first){mv=swin(ctx,p,0,.3,.9);gR=swin(ctx,p,1,0,.25);wt=swin(ctx,p,1,.3,.75);ov=0;}
  else{mv=1;gR=1;wt=1;ov=vseg(ctx,p,0,.45);}
  const obsL=A0+15*mv,obsR=A0+15*wt;
  let o=nanjo(1);
  // 左：東へ 15° 移動（地球は止まったまま）
  o+=label('東へ 15° 移動',cxL,135,{size:40,color:C.x,anchor:'middle',weight:700});
  o+=starRing(cxL,cy,k)+topEarth(cxL,cy,r,0,{obs:obsL,obsCol:C.x,shipIcon:true});
  o+=fade(seg(mv,.05,1),label('同じ 時刻',cxL,520,{size:36,color:C.dim,anchor:'middle'}));
  // 右：同じ場所で 1時間 待つ（地球が 15° 回る）
  o+=fade(gR,label('同じ場所で 1時間 待つ',cxR,135,{size:40,color:HC,anchor:'middle',weight:700})+starRing(cxR,cy,k)+topEarth(cxR,cy,r,15*wt,{obs:obsR,obsCol:HC})
   +label(`＋${Math.round(60*wt)}分`,cxR,520,{size:36,color:HC,anchor:'middle',weight:700}));
  // 夜空の帯（並べる → 重ねる）
  const o1=first?0:vseg(ctx,p,0,.3),o2=first?0:vseg(ctx,p,.35,.6);
  const xL=mix(30,230,o1),yL=mix(570,560,o1),xR=mix(480,230,o1),yR=mix(mix(570,730,o1),560,o2);
  o+=skyStrip(xL,yL,410,150,obsL,{id:'d07sL'});
  o+=fade(gR*(1-.45*o2),skyStrip(xR,yR,410,150,obsR,{id:'d07sR'}));
  if(!first){o+=fade(o1*(1-o2),label('＝',730,735,{size:80,color:HC,anchor:'middle',weight:700}));
   o+=fade(o2,rect(xL,yL,410,150,{fill:'none',fo:0,stroke:HC,sw:6,rx:12})+label('ぴったり 重なる',440,750,{size:40,color:HC,anchor:'middle',weight:700}));
   o+=fade(vseg(ctx,p,.65,.9),plate('区別 できない',440,850,{size:52,color:HC,anchor:'middle'}));}
  if(first)o+=fade(swin(ctx,p,1,.8,1),plate('同じ 夜空',360,780,{size:44,color:HC}));
  return o;},
 // 11a 港の時刻を知る必要
 [K+'port:need']:(p,ctx)=>{const s=ctx.cue?.subtitle??'',first=s.startsWith('区別');
  if(first){const t=cueT(p,ctx);let o=nanjo(1)+seaBg(640,t)+ship(260,650,{s:.8,tilt:Math.sin(t*1.2)*2});
   o+=fade(vseg(ctx,p,.3,.6),pocketWatch(700,370,120,{h:12,m:0})+label('今、港は 何時？',700,600,{size:40,color:TIME,anchor:'middle',weight:700}));
   return o;}
  // 11b 一段ずつ：① 港の正午 ② 船の正午は港の時計で 13時 ③ 1時間おそい → 15° 西
  const a=vseg(ctx,p,0,.15),b=vseg(ctx,p,.2,.55),c=vseg(ctx,p,.62,.9);
  const tc=12+mix(0,1,b);
  let o=nanjo(1);
  o+=label('港の 時計',200,150,{size:40,color:TIME,anchor:'middle',weight:700})+clockFace(200,300,120,{h:Math.floor(tc),m:(tc%1)*60,face:'#f4ecd8',color:'#2a2a2a',w:4});
  o+=label(`${String(Math.floor(tc)).padStart(2,'0')}:${String(Math.round((tc%1)*60)%60).padStart(2,'0')}`,200,480,{size:52,color:TIME,anchor:'middle',weight:700});
  const row=(y,g,sunTxt,name,col,clockTxt)=>fade(g,rect(380,y,520,130,{fill:'#131f38',fo:.95,stroke:col,sw:3,rx:16})+dot(440,y+50,26,'#ffcf67')+line(440,y+80,440,y+110,{color:'#ffcf67',w:3})+label(name,480,y+60,{size:40,color:col,weight:700})+label(sunTxt,480,y+110,{size:36,color:C.ink})+label(clockTxt,880,y+60,{size:44,color:TIME,anchor:'end',weight:700}));
  o+=row(150,a,'太陽が 一番 高い','港の 正午',HC,'12時');
  o+=row(310,b>0?clamp(b*3):0,'太陽が 一番 高い','船の 正午',C.x,b>.95?'13時':'');
  o+=fade(seg(b,.9,1),arrow(640,290,640,310,{color:C.dim,w:4,head:12})+plate('1時間 おそい',560,520,{size:44,color:C.a}));
  o+=fade(c,rect(40,600,860,120,{fill:'#131f38',fo:.95,stroke:HC,sw:4,rx:18})+label('1時間 おそい → 15° 西',470,680,{size:52,color:HC,anchor:'middle',weight:700}));
  o+=fade(vseg(ctx,p,.85,1),note('1時間 ＝ 15°（1日で 360°）',40,800));
  return o;},
 // 12 太陽の真下の点が東→西へ。港→船の順に正午
 [K+'port:sun']:(p,ctx)=>{const t=cueT(p,ctx),ve=voiceEnd(ctx),u=clamp(t/(ve+1.2));
  const sig=115-60*u,T=12+(90-sig)/15;
  const fp=clamp(1-Math.abs(sig-PORT_A)/3),fs=clamp(1-Math.abs(sig-SHIP_A)/3);
  let o=nanjo(1)+noonScene(sig,{flashP:fp,flashS:fs});
  o+=label('港の 時計',800,590,{size:36,color:TIME,anchor:'middle',weight:700})+clockFace(800,680,72,{h:Math.floor(T),m:(T%1)*60,face:'#f4ecd8',color:'#2a2a2a',w:4});
  o+=fade(clamp((PORT_A+.5-sig)*2),plate('港：正午（12時）',60,830,{size:42,color:HC}));
  o+=fade(clamp((SHIP_A+.5-sig)*2),plate('船：正午（13時）',60,895,{size:42,color:C.x}));
  o+=label('北極の 上から',60,130,{size:36,color:C.dim});
  o+=note('太陽の 動きは 速めて います',60,775);
  return o;},
 // 13 揺れる船の上で、何か月も狂わない時計
 [K+'watch:sway']:(p,ctx)=>{const t=cueT(p,ctx),tilt=Math.sin(t*1.6)*7;
  let o=nanjo(1)+seaBg(640,t*2)+ship(300,650,{tilt,s:.9});
  const fx=730,fy=120;
  let c=rect(fx-110,fy,220,420,{fill:'#3a2a1c',fo:1,stroke:'#a0764e',sw:4,rx:14})+clockFace(fx,fy+100,80,{h:10,m:10,face:'#f4ecd8',color:'#2a2a2a',w:4});
  const sw=Math.sin(t*3.1)*18+Math.sin(t*1.6)*12;c+=rot(sw,fx,fy+200,line(fx,fy+200,fx,fy+360,{color:GOLD,w:4})+dot(fx,fy+370,24,GOLD));
  o+=rot(tilt*.6,fx,fy+420,c);
  o+=fade(vseg(ctx,p,.3,.5),label('振り子時計',fx,fy+480,{size:38,color:C.ink,anchor:'middle',weight:700}));
  o+=bigX(fx,fy+210,120,vseg(ctx,p,.6,.8));
  o+=fade(vseg(ctx,p,.35,.55),plate('何か月も 狂わない 時計？',40,140,{size:42,color:C.ink}));
  return o;},
 // 14a 1707年 霧と岩場 → 14b 賞金
 [K+'sea:fog']:(p,ctx)=>{const s=ctx.cue?.subtitle??'',first=s.startsWith('1707');
  const u=first?vseg(ctx,p,.1,.75):1,t=cueT(p,ctx)+(first?0:ctx.tg);
  let o=stars(.4)+seaBg(600,t,{color:'#0f2340'});
  o+=ship(90,575,{s:.4,dim:.6})+ship(215,590,{s:.5,dim:.7});
  o+=rocks(first?vseg(ctx,p,.3,.55):1)+fade(first?vseg(ctx,p,.4,.6):1,label('岩場',740,470,{size:40,color:'#c4cde0',anchor:'middle',weight:700}));
  o+=ship(mix(400,470,u),612,{tilt:Math.sin(t*1.1)*1.5,dim:.8});
  o+=fog(t,first?vseg(ctx,p,0,.3):1);
  o+=plate('1707年',40,90,{size:48,color:HC,g:first?vseg(ctx,p,0,.12):1})+fade(first?vseg(ctx,p,.05,.25):1,label('イギリスの 艦隊',40,150,{size:38,color:C.ink}));
  if(first)o+=fade(vseg(ctx,p,.25,.4),label('位置を 読みまちがえた',40,880,{size:40,color:C.ink,weight:700}));
  else{const g=vseg(ctx,p,.3,.6);
   o=fade(1-.5*g,o)+fade(g,card(60,250,680,150,{stroke:GOLD})+label('東西の 位置を 測る 方法',400,312,{size:44,color:GOLD,anchor:'middle',weight:700})+label('→ 大きな 賞金',400,375,{size:44,color:GOLD,anchor:'middle',weight:700})
    +[0,1,2,3].map(k=>`<ellipse cx="${830+k*8}" cy="${360-k*18}" rx="56" ry="17" fill="${GOLD}" stroke="#fff1b8" stroke-width="2"/>`).join(''));}
  return o;},
 // 15a ハリソン（人影と懐中時計）
 [K+'watch:maker']:(p,ctx)=>{const b=vseg(ctx,p,0,.4),c=vseg(ctx,p,.5,.9);
  let o=fade(b,figure(250,620,{s:1.3})+rect(60,620,520,30,{fill:WOOD,fo:1,stroke:'#a0764e',rx:4})+label('時計職人 ハリソン',40,720,{size:40,color:C.ink,weight:700}));
  o+=fade(b,pocketWatch(640,420,120,{h:10,m:10}));
  o+=fade(c,line(80,830,80+700*seg(c,0,.8),830,{color:TIME,w:8})+label('40年 以上',80,800,{size:44,color:TIME,weight:700}));
  o+=note('人物は 人影で 表しています',40,895,{g:b});
  return o;},
 // 15b 1761年 約2か月の航海で 約5秒（実験）
 [K+'watch:voyage']:(p,ctx)=>{const u=vseg(ctx,p,.25,.6),e=vseg(ctx,p,.72,.95);
  const route=[];for(let k=0;k<=40;k++){const s=k/40;route.push([mix(780,230,s),mix(240,560,s)-Math.sin(s*Math.PI)*120]);}
  let o=rect(20,40,960,600,{fill:'#0f2340',fo:1,stroke:'#2a3d60',sw:3,rx:14});
  o+=poly([[760,170],[800,140],[850,160],[860,230],[820,290],[770,270],[750,220]],{fill:'#2f7d55',fo:.9})+label('イギリス',820,340,{size:38,color:C.ink,anchor:'middle',weight:700});
  o+=`<ellipse cx="230" cy="570" rx="70" ry="22" fill="#2f7d55" fill-opacity=".9"/>`+label('ジャマイカ',230,625,{size:38,color:C.ink,anchor:'middle',weight:700});
  o+=draw(route,u,{color:C.dim,w:4,dash:'12 10'});
  const q=route[Math.min(40,Math.round(u*40))];
  o+=ship(q[0],q[1],{s:.3});
  o+=plate('1761年',40,110,{size:48,color:HC,g:vseg(ctx,p,0,.12)});
  o+=fade(vseg(ctx,p,.4,.55),label('約2か月',40,740,{size:56,color:C.ink,weight:700})+label('の 航海',310,740,{size:40,color:C.dim}));
  o+=fade(e,pocketWatch(700,800,70,{h:10,m:10,chain:false}));
  o+=fade(e,label('狂い：約5秒',40,840,{size:56,color:HC,weight:700}));
  o+=tag('実験',960,110,{anchor:'end',g:vseg(ctx,p,0,.15)});
  return o;},
 // 16 場所の正確さ ＝ 時計の正確さ → GPS
 [K+'watch:gps']:(p,ctx)=>{const a=swin(ctx,p,0,.1,.7),b=swin(ctx,p,1,.1,.7);
  let o=fade(a,card(40,40,920,110,{stroke:HC})+label('場所の 正確さ ＝ 時計の 正確さ',500,112,{size:46,color:HC,anchor:'middle',weight:700}));
  o+=fade(a,pocketWatch(240,420,110,{h:10,m:10})+ship(240,720,{s:.4})+label('1761年',240,800,{size:38,color:C.dim,anchor:'middle'}));
  o+=fade(b,arrow(420,450,560,450,{color:C.dim,w:6,head:24})+label('延長線上',490,410,{size:36,color:C.dim,anchor:'middle'}));
  o+=fade(b,sat(720,440,{s:1,clock:1})+label('GPSの 衛星',720,600,{size:40,color:BODY,anchor:'middle',weight:700}));
  return o;},
 // 17 どうやって「いつ出たか」を伝える？ ここも難所
 [K+'code:intro']:(p,ctx)=>{const a=swin(ctx,p,0,.4,.8);
  let o=earthArc(780)+sat(700,300,{s:1.3,clock:1})+phone(260,660,{s:.9});
  o+=fade(a,line(700,370,700,440,{color:TIME,w:3})+rect(560,440,280,70,{fill:'#2a2410',fo:.95,stroke:TIME,sw:3,rx:14})+label('いつ 出た？',700,490,{size:44,color:TIME,anchor:'middle',weight:700}));
  o+=draw([[640,350],[300,560]],vseg(ctx,p,.1,.5),{color:LIGHT,w:4,dash:'14 10'});
  o+=nanjo(swin(ctx,p,1,0,.5));
  return o;},
 // 18 揺れの向きをひっくり返す → 0と1
 [K+'code:wave']:(p,ctx)=>{const s=ctx.cue?.subtitle??'',first=s.startsWith('衛星');
  const t=cueT(p,ctx)+(first?0:ctx.tg),sh=-t*.35,w=110,n=8,x0=60,y=330;
  const mk=first?vseg(ctx,p,.5,.85):1;
  let o=nanjo(1)+label('衛星から来る 電波の 揺れ',60,150,{size:40,color:C.ink,weight:700});
  o+=line(x0,y,x0+n*w,y,{color:C.faint,w:2});
  o+=flipWave(C31,x0,y,w,n,70,sh,{marks:mk,id:'d07fw'});
  o+=fade(mk,plate('ひっくり返す',600,210,{size:40,color:HC}));
  if(!first){const g=vseg(ctx,p,0,.5);
   let d='';const k0=Math.floor(-sh);for(let k=k0;k<k0+n+2;k++){const u=k+sh;if(u<-.5||u>n-.5)continue;d+=label(String(C31[md(k,31)]),x0+(u+.5)*w,500,{size:56,color:C31[md(k,31)]?HC:C.ink,anchor:'middle',weight:700});}
   o+=fade(g,`<clipPath id="d07dg"><rect x="${x0}" y="430" width="${n*w}" height="100"/></clipPath><g clip-path="url(#d07dg)">${d}</g>`);
   o+=fade(vseg(ctx,p,.4,.8),rect(60,600,820,190,{fill:'#131f38',fo:.95,stroke:C.faint,sw:3,rx:16})+label('揺れが そのまま　→ 0',100,670,{size:42,color:C.ink,weight:700})+label('揺れが ひっくり返る → 1',100,745,{size:42,color:HC,weight:700}));}
  o+=note('揺れは ゆっくりに 描いています',60,880);
  return o;},
 // 19 1023個の0と1、1000分の1秒で一周、衛星ごとに違う模様
 [K+'code:ring']:(p,ctx)=>{const t=cueT(p,ctx),a=swin(ctx,p,0,0,.5),b=swin(ctx,p,0,.5,.9),c=swin(ctx,p,1,0,.6);
  const cx=300,cy=420,R=190;
  let o=nanjo(1);let r='';
  for(let i=0;i<1023;i++){const ang=-Math.PI/2+2*Math.PI*i/1023;r+=line(cx+(R-28)*Math.cos(ang),cy+(R-28)*Math.sin(ang),cx+R*Math.cos(ang),cy+R*Math.sin(ang),{color:C1023[i]?LIGHT:'#2a3d60',w:1.3});}
  o+=fade(a,r+label('1023個',cx,cy+4,{size:52,color:HC,anchor:'middle',weight:700})+label('の 0と1',cx,cy+60,{size:38,color:C.ink,anchor:'middle'}));
  // 針は輪の外側だけ
  const sp=-Math.PI/2+2*Math.PI*((t*.25)%1);
  o+=fade(b,line(cx+(R-40)*Math.cos(sp),cy+(R-40)*Math.sin(sp),cx+(R+22)*Math.cos(sp),cy+(R+22)*Math.sin(sp),{color:HC,w:6})+plate('1000分の1秒で 一周',90,160,{size:40,color:HC}));
  // 一部を拡大
  o+=fade(a,line(cx-60,cy-R+10,80,650,{color:C.faint,w:2,dash:'6 8'})+line(cx+60,cy-R+10,700,650,{color:C.faint,w:2,dash:'6 8'})+chipStrip(C1023,80,650,31,70,20,0,{id:'d07rz'})+note('一部を 拡大',80,760));
  // 衛星ごとの模様
  [0,1,2].forEach(k=>{const y=200+k*140;o+=fade(seg(c,k*.25,k*.25+.4),sat(600,y,{s:.36})+chipStrip(SATCODE[k],660,y-26,13,52,24,0,{on:[C.x,C.v,C.F][k],id:'d07sc'+k}));});
  o+=fade(seg(c,.7,1),label('衛星ごとに 違う 模様',560,620,{size:38,color:C.ink,weight:700}));
  return o;},
 // 20 スマホは模様を全部知っている
 [K+'code:phone']:(p,ctx)=>{const g=vseg(ctx,p,.3,.7);
  let o=nanjo(1);
  [0,1,2].forEach(k=>{const y=180+k*90;o+=sat(110,y,{s:.3})+chipStrip(SATCODE[k],180,y-24,17,48,40,0,{on:[C.x,C.v,C.F][k],id:'d07pa'+k});});
  o+=label('届く 模様',180,130,{size:38,color:C.dim});
  o+=phone(170,640,{s:1.1});
  o+=fade(g,rect(280,500,620,300,{fill:'#131f38',fo:.95,stroke:C.x,sw:4,rx:18})+label('スマホの 中',310,550,{size:38,color:C.x,weight:700})
   +[0,1,2].map(k=>chipStrip(SATCODE[k],310,575+k*68,14,48,40,0,{on:[C.x,C.v,C.F][k],id:'d07pb'+k})).join('')+line(240,620,280,620,{color:C.x,w:3}));
  o+=fade(vseg(ctx,p,.6,.9),plate('同じ 模様を 全部 知っている',40,880,{size:42,color:HC}));
  return o;},
 // 21–22 予想 → 重ねてずらす → 一致した所のずれ ＝ 届くまでの時間
 [K+'code:corr']:(p,ctx)=>{const s=ctx.cue?.subtitle??'',t=cueT(p,ctx),ve=voiceEnd(ctx);
  const Dl=9,w=26,n=31,x0=60;
  const pred=s.startsWith('予想'),slide=s.startsWith('スマホ');
  let sh;
  if(pred)sh=0;else if(slide)sh=6*clamp(t/(ctx.dur));else sh=6+3*seg(t,0,.5*ve);
  const agreeAt=m=>{let a=0;for(let i=0;i<n;i++)a+=C31[md(i-Dl,n)]===C31[md(i-m,n)]?1:0;return a/n;};
  const ag=m=>{const f=Math.floor(m),q=m-f;return (1-q)*agreeAt(f)+q*agreeAt(f+1);};
  let o=nanjo(1);
  o+=label('届いた 模様',x0,215,{size:38,color:C.ink,weight:700})+chipStrip(C31,x0,235,w,70,n,Dl,{id:'d07c1'});
  o+=label('スマホが 作る 模様',x0,375,{size:38,color:C.x,weight:700})+chipStrip(C31,x0,395,w,70,n,sh,{on:C.x,id:'d07c2'});
  if(pred){o+=yosou(1)+label('？',500,700,{size:200,color:HC,anchor:'middle',weight:700})+countdown(p,ctx,860);
   o+=note('模様は 一部だけ（本当は 1023個）',60,140);return o;}
  // 一致度のメーター
  const a=ag(sh);
  o+=label('一致度',x0,610,{size:38,color:C.ink,weight:700})+rect(220,578,640,44,{fill:'#131f38',fo:1,stroke:C.faint,sw:2,rx:8})+rect(222,580,636*a,40,{fill:a>.97?HC:C.F,fo:.9,stroke:'none',rx:7});
  // ずらし量と一致度のグラフ
  const gx=s0=>80+s0*55,gy=v=>860-v*200;
  let tr=[];for(let m=0;m<=sh+1e-6;m+=.1)tr.push([gx(m),gy(ag(m))]);tr.push([gx(sh),gy(ag(sh))]);
  o+=line(80,860,860,860,{color:C.dim,w:2})+line(80,860,80,640,{color:C.dim,w:2})+label('ずらした 量 →',860,900,{size:36,color:C.dim,anchor:'end'});
  o+=draw(tr,1,{color:C.F,w:4})+dot(gx(sh),gy(a),9,a>.97?HC:C.F);
  if(!slide&&!pred){const pk=seg(t,.5*ve,.5*ve+.4);
   o+=fade(pk,ring(gx(Dl),gy(1),24,{color:HC,w:5})+plate('ぴったり！',gx(Dl)+30,gy(1)-10,{size:40,color:HC}));
   const q=swin(ctx,p,1,0,.6);
   o+=fade(q,line(x0,500,x0+Dl*w,500,{color:HC,w:6})+line(x0,486,x0,514,{color:HC,w:4})+line(x0+Dl*w,486,x0+Dl*w,514,{color:HC,w:4}));
   o+=fade(q,plate('ずらした 量 ＝ 届くまでの 時間',x0+Dl*w+24,530,{size:40,color:HC}));}
  o+=note('模様は 一部だけ（本当は 1023個）',60,140);
  return o;},
 // 23 バーコードを二枚重ねる
 [K+'code:bar']:(p,ctx)=>{const t=cueT(p,ctx),ve=voiceEnd(ctx),u=seg(t,.2,ve*.85),off=mix(-150,0,u),al=clamp((t-ve*.85)/.4);
  const bars=y=>{let o='';let x=200;C31.forEach((v,i)=>{const bw=v?14:7;o+=rect(x,y,bw,150,{fill:'#111',fo:1,stroke:'none',rx:0});x+=bw+(i%3?9:13);});return o;};
  let o=nanjo(1);
  o+=rect(160,200,680,210,{fill:'#f4f1e8',fo:1,stroke:'#c9d6ea',sw:3,rx:14})+bars(230);
  o+=`<g transform="translate(${n1(off)} 0)">`+rect(160,460,680,210,{fill:'#f4f1e8',fo:.97,stroke:'#c9d6ea',sw:3,rx:14})+bars(490)+'</g>';
  o+=fade(al,rect(150,190,700,490,{fill:'none',fo:0,stroke:HC,sw:6,rx:18})+plate('線が そろった！',500,780,{size:48,color:HC,anchor:'middle'}));
  o+=fade(clamp(u*3)*(1-al),arrow(500,720,600,720,{color:C.dim,w:5,head:20})+label('ずらす',480,735,{size:38,color:C.dim,anchor:'end'}));
  return o;},
 // 24 一つ分 ≈ 100万分の1秒 ≈ 300 m、それより細かく
 [K+'code:fine']:(p,ctx)=>{const t=cueT(p,ctx),a=swin(ctx,p,0,0,.6),b=swin(ctx,p,1,.05,.5),c=swin(ctx,p,1,.5,.95);
  let o=nanjo(1)+chipStrip(C31,60,150,26,60,31,0,{id:'d07f1'});
  o+=fade(a,rect(60+12*26-3,145,32,70,{fill:'none',fo:0,stroke:HC,sw:4,rx:4})+line(60+12*26,215,150,320,{color:HC,w:2,dash:'6 6'})+line(60+13*26,215,850,320,{color:HC,w:2,dash:'6 6'}));
  o+=fade(a,rect(150,320,700,110,{fill:LIGHT,fo:.85,stroke:HC,sw:4,rx:0})+line(150,470,850,470,{color:HC,w:4})+line(150,450,150,490,{color:HC,w:4})+line(850,450,850,490,{color:HC,w:4})
   +label('0と1の 一つ分',500,390,{size:42,color:'#1b2a48',anchor:'middle',weight:700})+label('約100万分の1秒（約300 m）',500,540,{size:42,color:HC,anchor:'middle',weight:700}));
  // 細かい目盛りと、一致度の山の頂上を探す
  o+=fade(b,Array.from({length:21},(_,j)=>line(150+j*35,320,150+j*35,j%5?350:370,{color:'#1b2a48',w:2})).join(''));
  const pk=[[150,840],[500,640],[850,840]];
  o+=fade(b,draw(pk,1,{color:C.F,w:5})+line(150,840,850,840,{color:C.dim,w:2})+label('一致度の 山',870,700,{size:36,color:C.F,anchor:'end'}));
  const xs=mix(500+180*Math.sin(t*2.2),500,c);
  o+=fade(b,line(xs,600,xs,850,{color:HC,w:4})+dot(xs,640+Math.abs(xs-500)/350*200,10,HC));
  o+=fade(c,plate('一つ分より ずっと 細かく',40,900,{size:42,color:HC}));
  return o;},
 // 21 二つの時計の目盛り（1000分の1秒ごと）で、模様が始めから出ていく／作られる
 [K+'code:clock']:(p,ctx)=>{const s=ctx.cue?.subtitle??'',first=s.startsWith('しかも'),t=cueT(p,ctx)+(first?0:ctx.tg);
  const gP=first?0:vseg(ctx,p,0,.4);
  let o=nanjo(1)+tickClock(110,250,'衛星の 時計',TIME,t,1)+sat(110,140,{s:.5,clock:1});
  o+=label('出ていく 模様',230,190,{size:36,color:C.dim});
  o+=startStrip(230,215,t,LIGHT,'d07k1',1);
  o+=fade(gP,tickClock(110,620,'スマホの 時計',C.x,t,1)+phone(110,500,{s:.5}));
  o+=fade(gP,label('スマホが 作る 模様',230,560,{size:36,color:C.x})+startStrip(230,585,t,C.x,'d07k2',1));
  o+=fade(first?vseg(ctx,p,.5,.8):1,note('目盛り 1つ ＝ 1000分の1秒（ゆっくり 描いています）',40,880));
  return o;},
 // 26 模様は 1000分の1秒で一周 → ずれから分かるのは一周の中だけ。0.07秒は約70周 → 何周目？
 [K+'code:lap']:(p,ctx)=>{const s=ctx.cue?.subtitle??'',first=s.startsWith('ただし');
  const a=first?vseg(ctx,p,0,.35):1,b=first?vseg(ctx,p,.45,.9):1,c=first?0:vseg(ctx,p,0,.4),d=first?0:vseg(ctx,p,.45,.8);
  let o=nanjo(1);
  // 一周＝1000分の1秒 の帯が 70 個並ぶ
  o+=fade(a,label('模様 一周 ＝ 1000分の1秒',40,170,{size:40,color:HC,weight:700}));
  const n=14,w=62;for(let k=0;k<n;k++){o+=fade(a*clamp(1-Math.max(0,k-4)*.08),rect(40+k*w,200,w-6,60,{fill:'#1b2a48',fo:1,stroke:LIGHT,sw:2,rx:6})+chipStrip(C31,43+k*w,206,(w-12)/31,48,31,0,{id:'d07lp'+k}));}
  o+=fade(a,label('…',925,250,{size:44,color:C.dim}));
  o+=fade(b,line(40,330,40+5*w-6,330,{color:HC,w:5})+line(40,316,40,344,{color:HC,w:4})+line(40+5*w-6,316,40+5*w-6,344,{color:HC,w:4})+plate('ずれ（一周の 中だけ）',40,395,{size:40,color:HC}));
  o+=fade(c,label('0.07秒 ＝ 約70周',40,520,{size:52,color:C.ink,weight:700})+label('0.07 ÷ 0.001 ＝ 70',40,590,{size:40,color:C.dim}));
  o+=fade(d,label('何周目？',500,760,{size:100,color:HC,anchor:'middle',weight:700}));
  return o;},
 // 27 ゆっくりした0と1の手紙 → 何周目かが分かる
 [K+'code:msg']:(p,ctx)=>{const s=ctx.cue?.subtitle??'',st=s.startsWith('そこで')?0:s.startsWith('「')?1:2,t=cueT(p,ctx)+(st?ctx.tg:0);
  let o=nanjo(1)+sat(840,170,{s:.7,clock:1});
  o+=label('模様（速い 0と1）',60,170,{size:36,color:C.dim})+chipStrip(C31,60,190,12,40,56,-t*1.5,{id:'d07m1'});
  const slow=[1,0,1,1,0,0,1,0,1,1,1,0,0,1];
  o+=fade(st?1:vseg(ctx,p,.2,.6),label('ゆっくりした 0と1',60,300,{size:38,color:HC,weight:700})+chipStrip(slow,60,320,96,56,7,-t*.12,{on:HC,id:'d07m2'}));
  const L1=st===0?0:st===1?swin(ctx,p,0,.1,.7):1,L2=st===0?0:st===1?swin(ctx,p,1,.1,.8):1;
  const letter=(y,g,l1,l2)=>fade(g,line(840,230,760,y,{color:TIME,w:3,dash:'8 8'})+rect(100,y,680,140,{fill:'#f4ecd8',fo:.97,stroke:TIME,sw:3,rx:12})+label(l2,130,y+46,{size:36,color:'#6a5a3a'})+label(l1,130,y+110,{size:42,color:'#2a2a2a',weight:700}));
  o+=fade(st===0?vseg(ctx,p,.6,.95):0,rect(100,420,680,140,{fill:'#f4ecd8',fo:.6,stroke:TIME,sw:3,rx:12})+label('手紙',440,505,{size:48,color:'#2a2a2a',anchor:'middle',weight:700}));
  o+=letter(420,L1,'この瞬間 ＝ 12時00分06秒','手紙 1：衛星の 時計');
  o+=letter(600,L2,'衛星は 今 ここ（位置）','手紙 2：衛星の 位置');
  o+=fade(L1,note('時刻の 数字は 例',100,800));
  if(st===2)o+=fade(vseg(ctx,p,.3,.8),plate('何周目か ＝ 分かる！',500,860,{size:48,color:HC,anchor:'middle'}));
  return o;},
 // 26 スマホの時計は正確でない
 [K+'wall:drift']:(p,ctx)=>{const t=cueT(p,ctx),ve=voiceEnd(ctx),g=vseg(ctx,p,0,.15),dr=swin(ctx,p,1,0,1)+clamp((t-ve)/1.2)*.2;
  const base=(t*36)%360,drift=40*clamp(dr);
  let o=fade(g,clockFace(430,460,280,{face:'#131f38',color:C.ink,ghostSec:base,sec:base+drift}));
  o+=fade(g,label('スマホの 時計',40,90,{size:44,color:C.x,weight:700}));
  o+=fade(swin(ctx,p,1,.2,.6),label('正しい 時刻（点線）',40,880,{size:38,color:C.dim}));
  o+=fade(clamp(dr*3),plate('ずれる',600,180,{size:48,color:C.a}));
  o+=note('ずれは 大きく 誇張',560,895,{g:clamp(dr*3)});
  o+=phone(860,300,{s:.8,g});
  return o;},
 // 27–28a 予想：時計が 1000万分の1秒 進んでいたら、距離は？
 [K+'pred2:q']:(p,ctx)=>{const s=ctx.cue?.subtitle??'';
  const opts=['ばらばらに ずれる','どれも 同じだけ 長くなる','変わらない'],Q=['時計が 1000万分の1秒','進んでいたら、距離は？'];
  if(s.startsWith('予想'))return yosou(vseg(ctx,p,0,.4))+qPlate(Q,vseg(ctx,p,.2,.8),150);
  let o=yosou(1)+qPlate(Q,1,150);
  if(s.startsWith('スマホ'))return o+predCards(opts,{y0:300,gs:[vseg(ctx,p,.78,.95),0,0]});
  if(s.startsWith('どれも'))return o+predCards(opts,{y0:300,gs:[1,swin(ctx,p,0,0,.4),swin(ctx,p,1,0,.6)]})+countdown(p,ctx,850);
  return o+predCards(opts,{y0:300,ans:1,ansG:vseg(ctx,p,.25,.6)});},
 // 28b どれも 30 m 長い
 [K+'fix:longer']:(p,ctx)=>{const a=vseg(ctx,p,0,.15),b=vseg(ctx,p,.15,.45),c=vseg(ctx,p,.55,.85),e=vseg(ctx,p,.85,1);
  const k=1.15,x0=170,ys=[300,450,600];
  let o=fade(a,label('衛星からの 距離',40,90,{size:44,color:C.ink,weight:700}));
  FCEN.forEach((cn,i)=>{const y=ys[i],L=FR[i]*k,ext=D0*k;
   o+=fade(a,sat(85,y,{s:.42})+line(x0,y,x0+L,y,{color:FCOL[i],w:10}));
   o+=fade(b,label('＋1000万分の1秒',x0,y-30,{size:36,color:TIME,weight:700}));
   o+=fade(c,line(x0+L,y,x0+L+ext*c,y,{color:HC,w:14})+line(x0+L,y-20,x0+L,y+20,{color:HC,w:4}));
   o+=fade(seg(c,.6,1),label('＋30 m',x0+L+ext/2,y+56,{size:38,color:HC,anchor:'middle',weight:700}));});
  o+=fade(e,plate('どれも 同じ 30 m',40,760,{size:46,color:HC}));
  o+=fade(seg(c,.3,1),label('30万 km/s × 1000万分の1秒 ＝ 30 m',40,840,{size:38,color:C.ink}));
  o+=note('30 m は 大きく 誇張',40,895,{g:c});
  return o;},
 // 29 交わらない → 同じ長さずつ縮める → 一点、縮めた長さ ＝ 時計のずれ
 [K+'fix:circ']:(p,ctx)=>{const s=ctx.cue?.subtitle??'',first=s.startsWith('距離');
  if(first){const circ=swin(ctx,p,0,0,.5),sh=swin(ctx,p,1,.3,1),d=D0*(1-.7*sh);
   let o=fixScene(d,{circ,arrows:swin(ctx,p,0,.3,.6),cross:swin(ctx,p,0,.6,.9),slider:swin(ctx,p,1,0,.25)});
   o+=fade(swin(ctx,p,0,.6,.9)*(1-swin(ctx,p,1,0,.2)),plate('一点で 交わらない',510,560,{size:40,color:'#ffffff',anchor:'middle'}));
   o+=fade(swin(ctx,p,1,.1,.3),plate('全部の 距離を 同じ 長さずつ 縮める',40,90,{size:38,color:HC}));
   o+=plate('平面の 図（円）で 考えます　30 m は 大きく 誇張',40,150,{size:36,color:C.dim,weight:400,g:swin(ctx,p,0,0,.3)});
   return o;}
  const fx=vseg(ctx,p,0,.35),d=D0*.3*(1-fx),meet=vseg(ctx,p,.3,.45),cd=vseg(ctx,p,.55,.9);
  let o=fade(1-.55*cd,fixScene(d,{arrows:1-seg(fx,.85,1),cross:1-seg(fx,.9,1),meet,slider:1-cd}));
  o+=fade(meet*(1-cd),plate('一点に 集まる ＝ 本当の 場所',40,90,{size:40,color:HC}));
  o+=fade(cd,rect(40,640,860,240,{fill:'#131f38',fo:.95,stroke:HC,sw:4,rx:18})+label('縮めた 長さ',70,710,{size:42,color:HC,weight:700})+label('30 m',870,710,{size:46,color:HC,anchor:'end',weight:700})
   +label('↓',100,775,{size:40,color:C.dim})+label('時計の ずれ',70,845,{size:42,color:TIME,weight:700})+label('1000万分の1秒',870,845,{size:44,color:TIME,anchor:'end',weight:700}));
  o+=tag('結果',960,60,{anchor:'end',g:cd});
  return o;},
 // 30a 平面：2＋1＝3 → 30b 立体：3＋1＝4
 [K+'fix:count']:(p,ctx)=>{const s=ctx.cue?.subtitle??'',first=s.startsWith('平面');
  const cardS=(x,y,w,txt,col,g)=>fade(g,rect(x,y,w,96,{fill:'#131f38',fo:.95,stroke:col,sw:3,rx:14})+label(txt,x+w/2,y+62,{size:40,color:col,anchor:'middle',weight:700}));
  const a=first?vseg(ctx,p,0,.2):1,b=first?vseg(ctx,p,.25,.55):1,c=first?vseg(ctx,p,.6,.9):1;
  let o=fade(a,label('平面の 図',40,150,{size:44,color:C.ink,weight:700}));
  o+=cardS(40,180,180,'東西',C.ink,b)+cardS(240,180,180,'南北',C.ink,b)+fade(c,label('＋',450,245,{size:48,color:C.dim,anchor:'middle'}))+cardS(480,180,250,'時計のずれ',TIME,c);
  o+=fade(c,plate('平面：2 ＋ 1 ＝ 3',40,370,{size:60,color:HC}));
  // 三つの円の小さな絵
  o+=fade(c,ring(820,250,60,{color:C.x,w:3})+ring(872,292,60,{color:C.v,w:3})+ring(806,320,60,{color:C.F,w:3})+dot(838,290,7,HC)+label('円 3つ',840,420,{size:36,color:C.dim,anchor:'middle'}));
  if(!first){const d=swin(ctx,p,0,.05,.4),e=swin(ctx,p,0,.45,.8),f=swin(ctx,p,0,.8,1);
   o=fade(1-.45*d,o);
   o+=fade(d,line(40,450,900,450,{color:C.faint,w:2})+label('本当の 空（立体）',40,520,{size:44,color:C.ink,weight:700}));
   o+=cardS(40,550,170,'東西',C.ink,e)+cardS(225,550,170,'南北',C.ink,e)+cardS(410,550,170,'高さ',HC,e)+fade(e,label('＋',610,615,{size:48,color:C.dim,anchor:'middle'}))+cardS(640,550,250,'時計のずれ',TIME,e);
   o+=fade(f,plate('立体：3 ＋ 1 ＝ 4',40,760,{size:60,color:HC}));}
  return o;},
 // 30c 4機以上
 [K+'fix:four']:(p,ctx)=>{const sg=[0,1,2,3].map(i=>vseg(ctx,p,.25+i*.15,.38+i*.15));
  let o=earthArc(780)+phone(PH4[0],PH4[1]);
  o+=unkRow([1,1,1,1],sg.map(v=>v>.6?1:0));
  o+=plate('3 ＋ 1 ＝ 4',500,235,{size:52,color:HC,anchor:'middle'});
  S4.forEach((s,i)=>{o+=sat(s[0],s[1]+20,{s:.6,g:sg[i]})+draw([[s[0],s[1]+60],[PH4[0],PH4[1]-110]],sg[i],{color:LIGHT,w:3,dash:'12 10'});});
  o+=fade(vseg(ctx,p,.85,1),plate('4機 以上',80,880,{size:48,color:HC}));
  return o;},
 // 31 衛星の時計を借りて合わせ直す
 [K+'next:borrow']:(p,ctx)=>{const a=swin(ctx,p,0,.2,.8),b=swin(ctx,p,1,.1,.6);
  let o=earthArc(780)+sat(720,220,{clock:1,glow:b*(.7+.3*Math.sin(cueT(p,ctx)*4))});
  o+=phone(280,640)+fade(swin(ctx,p,0,0,.25),clockFace(420,520,46,{h:10,m:10,face:'#131f38',color:C.x,w:4,ticks:false})+label('安い 時計',420,610,{size:36,color:C.x,anchor:'middle'}));
  o+=fade(a,arrow(640,310,470,480,{color:TIME,w:7,head:26})+plate('毎回 合わせ直す',560,440,{size:40,color:TIME}));
  o+=fade(b,plate('すべては 衛星の 時計しだい',40,90,{size:44,color:HC}));
  return o;},
 // 32 衛星の時計は 10億分の1秒をどう保つ？ そして「1秒」とは？
 [K+'next:q']:(p,ctx)=>{const s=ctx.cue?.subtitle??'',first=s.startsWith('では');
  if(first){const a=vseg(ctx,p,.3,.6),t=cueT(p,ctx);
   let o=sat(500,330,{s:1.6,clock:1,glow:.5+.2*Math.sin(t*3)});
   o+=fade(a,plate('正確さ：10億分の1秒',500,620,{size:52,color:HC,anchor:'middle'}));
   o+=bigQ(500,860,vseg(ctx,p,.7,.95),170);
   return o;}
  const g=vseg(ctx,p,0,.3),c=vseg(ctx,p,.4,.8);
  let o=fade(.35+.65*(1-g),sat(840,140,{s:.7,clock:1}));
  o+=fade(g,label('1秒',380,420,{size:220,color:C.ink,anchor:'middle',weight:700})+label('？',720,400,{size:180,color:HC,anchor:'middle',weight:700}));
  o+=finalCard(['「1秒」とは、','そもそも 何？'],c,{y:560,size:60});
  return o;},
};

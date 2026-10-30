// 深掘りショート 06（ys-deep-06）第3版「宇宙からの電波で、なぜ場所が分かる？」— 図。縦長の舞台 1000×920（vert-v1）。
// 共通の形は yt1-sp-deep-common.mjs。値の検算は台本 docs/video-revision-20260924/ytseries/sp-deep-06.mjs の冒頭。
// この回で作った形（他の回の図ファイルには頼らない）：地球 earth、GPS 衛星 gpsSat、スプートニク sputnik、スマホ phone、
//   電波の弧 radioArcs、ストップウォッチ watch、人影 person、救急車 ambulance、雲と稲妻 cloud／bolt、
//   第3版：難所の札 nansho、候補のカード cards、カウントダウン countdown、電子 electron、電気の力の波 fieldRow、アンテナ antBar、
//   向きの変わり方 dirRow、斜めから見た球 sphere／二つの球の交わりの円 meet（3D を正射影）。
import {C,seg,clamp,mix,fade,label,line,rect,dot,ring,draw,arrow,poly,scaleAt} from './anim.mjs';
import {W,H,HC,LIGHT,cueT,voiceEnd,vseg,swin,sentWin,tag,note,plate,bigQ,finalCard} from './yt1-sp-deep-common.mjs';
const sentWinEnd=ctx=>sentWin(ctx)[0][1];

const K='deep06-',DEG=Math.PI/180;
const RADIO=C.x,SOUND='#c4cde0',GOLD='#e8b84a',PANEL='#3f6fd8',SILVER='#c9d6ea',BLUE='#3f8cff',TIME=C.t,PERSON='#c4cde0';
const f1=v=>Number(v).toFixed(1);
const tv=(ctx,p)=>cueT(p,ctx)/voiceEnd(ctx);

// ================= 形 =================
function earth(cx,cy,r){
 return dot(cx,cy,r,'#2f6fd8')
  +`<path d="M${f1(cx-r*.55)} ${f1(cy-r*.35)} q${f1(r*.3)} ${f1(-r*.3)} ${f1(r*.6)} ${f1(-r*.05)} q${f1(r*.1)} ${f1(r*.3)} ${f1(-r*.15)} ${f1(r*.5)} q${f1(-r*.3)} ${f1(r*.1)} ${f1(-r*.45)} ${f1(-r*.45)}Z" fill="#3fae6a"/>`
  +`<path d="M${f1(cx+r*.15)} ${f1(cy+r*.1)} q${f1(r*.4)} ${f1(-r*.2)} ${f1(r*.6)} ${f1(r*.15)} q${f1(-r*.05)} ${f1(r*.4)} ${f1(-r*.35)} ${f1(r*.45)} q${f1(-r*.3)} ${f1(-r*.2)} ${f1(-r*.25)} ${f1(-r*.6)}Z" fill="#3fae6a"/>`
  +ring(cx,cy,r,{color:'#7fb2ff',w:3});
}
// GPS 衛星：金の本体と、左右の青い太陽電池の板
export function gpsSat(x,y,s=1,{g=1,glow=0}={}){
 const b=22*s,pw=78*s,ph=30*s,gap=10*s;
 let o=glow>0?dot(x,y,70*s,HC,.22*glow):'';
 for(const sg of [-1,1]){const x0=sg<0?x-b-gap-pw:x+b+gap;
  o+=line(x+sg*b,y,x+sg*(b+gap),y,{color:SILVER,w:Math.max(2,4*s)});
  o+=rect(x0,y-ph/2,pw,ph,{fill:PANEL,fo:.95,stroke:'#7fb2ff',sw:Math.max(1.5,2.5*s),rx:2});
  for(let k=1;k<4;k++)o+=line(x0+pw*k/4,y-ph/2,x0+pw*k/4,y+ph/2,{color:'#7fb2ff',w:Math.max(1,1.5*s)});
 }
 o+=rect(x-b,y-b,2*b,2*b,{fill:GOLD,fo:1,stroke:'#fff1b8',sw:Math.max(1.5,3*s),rx:4*s});
 o+=line(x,y+b,x,y+b+14*s,{color:SILVER,w:Math.max(2,4*s)})+dot(x,y+b+16*s,5*s,SILVER);
 return fade(g,o);
}
// スプートニク：銀の球と、後ろに伸びる4本のアンテナ（dir＝進む向き、ラジアン）
function sputnik(x,y,s=1,{g=1,dir=0}={}){
 const c=Math.cos(dir),sn=Math.sin(dir),P=(u,v)=>[x+u*c-v*sn,y+u*sn+v*c];
 let o='';
 for(const v of [-30,-11,11,30]){const a=P(-8*s,v*.3*s),b=P(-100*s,v*s);o+=line(a[0],a[1],b[0],b[1],{color:SILVER,w:Math.max(2,3*s)});}
 o+=dot(x,y,22*s,SILVER)+dot(x-7*s,y-7*s,7*s,'#ffffff',.7);
 return fade(g,o);
}
// スマホ：地図と青い点（中心 cx,cy、大きさ s）
export function phone(cx,cy,s=1,{g=1,map=1,blue=1,acc=0,t=0}={}){
 const w=300*s,h=560*s,x0=cx-w/2,y0=cy-h/2,m=16*s,sx0=x0+m,sy0=y0+m*3,sw=w-2*m,sh=h-m*6;
 const P=(u,v)=>[sx0+sw*u,sy0+sh*v];
 let o=rect(x0,y0,w,h,{fill:'#0f1830',fo:1,stroke:SILVER,sw:Math.max(2,6*s),rx:40*s});
 let mp=rect(sx0,sy0,sw,sh,{fill:'#16233d',fo:1,stroke:'none',rx:10*s});
 mp+=poly([P(.62,0),P(1,0),P(1,.22),P(.7,.18)],{fill:'#2b6b4a',fo:.75});
 mp+=draw([P(0,.78),P(.3,.7),P(.6,.82),P(1,.74)],1,{color:'#2c5aa0',w:14*s});
 for(const [a,b] of [[[0,.3],[1,.36]],[[0,.55],[1,.5]],[[.25,0],[.32,1]],[[.7,0],[.62,1]],[[0,.05],[.5,.6]]]){const A=P(...a),B=P(...b);mp+=line(A[0],A[1],B[0],B[1],{color:'#33476b',w:9*s});}
 o+=fade(map,mp);
 const [bx,by]=P(.47,.43);
 if(acc>0)o+=fade(acc,dot(bx,by,58*s,BLUE,.22)+ring(bx,by,58*s,{color:BLUE,w:Math.max(1.5,3*s)}));
 if(blue>0){const pr=(t*.8)%1;
  o+=fade(blue,ring(bx,by,20*s+40*s*pr,{color:BLUE,w:Math.max(1.5,3*s)}).replace('/>',` opacity="${f1(1-pr)}"/>`)+dot(bx,by,20*s,'#ffffff')+dot(bx,by,15*s,BLUE));}
 o+=rect(cx-40*s,y0+18*s,80*s,10*s,{fill:SILVER,fo:.5,stroke:'none',rx:5*s});
 return fade(g,o);
}
const BLUE_AT=(cx,cy,s=1)=>[cx-150*s+16*s+(300*s-32*s)*.47,cy-280*s+48*s+(560*s-96*s)*.43];
// 円弧（中心 cx,cy、半径 r、角 a0→a1、ラジアン）
const arcD=(cx,cy,r,a0,a1)=>`M${f1(cx+r*Math.cos(a0))} ${f1(cy+r*Math.sin(a0))} A${f1(r)} ${f1(r)} 0 ${Math.abs(a1-a0)>Math.PI?1:0} 1 ${f1(cx+r*Math.cos(a1))} ${f1(cy+r*Math.sin(a1))}`;
const arcPath=(cx,cy,r,a0,a1,{color=RADIO,w=5,opacity=1}={})=>r<=1?'':`<path d="${arcD(cx,cy,r,a0,a1)}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"${opacity<1?` opacity="${f1(Math.max(0,opacity))}"`:''}/>`;
// 電波の弧：(x,y) から向き dir へ広がる（t 秒、間隔 sp、速さ v px/秒、届く距離 L）
function radioArcs(x,y,dir,t,{color=RADIO,sp=70,v=160,L=420,spread=28,w=5,g=1}={}){
 let o='';const off=(t*v)%sp;
 for(let r=off+20;r<L;r+=sp)o+=arcPath(x,y,r,dir-spread*DEG,dir+spread*DEG,{color,w,opacity:1-r/L});
 return fade(g,o);
}
// ストップウォッチ（frac＝針の回り、1 で1周）
function watch(x,y,r,frac,{g=1,color=TIME}={}){
 let o=rect(x-14,y-r-34,28,22,{fill:color,fo:.9,stroke:color,rx:4})+ring(x,y,r,{color,w:6,fill:'#131f38'});
 for(let k=0;k<12;k++){const a=k*30*DEG;o+=line(x+r*.82*Math.sin(a),y-r*.82*Math.cos(a),x+r*.94*Math.sin(a),y-r*.94*Math.cos(a),{color,w:k%3?2:4});}
 const a=frac*2*Math.PI;o+=line(x,y,x+r*.75*Math.sin(a),y-r*.75*Math.cos(a),{color:C.ink,w:5})+dot(x,y,8,color);
 return fade(g,o);
}
// 電波塔（足元 x,y が場所。上に塔を描く）
function tower(x,y,s=1,{g=1,col='#9aabc7'}={}){
 const h=120*s,b=34*s,top=[x,y-h];
 let o=line(x-b,y,top[0],top[1],{color:col,w:5*s})+line(x+b,y,top[0],top[1],{color:col,w:5*s});
 for(let k=1;k<4;k++){const u=k/4,yy=y-h*u,hw=b*(1-u);o+=line(x-hw,yy,x+hw,yy,{color:col,w:3*s});}
 o+=line(x-b*.75,y-h*.25,x+b*.5,y-h*.5,{color:col,w:2.5*s})+line(x+b*.75,y-h*.25,x-b*.5,y-h*.5,{color:col,w:2.5*s});
 o+=dot(top[0],top[1]-4*s,9*s,'#ff8f9b')+dot(x,y,8*s,col);
 return fade(g,o);
}
// 人影（足元 x,y）。顔は描かない
function person(x,y,s=1,{g=1,col=PERSON}={}){
 return fade(g,dot(x,y-84*s,24*s,col)+`<path d="M${f1(x-44*s)} ${f1(y)} Q${f1(x)} ${f1(y-124*s)} ${f1(x+44*s)} ${f1(y)}Z" fill="${col}"/>`);
}
function ambulance(x,y,s=1){
 let o=rect(x-80*s,y-70*s,120*s,60*s,{fill:'#e8eef8',fo:1,stroke:'none',rx:6*s})+rect(x+40*s,y-52*s,40*s,42*s,{fill:'#e8eef8',fo:1,stroke:'none',rx:6*s});
 o+=rect(x+48*s,y-46*s,24*s,18*s,{fill:'#5c6f90',fo:1,stroke:'none',rx:3*s});
 o+=rect(x-36*s,y-56*s,10*s,32*s,{fill:'#ff4b3e',fo:1,stroke:'none',rx:1})+rect(x-47*s,y-45*s,32*s,10*s,{fill:'#ff4b3e',fo:1,stroke:'none',rx:1});
 o+=rect(x-10*s,y-82*s,20*s,12*s,{fill:'#ff4b3e',fo:1,stroke:'none',rx:3*s});
 o+=ring(x-50*s,y-8*s,13*s,{color:'#5c6f90',w:5*s,fill:'#0b1122'})+ring(x+50*s,y-8*s,13*s,{color:'#5c6f90',w:5*s,fill:'#0b1122'});
 return o;
}
const cloud=(x,y)=>[[-90,10,70,40],[-20,-15,90,55],[70,8,75,42],[0,20,120,40]].map(([dx,dy,rx,ry])=>`<ellipse cx="${x+dx}" cy="${y+dy}" rx="${rx}" ry="${ry}" fill="#3a4a66"/>`).join('');
const bolt=(x,y0,y1,{g=1,col=LIGHT}={})=>{const L=y1-y0,pts=[[x+20,y0],[x-30,y0+L*.35],[x+18,y0+L*.4],[x-22,y0+L*.72],[x+12,y0+L*.75],[x,y1]];
 return fade(g,draw(pts,1,{color:col,w:9})+draw(pts,1,{color:'#ffffff',w:3}));};
// 大きな「×」
const cross=(x,y,r,g=1,col='#ff8f9b')=>fade(g,line(x-r,y-r,x+r,y+r,{color:col,w:10})+line(x-r,y+r,x+r,y-r,{color:col,w:10}));

// ================= 1〜2 疑問：スマホと衛星 =================
const Q_SAT=[720,170],Q_PH=[260,650],Q_S=.45;
function qScene(ctx,p,{m=1,sat=1,up=0,x=0,waves=0,listen=0,q=0,t=0}){
 const cx=mix(500,Q_PH[0],m),cy=mix(440,Q_PH[1],m),s=mix(1,Q_S,m);
 let o='';
 o+=gpsSat(Q_SAT[0],Q_SAT[1],1,{g:sat})+fade(sat,label('衛星',Q_SAT[0],Q_SAT[1]-56,{size:38,color:GOLD,anchor:'middle',weight:700}));
 const B=BLUE_AT(cx,cy,s),top=[cx+40,cy-280*s-14];
 if(waves>0){const a=Math.atan2(top[1]-Q_SAT[1],top[0]-20-Q_SAT[0]);o+=radioArcs(Q_SAT[0],Q_SAT[1]+40,a,t,{L:Math.hypot(top[0]-Q_SAT[0],top[1]-Q_SAT[1])-10,g:waves,spread:20});
  o+=fade(waves,label('電波',560,330,{size:40,color:RADIO,weight:700}));}
 if(up>0){o+=fade(up*(1-.6*listen),arrow(top[0]-60,top[1]-10,Q_SAT[0]-110,Q_SAT[1]+50,{color:C.dim,w:5,head:22,g:Math.min(1,up*1.5)}));
  o+=fade(up*(1-listen),label('送る？',180,330,{size:38,color:C.dim,weight:700}));}
 o+=cross(mix(top[0]-60,Q_SAT[0]-110,.5),mix(top[1]-10,Q_SAT[1]+50,.5),34,x*(1-.6*listen));
 o+=phone(cx,cy,s,{t,acc:0});
 o+=fade(listen,plate('受け取る だけ',Q_PH[0]+110,Q_PH[1]+60,{size:40,color:RADIO}));
 o+=bigQ(740,700,q,200);
 return o;
}

// ================= 3〜4 スプートニク =================
const OR={cx:500,cy:530,R:190,r:300};
const spAng=tg=>Math.PI*.55+.32*tg;
function orbitScene(ctx,{year=1,ussr=1,orbit=1,sp=1,name=1,first=1,beep=0}){
 const tg=ctx.tg??0,a=spAng(tg),sx=OR.cx+OR.r*Math.cos(a),sy=OR.cy+OR.r*Math.sin(a);
 let o=earth(OR.cx,OR.cy,OR.R)+label('地球',OR.cx,OR.cy+16,{size:40,color:C.ink,anchor:'middle',weight:700});
 if(orbit>0){const pts=[];for(let k=0;k<=96;k++){const b=a-2*Math.PI*k/96;pts.push([OR.cx+OR.r*Math.cos(b),OR.cy+OR.r*Math.sin(b)]);}o+=draw(pts,orbit,{color:C.faint,w:3,dash:'10 10'});}
 if(beep>0){const per=.8;for(let k=0;k<4;k++){const te=Math.floor(tg/per)*per-k*per,age=tg-te;if(age<0||age>2.6)continue;const b=spAng(te);
   o+=fade(beep*(1-age/2.6),ring(OR.cx+OR.r*Math.cos(b),OR.cy+OR.r*Math.sin(b),30+90*age,{color:RADIO,w:4}));}
  const ph=(tg%per)/per;o+=fade(beep*(ph<.35?1:0),plate('ピッ',sx+40,sy-40,{size:40,color:RADIO}));}
 o+=sputnik(sx,sy,1,{g:sp,dir:a+Math.PI/2});
 o+=fade(year,label('1957年',40,90,{size:64,color:HC,weight:700}));
 o+=fade(ussr,label('旧ソ連',40,150,{size:40,color:C.ink,weight:700}));
 o+=fade(name,label('スプートニク',960,90,{size:48,color:SILVER,anchor:'end',weight:700}));
 o+=fade(first,label('世界で 初めての 人工衛星',960,145,{size:38,color:C.dim,anchor:'end'}));
 o+=note('大きさと 高さは 大きく 誇張',40,895,{g:sp});
 return o;
}

// ================= 5 衛星が通り過ぎる（音の高さ） =================
const PS={y:150,x0:90,x1:910,gy:450,L:[500,410],k:.45,dtE:.16};
// 衛星の x（τ＝この cue の始まりからの秒、T＝通り過ぎる時間）
const passX=(tau,T)=>PS.x0+(PS.x1-PS.x0)*clamp(tau/T);
function passScene(tau,T,{moving=1,graph=0,people=1,labels=0,tagG=0,sw=0,near=0}={}){
 const v=(PS.x1-PS.x0)/T,cw=v/PS.k;
 const xs=u=>moving?passX(u,T):PS.x0;
 let sky='';
 const te0=Math.floor(tau/PS.dtE)*PS.dtE;
 for(let k=0;k<40;k++){const te=te0-k*PS.dtE,age=tau-te,r=cw*age;if(r>900)break;
  sky+=ring(xs(te),PS.y,Math.max(1,r),{color:RADIO,w:3}).replace('/>',` opacity="${f1(Math.max(0,.9-r/900))}"/>`);}
 let o=`<clipPath id="d06sky"><rect x="0" y="0" width="${W}" height="${PS.gy}"/></clipPath><g clip-path="url(#d06sky)">${sky}</g>`;
 o+=line(0,PS.gy,W,PS.gy,{color:'#5c6f90',w:4});
 o+=sputnik(xs(tau),PS.y,.8,{dir:0});
 o+=fade(people,person(440,PS.gy,.9)+person(530,PS.gy,.9)+rect(600,PS.gy-46,70,46,{fill:'#5c6f90',fo:1,stroke:'none',rx:6})+line(650,PS.gy-46,690,PS.gy-130,{color:SILVER,w:4})+dot(690,PS.gy-130,6,SILVER));
 if(graph>0){
  const gx0=150,gx1=860,gy0=610,gy1=800,fy=f=>mix(gy1,gy0,(f-.7)/(1.65-.7));
  const fAt=x=>{const dx=PS.L[0]-x,dy=PS.L[1]-PS.y,ct=dx/Math.hypot(dx,dy);return 1/(1-PS.k*ct);};
  const gxOf=x=>mix(gx0,gx1,(x-PS.x0)/(PS.x1-PS.x0));
  let g=line(gx0,gy1,gx1,gy1,{color:C.dim,w:3})+line(gx0,gy1,gx0,gy0-20,{color:C.dim,w:3});
  g+=label('音の 高さ',gx0-10,gy0-36,{size:36,color:C.dim});
  g+=label('時間 →',gx1,gy1+50,{size:36,color:C.dim,anchor:'end'});
  const xn=xs(tau),pts=[];for(let x=PS.x0;x<=xn;x+=8)pts.push([gxOf(x),fy(fAt(x))]);pts.push([gxOf(xn),fy(fAt(xn))]);
  g+=draw(pts,1,{color:HC,w:6})+dot(gxOf(xn),fy(fAt(xn)),11,HC);
  g+=fade(labels*seg(xn,180,320),label('近づく：高い',gx0+300,gy0+10,{size:38,color:HC,weight:700}));
  g+=fade(labels*seg(xn,620,760),label('遠ざかる：低い',gx1,gy1-90,{size:38,color:HC,anchor:'end',weight:700}));
  o+=fade(graph,g);
  if(sw>0){const X=gxOf(500),Y=fy(1);
   o+=fade(sw,ring(X,Y,24,{color:HC,w:5})+dot(X,Y,13,HC)+plate('切り替わり',X+34,Y-62,{size:40,color:HC}));
   if(near>0){o+=draw([[X,Y-26],[500,PS.y+30]],near,{color:HC,w:4,dash:'10 9'});
    o+=fade(seg(near,.5,1),sputnik(500,PS.y,.8,{dir:0})+ring(500,PS.y,34,{color:HC,w:5})+line(500,PS.y+36,PS.L[0],PS.L[1]-90,{color:HC,w:5})+plate('一番 近い',548,PS.y-30,{size:40,color:HC}));}}
  o+=note('波の 詰まり方は 大きく 誇張',40,900,{g:graph});
 }
 o+=tag('観測',960,60,{anchor:'end',g:tagG,color:'#edf4ff'});
 return o;
}

// ================= 6 救急車と軌道 =================
function miniPitch(x0,y0,w,h){
 const pts=[];for(let k=0;k<=40;k++){const u=k/40,xx=mix(-1,1,u),f=-Math.atan(3*xx)/Math.atan(3);pts.push([x0+w*u,y0+h/2-h*.38*f]);}
 return rect(x0-16,y0-16,w+32,h+32,{fill:'#131f38',fo:.9,stroke:C.faint,sw:2,rx:12})+draw(pts,1,{color:HC,w:5});
}

// ================= 7〜8 逆転の発想 =================
const RV={sat:[700,170],me:[250,640],boss:[770,660]};
function revScene({base=1,old=1,oldLab=1,boss=0,bubble=0,ask=0,neu=0,satLab=0,meLab=0,idea=0,tg=0}){
 let o='';
 const pts=[];for(let k=0;k<=40;k++){const a=(-160+140*k/40)*DEG;pts.push([500+520*Math.cos(a),760+620*Math.sin(a)]);}
 o+=fade(base,draw(pts,1,{color:C.faint,w:3,dash:'10 10'}));
 o+=fade(base,line(40,RV.me[1],960,RV.me[1],{color:'#5c6f90',w:4}));
 o+=gpsSatLike(RV.sat,base)+fade(base,person(RV.me[0],RV.me[1],1)+rect(RV.me[0]+56,RV.me[1]-44,64,44,{fill:'#5c6f90',fo:1,stroke:'none',rx:6})+line(RV.me[0]+104,RV.me[1]-44,RV.me[0]+136,RV.me[1]-118,{color:SILVER,w:4}));
 const A=[RV.me[0]+60,RV.me[1]-150],B=[RV.sat[0]-70,RV.sat[1]+70];
 o+=fade(old,arrow(A[0],A[1],B[0],B[1],{color:C.dim,w:6,head:26}));
 o+=fade(old*oldLab,plate('聞いて → 通り道を 求めた',40,310,{size:38,color:C.dim}));
 if(neu>0)o+=arrow(B[0]+40,B[1]+30,A[0]+50,A[1]+20,{color:HC,w:8,head:30,g:neu});
 o+=fade(boss,person(RV.boss[0],RV.boss[1],1.1,{col:'#9aabc7'})+label('上司',RV.boss[0],RV.boss[1]+56,{size:38,color:C.dim,anchor:'middle',weight:700}));
 if(bubble>0){o+=fade(bubble,rect(520,420,380,110,{fill:'#131f38',fo:.95,stroke:C.ink,sw:3,rx:24})+poly([[720,528],[760,528],[758,560]],{fill:'#131f38',fo:1,stroke:'none'})+line(720,530,758,560,{color:C.ink,w:3})+line(760,530,758,560,{color:C.ink,w:3}));
  o+=fade(bubble*(1-ask),label('…',710,488,{size:48,color:C.ink,anchor:'middle',weight:700}));
  o+=fade(bubble*ask,label('逆は できないか？',710,490,{size:40,color:HC,anchor:'middle',weight:700}));}
 o+=fade(satLab,plate('場所が 分かっている',960,80,{size:38,color:GOLD,anchor:'end'}));
 o+=fade(meLab,plate('自分の 場所が 分かる？',60,760,{size:40,color:HC}));
 o+=tag('逆転の 発想',500,860,{g:idea,anchor:'middle',size:48,color:HC});
 return o;
}
const gpsSatLike=(P,g)=>sputnik(P[0],P[1],1,{g,dir:0});

// ================= 9 届くまでの時間 =================
const TC={sat:[680,150],ph:[260,660],s:.45};
function timeScene(ctx,p,{g=1,lab=0}){
 const t=ctx.tg??cueT(p,ctx),per=1.8,u=(t%per)/per,fl=clamp(u/.6);
 const top=[TC.ph[0],TC.ph[1]-280*TC.s-10];
 let o=gpsSat(TC.sat[0],TC.sat[1],1)+phone(TC.ph[0],TC.ph[1],TC.s,{t});
 o+=line(TC.sat[0],TC.sat[1]+40,top[0],top[1],{color:RADIO,w:2,dash:'6 10',opacity:.6});
 if(u<.6){const x=mix(TC.sat[0],top[0],fl),y=mix(TC.sat[1]+40,top[1],fl);o+=dot(x,y,14,RADIO)+ring(x,y,26,{color:RADIO,w:3});}
 else o+=fade(1-seg(u,.6,1),ring(top[0],top[1],30,{color:RADIO,w:4}));
 o+=watch(700,560,110,fl*.6);
 o+=fade(lab,plate('届くまでの 時間',700,780,{size:44,color:TIME,anchor:'middle'}));
 return fade(g,o);
}

// ================= 10〜12 雷 =================
const TH={gy:760,me:160,hit:780,cy:110,R:620};
function thunderScene({flash=0,boltG=0,count=0,rings=0,arrive=0,dim=0,showCount=1}){
 let o='';
 o+=line(40,TH.gy,960,TH.gy,{color:'#5c6f90',w:4});
 if(rings>0){const r=TH.R*count/3;for(let k=0;k<3;k++){const rr=r-k*45;if(rr>10)o+=arcPath(TH.hit,TH.gy,rr,Math.PI,2*Math.PI,{color:SOUND,w:5-k,opacity:(1-k*.3)*rings});}}
 o+=cloud(TH.hit,TH.cy)+bolt(TH.hit,TH.cy+40,TH.gy,{g:boltG});
 o+=person(TH.me,TH.gy,1);
 o+=fade(arrive,plate('ゴロゴロ',TH.me-30,TH.gy-170,{size:40,color:SOUND}));
 o+=fade(boltG,plate('ピカッ',TH.hit-60,TH.cy+130,{size:40,color:LIGHT,anchor:'end'}));
 o+=fade(showCount*seg(count,0,.05),plate(`${count.toFixed(1)} 秒`,440,330,{size:72,color:TIME,anchor:'middle'}));
 if(flash>0)o+=rect(0,0,W,H,{fill:'#ffffff',fo:.18*flash,stroke:'none',rx:0});
 if(dim>0)o=fade(1-.7*dim,o);
 return o;
}
function distBar(g){
 const y=850,x0=TH.me,x1=TH.hit,w=(x1-x0)/3;let o='';
 for(let k=0;k<3;k++){const gk=clamp(g*3-k);if(gk<=0)continue;const a=x1-w*k,b=x1-w*(k+1);
  o+=fade(gk,line(a,y,mix(a,b,gk),y,{color:HC,w:8})+line(a,y-14,a,y+14,{color:HC,w:4})+(gk>.99?line(b,y-14,b,y+14,{color:HC,w:4}):'')+label('340 m',(a+b)/2,y-24,{size:36,color:HC,anchor:'middle',weight:700})+label(`${k+1}秒`,(a+b)/2,y+52,{size:36,color:C.dim,anchor:'middle'}));}
 return o;
}

// ================= 18〜20 電波・光の速さ =================
const NX={sat:[500,150],ph:[500,700],s:.45};
const ER={cx:500,cy:640,r:110};ER.sat=[ER.cx,ER.cy-ER.r*(6371+20200)/6371];
function fastScene(ctx,{u=0,arrive=0,dist=1,form=0,noteG=1,t=0}){
 let o=earth(ER.cx,ER.cy,ER.r)+label('地球',ER.cx,ER.cy+14,{size:38,color:C.ink,anchor:'middle',weight:700});
 const S=ER.sat,top=[ER.cx,ER.cy-ER.r];
 o+=gpsSat(S[0],S[1],.9);
 o+=line(S[0],S[1]+40,top[0],top[1],{color:C.dim,w:3,dash:'8 10'});
 o+=fade(dist,line(S[0]+150,S[1],S[0]+150,top[1],{color:C.ink,w:3})+line(S[0]+136,S[1],S[0]+164,S[1],{color:C.ink,w:3})+line(S[0]+136,top[1],S[0]+164,top[1],{color:C.ink,w:3})+label('約 2万 km',S[0]+176,(S[1]+top[1])/2+12,{size:40,color:C.ink,weight:700}));
 if(u>0&&u<1){const y=mix(S[1]+40,top[1],u);o+=dot(S[0],y,13,RADIO)+ring(S[0],y,26,{color:RADIO,w:3});}
 o+=fade(arrive,ring(top[0],top[1],34,{color:RADIO,w:5})+plate('0.07 秒',S[0]-150,(S[1]+top[1])/2+12,{size:48,color:TIME,anchor:'end'}));
 o+=fade(form,label('2万 km ÷ 30万 km/秒 ≈ 0.07 秒',470,870,{size:40,color:HC,anchor:'middle',weight:700}));
 o+=note('衛星の 絵の 大きさは 大きく 誇張',40,60,{g:noteG});
 return o;
}

// ================= 6 救急車の前後の波 =================
// 救急車の速さ 70 px/秒、音の速さ 155 px/秒（比 0.45、大きく誇張）。0.45 秒ごとに波を出す：止まっていれば間隔 70 px、前は 38 px、後ろは 101 px。
const AM={y:430,v:70,cw:155,dtE:.45,x0:180};
const ambX=u=>AM.x0+AM.v*clamp(u,0,8);
function ambScene(t,{lab=0,meas=0,g=1}={}){
 let w='';const te0=Math.floor(t/AM.dtE)*AM.dtE;
 for(let k=0;k<40;k++){const te=te0-k*AM.dtE;if(te<-1.5)break;const r=AM.cw*(t-te);if(r>760)break;
  w+=ring(ambX(te),AM.y,Math.max(1,r),{color:SOUND,w:3}).replace('/>',` opacity="${f1(Math.max(0,.95-r/800))}"/>`);}
 let o=`<clipPath id="d06amb"><rect x="0" y="0" width="${W}" height="${AM.y}"/></clipPath><g clip-path="url(#d06amb)">${w}</g>`;
 o+=line(0,AM.y,W,AM.y,{color:'#5c6f90',w:4})+ambulance(ambX(t),AM.y,1);
 o+=fade(meas,arrow(ambX(t)+110,AM.y-150,ambX(t)+220,AM.y-150,{color:C.ink,w:5,head:20})+label('進む 向き',ambX(t)+110,AM.y-175,{size:36,color:C.ink}));
 const bar=(xc,len,col)=>line(xc-len/2,AM.y+60,xc+len/2,AM.y+60,{color:col,w:8})+line(xc-len/2,AM.y+44,xc-len/2,AM.y+76,{color:col,w:4})+line(xc+len/2,AM.y+44,xc+len/2,AM.y+76,{color:col,w:4});
 o+=fade(lab,bar(760,38,HC)+label('前：詰まる',760,AM.y+130,{size:40,color:HC,anchor:'middle',weight:700})+label('→ 高い 音',760,AM.y+180,{size:40,color:HC,anchor:'middle',weight:700}));
 o+=fade(meas,bar(220,101,'#7fb2ff')+label('後ろ：伸びる',220,AM.y+130,{size:40,color:'#7fb2ff',anchor:'middle',weight:700})+label('→ 低い 音',220,AM.y+180,{size:40,color:'#7fb2ff',anchor:'middle',weight:700}));
 o+=fade(lab,label('波の 間隔',490,AM.y+72,{size:36,color:C.dim,anchor:'middle'}));
 o+=note('波の 詰まり方は 大きく 誇張',40,895);
 return fade(g,o);
}

// ================= 8 近い通り道と遠い通り道 =================
const NR={k:.45,xl:220,xa:40,xb:400,gx0:480,gx1:860};
const nrF=(x,d)=>{const dx=NR.xl-x,ct=dx/Math.hypot(dx,d);return 1/(1-NR.k*ct);};
function nearRow(y0,d,u,{g=1,dist=0,word='',col=HC,dword=''}={}){
 const base=y0+340,py=base-d,xs=mix(NR.xa,NR.xb,clamp(u));
 let o=line(NR.xa-20,base,NR.xb+20,base,{color:'#5c6f90',w:3})+person(NR.xl,base,.7);
 o+=line(NR.xa,py,NR.xb,py,{color:C.dim,w:3,dash:'8 10'})+sputnik(xs,py,.55,{dir:0});
 o+=fade(dist,line(NR.xl+44,py+16,NR.xl+44,base-4,{color:col,w:5})+line(NR.xl+30,py+16,NR.xl+58,py+16,{color:col,w:4})+line(NR.xl+30,base-4,NR.xl+58,base-4,{color:col,w:4})+plate(dword,NR.xl+74,(py+base)/2+14,{size:40,color:col}));
 const gy0=y0+70,gy1=y0+300,fy=f=>mix(gy1,gy0,(f-.62)/(1.78-.62)),gx=x=>mix(NR.gx0,NR.gx1,(x-NR.xa)/(NR.xb-NR.xa));
 o+=line(NR.gx0,gy1,NR.gx1,gy1,{color:C.dim,w:3})+line(NR.gx0,gy1,NR.gx0,gy0-10,{color:C.dim,w:3})+label('音の 高さ',NR.gx0,gy0-24,{size:36,color:C.dim})+label('時間 →',NR.gx1,gy1+44,{size:36,color:C.dim,anchor:'end'});
 const pts=[];for(let x=NR.xa;x<=xs;x+=4)pts.push([gx(x),fy(nrF(x,d))]);pts.push([gx(xs),fy(nrF(xs,d))]);
 o+=draw(pts,1,{color:col,w:6})+dot(gx(xs),fy(nrF(xs,d)),10,col);
 o+=fade(seg(u,.55,.75),dot(gx(NR.xl),fy(1),12,HC)+ring(gx(NR.xl),fy(1),22,{color:HC,w:4}));
 o+=fade(seg(u,.8,1),plate(word,NR.gx1,gy0+20,{size:42,color:col,anchor:'end'}));
 return fade(g,o);
}

// ================= 9 何回分の記録で通り道が一本に =================
const RO={cx:500,cy:540,R:140,st:-70*DEG};
const RO_C=[[300,215,-30],[330,240,10],[290,220,35],[340,230,-12],[310,250,60],[350,215,80]]; // [rx,ry,傾き°]。3番目（35°）が本当の通り道
const RO_OUT=[[0,4],[1,5],[3]]; // 1・2・3回目の記録で外れる候補
function ellPts(rx,ry,rot,a0=0,a1=2*Math.PI){const c=Math.cos(rot*DEG),s2=Math.sin(rot*DEG),o=[];for(let k=0;k<=80;k++){const a=a0+(a1-a0)*k/80,x=rx*Math.cos(a),y=ry*Math.sin(a);o.push([RO.cx+x*c-y*s2,RO.cy+x*s2+y*c]);}return o;}
function recScene(ctx,p,{rec=[0,0,0],fin=0,tagG=0}){
 const t=cueT(p,ctx);
 let o=earth(RO.cx,RO.cy,RO.R);
 const S=[RO.cx+RO.R*Math.cos(RO.st),RO.cy+RO.R*Math.sin(RO.st)];
 const out=new Set();rec.forEach((r,i)=>{if(r>=1)RO_OUT[i].forEach(j=>out.add(j));});
 RO_C.forEach(([rx,ry,rot],j)=>{let g=1;rec.forEach((r,i)=>{if(RO_OUT[i].includes(j))g=Math.min(g,1-r);});
  if(j===2)o+=draw(ellPts(rx,ry,rot),1,{color:fin>0?HC:'#8aa0c4',w:fin>0?3+3*fin:3,dash:fin>.5?'':'10 10',opacity:.55+.45*Math.max(fin,0)});
  else if(g>0.01)o+=fade(g,draw(ellPts(rx,ry,rot),1,{color:'#8aa0c4',w:3,dash:'10 10',opacity:.55}));});
 o+=dot(S[0],S[1],12,HC)+plate('聞いた 場所',S[0]+24,S[1]-24,{size:36,color:HC});
 const cards=[[40,'1回目',3.2],[360,'2回目',1.6],[680,'3回目',.8]];
 cards.forEach(([x,l,st],i)=>{const g=Math.min(1,rec[i]*1.6);if(g<=0)return;
  const pts=[];for(let k=0;k<=30;k++){const u=k/30,xx=mix(-1,1,u),f=-Math.atan(st*xx)/Math.atan(st);pts.push([x+30+220*u,110-38*f]);}
  o+=fade(g,rect(x,40,280,130,{fill:'#131f38',fo:.92,stroke:C.faint,sw:2,rx:12})+draw(pts,1,{color:HC,w:4})+label(l,x+14,160,{size:36,color:C.ink,weight:700}));});
 o+=fade(rec[0]*(1-fin),plate('通り道の 候補',60,900,{size:40,color:'#8aa0c4'}));
 if(fin>0){const [rx,ry,rot]=RO_C[2],a=.5*t,q=ellPts(rx,ry,rot,a,a)[0];o+=fade(fin,sputnik(q[0],q[1],.55,{dir:a+Math.PI/2+rot*DEG}));}
 o+=tag('結果',500,895,{g:tagG,anchor:'middle',text:'通り道が 一本に 決まる'});
 return o;
}

// ================= 第3版：予想のカード・カウントダウン・難所の札 =================
const NAN='#ffb36b',EF=C.a,EL='#7fb2ff';
// 難所の札（舞台の左上。橙の枠、44px、小さな山の印）
function nansho(g=1,{x=40,y=14}={}){
 const w=200,h=66;
 let o=rect(x,y,w,h,{fill:C.bg,fo:.9,stroke:'none',rx:14})+rect(x,y,w,h,{fill:NAN,fo:.12,stroke:NAN,sw:3.5,rx:14});
 o+=poly([[x+16,y+50],[x+36,y+20],[x+48,y+36],[x+58,y+26],[x+80,y+50]],{fill:NAN,fo:.85});
 o+=label('難所',x+94,y+48,{size:44,color:NAN,weight:700});
 return fade(g,o);
}
// 候補のカード（縦に並べる）。pick＝正解の番号、ans＝答え合わせの進み（0→1）
const CARD={x:60,w:800,h:104,gap:18,y0:370};
function cards(items,{show=[1,1,1],pick=-1,ans=0,y0=CARD.y0}={}){
 let o='';
 items.forEach((txt,i)=>{const g=show[i]??1;if(g<=0.001)return;const y=y0+i*(CARD.h+CARD.gap),L='ABC'[i];
  const hit=i===pick&&ans>0,dim=pick>=0&&i!==pick?1-.65*ans:1,col=hit?HC:C.ink;
  let c=hit?rect(CARD.x-8,y-8,CARD.w+16,CARD.h+16,{fill:HC,fo:.14*ans,stroke:'none',rx:28}):'';
  c+=rect(CARD.x,y,CARD.w,CARD.h,{fill:'#131f38',fo:.96,stroke:hit?HC:'#5c6f90',sw:hit?3+3*ans:3,rx:22});
  c+=ring(CARD.x+62,y+CARD.h/2,36,{color:col,w:4})+label(L,CARD.x+62,y+CARD.h/2+19,{size:52,color:col,anchor:'middle',weight:700});
  c+=label(txt,CARD.x+124,y+CARD.h/2+15,{size:42,color:col,weight:700});
  o+=fade(g*dim,c);});
 return o;
}
// 声の後の 3→2→1（各1秒、96px、黄）
function countdown(ctx,p,{x=460,y=860}={}){
 const tc=cueT(p,ctx)-voiceEnd(ctx);if(tc<0||tc>=3)return '';
 const n=3-Math.floor(tc),f=tc-Math.floor(tc),a=Math.min(1,f/.1)*(f>.85?(1-f)/.15:1);
 return fade(a,scaleAt(x,y-34,1.15-.15*Math.min(1,f/.2),label(String(n),x,y,{size:96,color:HC,anchor:'middle',weight:700})));
}
const electron=(x,y,r=13,g=1)=>fade(g,dot(x,y,r,EL)+line(x-r*.5,y,x+r*.5,y,{color:'#0b1122',w:3}));
// 問いのカード（大きな「？」つき）
function qCard(y,l1,l2,g=1){
 return fade(g,rect(60,y,800,200,{fill:'#131f38',fo:.95,stroke:HC,sw:3,rx:24})+label('？',140,y+138,{size:120,color:HC,anchor:'middle',weight:700})
  +label(l1,230,y+86,{size:44,color:C.ink,weight:700})+label(l2,230,y+150,{size:44,color:C.ink,weight:700}));
}

// ================= 電波の正体 =================
// 電気の力の波：x の所の力（−1〜1）。波長 420 px、1秒に 0.6 回（大きく ゆっくり）
const FW={k:2*Math.PI/420,w:2*Math.PI*.6};
const fAt=(x,t)=>Math.sin(FW.k*x-FW.w*t);
function fieldRow(t,{y=300,A=110,g=1,x0=80,x1=920,step=56}={}){
 let o='';const env=[];
 for(let x=x0;x<=x1;x+=6)env.push([x,y-A*fAt(x,t)]);
 o+=draw(env,1,{color:EF,w:2,opacity:.35})+line(x0-30,y,x1+30,y,{color:C.faint,w:2});
 for(let x=x0;x<=x1;x+=step){const e=fAt(x,t);if(Math.abs(e)>.08)o+=arrow(x,y,x,y-A*e,{color:EF,w:5,head:Math.min(20,Math.abs(A*e)*.5)});}
 return fade(g,o);
}
// 縦のアンテナ（金属の棒）と、中の電子（上下に dy 動く）
function antBar(x0,y0,w,h,{dy=0,cols=2,rows=8,g=1,jit=0,t=0}={}){
 let o=rect(x0,y0,w,h,{fill:'#8a96aa',fo:.3,stroke:SILVER,sw:4,rx:10});
 for(let i=0;i<rows;i++)for(let j=0;j<cols;j++){const k=i*cols+j,ex=x0+w*(j+1)/(cols+1)+jit*12*Math.sin(t*1.7+k*1.3),ey=y0+40+(h-80)*i/(rows-1)+dy+jit*12*Math.cos(t*1.3+k*2.1);
  o+=electron(ex,clamp(ey,y0+16,y0+h-16));}
 return fade(g,o);
}
const SHK={w:2*Math.PI*.55};
function shakeScene(t,{arrows=1,eg=1,lab=0,cnt=0}={}){
 const e=Math.sin(SHK.w*t);
 let o=antBar(420,130,160,640,{dy:-55*e*eg,cols:2,rows:8});
 for(const x of [200,800])for(let i=0;i<5;i++){const y=200+i*125;if(Math.abs(e)>.06)o+=fade(arrows,arrow(x,y,x,y-80*e,{color:EF,w:5,head:Math.min(20,Math.abs(80*e)*.5)}));}
 o+=fade(arrows,label('電子を 押す 向き',200,835,{size:40,color:EF,anchor:'middle',weight:700}));
 o+=fade(lab,plate('行ったり 来たり',560,835,{size:40,color:EL,anchor:'middle'}));
 o+=label('アンテナ',500,120-20,{size:38,color:SILVER,anchor:'middle',weight:700});
 o+=fade(cnt,plate('1秒に 約15億回',960,60,{size:52,color:HC,anchor:'end'}));
 o+=note('動きは ゆっくりに しています',40,900);
 return o;
}
// 弱い電気 → 強める → 揺れの形
function ampScene(t,{big=0}={}){
 const e=Math.sin(SHK.w*t);
 let o=antBar(60,220,80,500,{dy:30*e,cols:1,rows:6});
 o+=line(140,470,170,470,{color:SILVER,w:4});
 const sine=(x0,x1,y,A,ph)=>{const pts=[];for(let x=x0;x<=x1;x+=4)pts.push([x,y-A*Math.sin((x-x0)/45-SHK.w*t+ph)]);return pts;};
 o+=draw(sine(175,380,470,7,0),1,{color:EL,w:4});
 o+=label('ごく 弱い',278,400,{size:40,color:EL,anchor:'middle',weight:700})+label('電気',278,550,{size:40,color:EL,anchor:'middle',weight:700});
 o+=fade(big,arrow(385,470,420,470,{color:C.ink,w:5,head:18})+rect(425,390,170,160,{fill:'#131f38',fo:.95,stroke:HC,sw:4,rx:16})+label('強める',510,460,{size:42,color:HC,anchor:'middle',weight:700})+label('×数百万',510,515,{size:36,color:HC,anchor:'middle',weight:700})
  +arrow(598,470,630,470,{color:C.ink,w:5,head:18})+draw(sine(640,880,470,120,0),seg(big,.3,1),{color:HC,w:6})+label('揺れの 形',760,300,{size:42,color:HC,anchor:'middle',weight:700}));
 o+=note('動きは ゆっくりに しています',40,900);
 return o;
}
// 衛星が電子を揺らし、電波が広がる
function sendScene(t,{zoom=1,drive=0,waves=0,cnt=0}={}){
 const e=Math.sin(SHK.w*t)*drive;
 let o=gpsSat(560,120,1.2);
 o+=radioArcs(560,190,Math.PI/2,t,{L:720,sp:80,v:150,spread:50,g:waves,w:6});
 o+=fade(zoom,line(560,150,330,250,{color:C.dim,w:2,dash:'8 8'})+rect(60,240,270,420,{fill:'#131f38',fo:.95,stroke:C.dim,sw:2,rx:16})+label('衛星の',195,300,{size:38,color:GOLD,anchor:'middle',weight:700})+label('アンテナ',195,345,{size:38,color:GOLD,anchor:'middle',weight:700}));
 o+=fade(zoom,antBar(150,370,90,260,{dy:40*e,cols:1,rows:4}));
 o+=fade(drive,plate('電子を 揺らす',195,710,{size:40,color:HC,anchor:'middle'}));
 o+=fade(cnt,plate('1秒に 約15億回',960,330,{size:44,color:HC,anchor:'end'}));
 o+=fade(waves,plate('電気の 力の 揺れが 広がる',960,860,{size:40,color:RADIO,anchor:'end'}));
 return o;
}
// 衛星の電子と、スマホの電子が同じリズムで揺れる
function syncScene(t,{g2=1,lab1=0,lab2=0}={}){
 const w=SHK.w,dl=.75,eT=Math.sin(w*t),eB=Math.sin(w*(t-dl));
 const box=(y,title,col,e)=>rect(40,y,340,190,{fill:'#131f38',fo:.95,stroke:C.dim,sw:2,rx:16})+label(title,210,y+48,{size:36,color:col,anchor:'middle',weight:700})
  +rect(90,y+100,240,50,{fill:'#8a96aa',fo:.3,stroke:SILVER,sw:3,rx:8})+electron(210+70*e,y+125,15);
 let o=box(100,'衛星の アンテナ',GOLD,eT)+fade(g2,box(620,'スマホの アンテナ',BLUE,eB));
 for(let i=0;i<5;i++){const y=320+i*65,e=Math.sin(w*(t-dl*(y-300)/320));if(Math.abs(e)>.06)o+=arrow(210,y,210+70*e,y,{color:EF,w:5,head:Math.min(18,Math.abs(70*e)*.5)});}
 const gr=(y,col,d,gg)=>{const pts=[];for(let k=0;k<=60;k++){const x=450+420*k/60,tt=t-3*(1-k/60);pts.push([x,y-55*Math.sin(w*(tt-d))]);}return fade(gg,line(450,y,870,y,{color:C.faint,w:2})+draw(pts,1,{color:col,w:5}));};
 o+=gr(195,GOLD,0,1)+gr(715,BLUE,dl,g2);
 o+=fade(lab1,plate('物 ではなく、揺さぶり',650,470,{size:42,color:HC,anchor:'middle'}));
 o+=fade(lab2,plate('同じ リズム',650,560,{size:42,color:HC,anchor:'middle'}));
 return o;
}

// ================= 向きの変わり方（近い／遠い） =================
const DR={k:.45,ox:290,span:270,gx0:610,gx1:880};
const drF=(xs,d)=>{const dx=DR.ox-xs,ct=dx/Math.hypot(dx,d);return 1/(1-DR.k*ct);};
function dirRow(y0,d,u,{g=1,col=HC,word='',fan=0}={}){
 const base=y0+400,O=[DR.ox,base-55],sy=O[1]-d,xs=mix(DR.ox-DR.span,DR.ox+DR.span,clamp(u));
 let o=line(20,base,560,base,{color:'#5c6f90',w:3})+person(DR.ox,base,.6);
 o+=line(DR.ox-DR.span,sy,DR.ox+DR.span,sy,{color:C.dim,w:3,dash:'8 10'});
 // 見る向きの跡（扇）
 if(fan>0){const a0=Math.atan2(sy-O[1],DR.ox-DR.span-O[0]),a1=Math.atan2(sy-O[1],xs-O[0]);const pts=[O];for(let k=0;k<=30;k++){const a=a0+(a1-a0)*k/30;pts.push([O[0]+70*Math.cos(a),O[1]+70*Math.sin(a)]);}o+=fade(fan,poly(pts,{fill:col,fo:.18}));}
 o+=line(O[0],O[1],xs,sy,{color:col,w:4})+sputnik(xs,sy,.5,{dir:0});
 const near=Math.abs(xs-DR.ox)<d*.35;
 o+=fade(xs<DR.ox-d*.35?1:0,label('近づく',xs,sy-40,{size:36,color:col,anchor:'middle',weight:700}))+fade(xs>DR.ox+d*.35?1:0,label('遠ざかる',xs,sy-40,{size:36,color:col,anchor:'middle',weight:700}));
 const gy0=y0+90,gy1=y0+330,fy=f=>mix(gy1,gy0,(f-.62)/(1.82-.62)),gx=x=>mix(DR.gx0,DR.gx1,(x-(DR.ox-DR.span))/(2*DR.span));
 o+=line(DR.gx0,gy1,DR.gx1,gy1,{color:C.dim,w:3})+line(DR.gx0,gy1,DR.gx0,gy0-10,{color:C.dim,w:3})+label('音の 高さ',DR.gx0,gy0-24,{size:36,color:C.dim})+label('時間 →',DR.gx1,gy1+72,{size:36,color:C.dim,anchor:'end'});
 const pts=[];for(let x=DR.ox-DR.span;x<=xs;x+=4)pts.push([gx(x),fy(drF(x,d))]);pts.push([gx(xs),fy(drF(xs,d))]);
 o+=draw(pts,1,{color:col,w:6})+dot(gx(xs),fy(drF(xs,d)),10,col);
 const bw=seg(u,.85,1);const b0=Math.max(DR.gx0,gx(DR.ox-d)),b1=Math.min(DR.gx1,gx(DR.ox+d));
 o+=fade(bw,line(b0,gy1+14,b1,gy1+14,{color:col,w:6})+line(b0,gy1+4,b0,gy1+24,{color:col,w:4})+line(b1,gy1+4,b1,gy1+24,{color:col,w:4}));
 o+=fade(bw,plate(word,DR.gx1,gy0+24,{size:42,color:col,anchor:'end'}));
 return fade(g,o);
}

// ================= 球（斜めから見た図） =================
const SP={yaw:-.5,pit:.38,sc:.9,cx:510,cy:700,re:100};
const SP_S=[[-210,320,90],[200,310,120],[40,340,-230]],SP_U=[0,100,0];
const v3={sub:(a,b)=>a.map((v,i)=>v-b[i]),add:(a,b)=>a.map((v,i)=>v+b[i]),mul:(a,s)=>a.map(v=>v*s),dot:(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0),cross:(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],norm:a=>{const l=Math.hypot(...a);return a.map(v=>v/l);}};
const SP_R=SP_S.map(s=>Math.hypot(...v3.sub(s,SP_U)));
const SP_U2=(()=>{const n=v3.norm(v3.cross(v3.sub(SP_S[1],SP_S[0]),v3.sub(SP_S[2],SP_S[0])));return v3.sub(SP_U,v3.mul(n,2*v3.dot(v3.sub(SP_U,SP_S[0]),n)));})(); // 鏡に映した点（宇宙の遠く）
function prj([x,y,z]){const cy=Math.cos(SP.yaw),sy=Math.sin(SP.yaw),x1=x*cy+z*sy,z1=-x*sy+z*cy,y2=y*Math.cos(SP.pit)-z1*Math.sin(SP.pit);return [SP.cx+SP.sc*x1,SP.cy-SP.sc*y2];}
const SCOL=[C.x,C.v,C.E];
function circ3(c,n,r,N=96){n=v3.norm(n);const a=Math.abs(n[0])<.9?[1,0,0]:[0,1,0],u=v3.norm(v3.cross(n,a)),v=v3.cross(n,u),o=[];for(let k=0;k<=N;k++){const t=2*Math.PI*k/N;o.push(prj(v3.add(c,v3.add(v3.mul(u,r*Math.cos(t)),v3.mul(v,r*Math.sin(t))))));}return o;}
function sphere(i,g=1){
 const c=prj(SP_S[i]),r=SP.sc*SP_R[i],col=SCOL[i];
 let o=`<defs><radialGradient id="d06g${i}" cx=".38" cy=".35" r=".7"><stop offset="0" stop-color="${col}" stop-opacity=".26"/><stop offset="1" stop-color="${col}" stop-opacity=".05"/></radialGradient></defs>`;
 o+=`<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r)}" fill="url(#d06g${i})" stroke="${col}" stroke-width="3"/>`;
 o+=draw(circ3(SP_S[i],[0,1,0],SP_R[i]),1,{color:col,w:2,dash:'8 8',opacity:.7});
 o+=gpsSat(c[0],c[1],.5);
 return fade(g,o);
}
function meet(i,j){const d=v3.sub(SP_S[j],SP_S[i]),L=Math.hypot(...d),a=(L*L+SP_R[i]**2-SP_R[j]**2)/(2*L),h=Math.sqrt(SP_R[i]**2-a*a);return circ3(v3.add(SP_S[i],v3.mul(d,a/L)),d,h);}
function earth3(g=1){const c=prj([0,0,0]);return fade(g,earth(c[0],c[1],SP.sc*SP.re));}
function sphereScene({e=.6,s=[1,0,0],ring12=0,pts=0,pick=0,probe=0,radius=0,t=0}={}){
 let o=earth3(e);
 s.forEach((g,i)=>{if(g>0)o+=sphere(i,g*(1-.6*pick));});
 if(probe>0){const a=-.4+1.1*Math.sin(t*.5),b=.35+.3*Math.cos(t*.4),R=SP_R[0];
  const dir=v3.norm([Math.cos(b)*Math.cos(a),-Math.sin(b),Math.cos(b)*Math.sin(a)]),Q=prj(v3.add(SP_S[0],v3.mul(dir,R))),C0=prj(SP_S[0]);
  o+=fade(radius,line(C0[0],C0[1],Q[0],Q[1],{color:HC,w:4,dash:'10 8'}));
  o+=fade(probe,dot(Q[0],Q[1],14,HC)+ring(Q[0],Q[1],26,{color:HC,w:4})+plate('ここかも？',Q[0]+34,Q[1]+12,{size:38,color:HC}));}
 if(ring12>0)o+=draw(meet(0,1),ring12,{color:HC,w:7});
 if(pts>0){const A=prj(SP_U),B=prj(SP_U2);o+=fade(pts,dot(A[0],A[1],14,HC)+ring(A[0],A[1],28,{color:HC,w:5})+dot(B[0],B[1],14,HC)+ring(B[0],B[1],28,{color:HC,w:5}));}
 if(pick>0){const A=prj(SP_U),B=prj(SP_U2);
  o+=fade(pick,cross(B[0],B[1],34,1)+plate('宇宙の 遠く',B[0]+50,B[1]+12,{size:40,color:'#ff8f9b'}));
  o+=fade(seg(pick,.4,1),dot(A[0],A[1],22,HC)+ring(A[0],A[1],44,{color:HC,w:6})+plate('あなたの 場所',A[0]+60,A[1]+60,{size:44,color:HC}));}
 return o;
}
function wall(g=1){let o='';for(let r=0;r<6;r++)for(let c=-1;c<6;c++){const x=200+c*120+(r%2?60:0),y=300+r*52;const x0=Math.max(200,x),x1=Math.min(800,x+116);if(x1>x0)o+=rect(x0,y,x1-x0,48,{fill:'#7a4a3a',fo:.85,stroke:'#a8705a',sw:2,rx:4});}return fade(g,o);}

// ================= cue ごとの図 =================
const PR1=['小さな 粒が 飛び込む','中の 電子が 揺さぶられる','何も 動かない'];
const PR2=['通り過ぎた 後','一番 近くを 通った 瞬間','まだ 近づく 途中'];
const PR3=['点','円','球の 表面'];
function pr1Bg(t){return gpsSat(800,80,.8)+radioArcs(800,120,Math.atan2(150-120,470-800),t,{L:300,sp:60,v:120,spread:22})+phone(430,205,.38,{t})+label('？',600,290,{size:110,color:HC,anchor:'middle',weight:700});}
function pr2Bg(){
 let o=line(200,300,800,300,{color:C.dim,w:3})+line(200,300,200,70,{color:C.dim,w:3})+label('音の 高さ',210,60,{size:36,color:C.dim})+label('時間 →',800,345,{size:36,color:C.dim,anchor:'end'});
 const pts=[];for(let k=0;k<=60;k++){const u=k/60,xx=mix(-1,1,u),f=-Math.atan(3*xx)/Math.atan(3);pts.push([200+600*u,185-95*f]);}
 o+=draw(pts,1,{color:HC,w:5})+ring(500,185,26,{color:HC,w:4})+plate('切り替わる 瞬間？',540,150,{size:38,color:HC});
 return o;
}
function pr3Bg(){return gpsSat(500,70,.8)+line(500,100,500,270,{color:HC,w:4,dash:'10 8'})+plate('距離が 一つ 分かった',530,200,{size:40,color:HC})+person(500,330,.5)+label('？',380,320,{size:72,color:HC,anchor:'middle',weight:700});}
export const deep06Diagrams={
 // 1 地図アプリと青い点
 [K+'q:map']:(p,ctx)=>{const t=cueT(p,ctx);
  let o=phone(500,440,1,{map:vseg(ctx,p,0,.2),blue:vseg(ctx,p,.25,.4),acc:vseg(ctx,p,.7,.9),t});
  const B=BLUE_AT(500,440,1);
  o+=fade(vseg(ctx,p,.45,.6),plate('あなたの 場所',B[0]+90,B[1]+14,{size:40,color:BLUE}));
  o+=fade(vseg(ctx,p,.75,.95),plate('数メートルの 正確さ',500,800,{size:44,color:HC,anchor:'middle'}));
  return o;},
 // 2 何も送っていない。受け取るだけ
 [K+'q:send']:(p,ctx)=>qScene(ctx,p,{m:swin(ctx,p,0,0,.3),sat:swin(ctx,p,0,.1,.35),up:swin(ctx,p,0,.4,.65),x:swin(ctx,p,0,.7,.95),waves:swin(ctx,p,1,0,.35),listen:swin(ctx,p,1,.5,.85),t:cueT(p,ctx)}),
 // 3 二つの「？」
 [K+'q:two']:(p,ctx)=>{const a=swin(ctx,p,0,.05,.4),b=swin(ctx,p,1,.25,.6);
  return qCard(150,'受け取るだけで、','なぜ 場所が 分かる？',a*(1-.55*b))+qCard(450,'そもそも「電波を 受け取る」','とは、何が 起きている？',b);},
 // 4 難所
 [K+'rad:hard']:(p,ctx)=>{const m=swin(ctx,p,1,0,.6),g=swin(ctx,p,0,.4,.8),s=mix(2.2,1,m),x=mix(400,40,m),y=mix(267,14,m);
  return scaleAt(x+100,y+33,s,nansho(g,{x,y}))+fade(swin(ctx,p,1,.3,.8),label('電波を 受け取る とは？',500,560,{size:52,color:C.ink,anchor:'middle',weight:700}));},
 // 5 予想：何が動く？
 [K+'pr1:a']:(p,ctx)=>nansho()+pr1Bg(ctx.tg)+cards(PR1,{show:[swin(ctx,p,1,.72,.85),0,0]}),
 [K+'pr1:b']:(p,ctx)=>nansho()+pr1Bg(ctx.tg)+cards(PR1,{show:[1,swin(ctx,p,0,.05,.3),swin(ctx,p,1,.05,.35)]})+countdown(ctx,p),
 // 6 答え：B
 [K+'pr1:ans']:(p,ctx)=>nansho()+pr1Bg(ctx.tg)+cards(PR1,{pick:1,ans:vseg(ctx,p,.3,.6)}),
 // 7 電気の力の揺れが空間を伝わる → 電子を押し引き
 [K+'fld:wave']:(p,ctx)=>{const t=cueT(p,ctx),b=swin(ctx,p,1,0,.3),e=fAt(500,t);
  let o=nansho()+fieldRow(t,{g:swin(ctx,p,0,0,.35)});
  o+=fade(swin(ctx,p,0,.3,.6),label('電子を 押す 向き',60,150,{size:40,color:EF,weight:700})+arrow(700,490,900,490,{color:C.dim,w:5,head:20})+label('進む 向き',700,540,{size:36,color:C.dim}));
  o+=fade(b,line(500,300,500,640,{color:C.faint,w:2,dash:'6 8'})+electron(500,700-60*e,16)+label('電子',560,715,{size:40,color:EL,weight:700}));
  o+=fade(swin(ctx,p,1,.55,.85),plate('押したり 引いたり',60,830,{size:42,color:HC}));
  o+=note('動きは ゆっくりに しています',40,900);
  return o;},
 // 8 アンテナ（金属）と自由な電子
 [K+'ant:zoom']:(p,ctx)=>{const t=cueT(p,ctx),a=swin(ctx,p,0,.3,.7),b=swin(ctx,p,1,.2,.6),x0=240-150*.75;
  let o=nansho()+phone(240,480,.75,{t});
  o+=fade(a,line(x0,330,x0,560,{color:HC,w:10})+label('アンテナ',240,760,{size:38,color:HC,anchor:'middle',weight:700}));
  o+=fade(a,line(x0,330,520,140,{color:C.dim,w:2,dash:'8 8'})+line(x0,560,520,760,{color:C.dim,w:2,dash:'8 8'})+rect(520,140,340,620,{fill:'#8a96aa',fo:.25,stroke:SILVER,sw:4,rx:18})+label('金属',690,200,{size:42,color:SILVER,anchor:'middle',weight:700}));
  if(b>0){let e='';for(let i=0;i<16;i++){const ex=580+(i%4)*75+14*Math.sin(t*1.7+i*1.3),ey=270+Math.floor(i/4)*120+14*Math.cos(t*1.3+i*2.1);e+=electron(ex,ey,14);}o+=fade(b,e);}
  o+=fade(swin(ctx,p,1,.5,.9),plate('自由に 動ける 電子',690,830,{size:40,color:EL,anchor:'middle'}));
  return o;},
 // 9 電気の力が向きを変えるたび、電子が行ったり来たり
 [K+'shk:ant']:(p,ctx)=>nansho()+shakeScene(ctx.tg,{arrows:vseg(ctx,p,0,.3),eg:vseg(ctx,p,.3,.6),lab:vseg(ctx,p,.6,.9)}),
 [K+'shk:fast']:(p,ctx)=>nansho()+shakeScene(ctx.tg,{lab:1,cnt:vseg(ctx,p,.3,.6)}),
 // 10 弱い電気 → 何百万倍に強めて揺れの形を読む
 [K+'amp:weak']:(p,ctx)=>nansho()+fade(vseg(ctx,p,0,.2),ampScene(ctx.tg,{big:0})),
 [K+'amp:big']:(p,ctx)=>nansho()+ampScene(ctx.tg,{big:vseg(ctx,p,.1,.7)}),
 // 11 送る側は逆
 [K+'snd:rev']:(p,ctx)=>{const b=vseg(ctx,p,.3,.8);
  return nansho()+rect(60,200,380,220,{fill:'#131f38',fo:.95,stroke:BLUE,sw:3,rx:20})+label('受け取る 側',250,270,{size:42,color:BLUE,anchor:'middle',weight:700})+label('電子が',250,330,{size:40,color:C.ink,anchor:'middle',weight:700})+label('揺さぶられる',250,385,{size:40,color:C.ink,anchor:'middle',weight:700})
   +fade(b,rect(500,200,380,220,{fill:'#131f38',fo:.95,stroke:GOLD,sw:3,rx:20})+label('送る 側',690,270,{size:42,color:GOLD,anchor:'middle',weight:700})+label('電子を',690,330,{size:40,color:C.ink,anchor:'middle',weight:700})+label('揺らす',690,385,{size:40,color:HC,anchor:'middle',weight:700})+label('逆',470,560,{size:72,color:HC,anchor:'middle',weight:700}));},
 [K+'snd:sat']:(p,ctx)=>nansho()+sendScene(cueT(p,ctx),{drive:vseg(ctx,p,.05,.25),cnt:vseg(ctx,p,.2,.4),waves:vseg(ctx,p,.5,.75)}),
 // 12 届いているのは揺さぶり：同じリズム
 [K+'sync:both']:(p,ctx)=>nansho()+syncScene(cueT(p,ctx),{g2:swin(ctx,p,0,0,.3),lab1:swin(ctx,p,0,.6,.95),lab2:swin(ctx,p,1,.5,.9)}),
 // 13 ヒントは 1957年
 [K+'hist:year']:(p,ctx)=>{const t=cueT(p,ctx),b=swin(ctx,p,1,.3,.7);
  return fade(1-b,phone(300,420,.55,{t})+radioArcs(560,120,Math.atan2(260-120,330-560),t,{L:260,sp:60,v:120,spread:22})+gpsSat(600,100,.8)+bigQ(650,500,swin(ctx,p,0,.2,.6),180))
   +fade(b,label('1957年',500,520,{size:110,color:HC,anchor:'middle',weight:700})+plate('ヒント',500,640,{size:44,color:C.ink,anchor:'middle'}));},
 // 14 スプートニク
 [K+'orb:launch']:(p,ctx)=>orbitScene(ctx,{year:1,ussr:vseg(ctx,p,0,.15),orbit:vseg(ctx,p,.15,.45),sp:vseg(ctx,p,.4,.6),first:vseg(ctx,p,.3,.5),name:vseg(ctx,p,.6,.8)}),
 [K+'orb:beep']:(p,ctx)=>orbitScene(ctx,{beep:vseg(ctx,p,.15,.3)}),
 // 15 録音：近づくと高く、遠ざかると低く（観測）
 [K+'pass:rec']:(p,ctx)=>{const t=cueT(p,ctx),T=voiceEnd(ctx);
  let o=passScene(t,T,{moving:1,graph:vseg(ctx,p,.3,.4),labels:1,tagG:vseg(ctx,p,.9,1)});
  o+=fade(vseg(ctx,p,0,.12)*(1-vseg(ctx,p,.3,.4)),plate('アメリカの 若い 研究者 二人',500,560,{size:40,color:PERSON,anchor:'middle'}));
  o+=fade(vseg(ctx,p,.15,.3),plate('録音',690,PS.gy-150,{size:40,color:C.ink}));
  return o;},
 [K+'amb:same']:(p,ctx)=>ambScene(cueT(p,ctx)+1.5)+fade(vseg(ctx,p,.3,.7),plate('救急車も 同じ',500,700,{size:44,color:C.ink,anchor:'middle'})),
 // 16 予想：切り替わる瞬間、衛星はどこ？
 [K+'pr2:a']:(p,ctx)=>pr2Bg()+cards(PR2,{show:[swin(ctx,p,1,.75,.88),0,0]}),
 [K+'pr2:b']:(p,ctx)=>pr2Bg()+cards(PR2,{show:[1,swin(ctx,p,0,.05,.3),swin(ctx,p,1,.05,.3)]})+countdown(ctx,p),
 [K+'pr2:ans']:(p,ctx)=>pr2Bg()+cards(PR2,{pick:1,ans:vseg(ctx,p,.25,.55)}),
 // 17 前で詰まり、後ろで伸びる。境目＝一番近い
 [K+'why:edge']:(p,ctx)=>{const t=cueT(p,ctx),T=sentWinEnd(ctx);
  return passScene(Math.min(t,T),T,{moving:1,graph:1,labels:1-swin(ctx,p,1,0,.1),sw:swin(ctx,p,1,.1,.4),near:swin(ctx,p,1,.4,.85)})+fade(swin(ctx,p,1,.6,.95),plate('境目 ＝ 一番 近い 瞬間',40,70,{size:42,color:HC}));},
 // 18 急なら近い：向きが短い間にくるっと変わる
 [K+'dir:near']:(p,ctx)=>dirRow(0,90,vseg(ctx,p,0,.95),{word:'急',fan:1}),
 [K+'dir:why']:(p,ctx)=>dirRow(0,90,vseg(ctx,p,.05,.95),{word:'急',fan:1})+fade(vseg(ctx,p,.6,.9),plate('あっという間に くるっと',60,520,{size:42,color:HC})),
 // 19 ゆっくりなら遠い → 記録から通り道が一本に（結果）
 [K+'dir:far']:(p,ctx)=>{const m=swin(ctx,p,1,0,.15);
  let o=fade(1-seg(m,0,.5),dirRow(0,90,1,{word:'急',fan:1})+dirRow(460,260,swin(ctx,p,0,0,.95),{word:'ゆっくり',col:'#7fb2ff',fan:1}));
  if(m>.5)o+=fade(seg(m,.5,1),recScene(ctx,p,{rec:[swin(ctx,p,1,.15,.4),swin(ctx,p,1,.4,.6),swin(ctx,p,1,.6,.8)],fin:swin(ctx,p,1,.8,1),tagG:swin(ctx,p,1,.85,1)}));
  return o;},
 // 20 逆はできないか → 逆転の発想
 [K+'rev:boss']:(p,ctx)=>revScene({base:vseg(ctx,p,0,.2),old:vseg(ctx,p,.05,.3),boss:vseg(ctx,p,.25,.55),bubble:vseg(ctx,p,.6,.9)}),
 [K+'rev:flip']:(p,ctx)=>revScene({boss:1-.6*swin(ctx,p,1,.8,1),bubble:1-swin(ctx,p,1,.8,1),ask:swin(ctx,p,0,0,.4),old:1-.6*swin(ctx,p,1,0,.3),oldLab:1-swin(ctx,p,1,0,.3),satLab:swin(ctx,p,1,.05,.3),neu:swin(ctx,p,1,.4,.7),meLab:swin(ctx,p,1,.6,.85),idea:swin(ctx,p,1,.85,1)}),
 // 21 今の GPS は届くまでの時間
 [K+'time:clock']:(p,ctx)=>timeScene(ctx,p,{lab:swin(ctx,p,1,.4,.8)})+fade(swin(ctx,p,0,.5,.9)*(1-swin(ctx,p,1,.3,.6)),plate('もっと 直接的な 方法',40,70,{size:40,color:C.ink})),
 // 22 雷：3秒 → 340 m × 3 ≈ 1 km
 [K+'thun:flash']:(p,ctx)=>{const b=swin(ctx,p,1,0,.04),c=3*swin(ctx,p,1,.05,.42),fl=b*(1-swin(ctx,p,1,.04,.15));
  let o=thunderScene({flash:fl,boltG:Math.max(fl,.6*b),count:c,rings:seg(c,0,.1)*(1-.5*swin(ctx,p,1,.55,.7)),arrive:seg(c,2.85,3)*(1-swin(ctx,p,1,.55,.7))});
  o+=tag('今の値',40,80,{g:swin(ctx,p,1,.45,.55),text:'音は 1秒に 約340 m'});
  o+=distBar(swin(ctx,p,1,.5,.8));
  o+=fade(swin(ctx,p,1,.7,.82),plate('340 m × 3 ＝ 1020 m',430,480,{size:48,color:HC,anchor:'middle'}));
  o+=fade(swin(ctx,p,1,.85,.98),plate('約 1 km',430,590,{size:60,color:HC,anchor:'middle'}));
  return o;},
 [K+'thun:rule']:(p,ctx)=>{const d=vseg(ctx,p,0,.2);
  let o=fade(1-.65*d,thunderScene({boltG:.6,count:3,rings:.5,showCount:1-d})+distBar(1)+plate('約 1 km',430,590,{size:60,color:HC,anchor:'middle',g:1-d}));
  o+=fade(vseg(ctx,p,.1,.4),rect(110,320,780,150,{fill:'#131f38',fo:.95,stroke:HC,sw:4,rx:20})+label('距離 ＝ 速さ × 時間',500,418,{size:60,color:HC,anchor:'middle',weight:700}));
  o+=tag('定義',500,560,{g:vseg(ctx,p,.5,.75),anchor:'middle',text:'速さ ＝ 1秒に 進む 距離'});
  return o;},
 // 23 予想：距離が一つ → どんな形？
 [K+'pr3:a']:(p,ctx)=>pr3Bg()+cards(PR3,{show:[swin(ctx,p,1,.88,1),0,0]}),
 [K+'pr3:b']:(p,ctx)=>pr3Bg()+cards(PR3,{show:[1,swin(ctx,p,0,0,.4),swin(ctx,p,1,0,.4)]})+countdown(ctx,p),
 [K+'pr3:ans']:(p,ctx)=>pr3Bg()+cards(PR3,{pick:2,ans:vseg(ctx,p,.3,.6)}),
 // 24 衛星を中心とした球の上のどこか
 [K+'sph:one']:(p,ctx)=>sphereScene({e:.5,s:[vseg(ctx,p,0,.25),0,0],probe:swin(ctx,p,0,.5,.8),radius:swin(ctx,p,0,.3,.6),t:ctx.tg})+fade(swin(ctx,p,1,.2,.6),plate('空間は 立体',40,70,{size:44,color:C.ink}))+note('大きさは 実際と ちがいます',40,900),
 // 25 二つの球の交わり＝円、三つで二点
 [K+'sph:two']:(p,ctx)=>sphereScene({e:.5,s:[1,swin(ctx,p,0,0,.3),swin(ctx,p,1,0,.35)],ring12:swin(ctx,p,0,.45,.9),pts:swin(ctx,p,1,.55,.85)})
   +fade(swin(ctx,p,0,.7,1)*(1-swin(ctx,p,1,0,.2)),plate('重なる所 ＝ 円',40,70,{size:44,color:HC}))+fade(swin(ctx,p,1,.7,1),plate('二つの 点',40,70,{size:44,color:HC}))+note('大きさは 実際と ちがいます',40,900),
 // 26 一つは宇宙の遠く、もう一つがあなたの場所
 [K+'sph:pick']:(p,ctx)=>sphereScene({e:mix(.5,1,vseg(ctx,p,.4,.7)),s:[1,1,1],ring12:1,pts:1,pick:vseg(ctx,p,.05,.75)})+note('大きさは 実際と ちがいます',40,900),
 // 27 大きな壁
 [K+'wall:big']:(p,ctx)=>wall(vseg(ctx,p,.2,.6))+fade(vseg(ctx,p,.3,.7),label('大きな 壁',500,240,{size:60,color:C.ink,anchor:'middle',weight:700})),
 [K+'next:fast']:(p,ctx)=>fastScene(ctx,{u:swin(ctx,p,1,.3,.75),arrive:swin(ctx,p,1,.72,.85),dist:swin(ctx,p,1,0,.3),form:swin(ctx,p,1,.85,1)})+fade(swin(ctx,p,0,.3,.7),plate('光と 同じ 速さ：1秒に 30万 km',40,130,{size:40,color:LIGHT})),
 // 28 100万分の1秒のまちがいで 300 m
 [K+'next:jump']:(p,ctx)=>{const t=cueT(p,ctx),B=BLUE_AT(500,440,1),j=vseg(ctx,p,.62,.8),N=[B[0]+80,B[1]-120];
  let o=phone(500,440,1,{t,blue:0});
  o+=fade(j,ring(B[0],B[1],20,{color:BLUE,w:3,dash:'6 6'}));
  o+=draw([B,N],j,{color:HC,w:4,dash:'10 8'});
  const q=[mix(B[0],N[0],j),mix(B[1],N[1],j)];o+=dot(q[0],q[1],20,'#ffffff')+dot(q[0],q[1],15,BLUE);
  o+=fade(seg(j,.6,1),plate('300 m',N[0]+30,N[1]+10,{size:48,color:HC}));
  o+=fade(vseg(ctx,p,.1,.35),watch(180,180,70,t*.7%1)+plate('100万分の1秒',180,330,{size:40,color:TIME,anchor:'middle'})+label('の まちがい',180,380,{size:38,color:TIME,anchor:'middle',weight:700}));
  return o;},
 // 29 0.07 秒を 100万分の1秒より細かく測れる？
 [K+'next:q']:(p,ctx)=>{const t=cueT(p,ctx),u=(t%1.6)/1.6;
  let o=fade(.45,fastScene(ctx,{u:clamp(u/.7),arrive:1,dist:1,form:0,noteG:0}));
  o+=watch(220,720,90,t*.9%1,{g:vseg(ctx,p,.15,.4)});
  o+=fade(vseg(ctx,p,.3,.5),label('？',350,740,{size:64,color:HC,anchor:'middle',weight:700}));
  o+=finalCard(['0.07秒の 一瞬を','100万分の1秒より 細かく','測れる？'],vseg(ctx,p,.55,.85),{y:16,size:56});
  return o;},
};

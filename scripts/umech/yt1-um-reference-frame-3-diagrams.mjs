// YouTube シリーズ 慣性力と軌道・中級 3/3（ステージ um-reference-frame 本4・本5）— 図。Stage 1200×515.
// 色：距離 r・R・h 水色、速度 v 紫、加速度 a・g 赤、力 F 緑、時間 T 金、ω 桃、G 黄。地球 青、月 灰。
// 左右2列の検算：左＝逆2乗で薄める 9.8÷60²、右＝月の円運動 4π²r/T²。
import {C,clamp,mix,seg,fmt,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,axes} from './anim.mjs';

const K='um-reference-frame-3:';
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
const col=(c,s)=>`{\\color{${c}}${s}}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const EARTH='#4d8fe0',MOON='#c8ccd6',APPLE='#e05a5a';
const aa=col(C.a,'a'),gg=col(C.a,'g'),rr=col(C.x,'r'),RR=col(C.x,'R'),hh=col(C.x,'h'),vv=col(C.v,'v'),om=col(C.p,'\\omega'),TT=col(C.t,'T'),GG=col(C.hi,'G');
const earth=(x,y,r,lab=1)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${EARTH}" fill-opacity=".55" stroke="${EARTH}" stroke-width="3"/>`+(lab&&r>=30?label('地球',x,y+9,{size:24,color:C.ink,anchor:'middle'}):'');
function dashArrow(x,y,X,Y,{color=C.F,w=5,g=1,head=18}={}){
 if(g<=0)return '';const XX=mix(x,X,g),YY=mix(y,Y,g),L=Math.hypot(XX-x,YY-y);if(L<2)return '';
 const a=Math.atan2(YY-y,XX-x),h=Math.min(head,L*.6),bx=XX-h*Math.cos(a),by=YY-h*Math.sin(a);
 return line(x,y,bx,by,{color,w,dash:'10 8',cap:'butt'})+`<polygon points="${XX},${YY} ${bx+h*.5*Math.sin(a)},${by-h*.5*Math.cos(a)} ${bx-h*.5*Math.sin(a)},${by+h*.5*Math.cos(a)}" fill="none" stroke="${color}" stroke-width="3"/>`;
}
function person(x,yf,h=70,{color=C.hi}={}){
 const hy=yf-h+10;
 return ring(x,hy,h*.12,{color,w:3,fill:C.bg})+line(x,hy+h*.12,x,yf-h*.32,{color,w:4})+line(x,yf-h*.32,x-h*.14,yf,{color,w:4})+line(x,yf-h*.32,x+h*.14,yf,{color,w:4})
  +line(x,yf-h*.55,x-h*.2,yf-h*.37,{color,w:3.5})+line(x,yf-h*.55,x+h*.2,yf-h*.37,{color,w:3.5});
}
// top strip: earth and moon at 60R, to scale in distance
function strip({g=1,hi=0}={}){
 const ex=80,ey=95,sc=17;
 let s=earth(ex,ey,sc,0)+line(ex+sc,ey,ex+60*sc,ey,{color:C.faint,w:2,dash:'6 6'})+dot(ex+60*sc,ey,9,MOON)+label('月',ex+60*sc+16,ey+8,{size:24,color:MOON});
 s+=label('地球',ex,ey+50,{size:22,color:C.ink,anchor:'middle'});
 s+=fade(hi,arrow(ex,ey+28,ex+60*sc,ey+28,{color:C.x,w:3,head:12})+label('中心から 約 60R',ex+30*sc,ey+60,{size:24,color:C.x,anchor:'middle',weight:700}));
 s+=label('距離は縮尺どおり',1180,40,{size:22,color:C.dim,anchor:'end'});
 return fade(g,s);
}
const LROW=[
 ()=>T(`${aa}=\\dfrac{${GG}M}{${rr}^2}`,315,268,{size:34}),
 ()=>label('地表 r ＝ R：',70,340,{size:24,color:C.dim})+T(`${gg}\\approx9.8\\ \\mathrm{m/s^2}`,390,334,{size:34}),
 ()=>label('r ＝ 60R：',70,398,{size:24,color:C.dim})+T(`\\div60^2=\\div3600`,380,392,{size:34}),
 ()=>T(`9.8\\div3600\\approx${col(C.a,'0.00272')}`,315,455,{size:38}),
];
const RROW=[
 ()=>T(`${rr}\\approx60\\times6370\\ \\mathrm{km}\\approx3.82\\times10^8\\ \\mathrm{m}`,885,255,{size:30}),
 ()=>T(`${TT}=27.3\\ \\text{日}\\approx2.36\\times10^6\\ \\mathrm{s}`.replace('\\text{日}','\\,\\mathrm{d}'),885,318,{size:30}),
 ()=>T(`${aa}=${rr}${om}^2=\\dfrac{4\\pi^2${rr}}{${TT}^2}`,885,388,{size:34}),
 ()=>T(`\\approx${col(C.a,'0.00271')}`,885,458,{size:38}),
];
function cols(p,nL,nR,{newL=-1,newR=-1,hiL=0,hiR=0,strHi=0}={}){
 let s=strip({hi:strHi});
 s+=rect(30,170,560,330,{fill:'#131f38',fo:.96,stroke:C.x,sw:2,rx:14})+label('左：重力の式から 予想',310,205,{size:26,color:C.x,anchor:'middle',weight:700});
 s+=rect(610,170,560,330,{fill:'#131f38',fo:.96,stroke:C.hi,sw:2,rx:14})+label('右：月の動きから 求める',890,205,{size:26,color:C.hi,anchor:'middle',weight:700});
 for(let i=0;i<nL;i++)s+=fade(i===newL?seg(p,.1,.35):1,LROW[i]());
 for(let i=0;i<nR;i++)s+=fade(i===newR?seg(p,.1,.35):1,RROW[i]());
 {const w=texWidth(`9.8\\div3600\\approx0.00272`,38,false);if(hiL)s+=highlight(315-w/2-14,420,w+28,64,hiL,C.a);}
 {const w=texWidth(`\\approx0.00271`,38,false);if(hiR)s+=highlight(885-w/2-14,425,w+28,64,hiR,C.a);}
 return s;
}

export const ytReferenceFrameM3Diagrams={
 [K+'recap']:(p)=>{
  let s=card(140,60,920,400,label('前回',600,115,{size:26,color:C.dim,anchor:'middle'})
   +T(`${aa}=\\dfrac{${vv}^2}{${rr}}=${rr}${om}^2`,600,210,{size:56})
   +fade(seg(p,.5,.7),label('回る台の上：遠心力 mrω²（慣性力）',600,350,{size:28,color:C.F,anchor:'middle'})),seg(p,0,.12));
  return s;
 },
 [K+'lastq']:(p)=>{
  let s=line(80,470,420,470,{color:C.dim,w:3})+line(170,470,170,320,{color:'#8a6a4a',w:10})+`<circle cx="170" cy="280" r="75" fill="#2f6b45" fill-opacity=".6"/>`;
  s+=dot(215,320+130*seg(p,.1,.5),13,APPLE)+label('リンゴ',250,350,{size:24,color:APPLE});
  s+=earth(760,300,70)+ring(760,300,180,{color:C.faint,w:2,dash:'8 8'});
  const th=.8+p*.8,mx=760+180*Math.cos(th),my=300-180*Math.sin(th);
  s+=dot(mx,my,14,MOON)+label('月',mx+20,my-14,{size:24,color:MOON});
  s+=fade(seg(p,.3,.5),arrow(mx,my,mx+(760-mx)*.4,my+(300-my)*.4,{color:C.F,w:5}));
  s+=fade(seg(p,.4,.6),label('同じ力？',600,80,{size:40,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'recap2']:(p)=>{
  const ex=230,ey=280,Rp=80,mx=ex+330;
  let s=earth(ex,ey,Rp)+dot(ex,ey,5,C.ink)+dot(mx,ey,12,MOON);
  s+=arrow(ex,ey+130,mx,ey+130,{color:C.x,w:3,head:12})+line(ex,ey,ex,ey+140,{color:C.x,w:2,dash:'5 5'})+line(mx,ey,mx,ey+140,{color:C.x,w:2,dash:'5 5'})+label('r：中心から',(ex+mx)/2,ey+165,{size:24,color:C.x,anchor:'middle'});
  s+=card(640,70,520,380,label('初級',900,120,{size:24,color:C.dim,anchor:'middle'})
   +T(`${col(C.F,'F')}=${GG}\\dfrac{Mm}{${rr}^2}`,900,215,{size:50})
   +fade(seg(p,.5,.7),label('距離 2倍 → 4分の1',900,340,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'ask']:(p)=>{
  let s=card(160,60,880,400,label('今回の問い',600,120,{size:26,color:C.dim,anchor:'middle'})
   +label('月は 本当に 落ちているのか？',600,220,{size:40,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.4,.6),label('ニュートンの検算を 数でたどる',600,330,{size:30,color:C.ink,anchor:'middle'})),seg(p,0,.12),C.hi);
  return s;
 },
 [K+'plan']:(p)=>cols(p,0,0),
 [K+'g']:(p)=>cols(p,2,0,{newL:1})+fade(1-seg(p,.05,.2),''),
 [K+'ratio']:(p)=>cols(p,3,0,{newL:2,strHi:seg(p,.05,.3)}),
 [K+'left']:(p)=>cols(p,4,0,{newL:3,strHi:1,hiL:seg(p,.5,.7)}),
 [K+'orbit']:(p)=>cols(p,4,1,{newR:0,hiL:1}),
 [K+'period']:(p)=>cols(p,4,2,{newR:1,hiL:1}),
 [K+'omega']:(p)=>cols(p,4,3,{newR:2,hiL:1}),
 [K+'calc']:(p)=>cols(p,4,4,{newR:3,hiL:1,hiR:seg(p,.5,.7)}),
 [K+'match']:(p)=>{
  let s=cols(p,4,4,{hiL:1,hiR:1});
  s+=fade(seg(p,.2,.4),rect(450,112,300,54,{fill:'#131f38',fo:.96,stroke:C.F,sw:3,rx:12})+label('左 ≈ 右：ほぼ一致',600,149,{size:28,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'meaning']:(p)=>{
  let s=line(80,470,360,470,{color:C.dim,w:3})+line(150,470,150,330,{color:'#8a6a4a',w:10})+`<circle cx="150" cy="290" r="70" fill="#2f6b45" fill-opacity=".6"/>`+dot(195,420,13,APPLE);
  s+=earth(560,290,60)+ring(560,290,170,{color:C.faint,w:2,dash:'8 8'})+dot(560+170*Math.cos(1),290-170*Math.sin(1),13,MOON);
  s+=arrow(195,390,195,440,{color:C.F,w:5})+arrow(560+160*Math.cos(1),290-160*Math.sin(1),560+95*Math.cos(1),290-95*Math.sin(1),{color:C.F,w:5});
  s+=card(780,90,390,330,label('同じ 地球の重力',975,150,{size:30,color:C.F,anchor:'middle',weight:700})
   +fade(seg(p,.3,.5),T(`\\propto\\dfrac{1}{${rr}^2}`,975,250,{size:48}))
   +fade(seg(p,.5,.7),label('距離の2乗で 弱まる',975,360,{size:28,color:C.ink,anchor:'middle'})),seg(p,.05,.2));
  return s;
 },
 [K+'honest']:(p)=>{
  let s=card(120,60,960,400,label('少しのずれ：60倍は 丸めた値',600,140,{size:30,color:C.ink,anchor:'middle'})
   +fade(seg(p,.4,.6),label('この一致は 逆2乗の法則を 支える',600,260,{size:30,color:C.ink,anchor:'middle'})+label('観測の 証拠の一つ',600,320,{size:34,color:C.hi,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.8),label('（F＝GMm/r² は 観測に支えられた法則）',600,410,{size:24,color:C.dim,anchor:'middle'})),seg(p,0,.12));
  return s;
 },
 [K+'falling']:(p)=>orbitZoom(p,0),
 [K+'speed']:(p)=>orbitZoom(p,1),
 [K+'onesec']:(p)=>orbitZoom(p,2),
 [K+'curve']:(p)=>orbitZoom(p,3),
 [K+'cannon']:(p)=>cannonPic(p,0),
 [K+'cannon2']:(p)=>cannonPic(p,1),
 [K+'rh']:(p)=>rhPic(p,0),
 [K+'rh2']:(p)=>rhPic(p,1),
 [K+'ratio2']:(p)=>{
  let s=card(100,40,1000,440,
   T(`${gg}=\\dfrac{${GG}M}{${RR}^2}`,330,120,{size:42})+label('→',560,128,{size:34,color:C.dim,anchor:'middle'})+T(`${GG}M=${gg}${RR}^2`,800,120,{size:42})
   +fade(seg(p,.3,.5),T(`${gg}(${hh})=\\dfrac{${GG}M}{(${RR}+${hh})^2}=${gg}\\times\\left(\\dfrac{${RR}}{${RR}+${hh}}\\right)^2`,600,270,{size:44}))
   +fade(seg(p,.65,.85),label('地表の g × 半径の比の2乗',600,410,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.1));
  return s;
 },
 [K+'iss']:(p)=>issPic(p,0),
 [K+'iss2']:(p)=>issPic(p,1),
 [K+'float']:(p)=>{
  const cx=330,cy=250;
  let s=rect(cx-170,cy-90,340,180,{fill:'#141d33',fo:1,stroke:C.dim,sw:3,rx:20})+label('ステーション',cx,cy-110,{size:24,color:C.dim,anchor:'middle'});
  const bob=6*Math.sin(p*8);
  s+=person(cx-40,cy+40+bob,80,{color:C.hi});
  s+=arrow(cx+200,cy-30,cx+200,cy+60,{color:C.a,w:5})+label('8.7 m/s²',cx+212,cy+30,{size:22,color:C.a});
  s+=arrow(cx-40,cy+60+bob,cx-40,cy+140,{color:C.a,w:5})+label('8.7 m/s²',cx-28,cy+130,{size:22,color:C.a});
  s+=label('↓ 地球の向き',cx,490,{size:24,color:C.dim,anchor:'middle'});
  s+=card(620,90,540,330,label('人も ステーションも',890,150,{size:28,color:C.ink,anchor:'middle'})+label('同じ加速度で 一緒に落ちる',890,210,{size:30,color:C.a,anchor:'middle',weight:700})
   +fade(seg(p,.35,.55),label('→ 床が押さない → 浮く',890,290,{size:28,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.6,.8),label('g ＝ 0 ではない',890,370,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,.1,.25));
  return s;
 },
 [K+'graph']:(p)=>graphPic(p,0),
 [K+'near']:(p)=>graphPic(p,1),
 [K+'sum1']:(p)=>summary(p,1),
 [K+'sum2']:(p)=>summary(p,2),
 [K+'close']:(p)=>{
  const path=Array.from({length:41},(_,i)=>{const u=i/40;return [120+560*u,420-260*u+80*Math.sin(u*Math.PI*1.3)];});
  let s=draw(path,1,{color:C.dim,w:3,dash:'8 8'});
  for(let k=0;k<8;k++){const g=seg(p,.1+k*.06,.18+k*.06);if(g<=0)continue;const a=path[k*5],b=path[k*5+5];s+=fade(g,arrow(a[0],a[1],b[0],b[1],{color:C.E,w:4,head:12}));}
  s+=label('力学：道に沿って 小さな仕事を 足す',400,480,{size:26,color:C.E,anchor:'middle'});
  s+=card(760,140,400,220,label('力学は',960,200,{size:28,color:C.dim,anchor:'middle'})+label('ひと区切り',960,270,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'next']:(p)=>{
  let s='';
  for(let j=0;j<5;j++)for(let i=0;i<5;i++){const x=70+i*110,y=90+j*85;s+=arrow(x,y,x+60,y,{color:C.x,w:3,head:12});}
  s+=label('電場 𝐄',20,40,{size:26,color:C.x});
  const path=Array.from({length:41},(_,i)=>{const u=i/40;return [110+400*u,420-280*u+90*Math.sin(u*Math.PI*1.3)];});
  s+=draw(path,seg(p,.1,.5),{color:C.hi,w:4,dash:'8 8'});
  const k=Math.round(40*seg(p,.1,.5)),[qx,qy]=path[k];
  s+=ring(qx,qy,16,{color:C.hi,w:3,fill:C.bg})+label('+',qx,qy+9,{size:26,color:C.hi,anchor:'middle',weight:700});
  s+=card(660,130,500,260,label('次の問い',910,180,{size:26,color:C.dim,anchor:'middle'})+label('電場の中の 仕事の足し算を',910,245,{size:28,color:C.ink,anchor:'middle'})
   +label('式で 正式に書くと？',910,315,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.5),C.hi);
  return s;
 },
};

function orbitZoom(p,k){
 const cx=250,cy=700,R=560,mx=cx,my=cy-R;
 let s=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${C.faint}" stroke-width="3" stroke-dasharray="8 8"/>`;
 s+=`<circle cx="${cx}" cy="${cy}" r="200" fill="${EARTH}" fill-opacity=".45" stroke="${EARTH}" stroke-width="3"/>`+label('地球（中心は 画面の下）',cx,505,{size:22,color:C.ink,anchor:'middle'});
 s+=dot(mx,my,14,MOON)+label('月',mx-30,my-12,{size:24,color:MOON,anchor:'end'});
 s+=label('誇張した図',20,40,{size:22,color:C.dim});
 s+=arrow(mx,my+18,mx,my+90,{color:C.a,w:5})+label('0.0027 m/s²',mx+12,my+80,{size:22,color:C.a});
 let c='';
 if(k===0)c=label('地球の向きに',925,170,{size:28,color:C.ink,anchor:'middle'})+label('加速し続ける',925,230,{size:30,color:C.a,anchor:'middle',weight:700})+fade(seg(p,.5,.7),label('＝ 落ち続けている',925,310,{size:32,color:C.hi,anchor:'middle',weight:700}));
 if(k>=1){s+=arrow(mx+16,my,mx+140,my,{color:C.v,w:6})+label('v',mx+150,my+8,{size:28,color:C.v,weight:700});}
 if(k===1)c=T(`${vv}=${rr}${om}\\approx1\\ \\mathrm{km/s}`,925,200,{size:40})+fade(seg(p,.4,.6),label('横に 速い',925,300,{size:32,color:C.v,anchor:'middle',weight:700}));
 if(k>=2){const d=300*(k===2?seg(p,.1,.5):1),th=Math.asin(d/R),yc=cy-R*Math.cos(th);
  s+=line(mx,my,mx+320,my,{color:C.v,w:2.5,dash:'7 6'});
  s+=dot(mx+d,yc,10,MOON);
  s+=fade(k===2?seg(p,.5,.7):1,line(mx+300,my,mx+300,cy-Math.sqrt(R*R-300*300),{color:C.hi,w:4})+label('落ちる 約 1.4 mm',mx+312,my+40,{size:22,color:C.hi})+label('横へ 約 1 km',mx+150,my-16,{size:22,color:C.v,anchor:'middle'}));
 }
 if(k===2)c=label('1秒あたり',925,150,{size:26,color:C.dim,anchor:'middle'})+label('横へ 約 1 km',925,210,{size:30,color:C.v,anchor:'middle'})+label('まっすぐな線から',925,270,{size:26,color:C.ink,anchor:'middle'})+label('約 1.4 mm 落ちる',925,325,{size:30,color:C.hi,anchor:'middle',weight:700})+fade(seg(p,.6,.8),T(`\\tfrac12\\times0.00271\\times1^2`,925,390,{size:30}));
 if(k===3){const n=Math.floor(6*seg(p,.1,.7));for(let i=1;i<=n;i++){const a=i*.1;s+=dot(cx+R*Math.sin(a),cy-R*Math.cos(a),8,MOON);}
  c=label('落ちた分 ＝ 円の曲がり',925,190,{size:30,color:C.hi,anchor:'middle',weight:700})+fade(seg(p,.4,.6),label('距離を保ったまま 回り続ける',925,270,{size:28,color:C.ink,anchor:'middle'}));}
 s+=card(700,90,450,330,c,1);
 return s;
}
function cannonPic(p,k){
 const cx=380,cy=440,Re=170,r0=200;
 let s=earth(cx,cy,Re)+`<polygon points="${cx-30},${cy-Re+6} ${cx},${cy-r0} ${cx+30},${cy-Re+6}" fill="#6b5a45"/>`;
 s+=label('ニュートンの大砲',20,40,{size:24,color:C.dim});
 const speeds=[.55,.75,.9,1];
 speeds.forEach((f,i)=>{const g=seg(p,.05+i*.15,.25+i*.15);if(g<=0)return;
  let x=0,y=r0,vx=Math.sqrt(1/r0)*f,vy=0,pts=[[cx,cy-r0]];const GM=1,dt=2;
  for(let n=0;n<3000;n++){const rr2=Math.hypot(x,y),a=-GM/(rr2*rr2*rr2);vx+=a*x*dt;vy+=a*y*dt;x+=vx*dt;y+=vy*dt;pts.push([cx+x,cy-y]);if(Math.hypot(x,y)<Re||Math.atan2(x,y)<-.02&&n>50)break;}
  s+=draw(pts,g,{color:i===3?C.hi:C.v,w:3.5});});
 s+=card(660,100,500,300,k?T(`\\dfrac{${vv}^2}{${RR}}=${gg}`,910,170,{size:42})+fade(seg(p,.3,.5),T(`${vv}=\\sqrt{${gg}${RR}}=\\sqrt{9.8\\times6.37\\times10^6}`,910,265,{size:32}))+fade(seg(p,.6,.8),T(`\\approx7.9\\ \\mathrm{km/s}`,910,350,{size:44,color:C.v}))
  :label('速いほど 遠くに落ちる',910,180,{size:28,color:C.v,anchor:'middle'})+fade(seg(p,.6,.8),label('十分速いと 一周',910,260,{size:32,color:C.hi,anchor:'middle',weight:700})+label('（地球の丸みに沿う）',910,320,{size:24,color:C.dim,anchor:'middle'})),k?1:seg(p,.3,.45));
 return s;
}
function rhPic(p,k){
 const ex=260,ey=330,Re=160,a=Math.PI/4,sx=ex+Re*Math.cos(a),sy=ey-Re*Math.sin(a),H=90,px=ex+(Re+H)*Math.cos(a),py=ey-(Re+H)*Math.sin(a);
 let s=earth(ex,ey,Re)+dot(ex,ey,5,C.ink)+dot(px,py,10,C.hi);
 const off=[Math.sin(a)*22,Math.cos(a)*22];
 s+=line(ex+off[0],ey+off[1],sx+off[0],sy+off[1],{color:C.x,w:4})+label('R',(ex+sx)/2+off[0]+14,(ey+sy)/2+off[1]+18,{size:28,color:C.x,weight:700});
 s+=line(sx+off[0],sy+off[1],px+off[0],py+off[1],{color:C.hi,w:4})+label('h',(sx+px)/2+off[0]+16,(sy+py)/2+off[1]+14,{size:28,color:C.hi,weight:700});
 s+=fade(k?1:seg(p,.2,.4),line(ex-off[0],ey-off[1],px-off[0],py-off[1],{color:C.x,w:3,dash:'8 6'})+label('r',(ex+px)/2-off[0]-22,(ey+py)/2-off[1]-6,{size:28,color:C.x,weight:700}));
 let c;
 if(!k)c=label('r：中心からの距離',890,180,{size:30,color:C.x,anchor:'middle'})+fade(seg(p,.5,.7),label('h：地面からの高さ',890,260,{size:30,color:C.hi,anchor:'middle'})+label('r と h を 混同しない',890,340,{size:30,color:C.a,anchor:'middle',weight:700}));
 else c=T(`${rr}=${RR}+${hh}`,890,170,{size:48})+fade(seg(p,.35,.55),T(`${gg}(${hh})=\\dfrac{${GG}M}{(${RR}+${hh})^2}`,890,290,{size:44}));
 s+=card(640,90,500,330,c,k?1:seg(p,.05,.2));
 return s;
}
function issPic(p,k){
 const ex=250,ey=265,Re=170,Rs=Re*6770/6370;
 let s=earth(ex,ey,Re)+ring(ex,ey,Rs,{color:C.hi,w:2,dash:'5 5'});
 const a=1.2,ix=ex+Rs*Math.cos(a),iy=ey-Rs*Math.sin(a);s+=rect(ix-9,iy-5,18,10,{fill:C.hi,fo:1,rx:2})+label('宇宙ステーション',ix+16,iy-10,{size:22,color:C.hi});
 s+=label('縮尺どおり：高さ 400 km は 半径に比べて 小さい',20,500,{size:22,color:C.dim});
 let c;
 if(!k)c=label('R ＝ 6370 km、h ＝ 400 km',890,140,{size:26,color:C.x,anchor:'middle'})+fade(seg(p,.3,.5),T(`${rr}=6770\\ \\mathrm{km}`,890,215,{size:40}))+fade(seg(p,.6,.8),T(`\\dfrac{6370}{6770}\\approx0.941`,890,330,{size:44}));
 else c=T(`0.941^2\\approx0.885`,890,150,{size:40})+fade(seg(p,.15,.35),T(`9.8\\times0.885\\approx8.7\\ \\mathrm{m/s^2}`,890,240,{size:38,color:C.a}))+fade(seg(p,.5,.7),label('地表の 約9割',890,330,{size:32,color:C.hi,anchor:'middle',weight:700})+label('ほとんど 弱まっていない',890,385,{size:26,color:C.ink,anchor:'middle'}));
 s+=card(640,70,500,370,c,k?1:seg(p,.05,.2));
 return s;
}
function graphPic(p,k){
 const A=axes({x:110,y:440,w:620,h:340,xmin:0,xmax:62,ymin:0,ymax:10.5,xticks:[1,10,20,30,40,50,60],yticks:[2,4,6,8,10],g:1});
 let s=A.svg+label('中心からの距離 r（R の何倍か）',420,500,{size:22,color:C.x,anchor:'middle'})+label('重力加速度 [m/s²]',60,80,{size:22,color:C.a});
 s+=A.plot(x=>9.8/(x*x),{p:seg(p,.05,.4),color:C.a,w:4,from:1,to:62});
 s+=fade(seg(p,.3,.45),dot(A.X(1),A.Y(9.8),8,C.hi)+label('地表 9.8',A.X(1)+14,A.Y(9.8)-6,{size:22,color:C.hi}));
 s+=fade(seg(p,.5,.65),dot(A.X(60),A.Y(.0027),8,MOON)+label('月の距離 0.0027',A.X(60)-10,A.Y(.0027)-18,{size:22,color:MOON,anchor:'end'}));
 // inset near the surface
 const ix=790,iy=70,iw=370,ih=300;
 let q=rect(ix,iy,iw,ih,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:12})+label('地表の近くを 拡大',ix+iw/2,iy+32,{size:22,color:C.dim,anchor:'middle'});
 const X=h=>ix+40+(iw-70)*h/800,Y=g=>iy+ih-40-(ih-100)*(g-6)/4;
 q+=line(ix+40,iy+ih-40,ix+iw-20,iy+ih-40,{color:C.dim,w:2})+line(ix+40,iy+ih-40,ix+40,iy+60,{color:C.dim,w:2});
 q+=draw(Array.from({length:41},(_,i)=>{const h=800*i/40;return [X(h),Y(9.8*Math.pow(6370/(6370+h),2))];}),1,{color:C.a,w:3});
 q+=dot(X(0),Y(9.8),6,C.hi)+label('9.8',X(0)+10,Y(9.8)-8,{size:22,color:C.hi});
 q+=dot(X(400),Y(8.68),7,C.hi)+label('400 km：8.7',X(400)+10,Y(8.68)-10,{size:22,color:C.hi});
 q+=label('高さ h [km] 0〜800',ix+iw/2,iy+ih-10,{size:22,color:C.x,anchor:'middle'});
 s+=fade(seg(p,.65,.85),q);
 if(k){s+=highlight(A.X(0.2),A.Y(10.3),A.X(2)-A.X(0.2),A.Y(8)-A.Y(10.3),seg(p,.1,.3),C.F)+fade(seg(p,.1,.3),label('地表近く：ほぼ一定',A.X(2.5),A.Y(8.6),{size:24,color:C.F}));
  s+=fade(seg(p,.5,.7),label('月の距離で 9.8 を使う ✕',A.X(58),A.Y(2),{size:26,color:C.a,anchor:'end',weight:700}));}
 return s;
}
function summary(p,k){
 let s=rect(100,50,1000,420,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:14});
 const L=[
  ()=>T(`9.8\\div60^2\\approx0.00272`,370,135,{size:36})+label('≈',600,142,{size:34,color:C.F,anchor:'middle'})+T(`${rr}${om}^2\\approx0.00271`,830,135,{size:36})
   +label('リンゴと月は 同じ重力（逆2乗）',600,215,{size:30,color:C.hi,anchor:'middle',weight:700}),
  ()=>label('月は 落ち続けている（横に速いので 近づかない）',150,290,{size:28,color:C.ink})+label('r は 中心から：',150,402,{size:28,color:C.x})+T(`${gg}(${hh})=\\dfrac{${GG}M}{(${RR}+${hh})^2}`,700,395,{size:40}),
 ];
 for(let i=0;i<k;i++)s+=fade(i===k-1?seg(p,.02,.18):1,L[i]());
 return s;
}

// 深掘りショート 09（ys-deep-09）「速く動く時計は、なぜ遅れる？」— 図。縦長の舞台 1000×920（vert-v1）。
// 共通の形は yt1-sp-deep-common.mjs。値の検算は台本 docs/video-revision-20260924/ytseries/sp-deep-09.mjs の冒頭。
// このファイルの中で描く部品（他の回の図ファイルには頼らない）：地球（01 と同じ青と緑）、GPS 衛星（金の胴と青い太陽電池板）、
//   針の時計（金の針）、電車、人（顔は描かない棒の形）、旅客機、光の時計（2枚の鏡と光の点）。
// 色：光 LIGHT、遅れ 青 SLOW（下向き・−）、進み 赤 FAST（上向き・＋）、電車の速さ 紫 C.v、ボールの速さ 水色 C.x、強調 黄。
// 光の時計：鏡の間 L、光の速さ c（px/秒）、片道 L/c＝1 秒。電車の速さ 0.6c（大きく誇張）→ ホームから見た片道 1.25 秒、横に 0.6c×1.25＝0.75L。
import {C,seg,clamp,mix,fade,label,line,rect,dot,ring,draw,arrow,poly,scaleAt,smooth,tex} from './anim.mjs';
import {W,H,HC,LIGHT,cueT,voiceEnd,vseg,swin,tag,note,plate,bigQ,finalCard} from './yt1-sp-deep-common.mjs';

const K='deep09-';
const SLOW='#6f9dff',FAST=C.a,SATG='#e0b44a',PANEL='#3f6fd8',MIR='#c9d6ea',CARD='#131f38';
const n1=v=>Number(v.toFixed(1));
const tv=(ctx,p)=>cueT(p,ctx)/voiceEnd(ctx);
const tg0=(p,ctx)=>(ctx&&typeof ctx.tg==='number')?ctx.tg:cueT(p,ctx);

// ================= 部品 =================
function earth(cx,cy,r){
 let s=dot(cx,cy,r,'#2f6fd8')+`<path d="M${n1(cx-r*.55)} ${n1(cy-r*.35)} q${n1(r*.3)} ${n1(-r*.3)} ${n1(r*.6)} ${n1(-r*.05)} q${n1(r*.1)} ${n1(r*.3)} ${n1(-r*.15)} ${n1(r*.5)} q${n1(-r*.3)} ${n1(r*.1)} ${n1(-r*.45)} ${n1(-r*.45)}Z" fill="#3fae6a"/>`+`<path d="M${n1(cx+r*.15)} ${n1(cy+r*.1)} q${n1(r*.4)} ${n1(-r*.2)} ${n1(r*.6)} ${n1(r*.15)} q${n1(-r*.05)} ${n1(r*.4)} ${n1(-r*.35)} ${n1(r*.45)} q${n1(-r*.3)} ${n1(-r*.2)} ${n1(-r*.25)} ${n1(-r*.6)}Z" fill="#3fae6a"/>`;
 return s+ring(cx,cy,r,{color:'#7fb2ff',w:3});
}
// GPS 衛星：金の胴と青い太陽電池板（s＝1 で幅 約 200）
function satellite(x,y,s=1){
 const pw=70*s,ph=32*s,bw=40*s,bh=46*s;
 let q=line(x-bw/2-pw-6*s,y,x+bw/2+pw+6*s,y,{color:C.dim,w:3});
 for(const sg of [-1,1]){const px=sg<0?x-bw/2-pw-8*s:x+bw/2+8*s;
  q+=rect(px,y-ph/2,pw,ph,{fill:PANEL,fo:.95,stroke:'#9cc0ff',sw:2,rx:3});
  for(let i=1;i<3;i++)q+=line(px+pw*i/3,y-ph/2,px+pw*i/3,y+ph/2,{color:'#9cc0ff',w:1.5});}
 q+=rect(x-bw/2,y-bh/2,bw,bh,{fill:SATG,fo:1,stroke:'#ffe08a',sw:2,rx:4});
 return q;
}
// 針の時計。turns＝針の回った数
function clock(x,y,R,{turns=0,name='',col=C.ink,hand=C.t,nameSize=38}={}){
 let s=ring(x,y,R,{color:col,w:5,fill:'#16223b'});
 for(let i=0;i<12;i++){const a=i*Math.PI/6;s+=line(x+R*.8*Math.sin(a),y-R*.8*Math.cos(a),x+R*.94*Math.sin(a),y-R*.94*Math.cos(a),{color:C.dim,w:i%3?2:5});}
 const a=turns*2*Math.PI;
 s+=line(x,y,x+R*.74*Math.sin(a),y-R*.74*Math.cos(a),{color:hand,w:Math.max(4,R*.05)})+dot(x,y,Math.max(6,R*.06),hand);
 if(name)s+=label(name,x,y+R+nameSize+12,{size:nameSize,color:col,anchor:'middle',weight:700});
 return s;
}
// 人（棒の形、顔は描かない）。足元 (x,y)、lean＝前かがみ（走る）
function person(x,y,{s=1,col='#c4cde0',lean=0,run=0}={}){
 const hx=x+lean*14*s;
 let q=dot(hx,y-78*s,13*s,col)+line(hx,y-64*s,x,y-32*s,{color:col,w:5*s});
 const k=run?Math.sin(run)*16*s:9*s;
 q+=line(x,y-32*s,x-k,y,{color:col,w:5*s})+line(x,y-32*s,x+k,y,{color:col,w:5*s});
 q+=line(hx-.5*(hx-x),y-52*s,hx+18*s,y-40*s-(run?Math.cos(run)*8*s:0),{color:col,w:5*s})+line(hx-.5*(hx-x),y-52*s,hx-16*s,y-38*s,{color:col,w:5*s});
 return q;
}
function trainCar(x,y,w,h,{win=true}={}){ // 左上 (x,y)
 let s=rect(x,y,w,h,{fill:'#4a5a78',fo:.35,stroke:'#8fa0bf',sw:3,rx:16});
 if(win)for(let i=0;i<3;i++)s+=rect(x+20+i*(w-40)/3,y+18,(w-40)/3-14,h*.28,{fill:'#9fc2ff',fo:.22,stroke:'#9fc2ff',sw:1.5,rx:5});
 s+=ring(x+w*.2,y+h+10,11,{color:C.dim,w:3,fill:C.bg})+ring(x+w*.8,y+h+10,11,{color:C.dim,w:3,fill:C.bg});
 return s;
}
function ground(x1,x2,y){let s=line(x1,y,x2,y,{color:C.dim,w:3});for(let q=x1+10;q<x2;q+=28)s+=line(q,y+2,q-14,y+16,{color:C.faint,w:2});return s;}
// 旅客機（上から見た形）。deg＝向き（画面、0＝右、反時計回りが正）
function plane(x,y,deg,{col='#e8eef8',s=1.6}={}){
 const sh=`<polygon points="-22,-3.5 16,-3.5 25,0 16,3.5 -22,3.5" fill="${col}"/><polygon points="-2,-2 -12,-21 -5,-21 9,-2" fill="${col}"/><polygon points="-2,2 -12,21 -5,21 9,2" fill="${col}"/><polygon points="-20,-2 -26,-10 -22,-10 -15,-2" fill="${col}"/><polygon points="-20,2 -26,10 -22,10 -15,2" fill="${col}"/>`;
 return `<g transform="translate(${n1(x)} ${n1(y)}) rotate(${n1(-deg)}) scale(${s})">${sh}</g>`;
}
const P=(x,y,r,th)=>[x+r*Math.cos(th),y-r*Math.sin(th)];
function arcArrow(x,y,r,th0,th1,{color=C.dim,w=4,head=18}={}){
 const n=28,pts=[];for(let i=0;i<=n;i++)pts.push(P(x,y,r,mix(th0,th1,i/n)));
 const [ax,ay]=pts[n-3],[bx,by]=pts[n];
 return draw(pts.slice(0,n-2),1,{color,w})+arrow(ax,ay,bx,by,{color,w,head});
}
// 光の波（電波・光の線）：左から右へ x0→x1 の波線
function wavy(x0,x1,y,{amp=10,lam=40,color=LIGHT,w=4,phase=0}={}){
 const pts=[];for(let x=x0;x<=x1;x+=4)pts.push([x,y+amp*Math.sin((x-phase)*2*Math.PI/lam)]);
 return draw(pts,1,{color,w});
}
const card=(x,y,w,h,{stroke=HC,g=1}={})=>fade(g,rect(x,y,w,h,{fill:CARD,fo:.95,stroke,sw:3,rx:18}));

// ================= 光の時計 =================
const BETA=.6,GAM=1/Math.sqrt(1-BETA*BETA); // 1.25
const tri=u=>{u=((u%2)+2)%2;return u<1?u:2-u;};
function mirrors(x,yb,L,w=120){
 return rect(x-w/2,yb,w,12,{fill:MIR,fo:.95,stroke:MIR,rx:3})+rect(x-w/2,yb-L-12,w,12,{fill:MIR,fo:.95,stroke:MIR,rx:3});
}
const photon=(x,y)=>dot(x,y,22,LIGHT,.28)+dot(x,y,11,LIGHT);
// 止まっている光の時計：片道 1 秒。t＝秒
function restClock(x,yb,L,t,{w=120,trail=true}={}){
 const u=t%2,y=yb-L*tri(t);
 let s=mirrors(x,yb,L,w);
 if(trail)s+=line(x,u<1?yb:yb-L,x,y,{color:HC,w:4,opacity:.7});
 return s+photon(x,y);
}
// ホームから見た動く光の時計：片道 GAM 秒、横の速さ 0.6c（L px/秒 の c に対して 0.6L px/秒）。2往復で x0 に戻る
const LEGX=L=>BETA*GAM*L; // 片道の横の進み 0.75L
function movingClock(x0,yb,L,t,{w=100,car=true,carTop=null}={}){
 const Pd=4*GAM,tt=((t%Pd)+Pd)%Pd,vx=BETA*L,x=x0+vx*tt,u=tt/GAM,y=yb-L*tri(u);
 const edge=clamp(Math.min(tt/.25,(Pd-tt)/.25));
 let s='';
 if(car){const top=carTop??(yb-L-40);s+=rect(x-80,top,160,yb+20-top,{fill:'#4a5a78',fo:.3,stroke:'#8fa0bf',sw:3,rx:14})+ring(x-45,yb+30,10,{color:C.dim,w:3,fill:C.bg})+ring(x+45,yb+30,10,{color:C.dim,w:3,fill:C.bg});}
 const pts=[[x0,yb]],nb=Math.floor(u);for(let i=1;i<=nb;i++)pts.push([x0+LEGX(L)*i,yb-L*(i%2)]);pts.push([x,y]);
 s+=draw(pts,1,{color:HC,w:4,opacity:.85});
 s+=mirrors(x,yb,L,w)+photon(x,y);
 s+=arrow(x+90,yb-L/2,x+150,yb-L/2,{color:C.v,w:5,head:18});
 return fade(edge,s);
}
// 電車の中から見た図（上の枠）：外の柱が左へ流れる
const TOP={x:20,y:20,w:960,h:380},BOT={x:20,y:420,w:960,h:430};
const TL={x:560,yb:350,L:200}; // 上の枠の時計
const BL={x0:150,yb:790,L:200}; // 下の枠の時計（2往復で x 150→750）
function topPanel(t,{g=1,inside=1,person0=1,labelG=1,poles=1}={}){
 let s=rect(TOP.x,TOP.y,TOP.w,TOP.h,{fill:'#101a30',fo:.9,stroke:C.faint,rx:16});
 if(poles>0){let q='';const sp=BETA*TL.L;for(let k=-1;k<7;k++){const x=((k*190-sp*t)%1140+1140)%1140-80;q+=line(x,250,x,385,{color:'#3a4a66',w:6});}s+=fade(poles,q);}
 s+=line(TOP.x+10,388,TOP.x+TOP.w-10,388,{color:C.dim,w:3});
 s+=fade(inside,trainCar(380,95,300,272,{win:false}));
 s+=restClock(TL.x,TL.yb,TL.L,t);
 s+=fade(person0*inside,person(450,358,{s:1.25}));
 s+=fade(labelG,label('電車の 中から 見る',40,72,{size:38,color:C.ink,weight:700}));
 return fade(g,s);
}
function botPanel(t,{g=1,labelG=1}={}){
 let s=rect(BOT.x,BOT.y,BOT.w,BOT.h,{fill:'#101a30',fo:.9,stroke:C.faint,rx:16});
 s+=ground(BOT.x+10,BOT.x+BOT.w-10,835);
 s+=movingClock(BL.x0,BL.yb,BL.L,t,{carTop:545});
 s+=fade(labelG,label('ホームから 見る',40,478,{size:38,color:C.ink,weight:700}));
 return fade(g,s);
}
const exNote=(g=1)=>note('電車の 速さは 光に 近く、大きく 誇張',40,900,{g});

// ================= 衛星の時計（GPSでは・次の疑問） =================
// 衛星の針の回り：地上は 1 回転／6 秒。速さの効果だけ：0.85 倍（大きく誇張）。実際の衛星：1.15 倍
const RG=1/6;
function satClockScene(tg,{satTurns,slow=0,slowDim=0,fast=0,fastText=0}={}){
 let s=satellite(300,110,.85)+label('衛星',300,190,{size:38,color:SATG,anchor:'middle',weight:700});
 s+=clock(300,350,120,{turns:satTurns,col:C.ink});
 s+=label('地上',700,190,{size:38,color:'#c4cde0',anchor:'middle',weight:700})+ground(580,820,500);
 s+=clock(700,350,120,{turns:RG*tg});
 if(slow>0){
  const a=fade(1-.65*slowDim,arrow(130,250,130,250+170*seg(slow,0,.5),{color:SLOW,w:9,head:28})+fade(seg(slow,.3,.7),label('遅れ',130,490,{size:40,color:SLOW,anchor:'middle',weight:700})));
  s+=a;
 }
 if(fast>0)s+=arrow(470,450,470,450-200*fast,{color:FAST,w:9,head:28})+fade(fastText,label('速く 進む',470,225,{size:40,color:FAST,anchor:'middle',weight:700}));
 return s;
}

// ================= cue ごとの図 =================
const OC=[500,470],OR=396,ER=95; // 地球の半径 95 と軌道の半径 396：6371 km と 26560 km の比（4.17）
const JP={osaka:[290,600],tokyo:[675,489]}; // 1px＝1 km、東京〜大阪 約400 km
const HONSHU=[[0,662],[140,628],[230,622],[290,622],[318,690],[332,700],[372,650],[420,600],[500,598],[560,595],[620,560],[690,520],[730,470],[770,380],[805,260],[840,120],[855,0],[760,0],[720,120],[640,230],[560,330],[480,400],[400,450],[300,488],[160,540],[0,575]];
// ================= 第3版で足した部品 =================
// 難所の札（橙の枠・小さな山の印・44px）。舞台の左上（y 14〜80）。この札がある場面では左上を空ける
function nanjo(g=1){const x=40,y=14,w=196,h=66,col='#ffb36b';
 let s=rect(x,y,w,h,{fill:C.bg,fo:.92,stroke:'none',rx:16})+rect(x,y,w,h,{fill:col,fo:.12,stroke:col,sw:3,rx:16});
 s+=poly([[x+16,y+50],[x+36,y+20],[x+48,y+36],[x+57,y+26],[x+76,y+50]],{fill:col,fo:.8,stroke:'none'});
 s+=label('難所',x+88,y+49,{size:44,color:col,weight:700});return fade(g,s);}
// 予想の候補カード（縦に並べる）。hi＝光らせるカード、dim＝答え合わせの進み（外れは 35% に）
function cards(items,{y0=400,show=[],hi=-1,dim=0}={}){
 let s='';items.forEach(([k,t],i)=>{const y=y0+i*118,g=show[i]??1;if(g<=0)return;
  const isHi=i===hi,op=hi>=0&&!isHi?1-.65*dim:1;
  let c='';if(isHi)c+=rect(78,y-12,814,124,{fill:HC,fo:.12*dim,stroke:'none',rx:28});
  c+=rect(90,y,790,100,{fill:CARD,fo:.96,stroke:isHi?mixCol(dim):C.faint,sw:isHi?3+4*dim:3,rx:22});
  c+=label(k,145,y+72,{size:64,color:HC,anchor:'middle',weight:700})+label(t,215,y+66,{size:44,color:C.ink,weight:700});
  s+=fade(g*op,c);});
 return s;}
const mixCol=d=>d>.5?HC:C.faint;
// 声の後の 3→2→1（各1秒、96px、黄）
function countdown(ctx,p,y=870){const t=cueT(p,ctx),ve=voiceEnd(ctx);if(t<ve)return '';const k=t-ve;if(k>=3)return '';const n=3-Math.floor(k),f=k%1;
 return fade(Math.min(1,f/.12),scaleAt(500,y-34,1.15-.15*Math.min(1,f/.2),label(String(n),500,y,{size:96,color:HC,anchor:'middle',weight:700})));}
const PRED1=[['A','電車の 分だけ 速い'],['B','変わらない'],['C','遅くなる']];
const PRED2=[['A','短くなる'],['B','同じ'],['C','長くなる']];
// 予想1の絵：走る電車から前に光を出す（舞台の上 y 100〜380）
function pred1Pic(t,g=1){
 let s=ground(60,940,340)+trainCar(170,190,300,120);
 s+=arrow(300,170,440,170,{color:C.v,w:7,head:22})+label('電車',300,150,{size:36,color:C.v,weight:700});
 const lx=480+((t*260)%380);s+=line(480,250,lx,250,{color:LIGHT,w:5})+dot(lx,250,12,LIGHT);
 s+=label('光',500,230,{size:40,color:LIGHT,weight:700});
 s+=plate('外から 見た 光の 速さ ？',600,330,{size:38,color:HC});
 return fade(g,s);}
// 予想2の絵：まっすぐな道と斜めの道（舞台の上）
function pred2Pic(g=1,{same=0,q=0}={}){
 let s=mirrors(300,360,220,110)+line(300,360,300,140,{color:HC,w:6})+label('まっすぐ',360,270,{size:38,color:HC,weight:700});
 s+=mirrors(560,360,220,90)+mirrors(725,360,220,90)+line(560,360,725,140,{color:FAST,w:6})+label('斜め',760,270,{size:38,color:FAST,weight:700});
 s+=fade(same,plate('光の 速さ：同じ',500,110,{size:38,color:LIGHT,anchor:'middle'}));
 s+=fade(q,plate('1往復の 時間 ？',960,385,{size:38,color:HC,anchor:'end'}));
 return fade(g,s);}
// 川（右へ流れる）と泳ぐ二人。泳ぐ速さ 100 px/秒、流れ 60 px/秒（0.6 倍、大きく誇張）
const RV={y0:220,y1:560,c:100,u:60,L:300,ax:150,ay:300,bx:700,by:545};
function swimA(t){const {c,u,L,ax,ay}=RV,t1=L/(c+u),t2=L/(c-u);if(t<=0)return [ax,ay,0];if(t<t1)return [ax+(c+u)*t,ay,0];if(t<t1+t2)return [ax+L-(c-u)*(t-t1),ay,0];return [ax,ay,1];}
function swimB(t){const {c,u,L,bx,by}=RV,w=Math.sqrt(c*c-u*u),t1=L/w;if(t<=0)return [bx,by,0];if(t<t1)return [bx,by-w*t,0];if(t<2*t1)return [bx,by-L+w*(t-t1),0];return [bx,by,1];}
const TA=RV.L/(RV.c+RV.u)+RV.L/(RV.c-RV.u),TB=2*RV.L/Math.sqrt(RV.c**2-RV.u**2); // 9.375 秒、7.5 秒（比 1.25）
function swimmer(x,y,col,k){return dot(x,y,15,col)+line(x-22,y+6+6*Math.sin(k),x+22,y+6-6*Math.sin(k),{color:col,w:5});}
function riverScene(st,{bars=1,longTag=0}={}){
 const {y0,y1}=RV;let s=rect(0,y0,W,y1-y0,{fill:'#2f6fd8',fo:.25,stroke:'none',rx:0})+line(0,y0,W,y0,{color:'#7fb2ff',w:4})+line(0,y1,W,y1,{color:'#7fb2ff',w:4});
 for(let k=0;k<7;k++){const x=((k*170+60*st)%1190)-110;s+=line(x,y0+150+((k%3)*40),x+60,y0+150+((k%3)*40),{color:'#7fb2ff',w:3,opacity:.5});}
 s+=arrow(380,y0+40,560,y0+40,{color:'#7fb2ff',w:6,head:20})+label('流れ',580,y0+52,{size:38,color:'#7fb2ff',weight:700});
 const [axp,ayp,ad]=swimA(st),[bxp,byp,bd]=swimB(st);
 s+=line(RV.ax,RV.ay,RV.ax+RV.L,RV.ay,{color:C.x,w:2,dash:'8 10',opacity:.6})+line(RV.bx,RV.by,RV.bx,RV.by-RV.L,{color:C.E,w:2,dash:'8 10',opacity:.6});
 s+=swimmer(axp,ayp,C.x,st*8)+swimmer(bxp,byp,C.E,st*8);
 s+=label('A',RV.ax-50,RV.ay+14,{size:44,color:C.x,weight:700})+label('B',RV.bx+40,RV.by-10,{size:44,color:C.E,weight:700});
 // 時間の棒（往復が終わるまで伸びる）
 const k=50,ta=Math.min(st,TA),tb=Math.min(st,TB);
 s+=fade(bars,label('A 沿って 往復',40,640,{size:38,color:C.x,weight:700})+rect(330,612,ta*k,36,{fill:C.x,fo:.8,stroke:C.x,rx:4}));
 s+=fade(bars,label('B 横切って 往復',40,720,{size:38,color:C.E,weight:700})+rect(330,692,tb*k,36,{fill:C.E,fo:.8,stroke:C.E,rx:4}));
 s+=fade(longTag*ad,plate('A の 方が 長い',330,800,{size:44,color:HC}));
 s+=note('流れの 速さは 大きく 誇張',40,900);
 return s;}
// 光の時計・腕時計・心臓（電車の中）。rate＝進み方（1＝ふつう）
function heart(x,y,s){return `<path transform="translate(${n1(x)} ${n1(y)}) scale(${n1(s)})" d="M0,0.9 C-1.3,0 -0.7,-1 0,-0.35 C0.7,-1 1.3,0 0,0.9 Z" fill="#ff7a8f"/>`;}
function trio(t,{rLight=1,rWatch=1,rHeart=1}={}){
 let s=rect(40,120,920,470,{fill:'#4a5a78',fo:.18,stroke:'#8fa0bf',sw:3,rx:24})+label('電車の 中',70,170,{size:38,color:C.dim,weight:700});
 s+=restClock(220,460,200,t*rLight,{w:110});
 s+=clock(500,360,90,{turns:RG*t*rWatch});
 const ph=(t*rHeart)%1,beat=ph<.15?1+.25*Math.sin(ph/.15*Math.PI):1;s+=heart(780,350,70*beat);
 s+=label('光の 時計',220,540,{size:38,color:LIGHT,anchor:'middle',weight:700})+label('腕時計',500,540,{size:38,color:C.t,anchor:'middle',weight:700})+label('心臓',780,540,{size:38,color:'#ff7a8f',anchor:'middle',weight:700});
 return s;}
// 地球と軌道（1 の絵）
function orbitPic(t,{speed=1,g=1}={}){const th=(118+3.2*t)*Math.PI/180,[sx,sy]=P(OC[0],OC[1],OR,th);
 let s=ring(OC[0],OC[1],OR,{color:'#5c6f90',w:3,dash:'10 10'})+earth(OC[0],OC[1],ER)+label('地球',OC[0],OC[1]+ER+50,{size:38,color:'#8ec0ff',anchor:'middle',weight:700});
 s+=satellite(sx,sy,.6)+label('GPSの 衛星',sx+20,sy-50,{size:38,color:SATG,weight:700});
 const tx=-Math.sin(th),ty=-Math.cos(th);
 s+=fade(speed,arrow(sx+tx*40,sy+ty*40,sx+tx*170,sy+ty*170,{color:C.v,w:7,head:24})+plate('1秒に 約3.9 km',40,620,{size:44,color:C.v}));
 s+=note('衛星の 大きさは 大きく 誇張',40,900);
 return fade(g,s);}
function japanPic(u,{done=0,g=1}={}){const [ax,ay]=JP.tokyo,[bx,by]=JP.osaka;
 let s=poly(HONSHU,{fill:'#2c4a3a',fo:.9,stroke:'#5a8a6a',sw:3})+draw([[ax,ay],[bx,by]],1,{color:C.dim,w:3,dash:'10 10'});
 s+=dot(ax,ay,12,'#ffffff')+label('東京',ax+24,ay+14,{size:40,color:C.ink,weight:700})+dot(bx,by,12,'#ffffff')+label('大阪',bx-24,by+60,{size:40,color:C.ink,anchor:'end',weight:700});
 s+=plate('約400 km',440,640,{size:40,color:C.dim});
 const x=mix(ax,bx,u),y=mix(ay,by,u)-120;s+=draw([[ax,ay-120],[x,y]],1,{color:C.v,w:4,opacity:.6})+satellite(x,y,.55);
 s+=label('かかる 時間',40,80,{size:38,color:C.dim,weight:700})+label(`${Math.round(102.6*u)} 秒`,40,160,{size:64,color:C.t,weight:700});
 s+=fade(done,label('＝ 約2分',310,160,{size:56,color:HC,weight:700}));
 s+=note('地図は おおまか・時間は 早送り',40,900);
 return fade(g,s);}
// 原子の印
function atom(x,y,r=40){return dot(x,y,9,HC)+`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*.38}" fill="none" stroke="#8ec0ff" stroke-width="3"/>`+`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*.38}" fill="none" stroke="#8ec0ff" stroke-width="3" transform="rotate(60 ${x} ${y})"/>`+`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*.38}" fill="none" stroke="#8ec0ff" stroke-width="3" transform="rotate(-60 ${x} ${y})"/>`;}
// 三平方の三角形（光の時計の片道）。図は v＝0.6（大きく誇張）：斜辺 500、横 300、縦 400
const TR={x0:200,y0:700,hyp:500,v:.6};
const TRP=()=>{const {x0,y0,hyp,v}=TR,b=hyp*v,h=hyp*Math.sqrt(1-v*v);return {A:[x0,y0],B:[x0+b,y0],Cc:[x0+b,y0-h]};};
function triFig({hyp=1,base=0,vert=0,labels=0,vq=0,clocks=0}={}){
 const {A,B,Cc}=TRP();let s='';
 const h=A[1]-Cc[1];s+=fade(.45,mirrors(A[0],A[1],h,90))+fade(.9,mirrors(B[0],B[1],h,90));
 s+=label('出発',A[0],A[1]+60,{size:36,color:C.dim,anchor:'middle'})+label('着いた とき',B[0],B[1]+60,{size:36,color:C.dim,anchor:'middle'});
 s+=draw([A,Cc],hyp,{color:FAST,w:8});
 s+=draw([A,B],base,{color:C.v,w:8});
 s+=draw([B,Cc],vert,{color:HC,w:8,dash:vq>0&&vert<1?'12 10':''});
 if(base>=1)s+=draw([[B[0]-24,B[1]],[B[0]-24,B[1]-24],[B[0],B[1]-24]],1,{color:C.dim,w:3});
 return s;}

export const deep09Diagrams={
 // ===== モヤモヤ =====
 // 1 衛星の速さ → 東京〜大阪 → 地球を回る
 [K+'orbit:sat']:(p,ctx)=>{const t=cueT(p,ctx),j=vseg(ctx,p,.3,.4)*(1-vseg(ctx,p,.82,.92));
  return orbitPic(t,{speed:vseg(ctx,p,.05,.25),g:1-j})+japanPic(vseg(ctx,p,.4,.7),{done:vseg(ctx,p,.68,.78),g:j});},
 // 2 速く動く時計はゆっくり（予言、何度も確かめられた）
 [K+'clock:slow']:(p,ctx)=>{const t=tg0(p,ctx),gs=swin(ctx,p,0,.45,.8);
  let s=clockPair(t);
  s+=fade(gs,label('ゆっくり',710,630,{size:44,color:SLOW,anchor:'middle',weight:700}));
  s+=tag('予言',960,60,{anchor:'end',g:swin(ctx,p,1,.1,.4),color:'#c9b6ff',text:'1905年 アインシュタイン'});
  s+=fade(swin(ctx,p,1,.6,.9),plate('何度も 確かめられた',500,760,{size:44,color:HC,anchor:'middle'}));
  s+=fade(gs,note('遅れは 大きく 誇張',40,900));
  return s;},
 // 3a 時計の中の原子は何も変わらないはず
 [K+'clock:atom']:(p,ctx)=>{const t=tg0(p,ctx);
  let s=clockPair(t)+label('ゆっくり',710,630,{size:44,color:SLOW,anchor:'middle',weight:700})+tag('予言',960,60,{anchor:'end',color:'#c9b6ff',text:'1905年 アインシュタイン'});
  s+=fade(swin(ctx,p,1,0,.3),atom(710,330,60)+plate('中の 原子は 何も 変わらない はず',500,760,{size:40,color:'#8ec0ff',anchor:'middle'}));
  s+=fade(swin(ctx,p,0,.2,.6),bigQ(860,250,1,110));
  s+=note('遅れは 大きく 誇張',40,900);
  return s;},
 // 3b なぜ？
 [K+'clock:why']:(p,ctx)=>{const t=tg0(p,ctx),g=vseg(ctx,p,0,.3);
  let s=fade(1-.7*g,clockPair(t)+atom(710,330,60));
  s+=bigQ(500,640,vseg(ctx,p,.3,.7),240)+fade(vseg(ctx,p,.6,.9),label('動くだけで、なぜ？',500,820,{size:52,color:C.ink,anchor:'middle',weight:700}));
  return s;},
 // ===== 光の速さ（一つ目の難所） =====
 [K+'light:beam']:(p,ctx)=>{const t=cueT(p,ctx),g=vseg(ctx,p,0,.4);
  let s=fade(g,wavy(40,mix(40,960,g),430,{phase:t*240,amp:14,lam:60,w:5}))+fade(g,dot(mix(40,960,g),430,14,LIGHT));
  s+=fade(vseg(ctx,p,.05,.25),label('光',60,380,{size:48,color:LIGHT,weight:700}));
  s+=fade(vseg(ctx,p,.2,.45),plate('鍵 ＝ 光の 速さ',500,300,{size:60,color:HC,anchor:'middle'}));
  s+=fade(vseg(ctx,p,.3,.5),label('1秒に 約30万 km',500,560,{size:44,color:LIGHT,anchor:'middle',weight:700}));
  s+=nanjo(swin(ctx,p,1,.2,.6));
  s+=fade(swin(ctx,p,1,.3,.8),label('ここが 一つ目の 難所',500,700,{size:44,color:'#ffb36b',anchor:'middle',weight:700}));
  return s;},
 // 5 ボールの速さ＋電車の速さ
 [K+'train:ball']:(p,ctx)=>{const t=cueT(p,ctx),ve=voiceEnd(ctx),tx=60+28*t;
  let s=nanjo()+ground(20,980,400)+trainCar(tx,170,440,200)+person(tx+90,365,{s:1.1});
  const t0=.25*ve,b=t<t0?0:Math.min(300,95*(t-t0));
  s+=fade(t>=t0?1:0,dot(tx+130+b,300,14,'#ffffff'));
  s+=person(900,395,{s:1.1})+label('外の 人',900,460,{size:36,color:C.dim,anchor:'middle'});
  const g1=vseg(ctx,p,.02,.2),g2=vseg(ctx,p,.25,.45),g3=vseg(ctx,p,.55,.9);
  s+=fade(g1,label('電車の 速さ',40,560,{size:38,color:C.v,weight:700})+arrow(340,548,560,548,{color:C.v,w:9,head:26,g:g1}));
  s+=fade(g2,label('ボールの 速さ',40,650,{size:38,color:C.x,weight:700})+arrow(340,638,600,638,{color:C.x,w:9,head:26,g:g2}));
  s+=fade(g2,label('（電車の 中から 見て）',40,700,{size:36,color:C.dim}));
  s+=fade(g3,label('外から 見た',40,790,{size:38,color:HC,weight:700})+label('ボールの 速さ',40,836,{size:38,color:HC,weight:700}));
  s+=fade(g3,arrow(340,800,600,800,{color:C.x,w:9,head:26,g:seg(g3,0,.5)})+line(600,800,600+220*seg(g3,.4,1),800,{color:C.v,w:9}));
  s+=fade(seg(g3,.7,1),label('足し算',700,880,{size:40,color:HC,anchor:'middle',weight:700}));
  return s;},
 // 6 予想1：走る電車から前に光を出したら？（A・B・C、3秒）
 [K+'pred1:q']:(p,ctx)=>nanjo()+pred1Pic(tg0(p,ctx),vseg(ctx,p,.2,.5))+tag('予想',960,60,{anchor:'end',g:vseg(ctx,p,0,.15),color:'#ffb36b'}),
 [K+'pred1:ab']:(p,ctx)=>nanjo()+pred1Pic(tg0(p,ctx))+tag('予想',960,60,{anchor:'end',color:'#ffb36b'})+cards(PRED1,{show:[swin(ctx,p,0,0,.3),swin(ctx,p,1,0,.4),0]}),
 [K+'pred1:c']:(p,ctx)=>nanjo()+pred1Pic(tg0(p,ctx))+tag('予想',960,60,{anchor:'end',color:'#ffb36b'})+cards(PRED1,{show:[1,1,vseg(ctx,p,0,.4)]})+countdown(ctx,p),
 // 7a 1887年、マイケルソンとモーリーの実験
 [K+'mm:intro']:(p,ctx)=>{const g=vseg(ctx,p,0,.3),h=vseg(ctx,p,.4,.8);
  let s=nanjo()+fade(g,label('1887年',500,250,{size:72,color:HC,anchor:'middle',weight:700}));
  s+=fade(h,card(150,330,700,240,{stroke:C.faint})+dot(270,410,32,'#c4cde0')+`<path d="M215 520 q55 -85 110 0Z" fill="#c4cde0"/>`+dot(400,410,32,'#c4cde0')+`<path d="M345 520 q55 -85 110 0Z" fill="#c4cde0"/>`+label('マイケルソンと',480,430,{size:44,color:C.ink,weight:700})+label('モーリー',480,500,{size:44,color:C.ink,weight:700}));
  s+=fade(h,label('光の 速さの 足し算を 確かめる 実験',500,680,{size:40,color:C.dim,anchor:'middle',weight:700}));
  return s;},
 // 7b 地球は 1秒に 約30 km で走る巨大な電車
 [K+'mm:earth']:(p,ctx)=>{const b=vseg(ctx,p,0,.25),c=vseg(ctx,p,.3,.65),d=vseg(ctx,p,.7,.95);
  let s=nanjo()+fade(b,ring(300,470,330,{color:'#5c6f90',w:3,dash:'10 10'})+dot(300,470,60,'#ffcf67')+label('太陽',300,575,{size:38,color:'#ffcf67',anchor:'middle',weight:700}));
  s+=fade(b,earth(630,470,40)+label('地球',690,560,{size:38,color:'#8ec0ff',weight:700}));
  s+=fade(c,arrow(630,420,630,200,{color:C.v,w:9,head:28,g:c})+plate('1秒に 約30 km',670,300,{size:44,color:C.v}));
  s+=fade(d,plate('地球 ＝ 巨大な 電車',500,760,{size:48,color:HC,anchor:'middle'}));
  s+=note('大きさと 距離は 実際とは 違う',40,900);
  return s;},
 // 8 川を泳ぐ：沿って往復／横切って往復（時間の棒）
 [K+'river:swim']:(p,ctx)=>nanjo()+riverScene(Math.max(0,tg0(p,ctx)-2.0)),
 [K+'river:bars']:(p,ctx)=>nanjo()+riverScene(Math.max(0,tg0(p,ctx)-2.0),{longTag:vseg(ctx,p,.2,.6)}),
 // 9a 光を二つに分け、地球の進む向きとそれに直角の向きに往復
 [K+'mm:arms']:(p,ctx)=>{const u=vseg(ctx,p,.05,.95),lab=vseg(ctx,p,.3,.6);
  let s=nanjo()+arrow(600,105,900,105,{color:C.v,w:7,head:22})+label('地球の 進む 向き',600,80,{size:36,color:C.v,weight:700});
  s+=miApp(MI.x,MI.y,{beam:u})+miPulse(u);
  s+=fade(vseg(ctx,p,.15,.3),label('光を 分ける 鏡',MI.x-50,MI.y+95,{size:36,color:MIR,anchor:'end',weight:700}));
  s+=fade(lab,label('進む 向きの 腕',MI.x+30,MI.y+95,{size:36,color:C.x,weight:700})+label('直角の 腕',MI.x-24,MI.y-130,{size:36,color:C.E,anchor:'end',weight:700}));
  return s;},
 // 9b 川の泳ぎと重ねる：違うはず（予想）
 [K+'mm:overlay']:(p,ctx)=>{const t=cueT(p,ctx),a=vseg(ctx,p,.05,.35),b=vseg(ctx,p,.4,.75);
  let s=nanjo()+arrow(600,105,900,105,{color:C.v,w:7,head:22})+label('地球の 進む 向き',600,80,{size:36,color:C.v,weight:700});
  s+=miApp(MI.x,MI.y,{beam:1});
  s+=fade(a,line(MI.x+20,MI.y+16,MI.x+MI.A-20,MI.y+16,{color:C.x,w:8})+label('A 流れに 沿う',MI.x+20,MI.y+95,{size:36,color:C.x,weight:700}));
  s+=fade(a,line(MI.x-16,MI.y-20,MI.x-16,MI.y-MI.A+20,{color:C.E,w:8})+label('B 横切る',MI.x-30,MI.y-130,{size:36,color:C.E,anchor:'end',weight:700}));
  s+=fade(b,label('戻る 時間',40,645,{size:38,color:C.ink,weight:700})+rect(260,665,TA*40,30,{fill:C.x,fo:.8,stroke:C.x,rx:4})+rect(260,710,TB*40,30,{fill:C.E,fo:.8,stroke:C.E,rx:4})+label('A',230,692,{size:36,color:C.x,anchor:'end',weight:700})+label('B',230,737,{size:36,color:C.E,anchor:'end',weight:700}));
  s+=tag('予想',500,840,{anchor:'middle',g:vseg(ctx,p,.75,.95),text:'川と 同じように 違う はず'});
  return s;},
 // 10 縞。時間に違いがあれば、回すと縞が動くはず（予想）
 [K+'mm:fringe']:(p,ctx)=>{const t=cueT(p,ctx),f=swin(ctx,p,0,.2,.8),r=swin(ctx,p,1,.1,.9),ang=20*Math.sin(t*1.4)*r;
  let s=nanjo()+scaleAt(MI.x,MI.y,1-.4*r,`<g transform="rotate(${n1(-ang)} ${MI.x} ${MI.y})">${miApp(MI.x,MI.y,{beam:1})}</g>`);
  s+=fringes(FR.x,FR.y,FR.w,FR.h,r*ang/20*2.6,f);
  s+=fade(f,label('明るい所と 暗い所の 縞',FR.x,FR.y+FR.h+50,{size:36,color:C.dim}));
  s+=tag('予想',960,60,{anchor:'end',g:r,text:'回すと 縞が 動く はず'});
  s+=fade(r,note('予想の 動き（仮の 絵）',FR.x,FR.y-20));
  return s;},
 // 11 地球の速さは光の 1万分の1 → 時間の差はほんのわずか（拡大鏡）
 [K+'tiny:speed']:(p,ctx)=>{let s=nanjo()+fade(.35,miApp(MI.x,MI.y,{beam:1}));
  s+=fade(vseg(ctx,p,.05,.4),plate('地球の 速さ ÷ 光の 速さ',500,700,{size:44,color:C.v,anchor:'middle'}));
  s+=fade(vseg(ctx,p,.45,.8),label('＝ 1万分の1',500,800,{size:60,color:HC,anchor:'middle',weight:700}));
  return s;},
 [K+'tiny:bars']:(p,ctx)=>{const a=vseg(ctx,p,0,.3),m=vseg(ctx,p,.35,.7);
  let s=nanjo()+label('戻る 時間',40,150,{size:40,color:C.ink,weight:700});
  s+=fade(a,label('A',60,262,{size:44,color:C.x,weight:700})+rect(110,230,600*a,40,{fill:C.x,fo:.85,stroke:C.x,rx:4}));
  s+=fade(a,label('B',60,342,{size:44,color:C.E,weight:700})+rect(110,310,600*a,40,{fill:C.E,fo:.85,stroke:C.E,rx:4}));
  s+=fade(seg(a,.6,1),plate('ほとんど 同じ 長さ',110,430,{size:40,color:C.ink}));
  // 拡大鏡：棒の終わりを大きく
  s+=fade(m,ring(710,290,70,{color:HC,w:5})+line(760,340,830,410,{color:HC,w:10}));
  s+=fade(m,`<clipPath id="d09mag"><circle cx="500" cy="650" r="170"/></clipPath>`+ring(500,650,172,{color:HC,w:6,fill:C.bg})+`<g clip-path="url(#d09mag)">`+rect(260,560,240,70,{fill:C.x,fo:.85,stroke:C.x,rx:0})+rect(260,670,255,70,{fill:C.E,fo:.85,stroke:C.E,rx:0})+line(500,540,500,770,{color:C.ink,w:3,dash:'8 8'})+`</g>`+line(620,520,720,360,{color:HC,w:3,dash:'8 8'}));
  s+=fade(vseg(ctx,p,.6,.9),label('差は ほんの わずか',700,860,{size:40,color:HC,anchor:'middle',weight:700}));
  s+=note('拡大鏡の 中は 大きく 誇張',40,905);
  return s;},
 // 12 光の波はとても細かい → 一部がずれるだけで明暗が入れ替わる
 [K+'wave:fine']:(p,ctx)=>{const g=vseg(ctx,p,.1,.5);
  let s=nanjo()+fade(g,waveRow(170,0,C.x)+waveRow(300,0,C.E));
  s+=fade(g,label('A の 光',40,120,{size:36,color:C.x,weight:700})+label('B の 光',40,250,{size:36,color:C.E,weight:700}));
  s+=fade(vseg(ctx,p,.5,.9),plate('光の 波は とても 細かい',500,450,{size:44,color:HC,anchor:'middle'}));
  s+=note('波は 大きく 拡大',40,905);
  return s;},
 [K+'wave:shift']:(p,ctx)=>{const u=vseg(ctx,p,.15,.6),ph=Math.PI*u;
  let s=nanjo()+waveRow(170,0,C.x)+waveRow(300,ph,C.E)+label('A の 光',40,120,{size:36,color:C.x,weight:700})+label('B の 光',40,250,{size:36,color:C.E,weight:700});
  s+=fade(vseg(ctx,p,0,.15),label('ずれ：波 半分',960,250,{size:36,color:C.dim,anchor:'end',opacity:u}));
  // 重ねた光
  const amp=Math.cos(ph/2);s+=label('重ねると',40,410,{size:36,color:C.ink,weight:700});
  s+=waveRow(500,ph/2,LIGHT,52*amp/1);
  s+=fade(1-u,label('山と山 → 強め合う（明るい）',500,620,{size:40,color:HC,anchor:'middle',weight:700}));
  s+=fade(u,label('山と谷 → 打ち消し合う（暗い）',500,620,{size:40,color:SLOW,anchor:'middle',weight:700}));
  s+=fringes(FR.x,680,FR.w,90,ph,1);
  s+=fade(vseg(ctx,p,.65,.95),plate('明るい所と 暗い所が 入れ替わる',500,840,{size:40,color:HC,anchor:'middle'}));
  s+=note('波は 大きく 拡大',40,905);
  return s;},
 // 11a 答え：B 変わらない
 [K+'mm:answer']:(p,ctx)=>nanjo()+pred1Pic(cueT(p,ctx),.4)+cards(PRED1,{hi:1,dim:vseg(ctx,p,0,.45)}),
 // 11b 回しても縞は動かない（実験）
 [K+'mm:result']:(p,ctx)=>{const t=tv(ctx,p),k=seg(t,0,.12),ang=t<.12?0:mix(0,180,seg(t,.12,.6));
  let s=nanjo()+tag('実験',960,60,{anchor:'end'})+label('1887年',960,130,{size:40,color:HC,anchor:'end',weight:700});
  s+=scaleAt(MI.x,MI.y,1-.45*k,`<g transform="rotate(${n1(-ang)} ${MI.x} ${MI.y})">${miApp(MI.x,MI.y,{beam:1})}</g>`);
  s+=fringes(FR.x,FR.y,FR.w,FR.h,0,1);
  s+=fade(swin(ctx,p,0,.5,.9),label('回しても 縞は 動かない',FR.x,FR.y+FR.h+50,{size:38,color:HC,weight:700}));
  s+=fade(swin(ctx,p,1,.2,.7),plate('光の 速さは どの 向きでも 同じ',500,895,{size:42,color:HC,anchor:'middle'}));
  return s;},
 // 12 追いかけても逃げても同じ
 [K+'chase:meter']:(p,ctx)=>nanjo()+chase(cueT(p,ctx),swin(ctx,p,1,0,.15),swin(ctx,p,1,.2,.4),swin(ctx,p,1,.4,.6),swin(ctx,p,1,.6,.8),swin(ctx,p,1,.7,1)),
 [K+'chase:sum']:(p,ctx)=>{let s=nanjo()+chase(tg0(p,ctx),1,1,1,1,1);
  s+=fade(vseg(ctx,p,.2,.6),plate('速さの 足し算が 光には 効かない',500,895,{size:42,color:HC,anchor:'middle'}));return s;},
 // ===== 光の時計 =====
 [K+'ein:accept']:(p,ctx)=>einCards(vseg(ctx,p,0,.3),vseg(ctx,p,.45,.8),0,0,0,{year:0}),
 [K+'ein:time']:(p,ctx)=>{const t=tg0(p,ctx);return einCards(1,1,vseg(ctx,p,.4,.7),vseg(ctx,p,.75,.95),t,{year:0});},
 // 14 光の時計：1往復＝1回（定義）
 [K+'lc:rest']:(p,ctx)=>{const t=cueT(p,ctx),g=vseg(ctx,p,0,.12),c=swin(ctx,p,1,0,.3),t1=sentStart(ctx,1),n=t<t1?0:Math.floor(t/2)-Math.floor(t1/2);
  let s=fade(g,restClock(500,700,300,t,{w:180}));
  s+=fade(g,label('鏡',620,410,{size:40,color:MIR,weight:700})+label('鏡',620,735,{size:40,color:MIR,weight:700}));
  s+=fade(swin(ctx,p,0,.4,.7),label('光',420,560,{size:44,color:LIGHT,anchor:'end',weight:700}));
  s+=tag('定義',40,90,{g:c,text:'1往復 ＝ 1回'});
  s+=fade(c,label(`${n} 回`,960,250,{size:60,color:HC,anchor:'end',weight:700}));
  return s;},
 [K+'lc:inside']:(p,ctx)=>{const t=tg0(p,ctx),m=vseg(ctx,p,0,.3),q=swin(ctx,p,1,0,.3);
  const x=mix(500,TL.x,m),yb=mix(700,TL.yb,m),L=mix(300,TL.L,m);
  let s=fade(seg(m,.5,1),rect(TOP.x,TOP.y,TOP.w,TOP.h,{fill:'#101a30',fo:.9,stroke:C.faint,rx:16}))+fade(1-seg(m,.6,1),restClock(x,yb,L,t,{w:mix(180,120,m)}))+fade(seg(m,.6,1),topPanel(t,{inside:1,labelG:q,person0:q}));
  s+=fade(swin(ctx,p,1,.6,.9),plate('まっすぐ 上下',960,72,{size:38,color:HC,anchor:'end'}));
  s+=fade(swin(ctx,p,0,.3,.6),arrow(720,140,880,140,{color:C.v,w:7,head:22})+label('走る',800,215,{size:38,color:C.v,anchor:'middle',weight:700}));
  return s;},
 [K+'lc:platform']:(p,ctx)=>{const t=tg0(p,ctx),g=vseg(ctx,p,0,.15);
  let s=topPanel(t,{labelG:1,person0:1})+plate('まっすぐ 上下',960,72,{size:38,color:HC,anchor:'end'});
  s+=fade(g,botPanel(t));
  s+=fade(swin(ctx,p,1,.2,.7),plate('斜めの 道',960,478,{size:40,color:HC,anchor:'end'}));
  s+=fade(swin(ctx,p,0,.5,.9),label('鏡は 横へ 動く',960,620,{size:36,color:C.v,anchor:'end',weight:700}).replace('x="960"','x="890"'));
  s+=exNote(g);
  return s;},
 // 17 予想2：1往復の時間は？（A・B・C、3秒）
 [K+'pred2:q']:(p,ctx)=>pred2Pic(vseg(ctx,p,.3,.8))+tag('予想',960,60,{anchor:'end',g:vseg(ctx,p,0,.15),color:'#ffb36b'}),
 [K+'pred2:q2']:(p,ctx)=>pred2Pic(1,{same:swin(ctx,p,0,0,.5),q:swin(ctx,p,1,.2,.7)})+tag('予想',960,60,{anchor:'end',color:'#ffb36b'}),
 [K+'pred2:ab']:(p,ctx)=>pred2Pic(1,{same:1,q:1})+tag('予想',960,60,{anchor:'end',color:'#ffb36b'})+cards(PRED2,{show:[swin(ctx,p,0,0,.3),swin(ctx,p,1,0,.4),0]}),
 [K+'pred2:c']:(p,ctx)=>pred2Pic(1,{same:1,q:1})+tag('予想',960,60,{anchor:'end',color:'#ffb36b'})+cards(PRED2,{show:[1,1,vseg(ctx,p,0,.4)]})+countdown(ctx,p),
 // 18a 答え：C 長くなる
 [K+'lc:answer']:(p,ctx)=>pred2Pic(.4,{same:1,q:1})+cards(PRED2,{hi:2,dim:vseg(ctx,p,0,.45)}),
 // 18b ホームの時計 5回、電車の時計 4回
 [K+'lc:slow']:(p,ctx)=>{const t=cueT(p,ctx),T=ctx.dur/5.6,tt=t*2/T,q=swin(ctx,p,1,.3,.7);
  const nTop=Math.floor(t/T),nBot=Math.floor(t/(T*GAM));
  let top=rect(TOP.x,TOP.y,TOP.w,TOP.h,{fill:'#101a30',fo:.9,stroke:C.faint,rx:16})+ground(TOP.x+10,TOP.x+TOP.w-10,388)+restClock(500,TL.yb,TL.L,tt)+label('ホームの 時計',40,72,{size:38,color:C.ink,weight:700});
  top+=label(`${nTop} 回`,960,72,{size:48,color:HC,anchor:'end',weight:700});
  let bot=rect(BOT.x,BOT.y,BOT.w,BOT.h,{fill:'#101a30',fo:.9,stroke:C.faint,rx:16})+ground(BOT.x+10,BOT.x+BOT.w-10,835)+movingClock(BL.x0,BL.yb,BL.L,tt,{carTop:545})+label('電車の 時計（ホームから 見る）',40,478,{size:38,color:C.ink,weight:700});
  bot+=label(`${nBot} 回`,960,540,{size:48,color:q>0?SLOW:HC,anchor:'end',weight:700});
  let s=top+bot;
  s+=fade(swin(ctx,p,1,.35,.7),plate('電車の 時計は ゆっくり',500,900,{size:44,color:SLOW,anchor:'middle'}));
  s+=exNote(1-swin(ctx,p,1,.05,.3));
  return s;},
 // 19a ただの見え方？
 [K+'real:q']:(p,ctx)=>{const t=cueT(p,ctx);let s=fade(.35,trio(t,{rLight:.8,rWatch:.8,rHeart:.8}));
  s+=bigQ(500,800,vseg(ctx,p,.1,.5),200)+fade(vseg(ctx,p,.4,.8),plate('ただの 見え方？',500,860,{size:44,color:HC,anchor:'middle'}));return s;},
 // 19b もし光の時計だけ遅れたら → 比べると動いていると分かってしまう
 [K+'real:if']:(p,ctx)=>{const t=tg0(p,ctx);
  let s=trio(t,{rLight:.8,rWatch:1,rHeart:1});
  s+=tag('仮定',40,90,{text:'もし 光の 時計 だけ 遅れたら',g:vseg(ctx,p,0,.2)});
  s+=fade(vseg(ctx,p,.3,.55),label('光の 時計：ゆっくり',220,620,{size:38,color:SLOW,anchor:'middle',weight:700})+label('腕時計・心臓：ふつう',650,620,{size:38,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(vseg(ctx,p,.6,.9),plate('比べると「動いている」と 分かって しまう',500,740,{size:38,color:HC,anchor:'middle'}));
  return s;},
 // 19c 起きない → どんな時計も心臓も同じだけゆっくり
 [K+'real:all']:(p,ctx)=>{const t=tg0(p,ctx),x=swin(ctx,p,0,.1,.5),a=swin(ctx,p,1,0,.3);
  let s=fade(1-a,trio(t,{rLight:.8,rWatch:1,rHeart:1})+tag('仮定',40,90,{text:'もし 光の 時計 だけ 遅れたら'}));
  s+=fade(x*(1-a),line(300,180,700,560,{color:FAST,w:14})+line(700,180,300,560,{color:FAST,w:14})+plate('起きない',500,700,{size:52,color:FAST,anchor:'middle'}));
  s+=fade(a,trio(t,{rLight:.8,rWatch:.8,rHeart:.8}));
  s+=fade(swin(ctx,p,1,.4,.8),plate('すべて そろって ゆっくり',500,700,{size:48,color:SLOW,anchor:'middle'}));
  s+=fade(a,note('ゆっくりの 程度は 大きく 誇張',40,900));
  return s;},
 // ===== お互いさま =====
 [K+'mutual:q']:(p,ctx)=>{const t=cueT(p,ctx);return mutualFig(t,1,vseg(ctx,p,.2,.6),0);},
 [K+'mutual:both']:(p,ctx)=>{const t=tg0(p,ctx);return mutualFig(t,1,1,swin(ctx,p,0,.5,.9))+fade(swin(ctx,p,1,.2,.7),plate('お互いに 相手の 方が 遅い',500,720,{size:48,color:HC,anchor:'middle'}));},
 // 21 離れた時計を並べて比べる → 双子のパラドックス（いつか別の動画で）
 [K+'twin:meet']:(p,ctx)=>{const u=vseg(ctx,p,.05,.75),c=vseg(ctx,p,.75,1),d=Math.sin(Math.PI*u);
  let s=clock(320,380,90,{turns:u*2})+label('残る 時計',320,520,{size:38,color:C.ink,anchor:'middle',weight:700});
  s+=clock(560+300*d,380,90,{turns:u*1.8,col:C.x})+label('出かけて 戻る 時計',560+300*d,250,{size:38,color:C.x,anchor:'middle',weight:700});
  s+=fade(c,plate('並べて 比べる',500,640,{size:48,color:HC,anchor:'middle'}));
  return s;},
 [K+'twin:tag']:(p,ctx)=>{let s=clock(320,380,90,{turns:2})+label('残る 時計',320,520,{size:38,color:C.ink,anchor:'middle',weight:700})+clock(560,380,90,{turns:1.8,col:C.x})+label('出かけて 戻る 時計',560,250,{size:38,color:C.x,anchor:'middle',weight:700})+plate('並べて 比べる',500,640,{size:48,color:HC,anchor:'middle'});
  const g=vseg(ctx,p,.1,.4);s+=fade(g,rect(110,690,780,150,{fill:CARD,fo:.96,stroke:'#c9b6ff',sw:4,rx:24})+label('双子の パラドックス',500,755,{size:48,color:'#c9b6ff',anchor:'middle',weight:700})+label('→ いつか 別の 動画で',500,815,{size:40,color:C.ink,anchor:'middle',weight:700}));return s;},
 // 22 GPS では地球の中心から見た衛星の速さ
 [K+'gps:frame']:(p,ctx)=>{const t=cueT(p,ctx);let s=orbitPic(t,{speed:0});
  s+=fade(vseg(ctx,p,.1,.4),dot(OC[0],OC[1],10,HC)+plate('地球の 中心',OC[0],OC[1]-120,{size:38,color:HC,anchor:'middle'}));
  const th=(118+3.2*t)*Math.PI/180,[sx,sy]=P(OC[0],OC[1],OR,th),tx=-Math.sin(th),ty=-Math.cos(th);
  s+=fade(vseg(ctx,p,.4,.7),line(OC[0],OC[1],sx,sy,{color:HC,w:2,dash:'8 8'})+arrow(sx+tx*40,sy+ty*40,sx+tx*190,sy+ty*190,{color:C.v,w:8,head:26})+plate('中心から 見た 衛星の 速さ',40,700,{size:40,color:C.v}));
  return s;},
 // ===== どれだけ遅れる（二つ目の難所） =====
 [K+'pyth:q']:(p,ctx)=>{const t=cueT(p,ctx);return clockPair(t)+bigQ(500,780,vseg(ctx,p,.2,.6),180)+fade(vseg(ctx,p,.4,.8),label('どれだけ？',650,760,{size:52,color:C.ink,weight:700}));},
 [K+'pyth:intro']:(p,ctx)=>{const g=vseg(ctx,p,.05,.45);
  let s=nanjo(swin(ctx,p,1,.1,.6));
  const A=[330,640],B=[630,640],Cc=[630,340];
  s+=fade(g,poly([A,B,Cc],{fill:HC,fo:.08,stroke:C.ink,sw:5})+draw([[B[0]-26,B[1]],[B[0]-26,B[1]-26],[B[0],B[1]-26]],1,{color:C.dim,w:3}));
  s+=fade(seg(g,.4,1),poly([A,B,[B[0],B[1]+300],[A[0],A[1]+300]].map(([x,y])=>[x,mix(A[1],y,.6)]),{fill:C.v,fo:.25,stroke:C.v,sw:3})+poly([B,Cc,[Cc[0]+300,Cc[1]],[B[0]+300,B[1]]].map(([x,y])=>[mix(B[0],x,.6),y]),{fill:HC,fo:.2,stroke:HC,sw:3}));
  s+=fade(vseg(ctx,p,.3,.6),label('三平方の 定理',480,250,{size:52,color:C.ink,anchor:'middle',weight:700})+label('直角三角形の 辺の 長さの 関係',480,310,{size:36,color:C.dim,anchor:'middle'}));
  s+=fade(swin(ctx,p,1,.3,.8),label('ここが 二つ目の 難所',500,900,{size:44,color:'#ffb36b',anchor:'middle',weight:700}));
  return s;},
 // 24a 斜めの道は直角三角形の一番長い辺
 [K+'pyth:tri']:(p,ctx)=>nanjo()+triFig({hyp:vseg(ctx,p,0,.4),base:vseg(ctx,p,.3,.6),vert:vseg(ctx,p,.3,.6),vq:1})+fade(vseg(ctx,p,.5,.9),plate('一番 長い 辺 ＝ 斜めの 道',960,200,{size:40,color:FAST,anchor:'end'}))+note('電車の 速さは 大きく 誇張',40,900),
 // 24b 斜辺 1（光）、横 v（電車）
 [K+'pyth:sides']:(p,ctx)=>{const {A,B,Cc}=TRP();let s=nanjo()+triFig({base:1,vert:1,vq:1});
  s+=fade(swin(ctx,p,0,.1,.4),plate('1（光）',mix(A[0],Cc[0],.5)-40,mix(A[1],Cc[1],.5)-20,{size:44,color:FAST,anchor:'end'}));
  s+=fade(swin(ctx,p,0,.5,.9),plate('v（電車）',mix(A[0],B[0],.5),A[1]+120,{size:44,color:C.v,anchor:'middle'}));
  s+=fade(swin(ctx,p,1,.1,.6),plate('光の 速さ ＝ 1',960,200,{size:44,color:LIGHT,anchor:'end'}));
  s+=note('電車の 速さは 大きく 誇張（図は v ＝ 0.6）',40,900);
  return s;},
 // 25a 縦の辺 ＝ √(1−v²) を一段ずつ
 [K+'pyth:root']:(p,ctx)=>{const {A,B,Cc}=TRP(),a=vseg(ctx,p,.05,.3),b=vseg(ctx,p,.3,.55),c=vseg(ctx,p,.55,.8),d=vseg(ctx,p,.8,1);
  let s=nanjo()+triFig({base:1,vert:1,vq:0});
  s+=plate('1（光）',mix(A[0],Cc[0],.5)-40,mix(A[1],Cc[1],.5)-20,{size:44,color:FAST,anchor:'end'})+plate('v（電車）',mix(A[0],B[0],.5),A[1]+120,{size:44,color:C.v,anchor:'middle'});
  s+=fade(a*(1-c),label('縦 ＝ h',B[0]+30,mix(B[1],Cc[1],.5),{size:44,color:HC,weight:700}));
  s+=fade(a*(1-seg(b,0,.45)),tex('h^2+v^2=1^2',730,170,{size:56}));
  s+=fade(seg(b,.55,1)*(1-seg(c,0,.45)),tex('h^2=1-v^2',730,170,{size:56}));
  s+=fade(seg(c,.55,1),tex('h=\\sqrt{1-v^2}',730,170,{size:64}));
  s+=fade(d,tex('\\sqrt{1-v^2}',B[0]+130,mix(B[1],Cc[1],.5)+10,{size:56,color:HC}));
  s+=fade(a,note('一段ずつ：縦² ＋ 横² ＝ 斜め²',40,140));
  s+=note('電車の 速さは 大きく 誇張（図は v ＝ 0.6）',40,900);
  return s;},
 // 25b 電車の時計の進み ＝ ホームの時計 × √(1−v²)
 [K+'pyth:clock']:(p,ctx)=>{const a=vseg(ctx,p,.05,.4),b=vseg(ctx,p,.4,.8);
  let s=nanjo()+fade(.35,triFig({base:1,vert:1}));
  s+=fade(a,label('ホームの 時計',40,180,{size:40,color:C.ink,weight:700})+rect(330,150,500,40,{fill:FAST,fo:.7,stroke:FAST,rx:4})+label('1',850,182,{size:40,color:FAST,weight:700}));
  s+=fade(a,label('電車の 時計',40,260,{size:40,color:C.ink,weight:700})+rect(330,230,400,40,{fill:HC,fo:.8,stroke:HC,rx:4}));
  s+=fade(b,card(150,330,700,150,{stroke:HC})+tex('\\times\\sqrt{1-v^2}',500,425,{size:80,color:HC}));
  s+=note('電車の 速さは 大きく 誇張（図は v ＝ 0.6）',40,900);
  return s;},
 // 26a v ＝ 7万7000分の1
 [K+'pyth:v']:(p,ctx)=>{const a=vseg(ctx,p,.1,.5),b=vseg(ctx,p,.5,.9);
  let s=nanjo()+satellite(500,180,.8)+fade(a,label('衛星の 速さ ÷ 光の 速さ',500,320,{size:44,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(a,label('3.9 km ÷ 30万 km',500,400,{size:44,color:C.dim,anchor:'middle',weight:700}));
  s+=fade(b,card(170,450,660,180,{stroke:C.v})+tex('v=\\frac{1}{77000}',500,560,{size:80,color:C.v}));
  return s;},
 // 26b √(1−v²) ≈ 1 − 100億分の0.8
 [K+'pyth:num']:(p,ctx)=>{const a=vseg(ctx,p,.05,.35),b=vseg(ctx,p,.35,.65),c=vseg(ctx,p,.65,.95);
  let s=nanjo()+tex('\\sqrt{1-v^2}',500,160,{size:80,color:HC});
  s+=fade(a,label('v × v ≈ 100億分の1.7',500,320,{size:48,color:C.v,anchor:'middle',weight:700}));
  s+=fade(b,label('ルートを とると、小さい 数は 半分に なる',500,420,{size:38,color:C.dim,anchor:'middle',weight:700}));
  s+=fade(c,card(110,480,780,150,{stroke:HC})+label('1 − 100億分の0.8',500,580,{size:60,color:HC,anchor:'middle',weight:700}));
  s+=fade(c,label('（0.99999999992）',500,700,{size:40,color:C.dim,anchor:'middle'}));
  return s;},
 // 27 8万6400 秒 積み重なって 約100万分の7秒
 [K+'gps:slow']:(p,ctx)=>{const a=vseg(ctx,p,0,.12),u=vseg(ctx,p,.08,.45),r=vseg(ctx,p,.6,.85),d=vseg(ctx,p,.8,1);
  let s=nanjo()+fade(a,label('1秒ごとに',60,150,{size:40,color:C.ink,weight:700})+label('100億分の0.8 秒 遅れる',60,220,{size:48,color:SLOW,weight:700}));
  const n=Math.round(86400*u),txt=n>=10000?`${Math.floor(n/10000)}万${n%10000}`:String(n);
  s+=fade(seg(u,0,.05),label('×',60,350,{size:52,color:C.ink,weight:700})+label(`${txt} 秒`,130,350,{size:60,color:C.t,weight:700})+fade(seg(u,.95,1),label('（1日）',520,350,{size:40,color:C.dim})));
  const cells=Math.floor(60*vseg(ctx,p,.3,.6));let q='';for(let i=0;i<cells;i++)q+=rect(60+i*13,400,11,46,{fill:SLOW,fo:.8,stroke:'none',rx:2});
  s+=q+fade(vseg(ctx,p,.3,.4),label('積み重なる',60,500,{size:38,color:C.dim,weight:700}));
  s+=fade(r,label('＝ 約100万分の7秒',60,620,{size:56,color:SLOW,weight:700}));
  s+=fade(r,label('−7 μs／日',60,700,{size:44,color:SLOW,weight:700}));
  s+=fade(d,arrow(780,580,780,780,{color:SLOW,w:10,head:30,g:d})+label('遅れ',810,700,{size:44,color:SLOW,weight:700})+satellite(780,520,.5));
  s+=note('8万6400 × 100億分の0.8 ≈ 100万分の7',40,900,{g:r});
  return s;},
 // 28 1971年 旅客機の実験：計算と合っていた（実験・予言と一致）
 [K+'hk:fly']:(p,ctx)=>nanjo()+hkScene(vseg(ctx,p,.1,.7),{intro:vseg(ctx,p,0,.15),routes:vseg(ctx,p,.1,.3)})+tag('結果',500,845,{anchor:'middle',g:vseg(ctx,p,.75,.95),text:'予言と 一致'}),
 // ===== 次のモヤモヤ =====
 [K+'gps:fast']:(p,ctx)=>{const t=cueT(p,ctx),f=vseg(ctx,p,.6,.85);
  let s=satClockScene(t,{satTurns:RG*1.15*t,slow:1,slowDim:1,fast:f,fastText:seg(f,.5,1)});
  s+=fade(vseg(ctx,p,0,.2),label('計算：1日に 約100万分の7秒 遅れる',500,620,{size:40,color:SLOW,anchor:'middle',weight:700,opacity:.6}));
  s+=fade(f,plate('実際：1日に 約100万分の38秒 速い',500,720,{size:44,color:FAST,anchor:'middle'})+label('＋38 μs／日',500,800,{size:48,color:FAST,anchor:'middle',weight:700}));
  s+=fade(vseg(ctx,p,.05,.3),plate('実際の 衛星',960,60,{size:40,color:C.ink,anchor:'end'}));
  s+=note('針の 進み方は 大きく 誇張',40,900);
  return s;},
 [K+'hint:body']:(p,ctx)=>{const t=cueT(p,ctx),a=vseg(ctx,p,.4,.6),b=vseg(ctx,p,.6,.85),c=vseg(ctx,p,.85,1),col='#c4cde0';
  let s=fade(vseg(ctx,p,0,.3),label('何かが、時計を 速く 進ませて いる',500,80,{size:40,color:FAST,anchor:'middle',weight:700}));
  s+=fade(vseg(ctx,p,.3,.45),plate('ヒント',40,150,{size:44,color:HC}));
  s+=ground(150,650,830)+dot(400,250,46,col)+line(400,300,400,570,{color:col,w:14})+line(400,570,330,825,{color:col,w:14})+line(400,570,470,825,{color:col,w:14})+line(400,350,300,480,{color:col,w:12})+line(400,350,500,480,{color:col,w:12});
  s+=fade(a,line(450,250,610,250,{color:C.dim,w:3,dash:'8 8'})+clock(690,250,70,{turns:RG*t})+label('頭',790,200,{size:40,color:C.ink,weight:700}));
  s+=fade(a,line(480,800,610,760,{color:C.dim,w:3,dash:'8 8'})+clock(690,740,70,{turns:RG*t})+label('足',790,690,{size:40,color:C.ink,weight:700}));
  s+=fade(b,plate('進み方が ほんの 少し 違う',500,490,{size:40,color:HC}));
  s+=note('違いは とても 小さく、針では 見えない',40,900,{g:c});
  return s;},
 [K+'next:q']:(p,ctx)=>{const t=cueT(p,ctx),g=vseg(ctx,p,0,.3);
  let s=fade(g,satellite(330,560,.8)+clock(330,740,100,{turns:RG*1.15*t})+arrow(520,820,520,560,{color:FAST,w:10,head:30})+label('？',600,700,{size:90,color:FAST,weight:700}));
  s+=finalCard(['その 犯人は？'],vseg(ctx,p,.3,.7),{y:120,size:64});
  return s;},
};
// 地上と衛星の時計（冒頭）
function clockPair(t){
 return ground(150,430,500)+clock(290,330,140,{turns:RG*t})+label('地上',290,560,{size:40,color:'#c4cde0',anchor:'middle',weight:700})
  +satellite(710,95,.6)+clock(710,330,140,{turns:RG*.85*t})+label('衛星',710,560,{size:40,color:SATG,anchor:'middle',weight:700});}
// 追いかける・逃げる、どちらも同じ（舞台の上の左は難所の札のために空ける）
function chase(t,g1,m1,g2,m2,same){
 let s='';const lx=((t*300)%620)+340,lx2=820-((t*300)%420);
 s+=fade(g1,label('光を 追いかけて 測る',40,150,{size:40,color:C.ink,weight:700})+ground(40,960,360)+person(150,355,{s:1.2,lean:1,run:t*9})+arrow(190,280,290,280,{color:C.v,w:6,head:20})+wavy(lx-150,lx,280,{amp:16,lam:44,w:5})+dot(lx,280,15,LIGHT)+arrow(lx+18,280,lx+80,280,{color:LIGHT,w:5,head:20}));
 s+=fade(m1,meter(500,170,'30万 km/s'));
 s+=fade(g2,label('光から 逃げて 測る',40,500,{size:40,color:C.ink,weight:700})+ground(40,880,720)+person(150,715,{s:1.2,lean:-1,run:t*9})+arrow(110,640,30,640,{color:C.v,w:6,head:20})+wavy(lx2,lx2+150,640,{amp:16,lam:44,w:5})+dot(lx2,640,15,LIGHT)+arrow(lx2-18,640,lx2-80,640,{color:LIGHT,w:5,head:20}));
 s+=fade(m2,meter(420,520,'30万 km/s'));
 s+=fade(same,plate('いつも 同じ',500,820,{size:48,color:HC,anchor:'middle'}));
 return s;}
// お互いさま：左右対称の図。左＝ホームの人から見た電車の時計、右＝電車の人から見たホームの時計
function mutualFig(t,gl,gr,ans){
 const box=(x,title,own,other,g,ga,q)=>{let s=rect(x,100,440,520,{fill:'#101a30',fo:.9,stroke:C.faint,rx:18})+label(title,x+220,160,{size:38,color:C.ink,anchor:'middle',weight:700});
  s+=person(x+90,560,{s:1.4})+label(own,x+90,600,{size:36,color:C.dim,anchor:'middle'});
  s+=clock(x+300,360,90,{turns:RG*(q?1:.8)*t,col:q?C.faint:C.ink})+label(other,x+300,500,{size:38,color:C.ink,anchor:'middle',weight:700});
  s+=q?fade(1-ga,label('？',x+300,390,{size:96,color:HC,anchor:'middle',weight:700})):'';
  s+=fade(ga,label('ゆっくり',x+300,555,{size:40,color:SLOW,anchor:'middle',weight:700}));
  return fade(g,s);};
 return box(40,'ホームから 見ると','ホームの人','電車の 時計',gl,1,false)+box(520,'電車から 見ると','電車の人','ホームの 時計',gr,ans,ans<=0);}

// ---- 部品（cue の外で使う） ----
// マイケルソンとモーリーの装置（干渉計）：光源・光を分ける斜めの鏡・直角の2本の腕の鏡・重なる所。beam＝光の線の進み
const MI={x:500,y:390,A:220},FR={x:180,y:650,w:600,h:100};
function miApp(cx,cy,{beam=1}={}){
 const A=MI.A;let s=rect(cx-340,cy-A-40,A+340+60,A+260,{fill:'#3a3f4a',fo:.45,stroke:'#6b7385',sw:3,rx:20});
 s+=rect(cx-320,cy-28,56,56,{fill:'#e8b84a',fo:.9,stroke:'#ffe08a',rx:8});
 if(beam>0)s+=fade(.55,draw([[cx-264,cy],[cx,cy]],seg(beam,0,.2),{color:LIGHT,w:4})+draw([[cx,cy],[cx+A,cy]],seg(beam,.2,.4),{color:LIGHT,w:4})+draw([[cx,cy],[cx,cy-A]],seg(beam,.2,.4),{color:LIGHT,w:4})+draw([[cx,cy],[cx,cy+150]],seg(beam,.75,.9),{color:LIGHT,w:4}));
 s+=line(cx-34,cy+34,cx+34,cy-34,{color:MIR,w:8});
 s+=line(cx+A,cy-50,cx+A,cy+50,{color:MIR,w:10})+line(cx-50,cy-A,cx+50,cy-A,{color:MIR,w:10});
 s+=rect(cx-40,cy+150,80,24,{fill:'#9aabc7',fo:.9,stroke:'#9aabc7',rx:4});
 return s;
}
// 光の一かたまりの動き：光源→分ける鏡（0〜.2）→2本の腕を往復（.2〜.75）→重なって下へ（.75〜.9）
function miPulse(u){
 const {x,y,A}=MI;if(u<=0||u>=.95)return '';
 if(u<.2){return photon(mix(x-264,x,u/.2),y);}
 if(u<.75){const v=(u-.2)/.55,d=A*tri(2*v);return photon(x+d,y)+photon(x,y-d);}
 return photon(x,mix(y,y+150,clamp((u-.75)/.15)));
}
// もし腕で速さが違えば：縦の腕の光が先に戻り、横の腕の光が遅れて戻る
function miRace(u){
 const {x,y,A}=MI;if(u<=0)return '';
 const d1=A*tri(clamp(2*u,0,2)),d2=A*tri(clamp(2*u*.85,0,2));
 let s=photon(x,y-d1)+photon(x+d2,y);
 if(u>.6)s+=fade(seg(u,.6,.8),label('先に 戻る',x-30,y-60,{size:36,color:LIGHT,anchor:'end',weight:700})+label('遅れる',x+d2,y+60,{size:36,color:LIGHT,anchor:'middle',weight:700}));
 return s;
}
// 縞（明暗の帯）。phase＝ずれ（ラジアン）
function fringes(x,y,w,h,phase,g=1){
 if(g<=0)return '';
 let s=rect(x,y,w,h,{fill:'#000000',fo:.9,stroke:C.faint,rx:8});
 for(let i=0;i<w;i+=6){const b=(1+Math.cos(2*Math.PI*i/90+phase))/2;s+=rect(x+i,y+4,6,h-8,{fill:LIGHT,fo:n1(.9*b*b),stroke:'none',rx:0});}
 return fade(g,s);
}
// 波の列（x 140〜900）。ph＝ずれ（ラジアン）、amp＝高さ
function waveRow(y,ph,col,amp=40){const pts=[];for(let x=140;x<=900;x+=4)pts.push([x,y-amp*Math.cos(2*Math.PI*(x-140)/95-ph)]);return draw(pts,1,{color:col,w:5});}
function meter(x,y,text){
 return rect(x,y,440,96,{fill:CARD,fo:.95,stroke:LIGHT,sw:3,rx:14})+label('測ると',x+20,y+62,{size:36,color:C.dim})+label(text,x+420,y+66,{size:44,color:LIGHT,anchor:'end',weight:700});
}
function sentStart(ctx,i){
 const r=(ctx?.cue?.reading??'').split('。').map(x=>x.replace(/\s/g,'')).filter(Boolean);
 if(r.length<2)return 0;const tot=r.reduce((a,x)=>a+x.length,0);let acc=0;for(let k=0;k<i;k++)acc+=r[k].length;return acc/tot*voiceEnd(ctx);
}
// アインシュタインの札（顔は描かない）と、2枚の考えの札
function einCards(g0,g1,g2,g3,t=0,{year=1}={}){
 let s=fade(g0*year,label('1905年',40,90,{size:56,color:HC,weight:700}));
 s+=fade(g0,card(200,115,600,140,{stroke:C.faint})+dot(270,165,26,'#c4cde0')+`<path d="M226 245 q44 -70 88 0Z" fill="#c4cde0"/>`+label('アインシュタイン',340,205,{size:46,color:C.ink,weight:700}));
 s+=fade(g1,card(80,370,840,130,{stroke:LIGHT})+label('光の 速さ：変わらない',500,452,{size:48,color:LIGHT,anchor:'middle',weight:700}));
 s+=tag('実験',90,342,{g:g1,text:'事実として 受け入れる',size:36});
 s+=fade(g2,arrow(500,515,500,580,{color:C.dim,w:6,head:22}));
 s+=fade(g2,card(80,600,760,130,{stroke:HC})+label('時間：変わる',360,682,{size:52,color:HC,anchor:'middle',weight:700})+clock(730,665,48,{turns:t/8}));
 s+=tag('仮説',460,820,{g:g3,anchor:'middle',text:'アインシュタインの 考え',size:40});
 return s;
}
// 旅客機の実験：北極の上から見た地球と、東回り・西回りの2機。u＝一周の進み（0→1）
function hkScene(u,{intro=1,routes=1}={}){
 const [cx,cy]=[500,470],Re=170,Rp=290,start=-Math.PI/2;
 let s=fade(intro,label('1971年',260,64,{size:48,color:HC,weight:700}));
 s+=tag('実験',960,70,{anchor:'end',g:intro});
 s+=earth(cx,cy,Re)+clock(cx,cy,46,{turns:u*3})+fade(intro,plate('地上の 時計',cx,cy+100,{size:36,anchor:'middle'}));
 s+=ring(cx,cy,Rp,{color:'#5c6f90',w:2,dash:'8 10'});
 s+=fade(routes,arcArrow(cx,cy,Rp+45,.25,.95,{color:C.x,w:5})+label('東回り',960,250,{size:40,color:C.x,anchor:'end',weight:700}));
 s+=fade(routes,arcArrow(cx,cy,Rp+45,Math.PI-.25,Math.PI-.95,{color:C.E,w:5})+label('西回り',40,250,{size:40,color:C.E,weight:700}));
 const ea=start+2*Math.PI*u,wa=start-2*Math.PI*u,[ex,ey]=P(cx,cy,Rp,ea),[wx,wy]=P(cx,cy,Rp,wa);
 s+=plane(ex,ey,ea*180/Math.PI+90,{col:C.x})+plane(wx,wy,wa*180/Math.PI-90,{col:C.E});
 s+=fade(intro,plate('原子時計を 乗せる',500,130,{size:38,anchor:'middle'}));
 s+=note('北極の 上から 見た 地球',500,905,{anchor:'middle',g:intro});
 return s;
}

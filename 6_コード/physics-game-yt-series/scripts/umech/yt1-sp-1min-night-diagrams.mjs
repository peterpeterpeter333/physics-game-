// 「1分の疑問」08 夜空はなぜ暗い (ys-sp-1min-night) — 図。Stage 1200×515。
// 形（カウンター・Q カード・疑問カード・黄色の枠の問い）は 01 の yt1-sp-1min-common.mjs。小さな部品は yt1-sp-1min-c0609-common.mjs。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,poly,clamp,mix} from './anim.mjs';
import {wrap,qcard,finalQ,cueT,vseg,HC} from './yt1-sp-1min-common.mjs';
import {card,tag,note,cross} from './yt1-sp-1min-c0609-common.mjs';

const K='sp-1min-night:';
const PI=Math.PI, STAR='#fff3c4', SEEN=C.x;
// deterministic pseudo-random
const rnd=i=>{const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);};
const STARS=Array.from({length:90},(_,i)=>[rnd(i)*1200,rnd(i+500)*515,.8+rnd(i+900)*1.6]);
const stars=(g=1,clipW=1200)=>fade(g,STARS.filter(([x])=>x<clipW).map(([x,y,r])=>dot(x,y,r,'#dfe6f5',.5+.5*rnd(x))).join(''));
const clipR=(id,x,y,w,h,inner)=>`<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12"/></clipPath><g clip-path="url(#${id})">${inner}</g>`;
function starShape(x,y,r,color=STAR,g=1){const pts=[];for(let i=0;i<10;i++){const a=-PI/2+i*PI/5,R=i%2?r*.45:r;pts.push([x+R*Math.cos(a),y+R*Math.sin(a)]);}return fade(g,poly(pts,{fill:color,fo:1}));}
// small Earth
function earth(x,y,r,g=1){return fade(g,dot(x,y,r,'#2f6fd6')+dot(x-r*.3,y-r*.2,r*.35,'#4fa36a')+dot(x+r*.35,y+r*.3,r*.28,'#4fa36a'));}

// ---------- forest (top view) and the sky full of stars ----------
const FX=60,FY=110,FW=500,FH=340,FC=[FX+FW/2,FY+FH/2];
const TREES=(()=>{const T=[];let i=0;while(T.length<70&&i<4000){i++;const x=FX+10+rnd(i)*(FW-20),y=FY+10+rnd(i+77)*(FH-20),r=7+rnd(i+33)*5;
 if(Math.hypot(x-FC[0],y-FC[1])<45)continue;if(T.some(([a,b,c])=>Math.hypot(a-x,b-y)<c+r+10))continue;T.push([x,y,r]);}return T;})();
function rayHit(a){const dx=Math.cos(a),dy=Math.sin(a);for(let s=20;s<700;s+=2){const x=FC[0]+dx*s,y=FC[1]+dy*s;
 if(x<FX||x>FX+FW||y<FY||y>FY+FH)return [x,y,false];for(const [tx,ty,tr] of TREES)if(Math.hypot(x-tx,y-ty)<=tr)return [x,y,true];}return [FC[0],FC[1],false];}
const RAYS=Array.from({length:48},(_,i)=>i*2*PI/48+.05).map(a=>rayHit(a)).filter(r=>r[2]);
function forest(p,ctx,{g=1}={}){
 let s=rect(FX,FY,FW,FH,{fill:'#0f2418',fo:1,stroke:'#2c5a3b',sw:2,rx:12});
 s+=TREES.map(([x,y,r])=>dot(x,y,r+5,'#2f6b3f',.6)+dot(x,y,r,'#7a5a3a')).join('');
 s+=dot(FC[0],FC[1],10,'#fff')+ring(FC[0],FC[1],14,{color:'#fff',w:2});
 const u=vseg(ctx,p,.45,.65);
 RAYS.forEach(([x,y,hit],i)=>{const k=clamp(u*(RAYS.length*.3+1)-i*.3,0,1);if(k>0)s+=draw([[FC[0],FC[1]],[x,y]],k,{color:HC,w:2.5})+(k>=1&&hit?dot(x,y,5,HC):'');});
 s+=label('森の中から 見ると',FX+FW/2,FY+FH+40,{size:26,color:C.dim,anchor:'middle',weight:700});
 return fade(g,s);
}
// sky panel: star layers fill in until the whole panel is starlight; fill=0..1
const SX=640,SY=110,SW=500,SH=340;
const SKY=Array.from({length:900},(_,i)=>[SX+rnd(i+3000)*SW,SY+rnd(i+6000)*SH,rnd(i+9000)]);
function skyPanel(fill,{g=1,id='sp',label2=true,bright=0}={}){
 let s=rect(SX,SY,SW,SH,{fill:'#050a18',fo:1,stroke:C.faint,sw:2,rx:12});
 const n=Math.round(mix(40,900,fill));
 s+=clipR(id,SX,SY,SW,SH,SKY.slice(0,n).map(([x,y,d],i)=>dot(x,y,mix(2.2,7.5,fill)*(.5+.6*d),STAR,mix(.9,.75,fill))).join('')+rect(SX,SY,SW,SH,{fill:'#fffbe8',fo:bright,stroke:'none',rx:0}));
 if(label2)s+=label('星で 埋め尽くされた 空',SX+SW/2,SY+SH+40,{size:26,color:C.dim,anchor:'middle',weight:700});
 return fade(g,s);
}

// ---------- the reach of light: Earth in the middle, sphere of light that has arrived ----------
const OC=[330,290];
function reach(R,{g=1,t=0}={}){
 let s=stars(.5);
 s+=`<circle cx="${OC[0]}" cy="${OC[1]}" r="${R}" fill="${SEEN}" fill-opacity=".07" stroke="${SEEN}" stroke-width="3"/>`;
 for(const [x,y] of [[OC[0]+60,OC[1]-70],[OC[0]-110,OC[1]+40],[OC[0]+130,OC[1]+90],[OC[0]-60,OC[1]-140],[OC[0]+170,OC[1]-30]])if(Math.hypot(x-OC[0],y-OC[1])<R-8)s+=starShape(x,y,11);
 s+=earth(OC[0],OC[1],16);
 return fade(g,s);
}
// a light wave from a far star toward Earth, stretched on the way (blue → red → invisible)
function stretchedWave(u,{g=1,x0=1140,x1=640,y=330,t=0}={}){
 const n=220,pts=[];let ph=0;
 const col=k=>k<.4?'#6fa8ff':k<.75?'#ff6b5a':'#7a8399';
 let s='';
 for(let i=0;i<n;i++){const k=i/(n-1),x=mix(x0,x1,k),lam=mix(28,90,k);ph+=(Math.abs(x1-x0)/n)/lam*2*PI;pts.push([x,y+22*Math.sin(ph-t*4)]);}
 const vis=Math.floor(u*n);
 for(let i=0;i<vis-1;i++){const k=i/(n-1);s+=line(pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1],{color:col(k),w:4,dash:k>=.75?'':''});}
 return fade(g,s);
}

export const sp1minNightDiagrams={
 // 1 — Q：星空
 [K+'q']:wrap(1,(p,ctx)=>{
  const t=cueT(p,ctx);
  let bg=stars();
  bg+=fade(vseg(ctx,p,.0,.2),poly([[0,515],[0,450],[180,420],[360,445],[560,410],[760,440],[980,415],[1200,450],[1200,515]],{fill:'#05080f',fo:1}));
  const k=vseg(ctx,p,.6,.75);
  bg+=fade(k,dot(1030,470,40,'#ffb347',.9)+rect(940,450,180,65,{fill:'#05080f',fo:1,stroke:'none',rx:0})+label('太陽が 沈むから？',1030,375,{size:28,color:C.dim,anchor:'middle',weight:700}));
  bg+=fade(vseg(ctx,p,.8,.9),line(920,366,1140,366,{color:C.a,w:5}));
  return qcard(['夜空は、なぜ 暗い？'],p,t,{bg,y0:200});
 },{fadeIn:false,roll:0}),

 // 2 — 森のたとえ → 星で埋め尽くされた空
 [K+'forest']:wrap(1,(p,ctx)=>{
  let s=forest(p,ctx,{g:vseg(ctx,p,0,.1)});
  s+=fade(vseg(ctx,p,.68,.76),arrow(575,280,625,280,{color:C.dim,w:5,head:16}));
  s+=skyPanel(vseg(ctx,p,.72,1),{g:vseg(ctx,p,.68,.76)});
  s+=fade(vseg(ctx,p,.25,.38),label('どの 視線も、いつか 木の 幹に 当たる',600,95,{size:26,color:HC,anchor:'middle',weight:700}));
  return s;
 },{pill:'夜空は、なぜ暗い？',bridge:.97}),

 // 3 — もし：昼のようにまぶしい夜空
 [K+'white']:wrap(2,(p,ctx)=>{
  const b=vseg(ctx,p,.45,.85);
  let s=skyPanel(1,{bright:.85*b,label2:false});
  s+=forest(1,{t:0,dur:1},{g:.35});
  s+=fade(b,label('昼のように まぶしい？',SX+SW/2,SY+SH/2+10,{size:40,color:'#5a4a10',anchor:'middle',weight:700}));
  s+=note('もし 宇宙が 無限で、星が どこまでも あったら',SX-40,495,vseg(ctx,p,.5,.6),HC);
  return s;
 },{fadeIn:false,roll:0,q:{end:.4,lines:['夜空は、まぶしく 光るはず？'],text:'夜空は、まぶしく光るはず？'}}),

 // 4 — 予想と実際の矛盾：オルバースのパラドックス
 [K+'paradox']:wrap(2,(p,ctx)=>{
  let s=card(60,100,480,300,clipR('pw',72,140,456,248,rect(72,140,456,248,{fill:'#fffbe8',fo:.92,stroke:'none',rx:0})),1,HC)+label('予想：まぶしい',300,135,{size:28,color:HC,anchor:'middle',weight:700});
  s+=card(660,100,480,300,clipR('pd',672,140,456,248,rect(672,140,456,248,{fill:'#050a18',fo:1,stroke:'none',rx:0})+STARS.slice(0,40).map(([x,y,r])=>dot(672+x*.38,140+y*.48,r,'#dfe6f5')).join('')),vseg(ctx,p,.05,.2),C.x)+fade(vseg(ctx,p,.05,.2),label('実際：暗い',900,135,{size:28,color:C.x,anchor:'middle',weight:700}));
  s+=fade(vseg(ctx,p,.25,.35),label('≠',600,280,{size:80,color:C.a,anchor:'middle',weight:700}));
  s+=tag('オルバースの パラドックス',600,465,{g:vseg(ctx,p,.5,.65),size:32});
  return s;
 },{pill:'夜空は、まぶしく光るはず？',bridge:.97}),

 // 5 — 宇宙に年齢がある：光の届いた範囲が広がる
 [K+'age']:wrap(3,(p,ctx)=>{
  const t=cueT(p,ctx),R=mix(20,210,vseg(ctx,p,.45,1));
  let s=reach(R,{t});
  s+=fade(vseg(ctx,p,.8,.95),label('光が 届いた 範囲',OC[0],OC[1]+R-50,{size:26,color:SEEN,anchor:'middle',weight:700}));
  s+=card(700,150,440,170,label('宇宙の 年齢',920,205,{size:30,color:C.dim,anchor:'middle',weight:700})+label('約 138億年',920,275,{size:52,color:HC,anchor:'middle',weight:700}),vseg(ctx,p,.5,.62),HC);
  return s;
 },{roll:0,q:{end:.3,lines:['矛盾を 解く 鍵は？'],text:'矛盾を解く鍵は？'}}),

 // 6 — 遠すぎる星の光はまだ届かない／遠くの光は引き伸ばされて見えなくなる
 [K+'reach']:wrap(3,(p,ctx)=>{
  const t=cueT(p,ctx);
  let s=reach(210,{t});
  // a far star outside the sphere, its light still on the way
  const fx=600,fy=110,u=vseg(ctx,p,.1,.4);
  s+=starShape(fx,fy,14,STAR,vseg(ctx,p,.05,.15));
  const ex=mix(fx,OC[0]+150,u*.55),ey=mix(fy,OC[1]-150,u*.55);
  s+=fade(vseg(ctx,p,.1,.2),line(fx,fy,ex,ey,{color:STAR,w:3,dash:'8 6'})+dot(ex,ey,6,STAR));
  s+=fade(vseg(ctx,p,.3,.4),label('まだ 届いていない',fx+20,fy+60,{size:26,color:STAR,weight:700}));
  // stretched wave on the right
  const w=vseg(ctx,p,.5,.95);
  s+=fade(vseg(ctx,p,.5,.58),label('宇宙の 膨張で 引き伸ばされる',900,240,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=stretchedWave(w,{t,x0:1160,x1:640,y:330});
  s+=fade(vseg(ctx,p,.6,.7),label('青',1130,395,{size:26,color:'#6fa8ff',anchor:'middle',weight:700}));
  s+=fade(vseg(ctx,p,.72,.8),label('赤',900,395,{size:26,color:'#ff8a7e',anchor:'middle',weight:700}));
  s+=fade(vseg(ctx,p,.88,.96),label('目に 見えない 光',720,410,{size:26,color:'#aab3c7',anchor:'middle',weight:700}));
  return s;
 },{fadeIn:false,pill:'矛盾を解く鍵は？'}),

 // 7 — 夜空の暗さ ＝ 宇宙に始まりがある証拠
 [K+'proof']:wrap(3,(p,ctx)=>{
  let s=stars();
  s+=fade(vseg(ctx,p,0,.2),poly([[0,515],[0,450],[180,420],[360,445],[560,410],[760,440],[980,415],[1200,450],[1200,515]],{fill:'#05080f',fo:1}));
  s+=card(200,140,800,200,label('夜空が 暗い',600,215,{size:44,color:C.ink,anchor:'middle',weight:700})+label('＝ 宇宙に 始まりが ある 証拠の 一つ',600,290,{size:38,color:HC,anchor:'middle',weight:700}),vseg(ctx,p,.15,.35),HC);
  return s;
 },{bridge:.95,pill:'矛盾を解く鍵は？'}),

 // 8 — 次の疑問：見られる一番遠くからの光は？
 [K+'next']:wrap(4,(p,ctx)=>{
  const t=cueT(p,ctx),g=vseg(ctx,p,.02,.15),cx=600,cy=520;
  let s=stars(.6);
  const k=vseg(ctx,p,.35,.55);
  for(let i=1;i<=4;i++)s+=fade(k,`<path d="M${cx-i*120} ${cy} A${i*120} ${i*120} 0 0 1 ${cx+i*120} ${cy}" fill="none" stroke="${SEEN}" stroke-width="2" stroke-opacity="${.5-i*.08}" stroke-dasharray="6 8"/>`);
  s+=earth(cx,cy-18,18,k);
  const e=.5+.5*Math.sin(t*3);
  s+=fade(vseg(ctx,p,.55,.7),`<path d="M${cx-560} ${cy} A560 560 0 0 1 ${cx+560} ${cy}" fill="none" stroke="${HC}" stroke-width="${4+3*e}" stroke-opacity=".8"/>`+label('？',1110,330,{size:60,color:HC,anchor:'middle',weight:700})+label('？',90,330,{size:60,color:HC,anchor:'middle',weight:700}));
  s+=finalQ(['私たちが 見られる、','一番 遠くからの 光は 何？'],g,{y:70,sc:.9+.1*g});
  return s;
 },{roll:0}),
};

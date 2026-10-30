// 技術の疑問の鎖 第1話（ys-chain-01）「琥珀と磁石は、同じ力なのか？」— 図。縦長の舞台 1000×920（vert-v1）。
// 3D：scripts/blender/gilbert.py の連番の PNG（blender-clip.mjs で貼る）。
//   shot：vers-build（台・軸・針が組み上がる）・vers-spin（針が回る）・vers-amber（琥珀を近づける → 針が琥珀へ回る）・
//         vers-metal（金属の棒 → 回らない）・terella（磁石の球）・terella-needles（針を赤道から北の端へ）・terella-london（ロンドンの緯度の針だけ残す）。
// テレラの針の傾きは gilbert.py が双極子の式で計算して置いた（tan I＝2 tan λ）。カメラは針の並ぶ面に正面から向けたので、
//   画面の角 ＝ 計算の角。ロンドンの針（51.5°、68.3°）の傾きの弧は、Blender のアンカー（針の中心・北の端・水平の向き）から描く。
//   ノーマンの測定（約72度）は別の図に 72° で描き、札「事実」で分ける。双極子の値に「約72度」とは書かない。
// 粒の図（後に分かったこと）は大きく誇張して描き、注記を付ける。
import {C,seg,clamp,mix,fade,label,line,rect,dot,ring,draw,arrow,poly,scaleAt,W,H,HC,LIGHT,cueT,voiceEnd,vseg,swin,note,plate,bigQ,finalCard,
 jw,ORANGE,GREEN,RED_,PURPLE,CYAN,AMBER,yearTag,when,fuda,logic,eqLine,letter,callout} from './yt1-chain-common.mjs';
import {bclip,bframe,banchor,bframes} from './blender-clip.mjs';
import {amber,magnet} from './yt1-chain-00-diagrams.mjs';

const K='chain01-';
const VERS={x:0,y:110,w:1000},TER={x:0,y:70,w:1000},TERS={x:-20,y:330,w:700};
const Y0='1600年ごろ イギリス',YG='1600年 ギルバート';
const A=(shot,name,u,o)=>banchor(shot,name,u,o);
const tg=(ctx,p)=>ctx&&typeof ctx.tg==='number'?ctx.tg:cueT(p,ctx);
const box=(x,y,w,h,{col='#8aa0c4',fo=.12,sw=3,rx=18}={})=>rect(x,y,w,h,{fill:'#131f38',fo:.95,stroke:col,sw,rx})+rect(x,y,w,h,{fill:col,fo,stroke:'none',rx});
const PLUS='#ff8a7e',MINUS='#6adfff';
const hash=i=>{const s=Math.sin(i*127.1+311.7)*43758.5453;return s-Math.floor(s);};

// ---- 2D の小物 ----
function straws(x,y,n,pull,tx,ty,{g=1}={}){ // わらくず：pull 0→1 で (tx,ty) へ寄る
 let s='';for(let i=0;i<n;i++){const x0=x+hash(i)*160-80,y0=y+hash(i+9)*50-25,k=clamp(pull*(1.2-hash(i+3)*.5)),xx=mix(x0,tx+hash(i+5)*60-30,k),yy=mix(y0,ty+hash(i+7)*40-20,k),a=hash(i+11)*180;
  s+=`<g transform="translate(${xx.toFixed(1)} ${yy.toFixed(1)}) rotate(${a.toFixed(0)})">${rect(-16,-3,32,6,{fill:'#e8d18f',fo:1,stroke:'none',rx:3})}</g>`;}
 return fade(g,s);
}
function nails(x,y,n,pull,tx,ty,{g=1}={}){
 let s='';for(let i=0;i<n;i++){const x0=x+i*48-((n-1)*24),y0=y+hash(i+2)*20,k=clamp(pull*(1.1-hash(i)*.3)),xx=mix(x0,tx+(i-(n-1)/2)*22,k),yy=mix(y0,ty+20,k),a=mix(80+hash(i+4)*20,0,k);
  s+=`<g transform="translate(${xx.toFixed(1)} ${yy.toFixed(1)}) rotate(${a.toFixed(0)})">${rect(-32,-4,64,8,{fill:'#aab4c8',fo:1,stroke:'none',rx:2})+rect(-34,-9,7,18,{fill:'#aab4c8',fo:1,stroke:'none',rx:2})}</g>`;}
 return fade(g,s);
}
function compassDial(x,y,r,ang,{g=1}={}){ // ang：針の北の端の向き（度、0＝上）
 let s=ring(x,y,r,{color:'#c4cde0',w:5,fill:'#131f38'});
 for(let k=0;k<8;k++){const a=k*Math.PI/4;s+=line(x+Math.sin(a)*r*.82,y-Math.cos(a)*r*.82,x+Math.sin(a)*r*.95,y-Math.cos(a)*r*.95,{color:C.dim,w:3});}
 s+=label('北',x,y-r-14,{size:38,color:C.ink,anchor:'middle',weight:700});
 s+=`<g transform="rotate(${ang} ${x} ${y})">${poly([[x,y-r*.78],[x-r*.12,y],[x+r*.12,y]],{fill:RED_,fo:1})+poly([[x,y+r*.78],[x-r*.12,y],[x+r*.12,y]],{fill:'#c4cde0',fo:1})}</g>`+dot(x,y,6,'#c9a45c');
 return fade(g,s);
}
function ship(x,y,{g=1}={}){
 let s=`<path d="M${x-150} ${y} L${x+150} ${y} L${x+110} ${y+60} L${x-110} ${y+60} Z" fill="#7a5634" stroke="#a8763f" stroke-width="3"/>`;
 s+=line(x,y,x,y-210,{color:'#a8763f',w:6})+poly([[x+6,y-200],[x+120,y-60],[x+6,y-60]],{fill:'#e8e2cf',fo:.9})+poly([[x-6,y-180],[x-100,y-60],[x-6,y-60]],{fill:'#e8e2cf',fo:.75});
 for(let k=0;k<5;k++)s+=draw(Array.from({length:30},(_,i)=>[x-260+k*110+i*4,y+80+6*Math.sin(i/3)]),1,{color:'#3f8cff',w:3,opacity:.6});
 return fade(g,s);
}
function star(x,y,r,{g=1,col=HC}={}){const P=[];for(let k=0;k<10;k++){const a=k*Math.PI/5-Math.PI/2,rr=k%2?r*.42:r;P.push([x+rr*Math.cos(a),y+rr*Math.sin(a)]);}return fade(g,poly(P,{fill:col,fo:1}));}
function person(x,y,{g=1,col='#8aa0c4'}={}){return fade(g,`<circle cx="${x}" cy="${y-120}" r="44" fill="${col}"/>`+`<path d="M${x-80} ${y+60} Q${x-80} ${y-60} ${x} ${y-62} Q${x+80} ${y-60} ${x+80} ${y+60} Z" fill="${col}"/>`+`<path d="M${x-40} ${y-80} Q${x} ${y-50} ${x+40} ${y-80}" fill="none" stroke="#e8e2cf" stroke-width="10"/>`);}
function glyph(kind,x,y){ // こすると引き寄せる物の絵
 if(kind==='ガラス')return rect(x-34,y-50,68,90,{fill:'#bfe3ff',fo:.35,stroke:'#bfe3ff',sw:3,rx:6});
 if(kind==='硫黄')return `<path d="M${x-40} ${y+30} L${x-25} ${y-30} L${x+15} ${y-40} L${x+42} ${y} L${x+25} ${y+38} Z" fill="#f2e04a" stroke="#c9b42a" stroke-width="3"/>`;
 if(kind==='ろう')return rect(x-22,y-50,44,90,{fill:'#e8735a',fo:.95,stroke:'#b9503b',sw:3,rx:8})+line(x,y-50,x,y-64,{color:C.ink,w:3});
 if(kind==='水晶')return poly([[x,y-58],[x+28,y-20],[x+20,y+40],[x-20,y+40],[x-28,y-20]],{fill:'#e8eef8',fo:.5,stroke:'#e8eef8',sw:3});
 if(kind==='宝石')return poly([[x-36,y-14],[x-18,y-38],[x+18,y-38],[x+36,y-14],[x,y+40]],{fill:'#b49bff',fo:.85,stroke:'#d8c9ff',sw:3});
 return '';
}
const mark=(ok,x,y,g=1)=>fade(g,ok?ring(x,y,30,{color:GREEN,w:7}):line(x-26,y-26,x+26,y+26,{color:RED_,w:8})+line(x+26,y-26,x-26,y+26,{color:RED_,w:8}));
// 地球（断面つき）
function earth(x,y,r,{g=1,cut=0,flow=0,t=0,mag=0}={}){
 let s=`<circle cx="${x}" cy="${y}" r="${r}" fill="#2f6fb5" stroke="#8ec0ff" stroke-width="4"/>`;
 s+=`<path d="M${x-r*.5} ${y-r*.6} q${r*.3} ${-r*.2} ${r*.5} ${r*.1} q${r*.1} ${r*.3} ${-r*.2} ${r*.4} z" fill="#5d9b5a" opacity=".9"/><path d="M${x+r*.2} ${y+r*.1} q${r*.4} ${-r*.1} ${r*.5} ${r*.3} q${-r*.1} ${r*.4} ${-r*.4} ${r*.2} z" fill="#5d9b5a" opacity=".9"/>`;
 if(cut>0)s+=fade(cut,`<path d="M${x} ${y} L${x} ${y-r} A${r} ${r} 0 0 1 ${x+r} ${y} Z" fill="#7a5634"/>`+`<path d="M${x} ${y} L${x} ${y-r*.55} A${r*.55} ${r*.55} 0 0 1 ${x+r*.55} ${y} Z" fill="#ff9f43"/>`+`<path d="M${x} ${y} L${x} ${y-r*.2} A${r*.2} ${r*.2} 0 0 1 ${x+r*.2} ${y} Z" fill="#ffe28a"/>`);
 if(flow>0){let f='';for(let k=0;k<3;k++){const rr=r*(.3+k*.07),a0=(t*40+k*120)%360;f+=`<path d="M${x+rr*Math.sin(a0*Math.PI/180*.25)} ${y-rr*Math.cos(a0*Math.PI/180*.25)}" />`;
   const pts=[];for(let i=0;i<=20;i++){const a=(a0+i*4)*Math.PI/180*.25;pts.push([x+rr*Math.sin(a),y-rr*Math.cos(a)]);}f+=draw(pts.filter(q=>q[0]>=x&&q[1]<=y),1,{color:'#fff1b8',w:5});}
  s+=fade(flow,f);}
 if(mag>0)s+=fade(mag,rect(x-14,y-r*.6,28,r*1.2,{fill:'#c4cde0',fo:.9,stroke:'none',rx:4})+rect(x-14,y,28,r*.6,{fill:RED_,fo:.9,stroke:'none',rx:4}));
 return fade(g,s);
}
// 傾きの弧：中心 c、水平の向き h（点）、針の向き n（点）
function dipArc(c,h,n,{g=1,r=70,col=HC,text=''}={}){
 if(g<=0)return '';
 const ah=Math.atan2(h[1]-c[1],h[0]-c[0]),an=Math.atan2(n[1]-c[1],n[0]-c[0]);
 let d=an-ah;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;
 const pts=[];for(let i=0;i<=24;i++){const a=ah+d*i/24;pts.push([c[0]+r*Math.cos(a),c[1]+r*Math.sin(a)]);}
 const hx=c[0]+(r+70)*Math.cos(ah),hy=c[1]+(r+70)*Math.sin(ah);
 return fade(g,line(c[0]-(r+40)*Math.cos(ah),c[1]-(r+40)*Math.sin(ah),hx,hy,{color:C.ink,w:3,dash:'10 8'})+draw(pts,1,{color:col,w:5})+(text?plate(text,c[0]+(r+40)*Math.cos(ah+d/2),c[1]+(r+40)*Math.sin(ah+d/2)+12,{size:38,color:col,anchor:'middle'}):''));
}
// ノーマンの測り方：自由に傾ける針（72°）
function normanNeedle(cx,cy,r,deg,{g=1}={}){
 const a=deg*Math.PI/180,dx=Math.cos(a)*r,dy=Math.sin(a)*r;
 let s=ring(cx,cy,r+18,{color:'#c4cde0',w:4})+line(cx-r-40,cy,cx+r+40,cy,{color:C.ink,w:3,dash:'10 8'})+label('水平',cx-r-30,cy+44,{size:36,color:C.dim,anchor:'start'});
 s+=line(cx-dx,cy-dy,cx,cy,{color:'#c4cde0',w:10})+line(cx,cy,cx+dx,cy+dy,{color:RED_,w:10})+dot(cx,cy,9,'#c9a45c');
 const pts=[];for(let i=0;i<=24;i++){const b=a*i/24;pts.push([cx+(r*.55)*Math.cos(b),cy+(r*.55)*Math.sin(b)]);}
 s+=draw(pts,1,{color:HC,w:5})+plate('約72度',cx+r*.75,cy+r*.42,{size:42,color:HC,anchor:'start'});
 return fade(g,s);
}
// 表（こすった物 ｜ 磁石）
const TROW=[['軽い物 なら 何でも','鉄 だけ'],['こすると 生まれる','ずっと 続く'],['湿気で 消える','湿気でも 消えない']];
function table(gs,{hl=-1,ga=[0,0,0],gb=[0,0,0]}={}){
 let s=fade(gs,line(500,150,500,820,{color:C.faint,w:3})+label('こすった 物',250,170,{size:44,color:AMBER,anchor:'middle',weight:700})+label('磁石',750,170,{size:44,color:'#c4cde0',anchor:'middle',weight:700})+line(40,200,960,200,{color:C.faint,w:3}));
 TROW.forEach(([a,b],i)=>{const y=290+i*190;if(i===hl)s+=rect(20,y-70,960,170,{fill:HC,fo:.06,stroke:HC,sw:2,rx:14});
  s+=fade(ga[i],label(['① 引き寄せる 相手','② 生まれ方','③ 消え方'][i],40,y-24,{size:36,color:C.dim,weight:700})+label(a,250,y+50,{size:42,color:C.ink,anchor:'middle',weight:700}))+fade(gb[i],label(b,750,y+50,{size:42,color:C.ink,anchor:'middle',weight:700}));});
 return s;
}
// 粒（後に分かったこと）
function particles(x,y,w,h,{plus=8,minus=8,shift=0,g=1,seed=0}={}){
 let s='';const n=Math.max(plus,minus);
 for(let i=0;i<plus;i++){const px=x+w*hash(i+seed),py=y+h*hash(i+seed+40);s+=label('＋',px,py+12,{size:36,color:PLUS,anchor:'middle',weight:700});}
 for(let i=0;i<minus;i++){const px=x+w*hash(i+seed+80)-shift,py=y+h*hash(i+seed+120);s+=label('−',px,py+12,{size:40,color:MINUS,anchor:'middle',weight:700});}
 return fade(g,s);
}

export const chain01Diagrams={
 // 1 琥珀とわらくず
 [K+'known:amber']:when(Y0,(p,ctx)=>{
  const pull=vseg(ctx,p,.35,.75);
  return fuda('その時に 分かっていたこと',500,110,{anchor:'middle'})+amber(500,330,1.6)+label('こすった 琥珀',650,250,{size:42,color:AMBER,anchor:'start',weight:700})+straws(500,700,9,pull,500,420)+label('わらくず',500,800,{size:40,color:'#e8d18f',anchor:'middle',weight:700,opacity:1-pull*.4})
   +note('2000年以上 前から',500,880,{anchor:'middle',g:vseg(ctx,p,.7,.95)});
 }),
 // 2 磁石の石と鉄くぎ
 [K+'known:magnet']:when(Y0,(p,ctx)=>{
  const pull=vseg(ctx,p,.35,.75);
  return fuda('その時に 分かっていたこと',500,110,{anchor:'middle'})+magnet(500,330,1.6)+label('磁石の 石',650,250,{size:42,color:'#c4cde0',anchor:'start',weight:700})+nails(500,720,5,pull,500,410)+label('鉄くぎ',500,820,{size:40,color:'#aab4c8',anchor:'middle',weight:700});
 }),
 // 3 同じ力？
 [K+'known:same']:when(Y0,(p,ctx)=>{
  const g2=swin(ctx,p,1,.2,.7);
  return fuda('その時に 分かっていたこと',500,110,{anchor:'middle'})+amber(300,380,1.3)+straws(300,560,6,1,300,470)+magnet(700,380,1.3)+nails(700,580,3,1,700,470)
   +fade(swin(ctx,p,0,.3,.8),label('触れずに 引き寄せる',500,700,{size:42,color:C.ink,anchor:'middle',weight:700}))
   +fade(g2,rect(120,230,760,400,{fill:'none',fo:0,stroke:HC,sw:5,rx:28})+plate('同じ 力？',500,240,{size:48,color:HC,anchor:'middle'}));
 }),
 // 4 船と方位磁針
 [K+'known:ship']:when(Y0,(p,ctx)=>{
  const g2=swin(ctx,p,1,.1,.6),wob=Math.sin(tg(ctx,p)*2)*6;
  return fuda('その時に 分かっていたこと',500,110,{anchor:'middle'})+ship(300,520)+compassDial(720,420,150,wob)+fade(g2,bigQ(720,760,1,120)+label('なぜ 北を 向く？',720,860,{size:40,color:HC,anchor:'middle',weight:700}));
 }),
 // 5 言い伝え
 [K+'known:myth']:when(Y0,(p,ctx)=>{
  const g1=vseg(ctx,p,0,.4),g2=vseg(ctx,p,.4,.85);
  let s=fade(g1,star(260,300,60)+label('北極星が 引く',260,440,{size:40,color:C.ink,anchor:'middle',weight:700})+draw([[260,370],[260,560]],1,{color:HC,w:3,dash:'8 8'})+compassDial(260,650,90,0));
  s+=fade(g2,poly([[600,560],[740,260],[880,560]],{fill:'#4b5568',fo:1,stroke:'#8aa0c4',sw:3})+poly([[700,345],[740,260],[780,345]],{fill:'#c4cde0',fo:.6})+label('北の果ての 磁石の山',740,640,{size:40,color:C.ink,anchor:'middle',weight:700}));
  s+=fuda('言い伝え',260,180,{anchor:'middle',g:g1})+fuda('言い伝え',740,180,{anchor:'middle',g:g2});
  return s;
 }),
 // 6 ギルバート
 [K+'gil:who']:when(YG,(p,ctx)=>{
  const g=vseg(ctx,p,.1,.5);
  const g2=vseg(ctx,p,.6,.95);
  return person(260,520,{g})+fade(g,label('ウィリアム・ギルバート',400,420,{size:42,color:C.ink,weight:700})+label('女王 エリザベス1世の 医者',400,490,{size:38,color:C.dim,weight:700}))
   +fade(g2,rect(130,160,740,110,{fill:'#131f38',fo:.95,stroke:C.faint,sw:2,rx:16})+label('言い伝え',250,232,{size:40,color:C.dim,anchor:'middle',weight:700})+line(165,240,335,200,{color:RED_,w:6})+label('を そのまま 信じない',380,232,{size:40,color:C.ink,weight:700}));
 }),
 [K+'gil:hand']:when(YG,(p,ctx)=>{
  return person(260,520)+label('ウィリアム・ギルバート',400,420,{size:42,color:C.ink,weight:700})+label('女王 エリザベス1世の 医者',400,490,{size:38,color:C.dim,weight:700})
   +fade(vseg(ctx,p,.1,.6),box(150,680,700,110,{col:GREEN})+label('自分の 手で 確かめる',500,752,{size:48,color:GREEN,anchor:'middle',weight:700}));
 }),
 // 7 疑問①②
 [K+'q:two']:when(YG,(p,ctx)=>{
  const g=swin(ctx,p,1,0,.6);
  return fade(swin(ctx,p,0,0,.6),label('疑問は 二つ',500,140,{size:46,color:C.dim,anchor:'middle',weight:700}))+fade(g,fuda('疑問',80,260,{text:'①'})+amber(260,420,1.1)+label('＝？',500,440,{size:70,color:HC,anchor:'middle',weight:700})+magnet(740,420,1.1)+label('同じ 力なのか',500,560,{size:44,color:HC,anchor:'middle',weight:700}));
 }),
 [K+'q:north']:when(YG,(p,ctx)=>{
  const g=vseg(ctx,p,.1,.6),wob=Math.sin(tg(ctx,p)*2)*5;
  return fuda('疑問',80,260,{text:'①',color:C.dim})+fade(.5,amber(260,420,1.1)+label('＝？',500,440,{size:70,color:C.dim,anchor:'middle',weight:700})+magnet(740,420,1.1))
   +fade(g,fuda('疑問',80,640,{text:'②'})+compassDial(320,760,110,wob)+label('なぜ 北を 向くのか',480,780,{size:44,color:HC,weight:700}));
 }),
 // 8 ヴェルソリウム（3D）
 [K+'vers:build']:when(YG,(p,ctx)=>bclip('vers-build',.75*vseg(ctx,p,0,1),VERS)+fuda('試作',960,110,{anchor:'end'})+plate('弱い 引き寄せでも 分かる 道具',500,880,{size:40,anchor:'middle',g:vseg(ctx,p,.4,.8)})),
 [K+'vers:parts']:when(YG,(p,ctx)=>{
  const u=.75+.25*vseg(ctx,p,0,.4),pv=A('vers-build','pivot',u,VERS),pm=A('vers-build','pinMid',u,VERS),tl=A('vers-build','tipL',u,VERS);
  return bclip('vers-build',u,VERS)+fuda('試作',960,110,{anchor:'end'})+callout('軽い 金属の 針',tl[0]+40,tl[1]+4,200,180,{g:vseg(ctx,p,0,.3)})+callout('とがった 軸',pm[0],pm[1],760,pm[1]+60,{g:vseg(ctx,p,.3,.6)})+callout('くるりと 回る',pv[0],pv[1]-10,700,170,{g:vseg(ctx,p,.6,.9),color:HC});
 }),
 // 9 針はただの金属。回る
 [K+'spin:free']:when(YG,(p,ctx)=>{
  const u=swin(ctx,p,1,0,1);
  return bclip('vers-spin',u,VERS)+fuda('試作',960,110,{anchor:'end'})+plate('磁石に していない、ただの 金属',500,880,{size:40,anchor:'middle',g:swin(ctx,p,0,.2,.6)})+note('動きは ゆっくりに している',40,830,{g:swin(ctx,p,1,0,.3)});
 }),
 // 10 琥珀を近づける（3D）
 [K+'amb:near']:when(YG,(p,ctx)=>{
  const u=swin(ctx,p,0,0,1),am=A('vers-amber','amber',u,VERS);
  return bclip('vers-amber',u,VERS)+fuda('実験',960,110,{anchor:'end'})+callout('こすった 琥珀',am[0],am[1]+40,780,am[1]+250,{g:swin(ctx,p,0,0,.25),color:AMBER})
   +fade(swin(ctx,p,1,0,.6),bigQ(160,330,1,130)+label('ほかの 物は？',160,400,{size:40,color:HC,anchor:'middle',weight:700}));
 }),
 // 11 次々に
 [K+'list:items']:when(YG,(p,ctx)=>{
  const it=['ガラス','硫黄','ろう','水晶','宝石'];let s=fuda('実験',960,110,{anchor:'end'})+amber(150,250,.8)+label('琥珀',150,350,{size:38,color:AMBER,anchor:'middle',weight:700})+mark(true,240,190);
  it.forEach((k,i)=>{const g=swin(ctx,p,0,i*.18,i*.18+.25),x=150+(i%3)*330+(i<3?0:160),y=i<3?520:760;s+=fade(g,glyph(k,x,y-20)+label(k,x,y+70,{size:40,color:C.ink,anchor:'middle',weight:700}))+mark(true,x+90,y-60,swin(ctx,p,1,i*.15,i*.15+.3));});
  return s;
 }),
 [K+'list:notonly']:when(YG,(p,ctx)=>{
  const it=['ガラス','硫黄','ろう','水晶','宝石'];let s=fuda('実験',960,110,{anchor:'end'})+amber(150,250,.8)+label('琥珀',150,350,{size:38,color:AMBER,anchor:'middle',weight:700})+mark(true,240,190);
  it.forEach((k,i)=>{const x=150+(i%3)*330+(i<3?0:160),y=i<3?520:760;s+=glyph(k,x,y-20)+label(k,x,y+70,{size:40,color:C.ink,anchor:'middle',weight:700})+mark(true,x+90,y-60);});
  s+=fade(vseg(ctx,p,.2,.7),plate('琥珀 だけの 力 ではない',600,260,{size:44,color:HC,anchor:'middle'}));
  return s;
 }),
 // 12 金属は回さない（3D）
 [K+'metal:no']:when(YG,(p,ctx)=>{
  const u=vseg(ctx,p,0,.8),rd=A('vers-metal','rod',u,VERS);
  return bclip('vers-metal',u,VERS)+fuda('実験',960,110,{anchor:'end'})+callout('手に 持った 金属',rd[0]-40,rd[1]+30,700,rd[1]+260,{g:vseg(ctx,p,0,.3)})+mark(false,230,330,vseg(ctx,p,.75,.95))+fade(vseg(ctx,p,.75,.95),label('回らない',230,420,{size:42,color:RED_,anchor:'middle',weight:700}));
 }),
 // 13〜16 比べる表
 [K+'tab:head']:when(YG,(p,ctx)=>fuda('実験',960,110,{anchor:'end'})+table(vseg(ctx,p,.1,.6))),
 [K+'tab:r1a']:when(YG,(p,ctx)=>fuda('実験',960,110,{anchor:'end'})+table(1,{hl:0,ga:[vseg(ctx,p,.1,.5),0,0]})),
 [K+'tab:r1b']:when(YG,(p,ctx)=>fuda('実験',960,110,{anchor:'end'})+table(1,{hl:0,ga:[1,0,0],gb:[vseg(ctx,p,.1,.6),0,0]})),
 [K+'tab:r2a']:when(YG,(p,ctx)=>fuda('実験',960,110,{anchor:'end'})+table(1,{hl:1,ga:[1,vseg(ctx,p,.1,.5),0],gb:[1,0,0]})),
 [K+'tab:r2b']:when(YG,(p,ctx)=>fuda('実験',960,110,{anchor:'end'})+table(1,{hl:1,ga:[1,1,0],gb:[1,vseg(ctx,p,.1,.6),0]})),
 [K+'tab:r3a']:when(YG,(p,ctx)=>fuda('実験',960,110,{anchor:'end'})+table(1,{hl:2,ga:[1,1,vseg(ctx,p,.1,.5)],gb:[1,1,0]})),
 [K+'tab:r3b']:when(YG,(p,ctx)=>fuda('実験',960,110,{anchor:'end'})+table(1,{hl:2,ga:[1,1,1],gb:[1,1,vseg(ctx,p,.1,.6)]})),
 // 17 二つに割れる
 [K+'leap:split']:when(YG,(p,ctx)=>{
  const sp=swin(ctx,p,1,0,.6);
  let s=fuda('考えの 飛躍',500,110,{anchor:'middle'});
  s+=fade(1-sp,rect(120,230,760,400,{fill:'none',fo:0,stroke:HC,sw:5,rx:28})+plate('同じ 力？',500,240,{size:48,color:HC,anchor:'middle'}));
  s+=amber(300-80*sp,420,1.3)+magnet(700+80*sp,420,1.3);
  s+=fade(sp,rect(60,250,390,360,{fill:'none',fo:0,stroke:AMBER,sw:5,rx:24})+rect(550,250,390,360,{fill:'none',fo:0,stroke:'#c4cde0',sw:5,rx:24})+label('こすった 物の 力',255,570,{size:40,color:AMBER,anchor:'middle',weight:700})+label('磁石の 力',745,570,{size:40,color:'#c4cde0',anchor:'middle',weight:700})+plate('別の 力',500,740,{size:56,color:HC,anchor:'middle'}));
  return s;
 }),
 // 18 言葉
 [K+'word:make']:when(YG,(p,ctx)=>{
  const g1=vseg(ctx,p,0,.3),g2=vseg(ctx,p,.3,.6),g3=vseg(ctx,p,.65,.95);
  return amber(180,260,1)+fade(g1,label('ギリシャ語',420,230,{size:36,color:C.dim,weight:700})+label('エレクトロン ＝ 琥珀',420,290,{size:44,color:C.ink,weight:700}))
   +fade(g2,arrow(500,340,500,430,{color:C.dim,w:5,head:18})+label('「琥珀のような」',500,500,{size:46,color:AMBER,anchor:'middle',weight:700}))
   +fade(g3,arrow(500,540,500,630,{color:C.dim,w:5,head:18})+label('エレクトリクス',500,700,{size:52,color:HC,anchor:'middle',weight:700})+note('ギルバートが 作った 言葉',500,770,{anchor:'middle'}));
 }),
 [K+'word:denki']:when(YG,(p,ctx)=>{
  return amber(180,260,1)+label('エレクトリクス',500,300,{size:52,color:HC,anchor:'middle',weight:700})+fade(vseg(ctx,p,.1,.5),arrow(500,350,500,460,{color:C.dim,w:5,head:18})+box(300,490,400,170,{col:HC})+label('電気',500,610,{size:90,color:HC,anchor:'middle',weight:700}));
 }),
 // 19 なぜ？ → 後に分かったこと
 [K+'later:why']:when(YG,(p,ctx)=>amber(500,330,1.5)+straws(500,520,7,.6,500,420)+fade(swin(ctx,p,0,.2,.6),bigQ(800,330,1,150)+label('なぜ？',800,420,{size:44,color:HC,anchor:'middle',weight:700}))+fade(swin(ctx,p,1,.2,.7),plate('ギルバートには まだ 分からない',500,720,{size:40,anchor:'middle',color:C.dim}))),
 [K+'later:tag']:when(YG,(p,ctx)=>amber(500,330,1.5)+straws(500,520,7,.6,500,420)+fade(.4,bigQ(800,330,1,150))+fuda('後に 分かったこと',500,700,{anchor:'middle',size:48,g:vseg(ctx,p,.1,.5)})),
 // 20 粒
 [K+'pt:grains']:when(YG,(p,ctx)=>{
  const g=vseg(ctx,p,.2,.7);
  return fuda('後に 分かったこと',960,110,{anchor:'end'})+fade(.9,rect(120,250,330,250,{fill:'#9aabc7',fo:.25,stroke:'#9aabc7',sw:3,rx:30})+label('布',285,560,{size:40,color:C.ink,anchor:'middle',weight:700}))+amber(720,380,1.5)+label('琥珀',720,560,{size:40,color:AMBER,anchor:'middle',weight:700})
   +particles(150,280,270,190,{plus:7,minus:7,g,seed:1})+particles(620,320,200,120,{plus:6,minus:6,g,seed:7})+fade(g,note('電気を 帯びた 小さな 粒（大きく 誇張）',500,690,{anchor:'middle'}));
 }),
 [K+'pt:move']:when(YG,(p,ctx)=>{
  const mv=swin(ctx,p,0,.2,.9),gf=swin(ctx,p,1,.2,.7);
  let s=fuda('後に 分かったこと',960,110,{anchor:'end'})+fade(.9,rect(120,250,330,250,{fill:'#9aabc7',fo:.25,stroke:'#9aabc7',sw:3,rx:30})+label('布',285,560,{size:40,color:C.ink,anchor:'middle',weight:700}))+amber(720,380,1.5)+label('琥珀',720,560,{size:40,color:AMBER,anchor:'middle',weight:700});
  s+=particles(150,280,270,190,{plus:7,minus:4,seed:1})+particles(620,320,200,120,{plus:6,minus:6,seed:7});
  for(let i=0;i<3;i++){const x0=200+i*80,y0=300+i*50,x1=640+i*60,y1=340+i*30;s+=label('−',mix(x0,x1,mv),mix(y0,y1,mv)+12,{size:40,color:MINUS,anchor:'middle',weight:700});}
  s+=fade(mv,arrow(460,240,600,240,{color:MINUS,w:5,head:18}));
  s+=fade(gf,plate('粒が 余った 琥珀 → 電気を 帯びる',500,690,{size:40,anchor:'middle',color:MINUS})+note('（大きく 誇張）',500,750,{anchor:'middle'}));
  return s;
 }),
 // 21 わらの中の粒がずれる
 [K+'straw:shift']:when(YG,(p,ctx)=>{
  const sh=vseg(ctx,p,.35,.85);
  let s=fuda('後に 分かったこと',960,110,{anchor:'end'})+amber(200,420,1.4)+label('−',170,425,{size:44,color:MINUS,anchor:'middle',weight:700})+label('−',230,400,{size:44,color:MINUS,anchor:'middle',weight:700})+label('−',220,460,{size:44,color:MINUS,anchor:'middle',weight:700});
  s+=rect(420,360,460,110,{fill:'#e8d18f',fo:.3,stroke:'#e8d18f',sw:4,rx:50})+label('わら',650,540,{size:40,color:'#e8d18f',anchor:'middle',weight:700});
  for(let i=0;i<6;i++){const x=460+i*72;s+=label('＋',x,408,{size:36,color:PLUS,anchor:'middle',weight:700})+label('−',x+14+40*sh,455,{size:40,color:MINUS,anchor:'middle',weight:700});}
  s+=fade(sh,callout('近い 側に 逆の 電気',455,470,470,640,{color:PLUS}))+note('（大きく 誇張）',500,720,{anchor:'middle'});
  return s;
 }),
 // 22 引き合い（長い）と押し合い（短い）
 [K+'straw:force']:when(YG,(p,ctx)=>{
  const g=vseg(ctx,p,.1,.7);
  let s=fuda('後に 分かったこと',960,110,{anchor:'end'})+amber(200,420,1.4);
  s+=rect(420,360,460,110,{fill:'#e8d18f',fo:.3,stroke:'#e8d18f',sw:4,rx:50});
  for(let i=0;i<6;i++){const x=460+i*72;s+=label('＋',x,408,{size:36,color:PLUS,anchor:'middle',weight:700})+label('−',x+70,455,{size:40,color:MINUS,anchor:'middle',weight:700});}
  s+=fade(g,arrow(450,520,270,520,{color:GREEN,w:9,head:26})+label('引き合い（近い側）',340,590,{size:38,color:GREEN,anchor:'middle',weight:700}));
  s+=fade(g,arrow(800,520,870,520,{color:ORANGE,w:7,head:20})+label('押し合い（遠い側）',700,660,{size:38,color:ORANGE,anchor:'middle',weight:700}));
  s+=fade(vseg(ctx,p,.7,1),plate('近い 方が 強い → 引き寄せられる',500,860,{size:38,anchor:'middle',color:HC}));
  return s;
 }),
 [K+'straw:next']:when(YG,(p,ctx)=>{
  let s=fuda('後に 分かったこと',960,110,{anchor:'end'})+amber(200,420,1.4)+rect(420,360,460,110,{fill:'#e8d18f',fo:.3,stroke:'#e8d18f',sw:4,rx:50})+arrow(450,520,270,520,{color:GREEN,w:9,head:26})+arrow(800,520,870,520,{color:ORANGE,w:7,head:20});
  for(let i=0;i<6;i++){const x=460+i*72;s+=label('＋',x,408,{size:36,color:PLUS,anchor:'middle',weight:700})+label('−',x+70,455,{size:40,color:MINUS,anchor:'middle',weight:700});}
  s+=fade(vseg(ctx,p,.1,.6),box(150,720,700,130,{col:HC})+label('どれだけ 強いかは 第2話で 測る',500,800,{size:42,color:HC,anchor:'middle',weight:700}));
  return s;
 }),
 // 23 湿気・金属で逃げる
 [K+'leak:water']:when(YG,(p,ctx)=>{
  const lk=vseg(ctx,p,.3,.9);
  let s=fuda('後に 分かったこと',960,110,{anchor:'end'})+amber(400,420,1.8);
  s+=`<path d="M${270} ${370} C ${300} ${290} ${430} ${270} ${510} ${320}" fill="none" stroke="#3f8cff" stroke-width="12" opacity=".7"/>`+label('薄い 水の 膜',400,250,{size:40,color:'#7fb2ff',anchor:'middle',weight:700});
  for(let i=0;i<4;i++){const t=clamp(lk*1.3-i*.15),x=mix(380+i*20,700+i*40,t),y=mix(420,300-i*30,t);s+=label('−',x,y+12,{size:42,color:MINUS,anchor:'middle',weight:700,opacity:1-t*.6});}
  s+=fade(lk,plate('余った 粒が 逃げる',650,640,{size:40,anchor:'middle',color:MINUS}))+note('（大きく 誇張）',500,720,{anchor:'middle'});
  return s;
 }),
 [K+'leak:metal']:when(YG,(p,ctx)=>{
  const lk=vseg(ctx,p,.3,.9);
  let s=fuda('後に 分かったこと',960,110,{anchor:'end'});
  s+=rect(220,380,460,60,{fill:'#9aa6bd',fo:1,stroke:'#c4cde0',sw:3,rx:12})+label('金属の 棒',450,350,{size:40,color:'#c4cde0',anchor:'middle',weight:700});
  s+=`<path d="M700 360 q60 -10 90 30 q20 40 -10 70 q-50 20 -110 0 z" fill="#d7a98a"/>`+label('手',780,520,{size:40,color:'#d7a98a',anchor:'middle',weight:700});
  for(let i=0;i<5;i++){const t=clamp(lk*1.3-i*.12),x=mix(260+i*50,740,t);s+=label('−',x,422,{size:40,color:MINUS,anchor:'middle',weight:700,opacity:1-t*.7});}
  s+=fade(lk,arrow(300,500,700,500,{color:MINUS,w:5,head:18})+plate('粒を よく 通し、手へ 逃がす',450,600,{size:40,anchor:'middle',color:MINUS}));
  s+=fade(vseg(ctx,p,.6,.95),note('分かったのは 1729年（グレイ）',450,690,{anchor:'middle'}))+note('（大きく 誇張）',450,750,{anchor:'middle'});
  return s;
 }),
 // 24 疑問② → テレラ
 [K+'ter:q']:when(YG,(p,ctx)=>fuda('疑問',500,300,{text:'②',anchor:'middle',size:48})+compassDial(500,560,130,Math.sin(tg(ctx,p)*2)*5)+label('なぜ 北を 向くのか',500,800,{size:44,color:HC,anchor:'middle',weight:700})),
 [K+'ter:ball']:when(YG,(p,ctx)=>{
  const u=vseg(ctx,p,0,1),c=A('terella','center',u,TER);
  return bclip('terella',u,TER)+fuda('試作',960,110,{anchor:'end'})+fade(swin(ctx,p,0,.4,.9),plate('磁石の 石を 削った 球',c[0],c[1]+330,{size:40,anchor:'middle'}))+fade(swin(ctx,p,1,.3,.8),plate('テレラ ＝ 小さな 地球',720,160,{size:44,color:HC,anchor:'middle'}));
 }),
 // 25 針を置いていく（3D）
 [K+'ter:needles']:when(YG,(p,ctx)=>{
  const u=swin(ctx,p,0,0,.85)*.42+swin(ctx,p,1,0,.85)*.58;
  const pole=A('terella-needles','pole',u,TER),n0=A('terella-needles','n0',u,TER);
  let s=bclip('terella-needles',u,TER)+fuda('実験',960,110,{anchor:'end'});
  s+=callout('北の端',pole[0],pole[1]-6,pole[0]-170,pole[1]-70,{g:swin(ctx,p,0,.6,.9),color:HC});
  s+=fade(swin(ctx,p,0,.2,.5),plate('赤道：水平',n0[0]+40,n0[1]+120,{size:38,anchor:'middle'}));
  s+=fade(swin(ctx,p,1,.5,.9),plate('北の端に 近いほど 下へ 傾く',500,880,{size:40,anchor:'middle',color:HC}));
  s+=note('赤い 方が 北を 向く 端',40,830,{g:swin(ctx,p,0,.3,.6)});
  return s;
 }),
 // 26〜29 論理の筋
 [K+'band:hyp']:when(YG,(p,ctx)=>logic([['地球は 大きな 磁石',vseg(ctx,p,.1,.5),'#ffb36b']],{act:0})+bclip('terella-needles',1,TERS)+fade(vseg(ctx,p,.3,.8),earth(800,620,140,{mag:1}))),
 [K+'band:pred']:when(YG,(p,ctx)=>{
  const u=vseg(ctx,p,0,.3),S='terella-london';
  const c=A(S,'n2',u,TERS),h=A(S,'n2H',u,TERS),n=A(S,'n2N',u,TERS);
  return logic([['地球は 大きな 磁石',1,'#ffb36b'],['針は 北を 向く',vseg(ctx,p,0,.35)],['ロンドンでは 大きく 下へ 傾く',vseg(ctx,p,.55,.9)]],{act:vseg(ctx,p,.5,.6)>0?2:1})
   +bclip(S,u,TERS)+dipArc(c,h,n,{g:vseg(ctx,p,.55,.85),r:80})+fade(vseg(ctx,p,.5,.8),plate('ロンドンの 緯度（約51.5°）',640,380,{size:38,anchor:'middle'})+line(c[0]+20,c[1]-10,560,392,{color:C.ink,w:2.5,opacity:.8}))
   +fade(vseg(ctx,p,.7,1),note('球の 針は、棒磁石の 球として 計算した 向き',40,905));
 }),
 [K+'band:fact']:when(YG,(p,ctx)=>{
  const S='terella-london',c=A(S,'n2',1,TERS),h=A(S,'n2H',1,TERS),n=A(S,'n2N',1,TERS);
  const g=swin(ctx,p,1,0,.5);
  return logic([['地球は 大きな 磁石',1,'#ffb36b'],['針は 北を 向く',1],['ロンドンでは 大きく 下へ 傾く',1],['ロンドンで 約72度',swin(ctx,p,1,.6,.95)]],{act:3})
   +fade(.5,bclip(S,1,TERS)+dipArc(c,h,n,{r:60}))+fade(g,rect(470,340,520,560,{fill:'#131f38',fo:.97,stroke:'#edf4ff',sw:3,rx:20})+fuda('事実',490,395,{text:'1581年 ノーマン'})+label('ロンドンで 測った',730,470,{size:38,color:C.dim,anchor:'middle',weight:700})+normanNeedle(700,640,150,72));
 }),
 [K+'band:ok']:when(YG,(p,ctx)=>{
  const g=swin(ctx,p,0,.2,.7),g2=swin(ctx,p,1,.2,.8);
  return logic([['地球は 大きな 磁石',1,'#ffb36b'],['針は 北を 向く',1],['ロンドンでは 大きく 下へ 傾く',1],['ロンドンで 約72度',1],['○ 予言 どおり',g,GREEN]],{act:4})
   +fade(1-seg(g2,0,.45),normanNeedle(700,600,130,72))+fade(seg(g2,.5,1),earth(500,600,190,{mag:1})+compassDial(820,420,60,0)+label('足の下の 地球が 磁石',500,870,{size:42,color:HC,anchor:'middle',weight:700}))
   +fade(seg(g2,.5,1)*.9,label('星',150,420,{size:40,color:C.dim,anchor:'middle',weight:700})+line(120,390,180,440,{color:RED_,w:6})+label('山',150,520,{size:40,color:C.dim,anchor:'middle',weight:700})+line(120,490,180,540,{color:RED_,w:6}));
 }),
 // 30 地球の中（後に分かったこと）
 [K+'core:flow']:when(YG,(p,ctx)=>{
  const g=vseg(ctx,p,.2,.6),f=vseg(ctx,p,.5,.9);
  return fuda('後に 分かったこと',960,110,{anchor:'end'})+earth(420,480,280,{cut:g,flow:f,t:tg(ctx,p)})
   +fade(g,callout('溶けた 鉄',500,330,780,260,{color:ORANGE}))+fade(f,callout('動いて、電流が 流れる',480,400,700,800,{color:LIGHT}));
 }),
 [K+'core:later']:when(YG,(p,ctx)=>{
  return fuda('後に 分かったこと',960,110,{anchor:'end'})+earth(420,480,280,{cut:1,flow:1,t:tg(ctx,p)})
   +fade(swin(ctx,p,0,.1,.6),box(120,800,560,90,{col:HC})+label('電流 → 磁気：第4話',400,860,{size:40,color:HC,anchor:'middle',weight:700}))+fade(swin(ctx,p,1,.1,.6),note('細かい しくみは 今も 研究中',980,175,{anchor:'end'}));
 }),
 // 31 220年後にひっくり返る
 [K+'next:flip']:when(YG,(p,ctx)=>{
  const g=swin(ctx,p,1,.3,.8);
  return amber(270,420,1.2)+magnet(730,420,1.2)+rect(80,250,380,340,{fill:'none',fo:0,stroke:AMBER,sw:5,rx:24})+rect(540,250,380,340,{fill:'none',fo:0,stroke:'#c4cde0',sw:5,rx:24})
   +label('電気',270,560,{size:44,color:AMBER,anchor:'middle',weight:700})+label('磁気',730,560,{size:44,color:'#c4cde0',anchor:'middle',weight:700})
   +fade(g,label('？',500,440,{size:110,color:HC,anchor:'middle',weight:700})+plate('220年後（1820年）',500,720,{size:44,color:HC,anchor:'middle'}));
 }),
 // 32 次の疑問
 [K+'next:how']:when(YG,(p,ctx)=>{
  const g=swin(ctx,p,1,0,.7),d=mix(260,110,g);
  return fuda('次の 疑問',500,110,{anchor:'middle'})+amber(500-d,420,1)+rect(500+d-50,395,100,50,{fill:'#e8d18f',fo:.5,stroke:'#e8d18f',sw:3,rx:24})
   +fade(g,arrow(500+d-60,500,500-d+70,500,{color:GREEN,w:4+6*g,head:18+6*g}))+fade(g,label('近づけると、どれだけ 強く なる？',500,640,{size:42,color:HC,anchor:'middle',weight:700}));
 }),
 [K+'next:card']:when(YG,(p,ctx)=>{
  const g=vseg(ctx,p,.1,.6);
  return fuda('次の 疑問',500,110,{anchor:'middle'})+fade(1-g*.6,label('ねじれる 糸で 測る',500,250,{size:40,color:C.dim,anchor:'middle',weight:700}))+finalCard(['第2話','電気の 力は、','距離で どう 変わる？'],g,{y:330,size:58});
 }),
};

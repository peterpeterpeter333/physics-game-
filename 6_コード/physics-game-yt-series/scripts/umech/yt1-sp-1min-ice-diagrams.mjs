// 特別編「1分の疑問」03（ys-sp-1min-ice）「氷はなぜ水に浮く？」— 図。Stage 1200×515。
// 形（Q カード・「疑問 n」カウンター・疑問の札・「次の疑問 →」・最後の黄色の枠の問い）は 01 の yt1-sp-1min-common.mjs を import（編集しない）。
// 色：水 青、氷 薄い水色、ろう 黄土、酸素 赤・水素 白（分子）、強調 黄。
// 数値：氷 0.917 g/cm³・水 約1.00 g/cm³ → 1/0.917 ≈ 1.09（体積 約9％増）。浮いた氷は約 92％ が水の中（絵もそれに合わせて上に少しだけ出す）。
import {C,seg,clamp,mix,fade,label,line,rect,dot,ring,draw,arrow,poly,scaleAt} from './anim.mjs';
import {wrap,qcard,finalQ,cueT,voiceEnd,vseg,HC} from './yt1-sp-1min-common.mjs';

const PI=Math.PI;
const WAT='#3f78e0', ICE='#dff3ff', ICEE='#9fd8ff', WAX='#d8b46a', OXY='#ff6b6b', HYD='#f4f8ff';
const hash=i=>{const s=Math.sin(i*127.1+311.7)*43758.5453;return s-Math.floor(s);};
const K='sp-1min-ice:';
const clipR=(id,x,y,w,h,inner,rx=0)=>`<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`;
const grad=(id,a,b)=>`<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>`;

// ---------- parts ----------
function iceCube(x,y,s,{g=1,rot=0}={}){
 let q=rect(x-s/2,y-s/2,s,s,{fill:ICE,fo:.92,stroke:ICEE,sw:2.5,rx:s*.14});
 q+=line(x-s*.3,y-s*.28,x-s*.05,y-s*.28,{color:'#ffffff',w:3})+line(x-s*.3,y-s*.28,x-s*.3,y-s*.05,{color:'#ffffff',w:3});
 return fade(g,`<g transform="rotate(${rot.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})">${q}</g>`);
}
// glass (straight) with liquid up to level (y), contents drawn by inner()
function glass(x,yTop,w,h,{level,liq=WAT,liqFo=.55,inner='',id='g',g=1}={}){
 const yB=yTop+h;
 let s=grad('ig'+id,liq,liq)+clipR('ic'+id,x+4,yTop,w-8,h-4,rect(x,level,w,yB-level,{fill:liq,fo:liqFo,stroke:'none',rx:0})+inner);
 s+=line(x+4,level,x+w-4,level,{color:'#cfe2ff',w:2,opacity:.8});
 s+=`<path d="M${x} ${yTop} L${x} ${yB-12} Q${x} ${yB} ${x+12} ${yB} L${x+w-12} ${yB} Q${x+w} ${yB} ${x+w} ${yB-12} L${x+w} ${yTop}" fill="none" stroke="#c9d3e6" stroke-width="4"/>`;
 return fade(g,s);
}
// water molecule: O (red) with two H (white), H–O–H about 104.5°
function mol(x,y,ang,k=1,{g=1}={}){
 const h=1.824/2,d=19*k;
 let s='';
 for(const sg of[-1,1]){const a=ang+sg*h;s+=line(x,y,x+d*Math.cos(a),y+d*Math.sin(a),{color:'#c9d3e6',w:3*k});s+=dot(x+d*Math.cos(a),y+d*Math.sin(a),7*k,HYD);}
 s+=dot(x,y,13*k,OXY);
 return fade(g,s);
}
function fish(x,y,k=1,{g=1,dir=1,col='#ffb36b'}={}){
 let s=`<ellipse cx="${x}" cy="${y}" rx="${26*k}" ry="${13*k}" fill="${col}"/>`;
 s+=poly([[x-dir*22*k,y],[x-dir*42*k,y-13*k],[x-dir*42*k,y+13*k]],{fill:col,fo:1});
 s+=dot(x+dir*14*k,y-3*k,3*k,'#0b1122');
 return fade(g,s);
}

// ---------- 1: Q card — glass with floating ice ----------
function qBg(t){
 const bob=3*Math.sin(t*2.2);
 let s=glass(985,250,170,230,{level:300,id:'q',inner:iceCube(1035,300-4+bob,58,{rot:8})+iceCube(1105,300-3+bob*.7,50,{rot:-12})});
 s+=iceCube(130,330,90,{rot:-10})+label('？',130,230,{size:90,color:HC,anchor:'middle',weight:700});
 return s;
}

// ---------- 2: most solids shrink and sink (wax); water expands 9 % (measuring cylinders) ----------
function waxScene(ctx,p,t){
 const a=vseg(ctx,p,0,.08),sink=vseg(ctx,p,.1,.42),b=vseg(ctx,p,.45,.58),v=vseg(ctx,p,.62,.8),pc=vseg(ctx,p,.8,.95);
 // wax beaker
 const wy=mix(170,400,sink);
 let s=glass(70,120,230,320,{level:170,liq:WAX,liqFo:.45,id:'w',g:a,inner:rect(150,wy-30,70,46,{fill:'#b88a3a',fo:1,stroke:'#f0d79a',sw:2,rx:6})});
 s+=fade(a,label('ろう',185,100,{size:30,color:WAX,anchor:'middle',weight:700}));
 s+=fade(seg(sink,.5,1),label('固まると 沈む',185,478,{size:28,color:WAX,anchor:'middle',weight:700}));
 // water beaker with ice
 const bob=3*Math.sin(t*2.2);
 s+=glass(350,120,230,320,{level:170,id:'wb',g:b,inner:iceCube(465,170-5+bob,64,{rot:6})});
 s+=fade(b,label('水',465,100,{size:30,color:'#8ec0ff',anchor:'middle',weight:700})+label('凍ると 浮く',465,478,{size:28,color:'#8ec0ff',anchor:'middle',weight:700}));
 // measuring cylinders: 100 → 109 (same mass of water)
 const cx1=770,cx2=1000,cw=120,yB=440,H100=230,H109=H100*1.09;
 const cyl=(cx,hFill,fill,fo,txt,col,g)=>{let q=rect(cx-cw/2,yB-hFill,cw,hFill,{fill,fo,stroke:'none',rx:0});
  for(let k=0;k<=11;k++){const y=yB-k*H100/10;q+=line(cx+cw/2-24,y,cx+cw/2,y,{color:C.dim,w:k%5?1.5:3});}
  q+=`<path d="M${cx-cw/2} ${yB-290} L${cx-cw/2} ${yB} L${cx+cw/2} ${yB} L${cx+cw/2} ${yB-290}" fill="none" stroke="#c9d3e6" stroke-width="4"/>`;
  q+=label(txt,cx,yB+40,{size:28,color:col,anchor:'middle',weight:700});return fade(g,q);};
 s+=cyl(cx1,H100,WAT,.55,'水 100',`#8ec0ff`,v);
 s+=fade(v,arrow(cx1+cw/2+18,300,cx2-cw/2-18,300,{color:C.ink,w:4,head:14})+label('凍らせる',(cx1+cx2)/2,280,{size:24,color:C.ink,anchor:'middle',weight:700}));
 s+=cyl(cx2,H100+(H109-H100)*pc,ICE,.85,'氷 109',ICEE,v);
 s+=fade(pc,line(cx1-cw/2,yB-H100,cx2+cw/2+10,yB-H100,{color:HC,w:2,dash:'8 6'})+rect(cx2-cw/2,yB-H109,cw,H109-H100,{fill:HC,fo:.45,stroke:HC,sw:2,rx:0}));
 s+=fade(pc,label('約 9％ 増える',cx2,128,{size:30,color:HC,anchor:'middle',weight:700}));
 return s;
}

// ---------- 3: same volume → ice is lighter → floats ----------
function densityScene(ctx,p,t){
 const a=vseg(ctx,p,0,.25),tilt=vseg(ctx,p,.3,.6),f=vseg(ctx,p,.7,.95);
 const cx=380,py=170,L=230,ang=-.12*tilt;   // ice side (right) rises
 const lx=cx-L*Math.cos(ang),ly=py-L*Math.sin(ang),rx=cx+L*Math.cos(ang),ry=py+L*Math.sin(ang);
 let s=fade(a,poly([[cx,py],[cx-40,440],[cx+40,440]],{fill:'#5a6b8c',fo:1})+line(cx-120,442,cx+120,442,{color:'#8fa3c7',w:6}));
 s+=fade(a,line(lx,ly,rx,ry,{color:'#c9d3e6',w:7})+dot(cx,py,9,'#c9d3e6'));
 const pan=(x,y,inner)=>line(x,y,x-55,y+110,{color:C.dim,w:2})+line(x,y,x+55,y+110,{color:C.dim,w:2})+`<path d="M${x-75} ${y+110} Q${x} ${y+140} ${x+75} ${y+110}" fill="#2a3a5a" stroke="#8fa3c7" stroke-width="3"/>`+inner;
 s+=fade(a,pan(lx,ly,rect(lx-38,ly+42,76,76,{fill:WAT,fo:.8,stroke:'#8ec0ff',sw:2.5,rx:6}))+pan(rx,ry,iceCube(rx,ry+80,76)));
 s+=fade(a,label('水',lx,ly+190,{size:30,color:'#8ec0ff',anchor:'middle',weight:700})+label('氷',rx,ry+190,{size:30,color:ICEE,anchor:'middle',weight:700}));
 s+=fade(a,label('同じ 体積',cx,90,{size:30,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(tilt,label('1.00 g',lx,ly+232,{size:28,color:'#8ec0ff',anchor:'middle',weight:700})+label('0.92 g',rx,ry+232,{size:28,color:ICEE,anchor:'middle',weight:700}));
 s+=fade(seg(tilt,.6,1),label('軽い',rx+110,ry+60,{size:32,color:HC,anchor:'middle',weight:700}));
 // → floats
 const bob=3*Math.sin(t*2.2);
 s+=fade(f,arrow(760,290,830,290,{color:HC,w:5,head:16}));
 s+=glass(880,170,260,260,{level:230,id:'d',g:f,inner:iceCube(1010,230-6+bob,80,{rot:5})});
 s+=fade(f,label('だから 浮く',1010,478,{size:30,color:HC,anchor:'middle',weight:700}));
 return s;
}

// ---------- 4: why only water? (a big water molecule behind the question card) ----------
function whyBg(t){
 return mol(600,300,-PI/2+.15*Math.sin(t*1.5),5)+label('水の 分子',600,480,{size:28,color:C.dim,anchor:'middle',weight:700});
}

// ---------- 5: molecules join hands at a fixed angle → hexagonal net with gaps ----------
// honeycomb: O at the vertices, side A; bonds = hydrogen bonds ("hands")
const A=56, HX=880, HY=290;
const LAT=(()=>{const pts=[];const w=Math.sqrt(3)*A;
 for(let j=-3;j<=3;j++)for(let i=-3;i<=3;i++){const x0=HX+i*w+(j&1?w/2:0),y0=HY+j*1.5*A;
  pts.push([x0,y0-A/2,0]);pts.push([x0,y0+A/2,1]);}
 return pts.filter(([x,y])=>x>660&&x<1110&&y>165&&y<470);})();
const BONDS=(()=>{const b=[];for(let i=0;i<LAT.length;i++)for(let j=i+1;j<LAT.length;j++){const d=Math.hypot(LAT[i][0]-LAT[j][0],LAT[i][1]-LAT[j][1]);if(Math.abs(d-A)<2)b.push([i,j]);}return b;})();
function hexScene(ctx,p,t){
 const a=vseg(ctx,p,0,.12),hand=vseg(ctx,p,.12,.3),ang=vseg(ctx,p,.3,.45),fr=vseg(ctx,p,.5,.8),gap=vseg(ctx,p,.82,.97);
 // left: liquid — molecules jostle randomly, packed
 let L='';
 for(let i=0;i<26;i++){const x=90+hash(i)*400+10*Math.sin(t*2+i),y=120+hash(i+40)*320+10*Math.cos(t*1.7+i*1.3);L+=mol(x,y,t*.8+i,.85);}
 let s=fade(a,rect(40,80,500,400,{fill:'#131f38',fo:.9,stroke:C.faint,sw:2,rx:14})+clipR('ilq',42,82,496,396,L,14)+label('液体の 水：ばらばら',290,500,{size:26,color:C.ink,anchor:'middle',weight:700}));
 // right: first two molecules hold hands (dashed) at a fixed angle, then the whole net forms
 const pos=i=>{const [x,y]=LAT[i];if(fr>=1)return [x,y];const rx=660+hash(i+7)*440,ry=100+hash(i+9)*360;return [mix(rx,x,fr),mix(ry,y,fr)];};
 let R=rect(640,80,520,400,{fill:'#131f38',fo:.9,stroke:fr>0?ICEE:C.faint,sw:2,rx:14});
 if(fr<=0){
  // close-up of three molecules
  const P=[[790,300],[900,236],[1010,300]];
  R+=mol(P[0][0],P[0][1],-.52,1.6)+mol(P[1][0],P[1][1],PI/2,1.6,{g:hand})+mol(P[2][0],P[2][1],PI+.52,1.6,{g:hand});
  R+=fade(hand,line(P[0][0]+20,P[0][1]-12,P[1][0]-16,P[1][1]+10,{color:HC,w:3,dash:'6 5'})+line(P[2][0]-20,P[2][1]-12,P[1][0]+16,P[1][1]+10,{color:HC,w:3,dash:'6 5'}));
  R+=fade(hand,label('手を つなぐ',900,150,{size:30,color:HC,anchor:'middle',weight:700}));
  const a0=PI-.52,a1=.52;   // arc at the middle molecule between the two hands
  R+=fade(ang,draw(Array.from({length:31},(_,k)=>{const u=a0-(a0-a1)*k/30;return [900+44*Math.cos(u),236+44*Math.sin(u)];}),ang,{color:'#ffb36b',w:4})+label('決まった 角度',900,370,{size:28,color:'#ffb36b',anchor:'middle',weight:700}));
 }else{
  let q='';
  for(const [i,j] of BONDS){const [x1,y1]=pos(i),[x2,y2]=pos(j);q+=line(x1,y1,x2,y2,{color:ICEE,w:2.5,dash:'6 5',opacity:fr});}
  if(gap>0){// highlight the hexagonal holes
   const w=Math.sqrt(3)*A;for(const [cx,cy] of [[HX,HY],[HX-w,HY],[HX+w/2,HY+1.5*A]]){const hx=Array.from({length:6},(_,k)=>[cx+A*Math.cos(PI/6+k*PI/3),cy+A*Math.sin(PI/6+k*PI/3)]);q+=fade(gap,poly(hx,{fill:HC,fo:.22,stroke:HC,sw:3}));}}
  LAT.forEach(([x,y,s2],i)=>{const [px,py]=pos(i);q+=mol(px,py,(s2?-PI/2:PI/2)*fr+(1-fr)*(t+i),.8);});
  R+=clipR('ihx',642,82,516,396,q,14);
 }
 s+=fade(a,R);
 s+=fade(fr,label('氷：六角形の 網目',900,500,{size:26,color:ICEE,anchor:'middle',weight:700}));
 s+=fade(gap,tag2('すき間が 多い',900,118));
 return s;
}
function tag2(s,x,y){const w=[...s].length*30+40;return rect(x-w/2,y-34,w,48,{fill:'#131f38',fo:.95,stroke:HC,sw:2.5,rx:20})+label(s,x,y,{size:30,color:HC,anchor:'middle',weight:700});}

// ---------- 6: the hexagon grows into a snow crystal ----------
function snowflake(cx,cy,R,u,{col='#e8f6ff'}={}){
 let s='';
 for(let k=0;k<6;k++){const a=-PI/2+k*PI/3,ex=cx+R*u*Math.cos(a),ey=cy+R*u*Math.sin(a);
  s+=line(cx,cy,ex,ey,{color:col,w:6});
  for(const f of[.45,.72]){if(u<f)continue;const bx=cx+R*f*Math.cos(a),by=cy+R*f*Math.sin(a),bl=R*(f<.5?.3:.2)*clamp((u-f)/.25);
   for(const sg of[-1,1]){const b2=a+sg*PI/3;s+=line(bx,by,bx+bl*Math.cos(b2),by+bl*Math.sin(b2),{color:col,w:4});}}}
 const hx=Array.from({length:6},(_,k)=>[cx+R*.16*Math.cos(-PI/2+k*PI/3),cy+R*.16*Math.sin(-PI/2+k*PI/3)]);
 s+=poly(hx,{fill:col,fo:.5,stroke:col,sw:3});
 return s;
}
function snowScene(ctx,p,t){
 const a=vseg(ctx,p,0,.2),gr=vseg(ctx,p,.3,.9);
 const w=Math.sqrt(3)*40;
 let net='';
 for(const [cx,cy] of [[230,280],[230-w,280],[230+w,280],[230-w/2,220],[230+w/2,220],[230-w/2,340],[230+w/2,340]]){
  const hx=Array.from({length:7},(_,k)=>[cx+40*Math.cos(PI/6+k*PI/3),cy+40*Math.sin(PI/6+k*PI/3)]);
  net+=draw(hx,1,{color:ICEE,w:2.5});hx.slice(0,6).forEach(([x,y])=>{net+=dot(x,y,6,OXY);});}
 let s=fade(a,net+label('分子の 並び',230,450,{size:28,color:ICEE,anchor:'middle',weight:700}));
 s+=fade(gr,arrow(410,280,520,280,{color:HC,w:5,head:16})+label('そのまま 大きく',465,240,{size:26,color:HC,anchor:'middle',weight:700}));
 s+=fade(seg(gr,0,.15),`<g transform="rotate(${(t*4).toFixed(1)} 830 280)">${snowflake(830,280,200,gr)}</g>`);
 s+=fade(seg(gr,.5,1),label('雪の 結晶',830,498,{size:30,color:'#e8f6ff',anchor:'middle',weight:700}));
 return s;
}

// ---------- 7: lake — if ice sank vs ice floats ----------
function lake(x,y,w,h,{iceTop=0,iceBot=0,fishOk=1,t=0,id='l',bad=0}={}){
 const yB=y+h,shape=[[x,y],[x+w,y],[x+w-40,yB],[x+40,yB]];
 let s=grad('lk'+id,'#3f78e0','#1d3f8a')+poly(shape,{fill:`url(#lk${id})`,fo:1,stroke:'#9cc0ff',sw:3});
 const cp=`<clipPath id="lc${id}"><polygon points="${shape.map(q=>q.join(',')).join(' ')}"/></clipPath>`;
 let inner='';
 if(iceBot>0)inner+=rect(x,yB-iceBot,w,iceBot,{fill:ICE,fo:.95,stroke:ICEE,sw:2,rx:0});
 if(iceTop>0)inner+=rect(x,y,w,iceTop,{fill:ICE,fo:.95,stroke:ICEE,sw:2,rx:0});
 const fx=x+w/2+60*Math.sin(t*1.2),fy=y+iceTop+(h-iceTop-iceBot)/2;
 if(fishOk>0&&h-iceTop-iceBot>40)inner+=fish(fx,fy,1,{dir:Math.cos(t*1.2)>0?1:-1});
 s+=cp+`<g clip-path="url(#lc${id})">${inner}</g>`;
 return s;
}
function lakeScene(ctx,p,t){
 const a=vseg(ctx,p,0,.1),fz=vseg(ctx,p,.1,.42),b=vseg(ctx,p,.48,.6),top=vseg(ctx,p,.6,.8),safe=vseg(ctx,p,.82,.97);
 const H=270;
 let s=fade(a,rect(30,70,550,420,{fill:'#131f38',fo:.9,stroke:C.faint,sw:2,rx:14})+label('もし 氷が 沈んだら',305,116,{size:30,color:C.a,anchor:'middle',weight:700}));
 s+=fade(a,lake(70,160,470,H,{iceBot:H*.95*fz,fishOk:fz<.8?1:0,t,id:'bad'}));
 if(fz>.8)s+=fade(seg(fz,.8,1),line(270,260,340,330,{color:C.a,w:8})+line(270,330,340,260,{color:C.a,w:8}));
 s+=fade(seg(fz,.3,.7),label('底から 凍る',305,470,{size:26,color:C.a,anchor:'middle',weight:700}));
 s+=fade(b,rect(620,70,550,420,{fill:'#131f38',fo:.9,stroke:HC,sw:2.5,rx:14})+label('氷は 浮く',895,116,{size:30,color:HC,anchor:'middle',weight:700}));
 s+=fade(b,lake(660,160,470,H,{iceTop:44*top,t:t+1,id:'ok'}));
 s+=fade(top,label('上から 凍る',1120,198,{size:24,color:'#0b1122',anchor:'end',weight:700}));
 s+=fade(safe,label('下の 水が 守られる',895,470,{size:28,color:HC,anchor:'middle',weight:700}));
 return s;
}

// ---------- 8: next — at what temperature is water heaviest? ----------
function thermo(x,y,t,{g=1}={}){
 const lvl=150+20*Math.sin(t*1.3);
 let s=rect(x-16,y-200,32,220,{fill:'#131f38',fo:1,stroke:'#c9d3e6',sw:3,rx:16})+dot(x,y+30,28,'#ff6b6b')+ring(x,y+30,28,{color:'#c9d3e6',w:3});
 s+=rect(x-7,y+20-lvl,14,lvl,{fill:'#ff6b6b',fo:1,stroke:'none',rx:5});
 for(let k=0;k<6;k++)s+=line(x+16,y-180+k*34,x+30,y-180+k*34,{color:C.dim,w:2});
 return fade(g,s);
}

export const sp1minIceDiagrams={
 // 1 — Q card
 [K+'q']:wrap(1,(p,ctx)=>{const t=cueT(p,ctx);return qcard(['氷は、','水が 固まった ものなのに、','なぜ 水に 浮く？'],p,t,{bg:qBg(t),y0:150});},{fadeIn:false,roll:0}),
 // 2 — wax sinks; water expands about 9 %
 [K+'wax']:wrap(1,(p,ctx)=>waxScene(ctx,p,cueT(p,ctx)),{pill:'氷は、なぜ水に浮く？'}),
 // 3 — same volume: ice is lighter → floats
 [K+'density']:wrap(1,(p,ctx)=>densityScene(ctx,p,cueT(p,ctx)),{pill:'氷は、なぜ水に浮く？',bridge:.92}),
 // 4 — why only water?
 [K+'why']:wrap(2,(p,ctx)=>whyBg(cueT(p,ctx)),{roll:0,q:{end:.92,lines:['なぜ 水だけ、','凍ると 膨らむ？'],text:'なぜ水だけ、凍ると膨らむ？'}}),
 // 5 — hands at a fixed angle → hexagonal net with many gaps
 [K+'hex']:wrap(2,(p,ctx)=>hexScene(ctx,p,cueT(p,ctx)),{pill:'なぜ水だけ、凍ると膨らむ？',bridge:.95}),
 // 6 — the same arrangement grows into a snow crystal
 [K+'snow']:wrap(3,(p,ctx)=>snowScene(ctx,p,cueT(p,ctx)),{roll:0,q:{end:.3,lines:['雪の 結晶は、','なぜ 六角形？'],text:'雪の結晶は、なぜ六角形？'}}),
 // 7 — lakes freeze from the top
 [K+'lake']:wrap(3,(p,ctx)=>lakeScene(ctx,p,cueT(p,ctx)),{pill:'雪の結晶は、なぜ六角形？',bridge:.95}),
 // 8 — next question (stops on the yellow frame)
 [K+'next']:wrap(4,(p,ctx)=>{const t=cueT(p,ctx),g=vseg(ctx,p,.05,.2);
  let s=thermo(1060,420,t,{g:vseg(ctx,p,.2,.4)})+label('？',1130,270,{size:80,color:HC,anchor:'middle',weight:700,opacity:vseg(ctx,p,.4,.6)});
  s+=glass(90,330,170,160,{level:370,id:'n',g:vseg(ctx,p,.2,.4)});
  return s+finalQ(['水が 一番 重く なるのは、','何度の とき？'],g,{y:110,sc:.9+.1*g});
 },{roll:0}),
};

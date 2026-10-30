// 「1分の疑問」07 月はなぜ同じ面を向ける (ys-sp-1min-moon) — 図。Stage 1200×515。
// 形（カウンター・Q カード・疑問カード・黄色の枠の問い）は 01 の yt1-sp-1min-common.mjs。小さな部品は yt1-sp-1min-c0609-common.mjs。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,poly,clamp,mix} from './anim.mjs';
import {wrap,qcard,finalQ,cueT,vseg,voiceEnd,HC} from './yt1-sp-1min-common.mjs';
import {card,tag,note} from './yt1-sp-1min-c0609-common.mjs';

const K='sp-1min-moon:';
const PI=Math.PI, SPIN=C.E, PULL=C.F;
const deg=a=>a*180/PI;

// stars in the background (fixed)
const STARS=Array.from({length:60},(_,i)=>[(i*197.3)%1200,(i*89.7+40)%515,1+(i%3)*.6]);
const stars=(g=1)=>fade(g*.6,STARS.map(([x,y,r])=>dot(x,y,r,'#c9d3e6')).join(''));

// Earth: blue disc with green land
function earth(x,y,r,{g=1,id='e'}={}){
 let s=`<defs><radialGradient id="mE${id}" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#5a96f0"/><stop offset=".75" stop-color="#2f6fd6"/><stop offset="1" stop-color="#1d4594"/></radialGradient></defs>`;
 s+=`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#mE${id})"/>`;
 s+=`<clipPath id="mEc${id}"><circle cx="${x}" cy="${y}" r="${r}"/></clipPath><g clip-path="url(#mEc${id})">`
  +`<ellipse cx="${x-r*.3}" cy="${y-r*.2}" rx="${r*.35}" ry="${r*.25}" fill="#4fa36a"/>`
  +`<ellipse cx="${x+r*.35}" cy="${y+r*.3}" rx="${r*.3}" ry="${r*.2}" fill="#4fa36a"/></g>`;
 return fade(g,s);
}
// Moon: grey disc with dark maria. rot = rotation (rad) of the face; the near-side mark is at angle rot.
function moon(x,y,r,{rot=0,g=1,face=1,mark=0}={}){
 let s=`<circle cx="${x}" cy="${y}" r="${r}" fill="#c9ccd3"/>`;
 const M=[[-.3,-.25,.28],[.15,-.35,.2],[.25,.1,.3],[-.2,.25,.22],[.0,.0,.14]];
 if(face)s+=`<g transform="rotate(${deg(rot)} ${x} ${y})">`+M.map(([a,b,c])=>`<circle cx="${x+a*r}" cy="${y+b*r}" r="${c*r}" fill="#8e929c"/>`).join('')+`</g>`;
 if(mark){const mx=x+r*Math.cos(rot),my=y+r*Math.sin(rot);
  s+=line(x+r*.6*Math.cos(rot),y+r*.6*Math.sin(rot),mx+r*.9*Math.cos(rot),my+r*.9*Math.sin(rot),{color:'#ff6b6b',w:4})+dot(mx+r*.9*Math.cos(rot),my+r*.9*Math.sin(rot),7,'#ff6b6b');}
 return fade(g,s);
}
// curved spin arrow around (x,y) radius R; amt = fraction of a turn shown; ccw
function spin(x,y,R,amt,{color=SPIN,g=1,a0=-PI*.15,w=5}={}){
 if(amt<=.02)return '';
 const a1=a0-2*PI*amt,n=40,pts=Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [x+R*Math.cos(a),y+R*Math.sin(a)];});
 const [ex,ey]=pts[n],[px,py]=pts[n-2];
 return fade(g,draw(pts,1,{color,w})+arrow(px,py,ex+(ex-px)*.6,ey+(ey-py)*.6,{color,w,head:14}));
}
// dinosaur silhouette (sauropod), feet at yB
function dino(x,yB,k=1,{g=1,col='#7fb47f'}={}){
 const P=(a,b)=>[x+a*k,yB+b*k];
 let s=`<ellipse cx="${x}" cy="${yB-70*k}" rx="${85*k}" ry="${45*k}" fill="${col}"/>`;
 s+=poly([P(50,-95),P(95,-200),P(115,-215),P(140,-210),P(140,-195),P(115,-190),P(80,-80)],{fill:col,fo:1});
 s+=poly([P(-70,-90),P(-160,-60),P(-215,-35),P(-160,-48),P(-70,-50)],{fill:col,fo:1});
 for(const a of[-55,-25,30,60])s+=rect(x+a*k-9*k,yB-50*k,18*k,50*k,{fill:col,fo:1,stroke:col,rx:4});
 s+=dot(x+128*k,yB-204*k,3*k,'#0b1122');
 return fade(g,s);
}
// analog clock with a "?" in the middle
function clock(x,y,R,t,{g=1}={}){
 let s=dot(x,y,R+6,'#0e1830')+ring(x,y,R,{color:C.t,w:4,fill:'#1a2745'});
 for(let i=0;i<12;i++){const a=i*PI/6;s+=line(x+R*.82*Math.cos(a),y+R*.82*Math.sin(a),x+R*.95*Math.cos(a),y+R*.95*Math.sin(a),{color:C.ink,w:i%3?2:4});}
 const am=t*1.2-PI/2,ah=t*.1-PI/2-.9;
 s+=line(x,y,x+R*.5*Math.cos(ah),y+R*.5*Math.sin(ah),{color:C.ink,w:6})+line(x,y,x+R*.75*Math.cos(am),y+R*.75*Math.sin(am),{color:C.ink,w:4})+dot(x,y,5,C.t);
 return fade(g,s);
}

// orbit scene: Earth at E, moon on a circle; th = orbit angle. The moon's near side (mark) always faces Earth.
const E0=[600,290],RO=185;
function orbit(th,{g=1,trail=0,mark=1,t=0}={}){
 const [ex,ey]=E0,mx=ex+RO*Math.cos(th),my=ey+RO*Math.sin(th);
 let s=fade(g,ring(ex,ey,RO,{color:'#3a4a66',w:2,dash:'6 8'}));
 if(trail>0)s+=fade(g,draw(Array.from({length:61},(_,i)=>{const a=th+trail*i/60;return [ex+RO*Math.cos(a),ey+RO*Math.sin(a)];}),1,{color:C.dim,w:3}));
 s+=earth(ex,ey,62,{g,id:'o'});
 s+=moon(mx,my,30,{rot:th+PI,g,mark});
 return s;
}

export const sp1minMoonDiagrams={
 // 1 — Q：月の表側
 [K+'q']:wrap(1,(p,ctx)=>{
  const t=cueT(p,ctx);
  const bg=stars()+moon(1000,330,120,{rot:0,g:vseg(ctx,p,0,.2)})+fade(vseg(ctx,p,.2,.35),label('いつも 見える 面',1000,500,{size:26,color:C.dim,anchor:'middle',weight:700}))
   +fade(vseg(ctx,p,.6,.8),moon(190,340,80,{g:.35,face:0})+label('裏側',190,350,{size:30,color:C.dim,anchor:'middle',weight:700})+label('？',190,250,{size:60,color:HC,anchor:'middle',weight:700}));
  return qcard(['月は、なぜ いつも','同じ面を 向ける？'],p,t,{bg,y0:170});
 },{fadeIn:false,roll:0}),

 // 2 — 公転1周で自転1回：赤い印がいつも地球を向く
 [K+'orbit']:wrap(1,(p,ctx)=>{
  const u=vseg(ctx,p,.1,.95),th=-PI/2-2*PI*u; // counter-clockwise on screen (seen from the north)
  let s=stars()+orbit(th,{trail:Math.min(2*PI*u,2*PI)});
  s+=fade(vseg(ctx,p,.05,.15),label('いつも 地球を 向く 印',600,505,{size:24,color:'#ff8a8a',anchor:'middle',weight:700}));
  // right: the moon alone, turning once (the same mark)
  const k=vseg(ctx,p,.45,.55);
  s+=card(880,100,290,330,label('月だけを 見ると',1025,140,{size:26,color:C.dim,anchor:'middle',weight:700})+moon(1025,265,60,{rot:th+PI,mark:1})+spin(1025,265,100,.75,{g:1})
   +label('1周 で 1回 自転',1025,412,{size:28,color:SPIN,anchor:'middle',weight:700}),k,C.faint);
  s+=card(30,110,290,170,label('公転 約27日',175,170,{size:30,color:C.ink,anchor:'middle',weight:700})+label('＝',175,212,{size:32,color:HC,anchor:'middle',weight:700})+label('自転 約27日',175,256,{size:30,color:SPIN,anchor:'middle',weight:700}),vseg(ctx,p,.7,.8),HC);
  return s;
 },{pill:'月は、なぜ同じ面を向ける？',bridge:.95}),

 // 3 — ぴったり同じなのは偶然？
 [K+'luck']:wrap(2,(p,ctx)=>{
  let s=stars()+orbit(-PI/2+.0,{});
  s+=card(30,130,290,170,label('公転 約27日',175,190,{size:30,color:C.ink,anchor:'middle',weight:700})+label('＝',175,232,{size:32,color:HC,anchor:'middle',weight:700})+label('自転 約27日',175,276,{size:30,color:SPIN,anchor:'middle',weight:700}),1,HC);
  s+=fade(vseg(ctx,p,.6,.8),label('偶然？',1000,300,{size:64,color:HC,anchor:'middle',weight:700}));
  return s;
 },{roll:0,q:{end:.5,lines:['ぴったり 同じなのは、偶然？'],text:'ぴったり同じなのは、偶然？'}}),

 // 4 — 引き伸ばされた月の出っ張りを地球が引く → 回転が遅くなる
 [K+'bulge']:wrap(2,(p,ctx)=>{
  const t=cueT(p,ctx),st=vseg(ctx,p,.25,.45),slow=vseg(ctx,p,.55,.95);
  const ex=170,ey=300,mx=820,my=300;
  let s=stars()+earth(ex,ey,90,{id:'b'});
  s+=fade(vseg(ctx,p,.1,.2),label('地球',ex,ey+130,{size:28,color:C.ink,anchor:'middle',weight:700}));
  // gravity arrow Earth→moon
  s+=fade(vseg(ctx,p,.08,.2),arrow(mx-170,ey,ex+110,ey,{color:PULL,w:4,head:16})+label('地球の 重力',(ex+mx)/2-40,ey-18,{size:26,color:PULL,anchor:'middle',weight:700}));
  // bulge tilt: ahead by 28° while spinning fast, back to 0 as it slows
  const tilt=-.5*(1-slow)*st,rx=mix(110,135,st),ry=mix(110,92,st);
  let m=`<ellipse cx="${mx}" cy="${my}" rx="${rx}" ry="${ry}" fill="#c9ccd3" transform="rotate(${deg(tilt)} ${mx} ${my})"/>`;
  m+=`<g transform="rotate(${deg(tilt)} ${mx} ${my})">`+[[-.3,-.25,.25],[.1,-.35,.18],[.2,.15,.26],[-.15,.3,.2]].map(([a,b,c])=>`<circle cx="${mx+a*rx}" cy="${my+b*ry}" r="${c*ry}" fill="#8e929c"/>`).join('')+`</g>`;
  s+=m;
  // near bulge point and pull on it
  const bx=mx-rx*Math.cos(tilt),by=my-rx*Math.sin(tilt);
  s+=fade(st,dot(bx,by,9,HC)+label('出っ張り',bx-75,by+60,{size:26,color:HC,anchor:'middle',weight:700}));
  s+=fade(st*(1-slow),arrow(bx,by,bx+70*(ex-bx)/Math.hypot(ex-bx,ey-by),by+70*(ey-by)/Math.hypot(ex-bx,ey-by),{color:PULL,w:5,head:14}));
  // spin arrow shrinks: fast → slow
  const amt=mix(.7,.18,slow);
  s+=spin(mx,my,150,amt,{g:vseg(ctx,p,.2,.3)});
  s+=fade(vseg(ctx,p,.6,.75),label('回転に ブレーキ',1060,120,{size:30,color:SPIN,anchor:'middle',weight:700}));
  s+=fade(vseg(ctx,p,.85,.98),label('出っ張りが 地球を 向いて 止まる',600,490,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=note('大きさは 誇張',20,500,vseg(ctx,p,.25,.35));
  return s;
 },{fadeIn:false,pill:'ぴったり同じなのは、偶然？',bridge:.97}),

 // 5 — 地球の海の膨らみ → 地球の自転も遅くなる
 [K+'tide']:wrap(3,(p,ctx)=>{
  const t=cueT(p,ctx),ex=400,ey=290,mx=1030,my=290;
  const ob=vseg(ctx,p,.45,.6),lead=-.35*ob;
  let s=stars();
  s+=fade(ob,`<ellipse cx="${ex}" cy="${ey}" rx="190" ry="138" fill="#6fb6ff" fill-opacity=".35" stroke="#9fd0ff" stroke-width="2" transform="rotate(${deg(lead)} ${ex} ${ey})"/>`);
  s+=earth(ex,ey,128,{id:'t'})+moon(mx,my,45,{});
  s+=fade(vseg(ctx,p,.1,.2),label('月',mx,my+85,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(ob,label('海の 膨らみ（潮）',ex,ey-170,{size:28,color:'#9fd0ff',anchor:'middle',weight:700}));
  const bx=ex+190*Math.cos(lead),by=ey+190*Math.sin(lead);
  s+=fade(vseg(ctx,p,.6,.7),dot(bx,by,9,HC)+arrow(bx+10,by,mx-80,my-10,{color:PULL,w:4,head:14})+label('月の 引力',800,215,{size:26,color:PULL,anchor:'middle',weight:700}));
  const slow=vseg(ctx,p,.7,.95);
  s+=spin(ex,ey,225,mix(.55,.3,slow),{a0:PI*.75,g:vseg(ctx,p,.3,.4)});
  s+=fade(vseg(ctx,p,.75,.88),rect(700,400,440,60,{fill:SPIN,fo:.12,stroke:SPIN,sw:2,rx:14})+label('地球の 自転も 遅くなる',920,441,{size:30,color:SPIN,anchor:'middle',weight:700}));
  s+=note('大きさは 誇張',20,500,vseg(ctx,p,.5,.6));
  return s;
 },{roll:0,q:{end:.28,lines:['地球にも、ブレーキは かかる？'],text:'地球にも、ブレーキはかかる？'},bridge:.97}),

 // 6 — 1日が延びる・月が遠ざかる（アポロの反射板へのレーザー）
 [K+'laser']:wrap(3,(p,ctx)=>{
  const t=cueT(p,ctx),ex=180,ey=330,away=vseg(ctx,p,.55,.9),mx=980+50*away,my=330;
  let s=stars()+earth(ex,ey,110,{id:'l'});
  s+=moon(mx,my,60,{});
  const st=[ex+78,ey-78];
  s+=dot(st[0],st[1],7,'#fff');
  s+=rect(mx-62-12,my-16,14,30,{fill:'#d8dde8',fo:1,stroke:'#fff',sw:1,rx:2});
  // laser pulse going and coming back
  const L=vseg(ctx,p,.5,1),beam=fade(L>0?1:0,line(st[0],st[1],mx-70,my,{color:'#ff5a5a',w:2,opacity:.5}));
  s+=beam;
  if(L>0){const ph=(t*.8)%1,q=ph<.5?ph*2:2-ph*2;s+=dot(mix(st[0],mx-70,q),mix(st[1],my,q),7,'#ff5a5a');}
  s+=fade(vseg(ctx,p,.6,.7),label('アポロが 置いた 反射板',mx-30,my+105,{size:24,color:C.dim,anchor:'middle',weight:700})+label('レーザー',600,ey+20,{size:26,color:'#ff8a8a',anchor:'middle',weight:700}));
  s+=fade(away,arrow(mx+72,my,mx+132,my,{color:HC,w:5,head:14}));
  s+=card(330,80,420,90,label('1日：100年で 約2ミリ秒 長く',540,137,{size:28,color:C.t,anchor:'middle',weight:700}),vseg(ctx,p,.05,.15),C.t);
  s+=card(330,420,420,80,label('月：1年に 約3.8 cm 遠く',540,472,{size:28,color:HC,anchor:'middle',weight:700}),vseg(ctx,p,.62,.72),HC);
  return s;
 },{fadeIn:false,pill:'地球にも、ブレーキはかかる？',bridge:.95}),

 // 7 — 次の疑問：恐竜の時代、1日は何時間？
 [K+'next']:wrap(4,(p,ctx)=>{
  const t=cueT(p,ctx),g=vseg(ctx,p,.02,.15);
  let s=dino(330,500,1,{g:vseg(ctx,p,.3,.45)});
  s+=clock(860,395,95,t,{g:vseg(ctx,p,.5,.65)})+fade(vseg(ctx,p,.6,.75),label('？時間',1035,410,{size:40,color:HC,anchor:'middle',weight:700}));
  s+=finalQ(['恐竜が いた 大昔、','地球の 1日は 何時間？'],g,{y:70,sc:.9+.1*g});
  return s;
 },{roll:0}),
};

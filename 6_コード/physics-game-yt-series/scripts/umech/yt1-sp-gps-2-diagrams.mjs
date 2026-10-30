// 特別編「GPS と相対性理論」パート2/4 (ys-sp-gps-2) — 図。Stage 1200×515.
// 共通の見た目：地球は青い円、衛星は金色の本体に青い太陽電池板、時計はアナログの顔に「地上」「衛星」の札。
// 色：c・v 紫、時間 t・T 金、x・y・z・距離 水色、力 緑、加速度 赤、遅れ 青 #6f9dff（下向き・−）、進み 赤（上向き・＋）、差 黄。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,clamp,mix,poly,smooth} from './anim.mjs';
import {card,tag,TX,fcard,cs,cross,okMark,sceneT,wavy} from './yt1-hs-a-nucleus-1-diagrams.mjs';

const K='sp-gps-2:';
const PI=Math.PI;
export const SLOW='#6f9dff', FAST='#ff6b6b', EARTH='#2f6fd6', GOLD='#e6b84a', PANEL='#3d7bff';
const VC=C.v, TC=C.t, XC=C.x, FC=C.F, HC=C.hi;
const vt=cs(VC,'v'), Tt=cs(TC,'T');
const U=s=>`\\,\\mathrm{${s}}`;

// ---------- 共通部品 ----------
// 3D: x 右, y 奥, z 上。カメラは少し上から（eps）。
const EPS=.36;
const proj=(cx,cy,P)=>{const [x,y,z]=P;return {x:cx+x,y:cy-(z*Math.cos(EPS)-y*Math.sin(EPS)),d:y*Math.cos(EPS)+z*Math.sin(EPS)};};
const rotZ=([x,y,z],a)=>[x*Math.cos(a)-y*Math.sin(a),x*Math.sin(a)+y*Math.cos(a),z];
// 地球：青い円＋手前側の経線・緯線（rot で自転）
export function earth(cx,cy,R,{rot=0,g=1,grid=1,flat=0}={}){
 let s=dot(cx,cy,R*1.06,EARTH,.18)+dot(cx,cy,R,EARTH)+dot(cx-R*.32,cy-R*.32,R*.55,'#5b93ec',.35);
 if(grid&&!flat){
  const pts=[];
  for(let k=0;k<12;k++){const lon=rot+k*PI/6;const seg_=[];for(let i=0;i<=24;i++){const la=-PI/2+PI*i/24;const P=[R*Math.cos(la)*Math.cos(lon),R*Math.cos(la)*Math.sin(lon),R*Math.sin(la)];const q=proj(cx,cy,P);if(q.d<0)seg_.push([q.x,q.y]);else if(seg_.length){pts.push(seg_.slice());seg_.length=0;}}if(seg_.length)pts.push(seg_);}
  for(const la of [-PI/4,0,PI/4]){const seg_=[];for(let i=0;i<=48;i++){const lon=2*PI*i/48;const q=proj(cx,cy,[R*Math.cos(la)*Math.cos(lon),R*Math.cos(la)*Math.sin(lon),R*Math.sin(la)]);if(q.d<0)seg_.push([q.x,q.y]);else if(seg_.length){pts.push(seg_.slice());seg_.length=0;}}if(seg_.length)pts.push(seg_);}
  s+=pts.filter(a=>a.length>1).map(a=>draw(a,1,{color:'#9cc2ff',w:1.5,opacity:.45})).join('');
 }
 if(grid&&flat){ // 北極の上から見た地球：経線は放射状、rot で回る
  for(let k=0;k<12;k++){const a=rot+k*PI/6;s+=line(cx,cy,cx+R*Math.cos(a),cy+R*Math.sin(a),{color:'#9cc2ff',w:1.5,opacity:.4});}
  s+=ring(cx,cy,R*.5,{color:'#9cc2ff',w:1.5});
 }
 s+=ring(cx,cy,R,{color:'#8fb6ff',w:2});
 return fade(g,s);
}
// 衛星：金色の本体＋青い太陽電池板（a：板の向き）
export function sat(x,y,s=1,{a=0,g=1}={}){
 const P=(u,v)=>[x+(u*Math.cos(a)-v*Math.sin(a))*s,y+(u*Math.sin(a)+v*Math.cos(a))*s];
 const box=(u0,v0,u1,v1)=>[P(u0,v0),P(u1,v0),P(u1,v1),P(u0,v1)];
 let o=line(...P(-30,0),...P(30,0),{color:'#c9d3e6',w:Math.max(1,2*s)});
 o+=poly(box(-46,-9,-15,9),{fill:PANEL,fo:1,stroke:'#9cc2ff',sw:Math.max(1,1.2*s)})+poly(box(15,-9,46,9),{fill:PANEL,fo:1,stroke:'#9cc2ff',sw:Math.max(1,1.2*s)});
 if(s>=1.2)for(const u of [-38,-30,-22,22,30,38])o+=line(...P(u,-9),...P(u,9),{color:'#9cc2ff',w:1});
 o+=poly(box(-11,-11,11,11),{fill:GOLD,fo:1,stroke:'#fff0b8',sw:Math.max(1,1.5*s)});
 return fade(g,o);
}
// アナログ時計（sec：表示する時刻[秒]）。name：札の文字。
export function clock(x,y,R,{sec=0,name='',col=C.ink,g=1,fan=0}={}){
 let s=dot(x,y,R+6,'#0e1830')+ring(x,y,R,{color:col,w:4,fill:'#16233f'});
 for(let i=0;i<12;i++){const a=i*PI/6;const r0=i%3?R*.86:R*.78;s+=line(x+r0*Math.sin(a),y-r0*Math.cos(a),x+R*.95*Math.sin(a),y-R*.95*Math.cos(a),{color:C.ink,w:i%3?2:4});}
 const hand=(ang,len,w,c)=>line(x,y,x+len*Math.sin(ang),y-len*Math.cos(ang),{color:c,w});
 const sa=2*PI*sec/60,ma=2*PI*sec/3600+PI*.7,ha=2*PI*sec/43200+PI*1.4;
 if(fan>0){ // ずれの幅（どちらにずれるかは、まだ言わない）
  const a0=sa-fan,a1=sa+fan,r=R*.88;
  s+=`<path d="M${x} ${y} L${(x+r*Math.sin(a0)).toFixed(1)} ${(y-r*Math.cos(a0)).toFixed(1)} A${r} ${r} 0 0 1 ${(x+r*Math.sin(a1)).toFixed(1)} ${(y-r*Math.cos(a1)).toFixed(1)} Z" fill="${HC}" fill-opacity=".35" stroke="${HC}" stroke-width="2"/>`;
 }
 s+=hand(ha,R*.5,7,C.ink)+hand(ma,R*.72,5,C.ink)+hand(sa,R*.85,3,TC)+dot(x,y,7,TC);
 if(name){const w=[...name].length*26+36;s+=rect(x-w/2,y+R+16,w,42,{fill:col,fo:.16,stroke:col,rx:12})+label(name,x,y+R+46,{size:26,color:col,anchor:'middle',weight:700});}
 return fade(g,s);
}
const slowArrow=(x,y,L,{g=1,size=40}={})=>fade(g,arrow(x,y-L/2,x,y+L/2,{color:SLOW,w:8,head:24})+label('−',x+30,y+size*.35,{size,color:SLOW,weight:700}));
const fastArrow=(x,y,L,{g=1,size=40}={})=>fade(g,arrow(x,y+L/2,x,y-L/2,{color:FAST,w:8,head:24})+label('＋',x+26,y+size*.35,{size,color:FAST,weight:700}));
const ra=(x,y,ux,uy,vx,vy,s=16,col=C.ink)=>draw([[x+ux*s,y+uy*s],[x+ux*s+vx*s,y+uy*s+vy*s],[x+vx*s,y+vy*s]],1,{color:col,w:2});

// GPS 星座：6 面×5 機、傾き 55°。T（画面上の1周）＝12 秒、地球の自転はその2倍の 24 秒（本物と同じ比）。
const RO=205, RE=RO*6371/26571;
const PLANES=[...Array(6)].map((_,k)=>{const O=k*PI/3+.3,i=55*PI/180;return {a:[Math.cos(O),Math.sin(O),0],b:[-Math.sin(O)*Math.cos(i),Math.cos(O)*Math.cos(i),Math.sin(i)]};});
const PCOL=['#ffcf67','#83ecc0','#6adfff','#b49bff','#ff9ce6','#ffb36b'];
const satPos=(pl,u,r=RO)=>[0,1,2].map(j=>r*(pl.a[j]*Math.cos(u)+pl.b[j]*Math.sin(u)));
function constellation(cx,cy,t,{g=1,planes=1,hiPlane=-1,obs=0,dimSats=0,sel=null}={}){
 const W=2*PI/12,rot=2*PI*t/24;let back='',front='';
 PLANES.forEach((pl,k)=>{
  const pts=[...Array(97)].map((_,i)=>proj(cx,cy,satPos(pl,2*PI*i/96)));
  const col=hiPlane<0?PCOL[k]:(k===hiPlane?PCOL[k]:C.faint);
  // 奥側は薄く、手前側は濃く
  let run=[],isF=null;const flush=()=>{if(run.length>1){const svg=draw(run,1,{color:col,w:isF?2.5:1.5,opacity:(isF?.75:.3)*planes});if(isF)front+=svg;else back+=svg;}};
  for(const q of pts){const f=q.d<0;if(isF!==null&&f!==isF){run.push([q.x,q.y]);flush();run=[];}isF=f;run.push([q.x,q.y]);}
  flush();
 });
 const sats=[];PLANES.forEach((pl,k)=>{for(let j=0;j<5;j++){const u=j*2*PI/5+k*.45+W*t;const P=satPos(pl,u);sats.push({P,q:proj(cx,cy,P),k});}});
 let O=null,On=null;
 if(obs){const la=35*PI/180,lon=-PI/2-.25+rot;On=[Math.cos(la)*Math.cos(lon),Math.cos(la)*Math.sin(lon),Math.sin(la)];O=On.map(v=>v*RE);}
 let lines='',nvis=0;
 if(O){const oq=proj(cx,cy,O);for(const s of sats){const d=[0,1,2].reduce((a,j)=>a+(s.P[j]-O[j])*On[j],0);if(d>0){nvis++;lines+=line(oq.x,oq.y,s.q.x,s.q.y,{color:HC,w:2,opacity:.75*obs});}}}
 const satSvg=s=>{const sc=s.q.d<0?.42:.32;return sat(s.q.x,s.q.y,sc,{a:.4,g:1-dimSats*.7});};
 let o=back+sats.filter(s=>s.q.d>=0).map(satSvg).join('')+earth(cx,cy,RE,{rot});
 o+=front+lines+sats.filter(s=>s.q.d<0).map(satSvg).join('');
 if(O){const oq=proj(cx,cy,O);o+=dot(oq.x,oq.y,7,HC)+ring(oq.x,oq.y,12,{color:HC,w:2});}
 return {svg:fade(g,o),nvis,sats};
}

// 横に投げた球（ニュートンの山）。GM＝1、地球の半径 1、山の高さ 0.12。
const R0=1.12;
const CANNON=[.6,.82,.95,1].map(f=>{
 let x=0,y=R0,vx=f*Math.sqrt(1/R0),vy=0;const pts=[[x,y]];let ang=0,prev=0;const dt=.01;
 for(let i=0;i<20000;i++){const r=Math.hypot(x,y),a=-1/(r*r*r);
  vx+=a*x*dt/2;vy+=a*y*dt/2;x+=vx*dt;y+=vy*dt;const r2=Math.hypot(x,y),a2=-1/(r2*r2*r2);vx+=a2*x*dt/2;vy+=a2*y*dt/2;
  const th=Math.atan2(x,y);ang+=((th-prev+3*PI)%(2*PI))-PI;prev=th;
  if(i%3===0)pts.push([x,y]);if(r2<1){pts.push([x,y]);break;}if(ang>=2*PI-.02){pts.push([0,R0]);break;}}
 return {f,pts};
});
function cannonScene(p,{cx=600,cy=275,R=150,t=0}={}){
 const S=([x,y])=>[cx+x*R,cy-y*R];
 let s=earth(cx,cy,R,{rot:0,grid:0});
 s+=poly([[cx-34,cy-R+6],[cx,cy-R*R0-2],[cx+34,cy-R+6]],{fill:'#6f8a5a',fo:1,stroke:'#a9c48f'});
 const names=['遅い','少し 速い','もっと 速い','十分 速い → 一周'];
 CANNON.forEach((c,i)=>{
  const a=.06+i*.2,b=a+(i===3?.3:.16);const u=lin(p,a,b);if(u<=0)return;
  const pts=c.pts.map(S);const last=i===3;
  const col=last?HC:VC;
  s+=draw(pts,u,{color:col,w:last?4:3,opacity:last||u<1?1:.55,dash:last?'':''});
  const n=Math.max(1,Math.floor(u*(pts.length-1)));const [bx,by]=pts[n];
  if(u<1||last){s+=dot(bx,by,9,'#ffffff');
   if(last&&u>.05){const dx=cx-bx,dy=cy-by,L=Math.hypot(dx,dy);s+=arrow(bx,by,bx+dx/L*60,by+dy/L*60,{color:FC,w:4,head:12});}}
  const end=pts[pts.length-1];
  if(!last&&u>=1)s+=dot(end[0],end[1],7,VC,.7);
 });
 const L=[[cx+170,cy-R-40],[cx+215,cy-80],[cx+250,cy+20],[cx-300,cy+70]];
 // 名前の札（右上に並べる）
 names.forEach((n,i)=>{const a=.06+i*.2;s+=fade(seg(p,a,a+.06),label(`${i+1}. ${n}`,960,120+i*48,{size:26,color:i===3?HC:VC,weight:700}));});
 s+=fade(seg(p,.88,.97),label('落ちても 落ちても 地面に 届かない',600,505,{size:28,color:FC,anchor:'middle',weight:700}));
 return s;
}

// 2枚のカード（速さ・高さ）
function twoCards(p,t,{g=1,arrows=0,values=1}={}){
 let s=card(70,90,500,330,label('速さ',320,150,{size:40,color:VC,anchor:'middle',weight:700})+fade(values,label('秒速 3.9 km',320,400,{size:34,color:VC,anchor:'middle',weight:700})),g,VC);
 const sx=135+((t*70)%165);s+=fade(g,sat(sx,270,.9,{a:0})+arrow(sx+48,270,sx+128,270,{color:VC,w:5,head:16}));
 s+=card(630,90,500,330,label('高さ',880,150,{size:40,color:XC,anchor:'middle',weight:700})+fade(values,label('2万 km',880,400,{size:34,color:XC,anchor:'middle',weight:700})),g,XC);
 s+=fade(g,`<path d="M690 360 Q880 330 1070 360" fill="none" stroke="${EARTH}" stroke-width="10"/>`+line(880,345,880,215,{color:XC,w:3,dash:'8 6'})+sat(880,200,.9)+label('地上',780,345,{size:24,color:C.dim,anchor:'middle'}));
 if(arrows){
  s+=slowArrow(500,250,120,{g:seg(arrows,.0,.35)})+fade(seg(arrows,.0,.35),label('遅らせる',500,345,{size:28,color:SLOW,anchor:'middle',weight:700}));
  s+=fastArrow(1030,250,120,{g:seg(arrows,.45,.8)})+fade(seg(arrows,.45,.8),label('進める',1030,345,{size:28,color:FAST,anchor:'middle',weight:700}));
 }
 return s;
}

// エネルギーの段
const LV=[400,190,112,85];
function levels(x0,x1,{g=1,hi=[]}={}){
 let s=arrow(x0-50,440,x0-50,50,{color:C.E,w:3,head:14})+label('エネルギー',x0-50,36,{size:24,color:C.E,anchor:'middle',weight:700});
 LV.forEach((y,i)=>{s+=line(x0,y,x1,y,{color:hi.includes(i)?HC:C.ink,w:hi.includes(i)?5:4});});
 return fade(g,s);
}

function numFmt(n){return Math.floor(n).toLocaleString('en-US');}

export const spGps2Diagrams={
 // ================= S1 衛星は、落ち続けている =================
 [K+'orbits']:(p,ctx)=>{
  const t=sceneT(p,ctx);const {svg}=constellation(430,262,t,{planes:seg(p,.05,.3)});
  let s=svg;
  s+=card(760,100,400,120,label('GPS の 衛星',960,145,{size:26,color:C.dim,anchor:'middle'})+label('約 30 機',960,198,{size:40,color:GOLD,anchor:'middle',weight:700}),seg(p,.15,.3),GOLD);
  s+=card(760,260,400,140,label('地表からの 高さ',960,305,{size:26,color:C.dim,anchor:'middle'})+label('約 2万200 km',960,365,{size:40,color:XC,anchor:'middle',weight:700}),seg(p,.55,.7),XC);
  return s;
 },
 [K+'planes']:(p,ctx)=>{
  const t=sceneT(p,ctx);const k=Math.min(5,Math.floor(lin(p,.05,.45)*6));
  const hi=p<.05||p>.5?-1:k;
  const {svg,nvis}=constellation(430,262,t,{hiPlane:hi,obs:seg(p,.55,.7)});
  let s=svg;
  s+=card(760,100,400,120,label('軌道の 面',960,145,{size:26,color:C.dim,anchor:'middle'})+label(`${p<.5?k+1:6} / 6`,960,198,{size:40,color:p<.5?PCOL[k]:C.ink,anchor:'middle',weight:700}),1,C.faint);
  s+=card(760,260,400,150,label('ここ から 見える 衛星',960,305,{size:26,color:HC,anchor:'middle',weight:700})+label(`${nvis} 機`,960,375,{size:46,color:HC,anchor:'middle',weight:700}),seg(p,.55,.7),HC);
  return s;
 },
 [K+'howfast']:(p,ctx)=>{
  const t=sceneT(p,ctx);const {svg,sats}=constellation(430,262,t,{dimSats:.6,planes:.6});
  let s=svg;
  const S=sats.filter(s=>s.q.d<0).sort((a,b)=>a.q.x-b.q.x).pop();
  if(S){s+=ring(S.q.x,S.q.y,22,{color:VC,w:3});}
  s+=card(760,170,400,160,label('どれくらいの',960,235,{size:32,color:C.ink,anchor:'middle',weight:700})+label('速さ？',960,295,{size:46,color:VC,anchor:'middle',weight:700}),seg(p,.1,.25),VC);
  return s;
 },
 [K+'cannon']:(p,ctx)=>cannonScene(p,{t:sceneT(p,ctx)}),
 [K+'circle']:(p,ctx)=>{
  const t=sceneT(p,ctx),cx=380,cy=262,R=200,u=-PI/2+t*2*PI/12;
  let s=ring(cx,cy,R,{color:C.faint,w:2,dash:'6 8'})+earth(cx,cy,75,{rot:t*2*PI/24});
  const x=cx+R*Math.cos(u),y=cy+R*Math.sin(u),tx=-Math.sin(u),ty=Math.cos(u),nx=-Math.cos(u),ny=-Math.sin(u);
  s+=fade(seg(p,.1,.25),arrow(x,y,x+nx*100,y+ny*100,{color:FC,w:6,head:18}));
  s+=fade(seg(p,.3,.45),arrow(x,y,x+tx*120,y+ty*120,{color:VC,w:6,head:18})+ra(x,y,nx,ny,tx,ty,18,HC));
  s+=sat(x,y,.7,{a:u+PI/2});
  s+=card(680,90,470,130,label('万有引力',915,145,{size:32,color:FC,anchor:'middle',weight:700})+label('（地球の 中心 向き）',915,195,{size:26,color:FC,anchor:'middle'}),seg(p,.1,.25),FC);
  s+=card(680,250,470,130,label('＝ 円運動に 必要な',915,305,{size:30,color:C.ink,anchor:'middle',weight:700})+label('中心 向きの 力',915,350,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.5,.65),HC);
  s+=fade(seg(p,.3,.45),label('速度',700,440,{size:26,color:VC,weight:700})+line(770,432,820,432,{color:VC,w:5})+label('力',850,440,{size:26,color:FC,weight:700})+line(890,432,940,432,{color:FC,w:5})+label('直角',970,440,{size:26,color:HC,weight:700}));
  s+=tag('近似：円の 軌道と みなす',915,495,{color:C.dim,size:22,g:seg(p,.6,.75)});
  return s;
 },
 [K+'eq']:(p)=>{
  const L=`\\dfrac{G M m}{r^2}`,R=`\\dfrac{m ${vt}^2}{r}`;
  let s=card(150,90,900,200,TX(`${L}=${R}`,600,215,{size:66}),seg(p,.02,.15),HC);
  s+=fade(seg(p,.2,.35),label('万有引力',420,340,{size:30,color:FC,anchor:'middle',weight:700})+arrow(420,320,470,290,{color:FC,w:3,head:12}));
  s+=fade(seg(p,.45,.6),label('円運動に 必要な 力',790,340,{size:30,color:C.ink,anchor:'middle',weight:700})+arrow(760,320,720,290,{color:C.ink,w:3,head:12}));
  s+=fade(seg(p,.6,.75),label('G：万有引力定数　M：地球の 質量　m：衛星の 質量　r：中心からの 距離',600,420,{size:24,color:C.dim,anchor:'middle'}));
  s+=tag('原理（万有引力の 法則）',300,490,{color:FC,size:22,g:seg(p,.2,.35)});
  return s;
 },
 [K+'solve']:(p)=>{
  const R0_=`\\dfrac{G M m}{r^2}=\\dfrac{m ${vt}^2}{r}`;
  const cm=`{\\color{${C.a}}\\cancel{\\color{${C.ink}}m}}`;
  const R1=`\\dfrac{G M ${cm}}{r^2}=\\dfrac{${cm}\\, ${vt}^2}{r}`;
  const u1=seg(p,.06,.16);
  let s=fade(1-u1,TX(R0_,430,72,{size:42}))+fade(u1,TX(R1,430,72,{size:42}));
  s+=fade(seg(p,.06,.16),label('① 両辺の m を 消す',830,72,{size:28,color:C.a,weight:700}));
  const u2=seg(p,.22,.32),u3=seg(p,.36,.46);
  s+=fade(u2*(1-u3*.0),TX(`\\dfrac{G M}{r^2}${u3>0?`{\\color{${HC}}\\times r}`:''}=\\dfrac{${vt}^2}{r}${u3>0?`{\\color{${HC}}\\times r}`:''}`,430,182,{size:42}));
  s+=fade(u3,label('② 両辺に r を 掛ける',830,182,{size:28,color:HC,weight:700}));
  const u4=seg(p,.52,.62);
  s+=fade(u4,TX(`\\dfrac{G M}{r}=${vt}^2`,430,292,{size:42})+label('③ 左右を',40,425,{size:28,color:C.dim,weight:700})+label('入れかえる',40,465,{size:28,color:C.dim,weight:700}));
  s+=fcard(250,362,500,140,`${vt}^2=\\dfrac{G M}{r}`,{size:50,col:HC,g:seg(p,.64,.74),dy:10});
  s+=fade(seg(p,.76,.86),label('衛星の 質量 m が ない',960,420,{size:28,color:HC,anchor:'middle',weight:700})+label('→ 速さは m に よらない',960,465,{size:28,color:HC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'radius']:(p)=>{
  const ex=170,ey=330,Re=120,Rs=Re*26571/6371; // 実際の比
  let s=`<path d="M${ex+Rs*Math.cos(-.62)} ${ey+Rs*Math.sin(-.62)} A${Rs} ${Rs} 0 0 1 ${ex+Rs*Math.cos(.17)} ${ey+Rs*Math.sin(.17)}" fill="none" stroke="${C.faint}" stroke-width="2" stroke-dasharray="6 8"/>`;
  s+=earth(ex,ey,Re,{rot:.3});const sx=ex+Rs;
  s+=sat(sx,ey,.8);
  s+=dot(ex,ey,6,C.ink);
  s+=fade(seg(p,.08,.2),line(ex,ey,ex+Re,ey,{color:XC,w:5})+label('半径 6,371 km',ex+Re/2+10,ey+60,{size:26,color:XC,anchor:'middle',weight:700}));
  s+=draw([[ex+Re,ey],[sx-30,ey]],seg(p,.35,.5),{color:HC,w:5});
  s+=fade(seg(p,.4,.5),label('高さ 20,200 km',(ex+Re+sx)/2,ey+60,{size:26,color:HC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.65),line(ex,ey-40,sx,ey-40,{color:C.ink,w:2})+line(ex,ey-52,ex,ey-28,{color:C.ink,w:2})+line(sx,ey-52,sx,ey-28,{color:C.ink,w:2})+label('r ≈ 26,600 km',(ex+sx)/2,ey-56,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fcard(760,70,420,120,`r=6371+20200`,{size:38,col:C.faint,g:seg(p,.55,.65)});
  s+=fcard(760,210,420,110,`\\approx26600\\,\\mathrm{km}`,{size:42,col:HC,g:seg(p,.7,.8)});
  s+=fade(seg(p,.05,.15),label('地球の 中心',ex,ey+165,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'speed']:(p)=>{
  let s=fade(.75,TX(`${vt}=\\sqrt{\\dfrac{G M}{r}}`,250,120,{size:46}));
  s+=fade(seg(p,.05,.18),label('GM ＝ 3.99×10¹⁴ m³/s²（地球）',250,215,{size:24,color:C.dim,anchor:'middle'}));
  s+=card(470,50,700,140,TX(`=\\sqrt{\\dfrac{3.99\\times10^{14}}{2.66\\times10^{7}}}\\approx3.87\\times10^{3}${U('m/s')}`,820,135,{size:40}),seg(p,.1,.25),C.faint);
  s+=fcard(470,215,700,100,`${vt}\\approx3.87${U('km/s')}`,{size:48,col:VC,g:seg(p,.35,.48),dy:-4});
  s+=fade(seg(p,.6,.7),label('× 3600 秒（1時間）',820,365,{size:26,color:TC,anchor:'middle',weight:700}));
  s+=fcard(470,385,700,100,`\\approx1.4\\times10^{4}${U('km/h')}`,{size:46,col:VC,g:seg(p,.65,.78),dy:-4});
  s+=fade(seg(p,.7,.8),label('時速 約 1万4,000 km',250,445,{size:30,color:VC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'race']:(p)=>{
  const x0=160,x1=1100,u=lin(p,.08,.7);
  let s=line(x0,170,x1,170,{color:C.faint,w:3})+line(x0,350,x1,350,{color:C.faint,w:3});
  s+=label('衛星 時速 約 1万4,000 km',x0,120,{size:28,color:VC,weight:700});
  s+=label('新幹線 時速 320 km',x0,300,{size:28,color:VC,weight:700});
  const sx=mix(x0,x1,u),tx=mix(x0,x1,u*320/14000);
  s+=rect(x0,155,sx-x0,30,{fill:VC,fo:.55,stroke:VC,rx:4})+sat(sx+10,170,.8);
  s+=rect(x0,335,tx-x0,30,{fill:VC,fo:.55,stroke:VC,rx:4});
  s+=poly([[tx,330],[tx+70,330],[tx+96,352],[tx+70,372],[tx,372]],{fill:'#e8ecf2',fo:1,stroke:'#9aabc7'})+rect(tx+8,338,50,12,{fill:'#3d7bff',fo:1,rx:3});
  s+=card(720,400,400,90,label('約 40 倍',920,460,{size:40,color:HC,anchor:'middle',weight:700}),seg(p,.72,.84),HC);
  return s;
 },
 [K+'period']:(p,ctx)=>{
  const cx=280,cy=262,R=200,u=seg(p,.05,.8);const a=-PI/2+2*PI*u;
  let s=ring(cx,cy,R,{color:C.faint,w:2,dash:'6 8'})+earth(cx,cy,R*6371/26571,{rot:u*PI});
  const pts=[...Array(Math.max(2,Math.ceil(u*120)+1))].map((_,i)=>{const b=-PI/2+2*PI*u*i/Math.max(1,Math.ceil(u*120));return [cx+R*Math.cos(b),cy+R*Math.sin(b)];});
  s+=draw(pts,1,{color:TC,w:4});
  s+=sat(cx+R*Math.cos(a),cy+R*Math.sin(a),.6,{a:a+PI/2});
  const mins=Math.round(u*(11*60+58));s+=label(`${Math.floor(mins/60)}時間 ${String(mins%60).padStart(2,'0')}分`,cx,cy+R*6371/26571+60,{size:28,color:TC,anchor:'middle',weight:700});
  s+=card(560,70,600,150,TX(`${Tt}=\\dfrac{2\\pi r}{${vt}}\\approx4.31\\times10^{4}${U('s')}`,860,165,{size:44}),seg(p,.05,.18),TC);
  s+=fade(seg(p,.05,.18),label('円周 ÷ 速さ',600,105,{size:22,color:C.dim}));
  s+=card(560,250,600,100,label('≈ 11時間 58分',860,315,{size:40,color:TC,anchor:'middle',weight:700}),seg(p,.4,.55),TC);
  s+=card(560,380,600,90,label('1日の ほぼ 半分',860,438,{size:34,color:HC,anchor:'middle',weight:700}),seg(p,.7,.82),HC);
  return s;
 },
 [K+'twice']:(p)=>{
  const cx=330,cy=262,Re=80,R=200,D=seg(p,.04,.6);
  const ea=-PI/2+2*PI*D,sa=-PI/2+4*PI*D;
  let s=ring(cx,cy,R,{color:C.faint,w:2,dash:'6 8'})+earth(cx,cy,Re,{rot:ea,flat:1});
  const ox=cx+Re*Math.cos(ea),oy=cy+Re*Math.sin(ea);
  s+=dot(ox,oy,9,HC)+line(ox,oy,cx+(Re+40)*Math.cos(ea),cy+(Re+40)*Math.sin(ea),{color:HC,w:2,dash:'4 5'});
  const pts=[...Array(161)].map((_,i)=>{const b=-PI/2+4*PI*D*i/160;return [cx+R*Math.cos(b),cy+R*Math.sin(b)];});
  s+=draw(pts,1,{color:TC,w:3,opacity:.7});
  s+=sat(cx+R*Math.cos(sa),cy+R*Math.sin(sa),.6,{a:sa+PI/2});
  s+=label('北極の 上から 見た 図',cx,500,{size:24,color:C.dim,anchor:'middle'});
  const hrs=Math.round(D*24);
  s+=card(620,70,540,130,label(`経過 ${hrs} 時間`,890,125,{size:30,color:TC,anchor:'middle',weight:700})+label(`衛星 ${Math.min(2,Math.floor(D*2+1e-6))} 周`,890,180,{size:30,color:GOLD,anchor:'middle',weight:700}),1,TC);
  s+=card(620,225,540,100,label('1日に 2周 → 同じ 空の 位置',890,285,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.58,.68),C.faint);
  s+=card(620,350,540,110,label('毎日 約 4分 早く 戻る',890,418,{size:34,color:HC,anchor:'middle',weight:700}),seg(p,.72,.84),HC);
  return s;
 },
 [K+'sidereal']:(p)=>{
  // 太陽のまわりを回る地球（角度は大きく誇張）
  const sx=110,sy=262,Ro=360,a1=.42,a2=-.42;
  let s='';for(let k=5;k>=1;k--)s+=dot(sx,sy,46*(1+k*.1),'#ffb36b',.08);s+=dot(sx,sy,46,'#ffb84d')+label('太陽',sx,sy+80,{size:24,color:C.E,anchor:'middle',weight:700});
  s+=`<path d="M${sx+Ro*Math.cos(a1)} ${sy+Ro*Math.sin(a1)} A${Ro} ${Ro} 0 0 0 ${sx+Ro*Math.cos(a2)} ${sy+Ro*Math.sin(a2)}" fill="none" stroke="${C.faint}" stroke-width="2" stroke-dasharray="6 8"/>`;
  const u=seg(p,.05,.4),am=mix(a1,a2,u);
  const E=a=>[sx+Ro*Math.cos(a),sy+Ro*Math.sin(a)];
  const [e1x,e1y]=E(a1),[ex,ey]=E(am);
  const toSun=(x,y)=>Math.atan2(sy-y,sx-x);
  const d0=toSun(e1x,e1y);
  // はじめの位置：太陽を向いた目印
  s+=fade(.35+.65*(1-u),earth(e1x,e1y,34,{grid:0})+arrow(e1x,e1y,e1x+70*Math.cos(d0),e1y+70*Math.sin(d0),{color:HC,w:4,head:12}));
  // 1回転（星に対して）しながら移動
  const spin=d0+2*PI*u;
  if(u>0){s+=earth(ex,ey,34,{grid:0})+arrow(ex,ey,ex+70*Math.cos(spin),ey+70*Math.sin(spin),{color:HC,w:4,head:12});}
  const g2=seg(p,.42,.52);
  if(u>=1){
   const d1=toSun(ex,ey);
   s+=fade(g2,arrow(ex,ey,ex+170*Math.cos(d0),ey+170*Math.sin(d0),{color:C.dim,w:2,head:10})+label('遠い 星の 方向',ex-150,ey-95,{size:24,color:C.dim,anchor:'middle'}));
   const g3=seg(p,.55,.68),cur=mix(d0,d1,g3);
   s+=fade(g3,arrow(ex,ey,ex+70*Math.cos(cur),ey+70*Math.sin(cur),{color:C.E,w:4,head:12}));
   const r=58;s+=fade(g3,`<path d="M${(ex+r*Math.cos(d0)).toFixed(1)} ${(ey+r*Math.sin(d0)).toFixed(1)} A${r} ${r} 0 0 0 ${(ex+r*Math.cos(cur)).toFixed(1)} ${(ey+r*Math.sin(cur)).toFixed(1)}" fill="none" stroke="${C.E}" stroke-width="4"/>`+label('あと 約 4分',ex+70,ey+60,{size:26,color:C.E,weight:700}));
  }
  s+=card(660,60,500,110,label('星から 見た 1日',910,105,{size:26,color:C.dim,anchor:'middle'})+label('23時間 56分',910,152,{size:36,color:HC,anchor:'middle',weight:700}),seg(p,.4,.52),HC);
  s+=card(660,190,500,100,label('太陽から 見た 1日 ＝ 24時間',910,250,{size:28,color:C.E,anchor:'middle',weight:700}),seg(p,.62,.72),C.E);
  s+=card(660,310,500,140,label('GPS の 1周 ＝ その 半分',910,365,{size:28,color:C.ink,anchor:'middle',weight:700})+label('11時間 58分',910,420,{size:36,color:TC,anchor:'middle',weight:700}),seg(p,.78,.88),TC);
  s+=fade(seg(p,.05,.15),label('角度は 大きく 描いて います',330,500,{size:22,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'remember']:(p,ctx)=>twoCards(p,sceneT(p,ctx),{g:seg(p,.03,.2)})+fade(seg(p,.6,.75),label('この 2つを 覚えておく',600,480,{size:30,color:HC,anchor:'middle',weight:700})),
 // ================= S2 原子が刻む1秒 =================
 [K+'onboard']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=sat(330,262,4.2,{a:0});
  s+=fade(seg(p,.25,.45),ring(330,262,52,{color:HC,w:3})+line(370,230,640,170,{color:HC,w:2,dash:'6 6'})+line(370,295,640,370,{color:HC,w:2,dash:'6 6'}));
  s+=card(640,90,500,330,clock(890,230,100,{sec:t*1,name:''})+label('原子時計',890,385,{size:36,color:HC,anchor:'middle',weight:700}),seg(p,.35,.5),HC);
  return s;
 },
 [K+'levels']:(p,ctx)=>{
  const t=sceneT(p,ctx),x0=180,x1=640;
  let s=levels(x0,x1,{g:seg(p,.02,.15)});
  // 電子：段から段へ跳ぶ（間には止まらない）
  const seq=[0,1,0,2,1,0,3,0],step=Math.floor(t/1.3)%seq.length,fr=(t/1.3)%1;const nxt=seq[(step+1)%seq.length];
  const y=fr<.85?LV[seq[step]]:mix(LV[seq[step]],LV[nxt],(fr-.85)/.15);
  s+=fade(seg(p,.1,.2),dot(410,y-14,13,'#7fb3ff')+ring(410,y-14,13,{color:'#cfe0ff',w:2}));
  s+=fade(seg(p,.35,.5),label('段の 間には いられない',820,300,{size:26,color:C.a,anchor:'middle',weight:700})+cross(560,300,16,1));
  s+=card(760,80,400,150,label('とびとびの 段',960,140,{size:36,color:HC,anchor:'middle',weight:700})+label('高校編・ボーア模型',960,195,{size:26,color:C.dim,anchor:'middle'}),seg(p,.55,.7),HC);
  return s;
 },
 [K+'jump']:(p,ctx)=>{
  const t=sceneT(p,ctx),x0=180,x1=640;
  let s=levels(x0,x1,{hi:[0,1]});
  s+=fade(seg(p,.05,.2),line(680,LV[1],680,LV[0],{color:C.E,w:3})+line(668,LV[1],692,LV[1],{color:C.E,w:3})+line(668,LV[0],692,LV[0],{color:C.E,w:3})+label('段の 差',700,(LV[0]+LV[1])/2+10,{size:28,color:C.E,weight:700}));
  const fr=(t/1.6)%1,y=fr<.5?LV[1]:mix(LV[1],LV[0],Math.min(1,(fr-.5)/.12));
  s+=dot(410,y-14,13,'#7fb3ff');
  s+=fade(seg(p,.4,.55),wavy(430,300,620,230,{color:HC,amp:9,lam:26,ph:t*2,w:4,head:16})+label('電磁波',520,370,{size:26,color:HC,anchor:'middle',weight:700}));
  s+=card(830,90,340,150,label('原子の 種類 ごとに',1000,150,{size:28,color:C.ink,anchor:'middle',weight:700})+label('ぴったり 決まる',1000,205,{size:32,color:HC,anchor:'middle',weight:700}),seg(p,.1,.25),HC);
  s+=card(830,280,340,150,label('→ 振動数も',1000,340,{size:28,color:C.ink,anchor:'middle',weight:700})+label('ぴったり 決まる',1000,395,{size:32,color:HC,anchor:'middle',weight:700}),seg(p,.55,.7),HC);
  return s;
 },
 [K+'cesium']:(p,ctx)=>{
  const t=sceneT(p,ctx),u=lin(p,.1,.8);
  let pts=[];for(let x=0;x<=900;x+=3)pts.push([150+x,190+50*Math.sin(x/9-t*6)]);
  let s=draw(pts,1,{color:HC,w:3,opacity:.85})+label('セシウム原子の 電磁波',150,110,{size:28,color:HC,weight:700});
  s+=rect(150,290,900,26,{fill:C.faint,fo:.4,stroke:C.faint,rx:8})+rect(150,290,900*u,26,{fill:TC,fo:.8,stroke:TC,rx:8});
  s+=label('1 秒',1060,312,{size:28,color:TC,weight:700});
  const n=u>=1?9192631770:Math.floor(9192631770*u);
  s+=card(250,350,700,120,label(`${numFmt(n)} 回`,600,432,{size:54,color:HC,anchor:'middle',weight:700}),1,HC);
  return s;
 },
 [K+'second']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=card(150,60,900,160,label('1 秒 ＝ セシウム原子の 振動',600,120,{size:30,color:C.ink,anchor:'middle',weight:700})+label('9,192,631,770 回',600,185,{size:46,color:HC,anchor:'middle',weight:700}),seg(p,.03,.15),HC);
  s+=tag('定義',1000,250,{color:C.hi,size:26,g:seg(p,.15,.28)});
  s+=fade(seg(p,.55,.68),earth(330,380,70,{rot:t*.8})+label('地球の 自転',330,490,{size:26,color:C.ink,anchor:'middle',weight:700})+cross(420,330,26,seg(p,.62,.72)));
  const atom=fade(seg(p,.65,.78),dot(870,380,16,'#c9485a')+ring(870,380,45,{color:'#7fb3ff',w:2})+ring(870,380,70,{color:'#7fb3ff',w:2})+dot(870+70*Math.cos(t*2),380+70*Math.sin(t*2),9,'#7fb3ff')+label('原子',870,490,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=atom+okMark(960,330,seg(p,.72,.82));
  return s;
 },
 [K+'precise']:(p,ctx)=>{
  const t=sceneT(p,ctx),u=seg(p,.05,.75);
  let s=clock(300,240,140,{sec:t*6,name:'原子時計',col:HC});
  const yrs=Math.round(u*30000);
  s+=card(560,80,580,140,label('経過',650,165,{size:28,color:C.dim,anchor:'middle'})+label(`${yrs.toLocaleString('en-US')} 年`,880,170,{size:46,color:TC,anchor:'middle',weight:700}),1,TC);
  s+=card(560,260,580,140,label('ずれ',650,345,{size:28,color:C.dim,anchor:'middle'})+label('1 秒 未満',880,350,{size:46,color:HC,anchor:'middle',weight:700}),seg(p,.3,.45),HC);
  return s;
 },
 [K+'several']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=sat(600,200,4.6,{a:0});
  const names=[['セシウム',C.ink],['セシウム',C.ink],['ルビジウム',C.x],['ルビジウム',C.x]];
  names.forEach(([n,col],i)=>{const x=210+i*260,g=seg(p,.15+i*.12,.27+i*.12);s+=fade(g,line(600,200,x,380,{color:C.faint,w:2,dash:'5 6'}))+card(x-115,330,230,150,clock(x,385,38,{sec:t*3+i*7})+label(n,x,462,{size:24,color:col,anchor:'middle',weight:700}),g,col);});
  return s;
 },
 // ================= S3 予想してください =================
 [K+'drift']:(p,ctx)=>{
  const t=sceneT(p,ctx),fan=PI/2.4*seg(p,.15,.85);
  let s=clock(330,230,140,{sec:t*6,name:'地上',col:C.ink});
  s+=clock(870,230,140,{sec:t*6,name:'衛星',col:GOLD,fan});
  s+=sat(1080,80,.8);
  s+=fade(seg(p,.02,.12),label('同時に スタート',600,60,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),label('ずれ ？',600,250,{size:44,color:HC,anchor:'middle',weight:700})+arrow(530,240,480,240,{color:HC,w:3,head:12})+arrow(670,240,720,240,{color:HC,w:3,head:12}));
  s+=fade(seg(p,.7,.85),label('合わなくなる',600,470,{size:32,color:HC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'guess']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=label('衛星の 時計は？',600,60,{size:34,color:C.ink,anchor:'middle',weight:700});
  s+=card(110,100,430,330,fastArrow(250,265,150)+label('速く',410,245,{size:44,color:FAST,anchor:'middle',weight:700})+label('進む？',410,305,{size:44,color:FAST,anchor:'middle',weight:700}),seg(p,.1,.25),FAST);
  s+=card(660,100,430,330,slowArrow(800,265,150)+label('遅れる？',960,280,{size:44,color:SLOW,anchor:'middle',weight:700}),seg(p,.35,.5),SLOW);
  // 考える時間：輪が満ちる
  const u=lin(p,.5,.97),r=26,a=-PI/2+2*PI*u*.999;
  s+=fade(seg(p,.5,.56),ring(600,470,r,{color:C.faint,w:6})+(u>0?`<path d="M600 ${470-r} A${r} ${r} 0 ${u>.5?1:0} 1 ${(600+r*Math.cos(a)).toFixed(1)} ${(470+r*Math.sin(a)).toFixed(1)}" fill="none" stroke="${HC}" stroke-width="6"/>`:'')+label('考えて みて',560,480,{size:24,color:C.dim,anchor:'end'}));
  return s;
 },
 [K+'hint']:(p,ctx)=>twoCards(p,sceneT(p,ctx),{g:seg(p,.03,.15)})+tag('ヒント',600,60,{color:HC,size:26,g:seg(p,.03,.15)}),
 [K+'opposite']:(p,ctx)=>twoCards(p,sceneT(p,ctx),{arrows:seg(p,.3,.9)})+fade(seg(p,.1,.25),label('正反対',600,480,{size:32,color:HC,anchor:'middle',weight:700})),
 [K+'tug']:(p,ctx)=>{
  const t=sceneT(p,ctx),k=24*Math.sin(t*1.7)*seg(p,.15,.3)+8*Math.sin(t*4.3)*seg(p,.15,.3);
  let s=line(600,140,600,400,{color:C.dim,w:2,dash:'8 8'});
  s+=line(150+k,300,1050+k,300,{color:'#c8a46a',w:8});
  s+=dot(600+k,300,16,HC)+label('？',600+k,250,{size:44,color:HC,anchor:'middle',weight:700});
  const fig=(x,dir,col)=>{const hx=x-dir*14,hy=232;return dot(hx,hy,15,col)+line(hx,hy+15,x+dir*10,330,{color:col,w:7})+line(x+dir*10,330,x+dir*34,385,{color:col,w:7})+line(x+dir*10,330,x-dir*8,390,{color:col,w:7})+line(hx+dir*2,hy+40,x+dir*40,300,{color:col,w:6});};
  for(const x of [220,300,380])s+=fig(x+k,-1,SLOW);
  for(const x of [820,900,980])s+=fig(x+k,1,FAST);
  s+=card(120,40,340,120,label('速さ',290,95,{size:34,color:SLOW,anchor:'middle',weight:700})+label('遅らせる −',290,140,{size:26,color:SLOW,anchor:'middle',weight:700}),seg(p,.03,.15),SLOW);
  s+=card(740,40,340,120,label('高さ',910,95,{size:34,color:FAST,anchor:'middle',weight:700})+label('進める ＋',910,140,{size:26,color:FAST,anchor:'middle',weight:700}),seg(p,.03,.15),FAST);
  s+=fade(seg(p,.5,.65),label('両方を 計算して 決める',600,470,{size:32,color:HC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next']:(p,ctx)=>{
  const t=sceneT(p,ctx),x=130+((t*80)%300);
  let s=line(100,330,700,330,{color:C.faint,w:2,dash:'8 8'});
  s+=clock(x,230,70,{sec:t*3,name:'',col:GOLD})+arrow(x+90,230,x+170,230,{color:VC,w:6,head:18})+slowArrow(x,370,70,{size:32});
  s+=card(720,110,440,250,label('速く 動く 時計は',940,180,{size:32,color:C.ink,anchor:'middle',weight:700})+label('なぜ 遅れる？',940,260,{size:44,color:SLOW,anchor:'middle',weight:700})+label('次：動く時計は、遅れる',940,330,{size:24,color:C.dim,anchor:'middle'}),seg(p,.15,.3),SLOW);
  return s;
 },
};

// 特別編「1分の疑問」13 声はなぜ壁の向こうに届く (ys-sp-1min-sound) — 図。Stage 1200×515。
// 音の波面は白、光の線は淡い黄、低い音は橙、高い音は水色、強調 黄。
// 形の部品（疑問カウンター・Q カード・疑問カード・橋・黄色の枠）は 01 の yt1-sp-1min-common.mjs、クイズ・小物は yt1-sp-1min-sdp-common.mjs。
import {C,seg,fade,label,line,rect,dot,ring,arrow,clamp,brace,draw} from './anim.mjs';
import {wrap,qcard,finalQ,vseg} from './yt1-sp-1min-common.mjs';
import {cueT,card,cross,okMark,tag,clip,person,poly,HC,PI} from './yt1-sp-1min-sdp-common.mjs';

const K='sp-1min-sound:';
const SND=C.ink, LIGHT='#fff3a8', LOW=C.E, HIGH=C.x, WALL='#7c8aa6';

// ---- corner (top view): wall from (WX,WY) to the right edge; source S above, listener L below (in the shadow) ----
function cornerScene(t,{box,WX,WY,S,L,id,sound=1,light=0,shadow=0,lam=44,speed=70,listenerLabel='',srcLabel='',lightBlock=1}){
 const [bx0,by0,bx1,by1]=box;
 // edge of the geometric shadow: ray S→corner extended to the box
 const dx=WX-S[0],dy=WY-S[1];
 let P=[WX+dx*(by1-WY)/dy,by1];
 if(P[0]<bx0)P=[bx0,WY+dy*(bx0-WX)/dx];
 const lit=P[1]===by1?[[bx0,WY],[WX,WY],P,[bx0,by1]]:[[bx0,WY],[WX,WY],P];
 const sh=P[1]===by1?[[WX,WY],[bx1,WY],[bx1,by1],P]:[[WX,WY],[bx1,WY],[bx1,by1],[bx0,by1],P];
 const pts=a=>a.map(q=>q.join(',')).join(' ');
 let s=rect(bx0,by0,bx1-bx0,by1-by0,{fill:'#0d1a2b',fo:1,stroke:C.faint,sw:2,rx:12});
 if(shadow>0)s+=fade(shadow,poly(sh,{fill:'#000',fo:.45}));
 const d0=Math.hypot(dx,dy),Rmax=Math.hypot(bx1-bx0,by1-by0);
 if(sound>0){
  let up='',dn='',df='';const ph=(t*speed)%lam;
  for(let r=ph;r<Rmax;r+=lam){if(r<8)continue;const op=clamp(1.15-r/700);
   const c=`<circle cx="${S[0]}" cy="${S[1]}" r="${r.toFixed(1)}" fill="none" stroke="${SND}" stroke-width="3" opacity="${op.toFixed(2)}"/>`;
   up+=c;dn+=c;
   if(r>d0){const rr=r-d0;df+=`<circle cx="${WX}" cy="${WY}" r="${rr.toFixed(1)}" fill="none" stroke="${SND}" stroke-width="3" opacity="${(op*clamp(1-rr/520)*.85).toFixed(2)}"/>`;}}
  s+=fade(sound,clip(id+'u',bx0,by0,bx1-bx0,WY-by0,up)+`<clipPath id="${id}l"><polygon points="${pts(lit)}"/></clipPath><g clip-path="url(#${id}l)">${dn}</g>`+`<clipPath id="${id}s"><polygon points="${pts(sh)}"/></clipPath><g clip-path="url(#${id}s)">${df}</g>`);
 }
 if(light>0){
  // fan of rays from S; rays aimed below the wall stop at the wall, rays left of the corner go straight on
  let r='';
  for(let k=-5;k<=5;k++){const a=Math.atan2(dy,dx)+k*.16,ux=Math.cos(a),uy=Math.sin(a);if(uy<=.05)continue;
   const tw=(WY-S[1])/uy,xw=S[0]+ux*tw;
   if(xw>WX){r+=line(S[0],S[1],xw,WY-9,{color:LIGHT,w:3,opacity:.85});}
   else{let tt=Math.min((by1-S[1])/uy,ux<0?(bx0-S[0])/ux:1e9);r+=line(S[0],S[1],S[0]+ux*tt,S[1]+uy*tt,{color:LIGHT,w:3,opacity:.85});}}
  s+=fade(light,clip(id+'r',bx0,by0,bx1-bx0,by1-by0,r));
  // the ray straight to the listener is blocked
  if(lightBlock&&L){const tw=(WY-S[1])/(L[1]-S[1]),xw=S[0]+(L[0]-S[0])*tw;
   s+=fade(light,line(S[0],S[1],xw,WY-9,{color:LIGHT,w:4})+line(xw,WY+9,L[0],L[1],{color:LIGHT,w:3,dash:'8 9',opacity:.5})+cross(xw,WY-30,16,1));}
 }
 s+=rect(WX,WY-9,bx1-WX,18,{fill:WALL,fo:1,stroke:'#b8c3d8',sw:2,rx:3});
 s+=dot(S[0],S[1],20,'#e9a6c8')+ring(S[0],S[1],20,{color:'#fff',w:2});
 if(srcLabel)s+=label(srcLabel,S[0]+34,S[1]-14,{size:26,color:C.ink,weight:700});
 if(L){s+=dot(L[0],L[1],20,'#8fb6ff')+ring(L[0],L[1],20,{color:'#fff',w:2});if(listenerLabel)s+=label(listenerLabel,L[0]+32,L[1]+10,{size:26,color:C.ink,weight:700});}
 return s;
}

// ---- slit: plane waves from the left, barrier at BX with a gap; behind it circular (or straight) waves ----
function slit(t,{box,BX,GY,gap,lam,id,speed=60,beam=false,col=SND}){
 const [bx0,by0,bx1,by1]=box;
 let s=rect(bx0,by0,bx1-bx0,by1-by0,{fill:'#0d1a2b',fo:1,stroke:C.faint,sw:2,rx:12});
 const ph=(t*speed)%lam;let inc='',out='';
 for(let x=BX-ph;x>bx0;x-=lam)inc+=line(x,by0+4,x,by1-4,{color:col,w:3,opacity:.8});
 for(let r=lam-ph;r<1400;r+=lam){
  if(beam){const x=BX+r;if(x<bx1)out+=line(x,GY-gap/2,x,GY+gap/2,{color:col,w:3,opacity:.8});}
  else{const op=clamp(1.1-r/600);out+=`<path d="M${BX} ${GY-r} A${r} ${r} 0 0 1 ${BX} ${GY+r}" fill="none" stroke="${col}" stroke-width="3" opacity="${op.toFixed(2)}"/>`;}}
 s+=clip(id+'i',bx0,by0,BX-bx0,by1-by0,inc)+clip(id+'o',BX,by0,bx1-BX,by1-by0,out);
 s+=rect(BX-9,by0,18,GY-gap/2-by0,{fill:WALL,fo:1,stroke:'#b8c3d8',sw:2,rx:3})+rect(BX-9,GY+gap/2,18,by1-GY-gap/2,{fill:WALL,fo:1,stroke:'#b8c3d8',sw:2,rx:3});
 return s;
}
const wavy=(x,y,w,lam,amp,col,{w2=4,g=1}={})=>fade(g,draw(Array.from({length:121},(_,i)=>[x+w*i/120,y-amp*Math.sin(2*PI*(w*i/120)/lam)]),1,{color:col,w:w2}));

export const spOneMinSoundDiagrams={
 // 1. Q：壁の角。声（波）は回り込み、光（線）はさえぎられる
 [K+'q']:wrap(1,(p,ctx)=>{const t=cueT(p,ctx);
  const sc=cornerScene(t,{box:[40,70,1160,505],WX:640,WY:300,S:[930,165],L:[980,440],id:'sq',sound:1,light:vseg(ctx,p,.2,.4),srcLabel:'声',listenerLabel:'あなた'});
  return qcard(['声は 聞こえるのに、姿は 見えない。','なぜ 音だけ 回り込める？'],p,t,{bg:fade(.42,sc)+rect(0,0,1200,515,{fill:C.bg,fo:.25,stroke:'none',rx:0}),y0:190});
 },{fadeIn:false,roll:0}),
 // 2. 回折：すき間を通った波が扇形に広がる
 [K+'slit']:wrap(1,(p,ctx)=>{const t=cueT(p,ctx);
  let s=slit(t,{box:[40,70,1120,435],BX:520,GY:252,gap:66,lam:56,id:'s2'});
  s+=fade(seg(p,0,.12),label('音も 光も 波',60,476,{size:30,color:C.ink,weight:700})+wavy(250,466,110,36,9,SND,{w2:3})+label('音',380,476,{size:26,color:SND})+wavy(420,466,110,14,6,LIGHT,{w2:3})+label('光',550,476,{size:26,color:LIGHT}));
  s+=fade(seg(p,.3,.45),arrow(560,252,760,130,{color:HC,w:5,head:18})+arrow(560,252,760,374,{color:HC,w:5,head:18})+label('すき間の 後ろへ 回り込む',700,476,{size:28,color:HC,weight:700}));
  s+=tag('回折',980,122,{g:seg(p,.68,.8),size:40});
  return s;
 },{pill:'声は、なぜ壁の向こうに届く？',bridge:.95}),
 // 3. 回り込みやすさは波長で決まる：長い波（すき間と同じくらい）／短い波
 [K+'compare']:wrap(2,(p,ctx)=>{const t=cueT(p,ctx),gL=seg(p,.05,.2),gR=seg(p,.3,.45);
  let s=fade(gL,slit(t,{box:[40,70,575,380],BX:240,GY:225,gap:64,lam:64,id:'s3a'})+brace(104,168,388,{dir:1,color:HC,text:'波長',size:22}));
  s+=fade(gR,slit(t,{box:[625,70,1160,380],BX:825,GY:225,gap:150,lam:16,id:'s3b',beam:true,speed:40})
   +fade(.5,poly([[834,70],[1159,70],[1159,150],[834,150]],{fill:'#000',fo:.35})+poly([[834,300],[1159,300],[1159,379],[834,379]],{fill:'#000',fo:.35})));
  s+=fade(gL,label('波長が 長い',307,436,{size:30,color:C.ink,anchor:'middle',weight:700}))+fade(seg(p,.2,.3),label('→ 大きく 回り込む',307,480,{size:28,color:HC,anchor:'middle',weight:700}));
  s+=fade(gR,label('波長が 短い',892,436,{size:30,color:C.ink,anchor:'middle',weight:700}))+fade(seg(p,.45,.55),label('→ まっすぐ 進む',892,480,{size:28,color:HC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.72),tag('すき間と 同じくらい',410,118,{size:24})+tag('すき間より ずっと 短い',992,118,{size:24}));
  return s;
 },{roll:0,q:{end:.3,lines:['回り込みやすさは、','何で 決まる？'],text:'回り込みやすさは、何で決まる？'}}),
 // 4. 声の波長とドアを同じ縮尺で（1 m ＝ 180 px）
 [K+'voice']:wrap(2,(p,ctx)=>{const t=cueT(p,ctx),M=180,FL=440;
  let s=line(60,FL,1150,FL,{color:C.dim,w:3});
  // door 0.9 m × 2.0 m
  const dx=130,dw=.9*M,dh=2*M;
  s+=fade(seg(p,0,.12),rect(dx,FL-dh,dw,dh,{fill:'#5b3d2a',fo:.9,stroke:'#c9a27e',sw:4,rx:4})+dot(dx+dw-22,FL-dh/2,7,'#e8d2a0')+label('ドア',dx+dw/2,FL-dh+44,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.65),brace(dx,dx+dw,FL+8,{dir:1,color:HC,text:'約 90 cm',size:24}));
  s+=fade(seg(p,0,.12),person(380,FL,1.7*M,{col:'#6f7f9e'}));
  // voice waves (moving)
  const sh=t*50;
  const wave=(y,lam,amp,col,g)=>fade(g,clip('v'+lam,560,y-60,580,120,draw(Array.from({length:241},(_,i)=>{const x=560+580*i/240;return [x,y-amp*Math.sin(2*PI*(x-560-sh)/lam)];}),1,{color:col,w:4})));
  s+=label('声の 波長',1000,110,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=wave(200,M,40,LOW,seg(p,.1,.25))+fade(seg(p,.2,.32),brace(600,600+M,140,{dir:-1,color:LOW,text:''})+label('約 1 m',600+M/2,98,{size:24,color:LOW,anchor:'middle',weight:700}));
  s+=wave(370,.34*M,28,HIGH,seg(p,.28,.4))+fade(seg(p,.36,.46),brace(600,600+.34*M,322,{dir:-1,color:HIGH,text:''})+label('約 34 cm',632,280,{size:24,color:HIGH,anchor:'middle',weight:700}));
  s+=tag('ドアや 壁の角と 同じくらい',850,500,{g:seg(p,.68,.8),size:26});
  return s;
 },{pill:'回り込みやすさは、何で決まる？',bridge:.95}),
 // 5. 光の波長はとても短い → まっすぐ進んで影
 [K+'light']:wrap(3,(p,ctx)=>{const t=cueT(p,ctx);
  let s=cornerScene(t,{box:[40,70,820,505],WX:330,WY:280,S:[560,160],L:[640,420],id:'s5',sound:0,light:seg(p,.3,.45),shadow:seg(p,.45,.6),srcLabel:'',listenerLabel:''});
  s+=fade(seg(p,.55,.68),label('影',740,470,{size:30,color:C.dim,anchor:'middle',weight:700}));
  const g=seg(p,0,.15);
  let c=label('光の 波長',990,140,{size:30,color:LIGHT,anchor:'middle',weight:700});
  c+=label('1 mm の',990,210,{size:34,color:C.ink,anchor:'middle',weight:700})+label('2000分の1',990,262,{size:40,color:HC,anchor:'middle',weight:700});
  c+=fade(seg(p,.15,.25),label('＝ 0.0005 mm',990,320,{size:28,color:C.dim,anchor:'middle'}));
  // 1 mm bar and the tiny wavelength
  c+=fade(seg(p,.18,.28),line(890,400,1090,400,{color:C.ink,w:4})+line(890,388,890,412,{color:C.ink,w:3})+line(1090,388,1090,412,{color:C.ink,w:3})+label('1 mm',990,440,{size:22,color:C.dim,anchor:'middle'})+line(890,384,890.1,384,{color:LIGHT,w:3}));
  s+=card(850,90,280,380,c,g,LIGHT);
  return s;
 },{roll:0,q:{end:.2,lines:['では、光は なぜ','回り込まない？'],text:'光は、なぜ回り込まない？'}}),
 // 6. 隣の部屋の音楽：低い音（長い波）は回り込み、高い音（短い波）はまっすぐ
 [K+'music']:wrap(3,(p,ctx)=>{const t=cueT(p,ctx);
  const box=[40,70,1160,505],BX=560,GY=200,gap=90;
  let s=rect(40,70,1120,435,{fill:'#0d1a2b',fo:1,stroke:C.faint,sw:2,rx:12});
  // left room: speaker
  const SX=230,SY=200;
  const ph=(t*55)%90;let L='';for(let r=ph;r<500;r+=90)if(r>30)L+=`<circle cx="${SX}" cy="${SY}" r="${r}" fill="none" stroke="${LOW}" stroke-width="4" opacity="${clamp(1.1-r/420).toFixed(2)}"/>`;
  s+=clip('m6a',40,70,BX-40,435,L);
  // through the doorway: low = spreading arcs, high = straight beam
  let O='';const ph2=(t*55)%90;for(let r=ph2;r<700;r+=90)if(r>4)O+=`<path d="M${BX} ${GY-r} A${r} ${r} 0 0 1 ${BX} ${GY+r}" fill="none" stroke="${LOW}" stroke-width="4" opacity="${clamp(1-r/700).toFixed(2)}"/>`;
  s+=fade(seg(p,.05,.2),clip('m6b',BX,70,600,435,O));
  let H='';const ph3=(t*45)%18;for(let x=BX+ph3;x<1160;x+=18)H+=line(x,GY-gap/2+6,x,GY+gap/2-6,{color:HIGH,w:2.5,opacity:.85});
  s+=fade(seg(p,.2,.35),clip('m6c',BX,70,600,435,H));
  s+=rect(BX-10,70,20,GY-gap/2-70,{fill:WALL,fo:1,stroke:'#b8c3d8',sw:2,rx:3})+rect(BX-10,GY+gap/2,20,505-GY-gap/2,{fill:WALL,fo:1,stroke:'#b8c3d8',sw:2,rx:3});
  // speaker box
  s+=rect(SX-30,SY-40,60,80,{fill:'#2a2f3d',fo:1,stroke:'#c9d3e6',sw:2,rx:6})+ring(SX,SY-12,12,{color:'#c9d3e6',w:2})+ring(SX,SY+18,16,{color:'#c9d3e6',w:2});
  s+=label('隣の 部屋',150,470,{size:26,color:C.dim,weight:700});
  // listener (out of the line through the doorway)
  const LX=900,LY=420;s+=dot(LX,LY,22,'#8fb6ff')+ring(LX,LY,22,{color:'#fff',w:2})+label('あなた',LX+34,LY+10,{size:26,color:C.ink,weight:700});
  const pulse=Math.abs(Math.sin(t*PI*1.6));
  s+=fade(seg(p,.35,.45),label('ドン、ドン',LX-20,LY-58,{size:36+4*pulse,color:LOW,anchor:'middle',weight:700}));
  s+=fade(seg(p,.25,.4),label('高い音',1060,GY-gap/2-14,{size:26,color:HIGH,anchor:'middle',weight:700}))+fade(seg(p,.1,.25),label('低い音',720,140,{size:26,color:LOW,anchor:'middle',weight:700}));
  return s;
 },{pill:'光は、なぜ回り込まない？',bridge:.95}),
 // 7. 次の疑問：光が回り込む証拠は？
 [K+'bridge']:wrap(4,(p,ctx)=>{const t=cueT(p,ctx),g=vseg(ctx,p,0,.15);
  let s=fade(vseg(ctx,p,.3,.6),wavy(330,420,540,22,8,LIGHT,{w2:3})+label('光も 波',600,480,{size:28,color:LIGHT,anchor:'middle',weight:700}));
  return s+finalQ(['光が 回り込む 証拠は、','どこで 見られる？'],g,{y:120,sc:.9+.1*g});
 },{roll:0}),
};

// 特別編「1分の疑問」01（ys-sp-1min-sky）「空は、なぜ青い？」— 図。Stage 1200×515。
// 形（Q カード・「疑問 n」カウンター・疑問の札・「次の疑問 →」・最後の黄色の枠の問い）は yt1-sp-1min-common.mjs。
// 色：光はその色（青 450 nm、赤 700 nm、紫 400 nm）、波長 λ は水色（C.x）、強調 黄。
import {C,seg,clamp,mix,fade,label,line,rect,dot,ring,draw,arrow,poly,scaleAt,brace,tex} from './anim.mjs';
import {wrap,qcard,finalQ,cueT,voiceEnd,vseg,HC} from './yt1-sp-1min-common.mjs';
export * from './yt1-sp-1min-common.mjs';

const PI=Math.PI;
export const VIO='#a274ff', BLU='#3f8cff', RED='#ff4b3e', LAM=C.x;
const SPEC=['#ff4b3e','#ff9a3c','#ffe25a','#5ee07a','#3f8cff','#a274ff'];
const hash=i=>{const s=Math.sin(i*127.1+311.7)*43758.5453;return s-Math.floor(s);};
const K='sp-1min-sky:';

// ---------- parts ----------
function sun(x,y,r,{col='#fff6c8',glow=1,g=1}={}){
 return fade(g,dot(x,y,r*2.4,col,.10*glow)+dot(x,y,r*1.6,col,.18*glow)+dot(x,y,r,col));
}
function skyGrad(id,top,bot){return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient></defs>`;}
function cloud(x,y,k=1,{g=1,col='#f4f8ff'}={}){
 let s='';for(const [dx,dy,r] of [[-70,10,38],[-30,-12,50],[20,-24,58],[70,-4,46],[105,14,34],[0,18,44]])s+=dot(x+dx*k,y+dy*k,r*k,col);
 s+=rect(x-100*k,y+8*k,215*k,40*k,{fill:col,fo:1,stroke:col,rx:20*k});
 return fade(g,s);
}
// sine wave of wavelength L px, from x0 to x1 around yc; phase moves with t
function wave(x0,x1,yc,L,amp,t,{color,u=1,w=4}={}){
 const pts=[];for(let x=x0;x<=x1;x+=3)pts.push([x,yc-amp*Math.sin(2*PI*(x-x0)/L-t*3)]);
 return draw(pts,u,{color,w});
}

// ---------- cue 1: Q card on a blue sky ----------
function blueSky(t){
 let s=skyGrad('skyQ','#123a8c','#4c8fe6')+rect(0,0,1200,515,{fill:'url(#skyQ)',fo:1,stroke:'none',rx:0});
 s+=sun(150,120,34,{glow:1+.1*Math.sin(t*2)});
 s+=rect(250,150,700,270,{fill:'#0b1122',fo:.35,stroke:'none',rx:24});
 return s;
}

// ---------- cue 2: white light = all colours (prism) → hits air molecules, scattered everywhere ----------
function prismPart(u1,u2,u3){
 let s='';
 s+=fade(u1,line(40,250,282,226,{color:'#ffffff',w:7})+label('太陽の 白い光',60,206,{size:28,color:C.ink,weight:700}));
 s+=fade(u1,poly([[330,120],[248,300],[412,300]],{fill:'#cfe2ff',fo:.16,stroke:'#cfe2ff',sw:3}));
 SPEC.forEach((c,i)=>{const y=150+i*36;s+=draw([[372,236],[600,y]],u2,{color:c,w:6});});
 s+=fade(u2,label('赤',622,160,{size:28,color:RED,weight:700})+label('紫',622,340,{size:28,color:VIO,weight:700}));
 s+=fade(u3,label('全部の色が 混ざっている',330,400,{size:30,color:HC,anchor:'middle',weight:700}));
 return s;
}
const MOL=[[880,250],[1010,330],[1080,170],[800,380],[960,120]];
function scatterPart(t,g,tStart){
 if(g<=.001)return '';
 let s='';
 // air molecules
 MOL.forEach(([x,y],i)=>{s+=dot(x,y,11,'#9fb3d6')+dot(x-3,y-3,4,'#dfe8f7');});
 s+=label('空気の 分子',880,470,{size:28,color:'#9fb3d6',anchor:'middle',weight:700})+arrow(880,440,880,280,{color:'#9fb3d6',w:3,head:12,opacity:.8});
 // light grains travel from the left; each hits a molecule and leaves in all directions
 const tt=t-tStart;
 for(let i=0;i<40;i++){
  const t0=i*.26;if(tt<t0)break;
  const m=MOL[i%MOL.length],col=SPEC[i%SPEC.length],y0=200+((i*53)%160),travel=.9,dt=tt-t0;
  if(dt<travel){const u=dt/travel;s+=dot(mix(660,m[0],u),mix(y0,m[1],u),7,col);}
  else{const d=dt-travel;if(d<1.4){const r=40+170*d,o=1-d/1.4;
   s+=fade(o*.7,ring(m[0],m[1],r*.55,{color:col,w:2}));
   for(let k=0;k<8;k++){const a=k*PI/4+i;s+=dot(m[0]+r*Math.cos(a),m[1]+r*Math.sin(a),6,col,o);}}}
 }
 s+=label('四方八方に 散らばる',1180,505,{size:30,color:HC,anchor:'end',weight:700});
 return fade(g,s);
}
const clipStage=(id,x,y,w,h,inner)=>`<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`;

// ---------- cues 3–4: wavelength, 1/λ⁴, bars ----------
const NM=.2;            // px per nm for the drawn waves
const BU=32,BY=470;     // bar unit (px per "×1") and baseline
const r4=nm=>(700/nm)**4; // scattering relative to red 700 nm: 450 → 5.86, 400 → 9.38
function waveRow(name,nm,col,y,t,u,{brace:br=0}={}){
 const x0=230,x1=620,L=nm*NM;
 let s=fade(u,label(name,40,y+10,{size:28,color:col,weight:700}));
 s+=wave(x0,x1,y,L,26,t,{color:col,u});
 if(br>0){const xs=x0+L*.5,yb=y-40;s+=fade(br,line(xs,yb,xs+L,yb,{color:LAM,w:3})+line(xs,yb-9,xs,yb+9,{color:LAM,w:3})+line(xs+L,yb-9,xs+L,yb+9,{color:LAM,w:3})+label('λ',xs+L+12,yb+10,{size:30,color:LAM,weight:700}));}
 return s;
}
function bar(x,val,col,name,u,{tagText='',tagCol=HC,g=1}={}){
 const h=BU*val*u;
 let s=rect(x-36,BY-h,72,h,{fill:col,fo:.85,stroke:col,rx:4});
 s+=label(name,x,BY+30,{size:26,color:col,anchor:'middle',weight:700});
 if(tagText)s+=fade(seg(u,.8,1),label(tagText,x,BY-h-14,{size:28,color:tagCol,anchor:'middle',weight:700}));
 return fade(g,s);
}
function lamScene(t,{w=1,f=1,r=1,b=1,v=0,vb=0,vq=0}={}){
 let s=waveRow('青 450 nm',450,BLU,118,t,w,{brace:seg(w,.6,1)});
 s+=waveRow('赤 700 nm',700,RED,210,t,w,{brace:seg(w,.6,1)});
 if(v>0)s+=waveRow('紫 400 nm',400,VIO,302,t,v,{brace:seg(v,.6,1)});
 // formula: scattering strength ∝ 1/λ⁴ (λ in cyan)
 s+=fade(f,label('散らばる強さ',40,398,{size:32,color:C.ink,weight:700})+tex(`\\propto\\frac{1}{{\\color{${LAM}}\\lambda}^{4}}`,250,391,{size:40,anchor:'start'}));
 s+=fade(r,tex(`\\left(\\frac{700}{450}\\right)^{4}\\approx 6`,40,470,{size:36,anchor:'start'}));
 // bars (relative to red = 1)
 s+=line(700,BY,1160,BY,{color:C.dim,w:2});
 s+=bar(760,1,RED,'赤',b,{tagText:'1'});
 s+=bar(900,r4(450),BLU,'青',seg(b,.15,1),{tagText:'約 6 倍'});
 if(vb>0)s+=bar(1050,r4(400),VIO,'紫',vb,{tagText:'もっと',tagCol:VIO});
 if(vq>0)s+=fade(vq,label('？',1135,330,{size:90,color:HC,anchor:'middle',weight:700}));
 return s;
}

// ---------- cue 5: why not violet — four factors (bar heights are rough comparisons) ----------
// scattering: violet 9.4 / blue 5.9 (ratio of (700/λ)^4). Sunlight per nm near 400 nm is lower than near 450 nm.
// eye sensitivity (photopic) at 400 nm is about 1/100 of that at 450 nm (0.0004 vs 0.038) — drawn at a visible minimum.
const PAN=[
 {title:'散らばりやすさ',v:1,b:r4(450)/r4(400)},
 {title:'太陽の光の量',v:.7,b:1},
 {title:'目の感じやすさ',v:.07,b:1},
 {title:'空の明るさ',v:.08,b:1},
];
function factorPanel(i,g,{win=0,t=0}={}){
 const P=PAN[i],x=30+i*292,w=250,y=70,h=400,base=410,H=250;
 let s=rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke:i===3?HC:C.faint,sw:i===3?3:2,rx:14});
 s+=label(P.title,x+w/2,y+44,{size:26,color:i===3?HC:C.ink,anchor:'middle',weight:700});
 const bx=[x+w*.32,x+w*.68],vals=[P.v,P.b],cols=[VIO,BLU],names=['紫','青'];
 vals.forEach((v,k)=>{const hh=H*v*seg(g,.2+.15*k,.7+.15*k);
  s+=rect(bx[k]-30,base-hh,60,hh,{fill:cols[k],fo:.85,stroke:cols[k],rx:4});
  s+=label(names[k],bx[k],base+40,{size:28,color:cols[k],anchor:'middle',weight:700});});
 s+=line(x+20,base,x+w-20,base,{color:C.dim,w:2});
 if(i===2)s+=fade(seg(g,.6,1),label('ほぼ 感じない',bx[0],base-40,{size:22,color:VIO,anchor:'middle',weight:700}));
 if(i===1)s+=fade(seg(g,.6,1),label('少ない',bx[0],base-H*P.v-14,{size:24,color:VIO,anchor:'middle',weight:700}));
 if(win>0)s+=fade(win,rect(bx[1]-42,base-H-12,84,H+24,{fill:HC,fo:.08,stroke:HC,sw:3,rx:8})+label('青が 勝つ',x+w/2,505,{size:30,color:HC,anchor:'middle',weight:700}));
 return fade(g,s);
}
function whyScene(ctx,p,t){
 let s=factorPanel(0,1);
 const g1=vseg(ctx,p,.22,.4),g2=vseg(ctx,p,.55,.75),g3=vseg(ctx,p,.82,.95);
 s+=fade(g1,label('×',280+0*292-8,280,{size:44,color:C.ink,anchor:'middle',weight:700}))+factorPanel(1,g1);
 s+=fade(g2,label('×',280+1*292-8,280,{size:44,color:C.ink,anchor:'middle',weight:700}))+factorPanel(2,g2);
 s+=fade(g3,label('＝',280+2*292-8,280,{size:44,color:HC,anchor:'middle',weight:700}))+factorPanel(3,g3,{win:seg(g3,.6,1)});
 s+=fade(g2,label('棒の高さは だいたいの 比べ',30,508,{size:22,color:C.dim}));
 return s;
}

// ---------- cue 6: sunset — the long path through the air ----------
const EC=[600,1260],ER=900,AR=1010,PY=335;
const PX0=EC[0]-Math.sqrt(AR*AR-(EC[1]-PY)**2); // where the evening path enters the air (≈194)
const OX=600;
function earthAir(){
 let s=`<circle cx="${EC[0]}" cy="${EC[1]}" r="${AR}" fill="#4f95ff" fill-opacity=".16" stroke="#7fb2ff" stroke-opacity=".5" stroke-width="2"/>`;
 s+=`<circle cx="${EC[0]}" cy="${EC[1]}" r="${ER}" fill="#1b3a2a" stroke="#3b6b4f" stroke-width="3"/>`;
 s+=label('空気の 層',1000,268,{size:24,color:'#9cc4ff',anchor:'middle',weight:700});
 return s;
}
function viewer(x,yF){return dot(x,yF-30,8,'#d9e2f2')+line(x,yF-22,x,yF,{color:'#d9e2f2',w:5})+line(x,yF-4,x-7,yF+2,{color:'#d9e2f2',w:3});}
function sunsetScene(ctx,p,t){
 const a=vseg(ctx,p,.26,.36),b=vseg(ctx,p,.38,.48),c=vseg(ctx,p,.48,.56),ve=voiceEnd(ctx),ts=.5*ve;
 let s=earthAir()+viewer(OX,360);
 // noon: sun overhead, short path
 const sx=mix(OX,150,c),sy=mix(95,PY,c*c),scol=c<.5?'#fff6c8':'#ffb36b';
 s+=sun(sx,sy,30,{col:scol});
 s+=fade(a*(1-.75*c),arrow(OX,150,OX,318,{color:'#fff6c8',w:6,head:18})+label('昼：短い道',OX+40,215,{size:28,color:C.ink,weight:700}));
 // evening: long path along the horizon
 s+=fade(b*c,line(PX0,PY,OX-14,PY,{color:'#ffd9a8',w:3,dash:'10 8'})+label('夕方：長い道',(PX0+OX)/2,PY-48,{size:28,color:'#ffd9a8',anchor:'middle',weight:700}));
 // red glow at the viewer, grows as red light keeps arriving
 const tt=t-ts,glow=clamp(tt/2.5);
 if(tt>0){
  s+=dot(OX,PY,60*glow,RED,.18*glow);
  for(let i=0;i<60;i++){
   const t0=i*.11;if(tt<t0)break;
   const isBlue=i%2===0,dt=tt-t0,v=230,x=PX0+v*dt;
   if(isBlue){const xs=PX0+60+hash(i)*260;
    if(x<xs)s+=dot(x,PY,7,BLU);
    else{const d=(x-xs)/v,ang=(hash(i+9)>.5?-1:1)*(.5+.7*hash(i+3)),o=1-d/.9;
     if(o>0)s+=dot(xs+v*d*Math.cos(ang)*.9,PY+v*d*Math.sin(ang)*.9,7,BLU,o);}}
   else if(x<OX-10)s+=dot(x,PY,7,RED);
  }
  s+=fade(seg(tt,.8,1.4),label('青は 途中で 散る',360,440,{size:28,color:BLU,anchor:'middle',weight:700}));
  s+=fade(seg(tt,1.6,2.2),label('赤が 届く',OX+40,PY-10,{size:30,color:RED,weight:700}));
 }
 return s;
}

// ---------- cues 7–8: Mars sunset ----------
const MH=385,MS=[600,352];
function marsLand(t,{halo=0,dust=0}={}){
 let s=skyGrad('marsSky','#2a1d1a','#b9875a')+rect(0,0,1200,515,{fill:'url(#marsSky)',fo:1,stroke:'none',rx:0});
 if(halo>0)s+=`<defs><radialGradient id="marsHalo"><stop offset="0" stop-color="#e8f2ff" stop-opacity=".95"/><stop offset=".22" stop-color="#7fb0ff" stop-opacity=".85"/><stop offset=".6" stop-color="#3f6fc0" stop-opacity=".35"/><stop offset="1" stop-color="#3f6fc0" stop-opacity="0"/></radialGradient></defs><ellipse cx="${MS[0]}" cy="${MS[1]}" rx="${300*halo}" ry="${230*halo}" fill="url(#marsHalo)"/>`;
 s+=dot(MS[0],MS[1],14,'#f6f8ff');
 if(dust>0){let d='';for(let i=0;i<70;i++){const x=(hash(i)*1200+t*14*(.5+hash(i+5)))%1200,y=60+hash(i+2)*300;d+=dot(x,y,2.4,'#e8c9a0',.75);}s+=fade(dust,d);}
 s+=poly([[0,MH],[140,MH-22],[300,MH-6],[470,MH-30],[560,MH+4],[700,MH-10],[860,MH-34],[1010,MH-12],[1200,MH-26],[1200,515],[0,515]],{fill:'#5a2a18',fo:1,stroke:'#7a3d22',sw:2});
 s+=label('火星',1150,470,{size:32,color:'#ffcf9e',anchor:'end',weight:700});
 return s;
}

// ---------- cue 9: what it scatters on decides the colour → why are clouds white? ----------
function panel(x,y,w,h,kind,g,id){
 const [top,bot]=kind==='day'?['#1d4fae','#7db4f2']:kind==='eve'?['#2b2350','#ff8a4a']:['#2a1d1a','#b9875a'];
 let s=skyGrad(id,top,bot)+rect(x,y,w,h,{fill:`url(#${id})`,fo:1,stroke:C.faint,sw:2,rx:12});
 if(kind==='day')s+=sun(x+w*.75,y+60,18);
 if(kind==='eve')s+=sun(x+w*.5,y+h-26,22,{col:'#ff7a3a'});
 if(kind==='mars')s+=`<ellipse cx="${x+w*.5}" cy="${y+h-26}" rx="90" ry="70" fill="#6fa4ff" fill-opacity=".55"/>`+dot(x+w*.5,y+h-26,10,'#f6f8ff');
 if(kind!=='day')s+=rect(x,y+h-16,w,16,{fill:kind==='eve'?'#1b2a22':'#5a2a18',fo:1,stroke:'none',rx:0});
 return fade(g,clipStage('c'+id,x,y,w,h,s)+rect(x,y,w,h,{fill:'none',fo:0,stroke:C.faint,sw:2,rx:12}));
}
const PCAP=[['day','地球の 昼','分子 → 青い 空',BLU],['eve','地球の 夕方','長い道 → 赤い 夕焼け',RED],['mars','火星の 夕方','ちり → 青い 夕日',BLU]];

export const sp1minSkyDiagrams={
 // 1 — Q card on a blue sky
 [K+'q']:wrap(1,(p,ctx)=>{const t=cueT(p,ctx);return qcard(['空は、なぜ 青い？'],p,t,{bg:blueSky(t),y0:240});},{fadeIn:false,roll:0}),
 // 2 — prism, then scattering on air molecules
 [K+'light']:wrap(1,(p,ctx)=>{
  const t=cueT(p,ctx),ve=voiceEnd(ctx);
  const u1=vseg(ctx,p,0,.08),u2=vseg(ctx,p,.08,.25),u3=vseg(ctx,p,.25,.35),m=vseg(ctx,p,.45,.52);
  let s=scaleAt(40,250,1-.15*m,fade(1-.45*m,prismPart(u1,u2,u3)));
  s+=scatterPart(t,m,.47*ve);
  return s;
 },{pill:'空は、なぜ青い？',bridge:.92}),
 // 3 — why blue? 1/λ⁴, (700/450)⁴ ≈ 6
 [K+'lam']:wrap(2,(p,ctx)=>{
  const t=cueT(p,ctx);
  return lamScene(t,{w:vseg(ctx,p,.24,.42),f:vseg(ctx,p,.42,.56),r:vseg(ctx,p,.62,.74),b:vseg(ctx,p,.7,.92)});
 },{roll:0,q:{end:.22,lines:['なぜ 青が 目立つ？'],text:'なぜ青が目立つ？'},bridge:.94}),
 // 4 — but violet is even shorter
 [K+'vio']:wrap(3,(p,ctx)=>{
  const t=cueT(p,ctx);
  return lamScene(t,{v:vseg(ctx,p,.34,.6),vb:vseg(ctx,p,.6,.9),vq:vseg(ctx,p,.92,1.05)});
 },{fadeIn:false,roll:0,q:{end:.3,lines:['紫のほうが、','もっと 散らばるのでは？'],text:'紫のほうが、もっと散らばるのでは？'}}),
 // 5 — sunlight has less violet × the eye feels violet weakly = blue wins
 [K+'why']:wrap(3,(p,ctx)=>whyScene(ctx,p,cueT(p,ctx)),{pill:'紫のほうが、もっと散らばるのでは？',bridge:.95}),
 // 6 — sunset: long path, blue scattered away, red arrives
 [K+'sunset']:wrap(4,(p,ctx)=>sunsetScene(ctx,p,cueT(p,ctx)),{roll:0,q:{end:.24,lines:['夕焼けは、なぜ 赤い？'],text:'夕焼けは、なぜ赤い？'},bridge:.95}),
 // 7 — Mars sunset: what colour?
 [K+'mars']:wrap(5,(p,ctx)=>{const t=cueT(p,ctx);
  return marsLand(t)+fade(vseg(ctx,p,.75,.95),label('？',MS[0]+130,MS[1]-90,{size:120,color:HC,anchor:'middle',weight:700}));
 },{roll:0,q:{end:.7,lines:['火星の 夕焼けは、何色？'],text:'火星の夕焼けは、何色？'}}),
 // 8 — the answer: blue around the setting sun
 [K+'marsblue']:wrap(5,(p,ctx)=>{const t=cueT(p,ctx),h=vseg(ctx,p,.1,.6),dg=vseg(ctx,p,.25,.4);
  let s=marsLand(t,{halo:h,dust:dg});
  s+=fade(1-vseg(ctx,p,.05,.15),label('？',MS[0]+130,MS[1]-90,{size:120,color:HC,anchor:'middle',weight:700}));
  s+=fade(vseg(ctx,p,0,.12),rect(430,6,170,46,{fill:BLU,fo:.25,stroke:BLU,sw:2.5,rx:23})+label('答え：青',515,39,{size:28,color:'#cfe2ff',anchor:'middle',weight:700}));
  s+=fade(dg,label('細かい ちり',230,150,{size:30,color:'#ffe2bf',weight:700})+arrow(300,165,370,215,{color:'#ffe2bf',w:3,head:12}));
  s+=fade(vseg(ctx,p,.55,.7),label('夕日の まわりが 青い',MS[0],170,{size:34,color:'#cfe2ff',anchor:'middle',weight:700}));
  s+=fade(vseg(ctx,p,.6,.75),label('探査車が 撮影した 火星の夕日（2005年・2015年）をもとにした 絵',20,505,{size:22,color:'#ffe2bf'}));
  return s;
 },{fadeIn:false,pill:'火星の夕焼けは、何色？',bridge:.95}),
 // 9 — summary panels → why are clouds white? (stops on the question)
 [K+'end']:wrap(6,(p,ctx)=>{const t=cueT(p,ctx),k=vseg(ctx,p,.5,.62);
  let s='';
  PCAP.forEach(([kind,name,cap,col],i)=>{const x=40+i*380,g=vseg(ctx,p,.02+i*.1,.14+i*.1);
   let q=panel(x,60,360,270,kind,1,'pn'+i)+label(name,x+180,100,{size:28,color:C.ink,anchor:'middle',weight:700});
   q+=label(cap,x+180,380,{size:28,color:col==='#ff4b3e'?'#ff8a7e':'#8ec0ff',anchor:'middle',weight:700});
   s+=fade(g*(1-.85*k),q);});
  s+=fade(k,skyGrad('cloudSky','#173f94','#5a9be8')+rect(0,0,1200,515,{fill:'url(#cloudSky)',fo:1,stroke:'none',rx:0})+cloud(600,380,1.3,{g:k}));
  s+=finalQ(['雲は、なぜ 白い？'],vseg(ctx,p,.58,.72),{y:120,sc:.9+.1*vseg(ctx,p,.58,.72)});
  return s;
 },{roll:.5}),
};

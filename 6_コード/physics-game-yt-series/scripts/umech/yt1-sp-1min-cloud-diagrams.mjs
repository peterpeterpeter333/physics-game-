// 特別編「1分の疑問」02（ys-sp-1min-cloud）「雲はなぜ白い？」— 図。Stage 1200×515。
// 形（Q カード・「疑問 n」カウンター・疑問の札・「次の疑問 →」・最後の黄色の枠の問い）は 01 の yt1-sp-1min-common.mjs を import（編集しない）。
// 空・雲・太陽の描き方は 01（yt1-sp-1min-sky-diagrams.mjs）を写した。光はその色（赤・緑・青）、強調 黄。
import {C,seg,clamp,mix,fade,label,line,rect,dot,ring,draw,arrow,poly,scaleAt} from './anim.mjs';
import {wrap,qcard,finalQ,cueT,voiceEnd,vseg,HC} from './yt1-sp-1min-common.mjs';

const PI=Math.PI;
const BLU='#3f8cff', RED='#ff4b3e', GRN='#5ee07a';
const hash=i=>{const s=Math.sin(i*127.1+311.7)*43758.5453;return s-Math.floor(s);};
const K='sp-1min-cloud:';

// ---------- parts (01 と同じ見た目) ----------
function sun(x,y,r,{col='#fff6c8',glow=1,g=1}={}){
 return fade(g,dot(x,y,r*2.4,col,.10*glow)+dot(x,y,r*1.6,col,.18*glow)+dot(x,y,r,col));
}
function skyGrad(id,top,bot){return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient></defs>`;}
const skyRect=(id,top,bot,x=0,y=0,w=1200,h=515,rx=0)=>skyGrad(id,top,bot)+rect(x,y,w,h,{fill:`url(#${id})`,fo:1,stroke:'none',rx});
function cloud(x,y,k=1,{g=1,col='#f4f8ff'}={}){
 let s='';for(const [dx,dy,r] of [[-70,10,38],[-30,-12,50],[20,-24,58],[70,-4,46],[105,14,34],[0,18,44]])s+=dot(x+dx*k,y+dy*k,r*k,col);
 s+=rect(x-100*k,y+8*k,215*k,40*k,{fill:col,fo:1,stroke:col,rx:20*k});
 return fade(g,s);
}
const clipR=(id,x,y,w,h,inner)=>`<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`;

// ---------- 1: Q card on a blue sky with clouds ----------
function blueSky(t){
 let s=skyRect('cldQ','#123a8c','#4c8fe6');
 s+=sun(1090,120,30,{glow:1+.1*Math.sin(t*2)});
 const dx=t*6;
 s+=cloud(95+dx,200,.7)+cloud(1080-dx*.6,340,.8)+cloud(110+dx*.5,430,.6)+cloud(1050-dx,230,.5);
 s+=rect(230,120,740,330,{fill:'#0b1122',fo:.42,stroke:'none',rx:24});
 return s;
}

// ---------- 2: recap of 01 — tiny molecules scatter blue strongly ----------
const MC=[520,270];
function recap(ctx,p,t){
 const a=vseg(ctx,p,0,.18),m=vseg(ctx,p,.18,.36),b=vseg(ctx,p,.45,.7),k=vseg(ctx,p,.8,.95);
 let s=sun(70,270,26,{g:a});
 s+=fade(a,label('太陽の 白い光',60,222,{size:28,color:C.ink,weight:700}));
 s+=draw([[100,270],[MC[0]-30,MC[1]]],a,{color:'#ffffff',w:7});
 // molecules (tiny)
 const MS=[[0,0],[22,-16],[-18,14],[14,20],[-14,-20]];
 s+=fade(m,MS.map(([dx,dy])=>dot(MC[0]+dx,MC[1]+dy,5,'#9fb3d6')).join('')+label('空気の 分子（とても 小さい）',MC[0],490,{size:28,color:'#9fb3d6',anchor:'middle',weight:700}));
 // scattering: blue long and strong, red short and weak (repeating pulses)
 if(b>0){
  let r='';
  for(let i=0;i<12;i++){const ang=i*PI/6+.26;
   r+=line(MC[0],MC[1],MC[0]+150*b*Math.cos(ang),MC[1]+150*b*Math.sin(ang),{color:BLU,w:5,opacity:.85});
   r+=line(MC[0],MC[1],MC[0]+55*b*Math.cos(ang+.13),MC[1]+55*b*Math.sin(ang+.13),{color:RED,w:3,opacity:.6});
   const ph=((t*.7+i*.37)%1);r+=dot(MC[0]+150*ph*Math.cos(ang),MC[1]+150*ph*Math.sin(ang),7,BLU,b*(1-ph*.6));}
  s+=r;
  s+=fade(b,label('青を 特に よく 散らす',MC[0],100,{size:30,color:'#8ec0ff',anchor:'middle',weight:700}));
 }
 // → the blue sky
 s+=fade(k,arrow(735,270,800,270,{color:HC,w:5,head:16})+skyRect('cldR','#1d4fae','#7db4f2',820,110,340,300,14)+sun(1110,150,16)+label('青い 空',990,452,{size:32,color:'#8ec0ff',anchor:'middle',weight:700}));
 return s;
}

// ---------- 3: a big water drop — much larger than the wavelength; every colour scatters alike ----------
const DC=[640,290],DR=130;            // drop: diameter 260 px ≈ 10 μm → 1 μm ≈ 26 px
const PXUM=2*DR/10;
function wavelet(x0,yc,L,n,t,col,u=1){const pts=[];for(let x=0;x<=L*n;x+=1)pts.push([x0+x,yc-6*Math.sin(2*PI*x/L-t*6)]);return draw(pts,u,{color:col,w:3});}
function dropScene(ctx,p,t){
 const d=vseg(ctx,p,0,.14),w=vseg(ctx,p,.14,.32),c=vseg(ctx,p,.32,.45),r=vseg(ctx,p,.55,.75),sc=vseg(ctx,p,.72,.92);
 let s=fade(d,`<defs><radialGradient id="cldDrop" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#cfe6ff" stop-opacity=".55"/><stop offset="1" stop-color="#4f8ef0" stop-opacity=".18"/></radialGradient></defs><circle cx="${DC[0]}" cy="${DC[1]}" r="${DR}" fill="url(#cldDrop)" stroke="#9cc8ff" stroke-width="3"/>`);
 s+=fade(d,label('雲の 水の粒',470,110,{size:30,color:'#9cc8ff',anchor:'middle',weight:700}));
 s+=fade(c,line(DC[0]-DR,DC[1]+50,DC[0]+DR,DC[1]+50,{color:HC,w:3})+line(DC[0]-DR+6,DC[1]+40,DC[0]-DR+6,DC[1]+60,{color:HC,w:3})+line(DC[0]+DR-6,DC[1]+40,DC[0]+DR-6,DC[1]+60,{color:HC,w:3}));
 // light wavelength on the same scale (0.4–0.7 μm ≈ 10–18 px)
 const bx=850,by=120;
 s+=fade(w,rect(bx,by-40,320,170,{fill:'#131f38',fo:.95,stroke:C.faint,sw:2,rx:12})+label('光の 波長（同じ 縮尺）',bx+160,by-8,{size:24,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(w,wavelet(bx+30,by+40,.4*PXUM,6,t,BLU,w)+wavelet(bx+30,by+80,.7*PXUM,4,t,RED,w)+label('0.4〜0.7 μm',bx+250,by+70,{size:24,color:C.dim,anchor:'middle'}));
 s+=fade(c,label('約 10 μm',DC[0],DC[1]+38,{size:30,color:HC,anchor:'middle',weight:700})+label('ずっと 大きい',bx+160,by+170,{size:30,color:HC,anchor:'middle',weight:700}));
 // incoming red, green, blue from the left
 const cols=[RED,GRN,BLU];
 cols.forEach((col,i)=>{const y=DC[1]-30+i*30;s+=draw([[40,y],[DC[0]-Math.sqrt(DR*DR-(y-DC[1])**2),y]],r,{color:col,w:6});});
 if(r>0)s+=fade(r,label('赤・緑・青',60,DC[1]-56,{size:26,color:C.ink,weight:700}));
 // scattered: every direction gets all three colours equally
 if(sc>0){let q='';
  for(let i=0;i<8;i++){const ang=-PI/2+i*PI/4+.4;if(Math.cos(ang)<-.3)continue;
   cols.forEach((col,k)=>{const off=(k-1)*9,nx=-Math.sin(ang),ny=Math.cos(ang),x0=DC[0]+(DR+8)*Math.cos(ang)+off*nx,y0=DC[1]+(DR+8)*Math.sin(ang)+off*ny;
    q+=draw([[x0,y0],[x0+80*Math.cos(ang),y0+80*Math.sin(ang)]],sc,{color:col,w:4});});}
  s+=clipR('cldSc',0,60,1200,455,q);
  s+=fade(seg(sc,.5,1),label('どの色も 同じように 散る',300,470,{size:30,color:HC,anchor:'middle',weight:700}));
 }
 return s;
}

// ---------- 4: red + green + blue → white → the cloud is white ----------
function whiteScene(ctx,p,t){
 const a=vseg(ctx,p,0,.3),w=vseg(ctx,p,.28,.48),k=vseg(ctx,p,.6,.8);
 const W=[520,270];
 let s='';
 [[RED,150,'赤'],[GRN,270,'緑'],[BLU,390,'青']].forEach(([col,y,nm],i)=>{
  s+=draw([[150,y],[W[0]-60,W[1]+(y-270)*.15]],seg(a,i*.15,.55+i*.15),{color:col,w:9});
  s+=fade(seg(a,i*.15,.3+i*.15),label(nm,110,y+10,{size:32,color:col,anchor:'middle',weight:700}));
 });
 s+=fade(a,label('同じ だけ',300,110,{size:28,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(w,dot(W[0],W[1],95,'#ffffff',.12)+dot(W[0],W[1],70,'#ffffff',.25)+dot(W[0],W[1],48,'#ffffff')+label('白',W[0],W[1]+108,{size:40,color:'#ffffff',anchor:'middle',weight:700}));
 s+=fade(k,arrow(660,270,740,270,{color:HC,w:5,head:16})+skyRect('cldW','#1d4fae','#7db4f2',760,90,400,330,14)+cloud(960,270,1.25,{g:1})+label('だから 雲は 白い',960,470,{size:32,color:HC,anchor:'middle',weight:700}));
 return s;
}

// ---------- 5: a grey rain cloud ----------
function rainScene(t){
 let s=skyRect('cldRain','#2a3140','#5b6578');
 for(let i=0;i<70;i++){const x=180+hash(i)*840,y0=250+hash(i+3)*40,v=420,ph=((t*v/260+hash(i+7))%1);
  const y=y0+ph*260;if(y<510)s+=line(x,y,x-6,y+22,{color:'#9fb3d6',w:2,opacity:.7});}
 s+=cloud(420,200,1.7,{col:'#4a5263'})+cloud(760,190,1.9,{col:'#3d4453'})+cloud(600,250,1.6,{col:'#565f71'});
 s+=label('雨雲',1100,480,{size:32,color:'#c9d3e6',anchor:'end',weight:700});
 return s;
}

// ---------- 6: thick cloud cross-section: light bounces back near the top ----------
const CB={x:300,y:110,w:600,h:250};
function thickScene(ctx,p,t){
 const b=vseg(ctx,p,0,.22),ph=vseg(ctx,p,.42,.55),l1=vseg(ctx,p,.55,.7),l2=vseg(ctx,p,.78,.95);
 let s=sun(150,105,26,{g:b});
 s+=fade(b,`<defs><linearGradient id="cldThick" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f8ff"/><stop offset=".35" stop-color="#b8c1cf"/><stop offset="1" stop-color="#3a4252"/></linearGradient></defs>`+rect(CB.x,CB.y,CB.w,CB.h,{fill:'url(#cldThick)',fo:1,stroke:'#c9d3e6',sw:2,rx:28}));
 // drops packed tightly
 let d='';for(let i=0;i<150;i++){const x=CB.x+18+hash(i)*(CB.w-36),y=CB.y+14+hash(i+11)*(CB.h-28);d+=dot(x,y,4,'#7aa7e8',.55);}
 s+=fade(b,d);
 s+=fade(b,label('厚い 雲（水の粒が ぎっしり）',CB.x+CB.w/2,CB.y+CB.h+40,{size:26,color:C.ink,anchor:'middle',weight:700}));
 // ground and a person in the shade
 s+=fade(b,line(40,470,1160,470,{color:'#3b6b4f',w:4})+rect(CB.x,440,CB.w,30,{fill:'#000',fo:.25,stroke:'none',rx:0}));
 s+=fade(b,dot(600,428,9,'#8fa3c7')+line(600,437,600,462,{color:'#8fa3c7',w:6})+line(600,462,592,470,{color:'#8fa3c7',w:4})+line(600,462,608,470,{color:'#8fa3c7',w:4}));
 // photons: come down, are scattered back up near the top; very few reach the bottom
 if(ph>0){let q='';
  for(let i=0;i<26;i++){const T=2.2,u=((t*.9+i*.31)%T)/T,x=CB.x+60+((i*97)%480),deep=i%9===4;
   const turn=deep?1.2:.25+.25*hash(i),yIn=CB.y-70,yTurn=CB.y+(deep?CB.h+60:CB.h*.2*hash(i+2)+18);
   let x1,y1,o=1;
   if(!deep){if(u<turn){const v=u/turn;x1=x;y1=mix(yIn,yTurn,v);}else{const v=(u-turn)/(1-turn);const ang=-PI/2+(hash(i+4)-.5)*1.6;x1=x+v*170*Math.cos(ang);y1=yTurn+v*170*Math.sin(ang);o=1-v;}}
   else{x1=x;y1=mix(yIn,yTurn,u);o=y1>CB.y+CB.h?.35:.9;}
   q+=dot(x1,y1,6,'#fff6c8',o*ph);}
  s+=clipR('cldPh',0,62,1200,453,q);}
 s+=fade(l1,arrow(930,140,930,96,{color:HC,w:4,head:14})+label('上で 跳ね返される',950,128,{size:28,color:HC,weight:700}));
 s+=fade(l2,label('下まで ほとんど 届かない',1170,400,{size:28,color:'#9fb3d6',anchor:'end',weight:700})+label('→ 暗い',1170,438,{size:28,color:'#9fb3d6',anchor:'end',weight:700}));
 return s;
}

// ---------- 7: above the clouds, from an airplane window ----------
function aboveScene(ctx,p,t){
 const g=vseg(ctx,p,.3,.6);
 let s=rect(0,0,1200,515,{fill:'#2a3140',fo:1,stroke:'none',rx:0});
 const wx=380,wy=66,ww=440,wh=390;
 let inner=skyRect('cldAb','#0f3a99','#7db4f2',wx,wy,ww,wh,0)+sun(wx+330,wy+80,26);
 const dx=-t*10;
 for(let i=0;i<9;i++){const x=wx-80+((i*120+dx)%(ww+240)+ww+240)%(ww+240),y=wy+260+(i%3)*45;inner+=cloud(x,y,1.1+.2*(i%2),{col:'#ffffff'});}
 inner+=rect(wx,wy+300,ww,wh-300,{fill:'#ffffff',fo:1,stroke:'none',rx:0});
 inner+=fade(g,rect(wx,wy,ww,wh,{fill:'#ffffff',fo:.12*(.6+.4*Math.sin(t*2)),stroke:'none',rx:0}));
 s+=`<clipPath id="cldWin"><rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" rx="130"/></clipPath><g clip-path="url(#cldWin)">${inner}</g>`;
 s+=rect(wx-14,wy-14,ww+28,wh+28,{fill:'none',fo:0,stroke:'#c9d3e6',sw:14,rx:140});
 s+=fade(vseg(ctx,p,.05,.25),label('雲の 上から 見ると',190,250,{size:30,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(g,label('真っ白に 輝く',1010,250,{size:32,color:'#ffffff',anchor:'middle',weight:700}));
 return s;
}

// ---------- 8: why don't clouds fall? ----------
function fallScene(ctx,p,t){
 let s=skyRect('cldEnd','#173f94','#5a9be8');
 s+=cloud(600,380,1.4);
 let d='';for(let i=0;i<24;i++){const x=480+hash(i)*240,y=350+hash(i+5)*60;d+=dot(x,y,4,'#7aa7e8',.8);}
 s+=fade(vseg(ctx,p,.2,.4),d+label('水の粒',800,350,{size:26,color:'#e8f2ff',weight:700}));
 const bob=4*Math.sin(t*3);
 s+=fade(vseg(ctx,p,.5,.7),arrow(950,330+bob,950,440+bob,{color:HC,w:6,head:20})+label('？',1010,410,{size:70,color:HC,anchor:'middle',weight:700}));
 return s;
}

export const sp1minCloudDiagrams={
 // 1 — Q card on a blue sky
 [K+'q']:wrap(1,(p,ctx)=>{const t=cueT(p,ctx);return qcard(['青い 空に 浮かぶ 雲は、','なぜ 白い？'],p,t,{bg:blueSky(t),y0:200});},{fadeIn:false,roll:0}),
 // 2 — recap: tiny molecules scatter blue strongly
 [K+'sky']:wrap(1,(p,ctx)=>recap(ctx,p,cueT(p,ctx)),{pill:'雲は、なぜ白い？',bridge:.95}),
 // 3 — the cloud drop is much larger than the wavelength; every colour scatters alike
 [K+'drop']:wrap(2,(p,ctx)=>dropScene(ctx,p,cueT(p,ctx)),{roll:0,q:{end:.13,lines:['雲の 水の粒は、','空気の 分子と 何が ちがう？'],text:'雲の粒は、分子と何がちがう？'}}),
 // 4 — all colours equally → white
 [K+'white']:wrap(2,(p,ctx)=>whiteScene(ctx,p,cueT(p,ctx)),{pill:'雲の粒は、分子と何がちがう？',bridge:.92}),
 // 5 — why are rain clouds grey?
 [K+'rain']:wrap(3,(p,ctx)=>rainScene(cueT(p,ctx)),{roll:0,q:{end:.9,lines:['雨雲は、なぜ 灰色？'],text:'雨雲は、なぜ灰色？'}}),
 // 6 — thick cloud: light bounces back at the top, little reaches the bottom
 [K+'thick']:wrap(3,(p,ctx)=>thickScene(ctx,p,cueT(p,ctx)),{pill:'雨雲は、なぜ灰色？'}),
 // 7 — from above, a rain cloud shines white
 [K+'above']:wrap(3,(p,ctx)=>aboveScene(ctx,p,cueT(p,ctx)),{pill:'雨雲は、なぜ灰色？',bridge:.92}),
 // 8 — next question (stops on the yellow frame)
 [K+'next']:wrap(4,(p,ctx)=>{const t=cueT(p,ctx),g=vseg(ctx,p,.05,.2);
  return fallScene(ctx,p,t)+finalQ(['そんなに 水を 含んだ 雲は、','なぜ 落ちてこない？'],g,{y:80,sc:.9+.1*g});
 },{roll:0}),
};

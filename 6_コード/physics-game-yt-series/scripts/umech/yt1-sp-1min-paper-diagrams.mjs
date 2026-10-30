// 特別編「1分の疑問」15 紙を42回折ると月に届く (ys-sp-1min-paper) — 図。Stage 1200×515。
// 紙の厚さ（塔）は水色、回数 n は金、強調 黄。月は淡い灰、地球は青。
// 形の部品（疑問カウンター・疑問カード・橋・黄色の枠）は 01 の yt1-sp-1min-common.mjs、クイズは yt1-sp-1min-sdp-common.mjs。
import {C,seg,clamp,mix,fade,label,line,rect,dot,ring,draw,arrow,tex,brace,scaleAt,poly} from './anim.mjs';
import {wrap,finalQ,vseg} from './yt1-sp-1min-common.mjs';
import {cueT,quizFull,answer,tag,card,cross,clip,HC,PI} from './yt1-sp-1min-sdp-common.mjs';

const K='sp-1min-paper:';
const PAP=C.x, NC=C.t, MOON='#d9dde6', EARTH='#2f6fd6';
const Q={q:['厚さ 0.1 mm の紙を 折っていく。','何回 折れば、月に 届く？'],opts:['42回','1000回','100万回'],ans:0};

function moon(x,y,r,{g=1}={}){
 let s=dot(x,y,r,MOON)+dot(x-r*.3,y-r*.25,r*.18,'#b9bfcc')+dot(x+r*.32,y+r*.1,r*.13,'#b9bfcc')+dot(x-r*.05,y+r*.42,r*.1,'#b9bfcc');
 return fade(g,s);
}
function earth(x,y,r,{g=1}={}){return fade(g,dot(x,y,r,EARTH)+ring(x,y,r,{color:'#7fb2ff',w:2}));}
// a sheet seen from the side, folded k times (just a stack of k layers drawn thicker)
function paperStack(x,yB,w,h,{g=1,col=PAP}={}){return fade(g,rect(x,yB-h,w,h,{fill:col,fo:.55,stroke:col,sw:2,rx:2}));}

// icons
function hand(x,yB,h){ // palm with four fingers + thumb; yB = wrist
 const c='#e8c3a0';let s=rect(x-h*.28,yB-h*.55,h*.56,h*.55,{fill:c,fo:1,stroke:c,rx:h*.1});
 for(let i=0;i<4;i++)s+=rect(x-h*.27+i*h*.14,yB-h,h*.12,h*.5,{fill:c,fo:1,stroke:c,rx:h*.06});
 s+=`<g transform="rotate(-35 ${x-h*.28} ${yB-h*.35})">${rect(x-h*.28-h*.1,yB-h*.7,h*.12,h*.38,{fill:c,fo:1,stroke:c,rx:h*.06})}</g>`;
 return s;
}
function building(x,yB,w,h){
 let s=rect(x-w/2,yB-h,w,h,{fill:'#3a4a66',fo:1,stroke:'#7c8aa6',sw:2,rx:2});
 for(let r=0;r<Math.floor(h/18)-1;r++)for(let c=0;c<3;c++)s+=rect(x-w/2+8+c*(w-16)/3,yB-h+10+r*18,(w-16)/3-6,9,{fill:'#ffe8a3',fo:.55,stroke:'none',rx:1});
 return s;
}
function horizon(x0,x1,yB,yTop){ // ground curve + atmosphere fading up to the edge of space
 let s=`<defs><linearGradient id="ppAtm" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#5a9be8" stop-opacity=".75"/><stop offset="1" stop-color="#0b1122" stop-opacity="0"/></linearGradient></defs>`;
 s+=rect(x0,yTop,x1-x0,yB-yTop,{fill:'url(#ppAtm)',fo:1,stroke:'none',rx:0});
 s+=rect(x0,yB,x1-x0,16,{fill:'#2f6fd6',fo:1,stroke:'none',rx:0});
 for(let i=0;i<40;i++){const u=(i*37%97)/97,v=(i*53%89)/89;s+=dot(mix(x0+6,x1-6,u),mix(yTop-60,yTop-6,v),1.6,'#fff',.7);}
 return s;
}

export const spOneMinPaperDiagrams={
 // 1. クイズ：何回折れば月に届く？
 [K+'q']:wrap(1,(p,ctx)=>{const t=cueT(p,ctx);
  return quizFull(p,t,ctx,{...Q,ans:-1,art:fade(seg(p,.05,.15),moon(900,150,34))});
 },{fadeIn:false,roll:0}),
 // 2. 答え：たった 42回 → なぜ？
 [K+'answer']:wrap(2,(p,ctx)=>{const t=cueT(p,ctx);
  let b=label('たった',600,220,{size:44,color:C.ink,anchor:'middle',weight:700})+label('42回',600,340,{size:120,color:HC,anchor:'middle',weight:700});
  b+=moon(940,250,46)+fade(.8,line(760,300,880,270,{color:C.dim,w:2,dash:'6 8'}));
  return answer(p,t,ctx,Q,b,{fold:[.25,.38],ansText:'答え：42回',ax:470});
 },{fadeIn:false,roll:.55,q:{start:.55,end:1,lines:['なぜ たった 42回で','届くの？'],text:'なぜ、たった42回で届く？'}}),
 // 3. 折るたびに 2倍：10回 約10 cm（手のひら）、20回 約100 m（ビル）、30回 約100 km（宇宙の入口）
 [K+'double']:wrap(2,(p,ctx)=>{const t=cueT(p,ctx);
  const g1=vseg(ctx,p,.22,.34),g2=vseg(ctx,p,.5,.62),g3=vseg(ctx,p,.72,.84);
  // left: the doubling rule
  let L=label('1回 折るごとに',170,140,{size:28,color:C.ink,anchor:'middle',weight:700})+label('× 2',170,210,{size:64,color:HC,anchor:'middle',weight:700});
  L+=fade(vseg(ctx,p,.08,.2),paperStack(110,400,120,8)+paperStack(110,390,120,8,{col:'#4fb7d6'})+label('0.1 mm',170,440,{size:24,color:C.dim,anchor:'middle'}));
  L+=fade(g1,tex('2^{10}=1024',170,300,{size:34}))+fade(g1,label('約 1000倍',170,350,{size:26,color:C.dim,anchor:'middle'}));
  let s=card(40,70,260,420,L,vseg(ctx,p,0,.1));
  const panel=(x,n,big,small,icon,g)=>{
   let q=label(`${n}回`,x+130,120,{size:38,color:NC,anchor:'middle',weight:700});
   q+=icon;
   q+=label(big,x+130,440,{size:34,color:HC,anchor:'middle',weight:700})+label(small,x+130,478,{size:24,color:C.dim,anchor:'middle',weight:700});
   return card(x,70,260,420,q,g);
  };
  // 10 folds: stack (≈10 cm) beside a hand (≈18 cm)
  s+=panel(320,10,'約 10 cm','手のひら',hand(420,390,200)+paperStack(500,390,40,200*10.2/18),g1);
  // 20 folds: ≈105 m beside a 30-storey building (≈100 m)
  s+=panel(600,20,'約 100 m','ビル',building(690,390,70,230)+paperStack(760,390,36,230*1.05),g2);
  // 30 folds: ≈107 km reaching the edge of space (100 km)
  s+=panel(880,30,'約 100 km','宇宙の 入口',horizon(895,1125,390,180)+line(895,180,1125,180,{color:C.dim,w:2,dash:'6 6'})+paperStack(1040,390,24,210*1.07),g3);
  return s;
 },{pill:'なぜ、たった42回で届く？'}),
 // 4. 40・41・42回：11万 → 22万 → 44万 km、月（約38万 km）を越える
 [K+'moon']:wrap(2,(p,ctx)=>{const t=cueT(p,ctx);
  const EX=110,Y=300,PX=1000/45; // px per 10,000 km
  const steps=[[40,11,.0],[41,22,.15],[42,44,.32]];
  let s=earth(EX-12,Y,22)+label('地球',EX-12,Y+62,{size:26,color:C.ink,anchor:'middle',weight:700});
  const MX=EX+38.4*PX;s+=moon(MX,Y,20)+label('月',MX,Y-44,{size:28,color:C.ink,anchor:'middle',weight:700})+line(MX,Y+30,MX,Y+120,{color:C.dim,w:2,dash:'6 6'})+label('約 38万 km',MX,Y+150,{size:26,color:C.dim,anchor:'middle',weight:700});
  let L=0,lab='';
  steps.forEach(([n,d,a],i)=>{const g=vseg(ctx,p,a,a+.12);if(g<=0)return;L=Math.max(L,mix(i?steps[i-1][1]:0,d,g));
   const on=i===steps.length-1||vseg(ctx,p,steps[i+1][2],steps[i+1][2]+.06)<1;
   lab+=fade(on?g*(i<2?1-vseg(ctx,p,steps[i+1][2],steps[i+1][2]+.06):1):0,label(`${n}回　約 ${d}万 km`,EX+d*PX,Y-110,{size:30,color:i===2?HC:NC,anchor:i===2?'end':'middle',weight:700}));});
  s+=rect(EX,Y-9,L*PX,18,{fill:PAP,fo:.7,stroke:PAP,sw:2,rx:3});
  s+=lab;
  s+=fade(vseg(ctx,p,.5,.62),tag('月に 届いた！',MX-80,Y+230-30,{size:30}));
  return s;
 },{fadeIn:false,pill:'なぜ、たった42回で届く？',bridge:.95}),
 // 5. 2ⁿ のグラフ：最初はほとんど 0、ある所から爆発的に
 [K+'exp']:wrap(3,(p,ctx)=>{const t=cueT(p,ctx);
  const X=n=>mix(160,1040,n/42),Y=v=>mix(440,100,v/44); // v in 10,000 km
  let s=line(150,440,1080,440,{color:C.dim,w:2})+line(160,450,160,90,{color:C.dim,w:2});
  for(const n of[0,10,20,30,40])s+=line(X(n),440,X(n),450,{color:C.dim,w:2})+label(String(n),X(n),478,{size:24,color:C.dim,anchor:'middle'});
  s+=label('折った 回数',1090,510,{size:24,color:NC,anchor:'end',weight:700});
  s+=label('厚さ',176,92,{size:24,color:PAP,weight:700});
  const pts=[];for(let i=0;i<=420;i++){const n=42*i/420;pts.push([X(n),Y(1e-4*Math.pow(2,n)/1e7)]);}
  s+=draw(pts,vseg(ctx,p,.1,.6),{color:PAP,w:5});
  s+=fade(vseg(ctx,p,.25,.4),tex('0.1\\,\\mathrm{mm}\\times 2^{n}',420,200,{size:38}));
  s+=fade(vseg(ctx,p,.45,.6),label('30回まで ほとんど 0 に 見える',X(16),400,{size:26,color:C.dim,anchor:'middle',weight:700}));
  s+=fade(vseg(ctx,p,.6,.72),dot(X(42),Y(44),9,HC)+label('42回 約44万 km',X(42)-14,Y(44)+8,{size:26,color:HC,anchor:'end',weight:700}));
  s+=fade(vseg(ctx,p,.65,.8),tag('指数関数的な 増え方',760,300,{size:28}));
  return s;
 },{roll:0,q:{end:.2,lines:['なぜ こんなに','急に 増える？'],text:'なぜ、こんなに急に増える？'}}),
 // 6. 約100回で、見えている宇宙の端から端（回数を横軸に、目印を並べる）
 [K+'universe']:wrap(3,(p,ctx)=>{const t=cueT(p,ctx);
  const X=n=>mix(120,1100,(n-40)/66),Y=290;
  let s=line(100,Y,1120,Y,{color:C.dim,w:3});
  for(let n=40;n<=105;n+=10)s+=line(X(n),Y-8,X(n),Y+8,{color:C.dim,w:2})+label(String(n),X(n),Y+40,{size:22,color:C.dim,anchor:'middle'});
  s+=label('折った 回数',100,Y+80,{size:24,color:NC,anchor:'start',weight:700});
  const M=[[42,'月','約38万 km',-1,.05],[51,'太陽','約1.5億 km',1,.2],[69,'となりの 恒星','約4光年',-1,.35],[103,'見えている 宇宙の 端から端','',1,.55]];
  M.forEach(([n,a,b,up,at])=>{const g=vseg(ctx,p,at,at+.12),x=X(n),y=Y+up*90;
   let q=line(x,Y,x,y-up*10,{color:HC,w:2})+dot(x,Y,8,HC);
   q+=label(`${n}回`,x,up<0?y-58:y+24,{size:26,color:NC,anchor:n>100?'end':'middle',weight:700});
   q+=label(a,x,up<0?y-24:y+58,{size:26,color:C.ink,anchor:n>100?'end':'middle',weight:700});
   if(b)q+=label(b,x,up<0?y+6:y+88,{size:22,color:C.dim,anchor:'middle'});
   s+=fade(g,q);});
  s+=fade(vseg(ctx,p,.7,.85),tag('約 100回',X(103)-60,110,{size:30}));
  return s;
 },{pill:'なぜ、こんなに急に増える？',bridge:.95}),
 // 7. 実際は 7回くらいで折れない。2002年、高校生が長い紙で 12回
 [K+'real']:wrap(4,(p,ctx)=>{const t=cueT(p,ctx);
  // left: a sheet folded about 7 times -> a thick, stiff wad
  let A='';
  for(let i=0;i<7;i++){const w=260-i*26,h=10+i*2.5,y=420-i*0;A+=rect(170-w/2+60,y-(i+1)*20,w,18,{fill:'#f4f6fb',fo:.9-i*.05,stroke:'#c9d3e6',sw:1.5,rx:9});}
  A+=label('7回 くらい',230,170,{size:34,color:NC,anchor:'middle',weight:700})+label('もう 折れない',230,470,{size:28,color:C.ink,anchor:'middle',weight:700});
  let s=card(40,90,380,410,A,vseg(ctx,p,0,.12))+cross(380,170,22,vseg(ctx,p,.22,.32));
  // right: a long strip folded in half 12 times (sketch: a long strip with a fold mark)
  let B=label('2002年',800,140,{size:30,color:C.ink,anchor:'middle',weight:700});
  B+=rect(470,250,640,14,{fill:'#f4f6fb',fo:.95,stroke:'#c9d3e6',sw:1.5,rx:3});
  B+=`<path d="M1110 250 q34 7 0 14" fill="none" stroke="#c9d3e6" stroke-width="3"/>`;
  B+=rect(470,236,640,14,{fill:'#f4f6fb',fo:.8,stroke:'#c9d3e6',sw:1.5,rx:3});
  B+=label('長い 紙',790,310,{size:26,color:C.dim,anchor:'middle',weight:700});
  B+=label('12回',800,430,{size:84,color:HC,anchor:'middle',weight:700})+label('当時の 記録',800,480,{size:26,color:C.ink,anchor:'middle',weight:700});
  s+=card(450,90,700,410,B,vseg(ctx,p,.5,.62),HC);
  return s;
 },{roll:0,q:{end:.15,lines:['実際に 折ると？'],text:'実際に折ると？'},bridge:.95}),
 // 8. 次の疑問：なぜ紙は、それ以上折れなくなる？
 [K+'end']:wrap(5,(p,ctx)=>{const t=cueT(p,ctx),g=vseg(ctx,p,0,.15);
  let A='';for(let i=0;i<7;i++){const w=300-i*30;A+=rect(600-w/2,460-(i+1)*20,w,18,{fill:'#f4f6fb',fo:.9-i*.06,stroke:'#c9d3e6',sw:1.5,rx:9});}
  return fade(vseg(ctx,p,.3,.5),A)+finalQ(['なぜ 紙は、それ以上','折れなく なる？'],g,{y:90,sc:.9+.1*g});
 },{roll:0}),
};

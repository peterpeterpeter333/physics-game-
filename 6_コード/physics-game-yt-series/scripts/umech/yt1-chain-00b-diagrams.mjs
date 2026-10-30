// 技術の疑問の鎖 序章2（ys-chain-00b）「暗号機は、なぜ円板を回すのか？」— 図。縦長の舞台 1000×920（vert-v1）。
// 3D：scripts/blender/enigma_open.py の shot alb（アルベルティの円板）・rstep（円板1枚が一目盛り回る）・odo（3枚が距離計のように）。
// 文字の割合・入れ替えの表・ヴィジュネルの暗号文は、ここで計算して描く（値は台本 chain-00b.mjs の冒頭）。
import {C,seg,clamp,mix,fade,label,line,rect,dot,ring,draw,arrow,poly,scaleAt,W,H,HC,LIGHT,cueT,voiceEnd,vseg,swin,note,plate,bigQ,finalCard,
 jw,ORANGE,GREEN,RED_,PURPLE,CYAN,AMBER,yearTag,when,fuda,eqLine,letter,callout,tag} from './yt1-chain-common.mjs';
import {bclip,bframe,banchor,bframes,binfo} from './blender-clip.mjs';

const K='chain00b-';
const ABC='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
// 英文の文字の割合（％、よく知られた表。E 12.7・T 9.1）
const EN=[8.2,1.5,2.8,4.3,12.7,2.2,2.0,6.1,7.0,0.15,0.77,4.0,2.4,6.7,7.5,1.9,0.095,6.0,6.3,9.1,2.8,0.98,2.4,0.15,2.0,0.074];
const SUB='XYLKWBFZTNJRQAHVGMUOPDICSE';          // 入れ替えの表（図のための例）
const enc=(s,tab)=>[...s].map(c=>c===' '?' ':tab[ABC.indexOf(c)]).join('');
const PLAIN='MEET ME AT THE GATE AT TEN',CIPH=enc(PLAIN,SUB);
const CIPHER_P=ABC.split('').map((_,y)=>EN[SUB.indexOf(ABC[y])]);   // 暗号文の文字 y の割合
const ALB_IN='gkwnprtuzlxysomqihfdbacevj';
// ヴィジュネル
const VP='THECATSAWTHEDOG',VK='KEY';
const VC=[...VP].map((c,i)=>ABC[(ABC.indexOf(c)+ABC.indexOf(VK[i%3]))%26]).join('');
if(VC!=='DLCMERCEUDLCNSE')throw Error('vigenere '+VC);
const CA=[...'MEETATNOON'].map(c=>ABC[(ABC.indexOf(c)+3)%26]).join('');
if(CA!=='PHHWDWQRRQ')throw Error('caesar');
if(CIPH!=='QWWO QW XO OZW FXOW XO OWA')throw Error('subst '+CIPH);

const Y0='紀元前1世紀 ローマ',YS='紀元前1世紀〜 入れ替えの 表',YK='9世紀 バグダッド キンディー',YA='1467年 アルベルティ',YB='1553年 ベラーゾ（のちにヴィジュネル暗号と呼ばれる）',
 YC='1863年 カシスキー',YW='1914〜1918年 第一次世界大戦',YSC='1918年 シェルビウス',Y23='1923年',YM='1926年 海軍、1928年 陸軍';
const KC=['#ff9f43','#6adfff','#b49bff'];      // 合言葉の K・E・Y の色
const box=(x,y,w,h,{col='#8aa0c4',fo=.12,sw=3,rx=18}={})=>rect(x,y,w,h,{fill:'#131f38',fo:.95,stroke:col,sw,rx})+rect(x,y,w,h,{fill:col,fo,stroke:'none',rx});
const tg=(ctx,p)=>ctx&&typeof ctx.tg==='number'?ctx.tg:cueT(p,ctx);
const A=(s,n,u,o)=>banchor(s,n,u,o);
const mono=(t,x,y,{size=44,color=C.ink,cw=0.74,g=1,cols=null,anchor='start'}={})=>{ // 1文字ずつ同じ幅で並べる
 const n=[...t].length,w=size*cw,x0=anchor==='middle'?x-n*w/2:x;let s='';
 [...t].forEach((c,i)=>{s+=label(c,x0+i*w+w/2,y,{size,color:cols?.[i]??color,anchor:'middle',weight:700});});return fade(g,s);};
// 棒グラフ（26本）
function bars(vals,{x=70,y=760,w=860,h=380,max=13,g=1,col='#8aa0c4',hl={},lab=ABC,lsize=36,grow=1,title=''}={}){
 if(g<=0)return '';
 const bw=w/26;let s=line(x-6,y,x+w+6,y,{color:C.dim,w:2});
 vals.forEach((v,i)=>{const hh=h*Math.min(v,max)/max*grow,c=hl[i]??col;
  s+=rect(x+i*bw+bw*.14,y-hh,bw*.72,hh,{fill:c,fo:hl[i]?.95:.75,stroke:'none',rx:3});
  s+=label(lab[i],x+i*bw+bw/2,y+40,{size:lsize,color:hl[i]?c:C.dim,anchor:'middle',weight:700});});
 if(title)s+=label(title,x,y-h-110,{size:36,color:C.dim,weight:700});
 return fade(g,s);
}
const barTop=(vals,i,{x=70,y=760,w=860,h=380,max=13}={})=>[x+(i+.5)*w/26,y-h*Math.min(vals[i],max)/max];
// アルベルティ：向き m 通りを同じ回数ずつ使ったときの、暗号文の文字の割合（計算）
function albMix(m){
 const out=Array(26).fill(0);
 for(let t=0;t<m;t++)for(let x=0;x<26;x++){ // 外の文字 x → 内の文字（向き t）
  const k=(x-t+26)%26,y=ABC.indexOf(ALB_IN[k].toUpperCase());out[y]+=EN[x]/m;}
 return out;
}
const albE=t=>ALB_IN[(4-t+26)%26];
const ALBO={x:0,y:60,w:1000};
function albLetters(u,{g=1,hlE=false,o=ALBO}={}){
 if(g<=0)return '';let s='';
 const t=Math.round(binfoTurn(u)*1)/1;
 for(let j=0;j<26;j++){const a=A('alb','o'+j,u,o),b=A('alb','i'+j,u,o),isE=hlE&&j===4;
  s+=label(ABC[j],a[0],a[1]+13,{color:isE?'#d9480f':'#1c2a44',size:isE?46:38,anchor:'middle',weight:700});
  s+=label(ALB_IN[j],b[0],b[1]+12,{size:36,color:'#3b2a14',anchor:'middle',weight:700});}
 return fade(g,s);
}
// alb の向き（enigma_open.py の alb_turn と同じ式）
const sm=u=>{u=clamp(u);return u*u*(3-2*u);};
const segp=(u,a,b)=>sm((u-a)/(b-a));
function binfoTurn(u){return [.12,.42,.72].reduce((s,a)=>s+segp(u,a,a+.12),0);}

export const chain00bDiagrams={
 // 1 エニグマから さかのぼる
 [K+'band:intro']:when('紀元前1世紀〜1923年',(p,ctx)=>{
  const it=[['1923年','エニグマ'],['1918年','回る円板'],['1863年','くり返しを見破る'],['1553年','合言葉'],['1467年','二枚の円板'],['9世紀','文字を数えて解く'],['紀元前1世紀','ずらす暗号']];
  let s='';const g=swin(ctx,p,1,0,.9);
  it.forEach(([y,t],i)=>{const gi=i===0?vseg(ctx,p,0,.15):seg(g,(i-1)*.14,(i-1)*.14+.25),yy=860-i*112;
   s+=fade(gi,dot(170,yy-14,12,i===0?HC:C.ink)+label(y,210,yy,{size:40,color:i===0?HC:C.ink,weight:700})+label(t,510,yy,{size:40,color:C.dim,weight:700}));});
  s+=line(170,860-14,170,860-6*112-14,{color:C.faint,w:4});
  s+=fade(g,arrow(110,840,110,190,{color:HC,w:5,head:20})+plate('さかのぼる',40,905,{size:36,anchor:'start',color:HC}));
  s+=fade(swin(ctx,p,1,.6,1),plate('2000年以上の 知恵比べ',500,110,{size:44,anchor:'middle',color:HC}));
  return s;
 }),
 // 2 カエサル：3つずらす
 [K+'caesar:shift']:when(Y0,(p,ctx)=>{
  const g1=swin(ctx,p,0,.2,.8),g2=swin(ctx,p,1,0,.6),hl=swin(ctx,p,1,.3,.9);
  let s=fade(swin(ctx,p,0,0,.4),label('文字を ずらす',500,140,{size:46,color:C.dim,anchor:'middle',weight:700}));
  for(let blk=0;blk<2;blk++){const y0=280+blk*300;
   s+=fade(g1,label('元',30,y0,{size:36,color:C.dim,weight:700})+label('暗号',30,y0+120,{size:36,color:HC,weight:700}));
   for(let i=0;i<13;i++){const j=blk*13+i,x=130+i*66;const h=(j<2)&&hl>0;
    s+=fade(g1,rect(x-28,y0-44,56,60,{fill:h?HC:'#131f38',fo:h?.2:.9,stroke:h?HC:C.faint,sw:2,rx:8})+label(ABC[j],x,y0,{size:40,color:h?HC:C.ink,anchor:'middle',weight:700}));
    s+=fade(g2,line(x,y0+22,x,y0+68,{color:h?HC:C.faint,w:h?4:2})+label(ABC[(j+3)%26],x,y0+120,{size:40,color:h?HC:'#ffd8a8',anchor:'middle',weight:700}));}}
  s+=fade(hl,plate('A → D、B → E',500,880,{size:46,anchor:'middle',color:HC}));
  return s;
 }),
 // 3 25通りを全部試す
 [K+'caesar:try']:when(Y0,(p,ctx)=>{
  const g0=swin(ctx,p,0,0,.6),run=swin(ctx,p,1,0,.85);
  let s=label('暗号文',60,130,{size:40,color:C.dim,weight:700})+mono(CA,250,132,{size:48,color:'#ffd8a8',cw:.8});
  s+=fade(g0,plate('ずらし方は 1〜25 の 25通り',500,200,{size:42,anchor:'middle',color:HC}));
  for(let n=1;n<=25;n++){const col=Math.floor((n-1)/13),row=(n-1)%13,x=40+col*440,y=270+row*48,gi=seg(run,(n-1)/27,(n-1)/27+.08),ok=n===3;
   const tx=[...CA].map(c=>ABC[(ABC.indexOf(c)-n+26)%26]).join('');
   s+=fade(gi,label(String(n),x+40,y,{size:36,color:C.dim,anchor:'end',weight:700})+mono(tx,x+56,y,{size:36,color:ok?GREEN:C.ink,cw:.68}));
   if(ok)s+=fade(seg(run,.85,1),rect(x-6,y-38,326,50,{fill:'none',fo:0,stroke:GREEN,sw:4,rx:10}));}
  s+=fade(seg(run,.88,1),plate('3 で 意味のある 文：MEET AT NOON',500,895,{size:40,anchor:'middle',color:GREEN}));
  return s;
 }),
 // 4a 入れ替えの表
 [K+'subst:table']:when(YS,(p,ctx)=>{
  const g=vseg(ctx,p,.2,.9);
  let s=label('ばらばらに 入れ替える 表（例）',500,150,{size:42,color:C.dim,anchor:'middle',weight:700});
  for(let blk=0;blk<2;blk++){const y0=320+blk*280;
   for(let i=0;i<13;i++){const j=blk*13+i,x=105+i*66,gi=seg(g,j/30,j/30+.15);
    s+=label(ABC[j],x,y0,{size:40,color:C.ink,anchor:'middle',weight:700});
    s+=fade(gi,line(x,y0+18,x,y0+62,{color:C.faint,w:2})+label(SUB[j],x,y0+110,{size:40,color:'#ffd8a8',anchor:'middle',weight:700}));}}
  return s;
 }),
 // 4b 26!
 [K+'subst:count']:when(YS,(p,ctx)=>{
  const g1=swin(ctx,p,0,0,.5),g2=swin(ctx,p,0,.5,1),g3=swin(ctx,p,1,0,.6);
  let s=label('入れ替え方の 数',500,150,{size:42,color:C.dim,anchor:'middle',weight:700});
  s+=fade(g1,label('A の行き先 26 × B 25 × C 24 × … × 1',500,280,{size:40,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(g1,label('＝ 26!（26の 階乗）',500,370,{size:48,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(g2,label('≈ 4×10²⁶ 通り',500,500,{size:66,color:HC,anchor:'middle',weight:700})+note('＝ 403291461126605635584000000',500,570,{anchor:'middle'}));
  s+=fade(g3,box(140,660,720,120,{col:RED_})+label('全部は 試せない',500,738,{size:50,color:RED_,anchor:'middle',weight:700}));
  return s;
 }),
 // 5 キンディー：試さずに解ける？
 [K+'kindi:odd']:when(YK,(p,ctx)=>{
  const g1=vseg(ctx,p,.1,.5),g2=vseg(ctx,p,.5,.9);
  let s=fade(g1,rect(300,240,400,440,{fill:'#e8dcc0',fo:1,stroke:'#b9a57a',sw:4,rx:14}));
  for(let k=0;k<7;k++)s+=fade(g1,line(350,320+k*46,650,320+k*46,{color:'#b9a57a',w:3}));
  s+=fade(g1,label('暗号文の 解読について',500,740,{size:40,color:C.ink,anchor:'middle',weight:700})+note('キンディーが 書き残した',500,800,{anchor:'middle'}));
  s+=fuda('違和感',500,150,{anchor:'middle',text:'試さずに 解ける？',g:g2});
  return s;
 }),
 // 6 英文の文字の割合
 [K+'freq:eng']:when(YK,(p,ctx)=>{
  const g1=swin(ctx,p,0,0,.6),gr=swin(ctx,p,0,.2,1),g2=swin(ctx,p,1,0,.6);
  let s=bars(EN,{g:g1,grow:gr,hl:g2>0?{4:HC}:{},title:'英文の 文字の 割合（％）'});
  const [bx,by]=barTop(EN,4);
  s+=fade(g2,plate('E 約13％',bx+30,by-30,{size:46,color:HC}));
  s+=note('よく 知られた 表（E 12.7、T 9.1）',70,880,{g:g1});
  return s;
 }),
 // 7a 暗号文の割合：一番高い棒は E？
 [K+'freq:cipher']:when(YK,(p,ctx)=>{
  const g1=swin(ctx,p,0,0,.4),gE=swin(ctx,p,0,.5,.9),gT=swin(ctx,p,1,.3,.8);
  const wi=ABC.indexOf('W'),oi=ABC.indexOf('O');
  const hl={};if(gE>0)hl[wi]=HC;if(gT>0)hl[oi]=ORANGE;
  let s=bars(CIPHER_P,{g:g1,hl,title:'暗号文の 文字の 割合（％）'});
  const [wx,wy]=barTop(CIPHER_P,wi),[ox,oy]=barTop(CIPHER_P,oi);
  s+=fade(gE,plate('E？',wx,wy-26,{size:48,color:HC,anchor:'middle'}))+fade(gT,plate('T？',ox,oy-26,{size:48,color:ORANGE,anchor:'middle'}));
  s+=note('上の 例の 表で 入れ替えた 長い 暗号文',70,880,{g:g1});
  return s;
 }),
 // 7b 文が読めてくる
 [K+'freq:read']:when(YK,(p,ctx)=>{
  const st=vseg(ctx,p,.05,.9);
  const steps=[['W','E'],['O','T'],['X','A'],['Z','H'],['Q','M'],['F','G'],['A','N']];
  const known=new Map(steps.filter((_,i)=>st>=(i+.5)/steps.length*.9).map(([c,pl])=>[c,pl]));
  let s=label('暗号文',60,150,{size:40,color:C.dim,weight:700})+mono(CIPH,500,240,{size:48,cw:.74,color:'#ffd8a8',anchor:'middle'});
  const cols=[...CIPH].map(c=>known.has(c)?(c==='W'?HC:c==='O'?ORANGE:GREEN):C.faint);
  s+=label('読めた 所',60,370,{size:40,color:C.dim,weight:700})+mono([...CIPH].map(c=>c===' '?' ':known.get(c)??'・').join(''),500,460,{size:48,cw:.74,cols,anchor:'middle'});
  s+=fade(seg(st,.05,.3),plate('W → E、O → T',500,660,{size:44,anchor:'middle',color:HC}));
  s+=fade(seg(st,.85,1),note('（例文）',500,560,{anchor:'middle'}));
  return s;
 }),
 // 8 弱点：同じ文字がいつも同じ文字に
 [K+'weak:same']:when(YK,(p,ctx)=>{
  const g1=swin(ctx,p,0,0,.7),g2=swin(ctx,p,1,0,.8);
  const ce=[...PLAIN].map(c=>c==='E'?HC:C.ink),cc=[...CIPH].map(c=>c==='W'?HC:'#ffd8a8');
  let s=fade(g1,label('元',40,150,{size:36,color:C.dim,weight:700})+mono(PLAIN,520,150,{size:42,cw:.74,cols:ce,anchor:'middle'})+label('暗号',40,230,{size:36,color:C.dim,weight:700})+mono(CIPH,520,230,{size:42,cw:.74,cols:cc,anchor:'middle'}));
  s+=fade(g1,plate('E は いつも W',500,320,{size:44,anchor:'middle',color:HC}));
  const so=EN.map((v,i)=>[v,i]).sort((a,b)=>b[0]-a[0]),sc=CIPHER_P.map((v,i)=>[v,i]).sort((a,b)=>b[0]-a[0]);
  s+=bars(so.map(q=>q[0]),{x:40,y:640,w:440,h:220,lab:so.map((q,i)=>i<1?ABC[q[1]]:''),lsize:36,g:g2,col:'#8aa0c4',title:''});
  s+=bars(sc.map(q=>q[0]),{x:520,y:640,w:440,h:220,lab:sc.map((q,i)=>i<1?ABC[q[1]]:''),lsize:36,g:g2,col:'#ffb380',title:''});
  s+=fade(g2,label('英文',260,400,{size:38,color:C.dim,anchor:'middle',weight:700})+label('暗号文',740,400,{size:38,color:'#ffb380',anchor:'middle',weight:700}));
  s+=fade(swin(ctx,p,1,.5,1),plate('多い順に 並べると、同じ 形',500,800,{size:44,anchor:'middle',color:HC}));
  return s;
 }),
 // 9 考えの飛躍
 [K+'leap:table']:when(YK,(p,ctx)=>{
  const g=vseg(ctx,p,.1,.6);
  let s=fuda('考えの 飛躍',500,170,{anchor:'middle'});
  s+=fade(g,box(110,300,780,170,{col:HC})+label('文字ごとに、使う 表を 変える',500,400,{size:48,color:HC,anchor:'middle',weight:700}));
  const tabs=['表1','表2','表3','表1','表2'];
  tabs.forEach((t,i)=>{const gi=seg(g,.3+i*.12,.5+i*.12);s+=fade(gi,rect(90+i*170,560,140,140,{fill:'#131f38',fo:.9,stroke:KC[i%3],sw:3,rx:12})+label(t,160+i*170,645,{size:40,color:KC[i%3],anchor:'middle',weight:700})+label(`${i+1}文字目`,160+i*170,750,{size:36,color:C.dim,anchor:'middle',weight:700}));});
  return s;
 }),
 // 10a アルベルティの円板（3D）
 [K+'alb:make']:when(YA,(p,ctx)=>{
  const u=0;return bclip('alb',u,ALBO)+albLetters(u,{g:vseg(ctx,p,.3,.7)})+fade(vseg(ctx,p,.5,.9),plate('二枚の 円板',500,905,{size:42,anchor:'middle',color:HC}));
 }),
 // 10b 内の円板を回す → 表が変わる
 [K+'alb:disk']:when(YA,(p,ctx)=>{
  const u=vseg(ctx,p,.25,1);
  let s=bclip('alb',u,ALBO)+albLetters(u,{hlE:true});
  s+=plate('外：元の 文字',20,120,{size:38,color:C.ink,anchor:'start'})+plate('内：暗号の 文字',980,120,{size:38,color:AMBER,anchor:'end'});
  s+=note('図は 26文字（本物は 24）',960,905,{anchor:'end'});
  const t=Math.round(binfoTurn(u));s+=fade(vseg(ctx,p,.3,.5),plate(`E → ${albE(t)}`,40,870,{size:46,anchor:'start',color:HC}));
  return s;
 }),
 // 11 同じ E が違う文字に → 棒が平らに
 [K+'alb:flat']:when(YA,(p,ctx)=>{
  const g1=swin(ctx,p,0,0,.9),fl=swin(ctx,p,1,0,.9);
  let s=label('円板の 向き',60,140,{size:38,color:C.dim,weight:700});
  [0,1,2,3].forEach(t=>{const gi=seg(g1,t*.22,t*.22+.25),x=110+t*220;s+=fade(gi,box(x-80,170,170,130,{col:t%2?CYAN:HC})+label(`向き ${t}`,x+5,220,{size:36,color:C.dim,anchor:'middle',weight:700})+label(`E → ${albE(t)}`,x+5,280,{size:46,color:t%2?CYAN:HC,anchor:'middle',weight:700}));});
  const m=fl<.33?1:fl<.66?3:26,v=albMix(m),k=fl<.33?seg(fl,0,.33):fl<.66?seg(fl,.33,.66):seg(fl,.66,1);
  const prev=albMix(fl<.33?1:fl<.66?1:3),vv=v.map((x,i)=>mix(prev[i],x,k));
  s+=bars(vv,{y:800,h:300,col:'#ffb380',title:''});
  s+=fade(fl>0?1:0,plate(`向きを ${m} 通り 使う`,500,440,{size:42,anchor:'middle',color:'#ffb380'}));
  s+=note('暗号文の 文字の 割合（計算）',70,890,{g:fl>0?1:0});
  if(m===26&&k>.8)s+=plate('どれも 約3.8％',700,560,{size:40,color:GREEN,anchor:'middle'});
  return s;
 }),
 // 12 合言葉（ベラーゾ）
 [K+'vig:bellaso']:when(YB,(p,ctx)=>{
  const g1=swin(ctx,p,0,0,.6),g2=swin(ctx,p,0,.5,1);
  let s=fade(g1,box(250,170,500,160,{col:HC})+label('合言葉',500,235,{size:40,color:C.dim,anchor:'middle',weight:700})+mono('KEY',500,305,{size:60,cw:.9,cols:KC,anchor:'middle'}));
  s+=fade(g2,arrow(500,350,500,440,{color:C.ink,w:5,head:18})+label('文字ごとに ずらす 数を 変える',500,510,{size:44,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(swin(ctx,p,1,0,.7),plate('のちに「ヴィジュネル暗号」',500,640,{size:44,anchor:'middle',color:HC})+note('（ベラーゾが 1553年に 発表）',500,710,{anchor:'middle'}));
  return s;
 }),
 // 13 KEY → 10・4・24 をくり返す
 [K+'vig:key']:when(YB,(p,ctx)=>{
  const g1=swin(ctx,p,0,0,.9),g2=swin(ctx,p,1,0,.95);
  const sh=[10,4,24];let s='';
  ['K','E','Y'].forEach((c,i)=>{const gi=seg(g1,i*.3,i*.3+.35);s+=fade(gi,label(c,250+i*250,170,{size:56,color:KC[i],anchor:'middle',weight:700})+label(`${sh[i]}`,250+i*250,240,{size:44,color:KC[i],anchor:'middle',weight:700}));});
  s+=fade(g1,note('A＝0 として、K は 10、E は 4、Y は 24',500,300,{anchor:'middle'}));
  const x0=30,dx=50;
  s+=fade(g2,label('元',x0,400,{size:36,color:C.dim,weight:700})+label('合言葉',x0,500,{size:36,color:C.dim,weight:700})+label('ずらす',x0,600,{size:36,color:C.dim,weight:700})+label('暗号',x0,700,{size:36,color:C.dim,weight:700}));
  for(let i=0;i<15;i++){const x=190+i*50,gi=seg(g2,i/18,i/18+.12),c=KC[i%3];
   s+=fade(g2,label(VP[i],x,440,{size:40,color:C.ink,anchor:'middle',weight:700}));
   s+=fade(gi,label(VK[i%3],x,540,{size:40,color:c,anchor:'middle',weight:700})+(i<3?label(String(sh[i%3]),x,640,{size:36,color:c,anchor:'middle',weight:700}):dot(x,628,8,c))+label(VC[i],x,740,{size:40,color:'#ffd8a8',anchor:'middle',weight:700}));}
  s+=fade(g2,note('元の 文は 例：THE CAT SAW THE DOG',500,850,{anchor:'middle'}));
  return s;
 }),
 // 14 解けない暗号
 [K+'vig:strong']:when(YB,(p,ctx)=>{
  const g=vseg(ctx,p,.1,.6);
  let s=tag('解けない 暗号',500,200,{anchor:'middle',size:48,color:HC,g});
  s+=fade(g,line(150,460,850,460,{color:C.dim,w:4})+dot(150,460,12,C.ink)+dot(850,460,12,C.ink)+label('1553年',150,530,{size:40,color:C.ink,anchor:'middle',weight:700})+label('1863年',850,530,{size:40,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(vseg(ctx,p,.4,.9),label('約300年',500,420,{size:52,color:HC,anchor:'middle',weight:700}));
  return s;
 }),
 // 15 カシスキー
 [K+'kas:year']:when(YC,(p,ctx)=>{
  const g=vseg(ctx,p,.2,.7);
  let s=label('暗号文',60,200,{size:40,color:C.dim,weight:700})+mono(VC,500,300,{size:54,cw:.86,color:'#ffd8a8',anchor:'middle'});
  s+=fade(g,box(160,420,680,130,{col:GREEN})+label('解き方を 発表',500,505,{size:50,color:GREEN,anchor:'middle',weight:700}));
  return s;
 }),
 // 16 3文字ごとに同じずらし方
 [K+'kas:color']:when(YC,(p,ctx)=>{
  const g1=swin(ctx,p,0,0,.7),g2=swin(ctx,p,1,0,.9);
  let s='';const x0=500-15*58/2+29;
  s+=fade(g1,label('合言葉',60,200,{size:38,color:C.dim,weight:700}));
  for(let i=0;i<15;i++){const x=x0+i*58,c=KC[i%3];s+=fade(g1,label(VK[i%3],x,280,{size:44,color:c,anchor:'middle',weight:700}));
   s+=fade(g2,rect(x-26,340,52,70,{fill:c,fo:.25,stroke:c,sw:2,rx:8})+label(VC[i],x,390,{size:44,color:C.ink,anchor:'middle',weight:700}));}
  s+=fade(g2,label('暗号文',60,470,{size:38,color:C.dim,weight:700}));
  s+=fade(swin(ctx,p,1,.4,1),plate('3文字ごとに 同じ色 ＝ 同じ ずらし方',500,600,{size:42,anchor:'middle',color:HC}));
  return s;
 }),
 // 17 3文字おきに拾う → 棒のかたよりが戻る
 [K+'kas:column']:when(YC,(p,ctx)=>{
  const cnt=ctx?.cue?.diagram?.endsWith('count'),g1=cnt?1:vseg(ctx,p,.1,.7),g2=cnt?vseg(ctx,p,0,.8):0;
  let s='';const x0=500-15*58/2+29;
  for(let i=0;i<15;i++){const x=x0+i*58,c=KC[i%3],on=i%3===0;s+=rect(x-26,110,52,70,{fill:c,fo:on?.35:.08,stroke:on?c:C.faint,sw:2,rx:8})+label(VC[i],x,160,{size:44,color:on?C.ink:C.dim,anchor:'middle',weight:700});}
  s+=fade(g1,plate('K の 列：'+[...VC].filter((_,i)=>i%3===0).join(' '),500,250,{size:44,anchor:'middle',color:KC[0]}));
  const sh=EN.map((_,y)=>EN[(y-10+26)%26]);
  s+=bars(sh,{y:740,h:340,g:g2,col:KC[0],hl:{14:HC},title:''});
  const [ox,oy]=barTop(sh,14,{y:740,h:340});
  s+=fade(cnt?vseg(ctx,p,.4,.9):0,plate('E？',ox,oy-24,{size:44,color:HC,anchor:'middle'}));
  s+=fade(cnt?0:vseg(ctx,p,.6,1),plate('同じ 一つの ずらし方（10）',500,500,{size:42,anchor:'middle',color:KC[0]}));
  s+=note('長い 暗号文の K の 列（英文の 割合を 10 ずらした 形）',40,880,{g:g2});
  return s;
 }),
 // 18a 同じ並びの間隔
 [K+'kas:repeat']:when(YC,(p,ctx)=>{
  const g1=vseg(ctx,p,.1,.5),g2=vseg(ctx,p,.45,.9);
  let s='';const x0=500-15*58/2+29;
  for(let i=0;i<15;i++){const x=x0+i*58,on=(i<3||(i>=9&&i<12))&&g1>0;s+=rect(x-26,250,52,70,{fill:on?HC:'#131f38',fo:on?.25:.9,stroke:on?HC:C.faint,sw:2,rx:8})+label(VC[i],x,300,{size:44,color:on?HC:C.ink,anchor:'middle',weight:700});}
  s+=label('暗号文',60,200,{size:38,color:C.dim,weight:700});
  s+=fade(g1,plate('DLC が 2回',750,200,{size:44,anchor:'middle',color:HC}));
  const xa=x0,xb=x0+9*58;
  s+=fade(g2,draw([[xa,350],[xa,470],[xb,470],[xb,350]],1,{color:HC,w:4})+plate('間隔 9',(xa+xb)/2,540,{size:46,anchor:'middle',color:HC}));
  return s;
 }),
 // 18b なぜ同じ並びになるか
 [K+'kas:why']:when(YC,(p,ctx)=>{
  const g1=vseg(ctx,p,0,.5),g2=vseg(ctx,p,.5,.95);
  let s='';const x0=500-15*58/2+29;
  s+=label('元',30,200,{size:36,color:C.dim,weight:700})+label('合言葉',30,300,{size:36,color:C.dim,weight:700})+label('暗号',30,400,{size:36,color:C.dim,weight:700});
  for(let i=0;i<15;i++){const x=190+i*50,on=(i<3||(i>=9&&i<12));
   s+=label(VP[i],x,200,{size:40,color:on?HC:C.ink,anchor:'middle',weight:700})+label(VK[i%3],x,300,{size:40,color:on?KC[i%3]:C.faint,anchor:'middle',weight:700})+label(VC[i],x,400,{size:40,color:on?HC:'#ffd8a8',anchor:'middle',weight:700});}
  s+=fade(g1,plate('THE が どちらも K E Y に 重なった',500,520,{size:40,anchor:'middle',color:HC}));
  s+=fade(g2,label('9 ＝ 3 × 3',500,650,{size:60,color:HC,anchor:'middle',weight:700})+label('→ 合言葉の 長さは 3 の 約数',500,730,{size:42,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(g2,note('偶然 同じに なる 並びも あるので、',500,810,{anchor:'middle'})+note('いくつもの 間隔の 公約数を とる',500,860,{anchor:'middle'}));
  return s;
 }),
 // 19 考えの飛躍：くり返しが来ないほど長く
 [K+'leap:long']:when(YC,(p,ctx)=>{
  const g1=swin(ctx,p,0,0,.7),g2=swin(ctx,p,1,0,.9);
  let s=fuda('考えの 飛躍',500,170,{anchor:'middle',g:g2});
  s+=fade(g1,label('弱点 ＝ くり返し',500,320,{size:50,color:RED_,anchor:'middle',weight:700}));
  let k='';for(let i=0;i<14;i++)k+=label('KEY'[i%3],80+i*62,450,{size:44,color:KC[i%3],anchor:'middle',weight:700});s+=fade(g1,k);
  let L='';for(let i=0;i<14;i++)L+=rect(60+i*62,560,44,60,{fill:`hsl(${(i*53)%360} 70% 60%)`,fo:.6,stroke:'none',rx:6});
  s+=fade(g2,L+label('…',960,600,{size:48,color:C.ink,anchor:'end',weight:700})+label('くり返しが 来ないほど 長く、表を 変え続ける',500,720,{size:40,color:HC,anchor:'middle',weight:700}));
  return s;
 }),
 // 20a 手では大変
 [K+'ww1:hand']:when(YC,(p,ctx)=>{
  const g=vseg(ctx,p,0,.6),g2=vseg(ctx,p,.5,1);
  let s='';for(let i=0;i<12;i++){const x=120+(i%4)*200,y=180+Math.floor(i/4)*170;s+=fade(seg(g,i/14,i/14+.2),rect(x,y,150,130,{fill:'#e8dcc0',fo:.9,stroke:'#b9a57a',sw:3,rx:8})+label(`表${i+1}`,x+75,y+80,{size:38,color:'#1c2a44',anchor:'middle',weight:700}));}
  s+=fade(g2,label('何千通り…',500,760,{size:50,color:C.ink,anchor:'middle',weight:700})+label('時間が かかる・間違える',500,840,{size:44,color:RED_,anchor:'middle',weight:700}));
  return s;
 }),
 // 20b 無線
 [K+'ww1:radio']:when(YW,(p,ctx)=>{
  const t=tg(ctx,p),g=vseg(ctx,p,0,.3),g2=vseg(ctx,p,.5,.95);
  const tower=(x,y)=>draw([[x-40,y],[x,y-220],[x+40,y]],1,{color:'#8aa0c4',w:6})+line(x-28,y-70,x+28,y-70,{color:'#8aa0c4',w:4})+line(x-16,y-140,x+16,y-140,{color:'#8aa0c4',w:4})+dot(x,y-226,10,HC);
  let s=fade(g,tower(180,620)+tower(820,620)+line(60,620,940,620,{color:C.faint,w:3}));
  for(let k=0;k<4;k++){const r=((t*120+k*90)%360);s+=fade(g*clamp(1-r/360),`<path d="M ${180+r*.95} ${394-r*.25} a ${r*.4+20} ${r*.4+20} 0 0 1 0 ${r*.5+40}" fill="none" stroke="${HC}" stroke-width="4" opacity=".7"/>`);}
  s+=fade(g,label('無線の 知らせ',500,700,{size:44,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(g2,box(150,760,700,110,{col:HC})+label('速く、正確に 暗号を 作る',500,830,{size:44,color:HC,anchor:'middle',weight:700}));
  return s;
 }),
 // 21 シェルビウス：配線の円板（3D）
 [K+'sch:rotor']:when(YSC,(p,ctx)=>{
  const u=.24*vseg(ctx,p,0,.5);
  let s=bclip('rstep',u,{x:0,y:80,w:1000});
  s+=fade(swin(ctx,p,1,0,.5),plate('配線で 文字を 入れ替える 円板',500,860,{size:42,anchor:'middle',color:HC}));
  s+=fade(swin(ctx,p,1,.4,.9),plate('キーを 押すたびに 回す',500,150,{size:42,anchor:'middle',color:C.ink}));
  return s;
 }),
 // 22 世界の三か所
 [K+'sch:map']:when('1917〜1921年ごろ ヘバーン、コッホ',(p,ctx)=>{
  const g=vseg(ctx,p,0,.4);
  const NA=[[90,250],[200,200],[330,210],[380,280],[330,330],[300,420],[250,470],[200,430],[150,360],[90,320]];
  const EU=[[560,250],[620,210],[700,215],[720,260],[680,300],[640,330],[590,320],[555,290]];
  const AF=[[590,360],[680,350],[720,420],[690,540],[640,600],[600,520],[570,430]];
  const AS=[[720,200],[880,190],[960,260],[930,350],[840,400],[760,360],[720,300]];
  let s=fade(g,[NA,EU,AF,AS].map(P=>poly(P,{fill:'#2c3b5c',fo:1,stroke:'#4a5d85',sw:2})).join(''));
  const pts=[['ドイツ',650,255,'シェルビウス'],['オランダ',615,235,'コッホ'],['アメリカ',260,300,'ヘバーン']];
  const lab=[[650,700,'ドイツ（シェルビウス）'],[650,770,'オランダ（コッホ）'],[260,560,'アメリカ（ヘバーン）']];
  pts.forEach(([n,x,y],i)=>{const gi=vseg(ctx,p,.1+i*.25,.3+i*.25);s+=fade(gi,ring(x,y,18,{color:HC,w:5})+dot(x,y,6,HC));});
  s+=fade(vseg(ctx,p,.1,.3),callout('ドイツ（シェルビウス）',650,255,700,650,{size:38,color:HC}));
  s+=fade(vseg(ctx,p,.35,.55),callout('オランダ（コッホ）',615,235,520,140,{size:38,color:HC}));
  s+=fade(vseg(ctx,p,.6,.8),callout('アメリカ（ヘバーン）',260,300,260,600,{size:38,color:HC}));
  s+=note('地図は 大まか',960,890,{anchor:'end',g});
  return s;
 }),
 // 23 一目盛り回ると、出口が変わる（3D）
 [K+'sch:step']:when(YSC,(p,ctx)=>{
  const u=.24+.76*vseg(ctx,p,0,.95),O={x:0,y:80,w:1000};
  let s=bclip('rstep',u,O);
  const ia=A('rstep','inA',u,O),oe=A('rstep','outE',u,O),oj=A('rstep','outJ',u,O);
  s+=letter('A',ia[0]+30,ia[1]-40,{g:clamp((u-.26)/.05)})+plate('入口',ia[0]+30,ia[1]-100,{size:36,anchor:'middle',color:C.dim,g:clamp((u-.26)/.05)});
  const gE=clamp((u-.46)/.04)*(1-clamp((u-.52)/.04)),gE2=u>.55?.45:gE;
  s+=letter('E',oe[0]-50,oe[1],{g:gE2,color:u>.55?C.dim:HC});
  s+=letter('J',oj[0]-50,oj[1],{g:clamp((u-.94)/.04),color:CYAN});
  s+=fade(swin(ctx,p,0,.3,.8),plate('1枚の 配線 ＝ 一つの 表',500,150,{size:42,anchor:'middle',color:HC}));
  s+=fade(clamp((u-.55)/.1),plate('一目盛り 回すと',500,895,{size:40,anchor:'middle',color:C.ink,g:1-clamp((u-.95)/.04)}));
  s+=fade(clamp((u-.95)/.04),plate('一目盛りで A → E が A → J に',500,895,{size:40,anchor:'middle',color:CYAN}));
  return s;
 }),
 // 24 3枚を距離計のように（3D）
 [K+'sch:odo']:when(YSC,(p,ctx)=>odoFig(p,ctx,0)),
 [K+'sch:odo2']:when(YSC,(p,ctx)=>odoFig(p,ctx,1)),
};
function odoFig(p,ctx,k){
  const u=k?.62+.38*vseg(ctx,p,0,.5):.62*vseg(ctx,p,.05,1),O={x:0,y:70,w:1000};
  const info=binfo('odo'),n=bframes('odo'),i=Math.round(u*(n-1)),win=info.win[i];
  let s=bclip('odo',u,O);
  ['L','M','R'].forEach((r,k)=>{const b=A('odo','bot'+r,u,O);s+=rect(b[0]-44,b[1]-10,88,76,{fill:'#e8e2cf',fo:.95,stroke:'#8aa0c4',sw:3,rx:10})+label(win[k],b[0],b[1]+50,{size:48,color:'#1c2a44',anchor:'middle',weight:700})+label(['左','真ん中','右'][k],b[0],b[1]+112,{size:36,color:C.dim,anchor:'middle',weight:700});});
  s+=note('窓の 文字',60,860,{});
  s+=fade(k?vseg(ctx,p,.25,.55):0,plate('26 × 26 × 26 ＝ 17576',500,140,{size:52,anchor:'middle',color:HC}));
  s+=fade(k?1:vseg(ctx,p,.5,.8),plate('右が 一周 → 真ん中が 一目盛り',500,210,{size:40,anchor:'middle',color:C.ink}));
  return s;
}
const chain00bRest={
 // 25 1923年 エニグマ
 [K+'sell:1923']:when(Y23,(p,ctx)=>{
  const g1=swin(ctx,p,0,0,.6),g2=swin(ctx,p,1,0,.7);
  let s=fade(g1,box(160,170,680,420,{col:HC})+label('エニグマ',500,280,{size:72,color:HC,anchor:'middle',weight:700})+label('暗号機',500,350,{size:44,color:C.ink,anchor:'middle',weight:700}));
  for(let k=0;k<3;k++)s+=fade(g1,`<circle cx="${380+k*120}" cy="${470}" r="48" fill="#131f38" stroke="#8aa0c4" stroke-width="5"/>`+dot(380+k*120,470,8,'#c9a45c'));
  s+=fade(g2,label('はじめは 会社の 秘密を 守るため',500,700,{size:44,color:C.ink,anchor:'middle',weight:700}));
  s+=note('売り出された 機械の 形は いろいろ（図は 印）',500,880,{anchor:'middle',g:g1});
  return s;
 }),
 // 26 軍へ
 [K+'army:adopt']:when(YM,(p,ctx)=>{
  const g1=swin(ctx,p,0,0,.7),g2=swin(ctx,p,1,0,.8);
  let s=fade(g1,rect(110,170,260,330,{fill:'#7a3b2e',fo:1,stroke:'#c9a45c',sw:4,rx:8})+line(140,170,140,500,{color:'#c9a45c',w:3})+label('1923年',240,300,{size:38,color:'#ffe6b0',anchor:'middle',weight:700})+label('イギリスの 本',240,560,{size:38,color:C.dim,anchor:'middle',weight:700}));
  s+=fade(g1,box(420,200,520,260,{col:RED_})+label('ドイツの 暗号は',680,300,{size:42,color:C.ink,anchor:'middle',weight:700})+label('読まれていた',680,380,{size:50,color:RED_,anchor:'middle',weight:700}));
  s+=fade(g2,arrow(500,620,500,700,{color:C.ink,w:5,head:18})+box(170,720,300,120,{col:CYAN})+label('海軍 1926年',320,795,{size:42,color:CYAN,anchor:'middle',weight:700})+box(530,720,300,120,{col:GREEN})+label('陸軍 1928年',680,795,{size:42,color:GREEN,anchor:'middle',weight:700}));
  return s;
 }),
 // 27a 軍のエニグマに加えられたもの
 [K+'next:parts']:when(YM,(p,ctx)=>{
  const g1=vseg(ctx,p,0,.3),g2=vseg(ctx,p,.35,.6),g3=vseg(ctx,p,.65,.9);
  let s=fade(g1,box(340,220,320,170,{col:'#8aa0c4'})+label('円板 3枚',500,320,{size:46,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(g2,box(40,470,420,170,{col:HC})+label('折り返しの 板',250,570,{size:44,color:HC,anchor:'middle',weight:700}));
  s+=fade(g3,box(540,470,420,170,{col:HC})+label('差し込み板',750,570,{size:44,color:HC,anchor:'middle',weight:700}));
  s+=fade(g2,plate('＋',250,440,{size:48,anchor:'middle',color:HC}))+fade(g3,plate('＋',750,440,{size:48,anchor:'middle',color:HC}));
  return s;
 }),
 // 27b 次の疑問
 [K+'next:card']:when(YM,(p,ctx)=>{
  const g1=swin(ctx,p,0,0,.6),g2=swin(ctx,p,1,0,.6);
  let s=fuda('次の 疑問',500,160,{anchor:'middle',g:g1})+fade(g1*(1-g2*.6),label('何のため？ どう動く？',500,280,{size:46,color:C.ink,anchor:'middle',weight:700}));
  s+=finalCard(['序章3','エニグマの 中は、','どう なっている？'],g2,{y:400,size:58});
  return s;
 }),
};
chain00bDiagrams[K+'kas:count']=chain00bDiagrams[K+'kas:column'];
Object.assign(chain00bDiagrams,chain00bRest);

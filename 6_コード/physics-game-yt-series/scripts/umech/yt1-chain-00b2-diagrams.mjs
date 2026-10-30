// 技術の疑問の鎖 序章2-2（ys-chain-00b2）「同じ文字を、毎回ちがう文字にするには？」— 図。縦長の舞台 1000×920（vert-v1）。
// 共通の道具（文字の輪・棒グラフ・見方の札・声の窓）と計算・assert は yt1-chain-00bx-common.mjs。
// 3D：scripts/blender/cipher_disks.py の shot alb2-make・alb2-step（$EM_FILM_CACHE/blender）。文字は 2D でアンカーに重ねる。
import {C,seg,clamp,mix,fade,label,line,rect,dot,ring,draw,arrow,W,H,HC,cueT,vseg,swin,note,plate,finalCard,jw,ORANGE,GREEN,RED_,CYAN,fuda,
 ABC,ix,shift,vig,ALB_IN,albUnder,TEXT1,L1,ALB_ROT1,PCT_ALB_FIX,PCT_ALB_ROT,PCT_V1,CPCT1,
 wt,ws,steps,fig,letterRing,ringXY,ringMark,ringArc,RC,bars,barTop,mono,monoX,CIPH,box,cell,person,bubble} from './yt1-chain-00bx-common.mjs';
import {bclip,banchor} from './blender-clip.mjs';

const K='chain00b2-';
const YK='9世紀 バグダッド キンディー',YA='1467年 アルベルティ',YB='1553年 ベラーゾ\n（のちに ヴィジュネル暗号と 呼ばれる）',YB1='1553年 ベラーゾ';
const GU='具体例',TA='たとえ話',BR='破る側から';
const T=(p,ctx)=>cueT(p,ctx);
const after=(ctx,p,i)=>swin(ctx,p,i,0,.06);
const KC=['#ff9f43','#6adfff','#b49bff'];          // 合言葉の K・E・Y の色（第1版と同じ）
const SH=[10,4,24];

// ---------- 3D のアルベルティの円板と、重ねる文字 ----------
const AO={x:60,y:50,w:880};
function albLetters(shot,u,{gO=1,gI=1,hlO={},hlI={},o=AO}={}){
 let s='';
 for(let j=0;j<26;j++){
  if(gO>0){const a=banchor(shot,'o'+j,u,o),c=hlO[j];
   if(c)s+=fade(gO,`<circle cx="${a[0].toFixed(1)}" cy="${a[1].toFixed(1)}" r="28" fill="${c}"/>`);
   s+=fade(gO,label(ABC[j],a[0],a[1]+14,{size:40,color:c?'#0b1122':RC.navy,anchor:'middle',weight:700}));}
  if(gI>0){const b=banchor(shot,'i'+j,u,o),c=hlI[j];
   if(c)s+=fade(gI,`<circle cx="${b[0].toFixed(1)}" cy="${b[1].toFixed(1)}" r="25" fill="${c}"/>`);
   s+=fade(gI,label(ALB_IN[j],b[0],b[1]+12,{size:38,color:c?'#0b1122':RC.brown,anchor:'middle',weight:700}));}
 }
 return s;
}
const albNote=g=>fade(g,note('図は 26文字（本物は 24 の 区切り）',980,910,{anchor:'end'}));

// 1 前回の弱点
const introWeak=(p,ctx)=>{
 const g1=vseg(ctx,p,0,.3),g2=ws(ctx,p,'イツモ',{d:.4});
 let s=fade(g1,label('前回 見つかった 弱点',500,150,{size:44,color:C.dim,anchor:'middle',weight:700}));
 [0,1,2].forEach(i=>{const x=250+i*250;s+=fade(g1,cell('E',x,320,{size:64,w:110,h:120,color:HC,edge:HC}))+fade(g2,arrow(x,390,x,510,{color:HC,w:5,head:18})+cell('X',x,590,{size:64,w:110,h:120,color:CIPH,edge:CIPH}));});
 s+=fade(g2,plate('E は いつも X',500,770,{size:52,color:HC,anchor:'middle'}));
 return s;
};
// 2 アルベルティ
const albWho=(p,ctx)=>{
 const g=ws(ctx,p,'ドオグ',{d:.6});
 return fade(.35+.65*g,bclip('alb2-step',0,AO))+fade(vseg(ctx,p,0,.3),plate('アルベルティ（イタリア）',500,480,{size:48,color:C.ink,anchor:'middle'}))
  +fade(g,plate('弱点を ふさぐ 道具',500,860,{size:48,color:HC,anchor:'middle'}));
};
// 3 二枚の円板を重ねて留める。外に元の文字、内に暗号の文字
const albMake=(p,ctx,k)=>{
 const u=k?1:vseg(ctx,p,.05,.95),gO=k?ws(ctx,p,'モトノモジ',{d:.6}):0,gI=k?ws(ctx,p,'アンゴオノモジ',{d:.6}):0;
 let s=bclip('alb2-make',u,AO)+albLetters('alb2-make',u,{gO,gI});
 if(!k)s+=fade(vseg(ctx,p,.6,.9),plate('真ん中で 重ねて 留める',500,855,{size:44,color:HC,anchor:'middle'}));
 s+=fade(gO*(1-gI),plate('外：元の 文字',500,855,{size:44,color:C.ink,anchor:'middle'}));
 s+=fade(gI,plate('内：暗号の 文字（ばらばらの 順）',500,855,{size:44,color:'#e0b25a',anchor:'middle'}));
 return s;
};
// 4〜6 A の下の g → 一目盛り回す → 別の文字
const albStep=(p,ctx,k)=>{
 const t=T(p,ctx);let u=0,hlO={},hlI={};
 const gA=k===0?ws(ctx,p,'ソトノエエ',{d:.3}):1,gG=k===0?ws(ctx,p,'ジイ',{d:.3}):1;
 if(gA>0)hlO[0]=HC;
 if(k<2){if(gG>0)hlI[0]=GREEN;}
 let s='';
 if(k===2){const t0=wt(ctx,'ヒトメモリ');u=seg(t,t0,t0+1.4);const gJ=ws(ctx,p,'ベツノモジ',{d:.3});if(u<.05)hlI[0]=GREEN;if(gJ>0)hlI[25]=CYAN;
  s+=bclip('alb2-step',u,AO)+albLetters('alb2-step',u,{hlO,hlI});
  s+=fade(seg(t,t0,t0+.3)*(1-gJ),plate('内の 円板を 一目盛り 回す',500,855,{size:44,color:HC,anchor:'middle'}));
  s+=fade(gJ,plate('A の 真下 → j',500,855,{size:48,color:CYAN,anchor:'middle'}));
  return s+albNote(1);}
 s+=bclip('alb2-step',0,AO)+albLetters('alb2-step',0,{hlO,hlI});
 const a=banchor('alb2-step','o0',0,AO);
 if(k===1)s+=fade(ws(ctx,p,'ジイニ',{d:.3}),plate('A → g',500,855,{size:56,color:GREEN,anchor:'middle'}));
 else s+=fade(gG,plate('外 A の 真下に 内 g',500,855,{size:46,color:C.ink,anchor:'middle'}));
 return s+albNote(1);
};
// 7 同じ A でも、違う文字
const albTwo=(p,ctx)=>{
 const g1=vseg(ctx,p,0,.25),g2=vseg(ctx,p,.2,.45),g3=ws(ctx,p,'チガウ',{d:.4});
 let s='';
 s+=fade(g1,label('向き 0',140,300,{size:44,color:C.dim,weight:700})+cell('A',420,285,{size:60,w:110,h:120,color:HC,edge:HC})+arrow(490,285,610,285,{color:HC,w:5,head:18})+cell('g',690,285,{size:60,w:110,h:120,color:GREEN,edge:GREEN}));
 s+=fade(g2,label('一目盛り 回す',500,420,{size:40,color:C.dim,anchor:'middle',weight:700}));
 s+=fade(g2,label('向き 1',140,560,{size:44,color:C.dim,weight:700})+cell('A',420,545,{size:60,w:110,h:120,color:HC,edge:HC})+arrow(490,545,610,545,{color:HC,w:5,head:18})+cell('j',690,545,{size:60,w:110,h:120,color:CYAN,edge:CYAN}));
 s+=fade(g3,plate('同じ A でも、違う 文字',500,760,{size:52,color:HC,anchor:'middle'}));
 return s;
};
// 8〜9 名札を数分ごとに付け替える（たとえ話）
const NAMES=['さくら','たろう','ゆい'],NICKS=[['ほし','くも','うみ'],['うみ','ほし','くも'],['くも','うみ','ほし']],PCOL=['#7fb2ff','#83ecc0','#ff9ce6'];
function clockIcon(x,y,r,h){let s=`<circle cx="${x}" cy="${y}" r="${r}" fill="#f4efe0" stroke="${RC.creamEdge}" stroke-width="4"/>`;const a=h/12*Math.PI*2;s+=line(x,y,x+r*.7*Math.sin(a),y-r*.7*Math.cos(a),{color:'#d9480f',w:6})+line(x,y,x,y-r*.85,{color:RC.navy,w:4});return s;}
const tagSwap=(p,ctx)=>{
 const t=T(p,ctx),t0=wt(ctx,'スウフン'),k=Math.max(0,Math.floor((t-t0)/1.1))%3,g=ws(ctx,p,'ナフダ',{d:.4});
 let s=fade(g,clockIcon(840,170,70,t*1.5));
 s+=fade(ws(ctx,p,'スウフン',{d:.4}),plate('数分ごとに 付け替え',500,150,{size:44,color:HC,anchor:'middle'}));
 [0,1,2].forEach(i=>{const x=200+i*300;s+=person(x,560,{col:PCOL[i],tagText:t>t0?NICKS[k][i]:NICKS[0][i],tagCol:'#a33a12',g,s:1.3});
  s+=fade(g,label(NAMES[i],x,640,{size:38,color:C.dim,anchor:'middle',weight:700}));});
 s+=fade(g,note('（名札の 下は 本当の 名前）',500,720,{anchor:'middle'}));
 return s;
};
const tagMix=(p,ctx)=>{
 const t=T(p,ctx),g1=ws(ctx,p,'ナンニンモ',{d:.5}),g2=after(ctx,p,1);
 let s=person(500,520,{col:'#5a6a8a',tagText:'ほし',tagCol:'#a33a12',s:1.3});
 s+=label('「ほし」の 名札の 声',500,140,{size:44,color:C.dim,anchor:'middle',weight:700});
 [[300,250,0],[420,215,1],[560,215,2],[690,250,0],[360,320,1],[640,320,2]].forEach(([x,y,c],i)=>{s+=fade(seg(t,wt(ctx,'カゾエテモ')+i*.18,wt(ctx,'カゾエテモ')+i*.18+.3),bubble(x,y,{col:PCOL[c]}));});
 s+=fade(g1,label('さくら・たろう・ゆい の 声が 混ざる',500,700,{size:42,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(g2,plate('声の 多さで 見分けられない',500,820,{size:48,color:RED_,anchor:'middle'}));
 return s;
};
// 10〜12 破る側から：g を数える
const CL=(()=>{const out=[];for(let i=0;i<4;i++)out.push(ALB_ROT1.slice(i*28,i*28+28).join(''));return out;})();
const brkG=(p,ctx)=>{
 const g2=after(ctx,p,1),gG=ws(ctx,p,'ジイト',{d:.4});
 let s=fade(vseg(ctx,p,0,.3),label('円板を 回しながら 作った 暗号文（例）',500,140,{size:40,color:C.dim,anchor:'middle',weight:700}));
 CL.forEach((L,r)=>{const y=240+r*80;s+=fade(vseg(ctx,p,0,.4),mono(L.toLowerCase(),40,y,{size:44,cw:.66,cols:[...L].map(c=>c==='G'&&gG>0?HC:CIPH)}));
  [...L].forEach((c,i)=>{if(c==='G'){const x=40+i*44*.66+44*.33;s+=fade(gG,`<circle cx="${x.toFixed(1)}" cy="${y-14}" r="22" fill="none" stroke="${HC}" stroke-width="4"/>`);}});});
 const n=CL.join('').split('').filter(c=>c==='G').length;
 s+=fade(gG,plate(`g を 数える：${n}回（この 4行で）`,500,620,{size:46,color:HC,anchor:'middle'}));
 s+=note('文字は 小文字（内の 円板の 文字）',500,880,{anchor:'middle',g:vseg(ctx,p,0,.4)});
 return s;
};
const brkFrom=(p,ctx)=>{
 const gA=ws(ctx,p,'エエカラ',{d:.4}),gB=ws(ctx,p,'ビイカラ',{d:.4}),gE=ws(ctx,p,'イイカラ',{d:.4});
 let s=cell('g',500,200,{size:80,w:140,h:150,color:HC,edge:HC});
 [[200,'A','向き 0',gA],[500,'B','向き 1',gB],[800,'E','向き 4',gE]].forEach(([x,L,o,g])=>{s+=fade(g,arrow(x,600,mix(x,500,.75),300,{color:HC,w:5,head:18})+cell(L,x,680,{size:64,w:120,h:130,color:C.ink,edge:C.faint})+label(o,x,800,{size:40,color:C.dim,anchor:'middle',weight:700}));});
 s+=fade(gE,note('内の 円板の 向きで、g の 上の 文字が 変わる',500,890,{anchor:'middle'}));
 return s;
};
const BO={x:70,y:780,w:840,h:330,max:14};
const brkFlat=(p,ctx,j)=>{
 const t=T(p,ctx),t0=j?0:wt(ctx,'ホボ'),k=j?1:seg(t,t0-.6,t0+.6),g2=j?ws(ctx,p,'イチバン',{d:.4}):0,gX=j?ws(ctx,p,'イイトワ',{d:.4}):0;
 const v=PCT_ALB_FIX.map((x,i)=>mix(x,PCT_ALB_ROT[i],k));
 let s=label(k<.5?'円板を 回さない とき':'1文字ごとに 一目盛り 回す とき',500,140,{size:42,color:k<.5?C.dim:GREEN,anchor:'middle',weight:700});
 s+=bars(v,{...BO,col:'#ffb380'});
 const mx=Math.max(...v),im=v.indexOf(mx),[bx,by]=barTop(v,im,BO);
 s+=plate(`一番 高い：${mx.toFixed(1)}％`,500,260,{size:44,color:C.ink,anchor:'middle'});
 s+=fade(g2,plate('E？',bx,by-30,{size:52,color:HC,anchor:'middle'}))+fade(gX,`<g>${line(bx-34,by-70,bx+34,by-10,{color:RED_,w:7})+line(bx+34,by-70,bx-34,by-10,{color:RED_,w:7})}</g>`);
 s+=note('前回の 長い 英文（541文字）を 暗号に して 数えた',BO.x,880);
 return s;
};
// 13 送る側と受ける側でそろえる
const keySync=(p,ctx)=>{
 const g1=ws(ctx,p,'イツ',{d:.4}),g2=ws(ctx,p,'オクル',{d:.4});
 let s=fade(g2,person(200,560,{col:'#7fb2ff',s:1.3})+label('送る 側',200,650,{size:42,color:C.ink,anchor:'middle',weight:700})+person(800,560,{col:'#83ecc0',s:1.3})+label('受ける 側',800,650,{size:42,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(g1,letterRing({cx:500,cy:330,R:170,band:56,size:36,center:true})+plate('いつ？ どれだけ 回す？',500,140,{size:46,color:HC,anchor:'middle'}));
 s+=fade(ws(ctx,p,'ソロエ',{d:.4}),draw([[260,760],[740,760]],1,{color:HC,w:5})+plate('そろえる',500,780,{size:46,color:HC,anchor:'middle'}));
 return s;
};
// 14 合言葉の方式（ベラーゾ）
const keyBellaso=(p,ctx)=>{
 const g1=ws(ctx,p,'アイコトバ',{d:.5}),g2=after(ctx,p,1);
 let s=fade(g1,box(250,260,500,200,{col:HC})+label('合言葉（例）',500,330,{size:42,color:C.dim,anchor:'middle',weight:700})+mono('KEY',500,420,{size:80,cw:.9,cols:KC,anchor:'middle'}));
 s+=fade(g2,plate('のちに「ヴィジュネル暗号」',500,620,{size:48,color:HC,anchor:'middle'})+note('（ベラーゾが 1553年に 発表。名前は 後の人 ヴィジュネルから）',500,700,{anchor:'middle'}));
 return s;
};
// 15〜16 ずらし方の予定表（たとえ話）
function schedule(vals,{y=300,g=1,label:lab='',col=HC,gi=null}={}){
 let s=fade(g,label(lab,40,y-80,{size:40,color:C.dim,weight:700}));
 for(let i=0;i<6;i++){const x=110+i*150,gg=gi?gi(i):g;s+=fade(g,rect(x-62,y-62,124,110,{fill:'#131f38',fo:.95,stroke:C.faint,sw:2,rx:12})+label(`${i+1}文字目`,x,y-74,{size:36,color:C.dim,anchor:'middle',weight:700}));
  s+=fade(gg,label(String(vals[i]),x,y+14,{size:52,color:typeof col==='function'?col(i):col,anchor:'middle',weight:700}));}
 return s;
}
const planTable=(p,ctx)=>{
 const g=ws(ctx,p,'ヨテイヒョオ',{d:.5});
 return fade(vseg(ctx,p,0,.3),label('合言葉 ＝ ずらし方の 予定表',500,140,{size:46,color:'#ff9ce6',anchor:'middle',weight:700}))+schedule(['？','？','？','？','？','？'],{y:420,g,lab:'予定表',col:C.dim})
  +fade(g,note('何文字目を 何目盛り ずらすか が 書いてある',500,620,{anchor:'middle'}));
};
const planVs=(p,ctx)=>{
 const g1=vseg(ctx,p,0,.25),g2=after(ctx,p,1);
 return schedule([3,3,3,3,3,3],{y:290,g:g1,lab:'カエサル暗号',col:C.ink})+schedule([10,4,24,10,4,24],{y:640,g:g2,lab:'合言葉 KEY',col:i=>KC[i%3],gi:i=>seg(T(p,ctx),wt(ctx,'イチモジゴト')+i*.15,wt(ctx,'イチモジゴト')+i*.15+.3)})
  +fade(g2,note('（数は この後で 説明）',500,800,{anchor:'middle'}));
};
// 17〜20 文字 → 目盛りの数（A＝0）
const NX=j=>70+(j%13)*72,NY=j=>Math.floor(j/13)?560:300;
function numTable(gj,{hl={}}={}){
 let s='';for(let j=0;j<26;j++){const x=NX(j),y=NY(j),c=hl[j];
  if(c)s+=rect(x-32,y-56,64,150,{fill:c,fo:.18,stroke:c,sw:3,rx:10});
  s+=label(ABC[j],x,y,{size:44,color:c??C.ink,anchor:'middle',weight:700});
  s+=fade(gj(j),label(String(j),x,y+70,{size:j>=10?36:42,color:c??HC,anchor:'middle',weight:700}));}
 return s;
}
const numIntro=(p,ctx)=>{
 const g=ws(ctx,p,'メモリノカズ',{d:.5});
 return numTable(()=>0)+fade(g,plate('文字 → ずらす 目盛りの 数',500,820,{size:48,color:HC,anchor:'middle'}));
};
const numAbc=(p,ctx)=>{
 const t=T(p,ctx),t3=[wt(ctx,'ゼロ'),wt(ctx,'イチ'),wt(ctx,'ニト')],te=wt(ctx,'カゾエテ');
 return numTable(j=>j<3?seg(t,t3[j],t3[j]+.3):seg(t,te+(j-3)*.07,te+(j-3)*.07+.25))+fade(seg(t,te,te+.5),note('A から 数えて、何番目か（A は 0番目）',500,820,{anchor:'middle'}));
};
const numKey=(p,ctx)=>{
 const g1=swin(ctx,p,0,.2,.6),gK=ws(ctx,p,'ケエワ',{d:.3}),gE=ws(ctx,p,'イイワ',{d:.3}),gY=ws(ctx,p,'ワイワ',{d:.3});
 const hl={};if(g1>0&&gK<=0)hl[0]=GREEN;if(gK>0)hl[10]=KC[0];if(gE>0)hl[4]=KC[1];if(gY>0)hl[24]=KC[2];
 let s=numTable(()=>1,{hl});
 s+=fade(g1*(1-gK),plate('A を 0目盛り ずらす ＝ そのまま A',500,820,{size:44,color:GREEN,anchor:'middle'}));
 s+=fade(gK,plate('K＝10',260,820,{size:52,color:KC[0],anchor:'middle'}))+fade(gE,plate('E＝4',500,820,{size:52,color:KC[1],anchor:'middle'}))+fade(gY,plate('Y＝24',740,820,{size:52,color:KC[2],anchor:'middle'}));
 return s;
};
const numPlan=(p,ctx)=>{
 const gi=[wt(ctx,'イチモジメ'),wt(ctx,'ニモジメ'),wt(ctx,'サンモジメ'),wt(ctx,'ヨンモジメ')],t=T(p,ctx);
 const g=i=>i<3?seg(t,gi[i],gi[i]+.3):seg(t,gi[3]+(i-3)*.25,gi[3]+(i-3)*.25+.3);
 let s=label('合言葉',40,200,{size:40,color:C.dim,weight:700});
 for(let i=0;i<6;i++){const x=110+i*150;s+=label('KEY'[i%3],x,280,{size:60,color:KC[i%3],anchor:'middle',weight:700});}
 s+=schedule([10,4,24,10,4,24],{y:520,lab:'ずらす 目盛り',col:i=>KC[i%3],gi:g});
 s+=fade(seg(t,gi[3],gi[3]+.4),plate('4文字目は また 10 に 戻る（くり返し）',500,760,{size:44,color:HC,anchor:'middle'}));
 return s;
};
// 21〜24 CAT → MER（文字の輪で 1目盛りずつ）
const RG={cx:500,cy:560,R:300};
function catFig(p,ctx,k){
 const t=T(p,ctx),src=ix('CAT'[k]),n=SH[k],res=shift('CAT'[k],n);
 let times;
 if(k===0){const a=wt(ctx,'ジュウメモリ'),b=wt(ctx,'エム');times=Array.from({length:10},(_,i)=>mix(a,b-.25,i/10));}
 else if(k===1){const a=wt(ctx,'ヨンメモリ'),b=wt(ctx,'イイデス');times=Array.from({length:4},(_,i)=>mix(a,b-.25,i/4));}
 else{const a=wt(ctx,'ゼットマデ'),z=wt(ctx,'エエニ'),r0=wt(ctx,'サラニ'),r1=wt(ctx,'アアル');
  times=[...Array.from({length:6},(_,i)=>mix(a-.2,z-.5,i/6)),z-.15,...Array.from({length:17},(_,i)=>mix(r0,r1-.2,i/17))];}
 const nn=steps(t,times,.12),pos=src+nn,gR=k===0?ws(ctx,p,'エム',{d:.3}):k===1?ws(ctx,p,'イイデス',{d:.3}):ws(ctx,p,'アアル',{d:.3});
 const hl={};hl[src]=HC;if(gR>0)hl[ix(res)]=GREEN;if(k===2&&nn>6.5)hl[0]=CYAN;
 let s=letterRing({...RG,hl});
 if(nn>0||t>times[0]-.3)s+=ringArc(RG.cx,RG.cy,RG.R+62,src,pos,{color:HC,w:5})+ringMark(RG.cx,RG.cy,RG.R,pos);
 s+=plate(`${Math.min(n,Math.floor(nn+1e-6))} 目盛り`,RG.cx,RG.cy-10,{size:52,color:HC,anchor:'middle'});
 s+=fade(gR,plate(`${'CAT'[k]} → ${res}`,RG.cx,RG.cy+70,{size:56,color:GREEN,anchor:'middle'}));
 if(k===2)s+=fade(seg(t,times[6]-.1,times[6]+.3),plate('Z → A（ひと回り）',RG.cx,RG.cy+150,{size:40,color:CYAN,anchor:'middle'}));
 // 上：C A T と 合言葉
 s+=catHeader(k,[k>0?1:0,k>1?1:0,0].map((v,i)=>i<k?1:i===k?gR:0));
 return s;
}
function catHeader(k,gres){
 let s='';[...'CAT'].forEach((L,i)=>{const x=280+i*220;
  s+=label(L,x-46,120,{size:52,color:i===k?HC:C.ink,anchor:'middle',weight:700})+label(`+${SH[i]}`,x+30,120,{size:40,color:KC[i],anchor:'middle',weight:700});
  s+=fade(gres[i],label(`→ ${'MER'[i]}`,x+30,175,{size:44,color:GREEN,anchor:'middle',weight:700}));});
 return s;
}
const catMer=(p,ctx)=>{
 const g=ws(ctx,p,'エムイイアアル',{d:.5});
 let s='';
 [...'CAT'].forEach((L,i)=>{const x=250+i*250;s+=cell(L,x,260,{size:64,w:120,h:130,color:C.ink,edge:C.faint})+label(`+${SH[i]}`,x+16,430,{size:48,color:KC[i],weight:700})+arrow(x,330,x,500,{color:KC[i],w:4,head:16})+cell('MER'[i],x,580,{size:64,w:120,h:130,color:CIPH,edge:CIPH,g:Math.max(g,.0)});});
 s+=fade(g,plate('CAT → MER',500,780,{size:60,color:GREEN,anchor:'middle'}));
 s+=note('C(2)+10＝12＝M、A(0)+4＝4＝E',500,860,{anchor:'middle'})+note('T(19)+24＝43、43−26＝17＝R',500,908,{anchor:'middle'});
 return s;
};
// 25〜27 AAA → KEY
const aaaQ=(p,ctx)=>{
 const g=ws(ctx,p,'エエエエエエ',{d:.5}),g0=vseg(ctx,p,0,.15);
 let s=fade(g0*(1-g),label('暗号を 作る 側の 工夫を、敵の 目で 試す',500,360,{size:40,color:'#ff8f6b',anchor:'middle',weight:700}));[0,1,2].forEach(i=>{s+=fade(g,cell('A',250+i*250,360,{size:72,w:130,h:140,color:HC,edge:HC}));});
 s+=fade(g,plate('同じ 文字の 並び',500,560,{size:48,color:C.ink,anchor:'middle'}));
 return s;
};
const aaaKey=(p,ctx)=>{
 const gs=[ws(ctx,p,'ケエ',{d:.3}),ws(ctx,p,'ヨンメモリデ',{d:.3,end:true}),ws(ctx,p,'ワイ',{d:.3})],g2=after(ctx,p,1);
 let s='';[0,1,2].forEach(i=>{const x=250+i*250;s+=cell('A',x,240,{size:64,w:120,h:130,color:HC,edge:HC})+label(`+${SH[i]}`,x+16,410,{size:48,color:KC[i],weight:700})+fade(gs[i],arrow(x,310,x,480,{color:KC[i],w:4,head:16})+cell('KEY'[i],x,560,{size:64,w:120,h:130,color:KC[i],edge:KC[i]}));});
 s+=fade(g2,plate('同じ A が、3つの 違う 文字に',500,760,{size:50,color:HC,anchor:'middle'}));
 return s;
};
// 合言葉 KEY で暗号にした長い英文の棒（計算）。1位の文字が、どの元の文字から来たか
const V1=[...vig(TEXT1,'KEY')].filter(c=>/[A-Z]/.test(c));
const topV=PCT_V1.indexOf(Math.max(...PCT_V1));
const SRC=(()=>{const m={};V1.forEach((c,i)=>{if(ix(c)===topV){const pl=L1[i];m[pl]=(m[pl]??0)+1;}});return Object.entries(m).sort((a,b)=>b[1]-a[1]);})();
const aaaFlat=(p,ctx)=>{
 const t=T(p,ctx),k=vseg(ctx,p,.1,.45),g2=after(ctx,p,1);
 const v=CPCT1.map((x,i)=>mix(x,PCT_V1[i],k));
 let s=label(k<.5?'1つの 表で 入れ替えた とき':'合言葉 KEY で ずらした とき',500,140,{size:42,color:k<.5?C.dim:GREEN,anchor:'middle',weight:700});
 s+=bars(v,{...BO,col:'#ffb380'});
 const mx=Math.max(...v);s+=plate(`一番 高い：${mx.toFixed(1)}％`,500,260,{size:44,color:C.ink,anchor:'middle'});
 const [bx,by]=barTop(PCT_V1,topV,BO);
 s+=fade(g2,plate(`${ABC[topV]} の もと：${SRC.slice(0,3).map(([l,n])=>l).join('・')}`,bx-60,by-30,{size:40,color:HC,anchor:'middle'}));
 s+=fade(g2,note('一番 高い 文字が E から 来たとは 限らない',500,320,{anchor:'middle'}));
 s+=note('前回の 長い 英文（541文字）を 暗号に して 数えた',BO.x,880);
 return s;
};
// 28 約300年
const aaa300=(p,ctx)=>{
 const g1=swin(ctx,p,0,0,.5),g2=after(ctx,p,1),g3=ws(ctx,p,'トケナイ',{d:.4});
 let s=fade(g1*(1-g2*.6),plate('合言葉を 知らない → ずらし方の 予定が 分からない',500,160,{size:38,color:C.ink,anchor:'middle'}));
 s+=fade(g2,line(150,500,850,500,{color:C.dim,w:4})+dot(150,500,12,C.ink)+dot(850,500,12,C.ink)+label('1553年',150,570,{size:42,color:C.ink,anchor:'middle',weight:700})+label('1863年',850,570,{size:42,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(ws(ctx,p,'サンビャクネン',{d:.4}),label('約300年',500,460,{size:56,color:HC,anchor:'middle',weight:700}));
 s+=fuda('解けない 暗号',500,330,{anchor:'middle',g:g3,size:48,color:HC});
 return s;
};
// 29〜30 次の疑問
const nextGap=(p,ctx)=>{
 const g1=ws(ctx,p,'スキマ',{d:.4}),g2=after(ctx,p,1);
 let s=fade(g1,plate('小さな すき間',500,160,{size:48,color:RED_,anchor:'middle'}));
 for(let i=0;i<12;i++){const x=95+i*74;s+=fade(g2,label('KEY'[i%3],x,400,{size:56,color:KC[i%3],anchor:'middle',weight:700}));}
 for(let r=0;r<4;r++)s+=fade(g2,rect(95+r*222-36,330,214,100,{fill:'none',fo:0,stroke:HC,sw:3,rx:12}));
 s+=fade(g2,plate('短い 合言葉を くり返す',500,580,{size:50,color:HC,anchor:'middle'}));
 return s;
};
const nextCard=(p,ctx)=>{
 const g1=vseg(ctx,p,0,.3),g2=vseg(ctx,p,.4,.85);
 return fuda('次の 疑問',500,140,{anchor:'middle',g:g1})+finalCard(['序章2-3','くり返しは、なぜ','弱点に なる？'],g2,{y:330,size:60});
};

export const chain00b2Diagrams={
 [K+'intro:weak']:fig(YK,null,introWeak),
 [K+'alb:who']:fig(YA,null,albWho),
 [K+'alb:make']:fig(YA,null,(p,c)=>albMake(p,c,0)+albNote(1)),
 [K+'alb:write']:fig(YA,null,(p,c)=>albMake(p,c,1)+albNote(1)),
 [K+'alb:ag']:fig(YA,GU,(p,c)=>albStep(p,c,0)),
 [K+'alb:ag2']:fig(YA,GU,(p,c)=>albStep(p,c,1)),
 [K+'alb:step']:fig(YA,GU,(p,c)=>albStep(p,c,2)),
 [K+'alb:two']:fig(YA,GU,albTwo),
 [K+'tag:swap']:fig(YA,TA,tagSwap),
 [K+'tag:mix']:fig(YA,TA,tagMix),
 [K+'brk:g']:fig(YA,BR,brkG),
 [K+'brk:from']:fig(YA,BR,brkFrom),
 [K+'brk:flat']:fig(YA,BR,(p,c)=>brkFlat(p,c,0)),
 [K+'brk:flat2']:fig(YA,BR,(p,c)=>brkFlat(p,c,1)),
 [K+'key:sync']:fig(YA,null,keySync),
 [K+'key:bellaso']:fig(YB,null,keyBellaso),
 [K+'plan:table']:fig(YB1,TA,planTable),
 [K+'plan:vs']:fig(YB1,TA,planVs),
 [K+'num:intro']:fig(YB1,GU,numIntro),
 [K+'num:abc']:fig(YB1,GU,numAbc),
 [K+'num:key']:fig(YB1,GU,numKey),
 [K+'num:plan']:fig(YB1,GU,numPlan),
 [K+'cat:c']:fig(YB1,GU,(p,c)=>catFig(p,c,0)),
 [K+'cat:a']:fig(YB1,GU,(p,c)=>catFig(p,c,1)),
 [K+'cat:t']:fig(YB1,GU,(p,c)=>catFig(p,c,2)),
 [K+'cat:mer']:fig(YB1,GU,catMer),
 [K+'aaa:q']:fig(YB1,BR,aaaQ),
 [K+'aaa:key']:fig(YB1,BR,aaaKey),
 [K+'aaa:flat']:fig(YB1,BR,aaaFlat),
 [K+'aaa:300']:fig(YB1,BR,aaa300),
 [K+'next:gap']:fig(YB1,null,nextGap),
 [K+'next:card']:fig(YB1,null,nextCard),
};

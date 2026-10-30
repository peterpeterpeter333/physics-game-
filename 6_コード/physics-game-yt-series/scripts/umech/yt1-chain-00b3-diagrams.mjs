// 技術の疑問の鎖 序章2-3（ys-chain-00b3）「くり返しは、なぜ弱点になる？」— 図。縦長の舞台 1000×920（vert-v1）。
// 共通の道具（文字の輪・棒グラフ・見方の札・声の窓）と計算・assert は yt1-chain-00bx-common.mjs。
// 3D：scripts/blender/cipher_disks.py の shot alb2-step・wired・odo3（$EM_FILM_CACHE/blender）。文字は 2D でアンカーに重ねる。
import {C,seg,clamp,mix,fade,label,line,rect,dot,ring,draw,arrow,W,H,HC,cueT,vseg,swin,note,plate,finalCard,jw,ORANGE,GREEN,RED_,CYAN,fuda,tag,
 ABC,ix,shift,vig,ALB_IN,V2,COLS2,COLCNT2,pct,
 wt,ws,steps,fig,letterRing,ringXY,ringMark,ringArc,RC,bars,barTop,mono,monoX,CIPH,box,cell,person} from './yt1-chain-00bx-common.mjs';
import {bclip,banchor,binfo,bframes} from './blender-clip.mjs';

const K='chain00b3-';
const YC='1863年 カシスキー',YS='1918年 シェルビウス',Y23='1923年';
const GU='具体例',TA='たとえ話',BR='破る側から';
const T=(p,ctx)=>cueT(p,ctx);
const after=(ctx,p,i)=>swin(ctx,p,i,0,.06);
const KC=['#ff9f43','#6adfff','#b49bff'];
const SH=[10,4,24];
const VP='THECATSAWTHEDOG',VC=vig(VP,'KEY');
if(VC!=='DLCMERCEUDLCNSE')throw Error('chain00b3: DLCMERCEUDLCNSE '+VC);

// ---------- 暗号文の 15文字の箱 ----------
const BX=i=>560+(i-7)*58;
function cipherBoxes(y,{on=()=>1,col=i=>C.faint,txt=VC,tcol=()=>CIPH,size=44}={}){
 let s='';[...txt].forEach((L,i)=>{const g=on(i);if(g<=0)return;const c=col(i);
  s+=fade(g,rect(BX(i)-27,y-46,54,64,{fill:c===C.faint?'#131f38':c,fo:c===C.faint?.9:.25,stroke:c,sw:2,rx:8})+label(L,BX(i),y,{size,color:tcol(i),anchor:'middle',weight:700}));});
 return s;
}
const keyRow=(y,{on=()=>1}={})=>{let s='';for(let i=0;i<15;i++)s+=fade(on(i),label('KEY'[i%3],BX(i),y,{size:40,color:KC[i%3],anchor:'middle',weight:700}));return s;};

// 1 合言葉 KEY のくり返し
const introRep=(p,ctx)=>{
 const g1=vseg(ctx,p,0,.2),g2=ws(ctx,p,'サンモジ',{d:.6}),g3=ws(ctx,p,'クリカエシニ',{d:.5});
 let s=fade(g1,label('合言葉',40,220,{size:40,color:C.dim,weight:700}));
 for(let i=0;i<12;i++)s+=fade(g1,label('KEY'[i%3],95+i*74,320,{size:60,color:KC[i%3],anchor:'middle',weight:700}));
 for(let r=0;r<4;r++)s+=fade(g2,rect(95+r*222-36,250,214,100,{fill:'none',fo:0,stroke:C.dim,sw:3,rx:12})+label(`${r*3+1}〜${r*3+3}`,95+r*222+70,400,{size:36,color:C.dim,anchor:'middle',weight:700}));
 s+=fade(g2,plate('3文字ごとに 同じ ずらし方',500,520,{size:46,color:C.ink,anchor:'middle'}));
 s+=fade(g3,plate('「くり返し」に 目を 付けた',500,680,{size:52,color:HC,anchor:'middle'}));
 return s;
};
// 2〜7 3文字おきに拾う
const COLY=[[0,3,6,9,12],[1,4,7,10,13],[2,5,8,11,14]];
function colFig(p,ctx,k){
 const t=T(p,ctx);
 let pick=[];   // 0..2 列を見せる
 let s=label('暗号文（合言葉 KEY で 作った 例）',500,130,{size:38,color:C.dim,anchor:'middle',weight:700});
 if(k===0){
  const tt=[wt(ctx,'イチモジメ'),wt(ctx,'ヨンモジメ'),wt(ctx,'ナナモジメ'),wt(ctx,'サンモジ')];
  const g=i=>{const n=COLY[0].indexOf(i);if(n<0)return 0;return n<3?seg(t,tt[n],tt[n]+.3):seg(t,tt[3]+(n-3)*.3,tt[3]+(n-3)*.3+.3);};
  s+=cipherBoxes(260,{col:i=>g(i)>.5?KC[0]:C.faint});
  [0,3,6,9,12].forEach((i,n)=>{s+=fade(g(i),label(`${i+1}`,BX(i),340,{size:36,color:KC[0],anchor:'middle',weight:700}));});
  return s;
 }
 const cols=k===1||k===2?[0]:k===3?[0,1]:[0,1,2];
 const colOf=i=>i%3;
 s+=cipherBoxes(260,{col:i=>cols.includes(colOf(i))?KC[colOf(i)]:C.faint});
 if(k===1){const g=ws(ctx,p,'ケエデ',{d:.4}),g10=ws(ctx,p,'ジュウメモリ',{d:.4});
  s+=keyRow(190,{on:i=>colOf(i)===0?g:0});
  s+=fade(g10,plate('どれも K ＝ 10目盛り',500,440,{size:48,color:KC[0],anchor:'middle'}));}
 if(k===2){s+=keyRow(190,{on:i=>colOf(i)===0?1:0});
  const g=ws(ctx,p,'カエサル',{d:.5});
  s+=label('K の 列',150,500,{size:42,color:KC[0],anchor:'middle',weight:700});
  COLY[0].forEach((i,n)=>{s+=cell(VC[i],290+n*100,490,{size:48,w:80,h:90,color:CIPH,edge:KC[0]});});
  s+=fade(g,fuda('＝ カエサル暗号（全部 10目盛り）',500,660,{anchor:'middle',color:KC[0],size:44}));}
 if(k>=3){
  s+=keyRow(190,{on:i=>cols.includes(colOf(i))?1:0});
  const gE=k===3?ws(ctx,p,'イイデ',{d:.4}):1,gY=k===4?ws(ctx,p,'ワイデ',{d:.4}):k>4?1:0,g3=k===5?ws(ctx,p,'ミッツノ',{d:.5}):0;
  [0,1,2].forEach(c=>{const y=480+c*120,g=c===0?1:c===1?gE:gY;if(g<=0)return;
   s+=fade(g,label(`${'KEY'[c]} の 列`,140,y+14,{size:42,color:KC[c],anchor:'middle',weight:700})+label(`${SH[c]}目盛り`,860,y+14,{size:40,color:KC[c],anchor:'middle',weight:700}));
   COLY[c].forEach((i,n)=>{s+=fade(g,cell(VC[i],290+n*100,y,{size:48,w:80,h:90,color:CIPH,edge:KC[c]}));});});
  if(k===5)s+=fade(g3,plate('3つの カエサル暗号',500,860,{size:50,color:HC,anchor:'middle'}));
 }
 return s;
}
// 8 列ごとに数える（長い暗号文の K の列、数えた棒）
const CP=pct(COLCNT2[0]),TOP=CP.indexOf(Math.max(...CP));
if(ABC[TOP]!=='O')throw Error('chain00b3: K の列の 1位が O でない');
const BO={x:70,y:700,w:840,h:330,max:16};
const colBars=(p,ctx)=>{
 const gr=swin(ctx,p,0,.1,1),gO=ws(ctx,p,'イチバン',{d:.4}),gC=ws(ctx,p,'ナンメモリ',{d:.4});
 let s=label('K の 列（1・4・7…文字目）の 文字の 割合',500,130,{size:38,color:C.dim,anchor:'middle',weight:700});
 s+=bars(CP,{...BO,grow:gr,hl:gO>0?{[TOP]:HC}:{},col:KC[0]});
 const [bx,by]=barTop(CP,TOP,BO);
 s+=fade(gO,plate('O ＝ E？',bx,by-30,{size:50,color:HC,anchor:'middle'}));
 s+=fade(gC,box(120,770,760,110,{col:GREEN})+label('O(14) − E(4) ＝ 10目盛り → K',500,842,{size:46,color:GREEN,anchor:'middle',weight:700}));
 s+=fade(gr,note(`長い 暗号文 ${V2.length}文字の うち ${COLS2[0].length}文字（数えた）`,500,200,{anchor:'middle'}));
 return s;
};
// 9 違和感
const lenQ=(p,ctx)=>{
 const g=vseg(ctx,p,.1,.5);
 let s=fuda('違和感',500,140,{anchor:'middle',size:44,color:ORANGE});
 s+=fade(g,label('合言葉は 何文字？',500,330,{size:56,color:C.ink,anchor:'middle',weight:700}));
 for(let i=0;i<5;i++)s+=fade(g,cell('？',220+i*140,500,{size:56,w:100,h:110,color:HC,edge:C.faint}));
 s+=fade(vseg(ctx,p,.5,.9),note('敵は 合言葉を 知らない',500,680,{anchor:'middle'}));
 return s;
};
// 10〜13 電球の廊下（たとえ話）
const BC=['#ff4b3e','#3f8cff','#3fd07a'],BN=['赤','青','緑'];
const BXp=i=>70+i*86;
function bulbs(y,{n=11,g=1,hl={},on=null}={}){
 let s='';for(let i=0;i<n;i++){const c=BC[i%3],gi=on?on(i):g;
  s+=fade(gi,line(BXp(i),y-80,BXp(i),y-38,{color:C.faint,w:3})+`<circle cx="${BXp(i)}" cy="${y}" r="${hl[i]?30:26}" fill="${c}" fill-opacity="${hl[i]?1:.85}" stroke="${hl[i]?HC:'none'}" stroke-width="4"/>`);}
 return s+fade(g,line(30,y-80,970,y-80,{color:C.dim,w:4}));
}
const hat=(x,y,g=1)=>fade(g,`<path d="M${x-40} ${y} L${x+40} ${y} L${x+28} ${y-12} L${x+22} ${y-46} Q${x} ${y-58} ${x-22} ${y-46} L${x-28} ${y-12} Z" fill="#c9a45c" stroke="#7a5634" stroke-width="3"/>`);
const glove=(x,y,g=1)=>fade(g,`<path d="M${x-24} ${y} L${x-24} ${y-40} Q${x-30} ${y-62} ${x-16} ${y-60} L${x-14} ${y-46} L${x-10} ${y-70} Q${x} ${y-78} ${x+4} ${y-66} L${x+6} ${y-46} L${x+12} ${y-64} Q${x+22} ${y-66} ${x+20} ${y-48} L${x+22} ${y-34} Q${x+34} ${y-46} ${x+34} ${y-30} L${x+20} ${y} Z" fill="#83ecc0" stroke="#2f7a5a" stroke-width="3"/>`);
const HAT=1*3,GLV=3*3;        // 帽子は 4番目の電球（赤）、手袋は 10番目の電球（赤）
const bulbHall=(p,ctx)=>{
 const t=T(p,ctx),t0=wt(ctx,'アカ');
 let s=bulbs(420,{on:i=>seg(t,t0+i*.12,t0+i*.12+.3)});
 [0,1,2].forEach(c=>{s+=fade(ws(ctx,p,['アカ','アオ','ミドリ'][c],{d:.3}),label(BN[c],BXp(c),520,{size:40,color:BC[c],anchor:'middle',weight:700}));});
 s+=fade(ws(ctx,p,'クリカエシ',{d:.4}),plate('赤 → 青 → 緑 → 赤 → … の くり返し',500,640,{size:42,color:C.ink,anchor:'middle'}));
 s+=fade(ws(ctx,p,'ロオカ',{d:.4}),label('廊下',500,240,{size:42,color:C.dim,anchor:'middle',weight:700}));
 return s;
};
const bulbDrop=(p,ctx)=>{
 const gH=ws(ctx,p,'ボオシ',{d:.4}),gG=ws(ctx,p,'テブクロ',{d:.4});
 let s=bulbs(420,{hl:{[HAT]:gH>0,[GLV]:gG>0}});
 s+=hat(BXp(HAT),560,gH)+glove(BXp(GLV),570,gG);
 s+=fade(gH,label('帽子',BXp(HAT),620,{size:40,color:C.ink,anchor:'middle',weight:700}))+fade(gG,label('手袋',BXp(GLV),620,{size:40,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(gG,plate('どちらも 赤い 電球の 下',500,760,{size:46,color:BC[0],anchor:'middle'}));
 return s;
};
const bulbCount=(p,ctx)=>{
 const t=T(p,ctx),t0=wt(ctx,'デンキュウノ'),t1=wt(ctx,'サンノ'),n=steps(t,Array.from({length:6},(_,i)=>mix(t0,t1,i/6)),.25);
 let s=bulbs(420,{hl:{[HAT]:1,[GLV]:1}})+hat(BXp(HAT),560)+glove(BXp(GLV),570);
 for(let k=1;k<=Math.floor(n+1e-6);k++){const x=BXp(HAT+k);s+=label(String(k),x,330,{size:40,color:k%3===0?HC:C.ink,anchor:'middle',weight:700});}
 if(n>0){const x=mix(BXp(HAT),BXp(GLV),n/6);s+=`<circle cx="${x.toFixed(1)}" cy="420" r="38" fill="none" stroke="#e8590c" stroke-width="6"/>`;}
 s+=fade(ws(ctx,p,'サンノバイスウ',{d:.4}),plate('6 ＝ 3 × 2（3の 倍数）',500,720,{size:50,color:HC,anchor:'middle'}));
 s+=fade(after(ctx,p,1),note('赤 → 青 → 緑 で 3つ進むと、また 赤',500,820,{anchor:'middle'}));
 return s;
};
const bulbMap=(p,ctx)=>{
 const g1=swin(ctx,p,0,.1,.6),g2=after(ctx,p,1);
 let s=bulbs(260,{n:11,g:1,hl:{[HAT]:1,[GLV]:1}})+hat(BXp(HAT),380)+glove(BXp(GLV),390);
 for(let i=0;i<11;i++)s+=fade(g1,label('KEY'[i%3],BXp(i),540,{size:48,color:KC[i%3],anchor:'middle',weight:700}));
 s+=fade(g1,label('電球の 色 ＝ 合言葉の 位置',500,620,{size:40,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(g2,label('帽子・手袋 ＝ 元の 文の 同じ 言葉',500,720,{size:40,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(ws(ctx,p,'オナジナラビ',{d:.4}),plate('同じ 位置に 重なった ときだけ、同じ 並び',500,840,{size:40,color:HC,anchor:'middle'}));
 return s;
};
// 14〜16 THE CAT SAW THE DOG
function dlcFig(p,ctx,k){
 const t=T(p,ctx);
 const gK=k===0?ws(ctx,p,'ケエイイワイ',{d:.6}):1;
 let s=label('元',12,262,{size:36,color:C.dim,weight:700})+label('合言葉',12,362,{size:36,color:C.dim,weight:700})+label('暗号',12,472,{size:36,color:C.dim,weight:700});
 const the=i=>(i<3||(i>=9&&i<12));
 s+=cipherBoxes(250,{txt:VP,tcol:i=>k>=1&&the(i)?HC:C.ink,col:i=>k>=1&&the(i)?HC:C.faint});
 s+=keyRow(350,{on:()=>gK});
 if(k>=1){
  const g1=k===1?ws(ctx,p,'ディイエルスィイ',{d:.4}):1,g2=k===1?ws(ctx,p,'ディイエルスィイ',{occ:1,d:.4}):1;
  s+=cipherBoxes(460,{on:i=>i<3?g1:(i>=9&&i<12)?g2:(k===2?.45:0),col:i=>the(i)?HC:C.faint});
  if(k===1){s+=fade(ws(ctx,p,'ヒトツメ',{d:.3}),plate('1つ目の THE',BX(1),600,{size:40,color:HC,anchor:'middle'}))+fade(ws(ctx,p,'フタツメ',{d:.3}),plate('2つ目の THE',BX(10),600,{size:40,color:HC,anchor:'middle'}));}
 }
 if(k===2){
  const t0=wt(ctx,'アイダ'),t1=wt(ctx,'キュウモジ'),n=steps(t,Array.from({length:9},(_,i)=>mix(t0,t1+.3,i/9)),.12);
  for(let j=1;j<=Math.floor(n+1e-6);j++)s+=label(String(j),BX(j),540,{size:36,color:HC,anchor:'middle',weight:700});
  s+=`<circle cx="${mix(BX(0),BX(9),n/9).toFixed(1)}" cy="460" r="38" fill="none" stroke="#e8590c" stroke-width="6"/>`;
  const gs=[ws(ctx,p,'イチ',{d:.3}),ws(ctx,p,'サン',{d:.3,lag:0}),ws(ctx,p,'キュウノ',{d:.3})];
  s+=fade(ws(ctx,p,'キュウモジ',{d:.3}),plate('間は 9文字',500,640,{size:48,color:HC,anchor:'middle'}));
  s+=fade(ws(ctx,p,'ワリキル',{d:.3}),label('9 を 割り切る 数：',90,760,{size:44,color:C.ink,weight:700}));
  ['1（9÷1＝9）','3（9÷3＝3）','9（9÷9＝1）'].forEach((q,i)=>{s+=fade(gs[i],label(q,90+i*290,850,{size:40,color:i===1?HC:C.ink,weight:700}));});
 }
 return s;
}
// 17〜19 破る側から：同じ並びがいくつも → 公約数 3
const REP=['XFO','DLC','RRI','YXH'],RCOL=['#ffcf67','#6adfff','#ff9ce6','#83ecc0'];
const LINES=[0,1,2,3].map(r=>V2.slice(r*30,r*30+30).join(''));
const PLAINC='#8a97b0';
const REPCNT=REP.map(t=>{let n=0;const s=V2.join('');for(let i=0;i+3<=s.length;i++)if(s.slice(i,i+3)===t)n++;return n;});
const gcdMany=(p,ctx)=>{
 const g1=vseg(ctx,p,0,.3),g2=after(ctx,p,1),gN=ws(ctx,p,'イクツモ',{d:.5});
 let s=fade(g1,label(`長い 暗号文（${V2.length}文字）の 始め`,500,130,{size:38,color:C.dim,anchor:'middle',weight:700}));
 const all=V2.join('');
 LINES.forEach((L,r)=>{const y=230+r*80,x0=40,cw=.66,sz=44;let cols=[...L].map(()=>PLAINC);
  for(let i=0;i<L.length;i++){const gi=r*30+i;REP.forEach((tg,q)=>{for(let d=0;d<3;d++){const st=gi-d;if(st>=0&&all.slice(st,st+3)===tg&&gN>0)cols[i]=RCOL[q];}});}
  s+=fade(g1,mono(L,x0,y,{size:sz,cw,cols}));});
 s+=fade(gN,label('同じ 並び（全体で 数えた 回数）',500,620,{size:40,color:C.ink,anchor:'middle',weight:700}));
 REP.forEach((tg,q)=>{s+=fade(gN,label(`${tg} ${REPCNT[q]}回`,140+q*240,700,{size:42,color:RCOL[q],anchor:'middle',weight:700}));});
 return s;
};
const gcdThree=(p,ctx)=>{
 const gs=[ws(ctx,p,'キュウ',{d:.3}),ws(ctx,p,'ジュウゴ',{d:.3}),ws(ctx,p,'ニジュウイチ',{d:.3})],g3=ws(ctx,p,'サンデス',{d:.4});
 let s=label('同じ 並びの 間隔（例）',500,140,{size:40,color:C.dim,anchor:'middle',weight:700});
 [['9','3 × 3'],['15','3 × 5'],['21','3 × 7']].forEach(([a,b],i)=>{const y=280+i*130;s+=fade(gs[i],label(a,300,y,{size:64,color:C.ink,anchor:'end',weight:700})+label('＝',380,y,{size:56,color:C.dim,anchor:'middle',weight:700})+label(b,440,y,{size:64,color:C.ink,weight:700}));
  s+=fade(g3,rect(432,y-58,58,74,{fill:'none',fo:0,stroke:HC,sw:4,rx:10}));});
 s+=fade(g3,box(150,700,700,130,{col:HC})+label('どれも 割り切る 数：3',500,785,{size:52,color:HC,anchor:'middle',weight:700}));
 s+=fade(g3,note('（1 は どの 数も 割り切るので 除く）',500,880,{anchor:'middle'}));
 return s;
};
const SB={w:270,h:200,y:640,max:20};
const gcdSolve=(p,ctx)=>{
 const g1=vseg(ctx,p,0,.3),g2=after(ctx,p,1);
 let s=fade(g1,plate('合言葉は 3文字',500,150,{size:56,color:HC,anchor:'middle'}));
 [0,1,2].forEach(c=>{const P=pct(COLCNT2[c]),top=P.indexOf(Math.max(...P)),x=40+c*320,gc=seg(T(p,ctx),wt(ctx,'ヒトツズツ')+c*.5,wt(ctx,'ヒトツズツ')+c*.5+.4);
  s+=fade(g2,label(`${c+1}つ目の 列`,x+135,300,{size:38,color:KC[c],anchor:'middle',weight:700}));
  s+=fade(g2,bars(P,{x,y:SB.y,w:SB.w,h:SB.h,max:SB.max,col:KC[c],lab:ABC.split('').map((L,i)=>i===top?L:''),lsize:36,hl:{[top]:HC}}));
  s+=fade(gc,label(`${ABC[top]}−E ＝ ${(top-4+26)%26}`,x+135,760,{size:40,color:C.ink,anchor:'middle',weight:700})+label(`→ ${'KEY'[c]}`,x+135,830,{size:48,color:KC[c],anchor:'middle',weight:700}));});
 return s;
};
// 20〜22 弱点・飛躍・人には無理
const weakShort=(p,ctx)=>{
 const g1=vseg(ctx,p,0,.25),g2=after(ctx,p,1);
 let s=fade(g1,fuda('弱点',500,140,{anchor:'middle',text:'くり返し',color:RED_,size:46}));
 for(let i=0;i<12;i++)s+=fade(g2,label('KEY'[i%3],95+i*74,330,{size:56,color:KC[i%3],anchor:'middle',weight:700}));
 for(let r=0;r<4;r++)s+=fade(g2,rect(95+r*222-36,262,214,96,{fill:'none',fo:0,stroke:HC,sw:3,rx:12}));
 s+=fade(g2,plate('短い 合言葉 → 同じ ずらし方が 何度も 戻る',500,500,{size:38,color:C.ink,anchor:'middle'}));
 s+=fade(ws(ctx,p,'ミツカリ',{d:.4}),plate('同じ 並びが 見つかりやすい',500,640,{size:48,color:HC,anchor:'middle'}));
 return s;
};
const weakLong=(p,ctx)=>{
 const g1=vseg(ctx,p,0,.3),g2=after(ctx,p,1);
 let s=fuda('考えの 飛躍',500,140,{anchor:'middle',color:'#ffb36b',size:44});
 s+=fade(g1,label('知らせ',60,330,{size:40,color:C.dim,weight:700})+rect(220,295,420,50,{fill:'#8aa0c4',fo:.6,stroke:'none',rx:8}));
 s+=fade(g1,label('合言葉',60,450,{size:40,color:C.dim,weight:700})+rect(220,415,740,50,{fill:HC,fo:.6,stroke:'none',rx:8}));
 s+=fade(g1,label('知らせより 長い',590,530,{size:40,color:HC,anchor:'middle',weight:700}));
 s+=fade(g2,plate('くり返しが 一度も 来ない',500,680,{size:48,color:GREEN,anchor:'middle'}));
 return s;
};
const weakHand=(p,ctx)=>{
 const g1=vseg(ctx,p,0,.3),g2=after(ctx,p,1);
 let s=person(260,640,{col:'#7fb2ff',s:1.5,g:g1});
 s+=fade(g1,`<rect x="440" y="250" width="460" height="480" rx="10" fill="#e8dcc0" stroke="#b9a57a" stroke-width="4"/>`);
 for(let r=0;r<9;r++)s+=fade(g1,mono('QXVBRLMWPZKETHGA'.slice(r%5,r%5+12),470,310+r*48,{size:36,cw:.62,color:'#5e4128'}));
 s+=fade(g1,label('何千文字の 合言葉',670,790,{size:40,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(ws(ctx,p,'ムリ',{d:.4}),plate('人には 無理',260,290,{size:48,color:RED_,anchor:'middle'}));
 s+=fade(g2,plate('間違いも 起きる',260,370,{size:44,color:RED_,anchor:'middle'}));
 return s;
};
// 23 シェルビウス
const schWho=(p,ctx)=>{
 const g1=vseg(ctx,p,0,.3),g2=ws(ctx,p,'キカイニ',{d:.5});
 let s=fade(g1,plate('シェルビウス（ドイツ）',500,200,{size:50,color:C.ink,anchor:'middle'}));
 s+=fade(g1,box(100,330,330,200,{col:'#8aa0c4'})+label('計算',265,450,{size:56,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(g2,arrow(450,430,550,430,{color:HC,w:6,head:22})+box(570,330,330,200,{col:HC})+label('機械に',735,450,{size:56,color:HC,anchor:'middle',weight:700}));
 return s;
};
// 24〜25 アルベルティの円板 → 配線入りの円板（3D）
const AO={x:60,y:50,w:880};
const wireAlb=(p,ctx)=>{
 const g=vseg(ctx,p,0,.3);
 let s=fade(g,bclip('alb2-step',0,AO));
 for(let j=0;j<26;j++){const a=banchor('alb2-step','o'+j,0,AO),b=banchor('alb2-step','i'+j,0,AO);
  s+=fade(g,label(ABC[j],a[0],a[1]+14,{size:40,color:RC.navy,anchor:'middle',weight:700})+label(ALB_IN[j],b[0],b[1]+12,{size:38,color:RC.brown,anchor:'middle',weight:700}));}
 s+=fade(g,plate('アルベルティの 円板（序章2-2）',500,860,{size:44,color:C.ink,anchor:'middle'}));
 return s;
};
const WO={x:0,y:90,w:1000};
function keyIcon(x,y,k,g=1){
 const d=14*k;
 return fade(g,rect(x-70,y+40,140,30,{fill:'#5f7398',fo:1,stroke:'none',rx:6})+`<ellipse cx="${x}" cy="${y+d+8}" rx="62" ry="18" fill="#8f8a7e"/>`+`<ellipse cx="${x}" cy="${y+d}" rx="62" ry="18" fill="#e8e2cf" stroke="#8a7a55" stroke-width="3"/>`+label('キー',x,y-40,{size:38,color:C.ink,anchor:'middle',weight:700}));
}
const wireStep=(p,ctx)=>{
 const t=T(p,ctx),info=binfo('wired'),n=bframes('wired');
 const ta=wt(ctx,'ハイセンオ'),tk=wt(ctx,'キイオ'),tm=wt(ctx,'ヒトメモリ'),te=wt(ctx,'ジドオデ',0,{end:true});
 const u=t<tk?.3*seg(t,ta-.8,ta+.6):t<tm?mix(.3,.6,seg(t,tk,tm)):mix(.6,.92,seg(t,tm,te+.6));
 const i=Math.round(clamp(u)*(n-1)),turn=info.turn[i],kp=info.key[i];
 let s=bclip('wired',u,WO);
 // 縁の文字（円板と いっしょに 回る）と、上の 動かない 印
 const gL=seg(u,.28,.34);
 for(let j=0;j<26;j++){const a=banchor('wired','r'+j,u,WO);const top=Math.abs(((j-turn)%26+26)%26)<.5;
  s+=fade(gL,label(ABC[j],a[0],a[1]+13,{size:36,color:top?HC:'#c4cde0',anchor:'middle',weight:700}));}
 s+=keyIcon(880,640,kp,seg(u,.3,.36));
 s+=fade(seg(u,.12,.3)*(1-seg(u,.32,.36)),plate('中に 配線（26本）',500,860,{size:44,color:HC,anchor:'middle'}));
 const nT=Math.round(turn);
 s+=fade(seg(u,.36,.42),plate(`キーを 押すたびに 一目盛り（${nT}目盛り）`,500,860,{size:42,color:HC,anchor:'middle'}));
 s+=fade(seg(u,.3,.36),note('キーは 図のための 形',980,910,{anchor:'end'}));
 return s;
};
// 26 円板1枚は 26目盛りで元に戻る
const wire26=(p,ctx)=>{
 const t=T(p,ctx),t0=wt(ctx,'ニジュウロクメモリ'),t1=wt(ctx,'モトノ'),n=26*seg(t,t0,t1+.3);
 const c={cx:500,cy:440,R:270};
 let s=`<g transform="rotate(${(-n*360/26).toFixed(2)} ${c.cx} ${c.cy})">`+letterRing({...c,band:66,size:38,hl:{0:HC},center:false})+'</g>'+`<circle cx="${c.cx}" cy="${c.cy}" r="10" fill="${RC.goldEdge}"/>`;
 s+=`<polygon points="${c.cx},${c.cy-c.R-44} ${c.cx-18},${c.cy-c.R-74} ${c.cx+18},${c.cy-c.R-74}" fill="${HC}"/>`;
 s+=plate(`${Math.floor(n+1e-6)} 目盛り`,c.cx,c.cy+16,{size:52,color:HC,anchor:'middle'});
 s+=fade(ws(ctx,p,'モトノ',{d:.4}),plate('26目盛りで 元の 向き',500,810,{size:44,color:GREEN,anchor:'middle'}));
 s+=fade(after(ctx,p,1),plate('＝ 合言葉 26文字',500,880,{size:48,color:HC,anchor:'middle'}));
 return s;
};
// 27〜28 距離計（たとえ話）
function odoDigits(ds,{y=420,hl=-1,g=1,roll=null}={}){
 let s='';ds.forEach((d,i)=>{const x=200+i*150;s+=fade(g,rect(x-60,y-90,120,150,{fill:'#0b1122',fo:1,stroke:i===hl?HC:'#8aa0c4',sw:i===hl?5:3,rx:12})+label(String(d),x,y+22,{size:96,color:i===hl?HC:'#edf4ff',anchor:'middle',weight:700}));});
 return s;
}
const odoCar=(p,ctx)=>{
 const g=ws(ctx,p,'スウジ',{d:.5});
 let s=fade(g,box(100,240,800,300,{col:'#8aa0c4'}))+odoDigits([0,1,2,3,8],{y:420,g});
 s+=fade(g,label('km',870,430,{size:40,color:C.dim,anchor:'middle',weight:700}));
 s+=fade(g,label('車の 走った 距離',500,640,{size:44,color:C.ink,anchor:'middle',weight:700}));
 return s;
};
const odoCarry=(p,ctx)=>{
 const t=T(p,ctx),t9=wt(ctx,'キュウカラ'),t0=wt(ctx,'ゼロニ'),tn=wt(ctx,'ススミマス');
 const r=t<t9?8:t<t0?9:0,m=t<tn?3:4;
 let s=box(100,240,800,300,{col:'#8aa0c4'})+odoDigits([0,1,2,m,r],{y:420,hl:t>t0?3:4});
 s+=label('km',870,430,{size:40,color:C.dim,anchor:'middle',weight:700});
 s+=fade(seg(t,t0,t0+.3),plate('9 → 0',800,640,{size:48,color:HC,anchor:'middle'}));
 s+=fade(seg(t,tn,tn+.3),plate('隣が 一つ 進む：3 → 4',380,640,{size:44,color:GREEN,anchor:'middle'}));
 return s;
};
// 29〜31 3枚の円板が距離計のように（3D）
const OO={x:0,y:70,w:1000};
function odoFig(u,{note1=''}={}){
 const info=binfo('odo3'),n=bframes('odo3'),i=Math.round(clamp(u)*(n-1)),win=info.win[i];
 let s=bclip('odo3',u,OO);
 ['L','M','R'].forEach((r,k)=>{const b=banchor('odo3','bot'+r,u,OO);s+=rect(b[0]-46,b[1]-12,92,80,{fill:'#e8e2cf',fo:.95,stroke:'#8aa0c4',sw:3,rx:10})+label(win[k],b[0],b[1]+50,{size:52,color:'#1c2a44',anchor:'middle',weight:700})+label(['左','真ん中','右'][k],b[0],b[1]+118,{size:38,color:C.dim,anchor:'middle',weight:700});});
 return s;
}
const FA=(4*24-1)/179,FB=(4*24+12)/179;
const odo3Mid=(p,ctx)=>{
 const t=T(p,ctx),t0=wt(ctx,'ミギノ'),t1=wt(ctx,'ヒトメモリ',0,{end:true}),u=FA*seg(t,t0,t1+.4);
 let s=odoFig(u);
 s+=fade(seg(t,t0,t0+.3),plate('右が Z → A に 戻ると、真ん中が 一目盛り',500,140,{size:38,color:HC,anchor:'middle'}));
 s+=fade(seg(t,t0,t0+.3),note('（右の ひと回りの 最後の 4目盛りを 見せた）',500,195,{anchor:'middle'}));
 return s;
};
const odo3Left=(p,ctx)=>{
 const t=T(p,ctx),t0=vseg(ctx,p,0,.08),u=mix(FA,1,vseg(ctx,p,.05,.92));
 const info=binfo('odo3'),win=info.win;
 let s=odoFig(u);
 const gap=u>FA+.01&&u<FB+.02;
 const idx=w=>ix(w[0])*676+ix(w[1])*26+ix(w[2]);
 const ff=idx(win[4*24+12])-idx(win[4*24-1]);
 s+=fade(gap||u>=FB?1:0,note(`（早送り：${ff}回 押した 後）`,500,195,{anchor:'middle'}));
 s+=fade(seg(u,FB,FB+.05),plate('真ん中が Z → A に 戻ると、左が 一目盛り',500,140,{size:38,color:HC,anchor:'middle'}));
 return s;
};
const odo3Count=(p,ctx)=>{
 const gs=[ws(ctx,p,'ニジュウロク',{d:.3}),ws(ctx,p,'ニジュウロク',{occ:1,d:.3}),ws(ctx,p,'ニジュウロク',{occ:2,d:.3})],gR=ws(ctx,p,'イチマン',{d:.4});
 let s=fade(.6,bclip('odo3',1,{x:200,y:60,w:600}));
 s+=label('左',180,640,{size:40,color:C.dim,anchor:'middle',weight:700})+label('真ん中',500,640,{size:40,color:C.dim,anchor:'middle',weight:700})+label('右',820,640,{size:40,color:C.dim,anchor:'middle',weight:700});
 ['26','× 26','× 26'].forEach((q,i)=>{s+=fade(gs[i],label(q,[180,500,820][i],720,{size:64,color:C.ink,anchor:'middle',weight:700}));});
 s+=fade(gR,label('＝ 17576 通りの 向き',500,820,{size:60,color:HC,anchor:'middle',weight:700}));
 s+=fade(gR,note('本物の エニグマは 少し 違う 回り方（序章3）',500,900,{anchor:'middle'}));
 return s;
};
// 32〜34 破る側から：知らせは数百文字
const tapeKey=(p,ctx)=>{
 const g=ws(ctx,p,'イチマン',{d:.5});
 let s=fade(vseg(ctx,p,0,.3),label('3枚の 円板の 合言葉',500,200,{size:44,color:C.dim,anchor:'middle',weight:700}));
 s+=fade(g,plate('合言葉の 長さ ＝ 17576文字',500,400,{size:56,color:HC,anchor:'middle'}));
 return s;
};
const tapeMsg=(p,ctx,k)=>{
 const g1=k?1:ws(ctx,p,'スウヒャクモジ',{d:.4}),g2=k?1:after(ctx,p,1);
 const L=860,msg=300/17576*L;
 let s=label('合言葉（17576文字）',70,250,{size:40,color:HC,weight:700})+rect(70,280,L,60,{fill:HC,fo:.55,stroke:'none',rx:8});
 for(let q=1;q<10;q++)s+=line(70+q*L/10,280,70+q*L/10,340,{color:'#0b1122',w:2,opacity:.5});
 s+=fade(g1,label('知らせ（約300文字）',70,470,{size:40,color:C.ink,weight:700})+rect(70,500,Math.max(msg,12),60,{fill:'#8aa0c4',fo:.9,stroke:'none',rx:4})+arrow(140,600,85,565,{color:C.ink,w:4,head:14})+label('ここだけ',150,630,{size:38,color:C.ink,weight:700}));
 s+=fade(g2,plate('くり返しが 現れる 前に、知らせが 終わる',500,760,{size:42,color:GREEN,anchor:'middle'}));
 if(k)s+=fade(ws(ctx,p,'ツカエマセン',{d:.4}),plate('同じ 並びの 間隔を 測る → 使えない',500,860,{size:42,color:RED_,anchor:'middle'}));
 s+=note('長さは 比べられるように 描いた',930,200,{anchor:'end'});
 return s;
};
// 35 答え
const ansWhy=(p,ctx)=>{
 const g1=vseg(ctx,p,0,.3),g2=after(ctx,p,1);
 let s=tag('答え',500,140,{anchor:'middle',size:48,color:HC,g:1});
 s+=fade(g1,label('暗号機が 円板を 回す 理由',500,280,{size:48,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(g2,box(80,380,840,300,{col:GREEN})+label('くり返しが 来ないほど 長い 合言葉を、',500,480,{size:42,color:GREEN,anchor:'middle',weight:700})+label('機械が 自動で 作り続ける',500,580,{size:50,color:GREEN,anchor:'middle',weight:700}));
 return s;
};
// 36〜37 エニグマへ
const nextSell=(p,ctx)=>{
 const g=ws(ctx,p,'エニグマ',{d:.5});
 let s=fade(g,box(160,200,680,420,{col:HC})+label('エニグマ',500,320,{size:76,color:HC,anchor:'middle',weight:700})+label('暗号機',500,395,{size:44,color:C.ink,anchor:'middle',weight:700}));
 for(let k=0;k<3;k++)s+=fade(g,`<circle cx="${380+k*120}" cy="500" r="48" fill="#131f38" stroke="#8aa0c4" stroke-width="5"/>`+dot(380+k*120,500,8,'#c9a45c'));
 s+=fade(ws(ctx,p,'ウリダサレ',{d:.4}),plate('売り出された',500,720,{size:48,color:C.ink,anchor:'middle'}));
 return s;
};
const nextCard=(p,ctx)=>{
 const g1=swin(ctx,p,0,0,.5),g2=after(ctx,p,1);
 let s=fade(g1*(1-g2*.75),label('軍の エニグマ',500,170,{size:44,color:C.dim,anchor:'middle',weight:700})+box(70,220,400,120,{col:HC})+label('＋ 折り返しの 板',270,295,{size:40,color:HC,anchor:'middle',weight:700})+box(530,220,400,120,{col:HC})+label('＋ 差し込み板',730,295,{size:40,color:HC,anchor:'middle',weight:700}));
 s+=fuda('次の 疑問',500,430,{anchor:'middle',g:g2});
 s+=finalCard(['序章3','エニグマの 中は、','どう なっている？'],g2,{y:500,size:58});
 return s;
};

export const chain00b3Diagrams={
 [K+'intro:rep']:fig(YC,null,introRep),
 [K+'col:pick']:fig(YC,GU,(p,c)=>colFig(p,c,0)),
 [K+'col:k']:fig(YC,GU,(p,c)=>colFig(p,c,1)),
 [K+'col:caesar']:fig(YC,GU,(p,c)=>colFig(p,c,2)),
 [K+'col:e']:fig(YC,GU,(p,c)=>colFig(p,c,3)),
 [K+'col:y']:fig(YC,GU,(p,c)=>colFig(p,c,4)),
 [K+'col:three']:fig(YC,GU,(p,c)=>colFig(p,c,5)),
 [K+'col:bars']:fig(YC,GU,colBars),
 [K+'len:q']:fig(YC,null,lenQ),
 [K+'bulb:hall']:fig(YC,TA,bulbHall),
 [K+'bulb:drop']:fig(YC,TA,bulbDrop),
 [K+'bulb:count']:fig(YC,TA,bulbCount),
 [K+'bulb:map']:fig(YC,TA,bulbMap),
 [K+'dlc:set']:fig(YC,GU,(p,c)=>dlcFig(p,c,0)),
 [K+'dlc:two']:fig(YC,GU,(p,c)=>dlcFig(p,c,1)),
 [K+'dlc:nine']:fig(YC,GU,(p,c)=>dlcFig(p,c,2)),
 [K+'gcd:many']:fig(YC,BR,gcdMany),
 [K+'gcd:three']:fig(YC,BR,gcdThree),
 [K+'gcd:solve']:fig(YC,BR,gcdSolve),
 [K+'weak:short']:fig(YC,null,weakShort),
 [K+'weak:long']:fig(YC,null,weakLong),
 [K+'weak:hand']:fig(YC,null,weakHand),
 [K+'sch:who']:fig(YS,null,schWho),
 [K+'wire:alb']:fig(YS,GU,wireAlb),
 [K+'wire:step']:fig(YS,GU,wireStep),
 [K+'wire:26']:fig(YS,GU,wire26),
 [K+'odo:car']:fig(YS,TA,odoCar),
 [K+'odo:carry']:fig(YS,TA,odoCarry),
 [K+'odo3:mid']:fig(YS,TA,odo3Mid),
 [K+'odo3:left']:fig(YS,TA,odo3Left),
 [K+'odo3:count']:fig(YS,TA,odo3Count),
 [K+'tape:key']:fig(YS,BR,tapeKey),
 [K+'tape:msg']:fig(YS,BR,(p,c)=>tapeMsg(p,c,0)),
 [K+'tape:no']:fig(YS,BR,(p,c)=>tapeMsg(p,c,1)),
 [K+'ans:why']:fig(YS,null,ansWhy),
 [K+'next:sell']:fig(Y23,null,nextSell),
 [K+'next:card']:fig(Y23,null,nextCard),
};

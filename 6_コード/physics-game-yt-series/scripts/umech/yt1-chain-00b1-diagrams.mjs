// 技術の疑問の鎖 序章2-1（ys-chain-00b1）「文字を入れ替える暗号は、なぜ数えるだけで解ける？」— 図。縦長の舞台 1000×920（vert-v1）。
// 共通の道具（文字の輪・帯・棒グラフ・見方の札・声の窓）と、全部の計算・assert は yt1-chain-00bx-common.mjs。
// 計算の段・数える印は、声がその文字・数を言う時刻（ws・wt）に出す。値は台本 chain-00b1.mjs の冒頭。
import {C,seg,clamp,mix,fade,label,line,rect,dot,ring,draw,arrow,W,H,HC,cueT,vseg,swin,note,plate,bigQ,finalCard,jw,ORANGE,GREEN,RED_,CYAN,fuda,
 ABC,ix,EN,SUB,subst,caesar,shift,TEXT1,C1,CL1,CPCT1,CCNT1,WORDS1,PW1,F26,YEARS,
 wt,ws,steps,fig,letterRing,ringXY,ringMark,ringArc,clockFace,RC,strip,stripXY,stripHop,bars,barTop,mono,monoX,CIPH,box,cell,person,bubble} from './yt1-chain-00bx-common.mjs';

const K='chain00b1-';
const Y0='紀元前1世紀 ローマ',YS='紀元前1世紀〜 入れ替え暗号',YK='9世紀 バグダッド キンディー';
const GU='具体例',TA='たとえ話',YA='破る側から';
const T=(p,ctx)=>cueT(p,ctx);
const after=(ctx,p,i)=>swin(ctx,p,i,0,.06);                 // i 番目の文に入ったら 1
const asp2=(a,b,i=1)=>(p,ctx)=>[after(ctx,p,i)>0?b:a,1];     // 文 i から見方を切りかえる
const SO={x0:68,y0:300,dx:72,dy:170};                         // 文字の帯の置き場所

// 1 はじめに：エニグマ（1923年）から さかのぼる
const intro=(p,ctx)=>{
 const g1=vseg(ctx,p,0,.15),g2=ws(ctx,p,'カンタンナ',{d:.6}),g3=ws(ctx,p,'ニセンネン',{d:.5}),g4=ws(ctx,p,'カエサル',{d:.4});
 let s=fade(g1,box(600,200,340,230,{col:'#8aa0c4'})+label('エニグマ',770,300,{size:52,color:C.ink,anchor:'middle',weight:700})+label('1923年',770,375,{size:44,color:C.dim,anchor:'middle',weight:700}));
 s+=arrow(600,450,mix(600,430,g2),mix(450,560,g2),{color:HC,w:6,head:22,g:g2>0?1:0});
 s+=fade(g2,label('もっと 簡単な 暗号から',480,640,{size:42,color:HC,weight:700}));
 s+=fade(g3,box(60,500,340,230,{col:HC})+label('カエサル',230,600,{size:52,color:HC,anchor:'middle',weight:700})+label('紀元前1世紀',230,675,{size:44,color:C.dim,anchor:'middle',weight:700}));
 s+=fade(g3,plate('2000年以上 前',230,820,{size:46,color:C.ink,anchor:'middle'}));
 s+=fade(g4,note('古代ローマ',230,470,{anchor:'middle'}));
 return s;
};

// 2〜4 文字の帯
const stripRule=(p,ctx)=>{
 const g=ws(ctx,p,'アルファベット',{d:.6}),g2=ws(ctx,p,'ミッツサキ',{d:.4});
 return strip({...SO,g:Math.max(g,.0)})+fade(g,label('アルファベットの 順',500,140,{size:42,color:C.dim,anchor:'middle',weight:700}))
  +fade(g2,box(150,640,700,130,{col:HC})+label('3つ 先の 文字に 置きかえる',500,722,{size:44,color:HC,anchor:'middle',weight:700}));
};
// 行3：A から 3つ数えて D
const stripA=(p,ctx)=>{
 const t=T(p,ctx),gA=ws(ctx,p,'エエノ',{d:.25}),n=steps(t,[wt(ctx,'ビイ'),wt(ctx,'スィイ'),wt(ctx,'ディイ')]),gD=ws(ctx,p,'ディイ',{occ:1,d:.3});
 const hl={};if(gA>0)hl[0]=HC;if(gD>0)hl[3]=GREEN;
 let s=strip({...SO,hl});
 if(gA>0)s+=stripHop(n,0,{o:SO});
 s+=fade(gD,box(250,650,500,140,{col:GREEN})+label('A → D',500,745,{size:64,color:GREEN,anchor:'middle',weight:700}));
 return s;
};
// 行4：B → E、C → F（前の A → D は小さく残す）
const stripBC=(p,ctx)=>{
 const t=T(p,ctx),i2=swin(ctx,p,1,0,.02)>0;
 const tB=[wt(ctx,'ミッツ'),wt(ctx,'イイ')],tC=[wt(ctx,'ミッツ',1),wt(ctx,'エフ')];
 const sp=(a,b)=>[0,1,2].map(k=>mix(a,b,(k+.2)/3.2));
 const nB=steps(t,sp(...tB),.22),nC=steps(t,sp(...tC),.22);
 const gE=ws(ctx,p,'イイ',{d:.3}),gF=ws(ctx,p,'エフ',{d:.3});
 const hl={};if(!i2){hl[1]=HC;if(gE>0)hl[4]=GREEN;}else{hl[2]=HC;if(gF>0)hl[5]=GREEN;}
 let s=strip({...SO,hl});
 s+=i2?stripHop(nC+2,2,{o:SO}):stripHop(nB+1,1,{o:SO});
 s+=label('A → D',140,680,{size:44,color:C.dim,anchor:'middle',weight:700});
 s+=fade(gE,label('B → E',380,680,{size:52,color:i2?C.dim:GREEN,anchor:'middle',weight:700}));
 s+=fade(gF,label('C → F',640,680,{size:52,color:GREEN,anchor:'middle',weight:700}));
 return s;
};
// 行5：CAT → FDW
const CATX=[340,500,660];
function catRows(p,ctx,{plain='CAT',ciph='FDW',up=false,gP=[1,1,1],gC=[0,0,0],op='+3',gBox=0}={}){
 let s=label(up?'暗号文':'元',90,250+16,{size:40,color:up?CIPH:C.dim,weight:700})+label(up?'元':'暗号',90,540+16,{size:40,color:up?C.dim:CIPH,weight:700});
 const top=up?ciph:plain,bot=up?plain:ciph;
 [...top].forEach((L,i)=>{s+=cell(L,CATX[i],250,{size:56,w:96,h:110,color:up?CIPH:C.ink,edge:gP[i]>.5&&gC[i]<.5?HC:C.faint,sw:gP[i]>.5&&gC[i]<.5?4:2});});
 [...bot].forEach((L,i)=>{const g=gC[i];if(g<=0)return;
  s+=fade(g,arrow(CATX[i],315,CATX[i],470,{color:HC,w:4,head:16})+label(op,CATX[i]+14,405,{size:36,color:HC,weight:700}))+cell(L,CATX[i],540,{size:56,w:96,h:110,color:up?C.ink:CIPH,edge:up?C.faint:CIPH,g});});
 if(gBox>0)s+=fade(gBox,rect(CATX[0]-70,470,CATX[2]-CATX[0]+140,140,{fill:'none',fo:0,stroke:GREEN,sw:5,rx:16}));
 return s;
}
const wordCat=(p,ctx)=>{
 const gC=[ws(ctx,p,'エフ',{d:.3}),ws(ctx,p,'ディイ',{d:.3}),ws(ctx,p,'ダブリュウ',{d:.3})];
 const gS=[ws(ctx,p,'スィイガ',{d:.2}),ws(ctx,p,'エエガ',{d:.2}),ws(ctx,p,'ティイガ',{d:.2})];
 const gR=ws(ctx,p,'アンゴオワ',{d:.4});
 let s=catRows(p,ctx,{gP:gS,gC,gBox:gR});
 s+=fade(gR,plate('暗号は FDW',500,720,{size:52,color:GREEN,anchor:'middle'}));
 s+=fade(gS[0],note('C+3＝F、A+3＝D、T+3＝W',500,820,{anchor:'middle'}));
 return s;
};
const wordBack=(p,ctx,k)=>{
 const g0=k?1:ws(ctx,p,'ミッツモドシ',{d:.4});
 const gC=k?[1,1,1]:[ws(ctx,p,'マエワスィイ',{off:3,d:.3}),ws(ctx,p,'マエワエエ',{off:3,d:.3}),ws(ctx,p,'マエワティイ',{off:3,d:.3})];
 const gS=k?[1,1,1]:[ws(ctx,p,'エフノ',{d:.2}),ws(ctx,p,'ディイノ',{d:.2}),ws(ctx,p,'ダブリュウノ',{d:.2})];
 let s=catRows(p,ctx,{plain:'CAT',ciph:'FDW',up:true,gP:k?[0,0,0]:gS,gC,op:'−3',gBox:k?vseg(ctx,p,0,.4):0});
 s+=fade(g0,plate('受け取った 人は、3つ 戻す',500,130,{size:44,color:HC,anchor:'middle'}));
 if(k)s+=fade(vseg(ctx,p,.1,.5),plate('CAT に 戻った',500,720,{size:52,color:GREEN,anchor:'middle'}));
 return s;
};
// 行7：Z の 3つ先は？
const SZ={...SO,x0:44,dx:68};
const zQ=(p,ctx)=>{
 const gZ=ws(ctx,p,'ゼット',{d:.3}),t=T(p,ctx),t0=wt(ctx,'ミッツ'),n=seg(t,t0,t0+.5);
 let s=strip({...SZ,hl:gZ>0?{25:HC}:{}});
 const [zx,zy]=stripXY(25,SZ);
 if(gZ>0){const x=zx+n*68,y=zy-66-Math.sin(Math.PI*n)*36;s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="13" fill="${HC}"/>`;}
 s+=fade(n,rect(zx+38,zy-46,60,64,{fill:'none',fo:0,stroke:HC,sw:3,rx:10})+label('？',zx+68,zy,{size:48,color:HC,anchor:'middle',weight:700}));
 s+=fade(ws(ctx,p,'ドオ',{d:.4}),plate('Z の 先に、文字が ない',500,700,{size:48,color:HC,anchor:'middle'}));
 return s;
};

// 8〜12 文字の輪（たとえ話）
const RG={cx:500,cy:480,R:330};
const ringClock=(p,ctx)=>{
 const t=T(p,ctx),gC=swin(ctx,p,0,0,.3),tR=wt(ctx,'ワニ'),gR=seg(t,tR-.2,tR+.3),out=seg(t,tR-.4,tR+.1);
 let s=clockFace(RG.cx,RG.cy,300,{hand:10.2,g:gC*(1-out)});
 s+=fade(ws(ctx,p,'トケイ',{d:.4})*(1-out),plate('時計の 文字盤',500,880,{size:44,color:C.ink,anchor:'middle'}));
 // 輪に、A から順に 1文字ずつ並べる
 const n=26*seg(t,tR,wt(ctx,'ナラベ',0,{end:true})+.2);
 if(gR>0){s+=letterRing({...RG,outer:ABC.slice(0,Math.ceil(n)).padEnd(26,' '),g:gR});}
 return s;
};
const ringWrap=(p,ctx)=>{
 const t=T(p,ctx),t12=wt(ctx,'ジュウニ'),t1=wt(ctx,'イチニ'),tz=wt(ctx,'ゼットノ'),ta=wt(ctx,'エエニ');
 const hand=11.3+.7*seg(t,t12-.2,t12+.3)+1*seg(t,t1-.1,t1+.4);
 let s=clockFace(185,230,165,{hand,hl:{12:hand>11.8&&hand<12.4?HC:undefined,1:hand>12.7?GREEN:undefined}});
 s+=label('12 の 次は 1',470,150,{size:40,color:C.dim,weight:700});
 const R2={cx:575,cy:630,R:245};
 const pos=25+seg(t,ta-.3,ta+.2);
 const hl={};if(t>tz)hl[25]=HC;if(pos>25.95)hl[0]=GREEN;
 s+=letterRing({...R2,hl,band:70,size:38});
 if(t>tz-.1)s+=ringArc(R2.cx,R2.cy,R2.R+66,25,pos,{color:HC,p:1});
 s+=fade(seg(t,ta,ta+.4),plate('Z の 次は A',575,645,{size:44,color:GREEN,anchor:'middle'}));
 return s;
};
const ringZ3=(p,ctx)=>{
 const t=T(p,ctx),tz=wt(ctx,'ゼットノ'),n=steps(t,[wt(ctx,'エエ'),wt(ctx,'ビイ'),wt(ctx,'スィイ')]),gC=ws(ctx,p,'スィイデス',{d:.3});
 const hl={25:HC};if(gC>0)hl[2]=GREEN;
 let s=letterRing({...RG,hl});
 if(t>tz)s+=ringMark(RG.cx,RG.cy,RG.R,25+n,{from:25,count:n,cR:RG.R+72});
 s+=fade(gC,plate('Z → C',RG.cx,RG.cy+18,{size:60,color:GREEN,anchor:'middle'}));
 return s;
};
// 行10：内側に もう一つの輪を重ねて、3目盛り回す。外 A の内側に D
const ringInner=(p,ctx,k)=>{
 const t=T(p,ctx);let n=3,gI=1,gA=0,gD=0;
 if(!k){gI=ws(ctx,p,'ウチガワ',{d:.6});const t3=wt(ctx,'サンメモリ'),tm=wt(ctx,'マワシテ',0,{end:true});n=steps(t,[0,1,2].map(j=>mix(t3,tm+.3,j/3)),.3);}
 else{gA=ws(ctx,p,'ソトノ',{d:.3});gD=ws(ctx,p,'ウチノモジ',{d:.3});}
 const hl={},ihl={};if(gA>0)hl[0]=HC;if(gD>0)ihl[3]=GREEN;
 let s=letterRing({...RG,R:340,inner:ABC,ig:gI,rot:-n,hl,ihl});
 if(!k)s+=fade(gI,n>0?plate('内の 輪を',500,455,{size:44,color:HC,anchor:'middle'})+plate(`${Math.min(3,Math.floor(n+1e-6))} 目盛り 回す`,500,530,{size:44,color:HC,anchor:'middle'}):plate('内側に もう一つ',500,500,{size:44,color:HC,anchor:'middle'}));
 if(k)s+=fade(gA,plate('外 A',500,470,{size:52,color:HC,anchor:'middle'}))+fade(gD,plate('→ 内 D',500,545,{size:52,color:GREEN,anchor:'middle'}));
 if(k)s+=fade(gD,draw([ringXY(RG.cx,RG.cy,340-34,0),ringXY(RG.cx,RG.cy,340-74,0)],1,{color:GREEN,w:5}));
 return s;
};

// 11〜14 破る側から
function enemy(x,y,{g=1}={}){return person(x,y,{col:'#a34a3a',g});}
const brkFdw=(p,ctx)=>{
 const g2=after(ctx,p,1),gF=ws(ctx,p,'エフディイダブリュウ',{d:.4});
 let s=enemy(260,620,{g:g2})+fade(g2,label('敵',260,700,{size:44,color:'#ff8f6b',anchor:'middle',weight:700}));
 s+=fade(gF,`<rect x="430" y="300" width="460" height="300" rx="12" fill="#e8dcc0" stroke="#b9a57a" stroke-width="4" transform="rotate(-4 660 450)"/>`+mono('FDW',660,480,{size:96,cw:.8,color:'#a33a12',anchor:'middle'})+label('暗号文',660,380,{size:40,color:'#5e4128',anchor:'middle',weight:700}));
 return s;
};
const brkUnk=(p,ctx)=>{
 const g=vseg(ctx,p,0,.3),wob=Math.sin(T(p,ctx)*2.2)*1.5;
 let s=letterRing({...RG,R:340,inner:'??????????????????????????',rot:-3+wob,g});
 s+=fade(g,plate('何目盛り 回した？',500,500,{size:48,color:'#ff8f6b',anchor:'middle'}));
 s+=label('暗号文',40,120,{size:38,color:C.dim,weight:700})+mono('FDW',40,180,{size:56,cw:.8,color:CIPH});
 return s;
};
// 行12：25通り（1〜25 の一覧）。26目盛りで元に戻る
const brk25=(p,ctx)=>{
 const t=T(p,ctx),t1=wt(ctx,'ヒトメモリ'),t25=wt(ctx,'ニジュウゴメモリ'),i2=after(ctx,p,1);
 let s='';
 for(let k=1;k<=25;k++){const gk=seg(t,mix(t1,t25,(k-1)/24),mix(t1,t25,(k-1)/24)+.25);const r=Math.floor((k-1)/9),c=(k-1)%9;
  s+=fade(gk*(i2?.5:1),label(String(k),110+c*98,130+r*62,{size:40,color:C.ink,anchor:'middle',weight:700}));}
 s+=fade(ws(ctx,p,'ニジュウゴトオリ',{d:.4}),plate('25通り',880,316,{size:48,color:HC,anchor:'middle'}));
 // 26目盛り回すと元に戻る（輪ごと回す。上の印が目盛りを数える）
 const t26=wt(ctx,'ニジュウロクメモリ'),te=wt(ctx,'モドッテ'),n=26*seg(t,t26,te+.3);
 const c={cx:500,cy:630,R:200};
 s+=fade(i2,`<g transform="rotate(${(-n*360/26).toFixed(2)} ${c.cx} ${c.cy})">`+letterRing({...c,band:62,size:36,hl:{0:HC},center:false})+'</g>'+`<circle cx="${c.cx}" cy="${c.cy}" r="10" fill="${RC.goldEdge}"/>`
  +`<polygon points="${c.cx},${c.cy-c.R-40} ${c.cx-16},${c.cy-c.R-68} ${c.cx+16},${c.cy-c.R-68}" fill="${HC}"/>`);
 s+=fade(i2,plate(`${Math.floor(n+1e-6)} 目盛り`,c.cx,c.cy+16,{size:44,color:HC,anchor:'middle'}));
 s+=fade(ws(ctx,p,'モトニ',{d:.4}),plate('26目盛り ＝ 元どおり',500,905,{size:42,color:GREEN,anchor:'middle'}));
 return s;
};
// 行13：1目盛り、2目盛り、3目盛り 戻す
const TRY=[['ECV',['イイ','スィイ','ブイ']],['DBU',['ディイ','ビイ','ユウ']],['CAT',['キャ','キャ','キャ']]];
const TX=[560,680,800];
function tryFig(p,ctx,k,{ans=0,done=false}={}){
 let s=label('暗号文',70,150,{size:40,color:C.dim,weight:700});
 [...'FDW'].forEach((L,i)=>{s+=cell(L,TX[i],136,{size:52,w:92,h:100,color:CIPH,edge:CIPH});});
 TRY.forEach(([w,nd],r)=>{
  if(r>k)return;const y=310+r*150,cur=r===k&&!done;
  s+=label(`${r+1}目盛り 戻す`,70,y+16,{size:42,color:cur?HC:C.dim,weight:700});
  [...w].forEach((L,i)=>{const g=cur?ws(ctx,p,nd[i],{d:.25,lag:r===2?i*.12:0}):1;
   s+=cell(L,TX[i],y,{size:52,w:92,h:100,g,color:r===2?GREEN:C.ink,edge:C.faint});});
  if(cur)s+=fade(ws(ctx,p,nd[0],{d:.3}),note([...'FDW'].map((c,i)=>`${c}−${r+1}＝${w[i]}`).join('、'),500,820,{anchor:'middle'}));
 });
 if(ans>0)s+=fade(ans,rect(TX[0]-62,610-62,TX[2]-TX[0]+124,124,{fill:'none',fo:0,stroke:GREEN,sw:5,rx:16})+plate('意味の ある 言葉 → 答え：3目盛り',500,790,{size:42,color:GREEN,anchor:'middle'}));
 return s;
}
const tryWeak=(p,ctx)=>{
 const g1=ws(ctx,p,'スウフン',{d:.4}),g2=ws(ctx,p,'ジャクテン',{d:.4});
 let s=tryFig(p,ctx,2,{done:true});
 s+=fade(g1*(1-g2*.6),plate('25通り → 手でも 数分',500,790,{size:44,color:C.ink,anchor:'middle'}));
 s+=fuda('弱点',500,790,{anchor:'middle',text:'鍵が 25通り だけ',g:g2,color:RED_,size:44});
 return s;
};

// 15〜22 入れ替え暗号
const subLeap=(p,ctx)=>{
 const gL=ws(ctx,p,'ワオ',{d:.4}),gR=ws(ctx,p,'バラバラ',{d:.5});
 let s=fuda('考えの 飛躍',500,120,{anchor:'middle',color:'#ffb36b'});
 const col=(x,targets,g,c)=>{let o='';['A','B','C','D'].forEach((L,i)=>{const y=330+i*120,ty=330+targets[i]*120;
  o+=label(L,x,y+14,{size:44,color:C.ink,anchor:'middle',weight:700})+arrow(x+34,y,x+186,ty,{color:c,w:4,head:14})+label('ABCDEFGHIJ'[[3,4,5,6][i]]??'',0,0,{size:0});});return fade(g,o);};
 // 左：輪を回す（並びはそのまま、みんな 3つ先）
 let L='';['A','B','C','D'].forEach((c,i)=>{const y=330+i*120;L+=label(c,90,y+14,{size:44,color:C.ink,anchor:'middle',weight:700})+arrow(126,y,276,y,{color:'#8aa0c4',w:4,head:14})+label(shift(c,3),316,y+14,{size:44,color:CIPH,anchor:'middle',weight:700});});
 s+=fade(gL,box(30,230,410,520,{col:'#8aa0c4'})+L+label('輪を 回す',235,800,{size:40,color:C.dim,anchor:'middle',weight:700}));
 let R='';const tg=SUB;['A','B','C','D'].forEach((c,i)=>{const y=330+i*120;R+=label(c,600,y+14,{size:44,color:C.ink,anchor:'middle',weight:700})+arrow(636,y,786,y,{color:HC,w:4,head:14})+label(tg[i],826,y+14,{size:44,color:CIPH,anchor:'middle',weight:700});});
 s+=fade(gR,box(540,230,410,520,{col:HC})+R+label('行き先を ばらばらに',745,800,{size:40,color:HC,anchor:'middle',weight:700}));
 return s;
};
// 入れ替えの表（A〜M と N〜Z の 2段）
const TB={x0:104,dx:66,y:[280,380,590,690]};
const tabXY=(j,row)=>[TB.x0+(j%13)*TB.dx,TB.y[Math.floor(j/13)*2+row]];
function table(gj,{hl={},y0=0}={}){
 let s='';
 for(let j=0;j<26;j++){const [x,y]=tabXY(j,0),[,y2]=tabXY(j,1),g=gj(j),c=hl[j];
  if(c)s+=rect(x-28,y-50,56,y2-y+72,{fill:c,fo:.18,stroke:c,sw:3,rx:10});
  s+=label(ABC[j],x,y,{size:42,color:c??C.ink,anchor:'middle',weight:700});
  s+=fade(g,line(x,y+14,x,y2-44,{color:C.faint,w:2})+label(SUB[j],x,y2,{size:42,color:c??CIPH,anchor:'middle',weight:700}));}
 s+=label('元',30,TB.y[0],{size:36,color:C.dim,weight:700})+label('先',30,TB.y[1],{size:36,color:CIPH,weight:700})+label('元',30,TB.y[2],{size:36,color:C.dim,weight:700})+label('先',30,TB.y[3],{size:36,color:CIPH,weight:700});
 return s;
}
const tabMake=(p,ctx)=>{
 const t=T(p,ctx),g3=[ws(ctx,p,'キュウ',{d:.3}),ws(ctx,p,'ダブリュウ',{d:.3}),ws(ctx,p,'イイト',{d:.3})];
 const tr=wt(ctx,'ニジュウロク'),te=wt(ctx,'ツクリマス',0,{end:true});
 const gj=j=>j<3?g3[j]:seg(t,mix(tr,te,(j-3)/23),mix(tr,te,(j-3)/23)+.2);
 const hl={};[0,1,2].forEach(j=>{if(g3[j]>0&&t<tr)hl[j]=HC;});
 return table(gj,{hl})+fade(vseg(ctx,p,0,.2),label('入れ替えの 表（例）',500,150,{size:42,color:C.dim,anchor:'middle',weight:700}))
  +fade(seg(t,te-.2,te+.4),note('表は 図のための 例',500,830,{anchor:'middle'}));
};
const tabCat=(p,ctx)=>{
 const t=T(p,ctx),tc=wt(ctx,'スィイノイキサキ'),ta=wt(ctx,'エエノイキサキ'),tt=wt(ctx,'ティイノイキサキ');
 const k=t<tc?-1:t<ta?0:t<tt?1:2,cur=['C','A','T'][k];
 const hl={};if(k>=0)hl[ix(cur)]=HC;
 let s=table(()=>1,{hl});
 const done=[t>tc+.5,t>ta+.5,t>tt+.5];
 s+=mono('CAT',300,150,{size:56,cw:.9,color:C.ink,anchor:'middle'})+label('→',500,150,{size:56,color:C.dim,anchor:'middle',weight:700});
 s+=mono([...'EQJ'].map((c,i)=>done[i]?c:' ').join(''),700,150,{size:56,cw:.9,color:done[2]?GREEN:CIPH,anchor:'middle'});
 if(k>=0){const [x,y]=tabXY(ix(cur),1);s+=`<circle cx="${x}" cy="${y-14}" r="34" fill="none" stroke="${HC}" stroke-width="5"/>`;}
 s+=fade(swin(ctx,p,0,.3,.7)*(1-after(ctx,p,1)),plate('表を 引く だけ',500,850,{size:44,color:HC,anchor:'middle'}));
 
 return s;
};
// 18〜20 何通り？
const PROD=['26','25','24','1'];
function countFig(p,ctx,k,{all=0}={}){
 const t=T(p,ctx),Lt=['A','B','C','Z'][k];
 const used=k===0?[]:k===1?['Q']:k===2?['Q','W']:[...SUB].filter(c=>c!=='K');
 const gH=all?0:k===0?ws(ctx,p,'エエノイキサキ',{d:.3}):vseg(ctx,p,0,.2);
 const tg=all?0:k===0?wt(ctx,'ニジュウロクモジ'):k===1?wt(ctx,'モオツカッタ'):k===2?wt(ctx,'スィイワ'):wt(ctx,'ノコッタ');
 let s=fade(k===0?ws(ctx,p,'ナントオリ',{d:.4}):1,label('表は 何通り 作れる？',500,120,{size:44,color:C.dim,anchor:'middle',weight:700}));
 if(!all){
  s+=fade(gH,cell(Lt,110,250,{size:56,w:96,h:100,color:HC,edge:HC})+label('の 行き先',260,268,{size:44,color:HC,anchor:'middle',weight:700}));
  for(let j=0;j<26;j++){const x=110+(j%13)*66,y=360+Math.floor(j/13)*84,gj=k===0?seg(t,tg+j*.04,tg+j*.04+.2):1,u=used.includes(ABC[j]);
   const gx=k===0?0:seg(t,tg+.1,tg+.5);
   s+=fade(gj,cell(ABC[j],x,y,{size:40,w:56,h:70,color:u?C.faint:CIPH,edge:u?C.faint:'#5a4a3a'}));
   if(u)s+=fade(gx,line(x-24,y-30,x+24,y+30,{color:RED_,w:4})+line(x+24,y-30,x-24,y+30,{color:RED_,w:4}));}
  const nn=[26,25,24,1][k],gN=k===0?ws(ctx,p,'ニジュウロクトオリ',{d:.4}):k===1?ws(ctx,p,'ニジュウゴトオリ',{d:.4}):k===2?ws(ctx,p,'ニジュウヨントオリ',{d:.4}):ws(ctx,p,'ヒトトオリ',{d:.4});
  s+=fade(gN,plate(`${nn} 通り`,760,268,{size:52,color:GREEN,anchor:'middle'}));
  if(k===1)s+=fade(seg(t,tg+.1,tg+.5),note('Q は A が 使った',110,520,{}));
  if(k===2)s+=fade(seg(t,tg+.1,tg+.5),note('Q・W は 使った',110,520,{}));
  if(k===3)s+=fade(seg(t,tg+.1,tg+.5),note('残りは K だけ',110,520,{}));
 }
 // 掛け算を 1段ずつ
 const parts=['26','× 25','× 24','× … × 1'];
 const gNow=all?1:k===0?ws(ctx,p,'ニジュウロクトオリ',{d:.4}):k===1?ws(ctx,p,'ニジュウゴトオリ',{d:.4}):k===2?ws(ctx,p,'ニジュウヨントオリ',{d:.4}):k===3?ws(ctx,p,'ヒトトオリ',{d:.4}):1;
 let xs=170;const ys=all?260:640;
 parts.forEach((q,i)=>{if(i>k&&!all)return;const g=i<k||all?1:gNow;s+=fade(g,label(q,xs,ys,{size:56,color:i===k&&!all?HC:C.ink,weight:700}));xs+=jw(q)*56+44;});
 return s;
}
const cntAll=(p,ctx)=>{
 const g1=ws(ctx,p,'カケルト',{d:.4}),g2=ws(ctx,p,'ヤク',{d:.4});
 let s=countFig(p,ctx,3,{all:1});
 s+=fade(g1,label('＝ 26!（26の 階乗）',500,400,{size:52,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(g2,label('≈ 4×10²⁶ 通り',500,560,{size:76,color:HC,anchor:'middle',weight:700})+note('＝ 403291461126605635584000000',500,650,{anchor:'middle'}));
 return s;
};
const cntTime=(p,ctx)=>{
 const g1=ws(ctx,p,'イッチョオ',{d:.4}),g2=ws(ctx,p,'ゼンブオ',{d:.4}),g2b=ws(ctx,p,'タメスニワ',{d:.4,end:true}),g3=ws(ctx,p,'ヤク',{d:.4});
 let s=label('≈ 4×10²⁶ 通り',500,110,{size:44,color:C.dim,anchor:'middle',weight:700});
 s+=fade(g1,box(90,170,820,120,{col:'#8aa0c4'})+label('1秒に 1兆＝10¹² 通り 試す 機械',500,248,{size:44,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(g2,label('4×10²⁶ ÷ 10¹² ＝ 4×10¹⁴ 秒',500,400,{size:50,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(g2b,label('4×10¹⁴ 秒 ÷ 3.16×10⁷ 秒（1年）',500,520,{size:46,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(g3,label('≈ 1.3×10⁷ 年',500,640,{size:60,color:HC,anchor:'middle',weight:700})+label('＝ 約1300万年',500,740,{size:60,color:HC,anchor:'middle',weight:700}));
 s+=fade(g2b,note('1年 ＝ 365.25日 × 24時間 × 3600秒 ≈ 3.16×10⁷ 秒',500,840,{anchor:'middle'}));
 return s;
};
const kindiOdd=(p,ctx)=>{
 const g1=swin(ctx,p,0,0,.5),g2=after(ctx,p,1),g3=ws(ctx,p,'ヒトツモ',{d:.4});
 let s=fade(g1*(1-g2),label('約1300万年',500,300,{size:60,color:C.ink,anchor:'middle',weight:700})+plate('安全？',500,460,{size:64,color:GREEN,anchor:'middle'}));
 s+=fade(g2,rect(330,220,340,400,{fill:'#e8dcc0',fo:1,stroke:'#b9a57a',sw:4,rx:14}));
 for(let k=0;k<7;k++)s+=fade(g2,line(370,290+k*44,630,290+k*44,{color:'#b9a57a',w:3}));
 s+=fade(g2,label('暗号の 解き方の 本',500,690,{size:40,color:C.ink,anchor:'middle',weight:700})+note('キンディーが 書き残した',500,750,{anchor:'middle'}));
 s+=fuda('違和感',500,140,{anchor:'middle',text:'一つも 試さずに 解く？',g:g3,size:40});
 return s;
};

// 23〜24 名札とあだ名（たとえ話）
const NAMES=['さくら','たろう','ゆい','けん','まい','そら'],NICK=['ほし','くも','うみ','かぜ','もり','やま'],PCOL=['#7fb2ff','#83ecc0','#ff9ce6','#ffcf67','#b49bff','#ff8f6b'];
const PXY=[[190,440],[500,440],[810,440],[190,780],[500,780],[810,780]];
function classFig(p,ctx,{swap=1,q=0,talk=0,known=0,gP=1}={}){
 let s='';
 PXY.forEach(([x,y],i)=>{const tag=swap>.5?NICK[i]:NAMES[i];
  s+=person(x,y,{col:PCOL[i],tagText:tag,tagCol:swap>.5?'#a33a12':C.bg,g:gP,s:1});
  if(q>0)s+=fade(q,label('？',x,y-180,{size:56,color:HC,anchor:'middle',weight:700}));});
 if(swap>0&&swap<1)s+=fade(Math.sin(Math.PI*swap),plate('付け替え',500,120,{size:44,color:HC,anchor:'middle'}));
 return s;
}
const classSwap=(p,ctx)=>{
 const gP=ws(ctx,p,'クラス',{d:.5}),t=T(p,ctx),ts=wt(ctx,'ツケカエ');
 return classFig(p,ctx,{swap:seg(t,ts-.1,ts+.6),gP});
};
const classQ=(p,ctx)=>classFig(p,ctx,{q:ws(ctx,p,'ダレガ',{d:.4})});
const TALK=[1,5,1,2,1,2],TALKER=1;
const classTalk=(p,ctx)=>{
 const t=T(p,ctx),g1=ws(ctx,p,'シャベル',{d:.6}),g2=after(ctx,p,1),g3=ws(ctx,p,'ケントオ',{d:.4});
 let s=classFig(p,ctx,{swap:1});
 PXY.forEach(([x,y],i)=>{for(let b=0;b<TALK[i];b++){const gb=seg(t,wt(ctx,'シャベル')+b*.25,wt(ctx,'シャベル')+b*.25+.3);
  const bx=x+(b%3-1)*80,by=y-210-Math.floor(b/3)*58;s+=bubble(bx,by,{g:gb});}});
 s+=fade(g2,plate('声 5回',PXY[TALKER][0]+150,PXY[TALKER][1]-120,{size:40,color:HC,anchor:'middle'}));
 s+=fade(g3,plate(`${NICK[TALKER]} ＝ ${NAMES[TALKER]} だ！`,500,905,{size:48,color:GREEN,anchor:'middle'}));
 return s;
};

// 25〜27 文字の回数
const fqSame=(p,ctx)=>{
 const rows=[['人','文字'],['あだ名','暗号の 文字'],['しゃべる 回数','出てくる 回数']];
 let s='';rows.forEach(([a,b],i)=>{const g=vseg(ctx,p,.05+i*.12,.25+i*.12),y=260+i*170;
  s+=fade(g,box(60,y-70,360,110,{col:'#ff9ce6'})+label(a,240,y+4,{size:42,color:'#ff9ce6',anchor:'middle',weight:700})+label('＝',500,y+4,{size:48,color:C.dim,anchor:'middle',weight:700})+box(580,y-70,360,110,{col:CYAN})+label(b,760,y+4,{size:42,color:CYAN,anchor:'middle',weight:700}));});
 return s;
};
const BO={x:70,y:790,w:840,h:360,max:14};
const fqEn=(p,ctx,k)=>{
 const t=T(p,ctx),gr=k?1:vseg(ctx,p,0,.45),gE=k?1:ws(ctx,p,'イイガ',{d:.3}),g13=k?1:ws(ctx,p,'ジュウサン',{d:.4});
 const gT=k?ws(ctx,p,'ティイデ',{d:.3}):0,g9=k?ws(ctx,p,'キュウ',{d:.4}):0;
 const hl={};if(gE>0)hl[4]=HC;if(gT>0)hl[19]=ORANGE;
 let s=label('英文の 文字の 割合（％）',BO.x,140,{size:40,color:C.dim,weight:700})+bars(EN,{...BO,grow:gr,hl});
 const [ex,ey]=barTop(EN,4,BO),[tx,ty]=barTop(EN,19,BO);
 s+=fade(g13,plate('E 約13％',ex+24,ey-24,{size:46,color:HC}));
 s+=fade(g9,plate('T 約9％',tx,ty-24,{size:46,color:ORANGE,anchor:'middle'}));
 s+=note('よく 知られた 表（E 12.7、T 9.1）',BO.x,880);
 return s;
};
const fqEx=(p,ctx)=>{
 const g1=swin(ctx,p,0,.1,.5),gX=ws(ctx,p,'イツモ',{d:.4}),g2=after(ctx,p,1),g13=ws(ctx,p,'ジュウサン',{d:.4});
 const P='THE ARMY WILL MEET',Cc=subst(P);
 let s=label('元',40,170,{size:40,color:C.dim,weight:700})+mono(P,520,170,{size:52,cw:.72,anchor:'middle',cols:[...P].map(c=>c==='E'?HC:C.ink)});
 s+=fade(g1,label('暗号',40,290,{size:40,color:CIPH,weight:700})+mono(Cc,520,290,{size:52,cw:.72,anchor:'middle',cols:[...Cc].map(c=>c==='X'?HC:CIPH)}));
 [...P].forEach((c,i)=>{if(c==='E'){const x=monoX(P,i,520,{size:52,cw:.72,anchor:'middle'});s+=fade(g1,arrow(x,190,x,245,{color:HC,w:3,head:12}));}});
 s+=fade(gX,plate('E は いつも X',500,400,{size:52,color:HC,anchor:'middle'}));
 // E の棒（英文）と X の棒（暗号文、はず）
 const bx=[330,670],by=820,bh=300,hE=bh*12.7/14;
 s+=fade(g2,line(200,by,800,by,{color:C.dim,w:2})+rect(bx[0]-50,by-hE,100,hE,{fill:HC,fo:.9,stroke:'none',rx:4})+label('E',bx[0],by+44,{size:44,color:HC,anchor:'middle',weight:700})+label('英文',bx[0],by-hE-20,{size:38,color:C.dim,anchor:'middle',weight:700}));
 s+=fade(g13,rect(bx[1]-50,by-hE,100,hE,{fill:CIPH,fo:.9,stroke:'none',rx:4})+label('X',bx[1],by+44,{size:44,color:CIPH,anchor:'middle',weight:700})+label('暗号文：約13％の はず',bx[1],by-hE-20,{size:38,color:CIPH,anchor:'middle',weight:700}));
 return s;
};
// 長い暗号文（4行だけ見せる）と、数えた棒
const LINES1=(()=>{const w=C1.split(' '),out=[];let cur='';for(const x of w){if((cur+' '+x).trim().length>38){out.push(cur.trim());cur=x;}else cur+=' '+x;}out.push(cur.trim());return out;})();
const fqLong=(p,ctx,k)=>{
 const gr=k?1:vseg(ctx,p,.25,.98),gt=k?.35:vseg(ctx,p,0,.25);
 let s='';
 LINES1.slice(0,4).forEach((L,i)=>{s+=mono(L,40,130+i*52,{size:38,cw:.6,color:CIPH,g:gt});});
 s+=fade(gt,note(`… 全部で ${CL1.length} 文字の 暗号文`,960,340,{anchor:'end'}));
 const hl={};
 if(k){const gE=ws(ctx,p,'イイ',{d:.3}),gT=ws(ctx,p,'ティイ',{d:.3});if(gE>0)hl[ix('X')]=HC;if(gT>0)hl[ix('J')]=ORANGE;
  const [xx,xy]=barTop(CPCT1,ix('X'),BO),[jx,jy]=barTop(CPCT1,ix('J'),BO);
  s+=bars(CPCT1,{...BO,hl,col:'#ffb380'});
  s+=fade(gE,plate('E？',xx,xy-24,{size:52,color:HC,anchor:'middle'}))+fade(gT,plate('T？',jx,jy-24,{size:52,color:ORANGE,anchor:'middle'}));
  s+=fade(gE,note(`X ${CPCT1[ix('X')].toFixed(1)}％（${CCNT1[ix('X')]}回）`,BO.x,880))+fade(gT,note(`J ${CPCT1[ix('J')].toFixed(1)}％（${CCNT1[ix('J')]}回）`,BO.x+420,880));
 }else{s+=bars(CPCT1,{...BO,grow:gr,col:'#ffb380'});s+=note('暗号文の 文字の 割合（数えた）',BO.x,880,{g:gr});}
 return s;
};
// 28〜30 THE から H
const PICK=WORDS1.slice(0,24);           // 暗号文の始めの 24語
const LN=(()=>{const out=[];let cur=[];for(const w of WORDS1){if([...cur,w].join(' ').length>33){out.push(cur);cur=[w];}else cur.push(w);}if(cur.length)out.push(cur);return out.slice(0,5);})();
function cipherLines(ctx,p,{y0=250,dy=118,known={},hlJX=0,box3=0,gPlain=0,size=40,n=5}={}){
 let s='';const cw=.66,x0=50;
 LN.slice(0,n).forEach((ws_,r)=>{const L=ws_.join(' '),y=y0+r*dy;
  const cols=[...L].map(c=>known[c]?GREEN:(hlJX&&(c==='J'||c==='X'))?(c==='J'?ORANGE:HC):CIPH);
  s+=mono(L,x0,y,{size,cw,cols});
  if(box3>0){let i=0;for(const w of ws_){if(w==='JVX'){const xa=x0+i*size*cw,xb=xa+3*size*cw;s+=fade(box3,rect(xa-4,y-size,xb-xa+8,size+14,{fill:'none',fo:0,stroke:HC,sw:3,rx:8}));}i+=w.length+1;}}
  if(gPlain>0)s+=fade(gPlain,mono([...L].map(c=>c===' '?' ':(known[c]??'・')).join(''),x0,y+48,{size,cw,cols:[...L].map(c=>known[c]?C.ink:C.faint)}));
 });
 return s;
}
const rdThe=(p,ctx)=>{
 const g0=vseg(ctx,p,0,.15),g1=swin(ctx,p,1,0,.3),g2=ws(ctx,p,'ザデス',{d:.4});
 let s=fade(g0,label('わかりかけた こと',500,150,{size:40,color:C.dim,anchor:'middle',weight:700})+label('E → X？',330,230,{size:52,color:HC,anchor:'middle',weight:700})+label('T → J？',670,230,{size:52,color:ORANGE,anchor:'middle',weight:700}));
 s+=fade(g1,label('英語で 一番 よく 出る 3文字の 言葉',500,400,{size:42,color:C.dim,anchor:'middle',weight:700}));
 s+=fade(g2,mono('THE',500,620,{size:150,cw:.8,cols:[ORANGE,C.ink,HC],anchor:'middle'}));
 return s;
};
const rdPat=(p,ctx)=>{
 const gJ=ws(ctx,p,'ティイダト',{d:.4}),gX=ws(ctx,p,'イイダト',{d:.4}),gB=ws(ctx,p,'サンモジノ',{d:.4}),gN=ws(ctx,p,'ナンドモ',{d:.4}),gH=ws(ctx,p,'エイチ',{d:.4});
 let s=cipherLines(ctx,p,{hlJX:gJ>0?1:0,box3:gB,y0:230,dy:100});
 s+=fade(gJ,plate('J ＝ T？',200,130,{size:46,color:ORANGE,anchor:'middle'}))+fade(gX,plate('X ＝ E？',500,130,{size:46,color:HC,anchor:'middle'}));
 s+=fade(gB,plate('J □ X の 3文字',300,740,{size:46,color:HC,anchor:'middle'}));
 s+=fade(gN,plate(`→ JVX が ${WORDS1.filter(w=>w==='JVX').length}回`,700,740,{size:46,color:C.ink,anchor:'middle'}));
 s+=fade(gH,box(160,800,680,100,{col:GREEN})+label('真ん中の V ＝ H',500,868,{size:50,color:GREEN,anchor:'middle',weight:700}));
 return s;
};
// 行30：わかった文字が増えるごとに、読める所が増える（3段）
const KN=[{X:'E',J:'T',V:'H'},{Q:'A',O:'N',M:'M'},{}];
const ALLKN=Object.fromEntries([...SUB].map((c,i)=>[c,ABC[i]]));
const rdFill=(p,ctx)=>{
 const t=T(p,ctx),t1=wt(ctx,'ヨメル'),t2=wt(ctx,'ノコリ'),t3=wt(ctx,'アナウメ');
 const known={X:'E',J:'T',V:'H'};
 if(t>t1){Object.assign(known,{Q:'A',O:'N',M:'D',C:'O'});}
 if(t>t2){Object.assign(known,{S:'R',U:'S',P:'I',G:'L',D:'W',N:'M'});}
 if(t>t3)Object.assign(known,ALLKN);
 let s=cipherLines(ctx,p,{known,gPlain:1,y0:140,dy:165,n:4,size:42});
 const n=Object.keys(known).length;
 s+=plate(`わかった 文字：${n} / 26`,500,880,{size:42,color:GREEN,anchor:'middle'});
 return s;
};

// 31〜32
const endResult=(p,ctx)=>{
 const g1=swin(ctx,p,0,0,.5),g2=after(ctx,p,1);
 let s=fuda('結果',500,120,{anchor:'middle',color:GREEN,size:44});
 s+=fade(g1,box(90,220,820,230,{col:'#8aa0c4'})+label('鍵：約4×10²⁶ 通り',500,310,{size:50,color:C.ink,anchor:'middle',weight:700})+label('試した 数：0',500,400,{size:50,color:HC,anchor:'middle',weight:700}));
 s+=fade(g2,box(90,520,820,230,{col:GREEN})+label('したこと：',500,610,{size:44,color:C.dim,anchor:'middle',weight:700})+label('文字の 回数を 数えた',500,700,{size:52,color:GREEN,anchor:'middle',weight:700}));
 return s;
};
const nextWeak=(p,ctx)=>{
 const g1=ws(ctx,p,'オナジモジガ',{d:.5});
 let s=fade(vseg(ctx,p,0,.3),fuda('弱点',500,140,{anchor:'middle',text:'ただ 一つ',color:RED_,size:44}));
 [0,1,2].forEach(i=>{const x=250+i*250;s+=fade(g1,cell('E',x,330,{size:64,w:110,h:120,color:HC,edge:HC})+arrow(x,400,x,520,{color:HC,w:5,head:18})+cell('X',x,600,{size:64,w:110,h:120,color:CIPH,edge:CIPH}));});
 s+=fade(ws(ctx,p,'イツモ',{d:.4}),plate('E は いつも X',500,780,{size:52,color:HC,anchor:'middle'}));
 return s;
};
const nextCard=(p,ctx)=>{
 const g1=vseg(ctx,p,0,.3),g2=vseg(ctx,p,.55,.9);
 let s=fuda('次の 疑問',500,120,{anchor:'middle',g:g1});
 ['K','R','?'].forEach((c,i)=>{const x=250+i*250;s+=fade(g1*(1-g2*.7),cell('E',x,250,{size:56,w:100,h:110,color:HC,edge:HC})+arrow(x,315,x,385,{color:HC,w:4,head:16})+cell('？',x,450,{size:56,w:100,h:110,color:CYAN,edge:CYAN}));});
 s+=finalCard(['序章2-2','同じ 文字を、毎回','ちがう 文字に するには？'],g2,{y:540,size:56});
 return s;
};

export const chain00b1Diagrams={
 [K+'intro:rome']:fig(Y0,null,intro),
 [K+'strip:rule']:fig(Y0,null,stripRule),
 [K+'strip:a']:fig(Y0,GU,stripA),
 [K+'strip:bc']:fig(Y0,GU,stripBC),
 [K+'word:cat']:fig(Y0,GU,wordCat),
 [K+'word:back']:fig(Y0,GU,(p,c)=>wordBack(p,c,0)),
 [K+'word:back2']:fig(Y0,GU,(p,c)=>wordBack(p,c,1)),
 [K+'z:q']:fig(Y0,GU,zQ),
 [K+'ring:clock']:fig(Y0,TA,ringClock),
 [K+'ring:wrap']:fig(Y0,TA,ringWrap),
 [K+'ring:z3']:fig(Y0,TA,ringZ3),
 [K+'ring:inner']:fig(Y0,TA,(p,c)=>ringInner(p,c,0)),
 [K+'ring:read']:fig(Y0,TA,(p,c)=>ringInner(p,c,1)),
 [K+'brk:fdw']:fig(Y0,YA,brkFdw),
 [K+'brk:unk']:fig(Y0,YA,brkUnk),
 [K+'brk:25']:fig(Y0,YA,brk25),
 [K+'try:1']:fig(Y0,YA,(p,c)=>tryFig(p,c,0)),
 [K+'try:2']:fig(Y0,YA,(p,c)=>tryFig(p,c,1)),
 [K+'try:3']:fig(Y0,YA,(p,c)=>tryFig(p,c,2)),
 [K+'try:ans']:fig(Y0,YA,(p,c)=>tryFig(p,c,2,{done:true,ans:ws(c,p,'コタエ',{d:.4})})),
 [K+'try:weak']:fig(Y0,YA,tryWeak),
 [K+'sub:leap']:fig(YS,null,subLeap),
 [K+'tab:make']:fig(YS,GU,tabMake),
 [K+'tab:cat']:fig(YS,GU,tabCat),
 [K+'cnt:a']:fig(YS,GU,(p,c)=>countFig(p,c,0)),
 [K+'cnt:b']:fig(YS,GU,(p,c)=>countFig(p,c,1)),
 [K+'cnt:c']:fig(YS,GU,(p,c)=>countFig(p,c,2)),
 [K+'cnt:z']:fig(YS,GU,(p,c)=>countFig(p,c,3)),
 [K+'cnt:all']:fig(YS,GU,cntAll),
 [K+'cnt:time']:fig(YS,TA,cntTime),
 [K+'kindi:odd']:fig((p,c)=>after(c,p,1)>0?YK:YS,null,kindiOdd),
 [K+'class:swap']:fig(YK,TA,classSwap),
 [K+'class:q']:fig(YK,TA,classQ),
 [K+'class:talk']:fig(YK,TA,classTalk),
 [K+'fq:same']:fig(YK,asp2(TA,GU),fqSame),
 [K+'fq:en']:fig(YK,GU,(p,c)=>fqEn(p,c,0)),
 [K+'fq:t']:fig(YK,GU,(p,c)=>fqEn(p,c,1)),
 [K+'fq:ex']:fig(YK,GU,fqEx),
 [K+'fq:long']:fig(YK,GU,(p,c)=>fqLong(p,c,0)),
 [K+'fq:top']:fig(YK,GU,(p,c)=>fqLong(p,c,1)),
 [K+'rd:the']:fig(YK,YA,rdThe),
 [K+'rd:pat']:fig(YK,YA,rdPat),
 [K+'rd:fill']:fig(YK,YA,rdFill),
 [K+'end:result']:fig(YK,null,endResult),
 [K+'next:weak']:fig(YK,null,nextWeak),
 [K+'next:card']:fig(YK,null,nextCard),
};

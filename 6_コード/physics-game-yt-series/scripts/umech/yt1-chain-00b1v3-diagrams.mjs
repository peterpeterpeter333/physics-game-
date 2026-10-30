// 技術の疑問の鎖 序章2-1 第3版（ys-chain-00b1v3）「女王の暗号は、なぜ破られた？」— 図。縦長の舞台 1000×920（vert-v1）。
// 共通の道具（文字の輪・帯・棒グラフ・見方の札・声の窓・計算）は yt1-chain-00bx-common.mjs、得点板は chain-score.mjs（どちらも編集していない）。
// 計算の段・数える印は、声がその文字・数を言う時刻（ws・wt）に出す。値は台本 chain-00b1v3.mjs の冒頭。
// 右上：得点板（y 4–56）と、その下に見方の札（y 66–116）。左上：年と人物。
import {C,seg,clamp,mix,fade,label,line,rect,dot,ring,draw,arrow,poly,W,H,HC,cueT,voiceEnd,vseg,swin,note,plate,bigQ,finalCard,jw,ORANGE,GREEN,RED_,CYAN,fuda,
 ABC,ix,EN,SUB,subst,caesar,shift,TEXT1,C1,CL1,CPCT1,CCNT1,WORDS1,F26,YEARS,counts,letters,pct,
 wt,ws,steps,yearTag2,aspectPill,letterRing,ringXY,ringMark,ringArc,clockFace,RC,strip,stripXY,stripHop,bars,barTop,mono,monoX,CIPH,box,cell,person,bubble} from './yt1-chain-00bx-common.mjs';
import {scoreBoard,SCORE_H,SCORE_COL} from './chain-score.mjs';

const K='chain00b1v3-';
const YQ='1586年 イングランド',YQ7='1587年 イングランド',Y0='紀元前1世紀 ローマ',YS='紀元前1世紀〜 入れ替え暗号',YK='9世紀 バグダッド キンディー';
const GU='具体例',TA='たとえ話',YA='破る側から';
const T=(p,ctx)=>cueT(p,ctx);
const after=(ctx,p,i)=>swin(ctx,p,i,0,.06);
const ok=(c,m)=>{if(!c)throw Error('chain-00b1v3: '+m);};
const n2=v=>Number(v.toFixed(2));

// ================= 包み：年・得点板・見方の札 =================
const S0={make:0,brk:0},S1={make:0,brk:1},S2={make:0,brk:2};
const fig3=(year,aspect,score,fn)=>(p,ctx)=>{
 const y=typeof year==='function'?year(p,ctx):year;
 let a=typeof aspect==='function'?aspect(p,ctx):aspect;if(typeof a==='string')a=[a,1];
 const sc=typeof score==='function'?score(p,ctx):score;
 return fn(p,ctx)+yearTag2(y)+(sc?scoreBoard(sc):'')+(a?`<g transform="translate(0 ${SCORE_H})">${aspectPill(a[0],a[1])}</g>`:'');
};
// 声が needle を言う時刻に、破る側に1点
const scoreAt=(needle,from)=>(p,ctx)=>{const t=T(p,ctx),t0=wt(ctx,needle),u=clamp((t-t0)/.8);
 return {make:from.make,brk:from.brk+(t>=t0?1:0),bump:t>=t0&&u<1?u:0,side:'brk'};};

// ================= 計算と確かめ =================
// 挑戦の暗号：COUNT THE LETTERS を 10 ずらす
export const CHALLENGE=caesar('COUNT THE LETTERS',10);
ok(CHALLENGE==='MYEXD DRO VODDOBC','挑戦 '+CHALLENGE);
ok(caesar(CHALLENGE,-10)==='COUNT THE LETTERS','挑戦を戻す');
// メアリーの手紙の記号（図のための再現。本物の記号表ではない）。A〜Z に 26個の記号
export const GLYPH='○‡∧∂θ∞∆εψΩ≠§¶♯∴λπΣφ∇⊕∩∪≈†◇';
const PERM=[11,4,20,7,9,15,22,0,2,17,24,13,5,19,1,23,8,14,3,21,10,18,6,25,12,16];   // A の記号は GLYPH[PERM[0]] …
export const SYM=PERM.map(i=>[...GLYPH][i]);
ok(new Set(SYM).size===26&&[...GLYPH].length===26,'記号は 26個 すべて ちがう');
const symOf=c=>SYM[ix(c)];
const symText=s=>[...s].map(c=>/[A-Z]/.test(c)?symOf(c):c).join('');
// 行34：TEXT1 を記号に入れ替えて数えた棒
// 棒は 記号の並び（GLYPH の順）に置く：k 本目＝記号 GLYPH[k] の回数
const PCNT=counts(letters(TEXT1));
const SCNT=[...GLYPH].map(gl=>PCNT[SYM.indexOf(gl)]);
const E_BAR=[...GLYPH].indexOf(SYM[ix('E')]);
ok(Math.max(...SCNT)===70&&SCNT[E_BAR]===70&&SCNT.reduce((a,b)=>a+b,0)===541,'記号の 1位は E の記号 70回');
// 長い暗号文：回数の多い順（行30 で 1文字ずつ読めていく順）
const ORDER=CCNT1.map((v,i)=>[v,i]).filter(x=>x[0]>0).sort((a,b)=>b[0]-a[0]||a[1]-b[1]).map(x=>ABC[x[1]]);
ok(ORDER[0]==='X'&&ORDER[1]==='J','回数 1位 X、2位 J');
const PLAIN_OF=Object.fromEntries([...SUB].map((c,i)=>[c,ABC[i]]));
ok(CCNT1[ix('V')]>0&&PLAIN_OF.V==='H','V＝H');
const FILL=['X','J','V',...ORDER.filter(c=>!'XJV'.includes(c))];   // 読めていく順
const NCL=CL1.length;ok(NCL===541,'541文字');
// 暗号文を 1行 36字（語の途中で切らない）に折る
const wrapW=(s,n)=>{const out=[];let cur='';for(const w of s.split(' ')){if((cur?cur+' '+w:w).length>n){out.push(cur);cur=w;}else cur=cur?cur+' '+w:w;}if(cur)out.push(cur);return out;};
const CLINES=wrapW(C1,34),PLINES=wrapW(TEXT1,34);
ok(CLINES.length===PLINES.length&&CLINES.every((l,i)=>l.length===PLINES[i].length),'暗号文と元の文の行が そろう');
// 各行の始まりの文字が、何文字目の文字か（数える印の位置）
const LSTART=(()=>{let a=0;return CLINES.map(l=>{const s=a;a+=letters(l).length;return s;});})();
ok(LSTART.at(-1)+letters(CLINES.at(-1)).length===NCL,'行の文字数の和');
const prefixCounts=k=>counts(CL1.slice(0,k));

// ================= 絵の部品 =================
const NIGHT='#0d1630',STONE='#1b2747',STONE2='#24335a',EDGE='#34466f',WIN='#ffcf67',PAPER='#e8dcc0',PEDGE='#b9a57a',INK='#5a2a0a',WOOD='#8a5a32',WOOD2='#6b4426',HOOP='#3d2a1a';
const KAI='#7fa8ff',MIO='#ff8fb1';
function castle(x,y,s=1,{g=1,lit=1}={}){
 if(g<=0)return '';
 const R=(a,b,w,h)=>rect(x+a*s,y+b*s,w*s,h*s,{fill:STONE,fo:1,stroke:EDGE,sw:2,rx:2});
 let o='';
 // 本体と 2本の塔（凹凸つき）
 o+=R(-230,-180,460,180);
 for(let k=0;k<9;k++)o+=R(-230+k*52,-206,30,28);
 const tower=(cx,h)=>{let t=R(cx-60,-h,120,h);for(let k=0;k<3;k++)t+=R(cx-60+k*45,-h-26,30,28);return t;};
 o+=tower(-260,330)+tower(260,330)+tower(0,260);
 o+=`<path d="M${x-40*s} ${y} V${y-70*s} A${40*s} ${40*s} 0 0 1 ${x+40*s} ${y-70*s} V${y} Z" fill="${NIGHT}" stroke="${EDGE}" stroke-width="2"/>`;
 [[-260,-250],[260,-250],[0,-190],[-130,-110],[130,-110]].forEach(([a,b],i)=>{o+=rect(x+(a-12)*s,y+b*s,24*s,40*s,{fill:i===2?WIN:'#0a1020',fo:i===2?lit:1,stroke:'none',rx:10*s});});
 return fade(g,o);
}
function crown(x,y,s=1,{g=1,col='#e2b553',fo=1}={}){
 if(g<=0)return '';
 const P=[[-60,0],[-70,-60],[-35,-25],[0,-75],[35,-25],[70,-60],[60,0]].map(([a,b])=>[x+a*s,y+b*s]);
 return fade(g,poly(P,{fill:col,fo,stroke:'none'})+rect(x-62*s,y-2*s,124*s,18*s,{fill:col,fo,stroke:'none',rx:4})+[[-70,-60],[0,-75],[70,-60]].map(([a,b])=>dot(x+a*s,y+b*s,8*s,col,fo)).join(''));
}
function barrel(x,y,s=1,{g=1,bung=1}={}){
 if(g<=0)return '';
 const w=170*s,h=240*s,b=26*s;
 let o=`<path d="M${x-w/2} ${y-h/2} Q${x-w/2-b} ${y} ${x-w/2} ${y+h/2} L${x+w/2} ${y+h/2} Q${x+w/2+b} ${y} ${x+w/2} ${y-h/2} Z" fill="${WOOD}" stroke="${WOOD2}" stroke-width="3"/>`;
 for(let k=-2;k<=2;k++)o+=line(x+k*w/5.5,y-h/2,x+k*w/5.5*1.08,y+h/2,{color:WOOD2,w:2,opacity:.7});
 [-.36,-.18,.18,.36].forEach(f=>{const yy=y+f*h,bx=b*(1-4*f*f);o+=`<path d="M${x-w/2-bx} ${yy} Q${x} ${yy+8*s} ${x+w/2+bx} ${yy}" fill="none" stroke="${HOOP}" stroke-width="${8*s}"/>`;});
 if(bung)o+=`<ellipse cx="${x}" cy="${y-h/2}" rx="${w/2}" ry="${16*s}" fill="${WOOD2}" stroke="${HOOP}" stroke-width="3"/>`+`<circle cx="${x+30*s}" cy="${y-h/2}" r="${13*s}" fill="#c9a06a" stroke="${HOOP}" stroke-width="2"/>`;
 return fade(g,o);
}
// 小さく折った手紙
const folded=(x,y,s=1,g=1,rot=0)=>fade(g,`<g transform="translate(${n2(x)} ${n2(y)}) rotate(${rot}) scale(${s})"><rect x="-22" y="-14" width="44" height="28" rx="3" fill="${PAPER}" stroke="${PEDGE}" stroke-width="2"/><path d="M-22 -14 L0 2 L22 -14" fill="none" stroke="${PEDGE}" stroke-width="2"/></g>`);
// 記号の手紙（図のための再現）。rows：英文の行（記号に変える）。n：見せる行数。cols：文字ごとの色
function symLetter(x,y,w,h,rows,{g=1,size=40,shown=1,ps=null,psG=0,hl=null,tilt=-2}={}){
 if(g<=0)return '';
 let o=`<g transform="rotate(${tilt} ${x+w/2} ${y+h/2})">`+rect(x,y,w,h,{fill:PAPER,fo:1,stroke:PEDGE,sw:4,rx:10});
 const cw=size*.95,per=Math.floor((w-60)/cw);
 rows.forEach((r,i)=>{const yy=y+70+i*size*1.45;if(yy>y+h-30)return;const vis=Math.round([...r].length*clamp(shown*rows.length-i));
  [...symText(r)].slice(0,Math.min(per,vis)).forEach((c,k)=>{if(c===' ')return;const L=r[k],col=hl&&hl(L)?hl(L):INK;o+=label(c,x+34+k*cw+cw/2,yy,{size,color:col,anchor:'middle',weight:700});});});
 if(ps&&psG>0){const yy=y+h-50;[...symText(ps)].slice(0,Math.round(ps.length*psG)).forEach((c,k)=>{if(c!==' ')o+=label(c,x+34+k*cw+cw/2,yy,{size,color:'#b0281a',anchor:'middle',weight:700});});}
 o+=label('再現',x+w-18,y+h-16,{size:36,color:'#8a7a55',anchor:'end',weight:700});
 return fade(g,o+'</g>');
}
function lock(x,y,s=1,{g=1,open=0,col='#c9d6ea'}={}){
 if(g<=0)return '';
 const lift=open*28*s;
 return fade(g,`<path d="M${x-30*s} ${y-20*s-lift} V${y-50*s-lift} A${30*s} ${30*s} 0 0 1 ${x+30*s} ${y-50*s-lift} V${open?y-50*s-lift+14*s:y-20*s}" fill="none" stroke="${col}" stroke-width="${10*s}" stroke-linecap="round"/>`+rect(x-48*s,y-26*s,96*s,80*s,{fill:col,fo:1,stroke:'none',rx:10*s})+dot(x,y+8*s,9*s,'#0b1122'));
}
// 小さな顔の印（掛け合いの人）。色の丸だけ（顔は描かない）
const chip=(who,x,y,{g=1,r=34,on=1}={})=>{const col=who==='mio'?MIO:KAI,name=who==='mio'?'ミオ':'カイ';
 return fade(g,`<circle cx="${x}" cy="${y}" r="${r}" fill="${col}" fill-opacity="${on?1:.3}"/>`+label(name,x,y+r+44,{size:36,color:col,anchor:'middle',weight:700}));};
// 吹き出しの板（ミオの問いなど）
function say(text,x,y,{who='mio',g=1,size=44,anchor='middle'}={}){
 if(g<=0)return '';const col=who==='mio'?MIO:KAI,w=jw(text)*size+56,x0=anchor==='middle'?x-w/2:x;
 return fade(g,rect(x0,y-size-18,w,size+40,{fill:'#131f38',fo:.96,stroke:col,sw:3,rx:24})+label(text,x0+w/2,y,{size,color:col,anchor:'middle',weight:700}));
}
// 年表（紀元前1世紀・9世紀・1586年）
const TL={y:520,x:[150,470,830],lab:['紀元前1世紀','9世紀','1586年'],sub:['カエサル','キンディー','メアリー']};
function timeline({g=1,at=2,hl=[],gi=[1,1,1]}={}){
 if(g<=0)return '';
 let o=line(80,TL.y,920,TL.y,{color:C.dim,w:4});
 TL.x.forEach((x,i)=>{if(gi[i]<=0)return;const c=hl.includes(i)?HC:C.ink;o+=fade(gi[i],dot(x,TL.y,12,c)+label(TL.lab[i],x,TL.y-40,{size:40,color:c,anchor:'middle',weight:700})+label(TL.sub[i],x,TL.y+66,{size:40,color:hl.includes(i)?HC:C.dim,anchor:'middle',weight:700}));});
 const xa=typeof at==='number'?mix(TL.x[Math.floor(at)],TL.x[Math.min(2,Math.floor(at)+1)],at-Math.floor(at)):TL.x[2];
 o+=`<polygon points="${xa},${TL.y-80} ${xa-16},${TL.y-108} ${xa+16},${TL.y-108}" fill="${HC}"/>`;
 return fade(g,o);
}

// ================= 1〜6 女王の手紙 =================
const qCastle=(p,ctx)=>{
 const t=T(p,ctx),g=vseg(ctx,p,0,.2),gC=ws(ctx,p,'ジョオオ',{d:.8}),gT=ws(ctx,p,'サイバン',{d:.5});
 let s=rect(0,0,W,H,{fill:NIGHT,fo:1,stroke:'none',rx:0});
 s+=fade(g,`<circle cx="790" cy="230" r="54" fill="#e8e2cf" fill-opacity=".85"/><circle cx="812" cy="216" r="50" fill="${NIGHT}"/>`);
 s+=crown(500,330,2.2,{g:gC,col:'#e2b553',fo:.16});
 s+=castle(500,760,1,{g});
 s+=rect(0,760,W,160,{fill:'#0a1124',fo:1,stroke:'none',rx:0});
 s+=fade(gT,plate('裁判に かけられる 女王',500,880,{size:48,color:HC,anchor:'middle'}));
 return s;
};
const qMary=(p,ctx)=>{
 const g=vseg(ctx,p,0,.25),gM=ws(ctx,p,'メアリイ',{d:.4});
 let s=rect(0,0,W,H,{fill:NIGHT,fo:1,stroke:'none',rx:0})+castle(500,760,.6,{g:.35});
 s+=person(500,620,{col:'#7a5a8a',g,s:1.6})+crown(500,388,.7,{g});
 s+=fade(g,plate('スコットランドの 女王',500,760,{size:46,color:C.ink,anchor:'middle'}));
 s+=fade(gM,plate('メアリー',500,860,{size:60,color:HC,anchor:'middle'}));
 return s;
};
const qPrison=(p,ctx)=>{
 const t=T(p,ctx),gB=ws(ctx,p,'トジコメ',{d:.5}),gF=ws(ctx,p,'ナカマ',{d:.5}),gL=ws(ctx,p,'テガミオ',{d:.4}),u=seg(t,wt(ctx,'ヤリトリ'),voiceEnd(ctx)+.4);
 let s=rect(0,0,W,H,{fill:NIGHT,fo:1,stroke:'none',rx:0});
 // 窓に鉄格子、中にメアリー
 s+=rect(90,200,360,420,{fill:STONE,fo:1,stroke:EDGE,sw:3,rx:6})+rect(150,280,240,260,{fill:'#0a1020',fo:1,stroke:EDGE,sw:3,rx:120});
 s+=person(270,520,{col:'#7a5a8a',s:.9})+crown(270,388,.35);
 for(let k=0;k<5;k++)s+=fade(gB,line(170+k*50,280,170+k*50,540,{color:'#9aabc7',w:6}));
 s+=fade(gB,plate('閉じこめられた まま',270,680,{size:44,color:C.ink,anchor:'middle'}));
 s+=person(700,560,{col:'#4f7a5a',g:gF,s:.9})+person(840,580,{col:'#5a6a8a',g:gF,s:.8})+fade(gF,label('外の 仲間',770,680,{size:44,color:C.dim,anchor:'middle',weight:700}));
 // 手紙が行き来する
 if(gL>0){const x1=mix(400,640,(u*2)%1),x2=mix(640,400,((u*2)+.5)%1);s+=fade(gL,draw([[400,420],[640,420]],1,{color:HC,w:3,dash:'10 10'})+folded(x1,400,1.3)+folded(x2,450,1.3));
  s+=fade(gL,plate('手紙を やり取り',520,820,{size:46,color:HC,anchor:'middle'}));}
 return s;
};
const qBarrel=(p,ctx)=>{
 const t=T(p,ctx),gT=ws(ctx,p,'タル',{d:.5}),gS=ws(ctx,p,'セン',{d:.4}),gK=ws(ctx,p,'カクシテ',{d:.6}),gH=ws(ctx,p,'ハコバレ',{d:1.4});
 let s=rect(0,0,W,H,{fill:NIGHT,fo:1,stroke:'none',rx:0});
 const bx=mix(300,560,gH);
 s+=barrel(bx,560,1.25,{g:Math.max(gT,vseg(ctx,p,0,.12))});
 s+=fade(gT,label('ビールの たる',bx,800,{size:44,color:C.ink,anchor:'middle',weight:700}));
 // 栓を拡大した丸
 const [cx,cy]=[bx+38,560-150];
 s+=fade(gS*(1-gH*.6),ring(cx,cy,26,{color:HC,w:4})+line(cx+20,cy-20,cx+150,cy-120,{color:HC,w:3})+`<circle cx="${cx+230}" cy="${cy-190}" r="110" fill="#c9a06a" stroke="${HC}" stroke-width="5"/>`+`<circle cx="${cx+230}" cy="${cy-190}" r="62" fill="#6b4426"/>`
  +folded(cx+230,mix(cy-330,cy-190,gK),1.6,gK)+label('栓',cx+230,cy-50,{size:40,color:HC,anchor:'middle',weight:700}));
 s+=fade(gK*(1-gH*.6),plate('栓の 中に 手紙',cx+230,cy+30,{size:42,color:HC,anchor:'middle'}));
 s+=fade(gH,arrow(bx+140,700,bx+330,700,{color:HC,w:5,head:20})+plate('運ばれる',bx+240,660,{size:42,color:HC,anchor:'middle'}));
 return s;
};
const LETTER_ROWS=['I HAVE READ YOUR','LETTER AND I AM','READY TO HELP','IN THIS PLAN'];   // 図のための英文（記号に変えて見せる）
const qLetter=(p,ctx)=>{
 const t=T(p,ctx),g=vseg(ctx,p,0,.25),gA=ws(ctx,p,'アンゴオ',{d:.4}),gK=ws(ctx,p,'キゴオ',{d:.5}),gM=ws(ctx,p,'オキカエタ',{d:.5});
 let s=symLetter(140,150,720,470,LETTER_ROWS,{g,shown:1});
 s+=fade(gA,plate('暗号',500,690,{size:56,color:HC,anchor:'middle'}));
 // 文字 → 記号 の例（A B C D E）
 s+=fade(gK,label('文字 → 記号',90,840,{size:40,color:'#ffb380',weight:700}));
 ['A','B','C','D','E'].forEach((L,i)=>{const x=420+i*110;s+=fade(gM,label(L,x,795,{size:46,color:C.ink,anchor:'middle',weight:700})+arrow(x,808,x,840,{color:HC,w:3,head:10})+label(symOf(L),x,895,{size:46,color:'#ffb380',anchor:'middle',weight:700}));});
 return s;
};
const qMio=(p,ctx)=>{
 const g=vseg(ctx,p,0,.3),gQ=ws(ctx,p,'ヨマレ',{d:.4});
 let s=symLetter(250,170,500,330,LETTER_ROWS.slice(0,3),{size:34,g:.85});
 s+=lock(500,640,1.4,{g});
 s+=say('見つかっても 読まれない？',500,860,{g:gQ});
 return s;
};
const qBelieve=(p,ctx)=>{
 const g=vseg(ctx,p,0,.3);
 let s=symLetter(250,170,500,330,LETTER_ROWS.slice(0,3),{size:34,g:.85})+lock(500,640,1.4);
 s+=person(170,820,{col:'#7a5a8a',s:.7,g})+crown(170,735,.3,{g});
 s+=fade(g,plate('メアリーも そう 信じた',560,860,{size:46,color:C.ink,anchor:'middle'}));
 return s;
};
const qPlot=(p,ctx)=>{
 const t=T(p,ctx),gE=ws(ctx,p,'エリザベス',{d:.5}),gA=ws(ctx,p,'アンサツ',{d:.5}),gD=ws(ctx,p,'ドオイ',{d:.5});
 let s=symLetter(140,150,720,470,LETTER_ROWS,{g:1,shown:1});
 s+=fade(gE,rect(600,640,360,240,{fill:'#131f38',fo:.95,stroke:C.faint,sw:2,rx:16})+crown(780,730,.5)+label('エリザベス',780,800,{size:44,color:C.ink,anchor:'middle',weight:700})+label('イングランドの 女王',780,856,{size:36,color:C.dim,anchor:'middle',weight:700}));
 s+=fade(gA,rect(70,300,860,200,{fill:'#2a0f14',fo:.92,stroke:RED_,sw:5,rx:20})+label('暗殺の 計画に',500,385,{size:64,color:RED_,anchor:'middle',weight:700}));
 s+=fade(gD,label('同意',500,470,{size:72,color:RED_,anchor:'middle',weight:700}));
 return s;
};
// 行6：命が懸かる → 得点板が 大きく出て、右上へ
const qTitle=(p,ctx)=>{
 const t=T(p,ctx),gI=ws(ctx,p,'イノチ',{d:.5}),gK=ws(ctx,p,'コノアンゴオワ',{d:.5}),tM=wt(ctx,'マモリキレタ'),u=seg(t,tM+.6,voiceEnd(ctx)+.8);
 let s=rect(0,0,W,H,{fill:NIGHT,fo:1,stroke:'none',rx:0});
 s+=fade(vseg(ctx,p,0,.1)*(1-gK),symLetter(250,150,500,300,LETTER_ROWS.slice(0,3),{size:34}));
 s+=fade(gI*(1-gK),plate('読まれたら → 命は ない',500,560,{size:52,color:RED_,anchor:'middle'}));
 // 得点板（大 → 右上）
 const cx0=792,cy0=30,cx=mix(500,cx0,u),cy=mix(300,cy0,u),sc=mix(2.1,1,u);
 if(gK>0)s+=`<g transform="translate(${n2(cx)} ${n2(cy)}) scale(${n2(sc)}) translate(${-cx0} ${-cy0})">`+scoreBoard({...S0,g:gK})+'</g>';
 s+=fade(gK*(1-u),label('暗号を 作る側 と 破る側 の 勝負',500,470,{size:44,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(ws(ctx,p,'マモリキレタ',{d:.5}),bigQ(500,800,1,150)+label('守り切れた？',500,880,{size:48,color:HC,anchor:'middle',weight:700}));
 return s;
};

// ================= 7〜15 カエサル暗号 =================
const czRome=(p,ctx)=>{
 const t=T(p,ctx),g=vseg(ctx,p,0,.15),tm=wt(ctx,'マエニ'),at=2-2*seg(t,tm,wt(ctx,'フルイ')+.5),gC=ws(ctx,p,'カエサル',{d:.5});
 let s=timeline({g,at,hl:gC>0?[0]:[],gi:[1,.35,1]});
 s+=fade(ws(ctx,p,'イチバンフルイ',{d:.4}),plate('一番 古い 形から',500,330,{size:48,color:HC,anchor:'middle'}));
 s+=fade(gC,box(160,660,680,180,{col:HC})+label('カエサルの 暗号',500,742,{size:56,color:HC,anchor:'middle',weight:700})+label('古代ローマ',500,808,{size:40,color:C.dim,anchor:'middle',weight:700}));
 return s;
};
const SO={x0:68,y0:330,dx:72,dy:170};
const czRule=(p,ctx)=>{
 const g=vseg(ctx,p,0,.3),g2=ws(ctx,p,'ミッツサキ',{d:.4});
 return strip({...SO,g})+fade(g2,box(150,660,700,130,{col:HC})+label('3つ 先の 文字に 置きかえる',500,742,{size:44,color:HC,anchor:'middle',weight:700}));
};
const czA=(p,ctx)=>{
 const t=T(p,ctx),gA=ws(ctx,p,'エエノ',{d:.25}),n=steps(t,[wt(ctx,'ビイ'),wt(ctx,'スィイ'),wt(ctx,'ディイ')]),gD=ws(ctx,p,'ディイ',{occ:1,d:.3});
 const hl={};if(gA>0)hl[0]=HC;if(gD>0)hl[3]=GREEN;
 let s=strip({...SO,hl});if(gA>0)s+=stripHop(n,0,{o:SO});
 s+=fade(gD,box(250,660,500,140,{col:GREEN})+label('A → D',500,755,{size:64,color:GREEN,anchor:'middle',weight:700}));
 return s;
};
const CATX=[340,500,660];
const czCat=(p,ctx)=>{
 const gS=[ws(ctx,p,'スィイガ',{d:.2}),ws(ctx,p,'エエガ',{d:.2}),ws(ctx,p,'ティイガ',{d:.2})];
 const gC=[ws(ctx,p,'エフ',{d:.3}),ws(ctx,p,'ディイ',{d:.3}),ws(ctx,p,'ダブリュウ',{d:.3})],gR=ws(ctx,p,'エフディイダブリュウ',{d:.4});
 let s=label('元',90,286,{size:40,color:C.dim,weight:700})+label('暗号',70,576,{size:40,color:CIPH,weight:700});
 [...'CAT'].forEach((L,i)=>{const on=gS[i]>.5&&gC[i]<.5;s+=cell(L,CATX[i],270,{size:56,w:96,h:110,edge:on?HC:C.faint,sw:on?4:2});
  s+=fade(gC[i],arrow(CATX[i],335,CATX[i],490,{color:HC,w:4,head:16})+label('+3',CATX[i]+14,425,{size:36,color:HC,weight:700}))+cell('FDW'[i],CATX[i],560,{size:56,w:96,h:110,color:CIPH,edge:CIPH,g:gC[i]});});
 s+=fade(gR,rect(CATX[0]-70,490,CATX[2]-CATX[0]+140,140,{fill:'none',fo:0,stroke:GREEN,sw:5,rx:16})+plate('暗号は FDW',500,740,{size:52,color:GREEN,anchor:'middle'}));
 s+=fade(gS[0],note('C+3＝F、A+3＝D、T+3＝W',500,840,{anchor:'middle'}));
 return s;
};
const SZ={...SO,x0:44,dx:68};
const czZ=(p,ctx)=>{
 const t=T(p,ctx),gZ=ws(ctx,p,'ゼット',{d:.3}),t0=wt(ctx,'ミッツ'),n=seg(t,t0,t0+.6);
 let s=strip({...SZ,hl:gZ>0?{25:HC}:{}});const [zx,zy]=stripXY(25,SZ);
 if(gZ>0){const x=zx+n*68,y=zy-66-Math.sin(Math.PI*n)*36;s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="13" fill="${HC}"/>`;}
 s+=fade(n,rect(zx+38,zy-46,60,64,{fill:'none',fo:0,stroke:HC,sw:3,rx:10})+label('？',zx+68,zy,{size:48,color:HC,anchor:'middle',weight:700}));
 s+=fade(n,plate('Z の 先に、文字が ない',500,740,{size:48,color:HC,anchor:'middle'}));
 return s;
};
// 行11：時計 → 文字の輪。Z の次は A、Z+3＝C
const ringZ=(p,ctx)=>{
 const t=T(p,ctx),t12=wt(ctx,'ジュウニ'),t1=wt(ctx,'イチニ'),tR=wt(ctx,'ワニ'),tz=wt(ctx,'ゼットノツギ'),ta=wt(ctx,'エエニ');
 const tz3=wt(ctx,'ゼットノミッツ'),tC=wt(ctx,'スィイデス');
 const hand=11.3+.7*seg(t,t12-.2,t12+.3)+1*seg(t,t1-.1,t1+.4);
 const gClock=1-seg(t,tR+.6,tR+1.2);
 let s=clockFace(185,250,160,{hand,g:Math.max(.0,1),hl:{12:hand>11.8&&hand<12.4?HC:undefined,1:hand>12.7?GREEN:undefined}});
 s+=label('12 の 次は 1',380,190,{size:40,color:C.dim,weight:700});
 const R2={cx:575,cy:640,R:240};
 const gR=seg(t,tR-.3,tR+.4);
 const pos=25+seg(t,ta-.3,ta+.2);
 const n3=steps(t,[0,1,2].map(k=>mix(tz3+.3,tC,k/3)),.3);
 const hl={};if(t>tz)hl[25]=HC;if(pos>25.95&&t<tz3)hl[0]=GREEN;if(t>tC-.05)hl[2]=GREEN;
 s+=letterRing({...R2,hl,band:70,size:38,g:gR});
 if(t>tz-.1&&t<tz3)s+=ringArc(R2.cx,R2.cy,R2.R+62,25,pos,{color:HC,p:1});
 s+=fade(seg(t,ta,ta+.4)*(1-seg(t,tz3,tz3+.3)),plate('Z の 次は A',575,655,{size:44,color:GREEN,anchor:'middle'}));
 if(t>tz3)s+=ringMark(R2.cx,R2.cy,R2.R,25+n3,{from:25,count:n3,cR:R2.R+68});
 s+=fade(seg(t,tC,tC+.4),plate('Z → C',R2.cx,R2.cy+18,{size:60,color:GREEN,anchor:'middle'}));
 return s;
};
const RG={cx:500,cy:520,R:300};
const brkFdw=(p,ctx)=>{
 const gF=vseg(ctx,p,0,.12),gM=ws(ctx,p,'ミオサン',{d:.4});
 let s=fade(gF,`<rect x="250" y="220" width="500" height="300" rx="12" fill="${PAPER}" stroke="${PEDGE}" stroke-width="4" transform="rotate(-3 500 370)"/>`+mono('FDW',500,420,{size:110,cw:.8,color:'#a33a12',anchor:'middle'})+label('暗号文',500,300,{size:40,color:'#5e4128',anchor:'middle',weight:700}));
 s+=fade(gF,plate('何目盛り ずらした？ → 分からない',500,640,{size:44,color:'#ff8f6b',anchor:'middle'}));
 s+=chip('mio',500,760,{g:gM,r:30});
 return s;
};
const brkMio=(p,ctx)=>{
 const t=T(p,ctx),g=vseg(ctx,p,0,.3),wob=Math.sin(t*2.2)*1.5,gZ=ws(ctx,p,'ゼンブ',{d:.4});
 let s=letterRing({...RG,cy:480,R:270,inner:'??????????????????????????',rot:-3+wob,g});
 s+=fade(g,plate('何目盛り？',500,495,{size:48,color:'#ff8f6b',anchor:'middle'}));
 s+=label('暗号文',40,180,{size:38,color:C.dim,weight:700})+mono('FDW',40,240,{size:56,cw:.8,color:CIPH});
 s+=say('全部 試せば いい？',500,880,{g:gZ});
 return s;
};
const brk25=(p,ctx)=>{
 const t=T(p,ctx),t1=wt(ctx,'ヒトメモリ'),t25=wt(ctx,'ニジュウゴメモリ'),g25=ws(ctx,p,'ニジュウゴトオリ',{d:.4}),gS=ws(ctx,p,'セイカイ',{d:.3});
 let s=fade(gS*(1-seg(t,t1-.2,t1)),plate('正解',500,300,{size:72,color:GREEN,anchor:'middle'}));
 for(let k=1;k<=25;k++){const tk=mix(t1,t25,(k-1)/24),gk=seg(t,tk,tk+.25),r=Math.floor((k-1)/5),c=(k-1)%5;
  s+=fade(gk,cell(String(k),220+c*140,200+r*120,{size:44,w:110,h:90,color:C.ink,edge:C.faint}));}
 s+=fade(g25,box(250,800,500,100,{col:HC})+label('ずらし方は 25通り',500,866,{size:48,color:HC,anchor:'middle',weight:700}));
 return s;
};
const TRY=[['ECV',['イイ','スィイ','ブイ']],['DBU',['ディイ','ビイ','ユウ']],['CAT',['キャット','キャット','キャット']]];
const TX=[560,680,800];
const brkTry=(p,ctx)=>{
 const t=T(p,ctx);
 let s=label('暗号文',70,200,{size:40,color:C.dim,weight:700});
 [...'FDW'].forEach((L,i)=>{s+=cell(L,TX[i],186,{size:52,w:92,h:100,color:CIPH,edge:CIPH});});
 const tr=[wt(ctx,'ヒトツ'),wt(ctx,'フタツ'),wt(ctx,'ミッツ')];
 TRY.forEach(([w,nd],r)=>{const gr=seg(t,tr[r],tr[r]+.3);if(gr<=0)return;const y=350+r*150;
  s+=fade(gr,label(`${r+1}つ 戻す`,70,y+16,{size:42,color:C.dim,weight:700}));
  [...w].forEach((L,i)=>{const g=ws(ctx,p,nd[i],{d:.25,occ:0,lag:r===2?i*.12:0});s+=cell(L,TX[i],y,{size:52,w:92,h:100,g,color:r===2?GREEN:C.ink,edge:C.faint});});});
 const gA=seg(t,voiceEnd(ctx)-.1,voiceEnd(ctx)+.4);
 s+=fade(gA,rect(TX[0]-62,650-62,TX[2]-TX[0]+124,124,{fill:'none',fo:0,stroke:GREEN,sw:5,rx:16})+`<circle cx="${TX[2]+120}" cy="650" r="40" fill="none" stroke="${GREEN}" stroke-width="7"/>`+plate('意味の ある 言葉 → 答え',500,820,{size:44,color:GREEN,anchor:'middle'}));
 return s;
};
const brkWin=(p,ctx)=>{
 const g1=ws(ctx,p,'スウフン',{d:.4}),g2=ws(ctx,p,'カチデス',{d:.5});
 let s=fade(vseg(ctx,p,0,.12),label('25通り',500,330,{size:72,color:C.ink,anchor:'middle',weight:700}))+fade(g1,arrow(500,370,500,450,{color:HC,w:5,head:18})+label('手でも 数分',500,530,{size:60,color:HC,anchor:'middle',weight:700}));
 s+=fade(g2,box(150,640,700,150,{col:SCORE_COL.brk})+label('破る側の 勝ち',500,738,{size:64,color:SCORE_COL.brk,anchor:'middle',weight:700}));
 return s;
};

// ================= 16〜21 入れ替え暗号 =================
const subLeap=(p,ctx)=>{
 const g0=ws(ctx,p,'ツクルガワ',{d:.4}),gL=ws(ctx,p,'ズラス',{d:.4}),gR=ws(ctx,p,'バラバラ',{d:.5});
 let s=fade(g0,plate('作る側の 工夫',500,190,{size:46,color:SCORE_COL.make,anchor:'middle'}));
 let L='';['A','B','C','D'].forEach((c,i)=>{const y=350+i*110;L+=label(c,90,y+14,{size:44,color:C.ink,anchor:'middle',weight:700})+arrow(126,y,276,y,{color:'#8aa0c4',w:4,head:14})+label(shift(c,3),316,y+14,{size:44,color:CIPH,anchor:'middle',weight:700});});
 s+=fade(gL,box(30,260,410,500,{col:'#8aa0c4'})+L+label('ずらす（やめる）',235,820,{size:40,color:C.dim,anchor:'middle',weight:700})+line(60,290,410,730,{color:RED_,w:5,opacity:.7}));
 let R='';['A','B','C','D'].forEach((c,i)=>{const y=350+i*110;R+=label(c,600,y+14,{size:44,color:C.ink,anchor:'middle',weight:700})+arrow(636,y,786,y,{color:HC,w:4,head:14})+label(SUB[i],826,y+14,{size:44,color:CIPH,anchor:'middle',weight:700});});
 s+=fade(gR,box(540,260,410,500,{col:HC})+R+label('行き先を ばらばらに',745,820,{size:40,color:HC,anchor:'middle',weight:700}));
 return s;
};
const TB={x0:104,dx:66,y:[300,400,600,700]};
const tabXY=(j,row)=>[TB.x0+(j%13)*TB.dx,TB.y[Math.floor(j/13)*2+row]];
function table(gj,{hl={}}={}){
 let s='';
 for(let j=0;j<26;j++){const [x,y]=tabXY(j,0),[,y2]=tabXY(j,1),g=gj(j),c=hl[j];
  if(c)s+=rect(x-28,y-50,56,y2-y+72,{fill:c,fo:.18,stroke:c,sw:3,rx:10});
  s+=label(ABC[j],x,y,{size:42,color:c??C.ink,anchor:'middle',weight:700});
  s+=fade(g,line(x,y+14,x,y2-44,{color:C.faint,w:2})+label(SUB[j],x,y2,{size:42,color:c??CIPH,anchor:'middle',weight:700}));}
 s+=label('元',30,TB.y[0],{size:36,color:C.dim,weight:700})+label('先',30,TB.y[1],{size:36,color:CIPH,weight:700})+label('元',30,TB.y[2],{size:36,color:C.dim,weight:700})+label('先',30,TB.y[3],{size:36,color:CIPH,weight:700});
 return s;
}
const subTable=(p,ctx)=>{
 const t=T(p,ctx),g3=[ws(ctx,p,'キュウ',{d:.3}),ws(ctx,p,'ダブリュウ',{d:.3}),ws(ctx,p,'イイ',{d:.3})];
 const tr=wt(ctx,'ヒョオオ'),te=voiceEnd(ctx)+.3;
 const gj=j=>j<3?g3[j]:seg(t,mix(tr,te,(j-3)/23),mix(tr,te,(j-3)/23)+.2);
 const hl={};[0,1,2].forEach(j=>{if(g3[j]>0&&t<tr)hl[j]=HC;});
 return table(gj,{hl})+label('入れ替えの 表（例）',500,180,{size:42,color:C.dim,anchor:'middle',weight:700})+fade(seg(t,te-.2,te+.4),note('表は 図のための 例',500,830,{anchor:'middle'}));
};
// 行17：26 × 25 × 24 × … × 1 を1段ずつ
const PROD=[['26','ニジュウロク'],['× 25','ニジュウゴ'],['× 24','ニジュウヨン'],['× … × 1','ヒトトオリ']];
function prodLine(ctx,p,{all=false,y=640}={}){
 let s='',x=150;
 PROD.forEach(([q,nd],i)=>{const g=all?1:ws(ctx,p,nd,{d:.4});s+=fade(g,label(q,x,y,{size:58,color:all?C.ink:HC,weight:700}));x+=jw(q)*58+40;});
 return s;
}
const cntSteps=(p,ctx)=>{
 const t=T(p,ctx),gQ=ws(ctx,p,'ナントオリ',{d:.4});
 let s=fade(gQ,label('表は 何通り 作れる？',500,190,{size:46,color:C.ink,anchor:'middle',weight:700}));
 const rows=[['A','ニジュウロク','26通り'],['B','ニジュウゴ','残り 25通り'],['C','ニジュウヨン','24通り'],['Z','ヒトトオリ','最後は 1通り']];
 rows.forEach(([L,nd,txt],i)=>{const g=ws(ctx,p,nd,{d:.4,lag:-.3}),y=300+i*80;
  s+=fade(g,cell(L,160,y-14,{size:44,w:80,h:68,color:HC,edge:HC})+label('の 行き先',220,y,{size:40,color:C.dim,weight:700})+label(txt,560,y,{size:44,color:C.ink,weight:700}));});
 s+=prodLine(ctx,p,{y:720});
 s+=fade(ws(ctx,p,'ヒトトオリ',{d:.4}),note('使った 文字は もう 選べない',500,830,{anchor:'middle'}));
 return s;
};
const cntAll=(p,ctx)=>{
 const g1=ws(ctx,p,'カケルト',{d:.4}),g2=ws(ctx,p,'ヤク',{d:.4});
 let s=prodLine(ctx,p,{all:true,y:240});
 s+=fade(g1,label('＝ 26!（26の 階乗）',500,380,{size:52,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(g2,label('≈ 4×10²⁶ 通り',500,560,{size:80,color:HC,anchor:'middle',weight:700})+note('＝ 403291461126605635584000000',500,660,{anchor:'middle'}));
 return s;
};
const cntQ=(p,ctx)=>{
 const g=vseg(ctx,p,0,.2),gQ=ws(ctx,p,'ドノクライ',{d:.4});
 let s=fade(g,label('4×10²⁶',500,380,{size:120,color:HC,anchor:'middle',weight:700}));
 s+=fade(g,note('4 の後ろに 0 が 26個',500,480,{anchor:'middle'}));
 s+=say('どのくらい？',500,700,{g:gQ,size:52});
 return s;
};
const cntTime=(p,ctx)=>{
 const t=T(p,ctx),g1=vseg(ctx,p,0,.12),g2=ws(ctx,p,'ゼンブオ',{d:.4}),g2b=ws(ctx,p,'タメスノニ',{d:.4}),g3=ws(ctx,p,'ヤク',{d:.4});
 let s=fade(g1,box(90,150,820,110,{col:'#8aa0c4'})+label('1秒に 1兆＝10¹² 通り 試す 機械',500,222,{size:44,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(g2,label('4×10²⁶ ÷ 10¹² ＝ 4×10¹⁴ 秒',500,350,{size:50,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(g2b,label('4×10¹⁴ 秒 ÷ 3.16×10⁷ 秒（1年）',500,450,{size:46,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(g3,label('≈ 1.3×10⁷ 年 ＝ 約1300万年',500,560,{size:56,color:HC,anchor:'middle',weight:700}));
 // 1300万年の帯と、カエサルから今まで（約2000年）
 const gB=seg(t,wt(ctx,'ヤク')+.4,voiceEnd(ctx)+.6);
 s+=fade(gB,rect(80,640,840*gB,60,{fill:HC,fo:.8,stroke:'none',rx:6})+label('1300万年',90,760,{size:40,color:HC,weight:700})
  +line(80,620,80,720,{color:GREEN,w:4})+label('カエサルから 今まで 約2000年（線より 細い）',80,820,{size:36,color:GREEN,weight:700}));
 s+=fade(g2b,note('1年 ≈ 3.16×10⁷ 秒',880,890,{anchor:'end'}));
 return s;
};
const cntMis=(p,ctx)=>{
 const g=vseg(ctx,p,0,.3),gF=seg(T(p,ctx),voiceEnd(ctx)-.2,voiceEnd(ctx)+.3);
 let s=lock(500,420,2.2,{g});
 s+=fade(g,label('約1300万年',500,620,{size:56,color:C.ink,anchor:'middle',weight:700}));
 s+=say('今度こそ 絶対に 破れない！',500,780,{g:vseg(ctx,p,.2,.5),size:48});
 s+=fuda('誤解？',870,880,{anchor:'end',g:gF,color:ORANGE,size:40});
 return s;
};
const subMary=(p,ctx)=>{
 const t=T(p,ctx),g=vseg(ctx,p,0,.2),gK=ws(ctx,p,'キゴオ',{d:.4}),gS=ws(ctx,p,'イレカエ',{d:.4});
 let s=symLetter(40,150,440,400,LETTER_ROWS,{size:34,g});
 // 入れ替え表（記号）A〜F
 s+=fade(gK,box(530,150,430,450,{col:'#ffb380'})+label('文字 → 記号',745,210,{size:40,color:'#ffb380',anchor:'middle',weight:700}));
 ['A','B','C','D','E','F'].forEach((L,i)=>{const y=280+i*52;s+=fade(gK,label(L,640,y,{size:40,color:C.ink,anchor:'middle',weight:700})+arrow(668,y-12,760,y-12,{color:'#8aa0c4',w:3,head:10})+label(symOf(L),800,y,{size:40,color:'#ffb380',anchor:'middle',weight:700}));});
 s+=fade(gS,box(130,690,740,150,{col:HC})+label('しくみは 同じ：入れ替え表',500,784,{size:48,color:HC,anchor:'middle',weight:700}));
 return s;
};

// ================= 22 一時停止 =================
const thinkPause=(p,ctx)=>{
 const t=T(p,ctx),ve=voiceEnd(ctx),g=vseg(ctx,p,0,.15),gQ=swin(ctx,p,1,0,.15),u=clamp((t-ve)/3);
 let s=fade(g,`<circle cx="500" cy="300" r="140" fill="#131f38" stroke="${HC}" stroke-width="8"/>`+rect(445,225,36,150,{fill:HC,fo:1,stroke:'none',rx:6})+rect(519,225,36,150,{fill:HC,fo:1,stroke:'none',rx:6}));
 s+=fade(g,label('考えよう',500,550,{size:72,color:HC,anchor:'middle',weight:700}));
 s+=fade(gQ,box(80,620,840,220,{col:C.ink})+label('1300万年 かかる 暗号を、',500,710,{size:46,color:C.ink,anchor:'middle',weight:700})+label('全部 試さずに 解くには？',500,790,{size:46,color:C.ink,anchor:'middle',weight:700}));
 // 声の後の 3秒：輪が満ちる
 if(t>ve){const a=u*2*Math.PI,x=500+160*Math.sin(a),y=300-160*Math.cos(a);
  s+=`<path d="M500 140 A160 160 0 ${u>.5?1:0} 1 ${n2(x)} ${n2(y)}" fill="none" stroke="${GREEN}" stroke-width="10" stroke-linecap="round"/>`;
  s+=label(String(Math.max(1,3-Math.floor(u*3))),820,330,{size:64,color:GREEN,anchor:'middle',weight:700});}
 return s;
};

// ================= 23〜32 数えて解く =================
const kdKindi=(p,ctx)=>{
 const t=T(p,ctx),g=vseg(ctx,p,0,.15),t9=wt(ctx,'キュウセイキ'),at=2-1*seg(t,t9-.3,t9+.5),gK=ws(ctx,p,'キンディイ',{d:.5});
 let s=timeline({g,at,hl:t>t9?[1]:[],gi:[.35,1,1]});
 s+=fade(gK,rect(150,650,200,240,{fill:PAPER,fo:1,stroke:PEDGE,sw:4,rx:12}));
 for(let k=0;k<5;k++)s+=fade(gK,line(180,700+k*40,320,700+k*40,{color:PEDGE,w:3}));
 s+=fade(gK,label('暗号の 解き方の 本',620,750,{size:40,color:C.ink,weight:700,anchor:'middle'})+note('キンディーが 書き残した',620,810,{anchor:'middle'}));
 s+=fade(ws(ctx,p,'コタエ',{d:.4}),plate('答えを 見つけた 人',500,300,{size:46,color:HC,anchor:'middle'}));
 return s;
};
const NAMES=['さくら','たろう','ゆい','けん','まい','そら'],NICK=['ほし','くも','うみ','かぜ','もり','やま'],PCOL=['#7fb2ff','#83ecc0','#ff9ce6','#ffcf67','#b49bff','#ff8f6b'];
const PXY=[[190,470],[500,470],[810,470],[190,800],[500,800],[810,800]];
function classFig({swap=1,gP=1}={}){
 let s='';PXY.forEach(([x,y],i)=>{const tg=swap>.5?NICK[i]:NAMES[i];s+=person(x,y,{col:PCOL[i],tagText:tg,tagCol:swap>.5?'#a33a12':C.bg,g:gP});});
 if(swap>0&&swap<1)s+=fade(Math.sin(Math.PI*swap),plate('付け替え',500,200,{size:44,color:HC,anchor:'middle'}));
 return s;
}
const classSwap=(p,ctx)=>{const gP=ws(ctx,p,'クラス',{d:.5}),t=T(p,ctx),ts=wt(ctx,'ツケカエ');return classFig({swap:seg(t,ts-.1,ts+.6),gP})+fade(gP,plate('名札',500,200,{size:44,color:C.dim,anchor:'middle',g:1-seg(t,ts-.4,ts)}));};
const TALK=[1,5,1,2,1,2],TALKER=1;
const classTalk=(p,ctx)=>{
 const t=T(p,ctx),t0=wt(ctx,'シャベル'),t1=wt(ctx,'シャベリマス');
 let s=classFig();
 PXY.forEach(([x,y],i)=>{for(let b=0;b<TALK[i];b++){const tb=mix(t0,t1,b/5);s+=bubble(x+(b%3-1)*80,y-230-Math.floor(b/3)*58,{g:seg(t,tb,tb+.3)});}});
 s+=fade(ws(ctx,p,'シャベリマス',{d:.4}),plate('声 5回',PXY[TALKER][0]+150,PXY[TALKER][1]-120,{size:40,color:HC,anchor:'middle'}));
 return s;
};
const classKnow=(p,ctx)=>{
 let s=classFig();
 PXY.forEach(([x,y],i)=>{for(let b=0;b<TALK[i];b++)s+=bubble(x+(b%3-1)*80,y-230-Math.floor(b/3)*58,{g:.6});});
 s+=say(`${NICK[TALKER]} ＝ ${NAMES[TALKER]} だ！`,500,880,{g:ws(ctx,p,'ダレダカ',{d:.4}),size:48});
 return s;
};
const BO={x:70,y:500,w:840,h:300,max:14};
const fqEn=(p,ctx)=>{
 const gr=vseg(ctx,p,.1,.5),gE=ws(ctx,p,'イイガ',{d:.3}),g13=ws(ctx,p,'ジュウサン',{d:.4});
 const hl={};if(gE>0)hl[4]=HC;
 let s=fade(swin(ctx,p,0,0,.4),plate('文字も 同じ：よく 出る 文字が ある',500,180,{size:42,color:C.ink,anchor:'middle'}));
 s+=label('英文の 文字の 割合（％）',BO.x,290,{size:40,color:C.dim,weight:700})+bars(EN,{...BO,y:720,grow:gr,hl});
 const [ex,ey]=barTop(EN,4,{...BO,y:720});s+=fade(g13,plate('E 約13％',ex+24,ey-24,{size:46,color:HC}));
 s+=note('よく 知られた 表（E 12.7、T 9.1）',BO.x,860);
 return s;
};
const fqT=(p,ctx)=>{
 const gT=ws(ctx,p,'ティイデ',{d:.3}),g2=after(ctx,p,1),gX=ws(ctx,p,'イツモ',{d:.4}),g13=ws(ctx,p,'ジュウサン',{d:.4});
 const B2={x:70,y:470,w:840,h:220,max:14};
 const hl={4:HC};if(gT>0)hl[19]=ORANGE;
 let s=label('英文の 文字の 割合（％）',B2.x,150,{size:40,color:C.dim,weight:700})+bars(EN,{...B2,hl});
 const [ex,ey]=barTop(EN,4,B2),[tx,ty]=barTop(EN,19,B2);
 s+=plate('E 約13％',ex+24,ey-20,{size:40,color:HC})+fade(gT,plate('T 約9％',tx,ty-20,{size:40,color:ORANGE,anchor:'middle'}));
 // E → X（いつも同じ）、X も 約13％ の はず
 s+=fade(g2,cell('E',200,640,{size:56,w:100,h:96,color:HC,edge:HC})+arrow(260,640,380,640,{color:HC,w:5,head:18})+cell('X',440,640,{size:56,w:100,h:96,color:CIPH,edge:CIPH}));
 s+=fade(gX,plate('いつも 同じ 文字に',330,750,{size:40,color:HC,anchor:'middle'}));
 const by=860,hE=170*12.7/14;
 s+=fade(g13,line(600,by,940,by,{color:C.dim,w:2})+rect(640,by-hE,90,hE,{fill:HC,fo:.9,stroke:'none',rx:4})+label('E',685,by-hE-14,{size:40,color:HC,anchor:'middle',weight:700})
  +rect(800,by-hE,90,hE,{fill:CIPH,fo:.9,stroke:'none',rx:4})+label('X',845,by-hE-14,{size:40,color:CIPH,anchor:'middle',weight:700})+label('約13％の はず',770,by-hE-70,{size:38,color:CIPH,anchor:'middle',weight:700}));
 return s;
};
// ---- 解ける瞬間 ----
const SB={x:60,y:870,w:880,h:300,max:75};   // 回数の棒（数えた回数）
const WINY=200,LH=52,VIS=5,MS=36,MCW=.72;   // 暗号文の窓：5行
function cipherWindow(top,{cur=-1,done=0,known=null,flash=null,y0=WINY,n=VIS}={}){
 // top：一番上に見せる行（連続）。cur：今 数えている文字の通し番号。done：数え終わった文字数
 let s=rect(30,y0-48,940,n*LH+10,{fill:'#0f1a30',fo:.95,stroke:C.faint,sw:2,rx:14});
 s+=`<clipPath id="cw"><rect x="30" y="${y0-48}" width="940" height="${n*LH+10}"/></clipPath><g clip-path="url(#cw)">`;
 const i0=Math.max(0,Math.floor(top)-1),i1=Math.min(CLINES.length,Math.ceil(top)+n+1);
 for(let i=i0;i<i1;i++){const y=y0+(i-top)*LH,L=CLINES[i];let k=LSTART[i];
  [...L].forEach((c,j)=>{if(c===' ')return;const isL=/[A-Z]/.test(c),idx=isL?k++:-1,x=50+j*MS*MCW+MS*MCW/2;
   if(isL&&idx===cur)s+=rect(x-13,y-34,26,44,{fill:HC,fo:.9,stroke:'none',rx:4});
   let ch=c,col=CIPH,op=1;
   if(known&&isL&&known[c]){ch=PLAIN_OF[c];col=C.ink;}
   if(isL&&idx<done&&!known)op=.45;
   if(flash&&isL&&flash[c])col=GREEN;
   s+=label(ch,x,y,{size:MS,color:isL&&idx===cur?'#0b1122':col,anchor:'middle',weight:700,opacity:op});});}
 return s+'</g>';
}
function countBars(cnt,{hl={},grow=1,g=1}={}){
 return bars(cnt,{x:SB.x,y:SB.y,w:SB.w,h:SB.h,max:SB.max,col:'#ffb380',hl,g});
}
const scanCount=(p,ctx)=>{
 const t=T(p,ctx),t0=wt(ctx,'ナガイ'),t1=ctx.dur-.5,u=clamp((t-t0)/(t1-t0));
 const k=Math.round(u*NCL);                      // 数えた文字数
 const line_=k>=NCL?CLINES.length-1:LSTART.findLastIndex(s=>s<=k);
 const top=clamp(line_-1,0,CLINES.length-VIS);
 let s=cipherWindow(top,{cur:t>t0&&k<NCL?k:-1,done:k});
 s+=label(`数えた 文字：${k} / ${NCL}`,60,500,{size:40,color:C.dim,weight:700});
 s+=countBars(prefixCounts(k));
 return s;
};
const ALLC=prefixCounts(NCL);
const scanTop=(p,ctx)=>{
 const t=T(p,ctx),gX=ws(ctx,p,'コノモジ',{d:.3}),gE=ws(ctx,p,'コレガイイ',{d:.3});
 let s=cipherWindow(CLINES.length-VIS,{done:NCL})+label(`数えた 文字：${NCL} / ${NCL}`,60,500,{size:40,color:C.dim,weight:700});
 const hl={};if(gX>0)hl[ix('X')]=HC;
 s+=countBars(ALLC,{hl});
 const [xx,xy]=barTop(ALLC,ix('X'),SB);
 const pulse=gX>0?1+.08*Math.sin(t*8):1;
 s+=fade(gX,`<circle cx="${n2(xx)}" cy="${n2(xy-40)}" r="${n2(34*pulse)}" fill="none" stroke="${HC}" stroke-width="5"/>`+plate(`X ${ALLC[ix('X')]}回`,xx-50,xy-20,{size:40,color:HC,anchor:'end'}));
 s+=fade(gE,plate('X ＝ E？',xx-50,xy+50,{size:48,color:HC,anchor:'end'}));
 return s;
};
const scanT=(p,ctx)=>{
 const gJ=ws(ctx,p,'ティイ',{d:.3});
 let s=cipherWindow(CLINES.length-VIS,{done:NCL});
 const hl={[ix('X')]:HC};if(gJ>0)hl[ix('J')]=ORANGE;
 s+=countBars(ALLC,{hl});
 const [xx,xy]=barTop(ALLC,ix('X'),SB),[jx,jy]=barTop(ALLC,ix('J'),SB);
 s+=plate('X ＝ E？',xx-50,xy-20,{size:42,color:HC,anchor:'end'})+fade(gJ,plate(`J ${ALLC[ix('J')]}回 ＝ T？`,jx-30,jy-24,{size:42,color:ORANGE,anchor:'end'}));
 return s;
};
// 行29後半：J□X の 3文字の並び → V＝H、THE
function lineCells(i,y,{known={},box3=0,size=36,flash=null}={}){
 const L=CLINES[i],cw=size*.72;let s='';
 [...L].forEach((c,j)=>{if(c===' ')return;const x=50+j*cw+cw/2;let ch=c,col=CIPH;if(known[c]){ch=PLAIN_OF[c];col=c==='J'?ORANGE:c==='X'?HC:GREEN;}
  s+=label(ch,x,y,{size,color:col,anchor:'middle',weight:700});});
 if(box3>0){let j=0;for(const w of L.split(' ')){if(w==='JVX'){const xa=50+j*cw,xb=xa+3*cw;s+=fade(box3,rect(xa-4,y-size,xb-xa+8,size+14,{fill:'none',fo:0,stroke:HC,sw:4,rx:8}));}j+=w.length+1;}}
 return s;
}
const scanThe=(p,ctx)=>{
 const t=T(p,ctx),gJ=ws(ctx,p,'ティイデ',{d:.3}),gX=ws(ctx,p,'イイデ',{d:.3}),gB=ws(ctx,p,'ナラビガ',{d:.4}),gN=ws(ctx,p,'ナンドモ',{d:.4}),gH=ws(ctx,p,'エイチ',{d:.4}),gT=ws(ctx,p,'ザデス',{d:.4});
 const known={};if(gJ>0)known.J=1;if(gX>0)known.X=1;if(gH>0)known.V=1;
 let s='';for(let i=0;i<6;i++)s+=lineCells(i,200+i*72,{known,box3:gB});
 const nJVX=WORDS1.filter(w=>w==='JVX').length;
 s+=fade(gN,plate(`J □ X の 3文字 → JVX が ${nJVX}回`,500,690,{size:44,color:HC,anchor:'middle'}));
 s+=fade(gH,box(170,730,660,90,{col:GREEN})+label('真ん中の V ＝ H',500,792,{size:48,color:GREEN,anchor:'middle',weight:700}));
 s+=fade(gT,mono('THE',500,895,{size:64,cw:.8,cols:[ORANGE,GREEN,HC],anchor:'middle'}));
 return s;
};
// 行30：1文字ずつ 読める文に
const FILL_N=FILL.length;
const fillState=(t,t0,t1)=>{const u=clamp((t-t0)/(t1-t0));const n=3+Math.floor(u*(FILL_N-3)+1e-9);const frac=u*(FILL_N-3)-Math.floor(u*(FILL_N-3));return {n:Math.min(FILL_N,n),frac,u};};
const readPct=n=>{const kn=new Set(FILL.slice(0,n));return Math.round(100*CL1.filter(c=>kn.has(c)).length/NCL);};
const SHOWL=[0,1,2,3,4,5,6,7];
function fillFig(n,frac,{y0=200,dy=66,size=36}={}){
 const kn=Object.fromEntries(FILL.slice(0,n).map(c=>[c,1])),nw=FILL[n-1];
 let s='';
 SHOWL.forEach((i,r)=>{const L=CLINES[i],cw=size*.72,y=y0+r*dy;
  [...L].forEach((c,j)=>{if(c===' ')return;const x=50+j*cw+cw/2;const isL=/[A-Z]/.test(c);let ch=c,col=CIPH;
   if(isL&&kn[c]){ch=PLAIN_OF[c];col=c===nw&&frac<.6?GREEN:C.ink;}
   s+=label(ch,x,y,{size,color:col,anchor:'middle',weight:700});});});
 return s;
}
const scanFill=(p,ctx)=>{
 const t=T(p,ctx),t0=wt(ctx,'イレル')-.2,t1=ctx.dur-.6,{n,frac}=fillState(t,t0,t1);
 let s=fillFig(n,frac);
 const pc=readPct(n);
 s+=rect(60,760,880,40,{fill:'#131f38',fo:1,stroke:C.faint,sw:2,rx:20})+rect(60,760,880*pc/100,40,{fill:GREEN,fo:.85,stroke:'none',rx:20});
 s+=label(`読める 文字 ${pc}％`,60,870,{size:44,color:GREEN,weight:700})+label(`分かった 文字 ${n} / ${FILL_N}`,880,740,{size:38,color:C.dim,anchor:'end',weight:700});
 return s;
};
const scanDone=(p,ctx)=>{
 const g=vseg(ctx,p,0,.4);
 let s=fillFig(FILL_N,1);
 s+=rect(60,760,880,40,{fill:GREEN,fo:.85,stroke:'none',rx:20});
 s+=fade(g,plate('読めた！',500,870,{size:60,color:GREEN,anchor:'middle'}));
 return s;
};
ok(readPct(FILL_N)===100,'全部 読める');
const winTwo=(p,ctx)=>{
 const g1=swin(ctx,p,0,0,.4),g2=ws(ctx,p,'カチデス',{d:.5});
 let s=fade(g1,box(90,180,820,230,{col:'#8aa0c4'})+label('鍵：約4×10²⁶ 通り',500,270,{size:50,color:C.ink,anchor:'middle',weight:700})+label('試した 数：0',500,360,{size:56,color:HC,anchor:'middle',weight:700}));
 s+=fade(after(ctx,p,0),label('したこと：文字の 回数を 数えた',500,500,{size:44,color:GREEN,anchor:'middle',weight:700}));
 s+=fade(g2,box(150,620,700,150,{col:SCORE_COL.brk})+label('破る側の 勝ち',500,718,{size:64,color:SCORE_COL.brk,anchor:'middle',weight:700}));
 return s;
};

// ================= 33〜37 女王の結末 =================
const endIntercept=(p,ctx)=>{
 const t=T(p,ctx),gB=ws(ctx,p,'タルデ',{d:.6}),tS=wt(ctx,'スベテ'),u=seg(t,tS-.2,tS+1.2),gW=ws(ctx,p,'ウォルシンガム',{d:.5});
 let s=rect(0,0,W,H,{fill:NIGHT,fo:1,stroke:'none',rx:0})+castle(180,560,.42,{g:1});
 const bx=mix(230,470,gB);
 s+=barrel(bx,700,.7,{g:1});
 // 手紙が たるの栓から抜かれて、ウォルシンガムの手へ
 const lx=mix(bx+20,760,u),ly=mix(610,470,u)-Math.sin(Math.PI*u)*120;
 s+=folded(lx,ly,1.8,u>0?1:0);
 s+=fade(gB,draw([[bx+20,610],[(bx+760)/2,360],[760,470]],1,{color:HC,w:3,dash:'10 10',opacity:u>0?.7:0}));
 s+=person(800,640,{col:'#8a3a3a',g:Math.max(gW,u)})+fade(Math.max(gW,u),plate('ウォルシンガム',800,760,{size:44,color:ORANGE,anchor:'middle'})+note('エリザベスの 秘書長官',800,820,{anchor:'middle'}));
 s+=fade(u,plate('すべて 読まれていた',500,240,{size:50,color:RED_,anchor:'middle'}));
 return s;
};
const endPhel=(p,ctx)=>{
 const g=vseg(ctx,p,0,.3),gF=ws(ctx,p,'フェリペス',{d:.4});
 let s=rect(0,0,W,H,{fill:NIGHT,fo:1,stroke:'none',rx:0});
 s+=symLetter(380,160,560,380,LETTER_ROWS,{size:34,g});
 s+=person(200,640,{col:'#5a6a3a',g:gF,s:1.2})+fade(gF,plate('フェリペス',200,760,{size:48,color:CYAN,anchor:'middle'})+note('解読係',200,820,{anchor:'middle'}));
 return s;
};
const endCount=(p,ctx)=>{
 const t=T(p,ctx),gK=ws(ctx,p,'キンディイト',{d:.4}),gC=ws(ctx,p,'カゾエタ',{d:.4});
 let s=rect(0,0,W,H,{fill:NIGHT,fo:1,stroke:'none',rx:0});
 s+=symLetter(140,150,720,260,LETTER_ROWS.slice(0,2),{size:34});
 s+=fade(gK,plate('やり方は キンディーと 同じ',500,480,{size:46,color:C.ink,anchor:'middle'}));
 const gr=seg(t,wt(ctx,'キゴオノ'),voiceEnd(ctx)+.6);
 const SBX={x:70,y:770,w:860,h:220,max:75};
 s+=bars(SCNT,{...SBX,col:'#ffb380',lab:[...GLYPH],grow:gr,hl:gC>0?{[E_BAR]:HC}:{}});
 const [ex,ey]=barTop(SCNT,E_BAR,SBX);
 s+=fade(gC,plate(`${symOf('E')} ＝ E？`,ex+44,ey+10,{size:44,color:HC}));
 s+=note('記号の 回数（記号は 再現）',70,890,{});
 return s;
};
const PS='SEND THE NAMES';   // 偽の追伸（図のための英文。中身は「仲間の名前を教えて」）
const endPs=(p,ctx)=>{
 const t=T(p,ctx),tP=wt(ctx,'ツイシン'),u=seg(t,tP,tP+1.6),gN=ws(ctx,p,'ナカマノ',{d:.5});
 let s=rect(0,0,W,H,{fill:NIGHT,fo:1,stroke:'none',rx:0});
 s+=symLetter(140,150,720,560,LETTER_ROWS,{size:40,ps:PS,psG:u});
 s+=fade(u,plate('偽の 追伸',740,780,{size:44,color:'#ff6b5a',anchor:'middle'}));
 s+=fade(gN,box(90,800,640,100,{col:'#ff6b5a'})+label('「仲間の 名前を 教えて」',410,866,{size:44,color:'#ff6b5a',anchor:'middle',weight:700}));
 return s;
};
const endExec=(p,ctx)=>{
 const t=T(p,ctx),gD=seg(t,0,1.4),gS=ws(ctx,p,'シンジタ',{d:.6});
 let s=rect(0,0,W,H,{fill:'#05080f',fo:1,stroke:'none',rx:0});
 s+=castle(500,760,.9,{g:.5*(1-.6*gD),lit:1-gD});
 s+=crown(500,330,1.3,{g:.5*(1-gD),fo:.5});
 s+=fade(seg(t,.4,1.4),label('1587年2月',500,330,{size:56,color:C.dim,anchor:'middle',weight:700}));
 s+=fade(gS,plate('暗号を 信じた ことが、命取りに',500,520,{size:46,color:C.dim,anchor:'middle'}));
 return s;
};
const endMio=(p,ctx)=>{
 const g=vseg(ctx,p,0,.3),gW=ws(ctx,p,'カエッテ',{d:.4});
 let s=rect(0,0,W,H,{fill:'#070c18',fo:1,stroke:'none',rx:0});
 s+=lock(320,360,1.6,{g,open:1,col:'#9aabc7'})+fade(g,label('弱い 暗号',320,520,{size:44,color:C.dim,anchor:'middle',weight:700}));
 s+=fade(g,label('→ 安心して、本当の ことを 書く',560,640,{size:40,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(gW,box(100,710,800,120,{col:RED_})+label('ないより、かえって 危ない',500,790,{size:48,color:RED_,anchor:'middle',weight:700}));
 return s;
};

// ================= 38〜39 次の疑問・挑戦 =================
const nextWeak=(p,ctx)=>{
 const g1=ws(ctx,p,'オナジモジガ',{d:.5});
 let s=fade(vseg(ctx,p,0,.3),fuda('弱点',500,200,{anchor:'middle',text:'ただ 一つ',color:RED_,size:44}));
 [0,1,2].forEach(i=>{const x=250+i*250;s+=fade(g1,cell('E',x,370,{size:64,w:110,h:120,color:HC,edge:HC})+arrow(x,440,x,560,{color:HC,w:5,head:18})+cell('X',x,640,{size:64,w:110,h:120,color:CIPH,edge:CIPH}));});
 s+=fade(ws(ctx,p,'イツモ',{d:.4}),plate('E は いつも X',500,820,{size:52,color:HC,anchor:'middle'}));
 return s;
};
const nextQ=(p,ctx)=>{
 const g1=vseg(ctx,p,0,.3),gQ=ws(ctx,p,'フサイダ',{d:.4});
 let s=fuda('次の 疑問',500,200,{anchor:'middle',g:g1});
 ['K','R','?'].forEach((c,i)=>{const x=250+i*250;s+=fade(g1,cell('E',x,330,{size:56,w:100,h:110,color:HC,edge:HC})+arrow(x,395,x,465,{color:HC,w:4,head:16})+cell('？',x,530,{size:56,w:100,h:110,color:CYAN,edge:CYAN}));});
 s+=fade(gQ,plate('作る側は、弱点を どう ふさいだ？',500,740,{size:46,color:SCORE_COL.make,anchor:'middle'}));
 return s;
};
const chShow=(p,ctx)=>{
 const g=vseg(ctx,p,0,.25),gC=ws(ctx,p,'アンゴオブン',{d:.5});
 let s=fuda('挑戦',500,210,{anchor:'middle',g,color:HC,size:48});
 s+=fade(gC,`<rect x="60" y="300" width="880" height="260" rx="14" fill="${PAPER}" stroke="${PEDGE}" stroke-width="4"/>`+mono('MYEXD DRO',500,410,{size:72,cw:.72,color:'#a33a12',anchor:'middle'})+mono('VODDOBC',500,510,{size:72,cw:.72,color:'#a33a12',anchor:'middle'}));
 s+=fade(gC,note('一時停止して、解いてみよう',500,660,{anchor:'middle'}));
 return s;
};
const chCard=(p,ctx)=>{
 const t=T(p,ctx),ve=voiceEnd(ctx),g1=ws(ctx,p,'カエサル',{d:.4}),g2=ws(ctx,p,'コタエワ',{d:.4}),gO=seg(t,ve-.8,ve-.3),g3=seg(t,ve-.3,ve+.5);
 let s=mono(CHALLENGE,500,200,{size:56,cw:.72,color:'#ffb380',anchor:'middle'});
 s+=fade(g1*(1-gO),plate('ずらし方の 分からない カエサル暗号',500,320,{size:42,color:C.ink,anchor:'middle'})+note('ずらし方は 1〜25 の どれか',500,400,{anchor:'middle'}));
 s+=fade(g2*(1-gO),plate('答えは 次の回',500,520,{size:46,color:HC,anchor:'middle'}));
 s+=finalCard(['序章2-2','同じ 文字を、毎回','ちがう 文字に するには？'],g3,{y:330,size:56});
 return s;
};

export const chain00b1v3Diagrams={
 [K+'q:castle']:fig3(YQ,null,null,qCastle),
 [K+'q:mary']:fig3(YQ,null,null,qMary),
 [K+'q:prison']:fig3(YQ,null,null,qPrison),
 [K+'q:barrel']:fig3(YQ,null,null,qBarrel),
 [K+'q:letter']:fig3(YQ,null,null,qLetter),
 [K+'q:mio']:fig3(YQ,null,null,qMio),
 [K+'q:believe']:fig3(YQ,null,null,qBelieve),
 [K+'q:plot']:fig3(YQ,null,null,qPlot),
 [K+'q:title']:fig3(YQ,null,null,qTitle),
 [K+'cz:rome']:fig3((p,c)=>T(p,c)<wt(c,'コダイ')?YQ:Y0,null,S0,czRome),
 [K+'cz:rule']:fig3(Y0,null,S0,czRule),
 [K+'cz:a']:fig3(Y0,GU,S0,czA),
 [K+'cz:cat']:fig3(Y0,GU,S0,czCat),
 [K+'cz:z']:fig3(Y0,GU,S0,czZ),
 [K+'ring:z']:fig3(Y0,TA,S0,ringZ),
 [K+'brk:fdw']:fig3(Y0,YA,S0,brkFdw),
 [K+'brk:mio']:fig3(Y0,YA,S0,brkMio),
 [K+'brk:25']:fig3(Y0,YA,S0,brk25),
 [K+'brk:try']:fig3(Y0,YA,S0,brkTry),
 [K+'brk:win']:fig3(Y0,YA,scoreAt('カチデス',S0),brkWin),
 [K+'sub:leap']:fig3(YS,null,S1,subLeap),
 [K+'sub:table']:fig3(YS,GU,S1,subTable),
 [K+'cnt:steps']:fig3(YS,GU,S1,cntSteps),
 [K+'cnt:all']:fig3(YS,GU,S1,cntAll),
 [K+'cnt:q']:fig3(YS,null,S1,cntQ),
 [K+'cnt:time']:fig3(YS,TA,S1,cntTime),
 [K+'cnt:mis']:fig3(YS,null,S1,cntMis),
 [K+'sub:mary']:fig3(YQ,null,S1,subMary),
 [K+'think:pause']:fig3(YQ,null,S1,thinkPause),
 [K+'kd:kindi']:fig3(YK,null,S1,kdKindi),
 [K+'class:swap']:fig3(YK,TA,S1,classSwap),
 [K+'class:talk']:fig3(YK,TA,S1,classTalk),
 [K+'class:know']:fig3(YK,TA,S1,classKnow),
 [K+'fq:en']:fig3(YK,GU,S1,fqEn),
 [K+'fq:t']:fig3(YK,GU,S1,fqT),
 [K+'scan:count']:fig3(YK,YA,S1,scanCount),
 [K+'scan:top']:fig3(YK,YA,S1,scanTop),
 [K+'scan:t']:fig3(YK,YA,S1,scanT),
 [K+'scan:the']:fig3(YK,YA,S1,scanThe),
 [K+'scan:fill']:fig3(YK,YA,S1,scanFill),
 [K+'scan:done']:fig3(YK,YA,S1,scanDone),
 [K+'win:two']:fig3(YK,null,scoreAt('カチデス',S1),winTwo),
 [K+'end:intercept']:fig3(YQ,null,S2,endIntercept),
 [K+'end:phel']:fig3(YQ,null,S2,endPhel),
 [K+'end:count']:fig3(YQ,null,S2,endCount),
 [K+'end:ps']:fig3(YQ,null,S2,endPs),
 [K+'end:exec']:fig3(YQ7,null,S2,endExec),
 [K+'end:mio']:fig3(YQ7,null,S2,endMio),
 [K+'next:weak']:fig3(YQ7,null,S2,nextWeak),
 [K+'next:q']:fig3(YQ7,null,S2,nextQ),
 [K+'ch:show']:fig3(Y0,null,S2,chShow),
 [K+'ch:card']:fig3(Y0,null,S2,chCard),
};

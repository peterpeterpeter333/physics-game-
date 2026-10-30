// 技術の疑問の鎖 序章（ys-chain-00）「159垓通りの鍵を、どうやって解く？」— 図。縦長の舞台 1000×920（vert-v1）。
// 3D（エニグマの外・中）は scripts/blender/enigma.py で書き出した連番の PNG を blender-clip.mjs で貼る。
//   shot：ext-intro（本体を回り込む）・ext-press（A を押す → G が光る）・ext-plug（差し込み板に 10本）・
//         in-path（A → G の電流の道）・in-rotor（真ん中の円板を手前に出す）・in-step（A を3回 → G・P・X）・
//         in-reverse（同じ設定で G → A）・in-swap（円板を入れ替えて回す）。
//   電流の道・配線の表・その日の設定は enigma.py の冒頭と台本の冒頭（docs/video-revision-20260924/ytseries/chain-00.mjs）。
// 置き方：中の図は 1000×620 を舞台の y 150 に、外の図は 1000×760 を y 70 に置く。2D の札は、Blender のアンカー（banchor）に合わせる。
// 数の計算・表・論理の筋は 2D。
import {C,seg,clamp,mix,fade,label,line,rect,dot,ring,draw,arrow,poly,scaleAt,W,H,HC,LIGHT,cueT,voiceEnd,vseg,swin,note,plate,bigQ,finalCard,
 jw,ORANGE,GREEN,RED_,PURPLE,CYAN,AMBER,yearTag,when,fuda,eqLine,letter,callout} from './yt1-chain-common.mjs';
import {bclip,bframe,banchor,bframes} from './blender-clip.mjs';

const K='chain00-';
const IN={x:0,y:150,w:1000},EXT={x:0,y:70,w:1000};
const Y39='1939年 ドイツ',YUK='1939〜45年 イギリス',Y16='1600年ごろ';
const A=(shot,name,u,o)=>banchor(shot,name,u,o);
const tg=(ctx,p)=>ctx&&typeof ctx.tg==='number'?ctx.tg:cueT(p,ctx);
const box=(x,y,w,h,{col='#8aa0c4',fo=.12,sw=3,rx=18}={})=>rect(x,y,w,h,{fill:'#131f38',fo:.95,stroke:col,sw,rx})+rect(x,y,w,h,{fill:col,fo,stroke:'none',rx});
// 「中の しくみ」の注記（形は 図にして 並べ直した）
const schematic=g=>note('箱の中を 図にしたもの（並びは 見やすく 変えた）',40,830,{g});
// 円板3枚の かっこ（L〜R の上）
function rotorBrace(u,g){
 if(g<=0)return '';
 const l=A('in-path','L',u,IN),r=A('in-path','R',u,IN),y=l[1]-28;
 return fade(g,`<path d="M${l[0]-30} ${y+14} q0 -14 14 -14 L${r[0]+46} ${y} q14 0 14 14" fill="none" stroke="${C.ink}" stroke-width="3"/>`+plate('円板 3枚',(l[0]+r[0])/2,y-16,{size:38,anchor:'middle'}));
}
const ukwLabel=(u,g)=>{const a=A('in-path','U',u,IN);return plate('折り返し',12,a[1]-40,{size:38,anchor:'start',g,color:HC});};
function boards(shot,u,g=1){
 const l=A(shot,'lampBoard',u,IN),k=A(shot,'keyBoard',u,IN),b=A(shot,'battery',u,IN);
 return plate('電球',l[0],l[1]+56,{size:38,anchor:'middle',g})+plate('キー',k[0]-110,k[1]+56,{size:38,anchor:'middle',g})+plate('電池',b[0]+70,b[1]+12,{size:38,anchor:'start',g});
}
// 文字の札を 3D の電球・キーの上に
const onLamp=(shot,L,u,g,o={})=>{const a=A(shot,'lamp'+L,u,IN);return letter(L,a[0],a[1]-52,{g,...o});};
const onKey=(shot,L,u,g,o={})=>{const a=A(shot,'key'+L,u,IN);return letter(L,a[0],a[1]-52,{g,...o});};

// ---- 紙（暗号文を書き写す） ----
function paper(x,y,text,g=1,{w=220,h=260}={}){
 if(g<=0)return '';
 let s=rect(x,y,w,h,{fill:'#efe6cf',fo:1,stroke:'#c9bc98',sw:3,rx:8});
 for(let k=0;k<5;k++)s+=line(x+20,y+60+k*40,x+w-20,y+60+k*40,{color:'#c9bc98',w:2});
 s+=label(text,x+40,y+96,{size:60,color:'#1c2a44',weight:700});
 return fade(g,s);
}

// ---- 円板の絵（数える場面の 2D の小さな円板） ----
function disc2d(x,y,r,{col='#8aa0c4',num='',g=1,mark=0}={}){
 if(g<=0)return '';
 let s=`<circle cx="${x}" cy="${y}" r="${r}" fill="#131f38" stroke="${col}" stroke-width="4"/>`;
 for(let k=0;k<26;k++){const a=2*Math.PI*k/26;s+=dot(x+r*.78*Math.sin(a),y-r*.78*Math.cos(a),3,'#c9a45c');}
 if(mark)s+=`<g transform="rotate(${mark} ${x} ${y})">${rect(x-8,y-r-12,16,20,{fill:ORANGE,fo:1,rx:3})}</g>`;
 if(num)s+=label(num,x,y+14,{size:40,color:col,anchor:'middle',weight:700});
 return fade(g,s);
}
const CIRC=['①','②','③','④','⑤'];

// ---- 数を大きく、下に式 ----
const bigNum=(t,y,g,{size=64,color=HC}={})=>fade(g,label(t,W/2,y,{size,color,anchor:'middle',weight:700}));

export const chain00Diagrams={
 // 1 暗号機
 [K+'ext:intro']:when(Y39,(p,ctx)=>{
  const u=vseg(ctx,p,0,1);
  return bclip('ext-intro',u,EXT)+plate('エニグマ',500,860,{size:46,anchor:'middle',color:HC,g:vseg(ctx,p,.2,.4)})+note('（形は 図にしたもの）',500,905,{anchor:'middle',g:vseg(ctx,p,.25,.45)});
 }),
 // 2 キーと電球
 [K+'press:look']:when(Y39,(p,ctx)=>{
  const u=.5*swin(ctx,p,1,.25,.85);
  const kb=A('ext-press','keyboard',u,EXT),lb=A('ext-press','lampboard',u,EXT);
  return bclip('ext-press',u,EXT)+callout('キー',kb[0]-200,kb[1]+40,120,kb[1]+190,{g:swin(ctx,p,0,.4,.8)})+callout('電球',lb[0]+150,lb[1]-10,860,lb[1]-150,{g:swin(ctx,p,1,.3,.6),color:HC});
 }),
 // 3 A → G、紙に G
 [K+'press:paper']:when(Y39,(p,ctx)=>{
  const u=.5;
  const ka=A('ext-press','keyA',u,EXT),lg=A('ext-press','lampG',u,EXT);
  const ga=swin(ctx,p,0,0,.3),gg=swin(ctx,p,0,.5,.8),gp=swin(ctx,p,1,0,.4);
  return bclip('ext-press',u,EXT)+letter('A',ka[0],ka[1]-60,{g:ga,color:C.ink})+letter('G',lg[0],lg[1]-64,{g:gg})
   +fade(gp,rect(560,560,400,300,{fill:C.bg,fo:.85,stroke:'none',rx:16}))+paper(590,580,'G',gp,{w:200,h:250})+plate('暗号文',890,720,{size:42,anchor:'middle',color:HC,g:swin(ctx,p,1,.5,.9)});
 }),
 // 4a 中：電池 → キー → … → 電球（はじめの部分）
 [K+'path:go']:when(Y39,(p,ctx)=>{
  const u=.32*vseg(ctx,p,.1,.95);
  return bclip('in-path',u,IN)+boards('in-path',u,vseg(ctx,p,0,.3))+schematic(vseg(ctx,p,.1,.4))+onKey('in-path','A',u,vseg(ctx,p,0,.2),{color:C.ink});
 }),
 // 4b 円板3枚 → 折り返し → 3枚 → 電球 G
 [K+'path:through']:when(Y39,(p,ctx)=>{
  const u=.32+.68*vseg(ctx,p,0,.95);
  return bclip('in-path',u,IN)+boards('in-path',u)+schematic(1)+onKey('in-path','A',u,1,{color:C.ink})
   +rotorBrace(u,vseg(ctx,p,.05,.25))+ukwLabel(u,vseg(ctx,p,.3,.5))+onLamp('in-path','G',u,vseg(ctx,p,.92,1));
 }),
 // 5 1枚の円板を手前に
 [K+'rotor:out']:when(Y39,(p,ctx)=>{
  const u=.98*vseg(ctx,p,0,.62);
  const r=A('in-rotor','hlR',u,IN),l=A('in-rotor','hlL',u,IN),c=A('in-rotor','Mbottom',u,IN);
  const g1=swin(ctx,p,0,.4,.8),g2=swin(ctx,p,1,.2,.6);
  return bclip('in-rotor',u,IN)+fade(g1,plate('表と 裏に 26ずつの 接点、その間に 26本の 導線',500,850,{size:38,anchor:'middle'}))
   +callout('入る',r[0],r[1],r[0]+150,r[1]-70,{g:g2,color:HC})+callout('出る',l[0],l[1],l[0]-120,l[1]+150,{g:swin(ctx,p,1,.45,.8),color:HC});
 }),
 // 6 A を3回 → G、P、X
 [K+'step:three']:when(Y39,(p,ctx)=>{
  const n1=swin(ctx,p,0,.15,1),n23=swin(ctx,p,1,0,1),u=n23>0?(1+2*n23)/3:n1/3;
  const R=A('in-step','R',u,IN),f=bframes('in-step');
  const outs=['G','P','X'];let s=bclip('in-step',u,IN)+boards('in-step',u,.9);
  s+=fade(swin(ctx,p,0,.3,.6),plate('右の円板',R[0]+40,R[1]-40,{size:38,anchor:'middle',color:ORANGE}));
  outs.forEach((L,n)=>{const lit=clamp((u*3-n-.78)/.06);const on=lit>0&&Math.floor(Math.min(2.999,u*3))===n;
   if(on)s+=onLamp('in-step',L,u,lit);
   s+=fade(lit,label(`${n+1}回目 A → ${L}`,60+n*310,860,{size:40,color:n===Math.floor(Math.min(2.999,u*3))?HC:C.dim,weight:700}));});
  return s+onKey('in-step','A',u,1,{color:C.ink});
 }),
 // 7 二台
 [K+'two:machines']:when(Y39,(p,ctx)=>{
  const g2=vseg(ctx,p,.15,.45),g3=vseg(ctx,p,.4,.8);
  let s=bframe('ext-press',0,{x:-10,y:250,w:500})+fade(g2,bframe('ext-press',0,{x:510,y:250,w:500}));
  s+=plate('送る側',240,240,{size:40,anchor:'middle'})+plate('受け取る側',760,240,{size:40,anchor:'middle',g:g2});
  s+=fade(g3,rect(330,120,340,64,{fill:'#131f38',fo:.95,stroke:HC,sw:3,rx:32})+label('同じ 設定',500,165,{size:40,color:HC,anchor:'middle',weight:700}));
  s+=fade(vseg(ctx,p,.5,.9),arrow(330,700,690,700,{color:LIGHT,w:6,head:22})+plate('暗号文を 打ちこむ',510,780,{size:38,anchor:'middle',color:LIGHT}));
  return s;
 }),
 // 8a 行きと帰りで同じ導線を逆に
 [K+'rev:back']:when(Y39,(p,ctx)=>{
  const u=.56*vseg(ctx,p,.05,1);
  return bclip('in-reverse',u,IN)+boards('in-reverse',u,.9)
   +plate('さっきの A の道',260,820,{size:38,color:'#c9ac52',g:vseg(ctx,p,0,.2)})+onKey('in-reverse','G',u,vseg(ctx,p,.2,.35),{color:C.ink})
   +plate('G を押した 道',260,875,{size:38,color:LIGHT,g:vseg(ctx,p,.35,.55)});
 }),
 // 8b A → G なら G → A
 [K+'rev:result']:when(Y39,(p,ctx)=>{
  const u=.56+.44*swin(ctx,p,0,0,.5);
  let s=bclip('in-reverse',u,IN)+boards('in-reverse',u,.9)+onKey('in-reverse','G',u,1,{color:C.ink})+onLamp('in-reverse','A',u,swin(ctx,p,0,.45,.6));
  s+=fade(swin(ctx,p,0,.5,.8),label('A を押す → G',60,850,{size:42,color:C.dim,weight:700})+label('G を押す → A',540,850,{size:42,color:HC,weight:700}));
  s+=fade(swin(ctx,p,1,0,.5),rect(150,872,700,48,{fill:'#131f38',fo:.95,stroke:GREEN,sw:2,rx:24})+label('暗号文 G → 元の文 A',500,908,{size:38,color:GREEN,anchor:'middle',weight:700}));
  return s;
 }),
 // 9 鍵 ＝ その日の設定
 [K+'key:card']:when(Y39,(p,ctx)=>{
  const g1=swin(ctx,p,0,.3,.8),g2=swin(ctx,p,1,.1,.6);
  let s=fade(g1,scaleAt(500,330,.9+.1*g1,box(140,220,720,200,{col:HC})+label('鍵 ＝ その日の 設定',500,345,{size:60,color:HC,anchor:'middle',weight:700})));
  const days=['1日','2日','3日','4日'];
  days.forEach((d,i)=>{const g=seg(g2,i*.2,i*.2+.4);s+=fade(g,box(70+i*225,520,190,200,{col:'#8aa0c4'})+label(d,165+i*225,580,{size:40,color:C.ink,anchor:'middle',weight:700})+disc2d(130+i*225,660,26,{g:1,mark:i*70})+disc2d(200+i*225,660,26,{g:1,mark:i*130+40}));});
  s+=fade(g2,label('毎日 変わる',500,800,{size:44,color:C.dim,anchor:'middle',weight:700}));
  return s;
 }),
 // 10a 円板の順
 [K+'set:swap']:when(Y39,(p,ctx)=>{const u=.5*vseg(ctx,p,0,1);return bclip('in-swap',u,IN)+plate('① どの円板を、どの順に',500,850,{size:42,anchor:'middle',color:HC,g:vseg(ctx,p,0,.3)});}),
 // 10b 始めの向き
 [K+'set:turn']:when(Y39,(p,ctx)=>{const u=.5+.5*vseg(ctx,p,0,1);return bclip('in-swap',u,IN)+plate('① どの円板を、どの順に',500,850,{size:42,anchor:'middle',color:C.dim})+plate('② 始めの向き',500,905,{size:42,anchor:'middle',color:HC,g:vseg(ctx,p,0,.3)});}),
 // 10c 差し込み板
 [K+'plug:ten']:when(Y39,(p,ctx)=>{
  const u=vseg(ctx,p,0,1),n=Math.min(10,Math.floor(clamp((u-.04)/.085+.6,0,10)));
  return bclip('ext-plug',u,EXT)+plate('③ 差し込み板の 線',500,120,{size:42,anchor:'middle',color:HC})+plate(`線 ${n} 本`,500,880,{size:42,anchor:'middle',color:'#ffb380'});
 }),
 // 11 5×4×3＝60
 [K+'count:rotor']:when(Y39,(p,ctx)=>{
  const g0=swin(ctx,p,1,0,.25),k1=swin(ctx,p,1,.2,.45),k2=swin(ctx,p,1,.4,.6),k3=swin(ctx,p,1,.55,.75),ge=swin(ctx,p,1,.75,1);
  let s=fade(swin(ctx,p,0,0,.6),label('数えてみる',500,110,{size:44,color:C.dim,anchor:'middle',weight:700}));
  s+=fade(g0,label('5枚から',60,210,{size:40,color:C.dim,weight:700}));
  CIRC.forEach((c,i)=>{const used=(i===0&&k1>.5)||(i===3&&k2>.5)||(i===1&&k3>.5);s+=disc2d(260+i*150,200,52,{num:c,g:g0*(used?.35:1)});});
  const slots=[['右',k1,'5通り',CIRC[0]],['真ん中',k2,'4通り',CIRC[3]],['左',k3,'3通り',CIRC[1]]];
  slots.forEach(([nm,g,t,c],i)=>{const x=780-i*270;s+=fade(g0,rect(x-95,330,190,190,{fill:'#131f38',fo:.9,stroke:C.faint,sw:3,rx:16})+label(nm,x,560,{size:38,color:C.dim,anchor:'middle',weight:700}))+disc2d(x,425,62,{num:c,g})+fade(g,label(t,x,620,{size:42,color:HC,anchor:'middle',weight:700}));});
  s+=eqLine('5 × 4 × 3 ＝ 60 通り',760,{size:60,color:HC,g:ge});
  return s;
 }),
 // 12 26³
 [K+'count:pos']:when(Y39,(p,ctx)=>{
  const g1=vseg(ctx,p,0,.4),ge=vseg(ctx,p,.55,.9);
  let s=label('始めの向き',60,130,{size:42,color:C.dim,weight:700});
  [0,1,2].forEach(i=>{const x=200+i*300,g=seg(g1,i*.25,i*.25+.5),spin=tg(ctx,p)*40*(1-ge)+i*90;s+=disc2d(x,330,105,{g,mark:spin})+fade(g,label('26 通り',x,500,{size:42,color:C.ink,anchor:'middle',weight:700}));});
  s+=fade(g1,label('×',350,345,{size:48,color:C.dim,anchor:'middle'})+label('×',650,345,{size:48,color:C.dim,anchor:'middle'}));
  s+=eqLine('26 × 26 × 26 ＝ 17576 通り',680,{size:56,color:HC,g:ge});
  return s;
 }),
 // 13 325、276
 [K+'count:plug']:when(Y39,(p,ctx)=>{
  const ab='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const g1=swin(ctx,p,0,0,.4),pick=swin(ctx,p,0,.4,.7),f1=swin(ctx,p,0,.75,1),g2=swin(ctx,p,1,0,.5),f2=swin(ctx,p,1,.55,1);
  let s=label('差し込み板の 線',60,120,{size:42,color:C.dim,weight:700});
  for(let i=0;i<26;i++){const x=95+(i%13)*67,y=200+Math.floor(i/13)*80,used2=g2>0&&(i===0||i===16),hl=(i===0||i===16)&&pick>0;
   s+=fade(g1*(used2?.3:1),rect(x-28,y-36,56,56,{fill:hl?HC:'#131f38',fo:hl?.25:.9,stroke:hl?HC:C.faint,sw:2,rx:8})+label(ab[i],x,y+3,{size:36,color:hl?HC:C.ink,anchor:'middle',weight:700}));}
  s+=fade(pick,draw([[95,236],[95,330],[95+3*67,330],[95+3*67,316]],1,{color:'#d28a52',w:6}))+fade(pick,note('（A と Q の 例）',330,345));
  s+=fade(f1,label('1本目：26 × 25 ÷ 2 ＝ 325 通り',60,450,{size:46,color:HC,weight:700})+note('÷2 は、両端を 入れ替えても 同じ 線だから',60,505));
  s+=fade(f2,label('2本目：24 × 23 ÷ 2 ＝ 276 通り',60,610,{size:46,color:HC,weight:700})+note('残りの 24文字から',60,665));
  return s;
 }),
 // 14a 10本分
 [K+'count:ten']:when(Y39,(p,ctx)=>{
  const g1=swin(ctx,p,0,0,.8),g2=swin(ctx,p,1,0,.6);
  const fs=['325','276','231','190','153','120','91','66','45','28'];
  let s=label('10本分 掛ける',60,120,{size:42,color:C.dim,weight:700});
  fs.forEach((f,i)=>{const g=seg(g1,i*.08,i*.08+.25),x=80+(i%5)*190,y=220+Math.floor(i/5)*80;s+=fade(g,label(f+(i<9?' ×':''),x,y,{size:48,color:C.ink,weight:700}));});
  s+=fade(g2,box(80,420,840,330,{col:'#8aa0c4'})+label('1本目と 2本目を 入れ替えても',500,490,{size:40,color:C.ink,anchor:'middle',weight:700}));
  const pair=(x,y,n,col)=>`<circle cx="${x}" cy="${y}" r="10" fill="${col}"/><circle cx="${x+150}" cy="${y}" r="10" fill="${col}"/>`+draw([[x,y],[x+75,y+40],[x+150,y]],1,{color:col,w:6})+label(n,x+75,y-20,{size:38,color:col,anchor:'middle',weight:700});
  s+=fade(g2,pair(170,580,'①','#d28a52')+pair(170,680,'②',CYAN)+label('＝',500,650,{size:56,color:C.ink,anchor:'middle'})+pair(680,580,'①',CYAN)+pair(680,680,'②','#d28a52'));
  s+=fade(swin(ctx,p,1,.5,.9),label('同じ つなぎ方',500,820,{size:44,color:HC,anchor:'middle',weight:700}));
  return s;
 }),
 // 14b ÷10!
 [K+'count:div']:when(Y39,(p,ctx)=>{
  const g1=swin(ctx,p,0,0,.6),g2=swin(ctx,p,1,0,.8);
  let s=label('325 × 276 × … × 28',500,170,{size:50,color:C.ink,anchor:'middle',weight:700});
  s+=fade(g1,line(170,205,830,205,{color:C.ink,w:4})+label('10 × 9 × 8 × … × 1',500,270,{size:50,color:C.ink,anchor:'middle',weight:700})+note('10本の 並べ方の数 ＝ 3628800',500,330,{anchor:'middle'}));
  s+=fade(g2,label('＝ 150738274937250',500,470,{size:52,color:C.ink,anchor:'middle',weight:700})+label('≈ 1.5×10¹⁴',500,580,{size:60,color:HC,anchor:'middle',weight:700})+label('約 150兆 通り',500,680,{size:56,color:HC,anchor:'middle',weight:700}));
  return s;
 }),
 // 15 全部
 [K+'count:all']:when(Y39,(p,ctx)=>{
  const g1=swin(ctx,p,0,0,.5),g2=swin(ctx,p,0,.5,1),g3=swin(ctx,p,1,0,.8);
  let s=label('円板の 順',80,140,{size:40,color:C.dim,weight:700})+label('60',920,140,{size:46,color:C.ink,anchor:'end',weight:700});
  s+=label('始めの 向き',80,210,{size:40,color:C.dim,weight:700})+label('× 17576',920,210,{size:46,color:C.ink,anchor:'end',weight:700});
  s+=label('差し込み板',80,280,{size:40,color:C.dim,weight:700})+label('× 150738274937250',920,280,{size:46,color:C.ink,anchor:'end',weight:700});
  s+=fade(g1,line(80,315,920,315,{color:C.ink,w:3})+label('＝ 158962555217826360000',920,380,{size:44,color:C.ink,anchor:'end',weight:700}));
  s+=fade(g2,label('≈ 1.59×10²⁰ 通り',500,500,{size:66,color:HC,anchor:'middle',weight:700}));
  s+=fade(g3,label('＝ 1億5900万 × 1兆',500,620,{size:54,color:C.ink,anchor:'middle',weight:700})+note('159垓（がい）通り',500,700,{anchor:'middle'}));
  return s;
 }),
 // 16 500万年
 [K+'odd:years']:when(Y39,(p,ctx)=>{
  const g1=vseg(ctx,p,0,.35),g2=vseg(ctx,p,.35,.65),g3=vseg(ctx,p,.65,.95);
  let s=fuda('違和感',960,110,{anchor:'end'});
  s+=fade(g1,label('1秒に 100万（10⁶）通り',80,220,{size:44,color:C.ink,weight:700}));
  s+=fade(g2,label('1.59×10²⁰ ÷ 10⁶',80,330,{size:48,color:C.ink,weight:700})+label('＝ 1.59×10¹⁴ 秒',80,400,{size:48,color:C.ink,weight:700})+note('1年 ＝ 約 3.16×10⁷ 秒',80,470));
  s+=fade(g3,label('1.59×10¹⁴ ÷ 3.16×10⁷',80,580,{size:48,color:C.ink,weight:700})+label('≈ 5×10⁶ 年',80,680,{size:66,color:HC,weight:700})+label('約 500万年',560,680,{size:56,color:HC,weight:700}));
  return s;
 }),
 // 17 事実：イギリスは読んでいた
 [K+'odd:read']:when(YUK,(p,ctx)=>{
  const g1=vseg(ctx,p,.1,.45),g2=vseg(ctx,p,.45,.85);
  let s=fuda('事実',960,110,{anchor:'end'});
  // 小屋
  s+=fade(g1,poly([[120,420],[340,300],[560,420]],{fill:'#5e4128',fo:1})+rect(150,420,380,240,{fill:'#3b4a66',fo:1,stroke:'#8aa0c4',sw:3,rx:4})+rect(220,500,90,160,{fill:'#1c2a44',fo:1,stroke:'#8aa0c4',sw:2,rx:3})+rect(370,480,110,80,{fill:LIGHT,fo:.7,stroke:'#8aa0c4',sw:2,rx:3})+label('イギリスの 解読の 小屋',340,720,{size:38,color:C.dim,anchor:'middle',weight:700}));
  s+=paper(640,330,'',g2,{w:280,h:330})+fade(g2,label('読めた 文',780,710,{size:38,color:GREEN,anchor:'middle',weight:700})+`<g transform="rotate(-12 780 600)">${rect(700,570,160,64,{fill:'none',fo:0,stroke:RED_,sw:4,rx:8})}${label('解読',780,615,{size:40,color:RED_,anchor:'middle',weight:700})}</g>`);
  s+=fade(g2,note('戦争の 間、多くの 日に',500,820,{anchor:'middle'}));
  return s;
 }),
 // 18 論理と数学で捨て、残りを機械で
 [K+'odd:cut']:when(YUK,(p,ctx)=>{
  const g0=swin(ctx,p,0,0,.6),c1=swin(ctx,p,1,0,.45),c2=swin(ctx,p,1,.5,.95);
  let s=fade(g0,bigQ(500,300,1,120)+label('全部を 試した？',500,330,{size:44,color:C.ink,anchor:'middle',weight:700}));
  if(c1>0){s='';const hgt=mix(420,90,c1);
   s+=rect(80,780-hgt,260,hgt,{fill:'#8aa0c4',fo:.35,stroke:'#8aa0c4',sw:3,rx:8})+label('1.59×10²⁰',210,830,{size:40,color:C.ink,anchor:'middle',weight:700});
   s+=fade(c1,rect(80,360,260,420-90,{fill:'none',fo:0,stroke:C.faint,sw:2,rx:8})+label('人の 論理と 数学で',600,300,{size:42,color:HC,anchor:'middle',weight:700})+label('ありえない 設定を 捨てる',600,360,{size:42,color:HC,anchor:'middle',weight:700}));
   s+=fade(c2,arrow(360,740,560,740,{color:C.ink,w:6,head:22})+rect(590,640,330,180,{fill:'#131f38',fo:.95,stroke:CYAN,sw:4,rx:16})+label('電気で 動く',755,715,{size:40,color:CYAN,anchor:'middle',weight:700})+label('機械で 調べる',755,775,{size:40,color:CYAN,anchor:'middle',weight:700}));
   s+=fade(c2,note('やり方は 第20・21話で',500,890,{anchor:'middle'}));}
  return s;
 }),
 // 19 三つの札
 [K+'next:three']:when('1939年',(p,ctx)=>{
  const it=[['電流','第3話'],['電気で 動く 磁石','第4話・第13話'],['論理を 計算に 変える 数学','第14話・第19話']];
  let s=label('その機械に 要ったもの',500,140,{size:44,color:C.dim,anchor:'middle',weight:700});
  it.forEach(([t,n],i)=>{const g=vseg(ctx,p,.05+i*.2,.25+i*.2),y=220+i*180;s+=fade(g,box(110,y,780,140,{col:HC})+label(t,500,y+70,{size:48,color:HC,anchor:'middle',weight:700})+label('中身は '+n+'で 開ける',500,y+120,{size:36,color:C.dim,anchor:'middle'}));});
  return s;
 }),
 // 20 鎖の地図
 [K+'next:map']:when('1939年',(p,ctx)=>{
  const rows=[['序章','暗号機 エニグマ'],['第1部','電気と 磁気'],['第2部','知らせを 送り、計算する'],['第3部','第二次世界大戦の 技術'],['第4部','量子と 半導体'],['第5部','宇宙と 車'],['第6部','スマホ'],['第7部','人工知能']];
  let s='';const g=swin(ctx,p,0,0,.9);
  rows.forEach(([a,b],i)=>{const gi=seg(g,i*.1,i*.1+.25),y=130+i*92,hl=i===1;s+=fade(gi,rect(120,y-44,760,70,{fill:'#131f38',fo:.95,stroke:hl?HC:C.faint,sw:hl?4:2,rx:14})+label(a,150,y+5,{size:40,color:hl?HC:C.dim,weight:700})+label(b,330,y+5,{size:40,color:hl?HC:C.ink,weight:700}));if(i<rows.length-1)s+=fade(gi,line(500,y+26,500,y+52,{color:C.faint,w:3}));});
  s+=fade(swin(ctx,p,1,0,.6),plate('飛ばす所は 0',500,890,{size:44,anchor:'middle',color:GREEN}));
  return s;
 }),
 // 21a 340年前
 [K+'next:back']:when('1939年 → 1600年',(p,ctx)=>{
  const g=vseg(ctx,p,0,.7);
  let s=line(80,420,920,420,{color:C.dim,w:4});
  s+=dot(860,420,14,C.ink)+label('1939年',860,490,{size:42,color:C.ink,anchor:'middle',weight:700})+bframe('ext-press',0,{x:740,y:240,w:240,opacity:1});
  s+=fade(g,arrow(840,380,180,380,{color:HC,w:6,head:24,g})+dot(140,420,14,HC)+label('1600年',140,490,{size:42,color:HC,anchor:'middle',weight:700})+label('約340年 前',500,340,{size:44,color:HC,anchor:'middle',weight:700}));
  s+=fade(vseg(ctx,p,.6,.9),bigQ(140,700,1,140)+label('一つの 疑問',140,760,{size:40,color:HC,anchor:'middle',weight:700}));
  return s;
 }),
 // 21b 琥珀と磁石
 [K+'next:card']:when(Y16,(p,ctx)=>{
  const g1=swin(ctx,p,0,0,.6),g2=swin(ctx,p,1,0,.5);
  let s=fade(g1,amber(260,200)+label('こすった 琥珀',260,330,{size:40,color:AMBER,anchor:'middle',weight:700})+magnet(740,200)+label('磁石',740,330,{size:40,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(g1,label('？',500,230,{size:90,color:HC,anchor:'middle',weight:700}));
  s+=finalCard(['第1話','琥珀と 磁石は、','同じ 力なのか？'],g2,{y:420,size:58});
  return s;
 }),
};
export function amber(x,y,sc=1){return `<g transform="translate(${x} ${y}) scale(${sc})"><path d="M-70 -10 C-60 -60 10 -70 60 -40 C90 -20 80 40 40 60 C-10 80 -80 50 -70 -10Z" fill="#e39b2f" stroke="#ffcf7a" stroke-width="4"/><path d="M-30 -30 C-10 -45 20 -45 35 -30" fill="none" stroke="#ffe6b0" stroke-width="5" opacity=".7"/></g>`;}
export function magnet(x,y,sc=1){return `<g transform="translate(${x} ${y}) scale(${sc})"><path d="M-75 -10 C-70 -55 -20 -70 30 -55 C80 -40 85 20 50 50 C10 75 -60 60 -75 -10Z" fill="#4b5568" stroke="#8aa0c4" stroke-width="4"/><circle cx="-25" cy="-15" r="9" fill="#2e3647"/><circle cx="20" cy="15" r="7" fill="#2e3647"/></g>`;}

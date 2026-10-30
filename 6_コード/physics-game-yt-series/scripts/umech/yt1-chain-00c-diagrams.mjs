// 技術の疑問の鎖 序章3（ys-chain-00c）「エニグマの中は、どうなっている？」— 図。縦長の舞台 1000×920（vert-v1）。
// 3D：scripts/blender/enigma_open.py の連番の PNG（blender-clip.mjs で貼る）。道・進み方・9回の場所は Blender 側で計算して assert。
//   shot：lid・rcut・rstep・three・refl・back・rev・step・pawl・ring・plug・full（値は台本 chain-00c.mjs の冒頭）。
// 3D は舞台いっぱいに置く（1000 幅、y 60 から）。文字は 3D に入れず、アンカー（banchor）に合わせた 2D の札。
import {C,seg,clamp,mix,fade,label,line,rect,dot,ring,draw,arrow,poly,scaleAt,W,H,HC,LIGHT,cueT,voiceEnd,vseg,swin,note,plate,bigQ,finalCard,
 jw,ORANGE,GREEN,RED_,PURPLE,CYAN,AMBER,yearTag,when,fuda,eqLine,letter,callout,tag} from './yt1-chain-common.mjs';
import {bclip,bframe,banchor,bframes,binfo} from './blender-clip.mjs';
import {amber,magnet} from './yt1-chain-00-diagrams.mjs';

const K='chain00c-';
const YE='1930年ごろ 軍のエニグマ';
const ABC='ABCDEFGHIJKLMNOPQRSTUVWXYZ',UKW='YRUHQSLDPXNGOKMIEBFZCWVJAT';
const PAIRS=['AJ','BQ','CW','DK','EZ','FL','HU','IP','MR','NX'];
const box=(x,y,w,h,{col='#8aa0c4',fo=.12,sw=3,rx=18}={})=>rect(x,y,w,h,{fill:'#131f38',fo:.95,stroke:col,sw,rx})+rect(x,y,w,h,{fill:col,fo,stroke:'none',rx});
const A=(s,n,u,o)=>banchor(s,n,u,o);
const sm=u=>{u=clamp(u);return u*u*(3-2*u);};
const O60={x:0,y:60,w:1000},OR={x:0,y:150,w:1000};
const win=(shot,u)=>{const w=binfo(shot).win,n=w.length;return w[Math.max(0,Math.min(n-1,Math.round(u*(n-1))))];};
// 窓の文字（3つ）と、左・真ん中・右
function windows(shot,u,o,{hl=-1,g=1,dy=0}={}){
 const w=win(shot,u);let s='';
 ['L','M','R'].forEach((r,k)=>{const b=A(shot,'bot'+r,u,o),c=k===hl?HC:'#8aa0c4';
  s+=rect(b[0]-46,b[1]-12+dy,92,78,{fill:'#e8e2cf',fo:.95,stroke:c,sw:k===hl?6:3,rx:10})+label(w[k],b[0],b[1]+50+dy,{size:50,color:'#1c2a44',anchor:'middle',weight:700})+label(['左','真ん中','右'][k],b[0],b[1]+116+dy,{size:38,color:k===hl?HC:C.dim,anchor:'middle',weight:700});});
 return fade(g,s);
}

export const chain00cDiagrams={
 // 1a 前回
 [K+'open:recap']:when(YE,(p,ctx)=>{
  const g=vseg(ctx,p,0,.3);
  return fade(g,bframe('rstep',bframes('rstep')-1,{x:0,y:110,w:1000}))+plate('前回',40,120,{size:40,color:C.dim,anchor:'start'})
   +fade(swin(ctx,p,1,0,.6),plate('配線の 円板を、キーを 押すたびに 回す',500,880,{size:40,anchor:'middle',color:HC}));
 }),
 // 1b ふたを開ける
 [K+'open:lid']:when(YE,(p,ctx)=>{
  const u=vseg(ctx,p,0,1),r=A('lid','rotors',u,O60);
  return bclip('lid',u,O60)+fade(clamp((u-.75)/.15),callout('円板',r[0],r[1],r[0]+240,r[1]-120,{size:42,color:HC}))+note('（形は 図に したもの）',960,900,{anchor:'end'});
 }),
 // 2 順番：キー → 円板が回る → 電流
 [K+'open:order']:when(YE,(p,ctx)=>{
  const it=[['① キーを 押す',C.ink],['② まず 円板が 回る',HC],['③ そのあとで 電流が 流れる','#fff1b8']];
  let s='';it.forEach(([t,c],i)=>{const g=swin(ctx,p,0,i*.3,i*.3+.3),y=200+i*230;s+=fade(g,box(140,y,720,140,{col:c})+label(t,500,y+88,{size:48,color:c,anchor:'middle',weight:700}));if(i<2)s+=fade(swin(ctx,p,0,(i+1)*.3,(i+1)*.3+.1),arrow(500,y+150,500,y+222,{color:C.dim,w:5,head:18}));});
  s+=fade(swin(ctx,p,1,0,.6),note('順番に たどる',500,900,{anchor:'middle'}));
  return s;
 }),
 // 3 円板を切る
 [K+'rotor:cut']:when(YE,(p,ctx)=>{
  const u=.36*vseg(ctx,p,0,.6),fr=A('rcut','faceR',u,O60),fl=A('rcut','faceL',u,O60);
  let s=bclip('rcut',u,O60);
  s+=fade(swin(ctx,p,1,0,.3),plate('表（26の 接点）',fr[0]+20,fr[1]+30,{size:40,color:C.ink,anchor:'start'})+plate('裏（26の 接点）',fl[0]-20,fl[1]+30,{size:40,color:C.ink,anchor:'end'}));
  s+=fade(swin(ctx,p,1,.5,.9),plate('中の 26本の 導線',500,130,{size:44,anchor:'middle',color:HC}));
  return s;
 }),
 // 4 A→E、B→K
 [K+'rotor:wire']:when(YE,(p,ctx)=>{
  const u=.36+.64*vseg(ctx,p,0,.95);
  let s=bclip('rcut',u,O60);
  const ga=clamp((u-.38)/.08),gb=clamp((u-.68)/.08);
  const a=A('rcut','inA',u,O60),e=A('rcut','outE',u,O60),b=A('rcut','inB',u,O60),k=A('rcut','outK',u,O60);
  s+=letter('A',a[0]+40,a[1]-44,{g:ga,color:HC})+letter('E',e[0]-46,e[1]-40,{g:ga,color:HC});
  s+=letter('B',b[0]+50,b[1]-10,{g:gb,color:CYAN})+letter('K',k[0]-50,k[1]+10,{g:gb,color:CYAN});
  s+=plate('1番の 円板',40,130,{size:40,color:C.dim,anchor:'start'});
  s+=fade(ga,plate('表 A → 裏 E',500,860,{size:44,anchor:'middle',color:HC,g:1-gb}))+fade(gb,plate('表 B → 裏 K',500,860,{size:44,anchor:'middle',color:CYAN}));
  return s;
 }),
 // 5a 一目盛り → 出口が変わる
 [K+'turn:one']:when(YE,(p,ctx)=>{
  const u=.24+.76*vseg(ctx,p,0,.95),O={x:0,y:90,w:1000};
  let s=bclip('rstep',u,O);
  const ia=A('rstep','inA',u,O),oe=A('rstep','outE',u,O),oj=A('rstep','outJ',u,O);
  const g0=clamp((u-.26)/.05);
  s+=letter('A',ia[0]+30,ia[1]-40,{g:g0})+plate('入口',ia[0]+30,ia[1]-100,{size:38,anchor:'middle',color:C.dim,g:g0});
  s+=letter('E',oe[0]-50,oe[1],{g:clamp((u-.46)/.04),color:u>.55?C.dim:HC});
  s+=letter('J',oj[0]-50,oj[1],{g:clamp((u-.94)/.04),color:CYAN});
  s+=fade(clamp((u-.52)/.06),plate('一目盛り 回す',500,140,{size:42,anchor:'middle',color:C.ink}));
  s+=fade(clamp((u-.95)/.04),plate('同じ 入口 A → 出口が E から J に',500,890,{size:40,anchor:'middle',color:CYAN}));
  return s;
 }),
 // 5b 26通りの表
 [K+'turn:26']:when(YE,(p,ctx)=>{
  const g=vseg(ctx,p,.1,.6);
  let s=fade(.35,bframe('rstep',bframes('rstep')-1,{x:0,y:90,w:1000}));
  s+=fade(g,box(160,340,680,220,{col:HC})+label('円板 1枚 ＝',500,425,{size:48,color:C.ink,anchor:'middle',weight:700})+label('26通りの 入れ替えの 表',500,510,{size:50,color:HC,anchor:'middle',weight:700}));
  s+=fade(vseg(ctx,p,.5,.9),note('向き 0、1、2、…、25 で、それぞれ 別の 表',500,640,{anchor:'middle'}));
  return s;
 }),
 // 6 右 → 真ん中 → 左
 [K+'path:three']:when(YE,(p,ctx)=>{
  const u=vseg(ctx,p,.1,1);
  let s=bclip('three',u,OR);
  const tl=[['tR','右'],['tM','真ん中'],['tL','左']];
  tl.forEach(([a,t],i)=>{const q=A('three',a,u,OR);s+=fade(swin(ctx,p,1,.05+i*.12,.15+i*.12),plate(t,q[0],q[1]-30,{size:40,anchor:'middle',color:C.ink}));});
  const qe=A('three','tE',u,OR);s+=fade(swin(ctx,p,1,0,.1),plate('入口',qe[0],qe[1]-30,{size:38,anchor:'middle',color:C.dim}));
  const L=[['gE','A',.05],['gR','C',.38],['gM','U',.58],['gL','W',.8]];
  L.forEach(([a,c,t])=>{const q=A('three',a,u,OR);s+=letter(c,q[0],q[1]-40,{g:clamp((u-t)/.06),color:HC});});
  s+=fade(clamp((u-.85)/.1),plate('A → C → U → W',500,860,{size:48,anchor:'middle',color:HC}));
  s+=note('円板 3枚の 向き：左 J、真ん中 H、右 B（序章と 同じ）',40,130,{g:swin(ctx,p,0,0,.4)});
  return s;
 }),
 // 7 折り返し板の13組
 [K+'refl:pairs']:when(YE,reflFig),
 [K+'refl:send']:when(YE,reflFig),
};
function reflFig(p,ctx){
  const snd=ctx?.cue?.diagram?.endsWith('send'),u=snd?.4+.6*vseg(ctx,p,0,.95):.4*vseg(ctx,p,0,.9),O={x:0,y:70,w:1000};
  let s=bclip('refl',u,O);
  const gl=snd?1:vseg(ctx,p,.3,.8);
  for(const L of ABC){const q=A('refl','c'+L,u,O),hl=(L==='W'&&u>.42)?HC:(L==='V'&&u>.75)?CYAN:null;
   s+=fade(gl,label(L,q[0],q[1]+13,{size:hl?44:36,color:hl??C.ink,anchor:'middle',weight:700}));}
  s+=fade(snd?swin(ctx,p,0,0,.5):0,plate('2つずつ 組（13組）',500,140,{size:42,anchor:'middle',color:C.ink}));
  s+=fade(clamp((u-.75)/.15),plate('W から 入って、V から 戻る',500,880,{size:42,anchor:'middle',color:CYAN}));
  return s;
}
const chain00cRest={
 // 8 帰り：左 → 真ん中 → 右
 [K+'path:back']:when(YE,(p,ctx)=>{
  const u=vseg(ctx,p,.05,.95);
  let s=bclip('back',u,OR);
  const go=[['gE','A'],['gR','C'],['gM','U'],['gL','W']];go.forEach(([a,c])=>{const q=A('back',a,u,OR);s+=letter(c,q[0],q[1]-40,{color:'#c9ac52',size:36});});
  const bk=[['gL2','V',.08],['gM2','R',.35],['gR2','O',.6],['gE2','G',.9]];bk.forEach(([a,c,t])=>{const q=A('back',a,u,OR);s+=letter(c,q[0],q[1]+44,{g:clamp((u-t)/.06),color:CYAN});});
  s+=fade(swin(ctx,p,1,0,.4),plate('行きと 違う 導線',500,140,{size:42,anchor:'middle',color:CYAN}));
  s+=fade(clamp((u-.9)/.1),plate('V → R → O → G',500,860,{size:48,anchor:'middle',color:CYAN}));
  return s;
 }),
 // 9a 同じ設定で G → A
 [K+'path:rev']:when(YE,(p,ctx)=>{
  const u=vseg(ctx,p,.25,1);
  let s=bclip('rev',u,OR);
  const g=A('rev','gE2',u,OR),a=A('rev','gE',u,OR);
  s+=letter('G',g[0],g[1]+44,{g:vseg(ctx,p,.2,.3),color:LIGHT});s+=letter('A',a[0],a[1]-44,{g:clamp((u-.9)/.08),color:LIGHT});
  s+=fade(vseg(ctx,p,0,.2),plate('同じ 設定（左 J、真ん中 H、右 B）',500,140,{size:40,anchor:'middle',color:C.ink}));
  s+=fade(clamp((u-.9)/.1),plate('A → G なら、G → A',500,860,{size:48,anchor:'middle',color:LIGHT}));
  return s;
 }),
 // 9b 一つの機械で、作る・戻す
 [K+'path:one']:when(YE,(p,ctx)=>{
  const g=vseg(ctx,p,.1,.6);
  let s=fade(.4,bframe('rev',bframes('rev')-1,OR));
  s+=fade(g,box(60,620,400,150,{col:HC})+label('暗号を 作る',260,712,{size:46,color:HC,anchor:'middle',weight:700})+box(540,620,400,150,{col:GREEN})+label('元に 戻す',740,712,{size:46,color:GREEN,anchor:'middle',weight:700}));
  s+=fade(g,plate('同じ 機械・同じ 設定',500,140,{size:44,anchor:'middle',color:C.ink}));
  return s;
 }),
 // 10 くせ
 [K+'self:odd']:when(YE,(p,ctx)=>{
  const g1=swin(ctx,p,0,.2,.7),g2=swin(ctx,p,1,0,.6);
  let s=fuda('違和感',500,160,{anchor:'middle',g:g1});
  s+=fade(g2,label('A → A',500,420,{size:110,color:C.ink,anchor:'middle',weight:700})+line(330,300,670,460,{color:RED_,w:12})+line(670,300,330,460,{color:RED_,w:12}));
  s+=fade(g2,label('どの 文字も、自分 自身には 変わらない',500,620,{size:44,color:HC,anchor:'middle',weight:700}));
  return s;
 }),
 // 11a もし A→A なら：行きと帰りが同じ導線
 [K+'self:same']:when(YE,(p,ctx)=>selfFig(p,ctx,0)),
 // 11b 折り返し板で、同じ接点に戻る必要
 [K+'self:need']:when(YE,(p,ctx)=>selfFig(p,ctx,1)),
 // 12 決して変わらない
 [K+'self:never']:when(YE,(p,ctx)=>{
  const g1=swin(ctx,p,0,0,.6),g2=swin(ctx,p,1,0,.6),O={x:60,y:60,w:880};
  let s=fade(g1,bframe('refl',bframes('refl')-1,O));
  s+=fade(g1,plate('どの 接点も、別の 接点と',500,150,{size:42,anchor:'middle',color:C.ink}));
  s+=fuda('導いた 結果',500,840,{anchor:'middle',text:'自分 自身には 変わらない',g:g2,color:GREEN,size:40});
  return s;
 }),
 // 13 のちの手がかり
 [K+'self:later']:when(YE,(p,ctx)=>{
  const g=vseg(ctx,p,.1,.6);
  let s=label('A → A ×',500,300,{size:80,color:C.dim,anchor:'middle',weight:700});
  s+=fade(g,plate('解読の 大きな 手がかり',500,480,{size:48,anchor:'middle',color:HC}));
  s+=fade(vseg(ctx,p,.5,.9),tag('第21話で 開ける',500,650,{anchor:'middle',size:44,color:HC}));
  return s;
 }),
 // 14 キーを押すたびに右が一目盛り（1・2回目）
 [K+'adv:right']:when(YE,(p,ctx)=>{
  const u=.4*swin(ctx,p,1,0,1),O={x:0,y:40,w:1000};
  let s=bclip('step',u,O)+windows('step',u,O,{hl:2});
  s+=fade(swin(ctx,p,1,0,.3),plate('キー 1回 ＝ 右が 一目盛り',500,905,{size:38,anchor:'middle',color:HC}));
  const q=A('step','pawl1',u,O);s+=fade(swin(ctx,p,1,.1,.3),callout('爪',q[0],q[1],q[0]+60,q[1]-110,{size:40,color:GREEN}));
  return s;
 }),
 // 15 右の切り欠き → 真ん中も進む（近くから。3回目 JDV→JEW）
 [K+'adv:notch']:when(YE,(p,ctx)=>{
  const u=.5*vseg(ctx,p,.25,1),O={x:0,y:60,w:1000};
  let s=bclip('pawl',u,O);
  const r=A('pawl','ringR',u,O),pw=A('pawl','pawl2',u,O),m=A('pawl','ratM',u,O);
  s+=fade(swin(ctx,p,0,.3,.7),callout('右の 円板の 切り欠き',r[0],r[1]+20,r[0]-200,r[1]+250,{size:40,color:ORANGE}));
  s+=fade(swin(ctx,p,1,0,.3),callout('爪',pw[0],pw[1]-20,pw[0]+160,pw[1]-150,{size:40,color:GREEN}));
  s+=fade(swin(ctx,p,1,.3,.6),callout('真ん中の 歯車',m[0],m[1],m[0]-180,m[1]-170,{size:40,color:C.ink}));
  const w=win('pawl',u);s+=plate(`窓：${w.split('').join(' ')}`,40,880,{size:42,color:HC,anchor:'start'});
  s+=plate('動きは ゆっくりに しています',960,880,{size:36,color:C.dim,anchor:'end',weight:400});
  return s;
 }),
 // 16 真ん中の切り欠き → 左が進む（4回目）
 [K+'adv:left']:when(YE,(p,ctx)=>{
  const u=.6+.2*swin(ctx,p,0,.3,1),O={x:0,y:40,w:1000};
  let s=bclip('step',u,O)+windows('step',u,O,{hl:0});
  s+=fade(swin(ctx,p,1,0,.6),plate('距離計と 同じ：右 → 真ん中 → 左',500,905,{size:38,anchor:'middle',color:HC}));
  return s;
 }),
 // 17a 違和感
 [K+'dbl:odd']:when(YE,(p,ctx)=>{
  const O={x:0,y:40,w:1000};
  return fade(.5,bframe('step',96,O))+fuda('違和感',500,150,{anchor:'middle',text:'距離計と 違う 動き',g:vseg(ctx,p,.2,.6)});
 }),
 // 17b 真ん中が2回続けて進む（3・4回目）
 [K+'dbl:twice']:when(YE,(p,ctx)=>{
  const u=.4+.4*swin(ctx,p,0,.05,1),O={x:0,y:40,w:1000};
  let s=bclip('step',u,O)+windows('step',u,O,{hl:1});
  const n1=clamp((u-.5)/.03),n2=clamp((u-.7)/.03);
  s+=fade(n1,plate('1回目 D → E',260,150,{size:42,anchor:'middle',color:HC}))+fade(n2,plate('2回目 E → F',740,150,{size:42,anchor:'middle',color:HC}));
  s+=fade(swin(ctx,p,1,0,.6),plate('二重送り',500,860,{size:52,anchor:'middle',color:HC}));
  return s;
 }),
 // 18a 爪の形
 [K+'pawl:why']:when(YE,(p,ctx)=>{
  const u=.5,O={x:0,y:60,w:1000};
  const q=A('pawl','pawl3',u,O);
  return bclip('pawl',u,O)+fade(vseg(ctx,p,.2,.7),callout('左の 円板を 進める 爪',q[0],q[1]-20,q[0]+300,q[1]-110,{size:42,color:GREEN}))+plate('窓：J E W',40,880,{size:42,color:HC,anchor:'start'});
 }),
 // 18b 爪が真ん中の切り欠きに入る → 左の歯車に届く（ゆっくり）
 [K+'pawl:reach']:when(YE,(p,ctx)=>pawlFig(p,ctx,0)),
 // 18c 押すと、入りこんだ真ん中の切り欠きも一緒に押す
 [K+'pawl:push']:when(YE,(p,ctx)=>pawlFig(p,ctx,1)),
};
const PAWL_U0=.5,PAWL_U1=.5+.5*.25;   // 2回目の打鍵（JEW→KFX）の f 0→0.25：爪が下りて、切り欠きに入る（押し始めは f 0.26）
function pawlFig(p,ctx,k){
  const u=k?PAWL_U1+(1-PAWL_U1)*vseg(ctx,p,0,.9):PAWL_U0+(PAWL_U1-PAWL_U0)*vseg(ctx,p,.1,.8),O={x:0,y:60,w:1000};
  let s=bclip('pawl',u,O);
  const pw=A('pawl','pawl3',u,O),rm=A('pawl','ringM',.5,O),rl=A('pawl','ratL',.5,O);
  const s1=k?1:vseg(ctx,p,.1,.4),s2=k?1:vseg(ctx,p,.6,.9),s3=k?vseg(ctx,p,.1,.4):0;
  s+=fade(s1,callout('真ん中の 切り欠き',rm[0],rm[1]+16,rm[0]+140,rm[1]+260,{size:40,color:ORANGE}));
  s+=fade(s2,callout('左の 歯車',rl[0],rl[1],rl[0]-120,rl[1]+300,{size:40,color:C.ink}));
  const st=[['① 切り欠きに 入る',s1],['② 左の 歯車に 届く',s2],['③ 両方を 押す',s3]];
  st.forEach(([t,g],i)=>{s+=fade(g,plate(t,960,125+i*56,{size:38,anchor:'end',color:i===2?HC:GREEN}));});
  s+=fade(k?vseg(ctx,p,.45,.8):0,plate('→ 真ん中も 一緒に 回る',960,293,{size:38,anchor:'end',color:HC}));
  const w=win('pawl',u);s+=plate(`窓：${w.split('').join(' ')}`,40,880,{size:42,color:HC,anchor:'start'});
  s+=plate('動きは ゆっくりに しています',960,880,{size:36,color:C.dim,anchor:'end',weight:400});
  return s;
}
const chain00cRest2={
 // 19 26×25×26
 [K+'dbl:period']:when(YE,(p,ctx)=>{
  const g1=vseg(ctx,p,.1,.45),g2=vseg(ctx,p,.45,.8);
  let s=fade(g1,label('26 × 26 × 26 ＝ 17576',500,240,{size:52,color:C.dim,anchor:'middle',weight:700})+line(230,225,770,225,{color:RED_,w:6}));
  s+=fade(g2,label('26 × 25 × 26 ＝ 16900',500,400,{size:62,color:HC,anchor:'middle',weight:700}));
  s+=fade(g2,note('真ん中は 二重送りの 分 早く 一周する：',500,520,{anchor:'middle'})+note('右が 26周ではなく 25周 する間に 一周',500,575,{anchor:'middle'}));
  s+=fade(vseg(ctx,p,.7,1),note('（この 規則で 押し続けて 数えると 16900回で 元に 戻る）',500,680,{anchor:'middle'}));
  return s;
 }),
 // 20 文字の輪だけ回る
 [K+'ring:turn']:when(YE,(p,ctx)=>ringFig(p,ctx,vseg(ctx,p,0,.95),0)),
 // 21a 窓の文字と配線の関係・進める時が変わる
 [K+'ring:change']:when(YE,(p,ctx)=>ringFig(p,ctx,1,1)),
 // 21b その日の設定
 [K+'ring:setting']:when(YE,(p,ctx)=>{
  const g1=swin(ctx,p,0,0,.6),g2=swin(ctx,p,1,0,.6);
  let s=fade(.35,bframe('ring',bframes('ring')-1,O60));
  s+=tag('その日の 設定',500,300,{anchor:'middle',size:52,color:HC,g:g1});
  s+=fade(g2,box(120,480,760,170,{col:'#8aa0c4'})+label('序章の 約1.59×10²⁰ 通りには',500,550,{size:40,color:C.ink,anchor:'middle',weight:700})+label('入れていない',500,615,{size:44,color:C.ink,anchor:'middle',weight:700}));
  return s;
 }),
 // 22 差し込み板に線を挿す
 [K+'plug:insert']:when(YE,(p,ctx)=>{
  const u=.5*vseg(ctx,p,0,.6);
  let s=bclip('plug',u,O60);
  const a=A('plug','sA',u,O60),j=A('plug','sJ',u,O60),b=A('plug','board',u,O60);
  s+=letter('A',a[0],a[1]-56,{g:vseg(ctx,p,0,.15),color:HC})+letter('J',j[0],j[1]-56,{g:vseg(ctx,p,.3,.45),color:HC});
  s+=plate('差し込み板',b[0],b[1]+40,{size:42,anchor:'middle',color:C.ink});
  s+=fade(swin(ctx,p,1,.2,.7),plate('A ⇄ J',500,140,{size:56,anchor:'middle',color:HC}));
  return s;
 }),
 // 23 A を押すと J の位置から円板へ
 [K+'plug:path']:when(YE,(p,ctx)=>{
  const u=.5+.5*swin(ctx,p,1,0,1);
  let s=bclip('plug',u,O60);
  const a=A('plug','sA',u,O60),j=A('plug','sJ',u,O60),k=A('plug','key',u,O60),e=A('plug','etw',u,O60),ej=A('plug','ej',u,O60);
  s+=letter('A',a[0],a[1]-56,{color:HC})+letter('J',j[0],j[1]-56,{color:HC});
  s+=plate('キー A',k[0],k[1]+70,{size:40,anchor:'middle',color:C.ink});
  s+=plate('入口の 円板',e[0],e[1]-10,{size:40,anchor:'middle',color:C.dim});
  s+=fade(clamp((u-.93)/.05),letter('J',ej[0]+70,ej[1],{color:LIGHT}));
  s+=fade(swin(ctx,p,0,0,.6),plate('行きも 帰りも 通る',500,140,{size:42,anchor:'middle',color:C.ink}));
  return s;
 }),
 // 24 約150兆
 [K+'plug:count']:when(YE,(p,ctx)=>{
  const g1=swin(ctx,p,0,0,.6),g2=swin(ctx,p,1,0,.7);
  let s=fade(g1,plate('差し込み板は 回らない',500,180,{size:46,anchor:'middle',color:C.ink}));
  PAIRS.forEach((pr,i)=>{s+=fade(seg(g2,i*.06,i*.06+.3),box(70+(i%5)*176,290+Math.floor(i/5)*120,150,90,{col:'#d28a52'})+label(pr[0]+'–'+pr[1],145+(i%5)*176,350+Math.floor(i/5)*120,{size:40,color:'#ffb380',anchor:'middle',weight:700}));});
  s+=fade(swin(ctx,p,1,.5,1),label('10本 → 約150兆 通り',500,650,{size:58,color:HC,anchor:'middle',weight:700})+note('（序章：26!／(6!×10!×2¹⁰) ≈ 1.5×10¹⁴）',500,720,{anchor:'middle'}));
  return s;
 }),
 // 25 全体
 [K+'all:press']:when(YE,(p,ctx)=>{
  const u=.06*vseg(ctx,p,.2,1);
  let s=bclip('full',u,OR);const k=A('full','key',u,OR);
  s+=plate('キー A',k[0]-10,k[1]+70,{size:40,anchor:'middle',color:HC});
  s+=fade(swin(ctx,p,1,0,.5),plate('円板が 進む（右 A → B）→ 電流',500,140,{size:42,anchor:'middle',color:C.ink}));
  s+=fullLabels(u,0);
  return s;
 }),
 // 26a 9回の道
 [K+'all:nine']:when(YE,(p,ctx)=>{
  const u=.06+.94*swin(ctx,p,0,0,1);
  return bclip('full',u,OR)+fullLabels(u,1)+fullSeq(u);
 }),
 // 26b 9回
 [K+'all:count']:when(YE,(p,ctx)=>{
  const u=1;
  return bclip('full',u,OR)+fullLabels(u,1)+fullSeq(u)+fade(vseg(ctx,p,.1,.5),plate('一回の キーで 9回',500,140,{size:56,anchor:'middle',color:HC}));
 }),
 // 27a その日の表
 [K+'use:table']:when(YE,(p,ctx)=>{
  const g=vseg(ctx,p,0,.8);
  const rows=[['円板の 種類と 順番','I・II・III'],['文字の 輪','A・A・A'],['差し込み板',PAIRS.slice(0,5).join(' ')],['',PAIRS.slice(5).join(' ')]];
  let s=label('その日の 表（見本の 値）',500,150,{size:44,color:C.dim,anchor:'middle',weight:700})+rect(40,190,920,470,{fill:'#e8dcc0',fo:.95,stroke:'#b9a57a',sw:4,rx:12});
  rows.forEach(([a,b],i)=>{const gi=seg(g,i*.2,i*.2+.3),y=280+i*100;s+=fade(gi,label(a,70,y,{size:38,color:'#5e4128',weight:700})+label(b,930,y,{size:40,color:'#1c2a44',anchor:'end',weight:700}));});
  return s;
 }),
 // 27b 始めの向き
 [K+'use:start']:when(YE,(p,ctx)=>{
  const g1=vseg(ctx,p,0,.45),g2=vseg(ctx,p,.45,.9);
  let s=fade(g1,label('円板の 始めの 向き',500,190,{size:44,color:C.dim,anchor:'middle',weight:700})+box(220,240,560,130,{col:HC})+label('知らせごとに 選ぶ',500,322,{size:40,color:HC,anchor:'middle',weight:700}));
  s+=fade(g2,arrow(500,390,500,470,{color:C.ink,w:5,head:18})+box(230,490,540,130,{col:CYAN})+label('それも 暗号に して 送る',500,572,{size:40,color:CYAN,anchor:'middle',weight:700}));
  s+=fade(g2,note('細かい 手順の 移り変わりは 第20話で',500,720,{anchor:'middle'}));
  return s;
 }),
 // 28a まとめとくせ
 [K+'next:weak']:when(YE,(p,ctx)=>{
  const g1=swin(ctx,p,0,0,.7),g2=swin(ctx,p,1,0,.5),g3=swin(ctx,p,1,.5,1);
  let s=fade(g1,box(80,160,400,140,{col:HC})+label('9回の 入れ替え',280,245,{size:42,color:HC,anchor:'middle',weight:700})+box(520,160,400,140,{col:HC})+label('二重送り',720,245,{size:42,color:HC,anchor:'middle',weight:700}));
  s+=fade(g2,box(80,400,840,140,{col:RED_})+label('くせ：自分 自身には 変わらない',500,485,{size:44,color:RED_,anchor:'middle',weight:700}));
  s+=fade(g3,box(80,600,840,140,{col:RED_})+label('使うのは 人',500,685,{size:44,color:RED_,anchor:'middle',weight:700}));
  return s;
 }),
 // 28b 第20・21話
 [K+'next:later']:when(YE,(p,ctx)=>{
  const g=vseg(ctx,p,.1,.6);
  return fuda('次の 疑問',500,170,{anchor:'middle'})+fade(g,label('どう 突いたのか？',500,330,{size:56,color:C.ink,anchor:'middle',weight:700})+tag('第20話・第21話で 開ける',500,480,{anchor:'middle',size:44,color:HC}));
 }),
 // 29 第1話へ
 [K+'next:card']:when('1930年ごろ → 1600年',(p,ctx)=>{
  const g1=swin(ctx,p,0,.2,.8),g2=swin(ctx,p,1,0,.5);
  let s=fade(g1*(1-g2),label('電流とは 何か？',500,300,{size:60,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(g2,amber(260,200)+label('こすった 琥珀',260,330,{size:40,color:AMBER,anchor:'middle',weight:700})+magnet(740,200)+label('磁石',740,330,{size:40,color:C.ink,anchor:'middle',weight:700}));
  s+=finalCard(['第1話','琥珀と 磁石は、','同じ 力なのか？'],g2,{y:420,size:58});
  return s;
 }),
};

// 自分自身に変わらないことの図（2D の図式）
function selfFig(p,ctx,k){
 const xs={P:820,R:640,M:460,L:280,U:110},ys0=330,ys1=640;
 let s=label(k?'折り返し板では？':'もし A → A なら',500,140,{size:46,color:k?HC:C.ink,anchor:'middle',weight:700});
 [['R','右'],['M','真ん中'],['L','左']].forEach(([n,t])=>{s+=rect(xs[n]-40,240,80,500,{fill:'#131f38',fo:.9,stroke:'#8aa0c4',sw:3,rx:14})+label(t,xs[n],800,{size:38,color:C.dim,anchor:'middle',weight:700});});
 s+=rect(xs.U-45,240,90,500,{fill:'#131f38',fo:.9,stroke:HC,sw:3,rx:14})+label('折り返し',xs.U,800,{size:38,color:HC,anchor:'middle',weight:700});
 // 行き（A から）と帰り（A へ）：同じ折れ線
 const path=[[960,ys0],[xs.R+40,ys0],[xs.R-40,430],[xs.M+40,430],[xs.M-40,560],[xs.L+40,560],[xs.L-40,470],[xs.U+45,470]];
 const g1=k?1:vseg(ctx,p,.1,.5),g2=k?1:vseg(ctx,p,.5,.9);
 s+=fade(g1,draw(path,g1,{color:HC,w:8}))+letter('A',960,ys0-50,{color:HC});
 s+=fade(g2,draw(path.map(([x,y])=>[x,y+14]),1,{color:CYAN,w:6,dash:'14 10'}))+fade(g2,letter('A',960,ys0+70,{color:CYAN}));
 s+=fade(g2,plate('行き ＝ 帰り（同じ 導線）',600,890,{size:40,anchor:'middle',color:CYAN}));
 if(k){const g=vseg(ctx,p,.2,.7);s+=fade(g,`<path d="M ${xs.U+45} 470 C ${xs.U-60} 400, ${xs.U-60} 540, ${xs.U+45} 484" fill="none" stroke="${RED_}" stroke-width="7"/>`+plate('入った 接点に そのまま 戻る？',380,210,{size:40,anchor:'middle',color:RED_}));}
 return s;
}
// 文字の輪
function ringFig(p,ctx,u,k){
 let s=bclip('ring',u,O60);
 const t=3*sm(clamp((u-.15)/.7)),top=Math.round(t);
 for(let j=0;j<26;j++){const q=A('ring','L'+j,u,O60),on=j===top;s+=label(ABC[j],q[0],q[1]+13,{size:on?46:36,color:on?HC:j===0?ORANGE:C.ink,anchor:'middle',weight:700});}
 const w=A('ring','win',u,O60),wr=A('ring','wire',u,O60);
 s+=plate('窓',w[0]+60,w[1]+14,{size:38,color:C.dim,anchor:'start'});
 s+=k?'':fade(vseg(ctx,p,.2,.5),callout('配線は 動かない',wr[0],wr[1],260,830,{size:40,color:HC}));
 s+=k?'':fade(swin(ctx,p,1,0,.4),plate('切り欠きも 輪と 一緒に 動く',640,905,{size:40,anchor:'middle',color:ORANGE}));
 if(k){s+=fade(swin(ctx,p,0,0,.4),plate('窓の 文字 A → D（配線は 同じ）',500,130,{size:40,anchor:'middle',color:HC}))+fade(swin(ctx,p,0,.5,.9),plate('切り欠きの 位置も ずれる → 隣を 進める 時が 変わる',500,885,{size:36,anchor:'middle',color:ORANGE}));}
 return s;
}
// 全部の道の札
const FL=[['n1','①'],['n2','②'],['n3','③'],['n4','④'],['n5','⑤'],['n6','⑥'],['n7','⑦'],['n8','⑧'],['n9','⑨']];
function fullLabels(u,on){
 const f=sm(clamp((u-.06)/(.92-.06))),fr=binfo('full').fracs;let s='';
 FL.forEach(([a,t],i)=>{const q=A('full',a,u,OR),g=on?clamp((f-fr[i])/.03+1):0,dy=i<4?-30:i===4?0:58;s+=fade(g,label(t,q[0],q[1]+dy,{size:52,color:HC,anchor:'middle',weight:700}));});
 s+=fade(on?1:0,note('入口の 板は 並びを 変えないので 数えない',500,730,{anchor:'middle'}));
 return s;
}
function fullSeq(u){
 const f=sm(clamp((u-.06)/(.92-.06))),fr=binfo('full').fracs,P=binfo('full').path;
 let s='';
 P.forEach((c,i)=>{const g=i===0?1:clamp((f-fr[i-1])/.03+1),r=i<5?0:1,x=(r?150:110)+(i%5)*160,y=r?880:800;s+=fade(g,label(c,x,y,{size:48,color:i===9?HC:C.ink,anchor:'middle',weight:700}));if(i>0)s+=fade(g,label('→',x-80,y-4,{size:40,color:C.dim,anchor:'middle'}));});
 return s;
}
Object.assign(chain00cDiagrams,chain00cRest);
Object.assign(chain00cDiagrams,chain00cRest2);

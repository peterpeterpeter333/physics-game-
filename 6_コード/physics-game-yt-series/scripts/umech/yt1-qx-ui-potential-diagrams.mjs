// 問題編 解説「棚の上の箱と、二つの道」（q-ui-potential、大学編 13 位置エネルギー・初級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/13_位置エネルギー.md の q-ui-potential（解説 18 行）。
// 画面の配置：左に横から見た部屋（床・机・棚・箱）、右に説明の枠（紺の塗り・角の丸い枠）。誤答カードは右の枠の下。
// 小問3 は上から見た床（暗転して切り替え）。札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 色：高さ・位置・道の長さ 水色、力 緑、U 橙、強調・差 黄、負・誤り 赤（単元動画 ui-potential-1 と同じ）。
// 縮尺（図のために決めた値）：横から見た図 1 m＝55 px（床 y＝470）、上から見た図 1 m＝80 px。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,ground,tex,texWidth} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,sentWin,voiceEnd,note} from './yt1-qx-common.mjs';

const K='qx-ui-potential:';
const NEG='#ff6b6b',CU=C.E,CH=C.x,CF=C.F,HI=C.hi;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const cc=(col,s)=>`{\\color{${col}}{${s}}}`;
// ---- 横から見た部屋 ----
const FY=470,SC=55,Yh=h=>FY-SC*h,PXp=290,QXp=PXp+3*SC,QYp=Yh(4);
const R1=80,R2=185;
// 右の説明の枠と、その下の誤答カード
const PX=740,PW=440,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const G1='机基準の U（点 Q）',G2='重力の仕事（この道）',G3='摩擦に U を作れない理由';
const ANS1=g=>answerTag(1,'B','90 J',{g}),ANS2=g=>answerTag(2,'A','−120 J',{g}),ANS3=g=>answerTag(3,'D','',{g});
const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
const divider=(y,g=1)=>fade(g,line(PX+30,y,PX+PW-30,y,{color:C.faint,w:2}));

function room({g=1,desk=1,deskHi=0,shelf=1}={}){
 let s=ground(200,730,FY);
 if(shelf)s+=rect(395,QYp,210,10,{fill:'#5a6a86',fo:1,stroke:'#8a9ab6',sw:2,rx:3})+line(405,QYp+10,405,FY,{color:'#5a6a86',w:4})+line(595,QYp+10,595,FY,{color:'#5a6a86',w:4})
  +label('棚',500,QYp+40,{size:24,color:C.dim,anchor:'middle'});
 if(desk){
  s+=fade(desk,rect(625,Yh(1),100,10,{fill:'#5a6a86',fo:1,stroke:'#8a9ab6',sw:2,rx:3})+line(635,Yh(1)+10,635,FY,{color:'#5a6a86',w:4})+line(715,Yh(1)+10,715,FY,{color:'#5a6a86',w:4})
   +label('机',675,Yh(1)+40,{size:24,color:C.dim,anchor:'middle'}));
  if(deskHi)s+=fade(deskHi,line(620,Yh(1),730,Yh(1),{color:HI,w:7})+rect(612,Yh(1)-14,126,28,{fill:HI,fo:.12,stroke:HI,sw:2,rx:8}));
 }
 return fade(g,s);
}
function box(x,y,{g=1,top=0}={}){ // y＝箱の底
 return fade(g,rect(x-30,y-44,60,44,{fill:'#7a5a3c',fo:.8,stroke:'#c9a27a',sw:3,rx:5})+label('3 kg',x,y-14,{size:22,color:C.ink,anchor:'middle',weight:700}));
}
const grav=(x,y,{g=1,txt='重力'}={})=>fade(g,arrow(x+44,y-44,x+44,y+4,{color:CF,w:6,head:16})+label(txt,x+54,y-12,{size:24,color:CF,weight:700}));
const ptP=(g=1)=>fade(g,dot(PXp,FY,7,C.ink)+label('P',PXp-30,FY+30,{size:28,color:C.ink,weight:700,anchor:'middle'}));
const ptQ=(g=1,lab=1)=>fade(g,dot(QXp,QYp,8,HI)+(lab?label('Q',QXp-14,QYp-14,{size:28,color:HI,anchor:'end',weight:700}):''));
// 左の目盛り（床が 0）と、2本目（机が 0）
function ruler1({g=1,title=0}={}){
 let s=line(R1,FY,R1,Yh(4.4),{color:CH,w:3});
 for(const [h,t] of [[0,'0 m'],[1,'1 m'],[4,'4 m']])s+=line(R1-8,Yh(h),R1+8,Yh(h),{color:CH,w:3})+label(t,R1-14,Yh(h)+8,{size:24,color:CH,anchor:'end'});
 if(title)s+=fade(title,label('床が 0',R1,Yh(4.4)-14,{size:22,color:CH,anchor:'middle',weight:700}));
 return fade(g,s);
}
function ruler2({g=1,hi=0}={}){
 let s=line(R2,FY,R2,Yh(4.4),{color:CH,w:3});
 for(const [h,t] of [[0,'−1 m'],[1,'0'],[4,'3 m']])s+=line(R2-8,Yh(h),R2+8,Yh(h),{color:CH,w:3})+label(t,R2-14,Yh(h)+8,{size:24,color:h===0?NEG:CH,anchor:'end'});
 s+=label('机が 0',R2,Yh(4.4)-14,{size:22,color:CH,anchor:'middle',weight:700});
 s+=line(R2,Yh(1),625,Yh(1),{color:C.faint,w:2,dash:'6 8'});
 if(hi)s+=fade(hi,line(R2,Yh(1),R2,Yh(1)-(Yh(1)-Yh(4))*clamp(hi),{color:HI,w:8})+line(R2,Yh(4),QXp,QYp,{color:C.faint,w:2,dash:'6 8'}));
 return fade(g,s);
}
// 小問2 の道（P→上 6 m→右 3 m→下 2 m→Q）
const PATH=[[PXp,FY],[PXp,Yh(6)],[QXp,Yh(6)],[QXp,QYp]];
function pathLines({g=1,p=1,labels=1,glow=0,lt=1,ld=1}={}){
 let s=draw(PATH,p,{color:CH,w:3.5,dash:'9 8'});
 if(glow)s+=fade(glow,draw(PATH,1,{color:HI,w:7,opacity:.55}));
 if(labels)s+=fade(labels,label('上へ 6 m',PXp-14,Yh(3.6),{size:24,color:CH,anchor:'end',weight:700})+fade(lt,label('右へ 3 m',(PXp+QXp)/2+22,Yh(6)-14,{size:24,color:CH,anchor:'middle',weight:700}))
  +fade(ld,label('下へ 2 m',QXp+14,Yh(5.45),{size:24,color:CH,weight:700})));
 return fade(g,s);
}
// 道の上の箱の位置（u＝0〜3：区間ごと）
function along(u){
 const i=clamp(Math.floor(u),0,2),f=clamp(u-i);
 return [mix(PATH[i][0],PATH[i+1][0],f),mix(PATH[i][1],PATH[i+1][1],f)];
}
// ---- 上から見た床（小問3）----
const S1=[170,400],S2=[410,400],AP=[290,240];
function topView({g=1,paths=1,fric=1,vals=0,crossV=0,cardG=0,box_=1}={}){
 let s=rect(40,96,640,410,{fill:'#142039',fo:.9,stroke:C.faint,sw:2,rx:10});
 s+=label('上から 見た 床',60,130,{size:22,color:C.dim});
 s+=fade(paths,line(S1[0],S1[1],S2[0],S2[1],{color:CH,w:4})+draw([S1,AP,S2],1,{color:CH,w:4,dash:'11 8'})
  +L('まっすぐ 3 m',290,388,{size:24,color:CH,weight:700})+L('遠回り 5 m',290,226,{size:24,color:CH,weight:700}));
 s+=dot(S1[0],S1[1],8,C.ink)+dot(S2[0],S2[1],8,C.ink);
 if(box_)s+=rect(S1[0]-50,S1[1]-24,44,44,{fill:'#7a5a3c',fo:.8,stroke:'#c9a27a',sw:3,rx:5});
 s+=fade(fric,rect(480,150,170,50,{fill:CF,fo:.12,stroke:CF,sw:2,rx:12})+L('摩擦 2 N',565,184,{size:26,color:CF,weight:700}));
 s+=fade(vals,L('−6 J',290,352,{size:28,color:NEG,weight:700})+L('−10 J',290,190,{size:28,color:NEG,weight:700}));
 if(cardG){
  s+=fade(cardG,rect(160,436,260,52,{fill:HI,fo:.12,stroke:HI,sw:2.5,rx:12})+L('U の差 ＝ 一つの値',290,471,{size:26,color:HI,weight:700}));
  if(crossV)s+=fade(crossV,line(170,440,410,486,{color:NEG,w:5})+line(170,486,410,440,{color:NEG,w:5}));
 }
 return fade(g,s);
}

// 小問1 の部屋（rulers・箱・Q）
function scene1({r2=0,r2hi=0,q90=0,gravTxt='重力',deskHi=0}={}){
 let s=room({deskHi})+ruler1()+fade(r2,ruler2({hi:r2hi}))+box(PXp,FY)+grav(PXp,FY,{txt:gravTxt})+ptP()+ptQ();
 s+=fade(q90,label('U ＝ 90 J',QXp+16,QYp-16,{size:28,color:CU,weight:700}));
 return s;
}
// 行6 の2本の目盛り（右の枠の中）：床が基準・机が基準
function twoScales({g=1,right=1,diff=0}={}){
 const yQ=170,yF=420,yD=yF-(yF-yQ)/4,x1=PX+80,x2=PX+270;
 let s=panel(86,420,'',1);
 const col=(x,title,vQ,vF,vD,gg)=>fade(gg,L(title,x,124,{size:24,color:CH,weight:700})+line(x,yF,x,yQ,{color:CH,w:3})
  +line(x-8,yQ,x+8,yQ,{color:CH,w:3})+line(x-8,yF,x+8,yF,{color:CH,w:3})+(vD?line(x-8,yD,x+8,yD,{color:CH,w:3})+label(vD,x+14,yD+8,{size:24,color:CU}):'')
  +label('棚 Q',x-14,yQ+8,{size:22,color:C.dim,anchor:'end'})+label('床',x-14,yF+8,{size:22,color:C.dim,anchor:'end'})
  +label(vQ,x+14,yQ+8,{size:26,color:CU,weight:700})+label(vF,x+14,yF+8,{size:26,color:vF.startsWith('−')?NEG:CU,weight:700}));
 s+=col(x1,'床が 基準','120 J','0 J','',1)+col(x2,'机が 基準','90 J','−30 J','0 J',right);
 for(const x of [x1,x2])s+=fade(diff,arrow(x+100,yF-4,x+100,yQ+4,{color:HI,w:5,head:16})+arrow(x+100,yQ+4,x+100,yF-4,{color:HI,w:5,head:16}));
 s+=fade(diff,L('差は どちらも 120 J',PC,478,{size:28,color:HI,weight:700}));
 return fade(g,s);
}

export const ytQxUiPotentialDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（8 s）：0〜2 s 部屋・P の箱・重力・g の札 → 2〜4 s Q と寸法線 → 4〜6 s 小問2 の道（線だけ）→ 6〜8 s 暗転して上から見た床（小問3）で静止。
 [K+'q0']:(p)=>{
  const t=8*p,out=seg(t,6,6.6),inn=seg(t,6.7,7.4);
  let a=room({g:seg(t,0,.6)})+ruler1({g:seg(t,0,.6)})+box(PXp,FY,{g:seg(t,.3,.9)})+ptP(seg(t,.3,.9))+grav(PXp,FY,{g:seg(t,.8,1.4)});
  a+=fade(seg(t,1.2,1.8),label('g ＝ 10 m/s²、上向きが 正',1160,120,{size:26,color:C.ink,anchor:'end',weight:700}));
  a+=ptQ(seg(t,2,2.5));
  a+=fade(seg(t,2.4,3.4),line(PXp,FY-2,QXp,FY-2,{color:CH,w:3,dash:'8 7'})+line(QXp,FY,QXp,QYp,{color:CH,w:3,dash:'8 7'})
   +label('右へ 3 m',(PXp+QXp)/2,FY+32,{size:24,color:CH,anchor:'middle',weight:700})+label('上へ 4 m',QXp+12,Yh(1.6),{size:24,color:CH,weight:700}));
  a+=pathLines({p:seg(t,4,5.4),labels:seg(t,5,5.8)});
  a+=fade(seg(t,4.6,5.4),label('小問2 の道（箱は 動かさない）',1160,170,{size:24,color:C.dim,anchor:'end'}));
  let s=fade(1-out,a);
  s+=fade(inn,topView({})+label('小問3 の 場面',1160,120,{size:26,color:C.ink,anchor:'end',weight:700}));
  return s;
 },
 // 小問2（3 s）：部屋・P の箱・Q と、小問2 の道（線だけ）。箱は動かさない。
 [K+'q2']:(p)=>{
  let s=room()+ruler1()+box(PXp,FY)+ptP()+grav(PXp,FY)+ptQ();
  s+=label('g ＝ 10 m/s²、上向きが 正',1160,120,{size:26,color:C.ink,anchor:'end',weight:700});
  s+=pathLines({p:seg(p,.05,.6),labels:seg(p,.45,.8)});
  return s;
 },
 // 小問3（3 s）：上から見た床。まっすぐ 3 m と遠回り 5 m の道（線だけ）、「摩擦 2 N」。
 [K+'q3']:(p)=>topView({g:seg(p,0,.25),paths:seg(p,.2,.6),fric:seg(p,.55,.85)}),

 // ===================== 小問1 =====================
 // 1. 部屋の図。机の上面を黄で光らせる。右の枠に「机の上面を U の基準（0）」
 [K+'goal1']:(p)=>{
  let s=scene1({deskHi:seg(p,.35,.5)});
  s+=panel(90,250,L('小問1',PC,135,{size:26,color:C.dim})+L('机の 上面 を',PC,195,{size:30,color:HI,weight:700})+L('U の 基準（0）に する',PC,240,{size:30,color:HI,weight:700})
   +divider(272)+L('点 Q での 箱の U は？',PC,318,{size:28,weight:700}),seg(p,.05,.2),HI);
  return s+goalTag(G1,{g:seg(p,.03,.15)});
 },
 // 2. 「定義」タグ。持ち上げる仕事 mgh。2文目で mg＝30 N（重力の矢印に 30 N）
 [K+'mg']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=scene1({deskHi:1-seg(p,.05,.15),gravTxt:seg(p,b+.1,b+.2)>.5?'mg ＝ 30 N':'重力'});
  s+=panel(90,330,kindTag('定義',PC,135,{g:seg(p,.03,.1)})+L('U の 増え分 ＝',PC,190,{size:26})+L('重力の 仕事の 符号を 逆に したもの',PC,228,{size:24})
   +divider(258,seg(p,.2,.3))+fade(seg(p,.2,.3),L('持ち上げる 仕事 ＝ mgh',PC,302,{size:28,color:CU,weight:700}))
   +fade(seg(p,b,b+.12),T(`${cc(CF,'mg')}=3\\times10=${cc(CF,'30\\ \\mathrm{N}')}`,PC,375,36)),seg(p,0,.1));
  return s+goalTag(G1);
 },
 // 3. 机を 0 とする2本目の目盛り。机から 0→3 m を光らせ、Q に「90 J」
 [K+'h3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=scene1({r2:seg(p,.05,.2),r2hi:seg(p,b,b+.25),q90:seg(p,b+.45,b+.55),gravTxt:'mg ＝ 30 N'});
  s+=panel(90,330,L('h は 基準の 机 から 測る',PC,140,{size:28,color:CH,weight:700})
   +fade(seg(p,b,b+.12),T(`${cc(CH,'h')}=4-1=${cc(CH,'3\\ \\mathrm{m}')}`,PC,225,40))
   +fade(seg(p,b+.3,b+.42),T(`${cc(CU,'U')}=30\\times3=${cc(CU,'90\\ \\mathrm{J}')}`,PC,325,40)),seg(p,0,.1),CH);
  return s+goalTag(G1);
 },
 // 4. 小問1 の答え B。2文目で誤答カード A
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx);
  let s=scene1({r2:1,r2hi:1,q90:1,gravTxt:'mg ＝ 30 N'});
  s+=panel(90,170,L('机が 基準',PC,135,{size:24,color:C.dim})+T(`${cc(CU,'U')}=30\\times3=${cc(CU,'90\\ \\mathrm{J}')}`,PC,210,38),1);
  s+=wrongSeq(p,ctx,[['A','120 J','床からの 高さ 4 m を 使った']],{win:[[W[1]?W[1][0]:.4,1]],opts:{...WOPT,y:290}});
  return s+goalTag(G1)+ANS1(seg(p,.03,.1));
 },
 // 5. 誤答 C → D（一枚ずつ）
 [K+'wrong1']:(p,ctx)=>{
  let s=scene1({r2:1,r2hi:1,q90:1,gravTxt:'mg ＝ 30 N'});
  s+=panel(90,170,L('机が 基準',PC,135,{size:24,color:C.dim})+T(`${cc(CU,'U')}=30\\times3=${cc(CU,'90\\ \\mathrm{J}')}`,PC,210,38),1);
  s+=wrongSeq(p,ctx,[['C','150 J','4＋1＝5 m と 足した'],['D','30 J','机の 高さ 1 m を 使った']],{opts:{...WOPT,y:290}});
  return s+goalTag(G1)+ANS1(1);
 },
 // 6a. 2本の目盛り：床基準 Q 120 J・床 0 J、机基準 Q 90 J・床 −30 J
 [K+'base']:(p)=>{
  let s=scene1({r2:1,r2hi:0,q90:0,gravTxt:'mg ＝ 30 N'});
  s+=twoScales({right:seg(p,.35,.5)});
  return s+goalTag(G1)+ANS1(1);
 },
 // 6b. 差 120 J を同じ黄の矢印で
 [K+'base2']:(p)=>{
  let s=scene1({r2:1,r2hi:0,q90:0,gravTxt:'mg ＝ 30 N'});
  s+=twoScales({diff:seg(p,.3,.5)});
  return s+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 // 7. 道の線を光らせる
 [K+'goal2']:(p)=>{
  let s=room({desk:0})+box(PXp,FY)+grav(PXp,FY,{txt:'30 N'})+ptP()+ptQ()+pathLines({glow:seg(p,.3,.45)*(1-seg(p,.8,.95))});
  s+=panel(90,250,L('小問2',PC,135,{size:26,color:C.dim})+L('P → Q を この 道で 運ぶ',PC,195,{size:28,color:CH,weight:700})
   +divider(228)+L('重力が する 仕事 は？',PC,280,{size:30,color:HI,weight:700}),seg(p,.05,.2),HI);
  return s+goalTag(G2,{g:seg(p,.03,.15)});
 },
 // 8a. 区間に分けて、符号付きで足す
 [K+'split']:(p)=>{
  let s=room({desk:0})+box(PXp,FY)+grav(PXp,FY,{txt:'30 N'})+ptP()+ptQ()+pathLines({});
  const segs=[[PATH[0],PATH[1]],[PATH[1],PATH[2]],[PATH[2],PATH[3]]];
  segs.forEach(([a,b],i)=>{s+=fade(seg(p,.2+.15*i,.3+.15*i),line(a[0],a[1],b[0],b[1],{color:HI,w:6,opacity:.6}));});
  s+=panel(90,250,L('区間に 分ける',PC,140,{size:28,color:HI,weight:700})+fade(seg(p,.5,.65),L('重力の 仕事を',PC,200,{size:28})+L('符号付きで 足す',PC,245,{size:28,weight:700})),seg(p,0,.1));
  return s+goalTag(G2);
 },
 // 8b. 上へ 6 m：箱が上へ動く。−30×6＝−180 J
 [K+'up']:(p)=>{
  const u=seg(p,.05,.5),[bx,by]=along(u);
  let s=room({desk:0})+ptP()+ptQ()+pathLines({lt:1-seg(u,.85,1)})+box(bx,by)+grav(bx,by,{txt:''});
  s+=fade(seg(p,.1,.25),arrow(PXp-60,Yh(1.2),PXp-60,Yh(2.6),{color:C.v,w:5,head:16})+label('動き',PXp-70,Yh(1.9),{size:24,color:C.v,anchor:'end',weight:700}));
  s+=fade(seg(p,.55,.65),label('−180',PXp-14,Yh(4.6),{size:32,color:NEG,anchor:'end',weight:700}));
  s+=panel(90,200,L('重力 30 N（下向き）',PC,135,{size:26,color:CF,weight:700})+fade(seg(p,.25,.35),L('上へ 6 m：逆向き',PC,185,{size:26,color:CH}))
   +fade(seg(p,.45,.6),T(`-30\\times6=${cc(NEG,'-180\\ \\mathrm{J}')}`,PC,245,34)),seg(p,0,.1));
  return s+goalTag(G2);
 },
 // 9. 右へ 3 m：直角で 0 J。下へ 2 m：同じ向きで ＋60 J
 [K+'rd']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,u=1+seg(p,.03,b-.08)+seg(p,b,b+.3),[bx,by]=along(u);
  let s=room({desk:0})+ptP()+ptQ()+pathLines({lt:seg(u,2.2,2.4),ld:1-seg(u,1.9,2)*(1-seg(u,2.9,3))})+box(bx,by)+grav(bx,by,{txt:'',g:1-seg(u,2.85,3)});
  s+=label('−180',PXp-14,Yh(4.6),{size:32,color:NEG,anchor:'end',weight:700});
  const mx=(PXp+QXp)/2,my=Yh(6);
  s+=fade(seg(p,b-.2,b-.1),label('0',mx,my+44,{size:32,color:C.ink,anchor:'middle',weight:700})+draw([[mx+22,my+4],[mx+22,my+22],[mx+40,my+22]],1,{color:HI,w:3}));
  s+=fade(seg(p,b+.3,b+.4),label('＋60',QXp+56,Yh(4.25),{size:32,color:CU,weight:700}));
  s+=panel(90,250,L('重力 30 N（下向き）',PC,135,{size:26,color:CF,weight:700})+L('上へ 6 m： −180 J',PC,185,{size:26,color:NEG})
   +fade(seg(p,.1,.2),L('右へ 3 m（直角）： 0 J',PC,235,{size:26,color:C.ink}))
   +fade(seg(p,b+.05,b+.15),L('下へ 2 m（同じ向き）： ＋60 J',PC,285,{size:26,color:CU})),seg(p,0,.1));
  return s+goalTag(G2);
 },
 // 10. 合計 −120 J。小問2 の答え A。2文目で、高さが 4 m 上がったことを黄で
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=room({desk:0})+ptP()+ptQ()+pathLines({})+box(QXp,QYp);
  s+=label('−180',PXp-14,Yh(4.6),{size:32,color:NEG,anchor:'end',weight:700})+label('0',(PXp+QXp)/2,Yh(6)+44,{size:32,color:C.ink,anchor:'middle',weight:700})+label('＋60',QXp+56,Yh(4.25),{size:32,color:CU,weight:700});
  s+=fade(seg(p,b,b+.12),line(PXp,FY,640,FY,{color:HI,w:2,dash:'6 6'})+line(QXp+60,QYp,640,QYp,{color:HI,w:2,dash:'6 6'})
   +arrow(650,FY,650,QYp+4,{color:HI,w:6,head:18})+label('4 m',660,Yh(2),{size:28,color:HI,weight:700}));
  s+=panel(90,200,L('合計',PC,135,{size:26,color:C.dim})+fade(seg(p,.05,.2),T(`-180+0+60=${cc(NEG,'-120\\ \\mathrm{J}')}`,PC,200,34))
   +fade(seg(p,b,b+.12),L('上がった 高さ 4 m で 決まる',PC,262,{size:24,color:HI,weight:700})),seg(p,0,.1));
  return s+goalTag(G2)+ANS2(seg(p,b-.12,b-.04));
 },
 // 11. 誤答 B → C → D（一枚ずつ）
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),m=W[0][1]*.5;
  let s=room({desk:0})+ptP()+ptQ()+pathLines({})+box(QXp,QYp);
  s+=label('−180',PXp-14,Yh(4.6),{size:32,color:NEG,anchor:'end',weight:700})+label('0',(PXp+QXp)/2,Yh(6)+44,{size:32,color:C.ink,anchor:'middle',weight:700})+label('＋60',QXp+56,Yh(4.25),{size:32,color:CU,weight:700});
  s+=panel(90,150,L('合計',PC,130,{size:24,color:C.dim})+T(`-180+0+60=${cc(NEG,'-120\\ \\mathrm{J}')}`,PC,190,32),1);
  s+=wrongSeq(p,ctx,[['B','−180 J','下る 区間の ＋60 を 足していない'],['C','−240 J','下りも −60 とした'],['D','＋120 J','上がったのに 正に した']],{win:[[0,m],[m,W[0][1]],[W[1]?W[1][0]:.6,1]],opts:{...WOPT,y:270}});
  return s+goalTag(G2)+ANS2(1);
 },
 // 12. まっすぐな坂を細かい階段に分け、縦の段を黄で積むと 4 m。2文目で Q に U の札
 [K+'stairs']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6,N=8,dx=(QXp-PXp)/N,dy=(FY-QYp)/N;
  let s=room({desk:0})+ptP()+ptQ();
  s+=fade(seg(p,.02,.1),line(PXp,FY,QXp,QYp,{color:CH,w:3,dash:'8 7'})+label('まっすぐな 坂',PXp+40,Yh(2.6),{size:24,color:CH,anchor:'end',weight:700}));
  const st=seg(p,.08,.22),stack=seg(p,.28,.42);
  let pts=[[PXp,FY]];for(let i=0;i<N;i++){const [x,y]=pts.at(-1);pts.push([x+dx,y],[x+dx,y-dy]);}
  s+=draw(pts,st,{color:C.dim,w:3});
  for(let i=0;i<N;i++){
   const x=PXp+dx*(i+1),y0=FY-dy*i,tx=650,ty0=FY-dy*i;
   const X=mix(x,700,stack);
   s+=fade(seg(p,.2,.26),line(X,y0,X,y0-dy,{color:HI,w:7}));
  }
  s+=fade(seg(p,.42,.48),label('縦の 段の 合計',716,400,{size:24,color:HI,weight:700})+label('4 m',716,440,{size:30,color:HI,weight:700}));
  s+=box(PXp,FY,{g:1});
  s+=panel(90,250,L('坂でも 階段でも',PC,135,{size:26,color:C.dim})+fade(seg(p,.46,.54),T(`-30\\times4=${cc(NEG,'-120\\ \\mathrm{J}')}`,PC,200,36))
   +fade(seg(p,b,b+.1),divider(232)+L('各点に U が 一つ 決まる',PC,282,{size:28,color:CU,weight:700})),seg(p,0,.1));
  s+=fade(seg(p,b+.1,b+.2),rect(QXp+20,QYp-60,150,44,{fill:CU,fo:.14,stroke:CU,sw:2,rx:10})+label('Q の U',QXp+95,QYp-30,{size:26,color:CU,anchor:'middle',weight:700}));
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 // 13. 暗転して上から見た床
 [K+'goal3']:(p)=>{
  let s=topView({});
  s+=panel(90,250,L('小問3',PC,135,{size:26,color:C.dim})+L('摩擦に',PC,195,{size:30,color:HI,weight:700})+L('位置エネルギー を 作れない 理由',PC,240,{size:26,color:HI,weight:700}),seg(p,.05,.2),HI);
  return s+goalTag(G3,{g:seg(p,.03,.15)});
 },
 // 14. 「U の差＝一つの値」の札を2点の間に置く
 [K+'diff']:(p)=>{
  let s=topView({cardG:seg(p,.3,.45)});
  s+=panel(90,250,L('U が あるなら',PC,140,{size:28,color:CU,weight:700})+fade(seg(p,.25,.4),L('仕事 ＝ 両端の U の差',PC,200,{size:28})
   +L('→ 道に よらず 一つ',PC,250,{size:28,color:HI,weight:700})),seg(p,0,.1),CU);
  return s+goalTag(G3);
 },
 // 15. −6 J と −10 J。札に × 。小問3 の答え D
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=topView({cardG:1,vals:seg(p,.2,.35),crossV:seg(p,b,b+.12)});
  s+=panel(90,250,L('摩擦（2 N）の 仕事',PC,135,{size:26,color:CF,weight:700})+fade(seg(p,.15,.28),T(`-2\\times3=${cc(NEG,'-6\\ \\mathrm{J}')}`,PC,190,32))
   +fade(seg(p,.3,.42),T(`-2\\times5=${cc(NEG,'-10\\ \\mathrm{J}')}`,PC,245,32))+fade(seg(p,b,b+.1),L('道で 仕事が 変わる',PC,305,{size:28,color:HI,weight:700})),seg(p,0,.1));
  const ve=voiceEnd(ctx);
  return s+goalTag(G3)+ANS3(seg(p,ve-.07,ve-.01));
 },
 // 16. 誤答 A → B（一枚ずつ）
 [K+'wrong3']:(p,ctx)=>{
  let s=topView({cardG:1,vals:1,crossV:1});
  s+=panel(90,150,L('道で 仕事が 変わる',PC,140,{size:28,color:HI,weight:700})+L('→ U を 作れない',PC,190,{size:28,color:C.ink}),1);
  s+=wrongSeq(p,ctx,[['A','力が 小さい','大きさは 関係ない'],['B','高さを 変えない','横向きの ばねにも U が ある']],{opts:{...WOPT,y:270}});
  return s+goalTag(G3)+ANS3(1);
 },
 // 17. 誤答 C。小問2 の「−180」を小さく再表示
 [K+'wrongC']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=topView({cardG:1,vals:1,crossV:1});
  s+=panel(90,150,L('小問2 の 重力',PC,135,{size:24,color:C.dim})+L('上へ 6 m： −180 J',PC,185,{size:28,color:NEG,weight:700}),seg(p,.05,.15));
  s+=wrongCard('C','仕事が 負','重力も 上りでは 負',{...WOPT,y:270,g:seg(p,.02,.06)});
  s+=fade(seg(p,b,b+.1),L('問題は 符号 ではなく、',PC,440,{size:24,color:HI,weight:700})+L('道に よるか どうか',PC,474,{size:24,color:HI,weight:700}));
  return s+goalTag(G3)+ANS3(1);
 },

 // ===================== まとめ =====================
 // 18. 「重力 ○、摩擦 ×」の表。答えの札3枚を並べる
 [K+'sum']:(p)=>{
  let s=card(150,110,900,330,'',seg(p,0,.1));
  s+=fade(seg(p,.05,.15),L('仕事は 道に よる？',600,160,{size:28,color:C.dim}));
  const row=(y,name,mark,col,txt,g)=>fade(g,label(name,220,y,{size:32,color:C.ink,weight:700})+label(mark,400,y,{size:40,color:col,weight:700,anchor:'middle'})+label(txt,470,y,{size:28,color:col,weight:700}));
  s+=row(250,'重力','○',CF,'道に よらない → U を 作れる',seg(p,.15,.3));
  s+=fade(seg(p,.25,.35),line(190,300,1010,300,{color:C.faint,w:2}));
  s+=row(370,'摩擦','×',NEG,'道に よる → U を 作れない',seg(p,.3,.45));
  s+=fade(seg(p,.5,.65),L('保存力 だけに、位置で 決まる 貯金 U',600,490,{size:28,color:CU,weight:700}));
  return s+answerRow([[1,'B','90 J'],[2,'A','−120 J'],[3,'D','']],{g:seg(p,.6,.75)});
 },
};

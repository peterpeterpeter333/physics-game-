// 問題編 解説「ロープで台車を引く」（q-ui-effective-component、大学編 06 内積・初級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/06_内積.md の q-ui-effective-component（解説 14 行）。
// 画面の配置：左に床と台車、右に説明の枠（紺の塗り）。誤答カードは右の枠の下。凡例「影＝黄、直角な成分＝桃」は右下。
// 札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 色：力 緑、移動 水色、影（進む向きの成分）黄、直角な成分 桃、仕事・エネルギー 橙、角度 白、負の値 赤。
// 縮尺（図のために決めた値）：1 N ＝ 14 px、移動 4 m ＝ 200 px。
import {C,clamp,mix,seg,fade,move,scaleAt,label,line,rect,dot,ring,draw,arrow,highlight,ground,tex,texWidth} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,legend,note,pauseBadge,cueT,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-ui-effective-component:';
const FC=C.F,AL=C.hi,PP=C.p,LC=C.x,WC=C.E,CD='#ff6b6b';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const cc=(c,s)=>`{\\color{${c}}${s}}`;
const FY=400,SC=14,CWD=130,CHT=60,X0=150,DX=200;
const FXp=12*SC,FYp=9*SC;                 // ロープの力 15 N ＝ 右 12 N ＋ 上 9 N
const front=cx=>cx+CWD/2,TY=FY-46;        // 力の根元（台車の前の中ほど）
const CX1=X0+DX;                          // 4 m 進んだ後の台車の中心
const PX=680,PW=500,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const G1='ロープの力の仕事',G2='12 N だけを掛ける理由',G3='摩擦力の仕事';
const ANS1=g=>answerTag(1,'B','48 J',{g}),ANS2=g=>answerTag(2,'C','',{g}),ANS3=g=>answerTag(3,'D','−12 J',{g});
const LEG=(g=1)=>legend([['影（進む向きの成分）',AL],['直角な成分',PP]],PX+20,492,{g,dir:'row',size:22});
const W_=cc(WC,'W');
const F1a=`${W_}=12\\times4`,F1b=`=${cc(WC,'48\\ \\mathrm{J}')}`,fx0=PC-(texWidth(F1a,46,false)+8+texWidth(F1b,46,false))/2;

// 点線の矢印（成分の継ぎ足し）
function darrow(x,y,X,Y,{color=FC,w=3,head=14,g=1}={}){
 if(g<=0)return '';const XX=mix(x,X,g),YY=mix(y,Y,g),L=Math.hypot(XX-x,YY-y);if(L<2)return '';
 const a=Math.atan2(YY-y,XX-x),h=Math.min(head,L*.6),bx=XX-h*Math.cos(a),by=YY-h*Math.sin(a);
 return line(x,y,bx,by,{color,w,dash:'7 7'})+`<polygon points="${XX},${YY} ${bx+h*.5*Math.sin(a)},${by-h*.5*Math.cos(a)} ${bx-h*.5*Math.sin(a)},${by+h*.5*Math.cos(a)}" fill="${color}"/>`;
}
function cartBody(cx){
 return rect(cx-CWD/2,FY-16-CHT,CWD,CHT,{fill:'#5a6478',fo:.55,stroke:C.dim,sw:3,rx:8})
  +ring(cx-39,FY-12,12,{color:C.dim,w:3,fill:C.bg})+ring(cx+39,FY-12,12,{color:C.dim,w:3,fill:C.bg});
}
// 台車の場面。cx＝台車の中心。各部分の濃さ（0〜1）を指定する。
function scene(cx,{floor=1,body=1,rope=1,F=1,Flab=1,comp=0,compLab=1,fric=1,disp=1,dispU=1,dispLab=1,fGlow=0}={}){
 const tx=front(cx),ty=TY;let s='';
 s+=fade(floor,ground(30,660,FY));
 s+=fade(body,cartBody(cx));
 if(rope>0)s+=draw([[tx,ty],[tx+FXp*1.45,ty-FYp*1.45]],rope,{color:'#8a95a8',w:3});
 if(F>0){
  if(fGlow>0)s+=fade(fGlow,arrow(tx,ty,tx+FXp,ty-FYp,{color:AL,w:14,head:28}));
  s+=arrow(tx,ty,tx+FXp,ty-FYp,{color:FC,w:7,head:22,g:F})+fade(Flab*F,label('15 N',tx+FXp/2-18,ty-FYp/2-16,{size:28,color:FC,anchor:'end',weight:700}));
 }
 if(comp>0){
  const a=clamp(comp*2),b=clamp(comp*2-1);
  s+=darrow(tx,ty,tx+FXp,ty,{g:a})+fade(a*compLab,label('12 N',tx+FXp/2,ty+34,{size:24,color:FC,anchor:'middle',weight:700}));
  s+=darrow(tx+FXp,ty,tx+FXp,ty-FYp,{g:b})+fade(b*compLab,label('9 N',tx+FXp+16,ty-FYp/2+8,{size:24,color:FC,weight:700}));
 }
 if(fric>0){const rx=cx-CWD/2;s+=fade(fric,arrow(rx,FY-8,rx-3*SC-10,FY-8,{color:FC,w:6,head:16})+label('3 N',rx-40,FY-24,{size:24,color:FC,anchor:'middle',weight:700}));}
 if(disp>0&&dispU>0){const x1=front(X0);s+=fade(disp,line(x1,FY+26,x1,FY+50,{color:LC,w:2})+arrow(x1,FY+38,x1+DX*dispU,FY+38,{color:LC,w:4,head:14})
  +fade(dispLab,label('4 m',x1+DX/2,FY+76,{size:26,color:LC,anchor:'middle',weight:700})));}
 return s;
}
// 真上からの光と、15 N の矢印の床への影
function lamp(g=1){
 const tx=front(CX1);let s='';
 for(let x=tx-20;x<=tx+FXp+30;x+=50)s+=arrow(x,98,x,128,{color:AL,w:3,head:10,opacity:.8});
 return fade(g,line(tx-40,90,tx+FXp+50,90,{color:AL,w:3,opacity:.6})+s+label('真上からの 光',tx-52,112,{size:22,color:AL,anchor:'end'}));
}
function shadow({rays=1,sh=1,lab=0}={}){
 const tx=front(CX1),X=tx+FXp,Y=TY-FYp;let s='';
 s+=fade(rays,line(X,Y+6,X,FY,{color:AL,w:2,dash:'6 6',opacity:.8})+line(tx,TY+6,tx,FY,{color:AL,w:2,dash:'6 6',opacity:.8}));
 if(sh>0)s+=line(tx,FY,mix(tx,X,sh),FY,{color:AL,w:12,cap:'butt'});
 s+=fade(lab,label('12 N',tx+FXp/2,FY+46,{size:26,color:AL,anchor:'middle',weight:700}));
 return s;
}
// 上向き 9 N（桃）。col＝縮み具合（0：元の長さ、1：床の上の点）
function pink9({g=1,col=0,ghost=1,lab=0,dotLab=0}={}){
 const X=front(CX1)+FXp,top=TY-FYp,bot=TY;let s='';
 if(col>0)s+=fade(ghost*g*.45,arrow(X,bot,X,top,{color:PP,w:6,head:18}));
 const yb=mix(bot,FY,col),yt=mix(top,FY,col);
 if(yb-yt>6)s+=fade(g,arrow(X,yb,X,yt,{color:PP,w:6,head:Math.min(18,(yb-yt)*.6)}));
 if(col>.9)s+=fade(g,dot(X,FY,9,PP));
 s+=fade(g*lab,label('9 N',X+16,TY-FYp+30,{size:24,color:PP,weight:700}));
 s+=fade(g*dotLab,label('影 なし',X+18,FY-16,{size:24,color:PP,weight:700}));
 return s;
}
// 直角の印（桃の 9 N と、水色の進む向き）
function rightMark(g=1){
 const X=front(CX1)+FXp,Y=TY,q=22;
 return fade(g,arrow(X,Y,X+80,Y,{color:LC,w:5,head:14})+draw([[X+q,Y],[X+q,Y-q],[X,Y-q]],1,{color:C.ink,w:3})
  +label('直角',X+34,Y-30,{size:24,color:C.ink,weight:700})+label('進む 向き',X+90,Y+8,{size:22,color:LC,weight:700}));
}
// 小問3：摩擦と移動を根元をそろえて並べた図
const O3=[330,250];
function tailToTail({g=1,labs=1,arc=1,dial=0,needle=0,dim=0}={}){
 const [ox,oy]=O3;let s='';
 s+=arrow(ox,oy,ox-150,oy,{color:FC,w:7,head:20})+arrow(ox,oy,ox+200,oy,{color:LC,w:7,head:20})+dot(ox,oy,6,C.ink);
 s+=fade(labs,label('F ＝ 力の 大きさ 3 N',ox-80,oy+50,{size:24,color:FC,anchor:'middle',weight:700})+label('L ＝ 移動の 長さ 4 m',ox+120,oy+90,{size:24,color:LC,anchor:'middle',weight:700}));
 s+=fade(labs,label('摩擦',ox-150,oy-18,{size:22,color:FC})+label('移動',ox+200,oy-18,{size:22,color:LC,anchor:'end'}));
 if(arc>0){const r=62,pts=Array.from({length:41},(_,i)=>{const a=Math.PI*i/40;return [ox+r*Math.cos(a),oy-r*Math.sin(a)];});
  s+=draw(pts,arc,{color:C.ink,w:3})+fade(arc*labs,label('θ ＝ 間の 角',ox,oy-80,{size:24,color:C.ink,anchor:'middle',weight:700}));}
 if(dial>0){
  const cx=ox,cy=488,r=78;let d='';
  d+=draw(Array.from({length:41},(_,i)=>{const a=Math.PI*i/40;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];}),1,{color:C.dim,w:3});
  for(const deg of [0,90,180]){const a=deg*Math.PI/180;d+=line(cx+(r-8)*Math.cos(a),cy-(r-8)*Math.sin(a),cx+(r+6)*Math.cos(a),cy-(r+6)*Math.sin(a),{color:C.dim,w:3});}
  d+=label('0°',cx+r+12,cy+6,{size:22,color:C.dim})+label('90°',cx,cy-r-12,{size:22,color:C.dim,anchor:'middle'})+label('180°',cx-r-12,cy+6,{size:22,color:C.dim,anchor:'end'});
  const a=Math.PI*needle;d+=line(cx,cy,cx+(r-14)*Math.cos(a),cy-(r-14)*Math.sin(a),{color:C.hi,w:5})+dot(cx,cy,7,C.hi);
  s+=fade(dial,d);
 }
 return fade(g*(1-dim*.6),s);
}
const tx1=front(CX1);

export const ytQxUiEffectiveComponentDiagrams={
 // ===================== 問題アニメ（出題、約6秒）=====================
 // 0〜2 s 床・台車・ロープ、2〜4 s 15 N と継ぎ足しの 12 N・9 N（緑の点線）、4〜6 s 摩擦 3 N・台車が 4 m 進んで一時停止。影・角度・値は出さない。
 [K+'q1']:(p)=>{
  const u=seg(p,.72,.9),cx=X0+DX*u;
  let s=move(255,0,scaleAt(345,330,1.2,scene(cx,{floor:seg(p,0,.12),body:seg(p,.04,.16),rope:seg(p,.14,.32),F:seg(p,.34,.45),Flab:seg(p,.42,.47),comp:seg(p,.48,.64),
   fric:seg(p,.67,.71),disp:u>0?1:0,dispU:u,dispLab:seg(p,.88,.93)})));
  s+=pauseBadge({g:seg(p,.92,.97)});
  return s;
 },

 // ===================== 小問1 =====================
 // 1. 出題中の最後の静止画。摩擦は薄く。凡例。右の枠に与えられた量
 [K+'goal1']:(p)=>{
  let s=scene(CX1,{comp:1,fric:.3});
  s+=panel(110,200,label('ロープの力 15 N',PC,160,{size:28,color:FC,anchor:'middle',weight:700})
   +label('＝ 右 12 N ＋ 上 9 N（継ぎ足し）',PC,210,{size:24,color:C.dim,anchor:'middle'})
   +label('台車は 右へ 4 m 進む',PC,270,{size:28,color:LC,anchor:'middle',weight:700}),seg(p,.1,.25));
  s+=goalTag(G1,{g:seg(p,.03,.15)})+LEG(seg(p,.15,.3));
  return s;
 },
 // 2. 「進む向き」で移動の矢印を光らせる → 真上からの光で 15 N の影を床に落とす
 [K+'shadow']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  const glow=seg(p,.12,.2)*(1-seg(p,b-.05,b));
  let s=scene(CX1,{comp:1,fric:.3,compLab:1});
  s+=fade(glow,highlight(front(X0)-14,FY+14,DX+40,76,1,LC)+label('進む 向き',front(X0)-24,FY+100,{size:24,color:LC,anchor:'end',weight:700}));
  s+=lamp(seg(p,b+.05,b+.15))+shadow({rays:seg(p,b+.12,b+.22),sh:seg(p,b+.2,b+.4)});
  s+=panel(110,200,label('仕事に 効くのは',PC,160,{size:28,color:C.dim,anchor:'middle'})
   +label('進む 向きの 成分 だけ',PC,210,{size:30,color:AL,anchor:'middle',weight:700})
   +fade(seg(p,b,b+.1),label('→ 右向きの 影 を 取る',PC,270,{size:28,color:AL,anchor:'middle',weight:700})),seg(p,.03,.12),AL);
  s+=goalTag(G1)+LEG();
  return s;
 },
 // 3. 影に「12 N」。上向き 9 N を桃で描き直し、光の中で縦に縮んで床の上の点になる。「影 なし」
 [K+'point']:(p)=>{
  let s=scene(CX1,{comp:1,fric:.3,compLab:0});
  s+=lamp(1)+shadow({rays:1,sh:1,lab:seg(p,.05,.15)});
  s+=pink9({g:seg(p,.3,.38),col:seg(p,.45,.75),lab:1,dotLab:seg(p,.75,.85)});
  s+=goalTag(G1)+LEG();
  return s;
 },
 // 4. 影 12 と移動 4 m を横に並べ、W＝12×4＝48 J を一操作ずつ。「B です」で答えの札
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),a=W[0][1],b=W[1]?W[1][0]:.7;
  let s=scene(CX1,{comp:1,fric:.3,compLab:0})+shadow({rays:0,sh:1,lab:1})+pink9({col:1,lab:0,ghost:1});
  s+=panel(96,300,label('影の 長さ',PX+40,150,{size:24,color:C.dim})+line(PX+170,142,PX+170+FXp,142,{color:AL,w:12,cap:'butt'})+label('12 N',PX+180+FXp,151,{size:26,color:AL,weight:700})
   +label('距離',PX+40,205,{size:24,color:C.dim})+arrow(PX+170,197,PX+170+DX,197,{color:LC,w:5,head:14})+label('4 m',PX+184+DX,206,{size:26,color:LC,weight:700})
   +fade(seg(p,a*.45,a*.6),T(F1a,fx0,280,46,{anchor:'start'}))
   +fade(seg(p,a*.8,a),T(F1b,fx0+texWidth(F1a,46,false)+8,280,46,{anchor:'start'})),seg(p,.03,.12));
  s+=goalTag(G1)+ANS1(seg(p,b,b+.08))+LEG();
  return s;
 },
 // 5. 誤答 A（60 J）。15 N の矢印を一瞬光らせる
 [K+'wrongA']:(p,ctx)=>{
  const blink=.5+.5*Math.sin(cueT(ctx)*7),gl=seg(p,.05,.12)*(1-seg(p,.55,.65));
  let s=scene(CX1,{comp:0,fric:.3,fGlow:gl*blink})+shadow({rays:0,sh:1,lab:1});
  s+=panel(96,140,label('影の 長さ × 距離',PC,140,{size:24,color:C.dim,anchor:'middle'})+T(`${W_}=12\\times4=${cc(WC,'48\\ \\mathrm{J}')}`,PC,200,40),1);
  s+=wrongCard('A','60 J',['15 N を そのまま 掛けた','上向きの 分まで 数えている'],{...WOPT,y:255,g:seg(p,.02,.08)});
  s+=goalTag(G1)+ANS1(1)+LEG();
  return s;
 },
 // 6. 誤答 C（36 J）→ 誤答 D（84 J）。C の間は桃の 9 N、D の間は 12 と 9 を一直線に並べた 21 の棒に赤の ×
 [K+'wrongCD']:(p,ctx)=>{
  const W=sentWin(ctx),wD=W[1]?W[1][0]:.5,inC=1-seg(p,wD-.04,wD),inD=seg(p,wD,wD+.05);
  let s=scene(CX1,{comp:0,fric:.3})+shadow({rays:0,sh:1,lab:1});
  s+=pink9({col:0,lab:1,g:1});
  s+=panel(96,150,fade(inC,label('影の 長さ × 距離',PC,140,{size:24,color:C.dim,anchor:'middle'})+T(`${W_}=12\\times4=${cc(WC,'48\\ \\mathrm{J}')}`,PC,200,40))
   +fade(inD,label('数として 足した',PC,130,{size:24,color:C.dim,anchor:'middle'})
    +line(PX+60,185,PX+60+120,185,{color:AL,w:14,cap:'butt'})+line(PX+60+120,185,PX+60+210,185,{color:PP,w:14,cap:'butt'})
    +label('12',PX+60+60,230,{size:24,color:AL,anchor:'middle',weight:700})+label('9',PX+60+165,230,{size:24,color:PP,anchor:'middle',weight:700})
    +label('＝ 21 N',PX+290,194,{size:26,color:C.dim,weight:700})
    +line(PX+120,160,PX+210,212,{color:CD,w:5})+line(PX+120,212,PX+210,160,{color:CD,w:5})),1);
  s+=wrongSeq(p,ctx,[['C','36 J',['上向き 9 N を 使った','進むのは 右向き']],['D','84 J',['12＋9＝21 N と した','矢印は 継ぎ足しで 足す']]],{opts:{...WOPT,y:255}});
  s+=goalTag(G1)+ANS1(1)+LEG();
  return s;
 },

 // ===================== 小問2 =====================
 // 7. 誤答カードを消す。黄の影 12 と桃の点（9）を残す
 [K+'goal2']:(p)=>{
  let s=scene(CX1,{comp:0,fric:.3})+shadow({rays:0,sh:1,lab:1})+pink9({col:1,ghost:1,dotLab:1});
  s+=panel(110,170,label('小問2',PC,160,{size:26,color:C.dim,anchor:'middle'})+label('12 N だけを 掛ける のは なぜ？',PC,225,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.08,.22),C.hi);
  s+=goalTag(G2,{g:seg(p,.03,.15)})+LEG();
  return s;
 },
 // 8. 「直角な9」で、桃の 9 N と水色の進む向きに直角の印。「C です」で答えの札
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),a=W[0][1],b=W[1]?W[1][0]:.65;
  let s=scene(CX1,{comp:0,fric:.3})+shadow({rays:0,sh:1,lab:1});
  s+=pink9({col:1-seg(p,a*.35,a*.5),ghost:0,lab:seg(p,a*.4,a*.5)});
  s+=rightMark(seg(p,a*.45,a*.6));
  s+=panel(96,150,label('進む 向きに 直角な 成分は、',PC,150,{size:28,color:C.ink,anchor:'middle',weight:700})
   +label('仕事を しない',PC,200,{size:30,color:PP,anchor:'middle',weight:700}),seg(p,a*.6,a*.75),PP);
  s+=goalTag(G2)+ANS2(seg(p,b,b+.08))+LEG();
  return s;
 },
 // 9. 誤答 A・B（1文目）→ D（2文目）。D のとき桃の 9 N を元の長さで光らせる
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),s1=W[0][1],wD=W[1]?W[1][0]:.5,inD=seg(p,wD,wD+.06);
  let s=scene(CX1,{comp:0,fric:.3})+shadow({rays:0,sh:1,lab:1});
  s+=pink9({col:0,ghost:0,lab:1})+fade(inD*(.5+.5*Math.sin(cueT(ctx)*6)),highlight(front(CX1)+FXp-26,TY-FYp-14,52,FYp+28,1,PP));
  s+=rightMark(1-inD);
  s+=panel(96,140,label('進む 向きに 直角な 成分は、',PC,145,{size:26,color:C.ink,anchor:'middle',weight:700})+label('仕事を しない',PC,195,{size:28,color:PP,anchor:'middle',weight:700}),1,PP);
  s+=wrongSeq(p,ctx,[['A','大きい方',['大きい方を 選ぶのでは ない','効く 成分は 進む 向きで 決まる']],['B','重力と 打ち消す',['重力の 話では ない','直角 なので 仕事を しない']],['D','右向きしか 持たない','ロープの 力は 上向き 成分も 持つ']],
   {win:[[0,s1*.5],[s1*.5,s1],[wD,1]],opts:{...WOPT,y:255}});
  s+=goalTag(G2)+ANS2(1)+LEG();
  return s;
 },

 // ===================== 小問3 =====================
 // 10. ロープ・影・9 N を消し、左向きの摩擦力を濃く
 [K+'goal3']:(p)=>{
  let s=scene(CX1,{rope:0,F:0,fric:1,disp:1});
  s+=fade(seg(p,.1,.25),highlight(CX1-CWD/2-70,FY-48,80,56,1,FC));
  s+=panel(110,200,label('摩擦力 3 N',PC,165,{size:30,color:FC,anchor:'middle',weight:700})+label('（左向き）',PC,205,{size:24,color:C.dim,anchor:'middle'})
   +label('移動 4 m（右向き）',PC,265,{size:30,color:LC,anchor:'middle',weight:700}),seg(p,.1,.25));
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 11a. 根元をそろえて並べ直す。先に F・L・θ の札、そのあと W＝FL cosθ
 [K+'angle']:(p)=>{
  let s=tailToTail({g:seg(p,0,.1),labs:seg(p,.12,.3),arc:seg(p,.25,.4)});
  s+=panel(110,200,label('力と 移動の 向きが 違う',PC,160,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.45,.6),T(`${W_}=${cc(FC,'F')}${cc(LC,'L')}\\cos\\theta`,PC,240,50)),seg(p,.05,.15));
  s+=goalTag(G3);
  return s;
 },
 // 11b. 間の角 180°：ダイヤルの針が 180° を指す。「cos180°＝−1」
 [K+'angle2']:(p)=>{
  let s=tailToTail({dial:seg(p,.05,.15),needle:seg(p,.15,.5)});
  s+=panel(110,280,label('力と 移動の 向きが 違う',PC,160,{size:26,color:C.dim,anchor:'middle'})+T(`${W_}=${cc(FC,'F')}${cc(LC,'L')}\\cos\\theta`,PC,240,50)
   +fade(seg(p,.45,.55),line(PX+40,290,PX+PW-40,290,{color:C.faint,w:2})+label('θ ＝ 180°',PC-120,345,{size:30,color:C.ink,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.72),T(`\\cos180^\\circ=${cc(CD,'-1')}`,PC+100,340,38)),1);
  s+=goalTag(G3);
  return s;
 },
 // 12. W＝3×4×(−1)＝−12 J。−1 を赤で光らせてから −12 J。「D です」で答えの札
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),a=W[0][1],b=W[1]?W[1][0]:.65;
  let s=tailToTail({dial:1,needle:1,dim:1});
  const e1=`${W_}=${cc(FC,'3')}\\times${cc(LC,'4')}\\times`,e2=`${cc(CD,'(-1)')}`,w1=texWidth(e1,46,false),w2=texWidth(e2,46,false),x0=PC-(w1+w2)/2;
  s+=panel(96,300,label('F ＝ 3 N、 L ＝ 4 m、 θ ＝ 180°',PC,145,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.05,a*.4),T(e1,x0,230,46,{anchor:'start'})+T(e2,x0+w1,230,46,{anchor:'start'}))
   +fade(seg(p,a*.35,a*.5)*(1-seg(p,a*.75,a*.85)),highlight(x0+w1-8,192,w2+16,74,1,CD))
   +fade(seg(p,a*.7,a*.9),T(`=${cc(CD,'-12\\ \\mathrm{J}')}`,PC,330,50)),1);
  s+=goalTag(G3)+ANS3(seg(p,b,b+.08));
  return s;
 },
 // 13. 台車が右へ進むにつれて、橙のエネルギーの棒が 12 J 分だけ減る（摩擦の分だけを描く）
 [K+'energy']:(p)=>{
  const u=seg(p,.1,.75),cx=X0+DX*u;
  let s=scene(cx,{rope:0,F:0,fric:1,disp:u>0?1:0,dispU:u,dispLab:seg(p,.7,.8)});
  const bx=PX+150,bw=90,top=130,full=300,cut=120,base=top+full;
  s+=label('台車の エネルギー',bx+bw/2,112,{size:24,color:WC,anchor:'middle',weight:700});
  s+=rect(bx,top+cut,bw,full-cut,{fill:WC,fo:.55,stroke:WC,sw:2,rx:4});
  s+=rect(bx,top+cut*u,bw,cut*(1-u),{fill:WC,fo:.55,stroke:WC,sw:2,rx:4});
  s+=rect(bx,top,bw,cut,{fill:'none',fo:0,stroke:CD,sw:2.5,rx:4,opacity:.9});
  s+=label('摩擦が 奪う 分',bx+bw+20,top+cut/2-6,{size:24,color:CD,weight:700})+label('12 J',bx+bw+20,top+cut/2+26,{size:28,color:CD,weight:700});
  s+=line(bx-30,base,bx+bw+30,base,{color:C.dim,w:3});
  s+=note('摩擦の 分 だけを 描いています（ロープの 仕事は 省略）',PC,485,{g:1});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },
 // 14. 誤答 A・B（1文目）→ C（2文目）。B のとき 90° と 180° の小さな図。最後に台車の図へ戻り 48 J と −12 J を並べて静止
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),s1=W[0][1],wC=W[1]?W[1][0]:.5,ve=voiceEnd(ctx),end=Math.min(1,ve+.02);
  const inB=seg(p,s1*.5,s1*.5+.04)*(1-seg(p,s1-.03,s1)),fin=seg(p,end,end+.06),mid=1-fin;
  let s='';
  // 左：A・C のあいだは根元をそろえた図、B のあいだは 90° と 180° の小さな図
  s+=fade(mid*(1-inB),tailToTail({dial:1,needle:1,labs:1}));
  const mini=(cx,deg,txt)=>{const r=Math.PI*deg/180,oy=330;return arrow(cx,oy,cx+110,oy,{color:LC,w:5,head:14})+arrow(cx,oy,cx+90*Math.cos(r),oy-90*Math.sin(r),{color:FC,w:5,head:14})
   +label(txt,cx,oy+52,{size:26,color:C.ink,anchor:'middle',weight:700});};
  s+=fade(mid*inB,mini(140,90,'90° → 0 J')+mini(440,180,'180° → 負')+label('摩擦は 移動と 逆向き',300,200,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(mid,panel(96,140,label('摩擦力の 仕事',PC,140,{size:24,color:C.dim,anchor:'middle'})+T(`${W_}=3\\times4\\times(-1)=${cc(CD,'-12\\ \\mathrm{J}')}`,PC,200,38),1));
  s+=fade(mid,wrongSeq(p,ctx,[['A','＋12 J','逆向き（cos180°＝−1）を 落とした'],['B','0 J',['直角なら 0','摩擦は 逆向き']],['C','−3 J',['4 m を 掛け忘れた','単位が N のまま']]],
   {win:[[0,s1*.5],[s1*.5,s1],[wC,end]],keepLast:false,opts:{...WOPT,y:255}}));
  // 最後：台車の図に戻り、影 12 → 48 J、摩擦 → −12 J
  if(fin>0){
   let f=scene(CX1,{comp:0,fric:1})+shadow({rays:0,sh:1,lab:1});
   f+=line(tx1+FXp+6,FY,PX+30,300,{color:WC,w:2,dash:'6 6'})+label('ロープの力の 仕事 48 J',PX+40,308,{size:30,color:WC,weight:700});
   f+=line(CX1-CWD/2-50,FY-30,150,300,{color:CD,w:2,dash:'6 6'})+label('摩擦力の 仕事 −12 J',40,288,{size:28,color:CD,weight:700});
   s+=fade(fin,f+answerRow([[1,'B','48 J'],[2,'C',''],[3,'D','−12 J']]));
  }
  s+=goalTag(G3,{g:mid})+ANS3(mid);
  return s;
 },
};

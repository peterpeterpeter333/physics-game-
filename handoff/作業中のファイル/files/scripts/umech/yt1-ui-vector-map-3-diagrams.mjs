// YouTube シリーズ「ベクトル・初級 3/3」(ys-ui-vector-map-3) — 図。Stage 1200×515.
// 色：電場 𝐄 水色(C.x)、力 𝐅 緑(C.F)、正電荷 赤、負電荷 青、試験電荷・q・倍率 黄、道向き成分 黄、直角成分 灰。右が x の正、上が y の正。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,poly} from './anim.mjs';

const K='ui-vector-map-3:';
const EC=C.x,FC=C.F,HI=C.hi,POS=C.a,NEG='#7fb3ff',W_='#dfe9ff';
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
const vE=cs(EC,'\\mathbf{E}'),vF=cs(FC,'\\mathbf{F}'),qq=cs(HI,'q');

function charge(x,y,sign=1,r=26){const c=sign>0?POS:NEG;return ring(x,y,r,{color:c,w:3,fill:sign>0?'#3a1d2a':'#1b2a48'})+label(sign>0?'＋':'−',x,y+r*.36,{size:r*1.05,color:c,anchor:'middle',weight:700});}
function testQ(x,y,txt='+1 C',g=1){return fade(g,dot(x,y,11,HI)+label(txt,x,y-22,{size:22,color:HI,anchor:'middle',weight:700}));}
const Lr=r=>600000/(r*r);// arrow length ∝ 1/r² (drawn to scale of the field strength)
function radial(cx,cy,sign,{g=1,radii=[100,150,210],n=8,rot=Math.PI/8,hl=-1,gs=null}={}){
 let s='';
 radii.forEach((r,j)=>{const L=Lr(r),gg=gs?gs[j]:g;
  for(let i=0;i<n;i++){const a=rot+i*2*Math.PI/n,ux=Math.cos(a),uy=-Math.sin(a);
   const x=cx+r*ux,y=cy+r*uy,X=x+sign*L*ux,Y=y+sign*L*uy;
   s+=fade(gg,dot(x,y,3.5,C.dim)+arrow(x,y,X,Y,{color:j===hl?HI:EC,w:j===hl?5:4,head:Math.min(14,L*.5)}));}});
 return s;
}
function mapField(cx,cy,g=1){
 let s='';
 for(let x=120;x<=1100;x+=110)for(let y=70;y<=480;y+=100){const dx=x-cx,dy=y-cy,r=Math.hypot(dx,dy);if(r<70)continue;
  const L=Math.min(70,864000/(r*r)),ux=dx/r,uy=dy/r;s+=dot(x,y,3,C.dim)+arrow(x,y,x+L*ux,y+L*uy,{color:EC,w:3.5,head:Math.min(13,L*.5)});}
 return fade(g,s);
}
// a horizontal path with varying field arrows (along-path components 3, 2, 1 N/C)
const PX0=180,PY=330,SEGW=250,U=38;// px per N/C
const PATHF=[[3,1.5],[2,2],[1,1.6]];
function pathScene(p,{split=0,decomp=0,prod=0,arrowsG=1}={}){
 let s=line(PX0-40,PY,PX0+3*SEGW+40,PY,{color:C.dim,w:5})+arrow(PX0+3*SEGW+40,PY,PX0+3*SEGW+80,PY,{color:C.dim,w:5,head:18})+label('道（進む向き →）',PX0-40,PY-30,{size:24,color:C.dim});
 for(let i=0;i<=3;i++)s+=fade(split,line(PX0+i*SEGW,PY-16,PX0+i*SEGW,PY+16,{color:C.ink,w:3}));
 for(let i=0;i<3;i++){const x0=PX0+i*SEGW,xm=x0+SEGW/2,[ex,ey]=PATHF[i];
  s+=fade(split,label('Δs ＝ 1 m',xm,PY+44,{size:22,color:C.ink,anchor:'middle'}));
  s+=fade(arrowsG*(1-decomp*.6),arrow(xm,PY,xm+ex*U,PY-ey*U,{color:EC,w:5}));
  s+=fade(decomp,line(xm+ex*U,PY,xm+ex*U,PY-ey*U,{color:C.dim,w:3,dash:'6 6'})+arrow(xm,PY-3,xm+ex*U,PY-3,{color:HI,w:7,head:18})+label(`${ex}`,xm+ex*U/2,PY-16,{size:24,color:HI,anchor:'middle',weight:700}));
  s+=fade(prod,label(`${ex} × 1`,xm,PY+100,{size:30,color:HI,anchor:'middle',weight:700}));
 }
 return s;
}

export const ytUiVectorMap3Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=label('前回：風の地図 ＝ 場',600,70,{size:28,color:C.dim,anchor:'middle'});
  const pts=[[-3,-1,2.2,.4],[-1.5,-1,1.6,.6],[0,-1,1,.2],[1.5,-1,.4,-.6],[3,-1,-.3,-1],[-3,.6,2.5,.6],[-1.5,.6,1.8,.3],[0,.6,.8,0],[1.5,.6,.2,-.8],[3,.6,-.4,-1.2]];
  pts.forEach(([a,b,u,v],i)=>{const x=600+a*110,y=250+b*90;s+=fade(seg(p,.05+i*.03,.25+i*.03),dot(x,y,3,C.dim)+arrow(x,y,x+u*40,y-v*40,{color:W_,w:4,head:13}));});
  s+=fade(seg(p,.55,.75),label('矢印 ＝ 風の向きと強さ',600,450,{size:30,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'elecmap']:(p)=>{
  let s=charge(600,270,1)+radial(600,270,1,{g:seg(p,.3,.6)});
  s+=fade(seg(p,.1,.25),label('電気を帯びた 小さな粒',850,90,{size:26,color:C.dim}));
  return s;
 },
 [K+'question']:(p)=>{
  let s=label('今回の問い',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=card(150,100,900,170,label('電気の地図の 矢印は',600,165,{size:34,color:C.ink,anchor:'middle'})
   +label('何を表している？',600,230,{size:40,color:HI,anchor:'middle',weight:700}),seg(p,0,.2),HI);
  let f=charge(600,400,1,20);for(let i=0;i<8;i++){const a=Math.PI/8+i*Math.PI/4,c=Math.cos(a),d=-Math.sin(a);f+=arrow(600+40*c,400+40*d,600+85*c,400+85*d,{color:EC,w:4,head:12});}
  s+=fade(seg(p,.3,.5),f);
  return s;
 },
 // ===== S2 電場の決め方 =====
 [K+'charge']:(p)=>{
  let s=charge(300,260,1,40);
  s+=fade(seg(p,.3,.5),label('電荷 ＝ 物が帯びている電気の量',560,220,{size:32,color:C.ink,weight:700}));
  s+=fade(seg(p,.6,.8),label('単位：クーロン［C］',560,300,{size:32,color:HI,weight:700}));
  return s;
 },
 [K+'sign']:(p)=>{
  let s=card(60,90,520,330,label('同じ符号',320,140,{size:30,color:C.ink,anchor:'middle',weight:700})
   +charge(250,260,1)+charge(390,260,1)+fade(seg(p,.3,.45),arrow(222,260,140,260,{color:FC,w:6})+arrow(418,260,500,260,{color:FC,w:6}))
   +label('押し合う',320,370,{size:28,color:FC,anchor:'middle'}),seg(p,.05,.2));
  s+=card(620,90,520,330,label('違う符号',880,140,{size:30,color:C.ink,anchor:'middle',weight:700})
   +charge(760,260,1)+charge(1000,260,-1)+fade(seg(p,.45,.6),arrow(788,260,860,260,{color:FC,w:6})+arrow(972,260,900,260,{color:FC,w:6}))
   +label('引き合う',880,370,{size:28,color:FC,anchor:'middle'}),seg(p,.1,.25));
  s+=fade(seg(p,.7,.85),label('実験で分かっている事実',600,475,{size:28,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'newton']:(p)=>{
  // palm holding a 100 g block; weight about 1 N
  let s=rect(260,300,220,26,{fill:'#c9a27a',fo:.85,stroke:'#e2c29c',rx:12})+rect(310,210,120,90,{fill:'#4a5a78',fo:.9,stroke:C.dim,rx:8})+label('100 g',370,265,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.35,.55),arrow(370,330,370,440,{color:FC,w:7})+label('約 1 N',390,420,{size:30,color:FC,weight:700}));
  s+=card(640,110,500,230,label('力の単位',890,165,{size:28,color:C.dim,anchor:'middle'})+label('ニュートン［N］',890,230,{size:38,color:FC,anchor:'middle',weight:700})
   +fade(seg(p,.5,.7),label('1 N ≈ 約100 g を支える力',890,300,{size:28,color:C.ink,anchor:'middle'})),seg(p,0,.2));
  return s;
 },
 [K+'test']:(p)=>{
  let s=charge(260,280,1,32)+label('もとの電荷',260,350,{size:24,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.1,.3),ring(760,280,30,{color:C.dim,w:2,dash:'6 6'})+label('調べたい場所',760,350,{size:24,color:C.dim,anchor:'middle'}));
  s+=testQ(760,280,'+1 C',seg(p,.3,.5));
  s+=fade(seg(p,.6,.8),label('試験電荷',760,420,{size:30,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'def']:(p)=>{
  let s=charge(260,280,1,32)+label('もとの電荷',260,350,{size:24,color:C.dim,anchor:'middle'})+testQ(760,280);
  const u=seg(p,.35,.55);
  s+=fade(1-u,arrow(760,280,920,280,{color:FC,w:7,g:seg(p,.05,.25)})+fade(seg(p,.15,.3),label('+1 C が受ける力',840,250,{size:24,color:FC,anchor:'middle'})));
  s+=fade(u,arrow(760,280,920,280,{color:EC,w:8})+T(vE,960,292,{size:44}));
  s+=card(420,380,680,110,label('𝐄 ＝ その場所で +1 C が受ける力',760,445,{size:32,color:EC,anchor:'middle',weight:700}),seg(p,.4,.55),EC);
  return s;
 },
 [K+'unit']:(p)=>{
  let s=charge(260,280,1,32)+testQ(760,280)+arrow(760,280,920,280,{color:EC,w:8})+T(vE,960,292,{size:44});
  s+=card(420,380,680,110,T(`\\mathrm{N/C}`,560,440,{size:44})+label('＝ 1 C あたりの力',820,448,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.3,.5),EC);
  return s;
 },
 [K+'real']:(p)=>{
  let s=card(100,100,1000,300,label('実際の 1 C は とても大きい',600,160,{size:32,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.4,.6),label('小さな電荷 q で 力 F を測る',600,240,{size:30,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.6,.8),label('→ F ÷ q で 1 C あたりに直す',600,310,{size:30,color:HI,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'assume']:(p)=>{
  let s=card(100,100,1000,300,label('仮定',600,160,{size:30,color:C.dim,anchor:'middle'})
   +fade(seg(p,.2,.4),label('試験電荷は、もとの電荷を動かさない',600,240,{size:32,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.5,.7),label('地図を乱さない（電荷は止まっている）',600,310,{size:32,color:C.ink,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 [K+'map']:(p)=>{
  let s=mapField(600,270,seg(p,.05,.45))+charge(600,270,1,28);
  s+=fade(seg(p,.5,.7),card(760,40,420,80,label('電場の地図',970,92,{size:32,color:EC,anchor:'middle',weight:700}),1,EC));
  s+=fade(seg(p,.65,.85),rect(360,440,480,54,{fill:'#131f38',fo:.95,stroke:C.faint,rx:12})+label('「置いたらどうなるか」の地図',600,476,{size:28,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S3 電荷のまわり =====
 [K+'pos']:(p)=>{
  let s=charge(420,265,1,30)+radial(420,265,1,{g:seg(p,.3,.6)});
  s+=card(760,110,400,200,label('正の電荷',960,170,{size:30,color:POS,anchor:'middle',weight:700})+fade(seg(p,.4,.6),label('+1 C は 押し出される',960,230,{size:26,color:C.ink,anchor:'middle'})+label('→ 外向き',960,275,{size:30,color:EC,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'near']:(p)=>{
  const h=p<.5?0:2;
  let s=charge(420,265,1,30)+radial(420,265,1,{hl:p<.5?0:2});
  s+=card(760,110,400,200,label('正の電荷',960,170,{size:30,color:POS,anchor:'middle',weight:700})
   +fade(seg(p,.05,.25),label('近い → 長い（強い）',960,235,{size:28,color:HI,anchor:'middle'}))
   +fade(seg(p,.5,.7),label('遠い → 短い（弱い）',960,280,{size:28,color:HI,anchor:'middle'})));
  return s;
 },
 [K+'neg']:(p)=>{
  let s=charge(420,265,-1,30)+radial(420,265,-1,{g:seg(p,.3,.6)});
  s+=card(760,110,400,200,label('負の電荷',960,170,{size:30,color:NEG,anchor:'middle',weight:700})+fade(seg(p,.4,.6),label('+1 C は 引き寄せられる',960,230,{size:26,color:C.ink,anchor:'middle'})+label('→ 内向き',960,275,{size:30,color:EC,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'neglen']:(p)=>{
  let s=charge(420,265,-1,30)+radial(420,265,-1,{hl:0});
  s+=card(760,110,400,240,label('負の電荷',960,170,{size:30,color:NEG,anchor:'middle',weight:700})
   +label('近い → 長い',960,230,{size:28,color:HI,anchor:'middle'})
   +fade(seg(p,.4,.6),label('変わるのは 向きだけ',960,300,{size:30,color:EC,anchor:'middle',weight:700})));
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=charge(380,260,1,30)+fade(seg(p,.1,.3),dot(560,260,9,C.ink)+label('点 P',560,310,{size:26,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.2,.35),label('？',600,240,{size:44,color:HI,weight:700}));
  s+=card(760,110,400,200,label('確認',960,160,{size:26,color:C.dim,anchor:'middle'})+label('正の電荷の すぐ右',960,220,{size:28,color:C.ink,anchor:'middle'})+label('電場の向きは？',960,270,{size:32,color:HI,anchor:'middle',weight:700}),seg(p,0,.15),HI);
  return s;
 },
 [K+'ans']:(p)=>{
  let s=charge(380,260,1,30)+dot(560,260,9,C.ink)+label('点 P',560,310,{size:26,color:C.ink,anchor:'middle'});
  s+=testQ(560,260,'+1 C',seg(p,.05,.2))+arrow(560,260,680,260,{color:EC,w:7,g:seg(p,.25,.5)});
  s+=card(760,110,400,200,label('確認',960,160,{size:26,color:C.dim,anchor:'middle'})+label('正の電荷の すぐ右',960,220,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.1,.3),label('右向き（外向き）',960,270,{size:32,color:EC,anchor:'middle',weight:700})),1,HI);
  return s;
 },
 [K+'ans2']:(p)=>{
  let s=charge(380,260,-1,30)+dot(560,260,9,C.ink)+label('点 P',560,310,{size:26,color:C.ink,anchor:'middle'});
  s+=testQ(560,260)+arrow(560,260,440,260,{color:EC,w:7,g:seg(p,.3,.55)});
  s+=card(760,110,400,200,label('負の電荷の 右側',960,170,{size:28,color:C.ink,anchor:'middle'})+fade(seg(p,.3,.5),label('左向き（内向き）',960,240,{size:32,color:EC,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 // ===== S4 受ける力 =====
 [K+'setup']:(p)=>{
  let s=dot(300,280,6,C.dim)+arrow(300,280,300+3*U,280,{color:EC,w:8})+T(vE,330,225,{size:40})+label('：右向き 3 N/C',360,236,{size:32,color:EC});
  s+=fade(seg(p,.35,.5),dot(300,280,14,HI)+label('+2 C',300,330,{size:26,color:HI,anchor:'middle',weight:700}));
  s+=card(700,110,450,200,label('受ける力は？',925,225,{size:36,color:HI,anchor:'middle',weight:700}),seg(p,.5,.65),HI);
  return s;
 },
 [K+'one']:(p)=>{
  let s=dot(300,200,6,C.dim)+arrow(300,200,300+3*U,200,{color:EC,w:6,opacity:.6})+label('3 N/C',300+1.5*U,185,{size:24,color:EC,anchor:'middle'});
  s+=testQ(300,330,'+1 C',seg(p,.1,.3))+arrow(300,330,300+3*U*1.3,330,{color:FC,w:8,g:seg(p,.35,.6)})+fade(seg(p,.5,.65),label('3 N',300+3*U*1.3+14,340,{size:30,color:FC,weight:700}));
  s+=card(760,110,400,200,label('+1 C あたり',960,180,{size:30,color:C.ink,anchor:'middle'})+fade(seg(p,.5,.7),label('右向きに 3 N',960,245,{size:34,color:FC,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'two']:(p)=>{
  const k=3*U*1.3;
  let s=dot(300,200,6,C.dim)+arrow(300,200,300+3*U,200,{color:EC,w:6,opacity:.6})+label('3 N/C',300+1.5*U,185,{size:24,color:EC,anchor:'middle'});
  s+=testQ(300,330,'+1 C')+testQ(300,420,'+1 C',seg(p,.05,.2));
  s+=arrow(300,330,300+k,330,{color:FC,w:7})+fade(seg(p,.1,.25),arrow(300,420,300+k,420,{color:FC,w:7}));
  s+=fade(seg(p,.4,.6),arrow(300+k,330,300+2*k,330,{color:FC,w:7,opacity:.8})+label('3 N ＋ 3 N ＝ 6 N',300+k+20,300,{size:26,color:FC,weight:700}));
  s+=card(760,110,400,200,label('+2 C ＝ +1 C × 2',960,180,{size:30,color:HI,anchor:'middle',weight:700})+fade(seg(p,.5,.7),label('力も ×2 → 6 N',960,245,{size:34,color:FC,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'formula']:(p)=>{
  let s=T(`${vF}=${qq}\\,${vE}`,600,170,{size:80});
  s+=fade(seg(p,.1,.3),label('力 [N]',470,280,{size:28,color:FC,anchor:'middle'}));
  s+=fade(seg(p,.2,.4),label('電荷 [C]',620,280,{size:28,color:HI,anchor:'middle'}));
  s+=fade(seg(p,.3,.5),label('電場 [N/C]',760,280,{size:28,color:EC,anchor:'middle'}));
  s+=fade(seg(p,.6,.8),label('電場の決め方（1 C あたりの力）を、力について書き直した形',600,400,{size:28,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'subst']:(p)=>{
  let s=T(`${vF}=${qq}\\,${vE}`,600,110,{size:52});
  s+=fade(seg(p,.05,.3),T(`=${cs(HI,'2\\,\\mathrm{C}')}\\times ${cs(EC,'3\\,\\mathrm{N/C}')}`,600,220,{size:56}));
  // cancel marks on C and /C
  const u=seg(p,.45,.6);
  s+=fade(u,line(528,238,572,200,{color:C.a,w:4})+line(730,238,770,200,{color:C.a,w:4})+label('C が約分',870,230,{size:26,color:C.a}));
  s+=fade(seg(p,.6,.8),T(`=${cs(FC,'6\\,\\mathrm{N}')}`,600,340,{size:60}));
  return s;
 },
 [K+'dir']:(p)=>{
  let s=card(60,90,520,330,label('q が正',320,140,{size:30,color:HI,anchor:'middle',weight:700})
   +arrow(200,230,360,230,{color:EC,w:6})+T(vE,400,240,{size:36})+dot(200,320,12,HI)+arrow(200,320,420,320,{color:FC,w:7})+T(vF,460,330,{size:36})
   +label('𝐄 と 同じ向き',320,395,{size:26,color:C.ink,anchor:'middle'}),seg(p,0,.15));
  s+=card(620,90,520,330,label('q が負',880,140,{size:30,color:NEG,anchor:'middle',weight:700})
   +arrow(760,230,920,230,{color:EC,w:6})+T(vE,960,240,{size:36})+dot(960,320,12,NEG)+arrow(960,320,740,320,{color:FC,w:7})+T(vF,700,330,{size:36})
   +label('𝐄 と 逆向き',880,395,{size:26,color:C.ink,anchor:'middle'}),seg(p,.5,.65));
  return s;
 },
 [K+'practice']:(p)=>{
  let s=card(150,100,900,300,label('練習：右向き 4 N/C の場所に +3 C',600,160,{size:30,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.3,.55),T(`F=${cs(HI,'3\\,\\mathrm{C}')}\\times${cs(EC,'4\\,\\mathrm{N/C}')}=${cs(FC,'12\\,\\mathrm{N}')}`,600,260,{size:52}))
   +fade(seg(p,.55,.75),label('向き：右（q が正）',600,350,{size:28,color:FC,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 // ===== S5 斜めの矢印と道 =====
 [K+'oblique']:(p)=>{
  const ox=300,oy=360,k=55;
  let s=testQ(ox,oy,'+q')+arrow(ox,oy,ox+3*k,oy-4*k,{color:EC,w:8,g:seg(p,.05,.3)})+fade(seg(p,.2,.35),T(vE,ox+3*k+30,oy-4*k+10,{size:40}));
  s+=fade(seg(p,.45,.65),arrow(ox,oy+50,ox+300,oy+50,{color:C.dim,w:4})+label('右へ動かす',ox+150,oy+90,{size:26,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'comp']:(p)=>{
  const ox=300,oy=380,k=55;
  let s=testQ(ox,oy,'+q')+arrow(ox,oy,ox+3*k,oy-4*k,{color:EC,w:8})+T(vE,ox+3*k+30,oy-4*k+10,{size:40});
  s+=fade(seg(p,.2,.4),arrow(ox,oy,ox+3*k,oy,{color:HI,w:6})+label('3',ox+1.5*k,oy+34,{size:28,color:HI,anchor:'middle',weight:700}));
  s+=fade(seg(p,.35,.55),line(ox+3*k,oy,ox+3*k,oy-4*k,{color:C.dim,w:4,dash:'8 6'})+label('4',ox+3*k+16,oy-2*k+10,{size:28,color:C.dim,weight:700}));
  s+=card(640,110,500,230,T(`${vE}=(3,\\,4)\\;\\mathrm{N/C}`,890,175,{size:44})
   +fade(seg(p,.6,.8),T(`|${vE}|=\\sqrt{3^2+4^2}=5`,890,275,{size:44})),seg(p,0,.15));
  return s;
 },
 [K+'which']:(p)=>{
  const ox=300,oy=380,k=55,d=seg(p,.35,.55);
  let s=testQ(ox,oy,'+q')+fade(1-.6*d,arrow(ox,oy,ox+3*k,oy-4*k,{color:EC,w:8}));
  s+=arrow(ox,oy,ox+3*k,oy,{color:HI,w:8})+label('3：効く',ox+1.5*k,oy+34,{size:28,color:HI,anchor:'middle',weight:700});
  s+=fade(1-.5*d,line(ox+3*k,oy,ox+3*k,oy-4*k,{color:C.dim,w:4,dash:'8 6'})+label('4',ox+3*k+16,oy-2*k+10,{size:28,color:C.dim,weight:700}));
  s+=fade(d,draw([[ox+3*k-16,oy],[ox+3*k-16,oy-16],[ox+3*k,oy-16]],1,{color:C.dim,w:2})+label('直角',ox+3*k+10,oy-24,{size:22,color:C.dim}));
  s+=card(640,110,500,230,label('右へ進める働き',890,170,{size:30,color:C.ink,anchor:'middle'})+fade(seg(p,.1,.3),label('右向き成分 3 だけ',890,230,{size:34,color:HI,anchor:'middle',weight:700}))
   +fade(seg(p,.55,.75),label('上向き成分 4 は 効かない',890,290,{size:28,color:C.dim,anchor:'middle'})),seg(p,0,.1));
  return s;
 },
 [K+'notlen']:(p)=>{
  let s=card(100,110,1000,260,label('長さ 5 を使う',330,205,{size:36,color:C.ink,anchor:'middle',weight:700})+label('✕ 直角な分まで数えて 多すぎる',790,203,{size:28,color:C.a,anchor:'middle',weight:700})
   +fade(seg(p,.4,.6),label('右向き成分 3 を使う',330,315,{size:36,color:HI,anchor:'middle',weight:700})+label('○ 右へ進める分だけ',790,313,{size:28,color:FC,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'work']:(p)=>{
  let s=card(100,110,1000,260,label('仕事',600,170,{size:36,color:C.E,anchor:'middle',weight:700})
   +fade(seg(p,.1,.35),label('力が、動いた向きに どれだけ働いたか',600,240,{size:32,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.55,.75),label('きちんとした定義は 次のステージで',600,310,{size:28,color:HI,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 [K+'path']:(p)=>pathScene(p,{arrowsG:seg(p,.1,.5)})+fade(seg(p,.4,.6),label('場所ごとに 矢印が変わる道',600,90,{size:30,color:HI,anchor:'middle',weight:700})),
 [K+'split']:(p)=>pathScene(p,{split:seg(p,.05,.35)})+fade(seg(p,.5,.7),label('区間の中では 矢印 ≈ 一定',600,90,{size:30,color:HI,anchor:'middle',weight:700})),
 [K+'each']:(p)=>{
  let s=pathScene(p,{split:1,decomp:seg(p,.1,.45)});
  s+=fade(seg(p,.4,.6),T(`${cs(HI,'E_x')}\\;\\times\\;\\Delta s`,600,100,{size:48})+label('道向きの成分',470,160,{size:24,color:HI,anchor:'middle'})+label('区間の長さ',720,160,{size:24,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'example']:(p)=>{
  let s=pathScene(p,{split:1,decomp:1,prod:seg(p,.35,.7)});
  s+=label('道向きの成分 3, 2, 1 N/C、Δs ＝ 1 m',600,100,{size:28,color:HI,anchor:'middle'});
  return s;
 },
 [K+'sigma']:(p)=>{
  let s=pathScene(p,{split:1,decomp:1,prod:1});
  s+=fade(seg(p,.05,.3),T(`\\sum_{i} ${cs(HI,'E_{x,i}')}\\,\\Delta s_i`,420,110,{size:48}));
  s+=fade(seg(p,.4,.6),T(`=3+2+1=6`,760,110,{size:48}));
  return s;
 },
 [K+'qsum']:(p)=>{
  let s=T(`W\\approx ${qq}\\sum_{i} ${cs(HI,'E_{x,i}')}\\,\\Delta s_i`,600,110,{size:58});
  s+=fade(seg(p,.1,.3),label('W：仕事（次のステージで定義）',600,200,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.5,.7),T(`=${cs(HI,'1\\,\\mathrm{C}')}\\times 6\\;\\mathrm{N\\,m/C}=6\\;\\mathrm{N\\,m}`,600,320,{size:52}));
  s+=fade(seg(p,.25,.45),label('≈：区間の中で 矢印を一定とみなした',600,440,{size:26,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'sameform']:(p)=>{
  let s=card(60,110,520,260,label('積分の回：距離',320,160,{size:28,color:C.dim,anchor:'middle'})+T(`\\Delta x\\approx\\sum_i ${cs(C.v,'v_i')}\\,${cs(C.t,'\\Delta t_i')}`,320,260,{size:46}),seg(p,0,.2));
  s+=card(620,110,520,260,label('今回：道に沿って',880,160,{size:28,color:C.dim,anchor:'middle'})+T(`${qq}\\sum_i ${cs(HI,'E_{x,i}')}\\,\\Delta s_i`,880,260,{size:46}),seg(p,.2,.4));
  s+=fade(seg(p,.5,.7),label('区間ごとに 掛けて、全部足す ― 同じ形',600,450,{size:30,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S6 まとめ・次の問い =====
 [K+'summary']:(p)=>{
  let s=label('まとめ',600,70,{size:30,color:C.dim,anchor:'middle'});
  s+=card(110,100,980,110,label('𝐄 ＝ その場所で +1 C が受ける力［N/C］',600,170,{size:32,color:EC,anchor:'middle',weight:700}),seg(p,0,.2));
  s+=card(110,230,980,110,T(`${vF}=${qq}\\,${vE}`,600,285,{size:50}),seg(p,.5,.7));
  return s;
 },
 [K+'summary2']:(p)=>{
  let s=label('まとめ',600,70,{size:30,color:C.dim,anchor:'middle'});
  s+=card(110,100,980,110,label('𝐄 ＝ その場所で +1 C が受ける力［N/C］',600,170,{size:32,color:EC,anchor:'middle',weight:700}));
  s+=card(110,230,980,110,T(`${vF}=${qq}\\,${vE}`,600,285,{size:50}));
  s+=card(110,360,980,130,label('正：外向き　負：内向き　近いほど長い',600,412,{size:28,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.5,.7),label('動くときは 進む向きの成分だけを足す',600,462,{size:28,color:HI,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'next']:(p)=>{
  let s=label('次回の問い',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=card(150,100,900,170,label('進む向きの成分だけが効く、は本当？',600,165,{size:32,color:C.ink,anchor:'middle'})
   +label('同じ 10 N でも 向きで 仕事は変わる？',600,230,{size:36,color:HI,anchor:'middle',weight:700}),seg(p,0,.2),HI);
  // the same 10 N pulled at three angles on a sled-like block
  const ang=[0,35,70];
  ang.forEach((a,i)=>{const x=260+i*340,y=440,r=a*Math.PI/180;s+=fade(seg(p,.35+i*.1,.5+i*.1),line(x-80,y,x+140,y,{color:C.dim,w:3})+rect(x-40,y-40,80,40,{fill:'#4a5a78',fo:.9,stroke:C.dim,rx:6})+arrow(x,y-20,x+110*Math.cos(r),y-20-110*Math.sin(r),{color:FC,w:6})+label('10 N',x+60,y-80,{size:22,color:FC}));});
  return s;
 },
};

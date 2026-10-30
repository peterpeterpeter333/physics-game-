// YouTube シリーズ「電位・初級 1/1」(ys-ui-electric-potential-1) — 図。Stage 1200×515.
// 色：電場 𝐄 水色、電位 V・位置エネルギー U・仕事 W 橙、差 黄、負の値 赤、力 緑、運動エネルギー 紫、正電荷 赤、負電荷 青。
// ベクトルは太字（𝐄）、大きさは細字（E）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,ground,tex,poly} from './anim.mjs';
import {charge} from './yt1-ui-closed-bag-1-diagrams.mjs';

const K='ui-electric-potential-1:';
const EC=C.x,VC=C.E,HI=C.hi,NG=C.a,FC=C.F,KC=C.v,BLUE='#7fb3ff';
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const tag=(text,x,y,color=C.dim,g=1)=>fade(g,rect(x-8,y-24,text.length*22+16,34,{fill:color,fo:.12,stroke:color,sw:1.5,rx:8})+label(text,x,y,{size:22,color}));
const vE=cs(EC,'\\mathbf{E}');

// ---- point charge: radial field arrows (longer near the charge) --------------------------------
function radial(cx,cy,{g=1,n=8,rings=[[62,62],[150,40],[235,26]],rot=Math.PI/8,maxR=1e9}={}){
 let s='';
 for(const [r,L] of rings){if(r+L>maxR)continue;for(let i=0;i<n;i++){const a=rot+2*Math.PI*i/n,c=Math.cos(a),si=Math.sin(a);s+=arrow(cx+r*c,cy-r*si,cx+(r+L)*c,cy-(r+L)*si,{color:EC,w:L>50?5:L>30?4:3,head:L>50?16:12});}}
 return fade(g,s+charge(cx,cy,1,22));
}
// contour rings of V = k/r : V=1..4 at r=R1/V
function contours(cx,cy,{g=1,R1=200,labels=false,dash='',op=1,maxV=4}={}){
 let s='';for(let v=1;v<=maxV;v++){const r=R1/v;s+=ring(cx,cy,r,{color:VC,w:2.5,dash});if(labels){const a=[0,20,-30,200,115][v]*Math.PI/180,c=Math.cos(a),sn=Math.sin(a);s+=label(`${v} V`,cx+(r+8)*c,cy-(r+8)*sn+(sn<0?20:0),{size:22,color:VC,weight:700,anchor:c>0.2?'start':c<-0.2?'end':'middle'});}}
 return fade(g*op,s);
}

// ---- gravity recap (ui-potential-1): floor, 3 m ruler, box --------------------------------------
const GF=440,GS=95;const gy=h=>GF-GS*h;
function gravBase({g=1,boxH=3,bx=330}={}){
 let s=ground(120,560,GF);
 s+=line(170,gy(0),170,gy(3)-12,{color:C.x,w:3});
 for(let i=0;i<=3;i++)s+=line(162,gy(i),178,gy(i),{color:C.x,w:3})+label(`${i} m`,154,gy(i)+8,{size:22,color:C.x,anchor:'end'});
 s+=rect(bx-45,gy(boxH)-66,90,66,{fill:'#7a5a3c',fo:.55,stroke:'#c9a27a',sw:3,rx:6})+label('2 kg',bx,gy(boxH)-24,{size:22,color:C.ink,anchor:'middle'});
 s+=arrow(bx+70,gy(boxH)-60,bx+70,gy(boxH)+10,{color:FC,w:5,head:14})+label('重力',bx+82,gy(boxH)-14,{size:22,color:FC});
 return fade(g,s);
}

// ---- uniform field, definition scene: O at x=1000, 150 px per metre, axis at y=200 ---------------
const OX=1000,MS=150,AY=200;const mx=m=>OX+MS*m;
function uniformRows({g=1,ys=[92,300],x0=110,x1=1170,len=62,gap=150,op=1}={}){
 let s='';for(const y of ys)for(let x=x0;x+len<=x1;x+=gap)s+=arrow(x,y,x+len,y,{color:EC,w:4,head:14});
 return fade(g*op,s);
}
function defBase({g=1,ticks=1,marks=1,O=1,P=1,Etag=1}={}){
 let s=uniformRows({g});
 s+=fade(g*ticks,line(mx(-5.6),AY,mx(1.1),AY,{color:C.faint,w:2})+Array.from({length:7},(_,i)=>line(mx(-i),AY-8,mx(-i),AY+8,{color:C.faint,w:2})).join(''));
 if(O)s+=fade(g,dot(mx(0),AY,9,C.ink)+label('O（基準）',mx(0),AY+44,{size:24,color:C.ink,anchor:'middle',weight:700}));
 if(P)s+=fade(g*P,dot(mx(-5),AY,9,C.ink)+label('P',mx(-5),AY+44,{size:26,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(g*Etag,T(vE+'\\;1\\,\\mathrm{N/C}',150,52,{size:30,anchor:'start'}));
 return s;
}
const qdot=(x,y,sign=1,text='',g=1)=>fade(g,charge(x,y,sign,17)+(text?label(text,x,y-30,{size:24,color:sign>0?NG:BLUE,anchor:'middle',weight:700}):''));

// ---- potential ruler (vertical): level k at y = RY0 - RS*k -------------------------------------
const RY0=440,RS=62;const ry=k=>RY0-RS*k;
function vRuler(x,{off=0,g=1,title='',color=VC,kmax=5,kmin=0}={}){
 let s=line(x,ry(kmin)+14,x,ry(kmax)-14,{color,w:3});
 for(let k=kmin;k<=kmax;k++)s+=line(x-8,ry(k),x+8,ry(k),{color,w:3})+label(`${String(k+off).replace('-','−')} V`,x-16,ry(k)+8,{size:22,color,anchor:'end'});
 if(title)s+=label(title,x,ry(kmax)-28,{size:22,color:C.dim,anchor:'middle'});
 return fade(g,s);
}
function ABlines({g=1,x0=240,x1=1150,gap=null}={}){
 const seg2=(a,b)=>line(a,ry(1),b,ry(1),{color:C.faint,w:2,dash:'8 6'})+line(a,ry(4),b,ry(4),{color:C.faint,w:2,dash:'8 6'});
 return fade(g,gap?seg2(x0,gap-70)+seg2(gap+4,x1):seg2(x0,x1));
}
const ptAB=(x,g=1)=>fade(g,dot(x,ry(1),10,C.ink)+label('A',x+18,ry(1)+10,{size:28,color:C.ink,weight:700})+dot(x,ry(4),10,C.ink)+label('B',x+18,ry(4)+10,{size:28,color:C.ink,weight:700}));
const diffBar=(x,g=1,color=HI)=>fade(g,rect(x-11,ry(4),22,RS*3,{fill:color,fo:.35,stroke:color,sw:2,rx:4}));

// ---- sign scene: A at x=250 (5 V), B at x=850 (2 V), axis y=210 --------------------------------
const SA=250,SB=850,SY=210;
function signBase({g=1,Eop=1}={}){
 let s=uniformRows({g,ys:[95,325],op:Eop});
 s+=fade(g,line(SA,70,SA,350,{color:VC,w:2,dash:'6 6'})+line(SB,70,SB,350,{color:VC,w:2,dash:'6 6'}));
 s+=fade(g,line(SA-60,SY,SB+60,SY,{color:C.faint,w:2})+dot(SA,SY,8,C.ink)+dot(SB,SY,8,C.ink));
 s+=fade(g,label('A',SA-16,SY+40,{size:28,color:C.ink,anchor:'end',weight:700})+label('B',SB+16,SY+40,{size:28,color:C.ink,weight:700}));
 s+=fade(g,label('5 V',SA+10,62,{size:28,color:VC,weight:700})+label('2 V',SB+10,62,{size:28,color:VC,weight:700}));
 return s;
}

// ---- slope graphs --------------------------------------------------------------------------------
function vGraph(x0,d,{g=1,line1=1,tri=0,w=380,h=240,y0=330,title=''}={}){
 const X=u=>x0+w*u/3.3,Y=v=>y0-h*v/4;
 let s=arrow(x0-8,y0,x0+w+18,y0,{color:C.dim,w:2.5,head:12,g})+arrow(x0,y0+8,x0,y0-h-18,{color:C.dim,w:2.5,head:12,g});
 s+=fade(g,[1,2,3].map(u=>line(X(u),y0-6,X(u),y0+6,{color:C.dim})+label(String(u),X(u),y0+30,{size:21,color:C.dim,anchor:'middle'})).join('')+[1,2,3].map(v=>line(x0-6,Y(v),x0+6,Y(v),{color:C.dim})+label(String(v),x0-12,Y(v)+8,{size:21,color:C.dim,anchor:'end'})).join(''));
 s+=fade(g,label('x [m]',x0+w+24,y0+8,{size:22,color:C.dim})+label('V [V]',x0,y0-h-26,{size:22,color:VC,anchor:'middle'}));
 if(title)s+=fade(g,label(title,x0+w/2+20,y0-h-20,{size:26,color:C.ink,anchor:'middle',weight:700}));
 s+=draw([[X(0),Y(3)],[X(d),Y(0)],[X(3.2),Y(0)]],line1,{color:VC,w:5});
 s+=fade(tri,line(X(0),Y(3),X(0),Y(0),{color:HI,w:6})+label('3 V',X(0)+12,Y(1.5)+8,{size:24,color:HI,weight:700})+line(X(0),Y(0)+3,X(d),Y(0)+3,{color:C.ink,w:6})+label(`${d} m`,X(d/2),Y(0)-12,{size:24,color:C.ink,anchor:'middle',weight:700}));
 return s;
}

export const ytUiElectricPotential1Diagrams={
 // ============ S1 前回の問い ============
 [K+'question']:(p)=>{
  let s=radial(270,250,{g:seg(p,0,.2),maxR:215})+fade(seg(p,.05,.2),label('電場の 矢印の 地図',270,500,{size:24,color:EC,anchor:'middle'}));
  s+=fade(seg(p,.3,.45),arrow(540,250,650,250,{color:C.dim,w:5,head:18})+label('？',595,215,{size:40,color:HI,anchor:'middle',weight:700}));
  s+=contours(920,250,{g:seg(p,.4,.6),R1:190})+fade(seg(p,.45,.6),label('高さの 地図 ？',920,500,{size:24,color:VC,anchor:'middle'}));
  s+=fade(seg(p,.7,.85),label('電位 とは？',920,40,{size:30,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'grav1']:(p)=>{
  let s=gravBase({g:seg(p,0,.15)});
  s+=fade(seg(p,.1,.25),label('位置エネルギーの回',160,50,{size:22,color:C.dim}));
  s+=card(640,70,500,300,
   tag('定義',665,112,HI)
   +T(cs(VC,'\\Delta U')+'=-'+cs(VC,'W_{g}'),890,195,{size:54})
   +T(cs(VC,'W_g'),770,262,{size:30})+label('： 重力が した 仕事',795,272,{size:24,color:VC})
   +fade(seg(p,.6,.8),T(cs(VC,'W_g')+'=-60\\,\\mathrm{J}\\;\\Rightarrow\\;'+cs(VC,'\\Delta U')+'=+60\\,\\mathrm{J}',890,335,{size:30})),seg(p,.3,.45),HI);
  return s;
 },
 [K+'grav2']:(p)=>{
  // A (floor) to B (3 m up, to the right): two paths, same work
  const A=[235,GF-6],B=[500,gy(3)];
  let s=ground(120,560,GF)+line(170,gy(0),170,gy(3)-12,{color:C.x,w:3});
  for(let i=0;i<=3;i++)s+=line(162,gy(i),178,gy(i),{color:C.x,w:3})+label(`${i} m`,154,gy(i)+8,{size:22,color:C.x,anchor:'end'});
  s+=fade(seg(p,0,.1),dot(...A,9,C.ink)+label('A',A[0]+16,A[1]-10,{size:26,color:C.ink,weight:700})+dot(...B,9,C.ink)+label('B',B[0]+16,B[1]+8,{size:26,color:C.ink,weight:700}));
  s+=draw([A,B],seg(p,.05,.3),{color:HI,w:4});
  s+=draw([A,[240,gy(3.9)],[430,gy(3.9)],B],seg(p,.2,.45),{color:C.p,w:4});
  s+=fade(seg(p,.35,.5),label('どちらの 道も',610,120,{size:26,color:C.ink})+T(cs(VC,'W_g')+'=-60\\,\\mathrm{J}',800,185,{size:38}));
  s+=card(600,250,560,170,label('基準を 一つ 決めれば',880,300,{size:26,color:C.ink,anchor:'middle'})+label('場所ごとに U が 一つ',880,350,{size:30,color:VC,anchor:'middle',weight:700})+label('＝「位置の 貯金」',880,398,{size:26,color:VC,anchor:'middle'}),seg(p,.6,.75),VC);
  return s;
 },
 [K+'static']:(p)=>{
  const cx=300,cy=270;
  let s=radial(cx,cy,{g:seg(p,0,.15),maxR:260});
  const A=[cx+95,cy+150],B=[cx+215,cy-95];
  s+=fade(seg(p,.15,.3),dot(...A,9,C.ink)+label('A',A[0]-14,A[1]+30,{size:26,color:C.ink,weight:700,anchor:'end'})+dot(...B,9,C.ink)+label('B',B[0]+16,B[1]-8,{size:26,color:C.ink,weight:700}));
  s+=draw([A,[A[0]+80,A[1]-30],[B[0]+30,B[1]+70],B],seg(p,.2,.4),{color:HI,w:4});
  s+=draw([A,[A[0]-150,A[1]-40],[cx-140,cy-160],[cx+60,cy-200],B],seg(p,.25,.5),{color:C.p,w:4});
  s+=card(640,70,520,330,
   label('静電場（電荷が 止まっている）',900,125,{size:26,color:C.ink,anchor:'middle'})
   +label('電場の 仕事は 道に よらない',900,195,{size:30,color:HI,anchor:'middle',weight:700})
   +T('W_{\\mathrm{A\\to B}}',820,265,{size:36,color:VC})+label('道1 ＝ 道2',960,275,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.6,.75),tag('法則から 分かっている事実',680,352,C.F)+label('確かめは 中級',1120,352,{size:22,color:C.dim,anchor:'end'})),seg(p,.3,.45),HI);
  return s;
 },
 // ============ S2 電位の定義 ============
 [K+'field']:(p)=>{
  let s=defBase({g:seg(p,0,.15),P:seg(p,.12,.25)});
  s+=fade(seg(p,.12,.25),brace(mx(-5),mx(0),AY-22,{dir:-1,text:'5 m',color:C.ink,size:26}));
  const u=seg(p,.4,.85),x=mix(mx(0),mx(-5),u);
  s+=qdot(x,AY,1,'',seg(p,.35,.45));
  s+=fade(seg(p,.4,.5),arrow(x+24,AY+68,x+84,AY+68,{color:FC,w:5,head:14})+label('力',x+92,AY+76,{size:22,color:FC}));
  s+=fade(seg(p,.4,.5),arrow(x-24,AY+68,x-90,AY+68,{color:C.ink,w:3,head:12})+label('動き',x-98,AY+76,{size:22,color:C.ink,anchor:'end'}));
  s+=card(330,370,540,110,label('W ： O から P へ 運ぶ間に',600,414,{size:26,color:VC,anchor:'middle'})+label('電場が する 仕事',600,458,{size:26,color:VC,anchor:'middle'}),seg(p,.6,.75),VC);
  return s;
 },
 [K+'defU']:(p)=>{
  let s=defBase()+brace(mx(-5),mx(0),AY-22,{dir:-1,text:'5 m',color:C.ink,size:26})+qdot(mx(-5),AY,1);
  s+=card(250,350,700,150,
   tag('定義',275,392,HI)
   +T(cs(VC,'U_{\\mathrm{P}}')+'=-'+cs(VC,'W'),600,405,{size:50})
   +label('位置エネルギーの回と 同じ 決め方',600,475,{size:24,color:C.dim,anchor:'middle'}),seg(p,.15,.3),HI);
  return s;
 },
 [K+'double']:(p)=>{
  let s=defBase()+brace(mx(-5),mx(0),AY-22,{dir:-1,text:'5 m',color:C.ink,size:26})+qdot(mx(-5),AY,1);
  const col=(x,q,W,U,g)=>card(x,340,440,165,
   label(`${q} を 運ぶ`,x+220,380,{size:26,color:NG,anchor:'middle',weight:700})
   +T(cs(VC,'W')+`=${W}\\,\\mathrm{J}`,x+220,430,{size:34})
   +T(cs(VC,'U')+`=+${U}\\,\\mathrm{J}`,x+220,482,{size:34}),g);
  s+=col(120,'1 C','-5','5',seg(p,.05,.2))+col(640,'2 C','-10','10',seg(p,.5,.65));
  s+=fade(seg(p,.2,.35),label('電場に 逆らう → W は 負',600,AY+74,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'defV']:(p)=>{
  let s=defBase()+brace(mx(-5),mx(0),AY-22,{dir:-1,text:'5 m',color:C.ink,size:26})+qdot(mx(-5),AY,1);
  s+=card(120,300,960,205,
   tag('定義',145,342,HI)
   +T(cs(VC,'V')+'=\\dfrac{'+cs(VC,'U')+'}{q}',360,410,{size:52})
   +label('電位 ： 1 C あたりの 位置エネルギー',360,480,{size:24,color:VC,anchor:'middle'})
   +fade(seg(p,.45,.6),T('\\dfrac{5\\,\\mathrm{J}}{1\\,\\mathrm{C}}=\\dfrac{10\\,\\mathrm{J}}{2\\,\\mathrm{C}}='+cs(VC,'5\\,\\mathrm{J/C}'),830,410,{size:40}))
   +fade(seg(p,.7,.85),label('場所だけで 決まる',830,480,{size:26,color:HI,anchor:'middle',weight:700})),seg(p,.05,.2),HI);
  return s;
 },
 [K+'unit']:(p)=>{
  let s=defBase()+qdot(mx(-5),AY,1);
  s+=card(120,300,960,205,
   label('電場',240,355,{size:26,color:EC,anchor:'middle',weight:700})+label('1 C あたりの 力',480,355,{size:26,color:C.ink,anchor:'middle'})+label('N/C',720,355,{size:28,color:EC,anchor:'middle',weight:700})
   +fade(seg(p,.1,.25),label('電位',240,420,{size:26,color:VC,anchor:'middle',weight:700})+label('1 C あたりの エネルギー',480,420,{size:26,color:C.ink,anchor:'middle'})+label('J/C ＝ V',720,420,{size:28,color:VC,anchor:'middle',weight:700}))
   +fade(seg(p,.45,.6),label('ボルト',720,470,{size:22,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.65,.8),label('P ： 5 V',960,390,{size:34,color:VC,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'qV']:(p)=>{
  let s=defBase()+qdot(mx(-5),AY,1,'2 C',seg(p,.4,.55));
  s+=fade(seg(p,.4,.55),label('5 V',mx(-5)+50,AY-26,{size:28,color:VC,weight:700}));
  s+=card(170,320,860,180,
   T(cs(VC,'U')+'=q'+cs(VC,'V'),600,380,{size:50})
   +fade(seg(p,.5,.7),T('=2\\,\\mathrm{C}\\times'+cs(VC,'5\\,\\mathrm{V}')+'='+cs(VC,'10\\,\\mathrm{J}'),600,455,{size:40}))
   +fade(seg(p,.75,.9),label('C × J/C ＝ J',1010,490,{size:22,color:C.dim,anchor:'end'})),seg(p,0,.15));
  return s;
 },
 [K+'map']:(p)=>{
  let s=defBase({P:1});
  for(let i=0;i<=5;i++){const x=mx(-i),g=seg(p,.1+i*.08,.2+i*.08);
   s+=fade(g,line(x,70,x,AY-52,{color:VC,w:2,dash:'6 7'})+line(x,AY-12,x,340,{color:VC,w:2,dash:'6 7'})+label(`${i} V`,x,AY-24,{size:28,color:VC,anchor:'middle',weight:700}));}
  s+=fade(seg(p,.6,.75),brace(mx(-2),mx(-1),AY+70,{dir:1,text:'1 m で 1 V',color:HI,size:24}));
  s+=fade(seg(p,.7,.85),arrow(mx(-.3),440,mx(-4.7),440,{color:VC,w:4,head:16})+label('左へ 行くほど 高い',mx(-2.5),490,{size:26,color:VC,anchor:'middle'}));
  return s;
 },
 [K+'shiftmap']:(p)=>{
  let s=defBase({P:1,O:0});
  const u=seg(p,.4,.6);
  s+=fade(1,dot(mx(0),AY,9,C.ink)+label('O',mx(0),AY+44,{size:26,color:C.ink,anchor:'middle',weight:700}));
  for(let i=-1;i<=5;i++){const x=mx(-i);
   s+=line(x,70,x,AY-52,{color:VC,w:2,dash:'6 7',opacity:i<0?u:1})+line(x,AY-12,x,340,{color:VC,w:2,dash:'6 7',opacity:i<0?u:1});
   if(i>=0)s+=fade(1-u,label(`${i} V`,x,AY-24,{size:28,color:VC,anchor:'middle',weight:700}));
   s+=fade(u,label(`${i+1} V`,x,AY-24,{size:28,color:VC,anchor:'middle',weight:700}));}
  s+=fade(seg(p,.15,.35),dot(mx(1),AY,9,HI)+label('新しい 基準',1190,AY+44,{size:22,color:HI,anchor:'end'}));
  s+=fade(seg(p,.65,.8),label('どこも ＋1 V ・ 1 m で 1 V は 同じ',600,440,{size:28,color:HI,anchor:'middle',weight:700}));
  s+=fade(seg(p,0,.2),tag('0 の 基準 ＝ 約束',130,490,C.dim));
  return s;
 },
 // ============ S3 電位と電位差 ============
 [K+'scale']:(p)=>{
  let s=vRuler(300,{g:seg(p,0,.2),title:'電位'})+ABlines({g:seg(p,.2,.35),x0:300,x1:620});
  s+=ptAB(360,seg(p,.25,.45));
  s+=fade(seg(p,.3,.45),label('1 V',430,ry(1)+10,{size:28,color:VC,weight:700}));
  s+=fade(seg(p,.6,.75),label('4 V',430,ry(4)+10,{size:28,color:VC,weight:700}));
  return s;
 },
 [K+'diffAB']:(p)=>{
  let s=vRuler(300,{title:'電位'})+ABlines({x0:300,x1:620})+ptAB(360)+label('1 V',430,ry(1)+10,{size:28,color:VC,weight:700})+label('4 V',430,ry(4)+10,{size:28,color:VC,weight:700});
  s+=diffBar(520,seg(p,.1,.25));
  s+=arrow(560,ry(1),560,ry(4),{color:HI,w:5,head:16,g:seg(p,.1,.3)});
  s+=fade(seg(p,.2,.4),label('A → B',580,ry(2.5)+8,{size:24,color:HI}));
  s+=card(700,110,450,230,
   T('V_{\\mathrm B}-V_{\\mathrm A}',925,170,{size:40,color:VC})
   +label('終点 − 始点',925,225,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.3,.45),T('=4-1='+cs(HI,'3\\,\\mathrm{V}'),925,290,{size:42})),seg(p,.15,.3));
  s+=fade(seg(p,.65,.8),label('1 C あたり 3 J 高い',925,400,{size:28,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'diffBA']:(p)=>{
  let s=vRuler(300,{title:'電位'})+ABlines({x0:300,x1:620})+ptAB(360)+label('1 V',430,ry(1)+10,{size:28,color:VC,weight:700})+label('4 V',430,ry(4)+10,{size:28,color:VC,weight:700});
  s+=fade(.35,arrow(560,ry(1),560,ry(4),{color:HI,w:5,head:16}));
  s+=arrow(600,ry(4),600,ry(1),{color:NG,w:5,head:16,g:seg(p,.05,.25)});
  s+=fade(seg(p,.15,.3),label('B → A',616,ry(2.5)+8,{size:24,color:NG}));
  s+=card(700,110,450,230,
   T('V_{\\mathrm A}-V_{\\mathrm B}',925,170,{size:40,color:VC})
   +label('終点 − 始点',925,225,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.2,.35),T('=1-4='+cs(NG,'-3\\,\\mathrm{V}'),925,290,{size:42})),seg(p,.05,.2));
  s+=fade(seg(p,.6,.75),label('引く 順番で 符号が 変わる',925,400,{size:28,color:NG,anchor:'middle',weight:700}));
  return s;
 },
 [K+'shift']:(p)=>{
  let s=vRuler(200,{title:'電位'})+ABlines({x0:200,x1:1000,gap:740})+ptAB(250);
  s+=diffBar(330)+fade(1,T('4-1='+cs(HI,'3\\,\\mathrm{V}'),460,ry(2.5)+10,{size:34}));
  s+=vRuler(740,{off:10,g:seg(p,.05,.25),title:'＋10 V した 目盛り'});
  s+=ptAB(790,seg(p,.2,.35));
  s+=fade(seg(p,.3,.45),label('11 V',860,ry(1)+10,{size:26,color:VC,weight:700})+label('14 V',860,ry(4)+10,{size:26,color:VC,weight:700}));
  s+=diffBar(950,seg(p,.6,.72))+fade(seg(p,.62,.75),T('14-11='+cs(HI,'3\\,\\mathrm{V}'),1060,ry(2.5)+10,{size:30}));
  return s;
 },
 [K+'shift2']:(p)=>{
  let s=vRuler(200,{title:'電位'})+ABlines({x0:200,x1:1000,gap:740})+ptAB(250);
  s+=diffBar(330)+T('4-1='+cs(HI,'3\\,\\mathrm{V}'),460,ry(2.5)+10,{size:34});
  s+=vRuler(740,{off:10,title:'＋10 V した 目盛り'})+ptAB(790)+label('11 V',860,ry(1)+10,{size:26,color:VC,weight:700})+label('14 V',860,ry(4)+10,{size:26,color:VC,weight:700});
  s+=diffBar(950)+T('14-11='+cs(HI,'3\\,\\mathrm{V}'),1060,ry(2.5)+10,{size:30});
  s+=fade(seg(p,.05,.2),label('位置エネルギーの回 ： 床が 0 ／ 机が 0',600,480,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),rect(330,20,540,48,{fill:'#131f38',fo:.96,stroke:HI,sw:2,rx:10})+label('値は 変わる ・ 差は 同じ 3 V',600,54,{size:28,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'volt']:(p)=>{
  const bx=330,by=250,bw=440,bh=120;
  let s=fade(seg(p,0,.2),rect(bx,by-bh/2,bw,bh,{fill:'#3a4a66',fo:.6,stroke:C.dim,sw:3,rx:16})+rect(bx+bw,by-22,26,44,{fill:C.dim,fo:.8,stroke:C.dim,rx:4})
   +label('＋極',bx+bw+14,by-bh/2-24,{size:26,color:NG,anchor:'middle',weight:700})+label('−極',bx,by-bh/2-24,{size:26,color:BLUE,anchor:'middle',weight:700})+label('乾電池',bx+bw/2,by+10,{size:28,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.2,.4),brace(bx,bx+bw+26,by+bh/2+14,{dir:1,text:'電位差（電圧） 1.5 V',color:HI,size:28}));
  s+=fade(seg(p,.45,.6),label('＋極は −極 より 1.5 V 高い',bx+bw/2+13,470,{size:26,color:C.ink,anchor:'middle'}));
  s+=card(880,110,290,240,label('電位',1025,165,{size:28,color:VC,anchor:'middle',weight:700})+label('場所ごとの 値',1025,205,{size:24,color:C.ink,anchor:'middle'})+line(910,235,1140,235,{color:C.faint})+label('電圧',1025,280,{size:28,color:HI,anchor:'middle',weight:700})+label('2点の 差',1025,320,{size:24,color:C.ink,anchor:'middle'}),seg(p,.05,.2));
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=vRuler(300,{title:'はじめの 目盛り'})+ABlines({x0:300,x1:780,gap:700})+ptAB(360)+label('1 V',430,ry(1)+10,{size:28,color:VC,weight:700})+label('4 V',430,ry(4)+10,{size:28,color:VC,weight:700});
  s+=vRuler(700,{off:-4,kmin:0,g:seg(p,.1,.3),title:'B を 0 に した 目盛り',color:HI});
  s+=fade(seg(p,.3,.45),label('B ＝ 0 V',790,ry(4)+10,{size:28,color:HI,weight:700})+label('A ＝ ？',790,ry(1)+10,{size:28,color:HI,weight:700}));
  s+=card(930,160,240,140,label('確かめ',1050,210,{size:26,color:HI,anchor:'middle',weight:700})+label('A の 電位は？',1050,260,{size:26,color:C.ink,anchor:'middle'}),seg(p,.4,.55),HI);
  return s;
 },
 [K+'quizans']:(p)=>{
  let s=vRuler(300,{title:'はじめの 目盛り'})+ABlines({x0:300,x1:780,gap:700})+ptAB(360)+label('1 V',430,ry(1)+10,{size:28,color:VC,weight:700})+label('4 V',430,ry(4)+10,{size:28,color:VC,weight:700});
  s+=vRuler(700,{off:-4,title:'B を 0 に した 目盛り',color:HI});
  s+=label('B ＝ 0 V',790,ry(4)+10,{size:28,color:HI,weight:700});
  s+=fade(seg(p,.05,.2),label('A ＝ −3 V',790,ry(1)+10,{size:28,color:NG,weight:700}));
  s+=fade(seg(p,.1,.25),T('1-4=-3',1060,ry(1)+60,{size:30}));
  s+=diffBar(760,seg(p,.5,.6));
  s+=card(900,215,280,130,T('0-(-3)',1040,262,{size:34})+T('='+cs(HI,'3\\,\\mathrm{V}'),1040,322,{size:38}),seg(p,.5,.65),HI);
  return s;
 },
 // ============ S4 仕事と位置エネルギーの符号 ============
 [K+'move']:(p)=>{
  let s=signBase({g:seg(p,0,.2)});
  const u=seg(p,.45,.85),x=mix(SA,SB,u);
  s+=qdot(x,SY,1,'2 C',seg(p,.25,.4));
  s+=fade(seg(p,.1,.25),T(vE,1110,62,{size:34}));
  s+=fade(seg(p,.45,.55),arrow(SA+40,SY+60,SB-40,SY+60,{color:C.ink,w:3,head:12})+label('動き',(SA+SB)/2,SY+92,{size:22,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'UAB']:(p)=>{
  let s=signBase()+T(vE,1110,62,{size:34})+qdot(SB,SY,1,'2 C')+fade(.35,qdot(SA,SY,1,'2 C'));
  s+=card(SA-190,370,380,120,T(cs(VC,'U_{\\mathrm A}')+'=2\\times5',SA,418,{size:34})+T('='+cs(VC,'10\\,\\mathrm{J}'),SA,468,{size:34}),seg(p,.05,.2));
  s+=card(SB-190,370,380,120,T(cs(VC,'U_{\\mathrm B}')+'=2\\times2',SB,418,{size:34})+T('='+cs(VC,'4\\,\\mathrm{J}'),SB,468,{size:34}),seg(p,.5,.65));
  return s;
 },
 [K+'dU']:(p)=>{
  let s=signBase({Eop:.5})+qdot(SB,SY,1,'2 C');
  s+=card(120,268,960,237,
   T(cs(VC,'\\Delta U')+'=4-10='+cs(NG,'-6\\,\\mathrm{J}'),600,318,{size:40})
   +fade(seg(p,.35,.5),T(cs(VC,'\\Delta U')+'=q\\,('+cs(VC,'V_{\\mathrm B}')+'-'+cs(VC,'V_{\\mathrm A}')+')',600,390,{size:40})+label('終点 − 始点',930,400,{size:22,color:C.dim}))
   +fade(seg(p,.7,.85),T('=2\\times(2-5)='+cs(NG,'-6\\,\\mathrm{J}'),600,462,{size:40})),seg(p,0,.12));
  return s;
 },
 [K+'W']:(p)=>{
  let s=signBase({Eop:.5})+qdot(SB,SY,1,'2 C');
  s+=card(120,268,960,237,
   T(cs(VC,'\\Delta U')+'='+cs(NG,'-6\\,\\mathrm{J}'),600,318,{size:40})
   +fade(seg(p,.1,.3),T(cs(VC,'W')+'=-'+cs(VC,'\\Delta U'),600,390,{size:40})+label('（U の 決め方）',820,400,{size:22,color:C.dim}))
   +fade(seg(p,.55,.7),T(cs(VC,'W')+'=+6\\,\\mathrm{J}',600,462,{size:44})+highlight(510,428,180,62,1,HI)),seg(p,0,.08));
  return s;
 },
 [K+'K']:(p)=>{
  let s=signBase({Eop:.5});
  const u=seg(p,.15,.6),x=mix(SA,SB,u);
  s+=qdot(x,SY,1,'2 C')+arrow(x+22,SY-50,x+90,SY-50,{color:FC,w:5,head:14,g:seg(p,.05,.15)});
  // energy bars: U from 10 to 4, K from 0 to 6 (20 px per J)
  const bx=170,by=490,Uv=mix(10,4,u),Kv=mix(0,6,u);
  s+=fade(seg(p,0,.12),rect(bx,by-14*Uv,70,14*Uv,{fill:VC,fo:.5,stroke:VC})+label(`U ${Uv.toFixed(0)} J`,bx-14,by-14*Uv/2+8,{size:24,color:VC,anchor:'end',weight:700}));
  s+=fade(seg(p,0,.12),rect(bx+220,by-14*Kv,70,14*Kv,{fill:KC,fo:.5,stroke:KC})+label(`K ${Kv.toFixed(0)} J`,bx+304,by-14*Kv/2+8,{size:24,color:KC,weight:700}));
  s+=fade(seg(p,0,.12),line(bx-20,by,bx+320,by,{color:C.dim,w:2}));
  s+=fade(seg(p,.65,.8),label('減った 6 J → 運動エネルギー',830,440,{size:26,color:KC,anchor:'middle',weight:700})+label('（電気の 力だけが はたらくとき）',830,480,{size:22,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'dir']:(p)=>{
  let s=signBase()+qdot(SB,SY,1,'2 C');
  s+=fade(seg(p,.05,.2),arrow(SB+24,SY,SB+90,SY,{color:FC,w:5,head:14})+label('力',SB+70,SY-16,{size:22,color:FC,anchor:'end'}));
  s+=fade(seg(p,.1,.25),label('電位の 低い 方へ',SB,SY+100,{size:26,color:C.ink,anchor:'middle'}));
  s+=card(250,380,700,110,label('𝐄 は 電位の 高い 所 → 低い 所',600,428,{size:30,color:EC,anchor:'middle',weight:700})+label('5 V → 2 V',600,470,{size:24,color:VC,anchor:'middle'}),seg(p,.5,.65),EC);
  return s;
 },
 [K+'neg']:(p)=>{
  let s=signBase();
  s+=qdot(SA,SY,-1,'−2 C',seg(p,.05,.2));
  s+=fade(seg(p,.2,.35),arrow(SA+40,SY+60,SB-40,SY+60,{color:C.ink,w:3,head:12,opacity:.8})+label('A から B へ 動かすと？',(SA+SB)/2,SY+92,{size:24,color:C.ink,anchor:'middle'}));
  s+=card(330,390,540,100,label('ΔU と W の 符号は？',600,450,{size:30,color:HI,anchor:'middle',weight:700}),seg(p,.35,.5),HI);
  return s;
 },
 [K+'negans']:(p)=>{
  let s=signBase({Eop:.5})+qdot(SA,SY,-1,'−2 C');
  s+=fade(seg(p,.55,.7),arrow(SA-22,SY,SA-90,SY,{color:FC,w:5,head:14})+label('力',SA-60,SY-14,{size:22,color:FC,anchor:'middle'}));
  s+=card(120,265,960,240,
   T(cs(VC,'\\Delta U')+'=(-2)\\times(2-5)='+cs(VC,'+6\\,\\mathrm{J}'),600,325,{size:40})
   +fade(seg(p,.4,.55),T(cs(VC,'W')+'=-'+cs(VC,'\\Delta U')+'='+cs(NG,'-6\\,\\mathrm{J}'),600,405,{size:40}))
   +fade(seg(p,.7,.85),label('電場は 動きを 押し戻す',600,475,{size:28,color:NG,anchor:'middle',weight:700})),seg(p,.02,.15));
  return s;
 },
 // ============ S5 電位の坂と電場 ============
 [K+'recall']:(p)=>{
  const x0=260,x1=710,y=230;
  let s=fade(seg(p,0,.15),line(x0,y,x1,y,{color:C.ink,w:5})+brace(x0,x1,y+30,{dir:1,text:'1 m',color:C.ink,size:26}));
  s+=fade(seg(p,.1,.25),arrow(x0+40,y-80,x0+300,y-80,{color:EC,w:6,head:18})+T(vE+'\\;3\\,\\mathrm{N/C}',x0+400,y-80,{size:30}));
  s+=qdot(mix(x0,x1,seg(p,.3,.7)),y,1,'+1 C',seg(p,.2,.3));
  s+=card(780,110,380,210,label('線積分の回',970,155,{size:24,color:C.dim,anchor:'middle'})+T('W=1\\times3\\times1',970,215,{size:34,color:VC})+T('='+cs(VC,'3\\,\\mathrm{J}'),970,280,{size:40}),seg(p,.5,.65));
  return s;
 },
 [K+'qEd']:(p)=>{
  const x0=260,x1=710,y=230;
  let s=line(x0,y,x1,y,{color:C.ink,w:5})+brace(x0,x1,y+30,{dir:1,text:'1 m',color:C.ink,size:26});
  s+=arrow(x0+40,y-80,x0+300,y-80,{color:EC,w:6,head:18})+T(vE+'\\;3\\,\\mathrm{N/C}',x0+400,y-80,{size:30})+qdot(x1,y,1);
  s+=fade(seg(p,.05,.2),label('3 V',x0,y-24,{size:28,color:VC,anchor:'middle',weight:700})+label('0 V',x1,y-24,{size:28,color:VC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.3),label('1 C あたり 3 J → 電位は 3 V 下がる',485,370,{size:28,color:HI,anchor:'middle',weight:700}));
  s+=fade(seg(p,.02,.15),tag('0 V は この図での 例',x0-120,470,C.dim));
  s+=card(780,110,380,280,label('一般に（一様な 電場）',970,160,{size:24,color:C.dim,anchor:'middle'})+T('W=q'+cs(EC,'E')+'d',970,240,{size:50,color:VC})+label('力 qE × 距離 d',970,320,{size:24,color:C.ink,anchor:'middle'}),seg(p,.5,.65));
  return s;
 },
 [K+'Ed']:(p)=>{
  let s=card(90,70,1020,390,'',1);
  s+=T('W=q'+cs(EC,'E')+'d',600,140,{size:48,color:VC});
  s+=fade(seg(p,.05,.25),label('q で 割る ＝ 1 C あたりに 直す',270,290,{size:24,color:HI,anchor:'middle'}));
  s+=fade(seg(p,.15,.35),T('\\dfrac{W}{q}='+cs(EC,'E')+'d',600,280,{size:48,color:VC}));
  s+=fade(seg(p,.3,.45),label('＝ 電位の 下がり幅',850,292,{size:28,color:VC,weight:700}));
  s+=fade(seg(p,.6,.8),label('電場の 強さ E ＝ 下がり幅 ÷ 距離 d',600,400,{size:36,color:EC,anchor:'middle',weight:700})+highlight(250,360,700,62,1,EC));
  return s;
 },
 [K+'slope']:(p)=>{
  let s=vGraph(110,1,{g:seg(p,0,.15),line1:seg(p,.1,.35),tri:seg(p,.3,.45),title:'1 m で 3 V 下がる'});
  s+=vGraph(680,3,{g:seg(p,.3,.45),line1:seg(p,.4,.6),tri:seg(p,.55,.7),title:'3 m で 3 V 下がる'});
  s+=fade(seg(p,.75,.9),label('急な 坂',300,430,{size:30,color:HI,anchor:'middle',weight:700})+label('ゆるい 坂',870,430,{size:30,color:C.dim,anchor:'middle',weight:700}));
  return s;
 },
 [K+'slopeE']:(p)=>{
  let s=vGraph(110,1,{tri:1,title:'1 m で 3 V 下がる'})+vGraph(680,3,{tri:1,title:'3 m で 3 V 下がる'});
  s+=fade(seg(p,.05,.2),T(cs(EC,'E')+'=\\dfrac{3\\,\\mathrm{V}}{1\\,\\mathrm{m}}='+cs(EC,'3\\,\\mathrm{V/m}'),300,420,{size:34}));
  s+=fade(seg(p,.05,.2),arrow(160,490,400,490,{color:EC,w:7,head:20}));
  s+=fade(seg(p,.4,.55),T(cs(EC,'E')+'=\\dfrac{3\\,\\mathrm{V}}{3\\,\\mathrm{m}}='+cs(EC,'1\\,\\mathrm{V/m}'),870,420,{size:34}));
  s+=fade(seg(p,.4,.55),arrow(820,490,900,490,{color:EC,w:5,head:16}));
  s+=fade(seg(p,.7,.85),label('急な 坂 ＝ 強い 電場',560,28,{size:28,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'units']:(p)=>{
  let s=card(90,70,1020,390,'',1);
  s+=T('\\mathrm{\\dfrac{V}{m}}',230,190,{size:56,color:EC});
  s+=fade(seg(p,.05,.2),T('=\\mathrm{\\dfrac{J/C}{m}}',400,190,{size:56}));
  const cut=seg(p,.5,.62);
  s+=fade(seg(p,.3,.45)*(1-cut),T('=\\dfrac{\\mathrm{N}\\cdot\\mathrm{m}}{\\mathrm{C}\\cdot\\mathrm{m}}',650,190,{size:56}));
  s+=fade(cut,T('=\\dfrac{\\mathrm{N}\\cdot'+cs(NG,'\\cancel{\\mathrm{m}}')+'}{\\mathrm{C}\\cdot'+cs(NG,'\\cancel{\\mathrm{m}}')+'}',650,190,{size:56}));
  s+=fade(seg(p,.3,.45),label('J ＝ N·m',650,300,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.6,.72),T('=\\mathrm{\\dfrac{N}{C}}',910,190,{size:56,color:EC}));
  s+=fade(seg(p,.75,.9),label('電場の 単位 N/C と 一致',600,390,{size:32,color:EC,anchor:'middle',weight:700}));
  return s;
 },
 // ============ S6 高さの地図 ============
 [K+'hill']:(p)=>{
  // side view: V = 1/|u| (clipped), 200 px per u, 80 px per V ; top view contours r = 200/V
  const cx=320,by=440,X=u=>cx+200*u,Yv=v=>by-80*v;
  const pts=[];for(let i=0;i<=240;i++){const u=-1.2+2.4*i/240;pts.push([X(u),Yv(Math.min(4.4,1/Math.max(1e-3,Math.abs(u))))]);}
  let s=fade(seg(p,0,.1),line(X(-1.25),by,X(1.25),by,{color:C.dim,w:2}));
  s+=fade(seg(p,.05,.35),poly([[X(-1.2),by],...pts,[X(1.2),by]],{fill:VC,fo:.18}))+draw(pts,seg(p,.05,.35),{color:VC,w:4});
  for(let v=1;v<=4;v++)s+=fade(seg(p,.3,.45),line(X(-1/v),Yv(v),X(1/v),Yv(v),{color:VC,w:1.5,dash:'5 6'})+label(`${v} V`,X(1.2),Yv(v)+8,{size:21,color:VC,anchor:'end'}));
  s+=fade(seg(p,.05,.2),label('横から 見た 山（高さ ＝ 電位）',cx,50,{size:24,color:VC,anchor:'middle'}));
  s+=contours(900,250,{g:seg(p,.4,.6),R1:190})+fade(seg(p,.4,.6),charge(900,250,1,16)+label('上から 見た 地図',900,500,{size:24,color:VC,anchor:'middle'}));
  return s;
 },
 [K+'hillmap']:(p)=>{
  let s=contours(900,250,{R1:190})+charge(900,250,1,16)+label('上から 見た 地図',900,500,{size:24,color:VC,anchor:'middle'});
  // E arrows perpendicular to the contours, downhill (outward), longer where contours crowd
  s+=fade(seg(p,.2,.4),radial(900,250,{rings:[[52,40],[100,26],[150,16]],rot:Math.PI/8}).replace(/<circle[^>]*\/>|<text[^>]*>[^<]*<\/text>/g,''));
  const row=(y,a,b,g,cb=EC)=>fade(g,label(a,110,y,{size:26,color:C.ink})+label('↔',330,y,{size:26,color:C.dim,anchor:'middle'})+label(b,380,y,{size:26,color:cb,weight:700}));
  s+=card(80,80,560,340,label('山の 地図',180,125,{size:22,color:C.dim,anchor:'middle'})+label('電場の 世界',470,125,{size:22,color:C.dim,anchor:'middle'})
   +row(180,'高さ','電位 V',seg(p,.05,.2),VC)+row(240,'下り坂の 向き','𝐄 の 向き',seg(p,.2,.35))+row(300,'坂の 急さ','𝐄 の 強さ',seg(p,.4,.55))+row(360,'等高線の 混み方','強い 電場',seg(p,.65,.8)),seg(p,0,.08));
  return s;
 },
 [K+'notmap']:(p)=>{
  const cx=320,by=400,X=u=>cx+200*u,Yv=v=>by-70*v;
  const pts=[];for(let i=0;i<=240;i++){const u=-1.2+2.4*i/240;pts.push([X(u),Yv(Math.min(4.4,1/Math.max(1e-3,Math.abs(u))))]);}
  let s=line(X(-1.25),by,X(1.25),by,{color:C.dim,w:2})+poly([[X(-1.2),by],...pts,[X(1.2),by]],{fill:VC,fo:.18})+draw(pts,1,{color:VC,w:4});
  const at=u=>[X(u),Yv(1/Math.abs(u))];
  const [bx,byy]=at(-.45);s+=fade(seg(p,.1,.25),ring(bx-14,byy-16,16,{color:C.dim,w:3,fill:'#2a3550'})+arrow(bx-30,byy-30,bx-90,byy+10,{color:C.dim,w:4,head:12})+label('ボール',bx-40,byy-50,{size:22,color:C.dim,anchor:'middle'}));
  const [px,py]=at(.4);s+=fade(seg(p,.45,.6),charge(px+14,py-18,1,15)+arrow(px+30,py-20,px+95,py+22,{color:FC,w:4,head:12}));
  const [nx,ny]=at(.8);s+=fade(seg(p,.65,.8),charge(nx+14,ny-18,-1,15)+arrow(nx,ny-26,nx-50,ny-70,{color:FC,w:4,head:12}));
  s+=card(680,90,480,330,label('対応しない 所',920,140,{size:28,color:NG,anchor:'middle',weight:700})
   +fade(seg(p,.1,.25),label('ボール ： いつも 下り',720,210,{size:26,color:C.dim}))
   +fade(seg(p,.45,.6),label('正の 電荷 ： 下りへ 押される',720,280,{size:26,color:NG}))
   +fade(seg(p,.65,.8),label('負の 電荷 ： 上りへ 押される',720,350,{size:26,color:BLUE})),seg(p,0,.1),NG);
  return s;
 },
 [K+'notmap2']:(p)=>{
  let s=card(200,90,800,220,label('電位 は 本当の 高さ ではない',600,160,{size:34,color:VC,anchor:'middle',weight:700})+label('1 C あたりの エネルギー（J/C ＝ V）',600,230,{size:28,color:C.ink,anchor:'middle'}),seg(p,0,.15),VC);
  s+=fade(seg(p,.6,.75),arrow(600,340,600,430,{color:EC,w:5,head:16})+label('電場の 矢印に 戻る',640,400,{size:26,color:EC}));
  return s;
 },
 [K+'back']:(p)=>{
  const cx=600,cy=260;
  let s=contours(cx,cy,{R1:200,dash:'7 7',op:.8})+radial(cx,cy,{rings:[[34,34],[80,42],[135,30],[215,20]],g:seg(p,0,.2)});
  // right-angle mark where an arrow crosses the 2 V ring (r=100) on the rot=π/8 ray
  const a=Math.PI/8,r=100,ux=Math.cos(a),uy=-Math.sin(a),tx=-uy,ty=ux,m=14;
  const P0=[cx+r*ux,cy+r*uy];
  s+=fade(seg(p,.3,.45),draw([[P0[0]+m*ux,P0[1]+m*uy],[P0[0]+m*ux+m*tx,P0[1]+m*uy+m*ty],[P0[0]+m*tx,P0[1]+m*ty]],1,{color:HI,w:3}));
  s+=fade(seg(p,.05,.2),label('高い 電位 → 低い 電位',960,90,{size:26,color:EC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.45),label('同じ 電位の 線と 直角',960,150,{size:26,color:HI,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),label('急な 所ほど 長い 矢印',960,210,{size:26,color:EC,anchor:'middle'}));
  return s;
 },
 [K+'sum']:(p)=>{
  const col=(x,title,color,lines,g)=>card(x,60,360,420,label(title,x+180,110,{size:28,color,anchor:'middle',weight:700})+lines.map((l,i)=>typeof l==='string'?label(l,x+180,180+i*62,{size:24,color:C.ink,anchor:'middle'}):l(x+180,180+i*62)).join(''),g,color);
  let s=col(30,'決めた（定義）',HI,[(x,y)=>T(cs(VC,'V')+'=\\dfrac{'+cs(VC,'U')+'}{q}',x,y+10,{size:36}),'','0 の 基準は 約束','電位差 ＝ 終点 − 始点','電圧 ＝ 2点の 電位差'],seg(p,0,.15));
  s+=col(420,'土台（法則）',C.F,['静電場の 仕事は','道に よらない','','（確かめは 中級）'],seg(p,.55,.7));
  return s;
 },
 [K+'sum2']:(p)=>{
  const col=(x,title,color,lines,g)=>card(x,60,360,420,label(title,x+180,110,{size:28,color,anchor:'middle',weight:700})+lines.map((l,i)=>typeof l==='string'?label(l,x+180,180+i*62,{size:24,color:C.ink,anchor:'middle'}):l(x+180,180+i*62)).join(''),g,color);
  let s=col(30,'決めた（定義）',HI,[(x,y)=>T(cs(VC,'V')+'=\\dfrac{'+cs(VC,'U')+'}{q}',x,y+10,{size:36}),'','0 の 基準は 約束','電位差 ＝ 終点 − 始点','電圧 ＝ 2点の 電位差'],1);
  s+=col(420,'土台（法則）',C.F,['静電場の 仕事は','道に よらない','','（確かめは 中級）'],1);
  s+=col(810,'導いた 結果',EC,[
   (x,y)=>T(cs(VC,'\\Delta U')+'=q\\,\\Delta '+cs(VC,'V'),x,y,{size:32}),
   (x,y)=>T(cs(VC,'W')+'=-'+cs(VC,'\\Delta U'),x,y,{size:32}),
   (x,y)=>label('E ＝ 下がり幅 ÷ 距離',x,y+8,{size:24,color:EC,anchor:'middle'}),
   (x,y)=>label('V/m ＝ N/C',x,y+8,{size:24,color:C.dim,anchor:'middle'})],seg(p,0,.15));
  return s;
 },
 [K+'next']:(p)=>{
  const L=470,R=730,top=110,bot=390;
  let s=fade(seg(p,0,.15),rect(L-14,top,14,bot-top,{fill:C.dim,fo:.8,stroke:C.dim,rx:3})+rect(R,top,14,bot-top,{fill:C.dim,fo:.8,stroke:C.dim,rx:3})+label('金属板',L-7,top-18,{size:22,color:C.dim,anchor:'middle'})+label('金属板',R+7,top-18,{size:22,color:C.dim,anchor:'middle'}));
  // wires and battery below
  s+=fade(seg(p,.1,.3),draw([[L-7,bot],[L-7,470],[560,470]],1,{color:C.dim,w:3})+draw([[640,470],[R+7,470],[R+7,bot]],1,{color:C.dim,w:3})+line(560,445,560,495,{color:C.ink,w:4})+line(640,455,640,485,{color:C.ink,w:6})+label('＋',540,450,{size:22,color:NG,anchor:'end'})+label('−',660,450,{size:22,color:BLUE})+label('電圧',600,440,{size:22,color:HI,anchor:'middle'}));
  const n=6;for(let i=0;i<n;i++){const y=top+25+i*(bot-top-50)/(n-1);s+=fade(seg(p,.35+i*.04,.45+i*.04),label('＋',L-40,y+9,{size:26,color:NG,anchor:'middle',weight:700})+label('−',R+42,y+9,{size:26,color:BLUE,anchor:'middle',weight:700}));}
  s+=fade(seg(p,.55,.7),uniformRows({ys:[170,250,330],x0:L+30,x1:R-20,len:60,gap:110}));
  s+=fade(seg(p,.75,.9),label('コンデンサ',990,250,{size:40,color:HI,anchor:'middle',weight:700})+label('正と 負の 電荷を 分けて ためる',990,310,{size:24,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'next2']:(p)=>{
  let s=card(250,110,700,290,label('次の 問い',600,165,{size:26,color:C.dim,anchor:'middle'})+label('1 V あたり、',600,245,{size:36,color:HI,anchor:'middle',weight:700})+label('どれだけの 電荷を ためられる？',600,315,{size:36,color:C.ink,anchor:'middle',weight:700}),seg(p,0,.2),HI);
  return s;
 },
};

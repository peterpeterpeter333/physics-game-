// 特別編「1分の疑問」10 鏡はなぜ左右だけ逆 (ys-sp-1min-mirror) — 図。Stage 1200×515。
import {C,seg,fade,label,line,rect,dot,ring,arrow,clamp,mix,poly,draw} from './anim.mjs';
import {HC,cueT,qcard,finalQ,wrap} from './yt1-sp-1min-common.mjs';
import {tag,cross,okMark,vfn} from './yt1-sp-1min-mpb-common.mjs';

const K='sp-1min-mirror:';
const SKIN='#f0c9a0',HAIR='#3a2a22',SHIRT='#4f7fd6',PANTS='#2c3d63',GLASS='#9fd3ff',RH=C.x;
const tf=(cx,cy,sx,sy,svg)=>`<g transform="translate(${cx.toFixed(2)} ${cy.toFixed(2)}) scale(${sx.toFixed(3)} ${sy.toFixed(3)})">${svg}</g>`;

// 正面／背中から見た人（原点＝体の中心、身長 1 → h 倍は外で）。raise=+1 で画面の右の手を挙げる。
// 戻り値は原点まわりの SVG（高さ 1 を 100 として描く）。手の位置は hand(raise)。
function body100({back=false,raise=1,handCol=RH}={}){
 // 体の中心 (0,0)、足 y=+50、頭のてっぺん y=-50
 let s='';
 s+=line(-6,10,-9,50,{color:PANTS,w:9})+line(6,10,9,50,{color:PANTS,w:9});
 s+=rect(-14,-26,28,40,{fill:SHIRT,fo:1,stroke:SHIRT,sw:1,rx:7});
 // 下ろした腕
 s+=line(-raise*13,-22,-raise*19,8,{color:SHIRT,w:7})+dot(-raise*19,10,4,SKIN);
 // 挙げた腕
 s+=line(raise*13,-22,raise*25,-50,{color:SHIRT,w:7})+dot(raise*25,-52,5.5,handCol);
 if(back){s+=dot(0,-38,11,HAIR);}
 else{s+=dot(0,-40,11,HAIR)+dot(0,-36,10,SKIN)+dot(-3.6,-37,1.6,'#20160f')+dot(3.6,-37,1.6,'#20160f')+line(-3,-31,3,-31,{color:'#b36b55',w:1.5});}
 return s;
}
const HAND=raise=>[raise*25,-52];
// place a 100-high body: centre (cx,cy), height h, flips sx/sy
const fig=(cx,cy,h,opt={},sx=1,sy=1)=>tf(cx,cy,h/100*sx,h/100*sy,body100(opt));
const handAt=(cx,cy,h,raise,sx=1,sy=1)=>{const [a,b]=HAND(raise);return [cx+a*h/100*sx,cy+b*h/100*sy];};

// 横から見た人（dir=+1 で右向き）
function profile(cx,yF,h,dir=1,{op=1}={}){
 const k=h/100,X=v=>cx+dir*v*k,Y=v=>yF-v*k;
 let s=line(X(0),Y(48),X(2),Y(0),{color:PANTS,w:9*k})+line(X(-2),Y(48),X(-4),Y(0),{color:PANTS,w:9*k});
 s+=rect(cx-9*k,Y(86),18*k,40*k,{fill:SHIRT,fo:1,stroke:SHIRT,sw:1,rx:6});
 s+=line(X(0),Y(80),X(4),Y(52),{color:'#3f68b8',w:7*k})+dot(X(4),Y(50),4*k,SKIN);
 s+=dot(X(0),Y(92),11*k,SKIN)+`<path d="M${X(-11)} ${Y(92)} A${11*k} ${11*k} 0 0 ${dir>0?1:0} ${X(6)} ${Y(101)}" fill="${HAIR}"/>`+dot(X(-2),Y(96),9*k,HAIR,.0);
 s+=poly([[X(10),Y(95)],[X(15),Y(90)],[X(10),Y(88)]],{fill:SKIN,fo:1})+dot(X(5),Y(94),1.8*k,'#20160f');
 return fade(op,s);
}
// 鏡の枠（正面から）
function mirrorFrame(x,y,w,h,{g=1}={}){
 let s=rect(x,y,w,h,{fill:GLASS,fo:.08,stroke:'#c9d3e6',sw:5,rx:8});
 s+=line(x+w*.12,y+h*.1,x+w*.32,y+h*.02,{color:'#ffffff',w:3,opacity:.25})+line(x+w*.1,y+h*.2,x+w*.42,y+h*.04,{color:'#ffffff',w:2,opacity:.18});
 return fade(g,s);
}
// 鏡の線（横・上から見た断面）。back = 裏の斜線の側
function mirrorLine(x1,y1,x2,y2,{back=[0,1],g=1}={}){
 let s=line(x1,y1,x2,y2,{color:'#cfe8ff',w:7});
 const L=Math.hypot(x2-x1,y2-y1),n=Math.floor(L/24);
 for(let i=0;i<=n;i++){const u=i/n,x=mix(x1,x2,u),y=mix(y1,y2,u);s+=line(x,y,x+back[0]*14+back[1]*8,y+back[1]*14+back[0]*8,{color:C.faint,w:2});}
 return fade(g,s);
}
const mirrorText=(s,x,y,o)=>`<g transform="translate(${x} 0) scale(-1 1) translate(${-x} 0)">${label(s,x,y,o)}</g>`;

// 正面の場面：鏡の枠と像（前向き・画面の右の手を挙げる）、手前に背中の人
const MX=660,MW=320,MY=72,MH=393,IX=820,IC=318,IH=270,PX=330,PC=332,PH=300;
function frontScene({gI=1,gP=1}={}){
 let s=mirrorFrame(MX,MY,MW,MH);
 s+=fade(gI*.85,fig(IX,IC,IH,{back:false,raise:1,handCol:HC}));
 s+=fade(gP,fig(PX,PC,PH,{back:true,raise:1}));
 return s;
}

const P1='鏡は、なぜ左右だけ逆？',P2='右手は、鏡のどこに映る？',P3='逆立ちして重なったら？';

export const sp1minMirrorDiagrams={
 // 1. Q：右手を挙げる人と、左手を挙げて見える像
 [K+'q']:wrap(1,(p,ctx)=>{
  const t=cueT(p,ctx),[V]=vfn(p,ctx);
  let s=qcard(['鏡は、なぜ','左右だけ 逆？'],p,t,{y0:200});
  const g=V(.1,.3);
  s+=fade(g,mirrorFrame(880,80,270,400)+fade(.85,fig(1015,315,250,{raise:1,handCol:HC}))+fig(170,330,290,{back:true,raise:1}));
  const [hx,hy]=handAt(170,330,290,1),[ix,iy]=handAt(1015,315,250,1);
  s+=fade(V(.3,.42),label('右手',hx,hy-22,{size:30,color:RH,anchor:'middle',weight:700}));
  s+=fade(V(.4,.52),label('左手？',ix-10,iy-22,{size:30,color:HC,anchor:'middle',weight:700}));
  s+=fade(V(.6,.75),label('上下は そのまま',600,470,{size:30,color:C.dim,anchor:'middle',weight:700}));
  return s;
 },{fadeIn:false,roll:0}),
 // 2. 横から：前の矢印が、像ではこちらを向く。上はそのまま
 [K+'front']:wrap(1,(p,ctx)=>{
  const [V]=vfn(p,ctx);
  let s=mirrorLine(600,135,600,450,{back:[1,0]})+label('鏡',600,490,{size:28,color:'#cfe8ff',anchor:'middle',weight:700});
  s+=profile(330,450,290,1);
  s+=fade(V(.15,.3),profile(870,450,290,-1,{op:.7}));
  s+=arrow(380,265,540,265,{color:HC,w:6,g:V(.45,.55),head:20})+fade(V(.47,.57),label('前',460,245,{size:30,color:HC,anchor:'middle',weight:700}));
  s+=arrow(820,265,660,265,{color:HC,w:6,g:V(.55,.65),head:20})+fade(V(.57,.67),label('前',740,245,{size:30,color:HC,anchor:'middle',weight:700}));
  const gu=V(.2,.35);
  s+=arrow(190,340,190,180,{color:RH,w:5,g:gu,head:18})+fade(gu,label('上',190,165,{size:28,color:RH,anchor:'middle',weight:700}));
  s+=arrow(1010,340,1010,180,{color:RH,w:5,g:gu,head:18})+fade(gu,label('上',1010,165,{size:28,color:RH,anchor:'middle',weight:700}));
  s+=fade(V(.05,.15)*(1-V(.5,.6)),label('左右を 逆に していない',600,90,{size:28,color:C.dim,anchor:'middle',weight:700}));
  s+=tag('逆になるのは 前と後ろ',600,98,{g:V(.68,.8),size:28});
  return s;
 },{pill:P1,bridge:.95}),
 // 3. 上から：右手と、その真正面の像の手を線で結ぶ
 [K+'top']:wrap(2,(p,ctx)=>{
  const [V]=vfn(p,ctx);
  const Y0=290,PY=420,IY=160,SW=95;
  let s=mirrorLine(250,Y0,950,Y0,{back:[0,-1]})+label('鏡（上から 見た図）',260,Y0-20,{size:24,color:'#cfe8ff',weight:700});
  const topPerson=(cy,dir,op,col)=>{
   let t=`<ellipse cx="600" cy="${cy}" rx="${SW}" ry="26" fill="${SHIRT}" fill-opacity="${op}"/>`;
   t+=dot(600-SW,cy,13,SKIN,op)+dot(600+SW,cy,13,col,op);
   t+=dot(600,cy,30,HAIR,op)+poly([[590,cy-dir*26],[600,cy-dir*42],[610,cy-dir*26]],{fill:SKIN,fo:op});
   return t;
  };
  s+=topPerson(PY,1,1,RH)+label('あなた',600,PY+70,{size:26,color:C.ink,anchor:'middle',weight:700});
  s+=fade(V(.2,.3),topPerson(IY,-1,.75,HC)+label('像',600,IY-50,{size:26,color:C.dim,anchor:'middle',weight:700}));
  s+=fade(V(.25,.35),label('右手',600+SW+26,PY+10,{size:28,color:RH,weight:700}));
  s+=draw([[600+SW,PY-14],[600+SW,IY+14]],V(.32,.5),{color:HC,w:4,dash:'10 8'});
  s+=draw([[600-SW,PY-14],[600-SW,IY+14]],V(.4,.55),{color:C.dim,w:3,dash:'10 8'});
  s+=fade(V(.48,.58),label('同じ 右側',600+SW+26,IY+10,{size:28,color:HC,weight:700}));
  s+=fade(V(.7,.82),label('右は 右',1010,PY-40,{size:30,color:C.ink,anchor:'middle',weight:700})+label('上は 上',1010,PY+4,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(V(.75,.88),label('向き合う 向きだけ 逆',240,IY+10,{size:26,color:HC,anchor:'middle',weight:700}));
  return s;
 },{roll:0,q:{end:.16,lines:['右手は、鏡の どこに 映る？'],text:P2}}),
 // 4. 振り返って像に重なる想像 → 左右が合わない
 [K+'turn']:wrap(2,(p,ctx)=>{
  const [V]=vfn(p,ctx);
  let s=frontScene();
  const u=V(.35,.75),cx=mix(PX,IX,u),cy=mix(PC,IC,u),h=mix(PH,IH,u),sx=Math.cos(Math.PI*u);
  const ghost=Math.abs(sx)<.02?'':(sx>0?fig(cx,cy,h,{back:true,raise:1},sx,1):fig(cx,cy,h,{back:false,raise:1},sx,1));
  s+=fade(V(.28,.36)*.6,ghost);
  s+=fade(V(.3,.4)*(1-V(.78,.86)),label('くるりと 振り返る',(PX+IX)/2-100,110,{size:28,color:C.ink,anchor:'middle',weight:700})+`<path d="M470 150 Q575 115 680 150" fill="none" stroke="${C.ink}" stroke-width="4"/>`+arrow(670,144,690,156,{color:C.ink,w:4,head:14}));
  if(u>=1){
   const [gx,gy]=handAt(IX,IC,IH,1,-1,1),[ix,iy]=handAt(IX,IC,IH,1);
   s+=fade(V(.78,.86),label('あなたの右手',gx-30,gy-24,{size:24,color:RH,anchor:'middle',weight:700})+label('像の手',ix+20,iy-24,{size:24,color:HC,anchor:'middle',weight:700}));
   s+=cross(IX,iy+10,20,V(.84,.92));
   s+=fade(V(.86,.96),label('左右が 合わない',IX,503,{size:30,color:C.a,anchor:'middle',weight:700}));
  }
  return s;
 },{pill:P2,bridge:.97}),
 // 5. 逆立ちで重なる想像 → 左右は合うが、上下が逆
 [K+'handstand']:wrap(3,(p,ctx)=>{
  const [V]=vfn(p,ctx);
  let s=frontScene();
  const u=V(.3,.72),cx=mix(PX,IX,u),cy=mix(PC,IC,u),h=mix(PH,IH,u),sy=Math.cos(Math.PI*u);
  const ghost=Math.abs(sy)<.02?'':(sy>0?fig(cx,cy,h,{back:true,raise:1},1,sy):fig(cx,cy,h,{back:false,raise:1},1,sy));
  s+=fade(V(.24,.32)*.6,ghost);
  s+=fade(V(.26,.36)*(1-V(.72,.8)),label('逆立ちして 重なる',(PX+IX)/2-100,110,{size:28,color:C.ink,anchor:'middle',weight:700}));
  if(u>=1){
   const [gx,gy]=handAt(IX,IC,IH,1,1,-1),[ix,iy]=handAt(IX,IC,IH,1);
   s+=okMark(IX+190,(gy+iy)/2,V(.74,.82));
   s+=fade(V(.74,.82),label('左右は 合う',IX+218,(gy+iy)/2+10,{size:26,color:C.F,weight:700}));
   s+=fade(V(.84,.95),label('上下が 逆に 感じる',IX,503,{size:30,color:HC,anchor:'middle',weight:700}));
  }
  return s;
 },{roll:0,q:{end:.22,lines:['逆立ちして 重なったら？'],text:P3}}),
 // 6. 床の鏡：上下が逆の像。逆になるのは鏡に向かう向き
 [K+'floor']:wrap(3,(p,ctx)=>{
  const [V]=vfn(p,ctx);
  const Y=300;
  const scene=()=>{
   let t=fig(200,Y-95,190,{raise:1,handCol:SKIN});
   t+=rect(772,Y-90,16,90,{fill:'#8a5a3b',fo:1,stroke:'none',rx:3})+dot(780,Y-130,60,'#3f9a5a')+dot(745,Y-105,38,'#3f9a5a')+dot(818,Y-108,40,'#3f9a5a');
   return t;
  };
  let s=rect(120,Y,960,10,{fill:'#cfe8ff',fo:.9,stroke:'none',rx:3})+rect(120,Y+10,960,205,{fill:GLASS,fo:.06,stroke:'none',rx:0});
  s+=label('床に 置いた鏡',300,Y+42,{size:24,color:'#cfe8ff',weight:700});
  s+=scene();
  s+=fade(V(.1,.25)*.5,`<g transform="translate(0 ${2*Y+10}) scale(1 -1)">${scene()}</g>`);
  s+=fade(V(.25,.35),label('上下が 逆',560,Y+120,{size:30,color:C.ink,anchor:'middle',weight:700}));
  const ga=V(.6,.72);
  s+=arrow(1000,Y-150,1000,Y-14,{color:HC,w:6,g:ga,head:20})+arrow(1000,Y+160,1000,Y+24,{color:HC,w:6,g:ga,head:20});
  s+=fade(ga,label('鏡に 向かう',1000,Y-170,{size:26,color:HC,anchor:'middle',weight:700}));
  s+=tag('逆になるのは 鏡に向かう向きだけ',540,90,{g:V(.75,.88),size:28});
  return s;
 },{pill:P3,bridge:.96}),
 // 7. 次の疑問：文字が反転しない鏡は？
 [K+'next']:wrap(4,(p,ctx)=>{
  const [V]=vfn(p,ctx);
  let s=finalQ(['文字が 反転せずに 読める','鏡は、作れる？'],V(.05,.25),{y:66,sc:.9+.1*V(.05,.25)});
  const g1=V(.3,.5),g2=V(.5,.7);
  s+=fade(g1,label('物理',230,380,{size:72,color:C.ink,anchor:'middle',weight:700})+mirrorLine(370,270,370,430,{back:[1,0]})+fade(.7,mirrorText('物理',510,380,{size:72,color:C.ink,anchor:'middle',weight:700}))+label('1枚の鏡：反転',370,480,{size:26,color:C.dim,anchor:'middle',weight:700}));
  s+=fade(g2,mirrorLine(900,265,800,370,{back:[-.7,-.7]})+mirrorLine(900,265,1000,370,{back:[.7,-.7]})+label('？',900,345,{size:56,color:HC,anchor:'middle',weight:700})+label('物理',900,440,{size:52,color:C.ink,anchor:'middle',weight:700})+label('2枚の鏡',900,490,{size:26,color:C.dim,anchor:'middle',weight:700}));
  return s;
 },{roll:0}),
};

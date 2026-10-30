// 特別編「1分の疑問」12 自転車はなぜ倒れない (ys-sp-1min-bicycle) — 図。Stage 1200×515。
import {C,seg,fade,label,line,rect,dot,ring,arrow,clamp,mix,poly,draw} from './anim.mjs';
import {HC,cueT,qcard,finalQ,wrap} from './yt1-sp-1min-common.mjs';
import {tag,cross,okMark,card,vfn} from './yt1-sp-1min-mpb-common.mjs';

const K='sp-1min-bicycle:';
const FR='#e66a5a',TIRE='#c9d3e6',CW='#ffb36b',COM=C.hi,CON=C.x,F=C.F,SKIN='#f0c9a0',SHIRT='#4f7fd6',PANTS='#2c3d63';
const sm=u=>{u=clamp(u);return u*u*(3-2*u);};
const P1='走る自転車は、なぜ倒れにくい？',P2='コマの効果がなくても、倒れない？',P3='ハンドルが切れると、なぜ起き上がる？';

function wheel(cx,cy,R,rot,{col=TIRE,w=5,spk='#8a99b3'}={}){
 let s=ring(cx,cy,R,{color:col,w});
 for(let i=0;i<6;i++){const a=rot+i*Math.PI/6;s+=line(cx-R*Math.cos(a),cy-R*Math.sin(a),cx+R*Math.cos(a),cy+R*Math.sin(a),{color:spk,w:1.5});}
 return s+dot(cx,cy,4,col);
}
// 横から見た自転車（右向き）。rot：車輪の角度。extra：逆回転の車輪
function bikeSide(x,yG,s,{rot=0,extra=false,g=1}={}){
 const R=s*.32,A=[x-s*.52,yG-R],Fh=[x+s*.52,yG-R],B=[x-s*.05,yG-R+s*.04],S=[x-s*.2,yG-R-s*.5],H=[x+s*.38,yG-R-s*.48];
 let o=wheel(...A,R,rot)+wheel(...Fh,R,rot);
 if(extra){for(const c of [A,Fh])o+=fade(.9,wheel(c[0],c[1]-R*.05,R*.62,-rot*1.3,{col:CW,w:4,spk:'#c98a4a'}));}
 const L=(p,q)=>line(p[0],p[1],q[0],q[1],{color:FR,w:5});
 o+=L(A,B)+L(A,S)+L(B,S)+L(S,H)+L(B,H)+L(H,Fh);
 o+=rect(S[0]-s*.1,S[1]-s*.04,s*.18,s*.05,{fill:'#33415c',fo:1,stroke:'#33415c',rx:4});
 o+=line(H[0],H[1],H[0]-s*.03,H[1]-s*.12,{color:'#c9d3e6',w:4})+line(H[0]-s*.03,H[1]-s*.12,H[0]-s*.14,H[1]-s*.12,{color:'#c9d3e6',w:5});
 return fade(g,o);
}
// 後ろから見た自転車＋人。lean（度、正で画面の右へ傾く）。地面の接地点 (cx,yG) のまわりに回す
function bikeRear(cx,yG,h,lean,{g=1,rider=true,com=true}={}){
 const R=h*.32;
 let o=rect(cx-8,yG-2*R,16,2*R,{fill:'#222c40',fo:1,stroke:TIRE,sw:3,rx:8});
 o+=line(cx,yG-R,cx,yG-h*.75,{color:FR,w:6})+rect(cx-22,yG-h*.79,44,10,{fill:'#33415c',fo:1,stroke:'#33415c',rx:4});
 o+=line(cx-h*.25,yG-h*.9,cx+h*.25,yG-h*.9,{color:'#c9d3e6',w:5});
 if(rider){
  o+=line(cx-10,yG-h*.76,cx-12,yG-h*.4,{color:PANTS,w:9})+line(cx+10,yG-h*.76,cx+12,yG-h*.4,{color:PANTS,w:9});
  o+=rect(cx-h*.1,yG-h*1.2,h*.2,h*.44,{fill:SHIRT,fo:1,stroke:SHIRT,rx:8});
  o+=line(cx-h*.08,yG-h*1.12,cx-h*.24,yG-h*.92,{color:SHIRT,w:7})+line(cx+h*.08,yG-h*1.12,cx+h*.24,yG-h*.92,{color:SHIRT,w:7});
  o+=dot(cx,yG-h*1.32,h*.1,'#3a2a22');
 }
 if(com)o+=dot(cx,yG-h*.95,9,COM)+ring(cx,yG-h*.95,13,{color:'#0b1122',w:2});
 return fade(g,`<g transform="rotate(${lean.toFixed(2)} ${cx} ${yG})">${o}</g>`);
}
// 上から見た自転車（向き ang：0＝画面の上向き、度、時計回り）。steer：前輪の角度
function bikeTop(cx,cy,len,ang,steer,{g=1}={}){
 const r=len*.24;
 let o=rect(cx-6,cy+len/2-r,12,2*r,{fill:'#222c40',fo:1,stroke:TIRE,sw:3,rx:6});
 o+=line(cx,cy-len/2,cx,cy+len/2,{color:FR,w:6});
 o+=dot(cx,cy+len*.12,len*.09,SHIRT)+dot(cx,cy+len*.12,len*.055,'#3a2a22');
 const fw=`<g transform="rotate(${steer.toFixed(2)} ${cx} ${cy-len/2})">${rect(cx-6,cy-len/2-r,12,2*r,{fill:'#222c40',fo:1,stroke:TIRE,sw:3,rx:6})+line(cx-len*.22,cy-len/2+r*.35,cx+len*.22,cy-len/2+r*.35,{color:'#c9d3e6',w:6})}</g>`;
 return fade(g,`<g transform="rotate(${ang.toFixed(2)} ${cx} ${cy})">${o+fw}</g>`);
}
// 回るコマ
function spinTop(x,yTip,h,t,{g=1}={}){
 const yD=yTip-h*.55,rx=h*.55,ry=h*.13;
 let o=poly([[x,yTip],[x-rx*.95,yD+ry*.3],[x+rx*.95,yD+ry*.3]],{fill:'#b46bd6',fo:1,stroke:'#e2b8ff',sw:2});
 o+=`<ellipse cx="${x}" cy="${yD}" rx="${rx}" ry="${ry}" fill="#d98ef0" stroke="#f3d6ff" stroke-width="2"/>`;
 for(let i=0;i<6;i++){const a=t*7+i*Math.PI/3,c=Math.cos(a),sn=Math.sin(a);if(sn>-.2)o+=dot(x+rx*.75*c,yD+ry*.75*sn,6,'#fff3b0',.6+.4*sn);}
 o+=rect(x-7,yD-h*.42,14,h*.42,{fill:'#8a5a3b',fo:1,stroke:'#c08a55',sw:1.5,rx:5});
 const tilt=6*Math.sin(t*1.6);
 return fade(g,`<g transform="rotate(${tilt.toFixed(2)} ${x} ${yTip})">${o}</g>`);
}
// 回転の矢印（円弧）。dir=+1 時計回り
function spinArrow(cx,cy,r,dir,col,a0=-2.4){
 const a1=a0+dir*1.4,p=a=>[cx+r*Math.cos(a),cy+r*Math.sin(a)];
 const [x0,y0]=p(a0),[x1,y1]=p(a1),[x2,y2]=p(a1-dir*.15);
 return `<path d="M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 ${dir>0?1:0} ${x1.toFixed(1)} ${y1.toFixed(1)}" fill="none" stroke="${col}" stroke-width="4"/>`+arrow(x2,y2,x1,y1,{color:col,w:4,head:14});
}
const groundL=(x1,x2,y)=>line(x1,y,x2,y,{color:C.dim,w:3});

export const sp1minBicycleDiagrams={
 // 1. Q：倒れる自転車と、走る自転車
 [K+'q']:wrap(1,(p,ctx)=>{
  const t=cueT(p,ctx),[V]=vfn(p,ctx);
  let s=qcard(['走る 自転車は、','なぜ 倒れにくい？'],p,t,{y0:150});
  const ga=V(.1,.3);
  s+=fade(ga,groundL(60,330,490)+bikeRear(190,490,170,50*sm(V(.3,.75))**2,{com:false})+label('止まると',190,520-5,{size:24,color:C.dim,anchor:'middle',weight:700}));
  s+=fade(ga,groundL(820,1190,490)+bikeSide(1005,490,190,{rot:t*4})+[0,1,2].map(i=>line(800-((t*160+i*50)%120),400+i*25,840-((t*160+i*50)%120),400+i*25,{color:C.dim,w:3})).join('')+label('走ると',1005,515,{size:24,color:C.dim,anchor:'middle',weight:700}));
  return s;
 },{fadeIn:false,roll:0}),
 // 2. よく言われる説明：コマの効果
 [K+'top']:wrap(1,(p,ctx)=>{
  const t=cueT(p,ctx),[V]=vfn(p,ctx);
  let s=tag('よく 言われる 説明',600,100,{g:V(0,.12),size:28,color:C.dim});
  s+=fade(V(.3,.45),spinTop(330,450,260,t)+label('回る コマ',330,500,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(V(.05,.2),wheel(870,310,130,t*4)+spinArrow(870,310,160,1,CON)+label('回る 車輪',870,500,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(V(.5,.62),label('＝？',600,320,{size:64,color:HC,anchor:'middle',weight:700}));
  return s;
 },{pill:P1}),
 // 3. 2011年：コマの効果を打ち消した自転車が、倒れずに進む
 [K+'exp']:wrap(2,(p,ctx)=>{
  const t=cueT(p,ctx),[V,VL]=vfn(p,ctx);
  const x=mix(260,940,sm(VL(.45,.98))),yG=470,sz=230,rot=(x-260)/(sz*.32);
  let s=groundL(40,1160,yG)+bikeSide(x,yG,sz,{rot,extra:true});
  s+=tag('2011年 研究者の 実験',260,100,{g:V(.15,.25),size:28});
  const R=sz*.32,ax=x-sz*.52;
  s+=fade(V(.28,.38),spinArrow(ax,yG-R,R+16,1,CON)+spinArrow(ax,yG-R*1.05,R*.62-14,-1,CW,-.8));
  s+=fade(V(.3,.4),label('逆回転の 車輪',ax+20,yG-2*R-56,{size:26,color:CW,anchor:'middle',weight:700}));
  s+=fade(V(.36,.46),label('コマの効果 ＝ 0',900,100,{size:30,color:CW,anchor:'middle',weight:700}));
  s+=arrow(x-sz*.95,yG-R-50,x-sz*.62,yG-R-50,{color:F,w:7,head:22,g:V(.6,.68)*(1-V(.75,.82))})+fade(V(.6,.68)*(1-V(.75,.82)),label('押す',x-sz*.8,yG-R-70,{size:26,color:F,anchor:'middle',weight:700}));
  s+=okMark(820,182,V(.9,.98))+fade(V(.9,.98),label('倒れずに 進んだ',850,192,{size:30,color:C.F,weight:700}));
  return s;
 },{roll:0,q:{end:.14,lines:['コマの 効果が なくても、','倒れない？'],text:P2}}),
 // 4. 倒れかけると、ハンドルが倒れる向きに切れる
 [K+'steer']:wrap(2,(p,ctx)=>{
  const [V]=vfn(p,ctx);
  const lean=14*V(.35,.55),steer=24*V(.62,.85);
  let a=label('後ろから 見る',310,110,{size:26,color:C.dim,anchor:'middle',weight:700})+groundL(110,510,470)+bikeRear(310,470,190,lean);
  a+=fade(V(.4,.55),arrow(380,190,450,215,{color:HC,w:5,head:16})+label('右に 傾く',440,170,{size:26,color:HC,anchor:'middle',weight:700}));
  let b=label('上から 見る',890,110,{size:26,color:C.dim,anchor:'middle',weight:700})+bikeTop(890,320,260,0,steer);
  b+=fade(V(.65,.8),spinArrow(890,190,70,1,HC,-2.2)+label('右に 切れる',1030,205,{size:26,color:HC,anchor:'middle',weight:700}));
  b+=fade(V(.1,.2),arrow(1060,420,1060,340,{color:C.dim,w:4,head:14})+label('進む',1060,450,{size:24,color:C.dim,anchor:'middle',weight:700}));
  return card(70,75,480,425,a,V(.02,.12))+card(650,75,480,425,b,V(.15,.25));
 },{pill:P2,bridge:.95}),
 // 5. 上から：タイヤの接地点が、重心の真下へ戻る
 [K+'path']:wrap(3,(p,ctx)=>{
  const [V,VL]=vfn(p,ctx);
  const y0=300,X0=110,X1=880,yc=x=>y0+50*sm((x-200)/230),yt=x=>y0+50*sm((x-360)/330);
  const xc=mix(X0,X1,VL(.22,.92)),pts=f=>{const a=[];for(let x=X0;x<=xc;x+=6)a.push([x,f(x)]);a.push([xc,f(xc)]);return a;};
  let s=fade(V(.2,.28),label('上から 見た図',X0,130,{size:26,color:C.dim,weight:700})+arrow(X0+200,122,X0+290,122,{color:C.dim,w:4,head:14})+label('進む',X0+300,130,{size:24,color:C.dim,weight:700}));
  s+=draw(pts(yc),1,{color:COM,w:4,dash:'10 8'})+draw(pts(yt),1,{color:CON,w:5});
  const gap=yc(xc)-yt(xc),dy=(yt(xc+4)-yt(xc-4))/8,ang=90+Math.atan(dy)*180/Math.PI;
  s+=bikeTop(xc-40,yt(xc-40),110,ang,Math.atan(dy)*90,{g:V(.2,.3)});
  if(gap>3)s+=line(xc,yt(xc),xc,yc(xc),{color:C.a,w:4});
  s+=dot(xc,yc(xc),10,COM)+dot(xc,yt(xc),9,CON);
  s+=fade(V(.25,.35),label('タイヤの 接地点',X0,y0-20,{size:26,color:CON,weight:700})+label('重心',X0,y0+48,{size:26,color:COM,weight:700}));
  s+=fade(V(.4,.5)*(1-V(.8,.88)),label('ずれ → 倒れかける',560,460,{size:26,color:C.a,anchor:'middle',weight:700}));
  s+=fade(V(.86,.96),label('重心の 真下へ',760,440,{size:30,color:HC,anchor:'middle',weight:700}))+okMark(620,430,V(.86,.96));
  // 後ろから見た小窓：ずれの分だけ傾く
  const lean=1.1*gap*(V(.2,.3));
  s+=card(930,75,240,260,label('後ろから',1050,110,{size:24,color:C.dim,anchor:'middle',weight:700})+groundL(960,1140,310)+bikeRear(1050,310,120,lean),V(.2,.3));
  return s;
 },{roll:0,q:{end:.16,lines:['ハンドルが 切れると、','なぜ 起き上がる？'],text:P3}}),
 // 6. 人は足を出す。自転車はハンドルで
 [K+'step']:wrap(3,(p,ctx)=>{
  const [V]=vfn(p,ctx);
  // 人（横から、右向き）：後ろ足 (210,460) を支点に前へ傾き、前足を出す
  const yG=460,bx=210,leg=110,th=(20*V(.08,.3)-10*V(.4,.6))*Math.PI/180,hip=[bx+leg*Math.sin(th),yG-leg*Math.cos(th)];
  const fx=mix(bx,bx+110,V(.3,.5)),top=[hip[0]+100*Math.sin(th*1.3),hip[1]-100*Math.cos(th*1.3)];
  let a=groundL(70,520,yG)+line(bx,yG,...hip,{color:PANTS,w:12})+line(fx,yG,...hip,{color:PANTS,w:12});
  a+=line(...hip,...top,{color:SHIRT,w:28})+dot(top[0]+18*Math.sin(th*1.3),top[1]-20,20,SKIN);
  a+=line(top[0],top[1]+15,top[0]+50,top[1]+40,{color:SHIRT,w:9});
  const cm=[hip[0]+20*Math.sin(th),hip[1]-25];
  a+=dot(...cm,9,COM)+line(cm[0],cm[1],cm[0],yG,{color:COM,w:2,dash:'6 6'});
  a+=fade(V(.35,.5),label('足を 出す',300,140,{size:30,color:HC,anchor:'middle',weight:700}));
  // 自転車（後ろから）：傾く → 接地点が右へ回り込んで、起き上がる
  const dx=70*V(.6,.85),lean=16*V(.55,.65)*(1-V(.65,.9));
  let b=groundL(700,1120,yG)+fade(V(.6,.7)*(1-V(.88,.95)),arrow(850,yG+18,930,yG+18,{color:CON,w:5,head:16}))+bikeRear(850+dx,yG,170,lean+ (V(.55,.65)>0&&dx<1?0:0));
  b+=fade(V(.62,.75),label('ハンドルで 足場を 出す',910,140,{size:28,color:HC,anchor:'middle',weight:700}));
  return card(60,75,500,430,a,V(0,.1))+card(640,75,500,430,b,V(.5,.6));
 },{pill:P3,bridge:.96}),
 // 7. 次の疑問：ハンドルのない一輪車は？
 [K+'next']:wrap(4,(p,ctx)=>{
  const t=cueT(p,ctx),[V]=vfn(p,ctx);
  let u=groundL(380,820,490)+wheel(600,445,45,t*2)+line(600,445,600,372,{color:FR,w:6})+rect(578,364,44,10,{fill:'#33415c',fo:1,stroke:'#33415c',rx:4});
  u+=line(590,372,585,430,{color:PANTS,w:9})+line(610,372,615,460,{color:PANTS,w:9});
  u+=rect(586,300,28,66,{fill:SHIRT,fo:1,stroke:SHIRT,rx:8})+dot(600,282,16,SKIN);
  const w=6*Math.sin(t*2.2);
  u+=line(588,312,525,300+w,{color:SHIRT,w:7})+line(612,312,675,300-w,{color:SHIRT,w:7});
  let s=fade(V(.3,.5),`<g transform="rotate(${(2*Math.sin(t*1.7)).toFixed(2)} 600 490)">${u}</g>`+label('？',800,400,{size:90,color:HC,anchor:'middle',weight:700}));
  s+=finalQ(['ハンドルのない 一輪車に、','人は どうやって 乗っている？'],V(.05,.25),{y:66,sc:.9+.1*V(.05,.25)});
  return s;
 },{roll:0}),
};

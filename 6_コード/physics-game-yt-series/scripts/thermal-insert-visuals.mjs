import {C,text,line,rect,circle,path,arrow,clamp} from './all-film-visuals.mjs';
import {texBox} from './revision-tex.mjs';
export const thermalInsertIds=Array.from({length:10},(_,i)=>`ht-why-${String(i+1).padStart(2,'0')}`);
// Positions are analytic reflections. Shorter containers change collision
// frequency, not particle speed. All diagrams share the same time scale.
export function reflectedPosition(distance,length){const v=((distance%(2*length))+2*length)%(2*length);return v<=length?v:2*length-v;}
function gasBox(x,y,width,height,time,count=24){
 return rect(x,y,width,height,C.cyan,.04)+Array.from({length:count},(_,i)=>{
  const theta=(i+.5)*2*Math.PI/count,speed=42;
  const X=x+5+reflectedPosition((i*.137%1)*(width-10)+speed*Math.cos(theta)*time,width-10);
  const Y=y+5+reflectedPosition((i*.271%1)*(height-10)+speed*Math.sin(theta)*time,height-10);
  return circle(X,Y,3.7,C.cyan);
 }).join('')+line(x+width,y,x+width,y+height,C.gold,5);
}
export function thermalInsertVisual(clip,scene,time){
 if(!thermalInsertIds.includes(clip.id))return null;
 const i=Math.max(0,scene.captions.findLastIndex(c=>c.start<=time));
 const cap=scene.captions[i],q=clamp((time-cap.start)/Math.max(1,cap.end-cap.start)),t=time-scene.start;
 if(clip.id==='ht-why-10'){
  const progress=i===0?q:1;
  return {diagram:text('同じ水を、どちらも 1 °C 温める',190,35,28)
   +rect(90,110,145,120,C.cyan,.18)+text('コップ：100 g',75,275,24)
   +rect(470,80,380,150,C.cyan,.18)+text('水槽：1000 g',555,275,24)
   +text(`温度の上昇 ${progress.toFixed(1)} °C`,65,320,22,C.gold)
   +text(`温度の上昇 ${(i===1?q:i>1?1:0).toFixed(1)} °C`,535,320,22,C.gold)
   +rect(95,355,55*progress,30,C.red,.8)+text('420 J',95,425,24,C.red)
   +(i>=1?rect(325,355,550*(i===1?q:1),30,C.red,.8)+text('4200 J：熱量は10倍',470,425,24,C.red):'')
   +text('棒の長さ：必要な熱量（同じ縮尺）',310,65,20,C.dim),
   equation:i===0?String.raw`Q=100\times4.2\times1=420\ \mathrm J`:i===1?String.raw`Q=1000\times4.2\times1=4200\ \mathrm J`:String.raw`Q=mc\Delta T,\quad c=4.2\ \mathrm{J/(g\cdot K)},\quad\Delta T=1\ \mathrm K`};
 }
 if(clip.id==='ht-why-01'){
  const example=i>=4,equilibrated=i>=5,amount=equilibrated?(i===5?q:1):0;
  return {diagram:text('外へ熱が逃げず、容器が受け取る熱は無視する',90,35,25)
   +rect(75,75,845,285,C.dim,.03)
   +rect(160,115,220,175,C.red,.2)+rect(605,115,220,175,C.cyan,.2)
   +text(example?'水 100 g':'熱い物体',195,155,25,C.red)+text(example?'水 100 g':'冷たい物体',640,155,25,C.cyan)
   +text(example?`${Math.round(80-30*amount)} °C`:'熱を失う',195,235,34,C.red)
   +text(example?`${Math.round(20+30*amount)} °C`:'熱を受け取る',640,235,34,C.cyan)
   +(amount<1?arrow(400,200,580,200,C.gold):text('同じ温度',420,205,24,C.green))
   +(i>=2&&amount<1?circle(410+155*((t*.2)%1),200,7,C.gold):'')
   +text(equilibrated?'失った熱 = 受け取った熱':'熱の移動',355,325,27,C.gold),
   equation:i<4?String.raw`Q_{\text{失う}}=Q_{\text{受け取る}}`:i===4?String.raw`m_1=m_2=100\ \mathrm{g},\quad c=4.2\ \mathrm{J/(g\cdot K)}`:i===5&&q<.65?String.raw`100\times4.2(80-T)=100\times4.2(T-20)`:String.raw`80-T=T-20\quad\Longrightarrow\quad T=50\ {}^\circ\mathrm C`};
 }
 if(clip.id==='ht-why-02'){
  const half=i>=1,w=half?160:320;
  return {diagram:text('同じ温度・同じ分子数・同じ速さの分布で比べる',80,35,26)
   +gasBox(90,100,320,180,t)+gasBox(570,100,w,180,t)
   +text('もとの体積 V',110,325,27,C.cyan)+text(half?'半分の体積 V/2':'もとの体積 V',580,325,27,C.cyan)
   +text('分子数 N',110,75,22)+text('分子数 N',580,75,22)
   +(i>=2?text('圧力 p',130,375,28,C.gold)+text('圧力 2p',590,375,28,C.gold):text('黄色：同じ広さの壁',345,380,22,C.gold)),
   equation:i>=2?String.raw`V\to\frac V2\quad\Longrightarrow\quad p\to2p`:''};
 }
 if(clip.id==='ht-why-03'){
  const X=v=>140+(v+273.15)*1.8,Y=v=>300-v*.55;
  const extrapolated=-273.15*clamp(q*2),kelvin=i>=2;
  return {diagram:text('圧力と気体の量を一定にして比べる（模式図）',95,35,25)
   +line(100,300,900,300)+line(140,300,140,65)
   +text('体積 V',75,60,24)+text(kelvin?'絶対温度 T [K]':'摂氏温度 [°C]',665,365,23)
   +path([[X(0),Y(273.15)],[X(100),Y(373.15)]],C.cyan,4)
   +[0,25,50,75,100].map(v=>circle(X(v),Y(v+273.15),5,C.gold)).join('')
   +(i>=1?line(X(i===1?extrapolated:-273.15),Y((i===1?extrapolated:-273.15)+273.15),X(0),Y(273.15),C.cyan,3,'7 5'):'')
   +[-273.15,0,100].map(v=>line(X(v),300,X(v),307)+text(kelvin?String(Math.round(v+273.15)):v===-273.15?'約 −273':String(v),X(v)-20,335,22)).join('')
   +text('点：気体の状態での値　破線：直線の延長',170,400,21,C.dim)
   +text('実在の気体は、そこまで冷やす前に液体などに変わる',150,440,21,C.dim),
   equation:kelvin?String.raw`T[\mathrm K]=t[{}^\circ\mathrm C]+273.15,\qquad V\propto T`:''};
 }
 if(clip.id==='ht-why-05'){
  const doubled=i>=1;
  return {diagram:text('同じ温度 T・同じ圧力 p で比べる',135,35,27)
   +gasBox(150,100,180,180,t)+gasBox(550,100,doubled?360:180,180,t,doubled?48:24)
   +text('物質量 n',175,335,28,C.cyan)+text(doubled?'物質量 2n':'物質量 n',615,335,28,C.cyan)
   +text('体積 V',190,380,25)+text(doubled?'体積 2V':'体積 V',630,380,25)
   +text(doubled?'粒の表示数は模式的。右の気体の量は左の2倍。':'粒の表示数は模式的。気体の量を変えて比べる。',135,440,21,C.dim),
   equation:i===0?String.raw`\frac{pV}{T}=\text{一定}\quad(\text{気体の量を固定})`:i<=2?String.raw`\frac{pV}{T}\propto n`:i===3?String.raw`\frac{pV}{T}=nR`:String.raw`pV=nRT`};
 }
 if(clip.id==='ht-why-06'){
  const length=560,speed=120,d=(t*speed)%(2*length),x=180+reflectedPosition(d,length),right=d<length;
  return {diagram:text('分子の運動量を調べる（この図では左を正とする）',90,35,25)
   +arrow(340,80,195,80,C.dim,'+x')+rect(180,135,length,120,C.cyan,.03)
   +line(740,125,740,265,C.gold,6)+circle(x,195,11,C.cyan)
   +arrow(x,195,x+(right?55:-55),195,C.gold)
   +text(right?'衝突前：−m vₓ':'衝突後：+m vₓ',360,310,30,C.cyan)
   +line(180,350,740,350,C.dim,2)+text('壁と壁の距離 L',360,385,25)
   +text(i>=2?'同じ壁までの往復距離は 2L':'vₓ は横方向の速さ（正の大きさ）',230,435,23,C.dim),
   equation:i<=1?String.raw`\Delta p=(+mv_x)-(-mv_x)=2mv_x`:i===2?String.raw`\Delta t=\frac{2L}{v_x}`:String.raw`F_{\text{大きさ}}=\frac{2mv_x}{2L/v_x}=\frac{mv_x^2}{L}`};
 }
 if(clip.id==='ht-why-07'){
  const sides=i>=3;
  const cube=path([[170,280],[420,280],[420,95],[170,95],[170,280]],C.cyan)+path([[170,95],[255,45],[505,45],[420,95]],C.dim)+path([[420,280],[505,230],[505,45]],C.dim)+rect(420,95,2,185,C.gold,.5);
  return {diagram:text(sides?'向きに偏りがなければ、3方向の平均は等しい':'N 個の分子が壁を押す力を足す',95,25,25)
   +cube+text('壁の面積 L²',550,110,25,C.gold)+text('箱の体積 V = L³',550,170,25)
   +Array.from({length:18},(_,j)=>{
    const a=reflectedPosition(j*.137+t*.07,1),b=reflectedPosition(j*.231+t*.07*(j%2?-1:1),1),z=reflectedPosition(j*.317+t*.07*(j%3?-1:1),1);
    return circle(175+240*a+80*z,275-175*b-45*z,4,C.cyan);
   }).join('')
   +(sides?arrow(270,210,380,210,C.gold,'x')+arrow(270,210,270,120,C.green,'y')+arrow(270,210,330,175,C.purple,'z'):'')
   +(sides?texBox(String.raw`\langle v_x^2\rangle=\langle v_y^2\rangle=\langle v_z^2\rangle`,150,315,700,50):text('合計の力を、壁の面積で割る',220,350,28))
   +(sides?texBox(String.raw`v^2=v_x^2+v_y^2+v_z^2`,150,385,700,50):text('圧力は、一つの方向の壁について求める',180,410,25,C.dim)),
   equation:i===0?String.raw`F=\frac{Nm\langle v_x^2\rangle}{L}`:i===1?String.raw`p=\frac{F}{L^2}=\frac{Nm\langle v_x^2\rangle}{L^3}`:i===2?String.raw`pV=Nm\langle v_x^2\rangle`:i===3?String.raw`\langle v_x^2\rangle=\frac{\langle v^2\rangle}{3}`:i===4?String.raw`pV=\frac{Nm\langle v^2\rangle}{3}`:String.raw`\mathrm{kg\,(m/s)^2}=\mathrm J=\mathrm{Pa\,m^3}`};
 }
 if(clip.id==='ht-why-08'){
  const progress=i===0?q:1,piston=360+150*progress;
  return {diagram:text('気体が外を押してする仕事を求める',100,35,27)
   +rect(150,105,piston-150,170,C.cyan,.15)+line(piston,90,piston,290,C.gold,8)
   +line(360,100,360,280,C.dim,2,'5 5')+arrow(piston,190,piston+100,190,C.gold)
   +text('一定の圧力：100,000 Pa',555,120,26)
   +text('増えた体積：1 L',555,180,26)+text('1 L = 0.001 m³',555,225,26,C.cyan)
   +text('移動前',315,325,21,C.dim)+text('移動後',470,325,21,C.gold)
   +text('面積 × ピストンの移動距離 = 体積の増加',160,400,25),
   equation:i===0?String.raw`W=p\Delta V=10^5\times10^{-3}=100\ \mathrm J`:i===1?String.raw`\mathrm{Pa}\cdot\mathrm{m^3}`:i===2&&q<.6?String.raw`\frac{\mathrm N}{\mathrm{m^2}}\cdot\mathrm{m^3}=\mathrm{N\,m}`:String.raw`\mathrm{N\,m}=\mathrm J`};
 }
 if(clip.id==='ht-why-09'){
  const a=t*.3,loop=i<2;
  return {diagram:loop?
   text('同じ状態へ戻れば、内部エネルギー U も元に戻る',90,35,25)
   +line(150,330,780,330)+line(150,330,150,70)+text('体積 V',735,375,24)+text('圧力 p',95,55,24)
   +path(Array.from({length:121},(_,k)=>{const angle=k/120*2*Math.PI;return[440+190*Math.cos(angle),205-95*Math.sin(angle)];}),C.cyan)
   +circle(440+190*Math.cos(a),205+95*Math.sin(a),8,C.gold)+circle(630,205,7,C.red)
   +text('出発点と終点：同じ U',650,210,23,C.red)+text('一周の変化 ΔU = 0',340,420,28,C.green):
   rect(80,90,220,120,C.red,.15)+text('熱い側',135,135,28,C.red)+text('受け取る熱 1000 J',90,185,22)
   +arrow(310,150,435,150,C.red)+rect(450,100,130,160,C.purple,.15)+text('熱機関',470,180,25)
   +arrow(590,150,715,150,C.gold)+text('仕事 400 J',725,160,27,C.gold)
   +arrow(515,270,515,350,C.cyan)+text('冷たい側へ 600 J',390,405,27,C.cyan)
   +circle(310+125*((t*.25)%1),150,5,C.red)+circle(590+125*((t*.25)%1),150,5,C.gold)+circle(515,270+80*((t*.25)%1),5,C.cyan),
   equation:loop?String.raw`\Delta U=U_{\text{終}}-U_{\text{初}}=0`:i===2?String.raw`W=Q_{\text{高}}-Q_{\text{低}}=1000-600=400\ \mathrm J`:String.raw`\eta=\frac{W}{Q_{\text{高}}}=\frac{400}{1000}=0.4`};
 }
 // One state change is split into constant-pressure and constant-temperature
 // legs. The intermediate state is not a replacement for either endpoint.
 const active=i<3?1:2,example=i>=6;
 const boxes=example?[
  {x:190,label:'変化前',v:'2 L',temp:'300 K',pressure:'p₁',height:80},
  {x:650,label:'変化後',v:'2 L',temp:'600 K',pressure:'2p₁',height:80},
 ]:[
  {x:125,label:'状態1',v:'V₁',temp:'T₁',pressure:'p₁',height:75},
  {x:445,label:'途中',v:'V′',temp:'T₂',pressure:'p₁',height:i===1?75+50*q:125},
  {x:765,label:'状態2',v:'V₂',temp:'T₂',pressure:'p₂',height:i===3?125-50*q:75},
 ];
 let drawing=text(example?'体積を変えずに温度を2倍にする':'状態1 → 圧力を一定 → 途中 → 温度を一定 → 状態2',65,30,25);
 drawing+=boxes.map((b,j)=>text(b.label,b.x,70,25)+rect(b.x,230-b.height,125,b.height,j===active?C.gold:C.cyan,.16)+line(b.x-5,230-b.height,b.x+130,230-b.height,C.dim,5)+text(b.v,b.x+35,215,27)+text(`温度 ${b.temp}`,b.x-15,265,22)+text(`圧力 ${b.pressure}`,b.x-15,300,22)).join('');
 drawing+=example?arrow(370,150,595,150,C.gold):arrow(275,165,400,165,active===1?C.gold:C.dim)+arrow(600,165,720,165,active===2?C.gold:C.dim);
 if(i===1||i===3)drawing+=circle((i===1?275:600)+120*q,165,5,C.gold);
 const formula=i<=1?String.raw`\frac{V_1}{T_1}=\frac{V'}{T_2}`:i===2?String.raw`V'=V_1\frac{T_2}{T_1}`:i<=4?String.raw`p_1V'=p_2V_2`:i===5?(q<.5?String.raw`p_1V_1\frac{T_2}{T_1}=p_2V_2`:String.raw`\frac{p_1V_1}{T_1}=\frac{p_2V_2}{T_2}`):String.raw`\frac{p_2}{p_1}=\frac{600}{300}=2`;
 drawing+=texBox(formula,80,345,840,80);
 return {diagram:drawing,equation:''};
}

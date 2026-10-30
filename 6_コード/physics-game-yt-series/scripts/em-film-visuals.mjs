// Scene-specific repairs. Existing diagrams remain the default.
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const cyan='#68d9ff',gold='#ffd269',white='#e6efff',purple='#bd9cff',dim='#96a7c5',green='#8be2b7';
const text=(x,y,s,c=white,z=15)=>`<text x="${x}" y="${y}" fill="${c}" font-size="${z}">${esc(s)}</text>`;
const line=(x,y,X,Y,c=dim,w=2,dash=false)=>`<line x1="${x}" y1="${y}" x2="${X}" y2="${Y}" stroke="${c}" stroke-width="${w}"${dash?' stroke-dasharray="5 5"':''}/>`;
const arrow=(x,y,X,Y,c=cyan)=>{const a=Math.atan2(Y-y,X-x),b=9;return line(x,y,X,Y,c,3)+`<path d="M${X-b*Math.cos(a-.45)},${Y-b*Math.sin(a-.45)} L${X},${Y} L${X-b*Math.cos(a+.45)},${Y-b*Math.sin(a+.45)}" fill="none" stroke="${c}" stroke-width="3"/>`;};
const circle=(x,y,r,c=gold,fill='none')=>`<circle cx="${x}" cy="${y}" r="${r}" stroke="${c}" fill="${fill}" stroke-width="2"/>`;
const rect=(x,y,w,h,c=dim)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${c}" stroke-width="2"/>`;
const wrap=s=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 220">${s}</svg>`;
const dots=(x,y,cols,rows)=>Array.from({length:cols*rows},(_,i)=>circle(x+i%cols*22,y+Math.floor(i/cols)*22,2,cyan,cyan)).join('');
const wave=(fn,c)=>`<polyline fill="none" stroke="${c}" stroke-width="3" points="${Array.from({length:181},(_,i)=>`${50+i*2.9},${112-55*fn(i/180*2*Math.PI)}`).join(' ')}"/>`;
export function repairedDiagram(clip,scene,local,captionIndex){
 const key=`${clip.stageId}:${scene.index+1}`,p=Math.min(1,Math.max(0,local/6));
 let s='';
 if(key==='ue-integrals:10'){
  s=text(15,23,'この例：E = α(x, y)。仕事は両端だけで決まる')+arrow(70,180,350,180,dim)+arrow(70,180,70,38,dim)+line(70,180,310,60,gold,3)+`<path d="M70 180 Q190 180 310 60" fill="none" stroke="${purple}" stroke-width="3"/>`+circle(70,180,5,white,white)+circle(310,60,5,white,white)+text(35,210,'始点 A',white)+text(312,48,'終点 B',white)+text(383,85,'金：直線の道',gold)+text(383,119,'紫：放物線の道',purple)+text(383,165,'始点・終点が同じ → 仕事は同じ',white,13)+circle(70+240*p,180-120*p*p,5,purple,purple);
 }else if(key==='um-line-element:12'){
  s=text(15,23,'力の大きさと移動距離を固定し、向きだけを比べる');
  for(const [x,a]of [[65,0],[355,Math.PI/2]]){
   s+=arrow(x,140,x+170,140,gold)+arrow(x,133,x+90*Math.cos(a),133-90*Math.sin(a),cyan)+text(x+30,164,'移動 Δr',gold)+text(x+15,200,a===0?'同じ向き：W = FΔr（最大）':'直角：W = 0',white,14);
  }
 }else if(key==='um-current-field:2'){
  s=text(15,23,'金色は選んだ周回経路。電流の線ではありません')+circle(235,114,72,gold)+circle(235,114,14,cyan)+circle(235,114,4,cyan,cyan)+arrow(307,112,307,66,gold)+text(345,69,'経路の正方向：反時計回り',gold)+text(345,104,'面の法線：手前向き ⊙',white)+text(345,142,'手前へ流れる電流を ＋ とする',cyan)+text(38,208,'右手の指を経路に沿って曲げる → 親指が法線',white,14);
 }else if(key==='um-magnetic-force:3'){
  s=text(15,24,'右手：四本の指を v から B へ曲げる')+arrow(125,169,125,52,green)+text(50,43,'親指：v × B',green)+arrow(170,138,330,138,gold)+text(286,166,'速度 v',gold)+text(340,91,'⊗ B（奥向き）',cyan,20)+`<path d="M126 155 L102 117 Q90 76 111 83 L137 125 L170 105 Q220 86 257 103 Q282 118 257 125 L190 125 Q251 114 269 132 Q278 147 250 149 L191 147 Q245 142 253 159 Q257 174 228 171 L164 173 Z" fill="#e6c69b33" stroke="#e6c69b" stroke-width="3"/>`+arrow(292,100,335,80,cyan)+text(70,205,'指は右向きから紙面の奥へ。親指は上向き。',white,15);
 }else if(['um-line-element:1','um-line-integral-entry:4'].includes(key)){
  const force=key==='um-line-integral-entry:4';
  s=text(15,24,force?'位置・力・移動は別のベクトルです':'位置・電場・移動は別のベクトルです')+arrow(45,185,570,185,dim)+arrow(45,185,45,40,dim)+text(30,206,'原点 O',dim);
  for(let y=65;y<175;y+=40)for(let x=95;x<540;x+=70)s+=arrow(x,y,x+27,y-10,cyan);
  const x=190+70*p,y=132-20*p;
  s+=arrow(45,185,x,y,white)+text(70,160,'位置 r',white)+circle(x,y,5,gold,gold)+arrow(x,y,x+88,y-34,gold)+text(x+40,y+24,'移動 Δr',gold)+arrow(x,y,x+25,y-40,cyan)+text(x-12,y-50,force?'代表点での力 F':'この点の電場 E',cyan);
 }else if(['ui-electric-potential:1'].includes(key)){
  s=text(20,25,'A から B へ移動：終点の電位 − 始点の電位')+circle(95,155,12,cyan)+circle(470,60,12,gold)+arrow(120,151,442,67,white)+circle(120+322*p,151-84*p,5,white,white)+text(55,192,'始点 A：1 V',cyan)+text(433,36,'終点 B：4 V',gold)+text(270,185,'ΔV = 4 − 1 = +3 V',gold,21);
 }else if(key==='ui-conduction:3'){
  s=text(20,25,'電圧 6 V、抵抗 3 Ω を固定して計算します')+rect(80,55,430,100)+rect(275,43,100,24,gold)+text(296,34,'R = 3 Ω',gold)+text(35,112,'6 V',cyan)+arrow(125,55,205,55,green)+text(120,40,'I = 2 A',green)+text(190,200,'I = 6 V ÷ 3 Ω = 2 A',gold,22)+circle(80+430*p,155,4,green,green);
 }else if(key==='ue-potential:4'){
  s=text(20,25,'遠方の電位を 0 として、距離 r の電位を求める')+circle(120,116,15,gold,gold)+text(112,122,'+', '#111',18)+arrow(142,116,545,116,cyan)+circle(300,116,5,white,white)+text(285,96,'P',white)+line(120,152,300,152,gold)+text(200,176,'r',gold)+text(410,94,'遠方：V → 0',dim)+text(275,205,'P の電位：V(r) = kQ/r',gold)+circle(540-240*p,116,4,purple,purple);
 }else if(key==='ue-potential:7'){
  s=text(15,22,'理想導線と、抵抗のある部分を区別します')+line(40,92,255,92,green,5)+text(30,62,'理想導線：R = 0',green)+text(30,128,'電流があっても ΔV = 0',green)+rect(345,78,245,28,gold)+arrow(365,92,560,92,cyan)+text(335,62,'抵抗：R > 0',gold)+text(345,128,'電流 I を流す電場 E',cyan)+text(345,162,'電圧降下の大きさ：RI',gold);
 }else if(key==='ue-capacitor:5'){
  const plugged=captionIndex>0;
  s=text(20,24,plugged?'電池を接続：電圧 V と間隔 d は一定':'電池を外す：板の電荷 Q は一定')+line(160,50,160,165,gold,6)+line(365,50,365,165,purple,6)+rect(190,55,145*p,105,green)+text(185,192,'緑：挿入する誘電体',green)+text(418,95,plugged?'電池から電荷が増える':'電圧が下がる',gold)+text(418,126,plugged?'板間 E = V/d は一定':'板間の電場 E は弱まる',cyan);
  for(let y=70;y<165;y+=35)s+=arrow(165,y,plugged?355:355-80*p,y,cyan);
 }else if(['ue-lorentz:2'].includes(key)){
  s=text(15,23,'コイルの左右に、紙面の奥・手前向きの力が働く')+rect(215,55,180,120,gold)+line(305,38,305,195,dim,1,true)+text(280,214,'回転軸',dim)+arrow(215,160,215,75,gold)+arrow(395,70,395,158,gold)+text(190,125,'⊗',green,35)+text(379,125,'⊙',green,35)+text(125,149,'F：奥へ',green)+text(405,149,'F：手前へ',green)+arrow(30,82,145,82,cyan)+text(35,60,'磁場 B',cyan);
 }else if(['ue-ampere:3','ui-current-field:2'].includes(key)){
  const a=p*2*Math.PI,cx=210,cy=112,r=70;
  s=text(18,23,'円形コイルの中心では、各部分の磁場の向きがそろう')+circle(cx,cy,r,gold)+circle(cx,cy,5,cyan,cyan)+line(cx,cy,cx+r*Math.cos(a),cy+r*Math.sin(a),white)+circle(cx+r*Math.cos(a),cy+r*Math.sin(a),6,gold,gold)+text(250,114,'R',white)+text(165,210,'電流 I の円形コイル',gold)+circle(cx,cy,12,cyan)+text(324,84,'⊙ 中心の磁場：手前向き',cyan)+text(324,118,'各区間 → 中心までの距離は R',white)+text(324,150,'同じ向きの dB を足す',cyan);
 }else if(['ue-ampere:4','ue-ampere:5','ue-ampere:6'].includes(key)){
  s=text(12,23,'長いコイルの中央：金色の長方形を一周する');
  for(let x=80;x<540;x+=27)s+=`<ellipse cx="${x}" cy="120" rx="12" ry="55" fill="none" stroke="${dim}" stroke-width="2"/>`;
  s+=rect(150,44,300,78,gold)+arrow(160,122,420,122,cyan)+text(175,145,'内部の辺：B × L',cyan)+text(175,36,'外部：B ≈ 0',dim)+text(460,84,'縦の辺：B と直角',white,12)+text(120,205,'面を横切る導線：nL 本　→　電流の合計：nLI',gold);
 }else if(key==='ue-faraday:2'){
  s=text(15,25,'二つの電圧は、正の向きの約束が違います')+line(85,110,545,110,dim)+text(210,109,'∿∿∿∿∿',gold,55)+arrow(85,68,170,68,green)+text(90,48,'電流 I',green)+text(183,152,'＋',gold,25)+text(440,152,'−',gold,25)+text(155,190,'端子電圧 V = L dI/dt',gold)+text(355,58,'起電力 ε = −L dI/dt',purple)+arrow(415,75,305,75,purple);
 }else if(['ue-transient:1','ue-transient:2','ue-transient:3','um-circuit-time:6'].includes(key)){
  const discharge=key==='um-circuit-time:6',isQ=discharge||key==='ue-transient:1',name=isQ?'電荷 q':'電流 I';
  s=text(15,24,discharge?'放電：電池を外し、抵抗を通じて電荷が減る':`${name} は 0 から最終値へ近づく`)+arrow(60,170,560,170,dim)+arrow(60,170,60,43,dim)+text(558,195,'時間 t',dim)+text(72,50,isQ?'電荷':'電流',gold)+line(60,60,550,60,dim,1,true)+text(561,65,discharge?'Q₀':'最終値',dim,12);
  const pts=Array.from({length:101},(_,i)=>`${60+i*4.8},${170-110*(discharge?Math.exp(-i/25):1-Math.exp(-i/25))}`).join(' ');
  s+=`<polyline points="${pts}" fill="none" stroke="${gold}" stroke-width="3"/>`+circle(60+480*p,170-110*(discharge?Math.exp(-4*p):1-Math.exp(-4*p)),5,white,white)+text(150,212,discharge?'q(t) = Q₀ exp(−t/RC)':'点線は最終値。曲線が現在の値。',gold);
  if(!discharge){const x=60+480*p,y=60+110*Math.exp(-4*p);s+=line(x,60,x,y,green,3)+text(Math.min(x+10,420),90,'残りの差 u',green,13);}
 }else if(key==='ui-circuit-time:3'){
  s=text(20,25,'理想コイル：電流が一定なら電圧は 0')+arrow(65,120,555,120,dim)+arrow(65,120,65,42,dim)+line(65,110,240,60,green,3)+line(240,60,550,60,green,3)+text(78,43,'電流 I',green)+text(435,91,'一定の電流',green)+text(320,184,'dI/dt = 0 → V = 0',gold,22)+circle(240+310*p,60,5,white,white);
 }else if(['ue-maxwell:4','ue-maxwell:5'].includes(key)){
  s=text(15,24,'xy 平面の小さな長方形を、反時計回りに積分する')+rect(180,55,250,105,gold)+arrow(190,160,410,160,gold)+arrow(430,150,430,65,gold)+arrow(420,55,200,55,gold)+arrow(180,65,180,150,gold)+arrow(158,132,158,85,cyan)+arrow(455,144,455,69,cyan)+text(70,42,'Eᵧ(x)',cyan)+text(445,42,'Eᵧ(x+dx)',cyan)+text(285,190,'幅 dx',gold)+text(477,118,'高さ dy',gold)+text(18,215,'Bz は紙面に垂直。左右の辺は逆向きに進む。',white)+dots(235,85,5,3);
 }else if(key==='um-capacitance:1'){
  s=text(15,25,'面電荷密度 σ = 板の電荷 Q ÷ 板の面積 S')+rect(110,52,180,125,gold)+dots(130,74,7,4)+text(125,205,'板の面積 S [m²]',gold)+text(350,81,'点は板上の電荷を表す',cyan)+text(350,116,'Q [C] を S [m²] で割る',white)+text(350,160,'σ の単位：C/m²',gold,20);
 }else if(['um-conduction:1','um-conduction:3'].includes(key)){
  const count=key.endsWith(':1');
  s=text(15,23,count?'数密度 n：1 m³ あたりの電子の個数':'断面を通る電子を、円柱の体積から数える');
  if(count)s+=rect(95,65,130,110,white)+rect(135,43,130,110,dim)+line(95,65,135,43)+line(225,65,265,43)+line(95,175,135,153)+line(225,175,265,153)+dots(117,85,4,4)+text(300,100,'電子の数 ÷ 体積 = n',gold,20)+text(300,135,'n の単位：個/m³',white)+text(120,205,'体積 1 m³ の例',dim);
  else s+=`<ellipse cx="155" cy="113" rx="25" ry="55" fill="none" stroke="${cyan}"/><ellipse cx="415" cy="113" rx="25" ry="55" fill="none" stroke="${cyan}"/>`+line(155,58,415,58,cyan)+line(155,168,415,168,cyan)+dots(175,80,10,4)+arrow(215,183,365,183,gold)+text(242,209,'長さ v Δt',gold)+text(53,115,'面積 S',cyan)+text(460,92,'体積：SvΔt',white)+text(460,126,'電子数：nSvΔt',white)+text(460,160,'電荷：enSvΔt',gold);
 }else if(['um-conduction:4','um-conduction:5'].includes(key)){
  s=text(20,24,'分岐点に電荷がたまらないとき、入る量 = 出る量')+arrow(90,110,290,110,cyan)+arrow(310,110,495,57,gold)+arrow(310,110,495,170,green)+circle(300,110,8,white,white)+text(150,93,'入る電流 I₁',cyan)+text(450,38,'出る電流 I₂',gold)+text(450,204,'出る電流 I₃',green)+text(150,199,'I₁ = I₂ + I₃',white,23);
 }else if(['um-magnetic-force:2','um-magnetic-force:3','ui-magnetic-force:2'].includes(key)){
  s=text(15,24,'同じ速度・同じ磁場で、電荷の正負を比較します');
  for(const [x,sign]of [[160,1],[465,-1]])s+=circle(x,115,13,sign>0?gold:purple)+text(x-5,120,sign>0?'+':'−',white)+arrow(x+20,115,x+95,115,green)+text(x+75,140,'v',green)+arrow(x,sign>0?97:133,x,sign>0?45:190,cyan)+text(x-25,sign>0?48:196,'F',cyan)+text(x-85,76,'× B',dim,22);
  s+=text(230,210,'B は紙面の奥。正電荷の力は上。',dim,13);
 }else if(key==='um-induction:1'){
  s=text(15,24,'静電場とは違い、一周の電場の仕事が 0 とは限らない')+circle(260,114,70,gold)+dots(220,80,4,4)+arrow(190,115,190,66,cyan)+arrow(330,114,330,162,cyan)+text(367,85,'面を通る磁束が時間で変わる',white)+text(367,120,'水色：誘導された電場',cyan)+text(367,155,'金色：閉じた経路',gold)+text(25,212,'点の模様は手前向きの磁場。動く粒子ではありません。',dim,12);
 }else if(key==='um-induction:3'){
  s=text(20,24,'各一周が囲む面の磁束 Φ が同じ場合');
  for(let i=0;i<4;i++)s+=`<ellipse cx="${150+i*40}" cy="112" rx="23" ry="66" fill="none" stroke="${gold}" stroke-width="2"/>`;
  s+=arrow(60,112,355,112,cyan)+text(372,82,'例：4 巻き',gold)+text(372,120,'鎖交磁束 Ψ = 4Φ',white)+text(372,160,'起電力も一巻きの 4 倍',green)+text(30,212,'N 巻きなら、Ψ = NΦ',gold);
 }else if(key==='um-induction:6'){
  const x=200+200*p;
  s=text(15,24,'動く棒とレールが囲む面積を調べます')+line(80,55,540,55,gold,3)+line(80,170,540,170,gold,3)+line(80,55,80,170,gold,3)+`<rect x="80" y="55" width="${x-80}" height="115" fill="${cyan}" opacity=".12"/>`+line(x,55,x,170,white,6)+arrow(x+12,110,x+65,110,green)+text(x+25,94,'v',green)+text(x-25,194,'棒の長さ l',white)+text(125,140,'面積 A = lx',cyan)+dots(105,76,4,2)+text(330,212,'dA/dt = lv → |起電力| = Blv',gold);
 }else if(['um-ac-maxwell:1','um-ac-maxwell:2','um-ac-maxwell:3','um-ac-maxwell:4'].includes(key)){
  const capacitor=key.endsWith(':4'),justCurrent=key.endsWith(':1');
  s=text(15,24,justCurrent?'横軸は時間。電流が周期的に向きを変えます':capacitor?'コンデンサ：電圧の最大は電流より 1/4 周期あと':'コイル：電圧の最大は電流より 1/4 周期さき')+arrow(40,112,590,112,dim)+wave(Math.sin,cyan)+text(595,135,'時間',dim,12)+text(62,47,'電流 I',cyan);
  if(!justCurrent)s+=wave(x=>(capacitor?-1:1)*Math.cos(x),gold)+text(185,47,'電圧 V',gold)+text(90,210,'波の高さは比較用にそろえています。',dim);
  s+=line(50+522*p,45,50+522*p,176,white,1,true);
 }
 return s?wrap(s):null;
}


// These examples announce fixed numbers. Finish their sweep, then retain that result.
export function diagramClock(step,local,captionIndex){
 const last={
  'uie-dir-work':3,'uie-path-recall':2.5,'uie-bent-total':3.4,
  'uie-path-total':4.1,'uie-tiles-total':4.1,'ume-sum-four-edges':3.85,
  'ume-loop-zero':4.1,'uie-tile-slider':4.5
 }[step.figure];
 if(last!==undefined)return captionIndex>0?last:Math.min(last,local*.8);
 return Math.min(16,local);
}

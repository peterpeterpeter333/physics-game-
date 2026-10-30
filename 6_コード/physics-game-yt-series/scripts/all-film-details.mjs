import {C,text,line,rect,circle,path,arrow,fmt,graph} from './all-film-visuals.mjs';
const L={intro:0,middle:1,advanced:2};
function impulse(p){const w=180+300*p,h=30000/w;return line(100,300,900,300)+line(100,300,100,65)+rect(180,300-h,w,h,C.gold,.3)+text('力 F',70,45)+text('時間 t',820,350)+text('同じ面積 = 同じ運動量の変化',240,65,29,C.gold)+text('時間幅が増えると、平均の力は小さくなる',180,375,25);}
function momentum(s,p){if(s===2)return impulse(p);return [1,3].map((mass,i)=>{const x=100+i*470,v=s===1?1-p:1;return rect(x+100*p,145,65+mass*15,65,C.cyan,.3)+text(`質量 ${mass} kg`,x,80,27)+arrow(x,265,x+80*v,265,C.gold,'同じ速度')+rect(x,310,90*mass*v,22,C.purple,.5)+text('運動量',x,370,25,C.purple);}).join('');}
function forcePair(s,p){return rect(170,155,160,90,C.cyan,.3)+rect(640,155,160,90,C.purple,.3)+text('物体 1',185,135,27,C.cyan)+text('物体 2',655,135,27,C.purple)+arrow(255,190,385,190,C.purple,'物体 2 から受ける力')+arrow(720,270,590,270,C.cyan,'物体 1 から受ける力')+(s>0?rect(130,100,730,215,C.gold,.03):'')+text('二本の力は、異なる物体に働く',230,45,28)+text(s>0?'二物体の式を足すと、内部の力が打ち消し合う':'一つの物体の図で、二本を相殺してはいけない',130,370,25);}
function current(l,s,p){
 if(l===1){return graph(v=>v/3,{xmax:12,ymax:4,xlabel:'電圧 V [V]',ylabel:'電流 I [A]',p:1})+circle(100+720*p,295-210*p,9,C.gold)+text('抵抗 3 Ω の例：I = V/3',260,45,28)+text('オームの法則を使う間は、抵抗 R を一定とする',140,370,24);}
 const parallel=s===1,w=240,R1=100,R2=200;return (parallel?path([[180,190],[310,190],[310,100],[710,100],[710,280],[310,280],[310,190]],C.dim,4)+line(710,190,840,190,C.dim,4)+rect(465,80,90,40,C.cyan,.3)+rect(465,260,90,40,C.purple,.3)+text('両方に同じ電圧 V',330,45,28)+text('枝の電流を足す',380,345,27):line(140,180,860,180,C.dim,4)+rect(310,160,100,40,C.cyan,.3)+rect(600,160,100,40,C.purple,.3)+arrow(150,250,850,250,C.gold,'同じ電流 I')+text('電圧の差は、それぞれの抵抗で加わる',230,65,27))+text('R₁',parallel?480:330,parallel?72:140,26,C.cyan)+text('R₂',parallel?480:620,parallel?255:140,26,C.purple)+circle(180+640*p,parallel?190:180,7,C.gold);
}
function power(l,s,p){const r=1+3*p;return [0,1].map(i=>{const x=100+470*i,P=i?1/r:r;return text(i?'電圧 V を一定に保つ':'電流 I を一定に保つ',x,65,27)+text(`抵抗 R = ${fmt(r)} 倍`,x,115,25,C.dim)+rect(x,160,70*P,80,[C.gold,C.cyan][i],.4)+text(`消費電力 ${fmt(P,2)} 倍`,x,300,26,[C.gold,C.cyan][i]);}).join('')+text('比較するときは、何を一定にしたかを確認する',160,375,25);}
function transmission(s,p){const v=1+p,I=1/v;return text('送る電力 P を一定にする',180,45,30)+[ ['電圧',v,C.gold],['電流',I,C.cyan],['電線の損失',I*I,C.red]].map(([label,value,c],i)=>text(`${label} ${fmt(value,2)} 倍`,120,120+i*95,27,c)+rect(450,90+i*95,180*value,35,c,.4)).join('');}
function fieldCenter(s,p){const ox=500,cy=190,d=200,x=450+100*p,E=1/(x-300)**2-1/(700-x)**2;return circle(300,cy,18,C.gold)+circle(700,cy,18,C.gold)+text('+Q',280,160,27,C.gold)+text('+Q',680,160,27,C.gold)+arrow(500,cy,595,cy,C.cyan,'左の電荷の電場')+arrow(500,cy+65,405,cy+65,C.purple,'右の電荷の電場')+circle(500,cy,8,C.green)+text('中央：電場は相殺して 0',260,65,29,C.green)+text('電位は足し算：V = kQ/r+kQ/r > 0',180,340,27,C.gold);}
function electron(l,s,p){
 if(l===0){const dots=Array.from({length:Math.floor(p*240)},(_,i)=>{const x=180+(i*137%650),prob=(1+Math.cos((x-180)*.057))/2;return (i*67%100)/100<prob?circle(x,110+(i*53%190),2.7,C.cyan):'';}).join('');return rect(140,85,720,235,C.dim,.04)+dots+text('電子を一個ずつ検出した位置',230,45,29)+text('点が蓄積すると、検出確率の縞が見える',180,365,26);}
 const n=3,R=120;return path(Array.from({length:181},(_,i)=>{const a=i/180*2*Math.PI,r=R+12*Math.sin(n*a-p*2*Math.PI);return[450+r*Math.cos(a),200+r*Math.sin(a)];}),C.cyan)+circle(450,200,10,C.gold)+text('一周に整数個の波長をつなぐ条件',180,45,28)+text('2πr = nλ',640,180,30,C.gold)+text('量子条件は、古典力学だけからは導けない',160,370,25);
}
function magnetLines(s,p){const n=p<.5?4:8;return [0,1].map(j=>{const number=j?n:4,x0=80+480*j;return Array.from({length:number},(_,i)=>arrow(x0+i*330/(number-1),265,x0+i*330/(number-1),125,C.cyan)).join('')+text(`描く線：${number} 本`,x0,75,26)+text('同じ磁場 B = 1 T',x0,325,26,C.gold);}).join('')+text('本数は描画の約束。物理量は磁場の値で比べる',130,375,24);}
function kinematic(l,s,p){const vals=[1,3];return vals.map((v0,i)=>{let x=100+470*i,v=v0+2*p;return text(`初速度 ${v0} m/s`,x,65,28)+rect(x+80*p+40*p*p,170,90,55,[C.cyan,C.purple][i],.35)+arrow(x+20,280,x+20+60*v,280,[C.cyan,C.purple][i],`速度 ${fmt(v)} m/s`)+text('同じ加速度',x,125,24,C.gold);}).join('')+text('同じ力でも、初速度が違えば速度は違う',180,375,26);}
function motionRecord(s,p){return [0,1,2,3,4].map(i=>circle(150+38*i*i,180,12,i<=p*4?C.cyan:C.dim,.8)+text(`${i} s`,135+38*i*i,240,21)).join('')+text('同じ 1 秒ごとの位置の記録',240,65,30)+circle(150+608*p*p,180,16,C.gold)+text('点の間隔が広い区間ほど、その 1 秒に長く進んだ',120,350,25);}
function released(p){const cx=370,cy=240,R=105;return `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${C.dim}" stroke-dasharray="5 5"/>`+line(cx,cy,cx,cy-R,C.dim,2,'4 6')+circle(cx+370*p,cy-R,11,C.gold)+arrow(cx,cy-R,cx+400,cy-R,C.cyan,'切れた瞬間の接線方向')+text('糸が切れた後：中心向きの張力はなくなる',130,55,27)+text('他の力を無視すると、物体は直線を進む',170,370,25);}
function velocityDifference(s,p){const a=.8*(1-p)+.05,O=[270,250],v1=[130,0],v2=[130*Math.cos(a),-130*Math.sin(a)];return arrow(...O,O[0]+v1[0],O[1]+v1[1],C.cyan)+text('前の速度',425,285,24,C.cyan)+arrow(...O,O[0]+v2[0],O[1]+v2[1],C.purple)+text('後の速度',425,145,24,C.purple)+arrow(O[0]+v1[0],O[1]+v1[1],O[0]+v2[0],O[1]+v2[1],C.gold)+text('先端どうしの差 Δv',595,230,25,C.gold)+text('始点をそろえて、先端から先端へ差を描く',150,45,27)+text('二本の長さが同じでも、向きが違えば差は 0 ではない',100,360,25);}
export function detailDiagram(c,s,p){const id=c.topicId,l=L[c.level],i=s.index;
 if(id==='t-firstlaw'&&l===0&&i!==1){return [0,1].filter(n=>i===2||n===0).map(n=>{const x=100+n*480,w=n?230:230+100*p;return rect(x,140,w,135,C.cyan,.14)+line(x+w,120,x+w,295,C.gold,7)+arrow(x+70,330,x+70,280,C.red,'熱')+text(n?'容器の大きさを固定':'気体がピストンを押す',x,75,26)+(!n?arrow(x+w+10,200,x+w+75,200,C.gold):'');}).join('');}
 if(id==='um-derivative'&&l===2&&c.family!=='advanced-followups'){const h=.9-.85*p;return line(140,300,850,300)+line(490,300,490,65)+path([[190,90],[490,300],[790,90]],C.cyan,3)+circle(490-300*h,300-210*h,8,C.purple)+circle(490+300*h,300-210*h,8,C.gold)+text('原点 0',455,345,25)+text('x',830,340,24)+text('y = |x|',120,50,28)+text('左の傾き −1',130,205,25,C.purple)+text('右の傾き +1',660,205,25,C.gold);}
 if(id==='um-integral'&&l===2){const end=.35+.5*p,X=130,Y=310,W=680,H=200,h=.07;return graph(x=>x,{x:X,y:Y,w:W,h:H,xlabel:'上端の位置 x',ylabel:'高さ f(x)',p:1})+path([[X,Y],[X+W*end,Y-H*end],[X+W*end,Y],[X,Y]],C.cyan,2,'#6adfff30')+rect(X+W*end,Y-H*end,W*h,H*end,C.gold,.4)+text('累積面積 A(x)',190,245,26,C.cyan)+text('追加した細い帯',600,70,25,C.gold)+text('帯の面積 ÷ 幅 → その場所の高さ',180,375,25);}
 if(id==='m-circular'&&l===0&&i===1)return released(p);
 if(id==='m1-acceleration'&&l===2&&i>0||id==='m-circular'&&l===1&&i===0)return velocityDifference(i,p);
 if(id==='m-momentum'&&l===0)return momentum(i,p);
 if(id==='m-force'&&l===2)return forcePair(i,p);
 if(id==='e-current'&&l>0)return current(l,i,p);
 if(id==='e-power'&&l>0)return l===1?power(l,i,p):transmission(i,p);
 if(id==='e-field'&&l===2)return fieldCenter(i,p);
 if(id==='a-bohr'&&l<2)return electron(l,i,p);
 if(id==='e-magnet'&&l===0&&i<2)return magnetLines(i,p);
 if(id==='uc-newton'&&l===0)return kinematic(l,i,p);
 if(id==='ui-motion-record')return motionRecord(i,p);
 return null;
}

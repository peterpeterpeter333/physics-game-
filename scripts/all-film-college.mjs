import {C,text,line,rect,circle,path,arrow,fmt,graph} from './all-film-visuals.mjs';
const L={intro:0,middle:1,advanced:2};
function projection(v){const [x,y,z]=v;return[410+105*(x*.84+z*.54),235-105*(y*.91-(-x*.54+z*.84)*.41)];}
const a3=(a,b,c,label='')=>arrow(...projection(a),...projection(b),c,label);
const p3=(points,c,fill='none')=>path(points.map(projection),c,2,fill);
function vector3(l,s,p){const a=[2,1.4,1],factor=s===1?1-p*(1-1/Math.hypot(...a)):1;return a3([0,0,0],[2.7,0,0],C.dim,'x')+a3([0,0,0],[0,1.5,0],C.dim,'y')+a3([0,0,0],[0,0,2.2],C.dim,'z')+a3([0,0,0],a.map(x=>x*factor),C.gold,s===1?'単位ベクトルへ':'ベクトル a')+p3([[0,0,0],[2,0,0],[2,1.4,0],[2,1.4,1]],C.cyan)+text('三つの成分から、長さと向きを求める',150,45,28)+text(s===1?'長さで割ると、向きは同じで長さが 1 になる':'視点は固定。三方向の成分を比較する',110,370,23);}
function surface(l,s,p,id){const th=p*Math.PI/2,u=[Math.cos(th),0,-Math.sin(th)],n=[Math.sin(th),0,Math.cos(th)],add=(a,b)=>a.map((v,i)=>v+b[i]),mul=(a,k)=>a.map(v=>v*k),v=[0,1,0];return [-.7,0,.7].map(x=>a3([x,-.5,-1.7],[x,-.5,1.6],C.cyan)).join('')+p3([add(u,v),add(mul(u,-1),v),mul(add(u,v),-1),add(u,mul(v,-1)),add(u,v)],C.gold,'#ffcf672a')+a3([0,0,0],mul(n,1.5),C.purple,'面の法線')+text(id==='ui-through-a-surface'?'流れに正面を向けた広さを比べる':'面積ベクトルは、面積と面の向きを表す',150,40,27)+text(`流れとの角度 ${fmt(th*180/Math.PI,0)}°`,660,115,23)+text('面積そのものは一定',660,170,23,C.gold)+text('矢印の長さは、面の寸法ではない',220,370,24,C.dim);}
function growing(l,s,p){if(l===2){const x=180,y=260,w=340,h=150,d=45*(1-.9*p);return rect(x,y-h,w,h,C.cyan,.2)+rect(x+w,y-h,d,h,C.gold,.35)+rect(x,y-h-d,w,d,C.purple,.4)+rect(x+w,y-h-d,d,d,C.red,.4)+text('x',330,300,28,C.cyan)+text('y',125,180,28,C.cyan)+text('dx',540,300,24,C.gold)+text('dy',125,100,24,C.purple)+text('増えた二本の帯：y dx と x dy',150,350,25)+text('角：dx dy',670,100,25,C.red);}
 const r=75+45*p;return `<circle cx="350" cy="205" r="${r}" fill="#6adfff20" stroke="${C.cyan}" stroke-width="3"/><circle cx="350" cy="205" r="75" fill="none" stroke="${C.dim}" stroke-dasharray="4 5"/>`+arrow(350,205,350+r,205,C.gold,'半径 r')+text('時間 t → 半径 r → 面積 A',180,45,30)+text('半径の変化率 dr/dt',620,145,24,C.gold)+text('面積の変化率 dA/dt',620,215,24,C.cyan)+text('面積は、半径を通じて時間とともに変わる',160,365,25);}
function energyGraph(l,s,p){return graph(v=>v*v/2,{xmax:4,ymax:8,xlabel:'速さ v',ylabel:'運動エネルギー K',p:1})+[1,2.7].map((v,i)=>{const next=Math.sqrt(v*v+2),xx=100+720*v/4,yy=295-210*v*v/16;return circle(xx,yy,7,[C.gold,C.purple][i])+arrow(xx,yy,xx,yy-210/8*p,[C.gold,C.purple][i])+line(xx,yy-210/8,100+720*next/4,yy-210/8,[C.gold,C.purple][i],2,'5 5');}).join('')+text('同じ仕事 → 同じエネルギー増加',350,35,26)+text('速さの増加は、最初の速さにも左右される',160,368,25);}
function workCurve(l,s,p){const th=.2+p*1.4,x=190+550*p,y=275-135*p*p;return path(Array.from({length:81},(_,i)=>{let u=i/80;return[190+550*u,275-135*u*u];}),C.dim)+circle(x,y,9,C.gold)+arrow(x,y,x+95,y-47*p,C.cyan,'移動 dr・速度 v')+arrow(x,y,x+65,y-100,C.red,'力 F')+text('力と、その場所での短い移動を組にする',150,45,28)+text('位置ベクトルではなく、移動ベクトルと内積を取る',140,360,24);}
function totalWork(l,s,p){return rect(130,120,270,40,C.cyan,.4)+text('引く力の仕事 +10 J',130,100,28,C.cyan)+rect(560,120,270,40,C.red,.4)+text('摩擦の仕事 −10 J',560,100,28,C.red)+arrow(400,220,560,220,C.gold,'合計 0 J')+rect(220+260*p,265,100,45,C.gold,.4)+text('台車の速さは変わらない',300,355,27);}
function potential(l,s,p){const hill=s===2,fn=x=>hill?1-(x-1)**2:(x-1)**2,X=.15+1.7*p,Y=fn(X),force=(hill?1:-1)*2*(X-1);return graph(fn,{xmax:2,ymax:1.3,xlabel:'位置 x',ylabel:'位置エネルギー U',p:1})+circle(100+360*X,295-210*Y/1.3,10,C.gold)+arrow(100+360*X,330,100+360*X+60*force,330,C.red,'力')+text('グラフの傾きと、力の向きは逆',350,35,26);}
function gravity(l,s,p){return line(160,85,890,85,C.dim)+line(160,65,160,340,C.dim)+path(Array.from({length:101},(_,i)=>{const r=.5+4*i/100;return[160+680*i/100,85+110/r];}),C.cyan)+text('U = 0（無限遠で近づく）',480,50,24,C.dim)+text('中心からの距離 r',640,125,23)+text('位置エネルギー U',115,365,23)+text('−GMm/r：有限の距離では負',330,330,27,C.gold)+circle(160+680*p,85+110/(.5+4*p),8,C.gold);}
function frameMotion(l,s,p){const d=120*p*p;return [0,1].map(i=>{let x=90+480*i;return rect(x,120,350,130,C.dim,.05)+text(i?'加速する車内から':'地面から',x,65,28)+rect(x+120+(i?-d:0),190,50,40,C.gold,.4)+arrow(x+220,105,x+300,105,C.cyan,i?'見かけの力 −mA':'車の加速度 A')+text(i?'物体は後ろへずれる':'接触力なしなら物体は等速',x,310,22);}).join('');}
function smallAngle(l,s,p){const th=.8-.75*p,R=135,cx=350,cy=205;return `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${C.dim}"/>`+line(cx,cy,cx+R,cy)+line(cx,cy,cx+R*Math.cos(th),cy-R*Math.sin(th),C.gold,3)+line(cx+R*Math.cos(th),cy,cx+R*Math.cos(th),cy-R*Math.sin(th),C.cyan,5)+text(`θ = ${fmt(th,3)} rad`,640,110,28,C.gold)+text(`sin θ = ${fmt(Math.sin(th),3)}`,640,165,28,C.cyan)+text('角度を小さくすると、差が小さくなる',180,370,25);}
function cross(l,s,p){const th=.4+1.5*p,sign=s===1&&p>.5?-1:1,A=[1.8,0,0],B=[1.4*Math.cos(th),1.4*Math.sin(th),0],D=A.map((x,i)=>x+B[i]);return p3([[0,0,0],A,D,B,[0,0,0]],C.dim,'#83ecc025')+a3([0,0,0],A,C.cyan,'a')+a3([0,0,0],B,C.purple,'b')+a3([0,0,0],[0,0,sign*1.8*1.4*Math.sin(th)],C.gold,sign>0?'a × b':'b × a')+text('二本の矢印が作る平面に垂直なベクトル',160,40,27)+text('順序を逆にすると、向きが反転する',230,370,25);}
function sphereSlice(s,p){const z=-.85+1.7*p,a=Math.sqrt(1-z*z),ring=Array.from({length:65},(_,i)=>{let t=i/64*Math.PI*2;return[a*Math.cos(t),z,a*Math.sin(t)];});return [0,Math.PI/2].map(yaw=>p3(Array.from({length:65},(_,i)=>{let t=i/64*2*Math.PI;return[Math.cos(t)*Math.cos(yaw),Math.sin(t),Math.cos(t)*Math.sin(yaw)];}),C.dim)).join('')+p3(ring,C.gold,'#ffcf6740')+a3([0,-1.4,0],[0,1.5,0],C.cyan,'回転軸 z')+text('球を、軸に垂直な薄い円板へ分ける',150,45,28)+text('円板半径² = 球半径² − 高さ²',570,185,24,C.gold)+text('a² = R²−z²',610,240,29,C.gold);}
function signedArea(l,s,p){return line(140,200,850,200)+line(140,45,140,325)+rect(140,100,250,100,C.cyan,.3)+rect(390,200,250,80,C.red,.3)+circle(140+500*p,p<.5?100:280,8,C.gold)+text('速度 v',85,35)+text('時間 t',790,245)+text('正：右への変位',150,80,25,C.cyan)+text('負：左への変位',460,315,25,C.red)+text('変位は符号付きで足す。道のりは大きさを足す',140,370,24);}
export function collegeDiagram(c,s,p){const l=L[c.level],i=s.index,id=c.topicId;
 if(id==='uc-work'&&l===2&&i===0){
  const x=190+350*p,y=250-90*p*p;
  return path(Array.from({length:61},(_,j)=>{const u=j/60;return[190+350*u,250-90*u*u];}),C.dim)
   +circle(x,y,8,C.gold)+arrow(x,y,x+100,y-52*p,C.cyan,'速度 v')
   +arrow(x,y+50,x+40,y+50-21*p,C.gold,'短い移動 dr')
   +arrow(x,y,x+25,y-95,C.red,'力 F')
   +text('力と移動：小さな仕事 dW = F・dr',130,40,26,C.gold)
   +text('力と速度：仕事率 P = F・v',130,375,26,C.cyan)
   +text('dr = v dt',710,190,28,C.gold)+text('dW = P dt',710,245,28,C.cyan);
 }
 if(id==='um-cross')return cross(l,i,p);
 if(c.id==='uc-rigid1-advanced-followups-5'&&i>0)return sphereSlice(i,p);
 if(id==='um-rules')return growing(l,i,p);
 if(id==='um-vector'&&l===1)return vector3(l,i,p);
 if(id==='um-vector'&&l===2)return workCurve(l,i,p);
 if(id==='um-taylor'&&l===0||c.id==='um-derivative-advanced-followups-4'&&i===1)return smallAngle(l,i,p);
 if(id==='um-integral'&&l===0)return signedArea(l,i,p);
 if(id==='ui-through-a-surface'||id==='um-area-vector'&&i<2)return surface(l,i,p,id);
 if(id==='ui-energy-change')return energyGraph(l,i,p);
 if(id==='uc-work')return l===0?totalWork(l,i,p):l===1?energyGraph(l,i,p):workCurve(l,i,p);
 if(id==='um-path-pieces'||id==='um-work-vector')return workCurve(l,i,p);
 if(id==='uc-potential'&&l===1)return potential(l,i,p);
 if(id==='uc-potential'&&l===2)return gravity(l,i,p);
 if(id==='uc-frontier'&&l<2)return frameMotion(l,i,p);
 return null;
}

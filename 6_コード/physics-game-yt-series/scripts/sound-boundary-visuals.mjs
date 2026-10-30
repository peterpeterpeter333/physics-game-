import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const tau=2*Math.PI;
const pipe=(x,y,L,h,closed=false)=>line(x,y,x+L,y,C.dim,5)+line(x,y+h,x+L,y+h,C.dim,5)+(closed?line(x,y,x,y+h,C.dim,7):'');
const profile=(x,y,w,a,fn,c=C.cyan)=>path(Array.from({length:181},(_,i)=>{const z=i/180;return[x+w*z,y-a*fn(z)];}),c,4);
const air=(x,y,L,u,fn,c=C.cyan)=>Array.from({length:21},(_,i)=>{const z=i/20;return [y-35,y,y+35].map(Y=>circle(x+L*z+18*fn(z)*Math.cos(tau*u),Y,i===0||i===20?7:4,c)).join('');}).join('');
const bracket=(a,b,y,label,c=C.gold)=>line(a,y,b,y,c,2)+line(a,y-7,a,y+7,c,2)+line(b,y-7,b,y+7,c,2)+text(label,(a+b)/2-55,y-15,25,c);
export const soundBoundaryKinds=['soundprep-reflection','soundprep-closed-pressure','soundprep-open-pressure','soundprep-quarter-wave','soundprep-beat-count','soundmiddle-closed-end','soundmiddle-open-end','soundmiddle-wavelengths','soundmiddle-frequency-ratio','soundinsert-half-metre'];
export function soundBoundaryDiagram(kind,p){
 if(!soundBoundaryKinds.includes(kind))throw Error(kind);const u=clamp(p),a=Math.cos(tau*u);
 if(kind==='soundprep-reflection'){
  const incoming=180+1740*u,returning=2100-incoming;
  const pulse=(x,center)=>Math.exp(-Math.pow((x-center)/95,2));
  return text('閉じた壁では、入る圧力の波と戻る波が重なる',105,35,31)+pipe(110,180,940,190)+line(1050,180,1050,370,C.gold,7)
   +profile(110,300,940,45,z=>pulse(110+940*z,incoming),C.cyan)
   +profile(110,300,940,45,z=>pulse(110+940*z,returning),C.purple)
   +profile(110,300,940,45,z=>pulse(110+940*z,incoming)+pulse(110+940*z,returning),C.gold)
   +arrow(300,120,410,120,C.cyan)+text('入る波',155,130,26,C.cyan)+arrow(900,120,790,120,C.purple)+text('戻る波',940,130,26,C.purple)
   +text('閉じた壁',990,420,28,C.gold)+text('黄色：二つを足した圧力の変化',330,465,28,C.gold)+text('単発の波で反射を確認。繰り返す波では定常波を作れる',130,505,26);
 }
 if(kind==='soundprep-closed-pressure')return text('閉じた端：空気の移動はゼロでも、圧力は変わる',80,35,31)+pipe(230,170,770,170,true)+air(230,255,770,u,z=>Math.sin(Math.PI*z/2))+circle(230,255,11,C.red)+text('壁',200,125,29)+text('変位の節',115,390,28,C.red)+line(470,420,890,420,C.dim,2)+arrow(680,420,680-140*a,420,C.gold)+text('低い',365,428,26,C.dim)+text('高い',915,428,26,C.gold)+text('壁の圧力：高い・低いを繰り返す',430,465,28,C.gold)+text('同じ場所でも、変位の節と圧力変化の腹は両立する',175,505,25);
 if(kind==='soundprep-open-pressure')return text('開いた端：圧力は外と同じでも、空気は動ける',100,35,31)+pipe(200,165,720,180,true)+air(200,255,720,u,z=>Math.sin(Math.PI*z/2))+line(920,120,920,410,C.gold,2,'7 6')+circle(920+18*a,255,12,C.gold)+text('開いた端',865,95,29,C.gold)+text('外の空気',985,255,27)+arrow(875,425,965,425,C.gold)+text('変位の腹：前後に大きく往復',650,475,27,C.gold)+text('圧力の変化は小さい → 圧力変化の節',300,505,26);
 if(kind==='soundprep-quarter-wave')return text('片閉じの基本振動：節から、最初の腹まで',160,35,31)+profile(180,270,900,90,z=>Math.sin(tau*z)*a,C.dim)+profile(180,270,225,90,z=>Math.sin(Math.PI*z/2)*a,C.gold)+line(180,145,180,395,C.red,3,'7 6')+line(405,145,405,395,C.gold,3,'7 6')+circle(180,270,10,C.red)+circle(405,270-90*a,10,C.gold)+bracket(180,1080,120,'一波長')+bracket(180,405,435,'管の長さ')+text('節',165,380,28,C.red)+text('腹',390,380,28,C.gold)+text('縦は横向きの変位。灰色は周期を読むための延長',190,505,27);
 if(kind==='soundprep-beat-count'){const t=u;return text('見やすく遅くした模型：5回と7回では、1秒で2回差がつく',35,35,29)+[5,7].map((f,i)=>{const x=330+530*i,y=260,phase=tau*f*t;return `<circle cx="${x}" cy="${y}" r="90" fill="none" stroke="${C.dim}" stroke-width="2"/>`+arrow(x,y,x+80*Math.cos(phase),y-80*Math.sin(phase),i?C.purple:C.cyan)+text(f+' Hz',x-45,135,32,i?C.purple:C.cyan)+text((f*t).toFixed(1)+' 回ぶん',x-75,395,29);}).join('')+text('経過時間：'+t.toFixed(2)+' 秒',420,470,30,C.gold)+text('針は振動の進み具合。5 Hzと7 Hzを聞かせる図ではない',140,505,26);}
 if(kind==='soundmiddle-closed-end')return text('閉じた端では、壁に垂直な空気の移動が止まる',130,35,31)+pipe(260,170,760,180,true)+air(260,260,760,u,z=>Math.sin(Math.PI*z/2))+circle(260,260,12,C.red)+arrow(160,260,225,260,C.red)+text('壁',225,115,30)+text('壁の位置の空気は、前後に動けない',210,440,31,C.red)+text('空気の変位の節。管を横から見た断面の模式図',230,505,27);
 if(kind==='soundmiddle-open-end')return text('開いた端では、空気が前後に大きく動く',230,35,31)+pipe(170,165,770,180,true)+air(170,255,770,u,z=>Math.sin(Math.PI*z/2))+line(940,125,940,390,C.gold,2,'7 6')+circle(940+18*a,255,13,C.gold)+arrow(900,420,980,420,C.gold)+text('外の空気',1000,260,27)+text('端の圧力は、ほぼ外の圧力',180,440,29)+text('開いた端は変位の腹。圧力変化の腹ではない',250,505,27,C.gold);
 if(kind==='soundmiddle-wavelengths')return text('同じ管の長さに、どの部分の波が入るか',200,35,31)+[0,1].map(i=>{const x=180,L=220,y=190+i*235,lambda=i?440:880,fn=z=>i?Math.cos(tau*z):Math.sin(tau*z);return profile(x,y,lambda,50,z=>fn(z)*a,C.dim)+profile(x,y,L,50,z=>fn(z*L/lambda)*a,i?C.purple:C.gold)+line(x,y-70,x,y+65,C.dim,2,'6 6')+line(x+L,y-70,x+L,y+65,C.dim,2,'6 6')+bracket(x,x+lambda,y-95,i?'一波長（両開き）':'一波長（片閉じ）')+text(i?'腹':'節',x-15,y+75,26)+text('腹',x+L-15,y+75,26)+text(i?'管に半波長':'管に四分の一波長',650,y+(i?45:80),28,i?C.purple:C.gold);}).join('')+text('灰色は波長を読むための延長',650,505,24,C.dim);
 if(kind==='soundmiddle-frequency-ratio')return text('同じ長さ・同じ音速：片閉じは、振動が半分の回数',65,35,30)+[0,1].map(i=>{const y=205+i*195;return line(220,y,1090,y,C.dim,2)+profile(220,y,850,50,z=>Math.sin(tau*(i?2:1)*(z-u)),i?C.purple:C.gold)+text(i?'両開き':'片閉じ',55,y,30,i?C.purple:C.gold);}).join('')+text('同じ一点の変位を時間に沿って記録',280,110,28)+text('両方の横軸は時刻。比べる時間の長さは同じ',265,505,26);
 if(kind==='soundinsert-half-metre')return text('長さはどちらも0.5 m。端の条件で波長が変わる',115,35,31)+[0,1].map(i=>{const x=230,L=300,y=180+i*235,fn=z=>i?Math.cos(Math.PI*z):Math.sin(Math.PI*z/2);return line(x,y,x+L,y,C.dim,2)+profile(x,y,L,55,z=>fn(z)*a,i?C.purple:C.gold)+line(x,y-65,x,y+65,C.dim,2)+line(x+L,y-65,x+L,y+65,C.dim,2)+bracket(x,x+L,y+80,'0.5 m')+text(i?'両開き':'片閉じ',60,y,28,i?C.purple:C.gold)+text(i?'この部分が半波長':'この部分が四分の一波長',650,y,29,i?C.purple:C.gold);}).join('');
}
export function soundBoundaryFrame(c,s,t){return c.visualPilot==='sound-boundaries-v1'?authoredMotionFrame(c,s,t,soundBoundaryDiagram):null;}

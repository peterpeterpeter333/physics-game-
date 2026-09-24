import {C,text,line,circle,arrow,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const mark=(x,y,label)=>circle(x,y,25,C.gold,.23)+text('+',x-12,y+11,36,C.gold)+text(label,x-30,y+63,28);
export const coulombPrerequisiteKinds=['cprep-distance','cprep-testcharge','cprep-add','cprep-cancel'];
export function coulombPrerequisiteDiagram(kind,p){if(!coulombPrerequisiteKinds.includes(kind))throw Error(kind);const u=clamp(p/.75);
 if(kind==='cprep-distance')return text('二つの比較図では、電荷は同じ。距離だけ違う',75,40,31)+mark(250,170,'Q')+mark(550,170,'q')+arrow(585,170,785,170,C.red)+line(250,250,550,250,C.dim,2)+text('距離 r',340,280,28)+mark(250,350,'Q')+mark(850,350,'q')+arrow(885,350,885+50*u,350,C.red)+text('距離 2r',500,420,28)+text('上の力を1とすると、下の力は1/4',375,500,28);
 if(kind==='cprep-testcharge'){const factor=1+u;return text('同じ場所で、試験電荷だけを増やす',235,40,31)+mark(210,245,'元のQ')+circle(650,245,25*Math.sqrt(factor),C.gold,.25)+text('+',637,257,36,C.gold)+arrow(705,245,705+130*factor,245,C.red)+text(`試験電荷 ${factor.toFixed(1)} 倍`,495,350,29)+text(`力も ${factor.toFixed(1)} 倍`,760,180,29,C.red)+text('距離は一定。力÷試験電荷は同じ値',305,480,29,C.cyan);}
 if(kind==='cprep-add')return text('各電荷が、同じ観測点に作る電場を取り出す',120,40,31)+mark(240,290,'Q₁')+mark(960,290,'Q₂')+circle(600,290,9,C.ink)+arrow(600,205,600+160*u,205,C.cyan)+arrow(600,365,600-160*u,365,C.purple)+line(600,170,600,405,C.dim,2,'5 6')+text('左の電荷から',300,130,29,C.cyan)+text('右の電荷から',630,450,29,C.purple)+text('中央の点の電場を、見分けるため上下にずらして描いた',105,505,26);
 if(kind==='cprep-cancel'){const right=160+100*u;return text('反対向きの矢印を足すと、差が残る',220,40,32)+arrow(470,170,470+right,170,C.cyan)+arrow(470+right,230,470+right-160,230,C.purple)+line(470,135,470,425,C.dim,2,'5 6')+(u<.02?circle(470,365,7,C.gold):arrow(470,365,470+100*u,365,C.gold))+text('右向きの電場',100,175,29,C.cyan)+text('左向きの電場',810,235,29,C.purple)+text('合計の電場',220,370,30,C.gold)+text(u<.02?'同じ大きさなら、合計はゼロ':'右向きが大きいので、右向きに差が残る',285,480,29);}
}
export function coulombPrerequisiteFrame(c,s,t){return c.visualPilot==='coulomb-prerequisite-v1'?authoredMotionFrame(c,s,t,coulombPrerequisiteDiagram):null;}

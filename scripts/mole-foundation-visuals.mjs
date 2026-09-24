import {C,text,line,circle,arrow,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const box=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${c}" fill-opacity=".1" stroke="${c}" stroke-width="3"/>`;
export const moleFoundationKinds=['mole-counting','mole-mass-bundles','mole-coefficient-scale'];
export function moleFoundationDiagram(kind,p){
 if(!moleFoundationKinds.includes(kind))throw Error(kind);const u=clamp(p/.8);
 if(kind==='mole-counting')return text('粒子一個ずつの数と、まとまりの数を区別する',165,35,31)+Array.from({length:24},(_,i)=>{const group=Math.floor(i/12),j=i%12,x0=140+(i%8)*125,y0=145+Math.floor(i/8)*100,x1=220+group*550+j%4*75,y1=160+Math.floor(j/4)*80;return circle(x0+(x1-x0)*u,y0+(y1-y0)*u,9,C.cyan);}).join('')+`<g opacity="${u}">`+box(160,100,370,300,C.gold)+box(710,100,370,300,C.gold)+text('1 mol',280,455,36,C.gold)+text('1 mol',830,455,36,C.gold)+'</g>'+text('箱の粒は省略図。一箱は実際には約6.02×10²³個',200,505,27);
 if(kind==='mole-mass-bundles')return text('同じ1 molでも、物質の種類によって質量は違う',140,35,31)+[0,1].map(i=>{const x=100+i*610,c=i?C.gold:C.cyan;return box(x,115,360,255,c)+Array.from({length:12},(_,j)=>circle(x+55+j%4*80,165+Math.floor(j/4)*75,8,c)).join('')+text(i?'種類B：一個が重い':'種類A：一個が軽い',x+10,85,28,c)+line(x+45,435,x+315,435,C.dim,3)+box(x+50,385,100+100*i*u,45,c)+text(i?'1 molあたりの質量：大':'1 molあたりの質量：小',x,490,28,c);}).join('');
 if(kind==='mole-coefficient-scale')return text('同じ気体を、個数で数えるか、モルで数えるか',150,35,31)+box(400,155,400,230,C.cyan)+Array.from({length:24},(_,i)=>circle(435+i%6*65,195+Math.floor(i/6)*50,6,C.cyan)).join('')+arrow(130,265,360,265,C.gold)+arrow(840,265,1070,265,C.purple)+circle(130+230*u,265,9,C.gold)+circle(840+230*u,265,9,C.purple)+text('一個に対応',55,190,29,C.gold)+text('係数 k_B',65,345,32,C.gold)+text('一モルに対応',875,190,29,C.purple)+text('係数 R',925,345,32,C.purple)+text('同じ粒子の集まり。定数は数え方に合わせて使い分ける',160,485,28);
}
export function moleFoundationFrame(c,s,t){return c.visualPilot==='mole-foundations-v1'?authoredMotionFrame(c,s,t,moleFoundationDiagram):null;}

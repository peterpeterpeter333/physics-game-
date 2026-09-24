import {C,text,line,circle,arrow,path,clamp} from './all-film-visuals.mjs';
import {authoredMotionFrame} from './motion-foundation-visuals.mjs';
const plate=(x,y,h,c)=>path([[x-25,y-h/2-20],[x+25,y-h/2+20],[x+25,y+h/2+20],[x-25,y+h/2-20],[x-25,y-h/2-20]],c,3,c+'22');
function signs(x,y,n,positive){return Array.from({length:n},(_,i)=>text(positive?'+':'−',x-9,y-85+i*32,27,positive?C.gold:C.purple)).join('');}
function pair(x,y,n=5){return plate(x-120,y,230,C.gold)+plate(x+120,y,230,C.purple)+signs(x-120,y,n,true)+signs(x+120,y,n,false);}
function circuit(p){const u=clamp(p/.75),a=clamp(u*2),b=clamp(u*2-1);return pair(600,290,Math.floor(6*u))+path([[480,290],[280,290],[280,100],[520,100]],C.dim,3)+path([[680,100],[920,100],[920,290],[720,290]],C.dim,3)+`<rect x="520" y="65" width="160" height="70" rx="9" fill="#101c2a" stroke="${C.cyan}" stroke-width="3"/>`+text('電池',560,112,31,C.cyan)+text('+',525,56,26,C.gold)+text('−',655,56,26,C.purple)+circle(440-150*a,290,8,C.cyan)+circle(910,120+150*b,8,C.cyan)+arrow(440,315,315,315,C.cyan)+arrow(895,175,895,265,C.cyan);}
export const capacitorIntroKinds=['capintro-charge','capintro-insulation','capintro-voltage','capintro-compare'];
export function capacitorIntroDiagram(kind,p){if(!capacitorIntroKinds.includes(kind))throw Error(kind);const u=clamp(p/.75);
 if(kind==='capintro-charge')return text('外側の導線を通じて、左の板から電子を取り去り、右へ加える',20,35,28)+circuit(p)+text('電子が不足：正',270,450,28,C.gold)+text('電子が余る：負',740,450,28,C.purple)+text('青い点は導線中の電子。電荷の数は模式的に表示',220,505,27);
 if(kind==='capintro-insulation')return text('二枚の板の間は絶縁され、電子は横切らない',130,35,31)+circuit(p)+`<rect x="530" y="185" width="140" height="205" fill="${C.cyan}" opacity=".08"/>`+text('絶縁体',550,260,29)+text('電子は',550,310,27)+text('通らない',540,350,27)+text('板の間を流れる電子の図ではない。電荷は外側の回路で移る',70,495,28);
 if(kind==='capintro-voltage'){const n=Math.floor(6*u);return text('同じ大きさの正と負の電荷が、二枚の板に分かれる',55,40,30)+pair(410,270,n)+text('+Q',250,445,34,C.gold)+text('−Q',495,445,34,C.purple)+line(780,390,1100,390,C.dim,3)+line(780,390,780,115,C.dim,3)+path([[780,390],[780+280*u,390-240*u]],C.cyan,4)+circle(780+280*u,390-240*u,8,C.gold)+text('電圧 V',805,95,28)+text('片方の電荷 Q',850,440,27)+text('電荷の合計は0でも、正と負を分けて蓄えている',255,505,28);}
 if(kind==='capintro-compare')return text('同じ電圧で比較：容量二倍なら、片方の電荷も二倍',70,40,30)+text('容量 C',250,115,32,C.cyan)+text('容量 2C',850,115,32,C.cyan)+pair(310,285,3)+pair(910,285,6)+text('同じ電圧 V',220,475,29,C.gold)+text('同じ電圧 V',830,475,29,C.gold)+`<g opacity="${u}">`+text('±Q',280,285,36)+text('±2Q',860,285,36)+'</g>'+text('容量の違う2種類を模式表示。図の寸法は実際の寸法ではない',170,505,23);
}
export function capacitorIntroFrame(c,s,t){return c.visualPilot==='capacitor-intro-v1'?authoredMotionFrame(c,s,t,capacitorIntroDiagram):null;}

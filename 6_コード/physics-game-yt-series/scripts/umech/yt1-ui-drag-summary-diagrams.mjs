// 大学編「空気抵抗・初級・要点」(ys-ui-drag-summary) — 図。Stage 1200×515.
// 詳しい動画 1/2・2/2 の図をそのまま呼び出す（同じ数値・同じ色）。足りない 結論・締めのカードだけ ここで描く。
// 色：力 F 緑、速度 v 紫、加速度 a 赤、時刻 t 金、終端速度・強調 黄。
import {C,seg,fade,label,rect,tex} from './anim.mjs';
import {ytUiDrag1Diagrams as V1} from './yt1-ui-drag-1-diagrams.mjs';
import {ytUiDrag2Diagrams as V2} from './yt1-ui-drag-2-diagrams.mjs';

const K='ui-drag-summary:';
const get=(M,id,k)=>{const f=M[id+':'+k];if(!f)throw new Error('missing '+id+':'+k);return f;};
const v1=k=>get(V1,'ui-drag-1',k),v2=k=>get(V2,'ui-drag-2',k);
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});

const goal=(p,second)=>{
 let s=card(80,60,500,330,label('つり合い（合力 0）',330,125,{size:30,color:C.ink,anchor:'middle',weight:700})
  +label('止まらず、同じ速度で 落ち続ける',330,340,{size:26,color:C.v,anchor:'middle',weight:700}),second?1:seg(p,.02,.18));
 s+=fade(second?1:seg(p,.3,.45),T(cs(C.a,'a')+'=0',330,235,{size:56}));
 s+=card(620,60,500,330,label('終端速度',870,125,{size:30,color:C.ink,anchor:'middle',weight:700})
  +label('抵抗 R ＝ kv の モデル',870,340,{size:26,color:C.dim,anchor:'middle'}),second?seg(p,.05,.25):0,C.hi);
 s+=fade(second?seg(p,.3,.5):0,T(cs(C.hi,'v_\\infty')+'=\\dfrac{mg}{k}',870,235,{size:56}));
 return s;
};

export const ytUiDragSummaryDiagrams={
 [K+'goal']:(p)=>goal(p,0),
 [K+'goal2']:(p)=>goal(p,1),
 [K+'assume']:v1('assume'),
 [K+'tip']:v1('tip'),
 [K+'reason']:v1('row4b'),
 [K+'answer']:v1('answer'),
 [K+'arrows']:v1('arrows'),
 [K+'eq1']:v2('eq1'),
 [K+'eq2']:v2('eq2'),
 [K+'eq3']:v2('eq3'),
 [K+'setup']:v2('setup'),
 [K+'num']:v2('num'),
 [K+'arrows2']:v2('arrows'),
 [K+'table']:v2('row3'),
 [K+'gap']:v2('gap'),
 [K+'zero']:v2('zero'),
 [K+'book']:v1('book'),
 [K+'sum']:v2('sum1'),
 [K+'caveat']:v2('caveat'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

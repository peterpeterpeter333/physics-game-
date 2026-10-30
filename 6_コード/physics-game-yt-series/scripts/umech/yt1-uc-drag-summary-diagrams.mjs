// 大学編「空気抵抗・上級・要点」(ys-uc-drag-summary) — 図。Stage 1200×515.
// 詳しい動画 1/2・2/2 の図をそのまま呼び出す（同じ数値・同じ色）。足りない 結論・締めのカードだけ ここで描く。
// 色：力 F 緑、速度 v 紫、加速度 a 赤、時刻 t・τ 金、終端速度・差 w・強調 黄。
import {C,seg,fade,label,rect,tex} from './anim.mjs';
import {ytUcDrag1Diagrams as V1} from './yt1-uc-drag-1-diagrams.mjs';
import {ytUcDrag2Diagrams as V2} from './yt1-uc-drag-2-diagrams.mjs';

const K='uc-drag-summary:';
const get=(M,id,k)=>{const f=M[id+':'+k];if(!f)throw new Error('missing '+id+':'+k);return f;};
const v1=k=>get(V1,'uc-drag-1',k),v2=k=>get(V2,'uc-drag-2',k);
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});

const goal=(p,second)=>{
 let s=card(40,60,540,330,label('抵抗 kv の モデル',310,125,{size:30,color:C.ink,anchor:'middle',weight:700})
  +label('変数分離で 最後まで 解ける',310,340,{size:26,color:C.dim,anchor:'middle'}),second?1:seg(p,.02,.18));
 s+=fade(second?1:seg(p,.3,.45),T(cs(C.v,'v')+'='+cs(C.hi,'v_\\infty')+'+('+cs(C.v,'v_0')+'-'+cs(C.hi,'v_\\infty')+')\\,e^{-t/'+cs(C.t,'\\tau')+'}',310,235,{size:36}));
 s+=card(620,60,540,330,label('抵抗 cv² の モデル',890,125,{size:30,color:C.ink,anchor:'middle',weight:700})
  +label('途中まで 勢いよく 加速',890,340,{size:26,color:C.dim,anchor:'middle'}),second?seg(p,.05,.25):0,C.hi);
 s+=fade(second?seg(p,.3,.5):0,T(cs(C.hi,'v_\\infty')+'=\\sqrt{\\dfrac{mg}{c}}',890,235,{size:50}));
 return s;
};

export const ytUcDragSummaryDiagrams={
 [K+'goal']:(p)=>goal(p,0),
 [K+'goal2']:(p)=>goal(p,1),
 [K+'model']:v1('model'),
 [K+'rewrite']:v1('rewrite'),
 [K+'init']:v1('init'),
 [K+'sol']:v1('sol'),
 [K+'match']:v1('match'),
 [K+'term3']:v2('term3'),
 [K+'ex']:v1('ex'),
 [K+'eight']:v1('eight'),
 [K+'sky2']:v2('sky2'),
 [K+'half2']:v2('half2'),
 [K+'updown']:v2('updown'),
 [K+'abs']:v2('abs'),
 [K+'lesson']:v2('lesson'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

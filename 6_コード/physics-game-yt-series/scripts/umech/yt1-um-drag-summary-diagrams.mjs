// 大学編「空気抵抗・中級・要点」(ys-um-drag-summary) — 図。Stage 1200×515.
// 詳しい動画 1/2・2/2 の図をそのまま呼び出す（同じ数値・同じ色）。足りない 結論・締めのカードだけ ここで描く。
// 色：力 F 緑、速度 v 紫、加速度 a 赤、時刻 t・τ 金、終端速度・差 w・強調 黄。
import {C,seg,fade,label,rect,tex} from './anim.mjs';
import {ytUmDrag1Diagrams as V1} from './yt1-um-drag-1-diagrams.mjs';
import {ytUmDrag2Diagrams as V2} from './yt1-um-drag-2-diagrams.mjs';

const K='um-drag-summary:';
const get=(M,id,k)=>{const f=M[id+':'+k];if(!f)throw new Error('missing '+id+':'+k);return f;};
const v1=k=>get(V1,'um-drag-1',k),v2=k=>get(V2,'um-drag-2',k);
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});

const goal=(p,second)=>{
 let s=card(80,60,500,330,label('運動方程式',330,125,{size:30,color:C.ink,anchor:'middle',weight:700})
  +label('下向きを正、抵抗 kv は モデル',330,340,{size:24,color:C.dim,anchor:'middle'}),second?1:seg(p,.02,.18));
 s+=fade(second?1:seg(p,.3,.45),T('m\\,'+cs(C.a,'\\dfrac{dv}{dt}')+'='+cs(C.F,'mg-kv'),330,235,{size:46}));
 s+=card(620,60,500,330,label('終端速度までの 差 w ＝ v∞ − v',870,125,{size:28,color:C.ink,anchor:'middle',weight:700})
  +label('τ ＝ m/k を 時間の目盛りに 縮む',870,340,{size:24,color:C.t,anchor:'middle'}),second?seg(p,.05,.25):0,C.hi);
 s+=fade(second?seg(p,.3,.5):0,T(cs(C.hi,'\\dfrac{dw}{dt}')+'=-\\dfrac{'+cs(C.hi,'w')+'}{'+cs(C.t,'\\tau')+'}',870,235,{size:50}));
 return s;
};

export const ytUmDragSummaryDiagrams={
 [K+'goal']:(p)=>goal(p,0),
 [K+'goal2']:(p)=>goal(p,1),
 [K+'modelnote']:v1('modelnote'),
 [K+'sum']:v1('sum'),
 [K+'eq']:v1('eq'),
 [K+'rhs']:v1('rhs'),
 [K+'term2']:v1('term2'),
 [K+'w']:v2('w'),
 [K+'factor2']:v2('factor2'),
 [K+'weq']:v2('weq'),
 [K+'tau2']:v2('tau2'),
 [K+'graph']:v2('graph'),
 [K+'vsol']:v2('vsol'),
 // 詳しい動画の図に、同じ文で言う τ＝m/k の値だけを足す（2/2 の τ＝2 ÷ 4＝0.5 s と同じ）。
 [K+'num']:(p,ctx)=>v1('num')(p,ctx)+fade(seg(p,.85,.95),label('τ ＝ m/k ＝ 2 ÷ 4 ＝ 0.5 s',300,440,{size:28,color:C.t,anchor:'middle',weight:700})),
 [K+'tau']:v2('tau'),
 [K+'tau63']:v2('tau63'),
 [K+'early']:v2('early'),
 [K+'table']:v2('table'),
 [K+'table2']:v2('table2'),
 [K+'why']:v2('why'),
 [K+'sum1']:v2('sum1'),
 [K+'sum2']:v2('sum2'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

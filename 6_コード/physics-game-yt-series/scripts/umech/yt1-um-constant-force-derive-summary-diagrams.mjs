// 大学編「運動方程式・中級・要点」(ys-um-constant-force-derive-summary) — 図。Stage 1200×515.
// 詳しい動画 1/3・2/3・3/3 の図をそのまま呼び出す（同じ数値・同じ色）。区別・よくある間違い・締めのカードだけ ここで描く。
import {C,seg,fade,label} from './anim.mjs';
import {card,T} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {ytUmConstantForceDerive1Diagrams as M1} from './yt1-um-constant-force-derive-1-diagrams.mjs';
import {ytUmConstantForceDerive2Diagrams as M2} from './yt1-um-constant-force-derive-2-diagrams.mjs';
import {ytUmConstantForceDerive3Diagrams as M3} from './yt1-um-constant-force-derive-3-diagrams.mjs';

const K='um-constant-force-derive-summary:';
const get=(M,id,k)=>{const f=M[id+':'+k];if(!f)throw new Error('missing '+id+':'+k);return f;};
const m1=k=>get(M1,'um-constant-force-derive-1',k),m2=k=>get(M2,'um-constant-force-derive-2',k),m3=k=>get(M3,'um-constant-force-derive-3',k);
const box=(x,title,body,sub,col,g)=>card(x,90,340,300,label(title,x+170,150,{size:28,color:col,anchor:'middle',weight:700})+body+label(sub,x+170,350,{size:24,color:C.dim,anchor:'middle'}),g,col);

export const ytUmConstantForceDeriveSummaryDiagrams={
 [K+'goal']:m1('history'),
 [K+'ode']:m1('notsq'),
 [K+'two']:m3('two'),
 [K+'kinds']:(p)=>box(50,'法則',T('ma=F',220,250,{size:46}),'実験に 支えられた',C.F,seg(p,.02,.15))
   +box(430,'仮定',label('力が 一定',600,250,{size:34,color:C.ink,anchor:'middle'}),'だから 加速度も 一定',C.t,seg(p,.3,.45))
   +box(810,'導いた 結果',T('v=v_0+at',980,225,{size:32})+T('x=x_0+v_0t+\\tfrac12 at^2',980,285,{size:28}),'2回 積分して',C.hi,seg(p,.55,.7)),
 [K+'plusC']:m2('plusC'),
 [K+'pick']:m2('pick'),
 [K+'half']:m3('half'),
 [K+'foot']:m3('foot'),
 [K+'accel']:m2('accel'),
 [K+'ex']:m2('ex'),
 [K+'split']:m3('split'),
 [K+'triNum']:m3('triNum'),
 [K+'wrong']:(p)=>card(220,100,760,270,label('よくある間違い',600,170,{size:30,color:C.a,anchor:'middle',weight:700})+label('½ を 忘れて、最後の 速度の まま 数える',600,270,{size:34,color:C.ink,anchor:'middle'}),seg(p,.03,.18),C.a),
 [K+'quiz']:m3('quiz'),
 [K+'ans']:m3('ans'),
 [K+'bad']:m3('wrong'),
 [K+'sum']:m3('sum'),
 [K+'out']:m3('out'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

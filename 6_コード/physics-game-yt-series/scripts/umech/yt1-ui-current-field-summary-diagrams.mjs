// 大学編「アンペールの法則・初級・要点」(ys-ui-current-field-summary) — 図。Stage 1200×515.
// 詳しい動画 ui-current-field-1 の図をそのまま呼び出す（同じ向き・同じ数値）。
// ただし電流 I の色はシリーズの約束（緑）にそろえるため、詳しい動画の図の青（#6f9dff）を緑（C.F）に置き換えて描く。
// 'circles' のカードの「上から見て」は、この動画では板を出さないので「正面から見て」に置き換える（図そのものは同じ：⊙ → 反時計回り）。
// よくある間違い・まとめ・締めのカードだけ ここで描く。
import {C,seg,fade,label,rect} from './anim.mjs';
import {ytUiCurrentField1Diagrams as M1} from './yt1-ui-current-field-1-diagrams.mjs';

const K='ui-current-field-summary:';
const BLUE='#6f9dff';
const u=(k,rep=[])=>{const f=M1['ui-current-field-1:'+k];if(!f)throw new Error('missing ui-current-field-1:'+k);
 return (p,ctx)=>{let s=f(p,ctx).replaceAll(BLUE,C.F).replaceAll(BLUE.toUpperCase(),C.F);for(const [a,b] of rep)s=s.replaceAll(a,b);return s;};};
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const CB=C.E,CI=C.F;

export const ytUiCurrentFieldSummaryDiagrams={
 [K+'goal']:u('turn'),
 [K+'ccw']:u('circles',[['上から見て','正面から見て']]),
 [K+'hand']:u('hand'),
 [K+'flip']:u('flip'),
 [K+'loop']:u('all'),
 [K+'nturn']:u('nturn'),
 [K+'def']:u('def'),
 [K+'step']:u('step'),
 [K+'radial']:u('radial'),
 [K+'loopsum']:u('loopsum'),
 [K+'ampere']:u('ampere'),
 [K+'turn']:u('tangent'),
 [K+'sum']:u('sum'),
 [K+'two']:u('two'),
 [K+'calc']:u('calc'),
 [K+'why']:u('why'),
 [K+'unit']:u('unit'),
 [K+'wrong']:(p)=>card(200,100,800,270,label('よくある間違い',600,170,{size:30,color:C.a,anchor:'middle',weight:700})
   +label('全巻数 N が 大きいほど',600,250,{size:34,color:C.ink,anchor:'middle'})+label('巻き方も 密？',600,315,{size:34,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.a),
 [K+'quiz']:u('quiz'),
 [K+'quizans']:u('quizans'),
 [K+'summary']:(p)=>{
  const rows=[['実験事実','磁針は 円の接線の向き',C.ink],['向きの覚え方','右手（親指＝電流 I、指＝磁場 𝐁）',CB],['導いた結果','中心で 磁場がそろう・n の値',C.hi]];
  let s='';
  rows.forEach(([a,b,c],i)=>{s+=card(120,60+i*130,960,105,label(a,170,124+i*130,{size:30,color:C.dim,weight:700})+label(b,440,124+i*130,{size:32,color:c,weight:700}),seg(p,.05+i*.2,.2+i*.2));});
  return s;
 },
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

// 大学編「線積分と面積分・初級・要点」(ys-ui-electric-work-path-summary) — 図。Stage 1200×515.
// 詳しい動画 1/2・2/2 の図をそのまま呼び出す（同じ数値・同じ色：𝐄 水色、沿う部分 黄、直角な部分 桃、仕事 橙、負 赤）。
// 字幕にない文が出ないよう、一部は進み p の上限を切って使う。よくある間違い・締めのカードだけ ここで描く。
import {C,seg,fade,label} from './anim.mjs';
import {card} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {ytUiElectricWorkPath1Diagrams as M1} from './yt1-ui-electric-work-path-1-diagrams.mjs';
import {ytUiElectricWorkPath2Diagrams as M2} from './yt1-ui-electric-work-path-2-diagrams.mjs';

const K='ui-electric-work-path-summary:';
const get=(M,id)=>k=>{const f=M[id+':'+k];if(!f)throw new Error('missing '+id+':'+k);return f;};
const u1=get(M1,'ui-electric-work-path-1'),u2=get(M2,'ui-electric-work-path-2');
const cap=(f,m)=>(p)=>f(Math.min(p,m));

export const ytUiElectricWorkPathSummaryDiagrams={
 [K+'goal']:u1('plan'),
 [K+'rule']:u2('recipe'),
 [K+'sign']:u2('bars'),
 [K+'why']:u1('s1perp'),
 [K+'short']:u1('short'),
 [K+'lengths']:u1('lengths'),
 [K+'s1']:u1('s1tri'),
 [K+'s1calc']:u1('s1calc'),
 [K+'s2']:u1('s2split'),
 [K+'s2calc']:u1('s2calc'),
 [K+'s3']:cap(u2('s3calc'),.5),
 [K+'s4']:u2('s4calc'),
 [K+'total']:u2('sum'),
 [K+'sigma']:u2('sigma'),
 [K+'refine']:u2('refine'),
 [K+'wrong']:(p)=>card(200,100,800,270,label('よくある間違い',600,170,{size:30,color:C.a,anchor:'middle',weight:700})+label('符号を 落として',600,250,{size:34,color:C.ink,anchor:'middle'})+label('大きさだけを 足す？',600,315,{size:34,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.a),
 [K+'wrong2']:u2('wrong'),
 // 押し戻した印（2/2 の s4meaning の1行目だけを使い、空いた所に字幕の2文目を足す）
 [K+'meaning']:(p)=>u2('s4meaning')(Math.min(p,.35))+fade(seg(p,.1,.25),label('マイナス ＝ 押し戻した 印',900,335,{size:28,color:C.ink,anchor:'middle'}))+fade(seg(p,.5,.65),label('→ 符号のまま 足す',900,400,{size:30,color:C.hi,anchor:'middle',weight:700})),
 [K+'sum']:u2('summary'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

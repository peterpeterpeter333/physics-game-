// 大学編「コンデンサ・初級・要点」(ys-ui-capacitance-summary) — 図。Stage 1200×515.
// 詳しい動画 ui-capacitance-1 の図をそのまま呼び出す（同じ回路の向き・同じ数値・同じ色）。
// 結論の定義カード・三角形だけの V–q グラフ・よくある間違い・締めのカードだけ ここで描く。
import {C,seg,fade,label,poly,axes} from './anim.mjs';
import {card} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {cs,T} from './yt1-ui-closed-bag-1-diagrams.mjs';
import {ytUiCapacitance1Diagrams as M1} from './yt1-ui-capacitance-1-diagrams.mjs';

const K='ui-capacitance-summary:';
const u=k=>{const f=M1['ui-capacitance-1:'+k];if(!f)throw new Error('missing ui-capacitance-1:'+k);return f;};
const QC=C.p,VC=C.v,CC=C.hi,WC=C.E;

// V–q グラフ（詳しい動画と同じ軸・同じ直線 V＝q/C、C＝2 μF）。数値の目盛りは出すが、面積の値はまだ出さない。
function triFig(p){
 const A=axes({x:130,y:440,w:500,h:330,xmax:7,ymax:3.6,xticks:[1,2,3,4,5,6],yticks:[1,2,3],grid:true,g:seg(p,0,.15),xlabel:'q [μC]',ylabel:'電圧 [V]',xcolor:QC,ycolor:VC});
 let s=A.svg+A.plot(q=>q/2,{from:0,to:6,p:seg(p,.1,.4),color:VC,w:5});
 s+=fade(seg(p,.4,.65),poly([[A.X(0),A.Y(0)],[A.X(6),A.Y(0)],[A.X(6),A.Y(3)]],{fill:WC,fo:.38,stroke:WC,sw:2}));
 s+=card(740,130,420,240,label('ためるのに 要る仕事',950,195,{size:28,color:C.dim,anchor:'middle'})
  +label('＝ 直線の下の',950,260,{size:32,color:WC,anchor:'middle',weight:700})
  +label('三角形の面積',950,320,{size:32,color:WC,anchor:'middle',weight:700}),seg(p,.5,.7),WC);
 return s;
}

export const ytUiCapacitanceSummaryDiagrams={
 [K+'goal']:u('battery'),
 [K+'carry']:u('carry'),
 [K+'Q']:u('Qsum'),
 [K+'def']:(p)=>card(250,90,700,330,
   T(`${cs(CC,'C')}=\\dfrac{${cs(QC,'Q')}}{${cs(VC,'V')}}`,600,200,{size:66})
   +label('電気容量（定義）',600,310,{size:34,color:CC,anchor:'middle',weight:700})
   +label('1 V あたりに ためる電荷',600,370,{size:26,color:C.dim,anchor:'middle'}),seg(p,.05,.25),CC),
 [K+'tri0']:triFig,
 [K+'prop']:u('prop'),
 [K+'empty']:u('empty'),
 [K+'meas']:u('meas'),
 [K+'micro']:u('micro'),
 [K+'calc']:u('calc'),
 [K+'unit']:u('unit'),
 [K+'mid2']:u('mid2'),
 [K+'stair']:u('stair'),
 [K+'fine']:u('fine'),
 [K+'tri']:u('tri'),
 [K+'wrong']:(p)=>card(200,100,800,270,label('よくある間違い',600,170,{size:30,color:C.a,anchor:'middle',weight:700})+label('最後の 3 V のまま',600,250,{size:34,color:C.ink,anchor:'middle'})+label('全部の電荷を 運んだ？',600,315,{size:34,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.a),
 [K+'double']:u('double'),
 [K+'compare']:u('compare'),
 [K+'summary']:u('summary'),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい 導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

// 大学編「慣性力と軌道・初級・要点」(ys-ui-reference-frame-summary) — 図。Stage 1200×515.
// 詳しい動画 1/2・2/2 の図をそのまま呼び出す（同じ数値・同じ色）。足りない 結論・まとめ・締めのカードだけ ここで描く。
// 色：位置 水色、速度 v 紫、加速度 a・A 赤、力 F 緑（慣性力は緑の破線）、強調 黄。
import {C,seg,fade,label,rect,tex,line,dot,ring,arrow} from './anim.mjs';
import {ytReferenceFrame1Diagrams as R1} from './yt1-ui-reference-frame-1-diagrams.mjs';
import {ytReferenceFrame2Diagrams as R2} from './yt1-ui-reference-frame-2-diagrams.mjs';

const K='ui-reference-frame-summary:';
const r1=k=>R1['ui-reference-frame-1:'+k],r2=k=>R2['ui-reference-frame-2:'+k];
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});

// 結論の3枚：加速する電車／円運動／天体の重力。gs＝各カードの不透明度、sub＝2段目の不透明度。
const three=(gs,sub=[1,1,1],hi=[])=>{
 const box=(i,x,title,inner)=>card(x,40,360,400,label(title,x+180,100,{size:30,color:C.ink,anchor:'middle',weight:700})+inner,gs[i],hi.includes(i)?C.hi:C.faint);
 return box(0,40,'加速する電車から',
   T(cs(C.a,"a'")+'='+cs(C.a,'a')+'-'+cs(C.a,'A'),220,195,{size:50})
   +fade(sub[0],label('慣性力',220,285,{size:26,color:C.F,anchor:'middle',weight:700})+T(cs(C.F,'-m'+cs(C.a,'A')),220,345,{size:44})
    +label('押す相手のいない項',220,410,{size:24,color:C.dim,anchor:'middle'})))
  +box(1,420,'速さ一定の円運動',
   T(cs(C.a,'a')+'=\\dfrac{'+cs(C.v,'v')+'^2}{'+cs(C.x,'r')+'}',600,210,{size:50})
   +fade(sub[1],label('向きは 円の中心',600,320,{size:28,color:C.a,anchor:'middle',weight:700})+label('遠心力も 慣性力',600,385,{size:26,color:C.F,anchor:'middle'})))
  +box(2,800,'天体の重力',
   T(cs(C.F,'F')+'=\\dfrac{GMm}{'+cs(C.x,'r')+'^2}',980,210,{size:46})
   +fade(sub[2],label('距離 2倍 → 4分の1',980,320,{size:28,color:C.hi,anchor:'middle',weight:700})+label('r は 中心から',980,385,{size:26,color:C.dim,anchor:'middle'})));
};

// よくある間違い：糸を切ると外へ飛び出す？（2/2 の cut と同じ円・同じ点。誤りは赤）
const trap=(p)=>{
 const CX=300,CY=265,R=180,th=-0.6,bx=CX+R*Math.cos(th),by=CY-R*Math.sin(th),ux=Math.cos(th),uy=-Math.sin(th);
 let s=label('上から見た図',40,58,{size:22,color:C.dim})+ring(CX,CY,R,{color:C.faint,w:2.5,dash:'8 8'})+dot(CX,CY,5,C.dim);
 s+=line(CX,CY,bx,by,{color:C.dim,w:2.5})+dot(bx,by,14,C.hi);
 s+=fade(seg(p,.35,.55),arrow(bx+ux*18,by+uy*18,bx+ux*150,by+uy*150,{color:C.a,w:6})+label('遠心力で 外へ？',bx+ux*150+14,by+uy*150+34,{size:28,color:C.a,weight:700}));
 s+=card(700,150,440,170,label('よくある間違い',920,215,{size:30,color:C.a,anchor:'middle',weight:700})+label('糸を切ると 外へ飛び出す？',920,280,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.a);
 return s;
};

export const ytUiReferenceFrameSummaryDiagrams={
 [K+'goal']:(p)=>three([seg(p,.02,.25),0,0],[0,0,0],[0]),
 [K+'goal2']:(p)=>three([1,0,0],[seg(p,.05,.3),0,0],[0]),
 [K+'goal3']:(p)=>three([1,seg(p,.02,.2),seg(p,.5,.65)],[1,seg(p,.2,.35),seg(p,.7,.85)],[1,2]),
 [K+'rule']:r1('rule'),
 [K+'notReal']:r1('notReal'),
 [K+'mid']:r2('mid'),
 [K+'lines']:r2('lines3'),
 [K+'table2']:r1('table2'),
 [K+'rule2']:r1('rule2'),
 [K+'inertial2']:r1('inertial2'),
 [K+'v2r']:r2('v2r'),
 [K+'force']:r2('force'),
 [K+'twoR']:r2('twoR'),
 [K+'trap']:trap,
 [K+'cut2']:r2('cut2'),
 [K+'rot2']:r2('rot2'),
 [K+'rot3']:r2('rot3'),
 [K+'sum']:(p)=>three([1,1,1],[1,1,1],[0,1,2]),
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};

// 大学編「電位・初級・要点」(ys-ui-electric-potential-summary) — 図。Stage 1200×515.
// 詳しい動画 1/1 の図を呼び出す。シリーズの色の約束（電位 V 紫）に合わせ、電位だけを描いた図は 橙→紫 に塗り替えて使う
// （塗り替えるのは V だけが橙の図に限る）。U・W と V が同じ図に並ぶ符号の場面は、ここで描き直す。
// 色：電場 𝐄 水色、電位 V 紫、位置エネルギー U・仕事 W 橙、電荷 q 桃（正電荷の玉は赤、負電荷は青）、差・強調 黄、負の値 赤、力 緑。
import {C,seg,fade,label,line,rect,arrow,tex,mix,highlight} from './anim.mjs';
import {charge} from './yt1-ui-closed-bag-1-diagrams.mjs';
import {ytUiElectricPotential1Diagrams as M} from './yt1-ui-electric-potential-1-diagrams.mjs';

const K='ui-electric-potential-summary:';
const get=k=>{const f=M['ui-electric-potential-1:'+k];if(!f)throw new Error('missing ui-electric-potential-1:'+k);return f;};
const OR='#ffb36b';
const rc=f=>(p,ctx)=>f(p,ctx).replaceAll(OR,C.v).replaceAll(OR.toUpperCase(),C.v);
const EC=C.x,VC=C.v,UC=C.E,QC=C.p,HI=C.hi,NG=C.a,FC=C.F,BLUE='#7fb3ff';
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const q=cs(QC,'q'),V=s=>cs(VC,s),U=s=>cs(UC,s);

// 符号の場面（詳しい動画と同じ配置：A x=250 5 V、B x=850 2 V、軸 y=210、一様な 𝐄 右向き）
const SA=250,SB=850,SY=210;
const rows=(ys,op=1)=>{let s='';for(const y of ys)for(let x=110;x+62<=1170;x+=150)s+=arrow(x,y,x+62,y,{color:EC,w:4,head:14});return fade(op,s);};
function signBase({g=1,Eop=1}={}){
 let s=rows([95,325],Eop);
 s+=line(SA,70,SA,350,{color:VC,w:2,dash:'6 6'})+line(SB,70,SB,350,{color:VC,w:2,dash:'6 6'});
 s+=line(SA-60,SY,SB+60,SY,{color:C.faint,w:2});
 s+=label('A',SA-16,SY+40,{size:28,color:C.ink,anchor:'end',weight:700})+label('B',SB+16,SY+40,{size:28,color:C.ink,weight:700});
 s+=label('5 V',SA+10,62,{size:28,color:VC,weight:700})+label('2 V',SB+10,62,{size:28,color:VC,weight:700});
 s+=T(cs(EC,'\\mathbf{E}'),1110,62,{size:34});
 return fade(g,s);
}
const qdot=(x,y,sign,text,g=1)=>fade(g,charge(x,y,sign,17)+label(text,x,y-30,{size:24,color:sign>0?NG:BLUE,anchor:'middle',weight:700}));
const big=(title,lines,g,stroke=NG)=>card(200,100,800,270,label(title,600,170,{size:30,color:stroke,anchor:'middle',weight:700})+lines.map((l,i)=>label(l,600,250+i*62,{size:34,color:C.ink,anchor:'middle'})).join(''),g,stroke);

export const ytUiElectricPotentialSummaryDiagrams={
 // ---- 結論 ----
 [K+'goal']:rc(get('map')),
 [K+'diff']:(p,ctx)=>rc(get('shift2'))(p,ctx).replace(/<text[^>]*>位置エネルギーの回[^<]*<\/text>/,''),
 [K+'slope']:rc(get('slope')),
 [K+'hillmap']:rc(get('hillmap')),
 [K+'notmap']:rc(get('notmap')),
 // ---- なぜ ----
 [K+'static']:get('static'),
 [K+'defV']:(p)=>{
  let s=card(120,60,960,390,'',seg(p,0,.12));
  s+=fade(seg(p,0,.15),label('定義',170,120,{size:26,color:HI,weight:700}));
  s+=fade(seg(p,.05,.25),T(V('V')+'=\\dfrac{'+U('U')+'}{'+q+'}',600,200,{size:64}));
  s+=fade(seg(p,.25,.45),label('電荷 q で 割る ＝ 1 C あたりに 直す',600,320,{size:28,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),label('単位 J/C ＝ ボルト V',600,395,{size:32,color:VC,anchor:'middle',weight:700}));
  return s;
 },
 // ---- 数値例 ----
 [K+'move']:(p)=>{
  let s=signBase({g:seg(p,0,.2)});
  const x=mix(SA,SB,seg(p,.45,.85));
  s+=qdot(x,SY,1,'2 C',seg(p,.2,.35));
  s+=fade(seg(p,.45,.55),arrow(SA+40,SY+60,SB-40,SY+60,{color:C.ink,w:3,head:12})+label('動き',(SA+SB)/2,SY+92,{size:22,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'UAB']:(p)=>{
  let s=signBase()+qdot(SB,SY,1,'2 C')+fade(.35,qdot(SA,SY,1,'2 C'));
  s+=card(SA-190,370,380,120,T(U('U_{\\mathrm A}')+'=2\\times'+V('5'),SA,418,{size:34})+T('='+U('10\\,\\mathrm{J}'),SA,468,{size:34}),seg(p,.15,.3));
  s+=card(SB-190,370,380,120,T(U('U_{\\mathrm B}')+'=2\\times'+V('2'),SB,418,{size:34})+T('='+U('4\\,\\mathrm{J}'),SB,468,{size:34}),seg(p,.55,.7));
  return s;
 },
 [K+'dU']:(p)=>{
  let s=signBase({Eop:.5})+qdot(SB,SY,1,'2 C');
  s+=card(120,268,960,237,
   T(U('\\Delta U')+'='+q+'\\,('+V('V_{\\mathrm B}')+'-'+V('V_{\\mathrm A}')+')',600,322,{size:40})+label('終点 − 始点',930,332,{size:22,color:C.dim})
   +fade(seg(p,.35,.5),T('=2\\times('+V('2')+'-'+V('5')+')',600,392,{size:40}))
   +fade(seg(p,.5,.65),T('='+cs(NG,'-6\\,\\mathrm{J}'),600,460,{size:44})),seg(p,0,.12));
  return s;
 },
 [K+'W']:(p)=>{
  let s=signBase({Eop:.5})+qdot(SB,SY,1,'2 C');
  s+=card(120,268,960,237,
   T(U('\\Delta U')+'='+cs(NG,'-6\\,\\mathrm{J}'),600,318,{size:40})
   +fade(seg(p,.1,.3),T(U('W')+'=-'+U('\\Delta U'),600,390,{size:40})+label('電場の 仕事',820,400,{size:22,color:C.dim}))
   +fade(seg(p,.55,.7),T(U('W')+'=+6\\,\\mathrm{J}',600,462,{size:44})+highlight(500,428,200,62,1,HI)),seg(p,0,.08));
  return s;
 },
 [K+'dir']:(p)=>{
  let s=signBase()+qdot(SB,SY,1,'2 C');
  s+=fade(seg(p,.05,.2),arrow(SB+24,SY,SB+90,SY,{color:FC,w:5,head:14})+label('力',SB+70,SY-16,{size:22,color:FC,anchor:'end'}));
  s+=fade(seg(p,.1,.25),label('電位の 低い 方へ',SB,SY+100,{size:26,color:C.ink,anchor:'middle'}));
  s+=card(250,380,700,110,label('𝐄 は 電位の 高い 所 → 低い 所',600,428,{size:30,color:EC,anchor:'middle',weight:700})+label('5 V → 2 V',600,470,{size:24,color:VC,anchor:'middle'}),seg(p,.5,.65),EC);
  return s;
 },
 // ---- よくある間違い ----
 [K+'wrong']:(p)=>big('よくある間違い',['電場が プラスの 仕事を したから','位置エネルギーも 増える？'],seg(p,.03,.18)),
 // U の棒・ラベルは橙のまま、電位の目盛り（5 V・2 V の字と破線）だけ紫に
 [K+'K']:(p,ctx)=>get('K')(p,ctx).replace(/<line([^>]*?)stroke="#ffb36b"([^>]*stroke-dasharray)/g,`<line$1stroke="${C.v}"$2`).replace(/(<text[^>]*?)fill="#ffb36b"([^>]*>[25] V<\/text>)/g,`$1fill="${C.v}"$2`),
 [K+'neg']:(p)=>{
  let s=signBase({Eop:.5})+qdot(SA,SY,-1,'−2 C');
  s+=fade(seg(p,.55,.7),arrow(SA-22,SY,SA-90,SY,{color:FC,w:5,head:14})+label('力',SA-60,SY-14,{size:22,color:FC,anchor:'middle'}));
  s+=card(120,265,960,240,
   T(U('\\Delta U')+'=('+cs(QC,'-2')+')\\times('+V('2')+'-'+V('5')+')='+U('+6\\,\\mathrm{J}'),600,325,{size:40})
   +fade(seg(p,.35,.5),T(U('W')+'=-'+U('\\Delta U')+'='+cs(NG,'-6\\,\\mathrm{J}'),600,405,{size:40}))
   +fade(seg(p,.7,.85),label('電場は 動きを 押し戻す',600,475,{size:28,color:NG,anchor:'middle',weight:700})),seg(p,.02,.15));
  return s;
 },
 // ---- まとめ ----
 [K+'sum']:(p)=>{
  let s=card(120,70,960,330,'',1);
  s+=fade(seg(p,0,.15),T(V('V')+'=\\dfrac{'+U('U')+'}{'+q+'}',330,200,{size:52})+label('1 C あたりの 位置エネルギー',330,320,{size:24,color:VC,anchor:'middle'}));
  s+=fade(seg(p,.25,.4),T(U('\\Delta U')+'='+q+'\\,\\Delta '+V('V'),820,180,{size:44}));
  s+=fade(seg(p,.45,.6),T(U('W')+'=-'+U('\\Delta U'),820,290,{size:44}));
  return s;
 },
 [K+'deep']:(p)=>card(200,130,800,220,label('くわしい導き方は',600,215,{size:34,color:C.ink,anchor:'middle'})+label('各回の動画で',600,290,{size:48,color:HI,anchor:'middle',weight:700}),seg(p,.05,.25),HI),
};

// Preserve the imported manuscript and its source lines beside minimal editorial changes.
const D=diagram=>({display:'diagram',diagram,formula:[],operation:''});
const F=(formula,operation,previousFormula=[])=>({display:'equation',formula,operation,previousFormula});
export const motionInsertIds=['hm-why-01','hm-why-02','hm-why-03','hm-why-04'];
export const motionInsertRoutes={
 'm1-velocity-intro':[{afterScene:2,inserts:['hm-why-01']}],
 'm1-velocity-middle':[{afterScene:2,inserts:['hm-why-02']}],
 // New main storyboard has five scenes. Retain the manuscript's after-scene-2
 // position: the concrete 1 s example prepares the general algebra next.
 'm1-velocity-advanced':[{afterScene:2,inserts:['hm-why-03']}],
 'm1-acceleration-advanced':[{afterScene:3,inserts:['hm-why-04']}]
};
export function applyMotionInserts(plan){
 for(const id of motionInsertIds){
  const c=plan.find(c=>c.id===id);if(!c)throw Error('Missing manuscript '+id);
  c.manuscriptScenes??=structuredClone(c.scenes);
  const original=c.manuscriptScenes[0],u=original.utterances;
  const cue=(i,visual,subtitle=u[i].subtitle,reading=u[i].reading)=>({...visual,subtitle,reading:reading.replace(/\s+/g,''),source:u[i].source});
  let cues;
  if(id==='hm-why-01')cues=[
   cue(0,D('opposite-walkers'),'青い人は右へ毎秒一メートル、黄色い人は左へ毎秒一メートルで歩きます。','あおいひとはみぎへまいびょういちメートル、きいろいひとはひだりへまいびょういちメートルであるきます。'),
   cue(1,D('opposite-walkers')),cue(2,D('force-changes-direction')),cue(3,D('signed-walkers')),cue(4,D('signed-walkers')),
   cue(5,F(['\\Delta x','=','x_{\\text{後}}-x_{\\text{前}}'],'Δx：位置の変化　右を正とする')),
   cue(6,D('signed-displacements'),'位置の変化の符号は、右向きならプラス、左向きならマイナスになります。','いちのへんかのふごうは、みぎむきならプラス、ひだりむきならマイナスになります。')
  ];
  if(id==='hm-why-02')cues=[
   cue(0,D('rise-run')),cue(1,F(['\\bar v','=','\\frac{\\text{位置の変化}}{\\text{かかった時間}}'],'v̄：平均速度')),
   cue(2,D('physical-slope')),cue(3,D('physical-slope'),'この二点を結ぶ直線の傾きは、二点の間の平均速度です。','このにてんをむすぶちょくせんのかたむきは、にてんのあいだのへいきんそくどです。'),
   cue(4,F(['\\frac{\\mathrm m}{\\mathrm s}'],'縦の単位 ÷ 横の単位'),'私たちは、傾きの単位も確かめます。','わたしたちは、かたむきのたんいもたしかめます。'),
   cue(5,F(['\\mathrm m\\div\\mathrm s','=','\\mathrm{m/s}'],'メートル ÷ 秒 → メートル毎秒'),'傾きの単位は、メートル割る秒で、メートル毎秒です。','かたむきのたんいは、メートルわるびょうで、メートルまいびょうです。'),
   cue(6,F(['\\frac{\\text{位置の変化}}{\\text{時間の変化}}',':','\\mathrm{m/s}'],'位置・時間のグラフなら、傾きは平均速度'),'傾きの単位も、速度の単位と一致します。','かたむきのたんいも、そくどのたんいといっちします。')
  ];
  if(id==='hm-why-03')cues=[
   cue(0,D('one-second-position')),
   cue(0,F(['x=t^2'],'この例では t は秒で測った数値、x はメートルで測った数値'),'ここでは、時刻を秒、位置をメートルで測った数値で計算します。','ここでは、じこくをびょう、いちをメートルではかったすうちでけいさんします。'),
   cue(1,D('one-second-secants'),'時間の幅が一秒なら平均速度は毎秒三メートル、〇・一秒なら二・一、〇・〇一秒なら二・〇一です。','じかんのはばがいちびょうならへいきんそくどはまいびょうさんメートル、れいてんいちびょうならにてんいち、れいてんれいいちびょうならにてんれいいちです。'),
   cue(2,F(['\\bar v','=','\\frac{(1+h)^2-1^2}{h}'],'h：時間の幅を秒で測った数値　平均速度の数値を求める'),'時間の幅の数値をエイチとします。平均速度の数値は、後の位置から前の位置を引き、エイチで割って求めます。','じかんのはばのすうちをエイチとします。へいきんそくどのすうちは、あとのいちからまえのいちをひき、エイチでわってもとめます。'),
   cue(3,F(['(1+h)^2','=','(1+h)(1+h)'],'二乗を、同じ括弧どうしの掛け算にする'),'一足すエイチの二乗は、同じ括弧を二つ掛けたものです。','いちたすエイチのにじょうは、おなじかっこをふたつかけたものです。'),
   cue(3,F(['(1+h)^2','=','1+h+h+h^2'],'左の各項を、右の各項に掛ける',['(1+h)^2','=','(1+h)(1+h)']),'私たちは、括弧の中の項を一つずつ掛けます。一、エイチ、エイチ、エイチの二乗という四つの項ができます。','わたしたちは、かっこのなかのこうをひとつずつかけます。いち、エイチ、エイチ、エイチのにじょうというよっつのこうができます。'),
   cue(3,F(['(1+h)^2','=','1+2h+h^2'],'h + h = 2h',['(1+h)^2','=','1+h+h+h^2']),'二つのエイチを足すと、二エイチです。したがって、括弧の二乗は、一足す二エイチ足すエイチの二乗になります。','ふたつのエイチをたすと、にエイチです。したがって、かっこのにじょうは、いちたすにエイチたすエイチのにじょうになります。'),
   cue(4,F(['\\bar v','=','\\frac{2h+h^2}{h}'],'前の位置 1 を引く → 1 − 1 が消える',['\\bar v','=','\\frac{1+2h+h^2-1}{h}']),'分子から最初の位置の一を引くと、一どうしが消えます。分子には、二エイチとエイチの二乗が残ります。','ぶんしからさいしょのいちのいちをひくと、いちどうしがきえます。ぶんしには、にエイチとエイチのにじょうがのこります。'),
   cue(4,F(['\\bar v','=','\\frac{h(2+h)}{h}'],'分子の二つの項に共通する h を取り出す',['\\bar v','=','\\frac{2h+h^2}{h}']),'二つの項には、どちらもエイチが掛かっています。エイチを括弧の外へ出すと、分子はエイチ掛ける二足すエイチです。','ふたつのこうには、どちらもエイチがかかっています。エイチをかっこのそとへだすと、ぶんしはエイチかけるにたすエイチです。'),
   cue(5,F(['\\bar v','=','2+h'],'h > 0 のまま、分子と分母の h を約分',['\\bar v','=','\\frac{h(2+h)}{h}']),'エイチはゼロではないので、分子と分母のエイチを約分できます。平均速度の数値は、二足すエイチになります。','エイチはゼロではないので、ぶんしとぶんぼのエイチをやくぶんできます。へいきんそくどのすうちは、にたすエイチになります。'),
   cue(6,F(['\\lim_{h\\to0}(2+h)','=','2'],'lim：h をゼロへ近づけたとき、近づく先の値',['\\bar v','=','2+h']),'そのあと、エイチをゼロに近づけると、平均速度の数値は二に近づきます。','そのあと、エイチをゼロにちかづけると、へいきんそくどのすうちはににちかづきます。'),
   cue(7,D('one-second-tangent'),'一秒の瞬間の速度は、毎秒二メートルです。ゼロで割らずに、近づく先の値を求められました。','いちびょうのしゅんかんのそくどは、まいびょうにメートルです。ゼロでわらずに、ちかづくさきのあたいをもとめられました。')
  ];
  if(id==='hm-why-04')cues=[
   cue(0,D('equal-speed-vectors')),cue(1,D('velocity-triangle'),'二本の速度の矢印の根元をそろえると、その二本と速度の変化で、二等辺三角形ができます。','にほんのそくどのやじるしのねもとをそろえると、そのにほんとそくどのへんかで、にとうへんさんかくけいができます。'),cue(2,D('triangle-limit')),
   cue(3,D('inward-not-outward'),'速度の変化の矢印は、前の速度の先端から後の速度の先端へ向かうため、円の内側を向きます。','そくどのへんかのやじるしは、まえのそくどのせんたんからあとのそくどのせんたんへむかうため、えんのうちがわをむきます。'),
   cue(4,D('instant-inward'),'時間を短くした極限では、その矢印の向きは中心向きになります。時間は正なので、加速度も中心を向きます。','じかんをみじかくしたきょくげんでは、そのやじるしのむきはちゅうしんむきになります。じかんはせいなので、かそくどもちゅうしんをむきます。'),
   cue(5,D('tangent-change'),'私たちは、速さが変わらない理由も確かめます。','わたしたちは、はやさがかわらないりゆうもたしかめます。'),
   cue(6,D('tangent-change'),'もし加速度が速度と同じ向きの成分を持てば、物体の速さは増えます。','もしかそくどがそくどとおなじむきのせいぶんをもてば、ぶったいのはやさはふえます。'),
   cue(7,D('perpendicular-acceleration'),'速さ一定の円運動では、瞬間の加速度は速度に直角です。有限の時間で測った速度の変化とは区別します。','はやさいっていのえんうんどうでは、しゅんかんのかそくどはそくどにちょっかくです。ゆうげんのじかんではかったそくどのへんかとはくべつします。')
  ];
  // Author smaller scenes without changing the app's user-driven page switching.
  const groups=id==='hm-why-03'?[cues.slice(0,3),cues.slice(3,10),cues.slice(10)]:[cues];
  c.visualPilot='motion-inserts-v1';c.mediaDirectory='inserts';
  c.scenes=groups.map((qs,index)=>({...original,index,sceneId:id+'-s'+(index+1),heading:id==='hm-why-03'?['1秒の瞬間を、数値で調べる','ゼロで割らずに式を整理する','近づく先の値が瞬間の速度'][index]:c.title,cues:qs,
   utterances:qs.map(({subtitle,reading,source})=>({subtitle,reading,source})),narration:qs.map(q=>q.subtitle).join('')}));
 }
}

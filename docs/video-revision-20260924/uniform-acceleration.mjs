const D=(subtitle,reading,diagram)=>({subtitle,reading,display:'diagram',diagram,operation:'',formula:[]});
const F=(subtitle,reading,formula,operation,previousFormula=[])=>({subtitle,reading,display:'equation',formula,operation,previousFormula});
const S=(heading,...cues)=>({heading,cues,utterances:cues.map(({subtitle,reading})=>({subtitle,reading})),narration:cues.map(q=>q.subtitle).join(''),equation:'',symbols:'',visual:'uniform-acceleration'});
export const uniformAccelerationIds=['m1-uniform-accel-intro'];
export function applyUniformAcceleration(plan){
 const c=plan.find(c=>c.id===uniformAccelerationIds[0]);if(!c)throw Error('Missing uniform acceleration intro');
 c.manuscriptScenes??=structuredClone(c.scenes);
 Object.assign(c,{visualPilot:'uniform-acceleration-v1',renderer:'lesson',mediaDirectory:'revisions',condition:'一定の加速度の直線運動。右を正とする。tは測り始めてからの経過時間。',scenes:[
 S('加速度から、二秒後の速度を求める',
 D('今回は、加速度から台車の二秒後の速度を求めます。台車は、測り始めた時点で右へ毎秒二メートルで動いています。','こんかいは、かそくどからだいしゃのにびょうごのそくどをもとめます。だいしゃは、はかりはじめたじてんでみぎへまいびょうにメートルでうごいています。','uniform-start'),
 D('台車の加速度は一定で、毎秒三メートルずつ速度が増えます。一秒後の速度は、毎秒五メートルです。','だいしゃのかそくどはいっていで、まいびょうさんメートルずつそくどがふえます。いちびょうごのそくどは、まいびょうごメートルです。','uniform-first'),
 D('台車の速度は、その次の一秒でも同じ量だけ増えます。二秒後の速度は、毎秒八メートルになります。','だいしゃのそくどは、そのつぎのいちびょうでもおなじりょうだけふえます。にびょうごのそくどは、まいびょうはちメートルになります。','uniform-second')),
 S('最初の速度に、変化した分を足す',
 F('速度の増加分は、一秒あたりの増加分に、経過した二秒を掛けて求めます。単位の秒が一つ約分され、毎秒六メートルです。','そくどのぞうかぶんは、いちびょうあたりのぞうかぶんに、けいかしたにびょうをかけてもとめます。たんいのびょうがひとつやくぶんされ、まいびょうろくメートルです。',['3\\,\\frac{\\mathrm m}{\\mathrm s^2}','\\times','2\\,\\mathrm s','=','6\\,\\mathrm{m/s}'],'速度の増加分：加速度 × 経過時間'),
 F('台車は最初から動いていたので、増加分だけでは最後の速度になりません。最初の二に、増えた六を足します。','だいしゃはさいしょからうごいていたので、ぞうかぶんだけではさいごのそくどになりません。さいしょのにに、ふえたろくをたします。',['2\\,\\mathrm{m/s}','+','6\\,\\mathrm{m/s}','=','8\\,\\mathrm{m/s}'],'最後の速度 = 最初の速度 + 速度の増加分'),
 F('私たちは、同じ計算を文字で表します。ブイゼロは最初の速度、エーは一定の加速度、ティーは経過時間です。','わたしたちは、おなじけいさんをもじであらわします。ブイゼロはさいしょのそくど、エーはいっていのかそくど、ティーはけいかじかんです。',['v_0','+','a t'],'v₀：最初の速度 [m/s]　a：加速度 [m/s²]　t：経過時間 [s]'),
 F('エーとティーの積が、速度の変化です。最初の速度にこの変化を足した値が、ティー秒後の速度ブイです。','エーとティーのせきが、そくどのへんかです。さいしょのそくどにこのへんかをたしたあたいが、ティーびょうごのそくどブイです。',['v','=','v_0','+','a t'],'v：経過時間 t の後の速度 [m/s]　at：速度の変化 [m/s]',['v_0','+','a t']),
 D('この式を使うには、加速度だけでなく最初の速度も必要です。同じ加速度でも、最初の速度が違えば、二秒後の速度も違います。','このしきをつかうには、かそくどだけでなくさいしょのそくどもひつようです。おなじかそくどでも、さいしょのそくどがちがえば、にびょうごのそくどもちがいます。','uniform-compare')),
 S('速度が分かった。位置はどうなる？',
 D('私たちは、加速度と最初の速度から、その後の速度を求められました。速度の記録をグラフにすると、点は直線上に並びます。','わたしたちは、かそくどとさいしょのそくどから、そのあとのそくどをもとめられました。そくどのきろくをグラフにすると、てんはちょくせんじょうにならびます。','uniform-graph'),
 D('台車の速度が増えると、同じ一秒で進む距離も増えます。速度の記録から位置を求める方法は、中級の動画で扱います。','だいしゃのそくどがふえると、おなじいちびょうですすむきょりもふえます。そくどのきろくからいちをもとめるほうほうは、ちゅうきゅうのどうがであつかいます。','uniform-distance'))]});
 c.scenes.forEach((s,i)=>Object.assign(s,{index:i,sceneId:`${c.id}-s${i+1}`,mode:'common'}));
}

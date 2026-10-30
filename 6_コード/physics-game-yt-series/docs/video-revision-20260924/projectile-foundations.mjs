const D=(subtitle,reading,diagram)=>({subtitle,reading,display:'diagram',diagram,operation:'',formula:[]});
const F=(subtitle,reading,formula,operation,previousFormula=[])=>({subtitle,reading,display:'equation',formula,operation,previousFormula});
const S=(heading,...cues)=>({heading,cues,utterances:cues.map(({subtitle,reading})=>({subtitle,reading})),narration:cues.map(q=>q.subtitle).join(''),equation:'',symbols:'',visual:'projectile-foundations'});
const clips={
 'm-projectile-intro':[
 S('横に投げた球は、なぜ曲がって進む？',
 D('今回は、横に投げた球の動きを、横と縦に分けて調べます。手を離れた後は、空気抵抗を無視し、下向きの重力だけが働く場合です。','こんかいは、よこになげたたまのうごきを、よことたてにわけてしらべます。てをはなれたあとは、くうきていこうをむしし、したむきのじゅうりょくだけがはたらくばあいです。','projectile-whole'),
 D('球には横向きの力が働かないので、横方向の速度は変わりません。力が働かない方向の速度が一定に保たれる性質を、慣性の法則と呼びます。','たまにはよこむきのちからがはたらかないので、よこほうこうのそくどはかわりません。ちからがはたらかないほうこうのそくどがいっていにたもたれるせいしつを、かんせいのほうそくとよびます。','projectile-horizontal')),
 S('横は等速、縦は落下。同じ球で同時に起きる',
 D('縦方向では、重力によって下向きの速度が増えます。等しい時間ごとに比べると、球が下がる距離はだんだん長くなります。','たてほうこうでは、じゅうりょくによってしたむきのそくどがふえます。ひとしいじかんごとにくらべると、たまがさがるきょりはだんだんながくなります。','projectile-vertical'),
 D('球は、横には同じ時間で同じ距離だけ進み、縦にはだんだん速く落ちます。二つの動きが同時に起きるので、球の道筋は下へ曲がります。','たまは、よこにはおなじじかんでおなじきょりだけすすみ、たてにはだんだんはやくおちます。ふたつのうごきがどうじにおきるので、たまのみちすじはしたへまがります。','projectile-dots')),
 S('同じ時刻の横位置と縦位置を組にする',
 D('私たちは、一つの時計で横と縦を調べます。同じ時刻の横位置と縦位置を組にすると、球の位置が一つに決まります。','わたしたちは、ひとつのとけいでよことたてをしらべます。おなじじこくのよこいちとたていちをくみにすると、たまのいちがひとつにきまります。','projectile-projections'),
 D('中級では、斜めに投げた球の初速度も横と縦に分けます。その二つの速度から、球がどこまで飛ぶかを求めます。','ちゅうきゅうでは、ななめになげたたまのしょそくどもよことたてにわけます。そのふたつのそくどから、たまがどこまでとぶかをもとめます。','projectile-launch'))],
 'hm-why-10':[
 S('力と加速度を、方向ごとに分ける',
 D('今回は、横と縦を別々に計算できる理由を、力の向きから確かめます。空気抵抗がなければ、球に働く力は下向きの重力だけです。','こんかいは、よことたてをべつべつにけいさんできるりゆうを、ちからのむきからたしかめます。くうきていこうがなければ、たまにはたらくちからはしたむきのじゅうりょくだけです。','projectile-force'),
 F('力と運動を結ぶ基本法則では、質量と加速度の積が力です。右をエックスの正方向、上をワイの正方向にすると、この式を方向ごとに書けます。','ちからとうんどうをむすぶきほんほうそくでは、しつりょうとかそくどのせきがちからです。みぎをエックスのせいほうこう、うえをワイのせいほうこうにすると、このしきをほうこうごとにかけます。',['ma_x=F_x','\\qquad','ma_y=F_y'],'m：質量　a：加速度　F：力。添字 x は横、y は縦の成分'),
 F('横方向の力はゼロです。両側を質量で割ると横方向の加速度もゼロなので、横方向の速度は変わりません。','よこほうこうのちからはゼロです。りょうがわをしつりょうでわるとよこほうこうのかそくどもゼロなので、よこほうこうのそくどはかわりません。',['a_x','=','0'],'m > 0。両辺 ÷ m',['ma_x','=','0']),
 F('縦方向の力は、下向きなのでマイナスエムジーです。両側を質量で割ると、縦方向の加速度はマイナスジーになります。','たてほうこうのちからは、したむきなのでマイナスエムジーです。りょうがわをしつりょうでわると、たてほうこうのかそくどはマイナスジーになります。',['a_y','=','-g'],'g：重力加速度の大きさ。両辺 ÷ m',['ma_y','=','-mg']),
 D('横に投げた球と、そっと離した球を、同じ高さから同時に放します。どちらも最初の縦方向の速度はゼロで、縦方向の加速度も同じです。','よこになげたたまと、そっとはなしたたまを、おなじたかさからどうじにはなします。どちらもさいしょのたてほうこうのそくどはゼロで、たてほうこうのかそくどもおなじです。','projectile-twins'),
 D('二つの球の縦の動きは一致するので、二つの球は同時に床へ着きます。横へ進む距離が違っても、落下にかかる時間は同じです。','ふたつのたまのたてのうごきはいっちするので、ふたつのたまはどうじにゆかへつきます。よこへすすむきょりがちがっても、らっかにかかるじかんはおなじです。','projectile-landing'))]
};
export const projectileFoundationIds=Object.keys(clips);
export function applyProjectileFoundations(plan){for(const [id,scenes]of Object.entries(clips)){
 const c=plan.find(c=>c.id===id);if(!c)throw Error('Missing '+id);c.manuscriptScenes??=structuredClone(c.scenes);
 Object.assign(c,{visualPilot:'projectile-foundations-v1',mediaDirectory:id.startsWith('hm-')?'inserts':'revisions',renderer:id.startsWith('hm-')?'insert':'lesson',scenes:structuredClone(scenes)});
 c.scenes.forEach((s,i)=>Object.assign(s,{index:i,sceneId:`${id}-s${i+1}`,mode:'common'}));
}}

const D=(subtitle,reading,diagram)=>({subtitle,reading,display:'diagram',diagram,operation:'',formula:[]});
const F=(subtitle,reading,formula,operation,previousFormula=[])=>({subtitle,reading,display:'equation',formula,operation,previousFormula});
const S=(heading,...cues)=>({heading,cues,utterances:cues.map(({subtitle,reading})=>({subtitle,reading})),narration:cues.map(q=>q.subtitle).join(''),equation:'',symbols:'',visual:'wave-speed'});
export const waveSpeedIds=['w-basics-middle','hw-why-01'];
export function applyWaveSpeed(plan){
 const set=(id,scenes,breaks)=>{const c=plan.find(c=>c.id===id);if(!c)throw Error(id);c.manuscriptScenes??=structuredClone(c.scenes);Object.assign(c,{visualPilot:'wave-speed-v1',navigationBreaks:breaks,scenes});scenes.forEach((s,i)=>Object.assign(s,{index:i,sceneId:`${id}-s${i+1}`,mode:id.startsWith('hw-')?'thorough':'common'}));};
 set('w-basics-middle',[
 S('一周期の間に、波の山が進む距離を調べる',
 D('今回は、波の速さを、波長と振動数から求めます。波の山は、ひもの一点が一回振動する間に、隣の山がいた場所まで進みます。','こんかいは、なみのはやさを、はちょうとしんどうすうからもとめます。なみのやまは、ひものいってんがいっかいしんどうするあいだに、となりのやまがいたばしょまですすみます。','wavespeed-crest-distance'),
 F('波の山が一周期で進む距離は、一波長です。速さは距離割る時間なので、波長を周期で割ります。','なみのやまがいっしゅうきですすむきょりは、いちはちょうです。はやさはきょりわるじかんなので、はちょうをしゅうきでわります。',['v=\\frac{\\lambda}{T}'],'v：波の速さ[m/s]、λ（ラムダ）：波長[m]、T：周期[s]')),
 S('一秒あたりの回数を使う形に書き換える',
 D('振動数は、一秒あたりの振動回数です。たとえば一回に〇・五秒かかる振動は、一秒の間に二回できます。','しんどうすうは、いちびょうあたりのしんどうかいすうです。たとえばいっかいにれいてんごびょうかかるしんどうは、いちびょうのあいだににかいできます。','wavespeed-cycle-count'),
 F('一秒あたりの回数は、周期の逆数で表せます。振動数をエフと書けば、エフは一割るティーです。','いちびょうあたりのかいすうは、しゅうきのぎゃくすうであらわせます。しんどうすうをエフとかけば、エフはいちわるティーです。',['f=\\frac1T'],'f：振動数[Hz]。1 Hzは1秒あたり1回。T>0'),
 F('波長を周期で割る式を、波長に周期の逆数を掛ける形へ直します。この逆数を振動数に置き換えれば、波の速さは振動数かける波長です。','はちょうをしゅうきでわるしきを、はちょうにしゅうきのぎゃくすうをかけるかたちへなおします。このぎゃくすうをしんどうすうにおきかえれば、なみのはやさはしんどうすうかけるはちょうです。',['v=\\lambda f=f\\lambda'],'1/Tをfで置き換える。掛け算の順序を変えても値は同じ',['v=\\frac{\\lambda}{T}=\\lambda\\frac1T'])),
 S('同じ速さで伝わる二つの波を比べる',
 D('波の速さが同じなら、一秒あたりの山の数を増やすと、山どうしの間隔は狭くなります。振動数が二倍の波は、波長が半分になります。','なみのはやさがおなじなら、いちびょうあたりのやまのかずをふやすと、やまどうしのかんかくはせまくなります。しんどうすうがにばいのなみは、はちょうがはんぶんになります。','wavespeed-fixed-speed'),
 F('波長を求めるには、速さの式の両辺を振動数で割ります。速さを一定にした場合、振動数と波長を別々に自由に選ぶことはできません。','はちょうをもとめるには、はやさのしきのりょうへんをしんどうすうでわります。はやさをいっていにしたばあい、しんどうすうとはちょうをべつべつにじゆうにえらぶことはできません。',['\\frac vf=\\lambda'],'f>0。fを2倍にすると、同じvを割る数が2倍になる',['\\frac vf=\\frac{f\\lambda}{f}']))
 ],[1,2]);
 set('hw-why-01',[
 S('周期0.5秒、波長3 mから、波の速さを計算する',
 D('一回振動するのに〇・五秒かかるなら、一秒間に二回振動します。波の山も、一秒間に二波長ぶん進みます。','いっかいしんどうするのにれいてんごびょうかかるなら、いちびょうかんににかいしんどうします。なみのやまも、いちびょうかんににはちょうぶんすすみます。','wavespeed-numeric-travel'),
 F('振動数は、一割る〇・五で二ヘルツです。波長が三メートルなら、波の速さは二かける三で、毎秒六メートルです。','しんどうすうは、いちわるれいてんごでにヘルツです。はちょうがさんメートルなら、なみのはやさはにかけるさんで、まいびょうろくメートルです。',['f=\\frac1{0.5}=2\\,\\mathrm{Hz}','\\qquad','v=2\\times3=6\\,\\mathrm{m/s}'],'T=0.5 s、λ=3 m。1秒あたり、3 mが二つぶん'))
 ],[]);
}

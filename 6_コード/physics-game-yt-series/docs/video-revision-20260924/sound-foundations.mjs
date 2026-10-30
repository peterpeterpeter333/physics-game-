const D=(subtitle,reading,diagram)=>({subtitle,reading,display:'diagram',diagram,operation:'',formula:[]});
const S=(heading,...cues)=>({heading,cues,utterances:cues.map(({subtitle,reading})=>({subtitle,reading})),narration:cues.map(q=>q.subtitle).join(''),equation:'',symbols:'',visual:'sound-foundations'});
export const soundFoundationIds=['w-sound-intro'];
export function applySoundFoundations(plan){
 const c=plan.find(c=>c.id==='w-sound-intro');if(!c)throw Error('w-sound-intro');c.manuscriptScenes??=structuredClone(c.scenes);
 const scenes=[
 S('音では、空気が前後に揺れている',
 D('今回は、音のグラフの山が何を表すかを確かめます。音波では、空気が波の進む方向に往復し、空気が密な所と疎らな所が伝わります。','こんかいは、おとのグラフのやまがなにをあらわすかをたしかめます。おんぱでは、くうきがなみのすすむほうこうにおうふくし、くうきがみつなところとまばらなところがつたわります。','soundintro-air-motion'),
 D('密な所では空気の圧力が高く、疎らな所では圧力が低くなります。音のグラフの山は、空気が上へ盛り上がった形ではありません。','みつなところではくうきのあつりょくがたかく、まばらなところではあつりょくがひくくなります。おとのグラフのやまは、くうきがうえへもりあがったかたちではありません。','soundintro-compression')),
 S('同じ音でも、縦軸の量によってグラフの意味が変わる',
 D('縦軸が普段からの圧力の変化なら、グラフの山は圧力が最も高い場所です。グラフが横軸より下なら、空気の圧力は普段より低い、という意味です。','たてじくがふだんからのあつりょくのへんかなら、グラフのやまはあつりょくがもっともたかいばしょです。グラフがよこじくよりしたなら、くうきのあつりょくはふだんよりひくい、といういみです。','soundintro-pressure-graph'),
 D('縦軸が空気の横向きのずれなら、グラフの山は、空気が右へ最もずれた場所です。この場合も、グラフの上向きは空気の上向きの移動ではないので、必ず縦軸を読みます。','たてじくがくうきのよこむきのずれなら、グラフのやまは、くうきがみぎへもっともずれたばしょです。このばあいも、グラフのうえむきはくうきのうえむきのいどうではないので、かならずたてじくをよみます。','soundintro-displacement-graph')),
 S('音の大きさと、音の高さを区別する',
 D('同じ振動数の音を比べると、圧力の振幅が大きいほど、一般に大きな音に感じます。振幅は、圧力の変化がどれだけ大きいかを表します。','おなじしんどうすうのおとをくらべると、あつりょくのしんぷくがおおきいほど、いっぱんにおおきなおとにかんじます。しんぷくは、あつりょくのへんかがどれだけおおきいかをあらわします。','soundintro-loudness'),
 D('一方、振動数が大きい音ほど、高い音に聞こえます。純粋な一つの振動の音では、音の大きさに関わる振幅と、音の高さを決める振動数を、分けて考えます。','いっぽう、しんどうすうがおおきいおとほど、たかいおとにきこえます。じゅんすいなひとつのしんどうのおとでは、おとのおおきさにかかわるしんぷくと、おとのたかさをきめるしんどうすうを、わけてかんがえます。','soundintro-pitch'))
 ];Object.assign(c,{visualPilot:'sound-foundations-v1',navigationBreaks:[1,2],scenes});scenes.forEach((s,i)=>Object.assign(s,{index:i,sceneId:`${c.id}-s${i+1}`,mode:'common'}));
}

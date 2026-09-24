const D=(subtitle,reading,diagram)=>({subtitle,reading,display:'diagram',diagram,operation:'',formula:[]});
const F=(subtitle,reading,formula,operation,previousFormula=[])=>({subtitle,reading,display:'equation',formula,operation,previousFormula});
const S=(heading,...cues)=>({heading,cues,utterances:cues.map(({subtitle,reading})=>({subtitle,reading})),narration:cues.map(q=>q.subtitle).join(''),equation:'',symbols:'',visual:'coulomb-prerequisite'});
export const coulombPrerequisiteIds=['prep-coulomb-field'];
export function applyCoulombPrerequisite(plan){
 const c=plan.find(c=>c.id==='prep-coulomb-field');if(!c)throw Error('missing prep-coulomb-field');c.manuscriptScenes??=structuredClone(c.scenes);
 Object.assign(c,{before:['e-field-middle'],legacyPositionExcluded:true,topicId:'prep-coulomb-field',stageTitle:'電場の計算の前提',visualPilot:'coulomb-prerequisite-v1',navigationBreaks:[1],scenes:[
 S('距離を変える比較と、試験電荷を変える比較を分ける',
 D('ここでは、電場の計算で、何を変えて比べるかを整理します。同じ二つの点電荷なら、距離を二倍にすると、電気力は四分の一になるというクーロンの法則を使います。','ここでは、でんばのけいさんで、なにをかえてくらべるかをせいりします。おなじふたつのてんでんかなら、きょりをにばいにすると、でんきりょくはよんぶんのいちになるというクーロンのほうそくをつかいます。','cprep-distance'),
 F('比例定数はケーと読みます。電荷を同じにしたまま距離を二倍にすれば、分母が四倍になるので、力は四分の一です。','ひれいていすうはケーとよみます。でんかをおなじにしたままきょりをにばいにすれば、ぶんぼがよんばいになるので、ちからはよんぶんのいちです。',['F=k\\frac{|Qq|}{r^2},\\qquad (2r)^2=4r^2'],'Q,q：電荷[C]、r：距離[m]。真空中の静止した点電荷'),
 D('今度は、距離を変えず、試験電荷だけを二倍にします。力も二倍になりますが、力を試験電荷で割った電場は変わりません。','こんどは、きょりをかえず、しけんでんかだけをにばいにします。ちからもにばいになりますが、ちからをしけんでんかでわったでんばはかわりません。','cprep-testcharge'),
 F('例えば、試験電荷一に力三なら、一あたりの力は三です。試験電荷二に力六でも、六割る二で同じ三なので、電場を試験電荷によらない量として表せます。','たとえば、しけんでんかいちにちからさんなら、いちあたりのちからはさんです。しけんでんかににちからろくでも、ろくわるにでおなじさんなので、でんばをしけんでんかによらないりょうとしてあらわせます。',['\\frac{3\\,\\mathrm N}{1\\,\\mathrm C}=\\frac{6\\,\\mathrm N}{2\\,\\mathrm C}=3\\,\\mathrm{N/C}'],'比較用の数値。試験電荷による元の配置の変化を無視')),
 S('複数の電荷の電場は、同じ点で足す',
 D('電荷が二つあれば、各電荷が作る電場を、調べたい同じ点で求めます。その二本の矢印を、向きを含めて足したものが、合計の電場です。','でんかがふたつあれば、かくでんかがつくるでんばを、しらべたいおなじてんでもとめます。そのにほんのやじるしを、むきをふくめてたしたものが、ごうけいのでんばです。','cprep-add'),
 D('同じ大きさで逆向きの矢印なら、合計はゼロです。片方の矢印が大きければ、その差だけが、大きい矢印の向きに残ります。','おなじおおきさでぎゃくむきのやじるしなら、ごうけいはゼロです。かたほうのやじるしがおおきければ、そのさだけが、おおきいやじるしのむきにのこります。','cprep-cancel'))
 ]});c.scenes.forEach((s,i)=>Object.assign(s,{index:i,sceneId:`${c.id}-s${i+1}`,mode:'common'}));
}

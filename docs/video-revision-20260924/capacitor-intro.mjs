const D=(subtitle,reading,diagram)=>({subtitle,reading,display:'diagram',diagram,operation:'',formula:[]});
const F=(subtitle,reading,formula,operation,previousFormula=[])=>({subtitle,reading,display:'equation',formula,operation,previousFormula});
const S=(heading,...cues)=>({heading,cues,utterances:cues.map(({subtitle,reading})=>({subtitle,reading})),narration:cues.map(q=>q.subtitle).join(''),equation:'',symbols:'',visual:'capacitor-intro'});
export const capacitorIntroIds=['e-capacitor-intro'];
export function applyCapacitorIntro(plan){const c=plan.find(c=>c.id==='e-capacitor-intro');if(!c)throw Error('missing capacitor intro');c.manuscriptScenes??=structuredClone(c.scenes);Object.assign(c,{visualPilot:'capacitor-intro-v1',navigationBreaks:[1,2],scenes:[
 S('電池は、二枚の板の電荷をどう変えるか',
 D('今回は、コンデンサーが、何をどこへ蓄えるかを見ます。初めに中性だった二枚の金属板を電池につなぐと、一方の板から電子が取り去られ、もう一方の板に電子が加わります。','こんかいは、コンデンサーが、なにをどこへたくわえるかをみます。はじめにちゅうせいだったにまいのきんぞくばんをでんちにつなぐと、いっぽうのいたからでんしがとりさられ、もういっぽうのいたにでんしがくわわります。','capintro-charge'),
 D('電子が不足した板はプラス、電子が余った板はマイナスになります。理想的なコンデンサーでは、板の間の絶縁体を電子が横切るのではなく、電子は外側の回路を通って移動します。','でんしがふそくしたいたはプラス、でんしがあまったいたはマイナスになります。りそうてきなコンデンサーでは、いたのあいだのぜつえんたいをでんしがよこぎるのではなく、でんしはそとがわのかいろをとおっていどうします。','capintro-insulation')),
 S('片方の板の電荷と、板の間の電圧を比べる',
 D('二枚の板には、同じ大きさの正と負の電荷が分かれて蓄えられます。充電の途中では、片方の板の電荷の大きさが増えるほど、板の間の電圧も上がります。','にまいのいたには、おなじおおきさのせいとふのでんかがわかれてたくわえられます。じゅうでんのとちゅうでは、かたほうのいたのでんかのおおきさがふえるほど、いたのあいだのでんあつもあがります。','capintro-voltage'),
 F('電気容量は、片方の板の電荷の大きさを、板の間の電圧で割った値です。二枚の板の電荷を足すのではなく、片方の大きさを使います。','でんきようりょうは、かたほうのいたのでんかのおおきさを、いたのあいだのでんあつでわったあたいです。にまいのいたのでんかをたすのではなく、かたほうのおおきさをつかいます。',['C=\\frac QV'],'C：電気容量[F]、Q：片方の電荷の大きさ[C]、V：電圧[V]'),
 F('容量の単位はファラドで、一ファラドは、一ボルトあたり一クーロンです。容量の記号シーと、電荷の単位クーロンのシーは、役割が違います。','ようりょうのたんいはファラドで、いちファラドは、いちボルトあたりいちクーロンです。ようりょうのきごうシーと、でんかのたんいクーロンのシーは、やくわりがちがいます。',['1\\,\\mathrm F=1\\,\\frac{\\mathrm C}{\\mathrm V}'],'斜体Cは容量という量。単位Cはクーロン')),
 S('同じ電圧なら、容量が大きい方に多く蓄えられる',
 F('容量の式の両辺に電圧をかけると、電荷は容量かける電圧と分かります。同じ電圧なら、容量が二倍のコンデンサーには、二倍の電荷を蓄えられます。','ようりょうのしきのりょうへんにでんあつをかけると、でんかはようりょうかけるでんあつとわかります。おなじでんあつなら、ようりょうがにばいのコンデンサーには、にばいのでんかをたくわえられます。',['CV=\\frac QV\\,V=Q','\\Rightarrow Q=CV'],'電圧を同じにして容量を比較する',['C=\\frac QV']),
 D('図では、同じ電圧で、容量が二倍の方に二倍の電荷が分かれて蓄えられています。板の形や間隔が容量を変える理由は、次の中級で調べます。','ずでは、おなじでんあつで、ようりょうがにばいのほうににばいのでんかがわかれてたくわえられています。いたのかたちやかんかくがようりょうをかえるりゆうは、つぎのちゅうきゅうでしらべます。','capintro-compare'))
 ]});c.scenes.forEach((s,i)=>Object.assign(s,{index:i,sceneId:`${c.id}-s${i+1}`,mode:'common'}));}

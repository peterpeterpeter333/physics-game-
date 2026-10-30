const D=(subtitle,reading,diagram)=>({subtitle,reading,display:'diagram',diagram,operation:'',formula:[]});
const F=(subtitle,reading,formula,operation)=>({subtitle,reading,display:'equation',formula,operation});
export const foundationAppendixIds=['hm-why-25','ht-why-10'];
export function applyFoundationAppendices(plan){
 const set=(id,heading,cues)=>{const c=plan.find(c=>c.id===id);if(!c)throw Error(id);c.manuscriptScenes??=structuredClone(c.scenes);Object.assign(c,{visualPilot:'foundation-appendices-v1',navigationBreaks:[],scenes:[{index:0,sceneId:id+'-s1',heading,cues,narration:cues.map(q=>q.subtitle).join(''),utterances:cues.map(({subtitle,reading})=>({subtitle,reading})),mode:'thorough',visual:'foundation-appendices',equation:'',symbols:''}]});};
 set('hm-why-25','力が最大の場所と、速さが最大の場所を分ける',[
 D('物体が端に来ると、ばねの伸びや縮みが最も大きいので、力の大きさも最大です。ただし、物体は向きを変えるために一瞬止まるので、その瞬間の速度はゼロです。','ぶったいがはしにくると、ばねののびやちぢみがもっともおおきいので、ちからのおおきさもさいだいです。ただし、ぶったいはむきをかえるためにいっしゅんとまるので、そのしゅんかんのそくどはゼロです。','appendix-shm-ends'),
 D('物体が真ん中に来ると、ばねの力はゼロです。しかし、物体は端から中心まで加速してきたので、真ん中を通るときの速さが最大になります。','ぶったいがまんなかにくると、ばねのちからはゼロです。しかし、ぶったいははしからちゅうしんまでかそくしてきたので、まんなかをとおるときのはやさがさいだいになります。','appendix-shm-center'),
 D('物体は真ん中で止まらず、慣性で通り過ぎます。その後はばねの力が進む向きと逆になるので、物体は減速し、反対側の端で再び向きを変えます。','ぶったいはまんなかでとまらず、かんせいでとおりすぎます。そのあとはばねのちからがすすむむきとぎゃくになるので、ぶったいはげんそくし、はんたいがわのはしでふたたびむきをかえます。','appendix-shm-crossing')]);
 set('ht-why-10','水の量が10倍なら、必要な熱量も10倍か確かめる',[
 F('水の比熱を、一グラム、一度あたり四点二ジュールとします。百グラムの水を一度温める熱量は、百かける四点二かける一で、四百二十ジュールです。','みずのひねつを、いちグラム、いちどあたりよんてんにジュールとします。ひゃくグラムのみずをいちどあたためるねつりょうは、ひゃくかけるよんてんにかけるいちで、よんひゃくにじゅうジュールです。',['Q=100\\times4.2\\times1=420\\,\\mathrm J'],'Q：水が受け取る熱量[J]。質量100 g、比熱4.2 J/(g K)、温度差1 K'),
 F('千グラムの水でも、比熱と上げたい温度は同じです。質量だけを千に変えると、必要な熱量は四千二百ジュールで、百グラムの場合の十倍になります。','せんグラムのみずでも、ひねつとあげたいおんどはおなじです。しつりょうだけをせんにかえると、ひつようなねつりょうはよんせんにひゃくジュールで、ひゃくグラムのばあいのじゅうばいになります。',['Q=1000\\times4.2\\times1=4200\\,\\mathrm J'],'同じ水・同じ温度差。容器や外へ渡る熱量は含めない'),
 D('千グラムの水は、百グラムの水を十組集めた量です。それぞれを同じ一度だけ温めるので、一組分の熱量を十組分足した結果と一致します。','せんグラムのみずは、ひゃくグラムのみずをじゅっくみあつめたりょうです。それぞれをおなじいちどだけあたためるので、ひとくみぶんのねつりょうをじゅっくみぶんたしたけっかといっちします。','appendix-heat-ten-groups')]);
}

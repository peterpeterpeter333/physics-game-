const D=(subtitle,reading,diagram)=>({subtitle,reading,display:'diagram',diagram,operation:'',formula:[]});
const F=(subtitle,reading,formula,operation,previousFormula=[])=>({subtitle,reading,display:'equation',formula,operation,previousFormula});
const S=(heading,...cues)=>({heading,cues,utterances:cues.map(({subtitle,reading})=>({subtitle,reading})),narration:cues.map(q=>q.subtitle).join(''),equation:'',symbols:'',visual:'light-interference'});
export const lightInterferenceIds=['w-interference-intro','hw-why-11'];
export function applyLightInterference(plan){
 const set=(id,scenes,breaks)=>{const c=plan.find(c=>c.id===id);if(!c)throw Error(id);c.manuscriptScenes??=structuredClone(c.scenes);Object.assign(c,{visualPilot:'light-interference-v1',navigationBreaks:breaks,scenes});scenes.forEach((s,i)=>Object.assign(s,{index:i,sceneId:`${id}-s${i+1}`,mode:id.startsWith('hw-')?'thorough':'common'}));};
 set('w-interference-intro',[
 S('二つの光では、何を足し合わせるのか',
 D('今回は、光を二つ重ねたのに暗くなる理由を考えます。光の電場は、電荷に力を及ぼす向きと強さを表し、時間とともに振動します。','こんかいは、ひかりをふたつかさねたのにくらくなるりゆうをかんがえます。ひかりのでんばは、でんかにちからをおよぼすむきとつよさをあらわし、じかんとともにしんどうします。','lightinterference-field-sign'),
 D('二つの光が同じ場所に来ると、その場所の電場が足し合わされます。同じ大きさで逆向きなら、プラスとマイナスが打ち消し合い、合計の電場はゼロです。','ふたつのひかりがおなじばしょにくると、そのばしょのでんばがたしあわされます。おなじおおきさでぎゃくむきなら、プラスとマイナスがうちけしあい、ごうけいのでんばはゼロです。','lightinterference-cancellation')),
 S('暗い場所があっても、全体の光が消えるわけではない',
 D('同じ振動数で、揺れる向きがそろい、振動のずれが一定の二つの光を考えます。場所によって到着のずれが違うので、打ち消す場所と強め合う場所が並びます。','おなじしんどうすうで、ゆれるむきがそろい、しんどうのずれがいっていのふたつのひかりをかんがえます。ばしょによってとうちゃくのずれがちがうので、うちけすばしょとつよめあうばしょがならびます。','lightinterference-fringes'),
 D('暗い場所だけを見ると、光が消えたように見えます。しかし明るい場所では光が強くなっていて、全体のエネルギーが消えてしまったわけではありません。','くらいばしょだけをみると、ひかりがきえたようにみえます。しかしあかるいばしょではひかりがつよくなっていて、ぜんたいのエネルギーがきえてしまったわけではありません。','lightinterference-redistribution')),
 S('道の長さの差から、到着のずれを予想する',
 D('同じタイミングで出た波でも、片方の道が半波長だけ長ければ、山に対して谷が届きます。半周期ぶんの到着のずれが、振動の向きを逆にします。','おなじタイミングででたなみでも、かたほうのみちがはんはちょうだけながければ、やまにたいしてたにがとどきます。はんしゅうきぶんのとうちゃくのずれが、しんどうのむきをぎゃくにします。','lightinterference-path-half'),
D('片方の道が一波長だけ長い場合は、一周期ぶんずれます。一周して同じ状態に戻るので、到着した山どうしは再びそろいます。','かたほうのみちがいちはちょうだけながいばあいは、いっしゅうきぶんずれます。いっしゅうしておなじじょうたいにもどるので、とうちゃくしたやまどうしはふたたびそろいます。','lightinterference-path-full'),
 F('道の長さの差を波長と比べると、強め合う場所を予想できます。次の二重スリットでは、この条件を使って、明るい縞の位置を求めます。','みちのながさのさをはちょうとくらべると、つよめあうばしょをよそうできます。つぎのにじゅうスリットでは、このじょうけんをつかって、あかるいしまのいちをもとめます。',['\\Delta\\ell=m\\lambda'],'Δℓ：道の長さの差[m]、λ：波長[m]、m：整数。同位相で出た同じ振動数の光'))
 ],[1,2]);
 set('hw-why-11',[
 S('電場の大きさと、光の明るさは別の量',
 D('波の山は、電場がプラスに最大になるところで、谷はマイナスに最大になるところです。同じ大きさの山と谷が重なる場所では、合計の電場がゼロになります。','なみのやまは、でんばがプラスにさいだいになるところで、たにはマイナスにさいだいになるところです。おなじおおきさのやまとたにがかさなるばしょでは、ごうけいのでんばがゼロになります。','lightinterferenceinsert-opposite-fields'),
 D('反対に、山どうしが重なる場所では、電場の振幅が二倍になります。ここでは、二つの光の振幅が等しく、揺れる向きもそろっている場合を比べます。','はんたいに、やまどうしがかさなるばしょでは、でんばのしんぷくがにばいになります。ここでは、ふたつのひかりのしんぷくがひとしく、ゆれるむきもそろっているばあいをくらべます。','lightinterferenceinsert-reinforcement'),
 F('同じ物質中では、光の強さは電場の振幅の二乗に比例します。振幅が二倍なら、二倍を二乗して、光の強さは一つの光だけの四倍です。','おなじぶっしつちゅうでは、ひかりのつよさはでんばのしんぷくのにじょうにひれいします。しんぷくがにばいなら、にばいをにじょうして、ひかりのつよさはひとつのひかりだけのよんばいです。',['\\frac I{I_0}=\\left(\\frac{2A}{A}\\right)^2=4'],'A：一つの光の電場の振幅。I_0：一つの光の強さ、I：合成した光の強さ'),
 D('二つの光が作る明暗全体を見ると、暗い所の減少と明るい所の増加がつり合います。干渉はエネルギーを消す現象ではなく、光の強さの分布を変える現象です。','ふたつのひかりがつくるめいあんぜんたいをみると、くらいところのげんしょうとあかるいところのぞうかがつりあいます。かんしょうはエネルギーをけすげんしょうではなく、ひかりのつよさのぶんぷをかえるげんしょうです。','lightinterferenceinsert-energy-accounting'))
 ],[]);
}

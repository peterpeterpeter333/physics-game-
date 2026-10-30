const D=(subtitle,reading,diagram)=>({subtitle,reading,display:'diagram',diagram,operation:'',formula:[]});
const F=(subtitle,reading,formula,operation,previousFormula=[])=>({subtitle,reading,display:'equation',formula,operation,previousFormula});
const S=(heading,...cues)=>({heading,cues,utterances:cues.map(({subtitle,reading})=>({subtitle,reading})),narration:cues.map(q=>q.subtitle).join(''),equation:'',symbols:'',visual:'doppler-observer'});
export const dopplerObserverIds=['w-doppler-advanced','hw-why-06'];
export function applyDopplerObserver(plan){
 const set=(id,scenes,breaks)=>{const c=plan.find(c=>c.id===id);if(!c)throw Error(id);c.manuscriptScenes??=structuredClone(c.scenes);Object.assign(c,{visualPilot:'doppler-observer-v1',navigationBreaks:breaks,scenes});scenes.forEach((s,i)=>Object.assign(s,{index:i,sceneId:`${id}-s${i+1}`,mode:id.startsWith('hw-')?'thorough':'common'}));};
 set('w-doppler-advanced',[
 S('音源を止めて、聞く人だけを動かす',
 D('今回は、音源が止まり、聞く人だけが音源へ近づく場合を考えます。空気の中の山の間隔は変わりませんが、聞く人は山に向かって進むので、山と出会うペースが増えます。','こんかいは、おんげんがとまり、きくひとだけがおんげんへちかづくばあいをかんがえます。くうきのなかのやまのかんかくはかわりませんが、きくひとはやまにむかってすすむので、やまとであうペースがふえます。','dopplerobserver-fixed-wavelength')),
 S('山と出会う速さから、受け取る振動数を求める',
 D('音の山は音速で右へ進み、聞く人は左へ向かうとします。互いに向かうので、両者の間の距離が縮む速さは、音速と聞く人の速さの和です。','おとのやまはおんそくでみぎへすすみ、きくひとはひだりへむかうとします。たがいにむかうので、りょうしゃのあいだのきょりがちぢむはやさは、おんそくときくひとのはやさのわです。','dopplerobserver-closing-distance'),
 F('次の山までの距離は一波長なので、次の山と出会うまでの時間は、波長割る出会う速さです。その逆数が、一秒あたりに受け取る山の数になります。','つぎのやままでのきょりはいちはちょうなので、つぎのやまとであうまでのじかんは、はちょうわるであうはやさです。そのぎゃくすうが、いちびょうあたりにうけとるやまのかずになります。',['f_{\\mathrm r}=\\frac{v+u_o}{\\lambda}'],'v：音速、u_o：山へ向かう人の速さ[m/s]。λ：波長[m]。T_r：届く周期[s]、f_r：受け取る振動数[Hz]',['T_{\\mathrm r}=\\frac\\lambda{v+u_o}','\\qquad','f_{\\mathrm r}=\\frac1{T_{\\mathrm r}}']),
 F('止まった音源が作る波長は、音速割る音源の振動数です。この波長を代入し、分数で割る代わりに逆数を掛けると、音源の振動数との関係が出ます。','とまったおんげんがつくるはちょうは、おんそくわるおんげんのしんどうすうです。このはちょうをだいにゅうし、ぶんすうでわるかわりにぎゃくすうをかけると、おんげんのしんどうすうとのかんけいがでます。',['f_{\\mathrm r}=\\frac{v+u_o}{v}f_{\\mathrm s}'],'f_s：音源の振動数、f_r：受け取る振動数[Hz]。T_r：届く周期[s]',['f_{\\mathrm r}=\\frac{v+u_o}{v/f_{\\mathrm s}}'])),
 S('音源の移動と、聞く人の移動は働く場所が違う',
 D('音源が動く場合は、空気中の波長そのものが変わります。聞く人だけが動く場合は、同じ波長の山と出会う速さが変わるので、二つの場合を区別します。','おんげんがうごくばあいは、くうきちゅうのはちょうそのものがかわります。きくひとだけがうごくばあいは、おなじはちょうのやまとであうはやさがかわるので、ふたつのばあいをくべつします。','dopplerobserver-two-causes'),
 F('音は空気の中を伝わるため、空気に対して誰が動くかが重要です。近づく速さが同じでも、音源の移動は分母、聞く人の移動は分子を変えるため、聞こえる振動数は少し違います。','おとはくうきのなかをつたわるため、くうきにたいしてだれがうごくかがじゅうようです。ちかづくはやさがおなじでも、おんげんのいどうはぶんぼ、きくひとのいどうはぶんしをかえるため、きこえるしんどうすうはすこしちがいます。',['\\frac{f_{\\mathrm r}}{f_{\\mathrm s}}=\\frac v{v-u_s}','\\qquad','\\frac{f_{\\mathrm r}}{f_{\\mathrm s}}=\\frac{v+u_o}{v}'],'左：音源だけ近づく。右：聞く人だけ近づく。速さは空気に対する値'))
 ],[1,2]);
 set('hw-why-06',[
 S('同じ34 m/sでも、どちらが動くかで倍率が違う',
 D('音速は毎秒三百四十メートルとし、聞く人が毎秒三十四メートルで音源へ近づく場合を考えます。音源は止まっているので波長は変わらず、山と出会う速さだけが増えます。','おんそくはまいびょうさんびゃくよんじゅうメートルとし、きくひとがまいびょうさんじゅうよんメートルでおんげんへちかづくばあいをかんがえます。おんげんはとまっているのではちょうはかわらず、やまとであうはやさだけがふえます。','dopplerobserver-numeric-comparison'),
 F('聞く人が動くときの倍率は、三百四十に三十四を足し、三百四十で割って一・一です。音源が同じ速さで近づくときは、分母を引き算にして、約一・一一倍になります。','きくひとがうごくときのばいりつは、さんびゃくよんじゅうにさんじゅうよんをたし、さんびゃくよんじゅうでわっていってんいちです。おんげんがおなじはやさでちかづくときは、ぶんぼをひきざんにして、やくいってんいちいちばいになります。',['\\frac{340+34}{340}=1.1','\\qquad','\\frac{340}{340-34}\\approx1.11'],'左：聞く人が近づく。右：音源が近づく。空気はどちらも静止'),
 F('二つの倍率の違いは、丸め方のせいではありません。一方は山と出会う速さの増加、他方は山の間隔の減少なので、別の計算になります。','ふたつのばいりつのちがいは、まるめかたのせいではありません。いっぽうはやまとであうはやさのぞうか、たほうはやまのかんかくのげんしょうなので、べつのけいさんになります。',['\\frac{374}{340}=\\frac{11}{10}','\\qquad','\\frac{340}{306}=\\frac{10}{9}'],'正確な比でも、11/10と10/9は等しくない'))
 ],[]);
}

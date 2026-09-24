const D=(subtitle,reading,diagram)=>({subtitle,reading,display:'diagram',diagram,operation:'',formula:[]});
const F=(subtitle,reading,formula,operation,previousFormula=[])=>({subtitle,reading,display:'equation',formula,operation,previousFormula});
const S=(heading,...cues)=>({heading,cues,utterances:cues.map(({subtitle,reading})=>({subtitle,reading})),narration:cues.map(q=>q.subtitle).join(''),equation:'',symbols:'',visual:'radian-foundations'});
export const radianFoundationIds=['prep-radian'];
export function applyRadianFoundations(plan){
 const c=plan.find(c=>c.id==='prep-radian');if(!c)throw Error('Missing radian');c.manuscriptScenes??=structuredClone(c.scenes);
 const scenes=[
 S('角度を、弧の長さと半径の比で表す',
 D('今回は、回転した角度から、円周上を進んだ距離を求めます。円周の一部分の長さを弧の長さと呼び、黄色で示します。','こんかいは、かいてんしたかくどから、えんしゅうじょうをすすんだきょりをもとめます。えんしゅうのいちぶぶんのながさをこのながさとよび、きいろでしめします。','radian-arc'),
 D('同じ角度でも、円が大きければ弧も長くなります。弧の長さを半径で割ると、円の大きさによらず、同じ角度には同じ値が得られます。','おなじかくどでも、えんがおおきければこもながくなります。このながさをはんけいでわると、えんのおおきさによらず、おなじかくどにはおなじあたいがえられます。','radian-ratio'),
 F('この比で表す角度の単位が、ラジアンです。半径二メートル、弧の長さ一メートルなら、一を二で割って零点五ラジアンになります。','このひであらわすかくどのたんいが、ラジアンです。はんけいにメートル、このながさいちメートルなら、いちをにでわってれいてんごラジアンになります。',['\\theta=\\frac{s}{r}','=','\\frac{1\\,\\mathrm m}{2\\,\\mathrm m}','=','0.5\\,\\mathrm{rad}'],'θ（シータ）：角度、s：弧の長さ、r：半径、rad：ラジアン')),
 S('一周と半周を、ラジアンに直す',
 D('点が一周すると、進んだ弧の長さは円周そのものです。円周は半径の二パイ倍なので、半径で割れば二パイが残ります。','てんがいっしゅうすると、すすんだこのながさはえんしゅうそのものです。えんしゅうははんけいのにパイばいなので、はんけいでわればにパイがのこります。','radian-full-turn'),
 F('一周の三百六十度は、二パイラジアンです。半周はその半分なので、百八十度はパイラジアンになります。','いっしゅうのさんびゃくろくじゅうどは、にパイラジアンです。はんしゅうはそのはんぶんなので、ひゃくはちじゅうどはパイラジアンになります。',['360^\\circ=2\\pi\\,\\mathrm{rad}','\\qquad','180^\\circ=\\pi\\,\\mathrm{rad}'],'π（パイ）：円周率、約3.14',['\\theta=\\frac{2\\pi r}{r}=2\\pi'])),
 S('角度が増える割合を、角速度と呼ぶ',
 D('一定の速さで回る点が、一周するのに四秒かかるとします。一秒で四分の一周ずつ進むので、角度は一秒ごとにパイの半分ずつ増えます。','いっていのはやさでまわるてんが、いっしゅうするのによんびょうかかるとします。いちびょうでよんぶんのいっしゅうずつすすむので、かくどはいちびょうごとにパイのはんぶんずつふえます。','radian-clock'),
 F('角度が一秒あたりに増える割合を、角速度と呼びます。一周の角度を一周の時間で割ると、この点の角速度は、二パイ割る四で、パイの半分ラジアン毎秒です。','かくどがいちびょうあたりにふえるわりあいを、かくそくどとよびます。いっしゅうのかくどをいっしゅうのじかんでわると、このてんのかくそくどは、にパイわるよんで、パイのはんぶんラジアンまいびょうです。',['\\omega=\\frac{2\\pi}{T}','=','\\frac{2\\pi}{4}','=','\\frac{\\pi}{2}\\,\\mathrm{rad/s}'],'ω（オメガ）：角速度、T：一周の時間（周期）')),
 S('角度から距離へ、角速度から速さへ',
 F('角度の定義の両側に半径を掛けると、弧の長さは半径かける角度になります。半径が変わらないなら、進んだ弧の長さも、半径かける角度の変化で求められます。','かくどのていぎのりょうがわにはんけいをかけると、このながさははんけいかけるかくどになります。はんけいがかわらないなら、すすんだこのながさも、はんけいかけるかくどのへんかでもとめられます。',['s=r\\theta','\\qquad','\\Delta s=r\\Delta\\theta'],'Δ：この時間内に増えた分。角度はラジアン',['\\theta=\\frac{s}{r}']),
 F('一秒あたりに進む距離を求めるため、両側を同じ経過時間で割ります。左側は速さ、右側の角度の変化割る時間は角速度なので、速さは半径かける角速度です。','いちびょうあたりにすすむきょりをもとめるため、りょうがわをおなじけいかじかんでわります。ひだりがわははやさ、みぎがわのかくどのへんかわるじかんはかくそくどなので、はやさははんけいかけるかくそくどです。',['v','=','r\\omega'],'v：円周上の速さ [m/s]、r：半径 [m]、ω：角速度 [rad/s]',['\\frac{\\Delta s}{\\Delta t}','=','r\\frac{\\Delta\\theta}{\\Delta t}']),
 D('同じ時間に同じ角度だけ回っても、外側の点は長い距離を進みます。同じ角速度なら、半径が二倍の点は、速さも二倍になると分かりました。','おなじじかんにおなじかくどだけまわっても、そとがわのてんはながいきょりをすすみます。おなじかくそくどなら、はんけいがにばいのてんは、はやさもにばいになるとわかりました。','radian-two-speeds'))];
 Object.assign(c,{visualPilot:'radian-foundations-v1',renderer:'lesson',mediaDirectory:'revisions',navigationBreaks:[1,2,3],scenes});c.scenes.forEach((s,i)=>Object.assign(s,{index:i,sceneId:`${c.id}-s${i+1}`,mode:'common'}));
}

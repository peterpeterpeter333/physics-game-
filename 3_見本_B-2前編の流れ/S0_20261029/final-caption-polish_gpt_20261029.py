"""Before freeze only: keep narration unchanged, split long captions at semantic
line boundaries, and remove artificial comma pauses from score pronunciation.
"""
from pathlib import Path
import json,sys
W=Path(__file__).resolve().parents[3];OUT=Path(__file__).resolve().parent
sys.path.insert(0,str(W/'scripts'));sys.path.insert(0,str(W/'scripts/umech'))
import prosody
P=W/'docs/video-revision-20260924/ytseries/chain-b-2a_gpt_20261029.mjs'
raw=P.read_text();data=json.loads(raw.split('const DATA=',1)[1].split(';\nconst scenes=',1)[0])
splits={
 '電気と電波の前の回で分かったように、':'まえの',
 '医者で学者のルイージ・ガルヴァーニの机の上に、':'ガルバーニ',
 '死んだカエルの足があります。':'あしが',
 'ずっと流し続ける道具が生まれました。':'どおぐが',
 'こすって作る静電気だけでした。':'せえでんき',
 'ガラスを布でこすってためた電気は、':'ためた',
 'コップ1杯の水をためたようなものです。':'ためた',
 'カエルの足と電気を調べました。':'でんきお',
 '金属を当てただけでぴくっとした時も、':'ぴくっと',
 '体の中の電気を通す道にすぎない、':'とおす',
 'パヴィーアの大学で物理を教えていた、':'ぶつりお',
 '棒の組み合わせを変えてみました。':'かえて',
 '違う2種類の金属の出会いから生まれる。':'であい',
 'とても敏感な道具にすぎない。':'どおぐ',
 '火事の警報器のようなものです。':'よおな',
 '煙を出しているわけではありません。':'わけ',
 '塩水をしみこませた厚紙に代えました。':'あつがみ',
 'しょっぱい水でぬれているからです。':'ぬれて',
 'ぬらした自分の指に代えました。':'ゆびに',
 '亜鉛と塩水の厚紙と銅の組を、':'あつがみ',
 'ガラスの瓶の中の2枚の薄い金の葉が、':'にまい',
 '電気を感じる係だったんですね。':'だった',
 '全部がまちがいではなかったのです。':'でわ',
 'この机のぴくっの源はカエル、':'みなもと',
 '流れた水をくみ上げ続けるポンプが、':'くみあげ',
 '目に見えない粒の大きさまで開けて見る、':'おおきさ',
 'カエルの足をぴくっとさせた電気は、':'ぴくっと',
}
changes=[]
for q in data:
 if q['key']=='r08:a':
  i=next(i for i,c in enumerate(q['cap']) if ''.join(c)=='言い伝え 0 − 3 実験。')
  q['capReading'][i]='いいつたえ れい たい さん じっけん。'
  q['reading']=''.join(q['capReading'])
  label,ph,ref=prosody.best(q['reading'],q['text']);q['kana']=prosody.to_aquestalk(ph)
  changes.append({'key':q['key'],'reason':'remove engine-added comma pauses inside score; spoken words unchanged','kana':q['kana'],'prosody':label})
 cap=[];reading=[]
 for a,r in zip(q['cap'],q['capReading']):
  text=''.join(a)
  if text in splits:
   assert len(a)==2,(text,a)
   pos=r.index(splits[text]);assert pos>0
   cap.extend([[a[0]],[a[1]]]);reading.extend([r[:pos],r[pos:]])
   changes.append({'key':q['key'],'caption':text,'split':a})
  else:cap.append(a);reading.append(r)
 assert ''.join(reading)==q['reading'];assert ''.join(''.join(a) for a in cap)==q['text']
 q['cap']=cap;q['capReading']=reading
P.write_text(raw.split('const DATA=',1)[0]+'const DATA='+json.dumps(data,ensure_ascii=False,indent=2)+';\nconst scenes='+raw.split(';\nconst scenes=',1)[1])
(OUT/'last-caption-polish-before-freeze.json').write_text(json.dumps(changes,ensure_ascii=False,indent=2))
print(len(changes),'changes; master displayed text unchanged.')

"""Offline regression checks; --engine also verifies the live Nemo reading."""
import json,sys,urllib.request,urllib.parse,concurrent.futures,hashlib,re
from pathlib import Path
from narration_pronunciation import OVERRIDES,spoken_text,speech_key,validate_query,clip_fingerprint

root=Path(__file__).resolve().parent.parent
clips=[c for family in ['lesson','prerequisite','em'] for c in json.loads((root/f'src/content/{family}-video-catalog.generated.json').read_text())]
texts={cap['text'] for c in clips for s in c['scenes'] for cap in s['captions']}
assert len(clips)==332 and len(texts)==2396
assert len(set(OVERRIDES)&texts)==295
paper_clips=[json.loads(p.read_text()) for p in (root/'public/media/paper-battles').glob('*.json')]
assert len(paper_clips)==18
paper_texts={cap['text'] for c in paper_clips for s in c['scenes'] for cap in s['captions']}
assert set(OVERRIDES)<=texts|paper_texts
for text in paper_texts:
 if '負' in text:assert 'フ' in OVERRIDES[text]['expectedKana'] and 'マケ' not in OVERRIDES[text]['expectedKana']
 if '上向き' in text:assert 'ウエムキ' in OVERRIDES[text]['expectedKana']
 if '毎' in text:assert 'マイ' in OVERRIDES[text]['expectedKana']
 if '積の和' in text:assert 'セキノワ' in OVERRIDES[text]['expectedKana']
audit=json.loads((root/'docs/video-scripts/pronunciation-audit-20260923.json').read_text())
assert sum(f['count'] for f in audit['findings'])==292
assert len({f['name'] for f in audit['findings']})==41
required={
 '値':'アタイ','割る':'ワル','辺':'ヘン','初速度':'ショソクド','二分の…':'ニブンノ','四分の…':'ヨンブンノ','五分の二':'ゴブンノニ',
 '時定数':'ジテ[イエ]スウ','波源':'ハゲン','核子':'カクシ','導関数':'ドオカンスウ','数直線':'スウチョクセン','球殻':'キュウカク',
 '球対称':'キュウタイショオ','数密度':'スウミツド','巻数':'マキスウ','対数の底':'テイ','分かける':'ブンカケル','出る分':'デルブン',
 '同じ':'オナジ','力（単独）':'チカラ','ローレンツ力':'ロオレンツリョク','和':'ワ','右下がり':'ミギサガリ','斜め上':'ナナメウエ',
 '音の山':'オトノヤマ','小さい':'チイサイ','大きい':'オオキイ','止めれば':'トメレバ','道':'ミチニヨラズ','床':'ユカ','手':'テカラ',
 '向き':'ムキ','いちばん上':'イチバンウエ','はみ出し':'ハミダシ','は球（語の境界）':'ワタマ','計算中の四':'ヨン',
 '十分小さな':'ジュウブンチイサナ','〇点七一':'レイテンナナイチ','〇点六三二':'レイテンロクサンニ','遠ければ':'トオケレバ'}
for f in audit['findings']:
 assert f['text'] in OVERRIDES,f
 assert len(re.findall(required[f['name']],OVERRIDES[f['text']]['expectedKana']))>=f['count'],f
assert spoken_text('電場・磁場・電気束')=='でんば・じば・でんきそく'
assert spoken_text('絶対値と最大値、合力と三辺。')=='絶対値と最大値、合力と三辺。'
assert spoken_text('板の間隔。')=='板の間隔。'
for text,record in OVERRIDES.items():
 assert record['expectedKana'] and record['spoken']!=text
 validate_query(text,{'accent_phrases':[{'moras':[{'text':record['expectedKana']}]}]})
 try:validate_query(text,{'accent_phrases':[{'moras':[{'text':'バグ'}]}]})
 except ValueError:pass
 else:raise AssertionError('Wrong engine readings must fail closed')
 legacy=hashlib.sha256(f'10001|.90|.15|.2|{record["spoken"]}'.encode()).hexdigest()[:24]
 assert speech_key(text)!=legacy,'Reviewed speech must not reuse an unchecked cache'
affected=[c for c in clips if clip_fingerprint(c)]
assert len(affected)==188
if '--source-only' not in sys.argv:
 for c in clips+paper_clips:
  expected=clip_fingerprint(c)
  if expected:assert c.get('pronunciationFingerprint')==expected,f'{c["id"]}: stale video'
  prev=0
  for s in c['scenes']:
   assert s['start']>=prev and s['end']>s['start']
   assert ''.join(cap['text'] for cap in s['captions'])==s['narration']
   for cap in s['captions']:assert s['start']<=cap['start']<cap['end']<=s['end']
   prev=s['end']
  assert abs(prev-c['duration'])<.001
if '--engine' in sys.argv:
 def check(item):
  text,record=item
  url='http://127.0.0.1:50123/audio_query?'+urllib.parse.urlencode({'text':spoken_text(text),'speaker':10001})
  q=json.loads(urllib.request.urlopen(urllib.request.Request(url,data=b''),timeout=120).read())
  validate_query(text,q)
 with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:list(pool.map(check,OVERRIDES.items()))
print(f'PASS: 41 legacy finding types / 292 occurrences; {len(OVERRIDES)} sentence readings; {len(affected)} legacy affected videos and 18 battle movies; unchanged subtitles; '+('live engine checked' if '--engine' in sys.argv else 'offline regression'))

"""Audit actual Nemo analysis locally; report evidence, not an assertion of perfect pronunciation."""
from pathlib import Path
import json, urllib.request, urllib.parse, concurrent.futures
from narration_pronunciation import word_reading
root=Path('docs/video-revision-20260924')
ledger=json.loads((root/'import-ledger.generated.json').read_text())
rows=[dict(pair,source=doc['file']) for doc in ledger['documents'] for section in doc['sections'] for pair in section['pairs']]
def inspect(row):
    reading=word_reading(row['reading'])
    url='http://127.0.0.1:50123/audio_query?'+urllib.parse.urlencode({'speaker':10001,'text':reading})
    with urllib.request.urlopen(urllib.request.Request(url,data=b''),timeout=60) as response:
        query=json.load(response)
    kana=''.join(m['text'] for phrase in query['accent_phrases'] for m in phrase['moras'])
    expected={'でんば':['デンバ'],'じば':['ジバ'],'でんきそく':['デンキソク'],'じそく':['ジソク'],
              'ほうせん':['ホーセン','ホオセン'],'いちよう':['イチヨー','イチヨオ'],'しょそくど':['ショソクド']}
    warnings=[f'{word} → expected {value}' for word,value in expected.items() if word in reading and not any(option in kana for option in value)]
    return dict(row,engineReading=reading,actualKana=kana,warnings=warnings)
results=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
    for index,result in enumerate(pool.map(inspect,rows)):
        results.append(result)
        if (index+1)%100==0: print(f'{index+1}/{len(rows)} analyzed',flush=True)
report={'engine':'VOICEVOX Nemo local speaker 10001','rows':results,'flaggedRows':sum(bool(r['warnings']) for r in results),
        'limits':'Kana keyword checks do not replace listening. This audit does not regenerate existing published audio.'}
(root/'nemo-reading-audit.generated.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(f'{len(results)} rows; {report["flaggedRows"]} keyword warnings',flush=True)

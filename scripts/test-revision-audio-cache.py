"""Offline regression: a new manuscript title must not truncate cached audio."""
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import wave
from narration_fluency import VERSION,SPACING_VERSION

with tempfile.TemporaryDirectory(prefix='physics-audio-cache-') as directory:
    root=Path(directory)
    scene={'index':0,'narration':'確認します。','utterances':[{'subtitle':'確認します。','reading':'かくにんします。'}]}
    entry={'id':'cache-regression','title':'New title','duration':9,'scenes':[scene]}
    (root/'plan.json').write_text(json.dumps([entry,{'id':'not-selected'}]))
    cached={**entry,'title':'Old title','duration':1,'wordReadingVersion':'20260924-v1','fluencyVersion':VERSION,'spacingVersion':SPACING_VERSION,
            'scenes':[{**scene,'start':0,'end':1,'captions':[{'start':0,'end':1,'text':'確認します。'}]}]}
    (root/'cache-regression.json').write_text(json.dumps(cached))
    with wave.open(str(root/'cache-regression.wav'),'wb') as audio:
        audio.setparams((1,2,24000,0,'NONE','not compressed'))
        audio.writeframes(bytes(48000))
    # A broken local endpoint proves this path reuses audio rather than making
    # another synthesis request. No test requests external services.
    env={**os.environ,'EM_FILM_CACHE':str(root),'NEMO_URL':'http://127.0.0.1:1'}
    subprocess.run([sys.executable,'scripts/render-em-film-audio.py','cache-regression'],env=env,check=True)
    result=json.loads((root/'cache-regression.json').read_text())
    assert result['title']=='New title'
    assert result['duration']==1==result['scenes'][-1]['end']
    manifest=json.loads((root/'timed-selection.json').read_text())
    assert [clip['id'] for clip in manifest]==['cache-regression']
    assert not (root/'timed-plan.json').exists()
print('PASS: cached audio duration, metadata refresh, and selected-only timing manifest')

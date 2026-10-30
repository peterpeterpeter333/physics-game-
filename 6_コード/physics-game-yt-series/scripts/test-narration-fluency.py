"""No network needed: preserve words, punctuation, and synchronized clocks."""
import copy,importlib.util,os
from narration_fluency import fluent_query,formatting_pause_indices,VERSION,guided_query,mora_signature,spacing_query,normalized_reading
q={'accent_phrases':[{'moras':[{'text':x,'vowel_length':.1}], 'accent':1,'pause_mora':{'vowel_length':.3} if i<3 else None} for i,x in enumerate(['ミズ','ヒャク','グラム','デス'])]}
original=copy.deepcopy(q)
assert formatting_pause_indices('みず ひゃく グラム、です。',q)==[0,1]
new=fluent_query('みず ひゃく グラム、です。',q)
assert q==original
assert new['accent_phrases'][0]['pause_mora'] is None
assert new['accent_phrases'][1]['pause_mora'] is None
assert new['accent_phrases'][2]['pause_mora']==q['accent_phrases'][2]['pause_mora']
assert [p['moras'] for p in new['accent_phrases']]==[p['moras'] for p in q['accent_phrases']]
assert formatting_pause_indices('みず？ ひゃく グラム、です。',q)==[1]
reference={'accent_phrases':[{'moras':[{'text':'バ','consonant':'b','vowel':'a','vowel_length':.1}],'accent':1,'pause_mora':None}]}
candidate=copy.deepcopy(reference)
chosen,status=guided_query('場',candidate,'ば',reference)
assert status=='natural-reading-matched'
candidate['accent_phrases'][0]['moras'][0].update(text='ジョ',consonant='j',vowel='o')
chosen,status=guided_query('場',candidate,'ば',reference)
assert status=='furigana-fallback' and mora_signature(chosen)==mora_signature(reference)
assert normalized_reading(' でんば の\n あたい ')=='でんばのあたい'
chosen,status=spacing_query('ば',reference,candidate)
assert status=='reference-phonemes-preserved' and mora_signature(chosen)==mora_signature(reference)
chosen,status=spacing_query('ば',reference,reference)
assert status=='normalized-furigana'
try:fluent_query('みず です。',q);raise AssertionError('ambiguous alignment accepted')
except ValueError:pass
os.environ.setdefault('FFMPEG','unused')
spec=importlib.util.spec_from_file_location('repair','scripts/repair-video-fluency.py')
mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
cuts=[(1,2),(4,4.5)]
assert [mod.map_time(t,cuts) for t in [0,1,1.5,2,3,4,4.5,5]]==[0,1,1,1,2,3,3,3.5]
print('PASS: whitespace pauses only; exact moras and punctuation preserved; clock mapping')

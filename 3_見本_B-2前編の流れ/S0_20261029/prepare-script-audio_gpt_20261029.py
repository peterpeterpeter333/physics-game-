"""New B-2a asset builder. Existing master, renderer, shared code stay untouched.
Only source in this new production is mechanically emitted; originals are read-only.
"""
from pathlib import Path
import json, re, sys, urllib.request, urllib.parse, hashlib, time

W=Path(__file__).resolve().parents[3]
OUT=Path(__file__).resolve().parent
MASTER=W/'docs/video-revision-20260924/deep/技術の疑問の鎖_B-2_前編_第1版_ナレーション.md'
SCRIPT=W/'docs/video-revision-20260924/ytseries/chain-b-2a_gpt_20261029.mjs'
ID='ys-chain-b2a_gpt_20261029'
CACHE=Path('/private/tmp/ys')/ID
sys.path.insert(0,str(W/'scripts'))
sys.path.insert(0,str(W/'scripts/umech'))
from narration_pronunciation import spoken_text
from narration_fluency import mora_signature
import prosody

REPLACE={
 'ガルヴァーニ':'ガルヴァーニ','パヴィーア':'パヴィーア','ヴォルタ':'ヴォルタ',
 'テレラ':'テレラ','S極':'エスきょく','N極':'エヌきょく','神経':'しんけい',
 '真鍮':'しんちゅう','亜鉛':'あえん','電堆':'でんたい','検電器':'けんでんき',
 '金の葉':'きんのハ','金の薄い葉':'きんのうすいハ','塩水':'しおみず',
 '1.5ボルト':'いってんごボルト','0 − 3':'れい たい さん',
 '1点':'いってん','1組':'ひとくみ','2つ':'ふたつ','2本':'にほん',
 '2種類':'にしゅるい','1本':'いっぽん','1つ':'ひとつ',
 '1800年':'せんハっぴゃくねん','1791年':'せんななひゃくきゅうじゅういちねん',
 '1780年代':'せんななひゃくハちじゅうねんだい','20年後':'にじゅうねんご',
 '千倍':'せんばい','何千ボルト':'なんぜんボルト', '3月':'さんがつ',
}
def pronounced(s):
    for a,b in sorted(REPLACE.items(),key=lambda p:-len(p[0])):s=s.replace(a,b)
    return spoken_text(s)
def post(s,speaker=10001):
    url='http://127.0.0.1:50123/audio_query?'+urllib.parse.urlencode({'text':s,'speaker':speaker})
    req=urllib.request.Request(url,data=b'',method='POST')
    return json.loads(urllib.request.urlopen(req,timeout=120).read())
def jw(s):return sum(.55 if ' '<=c<='~' else 1 for c in s)
def linebreak(s):
    if jw(s)<=13:return [s]
    cand=[]
    for i in range(1,len(s)):
        a,b=s[:i],s[i:]
        if jw(a)>13 or jw(b)>13:continue
        score=abs(jw(a)-jw(b))
        if a[-1] in '、。？':score-=5
        if a[-1] in 'はがをにでとへも':score-=2
        if b[0] in 'ゃゅょっー、。？':score+=40
        if re.match('[ァ-ヴー]',a[-1]) and re.match('[ァ-ヴー]',b[0]):score+=40
        if re.match('[一-龠]',a[-1]) and re.match('[一-龠]',b[0]):score+=30
        cand.append((score,i))
    if not cand:raise ValueError('Clause requires manual split: '+s)
    i=min(cand)[1];return [s[:i],s[i:]]
def chunks(text):
    # Each comma-complete thought is one caption. Long clauses split only at
    # explicit approved grammatical boundaries, never mechanical character cuts.
    longbreaks={
      'カエルの足は':'カエルの足は',
    }
    pieces=re.findall(r'[^、。？]+[、。？]?|[、。？]',text)
    out=[]
    for p in pieces:
        if jw(p)<=26:out.append(p);continue
        # Long clauses are divided at written particles or conjunctions.
        cuts=[m.end() for m in re.finditer(r'(?:ではなく|によって|という|つまり|なら|ても|には|では|から|まで|ので|を|に|は|が|と)',p)]
        options=[i for i in cuts if jw(p[:i])<=24 and jw(p[i:])<=24 and jw(p[:i])>=7]
        if not options:raise ValueError('Need clause break: '+p)
        i=min(options,key=lambda i:abs(jw(p[:i])-jw(p[i:])))
        out.extend([p[:i],p[i:]])
    return [linebreak(p) for p in out]
def reading_for_chunk(text,sp):
    q=post(pronounced(text),sp)
    parts=[]
    for ph in q['accent_phrases']:
        k=''.join(m['text'] for m in ph['moras'])
        h=''.join(chr(ord(c)-0x60) if 'ァ'<=c<='ヶ' else c for c in k)
        # Non-particle ha must not be reinterpreted as wa by furigana parser.
        h=h.replace('は','ハ')
        if ph.get('pause_mora'):h+='、'
        parts.append(h)
    r=' '.join(parts).rstrip('、')
    if text.endswith(('。','？')):r+=text[-1]
    elif text.endswith('、'):r+='、'
    return r

def main():
    if SCRIPT.exists() or CACHE.exists():raise RuntimeError('New asset target exists; refuse overwrite')
    OUT.mkdir(parents=True,exist_ok=True);CACHE.mkdir(parents=True)
    raw=MASTER.read_text();rows=[]
    for l in raw.splitlines():
        if re.match(r'^\|\s*\d+\s*\|',l):
            f=[x.strip() for x in l.split('|')]
            rows.append({'row':int(f[1]),'scene':f[2],'who':f[3],'text':f[4],'screen':f[5]})
    assert len(rows)==43 and rows[0]['text']=='（なし。2秒）'
    entries=[];rowmap=[]
    for r in rows[1:]:
        sentences=re.findall(r'.+?[。？！]|.+$',r['text'])
        groups=[''.join(sentences[i:i+2]) for i in range(0,len(sentences),2)]
        assert ''.join(groups)==r['text']
        mapping=[]
        for pi,text in enumerate(groups):
            key=f'r{r["row"]:02}:{chr(97+pi)}'
            speaker=10001 if r['who']=='カイ' else 10005
            cap=chunks(text)
            cr=[reading_for_chunk(''.join(p),speaker) for p in cap]
            reading=''.join(cr)
            _,ph,ref=prosody.best(reading,text)
            kana=prosody.to_aquestalk(ph)
            # Retain a question's intonation, not merely the spoken characters.
            if text.endswith('？') and not kana.endswith('？'):kana+='？'
            o={'pause':.8,'masterRow':r['row'],'part':pi+1}
            if r['row']==43:o['pause']=2.
            if r['row']==42 and pi==len(groups)-1:o['pause']=3.
            if '見方：' in r['screen']:
                v=re.search(r'見方：([^」]+)',r['screen'])
                if v:o['view']=v[1]
            if r['who']=='ミオ':
                ex='hirameku' if r['row']==35 else 'jitome' if r['row']==40 else 'odoroku' if r['row']==17 else 'komaru'
                o['face']={'who':'mio','ex':ex,'small':r['row'] not in (35,40),'a':0,'b':1}
            if r['row']==34 and pi==len(groups)-1:o['score']={'at':'クズレタ','make':0,'brk':4}
            if r['row'] in (28,29,30,31):o['music']='solve'
            if r['row'] in (32,33):o['music']='solved'
            if r['row']==34:o['music']='dark'
            if r['row']==35:o['music']='toll'
            if r['row']==36:o['music']='after'
            entries.append({'key':key,'speaker':'kai' if speaker==10001 else 'mio','cap':cap,'capReading':cr,'reading':reading,'text':text,'kana':kana,'o':o,'scene':r['scene']})
            mapping.append({'key':'cb2agpt-'+key,'part':pi+1,'text':text})
        rowmap.append({**r,'cues':mapping})
        print('row',r['row'],len(groups),'cue',flush=True)
    # Natural kanji-derived phrasing is retained whenever phonemes exactly agree
    # with the reviewed furigana. Other cases are listed for independent review.
    body="// B-2前編 S0新規台本。正本43行のうち1行目は無声2秒。共有rendererには42音声行だけ渡し、専用finalizeで2秒を一度だけ加える。\n"
    body+="// 文言は正本のまま。3文以上のみ文末で分割。話者10001/10005、speedScale .90固定。\n"
    body+="// music: r28-31 solve → r32-33 solved → r34 dark → r35 toll → r36 after。既存のキーは使わない。\n"
    body+="import {D,S} from '../umech/schema.mjs';\nconst VOICE={kai:10001,mio:10005};\nconst K='cb2agpt-';\n"
    body+='const DATA='+json.dumps(entries,ensure_ascii=False,indent=2)+';\n'
    body+="const scenes=[]; for(const q of DATA){let s=scenes.at(-1);if(!s||s.heading!==q.scene){s=S(q.scene);s.deskFrame='b2a_gpt_20261029';scenes.push(s);}const cue=D(q.text,q.reading,K+q.key,{speaker:q.speaker,kana:q.kana,cap:q.cap,capReading:q.capReading,...q.o});s.cues.push(cue);s.utterances.push({subtitle:q.text,reading:q.reading,speaker:VOICE[q.speaker],kana:q.kana,pause:q.o.pause});s.narration+=q.text;}\n"
    body+='export const clips=[{id:'+json.dumps(ID)+",visualPilot:'vert-v1',series:'技術の疑問の鎖 B-2 前編 ｜ 電気と電波',title:'カエルの足の電気は、どこから来た？（前編）',condition:'B-2前編。B-1答え合わせから電堆の誕生まで。日本語は正本不変。',silentIntroSeconds:2,masterRowCount:43,scenes}];\n"
    SCRIPT.write_text(body)
    (OUT/'row-cue-map.json').write_text(json.dumps({'master':str(MASTER),'masterSha256':hashlib.sha256(raw.encode()).hexdigest(),'script':str(SCRIPT),'id':ID,'silentIntroSeconds':2,'rows':rowmap},ensure_ascii=False,indent=2))
    (OUT/'pronunciation-review.json').write_text(json.dumps(entries,ensure_ascii=False,indent=2))
    print(json.dumps({'script':str(SCRIPT),'cueCount':len(entries),'masterRows':43},ensure_ascii=False))
if __name__=='__main__':main()

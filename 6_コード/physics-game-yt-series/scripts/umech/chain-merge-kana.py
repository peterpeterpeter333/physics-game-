"""技術の疑問の鎖の台本に、prosody.py の案（と手で直した表）から kana を入れる。
Usage: python3 scripts/umech/chain-merge-kana.py <台本.mjs> <prosody.txt> [直した表.json（{字幕: kana}）]"""
import json,re,sys
path,pt=sys.argv[1],sys.argv[2]; ov=json.load(open(sys.argv[3])) if len(sys.argv)>3 else {}
lines=open(pt).read().split('\n'); km={}
for i,l in enumerate(lines):
    m=re.match(r'\[[^\]]+\] (.*)$',l)
    if m and i+1<len(lines): km[m.group(1)]=lines[i+1].strip()
km.update(ov)
src=open(path).read(); n=0
for sub,kana in km.items():
    i=src.find('D('+json.dumps(sub,ensure_ascii=False))
    if i<0: print('not found',sub[:30]); continue
    j=src.index("K+'",i); j=src.index('{',j); k=src.index('}',j)
    body=re.sub(r'kana:"[^"]*",?','',src[j+1:k])
    src=src[:j+1]+'kana:'+json.dumps(kana,ensure_ascii=False)+(',' if body.strip() else '')+body+src[k:]; n+=1
open(path,'w').write(src); print('merged',n)

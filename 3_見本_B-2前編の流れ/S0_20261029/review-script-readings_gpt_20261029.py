"""Apply human-reviewed pronunciation/caption boundaries before voice freeze.
Only the newly created B-2a script is updated. Master Japanese stays untouched.
"""
from pathlib import Path
import json,re,sys
W=Path(__file__).resolve().parents[3];OUT=Path(__file__).resolve().parent
sys.path.insert(0,str(W/'scripts'));sys.path.insert(0,str(W/'scripts/umech'))
import prosody
P=W/'docs/video-revision-20260924/ytseries/chain-b-2a_gpt_20261029.mjs'
raw=P.read_text();data=json.loads(raw.split('const DATA=',1)[1].split(';\nconst scenes=',1)[0])
# Kanji homographs and disconnected clauses must not be left to the engine.
fix={
 '斜め上へ出てきます。':'ななめ うええ でて きます。',
 '勝負の札は、':'しょうぶの ふだは、',
 '実験に1点です。':'じっけんに いってん です。',
 '高い水そうと低い水そうを、':'たかい すいそうと ひくい すいそうを、',
 'すぐに空になります。':'すぐに からに なります。',
 'いちばん上を、':'いちばん うえを、',
 '後編で開けます。':'こうへんで あけます。',
 'たとえ話です。':'たとえばなし です。',
 'ロンドンの王立協会へ、':'ロンドンの おうりつ きょうかいえ、',
}
# Keep whole words together on each line; these are layout-only changes.
layout={
 '電気と電波の前の回で分かったように、':['電気と電波の','前の回で分かったように、'],
 '線が出てくるてっぺんの近くでは、':['線が出てくる','てっぺんの近くでは、'],
 'つまり体に合図を伝える糸に、':['つまり体に合図を','伝える糸に、'],
 'ガラスを布でこすってためた電気は、':['ガラスを布でこすって','ためた電気は、'],
 'コップ1杯の水をためたようなものです。':['コップ1杯の水を','ためたようなものです。'],
 'さわった人をしびれさせることは、':['さわった人を','しびれさせることは、'],
 'アレッサンドロ・ヴォルタです。':['アレッサンドロ・','ヴォルタです。'],
 '煙を出しているわけではありません。':['煙を出している','わけではありません。'],
 'ガラスの瓶の中の2枚の薄い金の葉が、':['ガラスの瓶の中の','2枚の薄い金の葉が、'],
 '後に分かったこともあります。':['後に分かったことも','あります。'],
 '全部がまちがいではなかったのです。':['全部がまちがい','ではなかったのです。'],
 'この机のぴくっの源はカエル、':['この机のぴくっの','源はカエル、'],
 '流れた水をくみ上げ続けるポンプが、':['流れた水を','くみ上げ続けるポンプが、'],
 '目に見えない粒の大きさまで開けて見る、':['目に見えない粒の','大きさまで開けて見る、'],
 'カエルの足をぴくっとさせた電気は、':['カエルの足を','ぴくっとさせた電気は、'],
}
review=[]
for q in data:
    for i,cap in enumerate(q['cap']):
        text=''.join(cap)
        if text in fix:
            review.append({'key':q['key'],'text':text,'old':q['capReading'][i],'correct':fix[text]})
            q['capReading'][i]=fix[text]
        # Standard name readings; spell loanwords in katakana.
        r=q['capReading'][i]
        for a,b in [('がるばあに','ガルヴァーニ'),('がるゔぁあに','ガルヴァーニ'),('ぼるた','ヴォルタ'),('ぱびいあ','パヴィーア'),('あれっさんどろ','アレッサンドロ'),('るいいじ','ルイージ'),('てれら','テレラ'),('おおすとらりあ','オーストラリア'),('ろ んどん','ロンドン'),('ろんどん','ロンドン'),('いたりあ','イタリア'),('ぼろおにゃ','ボローニャ'),('がらす','ガラス'),('ぽんぷ','ポンプ'),('こっぷ','コップ'),('ぼると','ボルト'),('どあのぶ','ドアノブ'),('めす','メス'),('しびれえい','シビレエイ')]:r=r.replace(a,b)
        # Nemo normalizes foreign v to Japanese b. Write the accepted Japanese
        # pronunciation explicitly; the displayed historical names are unchanged.
        for a,b in [('ガルヴァーニ','ガルバーニ'),('ヴォルタ','ボルタ'),('パヴィーア','パビーア')]:r=r.replace(a,b)
        q['capReading'][i]=r
        q['cap'][i]=layout.get(text,cap)
    q['reading']=''.join(q['capReading'])
    label,ph,ref=prosody.best(q['reading'],q['text'])
    q['kana']=prosody.to_aquestalk(ph)+('？' if q['text'].endswith('？') else '')
    review.append({'key':q['key'],'prosodySource':label,'reading':q['reading'],'kana':q['kana']})
    # Preserve meaningful captions while avoiding isolated です/は fragments.
    i=1
    while i<len(q['cap']):
        cap=q['cap'][i];text=''.join(cap)
        if len(text)<=3 and len(q['cap'][i-1])==1 and len(q['cap'][i-1][0])+len(text)<=13:
            q['cap'][i-1][0]+=text;q['capReading'][i-1]+=q['capReading'][i]
            del q['cap'][i];del q['capReading'][i]
        else:i+=1
    assert q['reading']==''.join(q['capReading'])
    assert q['text']==''.join(''.join(x) for x in q['cap'])
    assert all(sum(.55 if ' '<=c<='~' else 1 for c in line)<=13 for cap in q['cap'] for line in cap)
P.write_text(raw.split('const DATA=',1)[0]+'const DATA='+json.dumps(data,ensure_ascii=False,indent=2)+';\nconst scenes='+raw.split(';\nconst scenes=',1)[1])
(OUT/'pronunciation-reviewed-before-voice.json').write_text(json.dumps(review,ensure_ascii=False,indent=2))
print('Reviewed',len(data),'cue; unchanged master text, corrected readings/layout in new asset only.')

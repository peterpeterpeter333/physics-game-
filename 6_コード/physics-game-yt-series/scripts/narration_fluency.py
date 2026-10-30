"""Remove formatting pauses without changing reviewed pronunciations."""
import copy
import re

VERSION = '20260924-fluent-v1'
SPACING_VERSION = '20260924-furigana-spacing-v2'

def normalized_reading(text):
    """Whitespace is manuscript formatting, not a spoken pause instruction."""
    return re.sub(r'\s+','',text)

def spacing_query(reference_text,reference_query,compact_query):
    compact_text=normalized_reading(reference_text)
    if mora_signature(compact_query)==mora_signature(reference_query):
        result=fluent_query(compact_text,compact_query)
        status='normalized-furigana'
    else:
        # Joining kana can change segmentation and the actual reading. Retain
        # the exact reviewed phonemes, removing only whitespace pause moras.
        result=fluent_query(reference_text,reference_query)
        status='reference-phonemes-preserved'
    assert mora_signature(result)==mora_signature(reference_query)
    return result,status

def mora_signature(query):
    """Pronunciation independent of phrase boundaries, pitch, and devoicing."""
    return [(m.get('consonant'),m['vowel'].lower())
            for p in query['accent_phrases'] for m in p['moras']]

def guided_query(natural_text, natural_query, reference_text, reference_query):
    # Written furigana remains authoritative. Never silently accept a kanji
    # homograph or number reading merely because its prosody sounds natural.
    if mora_signature(natural_query)==mora_signature(reference_query):
        return fluent_query(natural_text,natural_query), 'natural-reading-matched'
    return fluent_query(reference_text,reference_query), 'furigana-fallback'

def formatting_pause_indices(spoken, query):
    # Nemo turns whitespace and Japanese commas into pause_mora. Only accept
    # a one-to-one alignment; never guess which pause belongs to punctuation.
    content=spoken.strip()
    separators = [m.group() for m in re.finditer(r'[\s、，,。！？!?]+',content) if m.end()<len(content)]
    pauses = [i for i,p in enumerate(query['accent_phrases']) if p.get('pause_mora')]
    if len(separators) != len(pauses):
        return None
    return [i for i,s in zip(pauses,separators) if s.isspace()]

def fluent_query(spoken, query):
    result = copy.deepcopy(query)
    indices = formatting_pause_indices(spoken, result)
    if indices is None and re.search(r'\s', spoken.strip()):
        raise ValueError('Ambiguous spacing/punctuation pause alignment: '+spoken)
    for i in indices or []:
        result['accent_phrases'][i]['pause_mora'] = None
    # Leave mora lengths, pitch, accent, and meaningful punctuation untouched.
    result.update(speedScale=.90, prePhonemeLength=.08, postPhonemeLength=.10)
    return result

def pause_windows(query, indices, speed=.90):
    cursor=.15/speed
    windows=[]
    for i,p in enumerate(query['accent_phrases']):
        for m in p['moras']:
            cursor+=((m.get('consonant_length') or 0)+m['vowel_length'])/speed
        if p.get('pause_mora'):
            length=p['pause_mora']['vowel_length']/speed
            if i in indices: windows.append((cursor,cursor+length))
            cursor+=length
    return windows

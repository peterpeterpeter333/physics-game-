"""読み取り専用pre-export検査。元export/検査プログラムは変更しない。

python3 THIS --episode d1b --projection <fresh shotqa.json>
JSON報告だけ新規名で書く。JPEGは全件ヘッダ/寸法/終端を確認し、完全デコードと
視聴はしたことにしない。書き出し後にqx-verifyの全編デコードを必ず別実行する。
"""
import argparse,ast,collections,datetime,hashlib,json,math,os,pathlib,struct,sys,types,wave
W=pathlib.Path(__file__).resolve().parents[2]
def sha(path):
    h=hashlib.sha256()
    with open(path,'rb') as f:
        for b in iter(lambda:f.read(1<<20),b''):h.update(b)
    return h.hexdigest()
def read(path):return json.load(open(path))
def jpeg_metadata(path):
    """JPEGのSOF寸法とSOI/EOIを読む。圧縮走査データの復号ではない。"""
    with open(path,'rb') as f:
        if f.read(2)!=b'\xff\xd8':raise ValueError('JPEG SOI absent')
        dims=None
        for _ in range(2000):
            c=f.read(1)
            if c!=b'\xff':raise ValueError('JPEG marker absent before SOF')
            while c==b'\xff':c=f.read(1)
            if not c:raise ValueError('JPEG header truncated')
            code=c[0]
            if code==0xd9 or code==0xda:break
            if code in [0xd8,0x01] or 0xd0<=code<=0xd7:continue
            raw=f.read(2)
            if len(raw)!=2:raise ValueError('JPEG segment truncated')
            length=struct.unpack('>H',raw)[0]
            if length<2:raise ValueError('JPEG segment length invalid')
            if code in [0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf]:
                b=f.read(6)
                if len(b)!=6:raise ValueError('JPEG SOF truncated')
                precision,height,width,components=struct.unpack('>BHHB',b)
                dims={'width':width,'height':height,'components':components,'precision':precision};break
            f.seek(length-2,1)
        if dims is None:raise ValueError('JPEG SOF absent')
        f.seek(-2,2)
        if f.read(2)!=b'\xff\xd9':raise ValueError('JPEG EOI absent or trailing bytes')
        return dims
def source_files(ep):
    b=W/'scripts/blender'
    result=[b/('desk_'+ep+'_gpt_20261026.py'),b/'desk_lib_d1_machine_gpt_20261026.py']
    if ep=='d1a':result.append(b/'desk_lib_d1a_extras_gpt_20261026.py')
    return result+[b/'desk_lib_d1.py']
def current_render_key(ep,data):
    # 実sourceのrender_keyだけを独立namespaceで呼び、Blenderをimportしない。
    # 検査対象は今回追加した自作関数だけ。ファイル全体やmainは実行しない。
    files=source_files(ep);source=files[0];tree=ast.parse(source.read_text())
    fn=next(x for x in tree.body if isinstance(x,ast.FunctionDef) and x.name=='render_key')
    ns={'os':os,'hashlib':hashlib,'json':json,'__file__':str(source),'DATA':data,
        'mx':types.SimpleNamespace(__file__=str(files[1])),
        'ext':types.SimpleNamespace(__file__=str(files[-1]))}
    if ep=='d1a':ns['ax']=types.SimpleNamespace(__file__=str(files[2]))
    exec(compile(ast.Module(body=[fn],type_ignores=[]),str(source),'exec'),ns)
    return ns['render_key']()
def arguments():
    p=argparse.ArgumentParser();p.add_argument('--episode',choices=['d1a','d1b'],default='d1b')
    p.add_argument('--projection');p.add_argument('--report');p.add_argument('--self-test',action='store_true')
    return p.parse_args()
def main():
    a=arguments()
    if a.self_test:
        import tempfile
        # metadata parserだけの小さなfixture。完全JPEGの合格を主張しない。
        with tempfile.TemporaryDirectory(prefix='d1ab-preexport-gpt-') as tmp:
            p=pathlib.Path(tmp)/'header.jpg';p.write_bytes(b'\xff\xd8\xff\xc0'+struct.pack('>H',8)+struct.pack('>BHHB',8,1920,1080,3)+b'\xff\xd9')
            assert jpeg_metadata(p)['width']==1080 and jpeg_metadata(p)['height']==1920
            p.write_bytes(b'not jpeg')
            try:jpeg_metadata(p)
            except ValueError:pass
            else:raise AssertionError('broken JPEG header accepted')
        for ep in ['d1a','d1b']:
            data=read('/private/tmp/ys/ys-chain-'+ep+'_gpt_20261026/blender/data.json')
            assert len(current_render_key(ep,data))==20
        print('self-test PASS: metadata acceptance/rejection and both current render_key functions; no Blender, no video decode');return 0
    if not a.projection:raise SystemExit('--projection <fresh shotqa.json> is required')
    ep=a.episode;cache=pathlib.Path('/private/tmp/ys/ys-chain-'+ep+'_gpt_20261026');ident='ys-chain-'+ep
    desk=cache/'blender/desk';data=read(cache/'blender/data.json');clip=read(cache/(ident+'.json'));nf=math.ceil(clip['duration']*30)
    key=current_render_key(ep,data);files=source_files(ep);errors=[];warnings=[]
    check=lambda condition,message:errors.append(message) if not condition else None
    sources=[{'path':str(f),'sha256':sha(f),'mtime':f.stat().st_mtime} for f in files]
    check(data['episode']==ep and clip['id']==ident,'episode mismatch')
    protected=read(cache/'immutable-inputs_gpt_20261026.json');bad_inputs=[]
    for f,expected in protected['protectedInputs'].items():
        if sha(f)!=expected:bad_inputs.append(f)
    check(not bad_inputs,'protected canonical inputs changed: '+str(bad_inputs))
    mix=read(cache/(ident+'.mix.json'));voice=cache/(ident+'.voice.wav');mixed=cache/(ident+'.wav')
    check(sha(voice)==protected['voiceSha256']==mix['voiceSha256'],'voice fingerprint mismatch')
    check(sha(mixed)==mix['mixSha256'],'mix fingerprint mismatch')
    for f in [voice,mixed]:
        with wave.open(str(f)) as wav:dur=wav.getnframes()/wav.getframerate()
        check(abs(dur-clip['duration'])<.02,'audio duration mismatch: '+str(f))
    meta=read(desk/'meta.json');anchors=read(desk/'anchors.json')
    check(bool(meta.get('finished')),'meta.finished absent: production finish() has not certified all required render/copy frames')
    check(not anchors.get('previewOnly'),'previewOnly anchor array is forbidden')
    check(meta.get('frames')==anchors.get('frames')==nf,'frame count mismatch')
    check(meta.get('fps')==anchors.get('fps')==30,'fps mismatch')
    check(meta.get('key')==anchors.get('key')==key,'current source/render/anchors key mismatch')
    done=meta.get('done',[]);check(len(done)==len(set(done)) and all(isinstance(j,int) and 0<=j<nf for j in done),'invalid done frame index')
    invalid_anchors=[];named=anchors.get('anchors',{})
    check(bool(named),'anchor dictionary is empty')
    for name,points in named.items():
        if len(points)!=nf:invalid_anchors.append([name,'length',len(points)]);continue
        for j,p in enumerate(points):
            if not isinstance(p,list) or len(p)!=3 or not all(isinstance(v,(int,float,bool)) and math.isfinite(v) for v in p) or p[2] not in [0,1,False,True]:
                invalid_anchors.append([name,j,p]);break
    check(not invalid_anchors,'incomplete/invalid anchors')
    missing=[];bad_raw=[]
    for j in range(nf):
        f=desk/('%05d.jpg'%j)
        if not f.is_file():missing.append(j);continue
        try:
            image=jpeg_metadata(f)
            if (image['width'],image['height'])!=(1080,1920):bad_raw.append([j,image])
        except Exception as ex:bad_raw.append([j,str(ex)])
    extra=[p.name for p in desk.glob('*.jpg') if p.stem.isdigit() and int(p.stem)>=nf]
    check(not missing,'missing raw frames: '+str(len(missing)))
    check(not bad_raw,'raw dimension/JPEG-header errors: '+str(len(bad_raw)))
    check(not extra,'out-of-range raw frame names')
    if a.projection=='latest':
        candidates=list((cache/'blender/gpt-shotqa').glob('*.json'))
        if not candidates:raise FileNotFoundError('投影QAがまだ無い。GUIでshotqaを実行してから検査する。')
        projection=max(candidates,key=lambda f:f.stat().st_mtime).resolve()
    else:projection=pathlib.Path(a.projection).resolve()
    check(str(projection).startswith(str(cache/'blender/gpt-shotqa')+os.sep),'projection report must belong to this isolated cache')
    q=read(projection);s=q['summary'];measurements=q.get('all_measurements',[]);camera=s.get('camera',{})
    check(s.get('episode')==ep and abs(s.get('duration',0)-clip['duration'])<1e-6 and s.get('cues')==len(data['cues']),'projection episode/duration/cue scope mismatch')
    check(s.get('coverage_fps',0)>=1,'projection coverage below 1 Hz')
    projection_dependencies=[W/'scripts/blender/desk_d1ab_shotqa_gpt_20261026.py']
    if ep=='d1a':projection_dependencies.append(W/'scripts/blender/desk_d1a_gate_catalog_gpt_20261026.py')
    qa_sources=[{'path':str(f),'sha256':sha(f),'mtime':f.stat().st_mtime} for f in projection_dependencies]
    check(projection.stat().st_mtime>=max(x['mtime'] for x in sources+qa_sources),'projection report predates current source/subject selector; rerun shotqa')
    times={round(r['time'],5) for r in measurements};needed=set()
    for c in data['cues']:
        needed.add(round((c['start']+c['end'])/2,5));needed.update(round(w['time'],5) for w in c['wordEvents'])
    check(needed.issubset(times),'projection report is missing cue midpoint/word-time samples')
    check(s.get('below35_ratio_pass') is True,'projection small-subject time limit failed')
    median=s.get('width_median');check(isinstance(median,(int,float)) and .50<=median<=.70,'projection median not in current 50-70% subject target')
    check(s.get('missing_primary_samples')==0 and s.get('cropped_samples')==0 and s.get('unregistered_cues')==[],'projection missing/cropped/unregistered subject')
    check(camera.get('measured') is True and camera.get('fps')==30 and camera.get('frames')==nf,'camera projection is not full 30fps')
    check(camera.get('moving_ratio_pass') is True and camera.get('top_ratio_pass') is True,'camera movement/top-view limits failed')
    severe=[];codes=collections.Counter()
    for r in q.get('ng',[]):
        codes.update(r.get('issues',[]))
        if any(x in ['PRIMARY_MISSING','PRIMARY_UNREGISTERED','CROPPED_OR_BEHIND_CAMERA'] for x in r.get('issues',[])):severe.append({'time':r['time'],'cue':r['cue'],'issues':r['issues']})
    check(not severe,'severe projection NG at midpoint/word/coverage samples: '+str(len(severe)))
    if codes:warnings.append('Per-sample width-target deviations remain and require visual review: '+str(dict(codes)))
    check(current_render_key(ep,read(cache/'blender/data.json'))==key,'source changed during pre-export check')
    now=datetime.datetime.now().isoformat(timespec='seconds');out=pathlib.Path(a.report) if a.report else cache/('preexport-check_gpt_20261026-'+now.replace(':','-')+'.json')
    if not str(out.resolve()).startswith(str(cache)+os.sep):raise ValueError('report must be a new file inside the isolated episode cache')
    composition_files=[W/('scripts/umech/desk-'+ep+'-'+part+'_gpt_20261026.mjs') for part in ['overlay','overlay-dispatch','deskframe','hooks','export']]
    composition_files += [W/'scripts/umech/frame-vert.mjs',W/'scripts/umech/desk-frame.mjs',W/'scripts/render-all-films-gptv2.mjs']
    result={'episode':ep,'created':now,'preExportPass':not errors,'errors':errors,'warnings':warnings,'frames':nf,'currentRenderKey':key,
        'sources':sources,'protectedInputsVerified':len(protected['protectedInputs']),'meta':str(desk/'meta.json'),'metaSha256':sha(desk/'meta.json'),
        'projectionDependencies':qa_sources,
        'currentCompositionSourceDigests':[{'path':str(f),'sha256':sha(f)} for f in composition_files],
        'anchors':str(desk/'anchors.json'),'anchorsSha256':sha(desk/'anchors.json'),'invalidAnchors':invalid_anchors,'rawMetadataChecked':nf-len(missing),
        'missingRaw':missing,'invalidRaw':bad_raw,'extraRaw':extra,'projection':str(projection),'projectionSha256':sha(projection),'projectionSummary':s,
        'severeProjectionNG':severe,'widthTargetNGCounts':dict(codes),'rawCompleteDecodePerformed':False,'actualExportDecodePerformed':False,
        'actualVisualApproval':False,'earListening':False,'notCertified':['JPEG entropy-stream decode','exported MP4 decode','full-resolution visual review','ears'],
        'nextRequired':'After export, run qx-verify.mjs on the actual complete MP4; inspect all generated sheets; run authorized desk-quality-gate plus separate semantic projection QA. This helper is not an allMoviePass.'}
    with open(out,'x') as f:json.dump(result,f,ensure_ascii=False,indent=1)
    print(json.dumps({'report':str(out),'preExportPass':not errors,'errorCount':len(errors),'errors':errors,'rawMetadataChecked':result['rawMetadataChecked'],'rawCompleteDecodePerformed':False},ensure_ascii=False,indent=1))
    return 0 if not errors else 1
if __name__=='__main__':sys.exit(main())

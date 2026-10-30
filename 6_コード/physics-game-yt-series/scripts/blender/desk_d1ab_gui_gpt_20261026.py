"""D-1 前後編の通常の Blender GUI 内実行。既存ファイルへは書かない。"""
import os, sys, runpy, time, json, traceback, contextlib, types, hashlib, ast
import bpy
sys.dont_write_bytecode = True

W = '/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series'
ROOT = W + '/outputs/d1ab-gpt-20261026'
os.makedirs(ROOT, exist_ok=True)
EPISODES = {}

def load_episode(ep='d1b', options=None):
    """既存の場面はファイルに書き戻さず、今回のソースから新しい場面を構成。"""
    assert ep in ('d1b', 'd1a')
    script = W + '/scripts/blender/desk_' + ep + '_gpt_20261026.py'
    cache = '/private/tmp/ys/ys-chain-' + ep + '_gpt_20261026'
    sys.path.insert(0, W + '/scripts/blender')
    for name in ('desk_lib', 'desk_lib_d1', 'desk_lib_d1_machine_claude_20261026', 'desk_lib_d1_machine_gpt_20261026'):
        sys.modules.pop(name, None)
    sys.argv = [script, '--', '--cache', cache] + (options or [])
    log_path = ROOT + '/' + ep + '-gui_gpt_20261026.log'
    with open(log_path, 'a', buffering=1) as log, contextlib.redirect_stdout(log), contextlib.redirect_stderr(log):
        print(time.strftime('%Y-%m-%d %H:%M:%S'), 'BUILD', options, flush=True)
        # GUI実行中のfactory resetは実行元のareaを無効にする。
        # 共通ソースは変更せず、空の新sceneを用意してその一呼出しだけ代替する。
        win = bpy.context.window or next(iter(bpy.context.window_manager.windows))
        for obj in bpy.data.objects:
            if not obj.name.startswith('d1ab_prior_'):
                obj.name = 'd1ab_prior_' + obj.name
        fresh = bpy.data.scenes.new('D1AB_' + ep + '_gpt_20261026')
        win.scene = fresh
        try:
            with bpy.context.temp_override(window=win, scene=fresh, view_layer=fresh.view_layers[0]):
                libpath = W + '/scripts/blender/desk_lib.py'
                raw = open(libpath, 'rb').read()
                text = raw.decode('utf8')
                reset_line = 'bpy.ops.wm.read_factory_settings(use_empty=True)'
                assert text.count(reset_line) == 1
                # 新sceneを先に用意したため、この二重初期化だけを読み込み時に省略。
                # ファイルへは一切書かず、光・材質・模型・関数は元コードをそのまま実行。
                text = text.replace(reset_line, '# GUI loader already created an empty scene', 1)
                lib = types.ModuleType('desk_lib')
                lib.__file__ = libpath
                sys.modules['desk_lib'] = lib
                oldargv = sys.argv[:]
                sys.argv = sys.argv[:sys.argv.index('--')] if '--' in sys.argv else sys.argv
                try:
                    exec(compile(text, libpath, 'exec'), lib.__dict__)
                finally:
                    sys.argv = oldargv
                print('SHARED_SOURCE_UNCHANGED', hashlib.sha256(raw).hexdigest(), 'reset-only GUI adapter', flush=True)
                ns = runpy.run_path(script, run_name='d1ab_gpt_scene')
            EPISODES[ep] = ns
            print('READY', ep, len(ns['d'].SC.objects), flush=True)
        except BaseException:
            traceback.print_exc()
            raise
    return ns

def execute(ep='d1b', task='main'):
    ns = EPISODES[ep]
    log_path = ROOT + '/' + ep + '-gui_gpt_20261026.log'
    with open(log_path, 'a', buffering=1) as log, contextlib.redirect_stdout(log), contextlib.redirect_stderr(log):
        started = time.time()
        try:
            print(time.strftime('%Y-%m-%d %H:%M:%S'), 'START', ep, task, flush=True)
            ns[task]()
            print('DONE', ep, task, time.time() - started, flush=True)
        except BaseException:
            traceback.print_exc()
            raise

def refresh_behavior(ep='d1b'):
    """自作sceneの関数だけ再読込。模型を作り直さず試写修正を反映する。"""
    ns = EPISODES[ep]['main'].__globals__
    path = W + '/scripts/blender/desk_' + ep + '_gpt_20261026.py'
    tree = ast.parse(open(path).read(), filename=path)
    nodes = [node for node in tree.body if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) or
             isinstance(node, ast.Assign) and any(isinstance(target, ast.Name) and target.id == 'CAM' for target in node.targets)]
    exec(compile(ast.Module(body=nodes, type_ignores=[]), path, 'exec'), ns)
    ns['ENTRY_MOVES'] = {c['key']: ns['pose_at'](c['start'] + .02) != ns['pose_at'](c['start'] + 1.25) for c in ns['CUES']}
    EPISODES[ep] = ns
    return ns

def run_qa(ep='d1b'):
    import desk_d1ab_shotqa_gpt_20261026 as qa
    import importlib
    qa = importlib.reload(qa)
    log_path = ROOT + '/' + ep + '-gui_gpt_20261026.log'
    with open(log_path, 'a', buffering=1) as log, contextlib.redirect_stdout(log), contextlib.redirect_stderr(log):
        try:
            print(time.strftime('%Y-%m-%d %H:%M:%S'), 'SHOT_QA_START', ep, flush=True)
            result = qa.run(EPISODES[ep])
            print('SHOT_QA_DONE', result, flush=True)
            return result
        except BaseException:
            traceback.print_exc()
            raise

def render_catalog(ep='d1b'):
    import desk_d1b_catalog_gpt_20261026 as cat
    import importlib
    cat = importlib.reload(cat)
    with open(ROOT + '/' + ep + '-gui_gpt_20261026.log', 'a', buffering=1) as log, contextlib.redirect_stdout(log), contextlib.redirect_stderr(log):
        try:
            print(time.strftime('%Y-%m-%d %H:%M:%S'), 'CATALOG_START', flush=True)
            result = cat.render(EPISODES[ep])
            print('CATALOG_DONE', result, flush=True)
        except BaseException:
            traceback.print_exc()
    return None

def upgrade_channels(ep='d1b'):
    """今回の新部品だけをライブsceneへ追加。既存の休止位置は保持。"""
    import importlib
    ns = EPISODES[ep]['main'].__globals__
    mx = importlib.reload(ns['mx'])
    result = mx.add_readable_channels(ns['M'])
    for obj in result['added_objects']:
        if obj not in ns['MANAGED']: ns['MANAGED'].append(obj)
        ns['BASE'].setdefault(obj, ns['M']['base'][obj])
    ns['SCENE_OBJECTS'] = list(ns['d'].SC.objects)
    ns['CHILDREN'] = {obj: [] for obj in ns['SCENE_OBJECTS']}
    for obj in ns['SCENE_OBJECTS']:
        if obj.parent in ns['CHILDREN']: ns['CHILDREN'][obj.parent].append(obj)
    EPISODES[ep] = ns
    print('READABLE_CHANNELS', len(result['added_objects']), 'new objects', flush=True)
    return len(result['added_objects'])

def preview(ep='d1b', times='247.7', scale=.5, out=None):
    ns = load_episode(ep, ['--times', times, '--scale', str(scale), '--samples', '16', '--out', out or '/private/tmp/ys/ys-chain-' + ep + '_gpt_20261026/probe-before'])
    execute(ep)
    return ns

print('D1AB_GPT_GUI_READY', flush=True)

def scheduled_preview():
    """コンソールの旧area文脈を離れ、通常のGUI main loopで実行。"""
    try:
        preview()
    except BaseException:
        pass
    return None

def review_batch():
    """部品修正後の関門B/Cと数値点検。本番へは自動で進まない。"""
    try:
        ns = refresh_behavior('d1b')
        upgrade_channels('d1b')
        ns['d'].SC.render.resolution_x = 1080
        ns['d'].SC.render.resolution_y = 1920
        ns['A'].times = '76,90,102,122,146,167,183,247.7,256.5,265.7,335,414,83,134.5,154.8,156,160,214,224,239,284,296,306,315,327,343,348,350.5,357,399,401,402,405,469,491.6'
        ns['A'].out = ns['A'].cache + '/blender/desk'
        ns['A'].force = True
        render_catalog('d1b')
        execute('d1b')
        run_qa('d1b')
    except BaseException:
        with open(ROOT + '/d1b-gui_gpt_20261026.log', 'a') as log:
            traceback.print_exc(file=log)
    return None

def coverage_preview(ep='d1b'):
    """全1Hz・全cue末尾・主要な動作を、本番と同じフレーム時刻で先行確認。

    新規cacheへだけ書く。フレームの実画像とanchorが揃った本番描画対象に
    限ってdoneへ記録し、後の本番で同じ画像を無用に描き直さない。
    """
    ns = refresh_behavior(ep)
    a, fps, nf = ns['A'], ns['FPS'], ns['NF']
    a.out = a.cache + '/blender/desk'
    a.force = True
    ns['d'].SC.render.resolution_x = 1080
    ns['d'].SC.render.resolution_y = 1920
    indices = {round(t * fps) for t in range(int(ns['DATA']['duration']) + 1)}
    indices.update(max(0, min(nf - 1, round((c['end'] - .08) * fps))) for c in ns['CUES'])
    if ep == 'd1b':
        # ふた通過・底弁の吸入・レバー接触は、1秒刻みより細かく比較する。
        for lo, hi in [(243, 268), (393, 419), (349, 359)]:
            indices.update(range(round(lo * fps), round(hi * fps) + 1, round(fps / 4)))
        indices.update(round(t * fps) for t in [76,90,102,122,146,167,183,247.7,256.5,265.7,335,414,469,491.6])
    indices = sorted(j for j in indices if 0 <= j < nf)
    a.times = ','.join('%.9f' % (j / fps) for j in indices)
    execute(ep)
    anc = json.load(open(a.out + '/anchors-partial.json'))
    mf = a.out + '/meta.json'
    old = json.load(open(mf)) if os.path.exists(mf) else {}
    done = set(old.get('done', []))
    for j in indices:
        if ns['plan'](j)[0] == 'render' and str(j) in anc and os.path.isfile(a.out + '/%05d.jpg' % j):
            done.add(j)
    json.dump({'key': ns['render_key'](), 'frames': nf, 'fps': fps, 'done': sorted(done),
               'preflight': 'full-resolution exact-frame coverage before production'}, open(mf, 'w'))
    json.dump({'episode': ep, 'frames': indices, 'times': [j / fps for j in indices],
               'resolution': [1080,1920], 'samples': a.samples,
               'not_a_complete_movie': True}, open(a.cache + '/coverage-preview_gpt_20261026.json', 'w'), indent=1)
    return None

def final_preproduction_checks(ep='d1b'):
    ns = refresh_behavior(ep)
    run_qa(ep)
    prior = ns['A'].out
    try:
        ns['A'].out = ns['A'].cache + '/problem'
        ns['A'].force = True
        execute(ep, 'problem')
    finally:
        ns['A'].out = prior
    return None

def production(ep='d1b'):
    """合格済みの全解像度試写を保持して、本番の残りを再開可能に描く。"""
    ns = refresh_behavior(ep)
    ns['A'].times = None
    ns['A'].out = ns['A'].cache + '/blender/desk'
    ns['A'].start = 0
    ns['A'].stop = 1e9
    ns['A'].force = False
    ns['A'].dry = False
    ns['A'].shot_plan = False
    ns['A'].plan_only = False
    ns['A'].finish = True
    ns['d'].SC.render.resolution_x = 1080
    ns['d'].SC.render.resolution_y = 1920
    execute(ep)
    return None

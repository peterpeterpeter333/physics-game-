"""ROOT QUEUE ONLY. Recovery of job153; no apply, pose, render or experiment."""


def _b1_153_recover(session):
    import hashlib
    from pathlib import Path
    import runpy

    helper = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_b1_job153_exact_normal_restore_20261025.py')
    expected = '52be8050f4a0399f768589396d7b1545ec2ae79954c6449b80de2c224981c8fd'
    assert hashlib.sha256(helper.read_bytes()).hexdigest() == expected
    assert not Path('/private/tmp/ys/axes-active-queue/cancel').exists()
    api = runpy.run_path(str(helper))
    name, ns = api['select_namespace'](session)
    report = api['run'](ns, authorized=True, expected_helper_sha256=expected, namespace_name=name)
    assert report['success'] and report['allOriginal80WorldsRestored']
    assert all(value is True for value in report['protectionChecks'].values())
    assert report['episodeApplyPoseResetCalls'] == report['renders'] == report['encodes'] == 0
    print('B1 job153 exact original80 world restoration passed by normal evaluation; no camera experiment or rendering', flush=True)


_b1_153_recover(globals())

"""Read-only old inputs, isolated new scene; CPU projected-mask preflight.

No video rendering or UI automation. Original shared QA is not modified.
"""
from pathlib import Path
import runpy, importlib.util, sys

W=Path(__file__).resolve().parents[2]
ns=runpy.run_path(str(W/'scripts/blender/desk_b2a_s4_gpt_20261029.py'))
spec=importlib.util.spec_from_file_location('b2a_projection',W/'scripts/blender/check_b2a_s4_projection_gpt_20261030.py')
check=importlib.util.module_from_spec(spec);spec.loader.exec_module(check)
out=W/'outputs/ys-chain-b2a-backup/S4_20261030'
args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
if '--all' in args:
    check.run(ns,output_dir=out/'投影測定_全該当行_初回')
else:
    check.run(ns,output_dir=out/'投影測定_試験2時点',sample_times=[ns['ROWS'][10]['start']+.5,ns['word'](10,'ピクット')+.15],counterfactual=False)

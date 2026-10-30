"""Small S2 camera contact probe in the already-loaded GUI; no final render."""
import pathlib

def run(gui):
    ns=gui.EPISODES['d1b_s3']['main'].__globals__
    root=pathlib.Path('/private/tmp/ys/ys-chain-d1b_s3_gpt_20261026/s2review')
    old=ns['CAM']['jackwide'][:]
    try:
        for i,pose in enumerate([
            [-.12,.10,.493,.72,-35,12,50],
            [-.14,.10,.493,.72,-50,12,50],
            [-.16,.10,.493,.72,-65,12,50],
            [-.18,.10,.493,.72,-80,12,50],
        ]):
            ns['CAM']['jackwide']=pose
            gui.preview([349.6],str(root/('jack-probe-%d'%i)))
    finally:
        ns['CAM']['jackwide']=old
    return None

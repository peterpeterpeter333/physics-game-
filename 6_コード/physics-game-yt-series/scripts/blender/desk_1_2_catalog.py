"""1-1 の部品と 1-2 の新部品を、同じ机・光・DOF で二方向から書き出す。
blender -b --factory-startup -P scripts/blender/desk_1_2_catalog.py -- --cache /private/tmp/ys/ys-chain-1-1v6 --base /private/tmp/ys/ys-chain-1-1v5 --out docs/video-revision-20260924/deep/部品カタログ画像
"""
import os, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import desk_lib as d
from mathutils import Vector

OUT=d.A['out'] or 'docs/video-revision-20260924/deep/部品カタログ画像'
os.makedirs(OUT,exist_ok=True)
d.SC.render.image_settings.file_format='PNG'
d.SC.render.resolution_x=1080
d.SC.render.resolution_y=1920
d.SC.render.resolution_percentage=100

# 原版のオブジェクトを消さず、一枚の撮影時に対象だけ表示する。
BG_EXACT={'floor','wall','base','window','picture','desk','pot','leaf0','leaf1','leaf2','leaf3'}
BG_PREFIX=('winF','picF','leg','stack')
OLD={
 'hand':(('hand_kai','kai_'),Vector((.55,-.2,.10))),
 'tile':(('cat0',),d.CAT_POS[0]),
 'caesar_disk':(('disks','diskOut','diskIn','inner','pin','knob','o_','i_'),d.DK),
 'doll':(('doll0','dBody0','dHead0','dHair0','dEyeL0','dEyeR0','dtag0'),d.DOLL_POS[0]),
 'letter':(('letter','letA','letB','sealL','sealR','ps'),d.LT),
 'paper':(('ps','sheet'),d.SHC),
 'scroll':(('scroll','roll','rod'),d.S0),
 'tower':(('col','base','gbase','wt_'),d.TWC),
 'tree':(('tree','trunk','twig','leafy'),d.TR_TOP),
 'clock':(('clock','clk'),d.CLK),
 'dice':(('die','pip'),d.DIE_LAND[0]),
 'candle':(('candle','flame','smoke'),d.CD),
 'barrel':(('barrel','hoop','cradle','bung','cork','note'),d.BR),
 'quill':(('quill','qfeather','qshaft','qnib'),d.LT),
 'book':(('bpages','bback','bpageTop','bhinge','bcover','bcovIn','bdeco'),d.BK),
 'scoreboard':(('board_h','board','bl','bdash','dig_'),d.BD),
 'substitution_table':(('tw','to'),d.TB),
 'challenge_tiles':(('ch','chq'),d.CH),
}

def visible(prefixes, center):
    for o in d.bpy.data.objects:
        keep=o.type in ('CAMERA','LIGHT') or o.name in BG_EXACT or o.name.startswith(BG_PREFIX) or o.name.startswith(prefixes)
        o.hide_render=not keep;o.hide_viewport=not keep
    for ld,p in d.LIGHTS:ld.energy=p
    d.BGN.inputs[1].default_value=.35
    d.bpy.context.view_layer.update()

NEW_SPAN={'alberti':.32,'keyword':.34,'shift':.19,'vigenere':.37,'nameclock':.70,'bellaso':.23,'frequencies':.58,'answer':.78,'shift_on_ring':.27}
def shot(label,center):
    for top in (False,True):
        d.catalog_camera(center,top,NEW_SPAN.get(label))
        target=os.path.join(OUT,f'{label}_{"top" if top else "oblique"}.png')
        d.SC.render.filepath=target
        t=time.time();d.bpy.ops.render.render(write_still=True)
        print('CATALOG',target,'%.2fs'%(time.time()-t),flush=True)

# 1-1 の原版の時刻を適用し、対象のジオメトリを撮る。
OLD_TIME={'hand':28,'substitution_table':170,'challenge_tiles':470,'tile':26,'caesar_disk':30,'doll':236,'letter':2,'paper':290,'scroll':191,'tower':392,'tree':210,'clock':76,'dice':255,'candle':457,'barrel':8,'quill':421,'book':198,'scoreboard':17}
for label,(prefixes,center) in OLD.items():
    t=OLD_TIME[label]
    if d.S6('rows:a')<=t<d.S6('rows:fill') or d.S6('end:a')<=t<d.S6('end:phel'):
        d.apply6(t)
    else:
        d.apply(d.map5(t))
    visible(prefixes,center);shot(label,center)

for label,factory in d.PART_FACTORIES.items():
    d.catalog_stage()
    # 前の新規部品は隠したままにし、今回の部品だけを追加する。
    part=factory(name='preview_'+label,center=(0,-.15,0),**({'fixed':d.DATA['tower'],'changing':[21]*21+[20]*5} if label=='frequencies' else {}))
    if label=='alberti':d.alberti_turn(part,3,touch=2)
    elif label=='keyword':d.keyword_set(part,1)
    elif label=='shift':d.shift_card_set(part,0)
    elif label=='vigenere':d.vigenere_select(part,10,4)
    elif label=='nameclock':d.name_clock_set(part,3,swapped=True)
    elif label=='bellaso':d.bellaso_open(part,.82)
    elif label=='frequencies':d.tower_pair_set(part,1)
    elif label=='answer':d.challenge_answer_set(part,15)
    shot(label,(0,-.15,0))

# カエサルの外輪に目盛り札を重ねた追加の見本（一枚）。
d.catalog_stage()
ring=d.shift_cards(name='preview_shift_ring',center=d.DK)
d.shift_on_caesar_ring(ring)
visible(OLD['caesar_disk'][0]+('preview_shift_ring',),d.DK)
d.catalog_camera(d.DK,top=False,span=NEW_SPAN['shift_on_ring'])
d.SC.render.filepath=os.path.join(OUT,'shift_on_ring.png')
d.bpy.ops.render.render(write_still=True)

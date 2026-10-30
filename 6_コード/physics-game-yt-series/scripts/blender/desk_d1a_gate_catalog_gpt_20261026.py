"""D-1前編の関門12枚と全使用部品の斜め/上カタログ。親のGUIだけで呼ぶ。

既存GUIアダプタを変更しない。既に load_episode('d1a') したnamespaceを渡す。
例（GUIコンソール、Gは既存GUIアダプタの辞書）:
  import desk_d1a_gate_catalog_gpt_20261026 as ag
  ns=G['EPISODES']['d1a']; ag.gate12(ns); ag.catalog(ns); ag.shotqa(ns)
本番へは自動で進まない。既存/正本/字幕/音声には書かない。
"""
import os,json,time,hashlib,sys

GATE12=[
    ('horse_gin',28.3),('machine_closed',56.8),('piston_label',65.4),
    ('mist_xray',98.5),('can_air_out',136.9),('can_sealed',157.5),
    ('palm_and_1kg',205.3),('original_horse_rest',300.0),
    ('airpump_inlet',331.7),('airpump_outlet',339.1),
    ('closed_seams',360.0),('fuji_challenge',370.0),
]
SUPPLEMENT=[('score_board',38.6),('cylinder_xray_air',246.5),('hemisphere_release',345.8),('last_recap',383.0)]

def load_episode(adapter,options=None):
    """既存GUI loaderを使う。A固有extrasの古いmoduleだけ先に外す。"""
    sys.modules.pop('desk_lib_d1a_extras_gpt_20261026',None)
    load=adapter['load_episode'] if isinstance(adapter,dict) else adapter.load_episode
    return load('d1a',options or ['--samples','16'])

def _ns(ns):
    ns=ns['main'].__globals__ if 'main' in ns else ns
    assert ns['DATA']['episode']=='d1a'
    assert os.path.realpath(ns['A'].cache)=='/private/tmp/ys/ys-chain-d1a_gpt_20261026'
    return ns
def _path(ns,path):
    path=os.path.abspath(path)
    assert os.path.realpath(path).startswith(os.path.realpath(ns['A'].cache)+os.sep)
    os.makedirs(path,exist_ok=True);return path
def _qa():
    import importlib,desk_d1ab_shotqa_gpt_20261026 as qa
    return importlib.reload(qa)
def install_subjects(ns):
    """語で主役が替わる前編row7だけを登録。既存QAの測定方法は変更しない。"""
    ns=_ns(ns);qa=_qa()
    def boiler_or_cylinder(n,c,t):
        after=t>=n['W']('nc:boiler','太い筒')
        return {'name':'太い筒' if after else '湯をわかす釜',
                'objects':qa._named(n,qa.BODY if after else qa.BOILER),
                'reason':'声の「その上に、太い筒」からカメラと説明対象が筒へ替わるため。机や腕は幅に加えない。'}
    def piston_or_beam(n,c,t):
        after=t>=n['W']('nc:piston','シーソー')
        return {'name':'木のシーソーの腕と鎖' if after else '上下に動くふたと筒',
                'objects':qa._named(n,qa.BEAM if after else qa.BODY),
                'reason':'声がピストンを説明している間に、まだ説明していない長い腕や棒を主役の幅へ足さない。'}
    ns['SHOTQA_PRIMARY'].setdefault('nc:boiler',boiler_or_cylinder)
    ns['SHOTQA_PRIMARY'].setdefault('nc:piston',piston_or_beam)
    return ns
def gate12(ns,force=True,supplement=False):
    """原寸12枚を新cache/deskへ描く。実投影の測定記録も保存する。"""
    import bpy
    ns=install_subjects(ns);qa=_qa();A=ns['A'];d=ns['d'];out=_path(ns,A.cache+'/blender/desk')
    mf=out+'/meta.json'
    assert not os.path.isfile(mf) or not json.load(open(mf)).get('finished'),'完成済み本番コマへ関門の試写を重ねない'
    specs=GATE12+(SUPPLEMENT if supplement else []);fps=ns['FPS']
    save={k:getattr(A,k) for k in ['times','out','force','dry','shot_plan','plan_only']}
    resolution=(d.SC.render.resolution_x,d.SC.render.resolution_y);fmt=d.SC.render.image_settings.file_format
    records=[]
    try:
        d.SC.render.resolution_x=1080;d.SC.render.resolution_y=1920
        d.SC.render.image_settings.file_format='JPEG'
        A.times=','.join('%.9f'%(round(t*fps)/fps) for _,t in specs);A.out=out;A.force=force;A.dry=False;A.shot_plan=False;A.plan_only=False
        bpy.context.window.scene=d.SC;ns['main']()
        for name,t in specs:
            j=round(t*fps);t=j/fps;ns['apply'](t);c=ns['cue_at'](t)
            subject,candidates,reason=qa.semantic_primary(ns,c,t)
            meshes=qa._visible_meshes(candidates,set(ns['M'].get('_gpt_obsolete',[])))
            measure=qa._project(ns,meshes,{}) if meshes else None
            f=out+'/%05d.jpg'%j
            records.append({'name':name,'frame':j,'time':t,'row':c['row'],'cue':c['key'],'image':f,
                'sha256':hashlib.sha256(open(f,'rb').read()).hexdigest(),'resolution':[1080,1920],
                'copied_old_frame':ns['reuse_frame'](t),'subject':subject,'reason':reason,'projection':measure,
                'visual_approval':'PENDING; measure is not a visual pass'})
        result={'episode':'d1a','samples':A.samples,'resolution':[1080,1920],'gate_count':12,
            'supplement_count':len(specs)-12,'frames':records,'actual_composite_review':'PENDING'}
        dest=A.cache+'/gate12-front_gpt_20261026-'+str(time.time_ns())+'.json'
        json.dump(result,open(dest,'x'),ensure_ascii=False,indent=1)
        json.dump(result,open(A.cache+'/gate12-front_gpt_20261026.json','w'),ensure_ascii=False,indent=1)
        return dest
    finally:
        for k,v in save.items():setattr(A,k,v)
        d.SC.render.resolution_x,d.SC.render.resolution_y=resolution
        d.SC.render.image_settings.file_format=fmt
def catalog(ns,out=None,force=False):
    """全使用模型を原寸で斜め上/真上から。流体を測定幅の水増しには使わない。"""
    import bpy
    ns=install_subjects(ns);qa=_qa();d=ns['d'];M=ns['M'];P=ns['P'];G=ns['G'];EX=ns['EX']
    out=_path(ns,out or ns['A'].cache+'/blender/catalog-front_gpt_20261026-'+str(time.time_ns()))
    body=lambda:qa._named(ns,qa.BODY)
    group=lambda k:G[k]
    gin=lambda:EX['gin']['primary']
    pump_parts=lambda:[o for o in EX['airpump']['objects'] if o not in EX['airpump']['particles']+EX['airpump']['sphere_air']]
    specs=[
      ('mine_section',12.5,lambda:group('mine'),[]),
      ('horse_gin_rope_buckets',28.3,gin,[lambda:EX['gin']['dumped']]),
      ('horse_gin_horse',22.0,lambda:[EX['gin']['horse']['root']],[]),
      ('score_board',42.9,lambda:group('score'),[]),
      ('machine_closed',57.4,lambda:qa._machine_groups(ns,*qa.MECHANISM),[]),
      ('boiler_closed',59.6,lambda:qa._named(ns,qa.BOILER),[]),
      ('cylinder_piston_closed',65.5,body,[]),
      ('beam_and_chains',68.4,lambda:qa._named(ns,qa.BEAM),[]),
      ('cylinder_xray',98.5,body,[lambda:M['spray'],lambda:M['cpuffs'],lambda:[M['steamfill'],M['condensate']]]),
      ('spoon_balloon',118.8,lambda:group('balloon'),[lambda:P['balloon']['mist']]),
      ('can_air_expulsion',136.9,lambda:P['can']['can'],[lambda:EX['can_air'],lambda:P['can']['mist']]),
      ('can_mouth_and_water',157.5,lambda:group('can'),[lambda:[EX['seal_ring']]]),
      ('kai_hand',141.0,lambda:[d.HANDS['kai']],[]),
      ('cup_and_straw',180.5,lambda:group('straw'),[lambda:[P['straw']['juice']]]),
      ('air_layers',192.5,lambda:group('air'),[]),
      ('square_and_1kg',198.5,lambda:[next(o for o in G['weights'] if o.name.startswith('d1_squarecm')),P['weights']['one']],[]),
      ('palm_and_100kg',205.3,lambda:[P['weights']['palm'],P['weights']['hundred']],[]),
      ('inside_pressure_can_hand',215.0,lambda:group('weights')+group('can'),[]),
      ('two_cans_air_steam',235.1,lambda:group('twocans'),[lambda:P['twocans']['particles']]),
      ('thin_and_wide_cylinders',254.5,lambda:group('twins'),[]),
      ('piston_area_22palms',274.8,lambda:group('area'),[]),
      ('two_tonne_weight',285.7,lambda:[P['heavy']['weight']],[]),
      ('four_comparison_horses',297.0,lambda:[h['root'] for h in P['heavy']['horses']],[]),
      ('original_horse_rest',300.0,lambda:[EX['gin']['horse']['root']],[]),
      ('copper_hemispheres',313.2,lambda:P['hemi']['parts']+[P['hemi']['seam'],P['hemi']['valve'],P['hemi']['valvepipe']],[]),
      ('airpump_two_doors',322.9,pump_parts,[]),
      ('airpump_inlet_open',331.7,pump_parts,[lambda:EX['airpump']['particles']]),
      ('airpump_outlet_open',339.1,pump_parts,[lambda:EX['airpump']['particles']]),
      ('hemisphere_eight_horses',343.2,lambda:group('hemi'),[]),
      ('closed_cover_seams',360.0,lambda:qa._named(ns,qa.BODY+qa.BOILER),[lambda:EX['seams']]),
      ('fuji_and_air_columns',370.0,lambda:group('fuji')+[o for root,objects,top in ns['FUJI_MINI'] for o in [root]+objects],[]),
      ('last_mine_can_hemispheres',383.0,lambda:group('mine')+group('can')+group('hemi'),[]),
    ]
    resolution=(d.SC.render.resolution_x,d.SC.render.resolution_y);fmt=d.SC.render.image_settings.file_format;records=[]
    try:
        bpy.context.window.scene=d.SC;d.SC.render.resolution_x=1080;d.SC.render.resolution_y=1920
        d.SC.render.image_settings.file_format='JPEG'
        for name,t,select,extras in specs:
            ns['apply'](t);c=ns['cue_at'](t);old_visible={o for o in d.SC.objects if not o.hide_render}
            meshes=qa._visible_meshes(qa._objects(select()),set(M.get('_gpt_obsolete',[])))
            if not meshes:raise RuntimeError(('catalog subject missing',name))
            chosen=set(meshes)
            for get in extras:chosen.update(o for o in qa._objects(get()) if o in old_visible)
            if name in ['square_and_1kg','inside_pressure_can_hand']:
                chosen.update(o for o in qa._objects(select()) if o in old_visible)
            d.catalog_stage()
            for obj in chosen:d.show(obj,True)
            center=qa._project(ns,meshes,{})['world_center']
            for top in [False,True]:
                d.catalog_camera(center,top);d.CAM_D.dof.aperture_fstop=16
                for attempt in range(7):
                    bpy.context.view_layer.update();m=qa._project(ns,meshes,{})
                    ratio=max(m['width_ratio']/.62,m['height_ratio']/.72)
                    if abs(ratio-1)<.02:break
                    d.CAM_D.lens/=ratio
                bpy.context.view_layer.update();f=out+'/'+name+('_top.jpg' if top else '_oblique.jpg')
                if os.path.exists(f) and not force:raise FileExistsError('新しいcatalog出力先を使う: '+f)
                d.SC.render.filepath=f;bpy.ops.render.render(write_still=True,scene=d.SC.name)
                records.append({'part':name,'source_time':t,'source_row':c['row'],'view':'top' if top else 'oblique',
                    'image':f,'projection':qa._project(ns,meshes,{}),'resolution':[1080,1920],
                    'sha256':hashlib.sha256(open(f,'rb').read()).hexdigest(),'selected_objects':sorted(o.name for o in chosen),
                    'visual_approval':'PENDING'})
                print('A_CATALOG',name,'top' if top else 'oblique',flush=True)
        receipt=out+'/catalog-receipt_gpt_20261026.json'
        json.dump({'episode':'d1a','parts':len(specs),'images':len(records),'frames':records,
                   'not_a_movie_replacement':True,'new_source_parts_only':True},open(receipt,'w'),ensure_ascii=False,indent=1)
        return receipt
    finally:
        d.SC.render.resolution_x,d.SC.render.resolution_y=resolution;d.SC.render.image_settings.file_format=fmt;ns['apply'](1.5)
def shotqa(ns):
    ns=install_subjects(ns)
    return _qa().run(ns)


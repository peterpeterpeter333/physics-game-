"""Additive B-2a S4 correction 03. Originals, voice and caption clocks are read-only.

This module patches the initialized isolated producer namespace in memory only.
No render, save, source edit or file write occurs on import or install().
"""
import hashlib
import math
import runpy
from pathlib import Path
import bpy
from mathutils import Vector

W = Path(__file__).resolve().parents[2]
CTX_KEY = '_b2a_s4r03_coordinator'


def _mesh(name, xy, mat, d):
    mesh = bpy.data.meshes.new(name+'_mesh')
    mesh.from_pydata([(x,y,0) for x,y in xy], [], [tuple(range(len(xy)))])
    mesh.update()
    ob = bpy.data.objects.new(name, mesh)
    d.link(ob); d.put(ob,mat); d.show(ob,False)
    return ob


def _billboard(g, ob, center, width_pixels):
    """Place real flat geometry in front of the indicated thigh, not a bbox."""
    d = g['d']; cam = d.CAM
    quat = cam.matrix_world.to_quaternion()
    right, up = quat@Vector((1,0,0)), quat@Vector((0,1,0))
    base = Vector(center)
    origin = d.project(base)
    sx = (d.project(base+right*.01)[0]-origin[0])/.01
    sy = (d.project(base+up*.01)[1]-origin[1])/.01
    # Shift the mark onto the exposed upper-right of the thigh, clear of nerve
    # and both rods. Its precise screen width is 12%, never only a label width.
    ob.location = base + right*(40/sx) + up*(-65/sy)
    # Come forward along the view ray while keeping the projected center fixed.
    ray = ob.location-cam.location
    ob.location = cam.location+ray*.84
    sx2 = (d.project(ob.location+right*.01)[0]-d.project(ob.location)[0])/.01
    ob.rotation_euler = quat.to_euler()
    unit = width_pixels/abs(sx2)
    ob.scale = (unit,unit,unit)
    bpy.context.view_layer.update()
    return ob.location.copy(), right, up, unit


def _create_context(ns):
    g = ns['production'].__globals__
    assert all(k in g for k in ('MODELS','stage','apply','ROWS','p','d'))
    # Reuse newly implemented row-19 apparatus, preserving its own exact clocks.
    row19module = runpy.run_path(str(W/'scripts/blender/patch_b2a_s4r3_row19_gpt_20261030.py'))
    row19 = row19module['prepare'](g)
    alarm_module = runpy.run_path(str(W/'scripts/blender/desk_b2a_row27_alarm_gpt_20261030.py'))
    alarm = alarm_module['build'](g)
    d,p = g['d'],g['p']
    ctx = {'g':g,'ns':ns,'row19':row19,'alarmModule':alarm_module,'alarm':alarm,
           'baseStage':g['stage'],'baseApply':g['apply'],
           'baseAnchors':g['label_anchors'],'baseFingerprint':g['visual_fingerprint']}
    glyphmat = d.mat('b2a_s4r03_hypothesis_yellow','#ffdd27',.35,
                    emit='#ffdd27',strength=.6)
    glyph = _mesh('b2a_s4r03_animal_electricity_hypothesis',
                  [(-.12,.66),(.50,.66),(.05,.08),(.37,.08),
                   (-.42,-.72),(-.12,-.10),(-.50,-.10)],glyphmat,d)
    strike_mat = d.mat('b2a_s4r03_hypothesis_cancel_red','#ef3a30',.4,
                       emit='#ef3a30',strength=.5)
    strike = p.curve('b2a_s4r03_hypothesis_cancel_line',[(0,0,0)]*2,strike_mat,.003)
    dot = d.sphere('b2a_s4r03_one_circuit_yellow',.010,(0,0,0),g['signalmat'],seg_=24,ring=12)
    d.show(strike,False);d.show(dot,False)
    g['explain'].extend([glyph,strike,dot])
    ctx.update(glyph=glyph,glyphMaterial=glyphmat,strike=strike,dot=dot)
    initial_warnings=len(g['EVENT_WARNINGS'])
    w=g['word']
    ctx['events']={
        'r13Spark':w(13,'パチット'),
        'r13Rub':w(13,'ガラスオヌノデコスッテ'),
        'r21Reveal':w(21,'カエルノカラダノナカニアル'),
        'r21Pulse':w(21,'ドオブツデンキデス'),
        'r22Return':w(22,'ニホンノキンゾク'),
        'r22Circuit':w(22,'カラダノナカノデンキオ'),
        'r22CircuitEnd':w(22,'ミチニスギナイ',end=True),
        'r36Strike':w(36,'コノツクエノ'),
    }
    assert len(g['EVENT_WARNINGS'])==initial_warnings, 'New visual event used an invented clock'
    ctx['events']['r13SparkEnd']=ctx['events']['r13Spark']+.2
    camera39=g['CAMERAS'].get('39:glass') or g['calibrate'](39,'glass')
    camera21=g['CAMERAS'].get('21') or g['calibrate'](21)
    g['CAMERAS']['13']={**camera39,'baselineTime':g['ROWS'][13]['start']+.25}
    g['CAMERAS']['22:frog']={**camera21,'baselineTime':g['ROWS'][22]['end']-.25}
    ctx['cameraReferences']={'13':camera39,'22:frog':camera21}
    return ctx


def install(ns):
    # Refresh this new patch's functions without duplicating props or chaining
    # another copy of the patch on a retained isolated Blender scene.
    ctx=ns.get(CTX_KEY) or _create_context(ns)
    g=ctx['g'];d,p=g['d'],g['p']
    row19=ctx['row19'];alarm_module=ctx['alarmModule'];alarm=ctx['alarm']
    glyph,glyphmat,strike,dot=ctx['glyph'],ctx['glyphMaterial'],ctx['strike'],ctx['dot']

    def stage(t):
        s=ctx['baseStage'](t);n=s['row'];ev=ctx['events']
        if n==13:
            g['hide_all']()
            a=g['ROWS'][13]['start'];sp=ev['r13Spark']
            gl=g['use']('glass',(0,-.10,.11),1.4,rot=(0,math.radians(-35),0))
            rub_at=ev['r13Rub']
            charge=g['smooth'](t,a+.45,min(sp-.35,a+3.6)) if t<sp else 0
            rub=(min(t,sp-.45)-a)*.62
            p.glass_state(gl,charge,sp<=t<sp+.2,rub)
            bpy.context.view_layer.update()
            # Both hands are single connected hand/sleeve hierarchies. The
            # cloth-holding finger follows the actual moving cloth, not a fixed
            # point displaced from its object.
            if a<=t<sp-.45:
                cloth=gl['parts']['cloth'].matrix_world.translation
                p.pose_connected_hand('mio',cloth+Vector((0,-.004,.006)),
                                      scale=1,yaw=-65,pitch=-16)
            if sp-.8<=t<sp+1:
                incoming=1-g['smooth'](t,sp-.8,sp)
                tip=p.world_anchor(gl,'tip')+Vector((-.012-.09*incoming,-.05*incoming,.001+.045*incoming))
                p.pose_connected_hand('kai',tip,scale=1,yaw=-80,pitch=-16)
            s.update(models=[gl],primary=g['meshes']([gl]),name='b2a_r03_rubbed_glass',
                     target=.69,el=25,az=0,maxheight=.48,lens=42,fullFace=False)
        elif n==22 and t>=ev['r22Return']:
            s.update(primary=g['foot_geometry'](g['MODELS']['frog']),
                     name='b2a_r03_metal_path_full_leg',target=.82,maxheight=.49,az=0,el=25)
        return s

    def apply(t):
        n=g['row_at'](t)['row'];ev=ctx['events']
        if n==27:
            g['hide_all']()
            return alarm_module['apply'](g,alarm,t)
        alarm_module['restore_camera'](g,alarm)
        s=ctx['baseApply'](t)
        # stage() hid new overlays. Show them only in their three named rows.
        active=(n==21 and t>=ev['r21Reveal']) or (n==22 and t>=ev['r22Return']) or n==36
        if active:
            frog=g['MODELS']['frog'];thigh=frog['parts']['leg']['parts']['thigh']
            center=thigh.matrix_world.translation
            center,right,up,unit=_billboard(g,glyph,center,1080*.125)
            brightness=.45
            if n==21:
                reveal=g['smooth'](t,ev['r21Reveal'],ev['r21Reveal']+.35)
                pulse=math.sin(math.pi*max(0,min(1,(t-ev['r21Pulse'])/1.1)))**2 if ev['r21Pulse']<=t<=ev['r21Pulse']+1.1 else 0
                brightness=(.45+2.2*pulse)*reveal
            d.set_emit(glyphmat,brightness)
            d.show(glyph,True)
            if n==36 and t>=ev['r36Strike']:
                # Exactly the same glyph and location, crossed at the same
                # spoken word as the existing hypothesis-label cancellation.
                forward=(d.CAM.location-center).normalized()*.003
                p._curve_points(strike,[center+right*(-.62*unit)+up*(-.75*unit)+forward,
                                        center+right*(.62*unit)+up*(.75*unit)+forward])
                d.show(strike,True)
            if n==22 and ev['r22Circuit']<=t<=ev['r22CircuitEnd']:
                nerve=p.centerline_world(frog,'nerve')
                brass=p.centerline_world(frog,'brass');iron=p.centerline_world(frog,'iron')
                # One continuous, finite circuit: mark -> inner nerve -> nerve
                # end -> brass -> touching iron -> muscle -> starting mark.
                route=[center]+list(reversed(nerve))+brass+list(reversed(iron))+[center]
                u=max(0,min(1,(t-ev['r22Circuit'])/(ev['r22CircuitEnd']-ev['r22Circuit'])))
                dot.location=p._along(route,u)+Vector((0,-.020,.012));d.show(dot,True)
                ctx['lastCircuit']={'time':t,'progress':u,'route':[list(v) for v in route]}
        bpy.context.view_layer.update();return s

    def labels(s):
        if s['row']==27:return alarm_module['anchors'](g,alarm)
        result=ctx['baseAnchors'](s)
        if s['row']==19:
            for key,loc in row19['anchors']().items():result['label.row19'+key.title()]=d.project(loc)
        if s['row'] in (21,22,36) and not glyph.hide_render:
            result['label.hypothesisGlyph']=d.project(glyph.location)
        return result

    def fingerprint():
        # Add the dedicated orthographic camera's native parameters to the
        # original exact-state identity. No approximate or time-sampled reuse.
        original=ctx['baseFingerprint']()
        camera=(d.CAM_D.type,d.CAM_D.ortho_scale,d.CAM_D.dof.use_dof)
        return hashlib.sha256((original+repr(camera)).encode()).hexdigest()

    stage._b2a_scene_globals=g;apply._b2a_scene_globals=g
    g.update(stage=stage,apply=apply,label_anchors=labels,visual_fingerprint=fingerprint)
    ns.update(stage=stage,apply=apply,label_anchors=labels,visual_fingerprint=fingerprint)
    g[CTX_KEY]=ns[CTX_KEY]=ctx
    return ctx

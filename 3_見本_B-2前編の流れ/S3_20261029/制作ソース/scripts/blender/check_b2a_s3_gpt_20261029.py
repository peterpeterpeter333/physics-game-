"""Focused, non-rendering numerical checks for the new B-2a S3 scene.

Call run(NS) with the dictionary created by desk_b2a_s3_gpt_20261029.py.
This does not load a scene, render, save .blend, alter narration or edit source.
The active scene is restored to its opening state on completion.
"""
import json,math,time
from pathlib import Path
import bpy
from mathutils import Vector


def run(NS):
    p=NS['p'];d=NS['d'];models=NS['MODELS'];rows=NS['ROWS']
    apply=NS['apply'];measure=NS['measurement'];word=NS['word'];FPS=NS['FPS']
    C=Path(NS['C']);checks=[];samples=[];started=time.time()
    def record(name,ok,actual=None,expected=None,priority='P1'):
        checks.append({'test':name,'pass':bool(ok),'actual':actual,'expected':expected,'priority':priority})
    def width(objects):
        items=[o for o in objects if o.type in ('MESH','CURVE') and not o.hide_render]
        return measure(items)['width'] if items else 0.0
    def diameter_pixels(model,anchor,radius):
        center=Vector(model['anchors'][anchor]);matrix=model['root'].matrix_world
        pts=[matrix@(center+Vector((radius*math.cos(a),radius*math.sin(a),0)))
             for a in [i*math.tau/24 for i in range(24)]]
        xy=[d.project(v) for v in pts]
        return (max(v[0] for v in xy)-min(v[0] for v in xy))/1080
    def red_tip_local(model,compass):
        red=compass['halves'][0]
        bpy.context.view_layer.update()
        return model['root'].matrix_world.inverted()@(red.matrix_world@red.data.vertices[2].co)

    try:
        # Every master row is applied at multiple points; this catches fixed-size
        # curve assignment errors and late-only branches that a midpoint misses.
        for n,r in rows.items():
            fractions=(.08,.5,.92)
            if n in (10,11,19,25,32,33,39,43):fractions=(.03,.25,.5,.75,.97)
            for fraction in fractions:
                t=r['start']+(r['end']-r['start'])*fraction
                try:
                    state=apply(t);m=measure(state['primary'])
                    valid=all(math.isfinite(float(m[k])) for k in ('x0','x1','y0','y1','width','height'))
                    record('row_%d_at_%.2f_finite'%(n,fraction),valid,m)
                    samples.append({'row':n,'seconds':t,'primary':state['name'],'measurement':m})
                except Exception as exc:
                    record('row_%d_at_%.2f_executes'%(n,fraction),False,repr(exc),'stage/apply succeeds','P0')

        # Single-leg structure, no invisible extra torso/head compensating width.
        for key in ('frog','frog_same'):
            leg=models[key]['parts']['leg'];names=[o.name for o in leg['objects']]
            for part in ('_thigh','_knee_hinge','_shin','_foot','_white_nerve'):
                count=sum(part in name for name in names)
                record(key+'_one'+part,count==1,count,1)
            extra=[name for name in names if any(s in name for s in ('_body','_head','_torso'))]
            record(key+'_no_body_head_torso',not extra,extra,[])
            nerve=leg['parts']['nerve'];record(key+'_nerve_radius',nerve.data.bevel_depth>=.006-1e-7,nerve.data.bevel_depth,.006)

        # Knee angles are actual Blender Euler values, not just narration labels.
        apply(rows[25]['start']+.1)
        for key,degrees in [('frog',30),('frog_same',5)]:
            leg=models[key]['parts']['leg'];p.frog_kick(leg,1,degrees=degrees)
            angle=-math.degrees(leg['parts']['knee_hinge'].rotation_euler.y)
            record(key+'_knee_peak_degrees',abs(angle-degrees)<1e-4,angle,degrees)
            p.frog_kick(leg,0,degrees=degrees)
            angle=abs(leg['parts']['knee_hinge'].rotation_euler.y)
            record(key+'_knee_rest_degrees',angle<1e-8,angle,0)

        # Exact endpoint closure and fixed tissue connections, in current world.
        apply(rows[10]['start']+.1);model=models['frog']
        for contact in (0,.5,1):
            result=p.frog_contacts(model,contact)
            record('contact_distance_'+str(contact),abs(result['distance']-.040*(1-contact))<1e-6,
                   result['distance'],.040*(1-contact))
            bpy.context.view_layer.update()
            for i,(bar,tip) in enumerate(zip(model['parts']['rods'],model['parts']['tips'])):
                v=Vector(bar.data.splines[0].points[-1].co[:3]);actual=bar.matrix_world@v
                error=(actual-tip.matrix_world.translation).length
                record('contact_mesh_tip_%s_%d'%(contact,i),error<2e-6,error,0)
                v=Vector(bar.data.splines[0].points[0].co[:3])
                error=(v-model['parts']['contact_bases'][i]).length
                record('contact_tissue_fixed_%s_%d'%(contact,i),error<2e-6,error,0)

        # No parent transform is applied twice: actual red triangle tip vs anchor.
        for key,comparison in [('terrella',False),('comparison',True)]:
            model=models[key]
            p.reset(model)
            if comparison:p.terrella_comparison_state(model,72)
            else:p.terrella_state(model,field=1,dip=72,phase=.73,surface=True)
            for side,sign in [('North',-1),('South',1)]:
                comp=model['parts']['compass'+side]
                actual=red_tip_local(model,comp);target=model['anchors']['compass'+side+'NeedleTip']
                error=(actual-target).length
                record(key+'_'+side+'_redtip_mesh_anchor',error<2e-6,error,0)
                normal_amount=(actual-comp['center']).dot(comp['normal'])
                record(key+'_'+side+'_redtip_dip_sign',normal_amount*sign>0,normal_amount,'negative north / positive south')
        te=models['terrella'];p.terrella_state(te,field=1,dip=72,phase=.73)
        paths=te['parts']['field_paths']
        record('field_loop_count',4<=len(paths)<=6,len(paths),'4..6')
        for a,b in ((0,1),(2,3),(4,5)):
            err=max((Vector((-x.x,x.y,x.z))-y).length for x,y in zip(paths[a],paths[b]))
            record('field_left_right_symmetry_%d_%d'%(a,b),err<2e-6,err,0)
        for i,path in enumerate(paths):
            record('field_south_to_north_%d'%i,path[0].z<0 and path[-1].z>0,[path[0].z,path[-1].z],'south negative Z → north positive Z')
        record('earth_continents_exist',len(te['parts'].get('continents',[]))>=5,len(te['parts'].get('continents',[])),'>=5')
        # A physically outward vector on the south of an upright globe projects
        # downward. The explanatory local enlargement must instead read as UP
        # relative to its own white horizontal, without reversing physical dip.
        for n in (6,7):
            t=word(6,'ウエオムキマス')+.65 if n==6 else rows[n]['start']+.35
            apply(t);cm=models['comparison']
            tip=d.project(p.world_anchor(cm,'compassSouthNeedleTip'))
            horizon=d.project(p.world_anchor(cm,'horizonSouth'))
            record('row%d_south_red_tip_above_white_horizontal'%n,
                   bool(tip[2]) and bool(horizon[2]) and tip[1]<horizon[1]-3,
                   {'redTip':tip,'horizontalCenter':horizon},'redTipY < horizonY - 3px')

        # Material-layer order, roots and water-drop/dry-paper visibility.
        pile=models['pile'];p.pile_state(pile,visible_units=30,dry=False)
        record('pile_count',len(pile['parts']['layers'])==30,len(pile['parts']['layers']),30)
        for i in (0,14,29):
            layer=pile['layer_centers'][i]
            record('pile_layer_order_'+str(i),layer['zinc'].z<layer['paper'].z<layer['copper'].z,
                   {k:v.z for k,v in layer.items()},'zinc < wet paper < copper')
            drops=pile['parts']['waterdrops'][i]
            record('paper_wet_drops_'+str(i),all(not ob.hide_render for ob in drops),[not ob.hide_render for ob in drops],True)
        p.pile_state(pile,dry=True)
        record('dry_paper_no_waterdrops',all(ob.hide_render for group in pile['parts']['waterdrops'] for ob in group),None,True)
        # The visible finger endpoint must actually touch both metal terminals,
        # rather than remaining at the old helper's 30 mm hovering offset.
        at=word(32,'ビリット',fraction=.48);apply(at+.25)
        for hand,terminal in [('kai','bottom_terminal'),('mio','top_terminal')]:
            bpy.context.view_layer.update()
            actual=d.HANDS[hand].matrix_world@d.TIP
            intended=p.world_anchor(models['pile'],terminal)
            error=(actual-intended).length
            record('row32_'+hand+'_finger_terminal_distance',error<=.008,error,'<=.008 m')

        # Numeric shooting conditions are measured on actual projected geometry.
        # Row28 is sampled before intentional removal, not after it leaves frame.
        for n in (9,10,11,20,21,23,26,28,43):
            r=rows[n];t=r['start']+.25
            if n in (10,11):t=min(t,word(n,'フレアワセル')-.03)
            if n==28:t=min(t,word(28,'カエルオトリノゾケバ')-.03)
            state=apply(t);model=models['frog'];w=width(NS['foot_geometry'](model))
            record('row_%d_actual_leg_width'%n,w>=.55-1e-3,w,'>=.55; desired .55..65')
            nerve=diameter_pixels(model,'nerve',.006)
            record('row_%d_nerve_projected_diameter'%n,nerve>=.02-1e-3,nerve,'>=.02')
        r=rows[25];apply((r['start']+r['end'])*.5)
        for key in ('frog_same','frog'):
            w=width(NS['foot_geometry'](models[key]))
            record('row25_'+key+'_leg_width',w>=.35-1e-3,w,'>=.35')
        r=rows[5];apply((r['start']+r['end'])*.5)
        stone=models['terrella']['parts']['stone']
        sphere_pixels=[d.project(stone.matrix_world@v.co)[0] for v in stone.data.vertices]
        w=(max(sphere_pixels)-min(sphere_pixels))/1080
        record('row5_earth_stone_width',w>=.45-1e-3,w,'>=.45 from real mesh vertices, not enclosing cube')
        r=rows[12];apply((r['start']+r['end'])*.5);w=width(models['cell']['objects'])
        record('row12_cell_width',w>=.25-1e-3,w,'>=.25')
        apply(word(29,'カエルノカラダノナカ')+.25)
        cutaway=models['cutaway'];water=d.project(p.world_anchor(cutaway,'water'))
        record('row29_cutaway_water_in_frame',bool(water[2]) and 40<=water[0]<=1040 and 110<=water[1]<=1600,
               list(water),'visible within x40..1040 / y110..1600')
        cm=measure([ob for ob in cutaway['objects'] if ob.type in ('MESH','CURVE') and not ob.hide_render])
        record('row29_cutaway_model_in_frame',cm['x0']>=0 and cm['x1']<=1080 and cm['y0']>=0 and cm['y1']<=1920,cm,'entire inset inside frame')
        r=rows[33];t=word(33,'ハガヒライタ')+1;apply(t)
        leaves=[o for o in models['electroscope']['objects'] if '_gold_leaf' in o.name and o.type=='MESH']
        w=width(leaves);record('row33_goldleaf_pair_width',w>=.30-1e-3,w,'>=.30')
        record('leaf_dark_background_exists','dark_background' in models['electroscope']['parts'])
        apply(.8);cam0={'loc':list(d.CAM.location),'rot':list(d.CAM.rotation_euler),'shift':d.CAM_D.shift_y,'lens':d.CAM_D.lens}
        apply(NS['DATA']['duration']-.5);cam1={'loc':list(d.CAM.location),'rot':list(d.CAM.rotation_euler),'shift':d.CAM_D.shift_y,'lens':d.CAM_D.lens}
        record('row1_row43_identical_camera',cam0==cam1,{'opening':cam0,'ending':cam1},'exactly identical')
        # Complete object inventories are needed for reliable hiding and primary.
        for key in ('frog','frog_same','terrella','comparison','pile','electroscope','cutaway'):
            model=models[key];descendants=set(model['root'].children_recursive)|{model['root']}
            difference=descendants.symmetric_difference(set(model['objects']))
            record('complete_object_inventory_'+key,not difference,[o.name for o in difference],[])
    except Exception as exc:
        record('probe_unexpected_runtime_error',False,repr(exc),'all remaining checks execute','P0')
    finally:
        try:apply(.8)
        except Exception:pass
    report={'scope':'Real Blender scene geometry, transformations and explicit Claude S2 numerical conditions; no render/audio playback',
            'elapsedSeconds':time.time()-started,'checks':checks,'samples':samples,
            'total':len(checks),'failed':[x for x in checks if not x['pass']],
            'speechSubtitleSourceEdited':False}
    out=C/'qa/s3-scene-numerical-check.json';out.parent.mkdir(parents=True,exist_ok=True)
    out.write_text(json.dumps(report,ensure_ascii=False,indent=2))
    print('B2A_S3_NUMERICAL',json.dumps({'total':len(checks),'failed':report['failed'],'path':str(out)},ensure_ascii=False),flush=True)
    assert not report['failed'],'B2a S3 numerical checks found defects; report saved before raising'
    return report

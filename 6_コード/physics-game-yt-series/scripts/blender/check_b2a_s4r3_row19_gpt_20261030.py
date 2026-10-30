"""Additive row19 critical-time audit; no producer/gate edits or rendering.

Reuse the established evaluated-triangle/depth-raster measurement functions,
never bbox products as area. run(NS, ctx, output_dir=FRESH) returns a report.
This samples five actual times plus the actual kick/spark frame windows.
"""
import importlib.util
import json
import math
import time
from pathlib import Path

import bpy
import numpy as np
from mathutils import Vector


def _load(ns):
    path=Path(ns["W"])/"scripts/blender/check_b2a_s4final_projection_gpt_20261030.py"
    spec=importlib.util.spec_from_file_location("b2a_row19_readonly_audit_base",path)
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
    return module


def _world_projection(base, scene, objects, matrix):
    dg=bpy.context.evaluated_depsgraph_get();xyz=[]
    for original in objects:
        if not base._visible_render_object(original):
            continue
        evaluated=original.evaluated_get(dg)
        mesh=evaluated.to_mesh(preserve_all_data_layers=False,depsgraph=dg)
        if mesh is None:continue
        try:
            xyz.extend(list(evaluated.matrix_world@v.co) for v in mesh.vertices)
        finally:evaluated.to_mesh_clear()
    if not xyz:
        return {"objectCount":0,"widthFraction":0,"allInCamera":False}
    pp,front=base._project(xyz,matrix,*base.MASK_SIZE)
    width,height=base.MASK_SIZE
    all_in=bool(front.all() and (pp[:,0]>=0).all() and (pp[:,0]<=width).all()
                and (pp[:,1]>=0).all() and (pp[:,1]<=height).all()
                and (pp[:,2]>=-1).all() and (pp[:,2]<=1).all())
    return {"objectCount":len(objects),"projectedRealVertices":len(xyz),
            "widthFraction":float(np.ptp(pp[:,0])/width),
            "heightFraction":float(np.ptp(pp[:,1])/height),
            "bounds":[float(pp[:,0].min()/width),float(pp[:,1].min()/height),
                      float(pp[:,0].max()/width),float(pp[:,1].max()/height)],
            "allInCamera":all_in,"widthMeasuredFromActualEvaluatedVertices":True}


def _spark_material(ob):
    result=[]
    for slot in ob.material_slots:
        mat=slot.material
        if not mat or not mat.use_nodes:continue
        for node in mat.node_tree.nodes:
            if node.type!="BSDF_PRINCIPLED":continue
            color=node.inputs.get("Emission Color")
            strength=node.inputs.get("Emission Strength")
            base=node.inputs.get("Base Color")
            result.append({"material":mat.name,
                           "base":list(base.default_value) if base else None,
                           "emission":list(color.default_value) if color else None,
                           "strength":float(strength.default_value) if strength else None})
    return result


def run(ns, ctx, output_dir=None):
    base=_load(ns);g=ctx["g"];apply=ns["apply"];p=g["p"];scene=g["d"].SC
    output=Path(output_dir) if output_dir else Path(ns["C"])/"qa/row19-independent-20261030"
    if output.exists():raise RuntimeError("Preserve earlier reports; choose a fresh directory")
    output.mkdir(parents=True);(output/"masks").mkdir()
    clock=ctx["clock"];started=time.time();frames=[];failures=[]
    limits={"leg_area_no_hand":.075,"leg_area_with_hand":.070,
            "leg_height":.20,"nerve_width":.025,"hand_preserved_path":.80,
            "strong_tip_distance_over_height":.10,"machine_width":.30,
            "spark_frames":6}
    times=[(clock["start"]+.50,"start-no-hand"),
           (clock["spark"]+.10,"white-spark"),
           (clock["contact"]+.15,"scalpel-contact"),
           (clock["kickPeak"],"strong-kick-peak"),
           (clock["kickEnd"]+1/30,"returned-to-rest")]
    report={"scope":"row19 only; five actual times, complete actual kick/spark frame windows",
            "method":"Existing evaluated-triangle depth raster at540x960; real visible pixels/full image area; not bbox area",
            "limits":limits,"clock":clock,"frames":frames,"failures":failures,"completed":False,
            "limitations":["No rendering or ears/equal-speed video review",
                           "Geometric mask excludes composited2D labels and defocus",
                           "Transparent surfaces treated conservatively as opaque occluders",
                           "Only five critical mask samples; not every-frame visibility certification"]}
    try:
        for value,reason in times:
            j=round(value*30);t=j/30;state=apply(t);bpy.context.view_layer.update()
            if state["row"]!=19:raise RuntimeError("Critical sample left row19")
            frog=g["MODELS"]["frog"]
            mask=base._mask(scene,{"frog":frog},p,base._hand_objects(g))
            hand_present=bool(np.any(mask["ids"]==base.HAND_ID))
            groups=ctx["measure_groups"]()
            row={"j":j,"seconds":t,"reason":reason,"handOnScreen":hand_present,
                 "camera":base._camera_record(scene),"groups":{}}
            blank=np.zeros_like(mask["ids"],dtype=bool)
            for sid,identity in mask["identities"].items():
                family=identity["family"]
                if family not in ("leg_body","nerve"):continue
                objects=mask["groups"]["frog"][family]
                nums=base._mask_numbers(mask["ids"]==sid)
                paths,status=base._projected_paths(p,frog,family,objects,mask["matrix"])
                visibility=base._path_visibility(paths,mask["ids"],sid,blank,
                                                 mask["ids"]==base.HAND_ID,
                                                 mask["idsWithoutHands"])
                nums["essentialVisibility"]=visibility
                nums["centerlineStatus"]=status
                if family=="leg_body":
                    area_limit=.070 if hand_present else .075
                    nums["criteria"]={
                        "height":{"threshold":.20,"pass":nums["heightFraction"]>=.20},
                        "area":{"threshold":area_limit,"pass":nums["areaFraction"]>=area_limit},
                        "handPreservedPath":{"threshold":.80,"pass":visibility["passes80Percent"]}}
                    for key,item in nums["criteria"].items():
                        if not item["pass"]:failures.append({"j":j,"criterion":"leg_"+key})
                else:
                    thickness=base._thickness(mask["ids"],sid,objects,mask["matrix"],None)
                    nums["thickness"]=thickness
                    if not thickness["passes"]:failures.append({"j":j,"criterion":"nerve_width"})
                    if not visibility["passes80Percent"]:failures.append({"j":j,"criterion":"nerve_hand_preserved80"})
                nums["objects"]=[o.name for o in objects]
                row["groups"][family]=nums
            machine=_world_projection(base,scene,groups["machine"],mask["matrix"])
            machine["widthPass"]=machine["widthFraction"]>=.30
            row["machine"]=machine
            if not machine["widthPass"]:failures.append({"j":j,"criterion":"machine_width30"})
            if not machine["allInCamera"]:failures.append({"j":j,"criterion":"machine_entirely_in_camera"})
            body_projection=_world_projection(base,scene,groups["leg_body"],mask["matrix"])
            row["bodyRealVertexProjection"]=body_projection
            if not body_projection["allInCamera"]:
                failures.append({"j":j,"criterion":"leg_entirely_in_camera"})
            row["forbiddenMetalObjectsVisible"]=[
                o.name for key in ("brass","iron") for o in p.measure_groups(frog)[key]
                if base._visible_render_object(o)]
            row["forbiddenMetalObjectsVisible"] += [
                o.name for o in frog["parts"].get("handles",[])
                if base._visible_render_object(o)]
            if row["forbiddenMetalObjectsVisible"]:failures.append({"j":j,"criterion":"brass_or_iron_visible"})
            row["toolContact"]=None
            if ctx["lastTool"]:
                actual_tip=p.world_anchor(ctx["tool"],"tip")
                nerve=p.centerline_world(frog,"nerve")[0]
                radius=float(p.FROG_S4_LAYOUT["nerve_radius"])*float(frog["root"].scale.x)
                surface_error=abs((actual_tip-nerve).length-radius)
                row["toolContact"]={"actualModelTip":list(actual_tip),
                                    "nerveCurveCenter":list(nerve),
                                    "surfaceDistanceErrorM":surface_error,
                                    "tipTracksActualToolAnchor":True}
            row["transparentOccluders"]=mask["transparentOccluders"]
            row["skippedCameraPlaneTriangles"]=mask["cameraPlaneSkippedTriangles"]
            maskpath=output/"masks"/("row19-j"+str(j).zfill(5)+".png")
            base._save_mask(mask["ids"],maskpath);row["mask"]=str(maskpath)
            frames.append(row)
        event={"row":19,"start":clock["kick"],"peak":clock["kickPeak"],
               "end":clock["kickEnd"],"degrees":30}
        motion=base._motion(g,event,"frog");report["kick"]=motion
        if not motion["passesStrongMotion10Percent"]:failures.append({"criterion":"actual_toe_travel10"})
        if not motion["angleMatchesIntentWithinOneDegree"]:failures.append({"criterion":"knee30degrees"})
        first=math.floor(clock["spark"]*30)-1
        last=math.ceil(clock["sparkEnd"]*30)+1;fire=[];rotations=[]
        for j in range(first,last+1):
            apply(j/30);bpy.context.view_layer.update()
            fire.append({"j":j,"visible":not ctx["spark"].hide_render})
        for t in (clock["turn"],clock["turn"]+.35):
            apply(t);q=g["MODELS"]["generator"]["parts"]
            rotations.append({"seconds":t,"discY":float(q["rotor"].rotation_euler.y),
                              "crankY":float(q["crank"].rotation_euler.y)})
        visible=[r["j"] for r in fire if r["visible"]]
        materials=_spark_material(ctx["spark"])
        white=bool(materials) and all(m["emission"] is not None and
                                     min(m["emission"][:3])>=.99 and
                                     m["strength"] is not None and m["strength"]>0
                                     for m in materials)
        spark={"frames":fire,"visibleFrames":visible,"visibleCount":len(visible),
               "countPass":len(visible)==6,
               "contiguous":bool(visible and visible==list(range(visible[0],visible[-1]+1))),
               "materials":materials,"whiteEmissiveMaterialPass":white}
        report["spark"]=spark
        report["rotorAndCrank"]=rotations
        rotating=all(abs(rotations[1][key]-rotations[0][key])>.1
                     for key in ("discY","crankY"))
        report["rotorAndCrankMove"]=rotating
        if not rotating:failures.append({"criterion":"disc_and_crank_motion"})
        if not (spark["countPass"] and spark["contiguous"] and white):
            failures.append({"criterion":"one_white_spark_exactly6frames"})
        report["completed"]=True
    except Exception as error:
        report["error"]={"type":type(error).__name__,"message":str(error)}
        raise
    finally:
        apply(0)
        report["elapsedSeconds"]=round(time.time()-started,3)
        report["allSampledApplicableCriteriaPass"]=report["completed"] and not failures
        destination=output/"row19-independent.json"
        destination.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
    return report


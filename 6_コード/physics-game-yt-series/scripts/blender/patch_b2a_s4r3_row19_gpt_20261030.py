"""B-2a row 19 only: explicit generator -> spark -> scalpel -> strong kick.

New runtime patch; never saves a blend, edits a producer file, or changes speech,
captions, shared QA or another row. Root owns UI/rendering and visual acceptance.
prepare(NS) installs wrappers and returns the measurement/event context.
"""
import math
import bpy
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

KEY = "_b2a_s4r3_row19_context"


def _globals(ns):
    for key in ("stage", "apply"):
        fn = ns.get(key)
        g = getattr(fn, "_b2a_scene_globals", None)
        if g and all(k in g for k in ("MODELS", "ROWS", "d", "p")):
            return g
        g = getattr(fn, "__globals__", {})
        if all(k in g for k in ("MODELS", "ROWS", "d", "p")):
            return g
    raise RuntimeError("A live B2a scene namespace is required")


def _descendants(root):
    return [root, *root.children_recursive]


def _surface_objects(model):
    return [ob for ob in model["objects"]
            if ob.type in ("MESH", "CURVE") and not ob.hide_render]


def _points(objects):
    dg = bpy.context.evaluated_depsgraph_get()
    result = []
    for ob in objects:
        if ob.hide_render or ob.type not in ("MESH", "CURVE"):
            continue
        evaluated = ob.evaluated_get(dg)
        mesh = evaluated.to_mesh()
        if mesh:
            try:
                result.extend(evaluated.matrix_world @ v.co for v in mesh.vertices)
            finally:
                evaluated.to_mesh_clear()
    if not result:
        raise RuntimeError("No real visible geometry in row 19 group")
    return result


def _box(ctx, objects):
    bpy.context.view_layer.update()
    xy = [world_to_camera_view(ctx["d"].SC, ctx["d"].CAM, q)
          for q in _points(objects)]
    return {
        "x0": min(v.x for v in xy), "x1": max(v.x for v in xy),
        "y0": 1-max(v.y for v in xy), "y1": 1-min(v.y for v in xy),
        "width": max(v.x for v in xy)-min(v.x for v in xy),
        "height": max(v.y for v in xy)-min(v.y for v in xy),
        "allInCamera": all(0 <= v.x <= 1 and 0 <= v.y <= 1 and v.z > 0 for v in xy),
    }


def _put_screen(ctx, model, objects, target):
    """Translate in the actual tabletop XY plane; never float a board in Z."""
    root = model["root"]
    for _ in range(5):
        box = _box(ctx, objects)
        center = Vector(((box["x0"]+box["x1"])*.5,
                         (box["y0"]+box["y1"])*.5))
        error = Vector(target)-center
        if error.length < .00005:
            break
        columns = []
        baseline = root.location.copy()
        for axis in (0, 1):
            root.location = baseline.copy()
            root.location[axis] += .002
            test = _box(ctx, objects)
            q = Vector(((test["x0"]+test["x1"])*.5,
                        (test["y0"]+test["y1"])*.5))
            columns.append((q-center)/.002)
        root.location = baseline
        a, b = columns
        determinant = a.x*b.y-b.x*a.y
        if abs(determinant) < .00001:
            raise RuntimeError("Cannot position row 19 on the tabletop")
        delta = Vector(((error.x*b.y-b.x*error.y)/determinant,
                        (a.x*error.y-error.x*a.y)/determinant))
        root.location.x += max(-.5, min(.5, delta.x))
        root.location.y += max(-.5, min(.5, delta.y))
    bpy.context.view_layer.update()


def _tool(ctx):
    p, d, m = ctx["p"], ctx["d"], ctx["g"]["M"]
    before, root = p._begin("b2a_s4r3_row19_silver_scalpel")
    silver = d.mat("b2a_s4r3_row19_silver", "#d7dfe4", .24, metal=.78)
    # Model-local +Y runs from the held handle to the nerve contact.
    length = .215
    handle = p.rod("b2a_s4r3_row19_scalpel_handle",
                   (0, -.038, 0), (0, .065, 0), .0145, silver)
    vertices = [(-.016, .052, -.004), (.016, .052, -.004),
                (.010, length-.020, -.004), (0, length, -.004),
                (-.010, length-.020, -.004),
                (-.016, .052, .004), (.016, .052, .004),
                (.010, length-.020, .004), (0, length, .004),
                (-.010, length-.020, .004)]
    mesh = bpy.data.meshes.new("b2a_s4r3_row19_scalpel_blade_mesh")
    mesh.from_pydata(vertices, [], [(0,4,3,2,1),(5,6,7,8,9),
                                   (0,1,6,5),(1,2,7,6),(2,3,8,7),
                                   (3,4,9,8),(4,0,5,9)])
    blade = bpy.data.objects.new("b2a_s4r3_row19_scalpel_blade", mesh)
    d.link(blade); d.put(blade, silver)
    bevel = blade.modifiers.new("soft_physical_blade_edges", "BEVEL")
    bevel.width = .002; bevel.segments = 3
    return p._finish("b2a_s4r3_row19_silver_scalpel", before, root,
                     {"handle":handle, "blade":blade},
                     {"grip":(0,0,0), "tip":(0,length,0)}, 
                     ((-.016,-.053,-.015),(.016,length,.015)))


def _clock(ctx):
    g = ctx["g"]
    start_warning = len(g["EVENT_WARNINGS"])
    w = g["word"]
    result = {
        "start":g["ROWS"][19]["start"], "end":g["ROWS"][19]["end"],
        "turn":w(19, "セエデンキオツクルキカイ"),
        "spark":w(19, "ヒバナオトバシタ"),
        "contact":w(19, "メスガフレテイル"),
        "kick":w(19, "ピクットケッタ"),
    }
    result["sparkEnd"] = result["spark"]+.2
    result["kickPeak"] = result["kick"]+.15
    result["kickEnd"] = result["kick"]+.55
    if len(g["EVENT_WARNINGS"]) != start_warning:
        raise RuntimeError("Row 19 speech lookup fallback is not allowed")
    if not result["start"] < result["turn"] < result["spark"] < result["contact"] < result["kick"] < result["end"]:
        raise RuntimeError("Row 19 speech events are not ordered")
    return result


def _show(ctx, t):
    g, p, d, c = ctx["g"], ctx["p"], ctx["d"], ctx["clock"]
    g["hide_all"]()
    frog = g["use"]("frog", tuple(ctx["frogLocation"]), ctx["frogScale"])
    machine = g["use"]("generator", tuple(ctx["machineLocation"]),
                       ctx["machineScale"])
    p.frog_kick(frog["parts"]["leg"], g["kick_amount"](t, c["kick"]),
                 signal=None)
    # The nervous tissue is touched by a scalpel, not by the later two metals.
    for ob in (frog["parts"]["rods"] + frog["parts"]["tips"] +
               frog["parts"]["contact_objects"] + frog["parts"].get("handles", [])):
        d.show(ob, False)
    p.generator_state(machine, max(0, t-c["turn"])*.65, False)
    p.visible(ctx["tool"], False)
    d.show(ctx["spark"], False)
    bpy.context.view_layer.update()
    if c["spark"] <= t < c["sparkEnd"]:
        center = p.world_anchor(machine, "spark")
        size = .033*ctx["machineScale"]
        local = [(-.5,0,0),(-.15,0,.22),(-.05,0,-.22),(.18,0,.20),(.5,0,0)]
        p._curve_points(ctx["spark"], [center+Vector(v)*size for v in local])
        d.show(ctx["spark"], True)
    # Arrive at the spoken "scalpel was touching"; hold contact through the kick.
    if t >= c["contact"]-.65:
        p.visible(ctx["tool"], True)
        nerve = p.centerline_world(frog, "nerve")[0]
        radius = float(p.FROG_S4_LAYOUT["nerve_radius"])*float(frog["root"].scale.x)
        tip = nerve+Vector((0,-radius,0))
        incoming = 1-g["smooth"](t,c["contact"]-.65,c["contact"])
        tip += Vector((.07,-.07,.055))*incoming
        direction = Vector((-.105,.170,.070)).normalized()
        grip = tip-direction*.215
        root = ctx["tool"]["root"]
        root.location = grip
        root.rotation_euler = direction.to_track_quat("Y","Z").to_euler()
        root.scale = (1,1,1)
        rot = root.rotation_euler
        p.pose_connected_hand("mio", grip, scale=.48,
                             yaw=math.degrees(rot.z),
                             pitch=math.degrees(rot.x),
                             roll=math.degrees(rot.y))
        ctx["lastTool"] = {"tip":tip.copy(),"grip":grip.copy(),
                          "nerveCenter":nerve.copy()}
    else:
        ctx["lastTool"] = None
    bpy.context.view_layer.update()
    primary = p.measure_groups(frog)["leg_body"]+_surface_objects(machine)
    # Retain the original shot-plan's subject identities for their genuine
    # visible subjects. "assistant" is the connected scalpel-holding hand,
    # not a claim that an otherwise hidden full doll is visible. At contact the
    # named subject is the real silver tip and exposed nerve in this same view.
    shot_name=("b2a_scalpel_nerve_contact" if c["contact"]<=t<c["kick"]
               else "b2a_generator,b2a_frog,b2a_assistant")
    return {"row":19, "models":[machine,frog,ctx["tool"]],
            "primary":primary, "name":shot_name,
            "az":0,"el":25,"target":.94,"maxheight":.62,"lens":140,
            "fullFace":False, "eligibility":{}, "row19Patch":True}


def _layout(ctx):
    """Keep the accepted single-leg apparent size, rather than shrink both."""
    g, d, p = ctx["g"], ctx["d"], ctx["p"]
    camera = g["CAMERAS"].get("21") or g["calibrate"](21)
    ctx["camera"] = dict(camera)
    d.pose_cam(camera["pose"]); d.CAM_D.shift_y=camera["shift"]
    ctx["frogScale"] = .86
    frog = g["use"]("frog",(0,-.10,0),ctx["frogScale"])
    p.frog_kick(frog["parts"]["leg"],0,signal=None)
    for ob in frog["parts"]["rods"]+frog["parts"]["tips"]+frog["parts"]["contact_objects"]+frog["parts"].get("handles",[]):
        d.show(ob,False)
    body = p.measure_groups(frog)["leg_body"]
    # Both live on Z=0. Their diagonal arrangement keeps a large unchanged leg
    # and puts the full generator on its left, not outside a foot-only camera.
    _put_screen(ctx,frog,body,(.510,.490))
    ctx["frogLocation"] = frog["root"].location.copy()
    machine = g["use"]("generator",(0,.12,0),.75)
    for _ in range(4):
        machine_objects = [o for o in _surface_objects(machine)
                           if o is not machine["parts"]["spark"]]
        _put_screen(ctx,machine,machine_objects,(.205,.270))
        width = _box(ctx,machine_objects)["width"]
        machine["root"].scale *= .335/width
    _put_screen(ctx,machine,machine_objects,(.205,.270))
    ctx["machineLocation"] = machine["root"].location.copy()
    ctx["machineScale"] = float(machine["root"].scale.x)
    ctx["layoutMeasurements"] = {
        "body":_box(ctx,body), "machine":_box(ctx,machine_objects)}
    ctx["footCameraReference"] = camera


def prepare(ns):
    if KEY in ns:
        return ns[KEY]
    g = _globals(ns)
    ctx = {"g":g,"d":g["d"],"p":g["p"],"lastTool":None,
           "original_stage":g["stage"],"original_apply":g["apply"]}
    ctx["clock"] = _clock(ctx)
    ctx["tool"] = _tool(ctx)
    g["MODELS"]["s4r3_row19_tool"] = ctx["tool"]
    white = g["d"].mat("b2a_s4r3_row19_white_spark","#ffffff",.3,
                         emit="#ffffff",strength=5)
    ctx["spark"] = g["p"].curve("b2a_s4r3_row19_white_spark",
                                [(0,0,0)]*5,white,.0032)
    g["explain"].append(ctx["spark"])
    _layout(ctx)

    def stage(t):
        return _show(ctx,t) if g["row_at"](t)["row"]==19 else ctx["original_stage"](t)
    def apply(t):
        if g["row_at"](t)["row"]!=19:
            return ctx["original_apply"](t)
        state=_show(ctx,t)
        camera=ctx["camera"]
        g["d"].pose_cam(camera["pose"]);g["d"].CAM_D.shift_y=camera["shift"]
        g["d"].CAM_D.dof.aperture_fstop=5.6
        bpy.context.view_layer.update()
        return state
    stage._b2a_scene_globals=g;apply._b2a_scene_globals=g
    ctx["stage"],ctx["apply"]=stage,apply
    g["stage"],g["apply"]=stage,apply
    ns["stage"],ns["apply"]=stage,apply
    ns[KEY]=ctx;g[KEY]=ctx
    ctx["measure_groups"]=lambda:measure_groups(ctx)
    ctx["foot_tip_world"]=lambda:ctx["p"].foot_tip_world(g["MODELS"]["frog"])
    ctx["anchors"]=lambda:anchors(ctx)
    return ctx


def measure_groups(ctx):
    g=ctx["g"];frog=g["MODELS"]["frog"];machine=g["MODELS"]["generator"]
    groups=ctx["p"].measure_groups(frog)
    return {"leg_body":groups["leg_body"],"nerve":groups["nerve"],
            "machine":[o for o in _surface_objects(machine)
                       if o is not machine["parts"]["spark"]],
            "scalpel":list(ctx["tool"]["objects"]),
            "hand":_descendants(ctx["d"].HANDS["mio"]),
            "spark":[ctx["spark"]],"brass":[],"iron":[]}


def anchors(ctx):
    g,p=ctx["g"],ctx["p"];frog=g["MODELS"]["frog"];machine=g["MODELS"]["generator"]
    result={"machine":p.world_anchor(machine,"center"),
            "terminal":p.world_anchor(machine,"terminal"),
            "nerve":p.centerline_world(frog,"nerve")[0],
            "toe":p.foot_tip_world(frog)}
    if ctx["lastTool"]:
        result.update({"scalpelTip":ctx["lastTool"]["tip"].copy(),
                       "scalpelGrip":ctx["lastTool"]["grip"].copy()})
    return result


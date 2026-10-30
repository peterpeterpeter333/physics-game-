"""New private extension: shared render code targets an explicit owned scene.

The real bpy module, shared desk_lib source, and other scenes are not patched.
Pass this proxy only in the copied globals of an episode's existing d.main.
"""
import bpy

class _RenderOps:
    def __init__(self,scene):self._scene=scene
    def render(self,*args,**kwargs):
        named=kwargs.pop('scene',self._scene.name)
        if named!=self._scene.name:raise RuntimeError('Refusing render to a different episode scene')
        return bpy.ops.render.render(*args,scene=self._scene.name,**kwargs)
    def __getattr__(self,name):return getattr(bpy.ops.render,name)

class _Ops:
    def __init__(self,scene):self.render=_RenderOps(scene)
    def __getattr__(self,name):return getattr(bpy.ops,name)

class _Bpy:
    def __init__(self,scene):self.ops=_Ops(scene)
    def __getattr__(self,name):return getattr(bpy,name)

def explicit_scene_bpy(scene):return _Bpy(scene)

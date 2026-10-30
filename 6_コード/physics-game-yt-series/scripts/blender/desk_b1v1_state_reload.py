"""Reload only new B-1 state functions into the already constructed B-1 GUI scene."""
import ast,hashlib,os
def reload_state(ns):
    src=ns['__file__'];ext=ns['ext'].__file__
    extsha=hashlib.sha256(open(ext,'rb').read()).hexdigest()
    if ns.get('_built_ext_sha',extsha)!=extsha:raise RuntimeError('Geometry changed: construct a fresh scene')
    ns['_built_ext_sha']=extsha
    tree=ast.parse(open(src).read(),src)
    start=next(n.lineno for n in tree.body if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='SPANS' for t in n.targets))
    nodes=[n for n in tree.body if isinstance(n,(ast.FunctionDef,ast.AsyncFunctionDef)) or (n.lineno>=start and not isinstance(n,ast.If))]
    ns['bpy'].context.window.scene=ns['d'].SC
    exec(compile(ast.Module(body=nodes,type_ignores=[]),src,'exec'),ns)
    return ns

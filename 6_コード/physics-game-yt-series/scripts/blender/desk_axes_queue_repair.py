"""Keep the active timer, updating only its own queue filename filter in place."""
import ast
path=_AXES_SCRIPT_ROOT/'desk_axes_dispatcher.py'
module=ast.parse(path.read_text(),filename=str(path))
function=next(n for n in module.body if isinstance(n,ast.FunctionDef) and n.name=='_axes_poll')
temporary={}
exec(compile(ast.Module(body=[function],type_ignores=[]),str(path),'exec'),temporary)
for record in list(_AXES_ROOT.glob('job-*.done.json')):
    marker=record.with_suffix('.done.json')
    if not marker.exists():marker.write_text('{"status":"bookkeeping-record-not-an-executable-job"}')
_axes_poll.__code__=temporary['_axes_poll'].__code__
print('Queue bookkeeping JSON is now excluded from executable jobs; existing timer retained',flush=True)

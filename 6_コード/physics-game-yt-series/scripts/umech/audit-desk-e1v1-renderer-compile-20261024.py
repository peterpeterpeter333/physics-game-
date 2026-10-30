"""Reproduce the strict renderer-code mismatch WITHOUT Blender/bpy/GPU.

Run with Blender's bundled plain python3.13 executable, NOT Blender CLI.
Compile-only: no shared module import, no model initialization, no rendering.
The production guard is not changed; normalized instructions are diagnostic
evidence ONLY, never used to approve or bypass that original strict guard.
"""
import ast
from collections import Counter
import dis
import hashlib
import io
import json
from pathlib import Path
import platform
import runpy
import sys
import time
import types

W = Path(__file__).resolve().parents[2]
C = Path('/private/tmp/ys/ys-chain-e1v1')
SOURCE = W / 'scripts/blender/desk_lib.py'
RESTORER = W / 'scripts/blender/desk_axes_e1_restore_renderer_v2_20261024.py'
OUT = C / 'e1v1-renderer-compile-reproduction-20261024.json'


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def byte_sha(b):
    return hashlib.sha256(b).hexdigest()


def normalize_for_diagnosis(code):
    """Expose only the observed NULL-call encoding difference, not a guard."""
    instructions = list(dis.get_instructions(code))
    retained = [x for x in instructions if x.opname != 'PUSH_NULL']
    offsets = [x.offset for x in retained]
    result = []
    for x in retained:
        if x.opcode in dis.hasjabs + dis.hasjrel:
            value = {'targetRetainedInstructionIndex': sum(offset < x.argval for offset in offsets)}
        elif isinstance(x.argval, types.CodeType):
            value = {'nestedCode': normalize_for_diagnosis(x.argval)}
        elif x.opname == 'LOAD_ATTR':
            # argval is the attribute name; argrepr additionally exposes the
            # NULL|self bit used by the extracted-AST call form on this build.
            value = x.argval
        elif isinstance(x.argval, (str, int, float, bool)) or x.argval is None:
            value = x.argval
        else:
            value = repr(x.argval)
        result.append([x.opname, value])
    return result


def describe(code):
    output = io.StringIO()
    dis.dis(code, file=output)
    instructions = list(dis.get_instructions(code))
    normalized = normalize_for_diagnosis(code)
    return {'bytecodeHex': code.co_code.hex(), 'bytecodeSha256': byte_sha(code.co_code),
            'exceptionTableHex': getattr(code, 'co_exceptiontable', b'').hex(),
            'exceptionTableSha256': byte_sha(getattr(code, 'co_exceptiontable', b'')),
            'bytecodeBytes': len(code.co_code), 'instructionCount': len(instructions),
            'opcodeCounts': dict(Counter(x.opname for x in instructions)),
            'normalizedDiagnosticInstructions': normalized,
            'normalizedDiagnosticSha256': byte_sha(json.dumps(normalized, sort_keys=True).encode()),
            'disassembly': output.getvalue()}


def main():
    assert not OUT.exists(), 'Preserve the original reproduction record'
    source = SOURCE.read_text()
    before = sha(SOURCE)
    whole = compile(source, str(SOURCE), 'exec')
    old_style = next(c for c in whole.co_consts if isinstance(c, types.CodeType) and c.co_name == 'main')
    adapted = source.replace('bpy.ops.wm.read_factory_settings(use_empty=True)', 'pass # GUI scene already empty').replace('bpy.context.active_object', 'bpy.context.view_layer.objects.active')
    gui_module = compile(adapted, str(SOURCE), 'exec')
    gui_main = next(c for c in gui_module.co_consts if isinstance(c, types.CodeType) and c.co_name == 'main')
    node = next(n for n in ast.parse(source).body if isinstance(n, ast.FunctionDef) and n.name == 'main')
    isolated = {}
    exec(compile(ast.Module(body=[node], type_ignores=[]), str(SOURCE), 'exec'), isolated)
    canonical = isolated['main'].__code__
    diagnostic = runpy.run_path(str(RESTORER))
    differences = diagnostic['code_differences'](old_style, canonical)
    gui_differences = diagnostic['code_differences'](old_style, gui_main)
    descriptions = {'wholeSourceStringMain': describe(old_style),
                    'originalRunnerExtractedAstMain': describe(canonical),
                    'guiAdapterWholeSourceMain': describe(gui_main)}
    normalized_equal = (descriptions['wholeSourceStringMain']['normalizedDiagnosticInstructions'] ==
                        descriptions['originalRunnerExtractedAstMain']['normalizedDiagnosticInstructions'])
    result = {'id': 'ys-chain-e1v1', 'scope': 'Independent local compile-only reproduction; NO Blender process, bpy import, GPU or shared-source execution',
              'createdUnixSeconds': time.time(), 'executable': sys.executable,
              'pythonVersion': sys.version, 'platform': platform.platform(),
              'source': str(SOURCE), 'sourceSha256': before,
              'reproductionHelper': str(Path(__file__).resolve()), 'reproductionHelperSha256': sha(__file__),
              'diagnosticHelperSha256': sha(RESTORER),
              'wholeSourceVsExtractedAstDifferencePaths': [v['path'] for v in differences],
              'guiAdapterDoesNotChangeMainCode': not gui_differences,
              'instructionDifference': {name: descriptions['wholeSourceStringMain']['opcodeCounts'].get(name, 0) -
                                      descriptions['originalRunnerExtractedAstMain']['opcodeCounts'].get(name, 0)
                                       for name in set(descriptions['wholeSourceStringMain']['opcodeCounts']) |
                                                   set(descriptions['originalRunnerExtractedAstMain']['opcodeCounts'])
                                       if descriptions['wholeSourceStringMain']['opcodeCounts'].get(name, 0) !=
                                          descriptions['originalRunnerExtractedAstMain']['opcodeCounts'].get(name, 0)},
              'diagnosticNormalizedInstructionsEqual': normalized_equal,
              'normalizationDoesNotReplaceOriginalGuard': True, 'codes': descriptions,
              'bpyImported': 'bpy' in sys.modules, 'sharedModuleImportedOrExecuted': False,
              'modelOrImageChanged': False, 'liveGuiComparisonPending': True,
              'interpretation': 'On this Python build identical source-main definition compiled as a whole source string versus extracted AST has differing method-call NULL encodings and shifted exception-table offsets. Live GUI code must still be matched before attribution.'}
    assert sha(SOURCE) == before and 'bpy' not in sys.modules
    with OUT.open('x') as f:
        json.dump(result, f, ensure_ascii=False, indent=1)
        f.write('\n')
    print(json.dumps({'out': str(OUT), 'pythonVersion': sys.version,
                      'differences': result['wholeSourceVsExtractedAstDifferencePaths'],
                      'opcodeDifference': result['instructionDifference'],
                      'diagnosticNormalizedInstructionsEqual': normalized_equal,
                      'bpyImported': False, 'gpuOrRendering': False}))


if __name__ == '__main__':
    main()

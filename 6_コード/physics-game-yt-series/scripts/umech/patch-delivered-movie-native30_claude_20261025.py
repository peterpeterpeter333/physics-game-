#!/usr/bin/env python3
"""Claude 2026-10-25 copy: also accepts an original whose all-512 stts is split into two rows
(the delivered B-1 after the native duration repair). Otherwise identical.

Task-private CPU movie patcher with bounded native last-sample correction.

Uses the frozen earlier patcher's decoding, mapping and native AAC-copy tools.
It never changes that helper, a source film, audio, subtitles or a prior output.
The known FFmpeg last-zero-duration case is repaired BEFORE final verification.
"""
import argparse
import datetime
import hashlib
import json
import pathlib
import runpy
import shutil

HERE = pathlib.Path(__file__).parent
BASE = HERE / 'patch-delivered-movie-cpu.py'
FIX = HERE / 'finalize-zero-duration-video-native-20261025.py'
BASE_SHA = 'c6fccd5e344afde07b902eb4a9366697b87b1dd43e92b3b849138e7e33a4df96'
FIX_SHA = 'af4ab125cfd491ab7f6caab71d80c734b66120059714f2ce7317c4009c1ad035'


def sha(p):
    h = hashlib.sha256()
    with open(p, 'rb') as f:
        for b in iter(lambda: f.read(1048576), b''):
            h.update(b)
    return h.hexdigest()


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--original', required=True, type=pathlib.Path)
    p.add_argument('--mapping', required=True, type=pathlib.Path)
    p.add_argument('--output-dir', required=True, type=pathlib.Path)
    p.add_argument('--expected-frames', required=True, type=int, choices=(10700, 12162))
    a = p.parse_args()
    assert sha(BASE) == BASE_SHA and sha(FIX) == FIX_SHA
    api, fix = runpy.run_path(str(BASE)), runpy.run_path(str(FIX))
    require, state = api['require'], api['state']
    original, mapping = a.original.resolve(strict=True), a.mapping.resolve(strict=True)
    out = a.output_dir.absolute()
    require(out.parent.is_dir() and not out.exists(), 'Output directory must be NEW')
    inputs = {str(q): state(q) for q in [BASE, FIX, original, mapping]}
    native = api['movie_info'](original)
    v = api['one_track'](native, 'vide')
    n = a.expected_frames
    require(v['codec'] == 'avc1' and v['sample_count'] == n and v['media_timescale'] == 15360
            and sum(c for c, d in v['stts']) == n and all(d == 512 for c, d in v['stts']) and (v['width'], v['height']) == (1080, 1920), 'Unexpected original video')
    require(api['one_track'](native, 'soun')['codec'] == 'mp4a', 'Expected original AAC')
    frames = api['read_mapping'](mapping, n)
    for q in set(frames.values()):
        inputs[str(q)] = state(q)
    blocks = api['make_blocks'](list(frames))
    out.mkdir(exist_ok=False)
    report = {'status': 'running', 'created_at_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
              'helper_sha256': sha(__file__), 'original': inputs[str(original)], 'mapping': inputs[str(mapping)],
              'native_original': native, 'changed_frames': list(frames), 'blocks': blocks,
              'commands': [], 'ear_listening_performed': False, 'git_used': False,
              'audio_reencoded': False, 'quality_note': 'CRF14 reencodes video, including unchanged frames. Original AAC is copied without filtering.'}
    ff = api['DEFAULT_FF']
    report['ffmpeg'] = state(ff)
    try:
        compact = out / 'compact-png'
        compact.mkdir()
        for i, png in enumerate(frames.values()):
            (compact / ('%06d.png' % i)).symlink_to(png)
        pattern = compact / '%06d.png'
        api['validate_opaque_sequence'](ff, pattern, len(frames), report['commands'])
        report['original_frame_pts'] = api['frame_pts_check'](ff, original, n, report['commands'])
        report['original_aac_packet_sha256'] = api['audio_hash'](ff, original, False, report['commands'])
        report['original_pcm_f32le_sha256'] = api['audio_hash'](ff, original, True, report['commands'])
        pts, cumulative = 'N+%d' % blocks[0]['start'], blocks[0]['length']
        for previous, current in zip(blocks, blocks[1:]):
            pts += '+gte(N,%d)*%d' % (cumulative, current['start'] - previous['end'] - 1)
            cumulative += current['length']
        enabled = '+'.join('between(n,%d,%d)' % (b['start'], b['end']) for b in blocks)
        graph = ('[0:v:0]trim=end_frame=%d,settb=expr=1/30,setpts=N,format=yuv420p[base];'
                 '[1:v:0]settb=expr=1/30,setpts=\'%s\',format=yuv420p[patch];'
                 '[base][patch]overlay=x=0:y=0:eof_action=pass:repeatlast=0:shortest=0:'
                 'format=yuv420:enable=\'%s\'[video]') % (n, pts, enabled)
        raw, corrected, final = out / 'raw-video-only.mp4', out / 'corrected-video-only.mp4', out / 'revision.mp4'
        command = [ff, '-n', '-nostdin', '-hide_banner', '-xerror', '-hwaccel', 'none', '-i', str(original),
                   '-framerate', '30', '-start_number', '0', '-i', str(pattern), '-filter_complex', graph,
                   '-map', '[video]', '-an', '-sn', '-dn', '-c:v', 'libx264', '-preset', 'fast', '-crf', '14',
                   '-threads:v', '4', '-pix_fmt', 'yuv420p', '-fps_mode:v', 'passthrough', '-enc_time_base:v', '1:30',
                   '-video_track_timescale', '15360', '-movie_timescale', '1000', '-use_editlist', '1',
                   '-avoid_negative_ts', 'disabled', '-movflags', '+faststart', str(raw)]
        report['filtergraph'] = graph
        api['run'](command, report['commands'])
        raw_info = api['movie_info'](raw)
        raw_video = api['one_track'](raw_info, 'vide')
        require(raw_video['sample_count'] == n, 'Encoded frame count differs')
        old_boxes = fix['unchanged_video_box_hashes'](api, raw)
        if raw_video['stts'] == [[n - 1, 512], [1, 0]]:
            patches = fix['build_patches'](api, raw, native, raw_info, n)
            report['duration_repair'] = fix['copy_with_duration_patches'](raw, corrected, patches)
        else:
            require(raw_video['stts'] == [[n, 512]] and raw_video['edit_list'] == v['edit_list'], 'Unknown encoded timing; not repairable')
            require(not corrected.exists(), 'Preserve prior corrected output')
            shutil.copyfile(raw, corrected)
            report['duration_repair'] = {'not_needed': True}
        require(fix['unchanged_video_box_hashes'](api, corrected) == old_boxes, 'Video sample metadata changed')
        report['corrected_frame_pts'] = api['frame_pts_check'](ff, corrected, n, report['commands'])
        report['native_mux'] = api['native_mp4_mux'](original, corrected, final)
        final_native = api['movie_info'](final)
        report['native_final'] = final_native
        fv = api['one_track'](final_native, 'vide')
        require(fv['sample_count'] == n and all(d == 512 for c, d in fv['stts'])
                and fv['media_duration_ticks'] == n * 512 and fv['edit_list'] == v['edit_list']
                and fv['presentation_duration_movie_ticks'] == v['presentation_duration_movie_ticks'], 'Final native video timing differs')
        require(final_native['movie_timescale'] == native['movie_timescale']
                and final_native['movie_duration_ticks'] == native['movie_duration_ticks'], 'Movie duration differs')
        require(api['audio_signature'](final_native) == api['audio_signature'](native), 'Original AAC native metadata changed')
        require(fix['unchanged_video_box_hashes'](api, final) == old_boxes, 'Video sample metadata changed in mux')
        report['final_frame_pts'] = api['frame_pts_check'](ff, final, n, report['commands'])
        require(report['final_frame_pts'] == report['corrected_frame_pts'], 'Decoded frame/pixel/PTS sequence differs after mux')
        report['final_aac_packet_sha256'] = api['audio_hash'](ff, final, False, report['commands'])
        report['final_pcm_f32le_sha256'] = api['audio_hash'](ff, final, True, report['commands'])
        require(report['original_aac_packet_sha256'] == report['final_aac_packet_sha256'], 'Original AAC packets differ')
        require(report['original_pcm_f32le_sha256'] == report['final_pcm_f32le_sha256'], 'Decoded audio differs')
        report['final_file'] = state(final)
        report['status'] = 'mechanical_checks_passed_visual_review_pending'
    except BaseException as e:
        report['status'], report['error'] = 'failed', str(e)
        raise
    finally:
        report['protected_inputs_unchanged'] = all(state(pathlib.Path(q)) == s for q, s in inputs.items())
        if not report['protected_inputs_unchanged']:
            report['status'] = 'failed'
        api['write_json_new'](out / 'patch-movie-receipt.json', report)
        print(json.dumps({'status': report['status'], 'receipt': str(out / 'patch-movie-receipt.json')}, ensure_ascii=False), flush=True)
        require(report['protected_inputs_unchanged'], 'Source input changed')


if __name__ == '__main__':
    main()

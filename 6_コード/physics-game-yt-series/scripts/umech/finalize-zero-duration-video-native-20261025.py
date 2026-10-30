#!/usr/bin/env python3
"""Bounded, no-reencode finalization of a last-zero-duration encoded video.

Requires a failed receipt from the pinned CPU patch helper. Copies its existing
video-only.mp4 to a NEW directory, changes only five fixed-width duration fields,
then native-muxes the corrected video with the original AAC track and packets.
Old helper, receipt, video-only, failed revision, and original remain unchanged.
"""
import argparse
import datetime
import hashlib
import json
import pathlib
import runpy
import struct


BASE_SHA256 = 'c6fccd5e344afde07b902eb4a9366697b87b1dd43e92b3b849138e7e33a4df96'
BASE_PATH = pathlib.Path(__file__).with_name('patch-delivered-movie-cpu.py')


def sha(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(1048576), b''):
            h.update(chunk)
    return h.hexdigest()


def require(condition, message):
    if not condition:
        raise RuntimeError(message)


def find_video_boxes(api, path):
    with open(path, 'rb') as f:
        top = list(api['boxes'](f, 0, path.stat().st_size))
        moov = next(b for b in top if b[0] == b'moov')
        traks = [b for b in api['boxes'](f, moov[1], moov[2]) if b[0] == b'trak']
        require(len(traks) == 1 and api['track_handler'](f, traks[0]) == b'vide', 'Existing video-only must have exactly one video track')
        trak = traks[0]
        mdia = api['child'](f, trak, b'mdia')
        stbl = api['child'](f, api['child'](f, mdia, b'minf'), b'stbl')
        edts = api['child'](f, trak, b'edts')
        result = {'mvhd': api['child'](f, moov, b'mvhd'),
                  'tkhd': api['child'](f, trak, b'tkhd'),
                  'mdhd': api['child'](f, mdia, b'mdhd'),
                  'stts': api['child'](f, stbl, b'stts'),
                  'elst': api['child'](f, edts, b'elst') if edts else None}
        require(all(result.values()), 'Required video timing atom is absent')
        return result


def unchanged_video_box_hashes(api, path):
    with open(path, 'rb') as f:
        top = list(api['boxes'](f, 0, path.stat().st_size))
        moov = next(b for b in top if b[0] == b'moov')
        trak = next(b for b in api['boxes'](f, moov[1], moov[2]) if b[0] == b'trak' and api['track_handler'](f, b) == b'vide')
        stbl = api['child'](f, api['child'](f, api['child'](f, trak, b'mdia'), b'minf'), b'stbl')
        result = {}
        for name in ('ctts', 'stsz', 'stsd', 'stss', 'sdtp', 'sgpd', 'sbgp'):
            box = api['child'](f, stbl, name.encode('ascii'))
            result[name] = hashlib.sha256(api['raw_box'](f, box)).hexdigest() if box else None
        return result


def duration_patch(f, box, name, expected, replacement):
    f.seek(box[1])
    version = f.read(1)[0]
    require(version in (0, 1), 'Unsupported ' + name + ' version')
    if name in ('mvhd', 'mdhd'):
        relative = 24 if version == 1 else 16
    elif name == 'tkhd':
        relative = 28 if version == 1 else 20
    elif name == 'elst':
        f.seek(box[1] + 4)
        require(struct.unpack('>I', f.read(4))[0] == 1, 'Repair requires exactly one nonempty video edit')
        relative = 8
    else:
        raise RuntimeError('Unexpected duration box')
    size = 8 if version == 1 else 4
    position = box[1] + relative
    f.seek(position)
    old = f.read(size)
    require(int.from_bytes(old, 'big') == expected, 'Unexpected old ' + name + ' duration')
    return {'field': name + '.duration', 'offset': position, 'bytes': size,
            'before': expected, 'after': replacement,
            'before_hex': old.hex(), 'after_hex': replacement.to_bytes(size, 'big').hex()}


def build_patches(api, path, original_info, encoded_info, expected_frames):
    original_video = api['one_track'](original_info, 'vide')
    encoded_video = api['one_track'](encoded_info, 'vide')
    atoms = find_video_boxes(api, path)
    patches = []
    with open(path, 'rb') as f:
        stts = api['payload'](f, atoms['stts'])
        require(len(stts) == 24 and stts[:4] == b'\0\0\0\0', 'stts must have exactly two normal entries')
        require(struct.unpack_from('>IIIII', stts, 4) == (2, expected_frames - 1, 512, 1, 0), 'Only the final one-sample zero duration can be repaired')
        patches.append({'field': 'stts.last_sample_delta', 'offset': atoms['stts'][1] + 20,
                        'bytes': 4, 'before': 0, 'after': 512,
                        'before_hex': '00000000', 'after_hex': '00000200'})
        patches.append(duration_patch(f, atoms['mdhd'], 'mdhd', encoded_video['media_duration_ticks'], original_video['media_duration_ticks']))
        patches.append(duration_patch(f, atoms['tkhd'], 'tkhd', encoded_video['presentation_duration_movie_ticks'], original_video['presentation_duration_movie_ticks']))
        patches.append(duration_patch(f, atoms['elst'], 'elst', encoded_video['edit_list'][0][0], original_video['edit_list'][0][0]))
        patches.append(duration_patch(f, atoms['mvhd'], 'mvhd', encoded_info['movie_duration_ticks'], original_video['presentation_duration_movie_ticks']))
    ordered = sorted(patches, key=lambda p: p['offset'])
    require(all(a['offset'] + a['bytes'] <= b['offset'] for a, b in zip(ordered, ordered[1:])), 'Duration patches overlap')
    return ordered


def copy_with_duration_patches(source, destination, patches):
    # Fixed-width replacements keep every atom size, chunk offset, CTTS entry,
    # and encoded video packet byte in exactly its existing position.
    for patch in patches:
        with open(source, 'rb') as f:
            f.seek(patch['offset'])
            require(f.read(patch['bytes']).hex() == patch['before_hex'], 'Pre-copy duration guard failed')
    expected_hash, outside_hash = hashlib.sha256(), hashlib.sha256()
    cursor = 0
    with open(source, 'rb') as src, destination.open('xb') as out:
        for chunk in iter(lambda: src.read(1048576), b''):
            data, normalized = bytearray(chunk), bytearray(chunk)
            for patch in patches:
                left = max(cursor, patch['offset'])
                right = min(cursor + len(data), patch['offset'] + patch['bytes'])
                if left < right:
                    relative = left - patch['offset']
                    new = bytes.fromhex(patch['after_hex'])
                    data[left - cursor:right - cursor] = new[relative:relative + right - left]
                    normalized[left - cursor:right - cursor] = b'\0' * (right - left)
            out.write(data)
            expected_hash.update(data)
            outside_hash.update(normalized)
            cursor += len(data)
    require(destination.stat().st_size == source.stat().st_size and sha(destination) == expected_hash.hexdigest(), 'Fixed-width copy checksum/size failed')
    normalized_after = hashlib.sha256()
    cursor = 0
    with destination.open('rb') as f:
        for chunk in iter(lambda: f.read(1048576), b''):
            data = bytearray(chunk)
            for patch in patches:
                left = max(cursor, patch['offset'])
                right = min(cursor + len(data), patch['offset'] + patch['bytes'])
                if left < right:
                    data[left - cursor:right - cursor] = b'\0' * (right - left)
            normalized_after.update(data)
            cursor += len(data)
    require(outside_hash.hexdigest() == normalized_after.hexdigest(), 'Bytes outside duration fields changed')
    return {'only_fixed_width_duration_fields_changed': True, 'patches': patches,
            'outside_duration_fields_sha256_before_and_after': outside_hash.hexdigest(),
            'corrected_file_sha256': expected_hash.hexdigest()}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--failed-receipt', type=pathlib.Path, required=True)
    parser.add_argument('--output-dir', type=pathlib.Path, required=True)
    parser.add_argument('--expected-frames', type=int, choices=(10700, 12162), required=True)
    args = parser.parse_args()
    require(sha(BASE_PATH) == BASE_SHA256, 'Pinned old encoder helper has changed; review before using this bounded finalizer')
    api = runpy.run_path(str(BASE_PATH))
    receipt_path = args.failed_receipt.resolve(strict=True)
    prior = json.loads(receipt_path.read_text(encoding='utf-8'))
    require(prior['status'] == 'failed' and prior.get('error') == 'Final video native frame timing differs', 'This finalizer only accepts the exact native-final-video timing failure')
    require(prior.get('protected_inputs_unchanged') is True and prior['helper_sha256'] == BASE_SHA256, 'Failed encode source/pinned-helper preservation guard is missing')
    original = pathlib.Path(prior['original']['path']).resolve(strict=True)
    video_only = (receipt_path.parent / 'video-only.mp4').resolve(strict=True)
    failed_revision = (receipt_path.parent / 'revision.mp4').resolve(strict=True)
    ff = prior['ffmpeg']['path']
    require(sha(ff) == prior['ffmpeg']['sha256'], 'FFmpeg differs from the previous decoded-framehash run')
    protected_paths = [BASE_PATH, receipt_path, original, video_only, failed_revision]
    protected_before = {str(p): api['state'](p) for p in protected_paths}
    require(protected_before[str(original)]['sha256'] == prior['original']['sha256'], 'Original MP4 no longer matches failed receipt')
    original_info, encoded_info = api['movie_info'](original), api['movie_info'](video_only)
    require(original_info == prior['native_original'], 'Original native movie metadata changed')
    original_video, encoded_video = api['one_track'](original_info, 'vide'), api['one_track'](encoded_info, 'vide')
    require(encoded_video == api['one_track'](prior['native_final'], 'vide'), 'Existing video-only no longer matches the failed final video track')
    n = args.expected_frames
    require(original_video['sample_count'] == encoded_video['sample_count'] == n, 'Video sample count differs')
    require(original_video['stts'] == [[n, 512]] and encoded_video['stts'] == [[n - 1, 512], [1, 0]], 'Unexpected original/encoded sample timing')
    require(original_video['media_duration_ticks'] == n * 512 and encoded_video['media_duration_ticks'] == (n - 1) * 512, 'Only one final 512-tick duration can be restored')
    require(original_video['media_timescale'] == encoded_video['media_timescale'] == 15360 and original_info['movie_timescale'] == encoded_info['movie_timescale'] == 1000, 'Unexpected native time base')
    require(original_video['codec'] == encoded_video['codec'] == 'avc1' and (encoded_video['width'], encoded_video['height']) == (1080, 1920), 'Unexpected video codec/dimensions')
    require(len(original_video['edit_list']) == len(encoded_video['edit_list']) == 1 and
            original_video['edit_list'][0][1:] == encoded_video['edit_list'][0][1:] == [1024, 1, 0], 'New CTTS/edit start is outside this bounded repair')
    require(encoded_video['presentation_duration_movie_ticks'] == encoded_video['edit_list'][0][0] == encoded_info['movie_duration_ticks'], 'Existing video-only duration fields are not the same known short duration')
    require(original_video['presentation_duration_movie_ticks'] == original_video['edit_list'][0][0] and
            32 <= original_video['presentation_duration_movie_ticks'] - encoded_video['presentation_duration_movie_ticks'] <= 34, 'Presentation duration difference is not one 30fps frame')
    expected_decoded_hash = prior['video_only_frame_pts']['decoded_framehash_receipt_sha256']
    require(prior['video_only_frame_pts'] == prior['final_frame_pts'] and prior['video_only_frame_pts']['decoded_frames'] == n, 'Prior full decoded video sequence was not identical through failed mux')
    patches = build_patches(api, video_only, original_info, encoded_info, n)
    original_video_boxes = unchanged_video_box_hashes(api, video_only)
    outdir = args.output_dir.absolute()
    require(outdir.parent.is_dir() and not outdir.exists(), 'Output directory must be NEW with an existing parent')
    outdir.mkdir(exist_ok=False)
    new_receipt = outdir / 'bounded-finalize-receipt.json'
    report = {'status': 'running', 'created_at_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
              'helper_sha256': sha(__file__), 'pinned_encoder_helper_sha256': BASE_SHA256,
              'source_failed_receipt': protected_before[str(receipt_path)], 'protected_inputs_before': protected_before,
              'native_original': original_info, 'native_encoded_before': encoded_info, 'commands': [],
              'no_reencode_performed': True, 'ear_listening_performed': False, 'asr_performed': False,
              'prior_visual_reviews_automatically_rebound': False,
              'review_note': 'New file SHA must be explicitly bound to existing image reviews using the full decoded-sequence equality recorded here.',
              'expected_prior_decoded_sequence_sha256': expected_decoded_hash}
    try:
        corrected, final = outdir / 'corrected-video-only.mp4', outdir / 'revision.mp4'
        report['duration_repair'] = copy_with_duration_patches(video_only, corrected, patches)
        require(unchanged_video_box_hashes(api, corrected) == original_video_boxes, 'New CTTS/sample sizes/configuration changed')
        report['corrected_frame_pts'] = api['frame_pts_check'](ff, corrected, n, report['commands'])
        require(report['corrected_frame_pts']['decoded_framehash_receipt_sha256'] == expected_decoded_hash, 'Corrected decoded pixels/PTS differ from the failed encode sequence')
        report['native_mux'] = api['native_mp4_mux'](original, corrected, final)
        native_final = api['movie_info'](final)
        report['native_final'] = native_final
        final_video = api['one_track'](native_final, 'vide')
        require(final_video['sample_count'] == n and final_video['media_timescale'] == 15360
                and final_video['media_duration_ticks'] == n * 512
                and sum(c for c, d in final_video['stts']) == n and all(d == 512 for c, d in final_video['stts']), 'Final video is not exactly N frames at 30fps')
        require(final_video['presentation_duration_movie_ticks'] == original_video['presentation_duration_movie_ticks']
                and final_video['edit_list'] == original_video['edit_list'], 'Final video presentation/edit duration differs from original')
        require(native_final['movie_timescale'] == original_info['movie_timescale']
                and native_final['movie_duration_ticks'] == original_info['movie_duration_ticks'], 'Movie duration/time base changed')
        require(api['audio_signature'](native_final) == api['audio_signature'](original_info), 'Original AAC native timing changed')
        require(unchanged_video_box_hashes(api, final) == original_video_boxes, 'Final new-video CTTS/configuration changed')
        report['final_frame_pts'] = api['frame_pts_check'](ff, final, n, report['commands'])
        require(report['final_frame_pts']['decoded_framehash_receipt_sha256'] == expected_decoded_hash, 'Final decoded pixels/PTS differ from the failed encode sequence')
        report['original_aac_packet_sha256'] = api['audio_hash'](ff, original, False, report['commands'])
        report['final_aac_packet_sha256'] = api['audio_hash'](ff, final, False, report['commands'])
        report['original_pcm_f32le_sha256'] = api['audio_hash'](ff, original, True, report['commands'])
        report['final_pcm_f32le_sha256'] = api['audio_hash'](ff, final, True, report['commands'])
        require(report['original_aac_packet_sha256'] == report['final_aac_packet_sha256'] == prior['original_aac_packet_sha256'], 'AAC packet payload hash changed')
        require(report['original_pcm_f32le_sha256'] == report['final_pcm_f32le_sha256'] == prior['original_decoded_pcm_f32le_sha256'], 'Decoded audio/priming changed')
        report['corrected_video_file'] = api['state'](corrected)
        report['final_file'] = api['state'](final)
        report['unchanged_encoded_video_boxes_sha256'] = original_video_boxes
        report['decoded_video_identical_to_prior_failed_encode'] = True
        report['status'] = 'mechanical_checks_passed_explicit_visual_review_rebinding_pending'
    except BaseException as error:
        report['status'] = 'failed'
        report['error'] = str(error)
        raise
    finally:
        report['protected_inputs_after'] = {str(p): api['state'](p) for p in protected_paths}
        preserved = report['protected_inputs_after'] == protected_before
        report['all_old_inputs_unchanged'] = preserved
        if not preserved:
            report['status'] = 'failed'
            report['preservation_error'] = 'An old helper/receipt/original/video-only/failed revision changed'
        api['write_json_new'](new_receipt, report)
        print(json.dumps({'receipt': str(new_receipt), 'receipt_sha256': sha(new_receipt), 'status': report['status']}, ensure_ascii=False), flush=True)
        require(preserved, 'Old input preservation failed')


if __name__ == '__main__':
    main()

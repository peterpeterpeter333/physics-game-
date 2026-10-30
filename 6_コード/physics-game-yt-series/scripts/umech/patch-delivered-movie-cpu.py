#!/usr/bin/env python3
"""Replace sparse complete frames, encode video on CPU, and copy original AAC.

Usage: python patch-delivered-movie-cpu.py --original OLD.mp4 --mapping MAP.json
       --output-dir NEW_DIRECTORY --expected-frames 10700
MAP.json is {"123": "/absolute/opaque.png", ...}, or
{"frames": [{"frame": 123, "png": "/absolute/opaque.png"}, ...]}.
All frame numbers are zero based. This program never overwrites an output.
It performs no ASR or listening and changes no original media.
"""
import argparse
import datetime
import hashlib
import json
import pathlib
import re
import struct
import subprocess
import sys
import threading
import time

WIDTH, HEIGHT, FPS, VIDEO_SCALE = 1080, 1920, 30, 15360
DEFAULT_FF = '/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1'


def require(condition, message):
    if not condition:
        raise RuntimeError(message)


def digest(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for block in iter(lambda: f.read(1048576), b''):
            h.update(block)
    return h.hexdigest()


def state(path):
    p = pathlib.Path(path)
    s = p.stat()
    return {'path': str(p), 'bytes': s.st_size, 'mtime_ns': s.st_mtime_ns,
            'sha256': digest(p)}


def no_duplicate_json_keys(pairs):
    result = {}
    for key, value in pairs:
        require(key not in result, 'Duplicate JSON key: ' + key)
        result[key] = value
    return result


def read_mapping(path, total):
    data = json.loads(path.read_text(encoding='utf-8'), object_pairs_hook=no_duplicate_json_keys)
    rows = data.get('frames') if isinstance(data, dict) and 'frames' in data else data
    if isinstance(rows, dict):
        rows = [{'frame': k, 'png': v} for k, v in rows.items()]
    require(isinstance(rows, list) and rows, 'Mapping must contain nonempty frames')
    result = {}
    for row in rows:
        require(isinstance(row, dict) and set(row) == {'frame', 'png'}, 'Each frame row must have exactly frame and png')
        value = row['frame']
        require(not isinstance(value, bool) and isinstance(value, (str, int)), 'Frame must be an integer')
        require(re.fullmatch(r'0|[1-9][0-9]*', str(value)) is not None, 'Frame must use a canonical nonnegative integer')
        n = int(value)
        require(0 <= n < total, 'Frame out of range: %d' % n)
        require(n not in result, 'Duplicate frame: %d' % n)
        require(isinstance(row['png'], str), 'PNG path must be a string')
        p = pathlib.Path(row['png'])
        require(p.is_absolute(), 'PNG paths must be absolute')
        p = p.resolve(strict=True)
        require(p.is_file(), 'PNG is not a file: ' + str(p))
        with p.open('rb') as f:
            header = f.read(33)
        require(len(header) == 33 and header[:8] == b'\x89PNG\r\n\x1a\n' and header[12:16] == b'IHDR', 'Not a PNG with IHDR: ' + str(p))
        w, h, depth, color, compression, filtering, interlace = struct.unpack('>IIBBBBB', header[16:29])
        require((w, h) == (WIDTH, HEIGHT), 'PNG must be 1080x1920: ' + str(p))
        require(depth == 8 and color in (2, 6) and compression == 0 and filtering == 0, 'PNG must be 8-bit RGB or RGBA: ' + str(p))
        result[n] = p
    return dict(sorted(result.items()))


def boxes(f, start, end):
    pos = start
    while pos + 8 <= end:
        f.seek(pos)
        size, kind = struct.unpack('>I4s', f.read(8))
        header = 8
        if size == 1:
            size, header = struct.unpack('>Q', f.read(8))[0], 16
        elif size == 0:
            size = end - pos
        require(size >= header and pos + size <= end, 'Invalid MP4 box')
        yield (kind, pos + header, pos + size, pos)
        pos += size


def child(f, box, kind):
    return next((b for b in boxes(f, box[1], box[2]) if b[0] == kind), None)


def payload(f, box):
    require(box is not None, 'Required MP4 box is missing')
    f.seek(box[1])
    return f.read(box[2] - box[1])


def time_fields(data):
    return (struct.unpack_from('>I', data, 20)[0], struct.unpack_from('>Q', data, 24)[0]) if data[0] == 1 else struct.unpack_from('>II', data, 12)


def movie_info(path):
    with open(path, 'rb') as f:
        root = (b'root', 0, pathlib.Path(path).stat().st_size)
        moov = child(f, root, b'moov')
        movie_scale, movie_duration = time_fields(payload(f, child(f, moov, b'mvhd')))
        info = {'movie_timescale': movie_scale, 'movie_duration_ticks': movie_duration, 'tracks': []}
        for trak in (b for b in boxes(f, moov[1], moov[2]) if b[0] == b'trak'):
            mdia = child(f, trak, b'mdia')
            handler = payload(f, child(f, mdia, b'hdlr'))[8:12].decode('ascii')
            scale, duration = time_fields(payload(f, child(f, mdia, b'mdhd')))
            tkhd = payload(f, child(f, trak, b'tkhd'))
            presentation = struct.unpack_from('>Q' if tkhd[0] == 1 else '>I', tkhd, 28 if tkhd[0] == 1 else 20)[0]
            stbl = child(f, child(f, mdia, b'minf'), b'stbl')
            stts = payload(f, child(f, stbl, b'stts'))
            count = struct.unpack_from('>I', stts, 4)[0]
            timing = [list(struct.unpack_from('>II', stts, 8 + 8 * i)) for i in range(count)]
            stsz = payload(f, child(f, stbl, b'stsz'))
            sample_count = struct.unpack_from('>I', stsz, 8)[0]
            stsd = payload(f, child(f, stbl, b'stsd'))
            track = {'handler': handler, 'media_timescale': scale, 'media_duration_ticks': duration,
                     'presentation_duration_movie_ticks': presentation, 'stts': timing,
                     'sample_count': sample_count, 'codec': stsd[12:16].decode('ascii'),
                     'sample_description_sha256': hashlib.sha256(stsd).hexdigest(), 'edit_list': []}
            if handler == 'vide':
                fixed_width, fixed_height = struct.unpack_from('>II', tkhd, len(tkhd) - 8)
                track['width'] = fixed_width / 65536
                track['height'] = fixed_height / 65536
            edts = child(f, trak, b'edts')
            elst = child(f, edts, b'elst') if edts else None
            if elst:
                data, pos = payload(f, elst), 8
                for _ in range(struct.unpack_from('>I', data, 4)[0]):
                    fmt = '>Qqhh' if data[0] == 1 else '>Iihh'
                    entry = list(struct.unpack_from(fmt, data, pos))
                    pos += struct.calcsize(fmt)
                    track['edit_list'].append(entry)
            info['tracks'].append(track)
        return info


def one_track(info, handler):
    tracks = [t for t in info['tracks'] if t['handler'] == handler]
    require(len(tracks) == 1, 'Expected exactly one ' + handler + ' track')
    return tracks[0]


def audio_signature(info):
    a = one_track(info, 'soun')
    return {'movie_timescale': info['movie_timescale'], **{k: a[k] for k in
            ('media_timescale', 'media_duration_ticks', 'presentation_duration_movie_ticks',
             'stts', 'sample_count', 'codec', 'edit_list')}}


def raw_box(f, box):
    f.seek(box[3])
    return f.read(box[2] - box[3])


def pack_box(kind, data):
    size = len(data) + 8
    return (struct.pack('>I4s', size, kind) if size < 2 ** 32 else
            struct.pack('>I4sQ', 1, kind, len(data) + 16)) + data


def track_handler(f, trak):
    return payload(f, child(f, child(f, trak, b'mdia'), b'hdlr'))[8:12]


def track_identifier(f, trak):
    data = payload(f, child(f, trak, b'tkhd'))
    return struct.unpack_from('>I', data, 20 if data[0] == 1 else 12)[0]


def chunk_layout(f, trak, mdats):
    """Resolve each chunk's exact packet-byte length from stsc plus stsz."""
    stbl = child(f, child(f, child(f, trak, b'mdia'), b'minf'), b'stbl')
    stsz = payload(f, child(f, stbl, b'stsz'))
    fixed_size, sample_count = struct.unpack_from('>II', stsz, 4)
    sizes = [fixed_size] * sample_count if fixed_size else list(struct.unpack_from('>%dI' % sample_count, stsz, 12))
    offset_box = child(f, stbl, b'stco') or child(f, stbl, b'co64')
    data = payload(f, offset_box)
    count = struct.unpack_from('>I', data, 4)[0]
    offsets = struct.unpack_from('>%d%s' % (count, 'I' if offset_box[0] == b'stco' else 'Q'), data, 8)
    stsc = payload(f, child(f, stbl, b'stsc'))
    entries = [struct.unpack_from('>III', stsc, 8 + 12 * i) for i in range(struct.unpack_from('>I', stsc, 4)[0])]
    require(entries and entries[0][0] == 1 and all(e[1] > 0 and e[2] == 1 for e in entries), 'Unsupported chunk/sample-description table')
    require(all(a[0] < b[0] for a, b in zip(entries, entries[1:])), 'Unordered stsc table')
    chunks, sample, entry_index = [], 0, 0
    for index, offset in enumerate(offsets, 1):
        while entry_index + 1 < len(entries) and entries[entry_index + 1][0] <= index:
            entry_index += 1
        samples = entries[entry_index][1]
        require(sample + samples <= len(sizes), 'Chunk consumes nonexistent samples')
        length = sum(sizes[sample:sample + samples])
        require(length > 0 and any(offset >= m[1] and offset + length <= m[2] for m in mdats), 'Chunk is not entirely inside an mdat')
        chunks.append((offset, length))
        sample += samples
    require(sample == sample_count, 'Chunk table does not cover every sample exactly')
    return chunks


def rebase_track(f, trak, offsets, force_co64=False):
    """Copy every track byte except its chunk offsets and container sizes."""
    found = []

    def rebuild(box):
        if box[0] in (b'stco', b'co64'):
            found.append(box)
            old = payload(f, box)
            require(struct.unpack_from('>I', old, 4)[0] == len(offsets), 'Chunk-offset count changed')
            use64 = force_co64 or box[0] == b'co64' or max(offsets, default=0) >= 2 ** 32
            data = old[:4] + struct.pack('>I', len(offsets)) + struct.pack('>%d%s' % (len(offsets), 'Q' if use64 else 'I'), *offsets)
            return pack_box(b'co64' if use64 else b'stco', data)
        if box[0] in (b'trak', b'mdia', b'minf', b'stbl'):
            return pack_box(box[0], b''.join(rebuild(b) for b in boxes(f, box[1], box[2])))
        return raw_box(f, box)

    result = rebuild(trak)
    require(len(found) == 1, 'Expected one chunk-offset table per track')
    return result


def native_mp4_mux(original, video_only, destination):
    """Native MP4 mux: copy original AAC timing/packets without FFmpeg trimming.

    Original mvhd/global boxes and AAC trak are copied. The new video trak is
    copied from video-only. Only stco/co64 offsets are rebased. A moov-first
    layout is computed before writing, and only selected track chunks enter
    the new mdat; the original video's old packets are not copied.
    """
    with open(original, 'rb') as source, open(video_only, 'rb') as video:
        old_top = list(boxes(source, 0, pathlib.Path(original).stat().st_size))
        video_top = list(boxes(video, 0, pathlib.Path(video_only).stat().st_size))
        old_moov = next(b for b in old_top if b[0] == b'moov')
        video_moov = next(b for b in video_top if b[0] == b'moov')
        old_children = list(boxes(source, old_moov[1], old_moov[2]))
        old_tracks = [b for b in old_children if b[0] == b'trak']
        video_tracks = [b for b in boxes(video, video_moov[1], video_moov[2]) if b[0] == b'trak']
        require(len(old_tracks) == 2 and len(video_tracks) == 1, 'Native mux requires exactly original video+AAC and one new video track')
        audio_trak = next(b for b in old_tracks if track_handler(source, b) == b'soun')
        old_video_trak = next(b for b in old_tracks if track_handler(source, b) == b'vide')
        video_trak = video_tracks[0]
        require(track_handler(video, video_trak) == b'vide', 'Video-only file has a nonvideo track')
        require(track_identifier(video, video_trak) == track_identifier(source, old_video_trak)
                and track_identifier(source, audio_trak) != track_identifier(video, video_trak), 'Track identifiers are incompatible')
        audio_chunks = chunk_layout(source, audio_trak, [b for b in old_top if b[0] == b'mdat'])
        video_chunks = chunk_layout(video, video_trak, [b for b in video_top if b[0] == b'mdat'])
        ftyp = raw_box(source, next(b for b in old_top if b[0] == b'ftyp'))
        data_bytes = sum(length for offset, length in video_chunks + audio_chunks)
        mdat_header = (struct.pack('>I4s', data_bytes + 8, b'mdat') if data_bytes + 8 < 2 ** 32 else
                       struct.pack('>I4sQ', 1, b'mdat', data_bytes + 16))

        def make_moov(video_offsets, audio_offsets):
            children_data = []
            for box in old_children:
                if box[0] != b'trak':
                    children_data.append(raw_box(source, box))
                elif track_handler(source, box) == b'soun':
                    children_data.append(rebase_track(source, audio_trak, audio_offsets))
                else:
                    children_data.append(rebase_track(video, video_trak, video_offsets))
            return pack_box(b'moov', b''.join(children_data))

        moov = make_moov([0] * len(video_chunks), [0] * len(audio_chunks))
        for _ in range(4):
            cursor = len(ftyp) + len(moov) + len(mdat_header)
            video_offsets, audio_offsets = [], []
            for offset, length in video_chunks:
                video_offsets.append(cursor)
                cursor += length
            for offset, length in audio_chunks:
                audio_offsets.append(cursor)
                cursor += length
            real_moov = make_moov(video_offsets, audio_offsets)
            if len(real_moov) == len(moov):
                moov = real_moov
                break
            moov = real_moov
        else:
            raise RuntimeError('Native mux chunk-offset sizes did not converge')
        with pathlib.Path(destination).open('xb') as out:
            out.write(ftyp)
            out.write(moov)
            out.write(mdat_header)
            for src, chunks, offsets in ((video, video_chunks, video_offsets), (source, audio_chunks, audio_offsets)):
                for (offset, length), expected_offset in zip(chunks, offsets):
                    require(out.tell() == expected_offset, 'Native mux data offset mismatch')
                    src.seek(offset)
                    left = length
                    while left:
                        block = src.read(min(left, 1048576))
                        require(block, 'Unexpected EOF while copying native chunk')
                        out.write(block)
                        left -= len(block)
            require(out.tell() == cursor, 'Native mux output size differs from plan')
        normalized_before = hashlib.sha256(rebase_track(source, audio_trak, [0] * len(audio_chunks), True)).hexdigest()
    with open(destination, 'rb') as final:
        final_top = list(boxes(final, 0, pathlib.Path(destination).stat().st_size))
        final_moov = next(b for b in final_top if b[0] == b'moov')
        final_audio = next(b for b in boxes(final, final_moov[1], final_moov[2]) if b[0] == b'trak' and track_handler(final, b) == b'soun')
        normalized_after = hashlib.sha256(rebase_track(final, final_audio, [0] * len(audio_chunks), True)).hexdigest()
    require(normalized_before == normalized_after, 'Original AAC track metadata changed beyond chunk offsets')
    return {'method': 'native MP4 chunk copy, original mvhd/global metadata and complete original AAC trak; only chunk offsets rebased',
            'top_level_order': ['ftyp', 'moov', 'mdat'], 'audio_chunks': len(audio_chunks),
            'video_chunks': len(video_chunks), 'audio_packet_bytes': sum(n for o, n in audio_chunks),
            'video_packet_bytes': sum(n for o, n in video_chunks),
            'original_audio_track_normalized_offsets_sha256': normalized_before,
            'final_audio_track_normalized_offsets_sha256': normalized_after}


def run(command, log):
    started = time.monotonic()
    p = subprocess.run(command, stdin=subprocess.DEVNULL, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    record = {'command': command, 'exit_code': p.returncode,
              'elapsed_seconds': round(time.monotonic() - started, 3),
              'stderr': p.stderr.decode('utf-8', 'replace')}
    log.append(record)
    require(p.returncode == 0, 'FFmpeg failed: ' + record['stderr'][-5000:])
    return p.stdout


def audio_hash(ff, path, pcm, log):
    command = [ff, '-nostdin', '-hide_banner', '-v', 'error', '-xerror', '-threads', '1',
               '-i', str(path), '-map', '0:a:0', '-vn', '-sn', '-dn', '-c:a',
               'pcm_f32le' if pcm else 'copy', '-f', 'hash', '-hash', 'sha256', 'pipe:1']
    output = run(command, log).decode('ascii').strip()
    require(re.fullmatch(r'SHA256=[0-9a-f]{64}', output) is not None, 'Unexpected audio hash output')
    return output.split('=', 1)[1]


def read_exact(stream, size):
    chunks, total = [], 0
    while total < size:
        block = stream.read(size - total)
        if not block:
            break
        chunks.append(block)
        total += len(block)
    return b''.join(chunks)


def validate_opaque_sequence(ff, pattern, expected, log):
    command = [ff, '-nostdin', '-hide_banner', '-v', 'error', '-xerror', '-threads', '1',
               '-framerate', '30', '-start_number', '0', '-i', str(pattern),
               '-map', '0:v:0', '-an', '-sn', '-dn', '-vf', 'format=rgba',
               '-c:v', 'rawvideo', '-pix_fmt', 'rgba', '-fps_mode:v', 'passthrough',
               '-f', 'rawvideo', 'pipe:1']
    proc = subprocess.Popen(command, stdin=subprocess.DEVNULL, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    errors = bytearray()

    def drain():
        for chunk in iter(lambda: proc.stderr.read(65536), b''):
            errors.extend(chunk)

    thread = threading.Thread(target=drain)
    thread.start()
    count, failure = 0, None
    opaque_alpha = b'\xff' * (WIDTH * HEIGHT)
    try:
        while True:
            frame = read_exact(proc.stdout, WIDTH * HEIGHT * 4)
            if not frame:
                break
            require(len(frame) == WIDTH * HEIGHT * 4, 'Incomplete decoded PNG frame')
            require(frame[3::4] == opaque_alpha, 'Transparent pixel in compact PNG frame %d' % count)
            count += 1
    except BaseException as error:
        failure = error
        proc.kill()
    code = proc.wait()
    thread.join()
    log.append({'command': command, 'exit_code': code, 'decoded_opaque_frames': count,
                'stderr': errors.decode('utf-8', 'replace')})
    if failure:
        raise failure
    require(code == 0 and count == expected, 'PNG decode count/final status does not match mapping')


def frame_pts_check(ff, path, total, log):
    command = [ff, '-nostdin', '-hide_banner', '-v', 'error', '-xerror', '-copyts',
               '-threads', '1', '-i', str(path), '-map', '0:v:0', '-an', '-sn', '-dn',
               '-c:v', 'rawvideo', '-pix_fmt', 'yuv420p', '-enc_time_base:v', '1:15360',
               '-fps_mode:v', 'passthrough', '-f', 'framehash', '-hash', 'sha256', 'pipe:1']
    data = run(command, log).decode('ascii')
    require(re.search(r'^#tb 0:\s*1/15360\s*$', data, re.M) is not None, 'Unexpected decoded video time base')
    require(re.search(r'^#dimensions 0:\s*1080x1920\s*$', data, re.M) is not None, 'Decoded video must be 1080x1920')
    rows = [line.split(',') for line in data.splitlines() if line and not line.startswith('#')]
    require(len(rows) == total, 'Decoded frame count differs from expected')
    for n, row in enumerate(rows):
        require(len(row) >= 6 and int(row[0]) == 0 and int(row[2]) == n * 512 and int(row[3]) == 512,
                'Non-30fps/shifted decoded frame PTS or duration at frame %d' % n)
    return {'decoded_frames': len(rows), 'time_base': '1/15360', 'first_pts': 0,
            'last_pts': (total - 1) * 512, 'every_duration_ticks': 512,
            'decoded_framehash_receipt_sha256': hashlib.sha256(data.encode('ascii')).hexdigest()}


def make_blocks(frame_numbers):
    blocks = []
    for n in frame_numbers:
        if blocks and n == blocks[-1]['end'] + 1:
            blocks[-1]['end'] = n
            blocks[-1]['length'] += 1
        else:
            blocks.append({'start': n, 'end': n, 'length': 1})
    return blocks


def write_json_new(path, data):
    with path.open('x', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2, allow_nan=False)
        f.write('\n')


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--original', required=True, type=pathlib.Path)
    ap.add_argument('--mapping', required=True, type=pathlib.Path)
    ap.add_argument('--output-dir', required=True, type=pathlib.Path)
    ap.add_argument('--expected-frames', required=True, type=int, choices=(10700, 12162))
    ap.add_argument('--ffmpeg', default=DEFAULT_FF)
    ap.add_argument('--crf', type=int, default=14, choices=range(0, 24))
    ap.add_argument('--preset', default='fast', choices=('ultrafast', 'superfast', 'veryfast', 'faster', 'fast', 'medium', 'slow'))
    ap.add_argument('--threads', type=int, default=4)
    args = ap.parse_args()
    require(args.threads >= 1, '--threads must be positive')
    original, mapping = args.original.resolve(strict=True), args.mapping.resolve(strict=True)
    outdir = args.output_dir.absolute()
    require(outdir.parent.is_dir() and not outdir.exists(), '--output-dir must be a new directory with an existing parent')
    original_before, mapping_before = state(original), state(mapping)
    native_before = movie_info(original)
    video = one_track(native_before, 'vide')
    require(video['codec'] == 'avc1' and video['media_timescale'] == VIDEO_SCALE, 'Original must use the expected AVC/15360 time base')
    require((video['width'], video['height']) == (WIDTH, HEIGHT), 'Original must be 1080x1920')
    require(video['sample_count'] == args.expected_frames and sum(n for n, d in video['stts']) == args.expected_frames,
            'Original frame count differs from --expected-frames')
    require(all(d == 512 for n, d in video['stts']), 'Original must be precise 30fps')
    require(one_track(native_before, 'soun')['codec'] == 'mp4a', 'Original must contain AAC')
    frames = read_mapping(mapping, args.expected_frames)
    png_before = {str(p): state(p) for p in set(frames.values())}
    blocks = make_blocks(list(frames))
    outdir.mkdir(exist_ok=False)
    report = {'status': 'running', 'created_at_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
              'ear_listening_performed': False, 'asr_performed': False, 'git_used': False,
              'original': original_before, 'mapping': mapping_before, 'patch_pngs': png_before,
              'native_original': native_before, 'blocks': blocks, 'changed_frames': list(frames),
              'commands': [], 'helper_sha256': digest(__file__), 'ffmpeg': state(args.ffmpeg),
              'quality_note': 'CRF>0 reencodes unchanged video frames lossily. Original audio is copied, never filtered or encoded.'}
    receipt = outdir / 'patch-movie-receipt.json'
    try:
        compact = outdir / 'compact-png'
        compact.mkdir()
        for index, (frame_number, png) in enumerate(frames.items()):
            (compact / ('%06d.png' % index)).symlink_to(png)
        pattern = compact / '%06d.png'
        validate_opaque_sequence(args.ffmpeg, pattern, len(frames), report['commands'])
        report['original_frame_pts'] = frame_pts_check(args.ffmpeg, original, args.expected_frames, report['commands'])
        report['original_aac_packet_sha256'] = audio_hash(args.ffmpeg, original, False, report['commands'])
        report['original_decoded_pcm_f32le_sha256'] = audio_hash(args.ffmpeg, original, True, report['commands'])
        # Compact patch frame k maps to an absolute original frame. Integer gaps
        # yield sparse PTS with exactly one overlay input and one overlay filter.
        pts = 'N+%d' % blocks[0]['start']
        cumulative = blocks[0]['length']
        for previous, current in zip(blocks, blocks[1:]):
            gap = current['start'] - previous['end'] - 1
            pts += '+gte(N,%d)*%d' % (cumulative, gap)
            cumulative += current['length']
        enabled = '+'.join('between(n,%d,%d)' % (b['start'], b['end']) for b in blocks)
        graph = ('[0:v:0]trim=end_frame=%d,settb=expr=1/30,setpts=N,format=yuv420p[base];'
                 '[1:v:0]settb=expr=1/30,setpts=\'%s\',format=yuv420p[patch];'
                 '[base][patch]overlay=x=0:y=0:eof_action=pass:repeatlast=0:shortest=0:'
                 'format=yuv420:enable=\'%s\'[video]') % (args.expected_frames, pts, enabled)
        report['filtergraph'] = graph
        video_only, final = outdir / 'video-only.mp4', outdir / 'revision.mp4'
        encode = [args.ffmpeg, '-n', '-nostdin', '-hide_banner', '-xerror', '-hwaccel', 'none',
                  '-i', str(original), '-framerate', '30', '-start_number', '0', '-i', str(pattern),
                  '-filter_complex', graph, '-map', '[video]', '-an', '-sn', '-dn', '-c:v', 'libx264',
                  '-preset', args.preset, '-crf', str(args.crf), '-threads:v', str(args.threads),
                  '-pix_fmt', 'yuv420p', '-fps_mode:v', 'passthrough', '-enc_time_base:v', '1:30',
                  '-video_track_timescale', '15360', '-movie_timescale', '1000', '-use_editlist', '1',
                  '-avoid_negative_ts', 'disabled', '-movflags', '+faststart', str(video_only)]
        run(encode, report['commands'])
        report['video_only_frame_pts'] = frame_pts_check(args.ffmpeg, video_only, args.expected_frames, report['commands'])
        report['native_mux'] = native_mp4_mux(original, video_only, final)
        report['final_frame_pts'] = frame_pts_check(args.ffmpeg, final, args.expected_frames, report['commands'])
        native_final = movie_info(final)
        report['native_final'] = native_final
        new_video = one_track(native_final, 'vide')
        require(new_video['media_timescale'] == VIDEO_SCALE and new_video['sample_count'] == args.expected_frames
                and new_video['media_duration_ticks'] == args.expected_frames * 512
                and all(d == 512 for n, d in new_video['stts'])
                and sum(n for n, d in new_video['stts']) == args.expected_frames, 'Final video native frame timing differs')
        require(native_final['movie_timescale'] == native_before['movie_timescale'], 'Movie time base changed')
        require(native_final['movie_duration_ticks'] == native_before['movie_duration_ticks'], 'Movie duration changed')
        require(new_video['presentation_duration_movie_ticks'] == video['presentation_duration_movie_ticks'], 'Video presentation duration changed')
        require(audio_signature(native_final) == audio_signature(native_before), 'AAC presentation/media/edit-list/sample timing changed')
        report['final_aac_packet_sha256'] = audio_hash(args.ffmpeg, final, False, report['commands'])
        report['final_decoded_pcm_f32le_sha256'] = audio_hash(args.ffmpeg, final, True, report['commands'])
        require(report['final_aac_packet_sha256'] == report['original_aac_packet_sha256'], 'AAC packet payloads changed')
        require(report['final_decoded_pcm_f32le_sha256'] == report['original_decoded_pcm_f32le_sha256'], 'Decoded audio/priming changed')
        report['final_file'] = state(final)
        report['video_only_file'] = state(video_only)
        report['status'] = 'mechanical_checks_passed_visual_review_pending'
    except BaseException as error:
        report['status'] = 'failed'
        report['error'] = str(error)
        raise
    finally:
        report['original_after'] = state(original)
        report['mapping_after'] = state(mapping)
        report['patch_pngs_after'] = {p: state(p) for p in png_before}
        preserved = (report['original_after'] == original_before and report['mapping_after'] == mapping_before
                     and report['patch_pngs_after'] == png_before)
        report['protected_inputs_unchanged'] = preserved
        if not preserved:
            report['status'] = 'failed'
            report['preservation_error'] = 'Original MP4, mapping, or patch PNG changed during execution'
        write_json_new(receipt, report)
        print(json.dumps({'receipt': str(receipt), 'receipt_sha256': digest(receipt), 'status': report['status']}, ensure_ascii=False), flush=True)
        require(preserved, 'Protected input file changed during execution')
    require(report['status'] == 'mechanical_checks_passed_visual_review_pending', 'Movie did not pass mechanical verification')


if __name__ == '__main__':
    main()

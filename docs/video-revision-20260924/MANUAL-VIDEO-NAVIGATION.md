# Manual video navigation

The thorough-mode player previously replaced the main MP4 with an insert at a
scene boundary, then resumed the main file automatically. These source changes
were invisible in the page dots and appeared to be playback jumps.

Each main segment and supplement is now a separate, explicitly selected page.
Only the dots, previous and next buttons navigate. Completion pauses the current
page. Quick mode still plays each uninterrupted main film.

The main files are not duplicated or re-encoded: split pages reference a bounded
interval of the original file. Their seek bars show that interval only. Narration,
subtitles and animation stay synchronized, including at the saved playback speed.
Old main-video saved IDs remain valid. Mode changes initiated by the user reset
the selected page playback; they never continue autoplay.

Validation: production build, speed controls, manual-page coverage for 332 movies
(366 thorough-mode pages), supplement ordering, stable IDs, prerequisite routing,
and paper-battle regressions. No App Store binary changed.

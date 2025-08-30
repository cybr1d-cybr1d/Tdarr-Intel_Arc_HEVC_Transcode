# Tdarr-Intel_Arc_HEVC_Transcode
Tdarr plugin for converting x264 to HEVC using Intel Arc GPU with QSV and adjustable quality

Parameters:

1. Global Quality (lower is higher quality)
2. Ffmpeg preset (slower is higher quality)
3. B Frames
4. 10-bit

The command used in this plugin for ffmpeg gives me the quality I prefer, but sometims it doesn't work well for Anime that is already 10-bit. I use the Alt plugin which is a slightly different command to fail the main one into for a retry.

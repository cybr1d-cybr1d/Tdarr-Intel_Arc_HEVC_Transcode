const details = () => ({
    id: 'Tdarr_Plugin_vdka_Intel_Arc_HEVC_Transcode',
    Stage: 'Pre-processing',
    Name: 'Intel Arc QSV HEVC Transcode',
    Type: 'Video',
    Operation: 'Transcode',
    Description: `This plugin transcodes videos to HEVC using Intel Arc GPU with QSV. Quality, B-frames, and 10-bit output are configurable.\n\n`,
    Version: '1.00',
    Tags: 'pre-processing,ffmpeg,video only,h265,intel qsv,configurable',

    Inputs: [
        {
            name: 'globalQuality',
            type: 'number',
            defaultValue: 19,
            inputUI: {
                type: 'text',
            },
            tooltip: `Enter the global quality level you want (0-51, lower = higher quality, bigger file). Defaults to 19.\n\nExample:\n\n19`,
        },
        {
            name: 'ffmpegPreset',
            type: 'string',
            defaultValue: 'medium',
            inputUI: {
                type: 'dropdown',
                options: [
                    'slower',
                    'slow',
                    'medium',
                    'fast',
                    'faster'
                ]
            },
            tooltip: 'Specify the preset speed'
        },
        {
            name: 'bframe',
            type: 'number',
            defaultValue: 3,
            inputUI: {
                type: 'text',
            },
            tooltip: `Specify the number of B-frames to use (0-16, defaults to 3).\n\nExample:\n\n3`,
        },
        {
            name: 'force10bit',
            type: 'boolean',
            defaultValue: false,
            inputUI: {
                type: 'dropdown',
                options: [
                    'false',
                    'true',
                ],
            },
            tooltip: `Specify if the output file should be forced to 10bit. Default is false (bit depth is the same as the source).\n\nExample:\n\ntrue\n\nExample:\n\nfalse`,
        },
        // You can add more inputs here as needed for other configurations
    ],
});

const plugin = (file, librarySettings, inputs, otherArguments) => {
    const lib = require('../methods/lib')();
    inputs = lib.loadDefaultValues(inputs, details);
    //let ffmpegCommand = 'ffmpeg -hwaccel qsv -i <input> -map 0 -c:v hevc_qsv -preset medium';
    let crf;
    //default values that will be returned
    const response = {
        processFile: false,
        preset: '',
        container: '.mkv',
        handBrakeMode: false,
        FFmpegMode: true,
        reQueueAfter: true,
        infoLog: '',
    };

    // check if the file is a video, if not the plugin will exit
    //if (file.fileMedium !== 'video') {
    //    response.infoLog += 'File is not a video! \n';
	//	response.infolog += `File is: ${file.fileMedium}\n`;
    //    return response;
    //}
    //response.infoLog += 'File is a video! \n';

    response.infoLog += `☑Preset set as ${inputs.ffmpegPreset}\n`;

    crf = inputs.globalQuality;
    const pixel10Bit = inputs.force10bit ? '-vf scale_qsv=format=p010le ' : '';
    const profile = inputs.force10bit ? 'main10' : 'main';

    // encoding settings
    response.preset += `-hwaccel qsv <io> -map 0 -c:v hevc_qsv -preset ${inputs.ffmpegPreset}`
        + ` -global_quality ${crf} -extbrc 1 -look_ahead 1 -look_ahead_depth 32 -refs 6`
    	+ ` -bf ${inputs.bframe} -b_strategy 1 -profile:v ${profile} ${pixel10Bit}-rdo 1`
        + ` -a53cc 0 -c:a copy -c:s copy -max_muxing_queue_size 9999`;

    response.infoLog += `☑File is using CRF value of ${crf}!\n`;
    response.infoLog += 'File is being transcoded!\n';
    response.processFile = true;

    return response;
};

module.exports.details = details;
module.exports.plugin = plugin;

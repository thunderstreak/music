export function audioBufferTransform(audioCtx) {
    let fr = new FileReader();
    fr.onload = function(e) {
        let fileResult = e.target.result;
        audioCtx.decodeAudioData(fileResult, function(buffer) {
            playMusic(buffer)
        }, function(e) {
            console.log(e)
            alert("文件解码失败")
        })
    }
    fr.readAsArrayBuffer(file);
}

/**
 * [AudioVisualFFT description]
 * @param       {[type]} AudioPlayer  [description]
 * @param       {[type]} canvasPlayer [description]
 * @constructor
 */
export function AudioVisualFFT(AudioPlayer){
    let visual = {};

    // 创建音频源连接的播放节点分析器
    visual.audioCtx    = new (window.AudioContext || window.webkitAudioContext)();

    // 创建频谱分析器
    visual.analyser    = visual.audioCtx.createAnalyser();
    visual.mediaSource = visual.audioCtx.createMediaElementSource(AudioPlayer);

    //连接：source → analyser → destination
    visual.mediaSource.connect(visual.analyser);
    visual.analyser.connect(visual.audioCtx.destination);


    // fftSize (Fast Fourier Transform) 是快速傅里叶变换，一般情况下是固定值2048，这个值可以决定音频频谱的密集程度。值大了，频谱就松散，值小就密集。
    visual.analyser.fftSize = 2048;
    visual.bufferLength     = visual.analyser.fftSize;
    visual.dataArray        = new Uint8Array(visual.bufferLength);//dataArray数组将用来放音频高低音不同区域的数据信息，当音频播放时，每一个时间节点，都有不同的音频数据，使用analyser.getByteFrequencyData(dataArray)将数据放入数组，用来进行频谱的可视化绘制。

    return visual;
}

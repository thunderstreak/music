export function audioBufferTransform(audioCtx) {
    let fr = new FileReader();
    fr.onload = function(e) {
        var fileResult = e.target.result;
        audioCtx.decodeAudioData(fileResult, function(buffer) {
            playMusic(buffer)
        }, function(e) {
            console.log(e)
            alert("文件解码失败")
        })
    }
    fr.readAsArrayBuffer(file);
}

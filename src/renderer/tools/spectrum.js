/**
 * [voiceLineSpectrum 线性频谱]
 * @param  {[type]} canvasCtx    [canvas 上下文]
 * @param  {[type]} canvasPlayer [canvas 元素对象]
 * @param  {[type]} dataArray    [fftSize 数据点数量]
 * @param  {[type]} bufferLength [傅里叶变换的长度值]
 * @return {[type]}              [description]
 */
export function voiceLineSpectrum(canvasCtx,canvasPlayer,dataArray,bufferLength){
    let { width, height } = canvasPlayer;
    canvasCtx.clearRect(0, 0, width, height);

    canvasCtx.fillStyle = 'rgb(255, 255, 255)';
    canvasCtx.fillRect(0, 0, width, height);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
    canvasCtx.beginPath();

    let sliceWidth = width / bufferLength * 2.5;
    let x = 0;

    for(let i = 0; i < bufferLength; i++) {

        let v = dataArray[i] / 128.0;
        let y = v * height/2;

        if(i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }
        x += sliceWidth;
    }
    canvasCtx.lineTo(width, height / 2);
    canvasCtx.stroke();
}

/**
 * [voiceLineSpectrum 柱状频谱]
 * @param  {[type]} canvasCtx    [canvas 上下文]
 * @param  {[type]} canvasPlayer [canvas 元素对象]
 * @param  {[type]} dataArray    [fftSize 数据点数量]
 * @param  {[type]} bufferLength [傅里叶变换的长度值]
 * @return {[type]}              [description]
 */
export function voiceBarSpectrum(canvasCtx,canvasPlayer,dataArray,bufferLength){
    let { width, height } = canvasPlayer;
    canvasCtx.clearRect(0, 0, width, height);

    let barWidth = width / bufferLength * 2.5;
    let x = 0;

    for(let i = 0; i < bufferLength; i++) {
        let barHeight = dataArray[i]/2;
        canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
        canvasCtx.fillRect(x, width-barHeight / 2, barWidth, barHeight);
        x += barWidth + 1;
    }

}

/**
 * [voiceCircleSpectrum 环形频谱]
 * @param  {[type]} canvasCtx    [canvas 上下文]
 * @param  {[type]} canvasPlayer [canvas 元素对象]
 * @param  {[type]} dataArray    [fftSize 数据点数量]
 * @return {[type]}              [description]
 */
export function voiceCircleSpectrum(canvasCtx,canvasPlayer,dataArray){
    let { width, height } = canvasPlayer;
    canvasCtx.clearRect(0, 0, width, height);
    canvasCtx.globalAlpha = 0.5;

    let [x,y,r] = [width / 2, height / 2, 70];//绘制的中心点

    //画线条
    for (let i = 0; i < dataArray.length; i++) {
        let value = dataArray[i] / 10;//<===获取数据

        //绘制左半边
        canvasCtx.beginPath();
        canvasCtx.lineWidth = 1;
        canvasCtx.moveTo(x, y);
        //R * cos (PI/180*一次旋转的角度数) ,-R * sin (PI/180*一次旋转的角度数)
        canvasCtx.lineTo(
            Math.cos((i *0.5 + 90) / 180 * Math.PI) * (r + value) + x,
            (- Math.sin((i *0.5 + 90) / 180 * Math.PI) * (r + value) + y)
        );

        canvasCtx.stroke();
        canvasCtx.beginPath();

        //绘制右半边
        canvasCtx.beginPath();
        canvasCtx.lineWidth = 1;
        canvasCtx.moveTo(x, y);
        canvasCtx.lineTo(
            (Math.sin((i *0.5) / 180 * Math.PI) * (r + value) + x),
            -Math.cos((i *0.5) / 180 * Math.PI) * (r + value) + y
        );

        canvasCtx.stroke();
        canvasCtx.beginPath();

        //将缓冲区的数据绘制到Canvas上
        // canvasCtx.beginPath();
        // for (var i = 0; i < width; i++) {
        //     canvasCtx.lineTo(i + (x / 2), 300 - (height / 2 * (dataArray[dataArray.length * i / width | 0] / 256 - 0.5)));
        // }
        // canvasCtx.stroke();

    }

    //画一个小圆，将线条覆盖
    canvasCtx.beginPath();
    canvasCtx.lineWidth = 1;
    canvasCtx.arc(x, y, r, 0, 2 * Math.PI, false);
    // canvasCtx.fillStyle = "#fff";
    // canvasCtx.fill();
    canvasCtx.stroke();
    canvasCtx.closePath();

}

/**
 * [voiceCircleSpectrum 环形频谱]
 * @param  {[type]} canvasCtx    [canvas 上下文]
 * @param  {[type]} canvasPlayer [canvas 元素对象]
 * @param  {[type]} dataArray    [fftSize 数据点数量]
 * @return {[type]}              [description]
 */
export function inTheCricleSpectrum(canvasCtx,canvasPlayer,dataArray){
    let { width, height } = canvasPlayer;
    canvasCtx.clearRect(0, 0, width, height);
    canvasCtx.globalAlpha = 0.5;
    let theColor = [
        '#693e44','#3c5d90','#000d38',
        '#345e44','#001029','#000d38',
        '#823e54','#290020','#000d38',
        '#393e44','#020000','#46102b',
        '#7ba1ce','#88522f','#523951',
        '#3c7ece','#552f88','#523939',
        '#8e9296','#31283c','#2e2246',
        '#8e9296','#31283c','#2e2246',
        '#1da047','#000000','#25290f',
        '#1da047','#000000','#25290f',
        '#d2272e','#4c4429','#290f26',
    ];
    let [x,y,r,deg] = [width / 2, height / 2, 180, 2];//绘制的中心点
    // debugger
    //画线条
    for (let i = 0; i < dataArray.length; i++) {
        let value = dataArray[i] / 10;//<===获取数据

        //绘制左半边
        canvasCtx.beginPath();
        canvasCtx.lineWidth = 3;
        // let random = Math.ceil(Math.random() * theColor.length);
        // canvasCtx.strokeStyle = '#d36e2d';
        let Rv1 = (r - value);
        let Rv2 = (r + value);
        canvasCtx.moveTo(( Math.sin((i * deg) / 180 * Math.PI) * Rv1 + x),-Math.cos((i * deg) / 180 * Math.PI) * Rv1 + y);//从圆边开始
        canvasCtx.lineTo(( Math.sin((i * deg) / 180 * Math.PI) * Rv2 + x),-Math.cos((i * deg) / 180 * Math.PI) * Rv2 + y);
        canvasCtx.stroke();


    }

}

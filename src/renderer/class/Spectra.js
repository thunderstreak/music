class BaseSpectrum{
    constructor(){
        this.globalAlpha = 0.5;
    }
}
export default class Spectrum extends BaseSpectrum{
    /**
     * [constructor description]
     * @param  {[type]} canvasCtx    [canvas 上下文]
     * @param  {[type]} canvasPlayer [canvas 元素对象]
     * @param  {[type]} dataArray    [fftSize 数据点数量]
     * @param  {[type]} bufferLength [傅里叶变换的长度值]
     */
    constructor(canvasCtx,canvasPlayer,dataArray,bufferLength){
        super();
        this.canvasCtx      = canvasCtx;
        this.canvasPlayer   = canvasPlayer;
        this.dataArray      = dataArray;
        this.bufferLength   = bufferLength;
    }

    // 环形频谱
    inTheCircleSpectrum(){
        let { width, height } = this.canvasPlayer;
        this.canvasCtx.clearRect(0, 0, width, height);
        this.canvasCtx.globalAlpha = this.globalAlpha;

        let [x,y,r,deg] = [width / 2, height / 2, 180, 2];//绘制的中心点

        //画线条
        for (let i = 0; i < this.dataArray.length; i++) {
            let value = this.dataArray[i] / 10;//<===获取数据

            //绘制左半边
            this.canvasCtx.beginPath();
            this.canvasCtx.lineWidth = 3;
            let Rv1 = (r - value);
            let Rv2 = (r + value);
            this.canvasCtx.moveTo(( Math.sin((i * deg) / 180 * Math.PI) * Rv1 + x),-Math.cos((i * deg) / 180 * Math.PI) * Rv1 + y);//从圆边开始
            this.canvasCtx.lineTo(( Math.sin((i * deg) / 180 * Math.PI) * Rv2 + x),-Math.cos((i * deg) / 180 * Math.PI) * Rv2 + y);
            this.canvasCtx.stroke();

        }
    }

    // 线性频谱
    voiceLineSpectrum(){
        let { width, height } = this.canvasPlayer;
        this.canvasCtx.clearRect(0, 0, width, height);

        this.canvasCtx.fillStyle = 'rgb(255, 255, 255)';
        this.canvasCtx.fillRect(0, 0, width, height);

        this.canvasCtx.lineWidth = 2;
        this.canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
        this.canvasCtx.beginPath();

        let sliceWidth = width / this.bufferLength * 2.5;
        let x = 0;

        for(let i = 0; i < this.bufferLength; i++) {

            let v = this.dataArray[i] / 128.0;
            let y = v * height/2;

            if(i === 0) {
                this.canvasCtx.moveTo(x, y);
            } else {
                this.canvasCtx.lineTo(x, y);
            }
            x += sliceWidth;
        }
        this.canvasCtx.lineTo(width, height / 2);
        this.canvasCtx.stroke();
    }

    // 柱状频谱
    voiceBarSpectrum(){
        let { width, height } = this.canvasPlayer;
        this.canvasCtx.clearRect(0, 0, width, height);

        let barWidth = width / this.bufferLength * 2.5;
        let x = 0;

        for(let i = 0; i < this.bufferLength; i++) {
            let barHeight = this.dataArray[i]/2;
            this.canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
            this.canvasCtx.fillRect(x, width - barHeight / 2, barWidth, barHeight);
            x += barWidth + 1;
        }
    }

    // 环形频谱
    voiceCircleSpectrum(){
        let { width, height } = this.canvasPlayer;
        this.canvasCtx.clearRect(0, 0, width, height);
        this.canvasCtx.globalAlpha = 0.5;

        let [x,y,r] = [width / 2, height / 2, 70];//绘制的中心点

        //画线条
        for (let i = 0; i < this.dataArray.length; i++) {
            let value = this.dataArray[i] / 10;//<===获取数据

            //绘制左半边
            this.canvasCtx.beginPath();
            this.canvasCtx.lineWidth = 1;
            this.canvasCtx.moveTo(x, y);
            //R * cos (PI/180*一次旋转的角度数) ,-R * sin (PI/180*一次旋转的角度数)
            this.canvasCtx.lineTo(
                Math.cos((i *0.5 + 90) / 180 * Math.PI) * (r + value) + x,
                (- Math.sin((i *0.5 + 90) / 180 * Math.PI) * (r + value) + y)
            );

            this.canvasCtx.stroke();
            this.canvasCtx.beginPath();

            //绘制右半边
            this.canvasCtx.beginPath();
            this.canvasCtx.lineWidth = 1;
            this.canvasCtx.moveTo(x, y);
            this.canvasCtx.lineTo(
                (Math.sin((i *0.5) / 180 * Math.PI) * (r + value) + x),
                -Math.cos((i *0.5) / 180 * Math.PI) * (r + value) + y
            );

            this.canvasCtx.stroke();
            this.canvasCtx.beginPath();

            //将缓冲区的数据绘制到Canvas上
            // this.canvasCtx.beginPath();
            // for (var i = 0; i < width; i++) {
            //     this.canvasCtx.lineTo(i + (x / 2), 300 - (height / 2 * (dataArray[dataArray.length * i / width | 0] / 256 - 0.5)));
            // }
            // this.canvasCtx.stroke();

        }

        //画一个小圆，将线条覆盖
        this.canvasCtx.beginPath();
        this.canvasCtx.lineWidth = 1;
        this.canvasCtx.arc(x, y, r, 0, 2 * Math.PI, false);
        // this.canvasCtx.fillStyle = "#fff";
        // this.canvasCtx.fill();
        this.canvasCtx.stroke();
        this.canvasCtx.closePath();
    }
}

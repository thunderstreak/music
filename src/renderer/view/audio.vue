<template lang="html">
    <div class="hero-box" ref="heroBoxEle">
        <AudioHeader @AduioHeaderSelectPlaySong="selectPlaySong"></AudioHeader>
        <!-- 中心旋转图片 -->
        <div class="hero-logo" aria-hidden="true">
            <div class="hero-logo-circles">
                <img draggable="false" class="hero-logo-circle" src="~@/assets/images/index-portal-red-semi.svg">
                <img draggable="false" class="hero-logo-circle" src="~@/assets/images/index-portal-red.svg">
                <img draggable="false" class="hero-logo-circle" src="~@/assets/images/index-portal-orange.svg">
                <img draggable="false" class="hero-logo-circle" src="~@/assets/images/index-portal-orange.svg">
                <img draggable="false" class="hero-logo-circle" src="~@/assets/images/index-portal-yellow-semi.svg">
                <img draggable="false" class="hero-logo-circle" src="~@/assets/images/index-portal-yellow.svg">
                <img draggable="false" class="hero-logo-circle" src="~@/assets/images/index-portal-green-semi.svg">
                <img draggable="false" class="hero-logo-circle" src="~@/assets/images/index-portal-green.svg">
                <img draggable="false" class="hero-logo-circle" src="~@/assets/images/index-portal-blue-semi.svg">
                <img draggable="false" class="hero-logo-circle" src="~@/assets/images/index-portal-blue.svg">
            </div>
        </div>
        <!-- 中心专辑图片 -->
        <div class="hero-play-audio">
            <img class="hero-play-audios" ref="albumImgEle" @click.stop="playPaused" draggable="false" :src="currentPlaySong.albumisrc ? currentPlaySong.albumisrc : placeholderImg" alt="">
            <div class="hero-play-album-name">
                {{currentPlaySong.name}}-{{currentPlaySong.songname}}
            </div>

            <!-- <img draggable="false" @click="playPaused" class="hero-play-audios" src="~@/assets/images/index-logo.svg" alt="Index portal blue"> -->
        </div>
        <SwitchRouter></SwitchRouter>
        <!-- <AudioPanel></AudioPanel> -->

        <div class="hero-play-panel">
            <!-- 播放时间 -->
            <div class="hero-play-time">
                <div class="hero-play-time-current">{{transformTime(currPlayTime)}}</div>
                <div class="hero-play-time-total">{{transformTime(songDuration)}}</div>
            </div>
            <!-- 播放进度条 -->
            <div class="hero-play-progress" ref="audioParentEle" @click.stop="adjustProgress($event)">
                <div ref="audioBufferedEle" class="hero-play-progress-buffered"></div>
                <div ref="audioProgressEle" class="hero-play-progress-bar"></div>
            </div>
            <!-- 播放控制 -->
            <div class="hero-play-controls">
                <div class="hero-play-controls-left">
                    <!-- 暂停，播放 -->
                    <div class="hero-play-controls-playpaused" :class="[isPlay ? 'pused' : 'play']" @click.stop="playPaused" :title="[isPlay ? '暂停' : '播放']"></div>
                    <!-- 播放下一首 -->
                    <div class="hero-play-controls-playnext" title="下一首" @click.stop="playNext"></div>
                    <!-- 禁音 -->
                    <div class="hero-play-controls-playvoice" :class="[isVoice ? 'voice-off' : 'voice-on']" title="禁音" @click.stop="closedSound"></div>
                    <!-- 音量大小 -->
                    <div class="hero-play-controls-playrange">
                        <input ref="audioRangeEle" class="playrange-input iptrange" type="range" value="0" max="100" min="0" step="1" v-model="audioRangeVal" @input="playRange">
                    </div>
                </div>

                <div class="hero-play-controls-right">
                    <!-- 喜欢 -->
                    <div class="hero-play-controls-like" :class="[isLike ? 'like' : 'hate']" :title="[isLike ? '已经喜欢' : '喜欢']" @click.stop="audioLike"></div>
                    <!-- 不喜欢 -->
                    <div class="hero-play-controls-hate" title="讨厌" @click.stop="audioHate"></div>
                    <!-- 其他 -->
                    <div class="hero-play-controls-other" title="更多" @click.stop="audioMore"></div>
                    <!-- 喜欢讨厌的歌曲列表 -->
                    <transition name="slide-collect">
                        <div class="hero-play-controls-more" v-show="isShowCollect">
                            <div class="hero-play-controls-more-tab">
                                <span class="tab-list" :class="[collectType == 'likes' ? 'activate' : '']" @click.stop="toggleList('likes')">Likes</span>
                                <span class="tab-list" :class="[collectType == 'hates' ? 'activate' : '']" @click.stop="toggleList('hates')">Hates</span>
                            </div>
                            <!-- <transition-group name="slide-left" tag="ul" class="hero-play-controls-more-list"> -->
                                <ul class="hero-play-controls-more-list">
                                    <li class="like-or-hate-list" v-for="item in collectList" :key="item.id">
                                        <span class="list-play" @click.stop="selectPlaySong(item)">{{item.name}}-{{item.songname}}</span>
                                        <span class="list-removed" @click.stop="removedCollect(item)"></span>
                                    </li>
                                    <li class="like-or-hate-nodata" v-show="collectList.length == 0">No Data</li>
                                </ul>
                            <!-- </transition-group> -->
                        </div>
                    </transition>
                </div>
            </div>
        </div>

        <canvas ref="canvasPlayer" class="hero-play-canvas"></canvas>
    </div>
</template>

<script>
import { ipcRenderer } from 'electron';
import placeholderImg from '../assets/person_300.png';
import * as analyser from '../tools/analyser';
import * as spectrum from '../tools/spectrum';
import * as songInfo from '../tools/songInfo';

export default {
    name: 'AudioPlayer',
    data: () => ({
        currentPlaySong :'',//当前播放音乐对象
        isLike          :false,//是否喜欢这首歌
        isVoice         :false,//是否禁音
        isPlay          :true,//是否播放
        placeholderImg  :placeholderImg,//默认专辑图片
        audioBufferedEle:'',//音频缓冲进度条
        audioProgressEle:'',//音频进度条元素
        audioParentEle  :'',//音频进度条父元素

        audioRangeVal   :50,//音轨值
        audioRangeEle   :'',//input音轨元素对象

        albumImgEle     :'',//专辑图片元素对象
        defaultVolume   :0.5,//默认音量值

        collectList     :[],//标记喜欢的歌曲列表
        playSonglist    :[],//播放列表
        currSongIndex   :0,//当前播放歌曲的下标
        acceptSonglist  :[],//播放完成后存储的列表
        songDuration    :0,//歌曲总时长
        currPlayTime    :0,//当前歌曲播放时间
        albumRotateDeg  :0,//专辑图片旋转度

        timeInterval    :'',//
        albumInterval   :'',//
        bgcolorInterval :'',//
        bgcolorVal      :'',//背景颜色值
        heroBoxEle      :'',//主体背景元素

        AudioPlayer     :'',//new audio 播放器对象
        AudioBufferedVal:1,//audio 以缓冲的百分比

        tableData       :'',//本地数据库

        canvasPlayer    :'',//canvas
        canvasCtx       :'',//canvas ctx
        drawVisual      :'',//canvas draw requestAnimFrame

        audioCtx        :'',//播放器上下文
        analyser        :'',//音频分析器
        mediaSource     :'',//媒体节点

        bufferLength    :'',//
        dataArray       :'',//

        isShowCollect   :false,//是否显示收藏
        collectType     :'likes',//收藏列表默认显示
    }),
    created(){
        // 设置request animation frame
        this.$tool.setRequestAnimFrame();

        // this.$db.chartData.loadDatabase();
        // 初始化本地数据库
        this.tableData = this.$db.tableData;
        // this.tableData.remove({},{ multi: true },(err, numRemoved) => {});
    },
    mounted(){
        this.albumImgEle       = this.$refs.albumImgEle;

        this.audioProgressEle  = this.$refs.audioProgressEle;
        this.audioBufferedEle  = this.$refs.audioBufferedEle;
        this.audioParentEle    = this.$refs.audioParentEle;

        this.audioRangeEle     = this.$refs.audioRangeEle;
        this.heroBoxEle        = this.$refs.heroBoxEle;

        this.canvasPlayer      = this.$refs.canvasPlayer;
        this.canvasCtx         = this.canvasPlayer.getContext("2d");

        // 设置canvas宽高
        this.canvasPlayer.setAttribute('width',document.body.clientWidth);
        this.canvasPlayer.setAttribute('height',document.body.clientHeight);

        this.AudioPlayer = new Audio();//创建播放对象

        this.getMusics();//获取音乐列表
        this.playEnd();//监听播放完成
        this.playTime();//获取当前播放时长
        this.setRangeProgress();// 设置拖动条颜色

        // 创建音频源连接的播放节点分析器
        this.audioCtx    = new (window.AudioContext || window.webkitAudioContext)();
        // 闯将频谱分析器
        this.analyser    = this.audioCtx.createAnalyser();
        this.mediaSource = this.audioCtx.createMediaElementSource(this.AudioPlayer);
        //连接：source → analyser → destination
        this.mediaSource.connect(this.analyser);
        this.analyser.connect(this.audioCtx.destination);

        // fftSize (Fast Fourier Transform) 是快速傅里叶变换，一般情况下是固定值2048，这个值可以决定音频频谱的密集程度。值大了，频谱就松散，值小就密集。
        // this.analyser.fftSize = 4096;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(256);//dataArray数组将用来放音频高低音不同区域的数据信息，当音频播放时，每一个时间节点，都有不同的音频数据，使用analyser.getByteFrequencyData(dataArray)将数据放入数组，用来进行频谱的可视化绘制。

        // 清除canvas绘制区域
        this.canvasCtx.clearRect(0, 0, this.canvasPlayer.width, this.canvasPlayer.height);

        // this.canvasDraw()

        // 隐藏收藏列表
        document.addEventListener('click', () => {
            this.isShowCollect ? this.isShowCollect = false : '';
        })
    },
    computed:{

    },
    methods: {
        // 播放
        playPaused(){
            if(this.AudioPlayer.paused){
                this.isPlay = true;
                this.AudioPlayer.play();
                this.albumStartRotate();//专辑旋转开始
            }else{
                this.isPlay = false;
                this.AudioPlayer.pause();
                this.albumEndRotate();//专辑旋转暂停
            }
        },

        // 获取音乐列表
        getMusics(){
            this.$API.qq.qqMusicLsitAPI().then((res)=>{
                let data = res.data;
                let songlist = data.songlist;
                for (var i = 0; i < songlist.length; i++) {
                    let data = songlist[i].data;
                    if(data.songmid){
                        this.playSonglist.push(this.setPlaySongInfo(data));
                        // this.playSonglist.push(songInfo.songPlayInfo(data));
                    }
                }
                // this.playSonglist.splice(0,0,{src:ogg});
                this.startPlay('random');//开始播放
            })
        },

        // 设置播放歌曲信息
        setPlaySongInfo(data){
            return {
                src         :`http://ws.stream.qqmusic.qq.com/C100${data.songmid}.m4a?fromtag=0&guid=126548448`,
                name        :data.name || data.singer[0].name,
                songname    :data.songname,
                songorig    :data.songorig,
                songmid     :data.songmid,
                songid      :data.songid,

                albumisrc   :`http://imgcache.qq.com/music/photo/album_300/${data.albumid%100}/300_albumpic_${data.albumid}_0.jpg`,
                albumid     :data.albumid,
                albummid    :data.albummid,
                albumname   :data.albumname
            }
        },

        // 获取歌词
        getLyric(){
            let songId = this.playSonglist[this.currSongIndex].songid;
            console.log(songId);
            // 向主进程发送事件，获取歌词
            ipcRenderer.send('ipcRendererSongLyric', songId);
            // 接受主进程事件通知，渲染歌词
            ipcRenderer.on('ipcMainSongLyric',(event,data) => {
                console.log(data);
            })
        },

        /**
         * [开始播放歌曲]
         * @param  {String} [playType='order'] [order:'顺序播放',random:'随机播放',loop:'循环播放']
         * @param  {[type]} playSong           [需要播放的歌曲对象]
         */
        startPlay(playType = 'random',playSong){
            this.isPlay = true;
            this.audioProgressEle.style.width = `0%`;
            // 旋转专辑图片
            this.albumStartRotate();

            if(playType == 'order'){
                this.currSongIndex = 0;
            }else if(playType == 'random'){
                // 设置随机播放第一首歌
                this.currSongIndex  = Math.floor(Math.random() * this.playSonglist.length);
            }
            // 如果有指定播放的歌曲
            if(playSong){
                this.currentPlaySong    = this.setPlaySongInfo(playSong);
                this.AudioPlayer.src    = this.currentPlaySong.src;//当前播放歌曲的src
            }else{
                // 如果没有指定播放的歌曲先查询数据库里面是否存在记录，如果存在记录再判断是否标记为是否喜欢，如果不喜欢则跳过播放
                let tempsong = this.playSonglist[this.currSongIndex];
                this.tableData.find({ songid: tempsong.songid }, (err,doc) => {
                    if(doc.length != 0){
                        // 如果不是喜欢的歌曲则跳过播放
                        if(!doc[0].isLike){
                            this.playSonglist.splice(0,1);
                        }
                    }
                })
                this.currentPlaySong = tempsong;//当前播放的歌曲详细信息
                this.AudioPlayer.src = tempsong.src;//当前播放歌曲的src
            }

            this.AudioPlayer.load();

            // 开始播放并监听播放位置改变时
            this.AudioPlayer.play();

            this.AudioPlayer.ontimeupdate = () => {
                if(this.AudioPlayer.readyState == 4){
                    // 如果歌曲已缓冲100%
                    // if(this.AudioBufferedVal == 100){
                    //     return;
                    // }
                    this.AudioBufferedVal = Math.round(this.AudioPlayer.buffered.end(0) / this.AudioPlayer.duration * 100);//歌曲缓冲百分值
                    this.audioBufferedEle.style.width = `${this.AudioBufferedVal}%`;
                    this.songDuration = this.AudioPlayer.duration;//音乐总时长(秒)

                    // div range 根据当前播放时间设置播放进度条百分值元素
                    this.currPlayTime = parseInt(this.AudioPlayer.currentTime);
                    this.audioProgressEle.style.width = `${parseFloat(this.currPlayTime / this.songDuration) * 100}%`;

                }
            }

            // this.changeBackgroundColor();//随机改变背景颜色
            //获取歌词
            this.getLyric();

        },

        // 停止播放
        endPlay(){
            cancelAnimationFrame(this.timeInterval);//清除获取当前播放时间
            this.isPlay = false;//是否播放状态为停止
            this.AudioPlayer.pause();//停止播放
            this.albumEndRotate();//专辑旋转暂停
        },

        // 下一首
        playNext(){
            this.acceptSonglist.push(this.playSonglist[0]);
            this.playSonglist.splice(0,1);
            this.albumEndRotate();//清除专辑图片动画
            this.startPlay();//开始播放
            this.AudioBufferedVal = 1;//默认缓冲值从1开始
            this.searchVal = '';//清空搜索

            //根据查询的数据标记是否喜欢，需要在播放歌曲之前重新查询这首歌是否被标记成已喜欢
            this.tableData.find({ songmid : this.currentPlaySong.songmid }, (err,doc) => {
                this.isLike = doc.length != 0 ? true : false;
            })
        },

        // 开启关闭声音
        closedSound(){
            if(this.isVoice){
                this.AudioPlayer.volume = this.defaultVolume;//开音
                this.isVoice = false;
            }else{
                this.AudioPlayer.volume = 0;//禁音
                this.isVoice = true;
            }
        },

        // 设置音量大小
        playRange(){
            // 设置拖动条颜色
            this.setRangeProgress();
            // 设置音量大小
            this.AudioPlayer.volume = this.audioRangeVal / 100;
            if(this.audioRangeVal == 0){
                this.isVoice = true;
            }else{
                this.isVoice = false;
            }
        },

        // 设置拖动音量条颜色
        setRangeProgress(){
            this.audioRangeEle.style.backgroundSize = `${this.audioRangeVal}% 100%`;
        },

        // 设置歌曲喜欢
        audioLike(){
            this.isLike = !this.isLike;
            let songdata = songInfo.songPlayData(this.currentPlaySong,this.isLike);
            // 只有喜欢的歌曲才会被添加到db
            if(this.isLike){

                // 存储喜欢的歌曲的信息到db
                this.tableData.insert(songdata, (err, newDoc) => {
                    // 设置喜欢的歌曲
                    this.collectList.push(songdata);
                    console.log(newDoc)
                })
                // this.tableData.find({}, (err, docs) => { console.log(docs) })
            }else{
                this.removedCollect(songdata);
            }
        },

        // 讨厌歌曲
        audioHate(){
            // console.log(this.currentPlaySong);
            // 设置讨厌的歌曲
            let songdata = songInfo.songPlayData(this.currentPlaySong,false);

            //标记这首歌曲不喜欢
            this.tableData.insert(songdata, (err, newDoc) => {
                this.collectList.push(newDoc)
            })
            this.playNext();//下一首歌
        },

        // 更多
        audioMore(){
            this.isShowCollect = !this.isShowCollect;
            if(this.isShowCollect){

                let type;
                if(this.collectType == 'likes'){
                    type = true;
                }else if(this.collectType == 'hates'){
                    type = false;
                }

                // 默认查询喜欢的
                this.tableData.find({ isLike: type }, (err, docs) => {
                    this.collectList = [];
                    docs.forEach(item => this.collectList.push(item));
                });
            }
        },

        // 移除收藏
        removedCollect(item){
            let collectList = this.collectList;
            for (var i = 0; i < collectList.length; i++) {
                if(collectList[i].songid == item.songid){
                    collectList.splice(i,1);
                    break;
                }
            }
            // 删除一条记录
            this.tableData.remove({ songid: item.songid }, {}, (err, numRemoved) => {
              console.log(numRemoved);
            });
        },

        // 切换歌曲
        toggleList(type){
            this.collectType = type;
            if(type == 'likes'){
                this.tableData.find({ isLike: true }, (err, docs) => {
                    this.collectList = [];
                    docs.forEach(item => this.collectList.push(item));
                });
            }else if(type == 'hates'){
                this.tableData.find({ isLike: false }, (err, docs) => {
                    this.collectList = [];
                    docs.forEach(item => this.collectList.push(item));
                    // console.log(docs);
                });
            }
        },

        // 监听播放完成
        playEnd(){
            // 监听播放完成
            this.AudioPlayer.addEventListener('ended', () => {
                this.playNext();//播放下一首
            }, false);
        },

        // 返回播放时长
        playTime(){
            this.AudioPlayer.addEventListener("canplay", () => {
                this.songDuration = parseInt(this.AudioPlayer.duration);
            });
        },

        // 调整播放进度
        adjustProgress(e){
            //停止播放
            this.endPlay();
            // 获取计算点击位置的进度条百分比值
            let {target,offsetX} = e;
            let progressTotal = this.$tool.getEelUnit(this.audioParentEle,'width');
            let percentage = (offsetX / progressTotal);

            // 设置播放进度条显示
            this.audioProgressEle.style.width = `${parseFloat(percentage) * 100}%`;
            // 指定播放时间开始播放
            this.AudioPlayer.currentTime = parseInt(percentage * this.AudioPlayer.duration);

            this.AudioPlayer.play();//开始播放音乐
            this.albumStartRotate();//专辑图片开始旋转
            this.isPlay = true;//是否播放状态为播放
        },

        // 专辑图片开始旋转
        albumStartRotate(){
            this.albumInterval = requestAnimFrame(this.albumStartRotate);
            this.albumImgEle.style.transform = `rotate(${this.albumRotateDeg}deg)`;
            this.albumRotateDeg += .5;
            if(this.albumRotateDeg > 360){
                this.albumRotateDeg = 0;
            }
        },

        // 专辑图片暂停旋转
        albumEndRotate(){
            cancelAnimationFrame(this.albumInterval);
        },

        // 转换分秒时间
        transformTime(time){
            let second = parseInt(isNaN(time) ? 0 : time);//秒数
            let temp = second;
            let minute = parseInt(temp / 60);
            if(second % 60 < 10){
                return `${minute}:0${second % 60}`;
            }else{
                return `${minute}:${second % 60}`;
            }
        },

        // 选中播放歌曲
        selectPlaySong(data){
            // this.searchVal = `${data.singer[0].name}-${data.songname}`;
            // this.isShowList = false;//隐藏搜索列表
            // console.log(data);

            this.isShowCollect ? this.isShowCollect = false : '';

            this.albumEndRotate();//清除专辑图片动画
            this.startPlay('order',data);

            //根据查询的数据重置是否喜欢，需要在播放歌曲之前重新查询这首歌是否被标记成已喜欢
            this.tableData.find({ songmid : data.songmid }, (err,doc) => {
                this.isLike = doc.length != 0 ? true : false;
            })

        },

        // 根据歌曲缓慢改变背景颜色
        changeBackgroundColor(){
            let theColor = [
                ['#693e44','#3c5d90','#000d38'],
                ['#345e44','#001029','#000d38'],
                ['#823e54','#290020','#000d38'],
                ['#393e44','#020000','#46102b'],
                ['#7ba1ce','#88522f','#523951'],
                ['#3c7ece','#552f88','#523939'],
                ['#8e9296','#31283c','#2e2246'],
                ['#8e9296','#31283c','#2e2246'],
                ['#1da047','#000000','#25290f'],
                ['#1da047','#000000','#25290f'],
                ['#d2272e','#4c4429','#290f26'],
            ];
            let random = 10;//Math.ceil(Math.random() * 10);
            this.heroBoxEle.style.backgroundImage = `radial-gradient(circle farthest-corner at 50% 50%, ${theColor[random][0]}, ${theColor[random][1]} 50%, ${theColor[random][2]})`;

        },


        // canvas 频谱绘制
        canvasDraw(){
            let dataArray = this.dataArray;
            let bufferLength = this.bufferLength;

            this.drawVisual = requestAnimationFrame(this.canvasDraw);

            this.analyser.getByteFrequencyData(dataArray);

            spectrum.voiceCircleSpectrum(this.canvasCtx,this.canvasPlayer,dataArray,bufferLength);

        },
    },
    beforeDestroyed(){
        console.log('beforeDestroyed');
        this.endPlay();
        this.AudioPlayer = '';
    },
    destroyed(){
        console.log('destroyed');
        this.endPlay();
        this.AudioPlayer = '';
    }
}
</script>

<style lang="css">

.slide-collect-enter-active {
  transition: all .25s ease;
}
.slide-collect-leave-active {
  transition: all .25s ease;
}
.slide-collect-enter, .slide-collect-leave-to
/* .slide-collect-leave-active for below version 2.1.8 */ {
  transform: translateY(10px);
  opacity: 0;
}

.slide-slide-left-enter-active {
  transition: all .25s ease;
}
.slide-slide-left-leave-active {
  transition: all .25s ease;
}
.slide-slide-left-enter, .slide-slide-left-leave-to
/* .slide-slide-left-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>

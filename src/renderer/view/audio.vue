<template lang="html">
    <div class="hero-box" ref="heroBoxEle">
        <AudioHeader @AudioHeaderSelectPlaySong="selectPlaySong"/>
        <!-- 中心旋转图片 -->
        <div class="hero-logo" aria-hidden="true">
            <div class="hero-logo-circles">
                <img draggable="false" class="hero-logo-circle" src="~@/assets/images/index-portal-red-semi.svg" alt="">
                <img draggable="false" class="hero-logo-circle" src="~@/assets/images/index-portal-red.svg" alt="">
                <img draggable="false" class="hero-logo-circle" src="~@/assets/images/index-portal-orange.svg" alt="">
                <img draggable="false" class="hero-logo-circle" src="~@/assets/images/index-portal-orange.svg" alt="">
                <img draggable="false" class="hero-logo-circle" src="~@/assets/images/index-portal-yellow-semi.svg" alt="">
                <img draggable="false" class="hero-logo-circle" src="~@/assets/images/index-portal-yellow.svg" alt="">
                <img draggable="false" class="hero-logo-circle" src="~@/assets/images/index-portal-green-semi.svg" alt="">
                <img draggable="false" class="hero-logo-circle" src="~@/assets/images/index-portal-green.svg" alt="">
                <img draggable="false" class="hero-logo-circle" src="~@/assets/images/index-portal-blue-semi.svg" alt="">
                <img draggable="false" class="hero-logo-circle" src="~@/assets/images/index-portal-blue.svg" alt="">
            </div>
        </div>
        <!-- 中心专辑图片 -->
        <div class="hero-play-audio">
            <img class="hero-play-audios" ref="albumImgEle" @click.stop="playPaused" draggable="false" :src="currentPlaySong.albumisrc ? currentPlaySong.albumisrc : placeholderImg" alt="">
            <div class="hero-play-album-name">
                {{currentPlaySong.singername}}<br/>{{currentPlaySong.songname}}
            </div>
        </div>
        <!--<SwitchRouter/>-->
        <!-- <AudioPanel></AudioPanel> -->

        <div class="hero-play-panel">
            <!-- 歌词 -->
            <!-- <div class="hero-play-lyric">{{currentLyric}}</div> -->
            <!-- 播放时间 -->
            <div class="hero-play-time">
                <div class="hero-play-time-current">{{transformTime(currPlayTime)}}</div>
                <div class="hero-play-time-lyric">
                    <transition name="slide-fade">
                        <span>{{currentLyric}}</span>
                    </transition>
                </div>
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
                    <div class="hero-play-controls-playprev" title="上一首" @click.stop="playPrev"></div>
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
                                <span class="tab-list" :class="[collectType === 'likes' ? 'activate' : '']" @click.stop="toggleList('likes')">Likes</span>
                                <span class="tab-list" :class="[collectType === 'hates' ? 'activate' : '']" @click.stop="toggleList('hates')">Hates</span>
                            </div>
                            <!-- <transition-group name="slide-left" tag="ul" class="hero-play-controls-more-list"> -->
                                <ul class="hero-play-controls-more-list">
                                    <li class="like-or-hate-list" v-for="item in collectList" :key="item.id">
                                        <span class="list-play" @click.stop="selectPlaySong(item,$event)">{{item.singername}}-{{item.songname}}</span>
                                        <span class="list-removed" @click.stop="removedCollect(item)"/>
                                    </li>
                                    <li class="like-or-hate-nodata" v-show="collectList.length === 0">No Data</li>
                                </ul>
                            <!-- </transition-group> -->
                        </div>
                    </transition>
                </div>
            </div>
        </div>

        <MaskLayer ref="dialogInfoObj">
            <div class="dialog-info">
                <div class="dialog-info-tit">{{dialogInfoMsg}}</div>
                <div class="dialog-info-btn" @click.stop="playNext">播放下一首</div>
                <div class="dialog-info-closed"></div>
            </div>
        </MaskLayer>
        <canvas ref="canvasPlayer" class="hero-play-canvas"/>
    </div>
</template>

<script>
    import { ipcRenderer, remote } from 'electron';
    import placeholderImg from '../assets/person_300.png';
    import * as songInfo from '../tools/songInfo';
    import Spectra from '../class/Spectra';

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
        playSongList    :[],//播放列表
        playSongLyric   :[],//播放歌曲的歌词
        currentLyric    :'',//播放歌曲的当前歌词

        currSongIndex   :0,//当前播放歌曲的下标
        endSongList     :[],//播放完成后存储的列表
        songDuration    :0,//歌曲总时长
        currPlayTime    :0,//当前歌曲播放时间
        albumRotateDeg  :0,//专辑图片旋转度
        prevSongIndex   :0,//上一首歌曲下标

        timeInterval    :'',//
        albumInterval   :'',//专辑
        bgColorInterval :'',//
        bgColorVal      :'',//背景颜色值
        heroBoxEle      :'',//主体背景元素

        AudioPlayer     :{},//new audio 播放器对象
        AudioBufferedVal:1,//audio 以缓冲的百分比

        collectData     :'',//本地收藏数据库
        songData        :'',//所有歌曲数据库

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

        dialogInfoObj   :'',//提示层layer
        dialogInfoMsg   :'',//提示信息
        SpectraClass    :'',//频谱构造函数
    }),
    created(){
        // 设置request animation frame
        this.$tool.setRequestAnimFrame();

        // this.$db.chartData.loadDatabase();
        // 初始化本地数据库
        this.collectData = this.$db.collectData;//收藏列表
        this.songData = this.$db.songData;//所有歌曲数据库
        this.collectData.find({}, (err, docs) => { console.log(docs) })
        // this.collectData.remove({},{ multi: true },(err, numRemoved) => {});

        /*this.collectData.find({ timestamp: { $exists: true } }, (err,docs) => {
            docs.forEach((item) => {
                let now = new Date(item.timestamp).getTime();
                this.collectData.update(
                    {"_id":item._id},
                    {$set:{"now": now}},
                    {},
                    (err, numAffected, affectedDocuments) => {
                        console.log(err,numAffected, affectedDocuments);
                    }
                )
            });
        });*/

        // 转换所有有timestamp的时间戳=> now fileds
        /*this.collectData.find({timestamp:{ $exists: true }}, (err,docs) => {

            for (let i = 0; i < docs.length; i++) {
                let now = new Date(docs[i].timestamp).getTime();
                docs[i].now = now;
            }
            console.log(JSON.stringify(docs));
        });*/
    },
    mounted(){
        this.albumImgEle       = this.$refs.albumImgEle;

        this.audioProgressEle  = this.$refs.audioProgressEle;
        this.audioBufferedEle  = this.$refs.audioBufferedEle;
        this.audioParentEle    = this.$refs.audioParentEle;

        this.audioRangeEle     = this.$refs.audioRangeEle;
        this.heroBoxEle        = this.$refs.heroBoxEle;

        this.dialogInfoObj     = this.$refs.dialogInfoObj;

        this.canvasPlayer      = this.$refs.canvasPlayer;
        this.canvasCtx         = this.canvasPlayer.getContext("2d");

        // 设置canvas宽高
        this.canvasPlayer.setAttribute('width',document.body.clientWidth);
        this.canvasPlayer.setAttribute('height',document.body.clientHeight);

        this.AudioPlayer = new Audio();//创建播放对象

        this.getMusics();//获取音乐列表
        this.playEnd();//监听播放完成
        this.playTime();//获取当前播放时长
        this.playError();//监听播放异常
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
        this.dataArray = new Uint8Array(360);//dataArray数组将用来放音频高低音不同区域的数据信息，当音频播放时，每一个时间节点，都有不同的音频数据，使用analyser.getByteFrequencyData(dataArray)将数据放入数组，用来进行频谱的可视化绘制。

        // 清除canvas绘制区域
        this.canvasCtx.clearRect(0, 0, this.canvasPlayer.width, this.canvasPlayer.height);

        // 初始化频谱构造函数
        this.SpectraClass = new Spectra(this.canvasCtx,this.canvasPlayer,this.dataArray,this.bufferLength);

        // 绘制频谱
        // this.canvasDraw();

        // 隐藏收藏列表
        document.addEventListener('click', () => {
            this.isShowCollect ? this.isShowCollect = false : '';
        });

        // 监听ArrowRight方向键切换下一首歌曲
        document.addEventListener('keydown',(e) => {
            if(e.keyCode === 39){
                this.playNext();
            }
        });

        // 接受主进程事件通知，渲染歌词
        ipcRenderer.on('ipcMainSongLyric',(event,lyric) => {
            this.parseLyric(lyric);//解析歌词
        });

        // 检查是否有更新
        ipcRenderer.send("checkForUpdate");

        // 接受更新信息
        ipcRenderer.on("message", (event, msg) => {
            console.log(msg);

            if(msg.type === 'updating'){
                // 检查到最新版本
                this.$dialog.alert({
                    title   : '123',
                    type    : 'msg',
                    message : msg.msg,
                    leftbtn : '下次',
                    rightbtn: '确认',
                    callback: (flag) => {
                        flag && ipcRenderer.send("updateNow");
                    }
                })
            }
        });

        // 下载进度
        ipcRenderer.on("downloadProgress", (event, progress) => {
            console.log(progress);
        });

        // 接受更新下载完成通知
        ipcRenderer.on("updateDownloaded", (event, downloaded) => {
            // 通知主进程立即更新
            // ipcRenderer.send("updateNow");
            console.log(downloaded);
        });
    },
    computed:{

    },
    methods: {
        // 获取歌词时间
        getTime(str){
            let minutes = parseInt(str.split(':')[0]);
            let seconds = parseInt(str.split(':')[1].split('.')[0]);
            let ms      = parseInt(str.split('.')[1]);
            // console.log(minutes,seconds,ms,Math.floor(((minutes * 60) + seconds + (ms / 100))));
            return Math.floor(((minutes * 60) + seconds + (ms / 100)));
        },

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
            this.$API.qq.qqMusicListAPI().then((res)=>{
                const { data: { songlist = [] } } = res;
                this.playSongList.push(...songlist.map(({ data }) => songInfo.SetSongPlayInfo(data)));// 设置播放歌曲信息
                this.startPlay();//开始播放
            })
        },

        // 解析歌词
        parseLyric(lyric){
            this.playSongLyric = [];
            if(lyric.length === 0){
                this.currentLyric = '当前暂无歌词显示';
                return
            }
            for(let i = 1; i < lyric.length; i++){
                if(lyric[i]){
                    if(lyric[i].split("[")[1].split("]")[1]){

                        this.playSongLyric.push({
                            lyric       :lyric[i].split("[")[1].split("]")[1],
                            lyricTime   :this.getTime(lyric[i].split("[")[1].split("]")[0]),
                        })
                    }
                }
            }
        },

        /**
         * [开始播放歌曲]
         * @param  {String} [playType='order'] [order:'顺序播放',random:'随机播放',loop:'循环播放']
         * @param  {[type]} playSong           [需要播放的歌曲对象]
         */
        async startPlay(playType = 'random', playSong){
            this.isPlay = true;
            this.audioProgressEle.style.width = `0%`;
            // 旋转专辑图片
            this.albumStartRotate();

            if(playType === 'order'){
                this.currSongIndex = 0;
            }else if(playType === 'random'){
                // 设置随机播放第一首歌
                this.currSongIndex  = Math.floor(Math.random() * this.playSongList.length);
            }
            // 如果有指定播放的歌曲
            if(playSong){
                this.currentPlaySong = songInfo.SetSongPlayInfo(playSong);// 设置播放歌曲信息
                this.AudioPlayer.src = this.currentPlaySong.src = await this.$API.qq.qqMusicGetPlaySrcAPI(playSong.songmid);//当前播放歌曲的src
            }else{
                // 如果没有指定播放的歌曲先查询数据库里面是否存在记录，如果存在记录再判断是否标记为是否喜欢，如果不喜欢则跳过播放
                const tempSong = this.playSongList[this.currSongIndex];
                this.collectData.find({ songid: tempSong.songid }, (err,doc) => {
                    if(doc.length !== 0){
                        // 如果不是喜欢的歌曲则跳过播放
                        if(!doc[0].isLike){
                            this.isLike = false;
                            this.playSongList.splice(0,1);
                        }else{
                            this.isLike = true;
                        }
                    }
                });
                this.currentPlaySong = tempSong;//当前播放的歌曲详细信息
                this.AudioPlayer.src = await this.$API.qq.qqMusicGetPlaySrcAPI(tempSong.songmid);//当前播放歌曲的src

                ipcRenderer.send('ipcRendererSongMedia', this.currentPlaySong.songmid);
            }

            // 查询所有歌曲列表是否存在类似的歌曲，如果存在跳过保存
            this.songData.find({ songid: this.currentPlaySong.songid },( err, doc ) => {
                if(doc.length === 0){
                    const songData = songInfo.SetSongPlayInfo(this.currentPlaySong);
                    this.songData.insert(songData);//保存当前歌曲信息
                }else{
                    // 用当前时间更新没有保存时间戳的歌曲
                    if(!doc[0].now){
                        let now = Date.now();
                        this.songData.update(
                            { songid: this.currentPlaySong.songid },
                            // { $inc: { now: now } },
                            { $set: { 'now' : now } },
                            {},
                            (err, numAffected, affectedDocuments) => {
                                console.log(err,numAffected, affectedDocuments);
                            }
                        )
                    }
                }
            });

            console.log(this.currentPlaySong.songname);
            // 判断歌曲是否需要付费才能播放
            if(this.currentPlaySong.payplay === 1){
                console.log(this.currentPlaySong.songname);
                this.dialogInfoMsg = '该歌曲需要付费播放';
                /*let options = {
                    type    : 'warning',
                    title   : '提示',
                    message : `该歌曲需要付费播放`,
                    buttons : ['播放下一曲']
                }
                remote.dialog.showMessageBox(options, (index) => {
                    console.log(index);
                    if(!index){
                        this.playNext();
                        return;
                    }
                })*/
                this.$refs.dialogInfoObj.toggle(true);
            }

            this.AudioPlayer.load();

            // 开始播放并监听播放位置改变时
            this.AudioPlayer.play();

            this.AudioPlayer.ontimeupdate = () => {
                if(this.AudioPlayer.readyState === 4){
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
                    // console.log(this.AudioPlayer.currentTime);

                    // 显示当前歌词
                    for (let i = 0; i < this.playSongLyric.length; i++) {
                        if(this.playSongLyric[i].lyricTime === this.currPlayTime){
                            this.currentLyric = this.playSongLyric[i].lyric;
                            break;
                        }
                    }
                }
            };

            // this.changeBackgroundColor();//随机改变背景颜色

            // 向主进程发送事件，获取歌词
            ipcRenderer.send('ipcRendererSongLyric', this.currentPlaySong.songmid);
        },

        // 停止播放
        endPlay(){
            cancelAnimationFrame(this.timeInterval);//清除获取当前播放时间

            this.isPlay = false;//是否播放状态为停止
            this.AudioPlayer.pause();//停止播放
            this.albumEndRotate();//专辑旋转暂停
        },

        // 上一首
        playPrev(){
            let idx = (this.endSongList.length - this.prevSongIndex) - 1;
            let prevSongIdx = idx <= 0 ? 0 : idx;
            let playSong = this.endSongList.length !== 0 ? this.endSongList[prevSongIdx] : false;
            this.prevSongIndex += 1;//上一首歌曲的下标
            if(playSong){
                this.endPlay();
                this.startPlay('random',playSong);
            }
        },

        /**
         * 下一首
         * @param playType(String) [播放类型]
         */
        playNext(playType){
            this.savePlayEndSong();//保存已播放过的歌曲
            this.albumEndRotate();//清除专辑图片动画
            this.startPlay('random');//开始播放
            this.AudioBufferedVal = 1;//默认缓冲值从1开始
            this.playSongLyric = [];//清空当前歌词组
            this.currentLyric = '';//清空当前歌词
            this.prevSongIndex = 0;//重置上一首歌下标

            // 歌曲付费播放提示是否显示，如果显示就在切换歌曲时隐藏
            if(this.dialogInfoObj.show === true){
                this.dialogInfoObj.toggle(false);
            }

            //根据查询的数据标记是否喜欢，需要在播放歌曲之前重新查询这首歌是否被标记成已喜欢
            this.collectData.find({ songmid : this.currentPlaySong.songmid }, (err,doc) => {
                this.isLike = !!doc.length;//doc.length !== 0 ? true : false;
            })
        },

        // 保存已播放过的歌曲
        savePlayEndSong(){
            if(this.endSongList.length !== 0){
                let flag = false;
                for (let i = 0; i <= this.endSongList.length - 1; i++) {
                    // 当播放过的歌曲列表里面没有一条记录对应当前播放歌曲的id时且为最后一条记录时把当前歌曲保存到播放过的列表
                    if( this.endSongList[i].songid === this.playSongList[this.currSongIndex].songid ){
                        flag = false;
                        break
                    }else if(this.endSongList[i].songid !== this.playSongList[this.currSongIndex].songid && i === this.endSongList.length - 1){
                        flag = true
                    }else{
                        flag = false;
                    }
                }
                if(flag){
                    this.endSongList.push(this.playSongList[this.currSongIndex]);
                    this.playSongList.splice(this.currSongIndex,1);
                }
            }else{
                this.endSongList.push(this.playSongList[this.currSongIndex]);
                this.playSongList.splice(this.currSongIndex,1);
            }
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
            this.audioRangeVal === 0 ? this.isVoice = true : this.isVoice = false;
        },

        // 设置拖动音量条颜色
        setRangeProgress(){
            this.audioRangeEle.style.backgroundSize = `${this.audioRangeVal}% 100%`;
        },

        // 设置歌曲喜欢
        audioLike(){
            this.isLike = !this.isLike;
            const songData = songInfo.SongPlayData(this.currentPlaySong,this.isLike);
            // 只有喜欢的歌曲才会被添加到db
            if(this.isLike){
                // 存储喜欢的歌曲的信息到db
                this.collectData.insert(songData, (err, newDoc) => {
                    // 设置喜欢的歌曲
                    this.collectList.push(songData);
                    console.log(newDoc)
                })
                // this.collectData.find({}, (err, docs) => { console.log(docs) })
            }else{
                this.removedCollect(songData);
            }
        },

        // 讨厌歌曲
        audioHate(){
            console.log(this.currentPlaySong);
            // 设置讨厌的歌曲
            const songData = songInfo.SongPlayData(this.currentPlaySong,false);
            //标记这首歌曲不喜欢
            this.collectData.insert(songData, (err, newDoc) => {
                this.collectList.push(newDoc)
            });
            this.playNext();//下一首歌
        },

        // 更多
        audioMore(){
            this.isShowCollect = !this.isShowCollect;
            if(this.isShowCollect){

                let type;
                if(this.collectType === 'likes'){
                    type = true;
                }else if(this.collectType === 'hates'){
                    type = false;
                }

                // 默认查询喜欢的,根据添加的时间排序
                this.collectData.find({ isLike: type}).sort({ now: -1 }).exec((err, docs) => {
                    this.collectList = [];
                    docs.forEach(item => this.collectList.push(item));
                });
            }
        },

        // 移除收藏
        removedCollect(item){
            this.collectList = this.collectList.filter(x => x.songid !== item.songid);
            // 删除一条记录
            this.collectData.remove({ songid: item.songid }, {}, (err, numRemoved) => {
              console.log(numRemoved);
            });
        },

        // 切换歌曲
        toggleList(type){
            this.collectType = type;
            this.collectList = [];

            let isLike;
            if(type === 'likes'){
                isLike = true;
            }else if(type === 'hates'){
                isLike = false;
            }

            // 默认查询喜欢的,根据添加的时间排序
            this.collectData.find({ isLike: isLike}).sort({ now: -1 }).exec((err, docs) => {
                this.collectList = [];
                docs.forEach(item => this.collectList.push(item));
            });
        },

        // 监听播放完成
        playEnd(){
            // 监听播放完成 播放下一首
            this.AudioPlayer.addEventListener('ended', this.playNext, false);
        },

        // 返回播放时长
        playTime(){
            this.AudioPlayer.addEventListener("canplay", () => {
                this.songDuration = parseInt(this.AudioPlayer.duration);
            });
        },

        // 播放异常
        playError(){
            // 当播放的歌曲的地址无法识别或者没有权限
            this.AudioPlayer.addEventListener('error', () => {
                this.dialogInfoMsg = '该歌曲暂时无法播放';
                this.$refs.dialogInfoObj.toggle(true);
            })
        },

        // 调整播放进度
        adjustProgress(e){
            //停止播放
            this.endPlay();
            // 获取计算点击位置的进度条百分比值
            const { offsetX } = e;
            const progressTotal = this.$tool.getEelUnit(this.audioParentEle,'width');
            const percentage = (offsetX / progressTotal);

            // 设置播放进度条显示
            this.audioProgressEle.style.width = `${parseFloat(percentage) * 100}%`;
            // 指定播放时间开始播放
            this.AudioPlayer.currentTime = parseInt(percentage * this.AudioPlayer.duration);

            this.AudioPlayer.play();//开始播放音乐
            this.albumStartRotate();//专辑图片开始旋转
            this.isPlay = true;//是否播放状态为播放

            // 拖动进度条显示当前歌词
            let playSongLyric = this.playSongLyric;
            let currPlayTime = parseInt(this.AudioPlayer.currentTime);
            for (let i = 0; i < playSongLyric.length; i++) {
                if(playSongLyric[i].lyricTime <= currPlayTime && currPlayTime <= playSongLyric[i + 1].lyricTime){
                    this.currentLyric = playSongLyric[i].lyric;
                    break;
                }
            }
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
            let minute = parseInt(second / 60);
            if(second % 60 < 10){
                return `${minute}:0${second % 60}`;
            }else{
                return `${minute}:${second % 60}`;
            }
        },

        // 选中播放歌曲
        selectPlaySong(data,event){
            event && event.stopPropagation();
            // this.playSongList = this.collectList;
            // console.log(data,this.collectList,this.playSongList)
            this.isShowCollect ? this.isShowCollect = false : '';

            this.albumEndRotate();//清除专辑图片动画
            this.startPlay('order',data);

            //根据查询的数据重置是否喜欢，需要在播放歌曲之前重新查询这首歌是否被标记成已喜欢
            this.collectData.find({ songmid : data.songmid }, (err,doc) => {
                // console.log(doc);
                if(doc.length !== 0){
                    doc[0].isLike ? this.isLike = true : this.isLike = false;
                }else{
                    this.isLike = false;
                }
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
            let random = Math.ceil(Math.random() * 10);
            this.heroBoxEle.style.transition = '15s';
            this.heroBoxEle.style.background = `radial-gradient(circle farthest-corner at 50% 50%, ${theColor[random][0]}, ${theColor[random][1]} 50%, ${theColor[random][2]})`;

        },


        // canvas 频谱绘制
        canvasDraw(){

            this.drawVisual = requestAnimationFrame(this.canvasDraw);

            this.analyser.getByteFrequencyData(this.dataArray);//获取频域数据

            this.SpectraClass.inTheCircleSpectrum();
        },
    },
    beforeDestroyed(){
        console.log('beforeDestroyed');
        this.endPlay();
        this.AudioPlayer = '';
    },
    destroyed(){
        console.log('destroyed');
        cancelAnimationFrame(this.drawVisual);//清除频谱绘制
        //组件销毁前移除所有事件监听channel
        ipcRenderer.removeAllListeners(['ipcMainSongLyric','message','downloadProgress','updateDownloaded']);
        this.endPlay();
        this.AudioPlayer = '';
    }
}
</script>

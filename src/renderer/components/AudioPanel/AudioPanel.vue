<template lang="html">
    <section class="hero-play-panel">
        <!-- 播放时间 -->
        <div class="hero-play-time">
            <div class="hero-play-time-current">{{transformTime(currPlayTime)}}</div>
            <div class="hero-play-time-total">{{transformTime(songDuration)}}</div>
        </div>
        <!-- 播放进度条 -->
        <div class="hero-play-progress" ref="audioParentEle" @click="adjustProgress($event)">
            <div ref="audioBufferedEle" class="hero-play-progress-buffered"></div>
            <div ref="audioProgressEle" class="hero-play-progress-bar"></div>
        </div>
        <!-- 播放控制 -->
        <div class="hero-play-controls">
            <div class="hero-play-controls-left">
                <!-- 暂停，播放 -->
                <div class="hero-play-controls-playpaused" :class="[isPlay ? 'pused' : 'play']" @click="playPaused" :title="[isPlay ? '暂停' : '播放']"></div>
                <!-- 播放下一首 -->
                <div class="hero-play-controls-playnext" title="下一首" @click="playNext"></div>
                <!-- 禁音 -->
                <div class="hero-play-controls-playvoice" :class="[AudioIsVoice ? 'voice-off' : 'voice-on']" title="禁音" @click="closedSound"></div>
                <!-- 音量大小 -->
                <div class="hero-play-controls-playrange">
                    <input ref="audioRangeEle" class="playrange-input iptrange" type="range" value="0" max="100" min="0" step="1" v-model="audioRangeVal" @input="playRange">
                </div>

            </div>

            <div class="hero-play-controls-right">
                <!-- 喜欢 -->
                <div class="hero-play-controls-like" :class="[AudioIsLike ? 'like' : 'hate']" :title="[AudioIsLike ? '已经喜欢' : '喜欢']" @click="audioLike"></div>
                <!-- 不喜欢 -->
                <div class="hero-play-controls-hate" title="讨厌" @click="audioHate"></div>
                <!-- 其他 -->
                <div class="hero-play-controls-other" title="更多"></div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name:'AudioPanel',
    props:{

    },
    data:() => ({
        currentPlaySong :'',//当前播放音乐对象
        isLike          :false,//是否喜欢这首歌
        isVoice         :false,//是否禁音
        isPlay          :true,//是否播放
        audioBufferedEle:'',//音频缓冲进度条
        audioProgressEle:'',//音频进度条元素
        audioParentEle  :'',//音频进度条父元素

        audioRangeVal   :50,//音轨值
        audioRangeEle   :'',//input音轨元素对象

        albumImgEle     :'',//专辑图片元素对象
        defaultVolume   :0.5,//默认音量值

        playSonglist    :[],//播放列表
        currSongIndex   :0,//当前播放歌曲的下标
        acceptSonglist  :[],//播放完成后存储的列表
        songDuration    :0,//歌曲总时长
        currPlayTime    :0,//当前歌曲播放时间
        albumRotateDeg  :0,//专辑图片旋转度

        timeInterval    :'',//
        albumInterval   :'',//

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
    }),
    created(){
        // this.$tool.setRequestAnimFrame();
    },
    mounted(){

        this.audioProgressEle  = this.$refs.audioProgressEle;
        this.audioBufferedEle  = this.$refs.audioBufferedEle;
        this.audioParentEle    = this.$refs.audioParentEle;

        this.audioRangeEle     = this.$refs.audioRangeEle;
        this.heroBoxEle        = this.$refs.heroBoxEle;

        this.AudioPlayer = new Audio();//创建播放对象

        this.getMusics();//获取音乐列表
        this.playEnd();//监听播放完成
        this.playTime();//获取当前播放时长
        this.setRangeProgress();// 设置拖动条颜色
    },
    methods:{
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
            this.$http({
                url:'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg',
                method:'get',
                params:{
                    g_tk        :'5381',
                    uin         :'0',
                    format      :'json',
                    inCharset   :'utf-8',
                    notice      :'0',
                    platform    :'h5',
                    needNewCode :'1',
                    tpl         :'3',
                    page        :'detail',
                    type        :'top',
                    topid       :'27',
                    _           :new Date().getTime()
                }
            }).then((res)=>{
                let data = res.data;
                let songlist = data.songlist;
                for (var i = 0; i < songlist.length; i++) {
                    let data = songlist[i].data;
                    if(data.songmid){
                        this.playSonglist.push(this.setPlaySongInfo(data));
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
                name        :data.singer[0].name,
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

            /*let id = this.playSonglist[this.currSongIndex].songid;
            let txt="https://music.qq.com/miniportal/static/lyric/"+id%100+"/"+id+".xml";
            let YqlUrl='https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D"'+txt+'"&format=json&diagnostics=true&callback=?'
            this.$.getJSON(YqlUrl,function(data) {
                console.log(data);//获取的xml数据
            });*/

            let songId = this.playSonglist[this.currSongIndex].songid;
            let url = "https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?callback=MusicJsonCallback_lrc&pcachetime=1494070301711&songmid="+songId+"&g_tk=5381&jsonpCallback=MusicJsonCallback_lrc&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8¬ice=0&platform=yqq&needNewCode=0";
            let options = {
                url: url,
                headers: {
                    // "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.110 Safari/537.36",
                    "Accept": "*/*",
                    "Referer": "https://y.qq.com/portal/player.html",
                    "Accept-Language": "zh-CN,zh;q=0.8",
                    "Cookie": "pgv_pvid=8455821612; ts_uid=1596880404; pgv_pvi=9708980224; yq_index=0; pgv_si=s3191448576; pgv_info=ssid=s8059271672; ts_refer=ADTAGmyqq; yq_playdata=s; ts_last=y.qq.com/portal/player.html; yqq_stat=0; yq_playschange=0; player_exist=1; qqmusic_fromtag=66; yplayer_open=1",
                    "Host": "c.y.qq.com",
                }
            };
            this.$request(options,(error, response, body)=>{
                if(!error && response.statusCode == 200){

                    console.log(body);

                }else{
                    console.log("error");
                }
            });




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
            // console.log(this.playSonglist[this.currSongIndex]);
            if(playSong){
                this.currentPlaySong    = this.setPlaySongInfo(playSong);
                this.AudioPlayer.src    = this.currentPlaySong.src;//当前播放歌曲的src
            }else{
                this.currentPlaySong    = this.playSonglist[this.currSongIndex];//当前播放的歌曲详细信息
                // new audio object
                this.AudioPlayer.src    = this.playSonglist[this.currSongIndex].src;//当前播放歌曲的src
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
            // this.getLyric();

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

            //根据查询的数据重置是否喜欢，需要在播放歌曲之前重新查询这首歌是否被标记成已喜欢
            this.tableData.find({songmid:this.currentPlaySong.songmid}, (err,doc) => {
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
            console.log(this.AudioPlayer.muted);
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
            // 只有喜欢的歌曲才会被添加到db
            if(this.isLike){
                let currentPlaySong = this.currentPlaySong;//当前播放的歌曲信息
                let doc = {
                    isLike   : this.isLike,
                    timestamp: this.$tool.getFormDate('format')
                }
                for (let variable in currentPlaySong) {
                    if (currentPlaySong.hasOwnProperty(variable)) {
                        doc[variable] = currentPlaySong[variable];
                    }
                }
                // 存储喜欢的歌曲的信息到db
                this.tableData.insert(doc,(err,newDoc) => {
                    console.log(newDoc);
                })
                this.tableData.find({},(err,docs) => {
                    console.log(docs);
                })
            }
        },

        // 讨厌歌曲
        audioHate(){
            console.log(this.currentPlaySong);
            this.playNext();//下一首歌
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
            // this.albumInterval = requestAnimFrame(this.albumStartRotate);
            // this.albumImgEle.style.transform = `rotate(${this.albumRotateDeg}deg)`;
            // this.albumRotateDeg += .5;
            // if(this.albumRotateDeg > 360){
            //     this.albumRotateDeg = 0;
            // }
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

            this.albumEndRotate();//清除专辑图片动画
            this.startPlay('order',data);

            //根据查询的数据重置是否喜欢，需要在播放歌曲之前重新查询这首歌是否被标记成已喜欢
            this.tableData.find({songmid:data.songmid}, (err,doc) => {
                this.isLike = doc.length != 0 ? true : false;
            })

        },

    }
}
</script>

<style lang="css">
</style>

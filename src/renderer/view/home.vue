<template lang="html">
    <div class="hero-box">
        <div class="hero-gesture">
            <div class="hero-gesture-box">
                <div class="hero-gesture-search">
                    <input class="hero-gesture-search-ipt" type="text" name="" value="" v-model="searchVal" @change="searchMusics">
                </div>
            </div>
            <div class="hero-gesture-closed" @click="closedWindow">x</div>
        </div>
        <div class="hero-logo" aria-hidden="true">
            <div class="hero-logo-circles">
                <img draggable="false" class="hero-logo-circle" src="~@/assets/images/index-portal-red-semi.svg" alt="Index portal red semi">
                <img draggable="false" class="hero-logo-circle" src="~@/assets/images/index-portal-red.svg" alt="Index portal red">
                <img draggable="false" class="hero-logo-circle" src="~@/assets/images/index-portal-orange.svg" alt="Index portal orange semi">
                <img draggable="false" class="hero-logo-circle" src="~@/assets/images/index-portal-orange.svg" alt="Index portal orange">
                <img draggable="false" class="hero-logo-circle" src="~@/assets/images/index-portal-yellow-semi.svg" alt="Index portal yellow semi">
                <img draggable="false" class="hero-logo-circle" src="~@/assets/images/index-portal-yellow.svg" alt="Index portal yellow">
                <img draggable="false" class="hero-logo-circle" src="~@/assets/images/index-portal-green-semi.svg" alt="Index portal green semi">
                <img draggable="false" class="hero-logo-circle" src="~@/assets/images/index-portal-green.svg" alt="Index portal green">
                <img draggable="false" class="hero-logo-circle" src="~@/assets/images/index-portal-blue-semi.svg" alt="Index portal blue semi">
                <img draggable="false" class="hero-logo-circle" src="~@/assets/images/index-portal-blue.svg" alt="Index portal blue">
            </div>
        </div>
        <div class="hero-play-audio">
            <img class="hero-play-audios" ref="albumImgEle" @click="playPaused" draggable="false" :src="currentPlaySong.albumisrc ? currentPlaySong.albumisrc : placeholderImg" alt="">
            <div class="hero-play-album-name">
                {{currentPlaySong.name}}-{{currentPlaySong.songname}}
            </div>

            <!-- <img draggable="false" @click="playPaused" class="hero-play-audios" src="~@/assets/images/index-logo.svg" alt="Index portal blue"> -->
            <audio ref="audioEle"></audio>
        </div>
        {{audioProgressVal}}
        <div class="hero-play-panel">
            <!-- 播放时间 -->
            <div class="hero-play-time">
                <div class="hero-play-time-current">{{transformTime(currPlayTime)}}</div>
                <div class="hero-play-time-total">{{transformTime(songDuration)}}</div>
            </div>
            <!-- 播放进度条 -->
            <div class="hero-play-progress" @click="adjustProgress($event)">
                <div ref="audioProgressEle" class="hero-play-progress-bar"></div>
            </div>
            <br>
            <div class="hero-play-playprogress">
                <input ref="playProgressEle" class="hero-play-playprogress-input iptprogress" type="range" value="" max="100" min="0" step="1" v-model="audioProgressVal" @input="progressRange">
            </div>
            <!-- 播放控制 -->
            <div class="hero-play-controls">
                <!-- 暂停，播放 -->
                <div class="hero-play-controls-playpaused" :class="[isPlay ? 'pused' : 'play']" @click="playPaused" :title="[isPlay ? '暂停' : '播放']"></div>
                <!-- 播放下一首 -->
                <div class="hero-play-controls-playnext" title="下一首" @click="playNext"></div>
                <!-- 禁音 -->
                <div class="hero-play-controls-playvoice" :class="[isVoice ? 'voice-off' : 'voice-on']" title="禁音" @click="closedSound"></div>
                <!-- 音量大小 -->
                <div class="hero-play-controls-playrange">
                    <input ref="audioRangeEle" class="playrange-input iptrange" type="range" value="0" max="100" min="0" step="1" v-model="audioRangeVal" @input="playRange">
                </div>
            </div>
        </div>


    </div>
</template>

<script>
const {ipcRenderer: ipc} = require('electron');
import ogg from '../assets/audios/horse.ogg';
import mp3 from '../assets/audios/ConfessionBallon.mp3';
import placeholderImg from '../assets/person_300.png'
export default {
    name: 'index',
    data: () => ({
        currentPlaySong :'',//当前播放音乐对象
        isVoice         :false,//是否禁音
        isPlay          :true,//是否播放
        placeholderImg  :placeholderImg,//默认专辑图片
        audioProgressEle:'',//音频进度条
        audioProgressVal:0,//音频播放进度值
        playProgressEle :'',//音频播放进度条元素对象
        audioEle        :'',//音频元素对象
        audioRangeVal   :50,//音轨值
        audioRangeEle   :'',//input音轨元素对象

        albumImgEle     :'',//专辑图片元素对象
        defaultVolume   :0.5,//默认音量值
        searchVal       :'',//搜索字段
        playSonglist    :[],//播放列表
        currSongIndex   :0,//当前播放歌曲的下标
        acceptSonglist  :[],//播放完成后存储的列表
        songDuration    :0,//歌曲总时长
        currPlayTime    :0,//当前歌曲播放时间
        transitionTime  :0.2,//进度条过渡时长
        albumRotateDeg  :0,//专辑图片旋转度
        timeInterval    :'',//
        albumInterval   :'',//
    }),
    created(){
        window.requestAnimFrame = (function(){
            return  window.requestAnimationFrame       ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame    ||
                    window.oRequestAnimationFrame      ||
                    window.msRequestAnimationFrame     ||
                    function(/* function */ callback, /* DOMElement */ element){
                        window.setTimeout(callback, 1000 / 60);
                    };
       })();
    },
    mounted(){
        this.audioEle          = this.$refs.audioEle;
        this.albumImgEle       = this.$refs.albumImgEle;
        this.audioProgressEle  = this.$refs.audioProgressEle;
        this.audioRangeEle     = this.$refs.audioRangeEle;
        this.playProgressEle   = this.$refs.playProgressEle;

        // this.audioEle.src      = ogg;
        // this.audioEle.loop = false;
        this.audioEle.play();
        // console.log();
        this.getMusics();//获取音乐列表
        this.playEnd();//监听播放完成
        this.playTime();//获取当前播放时长

        this.setRangeProgress();// 设置拖动条颜色
    },
    computed:{

    },
    methods: {
        // 播放
        playPaused(){
            // this.audioEle.paused ? this.audioEle.play() : this.audioEle.pause();
            if(this.audioEle.paused){
                this.isPlay = true;
                this.audioEle.play();
                this.albumStartRotate();//专辑旋转开始
            }else{
                this.isPlay = false;
                this.audioEle.pause();
                this.albumEndRotate();//专辑旋转暂停
            }
        },

        // 搜索音乐
        searchMusics(){
            this.$http({
                url:'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp',
                method:'get',
                params:{
                    g_tk        :'5381',
                    uin         :'0',
                    format      :'json',
                    inCharset   :'utf-8',
                    outCharset  :'utf-8',
                    notice      :'0',
                    platform    :'h5',
                    needNewCode :'1',
                    w           :this.searchVal,
                    zhidaqu     :'1',
                    catZhida    :'1',
                    t           :'0',
                    flag        :'1',
                    ie          :'utf-8',
                    sem         :'1',
                    aggr        :'0',
                    perpage     :'20',
                    n           :'20',
                    p           :'1',
                    remoteplace :'txt.mqq.all',
                    _           :new Date().getTime()
                }
            }).then((res)=>{
                console.log(res.data);
            })
        },

        // 获取音乐
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
                        this.playSonglist.push({
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
                        });
                    }
                }
                // this.playSonglist.splice(0,0,{src:ogg});
                this.startPlay('random');//开始播放

            })
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
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.110 Safari/537.36",
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

        // 初始化播放设置
        setInitPlay(){

        },
        // 开始播放 type:[order:'顺序播放',random:'随机播放',loop:'循环播放']
        startPlay(type = 'order'){
            // 旋转图片
            this.albumStartRotate();
            // this.transitionTime = 0.5;
            // this.audioTracks.style.transition = `${this.transitionTime}s`;
            // this.$tool.addClass(this.audioTracks,'transition-effect');
            if(type == 'order'){
                this.currSongIndex = 0;
            }else if(type == 'random'){
                // 设置随机播放第一首歌
                this.currSongIndex  = Math.floor(Math.random() * this.playSonglist.length);
            }
            console.log(this.playSonglist[this.currSongIndex]);
            this.currentPlaySong = this.playSonglist[this.currSongIndex];
            this.audioEle.src = this.playSonglist[this.currSongIndex].src;
            // 播放开始
            this.audioEle.play();
            //获取歌词
            this.getLyric();
            // 获取歌曲长度(秒)
            this.songDuration   = this.audioEle.duration;
            // 获取当前播放时间
            this.getPlayCurrentTime();
        },

        // 停止播放
        endPlay(){
            cancelAnimationFrame(this.timeInterval);//清除获取当前播放时间
            this.isPlay = false;//是否播放状态为停止
            this.audioEle.pause();//停止播放
            this.albumEndRotate();//专辑旋转暂停
        },

        // 下一首
        playNext(){
            console.log('next');
            this.acceptSonglist.push(this.playSonglist[0]);
            this.playSonglist.splice(0,1);
            this.startPlay();//开始播放
            this.albumEndRotate();//清除专辑图片动画
        },

        // 开启关闭声音
        closedSound(){
            if(this.isVoice){
                this.audioEle.volume = this.defaultVolume;//开音
                this.isVoice = false;
            }else{
                this.audioEle.volume = 0;//禁音
                this.isVoice = true;
            }
            console.log(this.audioEle.muted);
        },

        // 设置音量大小
        playRange(){
            // 设置拖动条颜色
            this.setRangeProgress();
            // 设置音量大小
            this.audioEle.volume = this.audioRangeVal / 100;
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

        // 监听播放完成
        playEnd(){
            // 监听播放完成
            this.audioEle.addEventListener('ended', () => {
                this.playNext();//播放下一首
            }, false);
        },

        // 获取当前播放时间
        getPlayCurrentTime(){
            // 获取当前播放时间
            this.timeInterval = requestAnimationFrame(this.getPlayCurrentTime);
            // 当前歌曲播放结束
            if(this.currPlayTime >= this.songDuration){
                cancelAnimationFrame(this.timeInterval);
                return;
            }
            this.currPlayTime = parseInt(this.audioEle.currentTime);
            this.audioProgressEle.style.width = `${parseFloat(this.currPlayTime / this.songDuration) * 100}%`;

            // input播放进度条元素
            let ceil = Math.ceil(parseFloat(this.currPlayTime / this.songDuration) * 100);
            this.playProgressEle.style.backgroundSize = `${ceil}% 100%`;
            this.audioProgressVal = ceil;
        },

        // 返回播放时长
        playTime(){
            this.audioEle.addEventListener("canplay", () => {
                this.songDuration = parseInt(this.audioEle.duration);
                // console.log(this.songDuration);
            });
        },

        // 调整播放进度
        adjustProgress(e){
            //停止播放
            this.endPlay();
            // 获取计算点击位置的进度条百分比值
            let {target,offsetX} = e;
            let progressTotal = this.$tool.getEelUnit(target,'width');
            let percentage = (offsetX / progressTotal);
            console.log(percentage,target);
            // 设置播放进度条显示
            this.audioProgressEle.style.width = `${parseFloat(percentage) * 100}%`;
            // 指定播放时间开始播放
            this.audioEle.currentTime = parseInt(percentage * this.audioEle.duration);
            // console.log(percentage * this.audioEle.duration / progressTotal);

            this.audioEle.play();//开始播放音乐
            this.albumStartRotate();//专辑图片开始旋转
            this.getPlayCurrentTime();//重新获取当前播放时间
            this.isPlay = true;//是否播放状态为播放
        },
        progressRange(){
            //停止播放
            this.endPlay();
            // 设置播放进度条显示
            this.playProgressEle.style.backgroundSize = `${this.audioProgressVal}% 100%`;
            // 指定播放时间开始播放
            this.audioEle.currentTime = parseInt(parseFloat((this.audioProgressVal / 100) * this.audioEle.duration));

            // return
            this.audioEle.play();//开始播放音乐
            this.albumStartRotate();//专辑图片开始旋转
            this.getPlayCurrentTime();//重新获取当前播放时间
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

        // 关闭窗口
        closedWindow(){
            console.log(ipc);
            ipc.send('window-close');
        }
    }
}
</script>

<style lang="css">
</style>

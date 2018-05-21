<template lang="html">
    <div class="hero-box">
        <div class="hero-gesture">
            <div class="hero-gesture-box">
                <div class="hero-gesture-search">
                    <input class="hero-gesture-search-ipt" type="text" name="" value="" v-model="searchVal" @change="searchMusics">
                </div>
            </div>
            <div class="hero-gesture-closed">x</div>
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
            {{playSonglist[currSongIndex].name}}
            {{playSonglist[currSongIndex].songname}}
            <!-- <img draggable="false" @click="playPaused" class="hero-play-audios" src="~@/assets/images/index-logo.svg" alt="Index portal blue"> -->
            <audio ref="audio"></audio>
        </div>
        <div class="hero-play-progress">
            <div ref="audioTracks" class="hero-play-progress-bar"></div>
        </div>

    </div>
</template>

<script>
import ogg from '../assets/audios/horse.ogg';
import mp3 from '../assets/audios/ConfessionBallon.mp3';
export default {
    name: 'index',
    data: () => ({
        audioTracks     :'',//audio音轨
        audio           :'',//audio对象
        searchVal       :'',//搜索字段
        playSonglist    :[],//播放列表
        currSongIndex   :0,//当前播放歌曲的下标
        acceptSonglist  :[],//播放完成后存储的列表
        songDuration    :0,//歌曲总时长
        currPlayTime    :0,//当前歌曲播放时间
        transitionTime  :0.2,//进度条过渡时长
        interval        :'',//
    }),
    created(){

    },
    mounted(){
        this.audio          = this.$refs.audio;
        this.audioTracks    = this.$refs.audioTracks;
        this.audio.src      = ogg;
        // this.audio.loop = false;
        this.audio.play();
        // console.log();
        this.getMusics();//获取音乐列表
        this.playEnd();//监听播放完成
        this.playTime();//获取当前播放时长
    },
    methods: {
        playPaused(){
            // 暂停播放
            this.audio.paused ? this.audio.play() : this.audio.pause();
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
                    topid       :'36',
                    _           :new Date().getTime()
                }
            }).then((res)=>{
                let data = res.data;
                let songlist = data.songlist;
                for (var i = 0; i < songlist.length; i++) {
                    let data = songlist[i].data;
                    if(data.songmid){
                        let url = 'http://ws.stream.qqmusic.qq.com/C100' + data.songmid + '.m4a?fromtag=0&guid=126548448'
                        this.playSonglist.push({
                            src     :url,
                            name    :data.singer[0].name,
                            songname:data.songname,
                            songorig:data.songorig,
                        });
                    }
                }
                this.playSonglist.splice(0,0,{src:ogg});
                this.startPlay();
            })
        },
        // 开始播放
        startPlay(){
            // this.transitionTime = 0.5;
            // this.audioTracks.style.transition = `${this.transitionTime}s`;
            // this.$tool.addClass(this.audioTracks,'transition-effect');
            // 设置随机播放第一首歌
            this.currSongIndex = Math.floor(Math.random() * this.playSonglist.length);
            this.audio.src = this.playSonglist[this.currSongIndex].src;
            this.audio.play();
            // 获取歌曲长度(秒)
            this.songDuration = this.audio.duration;
            // 获取当前播放时间
            this.interval = setInterval(() => {
                // 当前歌曲播放结束
                if(this.currPlayTime >= this.songDuration){
                    // this.transitionTime = 0;
                    // this.audioTracks.style.transition = `${this.transitionTime}s`;
                    // this.$tool.removeClass(this.audioTracks,'transition-effect');
                    clearInterval(this.interval);
                    return;
                }
                this.currPlayTime = parseInt(this.audio.currentTime);
                this.audioTracks.style.width = `${parseFloat(this.currPlayTime / this.songDuration) * 100}%`
                // console.log(this.currPlayTime);
                // console.log(parseFloat(this.currPlayTime / this.songDuration)* 100);
            }, 50);
        },
        // 监听播放完成
        playEnd(){
            // 监听播放完成
            this.audio.addEventListener('ended', () => {
                console.log(1);
                this.acceptSonglist.push(this.playSonglist[0]);
                this.playSonglist.splice(0,1);
                this.startPlay();
            }, false);
        },
        // 返回播放时长
        playTime(){
            this.audio.addEventListener("canplay", () => {
                this.songDuration = parseInt(this.audio.duration);
                // console.log(this.songDuration);
            });
        }
    }
}
</script>

<style lang="css">
</style>

<template lang="html">
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
        <div class="hero-play-audio">
            <img draggable="false" @click="playPaused" class="hero-play-audios" src="~@/assets/images/index-logo.svg" alt="Index portal blue">
            <audio ref="audio" autoplay></audio>
        </div>
    </div>
</template>

<script>
import mp3 from '../assets/audios/ConfessionBallon.mp3'
export default {
    name: 'index',
    data: () => ({
        audio:''
    }),
    created(){
        this.getMusics();
    },
    mounted(){
        // this.$refs.audio.src = mp3;
        // this.audio = this.$refs.audio;
    },
    methods: {
        playPaused(){
            // 暂停播放
            this.audio.paused ? this.audio.play() : this.audio.pause();
        },
        // 获取网易云推荐音乐
        getMusics(){
            this.$http({
                url:'http://music.163.com/api/playlist/detail?id=37880978&updateTime=-1',
                method:'get'
            }).then((res)=>{
                console.log(res);
            })
        }
    }
}
</script>

<style lang="css">
</style>

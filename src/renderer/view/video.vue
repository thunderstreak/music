<template lang="html">
    <section class="video">
        <SwitchRouter/>
        <video ref="VideoPlayer" width="100%" height="90%" controls :src="url">
            <!--<source :src="url">-->
        </video>
        <a @click="videoPlay">videoPlay</a>
    </section>
</template>

<script>
import { ipcRenderer, remote } from 'electron';
export default {
    name:'VideoPlayer',
    data:() => ({
        msg             :'video',
        VideoPlayer     :'',
        VideoPlayData   :{},
        url:'',
    }),
    created(){

    },
    mounted(){
        this.VideoPlayer = this.$refs.VideoPlayer;

        this.$http({
            url:'https://www.amemv.com/aweme/v1/hot_aweme/',
            method:'get',
            params:{
                app_id:1128,
                cursor:0,
                count:36,//总条数
                parent_rid:20181106161808010019026137515696,
                aweme_id:6610162367248469256,
                _signature:'hEqqaRAb37kuZerpgRTJsIRKqn',
                whale_id:6610162367248469256
            }
        }).then((res) => {
            let {aweme_list,status_code} = res.data;
            if(status_code === 0){
                console.log(aweme_list[0].video.play_addr.url_list[0]);
                this.url = 'http://baobab.kaiyanapp.com/api/v1/playUrl?vid=134185&resourceType=video&editionType=default&source=aliyun'//aweme_list[0].video.play_addr.url_list[0];
            }
        })
        // ipcRenderer.send('ipcRendererVideoSearch', 'test');
    },
    methods:{
        videoPlay(){
            console.log(this.VideoPlayer);
            if(this.VideoPlayer.paused){
                this.VideoPlayer.play();
            }else{
                this.VideoPlayer.pause();
            }
        }
    }
}
</script>

<style lang="css">
</style>

<template lang="html">
    <section class="video">
        <SwitchRouter></SwitchRouter>
        <video ref="VideoPlayer" width="100%" height="90%" controls>
            <source src="https://he.yinyuetai.com/uploads/videos/common/F5610161FFB64B9CB0545C5820F0DEB6.mp4" type="video/mp4">
        </video>
        <a @click="videoPlay">videoPlay</a>
    </section>
</template>

<script>
export default {
    name:'VideoPlayer',
    data:() => ({
        msg             :'video',
        VideoPlayer     :'',
        VideoPlayData   :{},
    }),
    created(){

    },
    mounted(){
        this.VideoPlayer = this.$refs.VideoPlayer;
        this.$http({
            url:'https://api.lylares.com/video/douying/?AppKey=5H32CWt7DN&url=https://www.iesdouyin.com/share/video/6554697305885248772/?region=CN&mid=6554697434880314115&titleType=title&timestamp=1527831736&utm_campaign=client_share&app=aweme&utm_medium=ios&tt_from=copy&iid=32440919477&utm_source=copy',
            method:'get'
        }).then((res) => {
            console.log(res.data.url);
            // this.VideoPlayData.src = res.data.url;
            // this.VideoPlayer.src = res.data.url;
        })
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

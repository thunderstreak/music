<template lang="html">
    <section class="hero-gesture">
        <div class="hero-gesture-logo" title="SongPlay"></div>
        <!-- 手势区域 -->
        <div class="hero-gesture-box">
            <div class="hero-gesture-search">
                <input class="hero-gesture-search-ipt" type="text" name="" value="" v-model="searchVal"
                       :class="[isShowList ? 'border-ipt' : '']"
                       @change.stop="searchMusics('change')"
                       @blur.stop="searchMusics('blur')"
                       @input.stop="searchMusics('input')"
                       @focus.stop="searchMusics('focus')"
                       placeholder="搜索MV">
                <transition name="slide-fade">
                    <ul class="hero-gesture-search-res" v-show="isShowList">
                        <li class="res-list" v-for="item in searchList" @click.stop="selectPlaySong(item)">
                            {{`${item.singername} - ${item.mvdesc}`}}
                        </li>
                    </ul>
                </transition>
            </div>
        </div>
        <div class="hero-gesture-hide hero-gesture-base" @click.stop="operatorWindow('min')" title="隐藏"></div>
        <div class="hero-gesture-closed hero-gesture-base" @click.stop="operatorWindow('close')" title="关闭"></div>
    </section>
</template>

<script>
export default {
    name:'VideoHeader',
    data:()=>({
        searchVal       :'',//搜索字段
        searchList      :[],//查询到歌曲的结果列表
        isShowList      :false,//是否显示播放列表
        isHttp          :false,
        timeout         :'',
        mvData          :'',//所有本地歌曲列表
    }),
    created(){
        // 初始化本地歌曲列表
        this.mvData = this.$db.mvData;
        this.searchMusics = this.$tool.debounce(this.searchMusics,1000);
        this.$API.qq.qqMusicMvListAPI().then(res => {
            this.searchList.push(...res)
        })
    },
    mounted(){

    },
    methods:{
        // API
        searchApi(){
            this.$API.qq.qqMusicMvInfoAPI(this.searchVal).then((res)=>{
                console.log(res)
                this.isHttp = false;
            }).catch(() => {
                this.isHttp = false;
            })
        },
        // 搜索音乐
        searchMusics(eventType){
            console.log(eventType);

            switch (eventType) {
                case 'blur':
                    this.isShowList = false;
                    return false;
                case 'focus':
                    if(this.searchList.length){
                        this.isShowList = true;
                    }
                    return false;
                case 'input':
                    this.searchApi();
                    return false;
                case 'change':
                    this.searchApi();
                    return false;
                default:
                    return false;
            }
        },

        // 选中播放歌曲
        selectPlaySong(data){
            this.searchVal = `${data.singername} - ${data.mvdesc}`;
            this.isShowList = false;//隐藏搜索列表
            this.$emit('VideoHeaderSelectPlay', data);//通知父组件播放歌曲
        },

        // 操作窗口
        operatorWindow(type){
            if (window.__TAURI_INTERNALS__) {
                if (type === 'min') {
                    window.__TAURI_INTERNALS__.invoke('plugin:window|minimize');
                } else if (type === 'close') {
                    window.__TAURI_INTERNALS__.invoke('plugin:window|hide');
                }
            }
        }
    }
}
</script>

<style lang="css">
.slide-fade-enter-active{
    transition: all .25s ease;
}
.slide-fade-leave-active{
    transition: all .25s;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
    /*transform:scaleX(0.5);*/
    transform: translateY(10px);
    opacity: 0;
}
</style>

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
                       placeholder="搜索歌曲/歌手">
                <transition name="slide-fade">
                    <ul class="hero-gesture-search-res" v-show="isShowList">
                        <li class="res-list" v-for="item in searchList" @click.stop="selectPlaySong(item)">
                            {{item.singer.length !== 0 ? item.singer[0].name : item.singername}}-{{item.songname}}
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
import { ipcRenderer, remote } from 'electron';
export default {
    name:'AudioHeader',
    data:()=>({
        msg             :'AudioHeader',
        searchVal       :'',//搜索字段
        searchList      :[],//查询到歌曲的结果列表
        isShowList      :false,//是否显示播放列表
        isHttp          :false,
        timeout         :'',
        songData        :'',//所有本地歌曲列表
    }),
    created(){
        // 初始化本地歌曲列表
        this.songData = this.$db.songData;
        this.searchMusics = this.$tool.debounce(this.searchMusics,500);
    },
    mounted(){

    },
    methods:{
        // API
        searchApi(){
            // 查询本地歌曲列表数据
            /*let reg = new RegExp(this.searchVal);
            this.songData.find({'$or':[{'singername':{$regex:reg}},{'songname':{$regex:reg}}]},(err,doc) => {
                console.log(doc);
                if(doc.length !== 0){
                    this.isHttp     = false;
                    this.searchList = doc;
                    this.isShowList = true;//显示搜索结果列表
                } else {
                    this.isHttp     = true;
                    this.searchList = [];
                    this.isShowList = false;//显示搜索结果列表
                }
            });*/
            this.$API.qq.qqMusicSearchAPI(this.searchVal).then((res)=>{
                const { data: { song }, code } = res.data;
                if(code === 0){
                    this.searchList = song.list;
                    console.log(this.searchList);
                    this.isHttp     = false;
                    if(song.list.length !== 0){
                        this.isShowList = true;//显示搜索结果列表
                    }
                }
            }).catch(() => {
                this.isHttp     = false;
            })
        },
        searchSong(){
            // 向主进程发送搜索歌曲请求事件
            ipcRenderer.send('ipcRendererSongSearch', this.searchVal);
        },
        // 搜索音乐
        searchMusics(eventType){
            console.log(eventType);
            if(this.searchVal === ''){
                this.isShowList = false;
                return
            }

            switch (eventType) {
                case 'blur':
                    this.isShowList = false;
                    return;
                case 'focus':
                    if(this.searchList.length){
                        this.isShowList = true;
                    }
                    return;
                case 'input':
                    this.searchApi();
                    return;
                case 'change':
                    this.searchApi();
                    return;
                default:
                    return;
            }
        },

        // 选中播放歌曲
        selectPlaySong(data){
            this.searchVal = `${data.singer[0].name}-${data.songname}`;
            this.isShowList = false;//隐藏搜索列表
            this.$emit('AudioHeaderSelectPlaySong',data);//通知父组件播放歌曲
        },

        // 操作窗口
        operatorWindow(type){
            ipcRenderer.send(`window-${type}`);
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

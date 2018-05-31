<template lang="html">
    <section class="hero-gesture">
        <div class="hero-gesture-logo" title="SongPlay"></div>
        <!-- 手势区域 -->
        <div class="hero-gesture-box">
            <div class="hero-gesture-search">
                <input class="hero-gesture-search-ipt" :class="[isShowList ? 'border-ipt' : '']" type="text" name="" value="" v-model="searchVal" @change="searchMusics('change')"  @blur="searchMusics('blur')" placeholder="搜索歌曲/歌手">
                <transition name="slide-fade">
                    <ul class="hero-gesture-search-res" v-show="isShowList">
                        <li class="res-list" v-for="item in searchList" @click="selectPlaySong(item)">
                            {{item.singer[0].name}}-{{item.songname}}
                        </li>
                    </ul>
                </transition>
            </div>
        </div>
        <div class="hero-gesture-hide hero-gesture-base" @click="operantWindow('hide')" title="隐藏"></div>
        <div class="hero-gesture-closed hero-gesture-base" @click="operantWindow('closed')" title="关闭"></div>
    </section>
</template>

<script>
import { ipcRenderer } from 'electron';
export default {
    name:'AudioHeader',
    data:()=>({
        msg             :'AudioHeader',
        searchVal       :'',//搜索字段
        searchList      :[],//查询到歌曲的结果列表
        isShowList      :false,//是否显示播放列表
    }),
    created(){

    },
    mounted(){

    },
    methods:{
        // 搜索音乐
        searchMusics(eventType){
            if(eventType == 'blur'){
                setTimeout(()=>{
                    this.isShowList = false;
                },250);
                return
            }

            this.$API.qq.qqMusicSearchAPI(this.searchVal).then((res)=>{
                let data        = res.data.data;
                this.searchList = data.song.list;
                this.isShowList = true;//显示搜索结果列表
            })
        },

        // 选中播放歌曲
        selectPlaySong(data){
            console.log(data);
            this.searchVal = `${data.singer[0].name}-${data.songname}`;
            this.isShowList = false;//隐藏搜索列表

            this.$emit('AduioHeaderSelectPlaySong',data);//通知父组件播放歌曲
        },

        // 操作窗口
        operantWindow(type){
            if(type == 'hide'){
                ipcRenderer.send('window-min');
            }else if(type == 'closed'){
                ipcRenderer.send('window-close');
            }
        }
    }
}
</script>

<style lang="css">
</style>

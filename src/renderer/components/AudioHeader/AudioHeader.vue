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
                       placeholder="搜索歌曲/歌手">
                <transition name="slide-fade">
                    <ul class="hero-gesture-search-res" v-show="isShowList">
                        <li class="res-list" v-for="item in searchList" @click.stop="selectPlaySong(item)">
                            {{item.singer.length !== 0 ? item.singer[0].name : item.singername}}-{{item.songname}}
                            <!--{{item.fsinger}}-{{item.fsong}}-->
                        </li>
                    </ul>
                </transition>
            </div>
        </div>
        <div class="hero-gesture-hide hero-gesture-base" @click.stop="operantWindow('hide')" title="隐藏"></div>
        <div class="hero-gesture-closed hero-gesture-base" @click.stop="operantWindow('closed')" title="关闭"></div>
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
                let { data, code } = res.data;
                if(code === 0){
                    this.searchList = data.song.list;
                    console.log(this.searchList);
                    this.isHttp     = false;
                    if(data.song.list.length !== 0){
                        this.isShowList = true;//显示搜索结果列表
                    }
                }
            }).catch(res => {
                this.isHttp     = false;
            })
        },
        serachSong(){
            // 向主进程发送搜索歌曲请求事件
            ipcRenderer.send('ipcRendererSongSearch', this.searchVal);
        },
        // 搜索音乐
        searchMusics(eventType){
            console.log(eventType);
            if(eventType === 'blur'){
                setTimeout(()=>{
                    this.isShowList = false;
                },200);

                if(this.searchVal === ''){
                    return
                }

                return false;
            }else if(eventType === 'input'){
                if(this.searchVal === ''){
                    return
                }
                // this.$tool.debounce(this.searchApi(),500);
                this.searchApi();
            }else if(eventType === 'change'){
                if(this.searchVal === ''){
                    this.isShowList = false;
                    return
                }
                this.searchApi();//搜索
            }

        },

        // 选中播放歌曲
        selectPlaySong(data){
            // console.log(data);
            this.searchVal = `${data.singer[0].name}-${data.songname}`;
            // this.searchVal  = `${data.fsinger}-${data.fsong}`;
            this.isShowList = false;//隐藏搜索列表
            // data.songmid    = data.singerid;
            // data.singername = data.fsinger;
            // data.pay = {};
            // data.pay.payplay = 0;
            this.$emit('AduioHeaderSelectPlaySong',data);//通知父组件播放歌曲
        },

        // 操作窗口
        operantWindow(type){
            if(type === 'hide'){
                ipcRenderer.send('window-min');
            }else if(type === 'closed'){
                ipcRenderer.send('window-close');
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
    transition: all .20s ease;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
    transform:scaleX(0.5);
    /*transform: translateY(10px);*/
    opacity: 0;
}
</style>

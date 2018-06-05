<template lang="html">
    <transition name="DialogLayer-fade">
        <div class="DialogLayer" v-if="!isshow">

            <div class="DialogLayer-box">

                <div class="" v-if="type == 'alert'">
                    <h2 class="DialogLayer-tit">{{title}}</h2>
                    <p class="DialogLayer-content">{{message}}</p>
                </div>

                <div class="" v-if="type == 'toast' || type == 'msg'">
                    <p class="DialogLayer-content toast" :class="[type == 'msg' ? 'msg' : '']">{{message}}</p>
                </div>

                <div class="" v-if="type == 'confirm'">
                    <h2 class="DialogLayer-tit">{{title}}</h2>
                    <p class="DialogLayer-content">
                        <input v-focus="type" ref='ipt' type="text" v-model='ipt' name="" value="">
                    </p>
                </div>

                <div class="DialogLayer-btn" v-if="type != 'toast' && type != 'msg'">
                    <span v-if="leftbtn" class="DialogLayer-close" @click='DialogLayerClose'>{{leftbtn ? leftbtn : '取消'}}</span>
                    <span v-if="rightbtn" class="DialogLayer-enter" @click='DialogLayerEnter'>{{rightbtn ? rightbtn : '确定'}}</span>
                </div>

                <div class="DialogLayer-btn" v-if="type == 'msg'">
                    <span class="DialogLayer-close" @click='DialogLayerClose'>{{leftbtn ? leftbtn : '取消'}}</span>
                    <span class="DialogLayer-msg" @click="DialogLayerEnter">确定</span>
                </div>

            </div>

        </div>
    </transition>
</template>

<script>
export default {
    data() {
        return {
            type    : String,
            title   : String,
            message : String,
            callback: null,
            isshow  : Boolean,
            ipt     : null,
            leftbtn : String,
            rightbtn: String,
        }
    },
    mounted() {

    },
    created() {

    },
    methods   : {
        // 关闭按钮
        DialogLayerClose() {
            this.isshow = true;
            this.callback(false);
        },
        // 确定按钮
        DialogLayerEnter() {
            this.isshow = true;
            if (this.type == 'confirm') {
                this.callback(this.ipt);
            } else {
                this.callback(true);
            }
        },

    },
    directives: {
        focus: {
            inserted: (el, binding) => {
                el.focus();
            }
        }
    }
}
</script>

<style>
/*对话框组件过渡效果*/
.DialogLayer-fade-enter-active, .DialogLayer-fade-leave-active {
    transition: .15s;
}
.DialogLayer-fade-enter, .DialogLayer-fade-leave-to {
    opacity: 0;
}
</style>

<template lang="html">
    <transition name="dialogLayer-fade">
        <div class="dialogLayer" v-if="!isshow">

            <div class="dialogLayer-box">

                <div class="" v-if="type === 'alert'">
                    <h2 class="dialogLayer-tit">{{title}}</h2>
                    <p class="dialogLayer-content">{{message}}</p>
                </div>

                <div class="" v-if="type === 'toast' || type === 'msg'">
                    <p class="dialogLayer-content toast" :class="[type === 'msg' ? 'msg' : '']">{{message}}</p>
                </div>

                <div class="" v-if="type === 'confirm'">
                    <h2 class="dialogLayer-tit">{{title}}</h2>
                    <p class="dialogLayer-content">
                        <input v-focus="type" ref='ipt' type="text" v-model='ipt' name="" value="">
                    </p>
                </div>

                <div class="dialogLayer-btn" v-if="type !== 'toast' && type !== 'msg'">
                    <span v-if="leftbtn" class="dialogLayer-close" @click='dialogLayerClose'>{{leftbtn ? leftbtn : '取消'}}</span>
                    <span v-if="rightbtn" class="dialogLayer-enter" @click='dialogLayerEnter'>{{rightbtn ? rightbtn : '确定'}}</span>
                </div>

                <div class="dialogLayer-btn" v-if="type === 'msg'">
                    <span class="dialogLayer-close" @click='dialogLayerClose'>{{leftbtn ? leftbtn : '取消'}}</span>
                    <span class="dialogLayer-msg" @click="dialogLayerEnter">确定</span>
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
        dialogLayerClose() {
            this.isshow = true;
            this.callback(false);
        },
        // 确定按钮
        dialogLayerEnter() {
            this.isshow = true;
            if (this.type === 'confirm') {
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
.dialogLayer-fade-enter-active, .dialogLayer-fade-leave-active {
    transition: .15s;
}
.dialogLayer-fade-enter, .dialogLayer-fade-leave-to {
    opacity: 0;
}
</style>

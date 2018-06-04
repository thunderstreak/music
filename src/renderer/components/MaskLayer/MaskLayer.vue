<template lang="html">
    <transition name="MaskLayer-fade" v-if="show">
        <div :class="{'MaskLayer': show}" @click.stop.prevent="closed">
            <slot>
                <span>没有内容</span>
            </slot>
        </div>
    </transition>
</template>

<script>
export default {
    name:'MaskLayer',
    data:()=>({
        msg:'MaskLayer',
        show:false
    }),
    created(){
        // console.log(this.isShow);
    },
    methods:{
        open(){
            this.show = true;
        },
        close(){
            this.show = false;
        },
        toggle(flag){
            this.show = flag;
        },
        closed(e){
            // console.log(e.target.className);
            if(e.target.className.indexOf('MaskLayer') != -1){
                this.toggle(false);
                this.$emit('AcceptResultShow',false);
            }
        }
    }
}
</script>

<style lang="css">
.MaskLayer{
    width: 100%;
    height:100%;
    top: 0;
    left: 0;
    z-index: 9;
    background: rgba(0,0,0,.5);
    position: fixed;
    transition: .25s;
}
.MaskLayer-fade-enter-active, .MaskLayer-fade-leave-active {
    transition: .25s;
}
.MaskLayer-fade-enter, .MaskLayer-fade-leave-to {
    opacity: 0;
}
</style>

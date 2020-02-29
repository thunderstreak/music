<template lang="html">
    <section class="switch-router">
        <div class="switch-router-left" @click="switchRouter('audio')"></div>
        <div class="switch-router-right" @click="switchRouter('video')"></div>
    </section>
</template>

<script>
export default {
    name:'SwitchRouter',
    data:() => ({
        msg:'SwitchRouter',
        routerName:'audio'
    }),
    created(){
    },
    methods:{
        switchRouter(type){
            console.log(this.$route.name);
            this.routerName = this.$route.name;
            this.$router.push({name:type});
        }
    },
}
</script>

<style lang="css">
</style>

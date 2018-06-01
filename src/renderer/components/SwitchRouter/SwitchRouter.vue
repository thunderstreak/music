<template lang="html">
    <section class="switch-router">
        <div class="switch-router-left" @click="SwitchRouter('audio')"></div>
        <div class="switch-router-right" @click="SwitchRouter('video')"></div>
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
        SwitchRouter(type){
            console.log(this.$route.name);
            this.routerName = this.$route.name;
            this.$router.push({name:type});
        }
    },
}
</script>

<style lang="css">
</style>

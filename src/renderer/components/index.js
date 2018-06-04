import Vue from 'vue';

import AudioHeader from './AudioHeader/AudioHeader';//音频头部
import AudioPanel from './AudioPanel/AudioPanel';//音频控制面板
import SwitchRouter from './SwitchRouter/SwitchRouter';//路由切换

const components = [
    AudioHeader,
    AudioPanel,
    SwitchRouter,
];

// 注册全局组件
components.map(component => {
    Vue.component(component.name, component);
});

// 注册全局方法
// Vue.$dialog = Vue.prototype.$dialog = DialogLayer;
// Vue.$indexList = Vue.prototype.$indexList = IndexList;

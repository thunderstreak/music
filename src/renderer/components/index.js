import Vue from 'vue';

import AudioHeader  from './AudioHeader/AudioHeader';//音频头部
import AudioPanel   from './AudioPanel/AudioPanel';//音频控制面板
import SwitchRouter from './SwitchRouter/SwitchRouter';//路由切换
import MaskLayer    from './MaskLayer/MaskLayer';//弹出层
import DialogLayer  from './DialogLayer/DialogLayer';//对话框

const components = [
    AudioHeader,
    AudioPanel,
    SwitchRouter,
    MaskLayer,
];

// 注册全局组件
components.map(component => {
    Vue.component(component.name, component);
});

// 注册全局方法
Vue.$dialog = Vue.prototype.$dialog = DialogLayer;

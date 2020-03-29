import Vue from 'vue';
import dialogComponent from './DialogLayer.vue';

// vue构造函数
const dialog = Vue.extend(dialogComponent);

// 创建组件容器
const component = new dialog({
    el : document.createElement('div')
});

const doc = document.body;

const copyParams = (params) => {
    for(let key in params){
        if(params.hasOwnProperty(key)) {
            component[key] = params[key];
        }
    }
    doc.appendChild(component.$el);
};

class Dialog {
    alert(params) {
        component.isshow = false;
        component.type = 'alert';

        copyParams(params)
    }
    msg(params) {
        component.isshow = false;
        component.type = 'msg';

        copyParams(params)
    }
    toast(params) {
        component.isshow = false;
        component.type = 'toast';

        copyParams(params);

        setTimeout(()=>{
            component.isshow = true;
        },2000)
    }
    confirm(params) {
        component.isshow = false;
        component.type = 'confirm';
        component.ipt = null;

        copyParams(params);
    }
}

export default new Dialog()

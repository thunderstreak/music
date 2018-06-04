const libs={
    /**
    *数组去重
    *适用[string,number]类型
    *ES6 版 :Array.from(new Set(array));
    */
    unique:(arr) => {
        let res = [];
        let json = {};
        for(let i = 0;i < arr.length;i++){
            if(!json[arr[i]]){
                res.push(arr[i]);
                json[arr[i]] = true;
            }
        }
        return res;
    },
    unique2:(arr) => {
        let [tempObj,newArray] = [{},[]];

        for(let i = 0;i < arr.length;i++){
            if(!tempObj[arr[i]]){
                tempObj[arr[i]] = arr[i];
                newArray.push(arr[i]);
            }
        }
        return newArray;
    },

    /**
    *冒泡排序
    *@param:arr(Array)
    */

    dobbleSort:(arr) => {
        for(let i = 0;i < arr.length-1;i++){
            for(let j = 0;j < arr.length-i-1;j++){
                if(arr[j] > arr[j+1]){
                    var temporary = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = temporary;
                }
            }
        }
    },

    /**
    *快速排序
    *@param:arr(Array)
    */

    quickSort:function(arr) {

        if(arr.length <= 1){return arr;}
        let pivotIdx = Math.floor(arr.length / 2);
        let pivot = arr.splice(pivotIdx,1)[0];

        let [left,right] = [[],[]]

        for(let i = 0;i < arr.length;i++){
            if(arr[i] < pivot){
                left.push(arr[i]);
            }else{
                right.push(arr[i]);
            }
        }
        return this.quickSort(left).concat([pivot],this.quickSort(right));
    },

    /**
    *插入排序
    *@param:arr(Array)
    */

    insertSort:(arr) => {
        let j,step,key;
        for(let i = 0;i < arr.length;i++){
            step = j = i;
            key = arr[j];
            while(--j > -1){
                if(arr[j] > key){
                    arr[j+1] = arr[j];
                }else{
                    break;
                }
            }
            arr[j+1] = key;
        }
        return arr;
    },

    /**
    *二分查找
    *@param:data(Array)
    *@param:item(Number)
    */

    binarySearch:(data,item) => {
        let len = data.length - 1;
        let bes = 0;
        while(bes <= len){
            let m = Math.floor((len + bes) / 2);
            if(data[m] == item){
                return m;
            }
            if(item > data[m]){
                bes = m + 1;
            }else{
                len = m - 1;
            }
        }
        return false;
    },

    /**
    *对象或数组类型深拷贝
    *@param:arg(Array or Object)
    *Array.isArray(target):只有IE9以上标准模式下的浏览器支持。
    */

    clone:(arg) => {
        let o = (arg.constructor === Array && arg instanceof Array && Object.prototype.toString.call((arg)) == '[object Array]' ) ? [] : {};
        for(let e in arg){
            o[e] = arg.typeof === 'object' ? arg.clone() : arg[e];
        }
        return o;
    },

    /**
    *圆弧进度条
    *@param:canvasParentEle(String:eleID) canvas外层div的ID
    *@param:canvasSelf(String:eleID) canvas的ID
    *@param:isTrueOrFalse(boolean) true为圆弧进度条，false为整园进度条
    *@param:progrColor(String) 绘制进度圆的颜色值
    *进度条的值设置在canvas的data-progress上，值区间0~100
    */

    drawCricle:(canvasParentEle,canvasSelf,isTrueOrFalse,progrColor)=>{

        if(!canvasParentEle && !canvasSelf && !isTrueOrFalse){
            console.error('arguments not meeting expectations');
            return
        };

        let canvasParent = document.getElementById(canvasParentEle);
        let canvas = document.getElementById(canvasSelf);
        let dataPorgress = Number(canvas.dataset.progress);
        // 字符串'%'替换处理
        if(isNaN(dataPorgress)){
            dataPorgress = Number(canvas.dataset.progress.replace('%',''));
        }

        let porgress = isTrueOrFalse ? 1.4*(dataPorgress)/100 : 2*(dataPorgress)/100;
        let CanvasWidth = (window.getComputedStyle(canvasParent).getPropertyValue('width')).replace(/px/g,'');
        let CanvasHeight = (window.getComputedStyle(canvasParent).getPropertyValue('height')).replace(/px/g,'');

        canvas.width = CanvasWidth*2;
        canvas.height = CanvasHeight*2;
        // canvas.style.width为canvas.width的一半用于避免绘制后出现模糊不清晰
        canvas.style.width = canvas.width/2+'px';
        canvas.style.height = canvas.height/2+'px';

        let res;// 绘制百分比所需的半径
        let lineWidth = CanvasWidth/12.5;// 绘制圆弧线宽
        let setData={
            x:canvas.width/2,
            y:canvas.height/2,
            r:(canvas.width-lineWidth-2)/2// 减2控制绘制的圆弧与canvas的边界紧密贴合，防止出现canvas边界出现模糊
        }

        let ctx = canvas.getContext('2d');
            ctx.lineCap="round";
            // 绘制底圆
            ctx.beginPath();
            if(isTrueOrFalse==true){
                ctx.arc(
                    setData.x,
                    setData.y,
                    setData.r,
                    0.8*Math.PI,//开始角
                    2.2*Math.PI,//结束角
                    false//False = 顺时针，true = 逆时针。
                );//绘制圆弧进度条所需的半径总共1.5PI
            }else if(isTrueOrFalse==false){
                ctx.arc(
                    setData.x,
                    setData.y,
                    setData.r,
                    0*Math.PI,//开始角
                    2*Math.PI,//结束角
                    false//False = 顺时针，true = 逆时针。
                );//绘制圆弧进度条所需的半径总共1.5PI
            }
            ctx.strokeStyle = '#e6e6e6';
            ctx.lineWidth = isTrueOrFalse ? lineWidth : lineWidth/3;
            ctx.stroke();
            ctx.closePath();

            if(porgress>100 || porgress==0){return}
            // 绘制进度圆
            ctx.beginPath();
            ctx.arc(
                setData.x,
                setData.y,
                setData.r,
                0.8*Math.PI,//开始角
                (0.8+porgress)*Math.PI,//结束角
                false
            );
            ctx.strokeStyle = progrColor || '#ff9331';
            ctx.lineWidth = lineWidth;
            ctx.stroke();
            ctx.closePath();
    },

    /**
    *@param:promise(Promise) promise对象
    *@param:type(String) 'json' 返回json格式
    *返回一个promise对象,可以使用.then来处理response参数
    */

    Fetch:(promise,type)=>{
        if(!promise && typeof promise !== 'object' && JSON.stringify(promise) != '{}') return 'arguments error!';
        return new Promise((resolve,reject) => {
            fetch(promise).then((response) => {
                if(response.status == 200){
                    // console.log(response.headers.get('Content-Type'));
                    // console.log(response.headers.get('Date'));
                    // resolve(response.json());
                    (type && type == 'json') ? resolve(response.json()) : resolve(response);
                }else{
                    reject(response);
                }
            }).catch((err) => {console.log(err);})
        })
    },

    /**
    *移动端手势判断
    *根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
    *@param:startX(Number) 开始坐标X轴
    *@param:startY(Number) 开始坐标Y轴
    *@param:endX(Number) 结束坐标X轴
    *@param:endY(Number) 结束坐标Y轴
    */

    GetSlideDirection:(startX,startY, endX, endY)=>{

        let dy = startY - endY;
        let dx = endX - startX;
        let result = 0;

        //如果滑动距离太短
        if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
            return result;
        }

        // 获取手势方向
        let angle = Math.atan2(dy,dx) * 180 / Math.PI;//返回角度
        if (angle >= -45 && angle < 45) {
            result = 4;
        }else if (angle >= 45 && angle < 135) {
            result = 1;
        }else if (angle >= -135 && angle < -45) {
            result = 2;
        }else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
            result = 3;
        }
        return result;
    },

    /**
    *根据传入的值获取当前时间YY-MM-DD or YY-MM-DD h:m:s
    *@param:strDate(String) 'max:最大时间 min:最小时间 cur:当前时间' 默认当前时间
    *@param:sizeDate(Number) '最大、小年数值' 默认为0
    */

    getFormDate:(strDate = 'cur',sizeDate = 0)=>{
        let date = new Date();
        let [splice1,splice2] = ["-",":"];

        let year    = date.getFullYear();
        let month   = date.getMonth() + 1;
        let day     = date.getDate();
        let hours   = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();

        let cur = [year , month , day];
        let max = [(year + sizeDate) , month , day];
        let min = [(year - sizeDate) , month , day];

        if(strDate == 'cur'){
            return cur;
        }else if(strDate == 'max'){
            return max;
        }else if(strDate == 'min'){
            return min;
        }else{
            return year + splice1 + month + splice1 + day + " " + hours + splice2 + minutes + splice2 + seconds;
        }
    },


    /**
    *根据传入的年和月份返回当月天数
    *@param:year(Number)
    *@param:month(Number)
    */

    getDaysInMonth:(year,month) => {
        //parseInt(number,type)这个函数后面如果不跟第2个参数来表示进制的话，默认是10进制。
        month = parseInt(month,10);
        var temp = new Date(year,month,0);
        return temp.getDate();
    },

    /**
    *获取正数组的最大差值
    *@param:arr(Array)
    */

    getMaxProfilt:(arr) => {
        let minPrice = arr[0];
        let maxProfit = 0;
        for(let i = 0;i < arr.length;i++){
            let currentPrice = arr[i];
            minPrice = Math.min(minPrice,currentPrice);
            let potentailProfit = currentPrice - minPrice;
            maxProfit = Math.max(maxProfit,potentailProfit);
        }
        return maxProfit;
    },

    /**
    *随机生成指定n位数的字符串
    *@param:n(Number)
    */

    randomString:(n) => {
        let str = 'abcdefghijklmnopqrstuvwxyz9876543210';
        let tmp = '';
        let len = str.length;
        for(let i = 0; i < n;i++){
            tmp += str.charAt(Math.floor(Math.random()*len));
        }
        return tmp;
    },

    /**
    *生成斐波那契数列
    *@param:n(Number)
    */

    getFibonacci:(n) => {
        // fibo[i]=fibo[i-1]+fibo[i-2];
        let i = 0;
        let fibarr = [];
        while(i<n){
            if(i<=1){
                fibarr.push(i);
            }else{
                fibarr.push(fibarr[i-1]+fibarr[i-2])
            }
            i++;
        }
        return fibarr;
    },

    /**
    *获取指定元素的单位
    *@param:ele(Object) 目标元素对象
    *@param:attr(String) 需要获取的单位名:width,height
    */
    getEelUnit:(ele,attr) => {
        return Number((window.getComputedStyle(ele)[attr]).replace('px',''));
    },

    /**
    *获取伪元素的单位
    *@param:ele(Object) 目标元素对象
    *@param:pseudo(String) 伪元素类型'::before ::after'
    *@param:attr(String) 需要获取的单位名:width,height
    */
    getPseudoEle:(ele,pseudo,attr) => {
        return Number(window.getComputedStyle(ele, pseudo).getPropertyValue(attr).replace('px',''));
    },

    /*
    *获取时间戳
    */
    getTimesTamp:()=>{
        return Date.parse(new Date()) /1000;
    },

    // 禁用微信滚动,只允许指定元素滚动'.scroll',
    disbledScroll:(className)=>{
        let overscroll = function(el) {
            el.addEventListener('touchstart', function() {
                let top = el.scrollTop
                ,totalScroll = el.scrollHeight
                ,currentScroll = top + el.offsetHeight;
                if(top === 0) {
                    el.scrollTop = 1;
                }else if(currentScroll === totalScroll) {
                    el.scrollTop = top - 1;
                }
            });

            el.addEventListener('touchmove', function(evt) {
            if(el.offsetHeight < el.scrollHeight)
                evt._isScroller = true;
            });
        }

        overscroll(document.querySelector(className));
        document.body.addEventListener('touchmove', function(evt) {
            if(!evt._isScroller) {
                evt.preventDefault();
            }
        });
    },

    removeDisabledScroll:(className)=>{
        // console.log(libs);
        overscroll(document.querySelector(className));
        document.body.removeEventListener('touchmove',function(e){
            e.stopPropagation();
        });
    },

    // 同步等待执行async
    getAsyncPromise:async (data)=>{
        try{
            let mk = await libs.Fetch(new Request(data.url,data));
            mk.json().then(res => {
                sessionStorage.marketArr = JSON.stringify(res.data.market);
                sessionStorage.marketData = JSON.stringify(res.data.market[0]);
            });
            return mk;
        }catch(err){
            console.log(err);
        }
    },

    /**
    *返回校验对象里的第一条error msg
    *obj[Object.keys(obj).sort((a,b)=>a-b)[0]]
    *Object.keys(obj): 输出 obj 里所有 key 组成的数组；
    *.sort((a,b)=>a-b): 从小到大排序
    *[0]: 输出第一个的值。
    *以上操作找出 obj 中最小的 key 的值 (s)
    *obj[s]: 取第一个
    *
    */
    errorMsg:(obj)=>{
        let len = Object.keys(obj).sort((a,b)=>a-b)[0];
        return obj[len][obj[len].length-1];

    },
    /**
    *返回或者设置语言选项
    */
    defaultLang:(name, defaultValue) =>{
        let arr,
            reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            return unescape(arr[2]);
        }else{
            return defaultValue;
        }
    },
    //写cookies
    setCookie:(name,value)=>{
        let Days = 30;
        let exp = new Date();
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
        return libs.defaultLang(name,value);
    },
    // 获取cookies
    getCookie:(name)=>{
        let arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr = document.cookie.match(reg)){
            return unescape(arr[2]);
        }else{
            return null;
        }
    },
    // 删除cookies
    delCookie:(name)=>{
        let exp = new Date();
        exp.setTime(exp.getTime() - 1);
        let cval = libs.getCookie(name);
        if(cval != null){
            document.cookie= name + "="+cval+";expires="+exp.toGMTString();
        }
    },
    addClass: (obj, cls) => {
        let obj_class = obj.className; //获取 class 内容.
        let blank = (obj_class != '') ? ' ' : ''; //判断获取到的 class 是否为空, 如果不为空在前面加个'空格'.
        let added = obj_class + blank + cls; //组合原来的 class 和需要添加的 class.
        obj.className = added; //替换原来的 class.
    },
    removeClass: (obj, cls) => {
        let obj_class = ' ' + obj.className + ' '; //获取 class 内容, 并在首尾各加一个空格. ex) 'abc    bcd' -> ' abc    bcd '
        obj_class = obj_class.replace(/(\s+)/gi, ' '); //将多余的空字符替换成一个空格. ex) ' abc    bcd ' -> ' abc bcd '
        let removed = obj_class.replace(' ' + cls + ' ', ' '); //在原来的 class 替换掉首尾加了空格的 class. ex) ' abc bcd ' -> 'bcd '
        removed = removed.replace(/(^\s+)|(\s+$)/g, ''); //去掉首尾空格. ex) 'bcd ' -> 'bcd'
        obj.className = removed; //替换原来的 class.
    },
    hasClass: (obj, cls) => {
        let obj_class = obj.className; //获取 class 内容.
        let obj_class_lst = obj_class.split(/\s+/); //通过split空字符将cls转换成数组.
        let x = 0;
        for (x in obj_class_lst) {
            if (obj_class_lst[x] == cls) { //循环数组, 判断是否包含cls
                return true;
            }
        }
        return false;
    },
    // 获取时间戳
    getTimestamp:()=>{
        let timestamp = new Date().getTime();
        return timestamp;
    },
    // 设置request animation frame
    setRequestAnimFrame(){
        window.requestAnimFrame = (function(){
            return  window.requestAnimationFrame       ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame    ||
                    window.oRequestAnimationFrame      ||
                    window.msRequestAnimationFrame     ||
                    function(/* function */ callback, /* DOMElement */ element){
                        window.setTimeout(callback, 1000 / 60);
                    };
       })();
    }
}

// module.exports = libs;
export default libs;

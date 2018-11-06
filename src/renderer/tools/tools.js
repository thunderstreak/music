const libs = {
    /**
     *数组去重
     *适用[string,number]类型
     *ES6 版 :Array.from(new Set(array));
     */
    unique : (arr) => {
        let res = [];
        let json = {};
        for (let i = 0; i < arr.length; i++) {
            if (!json[arr[i]]) {
                res.push(arr[i]);
                json[arr[i]] = true;
            }
        }
        return res;
    },
    unique2: (arr) => {
        let [tempObj, newArray] = [{}, []];

        for (let i = 0; i < arr.length; i++) {
            if (!tempObj[arr[i]]) {
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

    dobbleSort: (arr) => {
        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    let temporary = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temporary;
                }
            }
        }
    },

    /**
     *快速排序
     *@param:arr(Array)
     */

    quickSort: function (arr) {

        if (arr.length <= 1) {
            return arr;
        }
        let pivotIdx = Math.floor(arr.length / 2);
        let pivot = arr.splice(pivotIdx, 1)[0];

        let [left, right] = [[], []];

        for (let i = 0; i < arr.length; i++) {
            if (arr[i] < pivot) {
                left.push(arr[i]);
            } else {
                right.push(arr[i]);
            }
        }
        return this.quickSort(left).concat([pivot], this.quickSort(right));
    },

    /**
     *插入排序
     *@param:arr(Array)
     */

    insertSort: (arr) => {
        let j, step, key;
        for (let i = 0; i < arr.length; i++) {
            step = j = i;
            key = arr[j];
            while (--j > -1) {
                if (arr[j] > key) {
                    arr[j + 1] = arr[j];
                } else {
                    break;
                }
            }
            arr[j + 1] = key;
        }
        return arr;
    },

    /**
     *二分查找
     *@param:data(Array)
     *@param:item(Number)
     */

    binarySearch: (data, item) => {
        let len = data.length - 1;
        let bes = 0;
        while (bes <= len) {
            let m = Math.floor((len + bes) / 2);
            if (data[m] === item) {
                return m;
            }
            if (item > data[m]) {
                bes = m + 1;
            } else {
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

    clone: (arg) => {
        let o = (arg.constructor === Array && arg instanceof Array && Object.prototype.toString.call((arg)) === '[object Array]') ? [] : {};
        for (let e in arg) {
            o[e] = arg.typeof === 'object' ? libs.clone() : arg[e];
        }
        return o;
    },

    /* deepCopy深拷贝
     */
    deepCopy: (arg) => {
        let obj = {};
        obj = JSON.parse(JSON.stringify(arg));

        return obj;
    },

    /**
     *圆弧进度条
     *@param:canvasParentEle(String:eleID) canvas外层div的ID
     *@param:canvasSelf(String:eleID) canvas的ID
     *@param:isTrueOrFalse(boolean) true为圆弧进度条，false为整园进度条
     *@param:progrColor(String) 绘制进度圆的颜色值
     *进度条的值设置在canvas的data-progress上，值区间0~100
     */
    drawCricle: (canvasParentEle, canvasSelf, isTrueOrFalse, progrColor) => {
        if (!canvasParentEle && !canvasSelf && !isTrueOrFalse) {
            console.error('arguments not meeting expectations');
            return
        }

        let canvasParent = document.getElementById(canvasParentEle);
        let canvas = document.getElementById(canvasSelf);
        let dataPorgress = Number(canvas.dataset.progress);
        // 字符串'%'替换处理
        if (isNaN(dataPorgress)) {
            dataPorgress = Number(canvas.dataset.progress.replace('%', ''));
        }

        let porgress = isTrueOrFalse ? 1.4 * (dataPorgress) / 100 : 2 * (dataPorgress) / 100;
        let CanvasWidth = (window.getComputedStyle(canvasParent).getPropertyValue('width')).replace(/px/g, '');
        let CanvasHeight = (window.getComputedStyle(canvasParent).getPropertyValue('height')).replace(/px/g, '');

        canvas.width = CanvasWidth * 2;
        canvas.height = CanvasHeight * 2;
        // canvas.style.width为canvas.width的一半用于避免绘制后出现模糊不清晰
        canvas.style.width = canvas.width / 2 + 'px';
        canvas.style.height = canvas.height / 2 + 'px';

        let res;// 绘制百分比所需的半径
        let lineWidth = CanvasWidth / 12.5;// 绘制圆弧线宽
        let setData = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            r: (canvas.width - lineWidth - 2) / 2// 减2控制绘制的圆弧与canvas的边界紧密贴合，防止出现canvas边界出现模糊
        };

        let ctx = canvas.getContext('2d');
        ctx.lineCap = "round";
        // 绘制底圆
        ctx.beginPath();
        if (isTrueOrFalse === true) {
            ctx.arc(
                setData.x,
                setData.y,
                setData.r,
                0.8 * Math.PI,//开始角
                2.2 * Math.PI,//结束角
                false//False = 顺时针，true = 逆时针。
            );//绘制圆弧进度条所需的半径总共1.5PI
        } else if (isTrueOrFalse === false) {
            ctx.arc(
                setData.x,
                setData.y,
                setData.r,
                0 * Math.PI,//开始角
                2 * Math.PI,//结束角
                false//False = 顺时针，true = 逆时针。
            );//绘制圆弧进度条所需的半径总共1.5PI
        }
        ctx.strokeStyle = '#e6e6e6';
        ctx.lineWidth = isTrueOrFalse ? lineWidth : lineWidth / 3;
        ctx.stroke();
        ctx.closePath();

        if (porgress > 100 || porgress === 0) {
            return
        }
        // 绘制进度圆
        ctx.beginPath();
        ctx.arc(
            setData.x,
            setData.y,
            setData.r,
            0.8 * Math.PI,//开始角
            (0.8 + porgress) * Math.PI,//结束角
            false
        );
        ctx.strokeStyle = progrColor || '#ff9331';
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        ctx.closePath();
    },

    /*
    * 计算时分秒
     */
    formatSeconds: (faultDate, completeTime) => {
        let sTime = Date.parse(new Date(faultDate));
        let eTime = Date.parse(new Date(completeTime));
        let usedTime = eTime - sTime;  //两个时间戳相差的毫秒数
        let days = Math.floor(usedTime / (24 * 3600 * 1000));
        //计算出小时数
        let leave1 = usedTime % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
        let hours = Math.floor(leave1 / (3600 * 1000));
        //计算相差分钟数
        let leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数
        let minutes = Math.floor(leave2 / (60 * 1000));
        let d = '';
        if (days > 0) {
            d += days + "天";
        }
        if (hours > 0) {
            d += hours + "时";
        }
        if (minutes > 0) {
            d += minutes + "分钟";
        }else{
            d += "少于1分钟";
        }

        // console.log(days, hours, minutes);
        return d;
    },

    /**
     *@param:promise(Promise) promise对象
     *@param:type(String) 'json' 返回json格式
     *返回一个promise对象,可以使用.then来处理response参数
     */
    Fetch: (promise, type) => {
        if (!promise && typeof promise !== 'object' && JSON.stringify(promise) !== '{}') return 'arguments error!';
        return new Promise((resolve, reject) => {
            fetch(promise).then((response) => {
                if (response.status === 200) {
                    // console.log(response.headers.get('Content-Type'));
                    // console.log(response.headers.get('Date'));
                    // resolve(response.json());
                    (type && type === 'json') ? resolve(response.json()) : resolve(response);
                } else {
                    reject(response);
                }
            }).catch((err) => {
                console.log(err);
            })
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
    GetSlideDirection: (startX, startY, endX, endY) => {
        let dy = startY - endY;
        let dx = endX - startX;
        let result = 0;

        //如果滑动距离太短
        if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
            return result;
        }

        // 获取手势方向
        let angle = Math.atan2(dy, dx) * 180 / Math.PI;//返回角度
        if (angle >= -45 && angle < 45) {
            result = 4;
        } else if (angle >= 45 && angle < 135) {
            result = 1;
        } else if (angle >= -135 && angle < -45) {
            result = 2;
        } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
            result = 3;
        }
        return result;
    },

    /**
     *根据传入的值获取当前时间YY-MM-DD or YY-MM-DD h:m:s
     *@param:strDate(String) 'max:最大时间 min:最小时间 cur:当前时间' 默认当前时间
     *@param:sizeDate(Number) '最大、小年数值' 默认为0
     */
    getFormDate: (strDate = 'cur', sizeDate = 0) => {
        let date = new Date();
        let [splice1, splice2] = ["-", ":"];

        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();

        let cur = [year, month, day];
        let max = [(year + sizeDate), month, day];
        let min = [(year - sizeDate), month, day];

        if (strDate === 'cur') {
            return cur;
        } else if (strDate === 'max') {
            return max;
        } else if (strDate === 'min') {
            return min;
        } else {
            return year + splice1 + (month < 10 ? ('0' + month) : month) + splice1 + (day < 10 ? ('0' + day) : day) + " " + hours + splice2 + minutes + splice2 + seconds;
        }
    },

    formDate: (d) => {
        let date = new Date(d);
        let [splice1, splice2] = ["-", ":"];

        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();

        let cur = [year, month, day];
        let max = [year, month, day];
        let min = [year, month, day];

        return year + splice1 + (month < 10 ? ('0' + month) : month) + splice1 + (day < 10 ? ('0' + day) : day) + " " + hours + splice2 + minutes + splice2 + seconds;
    },

    /**
     *根据传入的年和月份返回当月天数
     *@param:year(Number)
     *@param:month(Number)
     */

    getDaysInMonth: (year, month) => {
        //parseInt(number,type)这个函数后面如果不跟第2个参数来表示进制的话，默认是10进制。
        month = parseInt(month, 10);
        let temp = new Date(year, month, 0);
        return temp.getDate();
    },

    /**
     *获取当前天向后推一周的年月日
     *@param:week(String) 获取周
     */
    getSevenDate: (week) => {
        let weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        let currentDate = new Date();
        let weekday = currentDate.getDay();//周几
        let nextDate = new Date(currentDate);
        let arrDate = [];
        for (let i = 0; i < 7; i++) {
            nextDate.setDate(currentDate.getDate() + i);
            let times = nextDate.getFullYear() + "-" + (nextDate.getMonth() + 1) + "-" + nextDate.getDate();//每一天的年月日
            if (week) {
                let W = new Date(times).getDay();
                let D = weeks[new Date(times).getDay()];
                if (W === weekday) {
                    arrDate.push('今天' + D);
                } else if (W === (weekday + 1)) {
                    arrDate.push('明天' + D);
                } else {
                    arrDate.push((nextDate.getMonth() + 1) + "-" + nextDate.getDate() + D);
                }
            } else {
                arrDate.push(times);
            }
        }
        return arrDate;
    },

    /**
     *获取一周的时间
     **/
    getSevenDay: (day) => {
        let weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        let today = new Date();

        let targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;

        today.setTime(targetday_milliseconds); //注意，这行是关键代码

        let tYear = today.getFullYear();
        let tMonth = today.getMonth();
        let tDate = today.getDate();

        tMonth = doHandleMonth(tMonth + 1);
        tDate = doHandleMonth(tDate);

        let weekday = today.getDay();//周几

        if (day === 0) {//当天
            return tYear + "-" + tMonth + "-" + tDate + '今天';
        } else if (day === 1) {//明天
            return tYear + "-" + tMonth + "-" + tDate + '明天';
        } else {
            return tYear + "-" + tMonth + "-" + tDate + weeks[weekday];
        }

        function doHandleMonth(month) {
            let m = month;
            if (month.toString().length === 1) {
                m = "0" + month;
            }
            return m;
        }
    },

    /**
     *获取正数组的最大差值
     *@param:arr(Array)
     */
    getMaxProfilt: (arr) => {
        let minPrice = arr[0];
        let maxProfit = 0;
        for (let i = 0; i < arr.length; i++) {
            let currentPrice = arr[i];
            minPrice = Math.min(minPrice, currentPrice);
            let potentailProfit = currentPrice - minPrice;
            maxProfit = Math.max(maxProfit, potentailProfit);
        }
        return maxProfit;
    },

    /**
     *随机生成指定n位数的字符串
     *@param:n(Number)
     */
    randomString: (n) => {
        let str = 'abcdefghijklmnopqrstuvwxyz9876543210';
        let tmp = '';
        let len = str.length;
        for (let i = 0; i < n; i++) {
            tmp += str.charAt(Math.floor(Math.random() * len));
        }
        return tmp;
    },

    /**
     *生成斐波那契数列
     *@param:n(Number)
     */
    getFibonacci: (n) => {
        // fibo[i]=fibo[i-1]+fibo[i-2];
        let i = 0;
        let fibarr = [];
        while (i < n) {
            if (i <= 1) {
                fibarr.push(i);
            } else {
                fibarr.push(fibarr[i - 1] + fibarr[i - 2])
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
    getEelUnit: (ele, attr) => {
        return Number((window.getComputedStyle(ele)[attr]).replace('px', ''));
    },

    /**
     *获取伪元素的单位
     *@param:ele(Object) 目标元素对象
     *@param:pseudo(String) 伪元素类型'::before ::after'
     *@param:attr(String) 需要获取的单位名:width,height
     */
    getPseudoEle: (ele, pseudo, attr) => {
        return Number(window.getComputedStyle(ele, pseudo).getPropertyValue(attr).replace('px', ''));
    },

    /*
    *获取时间戳
    */
    getTimesTamp: () => {
        return Date.parse(new Date()) / 1000;
    },

    // 禁用微信滚动,只允许指定元素滚动'.scroll',
    disbledScroll: (className) => {
        let overscroll = function (el) {
            el.addEventListener('touchstart', function () {
                let top = el.scrollTop
                    , totalScroll = el.scrollHeight
                    , currentScroll = top + el.offsetHeight;
                if (top === 0) {
                    el.scrollTop = 1;
                } else if (currentScroll === totalScroll) {
                    el.scrollTop = top - 1;
                }
            });

            el.addEventListener('touchmove', function (evt) {
                if (el.offsetHeight < el.scrollHeight)
                    evt._isScroller = true;
            });
        };

        overscroll(document.querySelector(className));
        document.body.addEventListener('touchmove', function (evt) {
            if (!evt._isScroller) {
                evt.preventDefault();
            }
        });
    },

    removeDisabledScroll: (className) => {
        // console.log(libs);
        overscroll(document.querySelector(className));
        document.body.removeEventListener('touchmove', function (e) {
            e.stopPropagation();
        });
    },

    // 同步等待执行async
    getAsyncPromise: async (data) => {
        try {
            let mk = await libs.Fetch(new Request(data.url, data));
            mk.json().then(res => {
                sessionStorage.marketArr = JSON.stringify(res.data.market);
                sessionStorage.marketData = JSON.stringify(res.data.market[0]);
            });
            return mk;
        } catch (err) {
            console.log(err);
        }
    },

    /**
     *获取浏览器定位
     */
    getLocation: () => {
        let options = {
            enableHighAccuracy: true,
            maximumAge        : 1000
        };
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.onLocationSuccess, this.onLocationError, options);
        } else {
            console.log('您的浏览器不支持地理位置定位');
        }
    },

    onLocationSuccess: (position) => {
        //返回用户位置
        let longitude = position.coords.longitude;//经度
        let latitude = position.coords.latitude;//纬度
        console.log('经度' + longitude + '，纬度' + latitude);

        //根据经纬度获取地理位置，不太准确，获取城市区域还是可以的
        let point = new BMap.Point(longitude, latitude);
        let gc = new BMap.Geocoder();
        gc.getLocation(point, function (rs) {
            let addComp = rs.addressComponents;
            console.log(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
        });
    },

    onLocationError: (error) => {
        switch (error.code) {
            case 1:
                console.log("位置服务被拒绝");
                break;
            case 2:
                console.log("暂时获取不到位置信息");
                break;
            case 3:
                console.log("获取信息超时");
                break;
            case 4:
                console.log("未知错误");
                break;
        }
    },

    /**
     *获取百度地图定位返回经纬度
     *
     */
    getBMapLocation: (callback) => {
        let point = new BMap.Point();
        let geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function (r) {
            if (this.getStatus() === BMAP_STATUS_SUCCESS) {
                // console.log(r.point);
                callback && callback(r.point)
            } else {
                console.log('failed' + this.getStatus());
            }
        }, {enableHighAccuracy: true});
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
    errorMsg: (obj) => {
        let len = Object.keys(obj).sort((a, b) => a - b)[0];
        return obj[len][obj[len].length - 1];

    },

    /**
     *判断是否是微信浏览器
     **/
    isWeChat: () => {
        let ua = navigator.userAgent.toLowerCase();
        if (libs.isMobile() && ua.match(/MicroMessenger/i) === "micromessenger") {
            return true;
        } else {
            return false;
        }
    },

    /**
     *判断是否是移动端浏览器
     **/
    isMobile: () => {
        if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)
        ) {
            return true;
        } else {
            return false;
        }
    },

    /**
     *判断android
     **/
    isAndroid: () => {
        if (navigator.userAgent.match(/Android/i)) {
            return true;
        } else {
            return false;
        }
    },

    /**
     *判断ios
     **/
    isIos: () => {
        if (navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
        ) {
            return true;
        } else {
            return false;
        }
    },

    /**
     *获取cookie
     **/
    getCookie: (name) => {
        let strcookie = document.cookie;//获取cookie字符串
        let arrcookie = strcookie.split("; ");//分割
        //遍历匹配
        for (let i = 0; i < arrcookie.length; i++) {
            let arr = arrcookie[i].split("=");
            if (arr[0] === name) {
                return arr[1];
            }
        }
        return null;
    },

    getCookies(name) {
        let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    },


    /**
     *设置cookie
     **/
    setCookie: (name, value) => {
        let Days = 30;
        let exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    },

    /**
     *删除cookie
     **/
    delCookie: (name) => {
        let exp = new Date();
        exp.setTime(exp.getTime() - 1);
        let cval = getCookie(name);
        if (cval != null) {
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        }
    },

    /**
     *十分钟倒计时
     *@param:context(Object) 上下文环境
     *@param:count(string) 返回上下文环境中的倒计时字段值
     *@param:bool(string) 返回上下文环境中的倒计时停止后的判断值
     *@param:timeout(Object) 上下文环境中的倒计时对象，用于切换页面后销毁定时器
     *@param:etime(date) 指定的截至时间
     *@param:callback(function) 回调函数
     *return flase值告诉倒计时停止
     **/
    countDownTimes(context,count,bool,timeout,etime,callback){
        let that = context;
        function down(){
            console.log(timeout);
            // let timeout;
            //获取当前时间
            let date = new Date();
            let now = date.getTime();
            //设置截止时间
            let endDate = new Date(etime.replace(/\-/g, "/"));
            let end = endDate.getTime() + (10 * 60 * 1000);
            //时间差
            let leftTime = end-now;
            //定义变量 d,h,m,s保存倒计时的时间
            let d,h,m,s;
            if (leftTime >= 0) {
                d = Math.floor(leftTime/1000/60/60/24);
                h = Math.floor(leftTime/1000/60/60%24);
                m = Math.floor(leftTime/1000/60%60);
                s = Math.floor(leftTime/1000%60);
                // console.log(d+"天"+h+"时"+m+"分"+s+"秒");
                that[count] = `(${m}分${s}秒)`;
                that[timeout] = setTimeout(down,1000);
            }else{
                that[bool] = true;//停止计时
                clearTimeout(that[timeout]);
                callback && callback(true);//回调函数
            }
        }

        down();
    },
    /**
     *上传图片进行压缩
     *@param:e(target) 上传文件的事件对象
     *@param:cb(function) 压缩完成后的回调事件
     **/
    compressImg(e,cb){
        let files = e.target.files || e.dataTransfer.files;
        let file = files[0];
        if(!file || !/image\//.test(file.type)){
            console.log('请上传图片文件');
            return; //确保文件是图片
        }

        // let self = this;
        // 创建一个reader
        let reader = new FileReader();
        // 将图片2将转成 base64 格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = function() {
            let result = this.result;
            let img = new Image();
            img.src = result;
            //判断图片是否大于100K,是就直接上传，反之压缩图片
            if (result.length <= (100 * 1024)) {
                cb && cb(result);
            } else {
                img.onload = function() {
                    let canvas = document.createElement("canvas");
                    let ctx = canvas.getContext('2d');
                    //瓦片canvas
                    let tCanvas = document.createElement("canvas");
                    let tctx = tCanvas.getContext("2d");
                    let initSize = img.src.length;
                    let width = img.width;
                    let height = img.height;
                    //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
                    let ratio;
                    if ((ratio = width * height / 4000000) > 1) {
                        console.log("大于400万像素");
                        ratio = Math.sqrt(ratio);
                        width /= ratio;
                        height /= ratio;
                    } else {
                        ratio = 1;
                    }
                    canvas.width = width;
                    canvas.height = height;
                    //        铺底色
                    ctx.fillStyle = "#fff";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    //如果图片像素大于100万则使用瓦片绘制
                    let count;
                    if ((count = width * height / 1000000) > 1) {
                        console.log("超过100W像素");
                        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
                        //计算每块瓦片的宽和高
                        let nw = ~~(width / count);
                        let nh = ~~(height / count);
                        tCanvas.width = nw;
                        tCanvas.height = nh;
                        for (let i = 0; i < count; i++) {
                            for (let j = 0; j < count; j++) {
                                tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
                                ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
                            }
                        }
                    } else {
                        ctx.drawImage(img, 0, 0, width, height);
                    }

                    //进行最小压缩
                    let ndata = canvas.toDataURL('image/jpeg', 0.3);
                    console.log('压缩前：' + initSize);
                    console.log('压缩后：' + ndata.length);
                    console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
                    tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
                    cb && cb(ndata);
                    return ndata;

                }
            }
        };
        reader.onerror = function (e) {
            console.log("error " + e.target.error.code + " \n\niPhone iOS8 Permissions Error.");
        }
    },
    /**
     * [once fn]
     * @param  {Function} fn      [Function]
     * @param  {Object}   context [Object]
     * @return {result}           [Execute the results once.]
     */
    once(fn,context){
        let result;
        return () => {
            if(fn){
                result = fn.apply(context || this,arguments);
                fn = null;
            }
            return result;
        }
    },

    /**
     * [getUrlParams 获取url?后面的参数]
     * @param  {[type]} url [description]
     * @return {[type]}     [description]
     */
    getUrlParams(url){
        return new Promise((resolve, reject) => {
            let error = {msg:'Authorization parameter error'};
            // 获取url参数
            let paramsStr = url.substring(url.indexOf('?') + 1,url.length).split('&');

            let params = {};
            for (let i = 0; i < paramsStr.length; i++) {
                let variable = paramsStr[i].split('=');
                // 针对上汽，车生活内嵌app形式的免登陆授权url传递的指定参数进行解码，处理特殊字符
                if(variable[0] === 'appSecret'){
                    variable[1] = decodeURIComponent(decodeURI(variable[1])).replace(/\s/g,'+');
                }
                if(variable[0] === 'appKey'){
                    variable[1] = decodeURIComponent(decodeURI(variable[1]));
                }
                params[variable[0]] = variable[1];
            }
            resolve(params);
        })
    },

    /**
     * [loadJs 装载js]
     * @param  {[type]} url [description]
     * @return {[type]}     [description]
     */

    loadJs(url,callback){
        let script  = document.createElement('script');
        script.type = "text/javascript";
        script.src  = url;
        document.head.appendChild(script);
        script.onerror = e => {
            console.log(e);
        };
        if(script.readyState){
            script.onreadystatechange = function(){
                if(script.readyState === "loaded" || script.readyState === "complete"){
                    script.onreadystatechange = null;
                    callback && callback();
                }
            }
        }else{
            script.onload = function(){
                callback && callback();
            }
        }
    },

    //百度坐标转高德（传入经度、纬度）
    bd_decrypt(bd_lng, bd_lat) {
        let X_PI = Math.PI * 3000.0 / 180.0;
        let x = bd_lng - 0.0065;
        let y = bd_lat - 0.006;
        let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
        let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
        let gg_lng = z * Math.cos(theta);
        let gg_lat = z * Math.sin(theta);
        return {
            lng: gg_lng,
            lat: gg_lat
        }
    },
    //高德坐标转百度（传入经度、纬度）
    bd_encrypt(gg_lng, gg_lat) {
        let X_PI = Math.PI * 3000.0 / 180.0;
        let x = gg_lng, y = gg_lat;
        let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI);
        let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI);
        let bd_lng = z * Math.cos(theta) + 0.0065;
        let bd_lat = z * Math.sin(theta) + 0.006;
        return {
            lat: bd_lat,
            lng: bd_lng
        }
    },
    /**
     * 防反跳。func函数在最后一次调用时刻的wait毫秒之后执行！
     * @param func 执行函数
     * @param wait 时间间隔
     * @param immediate 为true，debounce会在wait时间间隔的开始调用这个函数
     * @returns {Function}
     * example:targetEle.on('input',debounce(this.filterValue,500));
     */
    debounce(func, wait, immediate) {
        let timeout, args, context, timestamp, result;

        let later = function() {
            let last = new Date().getTime() - timestamp; // timestamp会实时更新

            if (last < wait && last >= 0) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;
                if (!immediate) {
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                }
            }
        };

        return function() {
            context = this;
            args = arguments;
            timestamp = new Date().getTime();
            let callNow = immediate && !timeout;

            if (!timeout) {
                timeout = setTimeout(later, wait);
            }
            if (callNow) {
                result = func.apply(context, args);
                context = args = null;
            }
            return result;
        };
    },
    /**
     * 创建并返回一个像节流阀一样的函数，当重复调用函数的时候，最多每隔 wait毫秒调用一次该函数
     * @param func 执行函数
     * @param wait 时间间隔
     * @param options 如果你想禁用第一次首先执行的话，传递{leading: false}，
     *                如果你想禁用最后一次执行的话，传递{trailing: false}
     * @returns {Function}
     * example:
     *  $('body').on('mousemove', throttle(function (event) {
            console.log('tick');
        }, 1000));
     */
    throttle(func, wait, options) {
        let context, args, result;
        let timeout = null;
        let previous = 0;
        if (!options) options = {};
        let later = function() {
            previous = options.leading === false ? 0 : new Date().getTime();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };
        return function() {
            let now = new Date().getTime();
            if (!previous && options.leading === false) previous = now;
            let remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
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
};

// module.exports = libs;
export default libs;

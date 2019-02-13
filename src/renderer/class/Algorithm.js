class SortAlgorithm {
    constructor(){

    }

    // 冒泡排序
    bubbleSort(arr){
        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
                if(arr[i] > arr[j + 1]){
                    let temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
        return arr;
    }

    // 选择排序
    selectionSort(arr){
        let len = arr.length;
        let temp;
        let minIndex;

        for (let i = 0; i < len - 1; i++) {
            minIndex = i;
            for (let j = i + 1; j < len; j++) {
                if(arr[j] < arr[minIndex]){//找到最小值
                    minIndex = j;//保存最小值索引
                }
            }
            temp = arr[i];
            arr[i] = minIndex;
            arr[minIndex] = temp;
        }

        return arr;
    }

    // 快速排序
    quickSort(arr){
        if(arr.length <= 1){
            return arr;
        }

        let pivotIndex = Math.floor(arr.length / 2);
        let pivot = arr.splice(pivotIndex,1)[0];
        let left = [];
        let right = [];

        for (let i = 0; i < arr.length; i++) {
            if(arr[i] < pivot){
                left.push(arr[i])
            }else{
                right.push(arr[i])
            }
        }

        return SortAlgorithm.quickSort(left).concat([pivot], SortAlgorithm.quickSort(right))
    }

    // 插入排序
    insertionSort(arr){
        let len = arr.length;
        let preIndex;
        let current;

        for (let i = 1; i < len; i++) {
            preIndex = i - 1;
            current = arr[i];
            while (preIndex >= 0 && arr[preIndex] > current){
                arr[preIndex + 1] = arr[preIndex];
                preIndex --;
            }
            arr[preIndex + 1] = current;
        }

        return arr;
    }

    // 希尔排序
    shellSort(arr){
        let len = arr.length;
        let temp;
        let gap = 1;

        while(gap < len / 3){// 定义动态间隔
            gap = gap * 3 + 1;
        }

        for (gap; gap > 0; gap = Math.floor(gap / 3)) {
            for (let i = gap; i < len; i++) {
                temp = arr[i];
                let j = i - gap;
                for (j; j >= 0 && arr[j] > temp; j -= gap) {
                    arr[j + gap] = arr[j];
                }
                arr[j + gap] = temp
            }
        }

        return arr;
    }

    // 并归排序
    mergeSort(arr){
        //采用自上而下的递归方法
        let len = arr.length;

        if(len < 2) {
            return arr;
        }

        let middle = Math.floor(len / 2);
        let left = arr.slice(0, middle);
        let right = arr.slice(middle);

        return merge(SortAlgorithm.mergeSort(left), SortAlgorithm.mergeSort(right));

        function merge(left, right){
            let result = [];

            while (left.length && right.length) {
                if (left[0] <= right[0]) {
                    result.push(left.shift());
                } else {
                    result.push(right.shift());
                }
            }

            while (left.length)
                result.push(left.shift());

            while (right.length)
                result.push(right.shift());

            return result;
        }
    }

    // 堆排序
    heapSort(arr){

    }

    /**
    * 计数排序
    * 核心在于将输入的数据值转化为键存储在额外开辟的数组空间中。
    * 作为一种线性时间复杂度的排序，计数排序要求输入的数据必须是有确定范围的整数。
    * */
    countingSort(arr,maxValue){
        let bucket = new Array(maxValue+1);
        let sortedIndex = 0;
        let arrLen = arr.length;
        let bucketLen = maxValue + 1;

        for (let i = 0; i < arrLen; i++) {
            if (!bucket[arr[i]]) {
                bucket[arr[i]] = 0;
            }
            bucket[arr[i]]++;
        }

        for (let j = 0; j < bucketLen; j++) {
            while(bucket[j] > 0) {
                arr[sortedIndex++] = j;
                bucket[j]--;
            }
        }

        return arr;
    }

    /*
    * 桶排序
    *
    * */
    bucketSort(arr,bucketSize){
        if (arr.length === 0) {
            return arr;
        }

        let i;
        let minValue = arr[0];
        let maxValue = arr[0];
        for (i = 1; i < arr.length; i++) {
            if (arr[i] < minValue) {
                minValue = arr[i];                //输入数据的最小值
            } else if (arr[i] > maxValue) {
                maxValue = arr[i];                //输入数据的最大值
            }
        }

        //桶的初始化
        const DEFAULT_BUCKET_SIZE = 5;            //设置桶的默认数量为5
        bucketSize = bucketSize || DEFAULT_BUCKET_SIZE;
        let bucketCount = Math.floor((maxValue - minValue) / bucketSize) + 1;
        let buckets = new Array(bucketCount);
        for (i = 0; i < buckets.length; i++) {
            buckets[i] = [];
        }

        //利用映射函数将数据分配到各个桶中
        for (i = 0; i < arr.length; i++) {
            buckets[Math.floor((arr[i] - minValue) / bucketSize)].push(arr[i]);
        }

        arr.length = 0;
        for (i = 0; i < buckets.length; i++) {
            insertionSort(buckets[i]);                      //对每个桶进行排序，这里使用了插入排序
            for (let j = 0; j < buckets[i].length; j++) {
                arr.push(buckets[i][j]);
            }
        }

        return arr;
    }
}

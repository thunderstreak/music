import https from 'https';

export default function getHttpsData (success, error) {
    // 回调缺省处理
    success = success || function(){};
    error   = error || function(){};

    let url = 'https://github.com/thunderstreak/music/blob/master/package.json';

    https.get(url, (res) => {
        let statusCode = res.statusCode;

        if(statusCode !== 200){
            // error 回调
            error();
            // 消耗响应数据以释放内存
            res.resume();
            return;
        }

        res.setEncoding('utf-8');
        let rawData = '';
        res.on('data', (chunck) => {
            rawData += chunck;
        });

        // 请求结束
        res.on('end', () => {
            // 成功回调
            success(rawData);
        }).on('error', () => {
            // error 回调
            error();
        })
    })
}

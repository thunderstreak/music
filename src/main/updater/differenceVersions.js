/**
 * [diffVer 对比本地版本号和线上核心版本号 (onlineVersion.version)，如果小于线上版本号，则激活浏览器并进入下载，同时退出 App；]
 * @param  {[type]} v1 [local version]
 * @param  {[type]} v2 [online version]
 * @return {[type]}    [description]
 */
export default function diffVer(v1, v2) {
    /**
     * [status : 0(版本格式不一致)]
     * [status : 1(版本一致)]
     * [status : 2(本地版本的其中一个版本号段小于线上版本)]
     * [status : 3(线上版本的其中一个版本号段大于本地版本)]
     */
    let status = {
        0:{msg:'版本格式不一致', status:0},
        1:{msg:'版本一致',      status:1},
        2:{msg:'本地版本的其中一个版本号段小于线上版本', status:2},
        3:{msg:'线上版本的其中一个版本号段大于本地版本', status:3},
    }
    return new Promise((resolve, reject) => {
        const vs1 = v1.toString().split('.');
        const vs2 = v2.toString().split('.');

        if (vs1.length !== vs2.length) {
            // 版本格式不一致
            resolve(status[0])
        }
        for (let i = 0; i < vs1.length; ++i) {
            let diff = parseInt(vs2[i], 10) - parseInt(vs1[i], 10);
            if (diff < 0) {
                // vs1 其中一个版本号段小于 vs2
                resolve(status[2])
            }
            if (diff > 0) {
                // vs2 其中一个版本号段大于 vs1
                resolve(status[3])
            }
        }
        // 版本一致
        resolve(status[1])
    })
}

export default function diffVer(v1, v2) {
    const vs1 = v1.toString().split('.'),
        vs2 = v2.toString().split('.');
    if (vs1.length !== vs2.length) {
        // 版本格式不一致
        return true;
    }
    for (let i = 0; i < vs1.length; ++i) {
        let diff = parseInt(vs2[i], 10) - parseInt(vs1[i], 10);
        if (diff < 0) {
            // vs1 其中一个版本号段小于 vs2
            return false;
        }
        if (diff > 0) {
            // vs2 其中一个版本号段大于 vs1
            return true;
        }
    }
    // 版本一致
    return false;
}

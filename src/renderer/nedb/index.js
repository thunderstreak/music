import DataStore from 'nedb'
import path from 'path'
import { remote } from 'electron'

const { app: { getPath } } = remote;
//C:\Users\yan\AppData\Roaming\Player
// 创建本地数据库
const db = {
    // 收藏列表
    collectData : new DataStore({
        filename : path.join(getPath('userData'), '/collectData.db'),
        autoload: true,
    }),
    // 歌曲列表
    songData : new DataStore({
        filename : path.join(getPath('userData'), '/songData.db'),
        autoload: true,
    }),
    // 配置列表
    confData : new DataStore({
        filename : path.join(getPath('userData'), '/confData.db'),
        autoload: true,
    }),
    // mv列表
    mvData : new DataStore({
        filename : path.join(getPath('userData'), '/mvData.db'),
        autoload: true,
    })
};

// 建立索引
for (let dbKey in db) {
    db[dbKey].ensureIndex({ fieldName: '_id', unique: true }, (err) => {
        err && console.log(err);
    });
}

export default db;

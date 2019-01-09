import DataStore from 'nedb'
import path from 'path'
import {remote} from 'electron'

//C:\Users\yan\AppData\Roaming\Player
// 创建本地数据库
const db = {
    collectData : new DataStore({
        filename : path.join(remote.app.getPath('userData'), '/collectData.db'),
        autoload: true,
    }),
    songData : new DataStore({
        filename : path.join(remote.app.getPath('userData'), '/songData.db'),
        autoload: true,
    }),
    confData : new DataStore({
        filename : path.join(remote.app.getPath('userData'), '/confData.db'),
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

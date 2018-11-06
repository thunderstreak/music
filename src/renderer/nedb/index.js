import DataStore from 'nedb'
import path from 'path'
import {remote} from 'electron'

//C:\Users\yan\AppData\Roaming\Player
// 创建本地数据库
const db = {
    tableData : new DataStore({
        filename : path.join(remote.app.getPath('userData'), '/tableData.db'),
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

export default db;

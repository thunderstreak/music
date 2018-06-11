import DataStore from 'nedb'
import path from 'path'
import {remote} from 'electron'
// const electron = require('electron')

// 创建本地数据库
const db = {
    tableData : new DataStore({
        filename : path.join(remote.app.getPath('userData'), '/tableData.db'),
        autoload: true,
    }),
    chartData : new DataStore({
        filename : path.join(remote.app.getPath('userData'), '/chartData.db'),
        autoload: true,
    }),
    confData : new DataStore({
        filename : path.join(remote.app.getPath('userData'), '/confData.db'),
        autoload: true,
    })
}

export default db;

import DataStore from 'nedb'
import path from 'path'
import {remote} from 'electron'

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

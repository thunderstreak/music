import {app, BrowserWindow, globalShortcut,screen} from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file://${__dirname}/index.html`

function createWindow() {
    /**
   * Initial window options
   */

   let {width,height} = screen.getPrimaryDisplay().workAreaSize;
    mainWindow = new BrowserWindow({
        height          : 563,
        width           : 1000,
        // height          : height,
        // width           : width,
        useContentSize  : true,
        frame           : false,
        webPreferences  : {
            webSecurity : false//用于本地跨域访问
        },
    })
    mainWindow.setMenu(null)
    mainWindow.loadURL(winURL)

    mainWindow.on('closed', () => {
        mainWindow = null
    })

    //前期为了调试方面，默认打开控制台
    if(process.env.NODE_ENV === 'development'){
        mainWindow.webContents.openDevTools({ mode : 'right' });
    }

    //注册打开控制台的快捷键
    globalShortcut.register('CommandOrControl+shift+alt+e', function () {
        let win = BrowserWindow.getFocusedWindow();
        if (win) {
            win.webContents.openDevTools({ detach: true });
        }
    });
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

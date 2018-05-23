import {app, BrowserWindow, globalShortcut,screen,ipcMain} from 'electron'

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
        opacity         : 1,//设置窗口初始的不透明度, 介于 0.0 (完全透明) 和 1.0 (完全不透明) 之间。
        center          : true,//窗口在屏幕居中
        useContentSize  : true,//width 和 height 将使用 web 页面的尺寸, 这意味着实际窗口的尺寸应该包括窗口框架的大小，稍微会大一点。
        frame           : false,//设置为 false 时可以创建一个Frameless Window.
        resizable       : false,//不允许改变窗口尺寸
        webPreferences  : {
            webSecurity : false//用于本地跨域访问
            devTools    : false,
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
// 关闭窗口
ipcMain.on('window-close', (e) => {mainWindow.close();});
// 最小化窗口
ipcMain.on('min', e => mainWindow.minimize());
// 最大化窗口
ipcMain.on('max', e => {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize()
    } else {
        mainWindow.maximize()
    }
});
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

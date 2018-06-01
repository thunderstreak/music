import {app, BrowserWindow, globalShortcut,screen,ipcMain} from 'electron'

import './request/'

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
            webSecurity : false,//用于本地跨域访问
            // devTools    : false,
        },

        backgroundColor : '#36383b',//如果你的应用没有白色背景，那么一定要在 BrowserWindow 选项中明确声明。这并不会阻止应用加载时的纯色方块，但至少它不会半路改变颜色：
        show            : false,//在所有资源加载完成前隐藏窗口。在开始前，确保隐藏掉浏览器窗口：
    })

    // 在所有东西都加载完成时，显示窗口并聚焦在上面提醒用户,这里推荐使用 BrowserWindow 的 "ready-to-show" 事件实现，或者用 webContents 的 'did-finish-load' 事件。
    mainWindow.on('ready-to-show', function() {
        mainWindow.show();
        mainWindow.focus();
    });

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

// 防止启动多个实例
const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
    if (mainWindow) {
        if (mainWindow.isMinimized())
            mainWindow.restore()
        mainWindow.focus()
    }
})
if (shouldQuit) {
    app.quit()
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
ipcMain.on('window-min', e => mainWindow.minimize());
// 最大化窗口
ipcMain.on('window-max', e => {
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

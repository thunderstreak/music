import { ipcMain, app } from 'electron';

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

// 关闭窗口
ipcMain.on('window-close', e => mainWindow.close());
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

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

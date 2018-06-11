import { ipcRenderer,remote } from 'electron';
// 检查是否有更新
ipcRenderer.send("checkForUpdate");

// 接受更新信息
ipcRenderer.on("message", (event, text) => {
    console.log(arguments);
    this.tips = text;
});

// 下载进度
ipcRenderer.on("downloadProgress", (event, progressObj) => {
    console.log(progressObj);
    this.downloadPercent = progressObj.percent || 0;
});

// 是否现在更新
ipcRenderer.on("isUpdateNow", () => {
    ipcRenderer.send("isUpdateNow");
});

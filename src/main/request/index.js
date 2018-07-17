import { ipcMain } from 'electron';
import request from 'request';
import Base64 from 'js-base64';

// 接受ipcRenderer事件
ipcMain.on('ipcRendererSongLyric',(event,data) => {
    let songId = data;
    let url = "https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?callback=MusicJsonCallback_lrc&pcachetime=1494070301711&songmid="+songId+"&g_tk=5381&jsonpCallback=MusicJsonCallback_lrc&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8¬ice=0&platform=yqq&needNewCode=0";
    let options = {
        url: url,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.110 Safari/537.36",
            "Accept": "*/*",
            "Referer": "https://y.qq.com/portal/player.html",
            "Accept-Language": "zh-CN,zh;q=0.8",
            "Cookie": "pgv_pvid=8455821612; ts_uid=1596880404; pgv_pvi=9708980224; yq_index=0; pgv_si=s3191448576; pgv_info=ssid=s8059271672; ts_refer=ADTAGmyqq; yq_playdata=s; ts_last=y.qq.com/portal/player.html; yqq_stat=0; yq_playschange=0; player_exist=1; qqmusic_fromtag=66; yplayer_open=1",
            "Host": "c.y.qq.com",
        }
    };
    request(options,(error, response, body) => {
        if(!error && response.statusCode == 200){

            // 解码歌词
            let data        = JSON.parse(body.match(/\{(.+?)\}/g)[0]);
            let decodelyric = Base64.Base64.decode(data.lyric);
            let reslyric    = [];

            try {
                reslyric = decodelyric ? decodelyric.split("[offset:0]")[1].split('\n') : [];
            } catch (e) {
                console.log(e);
            } finally {
                // 向ipcRenderer发送事件
                event.sender.send('ipcMainSongLyric', reslyric);
            }


        }else{
            console.log("error");
        }
    });

})

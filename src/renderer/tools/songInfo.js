import tool from './tools';

/**
 * [songPlayData 返回歌曲标记是否喜欢]
 * @param  {[type]}  songData [description]
 * @param  {Boolean} isLike   [description]
 * @return {[type]}           [description]
 */
export function SongPlayData(songData,isLike){

    let data = {
        isLike   : isLike,//是否喜欢
        timestamp: tool.getFormDate('format')
    };
    for (let variable in songData) {
        if (songData.hasOwnProperty(variable)) {
            data[variable] = songData[variable];
        }
    }

    return data;
}
/**
 * [songPlayInfo 返回播放歌曲所需要的歌曲对象]
 * @param  {[type]} data    [description]
 * @return {[type]}         [description]
 */
export function SetSongPlayInfo(data){
    const musicUrl = {
        url1:`http://113.96.98.143/amobile.music.tc.qq.com/C100${data.songmid}.m4a?guid=8099385826&vkey=2D4FDF06D32502E914CE819BD8BEBF47ECD5EB56CA958F16E2EC8A75F4EB829DDAFE1CE8742E01DCD001435E7D43EFFBC7840F83ABD78382&uin=1720&fromtag=66`,
        url2:`http://ws.stream.qqmusic.qq.com/C100${data.songmid}.m4a?fromtag=0&guid=126548448`
    };
    return {
        src         :musicUrl.url1,//歌曲地址
        singername  :data.singername || data.singer.map(res => res.name).join('-'),//歌手名称
        singer      :data.singer,//歌手
        songname    :data.songname,//歌曲名称
        songorig    :data.songorig,
        songmid     :data.songmid,
        songid      :data.songid,//歌曲id
        pay         :data.pay,
        payplay     :(data.pay.payplay == 1 && data.pay.payalbumprice != 0) ? true : false,//是否需要购买才能播放

        albumisrc   :`http://imgcache.qq.com/music/photo/album_300/${data.albumid%100}/300_albumpic_${data.albumid}_0.jpg`,//专辑封面
        albumid     :data.albumid,//专辑id
        albummid    :data.albummid,
        albumname   :data.albumname,//专辑名称
    }
}

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
    return {
        // src         :`http://ws.stream.qqmusic.qq.com/C100${data.songmid}.m4a?fromtag=0&guid=126548448`,//歌曲地址
        src         :`http://113.105.141.12/amobile.music.tc.qq.com/C100${data.songmid}.m4a?guid=2758568936&vkey=BCC537E4C006836EB559E16B47F8E8D5CD7E894ACBD38B433A46D3504E421C7C0A2E2FF0D7944C4E67D0367AE75D5FAC2F27E3F688C35934&uin=1720&fromtag=66`,//歌曲地址
        singername  :data.singername || data.singer.map(res => res.name).join('-'),//歌手名称
        singer      :data.singer,//歌手
        songname    :data.songname,//歌曲名称
        songorig    :data.songorig,
        songmid     :data.songmid,
        songid      :data.songid,//歌曲id
        pay         :data.pay,
        payplay     :(data.pay.payplay === 1 && data.pay.payalbumprice !== 0) ? true : false,//是否需要购买才能播放
        now         :Date.now(),//创建时间

        albumisrc   :`http://imgcache.qq.com/music/photo/album_300/${data.albumid%100}/300_albumpic_${data.albumid}_0.jpg`,//专辑封面
        albumid     :data.albumid,//专辑id
        albummid    :data.albummid,
        albumname   :data.albumname,//专辑名称
    }
}

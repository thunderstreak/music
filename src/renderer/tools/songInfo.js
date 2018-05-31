import tool from './tools';

/**
 * [songPlayData 返回歌曲标记是否喜欢]
 * @param  {[type]}  songData [description]
 * @param  {Boolean} isLike   [description]
 * @return {[type]}           [description]
 */
export function songPlayData(songData,isLike){

    let data = {
        isLike   : isLike,//是否喜欢
        timestamp: tool.getFormDate('format')
    }
    for (let variable in songData) {
        if (songData.hasOwnProperty(variable)) {
            data[variable] = songData[variable];
        }
    }

    return data;
}
/**
 * [songPlayInfo 返回播放歌曲所需要的歌曲对象]
 * @param  {[type]} songData [description]
 * @return {[type]}          [description]
 */
export function songPlayInfo(songData){
    return {
        src         :`http://ws.stream.qqmusic.qq.com/C100${data.songmid}.m4a?fromtag=0&guid=126548448`,
        name        :data.name || data.singer[0].name,
        songname    :data.songname,
        songorig    :data.songorig,
        songmid     :data.songmid,
        songid      :data.songid,

        albumisrc   :`http://imgcache.qq.com/music/photo/album_300/${data.albumid%100}/300_albumpic_${data.albumid}_0.jpg`,
        albumid     :data.albumid,
        albummid    :data.albummid,
        albumname   :data.albumname
    }
}

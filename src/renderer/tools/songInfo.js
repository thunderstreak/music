import tool from './tools';

/**
 * [songPlayData 返回播放歌曲所需要的歌曲对象]
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

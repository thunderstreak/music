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
        url1:`http://113.96.98.143/amobile.music.tc.qq.com/C100${data.songmid}.m4a?guid=2758568936&vkey=2D4FDF06D32502E914CE819BD8BEBF47ECD5EB56CA958F16E2EC8A75F4EB829DDAFE1CE8742E01DCD001435E7D43EFFBC7840F83ABD78382&uin=1720&fromtag=66`,
        url2:`http://ws.stream.qqmusic.qq.com/C100${data.songmid}.m4a?fromtag=0&guid=126548448`,
        url3:`http://14.152.88.149/amobile.music.tc.qq.com/C400004e76YU3lyeiW.m4a?guid=2758568936&vkey=06FD50C37D664063799318C69B2127EA616E84D9A184026C6892E99F6C45F47ACD3C452A1E66256F767A3CB244EF636E7667D69F2B64B8F0&uin=1720&fromtag=66`,
        url4:`http://14.17.73.49/amobile.music.tc.qq.com/C400${data.songmid}.m4a?guid=2758568936&vkey=72108EDDADA585F3FAA04F552D1122765FE384A2F7A185C4DA0F470B28A3E7BA306A534660A78349AD420B8864D754195D99393845C9B967&uin=1720&fromtag=66`,
        url5:`http://isure.stream.qqmusic.qq.com/C4000021IV7Z05cOai.m4a?guid=9659888224&vkey=E2531DBA5F97CBA3A76124A235A6F2E53DD05A5A2204325E61785A214C23A30F6FC15455551C4D2B9FB17A504B0B41C3456C3BA317908F88&uin=1720&fromtag=66`
    };
    return {
        src         :musicUrl.url5,//歌曲地址
        singername  :data.singername || data.singer.map(res => res.name).join('-'),//歌手名称
        singer      :data.singer,//歌手
        songname    :data.songname,//歌曲名称
        songorig    :data.songorig,
        songmid     :data.songmid,
        songid      :data.songid,//歌曲id
        pay         :data.pay,
        payplay     :data.pay.payplay === 1 && data.pay.payalbumprice !== 0,//是否需要购买才能播放
        now         :Date.now(),//创建时间

        albumisrc   :`http://imgcache.qq.com/music/photo/album_300/${data.albumid%100}/300_albumpic_${data.albumid}_0.jpg`,//专辑封面
        albumid     :data.albumid,//专辑id
        albummid    :data.albummid,
        albumname   :data.albumname,//专辑名称
    }
}

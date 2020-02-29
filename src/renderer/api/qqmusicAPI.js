import axios from 'axios';
import request from 'request'
import Base64 from 'js-base64';
/**
 * [qqMusicSearchAPI description]
 * @param  {[type]} searchStr [description]
 * @return {[type]}           [description]
 */
export function qqMusicSearchAPI(searchStr){
    /**
     * http://s.music.qq.com/fcgi-bin/music_search_new_platform?t=0& amp;n={2}
     * &aggr=1&cr=1&loginUin={3}
     * &format=json&inCharset=GB2312&outCharset=utf-8&notice=0&platform=jqminiframe.json&needNewCode=0&p={1}
     * &catZhida=0&remoteplace=sizer.newclient.next_song&w={0}
     * {0}=需要搜索的歌曲或歌手 {1}=查询的页码数 {2}=当前页的返回数量 {3}=默认为0,是登录的QQ号ID
     * */
    // https://c.y.qq.com/soso/fcgi-bin/client_search_cp?ct=24&qqmusic_ver=1298&new_json=1&remoteplace=txt.yqq.song&searchid=63366293973884427&t=0&aggr=1&cr=1&catZhida=1&lossless=0&flag_qc=0&p=1&n=20&w=%E6%9D%8E%E8%8D%A3%E6%B5%A9&g_tk=940106057&loginUin=821470904&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&ct=24&needNewCode=0
    let requestParamsAPI_A = {
        url     :'https://c.y.qq.com/soso/fcgi-bin/client_search_cp',
        method  :'GET',
        params  :{
            g_tk        :'5381',
            uin         :'0',
            format      :'json',
            inCharset   :'utf-8',
            outCharset  :'utf-8',
            notice      :'0',
            platform    :'h5',
            needNewCode :'1',
            w           :searchStr,
            zhidaqu     :'1',
            catZhida    :'1',
            t           :'0',
            flag        :'1',
            ie          :'utf-8',
            sem         :'1',
            aggr        :'0',
            perpage     :'10',
            n           :'20',
            p           :'1',
            remoteplace :'txt.mqq.all',
            _           :new Date().getTime()
        }
    };
    let requestParamsAPI_B = {
        url     : 'http://s.music.qq.com/fcgi-bin/music_search_new_platform',
        method  : 'GET',
        params  : {
            t           : 0,
            " amp;n"    : 10,
            aggr        : 1,
            cr          : 1,
            loginUin    : 0,
            format      : 'json',
            inCharset   : 'GB2312',
            outCharset  : 'utf-8',
            notice      : 0,
            platform    : 'jqminiframe.json',
            needNewCode : 0,
            p           : 1,
            catZhida    : 0,
            remoteplace : 'sizer.newclient.next_song',
            w           : searchStr,
        }
    };
    return axios(requestParamsAPI_A)
}

/**
 * [qqMusicListAPI description]
 * @return {[type]} [description]
 */
export function qqMusicListAPI(){
    return axios({
        url     :'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg',
        method  :'get',
        params  :{
            g_tk        :'5381',
            uin         :'0',
            format      :'json',
            inCharset   :'utf-8',
            notice      :'0',
            platform    :'h5',
            needNewCode :'1',
            tpl         :'3',
            page        :'detail',
            type        :'top',//巅峰榜
            topid       :'26',//33:歌手2018,32:音乐人,31:微信分享,30:梦想的声音,29:影视金曲,28:网络歌曲,27:新歌,26:热歌，25:中国新歌声,
            _           :new Date().getTime()
        }
    })
}

/**
 * [qqMusicLyricAPI description]
 * @param  {[type]} songId [description]
 * @return {[type]}        [description]
 */
export function qqMusicLyricAPI(songId){
    let url = "https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?callback=MusicJsonCallback_lrc&pcachetime=1494070301711&songmid="+songId+"&g_tk=5381&jsonpCallback=MusicJsonCallback_lrc&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8¬ice=0&platform=yqq&needNewCode=0";
    let options = {
        url     : url,
        headers : {
            "User-Agent"        : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.110 Safari/537.36",
            "Accept"            : "*/*",
            "Referer"           : "https://y.qq.com/portal/player.html",
            "Accept-Language"   : "zh-CN,zh;q=0.8",
            "Cookie"            : "pgv_pvid=8455821612; ts_uid=1596880404; pgv_pvi=9708980224; yq_index=0; pgv_si=s3191448576; pgv_info=ssid=s8059271672; ts_refer=ADTAGmyqq; yq_playdata=s; ts_last=y.qq.com/portal/player.html; yqq_stat=0; yq_playschange=0; player_exist=1; qqmusic_fromtag=66; yplayer_open=1",
            "Host"              : "c.y.qq.com",
        }
    };
    return new Promise((resolve,reject) => {
        request(options, (error, response, body) => {
            if(!error && response.statusCode === 200){
                // 解码歌词
                let data = JSON.parse(body.match(/\{(.+?)\}/g)[0]);
                let decodelyric = Base64.Base64.decode(data.lyric);
                let reslyric;
                try {
                    reslyric = decodelyric.split("[offset:0]")[1].split('\n');
                } catch (e) {
                    reslyric = [];
                } finally {
                    resolve(reslyric);
                }
            }else{
                console.log("error");
                reject(error);
            }
        });
    })
}


/**
 * [qqMusicGetPlaySrcAPI description]
 * @param  {[type]} songId [description]
 * @return {[type]}        [description]
 */
export function qqMusicGetPlaySrcAPI(songId) {
    const urlParams = {
        "req_0":{
            "module":"vkey.GetVkeyServer",
            "method":"CgiGetVkey",
            "param":{
                "guid":"358840384",
                "songmid":[songId],
                "songtype":[0],
                "uin":"1443481947",
                "loginflag":1,
                "platform":"20"
            }
        },
        "comm":{
            "uin":"18585073516",
            "format":"json",
            "ct":24,
            "cv":0
        }
    };
    return axios({
        url: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
        method: 'get',
        params: {
            format: 'json',
            data: urlParams
        }
    }).then(({ data = {} }) => {
        const { req_0: { data: { sip = [], midurlinfo = [] } } } = data;
        const [url1, url2] = sip;
        const { purl } = midurlinfo[0];
        return `${url1}${purl}`;
    })
}


export function qqMusicMvInfoAPI(mvId) {
    const data = {
        comm: {
            ct: 24,
            cv: 4747474
        },
        getMVUrl: {
            module: "gosrf.Stream.MvUrlProxy",
            method: "GetMvUrls",
            param: {
                vids: [mvId],
                request_typet: 10001
            }
        },
        mvinfo: {
            module: "video.VideoDataServer",
            method: "get_video_info_batch",
            param: {
                vidlist: [mvId],
                required: [
                    "vid",
                    "type",
                    "sid",
                    "cover_pic",
                    "duration",
                    "singers",
                    "video_switch",
                    "msg",
                    "name",
                    "desc",
                    "playcnt",
                    "pubdate",
                    "isfav",
                    "gmid"
                ]
            }
        },
        other: {
            module: "video.VideoLogicServer",
            method: "rec_video_byvid",
            param: {
                vid: mvId,
                required: [
                    "vid",
                    "type",
                    "sid",
                    "cover_pic",
                    "duration",
                    "singers",
                    "video_switch",
                    "msg",
                    "name",
                    "desc",
                    "playcnt",
                    "pubdate",
                    "isfav",
                    "gmid",
                    "uploader_headurl",
                    "uploader_nick",
                    "uploader_encuin",
                    "uploader_uin",
                    "uploader_hasfollow",
                    "uploader_follower_num"
                ],
                support: 1
            }
        }
    };
    return axios({
        url: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
        method: 'get',
        params: {
            format: 'json',
            data: JSON.stringify(data),
        },
        // headers: {
        //     referer: 'https://y.qq.com/portal/player.html',
        //     host: 'u.y.qq.com',
        //     'content-type': 'application/x-www-form-urlencoded',
        // },
        g_tk: 1124214810,
        loginUin: 0,
        hostUin: 0,
        inCharset: 'utf8',
        outCharset: 'utf-8',
        // format: 'json',
        notice: 0,
        platform: 'yqq.json',
        needNewCode: 0,
    }).then(({ data: { getMVUrl } }) => {
        const { data: { [mvId]: { mp4 } } } = getMVUrl;
        return mp4
    })
}

export function qqMusicMvListAPI() {
    return axios({
        url: 'https://c.y.qq.com/mv/fcgi-bin/getmv_by_tag',
        method: 'get',
        params: {
            format: 'json',
            outCharset: 'GB2312',
            cmd: 'shoubo',
            lan: 'all'
        },
        g_tk: 1124214810,
        loginUin: 0,
        hostUin: 0,
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq.json',
        needNewCode: 0,
        // headers: {
        //     referer: 'https://c.y.qq.com/',
        //     host: 'c.y.qq.com'
        // }
    }).then(({ data: { data: { mvlist = [] } } }) => mvlist)
}

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const superagent = require('superagent');
const { mapLimit, waterfall } = require('async');
const { fetch, get_sign } = require('./config/utils');
const { statUrl, appkey, appsec, video_info_url, header } = require('./config/index');
let video_info_url_params = {
    cid: null,
    appkey: appkey,
    otype: 'json',
    type: '',
    quality: 112,
    qn: 112
}
let vudeoList = [];
const isFile = file => fs.lstatSync(file).isFile();
const isDir = file => fs.lstatSync(file).isDirectory();
const root =  '.'|| process.argv[2];
const dirname = root  + `/bilibili`;
let isDownload = false;

function getVideoInfo(data, download = false) {
    if(data[0] === ''){
        console.log('视频链接不能为空');
        return
    }

    isDownload = download;
    mapLimit(data,2,
        Brush,
        (err,result) => {
            console.log('视频信息检索完毕,视频保存地址.' + dirname)
        })
};

function Brush(temp, callback) {
    let option = {};
    if(typeof temp === 'object') {
        option = temp;
    } else {
        option.aid = temp;
    }
    const speed =  Math.ceil(Math.random(100) * 500 + 500);
    let time;
    console.log(`${speed}毫秒后开始获取数据！`)
    time = setTimeout(() => {
        console.log(`开始获取视频信息：`, option.aid)
        clearTimeout(time);
        waterfall([
            (next) => {
                // 获取 cid
                fetch('https://www.bilibili.com/video/av' + option.aid)
                    .then(({text}) => {
                        const $ = cheerio.load(text)
                        const urlInfo = JSON.parse($('script')[3].children[0].data.split(';(')[0].substring(25));
                        next(null, urlInfo);
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            },
            (urlInfo, next) =>{
                downFile(option, urlInfo, (videoSinger) => {
                    next(null,urlInfo, videoSinger)
                })
            },
        ], function (err, urlInfo, videoSinger) {
            let data = {};

            if(typeof temp === 'object'){
                data.title = option.title;
                data.pic = option.pic;
                data.duration = option.duration;
            }

            data = Object.assign({}, data, urlInfo, videoSinger);
            vudeoList.push(data);
            console.log(`视频数据处理完毕：`, option.arcurl);
            callback(null, data);
        });
    }, speed);
}

function downFile(object,video ,cb) {

    mapLimit(video.videoData.pages,4,
        (videoInfo, fallback) => {
            waterfall([
                (next) =>{
                    video_info_url_params.cid = videoInfo.cid;
                    const url = video_info_url + get_sign(video_info_url_params, appsec);
                    fetch(url)
                        .then(({body}) => {
                            next(null, body);
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                },
                // 下载
                (videoSinger,next) => {
                    const videoUrl = videoSinger.durl[0];
                    if(isDownload) {
                        if (!fs.existsSync(dirname)) {
                            fs.mkdirSync(dirname);
                        }
                        const file = fs.createWriteStream(path.resolve(dirname, `./${`${video.videoData.title} - ${videoInfo.part }-${videoInfo.cid}`}.flv`))
                        console.log(`视频下载开始`, `${video.videoData.title}-${videoInfo.part}`);
                        superagent
                            .get(videoUrl.url)
                            .set(header)
                            .pipe(file)
                        file.on('finish', function () {
                            console.log(`视频下载完毕`, `${video.videoData.title}-${videoInfo.part}`);
                            next(null, videoSinger);
                        })
                    }else{
                        next(null,videoSinger);
                    }
                }
            ], function (err, videoSinger) {
                fallback(null, videoSinger)
            })
    },
        (err, videoSinger) => {
            cb(video, videoSinger)
        });
}
module.exports = getVideoInfo;
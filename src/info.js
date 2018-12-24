const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const superagent = require('superagent');
const { mapLimit, waterfall } = require('async');
const ProgressBar = require('progress');
const { fetch, get_sign, percent, Progress } = require('./config/utils');
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
    mapLimit(data,10,
        Brush,
        (err,result) => {
            console.log('视频信息检索完毕,视频保存地址.' +process.cwd() + dirname);
            const file = dirname + `./${result[0].videoData.title || 'info'}.json`;
            fs.writeFileSync(file,`{"data": ${JSON.stringify(vudeoList)},}` , 'utf-8')
            console.log('文件写入完毕.')
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
                    .then(async({text}) => {
                        const $ = await cheerio.load(text)
                        const dataStr = $('script')[3].children[0].data;
                        const data = dataStr.split(';(function')[0].substring(25);
                        const urlInfo = JSON.parse(data);
                        next(null, urlInfo);
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            },
            (urlInfo, next) =>{
                if(isDownload){
                    downFile(option, urlInfo, (videoSinger) => {
                        next(null,urlInfo, videoSinger)
                    })
                }else{
                    next(null,urlInfo, {})
                }
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
            console.log(`视频数据处理完毕：`, option.aid);
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
                    let size = undefined,
                        chunks = 0;

                    if (!fs.existsSync(dirname)) {
                        fs.mkdirSync(dirname);
                    }

                    const file = fs.createWriteStream(path.resolve(dirname, `./${`${video.videoData.title} - ${videoInfo.part }-${videoInfo.cid}`}.flv`))
                    const title = `${video.videoData.title}-${videoInfo.part}`

                    console.log(`视频下载开始`, title);
                    superagent
                        .get(videoUrl.url)
                        .set(header)
                        .on('response', (response) => {
                            size = parseInt(response.headers['content-length'], 10);;
                            const bar = new ProgressBar(`  ${title} [:bar] :rate/bps :percent :etas`, {
                                complete: '=',
                                incomplete: ' ',
                                width: 20,
                                total: size
                            });
                            response.on('data', function(chunk) {
                                bar.tick(chunk.length);
                                // chunks += chunk.length;
                                // percent(chunks / size)
                                // Progress(`${title}下载进度`, { completed: chunks, total: size })
                            });
                        })
                        .pipe(file)
                    file.on('finish', function () {
                        console.log(`视频下载完毕`, title);
                        next(null, videoSinger);
                    })
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

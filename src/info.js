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
const dirname = `./data/video/`;
let isDownload = false;

function getVideoInfo(data, name, download = false) {
    if(data[0] === ''){
        console.log('视频链接不能为空');
        return
    }
    if(typeof data[0] !== 'object'){
        if(!/^https:\/\/www\.bilibili\.com\/video\/av[0-9]+/.test(data[0])){
            console.log('输入链接不正确！')
            return
        }
    }

    isDownload = download;
    mapLimit(data,2,
        Brush,
        (err,result) => {
            const file = `./data/${name || 'info'}.json`;
            console.log('视频信息检索完毕,开始写入文件.' + file)
            if(fs.existsSync(file) && fs.statSync(file).isFile()){
                let rendFile = JSON.parse(fs.readFileSync(file, 'utf-8'));
                let rendFileLength = Object.keys(rendFile) || 'data'
                 rendFile[rendFileLength[rendFileLength.length - 1] +=1] = vudeoList;
                fs.writeFileSync(file,`${JSON.stringify(rendFile)}` , 'utf-8')
            } else {
                fs.writeFileSync(file,`{"data": ${JSON.stringify(vudeoList)},}` , 'utf-8')
            }
            console.log('文件写入完毕.')
        })
};

function Brush(temp, callback) {
    let option = {};
    if(typeof temp === 'object') {
        option = temp;
    } else {
        option.arcurl = temp;
    }
    const speed =  Math.ceil(Math.random(100) * 500 + 500);
    let time;
    console.log(`${speed}毫秒后开始获取数据！`)
    time = setTimeout(() => {
        console.log(`开始获取视频信息：`, option.arcurl)
        clearTimeout(time);
        waterfall([
            (next) => {
                // 获取 cid
                fetch(option.arcurl)
                    .then(({text}) => {
                        const $ = cheerio.load(text)
                        const urlInfo = JSON.parse($('script')[2].children[0].data.split(';(')[0].substring(25));
                        next(null, urlInfo);
                    })
            },
            (urlInfo, next) =>{
                fetch(statUrl + option.aid)
                    .then(({body}) => {
                        next(null,urlInfo, body.data);
                    })
            },
            (urlInfo,videoInfo,next) =>{
                video_info_url_params.cid = urlInfo.videoData.pages[0].cid;
                const url = video_info_url + get_sign(video_info_url_params, appsec);
                fetch(url)
                    .then(({body}) => {
                        next(null,urlInfo,videoInfo,body);
                    })
            },
            // 下载
            (urlInfo, videoInfo, videoSinger, next) => {
                const videoUrl = videoSinger.durl[0];
                if(isDownload) {
                    if (!fs.existsSync(dirname)) {
                        fs.mkdirSync(path.resolve(dirname));
                    }
                    var file = fs.createWriteStream(path.resolve(dirname, `./${urlInfo.aid}.flv`))
                    console.log(`视频下载开始`, option.arcurl)
                    const req = superagent
                        .get(videoUrl.url)
                        .set(header)
                        .pipe(file)
                    file.on('finish', function () {
                        console.log(`视频下载完毕`, option.arcurl)
                        next(null, urlInfo, videoInfo, videoSinger);
                    })
                }else{
                    next(null, urlInfo, videoInfo, videoSinger);
                }
            }
        ], function (err, urlInfo, videoInfo, videoSinger) {
            let data = {
                arcurl: option.arcurl,
            };

            if(typeof temp === 'object'){
                data.title = option.title;
                data.pic = option.pic;
                data.duration = option.duration;
            }

            data = Object.assign({}, data, videoInfo, urlInfo, videoSinger);
            vudeoList.push(data);
            console.log(`视频数据处理完毕：`, option.arcurl);
            callback(null, data);
        });
    }, speed);
};
// getVideoInfo(['https://www.bilibili.com/video/av24249698', "https://www.bilibili.com/video/av23018784"], 'info', true)
module.exports = getVideoInfo;
const fs = require('fs');
const path = require('path');
const request = require('request');
const { header } = require('../src/config');
const { percent, ProgressBar } = require('../src/config/utils');
const superagent = require('superagent');
const dirname = `/demo/bi/data/video/`;
const url = "http://bubble-img.oss-cn-hangzhou.aliyuncs.com/2018-9/bubble-img/1537170312464.jpg";
file = fs.createWriteStream(path.resolve(dirname, `./121231233.jpg`))

let size = undefined,
    chunks = 0;
superagent
    .get(url)
    .set(header)
    .on('response', (response) => {
        size = response.headers['content-length'];
        response.on('data', function(chunk) {
            chunks += chunk.length;
            percent(chunks / size)
            ProgressBar('下载进度', { completed: chunks, total: size })
        });
    })
    .pipe(file)

// if (!fs.existsSync('E:/biilibili')) {
//     fs.mkdirSync('E:/biilibili');
// }
// if (!fs.existsSync('E:/biilibili/video')) {
//     fs.mkdirSync('E:/biilibili/video');
// }
// new Promise((resolve, reject) => {
//
//     if(body){
//         resolve()
//     }else{
//         throw 'null body'
//         reject()
//     }
// }).catch((err) => {
//     console.log(err)
// })
const fs = require('fs');
const path = require('path');
const request = require('request');
const { header } = require('../config/index');

const dirname = `../data/video/`;
console.log()
var file=fs.createWriteStream(path.resolve(dirname, `./121231233.flv`))
// request({url:}).pipe(file);
var readStream = request({
    url:  "http://ws.acgvideo.com/b/41/41934463-1-32.flv?wsTime=1529660644&platform=pc&wsSecret2=654bcaca7f5c2c5c6bb30bed56067cf2&oi=1944849450&rate=224&trid=b96ffed456a84cbe81bb9f0f5ec9e47c",
    header:header
})
readStream.pipe(file)
file.on('finish', function () {
    console.log('视频下载完毕')
})
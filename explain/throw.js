const fs = require('fs');
const path = require('path');
const request = require('request');
const { header } = require('../src/config');
const superagent = require('superagent');
const dirname = `./data/video/`;
const url = "http://upos-hz-mirrorcos.acgvideo.com/upgcxcode/18/83/43108318/43108318-1-32.flv?um_deadline=1530614578&platform=pc&rate=261800&oi=1604916169&um_sign=192ba77df359a35cbb14dfca06a046ec&gen=playurl&os=cos&trid=9d0986eda6f9474da7bc548a4560b1bd",
file = fs.createWriteStream(path.resolve(dirname, `./121231233.flv`))

const req = superagent
    .get(url)
    .set(header)
    .pipe(file)

file.on('finish', function () {
    console.log('视频下载完毕')
})

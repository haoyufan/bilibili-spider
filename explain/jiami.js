var crypto=require('crypto');
var md5=crypto.createHash("md5");
const fs = require('fs');
const superagent = require('superagent');

// data = [{1:'a'},{1:'a'},{1:'a'},{1:'a'}];
// data.forEach((item) => {
//     fs.writeFileSync('./videoInfo.json', `{"data": ${JSON.stringify(data)}}`, 'utf-8')
// })

function get_sign(params, key) {
    var s_keys = [];
    for (var i in params)
    {
        s_keys.push(i);
    }
    s_keys.sort();
    var data = "";
    for (var i = 0; i < s_keys.length; i++)
    {
        // encodeURIComponent 返回的转义数字必须为大写( 如 %2F )
        data+=(data ? "&" : "")+s_keys[i]+"="+(params[s_keys[i]]);
    }
    md5.update(data + key)
    return {
        sign:md5.digest('hex'),
        data,
    };
}
const params = {
    appkey: '84956560bc028eb7',
    cid:36647243,
    otype: 'json',
    quality: 0,
    qn: 0,
    type: '',
}
console.log(get_sign(params, '94aba54af9065f71de72f5508f1cd42e'))
// const header = {
//     "User-Agent": 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3236.0 Safari/537.36',
//     'origin': 'https://www.bilibili.com'
// }
// superagent
//     .get(`https://api.bilibili.com/x/web-interface/archive/stat?aid=22157319`)
//     .set(header)
//     .set('Referer', `https://interface.bilibili.com/v2/playurl?${params.data}&sign=${params.sign}`)
//     .then(({body}) => {
//         console.log(body.data)
//     })


// b.durl.forEach(function(b) {
//     var d = b.url
//         , f = [];
//     c && -1 !== d.indexOf("acgvideo.com") && (n = "https",
//         d = d.replace("http://", "https://"));
//     b.backup_url && b.backup_url.forEach(function (b) {
//         c && b.indexOf("acgvideo.com") && (n = "https",
//             b = b.replace("http://", "https://"));
//         f.push(b)
//     });
//     var e = {};
//     e.duration = b.length;
//     e.filesize = b.size;
//     e.url = d;
//     e.backupURL = f;
//     l.segments.push(e);
//     l.duration += e.duration
// })
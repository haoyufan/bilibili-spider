const md5=require('md5');
// var crypto=require('crypto');
// var md5=crypto.createHash("md5");
const superagent = require('superagent');
const { header } = require('./index');

module.exports.fetch = async function fetch(url) {
    return await superagent
        .get(url)
        .set(header)
        .set('Referer', url)
};

module.exports.get_sign = (params, key) => {
    let s_keys = [];
    for (let i in params){
        s_keys.push(i);
    }
    s_keys.sort();
    let data = "";
    for (let i = 0; i < s_keys.length; i++)
    {
        // encodeURIComponent 返回的转义数字必须为大写( 如 %2F )
        data+=(data ? "&" : "")+s_keys[i]+"="+(params[s_keys[i]]);
    }
    // md5.update(data+key);
    // const sign = md5.digest('hex');
    return data + '&sign=' + md5(data+key);
}
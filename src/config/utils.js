const md5=require('md5');
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

module.exports.Progress = function ProgressBar(name, opts){
    // 两个基本参数(属性)
    const description = name || 'Progress';       // 命令行开头的文字信息
    const length = 25;                     // 进度条的长度(单位：字符)，默认设为 25

    const percent = (opts.completed / opts.total).toFixed(4);    // 计算进度(子任务的 完成数 除以 总数)
    const cell_num = Math.floor(percent * length);             // 计算需要多少个 █ 符号来拼凑图案

    // 拼接黑色条
    let cell = '';
    for (let i=0;i<cell_num;i++) {
        cell += '█';
    }

    // 拼接灰色条
    let empty = '';
    for (let i=0;i<length - cell_num;i++) {
        empty += '░';
    }

    // 拼接最终文本
    const cmdText = description + ': ' + (100*percent).toFixed(2) + '% ' + cell + empty + ' ' + opts.completed + '/' + opts.total;
    // 在单行输出文本
    console.log(cmdText)
};

exports.percent = function(num) {
    num = (num * 100).toString();
    if (num.indexOf('.') > -1) {
        num = Number(num).toFixed(2);
    }
    return num;
}

/**
 * Author: silence
 * Create Time: 2018-09-19 13:17
 * Description:
 */
/**
 * 单行内容输出效果。
 */
const MOVE_LEFT = new Buffer('1b5b3130303044', 'hex').toString();
const MOVE_UP = new Buffer('1b5b3141', 'hex').toString();
const CLEAR_LINE = new Buffer('1b5b304b', 'hex').toString();

/**
 * 借助一个第三方的计算字符串长度的模块。
 */
const stringwidth = require('string-width');

module.exports = function(stream) {
    var write = stream.write;
    var str;

    stream.write = function(data) {
        if(str && data!== str) str = null;
        return write.apply(this, arguments);
    };

    if(stream === process.stderr || stream === process.stdout) {
        process.on('exit', ()=>{
            if(str!==null) stream.write('');
        });
    }

    var prevLineCount = 0;
    var log = function(){
        str = '';
        var nextstr = Array.prototype.join.call(arguments, ' ');

        // 清屏
        for(var i =0; i < prevLineCount; i++) {
            str += MOVE_LEFT + CLEAR_LINE + (i < prevLineCount-1?MOVE_UP:'');
        }

        // 更新实际内容
        str += nextstr;
        stream.write(str);

        // 下行要删除多少行内容
        var prevLines = nextstr.split('\n');
        prevLineCount = 0;
        for(var i = 0; i < prevLines.length; i++) {
            prevLineCount += Math.ceil(stringwidth(prevLines[i]) / stream.columns) || 1;
        }
    };

    log.clear = function() {
        stream.write('');
    };

    return log;
};

/**
 * 对外提供接口。
 */
module.exports.stdout = module.exports(process.stdout);
module.exports.stderr = module.exports(process.stderr);
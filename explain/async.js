const { mapLimit, waterfall } = require('async');
let num = 23018784;
let urls=[];
for(let i=0;i<10;i++){
    urls.push(`https://www.bilibili.com/video/av${num++}`);
}

let arr = []
// mapLimit(urls,2,
//     (url, callback) => {
//         console.log('BILI:',url)
//         callback(null, url)
//     },
//     (err,result) => {
//         console.log(result)
//     })

waterfall([
    function(next){
        next(null,['one', 'two'] );
    },
    function(arg1, next){
        next(null,arg1, 'three');
    },
    function(arg2,arg3,next){
        // arg1 now equals 'three'
        next(null,arg2,arg3, 'done');
    }
], function (err, result, arg1, arg2) {
    console.log(arguments)
    // result now equals 'done'
});
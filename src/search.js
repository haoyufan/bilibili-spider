const { fetch, get_sign } = require('./config/utils');
const { searchUrl } = require('./config/index');
const getVideoInfo = require('./info');
let page = 1;
let keyWord= ''; // 关键字
let searchLink =`${searchUrl}&page=${page}&keyword=`;
let searchListData = [];
let isDownload = false;

async function SearchList(url) {
    url += encodeURIComponent(keyWord);
    console.log(`正在搜索${keyWord}列表第${page}页`);
    let result =  await fetch(url)
    result = result.body;
    if(result.code !== 0 ){
        return console.error(result.msg)
    }
    let body = result.data;
    if(page < body.numPages){
        const speed =  Math.ceil(Math.random(100) * 500 + 500);
        let time;
        searchListData = searchListData.concat(body.result)
        page ++;
        console.log(`${speed}毫秒后开始搜索第${page}页`)
        setTimeout(() =>{
            SearchList(searchLink)
        }, speed)
    } else {
        console.log(`搜索列表获取完成，总共${searchListData.length}条`)
        console.log('5秒钟后开始获取视频信息')
        const time = setTimeout(() => {
            getVideoInfo(searchListData, keyWord, isDownload)
        }, 5000)
        return
    }
};

function Search(Word, download) {
    if(Word === ''){
        return console.log('关键词不能为空')
    }
    isDownload = download || false;
    keyWord = Word;
    console.log(`搜索列表${keyWord}`)
    SearchList(searchLink);
}

// Search('白止', false);

module.exports = Search;

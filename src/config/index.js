const userAgents = require('./userAgent');
const sort = {
    '最多点击': 'click',
    '最新发布': 'pubdate',
    '最多弹幕': 'dm',
    '最多收藏': 'stow',
}
module.exports = {
    header: {
        "User-Agent": userAgents[parseInt(Math.random() * userAgents.length)],
        'origin': 'https://www.bilibili.com',
        'Connection': 'keep-alive',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://www.bilibili.com/'
    },
    quality_display_names: {
        112: '高清 1080P+',
        80: '高清 1080P',
        64: '高清 720P',
        48: '高清 720P',
        32: '清晰 480P',
        16: '流畅 360P',
        0: '自动',
    },
    statUrl: 'https://api.bilibili.com/x/web-interface/archive/stat?aid=',
    video_info_url: 'https://interface.bilibili.com/v2/playurl?',
    appkey: '84956560bc028eb7',
    appsec: 'fdff75e5dda5a94d03aa77abf7ee7c81',
    searchUrl: `https://api.bilibili.com/x/web-interface/search/type?search_type=video&jsonp=jsonp&order=${sort['最多点击']}&duration=0&tids=0&highlight=1`,
    list: 'https://api.bilibili.com/x/player/pagelist?jsonp=jsonp&aid='
}
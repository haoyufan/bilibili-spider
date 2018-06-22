const inquirer = require('inquirer')
const info = require('./src/info');
const search = require('./src/search');

inquirer.prompt([
    {
        type: 'list',
        message: '搜索列表or获取视频信息:',
        name: 'keyWord',
        choices: ['搜索', '视频信息'],
    }
]).then(function (answers) {
    if (answers.keyWord === '搜索') {
        // 搜索
        inquirer.prompt([
            {
                type: 'input',
                message: '请输入关键词:',
                name: 'keyWord',
            },
            {
                type: 'confirm',
                message: '是否下载:',
                name: 'download',
            }
        ]).then(function (searchInquirer) {
            search(searchInquirer.keyWord, searchInquirer.download)
        })
    }else{
        console.log('输入url链接, 多个之间“,”隔开(ps："https://www.bilibili.com/video/av170001")')
        // 获取单个
        inquirer.prompt([
            {
                type: 'input',
                message: '输入url链接',
                name: 'url',
            },
            {
                type: 'input',
                message: '输入文件名称',
                name: 'fileName',
            },
            {
                type: 'confirm',
                message: '是否下载:',
                name: 'download',
            }
        ]).then(function (infoInquirer) {
            let url = infoInquirer.url.split(',');
            info(url, infoInquirer.fileName, infoInquirer.download)
        })
    }
})

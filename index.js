const inquirer = require('inquirer');
const info = require('./src/info');
const search = require('./src/search');
const { debug } = require('yargs')
    .describe('debug', 'debug ci')
    .argv;

const list = [{
    type: 'list',
    message: '搜索列表or获取视频信息:',
    name: 'keyWord',
    choices: ['搜索', '视频信息'],
}];

const searchList = [
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
];

const infoList = [
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
];
const node_env = process.env.NODE_ENV;

if(node_env === 'development' || !!debug){
    info(["https://www.bilibili.com/video/av22327921"], 'info', true)
}else {
    inquirer.prompt(list)
        .then(function (answers) {
            if (answers.keyWord === '搜索') {
                // 搜索
                inquirer.prompt(searchList).then(function (searchInquirer) {
                    search(searchInquirer.keyWord, searchInquirer.download)
                })
            }else{
                console.log('输入url链接, 多个之间“,”隔开(ps："https://www.bilibili.com/video/av170001")')
                // 获取单个
                inquirer.prompt(infoList)
                    .then(function (infoInquirer) {
                        let url = infoInquirer.url.split(',');
                        info(url, infoInquirer.fileName, infoInquirer.download)
                    })
            }
        })
}

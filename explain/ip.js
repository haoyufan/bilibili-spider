const { fetch } = require('./config/utils');
fetch('http://fw.qq.com/ipaddress')
    .then(({text}) => {
        fetch(`http://ip.taobao.com/service/getIpInfo.php?ip=${text.substring(24,37)}`)
            .then(({text}) => {
                console.log(text)
            })
    })
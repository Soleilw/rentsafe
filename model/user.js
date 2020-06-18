var api = require('../api/index')
var user = {}
// 手机号登录
user.login = function(code, iv, encryptedData) {
    return new Promise((resolve, reject) => {
        api.post(api.baseUrl.host, api.url.Login, {
            code: code,
            iv: iv,
            encryptedData: encryptedData
        }, function(response) {
            if(response.msg === 'ok') {
                var res = response.data
                resolve(res);
            } else {
                reject(response);
            }
        })
    })
}

module.exports = user;
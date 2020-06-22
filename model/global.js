var api = require('../api/index')
var global = {}
// 手机号登录
global.configs = function(version) {
    return new Promise((resolve, reject) => {
        api.get(api.baseUrl.host, api.url.Configs, {
            version: version
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

module.exports = global;